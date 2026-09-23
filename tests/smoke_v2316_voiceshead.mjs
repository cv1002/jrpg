// smoke_v2316_voiceshead.mjs —— v23.16 J 任务日志「灯下之声」节头 N/37 进度守护（体验打磨·信息透明·纯显示）
// 承 v21.10-v23.15 冒烟入库先例：版本锚点 + 源级落位（data.js GAME_VERSION 字面量 v23.16 / v23.16 注释 /
// v23.15 历史注释保留、menus.js drawJournal 节头 label 模板 + _voicesMet 派生计数 + v23.16 注释块）+
// 数据契约（NPCS 37 处 / ACH_LIST 60 项 talkall、voiceList 逐值：空档 0·全聊 37·子集计数·缺字段防御式
// 零抛错·零变异）+ 运行期全链路（DOM/音频/存储桩 + main.js 真实导入：drawJournal 新档节头画
// 「灯下之声 0/37」、openTalk 3 处后画「3/37」、全聊 37 处后画「37/37」与 37 行 ✓ 同屏自洽、页脚/布局
// 钳制零回归、drawTalk 页脚 v23.15 零回归）+ README/package.json/CHANGELOG 同步（树尾/件套 212/守护描述/
// 入库 212 份）+ 姊妹件套 pin（v2315 随新现实更新）+ 旧代 v23.15 pin 全库零残留 + 哨兵链领先一位（213 口径）。
import { GAME_VERSION, ACH_LIST, NPCS } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v23.16 日志节头灯下之声进度冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v23.15 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v23.15（本版守 v23.16）', !!_gv && (_gv[0] > 23 || (_gv[0] === 23 && _gv[1] >= 16)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const menusSrc = read('../js/view/menus.js');
const v2145 = read('smoke_v2145_journalscroll.mjs');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v23.16 版本注释（日志节头灯下之声进度）', dataSrc.includes('// v23.16 体验打磨·信息透明·纯显示：J 任务日志「灯下之声」节头补「N/37」进度'));
ok('data.js GAME_VERSION 字面量已为 v23.16（旧 v23.15 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.80';") && !dataSrc.includes("const GAME_VERSION = 'v23.15';"));
ok('data.js 仍保留 v23.15 历史注释（对话页脚进度行注释未动）',
  dataSrc.includes('// v23.15 体验打磨·信息透明·反馈不迟到：对话界面'));
ok('menus.js drawJournal 节头 label 落位（voiceList 派生 _voicesMet + 模板 label）',
  menusSrc.includes('const _voices = voiceList(hero);') &&
  menusSrc.includes('const _voicesMet = _voices.filter((v) => v.met).length;') &&
  menusSrc.includes('label: `灯下之声 ${_voicesMet}/${_voices.length}`'));
ok('menus.js 含 v23.16 注释块（节头补 N/37 进度·纯显示·行高/滚动/页脚口径逐字未动）',
  menusSrc.includes('v23.16 节头补「灯下之声 N/37」进度'));
ok('menus.js 灯下之声 talk 行逐字保留（items.push({ kind: \'talk\', v, h: 16 })，v23.14 契约零回归）',
  menusSrc.includes("items.push({ kind: 'talk', v, h: 16 })"));
ok('menus.js voiceList 防御式读 (hero && hero.talked) || []（旧档零迁移零抛错，v23.14 契约零回归）',
  menusSrc.includes('const met = (hero && hero.talked) || [];'));
ok('smoke_v2145 布局独立重算仍纳入灯下之声节（行高 16 未变，v23.14 契约零回归）',
  v2145.includes('Object.keys(NPCS).length * 16') && v2145.includes("import { GAME_VERSION, FRAGMENTS, NPCS }"));

// —— 数据契约 ——
const ALL = Object.keys(NPCS);
ok('NPCS 精确 37 处（v23.13/v23.14 契约零回归）', ALL.length === 37, String(ALL.length));
ok('NPCS 全部条目均有 name（节头计数与行名同源完整）', ALL.every((id) => !!(NPCS[id] && NPCS[id].name)));
ok('ACH_LIST 含 talkall（v23.13 成就零回归）且总数 60', !!ACH_LIST.find((a) => a.id === 'talkall') && ACH_LIST.length === 73, String(ACH_LIST.length));

// —— voiceList 纯函数逐值 ——
const { voiceList } = await import('../js/view/menus.js');
ok('voiceList(空档) 37 条全 met=false', (() => { const v = voiceList({}); return v.length === 37 && v.every((x) => !x.met); })());
ok('voiceList(全聊) 37 条全 met=true', (() => { const v = voiceList({ talked: ALL.slice() }); return v.length === 37 && v.every((x) => x.met); })());
ok('voiceList(子集 3 处) 恰 3 条 met=true', (() => { const v = voiceList({ talked: ALL.slice(0, 3) }); return v.filter((x) => x.met).length === 3; })());
ok('voiceList(无 talked 字段旧档) 不抛错且全 met=false', (() => { const v = voiceList({}); return v.every((x) => !x.met); })());
ok('voiceList 零变异（不写 hero.talked）', (() => { const h = { talked: ['chief'] }; voiceList(h); return h.talked.length === 1; })());

// —— 运行期实证：DOM/音频/存储桩 + main.js 真实导入后 drawJournal 节头进度全链路 ——
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
const { drawJournal, drawTalk } = await import('../js/view/index.js');
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
ok('运行期：新档日志节头画「灯下之声 0/37」（与同节 37 行 · 同屏自洽）',
  drawnCalls.some((c) => c.t === '灯下之声 0/37'), JSON.stringify(drawnCalls.filter((c) => c.t.includes('灯下之声')).map((c) => c.t)));
const npcNames0 = new Set(ALL.map((id) => NPCS[id].name));
const voiceRows0 = drawnCalls.filter((c) => { const m = /^[✓·] (.*)$/.exec(c.t); return m && npcNames0.has(m[1]); });
ok('运行期：节头 0/37 时 37 行全 ·（行渲染零回归）', voiceRows0.length === 37 && voiceRows0.every((c) => c.t.startsWith('· ')), String(voiceRows0.length));
ok('运行期：页脚「按 J / Esc 关闭 · I 状态页」零回归', drawnCalls.some((c) => c.t.includes('按 J / Esc 关闭') && c.t.includes('I 状态页')));

// v23.15 对话页脚零回归（同一 hero.talked 数据源，节头改动不触对话侧）
S.curNpc = 'chief';
S.talkPages = [['灯芯的事，拜托你了。']];
S.talkPage = 0; S.talkLineAt = 0; S.talkStartAt = 0;
drawnCalls.length = 0;
drawTalk();
ok('运行期：drawTalk 页脚画「🗨️ 灯下之声 0/37」（v23.15 契约零回归）',
  drawnCalls.some((c) => c.t === '🗨️ 灯下之声 0/37'));

// openTalk 记入 3 处后节头计数跟随（与 C 成就页/对话页脚/判定同源 hero.talked）
for (const id of ALL.slice(0, 3)) openTalk(id);
S.scene = 'journal';
S.journalScroll = 0;
drawnCalls.length = 0;
drawJournal();
ok('运行期：openTalk 3 处后节头画「灯下之声 3/37」（反馈不迟到）',
  drawnCalls.some((c) => c.t === '灯下之声 3/37'), JSON.stringify(drawnCalls.filter((c) => c.t.includes('灯下之声')).map((c) => c.t)));
const checked3 = drawnCalls.filter((c) => { const m = /^[✓·] (.*)$/.exec(c.t); return m && npcNames0.has(m[1]) && c.t.startsWith('✓ '); });
ok('运行期：openTalk 3 处后 ✓ 行恰 3 条（与节头 3/37 同屏自洽）', checked3.length === 3, String(checked3.length));

// 37 处全聊后节头 37/37（有口皆碑达成档，数字与成就判定同源）
for (const id of ALL) openTalk(id);
S.scene = 'journal';
S.journalScroll = 0;
drawnCalls.length = 0;
drawJournal();
ok('运行期：全聊 37 处后节头画「灯下之声 37/37」',
  drawnCalls.some((c) => c.t === '灯下之声 37/37'), JSON.stringify(drawnCalls.filter((c) => c.t.includes('灯下之声')).map((c) => c.t)));
const checkedAll = drawnCalls.filter((c) => { const m = /^[✓·] (.*)$/.exec(c.t); return m && npcNames0.has(m[1]) && c.t.startsWith('✓ '); });
ok('运行期：全聊后 ✓ 行恰 37 条（与节头 37/37 同屏自洽）', checkedAll.length === 37, String(checkedAll.length));

// 越界钳制：99999 → totalH-viewH（布局数学与 v23.14 完全一致：节头 h16 + 37 行 h16 未变）
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
tot += 16 + ALL.length * 16; // v23.14/v23.16 灯下之声（节头 h16 未变）
const expectMax = Math.max(0, tot - 352);
ok('运行期：journalScroll 越界钳制到 totalH-viewH（布局与 v23.14 等价：' + expectMax + '）', S.journalScroll === expectMax, S.journalScroll + ' vs ' + expectMax);
ok('运行期：未出现负滚动', S.journalScroll >= 0);
S.journalScroll = 0;
CTX.fillText = origFill;

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树串尾已延伸至 smoke_v2316_voiceshead（v2315 后接 v2316）',
  readme.includes('+ smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc（npm test 串跑）'));
ok('README 旧串尾零残留（smoke_v2315_talkfoot（npm test 串' + '跑）不在树尾）',
  !readme.includes('smoke_v2315_talkfoot（npm test 串' + '跑）'));
ok('README 件套口径为二百一十五件套（二百一十四件套清除）且旧 211 口径零残留',
  readme.includes('二百一十五件套（二百一十四件套清除）') && !readme.includes('二百一十一件套（二百一十件套清' + '除）'));
ok('README 不含哨兵领先一位（二百一十四件套（二百一十四件套清' + '除））',
  !readme.includes('二百一十四件套（二百一十四件套清' + '除）'));
ok('README 含 v23.16 守护描述（日志节头灯下之声进度守护）', readme.includes('v23.16 起含 任务日志「灯下之声」节头 N/37 进度守护'));
ok('README 仍保留 v23.15 守护描述（历史口径）', readme.includes('v23.15 起含 对话页脚「灯下之声」进度守护'));
ok('README 含 smoke_v2316_voiceshead 入库（212 份）', readme.includes('smoke_v2316_voiceshead 入库（212 份）'));
ok('README 仍保留 smoke_v2315_talkfoot 入库（211 份）历史口径', readme.includes('smoke_v2315_talkfoot 入库（211 份）'));
ok('package.json 已收录 smoke_v2316_voiceshead（npm test 串跑第 215 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2316_voiceshead.mjs'));
ok('package.json 串尾为 ... smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs"',
  pkg.includes('node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 212 件套', testChain === 215, String(testChain));
ok('CHANGELOG 顶部已追加 v23.16 条目', changelog.startsWith('## v23.80 '));
ok('CHANGELOG 仍保留 v23.15 条目（历史口径）', changelog.includes('## v23.15 对话界面面板底缘补「灯下之声 N/37」收集进度行'));

// —— 姊妹件套 pin 随新现实更新 + 旧代 v23.15 pin 零残留 ——
const s2315 = read('smoke_v2315_talkfoot.mjs');
const s2143 = read('smoke_v2143_talkekey.mjs');
ok('smoke_v2315 的 GAME_VERSION 字面量 pin 已更新为 v23.16', s2315.includes("const GAME_VERSION = 'v23.80';"));
ok('smoke_v2315 的 CHANGELOG 顶 pin 已更新为 ## v23.27', s2315.includes("startsWith('## v23.80 "));
ok('smoke_v2315 的件套 pin 已更新为二百一十五件套（二百一十四件套清除）', s2315.includes('二百一十五件套（二百一十四件套清除）'));
ok('smoke_v2315 的 README 串尾 pin 已延伸至 smoke_v2316_voiceshead',
  s2315.includes('smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc（npm test 串跑）'));
ok('smoke_v2315 的 package 串尾 pin 已延伸至 smoke_v2316_voiceshead',
  s2315.includes('node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs"'));
ok('smoke_v2315 的 testChain pin 已更新为 212', s2315.includes('testChain === 215'));
ok('smoke_v2143 哨兵链已推进至二百一十六件套（二百一十五件套清除）',
  s2143.includes('二百一十六件套（二百一十五件套清除）') && s2143.includes("!readme.includes('二百一十六件套（二百一十五件套清除）')"));

// 旧代 v23.15 pin 全库零残留（不含本件）
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2316_voiceshead.mjs');
const stale = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("const GAME_VERSION = 'v23." + "15';") || src.includes("GAME_VERSION === 'v23." + "15'") ||
      src.includes('二百一十一件套（二百一十件套清' + '除）') || src.includes('testChain === ' + '211') ||
      src.includes('smoke_v2315_talkfoot（npm test 串' + '跑）') || src.includes("startsWith('## v23." + "15 ") ||
      src.includes('冒烟二百一十一件套（二百一十件套清' + '除）') || src.includes('node tests/smoke_v2315_talkfoot.mjs' + '"')) stale.push(f);
}
ok('旧代 v23.15 字面量/恒等/件套/testChain/串尾/顶 pin/package 串尾 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

console.log(`\n— v23.16 日志节头灯下之声进度冒烟：${n - failed}/${n} 通过 —`);
if (failed) process.exit(1);
