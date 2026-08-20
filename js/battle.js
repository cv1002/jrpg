// ============================================================
// battle.js —— 遇敌 / 回合队列 / 技能 / 结算（不 import world / ui）
// boxMsg / drawBattle / burst* / applyVictoryWorld / loadMap ← bind.js
// ============================================================
import { S } from './state.js';
import { MON_BASE, BOSS, CAVE_BOSS, TRUE_BOSS, RUSH_BOSSES, SKILL_DATA, WEAPONS, ARMORS, CHARGE_MULT, withSpecies, baseStats } from './data.js';
import { deep, cmdDmg, elemMult, skillDefUsed, applyStats, canonicalName, monReward as monRewardAt, atkEstimate, skillEstimate } from './rules.js';
import { SFX, startBgm, stopBgm, resumeBgm } from './audio.js';
import { bind } from './bind.js';
import { goto } from './scene.js';
import { takePotion, checkSkills, applyAchievements } from './hero.js';

function scaleEnemy(template, level) {
  return {
    name: template.name,
    hp: template.hp[0] + level * template.hp[1],
    hpMax: 0,
    atk: template.atk[0] + level * template.atk[1],
    def: template.def[0] + level * template.def[1],
    xp: template.xp[0] + level * template.xp[1],
    gold: template.gold[0] + level * template.gold[1],
    color: template.color,
    poison: template.poison,
    weak: template.weak,
    resist: template.resist,
    draw: template.draw,
  };
}

function eliteEncounter() {
  const level = S.G.level;
  const enemy = withSpecies({
    name: '石心魔像',
    hp: 58 + level * 10, hpMax: 0,
    atk: 12 + level * 3, def: 15 + level * 2,
    xp: 40 + level * 6, gold: 45 + level * 6,
    color: '#6b8cb0', isElite: true,
  });
  enemy.hpMax = enemy.hp;
  return enemy;
}

function encounterWeight(name, level) {
  if (name === '史莱姆' || name === '哥布林') return Math.max(1, 4 - Math.floor(level / 2));
  if (name === '野狼') return 3;
  if (name === '骷髅兵' || name === '毒蛇') return level >= 2 ? 2 + Math.floor(level / 3) : 1;
  return level >= 3 ? 2 + Math.floor(level / 2) : 0;
}

function pickWeightedIndex(weights) {
  const total = weights.reduce((sum, w) => sum + w, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return i;
  }
  return 0;
}

function randomEncounter() {
  const level = S.G.level;
  if (S.curMap === 'dungeon' && S.G.level >= 3 && Math.random() < 0.07) return eliteEncounter();
  const pool = MON_BASE.map((m) => scaleEnemy(m, level));
  const weights = MON_BASE.map((m) => encounterWeight(m.name, level));
  const enemy = deep(pool[pickWeightedIndex(weights)]);
  if (S.curMap === 'cave') {
    enemy.hp = Math.round(enemy.hp * 1.2);
    enemy.atk = Math.round(enemy.atk * 1.15);
    enemy.def = Math.round(enemy.def * 1.1);
    enemy.xp = Math.round(enemy.xp * 1.15);
    enemy.gold = Math.round(enemy.gold * 1.15);
  } else if (S.curMap === 'village') {
    enemy.hp = Math.round(enemy.hp * 0.9);
    enemy.atk = Math.round(enemy.atk * 0.9);
  }
  enemy.hpMax = enemy.hp;
  return enemy;
}

function monReward(name) {
  return monRewardAt(name, (S.G && S.G.level) || 1);
}

function startRush() {
  S.G.rushStage = 1;
  bind.boxMsg('⚔️ 试炼开始——连战场上的三名强敌！', 2000);
  setTimeout(() => {
    if (S.scene === 'world') startBattle(deep(RUSH_BOSSES[0]));
  }, 700);
}

function addFx(x, y, text, color, bold) {
  S.fx.push({ x, y, text, color, bold, life: 44, vy: 1.5 });
}

function threatWarn() {
  const enemy = S.enemy;
  if (!enemy) return '';
  if (enemy.isTrue) return ' ⚠️⚠️ 极危：终焉之神是初灯的意志，先提升等级再战！';
  if (enemy.isBoss) return ' ⚠️ 强敌：旧灯卫的影子，注意补给与防御！';
  if (enemy.isRush) return '';
  const hero = S.G;
  const playerHit = Math.max(1, hero.atkMax * 2 - enemy.def);
  const enemyHit = Math.max(1, enemy.atk * 2 - hero.defMax);
  let threat = enemy.isElite ? 1 : 0;
  if (enemy.hpMax > playerHit * 5) threat = Math.max(threat, 1);
  if (enemyHit * 2 >= hero.hpMax) threat = Math.max(threat, 2);
  if (threat >= 2) return ' ⚠️ 强敌：它明显强于你，小心应对！';
  if (threat === 1) return ' ⚠️ 此敌有些棘手，量力而行。';
  return '';
}

function cancelBattleQueue() {
  S.battleQ.length = 0;
  S.battleAdvancing = false;
  if (S.battleTimer) {
    clearTimeout(S.battleTimer);
    S.battleTimer = null;
  }
}

function enqueue(delay, fn) {
  S.battleQ.push({ delay: delay || 0, fn });
  advanceQueue();
}

function advanceQueue() {
  if (S.battleAdvancing) return;
  if (!S.battleQ.length) {
    S.battleBusy = false;
    bind.drawBattle();
    return;
  }
  S.battleAdvancing = true;
  S.battleBusy = true;
  const step = S.battleQ.shift();
  const finish = () => {
    S.battleAdvancing = false;
    if (S.scene !== 'battle') {
      cancelBattleQueue();
      S.battleBusy = false;
      return;
    }
    advanceQueue();
  };
  const run = () => {
    try { step.fn(); }
    catch (err) { console.error(err); cancelBattleQueue(); }
    finish();
  };
  if (step.delay) S.battleTimer = setTimeout(run, step.delay);
  else run();
}

function startBattle(enemyDef) {
  cancelBattleQueue();
  S.enemy = deep(enemyDef);
  S.enemy.hpMax = enemyDef.hpMax || enemyDef.hp;
  S.G.defending = false;
  S.G.charge = false;
  S.G.poison = 0;
  S.enemy.burn = 0;
  S.enemy.skipNext = false;
  S.enemy.phased = false;
  S.enemy.forbid = null;
  if (S.G.diff) {
    S.enemy.hpMax = Math.round(S.enemy.hpMax * 1.35);
    S.enemy.atk = Math.round(S.enemy.atk * 1.15);
    S.enemy.def = Math.round(S.enemy.def * 1.12);
  }
  S.enemy.hp = S.enemy.hpMax;
  goto('battle');
  S.battleBusy = true;
  S.blog = [`⚔️ 遭遇了 ${S.enemy.name}！${threatWarn()}`];
  S.blogView = 0;
  S.battleTurn = 1;
  startBgm('battle');
  bind.renderHUD();
  bind.drawBattle();
  if (S.enemy.isBoss || S.enemy.isCaveBoss || S.enemy.isTrue || S.enemy.isRush) {
    const bossId = S.enemy.isTrue ? 'true' : S.enemy.isCaveBoss ? 'cave' : S.enemy.isBoss ? 'main' : 'rush';
    S.G._bossRetry = {
      hp: S.G.hp, mp: S.G.mp, item: S.G.item, potion2: S.G.potion2,
      gold: S.G.gold, level: S.G.level, xp: S.G.xp,
      weapon: S.G.weapon, armor: S.G.armor, name: S.enemy.name,
      x: S.G.x, y: S.G.y, curMap: S.curMap,
      chests: Array.from(S.G.chests), bossId,
    };
  }
  enqueue(700, () => {});
}

function abortAction(message) {
  S.blog.push(message);
  S.battleBusy = false;
  bind.drawBattle();
  return true;
}

function applyPoisonTick(hero) {
  if ((hero.poison || 0) <= 0) return false;
  const damage = Math.max(2, Math.round(hero.hpMax * 0.05));
  hero.hp -= damage;
  hero.poison--;
  SFX.hurt();
  bind.renderHUD();
  addFx(96, 340, '-' + damage, '#7fe08a', true);
  S.blog.push(`☠️ 毒素发作，${hero.name} 受到 ${damage} 点伤害！${hero.poison > 0 ? `（剩余 ${hero.poison} 回合）` : ''}`);
  if (hero.hp <= 0) {
    hero.hp = 0;
    bind.renderHUD();
    bind.boxMsg('💀', 0);
    loseBattle();
    return true;
  }
  return false;
}

function doAttack() {
  const hero = S.G;
  const enemy = S.enemy;
  const crit = Math.random() < 0.12;
  const charged = !!hero.charge;
  if (charged) hero.charge = false;
  bind.burstEnemy(['#fff', '#e8d8c0', '#ffd24a'], crit ? 22 : 10);
  attackMove(
    (dmg) => finishPlayer(
      `${crit ? '💥' : '🗡️'} 你发动攻击，对 ${enemy.name} 造成 <dmg> 伤害${crit ? '（暴击！）' : ''}${charged ? '（蓄力爆发！）' : ''}！`,
      dmg
    ),
    null,
    crit,
    charged ? CHARGE_MULT : 1
  );
}

function skillForbidden(skillName, skill, enemy) {
  if (!enemy.forbid) return false;
  if (skill.kind === 'heal' && enemy.forbid.includes('heal')) return true;
  return !!(skillName && enemy.forbid.includes(skillName));
}

function doSkill(skillName) {
  const hero = S.G;
  const enemy = S.enemy;
  const skill = SKILL_DATA[skillName];
  if (!hero.skills.includes(skillName)) return abortAction('❌ 尚未领悟该技能');
  if (hero.mp < skill.mp) return abortAction('❌ MP 不足！');
  if (skillForbidden(skillName, skill, enemy)) {
    SFX.cancel();
    return abortAction(`⛔ 祸乱气场封印了【${skillName}】！`);
  }
  hero.mp -= skill.mp;
  bind.renderHUD();
  const charged = !!hero.charge;
  if (charged) hero.charge = false;
  if (skill.kind === 'heal') {
    bind.burstPlayer(skill.colors, 16);
    const heal = Math.round(hero.hpMax * skill.heal);
    hero.hp = Math.min(hero.hpMax, hero.hp + heal);
    let extra = '';
    if (skill.cleanse && hero.poison > 0) {
      hero.poison = 0;
      extra = '，毒素被净化了';
    }
    SFX.heal();
    S.blog.push(`💚 ${hero.name} 使出【${skillName}】，恢复 ${heal} 点 HP${extra}${charged ? '（蓄力加持）' : ''}`);
    bind.renderHUD();
    afterPlayer();
    return;
  }
  bind.burstEnemy(skill.colors, skillName === '陨石术' ? 36 : 20);
  let mult = skill.mult * elemMult(skill, enemy);
  if (enemy.phased && skill.trueBonus) mult *= skill.trueBonus;
  if (charged) mult *= CHARGE_MULT;
  const defSave = enemy.def;
  enemy.def = skillDefUsed(skill, enemy);
  attackMove((dmg) => {
    let note = '';
    if (skill.burn) { enemy.burn = (enemy.burn || 0) + skill.burn; note += '（灼烧）'; }
    if (skill.skip && Math.random() < skill.skip) { enemy.skipNext = true; note += '（冻结！）'; }
    if (skill.breakShield && (enemy.shield || 0) > 0) {
      enemy.shield = Math.max(0, enemy.shield - skill.breakShield);
      note += '（石甲碎裂）';
    }
    if (elemMult(skill, enemy) > 1) note += '（弱点）';
    if (elemMult(skill, enemy) < 1) note += '（抗性）';
    finishPlayer(`✨ ${hero.name} 使出【${skillName}】，造成 <dmg> 伤害${note}${charged ? '（蓄力）' : ''}！`, dmg);
  }, skill.sfx, false, mult);
  enemy.def = defSave;
  return true;
}

function doItem() {
  const hero = S.G;
  const hpFull = hero.hp >= hero.hpMax;
  const mpFull = hero.mp >= hero.mpMax;
  const strongOk = hero.potion2 > 0 && (!hpFull || !mpFull);
  const weakOk = hero.item > 0 && !hpFull;
  if (!strongOk && !weakOk) {
    return abortAction(hpFull && mpFull ? '✅ 你气满神足，无需用药！' : '❌ 没有可用的药水了！');
  }
  const result = takePotion();
  SFX.heal();
  bind.renderHUD();
  S.blog.push(
    result.strong
      ? `🧪 ${hero.name} 服下高级灵药，恢复 ${result.h} HP、${result.m} MP`
      : `🍖 ${hero.name} 服用药水，恢复 ${result.h} 点 HP`
  );
  afterPlayer();
}

function doDefend() {
  const hero = S.G;
  hero.defending = true;
  SFX.block();
  const mp = Math.min(hero.mpMax, hero.mp + 2);
  const gained = mp - hero.mp;
  hero.mp = mp;
  bind.renderHUD();
  S.blog.push(`🛡️ ${hero.name} 摆出防御架势，本回合受到的伤害减半${gained > 0 ? `，并恢复 ${gained} 点 MP` : ''}！`);
  afterPlayer();
}

function doCharge() {
  const hero = S.G;
  const enemy = S.enemy;
  if (enemy.forbid && enemy.forbid.includes('charge')) {
    SFX.cancel();
    return abortAction('⛔ 气场压制，无法蓄力！');
  }
  hero.charge = true;
  SFX.block();
  S.blog.push(`⚡ ${hero.name} 凝神蓄力：下一次【攻击或技能】威力 ×${CHARGE_MULT}！`);
  afterPlayer();
}

function doFlee() {
  const hero = S.G;
  const enemy = S.enemy;
  if (enemy.isBoss || enemy.isTrue || enemy.isCaveBoss || enemy.isRush) {
    // 气场压制：本回合行动保留——不调度敌方行动、立即释放战斗回合（回归 v2.2/v1.37 既定设计「battleBusy 释放、不调度 enemyAct」；
    // 此前误调 afterPlayer() 会让「按 4 逃跑 = 白送回合挨 Boss 打」，与指令栏 ⛔「别按 4」的提示矛盾。普通怪逃跑行为完全不变）
    S.blog.push(`⚠️ ${enemy.name} 的气场压制着你，无法逃脱！（本回合行动保留）`);
    SFX.cancel();
    S.battleBusy = false;
    bind.drawBattle();
    return true;
  }
  if (Math.random() < 0.6) {
    S.blog.push('🏃 成功逃脱了！');
    SFX.select();
    hero.charge = false;
    hero.poison = 0;
    cancelBattleQueue();
    goto('world');
    S.enemy = null;
    S.battleBusy = false;
    resumeBgm();
    return true;
  }
  S.blog.push('❌ 逃脱失败！');
  SFX.cancel();
  afterPlayer();
}

const PLAYER_ACTIONS = {
  attack: doAttack,
  skill: doSkill,
  item: doItem,
  defend: doDefend,
  charge: doCharge,
  flee: doFlee,
};

function playerAction(type, arg) {
  if (S.scene !== 'battle' || S.battleBusy) return;
  S.battleBusy = true;
  S.G.defending = false;
  S.battleTurn++;
  if (applyPoisonTick(S.G)) return;
  const fn = PLAYER_ACTIONS[type];
  const skipDraw = fn ? fn(arg) : false;
  if (!skipDraw) bind.drawBattle();
}

function attackMove(fin, sfx, crit, mult) {
  if (sfx) SFX[sfx]();
  else SFX.hit();
  const enemy = S.enemy;
  const hero = S.G;
  const isCrit = !!crit;
  let dmg = Math.round(cmdDmg(hero.atkMax, enemy.def, 1, true) * (isCrit ? 1.8 : 1) * (mult || 1));
  if ((enemy.shield || 0) > 0) {
    enemy.shield--;
    dmg = Math.max(1, Math.round(dmg * 0.6));
    S.blog.push(`🪨 ${enemy.name} 的石甲挡下了部分伤害！${enemy.shield > 0 ? `（剩余 ${enemy.shield} 层）` : ''}`);
  }
  addFx(bind.CV.width / 2, 188, '-' + dmg, enemy.isBoss ? '#ff7b7b' : '#ffd24a', dmg >= 25 || isCrit);
  enemy.hp -= dmg;
  enemy.hurt = 1;
  S.anim = { hurt: 1, crit: isCrit };
  setTimeout(() => { enemy.hurt = 0; S.anim = null; }, 220);
  fin(dmg);
}

function finishPlayer(fmt, dmg) {
  S.blog.push(fmt.replace('<dmg>', dmg));
  if (S.enemy.hp <= 0) {
    S.enemy.hp = 0;
    S.blog.push(`💀 ${S.enemy.name} 被击败了！`);
    winBattle();
  } else {
    afterPlayer();
  }
  bind.drawBattle();
}

function afterPlayer() {
  enqueue(600, () => { if (S.scene === 'battle') enemyAct(); });
}

function pickAct(enemy) {
  const acts = enemy.acts || [{ type: 'attack', w: 100 }];
  const hpRatio = enemy.hp / Math.max(1, enemy.hpMax);
  const avail = acts.filter((a) => {
    if (a.hpBelow != null && hpRatio > a.hpBelow) return false;
    if (a.maxShield != null && (enemy.shield || 0) >= a.maxShield) return false;
    return true;
  });
  const weightOf = (a) => (enemy.phased && a.w2 != null) ? a.w2 : a.w;
  let roll = Math.random() * (avail.reduce((sum, a) => sum + weightOf(a), 0) || 1);
  for (const a of avail) {
    roll -= weightOf(a);
    if (roll <= 0) return a;
  }
  return avail[0] || { type: 'attack' };
}

function enemyAct() {
  const hero = S.G;
  const enemy = S.enemy;
  if (!enemy || S.scene !== 'battle') return;
  hero.hurt = 1;

  if ((enemy.burn || 0) > 0) {
    const burnDmg = Math.max(2, Math.round(enemy.hpMax * 0.04));
    enemy.hp -= burnDmg;
    enemy.burn--;
    addFx(bind.CV.width / 2, 188, '-' + burnDmg, '#ff8a2c', true);
    S.blog.push(`🔥 灼烧令 ${enemy.name} 受到 ${burnDmg} 点伤害！`);
    if (enemy.hp <= 0) {
      enemy.hp = 0;
      S.blog.push(`💀 ${enemy.name} 被击败了！`);
      hero.hurt = 0;
      winBattle();
      return;
    }
  }

  if (enemy.skipNext) {
    enemy.skipNext = false;
    hero.hurt = 0;
    S.blog.push(`❄️ ${enemy.name} 被冻结，无法行动！`);
    S.battleBusy = false;
    bind.drawBattle();
    return;
  }

  const phase = enemy.phase2;
  if (phase && !enemy.phased && enemy.hp < enemy.hpMax * (phase.at || 0.5)) {
    enemy.phased = true;
    enemy.name = phase.name || (enemy.name + '·真身');
    if (phase.color) enemy.color = phase.color;
    enemy.atk += (phase.atk || 0);
    enemy.def += (phase.def || 0);
    if (phase.forbid) enemy.forbid = phase.forbid;
    const heal = Math.round(enemy.hpMax * (phase.heal || 0.15));
    enemy.hp = Math.min(enemy.hpMax, enemy.hp + heal);
    SFX.thunder();
    S.blog.push(`🌀 ${enemy.name} 现出真身！力量暴涨，HP 恢复 ${heal}！${phase.forbid && phase.forbid.includes('heal') ? ' 治愈被封印！' : ''}`);
    hero.hurt = 0;
    S.battleBusy = false;
    bind.drawBattle();
    return;
  }

  const act = pickAct(enemy);
  if (act.type === 'shield') {
    enemy.shield = (enemy.shield || 0) + 1;
    SFX.block();
    hero.hurt = 0;
    S.blog.push(`🪨 ${enemy.name} 凝结【石甲】！（累计 ${enemy.shield} 层，所受伤害降低 40%）`);
    S.battleBusy = false;
    bind.drawBattle();
    return;
  }
  if (act.type === 'heal') {
    const heal = Math.round(enemy.hpMax * (act.pct || 0.12));
    enemy.hp += heal;
    SFX.heal();
    S.blog.push(`🟣 ${enemy.name} 使出【暗影回血】，恢复 ${heal} HP`);
    hero.hurt = 0;
  } else {
    const heavy = act.type === 'heavy';
    const mult = heavy ? (enemy.phased ? 2.3 : 1.9) : 1;
    let dmg = cmdDmg(enemy.atk, hero.defMax, mult);
    if (hero.defending) dmg = Math.max(1, Math.round(dmg * 0.5));
    hero.hp -= dmg;
    bind.renderHUD();
    SFX.hurt();
    addFx(96, 340, '-' + dmg, '#ff6b6b', true);
    S.blog.push(`${heavy ? '💥' : '👹'} ${enemy.name} 攻击你，造成 ${dmg} 伤害！${hero.defending ? '（被防御格挡！）' : ''}${heavy && enemy.phased ? '（深渊之怒！）' : ''}`);
    if (hero.defending && Math.random() < 0.5) {
      const counter = Math.max(1, cmdDmg(hero.atkMax, enemy.def, 0.7));
      enemy.hp = Math.max(0, enemy.hp - counter);
      SFX.hit();
      bind.renderHUD();
      addFx(bind.CV.width / 2, 188, '-' + counter, '#ffd24a', true);
      S.blog.push(`⚔️ ${hero.name} 趁隙反击，对 ${enemy.name} 造成 ${counter} 伤害！`);
    }
    if (enemy.poison && Math.random() < enemy.poison) {
      hero.poison = 3;
      S.blog.push(`☠️ ${hero.name} 中了【毒】！每回合扣血，持续 ${hero.poison} 回合`);
    }
    setTimeout(() => { hero.hurt = 0; }, 220);
  }
  bind.drawBattle();
  if (hero.hp <= 0) {
    hero.hp = 0;
    bind.renderHUD();
    bind.boxMsg('💀', 0);
    loseBattle();
    return;
  }
  if (enemy.hp <= 0) {
    enemy.hp = 0;
    S.blog.push(`💀 ${enemy.name} 被反杀倒地！`);
    winBattle();
    return;
  }
  S.battleBusy = false;
  bind.drawBattle();
}

function rollDrop() {
  const hero = S.G;
  const roll = Math.random();
  if (roll < 0.08) {
    hero.drops = (hero.drops || 0) + 1;
    if (hero.weapon === '木剑' || hero.weapon === '铁剑') {
      hero.weapon = '秘银剑';
      applyStats(hero);
      return '⚔️ 掉落武器：秘银剑 已装备！';
    }
    if (hero.armor === '布衣' || hero.armor === '皮甲') {
      hero.armor = '锁子甲';
      applyStats(hero);
      return '🛡️ 掉落防具：锁子甲 已装备！';
    }
    hero.gold += 60;
    return '✨ 宝箱：金币 +60';
  }
  if (roll < 0.2) {
    hero.item++;
    hero.drops = (hero.drops || 0) + 1;
    return '🍖 掉落：生命药水 ×1';
  }
  if (roll < 0.32) {
    if (S.curMap === 'dungeon' || S.curMap === 'cave') {
      hero.mushrooms++;
      hero.drops = (hero.drops || 0) + 1;
      return '🍄 掉落：魔法蘑菇 ×1';
    }
    hero.item++;
    hero.drops = (hero.drops || 0) + 1;
    return '🍖 掉落：生命药水 ×1';
  }
  if (roll < 0.38) {
    hero.potion2 = (hero.potion2 || 0) + 1;
    hero.drops = (hero.drops || 0) + 1;
    return '🧪 掉落：高级灵药 ×1！';
  }
  return null;
}

function winBattle() {
  cancelBattleQueue();
  SFX.victory();
  const hero = S.G;
  const enemy = S.enemy;
  hero.poison = 0;
  const bookName = canonicalName(enemy.name);
  hero.bestiary[bookName] = (hero.bestiary[bookName] || 0) + 1;
  hero.totalWins++;
  if (enemy.isElite) {
    hero.mushrooms++;
    bind.boxMsg('💎 从魔像残骸中捡到 1 株魔法蘑菇！', 1800);
  }
  hero.gold += enemy.gold;
  hero.xp += enemy.xp;
  let leveled = false;
  let gainedAtk = 0, gainedDef = 0, gainedHp = 0, gainedMp = 0;
  while (hero.xp >= hero.xpNext) {
    hero.xp -= hero.xpNext;
    hero.xpNext = Math.round(hero.xpNext * 1.42);
    hero.level++;
    const base = baseStats(hero.level);
    const dh = base.hpMax - hero.hpMax;
    const dm = base.mpMax - hero.mpMax;
    const da = base.atk + WEAPONS[hero.weapon].atk - hero.atkMax;
    const dd = base.def + ARMORS[hero.armor].def - hero.defMax;
    hero.atkMax = base.atk + WEAPONS[hero.weapon].atk;
    hero.defMax = base.def + ARMORS[hero.armor].def;
    hero.hpMax = base.hpMax;
    hero.mpMax = base.mpMax;
    hero.hp = Math.min(hero.hpMax, hero.hp + dh);
    hero.mp = Math.min(hero.mpMax, hero.mp + dm);
    gainedHp += dh; gainedMp += dm; gainedAtk += da; gainedDef += dd;
    leveled = true;
    SFX.levelup();
    checkSkills();
  }
  if (leveled) {
    bind.boxMsg(`🎉 等级提升到 Lv.${hero.level}！HP+${gainedHp} MP+${gainedMp} 攻+${gainedAtk} 防+${gainedDef}${enemy.isBoss ? '，你终于可以……' : ''}`, 2400);
  } else if (!enemy.isRush && hero.xpNext > hero.xp) {
    bind.boxMsg(`🏆 胜利！获得 ${enemy.gold} 金币、${enemy.xp} 经验 · 距 Lv.${hero.level + 1} 升级还需 ${hero.xpNext - hero.xp} 经验`, 2600);
  }
  bind.renderHUD();
  applyAchievements();
  const drop = rollDrop();
  if (drop) {
    bind.renderHUD();
    applyAchievements();
    bind.boxMsg('🎁 额外掉落：' + drop, 2600);
  }

  const result = {
    type: enemy.isRush ? 'rush' : enemy.isBoss ? 'main-boss' : enemy.isCaveBoss ? 'cave-boss' : enemy.isTrue ? 'true-boss' : 'normal',
    gold: enemy.gold, xp: enemy.xp, name: bookName,
  };
  if (enemy.isCaveBoss) hero.caveBoss = true;
  if (enemy.isTrue) { hero.trueBoss = true; hero.gold += 300; }
  if (enemy.isBoss) hero.bossDefeated = true;
  bind.applyVictoryWorld(result);

  if (enemy.isRush) {
    const stage = hero.rushStage;
    if (stage >= RUSH_BOSSES.length) {
      hero.rushStage = 0;
      hero.rushDone = true;
      const reward = 150 + hero.level * 20;
      hero.gold += reward;
      applyAchievements();
      SFX.victory();
      bind.boxMsg(`🌈 试炼通关！奖励 ${reward} 金币！灯火记得你的名字！`, 3200);
      setTimeout(() => { goto('world'); S.enemy = null; S.battleBusy = false; resumeBgm(); }, 1800);
    } else {
      hero.hp = Math.min(hero.hpMax, hero.hp + Math.round(hero.hpMax * 0.35));
      hero.mp = Math.min(hero.mpMax, hero.mp + Math.round(hero.mpMax * 0.5));
      bind.renderHUD();
      hero.rushStage = stage + 1;
      bind.boxMsg(`🚩 试炼第 ${stage + 1} 关：${RUSH_BOSSES[stage].name} 现身！`, 2200);
      setTimeout(() => { startBattle(deep(RUSH_BOSSES[stage])); }, 1400);
    }
    return result;
  }
  if (enemy.isBoss) {
    if (hero.weapon !== '圣光之剑') {
      hero.weapon = '圣光之剑';
      applyStats(hero);
      bind.renderHUD();
      bind.boxMsg(`⚔️ 剑里封着被偷走的黎明——【圣光之剑】！攻+${WEAPONS['圣光之剑'].atk}`, 2600);
    }
    applyAchievements();
    stopBgm();
    goto('win');
    bind.drawWin();
    return result;
  }
  if (enemy.isCaveBoss) {
    bind.boxMsg('🏆 洞窟领主倒下！左边的星砂宝箱显形了，快去开启！', 2600);
    applyAchievements();
  }
  if (enemy.isTrue) {
    bind.boxMsg('✨ 初灯的意志散了。记忆回到镇上。额外 300 金币！', 3200);
    applyAchievements();
    stopBgm();
    goto('ending');
    bind.drawEnding();
    return result;
  }
  setTimeout(() => { goto('world'); S.enemy = null; S.battleBusy = false; resumeBgm(); }, 1400);
  return result;
}

function loseBattle() {
  cancelBattleQueue();
  S.G.rushStage = 0;
  S.G.poison = 0;
  stopBgm();
  goto('dead');
  SFX.death();
  bind.drawDead();
}

function retryBoss() {
  const retry = S.G._bossRetry;
  if (!retry || retry.bossId === 'rush') return false;
  let def = BOSS;
  if (retry.bossId === 'true') def = TRUE_BOSS;
  else if (retry.bossId === 'cave') def = CAVE_BOSS;
  const hero = S.G;
  hero.level = retry.level;
  hero.xp = retry.xp;
  hero.weapon = retry.weapon;
  hero.armor = retry.armor;
  hero.gold = retry.gold;
  hero.item = retry.item;
  hero.potion2 = retry.potion2;
  hero.chests = new Set(retry.chests || []);
  applyStats(hero);
  hero.hp = Math.min(hero.hpMax, retry.hp);
  hero.mp = Math.min(hero.mpMax, retry.mp);
  bind.loadMap(retry.curMap || 'village');
  hero.x = retry.x;
  hero.y = retry.y;
  bind.renderHUD();
  SFX.select();
  bind.boxMsg('🔄 重整旗鼓，再战强敌！', 1600);
  startBattle(deep(def));
  return true;
}

function updateBattle() {
  if (S.scene === 'battle') bind.drawBattle();
}

export {
  deep, eliteEncounter, randomEncounter, monReward, canonicalName, startRush,
  applyAchievements as achCheck, addFx, threatWarn, startBattle, cmdDmg, atkEstimate,
  playerAction, attackMove, finishPlayer, enemyAct, rollDrop, winBattle, loseBattle,
  retryBoss, updateBattle, skillEstimate,
};
