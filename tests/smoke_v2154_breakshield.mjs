// v21.54 专项冒烟：陨石术击碎石甲战报补「剩余 N 层」（体验打磨·信息透明）。
// 背景：battle.doSkill 的 breakShield 分支（陨石术击碎石甲）此前只报「（石甲碎裂）」不说还剩几层——
// 石甲链条的另外两端早已报层数：凝结端 enemyAI「（累计 N 层，所受伤害降低 X%）」、受击挡伤端
// attackMove「（剩余 N 层）」；唯独技能击碎这一端缺数，玩家放陨石术想确认「这怪石甲还剩几层、
// 要不要再来一发」只能瞄右上角角标。本版与 attackMove 挡伤端同口径补剩余层数，碎至 0 层时保持
// 「（石甲碎裂）」逐字不变。纯显示零结算零数值零存档变化（enemy.shield 赋值与原行逐值同式）。
// 本冒烟守护：版本锚点、battle.js 源级落位（新文案落位 + 旧裸文案零残留 + 凝结/挡伤两端口径零回归）、
// 运行期实证三档（护盾 3 层 → 挡伤后碎裂报「剩余 1 层」且 enemy.shield 归 1、2 层 → 碎至 0 层保持
// 「（石甲碎裂）」逐字、无盾 → 不触发任何碎裂文案）、README/package.json 同步 + smoke_v2153 件套断言
// 去硬化（v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION } from '../js/data.js';
import { startBattle, playerAction } from '../js/battle.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v21.53 冒烟先例：先装桩再 import main.js）——
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

console.log('— v21.54 陨石术击碎石甲战报「剩余 N 层」 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.53）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.53', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 54)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.54 注释（击碎石甲剩余层数量化说明）', dSrc.includes('v21.54 体验打磨：陨石术击碎石甲战报补'));

// —— battle.js 源级落位 ——
const bSrc = fs.readFileSync(path.join(ROOT, 'js/battle.js'), 'utf8');
ok('battle.js 含 v21.54 注释（击碎瞬间战报量化剩余层数）', bSrc.includes('v21.54 击碎瞬间战报量化剩余层数'));
ok('battle.js 碎裂战报按剩余层数条件派生（碎后 >0 层报「剩余 N 层」）',
  bSrc.includes('石甲碎裂${enemy.shield > 0') && bSrc.includes('，剩余 ${enemy.shield} 层'));
ok('battle.js 旧裸文案 note += \'（石甲碎裂）\' 源级零残留',
  !bSrc.includes("note += '（石甲碎裂）';"));
// 石甲链条两端口径零回归（凝结端/挡伤端报层数逻辑逐字未动）
const aiSrc = fs.readFileSync(path.join(ROOT, 'js/enemyAI.js'), 'utf8');
ok('enemyAI 凝结端「累计 N 层」口径逐字零回归', aiSrc.includes('（累计 ${enemy.shield} 层，所受伤害降低'));
ok('battle.js 受击挡伤端「剩余 N 层」口径逐字零回归（attackMove 未动）',
  bSrc.includes('的石甲挡下了部分伤害！${enemy.shield > 0 ? `（剩余 ${enemy.shield} 层）`'));
ok('battle.js 碎裂赋值结算逐字零回归（Math.max(0, enemy.shield - skill.breakShield) 未动）',
  bSrc.includes('enemy.shield = Math.max(0, enemy.shield - skill.breakShield);'));

// —— 运行期实证：startBattle + playerAction('skill','陨石术') 真实路径（承 v21.50 castFire 桩法）——
function mkHero() {
  return { name: '测试者', level: 7, hp: 120, hpMax: 120, mp: 40, mpMax: 40,
    atkMax: 40, defMax: 30, gold: 0, xp: 0, xpNext: 9999, item: 1, potion2: 0,
    weapon: '铁剑', armor: '皮甲', diff: null, skills: ['陨石术'],
    poison: 0, seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, x: 1, y: 1, map: 'village' };
}
function mkGolem(shield) {
  return { name: '石心魔像', hp: 5000, hpMax: 5000, atk: 5, def: 10, xp: 1, gold: 0,
    color: '#8a8a8a', shield };
}
function castMeteor(hero, enemy) {
  try {
    S.G = hero; S.G.map = 'village';
    startBattle(enemy);
    S.battleBusy = false;   // 测试桩：跳过开场 700ms 编排空档（enqueue 为真实 setTimeout）
    playerAction('skill', '陨石术');
    const lines = S.blog.slice();
    const shieldAfter = S.enemy ? (S.enemy.shield || 0) : null;
    const scene = S.scene;
    S.enemy = null; S.scene = 'world'; S.battleBusy = false;
    return { lines, shieldAfter, scene };
  } catch (err) {
    S.enemy = null; S.scene = 'world'; S.battleBusy = false;
    throw err;
  }
}

// 3 层档：attackMove 挡伤 3→2（报「剩余 2 层」），breakShield 2→1（新文案应报「剩余 1 层」）
const r1 = castMeteor(mkHero(), mkGolem(3));
const skillLine1 = r1.lines[r1.lines.length - 1] || '';
ok('运行期：3 层档技能战报含「（石甲碎裂，剩余 1 层）」（新文案落位）',
  skillLine1.includes('（石甲碎裂，剩余 1 层）'), skillLine1);
ok('运行期：3 层档 enemy.shield 归 1（挡伤 -1 + 击碎 -1 结算逐值未变）', r1.shieldAfter === 1, r1.shieldAfter);
ok('运行期：3 层档挡伤行报「（剩余 2 层）」零回归（attackMove 口径未动）',
  r1.lines.some((l) => l.includes('的石甲挡下了部分伤害！') && l.includes('（剩余 2 层）')), r1.lines.join(' | '));
ok('运行期：3 层档仍在战斗（敌人 5000 HP 未倒，afterPlayer 编排未中断）', r1.scene === 'battle', r1.scene);

// 2 层档：attackMove 挡伤 2→1，breakShield 1→0（碎至 0 层保持「（石甲碎裂）」逐字，不标盾剩余——
// 注意技能战报尾部的「（敌方 HP 剩余 X/Y）」本就含「剩余」二字，盾剩余判定须锁定「碎裂，剩余」形态）
const r2 = castMeteor(mkHero(), mkGolem(2));
const skillLine2 = r2.lines[r2.lines.length - 1] || '';
ok('运行期：2 层档技能战报含「（石甲碎裂）」且盾剩余不再标注（碎至 0 层口径）',
  skillLine2.includes('（石甲碎裂）') && !skillLine2.includes('（石甲碎裂，剩余'), skillLine2);
ok('运行期：2 层档 enemy.shield 归 0（末层被击碎）', r2.shieldAfter === 0, r2.shieldAfter);

// 0 层档：无盾不触发 breakShield 分支，技能战报零碎裂文案
const r3 = castMeteor(mkHero(), mkGolem(0));
const skillLine3 = r3.lines[r3.lines.length - 1] || '';
ok('运行期：0 层档技能战报不含任何碎裂文案（无盾不触发分支）',
  !skillLine3.includes('石甲碎裂'), skillLine3);
ok('运行期：0 层档无挡伤行（attackMove 盾分支条件未误触）',
  !r3.lines.some((l) => l.includes('石甲挡下了部分伤害')), r3.lines.join(' | '));

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2154_breakshield', readme.includes('smoke_v2154_breakshield'));
// v21.55 去硬化（v21.7 惯例）：件套精确计数移交当版冒烟守护，本件改存活性口径——
// 仍含「冒烟/件套」且旧口径「（四十九件套清除）」已清除。
ok('README 件套口径为存活性断言（v21.55 起件数由新版冒烟守护：五十一件套（五十件套清除））',
  readme.includes('冒烟') && readme.includes('件套') &&
  !readme.includes('（四十九件套清除）'));
ok('README 含 v21.54 守护描述（击碎石甲剩余层数量化守护）',
  readme.includes('击碎石甲剩余层数量化守护'));
ok('package.json 已收录 smoke_v2154_breakshield（npm test 串跑第 50 份）', pkg.includes('smoke_v2154_breakshield.mjs'));
const s2153 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2153_fleefail.mjs'), 'utf8');
ok('smoke_v2153 的 README 件套口径断言已去硬化（存活性口径落位，旧精确表达式零残留）',
  s2153.includes("!readme.includes('（四十八件套清除）')") &&
  !s2153.includes("readme.includes('四十九件套（四十八件套清除）')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
