// v23.94 专项冒烟：帮助页「试炼进阶」重整旗鼓行补 P 存档口径（体验打磨·可发现性·纯文字——承 v23.93
// README 快速上手表「阵亡」行 P 存档口径同一「saveGame 全出口」口径主线：v22.93 让阵亡复盘屏拥有
// 「P 先落盘再决定 B/R/T」的第四键（main.js dead.onKey P→saveGame + 未存档橙行 pauseSaveHint），
// v23.93 刚把它补进 README 速查表「阵亡」行——而战前知识中枢（H 页四页，v21.14 确立）介绍死屏按键的
// 「重整旗鼓」行（data.js HELP_PAGES[3]）仍只写「B 原地再战；R 重开 · T 回标题」，与 README 速查表
// v23.93 修复前同一缺口形态（P 是死屏唯一能「先落盘再决定 B/R/T」的键）；现按 v23.88 快速旅行行
// 同句式补「 · P 存档（v22.93·未存档橙行提示）」（与 dead.onKey 逐字同源、与 pauseSaveHint 未存档
// 提示同读一份源；14px estW 255→462 ≤470 面板预算、行数不变仍 10、r[2] 数不变仍 2、末行基线不变）。
// 本冒烟守护：版本锚点、data.js 源级落位（v23.94 注释 / GAME_VERSION v23.94 与旧 v23.93 字面量零残留）、
// HELP_PAGES[3] 重整旗鼓行运行期精确（r[1] 逐字 + estW ≤470 + 行数 10 + r[2] 数 2 不变）、
// main.js dead.onKey P 分支源级零回归、menus.js pauseSaveHint 运行期四档精确（与死屏同读一份源）、
// README/package.json/CHANGELOG 同步（tests 树串尾 + 件套口径 218 + v23.94 守护描述 + 入库 218）、
// 哨兵链（v2143 前望 219 且 README 尚无 219 口径）、旧代 v23.93 pin 全库零残留扫描。
import { S } from '../js/state.js';
import { GAME_VERSION } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v23.93 冒烟先例：先装桩再 import main.js）——
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

console.log('— v23.94 帮助页「试炼进阶」重整旗鼓行补 P 存档口径 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');
const menus = read('js/view/menus.js');
const main = read('js/main.js');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v23.93 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v23.93', !!_gv && (_gv[0] > 23 || (_gv[0] === 23 && _gv[1] > 93)), GAME_VERSION);
ok('data.js 含 v23.94 注释（文档整理·口径收口说明）', dSrc.includes('v23.94 文档整理·口径收口'));
ok('data.js GAME_VERSION 字面量已为 v23.94（旧 v23.93 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v23.95';") && !dSrc.includes("const GAME_VERSION = 'v23.9" + "3';"));
ok('data.js 仍保留 v23.93 历史注释（README 速查表「阵亡」行 P 口径说明，累积注释块）',
  dSrc.includes('v23.93 文档整理·口径收口（README 快速上手表「阵亡」行补 P 存档口径'));

// —— HELP_PAGES[3] 重整旗鼓行源级落位 ——
ok('data.js 重整旗鼓行已补 P 存档口径（源级逐字）',
  dSrc.includes("['重整旗鼓','被强敌击败后按 B 原地再战；R 重开 · T 回标题 · P 存档（先落盘再决定）']"));
ok('data.js 重整旗鼓行 v23.94 行内注释已落位', dSrc.includes('v23.94 重整旗鼓行补 P 存档口径'));

// —— 运行期：HELP_PAGES[3] 精确 ——
{
  const { HELP_PAGES } = await import('../js/data.js');
  const page3 = HELP_PAGES[3];
  ok('帮助页仍 4 页（操作/地图指南/魔物状态/试炼进阶）', HELP_PAGES.length === 4);
  ok('试炼进阶页行数仍 10（补 P 口径不增行）', page3.length === 10, String(page3.length));
  const row = page3.find((r) => r[0] === '重整旗鼓');
  ok('重整旗鼓行存在', !!row);
  ok('重整旗鼓行 r[1] 逐字精确（B 原地再战；R 重开 · T 回标题 · P 存档（先落盘再决定））',
    row && row[1] === '被强敌击败后按 B 原地再战；R 重开 · T 回标题 · P 存档（先落盘再决定）',
    row && row[1]);
  ok('重整旗鼓行 r[1] 不再是无 P 旧文（裸键消除）', row && !row[1].includes('T 回标题\u0027'));
  const r2count = page3.filter((r) => r[2]).length;
  ok('试炼进阶页 r[2] 数仍 2（未新增次行）', r2count === 2, String(r2count));
  ok('其余 6 行关键词零回归（试炼碑/双徽记/试炼三连战/快旅/蘑菇宝箱/记忆碎片）',
    ['试炼碑位置', '双徽记条件', '试炼三连战', '快速旅行', '蘑菇宝箱', '记忆碎片'].every((k) => !!page3.find((r) => r[0] === k)));

  // —— 行宽预算（smoke_v2111 同款 estW：14px 从 x=100，面板右缘 570 → 上限 470）——
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
  const w = estW('重整旗鼓   ', 14) + estW(row[1], 14);
  ok('重整旗鼓行 全行 estW（r[0]+3空格+r[1]，新版标定）≈459 ≤ 470 面板预算', w <= 470, String(Math.round(w)));
  // 旧版 estW（smoke_v2120/v2123/v2127/v2172 口径，· 按 0.55em 粗估）亦须 ≤470（双口径并守）
  const estWold = (s, size) => {
    let wsum = 0;
    for (const ch of String(s || '')) {
      const code = ch.codePointAt(0);
      const wide = (code >= 0x2e80 && code <= 0x9fff) || (code >= 0x3000 && code <= 0x303f) || (code >= 0xff00 && code <= 0xffef) || code >= 0x1f000;
      if (wide) wsum += 0.865 * size;
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
  const wo = estWold('重整旗鼓   ', 14) + estWold(row[1], 14);
  ok('重整旗鼓行 全行 estW（旧版口径）≈466 ≤ 470 面板预算', wo <= 470, String(Math.round(wo)));
}

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
  ok('pauseSaveHint 措辞含「按 P 写入槽 N」（与重整旗鼓行 P 口径同源）',
    pauseSaveHint(hero, true, 2, false).includes('按 P 写入槽'));
}

// —— 死屏入口源码零回归：drawDead 按键行、dead.onKey P/R/T/B 分支 ——
ok('drawDead 按 R 行源码零回归（y=332）', menus.includes("text('按 R 重新开始本次冒险',CV.width/2,332"));
ok('drawDead 按 T 行源码零回归（y=362）', menus.includes("text('按 T 返回标题画面',CV.width/2,362"));
ok('drawDead 按 B 行源码零回归（y=392）', menus.includes("text('按 B 重整旗鼓，再战强敌！',CV.width/2,392"));
ok('main.js dead.onKey P→saveGame 分支源级零回归（与 README/重整旗鼓行同源）',
  main.includes("e.key === 'p' || e.key === 'P'") && main.includes('saveGame(); return;') &&
  /dead: \{[\s\S]*?P[\s\S]*?saveGame\(\); return;/.test(main));
ok('main.js dead.onKey R/T/B 三分支零回归', main.includes("e.key === 'r' || e.key === 'R'") &&
  main.includes("e.key === 't' || e.key === 'T'") && main.includes("e.key === 'b' || e.key === 'B'"));

// —— README / package.json / CHANGELOG 同步 ——
const testChain = (JSON.parse(pkg).scripts.test.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 218 件套', testChain === 219, String(testChain));
ok('package.json 已收录 smoke_v2394_fightback（npm test 串跑第 218 份）',
  JSON.parse(pkg).scripts.test.includes('smoke_v2394_fightback.mjs'));
ok('package.json 串尾为 ... smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs && node tests/smoke_v2395_shopscroll.mjs"',
  pkg.includes('node tests/smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs && node tests/smoke_v2395_shopscroll.mjs"'));
ok('README tests 树串尾已延伸至 smoke_v2394_fightback',
  readme.includes('+ smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll（npm test 串跑）'));
ok('README 件套口径为二百一十九件套（二百一十八件套清除）且旧 214 口径零残留',
  readme.includes('冒烟二百一十九件套（二百一十八件套清除）') && !readme.includes('冒烟二百一十四件套（二百一十三件套清' + '除）'));
ok('README 含 v23.94 守护描述（重整旗鼓行 P 存档口径守护）',
  readme.includes('v23.94 起含 帮助页「试炼进阶」重整旗鼓行 P 存档口径守护'));
ok('README 含 smoke_v2394_fightback 入库（218 份）', readme.includes('smoke_v2394_fightback 入库（218 份）'));
ok('README 仍保留 v23.93 历史守护描述与入库口径（历史累积）',
  readme.includes('v23.93 起含 README 快速上手表「阵亡」行 P 存档口径守护') &&
  readme.includes('smoke_v2393_deadkey 入库（217 份）'));
ok('CHANGELOG 顶部已追加 v23.94 条目（重整旗鼓行 P 口径）', changelog.startsWith('## v23.95 '));
ok('CHANGELOG 顶部条目含重整旗鼓行 P 说明', changelog.includes('帮助页「试炼进阶」重整旗鼓行补 P 存档'));
ok('CHANGELOG 仍保留 v23.93 条目标题（历史口径）', changelog.includes('## v23.93 文档整理·口径收口：README 快速上手表「阵亡」行补 P 存档'));

// —— README 快速上手表 v23.93 口径零回归（本版未动它）——
ok('README 阵亡行头仍为 `阵亡 B/R/T/P`（v23.93 零回归）', readme.includes('| 阵亡 `B/R/T/P` |'));

// —— 哨兵链：v2143 前哨前望 219 且 README 尚无 219 口径 ——
const s2143 = read('tests/smoke_v2143_talkekey.mjs');
ok('smoke_v2143 哨兵链已推进至二百二十件套（二百一十九件套清除）',
  s2143.includes('二百二十件套（二百一十九件套清除）') && s2143.includes("!readme.includes('二百二十件套（二百一十九件套清除）')"));
ok('README 尚无二百二十件套（二百一十九件套清除）前望口径', !readme.includes('二百二十件套（二百一十九件套清除）'));

// —— 旧代 v23.93 pin 全库零残留（不含本件；拆串防误伤，承 v2319/v2392/v2393 惯例）——
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2394_fightback.mjs');
const stale = [];
for (const f of allTests) {
  const src = read('tests/' + f);
  if (src.includes("const GAME_VERSION = 'v23.9" + "3';") ||
      src.includes("GAME_VERSION === 'v23.9" + "3'") ||
      src.includes("startsWith('## v23.9" + "3 ") ||
      src.includes("startsWith('## v23.9" + "3'")) stale.push(f);
}
ok('旧代 v23.93 字面量/恒等/顶 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.93 特性标签保留）',
  stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
