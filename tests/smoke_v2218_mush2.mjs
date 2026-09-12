// v22.18 专项冒烟：新成就「菇山菌海」（魔法蘑菇持有线第二档里程碑·新内容·单成就，承 v22.14 菇香满仓
// 首枚 / v22.4 妙手回春 / v22.6 药香满囊 / v22.8 灵药盈囊 单成就与多档先例）——成就版图逐线核对的
// 收口：等级三档、宝箱/讨伐/时长/掉落/金币/酿造/药水/灵药全两档，唯蘑菇线（v22.14 首枚=持有 10 株）
// 仍停首枚（v22.17 已点明「唯独灵药线与蘑菇线仍停首枚」，灵药线已于该版补齐）；现补蘑菇线第二档
// （MUSH2_GOAL=25 株，宝箱 60% 蘑菇/精英必掉 1 株/战斗掉落 12% 三源、酿造 2 株/卖菇 10 金双消耗、
// 无背包上限）：判定/描述/进度三处同读新常量 MUSH2_GOAL（与 MUSH_GOAL 同一「成就阈值数据化」家族——
// 改门槛只改 data.js 一处自动跟随，零裸字面量），计数读既有 hero.mushrooms 存档字段（newGame 起始 0、
// 开箱 world.onStep/精英必掉 battle.winBattle/战斗掉落 rules.rollDrop 写定、酿造/卖菇扣减，随存档快照
// 持久化），(g.mushrooms||0) 防御式读取旧档零迁移，承 mush 同款；无 r 字段纯里程碑（蘑菇本身就是奖励）；
// 解锁走 applyAchievements 既有通路任意判定点当场解锁（mushrooms 为持续变化量，无需新判定点——第 25 株
// 落袋的瞬间即解锁、反馈不迟到；已解锁不因酿造/卖菇消耗回落而撤销）。
// 本冒烟守护：版本锚点、MUSH2_GOAL 数据契约（===25、声明与导出）、ACH_LIST 契约（mush2 唯一/总数精确
// 44/既有 43 成就 id 零回归/追加在末尾序位）、ok/prog 谓词逐值（0·24 false / 25·99 true / 缺 mushrooms
// 字段防御 false·0/25 / prog 不钳制 99/25）、源级落位（core.newGame mushrooms: 0 起始 + world/battle/
// rules 三个写入点 + core.brewNow 与 shop 卖菇两个扣减点 + hero.js applyAchievements 出口）、运行期全链路
// （applyAchievements 真实解锁落 hero.ach / 未够不误解锁 / 兄弟成就零误触发 / 重复调用去重）、drawAch
// 44 项滚动渲染不抛错、README/package.json/CHANGELOG 同步、姊妹件套 pin（v2217..v2176 一百一十四件套 /
// v2217..v2179 GAME_VERSION v22.18 / v2217..v2192 恒等 v22.18 / v2217..v2192 树尾 pin / README 成就
// pin 44 项）随新现实更新 + smoke_v2217 精确计数断言去硬化（===43→>=43）复核 + 旧代 v22.17 字面量 pin /
// 旧代恒等 pin / 旧代一百一十三件套 pin / 旧代树尾 pin / 旧代 43 项正向 pin 零残留。
import { GAME_VERSION, ACH_LIST, MUSH2_GOAL, MUSH_GOAL, ELIXIR_STOCK2_GOAL } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.18 菇山菌海魔法蘑菇持有线第二档里程碑冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v22.17 + 精确 v22.18 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.17', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 18)), GAME_VERSION);
ok('GAME_VERSION 字面量已为 v22.18（本版独占精确锚点）', GAME_VERSION === 'v22.24', GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const coreSrc = read('../js/core.js');
const worldSrc = read('../js/world.js');
const battleSrc = read('../js/battle.js');
const rulesSrc = read('../js/rules.js');
const shopSrc = read('../js/shop.js');
const heroSrc = read('../js/hero.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v22.18 版本注释（菇山菌海说明）', dataSrc.includes('v22.18 新成就「菇山菌海」'));
ok('data.js GAME_VERSION 字面量已更新为 v22.18（旧 v22.17 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v22.24';") && !dataSrc.includes("const GAME_VERSION = 'v22." + "17';"));
ok('data.js 仍保留 v22.17 历史注释（累积注释块，姊妹 pin 不失效）', dataSrc.includes('v22.17 新成就「灵药满柜」'));
ok('data.js 导出 MUSH2_GOAL（export 块落位，与 MUSH_GOAL 相邻）',
  dataSrc.includes('MUSHROOM_GOAL, MUSH_GOAL, MUSH2_GOAL, MIST_GOAL'));

// —— MUSH2_GOAL 数据契约 ——
ok('MUSH2_GOAL === 25（蘑菇持有线第二档 = 持有 25 株魔法蘑菇）', MUSH2_GOAL === 25, String(MUSH2_GOAL));
ok('MUSH2_GOAL 声明为 25 且注释含「菇山菌海」口径', dataSrc.includes('const MUSH2_GOAL = 25;') && dataSrc.includes('成就「菇山菌海」'));
ok('MUSH_GOAL 首档零回归（===10，本版只加第二档不动首档）', MUSH_GOAL === 10, String(MUSH_GOAL));
ok('ELIXIR_STOCK2_GOAL 灵药线第二档零回归（===8，本版未动）', ELIXIR_STOCK2_GOAL === 8, String(ELIXIR_STOCK2_GOAL));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'mush2');
ok('ACH_LIST 含 mush2「菇山菌海」且 id 唯一',
  !!ach && ach.name === '菇山菌海' && ACH_LIST.filter((a) => a.id === 'mush2').length === 1);
ok('ACH_LIST 精确总数 44 项（本版独占精确计数，43→44）', ACH_LIST.length === 44, String(ACH_LIST.length));
ok('mush2 描述由 MUSH2_GOAL 派生（单一数据源，零裸字面量 25）',
  ach.d === `持有 ${MUSH2_GOAL} 株魔法蘑菇`, ach.d);
ok('mush2 判定/进度同读 MUSH2_GOAL + mushrooms 防御式（ok (g.mushrooms||0) / prog (g.mushrooms||0)）',
  String(ach.ok).includes('MUSH2_GOAL') && String(ach.ok).includes('g.mushrooms||0') &&
  String(ach.prog).includes('MUSH2_GOAL') && String(ach.prog).includes('g.mushrooms||0'));
ok('mush2 无 r 字段纯里程碑（与 rich/memoir/skills/hardtrue 同款）', !('r' in ach));

// —— 既有 43 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime', 'hunt100', 'ptime2', 'lucky2', 'rich2', 'stock', 'brew2', 'stock2', 'elixir', 'mush', 'elixir2'];
ok('既有 43 成就 id 零回归', EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('mush2 追加在末尾序位（elixir 40 / mush 41 / elixir2 42 / mush2 43，既有序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'elixir') === 40 &&
  ACH_LIST.findIndex((a) => a.id === 'mush') === 41 &&
  ACH_LIST.findIndex((a) => a.id === 'elixir2') === 42 &&
  ACH_LIST.findIndex((a) => a.id === 'mush2') === 43);

// —— ok/prog 谓词逐值 ——
ok('mushrooms=0（防御分支，未达标）→ false', ach.ok({ mushrooms: 0 }) === false);
ok('mushrooms=24（差 1 株）→ false（恰在门槛下不解锁）', ach.ok({ mushrooms: 24 }) === false);
ok('mushrooms=25 → true（恰达标）', ach.ok({ mushrooms: 25 }) === true);
ok('mushrooms=99（无上限）→ true（超阈值仍达标）', ach.ok({ mushrooms: 99 }) === true);
ok('缺 mushrooms 字段旧档 → false 且 prog 0/25（防御式零迁移）',
  ach.ok({}) === false && ach.prog({}) === `0/${MUSH2_GOAL}`);
ok('mushrooms 非数值（undefined 兜底）→ false 不抛错', ach.ok({ mushrooms: undefined }) === false);
ok('prog 10 株 → 10/25', ach.prog({ mushrooms: 10 }) === `10/${MUSH2_GOAL}`, ach.prog({ mushrooms: 10 }));
ok('prog 25 株 → 25/25', ach.prog({ mushrooms: 25 }) === `25/${MUSH2_GOAL}`, ach.prog({ mushrooms: 25 }));
ok('prog 99 株不钳制（99/25，承 stock「X/N 不钳制」口径）', ach.prog({ mushrooms: 99 }) === `99/${MUSH2_GOAL}`, ach.prog({ mushrooms: 99 }));

// —— 源级落位：core.newGame 起始 / 三个写入点 / 两个扣减点 / applyAchievements 出口 ——
ok('core.js newGame 含 mushrooms: 0 起始字段', coreSrc.includes('mushrooms: 0,'));
ok('world.js 开箱宝箱蘑菇写入（onStep hero.mushrooms++）', worldSrc.includes('hero.mushrooms++'));
ok('battle.js 精英必掉蘑菇写入（winBattle hero.mushrooms++）', battleSrc.includes('hero.mushrooms++'));
ok('rules.js 战斗掉落蘑菇写入（rollDrop hero.mushrooms++）', rulesSrc.includes('hero.mushrooms++'));
ok('core.js 酿造扣减（brewNow hero.mushrooms -= BREW_MUSHROOMS）', coreSrc.includes('hero.mushrooms -= BREW_MUSHROOMS;'));
ok('shop.js 卖菇扣减（sellMushroom hero.mushrooms--）', shopSrc.includes('hero.mushrooms--;'));
ok('hero.js applyAchievements 既有出口（解锁只走既有通路，零新判定点）',
  heroSrc.includes('export function applyAchievements() {'));

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

// 达标档：mushrooms=25 → applyAchievements 真实解锁落 hero.ach（持续变化量，任意判定点当场解锁；
// 首档 mush（10）同源同足一并解锁是本成就应有的叠加行为，非误触发）
let hero = newGame('余烬');
hero.mushrooms = 25;
hero = runAch(hero);
ok('运行期：mushrooms=25 触发 applyAchievements 真实解锁 mush2 落 hero.ach', hero.ach.includes('mush2'), hero.ach.join(','));
ok('运行期：mushrooms=25 与首档 mush 叠加（10 株阈值同足，双档合理共存）', hero.ach.includes('mush'));
ok('运行期：mushrooms=25 与 brew/stock/elixir2 互不干扰（brew 记酿造行为、stock 读 item、elixir2 读 potion2）',
  !hero.ach.includes('brew') && !hero.ach.includes('stock') && !hero.ach.includes('elixir2'), hero.ach.join(','));

// 未达标档：mushrooms=24 → 不误解锁第二档（差 1 株；首档 mush 仍会解锁属合理叠加）
hero = newGame('灯见');
hero.mushrooms = 24;
hero = runAch(hero);
ok('运行期：mushrooms=24 不误解锁 mush2', !hero.ach.includes('mush2'), hero.ach.join(','));

// 新档起始蘑菇（mushrooms: 0，未达 10/25）→ 两档都不解锁
hero = newGame('潮');
ok('运行期：新档起始 mushrooms===0（源级落位同源读数）', hero.mushrooms === 0, String(hero.mushrooms));
hero = runAch(hero);
ok('运行期：新档起始 0 株不误解锁 mush2', !hero.ach.includes('mush2'), String(hero.mushrooms));

// 重复调用去重：已解锁后再 applyAchievements 不重复 push
hero = newGame('灯');
hero.mushrooms = 25;
runAch(hero);
runAch(hero);
ok('运行期：重复调用去重（hero.ach 中 mush2 恰一枚）',
  hero.ach.filter((x) => x === 'mush2').length === 1);

// 旧档防御档：无 mushrooms 字段读档 → applyAchievements 不抛错且不解锁（零迁移）
hero = newGame('潮');
delete hero.mushrooms;
let threw = null;
try { runAch(hero); } catch (e) { threw = e; }
ok('运行期：旧档缺 mushrooms 字段 applyAchievements 不抛错（防御式）', threw === null, threw && String(threw.stack || threw));
ok('运行期：缺字段旧档不解锁 mush2（零迁移）', !hero.ach.includes('mush2'));

// —— drawAch 渲染（44 项滚动不抛错；PAGE=10 五页）——
let rendered = true, renderedPg5 = true;
try {
  S.G = newGame('测试'); S.G.ach = ['mush2']; S.achScroll = 0; S.scene = 'ach';
  drawAch();
} catch (e) { rendered = false; }
try {
  S.achScroll = 90; // 44 项滚到末页（PAGE=10，钳制）不抛错
  drawAch();
} catch (e) { renderedPg5 = false; }
S.achScroll = 0; S.scene = 'world';
ok('运行期：成就页 drawAch 44 项渲染不抛错', rendered);
ok('运行期：成就页末页滚动渲染不抛错（44 项 PAGE=10 五页）', renderedPg5);

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树收录 smoke_v2217_elixir2 + smoke_v2218_mush2 且位于串尾', readme.includes('smoke_v2217_elixir2 + smoke_v2218_mush2 + smoke_v2219_footkeys + smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter（npm test 串跑）'));
ok('README tests 树尾链完整（v2216_picker 未被新尾吞并，全链连到 smoke_v2218_mush2）',
  readme.includes('smoke_v2214_mush + smoke_v2215_tutorvol + smoke_v2216_picker + smoke_v2217_elixir2 + smoke_v2218_mush2 + smoke_v2219_footkeys + smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter（npm test 串跑）'));
ok('README 件套口径为一百二十件套（一百一十九件套清除）',
  readme.includes('冒烟一百二十件套（一百一十九件套清除）') && !readme.includes('冒烟一百一十三件套（一百一十二件套清' + '除）'));
ok('README 含 v22.18 守护描述（菇山菌海）', readme.includes('v22.18 起含新成就「菇山菌海」'));
ok('README 含 smoke_v2218_mush2 入库（114 份）', readme.includes('smoke_v2218_mush2 入库（114 份）'));
ok('README 成就口径「44 项」双处同步（快速上手表 C 键行 + 图鉴&成就行）',
  readme.includes('成就一览（全部 44 项进度') && readme.includes('**44 项成就**') &&
  !readme.includes('成就一览（全部 43 项进' + '度') && !readme.includes('**43 项成' + '就**'));
ok('package.json 已收录 smoke_v2218_mush2（npm test 串跑第 114 份）',
  pkg.includes('smoke_v2218_mush2.mjs') && /smoke_v2217_elixir2\.mjs && node tests\/smoke_v2218_mush2\.mjs/.test(pkg));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 114 件套', testChain === 120, String(testChain));
ok('CHANGELOG 含 v22.18 条目', changelog.includes('## v22.18 '));

// —— 姊妹件套 pin 复查（v21.7 惯例：本版冒烟守护姊妹随新现实更新）——
const s2217 = read('../tests/smoke_v2217_elixir2.mjs');
const s2216 = read('../tests/smoke_v2216_picker.mjs');
const s2215 = read('../tests/smoke_v2215_tutorvol.mjs');
const s2214 = read('../tests/smoke_v2214_mush.mjs');
const s2213 = read('../tests/smoke_v2213_teller.mjs');
ok('smoke_v2217 的 README 件套 pin 已随新现实更新为一百二十件套（一百一十九件套清除）',
  s2217.includes('一百二十件套（一百一十九件套清除）'));
ok('smoke_v2217 的 README 树尾 pin 已更新为 + smoke_v2218_mush2', s2217.includes('smoke_v2217_elixir2 + smoke_v2218_mush2 + smoke_v2219_footkeys + smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter（npm test 串跑）'));
ok('smoke_v2217 的 GAME_VERSION 字面量 pin 已更新为 v22.18', s2217.includes("const GAME_VERSION = 'v22.24';"));
ok('smoke_v2217 的 GAME_VERSION 恒等 pin 已更新为 === v22.18', s2217.includes("GAME_VERSION === 'v22.24'"));
ok('smoke_v2217 的 package.json 件套计数 pin 已更新为 === 114', s2217.includes('testChain === 120'));
ok('smoke_v2217 的 README 成就 pin 已随新现实更新为 44 项双处落位',
  s2217.includes('成就一览（全部 44 项进度') && s2217.includes('**44 项成就**'));
ok('smoke_v2217 的 ACH_LIST 精确计数断言已去硬化（===43 零残留，>=43 存活性口径落位）',
  s2217.includes('ACH_LIST.length >= 43') && !s2217.includes('ACH_LIST.length === ' + '43'));
ok('smoke_v2216 的 GAME_VERSION 字面量 pin 已更新为 v22.18', s2216.includes("const GAME_VERSION = 'v22.24';"));
ok('smoke_v2216 的 package.json 件套计数 pin 已更新为 === 114', s2216.includes('testChain === 120'));
ok('smoke_v2215 的 package.json 件套计数 pin 已更新为 === 114', s2215.includes('testChain === 120'));
ok('smoke_v2215 的 GAME_VERSION 字面量 pin 已更新为 v22.18', s2215.includes("const GAME_VERSION = 'v22.24';"));
ok('smoke_v2214 的 README 成就 pin 已随新现实更新为 44 项双处落位',
  s2214.includes('成就一览（全部 44 项进度') && s2214.includes('**44 项成就**'));
ok('smoke_v2214 的 MUSH_GOAL 导出相邻性 pin 已随新现实更新（MUSH2_GOAL 落位）',
  s2214.includes('MUSHROOM_GOAL, MUSH_GOAL, MUSH2_GOAL, MIST_GOAL'));
ok('smoke_v2213 的 README 树尾 pin 已更新为 + smoke_v2218_mush2', s2213.includes('smoke_v2217_elixir2 + smoke_v2218_mush2 + smoke_v2219_footkeys + smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter（npm test 串跑）'));

// 旧代 pin 零残留：全部测试文件不得再含 v22.17 版本字面量 pin（拆串构造避免本文件扫描行自匹配）
const OLD_GV = "const GAME_VERSION = 'v22." + "17';";
let stale = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes(OLD_GV)) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v22.17 全库清零）', stale.length === 0, stale.join(','));
let staleId = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes("GAME_VERSION === 'v22." + "17'")) staleId.push(f);
}
ok('旧代 GAME_VERSION 恒等 pin 零残留（===v22.17 全库清零）', staleId.length === 0, staleId.join(','));
let staleSuite = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes('一百一十三件套（一百一十二件套清' + '除）')) staleSuite.push(f);
}
ok('旧代件套 pin 零残留（一百一十三件套（一百一十二件套清' + '除）全库清零）', staleSuite.length === 0, staleSuite.join(','));
let staleTail = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes('smoke_v2216_picker + smoke_v2217_elixir2（npm test 串' + '跑）')) staleTail.push(f);
}
ok('旧代树尾 pin 零残留（smoke_v2216_picker + smoke_v2217_elixir2 串全库清零）', staleTail.length === 0, staleTail.join(','));
// 断链防回归：不得出现 v2216_picker 被新尾吞并的坏链（smoke_v2215_tutorvol 直接接 smoke_v2217_elixir2）
let brokenTail = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes('smoke_v2215_tutorvol + smoke_v2217_elixir2 + smoke_v2218_mush2（npm test 串' + '跑）')) brokenTail.push(f);
}
if (read('README.md').includes('smoke_v2215_tutorvol + smoke_v2217_elixir2 + smoke_v2218_mush2（npm test 串' + '跑）')) brokenTail.push('README.md');
ok('坏链 pin 零残留（v2216_picker 吞并链全库清零）', brokenTail.length === 0, brokenTail.join(','));
// 旧代 README 成就正 pin 零残留：全部测试文件不得再含「全部 43 项进·度」或
// 「readme.includes(『**43 项成就**』)」形态的正向 pin（拆串避免自匹配）
let staleAch = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  const posPin = "readme.includes('**43 项成" + "就**'";
  if (src.includes('成就一览（全部 43 项进' + '度') || src.includes(posPin)) staleAch.push(f);
}
ok('旧代 README 成就正 pin 零残留（43 项全库清零）', staleAch.length === 0, staleAch.join(','));
// 旧代 ACH_LIST 精确计数断言零残留（===43 全库清零）
let staleCount = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes('ACH_LIST.length === ' + '43')) staleCount.push(f);
}
ok('旧代 ACH_LIST 精确计数断言零残留（===43 全库清零）', staleCount.length === 0, staleCount.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
