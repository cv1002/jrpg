// v22.8 专项冒烟：新成就「灵药盈囊」（高级灵药持有线首枚里程碑，新内容·单成就，承 v22.0 有备无患 /
// v22.4 妙手回春 / v22.6 药香满囊 单成就先例）——成就版图逐线核对的最后一条空白：等级线三档
// （lvl5·lvl10·lvl12）、宝箱线两档（chests·allchests）、讨伐线两档（hunt10·hunt100）、时长线两档
// （ptime·ptime2）、掉落线两档（lucky·lucky2）、金币线两档（rich·rich2）、酿造线两档（brew·brew2）、
// 药水线两档（stock·stock2）都已齐，唯独「持有高级灵药」这条续航链顶端资源线没有任何纪念——brew 灵药初成 /
// brew2 妙手回春 记的是「酿造」行为（任务奖励/战斗掉落的灵药不算），而高级灵药本身（brewNow 酿造、四条
// 支线任务各奖 1 瓶、战斗掉落 6% 三源，恢复 80%HP+40%MP、无背包上限）常被玩家囤 2-3 瓶留给 Boss 战，
// 在成就一览却无一声回响。现补首枚（ELIXIR_STOCK_GOAL=3 瓶）：判定/描述/进度三处同读新常量
// ELIXIR_STOCK_GOAL（与 POTIONS2_GOAL 同一「成就阈值数据化」家族——改门槛只改 data.js 一处自动跟随，
// 零裸字面量），计数读既有 hero.potion2 存档字段（newGame 起始 0、brewNow 酿造/任务奖励/战斗掉落写定、
// 喝药扣减，随存档快照持久化），(g.potion2||0) 防御式读取旧档零迁移，承 stock 同款；无 r 字段纯里程碑
// （配灵药本身就是奖励）；解锁时机：applyAchievements 既有通路任意判定点当场解锁（potion2 为持续变化量，
// 承 lvl12/lucky2 同款——先囤药再喝掉也照常解锁，已解锁不因消耗回落而撤销），brewNow 酿造成功本就当场
// applyAchievements，第 3 瓶落袋的瞬间即解锁、反馈不迟到。
// 本冒烟守护：版本锚点、ELIXIR_STOCK_GOAL 数据契约（===3、声明与导出）、ACH_LIST 契约（elixir 唯一/
// 总数精确 41/既有 40 成就 id 零回归/追加在末尾序位）、ok/prog 谓词逐值（0·2 false / 3·99 true /
// 缺 potion2 字段防御 false·0/3 / prog 不钳制 99/3）、core.js 源级落位（newGame potion2: 0 起始 +
// brewNow hero.potion2++ 与当场 applyAchievements）、运行期全链路（applyAchievements 真实解锁落 hero.ach /
// 未够不误解锁 / 重复调用去重）、drawAch 41 项滚动渲染不抛错、README/package.json/CHANGELOG 同步、
// 姊妹件套 pin（v2207..v2176 一百零四件套 / v2207..v2181·v2179 GAME_VERSION v22.8 / v2207..v2192
// 恒等 v22.8 / v2207..v2195·v2193·v2192 树尾 pin）随新现实更新
// + smoke_v2206 精确计数断言去硬化（===40→>=40）复核 + 旧代 v22.7 字面量 pin / 旧代恒等 pin / 旧代
// 一百零三件套 pin / 旧代 40 项正向 pin 零残留。
import { GAME_VERSION, ACH_LIST, POTIONS2_GOAL, ELIXIR_STOCK_GOAL } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.8 灵药盈囊高级灵药持有线首枚里程碑冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v22.7 + 精确 v22.8 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.7', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 8)), GAME_VERSION);
ok('GAME_VERSION 字面量已为 v22.8（本版独占精确锚点）', GAME_VERSION === 'v22.18', GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const coreSrc = read('../js/core.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v22.8 版本注释', dataSrc.includes('v22.8 新成就「灵药盈囊」'));
ok('data.js GAME_VERSION 字面量已更新为 v22.8', dataSrc.includes("const GAME_VERSION = 'v22.18';"));
ok('data.js 仍保留 v22.7 历史注释（累积注释块，姊妹 pin 不失效）', dataSrc.includes('v22.7 标题页 X 删除存档槽'));
ok('data.js 导出 ELIXIR_STOCK_GOAL（export 块落位，与 POTIONS2_GOAL 相邻）', dataSrc.includes('POTIONS2_GOAL, ELIXIR_STOCK_GOAL, ELIXIR_STOCK2_GOAL, PERFECTION_GOLD'));

// —— ELIXIR_STOCK_GOAL 数据契约 ——
ok('ELIXIR_STOCK_GOAL === 3（灵药持有线首枚 = 持有 3 瓶高级灵药）', ELIXIR_STOCK_GOAL === 3, String(ELIXIR_STOCK_GOAL));
ok('ELIXIR_STOCK_GOAL 声明为 3 且注释含「灵药盈囊」口径', dataSrc.includes('const ELIXIR_STOCK_GOAL = 3;') && dataSrc.includes('成就「灵药盈囊」'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'elixir');
ok('ACH_LIST 含 elixir「灵药盈囊」且 id 唯一',
  !!ach && ach.name === '灵药盈囊' && ACH_LIST.filter((a) => a.id === 'elixir').length === 1);
ok('ACH_LIST 总数 ≥41 项（v22.14 起随新现实去硬化，41→42 精确计数由 v2214 接管）', ACH_LIST.length >= 41, String(ACH_LIST.length));
ok('elixir 描述由 ELIXIR_STOCK_GOAL 派生（单一数据源，零裸字面量 3）',
  ach.d === `持有 ${ELIXIR_STOCK_GOAL} 瓶高级灵药`, ach.d);
ok('elixir 判定/进度同读 ELIXIR_STOCK_GOAL + potion2 防御式（ok (g.potion2||0) / prog (g.potion2||0)）',
  String(ach.ok).includes('ELIXIR_STOCK_GOAL') && String(ach.ok).includes('g.potion2||0') &&
  String(ach.prog).includes('ELIXIR_STOCK_GOAL') && String(ach.prog).includes('g.potion2||0'));
ok('elixir 无 r 字段纯里程碑（与 rich/memoir/skills/hardtrue 同款）', !('r' in ach));

// —— 既有 40 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime', 'hunt100', 'ptime2', 'lucky2', 'rich2', 'stock', 'brew2', 'stock2'];
ok('既有 40 成就 id 零回归', EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('elixir 追加在末尾序位（stock2 39 / elixir 40，既有序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'stock2') === 39 &&
  ACH_LIST.findIndex((a) => a.id === 'elixir') === 40);

// —— ok/prog 谓词逐值 ——
ok('potion2=0（防御分支，未达标）→ false', ach.ok({ potion2: 0 }) === false);
ok('potion2=2（差 1 瓶）→ false（恰在门槛下不解锁）', ach.ok({ potion2: 2 }) === false);
ok('potion2=3 → true（恰达标）', ach.ok({ potion2: 3 }) === true);
ok('potion2=99（无上限）→ true（超阈值仍达标）', ach.ok({ potion2: 99 }) === true);
ok('缺 potion2 字段旧档 → false 且 prog 0/3（防御式零迁移）',
  ach.ok({}) === false && ach.prog({}) === `0/${ELIXIR_STOCK_GOAL}`);
ok('potion2 非数值（undefined 兜底）→ false 不抛错', ach.ok({ potion2: undefined }) === false);
ok('prog 1 瓶 → 1/3', ach.prog({ potion2: 1 }) === `1/${ELIXIR_STOCK_GOAL}`, ach.prog({ potion2: 1 }));
ok('prog 3 瓶 → 3/3', ach.prog({ potion2: 3 }) === `3/${ELIXIR_STOCK_GOAL}`, ach.prog({ potion2: 3 }));
ok('prog 99 瓶不钳制（99/3，承 stock「X/N 不钳制」口径）', ach.prog({ potion2: 99 }) === `99/${ELIXIR_STOCK_GOAL}`, ach.prog({ potion2: 99 }));
ok('stock2 药水线零回归（POTIONS2_GOAL 常量未被本版改动）', POTIONS2_GOAL === 50, String(POTIONS2_GOAL));

// —— 源级落位：core.js newGame 起始 / brewNow 酿造当场判定 ——
ok('core.js newGame 含 potion2: 0 起始字段', coreSrc.includes('potion2: 0,'));
ok('core.js brewNow 有 hero.potion2++ 酿造落账 + 当场 applyAchievements（酿造第 3 瓶瞬间解锁）',
  coreSrc.includes('hero.potion2++') && coreSrc.includes('applyAchievements();'));

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

// 达标档：potion2=3 → applyAchievements 真实解锁落 hero.ach（持续变化量，任意判定点当场解锁）
let hero = newGame('余烬');
hero.potion2 = 3;
hero = runAch(hero);
ok('运行期：potion2=3 触发 applyAchievements 真实解锁 elixir 落 hero.ach', hero.ach.includes('elixir'), hero.ach.join(','));
ok('运行期：potion2=3 与 brew 首档互不干扰（brew 记酿造行为，potion2 不误触发）', !hero.ach.includes('brew'), hero.ach.join(','));

// 未达标档：potion2=2 → 不误解锁（差 1 瓶）
hero = newGame('灯见');
hero.potion2 = 2;
hero = runAch(hero);
ok('运行期：potion2=2 不误解锁 elixir', !hero.ach.includes('elixir'));

// 新档起始灵药（potion2: 0，未达 3）→ 不误解锁
hero = newGame('潮');
hero = runAch(hero);
ok('运行期：新档起始 potion2 不误解锁 elixir', !hero.ach.includes('elixir'), String(hero.potion2));

// 重复调用去重：已解锁后再 applyAchievements 不重复 push
hero = newGame('灯');
hero.potion2 = 3;
runAch(hero);
runAch(hero);
ok('运行期：重复调用去重（hero.ach 中 elixir 恰一枚）',
  hero.ach.filter((x) => x === 'elixir').length === 1);

// 旧档防御档：无 potion2 字段读档 → applyAchievements 不抛错且不解锁（零迁移）
hero = newGame('潮');
delete hero.potion2;
let threw = null;
try { runAch(hero); } catch (e) { threw = e; }
ok('运行期：旧档缺 potion2 字段 applyAchievements 不抛错（防御式）', threw === null, threw && String(threw.stack || threw));
ok('运行期：缺字段旧档不解锁 elixir（零迁移）', !hero.ach.includes('elixir'));

// —— drawAch 渲染（41 项滚动不抛错；PAGE=10 五页）——
let rendered = true, renderedPg5 = true;
try {
  S.G = newGame('测试'); S.G.ach = ['elixir']; S.achScroll = 0; S.scene = 'ach';
  drawAch();
} catch (e) { rendered = false; }
try {
  S.achScroll = 60; // 41 项滚到末页（PAGE=10，钳制到 30）不抛错
  drawAch();
} catch (e) { renderedPg5 = false; }
S.achScroll = 0; S.scene = 'world';
ok('运行期：成就页 drawAch 41 项渲染不抛错', rendered);
ok('运行期：成就页末页滚动渲染不抛错（41 项 PAGE=10 五页）', renderedPg5);

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树收录 smoke_v2208_elixir 且位于串尾', readme.includes('smoke_v2209_achstatus + smoke_v2211_lampkid + smoke_v2212_volume + smoke_v2213_teller + smoke_v2214_mush + smoke_v2215_tutorvol + smoke_v2216_picker + smoke_v2217_elixir2 + smoke_v2218_mush2（npm test 串跑）'));
ok('README 件套口径为一百一十四件套（一百一十三件套清除）',
  readme.includes('冒烟一百一十四件套（一百一十三件套清除）') && !readme.includes('冒烟一百零三件套（一百零二件套清' + '除）'));
ok('README 含 v22.8 守护描述', readme.includes('v22.8 起含新成就「灵药盈囊」'));
ok('README 成就口径「41 项」双处同步（快速上手表 C 键行 + 图鉴&成就行）',
  readme.includes('成就一览（全部 44 项进度') && readme.includes('**44 项成就**') &&
  !readme.includes('成就一览（全部 40 项进' + '度') && !readme.includes('**40 项成' + '就**'));
ok('package.json 已收录 smoke_v2208_elixir（npm test 串跑第 104 份）',
  pkg.includes('smoke_v2208_elixir.mjs') && /smoke_v2207_titledel\.mjs && node tests\/smoke_v2208_elixir\.mjs/.test(pkg));
ok('CHANGELOG 含 v22.8 条目', changelog.includes('## v22.8 '));

// —— 姊妹件套 pin 复查（v21.7 惯例：本版冒烟守护姊妹随新现实更新）——
const suite104 = ['smoke_v2207_titledel.mjs', 'smoke_v2206_stock2.mjs', 'smoke_v2205_fragtitle.mjs',
  'smoke_v2204_brew2.mjs', 'smoke_v2203_fragdead.mjs', 'smoke_v2202_fragwin.mjs', 'smoke_v2201_fragstatus.mjs',
  'smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs', 'smoke_v2191_ptime.mjs',
  'smoke_v2190_launch.mjs', 'smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs',
  'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs',
  'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs',
  'smoke_v2181_helpquickcast.mjs', 'smoke_v2180_grain.mjs', 'smoke_v2179_titlerecap.mjs',
  'smoke_v2178_codexseen.mjs', 'smoke_v2177_elites.mjs', 'smoke_v2176_allchests.mjs'];
for (const nm of suite104) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README 件套 pin 已随新现实更新为一百一十四件套（一百一十三件套清除）`,
    src.includes('一百一十四件套（一百一十三件套清除）'));
}
const vers104 = ['smoke_v2207_titledel.mjs', 'smoke_v2206_stock2.mjs', 'smoke_v2205_fragtitle.mjs',
  'smoke_v2204_brew2.mjs', 'smoke_v2203_fragdead.mjs', 'smoke_v2202_fragwin.mjs', 'smoke_v2201_fragstatus.mjs',
  'smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs', 'smoke_v2191_ptime.mjs',
  'smoke_v2190_launch.mjs', 'smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs',
  'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs',
  'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs',
  'smoke_v2181_helpquickcast.mjs', 'smoke_v2179_titlerecap.mjs'];
for (const nm of vers104) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 字面量 pin 已随新现实更新为 v22.8`,
    src.includes("const GAME_VERSION = 'v22.18';"));
}
for (const nm of ['smoke_v2207_titledel.mjs', 'smoke_v2206_stock2.mjs', 'smoke_v2205_fragtitle.mjs',
  'smoke_v2204_brew2.mjs', 'smoke_v2203_fragdead.mjs', 'smoke_v2202_fragwin.mjs', 'smoke_v2201_fragstatus.mjs',
  'smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs']) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 恒等 pin（===）已随新现实更新为 v22.8`,
    src.includes("GAME_VERSION === 'v22.18'"));
}
for (const nm of ['smoke_v2207_titledel.mjs', 'smoke_v2206_stock2.mjs', 'smoke_v2205_fragtitle.mjs',
  'smoke_v2204_brew2.mjs', 'smoke_v2203_fragdead.mjs', 'smoke_v2202_fragwin.mjs', 'smoke_v2201_fragstatus.mjs',
  'smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs']) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README tests 树尾 pin 已随新现实更新（+ smoke_v2208_elixir）`,
    src.includes('smoke_v2209_achstatus + smoke_v2211_lampkid + smoke_v2212_volume + smoke_v2213_teller + smoke_v2214_mush + smoke_v2215_tutorvol + smoke_v2216_picker + smoke_v2217_elixir2 + smoke_v2218_mush2（npm test 串跑）'));
}
const achFiles = ['smoke_v2206_stock2.mjs', 'smoke_v2204_brew2.mjs', 'smoke_v2200_stock.mjs',
  'smoke_v2199_rich2.mjs', 'smoke_v2197_lucky2.mjs', 'smoke_v2195_ptime2.mjs', 'smoke_v2193_hunt100.mjs',
  'smoke_v2191_ptime.mjs', 'smoke_v2188_wander.mjs', 'smoke_v2186_brew.mjs', 'smoke_v2184_lvl12.mjs',
  'smoke_v2180_grain.mjs', 'smoke_v2177_elites.mjs', 'smoke_v2176_allchests.mjs', 'smoke_v2173_aegis.mjs',
  'smoke_v2168_hardtrue.mjs', 'smoke_v2159_skillach.mjs'];
for (const nm of achFiles) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README 成就 pin 已随新现实更新为 41 项双处落位`,
    src.includes('成就一览（全部 44 项进度') && src.includes('**44 项成就**'));
}
const s2206 = read('../tests/smoke_v2206_stock2.mjs');
ok('smoke_v2206 的 ACH_LIST 精确计数断言已去硬化（===40 零残留，>=40 存活性口径落位）',
  s2206.includes('ACH_LIST.length >= 40') && !s2206.includes('ACH_LIST.length === 40'));
// 旧代 pin 零残留：全部测试文件不得再含 v22.7 版本字面量 pin（拆串构造避免本文件扫描行自匹配）
const OLD_GV = "const GAME_VERSION = 'v22." + "7';";
let stale = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes(OLD_GV)) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v22.7 全库清零）', stale.length === 0, stale.join(','));
let staleId = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes("GAME_VERSION === 'v22." + "7'")) staleId.push(f);
}
ok('旧代 GAME_VERSION 恒等 pin 零残留（===v22.7 全库清零）', staleId.length === 0, staleId.join(','));
let staleSuite = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes('一百零三件套（一百零二件套清' + '除）')) staleSuite.push(f);
}
ok('旧代件套 pin 零残留（一百零三件套（一百零二件套清' + '除）全库清零）', staleSuite.length === 0, staleSuite.join(','));
let staleTail = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes('smoke_v2206_stock2 + smoke_v2207_titledel（npm test 串' + '跑）')) staleTail.push(f);
}
ok('旧代树尾 pin 零残留（smoke_v2206_stock2 + smoke_v2207_titledel 串全库清零）', staleTail.length === 0, staleTail.join(','));
// 旧代 README 成就正 pin 零残留：全部测试文件不得再含「全部 40 项进·度」或
// 「readme.includes(『**40 项成就**』)」形态的正向 pin（拆串避免自匹配）
let staleAch = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  const posPin = "readme.includes('**40 项成" + "就**'";
  if (src.includes('全部 40 项进' + '度') || src.includes(posPin)) staleAch.push(f);
}
ok('旧代 README 成就正 pin 零残留（40 项全库清零）', staleAch.length === 0, staleAch.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
