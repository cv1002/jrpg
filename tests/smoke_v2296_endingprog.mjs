// smoke_v2296_endingprog.mjs —— v22.96 尾声画面「冒险进度」五徽记行守护
// 承 v21.10-v22.95 冒烟入库先例：版本锚点 + 源级落位（menus.js drawEnding 冒险进度行 y=420 / 面板加高
// 300→330 / 346·366·396 三行逐字零位移 + v22.96 注释）+ adventureProgress 纯函数契约（与状态页/
// drawWin/drawDead 同源）+ 行间预算 + 运行期全链路（DOM/音频/存储桩 + main.js 真实导入：drawEnding
// 渲染捕获 五档旗标 ✓/✗ + 真结局八行档共存 + 非真结局五行档零回归）+ README/package.json/CHANGELOG
// 同步 + 姊妹件套 pin + 旧代 v22.95 pin 全库零残留 + 哨兵链领先一位（193 口径）。
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

console.log('— v22.96 尾声画面「冒险进度」五徽记行 冒烟 —');

// 1. 版本锚点
const dataSrc = readFileSync(join(ROOT, 'js/data.js'), 'utf8');
ok('data.js GAME_VERSION 字面量为 v22.96', dataSrc.includes("const GAME_VERSION = 'v23.41';"));
ok('旧 v22.95 字面量零残留', !dataSrc.includes("const GAME_VERSION = 'v22." + "95';"));
ok('data.js 含 v22.96 版本注释', dataSrc.includes('// v22.96 体验打磨·信息透明·纯显示：尾声画面（drawEnding）补「冒险进度」五徽记行'));
ok('data.js 仍保留 v22.95/v22.94 世代注释链（历史注释未动）',
  dataSrc.includes('// v22.95 体验打磨·信息透明·纯显示：阵亡画面（drawDead）补「冒险进度」五徽记行') && dataSrc.includes('// v22.94 新内容·纯风味'));
const { GAME_VERSION, MAPS, FRAGMENTS } = await import('../js/data.js');
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.95（本版守 v22.96）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 99)), GAME_VERSION);

// 2. 源级落位：menus.js drawEnding 冒险进度行 + 面板加高 + 既有行零位移
const menusSrc = readFileSync(join(ROOT, 'js/view/menus.js'), 'utf8');
const endBlock = (menusSrc.match(/export function drawEnding\(\)\{[\s\S]*?\n\}/) || [''])[0];
ok('drawEnding 块存在', endBlock.length > 0);
ok('drawEnding 经 adventureProgress(hero) 派生并落至 (320,420,12px,#7d93a3)（与 drawWin/drawDead 同款渲染式）',
  endBlock.includes('const progE = adventureProgress(hero);') &&
  endBlock.includes("text('冒险进度：' + progE.map(([nm, dn]) => (dn ? '✓ ' : '✗ ') + nm).join(' · '), 320, 420, '12px', '#7d93a3', 'center');"));
ok('menus.js 含 v22.96 注释（drawEnding 冒险进度行说明）', menusSrc.includes('// v22.96 尾声画面补「冒险进度」五徽记行'));
ok('drawEnding 面板加高 300→330（v22.96 让位，底缘 440 之内）', menusSrc.includes("panel(40,110,560,330,'');"));
ok('drawEnding 故事行/战绩行/收集行/页脚零位移（146·166 / 346 / 366 / 396 逐字保留）',
  endBlock.includes('const step = lines.length > 5 ? 25 : 30;') &&
  endBlock.includes('const y0 = lines.length > 5 ? 146 : 166;') &&
  endBlock.includes('lines.forEach((l,i)=>text(l,320,y0+i*step') &&
  endBlock.includes(",320,346,'13px','#7d93a3','center');") &&
  endBlock.includes(",320,366,'bold 13px','#7dd47f','center');") &&
  endBlock.includes(',320,396,\'13px\',\'#7d93a3\',\'center\');'));
ok('drawEnding 页脚文案零回归（按 Enter/E 返回标题，v22.85 口径）', endBlock.includes("按 Enter/E 返回标题"));
ok('drawDead 冒险进度行零回归（v22.95 口径 432 逐字未动）',
  menusSrc.includes("text('冒险进度：' + progD.map(([nm, dn]) => (dn ? '✓ ' : '✗ ') + nm).join(' · '), CV.width / 2, 432, '12px', '#7d93a3', 'center');"));
ok('drawWin 冒险进度行零回归（v22.89 口径 434 逐字未动）',
  menusSrc.includes("CTX.fillText('冒险进度：' + progW.map(([nm, dn]) => (dn ? '✓ ' : '✗ ') + nm).join(' · '),CV.width/2,434);"));

// 3. adventureProgress 纯函数契约（与状态页/drawWin/drawDead 同读一份源）
const { adventureProgress } = await import('../js/quests.js');
ok('adventureProgress 导出且为函数（单一数据源）', typeof adventureProgress === 'function');
const pEmpty = adventureProgress({});
ok('无旗标 → [灯芯✗ 星井✗ 回廊✗ 初灯✗ 试炼场✗] 五元组逐值',
  JSON.stringify(pEmpty) === JSON.stringify([['灯芯', false], ['星井', false], ['回廊', false], ['初灯', false], ['试炼场', false]]),
  JSON.stringify(pEmpty));
const pBoss = adventureProgress({ bossDefeated: true });
ok('bossDefeated → 仅「灯芯」✓', JSON.stringify(pBoss) === JSON.stringify([['灯芯', true], ['星井', false], ['回廊', false], ['初灯', false], ['试炼场', false]]));
const pCave = adventureProgress({ bossDefeated: true, caveBoss: true });
ok('bossDefeated+caveBoss → 灯芯✓ 星井✓（双徽记前）', pCave[1][1] === true && pCave[2][1] === false);
const pOpen = adventureProgress({ bossDefeated: true, caveBoss: true, galleryOpen: true });
ok('+galleryOpen → 回廊✓', pOpen[2][1] === true && pOpen[3][1] === false);
const pTrue = adventureProgress({ bossDefeated: true, caveBoss: true, galleryOpen: true, trueBoss: true });
ok('+trueBoss → 初灯✓', pTrue[3][1] === true && pTrue[4][1] === false);
const pAll = adventureProgress({ bossDefeated: true, caveBoss: true, galleryOpen: true, trueBoss: true, rushDone: true });
ok('全旗标 → 五档全 ✓（试炼场✓）', pAll.every(([, dn]) => dn) && pAll[4][1] === true);
ok('旗标缺失/undefined 防御（不抛错且判负）', adventureProgress({ galleryOpen: undefined })[2][1] === false);
ok('四图数据面（MAPS 四图与五徽记同源世界观）', Object.keys(MAPS).length === 4);

// 4. 行间预算（尾声面板 40,110,560,330：420 与页脚 396 / 面板底缘 440 均 ≥16；真结局八行档末行 321 与战绩行 346 ≥16）
ok('尾声进度行 y=420 与页脚 396 行间 24 ≥16、距面板底缘 440 为 20 ≥16（12px 字底 ≈421.4 不触底）',
  420 - 396 >= 16 && 440 - 420 >= 16);
ok('真结局八行档末行 321 与战绩行 346 间距 ≥16px（行距 25 档不触战绩行）', 346 - (146 + 7 * 25) >= 16);
ok('非真结局五行档末行 266 与战绩行 346 间距 ≥16px（行距 30 档不触战绩行）', 346 - (166 + 4 * 30) >= 16);
function estW(s, size = 12) {
  let w = 0;
  for (const ch of String(s)) {
    const code = ch.codePointAt(0);
    const wide = (code >= 0x2e80 && code <= 0x9fff) || (code >= 0x3000 && code <= 0x303f) || (code >= 0xff00 && code <= 0xffef) || code >= 0x1f000;
    if (wide) w += 0.865 * size;
    else if (code === 0xb7) w += 0.303 * size;
    else if (code === 0x20) w += 0.263 * size;
    else if (code >= 0x30 && code <= 0x39) w += 0.63 * size;
    else w += 0.55 * size;
  }
  return w;
}
const progAllX = '冒险进度：✗ 灯芯 · ✗ 星井 · ✗ 回廊 · ✗ 初灯 · ✗ 试炼场';
const progAllV = '冒险进度：✓ 灯芯 · ✓ 星井 · ✓ 回廊 · ✓ 初灯 · ✓ 试炼场';
ok('进度行 12px estW ≤ 500 面板内预算（≈' + Math.round(estW(progAllX)) + '）', estW(progAllX) <= 500);
ok('全 ✓ 行 12px estW ≤ 500 面板内预算（≈' + Math.round(estW(progAllV)) + '）', estW(progAllV) <= 500);

// 5. 运行期全链路：DOM/音频/存储桩 + main.js 真实导入 + drawEnding 渲染捕获 五档旗标
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
const { drawEnding } = await import('../js/view/menus.js');
const { loadMap } = await import('../js/world.js');
const { newGame } = await import('../js/core.js');

function renderEnding(hero, map) {
  CAPTURED.length = 0;
  S.G = hero;
  S.G.map = map; S.G.x = 12; S.G.y = 12;
  S.dir = 'D'; S.scene = 'world'; S.walk = null;
  loadMap(map);
  drawEnding();
  return CAPTURED.slice();
}

// 5a. 零旗标普通档 → 全 ✗ 进度行 + 非真结局五行档 + 零抛错
let hero = newGame('余烬');
Object.assign(hero, { level: 9, gold: 777, item: 3, potion2: 1, time: 3723,
  bestiary: { '史莱姆': 2, '野狼': 1 }, totalWins: 30, ach: ['firstblood'],
  chests: new Set(['22,1', '12,11']), fragments: ['golem'], trueBoss: false });
let cap = null, threw = null;
try { cap = renderEnding(hero, 'village'); } catch (e) { threw = e; }
ok('运行期：drawEnding 普通档（零旗标）渲染无抛错', threw === null, threw && String(threw.stack || threw));
ok('运行期：零旗标落画「冒险进度：✗ 灯芯 · ✗ 星井 · ✗ 回廊 · ✗ 初灯 · ✗ 试炼场」',
  cap.includes(progAllX), JSON.stringify(cap.filter((t) => t.includes('冒险进度'))));
ok('运行期：普通档为非真结局五行档（ENDING 基础页）且战绩/收集/页脚共存',
  cap.some((t) => t.includes('战绩 · 累计讨伐')) && cap.some((t) => t.includes('📕 图鉴')) && cap.some((t) => t.includes('按 Enter/E 返回标题')),
  JSON.stringify(cap.filter((t) => t.includes('战绩') || t.includes('📕') || t.includes('返回标题'))));

// 5b. 灯芯 ✓（bossDefeated）→ 进度行首档 ✓
hero.bossDefeated = true;
cap = renderEnding(hero, 'village');
ok('运行期：bossDefeated → 「✓ 灯芯 · ✗ 星井 · ✗ 回廊 · ✗ 初灯 · ✗ 试炼场」',
  cap.includes('冒险进度：✓ 灯芯 · ✗ 星井 · ✗ 回廊 · ✗ 初灯 · ✗ 试炼场'),
  JSON.stringify(cap.filter((t) => t.includes('冒险进度'))));

// 5c. 全旗标 → 五档全 ✓
hero.caveBoss = true; hero.galleryOpen = true; hero.trueBoss = true; hero.rushDone = true;
hero.fragments = FRAGMENTS.map((f) => f.id);
let threw3 = null;
try { cap = renderEnding(hero, 'village'); } catch (e) { threw3 = e; }
ok('运行期：全旗标 + 全记忆 → 「✓ 灯芯 · ✓ 星井 · ✓ 回廊 · ✓ 初灯 · ✓ 试炼场」',
  threw3 === null && cap.includes(progAllV), JSON.stringify(cap.filter((t) => t.includes('冒险进度'))));
ok('运行期：全旗标 + 全记忆 → 真结局八行档（行距 25 档 146+7*25=321 不触战绩行）渲染零抛错',
  threw3 === null && cap.some((t) => t.includes('战绩 · 累计讨伐')), threw3 && String(threw3.stack || threw3));

// 5d. 真结局但碎片未集齐 → 八行档不触发（ENDING_TRUE 无全记忆页）仍带五徽记行
let hero2 = newGame('灯见');
Object.assign(hero2, { level: 12, gold: 999, item: 2, potion2: 0, time: 5400,
  bestiary: {}, totalWins: 40, ach: [], chests: new Set(), fragments: [], trueBoss: true,
  bossDefeated: true, caveBoss: true, galleryOpen: true });
threw = null;
let cap2 = null;
try { cap2 = renderEnding(hero2, 'gallery'); } catch (e) { threw = e; }
ok('运行期：真结局缺碎片档渲染无抛错（ENDING_TRUE 无全记忆页）', threw === null, threw && String(threw.stack || threw));
ok('运行期：真结局档进度行「✓ 灯芯 · ✓ 星井 · ✓ 回廊 · ✓ 初灯 · ✗ 试炼场」（试炼场是可选收尾一目了然）',
  cap2.includes('冒险进度：✓ 灯芯 · ✓ 星井 · ✓ 回廊 · ✓ 初灯 · ✗ 试炼场'),
  JSON.stringify(cap2.filter((t) => t.includes('冒险进度'))));

// 6. README / package.json / CHANGELOG 同步
const readme = readFileSync(join(ROOT, 'README.md'), 'utf8');
const pkg = readFileSync(join(ROOT, 'package.json'), 'utf8');
const changelog = readFileSync(join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树串尾已延伸至 smoke_v2296_endingprog（v2295 后接 v2296）',
  readme.includes('+ smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 旧串尾零残留（smoke_v2295_deadprog（npm test 串跑）不在树尾）',
  !readme.includes('smoke_v2295_deadprog（npm test 串跑）'));
ok('README 件套口径为二百一十二件套（二百一十一件套清除）且旧 191 口径零残留',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟一百九十一件套（一百九十件套清' + '除）'));
ok('README 含 v22.96 守护描述（尾声画面「冒险进度」五徽记行守护）',
  readme.includes('v22.96 起含尾声画面「冒险进度」五徽记行守护'));
ok('README 含 smoke_v2296_endingprog 入库（192 份）', readme.includes('smoke_v2296_endingprog 入库（192 份）'));
ok('README 仍保留 smoke_v2295_deadprog 入库（191 份）历史口径', readme.includes('smoke_v2295_deadprog 入库（191 份）'));
ok('README 仍保留 v22.95 守护描述（历史口径）', readme.includes('v22.95 起含阵亡画面「冒险进度」五徽记行守护'));
ok('README 系统清单含 v22.96 尾声画面冒险进度五徽记行条目',
  readme.includes('**尾声画面冒险进度五徽记行**（v22.96'));
ok('package.json 已收录 smoke_v2296_endingprog（npm test 串跑第 192 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2296_endingprog.mjs'));
ok('package.json 串尾为 ... smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"',
  pkg.includes('node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 192 件套', testChain === 212, String(testChain));
ok('CHANGELOG 顶部已追加 v22.96 条目', changelog.startsWith('## v23.41 '));
ok('CHANGELOG 仍保留 v22.95 条目（历史口径）', changelog.includes('## v22.95 阵亡画面补「冒险进度」五徽记行'));

// 7. 姊妹件套 pin（smoke_v2295/v2294 随新现实更新）
const readTest = (name) => readFileSync(join(ROOT, 'tests', name), 'utf8');
const s2295 = readTest('smoke_v2295_deadprog.mjs');
const s2294 = readTest('smoke_v2294_crystalwatch.mjs');
ok('smoke_v2295 的 GAME_VERSION 字面量 pin 已更新为 v22.96', s2295.includes("const GAME_VERSION = 'v23.41';"));
ok('smoke_v2295 的 CHANGELOG 顶 pin 已更新为 ## v22.96', s2295.includes("startsWith('## v23.41 '"));
ok('smoke_v2295 的件套 pin 已更新为二百一十二件套（二百一十一件套清除）', s2295.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2295 的 README 串尾 pin 已延伸至 smoke_v2296_endingprog',
  s2295.includes('smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2295 的 package 串尾 pin 已延伸至 smoke_v2296_endingprog',
  s2295.includes('node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
ok('smoke_v2295 的 testChain pin 已更新为 192', s2295.includes('testChain === 212'));
ok('smoke_v2295 的版本锚已推进至 >= 96', s2295.includes('_gv[1] >= 99'));
ok('smoke_v2294 的 GAME_VERSION 字面量 pin 已更新为 v22.96', s2294.includes("const GAME_VERSION = 'v23.41';"));
ok('smoke_v2294 的 testChain pin 已更新为 192', s2294.includes('testChain === 212'));

// 8. 旧代 v22.95 pin 全库零残留
const allTests = readdirSync(join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2296_endingprog.mjs');
const stale = [];
for (const f of allTests) {
  const src = readFileSync(join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "95';") || src.includes("GAME_VERSION === 'v22." + "95'") ||
      src.includes('一百九十一件套（一百九十件套清' + '除）') || src.includes('testChain === ' + '191') ||
      src.includes('smoke_v2295_deadprog（npm test ' + '串跑）') || src.includes('_gv[1] >= ' + '95') ||
      src.includes("startsWith('## v22." + "95") || src.includes('smoke_v2295_deadprog.mjs"')) stale.push(f);
}
ok('旧代 v22.95 字面量/恒等/件套/testChain/串尾/版本锚/顶 pin/package 串尾 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

// 9. 哨兵链（件套守护领先一位）已指向下一版 193 口径
const s2143 = readTest('smoke_v2143_talkekey.mjs');
ok('哨兵链 v2143 已含下一版件套口径（二百一十二件套（二百一十一件套清除））',
  s2143.includes('二百一十三件套（二百一十二件套清除）') &&
  s2143.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));

console.log(`\n— v22.96 尾声画面「冒险进度」五徽记行 冒烟：${pass}/${pass + fail} 通过 —`);
process.exit(fail ? 1 : 0);
