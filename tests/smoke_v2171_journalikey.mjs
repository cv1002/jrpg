// v21.71 专项冒烟：任务日志页脚补「I 状态页」互切提示（可发现性·口径一致，承 v21.4 帮助页
// A/D 别名 / v21.18「按键提示必须如实反映可用键」主线）——main.js journal.onKey 自早前版本
// 起就支持 `I` 直达状态页（与 status.onKey 的 `J` 直达日志互为双向互切），状态页页底也早已
// 常驻「J 任务日志」提示（menus.js drawStatus 末行），唯独日志页两处页脚（空日志/有日志）
// 只写「按 J / Esc 关闭」，玩家翻日志时无从知晓按 I 可直切状态页对号属性。
// 本冒烟守护：版本锚点、menus.js 两处页脚源级落位与旧裸文案零残留、main.js 双向互切分派
// 源级落位、运行期实证（有日志档页脚三要素 / 空日志档（hero=null 防御分支）页脚逐字 /
// 页脚行宽 estW ≤500 面板预算 / I→status 与 J→journal 双向跳转与 J/Esc 关闭零回归 /
// drawStatus 页底「J 任务日志」零回归）、README/package.json 同步、smoke_v2170 件套断言去硬化确认。
import { S } from '../js/state.js';
import { GAME_VERSION } from '../js/data.js';
import { drawJournal, drawStatus } from '../js/view/index.js';
import { CTX } from '../js/view/canvas.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v21.70 冒烟先例：先装桩再 import main.js）——
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
const { screens } = await import('../js/main.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

// —— 官方 estW（v21.11/v21.14 冒烟标定口径，与 @napi-rs/canvas 真值标定一致）——
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
    else if (code >= 0x30 && code <= 0x39) wsum += 0.63 * size;
    else if (code === 0x20) wsum += 0.263 * size;
    else wsum += 0.55 * size;
  }
  return wsum;
};

console.log('— v21.71 任务日志页脚 I 状态页互切提示 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.70）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.70', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 71)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.71 注释（任务日志页脚 I 状态页互切提示说明）', dSrc.includes('v21.71 体验打磨：任务日志页脚补「I 状态页」互切提示'));

// —— menus.js 源级：两处页脚同式落位 + 旧裸文案零残留 + 既有口径保留 ——
const mSrc = fs.readFileSync(path.join(ROOT, 'js/view/menus.js'), 'utf8');
ok('menus.js 含 v21.71 注释（页脚 I 状态页互切提示）', mSrc.includes('v21.71 页脚补「I 状态页」互切提示'));
ok('menus.js 空日志分支页脚新文案落位（按 J / Esc 关闭   ·   I 状态页）',
  mSrc.includes("text('按 J / Esc 关闭   ·   I 状态页', 320, 432, '12px', '#7d93a3', 'center');"));
ok('menus.js 有日志分支页脚新文案落位（模板尾部追加 I 状态页）',
  mSrc.includes("` : ''}   ·   I 状态页`, 320, 432, '12px', '#7d93a3', 'center');"));
ok('menus.js 空日志分支旧裸文案「按 J / Esc 关闭」（无 I 提示）源级零残留',
  !mSrc.includes("text('按 J / Esc 关闭', 320, 432"));
ok('menus.js 「按 J / Esc 关闭」与「↑↓ 滚动浏览（还有 N 条）」口径逐字保留（零回归）',
  mSrc.includes('按 J / Esc 关闭') && mSrc.includes('↑↓ 滚动浏览（还有'));

// —— main.js 源级：journal↔status 双向互切分派落位 ——
const mainSrc = fs.readFileSync(path.join(ROOT, 'js/main.js'), 'utf8');
ok('main.js journal.onKey 含 I→status 分派', mainSrc.includes("else if (e.key === 'i' || e.key === 'I') goto('status');"));
ok('main.js status.onKey 含 J→journal 分派', mainSrc.includes("else if (e.key === 'j' || e.key === 'J') goto('journal');"));

// —— 运行期实证：drawJournal 两分支页脚 + 双向互切 + drawStatus 零回归 ——
const origScene = S.scene;
const origScroll = S.journalScroll;
const origHero = S.G;
let drawnCalls = [];
const origFill = CTX.fillText.bind(CTX);
CTX.fillText = (t, x, y) => { drawnCalls.push({ t: String(t), x, y }); };
try {
  ok('启动引导后 S.G 已建档（新档真实状态）', !!origHero && origHero.level >= 1, origHero && origHero.level);
  // 1) 有日志档：页脚三要素齐备（关闭口径 + 滚动口径 + 新 I 提示）
  S.journalScroll = 0;
  drawnCalls.length = 0;
  drawJournal();
  const footer1 = drawnCalls.find((c) => c.t.includes('按 J / Esc 关闭'));
  ok('有日志档页脚含「按 J / Esc 关闭」+「↑↓ 滚动浏览（还有 N 条）」+「I 状态页」三要素',
    !!footer1 && footer1.t.includes('↑↓ 滚动浏览（还有') && footer1.t.includes('I 状态页'), footer1 && footer1.t);
  ok('有日志档页脚逐字为「按 J / Esc 关闭   ·   ↑↓ 滚动浏览（还有 N 条）   ·   I 状态页」且落位 (320,432)',
    !!footer1 && /^按 J \/ Esc 关闭   ·   ↑↓ 滚动浏览（还有 \d+ 条）   ·   I 状态页$/.test(footer1.t) && footer1.x === 320 && footer1.y === 432, footer1 && footer1.t);
  ok('有日志档页脚行宽 estW ≤500 面板预算（12px，面板内宽 70..570）',
    !!footer1 && estW(footer1.t, 12) <= 500, footer1 && estW(footer1.t, 12));
  // 2) 空日志档（hero=null 防御分支，drawWorld 对 null hero 早退）：页脚同式逐字
  S.G = null;
  drawnCalls.length = 0;
  drawJournal();
  const footer0 = drawnCalls.find((c) => c.t.includes('按 J / Esc 关闭'));
  ok('空日志档「没有进行中的任务。」零回归', drawnCalls.some((c) => c.t.includes('没有进行中的任务。')));
  ok('空日志档页脚逐字「按 J / Esc 关闭   ·   I 状态页」且落位 (320,432)',
    !!footer0 && footer0.t === '按 J / Esc 关闭   ·   I 状态页' && footer0.x === 320 && footer0.y === 432, footer0 && footer0.t);
  ok('空日志档页脚行宽 estW ≤500 面板预算', !!footer0 && estW(footer0.t, 12) <= 500, footer0 && estW(footer0.t, 12));
  S.G = origHero;
  // 3) 双向互切运行期分派：journal.onKey('i') → status；status.onKey('j') → journal
  S.scene = 'journal';
  screens.journal.onKey({ key: 'i' });
  ok("journal.onKey('i') → 状态页（I 互切实证）", S.scene === 'status', S.scene);
  screens.status.onKey({ key: 'j' });
  ok("status.onKey('j') → 任务日志（J 互切实证）", S.scene === 'journal', S.scene);
  // 4) 关闭零回归：J / Esc 仍回 world
  screens.journal.onKey({ key: 'j' });
  ok("journal.onKey('j') → 关闭回 world（J 关闭零回归）", S.scene === 'world', S.scene);
  S.scene = 'journal';
  screens.journal.onKey({ key: 'Escape' });
  ok("journal.onKey('Escape') → 关闭回 world（Esc 关闭零回归）", S.scene === 'world', S.scene);
  // 5) drawStatus 页底「J 任务日志」提示零回归（互切对侧不受扰）
  drawnCalls.length = 0;
  let threw = null;
  try { drawStatus(); } catch (e) { threw = e; }
  ok('drawStatus 渲染不抛错', threw === null, threw && String(threw.stack || threw));
  ok('drawStatus 页底「J 任务日志」提示零回归', drawnCalls.some((c) => c.t.includes('J 任务日志')));
} finally {
  CTX.fillText = origFill;
  S.scene = origScene;
  S.journalScroll = origScroll;
  S.G = origHero;
}

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2171_journalikey', readme.includes('smoke_v2171_journalikey'));
// v21.72 去硬化（v21.7 惯例）：件套精确计数移交当版冒烟守护，本件改存活性口径——
// 仍含「冒烟/件套」且旧口径「（六十六件套清除）」已清除。
ok('README 件套口径为存活性断言（v21.72 起件数由新版冒烟守护：六十八件套（六十七件套清除））',
  readme.includes('冒烟') && readme.includes('件套') &&
  !readme.includes('（六十六件套清除）'));
ok('README 含 v21.71 守护描述（任务日志页脚 I 状态页互切提示守护）',
  readme.includes('v21.71 起含任务日志页脚「I 状态页」互切提示守护'));
ok('README 快速上手表 J 行含「I 状态页」互切口吻', readme.includes('`J`') && readme.includes('「I 状态页」'));
ok('README 快速上手表 I 行含「J 任务日志」互切口吻', readme.includes('状态界面（页底常驻「J 任务日志」直达提示'));
ok('package.json 已收录 smoke_v2171_journalikey（npm test 串跑第 67 份）',
  pkg.includes('smoke_v2171_journalikey.mjs'));
const s2170 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2170_winreset.mjs'), 'utf8');
ok('smoke_v2170 的 README 件套口径断言已去硬化（存活性口径落位，旧精确表达式零残留）',
  s2170.includes("!readme.includes('（六十五件套清除）')") &&
  !s2170.includes("readme.includes('六十六件套（六十五件套清除）')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
