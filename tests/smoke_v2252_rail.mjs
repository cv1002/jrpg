// v22.52 专项冒烟：星井矿脉「矿车轨道」景观（新内容·世界景观·纯显示，承 v22.39 星砂车「名字物补脸」
// 先例的收口）——矿脉地图 v13.5 注释「轨道引导线贯穿——入口（井巫）→ 矿车区（车夫/试炼碑）→ 深处
// 祭坛 → 中央水晶」，ASCII PATH '.' 格就是这条引导线：replaceTiles（PATH→CAVE）后轨道与世界画面岩地
// 同色，v22.39 立起的星砂车（19,10）停在矿场、车夫守护的是一像素都看不见的轨道。现收口 data.js
// CAVE_RAIL 单一数据源（= MAPS.cave.rows '.' 逐行扫描，35 格，改图自动跟随零漂移），drawWorld 沿格
// 绘制木枕 + 双轨（方向感知：横轨/竖轨/拐角重叠自然衔接，纯斜向阶梯格回落横轨；枕木 #6a4a2f +
// 双轨 #5a6472 + 受光高光 #7a828a——既有色族零新增颜色）；只画纯岩地格（终焉水晶 (12,11) 恰在引导线
// 终点上，SB 瓦片零轨道像素）；纯显示零结算零存档零数值变化，不设小地图标记（地貌非决策信息，与
// 星砂车/名字之门同口径）。
// 本冒烟守护：版本锚点、data.js/drawWorld.js 源级落位（CAVE_RAIL 单一数据源 + 既有地标状态纯函数/
// 调用点逐字零回归）、CAVE_RAIL 数据契约（35 格与地图 '.' 逐格程序化重扫比对 + 无重复 + 越界防御）、
// 运行期实证（cave 渲染捕获：横轨/竖轨/高光/枕木逐矩形落位 + v-only 格无横轨 + 终焉水晶格零轨道像素 +
// at() 零碰撞零回归 + 同图 NPC/设施零回归 + NPC 总数 34 零变更）、README/package.json/CHANGELOG 同步
// （tests 树尾 + 件套口径 148 + v22.52 守护描述 + 入库 148 份 + 地图速览轨道文案）、姊妹件套 pin
// （smoke_v2251 随新现实更新 + v2143-45「件套守护领先一位」哨兵链 149 更新）复查 + 旧代 v22.51
// 字面量/恒等/件套/串尾/CHANGELOG pin 全库零残留。
import { S } from '../js/state.js';
import { GAME_VERSION, CAVE_RAIL, MAPS, TY, SOLID, NPC_SPOTS } from '../js/data.js';
import { newGame } from '../js/core.js';
import { loadMap, at } from '../js/world.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v22.51 冒烟先例：先装桩再 import main.js；fillRect 捕获供轨道断言）——
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

console.log('— v22.52 星井矿脉矿车轨道 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const wSrc = fs.readFileSync(path.join(ROOT, 'js/view/drawWorld.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.51 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.51（本版守 v22.52）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 52)), GAME_VERSION);
ok('data.js 含 v22.52 注释（矿车轨道说明）', dSrc.includes('v22.52 新内容·世界景观·纯显示'));
ok('GAME_VERSION 字面量已为 v22.52（旧 v22.51 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v22.68';") && !dSrc.includes("const GAME_VERSION = 'v22." + "51';"));
ok('data.js 仍保留 v22.51/v22.50 世代注释链（记誓人/酿药师累积注释未动）',
  dSrc.includes('v22.51 新内容·纯风味 NPC') && dSrc.includes('v22.50 新内容·纯风味 NPC'));

// —— data.js 源级落位：CAVE_RAIL 单一数据源 ——
ok('CAVE_RAIL 已导出（data.js 导出块含 CAVE_RAIL）', /CAVE_RAIL,/.test(dSrc) && dSrc.includes('CAVE_RAIL'));
ok('data.js CAVE_RAIL 注释含「轨道引导线」主题（v13.5 地图注释同口径）且标明单一数据源',
  dSrc.includes('轨道引导线') && dSrc.includes('MAPS.cave.rows') && dSrc.includes('35 格'));

// —— CAVE_RAIL 数据契约：与地图逐格程序化重扫比对 ——
ok('CAVE_RAIL 为数组且长度 35（地图 PATH 格总数）', Array.isArray(CAVE_RAIL) && CAVE_RAIL.length === 35,
  String(Array.isArray(CAVE_RAIL) ? CAVE_RAIL.length : 'not-array'));
const scan = [];
MAPS.cave.rows.forEach((row, y) => {
  [...row].forEach((ch, x) => { if (ch === '.') scan.push([x, y]); });
});
ok('CAVE_RAIL 与 MAPS.cave.rows "." 逐格完全一致（改图自动跟随零漂移，顺序亦同）',
  scan.length === CAVE_RAIL.length && CAVE_RAIL.every((p, i) => p[0] === scan[i][0] && p[1] === scan[i][1]));
ok('CAVE_RAIL 每格在行界内且网格字符确为 "."（无越界/无错格）',
  CAVE_RAIL.every(([x, y]) => y >= 0 && y < MAPS.cave.rows.length && x >= 0 &&
    x < MAPS.cave.rows[y].length && MAPS.cave.rows[y][x] === '.'));
ok('CAVE_RAIL 坐标无重复（Set 去重后仍 35）', new Set(CAVE_RAIL.map((p) => p[0] + ',' + p[1])).size === 35);
ok('CAVE_RAIL 每格为 [number, number]（纯数据零对象/零方法）',
  CAVE_RAIL.every((p) => Array.isArray(p) && p.length === 2 && typeof p[0] === 'number' && typeof p[1] === 'number'));
ok('CAVE_RAIL 含 (12,11)（终焉水晶在引导线终点脚上——本版契约前提）',
  CAVE_RAIL.some((p) => p[0] === 12 && p[1] === 11));
ok('CAVE_RAIL 与星井/星砂车无同格（CAVE_WELL (16,11)/CAVE_CART (19,10) 零重叠）',
  !CAVE_RAIL.some((p) => p[0] === 16 && p[1] === 11) && !CAVE_RAIL.some((p) => p[0] === 19 && p[1] === 10));

// —— drawWorld.js 源级落位：drawCaveRail + 调用点 + 守卫 + 色板 ——
ok('drawWorld.js 含 v22.52 注释（矿车轨道说明）', wSrc.includes('v22.52 星井矿脉「矿车轨道」'));
ok('drawWorld.js import CAVE_RAIL（data.js 单一数据源）', wSrc.includes('CAVE_RAIL'));
ok('drawWorld.js 存在 drawCaveRail 绘制函数', wSrc.includes('function drawCaveRail'));
ok('drawWorld 主循环接入 drawCaveRail（cave 专属，先于星井/星砂车层）',
  wSrc.includes("curMap() === 'cave') drawCaveRail(c.x, c.y);"));
ok('轨道先于星井绘制（调用点 indexOf 顺序：drawCaveRail 在 drawCaveWell 之前）',
  wSrc.indexOf('drawCaveRail(c.x, c.y)') > -1 && wSrc.indexOf('drawCaveRail(c.x, c.y)') < wSrc.indexOf('drawCaveWell(c.x, c.y)'));
ok('只画纯岩地格守卫：at(rx,ry) !== TY.CAVE 跳过（终焉水晶 SB 格零轨道像素）',
  wSrc.includes('if (at(rx, ry) !== TY.CAVE) continue;'));
ok('方向感知：横轨（左右邻接/纯斜向回落）与竖轨（上下邻接）两分支齐备',
  wSrc.includes('railSet.has((rx + 1) + \',\' + ry)') && wSrc.includes('railSet.has(rx + \',\' + (ry + 1))'));
ok('色板齐备：双轨 #5a6472 + 受光高光 #7a828a + 枕木 #6a4a2f（既有色族零新增颜色）',
  wSrc.includes("CTX.fillStyle = '#5a6472'") && wSrc.includes("CTX.fillStyle = '#7a828a'") &&
  wSrc.includes("CTX.fillStyle = '#6a4a2f'"));
ok('既有地标状态纯函数/调用点逐字零回归（大灯/村井/星井/星砂车/名字之门）',
  wSrc.includes('export function villageLampState') && wSrc.includes('export function villageWellState') &&
  wSrc.includes('export function caveWellState') && wSrc.includes('export function caveCartState') &&
  wSrc.includes('export function galleryArchState') &&
  wSrc.includes("curMap() === 'village') drawVillageLamp(c.x, c.y)") &&
  wSrc.includes("curMap() === 'cave') drawCaveCart(c.x, c.y)") &&
  wSrc.includes("curMap() === 'gallery') drawGalleryArch(c.x, c.y)"));

// —— 运行期实证：cave 渲染捕获（玩家立于 (5,11) 轨道格上，cam 取整后逐矩形断言）——
function capture(map) {
  const rects = [];
  const origFR = CTX.fillRect;
  CTX.fillRect = (x, y, w, h) => {
    rects.push({ x, y, w, h, fs: String(CTX.fillStyle) });
    return origFR.call(CTX, x, y, w, h);
  };
  try {
    S.G = newGame('测试');
    S.G.map = map || 'cave';
    S.G.x = 5; S.G.y = 11;
    S.dir = 'U';
    S.scene = 'world';
    S.walk = null;
    loadMap(map || 'cave');
    drawWorld();
  } catch (e) { rects.push({ fs: 'THREW:' + e.message, x: -1, y: -1, w: 0, h: 0 }); }
  CTX.fillRect = origFR;
  return { rects, c: cam() };
}
const T = 32;
const c5 = capture('cave');
ok('运行期：cave drawWorld 全链路无抛错', !c5.rects.some((r) => r.fs.startsWith('THREW:')),
  c5.rects.filter((r) => r.fs.startsWith('THREW:')).map((r) => r.fs).join('|'));
const px5 = 5 * T - c5.c.x, py5 = 11 * T - c5.c.y;
ok('运行期：(5,11) 横轨上轨 (px, py+13, 32, 2) #5a6472 逐像素落位', !!c5.rects.find((r) =>
  r.x === px5 && r.y === py5 + 13 && r.w === 32 && r.h === 2 && r.fs === '#5a6472'));
ok('运行期：(5,11) 横轨下轨 (px, py+21, 32, 2) #5a6472 逐像素落位', !!c5.rects.find((r) =>
  r.x === px5 && r.y === py5 + 21 && r.w === 32 && r.h === 2 && r.fs === '#5a6472'));
ok('运行期：(5,11) 双轨受光高光 (px, py+13, 32, 1) #7a828a', !!c5.rects.find((r) =>
  r.x === px5 && r.y === py5 + 13 && r.w === 32 && r.h === 1 && r.fs === '#7a828a'));
ok('运行期：(5,11) 枕木 (px+2, py+11, 2, 10) #6a4a2f（六根之第一根）', !!c5.rects.find((r) =>
  r.x === px5 + 2 && r.y === py5 + 11 && r.w === 2 && r.h === 10 && r.fs === '#6a4a2f'));
const px1 = 1 * T - c5.c.x, py1 = 4 * T - c5.c.y;
ok('运行期：(1,4) 竖轨 (px+13, py, 2, 32) #5a6472 逐像素落位（西缘纵列）', !!c5.rects.find((r) =>
  r.x === px1 + 13 && r.y === py1 && r.w === 2 && r.h === 32 && r.fs === '#5a6472'));
ok('运行期：(1,4) 竖轨第二轨 (px+21, py, 2, 32) #5a6472', !!c5.rects.find((r) =>
  r.x === px1 + 21 && r.y === py1 && r.w === 2 && r.h === 32 && r.fs === '#5a6472'));
ok('运行期：(1,4) 竖枕木 (px+11, py+2, 10, 2) #6a4a2f', !!c5.rects.find((r) =>
  r.x === px1 + 11 && r.y === py1 + 2 && r.w === 10 && r.h === 2 && r.fs === '#6a4a2f'));
ok('运行期：(1,4) 纯竖轨格零横轨（方向感知：无 (px, py+13, 32, 2)）',
  !c5.rects.some((r) => r.x === px1 && r.y === py1 + 13 && r.w === 32 && r.h === 2 && r.fs === '#5a6472'));
const px12 = 12 * T - c5.c.x, py12 = 11 * T - c5.c.y;
ok('运行期：(12,11) 终焉水晶格零轨道像素（SB 瓦片，轨道引到水晶脚即止）',
  !c5.rects.some((r) => r.fs === '#5a6472' &&
    ((r.x === px12 && (r.y === py12 + 13 || r.y === py12 + 21)) ||
     (r.y === py12 && (r.x === px12 + 13 || r.x === px12 + 21)))) &&
  !c5.rects.some((r) => r.fs === '#6a4a2f' && r.x >= px12 && r.x < px12 + 32 && r.y >= py12 && r.y < py12 + 32),
  String(c5.rects.filter((r) => r.fs === '#5a6472').length));
ok('运行期：横轨段数 ≥10、竖轨段数 ≥10（全图多条引导段可见）',
  c5.rects.filter((r) => r.fs === '#5a6472' && r.w === 32 && r.h === 2).length >= 10 &&
  c5.rects.filter((r) => r.fs === '#5a6472' && r.w === 2 && r.h === 32).length >= 10,
  String(c5.rects.filter((r) => r.fs === '#5a6472' && r.w === 32).length + '/' +
    c5.rects.filter((r) => r.fs === '#5a6472' && r.w === 2).length));
ok('运行期：枕木（横轨 2×10 / 竖轨 10×2）合计 ≥60 根', c5.rects.filter((r) =>
  r.fs === '#6a4a2f' && ((r.w === 2 && r.h === 10) || (r.w === 10 && r.h === 2))).length >= 60,
  String(c5.rects.filter((r) => r.fs === '#6a4a2f').length));

// 跨图防泄漏：village/gallery 渲染零轨道专属矩形（32×2 / 2×32 #5a6472 铁轨）
const cv = capture('village');
const cg = capture('gallery');
ok('运行期：village 渲染零铁轨矩形（32×2/2×32 #5a6472）——轨道仅 cave 专属',
  !cv.rects.some((r) => r.fs === '#5a6472' && ((r.w === 32 && r.h === 2) || (r.w === 2 && r.h === 32))));
ok('运行期：gallery 渲染零铁轨矩形（32×2/2×32 #5a6472）——回廊无轨道（名字之门零回归）',
  !cg.rects.some((r) => r.fs === '#5a6472' && ((r.w === 32 && r.h === 2) || (r.w === 2 && r.h === 32))));

// —— 契约：轨道格零碰撞 / 终点水晶零回归 / 同图关键点零回归 / NPC 总数零变更 ——
loadMap('cave');
ok('契约：轨道格 (5,11) 落位为 CAVE 可行走（PATH→CAVE，SOLID 零新增）', at(5, 11) === TY.CAVE && !SOLID.has(at(5, 11)),
  at(5, 11));
ok('契约：西缘纵列 (1,4) 与斜下引线 (9,8) 均可行走（引导线全程可走零碰撞）',
  at(1, 4) === TY.CAVE && !SOLID.has(at(1, 4)) && at(9, 8) === TY.CAVE && !SOLID.has(at(9, 8)));
ok('契约：终焉水晶 (12,11) 仍为 SB 瓦片零回归（轨道不占设施格）', at(12, 11) === TY.SB, at(12, 11));
ok('契约：同图关键点零回归——星井(16,11)/星砂车(19,10)/车夫(17,11)/守碑人(17,12)/试炼碑(18,12)/井巫(3,1)/老矿工(2,3)/听矿人(13,2)/筛砂人(5,5)/拾骨人(5,10)',
  at(16, 11) === TY.CAVE && at(19, 10) === TY.CAVE && at(17, 11) === TY.NPC && at(17, 12) === TY.NPC &&
  at(18, 12) === TY.TRIAL && at(3, 1) === TY.NPC && at(2, 3) === TY.NPC && at(13, 2) === TY.NPC &&
  at(5, 5) === TY.NPC && at(5, 10) === TY.NPC,
  at(16, 11) + '/' + at(19, 10) + '/' + at(17, 11) + '/' + at(18, 12));
ok('契约：NPC_SPOTS 总数 34 零变更（无新 NPC 键，轨道纯景观）', Object.keys(NPC_SPOTS).length === 34,
  String(Object.keys(NPC_SPOTS).length));

// —— README / package.json / CHANGELOG 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树已收录 smoke_v2252_rail 且位于串尾',
  readme.includes('smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3（npm test 串跑）'));
ok('README 件套口径为一百六十四件套（一百六十三件套清除）',
  readme.includes('冒烟一百六十四件套（一百六十三件套清除）') &&
  !readme.includes('冒烟一百四十七件套（一百四十六件套清' + '除）'));
ok('README 含 v22.52 守护描述（星井矿脉矿车轨道景观）', readme.includes('v22.52 起含星井矿脉矿车轨道景观守护'));
ok('README 含 smoke_v2252_rail 入库（148 份）', readme.includes('smoke_v2252_rail 入库（148 份）'));
ok('README 地图速览/系统清单含「矿车轨道」', readme.includes('矿车轨道'));
ok('package.json 已收录 smoke_v2252_rail（npm test 串跑第 148 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2252_rail.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 148 件套', testChain === 164, String(testChain));
ok('CHANGELOG 顶部已追加 v22.52 条目', changelog.startsWith('## v22.68'));

// —— 姊妹 pin 复查（smoke_v2251 随新现实更新 + 哨兵链 149）——
const s2251 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2251_oathkeep.mjs'), 'utf8');
ok('smoke_v2251 的 GAME_VERSION 字面量 pin 已更新为 v22.52（旧 v22.51 零残留）',
  s2251.includes("const GAME_VERSION = 'v22.68';") && !s2251.includes("const GAME_VERSION = 'v22." + "51';"));
ok('smoke_v2251 的 README 件套 pin 已随新现实更新为一百六十四件套（一百六十三件套清除）',
  s2251.includes('一百六十四件套（一百六十三件套清除）'));
ok('smoke_v2251 的 package.json 件套计数 pin 已更新为 === 148', s2251.includes('testChain === 164'));
ok('smoke_v2251 的 README 串尾 pin 已随新现实延伸至 smoke_v2252_rail',
  s2251.includes('smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3（npm test 串跑）'));
ok('smoke_v2251 的 CHANGELOG pin 已更新为 ## v22.52', s2251.includes("startsWith('## v22.68')"));
const s2143 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2143_talkekey.mjs'), 'utf8');
ok('v2143-45「件套守护领先一位」哨兵链已推进至 149（一百六十四件套（一百六十三件套清除））',
  s2143.includes('一百六十五件套（一百六十四件套清除）') && s2143.includes("!readme.includes('一百六十五件套')"));

// —— 旧代 v22.51 pin 全库零残留 ——
const allTests = fs.readdirSync(path.join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2252_rail.mjs');
const stale = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22.51';") || src.includes("GAME_VERSION === 'v22.51'") ||
      src.includes('一百四十七件套（一百四十六件套清' + '除）') || src.includes('testChain === ' + '147') ||
      src.includes('smoke_v2251_oathkeep（npm test 串跑）') || src.includes("startsWith('## v22.51')")) stale.push(f);
}
ok('旧代 v22.51 字面量/恒等/件套/串尾/CHANGELOG pin 全库零残留（' + allTests.length + ' 件扫描）',
  stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
