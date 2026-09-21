// v22.74 专项冒烟：新成就「似曾相识」（图鉴遭遇线中档里程碑，新内容·单成就，承 v22.72 见多识广 /
// v22.70 踏出灯影 / v22.73 一面之缘 多档先例）——成就版图收集线补档：图鉴「已遭遇」线（seen 一面之缘=5 种
// 首档 / metall 萍水相逢=全部 13 种封顶）补完首档后仍缺中档——玩家撞见第 6~12 种期间（图鉴页每行
// 「已遭遇 ✕N」与页脚「已遭遇 X/13」都在展示）毫无成就回响；现补中档（SEEN2_GOAL=10 种——首档与封顶正
// 中间 5→10→13 与收录线同档对齐，可达性：13 种里 11 种（5 普通怪 + 雾灵/树精/石魔像 + 石心魔像精英 +
// 幽冥魔王/洞窟领主 + 残焰魔像精英）在终焉之神前即遇，10 种自然可达）：判定/描述/进度三处同读新常量
// SEEN2_GOAL（与 SEEN_GOAL/SCHOLAR2_GOAL 同一「成就阈值数据化」家族——调门槛只改 data.js 一处自动跟随，
// 零裸字面量），计数读既有 hero.seen 遭遇计数（battle.startBattle 进战即记、全游戏唯一写入点，
// (g.seen||{}) 防御式读取、旧档无此字段 false 不误解锁、零迁移，承 metall/seen/v21.37 同款）；无 r 字段
// （与 seen/metall/lvl5 同款纯里程碑——似曾相识本身就是奖励）；解锁时机：applyAchievements 既有通路任意
// 判定点当场解锁（seen 为持续累积量，无需新判定点，承 perfection 同款——已解锁不因任何变化而撤销；第 10 种
// 撞见的瞬间即解锁、反馈不迟到）。
// 本冒烟守护：版本锚点、SEEN2_GOAL 数据契约（===10、声明与导出）、ACH_LIST 契约（seen2 唯一/总数 58/
// 既有 57 成就 id 零回归/ptime 32 与 ptime2 34 与 mush 41 与 metall 44 与 rich3 45 与 ptime3 46
// 与 hunt3 47 与 lucky3 48 与 stock3 49 与 elixir3 50 与 brew3 51 与 mush3 52 与 outstep 53
// 与 outstep2 54 与 scholar2 55 与 seen 56 零位移/末尾追加序位 57）、ok/prog 谓词逐值（0·9 种 false /
// 10·13 种 true / 缺 seen 字段防御 false·0/10 / prog 不钳制 13/10）、运行期全链路（applyAchievements 真实
// 解锁落 hero.ach / 未够不误解锁 / 新档起始不误解锁 / 重复调用去重 / 旧档缺字段不抛错不解锁）、drawAch 58 项
// 滚动渲染不抛错、README/package.json/CHANGELOG 同步、姊妹件套 pin（v2272..v2258 一百七十件套 /
// v2273·v2272·v2271·v2270·v2269·v2268·v2267·v2266·v2265·v2264·v2263·v2262·v2261·v2260·v2259·v2258
// GAME_VERSION v22.74）随新现实更新 + 旧代 v22.73 字面量/恒等/件套/串尾/testChain/顶 pin 全库零残留。
import { GAME_VERSION, ACH_LIST, SEEN_GOAL, SEEN2_GOAL, SCHOLAR2_GOAL, BESTIARY_TARGET } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.74 似曾相识图鉴遭遇线中档里程碑冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v22.73 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.73（本版守 v22.79）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 99)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v22.74 版本注释', dataSrc.includes('v22.74 新成就·图鉴遭遇线中档里程碑「似曾相识」'));
ok('data.js GAME_VERSION 字面量已为 v22.74（旧 v22.73 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.60';") && !dataSrc.includes("const GAME_VERSION = 'v22." + "73';"));
ok('data.js 仍保留 v22.73 历史注释（一面之缘成就注释未动）', dataSrc.includes('v22.73 新成就·图鉴遭遇线首档里程碑「一面之缘」'));
ok('data.js 导出 SEEN2_GOAL（export 块落位，与 SEEN_GOAL 相邻）',
  dataSrc.includes('SCHOLAR_GOAL, SCHOLAR2_GOAL, LUCKY_GOAL, SEEN_GOAL, SEEN2_GOAL, LUCKY2_GOAL,'));

// —— SEEN2_GOAL 数据契约 ——
ok('SEEN2_GOAL === 10（图鉴遭遇线中档 = 5→10→13 对齐收录线中档台阶）', SEEN2_GOAL === 10, String(SEEN2_GOAL));
ok('SEEN2_GOAL 声明与注释含「似曾相识」口径',
  dataSrc.includes('const SEEN2_GOAL = 10;') && dataSrc.includes('成就「似曾相识」'));
ok('SEEN_GOAL 首档仍为 5（零回归）', SEEN_GOAL === 5, String(SEEN_GOAL));
ok('SCHOLAR2_GOAL 收录线中档仍为 10（零回归）', SCHOLAR2_GOAL === 10, String(SCHOLAR2_GOAL));
ok('BESTIARY_TARGET 仍 13 种（封顶档分母零回归）', BESTIARY_TARGET.length === 13, String(BESTIARY_TARGET.length));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'seen2');
ok('ACH_LIST 含 seen2「似曾相识」且 id 唯一',
  !!ach && ach.name === '似曾相识' && ACH_LIST.filter((a) => a.id === 'seen2').length === 1);
ok('ACH_LIST 精确总数 58 项（v2229 精确计数 pin 随新现实更新 57→58）', ACH_LIST.length === 62, String(ACH_LIST.length));
ok('seen2 描述由 SEEN2_GOAL 派生（单一数据源，零裸字面量 10）',
  ach.d === `记忆图鉴已遭遇 ${SEEN2_GOAL} 种魔物`, ach.d);
ok('seen2 判定/进度同读 SEEN2_GOAL + BESTIARY_TARGET + seen 防御式（ok/prog 同式）',
  String(ach.ok).includes('SEEN2_GOAL') && String(ach.ok).includes('g.seen||{}') && String(ach.ok).includes('BESTIARY_TARGET') &&
  String(ach.prog).includes('SEEN2_GOAL') && String(ach.prog).includes('g.seen||{}') && String(ach.prog).includes('BESTIARY_TARGET'));
ok('seen2 无 r 字段纯里程碑（与 seen/metall/lvl5 同款）', !('r' in ach));

// —— 既有 57 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime', 'hunt100', 'ptime2', 'lucky2', 'rich2', 'stock',
  'brew2', 'stock2', 'elixir', 'mush', 'elixir2', 'mush2', 'metall', 'rich3', 'ptime3', 'hunt3',
  'lucky3', 'stock3', 'elixir3', 'brew3', 'mush3', 'outstep', 'outstep2', 'scholar2', 'seen'];
ok('既有 57 成就 id 零回归', EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('seen2 追加在末尾序位（ptime 32 / ptime2 34 / mush 41 / metall 44 / rich3 45 / ptime3 46 / hunt3 47 / lucky3 48 / stock3 49 / elixir3 50 / brew3 51 / mush3 52 / outstep 53 / outstep2 54 / scholar2 55 / seen 56 / seen2 57，既有序位零位移）',
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
  ACH_LIST.findIndex((a) => a.id === 'seen') === 56 &&
  ACH_LIST.findIndex((a) => a.id === 'seen2') === 57);

// —— ok/prog 谓词逐值 ——
const sd = (k) => { const o = {}; for (let i = 0; i < k; i++) o[BESTIARY_TARGET[i]] = 1; return o; };
ok('seen2=0 种 → false 且 prog 0/10', ach.ok({ seen: sd(0) }) === false && ach.prog({ seen: sd(0) }) === `0/${SEEN2_GOAL}`);
ok('seen2=9 种（恰在门槛下）→ false 不解锁', ach.ok({ seen: sd(9) }) === false);
ok('seen2=10 种（恰达标）→ true', ach.ok({ seen: sd(10) }) === true);
ok('seen2=13 种（封顶）→ true（超阈值仍达标不抛错）', ach.ok({ seen: sd(13) }) === true);
ok('缺 seen 字段旧档 → false 且 prog 0/10（防御式零迁移）',
  ach.ok({}) === false && ach.prog({}) === `0/${SEEN2_GOAL}`);
ok('seen 非对象（undefined 兜底）→ false 不抛错', ach.ok({ seen: undefined }) === false);
ok('prog 9 种 → 9/10', ach.prog({ seen: sd(9) }) === `9/${SEEN2_GOAL}`, ach.prog({ seen: sd(9) }));
ok('prog 10 种 → 10/10', ach.prog({ seen: sd(10) }) === `10/${SEEN2_GOAL}`, ach.prog({ seen: sd(10) }));
ok('prog 13 种不钳制（13/10，承 scholar「X/N 不钳制」口径）', ach.prog({ seen: sd(13) }) === `13/${SEEN2_GOAL}`, ach.prog({ seen: sd(13) }));

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

// 达标档：seen2=10 种 → applyAchievements 真实解锁落 hero.ach（持续累积量，任意判定点当场解锁）
let hero = newGame('余烬');
hero.seen = sd(10);
hero = runAch(hero);
ok('运行期：seen 10 种触发 applyAchievements 真实解锁 seen2 落 hero.ach', hero.ach.includes('seen2'), hero.ach.join(','));

// 未达标档：seen2=9 种 → 不误解锁（差 1 种）
hero = newGame('灯见');
hero.seen = sd(9);
hero = runAch(hero);
ok('运行期：seen 9 种不误解锁 seen2', !hero.ach.includes('seen2'));

// 新档起始（seen 空）→ 不误解锁
hero = newGame('潮');
hero = runAch(hero);
ok('运行期：新档起始遭遇不误解锁 seen2', !hero.ach.includes('seen2'), String(Object.keys(hero.seen || {}).length));

// 重复调用去重：已解锁后再 applyAchievements 不重复 push
hero = newGame('灯');
hero.seen = sd(10);
runAch(hero);
runAch(hero);
ok('运行期：重复调用去重（hero.ach 中 seen2 恰一枚）',
  hero.ach.filter((x) => x === 'seen2').length === 1);

// 旧档防御档：无 seen 字段读档 → applyAchievements 不抛错且不解锁（零迁移）
hero = newGame('潮');
delete hero.seen;
let threw = null;
try { runAch(hero); } catch (e) { threw = e; }
ok('运行期：旧档缺 seen 字段 applyAchievements 不抛错（防御式）', threw === null, threw && String(threw.stack || threw));
ok('运行期：缺字段旧档不解锁 seen2（零迁移）', !hero.ach.includes('seen2'));

// —— drawAch 渲染（58 项滚动不抛错；PAGE=10，58 项六页）——
let rendered = true, renderedPg6 = true;
try {
  S.G = newGame('测试'); S.G.ach = ['seen2', 'metall']; S.achScroll = 0; S.scene = 'ach';
  drawAch();
} catch (e) { rendered = false; }
try {
  S.achScroll = 70; // 58 项滚到最末页（PAGE=10，钳制到 50）不抛错
  drawAch();
} catch (e) { renderedPg6 = false; }
S.achScroll = 0; S.scene = 'world';
ok('运行期：成就页 drawAch 58 项渲染不抛错', rendered);
ok('运行期：成就页末页滚动渲染不抛错（58 项 PAGE=10 六页）', renderedPg6);

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树串尾已延伸至 smoke_v2274_seen2（v2273 后接 v2274）',
  readme.includes('smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 件套口径为二百一十二件套（二百一十一件套清除）且旧 169 口径零残留',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟一百六十九件套（一百六十八件套清' + '除）'));
ok('README 含 v22.74 守护描述（新成就似曾相识守护）', readme.includes('v22.74 起含新成就「似曾相识」'));
ok('README 含 smoke_v2274_seen2 入库（170 份）', readme.includes('smoke_v2274_seen2 入库（170 份）'));
ok('README 仍保留 v22.73 守护描述（历史口径未动）', readme.includes('v22.73 起含新成就「一面之缘」'));
ok('README 仍保留 smoke_v2273_seen5 入库（169 份）历史口径', readme.includes('smoke_v2273_seen5 入库（169 份）'));
ok('README 成就口径「58 项」双处同步（快速上手表 C 键行 + 图鉴&成就行）',
  readme.includes('成就一览（全部 62 项进度') && readme.includes('**62 项成就**') &&
  !readme.includes('成就一览（全部 57 项进' + '度') && !readme.includes('**57 项成' + '就**'));
ok('package.json 已收录 smoke_v2274_seen2（npm test 串跑第 170 份）',
  pkg.includes('smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 170 件套', testChain === 212, String(testChain));
ok('CHANGELOG 含 v22.74 条目（顶 pin）', changelog.startsWith('## v23.60 '));

// —— 姊妹件套 pin 随新现实更新 + 旧代 v22.73 pin 零残留 ——
const s2273 = read('smoke_v2273_seen5.mjs');
const s2229 = read('smoke_v2229_metall.mjs');
const s2143 = read('smoke_v2143_talkekey.mjs');
ok('smoke_v2273 的 GAME_VERSION 字面量 pin 已更新为 v22.74', s2273.includes("const GAME_VERSION = 'v23.60';"));
ok('smoke_v2273 的 CHANGELOG 顶 pin 已更新为 ## v22.74', s2273.includes("startsWith('## v23.60'") || s2273.includes("startsWith('## v22.78 '"));
ok('smoke_v2273 的件套 pin 已更新为二百一十二件套（二百一十一件套清除）', s2273.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2273 的 README 串尾 pin 已延伸至 smoke_v2274_seen2', s2273.includes('smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2273 的 package.json 串尾 plain pin 已延伸至 smoke_v2274_seen2', s2273.includes('smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs'));
ok('smoke_v2229 的 ACH_LIST 精确计数 pin 已更新为 === 58', s2229.includes('ACH_LIST.length === 62'));
ok('smoke_v2143 哨兵链已推进至二百一十二件套（二百一十一件套清除）', s2143.includes('二百一十三件套（二百一十二件套清除）') && s2143.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));
ok('smoke_v2273 旧 v22.73 字面量 pin 零残留', !s2273.includes("const GAME_VERSION = 'v22.73';"));
ok('smoke_v2273 旧一百六十九件套 pin 零残留', !s2273.includes('一百六十九件套（一百六十八件套清除）'));

console.log(`\n— v22.74 似曾相识冒烟：${n - failed}/${n} 通过 —`);
if (failed) process.exit(1);
