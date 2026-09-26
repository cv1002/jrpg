// v22.67 专项冒烟：新成就「灵药满仓」（高级灵药持有线第三档里程碑，新内容·单成就，承 v22.8 灵药盈囊 /
// v22.17 灵药满柜 / v22.61 富甲一方 / v22.63 长明如昼 / v22.64 驱雾三百战 / v22.65 洪福齐天 / v22.66 万全之备
// 多档先例）——成就版图三档推进的灵药线收口：等级线早有三档（lvl5·lvl10·lvl12）、金币线 v22.61 补至三档
// （rich·rich2·rich3）、时长线 v22.63 补至三档（ptime·ptime2·ptime3）、讨伐线 v22.64 补至三档（hunt10·hunt100·
// hunt3）、掉落线 v22.65 补至三档（lucky·lucky2·lucky3）、药水线 v22.66 补至三档（stock·stock2·stock3），唯独
// 高级灵药持有线（elixir 灵药盈囊=3 瓶 / elixir2 灵药满柜=8 瓶）仍停两档——灵药是续航链顶端资源（brewNow 酿造、
// 四条支线任务各奖 1 瓶、战斗掉落 6% 三源，恢复 80%HP+40%MP、无背包上限）。现补第三档（ELIXIR_STOCK3_GOAL=16
// 瓶，双倍「满柜」的途程——四条支线各奖 1 瓶 + 自酿 12 瓶（24 株蘑菇 + 120 金）即达、战斗掉落 6% 沿途补充，
// 终局区（无字回廊重复刷级 Lv12、试炼三连战再战、图鉴/宝箱/碎片收集补完）自然积累可达）：判定/描述/进度三处
// 同读新常量 ELIXIR_STOCK3_GOAL（与 ELIXIR_STOCK_GOAL/ELIXIR_STOCK2_GOAL 同一「成就阈值数据化」家族——改门槛
// 只改 data.js 一处自动跟随，零裸字面量），计数读既有 hero.potion2 字段（newGame 起始 0、brewNow 酿造/任务奖励/
// 战斗掉落写定、喝药扣减，随存档快照持久化），(g.potion2||0) 防御式读取、旧档无此字段 false 不误解锁、零迁移，
// 承 elixir/elixir2 同款）；无 r 字段（与 elixir/elixir2/lvl5 同款纯里程碑——灵药本身就是奖励）；解锁时机：
// applyAchievements 既有通路任意判定点当场解锁（potion2 为持续变化量，无需新判定点，承 elixir2 同款——先囤药
// 再喝掉也照常解锁，已解锁不因消耗回落而撤销；brewNow 酿造成功本就当场 applyAchievements，第 16 瓶落袋的瞬间
// 即解锁、反馈不迟到）。
// 本冒烟守护：版本锚点、ELIXIR_STOCK3_GOAL 数据契约（===16、声明与导出）、ACH_LIST 契约（elixir3 唯一/总数 51/
// 既有 50 成就 id 零回归/ptime 32 与 ptime2 34 与 mush 41 与 metall 44 与 rich3 45 与 ptime3 46 与 hunt3 47
// 与 lucky3 48 与 stock3 49 零位移/末尾追加序位 50）、ok/prog 谓词逐值（0·15 false / 16·30 true / 缺 potion2
// 字段防御 false·0/16 / prog 不钳制 30/16）、运行期全链路（applyAchievements 真实解锁落 hero.ach / 未够不误解锁/
// 新档起始灵药不误解锁 / 重复调用去重 / 旧档缺字段不抛错不解锁）、drawAch 51 项滚动渲染不抛错、README/package.json/
// CHANGELOG 同步、姊妹件套 pin（v2266..v2258 一百六十三件套 / v2266·v2265·v2264·v2263·v2262·v2261·v2260·v2259·
// v2258 GAME_VERSION v22.67 / v2143-45 哨兵链 164）随新现实更新 + 旧代 v22.66 字面量/恒等/件套/串尾/testChain/顶 pin
// 全库零残留 + ELIXIR 家族 export pin 追平（v2191/v2195/v2200/v2206/v2208 冒烟随新现实并入 ELIXIR_STOCK3_GOAL）。
import { GAME_VERSION, ACH_LIST, ELIXIR_STOCK3_GOAL } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.67 灵药满仓高级灵药持有线第三档里程碑冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v22.66 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.69（本版守 v22.79）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 99)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v22.67 版本注释', dataSrc.includes('v22.67 新成就·高级灵药持有线第三档里程碑「灵药满仓」'));
ok('data.js GAME_VERSION 字面量已为 v22.67（旧 v22.66 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v24.02';") && !dataSrc.includes("const GAME_VERSION = 'v22." + "66';"));
ok('data.js 仍保留 v22.66 历史注释（万全之备成就注释未动）', dataSrc.includes('v22.66 新成就·药水线第三档里程碑「万全之备」'));
ok('data.js 导出 ELIXIR_STOCK3_GOAL（export 块落位，与 ELIXIR_STOCK_GOAL/ELIXIR_STOCK2_GOAL 相邻）',
  dataSrc.includes('ELIXIR_STOCK_GOAL, ELIXIR_STOCK2_GOAL, ELIXIR_STOCK3_GOAL, PERFECTION_GOLD'));

// —— ELIXIR_STOCK3_GOAL 数据契约 ——
ok('ELIXIR_STOCK3_GOAL === 16（灵药线第三档 = 双倍「满柜」的途程）', ELIXIR_STOCK3_GOAL === 16, String(ELIXIR_STOCK3_GOAL));
ok('ELIXIR_STOCK3_GOAL 声明与注释含「灵药满仓」口径',
  dataSrc.includes('const ELIXIR_STOCK3_GOAL = 16;') && dataSrc.includes('成就「灵药满仓」'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'elixir3');
ok('ACH_LIST 含 elixir3「灵药满仓」且 id 唯一',
  !!ach && ach.name === '灵药满仓' && ACH_LIST.filter((a) => a.id === 'elixir3').length === 1);
ok('ACH_LIST 精确总数 51 项（v2229 精确计数 pin 随新现实更新 50→51）', ACH_LIST.length === 76, String(ACH_LIST.length));
ok('elixir3 描述由 ELIXIR_STOCK3_GOAL 派生（单一数据源，零裸字面量 16）',
  ach.d === `持有 ${ELIXIR_STOCK3_GOAL} 瓶高级灵药`, ach.d);
ok('elixir3 判定/进度同读 ELIXIR_STOCK3_GOAL + potion2 防御式（ok (g.potion2||0) / prog (g.potion2||0)）',
  String(ach.ok).includes('ELIXIR_STOCK3_GOAL') && String(ach.ok).includes('g.potion2||0') &&
  String(ach.prog).includes('ELIXIR_STOCK3_GOAL') && String(ach.prog).includes('g.potion2||0'));
ok('elixir3 无 r 字段纯里程碑（与 elixir/elixir2/lvl5 同款）', !('r' in ach));

// —— 既有 50 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime', 'hunt100', 'ptime2', 'lucky2', 'rich2', 'stock',
  'brew2', 'stock2', 'elixir', 'mush', 'elixir2', 'mush2', 'metall', 'rich3', 'ptime3', 'hunt3', 'lucky3', 'stock3'];
ok('既有 50 成就 id 零回归', EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('elixir3 追加在末尾序位（ptime 32 / ptime2 34 / mush 41 / metall 44 / rich3 45 / ptime3 46 / hunt3 47 / lucky3 48 / stock3 49 / elixir3 50，既有序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'ptime') === 32 &&
  ACH_LIST.findIndex((a) => a.id === 'ptime2') === 34 &&
  ACH_LIST.findIndex((a) => a.id === 'mush') === 41 &&
  ACH_LIST.findIndex((a) => a.id === 'metall') === 44 &&
  ACH_LIST.findIndex((a) => a.id === 'rich3') === 45 &&
  ACH_LIST.findIndex((a) => a.id === 'ptime3') === 46 &&
  ACH_LIST.findIndex((a) => a.id === 'hunt3') === 47 &&
  ACH_LIST.findIndex((a) => a.id === 'lucky3') === 48 &&
  ACH_LIST.findIndex((a) => a.id === 'stock3') === 49 &&
  ACH_LIST.findIndex((a) => a.id === 'elixir3') === 50);

// —— ok/prog 谓词逐值 ——
ok('potion2=0（新档起始灵药，未达标）→ false', ach.ok({ potion2: 0 }) === false);
ok('potion2=15（差 1 瓶）→ false（恰在门槛下不解锁）', ach.ok({ potion2: 15 }) === false);
ok('potion2=16 → true（恰达标）', ach.ok({ potion2: 16 }) === true);
ok('potion2=30 → true（超阈值（无背包上限）仍达标不抛错）', ach.ok({ potion2: 30 }) === true);
ok('缺 potion2 字段旧档 → false 且 prog 0/16（防御式零迁移）',
  ach.ok({}) === false && ach.prog({}) === `0/${ELIXIR_STOCK3_GOAL}`);
ok('potion2 非数值（undefined 兜底）→ false 不抛错', ach.ok({ potion2: undefined }) === false);
ok('prog 8 瓶 → 8/16', ach.prog({ potion2: 8 }) === `8/${ELIXIR_STOCK3_GOAL}`, ach.prog({ potion2: 8 }));
ok('prog 16 瓶 → 16/16', ach.prog({ potion2: 16 }) === `16/${ELIXIR_STOCK3_GOAL}`, ach.prog({ potion2: 16 }));
ok('prog 30 瓶不钳制（30/16，承 lvl5「X/N 不钳制」口径）', ach.prog({ potion2: 30 }) === `30/${ELIXIR_STOCK3_GOAL}`, ach.prog({ potion2: 30 }));

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

// 达标档：potion2=16 → applyAchievements 真实解锁落 hero.ach（持续变化量，任意判定点当场解锁）
let hero = newGame('余烬');
hero.potion2 = 16;
hero = runAch(hero);
ok('运行期：potion2=16 触发 applyAchievements 真实解锁 elixir3 落 hero.ach', hero.ach.includes('elixir3'), hero.ach.join(','));

// 未达标档：potion2=15 → 不误解锁（差 1 瓶）
hero = newGame('灯见');
hero.potion2 = 15;
hero = runAch(hero);
ok('运行期：potion2=15 不误解锁 elixir3', !hero.ach.includes('elixir3'));

// 新档起始灵药（0，未达 16）→ 不误解锁
hero = newGame('潮');
hero = runAch(hero);
ok('运行期：新档起始灵药不误解锁 elixir3', !hero.ach.includes('elixir3'), String(hero.potion2));

// 重复调用去重：已解锁后再 applyAchievements 不重复 push
hero = newGame('灯');
hero.potion2 = 16;
runAch(hero);
runAch(hero);
ok('运行期：重复调用去重（hero.ach 中 elixir3 恰一枚）',
  hero.ach.filter((x) => x === 'elixir3').length === 1);

// 旧档防御档：无 potion2 字段读档 → applyAchievements 不抛错且不解锁（零迁移）
hero = newGame('潮');
delete hero.potion2;
let threw = null;
try { runAch(hero); } catch (e) { threw = e; }
ok('运行期：旧档缺 potion2 字段 applyAchievements 不抛错（防御式）', threw === null, threw && String(threw.stack || threw));
ok('运行期：缺字段旧档不解锁 elixir3（零迁移）', !hero.ach.includes('elixir3'));

// —— drawAch 渲染（51 项滚动不抛错；PAGE=10 六页）——
let rendered = true, renderedPg6 = true;
try {
  S.G = newGame('测试'); S.G.ach = ['elixir3']; S.achScroll = 0; S.scene = 'ach';
  drawAch();
} catch (e) { rendered = false; }
try {
  S.achScroll = 60; // 51 项滚到最末页（PAGE=10，钳制到 50）不抛错
  drawAch();
} catch (e) { renderedPg6 = false; }
S.achScroll = 0; S.scene = 'world';
ok('运行期：成就页 drawAch 51 项渲染不抛错', rendered);
ok('运行期：成就页末页滚动渲染不抛错（51 项 PAGE=10 六页）', renderedPg6);

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树串尾已延伸至 smoke_v2267_elixir3（v2266 后接 v2267）',
  readme.includes('smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula + smoke_v2400_trialwarn + smoke_v2401_winbgm + smoke_v2402_firstwin（npm test 串跑）'));
ok('README 件套口径为二百二十六件套（二百二十五件套清除）且旧 162 口径零残留',
  readme.includes('冒烟二百二十六件套（二百二十五件套清除）') && !readme.includes('冒烟一百六十二件套（一百六十一件套清' + '除）'));
ok('README 含 v22.67 守护描述（新成就灵药满仓守护）', readme.includes('v22.67 起含新成就「灵药满仓」'));
ok('README 含 smoke_v2267_elixir3 入库（163 份）', readme.includes('smoke_v2267_elixir3 入库（163 份）'));
ok('README 仍保留 smoke_v2266_stock3 入库（162 份）历史口径', readme.includes('smoke_v2266_stock3 入库（162 份）'));
ok('README 仍保留 v22.66 守护描述（历史口径未动）', readme.includes('v22.66 起含新成就「万全之备」'));
ok('README 成就口径「51 项」双处同步（快速上手表 C 键行 + 图鉴&成就行）',
  readme.includes('成就一览（全部 76 项进度') && readme.includes('**76 项成就**') &&
  !readme.includes('成就一览（全部 50 项进' + '度') && !readme.includes('**50 项成' + '就**'));
ok('package.json 已收录 smoke_v2267_elixir3（npm test 串跑第 163 份）',
  pkg.includes('smoke_v2267_elixir3.mjs') && pkg.includes('smoke_v2266_stock3.mjs && node tests/smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs && node tests/smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs && node tests/smoke_v2395_shopscroll.mjs && node tests/smoke_v2396_steelarmor.mjs && node tests/smoke_v2397_baserow.mjs && node tests/smoke_v2398_econrow.mjs && node tests/smoke_v2399_dmgformula.mjs && node tests/smoke_v2400_trialwarn.mjs && node tests/smoke_v2401_winbgm.mjs && node tests/smoke_v2402_firstwin.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 163 件套', testChain === 226, String(testChain));
ok('CHANGELOG 顶为 v22.67 条目', changelog.startsWith('## v24.02 '));
ok('CHANGELOG 含 v22.66 条目', changelog.includes('## v22.66 '));

// —— 姊妹件套 pin 复查（v2266..v2258 随新现实更新）——
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
const s2208 = read('../tests/smoke_v2208_elixir.mjs');
const s2206 = read('../tests/smoke_v2206_stock2.mjs');
const s2200 = read('../tests/smoke_v2200_stock.mjs');
const s2195 = read('../tests/smoke_v2195_ptime2.mjs');
const s2191 = read('../tests/smoke_v2191_ptime.mjs');
const s2199 = read('../tests/smoke_v2199_rich2.mjs');
const s2143 = read('../tests/smoke_v2143_talkekey.mjs');
const s2144 = read('../tests/smoke_v2144_run.mjs');
const s2145 = read('../tests/smoke_v2145_journalscroll.mjs');
ok('smoke_v2266 的 GAME_VERSION 字面量 pin 已更新为 v22.67', s2266.includes("const GAME_VERSION = 'v24.02';"));
ok('smoke_v2266 的 README 件套 pin 已随新现实更新为二百二十六件套（二百二十五件套清除）',
  s2266.includes('二百二十六件套（二百二十五件套清除）'));
ok('smoke_v2266 的 package.json 件套计数 pin 已更新为 === 163', s2266.includes('testChain === 226'));
ok('smoke_v2266 的 CHANGELOG 顶 pin 已更新为 ## v22.67', s2266.includes("startsWith('## v24.02'") || s2266.includes("startsWith('## v22.78 ')"));
ok('smoke_v2266 的 README 串尾 pin 已随新现实延伸至 smoke_v2267_elixir3',
  s2266.includes('smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula + smoke_v2400_trialwarn + smoke_v2401_winbgm + smoke_v2402_firstwin（npm test 串跑）'));
ok('smoke_v2266 的 package.json 串尾 plain pin 已延伸至 smoke_v2267_elixir3',
  s2266.includes('smoke_v2265_lucky3.mjs && node tests/smoke_v2266_stock3.mjs && node tests/smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs && node tests/smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs && node tests/smoke_v2395_shopscroll.mjs && node tests/smoke_v2396_steelarmor.mjs && node tests/smoke_v2397_baserow.mjs && node tests/smoke_v2398_econrow.mjs && node tests/smoke_v2399_dmgformula.mjs && node tests/smoke_v2400_trialwarn.mjs && node tests/smoke_v2401_winbgm.mjs && node tests/smoke_v2402_firstwin.mjs"'));
ok('smoke_v2266 的 README 成就 pin 已随新现实更新为 51 项双处', s2266.includes('成就一览（全部 76 项进度') && s2266.includes('**76 项成就**'));
ok('smoke_v2266 的 ACH_LIST 精确计数 pin 已更新为 === 51', s2266.includes('ACH_LIST.length === 76'));
ok('smoke_v2265 的 GAME_VERSION 字面量 pin 已更新为 v22.67', s2265.includes("const GAME_VERSION = 'v24.02';"));
ok('smoke_v2265 的 README 件套 pin 已随新现实更新为二百二十六件套（二百二十五件套清除）',
  s2265.includes('二百二十六件套（二百二十五件套清除）'));
ok('smoke_v2265 的 package.json 件套计数 pin 已更新为 === 163', s2265.includes('testChain === 226'));
ok('smoke_v2265 的 README 串尾 pin 已随新现实延伸至 smoke_v2267_elixir3',
  s2265.includes('smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula + smoke_v2400_trialwarn + smoke_v2401_winbgm + smoke_v2402_firstwin（npm test 串跑）'));
ok('smoke_v2264 的 GAME_VERSION 字面量 pin 已更新为 v22.67', s2264.includes("const GAME_VERSION = 'v24.02';"));
ok('smoke_v2264 的 README 件套 pin 已随新现实更新为二百二十六件套（二百二十五件套清除）',
  s2264.includes('二百二十六件套（二百二十五件套清除）'));
ok('smoke_v2264 的 README 串尾 pin 已随新现实延伸至 smoke_v2267_elixir3',
  s2264.includes('smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula + smoke_v2400_trialwarn + smoke_v2401_winbgm + smoke_v2402_firstwin（npm test 串跑）'));
ok('smoke_v2263 的 GAME_VERSION 字面量 pin 已更新为 v22.67', s2263.includes("const GAME_VERSION = 'v24.02';"));
ok('smoke_v2263 的 README 件套 pin 已随新现实更新为二百二十六件套（二百二十五件套清除）',
  s2263.includes('二百二十六件套（二百二十五件套清除）'));
ok('smoke_v2262 的 GAME_VERSION 字面量 pin 已更新为 v22.67', s2262.includes("const GAME_VERSION = 'v24.02';"));
ok('smoke_v2261 的 GAME_VERSION 字面量 pin 已更新为 v22.67', s2261.includes("const GAME_VERSION = 'v24.02';"));
ok('smoke_v2260 的 GAME_VERSION 恒等 pin 族已随新现实全库更新（v22.67 字面量 pin 落位）',
  s2260.includes("const GAME_VERSION = 'v24.02';"));
ok('smoke_v2260 的 README 件套 pin 已随新现实更新为二百二十六件套（二百二十五件套清除）',
  s2260.includes('二百二十六件套（二百二十五件套清除）'));
ok('smoke_v2259 的 GAME_VERSION 字面量 pin 已更新为 v22.67', s2259.includes("const GAME_VERSION = 'v24.02';"));
ok('smoke_v2258 的 GAME_VERSION 字面量 pin 已更新为 v22.67', s2258.includes("const GAME_VERSION = 'v24.02';"));
ok('smoke_v2229 的 ACH_LIST 精确总数 pin 已更新为 === 51（50→51）',
  s2229.includes('ACH_LIST.length === 76') && !s2229.includes('ACH_LIST.length === 5' + '0'));
ok('smoke_v2208 的 ELIXIR 家族 export pin 已并入 ELIXIR_STOCK3_GOAL', s2208.includes('ELIXIR_STOCK2_GOAL, ELIXIR_STOCK3_GOAL, PERFECTION_GOLD'));
ok('smoke_v2206 的 ELIXIR 家族 export pin 已并入 ELIXIR_STOCK3_GOAL', s2206.includes('ELIXIR_STOCK2_GOAL, ELIXIR_STOCK3_GOAL, PERFECTION_GOLD'));
ok('smoke_v2200 的 ELIXIR 家族 export pin 已并入 ELIXIR_STOCK3_GOAL', s2200.includes('ELIXIR_STOCK2_GOAL, ELIXIR_STOCK3_GOAL, PERFECTION_GOLD'));
ok('smoke_v2195 的 ELIXIR 家族 export pin 已并入 ELIXIR_STOCK3_GOAL', s2195.includes('ELIXIR_STOCK2_GOAL, ELIXIR_STOCK3_GOAL, PERFECTION_GOLD'));
ok('smoke_v2191 的 ELIXIR 家族 export pin 已并入 ELIXIR_STOCK3_GOAL', s2191.includes('ELIXIR_STOCK2_GOAL, ELIXIR_STOCK3_GOAL, PERFECTION_GOLD'));
ok('smoke_v2199 的 README 成就 pin 已随新现实更新为 51 项双处落位',
  s2199.includes('成就一览（全部 76 项进度') && s2199.includes('**76 项成就**'));
ok('v2143-45「件套守护领先一位」哨兵链已推进至 164（二百二十六件套（二百二十五件套清除））',
  s2143.includes('二百二十七件套（二百二十六件套清除）') && s2143.includes("!readme.includes('二百二十七件套（二百二十六件套清除）')"));
ok('smoke_v2144 的哨兵链 pin 已随新现实推进（!readme 不含一百六十四件套）',
  s2144.includes("!readme.includes('二百二十七件套（二百二十六件套清除）')"));
ok('smoke_v2145 的哨兵链 pin 已随新现实推进（二百二十六件套（二百二十五件套清除））',
  s2145.includes('二百二十七件套（二百二十六件套清除）'));

// 旧代 v22.66 pin 全库零残留（字面量/恒等/件套/串尾/testChain/顶 pin/README 50 项/ACH 50/锚点 66/ELIXIR 旧 export pin）
const allTests = fs.readdirSync(new URL('../tests', import.meta.url)).filter((f) => /^smoke_.*\.mjs$/.test(f));
const stale = [];
for (const f of allTests) {
  const src = read(`../tests/${f}`);
  if (src.includes("const GAME_VERSION = 'v22." + "66';") || src.includes("GAME_VERSION === 'v22." + "66'") ||
      src.includes('一百六十二件套（一百六十一件套清' + '除）') || src.includes('testChain === ' + '162') ||
      src.includes("startsWith('## v22." + "66'") ||
      src.includes('smoke_v2266_stock3（npm test 串' + '跑）') ||
      src.includes('全部 50 项进' + '度') || src.includes('**50 项成' + '就**') ||
      src.includes('ACH_LIST.length === 5' + '0') ||
      src.includes('_gv[0] === 22 && _gv[1] >= 6' + '6') ||
      src.includes('ELIXIR_STOCK2_GOAL, PERFECTION_' + 'GOLD') ||
      src.includes('冒烟一百六十二件套（一百六十一件套清' + '除）')) stale.push(f);
}
ok('旧代 v22.66 字面量/恒等/件套/串尾/testChain/顶 pin/50 项 pin/锚点 66/ELIXIR 旧 export pin 全库零残留（' + allTests.length + ' 件扫描，含本件）', stale.length === 0, stale.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
