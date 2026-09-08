// v21.55 专项冒烟：弱点/抗性命中战报补确切倍率（体验打磨·信息透明）。
// 背景：battle.doSkill 的克制 note 此前只报「（弱点）/（抗性）」性质不报数值——元素克制链条的
// 结算端（rules.elemMult 读 ELEM_MULT 单一数据源）、帮助页「技能克制」行（「弱点伤害×1.35 ·
// 抗性伤害×0.7」）、图鉴 codexTag（「弱点·火×1.35 / 抗性·冰×0.7」）三端早已带确切倍率，
// 唯独命中战报这一端缺数；玩家放技能命中想确认「这一击到底吃到多少加成/被削多少」要翻图鉴或
// 帮助页。本版按图鉴同口径补「（弱点×1.35）/（抗性×0.7）」（ELEM_MULT 单一数据源同读）。
// 纯显示零结算零数值零存档变化（elemMult 两次判定调用逐字未动，只改 2 条 note 文案）。
// 本冒烟守护：版本锚点、battle.js 源级落位（ELEM_MULT import 接入 + 新文案落位 + 旧裸文案
// 零残留 + elemMult 判定逐字零回归）、ELEM_MULT 契约与三端同源零回归（rules 结算/帮助页/图鉴）、
// 运行期实证三档（弱点档报「（弱点×1.35）」且伤害 > 中性档、抗性档报「（抗性×0.7）」且伤害 <
// 中性档、中性档零克制文案，三档伤害排序与倍率同向）、README/package.json 同步 + smoke_v2154
// 件套断言去硬化（v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION, ELEM_MULT } from '../js/data.js';
import { startBattle, playerAction } from '../js/battle.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v21.54 冒烟先例：先装桩再 import main.js）——
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

console.log('— v21.55 弱点/抗性命中战报补确切倍率 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.54）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.54', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 55)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.55 注释（弱点/抗性命中战报补确切倍率说明）', dSrc.includes('v21.55 体验打磨：弱点/抗性命中战报补确切倍率'));

// —— battle.js 源级落位 ——
const bSrc = fs.readFileSync(path.join(ROOT, 'js/battle.js'), 'utf8');
ok('battle.js 含 v21.55 注释（克制命中战报补确切倍率）', bSrc.includes('v21.55 克制命中战报补确切倍率'));
ok('battle.js import 已接入 ELEM_MULT（data.js 单一数据源）', /import \{[^}]*\bELEM_MULT\b[^}]*\} from '\.\/data\.js'/.test(bSrc));
ok('battle.js 弱点新文案落位（（弱点×${ELEM_MULT.weak}））', bSrc.includes('（弱点×${ELEM_MULT.weak}）'));
ok('battle.js 抗性新文案落位（（抗性×${ELEM_MULT.resist}））', bSrc.includes('（抗性×${ELEM_MULT.resist}）'));
ok("battle.js 旧裸文案 note += '（弱点）' 源级零残留", !bSrc.includes("note += '（弱点）';"));
ok("battle.js 旧裸文案 note += '（抗性）' 源级零残留", !bSrc.includes("note += '（抗性）';"));
ok('battle.js elemMult 弱点判定逐字零回归（> 1 分支条件未动）', bSrc.includes('if (elemMult(skill, enemy) > 1)'));
ok('battle.js elemMult 抗性判定逐字零回归（< 1 分支条件未动）', bSrc.includes('if (elemMult(skill, enemy) < 1)'));

// —— ELEM_MULT 契约与克制链条三端同源零回归 ——
ok('ELEM_MULT 契约：weak===1.35 且 resist===0.7（单一数据源）',
  ELEM_MULT.weak === 1.35 && ELEM_MULT.resist === 0.7, JSON.stringify(ELEM_MULT));
const rSrc = fs.readFileSync(path.join(ROOT, 'js/rules.js'), 'utf8');
ok('rules.elemMult 结算端读 ELEM_MULT 单一数据源零回归',
  rSrc.includes('return ELEM_MULT.weak;') && rSrc.includes('return ELEM_MULT.resist;'));
ok('帮助页「技能克制」行倍率派生零回归（弱点伤害×ELEM_MULT.weak）',
  dSrc.includes("'弱点伤害×' + ELEM_MULT.weak + ' · 抗性伤害×' + ELEM_MULT.resist"));
ok('图鉴 codexTag 倍率标注零回归（弱点·X×ELEM_MULT.weak / 抗性·X×ELEM_MULT.resist）',
  dSrc.includes("'×' + ELEM_MULT.weak") && dSrc.includes("'×' + ELEM_MULT.resist"));

// —— 运行期实证：startBattle + playerAction('skill','火焰斩') 真实路径（承 v21.50/v21.54 桩法）——
function mkHero() {
  return { name: '测试者', level: 7, hp: 120, hpMax: 120, mp: 40, mpMax: 40,
    atkMax: 100, defMax: 30, gold: 0, xp: 0, xpNext: 9999, item: 1, potion2: 0,
    weapon: '铁剑', armor: '皮甲', diff: null, skills: ['火焰斩'],
    poison: 0, seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, x: 1, y: 1, map: 'village' };
}
function mkFoe(extra) {
  return Object.assign({ name: '木桩', hp: 5000, hpMax: 5000, atk: 5, def: 10, xp: 1, gold: 0,
    color: '#8a8a8a' }, extra || {});
}
function castFire(hero, enemy) {
  try {
    S.G = hero; S.G.map = 'village';
    startBattle(enemy);
    S.battleBusy = false;   // 测试桩：跳过开场 700ms 编排空档（enqueue 为真实 setTimeout）
    playerAction('skill', '火焰斩');
    const lines = S.blog.slice();
    const hpAfter = S.enemy ? S.enemy.hp : null;
    const scene = S.scene;
    S.enemy = null; S.scene = 'world'; S.battleBusy = false;
    return { lines, hpAfter, scene };
  } catch (err) {
    S.enemy = null; S.scene = 'world'; S.battleBusy = false;
    throw err;
  }
}
const dmgOf = (line) => { const m = /造成 (\d+) 伤害/.exec(line || ''); return m ? Number(m[1]) : null; };

// 弱点档（敌 weak:'fire'）：atkMax 100 / def 10 → raw 190 ×火焰斩 1.8 = 342 ×1.35 ≈ 462（±10% 浮动 416~508）
const rWeak = castFire(mkHero(), mkFoe({ weak: 'fire' }));
const weakLine = rWeak.lines[rWeak.lines.length - 1] || '';
const weakDmg = dmgOf(weakLine);
ok('运行期：弱点档技能战报含「（弱点×1.35）」（新文案落位）', weakLine.includes('（弱点×1.35）'), weakLine);
ok('运行期：弱点档伤害落在 ×1.35 浮动区间（416~508，倍率如实结算）',
  weakDmg !== null && weakDmg >= 416 && weakDmg <= 508, weakDmg);

// 中性档（敌无 weak/resist）：342（±10% 浮动 308~376）
const rMid = castFire(mkHero(), mkFoe({}));
const midLine = rMid.lines[rMid.lines.length - 1] || '';
const midDmg = dmgOf(midLine);
ok('运行期：中性档技能战报不含「（弱点」「（抗性」（无克制零文案）',
  !midLine.includes('（弱点') && !midLine.includes('（抗性'), midLine);

// 抗性档（敌 resist:'fire'）：342 ×0.7 ≈ 239（±10% 浮动 215~263）
const rRes = castFire(mkHero(), mkFoe({ resist: 'fire' }));
const resLine = rRes.lines[rRes.lines.length - 1] || '';
const resDmg = dmgOf(resLine);
ok('运行期：抗性档技能战报含「（抗性×0.7）」（新文案落位）', resLine.includes('（抗性×0.7）'), resLine);
ok('运行期：抗性档伤害落在 ×0.7 浮动区间（215~263，倍率如实结算）',
  resDmg !== null && resDmg >= 215 && resDmg <= 263, resDmg);

// 三档伤害排序与倍率同向（浮动区间互不重叠：416 > 376、308 > 263，单次采样即安全）
ok('运行期：三档伤害排序 弱点 > 中性 > 抗性（战报倍率与结算同向）',
  weakDmg > midDmg && midDmg > resDmg, `${weakDmg} > ${midDmg} > ${resDmg}`);
ok('运行期：MP 读数零回归（火焰斩 4MP：40→36，v20.7 口径未动）',
  weakLine.includes('（MP 36/40）'), weakLine);
ok('运行期：灼烧 note 零回归（v21.50「灼烧 2 回合·每回合 -200 HP」与克制 note 共存）',
  weakLine.includes('（灼烧 2 回合·每回合 -200 HP）'), weakLine);

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2155_weakresist', readme.includes('smoke_v2155_weakresist'));
ok('README 件套口径为五十一件套（五十件套清除）', readme.includes('五十一件套（五十件套清除）'));
ok('README 含 v21.55 守护描述（克制命中战报倍率量化守护）',
  readme.includes('克制命中战报倍率量化守护'));
ok('package.json 已收录 smoke_v2155_weakresist（npm test 串跑第 51 份）', pkg.includes('smoke_v2155_weakresist.mjs'));
const s2154 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2154_breakshield.mjs'), 'utf8');
ok('smoke_v2154 的 README 件套口径断言已去硬化（存活性口径落位，旧精确表达式零残留）',
  s2154.includes("!readme.includes('（四十九件套清除）')") &&
  !s2154.includes("readme.includes('五十件套（四十九件套清除）')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
