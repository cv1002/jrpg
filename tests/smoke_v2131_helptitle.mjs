// v21.31 专项冒烟：帮助页面板标题随页切换——drawHelp 此前把标题硬编码「— 操作说明 —」，
// 翻到第 2/3/4 页（地图指南/魔物状态/试炼进阶）时面板标题仍是「操作说明」，标题与页内容脱节
// （信息透明主线（v19.59 页长自适应 / v21.11 行宽巡检同族）在帮助页标题上的最后一处漏网）。
// 本版新增 data.js HELP_TITLES（四页标题单一数据源，与 HELP_PAGES 一一对应），drawHelp 改读
// HELP_TITLES[S.helpPage]。纯显示零结算：未动任何行内容/行数/页脚/翻页逻辑/README 既有口径之外
// 的游戏逻辑。承 v21.10 起冒烟入库先例（仓库常驻版）。
import { S } from '../js/state.js';
import { GAME_VERSION, HELP_PAGES, HELP_TITLES } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.30 冒烟先例：先装桩再 import main.js；ctx 记录所有 fillText）——
const drawn = [];
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
    fillText: (t) => { drawn.push(String(t)); },
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

console.log('— v21.31 帮助页面板标题随页切换 冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.30 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.30', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 31)));
ok("data.js GAME_VERSION 已越过 v21.31（版本锚点去硬化——v21.7 惯例：精确值由当前版本冒烟守护）",
  !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 32)), GAME_VERSION);

// —— 数据层：HELP_TITLES 与 HELP_PAGES 一一对应 ——
ok('HELP_TITLES 已导出且为数组', Array.isArray(HELP_TITLES) && HELP_TITLES.length === HELP_PAGES.length,
  `${HELP_TITLES && HELP_TITLES.length}/${HELP_PAGES.length}`);
ok('四页标题逐字为 操作说明/地图指南/魔物状态/试炼进阶',
  JSON.stringify(HELP_TITLES) === JSON.stringify(['操作说明', '地图指南', '魔物状态', '试炼进阶']), JSON.stringify(HELP_TITLES));
ok('标题无重复（与页一一对应）', new Set(HELP_TITLES).size === HELP_TITLES.length);

// —— 源级落位：drawHelp 已改读 HELP_TITLES[S.helpPage]，旧硬编码清零 ——
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mSrc = fs.readFileSync(path.join(ROOT, 'js/view/menus.js'), 'utf8');
ok("menus.js 已 import HELP_TITLES", mSrc.includes('HELP_TITLES'));
ok("drawHelp 面板标题读 HELP_TITLES[S.helpPage]（含兜底 '操作说明'）",
  mSrc.includes("HELP_TITLES[S.helpPage] || '操作说明'"));
ok("旧硬编码 '— 操作说明 —' 字面量已从 drawHelp 移除", !mSrc.includes("panel(70,28,500,424,'— 操作说明 —')"));
ok('menus.js 含 v21.31 注释（标题随页切换说明）', mSrc.includes('v21.31'));
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.31 注释与 HELP_TITLES 定义', dSrc.includes('v21.31') && dSrc.includes('const HELP_TITLES'));

// —— 运行期实证：四页逐一渲染，面板标题随页变化，页数/页脚/内容行零回归 ——
const PAGE_TITLES = ['— 操作说明 —', '— 地图指南 —', '— 魔物状态 —', '— 试炼进阶 —'];
const PAGE_COUNTS = [14, 7, 10, 10]; // v21.11/v21.23/v21.25/v21.27 巡检行数；v21.72 第 4 页新增「记忆碎片」行 9→10（见 smoke_v2172_helpfrag）；v22.37 第 2 页新增小地图图例两行 5→7（见 smoke_v2237_minimaplegend）
try {
  for (let p = 0; p < HELP_PAGES.length; p++) {
    S.helpPage = p;
    drawn.length = 0;
    drawHelp();
    const title = PAGE_TITLES[p];
    ok(`第 ${p + 1} 页（${HELP_TITLES[p]}）面板标题为「${title}」`, drawn.includes(title),
      drawn.filter((t) => t.startsWith('— ')).slice(0, 5).join(' | '));
    ok(`第 ${p + 1} 页仍绘页脚「第 ${p + 1}/${HELP_PAGES.length} 页」`,
      drawn.some((t) => t.includes(`第 ${p + 1}/${HELP_PAGES.length} 页`)));
    // 页长自适应（v19.59）：14 行页走 25px 档、短页走 34px 档——只读不改，行数不变则档位不变
    ok(`第 ${p + 1} 页行数仍为 ${PAGE_COUNTS[p]}`,
      HELP_PAGES[p].length === PAGE_COUNTS[p], `实际 ${HELP_PAGES[p].length}`);
  }
} finally {
  S.helpPage = 0;
}
// —— 零回归：帮助页行内容逐字未动（关键词抽样，防误改行；r[0] 为拼接标签（如「星井矿脉 Lv.6」）故用 includes）——
const keys = [
  [0, '对话 / 确认'], [0, '存档槽'],
  [1, '星井矿脉'], [1, '通关之路'],
  [2, '战斗掉落'], [2, '魔物强度'],
  [3, '试炼三连战'], [3, '终焉之神'],
];
ok('帮助页既有行关键词全在（零回归抽样）',
  keys.every(([pg, k]) => HELP_PAGES[pg].some((r) =>
    String(r[0]).includes(k) || String(r[1]).includes(k))));

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README 已同步（tests 树收录 smoke_v2131_helptitle + 冒烟/件套口径存在；件数去硬化——v21.7 惯例：实件数由后续版本冒烟守护）',
  readme.includes('smoke_v2131_helptitle') && readme.includes('冒烟') && readme.includes('件套'));
ok('package.json 已收录 smoke_v2131_helptitle（npm test 串跑第 27 份）',
  pkg.includes('smoke_v2131_helptitle.mjs'));
const s2130 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2130_tutor.mjs'), 'utf8');
ok('smoke_v2130 的 README 守护表达式已去硬化（v21.7 惯例：不再以「二十六件套」断言件数，实件数由本版冒烟守护）',
  s2130.includes("includes('冒烟')") && s2130.includes("includes('件套')") && !s2130.includes("includes('二十六件套')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
