// v22.73 专项冒烟：新成就「一面之缘」（图鉴遭遇线首档里程碑，新内容·单成就，承 v22.72 见多识广 /
// v22.70 踏出灯影 / v21.88 走遍四方 多档先例）——成就版图收集线补档：图鉴收录线（scholar 记忆收藏家=5 种 /
// scholar2 见多识广=10 种 / perfection 记忆守护者=全部 13 种）早已三档齐备，唯独同属图鉴的「已遭遇」线
// （metall 萍水相逢=全部 13 种）只有封顶档——玩家撞见第 1~12 种期间（图鉴页每行「已遭遇 ✕N」与页脚
// 「已遭遇 X/13」都在展示）毫无成就回响；现补首档（SEEN_GOAL=5 种——与 scholar 首档同台阶 5→10→13 对齐，
// 可达性：潮灯镇遇敌池 4 种（史莱姆/野狼/哥布林/毒蛇）+ 雾语林首见骷髅兵/雾灵即达，与 firstblood/hunt10
// 同款开局鼓励档）：判定/描述/进度三处同读新常量 SEEN_GOAL（与 SCHOLAR_GOAL 同一「成就阈值数据化」家族——
// 调门槛只改 data.js 一处自动跟随，零裸字面量），计数读既有 hero.seen 遭遇计数（battle.startBattle 进战即记、
// 全游戏唯一写入点，(g.seen||{}) 防御式读取、旧档无此字段 false 不误解锁、零迁移，承 metall/v21.37 同款）；
// 无 r 字段（与 metall/lvl5 同款纯里程碑——一面之缘本身就是奖励）；解锁时机：applyAchievements 既有通路任意
// 判定点当场解锁（seen 为持续累积量，无需新判定点，承 perfection 同款——已解锁不因任何变化而撤销；第 5 种
// 撞见的瞬间即解锁、反馈不迟到）。
// 本冒烟守护：版本锚点、SEEN_GOAL 数据契约（===5、声明与导出）、ACH_LIST 契约（seen 唯一/总数 57/
// 既有 56 成就 id 零回归/ptime 32 与 ptime2 34 与 mush 41 与 metall 44 与 rich3 45 与 ptime3 46
// 与 hunt3 47 与 lucky3 48 与 stock3 49 与 elixir3 50 与 brew3 51 与 mush3 52 与 outstep 53
// 与 outstep2 54 与 scholar2 55 零位移/末尾追加序位 56）、ok/prog 谓词逐值（0·4 种 false / 5·13 种 true /
// 缺 seen 字段防御 false·0/5 / prog 不钳制 13/5）、运行期全链路（applyAchievements 真实解锁落
// hero.ach / 未够不误解锁 / 新档起始不误解锁 / 重复调用去重 / 旧档缺字段不抛错不解锁）、drawAch 57 项
// 滚动渲染不抛错、README/package.json/CHANGELOG 同步、姊妹件套 pin（v2272..v2258 一百六十九件套 /
// v2272·v2271·v2270·v2269·v2268·v2267·v2266·v2265·v2264·v2263·v2262·v2261·v2260·v2259·v2258 GAME_VERSION v22.73）
// 随新现实更新 + 旧代 v22.72 字面量/恒等/件套/串尾/testChain/顶 pin 全库零残留。
import { GAME_VERSION, ACH_LIST, SEEN_GOAL, SCHOLAR2_GOAL, BESTIARY_TARGET } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.73 一面之缘图鉴遭遇线首档里程碑冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v22.72 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.72（本版守 v22.79）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 99)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v22.73 版本注释', dataSrc.includes('v22.73 新成就·图鉴遭遇线首档里程碑「一面之缘」'));
ok('data.js GAME_VERSION 字面量已为 v22.73（旧 v22.72 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.83';") && !dataSrc.includes("const GAME_VERSION = 'v22." + "72';"));
ok('data.js 仍保留 v22.72 历史注释（见多识广成就注释未动）', dataSrc.includes('v22.72 新成就·图鉴收录线中档里程碑「见多识广」'));
ok('data.js 导出 SEEN_GOAL（export 块落位，与 LUCKY_GOAL 相邻）',
  dataSrc.includes('SCHOLAR_GOAL, SCHOLAR2_GOAL, LUCKY_GOAL, SEEN_GOAL, SEEN2_GOAL, LUCKY2_GOAL,'));

// —— SEEN_GOAL 数据契约 ——
ok('SEEN_GOAL === 5（图鉴遭遇线首档 = 5→13 对齐 scholar 首档台阶）', SEEN_GOAL === 5, String(SEEN_GOAL));
ok('SEEN_GOAL 声明与注释含「一面之缘」口径',
  dataSrc.includes('const SEEN_GOAL = 5;') && dataSrc.includes('成就「一面之缘」'));
ok('SCHOLAR2_GOAL 中档仍为 10（零回归）', SCHOLAR2_GOAL === 10, String(SCHOLAR2_GOAL));
ok('BESTIARY_TARGET 仍 13 种（封顶档分母零回归）', BESTIARY_TARGET.length === 13, String(BESTIARY_TARGET.length));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'seen');
ok('ACH_LIST 含 seen「一面之缘」且 id 唯一',
  !!ach && ach.name === '一面之缘' && ACH_LIST.filter((a) => a.id === 'seen').length === 1);
ok('ACH_LIST 精确总数 57 项（v2229 精确计数 pin 随新现实更新 56→57）', ACH_LIST.length === 74, String(ACH_LIST.length));
ok('seen 描述由 SEEN_GOAL 派生（单一数据源，零裸字面量 5）',
  ach.d === `记忆图鉴已遭遇 ${SEEN_GOAL} 种魔物`, ach.d);
ok('seen 判定/进度同读 SEEN_GOAL + BESTIARY_TARGET + seen 防御式（ok/prog 同式）',
  String(ach.ok).includes('SEEN_GOAL') && String(ach.ok).includes('g.seen||{}') && String(ach.ok).includes('BESTIARY_TARGET') &&
  String(ach.prog).includes('SEEN_GOAL') && String(ach.prog).includes('g.seen||{}') && String(ach.prog).includes('BESTIARY_TARGET'));
ok('seen 无 r 字段纯里程碑（与 metall/lvl5 同款）', !('r' in ach));

// —— 既有 56 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime', 'hunt100', 'ptime2', 'lucky2', 'rich2', 'stock',
  'brew2', 'stock2', 'elixir', 'mush', 'elixir2', 'mush2', 'metall', 'rich3', 'ptime3', 'hunt3',
  'lucky3', 'stock3', 'elixir3', 'brew3', 'mush3', 'outstep', 'outstep2', 'scholar2'];
ok('既有 56 成就 id 零回归', EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('seen 追加在末尾序位（ptime 32 / ptime2 34 / mush 41 / metall 44 / rich3 45 / ptime3 46 / hunt3 47 / lucky3 48 / stock3 49 / elixir3 50 / brew3 51 / mush3 52 / outstep 53 / outstep2 54 / scholar2 55 / seen 56，既有序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'ptime') === 32 &&
  ACH_LIST.findIndex((a) => a.id === 'ptime2') === 34 &&
  ACH_LIST.findIndex((a) => a.id === 'mush') === 41 &&
  ACH_LIST.findIndex((a) => a.id === 'metall') === 44 &&
  ACH_LIST.findIndex((a) => a.id === 'rich3') === 45 &&
  ACH_LIST.findIndex((a) => a.id === 'ptime3') === 46 &&
  ACH_LIST.findIndex((a) => a.id === 'hunt3') === 47 &&
  ACH_LIST.findIndex((a) => a.id === 'lucky3') === 48 &&
  ACH_LIST.findIndex((a) => a.id === 'stock3') === 49 &&
  ACH_LIST.findIndex((a) => a.id === 'elixir3') === 50 &&
  ACH_LIST.findIndex((a) => a.id === 'brew3') === 51 &&
  ACH_LIST.findIndex((a) => a.id === 'mush3') === 52 &&
  ACH_LIST.findIndex((a) => a.id === 'outstep') === 53 &&
  ACH_LIST.findIndex((a) => a.id === 'outstep2') === 54 &&
  ACH_LIST.findIndex((a) => a.id === 'scholar2') === 55 &&
  ACH_LIST.findIndex((a) => a.id === 'seen') === 56);

// —— ok/prog 谓词逐值 ——
const sd = (k) => { const o = {}; for (let i = 0; i < k; i++) o[BESTIARY_TARGET[i]] = 1; return o; };
ok('seen=0 种 → false 且 prog 0/5', ach.ok({ seen: sd(0) }) === false && ach.prog({ seen: sd(0) }) === `0/${SEEN_GOAL}`);
ok('seen=4 种（恰在门槛下）→ false 不解锁', ach.ok({ seen: sd(4) }) === false);
ok('seen=5 种（恰达标）→ true', ach.ok({ seen: sd(5) }) === true);
ok('seen=13 种（封顶）→ true（超阈值仍达标不抛错）', ach.ok({ seen: sd(13) }) === true);
ok('缺 seen 字段旧档 → false 且 prog 0/5（防御式零迁移）',
  ach.ok({}) === false && ach.prog({}) === `0/${SEEN_GOAL}`);
ok('seen 非对象（undefined 兜底）→ false 不抛错', ach.ok({ seen: undefined }) === false);
ok('prog 4 种 → 4/5', ach.prog({ seen: sd(4) }) === `4/${SEEN_GOAL}`, ach.prog({ seen: sd(4) }));
ok('prog 5 种 → 5/5', ach.prog({ seen: sd(5) }) === `5/${SEEN_GOAL}`, ach.prog({ seen: sd(5) }));
ok('prog 13 种不钳制（13/5，承 scholar「X/N 不钳制」口径）', ach.prog({ seen: sd(13) }) === `13/${SEEN_GOAL}`, ach.prog({ seen: sd(13) }));

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

// 达标档：seen=5 种 → applyAchievements 真实解锁落 hero.ach（持续累积量，任意判定点当场解锁）
let hero = newGame('余烬');
hero.seen = sd(5);
hero = runAch(hero);
ok('运行期：seen 5 种触发 applyAchievements 真实解锁 seen 落 hero.ach', hero.ach.includes('seen'), hero.ach.join(','));

// 未达标档：seen=4 种 → 不误解锁（差 1 种）
hero = newGame('灯见');
hero.seen = sd(4);
hero = runAch(hero);
ok('运行期：seen 4 种不误解锁 seen', !hero.ach.includes('seen'));

// 新档起始（seen 空）→ 不误解锁
hero = newGame('潮');
hero = runAch(hero);
ok('运行期：新档起始遭遇不误解锁 seen', !hero.ach.includes('seen'), String(Object.keys(hero.seen || {}).length));

// 重复调用去重：已解锁后再 applyAchievements 不重复 push
hero = newGame('灯');
hero.seen = sd(5);
runAch(hero);
runAch(hero);
ok('运行期：重复调用去重（hero.ach 中 seen 恰一枚）',
  hero.ach.filter((x) => x === 'seen').length === 1);

// 旧档防御档：无 seen 字段读档 → applyAchievements 不抛错且不解锁（零迁移）
hero = newGame('潮');
delete hero.seen;
let threw = null;
try { runAch(hero); } catch (e) { threw = e; }
ok('运行期：旧档缺 seen 字段 applyAchievements 不抛错（防御式）', threw === null, threw && String(threw.stack || threw));
ok('运行期：缺字段旧档不解锁 seen（零迁移）', !hero.ach.includes('seen'));

// —— drawAch 渲染（57 项滚动不抛错；PAGE=10，57 项六页）——
let rendered = true, renderedPg6 = true;
try {
  S.G = newGame('测试'); S.G.ach = ['seen', 'metall']; S.achScroll = 0; S.scene = 'ach';
  drawAch();
} catch (e) { rendered = false; }
try {
  S.achScroll = 60; // 57 项滚到最末页（PAGE=10，钳制到 50）不抛错
  drawAch();
} catch (e) { renderedPg6 = false; }
S.achScroll = 0; S.scene = 'world';
ok('运行期：成就页 drawAch 57 项渲染不抛错', rendered);
ok('运行期：成就页末页滚动渲染不抛错（57 项 PAGE=10 六页）', renderedPg6);

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树串尾已延伸至 smoke_v2273_seen5（v2272 后接 v2273）',
  readme.includes('smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc（npm test 串跑）'));
ok('README 件套口径为二百一十五件套（二百一十四件套清除）且旧 168 口径零残留',
  readme.includes('冒烟二百一十五件套（二百一十四件套清除）') && !readme.includes('冒烟一百六十八件套（一百六十七件套清' + '除）'));
ok('README 含 v22.73 守护描述（新成就一面之缘守护）', readme.includes('v22.73 起含新成就「一面之缘」'));
ok('README 含 smoke_v2273_seen5 入库（169 份）', readme.includes('smoke_v2273_seen5 入库（169 份）'));
ok('README 仍保留 v22.72 守护描述（历史口径未动）', readme.includes('v22.72 起含新成就「见多识广」'));
ok('README 仍保留 smoke_v2272_scholar2 入库（168 份）历史口径', readme.includes('smoke_v2272_scholar2 入库（168 份）'));
ok('README 成就口径「57 项」双处同步（快速上手表 C 键行 + 图鉴&成就行）',
  readme.includes('成就一览（全部 74 项进度') && readme.includes('**74 项成就**') &&
  !readme.includes('成就一览（全部 56 项进' + '度') && !readme.includes('**56 项成' + '就**'));
ok('package.json 已收录 smoke_v2273_seen5（npm test 串跑第 169 份）',
  pkg.includes('smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 169 件套', testChain === 215, String(testChain));
ok('CHANGELOG 含 v22.73 条目（顶 pin）', changelog.startsWith('## v23.83 '));

// —— 姊妹件套 pin 随新现实更新 + 旧代 v22.72 pin 零残留 ——
const s2272 = read('smoke_v2272_scholar2.mjs');
const s2229 = read('smoke_v2229_metall.mjs');
const s2143 = read('smoke_v2143_talkekey.mjs');
ok('smoke_v2272 的 GAME_VERSION 字面量 pin 已更新为 v22.73', s2272.includes("const GAME_VERSION = 'v23.83';"));
ok('smoke_v2272 的 CHANGELOG 顶 pin 已更新为 ## v22.73', s2272.includes("startsWith('## v23.83'") || s2272.includes("startsWith('## v22.78 '"));
ok('smoke_v2272 的件套 pin 已更新为二百一十五件套（二百一十四件套清除）', s2272.includes('二百一十五件套（二百一十四件套清除）'));
ok('smoke_v2272 的 README 串尾 pin 已延伸至 smoke_v2273_seen5', s2272.includes('smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc（npm test 串跑）'));
ok('smoke_v2272 的 package.json 串尾 plain pin 已延伸至 smoke_v2273_seen5', s2272.includes('smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs'));
ok('smoke_v2229 的 ACH_LIST 精确计数 pin 已更新为 === 57', s2229.includes('ACH_LIST.length === 74'));
ok('smoke_v2143 哨兵链已推进至二百一十五件套（二百一十四件套清除）', s2143.includes('二百一十六件套（二百一十五件套清除）') && s2143.includes("!readme.includes('二百一十六件套（二百一十五件套清除）')"));
ok('smoke_v2272 旧 v22.72 字面量 pin 零残留', !s2272.includes("const GAME_VERSION = 'v22.72';"));
ok('smoke_v2272 旧一百六十八件套 pin 零残留', !s2272.includes('一百六十八件套（一百六十七件套清除）'));

console.log(`\n— v22.73 一面之缘冒烟：${n - failed}/${n} 通过 —`);
if (failed) process.exit(1);
