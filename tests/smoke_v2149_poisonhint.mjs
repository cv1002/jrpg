// v21.49 专项冒烟：中毒瞬间战报追加「每回合 -N HP」（体验打磨·信息透明）。
// 背景：中毒链条四端里三端早已量化——HUD 中毒角标（drawBattle「☠️ 中毒 N 回合 · 每回合 -N血」）、
// 帮助页「毒蛇中毒」行（约N%最大HP·持续N回合）、中毒 tick 战报（v21.8 带伤害值与我方剩余 HP）——
// 唯独 enemyAI 施毒成功的这一刻只报「每回合扣血，持续 N 回合」，玩家想确认「这毒每回合到底掉多少」
// 仍需等首次 tick 或翻帮助页。本版把施毒文案按 tick 同式 max(DOT_MIN, round(hpMax×POISON_PCT))
// 补每回合扣血数（hero.hpMax 战斗中不变，预估值与后续 tick 实扣逐值相等；POISON_PCT/DOT_MIN
// 单一数据源同读，调中毒强度只改 data.js 一处、四端自动跟随）。纯显示零结算零数值零存档变化。
// 本冒烟守护：版本锚点、enemyAI.js 源级落位（POISON_PCT import + 新文案 + 旧文案零残留）、
// 三端同式一致性（enemyAI 施毒文案 / battle.applyPoisonTick 结算 / drawBattle 角标）、
// 运行期实证（必中毒敌人 enemyAct 真实路径：正常档 hpMax=200 → -10 HP、下限档 hpMax=20 → DOT_MIN
// 钳制 -2 HP、回合数/中毒状态零回归）、README/package.json 同步、smoke_v2148 件套断言去硬化确认
// （v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION, POISON_PCT, POISON_TURNS, DOT_MIN, HELP_PAGES } from '../js/data.js';
import { enemyAct } from '../js/enemyAI.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v21.48 冒烟先例：先装桩再 import main.js）——
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

console.log('— v21.49 中毒瞬间战报「每回合 -N HP」 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.48）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.48', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 49)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.49 注释（中毒瞬间战报追加每回合扣血数）', dSrc.includes('v21.49 新增：中毒瞬间战报追加「每回合 -N HP」'));

// —— enemyAI.js 源级落位 ——
const eSrc = fs.readFileSync(path.join(ROOT, 'js/enemyAI.js'), 'utf8');
ok('enemyAI.js import 补 POISON_PCT（与 POISON_TURNS/DOT_MIN 同读单一数据源）',
  /import\s*\{[^}]*\bPOISON_PCT\b[^}]*\bPOISON_TURNS\b[^}]*\bDOT_MIN\b[^}]*\}\s*from\s*'\.\/data\.js'/.test(eSrc));
ok('enemyAI.js 施毒文案追加「每回合 -N HP」（tick 同式 max(DOT_MIN, round(hpMax×POISON_PCT))）',
  eSrc.includes('中了【毒】！每回合 -${Math.max(DOT_MIN, Math.round(hero.hpMax * POISON_PCT))} HP，持续 ${hero.poison} 回合'));
ok('enemyAI.js 旧文案「每回合扣血，持续」源级零残留', !eSrc.includes('每回合扣血，持续'));

// —— 三端同式一致性：施毒文案 / applyPoisonTick 结算 / HUD 角标 同读同一公式 ——
const bSrc = fs.readFileSync(path.join(ROOT, 'js/battle.js'), 'utf8');
const dbSrc = fs.readFileSync(path.join(ROOT, 'js/view/drawBattle.js'), 'utf8');
ok('battle.js applyPoisonTick 结算仍用同式（零回归：结算未动）',
  bSrc.includes('const damage = Math.max(DOT_MIN, Math.round(hero.hpMax * POISON_PCT));'));
ok('drawBattle.js 中毒角标仍用同式（零回归：角标未动）',
  dbSrc.includes('每回合 -${Math.max(DOT_MIN, Math.round(hero.hpMax * POISON_PCT))}血'));
// —— 帮助页「毒蛇中毒」行零回归（仍由 POISON_PCT/POISON_TURNS 派生）——
const helpFlat = HELP_PAGES.flat().join('\n');
ok('帮助页「毒蛇中毒」行零回归（约N%最大HP·持续N回合派生口径未动）',
  helpFlat.includes('每回合扣血（约' + Math.round(POISON_PCT * 100) + '%最大HP）持续 ' + POISON_TURNS + ' 回合'));

// —— 运行期实证：enemyAct 真实路径（enemy.poison=1 → Math.random()<1 恒真，必中毒）——
function mkHero(hpMax) {
  return { name: '测试者', level: 6, hp: hpMax, hpMax, mp: 30, mpMax: 30,
    atkMax: 40, defMax: 999, gold: 0, xp: 0, xpNext: 9999, item: 0, potion2: 0,
    weapon: '铁剑', armor: '皮甲', diff: null, skills: [],
    poison: 0, seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, x: 1, y: 1, map: 'village' };
}
function poisonSnake() {
  return { name: '毒蛇', hp: 20, hpMax: 20, atk: 5, def: 3, xp: 1, gold: 0, color: '#59c96b',
    poison: 1, acts: [{ type: 'attack', w: 100 }] };
}
function actOnce(hero) {
  S.G = hero; S.scene = 'battle'; S.enemy = poisonSnake(); S.battleBusy = true;
  S.blog.length = 0;
  enemyAct({ addFx: noop, winBattle: noop, loseBattle: noop });
  const line = S.blog.find((l) => l.includes('中了【毒】')) || '';
  S.enemy = null; S.scene = 'world'; S.battleBusy = false;
  return line;
}

// 正常档：hpMax=200 → max(2, round(200×0.05)) = 10
const h1 = mkHero(200);
const l1 = actOnce(h1);
ok('运行期：hpMax=200 中毒战报含「每回合 -10 HP」（tick 同式派生，非裸字面量）',
  l1.includes('☠️ 测试者 中了【毒】！每回合 -10 HP，持续 3 回合'), l1);
ok('运行期：中毒状态零回归（hero.poison === POISON_TURNS 3，英雄存活未被秒）',
  h1.poison === POISON_TURNS && h1.hp > 0, `poison=${h1.poison} hp=${h1.hp}`);
// 下限档：hpMax=20 → round(20×0.05)=1 < DOT_MIN → 钳制为 2（DOT_MIN 下限决定性）
const h2 = mkHero(20);
const l2 = actOnce(h2);
ok('运行期：hpMax=20 中毒战报含「每回合 -2 HP」（DOT_MIN 下限钳制决定性）',
  l2.includes('每回合 -2 HP，持续 3 回合'), l2);
// 同式等价：战报数值与 max(DOT_MIN, round(hpMax×POISON_PCT)) 逐值相等
ok('运行期：两档战报数值与 tick 同式逐值相等（10 = max(2,10)，2 = max(2,1)）',
  Math.max(DOT_MIN, Math.round(200 * POISON_PCT)) === 10 &&
  Math.max(DOT_MIN, Math.round(20 * POISON_PCT)) === 2);
// 不中毒敌人零回归：poison 缺省不施毒、无中毒文案
const h3 = mkHero(200);
S.G = h3; S.scene = 'battle'; S.enemy = { name: '史莱姆', hp: 20, hpMax: 20, atk: 5, def: 3, xp: 1, gold: 0, color: '#6cf', acts: [{ type: 'attack', w: 100 }] };
S.battleBusy = true; S.blog.length = 0;
enemyAct({ addFx: noop, winBattle: noop, loseBattle: noop });
ok('运行期：无 poison 字段敌人不施毒（hero.poison 仍 0、无中毒文案，零回归）',
  h3.poison === 0 && !S.blog.some((l) => l.includes('中了【毒】')));
S.enemy = null; S.scene = 'world'; S.battleBusy = false;

// —— README / package.json 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
ok('README tests 树收录 smoke_v2149_poisonhint', readme.includes('smoke_v2149_poisonhint'));
// v21.50 去硬化（v21.7 惯例）：件套精确计数移交当版冒烟守护，本件改存活性口径——
// 仍含「冒烟/件套」且旧口径「（四十四件套清除）」已清除。
ok('README 件套口径为存活性断言（v21.50 起件数由新版冒烟守护：四十六件套（四十五件套清除））',
  readme.includes('冒烟') && readme.includes('件套') &&
  !readme.includes('（四十四件套清除）'));
ok('README 含 v21.49 守护描述（中毒瞬间战报守护）', readme.includes('中毒瞬间战报守护'));
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('package.json 已收录 smoke_v2149_poisonhint（npm test 串跑第 45 份）', pkg.includes('smoke_v2149_poisonhint.mjs'));

// —— smoke_v2148 的 README 件套口径断言已去硬化（v21.7 惯例）——
const s2148 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2148_drain.mjs'), 'utf8');
ok('smoke_v2148 的 README 件套口径断言已去硬化（存活性口径落位，旧精确表达式零残留）',
  s2148.includes("!readme.includes('（四十三件套清除）')") &&
  !s2148.includes("readme.includes('四十四件套（四十三件套清除）')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
