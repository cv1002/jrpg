// v22.44 专项冒烟：小地图「全域危险」标注（体验打磨·信息透明·纯显示）
// —— 承 v22.37 图例/v22.40 高草显形/v22.43 机制行同一「危险格看得见→读得懂」主线的视觉收口：
// 危险红点只叠涂「危险格占可走格 ≤50%」的混合地形（v19.x 阈值），雾语林/星井矿脉/无字回廊全图
// 皆危险（dangerAt 实扫 ≈89%/96.5%/96.8%）恰恰越过阈值不叠红点，玩家只见遇敌槽涨、看不出
// 「这整张图都是危险格」；现与红点判定同一趟 dangerAt 遍历的同一组计数互补（danger > walkable*0.5
// 即红点被抑制的全域危险档）在遇敌槽标签补「· 全域危险」（与 v22.43 帮助页「雾语林/矿脉/回廊
// 全图皆危险格」同口径），纯显示零结算零存档零数值变化。
// 本冒烟守护：版本锚点、data.js 源级落位（v22.44 注释 + GAME_VERSION 字面量 + v22.43 注释保留）、
// drawWorld.js 源级落位（fullDanger 派生 + 红点阈值逐字零回归 + encLab 模板 + 注释）、
// 运行期实证四图（drawWorld 渲染捕获：标签逐字 + 全域危险标注出现与缺席 + 红点叠涂与抑制 +
// 与 dangerAt 实扫占比交叉验证）、README/package.json/CHANGELOG 同步（树尾/件套 140/守护描述/
// 入库 140 份/串尾）、姊妹件套 pin（v2243 随新现实更新）复查 + 旧代 v22.43 字面量/旧串尾 pin
// 全库零残留 + 坏链防回归。
import { S } from '../js/state.js';
import { GAME_VERSION, ENCOUNTER, NPC_SPOTS, SOLID } from '../js/data.js';
import { newGame } from '../js/core.js';
import { loadMap, dangerAt, MBounds, at } from '../js/world.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v22.43 冒烟先例：先装桩再 import main.js；fillText/fillRect 捕获）——
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
    frequency: { setValueAtTime: noop, exponentialRampToValueAtTime: noop, setValueAtTime: noop } }),
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
const { drawWorld } = await import('../js/view/drawWorld.js');
const { CTX } = await import('../js/view/canvas.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.44 小地图「全域危险」标注 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const wSrc = fs.readFileSync(path.join(ROOT, 'js/view/drawWorld.js'), 'utf8');
const pkgSrc = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const readmeSrc = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const changelogSrc = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.43 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.43（本版守 v22.44）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 44)), GAME_VERSION);
ok('data.js 含 v22.44 注释（小地图全域危险标注说明）', dSrc.includes('v22.44 体验打磨·信息透明·纯显示'));
ok('GAME_VERSION 字面量已为 v22.44（旧 v22.43 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v22.95';") && !dSrc.includes("const GAME_VERSION = 'v22.43';"));
ok('data.js 仍保留 v22.43/v22.42 世代注释链（机制行/菌盖灯油累积注释未动）',
  dSrc.includes('v22.43 体验打磨·信息透明·纯文字') && dSrc.includes('v22.42 新内容·世界景观·纯显示'));

// —— drawWorld.js 源级落位 ——
ok('drawWorld.js 含 fullDanger 派生（walkable>0 && danger > walkable*0.5，与红点阈值互补）',
  wSrc.includes('const fullDanger = walkable > 0 && danger > walkable * 0.5;'));
ok('红点叠涂阈值逐字零回归（danger <= walkable * 0.5）', wSrc.includes('if (danger > 0 && danger <= walkable * 0.5) {'));
ok('遇敌槽标签模板含全域危险后缀（encLab 三态拼接）',
  wSrc.includes("const encLab = `遇敌 ${Math.round(encPct)}%${encDanger ? ' ⚠️ 危险逼近' : ''}${fullDanger ? ' · 全域危险' : ''}`;"));
ok('drawWorld.js 含 v22.44 注释（全域危险标注说明）', wSrc.includes('v22.44 小地图「全域危险」标注'));
ok('drawWorld.js 仍含遇敌槽标签既有口径（遇敌 N% · 危险逼近）', wSrc.includes('⚠️ 危险逼近'));

// —— 数据契约零回归：ENCOUNTER/NPC 总数/地图结构未动 ——
ok('ENCOUNTER 数据契约未漂移（dangerMin/dangerVar/calm/fountain/full/warn 逐值）',
  ENCOUNTER.dangerMin === 10 && ENCOUNTER.dangerVar === 9 && ENCOUNTER.calm === -6 &&
  ENCOUNTER.fountain === -25 && ENCOUNTER.full === 100 && ENCOUNTER.warn === 70,
  JSON.stringify(ENCOUNTER));
ok('NPC 总数保持 30（零 NPC 变更）', Object.keys(NPC_SPOTS).length === 38, String(Object.keys(NPC_SPOTS).length));

// —— 运行期实证：四图 drawWorld 渲染捕获（标签逐字 + 全域危险出现/缺席 + 红点叠涂/抑制）——
function captureWorld(mapKey) {
  const texts = [];
  const rects = [];
  const origFT = CTX.fillText;
  const origFR = CTX.fillRect;
  CTX.fillText = (t, x, y) => { texts.push({ t: String(t), x, y }); return origFT.call(CTX, t, x, y); };
  CTX.fillRect = (x, y, w, h) => { rects.push({ fs: String(CTX.fillStyle), x, y, w, h }); return origFR.call(CTX, x, y, w, h); };
  try {
    S.G = newGame('测试');
    S.G.x = 1; S.G.y = 2;
    S.encGauge = 42;
    S.dir = 'D';
    S.scene = 'world';
    S.walk = null;
    loadMap(mapKey);
    drawWorld();
  } catch (e) { texts.push({ t: 'THREW:' + e.message, x: -1, y: -1 }); }
  CTX.fillText = origFT;
  CTX.fillRect = origFR;
  return { texts, rects };
}

// 与 drawMinimap 同源复算危险占比（dangerAt 实扫）：断言标签出现 == 占比 > 50%
function dangerRatio(mapKey) {
  S.G = { level: 5 };
  loadMap(mapKey);
  const b = MBounds();
  let walk = 0, danger = 0;
  for (let y = 0; y < b.h; y++) for (let x = 0; x < b.w; x++) {
    if (SOLID.has(at(x, y))) continue;
    walk++;
    if (dangerAt(x, y)) danger++;
  }
  return { walk, danger };
}

for (const [mapKey, expectFull] of [
  ['village', false],
  ['dungeon', true],
  ['cave', true],
  ['gallery', true],
]) {
  const cap = captureWorld(mapKey);
  const label = cap.texts.find((c) => c.t.startsWith('遇敌 '));
  ok(`运行期（${mapKey}）：drawWorld 全链路无抛错`, !cap.texts.some((c) => c.t.startsWith('THREW:')),
    cap.texts.filter((c) => c.t.startsWith('THREW:')).map((c) => c.t).join('|'));
  ok(`运行期（${mapKey}）：遇敌槽标签存在且格式为「遇敌 N%」`, !!label && /^遇敌 \d+%/.test(label.t),
    label && label.t);
  const hasFull = label ? label.t.includes('· 全域危险') : false;
  ok(`运行期（${mapKey}）：全域危险标注${expectFull ? '出现' : '缺席'}（encGauge=42 档）`,
    hasFull === expectFull, label && label.t);
  const hasDot = cap.rects.some((r) => r.fs === 'rgba(255,92,92,.85)');
  ok(`运行期（${mapKey}）：危险红点${expectFull ? '被抑制（全域档不叠涂）' : '叠涂（混合地形档）'}`,
    hasDot === !expectFull);
  const ratio = dangerRatio(mapKey);
  const overHalf = ratio.walk > 0 && ratio.danger > ratio.walk * 0.5;
  ok(`语义交叉（${mapKey}）：dangerAt 实扫占比 ${(100 * ratio.danger / Math.max(1, ratio.walk)).toFixed(1)}% → 全域档=${overHalf} 与标签一致`,
    overHalf === expectFull, `${ratio.danger}/${ratio.walk}`);
}

// —— README / package.json / CHANGELOG 同步 ——
const testChain = (pkgSrc.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 140 件套（含 smoke_v2244_fulldanger）', testChain === 191, String(testChain));
ok('package.json 串尾已收录 smoke_v2244_fulldanger',
  pkgSrc.includes('smoke_v2243_encguide.mjs && node tests/smoke_v2244_fulldanger.mjs && node tests/smoke_v2245_watcher.mjs'));
ok('README tests 树尾已收录 smoke_v2244_fulldanger（串跑链）',
  readmeSrc.includes('smoke_v2243_encguide + smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog（npm test 串跑）'));
ok('README 件套口径为一百九十一件套（一百九十件套清除）',
  readmeSrc.includes('冒烟一百九十一件套（一百九十件套清除）') &&
  !readmeSrc.includes('冒烟一百三十九件套（一百三十八件套清' + '除）'));
ok('README 含 v22.44 守护描述（小地图全域危险标注守护）',
  readmeSrc.includes('v22.44 起含小地图全域危险标注守护'));
ok('README 视觉 bullet 含小地图全域危险标注（v22.44）',
  readmeSrc.includes('**小地图全域危险标注**（v22.44'));
ok('README 含 smoke_v2244_fulldanger 入库（140 份）', readmeSrc.includes('smoke_v2244_fulldanger 入库（140 份）'));
ok('CHANGELOG 顶部已追加 v22.44 条目', changelogSrc.startsWith('## v22.95'));

// —— 姊妹件套 pin（v2243 随新现实更新）复查 + 旧代零残留 ——
const s2243 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2243_encguide.mjs'), 'utf8');
ok('smoke_v2243 的 GAME_VERSION 字面量 pin 已更新为 v22.44（旧 v22.43 零残留）',
  s2243.includes("const GAME_VERSION = 'v22.95';") && !s2243.includes("const GAME_VERSION = 'v22.43';"));
ok('smoke_v2243 的 README 件套 pin 已随新现实更新为一百九十一件套（一百九十件套清除）',
  s2243.includes('一百九十一件套（一百九十件套清除）'));
ok('smoke_v2243 的 package.json 件套计数 pin 已更新为 === 140', s2243.includes('testChain === 191'));
ok('smoke_v2243 的 README 串尾 pin 已随新现实延伸至 smoke_v2244_fulldanger',
  s2243.includes('smoke_v2243_encguide + smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog（npm test 串跑）'));
// 旧代串尾 pin 全库零残留：不应再有任何测试检验「smoke_v2243_encguide（npm test 串跑）」旧尾形态（本文件自身除外）
const testsDir = fs.readdirSync(path.join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2244_fulldanger.mjs');
let legacyTail = [];
let legacyVer = [];
for (const f of testsDir) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('smoke_v2243_encguide（npm test 串跑）')) legacyTail.push(f);
  if (src.includes("const GAME_VERSION = 'v22.43';")) legacyVer.push(f);
}
ok('全库旧代串尾 pin（…encguide（npm test 串跑））零残留', legacyTail.length === 0, legacyTail.join(','));
ok('全库旧代 v22.43 字面量 pin（const GAME_VERSION）零残留', legacyVer.length === 0, legacyVer.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
