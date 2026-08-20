// ============================================================
// rules.js —— 无副作用的战斗 / 成长 / 图鉴计算
// ============================================================
import { SKILL_DATA, CHARGE_MULT, MON_BASE, SPECIES, ACH_LIST, WEAPONS, ARMORS, baseStats, BOSS, CAVE_BOSS, TRUE_BOSS } from './data.js';

export function deep(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function cmdDmg(atk, def, mult, rollVariance) {
  const raw = Math.max(1, atk * 2 - def);
  return Math.round(raw * mult * (rollVariance ? 0.9 + Math.random() * 0.2 : 1));
}

export function elemMult(skill, enemy) {
  if (!skill || !skill.element || !enemy) return 1;
  if (enemy.weak === skill.element) return 1.35;
  if (enemy.resist === skill.element) return 0.7;
  return 1;
}

export function skillDefUsed(skill, enemy) {
  let def = (enemy && enemy.def) || 0;
  if (skill && skill.pierce) def = Math.round(def * (1 - skill.pierce));
  return def;
}

// 石甲减伤（与 battle.attackMove 逐字同源）：
// attackMove 命中时若敌方有石甲会把最终伤害再 ×0.6 取整（保底 1）并消耗 1 层；
// 伤害预览若不还原同一步，就会在石心魔像/洞窟领主凝甲时虚报伤害（≈N伤 比真实高出约 67%），
// 玩家会误判「再一刀就破盾收掉」，实际却差出半刀。此处与真实结算同口径补上。
function withShield(dmg, enemy) {
  if (!enemy || (enemy.shield || 0) <= 0) return dmg;
  return Math.max(1, Math.round(dmg * 0.6));
}

export function atkEstimate(hero, enemy) {
  if (!hero) return 1;
  const raw = Math.max(1, (hero.atkMax || 0) * 2 - ((enemy && enemy.def) ? enemy.def : 0));
  return withShield(Math.round(raw * (hero.charge ? CHARGE_MULT : 1)), enemy);
}

export function skillEstimate(hero, enemy, skill) {
  if (!skill) return 0;
  if (skill.kind === 'heal') return Math.round((hero.hpMax || 0) * skill.heal);
  let dmg = cmdDmg(hero.atkMax || 0, skillDefUsed(skill, enemy), 1, false) * skill.mult;
  dmg *= elemMult(skill, enemy || {});
  if (enemy && enemy.phase2 && skill.trueBonus) dmg *= skill.trueBonus;
  if (hero.charge) dmg *= CHARGE_MULT;
  return withShield(Math.round(dmg), enemy);
}

const BOSS_REWARD = {
  '幽冥魔王': [150, 300],
  '洞窟领主': [120, 200],
  '终焉之神': [400, 600],
};

export function monReward(name, level) {
  const lv = level || 1;
  const base = MON_BASE.find((m) => m.name === name);
  if (base) return { xp: base.xp[0] + lv * base.xp[1], gold: base.gold[0] + lv * base.gold[1] };
  if (name === '石心魔像') return { xp: 40 + lv * 6, gold: 45 + lv * 6 };
  for (const key in BOSS_REWARD) {
    if (name === key || name === key + '·真身' || name === key + ' ·真身' || name === key + '·祸乱形态') {
      return { xp: BOSS_REWARD[key][0], gold: BOSS_REWARD[key][1] };
    }
  }
  return null;
}

// 图鉴「魔物强度」参考值（纯函数·随玩家等级）：与 battle.js 的 scaleEnemy / eliteEncounter 逐字同源，
// 与 monReward 报酬参考同口径——只取基准值（不含 village×0.9 / cave×1.2 地图倍率与困难模式 ×1.15/×1.12/×1.35），
// 供图鉴已讨伐行的「击败可得」参考该魔物在当前等级下的 HP/攻/防，一眼判断值不值得打/要不要防
const BOSS_STAT = {
  '幽冥魔王': () => BOSS,
  '洞窟领主': () => CAVE_BOSS,
  '终焉之神': () => TRUE_BOSS,
};

export function codexStats(name, level) {
  const lv = Math.max(1, (level | 0) || 1);
  const base = MON_BASE.find((m) => m.name === name);
  if (base) return { hp: base.hp[0] + lv * base.hp[1], atk: base.atk[0] + lv * base.atk[1], def: base.def[0] + lv * base.def[1] };
  if (name === '石心魔像') return { hp: 58 + lv * 10, atk: 12 + lv * 3, def: 15 + lv * 2 };
  for (const key in BOSS_STAT) {
    if (name === key || name === key + '·真身' || name === key + ' ·真身' || name === key + '·祸乱形态') {
      const b = BOSS_STAT[key]();
      return { hp: b.hp, atk: b.atk, def: b.def };
    }
  }
  return null;
}

export function canonicalName(name) {
  if (!name) return name;
  if (name === '幽冥魔王·真身' || name === '幽冥魔王 ·真身') return '幽冥魔王';
  if (name === '洞窟领主·真身' || name === '洞窟领主 ·真身') return '洞窟领主';
  if (name === '终焉之神·真身' || name === '终焉之神 ·真身' || name === '终焉之神·祸乱形态') return '终焉之神';
  return name;
}

export function applyStats(hero) {
  const base = baseStats(hero.level);
  hero.hpMax = base.hpMax;
  hero.mpMax = base.mpMax;
  hero.atkMax = base.atk + WEAPONS[hero.weapon].atk;
  hero.defMax = base.def + ARMORS[hero.armor].def;
  if (typeof hero.hp !== 'number' || hero.hp > hero.hpMax || hero.hp <= 0) hero.hp = hero.hpMax;
  if (typeof hero.mp !== 'number' || hero.mp > hero.mpMax) hero.mp = hero.mpMax;
}

export function unlockedAchievements(hero) {
  if (!hero) return [];
  const got = hero.ach || [];
  const newly = [];
  for (const ach of ACH_LIST) {
    if (got.includes(ach.id) || newly.includes(ach.id)) continue;
    if (ach.ok(hero)) newly.push(ach.id);
  }
  return newly;
}

export function skillHintLine(name) {
  const skill = SKILL_DATA[name];
  return skill && skill.hint ? skill.hint : '';
}

export function speciesOf(name) {
  return SPECIES[canonicalName(name)] || SPECIES[name] || {};
}
