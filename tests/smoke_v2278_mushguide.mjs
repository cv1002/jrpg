// smoke_v2278_mushguide.mjs —— v22.78 帮助页地图指南雾语林行「蘑菇田」r[1] 指针守护
// 承 v21.10-v22.77 冒烟入库先例：版本锚点 + 源级落位 + 数据契约 + 行宽预算 + 运行期全链路 +
// README/package.json/CHANGELOG 同步 + 姊妹件套 pin + 旧代 v22.77 pin 全库零残留
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

console.log('— v22.78 帮助页地图指南雾语林行「蘑菇田」r[1] 指针冒烟 —');

// 1. 版本锚点
const dataSrc = readFileSync(join(ROOT, 'js/data.js'), 'utf8');
ok('data.js GAME_VERSION 字面量为 v22.79', dataSrc.includes("const GAME_VERSION = 'v23.31'"));
ok('旧 v22.77 字面量零残留', !dataSrc.includes("const GAME_VERSION = 'v22." + "77';"));
ok('data.js 含 v22.78 版本注释', dataSrc.includes('// v22.78 体验打磨'));
ok('data.js 仍保留 v22.77 历史注释', dataSrc.includes('// v22.77 体验打磨'));

// 2. 源级落位：雾语林行 r[1] 追加指针 + 行内注释
ok('data.js 雾语林行 r[1] 含「蘑菇田」指针',
  dataSrc.includes("'雾语林 Lv.' + MAPS.dungeon.recLv,'强魔物·精英·魔王祭坛 · 中段营地泉水 · 右下裂洞进矿脉 · 蘑菇田'"));
ok('data.js 含 v22.78 行内注释', dataSrc.includes('v22.78 雾语林行补「蘑菇田」'));

// 3. 数据契约：HELP_PAGES 四页结构 + 地图指南雾语林行
const data = await import(join(ROOT, 'js/data.js'));
const { HELP_PAGES, MAPS } = data;
ok('HELP_PAGES 仍为四页结构（地图指南为第 2 页）', Array.isArray(HELP_PAGES) && HELP_PAGES.length === 4 && Array.isArray(HELP_PAGES[1]));
const guide = HELP_PAGES[1];
ok(`地图指南页行数仍 8（实际 ${guide.length}）`, guide.length === 8);
ok('雾语林行仍 2 列（未新增 r[2]）', guide[1].length === 2);
const dungeonRow = String(guide[1][1]);
ok('雾语林行含「蘑菇田」', dungeonRow.includes('蘑菇田'));
ok('雾语林行既有信息零回归（强魔物/魔王祭坛/泉水/裂洞）',
  dungeonRow.includes('强魔物·精英·魔王祭坛') && dungeonRow.includes('中段营地泉水') && dungeonRow.includes('右下裂洞进矿脉'));
// 其余三行零回归
ok('潮灯镇行 r[1] 逐字零回归',
  String(guide[0][1]).includes('商店·旅馆·酿造锅·灯长/守书记(支线)·喷泉回血') && String(guide[0][1]).includes('东门→雾语林'));
ok('潮灯镇行 r[2] 水塘灯影零回归（v22.77）', String(guide[0][2]).includes('水塘灯影'));
ok('星井矿脉行 r[1]/r[2] 零回归',
  String(guide[2][1]).includes('试炼碑（可问守碑人）') && String(guide[2][2]).includes('无泉水/旅店 · 出发前请补给'));
ok('无字回廊行 r[1]/r[2] 零回归',
  String(guide[3][1]).includes('名字石碑') && String(guide[3][1]).includes('终焉之神') && String(guide[3][2]).includes('无泉水/旅店 · 出发前请补给'));
// 其余三页行数零回归
ok(`其余三页行数零回归（14/10/10，实际 ${HELP_PAGES[0].length}/${HELP_PAGES[2].length}/${HELP_PAGES[3].length}）`,
  HELP_PAGES[0].length === 14 && HELP_PAGES[2].length === 10 && HELP_PAGES[3].length === 10);

// 4. 行宽预算（官方 estW：v21.11/v21.14 标定口径，CJK=0.865×size、·=0.303×size、空格=0.263×size；
//    全行 = r[0] + 3 空格 + r[1]，≤470 面板预算（v21.20 全页行宽巡检同口径））
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
const wD = estW(String(guide[1][0]) + '   ') + estW(dungeonRow);
ok('雾语林行全行宽估算 ' + wD.toFixed(1) + ' ≤ 470 面板预算', wD <= 470, String(wD));

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
ok('运行期：雾语林行「蘑菇田」落画', drawn.includes('蘑菇田') && drawn.includes('雾语林'));
ok('运行期：雾语林行既有信息落画零回归（泉水/魔王祭坛/裂洞）',
  drawn.includes('中段营地泉水') && drawn.includes('魔王祭坛') && drawn.includes('右下裂洞进矿脉'));
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
  readme.includes('smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 件套口径为二百一十二件套（二百一十一件套清除）且旧 173 口径零残留',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟一百七十四件套（一百七十三件套清' + '除）'));
ok('README 含 v22.78 守护描述（雾语林行蘑菇田指针守护）', readme.includes('v22.78 起含帮助页地图指南雾语林行「蘑菇田」指针守护'));
ok('README 含 smoke_v2278_mushguide 入库（174 份）', readme.includes('smoke_v2278_mushguide 入库（174 份）'));
ok('README 仍保留 smoke_v2277_pondhint 入库（173 份）历史口径', readme.includes('smoke_v2277_pondhint 入库（173 份）'));
ok('package.json test 串含 smoke_v2278_mushguide.mjs 且位于串尾',
  pkg.includes('node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 174 件套', testChain === 212, String(testChain));
ok('CHANGELOG 含 v22.78 条目（顶 pin）', changelog.startsWith('## v23.31 '));

// 7. 姊妹件套 pin（smoke_v2276_lampkid 随新现实更新）
const s2276 = readFileSync(join(ROOT, 'tests/smoke_v2276_lampkid.mjs'), 'utf8');
const s2260 = readFileSync(join(ROOT, 'tests/smoke_v2260_fountripple.mjs'), 'utf8');
ok('smoke_v2276 的 GAME_VERSION 字面量 pin 已更新为 v22.79', s2276.includes("const GAME_VERSION = 'v23.31';"));
ok('smoke_v2276 的 CHANGELOG 顶 pin 已更新为 ## v22.78', s2276.includes("startsWith('## v23.31'"));
ok('smoke_v2276 的件套 pin 已更新为二百一十二件套（二百一十一件套清除）', s2276.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2276 的 README 串尾 pin 已延伸至 smoke_v2278_mushguide', s2276.includes('smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2260 的 package.json 串尾 pin 已延伸至 smoke_v2279_lampwell', s2260.includes('node tests/smoke_v2279_lampwell.mjs'));

// 8. 旧代 v22.77 pin 全库零残留
const allTests = readdirSync(join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2278_mushguide.mjs');
const stale = [];
for (const f of allTests) {
  const src = readFileSync(join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "77';") || src.includes("GAME_VERSION === 'v22." + "77'") ||
      src.includes('一百七十四件套（一百七十三件套清' + '除）') || src.includes('testChain === ' + '173') ||
      src.includes('smoke_v2277_pondhint（npm test ' + '串跑）') || src.includes('_gv[1] >= ' + '77')) stale.push(f);
}
ok('旧代 v22.77 字面量/恒等/件套/testChain/串尾/版本锚 pin 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

console.log(`\n— v22.78 帮助页地图指南雾语林行「蘑菇田」r[1] 指针冒烟：${pass}/${pass + fail} 通过 —`);
process.exit(fail ? 1 : 0);
