// v24.22 专项冒烟：🏆 胜利战报补「⚔️ 驱雾百战 N/100」进度后缀
// （体验打磨·信息透明·计数现场——承 v24.21 支线交付「🏮 灯火同心 N/11」/ v24.20 领悟战报
// 「📖 诸技通明 N/8」/ v24.19 掉落战报「🍀 鸿运当头 N/30」/ v24.17 喝药「💧 渴饮甘露 N/10」
// 同一「计数现场报进度」主线 / v21.93 驱雾百战成就（讨伐线中档里程碑 = 累计讨伐
// HUNT2_GOAL(100) 只，计数 hero.totalWins 由 winBattle 胜利结算唯一产生点累加、snapshotHero
// 全量快照自动持久化、防御式 (hero.totalWins||0) 旧档零迁移）此前进度只藏在 C 成就页一行
// X/100——讨伐线的计数现场正是每次「🏆 胜利！」战报本身：打赢当场查无一眼之数（与 v24.17
// 「现场是动作本身」同族；v24.12 胜利画面已报「⚔️ 身经百战 N/100」但那是遭遇端口（battles），
// 讨伐端口（totalWins）全游无一个 live 窗口——drawWin 的「累计讨伐 N 只」是 bestiary 击杀合计
// 且只在 Boss 胜利总结屏，普通胜利战报零口径）；现 battle.winBattle 普通胜利报文末尾补
// 「（⚔️ 驱雾百战 N/100）」（分子读 hero.totalWins 防御式旧档零迁移、分母读 data.js HUNT2_GOAL
// 单一数据源，与 C 页/ACH_LIST hunt100 的 ok/prog 同读一份源，调阈值只改 data.js 一处全端自动
// 跟随；totalWins++ 先于 boxMsg 落账，进度差分即本场；同 lucky 线 v24.19 只报中档里程碑先例——
// 初露锋芒 N/1、驱雾十战 N/10、驱雾三百战 N/300 同线另三档由 C 页承载）；纯显示零结算零存档
// 零数值变化（HUNT2_GOAL/totalWins 计数/金币经验结算/升级分支/掉落/碎片/支线进度战报逐字未动）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.22 注释 / GAME_VERSION v24.22 与旧 v24.21 字面量
// 零残留 / v24.21 与 v24.20 历史注释保留）、ACH_LIST hunt100 同源互证（与 HUNT2_GOAL 输出一致）、
// battle.js 源级落位（HUNT2_GOAL import / 报文模板逐字 / totalWins++ 先于 boxMsg / v24.22 注释 /
// 胜利原文案前缀零回归）、运行期 winBattle 真实路径两档（0→1 报 1/100 · 99→100 报 100/100）、
// README/package.json/CHANGELOG 同步（件套口径 246 + v24.22 守护描述 + 入库 246 + package 串尾 +
// CHANGELOG 顶 pin）、tests 目录与实跑链恒等（246）、哨兵链（前望 252 且 README 尚无 252 口径）、
// 旧代 v24.21 pin 全库零残留扫描（字面量/顶 pin/245 口径 · 豁免上一版套件 smoke_v2421_allquest）。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, HUNT2_GOAL } from '../js/data.js';
import { winBattle } from '../js/battle.js';
import { bind } from '../js/bind.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.40/v21.60 冒烟先例：先装桩再 import main.js）——
const noop = () => {};
function makeCtx() {
  const grad = { addColorStop: noop };
  return {
    canvas: { width: 640, height: 480 },
    measureText: (t) => ({ width: String(t).length * 8 }),
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

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.22 🏆 胜利战报「⚔️ 驱雾百战 N/100」进度后缀 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const bSrc = read('js/battle.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.21 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.21', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 21)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.23（旧 v24.21 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.61';") && !dSrc.includes("const GAME_VERSION = 'v24.21';"));
ok('data.js 含 v24.22 注释（胜利战报「⚔️ 驱雾百战 N/100」进度后缀说明）',
  dSrc.includes('// v24.22 体验打磨·信息透明·计数现场'));
ok('data.js 仍保留 v24.21 历史注释（支线交付报文进度后缀说明，累积注释块）',
  dSrc.includes('// v24.21 体验打磨·信息透明·计数现场'));
ok('data.js 仍保留 v24.20 历史注释（领悟战报进度后缀说明）',
  dSrc.includes('// v24.20 体验打磨·信息透明·计数现场'));

// —— HUNT2_GOAL 契约 ——
ok('HUNT2_GOAL === 100（驱雾百战阈值，与 C 页/描述/判定同源）', HUNT2_GOAL === 100, String(HUNT2_GOAL));

// —— ACH_LIST hunt100 同源互证（三处同读 HUNT2_GOAL 一份源）——
const h100 = ACH_LIST.find((a) => a.id === 'hunt100');
ok('ACH_LIST hunt100 名称「驱雾百战」', !!h100 && h100.name === '驱雾百战', h100 && h100.name);
ok('ACH_LIST hunt100 描述与阈值同源（累计讨伐 100 只魔物）',
  !!h100 && h100.d === `累计讨伐 ${HUNT2_GOAL} 只魔物`, h100 && h100.d);
ok('ACH_LIST hunt100 判定/进度同读 totalWins 与 HUNT2_GOAL（99 false · 100 true · prog 7/100 · 缺字段 0/100）',
  !!h100 && h100.ok({ totalWins: 99 }) === false && h100.ok({ totalWins: 100 }) === true &&
  h100.prog({ totalWins: 7 }) === `7/${HUNT2_GOAL}` && h100.prog({}) === `0/${HUNT2_GOAL}`);

// —— battle.js 源级落位 ——
ok('battle.js import 含 HUNT2_GOAL（data.js 既有导出，零新增模块依赖）',
  bSrc.includes('POTION_USE_GOAL, LUCKY2_GOAL, HUNT2_GOAL, RUSH_CLEAR_GOAL'));
ok('battle.js 普通胜利报文含「⚔️ 驱雾百战 N/100」进度后缀（模板逐字）',
  bSrc.includes('（⚔️ 驱雾百战 ${hero.totalWins || 0}/${HUNT2_GOAL}）'));
ok('battle.js 报文分子读 hero.totalWins 防御式（(hero.totalWins||0)）', bSrc.includes('${hero.totalWins || 0}'));
ok('battle.js 报文仍以 🏆 胜利！获得 前缀开头（v19.80 原文案零回归）',
  bSrc.includes('`🏆 胜利！获得 ${enemy.gold} 金币、${enemy.xp} 经验'));
ok('battle.js 含 v24.22 注释（胜利战报进度后缀说明）',
  bSrc.includes('v24.22 体验打磨·信息透明·计数现场'));
ok('battle.js totalWins++ 先于 boxMsg 落账（进度差分即本场）',
  bSrc.indexOf('hero.totalWins++;') < bSrc.indexOf('（⚔️ 驱雾百战 ${hero.totalWins || 0}/${HUNT2_GOAL}）'));

// —— 运行期：winBattle 真实路径 + bind.boxMsg 捕获（承 v21.40/v21.60 捕获桩法）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 5, hp: 80, hpMax: 80, mp: 30, mpMax: 30,
    atkMax: 30, defMax: 40, gold: 0, xp: 0, xpNext: 9999, item: 1, potion2: 0,
    weapon: '铁剑', armor: '皮甲', diff: null, skills: ['火焰斩'], ach: [],
    poison: 0, seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, totalWins: 0,
    x: 1, y: 1, map: 'cave' }, extra || {});
}
function mkFoe(extra) {
  return Object.assign({ name: '骷髅兵', hp: 0, hpMax: 26, atk: 8, def: 5, xp: 16, gold: 15, color: '#d9d3c0' }, extra || {});
}
function runWin(hero, enemy) {
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  const oldRand = Math.random;
  Math.random = () => 0.99;   // 关闭战斗掉落（rollDrop 38% 档），只验胜利战报
  try {
    S.G = hero; S.scene = 'battle'; S.enemy = enemy; S.battleBusy = true;
    winBattle();
    return msgs;
  } finally {
    bind.boxMsg = origBox;
    Math.random = oldRand;
    S.enemy = null; S.scene = 'world'; S.battleBusy = false;
  }
}

// 首胜档：totalWins 0→1 → 报文含「（⚔️ 驱雾百战 1/100）」
const hA = mkHero({ totalWins: 0 });
const mA = runWin(hA, mkFoe());
ok('运行期：首胜档普通胜利报文含「（⚔️ 驱雾百战 1/100）」',
  mA.some((m) => m.includes(`🏆 胜利！获得 15 金币、16 经验`) &&
    m.includes(`（⚔️ 驱雾百战 1/${HUNT2_GOAL}）`)), mA.join(' | '));
ok('运行期：首胜档 totalWins 0→1 落账（进度差分即本场）', hA.totalWins === 1, String(hA.totalWins));

// 中档档：totalWins 6→7 → 报文含「（⚔️ 驱雾百战 7/100）」
const hB = mkHero({ totalWins: 6 });
const mB = runWin(hB, mkFoe());
ok('运行期：中档档普通胜利报文含「（⚔️ 驱雾百战 7/100）」',
  mB.some((m) => m.includes('（⚔️ 驱雾百战 7/' + HUNT2_GOAL + '）')), mB.join(' | '));

// 达成档：totalWins 99→100 → 报文含「（⚔️ 驱雾百战 100/100）」（分母单一数据源同式）——
const hC = mkHero({ totalWins: 99 });
const mC = runWin(hC, mkFoe());
ok('运行期：达成档普通胜利报文含「（⚔️ 驱雾百战 100/100）」',
  mC.some((m) => m.includes(`（⚔️ 驱雾百战 100/${HUNT2_GOAL}）`)), mC.join(' | '));
ok('运行期：达成档 totalWins 99→100 落账', hC.totalWins === 100, String(hC.totalWins));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为二百八十五件套（二百八十四件套清除）',
  readme.includes('冒烟二百八十五件套（二百八十四件套清除）'));
ok('README tests 含 v24.22 守护描述与 smoke_v2422_huntprog 入库（285 份）',
  readme.includes('v24.22 起含 🏆 胜利战报「⚔️ 驱雾百战 N/100」进度后缀守护') &&
  readme.includes('smoke_v2422_huntprog 入库（285 份）'));
ok('README 仍有 v24.21 守护描述（历史保留）', readme.includes('v24.21 起含 🎁 支线交付报文「🏮 灯火同心 N/11」进度后缀守护'));
ok('README 已有二百四十七件套口径且尚无 252（哨兵前望 252 语义：下一版才写 252）',
  readme.includes('冒烟二百八十五件套（二百八十四件套清除）') &&
  !readme.includes('二百八十六件套'));
ok('README tests 树串尾已延伸（smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10 + smoke_v2461_xpcurve11（npm test 串跑））',
  readme.includes('smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10 + smoke_v2461_xpcurve11（npm test 串跑）'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 247 份（smoke.mjs + 250 专项）', chain.length === 284 && chainAll.length === 285, String(chain.length));
ok('package.json 链尾为 smoke_v2439_xpcurve4（第 273 份）', chain[chain.length - 1] === 'smoke_v2461_xpcurve11', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2422_huntprog.mjs（node tests/ 前缀形态）',
  pkgRaw.includes('node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs'));
ok('package.json 链锚逐字（smoke_v2421_allquest.mjs && node tests/smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs"）',
  pkgRaw.includes('smoke_v2421_allquest.mjs && node tests/smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs && node tests/smoke_v2459_xpcurve9.mjs && node tests/smoke_v2460_xpcurve10.mjs && node tests/smoke_v2461_xpcurve11.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.23（startsWith）', changelog.startsWith('## v24.61'));
ok('CHANGELOG v24.22 条目含「驱雾百战」与「计数现场」与「胜利」',
  changelog.includes('驱雾百战') && changelog.includes('计数现场') && changelog.includes('胜利'));
ok('CHANGELOG 仍保留 v24.21 条目（历史保留）', changelog.includes('## v24.21'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(chainAll.map((f) => f.replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 247（246 + smoke_v2423_eliteprog）', files.length === 285, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链（旧代 v24.21 pin 全库零残留）——
const leftovers = [];
for (const f of files) {
  if (f === 'smoke_v2422_huntprog.mjs') continue;
  // 承 v24.21 同款豁免：上一版套件（smoke_v2421_allquest）按惯例在否定式断言里保留旧代字面量，
  // 属合法残留，豁免扫描（本版无 v24.21 否定式则自然零残留）。
  if (f === 'smoke_v2421_allquest.mjs') continue;
  const s = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s.includes("const GAME_VERSION = 'v24.21';") || s.includes("GAME_VERSION === 'v24.21'") ||
      s.includes("startsWith('## v24.21") || s.includes('入库（245 份）') ||
      s.includes('二百四十五件套（二百四十四件套清除）') || s.includes('testChain === 245') ||
      s.includes('fileCount === 245') || s.includes('files.length === 245') ||
      s.includes('chain.length === 244') || s.includes('第 245 份') ||
      s.includes('链尾为 smoke_v2421_allquest')) leftovers.push(f);
}
ok('全库测试零残留 v24.21 GAME_VERSION/顶 pin/245 口径（哨兵链·豁免上一版否定式）', leftovers.length === 0, leftovers.join(','));

console.log(`— v24.22 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
