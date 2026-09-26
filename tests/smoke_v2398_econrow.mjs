// v23.98 专项冒烟：README「数值速查」「经济」行 灵药恢复量口径补全——文档整理·数值说明·同源口径
// （承 v22.58/v23.26 H 页「喝药（普通/灵药）」行恢复量口径同一「数值说明与结算同读一份源」主线：
// 经济行「酿造 2 菇+10 金→灵药（80%HP+40%MP）」漏了 FLAT 恢复项——实际结算为
// ELIXIR_HP_PCT(80%)×最大HP + ELIXIR_HP_FLAT(20) 并回 ELIXIR_MP_PCT(40%)×最大MP（与 H 页
// 「喝药（普通/灵药）」行/战斗指令栏 [3] 预览/#help F 块/core.usePotion 结算同读一份源，调恢复量
// 只改 data.js POTION_*/ELIXIR_* 常量一处全端自动跟随，零裸字面量）；现按「灵药 80%HP+20并回40%MP」
// 收口，纯文档零逻辑零结算零存档零数值变化，常量逐字未动。
// 本冒烟守护：版本锚点、data.js 源级落位（v23.98 注释 / GAME_VERSION v23.98 与旧 v23.97 字面量
// 零残留 / v23.97 历史注释保留）、运行期恢复常量契约（POTION_HP_PCT 0.5 · POTION_HP_FLAT 8 ·
// ELIXIR_HP_PCT 0.8 · ELIXIR_HP_FLAT 20 · ELIXIR_MP_PCT 0.4 + 派生串 50%HP+8 · 80%HP+20并回40%MP）、
// HELP_PAGES 喝药行运行期同源口径、index.html #help F 块零回归、
// README/package.json/CHANGELOG 同步（件套口径 222 + v23.98 守护描述 + 入库 222 + tests 树串尾 +
// package 串尾）、既有速查行零回归（基础属性/每级成长/升级经验）、哨兵链（v2143 前望 223 且 README
// 尚无 223 口径）、旧代 v23.97 pin 全库零残留扫描（字面量/恒等/顶 pin/件套 221-220 口径/testChain 221）。
import { S } from '../js/state.js';
import { GAME_VERSION, POTION_HP_PCT, POTION_HP_FLAT, ELIXIR_HP_PCT, ELIXIR_HP_FLAT, ELIXIR_MP_PCT, HELP_PAGES } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v23.97 冒烟先例：先装桩再 import main.js）——
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

console.log('— v23.98 「经济」数值速查行灵药恢复量口径 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v23.97 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v23.97', !!_gv && (_gv[0] > 23 || (_gv[0] === 23 && _gv[1] > 97)), GAME_VERSION);
ok('data.js 含 v23.98 注释（经济行灵药恢复量口径说明）', dSrc.includes('// v23.98 文档整理·数值说明·同源口径'));
ok('data.js GAME_VERSION 字面量已为 v24.03（旧 v23.99 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.03';") && !dSrc.includes("const GAME_VERSION = 'v23.9" + "8';"));
ok('data.js 仍保留 v23.97 历史注释（基础属性速查行说明，累积注释块）',
  dSrc.includes('// v23.97 文档整理·数值说明·同源口径'));

// —— 运行期：恢复常量契约（v23.98 经济行唯一真源）——
ok('POTION_HP_PCT = 0.5（生命药水 50%HP', POTION_HP_PCT === 0.5, String(POTION_HP_PCT));
ok('POTION_HP_FLAT = 8（生命药水 +8', POTION_HP_FLAT === 8, String(POTION_HP_FLAT));
ok('ELIXIR_HP_PCT = 0.8（高级灵药 80%HP', ELIXIR_HP_PCT === 0.8, String(ELIXIR_HP_PCT));
ok('ELIXIR_HP_FLAT = 20（高级灵药 +20', ELIXIR_HP_FLAT === 20, String(ELIXIR_HP_FLAT));
ok('ELIXIR_MP_PCT = 0.4（高级灵药 40%MP', ELIXIR_MP_PCT === 0.4, String(ELIXIR_MP_PCT));
const potionStr = Math.round(POTION_HP_PCT * 100) + '%HP+' + POTION_HP_FLAT;
const elixirStr = Math.round(ELIXIR_HP_PCT * 100) + '%HP+' + ELIXIR_HP_FLAT + '并回' + Math.round(ELIXIR_MP_PCT * 100) + '%MP';
ok('派生恢复串 药水 = 50%HP+8（与 data.js H 页行同模板）', potionStr === '50%HP+8', potionStr);
ok('派生恢复串 灵药 = 80%HP+20并回40%MP（与 data.js H 页行同模板）', elixirStr === '80%HP+20并回40%MP', elixirStr);
{
  const hpJson = JSON.stringify(HELP_PAGES);
  ok('HELP_PAGES 喝药行运行期含 50%HP+8 口径', hpJson.includes('50%HP+8'));
  ok('HELP_PAGES 喝药行运行期含 80%HP+20并回40%MP 口径', hpJson.includes('80%HP+20并回40%MP'));
}
S.G = null; S.scene = 'title';

// —— README / package.json / CHANGELOG / index.html 同步 ——
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');
const indexHtml = read('index.html');
const testChain = (JSON.parse(pkg).scripts.test.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 223 件套', testChain === 227, String(testChain));
ok('package.json 已收录 smoke_v2398_econrow（npm test 串跑第 222 份）',
  JSON.parse(pkg).scripts.test.includes('smoke_v2398_econrow.mjs'));
ok('package.json 串尾为 ... smoke_v2397_baserow.mjs && node tests/smoke_v2398_econrow.mjs && node tests/smoke_v2399_dmgformula.mjs && node tests/smoke_v2400_trialwarn.mjs && node tests/smoke_v2401_winbgm.mjs && node tests/smoke_v2402_firstwin.mjs && node tests/smoke_v2403_diffbattle.mjs"',
  pkg.includes('node tests/smoke_v2397_baserow.mjs && node tests/smoke_v2398_econrow.mjs && node tests/smoke_v2399_dmgformula.mjs && node tests/smoke_v2400_trialwarn.mjs && node tests/smoke_v2401_winbgm.mjs && node tests/smoke_v2402_firstwin.mjs && node tests/smoke_v2403_diffbattle.mjs"'));
ok('README tests 树串尾已延伸至 smoke_v2399_dmgformula',
  readme.includes('+ smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula + smoke_v2400_trialwarn + smoke_v2401_winbgm + smoke_v2402_firstwin + smoke_v2403_diffbattle（npm test 串跑）'));
ok('README 件套口径为二百二十七件套（二百二十六件套清除）且旧 216 口径零残留',
  readme.includes('冒烟二百二十七件套（二百二十六件套清除）') && !readme.includes('冒烟二百一十六件套（二百一十五件套清' + '除）'));
ok('README 含 v23.99 守护描述（「伤害公式」数值速查行守护）', readme.includes('v23.99 起含 「伤害公式」数值速查行守护'));
ok('README 含 smoke_v2399_dmgformula 入库（223 份）', readme.includes('smoke_v2399_dmgformula 入库（223 份）'));
ok('README 仍保留 v23.97 历史守护描述与入库口径（历史累积）',
  readme.includes('v23.97 起含 「基础属性」数值速查行守护') &&
  readme.includes('smoke_v2397_baserow 入库（221 份）'));

// —— README 经济行落位与零回归 ——
ok('README 经济行灵药口径已补齐 +20 并回 40%MP（80%HP+20并回40%MP）',
  readme.includes('酿造 2 菇+10 金→灵药（80%HP+20并回40%MP）'));
ok('README 经济行旧行（80%HP+40%MP 无 FLAT）全行零残留',
  !readme.includes('| 经济 | 新档 30 金 + 3 药；药水 15 金（50%HP+8）；旅馆 10 金全恢复；卖菇 10 金；酿造 2 菇+10 金→灵药（80%HP+40%MP） |'));
ok('README 经济行 药水/旅馆/卖菇/酿造 其余口径逐字零回归',
  readme.includes('| 经济 | 新档 30 金 + 3 药；药水 15 金（50%HP+8）；旅馆 10 金全恢复；卖菇 10 金；酿造 2 菇+10 金→灵药（80%HP+20并回40%MP） | `START_*` `POTION_*` `INN_PRICE` `MUSHROOM_PRICE` `BREW_*` `ELIXIR_*` |'));
ok('README 基础属性行零回归（v23.97 补录行逐字未动）',
  readme.includes('| 基础属性 | Lv1 HP 45 · MP 16 · 攻 9 · 防 5（`baseStats(1)` 单一数据源：`Lv.N = 38+7N / 12+4N / 7+2N / 3+2N`'));
ok('README 每级成长行零回归（HP+7 · MP+4 · 攻+2 · 防+2）',
  readme.includes('| 每级成长 | HP+7 · MP+4 · 攻+2 · 防+2 | `baseStats` 一阶差分 `LEVEL_GROWTH` |'));
ok('README 升级经验行零回归（XP_INIT 20 链式口径）',
  readme.includes('| 升级经验 | `XP_INIT`(20) 起**链式**逐级 `round(上一级 × 1.42)`'));
ok('index.html #help F 块零回归（同样 80%HP+20并回40%MP 口径）',
  indexHtml.includes('灵药 80%HP+20并回40%MP'));

ok('CHANGELOG 顶部已追加 v24.00 条目（试炼碑等级达标预警）', changelog.startsWith('## v24.03 '));
ok('CHANGELOG 顶部条目含伤害公式口径说明', changelog.includes('「伤害公式」') && changelog.includes('攻×2−防'));
ok('CHANGELOG 仍保留 v23.98 与 v23.97 条目标题（历史口径）',
  changelog.includes('## v23.98 文档整理·数值说明·同源口径') &&
  changelog.includes('## v23.97 文档整理·数值说明·同源口径'));

// —— 哨兵链：v2143 前哨前望 226 且 README 尚无 225 口径 ——
const s2143 = read('tests/smoke_v2143_talkekey.mjs');
ok('smoke_v2143 哨兵链已推进至二百二十八件套（二百二十七件套清除）',
  s2143.includes('二百二十八件套（二百二十七件套清除）') && s2143.includes("!readme.includes('二百二十八件套（二百二十七件套清除）')"));
ok('README 尚无二百二十八件套（二百二十七件套清除）前望口径', !readme.includes('二百二十八件套（二百二十七件套清除）'));

// —— 旧代 v23.98 pin 全库零残留（不含本件；拆串防误伤，承 v2319/v2392-98 惯例）——
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2398_econrow.mjs');
const stale = [];
for (const f of allTests) {
  const src = read('tests/' + f);
  if (src.includes("const GAME_VERSION = 'v23.9" + "8';") ||
      src.includes("const GAME_VERSION = 'v23.9" + "8'") ||
      src.includes("GAME_VERSION === 'v23.9" + "8'") ||
      src.includes("startsWith('## v23.9" + "8 ") ||
      src.includes("startsWith('## v23.9" + "8'") ||
      src.includes('二百二十二件套（二百二十一件套清' + '除）') ||
      src.includes('testChain === ' + '222')) stale.push(f);
}
ok('旧代 v23.98 字面量/恒等/顶 pin/件套 222-221 口径/testChain 222 全库零残留（' + allTests.length + ' 件扫描，仅 v23.98 特性标签保留）',
  stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
