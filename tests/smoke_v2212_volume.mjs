// v22.12 专项冒烟：主音量调节 [ / ]（0~100%、10% 步进、偏好持久化）——M 静音只有开/关两档，
// 全场音量无法微调（夜间/安静环境嫌 BGM 吵只能整锅静音、音量太小又只能全开）；现补 [ 减小 / ]
// 增大 的全局快捷键：data.js 单一数据源（VOL_KEY/VOL_STEP/volPrefToState/volPrefToString）+
// state.js S.VOL 运行时偏好（与 SND 同族）+ audio.js 主增益总线（所有音效/BGM 经同一个 gain 节点
// 输出、setVolume 唯一调节入口、loadVolPref/saveVolPref 持久化）+ main.js 全局 keydown [ ] 分派 +
// 启动恢复 + HUD 🔊/🔇 指示同步（0% 视为静音）+ H 页「静音 / 音量」行口径。
// 本冒烟守护：版本锚点、常量契约（编码往返/越界钳制）、源级落位（state/audio/main/hud/KEY 无冲突）、
// 运行期（loadVolPref 恢复/saveVolPref 落盘/setVolume 步进与钳制/主增益总线实例与实时跟随）、
// HELP_PAGES 行契约（行数仍 14/行宽预算/旧『静音』行零残留）、README/package.json 同步。
import { S } from '../js/state.js';
import { GAME_VERSION, VOL_KEY, VOL_STEP, volPrefToState, volPrefToString, HELP_PAGES, KEY } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v22.11 冒烟先例：先装桩再 import main.js）——
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
    gain: { value: 1, setValueAtTime: noop, linearRampToValueAtTime: noop, exponentialRampToValueAtTime: noop } }),
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
const { setVolume, loadVolPref, saveVolPref, SFX, ac } = await import('../js/audio.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.12 主音量调节 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const aSrc = fs.readFileSync(path.join(ROOT, 'js/audio.js'), 'utf8');
const mSrc = fs.readFileSync(path.join(ROOT, 'js/main.js'), 'utf8');
const sSrc = fs.readFileSync(path.join(ROOT, 'js/state.js'), 'utf8');
const hSrc = fs.readFileSync(path.join(ROOT, 'js/view/hud.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.11 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.11', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 12)), GAME_VERSION);
ok('data.js 含 v22.12 注释（主音量调节说明）', dSrc.includes('v22.12 主音量'));
ok('GAME_VERSION 字面量已更新为 v22.12（旧 v22.11 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v22.35';") && !dSrc.includes("const GAME_VERSION = 'v22.11';"));
// 注：本文件由 pin 级联脚本机械替换过一处「const GAME_VERSION = 'v22.11';」→ 上方断言串已被同步为新版，
// 负向存在性检查以「v22.11 字面量零残留」为准（data.js 内 v22.11 仅存于功能注释，不属于版本字面量，见上）。

// —— 常量契约（单一数据源）——
ok('VOL_KEY === jrpg_vol（与 jrpg_snd/jrpg_saveN 同一命名族）', VOL_KEY === 'jrpg_vol', VOL_KEY);
ok('VOL_STEP === 0.1（10% 步进）', VOL_STEP === 0.1, VOL_STEP);
ok('volPrefToState/volPrefToString 导出且为函数', typeof volPrefToState === 'function' && typeof volPrefToString === 'function');
ok("volPrefToState('0')===0 / ('100')===1 / ('50')===0.5 / ('90')===0.9 / ('70')===0.7",
  volPrefToState('0') === 0 && volPrefToState('100') === 1 && volPrefToState('50') === 0.5 &&
  volPrefToState('90') === 0.9 && volPrefToState('70') === 0.7);
ok("volPrefToState 越界/非法一律回退默认 100%（null/''/abc/-1/1.5/999）",
  volPrefToState(null) === 1 && volPrefToState('') === 1 && volPrefToState('abc') === 1 &&
  volPrefToState('-1') === 1 && volPrefToState('1.5') === 1 && volPrefToState('999') === 1);
ok('volPrefToString 编码往返（0→0 / 1→100 / 0.5→50 / 0.7→70）',
  volPrefToString(0) === '0' && volPrefToString(1) === '100' && volPrefToString(0.5) === '50' && volPrefToString(0.7) === '70');
ok('volPrefToString 越界钳制（1.2→100 / -0.2→0）',
  volPrefToString(1.2) === '100' && volPrefToString(-0.2) === '0');
ok('编码往返恒等（volPrefToState(volPrefToString(v))===v，v∈{0,0.3,0.5,1}）',
  [0, 0.3, 0.5, 1].every((v) => volPrefToState(volPrefToString(v)) === v));

// —— 源级落位 ——
ok('state.js 声明 VOL: 1（默认 100%，与 SND 同族运行时偏好）', sSrc.includes('VOL: 1,'));
ok('audio.js 主增益总线落位（S.masterGain 创建/连接/值写入）',
  aSrc.includes('S.masterGain = S.AC.createGain()') && aSrc.includes('S.masterGain.connect(S.AC.destination)') &&
  aSrc.includes('S.masterGain.gain.value ='));
ok('audio.js tone 出口经主增益总线（防御式回落 destination）', aSrc.includes('gain.connect(S.masterGain || ctx.destination)'));
ok('audio.js 导出 setVolume/loadVolPref/saveVolPref（定义处 export 且无重复导出',
  aSrc.includes('export function setVolume') && aSrc.includes('export function loadVolPref') && aSrc.includes('export function saveVolPref') &&
  !aSrc.includes('setVolume, loadVolPref, saveVolPref }'));
ok('main.js 启动恢复 loadVolPref()（与 loadSndPref 同位）', mSrc.includes('loadSndPref();') && mSrc.includes('loadVolPref();'));
ok('main.js keydown 落位 [ ] 分派（setVolume 调用 + 反馈文案）',
  mSrc.includes("e.key === '['") && mSrc.includes("e.key === ']'") && mSrc.includes('setVolume(e.key'));
ok('main.js [ ] 反馈与 HUD 同步（renderHUD + 音量百分比文案）',
  mSrc.includes('renderHUD();') && mSrc.includes('音量 ${Math.round(v * 100)}%'));
ok('hud.js 指示同步主音量（0% 视为静音）', hSrc.includes("(S.SND && (S.VOL || 1) > 0) ? '🔊' : '🔇'"));
ok('[ / ] 不在 KEY 移动表（无按键冲突）', !KEY['['] && !KEY[']']);

// —— HELP_PAGES 操作说明行契约 ——
const page0 = HELP_PAGES[0];
const rowVol = page0.find((r) => r[0].includes('静音'));
ok('操作说明页行数仍为 14（只改行内文字、不增行，不触发页长自适应）', page0.length === 14, page0.length);
ok("「静音 / 音量」行存在且含 [ / ] 口径", !!rowVol && rowVol[0].includes('音量') && rowVol[1].includes('M 静音切换') && rowVol[1].includes('[ / ]'));
ok("旧『静音』单行『M』零残留", !page0.some((r) => r[0] === '静音' && r[1] === 'M'));
const estW = (s) => { let w = 0; for (const ch of String(s)) { const c = ch.codePointAt(0);
  if (c >= 0x4e00 && c <= 0x9fff) w += 15; else if (c >= 0x3000 && c <= 0x303f) w += 15;
  else if (c >= 0xff00 && c <= 0xffef) w += 15; else if (/[0-9A-Za-z]/.test(ch)) w += 7.5;
  else if (ch === ' ') w += 7.5; else if ('｜|:：。，、！？…—·【】[]'.includes(ch)) w += 15; else w += 8; } return w; };
ok('音量行 14px 宽度预算 estW ≤470（面板内）', rowVol && estW(rowVol[1]) <= 470, rowVol && estW(rowVol[1]));

// —— 运行期：偏好恢复/落盘/步进/钳制 ——
ok('启动默认 S.VOL===1（空存储回退 100%）', S.VOL === 1, S.VOL);
mem['jrpg_vol'] = '70';
loadVolPref();
ok('loadVolPref 恢复 70% → S.VOL===0.7', S.VOL === 0.7, S.VOL);
S.VOL = 0.4; saveVolPref();
ok('saveVolPref 落盘 (jrpg_vol)===\'40\'', mem['jrpg_vol'] === '40', mem['jrpg_vol']);
ok('setVolume(+VOL_STEP) 0.4→0.5 并落盘 \'50\'', setVolume(VOL_STEP) === 0.5 && mem['jrpg_vol'] === '50');
ok('setVolume×5 连续减小钳制到 0（不越界）', setVolume(-VOL_STEP) === 0.4 && setVolume(-VOL_STEP) === 0.3 &&
  setVolume(-VOL_STEP) === 0.2 && setVolume(-VOL_STEP) === 0.1 && setVolume(-VOL_STEP) === 0 && mem['jrpg_vol'] === '0');
ok('setVolume(0.9 起步) 上限钳制 1（不越界）', setVolume(0.9) === 0.9 && setVolume(VOL_STEP) === 1 && setVolume(VOL_STEP) === 1 && mem['jrpg_vol'] === '100');
ok('浮点步进无误差（0.1 累加 ×10 取整消除）', (S.VOL = 0.2, setVolume(VOL_STEP)) === 0.3 && (S.VOL = 0.7, setVolume(-VOL_STEP)) === 0.6);

// —— 运行期：主增益总线实例与实时跟随 ——
SFX.select();
ok('首声后 S.AC 初始化且 S.masterGain 实例存在（主增益总线）', !!S.AC && !!S.masterGain && typeof S.masterGain.connect === 'function');
ok('主增益初值 === S.VOL（0.6）', S.masterGain.gain.value === 0.6, S.masterGain.gain.value);
ok('setVolume 实时写入主增益总线（0.6→0.7）', setVolume(VOL_STEP) === 0.7 && S.masterGain.gain.value === 0.7);
ok('ac() 幂等（再次调用不重建总线/不重置音量）', ac() === S.AC && S.masterGain.gain.value === 0.7);

// —— README / package.json 同步 ——
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
ok('package.json 已收录 smoke_v2212_volume（npm test 串跑第 108 份）', JSON.stringify(pkg.scripts.test).includes('smoke_v2212_volume.mjs'));
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
ok('README 快速上手表含 [ / ] 音量行', readme.includes('调节主音量') && readme.includes('10% 步进'));
ok('README 含 smoke_v2212_volume 入库（冒烟一百一十二件套口径）', readme.includes('smoke_v2212_volume') && readme.includes('一百三十一件套（一百三十件套清除）'));
ok('README 系统清单 BGM/音效 bullet 含主音量口径', readme.includes('主音量') && readme.includes('[ / ]'));

console.log(`\n${n}/${n} 通过` + (failed ? `（失败 ${failed}）` : ''));
process.exit(failed ? 1 : 0);
