// smoke_v2290_statlink.mjs —— v22.90 帮助页「操作说明」状态/任务日志两行 I↔J 双向直达口径守护
// 承 v21.10-v22.89 冒烟入库先例：版本锚点 + 源级落位 + 数据契约 + 行宽预算 +
// 运行期全链路 + README/package.json/CHANGELOG/index.html 同步 + 姊妹件套 pin + 旧代 v22.89 pin 全库零残留 + 哨兵链领先一位
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log(`  ✓ ${name}`); }
  else { fail++; console.log(`  ✗ ${name}`, extra || ''); }
};

console.log('— v22.90 帮助页「操作说明」状态/任务日志 I↔J 双向直达口径冒烟 —');

// 1. 版本锚点
const dataSrc = readFileSync(join(ROOT, 'js/data.js'), 'utf8');
ok('data.js GAME_VERSION 字面量为 v22.90', dataSrc.includes("const GAME_VERSION = 'v23.03';"));
ok('旧 v22.89 字面量零残留', !dataSrc.includes("const GAME_VERSION = 'v22." + "89';"));
ok('data.js 含 v22.90 版本注释', dataSrc.includes('// v22.90 体验打磨·可发现性·纯文字'));
ok('data.js 仍保留 v22.89 历史注释', dataSrc.includes('// v22.89 体验打磨·信息透明·纯显示'));

// 2. 源级落位：操作说明页两行补 I↔J 直达口径 + 行内注释 + 旧单键行零残留
ok('data.js 状态行现为 I（页底 J 直达日志）', dataSrc.includes("['状态','I（页底 J 直达日志）']"));
ok('data.js 任务日志行现为 J（↑↓ 滚动 · I 直达状态页）', dataSrc.includes("['任务日志','J（↑↓ 滚动 · I 直达状态页）']"));
ok("data.js 旧单键行零残留（['状态','I'] / ['任务日志','J（↑↓ 滚动）']）",
  !dataSrc.includes("['状态','I']") && !dataSrc.includes("['任务日志','J（↑↓ 滚动）']") &&
  !dataSrc.includes("['任务日志','J']"));
ok('data.js 含 v22.90 行内注释（两行补 I↔J 双向直达口径）',
  dataSrc.includes('v22.90 状态/任务日志两行补 I↔J 双向直达口径'));
// 能力端（口径与能力同源）：drawStatus 页底「J 任务日志」/ drawJournal 页脚「I 状态页」确实存在
const menusSrc = readFileSync(join(ROOT, 'js/view/menus.js'), 'utf8');
ok('menus.js 能力端存在：drawStatus 页底「J 任务日志」直达提示', menusSrc.includes('·  J 任务日志'));
ok('menus.js 能力端存在：drawJournal 页脚「I 状态页」互切提示', menusSrc.includes('I 状态页'));

// 3. 数据契约：操作说明页行数不变仍 14 + 两行精确 + 既有行零回归
const data = await import(join(ROOT, 'js/data.js'));
const { HELP_PAGES, GAME_VERSION } = data;
ok(`操作说明页行数仍 14（实际 ${HELP_PAGES[0].length}）`, HELP_PAGES[0].length === 14);
ok('GAME_VERSION 导出恒等于 v22.90', GAME_VERSION === 'v23.03', GAME_VERSION);
const p0 = HELP_PAGES[0];
const row = (label) => { const r = p0.find((x) => x[0] === label); return r ? String(r[1]) : null; };
const rowAll = (label) => { const r = p0.find((x) => x[0] === label); return r ? r.join(' ') : null; };
ok('状态行精确为「I（页底 J 直达日志）」', row('状态') === 'I（页底 J 直达日志）', row('状态'));
ok('任务日志行精确为「J（↑↓ 滚动 · I 直达状态页）」', row('任务日志') === 'J（↑↓ 滚动 · I 直达状态页）', row('任务日志'));
ok('记忆图鉴行零回归（B（↑↓ 滚动））', row('记忆图鉴') === 'B（↑↓ 滚动）');
ok('成就一览行零回归（C（↑↓ 滚动））', row('成就一览') === 'C（↑↓ 滚动）');
ok('移动行零回归（Shift 奔跑口径仍在）', String(row('移动 / 传送门')).includes('按住 Shift 奔跑'));
ok('对话/确认行零回归（Enter / E 口径仍在）', row('对话 / 确认') === 'Enter / E（镇民需面对面）');
ok('菜单/取消行零回归', row('菜单 / 取消') === 'Esc（大地图打开菜单，界面内返回）');
ok('存档（槽位）行零回归', row('存档（槽位）') === 'P 或菜单里「存档」');
ok('快速旅行行零回归（仍为 T）', row('快速旅行') === 'T');
ok('操作说明行零回归（仍为 H）', row('操作说明') === 'H');
ok('喝药行零回归（POTION 派生仍在）', String(row('喝药（普通/灵药）')).includes('%HP+'));
ok('静音/音量行零回归（[ / ] 口径仍在）', String(row('静音 / 音量')).includes('[ / ] 调节音量'));
ok('战斗行零回归（Enter/E 选招口径仍在）', String(row('战斗')).includes('↑↓/Enter/E 选招'));
ok('存档槽行零回归（R/X 口径仍在）', String(rowAll('存档槽')).includes('R 重开新档'));

// 4. 行宽预算（14px 主行，官方 estW 口径同 v22.77-89：CJK=0.865×size）+ 全页巡检
function estW(s, size = 14) {
  let w = 0;
  for (const ch of String(s)) {
    const code = ch.codePointAt(0);
    const wide = (code >= 0x2e80 && code <= 0x9fff) || (code >= 0x3000 && code <= 0x303f) || (code >= 0xff00 && code <= 0xffef) || code >= 0x1f000;
    if (wide) w += 0.865 * size;
    else if (code === 0xb7) w += 0.303 * size;
    else if (code === 0xd7) w += 0.564 * size;
    else if (code === 0x25) w += 0.827 * size;
    else if (code === 0x2b) w += 0.543 * size;
    else if (code === 0x2d) w += 0.432 * size;
    else if (code === 0x2f) w += 0.338 * size;
    else if (code === 0x2e) w += 0.226 * size;
    else if (code >= 0x30 && code <= 0x39) w += 0.63 * size;
    else if (code === 0x20) w += 0.263 * size;
    else w += 0.55 * size;
  }
  return w;
}
let widthOk = true;
for (const label of ['状态', '任务日志']) {
  const w = estW(label + '   ', 14) + estW(row(label), 14);
  if (w > 470) { widthOk = false; console.log('    <- 越界行:', label, Math.round(w)); }
  else console.log(`    行宽 ${label}: ${w.toFixed(1)} ≤ 470`);
}
ok('两行 14px estW 均 ≤470 面板预算', widthOk);
let pageOk = true;
for (const r of p0) {
  const w = estW(String(r[0]) + '   ', 14) + estW(String(r[1]), 14);
  if (w > 470) { pageOk = false; console.log('    <- 全页巡检越界行:', r[0], Math.round(w)); }
}
ok('操作说明页全页 14px 行宽巡检均 ≤470', pageOk);

// 5. 运行期全链路：DOM/音频/存储桩 + main.js 真实导入 + drawHelp 渲染捕获（页 0 两行新文案落画）
const noop = () => {};
const CAPTURED = [];
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
const { drawHelp } = await import('../js/view/menus.js');
const { CTX } = await import('../js/view/canvas.js');

S.G = null;
S.helpPage = 0;
CAPTURED.length = 0;
const origFill = CTX.fillText;
CTX.fillText = (t, x, y) => {
  CAPTURED.push({ t: String(t), x, y, font: CTX.font, fill: String(CTX.fillStyle) });
  return origFill.call(CTX, t, x, y);
};
let threw = null;
try { drawHelp(); } catch (e) { threw = e; }
CTX.fillText = origFill;
ok('运行期：操作说明页渲染无抛错', threw === null, threw && threw.message);
ok('运行期：状态行落画「I（页底 J 直达日志）」', CAPTURED.some((c) => c.t.includes('状态') && c.t.includes('页底 J 直达日志')));
ok('运行期：任务日志行落画「J（↑↓ 滚动 · I 直达状态页）」', CAPTURED.some((c) => c.t.includes('任务日志') && c.t.includes('I 直达状态页')));
ok('运行期：I↔J 直达口径落画恰 2 处（状态 1 + 日志 1）',
  CAPTURED.filter((c) => c.t.includes('直达日志')).length === 1 &&
  CAPTURED.filter((c) => c.t.includes('I 直达状态页')).length === 1,
  JSON.stringify(CAPTURED.filter((c) => c.t.includes('直达')).map((c) => c.t.slice(0, 24))));
ok('运行期：既有口径零回归（B/C ↑↓ 滚动共存）',
  CAPTURED.some((c) => c.t.includes('记忆图鉴') && c.t.includes('↑↓ 滚动')) &&
  CAPTURED.some((c) => c.t.includes('成就一览') && c.t.includes('↑↓ 滚动')));
{
  let otherOk = true;
  for (const p of [1, 2, 3]) {
    S.helpPage = p;
    try { CAPTURED.length = 0; CTX.fillText = origFill; drawHelp(); } catch (e) { otherOk = false; console.log('   drawHelp err:', e.message); }
  }
  CTX.fillText = origFill;
  ok('运行期：其余三页渲染零回归（地图指南/魔物状态/试炼进阶不抛错）', otherOk);
}

// 6. README / package.json / CHANGELOG / index.html 同步
const readme = readFileSync(join(ROOT, 'README.md'), 'utf8');
const pkg = readFileSync(join(ROOT, 'package.json'), 'utf8');
const changelog = readFileSync(join(ROOT, 'CHANGELOG.md'), 'utf8');
const idx = readFileSync(join(ROOT, 'index.html'), 'utf8');
ok('README tests 树串尾已延伸至 smoke_v2290_statlink（v2289 后接 v2290）',
  readme.includes('smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum（npm test 串跑）'));
ok('README 件套口径为一百九十九件套（一百九十八件套清除）且旧 185 口径零残留',
  readme.includes('冒烟一百九十九件套（一百九十八件套清除）') && !readme.includes('一百八十五件套（一百八十四件套清' + '除）'));
ok('README 含 v22.90 守护描述（状态/任务日志 I↔J 双向直达口径守护）',
  readme.includes('v22.90 起含帮助页「操作说明」状态/任务日志 I↔J 双向直达口径守护'));
ok('README 含 smoke_v2290_statlink 入库（186 份）', readme.includes('smoke_v2290_statlink 入库（186 份）'));
ok('README 仍保留 smoke_v2289_winprog 入库（185 份）历史口径', readme.includes('smoke_v2289_winprog 入库（185 份）'));
ok('README 仍保留 v22.89 守护描述（历史口径）', readme.includes('v22.89 起含胜利画面「冒险进度」五徽记行守护'));
ok('index.html 常驻帮助条 I 处补直达日志口径', idx.includes('I</kbd>状态（<kbd>J</kbd>直达日志）'));
ok('index.html J/B/C 滚动口径零回归', idx.includes('J</kbd>任务（<kbd>↑↓</kbd>滚动）') && idx.includes('B</kbd>图鉴（<kbd>↑↓</kbd>滚动）'));
ok('package.json test 串含 smoke_v2290_statlink.mjs 且位于串尾',
  pkg.includes('node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 186 件套', testChain === 199, String(testChain));
ok('CHANGELOG 含 v22.90 条目（顶 pin）', changelog.startsWith('## v23.03 '));
ok('CHANGELOG 仍保留 v22.89 条目（历史口径）', changelog.includes('## v22.89 胜利画面补「冒险进度」'));

// 7. 姊妹件套 pin（smoke_v2289/v2288/v2287 随新现实更新）
const readTest = (name) => readFileSync(join(ROOT, 'tests', name), 'utf8');
const s2289 = readTest('smoke_v2289_winprog.mjs');
const s2288 = readTest('smoke_v2288_scrollhint.mjs');
const s2287 = readTest('smoke_v2287_trueroute.mjs');
ok('smoke_v2289 的 GAME_VERSION 字面量 pin 已更新为 v22.90', s2289.includes("const GAME_VERSION = 'v23.03';"));
ok('smoke_v2289 的 CHANGELOG 顶 pin 已更新为 ## v22.90', s2289.includes("startsWith('## v23.03 '"));
ok('smoke_v2289 的件套 pin 已更新为一百九十九件套（一百九十八件套清除）', s2289.includes('一百九十九件套（一百九十八件套清除）'));
ok('smoke_v2289 的 README 串尾 pin 已延伸至 smoke_v2290_statlink',
  s2289.includes('smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum（npm test 串跑）'));
ok('smoke_v2289 的 package 串尾 pin 已延伸至 smoke_v2290_statlink',
  s2289.includes('node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs"'));
ok('smoke_v2289 的 testChain pin 已更新为 186', s2289.includes('testChain === 199'));
ok('smoke_v2289 的哨兵 pin 已更新为一百九十九件套（一百九十八件套清除）', s2289.includes('一百九十九件套（一百九十八件套清除）'));
ok('smoke_v2288 的 GAME_VERSION 字面量 pin 已更新为 v22.90', s2288.includes("const GAME_VERSION = 'v23.03';"));
ok('smoke_v2288 的 testChain pin 已更新为 186', s2288.includes('testChain === 199'));
ok('smoke_v2288 的 哨兵 pin 已更新为一百九十九件套（一百九十八件套清除）', s2288.includes('一百九十九件套（一百九十八件套清除）'));
ok('smoke_v2288 的 状态/任务日志行 pin 已随 v22.90 口径更新',
  s2288.includes("row('状态') === 'I（页底 J 直达日志）'") &&
  s2288.includes("row('任务日志') === 'J（↑↓ 滚动 · I 直达状态页）'"));
ok('smoke_v2287 的 GAME_VERSION 字面量 pin 已更新为 v22.90', s2287.includes("const GAME_VERSION = 'v23.03';"));
ok('smoke_v2287 的 testChain pin 已更新为 186', s2287.includes('testChain === 199'));

// 8. 旧代 v22.89 pin 全库零残留
const allTests = readdirSync(join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2290_statlink.mjs');
const stale = [];
for (const f of allTests) {
  const src = readFileSync(join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "89';") || src.includes("GAME_VERSION === 'v22." + "89'") ||
      src.includes('一百八十五件套（一百八十四件套清' + '除）') || src.includes('testChain === ' + '185') ||
      src.includes('smoke_v2288_scrollhint + smoke_v2289_winprog（npm test ' + '串跑）') || src.includes('_gv[1] >= ' + '89') ||
      src.includes("startsWith('## v22." + "89 '") || src.includes("startsWith('## v22." + "89'")) stale.push(f);
}
ok('旧代 v22.89 字面量/恒等/件套/testChain/串尾/版本锚/顶 pin 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

// 9. 哨兵链（件套守护领先一位）已指向下一版 187 口径
const s2143 = readTest('smoke_v2143_talkekey.mjs');
ok('哨兵链 v2143 已含下一版件套口径（一百九十九件套（一百九十八件套清除））',
  s2143.includes('二百件套（一百九十九件套清除）') &&
  s2143.includes("!readme.includes('二百件套（一百九十九件套清除）')"));

console.log(`\n— v22.90 帮助页「操作说明」状态/任务日志 I↔J 双向直达口径冒烟：${pass}/${pass + fail} 通过 —`);
process.exit(fail ? 1 : 0);
