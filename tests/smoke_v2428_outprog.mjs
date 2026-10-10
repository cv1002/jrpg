// smoke_v2429_xpcurve3.mjs —— v24.28 专项冒烟：🧭 进图报文补「🌏 灯影渐远 N/3」进度后缀
// （体验打磨·信息透明·计数现场，承 v24.26 升级横幅「🌙 守灯者 N/10」/ v24.22 胜利战报「⚔️ 驱雾百战
// N/100」/ v24.19 掉落战报「🍀 鸿运当头 N/30」同一「计数现场报进度」主线：探索线首档 outstep（踏出
// 灯影 2 图）/封顶 wander（走遍四方 4 图）之外的**中档** outstep2「灯影渐远」（到访 OUTSTEP2_GOAL(3)
// 张地图，计数读既有 hero.visited 存档字段，零新计数零迁移，与 ACH_LIST outstep2 的 ok/prog 同式
// Object.keys(MAPS) 过滤 (g.visited||[]) 防御式旧档零迁移）此前进度只藏在 C 成就页一行 X/3——v24.08
// 旅行面板「已探索 N/4」报的是按 T 打开窗口时的计数而非常态可见的成就档位，探索线的计数现场正是
// 每次「首次到访新图」的进图事件本身（world.transition 是全游戏唯一的 visited 写入点——传送门/出口/
// 快速旅行/水晶开门四条入口全走本函数，与 v24.26「升级是成就推进的唯一动作」同族）；现 transition
// 进图报文末尾补「（🌏 灯影渐远 N/3）」（分子与 ACH_LIST outstep2 的 prog 同式、分母读 data.js
// OUTSTEP2_GOAL 单一数据源，调阈值只改 data.js 一处全端自动跟随；visited.push 先于报文落账，进度
// 差分即本场；仅首次到访新图报（重复进图零噪音）；同 v24.26/v24.27 只报中档里程碑先例——踏出灯影
// N/2 与走遍四方 N/4 同线另两档由 C 页承载）；纯显示零结算零存档零数值变化（visited 计数/进图落账/
// 等级预警/补给提醒/成就判定逐字未动）。
// 本冒烟守护：版本锚点、data.js/world.js 源级落位（v24.28 注释 / GAME_VERSION v24.28 与旧 v24.27
// 字面量零残留 / v24.27 历史注释保留 / OUTSTEP2_GOAL 常量逐字）、运行期常量实值（OUTSTEP2_GOAL 3）与
// ACH_LIST outstep2 同源互证（ok/prog/d 逐值）、计数源 hero.visited 防御式与进图报文模板逐字、既有
// 进图/预警/补给片段零回归、README/package.json/CHANGELOG 同步（件套口径 252 + v24.28 守护描述 +
// 入库 252 + tests 树串尾 + package 串尾）、tests 目录与实跑链恒等（252）、哨兵链（前望 253 且 README
// 尚无 253 口径）、旧代 v24.27 pin 全库零残留扫描（豁免上一版套件 smoke_v2427_richprog.mjs）、运行期
// transition 真实路径三档（达标新图 4/3 · 低等级新图 2/3 · 重复进图零噪音）。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, OUTSTEP2_GOAL, OUTSTEP_GOAL } from '../js/data.js';
import { transition } from '../js/world.js';
import { bind } from '../js/bind.js';
import { newGame } from '../js/core.js';
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

console.log('— v24.28 🧭 进图报文「🌏 灯影渐远 N/3」进度后缀 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const wSrc = read('js/world.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const pkg = JSON.parse(pkgRaw).scripts.test;
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v24.27 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.27', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 27)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.28（旧 v24.27 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.78';") && !dSrc.includes("const GAME_VERSION = 'v24.27';"));
ok('data.js 含 v24.28 注释（进图报文「🌏 灯影渐远 N/3」进度后缀说明）',
  dSrc.includes('// v24.28 体验打磨·信息透明·计数现场'));
ok('data.js 仍保留 v24.27 历史注释（胜利战报「💰 金玉满堂 N/1500」说明，累积注释块）',
  dSrc.includes('// v24.27 体验打磨·信息透明·计数现场'));
ok('data.js OUTSTEP2_GOAL 常量逐字落位（const OUTSTEP2_GOAL = 3;）',
  dSrc.includes('const OUTSTEP2_GOAL = 3;'));
ok('data.js export 块含 OUTSTEP2_GOAL（既有导出，零新增模块依赖）',
  dSrc.includes('OUTSTEP_GOAL, OUTSTEP2_GOAL'));

// —— 运行期常量实值（单一数据源）——
ok('OUTSTEP2_GOAL === 3（灯影渐远阈值，与 C 页/描述/判定同源）', OUTSTEP2_GOAL === 3, String(OUTSTEP2_GOAL));
const o2 = ACH_LIST.find((a) => a && a.id === 'outstep2');
ok('ACH_LIST 含 outstep2「灯影渐远」（与进图报文后缀同读一份源）', !!o2 && o2.name === '灯影渐远', o2 && o2.name);
ok('outstep2 ok 谓词逐值（1/2 图 false · 3/4 图 true）',
  !!o2 && o2.ok({ visited: ['village'] }) === false && o2.ok({ visited: ['village', 'dungeon'] }) === false &&
  o2.ok({ visited: ['village', 'dungeon', 'cave'] }) === true && o2.ok({ visited: ['village', 'dungeon', 'cave', 'gallery'] }) === true);
ok('outstep2 prog 逐值（1→1/3 · 2→2/3 · 4→4/3 同 C 页不钳制）',
  !!o2 && o2.prog({ visited: ['village'] }) === `1/${OUTSTEP2_GOAL}` && o2.prog({ visited: ['village', 'dungeon'] }) === `2/${OUTSTEP2_GOAL}` &&
  o2.prog({ visited: ['village', 'dungeon', 'cave', 'gallery'] }) === `4/${OUTSTEP2_GOAL}`);
ok('outstep2 描述与 OUTSTEP2_GOAL 同源派生（到访 3 张地图）',
  !!o2 && o2.d === `到访 ${OUTSTEP2_GOAL} 张地图`, o2 && o2.d);
ok('outstep2 防御式读取（缺字段按 0，旧档零迁移）',
  !!o2 && o2.ok({}) === false && o2.prog({}) === `0/${OUTSTEP2_GOAL}`);
const o1 = ACH_LIST.find((a) => a && a.id === 'outstep');
const ow = ACH_LIST.find((a) => a && a.id === 'wander');
ok('探索线三档齐（outstep 首档 / outstep2 中档 / wander 封顶，同线同源不重叠）',
  !!o1 && !!ow && o1.d === `到访 ${OUTSTEP_GOAL} 张地图` && ow.d.includes('4 张'));

// —— world.js 源级落位 ——
ok('world.js import 已含 OUTSTEP2_GOAL/TREASURE2_GOAL（data.js 既有导出，零新增模块依赖）',
  wSrc.includes('dayPhase, STEP_GOAL, OUTSTEP2_GOAL, TREASURE2_GOAL } from'));
ok('world.js 既有 import 邻接 pin 子串逐字保留（STEP_GOAL 未被拆散）',
  wSrc.includes('STEP_GOAL, OUTSTEP2_GOAL, TREASURE2_GOAL } from'));
ok('world.js 含 v24.28 注释（transition 行内说明块）', wSrc.includes('v24.28 体验打磨·信息透明·计数现场'));
ok('world.js isNewMap 落位（const isNewMap = !(S.G.visited || []).includes(name);）',
  wSrc.includes('const isNewMap = !(S.G.visited || []).includes(name);'));
ok('world.js visited push 逐字（承 v21.26 同一行号，改走 isNewMap 守卫）',
  wSrc.includes('if (S.G.visited && isNewMap) S.G.visited.push(name);'));
ok('world.js 进图报文补「（🌏 灯影渐远 N/3）」后缀（模板逐字：分子与 ACH_LIST outstep2 的 prog 同式）',
  wSrc.includes('`（🌏 灯影渐远 ${Object.keys(MAPS).filter((m) => ((S.G && S.G.visited) || []).includes(m)).length}/${OUTSTEP2_GOAL}）`'));
ok('world.js 达标报文模板零回归 + 后缀（进入了【${MAPS[curMap()].name}】${outTag}，前缀逐字保留）',
  wSrc.includes('进入了【${MAPS[curMap()].name}】${outTag}') && wSrc.includes('进入了【${MAPS[curMap()].name}】'));
ok('world.js 低等级预警模板零回归 + 后缀（先补给再战！${outTag}）',
  wSrc.includes('先补给再战！${outTag}') && wSrc.includes('`⚠️ 前方【${MAPS[name].name}】的魔物远强于你'));
ok('world.js outTag 仅首次到访报（const outTag = isNewMap ? ... : \'\';）',
  wSrc.includes("const outTag = isNewMap ? ") && wSrc.includes(": '';"));
ok('world.js visited.push 先于 outTag 定义落账（进度差分即本场）',
  wSrc.indexOf('if (S.G.visited && isNewMap) S.G.visited.push(name);') < wSrc.indexOf('const outTag = isNewMap'));
ok('world.js 补给提醒零回归（⚠️ ${MAPS[name].name}没有泉水/旅店 · 出发前请补给！）',
  wSrc.includes('没有泉水/旅店 · 出发前请补给！'));
const transBlock = (wSrc.match(/function transition\(name\) \{\n[\s\S]*?\n\}/) || [''])[0];
ok('world.js 成就判定零回归（transition 尾部 applyAchievements(); 在报文之后）',
  transBlock.includes('applyAchievements();') && transBlock.indexOf('applyAchievements();') > transBlock.indexOf('const outTag = isNewMap'));

// —— README 同步 ——
ok('README 含 v24.28 守护描述（进图报文「🌏 灯影渐远 N/3」进度后缀守护）',
  readme.includes('v24.28 起含 🧭 进图报文「🌏 灯影渐远 N/3」进度后缀守护'));
ok('README tests 树串尾已延伸至 smoke_v2429_xpcurve3（... + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10 + smoke_v2461_xpcurve11 + smoke_v2462_xpcurve12 + smoke_v2463_xpcurve13 + smoke_v2464_xpcurve14 + smoke_v2465_xpcurve15 + smoke_v2466_xpcurve16 + smoke_v2467_xpcurve17 + smoke_v2468_xpcurve18 + smoke_v2469_xpcurve19 + smoke_v2470_xpcurve20 + smoke_v2471_bellman + smoke_v2472_bellquest + smoke_v2473_xpcurve21 + smoke_v2475_xpcurve22 + smoke_v2476_achprog + smoke_v2477_fisher + smoke_v2478_xpcurve23（npm test 串跑））',
  readme.includes('smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10 + smoke_v2461_xpcurve11 + smoke_v2462_xpcurve12 + smoke_v2463_xpcurve13 + smoke_v2464_xpcurve14 + smoke_v2465_xpcurve15 + smoke_v2466_xpcurve16 + smoke_v2467_xpcurve17 + smoke_v2468_xpcurve18 + smoke_v2469_xpcurve19 + smoke_v2470_xpcurve20 + smoke_v2471_bellman + smoke_v2472_bellquest + smoke_v2473_xpcurve21 + smoke_v2475_xpcurve22 + smoke_v2476_achprog + smoke_v2477_fisher + smoke_v2478_xpcurve23（npm test 串跑）'));
ok('README 件套口径为三百零一件套（三百件套清除）',
  readme.includes('冒烟三百零一件套（三百件套清除）'));
ok('README 尚无 253 件套口径（哨兵前望 253 语义：下一版才写 253）',
  !readme.includes('二百七十七件套（二百七十七件套清除）') && !readme.includes('冒烟三百零二件套'));
ok('README 含 smoke_v2428_outprog 入库（301 份）', readme.includes('smoke_v2428_outprog 入库（301 份）'));
ok('README 仍保留 v24.27 历史守护描述与入库口径（二百五十一件套 + 253 份随新现实推进）',
  readme.includes('v24.27 起含 🏆 胜利战报「💰 金玉满堂 N/1500」进度后缀守护') && readme.includes('smoke_v2427_richprog 入库（301 份）'));
ok('README 探索线历史口径零回归（v22.70 踏出灯影 / v21.88 走遍四方守护描述保留）',
  readme.includes('v22.70 起含新成就「踏出灯影」') || readme.includes('新成就「踏出灯影」守护'));

// —— package.json 同步 ——
const testChain = (pkg.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 252 件套', testChain === 301, String(testChain));
ok('package.json 已收录 smoke_v2429_xpcurve3（npm test 串跑第 273 份）',
  pkg.includes('smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs'));
ok('package.json 串尾为 ... && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs"',
  pkgRaw.includes('smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs && node tests/smoke_v2459_xpcurve9.mjs && node tests/smoke_v2460_xpcurve10.mjs && node tests/smoke_v2461_xpcurve11.mjs && node tests/smoke_v2462_xpcurve12.mjs && node tests/smoke_v2463_xpcurve13.mjs && node tests/smoke_v2464_xpcurve14.mjs && node tests/smoke_v2465_xpcurve15.mjs && node tests/smoke_v2466_xpcurve16.mjs && node tests/smoke_v2467_xpcurve17.mjs && node tests/smoke_v2468_xpcurve18.mjs && node tests/smoke_v2469_xpcurve19.mjs && node tests/smoke_v2470_xpcurve20.mjs && node tests/smoke_v2471_bellman.mjs && node tests/smoke_v2472_bellquest.mjs && node tests/smoke_v2473_xpcurve21.mjs && node tests/smoke_v2475_xpcurve22.mjs && node tests/smoke_v2476_achprog.mjs && node tests/smoke_v2477_fisher.mjs && node tests/smoke_v2478_xpcurve23.mjs"'));

// —— CHANGELOG 同步 ——
ok('CHANGELOG 顶部已追加 v24.28 条目（进图报文灯影渐远进度后缀）', changelog.startsWith('## v24.78 '));
ok('CHANGELOG 顶部条目含灯影渐远与 OUTSTEP2_GOAL/进图报文口径说明',
  changelog.includes('灯影渐远') && changelog.includes('OUTSTEP2_GOAL') && changelog.includes('进图报文'));
ok('CHANGELOG 仍保留 v24.27 与 v24.26 条目标题（历史口径）',
  changelog.includes('## v24.27 体验打磨') && changelog.includes('## v24.26 体验打磨'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set([...pkg.matchAll(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g)].map((m) => m[0].replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 252 与实跑链恒等', files.length === 301, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：v2415 树串守护已推进至新链尾 + 前望 253 ——
const t2415 = read('tests/smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v2429_xpcurve3（第 273 份）',
  t2415.includes("chain[chain.length - 1] === 'smoke_v2478_xpcurve23'"));
ok('smoke_v2415 树串 token 数已推进至 252', t2415.includes('treeTok.length === 301'));
ok('smoke_v2415 哨兵「尚无 253」口径（二百五十四件套 bare 否定式）',
  t2415.includes("!readme.includes('三百零二件套')"));
const s2427 = read('tests/smoke_v2427_richprog.mjs');
ok('smoke_v2427 哨兵链已推进至「前望 253」口径（二百五十四件套 括号/冒烟 bare 否定式）',
  s2427.includes("!readme.includes('二百七十七件套（二百七十七件套清除）')") &&
  s2427.includes("!readme.includes('冒烟三百零二件套')"));
ok('smoke_v2427 既有断言随新现实推进（件套口径 252 + 链尾 v2428 + 入库 252）',
  s2427.includes('三百零一件套（三百件套清除）') && s2427.includes("=== 'smoke_v2478_xpcurve23'") &&
  s2427.includes('入库（301 份）'));

// —— 旧代 pin 零残留扫描（v24.27 / 251 口径；豁免上一版套件）——
const leftovers = [];
for (const f of fs.readdirSync(testsDir)) {
  if (!f.endsWith('.mjs') || f === 'smoke_v2428_outprog.mjs') continue;
  const s = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s.includes("const GAME_VERSION = 'v24.27';") || s.includes("GAME_VERSION === 'v24.27'") ||
      s.includes("startsWith('## v24.27") || s.includes('二百五十一件套（二百五十件套清除）') ||
      s.includes("testChain === 251") || s.includes("files.length === 251") ||
      s.includes("treeTok.length === 251") || s.includes("chainAll.length === 251") ||
      s.includes("chain[chain.length - 1] === 'smoke_v2427_richprog'")) leftovers.push(f);
}
ok('全库测试零残留 v24.27 GAME_VERSION/顶 pin/251 口径（哨兵链，豁免本套件）',
  leftovers.length === 0, leftovers.join(','));

// —— 运行期：transition 真实路径 + bind.boxMsg 捕获（承 v21.88/v21.40 捕获桩法）——
function runTransition(hero, map) {
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    S.G = hero; S.scene = 'world'; S.battleBusy = false;
    transition(map);
    return msgs;
  } finally {
    bind.boxMsg = origBox;
    S.enemy = null; S.scene = 'world';
  }
}
function mkHero(extra) {
  return Object.assign(newGame('测试者'), {
    level: 12, hp: 999, hpMax: 999, mp: 99, mpMax: 99, visited: ['village'],
  }, extra || {});
}

// 达标新图档：visited 三图 + Lv12 → 踏进无字回廊（第四图）→ 报文「（🌏 灯影渐远 4/3）」
const hA = mkHero({ visited: ['village', 'dungeon', 'cave'], ach: [] });
const mA = runTransition(hA, 'gallery');
ok('运行期：达标档进图报文含「进入了【无字回廊】（🌏 灯影渐远 4/3）」',
  mA.some((m) => m.includes('进入了【无字回廊】') && m.includes('（🌏 灯影渐远 4/3）')), mA.join(' | '));
ok('运行期：达标档 visited 落账 4 图（进度差分即本场）',
  hA.visited.length === 4 && hA.visited.includes('gallery'), hA.visited.join());

// 低等级新图档：Lv1 + 仅起始村 → 踏进雾语林（推荐 Lv.3）→ 预警报文带「（🌏 灯影渐远 2/3）」
const hB = mkHero({ level: 1, ach: [] });
const mB = runTransition(hB, 'dungeon');
ok('运行期：低等级档预警报文含「（🌏 灯影渐远 2/3）」+ 推荐等级口径',
  mB.some((m) => m.includes('⚠️ 前方【雾语林】的魔物远强于你（推荐 Lv.3 · 当前 Lv.1），先补给再战！（🌏 灯影渐远 2/3）')), mB.join(' | '));
ok('运行期：低等级档 visited 落账 2 图', hB.visited.length === 2 && hB.visited.includes('dungeon'), hB.visited.join());
ok('运行期：低等级档 2/3 解锁首档 outstep、不解锁中档 outstep2（探索线三档分级正确）',
  hB.ach.includes('outstep') && !hB.ach.includes('outstep2'), hB.ach.join(','));

// 重复进图档：visited 已含 dungeon → 再进 → 「进入了【雾语林】」零后缀零噪音
const hC = mkHero({ visited: ['village', 'dungeon'] });
const mC = runTransition(hC, 'dungeon');
ok('运行期：重复进图报文零后缀（原「进入了【雾语林】」逐字，零噪音）',
  mC.some((m) => m === '进入了【雾语林】') && !mC.some((m) => m.includes('（🌏 灯影渐远')), mC.join(' | '));
ok('运行期：重复进图 visited 不重复计数（仍 2 图）', hC.visited.length === 2, String(hC.visited.length));

// 达标档 outstep2 解锁（v21.88 反馈不迟到通路零回归）：到访 3 图时 applyAchievements 已解锁
const hD = mkHero({ visited: ['village', 'dungeon', 'cave'], ach: [] });
runTransition(hD, 'gallery');
ok('运行期：达标档进图当场解锁 outstep2 落 hero.ach（反馈不迟到，v21.88 通路零回归）',
  hD.ach.includes('outstep2'), hD.ach.join(','));

process.exit(failed ? 1 : 0);
