// ============================================================
// encounter.js —— 遇敌生成（从 battle.js 拆出）
// 成长基准读 data.js MON_BASE / ELITE_GOLEM，权重读 MON_BASE[].w 与 minLv，
// 区域修正读 MAPS.zone——图鉴 codexStats / monReward / spawnLv 同读同一份数据
// ============================================================
import { S, curMap } from './state.js';
import { MAPS, MON_BASE, ELITE_GOLEM, ELITE_GATE_LV, withSpecies } from './data.js';
import { deep } from './rules.js';

export function scaleEnemy(template, level) {
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

export function eliteEncounter() {
  const enemy = withSpecies(scaleEnemy(ELITE_GOLEM, S.G.level));
  enemy.isElite = true;
  enemy.hpMax = enemy.hp;
  return enemy;
}

// 出没权重（单一数据源）：读 MON_BASE[].w(lv) 与 minLv——与图鉴「Lv.X起出没」标注同读同一份数据
export function encounterWeight(base, level) {
  if (level < (base.minLv || 1)) return 0;
  return base.w(level);
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

export function randomEncounter() {
  const level = S.G.level;
  if (curMap() === 'dungeon' && S.G.level >= ELITE_GATE_LV && Math.random() < 0.07) return eliteEncounter();
  // 分图遇敌池（data.js MAPS[].pool 单一数据源）：无字回廊只出雾灵/石魔像/骷髅兵
  const poolDef = MAPS[curMap()].pool;
  const source = poolDef ? MON_BASE.filter((m) => poolDef.includes(m.name)) : MON_BASE;
  const pool = source.map((m) => scaleEnemy(m, level));
  const weights = source.map((m) => encounterWeight(m, level));
  const enemy = deep(pool[pickWeightedIndex(weights)]);
  // 区域修正（data.js MAPS.zone 单一数据源）：cave 魔物变强/报酬上浮、village 魔物偏弱——与 HUD 区域标注同源
  const zone = MAPS[curMap()] && MAPS[curMap()].zone;
  if (zone) {
    if (zone.hp) enemy.hp = Math.round(enemy.hp * zone.hp);
    if (zone.atk) enemy.atk = Math.round(enemy.atk * zone.atk);
    if (zone.def) enemy.def = Math.round(enemy.def * zone.def);
    if (zone.xp) enemy.xp = Math.round(enemy.xp * zone.xp);
    if (zone.gold) enemy.gold = Math.round(enemy.gold * zone.gold);
  }
  enemy.hpMax = enemy.hp;
  return enemy;
}
