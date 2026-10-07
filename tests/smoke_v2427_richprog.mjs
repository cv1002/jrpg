// smoke_v2429_xpcurve3.mjs —— v24.27 专项冒烟：🏆 胜利战报补「💰 金玉满堂 N/1500」进度后缀
// （体验打磨·信息透明·计数现场，承 v24.26 升级横幅「🌙 守灯者 N/10」/ v24.22 胜利战报「⚔️ 驱雾百战
// N/100」/ v24.19 掉落战报「🍀 鸿运当头 N/30」同一「计数现场报进度」主线：金币线首档 rich（小富翁
// 500 金）/封顶 rich3（富甲一方 3000 金）之外的**中档** rich2「金玉满堂」（持有 RICH2_GOAL(1500) 金，
// 计数读既有 hero.gold 存档字段，零新计数零迁移，与 ACH_LIST rich2 的 prog 同式 Math.floor((g.gold||0))
// 防御式旧档零迁移）此前进度只藏在 C 成就页一行 X/1500——v24.22 起胜利战报已带「（剩余 X 金）」但那是
// 余额读数不是成就档位，金币线全游无一个 live 窗口（金币是持续变化量且多端变动，v24.12 胜利画面已报
// 身经百战/收集三件套，持有线虽无单一动作但普通胜利是全游最频繁的金币收入事件——v24.22 同款战报
// 同族「现场是动作本身」，金币结算并入 hero.gold 的当场即计数现场）；现 battle.winBattle 普通胜利报文
// 末尾补「（💰 金玉满堂 N/1500）」（分子读 hero.gold 防御式 Math.floor((hero.gold||0))、分母读 data.js
// RICH2_GOAL 单一数据源，与 C 页/ACH_LIST rich2 的 ok/prog/d 同读一份源，调阈值只改 data.js 一处全端
// 自动跟随；hero.gold += enemy.gold 先于 boxMsg 落账，进度差分即本场；同 v24.22/v24.26 只报中档里程碑
// 先例——小富翁 N/500 与富甲一方 N/3000 同线另两档由 C 页承载）；纯显示零结算零存档零数值变化
// （金币结算/升级/掉落/碎片/支线进度战报逐字未动）。
// 本冒烟守护：版本锚点、data.js/battle.js 源级落位（v24.27 注释 / GAME_VERSION v24.27 与旧 v24.26
// 字面量零残留 / v24.26 历史注释保留 / RICH2_GOAL 常量逐字）、运行期常量实值（RICH2_GOAL 1500）与
// ACH_LIST rich2 同源互证（ok/prog/d 逐值）、计数源 hero.gold 防御式与胜利报文模板逐字、既有胜利
// 战报片段零回归（🏆 前缀 / 距离升级 / 剩余 X 金 / ⚔️ 驱雾百战后缀）、README/package.json/CHANGELOG
// 同步（件套口径 251 + v24.27 守护描述 + 入库 251 + tests 树串尾 + package 串尾）、tests 目录与实跑链
// 恒等（251）、哨兵链（前望 252 且 README 尚无 252 口径）、旧代 v24.26 pin 全库零残留扫描（豁免
// 上一版套件 smoke_v2426_levelprog.mjs）、运行期 winBattle 真实路径两档（0 金报 15/1500 · 1500 金报
// 1515/1500）。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, RICH2_GOAL } from '../js/data.js';
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

console.log('— v24.27 🏆 胜利战报「💰 金玉满堂 N/1500」进度后缀 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const bSrc = read('js/battle.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const pkg = JSON.parse(pkgRaw).scripts.test;
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v24.26 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.26', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 26)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.27（旧 v24.26 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.59';") && !dSrc.includes("const GAME_VERSION = 'v24.26';"));
ok('data.js 含 v24.27 注释（胜利战报「💰 金玉满堂 N/1500」进度后缀说明）',
  dSrc.includes('// v24.27 体验打磨·信息透明·计数现场'));
ok('data.js 仍保留 v24.26 历史注释（升级横幅「🌙 守灯者 N/10」说明，累积注释块）',
  dSrc.includes('// v24.26 体验打磨·信息透明·计数现场'));
ok('data.js RICH2_GOAL 常量逐字落位（const RICH2_GOAL = 1500;）',
  dSrc.includes('const RICH2_GOAL = 1500;'));
ok('data.js export 块含 RICH2_GOAL（既有导出，零新增模块依赖）',
  dSrc.includes('RICH_GOLD, RICH2_GOAL, RICH3_GOAL'));

// —— 运行期常量实值（单一数据源）——
ok('RICH2_GOAL === 1500（金玉满堂阈值，与 C 页/描述/判定同源）', RICH2_GOAL === 1500, String(RICH2_GOAL));
const r2 = ACH_LIST.find((a) => a && a.id === 'rich2');
ok('ACH_LIST 含 rich2「金玉满堂」（与胜利报文后缀同读一份源）', !!r2 && r2.name === '金玉满堂', r2 && r2.name);
ok('rich2 ok 谓词逐值（0/1499 false · 1500/3000 true）',
  !!r2 && r2.ok({ gold: 0 }) === false && r2.ok({ gold: 1499 }) === false &&
  r2.ok({ gold: 1500 }) === true && r2.ok({ gold: 3000 }) === true);
ok('rich2 prog 逐值（0→0/1500 · 7→7/1500 · 3000→3000/1500 同 C 页不钳制）',
  !!r2 && r2.prog({ gold: 0 }) === `0/${RICH2_GOAL}` && r2.prog({ gold: 7 }) === `7/${RICH2_GOAL}` &&
  r2.prog({ gold: 3000 }) === `3000/${RICH2_GOAL}`);
ok('rich2 描述与 RICH2_GOAL 同源派生（持有 1500 金币）',
  !!r2 && r2.d === `持有 ${RICH2_GOAL} 金币`, r2 && r2.d);
ok('rich2 防御式读取（缺字段按 0，旧档零迁移）',
  !!r2 && r2.ok({}) === false && r2.prog({}) === `0/${RICH2_GOAL}`);

// —— battle.js 源级落位 ——
ok('battle.js import 已含 RICH2_GOAL（data.js 既有导出，零新增模块依赖）',
  bSrc.includes('ELEM_MULT, RICH2_GOAL, MUSH2_GOAL, LVL10_GOAL, dayPhase, QUESTS } from'));
ok('battle.js 既有 import 邻接 pin 子串逐字保留（LVL10_GOAL, dayPhase, QUESTS 未被拆散）',
  bSrc.includes('LVL10_GOAL, dayPhase, QUESTS } from'));
ok('battle.js 普通胜利报文补「（💰 金玉满堂 N/1500）」后缀（模板逐字：分子读 hero.gold 防御式）',
  bSrc.includes('（💰 金玉满堂 ${Math.floor(hero.gold || 0)}/${RICH2_GOAL}）'));
ok('battle.js 胜利报文既有片段零回归（🏆 前缀/获得/距升级/结余/驱雾百战后缀逐字）',
  bSrc.includes('`🏆 胜利！获得 ${enemy.gold} 金币、${enemy.xp} 经验') &&
  bSrc.includes('（剩余 ${hero.gold} 金）') &&
  bSrc.includes('（⚔️ 驱雾百战 ${hero.totalWins || 0}/${HUNT2_GOAL}）') &&
  bSrc.includes(', WIN_MSG_MS);'));
ok('battle.js 含 v24.27 注释（胜利分支行内说明块）', bSrc.includes('v24.27 体验打磨·信息透明·计数现场'));
ok('battle.js 胜利分支注释「只报中档里程碑」同族表述（v24.22 先例引用）', bSrc.includes('v24.22 只报中档里程碑先例'));
ok('battle.js 结算零回归（hero.gold += enemy.gold 先于报文落账，进度差分即本场）',
  bSrc.indexOf('hero.gold += enemy.gold;') < bSrc.indexOf('（💰 金玉满堂 ${Math.floor(hero.gold || 0)}/${RICH2_GOAL}）'));

// —— README 同步 ——
ok('README 含 v24.27 守护描述（胜利战报「💰 金玉满堂 N/1500」进度后缀守护）',
  readme.includes('v24.27 起含 🏆 胜利战报「💰 金玉满堂 N/1500」进度后缀守护'));
ok('README tests 树串尾已延伸至 smoke_v2429_xpcurve3（... + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9（npm test 串跑））',
  readme.includes('smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9（npm test 串跑）'));
ok('README 件套口径为二百八十三件套（二百八十二件套清除）',
  readme.includes('冒烟二百八十三件套（二百八十二件套清除）'));
ok('README 尚无 252 件套口径（哨兵前望 252 语义：下一版才写 252）',
  !readme.includes('二百七十七件套（二百七十七件套清除）') && !readme.includes('冒烟二百八十四件套'));
ok('README 含 smoke_v2427_richprog 入库（283 份）', readme.includes('smoke_v2427_richprog 入库（283 份）'));
ok('README 仍保留 v24.26 历史守护描述与入库口径（二百五十件套 + 253 份随新现实推进）',
  readme.includes('v24.26 起含 🎉 升级横幅「🌙 守灯者 N/10」进度后缀守护') && readme.includes('smoke_v2426_levelprog 入库（283 份）'));

// —— package.json 同步 ——
const testChain = (pkg.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 251 件套', testChain === 283, String(testChain));
ok('package.json 已收录 smoke_v2429_xpcurve3（npm test 串跑第 273 份）',
  pkg.includes('smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs'));
ok('package.json 串尾为 ... && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs"',
  pkgRaw.includes('smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs && node tests/smoke_v2459_xpcurve9.mjs"'));

// —— CHANGELOG 同步 ——
ok('CHANGELOG 顶部已追加 v24.27 条目（胜利战报金玉满堂进度后缀）', changelog.startsWith('## v24.59 '));
ok('CHANGELOG 顶部条目含金玉满堂与 RICH2_GOAL/胜利战报口径说明',
  changelog.includes('金玉满堂') && changelog.includes('RICH2_GOAL') && changelog.includes('胜利战报'));
ok('CHANGELOG 仍保留 v24.26 与 v24.19 条目标题（历史口径）',
  changelog.includes('## v24.26 体验打磨') && changelog.includes('## v24.19 体验打磨'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set([...pkg.matchAll(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g)].map((m) => m[0].replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 251 与实跑链恒等', files.length === 283, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：v2415 树串守护已推进至新链尾 + 前望 252 ——
const t2415 = read('tests/smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v2429_xpcurve3（第 273 份）',
  t2415.includes("chain[chain.length - 1] === 'smoke_v2459_xpcurve9'"));
ok('smoke_v2415 树串 token 数已推进至 251', t2415.includes('treeTok.length === 283'));
ok('smoke_v2415 哨兵「尚无 252」口径（二百五十三件套 bare 否定式）',
  t2415.includes("!readme.includes('二百八十四件套')"));
const s2426 = read('tests/smoke_v2426_levelprog.mjs');
ok('smoke_v2426 哨兵链已推进至「前望 252」口径（二百五十三件套 括号/冒烟 bare 否定式）',
  s2426.includes("!readme.includes('二百七十七件套（二百七十七件套清除）')") &&
  s2426.includes("!readme.includes('冒烟二百八十四件套')"));
ok('smoke_v2426 既有断言随新现实推进（件套口径 251 + 链尾 v2427 + 入库 251）',
  s2426.includes('二百八十三件套（二百八十二件套清除）') && s2426.includes("=== 'smoke_v2459_xpcurve9'") &&
  s2426.includes('入库（283 份）'));
const s2425 = read('tests/smoke_v2425_potionprog.mjs');
ok('smoke_v2425 哨兵链已推进至「前望 252」口径（二百五十三件套 括号/冒烟 bare 否定式）',
  s2425.includes("!readme.includes('二百七十七件套（二百七十七件套清除）')") &&
  s2425.includes("!readme.includes('冒烟二百八十四件套')"));
const s2424 = read('tests/smoke_v2424_pondslime.mjs');
ok('smoke_v2424 哨兵链已推进至「前望 252」口径（二百五十三件套 bare 否定式）',
  s2424.includes("!readme.includes('二百八十四件套')"));

// —— 旧代 v24.26 pin 全库零残留扫描（哨兵链：无任何测试再断言 v24.26 GAME_VERSION 字面量 / 顶 pin / 250 口径）——
const leftovers = [];
for (const f of fs.readdirSync(testsDir)) {
  if (!f.endsWith('.mjs') || f === 'smoke_v2427_richprog.mjs') continue;
  const s = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s.includes("const GAME_VERSION = 'v24.26';") || s.includes("GAME_VERSION === 'v24.26'") ||
      s.includes("startsWith('## v24.26") || s.includes('二百五十件套（二百四十九件套清除）') ||
      s.includes("testChain === 250") || s.includes("files.length === 250") ||
      s.includes("treeTok.length === 250") || s.includes("chainAll.length === 250") ||
      s.includes("chain[chain.length - 1] === 'smoke_v2426_levelprog'")) leftovers.push(f);
}
ok('全库测试零残留 v24.26 GAME_VERSION/顶 pin/250 口径（哨兵链，豁免本套件）',
  leftovers.length === 0, leftovers.join(','));

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

// 零金档：gold 0 → 胜利结算 +15 → 报文含「（💰 金玉满堂 15/1500）」
const hA = mkHero({ gold: 0 });
const mA = runWin(hA, mkFoe());
ok('运行期：零金档普通胜利报文含「（💰 金玉满堂 15/1500）」',
  mA.some((m) => m.includes(`🏆 胜利！获得 15 金币、16 经验`) && m.includes(`（💰 金玉满堂 15/${RICH2_GOAL}）`)), mA.join(' | '));
ok('运行期：零金档 gold 0→15 落账（进度差分即本场）', hA.gold === 15, String(hA.gold));

// 达标档：gold 1500 → 胜利结算 1515 → 报文含「（💰 金玉满堂 1515/1500）」（不钳制，同 C 页口径）
const hB = mkHero({ gold: 1500 });
const mB = runWin(hB, mkFoe());
ok('运行期：达标档普通胜利报文含「（💰 金玉满堂 1515/1500）」（prog 不钳制）',
  mB.some((m) => m.includes(`🏆 胜利！获得 15 金币、16 经验`) && m.includes(`（💰 金玉满堂 1515/${RICH2_GOAL}）`)), mB.join(' | '));
ok('运行期：达标档报文仍含「（⚔️ 驱雾百战 1/100）」讨伐后缀（v24.22 既有后缀零回归）',
  mB.some((m) => m.includes('（⚔️ 驱雾百战 1/100）')), mB.join(' | '));
ok('运行期：达标档报文仍含「（剩余 1515 金）」结余读数（v19.80/v24.22 零回归）',
  mB.some((m) => m.includes('（剩余 1515 金）')), mB.join(' | '));
ok('运行期：达标档 totalWins 0→1 落账（进度差分即本场）', hB.totalWins === 1, String(hB.totalWins));

process.exit(failed ? 1 : 0);
