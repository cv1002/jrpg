// v23.93 专项冒烟：README 快速上手表「阵亡」行补 P 存档口径（文档整理·口径收口——承 v21.98 胜利画面 P /
// v22.28 标题页 P / v22.30 暂停菜单 P / v22.93 阵亡画面 P 同一「saveGame 全出口」口径：四端中唯有
// 「阵亡 P」在常备速查表查无一行——v22.93 落位时只更新了系统 bullet 与死屏本身（未存档橙行
// pauseSaveHint「⚠️ 未存档 · 按 P 写入槽 N（已有存档，将覆盖/空槽）」+ dead.onKey P→saveGame），
// README 速查表「阵亡 B/R/T」行头与描述仍是三键；现补 `阵亡 \`B/R/T/P\`` 行头 + `P` 存档口径
// （与 main.js dead.onKey P→saveGame 逐字同源、与 pauseSaveHint 未存档提示同读一份源）。
// 本冒烟守护：版本锚点、data.js 源级落位（v23.93 注释 / GAME_VERSION v23.93 与旧 v23.92 字面量零残留）、
// README 速查表「阵亡」行 P 口径源级落位 + 其余 18 行按键行零回归、main.js dead.onKey P 分支源级零回归、
// menus.js pauseSaveHint 纯函数运行期四档精确、死屏 322/332/362/392/412/432 行源码零回归、
// README/package.json/CHANGELOG 同步（tests 树串尾 + 件套口径 217 + v23.93 守护描述 + 入库 217）、
// 哨兵链（v2143 前望 218 且 README 尚无 218 口径）、旧代 v23.92 pin 全库零残留扫描。
import { S } from '../js/state.js';
import { GAME_VERSION } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v23.92 冒烟先例：先装桩再 import main.js）——
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

console.log('— v23.93 README 快速上手表「阵亡」行 P 存档口径 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');
const menus = read('js/view/menus.js');
const main = read('js/main.js');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v23.92 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v23.92', !!_gv && (_gv[0] > 23 || (_gv[0] === 23 && _gv[1] > 92)), GAME_VERSION);
ok('data.js 含 v23.93 注释（文档整理·口径收口说明）', dSrc.includes('v23.93 文档整理·口径收口'));
ok('data.js GAME_VERSION 字面量已为 v23.93（旧 v23.92 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v23.98';") && !dSrc.includes("const GAME_VERSION = 'v23.9" + "2';"));
ok('data.js 仍保留 v23.92 历史注释（星铁剑说明，累积注释块）', dSrc.includes('v23.92 数值平衡·装备曲线补全'));

// —— README 快速上手表「阵亡」行源级落位：行头 B/R/T/P + P 存档口径 ——
ok('README 阵亡行头已为 `阵亡 B/R/T/P`（四键）',
  readme.includes('| 阵亡 `B/R/T/P` |') && !readme.includes('| 阵亡 `B/R/T` |'));
ok('README 阵亡行含 P 存档口径（v22.93）', readme.includes('阵亡 `B/R/T/P` | 强敌战败后 `B` 重整旗鼓') && readme.includes('（**v22.93**——战败复盘屏'));
ok('README 阵亡行 P 口径与 dead.onKey 同源（saveGame / 清 S.unsaved）',
  readme.includes('同走 `saveGame`') && readme.includes('成功即清 `S.unsaved`'));
ok('README 阵亡行 P 口径与 pauseSaveHint 同读一份源（未存档橙行文案）',
  readme.includes('按 P 写入槽 N（已有存档，将覆盖/空槽）') && readme.includes('pauseSaveHint'));
ok('README 阵亡行保留 v23.79 📍 阵亡地点历史口径（零回归）',
  readme.includes('v23.79 起阵亡画面战绩行常显「📍 阵亡地点」'));

// —— README 快速上手表其余 18 行按键行零回归（行头逐行存在）——
const keyRows = [
  '| `W A S D` / 方向键 |', '| `Enter` / `E` |', '| `Esc` |', '| `P` |', '| `F` |',
  '| `I` |', '| `J` |', '| `B` |', '| `C` |', '| `T` |', '| `H` |', '| `M` |',
  '| `[` / `]` |', '| 标题 `1/2/3` |', '| 创建页 `←→`/`↑↓` |',
  '| 胜利画面 Enter/E/P/R |', '| 战斗中 `↑↓` |',
];
ok('README 快速上手表其余 17 行按键行零回归（行头逐行存在）',
  keyRows.every((r) => readme.includes(r)), keyRows.filter((r) => !readme.includes(r)).join(','));

// —— 运行期：pauseSaveHint 纯函数四档精确（与死屏/暂停菜单同读一份源）——
{
  const { pauseSaveHint } = await import('../js/view/menus.js');
  const hero = { name: '余烬', level: 1, gold: 30 };
  ok('pauseSaveHint 未存档+空槽：⚠️ 未存档 · 按 P 写入槽 2（空槽）',
    pauseSaveHint(hero, true, 2, false) === '⚠️ 未存档 · 按 P 写入槽 2（空槽）',
    String(pauseSaveHint(hero, true, 2, false)));
  ok('pauseSaveHint 未存档+有档：⚠️ 未存档 · 按 P 写入槽 1（已有存档，将覆盖）',
    pauseSaveHint(hero, true, 1, true) === '⚠️ 未存档 · 按 P 写入槽 1（已有存档，将覆盖）',
    String(pauseSaveHint(hero, true, 1, true)));
  ok('pauseSaveHint 已存档：零提示（null）', pauseSaveHint(hero, false, 1, true) === null);
  ok('pauseSaveHint 无冒险：零提示（null）', pauseSaveHint(null, true, 1, false) === null);
}

// —— 死屏/入口源码零回归：drawDead 按键行与未存档橙行、dead.onKey P 分支 ——
ok('drawDead 按 R 行源码零回归（y=332）', menus.includes("text('按 R 重新开始本次冒险',CV.width/2,332"));
ok('drawDead 按 T 行源码零回归（y=362）', menus.includes("text('按 T 返回标题画面',CV.width/2,362"));
ok('drawDead 按 B 行源码零回归（y=392）', menus.includes("text('按 B 重整旗鼓，再战强敌！',CV.width/2,392"));
ok('drawDead 未存档橙行源码零回归（pauseSaveHint 派生 y=412）',
  menus.includes('pauseSaveHint(hero, S.unsaved, S.curSaveSlot, hasSlot(S.curSaveSlot))') &&
  menus.includes('text(deadHint, 320, 412'));
ok('main.js dead.onKey P→saveGame 分支源级落位（与 world/win P 同款唯一入口）',
  main.includes("e.key === 'p' || e.key === 'P'") && main.includes('saveGame(); return;') &&
  /dead: \{[\s\S]*?P[\s\S]*?saveGame\(\); return;/.test(main));
ok('main.js dead.onKey R/T/B 三分支零回归', main.includes("e.key === 'r' || e.key === 'R'") &&
  main.includes("e.key === 't' || e.key === 'T'") && main.includes("e.key === 'b' || e.key === 'B'"));

// —— README / package.json / CHANGELOG 同步 ——
const testChain = (JSON.parse(pkg).scripts.test.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 217 件套', testChain === 222, String(testChain));
ok('package.json 已收录 smoke_v2393_deadkey（npm test 串跑第 217 份）',
  JSON.parse(pkg).scripts.test.includes('smoke_v2393_deadkey.mjs'));
ok('package.json 串尾为 ... smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs && node tests/smoke_v2395_shopscroll.mjs && node tests/smoke_v2396_steelarmor.mjs && node tests/smoke_v2397_baserow.mjs && node tests/smoke_v2398_econrow.mjs"',
  pkg.includes('node tests/smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs && node tests/smoke_v2395_shopscroll.mjs && node tests/smoke_v2396_steelarmor.mjs && node tests/smoke_v2397_baserow.mjs && node tests/smoke_v2398_econrow.mjs"'));
ok('README tests 树串尾已延伸至 smoke_v2393_deadkey',
  readme.includes('+ smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow（npm test 串跑）'));
ok('README 件套口径为二百二十二件套（二百二十一件套清除）且旧 214 口径零残留',
  readme.includes('冒烟二百二十二件套（二百二十一件套清除）') && !readme.includes('冒烟二百一十四件套（二百一十三件套清' + '除）'));
ok('README 含 v23.93 守护描述（阵亡行 P 存档口径守护）',
  readme.includes('v23.93 起含 README 快速上手表「阵亡」行 P 存档口径守护'));
ok('README 含 smoke_v2393_deadkey 入库（217 份）', readme.includes('smoke_v2393_deadkey 入库（217 份）'));
ok('README 仍保留 v23.92 历史守护描述与入库口径（历史累积）',
  readme.includes('v23.92 起含 新武器「星铁剑」守护') && readme.includes('smoke_v2392_stariron 入库（216 份）'));
ok('CHANGELOG 顶部已追加 v23.93 条目（阵亡行 P 口径）', changelog.startsWith('## v23.98 '));
ok('CHANGELOG 顶部条目含阵亡行 P 说明', changelog.includes('README 快速上手表「阵亡」行补 P 存档'));
ok('CHANGELOG 仍保留 v23.92 条目标题（历史口径）', changelog.includes('## v23.92 新武器「星铁剑」'));

// —— 哨兵链：v2143 前哨前望 218 且 README 尚无 218 口径 ——
const s2143 = read('tests/smoke_v2143_talkekey.mjs');
ok('smoke_v2143 哨兵链已推进至二百二十三件套（二百二十二件套清除）',
  s2143.includes('二百二十三件套（二百二十二件套清除）') && s2143.includes("!readme.includes('二百二十三件套（二百二十二件套清除）')"));
ok('README 尚无二百二十三件套（二百二十二件套清除）前望口径', !readme.includes('二百二十三件套（二百二十二件套清除）'));

// —— 旧代 v23.92 pin 全库零残留（不含本件；拆串防误伤，承 v2319/v2392 惯例）——
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2393_deadkey.mjs');
const stale = [];
for (const f of allTests) {
  const src = read('tests/' + f);
  if (src.includes("const GAME_VERSION = 'v23.9" + "2';") ||
      src.includes("GAME_VERSION === 'v23.9" + "2'") ||
      src.includes("startsWith('## v23.9" + "2 ") ||
      src.includes("startsWith('## v23.9" + "2'")) stale.push(f);
}
ok('旧代 v23.92 字面量/恒等/顶 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.92 特性标签保留）',
  stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
