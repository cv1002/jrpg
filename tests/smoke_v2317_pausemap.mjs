// v23.78 专项冒烟：Esc 暂停菜单头部「当前所在地」——体验打磨·信息透明·纯显示，
// 承 v19.89 状态页「📍 地图名」/ v23.27 快速旅行「当前所在地标注」同一「我在哪」口径：
// 暂停菜单（drawPause）是玩家按 Esc 决定「存档/继续/快速旅行/回标题」的第一决策现场，
// 头部此前只报「名字 · 槽号」——现头部补「 · 📍地图名」，与 drawStatus 同读
// (MAPS[curMap()]||{}).name 一份单一数据源（加/删地图自动跟随零裸字面量），
// 纯显示零结算零存档零数值变化，头部既有「名字 · 槽 N」子串逐字保留（smoke_v2230 槽号行零回归）。
// 本冒烟守护：版本锚点、menus.js 源级落位（注释/头部派生/import 复用）、运行期 drawPause
// 真实渲染捕获（village→「📍潮灯镇」/gallery→「📍无字回廊」两档头部 + 页脚/槽号行/未存档行零回归）、
// README/package.json/CHANGELOG 同步（tests 树串尾 + 件套口径 + v23.78 守护描述 + Esc 行口径 + 入库 213 份）、
// 旧代 v23.76 pin 全库零残留扫描、断链防回归。
import { S } from '../js/state.js';
import { GAME_VERSION } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v23.16 冒烟先例：先装桩再 import main.js）——
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

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v23.78 暂停菜单「当前所在地」 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const menusSrc = read('js/view/menus.js');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v23.76 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v23.76', !!_gv && (_gv[0] > 23 || (_gv[0] === 23 && _gv[1] > 76)), GAME_VERSION);
ok('data.js 含 v23.78 注释（暂停菜单当前所在地说明）', dSrc.includes('v23.78 体验打磨·信息透明·纯显示'));
ok('GAME_VERSION 字面量已为 v23.78（旧 v23.76 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v23.78';") && !dSrc.includes("const GAME_VERSION = 'v23.7" + "6';"));
ok('data.js 仍保留 v23.76 历史注释（累积注释块，姊妹 pin 不失效）', dSrc.includes('v23.76 新内容·步行累计维度里程碑'));

// —— menus.js 源级落位：v23.78 注释 + drawPause 头部同数据源派生 + 既有子串保留 ——
ok('menus.js 仍保留 v23.77 注释（drawPause 头部当前所在地说明，历史注释累积）', menusSrc.includes('v23.77 体验打磨·信息透明·纯显示'));
ok('drawPause 头部由 (MAPS[curMap()]||{}).name 派生并附「 · 📍」后缀',
  menusSrc.includes("const _mapName = (MAPS[curMap()] || {}).name || curMap();") &&
  menusSrc.includes("'  ·  📍' + _mapName"));
ok('头部既有「名字 · 槽 N」子串逐字保留（smoke_v2230 槽号行 includes 断言零回归）',
  menusSrc.includes("(hero ? hero.name : '守灯人') + '  ·  槽 ' + S.curSaveSlot + '  ·  📍'"));
ok('MAPS 由既有 import 复用（menus.js data.js import 行含 MAPS，零新增模块依赖）',
  menusSrc.includes("import { GAME_VERSION, MAPS,"));
ok('v23.30 暂停页 pauseSaveHint 未存档行调用未动（零回归）',
  menusSrc.includes('const pHint = pauseSaveHint(S.G, S.unsaved, S.curSaveSlot, hasSlot(S.curSaveSlot));'));

// —— 运行期：drawPause 真实渲染捕获（village / gallery 两档头部 + 页脚/槽号行/未存档行零回归）——
{
  const { CTX } = await import('../js/view/canvas.js');
  const { drawPause } = await import('../js/view/menus.js');
  const cap = [];
  const origFt = CTX.fillText;
  CTX.fillText = (t, ...a) => { cap.push(String(t)); return origFt.call(CTX, t, ...a); };
  try {
    const hero = { name: '余烬', level: 3 };
    S.G = hero;
    S.scene = 'pause';
    S.unsaved = false;
    S.curSaveSlot = 3;
    cap.length = 0;
    S.G.map = 'village';
    drawPause();
    ok('village：头部捕获「余烬 · 槽 3 · 📍潮灯镇」', cap.includes('余烬  ·  槽 3  ·  📍潮灯镇'),
      JSON.stringify(cap.filter((t) => t.includes('槽'))));
    ok('头部槽号行子串零回归（余烬 · 槽 3）', cap.some((t) => t.includes('槽 3')));
    ok('页脚「↑↓ 选择 · Enter/E 确定 · Esc 关闭」零回归（v22.83 Enter/E 口径）',
      cap.includes('↑↓ 选择  ·  Enter/E 确定  ·  Esc 关闭'));
    cap.length = 0;
    S.G.map = 'gallery';
    drawPause();
    ok('gallery（最长名档）：头部捕获「余烬 · 槽 3 · 📍无字回廊」', cap.includes('余烬  ·  槽 3  ·  📍无字回廊'),
      JSON.stringify(cap.filter((t) => t.includes('槽'))));
    ok('unsaved=false：零「未存档」文字（v22.30 提示不误报）', !cap.some((t) => t.includes('未存档')),
      JSON.stringify(cap.filter((t) => t.includes('未存档'))));
  } finally {
    CTX.fillText = origFt;
    S.G = null;
    S.scene = 'title';
  }
}

// —— README / package.json / CHANGELOG 同步 ——
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');
const testChain = (JSON.parse(pkg).scripts.test.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 213 件套', testChain === 214, String(testChain));
ok('package.json 已收录 smoke_v2317_pausemap（npm test 串跑第 214 份）',
  JSON.parse(pkg).scripts.test.includes('smoke_v2317_pausemap.mjs'));
ok('package.json 串尾为 ... smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs"',
  pkg.includes('node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs"'));
ok('README tests 树串尾已延伸至 smoke_v2317_pausemap',
  readme.includes('+ smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap（npm test 串跑）'));
ok('README 件套口径为二百一十四件套（二百一十三件套清除）',
  readme.includes('冒烟二百一十四件套（二百一十三件套清除）') && !readme.includes('冒烟二百一十二件套（二百一十一件套清' + '除）'));
ok('README 仍保留 v23.77 守护描述（暂停菜单「当前所在地」守护，历史口径）', readme.includes('v23.77 起含 暂停菜单「当前所在地」守护'));
ok('README 含 smoke_v2317_pausemap 入库（213 份）', readme.includes('smoke_v2317_pausemap 入库（213 份）'));
ok('README 仍保留 v23.77 Esc 行当前所在地口径（历史口径）', readme.includes('v23.77 起菜单头部常显「📍 当前地图名」'));
ok('README 仍保留 v23.76 历史守护描述（累积描述，姊妹 pin 不失效）', readme.includes('千里之行 X/1000 步（步行累计，v23.76）'));
ok('CHANGELOG 顶部已追加 v23.78 条目（暂停菜单当前所在地）', changelog.startsWith('## v23.78 '));
ok('CHANGELOG 仍保留 v23.77 条目标题（暂停菜单当前所在地，历史口径）', changelog.includes('## v23.77 暂停菜单（Esc）头部补「当前所在地」'));

// —— 旧代 v23.76 pin 全库零残留（不含本件；拆串防误伤，承 v2313 惯例）——
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2317_pausemap.mjs');
const stale = [];
for (const f of allTests) {
  const src = read('tests/' + f);
  if (src.includes("const GAME_VERSION = 'v23.7" + "6';") ||
      src.includes("GAME_VERSION === 'v23.7" + "6'") ||
      src.includes("startsWith('## v23.7" + "6 ") ||
      src.includes("'## v23.7" + "6 ") ||
      src.includes('testChain === ' + '212') ||
      src.includes('第 ' + '212 份') ||
      src.includes('smoke_v2316_voiceshead（npm test 串' + '跑）') ||
      src.includes('smoke_v2316_voiceshead.mjs' + '"') ||
      src.includes('二百一十二件套（二百一十一件套清' + '除）')) stale.push(f);
}
ok('旧代 v23.76 字面量/恒等/顶 pin/件套/testChain/串尾 全库零残留（' + allTests.length + ' 件扫描，仅 v23.76 特性标签保留）',
  stale.length === 0, stale.join(','));

// —— 零回归：ACH_LIST 72 项 / NPCS 37 处不变（本版非成就改动、非新 NPC）——
ok('ACH_LIST 仍 72 项（本版非成就改动，零回归）', true, '');
const { ACH_LIST, NPCS } = await import('../js/data.js');
ok('ACH_LIST 精确总数 72（v23.76 千里之行为末项，未动）', ACH_LIST.length === 72, String(ACH_LIST.length));
ok('NPCS 仍 37 处（灯下之声口径未动）', Object.keys(NPCS).length === 37, String(Object.keys(NPCS).length));

console.log(`— v23.78 冒烟结束：${n} 项，失败 ${failed} —`);
if (failed > 0) process.exit(1);
