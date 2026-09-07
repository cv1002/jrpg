// v21.38 专项冒烟：README 快速上手表标题行补「←/→」选槽口径——v21.4 起标题页选槽三入口
// （数字键 1/2/3、←/→、A/D），标题页提示行（menus.drawTitle「按 1/2/3 或 ←/→ 选择存档槽」）与
// H 页存档槽行（HELP_PAGES「标题按 1/2/3 或 ←/→ 选择」）早已同口径，唯独 README 快速上手表标题行
// 仍写「标题 1/2/3 | 选择存档槽，L 读档，R 重开新档」——唯一未点名 ←/→ 的操作清单。
// 本版 README 标题行补「←/→ 与数字键同效循环切换，A/D 亦可」，纯文档收尾（承 v21.29-32 E 键口径同族）。
// 本冒烟守护：版本锚点、README 逐词同步（←/→ + A/D + 旧口径清零 + 三十四件套 + v21.38 守护描述）、
// main.js 标题分派源级落位（ArrowRight/ArrowLeft + a/d/A/D）、drawTitle 提示行与 H 页行同口径、
// 运行期 ArrowRight/ArrowLeft/A/D 选槽分派实证 + 数字键 1/2/3 与 L/R 零回归、package.json 收录。
import { S } from '../js/state.js';
import { GAME_VERSION, SAVE_SLOTS } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.30-v21.37 冒烟先例：先装桩再 import main.js；ctx 记录所有 fillText）——
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
const { drawTitle } = await import('../js/view/index.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.38 README 标题行 ←/→ 选槽口径 冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.37）——
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.37', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 38)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.38 注释（README ←/→ 口径说明）', dSrc.includes('v21.38'));

// —— README 快速上手表标题行逐词同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const titleRow = readme.split('\n').find((l) => l.includes('| 标题 `1/2/3` |'));
ok('README 标题行存在', !!titleRow);
ok('README 标题行已补「←/→」（与标题页提示行/H 页同口径）', !!titleRow && titleRow.includes('←/→'));
ok('README 标题行标注「与数字键同效」', !!titleRow && titleRow.includes('与数字键同效'));
ok('README 标题行标注 A/D 亦可', !!titleRow && titleRow.replace(/`/g, '').includes('A/D 亦可'));
ok('README 标题行旧口径「选择存档槽，`L` 读档」零残留（v21.4 漏网清单收口）',
  !!titleRow && !titleRow.includes('选择存档槽，`L` 读档') && !titleRow.includes('选择存档槽，`L` 读档，`R` 重开新档'));
ok('README 标题行 L 读档/R 重开新档（两按确认）逐字保留', !!titleRow && titleRow.includes('`L` 读档') && titleRow.includes('连按两次 R 确认执行') && titleRow.includes('误按一次不会丢档'));
ok('README tests 树收录 smoke_v2138_titleslotkey', readme.includes('smoke_v2138_titleslotkey'));
ok('README 件套口径为三十四件套（三十三件套清除）', readme.includes('三十四件套') && readme.includes('三十三件套清除'));
ok('README 含 v21.38 守护描述（←/→ 选槽口径同步）', readme.includes('v21.38'));

// —— main.js 标题分派源级落位（与运行期分派同源）——
const mSrc = fs.readFileSync(path.join(ROOT, 'js/main.js'), 'utf8');
ok('main.js 标题行 ArrowRight/d/D 分派落位', mSrc.includes("e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D'"));
ok('main.js 标题行 ArrowLeft/a/A 分派落位', mSrc.includes("e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A'"));
ok('main.js 标题行数字键 1..SAVE_SLOTS 分派零回归', mSrc.includes("Number(e.key) <= SAVE_SLOTS"));

// —— 标题页提示行 / H 页存档槽行 同口径（单一真源核对，非本版改动、零回归）——
const menusSrc = fs.readFileSync(path.join(ROOT, 'js/view/menus.js'), 'utf8');
ok('menus.drawTitle 提示行含「按 1/2/3 或 ←/→ 选择存档槽」', menusSrc.includes('或 ←/→ 选择存档槽'));
ok('data.js H 页存档槽行含「或 ←/→ 选择」', dSrc.includes('或 ←/→ 选择'));

// —— 运行期分派实证（DOM 桩 + main.js 真实导入）——
S.curSaveSlot = 1;
screens.title.onKey({ key: 'ArrowRight' });
ok('ArrowRight：槽 1→2', S.curSaveSlot === 2, S.curSaveSlot);
screens.title.onKey({ key: 'ArrowRight' });
screens.title.onKey({ key: 'ArrowRight' });
ok('ArrowRight：三连跳 2→3→1（循环）', S.curSaveSlot === 1, S.curSaveSlot);
screens.title.onKey({ key: 'ArrowLeft' });
ok('ArrowLeft：槽 1→3（反向循环）', S.curSaveSlot === 3, S.curSaveSlot);
screens.title.onKey({ key: 'ArrowLeft' });
screens.title.onKey({ key: 'ArrowLeft' });
ok('ArrowLeft：3→2→1 连跳', S.curSaveSlot === 1, S.curSaveSlot);
S.curSaveSlot = 1;
screens.title.onKey({ key: 'd' });
ok('小写 d 与 ArrowRight 同效（1→2）', S.curSaveSlot === 2, S.curSaveSlot);
screens.title.onKey({ key: 'D' });
ok('大写 D 同效（2→3）', S.curSaveSlot === 3, S.curSaveSlot);
screens.title.onKey({ key: 'a' });
ok('小写 a 与 ArrowLeft 同效（3→2）', S.curSaveSlot === 2, S.curSaveSlot);
screens.title.onKey({ key: 'A' });
ok('大写 A 同效（2→1）', S.curSaveSlot === 1, S.curSaveSlot);
ok('数字键 1/2/3 直选零回归', (() => { screens.title.onKey({ key: '2' }); const a = S.curSaveSlot === 2; screens.title.onKey({ key: '3' }); const b = S.curSaveSlot === 3; screens.title.onKey({ key: '1' }); return a && b && S.curSaveSlot === 1; })());
ok('SAVE_SLOTS 常量与分派同源（3 槽）', SAVE_SLOTS === 3);
// L 读空槽静默反馈与 R 两按确认零回归（v21.33/v21.16 既有行为，仅确认键影响选槽分派）
screens.title.onKey({ key: 'L' });
ok('L 读空槽：场景停留 title 且提示已给出（v21.33 零回归）', S.scene === 'title' && (els['msg'] ? els['msg'].textContent.includes('还没有存档') : true));
screens.title.onKey({ key: 'r' });
ok('R 首按仅武装不执行（v21.16 零回归）', (S.titleResetArm || 0) > 0 && S.scene === 'title');
S.titleResetArm = 0;
// —— drawTitle 渲染实证：提示行包含「或 ←/→」——
drawn.length = 0;
let threw = false;
try { drawTitle(); } catch (e) { threw = true; ok('drawTitle 渲染无异常', false, 'THREW: ' + e.message); }
ok('drawTitle 渲染无异常', !threw);
ok('drawTitle 提示行渲染「按 1/2/3 或 ←/→ 选择存档槽」', drawn.some((t) => t.includes('或 ←/→ 选择存档槽')), drawn.filter((t) => t.includes('存档槽')).join('|'));
ok('drawTitle 提示行「L 读档 · R 重开新档(连按两次)」零回归', drawn.some((t) => t.includes('L 读档') && t.includes('R 重开新档')));

// —— package.json 收录 ——
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('package.json 已收录 smoke_v2138_titleslotkey（npm test 串跑第 34 份）', pkg.includes('smoke_v2138_titleslotkey.mjs'));
const s2137 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2137_seencount.mjs'), 'utf8');
ok('smoke_v2137 的 README 件套口径断言已去硬化（v21.7 惯例：不再以「三十三件套/三十二件套清除」写字面件数，实件数由本版冒烟守护）',
  s2137.includes("includes('冒烟')") && s2137.includes("includes('件套')") && !s2137.includes("includes('三十三件套')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
