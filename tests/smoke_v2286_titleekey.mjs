// smoke_v2286_titleekey.mjs —— v22.86 标题页/创建页开始键 E 键别名守护
// 承 v21.10-v22.85 冒烟入库先例：版本锚点 + 源级落位 + 页脚口径 + 数据契约 + 行宽预算 + 运行期全链路 +
// README/package.json/CHANGELOG 同步 + 姊妹件套 pin + 旧代 v22.85 pin 全库零残留 + 哨兵链领先一位
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

console.log('— v22.86 标题页/创建页开始键 E 键别名冒烟 —');

// 1. 版本锚点
const dataSrc = readFileSync(join(ROOT, 'js/data.js'), 'utf8');
ok('data.js GAME_VERSION 字面量为 v22.86', dataSrc.includes("const GAME_VERSION = 'v23.99'"));
ok('旧 v22.85 字面量零残留', !dataSrc.includes("const GAME_VERSION = 'v22." + "85';"));
ok('data.js 含 v22.86 版本注释', dataSrc.includes('// v22.86 体验打磨·标题页/创建页开始键补 E 键别名'));
ok('data.js 仍保留 v22.85 历史注释', dataSrc.includes('// v22.85 体验打磨·胜利画面/尾声确认补 E 键别名'));

// 2. 源级落位：main.js title.onKey/create.onKey e/E 别名 + 旧单 Enter 分支零残留 + KEY 无 'e' 映射
const mainSrc = readFileSync(join(ROOT, 'js/main.js'), 'utf8');
ok('main.js title.onKey 开始新冒险 e/E/Enter 同条件', mainSrc.includes("else if (e.key === 'Enter' || e.key === 'e' || e.key === 'E') { ac(); SFX.select(); goto('create'); }"));
ok('main.js create.onKey 出发 e/E/Enter 同条件', mainSrc.includes("} else if (e.key === 'Enter' || e.key === 'e' || e.key === 'E') {") && mainSrc.includes('beginAdventure();'));
ok('main.js 旧「title 单 Enter」分支零残留', !mainSrc.includes("else if (e.key === 'Enter') { ac(); SFX.select(); goto('create'); }"));
ok('main.js 旧「create 单 Enter」分支零残留', !mainSrc.includes("} else if (e.key === 'Enter') {") || mainSrc.includes("e.key === 'Enter' || e.key === 'e'"));
ok('main.js 含 v22.86 注释块（标题页）', mainSrc.includes('// v22.86 标题页「按 Enter 开始新的冒险」补 E 键别名'));
ok('main.js 含 v22.86 注释块（创建页）', mainSrc.includes('// v22.86 创建页「Enter 出发！」补 E 键别名'));
ok('KEY 移动表无 e/E 映射（不与移动键冲突）', dataSrc.includes("const KEY={ ArrowUp:'U',w:'U',W:'U',ArrowDown:'D',s:'D',S:'D',ArrowLeft:'L',a:'L',A:'L',ArrowRight:'R',d:'R',D:'R' }"));

// 3. 页脚口径（menus.js drawTitle/drawCreate）
const mSrc = readFileSync(join(ROOT, 'js/view/menus.js'), 'utf8');
ok('drawTitle 页脚 按 Enter/E 开始新的冒险', mSrc.includes("CTX.font='bold 18px sans-serif'; CTX.fillText('按 Enter/E 开始新的冒险',CV.width/2,300);"));
ok('drawCreate 页脚 Enter/E 出发', mSrc.includes("CTX.fillText('← → 选择姓名     ↑ ↓ 选择难度    Enter/E 出发！    Esc 返回',CV.width/2,432);"));
ok('drawTitle 旧口径「按 Enter 开始新的冒险」零残留', !mSrc.includes("fillText('按 Enter 开始新的冒险'"));
ok('drawCreate 旧口径「Enter 出发！」零残留', !mSrc.includes("Enter 出发！"));
ok('menus.js 含 v22.86 注释块（drawTitle）', mSrc.includes('// v22.86 页脚口径同步：title.onKey 开始新冒险补 E 键别名'));
ok('menus.js 含 v22.86 注释块（drawCreate）', mSrc.includes('// v22.86 页脚口径同步：create.onKey 出发补 E 键别名'));
ok('drawTitle 仍保留槽位/读档/P 口径（v21.79/v21.33/v22.28 零回归）', mSrc.includes('按 L 读取当前槽存档') && mSrc.includes('按 P 存档'));
ok('drawCreate 仍保留 Esc 返回口径（v21.42 零回归）', mSrc.includes('Esc 返回'));

// 4. 数据契约
const data = await import(join(ROOT, 'js/data.js'));
const { GAME_VERSION } = data;
ok('GAME_VERSION 导出恒等于 v22.86', GAME_VERSION === 'v23.99', GAME_VERSION);

// 5. 行宽预算：drawTitle 页脚 18px ≤640 画布、drawCreate 页脚 13px ≤640 画布
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
const wTitle = estW('按 Enter/E 开始新的冒险', 18);
ok('drawTitle 页脚（18px）估算宽 ≤640 画布预算', wTitle <= 640, `≈${wTitle.toFixed(1)}`);
const wCreate = estW('← → 选择姓名     ↑ ↓ 选择难度    Enter/E 出发！    Esc 返回', 13);
ok('drawCreate 页脚（13px）估算宽 ≤640 画布预算', wCreate <= 640, `≈${wCreate.toFixed(1)}`);

// 6. 运行期全链路：DOM/音频/存储桩 + main.js 真实导入 + title/create.onKey 逐键驱动
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

// 6.1 title.onKey 的 e/E/Enter 三键均进创建页（与 Enter 同路径 goto('create')）
for (const k of ['e', 'E', 'Enter']) {
  S.scene = 'title';
  S.titleResetArm = 0;
  S.slotDeleteArm = 0;
  let threw = null;
  try { screens.title.onKey({ key: k }); } catch (e) { threw = e; }
  ok(`运行期：title.onKey 按 ${k === 'Enter' ? 'Enter' : k} 进创建页（scene=create）`,
    threw === null && S.scene === 'create', threw && threw.message, String(S.scene));
}
// 6.2 create.onKey 的 e/E/Enter 三键均出发（beginAdventure → scene=story + unsaved 置脏）
for (const k of ['e', 'E', 'Enter']) {
  S.scene = 'create';
  let threw = null;
  try { screens.create.onKey({ key: k }); } catch (e) { threw = e; }
  ok(`运行期：create.onKey 按 ${k === 'Enter' ? 'Enter' : k} 出发（scene=story）`,
    threw === null && S.scene === 'story', threw && threw.message, String(S.scene));
}
// 6.3 无关键零回归：title 上按无关键停留 title，不误入 create
{
  S.scene = 'title';
  S.titleResetArm = 0;
  screens.title.onKey({ key: 'x' });
  ok('运行期：title.onKey 按无关键停留 title（不误入创建页）', S.scene === 'title', String(S.scene));
}
// 6.4 标题非 R/X 键解武装零回归：E 属非 R 键、先解 titleResetArm 再进创建页
{
  S.scene = 'title';
  S.titleResetArm = 1;
  screens.title.onKey({ key: 'e' });
  ok('运行期：title.onKey 按 e 时 titleResetArm 解武装为 0（非 R 键口径零回归）且进创建页',
    S.titleResetArm === 0 && S.scene === 'create', String(S.titleResetArm) + '/' + String(S.scene));
}
// 6.5 创建页选名/选难/选 Esc 零回归（v21.42 Esc 返回；方向键选名选难）
{
  S.scene = 'create';
  S.createName = 0; S.createDiff = 0;
  screens.create.onKey({ key: 'ArrowRight' });
  ok('运行期：create.onKey ArrowRight 选名零回归', S.createName === 1 && S.scene === 'create', String(S.createName));
  screens.create.onKey({ key: 'ArrowDown' });
  ok('运行期：create.onKey ArrowDown 选难零回归', S.createDiff === 1 && S.scene === 'create', String(S.createDiff));
  screens.create.onKey({ key: 'Escape' });
  ok('运行期：create.onKey Esc 返回标题零回归（v21.42）', S.scene === 'title', String(S.scene));
}
// 6.6 title.onKey 选槽/读档分支零回归（数字键/左箭头分派仍走原路径）
{
  S.scene = 'title';
  S.curSaveSlot = 1;
  screens.title.onKey({ key: '2' });
  ok('运行期：title.onKey 数字键选槽零回归', S.curSaveSlot === 2 && S.scene === 'title', String(S.curSaveSlot));
}

// 7. README / package.json / CHANGELOG 同步
const readme = readFileSync(join(ROOT, 'README.md'), 'utf8');
const pkg = readFileSync(join(ROOT, 'package.json'), 'utf8');
const changelog = readFileSync(join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README 快速上手表标题行含「`Enter`/`E` 开始新冒险（v22.86」', readme.includes('`Enter`/`E` 开始新冒险（v22.86'));
ok('README 快速上手表创建页行含「`Enter`/`E` 出发开始冒险（v22.86」', readme.includes('`Enter`/`E` 出发开始冒险（v22.86'));
ok('README 快速上手表创建页行旧「`Enter` 出发开始冒险」零残留', !readme.includes('`Enter` 出发开始冒险'));
ok('README tests 树串尾已延伸至 smoke_v2286_titleekey（v2285 后接 v2286）',
  readme.includes('smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula（npm test 串跑）'));
ok('README 件套口径为二百二十三件套（二百二十二件套清除）且旧 181 口径零残留',
  readme.includes('冒烟二百二十三件套（二百二十二件套清除）') && !readme.includes('冒烟一百八十一件套（一百八十件套清' + '除）'));
ok('README 含 v22.86 守护描述（标题页/创建页开始键 E 键别名守护）', readme.includes('v22.86 起含标题页/创建页开始键 E 键别名守护'));
ok('README 含 smoke_v2286_titleekey 入库（182 份）', readme.includes('smoke_v2286_titleekey 入库（182 份）'));
ok('README 仍保留 smoke_v2285_winekey 入库（181 份）历史口径', readme.includes('smoke_v2285_winekey 入库（181 份）'));
ok('README 仍保留 v22.85 守护描述（历史口径）', readme.includes('v22.85 起含胜利画面/尾声确认 E 键别名守护'));
ok('package.json test 串含 smoke_v2286_titleekey.mjs 且位于串尾',
  pkg.includes('node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs && node tests/smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs && node tests/smoke_v2395_shopscroll.mjs && node tests/smoke_v2396_steelarmor.mjs && node tests/smoke_v2397_baserow.mjs && node tests/smoke_v2398_econrow.mjs && node tests/smoke_v2399_dmgformula.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 182 件套', testChain === 223, String(testChain));
ok('CHANGELOG 含 v22.86 条目（顶 pin）', changelog.startsWith('## v23.99 '));

// 8. 姊妹件套 pin（smoke_v2285 随新现实更新）
const s2285 = readFileSync(join(ROOT, 'tests/smoke_v2285_winekey.mjs'), 'utf8');
const s2284 = readFileSync(join(ROOT, 'tests/smoke_v2284_skillekey.mjs'), 'utf8');
const s2283 = readFileSync(join(ROOT, 'tests/smoke_v2283_menuekey.mjs'), 'utf8');
const s2282 = readFileSync(join(ROOT, 'tests/smoke_v2282_archgate.mjs'), 'utf8');
const s2281 = readFileSync(join(ROOT, 'tests/smoke_v2281_starwell.mjs'), 'utf8');
const s2260 = readFileSync(join(ROOT, 'tests/smoke_v2260_fountripple.mjs'), 'utf8');
ok('smoke_v2285 的 GAME_VERSION 字面量 pin 已更新为 v22.86', s2285.includes("const GAME_VERSION = 'v23.99';"));
ok('smoke_v2285 的 CHANGELOG 顶 pin 已更新为 ## v22.86', s2285.includes("startsWith('## v23.99 '"));
ok('smoke_v2285 的件套 pin 已更新为二百二十三件套（二百二十二件套清除）', s2285.includes('二百二十三件套（二百二十二件套清除）'));
ok('smoke_v2285 的 README 串尾 pin 已延伸至 smoke_v2286_titleekey', s2285.includes('smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula（npm test 串跑）'));
ok('smoke_v2285 的 package 串尾 pin 已延伸至 smoke_v2286_titleekey', s2285.includes('node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs && node tests/smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs && node tests/smoke_v2395_shopscroll.mjs && node tests/smoke_v2396_steelarmor.mjs && node tests/smoke_v2397_baserow.mjs && node tests/smoke_v2398_econrow.mjs && node tests/smoke_v2399_dmgformula.mjs"'));
ok('smoke_v2284 的 GAME_VERSION 字面量 pin 已更新为 v22.86', s2284.includes("const GAME_VERSION = 'v23.99';"));
ok('smoke_v2284 的 CHANGELOG 顶 pin 已更新为 ## v22.86', s2284.includes("startsWith('## v23.99 '"));
ok('smoke_v2284 的件套 pin 已更新为二百二十三件套（二百二十二件套清除）', s2284.includes('二百二十三件套（二百二十二件套清除）'));
ok('smoke_v2284 的 README 串尾 pin 已延伸至 smoke_v2286_titleekey', s2284.includes('smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula（npm test 串跑）'));
ok('smoke_v2284 的 package 串尾 pin 已延伸至 smoke_v2286_titleekey', s2284.includes('node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs && node tests/smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs && node tests/smoke_v2395_shopscroll.mjs && node tests/smoke_v2396_steelarmor.mjs && node tests/smoke_v2397_baserow.mjs && node tests/smoke_v2398_econrow.mjs && node tests/smoke_v2399_dmgformula.mjs"'));
ok('smoke_v2283 的 GAME_VERSION 字面量 pin 已更新为 v22.86', s2283.includes("const GAME_VERSION = 'v23.99';"));
ok('smoke_v2283 的 CHANGELOG 顶 pin 已更新为 ## v22.86', s2283.includes("startsWith('## v23.99 '"));
ok('smoke_v2283 的 testChain pin 已更新为 182', s2283.includes('testChain === 223'));
ok('smoke_v2283 的 README 串尾 pin 已延伸至 smoke_v2286_titleekey', s2283.includes('smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula（npm test 串跑）'));
ok('smoke_v2283 的 package 串尾 pin 已延伸至 smoke_v2286_titleekey', s2283.includes('node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs && node tests/smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs && node tests/smoke_v2395_shopscroll.mjs && node tests/smoke_v2396_steelarmor.mjs && node tests/smoke_v2397_baserow.mjs && node tests/smoke_v2398_econrow.mjs && node tests/smoke_v2399_dmgformula.mjs"'));
ok('smoke_v2282 的 GAME_VERSION 字面量 pin 已更新为 v22.86', s2282.includes("const GAME_VERSION = 'v23.99';"));
ok('smoke_v2282 的 CHANGELOG 顶 pin 已更新为 ## v22.86', s2282.includes("startsWith('## v23.99 '"));
ok('smoke_v2282 的 testChain pin 已更新为 182', s2282.includes('testChain === 223'));
ok('smoke_v2282 的 README 串尾 pin 已延伸至 smoke_v2286_titleekey', s2282.includes('smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula（npm test 串跑）'));
ok('smoke_v2281 的 GAME_VERSION 字面量 pin 已更新为 v22.86', s2281.includes("const GAME_VERSION = 'v23.99';"));
ok('smoke_v2260 的 package.json 串尾 pin 已延伸至 smoke_v2286_titleekey', s2260.includes('node tests/smoke_v2286_titleekey.mjs'));

// 9. 旧代 v22.85 pin 全库零残留
const allTests = readdirSync(join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2286_titleekey.mjs');
const stale = [];
for (const f of allTests) {
  const src = readFileSync(join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "85';") || src.includes("GAME_VERSION === 'v22." + "85'") ||
      src.includes('一百八十一件套（一百八十件套清' + '除）') || src.includes('testChain === ' + '181') ||
      src.includes('smoke_v2285_winekey（npm test ' + '串跑）') || src.includes('_gv[1] >= ' + '85') ||
      src.includes("startsWith('## v22." + "85 '") || src.includes("startsWith('## v22." + "85'")) stale.push(f);
}
ok('旧代 v22.85 字面量/恒等/件套/testChain/串尾/版本锚 pin 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

// 10. 哨兵链（件套守护领先一位）已指向下一版 183 口径
const s2143 = readFileSync(join(ROOT, 'tests/smoke_v2143_talkekey.mjs'), 'utf8');
ok('哨兵链 v2143 已含下一版件套口径（二百二十三件套（二百二十二件套清除））', s2143.includes('二百二十四件套（二百二十三件套清除）'));

console.log(`\n— v22.86 标题页/创建页开始键 E 键别名冒烟：${pass}/${pass + fail} 通过 —`);
process.exit(fail ? 1 : 0);
