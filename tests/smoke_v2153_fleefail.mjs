// v21.53 专项冒烟：逃脱失败战报追加后果提示「（X 即将行动）」（体验打磨·信息透明）。
// 背景：battle.doFlee 普通逃跑失败此前只报「❌ 逃脱失败！」——玩家按 4 失败后往往没意识到
// 这一回合已经让给敌方（afterPlayer 实际推进 battleTurn 并 600ms 后编排 enemyAct）；而 Boss
// 气场分支早已明示「（本回合行动保留）」，普通失败分支恰恰是「行动被消耗」却无任何提示，
// 两分支缺一端对照口径。本版补「（X 即将行动）」（X 读 enemy.name 单一数据源）；成功率口径
// 仍由指令栏「约60%」承载（FLEE_SUCCESS 单一数据源），战报不重复标注。纯显示零结算零数值零存档变化。
// 本冒烟守护：版本锚点、battle.js 源级落位（新文案落位 + 旧裸文案零残留 + Boss/成功两分支逐字零回归）、
// 运行期实证（强制 Math.random 四档：失败档新文案 + battleTurn 1→2 回合消耗同口径、敌名动态派生、
// 边界 rand===FLEE_SUCCESS 判负、成功档「🏃 成功逃脱了！」逐字且 battleTurn 不变回 world、
// Boss 气场档逐字且 battleTurn 不变）、README/package.json 同步 + smoke_v2152 件套断言去硬化（v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION, FLEE_SUCCESS } from '../js/data.js';
import { startBattle, playerAction } from '../js/battle.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v21.52 冒烟先例：先装桩再 import main.js）——
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

console.log('— v21.53 逃脱失败战报后果提示「（X 即将行动）」 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.52）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.52', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 53)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.53 注释（逃脱失败战报追加后果提示说明）', dSrc.includes('v21.53 体验打磨：逃脱失败战报追加后果提示'));

// —— battle.js 源级落位 ——
const bSrc = fs.readFileSync(path.join(ROOT, 'js/battle.js'), 'utf8');
ok('battle.js 失败战报追加「（X 即将行动）」（enemy.name 单一数据源派生）',
  bSrc.includes('S.blog.push(`❌ 逃脱失败！（${enemy.name} 即将行动）`);'));
ok('battle.js 旧裸文案「❌ 逃脱失败！」源级零残留',
  !bSrc.includes("S.blog.push('❌ 逃脱失败！');"));
ok('battle.js 成功分支「🏃 成功逃脱了！」逐字零回归',
  bSrc.includes("S.blog.push('🏃 成功逃脱了！');"));
ok('battle.js Boss 气场分支「无法逃脱！（本回合行动保留）」逐字零回归（对照口径另一端未动）',
  bSrc.includes('的气场压制着你，无法逃脱！（本回合行动保留）'));
ok('battle.js 逃跑判定仍读 FLEE_SUCCESS 单一数据源（Math.random() < FLEE_SUCCESS 未动）',
  bSrc.includes('if (Math.random() < FLEE_SUCCESS) {'));
ok('FLEE_SUCCESS===0.6 零回归（成功率数值与指令栏「约60%」口径未动）', FLEE_SUCCESS === 0.6);

// —— 指令栏口径零回归：成功率只在指令栏标注，战报不重复 ——
const dbSrc = fs.readFileSync(path.join(ROOT, 'js/view/drawBattle.js'), 'utf8');
ok('drawBattle 指令栏「逃跑·成功率约N%」仍由 FLEE_SUCCESS 派生（单一数据源零回归）',
  dbSrc.includes("'·成功率约' + Math.round(FLEE_SUCCESS * 100) + '%'"));

// —— 运行期实证：startBattle + playerAction('flee') 真实路径（承 v21.50 castFire 桩法）——
function mkHero() {
  return { name: '测试者', level: 5, hp: 80, hpMax: 80, mp: 30, mpMax: 30,
    atkMax: 30, defMax: 40, gold: 0, xp: 0, xpNext: 9999, item: 1, potion2: 0,
    weapon: '铁剑', armor: '皮甲', diff: null, skills: ['火焰斩'],
    poison: 0, seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, x: 1, y: 1, map: 'village' };
}
function mkDoll(extra) {
  return Object.assign({ name: '练功木桩', hp: 500, hpMax: 500, atk: 5, def: 10, xp: 1, gold: 0, color: '#888888' }, extra || {});
}
function tryFlee(hero, enemy, randVal) {
  const oldRand = Math.random;
  Math.random = () => randVal;
  try {
    S.G = hero; S.G.map = 'village';
    startBattle(enemy);
    S.battleBusy = false;   // 测试桩：跳过开场 700ms 编排空档（enqueue 为真实 setTimeout）
    const turnBefore = S.battleTurn;
    playerAction('flee');
    const line = S.blog[S.blog.length - 1] || '';
    const snap = { line, turnBefore, turnAfter: S.battleTurn, scene: S.scene, enemyGone: S.enemy === null };
    S.enemy = null; S.scene = 'world'; S.battleBusy = false;
    return snap;
  } finally { Math.random = oldRand; }
}

// 失败档：rand=0.99 ≥ FLEE_SUCCESS → 必失败
const r1 = tryFlee(mkHero(), mkDoll(), 0.99);
ok('运行期：失败档战报为「❌ 逃脱失败！（练功木桩 即将行动）」（新文案落位）',
  r1.line === '❌ 逃脱失败！（练功木桩 即将行动）', r1.line);
ok('运行期：失败档 battleTurn 1→2（回合确被消耗——与「即将行动」文案口径一致，结算未动）',
  r1.turnBefore === 1 && r1.turnAfter === 2, `${r1.turnBefore}→${r1.turnAfter}`);
ok('运行期：失败档仍在战斗且敌人未消失（afterPlayer 编排敌方回合，零回归）',
  r1.scene === 'battle' && !r1.enemyGone, r1.scene);
// 敌名动态派生档：换名敌人同路径 → 文案读 enemy.name（非写死）
const r2 = tryFlee(mkHero(), mkDoll({ name: '史莱姆' }), 0.99);
ok('运行期：失败档敌名动态派生（史莱姆 →「（史莱姆 即将行动）」，非裸字面量）',
  r2.line === '❌ 逃脱失败！（史莱姆 即将行动）', r2.line);
// 边界档：rand===FLEE_SUCCESS → 0.6 < 0.6 不成立 → 判负（成功须严格小于，边界语义守护）
const r3 = tryFlee(mkHero(), mkDoll(), FLEE_SUCCESS);
ok('运行期：边界 rand===FLEE_SUCCESS 判负（< 严格小于语义守护）',
  r3.line.startsWith('❌ 逃脱失败！') && r3.turnAfter === 2, r3.line);
// 成功档：rand=0 < FLEE_SUCCESS → 成功
const r4 = tryFlee(mkHero(), mkDoll(), 0);
ok('运行期：成功档「🏃 成功逃脱了！」逐字零回归',
  r4.line === '🏃 成功逃脱了！', r4.line);
ok('运行期：成功档回到世界且敌人清空（goto world + S.enemy=null 结算零回归）',
  r4.scene === 'world' && r4.enemyGone, r4.scene);
ok('运行期：成功档 battleTurn 不变（逃跑成功不耗回合——v14.1 口径零回归）',
  r4.turnBefore === 1 && r4.turnAfter === 1, `${r4.turnBefore}→${r4.turnAfter}`);
// Boss 气场档：isBoss 敌人不看随机数，恒走气场压制分支（对照口径另一端逐字零回归）
const r5 = tryFlee(mkHero(), mkDoll({ name: '测试魔王', isBoss: true }), 0.99);
ok('运行期：Boss 档「气场压制…（本回合行动保留）」逐字零回归',
  r5.line === '⚠️ 测试魔王 的气场压制着你，无法逃脱！（本回合行动保留）', r5.line);
ok('运行期：Boss 档 battleTurn 不变且仍在战斗（行动保留口径零回归）',
  r5.turnBefore === 1 && r5.turnAfter === 1 && r5.scene === 'battle' && !r5.enemyGone,
  `${r5.turnBefore}→${r5.turnAfter} ${r5.scene}`);

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2153_fleefail', readme.includes('smoke_v2153_fleefail'));
ok('README 件套口径为四十九件套（四十八件套清除）', readme.includes('四十九件套（四十八件套清除）'));
ok('README 含 v21.53 守护描述（逃脱失败战报后果提示守护）',
  readme.includes('逃脱失败战报后果提示守护'));
ok('package.json 已收录 smoke_v2153_fleefail（npm test 串跑第 49 份）', pkg.includes('smoke_v2153_fleefail.mjs'));
const s2152 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2152_bonequest.mjs'), 'utf8');
ok('smoke_v2152 的 README 件套口径断言已去硬化（存活性口径落位，旧精确表达式零残留）',
  s2152.includes("!readme.includes('（四十七件套清除）')") &&
  !s2152.includes("readme.includes('四十八件套（四十七件套清除）')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
