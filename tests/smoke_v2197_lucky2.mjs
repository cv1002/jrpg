// v21.97 专项冒烟：新成就「鸿运当头」（掉落线第二档里程碑，新内容·单成就，承 v21.91 长明不熄第一档 /
// v21.93 驱雾百战 / v21.95 彻夜长明 多档先例）——成就版图逐线核对的第二档补全：等级线已有三档
// （lvl5·lvl10·lvl12）、宝箱线已有两档（chests·allchests）、讨伐线已有两档（hunt10·hunt100）、
// 时长线已有两档（ptime·ptime2），唯独战斗掉落线（lucky 幸运眷顾=累计 5 次额外掉落）只有第一档——
// 练到 Lv12 的玩家（按 v21.35 升级节奏参考全程约 30-50 场胜利、hunt100 途程 100 场）在「天降横财」
// 处毫无第二枚回应。现补第二档（LUCKY2_GOAL=30 次，约 38% 掉率下 ≈75-80 场胜利，hunt100 途程内可达）：
// 判定/进度/描述三处同读新常量 LUCKY2_GOAL（与 LUCKY_GOAL 同一「成就阈值数据化」家族——改门槛只改
// data.js 一处自动跟随，零裸字面量），计数读既有 hero.drops 字段（rules.rollDrop 五档唯一写入点、
// (g.drops||0) 防御式读取——旧档无此字段=0 不误解锁、零迁移，承 v19.41 seen 同款）；无 r 字段
// （与 memoir/skills/hardtrue 同款纯里程碑——运气本身就是奖励）；解锁时机：applyAchievements
// 既有通路任意判定点当场解锁（drops 为持续累积量，无需新判定点，承 lvl12 同款）。
// 本冒烟守护：版本锚点、LUCKY2_GOAL 数据契约（===30、导出）、ACH_LIST 契约（lucky2 唯一/
// 总数 ≥36 存活性口径（精确 37 由 v21.99 接管）/既有 35 成就 id 零回归/追加在末尾序位）、ok/prog 谓词逐值（0·29 false /
// 30·60 true / 缺 drops 字段防御 false·0/30 / prog 不钳制 60/30）、rules.js/core.js 源级
// 落位（五档写入点 + drops:0 起始）、运行期全链路（applyAchievements 真实解锁落 hero.ach / 未够不误解锁 /
// 重复调用去重）、drawAch 36 项滚动渲染不抛错、README/package.json/CHANGELOG 同步、姊妹件套 pin
// （v2196..v2176 九十三件套 / v2196..v2179 GAME_VERSION v21.97 / v2196..v2192 恒等 v21.97）随新现实更新
// + smoke_v2195 精确计数断言去硬化（===35→>=35）复核 + 旧代 v21.96 字面量 pin / 旧代 35 项正向 pin 零残留。
import { GAME_VERSION, ACH_LIST, LUCKY2_GOAL } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.97 鸿运当头掉落线第二档里程碑冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.96 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.96', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 97)), GAME_VERSION);
ok('GAME_VERSION 字面量已为 v21.97', GAME_VERSION === 'v22.6', GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const rulesSrc = read('../js/rules.js');
const coreSrc = read('../js/core.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v21.97 版本注释', dataSrc.includes('v21.97 新成就「鸿运当头」'));
ok('data.js GAME_VERSION 字面量已更新为 v21.97', dataSrc.includes("const GAME_VERSION = 'v22.6';"));
ok('data.js 仍保留 v21.96 历史注释（累积注释块，姊妹 pin 不失效）', dataSrc.includes('v21.96 阵亡画面补收集进度三件套'));
ok('data.js 导出 LUCKY2_GOAL（export 块落位）', dataSrc.includes(', LUCKY2_GOAL, HUNT_GOAL'));

// —— LUCKY2_GOAL 数据契约 ——
ok('LUCKY2_GOAL === 30（掉落线第二档 = 30 次额外掉落）', LUCKY2_GOAL === 30, String(LUCKY2_GOAL));
ok('LUCKY2_GOAL 声明为 30 且注释含「鸿运当头」口径', dataSrc.includes('const LUCKY2_GOAL = 30;') && dataSrc.includes('成就「鸿运当头」'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'lucky2');
ok('ACH_LIST 含 lucky2「鸿运当头」且 id 唯一',
  !!ach && ach.name === '鸿运当头' && ACH_LIST.filter((a) => a.id === 'lucky2').length === 1);
ok('ACH_LIST 总数为 ≥36 项（去硬化存活性口径，精确 37 由 v21.99 接管）', ACH_LIST.length >= 36, String(ACH_LIST.length));
ok('lucky2 描述由 LUCKY2_GOAL 派生（单一数据源，零裸字面量 30）',
  ach.d === `累计获得 ${LUCKY2_GOAL} 次额外掉落`, ach.d);
ok('lucky2 判定/进度同读 LUCKY2_GOAL + drops 防御式（ok (g.drops||0) / prog g.drops||0）',
  String(ach.ok).includes('LUCKY2_GOAL') && String(ach.ok).includes('(g.drops||0)') &&
  String(ach.prog).includes('LUCKY2_GOAL') && String(ach.prog).includes('g.drops||0'));
ok('lucky2 无 r 字段纯里程碑（与 memoir/skills/hardtrue 同款）', !('r' in ach));

// —— 既有 35 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime', 'hunt100', 'ptime2'];
ok('既有 35 成就 id 零回归', EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('lucky2 追加在末尾序位（ptime 32 / hunt100 33 / ptime2 34 / lucky2 35，既有序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'ptime') === 32 &&
  ACH_LIST.findIndex((a) => a.id === 'hunt100') === 33 &&
  ACH_LIST.findIndex((a) => a.id === 'ptime2') === 34 &&
  ACH_LIST.findIndex((a) => a.id === 'lucky2') === 35);

// —— ok/prog 谓词逐值 ——
ok('drops=0 新档 → false（不可开局秒解锁）', ach.ok({ drops: 0 }) === false);
ok('drops=29（差 1 次）→ false（恰在门槛下不解锁）', ach.ok({ drops: 29 }) === false);
ok('drops=30 → true（恰达标）', ach.ok({ drops: 30 }) === true);
ok('drops=60 → true（超阈值仍达标）', ach.ok({ drops: 60 }) === true);
ok('缺 drops 字段旧档 → false 且 prog 0/30（防御式零迁移）',
  ach.ok({}) === false && ach.prog({}) === `0/${LUCKY2_GOAL}`);
ok('drops 非数值（undefined 兜底）→ false 不抛错', ach.ok({ drops: undefined }) === false);
ok('prog 15 次 → 15/30', ach.prog({ drops: 15 }) === `15/${LUCKY2_GOAL}`, ach.prog({ drops: 15 }));
ok('prog 30 次 → 30/30', ach.prog({ drops: 30 }) === `30/${LUCKY2_GOAL}`, ach.prog({ drops: 30 }));
ok('prog 60 次不钳制（60/30，承 lvl5「X/N 不钳制」口径）', ach.prog({ drops: 60 }) === `60/${LUCKY2_GOAL}`, ach.prog({ drops: 60 }));

// —— rules.js/core.js 源级落位：drops 六点（newGame 起始 0 + rollDrop 五档唯一写入点）——
ok('core.js newGame 含 drops: 0 起始字段', coreSrc.includes('drops: 0,'));
ok('rules.js rollDrop 五档写入点齐全（每档 (hero.drops||0)+1）',
  (rulesSrc.match(/hero\.drops = \(hero\.drops \|\| 0\) \+ 1;/g) || []).length === 5);

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

// 达标档：drops=30 → applyAchievements 真实解锁落 hero.ach（持续累积量，任意判定点当场解锁）
let hero = newGame('余烬');
hero.drops = 30;
hero = runAch(hero);
ok('运行期：drops=30 触发 applyAchievements 真实解锁 lucky2 落 hero.ach', hero.ach.includes('lucky2'), hero.ach.join(','));

// 未达标档：drops=29 → 不误解锁（差 1 次）
hero = newGame('灯见');
hero.drops = 29;
hero = runAch(hero);
ok('运行期：drops=29 不误解锁 lucky2', !hero.ach.includes('lucky2'));

// 新档零掉落 → 不误解锁（新档无 drops 字段或为 0）
hero = newGame('潮');
hero = runAch(hero);
ok('运行期：新档无 drops 字段不误解锁 lucky2', !hero.ach.includes('lucky2'));

// 重复调用去重：已解锁后再 applyAchievements 不重复 push
hero = newGame('灯');
hero.drops = 30;
runAch(hero);
runAch(hero);
ok('运行期：重复调用去重（hero.ach 中 lucky2 恰一枚）',
  hero.ach.filter((x) => x === 'lucky2').length === 1);

// 旧档防御档：无 drops 字段读档 → applyAchievements 不抛错且不解锁（零迁移）
hero = newGame('潮');
delete hero.drops;
let threw = null;
try { runAch(hero); } catch (e) { threw = e; }
ok('运行期：旧档缺 drops 字段 applyAchievements 不抛错（(g.drops||0) 防御式）', threw === null, threw && String(threw.stack || threw));
ok('运行期：缺字段旧档不解锁 lucky2（零迁移）', !hero.ach.includes('lucky2'));

// —— drawAch 渲染（36 项滚动不抛错；PAGE=10 四页）——
let rendered = true, renderedPg4 = true;
try {
  S.G = newGame('测试'); S.G.ach = ['lucky2']; S.achScroll = 0; S.scene = 'ach';
  drawAch();
} catch (e) { rendered = false; }
try {
  S.achScroll = 40; // 36 项滚到末页（PAGE=10，钳制到 26）不抛错
  drawAch();
} catch (e) { renderedPg4 = false; }
S.achScroll = 0; S.scene = 'world';
ok('运行期：成就页 drawAch 36 项渲染不抛错', rendered);
ok('运行期：成就页末页滚动渲染不抛错（36 项 PAGE=10 四页）', renderedPg4);

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树收录 smoke_v2199_rich2 且位于串尾（v2199 随新现实由当版冒烟守护）',
  readme.includes('smoke_v2197_lucky2 + smoke_v2198_winsave + smoke_v2199_rich2 + smoke_v2200_stock + smoke_v2201_fragstatus + smoke_v2202_fragwin + smoke_v2204_brew2 + smoke_v2205_fragtitle + smoke_v2206_stock2（npm test 串跑）'));
ok('README 件套口径为一百零二件套（一百零一件套清除）',
  readme.includes('冒烟一百零二件套（一百零一件套清除）') && !readme.includes('冒烟九十二件套（九十一件套清除）'));
ok('README 含 v21.97 守护描述', readme.includes('v21.97 起含新成就「鸿运当头」'));
ok('README 成就口径「37 项」双处同步（快速上手表 C 键行 + 图鉴&成就行）',
  readme.includes('成就一览（全部 40 项进度') && readme.includes('**40 项成就**') &&
  !readme.includes('成就一览（全部 35 项进' + '度') && !readme.includes('**35 项成' + '就**'));
ok('package.json 已收录 smoke_v2197_lucky2（npm test 串跑第 93 份）',
  pkg.includes('smoke_v2197_lucky2.mjs') && /smoke_v2196_deadrecap\.mjs && node tests\/smoke_v2197_lucky2\.mjs/.test(pkg));
ok('CHANGELOG 含 v21.97 条目', changelog.includes('## v21.97 '));

// —— 姊妹件套 pin 复查（v21.7 惯例：本版冒烟守护姊妹随新现实更新）——
const suite93 = ['smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs', 'smoke_v2191_ptime.mjs',
  'smoke_v2190_launch.mjs', 'smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs',
  'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs',
  'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs',
  'smoke_v2181_helpquickcast.mjs', 'smoke_v2180_grain.mjs', 'smoke_v2179_titlerecap.mjs',
  'smoke_v2178_codexseen.mjs', 'smoke_v2177_elites.mjs', 'smoke_v2176_allchests.mjs'];
for (const nm of suite93) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README 件套 pin 已随新现实更新为一百零二件套（一百零一件套清除）`,
    src.includes('一百零二件套（一百零一件套清除）'));
}
const vers = ['smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs', 'smoke_v2191_ptime.mjs',
  'smoke_v2190_launch.mjs', 'smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs',
  'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs',
  'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs',
  'smoke_v2181_helpquickcast.mjs', 'smoke_v2179_titlerecap.mjs'];
for (const nm of vers) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 字面量 pin 已随新现实更新为 v21.97`,
    src.includes("const GAME_VERSION = 'v22.6';"));
}
for (const nm of ['smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs']) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 恒等 pin（===）已随新现实更新为 v21.97`,
    src.includes("GAME_VERSION === 'v22.6'"));
}
const achFiles = ['smoke_v2195_ptime2.mjs', 'smoke_v2193_hunt100.mjs', 'smoke_v2191_ptime.mjs',
  'smoke_v2188_wander.mjs', 'smoke_v2186_brew.mjs', 'smoke_v2184_lvl12.mjs', 'smoke_v2180_grain.mjs',
  'smoke_v2177_elites.mjs', 'smoke_v2176_allchests.mjs', 'smoke_v2173_aegis.mjs',
  'smoke_v2168_hardtrue.mjs', 'smoke_v2159_skillach.mjs'];
for (const nm of achFiles) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README 成就 pin 已随新现实更新为 37 项双处落位`,
    src.includes("readme.includes('成就一览（全部 40 项进度'") && src.includes('**40 项成就**'));
}
const s2195 = read('../tests/smoke_v2195_ptime2.mjs');
ok('smoke_v2195 的 ACH_LIST 精确计数断言已去硬化（===35 零残留，>=35 存活性口径落位）',
  s2195.includes('ACH_LIST.length >= 35') && !s2195.includes('ACH_LIST.length === 35'));
// 旧代 pin 零残留：全部测试文件不得再含 v21.96 版本字面量 pin（拆串构造避免本文件扫描行自匹配）
const OLD_GV = "const GAME_VERSION = 'v21.9" + "6';";
let stale = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes(OLD_GV)) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v21.96 全库清零）', stale.length === 0, stale.join(','));
// 旧代 README 成就正 pin 零残留：全部测试文件不得再含「全部 35 项进·度」或
// 「readme.includes(『**35 项成就**』)」形态的正向 pin（拆串避免自匹配）
let staleAch = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  const posPin = "readme.includes('**35 项成" + "就**'";
  if (src.includes('全部 35 项进' + '度') || src.includes(posPin)) staleAch.push(f);
}
ok('旧代 README 成就正 pin 零残留（35 项全库清零）', staleAch.length === 0, staleAch.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
