// v22.41 专项冒烟：无字回廊「名字之门」石拱门（新内容·世界景观·纯显示，承 v22.36 广场大灯/
// v22.38 星井/v22.39 星砂车「名字物补脸」先例的回廊收口）——四图标题物都有脸：潮灯镇有广场大灯、
// 星井矿脉有星井与星砂车，唯独「无字回廊」自己一像素的门都没有（玩家从终焉水晶踏入回廊的瞬间
// playerStart(2,4) 画面与矿脉普通岩地几乎无异）；现于入口内侧主廊 (3,4)（出生点旁一格、出口 (1,4)
// 东侧）立起无字石拱门：状态与守名者 done「名字回灯下」/真结局「记忆回到镇上」同读 S.G.trueBoss
// 一份源两档（dark 无字灰石门零光 / lit 名字亮回金白微光+金晕），与星井/星砂车同族只读旗标。
// 纯显示零结算零存档零数值变化（位置只存 data.js GALLERY_ARCH 一处；(3,4) 为可行走格 at===TY.CAVE
// 零碰撞变化；刻意不设小地图标记——无决策信息，图例零变化）。本冒烟守护：版本锚点、data.js/
// drawWorld.js 源级落位（GALLERY_ARCH 常量 + export + import + galleryArchState 纯函数 + 主循环
// 接入先于角色层 + 既有三地标分支逐字零回归）、运行期实证（gallery 两档渲染捕获逐像素色与坐标 +
// 无抛错 + 契约 at(3,4)===TY.CAVE / 非 SOLID / 坐标非 NPC_SPOTS 键 / extras 无占用 / NPC 总数 30）、
// README/package.json/CHANGELOG 同步（tests 树尾/件套 137/v22.41 守护描述/入库 137 份/地图行/
// 视觉 bullet）、姊妹件套 pin（v2240..v2226 随新现实更新，含 v2228/v2229 正则锚与 v2228/v2230
// 双转义锚）复查 + 旧代 v22.40 字面量/恒等/件套/串尾 pin 全库零残留 + 坏链防回归。
import { S } from '../js/state.js';
import { GAME_VERSION, NPC_SPOTS, TY, SOLID, MAPS, VILLAGE_LAMP, CAVE_WELL, CAVE_CART, GALLERY_ARCH } from '../js/data.js';
import { newGame } from '../js/core.js';
import { loadMap, at } from '../js/world.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— DOM 桩（承 v21.30-v22.40 冒烟先例：先装桩再 import main.js；fillRect/arc 捕获供拱门断言）——
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
const { drawWorld, cam, galleryArchState, caveCartState, caveWellState } = await import('../js/view/drawWorld.js');
const { CTX } = await import('../js/view/canvas.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.41 无字回廊名字之门地标 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const wSrc = fs.readFileSync(path.join(ROOT, 'js/view/drawWorld.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.40 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.40', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 41)), GAME_VERSION);
ok('data.js 含 v22.41 注释（名字之门说明）', dSrc.includes('v22.41 无字回廊「名字之门」'));
ok('GAME_VERSION 字面量已为 v22.41（旧 v22.40 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v22.46';") && !dSrc.includes("const GAME_VERSION = 'v22." + "40';"));
ok('data.js 仍保留 v22.40 世代注释链（高草/大灯/星井/星砂车累积注释未动）',
  dSrc.includes('v22.40 ') || wSrc.includes('v22.40 高草显形'));

// —— data.js 源级落位：GALLERY_ARCH 单一数据源 ——
ok('GALLERY_ARCH 位于入口内侧主廊 (3,4)', GALLERY_ARCH && GALLERY_ARCH.x === 3 && GALLERY_ARCH.y === 4,
  JSON.stringify(GALLERY_ARCH));
ok('data.js 导出块含 GALLERY_ARCH（可被 drawWorld 与冒烟共享）', /GALLERY_ARCH,/.test(dSrc) && dSrc.includes('GALLERY_ARCH'));
ok('data.js 含 v22.41 名字之门注释（台词同源口径：名字回灯下）',
  dSrc.includes('被遗忘之地的入口') && dSrc.includes('名字回灯下'));
ok('CAVE_CART 未动（(19,10) 仍为单一数据源）', CAVE_CART && CAVE_CART.x === 19 && CAVE_CART.y === 10);
ok('CAVE_WELL 未动（(16,11) 仍为单一数据源）', CAVE_WELL && CAVE_WELL.x === 16 && CAVE_WELL.y === 11);
ok('VILLAGE_LAMP 未动（(14,9) 仍为单一数据源）', VILLAGE_LAMP && VILLAGE_LAMP.x === 14 && VILLAGE_LAMP.y === 9);

// —— drawWorld.js 源级落位：galleryArchState + drawGalleryArch + 主循环接入 ——
ok('drawWorld.js 含 v22.41 注释（名字之门说明）', wSrc.includes('v22.41 无字回廊「名字之门」'));
ok('drawWorld.js import GALLERY_ARCH（data.js 单一数据源）', wSrc.includes('GALLERY_ARCH'));
ok('drawWorld.js 导出 galleryArchState 纯函数（两档状态单一数据源）', wSrc.includes('export function galleryArchState'));
ok('galleryArchState 档位读 trueBoss（名字亮回档优先）', wSrc.includes("if (hero && hero.trueBoss) return 'lit';"));
ok('galleryArchState 缺省无字档（dark）', wSrc.includes("return 'dark';"));
ok('drawWorld 主循环接入 drawGalleryArch（gallery 专属，位于 drawCaveCart 之后）',
  wSrc.includes("curMap() === 'gallery') drawGalleryArch(c.x, c.y);") &&
  wSrc.indexOf('drawGalleryArch(c.x, c.y)') > wSrc.indexOf('drawCaveCart(c.x, c.y)'));
ok('名字之门绘制先于角色层（在 actors 深度排序之前）',
  wSrc.indexOf('drawGalleryArch(c.x, c.y)') > 0 && wSrc.indexOf('const actors = []') > wSrc.indexOf('drawGalleryArch(c.x, c.y)'));
ok('亮回档门内金白微光 #ffe9a8（与 v22.36 大灯全亮档同色族）',
  wSrc.includes("CTX.fillStyle = '#ffe9a8';") && wSrc.includes('CTX.fillRect(px + 11, py + 12, 10, 10);'));
ok('亮回档浮光三粒 #ffd24a（与未开宝箱引导/大灯同金族）',
  wSrc.includes("CTX.fillStyle = '#ffd24a';") && wSrc.includes('CTX.fillRect(px + 19, py + 13, 2, 2);'));
ok('亮回档金晕 rgba(255,210,74,.15)（与星井 .22 同族减半档）',
  wSrc.includes("'rgba(255,210,74,.15)'"));
ok('无字档门内暗孔 #2e333c（暗铁/洞窟岩壁同色族）',
  wSrc.includes("CTX.fillStyle = '#2e333c';") && wSrc.includes('CTX.fillRect(px + 9, py + 12, 14, 16);'));
ok('石拱门共体两色齐备（#3a4148 门柱 + #5a6472 门楣，与洞窟岩壁/星井暗水同色族）',
  wSrc.includes("CTX.fillStyle = '#3a4148';") && wSrc.includes("CTX.fillStyle = '#5a6472';") &&
  wSrc.includes('CTX.fillRect(px + 2, py + 6, 6, 22);') && wSrc.includes('CTX.fillRect(px + 24, py + 6, 6, 22);') &&
  wSrc.includes('CTX.fillRect(px, py + 4, 32, 6);'));
ok('刻意不设小地图标记（静态纯装饰物无决策信息，minimapColor 无 GALLERY_ARCH 分支）',
  !wSrc.includes('x === GALLERY_ARCH.x') && wSrc.includes('&& x === CAVE_WELL.x && y === CAVE_WELL.y'));
ok('既有星井分支逐字零回归（minimapColor 星井色仍为 #9adcff/#5a6472 双档）',
  wSrc.includes("return (hero && hero.trueBoss) ? '#5a6472' : '#9adcff';"));
ok('既有星砂车分支逐字零回归（caveCartState 两档/木材铁轮色板仍在）',
  wSrc.includes("if (hero && hero.trueBoss) return 'empty';") && wSrc.includes("CTX.fillStyle = '#9adcff';"));
ok('既有大灯分支逐字零回归（villageLampState 三档仍在）',
  wSrc.includes("if (hero && hero.trueBoss) return 'full';") && wSrc.includes("if (hero && hero.bossDefeated) return 'rekindled';"));
ok('既有高草分支逐字零回归（isTallGrass 分流/草簇色板仍在）',
  wSrc.includes('if (isTallGrass(x, y)) {') && wSrc.includes("CTX.fillStyle = '#245a24';"));

// —— 纯函数运行期实证：galleryArchState 四档（与星井/星砂车/大灯同族只读旗标）——
ok('纯函数：新档（无旗标）→ dark（无字，门内零光）', galleryArchState({}) === 'dark');
ok('纯函数：bossDefeated 但未 trueBoss → dark（名字还没回灯下）', galleryArchState({ bossDefeated: true }) === 'dark');
ok('纯函数：trueBoss → lit（名字亮回门内）', galleryArchState({ trueBoss: true }) === 'lit');
ok('纯函数：null 防御 → dark', galleryArchState(null) === 'dark');
ok('纯函数：caveCartState 仍四档零回归（{}/bossDefeated→loaded、trueBoss→empty、null→loaded）',
  caveCartState({}) === 'loaded' && caveCartState({ bossDefeated: true }) === 'loaded' &&
  caveCartState({ trueBoss: true }) === 'empty' && caveCartState(null) === 'loaded');
ok('纯函数：caveWellState 仍四档零回归（{}/bossDefeated→hum、trueBoss→silent、null→hum）',
  caveWellState({}) === 'hum' && caveWellState({ bossDefeated: true }) === 'hum' &&
  caveWellState({ trueBoss: true }) === 'silent' && caveWellState(null) === 'hum');

// —— 运行期实证：gallery 两档渲染捕获（门内光/金晕/浮光/暗孔/石门逐像素色）——
function captureGallery(flags) {
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
    Object.assign(S.G, flags);
    S.G.map = 'gallery';
    S.G.x = GALLERY_ARCH.x + 3; S.G.y = GALLERY_ARCH.y;
    S.dir = 'L';
    S.scene = 'world';
    S.walk = null;
    loadMap('gallery');
    drawWorld();
  } catch (e) { rects.push({ fs: 'THREW:' + e.message, x: -1, y: -1, w: 0, h: 0 }); }
  CTX.fillRect = origFR;
  CTX.arc = origArc;
  const c = cam();
  const px = GALLERY_ARCH.x * 32 - c.x;
  const py = GALLERY_ARCH.y * 32 - c.y;
  const inTile = (r) => r.x >= px - 1 && r.x < px + 33 && r.y >= py - 1 && r.y < py + 33;
  const has = (fs, x, y, w, h) => rects.some((r) => r.fs === fs && r.x === x && r.y === y && r.w === w && r.h === h);
  return { rects, arcs, px, py, inTile, has, cam: c };
}
const capD = captureGallery({});
const capL = captureGallery({ trueBoss: true });
ok('运行期：dark 档无抛错（drawWorld 全链路）', !capD.rects.some((r) => r.fs.startsWith('THREW:')),
  JSON.stringify(capD.rects.filter((r) => r.fs.startsWith('THREW:'))));
ok('运行期：lit 档无抛错（drawWorld 全链路）', !capL.rects.some((r) => r.fs.startsWith('THREW:')),
  JSON.stringify(capL.rects.filter((r) => r.fs.startsWith('THREW:'))));
ok('运行期：dark 档石门柱/门楣落位（#3a4148 双柱 6×22 + #5a6472 门楣 32×6）',
  capD.has('#3a4148', capD.px + 2, capD.py + 6, 6, 22) && capD.has('#3a4148', capD.px + 24, capD.py + 6, 6, 22) &&
  capD.has('#5a6472', capD.px, capD.py + 4, 32, 6));
ok('运行期：dark 档门内暗孔 #2e333c（无字零光）',
  capD.has('#2e333c', capD.px + 9, capD.py + 12, 14, 16));
ok('运行期：dark 档零金白微光零浮光零金晕（无字档刻意无光）',
  !capD.rects.some((r) => r.fs === '#ffe9a8' && capD.inTile(r)) &&
  !capD.rects.some((r) => r.fs === '#ffd24a' && capD.inTile(r)) &&
  !capD.arcs.some((a) => a.fs === 'rgba(255,210,74,.15)'));
ok('运行期：lit 档石门共体仍在（门柱/门楣与 dark 同色零状态分支）',
  capL.has('#3a4148', capL.px + 2, capL.py + 6, 6, 22) && capL.has('#5a6472', capL.px, capL.py + 4, 32, 6));
ok('运行期：lit 档门内金白微光 #ffe9a8（10×10 落位）',
  capL.has('#ffe9a8', capL.px + 11, capL.py + 12, 10, 10));
ok('运行期：lit 档浮光三粒 #ffd24a（2×2）',
  capL.rects.filter((r) => r.w === 2 && r.h === 2 && r.fs === '#ffd24a' && capL.inTile(r)).length === 3,
  String(capL.rects.filter((r) => r.fs === '#ffd24a' && capL.inTile(r)).length));
ok('运行期：lit 档金晕 arc r=12 rgba(255,210,74,.15)', !!capL.arcs.find((a) => a.r === 12 && a.fs === 'rgba(255,210,74,.15)'),
  JSON.stringify(capL.arcs.filter((a) => a.fs.includes('255,210,74'))));
ok('运行期：lit 档暗孔被微光取代（无 #2e333c 门内孔）',
  !capL.has('#2e333c', capL.px + 9, capL.py + 12, 14, 16));

// —— 契约：零碰撞 / 零 NPC 变更 / 坐标防撞 ——
loadMap('gallery');
ok('契约：at(3,4) === TY.CAVE（replaceTiles 后为可行走岩地，零碰撞变化）', at(3, 4) === TY.CAVE, String(at(3, 4)));
ok('契约：TY.CAVE 非 SOLID（拱门格可走）', !SOLID.has(TY.CAVE));
ok('契约：(3,4) 非 NPC_SPOTS 键（全局坐标防撞，井巫 (2,4) 为既有键不受影响）',
  !Object.prototype.hasOwnProperty.call(NPC_SPOTS, '3,4') && Object.prototype.hasOwnProperty.call(NPC_SPOTS, '2,4'));
ok('契约：(3,4) 非任何图 extras 坐标（全图扫描零占用）',
  !Object.entries(MAPS).some(([, def]) => (def.extras || []).some((e) => e.x === 3 && e.y === 4)));
ok('契约：(1,4) 出口格未被拱门覆盖（EXIT 仍为出口瓦片）', at(1, 4) === TY.EXIT, String(at(1, 4)));
ok('契约：NPC 总数保持 30（零 NPC 变更，v22.40 pin 续守）', Object.keys(NPC_SPOTS).length === 31,
  String(Object.keys(NPC_SPOTS).length));
ok('契约：gallery 既有地标零回归（石碑 STELE/祭坛 SB/精英 MB 仍在）',
  at(5, 1) === TY.STELE && at(21, 4) === TY.SB && at(12, 4) === TY.MB,
  String(at(5, 1)) + '/' + String(at(21, 4)) + '/' + String(at(12, 4)));

// —— README / package.json / CHANGELOG 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树收录 smoke_v2241_gatearch 且位于串尾', readme.includes('smoke_v2240_tallgrass + smoke_v2241_gatearch + smoke_v2242_mushfield + smoke_v2243_encguide + smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge（npm test 串跑）'));
ok('README 件套口径为一百四十二件套（一百四十一件套清除）',
  readme.includes('冒烟一百四十二件套（一百四十一件套清除）') && !readme.includes('冒烟一百三十六件套（一百三十五件套清' + '除）'));
ok('README 含 v22.41 守护描述（无字回廊名字之门地标守护）', readme.includes('v22.41 起含无字回廊名字之门地标守护'));
ok('README 含 smoke_v2241_gatearch 入库（137 份）', readme.includes('smoke_v2241_gatearch 入库（137 份）'));
ok('README 仍保留 v22.40 守护描述与入库（136 份）（历史口径不漂移）',
  readme.includes('v22.40 起含高草危险格显形守护') && readme.includes('smoke_v2240_tallgrass 入库（136 份）'));
ok('README 无字回廊地图行含名字之门口径（v22.41）', readme.includes('v22.41 起世界画面可见：') && readme.includes('石拱门'));
ok('README 视觉 bullet 含名字之门地标（v22.41）', readme.includes('名字之门地标**（v22.41'));
ok('package.json 已收录 smoke_v2241_gatearch（npm test 串跑第 137 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2241_gatearch.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 138 件套', testChain === 142, String(testChain));
ok('CHANGELOG 含 v22.41 条目', changelog.includes('## v22.41 '));

// —— 姊妹 pin 复查（v2240..v2226 随新现实更新，含 v2228/v2229 正则锚与 v2228/v2230 双转义锚）——
const s2240 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2240_tallgrass.mjs'), 'utf8');
const s2239 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2239_minercart.mjs'), 'utf8');
const s2238 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2238_starwell.mjs'), 'utf8');
const s2235 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2235_minimapquest.mjs'), 'utf8');
const s2234 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2234_innkeeper.mjs'), 'utf8');
const s2230 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2230_pausewarn.mjs'), 'utf8');
const s2229 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2229_metall.mjs'), 'utf8');
const s2228 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2228_titlesave.mjs'), 'utf8');
const s2226 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2226_chestprogress.mjs'), 'utf8');
ok('smoke_v2240 的 GAME_VERSION 字面量 pin 已更新为 v22.42', s2240.includes("const GAME_VERSION = 'v22.46';"));
ok('smoke_v2240 的 GAME_VERSION 恒等 pin 已更新为 === v22.42', s2240.includes("GAME_VERSION === 'v22.46'"));
ok('smoke_v2240 的 README 串尾 pin 已更新为 + smoke_v2241_gatearch',
  s2240.includes('smoke_v2240_tallgrass + smoke_v2241_gatearch + smoke_v2242_mushfield + smoke_v2243_encguide + smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge（npm test 串跑）'));
ok('smoke_v2240 的 package.json 件套计数 pin 已更新为 === 138', s2240.includes('testChain === 142'));
ok('smoke_v2240 的 README 件套口径 pin 已更新为一百三十七件套', s2240.includes('冒烟一百四十二件套（一百四十一件套清除）'));
ok('smoke_v2239 的 GAME_VERSION 字面量 pin 已更新为 v22.42', s2239.includes("const GAME_VERSION = 'v22.46';"));
ok('smoke_v2239 的 README 串尾 pin 已更新为 + smoke_v2241_gatearch（NPC 总数/件套 pin 随新现实）',
  s2239.includes('smoke_v2240_tallgrass + smoke_v2241_gatearch + smoke_v2242_mushfield + smoke_v2243_encguide + smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge（npm test 串跑）') && s2239.includes('testChain === 142'));
ok('smoke_v2238 的 GAME_VERSION 字面量 pin 已更新为 v22.42', s2238.includes("const GAME_VERSION = 'v22.46';"));
ok('smoke_v2235 的 GAME_VERSION 字面量 pin 已更新为 v22.42', s2235.includes("const GAME_VERSION = 'v22.46';"));
ok('smoke_v2235 的 NPC 总数 pin 保持 30（零 NPC 变更）', s2235.includes('NPC_SPOTS).length === 31'));
ok('smoke_v2234 的 GAME_VERSION 恒等 pin 已更新为 === v22.42', s2234.includes("GAME_VERSION === 'v22.46'"));
ok('smoke_v2230 的 GAME_VERSION 恒等 pin 已更新为 === v22.42', s2230.includes("GAME_VERSION === 'v22.46'"));
// 串尾锚延伸（任意转义风格：plain `/` / regex `\/` / 双转义 `\\/`）
const archChain = (s) => /smoke_v2240_tallgrass[.\\]{0,3}mjs\s*&&\s*node tests[\\/]{0,3}smoke_v2241_gatearch[.\\]{0,3}mjs/.test(s);
ok('smoke_v2226/v2228/v2229/v2230/v2239/v2240 的串尾锚已延伸至 smoke_v2241_gatearch（plain/regex/双转义三风格）',
  archChain(s2226) && archChain(s2228) && archChain(s2229) && archChain(s2230) && archChain(s2239) && archChain(s2240));
ok('smoke_v2226 的 plain 串尾锚逐字（node tests/smoke_v2240_tallgrass.mjs && node tests/smoke_v2241_gatearch.mjs && node tests/smoke_v2242_mushfield.mjs && node tests/smoke_v2243_encguide.mjs && node tests/smoke_v2244_fulldanger.mjs && node tests/smoke_v2245_watcher.mjs && node tests/smoke_v2246_fountgauge.mjs"）',
  s2226.includes('node tests/smoke_v2240_tallgrass.mjs && node tests/smoke_v2241_gatearch.mjs && node tests/smoke_v2242_mushfield.mjs && node tests/smoke_v2243_encguide.mjs && node tests/smoke_v2244_fulldanger.mjs && node tests/smoke_v2245_watcher.mjs && node tests/smoke_v2246_fountgauge.mjs"'));
ok('smoke_v2228 的 GAME_VERSION 字面量 pin 已更新为 v22.41 且旧代零残留复查仍在（v22.27 风格）',
  s2228.includes("const GAME_VERSION = 'v22.46';") && s2228.includes("'v22.") && s2228.includes("27';"));

// 旧代 v22.40 pin 全库零残留（字面量/恒等/件套/串尾/第 136 份）
const allTests = fs.readdirSync(path.join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs'));
const stale = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "40';") || src.includes("GAME_VERSION === 'v22." + "40'") ||
      src.includes('一百三十六件套（一百三十五件套清' + '除）') || src.includes('testChain === ' + '136')) stale.push(f);
}
ok('旧代 v22.40 字面量/恒等/件套/串尾 pin 全库零残留（' + allTests.length + ' 件扫描，含本件）', stale.length === 0, stale.join(','));
// 坏链防回归：不得出现 smoke_v2239_minercart 直接接 smoke_v2240_tallgrass 再断链/被吞并的形式
let brokenTail = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('smoke_v2239_minercart + smoke_v2240_tallgrass（npm test ' + '串跑）')) brokenTail.push(f);
}
if (readme.includes('smoke_v2239_minercart + smoke_v2240_tallgrass（npm test ' + '串跑）')) brokenTail.push('README.md');
ok('坏链 pin 零残留（v2240_tallgrass 被吞并链全库清零）', brokenTail.length === 0, brokenTail.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
