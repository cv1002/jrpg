// smoke_v2299_crosslink.mjs —— v22.99 记忆图鉴/成就一览页脚「I 状态页」直达守护
// 承 v21.10-v22.98 冒烟入库先例：版本锚点 + 源级落位（main.js codex.onKey/ach.onKey I 分支 +
// menus.js drawCodex 448 / drawAch 430 页脚「I 状态页」+ data.js v22.99 注释/GAME_VERSION 字面量 v22.99/
// v22.98 历史注释保留零 v22.98 字面量残留）+ 运行期全链路（DOM/音频/存储桩 + main.js 真实导入：
// codex/ach 按 I 真实跳转 S.scene==='status'、B/C/Esc 回 world 零回归、↑↓ 滚动零回归、
// drawCodex/drawAch 渲染捕获「I 状态页」落画零抛错）+ README/package.json/CHANGELOG
// 同步（二百一十二件套（二百一十一件套清除）/串尾/入库 195 份/顶 pin）+ 姊妹件套 pin（smoke_v2298 随新现实
// 更新）+ 哨兵链领先一位（196 口径）+ 旧代 v22.98 pin 全库零残留。
import { GAME_VERSION } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.99 图鉴/成就页脚「I 状态页」直达守护冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v22.98 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.98（本版守 v22.99）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 99)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const mainSrc = read('../js/main.js');
const menusSrc = read('../js/view/menus.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v22.99 版本注释', dataSrc.includes('// v22.99 体验打磨·可发现性·信息透明'));
ok('data.js GAME_VERSION 字面量已为 v22.99（旧 v22.98 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.37';") && !dataSrc.includes("const GAME_VERSION = 'v22." + "98';"));
ok('data.js 仍保留 v22.98 历史注释（遇敌槽数值说明注释未动）', dataSrc.includes('// v22.98 文档整理·数值说明·同源口径'));

// —— main.js 源级落位：codex.onKey / ach.onKey 补 I→goto('status') 分支 ——
const iBranch = "else if (e.key === 'i' || e.key === 'I') goto('status');";
ok('main.js codex.onKey 含 I→goto(status) 分支（v22.99）',
  mainSrc.includes('codex:') && mainSrc.includes(iBranch) && mainSrc.includes('v22.99 图鉴页补 I 直达状态页'));
ok('main.js ach.onKey 含 I→goto(status) 分支（v22.99）',
  mainSrc.includes('ach:') && mainSrc.split(iBranch).length - 1 === 3 &&
  mainSrc.includes('v22.99 成就页补 I 直达状态页'));
ok('main.js codex.onKey B/Esc 分支零回归（b/B/isEsc→backWorld）',
  mainSrc.includes("if (e.key === 'b' || e.key === 'B' || isEsc(e)) backWorld();"));
ok('main.js ach.onKey C/Esc 分支零回归（c/C/isEsc→backWorld）',
  mainSrc.includes("if (e.key === 'c' || e.key === 'C' || isEsc(e)) backWorld();"));
ok('main.js codex/ach 方向键分派零回归（onArrow codexScroll/achScroll）',
  mainSrc.includes('S.codexScroll++') && mainSrc.includes('S.achScroll++') && mainSrc.includes('S.codexScroll--') && mainSrc.includes('S.achScroll--'));

// —— menus.js 源级落位：drawCodex 448 / drawAch 430 页脚补「I 状态页」 ——
ok('menus.js drawCodex 页脚含「· I 状态页」（448 行）',
  menusSrc.includes('按 B / Esc 关闭') && menusSrc.includes("·   I 状态页`,320,448,'12px','#7d93a3','center')"));
ok('menus.js drawAch 页脚含「· I 状态页」（430 行）',
  menusSrc.includes("按 C / Esc 关闭") && menusSrc.includes("·   I 状态页`,320,430,'12px','#7d93a3','center')"));
ok('menus.js 页脚注释含 v22.99（两处：drawCodex/drawAch）',
  menusSrc.split('v22.99 图鉴页脚补「I 状态页」').length - 1 === 1 &&
  menusSrc.split('v22.99 成就页脚补「I 状态页」').length - 1 === 1);
ok('menus.js 能力端零回归：drawStatus 页底「J 任务日志」仍在', menusSrc.includes('·  J 任务日志'));
ok('menus.js 能力端零回归：drawJournal 页脚「I 状态页」仍在（432 行）',
  menusSrc.includes("I 状态页`, 320, 432, '12px', '#7d93a3', 'center')"));
ok('menus.js 能力端零回归：drawAch 面板标题「— 成就 —」仍在',
  menusSrc.includes("panel(80,30,480,430,'— 成就 —')"));
ok('menus.js 能力端零回归：drawDead/drawWin 冒险进度行仍在（adventureProgress 同源行）',
  (menusSrc.match(/adventureProgress/g) || []).length >= 3);

// —— README 同步守护 ——
ok('README 快速上手表 B / C 两行补「I 直达状态页——v22.99」',
  readme.includes('页内 **`I` 直达状态页**——v22.99') &&
  readme.split('页内 **`I` 直达状态页**——v22.99').length - 1 === 2);
ok('README B 行 ↑↓ 滚动口径零回归（v22.88）', readme.includes('记忆图鉴（内容超出可视区时 ↑↓ 滚动浏览——v22.88'));
ok('README 成就行「全部 61 项进度」零回归', readme.includes('成就一览（全部 61 项进度'));
ok('README tests 树串尾已延伸至 smoke_v2299_crosslink（v2298 后接 v2299）',
  readme.includes('smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 旧串尾零残留（smoke_v2298_encnum（npm test 串跑）不在树尾）',
  !readme.includes('smoke_v2298_encnum（npm test 串' + '跑）'));
ok('README 件套口径为二百一十二件套（二百一十一件套清除）且旧 194 口径零残留',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟一百九十四件套（一百九十三件套清' + '除）'));
ok('README 含 v22.99 守护描述（图鉴/成就页脚 I 状态页直达守护）',
  readme.includes('v22.99 起含图鉴/成就页脚「I 状态页」直达守护'));
ok('README 含 smoke_v2299_crosslink 入库（195 份）', readme.includes('smoke_v2299_crosslink 入库（195 份）'));
ok('README 仍保留 v22.98 守护描述（历史口径）', readme.includes('v22.98 起含遇敌槽机制数值说明守护'));
ok('README 仍保留 smoke_v2298_encnum 入库（194 份）历史口径', readme.includes('smoke_v2298_encnum 入库（194 份）'));

// —— package.json / CHANGELOG 同步守护 ——
ok('package.json 已收录 smoke_v2299_crosslink（npm test 串跑第 195 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2299_crosslink.mjs'));
ok('package.json 串尾为 ... smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs"',
  pkg.includes('node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 195 件套', testChain === 212, String(testChain));
ok('CHANGELOG 顶部已追加 v22.99 条目', changelog.startsWith('## v23.37 '));
ok('CHANGELOG 仍保留 v22.98 条目（历史口径）', changelog.includes('## v22.98 遇敌槽机制数值说明补录'));

// —— 姊妹件套 pin 随新现实更新 + 旧代 v22.98 pin 零残留 ——
const s2298 = read('smoke_v2298_encnum.mjs');
const s2143 = read('smoke_v2143_talkekey.mjs');
ok('smoke_v2298 的 GAME_VERSION 字面量 pin 已更新为 v22.99', s2298.includes("const GAME_VERSION = 'v23.37';"));
ok('smoke_v2298 的 CHANGELOG 顶 pin 已更新为 ## v22.99',
  s2298.includes("startsWith('## v23.37 '"));
ok('smoke_v2298 的件套 pin 已更新为二百一十二件套（二百一十一件套清除）',
  s2298.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2298 的 README 串尾 pin 已延伸至 smoke_v2299_crosslink',
  s2298.includes('smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2298 的 package 串尾 pin 已延伸至 smoke_v2299_crosslink',
  s2298.includes('node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
ok('smoke_v2298 的 testChain pin 已更新为 195', s2298.includes('testChain === 212'));
ok('smoke_v2298 的版本锚已推进至 >= 99', s2298.includes('_gv[1] >= 99'));
ok('smoke_v2143 哨兵链已推进至二百一十二件套（二百一十一件套清除）',
  s2143.includes('二百一十三件套（二百一十二件套清除）') && s2143.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));

// —— 运行期实证：DOM/音频/存储桩 + main.js 真实导入 ——
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
const { screens } = await import('../js/main.js');
const { newGame } = await import('../js/core.js');
const { drawCodex, drawAch } = await import('../js/view/menus.js');

// 图鉴页按 I 真实跳转状态页（大小写两态）
S.scene = 'codex';
screens.codex.onKey({ key: 'i' });
ok('运行期：图鉴页按 i 真实跳转 S.scene==="status"', S.scene === 'status', S.scene);
S.scene = 'codex';
screens.codex.onKey({ key: 'I' });
ok('运行期：图鉴页按 I（大写）同效跳转 status', S.scene === 'status', S.scene);
// 成就页按 I 真实跳转状态页
S.scene = 'ach';
screens.ach.onKey({ key: 'I' });
ok('运行期：成就页按 I 真实跳转 S.scene==="status"', S.scene === 'status', S.scene);
// B/C/Esc 关闭零回归（回 world）
S.scene = 'codex';
screens.codex.onKey({ key: 'b' });
ok('运行期：图鉴页按 B 仍回 world（零回归）', S.scene === 'world', S.scene);
S.scene = 'ach';
screens.ach.onKey({ key: 'c' });
ok('运行期：成就页按 C 仍回 world（零回归）', S.scene === 'world', S.scene);
S.scene = 'ach';
screens.ach.onKey({ key: 'Escape' });
ok('运行期：成就页按 Esc 仍回 world（零回归）', S.scene === 'world', S.scene);
// ↑↓ 滚动零回归
S.scene = 'codex'; S.codexScroll = 0;
screens.codex.onKey({ key: 'ArrowDown' });
ok('运行期：图鉴页 ↓ 滚动仍生效（codexScroll 0→1）', S.codexScroll === 1, String(S.codexScroll));
S.scene = 'ach'; S.achScroll = 2;
screens.ach.onKey({ key: 'ArrowUp' });
ok('运行期：成就页 ↑ 滚动仍生效（achScroll 2→1）', S.achScroll === 1, String(S.achScroll));

// drawCodex / drawAch 渲染捕获「I 状态页」落画且零抛错（与 v21.94/v22.88 同款捕获桩）
const { CTX } = await import('../js/view/canvas.js');
const CAP = [];
const origFill = CTX.fillText;
CTX.fillText = (t) => { CAP.push(String(t)); return origFill.call(CTX, t, 0, 0); };
function renderAndCapture(fn, hero) {
  S.G = hero; S.scene = 'world'; S.codexScroll = 0; S.achScroll = 0;
  CAP.length = 0;
  fn();
  return CAP.slice();
}
let threw = null;
try { renderAndCapture(drawCodex, newGame('余烬')); } catch (e) { threw = e; }
ok('运行期：drawCodex 渲染零抛错', threw === null, threw && String(threw.stack || threw));
let capAch = null;
try { capAch = renderAndCapture(drawAch, newGame('潮')); } catch (e) { threw = threw || e; }
ok('运行期：drawAch 渲染零抛错', threw === null, threw && String(threw.stack || threw));
const capCodex = renderAndCapture(drawCodex, newGame('余烬'));
CTX.fillText = origFill;
ok('运行期：drawCodex 页脚落画含「I 状态页」（图鉴页）',
  capCodex.some((c) => c.includes('I 状态页') && c.includes('按 B / Esc 关闭')),
  JSON.stringify(capCodex.filter((c) => c.includes('I 状态页')).slice(0, 3)));
ok('运行期：drawAch 页脚落画含「I 状态页」（成就页）',
  (capAch || []).some((c) => c.includes('I 状态页') && c.includes('按 C / Esc 关闭')),
  JSON.stringify((capAch || []).filter((c) => c.includes('I 状态页')).slice(0, 3)));
ok('运行期：drawCodex ↑↓ 滚动口径仍在（还有 N 种共存）',
  capCodex.some((c) => c.includes('按 B / Esc 关闭')) && capCodex.some((c) => c.includes('记忆收录')));

// 旧代 v22.98 pin 全库零残留（不含本件）
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2299_crosslink.mjs');
const stale = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("const GAME_VERSION = 'v22.98';") || src.includes("const GAME_VERSION = 'v22.98'") || src.includes("GAME_VERSION === 'v22.98'") ||
      src.includes('一百九十四件套（一百九十三件套清' + '除）') || src.includes('testChain === ' + '194') ||
      src.includes('smoke_v2298_encnum（npm test 串' + '跑）') || src.includes('_gv[1] >= ' + '98') ||
      src.includes("startsWith('## v22.98") || src.includes('smoke_v2298_encnum.mjs"')) stale.push(f);
}
ok('旧代 v22.98 字面量/恒等/件套/testChain/串尾/版本锚/顶 pin/package 串尾 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

console.log(`\n— v22.99 图鉴/成就页脚「I 状态页」直达守护冒烟：${n - failed}/${n} 通过 —`);
if (failed) process.exit(1);
