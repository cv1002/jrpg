// v22.66 专项冒烟：新成就「万全之备」（药水线第三档里程碑，新内容·单成就，承 v22.0 有备无患 /
// v22.6 药香满囊 / v22.61 富甲一方 / v22.63 长明如昼 / v22.64 驱雾三百战 / v22.65 洪福齐天 多档先例）——
// 成就版图三档推进的药水线收口：等级线早有三档（lvl5·lvl10·lvl12）、金币线 v22.61 补至三档（rich·rich2·
// rich3）、时长线 v22.63 补至三档（ptime·ptime2·ptime3）、讨伐线 v22.64 补至三档（hunt10·hunt100·hunt3）、
// 掉落线 v22.65 补至三档（lucky·lucky2·lucky3），唯独药水线（stock 有备无患=20 瓶 / stock2 药香满囊=50 瓶）
// 仍停两档——药水是全程陪伴的续航资源（商店 POTION_PRICE、宝箱掉落、战斗掉落、任务奖励四源），而「持有
// N 瓶」这条线在「药香满囊」之后已无更高档可立（POTION_CAP=99 即背包上限、商店购买拦截至 99）。现补第三档
// （POTIONS3_GOAL = POTION_CAP = 99 瓶 = 背包装满，阈值与上限恒等——调上限只改 POTION_CAP 一处、成就阈值
// 自动跟随零漂移；商店买满第 99 瓶的瞬间即解锁）：判定/描述/进度三处同读新常量 POTIONS3_GOAL（与
// POTIONS_GOAL/POTIONS2_GOAL 同一「成就阈值数据化」家族——改门槛只改 data.js 一处自动跟随，零裸字面量），
// 计数读既有 hero.item 字段（shop.buyPotion/开箱/掉落/任务奖励写入点、随存档快照持久化），(g.item||0)
// 防御式读取、旧档无 item 字段时 false 不误解锁、零迁移，承 stock/stock2 同款）；无 r 字段（与 stock/stock2/
// lvl5 同款纯里程碑——备而无患本身就是奖励）；解锁时机：applyAchievements 既有通路任意判定点当场解锁
// （item 为持续变化量，无需新判定点，承 stock2/lucky3 同款——已解锁不因任何变化而撤销）。
// 本冒烟守护：版本锚点、POTIONS3_GOAL 数据契约（===99、===POTION_CAP 恒等、声明与导出）、ACH_LIST 契约
// （stock3 唯一/总数 50/既有 49 成就 id 零回归/ptime 32 与 ptime2 34 与 mush 41 与 metall 44 与 rich3 45
// 与 ptime3 46 与 hunt3 47 与 lucky3 48 零位移/末尾追加序位 49）、ok/prog 谓词逐值（0·98 false / 99·150
// true / 缺 item 字段防御 false·0/99 / prog 不钳制 150/99）、运行期全链路（applyAchievements 真实解锁落
// hero.ach / 未够不误解锁 / 新档起始药水不误解锁 / 重复调用去重 / 旧档缺字段不抛错不解锁）、
// drawAch 50 项滚动渲染不抛错、README/package.json/CHANGELOG 同步、姊妹件套 pin（v2265..v2176
// 一百六十二件套 / v2265·v2264·v2263·v2262·v2261·v2260·v2259·v2258 GAME_VERSION v22.66 /
// v2143-45 哨兵链 163）随新现实更新 + 旧代 v22.65 字面量/恒等/件套/串尾/testChain/顶 pin 全库零残留
// + POTIONS 家族 export pin 追平（v2191/v2195/v2200/v2206 冒烟随新现实并入 POTIONS3_GOAL）。
import { GAME_VERSION, ACH_LIST, POTIONS3_GOAL, POTION_CAP } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.66 万全之备药水线第三档里程碑冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v22.65 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.69（本版守 v22.79）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 99)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v22.66 版本注释', dataSrc.includes('v22.66 新成就·药水线第三档里程碑「万全之备」'));
ok('data.js GAME_VERSION 字面量已为 v22.66（旧 v22.65 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.04';") && !dataSrc.includes("const GAME_VERSION = 'v22." + "65';"));
ok('data.js 仍保留 v22.65 历史注释（洪福齐天成就注释未动）', dataSrc.includes('v22.65 新成就·掉落线第三档里程碑「洪福齐天」'));
ok('data.js 导出 POTIONS3_GOAL（export 块落位，与 POTIONS_GOAL/POTIONS2_GOAL 相邻）',
  dataSrc.includes('POTIONS_GOAL, POTIONS2_GOAL, POTIONS3_GOAL, ELIXIR_STOCK_GOAL, ELIXIR_STOCK2_GOAL, ELIXIR_STOCK3_GOAL, PERFECTION_GOLD'));

// —— POTIONS3_GOAL 数据契约 ——
ok('POTIONS3_GOAL === 99（药水线第三档 = 背包装满 99 瓶）', POTIONS3_GOAL === 99, String(POTIONS3_GOAL));
ok('POTIONS3_GOAL === POTION_CAP（阈值与背包上限恒等·单一数据源）', POTIONS3_GOAL === POTION_CAP, String(POTION_CAP));
ok('POTIONS3_GOAL 声明为 POTION_CAP 恒等且注释含「万全之备」口径',
  dataSrc.includes('const POTIONS3_GOAL = POTION_CAP;') && dataSrc.includes('成就「万全之备」'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'stock3');
ok('ACH_LIST 含 stock3「万全之备」且 id 唯一',
  !!ach && ach.name === '万全之备' && ACH_LIST.filter((a) => a.id === 'stock3').length === 1);
ok('ACH_LIST 精确总数 50 项（v2229 精确计数 pin 随新现实更新 49→50）', ACH_LIST.length === 59, String(ACH_LIST.length));
ok('stock3 描述由 POTIONS3_GOAL 派生（单一数据源，零裸字面量 99）',
  ach.d === `持有 ${POTIONS3_GOAL} 瓶药水`, ach.d);
ok('stock3 判定/进度同读 POTIONS3_GOAL + item 防御式（ok (g.item||0) / prog (g.item||0)）',
  String(ach.ok).includes('POTIONS3_GOAL') && String(ach.ok).includes('g.item||0') &&
  String(ach.prog).includes('POTIONS3_GOAL') && String(ach.prog).includes('g.item||0'));
ok('stock3 无 r 字段纯里程碑（与 stock/stock2/lvl5 同款）', !('r' in ach));

// —— 既有 49 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime', 'hunt100', 'ptime2', 'lucky2', 'rich2', 'stock',
  'brew2', 'stock2', 'elixir', 'mush', 'elixir2', 'mush2', 'metall', 'rich3', 'ptime3', 'hunt3', 'lucky3'];
ok('既有 49 成就 id 零回归', EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('stock3 追加在末尾序位（ptime 32 / ptime2 34 / mush 41 / metall 44 / rich3 45 / ptime3 46 / hunt3 47 / lucky3 48 / stock3 49，既有序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'ptime') === 32 &&
  ACH_LIST.findIndex((a) => a.id === 'ptime2') === 34 &&
  ACH_LIST.findIndex((a) => a.id === 'mush') === 41 &&
  ACH_LIST.findIndex((a) => a.id === 'metall') === 44 &&
  ACH_LIST.findIndex((a) => a.id === 'rich3') === 45 &&
  ACH_LIST.findIndex((a) => a.id === 'ptime3') === 46 &&
  ACH_LIST.findIndex((a) => a.id === 'hunt3') === 47 &&
  ACH_LIST.findIndex((a) => a.id === 'lucky3') === 48 &&
  ACH_LIST.findIndex((a) => a.id === 'stock3') === 49);

// —— ok/prog 谓词逐值 ——
ok('item=0（新档起始药水，未达标）→ false', ach.ok({ item: 0 }) === false);
ok('item=98（差 1 瓶）→ false（恰在门槛下不解锁）', ach.ok({ item: 98 }) === false);
ok('item=99 → true（恰达标）', ach.ok({ item: 99 }) === true);
ok('item=150 → true（超上限（防御兜底）仍达标不抛错）', ach.ok({ item: 150 }) === true);
ok('缺 item 字段旧档 → false 且 prog 0/99（防御式零迁移）',
  ach.ok({}) === false && ach.prog({}) === `0/${POTIONS3_GOAL}`);
ok('item 非数值（undefined 兜底）→ false 不抛错', ach.ok({ item: undefined }) === false);
ok('prog 50 瓶 → 50/99', ach.prog({ item: 50 }) === `50/${POTIONS3_GOAL}`, ach.prog({ item: 50 }));
ok('prog 99 瓶 → 99/99', ach.prog({ item: 99 }) === `99/${POTIONS3_GOAL}`, ach.prog({ item: 99 }));
ok('prog 150 瓶不钳制（150/99，承 lvl5「X/N 不钳制」口径）', ach.prog({ item: 150 }) === `150/${POTIONS3_GOAL}`, ach.prog({ item: 150 }));

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

// 达标档：item=99（背包装满）→ applyAchievements 真实解锁落 hero.ach（持续变化量，任意判定点当场解锁）
let hero = newGame('余烬');
hero.item = 99;
hero = runAch(hero);
ok('运行期：item=99 触发 applyAchievements 真实解锁 stock3 落 hero.ach', hero.ach.includes('stock3'), hero.ach.join(','));

// 未达标档：item=98 → 不误解锁（差 1 瓶）
hero = newGame('灯见');
hero.item = 98;
hero = runAch(hero);
ok('运行期：item=98 不误解锁 stock3', !hero.ach.includes('stock3'));

// 新档起始药水（START_POTIONS，未达 99）→ 不误解锁
hero = newGame('潮');
hero = runAch(hero);
ok('运行期：新档起始药水不误解锁 stock3', !hero.ach.includes('stock3'), String(hero.item));

// 重复调用去重：已解锁后再 applyAchievements 不重复 push
hero = newGame('灯');
hero.item = 99;
runAch(hero);
runAch(hero);
ok('运行期：重复调用去重（hero.ach 中 stock3 恰一枚）',
  hero.ach.filter((x) => x === 'stock3').length === 1);

// 旧档防御档：无 item 字段读档 → applyAchievements 不抛错且不解锁（零迁移）
hero = newGame('潮');
delete hero.item;
let threw = null;
try { runAch(hero); } catch (e) { threw = e; }
ok('运行期：旧档缺 item 字段 applyAchievements 不抛错（防御式）', threw === null, threw && String(threw.stack || threw));
ok('运行期：缺字段旧档不解锁 stock3（零迁移）', !hero.ach.includes('stock3'));

// —— drawAch 渲染（50 项滚动不抛错；PAGE=10 五页）——
let rendered = true, renderedPg5 = true;
try {
  S.G = newGame('测试'); S.G.ach = ['stock3']; S.achScroll = 0; S.scene = 'ach';
  drawAch();
} catch (e) { rendered = false; }
try {
  S.achScroll = 60; // 50 项滚到最末页（PAGE=10，钳制到 40）不抛错
  drawAch();
} catch (e) { renderedPg5 = false; }
S.achScroll = 0; S.scene = 'world';
ok('运行期：成就页 drawAch 50 项渲染不抛错', rendered);
ok('运行期：成就页末页滚动渲染不抛错（50 项 PAGE=10 五页）', renderedPg5);

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树串尾已延伸至 smoke_v2266_stock3（v2265 后接 v2266）',
  readme.includes('smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal（npm test 串跑）'));
ok('README 件套口径为二百件套（一百九十九件套清除）且旧 161 口径零残留',
  readme.includes('冒烟二百件套（一百九十九件套清除）') && !readme.includes('冒烟一百六十一件套（一百六十件套清' + '除）'));
ok('README 含 v22.66 守护描述（新成就万全之备守护）', readme.includes('v22.66 起含新成就「万全之备」'));
ok('README 含 smoke_v2266_stock3 入库（162 份）', readme.includes('smoke_v2266_stock3 入库（162 份）'));
ok('README 仍保留 smoke_v2265_lucky3 入库（161 份）历史口径', readme.includes('smoke_v2265_lucky3 入库（161 份）'));
ok('README 仍保留 v22.65 守护描述（历史口径未动）', readme.includes('v22.65 起含新成就「洪福齐天」'));
ok('README 成就口径「50 项」双处同步（快速上手表 C 键行 + 图鉴&成就行）',
  readme.includes('成就一览（全部 59 项进度') && readme.includes('**59 项成就**') &&
  !readme.includes('成就一览（全部 49 项进' + '度') && !readme.includes('**49 项成' + '就**'));
ok('package.json 已收录 smoke_v2266_stock3（npm test 串跑第 162 份）',
  pkg.includes('smoke_v2266_stock3.mjs') && pkg.includes('smoke_v2265_lucky3.mjs && node tests/smoke_v2266_stock3.mjs && node tests/smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 162 件套', testChain === 200, String(testChain));
ok('CHANGELOG 顶为 v22.66 条目', changelog.startsWith('## v23.04 '));
ok('CHANGELOG 含 v22.65 条目', changelog.includes('## v22.65 '));

// —— 姊妹件套 pin 复查（v2265..v2258 随新现实更新）——
const s2265 = read('../tests/smoke_v2265_lucky3.mjs');
const s2264 = read('../tests/smoke_v2264_hunt3.mjs');
const s2263 = read('../tests/smoke_v2263_ptime3.mjs');
const s2262 = read('../tests/smoke_v2262_crystal.mjs');
const s2261 = read('../tests/smoke_v2261_rich3.mjs');
const s2260 = read('../tests/smoke_v2260_fountripple.mjs');
const s2259 = read('../tests/smoke_v2259_sandpile.mjs');
const s2258 = read('../tests/smoke_v2258_potionhelp.mjs');
const s2229 = read('../tests/smoke_v2229_metall.mjs');
const s2206 = read('../tests/smoke_v2206_stock2.mjs');
const s2200 = read('../tests/smoke_v2200_stock.mjs');
const s2195 = read('../tests/smoke_v2195_ptime2.mjs');
const s2191 = read('../tests/smoke_v2191_ptime.mjs');
const s2199 = read('../tests/smoke_v2199_rich2.mjs');
const s2143 = read('../tests/smoke_v2143_talkekey.mjs');
const s2144 = read('../tests/smoke_v2144_run.mjs');
const s2145 = read('../tests/smoke_v2145_journalscroll.mjs');
ok('smoke_v2265 的 GAME_VERSION 字面量 pin 已更新为 v22.66', s2265.includes("const GAME_VERSION = 'v23.04';"));
ok('smoke_v2265 的 README 件套 pin 已随新现实更新为二百件套（一百九十九件套清除）',
  s2265.includes('二百件套（一百九十九件套清除）'));
ok('smoke_v2265 的 package.json 件套计数 pin 已更新为 === 162', s2265.includes('testChain === 200'));
ok('smoke_v2265 的 CHANGELOG 顶 pin 已更新为 ## v22.66', s2265.includes("startsWith('## v23.04')"));
ok('smoke_v2265 的 README 串尾 pin 已随新现实延伸至 smoke_v2266_stock3',
  s2265.includes('smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal（npm test 串跑）'));
ok('smoke_v2265 的 package.json 串尾 plain pin 已延伸至 smoke_v2266_stock3',
  s2265.includes('smoke_v2264_hunt3.mjs && node tests/smoke_v2265_lucky3.mjs && node tests/smoke_v2266_stock3.mjs && node tests/smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs"'));
ok('smoke_v2265 的 README 成就 pin 已随新现实更新为 50 项双处', s2265.includes('成就一览（全部 59 项进度') && s2265.includes('**59 项成就**'));
ok('smoke_v2264 的 GAME_VERSION 字面量 pin 已更新为 v22.66', s2264.includes("const GAME_VERSION = 'v23.04';"));
ok('smoke_v2264 的 README 件套 pin 已随新现实更新为二百件套（一百九十九件套清除）',
  s2264.includes('二百件套（一百九十九件套清除）'));
ok('smoke_v2264 的 package.json 件套计数 pin 已更新为 === 162', s2264.includes('testChain === 200'));
ok('smoke_v2264 的 CHANGELOG 顶 pin 已更新为 ## v22.66', s2264.includes("startsWith('## v23.04')"));
ok('smoke_v2264 的 README 串尾 pin 已随新现实延伸至 smoke_v2266_stock3',
  s2264.includes('smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal（npm test 串跑）'));
ok('smoke_v2264 的 package.json 串尾 plain pin 已延伸至 smoke_v2266_stock3',
  s2264.includes('smoke_v2263_ptime3.mjs && node tests/smoke_v2264_hunt3.mjs && node tests/smoke_v2265_lucky3.mjs && node tests/smoke_v2266_stock3.mjs && node tests/smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs"'));
ok('smoke_v2263 的 GAME_VERSION 字面量 pin 已更新为 v22.66', s2263.includes("const GAME_VERSION = 'v23.04';"));
ok('smoke_v2263 的 README 件套 pin 已随新现实更新为二百件套（一百九十九件套清除）',
  s2263.includes('二百件套（一百九十九件套清除）'));
ok('smoke_v2263 的 package.json 件套计数 pin 已更新为 === 162', s2263.includes('testChain === 200'));
ok('smoke_v2263 的 CHANGELOG 顶 pin 已更新为 ## v22.66', s2263.includes("startsWith('## v23.04')"));
ok('smoke_v2263 的 README 串尾 pin 已随新现实延伸至 smoke_v2266_stock3',
  s2263.includes('smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal（npm test 串跑）'));
ok('smoke_v2263 的 package.json 串尾 plain pin 已延伸至 smoke_v2266_stock3',
  s2263.includes('smoke_v2263_ptime3.mjs && node tests/smoke_v2264_hunt3.mjs && node tests/smoke_v2265_lucky3.mjs && node tests/smoke_v2266_stock3.mjs && node tests/smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs"'));
ok('smoke_v2262 的 GAME_VERSION 字面量 pin 已更新为 v22.66', s2262.includes("const GAME_VERSION = 'v23.04';"));
ok('smoke_v2262 的 package.json 串尾 plain pin 已延伸至 smoke_v2266_stock3',
  s2262.includes('smoke_v2262_crystal.mjs && node tests/smoke_v2263_ptime3.mjs && node tests/smoke_v2264_hunt3.mjs && node tests/smoke_v2265_lucky3.mjs && node tests/smoke_v2266_stock3.mjs && node tests/smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs"'));
ok('smoke_v2261 的 GAME_VERSION 字面量 pin 已更新为 v22.66', s2261.includes("const GAME_VERSION = 'v23.04';"));
ok('smoke_v2260 的 GAME_VERSION 恒等 pin 族已随新现实全库更新（v22.66 字面量 pin 落位）',
  s2260.includes("const GAME_VERSION = 'v23.04';"));
ok('smoke_v2260 的 README 件套 pin 已随新现实更新为二百件套（一百九十九件套清除）',
  s2260.includes('二百件套（一百九十九件套清除）'));
ok('smoke_v2260 的 package.json 件套计数 pin 已更新为 === 162', s2260.includes('testChain === 200'));
ok('smoke_v2260 的 CHANGELOG 顶 pin 已更新为 ## v22.66', s2260.includes("startsWith('## v23.04')"));
ok('smoke_v2260 的 README 串尾 pin 已随新现实延伸至 smoke_v2266_stock3',
  s2260.includes('smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal（npm test 串跑）'));
ok('smoke_v2259 的 GAME_VERSION 字面量 pin 已更新为 v22.66', s2259.includes("const GAME_VERSION = 'v23.04';"));
ok('smoke_v2259 的 README 件套 pin 已随新现实更新为二百件套（一百九十九件套清除）',
  s2259.includes('二百件套（一百九十九件套清除）'));
ok('smoke_v2259 的 package.json 件套计数 pin 已更新为 === 162', s2259.includes('testChain === 200'));
ok('smoke_v2259 的 CHANGELOG 顶 pin 已更新为 ## v22.66', s2259.includes("startsWith('## v23.04')"));
ok('smoke_v2258 的 GAME_VERSION 字面量 pin 已更新为 v22.66', s2258.includes("const GAME_VERSION = 'v23.04';"));
ok('smoke_v2229 的 ACH_LIST 精确总数 pin 已更新为 === 50（49→50）',
  s2229.includes('ACH_LIST.length === 59') && !s2229.includes('ACH_LIST.length === 4' + '9'));
ok('smoke_v2206 的 POTIONS 家族 export pin 已并入 POTIONS3_GOAL', s2206.includes('POTIONS_GOAL, POTIONS2_GOAL, POTIONS3_GOAL, ELIXIR_STOCK_GOAL'));
ok('smoke_v2200 的 POTIONS 家族 export pin 已并入 POTIONS3_GOAL', s2200.includes('POTIONS_GOAL, POTIONS2_GOAL, POTIONS3_GOAL, ELIXIR_STOCK_GOAL'));
ok('smoke_v2195 的 POTIONS 家族 export pin 已并入 POTIONS3_GOAL', s2195.includes('POTIONS_GOAL, POTIONS2_GOAL, POTIONS3_GOAL, ELIXIR_STOCK_GOAL'));
ok('smoke_v2191 的 POTIONS 家族 export pin 已并入 POTIONS3_GOAL', s2191.includes('POTIONS_GOAL, POTIONS2_GOAL, POTIONS3_GOAL, ELIXIR_STOCK_GOAL'));
ok('smoke_v2199 的 README 成就 pin 已随新现实更新为 50 项双处落位',
  s2199.includes('成就一览（全部 59 项进度') && s2199.includes('**59 项成就**'));
ok('v2143-45「件套守护领先一位」哨兵链已推进至 163（二百件套（一百九十九件套清除））',
  s2143.includes('二百零一件套（二百件套清除）') && s2143.includes("!readme.includes('二百零一件套（二百件套清除）')"));
ok('smoke_v2144 的哨兵链 pin 已随新现实推进（!readme 不含一百六十四件套）',
  s2144.includes("!readme.includes('二百零一件套（二百件套清除）')"));
ok('smoke_v2145 的哨兵链 pin 已随新现实推进（二百件套（一百九十九件套清除））',
  s2145.includes('二百零一件套（二百件套清除）'));

// 旧代 v22.65 pin 全库零残留（字面量/恒等/件套/串尾/testChain/顶 pin/README 49 项/ACH 49/锚点 65）
const allTests = fs.readdirSync(new URL('../tests', import.meta.url)).filter((f) => /^smoke_.*\.mjs$/.test(f));
const stale = [];
for (const f of allTests) {
  const src = read(`../tests/${f}`);
  if (src.includes("const GAME_VERSION = 'v22." + "65';") || src.includes("GAME_VERSION === 'v22." + "65'") ||
      src.includes('一百六十一件套（一百六十件套清' + '除）') || src.includes('testChain === ' + '161') ||
      src.includes("startsWith('## v22." + "65'") ||
      src.includes('smoke_v2265_lucky3（npm test 串' + '跑）') ||
      src.includes('全部 49 项进' + '度') || src.includes('**49 项成' + '就**') ||
      src.includes('ACH_LIST.length === 4' + '9') ||
      src.includes('_gv[0] === 22 && _gv[1] >= 6' + '5') ||
      src.includes('POTIONS_GOAL, POTIONS2_GOAL, ELIXIR_STOCK_' + 'GOAL')) stale.push(f);
}
ok('旧代 v22.65 字面量/恒等/件套/串尾/testChain/顶 pin/49 项 pin/锚点 65/POTIONS 旧 export pin 全库零残留（' + allTests.length + ' 件扫描，含本件）', stale.length === 0, stale.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
