// v21.72 专项冒烟：帮助页「试炼进阶」补「记忆碎片」行（信息透明·H 页战前知识中枢收口，
// 承 v21.2 精英出没 / v21.15 高级灵药配方 / v21.23 三 Boss 机制预览同主线）——记忆碎片系统
// （data.js FRAGMENTS：四枚强敌首胜掉落，集齐触发真结局「全记忆」加页）此前在 H 页四页
// 查无一行，玩家通关前无从知晓「强敌首胜会掉记忆、集齐有真结局差分」。
// 本冒烟守护：版本锚点、data.js 注释与新行源级落位（索引 6 = 蘑菇宝箱之后/三 Boss 之前）、
// 枚数由 FRAGMENTS.length 派生零裸字面量、末行金色收尾仍是终焉之神、行数 9→10（≤10 保
// sp=34 档）、r[2] 数仍 2、全页行宽 estW ≤470、页长派生预算（末行基线 402、其 r[2] 420
// 不触页脚 452）、运行期 drawHelp 四页真实渲染（新行 (100,300) 普通色 / 终焉之神 (100,402)
// 金色 / 页脚 (320,452) 零回归）、README/package.json 同步、smoke_v2171 件套断言去硬化确认、
// 六件旧冒烟（v2120/v2123/v2125/v2127/v2128/v2146）9→10 与 smoke_v2131 PAGE_COUNTS
// [14,5,10,9]→[14,5,10,10] 随新现实更新确认。
import { S } from '../js/state.js';
import { GAME_VERSION, HELP_PAGES, HELP_TITLES, FRAGMENTS } from '../js/data.js';
import { CTX } from '../js/view/canvas.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v21.71 冒烟先例：先装桩再 import main.js）——
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
const { drawHelp } = await import('../js/view/index.js');

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
const LINE_MAX = 470;   // 570 - 100（面板右缘 - 起点）

console.log('— v21.72 帮助页「试炼进阶」记忆碎片行 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.71 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.71', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 72)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.72 注释（帮助页「试炼进阶」补「记忆碎片」行说明）',
  dSrc.includes('v21.72 体验打磨：帮助页「试炼进阶」补「记忆碎片」行'));

// —— 结构守护：页数 / 行数 / 落位 / 末行金色口径 ——
ok('帮助页仍 4 页（操作/地图指南/魔物状态/试炼进阶）', HELP_PAGES.length === 4);
ok('HELP_TITLES 仍 4 枚与 HELP_PAGES 一一对应', HELP_TITLES.length === 4);
const page3 = HELP_PAGES[3];
ok('试炼进阶页 10 行（原 9 行 + v21.72 记忆碎片 1 行，仍 ≤10 保持 sp=34 档）', page3.length === 10, `实际 ${page3.length}`);
ok('其余三页行数未动（操作 14 / 地图指南 5 / 魔物状态 10）',
  HELP_PAGES[0].length === 14 && HELP_PAGES[1].length === 5 && HELP_PAGES[2].length === 10);
ok('记忆碎片行落位索引 6（蘑菇宝箱之后、三 Boss 机制行之前）',
  page3[5] && page3[5][0] === '蘑菇宝箱' && page3[6] && page3[6][0] === '记忆碎片' &&
  page3[7] && page3[7][0] === '幽冥魔王' && page3[8] && page3[8][0] === '洞窟领主' && page3[9] && page3[9][0] === '终焉之神');
const fragRow = page3[6];
ok('记忆碎片行无 r[2]（单行追加，本页 r[2] 数仍 2：试炼三连战/终焉之神）',
  fragRow.length === 2 && page3.filter((r) => r[2]).length === 2);
ok('末行仍是终焉之神（drawHelp 末行金色收尾口径不变）', page3[page3.length - 1][0] === '终焉之神');

// —— 新行内容与单一数据源派生 ——
ok('记忆碎片行逐字口径（强敌首胜各掉一枚 · 集齐 N 枚真结局追加全记忆页 · J 日志回看）',
  fragRow[1] === '强敌首胜各掉一枚 · 集齐 ' + FRAGMENTS.length + ' 枚真结局追加全记忆页 · J 日志回看', fragRow[1]);
ok('枚数由 FRAGMENTS.length 派生（零裸字面量，源级表达式落位）',
  dSrc.includes("'强敌首胜各掉一枚 · 集齐 ' + FRAGMENTS.length + ' 枚真结局追加全记忆页 · J 日志回看'"));
ok('FRAGMENTS 契约：4 枚、掉落对象为 石心魔像/幽冥魔王/洞窟领主/终焉之神（强敌首胜）',
  FRAGMENTS.length === 4 &&
  FRAGMENTS.map((f) => f.enemy).join('/') === '石心魔像/幽冥魔王/洞窟领主/终焉之神');
const bSrc = fs.readFileSync(path.join(ROOT, 'js/battle.js'), 'utf8');
ok('碎片掉落报文「按 J 日志回看」口径零回归（battle.js，与帮助行同口径）', bSrc.includes('按 J 日志回看'));

// —— 行宽与页长派生预算 ——
const wNew = estW(fragRow[0] + '   ', 14) + estW(fragRow[1], 14);
ok('记忆碎片行估算宽 ≤470（14px 主行 x=100，面板右缘 570）', wNew <= LINE_MAX, `≈${wNew.toFixed(1)}`);
let allOk3 = true;
page3.forEach((r) => {
  const w = estW(r[0] + '   ', 14) + estW(r[1], 14);
  if (w > LINE_MAX) { allOk3 = false; console.log('    <- 越界行:', r[0], Math.round(w)); }
  if (r[2] && estW(r[2], 12) > LINE_MAX) { allOk3 = false; console.log('    <- r2越界:', r[0]); }
});
ok('试炼进阶页全部行估算宽 ≤470（含 v21.72 新增行）', allOk3);
const sp = page3.length > 10 ? 25 : 34;
const yLast = 80 + (page3.length - 1) * sp + page3.slice(0, -1).filter((r) => r[2]).length * 16;
ok('页长派生：sp=34 档且末行（终焉之神）基线 402、其 r[2] 420 ≤440（页脚 452 前留白）',
  sp === 34 && yLast === 402 && yLast + 18 <= 440, `sp=${sp} yLast=${yLast}`);

// —— 运行期实证：drawHelp 四页真实渲染 + 新行/末行/页脚落位 ——
const origHelpPage = S.helpPage;
let drawnCalls = [];
const origFill = CTX.fillText.bind(CTX);
CTX.fillText = (t, x, y) => { drawnCalls.push({ t: String(t), x, y, style: CTX.fillStyle }); };
try {
  S.helpPage = 3;
  drawnCalls.length = 0;
  let threw = null;
  try { drawHelp(); } catch (e) { threw = e; }
  ok('drawHelp 第 4 页（试炼进阶）渲染不抛错', threw === null, threw && String(threw.stack || threw));
  const fragCall = drawnCalls.find((c) => c.t.startsWith('记忆碎片'));
  ok('运行期：记忆碎片行真实落位 (100,300) 普通色 #e8eef1（非末行不镀金）',
    !!fragCall && fragCall.x === 100 && fragCall.y === 300 && fragCall.style === '#e8eef1',
    fragCall && `${fragCall.x},${fragCall.y},${fragCall.style}`);
  ok('运行期：记忆碎片行文本含派生枚数「集齐 ' + FRAGMENTS.length + ' 枚」与「J 日志回看」',
    !!fragCall && fragCall.t.includes('集齐 ' + FRAGMENTS.length + ' 枚') && fragCall.t.includes('J 日志回看'), fragCall && fragCall.t);
  const trueCall = drawnCalls.find((c) => c.t.startsWith('终焉之神'));
  ok('运行期：终焉之神行落位 (100,402) 金色 #ffd24a（末行收尾零回归）',
    !!trueCall && trueCall.x === 100 && trueCall.y === 402 && trueCall.style === '#ffd24a',
    trueCall && `${trueCall.x},${trueCall.y},${trueCall.style}`);
  const bossCall = drawnCalls.find((c) => c.t.startsWith('幽冥魔王'));
  ok('运行期：幽冥魔王行随新行下移落位 (100,334)（+34px 移位实证）',
    !!bossCall && bossCall.x === 100 && bossCall.y === 334, bossCall && `${bossCall.x},${bossCall.y}`);
  const footCall = drawnCalls.find((c) => c.t.includes('第 4/4 页'));
  ok('运行期：页脚「第 4/4 页 · ←/→ 翻页(A/D亦可) · H/Esc 关闭」落位 (320,452) 零回归',
    !!footCall && footCall.x === 320 && footCall.y === 452 && footCall.t.includes('H/Esc 关闭'), footCall && footCall.t);
  // 其余三页渲染不抛错（新行不影响他页）
  for (const p of [0, 1, 2]) {
    S.helpPage = p;
    let threwP = null;
    try { drawHelp(); } catch (e) { threwP = e; }
    ok(`drawHelp 第 ${p + 1} 页渲染不抛错（其余三页零回归）`, threwP === null, threwP && String(threwP.stack || threwP));
  }
} finally {
  CTX.fillText = origFill;
  S.helpPage = origHelpPage;
}

// —— README / package.json / 既有冒烟更新 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2172_helpfrag', readme.includes('smoke_v2172_helpfrag'));
ok('README 件套口径为六十八件套（六十七件套清除）', readme.includes('六十八件套（六十七件套清除）'));
ok('README 含 v21.72 守护描述（帮助页「试炼进阶」记忆碎片行守护）',
  readme.includes('v21.72 起含帮助页「试炼进阶」记忆碎片行守护'));
ok('package.json 已收录 smoke_v2172_helpfrag（npm test 串跑第 68 份）',
  pkg.includes('smoke_v2172_helpfrag.mjs'));
const s2171 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2171_journalikey.mjs'), 'utf8');
ok('smoke_v2171 的 README 件套口径断言已去硬化（存活性口径落位，旧精确表达式零残留）',
  s2171.includes("!readme.includes('（六十六件套清除）')") &&
  !s2171.includes("readme.includes('六十七件套（六十六件套清除）')"));
// 六件旧冒烟 9→10 随新现实更新（承 v21.23 更新 v2120 同款先例：旧精确行数 pin 零残留）
const oldPins = [
  ['smoke_v2120_helprush.mjs', 'page3.length === 9'],
  ['smoke_v2123_bosshelp.mjs', 'page3.length === 9'],
  ['smoke_v2125_rushreward.mjs', 'page3.length === 9'],
  ['smoke_v2127_stelenpc.mjs', 'page3.length === 9'],
  ['smoke_v2146_trialrec.mjs', 'page3.length === 9'],
  ['smoke_v2128_mapstele.mjs', 'HELP_PAGES[3].length === 9'],
  ['smoke_v2131_helptitle.mjs', '[14, 5, 10, 9]'],
];
for (const [f, pin] of oldPins) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  ok(`${f} 旧「9 行」pin 已随新现实更新（零残留）`, !src.includes(pin));
}

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
