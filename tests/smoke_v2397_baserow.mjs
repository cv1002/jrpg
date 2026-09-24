// v23.97 专项冒烟：README「数值速查」补「基础属性」行——文档整理·数值说明·同源口径
// （承 v23.01-09 数值速查行系列：速查表 21 行已覆盖 成长/升级/技能/装备/经济/战斗/掉落/生态/
// 试炼/成就/魔物/技能数值/强敌变身/难度/支线/昼夜，唯独 Lv1 基础属性（baseStats(1)
// HP 45 · MP 16 · 攻 9 · 防 5）散见 baseStats 源码与状态页面板——README 维护者速览查无一行，
// 调 Lv1 基数需先通读代码才能对上口径；现补录：数值速查表「每级成长」行之后追加「基础属性」行
// （全部由 data.js baseStats 派生、与升级结算 hero.grantXp 差分/创建页每级成长标注/状态页
// HP/MP/攻/防面板同读同源），纯文档零逻辑零结算零存档零数值变化，baseStats/LEVEL_GROWTH
// 数值逐字未动。
// 本冒烟守护：版本锚点、data.js 源级落位（v23.97 注释 / GAME_VERSION v23.97 与旧 v23.96 字面量
// 零残留）、运行期 baseStats/LEVEL_GROWTH 契约（Lv1/Lv2/Lv12 逐值 + 一阶差分 + 单调）、
// README 基础属性行落位（每级成长行之前 + 每级成长/升级经验零回归）、README/package.json/
// CHANGELOG 同步（件套口径 221 + v23.97 守护描述 + 入库 221 + tests 树串尾 + package 串尾）、
// 哨兵链（v2143 前望 223 且 README 尚无 223 口径）、旧代 v23.97 pin 全库零残留扫描
// （字面量/恒等/顶 pin/件套 221-220 口径/testChain 221）。
import { S } from '../js/state.js';
import { GAME_VERSION, baseStats, LEVEL_GROWTH } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v23.96 冒烟先例：先装桩再 import main.js）——
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

console.log('— v23.97 「基础属性」数值速查行 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v23.96 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v23.96', !!_gv && (_gv[0] > 23 || (_gv[0] === 23 && _gv[1] > 96)), GAME_VERSION);
ok('data.js 含 v23.97 注释（基础属性速查行说明）', dSrc.includes('// v23.97 文档整理·数值说明·同源口径'));
ok('data.js GAME_VERSION 字面量已为 v23.97（旧 v23.96 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v23.98';") && !dSrc.includes("const GAME_VERSION = 'v23.9" + "6';"));
ok('data.js 仍保留 v23.96 历史注释（精钢甲装备曲线说明，累积注释块）',
  dSrc.includes('v23.96 数值平衡·装备曲线补全'));

// —— 运行期：baseStats 基础属性契约（v23.97 速查行唯一真源）——
{
  const b1 = baseStats(1);
  ok('baseStats(1) 逐值 = HP45 · MP16 · 攻9 · 防5',
    b1.hpMax === 45 && b1.mpMax === 16 && b1.atk === 9 && b1.def === 5, JSON.stringify(b1));
  const b2 = baseStats(2);
  ok('baseStats(2) 逐值 = HP52 · MP20 · 攻11 · 防7',
    b2.hpMax === 52 && b2.mpMax === 20 && b2.atk === 11 && b2.def === 7, JSON.stringify(b2));
  const b12 = baseStats(12);
  ok('baseStats(12) 逐值 = HP122 · MP60 · 攻31 · 防27（线性契约）',
    b12.hpMax === 122 && b12.mpMax === 60 && b12.atk === 31 && b12.def === 27, JSON.stringify(b12));
  ok('LEVEL_GROWTH 一阶差分 = {hp:7,mp:4,atk:2,def:2}（与 baseStats 同源派生）',
    LEVEL_GROWTH.hp === 7 && LEVEL_GROWTH.mp === 4 && LEVEL_GROWTH.atk === 2 && LEVEL_GROWTH.def === 2,
    JSON.stringify(LEVEL_GROWTH));
  const seq = [1, 2, 3, 5, 8, 12].map((lv) => baseStats(lv).hpMax);
  ok('HP 曲线严格单调（45<52<59<73<94<122）', seq.every((v, i) => i === 0 || v > seq[i - 1]), seq.join('<'));
}
S.G = null; S.scene = 'title';

// —— README / package.json / CHANGELOG 同步 ——
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');
const testChain = (JSON.parse(pkg).scripts.test.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 221 件套', testChain === 222, String(testChain));
ok('package.json 已收录 smoke_v2397_baserow（npm test 串跑第 221 份）',
  JSON.parse(pkg).scripts.test.includes('smoke_v2397_baserow.mjs && node tests/smoke_v2398_econrow.mjs'));
ok('package.json 串尾为 ... smoke_v2396_steelarmor.mjs && node tests/smoke_v2397_baserow.mjs && node tests/smoke_v2398_econrow.mjs"',
  pkg.includes('node tests/smoke_v2396_steelarmor.mjs && node tests/smoke_v2397_baserow.mjs && node tests/smoke_v2398_econrow.mjs"'));
ok('README tests 树串尾已延伸至 smoke_v2397_baserow',
  readme.includes('+ smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow（npm test 串跑）'));
ok('README 件套口径为二百二十二件套（二百二十一件套清除）且旧 216 口径零残留',
  readme.includes('冒烟二百二十二件套（二百二十一件套清除）') && !readme.includes('冒烟二百一十六件套（二百一十五件套清' + '除）'));
ok('README 含 v23.97 守护描述（「基础属性」数值速查行守护）', readme.includes('v23.97 起含 「基础属性」数值速查行守护'));
ok('README 含 smoke_v2397_baserow 入库（221 份）', readme.includes('smoke_v2397_baserow 入库（221 份）'));
ok('README 仍保留 v23.96 历史守护描述与入库口径（历史累积）',
  readme.includes('v23.96 起含 新防具「精钢甲」守护') &&
  readme.includes('smoke_v2396_steelarmor 入库（220 份）'));
ok('README 基础属性行落位（每级成长行之前）：HP 45 · MP 16 · 攻 9 · 防 5 与 baseStats 派生口径',
  readme.includes('| 基础属性 | Lv1 HP 45 · MP 16 · 攻 9 · 防 5（`baseStats(1)` 单一数据源：`Lv.N = 38+7N / 12+4N / 7+2N / 3+2N`'));
ok('README 基础属性行 升级结算/创建页/状态页同源口径逐字',
  readme.includes('与升级结算 `hero.grantXp` 差分/创建页每级成长标注/状态页 HP/MP/攻/防面板同读一份源'));
ok('README 基础属性行 补录标记 v23.97 逐字', readme.includes('（v23.97 补录） | `baseStats`（`LEVEL_GROWTH` 差分） |'));
ok('README 每级成长行零回归（速查表第二行逐字未动）',
  readme.includes('| 每级成长 | HP+7 · MP+4 · 攻+2 · 防+2 | `baseStats` 一阶差分 `LEVEL_GROWTH` |'));
ok('README 升级经验行零回归（XP_INIT 20 链式口径）',
  readme.includes('| 升级经验 | `XP_INIT`(20) 起**链式**逐级 `round(上一级 × 1.42)`'));
ok('CHANGELOG 顶部已追加 v23.97 条目（基础属性速查行）', changelog.startsWith('## v23.98 '));
ok('CHANGELOG 顶部条目含基础属性说明', changelog.includes('补「基础属性」行'));
ok('CHANGELOG 仍保留 v23.96 条目标题（历史口径）', changelog.includes('## v23.96 新防具「精钢甲」'));

// —— 哨兵链：v2143 前哨前望 223 且 README 尚无 223 口径 ——
const s2143 = read('tests/smoke_v2143_talkekey.mjs');
ok('smoke_v2143 哨兵链已推进至二百二十三件套（二百二十二件套清除）',
  s2143.includes('二百二十三件套（二百二十二件套清除）') && s2143.includes("!readme.includes('二百二十三件套（二百二十二件套清除）')"));
ok('README 尚无二百二十三件套（二百二十二件套清除）前望口径', !readme.includes('二百二十三件套（二百二十二件套清除）'));

// —— 旧代 v23.97 pin 全库零残留（不含本件；拆串防误伤，承 v2319/v2392-96 惯例）——
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2397_baserow.mjs');
const stale = [];
for (const f of allTests) {
  const src = read('tests/' + f);
  if (src.includes("const GAME_VERSION = 'v23.9" + "7';") ||
      src.includes("const GAME_VERSION = 'v23.9" + "7'") ||
      src.includes("GAME_VERSION === 'v23.9" + "7'") ||
      src.includes("startsWith('## v23.9" + "7 ") ||
      src.includes("startsWith('## v23.9" + "7'") ||
      src.includes('二百二十一件套（二百二十件套清' + '除）') ||
      src.includes('testChain === ' + '221')) stale.push(f);
}
ok('旧代 v23.97 字面量/恒等/顶 pin/件套 221-220 口径/testChain 221 全库零残留（' + allTests.length + ' 件扫描，仅 v23.97 特性标签保留）',
  stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
