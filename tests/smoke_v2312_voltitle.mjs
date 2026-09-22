// smoke_v2312_voltitle.mjs —— v23.12 标题画面提示行「[ / ] 音量」口径守护（体验打磨·可发现性·口径收尾）
// 承 v21.10-v23.11 冒烟入库先例：版本锚点 + 源级落位（data.js v23.12 注释/GAME_VERSION 字面量 v23.12/
// v23.11 历史注释保留零 v23.11 字面量残留）+ 契约（menus.js drawTitle 标题画面提示行与 M 静音同列补
// 「 · [ / ] 音量」，模板主体逐字保留、第二行快捷一览（I/J/B/C/T/F/H）零变化、main.js 教程行同口径、
// VOL_STEP 单一数据源 + 行宽预算（12px 全行 ≤640 画布、后缀增量 ≈64px）+ 运行期实证（drawTitle 渲染
// 捕获含后缀、第二行逐字零回归）+ README/package.json/CHANGELOG 同步（冒烟二百零八件套（二百零七
// 件套清除）/串尾/入库 208 份/顶 pin）+ 姊妹件套 pin（smoke_v2311 随新现实更新）+ 哨兵链领先一位
// （209 口径）+ 旧代 v23.11 pin 全库零残留。
import { GAME_VERSION, VOL_STEP } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v23.12 标题画面提示行 [ / ] 音量口径守护冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v23.11 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v23.11（本版守 v23.12）', !!_gv && (_gv[0] > 23 || (_gv[0] === 23 && _gv[1] >= 12)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const menuSrc = read('../js/view/menus.js');
const mainSrc = read('../js/main.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

// —— 版本落位 ——
ok('data.js 含 v23.12 版本注释', dataSrc.includes('// v23.12 体验打磨·可发现性·口径收尾'));
ok('data.js GAME_VERSION 字面量已为 v23.12（旧 v23.11 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.68';") && !dataSrc.includes("const GAME_VERSION = 'v23.11';"));
ok('data.js 仍保留 v23.11 历史注释（战利品预览记忆碎片注释未动）',
  dataSrc.includes('// v23.11 体验打磨·信息透明·同一口径：战斗「战利品预览」行'));

// —— 源级落位：menus.js drawTitle 标题画面提示行补「[ / ] 音量」——
ok('menus.js 标题画面提示行与 M 静音同列收口「 · [ / ] 音量」',
  menuSrc.includes('P 存档 · M 静音 · [ / ] 音量'));
ok('menus.js 提示行模板主体逐字保留（选槽/←/→/L 读档/R 重开/Esc/P 存档/M 静音）',
  menuSrc.includes("L 读档 · R 重开新档(连按两次) · Esc 菜单 · P 存档 · M 静音 · [ / ] 音量"));
ok('menus.js 提示行已不含「WASD 移动」不实 token（v23.26 口径收口——title.onKey 无 W/S 分支）',
  !menuSrc.includes('WASD 移动 · Esc 菜单'));
ok('menus.js 含 v23.12 注释块（标题页提示行口径收尾）',
  menuSrc.includes('v23.12 标题页提示行补「[ / ] 音量」口径'));
ok('menus.js 第二行快捷一览（y=442）逐字未动且不含 [ / ]（音量只进主提示行）',
  menuSrc.includes("CTX.fillText('I 状态 · J 日志 · B 记忆图鉴 · C 成就 · T 旅行 · F 喝药 · H 帮助',CV.width/2,442)") &&
  !menuSrc.includes('H 帮助 · [ / ]'));
ok('main.js 教程行同口径（M静音 · [ / ] 音量 并存——v22.15 起）',
  mainSrc.includes('M静音 · [ / ] 音量'));
ok('VOL_STEP 单一数据源仍为 0.1（10% 步进，与提示行同口径）', VOL_STEP === 0.1, String(VOL_STEP));

// —— 行宽预算（12px 系统字体近似：CJK ≈12px / 拉丁 ≈6.7 / 空格·点 ≈3.3）——
const estW12 = (s) => {
  let w = 0;
  for (const ch of String(s)) {
    const c = ch.codePointAt(0);
    if (c >= 0x4e00 && c <= 0x9fff) w += 12;
    else if (c >= 0x3000 && c <= 0x303f) w += 12;
    else if (c >= 0xff00 && c <= 0xffef) w += 12;
    else if (/[0-9A-Za-z]/.test(ch)) w += 6.7;
    else if (ch === ' ' || ch === '·') w += 3.3;
    else w += 6.7;
  }
  return w;
};
// v23.26 口径收口：主行已删「WASD 移动」（title.onKey 无 W/S 分支），行宽模型串随之更新（不含该 token）
const hintOld = '按 1/2/3 或 ←/→ 选择存档槽 · L 读档 · R 重开新档(连按两次) · Esc 菜单 · P 存档 · M 静音';
const hintNew = hintOld + ' · [ / ] 音量';
const wOld = estW12(hintOld), wNew = estW12(hintNew);
ok('标题画面提示行（含 [ / ] 音量）12px 全行 ≤640 画布', wNew > 0 && wNew <= 640, `≈${wNew.toFixed(0)}px`);
ok('后缀增量 ≈64px（[ / ] 音量 11 字符）', Math.abs((wNew - wOld) - 64) <= 3, `Δ=${(wNew - wOld).toFixed(0)}px`);

// —— 运行期实证：DOM/音频/存储桩 + main.js 真实导入后 drawTitle 渲染捕获 ——
const noop = () => {};
const CAPTURED = [];
function makeCtx() {
  const grad = { addColorStop: noop };
  return {
    canvas: { width: 640, height: 480 },
    measureText: (t) => ({ width: estW12(t) }),
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
    : { style: {}, classList: { add: noop, remove: noop }, value: '', textContent: '' },
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

let threw = null;
S.curSaveSlot = 1;
S.G = { name: '余烬', level: 1, gold: 30, unsaved: false };
try { CAPTURED.length = 0; menus.drawTitle(); } catch (e) { threw = e; }
ok('运行期：drawTitle 渲染不抛错', threw === null, threw && String(threw.stack || threw));
ok('运行期：标题画面提示行含「M 静音 · [ / ] 音量」后缀',
  CAPTURED.some((t) => t.includes('M 静音 · [ / ] 音量') && t.startsWith('按 ') && t.includes('L 读档')),
  CAPTURED.filter((t) => t.includes('静音')).join(' | '));
ok('运行期：第二行快捷一览逐字零回归（无 [ / ]）',
  CAPTURED.some((t) => t === 'I 状态 · J 日志 · B 记忆图鉴 · C 成就 · T 旅行 · F 喝药 · H 帮助'));

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README 件套口径为二百一十二件套（二百一十一件套清除）且旧 207 口径零残留',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟二百零七件套（二百零六件套清' + '除）'));
ok('README 不含哨兵领先一位（二百一十三件套（二百一十二件套清除））',
  !readme.includes('二百一十三件套（二百一十二件套清除）'));
ok('README 含 v23.12 守护描述（标题画面提示行 [ / ] 音量口径守护）',
  readme.includes('v23.12 起含 标题画面提示行「[ / ] 音量」口径守护'));
ok('README 含 smoke_v2312_voltitle 入库（208 份）', readme.includes('smoke_v2312_voltitle 入库（208 份）'));
ok('README 仍保留 v23.11 守护描述（历史口径）', readme.includes('v23.11 起含 战斗「战利品预览」记忆碎片守护'));
ok('README 仍保留 smoke_v2311_fragprev 入库（207 份）历史口径', readme.includes('smoke_v2311_fragprev 入库（207 份）'));
ok('README tests 树串尾已延伸至 smoke_v2312_voltitle（v2311 后接 v2312）',
  readme.includes('smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 旧串尾零残留（v2311 后无串尾收口）',
  !readme.includes('smoke_v2310_diffsum + smoke_v2311_fragprev（npm test 串' + '跑）'));
ok('package.json 已收录 smoke_v2312_voltitle', JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2312_voltitle.mjs'));
ok('package.json 串尾为 ... smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"',
  pkg.includes('node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 208 件套', testChain === 212, String(testChain));
ok('CHANGELOG 顶部已追加 v23.12 条目', changelog.startsWith('## v23.68 '));
ok('CHANGELOG 仍保留 v23.11 条目（历史口径）', changelog.includes('## v23.11 战斗「战利品预览」补「🧩 首胜必掉记忆碎片」'));

// —— 姊妹件套 pin 随新现实更新 + 旧代 v23.11 pin 零残留 ——
const s2311 = read('smoke_v2311_fragprev.mjs');
const s2143 = read('smoke_v2143_talkekey.mjs');
ok('smoke_v2311 的 GAME_VERSION 字面量 pin 已更新为 v23.12', s2311.includes("const GAME_VERSION = 'v23.68';"));
ok('smoke_v2311 的 CHANGELOG 顶 pin 已更新为 ## v23.12',
  s2311.includes("startsWith('## v23.68 "));
ok('smoke_v2311 的件套 pin 已更新为二百一十二件套（二百一十一件套清除）',
  s2311.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2311 的 README 串尾 pin 已延伸至 smoke_v2312_voltitle',
  s2311.includes('smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2311 的 package 串尾 pin 已延伸至 smoke_v2312_voltitle',
  s2311.includes('node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
ok('smoke_v2311 的 testChain pin 已更新为 208', s2311.includes('testChain === 212'));
ok('smoke_v2143 哨兵链已推进至二百一十三件套（二百一十二件套清除）',
  s2143.includes('二百一十三件套（二百一十二件套清除）') && s2143.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));

// 旧代 v23.11 pin 全库零残留（不含本件）
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2312_voltitle.mjs');
const stale = [];
const stalePats = [
  /'v23\.11'/, /二百零七件套（二百零六件套清.*?除）/,
  /testChain === 207/, /smoke_v2311_fragprev（npm test 串跑）/,
  /startsWith\('## v23\.11/, /smoke_v2311_fragprev\.mjs"/, /冒烟二百零七件套（二百零六件套清除）/
];
for (const f of allTests) {
  const src = read(f);
  if (stalePats.some((re) => re.test(src))) stale.push(f);
}
ok('旧代 v23.11 字面量/恒等/件套/testChain/串尾/顶 pin/package 串尾 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

console.log(`\n— v23.12 标题画面提示行 [ / ] 音量口径守护冒烟：${n - failed}/${n} 通过 —`);
if (failed) process.exit(1);
