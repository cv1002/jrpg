// v22.14 专项冒烟：新成就「菇香满仓」（魔法蘑菇持有线首枚里程碑，新内容·单成就，承 v22.0 有备无患 /
// v22.4 妙手回春 / v22.6 药香满囊 / v22.8 灵药盈囊 单成就先例）——成就版图逐线核对的空白补齐：
// v22.8 补灵药线时逐线核对漏了蘑菇——等级/宝箱/讨伐/时长/掉落/金币/酿造/药水/灵药各线都有印记，
// 唯独「持有魔法蘑菇」这条灯油主题资源线（宝箱 60% 蘑菇/精英必掉 1 株/战斗掉落 12% 三源，酿造 2 株/
// 卖菇 10 金双消耗）没有任何纪念（brew 灵药初成/brew2 妙手回春 记的是「酿造」行为）。现补首枚
// （MUSH_GOAL=10 株）：判定/描述/进度三处同读新常量 MUSH_GOAL（与 ELIXIR_STOCK_GOAL 同一「成就阈值
// 数据化」家族——改门槛只改 data.js 一处自动跟随，零裸字面量），计数读既有 hero.mushrooms 存档字段
// （newGame 起始 0、开箱 world.onStep/精英必掉 battle.winBattle/战斗掉落 rules.rollDrop 写定、酿造/卖菇
// 扣减，随存档快照持久化），(g.mushrooms||0) 防御式读取旧档零迁移，承 elixir 同款；无 r 字段纯里程碑
// （蘑菇本身就是奖励）；解锁时机：applyAchievements 既有通路当场解锁（胜利 winBattle/酿造 brewNow/
// 进图 transition 当场判定；开箱 onChestStep 判定点在落株之前，经开箱集齐第 10 株于下一判定点解锁，
// 反馈不迟到——承 lvl12/lucky2 同款，先囤菇再酿再卖也照常解锁，已解锁不因消耗回落而撤销）。
// 本冒烟守护：版本锚点、MUSH_GOAL 数据契约（===10、声明与导出）、ACH_LIST 契约（mush 唯一/总数精确
// 42/既有 41 成就 id 零回归/追加在末尾序位）、ok/prog 谓词逐值（0·9 false / 10·99 true / 缺 mushrooms
// 字段防御 false·0/10 / prog 不钳制 99/10）、源级落位（core.newGame mushrooms: 0 起始 + world/battle/
// rules 三个写入点 + world/battle/core 既有 applyAchievements 通路）、运行期全链路（applyAchievements
// 真实解锁落 hero.ach / 未够不误解锁 / 兄弟成就零误触发 / 重复调用去重）、drawAch 42 项滚动渲染不抛错、
// README/package.json/CHANGELOG 同步、姊妹件套 pin（v2213..v2176 一百一十件套 / v2213..v2179
// GAME_VERSION v22.14 / v2192..v2210 恒等 v22.14 / v2192..v2213 树尾 pin / v2208..v2159 成就 pin）
// 随新现实更新 + smoke_v2208/v2209 精确计数断言去硬化（===41→>=41）复核 + 旧代 v22.13 字面量 pin /
// 旧代恒等 pin / 旧代一百零九件套 pin / 旧代树尾 pin / 旧代 41 项正向 pin 零残留。
import { GAME_VERSION, ACH_LIST, MUSH_GOAL, ELIXIR_STOCK_GOAL, MUSHROOM_GOAL } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.14 菇香满仓魔法蘑菇持有线首枚里程碑冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v22.13 + 精确 v22.14 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.13', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 14)), GAME_VERSION);
ok('GAME_VERSION 字面量已为 v22.14（本版独占精确锚点）', GAME_VERSION === 'v22.14', GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const coreSrc = read('../js/core.js');
const worldSrc = read('../js/world.js');
const battleSrc = read('../js/battle.js');
const rulesSrc = read('../js/rules.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v22.14 版本注释', dataSrc.includes('v22.14 新成就「菇香满仓」'));
ok('data.js GAME_VERSION 字面量已更新为 v22.14', dataSrc.includes("const GAME_VERSION = 'v22.14';"));
ok('data.js 仍保留 v22.13 历史注释（累积注释块，姊妹 pin 不失效）', dataSrc.includes('v22.13 潮灯镇说书人'));
ok('data.js 导出 MUSH_GOAL（export 块落位，与 MUSHROOM_GOAL 相邻）', dataSrc.includes('MUSHROOM_GOAL, MUSH_GOAL, MIST_GOAL'));

// —— MUSH_GOAL 数据契约 ——
ok('MUSH_GOAL === 10（蘑菇持有线首枚 = 持有 10 株魔法蘑菇）', MUSH_GOAL === 10, String(MUSH_GOAL));
ok('MUSH_GOAL 声明为 10 且注释含「菇香满仓」口径', dataSrc.includes('const MUSH_GOAL = 10;') && dataSrc.includes('成就「菇香满仓」'));
ok('MUSH_GOAL 与灯长支线 MUSHROOM_GOAL 互不干扰（===3 零回归）', MUSHROOM_GOAL === 3, String(MUSHROOM_GOAL));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'mush');
ok('ACH_LIST 含 mush「菇香满仓」且 id 唯一',
  !!ach && ach.name === '菇香满仓' && ACH_LIST.filter((a) => a.id === 'mush').length === 1);
ok('ACH_LIST 精确总数 42 项（本版独占精确计数，41→42）', ACH_LIST.length === 42, String(ACH_LIST.length));
ok('mush 描述由 MUSH_GOAL 派生（单一数据源，零裸字面量 10）',
  ach.d === `持有 ${MUSH_GOAL} 株魔法蘑菇`, ach.d);
ok('mush 判定/进度同读 MUSH_GOAL + mushrooms 防御式（ok (g.mushrooms||0) / prog (g.mushrooms||0)）',
  String(ach.ok).includes('MUSH_GOAL') && String(ach.ok).includes('g.mushrooms||0') &&
  String(ach.prog).includes('MUSH_GOAL') && String(ach.prog).includes('g.mushrooms||0'));
ok('mush 无 r 字段纯里程碑（与 rich/memoir/skills/hardtrue 同款）', !('r' in ach));

// —— 既有 41 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime', 'hunt100', 'ptime2', 'lucky2', 'rich2', 'stock', 'brew2', 'stock2', 'elixir'];
ok('既有 41 成就 id 零回归', EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('mush 追加在末尾序位（elixir 40 / mush 41，既有序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'elixir') === 40 &&
  ACH_LIST.findIndex((a) => a.id === 'mush') === 41);

// —— ok/prog 谓词逐值 ——
ok('mushrooms=0（防御分支，未达标）→ false', ach.ok({ mushrooms: 0 }) === false);
ok('mushrooms=9（差 1 株）→ false（恰在门槛下不解锁）', ach.ok({ mushrooms: 9 }) === false);
ok('mushrooms=10 → true（恰达标）', ach.ok({ mushrooms: 10 }) === true);
ok('mushrooms=99（无上限）→ true（超阈值仍达标）', ach.ok({ mushrooms: 99 }) === true);
ok('缺 mushrooms 字段旧档 → false 且 prog 0/10（防御式零迁移）',
  ach.ok({}) === false && ach.prog({}) === `0/${MUSH_GOAL}`);
ok('mushrooms 非数值（undefined 兜底）→ false 不抛错', ach.ok({ mushrooms: undefined }) === false);
ok('prog 5 株 → 5/10', ach.prog({ mushrooms: 5 }) === `5/${MUSH_GOAL}`, ach.prog({ mushrooms: 5 }));
ok('prog 10 株 → 10/10', ach.prog({ mushrooms: 10 }) === `10/${MUSH_GOAL}`, ach.prog({ mushrooms: 10 }));
ok('prog 99 株不钳制（99/10，承 stock「X/N 不钳制」口径）', ach.prog({ mushrooms: 99 }) === `99/${MUSH_GOAL}`, ach.prog({ mushrooms: 99 }));
ok('elixir 灵药线零回归（ELIXIR_STOCK_GOAL 常量未被本版改动）', ELIXIR_STOCK_GOAL === 3, String(ELIXIR_STOCK_GOAL));

// —— 源级落位：core.newGame 起始 / 三个写入点 / 既有 applyAchievements 通路 ——
ok('core.js newGame 含 mushrooms: 0 起始字段', coreSrc.includes('mushrooms: 0,'));
ok('world.js 开箱宝箱蘑菇写入（onStep hero.mushrooms++）', worldSrc.includes('hero.mushrooms++'));
ok('battle.js 精英必掉蘑菇写入（winBattle hero.mushrooms++）', battleSrc.includes('hero.mushrooms++'));
ok('rules.js 战斗掉落蘑菇写入（rollDrop hero.mushrooms++）', rulesSrc.includes('hero.mushrooms++'));
ok('world.js onChestStep 既有 applyAchievements 通路（开箱发现性判定）', worldSrc.includes('applyAchievements();'));
ok('battle.js winBattle 既有 applyAchievements 通路（胜利当场判定）', battleSrc.includes('applyAchievements();'));
ok('core.js brewNow 既有 applyAchievements 通路（酿造当场判定）', coreSrc.includes('applyAchievements();'));

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

// 达标档：mushrooms=10 → applyAchievements 真实解锁落 hero.ach（持续变化量，任意判定点当场解锁）
let hero = newGame('余烬');
hero.mushrooms = 10;
hero = runAch(hero);
ok('运行期：mushrooms=10 触发 applyAchievements 真实解锁 mush 落 hero.ach', hero.ach.includes('mush'), hero.ach.join(','));
ok('运行期：mushrooms=10 与 brew 首档互不干扰（brew 记酿造行为，mushrooms 不误触发）', !hero.ach.includes('brew'), hero.ach.join(','));
ok('运行期：mushrooms=10 与 stock/elixir 持有线互不干扰', !hero.ach.includes('stock') && !hero.ach.includes('elixir'));

// 未达标档：mushrooms=9 → 不误解锁（差 1 株）
hero = newGame('灯见');
hero.mushrooms = 9;
hero = runAch(hero);
ok('运行期：mushrooms=9 不误解锁 mush', !hero.ach.includes('mush'));

// 新档起始蘑菇（mushrooms: 0，未达 10）→ 不误解锁
hero = newGame('潮');
ok('运行期：新档起始 mushrooms===0（源级落位同源读数）', hero.mushrooms === 0, String(hero.mushrooms));
hero = runAch(hero);
ok('运行期：新档起始 0 株不误解锁 mush', !hero.ach.includes('mush'), String(hero.mushrooms));

// 重复调用去重：已解锁后再 applyAchievements 不重复 push
hero = newGame('灯');
hero.mushrooms = 10;
runAch(hero);
runAch(hero);
ok('运行期：重复调用去重（hero.ach 中 mush 恰一枚）',
  hero.ach.filter((x) => x === 'mush').length === 1);

// 旧档防御档：无 mushrooms 字段读档 → applyAchievements 不抛错且不解锁（零迁移）
hero = newGame('潮');
delete hero.mushrooms;
let threw = null;
try { runAch(hero); } catch (e) { threw = e; }
ok('运行期：旧档缺 mushrooms 字段 applyAchievements 不抛错（防御式）', threw === null, threw && String(threw.stack || threw));
ok('运行期：缺字段旧档不解锁 mush（零迁移）', !hero.ach.includes('mush'));

// —— drawAch 渲染（42 项滚动不抛错；PAGE=10 五页）——
let rendered = true, renderedPg5 = true;
try {
  S.G = newGame('测试'); S.G.ach = ['mush']; S.achScroll = 0; S.scene = 'ach';
  drawAch();
} catch (e) { rendered = false; }
try {
  S.achScroll = 70; // 42 项滚到末页（PAGE=10，钳制到 32）不抛错
  drawAch();
} catch (e) { renderedPg5 = false; }
S.achScroll = 0; S.scene = 'world';
ok('运行期：成就页 drawAch 42 项渲染不抛错', rendered);
ok('运行期：成就页末页滚动渲染不抛错（42 项 PAGE=10 五页）', renderedPg5);

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树收录 smoke_v2214_mush 且位于串尾', readme.includes('smoke_v2213_teller + smoke_v2214_mush（npm test 串跑）'));
ok('README 件套口径为一百一十件套（一百零九件套清除）',
  readme.includes('冒烟一百一十件套（一百零九件套清除）') && !readme.includes('冒烟一百零三件套（一百零二件套清' + '除）'));
ok('README 含 v22.14 守护描述', readme.includes('v22.14 起含新成就「菇香满仓」'));
ok('README 成就口径「42 项」双处同步（快速上手表 C 键行 + 图鉴&成就行）',
  readme.includes('成就一览（全部 42 项进度') && readme.includes('**42 项成就**') &&
  !readme.includes('成就一览（全部 41 项进' + '度') && !readme.includes('**41 项成' + '就**'));
ok('package.json 已收录 smoke_v2214_mush（npm test 串跑第 110 份）',
  pkg.includes('smoke_v2214_mush.mjs') && /smoke_v2213_teller\.mjs && node tests\/smoke_v2214_mush\.mjs/.test(pkg));
ok('CHANGELOG 含 v22.14 条目', changelog.includes('## v22.14 '));

// —— 姊妹件套 pin 复查（v21.7 惯例：本版冒烟守护姊妹随新现实更新）——
const suite110 = ['smoke_v2213_teller.mjs', 'smoke_v2211_lampkid.mjs', 'smoke_v2210_unsaved.mjs',
  'smoke_v2209_achstatus.mjs', 'smoke_v2208_elixir.mjs', 'smoke_v2207_titledel.mjs',
  'smoke_v2206_stock2.mjs', 'smoke_v2205_fragtitle.mjs', 'smoke_v2204_brew2.mjs',
  'smoke_v2203_fragdead.mjs', 'smoke_v2202_fragwin.mjs', 'smoke_v2201_fragstatus.mjs',
  'smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs',
  'smoke_v2197_lucky2.mjs', 'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs',
  'smoke_v2194_statuscodex.mjs', 'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs',
  'smoke_v2191_ptime.mjs', 'smoke_v2190_launch.mjs', 'smoke_v2189_visitedlegacy.mjs',
  'smoke_v2188_wander.mjs', 'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs',
  'smoke_v2185_steleclear.mjs', 'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs',
  'smoke_v2182_winrecap.mjs', 'smoke_v2181_helpquickcast.mjs', 'smoke_v2180_grain.mjs',
  'smoke_v2179_titlerecap.mjs', 'smoke_v2178_codexseen.mjs', 'smoke_v2177_elites.mjs',
  'smoke_v2176_allchests.mjs'];
for (const nm of suite110) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README 件套 pin 已随新现实更新为一百一十件套（一百零九件套清除）`,
    src.includes('一百一十件套（一百零九件套清除）'));
}
const vers34 = ['smoke_v2213_teller.mjs', 'smoke_v2212_volume.mjs', 'smoke_v2211_lampkid.mjs',
  'smoke_v2210_unsaved.mjs', 'smoke_v2209_achstatus.mjs', 'smoke_v2208_elixir.mjs',
  'smoke_v2207_titledel.mjs', 'smoke_v2206_stock2.mjs', 'smoke_v2205_fragtitle.mjs',
  'smoke_v2204_brew2.mjs', 'smoke_v2203_fragdead.mjs', 'smoke_v2202_fragwin.mjs',
  'smoke_v2201_fragstatus.mjs', 'smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs',
  'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs', 'smoke_v2196_deadrecap.mjs',
  'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs', 'smoke_v2193_hunt100.mjs',
  'smoke_v2192_travelwarn.mjs', 'smoke_v2191_ptime.mjs', 'smoke_v2190_launch.mjs',
  'smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs', 'smoke_v2187_endingrecap.mjs',
  'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs', 'smoke_v2184_lvl12.mjs',
  'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs', 'smoke_v2181_helpquickcast.mjs',
  'smoke_v2179_titlerecap.mjs'];
for (const nm of vers34) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 字面量 pin 已随新现实更新为 v22.14`,
    src.includes("const GAME_VERSION = 'v22.14';"));
}
const eq19 = ['smoke_v2210_unsaved.mjs', 'smoke_v2209_achstatus.mjs', 'smoke_v2208_elixir.mjs',
  'smoke_v2207_titledel.mjs', 'smoke_v2206_stock2.mjs', 'smoke_v2205_fragtitle.mjs',
  'smoke_v2204_brew2.mjs', 'smoke_v2203_fragdead.mjs', 'smoke_v2202_fragwin.mjs',
  'smoke_v2201_fragstatus.mjs', 'smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs',
  'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs', 'smoke_v2196_deadrecap.mjs',
  'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs', 'smoke_v2193_hunt100.mjs',
  'smoke_v2192_travelwarn.mjs'];
for (const nm of eq19) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 恒等 pin（===）已随新现实更新为 v22.14`,
    src.includes("GAME_VERSION === 'v22.14'"));
}
const tail19 = ['smoke_v2213_teller.mjs', 'smoke_v2210_unsaved.mjs', 'smoke_v2209_achstatus.mjs',
  'smoke_v2208_elixir.mjs', 'smoke_v2207_titledel.mjs', 'smoke_v2206_stock2.mjs',
  'smoke_v2205_fragtitle.mjs', 'smoke_v2204_brew2.mjs', 'smoke_v2203_fragdead.mjs',
  'smoke_v2202_fragwin.mjs', 'smoke_v2201_fragstatus.mjs', 'smoke_v2200_stock.mjs',
  'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs', 'smoke_v2193_hunt100.mjs',
  'smoke_v2192_travelwarn.mjs'];
for (const nm of tail19) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README tests 树尾 pin 已随新现实更新（+ smoke_v2214_mush）`,
    src.includes('smoke_v2213_teller + smoke_v2214_mush（npm test 串跑）'));
}
const ach19 = ['smoke_v2208_elixir.mjs', 'smoke_v2206_stock2.mjs',
  'smoke_v2204_brew2.mjs', 'smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs',
  'smoke_v2197_lucky2.mjs', 'smoke_v2195_ptime2.mjs', 'smoke_v2193_hunt100.mjs',
  'smoke_v2191_ptime.mjs', 'smoke_v2188_wander.mjs', 'smoke_v2186_brew.mjs',
  'smoke_v2184_lvl12.mjs', 'smoke_v2180_grain.mjs', 'smoke_v2177_elites.mjs',
  'smoke_v2176_allchests.mjs', 'smoke_v2173_aegis.mjs', 'smoke_v2168_hardtrue.mjs',
  'smoke_v2159_skillach.mjs'];
for (const nm of ach19) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README 成就 pin 已随新现实更新为 42 项双处落位`,
    src.includes('成就一览（全部 42 项进度') && src.includes('**42 项成就**'));
}
const s2208 = read('../tests/smoke_v2208_elixir.mjs');
const s2209 = read('../tests/smoke_v2209_achstatus.mjs');
ok('smoke_v2208 的 ACH_LIST 精确计数断言已去硬化（===41 零残留，>=41 存活性口径落位）',
  s2208.includes('ACH_LIST.length >= 41') && !s2208.includes('ACH_LIST.length === 41'));
ok('smoke_v2209 的 ACH_LIST 精确计数断言已去硬化（===41 零残留，>=41 存活性口径落位）',
  s2209.includes('ACH_LIST.length >= 41') && !s2209.includes('ACH_LIST.length === 41'));

// 旧代 pin 零残留：全部测试文件不得再含 v22.13 版本字面量 pin（拆串构造避免本文件扫描行自匹配）
const OLD_GV = "const GAME_VERSION = 'v22." + "13';";
let stale = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes(OLD_GV)) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v22.13 全库清零）', stale.length === 0, stale.join(','));
let staleId = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes("GAME_VERSION === 'v22." + "13'")) staleId.push(f);
}
ok('旧代 GAME_VERSION 恒等 pin 零残留（===v22.13 全库清零）', staleId.length === 0, staleId.join(','));
let staleSuite = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes('一百零九件套（一百零八件套清' + '除）')) staleSuite.push(f);
}
ok('旧代件套 pin 零残留（一百零九件套（一百零八件套清' + '除）全库清零）', staleSuite.length === 0, staleSuite.join(','));
let staleTail = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes('smoke_v2212_volume + smoke_v2213_teller（npm test 串' + '跑）')) staleTail.push(f);
}
ok('旧代树尾 pin 零残留（smoke_v2212_volume + smoke_v2213_teller 串全库清零）', staleTail.length === 0, staleTail.join(','));
// 旧代 README 成就正 pin 零残留：全部测试文件不得再含「全部 41 项进·度」或
// 「readme.includes(『**41 项成就**』)」形态的正向 pin（拆串避免自匹配）
let staleAch = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  const posPin = "readme.includes('**41 项成" + "就**'";
  if (src.includes('全部 41 项进' + '度') || src.includes(posPin)) staleAch.push(f);
}
ok('旧代 README 成就正 pin 零残留（41 项全库清零）', staleAch.length === 0, staleAch.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
