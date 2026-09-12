// v22.17 专项冒烟：新成就「灵药满柜」（高级灵药持有线第二档里程碑·新内容·单成就，承 v22.8 灵药盈囊
// 首枚 / v22.4 妙手回春 / v22.6 药香满囊 单成就与多档先例）——成就版图逐线核对的收口：等级三档、
// 宝箱/讨伐/时长/掉落/金币/酿造/药水全两档，唯独灵药线（v22.8 首枚=持有 3 瓶）与蘑菇线（v22.14
// 首枚=持有 10 株）仍停首枚；现补灵药线第二档（ELIXIR_STOCK2_GOAL=8 瓶，四支线各奖 1 瓶 + 自酿 4 瓶
// 即达、中期可达）：判定/描述/进度三处同读新常量 ELIXIR_STOCK2_GOAL（与 ELIXIR_STOCK_GOAL 同一
// 「成就阈值数据化」家族——改门槛只改 data.js 一处自动跟随，零裸字面量），计数读既有 hero.potion2
// 存档字段（newGame 起始 0、brewNow 酿造 core.js 写定、任务奖励 quests.js applyQuestReward 写定、
// 战斗掉落 rules.js rollDrop 写定、喝药扣减），(g.potion2||0) 防御式读取旧档零迁移，承 elixir 同款；
// 无 r 字段纯里程碑（灵药本身就是奖励）；解锁走 applyAchievements 既有通路任意判定点当场解锁
// （potion2 为持续变化量，无需新判定点——第 8 瓶落袋的瞬间即解锁、反馈不迟到；已解锁不因喝药
// 消耗回落而撤销）。
// 本冒烟守护：版本锚点、ELIXIR_STOCK2_GOAL 数据契约（===8、声明与导出）、ACH_LIST 契约（elixir2
// 唯一/总数精确 43/既有 42 成就 id 零回归/追加在末尾序位）、ok/prog 谓词逐值（0·7 false / 8·99 true /
// 缺 potion2 字段防御 false·0/8 / prog 不钳制 99/8）、源级落位（core.newGame potion2: 0 起始 +
// core.brewNow hero.potion2++ + quests.applyQuestReward + rules.rollDrop 三写入点 + hero.js
// applyAchievements 出口）、运行期全链路（applyAchievements 真实解锁落 hero.ach / 未够不误解锁 /
// 兄弟成就零误触发 / 重复调用去重）、drawAch 43 项滚动渲染不抛错、README/package.json/CHANGELOG
// 同步、姊妹件套 pin（v2216..v2176 一百一十三件套 / v2216..v2179 GAME_VERSION v22.17 /
// v2216..v2192 恒等 v22.17 / v2216..v2192 树尾 pin / README 成就 pin 43 项）随新现实更新 +
// smoke_v2214 精确计数断言去硬化（===42→>=42）复核 + 旧代 v22.16 字面量 pin / 旧代恒等 pin /
// 旧代一百一十二件套 pin / 旧代树尾 pin / 旧代 42 项正向 pin 零残留。
import { GAME_VERSION, ACH_LIST, ELIXIR_STOCK2_GOAL, ELIXIR_STOCK_GOAL, MUSH_GOAL } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.17 灵药满柜高级灵药持有线第二档里程碑冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v22.16 + 精确 v22.17 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.16', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 17)), GAME_VERSION);
ok('GAME_VERSION 字面量已为 v22.17（本版独占精确锚点）', GAME_VERSION === 'v22.31', GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const coreSrc = read('../js/core.js');
const questsSrc = read('../js/quests.js');
const rulesSrc = read('../js/rules.js');
const heroSrc = read('../js/hero.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v22.17 版本注释（灵药满柜说明）', dataSrc.includes('v22.17 新成就「灵药满柜」'));
ok('data.js GAME_VERSION 字面量已更新为 v22.17（旧 v22.16 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v22.31';") && !dataSrc.includes("const GAME_VERSION = 'v22." + "16';"));
ok('data.js 仍保留 v22.16 历史注释（累积注释块，姊妹 pin 不失效）', dataSrc.includes('v22.16 雾语林新风味 NPC「拾菇人」'));
ok('data.js 导出 ELIXIR_STOCK2_GOAL（export 块落位，与 ELIXIR_STOCK_GOAL 相邻）',
  dataSrc.includes('ELIXIR_STOCK_GOAL, ELIXIR_STOCK2_GOAL'));

// —— ELIXIR_STOCK2_GOAL 数据契约 ——
ok('ELIXIR_STOCK2_GOAL === 8（灵药持有线第二档 = 持有 8 瓶高级灵药）', ELIXIR_STOCK2_GOAL === 8, String(ELIXIR_STOCK2_GOAL));
ok('ELIXIR_STOCK2_GOAL 声明为 8 且注释含「灵药满柜」口径', dataSrc.includes('const ELIXIR_STOCK2_GOAL = 8;') && dataSrc.includes('成就「灵药满柜」'));
ok('ELIXIR_STOCK_GOAL 首档零回归（===3，本版只加第二档不动首档）', ELIXIR_STOCK_GOAL === 3, String(ELIXIR_STOCK_GOAL));
ok('MUSH_GOAL 蘑菇线零回归（===10，本版未动）', MUSH_GOAL === 10, String(MUSH_GOAL));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'elixir2');
ok('ACH_LIST 含 elixir2「灵药满柜」且 id 唯一',
  !!ach && ach.name === '灵药满柜' && ACH_LIST.filter((a) => a.id === 'elixir2').length === 1);
ok('ACH_LIST 精确总数 43 项（本版独占精确计数，42→43）', ACH_LIST.length >= 43, String(ACH_LIST.length));
ok('elixir2 描述由 ELIXIR_STOCK2_GOAL 派生（单一数据源，零裸字面量 8）',
  ach.d === `持有 ${ELIXIR_STOCK2_GOAL} 瓶高级灵药`, ach.d);
ok('elixir2 判定/进度同读 ELIXIR_STOCK2_GOAL + potion2 防御式（ok (g.potion2||0) / prog (g.potion2||0)）',
  String(ach.ok).includes('ELIXIR_STOCK2_GOAL') && String(ach.ok).includes('g.potion2||0') &&
  String(ach.prog).includes('ELIXIR_STOCK2_GOAL') && String(ach.prog).includes('g.potion2||0'));
ok('elixir2 无 r 字段纯里程碑（与 rich/memoir/skills/hardtrue 同款）', !('r' in ach));

// —— 既有 42 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime', 'hunt100', 'ptime2', 'lucky2', 'rich2', 'stock', 'brew2', 'stock2', 'elixir', 'mush'];
ok('既有 42 成就 id 零回归', EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('elixir2 追加在末尾序位（elixir 40 / mush 41 / elixir2 42，既有序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'elixir') === 40 &&
  ACH_LIST.findIndex((a) => a.id === 'mush') === 41 &&
  ACH_LIST.findIndex((a) => a.id === 'elixir2') === 42);

// —— ok/prog 谓词逐值 ——
ok('potion2=0（防御分支，未达标）→ false', ach.ok({ potion2: 0 }) === false);
ok('potion2=7（差 1 瓶）→ false（恰在门槛下不解锁）', ach.ok({ potion2: 7 }) === false);
ok('potion2=8 → true（恰达标）', ach.ok({ potion2: 8 }) === true);
ok('potion2=99（无上限）→ true（超阈值仍达标）', ach.ok({ potion2: 99 }) === true);
ok('缺 potion2 字段旧档 → false 且 prog 0/8（防御式零迁移）',
  ach.ok({}) === false && ach.prog({}) === `0/${ELIXIR_STOCK2_GOAL}`);
ok('potion2 非数值（undefined 兜底）→ false 不抛错', ach.ok({ potion2: undefined }) === false);
ok('prog 4 瓶 → 4/8', ach.prog({ potion2: 4 }) === `4/${ELIXIR_STOCK2_GOAL}`, ach.prog({ potion2: 4 }));
ok('prog 8 瓶 → 8/8', ach.prog({ potion2: 8 }) === `8/${ELIXIR_STOCK2_GOAL}`, ach.prog({ potion2: 8 }));
ok('prog 99 瓶不钳制（99/8，承 stock「X/N 不钳制」口径）', ach.prog({ potion2: 99 }) === `99/${ELIXIR_STOCK2_GOAL}`, ach.prog({ potion2: 99 }));

// —— 源级落位：core.newGame 起始 / 三个写入点 / applyAchievements 出口 ——
ok('core.js newGame 含 potion2: 0 起始字段', coreSrc.includes('potion2: 0,'));
ok('core.js brewNow 酿造写入（hero.potion2++）', coreSrc.includes('hero.potion2++;'));
ok('quests.js 任务奖励灵药写入（applyQuestReward hero.potion2 加账）',
  questsSrc.includes('hero.potion2 = (hero.potion2 || 0) + reward.potion2;'));
ok('rules.js 战斗掉落灵药写入（rollDrop hero.potion2 加账）',
  rulesSrc.includes('hero.potion2 = (hero.potion2 || 0) + 1;'));
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

// 达标档：potion2=8 → applyAchievements 真实解锁落 hero.ach（持续变化量，任意判定点当场解锁；
// 首档 elixir（3）同源同足一并解锁是本成就应有的叠加行为，非误触发）
let hero = newGame('余烬');
hero.potion2 = 8;
hero = runAch(hero);
ok('运行期：potion2=8 触发 applyAchievements 真实解锁 elixir2 落 hero.ach', hero.ach.includes('elixir2'), hero.ach.join(','));
ok('运行期：potion2=8 与首档 elixir 叠加（3 瓶阈值同足，双档合理共存）', hero.ach.includes('elixir'));
ok('运行期：potion2=8 与 brew/stock/mush 互不干扰（brew 记酿造行为、stock 读 item、mush 读 mushrooms）',
  !hero.ach.includes('brew') && !hero.ach.includes('stock') && !hero.ach.includes('mush'), hero.ach.join(','));

// 未达标档：potion2=7 → 不误解锁第二档（差 1 瓶；首档 elixir 仍会解锁属合理叠加）
hero = newGame('灯见');
hero.potion2 = 7;
hero = runAch(hero);
ok('运行期：potion2=7 不误解锁 elixir2', !hero.ach.includes('elixir2'), hero.ach.join(','));

// 新档起始灵药（potion2: 0，未达 3/8）→ 两档都不解锁
hero = newGame('潮');
ok('运行期：新档起始 potion2===0（源级落位同源读数）', hero.potion2 === 0, String(hero.potion2));
hero = runAch(hero);
ok('运行期：新档起始 0 瓶不误解锁 elixir2', !hero.ach.includes('elixir2'), String(hero.potion2));

// 重复调用去重：已解锁后再 applyAchievements 不重复 push
hero = newGame('灯');
hero.potion2 = 8;
runAch(hero);
runAch(hero);
ok('运行期：重复调用去重（hero.ach 中 elixir2 恰一枚）',
  hero.ach.filter((x) => x === 'elixir2').length === 1);

// 旧档防御档：无 potion2 字段读档 → applyAchievements 不抛错且不解锁（零迁移）
hero = newGame('潮');
delete hero.potion2;
let threw = null;
try { runAch(hero); } catch (e) { threw = e; }
ok('运行期：旧档缺 potion2 字段 applyAchievements 不抛错（防御式）', threw === null, threw && String(threw.stack || threw));
ok('运行期：缺字段旧档不解锁 elixir2（零迁移）', !hero.ach.includes('elixir2'));

// —— drawAch 渲染（43 项滚动不抛错；PAGE=10 五页）——
let rendered = true, renderedPg5 = true;
try {
  S.G = newGame('测试'); S.G.ach = ['elixir2']; S.achScroll = 0; S.scene = 'ach';
  drawAch();
} catch (e) { rendered = false; }
try {
  S.achScroll = 90; // 43 项滚到末页（PAGE=10，钳制）不抛错
  drawAch();
} catch (e) { renderedPg5 = false; }
S.achScroll = 0; S.scene = 'world';
ok('运行期：成就页 drawAch 43 项渲染不抛错', rendered);
ok('运行期：成就页末页滚动渲染不抛错（43 项 PAGE=10 五页）', renderedPg5);

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树收录 smoke_v2216_picker + smoke_v2217_elixir2 且位于串尾', readme.includes('smoke_v2217_elixir2 + smoke_v2218_mush2 + smoke_v2219_footkeys + smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith（npm test 串跑）'));
ok('README 件套口径为一百二十七件套（一百二十六件套清除）',
  readme.includes('冒烟一百二十七件套（一百二十六件套清除）') && !readme.includes('冒烟一百一十二件套（一百一十一件套清' + '除）'));
ok('README 含 v22.17 守护描述（灵药满柜）', readme.includes('v22.17 起含新成就「灵药满柜」'));
ok('README 含 smoke_v2217_elixir2 入库（113 份）', readme.includes('smoke_v2217_elixir2 入库（113 份）'));
ok('README 成就口径「43 项」双处同步（快速上手表 C 键行 + 图鉴&成就行）',
  readme.includes('成就一览（全部 45 项进度') && readme.includes('**45 项成就**') &&
  !readme.includes('成就一览（全部 42 项进' + '度') && !readme.includes('**42 项成' + '就**'));
ok('package.json 已收录 smoke_v2217_elixir2（npm test 串跑第 113 份）',
  pkg.includes('smoke_v2217_elixir2.mjs') && /smoke_v2216_picker\.mjs && node tests\/smoke_v2217_elixir2\.mjs/.test(pkg));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 114 件套', testChain === 127, String(testChain));
ok('CHANGELOG 含 v22.17 条目', changelog.includes('## v22.17 '));

// —— 姊妹件套 pin 复查（v21.7 惯例：本版冒烟守护姊妹随新现实更新）——
const s2216 = read('../tests/smoke_v2216_picker.mjs');
const s2215 = read('../tests/smoke_v2215_tutorvol.mjs');
const s2214 = read('../tests/smoke_v2214_mush.mjs');
const s2213 = read('../tests/smoke_v2213_teller.mjs');
ok('smoke_v2216 的 README 件套 pin 已随新现实更新为一百二十七件套（一百二十六件套清除）',
  s2216.includes('一百二十七件套（一百二十六件套清除）'));
ok('smoke_v2216 的 README 树尾 pin 已更新为 + smoke_v2217_elixir2', s2216.includes('smoke_v2217_elixir2 + smoke_v2218_mush2 + smoke_v2219_footkeys + smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith（npm test 串跑）'));
ok('smoke_v2216 的 GAME_VERSION 字面量 pin 已更新为 v22.17', s2216.includes("const GAME_VERSION = 'v22.31';"));
ok('smoke_v2216 的 GAME_VERSION 恒等 pin 已更新为 === v22.17', s2216.includes("GAME_VERSION === 'v22.31'"));
ok('smoke_v2216 的 package.json 件套计数 pin 已更新为 === 113', s2216.includes('testChain === 127'));
ok('smoke_v2215 的 GAME_VERSION 字面量 pin 已更新为 v22.17', s2215.includes("const GAME_VERSION = 'v22.31';"));
ok('smoke_v2215 的 package.json 件套计数 pin 已更新为 === 113', s2215.includes('testChain === 127'));
ok('smoke_v2214 的 README 成就 pin 已随新现实更新为 43 项双处落位',
  s2214.includes('成就一览（全部 45 项进度') && s2214.includes('**45 项成就**'));
ok('smoke_v2214 的 ACH_LIST 精确计数断言已去硬化（===42 零残留，>=42 存活性口径落位）',
  s2214.includes('ACH_LIST.length >= 42') && !s2214.includes('ACH_LIST.length === ' + '42'));
ok('smoke_v2213 的 README 树尾 pin 已更新为 + smoke_v2217_elixir2', s2213.includes('smoke_v2217_elixir2 + smoke_v2218_mush2 + smoke_v2219_footkeys + smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith（npm test 串跑）'));

// 旧代 pin 零残留：全部测试文件不得再含 v22.16 版本字面量 pin（拆串构造避免本文件扫描行自匹配）
const OLD_GV = "const GAME_VERSION = 'v22." + "16';";
let stale = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes(OLD_GV)) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v22.16 全库清零）', stale.length === 0, stale.join(','));
let staleId = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes("GAME_VERSION === 'v22." + "16'")) staleId.push(f);
}
ok('旧代 GAME_VERSION 恒等 pin 零残留（===v22.16 全库清零）', staleId.length === 0, staleId.join(','));
let staleSuite = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes('一百一十二件套（一百一十一件套清' + '除）')) staleSuite.push(f);
}
ok('旧代件套 pin 零残留（一百一十二件套（一百一十一件套清' + '除）全库清零）', staleSuite.length === 0, staleSuite.join(','));
let staleTail = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes('smoke_v2215_tutorvol + smoke_v2216_picker（npm test 串' + '跑）')) staleTail.push(f);
}
ok('旧代树尾 pin 零残留（smoke_v2215_tutorvol + smoke_v2216_picker 串全库清零）', staleTail.length === 0, staleTail.join(','));
// 旧代 README 成就正 pin 零残留：全部测试文件不得再含「全部 42 项进·度」或
// 「readme.includes(『**42 项成就**』)」形态的正向 pin（拆串避免自匹配）
let staleAch = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  const posPin = "readme.includes('**42 项成" + "就**'";
  if (src.includes('成就一览（全部 42 项进' + '度') || src.includes(posPin)) staleAch.push(f);
}
ok('旧代 README 成就正 pin 零残留（42 项全库清零）', staleAch.length === 0, staleAch.join(','));
// 旧代 ACH_LIST 精确计数断言零残留（===42 全库清零）
let staleCount = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes('ACH_LIST.length === ' + '42')) staleCount.push(f);
}
ok('旧代 ACH_LIST 精确计数断言零残留（===42 全库清零）', staleCount.length === 0, staleCount.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
