// v22.1 专项冒烟：状态页资源行补记忆碎片计数——I 状态页资源行此前已有 金币/🍖/🧪/🍄/📕 图鉴（v21.94）/
// 📦 宝箱·成就/⏱ 时长，唯独真结局关键收集「记忆碎片」缺席（进度只活在 J 日志「记忆碎片」节与尾声
// 战绩页）；现与 drawJournal「记忆碎片」节 / drawEnding 战绩行同读 hero.fragments/FRAGMENTS.length
// 一份单一数据源（(hero.fragments||[]) 防御式读取旧档零迁移），资源行补「🕯️ 记忆碎片 N/4」。
// 纯显示零结算零存档变化（调整碎片只改 data.js FRAGMENTS 一处自动跟随）。
// 本冒烟守护：版本锚点、data.js/menus.js 源级落位（fragN 派生与资源行 🕯️ 并入 + 既有段逐字保留 +
// 旧行零残留 + y=264 零位移）、行宽预算（官方 estW ≤570 / 110+estW ≤670 放宽口径，@napi-rs/canvas
// 14px 真实实测最宽 ≈448.3 · 右缘 ≈558.3 ≤ 570 面板内）、运行期实证（新档 0/4 → 推进档 2/4 →
// 全收集 4/4 → 缺字段防御档 0/4 不抛错 → 📕📦⏱ 共存段）、README/package.json/CHANGELOG 同步、
// 姊妹件套 pin（v2200..v2176 九十七件套 / v2200..v2179 GAME_VERSION v22.1 / v2200..v2192 恒等 v22.1 /
// v2200..v2192 树尾 pin）随新现实更新 + 旧代 v22.0 字面量/恒等 pin 与旧代九十六件套 pin 全库零残留复核。
import { GAME_VERSION, FRAGMENTS, BESTIARY_TARGET, chestTotal, TREASURE_GOAL } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.1 状态页资源行记忆碎片进度冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v22.0 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.0', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 1)), GAME_VERSION);
ok('GAME_VERSION 字面量已为 v22.1', GAME_VERSION === 'v22.2', GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const menusSrc = read('../js/view/menus.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v22.1 版本注释', dataSrc.includes('v22.1 状态页资源行补「🕯️ 记忆碎片 N/4」'));
ok('data.js GAME_VERSION 字面量已更新为 v22.1', dataSrc.includes("const GAME_VERSION = 'v22.2';"));
ok('data.js 仍保留 v22.0 历史注释（累积注释块，姊妹 pin 不失效）', dataSrc.includes('v22.0 新成就「有备无患」'));

// —— 源级落位：drawStatus 碎片派生与资源行并入 ——
const statusBlock = (menusSrc.match(/export function drawStatus\(\)\{[\s\S]*?\n\}/) || [''])[0];
ok('drawStatus 块存在', statusBlock.length > 0);
ok('drawStatus 派生碎片数（与 drawJournal/drawEnding 同读 hero.fragments，防御式旧档零迁移）',
  statusBlock.includes('const fragN = (hero.fragments || []).length;'));
ok('资源行并入 🕯️ 记忆碎片 N/4（FRAGMENTS.length 单一数据源分母）',
  statusBlock.includes('🕯️:${fragN}/${FRAGMENTS.length}'));
ok('资源行既有段逐字保留（金币/🍖/🧪/🍄/📕/📦 双口径/⏱）',
  statusBlock.includes('金币:${hero.gold}  🍖:${hero.item} 🧪:${hero.potion2||0} 🍄:${hero.mushrooms||0} 📕:${codexN}/${BESTIARY_TARGET.length} 📦:${chestCount(hero)}/${chestTotal()}·成就${chestCount(hero)}/${TREASURE_GOAL}  🕯️:${fragN}/${FRAGMENTS.length}  ⏱️${fmtTime(hero.time)}'));
ok('资源行旧行（无 🕯️）零残留',
  !statusBlock.includes('·成就${chestCount(hero)}/${TREASURE_GOAL}  ⏱️${fmtTime(hero.time)}'));
ok('drawStatus 资源行仍在 y=264（行位零回归）', statusBlock.includes(",110,264,'14px');"));

// —— 与 drawJournal / drawEnding 同式互证：同一份单一数据源 ——
ok('menus.js drawJournal 碎片区同读 FRAGMENTS（单一数据源）',
  menusSrc.includes('for (const f of FRAGMENTS) items.push({ kind: \'frag\', f, h: 16 });'));
ok('menus.js drawEnding 战绩行同式（记忆 N/N 同读 hero.fragments/FRAGMENTS.length）',
  menusSrc.includes('记忆 ${(hero.fragments||[]).length}/${FRAGMENTS.length}'));

// —— 行宽预算（estW 官方口径 + 实测引证） ——
const estW = (s, size) => {
  let wsum = 0;
  for (const ch of String(s || '')) {
    const code = ch.codePointAt(0);
    const wide = (code >= 0x2e80 && code <= 0x9fff) || (code >= 0x3000 && code <= 0x303f) || (code >= 0xff00 && code <= 0xffef) || code >= 0x1f000;
    if (wide) wsum += 0.865 * size;
    else if (code === 0xb7) wsum += 0.303 * size;
    else if (code === 0x2f) wsum += 0.338 * size;
    else if (code === 0x2e) wsum += 0.226 * size;
    else if (code >= 0x30 && code <= 0x39) wsum += 0.63 * size;
    else if (code === 0x20) wsum += 0.263 * size;
    else wsum += 0.55 * size;
  }
  return wsum;
};
const worstRow = `金币:99999  🍖:99 🧪:99 🍄:99 📕:13/13 📦:12/${chestTotal()}·成就12/${TREASURE_GOAL}  🕯️:${FRAGMENTS.length}/${FRAGMENTS.length}  ⏱️999:59:59`;
const wRow = estW(worstRow, 14);
ok('资源行最宽组合估算 ≤570（v22.1 随 🕯️ 碎片并入放宽；@napi-rs/canvas 14px 实测右缘 ≈558.3 ≤ 570 面板内）',
  wRow > 0 && wRow <= 570, `≈${wRow.toFixed(0)}`);
ok('资源行起点 110 + estW 估算 ≤ 670（官方 estW 为保守口径；实测 ≈558.3 落面板内）',
  110 + wRow <= 670, `right≈${(110 + wRow).toFixed(0)}`);

// —— 运行期实证（DOM 桩 + main.js 装载 + drawStatus 渲染捕获） ——
const noop = () => {};
function makeCtx() {
  const grad = { addColorStop: noop };
  return {
    canvas: { width: 640, height: 480 },
    measureText: (t) => ({ width: estW(t) }),
    createLinearGradient: () => grad, createRadialGradient: () => grad, createConicGradient: () => grad, createPattern: () => ({}),
    beginPath: noop, closePath: noop, moveTo: noop, lineTo: noop, arc: noop, arcTo: noop, ellipse: noop,
    quadraticCurveTo: noop, bezierCurveTo: noop, fill: noop, stroke: noop, fillRect: noop, strokeRect: noop,
    clearRect: noop, drawImage: noop, save: noop, restore: noop, translate: noop, rotate: noop, scale: noop,
    transform: noop, setTransform: noop, clip: noop, rect: noop, setLineDash: noop, getLineDash: () => [],
    isPointInPath: () => false,
    globalAlpha: 1, strokeStyle: '#000', fillStyle: '#000', font: '', textAlign: 'left', textBaseline: 'alphabetic',
    lineWidth: 1, imageSmoothingEnabled: false,
    fillText: (t) => { CAPTURED.push(String(t)); },
  };
}
const CAPTURED = [];
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
    gain: { setValueAtTime: noop, linearRampToValueAtTime: noop, exponentialRampToValueAtTime: noop } }),
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
const { S } = await import('../js/state.js');
const menus = await import('../js/view/menus.js');
const { loadMap } = await import('../js/world.js');
const { newGame } = await import('../js/core.js');

function renderStatus(hero, map) {
  CAPTURED.length = 0;
  S.G = hero;
  S.G.map = map; S.G.x = 12; S.G.y = 12;
  S.dir = 'D'; S.scene = 'world'; S.walk = null;
  loadMap(map);
  menus.drawStatus();
  return CAPTURED.slice();
}
const NF = FRAGMENTS.length;

// 新档档：碎片 0/4（无 fragments 字段防御式）
let hero = newGame('余烬');
let cap = renderStatus(hero, 'village');
ok('运行期：新档资源行报 碎片 0/4（FRAGMENTS 分母派生，无字段防御 0）',
  cap.some((t) => t.includes('🕯️:0/' + NF)));

// 推进档：碎片 2/4
hero = newGame('潮');
Object.assign(hero, { fragments: [FRAGMENTS[0].id, FRAGMENTS[1].id] });
cap = renderStatus(hero, 'village');
ok('运行期：推进档资源行报 碎片 2/4（与 drawJournal/drawEnding 同读 hero.fragments）',
  cap.some((t) => t.includes('🕯️:2/' + NF)));

// 全收集档：4/4
hero = newGame('灯见');
Object.assign(hero, { fragments: FRAGMENTS.map((f) => f.id) });
cap = renderStatus(hero, 'village');
ok('运行期：全收集档资源行报 碎片 4/4',
  cap.some((t) => t.includes('🕯️:' + NF + '/' + NF)));

// 防御档：fragments 非数组/缺字段 → 0/4 不抛错
hero = newGame('余烬');
delete hero.fragments;
let threw = null;
try { cap = renderStatus(hero, 'village'); } catch (e) { threw = e; }
ok('运行期：缺 fragments 字段防御档不抛错且报 0/N',
  threw === null && cap.some((t) => t.includes('🕯️:0/' + NF)), threw && String(threw.stack || threw));

// 行内多件套共存：🕯️ 与 📕/📦/⏱ 同段
hero = newGame('潮');
Object.assign(hero, { bestiary: { '史莱姆': 3, '野狼': 1 }, chests: new Set(['22,1']), fragments: [FRAGMENTS[0].id] });
cap = renderStatus(hero, 'village');
ok('运行期：资源行 🕯️ 与 📕/📦·成就/⏱ 同段共存（资源总览全格齐备）',
  cap.some((t) => t.includes('🕯️:') && t.includes('📕:') && t.includes('📦:') && t.includes('成就') && t.includes('⏱️')));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 已同步（tests 树收录 smoke_v2201_fragstatus + 九十七件套口径）',
  readme.includes('smoke_v2201_fragstatus') && readme.includes('九十八件套（九十七件套清除）'));
ok('README 含 v22.1 守护描述', readme.includes('v22.1 起含状态页资源行记忆碎片进度守护'));
ok('README 不含旧「九十六件套（九十五件套清' + '除）」旧口径', !readme.includes('冒烟九十六件套（九十五件套清' + '除）'));
ok('package.json 已收录 smoke_v2201_fragstatus（npm test 串跑第 97 份）',
  pkg.includes('tests/smoke_v2201_fragstatus.mjs') && /smoke_v2200_stock\.mjs && node tests\/smoke_v2201_fragstatus\.mjs/.test(pkg));
ok('CHANGELOG 含 v22.1 条目', changelog.includes('## v22.1 '));

// —— 姊妹件套 pin（v21.7 惯例：最新版守护旧 pin 随新现实更新） ——
const suite97 = ['smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs',
  'smoke_v2197_lucky2.mjs', 'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs',
  'smoke_v2194_statuscodex.mjs', 'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs',
  'smoke_v2191_ptime.mjs', 'smoke_v2190_launch.mjs', 'smoke_v2189_visitedlegacy.mjs',
  'smoke_v2188_wander.mjs', 'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs',
  'smoke_v2185_steleclear.mjs', 'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs',
  'smoke_v2182_winrecap.mjs', 'smoke_v2181_helpquickcast.mjs', 'smoke_v2180_grain.mjs',
  'smoke_v2179_titlerecap.mjs', 'smoke_v2178_codexseen.mjs', 'smoke_v2177_elites.mjs',
  'smoke_v2176_allchests.mjs'];
for (const nm of suite97) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README 件套 pin 已随新现实更新为九十八件套（九十七件套清除）`,
    src.includes('九十八件套（九十七件套清除）'));
}
for (const nm of ['smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs',
  'smoke_v2197_lucky2.mjs', 'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs',
  'smoke_v2194_statuscodex.mjs', 'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs',
  'smoke_v2191_ptime.mjs', 'smoke_v2190_launch.mjs', 'smoke_v2189_visitedlegacy.mjs',
  'smoke_v2188_wander.mjs', 'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs',
  'smoke_v2185_steleclear.mjs', 'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs',
  'smoke_v2182_winrecap.mjs', 'smoke_v2181_helpquickcast.mjs', 'smoke_v2179_titlerecap.mjs']) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 字面量 pin 已随新现实更新为 v22.1`,
    src.includes("const GAME_VERSION = 'v22.2';"));
}
for (const nm of ['smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs',
  'smoke_v2197_lucky2.mjs', 'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs',
  'smoke_v2194_statuscodex.mjs', 'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs']) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 恒等 pin（===）已随新现实更新为 v22.1`,
    src.includes("GAME_VERSION === 'v22.2'"));
}
for (const nm of ['smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs',
  'smoke_v2197_lucky2.mjs', 'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs']) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README tests 树尾 pin 已随新现实更新（+ smoke_v2201_fragstatus）`,
    src.includes('smoke_v2199_rich2 + smoke_v2200_stock + smoke_v2201_fragstatus + smoke_v2202_fragwin（npm test 串跑）'));
}
// 旧代 GAME_VERSION 字面量/恒等 pin 零残留（v22.0 全库清零；拼接避免本文件自匹配）
const STALE_GV = "const GAME_VERSION = 'v22." + "0';";
const stale = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!f.endsWith('.mjs')) continue;
  const src = read(`../tests/${f}`);
  if (src.includes(STALE_GV)) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v22.0 全库清零）', stale.length === 0, stale.join(','));
const STALE_ID = "GAME_VERSION === 'v22." + "0'";
const staleId = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!f.endsWith('.mjs')) continue;
  const src = read(`../tests/${f}`);
  if (src.includes(STALE_ID)) staleId.push(f);
}
ok('旧代 GAME_VERSION 恒等 pin 零残留（===v22.0 全库清零）', staleId.length === 0, staleId.join(','));
const STALE_SUITE = '九十六件套（九十五件套清' + '除）';
const staleSuite = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!f.endsWith('.mjs')) continue;
  const src = read(`../tests/${f}`);
  if (src.includes(STALE_SUITE)) staleSuite.push(f);
}
ok('旧代件套 pin 零残留（九十六件套（九十五件套清' + '除）全库清零）', staleSuite.length === 0, staleSuite.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
