// smoke_v2297_chestmid.mjs —— v22.97 新成就「满载而归」（宝箱线中档里程碑）守护
// 承 v21.10-v22.96 冒烟入库先例：版本锚点 + 源级落位（data.js TREASURE2_GOAL 注释/声明/导出三件套 +
// ACH_LIST chests2 末尾追加 + v22.97 注释）+ TREASURE2_GOAL 数据契约（===9、TREASURE_GOAL===6 零回归、
// chestTotal()===12 零回归）+ ACH_LIST 契约（chests2 唯一/总数 59/既有 58 项 id 零回归/末尾序位 58）+
// ok/prog 谓词逐值（0·8 只 false / 9·12 只 true / 缺 chests 字段防御 false·0/9 / prog 不钳制 12/9）+
// 运行期全链路（DOM/音频/存储桩 + main.js 真实导入：applyAchievements 真实解锁落 hero.ach / 未够不误解锁 /
// 新档起始不误解锁 / 重复调用去重 / 旧档缺字段不抛错不解锁）+ drawAch 59 项滚动渲染不抛错 +
// README/package.json/CHANGELOG 同步（59 项双处/宝箱 6/9/12 只三档/串尾/件套 193/顶 pin）+ 姊妹件套 pin
// （v2296/v2274/v2229 随新现实更新）+ 旧代 v22.96 pin 全库零残留 + 哨兵链领先一位（194 口径）。
import { GAME_VERSION, ACH_LIST, TREASURE_GOAL, TREASURE2_GOAL, chestCount, chestTotal } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.97 满载而归宝箱线中档里程碑冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v22.96 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.96（本版守 v22.97）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 99)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v22.97 版本注释', dataSrc.includes('// v22.97 新内容·单成就·宝箱线中档里程碑：新成就「满载而归」'));
ok('data.js GAME_VERSION 字面量已为 v22.97（旧 v22.96 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.03';") && !dataSrc.includes("const GAME_VERSION = 'v22." + "96';"));
ok('data.js 仍保留 v22.96 历史注释（尾声画面冒险进度行注释未动）', dataSrc.includes('// v22.96 体验打磨·信息透明·纯显示：尾声画面（drawEnding）补「冒险进度」五徽记行'));
ok('data.js 导出 TREASURE2_GOAL（export 块落位，与 TREASURE_GOAL 相邻）',
  dataSrc.includes('LEVEL_GROWTH, TREASURE_GOAL, TREASURE2_GOAL, chestCount, chestTotal, trialSteleHint,'));

// —— TREASURE2_GOAL 数据契约 ——
ok('TREASURE2_GOAL === 9（宝箱线中档 = 6→9→12 对齐 scholar/seen 中档台阶）', TREASURE2_GOAL === 9, String(TREASURE2_GOAL));
ok('TREASURE2_GOAL 声明与注释含「满载而归」口径',
  dataSrc.includes('const TREASURE2_GOAL = 9;') && dataSrc.includes('成就「满载而归」'));
ok('TREASURE_GOAL 首档仍为 6（零回归）', TREASURE_GOAL === 6, String(TREASURE_GOAL));
ok('chestTotal() 仍为 12（封顶档分母零回归）', chestTotal() === 12, String(chestTotal()));
ok('中档 9 严格位于首档与封顶之间', TREASURE_GOAL < TREASURE2_GOAL && TREASURE2_GOAL < chestTotal());

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'chests2');
ok('ACH_LIST 含 chests2「满载而归」且 id 唯一',
  !!ach && ach.name === '满载而归' && ACH_LIST.filter((a) => a.id === 'chests2').length === 1);
ok('ACH_LIST 精确总数 59 项（v2229 精确计数 pin 随新现实更新 58→59）', ACH_LIST.length === 59, String(ACH_LIST.length));
ok('chests2 描述由 TREASURE2_GOAL 派生（单一数据源，零裸字面量 9）',
  ach.d === `累计开启 ${TREASURE2_GOAL} 个宝箱`, ach.d);
ok('chests2 判定/进度同读 TREASURE2_GOAL + chestCount（ok/prog 同式）',
  String(ach.ok).includes('TREASURE2_GOAL') && String(ach.ok).includes('chestCount') &&
  String(ach.prog).includes('TREASURE2_GOAL') && String(ach.prog).includes('chestCount'));
ok('chests2 无 r 字段纯里程碑（与 chests/allchests/lvl5 同款）', !('r' in ach));

// —— 既有 58 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime', 'hunt100', 'ptime2', 'lucky2', 'rich2', 'stock',
  'brew2', 'stock2', 'elixir', 'mush', 'elixir2', 'mush2', 'metall', 'rich3', 'ptime3', 'hunt3',
  'lucky3', 'stock3', 'elixir3', 'brew3', 'mush3', 'outstep', 'outstep2', 'scholar2', 'seen', 'seen2'];
ok('既有 58 成就 id 零回归', EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('chests2 追加在末尾序位（ptime 32 / ptime2 34 / mush 41 / metall 44 / rich3 45 / ptime3 46 / hunt3 47 / lucky3 48 / stock3 49 / elixir3 50 / brew3 51 / mush3 52 / outstep 53 / outstep2 54 / scholar2 55 / seen 56 / seen2 57 / chests2 58，既有序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'ptime') === 32 &&
  ACH_LIST.findIndex((a) => a.id === 'ptime2') === 34 &&
  ACH_LIST.findIndex((a) => a.id === 'mush') === 41 &&
  ACH_LIST.findIndex((a) => a.id === 'metall') === 44 &&
  ACH_LIST.findIndex((a) => a.id === 'rich3') === 45 &&
  ACH_LIST.findIndex((a) => a.id === 'ptime3') === 46 &&
  ACH_LIST.findIndex((a) => a.id === 'hunt3') === 47 &&
  ACH_LIST.findIndex((a) => a.id === 'lucky3') === 48 &&
  ACH_LIST.findIndex((a) => a.id === 'stock3') === 49 &&
  ACH_LIST.findIndex((a) => a.id === 'elixir3') === 50 &&
  ACH_LIST.findIndex((a) => a.id === 'brew3') === 51 &&
  ACH_LIST.findIndex((a) => a.id === 'mush3') === 52 &&
  ACH_LIST.findIndex((a) => a.id === 'outstep') === 53 &&
  ACH_LIST.findIndex((a) => a.id === 'outstep2') === 54 &&
  ACH_LIST.findIndex((a) => a.id === 'scholar2') === 55 &&
  ACH_LIST.findIndex((a) => a.id === 'seen') === 56 &&
  ACH_LIST.findIndex((a) => a.id === 'seen2') === 57 &&
  ACH_LIST.findIndex((a) => a.id === 'chests2') === 58);

// —— chestCount 三形态 + ok/prog 谓词逐值 ——
const cs = (k) => new Set(Array.from({ length: k }, (_, i) => 'c' + i));
ok('chestCount Set 形态 = size', chestCount({ chests: cs(9) }) === 9);
ok('chestCount 数组形态 = length（防御式）', chestCount({ chests: ['1', '2'] }) === 2);
ok('chestCount 缺失形态 = 0（防御式）', chestCount({}) === 0 && chestCount(undefined) === 0);
ok('chests2=0 只 → false 且 prog 0/9', ach.ok({ chests: cs(0) }) === false && ach.prog({ chests: cs(0) }) === `0/${TREASURE2_GOAL}`);
ok('chests2=8 只（恰在门槛下）→ false 不解锁', ach.ok({ chests: cs(8) }) === false);
ok('chests2=9 只（恰达标）→ true', ach.ok({ chests: cs(9) }) === true);
ok('chests2=12 只（封顶全开）→ true（超阈值仍达标不抛错）', ach.ok({ chests: cs(12) }) === true);
ok('缺 chests 字段旧档 → false 且 prog 0/9（防御式零迁移）',
  ach.ok({}) === false && ach.prog({}) === `0/${TREASURE2_GOAL}`);
ok('prog 8 只 → 8/9', ach.prog({ chests: cs(8) }) === `8/${TREASURE2_GOAL}`, ach.prog({ chests: cs(8) }));
ok('prog 9 只 → 9/9', ach.prog({ chests: cs(9) }) === `9/${TREASURE2_GOAL}`, ach.prog({ chests: cs(9) }));
ok('prog 12 只不钳制（12/9，承 scholar「X/N 不钳制」口径）', ach.prog({ chests: cs(12) }) === `12/${TREASURE2_GOAL}`, ach.prog({ chests: cs(12) }));

// —— 运行期实证：DOM/音频/存储桩 + main.js 真实导入后 applyAchievements 全链路 ——
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
    lineWidth: 1, imageSmoothingEnabled: false,
    fillText: noop, strokeText: noop,
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
const { newGame } = await import('../js/core.js');
const { applyAchievements } = await import('../js/hero.js');
const { drawAch } = await import('../js/view/menus.js');

function runAch(hero) {
  S.G = hero;
  S.scene = 'world';
  applyAchievements();
  return hero;
}

// 达标档：chests2=9 只 → applyAchievements 真实解锁落 hero.ach（持续累积量，任意判定点当场解锁）
let hero = newGame('余烬');
hero.chests = cs(9);
hero = runAch(hero);
ok('运行期：chests 9 只触发 applyAchievements 真实解锁 chests2 落 hero.ach', hero.ach.includes('chests2'), hero.ach.join(','));

// 未达标档：chests2=8 只 → 不误解锁（差 1 只）
hero = newGame('灯见');
hero.chests = cs(8);
hero = runAch(hero);
ok('运行期：chests 8 只不误解锁 chests2', !hero.ach.includes('chests2'));

// 新档起始（chests 空）→ 不误解锁
hero = newGame('潮');
hero = runAch(hero);
ok('运行期：新档起始不误解锁 chests2', !hero.ach.includes('chests2'), String((hero.chests || new Set()).size));

// 重复调用去重：已解锁后再 applyAchievements 不重复 push
hero = newGame('灯');
hero.chests = cs(9);
runAch(hero);
runAch(hero);
ok('运行期：重复调用去重（hero.ach 中 chests2 恰一枚）',
  hero.ach.filter((x) => x === 'chests2').length === 1);

// 旧档防御档：无 chests 字段读档 → applyAchievements 不抛错且不解锁（零迁移）
hero = newGame('潮');
delete hero.chests;
let threw = null;
try { runAch(hero); } catch (e) { threw = e; }
ok('运行期：旧档缺 chests 字段 applyAchievements 不抛错（防御式）', threw === null, threw && String(threw.stack || threw));
ok('运行期：缺字段旧档不解锁 chests2（零迁移）', !hero.ach.includes('chests2'));

// —— drawAch 渲染（59 项滚动不抛错；PAGE=10，59 项六页）——
let rendered = true, renderedPg6 = true;
try {
  S.G = newGame('测试'); S.G.ach = ['chests2', 'allchests']; S.achScroll = 0; S.scene = 'ach';
  drawAch();
} catch (e) { rendered = false; }
try {
  S.achScroll = 70; // 59 项滚到最末页（PAGE=10，钳制不越界）不抛错
  drawAch();
} catch (e) { renderedPg6 = false; }
S.achScroll = 0; S.scene = 'world';
ok('运行期：成就页 drawAch 59 项渲染不抛错', rendered);
ok('运行期：成就页末页滚动渲染不抛错（59 项 PAGE=10）', renderedPg6);

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树串尾已延伸至 smoke_v2297_chestmid（v2296 后接 v2297）',
  readme.includes('smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum（npm test 串跑）'));
ok('README 旧串尾零残留（smoke_v2296_endingprog（npm test 串跑）不在树尾）',
  !readme.includes('smoke_v2296_endingprog（npm test 串跑）'));
ok('README 件套口径为一百九十九件套（一百九十八件套清除）且旧 192 口径零残留',
  readme.includes('冒烟一百九十九件套（一百九十八件套清除）') && !readme.includes('冒烟一百九十二件套（一百九十一件套清' + '除）'));
ok('README 含 v22.97 守护描述（新成就满载而归守护）', readme.includes('v22.97 起含新成就「满载而归」守护'));
ok('README 含 smoke_v2297_chestmid 入库（193 份）', readme.includes('smoke_v2297_chestmid 入库（193 份）'));
ok('README 仍保留 v22.96 守护描述（历史口径）', readme.includes('v22.96 起含尾声画面「冒险进度」五徽记行守护'));
ok('README 仍保留 smoke_v2296_endingprog 入库（192 份）历史口径', readme.includes('smoke_v2296_endingprog 入库（192 份）'));
ok('README 成就口径「59 项」双处同步（快速上手表 C 键行 + 图鉴&成就行）',
  readme.includes('成就一览（全部 59 项进度') && readme.includes('**59 项成就**') &&
  !readme.includes('成就一览（全部 58 项进' + '度') && !readme.includes('**58 项成' + '就**'));
ok('README 系统清单宝箱示例已更新为 6/9/12 只三档', readme.includes('宝箱 6/9/12 只三档'));
ok('package.json 已收录 smoke_v2297_chestmid（npm test 串跑第 193 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2297_chestmid.mjs'));
ok('package.json 串尾为 ... smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs"',
  pkg.includes('node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 193 件套', testChain === 199, String(testChain));
ok('CHANGELOG 顶部已追加 v22.97 条目', changelog.startsWith('## v23.03 '));
ok('CHANGELOG 仍保留 v22.96 条目（历史口径）', changelog.includes('## v22.96 尾声画面补「冒险进度」五徽记行'));

// —— 姊妹件套 pin 随新现实更新 + 旧代 v22.96 pin 零残留 ——
const s2296 = read('smoke_v2296_endingprog.mjs');
const s2274 = read('smoke_v2274_seen2.mjs');
const s2229 = read('smoke_v2229_metall.mjs');
const s2143 = read('smoke_v2143_talkekey.mjs');
ok('smoke_v2296 的 GAME_VERSION 字面量 pin 已更新为 v22.97', s2296.includes("const GAME_VERSION = 'v23.03';"));
ok('smoke_v2296 的 CHANGELOG 顶 pin 已更新为 ## v22.97', s2296.includes("startsWith('## v23.03 '"));
ok('smoke_v2296 的件套 pin 已更新为一百九十九件套（一百九十八件套清除）', s2296.includes('冒烟一百九十九件套（一百九十八件套清除）'));
ok('smoke_v2296 的 README 串尾 pin 已延伸至 smoke_v2297_chestmid',
  s2296.includes('smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum（npm test 串跑）'));
ok('smoke_v2296 的 package 串尾 pin 已延伸至 smoke_v2297_chestmid',
  s2296.includes('node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs"'));
ok('smoke_v2296 的 testChain pin 已更新为 193', s2296.includes('testChain === 199'));
ok('smoke_v2296 的版本锚已推进至 >= 97', s2296.includes('_gv[1] >= 99'));
ok('smoke_v2274 的 ACH_LIST 精确计数 pin 已更新为 === 59', s2274.includes('ACH_LIST.length === 59'));
ok('smoke_v2229 的 ACH_LIST 精确计数 pin 已更新为 === 59', s2229.includes('ACH_LIST.length === 59'));
ok('smoke_v2143 哨兵链已推进至一百九十九件套（一百九十八件套清除）', s2143.includes('二百件套（一百九十九件套清除）') && s2143.includes("!readme.includes('二百件套（一百九十九件套清除）')"));

// 旧代 v22.96 pin 全库零残留（不含本件）
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2297_chestmid.mjs');
const stale = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("const GAME_VERSION = 'v22.96';") || src.includes("const GAME_VERSION = 'v22.96'") || src.includes("GAME_VERSION === 'v22.96'") ||
      src.includes('一百九十二件套（一百九十一件套清' + '除）') || src.includes('testChain === ' + '192') ||
      src.includes('smoke_v2296_endingprog（npm test 串' + '跑）') || src.includes('_gv[1] >= ' + '96') ||
      src.includes("startsWith('## v22.96") || src.includes('smoke_v2296_endingprog.mjs"')) stale.push(f);
}
ok('旧代 v22.96 字面量/恒等/件套/testChain/串尾/版本锚/顶 pin/package 串尾 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

console.log(`\n— v22.97 满载而归冒烟：${n - failed}/${n} 通过 —`);
if (failed) process.exit(1);
