// ============================================================
// hero.js —— 药水 / 技能领悟 / 成就应用（无 world/battle/shop 依赖）
// boxMsg ← view/hud.js
// ============================================================
import { S } from './state.js';
import { learnsAt, ACH_LIST } from './data.js';
import { unlockedAchievements } from './rules.js';
import { SFX } from './audio.js';
import { bind } from './bind.js';

export function takePotion() {
  const hero = S.G;
  if (hero.potion2 > 0) {
    hero.potion2--;
    const h = Math.round(hero.hpMax * 0.8) + 20;
    const m = Math.round(hero.mpMax * 0.4);
    hero.hp = Math.min(hero.hpMax, hero.hp + h);
    hero.mp = Math.min(hero.mpMax, hero.mp + m);
    return { h, m, strong: true };
  }
  if (hero.item > 0) {
    hero.item--;
    const h = Math.round(hero.hpMax * 0.5) + 8;
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

export function nextSkillHint() {
  const hero = S.G;
  for (let lv = hero.level + 1; lv <= 8; lv++) {
    const skill = learnsAt(lv);
    if (skill && !hero.skills.includes(skill)) return { name: skill, lv };
  }
  return null;
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
  const base = Math.max(1, hero.xpNext || 20);
  const xp = Math.max(0, hero.xp || 0);
  let need = base - xp;
  let nxt = Math.round(base * 1.42);
  for (let lv = (hero.level || 1) + 2; lv <= next.lv; lv++) {
    need += nxt;
    nxt = Math.round(nxt * 1.42);
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
