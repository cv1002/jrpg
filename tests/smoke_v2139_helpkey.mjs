// v21.39 专项冒烟：帮助页翻页入口 A/D 口径——drawHelp 页脚「← → 翻页」与 README H 行「←→ 翻页」
// 都未点名 main.js help.onKey 实际接受的 A/D 别名（ArrowRight/ArrowLeft 与 d/D/a/A 双入口，与标题页
// 选槽 v21.4 A/D 别名同族、v21.38 README 标题行「A/D 亦可」同款口径）；本版页脚改
// 「←/→ 翻页(A/D亦可)」、README H 行改「←/→ 翻页，A/D 亦可」，纯文字、零逻辑零结算。
// 本冒烟守护：版本锚点、menus.js 页脚源级新口径 + 旧页脚表达式零残留、README H 行逐词同步
// （←/→ + A/D 亦可 + 旧行清零 + 三十五件套/三十四件套清除 + v21.39 守护描述）、main.js 翻页分派
// 源级落位（ArrowRight/ArrowLeft + d/D/a/A）、运行期 ArrowRight/ArrowLeft/d/a 翻页分派实证、
// drawHelp 页脚渲染实证、package.json 收录、smoke_v2138 件套断言去硬化确认。
import { S } from '../js/state.js';
import { GAME_VERSION, HELP_PAGES } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.30-v21.38 冒烟先例：先装桩再 import main.js；ctx 记录所有 fillText）——
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
const { screens } = await import('../js/main.js');
const { drawHelp } = await import('../js/view/index.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.39 帮助页翻页入口 A/D 口径 冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.38）——
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.38', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 39)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.39 注释（帮助页翻页 A/D 口径说明）', dSrc.includes('v21.39'));

// —— menus.js 页脚源级：新口径落位 + 旧页脚表达式零残留 ——
const mSrc = fs.readFileSync(path.join(ROOT, 'js/view/menus.js'), 'utf8');
ok('menus.js 含 v21.39 注释（页脚 A/D 口径说明）', mSrc.includes('v21.39'));
ok('drawHelp 页脚已含「←/→ 翻页(A/D亦可)」', mSrc.includes('←/→ 翻页(A/D亦可)'));
ok('drawHelp 页脚旧表达式「← → 翻页   ·   H/Esc 关闭」零残留（页脚文字本身）',
  !mSrc.includes('← → 翻页   ·   H/Esc 关闭'));

// —— README 快速上手表 H 行逐词同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const hRow = readme.split('\n').find((l) => l.includes('| `H` |'));
ok('README H 行存在', !!hRow);
ok('README H 行已补「←/→」翻页口径', !!hRow && hRow.includes('←/→'));
ok('README H 行标注「A/D 亦可」', !!hRow && hRow.replace(/`/g, '').includes('A/D 亦可'));
ok('README H 行旧口径「（`←→` 翻页，含地图指南）」零残留',
  !!hRow && !hRow.includes('`←→` 翻页') && !hRow.includes('←→` 翻页'));
ok('README H 行「含地图指南」保留', !!hRow && hRow.includes('含地图指南'));
ok('README tests 树收录 smoke_v2139_helpkey', readme.includes('smoke_v2139_helpkey'));
ok('README 件套口径存在性（v21.7 去硬化惯例：不再以「三十五件套/三十四件套清除」断言精确件数，实件数由 v21.40 冒烟守护「三十六件套」）',
  readme.includes('冒烟') && readme.includes('件套'));
ok('README 含 v21.39 守护描述（帮助页翻页 A/D 口径同步）', readme.includes('v21.39'));

// —— main.js 翻页分派源级落位（与运行期分派同源、零回归）——
const mainSrc = fs.readFileSync(path.join(ROOT, 'js/main.js'), 'utf8');
ok('main.js help 行 ArrowRight/d/D 分派落位',
  mainSrc.includes("e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D'"));
ok('main.js help 行 ArrowLeft/a/A 分派落位',
  mainSrc.includes("e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A'"));

// —— 运行期分派实证（DOM 桩 + main.js 真实导入）——
const NPAGES = HELP_PAGES.length; // 4
S.helpPage = 0;
screens.help.onKey({ key: 'ArrowRight' });
ok('ArrowRight：页 1→2', S.helpPage === 1, S.helpPage);
screens.help.onKey({ key: 'ArrowRight' });
screens.help.onKey({ key: 'ArrowRight' });
screens.help.onKey({ key: 'ArrowRight' });
ok(`ArrowRight：连翻回第 1 页（循环 ${NPAGES} 页）`, S.helpPage === 0, S.helpPage);
screens.help.onKey({ key: 'ArrowLeft' });
ok('ArrowLeft：页 1→末页（反向循环）', S.helpPage === NPAGES - 1, S.helpPage);
screens.help.onKey({ key: 'ArrowLeft' });
screens.help.onKey({ key: 'ArrowLeft' });
ok('ArrowLeft：末页→页 2 连跳', S.helpPage === 1, S.helpPage);
const before = S.helpPage;
screens.help.onKey({ key: 'd' });
ok('小写 d 与 ArrowRight 同效（页 +1）', S.helpPage === before + 1, S.helpPage);
screens.help.onKey({ key: 'D' });
ok('大写 D 同效（页 +1）', S.helpPage === before + 2, S.helpPage);
screens.help.onKey({ key: 'a' });
ok('小写 a 与 ArrowLeft 同效（页 -1）', S.helpPage === before + 1, S.helpPage);
screens.help.onKey({ key: 'A' });
ok('大写 A 同效（页 -1）', S.helpPage === before, S.helpPage);
// 保持 v21.31 页数循环语义（越界不崩）：回第 1 页后 ArrowLeft 仍环绕
S.helpPage = 0;
screens.help.onKey({ key: 'ArrowLeft' });
ok('ArrowLeft 从第 1 页环绕到末页（零回归）', S.helpPage === NPAGES - 1, S.helpPage);
// H/Esc 关闭零回归
S.scene = 'help';
screens.help.onKey({ key: 'Escape' });
ok('Esc 关闭帮助页回 world（零回归）', S.scene === 'world', S.scene);
S.scene = 'help';
screens.help.onKey({ key: 'h' });
ok('小写 h 关闭帮助页回 world（零回归）', S.scene === 'world', S.scene);

// —— drawHelp 页脚渲染实证：四页逐页绘新页脚 ——
try {
  for (let p = 0; p < NPAGES; p++) {
    S.helpPage = p;
    drawn.length = 0;
    drawHelp();
    ok(`第 ${p + 1}/${NPAGES} 页页脚渲染「←/→ 翻页(A/D亦可)」`,
      drawn.some((t) => t.includes(`第 ${p + 1}/${NPAGES} 页`) && t.includes('←/→ 翻页(A/D亦可)')),
      drawn.filter((t) => t.includes('翻页')).join(' | '));
  }
} finally {
  S.helpPage = 0;
}

// —— package.json 收录 ——
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('package.json 已收录 smoke_v2139_helpkey（npm test 串跑第 35 份）', pkg.includes('smoke_v2139_helpkey.mjs'));
const s2138 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2138_titleslotkey.mjs'), 'utf8');
ok('smoke_v2138 的 README 件套口径断言已去硬化（v21.7 惯例：改用存活性口径 readme.includes(冒烟/件套)，不再以「三十四件套/三十三件套清除」断言件数，实件数由本版冒烟守护）',
  s2138.includes("readme.includes('冒烟')") && s2138.includes("readme.includes('件套')") && !s2138.includes("readme.includes('三十四件套')") && !s2138.includes("readme.includes('三十三件套')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
