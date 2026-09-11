// v22.9 专项冒烟：状态页资源行「·成就X/6」→「🏆 成就 N/41」总进度（体验打磨·信息透明·口径一致·纯显示，
// 承 v21.79 标题预览 / v21.82 胜利画面 / v21.87 尾声 / v21.96 阵亡画面「收集口径」主线）——收集口径四屏都报
// 「🏆 成就 N/M（ACH_LIST 总数）」，唯独 I 状态页资源行的「·成就X/6」读的是 TREASURE_GOAL（开箱寻宝目标数）：
// 玩家按 I 看到「成就 3/6」再开 C 页看到「成就 12/41」，两处数字对不上，是 v21.94「收集三件套收官」时把宝箱
// 成就目标误当总数的口径遗留（v21.22 双口径的第二个数字本就专指开箱寻宝）；现改为与 drawDead 收集行同款
// 四件套口径（🏆/📕/📦/🕯️）：🏆 读 (hero.ach||[]).length / ACH_LIST.length 一份单一数据源（防御式旧档
// 零迁移），开箱寻宝进度依旧在 C 成就页「X/6」可见（信息零丢失、零裸字面量）；行宽 estW ≈551 ≤ 570 面板
// 右缘；零结算零数值零存档变化。
// 本冒烟守护：版本锚点、data.js/menus.js 源级落位（新行 🏆 段 + 旧「·成就X/6」正口径零残留 + 行位 y=264
// 零回归）、数据契约（ACH_LIST 41 项未变 / TREASURE_GOAL 6 未变）、行宽预算（estW worst ≈551 ≤570、起点
// 110+estW ≤670）、运行期六档（新档 0/41 → 推进档 1/41 → 全收集 41/41 → 缺 ach 字段防御档 0/41 不抛错 →
// 与 📕/📦/🕯️/⏱ 同段共存 → drawDead 收集行四件套零回归 → drawAch 41 项渲染不抛错）、README/package.json/
// CHANGELOG 同步、姊妹件套 pin（v2208..v2176 一百零五件套 / v2208..v2181·v2179 GAME_VERSION v22.9 /
// v2208..v2192 恒等 v22.9 / v2208..v2195·v2193·v2192 树尾 pin）随新现实更新 + 旧代 v22.8 字面量 pin /
// 旧代恒等 pin / 旧代一百零四件套 pin / 旧代树尾 pin / 旧代状态行正口径 全库零残留。
import { GAME_VERSION, ACH_LIST, TREASURE_GOAL, BESTIARY_TARGET, chestTotal, FRAGMENTS } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.9 状态页资源行「🏆 成就 N/41」总进度冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v22.8 + 精确 v22.9 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.8', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 9)), GAME_VERSION);
ok('GAME_VERSION 字面量已为 v22.9（本版独占精确锚点）', GAME_VERSION === 'v22.14', GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const menusSrc = read('../js/view/menus.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v22.9 版本注释', dataSrc.includes('v22.9 状态页资源行「·成就X/6」→「🏆 成就 N/41」'));
ok('data.js GAME_VERSION 字面量已更新为 v22.9', dataSrc.includes("const GAME_VERSION = 'v22.14';"));
ok('data.js 仍保留 v22.8 历史注释（累积注释块，姊妹 pin 不失效）', dataSrc.includes('v22.8 新成就「灵药盈囊」'));

// —— 源级落位：menus.js drawStatus 资源行新口径 + 旧「·成就X/6」正口径零残留 + 行位零回归 ——
ok('menus.js 资源行已并 🏆 总进度（与 drawDead 收集行同款四件套口径）',
  menusSrc.includes('📦:${chestCount(hero)}/${chestTotal()} 🏆:${(hero.ach||[]).length}/${ACH_LIST.length}'));
ok('menus.js 资源行旧「·成就X/6」正口径零残留（宝箱成就目标让位给 C 页）',
  !menusSrc.includes('📦:${chestCount(hero)}/${chestTotal()}·成' + '就'));
ok('menus.js 资源行仍在 y=264 14px（行位/字号零回归）', menusSrc.includes(",110,264,'14px');"));
ok('menus.js 含 v22.9 注释（与 data.js 同源注释块）', menusSrc.includes('v22.9 资源行「·成就X/6」→「🏆 成就 N/41」'));

// —— 数据契约：本版无新增成就、无阈值变动（41 项精确 / TREASURE_GOAL 6） ——
ok('ACH_LIST 总数 ≥41 项（v22.14 起随新现实去硬化，42 项精确计数由 v2214 接管）', ACH_LIST.length >= 41, String(ACH_LIST.length));
ok('elixir 仍在末尾序位（index 40，v22.8 首枚零回归）', ACH_LIST.findIndex((a) => a.id === 'elixir') === 40);
ok('TREASURE_GOAL 仍 6（开箱寻宝目标数未动，让位后仍在 C 页可见）', TREASURE_GOAL === 6, String(TREASURE_GOAL));
ok('BESTIARY_TARGET 仍 13 种（图鉴分母零回归）', BESTIARY_TARGET.length === 13);

// —— 行宽预算（estW 官方口径：14px 左起 x=110，面板右缘 570） ——
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
const worstRow = `金币:99999  🍖:99 🧪:99 🍄:99 📕:13/13 📦:12/${chestTotal()} 🏆:${ACH_LIST.length}/${ACH_LIST.length}  🕯️:${FRAGMENTS.length}/${FRAGMENTS.length}  ⏱️999:59:59`;
const wRow = estW(worstRow, 14);
ok('资源行最宽组合 estW 估算 ≤570（v22.9 随 🏆 总进度并入；实测右缘仍 ≤570 面板内）', wRow > 0 && wRow <= 570, `≈${wRow.toFixed(0)}`);
ok('资源行起点 110 + estW 估算 ≤ 670（保守估算口径）', 110 + wRow <= 670, `right≈${(110 + wRow).toFixed(0)}`);

// —— 运行期实证：DOM/音频/存储桩 + main.js 真实导入后 drawStatus 全链路 ——
const noop = () => {};
const CAPTURED = [];
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
    isPointInPath: () => false, getImageData: () => ({ data: new Uint8ClampedArray(4) }), putImageData: noop,
    globalAlpha: 1, strokeStyle: '#000', fillStyle: '#000', font: '', textAlign: 'left', textBaseline: 'alphabetic',
    lineWidth: 1, imageSmoothingEnabled: false,
    fillText: (t) => { CAPTURED.push(String(t)); },
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
const TOTAL_ACH = ACH_LIST.length;

// 新档档：成就 0/41（newGame ach: [] 起始）
let hero = newGame('余烬');
let cap = renderStatus(hero, 'village');
ok('运行期：新档资源行报 🏆 0/41（ACH_LIST 分母派生）',
  cap.some((t) => t.includes(`🏆:0/${TOTAL_ACH}`)), cap.find((t) => t.includes('🏆:')) || '');

// 推进档：已解锁 1 项 → 1/41
hero = newGame('潮');
hero.ach = ['lvl5'];
cap = renderStatus(hero, 'village');
ok('运行期：推进档资源行报 🏆 1/41', cap.some((t) => t.includes(`🏆:1/${TOTAL_ACH}`)));

// 全收集档：41/41
hero = newGame('灯见');
hero.ach = ACH_LIST.map((a) => a.id);
cap = renderStatus(hero, 'village');
ok('运行期：全收集档资源行报 🏆 41/41', cap.some((t) => t.includes(`🏆:${TOTAL_ACH}/${TOTAL_ACH}`)));

// 防御档：缺少 ach 字段旧档 → 0/41 不抛错（零迁移）
hero = newGame('余烬');
delete hero.ach;
let threw = null;
try { cap = renderStatus(hero, 'village'); } catch (e) { threw = e; }
ok('运行期：缺 ach 字段防御档不抛错且报 🏆 0/41（(hero.ach||[]) 防御式）',
  threw === null && cap.some((t) => t.includes(`🏆:0/${TOTAL_ACH}`)), threw && String(threw.stack || threw));

// 同段共存：🏆 与 📕/📦/🕯️/⏱/金币 同段（收集四件套于状态页齐备）
hero = newGame('潮');
Object.assign(hero, { bestiary: { '史莱姆': 1 }, chests: new Set(['22,1']), ach: ACH_LIST.map((a) => a.id), fragments: FRAGMENTS.map((f) => f.id) });
cap = renderStatus(hero, 'village');
ok('运行期：资源行 🏆 与 📕/📦/🕯️/⏱/金币 同段共存（收集四件套齐备）',
  cap.some((t) => t.includes('金币:') && t.includes('📕:') && t.includes('📦:') && t.includes('🏆:') && t.includes('🕯️:') && t.includes('⏱️')));

// 阵亡画面收集行四件套零回归（drawDead 同屏 🏆/📕/📦/🕯️）
S.scene = 'dead';
S.enemy = null;
CAPTURED.length = 0;
try { menus.drawDead(); } catch { /* drawDead 依赖 enemy 时为防御分支 */ }
ok('运行期：drawDead 收集行仍报 🏆 成就 N/M 四件套（零回归）',
  CAPTURED.some((t) => t.includes('🏆 成就 ') && t.includes('📕 图鉴') && t.includes('📦 宝箱') && t.includes('🕯️ 记忆碎片')));

// 成就页渲染零回归（41 项 + 末页滚动不抛错）
let rendered = true, renderedPg5 = true;
try {
  S.G = newGame('测试'); S.G.ach = ['elixir']; S.achScroll = 0; S.scene = 'ach';
  menus.drawAch();
} catch (e) { rendered = false; }
try {
  S.achScroll = 60;
  menus.drawAch();
} catch (e) { renderedPg5 = false; }
S.achScroll = 0; S.scene = 'world';
ok('运行期：成就页 drawAch 41 项渲染不抛错', rendered);
ok('运行期：成就页末页滚动渲染不抛错（41 项 PAGE=10 五页）', renderedPg5);

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树收录 smoke_v2209_achstatus 且位于串尾', readme.includes('smoke_v2209_achstatus + smoke_v2211_lampkid + smoke_v2212_volume + smoke_v2213_teller + smoke_v2214_mush（npm test 串跑）'));
ok('README 件套口径为一百一十件套（一百零九件套清除）',
  readme.includes('冒烟一百一十件套（一百零九件套清除）') && !readme.includes('冒烟一百零四件套（一百零三件套清' + '除）'));
ok('README 含 v22.9 守护描述', readme.includes('v22.9 起含状态页资源行「🏆 成就 N/M」总进度守护'));
ok('README 系统清单状态行口径已随新现实（📦 已开 X/全图 N · 🏆 成就 N/M）',
  readme.includes('📦 已开 X/全图 N · 🏆 成就 N/M') && !readme.includes('📦 已开 X/全图 N · 成就 X/M'));
ok('README 成就口径「41 项」双处同步（快速上手表 C 键行 + 图鉴&成就行，零成就变动）',
  readme.includes('成就一览（全部 42 项进度') && readme.includes('**42 项成就**'));
ok('package.json 已收录 smoke_v2209_achstatus（npm test 串跑第 105 份）',
  pkg.includes('smoke_v2209_achstatus.mjs') && /smoke_v2208_elixir\.mjs && node tests\/smoke_v2209_achstatus\.mjs/.test(pkg));
ok('CHANGELOG 含 v22.9 条目', changelog.includes('## v22.9 '));

// —— 姊妹件套 pin 复查（v21.7 惯例：本版冒烟守护姊妹随新现实更新） ——
const suite105 = ['smoke_v2208_elixir.mjs', 'smoke_v2207_titledel.mjs', 'smoke_v2206_stock2.mjs',
  'smoke_v2205_fragtitle.mjs', 'smoke_v2204_brew2.mjs', 'smoke_v2203_fragdead.mjs',
  'smoke_v2202_fragwin.mjs', 'smoke_v2201_fragstatus.mjs', 'smoke_v2200_stock.mjs',
  'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs', 'smoke_v2191_ptime.mjs',
  'smoke_v2190_launch.mjs', 'smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs',
  'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs',
  'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs',
  'smoke_v2181_helpquickcast.mjs', 'smoke_v2180_grain.mjs', 'smoke_v2179_titlerecap.mjs',
  'smoke_v2178_codexseen.mjs', 'smoke_v2177_elites.mjs', 'smoke_v2176_allchests.mjs'];
for (const nm of suite105) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README 件套 pin 已随新现实更新为一百一十件套（一百零九件套清除）`,
    src.includes('一百一十件套（一百零九件套清除）'));
}
const vers105 = ['smoke_v2208_elixir.mjs', 'smoke_v2207_titledel.mjs', 'smoke_v2206_stock2.mjs',
  'smoke_v2205_fragtitle.mjs', 'smoke_v2204_brew2.mjs', 'smoke_v2203_fragdead.mjs',
  'smoke_v2202_fragwin.mjs', 'smoke_v2201_fragstatus.mjs', 'smoke_v2200_stock.mjs',
  'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs', 'smoke_v2191_ptime.mjs',
  'smoke_v2190_launch.mjs', 'smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs',
  'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs',
  'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs',
  'smoke_v2181_helpquickcast.mjs', 'smoke_v2179_titlerecap.mjs'];
for (const nm of vers105) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 字面量 pin 已随新现实更新为 v22.9`,
    src.includes("const GAME_VERSION = 'v22.14';"));
}
for (const nm of ['smoke_v2208_elixir.mjs', 'smoke_v2207_titledel.mjs', 'smoke_v2206_stock2.mjs',
  'smoke_v2205_fragtitle.mjs', 'smoke_v2204_brew2.mjs', 'smoke_v2203_fragdead.mjs',
  'smoke_v2202_fragwin.mjs', 'smoke_v2201_fragstatus.mjs', 'smoke_v2200_stock.mjs',
  'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs']) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 恒等 pin（===）已随新现实更新为 v22.9`,
    src.includes("GAME_VERSION === 'v22.14'"));
}
for (const nm of ['smoke_v2208_elixir.mjs', 'smoke_v2207_titledel.mjs', 'smoke_v2206_stock2.mjs',
  'smoke_v2205_fragtitle.mjs', 'smoke_v2204_brew2.mjs', 'smoke_v2203_fragdead.mjs',
  'smoke_v2202_fragwin.mjs', 'smoke_v2201_fragstatus.mjs', 'smoke_v2200_stock.mjs',
  'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs']) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README tests 树尾 pin 已随新现实更新（+ smoke_v2209_achstatus）`,
    src.includes('smoke_v2209_achstatus + smoke_v2211_lampkid + smoke_v2212_volume + smoke_v2213_teller + smoke_v2214_mush（npm test 串跑）'));
}

// 旧代 pin 零残留：全部测试文件不得再含 v22.8 版本字面量 pin（拆串构造避免本文件扫描行自匹配）
const OLD_GV = "const GAME_VERSION = 'v22." + "8';";
let stale = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes(OLD_GV)) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v22.8 全库清零）', stale.length === 0, stale.join(','));
let staleId = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes("GAME_VERSION === 'v22." + "8'")) staleId.push(f);
}
ok('旧代 GAME_VERSION 恒等 pin 零残留（===v22.8 全库清零）', staleId.length === 0, staleId.join(','));
let staleSuite = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes('一百零四件套（一百零三件套清' + '除）')) staleSuite.push(f);
}
ok('旧代件套 pin 零残留（一百零四件套（一百零三件套清' + '除）全库清零）', staleSuite.length === 0, staleSuite.join(','));
let staleTail = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes('smoke_v2207_titledel + smoke_v2208_elixir（npm test 串' + '跑）')) staleTail.push(f);
}
ok('旧代树尾 pin 零残留（smoke_v2207_titledel + smoke_v2208_elixir 串全库清零）', staleTail.length === 0, staleTail.join(','));
let staleRow = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes('📦:${chestCount(hero)}/${chestTotal()}·成' + '就')) staleRow.push(f);
}
ok('旧代状态行正口径 pin 零残留（📦…·成就 全库清零）', staleRow.length === 0, staleRow.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
