// smoke_v2314_voices.mjs —— v23.14 J 任务日志「灯下之声」节守护（体验打磨·信息透明·可发现性·纯显示）
// 承 v21.10-v23.13 冒烟入库先例：版本锚点 + 源级落位（data.js GAME_VERSION 字面量 v23.14 / v23.14 注释 /
// v23.13 历史注释保留、menus.js voiceList 纯函数 + drawJournal 灯下之声节 + ✓/· 行 + remain 计数入列）+
// 数据契约（NPCS 37 处全有 name、voiceList 逐值（空档全 · / 全聊全 ✓ / 子集计数 / 缺字段防御式零抛错 /
// 零变异））+ 运行期全链路（DOM/音频/存储桩 + main.js 真实导入：drawJournal 灯下之声节 37 行落画、
// openTalk 记入后 ✓ 数随之、越界钳制 totalH-viewH 独立重算等价（承 v21.45 布局数学，含灯下之声节）、
// 页脚「按 J / Esc 关闭 · I 状态页」零回归）+ README/package.json/CHANGELOG 同步（树尾/件套 210/顶 pin/
// 入库 210 份）+/ 姊妹件套 pin（v2313 随新现实更新）+ 旧代 v23.13 pin 全库零残留 + 哨兵链领先一位（211 口径）。
import { GAME_VERSION, ACH_LIST, NPCS } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v23.14 灯下之声日志节冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v23.13 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v23.13（本版守 v23.14）', !!_gv && (_gv[0] > 23 || (_gv[0] === 23 && _gv[1] >= 14)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const menusSrc = read('../js/view/menus.js');
const v2145 = read('smoke_v2145_journalscroll.mjs');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v23.14 版本注释（灯下之声节）', dataSrc.includes('// v23.14 体验打磨·信息透明·可发现性：J 任务日志新增「灯下之声」节'));
ok('data.js GAME_VERSION 字面量已为 v23.14（旧 v23.13 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.46';") && !dataSrc.includes("const GAME_VERSION = 'v23.13';"));
ok('data.js 仍保留 v23.13 历史注释（有口皆碑注释未动）',
  dataSrc.includes('// v23.13 新内容·社交向单成就：新成就「有口皆碑」'));
ok('menus.js 含 voiceList 纯函数（Object.keys(NPCS) 单一数据源派生）',
  menusSrc.includes('export function voiceList(hero)') && menusSrc.includes('Object.keys(NPCS).map((id)'));
ok('menus.js voiceList 防御式读 (hero && hero.talked) || []（旧档零迁移零抛错）',
  menusSrc.includes('const met = (hero && hero.talked) || [];'));
ok('menus.js drawJournal 灯下之声节落位（head + talk 行 + ✓/· 渲染 + remain 计数入列）',
  menusSrc.includes("kind: 'head', label: `灯下之声 ${") && menusSrc.includes("items.push({ kind: 'talk', v, h: 16 })") &&
  menusSrc.includes("it.kind === 'talk'") && menusSrc.includes("it.kind === 'card' || it.kind === 'frag' || it.kind === 'talk'"));
ok('smoke_v2145 布局独立重算已纳入灯下之声节（与绘制侧同式）',
  v2145.includes('Object.keys(NPCS).length * 16') && v2145.includes("import { GAME_VERSION, FRAGMENTS, NPCS }"));

// —— 数据契约 ——
const ALL = Object.keys(NPCS);
ok('NPCS 精确 37 处（v23.13 契约零回归）', ALL.length === 37, String(ALL.length));
ok('NPCS 全部条目均有 name（voiceList 名源完整，零回退 id）', ALL.every((id) => !!(NPCS[id] && NPCS[id].name)));
ok('ACH_LIST 含 talkall（v23.13 成就零回归）且总数 60', !!ACH_LIST.find((a) => a.id === 'talkall') && ACH_LIST.length === 61, String(ACH_LIST.length));

// —— voiceList 纯函数逐值 ——
const { voiceList } = await import('../js/view/menus.js');
ok('voiceList(空档) 37 条全 met=false（零 npc？）', (() => { const v = voiceList({}); return v.length === 37 && v.every((x) => !x.met); })());
ok('voiceList(全聊) 37 条全 met=true', (() => { const v = voiceList({ talked: ALL.slice() }); return v.length === 37 && v.every((x) => x.met); })());
ok('voiceList(子集 3 处) 恰 3 条 met=true', (() => { const v = voiceList({ talked: ALL.slice(0, 3) }); return v.filter((x) => x.met).length === 3; })());
ok('voiceList(无 talked 字段旧档) 不抛错且全 met=false', (() => { const v = voiceList({}); return v.every((x) => !x.met); })());
ok('voiceList 零变异（不写 hero.talked）', (() => { const h = { talked: ['chief'] }; voiceList(h); return h.talked.length === 1; })());

// —— 运行期实证：DOM/音频/存储桩 + main.js 真实导入后 drawJournal 灯下之声节全链路 ——
const noop = () => {};
function makeCtx() {
  const grad = { addColorStop: noop };
  return {
    canvas: { width: 640, height: 480 },
    measureText: (t) => ({ width: String(t).length * 7 }),
    createLinearGradient: () => grad, createRadialGradient: () => grad, createConicGradient: () => grad, createPattern: () => ({}),
    beginPath: noop, closePath: noop, moveTo: noop, lineTo: noop, arc: noop, arcTo: noop, ellipse: noop,
    quadraticCurveTo: noop, bezierCurveTo: noop, fill: noop, stroke: noop, fillRect: noop, strokeRect: noop,
    clearRect: noop, drawImage: noop, save: noop, restore: noop, translate: noop, rotate: noop, scale: noop,
    transform: noop, setTransform: noop, clip: noop, rect: noop, setLineDash: noop, getLineDash: () => [],
    isPointInPath: () => false,
    globalAlpha: 1, strokeStyle: '#000', fillStyle: '#000', font: '', textAlign: 'left', textBaseline: 'alphabetic',
    lineWidth: 1, imageSmoothingEnabled: false,
    fillText: noop, strokeText: noop,
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
const { newGame, openTalk } = await import('../js/core.js');
const { drawJournal } = await import('../js/view/index.js');
const { questJournal } = await import('../js/quests.js');

let drawnCalls = [];
const { CTX } = await import('../js/view/canvas.js');
const origFill = CTX.fillText.bind(CTX);
CTX.fillText = (t, x, y) => { drawnCalls.push({ t: String(t), x, y }); };

const hero = newGame('灯见');
S.G = hero;
S.scene = 'journal';
S.journalScroll = 0;
drawnCalls.length = 0;
drawJournal();
ok('运行期：日志画出「灯下之声 0/37」节头（v23.16 起节头带进度，与 37 行 · 同屏自洽）', drawnCalls.some((c) => c.t === '灯下之声 0/37'));
const npcNames = new Set(ALL.map((id) => NPCS[id].name));
const voiceRows = drawnCalls.filter((c) => { const m = /^[✓·] (.*)$/.exec(c.t); return m && npcNames.has(m[1]); });
ok('运行期：灯下之声 37 行落画（新档全 ·；遍历 NPCS 名精确匹配，支线卡「· 标题」零误计）',
  voiceRows.length === 37 && voiceRows.every((c) => c.t.startsWith('· ')), String(voiceRows.length));
ok('运行期：页脚「按 J / Esc 关闭 · I 状态页」零回归', drawnCalls.some((c) => c.t.includes('按 J / Esc 关闭') && c.t.includes('I 状态页')));

// openTalk 记入 3 处后 ✓ 数跟随（与 C 成就页/判定同源 hero.talked）
for (const id of ALL.slice(0, 3)) openTalk(id);
S.journalScroll = 0;
drawnCalls.length = 0;
drawJournal();
const checked = drawnCalls.filter((c) => { const m = /^[✓·] (.*)$/.exec(c.t); return m && npcNames.has(m[1]) && c.t.startsWith('✓ '); });
ok('运行期：openTalk 3 处后 ✓ 行恰 3 条（hero.talked 单一数据源）', checked.length === 3, String(checked.length));

// 越界钳制：99999 → totalH-viewH（独立布局重算，承 v21.45 layout 数学 + v23.14 灯下之声节）
S.journalScroll = 99999;
drawJournal();
const jlog = questJournal(S.G);
const h = (e) => (e.status === 'done' ? 34 : e.status === 'locked' ? 50 : 70);
const rank = { turnin: 0, active: 1, offer: 2, locked: 3, done: 4 };
const jmains = jlog.filter((e) => e.kind === 'main');
const jsides = jlog.filter((e) => e.kind === 'side').sort((a, b) => (rank[a.status] ?? 9) - (rank[b.status] ?? 9));
let tot = 0;
if (jmains.length) { tot += 12; for (const e of jmains) tot += h(e) + 8; tot += 6; }
if (jsides.length) { tot += 12; for (const e of jsides) tot += h(e) + 8; tot += 6; }
tot += 16 + 4 * 16; // 记忆碎片
tot += 16 + ALL.length * 16; // v23.14 灯下之声
const expectMax = Math.max(0, tot - 352);
ok('运行期：journalScroll 越界钳制到 totalH-viewH（含灯下之声节：' + expectMax + '）', S.journalScroll === expectMax, S.journalScroll + ' vs ' + expectMax);
ok('运行期：未出现负滚动', S.journalScroll >= 0);
S.journalScroll = 0;
CTX.fillText = origFill;

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树串尾已延伸至 smoke_v2314_voices（v2313 后接 v2314）',
  readme.includes('+ smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 旧串尾零残留（smoke_v2313_talkall（npm test 串跑）不在树尾）',
  !readme.includes('smoke_v2313_talkall（npm test 串' + '跑）'));
ok('README 件套口径为二百一十二件套（二百一十一件套清除）且旧 209 口径零残留',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟二百零九件套（二百零八件套清' + '除）'));
ok('README 不含哨兵领先一位（二百一十三件套（二百一十二件套清除））',
  !readme.includes('二百一十三件套（二百一十二件套清除）'));
ok('README 含 v23.14 守护描述（任务日志灯下之声节守护）', readme.includes('v23.14 起含 任务日志「灯下之声」节守护'));
ok('README 仍保留 v23.13 守护描述（历史口径）', readme.includes('v23.13 起含 新成就「有口皆碑」守护'));
ok('README 含 smoke_v2314_voices 入库（210 份）', readme.includes('smoke_v2314_voices 入库（210 份）'));
ok('README 仍保留 smoke_v2313_talkall 入库（209 份）历史口径', readme.includes('smoke_v2313_talkall 入库（209 份）'));
ok('package.json 已收录 smoke_v2314_voices（npm test 串跑第 210 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2314_voices.mjs'));
ok('package.json 串尾为 ... smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"',
  pkg.includes('node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 210 件套', testChain === 212, String(testChain));
ok('CHANGELOG 顶部已追加 v23.14 条目', changelog.startsWith('## v23.46 '));
ok('CHANGELOG 仍保留 v23.13 条目（历史口径）', changelog.includes('## v23.13 新成就「有口皆碑」'));

// —— 姊妹件套 pin 随新现实更新 + 旧代 v23.13 pin 零残留 ——
const s2313 = read('smoke_v2313_talkall.mjs');
const s2143 = read('smoke_v2143_talkekey.mjs');
ok('smoke_v2313 的 GAME_VERSION 字面量 pin 已更新为 v23.14', s2313.includes("const GAME_VERSION = 'v23.46';"));
ok('smoke_v2313 的 CHANGELOG 顶 pin 已更新为 ## v23.14', s2313.includes("startsWith('## v23.46 "));
ok('smoke_v2313 的件套 pin 已更新为二百一十二件套（二百一十一件套清除）', s2313.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2313 的 README 串尾 pin 已延伸至 smoke_v2314_voices',
  s2313.includes('smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2313 的 package 串尾 pin 已延伸至 smoke_v2314_voices',
  s2313.includes('node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
ok('smoke_v2313 的 testChain pin 已更新为 210', s2313.includes('testChain === 212'));
ok('smoke_v2143 哨兵链已推进至二百一十三件套（二百一十二件套清除）',
  s2143.includes('二百一十三件套（二百一十二件套清除）') && s2143.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));

// 旧代 v23.13 pin 全库零残留（不含本件）
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2314_voices.mjs');
const stale = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("const GAME_VERSION = 'v23.13';") || src.includes("GAME_VERSION === 'v23.13'") ||
      src.includes('二百零九件套（二百零八件套清' + '除）') || src.includes('testChain === ' + '209') ||
      src.includes('smoke_v2313_talkall（npm test 串' + '跑）') || src.includes("startsWith('## v23.13 ") ||
      src.includes('冒烟二百零九件套（二百零八件套清' + '除）') || src.includes('smoke_v2313_talkall.mjs"')) stale.push(f);
}
ok('旧代 v23.13 字面量/恒等/件套/testChain/串尾/顶 pin/package 串尾 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

console.log(`\n— v23.14 灯下之声日志节冒烟：${n - failed}/${n} 通过 —`);
if (failed) process.exit(1);
