// v22.42 专项冒烟：雾语林蘑菇田「菌盖灯油」景观（新内容·世界景观·纯显示）——蘑菇田（拾菇人
// 「蘑菇是灯油：菌盖夜里发光、两株能熬一瓶高级灵药」/失名的旅人/货郎的灯油营生全在说它）自 v22.40
// 高草显形后只是一片深绿高草，画面仍看不出「菌盖」二字；现仅雾语林（curMap()==='dungeon'）的高草格
// （isTallGrass 与 dangerAt 同读 gCells 单一数据源）按坐标哈希 (x*7+y*13)%4===0 稀疏点缀 1 组菌盖
// 灯油：伞柄米色 #e8c9a0 · 伞盖灯油金 #ffd24a · 盖缘深金 #8a5a00 · 高光金白 #ffe9a8（全部既有色族
// 零新增颜色族，与草簇/小花同一哈希确定性手法）；纯显示零结算零存档零数值变化（危险/遇敌/踩踏判定
// 逐字未动），village 粮田/洞窟岩地不触发。本冒烟守护：版本锚点、drawWorld.js 源级落位（v22.42 菌盖
// 分支 + 既有高草分支/小花/草痕逐字零回归）、运行期实证（dungeon 渲染捕获：已知格 (18,2)/非 (16,2)
// 逐色逐坐标 + 视野内菌盖数与哈希公式逐格一致 + village/cave 零菌盖）、契约（at(18,2)===TY.GRASS /
// isTallGrass 与 gCells 同源 / NPC 总数 30 零变更 / loadMap 重载重建）、README/package.json/CHANGELOG
// 同步（tests 树尾/件套口径 138/v22.42 守护描述/入库 138 份/地图行/视觉 bullet）、姊妹件套 pin
// （v2241..v2226 随新现实更新，含 v2228/v2229/v2230 三风格锚）复查 + 旧代 v22.41 字面量/恒等/件套/
// 串尾 pin 全库零残留 + 坏链防回归。
import { S } from '../js/state.js';
import { GAME_VERSION, NPC_SPOTS, TY, SOLID, MAPS } from '../js/data.js';
import { newGame } from '../js/core.js';
import { loadMap, at, isTallGrass } from '../js/world.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— DOM 桩（承 v21.30-v22.41 冒烟先例：先装桩再 import main.js；fillRect 捕获供菌盖断言）——
const noop = () => {};
function makeCtx() {
  const grad = { addColorStop: noop };
  return {
    canvas: { width: 640, height: 480 },
    measureText: (t) => ({ width: String(t).length * 8 }),
    createLinearGradient: () => grad, createRadialGradient: () => grad, createConicGradient: () => grad, createPattern: () => ({}),
    beginPath: noop, closePath: noop, moveTo: noop, lineTo: noop, arc: noop, arcTo: noop, ellipse: noop,
    quadraticCurveTo: noop, bezierCurveTo: noop, fill: noop, stroke: noop, fillRect: noop, strokeRect: noop,
    clearRect: noop, drawImage: noop, save: noop, restore: noop, translate: noop, rotate: noop, scale: noop,
    transform: noop, setTransform: noop, clip: noop, rect: noop, setLineDash: noop, getLineDash: () => [],
    isPointInPath: () => false,
    globalAlpha: 1, strokeStyle: '#000', fillStyle: '#000', font: '', textAlign: 'left', textBaseline: 'alphabetic',
    lineWidth: 1, imageSmoothingEnabled: false,
    fillText: noop,
  };
}
function mkEl(id) {
  const cl = { add: noop, remove: noop, contains: () => false, toggle: noop };
  return { textContent: '', style: {}, className: '', id, width: 640, height: 480,
    getContext: () => makeCtx(), classList: cl, parentElement: { classList: cl }, addEventListener: noop };
}
const els = {};
globalThis.document = {
  getElementById: (id) => { if (!els[id]) els[id] = mkEl(id); return els[id]; },
  createElement: (tag) => tag === 'canvas'
    ? { width: 32, height: 32, getContext: () => makeCtx(), style: {}, classList: { add: noop, remove: noop } }
    : { style: {}, classList: { add: noop, remove: noop } },
  addEventListener: noop,
  documentElement: { style: {} },
};
function FakeAudio() { return { currentTime: 0, destination: {},
  createOscillator: () => ({ connect: noop, start: noop, stop: noop, type: '',
    frequency: { setValueAtTime: noop, exponentialRampToValueAtTime: noop } }),
  createGain: () => ({ connect: noop,
    gain: { value: 1, setValueAtTime: noop, linearRampToValueAtTime: noop, exponentialRampToValueAtTime: noop } }),
  createBuffer: () => ({}), createBufferSource: () => ({ connect: noop, start: noop }),
  createPeriodicWave: () => ({}), resume: noop }; }
globalThis.window = { addEventListener: noop, AudioContext: FakeAudio, webkitAudioContext: FakeAudio };
const mem = {};
globalThis.localStorage = {
  getItem: (k) => Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null,
  setItem: (k, v) => { mem[k] = String(v); },
  removeItem: (k) => { delete mem[k]; },
};
globalThis.setInterval = () => 0;
globalThis.clearInterval = () => {};

await import('../js/main.js');
const { drawWorld, cam } = await import('../js/view/drawWorld.js');
const { CTX } = await import('../js/view/canvas.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.42 雾语林蘑菇田菌盖灯油景观 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const wSrc = fs.readFileSync(path.join(ROOT, 'js/view/drawWorld.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.41 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.41（本版守 v22.42）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 42)), GAME_VERSION);
ok('data.js 含 v22.42 注释（菌盖灯油说明）', dSrc.includes('v22.42 新内容·世界景观·纯显示'));
ok('GAME_VERSION 字面量已为 v22.42（旧 v22.41 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v23.02';") && !dSrc.includes("const GAME_VERSION = 'v22." + "41';"));
ok('data.js 仍保留 v22.41 世代注释链（名字之门/高草/大灯/星井/星砂车累积注释未动）',
  dSrc.includes('v22.41 无字回廊「名字之门」') || wSrc.includes('v22.41 名字之门'));

// —— drawWorld.js 源级落位：菌盖灯油分支（纯显示·仅雾语林高草·坐标哈希确定性）——
const T = 32;
ok('drawWorld.js 含 v22.42 注释（菌盖灯油说明）', wSrc.includes('v22.42 雾语林蘑菇田「菌盖灯油」'));
ok('drawWorld.js 菌盖分支（curMap()===\'dungeon\' && (x*7+y*13)%4===0）', wSrc.includes("if (curMap() === 'dungeon' && (x * 7 + y * 13) % 4 === 0) {"));
ok('drawWorld.js 菌盖色板 #ffd24a 伞盖/#8a5a00 盖缘/#e8c9a0 伞柄/#ffe9a8 高光',
  wSrc.includes("CTX.fillStyle = '#ffd24a';") && wSrc.includes("CTX.fillStyle = '#8a5a00';") &&
  wSrc.includes("CTX.fillStyle = '#e8c9a0';") && wSrc.includes("CTX.fillStyle = '#ffe9a8';"));
ok('drawWorld.js 菌盖几何（伞盖 17×8 @(px+8,py+9)）',
  wSrc.includes('CTX.fillRect(px + 8, py + 9, 17, 8);') && wSrc.includes('CTX.fillRect(px + 8, py + 15, 17, 2);') &&
  wSrc.includes('CTX.fillRect(px + 15, py + 16, 3, 6);') && wSrc.includes('CTX.fillRect(px + 11, py + 11, 4, 2);'));
ok('drawWorld.js 既有高草分支逐字零回归（isTallGrass 分流/草簇色板/小花/草痕健在）',
  wSrc.includes('if (isTallGrass(x, y)) {') && wSrc.includes("CTX.fillStyle = '#245a24';") &&
  wSrc.includes("CTX.fillStyle = '#56a656';") && wSrc.includes("'rgba(232,238,241,.85)'") &&
  wSrc.includes("'rgba(20,60,20,.35)'"));

// —— 运行期渲染捕获：菌盖逐像素色与坐标（承 v22.40 草簇捕获同法）——
function captureMap(mapName, heroX, heroY) {
  const origFR = CTX.fillRect;
  const rects = [];
  CTX.fillRect = (x, y, w, h) => {
    rects.push({ x, y, w, h, fs: String(CTX.fillStyle) });
    return origFR.call(CTX, x, y, w, h);
  };
  try {
    S.G = newGame('测试');
    S.G.map = mapName;
    S.G.x = heroX; S.G.y = heroY;
    S.dir = 'R';
    S.scene = 'world';
    S.walk = null;
    loadMap(mapName);
    drawWorld();
  } catch (e) { rects.push({ fs: 'THREW:' + e.message, x: -1, y: -1, w: 0, h: 0 }); }
  CTX.fillRect = origFR;
  return { rects, cam: cam() };
}
// 菌盖公式镜像（与 drawWorld.js 逐字同式）：(x*7+y*13)%4===0
function mushAt(x, y) { return (x * 7 + y * 13) % 4 === 0; }
function hasCap(rects, c, tx, ty) {
  const px = tx * T - c.x, py = ty * T - c.y;
  return rects.some((q) => q.fs === '#ffd24a' && q.w === 17 && q.h === 8 &&
    Math.abs(q.x - (px + 8)) <= 1 && Math.abs(q.y - (py + 9)) <= 1);
}
function capCountInTile(rects, c, tx, ty, fs) {
  const px = tx * T - c.x, py = ty * T - c.y;
  return rects.filter((q) => q.fs === fs && q.x >= px - 1 && q.x < px + 33 && q.y >= py - 1 && q.y < py + 33 &&
    !(q.x === -1 && q.y === -1)).length;
}

// dungeon：蘑菇田格 (18,2) 应为菌盖格（18*7+2*13=152, %4===0），(16,2) 应非（138%4===2）
{
  const cap = captureMap('dungeon', 14, 3);
  ok('dungeon 运行期：无抛错（drawWorld 全链路）', !cap.rects.some((r) => r.fs.startsWith('THREW:')),
    JSON.stringify(cap.rects.filter((r) => r.fs.startsWith('THREW:'))));
  const c0 = cap.cam;
  const t = (x, y, fs) => ({ x: x * T - c0.x, y: y * T - c0.y, fs });
  ok('dungeon 运行期：蘑菇田 (18,2) 伞盖 #ffd24a（17×8）落位', hasCap(cap.rects, c0, 18, 2),
    JSON.stringify(cap.rects.filter((r) => r.fs === '#ffd24a' && r.w === 17 && r.h === 8).slice(0, 3)));
  ok('dungeon 运行期：蘑菇田 (18,2) 盖缘 #8a5a00（17×2）落位', cap.rects.some((q) => q.fs === '#8a5a00' &&
    Math.abs(q.x - (18 * T - c0.x + 8)) <= 1 && Math.abs(q.y - (2 * T - c0.y + 15)) <= 1 && q.w === 17 && q.h === 2));
  ok('dungeon 运行期：蘑菇田 (18,2) 伞柄 #e8c9a0（3×6）落位', cap.rects.some((q) => q.fs === '#e8c9a0' &&
    Math.abs(q.x - (18 * T - c0.x + 15)) <= 1 && Math.abs(q.y - (2 * T - c0.y + 16)) <= 1 && q.w === 3 && q.h === 6));
  ok('dungeon 运行期：蘑菇田 (18,2) 高光 #ffe9a8（4×2）落位', cap.rects.some((q) => q.fs === '#ffe9a8' &&
    Math.abs(q.x - (18 * T - c0.x + 11)) <= 1 && Math.abs(q.y - (2 * T - c0.y + 11)) <= 1 && q.w === 4 && q.h === 2));
  ok('dungeon 运行期：(16,2) 零菌盖（哈希 138%4===2 确定性子集）', !hasCap(cap.rects, c0, 16, 2));
  // 视野内菌盖总数与哈希公式逐格一致（纳入视口 x>=cam 起点，实测全图 G 格均落入）
  const rows = MAPS.dungeon.rows;
  let expected = 0;
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[0].length; x++) {
      if (rows[y][x] === 'G' && mushAt(x, y)) expected++;
    }
  }
  const actual = cap.rects.filter((r) => r.fs === '#ffd24a' && r.w === 17 && r.h === 8 && !(r.x === -1 && r.y === -1)).length;
  ok('dungeon 运行期：视野内菌盖数 = 哈希公式逐格预期（' + expected + '）', actual === expected,
    String(actual) + ' vs ' + String(expected));
  ok('dungeon 运行期：普通草格零菌盖（(2,5) 无 #ffd24a 17×8）', capCountInTile(cap.rects, c0, 2, 5, '#ffd24a') === 0);
}

// village：粮田高草仍画草簇但零菌盖（curMap 门不触发）
{
  const cap = captureMap('village', 13, 5);
  ok('village 运行期：无抛错（drawWorld 全链路）', !cap.rects.some((r) => r.fs.startsWith('THREW:')),
    JSON.stringify(cap.rects.filter((r) => r.fs.startsWith('THREW:'))));
  ok('village 运行期：零菌盖（无 17×8 #ffd24a——粮田不走菌盖分支）',
    !cap.rects.some((r) => r.fs === '#ffd24a' && r.w === 17 && r.h === 8));
  ok('village 运行期：北侧高草 (17,3) 草簇仍逐格落位（v22.40 零回归）',
    cap.rects.some((q) => q.fs === '#245a24') && cap.rects.some((q) => q.fs === '#56a656'));
}

// cave：岩地零菌盖（GRASS 已被 replaceTiles 换走）
{
  const cap = captureMap('cave', 3, 2);
  ok('cave 运行期：无抛错（drawWorld 全链路）', !cap.rects.some((r) => r.fs.startsWith('THREW:')),
    JSON.stringify(cap.rects.filter((r) => r.fs.startsWith('THREW:'))));
  ok('cave 运行期：零菌盖（无 17×8 #ffd24a）', !cap.rects.some((r) => r.fs === '#ffd24a' && r.w === 17 && r.h === 8));
}

// —— 契约：零碰撞 / 零 NPC 变更 / 重载重建 / 单一数据源 ——
loadMap('dungeon');
ok('契约：at(18,2) === TY.GRASS（蘑菇田菌盖格零碰撞变化）', at(18, 2) === TY.GRASS, String(at(18, 2)));
ok('契约：isTallGrass(18,2) === true（菌盖只落在高草，与 dangerAt 同源）', isTallGrass(18, 2) === true);
loadMap('dungeon');
ok('契约：loadMap 重载后 gCells 重建（isTallGrass(19,3) true / (2,5) false）',
  isTallGrass(19, 3) === true && isTallGrass(2, 5) === false);
ok('契约：NPC 总数保持 30（零 NPC 变更，v22.39 pin 续守）', Object.keys(NPC_SPOTS).length === 38,
  String(Object.keys(NPC_SPOTS).length));
ok('契约：TY.GRASS 非 SOLID（高草可走）', !SOLID.has(TY.GRASS));

// —— README / package.json / CHANGELOG 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树收录 smoke_v2242_mushfield 且位于串尾', readme.includes('smoke_v2241_gatearch + smoke_v2242_mushfield + smoke_v2243_encguide + smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev（npm test 串跑）'));
ok('README 件套口径为一百九十八件套（一百九十七件套清除）',
  readme.includes('冒烟一百九十八件套（一百九十七件套清除）') && !readme.includes('冒烟一百三十七件套（一百三十六件套清' + '除）'));
ok('README 含 v22.42 守护描述（雾语林蘑菇田菌盖灯油景观守护）', readme.includes('v22.42 起含雾语林蘑菇田菌盖灯油景观守护'));
ok('README 含 smoke_v2242_mushfield 入库（138 份）', readme.includes('smoke_v2242_mushfield 入库（138 份）'));
ok('README 仍保留 v22.41 守护描述与入库（137 份）（历史口径不漂移）',
  readme.includes('v22.41 起含无字回廊名字之门地标守护') && readme.includes('smoke_v2241_gatearch 入库（137 份）'));
ok('README 雾语林地图行含菌盖灯油口径（v22.42）', readme.includes('v22.42 起世界画面可见：') && readme.includes('菌盖灯油'));
ok('README 视觉 bullet 含菌盖灯油景观（v22.42）', readme.includes('菌盖灯油景观**（v22.42'));
ok('package.json 已收录 smoke_v2242_mushfield（npm test 串跑第 138 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2242_mushfield.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 138 件套', testChain === 198, String(testChain));
ok('CHANGELOG 含 v22.42 条目', changelog.includes('## v22.42 '));

// —— 姊妹 pin 复查（v2241..v2226 随新现实更新，含 v2228/v2229/v2230 三风格锚）——
const s2241 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2241_gatearch.mjs'), 'utf8');
const s2240 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2240_tallgrass.mjs'), 'utf8');
const s2239 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2239_minercart.mjs'), 'utf8');
const s2238 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2238_starwell.mjs'), 'utf8');
const s2235 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2235_minimapquest.mjs'), 'utf8');
const s2234 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2234_innkeeper.mjs'), 'utf8');
const s2230 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2230_pausewarn.mjs'), 'utf8');
const s2229 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2229_metall.mjs'), 'utf8');
const s2228 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2228_titlesave.mjs'), 'utf8');
const s2226 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2226_chestprogress.mjs'), 'utf8');
ok('smoke_v2241 的 GAME_VERSION 字面量 pin 已更新为 v22.42', s2241.includes("const GAME_VERSION = 'v23.02';"));
ok('smoke_v2241 的 GAME_VERSION 恒等 pin 已更新为 === v22.42', s2241.includes("GAME_VERSION === 'v23.02'"));
ok('smoke_v2241 的 README 串尾 pin 已更新为 + smoke_v2242_mushfield',
  s2241.includes('smoke_v2241_gatearch + smoke_v2242_mushfield + smoke_v2243_encguide + smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev（npm test 串跑）'));
ok('smoke_v2241 的 package.json 件套计数 pin 已更新为 === 138', s2241.includes('testChain === 198'));
ok('smoke_v2241 的 README 件套口径 pin 已更新为一百三十八件套',
  s2241.includes('冒烟一百九十八件套（一百九十七件套清除）'));
ok('smoke_v2240 的 GAME_VERSION 字面量 pin 已更新为 v22.42', s2240.includes("const GAME_VERSION = 'v23.02';"));
ok('smoke_v2240 的 GAME_VERSION 恒等 pin 已更新为 === v22.42', s2240.includes("GAME_VERSION === 'v23.02'"));
ok('smoke_v2240 的 README 串尾 pin 已更新为 + smoke_v2242_mushfield（NPC 总数 pin 随新现实）',
  s2240.includes('smoke_v2241_gatearch + smoke_v2242_mushfield + smoke_v2243_encguide + smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev（npm test 串跑）') && s2240.includes('testChain === 198'));
ok('smoke_v2239 的 GAME_VERSION 字面量 pin 已更新为 v22.42', s2239.includes("const GAME_VERSION = 'v23.02';"));
ok('smoke_v2238 的 GAME_VERSION 字面量 pin 已更新为 v22.42', s2238.includes("const GAME_VERSION = 'v23.02';"));
ok('smoke_v2235 的 GAME_VERSION 字面量 pin 已更新为 v22.42', s2235.includes("const GAME_VERSION = 'v23.02';"));
ok('smoke_v2235 的 NPC 总数 pin 保持 30（零 NPC 变更）', s2235.includes('NPC_SPOTS).length === 38'));
ok('smoke_v2234 的 GAME_VERSION 恒等 pin 已更新为 === v22.42', s2234.includes("GAME_VERSION === 'v23.02'"));
ok('smoke_v2230 的 GAME_VERSION 恒等 pin 已更新为 === v22.42', s2230.includes("GAME_VERSION === 'v23.02'"));
// 串尾锚延伸（任意转义风格：plain `/` / regex `\/` / 双转义 `\\/`）
const archChain = (s) => /smoke_v2241_gatearch[.\\]{0,4}mjs\s*&&\s*node tests[\\/]{0,4}smoke_v2242_mushfield[.\\]{0,4}mjs/.test(s);
ok('smoke_v2226/v2228/v2229/v2230/v2239/v2240/v2241 的串尾锚已延伸至 smoke_v2242_mushfield（plain/regex/双转义三风格）',
  archChain(s2226) && archChain(s2228) && archChain(s2229) && archChain(s2230) && archChain(s2239) &&
  archChain(s2240) && archChain(s2241));
ok('smoke_v2226 的 plain 串尾锚逐字（node tests/smoke_v2241_gatearch.mjs && node tests/smoke_v2242_mushfield.mjs && node tests/smoke_v2243_encguide.mjs && node tests/smoke_v2244_fulldanger.mjs && node tests/smoke_v2245_watcher.mjs && node tests/smoke_v2246_fountgauge.mjs && node tests/smoke_v2247_villagewell.mjs && node tests/smoke_v2248_mapguide.mjs && node tests/smoke_v2249_shopkeep.mjs && node tests/smoke_v2250_brewer.mjs && node tests/smoke_v2251_oathkeep.mjs && node tests/smoke_v2252_rail.mjs && node tests/smoke_v2253_supplypoint.mjs && node tests/smoke_v2254_grainfield.mjs && node tests/smoke_v2255_steleglow.mjs && node tests/smoke_v2256_campfire.mjs && node tests/smoke_v2257_pondglow.mjs && node tests/smoke_v2258_potionhelp.mjs && node tests/smoke_v2259_sandpile.mjs && node tests/smoke_v2260_fountripple.mjs && node tests/smoke_v2261_rich3.mjs && node tests/smoke_v2262_crystal.mjs && node tests/smoke_v2263_ptime3.mjs && node tests/smoke_v2264_hunt3.mjs && node tests/smoke_v2265_lucky3.mjs && node tests/smoke_v2266_stock3.mjs && node tests/smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs"）',
  s2226.includes('node tests/smoke_v2241_gatearch.mjs && node tests/smoke_v2242_mushfield.mjs && node tests/smoke_v2243_encguide.mjs && node tests/smoke_v2244_fulldanger.mjs && node tests/smoke_v2245_watcher.mjs && node tests/smoke_v2246_fountgauge.mjs && node tests/smoke_v2247_villagewell.mjs && node tests/smoke_v2248_mapguide.mjs && node tests/smoke_v2249_shopkeep.mjs && node tests/smoke_v2250_brewer.mjs && node tests/smoke_v2251_oathkeep.mjs && node tests/smoke_v2252_rail.mjs && node tests/smoke_v2253_supplypoint.mjs && node tests/smoke_v2254_grainfield.mjs && node tests/smoke_v2255_steleglow.mjs && node tests/smoke_v2256_campfire.mjs && node tests/smoke_v2257_pondglow.mjs && node tests/smoke_v2258_potionhelp.mjs && node tests/smoke_v2259_sandpile.mjs && node tests/smoke_v2260_fountripple.mjs && node tests/smoke_v2261_rich3.mjs && node tests/smoke_v2262_crystal.mjs && node tests/smoke_v2263_ptime3.mjs && node tests/smoke_v2264_hunt3.mjs && node tests/smoke_v2265_lucky3.mjs && node tests/smoke_v2266_stock3.mjs && node tests/smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs"'));
ok('smoke_v2228 的 GAME_VERSION 字面量 pin 已更新为 v22.42 且旧代零残留复查仍在（v22.27 风格）',
  s2228.includes("const GAME_VERSION = 'v23.02';") && s2228.includes("'v22.") && s2228.includes("27';"));

// 旧代 v22.41 pin 全库零残留（字面量/恒等/件套/串尾/第 137 份）
const allTests = fs.readdirSync(path.join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs'));
const stale = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "41';") || src.includes("GAME_VERSION === 'v22." + "41'") ||
      src.includes('一百三十七件套（一百三十六件套清' + '除）') || src.includes('testChain === ' + '137')) stale.push(f);
}
ok('旧代 v22.41 字面量/恒等/件套/串尾 pin 全库零残留（' + allTests.length + ' 件扫描，含本件）', stale.length === 0, stale.join(','));
// 坏链防回归：不得出现 smoke_v2240_tallgrass 直接接 smoke_v2241_gatearch 再断链/被吞并的形式
let brokenTail = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('smoke_v2240_tallgrass + smoke_v2241_gatearch（npm test ' + '串跑）')) brokenTail.push(f);
}
if (readme.includes('smoke_v2240_tallgrass + smoke_v2241_gatearch（npm test ' + '串跑）')) brokenTail.push('README.md');
ok('坏链 pin 零残留（v2241_gatearch 被吞并链全库清零）', brokenTail.length === 0, brokenTail.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
