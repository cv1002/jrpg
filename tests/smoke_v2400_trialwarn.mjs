// v24.00 专项冒烟：试炼碑等级达标预警——未达推荐等级时碑上一眼看清差几级（体验打磨·信息透明·决策现场）
// （承 v21.92 快速旅行目的地等级预警同一「决策现场一眼看清够不够格」主线：碑上标签 v21.46 起只报
// 「建议Lv.N」（与守碑人台词/H 页同读 RUSH_REC_LV 一份源），唯独不报「你当前几级」——Lv.6 玩家站在碑前
// 只知道该 12 级、不知道差 6 级，与 v21.92 红色预警行同款缺口形态（踩上即开战、无可反悔，级别差却查无
// 一眼之数）；现 ready 态且 S.G.level < RUSH_REC_LV 时于主标签上方追加红色预警行「⚠️ 建议 Lv.N ·
// 你当前 Lv.M · 差 K 级」（RUSH_REC_LV/S.G.level 单一数据源派生、达标/超额零噪音——与快速旅行预警同
// 「未达标才报」口径，主标签/通关奖行/未解锁档逐字未动）。纯显示零结算零存档零数值变化。
// 本冒烟守护：版本锚点、data.js/drawWorld.js 源级落位（v24.00 注释 / GAME_VERSION v24.00 与旧 v23.99
// 字面量零残留 / v23.99 历史注释保留 / 预警行代码与主标签模板共存）、运行期真实 drawWorld 四态实证
// （ready+未达标→预警行命中且主标签照常 / ready+达标→零噪音 / ready+超额→零噪音 / 未解锁→零噪音且
// 「试炼·未解锁」）、README/package.json/CHANGELOG 同步（件套口径 224 + v24.00 守护描述 + 入库 224 +
// tests 树串尾 + package 串尾 + 试炼碑句）、哨兵链（v2143 前望 226 且 README 尚无 225 口径）、
// 旧代 v23.99 pin 全库零残留扫描（字面量/恒等/顶 pin/件套 223-222 口径/testChain 223）。
import { S } from '../js/state.js';
import { GAME_VERSION, RUSH_REC_LV } from '../js/data.js';
import { drawWorld } from '../js/view/index.js';
import { CTX } from '../js/view/canvas.js';
import { loadMap } from '../js/world.js';
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

console.log('— v24.00 试炼碑等级达标预警 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const wSrc = read('js/view/drawWorld.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v23.99 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v23.99', !!_gv && (_gv[0] > 23 || (_gv[0] === 23 && _gv[1] > 99)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js 含 v24.00 注释（试炼碑等级达标预警说明）', dSrc.includes('// v24.00 体验打磨·信息透明·决策现场'));
ok('data.js GAME_VERSION 字面量已为 v24.02（旧 v23.99 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.02';") && !dSrc.includes("const GAME_VERSION = 'v23.9" + "9';"));
ok('data.js 仍保留 v23.99 历史注释（伤害公式速查行说明，累积注释块）',
  dSrc.includes('// v23.99 文档整理·数值说明·同源口径'));

// —— drawWorld.js 源级落位：预警行 + 主标签共存 ——
ok('drawWorld.js 含 v24.00 注释（试炼碑等级达标预警）', wSrc.includes('v24.00 试炼碑等级达标预警'));
ok('drawWorld.js 预警条件 S.G.level < RUSH_REC_LV', wSrc.includes('S.G.level < RUSH_REC_LV'));
ok('drawWorld.js 预警行模板（⚠️ 建议 Lv.N · 你当前 Lv.M · 差 K 级，全由 RUSH_REC_LV/S.G.level 派生）',
  wSrc.includes("const warn = '⚠️ 建议 Lv.' + RUSH_REC_LV + ' · 你当前 Lv.' + S.G.level + ' · 差 ' + (RUSH_REC_LV - S.G.level) + ' 级'"));
ok('drawWorld.js 预警与 v21.92 同色 #ff5b5b（红字）', wSrc.includes("CTX.fillStyle = '#ff5b5b'") && wSrc.includes("rr(lx - ww / 2, ly - 44, ww, 17, 4)"));
ok('drawWorld.js 主标签零回归（· 建议Lv.${RUSH_REC_LV} 逐字未动）',
  wSrc.includes('· 建议Lv.${RUSH_REC_LV}') && wSrc.includes('v21.46 碑上标签补'));
ok('drawWorld.js 未解锁档不画预警（预警置于 ready 分支内）',
  wSrc.includes('if (ready && S.G.level < RUSH_REC_LV) {'));

// —— 运行期实证：drawWorld 试炼碑标签四态 ——
const origScene = S.scene;
const origHero = S.G;
let drawnCalls = [];
const origFill = CTX.fillText.bind(CTX);
CTX.fillText = (t) => { drawnCalls.push(String(t)); };
const WARN = (lv) => `⚠️ 建议 Lv.${RUSH_REC_LV} · 你当前 Lv.${lv} · 差 ${RUSH_REC_LV - lv} 级`;
try {
  ok('启动引导后 S.G 已建档（新档真实状态）', !!S.G && S.G.level >= 1, S.G && S.G.level);
  loadMap('cave');
  ok('loadMap(cave) 后 G.map 已同步为 cave（碑标签绘制条件成立）', S.G.map === 'cave', S.G.map);
  // 1) ready + 未达标（Lv6）：预警行命中 + 主标签照常 + 通关奖行照常
  S.G.bossDefeated = true; S.G.caveBoss = true; S.G.level = 6;
  drawnCalls.length = 0;
  drawWorld();
  ok('ready+Lv6 预警行落画（⚠️ 建议 Lv.12 · 你当前 Lv.6 · 差 6 级）',
    drawnCalls.some((t) => t === WARN(6)), drawnCalls.find((t) => t.includes('建议 Lv.')));
  ok('ready+Lv6 主标签照常（阵容 + 建议Lv.' + RUSH_REC_LV + '）',
    drawnCalls.some((t) => t.includes('试炼三连战') && t.includes('建议Lv.' + RUSH_REC_LV)));
  ok('ready+Lv6 通关奖行照常（💰 通关奖 …随等级）',
    drawnCalls.some((t) => t.includes('通关奖') && t.includes('随等级')));
  // 2) ready + 达标（Lv=RUSH_REC_LV）：零噪音
  S.G.level = RUSH_REC_LV;
  drawnCalls.length = 0;
  drawWorld();
  ok('ready+达标（Lv=' + RUSH_REC_LV + '）预警零噪音', !drawnCalls.some((t) => t.includes('建议 Lv.')));
  ok('ready+达标 主标签照常', drawnCalls.some((t) => t.includes('建议Lv.' + RUSH_REC_LV)));
  // 3) ready + 超额（Lv=RUSH_REC_LV+5）：零噪音
  S.G.level = RUSH_REC_LV + 5;
  drawnCalls.length = 0;
  drawWorld();
  ok('ready+超额（Lv=' + (RUSH_REC_LV + 5) + '）预警零噪音',
    !drawnCalls.some((t) => t.includes('建议 Lv.')) && !drawnCalls.some((t) => t.includes('差 ')));
  // 4) 未解锁：零噪音 + 只画「试炼·未解锁」
  S.G.bossDefeated = false; S.G.caveBoss = false;
  drawnCalls.length = 0;
  drawWorld();
  ok('未解锁态只画「试炼·未解锁」（无阵容/无建议等级/无预警）',
    drawnCalls.some((t) => t.includes('试炼·未解锁')) &&
    !drawnCalls.some((t) => t.includes('建议Lv.')) &&
    !drawnCalls.some((t) => t.includes('建议 Lv.')));
} finally {
  CTX.fillText = origFill;
  S.scene = origScene;
  S.G = origHero;
}

// —— README / package.json / CHANGELOG 同步 ——
const testChain = (JSON.parse(pkg).scripts.test.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 224 件套', testChain === 226, String(testChain));
ok('package.json 已收录 smoke_v2400_trialwarn（npm test 串跑第 224 份）',
  JSON.parse(pkg).scripts.test.includes('smoke_v2400_trialwarn.mjs'));
ok('package.json 串尾为 ... smoke_v2399_dmgformula.mjs && node tests/smoke_v2400_trialwarn.mjs && node tests/smoke_v2401_winbgm.mjs && node tests/smoke_v2402_firstwin.mjs"',
  pkg.includes('node tests/smoke_v2399_dmgformula.mjs && node tests/smoke_v2400_trialwarn.mjs && node tests/smoke_v2401_winbgm.mjs && node tests/smoke_v2402_firstwin.mjs"'));
ok('README tests 树串尾已延伸至 smoke_v2400_trialwarn',
  readme.includes('+ smoke_v2399_dmgformula + smoke_v2400_trialwarn + smoke_v2401_winbgm + smoke_v2402_firstwin（npm test 串跑）'));
ok('README 件套口径为二百二十六件套（二百二十五件套清除）且旧 223 口径零残留',
  readme.includes('冒烟二百二十六件套（二百二十五件套清除）') && !readme.includes('冒烟二百二十三件套（二百二十二件套清除）'));
ok('README 含 v24.00 守护描述（「试炼碑等级达标预警」守护）', readme.includes('v24.00 起含 试炼碑等级达标预警守护'));
ok('README 含 smoke_v2400_trialwarn 入库（224 份）', readme.includes('smoke_v2400_trialwarn 入库（224 份）'));
ok('README 试炼碑句含 v24.00 红色预警口径（⚠️ 建议 Lv.N · 你当前 Lv.M · 差 K 级）',
  readme.includes('**v24.00 起未达推荐等级时碑上红色预警** `⚠️ 建议 Lv.N · 你当前 Lv.M · 差 K 级`'));
ok('README 仍保留 v23.99/v23.98 历史守护描述与入库口径（历史累积）',
  readme.includes('v23.99 起含 「伤害公式」数值速查行守护') &&
  readme.includes('smoke_v2399_dmgformula 入库（223 份）') &&
  readme.includes('smoke_v2398_econrow 入库（222 份）'));
ok('README 快速旅行预警行零回归（v21.92 口径逐字保留）',
  readme.includes('⚠️ 推荐 Lv.N · 你当前 Lv.M · 先补给再战！'));
ok('README 数值速查「试炼推荐等级」行零回归（RUSH_REC_LV 派生口径逐字保留）',
  readme.includes('`RUSH_REC_LV`（`SPECIES[].lv` 派生）'));
ok('CHANGELOG 顶部已追加 v24.00 条目（试炼碑等级达标预警）', changelog.startsWith('## v24.02 '));
ok('CHANGELOG 顶部条目含预警口径说明', changelog.includes('试炼碑等级达标预警') && changelog.includes('差 K 级'));
ok('CHANGELOG 仍保留 v23.99 与 v23.98 条目标题（历史口径）',
  changelog.includes('## v23.99 文档整理·数值说明·同源口径') &&
  changelog.includes('## v23.98 文档整理·数值说明·同源口径'));

// —— 哨兵链：v2143 前哨前望 226 且 README 尚无 225 口径 ——
const s2143 = read('tests/smoke_v2143_talkekey.mjs');
ok('smoke_v2143 哨兵链已推进至二百二十七件套（二百二十六件套清除）',
  s2143.includes('二百二十七件套（二百二十六件套清除）') && s2143.includes("!readme.includes('二百二十七件套（二百二十六件套清除）')"));
ok('README 尚无二百二十七件套（二百二十六件套清除）前望口径', !readme.includes('二百二十七件套（二百二十六件套清除）'));

// —— 旧代 v23.99 pin 全库零残留（不含本件；拆串防误伤，承 v2319/v2392-99 惯例）——
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2400_trialwarn.mjs');
const stale = [];
for (const f of allTests) {
  const src = read('tests/' + f);
  if (src.includes("const GAME_VERSION = 'v23.9" + "9';") ||
      src.includes("const GAME_VERSION = 'v23.9" + "9'") ||
      src.includes("GAME_VERSION === 'v23.9" + "9'") ||
      src.includes("startsWith('## v23.9" + "9 ") ||
      src.includes("startsWith('## v23.9" + "9'") ||
      src.includes('二百二十三件套（二百二十二件套清' + '除）') ||
      src.includes('testChain === ' + '223')) stale.push(f);
}
ok('旧代 v23.99 字面量/恒等/顶 pin/件套 223-222 口径/testChain 223 全库零残留（' + allTests.length + ' 件扫描，仅 v23.99 特性标签保留）',
  stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
