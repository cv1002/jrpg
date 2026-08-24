// ============================================================
// enemyAI.js —— 敌方行动（从 battle.js 拆出）：行为表挑选 + 回合执行
// 不 import battle.js；战斗编排回调（addFx / winBattle / loseBattle）由调用方经 deps 传入
// ============================================================
import { S } from './state.js';
import { cmdDmg } from './rules.js';
import { SFX } from './audio.js';
import { bind } from './bind.js';
import { BURN_PCT, SHIELD_MULT, POISON_TURNS, DEFEND_MULT, COUNTER_CHANCE, COUNTER_MULT, HEAVY_MULT, HEAVY_MULT_PHASED, HEAL_PCT } from './data.js';

export function pickAct(enemy) {
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

export function enemyAct(deps) {
  const { addFx, winBattle, loseBattle } = deps;
  const hero = S.G;
  const enemy = S.enemy;
  if (!enemy || S.scene !== 'battle') return;
  hero.hurt = 1;

  if ((enemy.burn || 0) > 0) {
    const burnDmg = Math.max(2, Math.round(enemy.hpMax * BURN_PCT));
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
    S.flash = { t0: Date.now() }; // 变身全屏闪光（纯显示）
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
    S.blog.push(`🪨 ${enemy.name} 凝结【石甲】！（累计 ${enemy.shield} 层，所受伤害降低 ${Math.round((1 - SHIELD_MULT) * 100)}%）`);
    S.battleBusy = false;
    bind.drawBattle();
    return;
  }
  if (act.type === 'heal') {
    const heal = Math.round(enemy.hpMax * (act.pct || HEAL_PCT));
    enemy.hp += heal;
    SFX.heal();
    S.blog.push(`🟣 ${enemy.name} 使出【暗影回血】，恢复 ${heal} HP`);
    hero.hurt = 0;
  } else {
    const heavy = act.type === 'heavy';
    const mult = heavy ? (enemy.phased ? HEAVY_MULT_PHASED : HEAVY_MULT) : 1;
    let dmg = cmdDmg(enemy.atk, hero.defMax, mult);
    if (hero.defending) dmg = Math.max(1, Math.round(dmg * DEFEND_MULT));
    hero.hp -= dmg;
    bind.renderHUD();
    SFX.hurt();
    if (heavy) S.shake = { t0: Date.now(), pow: 3 }; // 重击震屏（纯显示）
    addFx(96, 340, '-' + dmg, '#ff6b6b', true);
    S.blog.push(`${heavy ? '💥' : '👹'} ${enemy.name} 攻击你，造成 ${dmg} 伤害！${hero.defending ? '（被防御格挡！）' : ''}${heavy && enemy.phased ? '（深渊之怒！）' : ''}`);
    if (hero.defending && Math.random() < COUNTER_CHANCE) {
      const counter = Math.max(1, cmdDmg(hero.atkMax, enemy.def, COUNTER_MULT));
      enemy.hp = Math.max(0, enemy.hp - counter);
      SFX.hit();
      bind.renderHUD();
      addFx(bind.CV.width / 2, 188, '-' + counter, '#ffd24a', true);
      S.blog.push(`⚔️ ${hero.name} 趁隙反击，对 ${enemy.name} 造成 ${counter} 伤害！`);
    }
    if (enemy.poison && Math.random() < enemy.poison) {
      hero.poison = POISON_TURNS;
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
