// ============================================================
// enemyAI.js —— 敌方行动（从 battle.js 拆出）：行为表挑选 + 回合执行
// 不 import battle.js；战斗编排回调（addFx / winBattle / loseBattle）由调用方经 deps 传入
// ============================================================
import { S } from './state.js';
import { cmdDmg } from './rules.js';
import { SFX } from './audio.js';
import { bind } from './bind.js';
import { BURN_PCT, SHIELD_MULT, POISON_TURNS, DEFEND_MULT, COUNTER_CHANCE, COUNTER_MULT, HEAVY_MULT, HEAVY_MULT_PHASED, HEAL_PCT, PHASE2_AT, PHASE2_HEAL_PCT, HIT_FB_MS, DOT_MIN, FX_ENEMY, FX_HERO } from './data.js';

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
    const burnDmg = Math.max(DOT_MIN, Math.round(enemy.hpMax * BURN_PCT));
    enemy.hp -= burnDmg;
    enemy.burn--;
    addFx(bind.CV.width / 2, FX_ENEMY.y, '-' + burnDmg, '#ff8a2c', true);
    // v21.8 灼烧结算反馈追加敌方剩余 HP（信息透明·纯显示）：v20.0 已给玩家攻击命中后追加敌方剩余 HP、
    // v20.1 已给敌方回血后追加当前 HP，但持续伤害（灼烧 tick）仍只报伤害值——玩家盯着敌方的灼烧层数，
    // 想确认「再烧几轮死」仍需瞄血条；直接读结算后（enemy.hp -= burnDmg 之后）的 enemy.hp / enemy.hpMax，
    // 与 attackMove 扣减后追加剩余 HP 同源；致死灼烧（enemy.hp <= 0）不追加，避免与随后「被击败了」重复
    // （同 v20.0 击杀时不追加敌方剩余 HP 的口径）。零结算变化。
    S.blog.push(`🔥 灼烧令 ${enemy.name} 受到 ${burnDmg} 点伤害！${enemy.hp > 0 ? `（敌方 HP 剩余 ${enemy.hp}/${enemy.hpMax}）` : ''}`);
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
  if (phase && !enemy.phased && enemy.hp < enemy.hpMax * (phase.at || PHASE2_AT)) {
    enemy.phased = true;
    enemy.name = phase.name || (enemy.name + '·真身');
    if (phase.color) enemy.color = phase.color;
    enemy.atk += (phase.atk || 0);
    enemy.def += (phase.def || 0);
    if (phase.forbid) enemy.forbid = phase.forbid;
    const heal = Math.round(enemy.hpMax * (phase.heal || PHASE2_HEAL_PCT));
    enemy.hp = Math.min(enemy.hpMax, enemy.hp + heal);
    SFX.thunder();
    S.flash = { t0: Date.now() }; // 变身全屏闪光（纯显示）
    // v21.9 变身回血结算反馈追加敌方当前 HP（信息透明·纯显示）：v20.1 已给普通回血（暗影回血）追加「敌方 HP X/Y」，
    // 但变身（现出真身）的 HP 恢复仍只报恢复量——Boss 变身的这一口血是玩家最关心的一次回复（变身线/增益已常驻血条，
    // 唯独结算后精确血数没进战报）；直接读结算后（enemy.hp = Math.min(hpMax, hp + heal) 之后）的 enemy.hp / enemy.hpMax，
    // 与 v20.1「敌方 HP X/Y」同源同式；变身必回血且 hp>0（hp<=0 早已胜负结算），无需致死保护。零结算变化。
    S.blog.push(`🌀 ${enemy.name} 现出真身！力量暴涨，HP 恢复 ${heal}！（敌方 HP ${enemy.hp}/${enemy.hpMax}）${phase.forbid && phase.forbid.includes('heal') ? ' 治愈被封印！' : ''}`);
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
    // v20.1 敌方回血反馈追加当前 HP（信息透明·纯显示）：v20.0 已给玩家攻击命中后追加敌方剩余 HP，
    // 但敌方使用回血技能时仍只报恢复量，玩家无法确认「这怪又回上来了多少、当前还剩多少血」；
    // 直接读结算后的 enemy.hp / enemy.hpMax，与 v20.0 敌方剩余 HP / HUD 血条同源，零数值变化。
    S.blog.push(`🟣 ${enemy.name} 使出【暗影回血】，恢复 ${heal} HP（敌方 HP ${enemy.hp}/${enemy.hpMax}）`);
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
    addFx(FX_HERO.x, FX_HERO.y, '-' + dmg, '#ff6b6b', true);
    // v20.2 敌方攻击反馈追加我方剩余 HP（信息透明·纯显示）：v20.0 已给玩家攻击命中后追加敌方剩余 HP、
    // v20.1 已给敌方回血后追加敌方当前 HP，但敌方攻击命中时仍只报伤害值——玩家刚挨一刀，想确认
    // 「这血量还扛得住吗 / 是否需要防御或喝药」仍需瞄 HUD 血条；这里读结算后（hero.hp -= dmg 之后、
    // 含防御减伤/重击倍率）的 hero.hp / hero.hpMax，与 HUD 血条/状态页同源。致死一击（hero.hp<=0）
    // 不追加，避免与后续败北提示重复（同 v20.0 击杀时不追加敌方剩余 HP 的口径）。零数值变化。
    const hpSuffix = hero.hp > 0 ? `（我方 HP ${hero.hp}/${hero.hpMax}）` : '';
    S.blog.push(`${heavy ? '💥' : '👹'} ${enemy.name} 攻击你，造成 ${dmg} 伤害！${hero.defending ? '（被防御格挡！）' : ''}${heavy && enemy.phased ? '（深渊之怒！）' : ''}${hpSuffix}`);
    if (hero.defending && Math.random() < COUNTER_CHANCE) {
      const counter = Math.max(1, cmdDmg(hero.atkMax, enemy.def, COUNTER_MULT));
      enemy.hp = Math.max(0, enemy.hp - counter);
      SFX.hit();
      bind.renderHUD();
      addFx(bind.CV.width / 2, FX_ENEMY.y, '-' + counter, '#ffd24a', true);
      // v21.8 反击结算反馈追加敌方剩余 HP（信息透明·纯显示）：反击与普攻/技能同属「玩家打出的伤害」，
      // v20.0 已给普攻/技能追加敌方剩余 HP，唯独防御反击这条玩家伤害输出仍只报伤害值——玩家在防御中
      // 白赚一下反击时，同样想一眼看清「这刀下去怪还剩多少」；直接读结算后（enemy.hp = Math.max(0, …)
      // 之后）的 enemy.hp / enemy.hpMax，与 attackMove 扣减后追加剩余 HP 同源；反杀（enemy.hp <= 0）
      // 不追加，避免与随后「被反杀倒地」重复（同 v20.0 击杀时不追加敌方剩余 HP 的口径）。零结算变化。
      S.blog.push(`⚔️ ${hero.name} 趁隙反击，对 ${enemy.name} 造成 ${counter} 伤害！${enemy.hp > 0 ? `（敌方 HP 剩余 ${enemy.hp}/${enemy.hpMax}）` : ''}`);
    }
    if (enemy.poison && Math.random() < enemy.poison) {
      hero.poison = POISON_TURNS;
      S.blog.push(`☠️ ${hero.name} 中了【毒】！每回合扣血，持续 ${hero.poison} 回合`);
    }
    setTimeout(() => { hero.hurt = 0; }, HIT_FB_MS);
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
