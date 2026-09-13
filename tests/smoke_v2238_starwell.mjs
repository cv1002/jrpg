// v22.38 专项冒烟：星井矿脉「星井」地标（新内容·世界景观·纯显示）——矿脉的名字物此前只活在台词里
// （井巫「矿脉曾往镇上运星砂，喂那些记忆之灯」/星砂车夫「这洞从前往镇上拉星砂」/听矿人「矿脉嗡嗡响」/
// 说书人「井底那口钟」/灯长 done「可你听——井还在低鸣。」/trueBoss「井也不鸣了。」），世界画面一像素
// 都没有——矿车区有车夫/守碑人/试炼碑/星砂宝箱，唯独名字物没有脸；现于矿车区西缘（data.js
// CAVE_WELL=(16,11)，可行走 CAVE 格零碰撞）立起星井：两档状态（caveWellState 纯函数 / 井水 / 光晕 /
// 小地图标记）与灯长台词同读 S.G.trueBoss 一份源——低鸣（井水星蓝 #9adcff + 星砂浮光 #cfeaff + 蓝青
// 光晕 rgba(95,216,255,.22)）→ 静默（暗水 #5a6472 + 零浮光零光晕），小地图同档（星蓝 #9adcff / 静默灰
// #5a6472），地图指南「小地图·状态标」图例同批补「星井 低鸣星蓝/静默灰」。纯显示零结算零存档零数值变化。
// 本冒烟守护：版本锚点、data.js/drawWorld.js 源级落位（CAVE_WELL 单一数据源 + 既有 minimapColor 分支
// 逐字零回归 + 既有 v22.35 NPC 任务标/v22.36 大灯分支零回归）、运行期实证（cave 两档渲染捕获：井水/
// 浮光/光晕逐像素色 + caveWellState 纯函数三档 + at(16,11)===TY.CAVE 零碰撞 + NPC 总数 30 零变更）、
// 图例联动（状态标行 r[2] 追加星井、行数仍 7/r[2] 数仍 2/末行基线 316 不变、estW ≤470、图文源级逐字、
// drawHelp 第 2 页运行期落位）、README/package.json/CHANGELOG 同步（tests 树尾/件套口径 134/v22.38
// 守护描述/入库 134 份）、姊妹件套 pin（v2237..v2230 随新现实更新）复查 + 旧代 v22.37 字面量/恒等/
// 件套/串尾 pin 全库零残留 + 坏链防回归。
import { S } from '../js/state.js';
import { GAME_VERSION, CAVE_WELL, VILLAGE_LAMP, NPC_SPOTS, TY, SOLID, MAPS, HELP_PAGES, HELP_TITLES } from '../js/data.js';
import { newGame } from '../js/core.js';
import { loadMap, at } from '../js/world.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v22.37 冒烟先例：先装桩再 import main.js；fillRect/arc 捕获供星井断言）——
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
const { drawWorld, cam, caveWellState } = await import('../js/view/drawWorld.js');
const { drawHelp } = await import('../js/view/menus.js');
const { CTX } = await import('../js/view/canvas.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.38 星井矿脉星井地标 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const wSrc = fs.readFileSync(path.join(ROOT, 'js/view/drawWorld.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.37 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.37', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 38)), GAME_VERSION);
ok('data.js 含 v22.38 注释（星井地标说明）', dSrc.includes('v22.38 星井矿脉「星井」'));
ok('GAME_VERSION 字面量已为 v22.38（旧 v22.37 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v22.38';") && !dSrc.includes("const GAME_VERSION = 'v22." + "37';"));
ok('data.js 仍保留 v22.37/v22.36 历史注释（累积注释块，姊妹 pin 不失效）',
  dSrc.includes('v22.37 体验打磨') && dSrc.includes('v22.36 潮灯镇广场大灯'));

// —— data.js 源级落位：CAVE_WELL 单一数据源 ——
ok('CAVE_WELL 位于矿车区西缘 (16,11)', CAVE_WELL && CAVE_WELL.x === 16 && CAVE_WELL.y === 11,
  JSON.stringify(CAVE_WELL));
ok('data.js 导出块含 CAVE_WELL（可被 drawWorld 与冒烟共享）', /CAVE_WELL,/.test(dSrc) && dSrc.includes('CAVE_WELL'));
ok('data.js 含 v22.38 星井注释（台词同源口径：低鸣/静默）', dSrc.includes('井还在低鸣') && dSrc.includes('井也不鸣了'));
ok('VILLAGE_LAMP 未动（(14,9) 仍为单一数据源）', VILLAGE_LAMP && VILLAGE_LAMP.x === 14 && VILLAGE_LAMP.y === 9);

// —— drawWorld.js 源级落位：drawCaveWell + caveWellState + minimapColor 分支 ——
ok('drawWorld.js 含 v22.38 注释（星井地标说明）', wSrc.includes('v22.38 星井矿脉「星井」'));
ok('drawWorld.js import CAVE_WELL（data.js 单一数据源）', wSrc.includes('CAVE_WELL'));
ok('drawWorld.js 导出 caveWellState 纯函数（两档状态单一数据源）', wSrc.includes('export function caveWellState'));
ok('caveWellState 档位读 trueBoss（静默档优先）', wSrc.includes("if (hero && hero.trueBoss) return 'silent';"));
ok('caveWellState 缺省低鸣档（hum）', wSrc.includes("return 'hum';"));
ok('drawWorld 主循环接入 drawCaveWell（cave 专属）', wSrc.includes("curMap() === 'cave') drawCaveWell(c.x, c.y);"));
ok('星井绘制先于角色层（在 actors 深度排序之前）',
  wSrc.indexOf('drawCaveWell(c.x, c.y)') > 0 && wSrc.indexOf('const actors = []') > wSrc.indexOf('drawCaveWell(c.x, c.y)'));
ok('低鸣档井水星蓝 #9adcff（星砂蓝光族，与泉水蓝/试炼青同蓝青族）',
  wSrc.includes("CTX.fillStyle = '#9adcff';"));
ok('低鸣档星砂浮光 #cfeaff（井口星屑 4 枚）',
  wSrc.includes("CTX.fillStyle = '#cfeaff';") && wSrc.includes('CTX.fillRect(px + 13, py - 15, 2, 2);'));
ok('低鸣档蓝青光晕 rgba(95,216,255,.22)（与洞窟晶尘同蓝青族）',
  wSrc.includes("'rgba(95,216,255,.22)'"));
ok('静默档井水暗灰 #5a6472（与大灯熄冷灰/洞窟深灰同灰族）',
  wSrc.includes("CTX.fillStyle = '#5a6472';"));
ok('静默档零星砂浮光（#cfeaff 仅出现在 hum 分支内）', wSrc.split('#cfeaff').length === 3);
ok('井体石砌两色齐备（#2e333c 井沿井壁 + #3a4148 高光，与洞窟岩壁/金属灯罩同色族）',
  wSrc.includes("CTX.fillStyle = '#2e333c';") && wSrc.includes("CTX.fillStyle = '#3a4148';"));
ok('minimapColor 星井分支读 CAVE_WELL 单一数据源（与画布同源）',
  wSrc.includes("curMap() === 'cave' && tile === TY.CAVE && x === CAVE_WELL.x && y === CAVE_WELL.y"));
ok('minimapColor 星井分支档位色（低鸣星蓝 #9adcff / 静默灰 #5a6472）',
  wSrc.includes("return (hero && hero.trueBoss) ? '#5a6472' : '#9adcff';"));
ok('星井分支位于洞窟深灰分支之前（否则被 #39414f 吞掉）',
  wSrc.indexOf("&& y === CAVE_WELL.y)") < wSrc.indexOf("if (tile === TY.CAVE) return '#39414f';"));
ok('既有 minimapColor 分支逐字零回归（树/水/镇路/BOSS/商店/旅馆/泉水/酿造/NPC 任务标/大灯/洞窟深灰）',
  wSrc.includes("if (tile === TY.TREE || tile === TY.ROCK) return '#1f4d1f'") &&
  wSrc.includes("if (tile === TY.WATER) return '#22568a'") &&
  wSrc.includes("if (tile === TY.TOWN || tile === TY.PATH) return '#7d6b49'") &&
  wSrc.includes("if (tile === TY.BOSS) return '#a03fd9'") &&
  wSrc.includes("if (tile === TY.SHOP) return '#ffd24a'") &&
  wSrc.includes("if (tile === TY.INN) return '#7a8aa0'") &&
  wSrc.includes("if (tile === TY.FOUNTAIN) return '#62c6ff'") &&
  wSrc.includes("if (tile === TY.BREW) return '#8fd86f'") &&
  wSrc.includes('npcQuestMark(hero, qid)') &&
  wSrc.includes("return (hero && hero.bossDefeated) ? '#ffd24a' : '#7b7a84';") &&
  wSrc.includes("if (tile === TY.CAVE) return '#39414f';"));

// —— 纯函数运行期实证：caveWellState 三档 ——
ok('纯函数：新档（无旗标）→ hum（低鸣）', caveWellState({}) === 'hum');
ok('纯函数：bossDefeated 但未 trueBoss → hum（井还在低鸣）', caveWellState({ bossDefeated: true }) === 'hum');
ok('纯函数：trueBoss → silent（井也不鸣了）', caveWellState({ trueBoss: true }) === 'silent');
ok('纯函数：null 防御 → hum', caveWellState(null) === 'hum');

// —— 运行期实证：cave 两档渲染捕获（井水/浮光/光晕逐像素色；hero 立于井格，面向北无交互提示）——
function captureCave(flags) {
  const rects = [], arcs = [];
  const origFR = CTX.fillRect, origArc = CTX.arc;
  CTX.fillRect = (x, y, w, h) => {
    rects.push({ x, y, w, h, fs: String(CTX.fillStyle) });
    return origFR.call(CTX, x, y, w, h);
  };
  CTX.arc = (x, y, r) => {
    arcs.push({ x, y, r, fs: String(CTX.fillStyle) });
    return origArc.call(CTX, x, y, r);
  };
  try {
    S.G = newGame('测试');
    Object.assign(S.G, flags);
    S.G.map = 'cave';
    S.G.x = CAVE_WELL.x; S.G.y = CAVE_WELL.y + 1;
    S.dir = 'U';
    S.scene = 'world';
    S.walk = null;
    loadMap('cave');
    drawWorld();
  } catch (e) { rects.push({ fs: 'THREW:' + e.message, x: -1, y: -1, w: 0, h: 0 }); }
  CTX.fillRect = origFR;
  CTX.arc = origArc;
  const c = cam();
  const px = CAVE_WELL.x * 32 - c.x;
  const py = CAVE_WELL.y * 32 - c.y;
  const water = (fs) => rects.find((r) => r.x === px + 11 && r.y === py - 12 && r.w === 10 && r.h === 10 && r.fs === fs);
  const spark = () => rects.filter((r) => r.w === 2 && r.h === 2 && r.fs === '#cfeaff').length;
  const halo = (fs, r) => arcs.find((a) => a.r === r && a.fs === fs);
  return { rects, arcs, water, spark, halo, cam: c, px, py };
}

// 档 A：新档（井还在低鸣）——星蓝井水 + 4 星屑 + 蓝青光晕
const capA = captureCave({});
ok('运行期：无抛错（drawWorld 全链路两档之一）', !capA.rects.some((r) => r.fs.startsWith('THREW:')));
ok('运行期：低鸣档井水星蓝 #9adcff（「井底还在响」）', !!capA.water('#9adcff'), JSON.stringify(capA.rects.filter((r) => r.y === capA.py - 12 && r.x === capA.px + 11).slice(0, 3)));
ok('运行期：低鸣档星砂浮光 4 枚（#cfeaff 2×2）', capA.spark() === 4, String(capA.spark()));
ok('运行期：低鸣档蓝青光晕 arc r=15 rgba(95,216,255,.22)', !!capA.halo('rgba(95,216,255,.22)', 15), JSON.stringify(capA.arcs.slice(0, 8)));
ok('运行期：低鸣档井体石砌落位（#2e333c 井座/井壁/井沿 + #3a4148 高光）',
  !!capA.rects.find((r) => r.x === capA.px + 4 && r.y === capA.py - 16 && r.w === 24 && r.fs === '#2e333c') &&
  !!capA.rects.find((r) => r.x === capA.px + 8 && r.y === capA.py - 16 && r.w === 2 && r.fs === '#3a4148'));

// 档 B：trueBoss（井也不鸣了）——暗水 #5a6472，零浮光零光晕
const capB = captureCave({ trueBoss: true });
ok('运行期：静默档井水暗灰 #5a6472（「井也不鸣了」）', !!capB.water('#5a6472'));
ok('运行期：静默档零星砂浮光（#cfeaff 不出现）', capB.spark() === 0, String(capB.spark()));
ok('运行期：静默档零蓝青光晕（rgba(95,216,255,.22) arc 不出现）', !capB.halo('rgba(95,216,255,.22)', 15));
ok('运行期：静默档井体仍在（石砌共体零状态分支）',
  !!capB.rects.find((r) => r.x === capB.px + 4 && r.y === capB.py - 16 && r.w === 24 && r.fs === '#2e333c') &&
  !capB.water('#9adcff'));

// —— 契约：零碰撞 / 零 NPC 变更 / 坐标不冲突 ——
ok('契约：at(16,11) === TY.CAVE（星井立在可行走矿脉岩地上，零碰撞变化）', at(CAVE_WELL.x, CAVE_WELL.y) === TY.CAVE,
  String(at(CAVE_WELL.x, CAVE_WELL.y)));
ok('契约：(16,11) 非 SOLID（可行走格）', !SOLID.has(at(CAVE_WELL.x, CAVE_WELL.y)));
ok('契约：NPC 总数保持 30（零 NPC 变更，v22.37 pin 续守）', Object.keys(NPC_SPOTS).length === 30,
  String(Object.keys(NPC_SPOTS).length));
ok('契约：CAVE_WELL 坐标不与其他已用坐标键冲突（非 NPC_SPOTS 键）',
  (CAVE_WELL.x + ',' + CAVE_WELL.y) in NPC_SPOTS === false);
ok('契约：cave.extras 无 (16,11) 占用（车夫(17,11)/守碑人(17,12)/试炼碑(18,12)/水晶(12,11) 零占位）',
  !MAPS.cave.extras.some((e) => e.x === CAVE_WELL.x && e.y === CAVE_WELL.y),
  JSON.stringify(MAPS.cave.extras.filter((e) => e.y === 11)));

// —— 图例联动：地图指南「小地图·状态标」行追加星井（v22.37「每加新标记必同步图例」口罩）——
const page = HELP_PAGES[1];
ok('地图指南页仍为 7 行（未加行，sp=34 档不变）', page.length === 7, `实际 ${page.length}`);
const rowState = page.find((r) => r[0] === '小地图·状态标');
const rowColor = page.find((r) => r[0] === '小地图·色标');
ok('状态标行 r[1] 逐字零回归（委托金光/宝箱暖金/危险红点）',
  rowState && rowState[1] === '有委托NPC 金光脉动 · 未开宝箱 暖金(任务中脉动) · 危险区红点');
ok('状态标行 r[2] 逐字（新增「星井 低鸣星蓝/静默灰」，色名与 minimapColor 同口径）',
  rowState && rowState[2] === '遇敌槽红条 · 大灯 熄冷灰/亮暖金（与画布大灯同档） · 星井 低鸣星蓝/静默灰 · 无委托NPC 米色');
ok('色标行 r[1]/r[2] 逐字零回归（地形五色/设施八色未动）',
  rowColor && rowColor[1] === '树岩·绿 水·蓝 镇路·棕 洞窟·深灰 门/出口·蓝' &&
  rowColor[2] === '设施：商店·金 旅馆·灰 泉水·蓝 酿造·绿 试炼·青 魔王碑·紫 终焉碑·黄 石碑·灰');
ok('通关之路行逐字零回归（金色收尾行内容不变）', page[6][1] === '讨回灯芯 → 击败洞窟领主 → 双徽记开门 → 回廊尽头面对终焉之神');
ok('data.js 源级含新图例字面量（防运行期拼接漂移）',
  dSrc.includes("['小地图·状态标','有委托NPC 金光脉动 · 未开宝箱 暖金(任务中脉动) · 危险区红点','遇敌槽红条 · 大灯 熄冷灰/亮暖金（与画布大灯同档） · 星井 低鸣星蓝/静默灰 · 无委托NPC 米色']"));

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
ok('状态标次行（含星井）估算宽 ≤470', estW(rowState[2], 12) <= 470, `≈${estW(rowState[2], 12).toFixed(0)}`);
ok('状态标主行估算宽 ≤470', estW('小地图·状态标   ', 14) + estW(rowState[1], 14) <= 470);
ok('色标主行/次行估算宽 ≤470（零回归）',
  estW('小地图·色标   ', 14) + estW(rowColor[1], 14) <= 470 && estW(rowColor[2], 12) <= 470);
let allOk = true;
page.forEach((r) => {
  const wMain = estW(r[0] + '   ', 14) + estW(r[1], 14);
  if (wMain > 470) { allOk = false; console.log('    <- 越界行:', r[0], Math.round(wMain)); }
  if (r[2] && estW(r[2], 12) > 470) { allOk = false; console.log('    <- r2越界:', r[0]); }
});
ok('地图指南页全部 7 行估算宽 ≤470（全页行宽巡检）', allOk);
ok('页长派生：末行基线仍 316 ≤440（行数/r[2] 数均不变，页脚 452 之上留白）',
  80 + (page.length - 1) * 34 + (page.reduce((a, r) => a + (r[2] ? 1 : 0), 0)) * 16 === 316);

// —— 运行期实证：drawHelp 第 2 页渲染捕获（新 r[2] 落位 y=234，既有行零位移）——
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
ok('运行期：状态标次行含星井落位（x=100 y=234 12px 次级灰）',
  calls.some((c) => c.t === '遇敌槽红条 · 大灯 熄冷灰/亮暖金（与画布大灯同档） · 星井 低鸣星蓝/静默灰 · 无委托NPC 米色' &&
    c.y === 234 && c.font === '12px sans-serif' && c.fill === '#7d93a3'));
ok('运行期：状态标主行/色标两行/通关之路/页脚基线零位移（216/266/284/316/452）',
  calls.some((c) => c.t.startsWith('小地图·状态标') && c.y === 216) &&
  calls.some((c) => c.t.startsWith('小地图·色标') && c.y === 266) &&
  calls.some((c) => c.t.startsWith('设施：商店·金') && c.y === 284) &&
  calls.some((c) => c.t.startsWith('通关之路') && c.y === 316) &&
  calls.some((c) => c.t.startsWith('第 2/4 页') && c.y === 452));

// —— README / package.json / CHANGELOG 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树收录 smoke_v2238_starwell 且位于串尾', readme.includes('smoke_v2237_minimaplegend + smoke_v2238_starwell（npm test 串跑）'));
ok('README 件套口径为一百三十四件套（一百三十三件套清除）',
  readme.includes('冒烟一百三十四件套（一百三十三件套清除）') && !readme.includes('冒烟一百三十三件套（一百三十二件套清' + '除）'));
ok('README 含 v22.38 守护描述（星井矿脉星井地标守护）', readme.includes('v22.38 起含星井矿脉星井地标守护'));
ok('README 含 smoke_v2238_starwell 入库（134 份）', readme.includes('smoke_v2238_starwell 入库（134 份）'));
ok('README 仍保留 v22.37 守护描述与入库（133 份）（历史口径不漂移）',
  readme.includes('v22.37 起含帮助页「地图指南」小地图图例守护') && readme.includes('smoke_v2237_minimaplegend 入库（133 份）'));
ok('README 星井矿脉地图行含星井可见口径（v22.38）', readme.includes('v22.38 起世界画面可见'));
ok('README 视觉 bullet 含星井地标（v22.38 名字物补脸）', readme.includes('星井地标**（v22.38'));
ok('README 图例指针仍保留（H 帮助页·地图指南）', readme.includes('图例见 H 帮助页·地图指南'));
ok('package.json 已收录 smoke_v2238_starwell（npm test 串跑第 134 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2238_starwell.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 134 件套', testChain === 134, String(testChain));
ok('CHANGELOG 含 v22.38 条目', changelog.includes('## v22.38 '));

// —— 姊妹 pin 复查（v2237..v2230 随新现实更新）——
const s2237 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2237_minimaplegend.mjs'), 'utf8');
const s2236 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2236_villagelamp.mjs'), 'utf8');
const s2235 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2235_minimapquest.mjs'), 'utf8');
const s2234 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2234_innkeeper.mjs'), 'utf8');
const s2233 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2233_nameflavor.mjs'), 'utf8');
const s2232 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2232_travelsup.mjs'), 'utf8');
const s2230 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2230_pausewarn.mjs'), 'utf8');
ok('smoke_v2237 的 GAME_VERSION 字面量 pin 已更新为 v22.38', s2237.includes("const GAME_VERSION = 'v22.38';"));
ok('smoke_v2237 的 GAME_VERSION 恒等 pin 已更新为 === v22.38', s2237.includes("GAME_VERSION === 'v22.38'"));
ok('smoke_v2237 的 README 串尾 pin 已更新为 + smoke_v2238_starwell',
  s2237.includes('smoke_v2236_villagelamp + smoke_v2237_minimaplegend + smoke_v2238_starwell（npm test 串跑）'));
ok('smoke_v2237 的 package.json 件套计数 pin 已更新为 === 134', s2237.includes('testChain === 134'));
ok('smoke_v2237 的 README 件套口径 pin 已更新为一百三十四件套', s2237.includes('冒烟一百三十四件套（一百三十三件套清除）'));
ok('smoke_v2237 的图例正文 pin 已随星井更新（状态标 r[2] 含星井）',
  s2237.includes('星井 低鸣星蓝/静默灰'));
ok('smoke_v2236 的 GAME_VERSION 字面量 pin 已更新为 v22.38', s2236.includes("const GAME_VERSION = 'v22.38';"));
ok('smoke_v2236 的 README 串尾 pin 已更新为 + smoke_v2238_starwell',
  s2236.includes('smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend + smoke_v2238_starwell（npm test 串跑）'));
ok('smoke_v2236 的件套/恒等 pin 已更新（===134/===v22.38）',
  s2236.includes('testChain === 134') && s2236.includes("GAME_VERSION === 'v22.38'"));
ok('smoke_v2235 的 GAME_VERSION 字面量 pin 已更新为 v22.38', s2235.includes("const GAME_VERSION = 'v22.38';"));
ok('smoke_v2234 的 GAME_VERSION 恒等 pin 已更新为 === v22.38', s2234.includes("GAME_VERSION === 'v22.38'"));
ok('smoke_v2233 的 README 串尾 pin 已更新为 + smoke_v2238_starwell',
  s2233.includes('smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend + smoke_v2238_starwell（npm test 串跑）'));
ok('smoke_v2232 的 package.json 件套计数 pin 已更新为 === 134', s2232.includes('testChain === 134'));
ok('smoke_v2230 的 GAME_VERSION 恒等 pin 已更新为 === v22.38', s2230.includes("GAME_VERSION === 'v22.38'"));
ok('smoke_v2235 的 NPC 总数 pin 保持 30（零 NPC 变更）', s2235.includes('NPC_SPOTS).length === 30'));

// 旧代 v22.37 pin 全库零残留（字面量/恒等/件套/串尾/第 133 份）
const allTests = fs.readdirSync(path.join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs'));
const stale = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "37';") || src.includes("GAME_VERSION === 'v22." + "37'") ||
      src.includes('一百三十三件套（一百三十二件套清' + '除）') || src.includes('testChain === ' + '133') ||
      src.includes('smoke_v2237_minimaplegend（npm test ' + '串跑）')) stale.push(f);
}
ok('旧代 v22.37 字面量/恒等/件套/串尾 pin 全库零残留（' + allTests.length + ' 件扫描，含本件）', stale.length === 0, stale.join(','));
// 坏链防回归：不得出现 smoke_v2236_villagelamp 直接接 smoke_v2237_minimaplegend 再断链/被吞并的形式
let brokenTail = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('smoke_v2236_villagelamp + smoke_v2237_minimaplegend（npm test ' + '串跑）')) brokenTail.push(f);
}
if (readme.includes('smoke_v2236_villagelamp + smoke_v2237_minimaplegend（npm test ' + '串跑）')) brokenTail.push('README.md');
ok('坏链 pin 零残留（v2237_minimaplegend 被吞并链全库清零）', brokenTail.length === 0, brokenTail.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
