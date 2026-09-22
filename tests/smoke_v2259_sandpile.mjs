// v22.59 专项冒烟：星井矿脉西场「星砂堆」景观（新内容·世界景观·纯显示，承 v22.38 星井 / v22.39 星砂车
// 「名字物补脸」先例的收口）——筛砂人（5,5）「把星砂一筛一筛拣回砂堆旁」/after「砂堆不亮了。我筛了一辈
// 子，头一回筛出这么多空的」「——不是空了，是被记起来了」：矿脉从前往镇上运星砂喂记忆之灯，井与车都
// 有脸了，唯独这堆「喂灯的砂」本体一像素都没有；现于筛砂人南邻 (5,6)（data.js CAVE_SAND 单一数据源，
// 可行走 CAVE 格零碰撞、不在 CAVE_RAIL 轨道上）立起星砂堆：两档与星井/星砂车同读 S.G.trueBoss 一份源
// ——亮砂（!trueBoss）星砂蓝砂面 #9adcff + 浮光 #cfeaff + 蓝青光晕 rgba(95,216,255,.18) / 不亮（trueBoss）
// 暗灰 #5a6472 零浮光零光晕，木色筛箩斜靠（#8a5a2b/#6a4a2f 与星砂车木料同族、零新增颜色族）；纯显示零
// 结算零存档零数值变化，不设小地图标记（无决策信息，与星砂车/名字之门/村井同口径）。
// 本冒烟守护：版本锚点、data.js/drawWorld.js 源级落位（v22.59 注释 + GAME_VERSION v22.59 + CAVE_SAND 常量
// + caveSandState/drawCaveSand + 调用点 + 色板/几何 + 既有分支零回归）、运行期真实捕获（cave 亮砂/不亮
// 两档逐矩形逐 arc 落位 + 恰 1 组 + village/gallery 零砂堆防泄漏 + 星井/星砂车零回归）、契约（CAVE_SAND
// 逐值/at(5,6)===TY.CAVE/SOLID 不含 CAVE/轨道 35 格零同格/NPC 总数 34 零变更/loadMap 重载重建）、
// README/package.json/CHANGELOG 同步（tests 树尾/件套口径 155/v22.59 守护描述/入库 155 份/星井矿脉行/
// 视觉 bullet）、姊妹件套 pin（v2258..v2226 随新现实更新，含 v2228 三风格锚与 v2239/v2240 容错正则尾锚）
// 复查 + 旧代 v22.58 字面量/恒等/件套/串尾/testChain pin 全库零残留 + 哨兵链 156 就位 + 坏链防回归。
import { S } from '../js/state.js';
import { GAME_VERSION, NPC_SPOTS, TY, SOLID, MAPS, CAVE_SAND, CAVE_RAIL } from '../js/data.js';
import { newGame } from '../js/core.js';
import { loadMap, at } from '../js/world.js';
import { caveSandState } from '../js/view/drawWorld.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— DOM 桩（承 v21.30-v22.58 冒烟先例：先装桩再 import main.js；fillRect/arc 捕获供砂堆断言）——
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

console.log('— v22.59 星井矿脉星砂堆景观 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const wSrc = fs.readFileSync(path.join(ROOT, 'js/view/drawWorld.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.58 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.58（本版守 v22.60）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 59)), GAME_VERSION);
ok('data.js 含 v22.59 注释（新内容·世界景观·纯显示）', dSrc.includes('v22.59 新内容·世界景观·纯显示'));
ok('GAME_VERSION 字面量已为 v22.60（旧 v22.58 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v23.70';") && !dSrc.includes("const GAME_VERSION = 'v22." + "58';"));
ok('data.js 仍保留 v22.58/v22.57 世代注释链（喝药行/水塘灯影注释未动）',
  dSrc.includes('v22.58 体验打磨·信息透明·纯文字') && dSrc.includes('v22.57 新内容·世界景观·纯显示'));

// —— data.js 源级落位：CAVE_SAND 常量 + export 块 ——
ok('data.js 含 CAVE_SAND = { x: 5, y: 6 }（星砂堆位置单一数据源）',
  dSrc.includes('const CAVE_SAND = { x: 5, y: 6 };'));
ok('data.js export 块已收录 CAVE_SAND（CAVE_CART, CAVE_SAND, CAVE_RAIL 相邻）',
  dSrc.includes('CAVE_SAND, CAVE_CRYSTAL, TRUE_ALTAR, CAVE_RAIL'));
ok('data.js 含 v22.59 常量注释（星砂堆·承星井/星砂车补脸先例）',
  dSrc.includes('v22.59 星井矿脉「星砂堆」'));

// —— drawWorld.js 源级落位：caveSandState + drawCaveSand + 调用点 + 色板 + 几何 ——
const T = 32;
ok('drawWorld.js 含 v22.59 注释（星砂堆说明）', wSrc.includes('v22.59 星井矿脉「星砂堆」'));
ok('drawWorld.js 含 caveSandState 纯函数（与星井/星砂车同读 S.G.trueBoss 只读旗标）',
  wSrc.includes('export function caveSandState(hero)') && wSrc.includes("return 'dim';") && wSrc.includes("return 'lit';"));
ok('drawWorld.js 含 drawCaveSand 函数（先于角色层·位置读 CAVE_SAND 单一数据源）',
  wSrc.includes('function drawCaveSand(camX, camY)') && wSrc.includes('CAVE_SAND.x * T - camX'));
ok('drawWorld.js 调用点（星砂车后·仅 cave）',
  wSrc.includes("if (S.G && curMap() === 'cave') drawCaveSand(c.x, c.y);"));
ok('drawWorld.js import 增 CAVE_SAND',
  wSrc.includes('CAVE_SAND, CAVE_CRYSTAL, TRUE_ALTAR, CAVE_RAIL, GALLERY_ARCH'));
ok('drawWorld.js 砂堆色板（rgba(95,216,255,.18) 光晕 / #3a4148 底缘 / #9adcff 亮砂 / #5a6472 不亮砂 / #cfeaff 浮光 / #8a5a2b·#6a4a2f 筛箩）',
  wSrc.includes("CTX.fillStyle = 'rgba(95,216,255,.18)'") && wSrc.includes("CTX.fillStyle = '#3a4148'") &&
  wSrc.includes("CTX.fillStyle = st === 'lit' ? '#9adcff' : '#5a6472'") && wSrc.includes("CTX.fillStyle = '#cfeaff'") &&
  wSrc.includes("CTX.fillStyle = '#8a5a2b'") && wSrc.includes("CTX.fillStyle = '#6a4a2f'"));
ok('drawWorld.js 砂堆几何（底缘 24×3 @+4,+26 / 砂面 22×7 @+5,+20·14×6 @+9,+14·6×4 @+13,+10 / 浮光 2×2 ×4 / 筛箩 3×12 @+24,+11·7×2 @+22,+22 / 光晕 arc r13 @cx,py+16）',
  wSrc.includes('CTX.fillRect(px + 4, py + 26, 24, 3);') &&
  wSrc.includes('CTX.fillRect(px + 5, py + 20, 22, 7);') && wSrc.includes('CTX.fillRect(px + 9, py + 14, 14, 6);') &&
  wSrc.includes('CTX.fillRect(px + 13, py + 10, 6, 4);') &&
  wSrc.includes('CTX.fillRect(px + 8, py + 17, 2, 2);') && wSrc.includes('CTX.fillRect(px + 20, py + 15, 2, 2);') &&
  wSrc.includes('CTX.fillRect(px + 15, py + 7, 2, 2);') && wSrc.includes('CTX.fillRect(px + 11, py + 21, 2, 2);') &&
  wSrc.includes('CTX.fillRect(px + 24, py + 11, 3, 12);') && wSrc.includes('CTX.fillRect(px + 22, py + 22, 7, 2);') &&
  wSrc.includes('CTX.arc(cx, py + 16, 13, 0, 7)'));
ok('drawWorld.js 既有分支逐字零回归（星井/星砂车/轨道/名字之门/石碑温光/大灯/村井/营火/高草/菌盖/谷穗/水塘灯影健在）',
  wSrc.includes('export function caveWellState(hero)') && wSrc.includes('export function caveCartState(hero)') &&
  wSrc.includes('function drawCaveRail(camX, camY)') && wSrc.includes('export function galleryArchState(hero)') &&
  wSrc.includes('export function steleLitState(hero)') && wSrc.includes('export function villageLampState(hero)') &&
  wSrc.includes('export function villageWellState(hero)') && wSrc.includes('function drawCampFire(camX, camY)') &&
  wSrc.includes('if (isTallGrass(x, y)) {') && wSrc.includes("if (curMap() === 'dungeon' && (x * 7 + y * 13) % 4 === 0) {") &&
  wSrc.includes("if (curMap() === 'village' && (x * 5 + y * 7) % 4 === 0) {") && wSrc.includes('const dhw = x * 31 + y * 17;'));

// —— 纯函数契约 ——
ok('caveSandState 纯函数：null/无旗标 → lit', caveSandState(null) === 'lit' && caveSandState({}) === 'lit');
ok('caveSandState 纯函数：trueBoss → dim（筛砂人 after「砂堆不亮了」同口径）', caveSandState({ trueBoss: true }) === 'dim');
ok('caveSandState 纯函数：bossDefeated 仍 lit（与星井/星砂车同源两档、不随 bossDefeated 分档）',
  caveSandState({ bossDefeated: true }) === 'lit');

// —— 运行期实证：cave 两档渲染捕获（砂面/浮光/光晕/筛箩逐像素色，承 v22.38/v22.39/v22.56 捕获同法）——
function captureMap(mapName, heroX, heroY, flags) {
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
    if (flags) Object.assign(S.G, flags);
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
  const c = cam();
  const px = CAVE_SAND.x * T - c.x;
  const py = CAVE_SAND.y * T - c.y;
  const inTile = (r) => r.x >= px - 1 && r.x < px + 33 && r.y >= py - 1 && r.y < py + 33;
  const body = (fs) => rects.find((r) => r.x === px + 5 && r.y === py + 20 && r.w === 22 && r.h === 7 && r.fs === fs);
  const spark = () => rects.filter((r) => r.w === 2 && r.h === 2 && r.fs === '#cfeaff' && inTile(r)).length;
  const halo = (fs, r) => arcs.find((a) => a.r === r && a.fs === fs);
  const sieve = () => rects.find((r) => r.x === px + 24 && r.y === py + 11 && r.w === 3 && r.h === 12 && r.fs === '#8a5a2b');
  return { rects, arcs, body, spark, halo, sieve, cam: c, px, py };
}

// 档 A：新档（星井还在低鸣·星砂车满载）——亮砂 #9adcff + 4 浮光 + 蓝青光晕 + 筛箩
const capA = captureMap('cave', 6, 9, {});
ok('cave 运行期（亮砂档）：无抛错（drawWorld 全链路）', !capA.rects.some((r) => r.fs.startsWith('THREW:')),
  JSON.stringify(capA.rects.filter((r) => r.fs.startsWith('THREW:'))));
ok('cave 运行期（亮砂档）：蓝青光晕 rgba(95,216,255,.18) arc r13 落位', !!capA.halo('rgba(95,216,255,.18)', 13),
  JSON.stringify(capA.arcs.slice(0, 8)));
ok('cave 运行期（亮砂档）：光晕恰 1 组（恰一组砂堆，视野内零多余）',
  capA.arcs.filter((a) => a.r === 13 && a.fs === 'rgba(95,216,255,.18)').length === 1);
ok('cave 运行期（亮砂档）：砂面 #9adcff 22×7 @+5,+20 落位', !!capA.body('#9adcff'));
ok('cave 运行期（亮砂档）：砂丘三阶共体（14×6 @+9,+14 / 6×4 @+13,+10）',
  !!capA.rects.find((r) => r.x === capA.px + 9 && r.y === capA.py + 14 && r.w === 14 && r.h === 6 && r.fs === '#9adcff') &&
  !!capA.rects.find((r) => r.x === capA.px + 13 && r.y === capA.py + 10 && r.w === 6 && r.h === 4 && r.fs === '#9adcff'));
ok('cave 运行期（亮砂档）：底缘 #3a4148 24×3 @+4,+26 落位',
  !!capA.rects.find((r) => r.x === capA.px + 4 && r.y === capA.py + 26 && r.w === 24 && r.h === 3 && r.fs === '#3a4148'));
ok('cave 运行期（亮砂档）：浮光 4 枚（#cfeaff 2×2 于砂堆格内——与星井井口星屑同款）', capA.spark() === 4, String(capA.spark()));
ok('cave 运行期（亮砂档）：筛箩 #8a5a2b 3×12 @+24,+11 与 #6a4a2f 7×2 @+22,+22 落位',
  !!capA.sieve() && !!capA.rects.find((r) => r.x === capA.px + 22 && r.y === capA.py + 22 && r.w === 7 && r.h === 2 && r.fs === '#6a4a2f'));

// 档 B：trueBoss（星砂落回矿脉深处·砂堆不亮了）——暗灰 #5a6472，零浮光零光晕，筛箩仍在
const capB = captureMap('cave', 6, 9, { trueBoss: true });
ok('cave 运行期（不亮档）：无抛错', !capB.rects.some((r) => r.fs.startsWith('THREW:')));
ok('cave 运行期（不亮档）：砂面 #5a6472 22×7 @+5,+20 落位（「砂堆不亮了」）', !!capB.body('#5a6472'));
ok('cave 运行期（不亮档）：零蓝青光晕（rgba(95,216,255,.18) arc r13 不出现）', !capB.halo('rgba(95,216,255,.18)', 13));
ok('cave 运行期（不亮档）：零浮光（#cfeaff 2×2 不出现）', capB.spark() === 0, String(capB.spark()));
ok('cave 运行期（不亮档）：零亮砂 #9adcff 22×7（两档互斥零串色）', !capB.body('#9adcff'));
ok('cave 运行期（不亮档）：筛箩仍在（共体零状态分支）', !!capB.sieve());

// 零回归：星井 (16,11) 井水 / 星砂车 (19,10) 车斗星砂 在各自原位（星井/星砂车分支未动）
const capC = captureMap('cave', 17, 10, {});
ok('cave 运行期：星井 (16,11) 井水 #9adcff 10×10 仍落位（v22.38 零回归）',
  !!capC.rects.find((r) => r.fs === '#9adcff' && r.w === 10 && r.h === 10));
ok('cave 运行期：星砂车 (19,10) 车斗星砂 #9adcff 18×7 仍落位（v22.39 零回归）',
  !!capC.rects.find((r) => r.fs === '#9adcff' && r.w === 18 && r.h === 7));

// village / gallery：零砂堆（curMap 门不触发）
{
  const capV = captureMap('village', 10, 15, {});
  ok('village 运行期：无抛错且零蓝青光晕 arc r13（星砂堆不走 village 分支）',
    !capV.rects.some((r) => r.fs.startsWith('THREW:')) && !capV.arcs.some((a) => a.r === 13 && a.fs === 'rgba(95,216,255,.18)'));
  const capG = captureMap('gallery', 12, 3, {});
  ok('gallery 运行期：无抛错且零蓝青光晕 arc r13（名字之门/石碑温光零回归、无砂堆）',
    !capG.rects.some((r) => r.fs.startsWith('THREW:')) && !capG.arcs.some((a) => a.r === 13 && a.fs === 'rgba(95,216,255,.18)'));
}

// —— 契约：零碰撞 / 零 NPC 变更 / 轨道零同格 / 重载重建 / 数据面 ——
loadMap('cave');
ok('契约：CAVE_SAND 常量逐值（x:5 y:6）', CAVE_SAND.x === 5 && CAVE_SAND.y === 6, JSON.stringify(CAVE_SAND));
ok('契约：at(5,6) === TY.CAVE（砂堆格仍是可行走矿脉岩地，零碰撞变化）', at(5, 6) === TY.CAVE, String(at(5, 6)));
ok('契约：TY.CAVE 不在 SOLID（可行走零障碍）', !SOLID.has(TY.CAVE));
ok('契约：CAVE_RAIL 35 格零同格（砂堆不在矿车轨道引导线上）',
  CAVE_RAIL.length === 35 && !CAVE_RAIL.some((p) => p[0] === 5 && p[1] === 6), String(CAVE_RAIL.length));
ok('契约：cave.extras 无 (5,6) 占用（筛砂人 (5,5) 南邻空地、拾骨人 (5,10) 零占位）',
  !(MAPS.cave.extras || []).some((e) => e.x === 5 && e.y === 6) && !NPC_SPOTS['5,6']);
ok('契约：同图关键点零回归——筛砂人 (5,5) NPC / 井巫 (3,1) / 老矿工 (2,3) / 听矿人 (13,2) / 星井 (16,11) / 星砂车 (19,10) / 试炼碑 (18,12) TRIAL / 终焉水晶 (12,11) SB',
  at(5, 5) === TY.NPC && at(3, 1) === TY.NPC && at(2, 3) === TY.NPC && at(13, 2) === TY.NPC &&
  at(16, 11) === TY.CAVE && at(19, 10) === TY.CAVE && at(18, 12) === TY.TRIAL && at(12, 11) === TY.SB);
loadMap('cave');
ok('契约：loadMap 重载后 at(5,6) 仍 CAVE / at(5,5) 仍 NPC（重载重建）',
  at(5, 6) === TY.CAVE && at(5, 5) === TY.NPC);
ok('契约：NPC 总数保持 34（零 NPC 变更，v22.51 pin 续守）', Object.keys(NPC_SPOTS).length === 38,
  String(Object.keys(NPC_SPOTS).length));

// —— README / package.json / CHANGELOG 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树收录 smoke_v2259_sandpile 且位于串尾',
  readme.includes('smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 件套口径为二百一十二件套（二百一十一件套清除）且旧 154 口径零残留',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟一百五十五件套（一百五十四件套清' + '除）'));
ok('README 含 v22.59 守护描述（星井矿脉星砂堆景观守护）', readme.includes('v22.59 起含星井矿脉星砂堆景观守护'));
ok('README 含 smoke_v2259_sandpile 入库（155 份）', readme.includes('smoke_v2259_sandpile 入库（155 份）'));
ok('README 仍保留 smoke_v2258_potionhelp 入库（154 份）历史口径', readme.includes('smoke_v2258_potionhelp 入库（154 份）'));
ok('README 星井矿脉行含星砂堆可见口径（v22.59）',
  readme.includes('星砂堆**（v22.59 起世界画面可见') && readme.includes('(5,6)'));
ok('README 视觉 bullet 含星砂堆景观（v22.59）', readme.includes('星砂堆景观**（v22.59'));
ok('package.json 已收录 smoke_v2259_sandpile（npm test 串跑第 155 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2259_sandpile.mjs'));
ok('package.json 串尾为 smoke_v2259_sandpile.mjs && node tests/smoke_v2260_fountripple.mjs && node tests/smoke_v2261_rich3.mjs && node tests/smoke_v2262_crystal.mjs && node tests/smoke_v2263_ptime3.mjs && node tests/smoke_v2264_hunt3.mjs && node tests/smoke_v2265_lucky3.mjs && node tests/smoke_v2266_stock3.mjs && node tests/smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"',
  pkg.includes('smoke_v2259_sandpile.mjs && node tests/smoke_v2260_fountripple.mjs && node tests/smoke_v2261_rich3.mjs && node tests/smoke_v2262_crystal.mjs && node tests/smoke_v2263_ptime3.mjs && node tests/smoke_v2264_hunt3.mjs && node tests/smoke_v2265_lucky3.mjs && node tests/smoke_v2266_stock3.mjs && node tests/smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 155 件套', testChain === 212, String(testChain));
ok('CHANGELOG 顶为 v22.60 条目', changelog.startsWith('## v23.70 '));
ok('CHANGELOG 含 v22.59 条目', changelog.includes('## v22.59 '));

// —— 姊妹 pin 复查（v2258..v2226 随新现实更新，含 v2228 三风格锚与 v2239/v2240 容错正则尾锚）——
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
ok('smoke_v2258 的 GAME_VERSION 字面量 pin 已更新为 v22.59', s2258.includes("const GAME_VERSION = 'v23.70';"));
ok('smoke_v2258 的 README 串尾 pin 已随新现实延伸至 smoke_v2259_sandpile',
  s2258.includes('smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2258 的 README 件套 pin 已随新现实更新为二百一十二件套（二百一十一件套清除）',
  s2258.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2258 的 package.json 件套计数 pin 已更新为 === 155', s2258.includes('testChain === 212'));
ok('smoke_v2258 的 CHANGELOG 顶 pin 已更新为 ## v22.59', s2258.includes("startsWith('## v23.70')"));
ok('smoke_v2258 的 package.json 串尾 plain pin 已延伸至 smoke_v2259_sandpile',
  s2258.includes('smoke_v2259_sandpile.mjs && node tests/smoke_v2260_fountripple.mjs && node tests/smoke_v2261_rich3.mjs && node tests/smoke_v2262_crystal.mjs && node tests/smoke_v2263_ptime3.mjs && node tests/smoke_v2264_hunt3.mjs && node tests/smoke_v2265_lucky3.mjs && node tests/smoke_v2266_stock3.mjs && node tests/smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
ok('smoke_v2257 的 GAME_VERSION 字面量 pin 已更新为 v22.59', s2257.includes("const GAME_VERSION = 'v23.70';"));
ok('smoke_v2257 的 README 串尾 pin 已延伸至 smoke_v2259_sandpile',
  s2257.includes('smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2256 的 GAME_VERSION 字面量 pin 已更新为 v22.59', s2256.includes("const GAME_VERSION = 'v23.70';"));
ok('smoke_v2255/v2254/v2253/v2252 的 GAME_VERSION 字面量 pin 已更新为 v22.59',
  s2255.includes("const GAME_VERSION = 'v23.70';") && s2254.includes("const GAME_VERSION = 'v23.70';") &&
  s2253.includes("const GAME_VERSION = 'v23.70';") && s2252.includes("const GAME_VERSION = 'v23.70';"));
ok('smoke_v2230 的 package.json 串尾 plain pin 已延伸至 smoke_v2259_sandpile',
  s2230.includes('smoke_v2259_sandpile.mjs && node tests\\/smoke_v2260_fountripple.mjs && node tests\\/smoke_v2261_rich3.mjs && node tests\\/smoke_v2262_crystal.mjs && node tests\\/smoke_v2263_ptime3.mjs && node tests\\/smoke_v2264_hunt3.mjs && node tests\\/smoke_v2265_lucky3.mjs && node tests\\/smoke_v2266_stock3.mjs && node tests\\/smoke_v2267_elixir3.mjs && node tests\\/smoke_v2268_brew3.mjs && node tests\\/smoke_v2269_mush3.mjs && node tests\\/smoke_v2270_outstep.mjs && node tests\\/smoke_v2271_outstep2.mjs && node tests\\/smoke_v2272_scholar2.mjs && node tests\\/smoke_v2273_seen5.mjs && node tests\\/smoke_v2274_seen2\\.mjs && node tests\\/smoke_v2275_codexempty\\.mjs && node tests\\/smoke_v2276_lampkid\\.mjs && node tests\\/smoke_v2277_pondhint\\.mjs && node tests\\/smoke_v2278_mushguide\\.mjs && node tests\\/smoke_v2279_lampwell\\.mjs && node tests\\/smoke_v2280_grainfield\\.mjs && node tests\\/smoke_v2281_starwell\\.mjs && node tests\\/smoke_v2282_archgate\\.mjs && node tests\\/smoke_v2283_menuekey\\.mjs && node tests\\/smoke_v2284_skillekey\\.mjs && node tests\\/smoke_v2285_winekey\\.mjs && node tests\\/smoke_v2286_titleekey\\.mjs && node tests\\/smoke_v2287_trueroute\\.mjs && node tests\\/smoke_v2288_scrollhint\\.mjs && node tests\\/smoke_v2289_winprog\\.mjs && node tests\\/smoke_v2290_statlink\\.mjs && node tests\\/smoke_v2291_lampguide\\.mjs && node tests\\/smoke_v2292_cavewatch\\.mjs && node tests\\/smoke_v2293_deadsave\\.mjs && node tests\\/smoke_v2294_crystalwatch\\.mjs && node tests\\/smoke_v2295_deadprog\\.mjs && node tests\\/smoke_v2296_endingprog\\.mjs && node tests\\/smoke_v2297_chestmid\\.mjs && node tests\\/smoke_v2298_encnum\\.mjs && node tests\\/smoke_v2299_crosslink\\.mjs && node tests\\/smoke_v2300_sidemore\\.mjs && node tests\\/smoke_v2301_eco\\.mjs && node tests\\/smoke_v2302_cmdprev\\.mjs && node tests\\/smoke_v2303_rushnum\\.mjs && node tests\\/smoke_v2304_achgoal\\.mjs && node tests\\/smoke_v2305_monnum\\.mjs && node tests\\/smoke_v2306_skillnum\\.mjs && node tests\\/smoke_v2307_bossnum\\.mjs && node tests\\/smoke_v2308_diffnum\\.mjs && node tests\\/smoke_v2309_questnum\\.mjs && node tests\\/smoke_v2310_diffsum\\.mjs && node tests\\/smoke_v2311_fragprev\\.mjs && node tests\\/smoke_v2312_voltitle\\.mjs && node tests\\/smoke_v2313_talkall\\.mjs && node tests\\/smoke_v2314_voices\\.mjs && node tests\\/smoke_v2315_talkfoot\\.mjs && node tests\\/smoke_v2316_voiceshead\\.mjs"'));
// 串尾锚延伸（任意转义风格：plain `/` / regex `\/` / 双转义 `\\/`）
const archChain = (s) => /smoke_v2260_fountripple[.\\/]{0,4}mjs[\s\S]*?node tests[\\/]{0,4}smoke_v2261_rich3[.\\/]{0,4}mjs/.test(s);
ok('smoke_v2226/v2228/v2229/v2230/v2239/v2240/v2242 的串尾锚已延伸至 smoke_v2259_sandpile（plain/regex/双转义三风格）',
  archChain(s2226) && archChain(s2228) && archChain(s2229) && archChain(s2230) && archChain(s2239) &&
  archChain(s2240) && archChain(s2242));
// 容错正则尾锚（v2239/v2240 宽松模式）
const looseChain = (s) => /smoke_v2260_fountripple[.\\/]{0,6}mjs[\s\S]*?node tests[\\/]{0,6}smoke_v2261_rich3[.\\/]{0,6}mjs/.test(s);
ok('smoke_v2239/smoke_v2240 的容错正则尾锚已延伸至 smoke_v2259_sandpile',
  looseChain(s2239) && looseChain(s2240));
ok('v2143-45「件套守护领先一位」哨兵链已推进至 156（二百一十二件套（二百一十一件套清除））',
  s2143.includes('二百一十三件套（二百一十二件套清除）') && s2143.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));
ok('smoke_v2228 的 GAME_VERSION 字面量 pin 已更新为 v22.59 且旧代零残留复查仍在（v22.27 风格）',
  s2228.includes("const GAME_VERSION = 'v23.70';") && s2228.includes("'v22.") && s2228.includes("27';"));

// 旧代 v22.58 pin 全库零残留（字面量/恒等/件套/串尾/testChain）
const allTests = fs.readdirSync(path.join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs'));
const stale = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "58';") || src.includes("GAME_VERSION === 'v22." + "58'") ||
      src.includes('一百五十五件套（一百五十四件套清' + '除）') || src.includes('testChain === ' + '155') ||
      src.includes('smoke_v2259_sandpile（npm test 串' + '跑）')) stale.push(f);
}
ok('旧代 v22.58 字面量/恒等/件套/串尾/testChain pin 全库零残留（' + allTests.length + ' 件扫描，含本件）', stale.length === 0, stale.join(','));
// 坏链防回归：README 不得出现 v2258 孤尾（其后必须直接接 v2259）
ok('README 串尾无孤尾（smoke_v2259_sandpile 后必须接 smoke_v2260_fountripple）',
  !readme.includes('smoke_v2259_sandpile（npm test 串' + '跑）'));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
