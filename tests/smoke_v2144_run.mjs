// v21.44 专项冒烟：按住 Shift 奔跑——world.js 新增 RUN_MS=115（约 1.57×，与 WALK_MS=180 同文件一族），
// move() 的 `dur` 改由 runHeld 派生（`dur: runHeld ? RUN_MS : WALK_MS`），main.js keydown/keyup/blur 三处
// setRun 分派（Shift 是修饰键、KEY 无映射、早退不落入任何 scene.onKey）；READMe/H 页/教程行同步口径。
// 本冒烟守护：版本锚点、data.js/world.js/main.js 源级落位 + 旧单 dur 表达式零残留、KEY 无 Shift 映射、
// 运行期实证（世界场景 setRun(true)→move 的 S.walk.dur===RUN_MS、setRun(false)→回落 WALK_MS、四向一致、
// walking() 消费 dur 零回归、危险格遇敌槽递增不因奔跑跳过）、H 页行宽 ≤470 预算、README/package 同步、
// smoke_v2143 件套断言去硬化确认（v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION, KEY, HELP_PAGES, ENCOUNTER } from '../js/data.js';
import { move, loadMap, setRun, RUN_MS, WALK_MS, walking } from '../js/world.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v21.43 冒烟先例：先装桩再 import main.js）——
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

console.log('— v21.44 按住 Shift 奔跑 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.43）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.43', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 44)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.44 注释（按住 Shift 奔跑）', dSrc.includes('v21.44 新增：按住 Shift 奔跑'));

// —— world.js 源级：RUN_MS/setRun/新 dur 表达式落位 + 旧表达式零残留 ——
const wSrc = fs.readFileSync(path.join(ROOT, 'js/world.js'), 'utf8');
ok('world.js 含 RUN_MS 常量（=115，与 WALK_MS 同文件一族）', wSrc.includes('const RUN_MS = 115;'));
ok('world.js 含 runHeld 状态与 setRun 导出', wSrc.includes('let runHeld = false;') && wSrc.includes('export function setRun(on) { runHeld = !!on; }'));
ok('world.js move 的 dur 由 runHeld 派生（全文件唯一）',
  (wSrc.match(/dur: runHeld \? RUN_MS : WALK_MS/g) || []).length === 1);
ok('world.js 旧 `dur: WALK_MS` 表达式源级零残留', !wSrc.includes('dur: WALK_MS'));
ok('world.js export 块已导出 RUN_MS', wSrc.includes('WALK_MS, RUN_MS, portalDest'));
ok('数据断言：RUN_MS(115) < WALK_MS(180) 且均为正数', RUN_MS === 115 && WALK_MS === 180 && RUN_MS < WALK_MS);

// —— main.js 源级：keydown/keyup/blur 三处 Shift 分派 + import + 教程行 ——
const mSrc = fs.readFileSync(path.join(ROOT, 'js/main.js'), 'utf8');
ok('main.js 已 import setRun', mSrc.includes("import { interact, move, loadMap, holdStep, setHeldDir, setRun } from './world.js';"));
ok('main.js keydown 落位（Shift → setRun(true)，全文件唯一）',
  (mSrc.match(/if \(e\.key === 'Shift'\) \{ setRun\(true\); return; \}/g) || []).length === 1);
ok('main.js keyup 落位（Shift → setRun(false)，先于 KEY 检查）',
  (mSrc.match(/if \(e\.key === 'Shift'\) \{ setRun\(false\); return; \}/g) || []).length === 1);
ok('main.js 失焦兜底（blur → setRun(false)）', mSrc.includes("window.addEventListener('blur', () => setRun(false));"));
ok('main.js 教程行已同步 Shift 奔跑口径', mSrc.includes('WASD移动/Shift奔跑'));
ok("KEY 无 Shift 映射（修饰键不进移动/交互表）", !KEY['Shift'] && !KEY['shift']);

// —— 运行期实证：世界场景 move 的 dur 随 setRun 切换（四向一致）——
const origScene = S.scene;
const origHero = { x: S.G && S.G.x, y: S.G && S.G.y, map: S.G && S.G.map };
const origWalk = S.walk;
const origGauge = S.encGauge;
try {
  ok('main.js 启动引导后 S.G 已建档（新档真实状态）', !!S.G && S.G.level >= 1, S.G && S.G.level);
  ok('启动引导后场景为 title（loadMap(village) 已就绪）', S.scene === 'title', S.scene);
  S.scene = 'world';
  // 基点 (14,15)：右邻 (15,15) 为 'G' 危险格（遇敌槽证据用），四邻均可行走（. / 0）
  function place(x, y) { S.G.x = x; S.G.y = y; S.walk = null; }
  ok('前置：runHeld 默认 false → 首步 dur 为 WALK_MS（零回归）', (() => {
    place(10, 15);
    move(0, 1);
    return S.walk && S.walk.dur === WALK_MS;
  })(), S.walk && S.walk.dur);
  // 跑：setRun(true) 后四向 dur 均为 RUN_MS
  setRun(true);
  const dirs = [ [0, -1], [0, 1], [-1, 0], [1, 0] ];
  let allRun = true;
  for (const [dx, dy] of dirs) {
    place(10, 15);
    move(dx, dy);
    if (!S.walk || S.walk.dur !== RUN_MS) { allRun = false; console.log('    <- 向', dx, dy, 'dur=', S.walk && S.walk.dur); }
    // 走回去：复原原地（避免下一步起点漂移）
    S.G.x = 10; S.G.y = 15; S.walk = null;
  }
  ok('setRun(true) 后 上/下/左/右 四向 move 的 S.walk.dur 均为 RUN_MS', allRun);
  // walking() 消费 dur 零回归：跑步态下立即 walking() 为 true（且按 RUN_MS 时长计算）
  place(10, 15);
  move(0, -1);
  ok('奔跑态 walking() 立即返回 true（dur 由 RUN_MS 消费，插值通道零回归）',
    walking() && S.walk.dur === RUN_MS && Date.now() - S.walk.t0 < RUN_MS);
  // 停下：setRun(false) 回落 WALK_MS
  setRun(false);
  place(10, 15);
  move(0, 1);
  ok('setRun(false) 后 move 的 S.walk.dur 回落 WALK_MS', S.walk && S.walk.dur === WALK_MS);
  // 危险格遇敌槽不因奔跑跳过：跑着踩 (15,15) 'G' 仍按 dangerAt 结算
  setRun(true);
  S.encGauge = 0;
  place(14, 15);
  move(1, 0);
  ok('奔跑踩入危险格 (15,15) 后遇敌槽仍递增（加速只快「走」不跳「结算」）',
    S.encGauge >= ENCOUNTER.dangerMin && S.encGauge <= ENCOUNTER.dangerMin + ENCOUNTER.dangerVar,
    S.encGauge);
  // 非危险格：. 瓦片走遇敌槽的「道路降温」分支（encGauge 不为正增长）
  S.encGauge = 0;
  place(10, 15);
  move(0, -1); // (10,14) '.'
  ok('奔跑踩入路径格 (10,14) 走既有「降温」分支（encGauge 保持 0 非负）', S.encGauge === 0, S.encGauge);
  setRun(false);
} finally {
  S.scene = origScene;
  if (S.G) { S.G.x = origHero.x; S.G.y = origHero.y; }
  S.walk = origWalk;
  S.encGauge = origGauge;
}

// —— H 页「移动 / 传送门」行：Shift 口径 + 行宽预算（v21.11 estW 口径：CJK 0.865em，≤470）——
const estW = (s, size) => {
  let wsum = 0;
  for (const ch of String(s || '')) {
    const code = ch.codePointAt(0);
    const wide = (code >= 0x2e80 && code <= 0x9fff) || (code >= 0x3000 && code <= 0x303f) || (code >= 0xff00 && code <= 0xffef) || code >= 0x1f000;
    if (wide) wsum += 0.865 * size;
    else if (code === 0xb7) wsum += 0.303 * size;
    else if (code === 0xd7) wsum += 0.564 * size;
    else if (code === 0x25) wsum += 0.827 * size;
    else if (code === 0x2b) wsum += 0.543 * size;
    else if (code === 0x2d) wsum += 0.432 * size;
    else if (code === 0x2f) wsum += 0.338 * size;
    else if (code === 0x2e) wsum += 0.226 * size;
    else if (code === 0x2014) wsum += 0.812 * size;
    else if (code >= 0x30 && code <= 0x39) wsum += 0.63 * size;
    else if (code === 0x20) wsum += 0.263 * size;
    else wsum += 0.55 * size;
  }
  return wsum;
};
const moveRow = HELP_PAGES[0].find((r) => r[0] === '移动 / 传送门');
ok('H 页操作说明「移动 / 传送门」行已补 Shift 口径', !!moveRow && moveRow[1].includes('Shift') && moveRow[1].includes('奔跑'), moveRow && moveRow[1]);
ok('H 页操作说明页行数仍为 14（口径行内更新，不增行）', HELP_PAGES[0].length === 14, HELP_PAGES[0].length);
{
  const wMain = estW(moveRow[0] + '   ', 14) + estW(moveRow[1], 14);
  ok('「移动 / 传送门」行估算宽 ≤470（v21.11 面板预算）', wMain <= 470, `≈${wMain.toFixed(1)}`);
}

// —— README 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
ok('README tests 树收录 smoke_v2144_run', readme.includes('smoke_v2144_run'));
ok('README 件套口径为存在性断言（v21.45 起件数由本版冒烟守护：四十一件套（四十件套清除））',
  readme.includes('冒烟') && readme.includes('件套') &&
  !readme.includes('三十九件套（三十八件套清除）') &&
  !readme.includes('三十八件套'));
ok('README 含 v21.44 守护描述（按住 Shift 奔跑守护）', readme.includes('按住 Shift 奔跑守护'));
ok('README 快速上手表 W 行含 Shift 奔跑口径', readme.includes('`Shift` 奔跑'));

// —— package.json 收录 ——
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('package.json 已收录 smoke_v2144_run（npm test 串跑第 40 份）', pkg.includes('smoke_v2144_run.mjs'));

// —— smoke_v2143 的 README 件套口径断言已去硬化（v21.7 惯例）——
const s2143 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2143_talkekey.mjs'), 'utf8');
ok('smoke_v2143 的 README 件套口径断言已去硬化（v21.7 惯例：改用存活性口径，旧精确表达式「readme.includes(三十九件套) && readme.includes(三十八件套清除)」零残留，实件数由本版冒烟守护）',
  s2143.includes("!readme.includes('三十八件套')") &&
  !s2143.includes("readme.includes('三十九件套') && readme.includes('三十八件套清除')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
