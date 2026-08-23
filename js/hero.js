// ============================================================
// hero.js —— 药水 / 技能领悟 / 成就应用（无 world/battle/shop 依赖）
// boxMsg ← view/hud.js
// ============================================================
import { S } from './state.js';
import { learnsAt, ACH_LIST, WEAPONS, ARMORS, baseStats, POTION_HP_PCT, POTION_HP_FLAT, ELIXIR_HP_PCT, ELIXIR_HP_FLAT, ELIXIR_MP_PCT, XP_GROW, XP_INIT } from './data.js';
import { unlockedAchievements } from './rules.js';
import { SFX } from './audio.js';
import { bind } from './bind.js';

// 药水可用性判定（单一数据源）：core.usePotion 与 battle.doItem 同源——
// 高级灵药优先（可同时补 MP）、普通药水只在掉血时用；满状态不浪费
export function potionAvailability(hero) {
  const hpFull = hero.hp >= hero.hpMax;
  const mpFull = hero.mp >= hero.mpMax;
  const strongOk = hero.potion2 > 0 && (!hpFull || !mpFull);
  const weakOk = hero.item > 0 && !hpFull;
  return { hpFull, mpFull, any: strongOk || weakOk };
}

export function takePotion() {
  const hero = S.G;
  if (hero.potion2 > 0) {
    hero.potion2--;
    const h = Math.round(hero.hpMax * ELIXIR_HP_PCT) + ELIXIR_HP_FLAT;
    const m = Math.round(hero.mpMax * ELIXIR_MP_PCT);
    hero.hp = Math.min(hero.hpMax, hero.hp + h);
    hero.mp = Math.min(hero.mpMax, hero.mp + m);
    return { h, m, strong: true };
  }
  if (hero.item > 0) {
    hero.item--;
    const h = Math.round(hero.hpMax * POTION_HP_PCT) + POTION_HP_FLAT;
    hero.hp = Math.min(hero.hpMax, hero.hp + h);
    return { h, strong: false };
  }
  return null;
}

export function checkSkills() {
  const hero = S.G;
  const skill = learnsAt(hero.level);
  if (skill && !hero.skills.includes(skill)) {
    hero.skills.push(skill);
    bind.boxMsg(`🌟 领悟了新技能【${skill}】！`, 2200);
    SFX.levelup();
  }
}

// 经验结算与升级循环（从 battle.winBattle 拆出，单一数据源）：
// 返回本段经验带来的累计成长，供胜利横幅展示
export function grantXp(hero, xp) {
  hero.xp += xp;
  const g = { leveled: false, hp: 0, mp: 0, atk: 0, def: 0 };
  while (hero.xp >= hero.xpNext) {
    hero.xp -= hero.xpNext;
    hero.xpNext = Math.round(hero.xpNext * XP_GROW);
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
    g.hp += dh; g.mp += dm; g.atk += da; g.def += dd;
    g.leveled = true;
    SFX.levelup();
    checkSkills();
  }
  return g;
}

export function skillXpHint(hero) {
  if (!hero) return null;
  let next = null;
  for (let lv = (hero.level || 1) + 1; lv <= 8; lv++) {
    const skill = learnsAt(lv);
    if (skill && !(hero.skills || []).includes(skill)) {
      next = { name: skill, lv };
      break;
    }
  }
  if (!next) return null;
  const base = Math.max(1, hero.xpNext || XP_INIT);
  const xp = Math.max(0, hero.xp || 0);
  let need = base - xp;
  let nxt = Math.round(base * XP_GROW);
  for (let lv = (hero.level || 1) + 2; lv <= next.lv; lv++) {
    need += nxt;
    nxt = Math.round(nxt * XP_GROW);
  }
  return { name: next.name, lv: next.lv, remain: Math.max(0, need) };
}

export function applyAchievements() {
  const hero = S.G;
  if (!hero) return;
  hero.ach = hero.ach || [];
  const newly = unlockedAchievements(hero);
  for (const id of newly) {
    if (hero.ach.includes(id)) continue;
    hero.ach.push(id);
    SFX.levelup();
    const def = ACH_LIST.find((x) => x.id === id);
    if (id === 'perfection') {
      hero.gold += 999;
      bind.boxMsg('🏆 图鉴收集完成！额外奖励 999 金币！', 4200);
    } else {
      bind.boxMsg(`🔓 成就解锁：【${def ? def.name : id}】 ${def ? def.d : ''}`, 3200);
    }
  }
}
