// v21.58 专项冒烟：石甲挡伤命中战报补「挡下 N 点」（体验打磨·信息透明）。
// 背景：battle.attackMove 的石甲分支此前只报「石甲挡下了部分伤害」性质不报数值——
// 石甲链条的凝结端（enemyAI「累计 N 层，降低 X%」）、击碎端（v21.54「石甲碎裂，
// 剩余 N 层」）、HUD 角标端（drawBattle「🪨 石甲×N」）三端早已量化，唯独任意攻击
// 打在石甲上的命中这一端缺数；玩家砍在有甲的怪上，想确认「这层甲到底挡了多少」
// 只能心算。本版按 v21.56 防御格挡同式补「挡下 N 点」（N = 减伤前 rawDmg − 减伤后
// dmg，SHIELD_MULT 单一数据源同读）；保底 1 钳到时 N=0 不标数值，保持原句逐字不变
// （承 v21.54 碎至 0 层不标剩余同口径）。纯显示零结算零数值零存档变化
// （shield-- 赋值与 max(1, round(×SHIELD_MULT)) 减伤式逐字未动，只在其前/后各加
// 一行取值与求差）。
// 本冒烟守护：版本锚点、data.js/battle.js 源级落位（v21.58 注释 + rawDmg 取值 /
// blocked 求差接入 + 新文案落位 + 旧裸文案零残留 + 减伤式与 shield-- 逐字零回归）、
// SHIELD_MULT 契约与石甲链条三端同源零回归（enemyAI 凝结端 / doSkill 击碎端 /
// drawBattle 角标端）、运行期实证四档（普攻+3 层盾报「挡下 84 点」且敌 HP 结算一致、
// 无盾档零石甲文案、保底钳到零数值保持原句逐字且碎至 0 层不标剩余、蓄力+盾报
// 「挡下 126 点」与倍率同向）、README/package.json 同步 + smoke_v2157 件套断言
// 去硬化（v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION, SHIELD_MULT, CHARGE_MULT } from '../js/data.js';
import { startBattle, playerAction } from '../js/battle.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v21.57 冒烟先例：先装桩再 import main.js）——
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

console.log('— v21.58 石甲挡伤命中战报补「挡下 N 点」 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.57）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.57', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 58)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.58 注释（石甲挡伤命中战报补「挡下 N 点」说明）',
  dSrc.includes('v21.58 体验打磨：石甲挡伤命中战报补「挡下 N 点」'));

// —— battle.js 源级落位 ——
const bSrc = fs.readFileSync(path.join(ROOT, 'js/battle.js'), 'utf8');
ok('battle.js 含 v21.58 注释（石甲挡伤命中战报补「挡下 N 点」）', bSrc.includes('v21.58 石甲挡伤命中战报补「挡下 N 点」'));
ok('battle.js rawDmg 减伤前取值落位（结算前捕获）', bSrc.includes('const rawDmg = dmg;\n    enemy.shield--;'));
ok('battle.js blocked 求差落位（减伤前后差）', bSrc.includes('const blocked = rawDmg - dmg;'));
ok('battle.js 新文案落位（石甲 note 按 blocked>0 条件派生「，挡下 N 点」）',
  bSrc.includes('石甲挡下了部分伤害${blocked > 0 ? `，挡下 ${blocked} 点` : \'\'}！'));
ok('battle.js 旧裸文案（石甲挡下了部分伤害！…）源级零残留', !bSrc.includes('石甲挡下了部分伤害！${enemy.shield'));
ok('battle.js 减伤式逐字零回归（max(1, round(dmg × SHIELD_MULT)) 未动）',
  bSrc.includes('dmg = Math.max(1, Math.round(dmg * SHIELD_MULT));'));
ok('battle.js shield-- 逐字零回归（层数扣减未动）', bSrc.includes('enemy.shield--;'));

// —— SHIELD_MULT 契约与石甲链条三端同源零回归 ——
ok('SHIELD_MULT 契约：===0.6（石甲单一数据源）', SHIELD_MULT === 0.6, String(SHIELD_MULT));
const eSrc = fs.readFileSync(path.join(ROOT, 'js/enemyAI.js'), 'utf8');
ok('凝结端零回归（enemyAI「累计 N 层，所受伤害降低 X%」逐字）',
  eSrc.includes('凝结【石甲】！（累计 ${enemy.shield} 层'));
ok('击碎端零回归（doSkill breakShield「石甲碎裂，剩余 N 层」逐字）',
  bSrc.includes('（石甲碎裂${enemy.shield > 0'));
const vSrc = fs.readFileSync(path.join(ROOT, 'js/view/drawBattle.js'), 'utf8');
ok('HUD 角标端零回归（「🪨 石甲×N（受击-X%）」由 SHIELD_MULT 派生）',
  vSrc.includes('🪨 石甲×${enemy.shield}（受击-${Math.round((1 - SHIELD_MULT) * 100)}%）'));

// —— 运行期实证：startBattle + playerAction('attack') 真实路径（承 v21.57 桩法）——
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
    const shieldAfter = S.enemy ? (S.enemy.shield || 0) : null;
    const enemyRef = S.enemy;
    S.enemy = null; S.scene = 'world'; S.battleBusy = false;
    return { lines, hpAfter, shieldAfter, enemyRef };
  } finally {
    Math.random = _rand;
  }
}
const shieldLine = (lines) => lines.find((l) => l.includes('石甲挡下了部分伤害')) || '';
const atkLine = (lines) => lines.find((l) => l.includes('你发动攻击')) || '';
const dmgOf = (line) => { const m = /造成 (\d+) 伤害/.exec(line || ''); return m ? Number(m[1]) : null; };
// atkMax 100 / def 10 → raw=max(1,200-10)=190；roll=0.99 → 浮动 1.098 → round(208.62)=209
const plainV = Math.round(Math.max(1, 100 * 2 - 10) * (0.9 + 0.99 * 0.2));
const shieldDmgV = Math.max(1, Math.round(plainV * SHIELD_MULT));          // 209×0.6=125.4 → 125
const blockedV = plainV - shieldDmgV;                                       // 84
// 蓄力档：round(209×1.5)=round(313.5)=314 → 314×0.6=188.4 → 188
const chargeV = Math.round(plainV * CHARGE_MULT);
const chargeDmgV = Math.max(1, Math.round(chargeV * SHIELD_MULT));
const chargeBlockedV = chargeV - chargeDmgV;                                // 126

// A 档：普攻 + 3 层石甲——报「挡下 84 点」（剩余 2 层），伤害 125、敌 HP 5000→4875
{
  const r = heroAttack(mkHero(), mkFoe({ shield: 3 }), 0.99);
  const sLine = shieldLine(r.lines);
  const aLine = atkLine(r.lines);
  ok('运行期：石甲战报含「挡下 84 点！（剩余 2 层）」（新文案落位）',
    sLine.includes(`挡下 ${blockedV} 点`) && blockedV === 84 && sLine.includes('（剩余 2 层）'), sLine);
  ok('运行期：石甲层数扣减如实（3→2）', r.shieldAfter === 2, String(r.shieldAfter));
  ok('运行期：伤害为 ×SHIELD_MULT 结算（125=209×0.6 如实减伤）',
    dmgOf(aLine) === shieldDmgV && shieldDmgV === 125, aLine);
  ok('运行期：敌 HP 结算与战报一致（5000-125=4875，v20.0 口径未动）',
    r.hpAfter === 5000 - shieldDmgV && aLine.includes(`（敌方 HP 剩余 ${5000 - shieldDmgV}/5000）`), `${r.hpAfter} | ${aLine}`);
}

// B 档：无石甲——零石甲文案，全额 209 伤害
{
  const r = heroAttack(mkHero(), mkFoe(), 0.99);
  ok('运行期：无盾档零石甲文案（blog 不含「石甲挡下」）', !r.lines.some((l) => l.includes('石甲挡下了部分伤害')), r.lines.join(' | '));
  const aLine = atkLine(r.lines);
  ok('运行期：无盾档伤害全额结算（209，减伤未误触）且敌 HP 一致',
    dmgOf(aLine) === plainV && plainV === 209 && r.hpAfter === 5000 - plainV, `${r.hpAfter} | ${aLine}`);
}

// C 档：保底 1 钳到——atkMax 1 / def 999 → raw=max(1,2-999)=1，×0.6 → max(1,round(0.6))=1，挡下 0 不标数值
{
  const r = heroAttack(mkHero({ atkMax: 1, defMax: 999 }), mkFoe({ shield: 1 }), 0.99);
  const sLine = shieldLine(r.lines);
  ok('运行期：保底钳到保持「石甲挡下了部分伤害！」逐字（承 v21.54 零层不标口径）',
    sLine.includes('石甲挡下了部分伤害！'), sLine);
  ok('运行期：保底钳到不标「挡下 N 点」（N=0 零数值）、碎至 0 层不标「剩余」且 HP 结算一致（5000-1=4999）',
    !/挡下 \d+ 点/.test(sLine) && !sLine.includes('剩余') && r.hpAfter === 4999 && r.shieldAfter === 0,
    `${r.hpAfter}/${r.shieldAfter} | ${sLine}`);
}

// D 档：蓄力 + 3 层石甲——挡下 126 点（314×0.6=188.4→188，挡下随倍率同向 84→126）
{
  const r = heroAttack(mkHero(), mkFoe({ shield: 3 }), 0.99, { charge: true });
  const sLine = shieldLine(r.lines);
  const aLine = atkLine(r.lines);
  ok('运行期：蓄力+盾战报含「挡下 126 点」（挡下点数随倍率同向）',
    sLine.includes(`挡下 ${chargeBlockedV} 点`) && chargeBlockedV === 126, sLine);
  ok('运行期：蓄力+盾伤害为 round(209×1.5)×0.6（188）且敌 HP 一致（5000-188=4812）',
    dmgOf(aLine) === chargeDmgV && chargeDmgV === 188 && r.hpAfter === 5000 - chargeDmgV &&
    aLine.includes('（蓄力爆发！）'), `${r.hpAfter} | ${aLine}`);
}

// 排序守护：普攻挡下 84 < 蓄力挡下 126（与倍率同向，单次采样即安全）
{
  const rA = heroAttack(mkHero(), mkFoe({ shield: 3 }), 0.99);
  const rD = heroAttack(mkHero(), mkFoe({ shield: 3 }), 0.99, { charge: true });
  const bA = /挡下 (\d+) 点/.exec(shieldLine(rA.lines));
  const bD = /挡下 (\d+) 点/.exec(shieldLine(rD.lines));
  ok('运行期：蓄力挡下 > 普攻挡下（126 > 84，与 ×CHARGE_MULT 倍率同向）',
    bA && bD && Number(bD[1]) > Number(bA[1]), `${bA && bA[1]} vs ${bD && bD[1]}`);
}

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2158_shieldblock', readme.includes('smoke_v2158_shieldblock'));
ok('README 件套口径为五十四件套（五十三件套清除）', readme.includes('五十四件套（五十三件套清除）'));
ok('README 含 v21.58 守护描述（石甲挡伤命中战报挡下点数守护）',
  readme.includes('石甲挡伤命中战报挡下点数守护'));
ok('package.json 已收录 smoke_v2158_shieldblock（npm test 串跑第 54 份）', pkg.includes('smoke_v2158_shieldblock.mjs'));
const s2157 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2157_critmult.mjs'), 'utf8');
ok('smoke_v2157 的 README 件套口径断言已去硬化（存活性口径落位，旧精确表达式零残留）',
  s2157.includes("!readme.includes('（五十二件套清除）')") &&
  !s2157.includes("readme.includes('五十三件套（五十二件套清除）')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
