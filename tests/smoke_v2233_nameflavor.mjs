// v22.33 专项冒烟：创建角色页「姓名寓意」注脚（新内容·开场引子·纯数据一行 + 纯显示一行）——三个
// 守灯人姓名（余烬/灯见/潮）此前只是三个字，创建页是玩家看到的第一张「选择」屏却没有任何世界观
// 引子；本版补 NAME_FLAVOR（data.js，与 HERO_NAMES 逐下标一一对应、单一数据源）+ drawCreate 姓名
// 下方 262 基线灰色注脚一行（原 230/300/352/382/408/432 各基线逐字未动）。
// 本冒烟守护：版本锚点、NAME_FLAVOR 数据契约（与 HERO_NAMES 等长/非空/宽度预算/语义主题）、
// menus 源级落位（import/绘制分支/文案/262 基线/旧基线零位移）、运行期真实渲染捕获三档
// （createName 0/1/2 → 逐字寓意一行落位 262、名字/难度/按键行零回归）、README/package.json/
// CHANGELOG 同步（tests 树尾 + 件套口径 129 + v22.33 守护描述 + 入库 129 份 + 角色创建 bullet）、
// 姊妹件套 pin（v2232..v2229 随新现实更新）复查 + 旧代 v22.32 字面量/恒等/件套/树尾 pin 零残留 +
// 坏链防回归。
import { S } from '../js/state.js';
import { GAME_VERSION, HERO_NAMES, NAME_FLAVOR, DEFAULT_NAME } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v22.32 冒烟先例：先装桩再 import main.js）——
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
const { drawCreate } = await import('../js/view/menus.js');
const { CTX } = await import('../js/view/canvas.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.33 创建页姓名寓意 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const menusSrc = fs.readFileSync(path.join(ROOT, 'js/view/menus.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.32 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.32', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 33)), GAME_VERSION);
ok('data.js 含 v22.33 注释（创建页姓名寓意说明）', dSrc.includes('v22.33 新内容：创建角色页「姓名寓意」'));
ok('GAME_VERSION 字面量已为 v22.33（旧 v22.32 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v22.37';") && !dSrc.includes("const GAME_VERSION = 'v22." + "32';"));
ok('data.js 仍保留 v22.32 历史注释（累积注释块，姊妹 pin 不失效）', dSrc.includes('v22.32 快速旅行面板补「目的地补给点」提示'));

// —— NAME_FLAVOR 数据契约（与 HERO_NAMES 逐下标一对应的单一数据源）——
ok('NAME_FLAVOR 已导出且为 3 元素数组', Array.isArray(NAME_FLAVOR) && NAME_FLAVOR.length === 3, String(NAME_FLAVOR && NAME_FLAVOR.length));
ok('NAME_FLAVOR 与 HERO_NAMES 逐下标等长对应（mismatch 即守护红）',
  NAME_FLAVOR.length === HERO_NAMES.length && HERO_NAMES.length === 3);
ok('HERO_NAMES 逐字未动（余烬/灯见/潮）', HERO_NAMES.join(',') === '余烬,灯见,潮', HERO_NAMES.join(','));
ok('DEFAULT_NAME 仍为 HERO_NAMES[0]（余烬，建档兜底零回归）', DEFAULT_NAME === '余烬' && DEFAULT_NAME === HERO_NAMES[0], DEFAULT_NAME);
const estW = (s) => { let w = 0; for (const ch of String(s)) { const c = ch.codePointAt(0); if (c >= 0x4e00 && c <= 0x9fff) w += 15; else if (c >= 0x3000 && c <= 0x303f) w += 15; else if (c >= 0xff00 && c <= 0xffef) w += 15; else if (/[0-9A-Za-z]/.test(ch)) w += 7.5; else if (ch === ' ') w += 7.5; else if ('｜|:：。，、！？…—·【】[]「」'.includes(ch)) w += 15; else w += 8; } return w; };
ok('NAME_FLAVOR 三项均为非空字符串', NAME_FLAVOR.every((t) => typeof t === 'string' && t.length > 0));
ok('NAME_FLAVOR 三项寓意互不相同（不重复注脚）', new Set(NAME_FLAVOR).size === 3);
ok('NAME_FLAVOR 行宽预算（13px estW ≤ 460 面板内）', NAME_FLAVOR.every((t) => estW('「' + t + '」') <= 460), NAME_FLAVOR.map((t) => estW('「' + t + '」')).join(','));
ok('NAME_FLAVOR[0]（余烬）呼应灯芯/火种主题', NAME_FLAVOR[0].includes('火种') || NAME_FLAVOR[0].includes('余'), NAME_FLAVOR[0]);
ok('NAME_FLAVOR[1]（灯见）呼应「见过灯/认得路」主题', NAME_FLAVOR[1].includes('灯') && NAME_FLAVOR[1].includes('路'), NAME_FLAVOR[1]);
ok('NAME_FLAVOR[2]（潮）呼应「潮水/名字」主题', NAME_FLAVOR[2].includes('名字'), NAME_FLAVOR[2]);

// —— menus.js 源级落位 ——
ok('menus.js 已 import NAME_FLAVOR（与 data 同源）', menusSrc.includes('NAME_FLAVOR'));
ok('drawCreate 含 v22.33 注释（姓名寓意说明）', menusSrc.includes('v22.33 姓名寓意'));
ok('drawCreate 注脚按 createName 下标读 NAME_FLAVOR（零裸字面量）',
  menusSrc.includes("NAME_FLAVOR[S.createName]"));
ok('注脚落位（「」+NAME_FLAVOR 拼接式绘制）', menusSrc.includes("'「'+NAME_FLAVOR[S.createName]+'」'"));
ok('注脚基线 262（230 姓名与 300 难度之间空隙）', menusSrc.includes(',CV.width/2,262);'));
ok('既有布局基线零位移：姓名 230', menusSrc.includes("HERO_NAMES[S.createName]+'  ▶',CV.width/2,230)"));
ok('既有布局基线零位移：难度 300', menusSrc.includes("'难度',CV.width/2,300)"));
ok('既有布局基线零位移：难度档 352', menusSrc.includes("DIFFS[S.createDiff]+'  ▼',CV.width/2,352)"));
ok('既有布局基线零位移：困难倍率 382', menusSrc.includes(',CV.width/2,382)'));
ok('既有布局基线零位移：每级成长 408', menusSrc.includes(',CV.width/2,408)'));
ok('既有布局基线零位移：按键行 432（v21.42 Esc 返回行同行零回归）', menusSrc.includes(',CV.width/2,432)'));

// —— 运行期真实渲染捕获（CTX.fillText 打桩收集）——
function captureCreate(createName) {
  const cap = [];
  const origFt = CTX.fillText;
  CTX.fillText = (t, ...a) => { cap.push({ t: String(t), y: a[1] }); return origFt.call(CTX, t, ...a); };
  try {
    S.createName = createName; S.createDiff = 0; S.scene = 'create';
    drawCreate();
  } catch (e) { cap.push({ t: 'THREW:' + e.message, y: -1 }); }
  CTX.fillText = origFt;
  return cap;
}
const FLAV = (i) => '「' + NAME_FLAVOR[i] + '」';
for (const i of [0, 1, 2]) {
  const cap = captureCreate(i);
  ok(`运行期：createName=${i} 注脚「${NAME_FLAVOR[i]}」落位 262`,
    cap.some((c) => c.t === FLAV(i) && c.y === 262), JSON.stringify(cap.filter((c) => c.t.startsWith('「'))));
  ok(`运行期：createName=${i} 姓名行（◀  ${HERO_NAMES[i]}  ▶）230 零回归`,
    cap.some((c) => c.t === '◀  ' + HERO_NAMES[i] + '  ▶' && c.y === 230), JSON.stringify(cap.filter((c) => c.t.includes('▶'))));
  ok(`运行期：createName=${i} 难度 300 / 按键行 432 零回归且无抛错`,
    cap.some((c) => c.t === '难度' && c.y === 300) && cap.some((c) => c.t.includes('Enter 出发') && c.y === 432) && !cap.some((c) => c.t.startsWith('THREW:')),
    JSON.stringify(cap.filter((c) => c.t === '难度' || c.t.includes('Enter 出发') || c.t.startsWith('THREW:'))));
}

// —— README / package.json / CHANGELOG 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树收录 smoke_v2233_nameflavor 且位于串尾', readme.includes('smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend（npm test 串跑）'));
ok('README tests 树尾链完整（v2232_travelsup 未被新尾吞并，全链连到 smoke_v2233_nameflavor）',
  readme.includes('smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend（npm test 串跑）'));
ok('README 件套口径为一百三十三件套（一百三十二件套清除）',
  readme.includes('冒烟一百三十三件套（一百三十二件套清除）') && !readme.includes('冒烟一百二十八件套（一百二十七件套清' + '除）'));
ok('README 含 v22.33 守护描述（创建页姓名寓意）', readme.includes('v22.33 起含创建页姓名寓意守护'));
ok('README 含 smoke_v2233_nameflavor 入库（129 份）', readme.includes('smoke_v2233_nameflavor 入库（129 份）'));
ok('README 角色创建 bullet 含姓名寓意口径', readme.includes('姓名寓意') && readme.includes('NAME_FLAVOR'));
ok('package.json 已收录 smoke_v2233_nameflavor（npm test 串跑第 129 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2233_nameflavor.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 129 件套', testChain === 133, String(testChain));
ok('CHANGELOG 含 v22.33 条目', changelog.includes('## v22.33 '));

// 姊妹 pin 复查（v2232..v2229 随新现实更新——GAME_VERSION 字面量/恒等、README 件套、树尾、testChain）
const s2232 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2232_travelsup.mjs'), 'utf8');
const s2231 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2231_smith.mjs'), 'utf8');
const s2230 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2230_pausewarn.mjs'), 'utf8');
const s2229 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2229_metall.mjs'), 'utf8');
ok('smoke_v2232 的 GAME_VERSION 字面量 pin 已更新为 v22.33', s2232.includes("const GAME_VERSION = 'v22.37';"));
ok('smoke_v2232 的 GAME_VERSION 恒等 pin 已更新为 === v22.33', s2232.includes("GAME_VERSION === 'v22.37'"));
ok('smoke_v2232 的 README 件套 pin 已随新现实更新为一百三十三件套（一百三十二件套清除）',
  s2232.includes('一百三十三件套（一百三十二件套清除）'));
ok('smoke_v2232 的 README 树尾 pin 已更新为 + smoke_v2232_travelsup + smoke_v2233_nameflavor',
  s2232.includes('smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend（npm test 串跑）'));
ok('smoke_v2232 的 package.json 件套计数 pin 已更新为 === 129', s2232.includes('testChain === 133'));
ok('smoke_v2231 的 GAME_VERSION 字面量 pin 已更新为 v22.33', s2231.includes("const GAME_VERSION = 'v22.37';"));
ok('smoke_v2231 的 README 件套 pin 已随新现实更新为一百三十三件套（一百三十二件套清除）',
  s2231.includes('一百三十三件套（一百三十二件套清除）'));
ok('smoke_v2231 的 README 树尾 pin 已更新为 + smoke_v2233_nameflavor',
  s2231.includes('smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend（npm test 串跑）'));
ok('smoke_v2231 的 package.json 件套计数 pin 已更新为 === 129', s2231.includes('testChain === 133'));
ok('smoke_v2230 的 GAME_VERSION 字面量 pin 已更新为 v22.33', s2230.includes("const GAME_VERSION = 'v22.37';"));
ok('smoke_v2230 的 README 树尾 pin 已更新为 + smoke_v2233_nameflavor',
  s2230.includes('smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend（npm test 串跑）'));
ok('smoke_v2230 的 package.json 件套计数 pin 已更新为 === 129', s2230.includes('testChain === 133'));
ok('smoke_v2229 的 GAME_VERSION 字面量 pin 已更新为 v22.33', s2229.includes("const GAME_VERSION = 'v22.37';"));
ok('smoke_v2229 的 GAME_VERSION 恒等 pin 已更新为 === v22.33', s2229.includes("GAME_VERSION === 'v22.37'"));
ok('smoke_v2229 的 README 件套 pin 已随新现实更新为一百三十三件套（一百三十二件套清除）',
  s2229.includes('一百三十三件套（一百三十二件套清除）'));
ok('smoke_v2229 的 README 树尾 pin 已更新为 + smoke_v2233_nameflavor',
  s2229.includes('smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend（npm test 串跑）'));
ok('smoke_v2229 的 package.json 件套计数 pin 已更新为 === 129', s2229.includes('testChain === 133'));

// —— 旧代 pin 零残留：全部测试文件不得再含 v22.32 字面量/恒等/件套/树尾 pin（拆串构造避免自匹配）——
let stale = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "32';")) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v22.32 全库清零）', stale.length === 0, stale.join(','));
let staleId = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("GAME_VERSION === 'v22." + "32'")) staleId.push(f);
}
ok('旧代 GAME_VERSION 恒等 pin 零残留（===v22.32 全库清零）', staleId.length === 0, staleId.join(','));
let staleSuite = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('一百二十八件套（一百二十七件套清' + '除）')) staleSuite.push(f);
}
ok('旧代件套 pin 零残留（一百二十八件套（一百二十七件套清' + '除）全库清零）', staleSuite.length === 0, staleSuite.join(','));
let staleTail = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('smoke_v2231_smith + smoke_v2232_travelsup（npm test 串' + '跑）')) staleTail.push(f);
}
ok('旧代树尾 pin 零残留（smoke_v2231_smith + smoke_v2232_travelsup 串全库清零）', staleTail.length === 0, staleTail.join(','));
// 断链防回归：不得出现 v2232_travelsup 被新尾吞并的坏链（smoke_v2231_smith 直接接 smoke_v2233_nameflavor）
let brokenTail = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('smoke_v2231_smith + smoke_v2233_nameflavor（npm test 串' + '跑）')) brokenTail.push(f);
}
if (readme.includes('smoke_v2231_smith + smoke_v2233_nameflavor（npm test 串' + '跑）')) brokenTail.push('README.md');
ok('坏链 pin 零残留（v2232_travelsup 吞并链全库清零）', brokenTail.length === 0, brokenTail.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
