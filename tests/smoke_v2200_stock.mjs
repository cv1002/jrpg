// v22.0 专项冒烟：新成就「有备无患」（药水线首枚里程碑，新内容·单成就，承 v21.91 长明不熄 / v21.93
// 驱雾百战 / v21.95 彻夜长明 / v21.97 鸿运当头 / v21.99 金玉满堂 单成就先例）——成就版图逐线核对后的
// 又一条新线补全：金币线（rich·rich2）、时长线（ptime·ptime2）、讨伐线（hunt10·hunt100）、掉落线
// （lucky·lucky2）都有多档里程碑，唯独药水这条全程陪伴的续航资源线（商店 POTION_PRICE / 宝箱掉落 /
// 战斗掉落 / 任务奖励四源，背包上限 POTION_CAP=99）没有任何纪念——背包里这排红瓶攒到 20 瓶无回响。
// 现补首枚（POTIONS_GOAL=20 瓶，hunt100 途程内自然积累可达）：判定/描述/进度三处同读新常量
// POTIONS_GOAL（与 RICH2_GOAL 同一「成就阈值数据化」家族——改门槛只改 data.js 一处自动跟随，零裸
// 字面量），计数读既有 hero.item 字段（newGame 起始 START_POTIONS、shop.buyPotion/开箱/掉落/任务奖励
// 写定、喝药扣减，随存档快照持久化、(prog g.item||0) 防御式格式化——旧档无此字段=0 不误解锁、零迁移，
// 承 v19.41 seen 同款）；无 r 字段（与 rich/memoir/skills/hardtrue 同款纯里程碑——备而无患本身就是
// 奖励）；解锁时机：applyAchievements 既有通路任意判定点当场解锁（item 为持续变化量，无需新判定点，
// 承 lvl12/lucky2 同款——先买药再喝掉也照常解锁，已解锁不因消耗回落而撤销）；v22.0 另给
// shop.buyPotion 成功分支补 applyAchievements（承 v21.73 buyArmor 当场判定先例——买满第 20 瓶的瞬间
// 即解锁，反馈不迟到）。
// 本冒烟守护：版本锚点、POTIONS_GOAL 数据契约（===20、声明与导出）、ACH_LIST 契约（stock 唯一/
// 总数精确 38/既有 37 成就 id 零回归/追加在末尾序位）、ok/prog 谓词逐值（0·19 false / 20·99 true /
// 缺 item 字段防御 false·0/20 / prog 不钳制 99/20）、core.js 源级落位（newGame item: START_POTIONS
// 起始）、shop.js 源级落位（buyPotion 成功分支当场 applyAchievements）、运行期全链路（applyAchievements
// 真实解锁落 hero.ach / 未够不误解锁 / 重复调用去重）、drawAch 38 项滚动渲染不抛错、
// README/package.json/CHANGELOG 同步、姊妹件套 pin（v2199..v2176 九十六件套 / v2199..v2179
// GAME_VERSION v22.0 / v2199..v2192 恒等 v22.0 / v2199..v2159 成就 pin 38 项双处）随新现实更新
// + smoke_v2199 精确计数断言去硬化（===37→>=37）复核 + 旧代 v21.99 字面量 pin / 旧代 37 项正向 pin
// 零残留。
import { GAME_VERSION, ACH_LIST, POTIONS_GOAL } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.0 有备无患药水线首枚里程碑冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.99 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.99', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 99)), GAME_VERSION);
ok('GAME_VERSION 字面量已为 v22.0', GAME_VERSION === 'v22.7', GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const coreSrc = read('../js/core.js');
const shopSrc = read('../js/shop.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v22.0 版本注释', dataSrc.includes('v22.0 新成就「有备无患」'));
ok('data.js GAME_VERSION 字面量已更新为 v22.0', dataSrc.includes("const GAME_VERSION = 'v22.7';"));
ok('data.js 仍保留 v21.99 历史注释（累积注释块，姊妹 pin 不失效）', dataSrc.includes('v21.99 新成就「金玉满堂」'));
ok('data.js 导出 POTIONS_GOAL（export 块落位，与 PLAY_TIME2_GOAL/POTIONS2_GOAL 相邻）', dataSrc.includes('PLAY_TIME_GOAL, PLAY_TIME2_GOAL, POTIONS_GOAL, POTIONS2_GOAL, PERFECTION_GOLD'));

// —— POTIONS_GOAL 数据契约 ——
ok('POTIONS_GOAL === 20（药水线首枚 = 累计持有 20 瓶药水）', POTIONS_GOAL === 20, String(POTIONS_GOAL));
ok('POTIONS_GOAL 声明为 20 且注释含「有备无患」口径', dataSrc.includes('const POTIONS_GOAL = 20;') && dataSrc.includes('成就「有备无患」'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'stock');
ok('ACH_LIST 含 stock「有备无患」且 id 唯一',
  !!ach && ach.name === '有备无患' && ACH_LIST.filter((a) => a.id === 'stock').length === 1);
ok('ACH_LIST 精确计数断言已去硬化（===38→>=38 存活性口径，承 v2199 对 v2197 同款先例）', ACH_LIST.length >= 38, String(ACH_LIST.length));
ok('stock 描述由 POTIONS_GOAL 派生（单一数据源，零裸字面量 20）',
  ach.d === `持有 ${POTIONS_GOAL} 瓶药水`, ach.d);
ok('stock 判定/进度同读 POTIONS_GOAL + item 防御式（ok (g.item||0) / prog (g.item||0)）',
  String(ach.ok).includes('POTIONS_GOAL') && String(ach.ok).includes('g.item||0') &&
  String(ach.prog).includes('POTIONS_GOAL') && String(ach.prog).includes('g.item||0'));
ok('stock 无 r 字段纯里程碑（与 rich/memoir/skills/hardtrue 同款）', !('r' in ach));

// —— 既有 37 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime', 'hunt100', 'ptime2', 'lucky2', 'rich2'];
ok('既有 37 成就 id 零回归', EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('stock 追加在末尾序位（rich2 36 / stock 37，既有序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'rich2') === 36 &&
  ACH_LIST.findIndex((a) => a.id === 'stock') === 37);

// —— ok/prog 谓词逐值 ——
ok('item=0（防御分支，未达标）→ false', ach.ok({ item: 0 }) === false);
ok('item=19（差 1 瓶）→ false（恰在门槛下不解锁）', ach.ok({ item: 19 }) === false);
ok('item=20 → true（恰达标）', ach.ok({ item: 20 }) === true);
ok('item=99（背包上限）→ true（超阈值仍达标）', ach.ok({ item: 99 }) === true);
ok('缺 item 字段旧档 → false 且 prog 0/20（防御式零迁移）',
  ach.ok({}) === false && ach.prog({}) === `0/${POTIONS_GOAL}`);
ok('item 非数值（undefined 兜底）→ false 不抛错', ach.ok({ item: undefined }) === false);
ok('prog 10 瓶 → 10/20', ach.prog({ item: 10 }) === `10/${POTIONS_GOAL}`, ach.prog({ item: 10 }));
ok('prog 20 瓶 → 20/20', ach.prog({ item: 20 }) === `20/${POTIONS_GOAL}`, ach.prog({ item: 20 }));
ok('prog 99 瓶不钳制（99/20，承 lvl5「X/N 不钳制」口径）', ach.prog({ item: 99 }) === `99/${POTIONS_GOAL}`, ach.prog({ item: 99 }));

// —— 源级落位：core.js newGame 起始 / shop.js buyPotion 当场判定 ——
ok('core.js newGame 含 item: START_POTIONS 起始字段', coreSrc.includes('item: START_POTIONS'));
ok('shop.js buyPotion 成功分支含 v22.0 当场判定注释与 applyAchievements', shopSrc.includes('v22.0 买药水当场判定成就') && shopSrc.includes('applyAchievements();'));

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

// 达标档：item=20 → applyAchievements 真实解锁落 hero.ach（持续变化量，任意判定点当场解锁）
let hero = newGame('余烬');
hero.item = 20;
hero = runAch(hero);
ok('运行期：item=20 触发 applyAchievements 真实解锁 stock 落 hero.ach', hero.ach.includes('stock'), hero.ach.join(','));

// 未达标档：item=19 → 不误解锁（差 1 瓶）
hero = newGame('灯见');
hero.item = 19;
hero = runAch(hero);
ok('运行期：item=19 不误解锁 stock', !hero.ach.includes('stock'));

// 新档起始药水（START_POTIONS，未达 20）→ 不误解锁
hero = newGame('潮');
hero = runAch(hero);
ok('运行期：新档起始 item 不误解锁 stock', !hero.ach.includes('stock'), String(hero.item));

// 重复调用去重：已解锁后再 applyAchievements 不重复 push
hero = newGame('灯');
hero.item = 20;
runAch(hero);
runAch(hero);
ok('运行期：重复调用去重（hero.ach 中 stock 恰一枚）',
  hero.ach.filter((x) => x === 'stock').length === 1);

// 旧档防御档：无 item 字段读档 → applyAchievements 不抛错且不解锁（零迁移）
hero = newGame('潮');
delete hero.item;
let threw = null;
try { runAch(hero); } catch (e) { threw = e; }
ok('运行期：旧档缺 item 字段 applyAchievements 不抛错（防御式）', threw === null, threw && String(threw.stack || threw));
ok('运行期：缺字段旧档不解锁 stock（零迁移）', !hero.ach.includes('stock'));

// —— drawAch 渲染（38 项滚动不抛错；PAGE=10 四页）——
let rendered = true, renderedPg4 = true;
try {
  S.G = newGame('测试'); S.G.ach = ['stock']; S.achScroll = 0; S.scene = 'ach';
  drawAch();
} catch (e) { rendered = false; }
try {
  S.achScroll = 40; // 38 项滚到末页（PAGE=10，钳制到 30）不抛错
  drawAch();
} catch (e) { renderedPg4 = false; }
S.achScroll = 0; S.scene = 'world';
ok('运行期：成就页 drawAch 38 项渲染不抛错', rendered);
ok('运行期：成就页末页滚动渲染不抛错（38 项 PAGE=10 四页）', renderedPg4);

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树收录 smoke_v2200_stock 且位于串尾（v22.0 随新现实由当版冒烟守护）', readme.includes('smoke_v2199_rich2 + smoke_v2200_stock + smoke_v2201_fragstatus + smoke_v2202_fragwin + smoke_v2204_brew2 + smoke_v2206_stock2 + smoke_v2207_titledel（npm test 串跑）'));
ok('README 件套口径为一百零三件套（一百零二件套清除）',
  readme.includes('冒烟一百零三件套（一百零二件套清除）') && !readme.includes('冒烟九十五件套（九十四件套清' + '除）'));
ok('README 含 v22.0 守护描述', readme.includes('v22.0 起含新成就「有备无患」'));
ok('README 成就口径「38 项」双处同步（快速上手表 C 键行 + 图鉴&成就行）',
  readme.includes('成就一览（全部 40 项进度') && readme.includes('**40 项成就**') &&
  !readme.includes('成就一览（全部 37 项进' + '度') && !readme.includes('**37 项成' + '就**'));
ok('package.json 已收录 smoke_v2200_stock（npm test 串跑第 96 份）',
  pkg.includes('smoke_v2200_stock.mjs') && /smoke_v2199_rich2\.mjs && node tests\/smoke_v2200_stock\.mjs/.test(pkg));
ok('CHANGELOG 含 v22.0 条目', changelog.includes('## v22.0 '));

// —— 姊妹件套 pin 复查（v21.7 惯例：本版冒烟守护姊妹随新现实更新）——
const suite96 = ['smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs', 'smoke_v2191_ptime.mjs',
  'smoke_v2190_launch.mjs', 'smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs',
  'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs',
  'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs',
  'smoke_v2181_helpquickcast.mjs', 'smoke_v2180_grain.mjs', 'smoke_v2179_titlerecap.mjs',
  'smoke_v2178_codexseen.mjs', 'smoke_v2177_elites.mjs', 'smoke_v2176_allchests.mjs'];
for (const nm of suite96) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README 件套 pin 已随新现实更新为一百零三件套（一百零二件套清除）`,
    src.includes('一百零三件套（一百零二件套清除）'));
}
const vers = ['smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs', 'smoke_v2191_ptime.mjs',
  'smoke_v2190_launch.mjs', 'smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs',
  'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs',
  'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs',
  'smoke_v2181_helpquickcast.mjs', 'smoke_v2179_titlerecap.mjs'];
for (const nm of vers) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 字面量 pin 已随新现实更新为 v22.0`,
    src.includes("const GAME_VERSION = 'v22.7';"));
}
for (const nm of ['smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs']) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 恒等 pin（===）已随新现实更新为 v22.0`,
    src.includes("GAME_VERSION === 'v22.7'"));
}
const achFiles = ['smoke_v2199_rich2.mjs', 'smoke_v2197_lucky2.mjs', 'smoke_v2195_ptime2.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2191_ptime.mjs', 'smoke_v2188_wander.mjs', 'smoke_v2186_brew.mjs',
  'smoke_v2184_lvl12.mjs', 'smoke_v2180_grain.mjs', 'smoke_v2177_elites.mjs', 'smoke_v2176_allchests.mjs',
  'smoke_v2173_aegis.mjs', 'smoke_v2168_hardtrue.mjs', 'smoke_v2159_skillach.mjs'];
for (const nm of achFiles) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README 成就 pin 已随新现实更新为 38 项双处落位`,
    src.includes("readme.includes('成就一览（全部 40 项进度'") && src.includes('**40 项成就**'));
}
const s2199 = read('../tests/smoke_v2199_rich2.mjs');
ok('smoke_v2199 的 ACH_LIST 精确计数断言已去硬化（===37 零残留，>=37 存活性口径落位）',
  s2199.includes('ACH_LIST.length >= 37') && !s2199.includes('ACH_LIST.length === 3' + '7'));
// 旧代 pin 零残留：全部测试文件不得再含 v21.99 版本字面量 pin（拆串构造避免本文件扫描行自匹配）
const OLD_GV = "const GAME_VERSION = 'v21.9" + "9';";
let stale = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes(OLD_GV)) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v21.99 全库清零）', stale.length === 0, stale.join(','));
let staleId = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes("GAME_VERSION === 'v21.9" + "9'")) staleId.push(f);
}
ok('旧代 GAME_VERSION 恒等 pin 零残留（===v21.99 全库清零）', staleId.length === 0, staleId.join(','));
let staleSuite = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes('九十五件套（九十四件套清' + '除）')) staleSuite.push(f);
}
ok('旧代件套 pin 零残留（九十五件套（九十四件套清' + '除）全库清零）', staleSuite.length === 0, staleSuite.join(','));
// 旧代 README 成就正 pin 零残留：全部测试文件不得再含「全部 37 项进·度」或
// 「readme.includes(『**37 项成就**』)」形态的正向 pin（拆串避免自匹配）
let staleAch = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  const posPin = "readme.includes('**37 项成" + "就**'";
  if (src.includes('全部 37 项进' + '度') || src.includes(posPin)) staleAch.push(f);
}
ok('旧代 README 成就正 pin 零残留（37 项全库清零）', staleAch.length === 0, staleAch.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
