// ============================================================
// rules.js —— 无副作用的战斗 / 成长 / 图鉴计算
// ============================================================
import { CHARGE_MULT, MON_BASE, ELITE_GOLEM, ACH_LIST, WEAPONS, ARMORS, baseStats, BOSS, CAVE_BOSS, TRUE_BOSS, ELITE_GATE_LV, ELEM_MULT, SHIELD_MULT, DROP_EQUIP, DROP_POTION, DROP_MUSHROOM, DROP_ELIXIR, DROP_GOLD } from './data.js';

export function deep(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function cmdDmg(atk, def, mult, rollVariance) {
  const raw = Math.max(1, atk * 2 - def);
  return Math.round(raw * mult * (rollVariance ? 0.9 + Math.random() * 0.2 : 1));
}

export function elemMult(skill, enemy) {
  if (!skill || !skill.element || !enemy) return 1;
  // 读取单一数据源 ELEM_MULT（weak 1.35 / resist 0.7）：图鉴标注与帮助页同读此源，绝无第二套口径
  if (enemy.weak === skill.element) return ELEM_MULT.weak;
  if (enemy.resist === skill.element) return ELEM_MULT.resist;
  return 1;
}

export function skillDefUsed(skill, enemy) {
  let def = (enemy && enemy.def) || 0;
  if (skill && skill.pierce) def = Math.round(def * (1 - skill.pierce));
  return def;
}

// 石甲减伤（与 battle.attackMove / enemyAI 凝甲提示逐字同源，三处同读 SHIELD_MULT）：
// attackMove 命中时若敌方有石甲会把最终伤害再 ×SHIELD_MULT 取整（保底 1）并消耗 1 层；
// 伤害预览若不还原同一步，就会在石心魔像/洞窟领主凝甲时虚报伤害（≈N伤 比真实高出约 (1/0.6-1)≈67%），
// 玩家会误判「再一刀就破盾收掉」，实际却差出半刀。此处与真实结算同口径补上。
function withShield(dmg, enemy) {
  if (!enemy || (enemy.shield || 0) <= 0) return dmg;
  return Math.max(1, Math.round(dmg * SHIELD_MULT));
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

// Boss 报酬（单一数据源）：直读 data.js 的 BOSS / CAVE_BOSS / TRUE_BOSS，
// 真身/祸乱形态经 canonicalName 归一——图鉴「击败可得」标注与战斗结算同读同一份数据
const BOSS_DEFS = { '幽冥魔王': BOSS, '洞窟领主': CAVE_BOSS, '终焉之神': TRUE_BOSS };

export function monReward(name, level) {
  const lv = level || 1;
  const base = MON_BASE.find((m) => m.name === name);
  if (base) return { xp: base.xp[0] + lv * base.xp[1], gold: base.gold[0] + lv * base.gold[1] };
  if (name === ELITE_GOLEM.name) return { xp: ELITE_GOLEM.xp[0] + lv * ELITE_GOLEM.xp[1], gold: ELITE_GOLEM.gold[0] + lv * ELITE_GOLEM.gold[1] };
  const boss = BOSS_DEFS[canonicalName(name)];
  if (boss) return { xp: boss.xp, gold: boss.gold };
  return null;
}

// 试炼三连战通关奖励（单一数据源）：battle.winBattle 结算与此处逐字同源，
// 战斗预览行实时显示确切数额（随当前等级）——通关前一眼看清「三连战除了经验还值多少金币」
export function rushReward(level) {
  const lv = Math.max(0, (level | 0) || 0);
  return 150 + lv * 20;
}

// 图鉴「魔物强度」参考值（纯函数·随玩家等级）：与 battle.js 的 scaleEnemy / eliteEncounter 逐字同源，
// 与 monReward 报酬参考同口径——只取基准值（不含 village×0.9 / cave×1.2 地图倍率与困难模式 ×1.15/×1.12/×1.35），
// 供图鉴已讨伐行的「击败可得」参考该魔物在当前等级下的 HP/攻/防，一眼判断值不值得打/要不要防
export function codexStats(name, level) {
  const lv = Math.max(1, (level | 0) || 1);
  const base = MON_BASE.find((m) => m.name === name);
  if (base) return { hp: base.hp[0] + lv * base.hp[1], atk: base.atk[0] + lv * base.atk[1], def: base.def[0] + lv * base.def[1] };
  if (name === ELITE_GOLEM.name) return { hp: ELITE_GOLEM.hp[0] + lv * ELITE_GOLEM.hp[1], atk: ELITE_GOLEM.atk[0] + lv * ELITE_GOLEM.atk[1], def: ELITE_GOLEM.def[0] + lv * ELITE_GOLEM.def[1] };
  const boss = BOSS_DEFS[canonicalName(name)];
  if (boss) return { hp: boss.hp, atk: boss.atk, def: boss.def };
  return null;
}

// 魔物「出没等级门槛」（单一数据源·纯函数）：普通魔物读 MON_BASE.minLv（仅 树精/石魔像 为 3，其余缺省 1），
// 精英石心魔像读 ELITE_GATE_LV（battle.randomEncounter 精英分支与图鉴「Lv.3起出没」标注同读此源）；
// Boss（幽冥魔王/洞窟领主/终焉之神）为剧情遭遇无等级门槛、返回 1。图鉴已讨伐行的出没标注与遇敌分布自此同一份数据
export function spawnLv(name) {
  const base = MON_BASE.find((m) => m.name === name);
  if (base && base.minLv) return base.minLv;
  if (name === '石心魔像') return ELITE_GATE_LV;
  return 1;
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

// 战斗随机掉落（单一数据源）：随档位判定读 data.js DROP_*（装备 8% → 药水 12% → 蘑菇 12% → 灵药 6%，
// 合计 38%），battle.winBattle 结算调用，与帮助页「战斗掉落」标注同读此源——胜利后约 38% 触发：
// 8% 装备或+60金 · 12% 药水 · 12% 蘑菇/药水 · 6% 高级灵药，绝无第二套口径
export function rollDrop(hero, curMap) {
  const roll = Math.random();
  const edgePotion = DROP_EQUIP + DROP_POTION;             // 药水档上界（原 0.2）
  const edgeMushroom = edgePotion + DROP_MUSHROOM;         // 蘑菇档上界（原 0.32）
  const edgeElixir = edgeMushroom + DROP_ELIXIR;           // 灵药档上界（原 0.38）
  if (roll < DROP_EQUIP) {
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
    hero.gold += DROP_GOLD;
    return '✨ 宝箱：金币 +' + DROP_GOLD;
  }
  if (roll < edgePotion) {
    hero.item++;
    hero.drops = (hero.drops || 0) + 1;
    return '🍖 掉落：生命药水 ×1';
  }
  if (roll < edgeMushroom) {
    if (curMap === 'dungeon' || curMap === 'cave') {
      hero.mushrooms++;
      hero.drops = (hero.drops || 0) + 1;
      return '🍄 掉落：魔法蘑菇 ×1';
    }
    hero.item++;
    hero.drops = (hero.drops || 0) + 1;
    return '🍖 掉落：生命药水 ×1';
  }
  if (roll < edgeElixir) {
    hero.potion2 = (hero.potion2 || 0) + 1;
    hero.drops = (hero.drops || 0) + 1;
    return '🧪 掉落：高级灵药 ×1！';
  }
  return null;
}

// ============================================================
// 对话打字机节奏（单一数据源）：core.talkNext 补全判定与 view/menus.drawTalk
// 渲染同读这里——每字 TALK_CHAR_MS；标点（，。！？…—）停 4 拍，让台词有呼吸感
// ============================================================
export const TALK_CHAR_MS = 28;
const TALK_SLOW = new Set([...'，。！？…—']);
export function talkCharMs(ch) {
  return TALK_SLOW.has(ch) ? TALK_CHAR_MS * 4 : TALK_CHAR_MS;
}
// 本页打完所需总时长（ms）
export function pageTotalMs(page) {
  let t = 0;
  for (const line of page) for (const ch of line) t += talkCharMs(ch);
  return t;
}
// 给定经过 ms → 每行应显示的字数 + 是否整页打完
export function pageShownAt(page, elapsed) {
  let t = 0, done = true;
  const lines = page.map((line) => {
    let n = 0;
    for (const ch of line) {
      t += talkCharMs(ch);
      if (t <= elapsed) n++;
      else done = false;
    }
    return n;
  });
  return { lines, done };
}

// 对话行按可用像素宽自动折（纯显示辅助，measure 注入以便 Node 冒烟）：
// 返回 ≤ maxW 的片段数组；【…】金色强调块当整体不拆开（除非单块本身超宽才逐字兜底）。
// 绘图时只需按片段顺序落行，打字机预算（pageShownAt 的每行字数）沿片段顺序消耗即可。
export function wrapTalkLine(line, maxW, measure) {
  if (!line) return [];
  const segs = [];
  let cur = '';
  const pushCh = (ch) => {
    if (cur && measure(cur + ch) > maxW) { segs.push(cur); cur = ''; }
    cur += ch;
  };
  const parts = line.split(/(【[^】]*】)/);
  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith('【')) {
      // 金色块整体换行放置（保持金色不被打断层）
      if (cur && measure(cur + part) > maxW) { segs.push(cur); cur = ''; }
      if (measure(part) <= maxW) cur += part;
      else for (const ch of part) pushCh(ch);
      continue;
    }
    for (const ch of part) pushCh(ch);
  }
  if (cur) segs.push(cur);
  return segs;
}
