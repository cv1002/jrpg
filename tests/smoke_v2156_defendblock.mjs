// v21.56 专项冒烟：防御格挡命中战报补「挡下 N 点」（体验打磨·信息透明）。
// 背景：enemyAI.enemyAct 受击战报此前只报「（被防御格挡！）」性质不报数值——防御链条的
// 摆架势端（battle.doDefend「本回合受到的伤害减半」）、HUD 角标端（drawBattle「防御中 ·
// 减伤50%」由 DEFEND_MULT 派生）、受击预判端（drawBattle 预判行「防御后-N血」按
// ×DEFEND_MULT 列值）三端早已量化，唯独实际命中这一端缺数；玩家防御后挨一刀，想确认
// 「这一刀防御到底替我挡了多少」只能心算对照预判行。本版按预判同口径补「挡下 N 点」
// （N = 减伤前 rawDmg − 减伤后 dmg，DEFEND_MULT 单一数据源同读）；保底 1 钳到时 N=0
// 不标数值，保持「（被防御格挡！）」逐字不变（承 v21.54 碎至 0 层不标剩余同口径）。
// 纯显示零结算零数值零存档变化（cmdDmg 调用与 max(1, round(×DEFEND_MULT)) 减伤式逐字未动，
// 只在其前/后各加一行取值与求差）。
// 本冒烟守护：版本锚点、enemyAI.js 源级落位（rawDmg 取值/blocked 求差接入 + 新文案落位 +
// 旧裸文案零残留 + 减伤式逐字零回归）、DEFEND_MULT 契约与防御链条三端同源零回归
// （doDefend 摆架势端/drawBattle 角标端/受击预判端）、运行期实证四档（防御中普攻报
// 「挡下 25 点」且 HP 结算一致、未防御零格挡文案、保底钳到零数值保持逐字、重击+防御
// 报「挡下 47 点」与倍率同向）、README/package.json 同步 + smoke_v2155 件套断言去硬化
// （v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION, DEFEND_MULT, HEAVY_MULT } from '../js/data.js';
import { enemyAct } from '../js/enemyAI.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v21.55 冒烟先例：先装桩再 import main.js）——
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

console.log('— v21.56 防御格挡命中战报补「挡下 N 点」 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.55）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.55', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 56)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.56 注释（防御格挡命中战报补「挡下 N 点」说明）', dSrc.includes('v21.56 体验打磨：防御格挡命中战报补「挡下 N 点」'));

// —— enemyAI.js 源级落位 ——
const eSrc = fs.readFileSync(path.join(ROOT, 'js/enemyAI.js'), 'utf8');
ok('enemyAI.js 含 v21.56 注释（格挡命中战报补挡下点数）', eSrc.includes('v21.56 防御格挡命中战报补「挡下 N 点」'));
ok('enemyAI.js rawDmg 减伤前取值落位（结算前捕获）', eSrc.includes('const rawDmg = dmg;\n    if (hero.defending) dmg = Math.max(1, Math.round(dmg * DEFEND_MULT));'));
ok('enemyAI.js blocked 求差落位（减伤前后差，防御中才取）', eSrc.includes('const blocked = hero.defending ? rawDmg - dmg : 0;'));
ok('enemyAI.js 新文案落位（格挡 note 按 blocked>0 条件派生「，挡下 N 点」）',
  eSrc.includes('（被防御格挡${blocked > 0 ? `，挡下 ${blocked} 点` : \'\'}！）'));
ok("enemyAI.js 旧裸文案（被防御格挡！）硬编码源级零残留", !eSrc.includes("hero.defending ? '（被防御格挡！）'"));
ok('enemyAI.js 减伤式逐字零回归（max(1, round(dmg × DEFEND_MULT)) 未动）',
  eSrc.includes('if (hero.defending) dmg = Math.max(1, Math.round(dmg * DEFEND_MULT));'));
ok('enemyAI.js cmdDmg 受击调用逐字零回归（atk/defMax/mult 三参未动）',
  eSrc.includes('let dmg = cmdDmg(enemy.atk, hero.defMax, mult);'));

// —— DEFEND_MULT 契约与防御链条三端同源零回归 ——
ok('DEFEND_MULT 契约：===0.5（减伤单一数据源）', DEFEND_MULT === 0.5, String(DEFEND_MULT));
const bSrc = fs.readFileSync(path.join(ROOT, 'js/battle.js'), 'utf8');
ok('摆架势端零回归（doDefend「本回合受到的伤害减半」逐字）', bSrc.includes('本回合受到的伤害减半'));
const vSrc = fs.readFileSync(path.join(ROOT, 'js/view/drawBattle.js'), 'utf8');
ok('HUD 角标端零回归（「防御中 · 减伤」由 DEFEND_MULT 派生）',
  vSrc.includes("'防御中 · 减伤' + Math.round((1 - DEFEND_MULT) * 100)"));
ok('受击预判端零回归（defHits 按 ×DEFEND_MULT 列值）',
  vSrc.includes('const defHits = rawHits.map((d) => Math.max(1, Math.round(d * DEFEND_MULT)));'));

// —— 运行期实证：enemyAct 真实路径（承 v21.49/v21.53 桩法：S.scene='battle' + 单招 acts 敌 + 桩 deps）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 7, hp: 120, hpMax: 120, mp: 40, mpMax: 40,
    atkMax: 100, defMax: 10, gold: 0, xp: 0, xpNext: 9999, item: 1, potion2: 0,
    weapon: '铁剑', armor: '皮甲', diff: null, skills: [], poison: 0, defending: false,
    seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, x: 1, y: 1, map: 'village' }, extra || {});
}
function mkFoe(extra) {
  return Object.assign({ name: '木桩', hp: 5000, hpMax: 5000, atk: 30, def: 10, xp: 1, gold: 0,
    color: '#8a8a8a', acts: [{ type: 'attack', w: 100 }] }, extra || {});
}
const DEPS = { addFx: noop, winBattle: noop, loseBattle: noop };
const _rand = Math.random;
function foeAct(hero, enemy) {
  Math.random = () => 0.99; // 关闭 50% 反击随机线（COUNTER_CHANCE=0.5）：本次只验格挡战报，反击支线另版已守
  try {
    S.G = hero; S.enemy = enemy; S.scene = 'battle'; S.blog = []; S.battleBusy = true;
    enemyAct(DEPS);
    const lines = S.blog.slice();
    S.enemy = null; S.scene = 'world'; S.battleBusy = false;
    return lines;
  } finally {
    Math.random = _rand;
  }
}
const atkLine = (lines) => lines.find((l) => l.includes('攻击你')) || '';

// A 档：防御中吃普攻——atk 30 / defMax 10 → raw=max(1,60-10)=50，减伤 max(1,round(50×0.5))=25，挡下 25
{
  const hero = mkHero({ defending: true });
  const lines = foeAct(hero, mkFoe());
  const line = atkLine(lines);
  const raw = Math.max(1, 30 * 2 - 10);
  const halved = Math.max(1, Math.round(raw * DEFEND_MULT));
  ok('运行期：防御中普攻战报含「（被防御格挡，挡下 25 点！）」（新文案落位）',
    line.includes(`（被防御格挡，挡下 ${raw - halved} 点！）`) && raw - halved === 25, line);
  ok('运行期：防御中 HP 结算与战报一致（120-25=95，减伤如实结算）', hero.hp === 120 - halved && hero.hp === 95, hero.hp);
  ok('运行期：我方 HP 读数零回归（v20.2「（我方 HP 95/120）」口径未动）', line.includes('（我方 HP 95/120）'), line);
}

// B 档：未防御——零格挡文案，全额 50 伤害
{
  const hero = mkHero({ defending: false });
  const lines = foeAct(hero, mkFoe());
  const line = atkLine(lines);
  ok('运行期：未防御战报零格挡文案（不含「格挡」「挡下」）', !line.includes('格挡') && !line.includes('挡下'), line);
  ok('运行期：未防御 HP 全额结算（120-50=70，减伤未误触）', hero.hp === 70 && line.includes('造成 50 伤害'), `${hero.hp} | ${line}`);
}

// C 档：保底 1 钳到——atk 1 / defMax 999 → raw=max(1,2-999)=1，减伤 max(1,round(0.5))=1，挡下 0 不标数值
{
  const hero = mkHero({ defending: true, defMax: 999 });
  const lines = foeAct(hero, mkFoe({ atk: 1 }));
  const line = atkLine(lines);
  ok('运行期：保底钳到保持「（被防御格挡！）」逐字（承 v21.54 零层不标口径）', line.includes('（被防御格挡！）'), line);
  ok('运行期：保底钳到不标「挡下」（N=0 零数值）且 HP 结算一致（120-1=119）',
    !line.includes('挡下') && hero.hp === 119, `${hero.hp} | ${line}`);
}

// D 档：防御中吃重击——raw=round(50×HEAVY_MULT 1.9)=95，减伤 max(1,round(95×0.5))=48，挡下 47（与倍率同向）
{
  const hero = mkHero({ defending: true });
  const lines = foeAct(hero, mkFoe({ acts: [{ type: 'heavy', w: 100 }] }));
  const line = atkLine(lines);
  const heavyRaw = Math.round(Math.max(1, 30 * 2 - 10) * HEAVY_MULT);
  const heavyDmg = Math.max(1, Math.round(heavyRaw * DEFEND_MULT));
  ok('运行期：重击+防御战报含「（被防御格挡，挡下 47 点！）」（挡下点数随倍率同向）',
    line.includes(`（被防御格挡，挡下 ${heavyRaw - heavyDmg} 点！）`) && heavyRaw - heavyDmg === 47, line);
  ok('运行期：重击+防御 HP 结算一致（120-48=72）', hero.hp === 120 - heavyDmg && hero.hp === 72, hero.hp);
}

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2156_defendblock', readme.includes('smoke_v2156_defendblock'));
ok('README 件套口径为五十二件套（五十一件套清除）', readme.includes('五十二件套（五十一件套清除）'));
ok('README 含 v21.56 守护描述（防御格挡命中战报挡下点数守护）',
  readme.includes('防御格挡命中战报挡下点数守护'));
ok('package.json 已收录 smoke_v2156_defendblock（npm test 串跑第 52 份）', pkg.includes('smoke_v2156_defendblock.mjs'));
const s2155 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2155_weakresist.mjs'), 'utf8');
ok('smoke_v2155 的 README 件套口径断言已去硬化（存活性口径落位，旧精确表达式零残留）',
  s2155.includes("!readme.includes('（五十件套清除）')") &&
  !s2155.includes("readme.includes('五十一件套（五十件套清除）')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
