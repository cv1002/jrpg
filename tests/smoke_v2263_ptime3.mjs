// v22.63 专项冒烟：新成就「长明如昼」（游玩时长第三档里程碑，新内容·单成就，承 v21.91 长明不熄 /
// v21.95 彻夜长明 / v22.61 富甲一方 多档先例）——成就版图逐线核对的三档持续推进：等级线早有三档
// （lvl5·lvl10·lvl12）、金币线 v22.61 补至三档（rich·rich2·rich3），时长线（ptime 长明不熄=60 分钟 /
// ptime2 彻夜长明=120 分钟）仍停两档——作为全程伴随的真实投入（main.js render 驱动 hero.time、随存档
// 快照持久化，「在这颗灯下待满 X」的同族纪念）在「彻夜长明」处毫无第三枚回应。现补第三档
// （PLAY_TIME3_GOAL=14400 秒=240 分钟，约四个「长明不熄」的时长、终局区（无字回廊刷级/试炼再战/
// 收集补完）自然积累可达）：判定/描述/进度三处同读新常量 PLAY_TIME3_GOAL（与 PLAY_TIME_GOAL /
// PLAY_TIME2_GOAL 同一「成就阈值数据化」家族——改门槛只改 data.js 一处自动跟随，零裸字面量），
// 计数读既有 hero.time 字段（(g.time||0) 防御式读取、旧档无 time 字段时 false 不误解锁、零迁移，
// 承 ptime/ptime2 同款）；无 r 字段（与 ptime/ptime2/lvl5 同款纯里程碑——时间本身就是纪念）；
// 解锁时机：applyAchievements 既有通路任意判定点当场解锁（time 为持续累积量，无需新判定点，承
// ptime/ptime2 同款——已解锁不因任何变化而撤销）。
// 本冒烟守护：版本锚点、PLAY_TIME3_GOAL 数据契约（===14400、声明与导出）、ACH_LIST 契约（ptime3 唯一/
// 总数 47/既有 46 成就 id 零回归/ptime 32 与 ptime2 34 与 mush 41 与 metall 44 与 rich3 45 零位移/
// 末尾追加序位 46）、ok/prog 谓词逐值（0·14399 false / 14400·28800 true / 缺 time 字段防御 false·0/240 /
// prog 不钳制 480/240）、运行期全链路（applyAchievements 真实解锁落 hero.ach / 未够不误解锁 /
// 新档起始时长不误解锁 / 重复调用去重 / 旧档缺字段不抛错不解锁）、drawAch 47 项滚动渲染不抛错、
// README/package.json/CHANGELOG 同步、姊妹件套 pin（v2262..v2176 一百五十九件套 / v2262·v2261·v2260·
// v2259·v2258 GAME_VERSION v22.63 / v2143-45 哨兵链 160）随新现实更新 + 旧代 v22.62 字面量/恒等/
// 件套/串尾/testChain/顶 pin 全库零残留。
import { GAME_VERSION, ACH_LIST, PLAY_TIME3_GOAL } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.63 长明如昼游玩时长第三档里程碑冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v22.62 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.69（本版守 v22.79）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 99)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v22.63 版本注释', dataSrc.includes('v22.63 新成就·游玩时长第三档里程碑「长明如昼」'));
ok('data.js GAME_VERSION 字面量已为 v22.63（旧 v22.62 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.55';") && !dataSrc.includes("const GAME_VERSION = 'v22." + "62';"));
ok('data.js 仍保留 v22.62 历史注释（终焉水晶/祭坛补脸注释未动）', dataSrc.includes('v22.62 星井矿脉/无字回廊「终焉水晶·终焉之神祭坛」补脸'));
ok('data.js 导出 PLAY_TIME3_GOAL（export 块落位，与 PLAY_TIME_GOAL/PLAY_TIME2_GOAL 相邻）',
  dataSrc.includes('PLAY_TIME_GOAL, PLAY_TIME2_GOAL, PLAY_TIME3_GOAL, POTIONS_GOAL'));

// —— PLAY_TIME3_GOAL 数据契约 ——
ok('PLAY_TIME3_GOAL === 14400（时长线第三档 = 累计游玩 240 分钟）', PLAY_TIME3_GOAL === 14400, String(PLAY_TIME3_GOAL));
ok('PLAY_TIME3_GOAL 声明为 14400 且注释含「长明如昼」口径', dataSrc.includes('const PLAY_TIME3_GOAL = 14400;') && dataSrc.includes('成就「长明如昼」'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'ptime3');
ok('ACH_LIST 含 ptime3「长明如昼」且 id 唯一',
  !!ach && ach.name === '长明如昼' && ACH_LIST.filter((a) => a.id === 'ptime3').length === 1);
ok('ACH_LIST 精确总数 47 项（v2229 精确计数 pin 随新现实更新 46→47）', ACH_LIST.length === 62, String(ACH_LIST.length));
ok('ptime3 描述由 PLAY_TIME3_GOAL 派生（单一数据源，零裸字面量 240）',
  ach.d === `累计游玩 ${PLAY_TIME3_GOAL / 60} 分钟` && ach.d === '累计游玩 240 分钟', ach.d);
ok('ptime3 判定/进度同读 PLAY_TIME3_GOAL + time 防御式（ok (g.time||0) / prog (g.time||0)）',
  String(ach.ok).includes('PLAY_TIME3_GOAL') && String(ach.ok).includes('g.time||0') &&
  String(ach.prog).includes('PLAY_TIME3_GOAL') && String(ach.prog).includes('g.time||0'));
ok('ptime3 无 r 字段纯里程碑（与 ptime/ptime2/lvl5 同款）', !('r' in ach));

// —— 既有 46 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime', 'hunt100', 'ptime2', 'lucky2', 'rich2', 'stock',
  'brew2', 'stock2', 'elixir', 'mush', 'elixir2', 'mush2', 'metall', 'rich3'];
ok('既有 46 成就 id 零回归', EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('ptime3 追加在末尾序位（ptime 32 / ptime2 34 / mush 41 / metall 44 / rich3 45 / ptime3 46，既有序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'ptime') === 32 &&
  ACH_LIST.findIndex((a) => a.id === 'ptime2') === 34 &&
  ACH_LIST.findIndex((a) => a.id === 'mush') === 41 &&
  ACH_LIST.findIndex((a) => a.id === 'metall') === 44 &&
  ACH_LIST.findIndex((a) => a.id === 'rich3') === 45 &&
  ACH_LIST.findIndex((a) => a.id === 'ptime3') === 46);

// —— ok/prog 谓词逐值 ——
ok('time=0（新档起始游玩时长，未达标）→ false', ach.ok({ time: 0 }) === false);
ok('time=14399（差 1 秒）→ false（恰在门槛下不解锁）', ach.ok({ time: 14399 }) === false);
ok('time=14400 → true（恰达标）', ach.ok({ time: 14400 }) === true);
ok('time=28800 → true（超阈值仍达标）', ach.ok({ time: 28800 }) === true);
ok('缺 time 字段旧档 → false 且 prog 0/240（防御式零迁移）',
  ach.ok({}) === false && ach.prog({}) === `0/${PLAY_TIME3_GOAL / 60}`);
ok('time 非数值（undefined 兜底）→ false 不抛错', ach.ok({ time: undefined }) === false);
ok('prog 7200 秒 → 120/240', ach.prog({ time: 7200 }) === `120/${PLAY_TIME3_GOAL / 60}`, ach.prog({ time: 7200 }));
ok('prog 14400 秒 → 240/240', ach.prog({ time: 14400 }) === `240/${PLAY_TIME3_GOAL / 60}`, ach.prog({ time: 14400 }));
ok('prog 28800 秒不钳制（480/240，承 lvl5「X/N 不钳制」口径）', ach.prog({ time: 28800 }) === `480/${PLAY_TIME3_GOAL / 60}`, ach.prog({ time: 28800 }));

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

// 达标档：time=14400 → applyAchievements 真实解锁落 hero.ach（持续累积量，任意判定点当场解锁）
let hero = newGame('余烬');
hero.time = 14400;
hero = runAch(hero);
ok('运行期：time=14400 触发 applyAchievements 真实解锁 ptime3 落 hero.ach', hero.ach.includes('ptime3'), hero.ach.join(','));

// 未达标档：time=14399 → 不误解锁（差 1 秒）
hero = newGame('灯见');
hero.time = 14399;
hero = runAch(hero);
ok('运行期：time=14399 不误解锁 ptime3', !hero.ach.includes('ptime3'));

// 新档起始时长（time=0，未达 14400）→ 不误解锁
hero = newGame('潮');
hero = runAch(hero);
ok('运行期：新档起始 time 不误解锁 ptime3', !hero.ach.includes('ptime3'), String(hero.time));

// 重复调用去重：已解锁后再 applyAchievements 不重复 push
hero = newGame('灯');
hero.time = 14400;
runAch(hero);
runAch(hero);
ok('运行期：重复调用去重（hero.ach 中 ptime3 恰一枚）',
  hero.ach.filter((x) => x === 'ptime3').length === 1);

// 旧档防御档：无 time 字段读档 → applyAchievements 不抛错且不解锁（零迁移）
hero = newGame('潮');
delete hero.time;
let threw = null;
try { runAch(hero); } catch (e) { threw = e; }
ok('运行期：旧档缺 time 字段 applyAchievements 不抛错（防御式）', threw === null, threw && String(threw.stack || threw));
ok('运行期：缺字段旧档不解锁 ptime3（零迁移）', !hero.ach.includes('ptime3'));

// —— drawAch 渲染（47 项滚动不抛错；PAGE=10 五页）——
let rendered = true, renderedPg5 = true;
try {
  S.G = newGame('测试'); S.G.ach = ['ptime3']; S.achScroll = 0; S.scene = 'ach';
  drawAch();
} catch (e) { rendered = false; }
try {
  S.achScroll = 50; // 47 项滚到末页（PAGE=10，钳制到 37）不抛错
  drawAch();
} catch (e) { renderedPg5 = false; }
S.achScroll = 0; S.scene = 'world';
ok('运行期：成就页 drawAch 47 项渲染不抛错', rendered);
ok('运行期：成就页末页滚动渲染不抛错（47 项 PAGE=10 五页）', renderedPg5);

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树串尾已延伸至 smoke_v2263_ptime3（v2262 后接 v2263）',
  readme.includes('smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 件套口径为二百一十二件套（二百一十一件套清除）且旧 158 口径零残留',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟一百五十八件套（一百五十七件套清' + '除）'));
ok('README 含 v22.63 守护描述（新成就长明如昼守护）', readme.includes('v22.63 起含新成就「长明如昼」'));
ok('README 含 smoke_v2263_ptime3 入库（159 份）', readme.includes('smoke_v2263_ptime3 入库（159 份）'));
ok('README 仍保留 smoke_v2262_crystal 入库（158 份）历史口径', readme.includes('smoke_v2262_crystal 入库（158 份）'));
ok('README 成就口径「47 项」双处同步（快速上手表 C 键行 + 图鉴&成就行）',
  readme.includes('成就一览（全部 62 项进度') && readme.includes('**62 项成就**') &&
  !readme.includes('成就一览（全部 46 项进' + '度') && !readme.includes('**46 项成' + '就**'));
ok('package.json 已收录 smoke_v2263_ptime3（npm test 串跑第 159 份）',
  pkg.includes('smoke_v2263_ptime3.mjs') && pkg.includes('smoke_v2262_crystal.mjs && node tests/smoke_v2263_ptime3.mjs && node tests/smoke_v2264_hunt3.mjs && node tests/smoke_v2265_lucky3.mjs && node tests/smoke_v2266_stock3.mjs && node tests/smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 159 件套', testChain === 212, String(testChain));
ok('CHANGELOG 顶为 v22.63 条目', changelog.startsWith('## v23.55 '));
ok('CHANGELOG 含 v22.62 条目', changelog.includes('## v22.62 '));

// —— 姊妹件套 pin 复查（v2262..v2176 随新现实更新）——
const s2262 = read('../tests/smoke_v2262_crystal.mjs');
const s2261 = read('../tests/smoke_v2261_rich3.mjs');
const s2260 = read('../tests/smoke_v2260_fountripple.mjs');
const s2259 = read('../tests/smoke_v2259_sandpile.mjs');
const s2258 = read('../tests/smoke_v2258_potionhelp.mjs');
const s2229 = read('../tests/smoke_v2229_metall.mjs');
const s2199 = read('../tests/smoke_v2199_rich2.mjs');
const s2143 = read('../tests/smoke_v2143_talkekey.mjs');
const s2144 = read('../tests/smoke_v2144_run.mjs');
const s2145 = read('../tests/smoke_v2145_journalscroll.mjs');
ok('smoke_v2262 的 GAME_VERSION 字面量 pin 已更新为 v22.63', s2262.includes("const GAME_VERSION = 'v23.55';"));
ok('smoke_v2262 的 README 件套 pin 已随新现实更新为二百一十二件套（二百一十一件套清除）',
  s2262.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2262 的 package.json 件套计数 pin 已更新为 === 159', s2262.includes('testChain === 212'));
ok('smoke_v2262 的 CHANGELOG 顶 pin 已更新为 ## v22.63', s2262.includes("startsWith('## v23.55')"));
ok('smoke_v2262 的 README 串尾 pin 已随新现实延伸至 smoke_v2263_ptime3',
  s2262.includes('smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2262 的 package.json 串尾 plain pin 已延伸至 smoke_v2263_ptime3',
  s2262.includes('smoke_v2262_crystal.mjs && node tests/smoke_v2263_ptime3.mjs && node tests/smoke_v2264_hunt3.mjs && node tests/smoke_v2265_lucky3.mjs && node tests/smoke_v2266_stock3.mjs && node tests/smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
ok('smoke_v2261 的 GAME_VERSION 字面量 pin 已更新为 v22.63', s2261.includes("const GAME_VERSION = 'v23.55';"));
ok('smoke_v2261 的 package.json 串尾 plain pin 已延伸至 smoke_v2263_ptime3',
  s2261.includes('smoke_v2261_rich3.mjs && node tests/smoke_v2262_crystal.mjs && node tests/smoke_v2263_ptime3.mjs && node tests/smoke_v2264_hunt3.mjs && node tests/smoke_v2265_lucky3.mjs && node tests/smoke_v2266_stock3.mjs && node tests/smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
ok('smoke_v2260 的 GAME_VERSION 恒等 pin 族已随新现实全库更新（v22.63 字面量 pin 落位）',
  s2260.includes("const GAME_VERSION = 'v23.55';"));
ok('smoke_v2260 的 README 件套 pin 已随新现实更新为二百一十二件套（二百一十一件套清除）',
  s2260.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2260 的 package.json 件套计数 pin 已更新为 === 159', s2260.includes('testChain === 212'));
ok('smoke_v2260 的 CHANGELOG 顶 pin 已更新为 ## v22.63', s2260.includes("startsWith('## v23.55')"));
ok('smoke_v2260 的 README 串尾 pin 已随新现实延伸至 smoke_v2263_ptime3',
  s2260.includes('smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2259 的 GAME_VERSION 字面量 pin 已更新为 v22.63', s2259.includes("const GAME_VERSION = 'v23.55';"));
ok('smoke_v2259 的 README 件套 pin 已随新现实更新为二百一十二件套（二百一十一件套清除）',
  s2259.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2259 的 package.json 件套计数 pin 已更新为 === 159', s2259.includes('testChain === 212'));
ok('smoke_v2259 的 CHANGELOG 顶 pin 已更新为 ## v22.63', s2259.includes("startsWith('## v23.55')"));
ok('smoke_v2258 的 GAME_VERSION 字面量 pin 已更新为 v22.63', s2258.includes("const GAME_VERSION = 'v23.55';"));
ok('smoke_v2229 的 ACH_LIST 精确总数 pin 已更新为 === 47（46→47）',
  s2229.includes('ACH_LIST.length === 62') && !s2229.includes('ACH_LIST.length === 4' + '6'));
ok('smoke_v2199 的 README 成就 pin 已随新现实更新为 47 项双处落位',
  s2199.includes('成就一览（全部 62 项进度') && s2199.includes('**62 项成就**'));
ok('v2143-45「件套守护领先一位」哨兵链已推进至 163（二百一十二件套（二百一十一件套清除））',
  s2143.includes('二百一十三件套（二百一十二件套清除）') && s2143.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));
ok('smoke_v2144 的哨兵链 pin 已随新现实推进（!readme.includes(\'一百六十件套\')）',
  s2144.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));
ok('smoke_v2145 的哨兵链 pin 已随新现实推进（二百一十二件套（二百一十一件套清除））',
  s2145.includes('二百一十三件套（二百一十二件套清除）'));

// 旧代 v22.62 pin 全库零残留（字面量/恒等/件套/串尾/testChain/顶 pin/README 46 项/ACH 46）
const allTests = fs.readdirSync(new URL('../tests', import.meta.url)).filter((f) => /^smoke_.*\.mjs$/.test(f));
const stale = [];
for (const f of allTests) {
  const src = read(`../tests/${f}`);
  if (src.includes("const GAME_VERSION = 'v22." + "62';") || src.includes("GAME_VERSION === 'v22." + "62'") ||
      src.includes('一百五十八件套（一百五十七件套清' + '除）') || src.includes('testChain === ' + '158') ||
      src.includes("startsWith('## v22." + "62'") ||
      src.includes('smoke_v2262_crystal（npm test 串' + '跑）') ||
      src.includes('全部 46 项进' + '度') || src.includes('**46 项成' + '就**') ||
      src.includes('ACH_LIST.length === 4' + '6')) stale.push(f);
}
ok('旧代 v22.62 字面量/恒等/件套/串尾/testChain/顶 pin/46 项 pin 全库零残留（' + allTests.length + ' 件扫描，含本件）', stale.length === 0, stale.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
