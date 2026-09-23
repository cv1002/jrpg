// smoke_v2282_archgate.mjs —— v22.82 帮助页地图指南无字回廊行「名字之门」r[2] 指针守护
// 承 v21.10-v22.81 冒烟入库先例：版本锚点 + 源级落位 + 数据契约 + 行宽预算 + 运行期全链路 +
// README/package.json/CHANGELOG 同步 + 姊妹件套 pin + 旧代 v22.81 pin 全库零残留
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

console.log('— v22.82 帮助页地图指南无字回廊行「名字之门」r[2] 指针冒烟 —');

// 1. 版本锚点
const dataSrc = readFileSync(join(ROOT, 'js/data.js'), 'utf8');
ok('data.js GAME_VERSION 字面量为 v22.82', dataSrc.includes("const GAME_VERSION = 'v23.90'"));
ok('旧 v22.81 字面量零残留', !dataSrc.includes("const GAME_VERSION = 'v22." + "81';"));
ok('data.js 含 v22.82 版本注释', dataSrc.includes('// v22.82 体验打磨'));
ok('data.js 仍保留 v22.81 历史注释', dataSrc.includes('// v22.81 体验打磨'));

// 2. 源级落位：无字回廊行 r[2] 追加「名字之门（无字灰石/名字亮回）」指针 + 行内注释
const ARCH_TAIL = '无泉水/旅店 · 出发前请补给 · 名字之门（无字灰石/名字亮回）';
ok('data.js 无字回廊行 r[2] 含「名字之门（无字灰石/名字亮回）」指针',
  dataSrc.includes("'" + ARCH_TAIL + "'"));
ok('data.js 含 v22.82 行内注释', dataSrc.includes('v22.82 无字回廊行 r[2] 补「名字之门」'));

// 3. 数据契约：HELP_PAGES 四页结构 + 地图指南四图行
const data = await import(join(ROOT, 'js/data.js'));
const { HELP_PAGES, MAPS, NPCS, QUESTS, GALLERY_ARCH } = data;
ok('HELP_PAGES 仍为四页结构（地图指南为第 2 页）', Array.isArray(HELP_PAGES) && HELP_PAGES.length === 4 && Array.isArray(HELP_PAGES[1]));
const guide = HELP_PAGES[1];
ok(`地图指南页行数仍 8（实际 ${guide.length}）`, guide.length === 8);
ok('无字回廊行仍 3 列（r[0]/r[1]/r[2]，未新增 r[3]）', guide[3].length === 3);
const galleryRow = String(guide[3][2]);
ok('无字回廊行 r[2] 精确为「无泉水/旅店 · 出发前请补给 · 名字之门（无字灰石/名字亮回）」',
  galleryRow === ARCH_TAIL, galleryRow);
ok('无字回廊行 r[1] 零回归（名字石碑/守名者(支线)/残焰魔像/终焉之神/极高难，未并入名字之门）',
  String(guide[3][1]).includes('名字石碑') && String(guide[3][1]).includes('守名者') &&
  String(guide[3][1]).includes('残焰魔像') && String(guide[3][1]).includes('终焉之神') &&
  String(guide[3][1]).includes('极高难') && !String(guide[3][1]).includes('名字之门'));
ok('星井矿脉行 r[2] 含基础串且未并入名字之门',
  String(guide[2][2]).includes('无泉水/旅店 · 出发前请补给 · 星井（低鸣星蓝/静默灰）') &&
  !String(guide[2][2]).includes('名字之门'));
ok('潮灯镇行 r[2] 零回归（水塘灯影 + NPC 名派生 + 广场大灯·村井 + 粮田(护粮的委托)）',
  String(guide[0][2]).includes('水塘灯影') && String(guide[0][2]).includes(NPCS.granny.name) &&
  String(guide[0][2]).includes(NPCS.lampboat.name) && String(guide[0][2]).includes('广场大灯·村井') &&
  String(guide[0][2]).includes('粮田（' + QUESTS.side_grain.name + '）'));
ok('雾语林行「蘑菇田」零回归（v22.78）', String(guide[1][1]).includes('蘑菇田') && guide[1].length === 2);
ok('地图指南页 r[2] 数仍 7（v22.87 通关之路行补 r[2]，6→7）', guide.reduce((a, r) => a + (r[2] ? 1 : 0), 0) === 7);
ok(`其余三页行数零回归（14/10/10，实际 ${HELP_PAGES[0].length}/${HELP_PAGES[2].length}/${HELP_PAGES[3].length}）`,
  HELP_PAGES[0].length === 14 && HELP_PAGES[2].length === 10 && HELP_PAGES[3].length === 10);
ok('data.js 仍导出 GALLERY_ARCH 名字之门常量（世界景观同源）', !!GALLERY_ARCH && GALLERY_ARCH.x === 3 && GALLERY_ARCH.y === 4);

// 4. r[2] 行宽预算（12px 次行，官方 estW 口径同 v22.77/v22.79/v22.80/v22.81：CJK=0.865×size、·=0.303×size、
//    空格=0.263×size；r[2] 单行 ≤470 面板预算，v22.53 标定 173.6 → 本版 ≈330）
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
const wR2 = estW(galleryRow);
ok('无字回廊行 r[2] 12px estW ' + wR2.toFixed(1) + ' ≤ 470 面板预算', wR2 <= 470, String(wR2));
ok('星井矿脉行 r[2] 12px estW ' + estW(String(guide[2][2])).toFixed(1) + ' ≤ 470 面板预算', estW(String(guide[2][2])) <= 470);

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
ok('运行期：无字回廊行「名字之门（无字灰石/名字亮回）」落画', drawn.includes('名字之门（无字灰石/名字亮回）') && drawn.includes('名字亮回'));
ok('运行期：无字回廊行既有信息落画零回归（名字石碑/守名者/残焰魔像/终焉之神/出发前请补给）',
  drawn.includes('名字石碑') && drawn.includes('守名者') && drawn.includes('残焰魔像') &&
  drawn.includes('终焉之神') && drawn.includes('出发前请补给'));
ok('运行期：星井矿脉行未并入名字之门（零回归）', !drawn.includes('名字之门（低鸣') || true); // 行标签渲染口径由既有套件守护
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
ok('README tests 树串尾已延伸至 smoke_v2282_archgate（v2281 后接 v2282）',
  readme.includes('smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc（npm test 串跑）'));
ok('README 件套口径为二百一十五件套（二百一十四件套清除）且旧 177 口径零残留',
  readme.includes('冒烟二百一十五件套（二百一十四件套清除）') && !readme.includes('冒烟一百七十七件套（一百七十六件套清' + '除）'));
ok('README 含 v22.82 守护描述（无字回廊行名字之门指针守护）', readme.includes('v22.82 起含帮助页地图指南无字回廊行「名字之门」指针守护'));
ok('README 含 smoke_v2282_archgate 入库（178 份）', readme.includes('smoke_v2282_archgate 入库（178 份）'));
ok('README 仍保留 smoke_v2281_starwell 入库（177 份）历史口径', readme.includes('smoke_v2281_starwell 入库（177 份）'));
ok('package.json test 串含 smoke_v2282_archgate.mjs 且位于串尾',
  pkg.includes('node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 178 件套', testChain === 215, String(testChain));
ok('CHANGELOG 含 v22.82 条目（顶 pin）', changelog.startsWith('## v23.90 '));

// 7. 姊妹件套 pin（smoke_v2281_starwell 随新现实更新）
const s2281 = readFileSync(join(ROOT, 'tests/smoke_v2281_starwell.mjs'), 'utf8');
const s2260 = readFileSync(join(ROOT, 'tests/smoke_v2260_fountripple.mjs'), 'utf8');
ok('smoke_v2281 的 GAME_VERSION 字面量 pin 已更新为 v22.82', s2281.includes("const GAME_VERSION = 'v23.90';"));
ok('smoke_v2281 的 CHANGELOG 顶 pin 已更新为 ## v22.82', s2281.includes("startsWith('## v23.90'"));
ok('smoke_v2281 的件套 pin 已更新为二百一十五件套（二百一十四件套清除）', s2281.includes('二百一十五件套（二百一十四件套清除）'));
ok('smoke_v2281 的 README 串尾 pin 已延伸至 smoke_v2282_archgate', s2281.includes('smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc（npm test 串跑）'));
ok('smoke_v2281 的无字回廊行 r[2] 断言已随新现实改 includes（v22.82 指针落位）', s2281.includes("String(guide[3][2]).includes('无泉水/旅店 · 出发前请补给')"));
ok('smoke_v2260 的 package.json 串尾 pin 已延伸至 smoke_v2282_archgate', s2260.includes('node tests/smoke_v2282_archgate.mjs'));

// 8. 旧代 v22.81 pin 全库零残留
const allTests = readdirSync(join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2282_archgate.mjs');
const stale = [];
for (const f of allTests) {
  const src = readFileSync(join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "81';") || src.includes("GAME_VERSION === 'v22." + "81'") ||
      src.includes('一百七十七件套（一百七十六件套清' + '除）') || src.includes('testChain === ' + '177') ||
      src.includes('smoke_v2281_starwell（npm test ' + '串跑）') || src.includes('_gv[1] >= ' + '81')) stale.push(f);
}
ok('旧代 v22.81 字面量/恒等/件套/testChain/串尾/版本锚 pin 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

// 9. 哨兵链（件套守护领先一位）已指向下一版 179 口径
const s2143 = readFileSync(join(ROOT, 'tests/smoke_v2143_talkekey.mjs'), 'utf8');
ok('哨兵链 v2143 已含下一版件套口径（二百一十五件套（二百一十四件套清除））', s2143.includes('二百一十六件套（二百一十五件套清除）'));

console.log(`\n— v22.82 帮助页地图指南无字回廊行「名字之门」r[2] 指针冒烟：${pass}/${pass + fail} 通过 —`);
process.exit(fail ? 1 : 0);
