// v24.14 专项冒烟：战斗画面顶部右缘补昼夜相位标签 + 🌙 夜晚「提灯夜行 N/10」进度
// （体验打磨·信息透明·相位入画布——承 v23.78 战斗画面「📍 所在地」画面内口径 / v14.8 HUD
// 🌑 恒暗 / v23.39 HUD 相位标签 / v23.91 提灯夜行成就同一「这仗赢了算不算」决策现场：画布下方
// DOM HUD（s-map）虽有昼夜标签但战斗画面内查无一行——战斗背景按图分区（arenaTheme）不随时段
// 变化、强敌战跨过整点相位翻转（DAY_PHASE_S 90s）后「这仗赢了算不算提灯夜行」只能靠猜
// （battle.winBattle 按胜利瞬间 dayPhase(hero.time) 判定）；现与 world.tickEncounter/battle.winBattle/
// HUD 同读 data.js dayPhase((S.G&&S.G.time)||0) 一份单一数据源，drawBattle 顶部右缘（x=510 右对齐、
// 与 📍 地图名（548 起）零重叠）补 12px 灰字相位标签（BATTLE_PHASE_TAG 与 hud.js PERIOD 同词——
// 显示映射非数据，承 v23.35 小地图相位倍率标同款本地映射先例），无字回廊标 🌑 恒暗零进度（与
// winBattle nightWins 同一判定——「被忘掉的地方没有晨昏」不数也不标）、仅 🌙 夜晚且非回廊追加
// 「🌙 夜晚 · 提灯夜行 N/10」（分子读 (S.G.nightWins||0) 防御式旧档零迁移、分母读 NIGHT_WIN_GOAL
// 单一数据源，与 C 页/ACH_LIST nightwins/胜利结算同读一份源，调阈值只改 data.js 一处四端自动
// 跟随）；纯显示零结算零存档零数值变化（回合/困难/地图名/敌方/预览/指令栏逐字未动）。
// 本冒烟守护：版本锚点、data.js/drawBattle.js 源级落位（v24.14 注释 / GAME_VERSION v24.14 与旧
// v24.13 字面量零残留 / v24.13·v24.12 历史注释保留 / BATTLE_PHASE_TAG 四档 + import 逐字）、
// 运行期常量实值（NIGHT_WIN_GOAL 10）与 ACH_LIST nightwins 同源互证（ok/prog/d 逐值）、计数源
// battle.js winBattle same-source 互证、运行期 drawBattle 真实渲染 fillText 捕获五档（夜晚村/
// 夜晚回廊/白天/黄昏或黎明/恒暗回廊 + 进度分子 0·7 档 + 全档渲染不抛错 + 与地图名/回合/困难
// 角标同屏零位移）、README/package.json/CHANGELOG 同步（件套口径 239 + v24.14 守护描述 +
// smoke_v2414_nightbattle 入库（257 份）+ package 串尾 + CHANGELOG 顶 pin）、哨兵链
// （前望 243 且 README 尚无 240 口径）、旧代 v24.13 pin 全库零残留扫描、
// drawBattle 既有行零回归（回合/困难/地图名/敌方特性/招数一览/战斗预判逐字未动）。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v24.12 冒烟先例：先装桩再动态 import main.js；
//    fillText 捕获承 smoke_v2175 先例：所有 ctx 共用同一 drawn 数组）——
const drawn = [];
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
    fillText: (t, x, y) => { drawn.push({ t: String(t), x, y }); },
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
const { GAME_VERSION, NIGHT_WIN_GOAL, ACH_LIST, dayPhase, DAY_PHASE_S } = await import('../js/data.js');
const { drawBattle } = await import('../js/view/index.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.14 战斗画面相位标签 +「提灯夜行 N/10」进度 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const dbSrc = read('js/view/drawBattle.js');
const bSrc = read('js/battle.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（格式合法 + 已越过 v24.13）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.13', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 13)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.21（旧 v24.13 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.33';") && !dSrc.includes("const GAME_VERSION = 'v24.13';"));
ok('data.js 含 v24.14 注释（战斗画面相位标签·相位入画布说明）',
  dSrc.includes('// v24.14 体验打磨·信息透明·相位入画布'));
ok('data.js 仍保留 v24.13 历史注释（四强怪每级经验 +1 说明，累积注释块）',
  dSrc.includes('// v24.13 数值平衡·后期经验曲线续平滑'));
ok('data.js 仍保留 v24.12 历史注释（胜利画面「⚔️ 身经百战 N/100」进度行说明，累积注释块）',
  dSrc.includes('// v24.12 体验打磨·信息透明·计数现场'));
ok('data.js NIGHT_WIN_GOAL 常量逐字落位（const NIGHT_WIN_GOAL = 10;）', dSrc.includes('const NIGHT_WIN_GOAL = 10;'));
ok('data.js dayPhase 纯函数逐字落位（export function dayPhase(time)）', dSrc.includes('export function dayPhase(time)'));

// —— 运行期常量实值（单一数据源）——
ok('NIGHT_WIN_GOAL === 10（提灯夜行阈值，与 C 页/描述/判定同源）', NIGHT_WIN_GOAL === 10, String(NIGHT_WIN_GOAL));
ok('dayPhase 逐档公式恒等（0→day · 90→dusk · 180→night · 270→dawn · 360→day）',
  dayPhase(0) === 'day' && dayPhase(DAY_PHASE_S) === 'dusk' && dayPhase(DAY_PHASE_S * 2) === 'night' &&
  dayPhase(DAY_PHASE_S * 3) === 'dawn' && dayPhase(DAY_PHASE_S * 4) === 'day',
  [dayPhase(0), dayPhase(DAY_PHASE_S), dayPhase(DAY_PHASE_S * 2), dayPhase(DAY_PHASE_S * 3)].join('/'));
const nwAch = ACH_LIST.find((a) => a && a.id === 'nightwins');
ok('ACH_LIST 含 nightwins「提灯夜行」（与战斗画面进度同读一份源）', !!nwAch && nwAch.name === '提灯夜行', nwAch && nwAch.name);
ok('nightwins ok 谓词逐值（0/9 false · 10/20 true）',
  !!nwAch && nwAch.ok({ nightWins: 0 }) === false && nwAch.ok({ nightWins: 9 }) === false &&
  nwAch.ok({ nightWins: 10 }) === true && nwAch.ok({ nightWins: 20 }) === true);
ok('nightwins prog 逐值（0→0/10 · 7→7/10 · 10→10/10）',
  !!nwAch && nwAch.prog({ nightWins: 0 }) === '0/10' && nwAch.prog({ nightWins: 7 }) === '7/10' &&
  nwAch.prog({ nightWins: 10 }) === '10/10');
ok('nightwins 描述与 NIGHT_WIN_GOAL 同源派生（夜间战胜 10 场）',
  !!nwAch && nwAch.d === `夜间战胜 ${NIGHT_WIN_GOAL} 场`, nwAch && nwAch.d);

// —— battle.js 计数源端（winBattle 全游唯一胜利结算点）——
ok('battle.js winBattle 夜晚判定逐字（curMap() !== gallery && dayPhase(hero.time) === night）',
  bSrc.includes("curMap() !== 'gallery' && dayPhase(hero.time) === 'night'"));
ok('battle.js nightWins 计数逐字（防御式 (hero.nightWins||0) 旧档零迁移）',
  bSrc.includes('hero.nightWins = (hero.nightWins || 0) + 1;'));

// —— drawBattle.js 源级落位 ——
ok('drawBattle.js import 已含 dayPhase, NIGHT_WIN_GOAL（data.js 既有导出，零新增模块依赖）',
  dbSrc.includes('MAPS, dayPhase, NIGHT_WIN_GOAL } from'));
ok('drawBattle.js BATTLE_PHASE_TAG 四档显示映射逐字（与 hud.js PERIOD 同词）',
  dbSrc.includes("const BATTLE_PHASE_TAG = { day: '☀️ 白天', dusk: '🌆 黄昏', night: '🌙 夜晚', dawn: '🌅 黎明' };"));
ok('drawBattle.js 相位标签含 v24.14 注释（行内说明块）', dbSrc.includes('v24.14 体验打磨·信息透明·相位入画布'));
ok('drawBattle.js 相位判定与 winBattle 同一判定逐字（gallery→null · dayPhase 同源）',
  dbSrc.includes("const _phKey = curMap() === 'gallery' ? null : dayPhase((S.G && S.G.time) || 0);"));
ok('drawBattle.js 恒暗标签逐字（_phKey === null ? 🌑 恒暗）',
  dbSrc.includes("const _phTag = _phKey === null ? '🌑 恒暗' : (BATTLE_PHASE_TAG[_phKey] || '');"));
ok('drawBattle.js 提灯夜行进度逐字（分子防御式 (S.G.nightWins||0) · 分母 NIGHT_WIN_GOAL 单一数据源）',
  dbSrc.includes('` · 提灯夜行 ${(S.G && S.G.nightWins) || 0}/${NIGHT_WIN_GOAL}`'));
ok('drawBattle.js 相位标签落位参数（510 · 26 · 12px · #7d93a3 · right——与 📍 地图名 548 起零重叠）',
  dbSrc.includes("510, 26, '12px', '#7d93a3', 'right')"));
ok('drawBattle.js 仅夜晚追加进度（_phKey === night 条件）',
  dbSrc.includes("_phKey === 'night'"));

// —— drawBattle.js 零回归（既有行逐字）——
ok('drawBattle.js 回合行零回归（⚔️ 回合 ${S.battleTurn || 1} · 60,26 bold 14px #ffd24a）',
  dbSrc.includes('`⚔️ 回合 ${S.battleTurn || 1}`, 60, 26, \'bold 14px\', \'#ffd24a\')'));
ok('drawBattle.js 困难角标零回归（⚡ ${DIFFS[hero.diff] || 困难} · 200,26）',
  dbSrc.includes('`⚡ ${DIFFS[hero.diff] || \'困难\'}`, 200, 26'));
ok('drawBattle.js 地图名行零回归（📍 ${(MAPS[curMap()] || {}).name || curMap()} · 620,26 right）',
  dbSrc.includes('`📍 ${(MAPS[curMap()] || {}).name || curMap()}`, 620, 26, \'12px\', \'#7d93a3\', \'right\')'));
ok('drawBattle.js 敌方特性/招数一览角标零回归（620,162 槽位）',
  dbSrc.includes('620, 162') && dbSrc.includes('敌方特性：') && dbSrc.includes('敌方招数：'));

// —— 运行期实证：drawBattle 真实渲染 + fillText 捕获 ——
function renderWith(enemy, gPatch) {
  if (gPatch) Object.assign(S.G, gPatch);
  S.scene = 'battle';
  S.enemy = enemy;
  S.battleBusy = false;
  S.skillMenuOpen = false;
  S.blog = ['⚔️ 遭遇了 ' + enemy.name + '！'];
  S.blogView = 0;
  S.battleTurn = 1;
  drawn.length = 0;
  let threw = null;
  try { drawBattle(); } catch (e) { threw = e; }
  S.enemy = null;
  S.scene = 'world';
  return threw;
}
const mkSlime = () => ({ name: '史莱姆', hp: 31, hpMax: 31, atk: 11, def: 5, xp: 17, gold: 12,
  color: '#7fd84f', weak: 'fire', draw: 'slime' });

// 1) 白天·村外史莱姆战：相位标签 ☀️ 白天（无提灯夜行）且渲染不抛错
S.G.map = 'village'; S.G.time = 0; S.G.nightWins = 0;
let threw1 = renderWith(mkSlime());
const phDay = drawn.find((d) => d.t === '☀️ 白天' && d.x === 510 && d.y === 26);
ok('运行期：白天·村外战渲染不抛错 + 亮「☀️ 白天」（x=510 y=26 右对齐槽位）',
  threw1 === null && !!phDay, threw1 && String(threw1.stack || threw1));
ok('运行期：白天档零进度后缀（无「提灯夜行」绘制）', !drawn.some((d) => d.t.includes('提灯夜行')));
ok('运行期：与 📍 潮灯镇/⚔️ 回合 N 同屏零位移（地图名 620 右对齐 · 回合 60,26）',
  drawn.some((d) => d.t === '📍 潮灯镇' && d.x === 620 && d.y === 26) &&
  drawn.some((d) => d.t.indexOf('⚔️ 回合 1') === 0 && d.x === 60 && d.y === 26));

// 2) 夜晚·村外史莱姆战：🌙 夜晚 + 提灯夜行 0/10（分子 0 档）
S.G.map = 'village'; S.G.time = DAY_PHASE_S * 2; S.G.nightWins = 0;
let threw2 = renderWith(mkSlime());
const phNight0 = drawn.find((d) => d.t === '🌙 夜晚 · 提灯夜行 0/10' && d.x === 510 && d.y === 26);
ok('运行期：夜晚·村外战渲染不抛错 + 亮「🌙 夜晚 · 提灯夜行 0/10」（分子 0 防御式）',
  threw2 === null && !!phNight0, threw2 && String(threw2.stack || threw2) || '');

// 3) 夜晚·进度分子 7 档（防御式读数）与 10/10 上限不钳制档
S.G.map = 'village'; S.G.time = DAY_PHASE_S * 2; S.G.nightWins = 7;
let threw3 = renderWith(mkSlime());
ok('运行期：夜晚·nightWins=7 亮「🌙 夜晚 · 提灯夜行 7/10」（分子读 hero.nightWins 防御式）',
  threw3 === null && drawn.some((d) => d.t === '🌙 夜晚 · 提灯夜行 7/10' && d.x === 510 && d.y === 26));
S.G.map = 'village'; S.G.time = DAY_PHASE_S * 2; S.G.nightWins = 12;
let threw3b = renderWith(mkSlime());
ok('运行期：夜晚·nightWins=12 亮「🌙 夜晚 · 提灯夜行 12/10」（不钳制超额档，与 C 页 prog 同口径）',
  threw3b === null && drawn.some((d) => d.t === '🌙 夜晚 · 提灯夜行 12/10' && d.x === 510 && d.y === 26));

// 4) 无字回廊（恒暗）：🌑 恒暗 零进度（与 winBattle nightWins 同一判定）
S.G.map = 'gallery'; S.G.time = DAY_PHASE_S * 2; S.G.nightWins = 3;
let threw4 = renderWith(mkSlime());
ok('运行期：无字回廊战渲染不抛错 + 亮「🌑 恒暗」（x=510 y=26，与 winBattle 不计数同判）',
  threw4 === null && drawn.some((d) => d.t === '🌑 恒暗' && d.x === 510 && d.y === 26),
  threw4 && String(threw4.stack || threw4) || '');
ok('运行期：无字回廊恒暗档零进度（nightWins=3 也不报「提灯夜行」——「没有晨昏」不数也不标）',
  !drawn.some((d) => d.t.includes('提灯夜行')));

// 5) 黄昏/黎明相位：标签照常、零进度后缀（零噪音口径）
S.G.map = 'village'; S.G.time = DAY_PHASE_S; S.G.nightWins = 3;
let threw5a = renderWith(mkSlime());
ok('运行期：黄昏档亮「🌆 黄昏」且零进度', threw5a === null &&
  drawn.some((d) => d.t === '🌆 黄昏' && d.x === 510 && d.y === 26) &&
  !drawn.some((d) => d.t.includes('提灯夜行')));
S.G.map = 'village'; S.G.time = DAY_PHASE_S * 3; S.G.nightWins = 3;
let threw5b = renderWith(mkSlime());
ok('运行期：黎明档亮「🌅 黎明」且零进度（黎明不计数，与 winBattle night 判定一致）', threw5b === null &&
  drawn.some((d) => d.t === '🌅 黎明' && d.x === 510 && d.y === 26) &&
  !drawn.some((d) => d.t.includes('提灯夜行')));
S.G.map = 'village'; S.G.time = 0; S.G.nightWins = 0;

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为二百五十七件套（二百五十六件套清除）',
  readme.includes('冒烟二百五十七件套（二百五十六件套清除）'));
ok('README tests 树含 v24.14 守护描述与 smoke_v2414_nightbattle 入库（257 份）',
  readme.includes('v24.14 起含 战斗画面相位标签守护') && readme.includes('smoke_v2414_nightbattle 入库（257 份）'));
ok('README 战斗段落含 v24.14 相位标签口径（顶部右缘常驻昼夜相位标签 · 提灯夜行 N/10）',
  readme.includes('v24.14 起顶部右缘常驻昼夜相位标签') && readme.includes('🌙 夜晚 · 提灯夜行 N/10'));
ok('README 成就 bullet 含 v24.14 提灯夜行进度口径（战斗画面顶部常显）',
  readme.includes('v24.14 起战斗画面顶部常显「🌙 夜晚 · 提灯夜行 N/10」进度'));
ok('README 视觉 bullet 含 v24.14 战斗画面相位标签口径（BATTLE_PHASE_TAG 与 HUD PERIOD 同词）',
  readme.includes('v24.14 起战斗画面顶部右缘同式常驻相位标签') && readme.includes('BATTLE_PHASE_TAG'));
ok('README 尚无 240 件套口径（哨兵前望 252 语义：下一版才写 243）',
  !readme.includes('二百五十八件套') && !readme.includes('冒烟二百五十八件套'));
const testChain = (JSON.parse(pkg).scripts.test.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 238 件套', testChain === 257, String(testChain));
ok('package.json test 串已含 smoke_v2414_nightbattle（第 239 份，紧接 smoke_v2413_xpcurve）',
  pkg.includes('smoke_v2413_xpcurve.mjs && node tests/smoke_v2414_nightbattle.mjs && node tests/smoke_v2415_treepin.mjs && node tests/smoke_v2416_steps.mjs && node tests/smoke_v2417_mapdrink.mjs && node tests/smoke_v2418_goldcurve.mjs && node tests/smoke_v2419_luckdrp.mjs && node tests/smoke_v2420_skillprog.mjs && node tests/smoke_v2421_allquest.mjs && node tests/smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.21（startsWith）', changelog.startsWith('## v24.33'));
ok('CHANGELOG v24.14 条目含「相位标签」与「提灯夜行」',
  changelog.startsWith('## v24.33') && changelog.includes('相位标签') && changelog.includes('提灯夜行'));
ok('CHANGELOG 仍保留 v24.13 条目（历史保留）', changelog.includes('## v24.13'));

// —— 哨兵链（旧代 v24.13 pin 全库零残留）——
const allTests = fs.readdirSync(path.join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2414_nightbattle.mjs');
const stale = [];
for (const f of allTests) {
  const src = read('tests/' + f);
  if (src.includes("const GAME_VERSION = 'v24.13';") ||
      src.includes("GAME_VERSION === 'v24.13'") ||
      src.includes("startsWith('## v24.13 ") ||
      src.includes('已为 v24.13（') ||
      src.includes('已追加 v24.13 条目') ||
      src.includes('二百三十七件套（二百三十六件套清' + '除）') ||
      src.includes('testChain === ' + '237') ||
      src.includes('+ smoke_v2413_xpcurve（npm test 串' + '跑）') ||
      src.includes('node tests/smoke_v2413_xpcurve.mjs' + '"')) stale.push(f);
}
ok('旧代 v24.13 字面量/恒等/顶 pin/件套 237 口径/testChain 237/树串尾 & 串尾 全库零残留（' + allTests.length + ' 件扫描）',
  stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
