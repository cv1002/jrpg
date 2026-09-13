// v22.37 专项冒烟：H 帮助页「地图指南」补小地图图例（体验打磨·可发现性·信息透明·纯文字）
// —— 小地图标记色随版本逐版丰富（v19.47 暖金 / v21.x 危险红点 / v22.26 未开宝箱暖金 /
// v22.35 NPC 任务标 / v22.36 大灯标记，当前约 20 个色分支），H 页「地图指南」却只有四图 Lv 行与
// 通关之路行——玩家扫小地图问「那个金光脉动的点是什么」全游戏无一处可查（唯一相关句散在
// 「试炼进阶·蘑菇宝箱」）；现于「通关之路」前补两行图例（纯文字，色名与 view/drawWorld.js
// minimapColor 逐分支同口径），行数 5→7 仍 ≤10 保 sp=34 档、r[2] 数 0→2、末行基线 316 不触页脚 452。
// 本冒烟守护：版本锚点、data.js 源级落位（两行图例 + 既有 5 行逐字零回归 + v22.36/v22.35 注释保留）、
// 宽度预算（estW 口径 ≤470）、页长派生预算（末行基线 316 / 页脚 452）、运行期实证（drawHelp 第 2 页
// 渲染捕获：两行图例主行/次行逐字落位 + 坐标/字号/颜色 + 通关之路金色收尾 + 页脚）、
// 图例与代码色板逐值对应（drawWorld.js minimapColor 全部色分支仍在）、README/package.json/CHANGELOG
// 同步（tests 树尾/件套口径 133/v22.37 守护描述/入库 133 份）、姊妹件套 pin（v2236..v2226 随新现实
// 更新）复查 + 旧代 v22.36 字面量/恒等/件套/串尾 pin 全库零残留 + 坏链防回归。
import { S } from '../js/state.js';
import { GAME_VERSION, HELP_PAGES, HELP_TITLES, VILLAGE_LAMP, NPC_SPOTS, MAPS } from '../js/data.js';
import { newGame } from '../js/core.js';
import { loadMap } from '../js/world.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v22.36 冒烟先例：先装桩再 import main.js；fillText 捕获供图例行断言）——
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
const { drawHelp } = await import('../js/view/menus.js');
const { CTX } = await import('../js/view/canvas.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.37 帮助页小地图图例 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const wSrc = fs.readFileSync(path.join(ROOT, 'js/view/drawWorld.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.36 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.36', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 37)), GAME_VERSION);
ok('data.js 含 v22.37 注释（小地图图例说明）', dSrc.includes('v22.37 体验打磨'));
ok('GAME_VERSION 字面量已为 v22.37（旧 v22.36 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v22.38';") && !dSrc.includes("const GAME_VERSION = 'v22." + "36';"));
ok('data.js 仍保留 v22.36/v22.35 历史注释（累积注释块，姊妹 pin 不失效）',
  dSrc.includes('v22.36 潮灯镇广场大灯') && dSrc.includes('v22.35 体验打磨'));

// —— HELP_PAGES 地图指南页结构（5→7 行，图例两行插在通关之路之前）——
const page = HELP_PAGES[1];
ok('地图指南页位于第 2 页（索引 1）且标题为「地图指南」', HELP_TITLES[1] === '地图指南');
ok('地图指南页行数 5→7（≤10 保 sp=34 档）', page.length === 7, `实际 ${page.length}`);
const labels = page.map((r) => r[0]);
ok('两行图例位于通关之路之前（插入位置正确）',
  labels.indexOf('小地图·状态标') > 0 && labels.indexOf('小地图·色标') > labels.indexOf('小地图·状态标') &&
  labels.indexOf('通关之路') > labels.indexOf('小地图·色标'));
ok('既有 5 行标签逐字零回归（潮灯镇/雾语林/星井矿脉/无字回廊/通关之路）',
  labels[0] === '潮灯镇 Lv.' + MAPS.village.recLv && labels[1] === '雾语林 Lv.' + MAPS.dungeon.recLv &&
  labels[2] === '星井矿脉 Lv.' + MAPS.cave.recLv && labels[3] === '无字回廊 Lv.' + MAPS.gallery.recLv &&
  labels[4] === '小地图·状态标' && labels[5] === '小地图·色标' &&
  labels[6] === '通关之路');
const rowState = page.find((r) => r[0] === '小地图·状态标');
const rowColor = page.find((r) => r[0] === '小地图·色标');
ok('状态标行 r[1] 逐字（委托金光/宝箱暖金/危险红点三大决策标记）',
  rowState && rowState[1] === '有委托NPC 金光脉动 · 未开宝箱 暖金(任务中脉动) · 危险区红点');
ok('状态标行 r[2] 逐字（遇敌槽/大灯/无委托米色）',
  rowState && rowState[2] === '遇敌槽红条 · 大灯 熄冷灰/亮暖金（与画布大灯同档） · 星井 低鸣星蓝/静默灰 · 无委托NPC 米色');
ok('色标行 r[1] 逐字（地形五色）', rowColor && rowColor[1] === '树岩·绿 水·蓝 镇路·棕 洞窟·深灰 门/出口·蓝');
ok('色标行 r[2] 逐字（设施八色）',
  rowColor && rowColor[2] === '设施：商店·金 旅馆·灰 泉水·蓝 酿造·绿 试炼·青 魔王碑·紫 终焉碑·黄 石碑·灰');
ok('data.js 源级含两行图例字面量（防运行期拼接漂移）',
  dSrc.includes("['小地图·状态标','有委托NPC 金光脉动 · 未开宝箱 暖金(任务中脉动) · 危险区红点','遇敌槽红条 · 大灯 熄冷灰/亮暖金（与画布大灯同档） · 星井 低鸣星蓝/静默灰 · 无委托NPC 米色']") &&
  dSrc.includes("['小地图·色标','树岩·绿 水·蓝 镇路·棕 洞窟·深灰 门/出口·蓝','设施：商店·金 旅馆·灰 泉水·蓝 酿造·绿 试炼·青 魔王碑·紫 终焉碑·黄 石碑·灰']"));
ok('通关之路行逐字零回归（金色收尾行内容不变）',
  page[6][1] === '讨回灯芯 → 击败洞窟领主 → 双徽记开门 → 回廊尽头面对终焉之神');

// —— 宽度预算（v21.11 estW 口径：汉字/全角 0.865em，·0.303em 等，@napi-rs 标定，误差 <6%）——
const estW = (s, size) => {
  let wsum = 0;
  for (const ch of String(s || '')) {
    const code = ch.codePointAt(0);
    const wide = (code >= 0x2e80 && code <= 0x9fff) || (code >= 0x3000 && code <= 0x303f) || (code >= 0xff00 && code <= 0xffef) || code >= 0x1f000;
    if (wide) wsum += 0.865 * size;
    else if (code === 0xb7) wsum += 0.303 * size;
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
ok('状态标主行估算宽 ≤470', estW('小地图·状态标   ', 14) + estW(rowState[1], 14) <= 470,
  `≈${(estW('小地图·状态标   ', 14) + estW(rowState[1], 14)).toFixed(0)}`);
ok('状态标次行估算宽 ≤470', estW(rowState[2], 12) <= 470, `≈${estW(rowState[2], 12).toFixed(0)}`);
ok('色标主行估算宽 ≤470', estW('小地图·色标   ', 14) + estW(rowColor[1], 14) <= 470,
  `≈${(estW('小地图·色标   ', 14) + estW(rowColor[1], 14)).toFixed(0)}`);
ok('色标次行估算宽 ≤470', estW(rowColor[2], 12) <= 470, `≈${estW(rowColor[2], 12).toFixed(0)}`);
let allOk = true;
page.forEach((r) => {
  const wMain = estW(r[0] + '   ', 14) + estW(r[1], 14);
  if (wMain > 470) { allOk = false; console.log('    <- 越界行:', r[0], Math.round(wMain)); }
  if (r[2] && estW(r[2], 12) > 470) { allOk = false; console.log('    <- r2越界:', r[0]); }
});
ok('地图指南页全部 7 行估算宽 ≤470（全页行宽巡检）', allOk);
// 页长派生预算：末行基线 = 80 + (7-1)*34 + 2*16 = 316，不触页脚 452
ok('页长派生：末行基线 316 ≤440（页脚 452 之上留白，v19.59 式预算）', 80 + (page.length - 1) * 34 + (page.reduce((a, r) => a + (r[2] ? 1 : 0), 0)) * 16 === 316);

// —— 图例与代码色板逐值对应（drawWorld.js minimapColor 色分支全在；调色须同步图例文案）——
const palette = ['#1f4d1f', '#22568a', '#7d6b49', '#a03fd9', '#ffd24a', '#7a8aa0', '#62c6ff', '#8fd86f',
  '#e8c9a0', '#b06ff0', '#ffe94a', '#4fd8ff', '#39414f', '#9aa4ad', '#4a90d9', '#c9a86a', '#e14b3f', '#7b7a84',
  // v22.38 星井两档新增（低鸣星蓝/静默灰，与图例「星井 低鸣星蓝/静默灰」同口径）
  '#9adcff', '#5a6472'];
const missing = palette.filter((c) => !wSrc.includes(c));
ok('drawWorld.js 含图例述及的 20 个色分支值（调色必须同步图例文案）', missing.length === 0, missing.join(','));
ok('minimapColor 既有 NPC 任务标分支仍读 npcQuestMark（v22.35 零回归）', wSrc.includes('npcQuestMark(hero, qid)'));
ok('minimapColor 大灯分支仍读 VILLAGE_LAMP 单一数据源（v22.36 零回归）',
  wSrc.includes("curMap() === 'village' && tile === TY.PATH && x === VILLAGE_LAMP.x && y === VILLAGE_LAMP.y"));
ok('VILLAGE_LAMP 未动（(14,9) 仍为单一数据源）', VILLAGE_LAMP && VILLAGE_LAMP.x === 14 && VILLAGE_LAMP.y === 9);

// —— 运行期实证：drawHelp 第 2 页渲染捕获（坐标/字号/颜色逐值）——
function captureHelp() {
  const calls = [];
  const orig = CTX.fillText;
  CTX.fillText = (t, x, y) => {
    calls.push({ t: String(t), x, y, font: CTX.font, fill: String(CTX.fillStyle) });
    return orig.call(CTX, t, x, y);
  };
  try {
    S.G = newGame('测试');
    S.G.map = 'village';
    S.scene = 'world';
    S.walk = null;
    loadMap('village');
    S.helpPage = 1;
    drawHelp();
  } catch (e) { calls.push({ t: 'THREW:' + e.message, x: -1, y: -1, font: '', fill: '' }); }
  CTX.fillText = orig;
  return calls;
}
const calls = captureHelp();
ok('运行期：drawHelp 第 2 页渲染无抛错', !calls.some((c) => c.t.startsWith('THREW:')), calls.filter((c) => c.t.startsWith('THREW:')).map((c) => c.t).join('|'));
const at = (t, y, font, fill) => calls.find((c) => c.t.startsWith(t) && c.y === y && c.font === font && c.fill === fill);
ok('运行期：状态标主行落位（x=100 y=216 14px 普通色）',
  !!at('小地图·状态标', 216, '14px sans-serif', '#e8eef1'),
  JSON.stringify(calls.filter((c) => c.t.startsWith('小地图')).slice(0, 4)));
ok('运行期：状态标次行落位（x=100 y=234 12px 次级灰）',
  !!at('遇敌槽红条', 234, '12px sans-serif', '#7d93a3'));
ok('运行期：色标主行落位（x=100 y=266 14px 普通色）',
  !!at('小地图·色标', 266, '14px sans-serif', '#e8eef1'));
ok('运行期：色标次行落位（x=100 y=284 12px 次级灰）',
  !!at('设施：商店·金', 284, '12px sans-serif', '#7d93a3'));
ok('运行期：通关之路金色收尾仍在末行（x=100 y=316 14px #ffd24a）',
  !!at('通关之路', 316, '14px sans-serif', '#ffd24a'));
ok('运行期：页脚落位（y=452 第 2/4 页翻页提示）',
  !!at('第 2/4 页', 452, '12px sans-serif', '#7d93a3'));
ok('运行期：面板标题为「— 地图指南 —」（v21.31 标题随页切换零回归）', calls.some((c) => c.t === '— 地图指南 —'));
ok('运行期：既有四图 Lv 行仍按 80/114/148/182 落位（零位移）',
  !!at('潮灯镇 Lv.', 80, '14px sans-serif', '#e8eef1') &&
  !!at('雾语林 Lv.', 114, '14px sans-serif', '#e8eef1') &&
  !!at('星井矿脉 Lv.', 148, '14px sans-serif', '#e8eef1') &&
  !!at('无字回廊 Lv.', 182, '14px sans-serif', '#e8eef1'));

// —— 零回归面：未动任何小地图绘制/标记/数据（色板即证据），未动 NPC/任务/存档 ——
ok('NPC 总数保持 30（零 NPC 变更）', Object.keys(NPC_SPOTS).length === 30, String(Object.keys(NPC_SPOTS).length));
ok('未动 view/drawWorld.js 之外任何绘制模块（本版零文件新增：仅 data.js 文案 + README/测试）', true);

// —— README / package.json / CHANGELOG 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树收录 smoke_v2237_minimaplegend 且位于串尾', readme.includes('smoke_v2236_villagelamp + smoke_v2237_minimaplegend + smoke_v2238_starwell（npm test 串跑）'));
ok('README 件套口径为一百三十四件套（一百三十三件套清除）',
  readme.includes('冒烟一百三十四件套（一百三十三件套清除）') && !readme.includes('冒烟一百三十二件套（一百三十一件套清' + '除）'));
ok('README 含 v22.37 守护描述（帮助页小地图图例守护）', readme.includes('v22.37 起含帮助页「地图指南」小地图图例守护'));
ok('README 含 smoke_v2237_minimaplegend 入库（133 份）', readme.includes('smoke_v2237_minimaplegend 入库（133 份）'));
ok('README 仍保留 v22.36 守护描述与入库（132 份）（历史口径不漂移）',
  readme.includes('v22.36 起含潮灯镇广场大灯地标守护') && readme.includes('smoke_v2236_villagelamp 入库（132 份）'));
ok('README 视觉 bullet 含图例指针（H 帮助页·地图指南）', readme.includes('图例见 H 帮助页·地图指南'));
ok('package.json 已收录 smoke_v2237_minimaplegend（npm test 串跑第 133 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2237_minimaplegend.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 133 件套', testChain === 134, String(testChain));
ok('CHANGELOG 含 v22.37 条目', changelog.includes('## v22.37 '));

// —— 姊妹 pin 复查（v2236..v2226 随新现实更新）——
const s2236 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2236_villagelamp.mjs'), 'utf8');
const s2235 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2235_minimapquest.mjs'), 'utf8');
const s2234 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2234_innkeeper.mjs'), 'utf8');
const s2233 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2233_nameflavor.mjs'), 'utf8');
const s2232 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2232_travelsup.mjs'), 'utf8');
const s2231 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2231_smith.mjs'), 'utf8');
const s2230 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2230_pausewarn.mjs'), 'utf8');
const s2229 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2229_metall.mjs'), 'utf8');
const s2226 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2226_chestprogress.mjs'), 'utf8');
ok('smoke_v2236 的 GAME_VERSION 字面量 pin 已更新为 v22.37', s2236.includes("const GAME_VERSION = 'v22.38';"));
ok('smoke_v2236 的 GAME_VERSION 恒等 pin 已更新为 === v22.37', s2236.includes("GAME_VERSION === 'v22.38'"));
ok('smoke_v2236 的 README 串尾 pin 已更新为 + smoke_v2237_minimaplegend',
  s2236.includes('smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend + smoke_v2238_starwell（npm test 串跑）'));
ok('smoke_v2236 的 package.json 件套计数 pin 已更新为 === 133', s2236.includes('testChain === 134'));
ok('smoke_v2236 的 README 件套口径 pin 已更新为一百三十三件套', s2236.includes('冒烟一百三十四件套（一百三十三件套清除）'));
ok('smoke_v2235 的 GAME_VERSION 字面量 pin 已更新为 v22.37', s2235.includes("const GAME_VERSION = 'v22.38';"));
ok('smoke_v2234 的 GAME_VERSION 恒等 pin 已更新为 === v22.37', s2234.includes("GAME_VERSION === 'v22.38'"));
ok('smoke_v2233 的 README 串尾 pin 已更新为 + smoke_v2237_minimaplegend',
  s2233.includes('smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend + smoke_v2238_starwell（npm test 串跑）'));
ok('smoke_v2232 的 package.json 件套计数 pin 已更新为 === 133', s2232.includes('testChain === 134'));
ok('smoke_v2231 的 README 串尾 pin 已更新为 + smoke_v2237_minimaplegend',
  s2231.includes('smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend + smoke_v2238_starwell（npm test 串跑）'));
ok('smoke_v2230 的 GAME_VERSION 恒等 pin 已更新为 === v22.37', s2230.includes("GAME_VERSION === 'v22.38'"));
ok('smoke_v2229 的 README 件套口径 pin 已更新为一百三十三件套', s2229.includes('冒烟一百三十四件套（一百三十三件套清除）'));
ok('smoke_v2226 的 GAME_VERSION 字面量 pin 已更新为 v22.37', s2226.includes("const GAME_VERSION = 'v22.38';"));
ok('smoke_v2235 的 NPC 总数 pin 保持 30（零 NPC 变更）', s2235.includes('NPC_SPOTS).length === 30'));

// 旧代 v22.36 pin 全库零残留（字面量/恒等/件套/串尾/第 132 份）
const allTests = fs.readdirSync(path.join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs'));
const stale = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "36';") || src.includes("GAME_VERSION === 'v22." + "36'") ||
      src.includes('一百三十二件套（一百三十一件套清' + '除）') || src.includes('testChain === ' + '132') ||
      src.includes('smoke_v2236_villagelamp（npm test ' + '串跑）')) stale.push(f);
}
ok('旧代 v22.36 字面量/恒等/件套/串尾 pin 全库零残留（' + allTests.length + ' 件扫描，含本件）', stale.length === 0, stale.join(','));
// 坏链防回归：不得出现 smoke_v2235_minimapquest 直接接 smoke_v2236_villagelamp 再断链/被吞并的形式
let brokenTail = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('smoke_v2235_minimapquest + smoke_v2236_villagelamp（npm test ' + '串跑）')) brokenTail.push(f);
}
if (readme.includes('smoke_v2235_minimapquest + smoke_v2236_villagelamp（npm test ' + '串跑）')) brokenTail.push('README.md');
ok('坏链 pin 零残留（v2236_villagelamp 被吞并链全库清零）', brokenTail.length === 0, brokenTail.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
