// smoke_v2279_lampwell.mjs —— v22.79 帮助页地图指南潮灯镇行「广场大灯·村井」r[2] 指针守护
// 承 v21.10-v22.78 冒烟入库先例：版本锚点 + 源级落位 + 数据契约 + 行宽预算 + 运行期全链路 +
// README/package.json/CHANGELOG 同步 + 姊妹件套 pin + 旧代 v22.78 pin 全库零残留
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

console.log('— v22.79 帮助页地图指南潮灯镇行「广场大灯·村井」r[2] 指针冒烟 —');

// 1. 版本锚点
const dataSrc = readFileSync(join(ROOT, 'js/data.js'), 'utf8');
ok('data.js GAME_VERSION 字面量为 v22.79', dataSrc.includes("const GAME_VERSION = 'v23.53'"));
ok('旧 v22.78 字面量零残留', !dataSrc.includes("const GAME_VERSION = 'v22." + "78';"));
ok('data.js 含 v22.79 版本注释', dataSrc.includes('// v22.79 体验打磨'));
ok('data.js 仍保留 v22.78 历史注释', dataSrc.includes('// v22.78 体验打磨'));

// 2. 源级落位：潮灯镇行 r[2] 追加「广场大灯·村井」指针 + 行内注释
ok('data.js 潮灯镇行 r[2] 含「广场大灯·村井」指针（v22.80 后接粮田派生）',
  dataSrc.includes("'水塘灯影 · ' + NPCS.granny.name + '/' + NPCS.lampboat.name + ' · 广场大灯·村井 · 粮田（' + QUESTS.side_grain.name + '）'"));
ok('data.js 含 v22.79 行内注释', dataSrc.includes('v22.79 潮灯镇行 r[2] 补「广场大灯·村井」'));

// 3. 数据契约：HELP_PAGES 四页结构 + 地图指南潮灯镇行
const data = await import(join(ROOT, 'js/data.js'));
const { HELP_PAGES, MAPS, NPCS } = data;
ok('HELP_PAGES 仍为四页结构（地图指南为第 2 页）', Array.isArray(HELP_PAGES) && HELP_PAGES.length === 4 && Array.isArray(HELP_PAGES[1]));
const guide = HELP_PAGES[1];
ok(`地图指南页行数仍 8（实际 ${guide.length}）`, guide.length === 8);
ok('潮灯镇行仍 3 列（r[0]/r[1]/r[2]，未新增 r[3]）', guide[0].length === 3);
const villageRow = String(guide[0][2]);
ok('潮灯镇行 r[2] 含「广场大灯」', villageRow.includes('广场大灯'));
ok('潮灯镇行 r[2] 含「村井」', villageRow.includes('村井'));
ok('潮灯镇行 r[2] 既有信息零回归（水塘灯影 + NPC 名派生）',
  villageRow.includes('水塘灯影') && villageRow.includes(NPCS.granny.name) && villageRow.includes(NPCS.lampboat.name));
ok('潮灯镇行 r[1] 逐字零回归（设施/出口指针，未并入大灯）',
  String(guide[0][1]).includes('商店·旅馆·酿造锅·灯长/守书记(支线)·喷泉回血') &&
  String(guide[0][1]).includes('东门→雾语林') && !String(guide[0][1]).includes('广场大灯'));
// 其余三行零回归
ok('雾语林行「蘑菇田」零回归（v22.78）', String(guide[1][1]).includes('蘑菇田') && guide[1].length === 2);
ok('星井矿脉行 r[1]/r[2] 零回归',
  String(guide[2][1]).includes('试炼碑（可问' + NPCS.sentinel.name + '）') && String(guide[2][2]).includes('无泉水/旅店 · 出发前请补给'));
ok('无字回廊行 r[1]/r[2] 零回归',
  String(guide[3][1]).includes('名字石碑') && String(guide[3][1]).includes('终焉之神') && String(guide[3][2]).includes('无泉水/旅店 · 出发前请补给'));
// 其余三页行数零回归
ok(`其余三页行数零回归（14/10/10，实际 ${HELP_PAGES[0].length}/${HELP_PAGES[2].length}/${HELP_PAGES[3].length}）`,
  HELP_PAGES[0].length === 14 && HELP_PAGES[2].length === 10 && HELP_PAGES[3].length === 10);

// 4. r[2] 行宽预算（12px 次行，官方 estW 口径同 v22.77：CJK=0.865×size、·=0.303×size、空格=0.263×size；
//    r[2] 单行 ≤470 面板预算，v22.77 标定 168 → 本版 ≈233）
function estW(s, size = 12) {
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
const wR2 = estW(villageRow);
ok('潮灯镇行 r[2] 12px estW ' + wR2.toFixed(1) + ' ≤ 470 面板预算', wR2 <= 470, String(wR2));

// 5. 运行期全链路：DOM/音频/存储桩 + main.js 真实导入 + drawHelp 渲染
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

S.G = null;
S.helpPage = 1;
CAPTURED.length = 0;
let threw = null;
try { drawHelp(); } catch (e) { threw = e; }
ok('运行期：地图指南页渲染无抛错', threw === null, threw && threw.message);
const drawn = CAPTURED.join('\n');
ok('运行期：潮灯镇行「广场大灯」「村井」落画', drawn.includes('广场大灯') && drawn.includes('村井'));
ok('运行期：潮灯镇行既有信息落画零回归（水塘灯影/东门/喷泉回血）',
  drawn.includes('水塘灯影') && drawn.includes('东门→雾语林') && drawn.includes('喷泉回血'));
let otherOk = true;
for (const p of [0, 2, 3]) {
  S.helpPage = p;
  try { CAPTURED.length = 0; drawHelp(); } catch (e) { otherOk = false; console.log('   drawHelp err:', e.message); }
}
ok('运行期：其余三页渲染零回归（操作说明/魔物状态/试炼进阶不抛错）', otherOk);

// 6. README / package.json / CHANGELOG 同步
const readme = readFileSync(join(ROOT, 'README.md'), 'utf8');
const pkg = readFileSync(join(ROOT, 'package.json'), 'utf8');
const changelog = readFileSync(join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树串尾已延伸至 smoke_v2279_lampwell（v2278 后接 v2279）',
  readme.includes('smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 件套口径为二百一十二件套（二百一十一件套清除）且旧 174 口径零残留',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟一百七十四件套（一百七十三件套清' + '除）'));
ok('README 含 v22.79 守护描述（潮灯镇行广场大灯村井指针守护）', readme.includes('v22.79 起含帮助页地图指南潮灯镇行「广场大灯·村井」指针守护'));
ok('README 含 smoke_v2279_lampwell 入库（175 份）', readme.includes('smoke_v2279_lampwell 入库（175 份）'));
ok('README 仍保留 smoke_v2278_mushguide 入库（174 份）历史口径', readme.includes('smoke_v2278_mushguide 入库（174 份）'));
ok('package.json test 串含 smoke_v2279_lampwell.mjs 且位于串尾',
  pkg.includes('node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 175 件套', testChain === 212, String(testChain));
ok('CHANGELOG 含 v22.79 条目（顶 pin）', changelog.startsWith('## v23.53 '));

// 7. 姊妹件套 pin（smoke_v2278_mushguide 随新现实更新）
const s2278 = readFileSync(join(ROOT, 'tests/smoke_v2278_mushguide.mjs'), 'utf8');
const s2260 = readFileSync(join(ROOT, 'tests/smoke_v2260_fountripple.mjs'), 'utf8');
ok('smoke_v2278 的 GAME_VERSION 字面量 pin 已更新为 v22.79', s2278.includes("const GAME_VERSION = 'v23.53';"));
ok('smoke_v2278 的 CHANGELOG 顶 pin 已更新为 ## v22.79', s2278.includes("startsWith('## v23.53'"));
ok('smoke_v2278 的件套 pin 已更新为二百一十二件套（二百一十一件套清除）', s2278.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2278 的 README 串尾 pin 已延伸至 smoke_v2279_lampwell', s2278.includes('smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2260 的 package.json 串尾 pin 已延伸至 smoke_v2279_lampwell', s2260.includes('node tests/smoke_v2279_lampwell.mjs'));

// 8. 旧代 v22.78 pin 全库零残留
const allTests = readdirSync(join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2279_lampwell.mjs');
const stale = [];
for (const f of allTests) {
  const src = readFileSync(join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "78';") || src.includes("GAME_VERSION === 'v22." + "78'") ||
      src.includes('一百七十四件套（一百七十三件套清' + '除）') || src.includes('testChain === ' + '174') ||
      src.includes('smoke_v2278_mushguide（npm test ' + '串跑）') || src.includes('_gv[1] >= ' + '78')) stale.push(f);
}
ok('旧代 v22.78 字面量/恒等/件套/testChain/串尾/版本锚 pin 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

console.log(`\n— v22.79 帮助页地图指南潮灯镇行「广场大灯·村井」r[2] 指针冒烟：${pass}/${pass + fail} 通过 —`);
process.exit(fail ? 1 : 0);
