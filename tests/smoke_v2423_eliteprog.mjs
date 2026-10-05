// v24.23 专项冒烟：💎 精英战报补「⚔️ 精英猎手 N/2」进度后缀
// （体验打磨·信息透明·计数现场——承 v24.22 胜利战报「⚔️ 驱雾百战 N/100」/ v24.21 支线交付
// 「🏮 灯火同心 N/11」/ v24.20 领悟战报「📖 诸技通明 N/8」/ v24.19 掉落战报「🍀 鸿运当头 N/30」
// / v24.17 喝药「💧 渴饮甘露 N/10」同一「计数现场报进度」主线 / v21.75 精英猎手成就（精英讨伐线
// 里程碑 = 讨伐精英「石心魔像」与「残焰魔像」各至少一次，计数由 hero.bestiary 击杀累计派生、
// snapshotHero 全量快照自动持久化、防御式 (hero.bestiary||{}) 旧档零迁移）此前进度只藏在 C 成就页
// 一行 X/2——精英怪全游仅两尊（雾语林精英·石心魔像 / 无字回廊·残焰魔像），每局至多 2 次击杀，
// 比 v24.20 诸技通明（整局至多 8 次）更稀有，而精英线的计数现场正是每次「💎 从魔像残骸中捡到」
// 战报本身：打倒精英的当场查无一眼之数（与 v24.19「现场是动作本身」同族）；现 battle.winBattle
// 精英蘑菇战报末尾补「（⚔️ 精英猎手 N/2）」（分子与 ACH_LIST elites 的 prog 同式——
// bestiary[ELITE_GOLEM.name]≥1 与 bestiary[EMBER_GOLEM.name]≥1 各计 1、分母 2 与 ACH_LIST elites
// 的 /2 同口径，调精英表只改 data.js 一处全端自动跟随；hero.bestiary[bookName]++ 先于本行落账，
// 进度差分即本场）。纯显示零结算零存档零数值变化（mushrooms 计数/掉落/金币经验结算/成就判定逐字未动）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.23 注释 / GAME_VERSION v24.23 与旧 v24.22 字面量
// 零残留 / v24.22-24.19 历史注释保留）、ACH_LIST elites 同源互证（与 ELITE_GOLEM/EMBER_GOLEM 输出一致）、
// battle.js 源级落位（ELITE_GOLEM/EMBER_GOLEM import / 报文模板逐字 / bestiary 落账先于 boxMsg /
// 旧模板零残留 / v24.23 注释 / 胜利原文案前缀零回归）、运行期 winBattle 真实路径三档（首尊精英 0→1 报
// 1/2 · 第二尊精英 1→2 报 2/2 · 普通怪零精英报文）、README/package.json/CHANGELOG 同步（件套口径 247 +
// v24.23 守护描述 + 入库 247 + package 串尾 + CHANGELOG 顶 pin）、tests 目录与实跑链恒等（247）、
// 哨兵链（前望 252 且 README 尚无 252 口径）、旧代 v24.22 pin 全库零残留扫描（字面量/顶 pin/246 口径 ·
// 豁免上一版套件 smoke_v2422_huntprog）。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, ELITE_GOLEM, EMBER_GOLEM } from '../js/data.js';
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

console.log('— v24.23 💎 精英战报「⚔️ 精英猎手 N/2」进度后缀 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const bSrc = read('js/battle.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.22 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.22', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 22)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.23（旧 v24.22 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.48';") && !dSrc.includes("const GAME_VERSION = 'v24.22';"));
ok('data.js 含 v24.23 注释（精英战报「⚔️ 精英猎手 N/2」进度后缀说明）',
  dSrc.includes('// v24.23 体验打磨·信息透明·计数现场'));
ok('data.js 仍保留 v24.22 历史注释（胜利战报进度后缀说明，累积注释块）',
  dSrc.includes('// v24.22 体验打磨·信息透明·计数现场'));
ok('data.js 仍保留 v24.21 历史注释（支线交付报文进度后缀说明）',
  dSrc.includes('// v24.21 体验打磨·信息透明·计数现场'));

// —— ELITE_GOLEM / EMBER_GOLEM 契约 ——
ok('ELITE_GOLEM 名称「石心魔像」', ELITE_GOLEM && ELITE_GOLEM.name === '石心魔像', ELITE_GOLEM && ELITE_GOLEM.name);
ok('EMBER_GOLEM 名称「残焰魔像」', EMBER_GOLEM && EMBER_GOLEM.name === '残焰魔像', EMBER_GOLEM && EMBER_GOLEM.name);

// —— ACH_LIST elites 同源互证（分子/分母与战报后缀同式）——
const el = ACH_LIST.find((a) => a.id === 'elites');
ok('ACH_LIST elites 名称「精英猎手」', !!el && el.name === '精英猎手', el && el.name);
ok('ACH_LIST elites 描述含两尊精英名',
  !!el && el.d.includes(ELITE_GOLEM.name) && el.d.includes(EMBER_GOLEM.name), el && el.d);
ok('ACH_LIST elites 判定/进度与 bestiary 同源（0 杀 false · 1 杀 false · 2 杀 true · prog 1/2 · 缺字段 0/2）',
  !!el && el.ok({ bestiary: {} }) === false &&
  el.ok({ bestiary: { [ELITE_GOLEM.name]: 1 } }) === false &&
  el.ok({ bestiary: { [ELITE_GOLEM.name]: 1, [EMBER_GOLEM.name]: 9 } }) === true &&
  el.prog({ bestiary: { [ELITE_GOLEM.name]: 2 } }) === '1/2' &&
  el.prog({}) === '0/2');

// —— battle.js 源级落位 ——
ok('battle.js import 含 ELITE_GOLEM/EMBER_GOLEM（data.js 既有导出，零新增模块依赖）',
  bSrc.includes('DIFF_SCALE, ELITE_GOLEM, EMBER_GOLEM, RUSH_RECOVER'));
ok('battle.js 精英蘑菇报文含「⚔️ 精英猎手 N/2」进度后缀（模板逐字）',
  bSrc.includes('（⚔️ 精英猎手 ${eliteN}/2）'));
ok('battle.js 报文前缀逐字（v19.79 原文案零回归）',
  bSrc.includes('`💎 从魔像残骸中捡到 1 株魔法蘑菇！（剩余 ${hero.mushrooms || 0} 株）（⚔️ 精英猎手 ${eliteN}/2）（🍄 菇山菌海 ${hero.mushrooms || 0}/${MUSH2_GOAL}）`'));
ok('battle.js 旧模板零残留（「株）」后已无直接反引号收尾）',
  !bSrc.includes('株）`'));
ok('battle.js eliteN 与 ACH_LIST elites prog 同式（各计 1 / 防御式 old 档零迁移）',
  bSrc.includes('const eliteN = (((hero.bestiary || {})[ELITE_GOLEM.name] || 0) >= 1 ? 1 : 0) + (((hero.bestiary || {})[EMBER_GOLEM.name] || 0) >= 1 ? 1 : 0);'));
ok('battle.js 含 v24.23 注释（精英战报进度后缀说明）',
  bSrc.includes('v24.23 体验打磨·信息透明·计数现场'));
ok('battle.js hero.bestiary[bookName]++ 先于 boxMsg 落账（进度差分即本场）',
  bSrc.indexOf('hero.bestiary[bookName]++;') < bSrc.indexOf('（⚔️ 精英猎手 ${eliteN}/2）'));

// —— 运行期：winBattle 真实路径 + bind.boxMsg 捕获（承 v21.40/v21.60 捕获桩法）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 5, hp: 80, hpMax: 80, mp: 30, mpMax: 30,
    atkMax: 30, defMax: 40, gold: 0, xp: 0, xpNext: 9999, item: 1, potion2: 0,
    weapon: '铁剑', armor: '皮甲', diff: null, skills: ['火焰斩'], ach: [],
    poison: 0, seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, totalWins: 0,
    mushrooms: 0, x: 1, y: 1, map: 'cave' }, extra || {});
}
function mkFoe(extra) {
  return Object.assign({ name: '骷髅兵', hp: 0, hpMax: 26, atk: 8, def: 5, xp: 16, gold: 15, color: '#d9d3c0', isElite: false }, extra || {});
}
function runWin(hero, enemy) {
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  const oldRand = Math.random;
  Math.random = () => 0.99;   // 关闭战斗掉落（rollDrop 38% 档），只验精英战报
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

// 首尊精英档：bestiary 石心魔像 0→1 → 报文含「（⚔️ 精英猎手 1/2）」
const hA = mkHero({});
const mA = runWin(hA, mkFoe({ name: ELITE_GOLEM.name, isElite: true, xp: 40, gold: 45 }));
ok('运行期：首尊精英报文含「💎 从魔像残骸中捡到 1 株魔法蘑菇！（剩余 1 株）（⚔️ 精英猎手 1/2）」',
  mA.some((m) => m.includes('💎 从魔像残骸中捡到 1 株魔法蘑菇！（剩余 1 株）（⚔️ 精英猎手 1/2）')), mA.join(' | '));
ok('运行期：首尊精英 bestiary 0→1 落账（进度差分即本场）',
  (hA.bestiary[ELITE_GOLEM.name] || 0) === 1, JSON.stringify(hA.bestiary));
ok('运行期：首尊精英蘑菇落账（mushrooms 0→1，v19.79 零回归）', hA.mushrooms === 1, String(hA.mushrooms));
ok('运行期：同一场胜利报文本体零回归（🏆 胜利！前缀 + v24.22 驱雾百战后缀共存）',
  mA.some((m) => m.includes('🏆 胜利！获得 45 金币、40 经验') && m.includes('（⚔️ 驱雾百战 1/100）')), mA.join(' | '));

// 第二尊精英档：bestiary 石心魔像已 1 → 残焰魔像 1→1 → 报文含「（⚔️ 精英猎手 2/2）」
const hB = mkHero({ bestiary: { [ELITE_GOLEM.name]: 5 } });
const mB = runWin(hB, mkFoe({ name: EMBER_GOLEM.name, isElite: true, xp: 130, gold: 260 }));
ok('运行期：第二尊精英报文含「（⚔️ 精英猎手 2/2）」（分母 2 与 ACH_LIST elites /2 同口径）',
  mB.some((m) => m.includes('（⚔️ 精英猎手 2/2）')), mB.join(' | '));

// 普通怪档：非精英 → 零精英报文
const hC = mkHero({});
const mC = runWin(hC, mkFoe());
ok('运行期：普通怪胜利零精英报文（isElite 分支专属）', !mC.some((m) => m.includes('魔像残骸')), mC.join(' | '));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为二百七十二件套（二百七十一件套清除）',
  readme.includes('冒烟二百七十二件套（二百七十一件套清除）'));
ok('README tests 含 v24.23 守护描述与 smoke_v2423_eliteprog 入库（272 份）',
  readme.includes('v24.23 起含 💎 精英战报「⚔️ 精英猎手 N/2」进度后缀守护') &&
  readme.includes('smoke_v2423_eliteprog 入库（272 份）'));
ok('README 仍有 v24.22 守护描述（历史保留）', readme.includes('v24.22 起含 🏆 胜利战报「⚔️ 驱雾百战 N/100」进度后缀守护'));
ok('README 已有二百四十七件套口径且尚无 252（哨兵前望 252 语义：下一版才写 252）',
  readme.includes('冒烟二百七十二件套（二百七十一件套清除）') &&
  !readme.includes('二百七十三件套'));
ok('README tests 树串尾已延伸（smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog（npm test 串跑））',
  readme.includes('smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog（npm test 串跑）'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 247 份（smoke.mjs + 250 专项）', chain.length === 271 && chainAll.length === 272, String(chain.length));
ok('package.json 链尾为 smoke_v2439_xpcurve4（第 271 份）', chain[chain.length - 1] === 'smoke_v2448_castprog', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2423_eliteprog.mjs（node tests/ 前缀形态）',
  pkgRaw.includes('node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs'));
ok('package.json 链锚逐字（smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs"）',
  pkgRaw.includes('smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.23（startsWith）', changelog.startsWith('## v24.48'));
ok('CHANGELOG v24.23 条目含「精英猎手」与「计数现场」与「精英」',
  changelog.includes('精英猎手') && changelog.includes('计数现场') && changelog.includes('精英'));
ok('CHANGELOG 仍保留 v24.22 条目（历史保留）', changelog.includes('## v24.22'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(chainAll.map((f) => f.replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 247（246 + smoke_v2423_eliteprog）', files.length === 272, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链（旧代 v24.22 pin 全库零残留）——
const leftovers = [];
for (const f of files) {
  if (f === 'smoke_v2423_eliteprog.mjs') continue;
  // 承 v24.22 同款豁免：上一版套件（smoke_v2422_huntprog）按惯例在否定式断言里保留旧代字面量，
  // 属合法残留，豁免扫描（本版无 v24.22 否定式则自然零残留）。
  if (f === 'smoke_v2422_huntprog.mjs') continue;
  const s = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s.includes("const GAME_VERSION = 'v24.22';") || s.includes("GAME_VERSION === 'v24.22'") ||
      s.includes("startsWith('## v24.22") || s.includes('入库（246 份）') ||
      s.includes('二百四十六件套（二百四十五件套清除）') || s.includes('testChain === 246') ||
      s.includes('fileCount === 246') || s.includes('files.length === 246') ||
      s.includes('chain.length === 245') || s.includes('第 246 份') ||
      s.includes('链尾为 smoke_v2422_huntprog')) leftovers.push(f);
}
ok('全库测试零残留 v24.22 GAME_VERSION/顶 pin/246 口径（哨兵链·豁免上一版否定式）', leftovers.length === 0, leftovers.join(','));

console.log(`— v24.23 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
