// v21.47 专项冒烟：威胁预警补「重击线」（信息透明·预警名副其实）——battle.threatWarn 通用分支
// 此前只按普攻估算 enemyHit（两击线 enemyHit×2 ≥ hpMax），对持有 heavy 招的敌人失灵：
// 残焰魔像（acts 40% 重击）Lv10 推荐装备下一发重击 99 点（占满血 108 的 92%，v20.9 设计声明），
// 普攻线 52×2=104 < 108 只报「有些棘手」；洞窟领主（20% 重击）重击 48×2=96 ≥ Lv7 满血 87 同样失灵。
// 本版对 acts 含 heavy 的敌人按真实重击倍率（HEAVY_MULT，与 enemyAI 未变身重击结算同源）再判一次
// 两击线。本冒烟守护：版本锚点、battle.js 源级落位（HEAVY_MULT import + 重击线 + 注释）、
// 运行期实证（startBattle 真实进战 blog：残焰魔像/洞窟领主→「明显强于你」、石心魔像/普通怪/Boss
// 分支逐字零回归）、数值复核（重击线与 cmdDmg 同源逐值）、README/package 同步、
// smoke_v2146 件套断言去硬化确认（v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION, EMBER_GOLEM, CAVE_BOSS, BOSS, HEAVY_MULT, ELITE_GOLEM, SPECIES } from '../js/data.js';
import { startBattle } from '../js/battle.js';
import { cmdDmg } from '../js/rules.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v21.46 冒烟先例：先装桩再 import main.js）——
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

console.log('— v21.47 威胁预警补「重击线」 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.46）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.46', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 47)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.47 注释（威胁预警补「重击线」）', dSrc.includes('v21.47 新增：威胁预警补'));

// —— battle.js 源级落位 ——
const bSrc = fs.readFileSync(path.join(ROOT, 'js/battle.js'), 'utf8');
ok('battle.js 已 import HEAVY_MULT', /import\s*\{[^}]*\bHEAVY_MULT\b[^}]*\}\s*from\s*'\.\/data\.js'/.test(bSrc));
ok('battle.js threatWarn 重击线源级落位（hasHeavy + cmdDmg(enemy.atk, hero.defMax, HEAVY_MULT)）',
  bSrc.includes("const hasHeavy = (enemy.acts || []).some((a) => a.type === 'heavy');") &&
  bSrc.includes('const heavyHit = cmdDmg(enemy.atk, hero.defMax, HEAVY_MULT, false);'));
ok('battle.js 重击两击线落位（heavyHit * 2 >= hero.hpMax → threat 2）',
  bSrc.includes('if (heavyHit * 2 >= hero.hpMax) threat = Math.max(threat, 2);'));
ok('battle.js 含 v21.47 注释（威胁预警补「重击线」）', bSrc.includes('v21.47 威胁预警补'));
ok('battle.js 普攻两击线零回归（enemyHit * 2 >= hero.hpMax 仍在）',
  bSrc.includes('if (enemyHit * 2 >= hero.hpMax) threat = Math.max(threat, 2);'));

// —— 数值复核：重击线与 cmdDmg 同源逐值（v20.9 设计声明口径）——
// Lv10 玩家推荐装备：baseStats(10) def 23 + 龙鳞甲 13 = 36，hpMax 108
ok('残焰魔像 Lv10 普攻线失灵实证（52×2=104 < 108）',
  cmdDmg(EMBER_GOLEM.atk, 36, 1, false) === 52 && 52 * 2 < 108);
ok('残焰魔像 Lv10 重击 99 点（占满血 92%，v20.9 口径）且 99×2 ≥ 108',
  cmdDmg(EMBER_GOLEM.atk, 36, HEAVY_MULT, false) === 99 && 99 * 2 >= 108);
// Lv7 玩家：baseStats(7) def 17 + 锁子甲 8 = 25，hpMax 87
ok('洞窟领主 Lv7 普攻线失灵实证（25×2=50 < 87）',
  cmdDmg(CAVE_BOSS.atk, 25, 1, false) === 25 && 25 * 2 < 87);
ok('洞窟领主 Lv7 重击 48 点且 48×2=96 ≥ 87',
  cmdDmg(CAVE_BOSS.atk, 25, HEAVY_MULT, false) === 48 && 48 * 2 >= 87);
ok('残焰魔像/洞窟领主持有 heavy 招（数据面健全）',
  (EMBER_GOLEM.acts || []).some((a) => a.type === 'heavy') && (CAVE_BOSS.acts || []).some((a) => a.type === 'heavy'));
ok('石心魔像无 heavy 招（attack/shield 机制怪，预警口径本版不变）',
  !(SPECIES['石心魔像'].acts || []).some((a) => a.type === 'heavy'));

// —— 运行期实证：startBattle 真实进战 blog ——
function mkHero(lv, hpMax, atkMax, defMax) {
  return { name: '测试者', level: lv, hp: hpMax, hpMax, mp: 30, mpMax: 30, atkMax, defMax,
    gold: 0, xp: 0, item: 0, potion2: 0, weapon: null, armor: null, diff: null,
    seen: {}, bestiary: {}, chests: [], fragments: [], x: 1, y: 1, map: 'village' };
}
function warnOf(enemy, hero) {
  S.G = hero; S.G.map = hero.map;
  startBattle(enemy);
  const line = S.blog[0] || '';
  S.enemy = null; S.scene = 'world';
  return line;
}

// 残焰魔像（Lv10 推荐装备）：普攻线只到「棘手」→ 重击线升级「明显强于你」
const w1 = warnOf(EMBER_GOLEM, mkHero(10, 108, 39, 36));
ok('运行期：Lv10 遭遇残焰魔像 → 预警升级「⚠️ 强敌：它明显强于你」（重击线生效）',
  w1.includes('残焰魔像') && w1.includes('明显强于你'), w1);
// 洞窟领主（Lv7）：同理升级
const w2 = warnOf(CAVE_BOSS, mkHero(7, 87, 29, 25));
ok('运行期：Lv7 遭遇洞窟领主 → 预警升级「明显强于你」（重击线生效）',
  w2.includes('洞窟领主') && w2.includes('明显强于你'), w2);
// 石心魔像（Lv3）：无 heavy 招 → 仍「有些棘手」，零回归
const golem3 = { ...ELITE_GOLEM, hp: ELITE_GOLEM.hp[0] + 3 * ELITE_GOLEM.hp[1], atk: ELITE_GOLEM.atk[0] + 3 * ELITE_GOLEM.atk[1], def: ELITE_GOLEM.def[0] + 3 * ELITE_GOLEM.def[1], isElite: true };
const w3 = warnOf(golem3, mkHero(3, 66, 17, 14));
ok('运行期：Lv3 遭遇石心魔像 → 仍「此敌有些棘手」（无 heavy 招零回归，不升级）',
  w3.includes('石心魔像') && w3.includes('有些棘手') && !w3.includes('明显强于你'), w3);
// 普通怪（史莱姆 Lv1）：无预警零回归
const slime = { name: '史莱姆', hp: 21, atk: 5, def: 3, xp: 11, gold: 10, color: '#7fd84f' };
const w4 = warnOf(slime, mkHero(1, 45, 11, 9));
ok('运行期：Lv1 遭遇史莱姆 → 无任何威胁预警（普通怪零回归）',
  w4.includes('史莱姆') && !w4.includes('⚠️'), w4);
// 幽冥魔王（isBoss）：固定文案零回归（不走通用分支）
const w5 = warnOf(BOSS, mkHero(8, 94, 31, 30));
ok('运行期：遭遇幽冥魔王 → 仍「强敌：旧灯卫的影子」（isBoss 固定文案零回归）',
  w5.includes('幽冥魔王') && w5.includes('旧灯卫的影子'), w5);
// 残焰魔像在高练度玩家面前仍报警（重击 91×2 ≥ 122——威胁=敌方输出能力口径，与既有普攻线同族）
const w6 = warnOf(EMBER_GOLEM, mkHero(12, 122, 43, 40));
ok('运行期：Lv12 遭遇残焰魔像 → 仍报「明显强于你」（重击 91×2=182 ≥ 122，承伤视角口径一致）',
  w6.includes('明显强于你'), w6);

// —— README 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
ok('README tests 树收录 smoke_v2147_heavywarn', readme.includes('smoke_v2147_heavywarn'));
ok('README 件套口径为四十三件套（四十二件套清除）', readme.includes('四十三件套（四十二件套清除）'));
ok('README 含 v21.47 守护描述（威胁预警重击线守护）', readme.includes('威胁预警重击线守护'));

// —— package.json 收录 ——
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('package.json 已收录 smoke_v2147_heavywarn（npm test 串跑第 43 份）', pkg.includes('smoke_v2147_heavywarn.mjs'));

// —— smoke_v2146 的 README 件套口径断言已去硬化（v21.7 惯例）——
const s2146 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2146_trialrec.mjs'), 'utf8');
ok('smoke_v2146 的 README 件套口径断言已去硬化（v21.7 惯例：改用存活性口径，旧精确表达式「readme.includes(四十二件套（四十一件套清除）)」零残留，实件数由本版冒烟守护）',
  s2146.includes("!readme.includes('（四十一件套清除）')") &&
  !s2146.includes("readme.includes('四十二件套（四十一件套清除）')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
