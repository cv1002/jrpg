// v21.33 专项冒烟：标题页 L 读空槽静默反馈——标题页按键（1-3 选槽 / ←→ / Enter / L / R）里唯一「按下
// 毫无反应」的静默键：`(e.key==='l'||'L') && load()` 在 load() 返回 false（该槽无存档/读取失败）时
// 整个条件落空，玩家按 L 什么都没发生。本版补 else-if 分支一句 EVENT_MSG_MS 短提示（「💤 槽 N 还没有
// 存档，按 Enter 开始新的冒险吧。」），load() 判定与读取路径逐字不动（有档仍走 v19.86 读档摘要分支）。
// 本冒烟守护：版本锚点、源级落位（else-if 分支 + 提示文案 + EVENT_MSG_MS 同源）、运行期实证（空槽 L →
// 提示且停留 title；有档 L → 读取槽摘要且 scene=world）、R 两按确认零回归、既有读档分支逐字保留、
// README/package.json 同步 + smoke_v2132 README 守护去硬化（v21.7 惯例）。
import { S, curMap } from '../js/state.js';
import { GAME_VERSION } from '../js/data.js';
import { newGame, saveGame } from '../js/core.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30/v21.31/v21.32 冒烟先例：先装桩再 import main.js；#msg 记录 textContent）——
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
const { screens } = await import('../js/main.js');
const { goto } = await import('../js/scene.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.33 标题页 L 读空槽静默反馈 冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.32 + 逐字等于 v21.33 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.32', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 33)));
ok("data.js GAME_VERSION 为 'v21.33'", GAME_VERSION === 'v21.33', GAME_VERSION);

// —— 源级落位：main.js 标题页 L 补空槽 else-if 分支（提示文案 + EVENT_MSG_MS 同源 + v21.33 注释）——
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mSrc = fs.readFileSync(path.join(ROOT, 'js/main.js'), 'utf8');
ok('main.js 含 v21.33 注释（L 空槽反馈说明）', mSrc.includes('v21.33'));
ok('main.js 标题页含空槽 L 分支（else-if (e.key === \'l\' || \'L\')）',
  mSrc.includes("} else if (e.key === 'l' || e.key === 'L') {"));
ok('空槽提示文案已落位（💤 槽 N 还没有存档…按 Enter 开始新的冒险）',
  mSrc.includes('还没有存档，按 Enter 开始新的冒险吧'));
ok('空槽提示与 EVENT_MSG_MS 同源（与标题页 R 确认提示同族时长口径）',
  mSrc.includes('还没有存档，按 Enter 开始新的冒险吧。`, EVENT_MSG_MS)'));
ok('既有读取分支逐字保留（v19.86 读档摘要 + `&& load()` 判定未动）',
  mSrc.includes("else if ((e.key === 'l' || e.key === 'L') && load()) {") &&
  mSrc.includes('读取槽 ${S.curSaveSlot}'));
ok('R 两按确认分支逐字保留（v21.16 状态机零回归）',
  mSrc.includes('再按一次 R 确认重开新档（当前冒险进度将丢弃）'));
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.33 注释', dSrc.includes('v21.33'));

// —— 运行期实证（DOM 桩 + 真实 main.js 模块链）：空槽按 L → 出提示且停留 title；有档按 L → 读档摘要 + world ——
// 注意：main.js 导入即走启动引导（loadMap('village') + initGame(DEFAULT_NAME) + goto('title') + drawTitle()），
// S.G 恒有档前预览对象；且 boxMsg 有消息队列（msgOn 期间新消息排队）——每次触发 boxMsg 后等 EVENT_MSG_MS
// 过窗（1600ms + 余量）让队列清空，再用消息文本断言（真实时序，非桩内直写）。
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const msgEl = document.getElementById('msg');
S.scene = 'title';
S.curSaveSlot = 1;
const gBefore = S.G;
msgEl.textContent = '';
await screens.title.onKey({ key: 'L' });
ok('空槽按 L：提示「💤 槽 1 还没有存档…」（此前静默无反馈）',
  msgEl.textContent.includes('还没有存档') && msgEl.textContent.includes('槽 1'),
  msgEl.textContent);
ok('空槽按 L：仍在标题页（load() 未误读，S.scene 不变）', S.scene === 'title', S.scene);
ok('空槽按 L：S.G 未被 load() 替换（同一对象、无档不误读）', S.G === gBefore);
await sleep(1700); // 空槽提示过窗，清空消息队列

// 有档路径（newGame + saveGame 走真实存档管线，槽 1 已有档）
S.G = newGame('测试');
saveGame();
S.scene = 'title';
msgEl.textContent = '';
await screens.title.onKey({ key: 'L' });
ok('有档按 L：走既有读取分支（💾 读取槽 1：… 摘要）',
  msgEl.textContent.includes('读取槽 1') && msgEl.textContent.includes('Lv.1'),
  msgEl.textContent);
ok('有档按 L：进入世界（load() 成功路径零回归）', S.scene === 'world' && curMap() === 'village', S.scene + '/' + curMap());
await sleep(1700); // 读档摘要过窗，清空消息队列

// 空槽音效/状态机零回归：R 两按确认在空槽下仍走武装分支（不因新分支受影响）
S.scene = 'title';
S.titleResetArm = 0;
msgEl.textContent = '';
await screens.title.onKey({ key: 'R' });
ok('R 两按确认零回归：首按仍仅武装+提示，不误触 resetRun',
  S.titleResetArm > 0 && msgEl.textContent.includes('再按一次 R 确认重开新档'),
  'arm=' + S.titleResetArm + ' msg=' + msgEl.textContent);

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README 已同步（tests 树收录 smoke_v2133_loadempty + 冒烟二十九件套口径、二十八件套清除）',
  readme.includes('smoke_v2133_loadempty') && readme.includes('二十九件套') && !readme.includes('二十八件套'));
ok('README 含 v21.33 守护描述（标题页 L 空槽反馈）', readme.includes('v21.33'));
ok('package.json 已收录 smoke_v2133_loadempty（npm test 串跑第 29 份）',
  pkg.includes('smoke_v2133_loadempty.mjs'));
const s2132 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2132_facesign.mjs'), 'utf8');
ok('smoke_v2132 的 README 守护表达式已去硬化（v21.7 惯例：不再以「二十八件套」断言件数，实件数由本版冒烟守护）',
  s2132.includes("includes('冒烟')") && s2132.includes("includes('件套')") && !s2132.includes("includes('二十八件套')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
