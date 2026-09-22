// v22.69 专项冒烟：新成就「菇海无涯」（魔法蘑菇持有线第三档里程碑，新内容·单成就，承 v22.14 菇香满仓 /
// v22.18 菇山菌海 / v22.61 富甲一方 / v22.63 长明如昼 / v22.64 驱雾三百战 / v22.65 洪福齐天 / v22.66 万全之备 /
// v22.67 灵药满仓 / v22.68 炉火纯青 多档先例）——成就版图三档推进的蘑菇线收口：等级线早有三档（lvl5·lvl10·lvl12）、
// 金币线 v22.61 补至三档（rich·rich2·rich3）、时长线 v22.63 补至三档（ptime·ptime2·ptime3）、讨伐线 v22.64
// 补至三档（hunt10·hunt100·hunt3）、掉落线 v22.65 补至三档（lucky·lucky2·lucky3）、药水线 v22.66 补至三档
// （stock·stock2·stock3）、灵药线 v22.67 补至三档（elixir·elixir2·elixir3）、酿造线 v22.68 补至三档
// （brew·brew2·brew3），唯独蘑菇线（mush 菇香满仓=10 株 / mush2 菇山菌海=25 株）仍停两档——蘑菇是灯油主题
// 签名采集物（宝箱 60% 蘑菇/精英必掉/战斗掉落 12% 三源，酿造 2 株/卖菇 10 金双消耗、无背包上限），「持有 N 株」
// 这条线理应有第三档。现补第三档（MUSH3_GOAL=50 株，双倍「菇山菌海」的途程——50 株 = 25 锅灵药（50 株蘑菇 +
// 250 金）或 500 金卖菇，终局区（无字回廊重复刷级 Lv12、试炼三连战再战、图鉴/宝箱/碎片收集补完）自然积累可达）：
// 判定/描述/进度三处同读新常量 MUSH3_GOAL（与 MUSH_GOAL/MUSH2_GOAL 同一「成就阈值数据化」家族——改门槛只改
// data.js 一处自动跟随，零裸字面量），计数读既有 hero.mushrooms 字段（newGame 起始 0、开箱 world.onStep/
// 精英必掉 battle.winBattle/战斗掉落 rules.rollDrop 写定、酿造/卖菇扣减，随存档快照持久化），(g.mushrooms||0)
// 防御式读取、旧档无此字段 false 不误解锁、零迁移，承 mush/mush2 同款）；无 r 字段（与 mush/mush2/lvl5 同款
// 纯里程碑——蘑菇本身就是奖励）；解锁时机：applyAchievements 既有通路任意判定点当场解锁（mushrooms 为持续
// 变化量，无需新判定点，承 mush2 同款——已解锁不因酿造/卖菇消耗回落而撤销；开箱/胜利/酿造本就当场判定，
// 第 50 株落袋的瞬间即解锁、反馈不迟到）。
// 本冒烟守护：版本锚点、MUSH3_GOAL 数据契约（===50、声明与导出）、ACH_LIST 契约（mush3 唯一/总数 53/
// 既有 52 成就 id 零回归/ptime 32 与 ptime2 34 与 mush 41 与 metall 44 与 rich3 45 与 ptime3 46 与 hunt3 47
// 与 lucky3 48 与 stock3 49 与 elixir3 50 与 brew3 51 零位移/末尾追加序位 52）、ok/prog 谓词逐值（0·49 false /
// 50·100 true / 缺 mushrooms 字段防御 false·0/50 / prog 不钳制 100/50）、运行期全链路（applyAchievements 真实
// 解锁落 hero.ach / 未够不误解锁 / 新档起始蘑菇不误解锁 / 重复调用去重 / 旧档缺字段不抛错不解锁）、drawAch
// 53 项滚动渲染不抛错、README/package.json/CHANGELOG 同步、姊妹件套 pin（v2268..v2259 一百六十五件套 /
// v2268·v2267·v2266·v2265·v2264·v2263·v2262·v2261·v2260·v2259·v2258 GAME_VERSION v22.69 / v2143-45 哨兵链 166）
// 随新现实更新 + 旧代 v22.68 字面量/恒等/件套/串尾/testChain/顶 pin 全库零残留 + MUSH 家族 export pin 追平
// （v2214/v2218 冒烟随新现实并入 MUSH3_GOAL）。
import { GAME_VERSION, ACH_LIST, MUSH3_GOAL } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.69 菇海无涯蘑菇线第三档里程碑冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v22.68 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.69（本版守 v22.79）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 99)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v22.69 版本注释', dataSrc.includes('v22.69 新成就·魔法蘑菇持有线第三档里程碑「菇海无涯」'));
ok('data.js GAME_VERSION 字面量已为 v22.69（旧 v22.68 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.68';") && !dataSrc.includes("const GAME_VERSION = 'v22." + "68';"));
ok('data.js 仍保留 v22.68 历史注释（炉火纯青成就注释未动）', dataSrc.includes('v22.68 新成就·酿造线第三档里程碑「炉火纯青」'));
ok('data.js 导出 MUSH3_GOAL（export 块落位，与 MUSH_GOAL/MUSH2_GOAL 相邻）',
  dataSrc.includes('MUSHROOM_GOAL, MUSH_GOAL, MUSH2_GOAL, MUSH3_GOAL, MIST_GOAL'));

// —— MUSH3_GOAL 数据契约 ——
ok('MUSH3_GOAL === 50（蘑菇线第三档 = 双倍「菇山菌海」）', MUSH3_GOAL === 50, String(MUSH3_GOAL));
ok('MUSH3_GOAL 声明与注释含「菇海无涯」口径',
  dataSrc.includes('const MUSH3_GOAL = 50;') && dataSrc.includes('成就「菇海无涯」'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'mush3');
ok('ACH_LIST 含 mush3「菇海无涯」且 id 唯一',
  !!ach && ach.name === '菇海无涯' && ACH_LIST.filter((a) => a.id === 'mush3').length === 1);
ok('ACH_LIST 精确总数 53 项（v2229 精确计数 pin 随新现实更新 52→53）', ACH_LIST.length === 67, String(ACH_LIST.length));
ok('mush3 描述由 MUSH3_GOAL 派生（单一数据源，零裸字面量 50）',
  ach.d === `持有 ${MUSH3_GOAL} 株魔法蘑菇`, ach.d);
ok('mush3 判定/进度同读 MUSH3_GOAL + mushrooms 防御式（ok (g.mushrooms||0) / prog (g.mushrooms||0)）',
  String(ach.ok).includes('MUSH3_GOAL') && String(ach.ok).includes('g.mushrooms||0') &&
  String(ach.prog).includes('MUSH3_GOAL') && String(ach.prog).includes('g.mushrooms||0'));
ok('mush3 无 r 字段纯里程碑（与 mush/mush2/lvl5 同款）', !('r' in ach));

// —— 既有 52 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime', 'hunt100', 'ptime2', 'lucky2', 'rich2', 'stock',
  'brew2', 'stock2', 'elixir', 'mush', 'elixir2', 'mush2', 'metall', 'rich3', 'ptime3', 'hunt3', 'lucky3', 'stock3', 'elixir3', 'brew3'];
ok('既有 52 成就 id 零回归', EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('mush3 追加在末尾序位（ptime 32 / ptime2 34 / mush 41 / metall 44 / rich3 45 / ptime3 46 / hunt3 47 / lucky3 48 / stock3 49 / elixir3 50 / brew3 51 / mush3 52，既有序位零位移）',
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
  ACH_LIST.findIndex((a) => a.id === 'mush3') === 52);

// —— ok/prog 谓词逐值 ——
ok('mushrooms=0（新档起始采集，未达标）→ false', ach.ok({ mushrooms: 0 }) === false);
ok('mushrooms=49（差 1 株）→ false（恰在门槛下不解锁）', ach.ok({ mushrooms: 49 }) === false);
ok('mushrooms=50 → true（恰达标）', ach.ok({ mushrooms: 50 }) === true);
ok('mushrooms=100 → true（超阈值仍达标不抛错）', ach.ok({ mushrooms: 100 }) === true);
ok('缺 mushrooms 字段旧档 → false 且 prog 0/50（防御式零迁移）',
  ach.ok({}) === false && ach.prog({}) === `0/${MUSH3_GOAL}`);
ok('mushrooms 非数值（undefined 兜底）→ false 不抛错', ach.ok({ mushrooms: undefined }) === false);
ok('prog 25 株 → 25/50', ach.prog({ mushrooms: 25 }) === `25/${MUSH3_GOAL}`, ach.prog({ mushrooms: 25 }));
ok('prog 50 株 → 50/50', ach.prog({ mushrooms: 50 }) === `50/${MUSH3_GOAL}`, ach.prog({ mushrooms: 50 }));
ok('prog 100 株不钳制（100/50，承 lvl5「X/N 不钳制」口径）', ach.prog({ mushrooms: 100 }) === `100/${MUSH3_GOAL}`, ach.prog({ mushrooms: 100 }));

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

// 达标档：mushrooms=50 → applyAchievements 真实解锁落 hero.ach（持续变化量，任意判定点当场解锁）
let hero = newGame('余烬');
hero.mushrooms = 50;
hero = runAch(hero);
ok('运行期：mushrooms=50 触发 applyAchievements 真实解锁 mush3 落 hero.ach', hero.ach.includes('mush3'), hero.ach.join(','));

// 未达标档：mushrooms=49 → 不误解锁（差 1 株）
hero = newGame('灯见');
hero.mushrooms = 49;
hero = runAch(hero);
ok('运行期：mushrooms=49 不误解锁 mush3', !hero.ach.includes('mush3'));

// 新档起始蘑菇（0，未达 50）→ 不误解锁
hero = newGame('潮');
hero = runAch(hero);
ok('运行期：新档起始蘑菇不误解锁 mush3', !hero.ach.includes('mush3'), String(hero.mushrooms));

// 重复调用去重：已解锁后再 applyAchievements 不重复 push
hero = newGame('灯');
hero.mushrooms = 50;
runAch(hero);
runAch(hero);
ok('运行期：重复调用去重（hero.ach 中 mush3 恰一枚）',
  hero.ach.filter((x) => x === 'mush3').length === 1);

// 旧档防御档：无 mushrooms 字段读档 → applyAchievements 不抛错且不解锁（零迁移）
hero = newGame('潮');
delete hero.mushrooms;
let threw = null;
try { runAch(hero); } catch (e) { threw = e; }
ok('运行期：旧档缺 mushrooms 字段 applyAchievements 不抛错（防御式）', threw === null, threw && String(threw.stack || threw));
ok('运行期：缺字段旧档不解锁 mush3（零迁移）', !hero.ach.includes('mush3'));

// —— drawAch 渲染（53 项滚动不抛错；PAGE=10 六页）——
let rendered = true, renderedPg6 = true;
try {
  S.G = newGame('测试'); S.G.ach = ['mush3']; S.achScroll = 0; S.scene = 'ach';
  drawAch();
} catch (e) { rendered = false; }
try {
  S.achScroll = 60; // 53 项滚到最末页（PAGE=10，钳制到 50）不抛错
  drawAch();
} catch (e) { renderedPg6 = false; }
S.achScroll = 0; S.scene = 'world';
ok('运行期：成就页 drawAch 53 项渲染不抛错', rendered);
ok('运行期：成就页末页滚动渲染不抛错（53 项 PAGE=10 六页）', renderedPg6);

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树串尾已延伸至 smoke_v2269_mush3（v2268 后接 v2269）',
  readme.includes('smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 件套口径为二百一十二件套（二百一十一件套清除）且旧 164 口径零残留',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟一百六十四件套（一百六十三件套清' + '除）'));
ok('README 含 v22.69 守护描述（新成就菇海无涯守护）', readme.includes('v22.69 起含新成就「菇海无涯」'));
ok('README 含 smoke_v2269_mush3 入库（165 份）', readme.includes('smoke_v2269_mush3 入库（165 份）'));
ok('README 仍保留 smoke_v2268_brew3 入库（164 份）历史口径', readme.includes('smoke_v2268_brew3 入库（164 份）'));
ok('README 仍保留 v22.68 守护描述（历史口径未动）', readme.includes('v22.68 起含新成就「炉火纯青」'));
ok('README 成就口径「53 项」双处同步（快速上手表 C 键行 + 图鉴&成就行）',
  readme.includes('成就一览（全部 67 项进度') && readme.includes('**67 项成就**') &&
  !readme.includes('成就一览（全部 52 项进' + '度') && !readme.includes('**52 项成' + '就**'));
ok('package.json 已收录 smoke_v2269_mush3（npm test 串跑第 165 份）',
  pkg.includes('smoke_v2269_mush3.mjs') && pkg.includes('smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 165 件套', testChain === 212, String(testChain));
ok('CHANGELOG 顶为 v22.69 条目', changelog.startsWith('## v23.68 '));
ok('CHANGELOG 含 v22.68 条目', changelog.includes('## v22.68 '));

// —— 姊妹件套 pin 复查（v2268..v2258 随新现实更新）——
const s2268 = read('../tests/smoke_v2268_brew3.mjs');
const s2267 = read('../tests/smoke_v2267_elixir3.mjs');
const s2266 = read('../tests/smoke_v2266_stock3.mjs');
const s2265 = read('../tests/smoke_v2265_lucky3.mjs');
const s2264 = read('../tests/smoke_v2264_hunt3.mjs');
const s2263 = read('../tests/smoke_v2263_ptime3.mjs');
const s2262 = read('../tests/smoke_v2262_crystal.mjs');
const s2261 = read('../tests/smoke_v2261_rich3.mjs');
const s2260 = read('../tests/smoke_v2260_fountripple.mjs');
const s2259 = read('../tests/smoke_v2259_sandpile.mjs');
const s2258 = read('../tests/smoke_v2258_potionhelp.mjs');
const s2229 = read('../tests/smoke_v2229_metall.mjs');
const s2218 = read('../tests/smoke_v2218_mush2.mjs');
const s2214 = read('../tests/smoke_v2214_mush.mjs');
const s2199 = read('../tests/smoke_v2199_rich2.mjs');
const s2143 = read('../tests/smoke_v2143_talkekey.mjs');
const s2144 = read('../tests/smoke_v2144_run.mjs');
const s2145 = read('../tests/smoke_v2145_journalscroll.mjs');
ok('smoke_v2268 的 GAME_VERSION 字面量 pin 已更新为 v22.69', s2268.includes("const GAME_VERSION = 'v23.68';"));
ok('smoke_v2268 的 README 件套 pin 已随新现实更新为二百一十二件套（二百一十一件套清除）',
  s2268.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2268 的 package.json 件套计数 pin 已更新为 === 165', s2268.includes('testChain === 212'));
ok('smoke_v2268 的 CHANGELOG 顶 pin 已更新为 ## v22.69', s2268.includes("startsWith('## v23.68'") || s2268.includes("startsWith('## v22.78 '"));
ok('smoke_v2268 的 README 串尾 pin 已随新现实延伸至 smoke_v2269_mush3',
  s2268.includes('smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2268 的 package.json 串尾 plain pin 已延伸至 smoke_v2269_mush3',
  s2268.includes('smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
ok('smoke_v2268 的 README 成就 pin 已随新现实更新为 53 项双处', s2268.includes('成就一览（全部 67 项进度') && s2268.includes('**67 项成就**'));
ok('smoke_v2268 的 ACH_LIST 精确计数 pin 已更新为 === 53', s2268.includes('ACH_LIST.length === 67'));
ok('smoke_v2268 的版本锚点已随新现实推进至 >= 69', s2268.includes('_gv[0] === 22 && _gv[1] >= 99'));
ok('smoke_v2267 的 GAME_VERSION 字面量 pin 已更新为 v22.69', s2267.includes("const GAME_VERSION = 'v23.68';"));
ok('smoke_v2267 的 README 件套 pin 已随新现实更新为二百一十二件套（二百一十一件套清除）',
  s2267.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2267 的 package.json 件套计数 pin 已更新为 === 165', s2267.includes('testChain === 212'));
ok('smoke_v2267 的 CHANGELOG 顶 pin 已更新为 ## v22.69', s2267.includes("startsWith('## v23.68'") || s2267.includes("startsWith('## v22.78 '"));
ok('smoke_v2267 的 README 串尾 pin 已随新现实延伸至 smoke_v2269_mush3',
  s2267.includes('smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2267 的 package.json 串尾 plain pin 已延伸至 smoke_v2269_mush3',
  s2267.includes('smoke_v2266_stock3.mjs && node tests/smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
ok('smoke_v2267 的 README 成就 pin 已随新现实更新为 53 项双处', s2267.includes('成就一览（全部 67 项进度') && s2267.includes('**67 项成就**'));
ok('smoke_v2267 的 ACH_LIST 精确计数 pin 已更新为 === 53', s2267.includes('ACH_LIST.length === 67'));
ok('smoke_v2266 的 GAME_VERSION 字面量 pin 已更新为 v22.69', s2266.includes("const GAME_VERSION = 'v23.68';"));
ok('smoke_v2266 的 README 件套 pin 已随新现实更新为二百一十二件套（二百一十一件套清除）',
  s2266.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2266 的 package.json 件套计数 pin 已更新为 === 165', s2266.includes('testChain === 212'));
ok('smoke_v2266 的 CHANGELOG 顶 pin 已更新为 ## v22.69', s2266.includes("startsWith('## v23.68'") || s2266.includes("startsWith('## v22.78 '"));
ok('smoke_v2266 的 README 串尾 pin 已随新现实延伸至 smoke_v2269_mush3',
  s2266.includes('smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2266 的 package.json 串尾 plain pin 已延伸至 smoke_v2269_mush3',
  s2266.includes('smoke_v2265_lucky3.mjs && node tests/smoke_v2266_stock3.mjs && node tests/smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
ok('smoke_v2266 的 README 成就 pin 已随新现实更新为 53 项双处', s2266.includes('成就一览（全部 67 项进度') && s2266.includes('**67 项成就**'));
ok('smoke_v2266 的 ACH_LIST 精确计数 pin 已更新为 === 53', s2266.includes('ACH_LIST.length === 67'));
ok('smoke_v2265 的 GAME_VERSION 字面量 pin 已更新为 v22.69', s2265.includes("const GAME_VERSION = 'v23.68';"));
ok('smoke_v2265 的 README 件套 pin 已随新现实更新为二百一十二件套（二百一十一件套清除）',
  s2265.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2265 的 README 串尾 pin 已随新现实延伸至 smoke_v2269_mush3',
  s2265.includes('smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2264 的 GAME_VERSION 字面量 pin 已更新为 v22.69', s2264.includes("const GAME_VERSION = 'v23.68';"));
ok('smoke_v2264 的 README 件套 pin 已随新现实更新为二百一十二件套（二百一十一件套清除）',
  s2264.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2264 的 README 串尾 pin 已随新现实延伸至 smoke_v2269_mush3',
  s2264.includes('smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2263 的 GAME_VERSION 字面量 pin 已更新为 v22.69', s2263.includes("const GAME_VERSION = 'v23.68';"));
ok('smoke_v2263 的 README 件套 pin 已随新现实更新为二百一十二件套（二百一十一件套清除）',
  s2263.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2262 的 GAME_VERSION 字面量 pin 已更新为 v22.69', s2262.includes("const GAME_VERSION = 'v23.68';"));
ok('smoke_v2261 的 GAME_VERSION 字面量 pin 已更新为 v22.69', s2261.includes("const GAME_VERSION = 'v23.68';"));
ok('smoke_v2260 的 GAME_VERSION 恒等 pin 族已随新现实全库更新（v22.69 字面量 pin 落位）',
  s2260.includes("const GAME_VERSION = 'v23.68';"));
ok('smoke_v2260 的 README 件套 pin 已随新现实更新为二百一十二件套（二百一十一件套清除）',
  s2260.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2259 的 GAME_VERSION 字面量 pin 已更新为 v22.69', s2259.includes("const GAME_VERSION = 'v23.68';"));
ok('smoke_v2258 的 GAME_VERSION 字面量 pin 已更新为 v22.69', s2258.includes("const GAME_VERSION = 'v23.68';"));
ok('smoke_v2229 的 ACH_LIST 精确总数 pin 已更新为 === 53（52→53）',
  s2229.includes('ACH_LIST.length === 67') && !s2229.includes('ACH_LIST.length === 5' + '2'));
ok('smoke_v2218 的 MUSH 家族 export pin 已并入 MUSH3_GOAL', s2218.includes('MUSHROOM_GOAL, MUSH_GOAL, MUSH2_GOAL, MUSH3_GOAL, MIST_GOAL'));
ok('smoke_v2214 的 MUSH 家族 export pin 已并入 MUSH3_GOAL', s2214.includes('MUSHROOM_GOAL, MUSH_GOAL, MUSH2_GOAL, MUSH3_GOAL, MIST_GOAL'));
ok('smoke_v2199 的 README 成就 pin 已随新现实更新为 53 项双处落位',
  s2199.includes('成就一览（全部 67 项进度') && s2199.includes('**67 项成就**'));
ok('v2143-45「件套守护领先一位」哨兵链已推进至 166（二百一十二件套（二百一十一件套清除））',
  s2143.includes('二百一十三件套（二百一十二件套清除）') && s2143.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));
ok('smoke_v2144 的哨兵链 pin 已随新现实推进（!readme 不含一百六十七件套）',
  s2144.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));
ok('smoke_v2145 的哨兵链 pin 已随新现实推进（二百一十二件套（二百一十一件套清除））',
  s2145.includes('二百一十三件套（二百一十二件套清除）'));

// 旧代 v22.68 pin 全库零残留（字面量/恒等/件套/串尾/testChain/顶 pin/README 52 项/ACH 52/锚点 68/MUSH 旧 export pin）
const allTests = fs.readdirSync(new URL('../tests', import.meta.url)).filter((f) => /^smoke_.*\.mjs$/.test(f));
const stale = [];
for (const f of allTests) {
  const src = read(`../tests/${f}`);
  if (src.includes("const GAME_VERSION = 'v22." + "68';") || src.includes("GAME_VERSION === 'v22." + "68'") ||
      src.includes('一百六十四件套（一百六十三件套清' + '除）') || src.includes('testChain === ' + '164') ||
      src.includes("startsWith('## v22." + "68'") ||
      src.includes('smoke_v2268_brew3（npm test 串' + '跑）') ||
      src.includes('全部 52 项进' + '度') || src.includes('**52 项成' + '就**') ||
      src.includes('ACH_LIST.length === 5' + '2') ||
      src.includes('_gv[0] === 22 && _gv[1] >= 6' + '8') ||
      src.includes('MUSHROOM_GOAL, MUSH_GOAL, MUSH2_GOAL, MIST_' + 'GOAL') ||
      src.includes('冒烟一百六十四件套（一百六十三件套清' + '除）')) stale.push(f);
}
ok('旧代 v22.68 字面量/恒等/件套/串尾/testChain/顶 pin/52 项 pin/锚点 68/MUSH 旧 export pin 全库零残留（' + allTests.length + ' 件扫描，含本件）', stale.length === 0, stale.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
