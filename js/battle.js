// ============================================================
// battle.js —— 回合队列 / 玩家指令 / 战斗编排与结算（不 import world / view）
// 遇敌生成 → encounter.js；敌方行动 → enemyAI.js；Boss 重试 → core.js
// boxMsg / drawBattle / burst* ← bind.js；applyVictoryWorld ← hooks.js
// ============================================================
import { S, curMap } from './state.js';
import { RUSH_BOSSES, SKILL_DATA, WEAPONS, CHARGE_MULT, DIFF_SCALE, RUSH_RECOVER, FRAGMENTS, FLEE_SUCCESS, CRIT_RATE, CRIT_MULT, BIG_DMG, SHIELD_MULT, HIT_FB_MS, FX_ENEMY, FX_HERO, POISON_PCT, DOT_MIN, DEFEND_MP, TRUE_BONUS_GOLD, SYS_MSG_MS, MILESTONE_MS, NARR_MSG_MS, FINAL_LEAD_MS, STRONG_MSG_MS, WIN_MSG_MS, ACH_MSG_MS, BATTLE_GAP_MS, MEMORY_MSG_MS, WRAP_GAP_MS } from './data.js';
import { deep, cmdDmg, elemMult, skillDefUsed, applyStats, canonicalName, isBossFoe, rushReward, rollDrop } from './rules.js';
import { SFX, startBgm, stopBgm, resumeBgm } from './audio.js';
import { bind } from './bind.js';
import { hooks } from './hooks.js';
import { goto } from './scene.js';
import { takePotion, potionAvailability, applyAchievements, grantXp } from './hero.js';
import { enemyAct } from './enemyAI.js';

function startRush() {
  S.G.rushStage = 1;
  bind.boxMsg('⚔️ 试炼开始——连战场上的三名强敌！', STRONG_MSG_MS);
  setTimeout(() => {
    if (S.scene === 'world') startBattle(deep(RUSH_BOSSES[0]));
  }, FINAL_LEAD_MS);
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
  // 双方基础伤害估算（单一数据源）：直读 rules.cmdDmg（raw = max(1, atk×2-def)，无浮动档即恒等于裸公式）——
  // 与 atkEstimate/skillEstimate 预览、enemyAI 敌方攻击同读同一份伤害公式；此前此处手写「atk×2-def」裸公式，
  // 想调伤害公式（如 atk×2 改 1.9）要改 rules.cmdDmg + 此处两处，威胁预警还会悄然与真实结算脱钩
  const playerHit = cmdDmg(hero.atkMax, enemy.def, 1, false);
  const enemyHit = cmdDmg(enemy.atk, hero.defMax, 1, false);
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
  // v19.41 图鉴「已遭遇」记录（信息透明·纯状态）：一进战即记入 hero.seen——
  // 此前只有「击败」才进图鉴（hero.bestiary），逃跑/战败的敌人在图鉴里仍是 ❓？？？，
  // 明明亲身撞见过却显示「从没遇到」；记下后图鉴对已遭遇未讨伐者揭示名字与出没地，
  // 兵力/弱点仍在讨伐后才显示（不剧透）。名字经 canonicalName 归一（真身→本体，与 bestiary 同口径），
  // 纯追加字段零结算变化（逃跑成功率/掉落/经验均不受影响）。
  {
    const _seenKey = canonicalName(S.enemy.name);
    if (S.G.seen) S.G.seen[_seenKey] = true;
    else S.G.seen = { [_seenKey]: true };
  }
  S.enemy.hpMax = enemyDef.hpMax || enemyDef.hp;
  S.G.defending = false;
  S.G.charge = false;
  S.G.poison = 0;
  S.enemy.burn = 0;
  S.enemy.skipNext = false;
  S.enemy.phased = false;
  S.enemy.forbid = null;
  if (S.G.diff) {
    // 困难倍率（data.js DIFF_SCALE 单一数据源）：与状态页/创建页标注同源，数值结算逐字不变
    S.enemy.hpMax = Math.round(S.enemy.hpMax * DIFF_SCALE.hp);
    S.enemy.atk = Math.round(S.enemy.atk * DIFF_SCALE.atk);
    S.enemy.def = Math.round(S.enemy.def * DIFF_SCALE.def);
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
  if (isBossFoe(S.enemy)) {
    const bossId = S.enemy.isTrue ? 'true' : S.enemy.isCaveBoss ? 'cave' : S.enemy.isBoss ? 'main' : 'rush';
    S.G._bossRetry = {
      hp: S.G.hp, mp: S.G.mp, item: S.G.item, potion2: S.G.potion2,
      gold: S.G.gold, level: S.G.level, xp: S.G.xp,
      weapon: S.G.weapon, armor: S.G.armor, name: S.enemy.name,
      x: S.G.x, y: S.G.y, curMap: curMap(),
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
  const damage = Math.max(DOT_MIN, Math.round(hero.hpMax * POISON_PCT));
  hero.hp -= damage;
  hero.poison--;
  SFX.hurt();
  bind.renderHUD();
  addFx(FX_HERO.x, FX_HERO.y, '-' + damage, '#7fe08a', true);
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
  const crit = Math.random() < CRIT_RATE;
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
  // v14.0 蓄力语义收敛：蓄力只加成「威力」（攻击/伤害技能 ×CHARGE_MULT），
  // 治疗不属于威力——此前治疗会把蓄力白白吃掉还谎称「蓄力加持」；现在治疗保留蓄力，
  // 治愈后下一次攻击/伤害技能仍按 ×CHARGE_MULT 结算（与 doCharge 文案「攻击或技能威力」一致）。
  if (charged && skill.kind !== 'heal') hero.charge = false;
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
    S.blog.push(`💚 ${hero.name} 使出【${skillName}】，恢复 ${heal} 点 HP${extra}${charged ? '（蓄力保留）' : ''}`);
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
  const { hpFull, mpFull, any } = potionAvailability(hero);
  if (!any) {
    return abortAction(hpFull && mpFull ? '✅ 你气满神足，无需用药！' : '❌ 没有可用的药水了！');
  }
  const result = takePotion();
  SFX.heal();
  bind.renderHUD();
  // v19.74 战斗用药反馈追加剩余数量（信息透明·纯显示）：与大地图 F 键喝药同源，
  // 直接读结算后的 hero.item / hero.potion2，让玩家连战中一眼知道灵药/药水库存。
  S.blog.push(
    result.strong
      ? `🧪 ${hero.name} 服下高级灵药，恢复 ${result.h} HP、${result.m} MP（高级灵药剩余 ${hero.potion2} 瓶）`
      : `🍖 ${hero.name} 服用药水，恢复 ${result.h} 点 HP（药水剩余 ${hero.item} 瓶）`
  );
  afterPlayer();
}

function doDefend() {
  const hero = S.G;
  hero.defending = true;
  SFX.block();
  const mp = Math.min(hero.mpMax, hero.mp + DEFEND_MP);
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
  if (isBossFoe(enemy)) {
    // 气场压制：本回合行动保留——不调度敌方行动、立即释放战斗回合（回归 v2.2/v1.37 既定设计「battleBusy 释放、不调度 enemyAct」；
    // 此前误调 afterPlayer() 会让「按 4 逃跑 = 白送回合挨 Boss 打」，与指令栏 ⛔「别按 4」的提示矛盾。普通怪逃跑行为完全不变）
    S.blog.push(`⚠️ ${enemy.name} 的气场压制着你，无法逃脱！（本回合行动保留）`);
    SFX.cancel();
    S.battleBusy = false;
    bind.drawBattle();
    return true;
  }
  if (Math.random() < FLEE_SUCCESS) {
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
  let dmg = Math.round(cmdDmg(hero.atkMax, enemy.def, 1, true) * (isCrit ? CRIT_MULT : 1) * (mult || 1));
  if ((enemy.shield || 0) > 0) {
    enemy.shield--;
    dmg = Math.max(1, Math.round(dmg * SHIELD_MULT));
    S.blog.push(`🪨 ${enemy.name} 的石甲挡下了部分伤害！${enemy.shield > 0 ? `（剩余 ${enemy.shield} 层）` : ''}`);
  }
  addFx(bind.CV.width / 2, FX_ENEMY.y, '-' + dmg, enemy.isBoss ? '#ff7b7b' : '#ffd24a', dmg >= BIG_DMG || isCrit);
  // 震屏触发（纯显示）：暴击或大额伤害（≥BIG_DMG，与浮字加粗同源阈值）
  if (isCrit || dmg >= BIG_DMG) S.shake = { t0: Date.now(), pow: isCrit ? 4 : 3 };
  enemy.hp -= dmg;
  enemy.hurt = 1;
  S.anim = { hurt: 1, crit: isCrit };
  setTimeout(() => { enemy.hurt = 0; S.anim = null; }, HIT_FB_MS);
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

// 敌方行动的编排回调（enemyAI.js 不反向 import battle.js，经 deps 传入）
const BATTLE_DEPS = { addFx, winBattle, loseBattle };

function afterPlayer() {
  // v14.1 回合计数只在行动被「实际消耗」时推进：此前 battle.js 在 playerAction 起手无条件 battleTurn++，
  // 被拒绝的指令（MP 不足 / 无药 / 技能未学 / 气场封印）与 Boss 战逃跑（日志明说「本回合行动保留」）
  // 也都会白白虚涨「⚔️ 回合 N」——按几下废键计数就虚高一截，与「不耗回合」的文案自相矛盾。
  // 移到 afterPlayer 后，只有真正调度了敌方回合的指令才 +1：计数如实反映「实际走了几回合」。
  // 普通攻击/技能/药水/防御/蓄力/逃跑失败：照旧每行动一次 +1（进入敌方回合前）；逃跑成功与
  // Boss 逃（不调度敌方回合）以及各类被拒指令：不再虚涨。展示层 drawBattle 只读数，无第二口径。
  S.battleTurn++;
  enqueue(600, () => { if (S.scene === 'battle') enemyAct(BATTLE_DEPS); });
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
    // v19.79 精英怪掉落蘑菇反馈追加剩余库存（信息透明·纯显示）：此前击败石心魔像只报「捡到 1 株」，
    // 玩家想确认「包里现在有几株」还需再按 I 看状态页；现在直接读结算后的 hero.mushrooms，与 v19.73 卖菇剩余量、
    // v19.74 用药剩余量同源，零数值变化。
    bind.boxMsg(`💎 从魔像残骸中捡到 1 株魔法蘑菇！（剩余 ${hero.mushrooms || 0} 株）`, NARR_MSG_MS);
  }
  hero.gold += enemy.gold;
  const g = grantXp(hero, enemy.xp);
  if (g.leveled) {
    // v19.81 升级反馈追加剩余金币（信息透明·纯显示）：v19.80 已给普通胜利文案带上余额，但升级瞬间的
    // 里程碑横幅只报「金币加到 hero.gold 后」的等级属性变化——玩家刚因一场胜仗升级，往往正想确认「兜里
    // 还剩多少」去补给或换装；直接读结算后的 hero.gold（enemy.gold 已在 line399 加入），与 v19.80 普通胜利
    // 余额提示同源，零数值变化。
    bind.boxMsg(`🎉 等级提升到 Lv.${hero.level}！HP+${g.hp} MP+${g.mp} 攻+${g.atk} 防+${g.def}${enemy.isBoss ? '，你终于可以……' : ''}（剩余 ${hero.gold} 金）`, MILESTONE_MS);
  } else if (!enemy.isRush && hero.xpNext > hero.xp) {
    // v19.80 普通战斗胜利反馈追加剩余金币（信息透明·纯显示）：v19.75/19.76/19.77/19.78 已给商店/旅馆/
    // 任务奖励/药水购买成功文案带上余额，但战斗胜利（高频收入来源）仍只报「获得 N 金币」；玩家刚拿到一笔
    // 收入想确认「兜里还剩多少」仍需再按 I 看状态页。直接读结算后的 hero.gold（line 399 已加 enemy.gold），
    // 零数值变化，只追加显示。
    bind.boxMsg(`🏆 胜利！获得 ${enemy.gold} 金币、${enemy.xp} 经验 · 距 Lv.${hero.level + 1} 升级还需 ${hero.xpNext - hero.xp} 经验（剩余 ${hero.gold} 金）`, WIN_MSG_MS);
  }
  bind.renderHUD();
  applyAchievements();
  const drop = rollDrop(hero, curMap());
  if (drop) {
    bind.renderHUD();
    applyAchievements();
    bind.boxMsg('🎁 额外掉落：' + drop, WIN_MSG_MS);
  }

  const result = {
    type: enemy.isRush ? 'rush' : enemy.isBoss ? 'main-boss' : enemy.isCaveBoss ? 'cave-boss' : enemy.isTrue ? 'true-boss' : 'normal',
    gold: enemy.gold, xp: enemy.xp, name: bookName,
  };
  if (enemy.isCaveBoss) hero.caveBoss = true;
  if (enemy.isTrue) { hero.trueBoss = true; hero.gold += TRUE_BONUS_GOLD; }
  if (enemy.isBoss) hero.bossDefeated = true;
  // 记忆碎片（data.js FRAGMENTS 单一数据源）：强敌首胜掉落一段旧灯卫记忆，J 日志可回看
  const frag = FRAGMENTS.find((f) => f.enemy === bookName);
  if (frag && !(hero.fragments || []).includes(frag.id)) {
    hero.fragments.push(frag.id);
    // v19.90 记忆碎片拾取反馈追加收集进度（信息透明·纯显示）：此前只报「拾起一段记忆」与回看提示，
    // 玩家刚拿到强敌首胜掉落的一段记忆，想确认「离真结局·全记忆还差几段」仍需按 J 翻日志或按 I 看状态页；
    // 直接读结算后的 hero.fragments.length 与 FRAGMENTS.length（真结局判定/任务进度/名字石碑同读此源），
    // 零结算变化，只追加显示当前已集齐段数。
    const fragCount = (hero.fragments || []).length;
    bind.boxMsg(`🕯️ 拾起一段记忆：【${frag.name}】（按 J 日志回看 · ${fragCount}/${FRAGMENTS.length} 段记忆已集齐）`, MEMORY_MSG_MS);
  }
  hooks.applyVictoryWorld(result);

  if (enemy.isRush) {
    const stage = hero.rushStage;
    if (stage >= RUSH_BOSSES.length) {
      hero.rushStage = 0;
      hero.rushDone = true;
      const reward = rushReward(hero.level);
      hero.gold += reward;
      applyAchievements();
      SFX.victory();
      // v19.82 试炼通关反馈追加剩余金币（信息透明·纯显示）：v19.60 已给试炼碑加上「通关奖 N 金」预览，
      // 但三连战真正通关后的横幅只报奖励数额——玩家刚拿到一笔大额金币收入，想确认「兜里还剩多少」
      // 仍需再按 I 看状态页；直接读结算后的 hero.gold（line 444 已加 reward），与 v19.80 普通胜利/
      // v19.81 升级余额提示同源，零数值变化。
      bind.boxMsg(`🌈 试炼通关！奖励 ${reward} 金币！灯火记得你的名字！（剩余 ${hero.gold} 金）`, ACH_MSG_MS);
      setTimeout(() => { goto('world'); S.enemy = null; S.battleBusy = false; resumeBgm(); }, WRAP_GAP_MS);
    } else {
      // 连胜换关自动回血（data.js RUSH_RECOVER 单一数据源）：与战斗横幅/帮助页标注同读此源，数值结算逐字不变
      hero.hp = Math.min(hero.hpMax, hero.hp + Math.round(hero.hpMax * RUSH_RECOVER.hp));
      hero.mp = Math.min(hero.mpMax, hero.mp + Math.round(hero.mpMax * RUSH_RECOVER.mp));
      bind.renderHUD();
      hero.rushStage = stage + 1;
      bind.boxMsg(`🚩 试炼第 ${stage + 1} 关：${RUSH_BOSSES[stage].name} 现身！（已自动恢复${Math.round(RUSH_RECOVER.hp * 100)}%HP / ${Math.round(RUSH_RECOVER.mp * 100)}%MP）`, SYS_MSG_MS);
      setTimeout(() => { startBattle(deep(RUSH_BOSSES[stage])); }, BATTLE_GAP_MS);
    }
    return result;
  }
  if (enemy.isBoss) {
    if (hero.weapon !== '圣光之剑') {
      hero.weapon = '圣光之剑';
      applyStats(hero);
      bind.renderHUD();
      bind.boxMsg(`⚔️ 剑里封着被偷走的黎明——【圣光之剑】！攻+${WEAPONS['圣光之剑'].atk}`, WIN_MSG_MS);
    }
    applyAchievements();
    stopBgm();
    goto('win');
    bind.drawWin();
    return result;
  }
  if (enemy.isCaveBoss) {
    bind.boxMsg('🏆 洞窟领主倒下！左边的星砂宝箱显形了，快去开启！', WIN_MSG_MS);
    applyAchievements();
  }
  if (enemy.isTrue) {
    bind.boxMsg(`✨ 初灯的意志散了。记忆回到镇上。额外 ${TRUE_BONUS_GOLD} 金币！（剩余 ${hero.gold} 金）`, ACH_MSG_MS);
    applyAchievements();
    stopBgm();
    goto('ending');
    bind.drawEnding();
    return result;
  }
  setTimeout(() => { goto('world'); S.enemy = null; S.battleBusy = false; resumeBgm(); }, BATTLE_GAP_MS);
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

function updateBattle() {
  if (S.scene === 'battle') bind.drawBattle();
}

export {
  startBattle, startRush, playerAction, updateBattle, winBattle, loseBattle,
};
