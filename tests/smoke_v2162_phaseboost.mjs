// v21.62 专项冒烟：Boss 变身战报补确切攻防增幅（体验打磨·信息透明）。
// 背景：enemyAI.enemyAct 的 phase2 变身战报此前只报「力量暴涨」与回血实数——
// 变身链条的战前预告端（drawBattle 角标「变身：攻+N 防+N 回N%」，v12.7 起读
// enemy.phase2 同源派生）与帮助页端（「血量过半现出真身：攻+N 防+N 回血N%HP」
// phaseBoost 派生）两端早已量化，唯独变身这一刻缺攻防数字；玩家被真身新数值打崩，
// 想确认「攻防到底涨了多少」只能回忆开场角标或翻帮助页。本版按角标同款 bits 口径补
// 「（攻+N 防+N）」：atkUp/defUp 与加算结算同读 phase.atk/phase.def 一份源（原
// `enemy.atk += (phase.atk || 0)` 的 `|| 0` 语义逐字保留，仅提升为 const 复用）；
// 非零项才入列（与 drawBattle boostBits 同口径），全零为理论死代码（三 Boss phase2
// 均显式带 atk/def），保持原句「力量暴涨，」逐字不变。纯显示零结算零数值零存档变化。
// 本冒烟守护：版本锚点、data.js/enemyAI.js 源级落位（v21.62 注释 + atkUp/defUp 提升
// 与加算落位 + 新文案落位 + 旧裸文案零残留 + heal/forbid 结算逐字零回归）、SPECIES
// 三 Boss phase2 契约（atk/def/heal 显式正配）、变身链条两端同源零回归（drawBattle
// 角标端 / data.js phaseBoost 帮助页端）、运行期实证六档（魔王「（攻+7 防+3）」且
// atk/def/HP 结算一致、洞窟领主「（攻+5 防+2）」、只攻不防只列「（攻+4）」、全零
// 死代码保持原句逐字、终焉之神「 治愈被封印！」后缀保留、未达变身线不变身）、
// README/package.json 同步 + smoke_v2161 件套断言去硬化（v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION, SPECIES, PHASE2_AT } from '../js/data.js';
import { enemyAct } from '../js/enemyAI.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v21.61 冒烟先例：先装桩再 import main.js）——
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

console.log('— v21.62 Boss 变身战报补确切攻防增幅 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.61）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.61', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 62)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.62 注释（Boss 变身战报补确切攻防增幅说明）',
  dSrc.includes('v21.62 体验打磨：Boss 变身战报补确切攻防增幅'));

// —— enemyAI.js 源级落位 ——
const eSrc = fs.readFileSync(path.join(ROOT, 'js/enemyAI.js'), 'utf8');
ok('enemyAI.js 含 v21.62 注释（变身增益战报补确切攻防增幅）', eSrc.includes('v21.62 变身增益战报补确切攻防增幅'));
ok('enemyAI.js atkUp 提升落位（phase.atk || 0 语义逐字保留）', eSrc.includes('const atkUp = phase.atk || 0;'));
ok('enemyAI.js defUp 提升落位（phase.def || 0 语义逐字保留）', eSrc.includes('const defUp = phase.def || 0;'));
ok('enemyAI.js 加算结算改读提升后 const（enemy.atk += atkUp）', eSrc.includes('enemy.atk += atkUp;'));
ok('enemyAI.js 加算结算改读提升后 const（enemy.def += defUp）', eSrc.includes('enemy.def += defUp;'));
ok('enemyAI.js 新文案落位（力量暴涨${boostTxt}，HP 恢复）', eSrc.includes('力量暴涨${boostTxt}，HP 恢复'));
ok('enemyAI.js 旧裸文案（力量暴涨，HP 恢复）源级零残留', !eSrc.includes('力量暴涨，HP 恢复'));
ok('enemyAI.js 回血结算逐字零回归（Math.round(hpMax × (phase.heal || PHASE2_HEAL_PCT))）',
  eSrc.includes('Math.round(enemy.hpMax * (phase.heal || PHASE2_HEAL_PCT))'));
ok('enemyAI.js 封治愈后缀逐字零回归（ 治愈被封印！）',
  eSrc.includes("phase.forbid && phase.forbid.includes('heal') ? ' 治愈被封印！' : ''"));

// —— SPECIES 三 Boss phase2 契约（atk/def/heal 显式正配）——
const p2d = SPECIES['幽冥魔王'].phase2, p2c = SPECIES['洞窟领主'].phase2, p2t = SPECIES['终焉之神'].phase2;
ok('SPECIES 契约：幽冥魔王 phase2 显式 atk:7/def:3/heal:0.15',
  p2d.atk === 7 && p2d.def === 3 && p2d.heal === 0.15, JSON.stringify(p2d));
ok('SPECIES 契约：洞窟领主 phase2 显式 atk:5/def:2/heal:0.10',
  p2c.atk === 5 && p2c.def === 2 && p2c.heal === 0.10, JSON.stringify(p2c));
ok('SPECIES 契约：终焉之神 phase2 显式 atk:7/def:3/heal:0.15 且封治愈',
  p2t.atk === 7 && p2t.def === 3 && p2t.heal === 0.15 && (p2t.forbid || []).includes('heal'), JSON.stringify(p2t));

// —— 变身链条两端同源零回归（drawBattle 角标端 / data.js phaseBoost 帮助页端）——
const vSrc = fs.readFileSync(path.join(ROOT, 'js/view/drawBattle.js'), 'utf8');
ok('角标端零回归（drawBattle boostBits 攻+N/防+N 读 enemy.phase2 派生）',
  vSrc.includes('boostBits.push(`攻+${p2.atk}`)') && vSrc.includes('boostBits.push(`防+${p2.def}`)'));
ok('帮助页端零回归（data.js phaseBoost「攻+N 防+N 回血N%HP」派生模板在）',
  dSrc.includes('const phaseBoost = (p) => `攻+${p.atk} 防+${p.def} 回血${Math.round((p.heal || 0) * 100)}%HP`;'));

// —— 运行期实证：enemyAct 真实路径（承 v21.58 桩法；变身分支提前返回不触 addFx）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 8, hp: 200, hpMax: 200, mp: 40, mpMax: 40,
    atkMax: 50, defMax: 20, gold: 0, xp: 0, xpNext: 9999, item: 1, potion2: 0,
    weapon: '铁剑', armor: '皮甲', diff: null, skills: [],
    poison: 0, seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, x: 1, y: 1, map: 'village',
    charge: false }, extra || {});
}
const DEPS = { addFx: noop, winBattle: noop, loseBattle: noop };
function phaseTick(foe) {
  S.G = mkHero();
  S.enemy = foe;
  S.scene = 'battle';
  S.blog = [];
  enemyAct(DEPS);
  const lines = S.blog.slice();
  const ref = S.enemy;
  S.enemy = null; S.scene = 'world'; S.battleBusy = false; S.G = null;
  return { lines, ref };
}
const phaseLine = (lines) => lines.find((l) => l.includes('现出真身')) || '';
function mkBossFoe(phase2, extra) {
  return Object.assign({ name: '测试Boss', hp: 400, hpMax: 1000, atk: 23, def: 13,
    xp: 1, gold: 0, color: '#888888', phased: false, phase2 }, extra || {});
}

// A 档：幽冥魔王（atk:7 def:3 heal:0.15）——报「力量暴涨（攻+7 防+3）」且攻防/回血结算一致
{
  const foe = mkBossFoe({ at: 0.5, name: '幽冥魔王·真身', color: '#6a2ad9', atk: 7, def: 3, heal: 0.15 });
  const r = phaseTick(foe);
  const line = phaseLine(r.lines);
  ok('运行期：魔王变身战报含「力量暴涨（攻+7 防+3）」（新文案落位）',
    line.includes('力量暴涨（攻+7 防+3）'), line);
  ok('运行期：攻防加算结算一致（atk 23→30 / def 13→16，与报文同源）',
    r.ref.atk === 30 && r.ref.def === 16, `atk=${r.ref.atk} def=${r.ref.def}`);
  ok('运行期：回血与 HP 读数零回归（HP 恢复 150！（敌方 HP 550/1000））',
    line.includes('HP 恢复 150！') && line.includes('（敌方 HP 550/1000）') && r.ref.hp === 550, line);
  ok('运行期：改名/变色/变身旗标零回归（幽冥魔王·真身 + phased）',
    r.ref.name === '幽冥魔王·真身' && r.ref.phased === true && r.ref.color === '#6a2ad9', r.ref.name);
}

// B 档：洞窟领主（atk:5 def:2 heal:0.10）——报「（攻+5 防+2）」
{
  const foe = mkBossFoe({ at: 0.5, name: '洞窟领主·真身', color: '#5aa0d0', atk: 5, def: 2, heal: 0.10 });
  const r = phaseTick(foe);
  const line = phaseLine(r.lines);
  ok('运行期：领主变身战报含「力量暴涨（攻+5 防+2）」且结算一致（atk 23→28 / def 13→15 / HP+100）',
    line.includes('力量暴涨（攻+5 防+2）') && r.ref.atk === 28 && r.ref.def === 15 && r.ref.hp === 500, line);
}

// C 档：只攻不防理论档（atk:4 def:0）——bits 口径只列非零项「（攻+4）」，不出「防+0」
{
  const foe = mkBossFoe({ at: 0.5, name: '独攻魔·真身', atk: 4, def: 0, heal: 0.15 });
  const r = phaseTick(foe);
  const line = phaseLine(r.lines);
  ok('运行期：只攻不防档报「（攻+4）」且不含「防+0」（与角标 boostBits 同口径）',
    line.includes('力量暴涨（攻+4）') && !line.includes('防+0'), line);
  ok('运行期：只攻不防档结算一致（atk 23→27 / def 13 不变）',
    r.ref.atk === 27 && r.ref.def === 13, `atk=${r.ref.atk} def=${r.ref.def}`);
}

// D 档：全零理论死代码（atk:0 def:0）——保持原句「力量暴涨，HP 恢复」逐字不变
{
  const foe = mkBossFoe({ at: 0.5, name: '纸老虎·真身', atk: 0, def: 0, heal: 0.15 });
  const r = phaseTick(foe);
  const line = phaseLine(r.lines);
  ok('运行期：全零档保持原句逐字「力量暴涨，HP 恢复」（无括号，防御分支存活性）',
    line.includes('力量暴涨，HP 恢复') && !/力量暴涨（/.test(line), line);
  ok('运行期：全零档攻防不变（atk 23 / def 13）', r.ref.atk === 23 && r.ref.def === 13,
    `atk=${r.ref.atk} def=${r.ref.def}`);
}

// E 档：终焉之神（forbid heal）——「（攻+7 防+3）」与「 治愈被封印！」后缀共存
{
  const foe = mkBossFoe({ at: 0.5, name: '终焉之神·祸乱形态', color: '#ff5b8a', atk: 7, def: 3, heal: 0.15, forbid: ['heal'] });
  const r = phaseTick(foe);
  const line = phaseLine(r.lines);
  ok('运行期：终焉之神档「（攻+7 防+3）」与「 治愈被封印！」后缀共存且 forbid 落位',
    line.includes('力量暴涨（攻+7 防+3）') && line.includes(' 治愈被封印！') && (r.ref.forbid || []).includes('heal'), line);
}

// F 档：未达变身线（hp ≥ hpMax×PHASE2_AT）——不变身、战报零真身文案、攻防不变
{
  const foe = mkBossFoe({ at: 0.5, name: '幽冥魔王·真身', atk: 7, def: 3, heal: 0.15 }, { hp: 600 });
  const r = phaseTick(foe);
  ok('运行期：未达变身线不变身（无「现出真身」战报、atk/def 不变、phased 未立）',
    !r.lines.some((l) => l.includes('现出真身')) && r.ref.atk === 23 && r.ref.def === 13 && !r.ref.phased,
    r.lines.join(' | '));
  ok('运行期：变身阈值契约（PHASE2_AT===0.5，hp 600 不 < 1000×0.5=500）', PHASE2_AT === 0.5);
}

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2162_phaseboost', readme.includes('smoke_v2162_phaseboost'));
// v21.63 去硬化（v21.7 惯例）：件套精确计数移交当版冒烟守护，本件改存活性口径——
// 仍含「冒烟/件套」且旧口径「（五十七件套清除）」已清除。
ok('README 件套口径为存活性断言（v21.63 起件数由新版冒烟守护：五十九件套（五十八件套清除））',
  readme.includes('冒烟') && readme.includes('件套') &&
  !readme.includes('（五十七件套清除）'));
ok('README 含 v21.62 守护描述（变身战报攻防增幅守护）',
  readme.includes('变身战报攻防增幅守护'));
ok('package.json 已收录 smoke_v2162_phaseboost（npm test 串跑第 58 份）', pkg.includes('smoke_v2162_phaseboost.mjs'));
const s2161 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2161_skillhint.mjs'), 'utf8');
ok('smoke_v2161 的 README 件套口径断言已去硬化（存活性口径落位，旧精确表达式零残留）',
  s2161.includes("!readme.includes('（五十六件套清除）')") &&
  !s2161.includes("readme.includes('五十七件套（五十六件套清除）')"));
ok('smoke_v2161 的 GAME_VERSION 精确 pin 已去硬化（前向兼容口径落位，旧等值 pin 零残留）',
  s2161.includes('已越过 v21.61') && !s2161.includes("GAME_VERSION === 'v21.61'"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
