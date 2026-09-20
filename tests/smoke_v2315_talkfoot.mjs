// smoke_v2315_talkfoot.mjs —— v23.15 对话页脚「灯下之声」进度守护（体验打磨·信息透明·反馈不迟到·纯显示）
// 承 v21.10-v23.14 冒烟入库先例：版本锚点 + 源级落位（data.js GAME_VERSION 字面量 v23.15 / v23.15 注释 /
// v23.14 历史注释保留、menus.js drawTalk 面板底缘进度行 + v23.15 注释块）+ 数据契约（NPCS 37 处 /
// voiceList 逐值：空档 0·全聊 37·子集计数·缺字段防御式零抛错·零变异）+ 运行期全链路（DOM/音频/存储桩 +
// main.js 真实导入：drawTalk 新档画「🗨️ 灯下之声 0/37」、openTalk 3 处后画「3/37」与 hero.talked 同源、
// 名牌/正文零回归）+ README/package.json/CHANGELOG 同步（树尾/件套 211/守护描述/入库 211 份）+
// 姊妹件套 pin（v2314 随新现实更新）+ 旧代 v23.14 pin 全库零残留 + 哨兵链领先一位（212 口径）。
import { GAME_VERSION, NPCS } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v23.15 对话页脚灯下之声进度冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v23.14 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v23.14（本版守 v23.15）', !!_gv && (_gv[0] > 23 || (_gv[0] === 23 && _gv[1] >= 15)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const menusSrc = read('../js/view/menus.js');
const v2145 = read('smoke_v2145_journalscroll.mjs');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v23.15 版本注释（对话页脚灯下之声进度）', dataSrc.includes('// v23.15 体验打磨·信息透明·反馈不迟到：对话界面'));
ok('data.js GAME_VERSION 字面量已为 v23.15（旧 v23.14 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.41';") && !dataSrc.includes("const GAME_VERSION = 'v23.14';"));
ok('data.js 仍保留 v23.14 历史注释（灯下之声节注释未动）',
  dataSrc.includes('// v23.14 体验打磨·信息透明·可发现性：J 任务日志新增「灯下之声」节'));
ok('menus.js drawTalk 进度行落位（voiceList(S.G) 单一数据源 + 面板底缘 text）',
  menusSrc.includes('const _voices = voiceList(S.G);') &&
  menusSrc.includes('text(`🗨️ 灯下之声 ${_voicesMet}/${_voices.length}`, bx + 24, by + bh - 14') &&
  menusSrc.includes('const _voicesMet = _voices.filter((v) => v.met).length;'));
ok('menus.js 含 v23.15 注释块（反馈不迟到·纯显示·与 ▼ 翻页指示同基线互不冲突）',
  menusSrc.includes('v23.15 对话面板底缘补「灯下之声 N/37」收集进度行'));
ok('menus.js voiceList 防御式读 (hero && hero.talked) || []（旧档零迁移零抛错，v23.14 契约零回归）',
  menusSrc.includes('const met = (hero && hero.talked) || [];'));

// —— 数据契约 ——
const ALL = Object.keys(NPCS);
ok('NPCS 精确 37 处（v23.13/v23.14 契约零回归）', ALL.length === 37, String(ALL.length));

// —— voiceList 纯函数逐值 ——
const { voiceList } = await import('../js/view/menus.js');
ok('voiceList(空档) 37 条全 met=false', (() => { const v = voiceList({}); return v.length === 37 && v.every((x) => !x.met); })());
ok('voiceList(全聊) 37 条全 met=true', (() => { const v = voiceList({ talked: ALL.slice() }); return v.length === 37 && v.every((x) => x.met); })());
ok('voiceList(子集 3 处) 恰 3 条 met=true', (() => { const v = voiceList({ talked: ALL.slice(0, 3) }); return v.filter((x) => x.met).length === 3; })());
ok('voiceList(无 talked 字段旧档) 不抛错且全 met=false', (() => { const v = voiceList({}); return v.every((x) => !x.met); })());
ok('voiceList 零变异（不写 hero.talked）', (() => { const h = { talked: ['chief'] }; voiceList(h); return h.talked.length === 1; })());

// —— 运行期实证：DOM/音频/存储桩 + main.js 真实导入后 drawTalk 进度行全链路 ——
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
const { drawTalk } = await import('../js/view/index.js');

let drawnCalls = [];
const { CTX } = await import('../js/view/canvas.js');
const origFill = CTX.fillText.bind(CTX);
CTX.fillText = (t, x, y) => { drawnCalls.push({ t: String(t), x, y }); };

const hero = newGame('灯见');
S.G = hero;
S.curNpc = 'chief';
S.talkPages = [['灯芯的事，拜托你了。']];
S.talkPage = 0;
S.talkLineAt = 0;
S.talkStartAt = 0;
drawnCalls.length = 0;
drawTalk();
ok('运行期：新档对话页脚画「🗨️ 灯下之声 0/37」',
  drawnCalls.some((c) => c.t === '🗨️ 灯下之声 0/37'), JSON.stringify(drawnCalls.filter((c) => c.t.includes('灯下之声')).map((c) => c.t)));
ok('运行期：对话名牌零回归（画 NPCS.chief.name）', drawnCalls.some((c) => c.t === NPCS.chief.name));
ok('运行期：对话正文零回归', drawnCalls.some((c) => c.t.length > 0 && c.t.includes('灯芯')));

// openTalk 记入 3 处后页脚计数跟随（与 C 成就页/J 日志节同读 hero.talked 一份源）
for (const id of ALL.slice(0, 3)) openTalk(id);
S.curNpc = 'chief';
S.talkPages = [['灯芯的事，拜托你了。']];
S.talkPage = 0; S.talkLineAt = 0;
drawnCalls.length = 0;
drawTalk();
ok('运行期：openTalk 3 处后页脚画「🗨️ 灯下之声 3/37」（反馈不迟到）',
  drawnCalls.some((c) => c.t === '🗨️ 灯下之声 3/37'), JSON.stringify(drawnCalls.filter((c) => c.t.includes('灯下之声')).map((c) => c.t)));

// 37 处全聊后页脚 37/37（有口皆碑达成档，数字与成就判定同源）
for (const id of ALL) openTalk(id);
S.curNpc = 'chief';
S.talkPages = [['灯芯的事，拜托你了。']];
S.talkPage = 0; S.talkLineAt = 0;
drawnCalls.length = 0;
drawTalk();
ok('运行期：全聊 37 处后页脚画「🗨️ 灯下之声 37/37」',
  drawnCalls.some((c) => c.t === '🗨️ 灯下之声 37/37'), JSON.stringify(drawnCalls.filter((c) => c.t.includes('灯下之声')).map((c) => c.t)));
CTX.fillText = origFill;

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树串尾已延伸至 smoke_v2315_talkfoot（v2314 后接 v2315）',
  readme.includes('+ smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 旧串尾零残留（smoke_v2314_voices（npm test 串跑）不在树尾）',
  !readme.includes('smoke_v2314_voices（npm test 串' + '跑）'));
ok('README 件套口径为二百一十二件套（二百一十一件套清除）且旧 210 口径零残留',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟二百一十件套（二百零九件套清' + '除）'));
ok('README 不含哨兵领先一位（二百一十三件套（二百一十二件套清除））',
  !readme.includes('二百一十三件套（二百一十二件套清除）'));
ok('README 含 v23.15 守护描述（对话页脚灯下之声进度守护）', readme.includes('v23.15 起含 对话页脚「灯下之声」进度守护'));
ok('README 仍保留 v23.14 守护描述（历史口径）', readme.includes('v23.14 起含 任务日志「灯下之声」节守护'));
ok('README 含 smoke_v2315_talkfoot 入库（211 份）', readme.includes('smoke_v2315_talkfoot 入库（211 份）'));
ok('README 仍保留 smoke_v2314_voices 入库（210 份）历史口径', readme.includes('smoke_v2314_voices 入库（210 份）'));
ok('package.json 已收录 smoke_v2315_talkfoot（npm test 串跑第 211 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2315_talkfoot.mjs'));
ok('package.json 串尾为 ... smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"',
  pkg.includes('node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 211 件套', testChain === 212, String(testChain));
ok('CHANGELOG 顶部已追加 v23.15 条目', changelog.startsWith('## v23.41 '));
ok('CHANGELOG 仍保留 v23.14 条目（历史口径）', changelog.includes('## v23.14 J 任务日志新增「灯下之声」节'));

// —— 姊妹件套 pin 随新现实更新 + 旧代 v23.14 pin 零残留 ——
const s2314 = read('smoke_v2314_voices.mjs');
const s2143 = read('smoke_v2143_talkekey.mjs');
ok('smoke_v2314 的 GAME_VERSION 字面量 pin 已更新为 v23.15', s2314.includes("const GAME_VERSION = 'v23.41';"));
ok('smoke_v2314 的 CHANGELOG 顶 pin 已更新为 ## v23.27', s2314.includes("startsWith('## v23.41 "));
ok('smoke_v2314 的件套 pin 已更新为二百一十二件套（二百一十一件套清除）', s2314.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2314 的 README 串尾 pin 已延伸至 smoke_v2315_talkfoot',
  s2314.includes('smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2314 的 package 串尾 pin 已延伸至 smoke_v2315_talkfoot',
  s2314.includes('node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
ok('smoke_v2314 的 testChain pin 已更新为 211', s2314.includes('testChain === 212'));
ok('smoke_v2143 哨兵链已推进至二百一十三件套（二百一十二件套清除）',
  s2143.includes('二百一十三件套（二百一十二件套清除）') && s2143.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));

// 旧代 v23.14 pin 全库零残留（不含本件）
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2315_talkfoot.mjs');
const stale = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("const GAME_VERSION = 'v23." + "14';") || src.includes("GAME_VERSION === 'v23." + "14'") ||
      src.includes('二百一十件套（二百零九件套清' + '除）') || src.includes('testChain === ' + '210') ||
      src.includes('smoke_v2314_voices（npm test 串' + '跑）') || src.includes("startsWith('## v23." + "14 ") ||
      src.includes('冒烟二百一十件套（二百零九件套清' + '除）') || src.includes('node tests/smoke_v2314_voices.mjs' + '"')) stale.push(f);
}
ok('旧代 v23.14 字面量/恒等/件套/testChain/串尾/顶 pin/package 串尾 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

console.log(`\n— v23.15 对话页脚灯下之声进度冒烟：${n - failed}/${n} 通过 —`);
if (failed) process.exit(1);
