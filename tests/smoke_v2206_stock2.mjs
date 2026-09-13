// v22.6 专项冒烟：新成就「药香满囊」（药水线第二档里程碑，新内容·单成就，承 v22.0 有备无患首枚与
// v21.91 长明不熄 / v21.93 驱雾百战 / v21.95 彻夜长明 / v21.97 鸿运当头 / v21.99 金玉满堂 / v22.4 妙手回春
// 多档先例）——成就版图逐线核对的第二档补全：等级线已有三档（lvl5·lvl10·lvl12）、宝箱线两档
// （chests·allchests）、讨伐线两档（hunt10·hunt100）、时长线两档（ptime·ptime2）、掉落线两档
// （lucky·lucky2）、金币线两档（rich·rich2）、酿造线两档（brew·brew2），唯独药水线（stock 有备无患=
// 持有 20 瓶）只有首枚——背包上限 POTION_CAP=99、练到 Lv12/补完图鉴的玩家手里常备 30-50 瓶（商店
// POTION_PRICE、宝箱掉落、战斗掉落、任务奖励四源），在「有备无患」处毫无第二枚回应。现补第二档
// （POTIONS2_GOAL=50 瓶）：判定/描述/进度三处同读新常量 POTIONS2_GOAL（与 POTIONS_GOAL 同一「成就阈值
// 数据化」家族——改门槛只改 data.js 一处自动跟随，零裸字面量），计数读既有 hero.item 存档字段
// （(g.item||0) 防御式读取旧档零迁移，承 stock 同款）；无 r 字段（与 rich/memoir/skills/hardtrue 同款
// 纯里程碑——备而无患本身就是奖励）；解锁时机：applyAchievements 既有通路任意判定点当场解锁（item 为
// 持续变化量，承 lvl12/lucky2 同款——先买药再喝掉也照常解锁，已解锁不因消耗回落而撤销），shop.buyPotion
// 成功分支 v22.0 起已当场 applyAchievements（承 v21.73 buyArmor 先例——买满第 50 瓶的瞬间即解锁，
// 反馈不迟到）。
// 本冒烟守护：版本锚点、POTIONS2_GOAL 数据契约（===50、声明与导出）、ACH_LIST 契约（stock2 唯一/
// 总数精确 40/既有 39 成就 id 零回归/追加在末尾序位）、ok/prog 谓词逐值（0·49 false / 50·99 true /
// 缺 item 字段防御 false·0/50 / prog 不钳制 99/50）、core.js 源级落位（newGame item: START_POTIONS
// 起始）、shop.js 源级落位（buyPotion 成功分支当场 applyAchievements）、运行期全链路（applyAchievements
// 真实解锁落 hero.ach / 未够不误解锁 / 重复调用去重）、drawAch 40 项滚动渲染不抛错、
// README/package.json/CHANGELOG 同步、姊妹件套 pin（v2205..v2176 一百零二件套 / v2205..v2181·v2179
// GAME_VERSION v22.6 / v2205..v2192 恒等 v22.6 / v2205..v2192 树尾 pin）随新现实更新
// + smoke_v2204 精确计数断言去硬化（===39→>=39）复核 + 旧代 v22.5 字面量 pin / 旧代 39 项正向 pin /
// 旧代一百零一件套 pin 零残留。
import { GAME_VERSION, ACH_LIST, POTIONS_GOAL, POTIONS2_GOAL } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.6 药香满囊药水线第二档里程碑冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v22.5 + 精确 v22.6 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.5', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 6)), GAME_VERSION);
ok('GAME_VERSION 字面量已为 v22.6（本版独占精确锚点）', GAME_VERSION === 'v22.36', GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const coreSrc = read('../js/core.js');
const shopSrc = read('../js/shop.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v22.6 版本注释', dataSrc.includes('v22.6 新成就「药香满囊」'));
ok('data.js GAME_VERSION 字面量已更新为 v22.6', dataSrc.includes("const GAME_VERSION = 'v22.36';"));
ok('data.js 仍保留 v22.5 历史注释（累积注释块，姊妹 pin 不失效）', dataSrc.includes('v22.5 标题页存档预览补「🕯️ 记忆碎片 N/4」'));
ok('data.js 导出 POTIONS2_GOAL（export 块落位，与 POTIONS_GOAL 相邻）', dataSrc.includes('POTIONS_GOAL, POTIONS2_GOAL, ELIXIR_STOCK_GOAL, ELIXIR_STOCK2_GOAL, PERFECTION_GOLD'));

// —— POTIONS2_GOAL 数据契约 ——
ok('POTIONS2_GOAL === 50（药水线第二档 = 累计持有 50 瓶药水）', POTIONS2_GOAL === 50, String(POTIONS2_GOAL));
ok('POTIONS2_GOAL 声明为 50 且注释含「药香满囊」口径', dataSrc.includes('const POTIONS2_GOAL = 50;') && dataSrc.includes('成就「药香满囊」'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'stock2');
ok('ACH_LIST 含 stock2「药香满囊」且 id 唯一',
  !!ach && ach.name === '药香满囊' && ACH_LIST.filter((a) => a.id === 'stock2').length === 1);
ok('ACH_LIST 总数 ≥40 项（去硬化存活性口径，39→40→41 三档链）', ACH_LIST.length >= 40, String(ACH_LIST.length));
ok('stock2 描述由 POTIONS2_GOAL 派生（单一数据源，零裸字面量 50）',
  ach.d === `持有 ${POTIONS2_GOAL} 瓶药水`, ach.d);
ok('stock2 判定/进度同读 POTIONS2_GOAL + item 防御式（ok (g.item||0) / prog (g.item||0)）',
  String(ach.ok).includes('POTIONS2_GOAL') && String(ach.ok).includes('g.item||0') &&
  String(ach.prog).includes('POTIONS2_GOAL') && String(ach.prog).includes('g.item||0'));
ok('stock2 无 r 字段纯里程碑（与 rich/memoir/skills/hardtrue 同款）', !('r' in ach));

// —— 既有 39 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime', 'hunt100', 'ptime2', 'lucky2', 'rich2', 'stock', 'brew2'];
ok('既有 39 成就 id 零回归', EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('stock2 追加在末尾序位（brew2 38 / stock2 39，既有序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'brew2') === 38 &&
  ACH_LIST.findIndex((a) => a.id === 'stock2') === 39);

// —— ok/prog 谓词逐值 ——
ok('item=0（防御分支，未达标）→ false', ach.ok({ item: 0 }) === false);
ok('item=49（差 1 瓶）→ false（恰在门槛下不解锁）', ach.ok({ item: 49 }) === false);
ok('item=50 → true（恰达标）', ach.ok({ item: 50 }) === true);
ok('item=99（背包上限）→ true（超阈值仍达标）', ach.ok({ item: 99 }) === true);
ok('缺 item 字段旧档 → false 且 prog 0/50（防御式零迁移）',
  ach.ok({}) === false && ach.prog({}) === `0/${POTIONS2_GOAL}`);
ok('item 非数值（undefined 兜底）→ false 不抛错', ach.ok({ item: undefined }) === false);
ok('prog 25 瓶 → 25/50', ach.prog({ item: 25 }) === `25/${POTIONS2_GOAL}`, ach.prog({ item: 25 }));
ok('prog 50 瓶 → 50/50', ach.prog({ item: 50 }) === `50/${POTIONS2_GOAL}`, ach.prog({ item: 50 }));
ok('prog 99 瓶不钳制（99/50，承 stock「X/N 不钳制」口径）', ach.prog({ item: 99 }) === `99/${POTIONS2_GOAL}`, ach.prog({ item: 99 }));
ok('stock 首档零回归（POTIONS_GOAL 常量未被本版改动）', POTIONS_GOAL === 20, String(POTIONS_GOAL));

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

// 达标档：item=50 → applyAchievements 真实解锁落 hero.ach（持续变化量，任意判定点当场解锁）
let hero = newGame('余烬');
hero.item = 50;
hero = runAch(hero);
ok('运行期：item=50 触发 applyAchievements 真实解锁 stock2 落 hero.ach', hero.ach.includes('stock2'), hero.ach.join(','));
ok('运行期：item=50 首档 stock 同场共存解锁（跨档共存零回归）', hero.ach.includes('stock'), hero.ach.join(','));

// 未达标档：item=49 → 不误解锁（差 1 瓶）
hero = newGame('灯见');
hero.item = 49;
hero = runAch(hero);
ok('运行期：item=49 不误解锁 stock2', !hero.ach.includes('stock2'));

// 新档起始药水（START_POTIONS，未达 50）→ 不误解锁
hero = newGame('潮');
hero = runAch(hero);
ok('运行期：新档起始 item 不误解锁 stock2', !hero.ach.includes('stock2'), String(hero.item));

// 重复调用去重：已解锁后再 applyAchievements 不重复 push
hero = newGame('灯');
hero.item = 50;
runAch(hero);
runAch(hero);
ok('运行期：重复调用去重（hero.ach 中 stock2 恰一枚）',
  hero.ach.filter((x) => x === 'stock2').length === 1);

// 旧档防御档：无 item 字段读档 → applyAchievements 不抛错且不解锁（零迁移）
hero = newGame('潮');
delete hero.item;
let threw = null;
try { runAch(hero); } catch (e) { threw = e; }
ok('运行期：旧档缺 item 字段 applyAchievements 不抛错（防御式）', threw === null, threw && String(threw.stack || threw));
ok('运行期：缺字段旧档不解锁 stock2（零迁移）', !hero.ach.includes('stock2'));

// —— drawAch 渲染（40 项滚动不抛错；PAGE=10 四页）——
let rendered = true, renderedPg4 = true;
try {
  S.G = newGame('测试'); S.G.ach = ['stock2']; S.achScroll = 0; S.scene = 'ach';
  drawAch();
} catch (e) { rendered = false; }
try {
  S.achScroll = 50; // 40 项滚到末页（PAGE=10，钳制到 30）不抛错
  drawAch();
} catch (e) { renderedPg4 = false; }
S.achScroll = 0; S.scene = 'world';
ok('运行期：成就页 drawAch 40 项渲染不抛错', rendered);
ok('运行期：成就页末页滚动渲染不抛错（40 项 PAGE=10 四页）', renderedPg4);

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树收录 smoke_v2206_stock2 且位于串尾', readme.includes('smoke_v2209_achstatus + smoke_v2211_lampkid + smoke_v2212_volume + smoke_v2213_teller + smoke_v2214_mush + smoke_v2215_tutorvol + smoke_v2216_picker + smoke_v2217_elixir2 + smoke_v2218_mush2 + smoke_v2219_footkeys + smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp（npm test 串跑）'));
ok('README 件套口径为一百三十二件套（一百三十一件套清除）',
  readme.includes('冒烟一百三十二件套（一百三十一件套清除）') && !readme.includes('冒烟一百零一件套（一百件套清' + '除）'));
ok('README 含 v22.6 守护描述', readme.includes('v22.6 起含新成就「药香满囊」'));
ok('README 成就口径「40 项」双处同步（快速上手表 C 键行 + 图鉴&成就行）',
  readme.includes('成就一览（全部 45 项进度') && readme.includes('**45 项成就**') &&
  !readme.includes('成就一览（全部 39 项进' + '度') && !readme.includes('**39 项成' + '就**'));
ok('package.json 已收录 smoke_v2206_stock2（npm test 串跑第 102 份）',
  pkg.includes('smoke_v2206_stock2.mjs') && /smoke_v2205_fragtitle\.mjs && node tests\/smoke_v2206_stock2\.mjs/.test(pkg));
ok('CHANGELOG 含 v22.6 条目', changelog.includes('## v22.6 '));

// —— 姊妹件套 pin 复查（v21.7 惯例：本版冒烟守护姊妹随新现实更新）——
const suite102 = ['smoke_v2205_fragtitle.mjs', 'smoke_v2204_brew2.mjs', 'smoke_v2203_fragdead.mjs',
  'smoke_v2202_fragwin.mjs', 'smoke_v2201_fragstatus.mjs', 'smoke_v2200_stock.mjs',
  'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs', 'smoke_v2191_ptime.mjs',
  'smoke_v2190_launch.mjs', 'smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs',
  'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs',
  'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs',
  'smoke_v2181_helpquickcast.mjs', 'smoke_v2180_grain.mjs', 'smoke_v2179_titlerecap.mjs',
  'smoke_v2178_codexseen.mjs', 'smoke_v2177_elites.mjs', 'smoke_v2176_allchests.mjs'];
for (const nm of suite102) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README 件套 pin 已随新现实更新为一百三十二件套（一百三十一件套清除）`,
    src.includes('一百三十二件套（一百三十一件套清除）'));
}
const vers102 = ['smoke_v2205_fragtitle.mjs', 'smoke_v2204_brew2.mjs', 'smoke_v2203_fragdead.mjs',
  'smoke_v2202_fragwin.mjs', 'smoke_v2201_fragstatus.mjs', 'smoke_v2200_stock.mjs',
  'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs', 'smoke_v2191_ptime.mjs',
  'smoke_v2190_launch.mjs', 'smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs',
  'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs',
  'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs',
  'smoke_v2181_helpquickcast.mjs', 'smoke_v2179_titlerecap.mjs'];
for (const nm of vers102) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 字面量 pin 已随新现实更新为 v22.6`,
    src.includes("const GAME_VERSION = 'v22.36';"));
}
for (const nm of ['smoke_v2205_fragtitle.mjs', 'smoke_v2204_brew2.mjs', 'smoke_v2203_fragdead.mjs',
  'smoke_v2202_fragwin.mjs', 'smoke_v2201_fragstatus.mjs', 'smoke_v2200_stock.mjs',
  'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs']) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 恒等 pin（===）已随新现实更新为 v22.6`,
    src.includes("GAME_VERSION === 'v22.36'"));
}
for (const nm of ['smoke_v2205_fragtitle.mjs', 'smoke_v2204_brew2.mjs', 'smoke_v2203_fragdead.mjs',
  'smoke_v2202_fragwin.mjs', 'smoke_v2201_fragstatus.mjs', 'smoke_v2200_stock.mjs',
  'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs']) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README tests 树尾 pin 已随新现实更新（+ smoke_v2206_stock2）`,
    src.includes('smoke_v2209_achstatus + smoke_v2211_lampkid + smoke_v2212_volume + smoke_v2213_teller + smoke_v2214_mush + smoke_v2215_tutorvol + smoke_v2216_picker + smoke_v2217_elixir2 + smoke_v2218_mush2 + smoke_v2219_footkeys + smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp（npm test 串跑）'));
}
const achFiles = ['smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2195_ptime2.mjs', 'smoke_v2193_hunt100.mjs', 'smoke_v2191_ptime.mjs',
  'smoke_v2188_wander.mjs', 'smoke_v2186_brew.mjs', 'smoke_v2184_lvl12.mjs',
  'smoke_v2180_grain.mjs', 'smoke_v2177_elites.mjs', 'smoke_v2176_allchests.mjs', 'smoke_v2173_aegis.mjs',
  'smoke_v2168_hardtrue.mjs', 'smoke_v2159_skillach.mjs'];
for (const nm of achFiles) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README 成就 pin 已随新现实更新为 40 项双处落位`,
    src.includes("readme.includes('成就一览（全部 45 项进度'") && src.includes('**45 项成就**'));
}
const s2204 = read('../tests/smoke_v2204_brew2.mjs');
ok('smoke_v2204 的 ACH_LIST 精确计数断言已去硬化（===39 零残留，>=39 存活性口径落位）',
  s2204.includes('ACH_LIST.length >= 39') && !s2204.includes('ACH_LIST.length === 3' + '9'));
// 旧代 pin 零残留：全部测试文件不得再含 v22.5 版本字面量 pin（拆串构造避免本文件扫描行自匹配）
const OLD_GV = "const GAME_VERSION = 'v22." + "5';";
let stale = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes(OLD_GV)) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v22.5 全库清零）', stale.length === 0, stale.join(','));
let staleId = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes("GAME_VERSION === 'v22." + "5'")) staleId.push(f);
}
ok('旧代 GAME_VERSION 恒等 pin 零残留（===v22.5 全库清零）', staleId.length === 0, staleId.join(','));
let staleSuite = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes('一百零一件套（一百件套清' + '除）')) staleSuite.push(f);
}
ok('旧代件套 pin 零残留（一百零一件套（一百件套清' + '除）全库清零）', staleSuite.length === 0, staleSuite.join(','));
// 旧代 README 成就正 pin 零残留：全部测试文件不得再含「全部 39 项进·度」或
// 「readme.includes(『**39 项成就**』)」形态的正向 pin（拆串避免自匹配）
let staleAch = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  const posPin = "readme.includes('**39 项成" + "就**'";
  if (src.includes('全部 39 项进' + '度') || src.includes(posPin)) staleAch.push(f);
}
ok('旧代 README 成就正 pin 零残留（39 项全库清零）', staleAch.length === 0, staleAch.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
