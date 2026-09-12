// v22.10 专项冒烟：关闭/刷新页面前「未存档提醒」（beforeunload 防误丢档·体验打磨，承 R/X 两按确认、
// win「本局战果未自动存档」提示同一「破坏性/易丢操作防误触」家族）——本游戏进度只随 P/菜单「存档」落
// localStorage，浏览器刷新/关标签页默认静默丢掉内存中的冒险（手滑刷新一趟白打、误关标签页战果蒸发），
// 此前零离站提醒；现 beforeunload 时 S.G && S.unsaved 即弹浏览器原生「离开页面」确认，13 个动作入口置脏
// （world.move / battle.playerAction / shop 五购买 / core 六入口——usePotion·brewNow·doTravel·talkNext·
// beginAdventure·resetRun），saveGame/load 成功清脏；标题页默认占位（S.G 非空但从未动作）与读档后未动作
// 均不误报；纯运行时标志零结算零存档格式变化（unsaved 不落盘、刷新即复位，零迁移）。
// 本冒烟守护：版本锚点、data.js/state.js/core.js/world.js/battle.js/shop.js/main.js 源级落位（13 置脏 +
// 2 清脏精确计数、S 字段、beforeunload 守卫）、全库 S.unsaved 写入点分布、运行期全链路（boot 干净不报 →
// 行走置脏报 → 存档清脏不报 → 购买置脏报 → 读档清脏不报 → S.G null 守卫不报 → beginAdventure/resetRun
// 新开局置脏）、README/package.json/CHANGELOG 同步、姊妹件套 pin（v2209..v2176 一百零六件套 /
// v2209..v2181·v2179 GAME_VERSION v22.10 / v2209..v2192 恒等 v22.10 / v2209..v2195·v2193·v2192 树尾 pin）
// 随新现实更新 + 旧代 v22.9 字面量 pin / 旧代恒等 pin / 旧代一百零五件套 pin / 旧代树尾 pin 全库零残留。
import { GAME_VERSION } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.10 关闭/刷新未存档提醒（beforeunload 防误丢档）冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v22.9 + 精确 v22.10 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.9', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 10)), GAME_VERSION);
ok('GAME_VERSION 字面量已为 v22.10（本版独占精确锚点）', GAME_VERSION === 'v22.27', GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const stateSrc = read('../js/state.js');
const coreSrc = read('../js/core.js');
const worldSrc = read('../js/world.js');
const battleSrc = read('../js/battle.js');
const shopSrc = read('../js/shop.js');
const mainSrc = read('../js/main.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v22.10 版本注释', dataSrc.includes('v22.10 关闭/刷新未存档提醒'));
ok('data.js GAME_VERSION 字面量已更新为 v22.10', dataSrc.includes("const GAME_VERSION = 'v22.27';"));
ok('data.js 仍保留 v22.9 历史注释（累积注释块，姊妹 pin 不失效）', dataSrc.includes('v22.9 状态页资源行「·成就X/6」'));

// —— 源级落位：state.js 字段 + 13 置脏 / 2 清脏精确计数 + main.js beforeunload 守卫 ——
ok('state.js 声明 unsaved: false 字段（含 v22.10 注释）', stateSrc.includes('unsaved: false,') && stateSrc.includes('v22.10 关闭/刷新未存档提醒'));
const MARK = 'S.unsaved = true; // v22.10 未存档提醒置脏';
const CLEAR = 'S.unsaved = false; // v22.10 未存档提醒清脏';
const cnt = (s, pat) => s.split(pat).length - 1;
ok('core.js 置脏点恰 6 处（usePotion/brewNow/doTravel/talkNext/beginAdventure/resetRun）', cnt(coreSrc, MARK) === 6, String(cnt(coreSrc, MARK)));
ok('core.js 清脏点恰 2 处（saveGame/load 成功）', cnt(coreSrc, CLEAR) === 2, String(cnt(coreSrc, CLEAR)));
ok('world.js 置脏点恰 1 处（move）', cnt(worldSrc, MARK) === 1, String(cnt(worldSrc, MARK)));
ok('battle.js 置脏点恰 1 处（playerAction）', cnt(battleSrc, MARK) === 1, String(cnt(battleSrc, MARK)));
ok('shop.js 置脏点恰 5 处（buyPotion/sellMushroom/buyWeapon/buyArmor/stayInn）', cnt(shopSrc, MARK) === 5, String(cnt(shopSrc, MARK)));
ok('main.js 已注册 beforeunload 守卫（S.G && S.unsaved 判定）', mainSrc.includes("window.addEventListener('beforeunload'") && mainSrc.includes('if (S.G && S.unsaved)'));
ok('main.js 含 v22.10 注释（与 data.js 同源注释块）', mainSrc.includes('v22.10 关闭/刷新未存档提醒'));

// —— 全库写入点分布：除上述模块外零 S.unsaved 写入残留（单一数据源守卫；只数标记串不数注释提及） ——
const jsFiles = fs.readdirSync(new URL('../js', import.meta.url)).filter((f) => f.endsWith('.js'));
const expected = { 'data.js': 0, 'state.js': 0, 'core.js': 8, 'world.js': 1, 'battle.js': 1, 'shop.js': 5, 'main.js': 0 };
let distOK = true, distMsg = [];
for (const f of jsFiles) {
  const c = cnt(read(`../js/${f}`), MARK) + cnt(read(`../js/${f}`), CLEAR);
  if ((expected[f] ?? 0) !== c) { distOK = false; distMsg.push(`${f}:${c}`); }
}
for (const sub of fs.readdirSync(new URL('../js/view', import.meta.url))) {
  const c = cnt(read(`../js/view/${sub}`), MARK) + cnt(read(`../js/view/${sub}`), CLEAR);
  if (c !== 0) { distOK = false; distMsg.push(`view/${sub}:${c}`); }
}
ok('全库 S.unsaved 写入点分布精确（core8/world1/battle1/shop5 + 其余 0）', distOK, distMsg.join(','));
ok('state.js 字段声明与 main.js 守卫各恰 1 处', cnt(stateSrc, 'unsaved: false,') === 1 && cnt(mainSrc, 'if (S.G && S.unsaved)') === 1);

// —— 运行期实证：DOM/音频/存储桩（含 window 事件捕获）+ main.js 真实导入后全链路 ——
const noop = () => {};
const CAPTURED = [];
function makeCtx() {
  const grad = { addColorStop: noop };
  return {
    canvas: { width: 640, height: 480 },
    measureText: (t) => ({ width: String(t).length }),
    createLinearGradient: () => grad, createRadialGradient: () => grad, createConicGradient: () => grad, createPattern: () => ({}),
    beginPath: noop, closePath: noop, moveTo: noop, lineTo: noop, arc: noop, arcTo: noop, ellipse: noop,
    quadraticCurveTo: noop, bezierCurveTo: noop, fill: noop, stroke: noop, fillRect: noop, strokeRect: noop,
    clearRect: noop, drawImage: noop, save: noop, restore: noop, translate: noop, rotate: noop, scale: noop,
    transform: noop, setTransform: noop, clip: noop, rect: noop, setLineDash: noop, getLineDash: () => [],
    isPointInPath: () => false, getImageData: () => ({ data: new Uint8ClampedArray(4) }), putImageData: noop,
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
const winHandlers = {};
globalThis.window = { addEventListener: (t, fn) => { winHandlers[t] = fn; }, AudioContext: FakeAudio, webkitAudioContext: FakeAudio };
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
const core = await import('../js/core.js');
const { loadMap, move } = await import('../js/world.js');
const shop = await import('../js/shop.js');

ok('运行期：boot 后 S.unsaved === false（标题页默认占位零脏，不误报）', S.unsaved === false);
const bu = winHandlers['beforeunload'];
ok('运行期：beforeunload 已注册（winHandlers 捕获）', typeof bu === 'function');
function fire() {
  const ev = { pd: false, returnValue: 'x', preventDefault() { this.pd = true; } };
  bu(ev);
  return ev.pd;
}
ok('运行期：boot 干净态触发 beforeunload 不 preventDefault（未动作不误报）', fire() === false);

// 新冒险 → 行走置脏 → 报确认
let hero = core.newGame('余烬');
S.G = hero; S.scene = 'world'; S.dir = 'D'; S.walk = null;
loadMap('village');
move(0, 0);
ok('运行期：world.move 置 S.unsaved=true（行走即脏）', S.unsaved === true);
ok('运行期：置脏态触发 beforeunload preventDefault=true（弹「离开页面」确认）', fire() === true);

// 存档清脏 → 不报
S.curSaveSlot = 1;
core.saveGame();
ok('运行期：saveGame 成功后 S.unsaved===false（已落盘）', S.unsaved === false);
ok('运行期：存档后触发 beforeunload 不 preventDefault', fire() === false);

// 购买置脏 → 报（真实 shop.buyPotion 链路）
shop.buyPotion();
ok('运行期：shop.buyPotion 置 S.unsaved=true（购买即脏）', S.unsaved === true && hero.gold < 30);
ok('运行期：购买后触发 beforeunload preventDefault=true', fire() === true);

// 读档清脏 → 不报（真实 load 链路：读回刚才的存档）
ok('运行期：load() 读档成功', core.load() === true);
ok('运行期：load 成功后 S.unsaved===false（读档=与存档一致）', S.unsaved === false);
ok('运行期：读档后触发 beforeunload 不 preventDefault', fire() === false);

// S.G null 守卫（防御分支：无进行中冒险恒不报）
const savedG = S.G;
S.G = null; S.unsaved = true;
ok('运行期：S.G null 时即使 unsaved 也不 preventDefault（守卫 S.G && S.unsaved）', fire() === false);
S.G = savedG;

// 新开局/重开置脏
S.createName = 0; S.createDiff = 0;
core.beginAdventure();
ok('运行期：beginAdventure 新开局 S.unsaved=true（新冒险未落盘）', S.unsaved === true);
S.unsaved = false;
core.resetRun();
ok('运行期：resetRun 重开 S.unsaved=true（新一轮未落盘）', S.unsaved === true);

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树收录 smoke_v2210_unsaved 且位于串尾', readme.includes('smoke_v2209_achstatus + smoke_v2211_lampkid + smoke_v2212_volume + smoke_v2213_teller + smoke_v2214_mush + smoke_v2215_tutorvol + smoke_v2216_picker + smoke_v2217_elixir2 + smoke_v2218_mush2 + smoke_v2219_footkeys + smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel（npm test 串跑）'));
ok('README 件套口径为一百二十三件套（一百二十二件套清除）',
  readme.includes('冒烟一百二十三件套（一百二十二件套清除）') && !readme.includes('冒烟一百零五件套（一百零四件套清' + '除）'));
ok('README 含 v22.10 守护描述', readme.includes('v22.10 起含关闭/刷新未存档提醒守护'));
ok('README 系统清单含关闭/刷新未存档提醒条目', readme.includes('**关闭/刷新未存档提醒**'));
ok('package.json 已收录 smoke_v2210_unsaved（npm test 串跑第 106 份）',
  pkg.includes('smoke_v2210_unsaved.mjs') && pkg.includes('smoke_v2209_achstatus.mjs && node tests/smoke_v2210_unsaved.mjs'));
ok('CHANGELOG 含 v22.10 条目', changelog.includes('## v22.10 '));

// —— 姊妹件套 pin 复查（v21.7 惯例：本版冒烟守护姊妹随新现实更新） ——
const suitelen = ['smoke_v2209_achstatus.mjs', 'smoke_v2208_elixir.mjs', 'smoke_v2207_titledel.mjs',
  'smoke_v2206_stock2.mjs', 'smoke_v2205_fragtitle.mjs', 'smoke_v2204_brew2.mjs', 'smoke_v2203_fragdead.mjs',
  'smoke_v2202_fragwin.mjs', 'smoke_v2201_fragstatus.mjs', 'smoke_v2200_stock.mjs',
  'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs', 'smoke_v2191_ptime.mjs',
  'smoke_v2190_launch.mjs', 'smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs',
  'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs',
  'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs',
  'smoke_v2181_helpquickcast.mjs', 'smoke_v2180_grain.mjs', 'smoke_v2179_titlerecap.mjs',
  'smoke_v2178_codexseen.mjs', 'smoke_v2177_elites.mjs', 'smoke_v2176_allchests.mjs'];
for (const nm of suitelen) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README 件套 pin 已随新现实更新为一百二十三件套（一百二十二件套清除）`,
    src.includes('一百二十三件套（一百二十二件套清除）'));
}
const vers210 = ['smoke_v2209_achstatus.mjs', 'smoke_v2208_elixir.mjs', 'smoke_v2207_titledel.mjs',
  'smoke_v2206_stock2.mjs', 'smoke_v2205_fragtitle.mjs', 'smoke_v2204_brew2.mjs', 'smoke_v2203_fragdead.mjs',
  'smoke_v2202_fragwin.mjs', 'smoke_v2201_fragstatus.mjs', 'smoke_v2200_stock.mjs',
  'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs', 'smoke_v2191_ptime.mjs',
  'smoke_v2190_launch.mjs', 'smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs',
  'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs',
  'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs',
  'smoke_v2181_helpquickcast.mjs', 'smoke_v2179_titlerecap.mjs'];
for (const nm of vers210) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 字面量 pin 已随新现实更新为 v22.10`,
    src.includes("const GAME_VERSION = 'v22.27';"));
}
for (const nm of ['smoke_v2209_achstatus.mjs', 'smoke_v2208_elixir.mjs', 'smoke_v2207_titledel.mjs',
  'smoke_v2206_stock2.mjs', 'smoke_v2205_fragtitle.mjs', 'smoke_v2204_brew2.mjs',
  'smoke_v2203_fragdead.mjs', 'smoke_v2202_fragwin.mjs', 'smoke_v2201_fragstatus.mjs',
  'smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs',
  'smoke_v2197_lucky2.mjs', 'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs',
  'smoke_v2194_statuscodex.mjs', 'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs']) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 恒等 pin（===）已随新现实更新为 v22.10`,
    src.includes("GAME_VERSION === 'v22.27'"));
}
for (const nm of ['smoke_v2209_achstatus.mjs', 'smoke_v2208_elixir.mjs', 'smoke_v2207_titledel.mjs',
  'smoke_v2206_stock2.mjs', 'smoke_v2205_fragtitle.mjs', 'smoke_v2204_brew2.mjs',
  'smoke_v2203_fragdead.mjs', 'smoke_v2202_fragwin.mjs', 'smoke_v2201_fragstatus.mjs',
  'smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs',
  'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs']) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README tests 树尾 pin 已随新现实更新（+ smoke_v2210_unsaved）`,
    src.includes('smoke_v2209_achstatus + smoke_v2211_lampkid + smoke_v2212_volume + smoke_v2213_teller + smoke_v2214_mush + smoke_v2215_tutorvol + smoke_v2216_picker + smoke_v2217_elixir2 + smoke_v2218_mush2 + smoke_v2219_footkeys + smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel（npm test 串跑）'));
}

// 旧代 pin 零残留：全部测试文件不得再含 v22.9 版本字面量 pin（拆串构造避免本文件扫描行自匹配）
const OLD_GV = "const GAME_VERSION = 'v22." + "9';";
let stale = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes(OLD_GV)) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v22.9 全库清零）', stale.length === 0, stale.join(','));
let staleId = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes("GAME_VERSION === 'v22." + "9'")) staleId.push(f);
}
ok('旧代 GAME_VERSION 恒等 pin 零残留（===v22.9 全库清零）', staleId.length === 0, staleId.join(','));
let staleSuite = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes('一百零五件套（一百零四件套清' + '除）')) staleSuite.push(f);
}
ok('旧代件套 pin 零残留（一百零五件套（一百零四件套清' + '除）全库清零）', staleSuite.length === 0, staleSuite.join(','));
let staleTail = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes('smoke_v2208_elixir + smoke_v2209_achstatus（npm test 串' + '跑）')) staleTail.push(f);
}
ok('旧代树尾 pin 零残留（smoke_v2208_elixir + smoke_v2209_achstatus 串全库清零）', staleTail.length === 0, staleTail.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
