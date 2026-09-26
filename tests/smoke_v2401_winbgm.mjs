// v24.01 专项冒烟：胜利/阵亡/尾声三屏专属 BGM——战斗的结果侧三屏此前静音（scene.js goto 进入
// win/dead 时 stopBgm、ending 由 battle.js isTrue 分支 stopBgm），打赢幽冥魔王/洞窟领主（「灯芯
// 回来了」决策现场）、战败复盘（B/R/T/P 四键决策现场）、真结局总结屏是 run 最重要的三个场景，
// 音乐却在战斗结束的瞬间戛然而止（只剩 SFX.victory/death 一响）；现补三轨（win 凯旋上行大调琶音
// triangle 0.26 / dead 阵亡复盘下行低吟 sine 0.42 / ending 尾声安宁 C-E-G-C 上行回落 triangle
// 0.34，与 v23.45 battleBoss 同法：纯音乐数据声明、scheduleStep/gain 共用既有渲染管线），
// scene.js goto 按场景分轨（startBgm 自带 stopBgm、走出回 world 的 resumeBgm 照旧回地图轨）。
// 本冒烟守护：版本锚点、data.js/audio.js/scene.js 源级落位（v24.01 注释 / GAME_VERSION v24.01 与
// 旧 v24.00 字面量零残留 / v24.00 历史注释保留 / MUSIC win·dead·ending 三轨与注释共存 / scene.js
// 三分轨行）、运行期真实 startBgm/goto 路径实证（ac 初始化→startBgm('title')→goto('win') 凯旋轨 →
// goto('ending') 尾声轨 → goto('dead') 复盘轨 → goto('world') 回地图轨、三轨 MUSIC 逐值）、
// README/package.json/CHANGELOG 同步（件套口径 225 + v24.01 守护描述 + 入库 225 + tests 树串尾 +
// package 串尾）、哨兵链（v2143 前望 226 且 README 尚无 226 口径）、旧代 v24.00 pin 全库零残留扫描
// （字面量/恒等/顶 pin/件套 224-223 口径/testChain 224）。
import { S } from '../js/state.js';
import { GAME_VERSION } from '../js/data.js';
import { MUSIC, startBgm, stopBgm, resumeBgm, ac } from '../js/audio.js';
import { goto } from '../js/scene.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v21.45 冒烟先例：先装桩再 import main.js）——
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

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.01 胜利/阵亡/尾声专属 BGM 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const aSrc = read('js/audio.js');
const sSrc = read('js/scene.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v24.00 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.00', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 0)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js 含 v24.01 注释（胜利/阵亡/尾声专属 BGM 说明）', dSrc.includes('// v24.01 音效反馈·听觉信息透明'));
ok('data.js GAME_VERSION 字面量已为 v24.03（旧 v24.00 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.03';") && !dSrc.includes("const GAME_VERSION = 'v24.0" + "0';"));
ok('data.js 仍保留 v24.00 历史注释（试炼碑等级达标预警说明，累积注释块）',
  dSrc.includes('// v24.00 体验打磨·信息透明·决策现场'));

// —— audio.js 源级落位：MUSIC win/dead/ending 三轨 + 注释 ——
ok('audio.js 含 v24.01 注释（胜利/阵亡/尾声三屏专属 BGM）', aSrc.includes('v24.01 胜利/阵亡/尾声三屏专属 BGM'));
ok('audio.js MUSIC 含 win 轨（凯旋上行大调琶音注释落位）', aSrc.includes("  win: {") && aSrc.includes('凯旋上行大调琶音'));
ok('audio.js MUSIC 含 dead 轨（阵亡复盘下行低吟注释落位）', aSrc.includes("  dead: {") && aSrc.includes('阵亡复盘下行低吟'));
ok('audio.js MUSIC 含 ending 轨（尾声安宁注释落位）', aSrc.includes("  ending: {") && aSrc.includes('尾声安宁'));
ok('audio.js 三轨与既有 battleBoss 同族前后有序（battleBoss 之后收口）',
  aSrc.includes('battleBoss: {') && aSrc.indexOf('battleBoss: {') < aSrc.indexOf('  win: {') &&
  aSrc.indexOf('  win: {') < aSrc.indexOf('  dead: {') && aSrc.indexOf('  dead: {') < aSrc.indexOf('  ending: {'));

// —— scenes.js 源级落位：goto 三分轨行 ——
ok('scene.js goto win 分轨（startBgm(win)）', sSrc.includes("if (name === 'win') startBgm('win');"));
ok('scene.js goto dead 分轨（startBgm(dead)）', sSrc.includes("else if (name === 'dead') startBgm('dead');"));
ok('scene.js goto ending 分轨（startBgm(ending)）', sSrc.includes("else if (name === 'ending') startBgm('ending');"));
ok('scene.js 含 v24.01 注释（结果侧三屏分轨说明）', sSrc.includes('v24.01 胜利/阵亡/尾声三屏专属 BGM'));
ok('scene.js 走出回 world 的 resumeBgm 逐字保留（prev win/dead → resumeBgm）',
  sSrc.includes("if (prev === 'battle' || prev === 'win' || prev === 'dead') resumeBgm();"));
ok('scene.js 不再有 win/dead stopBgm 整段静音（旧口径零残留）',
  !sSrc.includes("if (name === 'win' || name === 'dead') stopBgm();"));

// —— MUSIC 三轨逐值（与 audio.js 定义逐字同源）——
const seqEq = (a, b) => a && b && a.length === b.length && a.every((v, i) => v === b[i]);
ok('MUSIC.win step 0.26 / wave triangle（凯旋轨）', MUSIC.win && MUSIC.win.step === 0.26 && MUSIC.win.wave === 'triangle');
ok('MUSIC.win seq 逐值（G-B-D-G 上行大调琶音 16 步）',
  seqEq(MUSIC.win.seq, [392, 0, 523, 0, 659, 0, 523, 0, 392, 0, 523, 0, 659, 0, 784, 0]), JSON.stringify(MUSIC.win && MUSIC.win.seq));
ok('MUSIC.win bass 逐值（G3/C3 低音）', seqEq(MUSIC.win.bass, [131, 0, 98, 0]), JSON.stringify(MUSIC.win && MUSIC.win.bass));
ok('MUSIC.dead step 0.42 / wave sine（复盘下行低吟）', MUSIC.dead && MUSIC.dead.step === 0.42 && MUSIC.dead.wave === 'sine');
ok('MUSIC.dead seq 逐值（G3→F#3→F3→E3 半音下行 16 步）',
  seqEq(MUSIC.dead.seq, [196, 0, 0, 0, 185, 0, 0, 0, 175, 0, 0, 0, 165, 0, 0, 0]), JSON.stringify(MUSIC.dead && MUSIC.dead.seq));
ok('MUSIC.dead bass 逐值（G2/F#2 低音）', seqEq(MUSIC.dead.bass, [98, 0, 0, 0, 87, 0, 0, 0]), JSON.stringify(MUSIC.dead && MUSIC.dead.bass));
ok('MUSIC.ending step 0.34 / wave triangle（尾声安宁）', MUSIC.ending && MUSIC.ending.step === 0.34 && MUSIC.ending.wave === 'triangle');
ok('MUSIC.ending seq 逐值（C-E-G-C 上行回落 16 步）',
  seqEq(MUSIC.ending.seq, [262, 0, 329, 0, 392, 0, 523, 0, 392, 0, 329, 0, 294, 0, 262, 0]), JSON.stringify(MUSIC.ending && MUSIC.ending.seq));
ok('MUSIC.ending bass 逐值（C3/G2 低音）', seqEq(MUSIC.ending.bass, [131, 0, 0, 0, 98, 0, 0, 0]), JSON.stringify(MUSIC.ending && MUSIC.ending.bass));
ok('MUSIC 既有轨零回归（title/village/dungeon/cave/gallery/battle/battleBoss 七轨仍在）',
  ['title', 'village', 'dungeon', 'cave', 'gallery', 'battle', 'battleBoss'].every((k) => MUSIC[k]));

// —— 运行期实证：startBgm / goto 分轨全链路 ——
const origScene = S.scene;
const origG = S.G;
const origTrack = S.bgmTrack;
try {
  ok('启动引导后 S.G 已建档（新档真实状态）', !!S.G && S.G.level >= 1, S.G && S.G.level);
  ok('ac() 初始化 S.AC 与主增益总线（startBgm 前置）', !!(ac() && S.AC && S.masterGain));
  startBgm('title');
  ok('startBgm(title) 分轨落 S.bgmTrack=title', S.bgmTrack === 'title', S.bgmTrack);
  goto('win');
  ok('goto(win) 后 S.scene=win 且 BGM 切凯旋轨 win', S.scene === 'win' && S.bgmTrack === 'win', S.bgmTrack);
  goto('ending');
  ok('goto(ending) 后 BGM 无缝换轨 ending（startBgm 自带 stopBgm）', S.scene === 'ending' && S.bgmTrack === 'ending', S.bgmTrack);
  goto('win');
  ok('goto(win) 重现凯旋轨（win↔ending 往返稳定）', S.scene === 'win' && S.bgmTrack === 'win', S.bgmTrack);
  goto('dead');
  ok('goto(dead) 后 S.scene=dead 且 BGM 切复盘轨 dead', S.scene === 'dead' && S.bgmTrack === 'dead', S.bgmTrack);
  S.G.map = 'village';
  goto('world');
  ok('goto(world)（prev=dead）resumeBgm 回地图轨 village', S.scene === 'world' && S.bgmTrack === 'village', S.bgmTrack);
  goto('win');
  goto('world');
  ok('goto(world)（prev=win）resumeBgm 回地图轨零回归', S.scene === 'world' && S.bgmTrack === 'village', S.bgmTrack);
} finally {
  S.scene = origScene;
  S.G = origG;
  S.bgmTrack = origTrack;
}

// —— README / package.json / CHANGELOG 同步 ——
const testChain = (JSON.parse(pkg).scripts.test.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 225 件套', testChain === 227, String(testChain));
ok('package.json 已收录 smoke_v2401_winbgm（npm test 串跑第 225 份）',
  JSON.parse(pkg).scripts.test.includes('smoke_v2401_winbgm.mjs'));
ok('package.json 串尾为 ... smoke_v2400_trialwarn.mjs && node tests/smoke_v2401_winbgm.mjs && node tests/smoke_v2402_firstwin.mjs && node tests/smoke_v2403_diffbattle.mjs"',
  pkg.includes('node tests/smoke_v2400_trialwarn.mjs && node tests/smoke_v2401_winbgm.mjs && node tests/smoke_v2402_firstwin.mjs && node tests/smoke_v2403_diffbattle.mjs"'));
ok('README tests 树串尾已延伸至 smoke_v2403_diffbattle',
  readme.includes('+ smoke_v2400_trialwarn + smoke_v2401_winbgm + smoke_v2402_firstwin + smoke_v2403_diffbattle（npm test 串跑）'));
ok('README 件套口径为二百二十七件套（二百二十六件套清除）且旧 216 口径零残留',
  readme.includes('冒烟二百二十七件套（二百二十六件套清除）') && !readme.includes('冒烟二百一十六件套（二百一十五件套清' + '除）'));
ok('README 含 v24.01 守护描述（「胜利/阵亡/尾声专属 BGM」守护）', readme.includes('v24.01 起含 胜利/阵亡/尾声专属 BGM 守护'));
ok('README 含 smoke_v2401_winbgm 入库（225 份）', readme.includes('smoke_v2401_winbgm 入库（225 份）'));
ok('README 仍保留 v24.00 历史守护描述与入库口径（历史累积）',
  readme.includes('v24.00 起含 试炼碑等级达标预警守护') && readme.includes('smoke_v2400_trialwarn 入库（224 份）'));
ok('README v23.45 战斗 Boss 轨历史守护描述保留（Boss/试炼战专属战斗 BGM）',
  readme.includes('battleBoss') || readme.includes('Boss/试炼战专属战斗 BGM'));
ok('CHANGELOG 顶部已追加 v24.03 条目（胜利/阵亡/尾声专属 BGM）', changelog.startsWith('## v24.03 '));
ok('CHANGELOG 顶部条目含三轨口径说明', changelog.includes('胜利/阵亡/尾声三屏专属 BGM') && changelog.includes('C-E-G-C'));
ok('CHANGELOG 仍保留 v24.00 与 v23.99 条目标题（历史口径）',
  changelog.includes('## v24.00 体验打磨·信息透明·决策现场') && changelog.includes('## v23.99 文档整理·数值说明·同源口径'));

// —— 哨兵链：v2143 前哨前望 226 且 README 尚无 226 口径 ——
const s2143 = read('tests/smoke_v2143_talkekey.mjs');
ok('smoke_v2143 哨兵链已推进至二百二十八件套（二百二十七件套清除）',
  s2143.includes('二百二十八件套（二百二十七件套清除）') && s2143.includes("!readme.includes('二百二十八件套（二百二十七件套清除）')"));
ok('README 尚无二百二十八件套（二百二十七件套清除）前望口径', !readme.includes('二百二十八件套（二百二十七件套清除）'));

// —— 旧代 v24.00 pin 全库零残留（不含本件；拆串防误伤，承 v2319/v2392-2400 惯例）——
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2401_winbgm.mjs');
const stale = [];
for (const f of allTests) {
  const src = read('tests/' + f);
  if (src.includes("const GAME_VERSION = 'v24.0" + "0';") ||
      src.includes("const GAME_VERSION = 'v24.0" + "0'") ||
      src.includes("GAME_VERSION === 'v24.0" + "0'") ||
      src.includes("startsWith('## v24.0" + "0 ") ||
      src.includes("startsWith('## v24.0" + "0'") ||
      src.includes('二百二十四件套（二百二十三件套清' + '除）') ||
      src.includes('testChain === ' + '224')) stale.push(f);
}
ok('旧代 v24.00 字面量/恒等/顶 pin/件套 224-223 口径/testChain 224 全库零残留（' + allTests.length + ' 件扫描，仅 v24.00 特性标签保留）',
  stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
