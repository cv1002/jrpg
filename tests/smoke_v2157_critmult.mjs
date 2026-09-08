// v21.57 专项冒烟：普攻暴击命中战报补确切倍率「（暴击×1.8！）」（体验打磨·信息透明）。
// 背景：battle.doAttack 的暴击 note 此前只报「（暴击！）」性质不报数值——暴击链条的
// 结算端（attackMove `isCrit ? CRIT_MULT : 1` 读 CRIT_MULT 单一数据源）与状态页端
// （menus.js「普攻N%暴击 ×N」由 CRIT_RATE/CRIT_MULT 派生）两端早已量化，唯独命中战报
// 这一端缺数；玩家普攻暴击时想确认「这一击到底吃到了多少加成」只能翻到状态页。
// 本版按状态页同口径补 ×N 倍率（CRIT_MULT 单一数据源同读）；crit 判定与 ×CRIT_MULT
// 结算逐字未动，暴击仅普攻可触发（技能 crit=false 不受影响）。纯显示零结算零数值
// 零存档变化。
// 本冒烟守护：版本锚点、battle.js 源级落位（v21.57 注释 + 新文案落位 + 旧裸文案零残留 +
// crit 判定与 attackMove ×CRIT_MULT 结算逐字零回归）、CRIT_RATE/CRIT_MULT 契约与暴击链条
// 两端同源零回归（结算端/状态页端）、运行期实证三档（强制 Math.random：暴击档报
// 「（暴击×1.8！）」且伤害落 ×1.8 浮动区间、非暴击档零暴击文案且伤害落原浮动区间、
// 蓄力+暴击双 note 共存且伤害为两倍率同乘）、README/package.json 同步 +
// smoke_v2156 件套断言去硬化（v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION, CRIT_RATE, CRIT_MULT, CHARGE_MULT } from '../js/data.js';
import { startBattle, playerAction } from '../js/battle.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v21.56 冒烟先例：先装桩再 import main.js）——
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

console.log('— v21.57 普攻暴击命中战报补确切倍率「（暴击×1.8！）」 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.56）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.56', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 57)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.57 注释（暴击命中战报补确切倍率说明）',
  dSrc.includes('v21.57 体验打磨：普攻暴击命中战报补确切倍率'));

// —— battle.js 源级落位 ——
const bSrc = fs.readFileSync(path.join(ROOT, 'js/battle.js'), 'utf8');
ok('battle.js 含 v21.57 注释（暴击命中战报补确切倍率）', bSrc.includes('v21.57 暴击命中战报补确切倍率'));
ok('battle.js 新文案落位（（暴击×${CRIT_MULT}！））', bSrc.includes('（暴击×${CRIT_MULT}！）'));
ok("battle.js 旧裸文案 `${crit ? '（暴击！）' : ''}' 源级零残留", !bSrc.includes("${crit ? '（暴击！）' : ''}"));
ok('battle.js crit 判定逐字零回归（Math.random() < CRIT_RATE 未动）',
  bSrc.includes('const crit = Math.random() < CRIT_RATE;'));
ok('battle.js attackMove 暴击结算逐字零回归（isCrit ? CRIT_MULT : 1 未动）',
  bSrc.includes('(isCrit ? CRIT_MULT : 1)'));
ok('battle.js CRIT_MULT 已 import（battle.js 顶部 data.js import 行含 CRIT_MULT）',
  bSrc.split('\n').some((l) => l.startsWith('import') && l.includes("from './data.js'") && l.includes('CRIT_MULT')));

// —— CRIT 契约与暴击链条两端同源零回归 ——
ok('CRIT_RATE/CRIT_MULT 契约：===0.12 / ===1.8（暴击单一数据源）',
  CRIT_RATE === 0.12 && CRIT_MULT === 1.8, `${CRIT_RATE}/${CRIT_MULT}`);
const mSrc = fs.readFileSync(path.join(ROOT, 'js/view/menus.js'), 'utf8');
ok('状态页端零回归（「普攻N%暴击 ×N」由 CRIT_RATE/CRIT_MULT 派生）',
  mSrc.includes("Math.round(CRIT_RATE * 100) + '%暴击 ×' + CRIT_MULT"));
ok('结算端零回归（attackMove 浮字/震屏 crit 触发线未动）',
  bSrc.includes('dmg >= BIG_DMG || isCrit'));

// —— 运行期实证：startBattle + playerAction('attack') 真实路径（承 v21.55 桩法）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 7, hp: 120, hpMax: 120, mp: 40, mpMax: 40,
    atkMax: 100, defMax: 30, gold: 0, xp: 0, xpNext: 9999, item: 1, potion2: 0,
    weapon: '铁剑', armor: '皮甲', diff: null, skills: [],
    poison: 0, seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, x: 1, y: 1, map: 'village',
    charge: false }, extra || {});
}
function mkFoe(extra) {
  return Object.assign({ name: '木桩', hp: 5000, hpMax: 5000, atk: 5, def: 10, xp: 1, gold: 0,
    color: '#8a8a8a' }, extra || {});
}
const _rand = Math.random;
function heroAttack(hero, enemy, roll, opts) {
  Math.random = () => roll;
  try {
    S.G = hero; S.G.map = 'village';
    startBattle(enemy);
    // 注意：startBattle 会重置 S.G.charge=false（js/battle.js 入场复位行），蓄力档须在
    // startBattle 之后再立 flag（等价于玩家在战斗中按 C 蓄力后的下一次攻击真实路径）。
    if (opts && opts.charge) S.G.charge = true;
    S.battleBusy = false;   // 测试桩：跳过开场 700ms 编排空档（enqueue 为真实 setTimeout）
    playerAction('attack');
    const lines = S.blog.slice();
    const hpAfter = S.enemy ? S.enemy.hp : null;
    const enemyRef = S.enemy;
    S.enemy = null; S.scene = 'world'; S.battleBusy = false;
    return { lines, hpAfter, enemyRef };
  } finally {
    Math.random = _rand;
  }
}
const dmgOf = (line) => { const m = /造成 (\d+) 伤害/.exec(line || ''); return m ? Number(m[1]) : null; };
// atkMax 100 / def 10 → raw=max(1,200-10)=190；roll=0.05 → 浮动 0.91 → round(172.9)=173
const rawV = Math.round(Math.max(1, 100 * 2 - 10) * (0.9 + 0.05 * 0.2));
const critV = Math.round(rawV * CRIT_MULT);
const chargeCritV = Math.round(rawV * CRIT_MULT * CHARGE_MULT);
// roll=0.99 → 浮动 1.098 → round(208.62)=209
const plainV = Math.round(Math.max(1, 100 * 2 - 10) * (0.9 + 0.99 * 0.2));

// A 档：暴击——报「（暴击×1.8！）」，伤害 = 173×1.8=311，敌 HP 5000→4689
{
  const r = heroAttack(mkHero(), mkFoe(), 0.05);
  const line = r.lines.find((l) => l.includes('你发动攻击')) || '';
  const dmg = dmgOf(line);
  ok('运行期：暴击档战报含「（暴击×1.8！）」（新文案落位）', line.includes('（暴击×1.8！）'), line);
  ok('运行期：暴击档伤害为 raw×1.8（311，倍率如实结算）', dmg === critV && dmg === 311, `${dmg} ≠ ${critV}`);
  ok('运行期：暴击档敌 HP 读数与结算一致（5000-311=4689，v20.0 口径未动）',
    r.hpAfter === 5000 - critV && line.includes(`（敌方 HP 剩余 ${5000 - critV}/5000）`), `${r.hpAfter} | ${line}`);
  ok('运行期：暴击档战报头为 💥（crit 图标零回归）', line.includes('💥'), line);
}

// B 档：非暴击——零暴击文案，伤害 209
{
  const r = heroAttack(mkHero(), mkFoe(), 0.99);
  const line = r.lines.find((l) => l.includes('你发动攻击')) || '';
  const dmg = dmgOf(line);
  ok('运行期：非暴击档战报零暴击文案（不含「暴击」）', !line.includes('暴击'), line);
  ok('运行期：非暴击档伤害为原浮动值（209，暴击未误触）', dmg === plainV && dmg === 209, `${dmg} ≠ ${plainV}`);
  ok('运行期：非暴击档敌 HP 结算一致（5000-209=4791）', r.hpAfter === 5000 - plainV, r.hpAfter);
}

// C 档：蓄力+暴击双 note 共存——（暴击×1.8！）（蓄力爆发！），伤害 = 173×1.8×1.5=467
{
  const r = heroAttack(mkHero(), mkFoe(), 0.05, { charge: true });
  const line = r.lines.find((l) => l.includes('你发动攻击')) || '';
  const dmg = dmgOf(line);
  ok('运行期：蓄力+暴击战报含「（暴击×1.8！）」与「（蓄力爆发！）」双 note 共存',
    line.includes('（暴击×1.8！）') && line.includes('（蓄力爆发！）'), line);
  ok('运行期：蓄力+暴击伤害为 raw×1.8×1.5（467，两倍率同乘）',
    dmg === chargeCritV && dmg === 467, `${dmg} ≠ ${chargeCritV}`);
  ok('运行期：蓄力+暴击敌 HP 结算一致（5000-467=4533）', r.hpAfter === 5000 - chargeCritV, r.hpAfter);
}

// 排序守护：暴击 311 > 非暴击 209 > 蓄力×暴击分档独立（倍率同向，单次采样即安全）
{
  const rA = heroAttack(mkHero(), mkFoe(), 0.05);
  const rB = heroAttack(mkHero(), mkFoe(), 0.99);
  ok('运行期：暴击档伤害 > 非暴击档（311 > 209，与 ×1.8 倍率同向）',
    dmgOf(rA.lines.find((l) => l.includes('你发动攻击')) || '') >
    dmgOf(rB.lines.find((l) => l.includes('你发动攻击')) || ''));
}

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2157_critmult', readme.includes('smoke_v2157_critmult'));
// v21.58 去硬化（v21.7 惯例）：件套精确计数移交当版冒烟守护，本件改存活性口径——
// 仍含「冒烟/件套」且旧口径「（五十二件套清除）」已清除。
ok('README 件套口径为存活性断言（v21.58 起件数由新版冒烟守护：五十四件套（五十三件套清除））',
  readme.includes('冒烟') && readme.includes('件套') &&
  !readme.includes('（五十二件套清除）'));
ok('README 含 v21.57 守护描述（普攻暴击命中战报倍率量化守护）',
  readme.includes('普攻暴击命中战报倍率量化守护'));
ok('package.json 已收录 smoke_v2157_critmult（npm test 串跑第 53 份）', pkg.includes('smoke_v2157_critmult.mjs'));
const s2156 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2156_defendblock.mjs'), 'utf8');
ok('smoke_v2156 的 README 件套口径断言已去硬化（存活性口径落位，旧精确表达式零残留）',
  s2156.includes("!readme.includes('（五十一件套清除）')") &&
  !s2156.includes("readme.includes('五十二件套（五十一件套清除）')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
