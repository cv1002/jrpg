// v21.32 专项冒烟：世界画面可交互对象上下文提示 E 键口径收尾——v21.29 给大地图加了 E 与 Enter 同效交互
// （README/H 页/教程三处口径同步后），world 画面 faceHint 的面向提示（对话/商店/旅馆/酿造/读碑）仍只画
// 「⏎」：玩家按提示按 ⏎ 之外、按文档用 E 时，面前提示与真实输入对不上号。本版把交互类提示统一改为
// 「⏎/E」（与「Enter / E」逐字同源），踩踏类提示（喷泉/宝箱/祭坛/试炼碑/传送门）逐字不动。纯显示零结算。
// 承 v21.10 起冒烟入库先例（仓库常驻版）。
import { S } from '../js/state.js';
import { GAME_VERSION } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.30/v21.31 冒烟先例：先装桩再 import main.js；ctx 记录所有 fillText）——
const drawn = [];
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
    fillText: (t) => { drawn.push(String(t)); },
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
const { drawWorld } = await import('../js/view/index.js');
const { goto } = await import('../js/scene.js');
const { loadMap } = await import('../js/world.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.32 世界画面可交互对象上下文提示 E 键口径 冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.31 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.31', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 32)));
ok("data.js GAME_VERSION 为 'v21.32'", GAME_VERSION === 'v21.32', GAME_VERSION);

// —— 源级落位：faceHint 交互类提示全部改 ⏎/E，旧单键 ⏎ 标签零残留，踩踏类提示逐字未动 ——
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mSrc = fs.readFileSync(path.join(ROOT, 'js/view/drawWorld.js'), 'utf8');
ok('drawWorld.js 含 v21.32 注释（面向提示 E 键口径说明）', mSrc.includes('v21.32'));
ok('faceHint NPC 分支已改 "⏎/E 对话"（含名字派生）',
  mSrc.includes("'⏎/E 对话 · '") && mSrc.includes("'⏎/E 对话'"));
ok('faceHint 商店/旅馆/酿造分支已改 ⏎/E',
  mSrc.includes("'⏎/E 商店'") && mSrc.includes("'⏎/E 旅馆'") && mSrc.includes("'⏎/E 酿造'"));
ok('faceHint 读碑分支已改 ⏎/E', mSrc.includes("'⏎/E 读碑 · 名字石碑'"));
ok('旧单键标签零残留（⏎ 对话/商店/旅馆/酿造/读碑 均已清除）',
  !mSrc.includes('⏎ 对话') && !mSrc.includes('⏎ 商店') && !mSrc.includes('⏎ 旅馆') &&
  !mSrc.includes('⏎ 酿造') && !mSrc.includes('⏎ 读碑'));
ok('踩踏类提示逐字未动（喷泉/宝箱/开战/挑战/通行/门锁）',
  mSrc.includes('踩上回血') && mSrc.includes('踩上开启') && mSrc.includes('踩上开战') &&
  mSrc.includes('踩上挑战') && mSrc.includes('踩上通行') && mSrc.includes('⛔ 门锁着'));
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.32 注释', dSrc.includes('v21.32'));

// —— 运行期实证：真实模块链加载后，面向各类可交互对象 drawWorld 均绘制 ⏎/E 双键提示，踩踏提示不变 ——
goto('world');
function probe(name, x, y, dir, expect) {
  S.G.x = x; S.G.y = y; S.dir = dir;
  drawn.length = 0;
  try { drawWorld(); } catch (e) { ok(name, false, 'THREW: ' + e.message); return; }
  const hit = drawn.find((t) => t.includes(expect));
  ok(name, !!hit, hit ? '' : 'labels=' + drawn.filter((t) => t.includes('⏎') || t.includes('踩上')).join(' | '));
}
probe('面向灯长NPC绘「⏎/E 对话 · 灯长」', 13, 7, 'U', '⏎/E 对话 · 灯长');
probe('面向商店绘「⏎/E 商店」', 8, 10, 'U', '⏎/E 商店');
probe('面向酿造锅绘「⏎/E 酿造」', 11, 12, 'L', '⏎/E 酿造');
probe('面向旅馆绘「⏎/E 旅馆」', 3, 12, 'D', '⏎/E 旅馆');
probe('面向喷泉踩踏提示零回归（踩上回血）', 12, 7, 'U', '踩上回血');
loadMap('gallery');
probe('面向名字石碑绘「⏎/E 读碑 · 名字石碑」', 5, 2, 'U', '⏎/E 读碑 · 名字石碑');

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README 已同步（tests 树收录 smoke_v2132_facesign + 冒烟二十八件套口径、二十七件套清除）',
  readme.includes('smoke_v2132_facesign') && readme.includes('二十八件套') && !readme.includes('二十七件套'));
ok('README 面向提示句已同步 ⏎/E 双键口径',
  readme.includes('⏎/E 对话·名字') && readme.includes('⏎/E 商店/旅馆/酿造') && readme.includes('v21.32'));
ok('package.json 已收录 smoke_v2132_facesign（npm test 串跑第 28 份）',
  pkg.includes('smoke_v2132_facesign.mjs'));
const s2131 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2131_helptitle.mjs'), 'utf8');
ok('smoke_v2131 的 README 守护表达式已去硬化（v21.7 惯例：不再以「二十七件套」断言件数，实件数由本版冒烟守护）',
  s2131.includes("includes('冒烟')") && s2131.includes("includes('件套')") && !s2131.includes("includes('二十七件套')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
