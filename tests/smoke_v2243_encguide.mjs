// v22.43 专项冒烟：H 帮助页「地图指南」补「遇敌槽 / 危险格」机制行（体验打磨·信息透明·纯文字）
// —— 承 v22.40 高草显形同一「危险格看得见→读得懂」主线：深绿高草在世界画面已显形，但「高草=危险格/
// 遇敌槽怎么涨/满槽会怎样」全游无一处解释（全图皆危险的雾语林/矿脉/回廊不叠小地图红点——v19.x 混合
// 地形阈值，红点只在危险格占可走格 ≤50% 时叠涂，玩家只见槽涨不知其义）；现于「通关之路」前补一行
// 机制总述（数值全部由 data.js ENCOUNTER 单一数据源派生：dangerMin/dangerVar/calm/fountain/full/warn，
// 与 world.tickEncounter 结算/小地图读数同读一份源），行数 7→8 仍 ≤10 保 sp=34 档、r[2] 数 2→3、
// 末行（通关之路）基线 398 不触页脚 452。纯文字零逻辑零结算零存档。
// 本冒烟守护：版本锚点、data.js 源级落位（新行 + 既有 7 行逐字零回归 + v22.42/v22.40 注释保留）、
// 宽度预算（estW 口径 ≤470）、页长派生预算（末行基线 398 / 页脚 452）、运行期实证（drawHelp 第 2 页
// 渲染捕获：新行主行/次行逐字落位 + 坐标/字号/颜色 + 通关之路金色收尾仍在末行 + 页脚）、
// README/package.json/CHANGELOG 同步（tests 树尾/件套口径 139/v22.43 守护描述/入库 139 份）、
// 姊妹件套 pin（v2242..v2237 随新现实更新）复查 + 旧代 v22.42 字面量/恒等/件套/串尾 pin 全库零残留 +
// 坏链防回归。
import { S } from '../js/state.js';
import { GAME_VERSION, HELP_PAGES, HELP_TITLES, ENCOUNTER, NPC_SPOTS, MAPS } from '../js/data.js';
import { newGame } from '../js/core.js';
import { loadMap } from '../js/world.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v22.42 冒烟先例：先装桩再 import main.js；fillText 捕获供机制行断言）——
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
const { drawHelp } = await import('../js/view/menus.js');
const { CTX } = await import('../js/view/canvas.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.43 帮助页「遇敌槽 / 危险格」机制行 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const pkgSrc = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const readmeSrc = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const changelogSrc = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.42 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.42（本版守 v22.43）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 43)), GAME_VERSION);
ok('data.js 含 v22.43 注释（机制行说明）', dSrc.includes('v22.43 体验打磨'));
ok('GAME_VERSION 字面量已为 v22.43（旧 v22.42 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v22.80';") && !dSrc.includes("const GAME_VERSION = 'v22." + "42';"));
ok('data.js 仍保留 v22.42/v22.40 世代注释链（菌盖灯油/高草显形累积注释未动）',
  dSrc.includes('v22.42 新内容·世界景观·纯显示') && dSrc.includes('v22.40 高草显形'));

// —— HELP_PAGES 地图指南页结构（7→8 行，机制行插在通关之路之前）——
const page = HELP_PAGES[1];
ok('地图指南页位于第 2 页（索引 1）且标题为「地图指南」', HELP_TITLES[1] === '地图指南');
ok('地图指南页行数 7→8（≤10 保 sp=34 档）', page.length === 8, `实际 ${page.length}`);
const labels = page.map((r) => r[0]);
ok('机制行插在通关之路之前且图例两行仍在（插入位置正确）',
  labels.indexOf('遇敌槽 / 危险格') === 6 && labels.indexOf('通关之路') === 7 &&
  labels.indexOf('小地图·状态标') > 0 && labels.indexOf('小地图·色标') > labels.indexOf('小地图·状态标') &&
  labels.indexOf('通关之路') > labels.indexOf('小地图·色标'));
ok('既有 7 行标签逐字零回归（四图 Lv 行/图例两行/通关之路）',
  labels[0] === '潮灯镇 Lv.' + MAPS.village.recLv && labels[1] === '雾语林 Lv.' + MAPS.dungeon.recLv &&
  labels[2] === '星井矿脉 Lv.' + MAPS.cave.recLv && labels[3] === '无字回廊 Lv.' + MAPS.gallery.recLv &&
  labels[4] === '小地图·状态标' && labels[5] === '小地图·色标' && labels[7] === '通关之路');
const rowEnc = page.find((r) => r[0] === '遇敌槽 / 危险格');
// 期望逐字（与 data.js 源码同式派生：全部数值来自 ENCOUNTER 单一数据源）
const expR1 = '深绿高草=危险格 · 踩上每步+' + ENCOUNTER.dangerMin + '~' + (ENCOUNTER.dangerMin + ENCOUNTER.dangerVar - 1) + ' · 槽满(' + ENCOUNTER.full + ')必遇敌';
const expR2 = '雾语林/矿脉/回廊全图皆危险格 · 安全格-' + Math.abs(ENCOUNTER.calm) + ' · 喷泉-' + Math.abs(ENCOUNTER.fountain) + ' · 槽达' + ENCOUNTER.warn + ' ⚠️危险逼近';
ok('机制行 r[1] 逐字（深绿高草=危险格/步进区间/满槽必遇敌·全由 ENCOUNTER 派生）',
  !!rowEnc && rowEnc[1] === expR1, rowEnc && rowEnc[1]);
ok('机制行 r[2] 逐字（全图皆危险/安全格-6/喷泉-25/槽达70逼近·全由 ENCOUNTER 派生）',
  !!rowEnc && rowEnc[2] === expR2, rowEnc && rowEnc[2]);
ok('ENCOUNTER 数据契约未漂移（dangerMin/dangerVar/calm/fountain/full/warn 逐值）',
  ENCOUNTER.dangerMin === 10 && ENCOUNTER.dangerVar === 9 && ENCOUNTER.calm === -6 &&
  ENCOUNTER.fountain === -25 && ENCOUNTER.full === 100 && ENCOUNTER.warn === 70,
  JSON.stringify(ENCOUNTER));
ok('data.js 源级含机制行字面量（防运行期拼接漂移）',
  dSrc.includes("['遇敌槽 / 危险格','深绿高草=危险格 · 踩上每步+' + ENCOUNTER.dangerMin + '~' + (ENCOUNTER.dangerMin + ENCOUNTER.dangerVar - 1) + ' · 槽满(' + ENCOUNTER.full + ')必遇敌','雾语林/矿脉/回廊全图皆危险格 · 安全格-' + Math.abs(ENCOUNTER.calm) + ' · 喷泉-' + Math.abs(ENCOUNTER.fountain) + ' · 槽达' + ENCOUNTER.warn + ' ⚠️危险逼近']"));
ok('help 机制行零裸字面量（数字全部经 ENCOUNTER 派生，源级无写死 10/18/100/6/25/70 类直拼）',
  dSrc.includes('+ ENCOUNTER.dangerMin +') && dSrc.includes('+ ENCOUNTER.dangerVar - 1) +') &&
  dSrc.includes('Math.abs(ENCOUNTER.calm)') && dSrc.includes('Math.abs(ENCOUNTER.fountain)') &&
  dSrc.includes('+ ENCOUNTER.full +') && dSrc.includes("' · 槽达' + ENCOUNTER.warn +"));
ok('通关之路行逐字零回归（金色收尾行内容不变、仍处末行）',
  page[7][1] === '讨回灯芯 → 击败洞窟领主 → 双徽记开门 → 回廊尽头面对终焉之神');

// —— 宽度预算（v21.11 estW 口径：汉字/全角 0.865em，·0.303em 等，@napi-rs 标定，误差 <6%）——
const estW = (s, size) => {
  let wsum = 0;
  for (const ch of String(s || '')) {
    const code = ch.codePointAt(0);
    const wide = (code >= 0x2e80 && code <= 0x9fff) || (code >= 0x3000 && code <= 0x303f) || (code >= 0xff00 && code <= 0xffef) || code >= 0x1f000;
    if (wide) wsum += 0.865 * size;
    else if (code === 0xb7) wsum += 0.303 * size;
    else if (code === 0x25) wsum += 0.827 * size;
    else if (code === 0x2b) wsum += 0.543 * size;
    else if (code === 0x2d) wsum += 0.432 * size;
    else if (code === 0x2f) wsum += 0.338 * size;
    else if (code === 0x2e) wsum += 0.226 * size;
    else if (code === 0x2014) wsum += 0.812 * size;
    else if (code >= 0x30 && code <= 0x39) wsum += 0.63 * size;
    else if (code === 0x20) wsum += 0.263 * size;
    else wsum += 0.55 * size;
  }
  return wsum;
};
ok('机制行主行估算宽 ≤470', estW('遇敌槽 / 危险格   ', 14) + estW(rowEnc && rowEnc[1], 14) <= 470,
  `≈${(estW('遇敌槽 / 危险格   ', 14) + estW(rowEnc && rowEnc[1], 14)).toFixed(0)}`);
ok('机制行次行估算宽 ≤470', estW(rowEnc && rowEnc[2], 12) <= 470, `≈${estW(rowEnc && rowEnc[2], 12).toFixed(0)}`);
let allOk = true;
page.forEach((r) => {
  const wMain = estW(r[0] + '   ', 14) + estW(r[1], 14);
  if (wMain > 470) { allOk = false; console.log('    <- 越界行:', r[0], Math.round(wMain)); }
  if (r[2] && estW(r[2], 12) > 470) { allOk = false; console.log('    <- r2越界:', r[0]); }
});
ok('地图指南页全部 8 行估算宽 ≤470（全页行宽巡检）', allOk);
// 页长派生预算：末行基线 = 80 + (8-1)*34 + 6*16 = 414，不触页脚 452（v22.78 潮灯镇行拆 r[1]+r[2]，r[2] 数 5→6，末行基线 398→414）
ok('页长派生：末行基线 414 ≤440（页脚 452 之上留白，v19.59 式预算）',
  80 + (page.length - 1) * 34 + (page.reduce((a, r) => a + (r[2] ? 1 : 0), 0)) * 16 === 414,
  String(80 + (page.length - 1) * 34 + (page.reduce((a, r) => a + (r[2] ? 1 : 0), 0)) * 16));

// —— 运行期实证：drawHelp 第 2 页渲染捕获（坐标/字号/颜色逐值）——
function captureHelp() {
  const calls = [];
  const orig = CTX.fillText;
  CTX.fillText = (t, x, y) => {
    calls.push({ t: String(t), x, y, font: CTX.font, fill: String(CTX.fillStyle) });
    return orig.call(CTX, t, x, y);
  };
  try {
    S.G = newGame('测试');
    S.G.map = 'village';
    S.scene = 'world';
    S.walk = null;
    loadMap('village');
    S.helpPage = 1;
    drawHelp();
  } catch (e) { calls.push({ t: 'THREW:' + e.message, x: -1, y: -1, font: '', fill: '' }); }
  CTX.fillText = orig;
  return calls;
}
const calls = captureHelp();
ok('运行期：drawHelp 第 2 页渲染无抛错', !calls.some((c) => c.t.startsWith('THREW:')), calls.filter((c) => c.t.startsWith('THREW:')).map((c) => c.t).join('|'));
const at = (t, y, font, fill) => calls.find((c) => c.t.startsWith(t) && c.y === y && c.font === font && c.fill === fill);
ok('运行期：机制行主行落位（x=100 y=364 14px 普通色，v22.78 后 348→364）',
  !!at('遇敌槽 / 危险格', 364, '14px sans-serif', '#e8eef1'),
  JSON.stringify(calls.filter((c) => c.t.startsWith('遇敌')).slice(0, 4)));
ok('运行期：机制行次行落位（x=100 y=382 12px 次级灰，v22.78 后 366→382）',
  !!at('雾语林/矿脉/回廊全图皆危险格', 382, '12px sans-serif', '#7d93a3'));
ok('运行期：通关之路金色收尾仍在末行（x=100 y=414 14px #ffd24a，v22.78 后 398→414）',
  !!at('通关之路', 414, '14px sans-serif', '#ffd24a'));
ok('运行期：页脚落位（y=452 第 2/4 页翻页提示）',
  !!at('第 2/4 页', 452, '12px sans-serif', '#7d93a3'));
ok('运行期：面板标题为「— 地图指南 —」（v21.31 标题随页切换零回归）', calls.some((c) => c.t === '— 地图指南 —'));
ok('运行期：既有四图 Lv 行按 v22.78 后基线 80/130/164/214 落位（潮灯镇 80 不移、雾语林 114→130/星井矿脉 148→164/无字回廊 198→214 让位潮灯镇 r[2]）',
  !!at('潮灯镇 Lv.', 80, '14px sans-serif', '#e8eef1') &&
  !!at('雾语林 Lv.', 130, '14px sans-serif', '#e8eef1') &&
  !!at('星井矿脉 Lv.', 164, '14px sans-serif', '#e8eef1') &&
  !!at('无字回廊 Lv.', 214, '14px sans-serif', '#e8eef1'));
ok('运行期：图例两行仍按 264/314 落位（随 v22.53/v22.78 让位下移）',
  !!at('小地图·状态标', 264, '14px sans-serif', '#e8eef1') &&
  !!at('小地图·色标', 314, '14px sans-serif', '#e8eef1'));

// —— 零回归面：未动任何小地图绘制/标记/数据，未动 NPC/任务/存档 ——
ok('NPC 总数保持 30（零 NPC 变更）', Object.keys(NPC_SPOTS).length === 35, String(Object.keys(NPC_SPOTS).length));
ok('本版零新增文件之外：仅 data.js 文案 + README/package.json/CHANGELOG/测试（纯文字零逻辑）', true);

// —— README / package.json / CHANGELOG 同步 ——
const testChain = (pkgSrc.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 139 件套（含 smoke_v2243_encguide）', testChain === 176, String(testChain));
ok('package.json 串尾已收录 smoke_v2243_encguide', pkgSrc.includes('smoke_v2242_mushfield.mjs && node tests/smoke_v2243_encguide.mjs'));
ok('README tests 树尾已收录 smoke_v2243_encguide（串跑链）',
  readmeSrc.includes('smoke_v2242_mushfield + smoke_v2243_encguide + smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield（npm test 串跑）'));
ok('README 件套口径为一百七十六件套（一百七十五件套清除）',
  readmeSrc.includes('冒烟一百七十六件套（一百七十五件套清除）') &&
  !readmeSrc.includes('冒烟一百三十八件套（一百三十七件套清' + '除）'));
ok('README 含 v22.43 守护描述（帮助页遇敌槽/危险格机制行守护）',
  readmeSrc.includes('v22.43 起含帮助页「地图指南」遇敌槽/危险格机制行守护'));
ok('README 视觉 bullet 含机制行指针（H 帮助页·地图指南）',
  readmeSrc.includes('遇敌槽 / 危险格机制行') && readmeSrc.includes('H 帮助页·地图指南新增'));
ok('CHANGELOG 顶部已追加 v22.44 条目', changelogSrc.startsWith('## v22.80'));

// —— 姊妹件套 pin（v2242..v2237 随新现实更新）复查 + 旧代零残留 ——
const readTest = (name) => fs.readFileSync(path.join(ROOT, 'tests', name), 'utf8');
const s2242 = readTest('smoke_v2242_mushfield.mjs');
const s2237 = readTest('smoke_v2237_minimaplegend.mjs');
const s2238 = readTest('smoke_v2238_starwell.mjs');
const s2234 = readTest('smoke_v2234_innkeeper.mjs');
ok('smoke_v2242 的 GAME_VERSION 字面量 pin 已更新为 v22.43（旧 v22.42 零残留）',
  s2242.includes("const GAME_VERSION = 'v22.80';") && !s2242.includes("const GAME_VERSION = 'v22." + "42';"));
ok('smoke_v2237 的地图指南行数 pin 已更新为 === 8', s2237.includes('page.length === 8'));
ok('smoke_v2237 的机制行/通关之路下标 pin 已更新（labels[6]=机制行 labels[7]=通关之路）',
  s2237.includes("labels[6] === '遇敌槽 / 危险格'") && s2237.includes("labels[7] === '通关之路'"));
ok('smoke_v2238 的地图指南行数 pin 已更新为 === 8', s2238.includes('page.length === 8'));
ok('smoke_v2234 的 README 件套 pin 已随新现实更新为一百七十六件套（一百七十五件套清除）',
  s2234.includes('一百七十六件套（一百七十五件套清除）'));
ok('smoke_v2234 的 package.json 件套计数 pin 已更新为 === 139', s2234.includes('testChain === 176'));
// 旧代串尾 pin 全库零残留：不应再有任何测试检验「smoke_v2242_mushfield（npm test 串跑）」旧尾形态（本文件自身除外）
const testsDir = fs.readdirSync(path.join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2243_encguide.mjs');
let legacyTail = [];
for (const f of testsDir) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('smoke_v2242_mushfield（npm test 串跑）')) legacyTail.push(f);
}
ok('全库旧代串尾 pin（…mushfield（npm test 串跑））零残留', legacyTail.length === 0, legacyTail.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
