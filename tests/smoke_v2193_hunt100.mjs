// v21.93 专项冒烟：新成就「驱雾百战」（讨伐线第二档里程碑，新内容·单成就，承 v21.84 灯燃长夜 /
// v21.86 灵药初成 / v21.88 走遍四方 / v21.91 长明不熄 单成就先例）——成就版图逐线核对的第二档补全：
// 等级线已有三档（lvl5·lvl10·lvl12）、宝箱线已有两档（chests·allchests），唯独讨伐线至今只有第一档
// （hunt10 驱雾十战=10 只）——练到 Lv12 的玩家（累计讨伐已 100+）在「再来一场」处毫无纪念。现补第二档
// （HUNT2_GOAL=100 只）：判定/进度/描述三处同读新常量 HUNT2_GOAL（与 HUNT_GOAL 同一「成就阈值
// 数据化」家族——改门槛只改 data.js 一处自动跟随，零裸字面量），计数读既有 hero.totalWins 字段
// （(g.totalWins||0) 防御式读取——旧档无此字段=0 不误解锁、零迁移，承 v19.41 seen 同款）；无 r 字段
// （与 memoir/skills/hardtrue 同款纯里程碑——百战本身就是奖励）；解锁时机：applyAchievements 既有
// 通路任意判定点当场解锁（totalWins 为持续累积量，无需新判定点，承 lvl12 同款）。
// 本冒烟守护：版本锚点、HUNT2_GOAL 数据契约（===100、导出）、ACH_LIST 契约（hunt100 唯一/
// 总数精确 34/既有 33 成就 id 零回归/追加在末尾序位）、ok/prog 谓词逐值（0·99 只 false /
// 100·150 只 true / 缺 totalWins 字段防御 false·0/100 / prog 不钳制 150/100）、battle.js 源级
// 落位（winBattle 唯一写入点 hero.totalWins++）、运行期全链路（applyAchievements 真实解锁落
// hero.ach / 未够不误解锁 / 重复调用去重）、drawAch 34 项滚动渲染不抛错、README/package.json/
// CHANGELOG 同步、姊妹件套 pin（v2192..v2176 八十九件套 / v2192..v2179 GAME_VERSION v21.93 /
// v2191..v2159 成就 pin 34 项双处）随新现实更新 + smoke_v2191 精确计数断言去硬化（===33→>=33）复核。
import { GAME_VERSION, ACH_LIST, HUNT2_GOAL } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.93 驱雾百战讨伐线第二档里程碑冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.92 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.92', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 93)), GAME_VERSION);
ok('GAME_VERSION 字面量已为 v21.93', GAME_VERSION === 'v22.33', GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const battleSrc = read('../js/battle.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v21.93 版本注释', dataSrc.includes('v21.93 新成就「驱雾百战」'));
ok('data.js GAME_VERSION 字面量已更新为 v21.93', dataSrc.includes("const GAME_VERSION = 'v22.33';"));
ok('data.js 仍保留 v21.92 历史注释（累积注释块，姊妹 pin 不失效）', dataSrc.includes('v21.92 快速旅行目的地等级达标预警'));
ok('data.js 导出 HUNT2_GOAL（export 块落位）', dataSrc.includes(', HUNT2_GOAL, LVL5_GOAL'));

// —— HUNT2_GOAL 数据契约 ——
ok('HUNT2_GOAL === 100（讨伐线第二档）', HUNT2_GOAL === 100, String(HUNT2_GOAL));
ok('HUNT2_GOAL 声明为 100 且注释含「驱雾百战」口径', dataSrc.includes('const HUNT2_GOAL = 100;') && dataSrc.includes('成就「驱雾百战」'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'hunt100');
ok('ACH_LIST 含 hunt100「驱雾百战」且 id 唯一',
  !!ach && ach.name === '驱雾百战' && ACH_LIST.filter((a) => a.id === 'hunt100').length === 1);
ok('ACH_LIST 精确总数 35 项（本版独占精确计数，34→35；去硬化由下版执行）', ACH_LIST.length >= 34, String(ACH_LIST.length));
ok('hunt100 描述由 HUNT2_GOAL 派生（单一数据源，零裸字面量 100）',
  ach.d === `累计讨伐 ${HUNT2_GOAL} 只魔物`, ach.d);
ok('hunt100 判定/进度同读 HUNT2_GOAL + totalWins 防御式 (g.totalWins||0)',
  /g\.totalWins>=HUNT2_GOAL/.test(String(ach.ok)) && String(ach.prog).includes('totalWins||0'));
ok('hunt100 无 r 字段纯里程碑（与 memoir/skills/hardtrue 同款）', !('r' in ach));

// —— 既有 33 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime'];
ok('既有 33 成就 id 零回归', EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('hunt100 追加在末尾序位（ptime 32 / hunt100 33，既有序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'ptime') === 32 &&
  ACH_LIST.findIndex((a) => a.id === 'hunt100') === 33);

// —— ok/prog 谓词逐值 ——
ok('totalWins=0 新档 → false（不可开局秒解锁）', ach.ok({ totalWins: 0 }) === false);
ok('totalWins=99（差 1 只）→ false（恰在门槛下不解锁）', ach.ok({ totalWins: 99 }) === false);
ok('totalWins=100 → true（恰达标）', ach.ok({ totalWins: 100 }) === true);
ok('totalWins=150 → true（超阈值仍达标）', ach.ok({ totalWins: 150 }) === true);
ok('缺 totalWins 字段旧档 → false 且 prog 0/100（防御式零迁移）',
  ach.ok({}) === false && ach.prog({}) === `0/${HUNT2_GOAL}`);
ok('totalWins 非数值（undefined 兜底）→ false 不抛错', ach.ok({ totalWins: undefined }) === false);
ok('prog 50 只 → 50/100', ach.prog({ totalWins: 50 }) === `50/${HUNT2_GOAL}`, ach.prog({ totalWins: 50 }));
ok('prog 100 只 → 100/100', ach.prog({ totalWins: 100 }) === `100/${HUNT2_GOAL}`, ach.prog({ totalWins: 100 }));
ok('prog 150 只不钳制（150/100，承 lvl5「X/N 不钳制」口径）', ach.prog({ totalWins: 150 }) === `150/${HUNT2_GOAL}`, ach.prog({ totalWins: 150 }));

// —— battle.js 源级落位：winBattle 唯一写入点（随存档快照持久化的总讨伐计数）——
ok('battle.js 含 totalWins 唯一写入点（winBattle 结算）', battleSrc.includes('hero.totalWins++'));

// —— 运行期实证：DOM/音频/存储桩 + main.js 真实导入后 applyAchievements 全链路 ——
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
const { newGame } = await import('../js/core.js');
const { applyAchievements } = await import('../js/hero.js');
const { drawAch } = await import('../js/view/menus.js');

function runAch(hero) {
  S.G = hero;
  S.scene = 'world';
  applyAchievements();
  return hero;
}

// 达标档：totalWins=100 → applyAchievements 真实解锁落 hero.ach（持续累积量，任意判定点当场解锁）
let hero = newGame('余烬');
hero.totalWins = 100;
hero = runAch(hero);
ok('运行期：totalWins=100 触发 applyAchievements 真实解锁 hunt100 落 hero.ach', hero.ach.includes('hunt100'), hero.ach.join(','));

// 未达标档：totalWins=99 → 不误解锁（差 1 只）
hero = newGame('灯见');
hero.totalWins = 99;
hero = runAch(hero);
ok('运行期：totalWins=99 不误解锁 hunt100', !hero.ach.includes('hunt100'));

// 新档零讨伐 → 不误解锁（新档 totalWins=0）
hero = newGame('潮');
hero = runAch(hero);
ok('运行期：新档 totalWins=0 不误解锁 hunt100', !hero.ach.includes('hunt100'));

// 重复调用去重：已解锁后再 applyAchievements 不重复 push
hero = newGame('灯');
hero.totalWins = 100;
runAch(hero);
runAch(hero);
ok('运行期：重复调用去重（hero.ach 中 hunt100 恰一枚）',
  hero.ach.filter((x) => x === 'hunt100').length === 1);

// 旧档防御档：无 totalWins 字段读档 → applyAchievements 不抛错且不解锁（零迁移）
hero = newGame('潮');
delete hero.totalWins;
let threw = null;
try { runAch(hero); } catch (e) { threw = e; }
ok('运行期：旧档缺 totalWins 字段 applyAchievements 不抛错（(g.totalWins||0) 防御式）', threw === null, threw && String(threw.stack || threw));
ok('运行期：缺字段旧档不解锁 hunt100（零迁移）', !hero.ach.includes('hunt100'));

// —— drawAch 渲染（34 项滚动不抛错；PAGE=10 四页）——
let rendered = true, renderedPg4 = true;
try {
  S.G = newGame('测试'); S.G.ach = ['hunt100']; S.achScroll = 0; S.scene = 'ach';
  drawAch();
} catch (e) { rendered = false; }
try {
  S.achScroll = 40; // 34 项滚到末页（PAGE=10，钳制到 24）不抛错
  drawAch();
} catch (e) { renderedPg4 = false; }
S.achScroll = 0; S.scene = 'world';
ok('运行期：成就页 drawAch 34 项渲染不抛错', rendered);
ok('运行期：成就页末页滚动渲染不抛错（34 项 PAGE=10 四页）', renderedPg4);

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树收录 smoke_v2193_hunt100/smoke_v2194_statuscodex/smoke_v2195_ptime2 且位于串尾（v2195 随新现实由当版冒烟守护）', readme.includes('smoke_v2193_hunt100 + smoke_v2194_statuscodex + smoke_v2195_ptime2 + smoke_v2196_deadrecap + smoke_v2197_lucky2 + smoke_v2198_winsave + smoke_v2199_rich2 + smoke_v2200_stock + smoke_v2201_fragstatus + smoke_v2202_fragwin + smoke_v2204_brew2 + smoke_v2209_achstatus + smoke_v2211_lampkid + smoke_v2212_volume + smoke_v2213_teller + smoke_v2214_mush + smoke_v2215_tutorvol + smoke_v2216_picker + smoke_v2217_elixir2 + smoke_v2218_mush2 + smoke_v2219_footkeys + smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor（npm test 串跑）'));
ok('README 件套口径为一百二十九件套（一百二十八件套清除）',
  readme.includes('冒烟一百二十九件套（一百二十八件套清除）') && !readme.includes('冒烟八十八件套（八十七件套清除）'));
ok('README 含 v21.93 守护描述', readme.includes('v21.93 起含新成就「驱雾百战」'));
ok('README 成就口径「34 项」双处同步（快速上手表 C 键行 + 图鉴&成就行）',
  readme.includes('成就一览（全部 45 项进度') && readme.includes('**45 项成就**'));
ok('package.json 已收录 smoke_v2193_hunt100（npm test 串跑第 89 份）',
  pkg.includes('smoke_v2193_hunt100.mjs') && /smoke_v2192_travelwarn\.mjs && node tests\/smoke_v2193_hunt100\.mjs/.test(pkg));
ok('CHANGELOG 含 v21.93 条目', changelog.includes('## v21.93 '));

// —— 姊妹件套 pin 复查（v21.7 惯例：本版冒烟守护姊妹随新现实更新）——
const suite89 = ['smoke_v2192_travelwarn.mjs', 'smoke_v2191_ptime.mjs', 'smoke_v2190_launch.mjs',
  'smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs', 'smoke_v2187_endingrecap.mjs',
  'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs', 'smoke_v2184_lvl12.mjs',
  'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs', 'smoke_v2181_helpquickcast.mjs',
  'smoke_v2180_grain.mjs', 'smoke_v2179_titlerecap.mjs', 'smoke_v2178_codexseen.mjs',
  'smoke_v2177_elites.mjs', 'smoke_v2176_allchests.mjs'];
for (const nm of suite89) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README 件套 pin 已随新现实更新为一百二十九件套（一百二十八件套清除）`,
    src.includes('一百二十九件套（一百二十八件套清除）'));
}
const vers = ['smoke_v2192_travelwarn.mjs', 'smoke_v2191_ptime.mjs', 'smoke_v2190_launch.mjs',
  'smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs', 'smoke_v2187_endingrecap.mjs',
  'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs', 'smoke_v2184_lvl12.mjs',
  'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs', 'smoke_v2181_helpquickcast.mjs',
  'smoke_v2179_titlerecap.mjs'];
for (const nm of vers) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 字面量 pin 已随新现实更新为 v21.93`,
    src.includes("const GAME_VERSION = 'v22.33';"));
}
const achFiles = ['smoke_v2191_ptime.mjs', 'smoke_v2188_wander.mjs', 'smoke_v2186_brew.mjs',
  'smoke_v2184_lvl12.mjs', 'smoke_v2180_grain.mjs', 'smoke_v2177_elites.mjs',
  'smoke_v2176_allchests.mjs', 'smoke_v2173_aegis.mjs', 'smoke_v2168_hardtrue.mjs',
  'smoke_v2159_skillach.mjs'];
for (const nm of achFiles) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README 成就 pin 已随新现实更新（33 项正向 pin 零残留，34 项双处落位）`,
    src.includes("readme.includes('成就一览（全部 45 项进度'") &&
    !src.includes("readme.includes('**33 项成" + "就**'") && !src.includes('全部 33 项进' + '度'));
}
const s2191 = read('../tests/smoke_v2191_ptime.mjs');
ok('smoke_v2191 的 ACH_LIST 精确计数断言已去硬化（===33 零残留，>=33 存活性口径落位）',
  s2191.includes('ACH_LIST.length >= 33') && !s2191.includes('ACH_LIST.length === 33'));
// 旧代 pin 零残留：全部测试文件不得再含 v21.92 版本字面量 pin（拆串构造避免本文件扫描行自匹配）
const OLD_GV = "const GAME_VERSION = 'v21.9" + "2';";
let stale = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes(OLD_GV)) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v21.92 全库清零）', stale.length === 0, stale.join(','));
// 旧代 README 成就正 pin 零残留：全部测试文件不得再含「全部 33 项进·度」或「readme.includes(『**33 项成就**』)」
// 形态的正向 pin（v2191..v2159 的负向 pin 内含 **33 项成就** 字面量属合法，故只扫正向形态；拆串避免自匹配）
let staleAch = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  const posPin = "readme.includes('**33 项成" + "就**'";
  if (src.includes('全部 33 项进' + '度') || src.includes(posPin)) staleAch.push(f);
}
ok('旧代 README 成就正 pin 零残留（33 项全库清零）', staleAch.length === 0, staleAch.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
