// ============================================================
// world.js —— 地图 / 移动 / 交互
// 不 import view；胜利清祭坛由 bind.applyVictoryWorld 注册为本模块函数。
// boxMsg / renderHUD / openTalk ← view/hud.js、core.js
// ============================================================
import { S } from './state.js';
import { TY, SOLID, MAPS, NPC_SPOTS, chToTy, BOSS, CAVE_BOSS, TRUE_BOSS, CAVE_TREASURE } from './data.js';
import { SFX, resumeBgm } from './audio.js';
import { bind } from './bind.js';
import { goto } from './scene.js';
import { startBattle, randomEncounter, deep, startRush } from './battle.js';
import { buildShopList } from './shop.js';
import { setSideQuest } from './quests.js';

const WALK_MS = 180;

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
  S.curMap = name;
  if (S.G) S.G.map = name;
  const width = mapDef.rows[0].length;
  const tiles = [];
  for (let y = 0; y < mapDef.rows.length; y++) {
    let row = mapDef.rows[y];
    while (row.length < width) row += '1';
    row = row.slice(0, width);
    tiles.push(row.split('').map(chToTy));
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
bind.applyVictoryWorld = applyVictoryWorld;
bind.loadMap = loadMap;

const MBounds = () => ({ w: S.maze[0].length, h: S.maze.length });

function at(x, y) {
  const maze = S.maze;
  if (!maze || y < 0 || x < 0 || y >= maze.length || x >= maze[y].length) return TY.TREE;
  return maze[y][x];
}

function charAt(x, y) {
  const maze = S.maze;
  if (!maze || y < 0 || x < 0 || y >= maze.length || x >= maze[y].length) return '1';
  return maze[y][x] === undefined ? '1' : MAPS[S.curMap].rows[y][x];
}

function walking() {
  return !!(S.walk && Date.now() - S.walk.t0 < S.walk.dur);
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
  if (walking()) return;
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

function useGate() {
  const hero = S.G;
  if (S.curMap === 'village') {
    if (hero.bossDefeated) {
      bind.boxMsg('雾退了。祭坛上的锁已经开了。可井还在响。', 2200);
      return;
    }
    SFX.door();
    transition('dungeon');
    return;
  }
  if (S.curMap === 'dungeon') {
    SFX.door();
    transition('cave');
  }
}

function useExit() {
  SFX.door();
  transition(S.curMap === 'dungeon' ? 'village' : 'dungeon');
}

// 传送目的地（与 useGate/useExit 逐字同源，纯函数不改任何状态）：
// 供视图层「踩上通行 → XX」提示使用，保证提示与真实传送行为永不分叉
function portalDest(curMap, tile) {
  if (tile === TY.EXIT) return curMap === 'dungeon' ? 'village' : 'dungeon';
  if (tile === TY.GATE) {
    if (curMap === 'village') return 'dungeon';
    if (curMap === 'dungeon') return 'cave';
  }
  return null;
}

function tickEncounter(x, y) {
  if (dangerAt(x, y)) {
    S.encGauge = Math.min(100, S.encGauge + 10 + Math.floor(Math.random() * 9));
    if (S.encGauge >= 100) {
      S.encGauge = 0;
      startBattle(randomEncounter());
    }
  } else {
    const tile = at(x, y);
    if (tile === TY.FOUNTAIN) S.encGauge = Math.max(0, S.encGauge - 25);
    else S.encGauge = Math.max(0, S.encGauge - 6);
  }
}

function onStep(x, y) {
  const hero = S.G;
  const tile = at(x, y);
  if (tile === TY.GATE) { useGate(); return; }
  if (tile === TY.EXIT) { useExit(); return; }
  if (tile === TY.CHEST && !hero.chests.has(x + ',' + y)) {
    hero.chests.add(x + ',' + y);
    if (S.curMap === 'dungeon' && Math.random() < 0.6) {
      hero.mushrooms++;
      SFX.item();
      bind.boxMsg(`🍄 找到魔法蘑菇！（共 ${hero.mushrooms} 株）`);
      if (hero.quests && hero.quests.side_mushroom === 'active' && hero.mushrooms >= 3) {
        setSideQuest(hero, 'side_mushroom', 'turnin');
        bind.boxMsg('💡 蘑菇集齐了！回去找灯长领取奖励吧！', 2400);
      }
    } else if (Math.random() < 0.45) {
      const gold = 12 + hero.level * 5;
      hero.gold += gold;
      SFX.coin();
      bind.boxMsg(`📦 宝箱！获得 ${gold} 金币`);
    } else {
      hero.item++;
      SFX.item();
      bind.boxMsg('📦 宝箱！获得 1 个🍖 生命药水');
    }
    bind.renderHUD();
  } else if (tile === TY.FOUNTAIN) {
    S.encGauge = Math.max(0, S.encGauge - 25);
    if (hero.hp < hero.hpMax || hero.mp < hero.mpMax) {
      hero.hp = hero.hpMax;
      hero.mp = hero.mpMax;
      SFX.heal();
      bind.boxMsg('⛲ 喷泉清泉涌动，HP/MP 完全恢复！', 1600);
      bind.renderHUD();
    }
  } else if (tile === TY.BOSS) {
    if (!hero.bossDefeated) {
      bind.boxMsg('👿 雾里走出一个穿旧袍的影子……幽冥魔王！', 1600);
      setTimeout(() => { if (S.scene === 'world') startBattle(deep(BOSS)); }, 600);
    }
  } else if (tile === TY.MB) {
    if (!hero.caveBoss) {
      bind.boxMsg('👹 矿脉深处，星井的守者现身——洞窟领主！', 1600);
      setTimeout(() => { if (S.scene === 'world') startBattle(deep(CAVE_BOSS)); }, 600);
    }
  } else if (tile === TY.SB) {
    if (!hero.trueBoss) {
      if (hero.bossDefeated && hero.caveBoss) {
        bind.boxMsg('✦ 水晶睁开了眼。那是灯。那是终焉之神。', 1800);
        setTimeout(() => { if (S.scene === 'world') startBattle(deep(TRUE_BOSS)); }, 700);
      } else {
        bind.boxMsg('💠 水晶沉睡着。它在等两份记得的资格。', 1800);
      }
    }
  } else if (tile === TY.TRIAL) {
    if (hero.bossDefeated && hero.caveBoss) startRush();
    else bind.boxMsg('…试炼碑需要两枚徽记（幽冥魔王 + 洞窟领主）。', 1800);
  } else {
    tickEncounter(x, y);
  }
}

function dangerAt(x, y) {
  const ch = charAt(x, y);
  return ch === 'G'
    || (S.curMap === 'dungeon' && at(x, y) === TY.GRASS)
    || (S.curMap === 'cave' && at(x, y) === TY.CAVE);
}

function interact() {
  const hero = S.G;
  const { x, y, tile } = facingCell();
  if (tile === TY.NPC) {
    SFX.select();
    bind.openTalk(NPC_SPOTS[x + ',' + y] || 'chief');
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
  bind.boxMsg(charAt(x, y) === 'S' ? '' : '（这里没什么特别的）', 1200);
}

function transition(name) {
  loadMap(name);
  if (S.G.visited && !S.G.visited.includes(name)) S.G.visited.push(name);
  const start = MAPS[name].playerStart;
  S.G.x = start.x;
  S.G.y = start.y;
  S.walk = null;
  bind.renderHUD();
  resumeBgm();
  bind.boxMsg(`进入了【${MAPS[S.curMap].name}】`, 1200);
}

function restoreChestGrid() {}

export {
  loadMap, MBounds, at, charAt, move, useGate, useExit, onStep, dangerAt,
  interact, transition, restoreChestGrid, CAVE_TREASURE, revealCaveTreasure,
  applyVictoryWorld, walking, WALK_MS, portalDest,
};
