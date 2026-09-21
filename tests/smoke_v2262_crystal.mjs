// v22.62 专项冒烟：星井矿脉「终焉水晶」/无字回廊「终焉之神祭坛」补脸（新内容·世界景观·纯显示，承 v22.38
// 星井 / v22.39 星砂车 / v22.59 星砂堆「名字物补脸」先例的收口）——矿脉地图注释「轨道引导线贯穿——入口
// （井巫）→ 矿车区（车夫/试炼碑）→ 深处祭坛 → 中央水晶」的中央水晶（SB 瓦片 (12,11)，world.js
// onTrueCrystal 三档报文——沉睡/睁眼/空——全游最重名字物之一、双徽记开门 galleryOpen 的唯一入口）与
// 无字回廊东端终焉之神祭坛（SB 瓦片 (21,4)，onTrueCrystal 回廊分支「回廊尽头，所有的名字一齐看向你。
// 终焉之神醒了。」）此前都只有通用门贴图 + 2×2 微光——门是给名字之门（v22.41）的，水晶与祭坛却共用同
// 一张贴图；现按 data.js CAVE_CRYSTAL / TRUE_ALTAR 单一数据源分档补脸（状态与 onTrueCrystal /
// ALTAR_TAG 同读 S.G 一份源——终焉水晶三档：沉睡暗星蓝 rgba(95,216,255,.45) 晶簇 / 睁眼亮星蓝
// #9adcff 晶簇 + #cfeaff 高光 + rgba(95,216,255,.3) 光晕（星井/星砂车亮档同族）/ trueBoss 后 #5a6472
// 灰晶 + #39414f 暗部零蓝零晕（星砂堆不亮档同族，报文「水晶空了」同口径）；终焉之神祭坛两档：未战金核
// rgba(240,192,64,.9) + 金晕 rgba(240,192,64,.18) + 芯亮 #f0c040（TRUE_BOSS 色同族）/ 战后灰核
// #5a6472·#39414f 零光零晕）。整格岩地盘面（#2a2f38 + #333a45 岩块，与周格 CAVE 地面同色同纹——盖住
// 通用门贴图），几何确定性零时间依赖；纯显示零结算零存档零数值变化（SB 不在 SOLID、遇敌/踩踏/传送/开门
// 判定逐字未动，不设小地图标记——无决策信息，与星砂车/名字之门/村井同口径）。
// 本冒烟守护：版本锚点、data.js/drawWorld.js 源级落位（v22.62 注释 + GAME_VERSION v22.62 +
// CAVE_CRYSTAL/TRUE_ALTAR 常量与导出 + trueCrystalState/trueAltarState 状态纯函数 + 落位几何 +
// 既有分支零回归）、运行期真实捕获（cave 沉睡/睁眼/空三档逐矩形落位 + 恰 1 组 + gallery 未战/战后两档 +
// village/dungeon 零晶体防泄漏）、契约（CAVE_CRYSTAL/TRUE_ALTAR 逐值 / at(12,11)·at(21,4)===TY.SB /
// SOLID 不含 SB / loadMap 重载重建 / NPC 总数 34 零变更）、README/package.json/CHANGELOG 同步
// （tests 树尾/件套口径 158/v22.62 守护描述/入库 158 份/两地图行/视觉 bullet）、姊妹件套 pin
// （v2261..v2260 随新现实更新 + 哨兵链 159 就位）复查 + 旧代 v22.61 字面量/恒等/件套/串尾/testChain/
// 顶 pin 全库零残留。
import { S } from '../js/state.js';
import { GAME_VERSION, NPC_SPOTS, TY, SOLID, CAVE_CRYSTAL, TRUE_ALTAR } from '../js/data.js';
import { newGame } from '../js/core.js';
import { loadMap, at } from '../js/world.js';
import { drawWorld, cam, trueCrystalState, trueAltarState, bossAltarState, mbAltarState } from '../js/view/drawWorld.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— DOM 桩（承 v21.30-v22.61 冒烟先例：先装桩再 import main.js；fillRect 捕获供晶簇/祭坛断言）——
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

console.log('— v22.62 星井矿脉终焉水晶/无字回廊终焉之神祭坛补脸 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const wSrc = fs.readFileSync(path.join(ROOT, 'js/view/drawWorld.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.61 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.61（本版守 v22.62）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 62)), GAME_VERSION);
ok('data.js 含 v22.62 注释（新内容·世界景观·纯显示）', dSrc.includes('v22.62 星井矿脉/无字回廊「终焉水晶·终焉之神祭坛」补脸'));
ok('GAME_VERSION 字面量已为 v22.62（旧 v22.61 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v23.58';") && !dSrc.includes("const GAME_VERSION = 'v22." + "61';"));
ok('data.js 仍保留 v22.61 历史注释（富甲一方成就注释未动）', dSrc.includes('v22.61 新成就·金币线第三档里程碑「富甲一方」'));

// —— 数据契约：CAVE_CRYSTAL / TRUE_ALTAR ——
ok('CAVE_CRYSTAL === {x:12,y:11}（星井矿脉中央终焉水晶，MAPS.cave.extras SB 瓦片同位单一数据源）',
  CAVE_CRYSTAL && CAVE_CRYSTAL.x === 12 && CAVE_CRYSTAL.y === 11, JSON.stringify(CAVE_CRYSTAL));
ok('TRUE_ALTAR === {x:21,y:4}（无字回廊东端终焉之神祭坛，gallery.extras SB 瓦片同位单一数据源）',
  TRUE_ALTAR && TRUE_ALTAR.x === 21 && TRUE_ALTAR.y === 4, JSON.stringify(TRUE_ALTAR));
ok('data.js 导出 CAVE_CRYSTAL/TRUE_ALTAR（export 块落位，与 CAVE_SAND 相邻）',
  dSrc.includes('CAVE_SAND, CAVE_CRYSTAL, TRUE_ALTAR, CAVE_RAIL'));
ok('data.js 常量声明逐字（CAVE_CRYSTAL = { x: 12, y: 11 } / TRUE_ALTAR = { x: 21, y: 4 }）',
  dSrc.includes('const CAVE_CRYSTAL = { x: 12, y: 11 };') && dSrc.includes('const TRUE_ALTAR = { x: 21, y: 4 };'));

// —— drawWorld.js 源级落位：v22.62 注释 + 状态纯函数 + 落位几何 + 既有分支零回归 ——
const T = 32;
ok('drawWorld.js 含 v22.62 注释（终焉水晶/终焉之神祭坛补脸说明）', wSrc.includes('v22.62 星井矿脉「终焉水晶」/无字回廊「终焉之神祭坛」补脸'));
ok('drawWorld.js 含 trueCrystalState/trueAltarState 状态纯函数（三档/两档）',
  wSrc.includes('export function trueCrystalState(hero)') && wSrc.includes('export function trueAltarState(hero)'));
ok('drawWorld.js 导入 CAVE_CRYSTAL/TRUE_ALTAR（data.js 单一数据源）',
  wSrc.includes('CAVE_SAND, CAVE_CRYSTAL, TRUE_ALTAR, CAVE_RAIL'));
ok('drawWorld.js 水晶沉睡晶簇几何（4×18 @+14,+6 / 3×12 @+9,+20,+12 rgba(95,216,255,.45)）',
  wSrc.includes("CTX.fillStyle = 'rgba(95,216,255,.45)'") &&
  wSrc.includes('CTX.fillRect(px + 14, py + 6, 4, 18); CTX.fillRect(px + 9, py + 12, 3, 12); CTX.fillRect(px + 20, py + 12, 3, 12);'));
ok('drawWorld.js 水晶睁眼档几何（#9adcff 4×20 @+14,+4 + 光晕 22×22 rgba(95,216,255,.3) + #cfeaff 高光）',
  wSrc.includes("CTX.fillStyle = 'rgba(95,216,255,.3)'") && wSrc.includes('CTX.fillRect(px + 5, py + 5, 22, 22);') &&
  wSrc.includes('CTX.fillRect(px + 14, py + 4, 4, 20); CTX.fillRect(px + 9, py + 10, 3, 14); CTX.fillRect(px + 20, py + 10, 3, 14);'));
ok('drawWorld.js 水晶空档几何（#5a6472 4×18 + #39414f 暗部零蓝零晕）',
  wSrc.includes('if (trueCrystalState(S.G) === \'empty\') {') &&
  wSrc.includes('CTX.fillRect(px + 14, py + 6, 4, 18); CTX.fillRect(px + 9, py + 12, 3, 12); CTX.fillRect(px + 20, py + 12, 3, 12);'));
ok('drawWorld.js 祭坛未战金核几何（rgba(240,192,64,.9) 4×8 @+14,+10 + 金晕 16×16 + 芯亮 #f0c040）',
  wSrc.includes("CTX.fillStyle = 'rgba(240,192,64,.18)'") &&
  wSrc.includes("CTX.fillStyle = 'rgba(240,192,64,.9)'") &&
  wSrc.includes('CTX.fillRect(px + 14, py + 10, 4, 8);') && wSrc.includes("CTX.fillStyle = '#f0c040'"));
ok('drawWorld.js 祭坛战后灰核几何（#5a6472 4×8 + #39414f 暗部）',
  wSrc.includes("CTX.fillStyle = '#5a6472'") && wSrc.includes('CTX.fillRect(px + 14, py + 10, 4, 8);') &&
  wSrc.includes('CTX.fillRect(px + 14, py + 14, 4, 4);'));
ok('drawWorld.js 岩地盘面（32×32 #2a2f38 + #333a45 岩块，盖住通用门贴图）',
  wSrc.includes("CTX.fillStyle = '#2a2f38'") && wSrc.includes('CTX.fillRect(px, py, 32, 32);') &&
  wSrc.includes("CTX.fillStyle = '#333a45'"));
ok('drawWorld.js 既有分支零回归（TY.CAVE 2×2 微光独享 / 水塘灯影 dhw / 星井/星砂车/星砂堆/轨道/名字之门/石碑温光/大灯/村井/营火/高草/菌盖/谷穗健在）',
  wSrc.includes('if (ty === TY.CAVE) {') && wSrc.includes('CTX.fillRect(px + 6, py + 8, 2, 2);') &&
  wSrc.includes('const dhw = x * 31 + y * 17;') && wSrc.includes('export function caveWellState(hero)') &&
  wSrc.includes('export function caveCartState(hero)') && wSrc.includes('export function caveSandState(hero)') &&
  wSrc.includes('function drawCaveRail(camX, camY)') && wSrc.includes('export function galleryArchState(hero)') &&
  wSrc.includes('export function steleLitState(hero)') && wSrc.includes('export function villageLampState(hero)') &&
  wSrc.includes('export function villageWellState(hero)') && wSrc.includes('function drawCampFire(camX, camY)') &&
  wSrc.includes('if (isTallGrass(x, y)) {') && wSrc.includes("if (curMap() === 'dungeon' && (x * 7 + y * 13) % 4 === 0) {") &&
  wSrc.includes("if (curMap() === 'village' && (x * 5 + y * 7) % 4 === 0) {"));

// —— 状态纯函数逐值 ——
ok('trueCrystalState 逐值：新档 → sleep / 双徽记 → awake / trueBoss → empty / 缺旗标防御 sleep',
  trueCrystalState({}) === 'sleep' && trueCrystalState({ bossDefeated: true, caveBoss: true }) === 'awake' &&
  trueCrystalState({ trueBoss: true }) === 'empty' && trueCrystalState(null) === 'sleep');
ok('trueAltarState 逐值：新档 → lit / trueBoss → dead / 缺旗标防御 lit',
  trueAltarState({}) === 'lit' && trueAltarState({ trueBoss: true }) === 'dead' && trueAltarState(null) === 'lit');

// —— 运行期实证：cave 三档 / gallery 两档 捕获（承 v22.57-v22.61 捕获同法）——
function captureMap(mapName, heroX, heroY) {
  const rects = [];
  const origFR = CTX.fillRect;
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
const inBox = (r, px, py) => r.x >= px - 1 && r.x <= px + 33 && r.y >= py - 1 && r.y <= py + 33;
const cxDone = (r, px, py, w, h, fs) => inBox(r, px, py) && r.w === w && r.h === h && r.fs === fs;

// cave 沉睡档（新档默认）
const capCS = captureMap('cave', 12, 10);
const cCS = capCS.cam;
const pxC = 12 * T - cCS.x, pyC = 11 * T - cCS.y;
const sleepBody = (r) => cxDone(r, pxC, pyC, 4, 18, 'rgba(95,216,255,.45)');
ok('cave 沉睡档：无抛错（drawWorld 全链路）', !capCS.rects.some((r) => r.fs.startsWith('THREW:')),
  JSON.stringify(capCS.rects.filter((r) => r.fs.startsWith('THREW:'))));
ok('cave 沉睡档：岩地盘面 32×32 @+0,+0 落位',
  !!capCS.rects.find((r) => r.x === pxC && r.y === pyC && r.w === 32 && r.h === 32 && r.fs === '#2a2f38'));
ok('cave 沉睡档：沉睡晶簇 4×18 @+14,+6 落位（+9/+20 侧晶 3×12）',
  capCS.rects.some(sleepBody) &&
  !!capCS.rects.find((r) => r.x === pxC + 9 && r.y === pyC + 12 && r.w === 3 && r.h === 12 && r.fs === 'rgba(95,216,255,.45)') &&
  !!capCS.rects.find((r) => r.x === pxC + 20 && r.y === pyC + 12 && r.w === 3 && r.h === 12 && r.fs === 'rgba(95,216,255,.45)'));
ok('cave 沉睡档：恰 1 组（视野内零多余沉睡晶簇）', capCS.rects.filter(sleepBody).length === 1,
  String(capCS.rects.filter(sleepBody).length));
ok('cave 沉睡档：零睁眼光晕（无 22×22 rgba(95,216,255,.3)）',
  !capCS.rects.some((r) => r.w === 22 && r.h === 22 && r.fs === 'rgba(95,216,255,.3)'));

// cave 睁眼档（双徽记）
const capCA = captureMap('cave', 12, 10);
const cCA = capCA.cam;
const pxCA = 12 * T - cCA.x, pyCA = 11 * T - cCA.y;
S.G = newGame('测试'); S.G.map = 'cave'; S.G.x = 12; S.G.y = 10; S.G.bossDefeated = true; S.G.caveBoss = true;
S.dir = 'R'; S.scene = 'world'; S.walk = null;
let rectsAwake = [];
const origFR2 = CTX.fillRect;
CTX.fillRect = (x, y, w, h) => { rectsAwake.push({ x, y, w, h, fs: String(CTX.fillStyle) }); return origFR2.call(CTX, x, y, w, h); };
try { loadMap('cave'); drawWorld(); } catch (e) { rectsAwake.push({ fs: 'THREW:' + e.message, x: -1, y: -1, w: 0, h: 0 }); }
CTX.fillRect = origFR2;
const capAwake = { rects: rectsAwake, cam: cam() };
const cAw = capAwake.cam;
const pxAw = 12 * T - cAw.x, pyAw = 11 * T - cAw.y;
ok('cave 睁眼档：无抛错且亮星蓝晶簇 4×20 @+14,+4 落位（#9adcff 星井/星砂车亮档同族）',
  !capAwake.rects.some((r) => r.fs.startsWith('THREW:')) &&
  !!capAwake.rects.find((r) => r.x === pxAw + 14 && r.y === pyAw + 4 && r.w === 4 && r.h === 20 && r.fs === '#9adcff'));
ok('cave 睁眼档：光晕 22×22 rgba(95,216,255,.3) @+5,+5 落位',
  !!capAwake.rects.find((r) => r.x === pxAw + 5 && r.y === pyAw + 5 && r.w === 22 && r.h === 22 && r.fs === 'rgba(95,216,255,.3)'));
ok('cave 睁眼档：恰 1 组亮星蓝晶簇', capAwake.rects.filter((r) => cxDone(r, pxAw, pyAw, 4, 20, '#9adcff')).length === 1);
ok('cave 睁眼档：零沉睡晶簇（4×18 rgba(95,216,255,.45) 已随状态迁移）',
  !capAwake.rects.some((r) => cxDone(r, pxAw, pyAw, 4, 18, 'rgba(95,216,255,.45)')));

// cave 空档（trueBoss）
const capCE = captureMap('cave', 12, 10);
const cCE = capCE.cam;
const pxCE = 12 * T - cCE.x, pyCE = 11 * T - cCE.y;
S.G = newGame('测试'); S.G.map = 'cave'; S.G.x = 12; S.G.y = 10; S.G.trueBoss = true;
S.dir = 'R'; S.scene = 'world'; S.walk = null;
let rectsEmpty = [];
const origFR3 = CTX.fillRect;
CTX.fillRect = (x, y, w, h) => { rectsEmpty.push({ x, y, w, h, fs: String(CTX.fillStyle) }); return origFR3.call(CTX, x, y, w, h); };
try { loadMap('cave'); drawWorld(); } catch (e) { rectsEmpty.push({ fs: 'THREW:' + e.message, x: -1, y: -1, w: 0, h: 0 }); }
CTX.fillRect = origFR3;
const capEmpty = { rects: rectsEmpty, cam: cam() };
const cE = capEmpty.cam;
const pxE = 12 * T - cE.x, pyE = 11 * T - cE.y;
ok('cave 空档：无抛错且灰晶 4×18 #5a6472 @+14,+6 落位（星砂堆不亮档同族，报文「水晶空了」同口径）',
  !capEmpty.rects.some((r) => r.fs.startsWith('THREW:')) &&
  !!capEmpty.rects.find((r) => r.x === pxE + 14 && r.y === pyE + 6 && r.w === 4 && r.h === 18 && r.fs === '#5a6472'));
ok('cave 空档：恰 1 组灰晶', capEmpty.rects.filter((r) => cxDone(r, pxE, pyE, 4, 18, '#5a6472')).length === 1);
ok('cave 空档：晶格内零蓝色（零光晕零亮晶零沉睡——#9adcff/光晕/沉睡档全零）',
  !capEmpty.rects.some((r) => inBox(r, pxE, pyE) && r.w >= 3 &&
    (r.fs === '#9adcff' || r.fs === '#cfeaff' || r.fs === 'rgba(95,216,255,.3)')));

// gallery 未战金核档
const capGL = captureMap('gallery', 20, 4);
const cGL = capGL.cam;
const pxG = 21 * T - cGL.x, pyG = 4 * T - cGL.y;
ok('gallery 未战档：无抛错且金核 4×8 rgba(240,192,64,.9) @+14,+10 落位（TRUE_BOSS #f0c040 同族）',
  !capGL.rects.some((r) => r.fs.startsWith('THREW:')) &&
  !!capGL.rects.find((r) => r.x === pxG + 14 && r.y === pyG + 10 && r.w === 4 && r.h === 8 && r.fs === 'rgba(240,192,64,.9)'));
ok('gallery 未战档：金晕 16×16 rgba(240,192,64,.18) @+8,+8 落位 + 芯亮 #f0c040 2×4 @+15,+12',
  !!capGL.rects.find((r) => r.x === pxG + 8 && r.y === pyG + 8 && r.w === 16 && r.h === 16 && r.fs === 'rgba(240,192,64,.18)') &&
  !!capGL.rects.find((r) => r.x === pxG + 15 && r.y === pyG + 12 && r.w === 2 && r.h === 4 && r.fs === '#f0c040'));
ok('gallery 未战档：恰 1 组金核', capGL.rects.filter((r) => cxDone(r, pxG, pyG, 4, 8, 'rgba(240,192,64,.9)')).length === 1);

// gallery 战后灰核档
const capGD = captureMap('gallery', 20, 4);
const cGD = capGD.cam;
const pxGD = 21 * T - cGD.x, pyGD = 4 * T - cGD.y;
S.G = newGame('测试'); S.G.map = 'gallery'; S.G.x = 20; S.G.y = 4; S.G.trueBoss = true;
S.dir = 'R'; S.scene = 'world'; S.walk = null;
let rectsDead = [];
const origFR4 = CTX.fillRect;
CTX.fillRect = (x, y, w, h) => { rectsDead.push({ x, y, w, h, fs: String(CTX.fillStyle) }); return origFR4.call(CTX, x, y, w, h); };
try { loadMap('gallery'); drawWorld(); } catch (e) { rectsDead.push({ fs: 'THREW:' + e.message, x: -1, y: -1, w: 0, h: 0 }); }
CTX.fillRect = origFR4;
const capDead = { rects: rectsDead, cam: cam() };
const cD2 = capDead.cam;
const pxD2 = 21 * T - cD2.x, pyD2 = 4 * T - cD2.y;
ok('gallery 战后档：无抛错且灰核 4×8 #5a6472 @+14,+10 落位（零金零晕）',
  !capDead.rects.some((r) => r.fs.startsWith('THREW:')) &&
  !!capDead.rects.find((r) => r.x === pxD2 + 14 && r.y === pyD2 + 10 && r.w === 4 && r.h === 8 && r.fs === '#5a6472'));
ok('gallery 战后档：全捕获零 rgba(240,192,64,*)（金核/金晕/芯亮全零——祭祀已熄）',
  !capDead.rects.some((r) => r.fs.startsWith('rgba(240,192,64,')) && !capDead.rects.some((r) => r.fs === '#f0c040'));

// village / dungeon：无 SB —— 零晶体防泄漏 + 无抛错
{
  const capV = captureMap('village', 12, 7);
  ok('village 运行期：无抛错且零晶体（无沉睡/睁眼/空/金核签名）',
    !capV.rects.some((r) => r.fs.startsWith('THREW:')) &&
    !capV.rects.some((r) => r.w === 4 && r.h === 18 && r.fs === 'rgba(95,216,255,.45)') &&
    !capV.rects.some((r) => r.w === 4 && r.h === 20 && r.fs === '#9adcff') &&
    !capV.rects.some((r) => r.w === 4 && r.h === 8 && r.fs === 'rgba(240,192,64,.9)') &&
    !capV.rects.some((r) => r.w === 22 && r.h === 22 && r.fs === 'rgba(95,216,255,.3)'));
  const capD = captureMap('dungeon', 12, 10);
  ok('dungeon 运行期：无抛错且零晶体（营地篝火/水柱/菌盖/谷穗零回归）',
    !capD.rects.some((r) => r.fs.startsWith('THREW:')) &&
    !capD.rects.some((r) => r.w === 4 && r.h === 18 && r.fs === 'rgba(95,216,255,.45)') &&
    !capD.rects.some((r) => r.w === 4 && r.h === 20 && r.fs === '#9adcff') &&
    !capD.rects.some((r) => r.w === 4 && r.h === 8 && r.fs === 'rgba(240,192,64,.9)') &&
    !capD.rects.some((r) => r.w === 22 && r.h === 22 && r.fs === 'rgba(95,216,255,.3)'));
}

// —— v23.28 幽冥魔王祭坛/洞窟领主祭坛补脸（承 v22.62 同族先例的收口）——
ok('data.js 含 v23.28 注释（幽冥魔王祭坛/洞窟领主祭坛补脸）', dSrc.includes('v23.28 幽冥魔王祭坛位置'));
ok('data.js GAME_VERSION 已为 v23.28（旧 v23.27 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v23.58';") && !dSrc.includes("const GAME_VERSION = 'v23.27';"));
ok('data.js 常量声明逐字（BOSS_ALTAR = { x: 20, y: 13 } / MB_ALTAR = { x: 20, y: 8 }）',
  dSrc.includes('const BOSS_ALTAR = { x: 20, y: 13 };') && dSrc.includes('const MB_ALTAR = { x: 20, y: 8 };'));
ok('data.js 导出 BOSS_ALTAR/MB_ALTAR（export 块落位，与 TRUE_ALTAR 相邻）',
  dSrc.includes('TRUE_ALTAR, CAVE_RAIL, BOSS_ALTAR, MB_ALTAR'));
ok('drawWorld.js 导入 BOSS_ALTAR/MB_ALTAR（data.js 单一数据源）',
  wSrc.includes('CAMP_FIRE, BOSS_ALTAR, MB_ALTAR'));
ok('drawWorld.js 含 v23.28 注释与 bossAltarState/mbAltarState 状态纯函数（两档）',
  wSrc.includes('v23.28 幽冥魔王祭坛') && wSrc.includes('v23.28 洞窟领主祭坛') &&
  wSrc.includes('export function bossAltarState(hero)') && wSrc.includes('export function mbAltarState(hero)'));
ok('drawWorld.js 魔王祭坛几何（32×64 石台 #3a4148 整幅 + 台面 #5a6472 + 台基 #2e333c + 芯火 #ffd24a 4×6）',
  wSrc.includes('CTX.fillRect(px, py, 32, 64);') && wSrc.includes("CTX.fillStyle = '#5a6472'") &&
  wSrc.includes("CTX.fillStyle = '#ffd24a'") && wSrc.includes('CTX.fillRect(cx - 2, py + 2, 4, 6);'));
ok('drawWorld.js 领主祭坛几何（32×64 岩地盘面 #2a2f38 整幅 + 断镐 #8a5a2b 9×4 + 星砂微光 rgba(95,216,255,.18)）',
  wSrc.includes("CTX.fillStyle = '#2a2f38'") && wSrc.includes('CTX.fillRect(cx - 8, py + 10, 9, 4);') &&
  wSrc.includes('rgba(95,216,255,.18)'));
ok('drawWorld.js 调用落位（dungeon drawBossAltar / cave drawMbAltar）',
  wSrc.includes("curMap() === 'dungeon') drawBossAltar(c.x, c.y)") &&
  wSrc.includes("curMap() === 'cave') drawMbAltar(c.x, c.y)"));
ok('bossAltarState 逐值：新档 → lit / bossDefeated → dead / 缺旗标防御 lit',
  bossAltarState({}) === 'lit' && bossAltarState({ bossDefeated: true }) === 'dead' && bossAltarState(null) === 'lit');
ok('mbAltarState 逐值：新档 → lit / caveBoss → dead / 缺旗标防御 lit',
  mbAltarState({}) === 'lit' && mbAltarState({ caveBoss: true }) === 'dead' && mbAltarState(null) === 'lit');

// dungeon 魔王祭坛未战档（新档）
const capBL = captureMap('dungeon', 20, 11);
const cBL = capBL.cam;
const pxB = 20 * T - cBL.x, pyB = 13 * T - cBL.y;
const cxB = pxB + 16;
ok('dungeon 魔王祭坛未战档：无抛错且石台 32×64 #3a4148 落位（盖住通用门贴图）',
  !capBL.rects.some((r) => r.fs.startsWith('THREW:')) &&
  !!capBL.rects.find((r) => r.x === pxB && r.y === pyB && r.w === 32 && r.h === 64 && r.fs === '#3a4148'));
ok('dungeon 魔王祭坛未战档：芯火 4×6 #ffd24a + 金晕 24×12 rgba(255,210,74,.2) 落位且恰 1 组',
  !!capBL.rects.find((r) => r.x === cxB - 2 && r.y === pyB + 2 && r.w === 4 && r.h === 6 && r.fs === '#ffd24a') &&
  !!capBL.rects.find((r) => r.x === pxB + 4 && r.y === pyB + 2 && r.w === 24 && r.h === 12 && r.fs === 'rgba(255,210,74,.2)') &&
  capBL.rects.filter((r) => r.x === cxB - 2 && r.y === pyB + 2 && r.w === 4 && r.h === 6 && r.fs === '#ffd24a').length === 1);

// dungeon 魔王祭坛战后档（bossDefeated）
S.G = newGame('测试'); S.G.map = 'dungeon'; S.G.x = 20; S.G.y = 11; S.G.bossDefeated = true;
S.dir = 'R'; S.scene = 'world'; S.walk = null;
let rectsBL2 = [];
const origFRB = CTX.fillRect;
CTX.fillRect = (x, y, w, h) => { rectsBL2.push({ x, y, w, h, fs: String(CTX.fillStyle) }); return origFRB.call(CTX, x, y, w, h); };
try { loadMap('dungeon'); drawWorld(); } catch (e) { rectsBL2.push({ fs: 'THREW:' + e.message, x: -1, y: -1, w: 0, h: 0 }); }
CTX.fillRect = origFRB;
const capBL2 = { rects: rectsBL2, cam: cam() };
const cBL2 = capBL2.cam;
const pxB2 = 20 * T - cBL2.x, pyB2 = 13 * T - cBL2.y;
const cxB2 = pxB2 + 16;
ok('dungeon 魔王祭坛战后档：无抛错且灰芯 4×6 #5a6472 落位、零金晕（灯芯回来了）',
  !capBL2.rects.some((r) => r.fs.startsWith('THREW:')) &&
  !!capBL2.rects.find((r) => r.x === cxB2 - 2 && r.y === pyB2 + 2 && r.w === 4 && r.h === 6 && r.fs === '#5a6472') &&
  !capBL2.rects.some((r) => r.w === 24 && r.h === 12 && r.fs === 'rgba(255,210,74,.2)') &&
  !capBL2.rects.some((r) => r.w === 4 && r.h === 6 && r.fs === '#ffd24a'));

// cave 洞窟领主祭坛未战档（新档）
const capML = captureMap('cave', 20, 5);
const cML = capML.cam;
const pxM = 20 * T - cML.x, pyM = 8 * T - cML.y;
const cxM = pxM + 16;
ok('cave 洞窟领主祭坛未战档：无抛错且岩地盘面 32×64 #2a2f38 落位 + 断镐 #8a5a2b 9×4',
  !capML.rects.some((r) => r.fs.startsWith('THREW:')) &&
  !!capML.rects.find((r) => r.x === pxM && r.y === pyM && r.w === 32 && r.h === 64 && r.fs === '#2a2f38') &&
  !!capML.rects.find((r) => r.x === cxM - 8 && r.y === pyM + 10 && r.w === 9 && r.h === 4 && r.fs === '#8a5a2b'));
ok('cave 洞窟领主祭坛未战档：星砂微光 20×10 rgba(95,216,255,.18) 落位且恰 1 组',
  !!capML.rects.find((r) => r.x === pxM + 6 && r.y === pyM + 6 && r.w === 20 && r.h === 10 && r.fs === 'rgba(95,216,255,.18)') &&
  capML.rects.filter((r) => r.w === 20 && r.h === 10 && r.fs === 'rgba(95,216,255,.18)').length === 1);

// cave 洞窟领主祭坛战后档（caveBoss）
S.G = newGame('测试'); S.G.map = 'cave'; S.G.x = 20; S.G.y = 5; S.G.caveBoss = true;
S.dir = 'R'; S.scene = 'world'; S.walk = null;
let rectsML2 = [];
const origFRM = CTX.fillRect;
CTX.fillRect = (x, y, w, h) => { rectsML2.push({ x, y, w, h, fs: String(CTX.fillStyle) }); return origFRM.call(CTX, x, y, w, h); };
try { loadMap('cave'); drawWorld(); } catch (e) { rectsML2.push({ fs: 'THREW:' + e.message, x: -1, y: -1, w: 0, h: 0 }); }
CTX.fillRect = origFRM;
const capML2 = { rects: rectsML2, cam: cam() };
ok('cave 洞窟领主祭坛战后档：无抛错且零星砂微光（星砂车卸空/星砂堆不亮同族）',
  !capML2.rects.some((r) => r.fs.startsWith('THREW:')) &&
  !capML2.rects.some((r) => r.w === 20 && r.h === 10 && r.fs === 'rgba(95,216,255,.18)'));

// village / gallery：零祭坛新签名防泄漏（魔王/领主签名在无 BOSS/MB 的地图零触发）
{
  const capV2 = captureMap('village', 12, 7);
  ok('village 运行期：零魔王/领主祭坛签名（无 32×64 #3a4148 险台、无 24×12 金晕、无 20×10 星砂微光）',
    !capV2.rects.some((r) => r.fs.startsWith('THREW:')) &&
    !capV2.rects.some((r) => r.w === 32 && r.h === 64 && (r.fs === '#3a4148' || r.fs === '#2a2f38')) &&
    !capV2.rects.some((r) => r.w === 24 && r.h === 12 && r.fs === 'rgba(255,210,74,.2)') &&
    !capV2.rects.some((r) => r.w === 20 && r.h === 10 && r.fs === 'rgba(95,216,255,.18)'));
  const capG2 = captureMap('gallery', 20, 4);
  ok('gallery 运行期：零魔王/领主祭坛签名（v22.62 金核/灰核零回归）',
    !capG2.rects.some((r) => r.fs.startsWith('THREW:')) &&
    !capG2.rects.some((r) => r.w === 32 && r.h === 64 && (r.fs === '#3a4148' || r.fs === '#2a2f38')) &&
    !capG2.rects.some((r) => r.w === 24 && r.h === 12 && r.fs === 'rgba(255,210,74,.2)') &&
    !capG2.rects.some((r) => r.w === 20 && r.h === 10 && r.fs === 'rgba(95,216,255,.18)'));
}

// —— 契约：零碰撞 / 零 NPC 变更 / 两处 SB 落位 / 重载重建 ——
loadMap('cave');
ok('契约：TY.SB 不在 SOLID（晶簇/祭坛可行走——interact 判定零碰撞变化）', !SOLID.has(TY.SB));
ok('契约：at(12,11) === TY.SB（终焉水晶原位）', at(12, 11) === TY.SB, String(at(12, 11)));
ok('契约：loadMap 重载后 at(12,11) 仍 SB（重载重建·v22.52 轨道零回归）', at(12, 11) === TY.SB);
loadMap('gallery');
ok('契约：at(21,4) === TY.SB（终焉之神祭坛原位）', at(21, 4) === TY.SB, String(at(21, 4)));
ok('契约：loadMap 重载后 at(21,4) 仍 SB（重载重建·名字之门 v22.41 零回归）', at(21, 4) === TY.SB);
ok('契约：TY.BOSS/TY.MB 不在 SOLID（祭坛可行走——踩踏开战判定零碰撞变化）', !SOLID.has(TY.BOSS) && !SOLID.has(TY.MB));
loadMap('dungeon');
ok('契约：at(20,13)/at(20,14) === TY.BOSS（幽冥魔王祭坛原位 2×1 纵排）', at(20, 13) === TY.BOSS && at(20, 14) === TY.BOSS,
  String(at(20, 13)) + ',' + String(at(20, 14)));
ok('契约：loadMap 重载后 at(20,13) 仍 BOSS（重载重建·守夜人 v22.45 零回归）', at(20, 13) === TY.BOSS);
loadMap('cave');
ok('契约：at(20,8)/at(20,9) === TY.MB（洞窟领主祭坛原位 2×1 纵排）', at(20, 8) === TY.MB && at(20, 9) === TY.MB,
  String(at(20, 8)) + ',' + String(at(20, 9)));
ok('契约：loadMap 重载后 at(20,8) 仍 MB（重载重建·守洞人 v22.92 零回归）', at(20, 8) === TY.MB);
ok('契约：NPC 总数保持 34（零 NPC 变更，v22.51 pin 续守）', Object.keys(NPC_SPOTS).length === 38,
  String(Object.keys(NPC_SPOTS).length));

// —— README / package.json / CHANGELOG 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树收录 smoke_v2262_crystal 且位于串尾',
  readme.includes('smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 件套口径为二百一十二件套（二百一十一件套清除）且旧 157 口径零残留',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟一百五十七件套（一百五十六件套清' + '除）'));
ok('README 含 v22.62 守护描述（星井矿脉/无字回廊终焉水晶·终焉之神祭坛补脸守护）',
  readme.includes('v22.62 起含星井矿脉/无字回廊「终焉水晶·终焉之神祭坛」补脸守护'));
ok('README 含 smoke_v2262_crystal 入库（158 份）', readme.includes('smoke_v2262_crystal 入库（158 份）'));
ok('README 仍保留 smoke_v2261_rich3 入库（157 份）历史口径', readme.includes('smoke_v2261_rich3 入库（157 份）'));
ok('README 星井矿脉段含终焉水晶补脸行（v22.62）', readme.includes('**终焉水晶**（v22.62 起世界画面可见'));
ok('README 无字回廊段含终焉之神祭坛补脸行（v22.62）', readme.includes('**终焉之神祭坛**（v22.62 起世界画面可见'));
ok('README 视觉 bullet 含终焉水晶/祭坛补脸景观（v22.62）', readme.includes('**终焉水晶/祭坛补脸景观**（v22.62'));
ok('package.json 已收录 smoke_v2262_crystal（npm test 串跑第 158 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2262_crystal.mjs'));
ok('package.json 串尾为 smoke_v2261_rich3.mjs && node tests/smoke_v2262_crystal.mjs && node tests/smoke_v2263_ptime3.mjs && node tests/smoke_v2264_hunt3.mjs && node tests/smoke_v2265_lucky3.mjs && node tests/smoke_v2266_stock3.mjs && node tests/smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"',
  pkg.includes('smoke_v2261_rich3.mjs && node tests/smoke_v2262_crystal.mjs && node tests/smoke_v2263_ptime3.mjs && node tests/smoke_v2264_hunt3.mjs && node tests/smoke_v2265_lucky3.mjs && node tests/smoke_v2266_stock3.mjs && node tests/smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 158 件套', testChain === 212, String(testChain));
ok('CHANGELOG 顶为 v22.62 条目', changelog.startsWith('## v23.58 '));
ok('CHANGELOG 含 v22.61 条目', changelog.includes('## v22.61 '));

// —— 姊妹件套 pin 复查（v2261/v2260 随新现实更新 + 哨兵链 159 就位）——
const s2261 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2261_rich3.mjs'), 'utf8');
const s2260 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2260_fountripple.mjs'), 'utf8');
const s2259 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2259_sandpile.mjs'), 'utf8');
const s2143 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2143_talkekey.mjs'), 'utf8');
const s2144 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2144_run.mjs'), 'utf8');
ok('smoke_v2261 的 GAME_VERSION 字面量 pin 已更新为 v22.62', s2261.includes("const GAME_VERSION = 'v23.58';"));
ok('smoke_v2260 的 GAME_VERSION 恒等 pin 族已随新现实全库更新（v22.62 字面量 pin 落位）',
  s2260.includes("const GAME_VERSION = 'v23.58';"));
ok('smoke_v2260 的 README 件套 pin 已随新现实更新为二百一十二件套（二百一十一件套清除）',
  s2260.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2260 的 package.json 件套计数 pin 已更新为 === 158', s2260.includes('testChain === 212'));
ok('smoke_v2260 的 CHANGELOG 顶 pin 已更新为 ## v22.62', s2260.includes("startsWith('## v23.58')") || s2260.includes("startsWith('## v22.78 ')"));
ok('smoke_v2260 的 README 串尾 pin 已随新现实延伸至 smoke_v2262_crystal',
  s2260.includes('smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2261 的 package.json 串尾 plain pin 已延伸至 smoke_v2262_crystal',
  s2261.includes('smoke_v2261_rich3.mjs && node tests/smoke_v2262_crystal.mjs && node tests/smoke_v2263_ptime3.mjs && node tests/smoke_v2264_hunt3.mjs && node tests/smoke_v2265_lucky3.mjs && node tests/smoke_v2266_stock3.mjs && node tests/smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
ok('smoke_v2259 的 GAME_VERSION 字面量 pin 已更新为 v22.62', s2259.includes("const GAME_VERSION = 'v23.58';"));
ok('v2143-45「件套守护领先一位」哨兵链已推进至 159（二百一十二件套（二百一十一件套清除））',
  s2143.includes('二百一十三件套（二百一十二件套清除）') && s2143.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));
ok('smoke_v2144 的哨兵链 pin 已随新现实推进（!readme.includes(\'一百五十九件套\')）',
  s2144.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));

// 旧代 v22.61 pin 全库零残留（字面量/恒等/件套/串尾/testChain/顶 pin）
const allTests = fs.readdirSync(path.join(ROOT, 'tests')).filter((f) => /^smoke_.*\.mjs$/.test(f));
const stale = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "61';") || src.includes("GAME_VERSION === 'v22." + "61'") ||
      src.includes('一百五十七件套（一百五十六件套清' + '除）') || src.includes('testChain === ' + '157') ||
      src.includes("startsWith('## v22." + "61'") ||
      src.includes('smoke_v2261_rich3（npm test 串' + '跑）')) stale.push(f);
}
ok('旧代 v22.61 字面量/恒等/件套/串尾/testChain/顶 pin 全库零残留（' + allTests.length + ' 件扫描，含本件）', stale.length === 0, stale.join(','));
// 坏链防回归：README 不得出现 v2261 孤尾（其后必须直接接 v2262）
ok('README 串尾无孤尾（smoke_v2261_rich3 后必须接 smoke_v2262_crystal）',
  !readme.includes('smoke_v2261_rich3（npm test 串' + '跑）'));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
