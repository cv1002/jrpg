// ============================================================
// world.js —— 地图 / 移动 / 交互
// 不 import view；boxMsg / renderHUD ← view/hud.js（经 bind.js）。
// 胜利清祭坛 applyVictoryWorld / loadMap 经 hooks.js 暴露给 battle；
// 踩到 NPC 时经 hooks.openTalk 调 core.js。
// 传送目的地读 data.js MAPS[].portals；遇敌增减读 ENCOUNTER；危险格读
// MAPS[].dangerTiles + loadMap 建立的 'G' 坐标集——单一数据源，无 ASCII 双轨。
// ============================================================
import { S, curMap } from './state.js';
import { TY, SOLID, MAPS, NPC_SPOTS, chToTy, BOSS, CAVE_BOSS, TRUE_BOSS, EMBER_GOLEM, CAVE_TREASURE, ENCOUNTER, CHEST_MUSHROOM, CHEST_GOLD, CHEST_GOLD_BASE, CHEST_GOLD_PER_LV, MUSHROOM_GOAL, ALTAR_LEAD_MS, ALTAR_TXT_MS } from './data.js';
import { SFX, resumeBgm } from './audio.js';
import { bind } from './bind.js';
import { hooks } from './hooks.js';
import { goto } from './scene.js';
import { deep } from './rules.js';
import { startBattle, startRush } from './battle.js';
import { randomEncounter } from './encounter.js';
import { buildShopList } from './shop.js';
import { setSideQuest } from './quests.js';

const WALK_MS = 180;

// 'G' 高草（危险格）坐标集：loadMap 建图时同步建立
const gCells = new Set();

function placeExtras(tiles, extras) {
  if (!extras) return;
  for (const extra of extras) {
    if (tiles[extra.y] && tiles[extra.y][extra.x] !== undefined) {
      tiles[extra.y][extra.x] = TY[extra.ty];
    }
  }
}

function applyReplaceTiles(tiles, replace) {
  if (!replace) return;
  const remap = {};
  for (const [fromName, toName] of Object.entries(replace)) {
    remap[TY[fromName]] = TY[toName];
  }
  for (let y = 0; y < tiles.length; y++) {
    for (let x = 0; x < tiles[y].length; x++) {
      const next = remap[tiles[y][x]];
      if (next !== undefined) tiles[y][x] = next;
    }
  }
}

function loadMap(name) {
  const mapDef = MAPS[name];
  if (S.G) S.G.map = name;
  const width = mapDef.rows[0].length;
  const tiles = [];
  gCells.clear();
  for (let y = 0; y < mapDef.rows.length; y++) {
    let row = mapDef.rows[y];
    while (row.length < width) row += '1';
    row = row.slice(0, width);
    tiles.push(row.split('').map(chToTy));
    for (let x = 0; x < width; x++) if (row[x] === 'G') gCells.add(x + ',' + y);
  }
  placeExtras(tiles, mapDef.extras);
  applyReplaceTiles(tiles, mapDef.replaceTiles);
  S.maze = tiles;
  if (S.G && S.G.caveBoss) revealCaveTreasure();
  return { w: width, h: S.maze.length };
}

function revealCaveTreasure() {
  if (!S.maze || !S.G || !S.G.caveBoss) return;
  for (const [x, y] of CAVE_TREASURE) {
    if (S.maze[y] && S.maze[y][x] !== undefined) S.maze[y][x] = TY.CHEST;
  }
}

function clearTiles(fromTy, toTy) {
  if (!S.maze) return;
  for (let y = 0; y < S.maze.length; y++) {
    for (let x = 0; x < S.maze[y].length; x++) {
      if (S.maze[y][x] === fromTy) S.maze[y][x] = toTy;
    }
  }
}

function applyVictoryWorld(result) {
  if (!result) return;
  if (result.type === 'cave-boss') {
    clearTiles(TY.MB, TY.CAVE);
    revealCaveTreasure();
    if (S.G && (!S.G.quests || S.G.quests.side_cart !== 'done')) {
      setSideQuest(S.G, 'side_cart', 'active');
    }
  }
  if (result.type === 'true-boss') clearTiles(TY.SB, TY.CAVE);
}
hooks.applyVictoryWorld = applyVictoryWorld;
hooks.loadMap = loadMap;

const MBounds = () => ({ w: S.maze[0].length, h: S.maze.length });

function at(x, y) {
  const maze = S.maze;
  if (!maze || y < 0 || x < 0 || y >= maze.length || x >= maze[y].length) return TY.TREE;
  return maze[y][x];
}

function walking() {
  if (!S.walk) return false;
  if (Date.now() - S.walk.t0 >= S.walk.dur) { S.walk = null; return false; }
  return true;
}

// 按住连走 + 预输入：heldDirs 由 main 的 keydown/keyup 维护（最后按下的方向优先）；
// 行走动画期间的按键记入 walkBuf，行走结束由 holdStep 立即补走
const DIRV = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] };
const heldDirs = [];
let walkBuf = null;

function setHeldDir(dir, on) {
  const i = heldDirs.indexOf(dir);
  if (on && i < 0) heldDirs.push(dir);
  else if (!on && i >= 0) heldDirs.splice(i, 1);
}

function clearHeld() {
  heldDirs.length = 0;
  walkBuf = null;
}

function holdStep() {
  if (S.scene !== 'world' || !S.G) { clearHeld(); return; }
  if (walking()) return;
  if (walkBuf) {
    const b = walkBuf;
    walkBuf = null;
    move(b.dx, b.dy);
    return;
  }
  const dir = heldDirs[heldDirs.length - 1];
  if (dir) move(DIRV[dir][0], DIRV[dir][1]);
}

export function facingCell() {
  const hero = S.G;
  let x = hero.x;
  let y = hero.y;
  if (S.dir === 'U') y--;
  else if (S.dir === 'D') y++;
  else if (S.dir === 'L') x--;
  else if (S.dir === 'R') x++;
  return { x, y, tile: at(x, y) };
}

function move(dx, dy) {
  if (walking()) { walkBuf = { dx, dy }; return; }
  const hero = S.G;
  const nx = hero.x + dx;
  const ny = hero.y + dy;
  S.dir = dy < 0 ? 'U' : (dy > 0 ? 'D' : (dx < 0 ? 'L' : 'R'));
  if (nx < 0 || ny < 0) return;
  if (SOLID.has(at(nx, ny))) return;
  const ox = hero.x;
  const oy = hero.y;
  hero.x = nx;
  hero.y = ny;
  S.walk = { ox, oy, nx, ny, t0: Date.now(), dur: WALK_MS };
  SFX.step();
  S.anim = null;
  onStep(nx, ny);
}

// 传送（单一数据源 MAPS[].portals）：锁判定 / 目的地 / 锁定文案全读表
function usePortal(tile) {
  const p = (MAPS[curMap()].portals || {})[tile === TY.GATE ? 'GATE' : 'EXIT'];
  if (!p) return;
  if (p.locked && p.locked(S.G)) { bind.boxMsg(p.lockedMsg, 2200); return; }
  SFX.door();
  transition(p.to);
}

function useGate() { usePortal(TY.GATE); }
function useExit() { usePortal(TY.EXIT); }

// 传送目的地（与 usePortal 同读 MAPS[].portals，纯函数不改任何状态）：
// 供视图层「踩上通行 → XX」提示使用，保证提示与真实传送行为永不分叉
function portalDest(mapName, tile) {
  const p = ((MAPS[mapName] || {}).portals || {})[tile === TY.GATE ? 'GATE' : 'EXIT'];
  return p ? p.to : null;
}

function tickEncounter(x, y) {
  if (dangerAt(x, y)) {
    S.encGauge = Math.min(ENCOUNTER.full, S.encGauge + ENCOUNTER.dangerMin + Math.floor(Math.random() * ENCOUNTER.dangerVar));
    if (S.encGauge >= ENCOUNTER.full) {
      S.encGauge = 0;
      startBattle(randomEncounter());
    }
  } else {
    const tile = at(x, y);
    if (tile === TY.FOUNTAIN) S.encGauge = Math.max(0, S.encGauge + ENCOUNTER.fountain);
    else S.encGauge = Math.max(0, S.encGauge + ENCOUNTER.calm);
  }
}

function onChestStep(x, y, hero) {
  // 已开过的宝箱格等同普通地面（维持既有行为：仍会走遇敌槽结算）
  if (hero.chests.has(x + ',' + y)) { tickEncounter(x, y); return; }
  hero.chests.add(x + ',' + y);
  // 开箱掉落（data.js CHEST_* 单一数据源）：与帮助页「宝箱掉落」标注同读此源，数值逐字不变——
  // 雾语林先判 60% 蘑菇，余 40% 再判 45% 金币（12+级×5），余 22% 药水；城镇/矿脉直接 45% 金币 / 55% 药水
  if (curMap() === 'dungeon' && Math.random() < CHEST_MUSHROOM) {
    hero.mushrooms++;
    SFX.item();
    bind.boxMsg(`🍄 找到魔法蘑菇！（共 ${hero.mushrooms} 株）`);
    if (hero.quests && hero.quests.side_mushroom === 'active' && hero.mushrooms >= MUSHROOM_GOAL) {
      setSideQuest(hero, 'side_mushroom', 'turnin');
      bind.boxMsg('💡 蘑菇集齐了！回去找灯长领取奖励吧！', 2400);
    }
  } else if (Math.random() < CHEST_GOLD) {
    const gold = CHEST_GOLD_BASE + hero.level * CHEST_GOLD_PER_LV;
    hero.gold += gold;
    SFX.coin();
    bind.boxMsg(`📦 宝箱！获得 ${gold} 金币`);
  } else {
    hero.item++;
    SFX.item();
    bind.boxMsg('📦 宝箱！获得 1 个🍖 生命药水');
  }
  bind.renderHUD();
}

function onFountainStep(x, y, hero) {
  S.encGauge = Math.max(0, S.encGauge + ENCOUNTER.fountain);
  if (hero.hp < hero.hpMax || hero.mp < hero.mpMax) {
    hero.hp = hero.hpMax;
    hero.mp = hero.mpMax;
    SFX.heal();
    bind.boxMsg('⛲ 喷泉清泉涌动，HP/MP 完全恢复！', 1600);
    bind.renderHUD();
  }
}

function onBossAltar(x, y, hero) {
  if (!hero.bossDefeated) {
    bind.boxMsg('👿 雾里走出一个穿旧袍的影子……幽冥魔王！', ALTAR_TXT_MS);
    setTimeout(() => { if (S.scene === 'world') startBattle(deep(BOSS)); }, ALTAR_LEAD_MS);
  }
}

function onCaveAltar(x, y, hero) {
  // 无字回廊中段：残焰魔像（可重复挑战的精英守门）
  if (curMap() === 'gallery') {
    bind.boxMsg('🔥 灰烬拢成一具燃烧的空壳——残焰魔像！', ALTAR_TXT_MS);
    setTimeout(() => { if (S.scene === 'world') startBattle(deep(EMBER_GOLEM)); }, ALTAR_LEAD_MS);
    return;
  }
  if (!hero.caveBoss) {
    bind.boxMsg('👹 矿脉深处，星井的守者现身——洞窟领主！', ALTAR_TXT_MS);
    setTimeout(() => { if (S.scene === 'world') startBattle(deep(CAVE_BOSS)); }, ALTAR_LEAD_MS);
  }
}

function onTrueCrystal(x, y, hero) {
  // 终焉水晶是「门」：双徽记开启通往无字回廊的路；终焉之战在回廊尽头（TY.SB 祭坛）
  if (curMap() === 'gallery') {
    if (!hero.trueBoss) {
      bind.boxMsg('✦ 回廊尽头，所有的名字一齐看向你。终焉之神醒了。', 1800);
      setTimeout(() => { if (S.scene === 'world') startBattle(deep(TRUE_BOSS)); }, 700);
    }
    return;
  }
  if (hero.trueBoss) {
    bind.boxMsg('💠 水晶空了。回廊的门安静地敞着。', 1800);
    return;
  }
  if (hero.bossDefeated && hero.caveBoss) {
    bind.boxMsg('✦ 水晶睁开了眼。门开了——通向存放名字的回廊。', 1800);
    hero.galleryOpen = true;
    setTimeout(() => { if (S.scene === 'world') transition('gallery'); }, 700);
  } else {
    bind.boxMsg('💠 水晶沉睡着。它在等两份记得的资格。', 1800);
  }
}

function onTrialStele(x, y, hero) {
  if (hero.bossDefeated && hero.caveBoss) startRush();
  else bind.boxMsg('…试炼碑需要两枚徽记（幽冥魔王 + 洞窟领主）。', 1800);
}

// 踩格处理表：onStep 查表分发，默认走遇敌槽
const STEP_HANDLERS = {
  [TY.CHEST]: onChestStep,
  [TY.FOUNTAIN]: onFountainStep,
  [TY.BOSS]: onBossAltar,
  [TY.MB]: onCaveAltar,
  [TY.SB]: onTrueCrystal,
  [TY.TRIAL]: onTrialStele,
};

function onStep(x, y) {
  const tile = at(x, y);
  if (tile === TY.GATE) { useGate(); return; }
  if (tile === TY.EXIT) { useExit(); return; }
  const handler = STEP_HANDLERS[tile];
  if (handler) handler(x, y, S.G);
  else tickEncounter(x, y);
}

function dangerAt(x, y) {
  if (gCells.has(x + ',' + y)) return true;
  const dt = MAPS[curMap()].dangerTiles;
  return !!(dt && dt.includes(at(x, y)));
}

function interact() {
  const hero = S.G;
  const { x, y, tile } = facingCell();
  if (tile === TY.NPC) {
    SFX.select();
    hooks.openTalk(NPC_SPOTS[x + ',' + y] || 'chief');
    return;
  }
  if (tile === TY.STELE) {
    SFX.select();
    hooks.openTalk(NPC_SPOTS[x + ',' + y] || 'stele1');
    return;
  }
  if (tile === TY.BREW) { SFX.shop(); goto('brew'); return; }
  if (tile === TY.SHOP) { SFX.shop(); buildShopList(); goto('shop'); return; }
  if (tile === TY.INN) { goto('inn'); return; }
  if (tile === TY.GATE) { useGate(); return; }
  if (tile === TY.EXIT) { useExit(); return; }
  if (tile === TY.BOSS && !hero.bossDefeated && S.scene === 'world') {
    startBattle(deep(BOSS));
    return;
  }
  bind.boxMsg('（这里没什么特别的）', 1200);
}

function transition(name) {
  loadMap(name);
  clearHeld();
  if (S.G.visited && !S.G.visited.includes(name)) S.G.visited.push(name);
  const start = MAPS[name].playerStart;
  S.G.x = start.x;
  S.G.y = start.y;
  S.walk = null;
  bind.renderHUD();
  resumeBgm();
  bind.boxMsg(`进入了【${MAPS[curMap()].name}】`, 1200);
}

export {
  loadMap, MBounds, at, move, useGate, useExit, onStep, dangerAt,
  interact, transition, CAVE_TREASURE, revealCaveTreasure,
  applyVictoryWorld, walking, WALK_MS, portalDest,
  holdStep, setHeldDir, clearHeld, STEP_HANDLERS,
};
