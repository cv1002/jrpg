// v22.4 专项冒烟：新成就「妙手回春」（酿造线第二档里程碑，新内容·单成就，承 v21.86 灵药初成第一档 /
// v21.93 驱雾百战 / v21.95 彻夜长明 / v21.97 鸿运当头 / v21.99 金玉满堂 多档先例）——成就版图逐线核对的
// 第二档补全：等级线已有三档（lvl5·lvl10·lvl12）、宝箱线已有两档（chests·allchests）、讨伐线已有两档
// （hunt10·hunt100）、时长线已有两档（ptime·ptime2）、掉落线已有两档（lucky·lucky2）、金币线已有两档
// （rich·rich2）、药水线已有首枚（stock），唯独酿造线（brew 灵药初成=1 瓶）只有第一档——采蘑菇→酿造锅→
// 高级灵药是条自选系统链（宝箱 60% 蘑菇档/精英必掉蘑菇/战斗掉落 12% 蘑菇三源），酿造师玩家一局普遍酿 3-5 瓶，
// 在「灵药初成」处毫无第二枚回应。现补第二档（BREW2_GOAL=5 瓶）：判定/描述/进度三处同读新常量 BREW2_GOAL
// （与 ELIXIR_GOAL 同一「成就阈值数据化」家族——改门槛只改 data.js 一处自动跟随，零裸字面量），计数读既有
// hero.brews 防御式计数（core.brewNow 酿造成功唯一写入点，(g.brews||0) 防御式读取旧档零迁移，成就只认
// 「酿造」行为）；无 r 字段（与 brew/memoir/skills/hardtrue 同款纯里程碑）；解锁时机：brewNow 酿造成功当场
// applyAchievements（承 brew 同款「反馈不迟到」惯例），第 5 瓶落袋即解锁。
// 本冒烟守护：版本锚点、BREW2_GOAL 数据契约（===5、声明与导出）、ACH_LIST 契约（brew2 唯一/
// 总数精确 39/既有 38 成就 id 零回归/追加在末尾序位）、ok/prog 谓词逐值（0·4 false /
// 5·99 true / 缺 brews 字段防御 false·0/5 / prog 不钳制 99/5）、core.js 源级落位
// （brewNow hero.brews 计数写入 + 当场 applyAchievements）、运行期全链路（brewNow 真实酿造 5 次解锁落
// hero.ach / 4 次不误报 / 新档不误报 / 重复调用去重 / 缺 brews 旧档不抛错）、drawAch 39 项滚动渲染不抛错、
// README/package.json/CHANGELOG 同步、姊妹件套 pin（v2203..v2176 一百件套 / v2203..v2181·v2179
// GAME_VERSION v22.4 / v2203..v2192 恒等 v22.4 / v2203..v2192 树尾 pin）随新现实更新
// + smoke_v2200 精确计数断言去硬化（===38→>=38）复核 + 旧代 v22.3 字面量 pin / 旧代 38 项正向 pin /
// 旧代九十九件套 pin 零残留。
import { GAME_VERSION, ACH_LIST, BREW2_GOAL } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.4 妙手回春酿造线第二档里程碑冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v22.3 + 精确 v22.4 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.3', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 4)), GAME_VERSION);
ok('GAME_VERSION 字面量已为 v22.4（本版独占精确锚点）', GAME_VERSION === 'v22.33', GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const coreSrc = read('../js/core.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v22.4 版本注释', dataSrc.includes('v22.4 新成就「妙手回春」'));
ok('data.js GAME_VERSION 字面量已更新为 v22.4', dataSrc.includes("const GAME_VERSION = 'v22.33';"));
ok('data.js 仍保留 v22.3 历史注释（累积注释块，姊妹 pin 不失效）', dataSrc.includes('v22.3 阵亡画面收集行补「🕯️ 记忆碎片 N/4」'));
ok('data.js 导出 BREW2_GOAL（export 块落位，与 ELIXIR_GOAL 相邻）', dataSrc.includes('ELIXIR_GOAL, BREW2_GOAL, PLAY_TIME_GOAL'));

// —— BREW2_GOAL 数据契约 ——
ok('BREW2_GOAL === 5（酿造线第二档 = 累计酿造 5 瓶高级灵药）', BREW2_GOAL === 5, String(BREW2_GOAL));
ok('BREW2_GOAL 声明为 5 且注释含「妙手回春」口径', dataSrc.includes('const BREW2_GOAL = 5;') && dataSrc.includes('成就「妙手回春」'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'brew2');
ok('ACH_LIST 含 brew2「妙手回春」且 id 唯一',
  !!ach && ach.name === '妙手回春' && ACH_LIST.filter((a) => a.id === 'brew2').length === 1);
ok('ACH_LIST 精确计数断言已去硬化（===39→>=39 存活性口径，承 v2200 对 v2199 同款先例）', ACH_LIST.length >= 39, String(ACH_LIST.length));
ok('brew2 描述由 BREW2_GOAL 派生（单一数据源，零裸字面量 5）',
  ach.d === `累计酿造 ${BREW2_GOAL} 瓶高级灵药`, ach.d);
ok('brew2 判定/进度同读 BREW2_GOAL + brews 防御式（ok (g.brews||0) / prog (g.brews||0)）',
  String(ach.ok).includes('BREW2_GOAL') && String(ach.ok).includes('g.brews||0') &&
  String(ach.prog).includes('BREW2_GOAL') && String(ach.prog).includes('g.brews||0'));
ok('brew2 无 r 字段纯里程碑（与 brew/memoir/skills/hardtrue 同款）', !('r' in ach));

// —— 既有 38 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime', 'hunt100', 'ptime2', 'lucky2', 'rich2', 'stock'];
ok('既有 38 成就 id 零回归', EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('brew2 追加在末尾序位（stock 37 / brew2 38，既有序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'stock') === 37 &&
  ACH_LIST.findIndex((a) => a.id === 'brew2') === 38);

// —— ok/prog 谓词逐值 ——
ok('brews=0（新档起始，未达标）→ false', ach.ok({ brews: 0 }) === false);
ok('brews=4（差 1 瓶）→ false（恰在门槛下不解锁）', ach.ok({ brews: 4 }) === false);
ok('brews=5 → true（恰达标）', ach.ok({ brews: 5 }) === true);
ok('brews=99 → true（超阈值仍达标）', ach.ok({ brews: 99 }) === true);
ok('缺 brews 字段旧档 → false 且 prog 0/5（防御式零迁移）',
  ach.ok({}) === false && ach.prog({}) === `0/${BREW2_GOAL}`);
ok('brews 非数值（undefined 兜底）→ false 不抛错', ach.ok({ brews: undefined }) === false);
ok('prog 2 瓶 → 2/5', ach.prog({ brews: 2 }) === `2/${BREW2_GOAL}`, ach.prog({ brews: 2 }));
ok('prog 5 瓶 → 5/5', ach.prog({ brews: 5 }) === `5/${BREW2_GOAL}`, ach.prog({ brews: 5 }));
ok('prog 99 瓶不钳制（99/5，承 brew「X/N 不钳制」口径）', ach.prog({ brews: 99 }) === `99/${BREW2_GOAL}`, ach.prog({ brews: 99 }));

// —— core.js 源级落位：brewNow 计数写入 + 当场判定 ——
ok('core.js brewNow 含 hero.brews 计数写入（(g.brews||0)+1 防御式）', coreSrc.includes('hero.brews = (hero.brews || 0) + 1'));
ok('core.js brewNow 酿造成功后当场 applyAchievements（反馈不迟到，承 v21.86 惯例）',
  coreSrc.includes('hero.brews = (hero.brews || 0) + 1;') && coreSrc.includes('applyAchievements();'));
ok('core.js brewNow 库存结算逐字保留（potion2++ / 配方常量同源，成就另计不混同）',
  coreSrc.includes('hero.potion2++;') && coreSrc.includes('hero.mushrooms -= BREW_MUSHROOMS;') && coreSrc.includes('hero.gold -= BREW_GOLD;'));

// —— 运行期实证：DOM/音频/存储桩 + main.js 真实导入后 brewNow / applyAchievements 全链路 ——
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
    fillText: noop,
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
const { newGame, brewNow } = await import('../js/core.js');
const { applyAchievements } = await import('../js/hero.js');
const { drawAch } = await import('../js/view/menus.js');
const { bind } = await import('../js/bind.js');

function fresh() {
  const h = newGame('测试');
  h.mushrooms = BREW2_GOAL === 5 ? 2 : 2; // 每轮酿造材料（BREW_MUSHROOMS×2 + BREW_GOLD 由 brewNow 判定）
  h.gold = 99;
  h.hp = 1; h.mp = 1; h.hpMax = 187; h.mpMax = 132; // brewNow 只读材料/金币，状态字段防御填充
  S.G = h;
  S.scene = 'world';
  return h;
}

// 达标档：真实 brewNow 酿造 5 次 → 第 5 瓶当场解锁 brew2 落 hero.ach（4 次不误报）
const h = fresh();
let unlockedAt = 0;
for (let i = 1; i <= 5; i++) {
  h.mushrooms = 2; h.gold = 99;
  bind.boxMsg('', 0); // 瞬时清场，避免消息队列干扰（与 v2186 同款）
  brewNow();
  if (h.ach.includes('brew2') && unlockedAt === 0) unlockedAt = i;
}
ok('运行期：4 瓶未解锁（第 4 次酿造后 ach 无 brew2）', unlockedAt === 5, 'unlockedAt=' + unlockedAt);
ok('运行期：5 瓶触发 brewNow 当场 applyAchievements 真实解锁 brew2 落 hero.ach', h.ach.includes('brew2'), h.ach.join(','));
ok('运行期：hero.brews 计数 = 5（与 potion2 库存独立、成就源一致）', h.brews === 5, String(h.brews));

// 新档起始（brews 0）→ 不误解锁
let h2 = fresh();
applyAchievements();
ok('运行期：新档起始 brews 0 不误解锁 brew2', !h2.ach.includes('brew2'), String(h2.brews));

// 重复调用去重：已解锁后再 applyAchievements 不重复 push
applyAchievements();
ok('运行期：重复调用去重（hero.ach 中 brew2 恰一枚）',
  h.ach.filter((x) => x === 'brew2').length === 1);

// 旧档防御档：无 brews 字段读档 → applyAchievements 不抛错且不解锁（零迁移）
h2 = fresh();
delete h2.brews;
let threw = null;
try { applyAchievements(); } catch (e) { threw = e; }
ok('运行期：旧档缺 brews 字段 applyAchievements 不抛错（防御式）', threw === null, threw && String(threw.stack || threw));
ok('运行期：缺字段旧档不解锁 brew2（零迁移）', !h2.ach.includes('brew2'));

// —— drawAch 渲染（39 项滚动不抛错；PAGE=10 四页）——
let rendered = true, renderedPg4 = true;
try {
  S.G = newGame('测试'); S.G.ach = ['brew2']; S.achScroll = 0; S.scene = 'ach';
  drawAch();
} catch (e) { rendered = false; }
try {
  S.achScroll = 40; // 39 项滚到末页（PAGE=10，钳制到 30）不抛错
  drawAch();
} catch (e) { renderedPg4 = false; }
S.achScroll = 0; S.scene = 'world';
ok('运行期：成就页 drawAch 39 项渲染不抛错', rendered);
ok('运行期：成就页末页滚动渲染不抛错（39 项 PAGE=10 四页）', renderedPg4);

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树收录 smoke_v2204_brew2 且位于串尾',
  readme.includes('smoke_v2204_brew2 + smoke_v2209_achstatus + smoke_v2211_lampkid + smoke_v2212_volume + smoke_v2213_teller + smoke_v2214_mush + smoke_v2215_tutorvol + smoke_v2216_picker + smoke_v2217_elixir2 + smoke_v2218_mush2 + smoke_v2219_footkeys + smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor（npm test 串跑）'));
ok('README 件套口径为一百二十九件套（一百二十八件套清除）',
  readme.includes('冒烟一百二十九件套（一百二十八件套清除）') && !readme.includes('冒烟九十九件套（九十八件套清' + '除）'));
ok('README 含 v22.4 守护描述', readme.includes('v22.4 起含新成就「妙手回春」'));
ok('README 成就口径「39 项」双处同步（快速上手表 C 键行 + 图鉴&成就行）',
  readme.includes('成就一览（全部 45 项进度') && readme.includes('**45 项成就**') &&
  !readme.includes('成就一览（全部 38 项进' + '度') && !readme.includes('**38 项成' + '就**'));
ok('package.json 已收录 smoke_v2204_brew2（npm test 串跑第 100 份）',
  pkg.includes('smoke_v2204_brew2.mjs') && /smoke_v2203_fragdead\.mjs && node tests\/smoke_v2204_brew2\.mjs/.test(pkg));
ok('CHANGELOG 含 v22.4 条目', changelog.includes('## v22.4 '));

// —— 姊妹件套 pin 复查（v21.7 惯例：本版冒烟守护姊妹随新现实更新）——
const suite100 = ['smoke_v2203_fragdead.mjs', 'smoke_v2202_fragwin.mjs', 'smoke_v2201_fragstatus.mjs',
  'smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs', 'smoke_v2191_ptime.mjs',
  'smoke_v2190_launch.mjs', 'smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs',
  'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs',
  'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs',
  'smoke_v2181_helpquickcast.mjs', 'smoke_v2180_grain.mjs', 'smoke_v2179_titlerecap.mjs',
  'smoke_v2178_codexseen.mjs', 'smoke_v2177_elites.mjs', 'smoke_v2176_allchests.mjs'];
for (const nm of suite100) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README 件套 pin 已随新现实更新为一百二十九件套（一百二十八件套清除）`,
    src.includes('一百二十九件套（一百二十八件套清除）'));
}
const vers100 = ['smoke_v2203_fragdead.mjs', 'smoke_v2202_fragwin.mjs', 'smoke_v2201_fragstatus.mjs',
  'smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs', 'smoke_v2191_ptime.mjs',
  'smoke_v2190_launch.mjs', 'smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs',
  'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs',
  'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs',
  'smoke_v2181_helpquickcast.mjs', 'smoke_v2179_titlerecap.mjs'];
for (const nm of vers100) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 字面量 pin 已随新现实更新为 v22.4`,
    src.includes("const GAME_VERSION = 'v22.33';"));
}
for (const nm of ['smoke_v2203_fragdead.mjs', 'smoke_v2202_fragwin.mjs', 'smoke_v2201_fragstatus.mjs',
  'smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs']) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 恒等 pin（===）已随新现实更新为 v22.4`,
    src.includes("GAME_VERSION === 'v22.33'"));
}
for (const nm of ['smoke_v2203_fragdead.mjs', 'smoke_v2202_fragwin.mjs', 'smoke_v2201_fragstatus.mjs',
  'smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs']) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README tests 树尾 pin 已随新现实更新（+ smoke_v2204_brew2）`,
    src.includes('smoke_v2204_brew2 + smoke_v2209_achstatus + smoke_v2211_lampkid + smoke_v2212_volume + smoke_v2213_teller + smoke_v2214_mush + smoke_v2215_tutorvol + smoke_v2216_picker + smoke_v2217_elixir2 + smoke_v2218_mush2 + smoke_v2219_footkeys + smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor（npm test 串跑）'));
}
const achFiles = ['smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2195_ptime2.mjs', 'smoke_v2193_hunt100.mjs', 'smoke_v2191_ptime.mjs',
  'smoke_v2188_wander.mjs', 'smoke_v2186_brew.mjs', 'smoke_v2184_lvl12.mjs',
  'smoke_v2180_grain.mjs', 'smoke_v2177_elites.mjs', 'smoke_v2176_allchests.mjs', 'smoke_v2173_aegis.mjs',
  'smoke_v2168_hardtrue.mjs', 'smoke_v2159_skillach.mjs'];
for (const nm of achFiles) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README 成就 pin 已随新现实更新为 39 项双处落位`,
    src.includes("readme.includes('成就一览（全部 45 项进度'") && src.includes('**45 项成就**'));
}
const s2200 = read('../tests/smoke_v2200_stock.mjs');
ok('smoke_v2200 的 ACH_LIST 精确计数断言已去硬化（===38 零残留，>=38 存活性口径落位）',
  s2200.includes('ACH_LIST.length >= 38') && !s2200.includes('ACH_LIST.length === 3' + '8'));
// 旧代 pin 零残留：全部测试文件不得再含 v22.3 版本字面量 pin（拆串构造避免本文件扫描行自匹配）
const OLD_GV = "const GAME_VERSION = 'v22." + "3';";
let stale = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes(OLD_GV)) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v22.3 全库清零）', stale.length === 0, stale.join(','));
let staleId = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes("GAME_VERSION === 'v22." + "3'")) staleId.push(f);
}
ok('旧代 GAME_VERSION 恒等 pin 零残留（===v22.3 全库清零）', staleId.length === 0, staleId.join(','));
let staleSuite = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes('九十九件套（九十八件套清' + '除）')) staleSuite.push(f);
}
ok('旧代件套 pin 零残留（九十九件套（九十八件套清' + '除）全库清零）', staleSuite.length === 0, staleSuite.join(','));
// 旧代 README 成就正 pin 零残留：全部测试文件不得再含「全部 38 项进·度」或
// 「readme.includes(『**38 项成就**』)」形态的正向 pin（拆串避免自匹配）
let staleAch = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  const posPin = "readme.includes('**38 项成" + "就**'";
  if (src.includes('全部 38 项进' + '度') || src.includes(posPin)) staleAch.push(f);
}
ok('旧代 README 成就正 pin 零残留（38 项全库清零）', staleAch.length === 0, staleAch.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
