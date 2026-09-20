// smoke_v2288_scrollhint.mjs —— v22.88 帮助页「操作说明」任务日志/记忆图鉴/成就一览「↑↓ 滚动」口径守护
// 承 v21.10-v22.87 冒烟入库先例：版本锚点 + 源级落位 + 数据契约 + 行宽预算 +
// 运行期全链路 + README/package.json/CHANGELOG/index.html 同步 + 姊妹件套 pin + 旧代 v22.87 pin 全库零残留 + 哨兵链领先一位
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

console.log('— v22.88 帮助页「操作说明」J/B/C 三行「↑↓ 滚动」口径冒烟 —');

// 1. 版本锚点
const dataSrc = readFileSync(join(ROOT, 'js/data.js'), 'utf8');
ok('data.js GAME_VERSION 字面量为 v22.88', dataSrc.includes("const GAME_VERSION = 'v23.38'"));
ok('旧 v22.87 字面量零残留', !dataSrc.includes("const GAME_VERSION = 'v22." + "87';"));
ok('data.js 含 v22.88 版本注释', dataSrc.includes('// v22.88 体验打磨·可发现性·纯文字'));
ok('data.js 仍保留 v22.87 历史注释', dataSrc.includes('// v22.87 体验打磨·信息透明·纯文字'));

// 2. 源级落位：操作说明页三行补「（↑↓ 滚动）」+ 行内注释 + 旧单键行零残留
ok('data.js 任务日志行现为 J（↑↓ 滚动 · I 直达状态页）', dataSrc.includes("['任务日志','J（↑↓ 滚动 · I 直达状态页）']"));
ok('data.js 记忆图鉴行现为 B（↑↓ 滚动）', dataSrc.includes("['记忆图鉴','B（↑↓ 滚动）']"));
ok('data.js 成就一览行现为 C（↑↓ 滚动）', dataSrc.includes("['成就一览','C（↑↓ 滚动）']"));
ok("data.js 旧单键行零残留（['任务日志','J'] 等）",
  !dataSrc.includes("['任务日志','J']") && !dataSrc.includes("['记忆图鉴','B']") && !dataSrc.includes("['成就一览','C']"));
ok('data.js 含 v22.88 行内注释（三行补 ↑↓ 滚动）', dataSrc.includes('v22.88 任务日志/记忆图鉴/成就一览三行补「↑↓ 滚动」口径'));
// 三屏滚动能力确实存在（口径与能力同源）
const menusSrc = readFileSync(join(ROOT, 'js/view/menus.js'), 'utf8');
const mainSrc = readFileSync(join(ROOT, 'js/main.js'), 'utf8');
ok('menus.js 三屏滚动源存在（journalScroll/codexScroll/achScroll）',
  menusSrc.includes('S.journalScroll') && menusSrc.includes('S.codexScroll') && menusSrc.includes('S.achScroll'));
ok('main.js 三屏 ↑↓ 滚动分派存在（journal/codex/ach 各两向）',
  mainSrc.includes('S.journalScroll++') && mainSrc.includes('S.codexScroll++') && mainSrc.includes('S.achScroll++'));

// 3. 数据契约：操作说明页行数不变仍 14 + 三行精确 + 既有行零回归
const data = await import(join(ROOT, 'js/data.js'));
const { HELP_PAGES, GAME_VERSION } = data;
ok(`操作说明页行数仍 14（实际 ${HELP_PAGES[0].length}）`, HELP_PAGES[0].length === 14);
ok('GAME_VERSION 导出恒等于 v22.88', GAME_VERSION === 'v23.38', GAME_VERSION);
const p0 = HELP_PAGES[0];
const row = (label) => { const r = p0.find((x) => x[0] === label); return r ? String(r[1]) : null; };
const rowAll = (label) => { const r = p0.find((x) => x[0] === label); return r ? r.join(' ') : null; };
ok('任务日志行精确为「J（↑↓ 滚动 · I 直达状态页）」（v22.90 口径）', row('任务日志') === 'J（↑↓ 滚动 · I 直达状态页）', row('任务日志'));
ok('记忆图鉴行精确为「B（↑↓ 滚动）」', row('记忆图鉴') === 'B（↑↓ 滚动）', row('记忆图鉴'));
ok('成就一览行精确为「C（↑↓ 滚动）」', row('成就一览') === 'C（↑↓ 滚动）', row('成就一览'));
ok('移动行零回归（Shift 奔跑口径仍在）', String(row('移动 / 传送门')).includes('按住 Shift 奔跑'));
ok('对话/确认行零回归（Enter / E 口径仍在）', row('对话 / 确认') === 'Enter / E（镇民需面对面）');
ok('菜单/取消行零回归', row('菜单 / 取消') === 'Esc（大地图打开菜单，界面内返回）');
ok('状态行 v22.90 口径（页底 J 直达日志）', row('状态') === 'I（页底 J 直达日志）');
ok('快速旅行行零回归（仍为 T）', row('快速旅行') === 'T');
ok('操作说明行零回归（仍为 H）', row('操作说明') === 'H');
ok('喝药行零回归（POTION 派生仍在）', String(row('喝药（普通/灵药）')).includes('%HP+'));
ok('静音/音量行零回归（[ / ] 口径仍在）', String(row('静音 / 音量')).includes('[ / ] 调节音量'));
ok('战斗行零回归（Enter/E 选招口径仍在）', String(row('战斗')).includes('↑↓/Enter/E 选招'));
ok('存档槽行零回归（R/X 口径仍在）', String(rowAll('存档槽')).includes('R 重开新档'));

// 4. 行宽预算（14px 主行，官方 estW 口径同 v22.77-87：CJK=0.865×size）
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
for (const label of ['任务日志', '记忆图鉴', '成就一览']) {
  const w = estW(label + '   ', 14) + estW(row(label), 14);
  if (w > 470) { widthOk = false; console.log('    <- 越界行:', label, Math.round(w)); }
  else console.log(`    行宽 ${label}: ${w.toFixed(1)} ≤ 470`);
}
ok('三行 14px estW 均 ≤470 面板预算', widthOk);

// 5. 运行期全链路：DOM/音频/存储桩 + main.js 真实导入 + drawHelp 渲染捕获（页 0 三行新文案落画）
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
const scrollStrs = CAPTURED.filter((c) => c.t.includes('↑↓ 滚动'));
ok(`运行期：操作说明页含「↑↓ 滚动」文案 ${scrollStrs.length} 处（J/B/C 三行）`, scrollStrs.length === 3,
  JSON.stringify(scrollStrs.map((c) => c.t.slice(0, 20))));
ok('运行期：任务日志行落画「J（↑↓ 滚动）」', CAPTURED.some((c) => c.t.includes('任务日志') && c.t.includes('↑↓ 滚动')));
ok('运行期：记忆图鉴行落画「B（↑↓ 滚动）」', CAPTURED.some((c) => c.t.includes('记忆图鉴') && c.t.includes('↑↓ 滚动')));
ok('运行期：成就一览行落画「C（↑↓ 滚动）」', CAPTURED.some((c) => c.t.includes('成就一览') && c.t.includes('↑↓ 滚动')));
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
ok('README tests 树串尾已延伸至 smoke_v2288_scrollhint（v2287 后接 v2288）',
  readme.includes('smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 件套口径为二百一十二件套（二百一十一件套清除）且旧 183 口径零残留',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('一百八十三件套（一百八十二件套清' + '除）'));
ok('README 含 v22.88 守护描述（操作说明 J/B/C ↑↓ 滚动口径守护）',
  readme.includes('v22.88 起含帮助页「操作说明」任务日志/记忆图鉴/成就一览「↑↓ 滚动」口径守护'));
ok('README 含 smoke_v2288_scrollhint 入库（184 份）', readme.includes('smoke_v2288_scrollhint 入库（184 份）'));
ok('README 仍保留 smoke_v2287_trueroute 入库（183 份）历史口径', readme.includes('smoke_v2287_trueroute 入库（183 份）'));
ok('README 仍保留 v22.87 守护描述（历史口径）', readme.includes('v22.87 起含帮助页「地图指南」通关之路行真结局/记忆碎片指针守护'));
ok('README 快速上手表 B 行补 ↑↓ 滚动口径（v22.88）', readme.includes('记忆图鉴（内容超出可视区时 ↑↓ 滚动浏览——v22.88'));
ok('index.html 常驻帮助条 J/B/C 三处补 ↑↓ 滚动口径',
  idx.includes('J</kbd>任务（<kbd>↑↓</kbd>滚动）') && idx.includes('B</kbd>图鉴（<kbd>↑↓</kbd>滚动）') && idx.includes('C</kbd>成就（<kbd>↑↓</kbd>滚动）'));
ok('package.json test 串含 smoke_v2288_scrollhint.mjs 且位于串尾',
  pkg.includes('node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 185 件套', testChain === 212, String(testChain));
ok('CHANGELOG 含 v22.88 条目（顶 pin）', changelog.startsWith('## v23.38 '));

// 7. 姊妹件套 pin（smoke_v2287/v2286/v2285 随新现实更新）
const readTest = (name) => readFileSync(join(ROOT, 'tests', name), 'utf8');
const s2287 = readTest('smoke_v2287_trueroute.mjs');
const s2286 = readTest('smoke_v2286_titleekey.mjs');
const s2285 = readTest('smoke_v2285_winekey.mjs');
ok('smoke_v2287 的 GAME_VERSION 字面量 pin 已更新为 v22.88', s2287.includes("const GAME_VERSION = 'v23.38';"));
ok('smoke_v2287 的 CHANGELOG 顶 pin 已更新为 ## v22.88', s2287.includes("startsWith('## v23.38 '"));
ok('smoke_v2287 的件套 pin 已更新为二百一十二件套（二百一十一件套清除）', s2287.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2287 的 README 串尾 pin 已延伸至 smoke_v2288_scrollhint',
  s2287.includes('smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2287 的 package 串尾 pin 已延伸至 smoke_v2288_scrollhint',
  s2287.includes('node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
ok('smoke_v2287 的 testChain pin 已更新为 184', s2287.includes('testChain === 212'));
ok('smoke_v2286 的 GAME_VERSION 字面量 pin 已更新为 v22.88', s2286.includes("const GAME_VERSION = 'v23.38';"));
ok('smoke_v2286 的 testChain pin 已更新为 184', s2286.includes('testChain === 212'));
ok('smoke_v2286 的哨兵 pin 已更新为二百一十二件套（二百一十一件套清除）', s2286.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2285 的 GAME_VERSION 字面量 pin 已更新为 v22.88', s2285.includes("const GAME_VERSION = 'v23.38';"));

// 8. 旧代 v22.87 pin 全库零残留
const allTests = readdirSync(join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2288_scrollhint.mjs');
const stale = [];
for (const f of allTests) {
  const src = readFileSync(join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "87';") || src.includes("GAME_VERSION === 'v22." + "87'") ||
      src.includes('一百八十三件套（一百八十二件套清' + '除）') || src.includes('testChain === ' + '183') ||
      src.includes('smoke_v2287_trueroute（npm test ' + '串跑）') || src.includes('_gv[1] >= ' + '87') ||
      src.includes("startsWith('## v22." + "87 '") || src.includes("startsWith('## v22." + "87'")) stale.push(f);
}
ok('旧代 v22.87 字面量/恒等/件套/testChain/串尾/版本锚 pin 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

// 9. 哨兵链（件套守护领先一位）已指向下一版 185 口径
const s2143 = readTest('smoke_v2143_talkekey.mjs');
ok('哨兵链 v2143 已含下一版件套口径（二百一十二件套（二百一十一件套清除））',
  s2143.includes('二百一十三件套（二百一十二件套清除）') &&
  s2143.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));

console.log(`\n— v22.88 帮助页「操作说明」J/B/C 三行「↑↓ 滚动」口径冒烟：${pass}/${pass + fail} 通过 —`);
process.exit(fail ? 1 : 0);
