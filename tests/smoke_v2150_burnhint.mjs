// v21.50 专项冒烟：灼烧命中瞬间战报追加「灼烧 N 回合·每回合 -N HP」（体验打磨·信息透明）。
// 背景：灼烧链条四端里三端早已量化——HUD 灼烧角标（drawBattle「🔥 灼烧 N · 每回合 -N血」）、
// 灼烧 tick 战报（v21.8「灼烧令…受到 N 点伤害」带敌方剩余 HP）、技能 hint（「灼烧2回合·每回合约-4%最大HP」）——
// 唯独 battle.js doSkill 火焰斩命中上火的这一刻只报「（灼烧）」，玩家花 4MP 放火想确认
// 「这灼烧每回合到底烧多少、还要烧几回合」仍需等首次 tick 或瞄角标。本版按 tick 同式
// max(DOT_MIN, round(hpMax×BURN_PCT)) 补每回合烧血数（enemy.hpMax 战斗中不变，预估值与后续
// tick 实扣逐值相等），回合数读赋值后的 enemy.burn（灼烧可叠加，与角标「灼烧 N」同一份源）；
// BURN_PCT/DOT_MIN 单一数据源同读，调灼烧强度只改 data.js 一处、战报/角标/tick 三端自动跟随
// （承 v21.49 中毒施毒文案同一补法）。纯显示零结算零数值零存档变化。
// 本冒烟守护：版本锚点、battle.js 源级落位（BURN_PCT import + 新文案 + 旧文案零残留）、
// 三端同式一致性（battle.js 战报 / enemyAI 灼烧 tick 结算 / drawBattle 角标同一公式）、
// 运行期实证（startBattle+playerAction 真实路径：正常档 hpMax=500 → -20 HP、下限档 hpMax=30 →
// DOT_MIN 钳制 -2 HP、叠加档连放两发 → 4 回合、MP 消耗与读数零回归）、README/package.json 同步、
// smoke_v2149 件套断言去硬化确认（v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION, BURN_PCT, DOT_MIN, SKILL_DATA, baseStats } from '../js/data.js';
import { startBattle, playerAction } from '../js/battle.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v21.49 冒烟先例：先装桩再 import main.js）——
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

console.log('— v21.50 灼烧命中瞬间战报「灼烧 N 回合·每回合 -N HP」 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.49）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.49', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 50)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.50 注释（灼烧命中瞬间战报追加每回合烧血数）', dSrc.includes('v21.50 新增：灼烧命中瞬间战报追加'));

// —— battle.js 源级落位 ——
const bSrc = fs.readFileSync(path.join(ROOT, 'js/battle.js'), 'utf8');
ok('battle.js import 补 BURN_PCT（与 DOT_MIN 同读单一数据源）',
  /import\s*\{[^}]*\bDOT_MIN\b[^}]*\bBURN_PCT\b[^}]*\}\s*from\s*'\.\/data\.js'/.test(bSrc));
ok('battle.js 灼烧战报追加「灼烧 N 回合·每回合 -N HP」（tick 同式 max(DOT_MIN, round(hpMax×BURN_PCT))）',
  bSrc.includes('note += `（灼烧 ${enemy.burn} 回合·每回合 -${Math.max(DOT_MIN, Math.round(enemy.hpMax * BURN_PCT))} HP）`;'));
ok('battle.js 旧文案裸「（灼烧）」源级零残留', !bSrc.includes("note += '（灼烧）';"));
ok('battle.js 灼烧叠加赋值逐字零回归（enemy.burn += skill.burn 结算未动）',
  bSrc.includes('enemy.burn = (enemy.burn || 0) + skill.burn;'));

// —— 三端同式一致性：战报 / 灼烧 tick 结算 / HUD 角标 同读同一公式 ——
const eSrc = fs.readFileSync(path.join(ROOT, 'js/enemyAI.js'), 'utf8');
const dbSrc = fs.readFileSync(path.join(ROOT, 'js/view/drawBattle.js'), 'utf8');
ok('enemyAI.js 灼烧 tick 结算仍用同式（零回归：结算未动）',
  eSrc.includes('const burnDmg = Math.max(DOT_MIN, Math.round(enemy.hpMax * BURN_PCT));'));
ok('drawBattle.js 灼烧角标仍用同式（零回归：角标未动）',
  dbSrc.includes('每回合 -${Math.max(DOT_MIN, Math.round(enemy.hpMax * BURN_PCT))}血'));
// —— 技能 hint 零回归（仍由 BURN_PCT 派生，「约」口径未动——敌人 hpMax 未知时只能给比例）——
ok('SKILL_DATA 火焰斩 hint 零回归（灼烧2回合·每回合约-4%最大HP 派生口径未动）',
  SKILL_DATA['火焰斩'].hint === '灼烧2回合·每回合约-' + Math.round(BURN_PCT * 100) + '%最大HP',
  SKILL_DATA['火焰斩'].hint);
ok('SKILL_DATA 火焰斩 burn:2 零回归（上火 2 回合结算未动）', SKILL_DATA['火焰斩'].burn === 2);

// —— 运行期实证：startBattle + playerAction 真实路径（承 v21.48 castDrain 桩法）——
function mkHero(lv, atkMax, mp) {
  const b = baseStats(lv);
  return { name: '测试者', level: lv, hp: b.hpMax, hpMax: b.hpMax, mp, mpMax: b.mpMax,
    atkMax, defMax: 40, gold: 0, xp: 0, xpNext: 9999, item: 0, potion2: 0,
    weapon: '圣光之剑', armor: '龙鳞甲', diff: null, skills: ['火焰斩'],
    poison: 0, seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, x: 1, y: 1, map: 'village' };
}
function mkDoll(extra) {
  return Object.assign({ name: '练功木桩', hp: 500, hpMax: 500, atk: 5, def: 10, xp: 1, gold: 0, color: '#888888' }, extra || {});
}
function castFire(hero, enemy) {
  S.G = hero; S.G.map = 'village';
  startBattle(enemy);          // startBattle 内 S.enemy = deep(enemyDef)——状态读 S.enemy 而非入参
  S.battleBusy = false;   // 测试桩：跳过开场 700ms 编排空档（enqueue 为真实 setTimeout）
  playerAction('skill', '火焰斩');
  const line = S.blog[S.blog.length - 1] || '';
  const snap = { line, burn: S.enemy.burn, enemyHp: S.enemy.hp };
  S.enemy = null; S.scene = 'world'; S.battleBusy = false;
  return snap;
}

// 正常档：木桩 hpMax=500 → max(2, round(500×0.04)) = 20；火焰斩 burn:2 → 灼烧 2 回合
const h1 = mkHero(12, 55, 60);
const r1 = castFire(h1, mkDoll());
ok('运行期：hpMax=500 灼烧战报含「（灼烧 2 回合·每回合 -20 HP）」（tick 同式派生，非裸字面量）',
  r1.line.includes('（灼烧 2 回合·每回合 -20 HP）'), r1.line);
ok('运行期：灼烧状态零回归（enemy.burn === 2，叠加赋值同式）', r1.burn === 2, `burn=${r1.burn}`);
ok('运行期：火焰斩耗蓝 4（60→56）且战报含 MP 读数（v20.7 口径零回归）',
  h1.mp === 60 - 4 && r1.line.includes('（MP 56/60）'), `mp=${h1.mp} | ${r1.line}`);
// 下限档：木桩 hpMax=30 → round(30×0.04)=1 < DOT_MIN → 钳制为 2（DOT_MIN 下限决定性）；
// 低攻英雄（atkMax=8 → 伤害约 10-12 < 30）保证木桩存活、走正常分支
const h2 = mkHero(12, 8, 60);
const r2 = castFire(h2, mkDoll({ hp: 30, hpMax: 30 }));
ok('运行期：hpMax=30 灼烧战报含「（灼烧 2 回合·每回合 -2 HP）」（DOT_MIN 下限钳制决定性）',
  r2.line.includes('（灼烧 2 回合·每回合 -2 HP）') && r2.enemyHp > 0, `enemyHp=${r2.enemyHp} | ${r2.line}`);
// 同式等价：战报数值与 max(DOT_MIN, round(hpMax×BURN_PCT)) 逐值相等
ok('运行期：两档战报数值与 tick 同式逐值相等（20 = max(2,20)，2 = max(2,1)）',
  Math.max(DOT_MIN, Math.round(500 * BURN_PCT)) === 20 &&
  Math.max(DOT_MIN, Math.round(30 * BURN_PCT)) === 2);
// 叠加档：同一木桩连放两发火焰斩 → enemy.burn 2+2=4，战报如实报「灼烧 4 回合」（与角标同源）
const h3 = mkHero(12, 55, 60);
S.G = h3; S.G.map = 'village';
startBattle(mkDoll());
S.battleBusy = false;
playerAction('skill', '火焰斩');
S.battleBusy = false;     // 玩家回合同步完成，手动复位跳过敌方编排（同开场桩法）
playerAction('skill', '火焰斩');
const l3 = S.blog[S.blog.length - 1] || '';
ok('运行期：连放两发叠加 → 战报含「（灼烧 4 回合·每回合 -20 HP）」且 enemy.burn === 4',
  l3.includes('（灼烧 4 回合·每回合 -20 HP）') && S.enemy.burn === 4, `burn=${S.enemy.burn} | ${l3}`);
ok('运行期：叠加档 MP 连扣两次（60→52）零回归', h3.mp === 60 - 8, `mp=${h3.mp}`);
S.enemy = null; S.scene = 'world'; S.battleBusy = false;

// —— README / package.json 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
ok('README tests 树收录 smoke_v2150_burnhint', readme.includes('smoke_v2150_burnhint'));
ok('README 件套口径为四十六件套（四十五件套清除）', readme.includes('四十六件套（四十五件套清除）'));
ok('README 含 v21.50 守护描述（灼烧命中瞬间战报守护）', readme.includes('灼烧命中瞬间战报守护'));
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('package.json 已收录 smoke_v2150_burnhint（npm test 串跑第 46 份）', pkg.includes('smoke_v2150_burnhint.mjs'));

// —— smoke_v2149 的 README 件套口径断言已去硬化（v21.7 惯例）——
const s2149 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2149_poisonhint.mjs'), 'utf8');
ok('smoke_v2149 的 README 件套口径断言已去硬化（存活性口径落位，旧精确表达式零残留）',
  s2149.includes("!readme.includes('（四十四件套清除）')") &&
  !s2149.includes("readme.includes('四十五件套（四十四件套清除）')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
