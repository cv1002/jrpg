// smoke_v2285_winekey.mjs —— v22.85 胜利画面/尾声确认 E 键别名守护
// 承 v21.10-v22.84 冒烟入库先例：版本锚点 + 源级落位 + 数据契约 + 行宽预算 + 运行期全链路 +
// README/package.json/CHANGELOG 同步 + 姊妹件套 pin + 旧代 v22.84 pin 全库零残留 + 哨兵链领先一位
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

console.log('— v22.85 胜利画面/尾声确认 E 键别名冒烟 —');

// 1. 版本锚点
const dataSrc = readFileSync(join(ROOT, 'js/data.js'), 'utf8');
ok('data.js GAME_VERSION 字面量为 v22.85', dataSrc.includes("const GAME_VERSION = 'v23.79'"));
ok('旧 v22.84 字面量零残留', !dataSrc.includes("const GAME_VERSION = 'v22." + "84';"));
ok('data.js 含 v22.85 版本注释', dataSrc.includes('// v22.85 体验打磨·胜利画面/尾声确认补 E 键别名'));
ok('data.js 仍保留 v22.84 历史注释', dataSrc.includes('// v22.84 体验打磨·战斗技能菜单施放补 E 键别名'));

// 2. 源级落位：main.js win.onKey/ending.onKey e/E 别名 + 旧单 Enter 分支零残留 + KEY 无 'e' 映射
const mainSrc = readFileSync(join(ROOT, 'js/main.js'), 'utf8');
ok('main.js ending.onKey 返回标题 e/E/Enter 同条件', mainSrc.includes("if (e.key === 'Enter' || e.key === 'e' || e.key === 'E') { goto('title'); startBgm('title'); }"));
ok('main.js win.onKey 观看尾声 e/E/Enter 同条件', mainSrc.includes("if (e.key === 'Enter' || e.key === 'e' || e.key === 'E') goto('ending');"));
ok('main.js 旧「ending 单 Enter」分支零残留', !mainSrc.includes("if (e.key === 'Enter') { goto('title'); startBgm('title'); }"));
ok('main.js 旧「win 单 Enter」分支零残留', !mainSrc.includes("if (e.key === 'Enter') goto('ending');"));
ok('main.js 含 v22.85 注释块（尾声）', mainSrc.includes('// v22.85 尾声确认补 E 键别名'));
ok('main.js 含 v22.85 注释块（胜利画面）', mainSrc.includes('// v22.85 胜利画面「观看尾声」补 E 键别名'));
ok('KEY 移动表无 e/E 映射（不与移动键冲突）', dataSrc.includes("const KEY={ ArrowUp:'U',w:'U',W:'U',ArrowDown:'D',s:'D',S:'D',ArrowLeft:'L',a:'L',A:'L',ArrowRight:'R',d:'R',D:'R' }"));

// 3. 页脚口径（menus.js drawWin/drawEnding）
const mSrc = readFileSync(join(ROOT, 'js/view/menus.js'), 'utf8');
ok('drawWin 页脚 按 Enter/E 观看尾声', mSrc.includes("CTX.fillText('按 Enter/E 观看尾声 · 按 P 存档 · 按 R 重开新档(连按两次)',CV.width/2,396);"));
ok('drawWin 旧页脚源码「fillText(\'按 Enter 观看尾声 ·」零残留（历史注释保留不影响）', !mSrc.includes("fillText('按 Enter 观看尾声 ·"));
ok('drawEnding 页脚 按 Enter/E 返回标题', mSrc.includes("text('按 Enter/E 返回标题',320,396,'13px','#7d93a3','center');"));
ok('drawEnding 旧口径「按 Enter 返回标题」零残留', !mSrc.includes("text('按 Enter 返回标题'"));
ok('menus.js 含 v22.85 注释块（drawWin）', mSrc.includes('// v22.85 页脚口径同步：win.onKey 观看尾声补 E 键别名'));
ok('menus.js 含 v22.85 注释块（drawEnding）', mSrc.includes('// v22.85 页脚口径同步：ending.onKey 返回标题补 E 键别名'));
ok('drawWin 仍保留 P/R 出口口径（v21.98/v21.70 零回归）', mSrc.includes('按 P 存档') && mSrc.includes('按 R 重开新档(连按两次)'));
ok('drawEnding 仍保留战绩行口径（v21.87 零回归）', mSrc.includes('📕 图鉴') && mSrc.includes('📦 宝箱'));

// 4. 数据契约
const data = await import(join(ROOT, 'js/data.js'));
const { GAME_VERSION } = data;
ok('GAME_VERSION 导出恒等于 v22.85', GAME_VERSION === 'v23.79', GAME_VERSION);

// 5. 行宽预算：drawWin 页脚 14px ≤640 画布、drawEnding 页脚 13px ≤470 面板
const estW = (s, size) => {
  let wsum = 0;
  for (const ch of String(s || '')) {
    const code = ch.codePointAt(0);
    const wide = (code >= 0x2e80 && code <= 0x9fff) || (code >= 0x3000 && code <= 0x303f) || (code >= 0xff00 && code <= 0xffef) || code >= 0x1f000;
    if (wide) wsum += 0.865 * size;
    else if (code === 0xb7) wsum += 0.303 * size;
    else if (code === 0xd7) wsum += 0.564 * size;
    else if (code === 0x25) wsum += 0.827 * size;
    else if (code === 0x2b) wsum += 0.543 * size;
    else if (code === 0x2d) wsum += 0.432 * size;
    else if (code === 0x2f) wsum += 0.338 * size;
    else if (code === 0x2e) wsum += 0.226 * size;
    else if (code >= 0x30 && code <= 0x39) wsum += 0.63 * size;
    else if (code === 0x20) wsum += 0.263 * size;
    else wsum += 0.55 * size;
  }
  return wsum;
};
const wWin = estW('按 Enter/E 观看尾声 · 按 P 存档 · 按 R 重开新档(连按两次)', 14);
ok('drawWin 页脚（14px）估算宽 ≤640 画布预算', wWin <= 640, `≈${wWin.toFixed(1)}`);
const wEnd = estW('按 Enter/E 返回标题', 13);
ok('drawEnding 页脚（13px）估算宽 ≤470 面板预算', wEnd <= 470, `≈${wEnd.toFixed(1)}`);

// 6. 运行期全链路：DOM/音频/存储桩 + main.js 真实导入 + win/ending.onKey 逐键驱动
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
    lineWidth: 1, imageSmoothingEnabled: false, fillText: noop,
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

// 6.1 win.onKey 的 e/E/Enter 三键均进入尾声（与 Enter 同路径 goto('ending')）
for (const k of ['e', 'E', 'Enter']) {
  S.scene = 'win';
  S.titleResetArm = 0;
  let threw = null;
  try { screens.win.onKey({ key: k }); } catch (e) { threw = e; }
  ok(`运行期：win.onKey 按 ${k === 'Enter' ? 'Enter' : k} 进入尾声（scene=ending）`,
    threw === null && S.scene === 'ending', threw && threw.message, String(S.scene));
}
// 6.2 ending.onKey 的 e/E/Enter 三键均回标题（goto('title') + startBgm('title')）
for (const k of ['e', 'E', 'Enter']) {
  S.scene = 'ending';
  let threw = null;
  try { screens.ending.onKey({ key: k }); } catch (e) { threw = e; }
  ok(`运行期：ending.onKey 按 ${k === 'Enter' ? 'Enter' : k} 返回标题（scene=title）`,
    threw === null && S.scene === 'title', threw && threw.message, String(S.scene));
}
// 6.3 无关键零回归：win 上按无关键停留在 win，不误入尾声
{
  S.scene = 'win';
  S.titleResetArm = 0;
  screens.win.onKey({ key: 'x' });
  ok('运行期：win.onKey 按无关键停留 win（不误入尾声）', S.scene === 'win', String(S.scene));
  S.scene = 'ending';
  screens.ending.onKey({ key: 'x' });
  ok('运行期：ending.onKey 按无关键停留 ending（不误回标题）', S.scene === 'ending', String(S.scene));
}
// 6.4 R 两按确认解武装零回归：E 属非 R 键、先解 titleResetArm 再进尾声
{
  S.scene = 'win';
  S.titleResetArm = 1;
  screens.win.onKey({ key: 'e' });
  ok('运行期：win.onKey 按 e 时 titleResetArm 解武装为 0（非 R 键口径零回归）且进入尾声',
    S.titleResetArm === 0 && S.scene === 'ending', String(S.titleResetArm) + '/' + String(S.scene));
}

// 7. README / package.json / CHANGELOG 同步
const readme = readFileSync(join(ROOT, 'README.md'), 'utf8');
const pkg = readFileSync(join(ROOT, 'package.json'), 'utf8');
const changelog = readFileSync(join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README 快速上手表 Enter/E 行含「胜利画面/尾声 `E` 同效——v22.85」', readme.includes('胜利画面/尾声 `E` 同效——v22.85'));
ok('README 上手表「胜利画面 Enter/E/P/R」行 + `Enter`/`E` 观看尾声 口径', readme.includes('胜利画面 Enter/E/P/R') && readme.includes('`Enter`/`E` 观看尾声'));
ok('README 旧「胜利画面 Enter/P/R」行零残留', !readme.includes('胜利画面 Enter/P/R | `Enter` 观看尾声'));
ok('README tests 树串尾已延伸至 smoke_v2285_winekey（v2284 后接 v2285）',
  readme.includes('smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc（npm test 串跑）'));
ok('README 件套口径为二百一十五件套（二百一十四件套清除）且旧 180 口径零残留',
  readme.includes('冒烟二百一十五件套（二百一十四件套清除）') && !readme.includes('冒烟一百八十件套（一百七十九件套清' + '除）'));
ok('README 含 v22.85 守护描述（胜利画面/尾声确认 E 键别名守护）', readme.includes('v22.85 起含胜利画面/尾声确认 E 键别名守护'));
ok('README 含 smoke_v2285_winekey 入库（181 份）', readme.includes('smoke_v2285_winekey 入库（181 份）'));
ok('README 仍保留 smoke_v2284_skillekey 入库（180 份）历史口径', readme.includes('smoke_v2284_skillekey 入库（180 份）'));
ok('README 仍保留 v22.84 守护描述（历史口径）', readme.includes('v22.84 起含战斗技能菜单施放 E 键别名守护'));
ok('package.json test 串含 smoke_v2285_winekey.mjs 且位于串尾',
  pkg.includes('node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 181 件套', testChain === 215, String(testChain));
ok('CHANGELOG 含 v22.85 条目（顶 pin）', changelog.startsWith('## v23.79 '));

// 8. 姊妹件套 pin（smoke_v2284 随新现实更新）
const s2284 = readFileSync(join(ROOT, 'tests/smoke_v2284_skillekey.mjs'), 'utf8');
const s2283 = readFileSync(join(ROOT, 'tests/smoke_v2283_menuekey.mjs'), 'utf8');
const s2282 = readFileSync(join(ROOT, 'tests/smoke_v2282_archgate.mjs'), 'utf8');
const s2281 = readFileSync(join(ROOT, 'tests/smoke_v2281_starwell.mjs'), 'utf8');
const s2260 = readFileSync(join(ROOT, 'tests/smoke_v2260_fountripple.mjs'), 'utf8');
ok('smoke_v2284 的 GAME_VERSION 字面量 pin 已更新为 v22.85', s2284.includes("const GAME_VERSION = 'v23.79';"));
ok('smoke_v2284 的 CHANGELOG 顶 pin 已更新为 ## v22.85', s2284.includes("startsWith('## v23.79 '"));
ok('smoke_v2284 的件套 pin 已更新为二百一十五件套（二百一十四件套清除）', s2284.includes('二百一十五件套（二百一十四件套清除）'));
ok('smoke_v2284 的 README 串尾 pin 已延伸至 smoke_v2285_winekey', s2284.includes('smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc（npm test 串跑）'));
ok('smoke_v2284 的 package 串尾 pin 已延伸至 smoke_v2285_winekey', s2284.includes('node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs"'));
ok('smoke_v2283 的 GAME_VERSION 字面量 pin 已更新为 v22.85', s2283.includes("const GAME_VERSION = 'v23.79';"));
ok('smoke_v2283 的 CHANGELOG 顶 pin 已更新为 ## v22.85', s2283.includes("startsWith('## v23.79 '"));
ok('smoke_v2283 的 testChain pin 已更新为 181', s2283.includes('testChain === 215'));
ok('smoke_v2283 的 README 串尾 pin 已延伸至 smoke_v2285_winekey', s2283.includes('smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc（npm test 串跑）'));
ok('smoke_v2283 的 package 串尾 pin 已延伸至 smoke_v2285_winekey', s2283.includes('node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs"'));
ok('smoke_v2282 的 GAME_VERSION 字面量 pin 已更新为 v22.85', s2282.includes("const GAME_VERSION = 'v23.79';"));
ok('smoke_v2282 的 CHANGELOG 顶 pin 已更新为 ## v22.85', s2282.includes("startsWith('## v23.79 '"));
ok('smoke_v2282 的 testChain pin 已更新为 181', s2282.includes('testChain === 215'));
ok('smoke_v2282 的 README 串尾 pin 已延伸至 smoke_v2285_winekey', s2282.includes('smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc（npm test 串跑）'));
ok('smoke_v2281 的 GAME_VERSION 字面量 pin 已更新为 v22.85', s2281.includes("const GAME_VERSION = 'v23.79';"));
ok('smoke_v2260 的 package.json 串尾 pin 已延伸至 smoke_v2285_winekey', s2260.includes('node tests/smoke_v2285_winekey.mjs'));

// 9. 旧代 v22.84 pin 全库零残留
const allTests = readdirSync(join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2285_winekey.mjs');
const stale = [];
for (const f of allTests) {
  const src = readFileSync(join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "84';") || src.includes("GAME_VERSION === 'v22." + "84'") ||
      src.includes('一百八十件套（一百七十九件套清' + '除）') || src.includes('testChain === ' + '180') ||
      src.includes('smoke_v2284_skillekey（npm test ' + '串跑）') || src.includes('_gv[1] >= ' + '84') ||
      src.includes("startsWith('## v22." + "84 '") || src.includes("startsWith('## v22." + "84'")) stale.push(f);
}
ok('旧代 v22.84 字面量/恒等/件套/testChain/串尾/版本锚 pin 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

// 10. 哨兵链（件套守护领先一位）已指向下一版 182 口径
const s2143 = readFileSync(join(ROOT, 'tests/smoke_v2143_talkekey.mjs'), 'utf8');
ok('哨兵链 v2143 已含下一版件套口径（二百一十五件套（二百一十四件套清除））', s2143.includes('二百一十六件套（二百一十五件套清除）'));

console.log(`\n— v22.85 胜利画面/尾声确认 E 键别名冒烟：${pass}/${pass + fail} 通过 —`);
process.exit(fail ? 1 : 0);
