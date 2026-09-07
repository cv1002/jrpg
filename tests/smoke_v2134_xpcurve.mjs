// v21.34 专项冒烟：README 升级经验曲线链式口径——README 数值速查「升级经验」行原写闭式幂
// `round(20 × 1.42^(lv-1))`（示例 Lv11→12 需 667），而 hero.grantXp 的真实结算是**链式**逐级
// `round(hero.xpNext × XP_GROW)`（XP_INIT=20 起，每级四舍五入后累积）：闭式幂自 Lv7→8 起漂移
// （闭式 164 vs 链式 163）、Lv11→12 闭式 667 vs 链式 662——文档与结算脱节（v21.15/v21.22
// 「文档口径守护」同族）。本版把 README 行改为链式口径（含逐级全表），结算数据逐字不动。
// 本冒烟守护：版本锚点、常量导出、链式全表（由 XP_INIT/XP_GROW 重算逐值）、闭式漂移实证、
// hero.js 链式源级落位、README 逐词同步（链式行 + 三十件套 + v21.34 守护描述 + 667 清零）、
// package.json 收录、运行期 grantXp 升级链实证、smoke_v2133 版本锚点与件套断言去硬化（v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION, XP_INIT, XP_GROW, baseStats, WEAPONS, ARMORS } from '../js/data.js';
import { grantXp } from '../js/hero.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.33 冒烟先例：先装桩再 import main.js）——
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

console.log('— v21.34 README 升级经验曲线链式口径 冒烟 —');

// —— 版本锚点：格式合法 + 逐字等于 v21.34 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.33', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 34)));
// v21.35 按 v21.7 惯例去硬化：精确版本锚点由最新版冒烟（smoke_v2135）守护；本版只守「已越过 v21.34」单调界
ok("data.js GAME_VERSION 已越过 v21.34（精确值由 v21.35 冒烟守护）", !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 35)), GAME_VERSION);
const dSrc = fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../js/data.js'), 'utf8');
ok('data.js 含 v21.34 注释（链式口径说明）', dSrc.includes('v21.34'));

// —— 常量导出（结算真源）——
ok('XP_INIT 为 20（链式起点，与 core.newGame 建档同源）', XP_INIT === 20);
ok('XP_GROW 为 1.42（逐级乘数）', XP_GROW === 1.42);

// —— 链式全表：由 XP_INIT/XP_GROW 重算（与 hero.grantXp 同式）——
const chain = [XP_INIT];
for (let i = 2; i <= 12; i++) chain.push(Math.round(chain[chain.length - 1] * XP_GROW));
const expect = [20, 28, 40, 57, 81, 115, 163, 231, 328, 466, 662, 940];
ok('链式全表逐值正确（Lv1→2..Lv11→12）', JSON.stringify(chain) === JSON.stringify(expect), chain.join(','));
ok('Lv11→12 链式实需 662（README 旧行闭式示例 667 为漂移值）', chain[10] === 662);
ok('Lv7→8 链式实需 163（闭式 round(20×1.42^6)=164 已漂移 1）',
  chain[6] === 163 && Math.round(XP_INIT * Math.pow(XP_GROW, 6)) === 164);

// —— hero.js 源级落位：结算确为链式、无闭式幂 ——
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const hSrc = fs.readFileSync(path.join(ROOT, 'js/hero.js'), 'utf8');
ok('hero.js 结算为链式（hero.xpNext = Math.round(hero.xpNext * XP_GROW)）',
  hSrc.includes('hero.xpNext = Math.round(hero.xpNext * XP_GROW)'));
ok('hero.js 无闭式幂（无 1.42 指数写法，无 Math.pow/ ** 与 XP_GROW 组合）',
  !hSrc.includes('Math.pow') && !/(\*\*)/.test(hSrc) && !hSrc.includes('1.42^'));
const cSrc = fs.readFileSync(path.join(ROOT, 'js/core.js'), 'utf8');
ok('core.js 建档起点同源（newGame xpNext: XP_INIT）', cSrc.includes('xpNext: XP_INIT'));

// —— 运行期实证：真实 grantXp 链式升级（Lv7 给 164 经验 → Lv8，恰链式 163/231 行为）——
S.G.level = 7; S.G.xp = 0; S.G.xpNext = 163;
S.G.weapon = '木剑'; S.G.armor = '布衣';
const b7 = baseStats(7);
S.G.hpMax = b7.hpMax; S.G.mpMax = b7.mpMax;
S.G.atkMax = b7.atk + WEAPONS['木剑'].atk; S.G.defMax = b7.def + ARMORS['布衣'].def;
S.G.hp = 50; S.G.mp = 10; S.G.skills = [];
grantXp(S.G, 164);
ok('运行期：Lv7+164xp → 升到 Lv8（163 阈值，非闭式 164 阈值）', S.G.level === 8, 'lv=' + S.G.level);
ok('运行期：剩余经验 1（164-163）', S.G.xp === 1, 'xp=' + S.G.xp);
ok('运行期：下一级需求 231（链式 round(163×1.42)，非闭式 232）', S.G.xpNext === 231, 'next=' + S.G.xpNext);
ok('运行期：hpMax 87→94（baseStats 成长 +7，零回归）', S.G.hpMax === 94 && S.G.hp === 57, 'hpMax=' + S.G.hpMax + ' hp=' + S.G.hp);

// —— README 逐词同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
ok('README 升级经验行改为链式口径（含「链式」与「非闭式幂」字样）',
  readme.includes('链式') && readme.includes('非闭式幂'));
ok('README 升级经验行含链式全表关键值（Lv1→2 20 / Lv7→8 163 / Lv11→12 **662**）',
  readme.includes('Lv1→2 20') && readme.includes('Lv7→8 163') && readme.includes('Lv11→12 **662**'));
ok('README 旧行「Lv11→12 需 667」错误示例已清零（链式行不再以 667 作值）', !readme.includes('需 667'));
ok('README 升级节奏参考行仍与链式一致（Lv11→12 约 7.0 场 = 662/96）', readme.includes('Lv11→12 约 7.0 场'));
ok('README tests 树收录 smoke_v2134_xpcurve', readme.includes('smoke_v2134_xpcurve'));
ok('README 件套口径存在（v21.35 起按 v21.7 惯例去硬化：件数由最新版冒烟守护，本版只守「冒烟/件套」存在性）',
  readme.includes('冒烟') && readme.includes('件套'));
ok('README 含 v21.34 守护描述（升级经验链式口径）', readme.includes('v21.34'));
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('package.json 已收录 smoke_v2134_xpcurve（npm test 串跑第 30 份）',
  pkg.includes('smoke_v2134_xpcurve.mjs'));
const s2133 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2133_loadempty.mjs'), 'utf8');
ok('smoke_v2133 的 GAME_VERSION 精确锚点已去硬化（不再以 === "v21.33" 断言）',
  !s2133.includes("GAME_VERSION === 'v21.33'") && s2133.includes('已越过 v21.33'));
ok('smoke_v2133 的 README 件套断言已去硬化（v21.7 惯例：不再以「二十九件套」断言件数）',
  s2133.includes("includes('件套')") && !s2133.includes("includes('二十九件套')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
