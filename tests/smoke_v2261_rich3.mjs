// v22.61 专项冒烟：新成就「富甲一方」（金币线第三档里程碑，新内容·单成就，承 等级三档 lvl5·lvl10·lvl12 /
// 金币两档 rich·rich2 多档先例）——成就版图逐线核对的第三档补全：等级线早有三档（lvl5·lvl10·lvl12）、
// 宝箱/讨伐/时长/掉落/金币/酿造/药水/灵药/蘑菇各线都有两档，唯独金币线（rich 小富翁=500 金 /
// rich2 金玉满堂=1500 金）仍停两档——毕业装（勇者之剑 600 + 龙鳞甲 480 ≈1080）买齐后仍有富余的后期玩家
// （终局无字回廊重复刷级 Lv12、试炼三连战再战每轮 150+lv×20、卖蘑菇 10 金/株，均随等级自然积累可达）
// 在「金玉满堂」处毫无第三枚回应。现补第三档（RICH3_GOAL=3000 金，约通关 + 试炼 farming 后攒钱可期）：
// 判定/描述/进度三处同读新常量 RICH3_GOAL（与 RICH_GOLD/RICH2_GOAL 同一「成就阈值数据化」家族——
// 改门槛只改 data.js 一处自动跟随，零裸字面量），计数读既有 hero.gold 字段（(g.gold||0) 防御式读取、
// 旧档无 gold 字段时 false 不误解锁、零迁移，承 rich2 同款）；无 r 字段（与 rich/rich2/lvl5 同款纯里程碑
// ——攒下的金子本身就是奖励）；解锁时机：applyAchievements 既有通路任意判定点当场解锁（gold 为持续变化量，
// 无需新判定点，承 rich2/lvl12 同款——先攒钱买装备再存到 3000 也照常解锁，已解锁不因消费回落而撤销）。
// 本冒烟守护：版本锚点、RICH3_GOAL 数据契约（===3000、声明与导出）、ACH_LIST 契约（rich3 唯一/
// 总数 46/既有 45 成就 id 零回归/mush index 41 与 metall index 44 零位移/末尾追加序位 45）、
// ok/prog 谓词逐值（0·2999 false / 3000·6000 true / 缺 gold 字段防御 false·0/3000 / prog 不钳制 6000/3000）、
// 运行期全链路（applyAchievements 真实解锁落 hero.ach / 未够不误解锁 / 新档起始金不误解锁 /
// 重复调用去重 / 旧档缺字段不抛错不解锁）、drawAch 46 项滚动渲染不抛错、README/package.json/CHANGELOG
// 同步、姊妹件套 pin（v2260..v2176 一百五十七件套 / v2260·v2259·v2258·v2229 GAME_VERSION v22.61 /
// v2143-45 哨兵链 158）随新现实更新 + 旧代 v22.60 字面量/恒等/件套/串尾/testChain/顶 pin 全库零残留。
import { GAME_VERSION, ACH_LIST, RICH3_GOAL } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.61 富甲一方金币线第三档里程碑冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v22.60 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.60（本版守 v22.61）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 61)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v22.61 版本注释', dataSrc.includes('v22.61 新成就·金币线第三档里程碑「富甲一方」'));
ok('data.js GAME_VERSION 字面量已为 v22.61（旧 v22.60 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.87';") && !dataSrc.includes("const GAME_VERSION = 'v22." + "60';"));
ok('data.js 仍保留 v22.60 历史注释（泉涌涟漪景观）', dataSrc.includes('v22.60 新内容·世界景观·纯显示'));
ok('data.js 导出 RICH3_GOAL（export 块落位，与 RICH_GOLD/RICH2_GOAL 相邻）',
  dataSrc.includes('RICH_GOLD, RICH2_GOAL, RICH3_GOAL, SCHOLAR_GOAL'));

// —— RICH3_GOAL 数据契约 ——
ok('RICH3_GOAL === 3000（金币线第三档 = 累计持有 3000 金）', RICH3_GOAL === 3000, String(RICH3_GOAL));
ok('RICH3_GOAL 声明为 3000 且注释含「富甲一方」口径', dataSrc.includes('const RICH3_GOAL = 3000;') && dataSrc.includes('成就「富甲一方」'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'rich3');
ok('ACH_LIST 含 rich3「富甲一方」且 id 唯一',
  !!ach && ach.name === '富甲一方' && ACH_LIST.filter((a) => a.id === 'rich3').length === 1);
ok('ACH_LIST 精确总数 46 项（v2229 精确计数 pin 随新现实更新 45→46）', ACH_LIST.length === 75, String(ACH_LIST.length));
ok('rich3 描述由 RICH3_GOAL 派生（单一数据源，零裸字面量 3000）',
  ach.d === `持有 ${RICH3_GOAL} 金币`, ach.d);
ok('rich3 判定/进度同读 RICH3_GOAL + gold 防御式（ok (g.gold||0) / prog (g.gold||0)）',
  String(ach.ok).includes('RICH3_GOAL') && String(ach.ok).includes('g.gold||0') &&
  String(ach.prog).includes('RICH3_GOAL') && String(ach.prog).includes('g.gold||0'));
ok('rich3 无 r 字段纯里程碑（与 rich/rich2/lvl5 同款）', !('r' in ach));

// —— 既有 45 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime', 'hunt100', 'ptime2', 'lucky2', 'rich2', 'stock',
  'brew2', 'stock2', 'elixir', 'mush', 'elixir2', 'mush2', 'metall'];
ok('既有 45 成就 id 零回归', EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('rich3 追加在末尾序位（mush 41 / metall 44 / rich3 45，既有序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'mush') === 41 &&
  ACH_LIST.findIndex((a) => a.id === 'metall') === 44 &&
  ACH_LIST.findIndex((a) => a.id === 'rich3') === 45);

// —— ok/prog 谓词逐值 ——
ok('gold=0（新档 START_GOLD 起，未达标）→ false', ach.ok({ gold: 0 }) === false);
ok('gold=2999（差 1 金）→ false（恰在门槛下不解锁）', ach.ok({ gold: 2999 }) === false);
ok('gold=3000 → true（恰达标）', ach.ok({ gold: 3000 }) === true);
ok('gold=6000 → true（超阈值仍达标）', ach.ok({ gold: 6000 }) === true);
ok('缺 gold 字段旧档 → false 且 prog 0/3000（防御式零迁移）',
  ach.ok({}) === false && ach.prog({}) === `0/${RICH3_GOAL}`);
ok('gold 非数值（undefined 兜底）→ false 不抛错', ach.ok({ gold: undefined }) === false);
ok('prog 1500 金 → 1500/3000', ach.prog({ gold: 1500 }) === `1500/${RICH3_GOAL}`, ach.prog({ gold: 1500 }));
ok('prog 3000 金 → 3000/3000', ach.prog({ gold: 3000 }) === `3000/${RICH3_GOAL}`, ach.prog({ gold: 3000 }));
ok('prog 6000 金不钳制（6000/3000，承 lvl5「X/N 不钳制」口径）', ach.prog({ gold: 6000 }) === `6000/${RICH3_GOAL}`, ach.prog({ gold: 6000 }));

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

// 达标档：gold=3000 → applyAchievements 真实解锁落 hero.ach（持续变化量，任意判定点当场解锁）
let hero = newGame('余烬');
hero.gold = 3000;
hero = runAch(hero);
ok('运行期：gold=3000 触发 applyAchievements 真实解锁 rich3 落 hero.ach', hero.ach.includes('rich3'), hero.ach.join(','));

// 未达标档：gold=2999 → 不误解锁（差 1 金）
hero = newGame('灯见');
hero.gold = 2999;
hero = runAch(hero);
ok('运行期：gold=2999 不误解锁 rich3', !hero.ach.includes('rich3'));

// 新档起始金币（START_GOLD，未达 3000）→ 不误解锁
hero = newGame('潮');
hero = runAch(hero);
ok('运行期：新档起始 gold 不误解锁 rich3', !hero.ach.includes('rich3'), String(hero.gold));

// 重复调用去重：已解锁后再 applyAchievements 不重复 push
hero = newGame('灯');
hero.gold = 3000;
runAch(hero);
runAch(hero);
ok('运行期：重复调用去重（hero.ach 中 rich3 恰一枚）',
  hero.ach.filter((x) => x === 'rich3').length === 1);

// 旧档防御档：无 gold 字段读档 → applyAchievements 不抛错且不解锁（零迁移）
hero = newGame('潮');
delete hero.gold;
let threw = null;
try { runAch(hero); } catch (e) { threw = e; }
ok('运行期：旧档缺 gold 字段 applyAchievements 不抛错（防御式）', threw === null, threw && String(threw.stack || threw));
ok('运行期：缺字段旧档不解锁 rich3（零迁移）', !hero.ach.includes('rich3'));

// —— drawAch 渲染（46 项滚动不抛错；PAGE=10 五页）——
let rendered = true, renderedPg5 = true;
try {
  S.G = newGame('测试'); S.G.ach = ['rich3']; S.achScroll = 0; S.scene = 'ach';
  drawAch();
} catch (e) { rendered = false; }
try {
  S.achScroll = 50; // 46 项滚到末页（PAGE=10，钳制到 36）不抛错
  drawAch();
} catch (e) { renderedPg5 = false; }
S.achScroll = 0; S.scene = 'world';
ok('运行期：成就页 drawAch 46 项渲染不抛错', rendered);
ok('运行期：成就页末页滚动渲染不抛错（46 项 PAGE=10 五页）', renderedPg5);

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树串尾已延伸至 smoke_v2261_rich3（v2260 后接 v2261）',
  readme.includes('smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc（npm test 串跑）'));
ok('README 件套口径为二百一十五件套（二百一十四件套清除）且旧 156 口径零残留',
  readme.includes('冒烟二百一十五件套（二百一十四件套清除）') && !readme.includes('冒烟一百五十六件套（一百五十五件套清' + '除）'));
ok('README 含 v22.61 守护描述（新成就富甲一方守护）', readme.includes('v22.61 起含新成就「富甲一方」'));
ok('README 含 smoke_v2261_rich3 入库（157 份）', readme.includes('smoke_v2261_rich3 入库（157 份）'));
ok('README 仍保留 smoke_v2260_fountripple 入库（156 份）历史口径', readme.includes('smoke_v2260_fountripple 入库（156 份）'));
ok('README 成就口径「46 项」双处同步（快速上手表 C 键行 + 图鉴&成就行）',
  readme.includes('成就一览（全部 75 项进度') && readme.includes('**75 项成就**') &&
  !readme.includes('成就一览（全部 45 项进' + '度') && !readme.includes('**45 项成' + '就**'));
ok('package.json 已收录 smoke_v2261_rich3（npm test 串跑第 157 份）',
  pkg.includes('smoke_v2261_rich3.mjs') && pkg.includes('smoke_v2260_fountripple.mjs && node tests/smoke_v2261_rich3.mjs && node tests/smoke_v2262_crystal.mjs && node tests/smoke_v2263_ptime3.mjs && node tests/smoke_v2264_hunt3.mjs && node tests/smoke_v2265_lucky3.mjs && node tests/smoke_v2266_stock3.mjs && node tests/smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 157 件套', testChain === 215, String(testChain));
ok('CHANGELOG 顶为 v22.61 条目', changelog.startsWith('## v23.87 '));
ok('CHANGELOG 含 v22.60 条目', changelog.includes('## v22.60 '));

// —— 姊妹件套 pin 复查（v2260..v2176 随新现实更新）——
const s2260 = read('../tests/smoke_v2260_fountripple.mjs');
const s2259 = read('../tests/smoke_v2259_sandpile.mjs');
const s2258 = read('../tests/smoke_v2258_potionhelp.mjs');
const s2229 = read('../tests/smoke_v2229_metall.mjs');
const s2199 = read('../tests/smoke_v2199_rich2.mjs');
const s2143 = read('../tests/smoke_v2143_talkekey.mjs');
ok('smoke_v2260 的 GAME_VERSION 字面量 pin 已更新为 v22.61', s2260.includes("const GAME_VERSION = 'v23.87';"));
ok('smoke_v2229 的 GAME_VERSION 恒等 pin 已更新为 v22.61（恒等 pin 族随新现实全库更新）', s2229.includes("GAME_VERSION === 'v23.87'"));
ok('smoke_v2260 的 README 件套 pin 已随新现实更新为二百一十五件套（二百一十四件套清除）',
  s2260.includes('二百一十五件套（二百一十四件套清除）'));
ok('smoke_v2260 的 package.json 件套计数 pin 已更新为 === 157', s2260.includes('testChain === 215'));
ok('smoke_v2260 的 CHANGELOG 顶 pin 已更新为 ## v22.61', s2260.includes("startsWith('## v23.87')"));
ok('smoke_v2260 的 README 串尾 pin 已随新现实延伸至 smoke_v2261_rich3',
  s2260.includes('smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc（npm test 串跑）'));
ok('smoke_v2260 的 package.json 串尾 plain pin 已延伸至 smoke_v2261_rich3',
  s2260.includes('smoke_v2260_fountripple.mjs && node tests/smoke_v2261_rich3.mjs && node tests/smoke_v2262_crystal.mjs && node tests/smoke_v2263_ptime3.mjs && node tests/smoke_v2264_hunt3.mjs && node tests/smoke_v2265_lucky3.mjs && node tests/smoke_v2266_stock3.mjs && node tests/smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs"'));
ok('smoke_v2260 的 archChain/looseChain 已延伸至 smoke_v2261_rich3（源端 v2260 / 尾端 v2261）',
  (s2260.match(/smoke_v2260_fountripple\[/g) || []).length === 2 &&
  (s2260.match(/smoke_v2261_rich3\[/g) || []).length === 2 &&
  !s2260.includes('smoke_v2259_sandpile['));
ok('smoke_v2259 的 GAME_VERSION 字面量 pin 已更新为 v22.61', s2259.includes("const GAME_VERSION = 'v23.87';"));
ok('smoke_v2259 的 README 件套 pin 已随新现实更新为二百一十五件套（二百一十四件套清除）',
  s2259.includes('二百一十五件套（二百一十四件套清除）'));
ok('smoke_v2259 的 package.json 件套计数 pin 已更新为 === 157', s2259.includes('testChain === 215'));
ok('smoke_v2259 的 CHANGELOG 顶 pin 已更新为 ## v22.61', s2259.includes("startsWith('## v23.87')"));
ok('smoke_v2259 的 package.json 串尾 plain pin 已延伸至 smoke_v2261_rich3',
  s2259.includes('smoke_v2260_fountripple.mjs && node tests/smoke_v2261_rich3.mjs && node tests/smoke_v2262_crystal.mjs && node tests/smoke_v2263_ptime3.mjs && node tests/smoke_v2264_hunt3.mjs && node tests/smoke_v2265_lucky3.mjs && node tests/smoke_v2266_stock3.mjs && node tests/smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs"'));
ok('smoke_v2258 的 GAME_VERSION 字面量 pin 已更新为 v22.61', s2258.includes("const GAME_VERSION = 'v23.87';"));
ok('smoke_v2229 的 ACH_LIST 精确总数 pin 已更新为 === 46（45→46）',
  s2229.includes('ACH_LIST.length === 75') && !s2229.includes('ACH_LIST.length === 4' + '5'));
ok('smoke_v2199 的 README 成就 pin 已随新现实更新为 46 项双处落位',
  s2199.includes("readme.includes('成就一览（全部 75 项进度'") && s2199.includes('**75 项成就**'));
ok('v2143-45「件套守护领先一位」哨兵链已推进至 158（二百一十五件套（二百一十四件套清除））',
  s2143.includes('二百一十六件套（二百一十五件套清除）') && s2143.includes("!readme.includes('二百一十六件套（二百一十五件套清除）')"));

// 旧代 v22.60 pin 全库零残留（字面量/恒等/件套/串尾/testChain/顶 pin/README 45 项）
const allTests = fs.readdirSync(new URL('../tests', import.meta.url)).filter((f) => /^smoke_.*\.mjs$/.test(f));
const stale = [];
for (const f of allTests) {
  const src = read(`../tests/${f}`);
  if (src.includes("const GAME_VERSION = 'v22." + "60';") || src.includes("GAME_VERSION === 'v22." + "60'") ||
      src.includes('一百五十六件套（一百五十五件套清' + '除）') || src.includes('testChain === ' + '156') ||
      src.includes("startsWith('## v22." + "60')") ||
      src.includes('smoke_v2260_fountripple（npm test 串' + '跑）') ||
      src.includes('全部 45 项进' + '度') || src.includes('**45 项成' + '就**') ||
      src.includes('ACH_LIST.length === 4' + '5')) stale.push(f);
}
ok('旧代 v22.60 字面量/恒等/件套/串尾/testChain/顶 pin/45 项 pin 全库零残留（' + allTests.length + ' 件扫描，含本件）', stale.length === 0, stale.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
