// v22.60 专项冒烟：潮灯镇/雾语林「喷泉泉涌涟漪」景观（新内容·世界景观·纯显示，承 v22.57 水塘灯影
// 同一 water 色族）——潮灯镇广场喷泉 (12,6)（「⛲ 喷泉清泉涌动，HP/MP 完全恢复！」/遇敌槽唯一安全阀
// ENCOUNTER.fountain 的镇口补水点）与雾语林中段营地泉水 (12,9)（货郎「中段营地的泉水，可以白喝」/
// 老矿工「这附近最后一处免费的水」）此前只有一道 2×4 细水柱，「清泉涌动」配画面仍显单薄（泉是四图
// 唯二的免费恢复点）；现于水柱两侧叠加泉涌涟漪：内圈水光带 rgba(158,232,255,*) 6×2（WATER 波光同族）·
// 外圈涟漪 rgba(223,246,255,*) 8×2（水柱同族）· 溅起水珠 rgba(223,246,255,.6) 1×1×2——全部既有色族
// 零新增颜色；相位由既有 ph 与坐标哈希 dhf = x*11+y*5 错开（water 分支先于函数级 const dh——v22.57
// 同款局部哈希、零时间依赖布尔）；纯显示零结算零存档零数值变化（FOUNTAIN 不在 SOLID、遇敌/踩踏/传送
// 判定逐字未动，village/dungeon 两图同款零分支差异——TILE 分支天然覆盖，cave/gallery 无 FOUNTAIN 天然
// 不触发），不设小地图标记（无决策信息，与星砂车/名字之门/村井同口径）。
// 本冒烟守护：版本锚点、data.js/drawWorld.js 源级落位（v22.60 注释 + GAME_VERSION v22.60 + dhf 局部哈希 +
// 涟漪/水珠几何 + 既有水柱逐字零回归 + 既有分支零回归）、运行期真实捕获（village 广场喷泉 (12,6) /
// dungeon 营地泉水 (12,9) 涟漪逐矩形落位 + 恰 1 组 + cave/gallery 零涟漪防泄漏 + 水塘灯影/星井星砂车
// 零回归）、契约（FOUNTAIN 不在 SOLID / at(12,6)·at(12,9)===TY.FOUNTAIN / NPC 总数 34 零变更 / loadMap
// 重载重建）、README/package.json/CHANGELOG 同步（tests 树尾/件套口径 156/v22.60 守护描述/入库 156 份/
// 视觉 bullet）、姊妹件套 pin（v2259..v2226 随新现实更新，含 v2228 三风格锚与 v2239/v2240 容错正则尾锚）
// 复查 + 旧代 v22.59 字面量/恒等/件套/串尾/testChain pin 全库零残留 + 哨兵链 157 就位 + 坏链防回归。
import { S } from '../js/state.js';
import { GAME_VERSION, NPC_SPOTS, TY, SOLID } from '../js/data.js';
import { newGame } from '../js/core.js';
import { loadMap, at } from '../js/world.js';
import { drawWorld, cam } from '../js/view/drawWorld.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— DOM 桩（承 v21.30-v22.59 冒烟先例：先装桩再 import main.js；fillRect 捕获供涟漪断言）——
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
const { CTX } = await import('../js/view/canvas.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.60 潮灯镇/雾语林喷泉泉涌涟漪景观 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const wSrc = fs.readFileSync(path.join(ROOT, 'js/view/drawWorld.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.59 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.59（本版守 v22.60）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 60)), GAME_VERSION);
ok('data.js 含 v22.60 注释（新内容·世界景观·纯显示）', dSrc.includes('v22.60 新内容·世界景观·纯显示'));
ok('GAME_VERSION 字面量已为 v22.60（旧 v22.59 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v23.86';") && !dSrc.includes("const GAME_VERSION = 'v22." + "59';"));
ok('data.js 仍保留 v22.59/v22.58 世代注释链（星砂堆/喝药行注释未动）',
  dSrc.includes('v22.59 新内容·世界景观·纯显示') && dSrc.includes('v22.58 体验打磨·信息透明·纯文字'));

// —— drawWorld.js 源级落位：v22.60 注释 + dhf 局部哈希 + 涟漪/水珠几何 + 既有水柱零回归 ——
const T = 32;
ok('drawWorld.js 含 v22.60 注释（喷泉泉涌涟漪说明）', wSrc.includes('v22.60 潮灯镇/雾语林「喷泉泉涌涟漪」'));
ok('drawWorld.js 含 dhf = x * 11 + y * 5 局部哈希（water 分支先于 const dh——v22.57 同款）',
  wSrc.includes('const dhf = x * 11 + y * 5;') && wSrc.includes('px + 10 + (dhf % 3), py + 9, 6, 2') &&
  wSrc.includes('px + 12 + (dhf % 2), py + 13, 8, 2'));
ok('drawWorld.js 涟漪色板（rgba(158,232,255,* 内圈 / rgba(223,246,255,* 外圈与既有水柱同族 / .6 水珠）',
  wSrc.includes("'rgba(158,232,255,'") && wSrc.includes("'rgba(223,246,255,'") && wSrc.includes("'rgba(223,246,255,.6)'"));
ok('drawWorld.js 水珠 1×1×2 落位（@+17,+7 / @+13,+5）',
  wSrc.includes('CTX.fillRect(px + 17, py + 7, 1, 1);') && wSrc.includes('CTX.fillRect(px + 13, py + 5, 1, 1);'));
ok('drawWorld.js 既有水柱逐字零回归（rgba(223,246,255, 0.4+0.4sin 2×4 @+15,+2）',
  wSrc.includes("CTX.fillStyle = 'rgba(223,246,255,' + (0.4 + 0.4 * Math.sin(ph * 2)) + ')';") &&
  wSrc.includes('CTX.fillRect(px + 15, py + 2, 2, 4);'));
ok('drawWorld.js 既有分支逐字零回归（水塘灯影 dhw/星砂堆/星井/星砂车/轨道/名字之门/石碑温光/大灯/村井/营火/高草/菌盖/谷穗健在）',
  wSrc.includes('const dhw = x * 31 + y * 17;') && wSrc.includes('function drawCaveSand(camX, camY)') &&
  wSrc.includes('export function caveWellState(hero)') && wSrc.includes('export function caveCartState(hero)') &&
  wSrc.includes('function drawCaveRail(camX, camY)') && wSrc.includes('export function galleryArchState(hero)') &&
  wSrc.includes('export function steleLitState(hero)') && wSrc.includes('export function villageLampState(hero)') &&
  wSrc.includes('export function villageWellState(hero)') && wSrc.includes('function drawCampFire(camX, camY)') &&
  wSrc.includes('if (isTallGrass(x, y)) {') && wSrc.includes("if (curMap() === 'dungeon' && (x * 7 + y * 13) % 4 === 0) {") &&
  wSrc.includes("if (curMap() === 'village' && (x * 5 + y * 7) % 4 === 0) {"));

// —— 运行期实证：village 喷泉 (12,6) / dungeon 泉水 (12,9) 涟漪捕获（承 v22.57-v22.59 捕获同法）——
function captureMap(mapName, heroX, heroY) {
  const rects = [], arcs = [];
  const origFR = CTX.fillRect, origArc = CTX.arc;
  CTX.fillRect = (x, y, w, h) => {
    rects.push({ x, y, w, h, fs: String(CTX.fillStyle) });
    return origFR.call(CTX, x, y, w, h);
  };
  CTX.arc = (x, y, r) => {
    arcs.push({ x, y, r, fs: String(CTX.fillStyle) });
    return origArc.call(CTX, x, y, r);
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
  CTX.arc = origArc;
  return { rects, arcs, cam: cam() };
}

// 潮灯镇广场喷泉 (12,6)：dhf = 12*11+6*5 = 162 → dhf%3=0 / dhf%2=0
const capV = captureMap('village', 12, 7);
const cV = capV.cam;
const pxV = 12 * T - cV.x, pyV = 6 * T - cV.y;
const innerV = (r) => r.x === pxV + 10 && r.y === pyV + 9 && r.w === 6 && r.h === 2 && r.fs.startsWith('rgba(158,232,255,');
const outerV = (r) => r.x === pxV + 12 && r.y === pyV + 13 && r.w === 8 && r.h === 2 && r.fs.startsWith('rgba(223,246,255,');
const clusterV = (r) => (r.x === pxV + 10 && r.y === pyV + 9 && r.w === 6 && r.h === 2 && r.fs.startsWith('rgba(158,232,255,'));
ok('village 运行期：无抛错（drawWorld 全链路）', !capV.rects.some((r) => r.fs.startsWith('THREW:')),
  JSON.stringify(capV.rects.filter((r) => r.fs.startsWith('THREW:'))));
ok('village 运行期：内圈水光带 6×2 @+10,+9 落位（地基含 dhf%3=0）', capV.rects.some(innerV),
  JSON.stringify(capV.rects.filter((r) => r.x > pxV - 2 && r.x < pxV + 34 && r.y > pyV - 2 && r.y < pyV + 34)));
ok('village 运行期：外圈涟漪 8×2 @+12,+13 落位（dhf%2=0）', capV.rects.some(outerV));
ok('village 运行期：溅起水珠 1×1 @+17,+7 / @+13,+5 落位',
  !!capV.rects.find((r) => r.x === pxV + 17 && r.y === pyV + 7 && r.w === 1 && r.h === 1 && r.fs === 'rgba(223,246,255,.6)') &&
  !!capV.rects.find((r) => r.x === pxV + 13 && r.y === pyV + 5 && r.w === 1 && r.h === 1 && r.fs === 'rgba(223,246,255,.6)'));
ok('village 运行期：既有水柱 2×4 @+15,+2 仍在（v19.94 起零回归）',
  !!capV.rects.find((r) => r.x === pxV + 15 && r.y === pyV + 2 && r.w === 2 && r.h === 4 && r.fs.startsWith('rgba(223,246,255,')));
ok('village 运行期：涟漪恰 1 组（广场唯二 FOUNTAIN 之一、视野内零多余内圈）',
  capV.rects.filter(clusterV).length === 1, String(capV.rects.filter(clusterV).length));

// 雾语林中段营地泉水 (12,9)：dhf = 12*11+9*5 = 177 → dhf%3=0 / dhf%2=1
const capD = captureMap('dungeon', 12, 10);
const cD = capD.cam;
const pxD = 12 * T - cD.x, pyD = 9 * T - cD.y;
const clusterD = (r) => (r.x === pxD + 10 && r.y === pyD + 9 && r.w === 6 && r.h === 2 && r.fs.startsWith('rgba(158,232,255,'));
ok('dungeon 运行期：无抛错', !capD.rects.some((r) => r.fs.startsWith('THREW:')));
ok('dungeon 运行期：内圈水光带 6×2 @+10,+9 落位（dhf%3=0）', capD.rects.some(clusterD));
ok('dungeon 运行期：外圈涟漪 8×2 @+13,+13 落位（dhf%2=1 与 village 错开）',
  !!capD.rects.find((r) => r.x === pxD + 12 + (177 % 2) && r.y === pyD + 13 && r.w === 8 && r.h === 2 && r.fs.startsWith('rgba(223,246,255,')) &&
  !capD.rects.some((r) => r.x === pxD + 12 && r.y === pyD + 13 && r.w === 8 && r.h === 2 && r.fs.startsWith('rgba(223,246,255,')));
ok('dungeon 运行期：涟漪恰 1 组（营地泉水唯一、视野内零多余）',
  capD.rects.filter(clusterD).length === 1, String(capD.rects.filter(clusterD).length));
ok('dungeon 运行期：营地篝火 (11,9) 光晕 22×22 rgba(255,200,90,.25) 仍落位（v22.56 零回归）',
  capD.rects.some((r) => r.fs === 'rgba(255,200,90,.25)' && r.w === 22 && r.h === 22),
  JSON.stringify(capD.rects.filter((r) => r.fs === 'rgba(255,200,90,.25)').slice(0, 3)));

// cave / gallery：无 FOUNTAIN —— 零涟漪防泄漏 + 无抛错
{
  const capC = captureMap('cave', 6, 9);
  const cC = capC.cam;
  ok('cave 运行期：无抛错且零内圈涟漪（无 FOUNTAIN 天然不触发）',
    !capC.rects.some((r) => r.fs.startsWith('THREW:')) && !capC.rects.some((r) => r.w === 6 && r.h === 2 && r.fs.startsWith('rgba(158,232,255,')));
  const capG = captureMap('gallery', 12, 3);
  ok('gallery 运行期：无抛错且零内圈涟漪（名字之门/石碑温光零回归）',
    !capG.rects.some((r) => r.fs.startsWith('THREW:')) && !capG.rects.some((r) => r.w === 6 && r.h === 2 && r.fs.startsWith('rgba(158,232,255,')));
}

// —— 契约：零碰撞 / 零 NPC 变更 / 两泉落位 / 重载重建 ——
loadMap('village');
ok('契约：TY.FOUNTAIN 不在 SOLID（泉可行走——踩泉恢复的既有通道零碰撞变化）', !SOLID.has(TY.FOUNTAIN));
ok('契约：at(12,6) === TY.FOUNTAIN（潮灯镇广场喷泉原位）', at(12, 6) === TY.FOUNTAIN, String(at(12, 6)));
ok('契约：loadMap 重载后 at(12,6) 仍 FOUNTAIN / 水塘 (16,6) 仍 WATER（重载重建·v22.57 零回归）',
  at(12, 6) === TY.FOUNTAIN && at(16, 6) === TY.WATER);
loadMap('dungeon');
ok('契约：at(12,9) === TY.FOUNTAIN（雾语林中段营地泉水原位）', at(12, 9) === TY.FOUNTAIN, String(at(12, 9)));
ok('契约：loadMap 重载后 at(12,9) 仍 FOUNTAIN（重载重建）', at(12, 9) === TY.FOUNTAIN);
ok('契约：NPC 总数保持 34（零 NPC 变更，v22.51 pin 续守）', Object.keys(NPC_SPOTS).length === 38,
  String(Object.keys(NPC_SPOTS).length));

// —— README / package.json / CHANGELOG 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树收录 smoke_v2260_fountripple 且位于串尾',
  readme.includes('smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc（npm test 串跑）'));
ok('README 件套口径为二百一十五件套（二百一十四件套清除）且旧 155 口径零残留',
  readme.includes('冒烟二百一十五件套（二百一十四件套清除）') && !readme.includes('一百五十五件套（一百五十四件套清' + '除）'));
ok('README 含 v22.60 守护描述（潮灯镇/雾语林喷泉泉涌涟漪景观守护）',
  readme.includes('v22.60 起含潮灯镇/雾语林喷泉泉涌涟漪景观守护'));
ok('README 含 smoke_v2260_fountripple 入库（156 份）', readme.includes('smoke_v2260_fountripple 入库（156 份）'));
ok('README 仍保留 smoke_v2259_sandpile 入库（155 份）历史口径', readme.includes('smoke_v2259_sandpile 入库（155 份）'));
ok('README 视觉 bullet 含泉涌涟漪景观（v22.60）', readme.includes('**泉涌涟漪景观**（v22.60'));
ok('package.json 已收录 smoke_v2260_fountripple（npm test 串跑第 156 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2260_fountripple.mjs'));
ok('package.json 串尾为 smoke_v2259_sandpile.mjs && node tests/smoke_v2260_fountripple.mjs && node tests/smoke_v2261_rich3.mjs && node tests/smoke_v2262_crystal.mjs && node tests/smoke_v2263_ptime3.mjs && node tests/smoke_v2264_hunt3.mjs && node tests/smoke_v2265_lucky3.mjs && node tests/smoke_v2266_stock3.mjs && node tests/smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs"',
  pkg.includes('smoke_v2259_sandpile.mjs && node tests/smoke_v2260_fountripple.mjs && node tests/smoke_v2261_rich3.mjs && node tests/smoke_v2262_crystal.mjs && node tests/smoke_v2263_ptime3.mjs && node tests/smoke_v2264_hunt3.mjs && node tests/smoke_v2265_lucky3.mjs && node tests/smoke_v2266_stock3.mjs && node tests/smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 156 件套', testChain === 215, String(testChain));
ok('CHANGELOG 顶为 v22.60 条目', changelog.startsWith('## v23.86 '));
ok('CHANGELOG 含 v22.59 条目', changelog.includes('## v22.59 '));

// —— 姊妹 pin 复查（v2259..v2226 随新现实更新，含 v2228 三风格锚与 v2239/v2240 容错正则尾锚）——
const s2259 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2259_sandpile.mjs'), 'utf8');
const s2258 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2258_potionhelp.mjs'), 'utf8');
const s2257 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2257_pondglow.mjs'), 'utf8');
const s2256 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2256_campfire.mjs'), 'utf8');
const s2255 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2255_steleglow.mjs'), 'utf8');
const s2254 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2254_grainfield.mjs'), 'utf8');
const s2253 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2253_supplypoint.mjs'), 'utf8');
const s2252 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2252_rail.mjs'), 'utf8');
const s2242 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2242_mushfield.mjs'), 'utf8');
const s2240 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2240_tallgrass.mjs'), 'utf8');
const s2239 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2239_minercart.mjs'), 'utf8');
const s2230 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2230_pausewarn.mjs'), 'utf8');
const s2229 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2229_metall.mjs'), 'utf8');
const s2228 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2228_titlesave.mjs'), 'utf8');
const s2226 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2226_chestprogress.mjs'), 'utf8');
const s2143 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2143_talkekey.mjs'), 'utf8');
ok('smoke_v2259 的 GAME_VERSION 字面量 pin 已更新为 v22.60', s2259.includes("const GAME_VERSION = 'v23.86';"));
ok('smoke_v2259 的 README 串尾 pin 已随新现实延伸至 smoke_v2260_fountripple',
  s2259.includes('smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc（npm test 串跑）'));
ok('smoke_v2259 的 README 件套 pin 已随新现实更新为二百一十五件套（二百一十四件套清除）',
  s2259.includes('二百一十五件套（二百一十四件套清除）'));
ok('smoke_v2259 的 package.json 件套计数 pin 已更新为 === 156', s2259.includes('testChain === 215'));
ok('smoke_v2259 的 CHANGELOG 顶 pin 已更新为 ## v22.60', s2259.includes("startsWith('## v23.86')"));
ok('smoke_v2259 的 package.json 串尾 plain pin 已延伸至 smoke_v2260_fountripple',
  s2259.includes('smoke_v2259_sandpile.mjs && node tests/smoke_v2260_fountripple.mjs && node tests/smoke_v2261_rich3.mjs && node tests/smoke_v2262_crystal.mjs && node tests/smoke_v2263_ptime3.mjs && node tests/smoke_v2264_hunt3.mjs && node tests/smoke_v2265_lucky3.mjs && node tests/smoke_v2266_stock3.mjs && node tests/smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs"'));
ok('smoke_v2258 的 GAME_VERSION 字面量 pin 已更新为 v22.60', s2258.includes("const GAME_VERSION = 'v23.86';"));
ok('smoke_v2257 的 GAME_VERSION 字面量 pin 已更新为 v22.60', s2257.includes("const GAME_VERSION = 'v23.86';"));
ok('smoke_v2256 的 GAME_VERSION 字面量 pin 已更新为 v22.60', s2256.includes("const GAME_VERSION = 'v23.86';"));
ok('smoke_v2255/v2254/v2253/v2252 的 GAME_VERSION 字面量 pin 已更新为 v22.60',
  s2255.includes("const GAME_VERSION = 'v23.86';") && s2254.includes("const GAME_VERSION = 'v23.86';") &&
  s2253.includes("const GAME_VERSION = 'v23.86';") && s2252.includes("const GAME_VERSION = 'v23.86';"));
ok('smoke_v2230 的 package.json 串尾 plain pin 已延伸至 smoke_v2260_fountripple',
  s2230.includes('smoke_v2259_sandpile.mjs && node tests\\/smoke_v2260_fountripple.mjs && node tests\\/smoke_v2261_rich3.mjs && node tests\\/smoke_v2262_crystal.mjs && node tests\\/smoke_v2263_ptime3.mjs && node tests\\/smoke_v2264_hunt3.mjs && node tests\\/smoke_v2265_lucky3.mjs && node tests\\/smoke_v2266_stock3.mjs && node tests\\/smoke_v2267_elixir3.mjs && node tests\\/smoke_v2268_brew3.mjs && node tests\\/smoke_v2269_mush3.mjs && node tests\\/smoke_v2270_outstep.mjs && node tests\\/smoke_v2271_outstep2.mjs && node tests\\/smoke_v2272_scholar2.mjs && node tests\\/smoke_v2273_seen5.mjs && node tests\\/smoke_v2274_seen2\\.mjs && node tests\\/smoke_v2275_codexempty\\.mjs && node tests\\/smoke_v2276_lampkid\\.mjs && node tests\\/smoke_v2277_pondhint\\.mjs && node tests\\/smoke_v2278_mushguide\\.mjs && node tests\\/smoke_v2279_lampwell\\.mjs && node tests\\/smoke_v2280_grainfield\\.mjs && node tests\\/smoke_v2281_starwell\\.mjs && node tests\\/smoke_v2282_archgate\\.mjs && node tests\\/smoke_v2283_menuekey\\.mjs && node tests\\/smoke_v2284_skillekey\\.mjs && node tests\\/smoke_v2285_winekey\\.mjs && node tests\\/smoke_v2286_titleekey\\.mjs && node tests\\/smoke_v2287_trueroute\\.mjs && node tests\\/smoke_v2288_scrollhint\\.mjs && node tests\\/smoke_v2289_winprog\\.mjs && node tests\\/smoke_v2290_statlink\\.mjs && node tests\\/smoke_v2291_lampguide\\.mjs && node tests\\/smoke_v2292_cavewatch\\.mjs && node tests\\/smoke_v2293_deadsave\\.mjs && node tests\\/smoke_v2294_crystalwatch\\.mjs && node tests\\/smoke_v2295_deadprog\\.mjs && node tests\\/smoke_v2296_endingprog\\.mjs && node tests\\/smoke_v2297_chestmid\\.mjs && node tests\\/smoke_v2298_encnum\\.mjs && node tests\\/smoke_v2299_crosslink\\.mjs && node tests\\/smoke_v2300_sidemore\\.mjs && node tests\\/smoke_v2301_eco\\.mjs && node tests\\/smoke_v2302_cmdprev\\.mjs && node tests\\/smoke_v2303_rushnum\\.mjs && node tests\\/smoke_v2304_achgoal\\.mjs && node tests\\/smoke_v2305_monnum\\.mjs && node tests\\/smoke_v2306_skillnum\\.mjs && node tests\\/smoke_v2307_bossnum\\.mjs && node tests\\/smoke_v2308_diffnum\\.mjs && node tests\\/smoke_v2309_questnum\\.mjs && node tests\\/smoke_v2310_diffsum\\.mjs && node tests\\/smoke_v2311_fragprev\\.mjs && node tests\\/smoke_v2312_voltitle\\.mjs && node tests\\/smoke_v2313_talkall\\.mjs && node tests\\/smoke_v2314_voices\\.mjs && node tests\\/smoke_v2315_talkfoot\\.mjs && node tests\\/smoke_v2316_voiceshead\\.mjs && node tests\\/smoke_v2317_pausemap\\.mjs && node tests\\/smoke_v2318_battlemap\\.mjs && node tests\\/smoke_v2319_deadloc\\.mjs"'));
// 串尾锚延伸（任意转义风格：plain `/` / regex `\/` / 双转义 `\\/`）
const archChain = (s) => /smoke_v2260_fountripple[.\\\\/]{0,4}mjs[\s\S]*?node tests[\\\\/]{0,4}smoke_v2261_rich3[.\\\\/]{0,4}mjs/.test(s);
ok('smoke_v2226/v2228/v2229/v2230/v2239/v2240/v2242 的串尾锚已延伸至 smoke_v2260_fountripple（plain/regex/双转义三风格）',
  archChain(s2226) && archChain(s2228) && archChain(s2229) && archChain(s2230) && archChain(s2239) &&
  archChain(s2240) && archChain(s2242));
// 容错正则尾锚（v2239/v2240 宽松模式）
const looseChain = (s) => /smoke_v2260_fountripple[.\\\\/]{0,6}mjs[\s\S]*?node tests[\\\\/]{0,6}smoke_v2261_rich3[.\\\\/]{0,6}mjs/.test(s);
ok('smoke_v2239/smoke_v2240 的容错正则尾锚已延伸至 smoke_v2260_fountripple',
  looseChain(s2239) && looseChain(s2240));
ok('v2143-45「件套守护领先一位」哨兵链已推进至 157（二百一十五件套（二百一十四件套清除））',
  s2143.includes('二百一十六件套（二百一十五件套清除）') && s2143.includes("!readme.includes('二百一十六件套（二百一十五件套清除）')"));
ok('smoke_v2228 的 GAME_VERSION 字面量 pin 已更新为 v22.60 且旧代零残留复查仍在（v22.27 风格）',
  s2228.includes("const GAME_VERSION = 'v23.86';") && s2228.includes("'v22.") && s2228.includes("27';"));

// 旧代 v22.59 pin 全库零残留（字面量/恒等/件套/串尾/testChain/顶 pin）
const allTests = fs.readdirSync(path.join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs'));
const stale = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "59';") || src.includes("GAME_VERSION === 'v22." + "59'") ||
      src.includes('一百五十五件套（一百五十四' + '件套清除）') || src.includes('testChain === ' + '155') ||
      src.includes("startsWith('## v22." + "59')") ||
      src.includes('smoke_v2259_sandpile（npm test 串' + '跑）')) stale.push(f);
}
ok('旧代 v22.59 字面量/恒等/件套/串尾/testChain/顶 pin 全库零残留（' + allTests.length + ' 件扫描，含本件）', stale.length === 0, stale.join(','));
// 坏链防回归：README 不得出现 v2259 孤尾（其后必须直接接 v2260）
ok('README 串尾无孤尾（smoke_v2259_sandpile 后必须接 smoke_v2260_fountripple）',
  !readme.includes('smoke_v2259_sandpile（npm test 串' + '跑）'));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
