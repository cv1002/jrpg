// smoke_v2283_menuekey.mjs —— v22.83 商店/旅馆/酿造/快速旅行/暂停菜单确认 E 键别名守护
// 承 v21.10-v22.82 冒烟入库先例：版本锚点 + 源级落位 + 数据契约 + 运行期全链路 +
// README/package.json/CHANGELOG 同步 + 姊妹件套 pin + 旧代 v22.82 pin 全库零残留 + 哨兵链领先一位
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

console.log('— v22.83 商店/旅馆/酿造/快速旅行/暂停菜单确认 E 键别名冒烟 —');

// 1. 版本锚点
const dataSrc = readFileSync(join(ROOT, 'js/data.js'), 'utf8');
ok('data.js GAME_VERSION 字面量为 v22.83', dataSrc.includes("const GAME_VERSION = 'v23.17'"));
ok('旧 v22.82 字面量零残留', !dataSrc.includes("const GAME_VERSION = 'v22." + "82';"));
ok('data.js 含 v22.83 版本注释', dataSrc.includes('// v22.83 体验打磨'));
ok('data.js 仍保留 v22.82 历史注释', dataSrc.includes('// v22.82 体验打磨'));

// 2. 源级落位：main.js 五处 onKey E 别名 + KEY 无 'e' 映射
const mainSrc = readFileSync(join(ROOT, 'js/main.js'), 'utf8');
ok('main.js shop.onKey 确认分支含 e/E 别名（Enter/E 同路径 item.act）',
  /if \(e\.key === 'Enter' \|\| e\.key === 'e' \|\| e\.key === 'E'\) \{\n\s+const item = S\.shopList\[S\.shopSel\]/.test(mainSrc));
ok('main.js inn.onKey E 同效 stayInn', mainSrc.includes("if (e.key === 'Enter' || e.key === 'e' || e.key === 'E') stayInn();"));
ok('main.js brew.onKey E 同效 brewNow', mainSrc.includes("if (e.key === 'Enter' || e.key === 'e' || e.key === 'E') brewNow();"));
ok('main.js travel.onKey E 同效 doTravel', mainSrc.includes("if (e.key === 'Enter' || e.key === 'e' || e.key === 'E') doTravel();"));
ok('main.js pause.onKey 确认分支含 e/E 别名', mainSrc.includes("if (e.key !== 'Enter' && e.key !== 'e' && e.key !== 'E') return;"));
ok('main.js 含 v22.83 注释块', mainSrc.includes('// v22.83 菜单确认 E 键别名'));
ok('KEY 移动表无 e/E 映射（不与移动键冲突）', dataSrc.includes("const KEY={ ArrowUp:'U',w:'U',W:'U',ArrowDown:'D',s:'D',S:'D',ArrowLeft:'L',a:'L',A:'L',ArrowRight:'R',d:'R',D:'R' }"));

// 3. 页脚文案口径（menus.js 五处 Enter/E）
const menusSrc = readFileSync(join(ROOT, 'js/view/menus.js'), 'utf8');
ok('drawShop 页脚 Enter/E购买', menusSrc.includes("Enter/E购买"));
ok('drawInn 页脚 [Enter/E] 住宿休息', menusSrc.includes("[Enter/E] 住宿休息"));
ok('drawBrew 页脚 按 Enter/E 酿造', menusSrc.includes("按 Enter/E 酿造"));
ok('drawTravel 页脚 Enter/E 传送', menusSrc.includes("Enter/E 传送"));
ok('drawPause 页脚 Enter/E 确定', menusSrc.includes("Enter/E 确定"));
ok('旧口径「Enter购买」零残留', !menusSrc.includes("Enter购买"));
ok('旧口径「[Enter] 住宿休息」零残留', !menusSrc.includes("[Enter] 住宿休息"));
ok('旧口径「按 Enter 酿造」零残留', !menusSrc.includes("按 Enter 酿造"));
ok('旧口径「Enter 传送」零残留', !menusSrc.includes("Enter 传送"));
ok('旧口径「Enter 确定」零残留', !menusSrc.includes("Enter 确定"));

// 4. 数据契约：H 页「对话 / 确认」行零回归（本就是 Enter/E 口径，逐字未动）
const data = await import(join(ROOT, 'js/data.js'));
const { HELP_PAGES } = data;
ok('操作说明页行数仍 14（零新增行）', HELP_PAGES[0].length === 14);
ok('「对话 / 确认」行 r[1] 逐字零回归（Enter / E（镇民需面对面））',
  String(HELP_PAGES[0][1][1]) === 'Enter / E（镇民需面对面）', String(HELP_PAGES[0][1][1]));
ok('「菜单 / 取消」行零回归（Esc）', String(HELP_PAGES[0][2][1]) === 'Esc（大地图打开菜单，界面内返回）');

// 5. 运行期全链路：DOM/音频/存储桩 + main.js 真实导入 + screens.onKey 逐键驱动
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
const { PAUSE_ITEMS } = await import('../js/view/index.js');
const { TRAVEL_LIST } = await import('../js/data.js');

// 5.1 shop：列表元素 act 被 e/E/Enter 各触发一次（与 Enter 同路径）+ ↑↓ 导航 + Esc 返回零回归
{
  S.scene = 'shop';
  let hits = 0;
  S.shopList = [{ act: () => { hits++; } }, { act: () => {} }];
  S.shopSel = 0;
  screens.shop.onKey({ key: 'e' });
  screens.shop.onKey({ key: 'E' });
  screens.shop.onKey({ key: 'Enter' });
  ok('运行期：shop.onKey 的 e/E/Enter 三键均触发选中项 act（hits=3）', hits === 3, String(hits));
  S.shopSel = 0;
  screens.shop.onKey({ key: 'ArrowDown' });
  ok('运行期：shop.onKey ↑↓ 导航零回归（ArrowDown 后 shopSel=1）', S.shopSel === 1, String(S.shopSel));
  screens.shop.onKey({ key: 'Escape' });
  ok('运行期：shop.onKey Esc 返回 world 零回归', S.scene === 'world', S.scene);
}
// 5.2 inn：E 与 Enter 同行为（贫穷档金币不足拦截分支零抛错、零状态变化）
{
  S.scene = 'inn';
  S.G = { name: '余烬', level: 1, hp: 50, hpMax: 100, mp: 10, mpMax: 10, gold: 0, item: 0, potion2: 0, mushrooms: 0 };
  const before = JSON.stringify([S.G.gold, S.G.hp, S.G.mp]);
  let threw = null;
  try { screens.inn.onKey({ key: 'e' }); screens.inn.onKey({ key: 'E' }); screens.inn.onKey({ key: 'Enter' }); } catch (e) { threw = e; }
  ok('运行期：inn.onKey 的 e/E/Enter 三键零抛错（金币不足拦截分支）', threw === null, threw && threw.message);
  ok('运行期：inn 三键后状态零变化（gold/hp/mp 逐值不变）', JSON.stringify([S.G.gold, S.G.hp, S.G.mp]) === before);
  screens.inn.onKey({ key: 'Escape' });
  ok('运行期：inn.onKey Esc 返回 world 零回归', S.scene === 'world', S.scene);
}
// 5.3 brew：E 与 Enter 同行为（材料不足拦截分支零抛错、零状态变化）
{
  S.scene = 'brew';
  S.G = { name: '余烬', level: 1, hp: 50, hpMax: 100, mp: 10, mpMax: 10, gold: 0, item: 0, potion2: 0, mushrooms: 0 };
  const before = JSON.stringify([S.G.mushrooms, S.G.gold, S.G.potion2]);
  let threw = null;
  try { screens.brew.onKey({ key: 'e' }); screens.brew.onKey({ key: 'E' }); screens.brew.onKey({ key: 'Enter' }); } catch (e) { threw = e; }
  ok('运行期：brew.onKey 的 e/E/Enter 三键零抛错（材料不足拦截分支）', threw === null, threw && threw.message);
  ok('运行期：brew 三键后状态零变化（mushrooms/gold/potion2 逐值不变）', JSON.stringify([S.G.mushrooms, S.G.gold, S.G.potion2]) === before);
  screens.brew.onKey({ key: 'Escape' });
  ok('运行期：brew.onKey Esc 返回 world 零回归', S.scene === 'world', S.scene);
}
// 5.4 travel：E 与 Enter 同行为（当前所在地拦截分支零抛错、目的地零变化）
{
  S.scene = 'travel';
  const cur = TRAVEL_LIST.findIndex((x) => x[0] === 'village');
  S.travelSel = cur >= 0 ? cur : 0;
  S.G = { name: '余烬', level: 1, hp: 50, hpMax: 100, mp: 10, mpMax: 10, gold: 0, visited: ['village'] };
  const mapBefore = S.map;
  let threw = null;
  try { screens.travel.onKey({ key: 'e' }); screens.travel.onKey({ key: 'E' }); screens.travel.onKey({ key: 'Enter' }); } catch (e) { threw = e; }
  ok('运行期：travel.onKey 的 e/E/Enter 三键零抛错（当前所在地拦截分支）', threw === null, threw && threw.message);
  ok('运行期：travel 三键后当前地图零变化（未触发 transition）', S.map === mapBefore);
  screens.travel.onKey({ key: 'Escape' });
  ok('运行期：travel.onKey Esc 返回 world 零回归', S.scene === 'world', S.scene);
}
// 5.5 pause：E 同效确认（resume → goto world）+ ↑↓ 导航零回归
{
  S.scene = 'pause';
  const resumeIdx = PAUSE_ITEMS.findIndex((x) => x && x.id === 'resume');
  ok('PAUSE_ITEMS 含 resume 项（测试前提）', resumeIdx >= 0, String(resumeIdx));
  S.pauseSel = resumeIdx;
  screens.pause.onKey({ key: 'e' });
  ok('运行期：pause.onKey 按 e 确认 resume → 回 world', S.scene === 'world', S.scene);
  S.scene = 'pause';
  S.pauseSel = resumeIdx;
  screens.pause.onKey({ key: 'E' });
  ok('运行期：pause.onKey 按 E 确认 resume → 回 world（与 Enter 同路径）', S.scene === 'world', S.scene);
  S.scene = 'pause';
  screens.pause.onKey({ key: 'ArrowDown' });
  ok('运行期：pause.onKey ↑↓ 导航零回归（ArrowDown 后 pauseSel 变化）',
    S.pauseSel !== resumeIdx || PAUSE_ITEMS.length === 1, String(S.pauseSel));
  screens.pause.onKey({ key: 'Escape' });
  ok('运行期：pause.onKey Esc 返回 world 零回归', S.scene === 'world', S.scene);
}

// 6. README / package.json / CHANGELOG 同步
const readme = readFileSync(join(ROOT, 'README.md'), 'utf8');
const pkg = readFileSync(join(ROOT, 'package.json'), 'utf8');
const changelog = readFileSync(join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README 快速上手表 Enter/E 行含「界面内 `E` 同效确认——v22.83」', readme.includes('界面内 `E` 同效确认——v22.83'));
ok('README tests 树串尾已延伸至 smoke_v2284_skillekey（v2283 后接 v2284）',
  readme.includes('smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 件套口径为二百一十二件套（二百一十一件套清除）且旧 179 口径零残留',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟一百七十九件套（一百七十八件套清' + '除）'));
ok('README 含 v22.83 守护描述（菜单确认 E 键别名守护）', readme.includes('v22.83 起含商店/旅馆/酿造/快速旅行/暂停菜单确认 E 键别名守护'));
ok('README 含 smoke_v2283_menuekey 入库（179 份）', readme.includes('smoke_v2283_menuekey 入库（179 份）'));
ok('README 仍保留 smoke_v2282_archgate 入库（178 份）历史口径', readme.includes('smoke_v2282_archgate 入库（178 份）'));
ok('README 仍保留 v22.82 守护描述（历史口径）', readme.includes('v22.82 起含帮助页地图指南无字回廊行「名字之门」指针守护'));
ok('package.json test 串含 smoke_v2284_skillekey.mjs 且位于串尾',
  pkg.includes('node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 179 件套', testChain === 212, String(testChain));
ok('CHANGELOG 含 v22.84 条目（顶 pin）', changelog.startsWith('## v23.16 '));

// 7. 姊妹件套 pin（smoke_v2282_archgate 随新现实更新）
const s2282 = readFileSync(join(ROOT, 'tests/smoke_v2282_archgate.mjs'), 'utf8');
const s2281 = readFileSync(join(ROOT, 'tests/smoke_v2281_starwell.mjs'), 'utf8');
const s2260 = readFileSync(join(ROOT, 'tests/smoke_v2260_fountripple.mjs'), 'utf8');
ok('smoke_v2282 的 GAME_VERSION 字面量 pin 已更新为 v22.83', s2282.includes("const GAME_VERSION = 'v23.17';"));
ok('smoke_v2282 的 CHANGELOG 顶 pin 已更新为 ## v22.83', s2282.includes("startsWith('## v23.16'"));
ok('smoke_v2282 的件套 pin 已更新为二百一十二件套（二百一十一件套清除）', s2282.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2282 的 README 串尾 pin 已延伸至 smoke_v2284_skillekey', s2282.includes('smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2282 的 package 串尾 pin 已延伸至 smoke_v2284_skillekey', s2282.includes('node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
ok('smoke_v2281 的 GAME_VERSION 字面量 pin 已更新为 v22.83', s2281.includes("const GAME_VERSION = 'v23.17';"));
ok('smoke_v2281 的 CHANGELOG 顶 pin 已更新为 ## v22.83', s2281.includes("startsWith('## v23.16 '"));
ok('smoke_v2281 的 testChain pin 已更新为 179', s2281.includes('testChain === 212'));
ok('smoke_v2281 的 README 串尾 pin 已延伸至 smoke_v2284_skillekey', s2281.includes('smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2260 的 package.json 串尾 pin 已延伸至 smoke_v2284_skillekey', s2260.includes('node tests/smoke_v2284_skillekey.mjs'));

// 8. 旧代 v22.82 pin 全库零残留
const allTests = readdirSync(join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2283_menuekey.mjs');
const stale = [];
for (const f of allTests) {
  const src = readFileSync(join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "83';") || src.includes("GAME_VERSION === 'v22." + "83'") ||
      src.includes('一百七十九件套（一百七十八件套清' + '除）') || src.includes('testChain === ' + '179') ||
      src.includes('smoke_v2283_menuekey（npm test ' + '串跑）') || src.includes('_gv[1] >= ' + '83') ||
      src.includes("startsWith('## v22." + "83 '")) stale.push(f);
}
ok('旧代 v22.83 字面量/恒等/件套/testChain/串尾/版本锚 pin 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

// 9. 哨兵链（件套守护领先一位）已指向下一版 181 口径
const s2143 = readFileSync(join(ROOT, 'tests/smoke_v2143_talkekey.mjs'), 'utf8');
ok('哨兵链 v2143 已含下一版件套口径（二百一十二件套（二百一十一件套清除））', s2143.includes('二百一十三件套（二百一十二件套清除）'));

console.log(`\n— v22.83 商店/旅馆/酿造/快速旅行/暂停菜单确认 E 键别名冒烟：${pass}/${pass + fail} 通过 —`);
process.exit(fail ? 1 : 0);
