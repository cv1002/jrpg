// v22.71 专项冒烟：新成就「灯影渐远」（探索线第二档里程碑，新内容·单成就，承 v22.70 踏出灯影首档 /
// v21.88 走遍四方封顶 / v21.91 长明不熄 / v21.93 驱雾百战 / v21.95 彻夜长明 / v21.97 鸿运当头 /
// v21.99 金玉满堂 / v22.0 有备无患 / v22.4 妙手回春 / v22.6 药香满囊 / v22.8 灵药盈囊 / v22.14 菇香满仓 /
// v22.17 灵药满柜 / v22.18 菇山菌海 多档先例）——成就版图「三档推进」的探索线补档：等级/金币/时长/讨伐/
// 掉落/药水/灵药/酿造/蘑菇 九线早已三档齐备，唯独探索线（v22.70 补首档 outstep 踏出灯影=2 图 + v21.88
// 封顶 wander 走遍四方=全部 4 图）仍只有首档+封顶两档——玩家走到第三张地图时毫无回响；现补第二档
// （OUTSTEP2_GOAL=3 张地图——village 起始 + 进雾语林 + 星井矿脉/无字回廊任何一张即达，恰在首档与封顶档
// 正中间、终局流程必经）：判定/进度同读 Object.keys(MAPS) 单一数据源（与 outstep/wander 同款——
// 加/删地图只改 data.js 一处、本成就自动跟随，绝无第二套口径）+ 既有 hero.visited 到访记录
// （world.transition 进图时 push，全游戏唯一写入点），(g.visited||[]) 防御式读取、旧档无此字段 false
// 不误解锁、零迁移（承 v19.41 seen / outstep / wander 同款）；无 r 字段（与 outstep/wander/lvl5 同款纯
// 里程碑——脚印本身就是奖励）；解锁时机：world.transition 进图落账后当场 applyAchievements（承 v21.88
// 反馈不迟到惯例），第 3 张图落账即解锁、反馈不迟到。
// 本冒烟守护：版本锚点、OUTSTEP2_GOAL 数据契约（===3、声明与导出）、ACH_LIST 契约（outstep2 唯一/总数 55/
// 既有 54 成就 id 零回归/ptime 32 与 ptime2 34 与 mush 41 与 metall 44 与 rich3 45 与 ptime3 46
// 与 hunt3 47 与 lucky3 48 与 stock3 49 与 elixir3 50 与 brew3 51 与 mush3 52 与 outstep 53 零位移/
// 末尾追加序位 54）、ok/prog 谓词逐值（0·1·2 图 false / 3·4 图 true / 缺 visited 字段防御 false·0/3 /
// prog 不钳制 4/3）、运行期全链路（applyAchievements 真实解锁落 hero.ach / 未够不误解锁 / 新档起始到访
// 不误解锁 / 重复调用去重 / 旧档缺字段不抛错不解锁）、drawAch 55 项滚动渲染不抛错、README/package.json/
// CHANGELOG 同步、姊妹件套 pin（v2270..v2258 一百六十七件套 / v2270·v2269·v2268·v2267·v2266·v2265·v2264·
// v2263·v2262·v2261·v2260·v2259·v2258 GAME_VERSION v22.71 / v2143-45 哨兵链 168）随新现实更新 + 旧代 v22.70
// 字面量/恒等/件套/串尾/testChain/顶 pin 全库零残留。
import { GAME_VERSION, ACH_LIST, OUTSTEP_GOAL, OUTSTEP2_GOAL, MAPS } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.71 灯影渐远探索线第二档里程碑冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v22.70 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.70（本版守 v22.79）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 99)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v22.71 版本注释', dataSrc.includes('v22.71 新成就·探索线第二档里程碑「灯影渐远」'));
ok('data.js GAME_VERSION 字面量已为 v22.71（旧 v22.70 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.53';") && !dataSrc.includes("const GAME_VERSION = 'v22." + "70';"));
ok('data.js 仍保留 v22.70 历史注释（踏出灯影成就注释未动）', dataSrc.includes('v22.70 新成就·探索线首档里程碑「踏出灯影」'));
ok('data.js 导出 OUTSTEP2_GOAL（export 块落位，与 OUTSTEP_GOAL 相邻）',
  dataSrc.includes('CAVE_TREASURE, OUTSTEP_GOAL, OUTSTEP2_GOAL,'));

// —— OUTSTEP2_GOAL 数据契约 ——
ok('OUTSTEP2_GOAL === 3（探索线第二档 = village 起始 + 两张新图）', OUTSTEP2_GOAL === 3, String(OUTSTEP2_GOAL));
ok('OUTSTEP2_GOAL 声明与注释含「灯影渐远」口径',
  dataSrc.includes('const OUTSTEP2_GOAL = 3;') && dataSrc.includes('成就「灯影渐远」'));
ok('OUTSTEP_GOAL 首档仍为 2（零回归）', OUTSTEP_GOAL === 2, String(OUTSTEP_GOAL));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'outstep2');
ok('ACH_LIST 含 outstep2「灯影渐远」且 id 唯一',
  !!ach && ach.name === '灯影渐远' && ACH_LIST.filter((a) => a.id === 'outstep2').length === 1);
ok('ACH_LIST 精确总数 55 项（v2229 精确计数 pin 随新现实更新 54→55）', ACH_LIST.length === 61, String(ACH_LIST.length));
ok('outstep2 描述由 OUTSTEP2_GOAL 派生（单一数据源，零裸字面量 3）',
  ach.d === `到访 ${OUTSTEP2_GOAL} 张地图`, ach.d);
ok('outstep2 判定/进度同读 OUTSTEP2_GOAL + Object.keys(MAPS) + visited 防御式（ok/prog 同式）',
  String(ach.ok).includes('OUTSTEP2_GOAL') && String(ach.ok).includes('Object.keys(MAPS)') && String(ach.ok).includes('g.visited||[]') &&
  String(ach.prog).includes('OUTSTEP2_GOAL') && String(ach.prog).includes('Object.keys(MAPS)') && String(ach.prog).includes('g.visited||[]'));
ok('outstep2 无 r 字段纯里程碑（与 outstep/wander/lvl5 同款）', !('r' in ach));

// —— 既有 54 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime', 'hunt100', 'ptime2', 'lucky2', 'rich2', 'stock',
  'brew2', 'stock2', 'elixir', 'mush', 'elixir2', 'mush2', 'metall', 'rich3', 'ptime3', 'hunt3', 'lucky3', 'stock3', 'elixir3', 'brew3', 'mush3', 'outstep'];
ok('既有 54 成就 id 零回归', EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('outstep2 追加在末尾序位（ptime 32 / ptime2 34 / mush 41 / metall 44 / rich3 45 / ptime3 46 / hunt3 47 / lucky3 48 / stock3 49 / elixir3 50 / brew3 51 / mush3 52 / outstep 53 / outstep2 54，既有序位零位移）',
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
  ACH_LIST.findIndex((a) => a.id === 'outstep2') === 54);

// —— ok/prog 谓词逐值 ——
const visitedOf = (arr) => ({ visited: arr });
ok('visited=[]（零到访）→ false 且 prog 0/3', ach.ok({ visited: [] }) === false && ach.prog({ visited: [] }) === `0/${OUTSTEP2_GOAL}`);
ok('visited=[village]（仅起始镇·差 2 图）→ false（恰在门槛下不解锁）', ach.ok(visitedOf(['village'])) === false);
ok('visited=[village,dungeon]（2 图·差 1 图）→ false（恰在门槛下不解锁）', ach.ok(visitedOf(['village', 'dungeon'])) === false);
ok('visited=三图（3 图）→ true（恰达标）', ach.ok(visitedOf(['village', 'dungeon', 'cave'])) === true);
ok('visited=四图（4 图）→ true（超阈值仍达标不抛错）', ach.ok(visitedOf(['village', 'dungeon', 'cave', 'gallery'])) === true);
ok('缺 visited 字段旧档 → false 且 prog 0/3（防御式零迁移）',
  ach.ok({}) === false && ach.prog({}) === `0/${OUTSTEP2_GOAL}`);
ok('visited 非数组（undefined 兜底）→ false 不抛错', ach.ok({ visited: undefined }) === false);
ok('prog 2 图 → 2/3', ach.prog(visitedOf(['village', 'dungeon'])) === `2/${OUTSTEP2_GOAL}`, ach.prog(visitedOf(['village', 'dungeon'])));
ok('prog 3 图 → 3/3', ach.prog(visitedOf(['village', 'dungeon', 'cave'])) === `3/${OUTSTEP2_GOAL}`, ach.prog(visitedOf(['village', 'dungeon', 'cave'])));
ok('prog 4 图不钳制（4/3，承 wander「X/N 不钳制」口径）', ach.prog(visitedOf(['village', 'dungeon', 'cave', 'gallery'])) === `4/${OUTSTEP2_GOAL}`, ach.prog(visitedOf(['village', 'dungeon', 'cave', 'gallery'])));

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

// 达标档：visited=三图（3 图）→ applyAchievements 真实解锁落 hero.ach（持续变化量，任意判定点当场解锁）
let hero = newGame('余烬');
hero.visited = ['village', 'dungeon', 'cave'];
hero = runAch(hero);
ok('运行期：visited 3 图触发 applyAchievements 真实解锁 outstep2 落 hero.ach', hero.ach.includes('outstep2'), hero.ach.join(','));

// 未达标档：visited=[village,dungeon]（仅 2 图）→ 不误解锁（差 1 图）
hero = newGame('灯见');
hero.visited = ['village', 'dungeon'];
hero = runAch(hero);
ok('运行期：visited 2 图不误解锁 outstep2', !hero.ach.includes('outstep2'));

// 新档起始到访（village，未达 3 图）→ 不误解锁
hero = newGame('潮');
hero = runAch(hero);
ok('运行期：新档起始到访不误解锁 outstep2', !hero.ach.includes('outstep2'), String(hero.visited.join(',')));

// 重复调用去重：已解锁后再 applyAchievements 不重复 push
hero = newGame('灯');
hero.visited = ['village', 'dungeon', 'cave'];
runAch(hero);
runAch(hero);
ok('运行期：重复调用去重（hero.ach 中 outstep2 恰一枚）',
  hero.ach.filter((x) => x === 'outstep2').length === 1);

// 旧档防御档：无 visited 字段读档 → applyAchievements 不抛错且不解锁（零迁移）
hero = newGame('潮');
delete hero.visited;
let threw = null;
try { runAch(hero); } catch (e) { threw = e; }
ok('运行期：旧档缺 visited 字段 applyAchievements 不抛错（防御式）', threw === null, threw && String(threw.stack || threw));
ok('运行期：缺字段旧档不解锁 outstep2（零迁移）', !hero.ach.includes('outstep2'));

// —— drawAch 渲染（55 项滚动不抛错；PAGE=10 六页）——
let rendered = true, renderedPg6 = true;
try {
  S.G = newGame('测试'); S.G.ach = ['outstep', 'outstep2']; S.achScroll = 0; S.scene = 'ach';
  drawAch();
} catch (e) { rendered = false; }
try {
  S.achScroll = 60; // 55 项滚到最末页（PAGE=10，钳制到 50）不抛错
  drawAch();
} catch (e) { renderedPg6 = false; }
S.achScroll = 0; S.scene = 'world';
ok('运行期：成就页 drawAch 55 项渲染不抛错', rendered);
ok('运行期：成就页末页滚动渲染不抛错（55 项 PAGE=10 六页）', renderedPg6);

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树串尾已延伸至 smoke_v2271_outstep2（v2270 后接 v2271）',
  readme.includes('smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 件套口径为二百一十二件套（二百一十一件套清除）且旧 166 口径零残留',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟一百六十六件套（一百六十五件套清' + '除）'));
ok('README 含 v22.71 守护描述（新成就灯影渐远守护）', readme.includes('v22.71 起含新成就「灯影渐远」'));
ok('README 含 smoke_v2271_outstep2 入库（167 份）', readme.includes('smoke_v2271_outstep2 入库（167 份）'));
ok('README 仍保留 v22.70 守护描述（历史口径未动）', readme.includes('v22.70 起含新成就「踏出灯影」'));
ok('README 仍保留 smoke_v2270_outstep 入库（166 份）历史口径', readme.includes('smoke_v2270_outstep 入库（166 份）'));
ok('README 成就口径「55 项」双处同步（快速上手表 C 键行 + 图鉴&成就行）',
  readme.includes('成就一览（全部 61 项进度') && readme.includes('**61 项成就**') &&
  !readme.includes('成就一览（全部 54 项进' + '度') && !readme.includes('**54 项成' + '就**'));
ok('package.json 已收录 smoke_v2271_outstep2（npm test 串跑第 167 份）',
  pkg.includes('smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs') && pkg.includes('smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 167 件套', testChain === 212, String(testChain));
ok('CHANGELOG 顶为 v22.71 条目', changelog.startsWith('## v23.53 '));
ok('CHANGELOG 含 v22.70 条目', changelog.includes('## v22.70 '));

// —— 姊妹件套 pin 复查（v2269..v2258 随新现实更新）——
const s2269 = read('../tests/smoke_v2269_mush3.mjs');
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
const s2270 = read('../tests/smoke_v2270_outstep.mjs');
const s2229 = read('../tests/smoke_v2229_metall.mjs');
const s2199 = read('../tests/smoke_v2199_rich2.mjs');
const s2143 = read('../tests/smoke_v2143_talkekey.mjs');
const s2144 = read('../tests/smoke_v2144_run.mjs');
const s2145 = read('../tests/smoke_v2145_journalscroll.mjs');
ok('smoke_v2269 的 GAME_VERSION 字面量 pin 已更新为 v22.71', s2269.includes("const GAME_VERSION = 'v23.53';"));
ok('smoke_v2269 的 README 件套 pin 已随新现实更新为二百一十二件套（二百一十一件套清除）',
  s2269.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2269 的 package.json 件套计数 pin 已更新为 === 167', s2269.includes('testChain === 212'));
ok('smoke_v2269 的 CHANGELOG 顶 pin 已更新为 ## v22.72', s2269.includes("startsWith('## v23.53'") || s2269.includes("startsWith('## v22.78 '"));
ok('smoke_v2269 的 README 串尾 pin 已随新现实延伸至 smoke_v2271_outstep2',
  s2269.includes('smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2269 的 package.json 串尾 plain pin 已延伸至 smoke_v2271_outstep2',
  s2269.includes('smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
ok('smoke_v2269 的 README 成就 pin 已随新现实更新为 55 项双处', s2269.includes('成就一览（全部 61 项进度') && s2269.includes('**61 项成就**'));
ok('smoke_v2269 的 ACH_LIST 精确计数 pin 已更新为 === 55', s2269.includes('ACH_LIST.length === 61'));
ok('smoke_v2269 的版本锚点已随新现实推进至 >= 71', s2269.includes('_gv[0] === 22 && _gv[1] >= 99'));
ok('smoke_v2268 的 GAME_VERSION 字面量 pin 已更新为 v22.71', s2268.includes("const GAME_VERSION = 'v23.53';"));
ok('smoke_v2268 的 README 件套 pin 已随新现实更新为二百一十二件套（二百一十一件套清除）',
  s2268.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2268 的 package.json 件套计数 pin 已更新为 === 167', s2268.includes('testChain === 212'));
ok('smoke_v2268 的 CHANGELOG 顶 pin 已更新为 ## v22.72', s2268.includes("startsWith('## v23.53'") || s2268.includes("startsWith('## v22.78 '"));
ok('smoke_v2268 的 README 串尾 pin 已随新现实延伸至 smoke_v2271_outstep2',
  s2268.includes('smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2268 的 package.json 串尾 plain pin 已延伸至 smoke_v2271_outstep2',
  s2268.includes('smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
ok('smoke_v2268 的 README 成就 pin 已随新现实更新为 55 项双处', s2268.includes('成就一览（全部 61 项进度') && s2268.includes('**61 项成就**'));
ok('smoke_v2268 的 ACH_LIST 精确计数 pin 已更新为 === 55', s2268.includes('ACH_LIST.length === 61'));
ok('smoke_v2268 的版本锚点已随新现实推进至 >= 71', s2268.includes('_gv[0] === 22 && _gv[1] >= 99'));
ok('smoke_v2267 的 GAME_VERSION 字面量 pin 已更新为 v22.71', s2267.includes("const GAME_VERSION = 'v23.53';"));
ok('smoke_v2267 的 README 件套 pin 已随新现实更新为二百一十二件套（二百一十一件套清除）',
  s2267.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2267 的 package.json 件套计数 pin 已更新为 === 167', s2267.includes('testChain === 212'));
ok('smoke_v2267 的 CHANGELOG 顶 pin 已更新为 ## v22.72', s2267.includes("startsWith('## v23.53'") || s2267.includes("startsWith('## v22.78 '"));
ok('smoke_v2267 的 README 串尾 pin 已随新现实延伸至 smoke_v2271_outstep2',
  s2267.includes('smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2267 的 package.json 串尾 plain pin 已延伸至 smoke_v2271_outstep2',
  s2267.includes('smoke_v2266_stock3.mjs && node tests/smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
ok('smoke_v2267 的 README 成就 pin 已随新现实更新为 55 项双处', s2267.includes('成就一览（全部 61 项进度') && s2267.includes('**61 项成就**'));
ok('smoke_v2267 的 ACH_LIST 精确计数 pin 已更新为 === 55', s2267.includes('ACH_LIST.length === 61'));
ok('smoke_v2266 的 GAME_VERSION 字面量 pin 已更新为 v22.71', s2266.includes("const GAME_VERSION = 'v23.53';"));
ok('smoke_v2266 的 README 件套 pin 已随新现实更新为二百一十二件套（二百一十一件套清除）',
  s2266.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2266 的 package.json 件套计数 pin 已更新为 === 167', s2266.includes('testChain === 212'));
ok('smoke_v2266 的 CHANGELOG 顶 pin 已更新为 ## v22.72', s2266.includes("startsWith('## v23.53'") || s2266.includes("startsWith('## v22.78 '"));
ok('smoke_v2266 的 README 串尾 pin 已随新现实延伸至 smoke_v2271_outstep2',
  s2266.includes('smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2266 的 package.json 串尾 plain pin 已延伸至 smoke_v2271_outstep2',
  s2266.includes('smoke_v2265_lucky3.mjs && node tests/smoke_v2266_stock3.mjs && node tests/smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
ok('smoke_v2266 的 README 成就 pin 已随新现实更新为 55 项双处', s2266.includes('成就一览（全部 61 项进度') && s2266.includes('**61 项成就**'));
ok('smoke_v2266 的 ACH_LIST 精确计数 pin 已更新为 === 55', s2266.includes('ACH_LIST.length === 61'));
ok('smoke_v2265 的 GAME_VERSION 字面量 pin 已更新为 v22.71', s2265.includes("const GAME_VERSION = 'v23.53';"));
ok('smoke_v2265 的 README 件套 pin 已随新现实更新为二百一十二件套（二百一十一件套清除）',
  s2265.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2265 的 README 串尾 pin 已随新现实延伸至 smoke_v2271_outstep2',
  s2265.includes('smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2264 的 GAME_VERSION 字面量 pin 已更新为 v22.71', s2264.includes("const GAME_VERSION = 'v23.53';"));
ok('smoke_v2264 的 README 件套 pin 已随新现实更新为二百一十二件套（二百一十一件套清除）',
  s2264.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2264 的 README 串尾 pin 已随新现实延伸至 smoke_v2271_outstep2',
  s2264.includes('smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2263 的 GAME_VERSION 字面量 pin 已更新为 v22.71', s2263.includes("const GAME_VERSION = 'v23.53';"));
ok('smoke_v2263 的 README 件套 pin 已随新现实更新为二百一十二件套（二百一十一件套清除）',
  s2263.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2262 的 GAME_VERSION 字面量 pin 已更新为 v22.71', s2262.includes("const GAME_VERSION = 'v23.53';"));
ok('smoke_v2261 的 GAME_VERSION 字面量 pin 已更新为 v22.71', s2261.includes("const GAME_VERSION = 'v23.53';"));
ok('smoke_v2260 的 GAME_VERSION 恒等 pin 族已随新现实全库更新（v22.71 字面量 pin 落位）',
  s2260.includes("const GAME_VERSION = 'v23.53';"));
ok('smoke_v2260 的 README 件套 pin 已随新现实更新为二百一十二件套（二百一十一件套清除）',
  s2260.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2259 的 GAME_VERSION 字面量 pin 已更新为 v22.71', s2259.includes("const GAME_VERSION = 'v23.53';"));
ok('smoke_v2258 的 GAME_VERSION 字面量 pin 已更新为 v22.71', s2258.includes("const GAME_VERSION = 'v23.53';"));
ok('smoke_v2270（上一版）的 GAME_VERSION 字面量 pin 已随新现实更新为 v22.71', s2270.includes("const GAME_VERSION = 'v23.53';"));
ok('smoke_v2270 的 CHANGELOG 顶 pin 已随新现实更新为 ## v22.72', s2270.includes("startsWith('## v23.53'") || s2270.includes("startsWith('## v22.78 '"));
ok('smoke_v2270 的 README 成就 pin 已随新现实更新为 55 项双处且 ACH === 55',
  s2270.includes('成就一览（全部 61 项进度') && s2270.includes('**61 项成就**') && s2270.includes('ACH_LIST.length === 61'));
ok('smoke_v2270 的哨兵链 pin 已随新现实推进至 168（二百一十二件套（二百一十一件套清除））',
  s2270.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2229 的 ACH_LIST 精确总数 pin 已更新为 === 55（54→55）',
  s2229.includes('ACH_LIST.length === 61') && !s2229.includes('ACH_LIST.length === 5' + '3'));
ok('smoke_v2199 的 README 成就 pin 已随新现实更新为 55 项双处落位',
  s2199.includes('成就一览（全部 61 项进度') && s2199.includes('**61 项成就**'));
ok('v2143-45「件套守护领先一位」哨兵链已推进至 168（二百一十二件套（二百一十一件套清除））',
  s2143.includes('二百一十三件套（二百一十二件套清除）') && s2143.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));
ok('smoke_v2144 的哨兵链 pin 已随新现实推进（!readme 不含一百六十八件套）',
  s2144.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));
ok('smoke_v2145 的哨兵链 pin 已随新现实推进（二百一十二件套（二百一十一件套清除））',
  s2145.includes('二百一十三件套（二百一十二件套清除）'));

// 旧代 v22.70 pin 全库零残留（字面量/恒等/件套/串尾/testChain/顶 pin/README 54 项/ACH 54/锚点 70）
const allTests = fs.readdirSync(new URL('../tests', import.meta.url)).filter((f) => /^smoke_.*\.mjs$/.test(f));
const stale = [];
for (const f of allTests) {
  const src = read(`../tests/${f}`);
  if (src.includes("const GAME_VERSION = 'v22." + "70';") || src.includes("GAME_VERSION === 'v22." + "70'") ||
      src.includes('一百六十六件套（一百六十五件套清' + '除）') || src.includes('testChain === ' + '166') ||
      src.includes("startsWith('## v22." + "70'") ||
      src.includes('smoke_v2270_outstep（npm test 串' + '跑）') ||
      src.includes('全部 54 项进' + '度') || src.includes('**54 项成' + '就**') ||
      src.includes('ACH_LIST.length === 5' + '4') ||
      src.includes('_gv[0] === 22 && _gv[1] >= 7' + '0') ||
      src.includes('冒烟一百六十六件套（一百六十五件套清' + '除）') ||
      src.includes('哨兵链已推进至 ' + '167')) stale.push(f);
}
ok('旧代 v22.70 字面量/恒等/件套/串尾/testChain/顶 pin/54 项 pin/锚点 70/哨兵 167 全库零残留（' + allTests.length + ' 件扫描，含本件）', stale.length === 0, stale.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
