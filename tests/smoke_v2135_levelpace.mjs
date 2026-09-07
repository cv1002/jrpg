// v21.35 专项冒烟：README 升级节奏参考「Lv1→2 约 1.5 场」口径——README 该数字是 20 ÷ 每场期望经验 13.25
// ≈ 1.51 的**线性均摊**，但 Lv1 潮灯镇遇敌池（史莱姆 11 / 野狼 15 / 哥布林 13 / 毒蛇 18，权重 4/3/4/1）
// 单场经验上限 18 < 升级阈值 XP_INIT(20)：一场永远到不了；两场最低 22 ≥ 20，恒两场即 Lv2
// （5000 局真实 randomEncounter 蒙特卡洛 1/2/3 场 = 0/5000/0）。本版把 README 行改为「恰 2 场」并注明缘由，
// XP_INIT/XP_GROW/MON_BASE 结算逐字不动（纯文档口径修正，承 v21.34 同族）。
// 本冒烟守护：版本锚点、常量零变化、Lv1 池数据层派生（单场上限/两场下限/期望经验）、运行期蒙特卡洛实证、
// README 逐词同步（恰 2 场 + 三十一件套 + v21.35 守护描述 + 「Lv1→2 约 1.5 场」清零 + 其余三档复核注记）、
// package.json 收录、smoke_v2134 版本锚点与件套断言去硬化（v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION, XP_INIT, XP_GROW, MON_BASE, MAPS, baseStats } from '../js/data.js';
import { randomEncounter, encounterWeight } from '../js/encounter.js';
import { monReward } from '../js/rules.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.33/v21.34 冒烟先例：先装桩再 import main.js，全链路启动即冒烟）——
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

console.log('— v21.35 README 升级节奏参考 Lv1→2 场数口径 冒烟 —');

// —— 版本锚点：格式合法 + 逐字等于 v21.35 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.34', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 35)));
ok("data.js GAME_VERSION 为 'v21.35'", GAME_VERSION === 'v21.35', GAME_VERSION);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.35 注释（Lv1→2 场数口径说明）', dSrc.includes('v21.35'));

// —— 常量零变化（纯文档口径修正，结算逐字不动）——
ok('XP_INIT 仍为 20（Lv1→2 阈值）', XP_INIT === 20);
ok('XP_GROW 仍为 1.42', XP_GROW === 1.42);
// 顺带锚定本章涉及的真源：Lv1 面板与升级成长毫发未动（黑暗面：防有人顺手改 baseStats）
ok('baseStats(1) 仍为 HP45 攻9 防5（38+7/7+2/3+2，零回归）',
  baseStats(1).hpMax === 45 && baseStats(1).atk === 9 && baseStats(1).def === 5,
  JSON.stringify(baseStats(1)));

// —— Lv1 潮灯镇遇敌池（与 encounter.randomEncounter 同口径派生）——
const poolDef = MAPS.village.pool;
const pool = MON_BASE.filter((m) => (poolDef ? poolDef.includes(m.name) : true) && encounterWeight(m, 1) > 0);
ok('Lv1 潮灯镇遇敌池恰为四基础怪（史莱姆/野狼/哥布林/毒蛇）',
  pool.map((m) => m.name).join(',') === '史莱姆,野狼,哥布林,毒蛇', pool.map((m) => m.name).join(','));
const xpAt1 = pool.map((m) => m.xp[0] + 1 * m.xp[1]);
const wAt1 = pool.map((m) => m.w(1));
ok('Lv1 池单场经验上限 18 < 阈值 20（一场永远到不了 Lv2）',
  Math.max(...xpAt1) === 18 && Math.max(...xpAt1) < XP_INIT, 'max=' + Math.max(...xpAt1));
ok('Lv1 池两场最低经验 22 ≥ 阈值 20（两场必胜）',
  2 * Math.min(...xpAt1) === 22 && 2 * Math.min(...xpAt1) >= XP_INIT, 'min2=' + 2 * Math.min(...xpAt1));
const totalW = wAt1.reduce((a, b) => a + b, 0);
const ex = pool.reduce((a, m, i) => a + wAt1[i] * xpAt1[i], 0) / totalW;
ok('每场期望经验 ≈13.25（20÷13.25≈1.51 即旧「约 1.5 场」的来历——线性均摊低估）',
  Math.abs(ex - 13.25) < 0.01, 'ex=' + ex.toFixed(4));
ok('权重为 4/3/4/1（w(1) 逐值）', wAt1.join(',') === '4,3,4,1', wAt1.join(','));

// —— 运行期蒙特卡洛：真实 randomEncounter 链 Lv1→2 ——
const RUNS = 2000;
let f1 = 0, f2 = 0, f3 = 0, other = 0;
for (let r = 0; r < RUNS; r++) {
  S.G = { level: 1, map: 'village' };
  let xp = 0, fights = 0;
  while (xp < XP_INIT) {
    const e = randomEncounter();
    fights++;
    xp += monReward(e.name, 1).xp;
  }
  if (fights === 1) f1++; else if (fights === 2) f2++; else if (fights === 3) f3++; else other++;
}
ok(`运行期：${RUNS} 局真实随机遭遇链全部恰 2 场升 Lv2（1/2/3 场 = ${f1}/${f2}/${f3}）`,
  f1 === 0 && f2 === RUNS && f3 === 0 && other === 0, `${f1}/${f2}/${f3}/${other}`);

// —— README 逐词同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
ok('README 升级节奏参考改为「恰 2 场」', readme.includes('恰 2 场'));
ok('README 旧行「Lv1→2 约 1.5 场（潮灯镇）」已清零（守护描述引号内的历史说明不算残留）',
  !readme.includes('Lv1→2 约 1.5 场（潮灯镇）'));
ok('README 该行含成因（单场上限 18 < 阈值 20 / 两场最低 22）', readme.includes('单场经验上限 18 < 阈值 20') && readme.includes('两场最低 22 ≥ 20'));
ok('README 含 v21.35 复核注记（Lv5→6 ≈2.1 / Lv9→10 ≈5.1 / Lv11→12 ≈7.0）',
  readme.includes('Lv5→6 ≈2.1') && readme.includes('Lv9→10 ≈5.1') && readme.includes('Lv11→12 ≈7.0'));
ok('README 数值速查「据 v21.35 代码实测整理」', readme.includes('据 v21.35 代码实测整理'));
ok('README tests 树收录 smoke_v2135_levelpace', readme.includes('smoke_v2135_levelpace'));
ok('README 件套口径为三十一件套（三十件套清除）',
  readme.includes('三十一件套') && !readme.includes('三十件套'));
ok('README 含 v21.35 守护描述（升级节奏参考 Lv1→2 场数口径）', readme.includes('v21.35 起含升级节奏参考 Lv1→2 场数口径守护'));

// —— package.json 收录 ——
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('package.json 已收录 smoke_v2135_levelpace（npm test 串跑第 31 份）',
  pkg.includes('smoke_v2135_levelpace.mjs'));

// —— smoke_v2134 去硬化（v21.7 惯例：精确版本锚点与件套计数由最新版冒烟守护）——
const s2134 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2134_xpcurve.mjs'), 'utf8');
ok('smoke_v2134 的 GAME_VERSION 精确锚点已去硬化（不再以 === "v21.34" 断言）',
  !s2134.includes("GAME_VERSION === 'v21.34'") && s2134.includes('已越过 v21.34'));
ok('smoke_v2134 的 README 件套断言已去硬化（v21.7 惯例：改为「冒烟/件套」存在性口径，不再断言「三十件套」）',
  s2134.includes("readme.includes('冒烟')") && s2134.includes("readme.includes('件套')")
  && !s2134.includes("includes('三十件套')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
