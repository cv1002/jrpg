// v22.39 专项冒烟：星井矿脉「星砂车」地标（新内容·世界景观·纯显示）——「被矿车拉去喂记忆之灯」的矿车：
// 井巫「矿脉曾往镇上运星砂，喂那些记忆之灯」/星砂车夫「这洞从前往镇上拉星砂」的台词全在说它（v22.38
// 立井时也写明「最后一车没运走的星砂就在这儿卸下」），矿车区却一像素的车都没有——车夫守着空气、只有
// 新立的井；现于矿车区东缘（data.js CAVE_CART=(19,10)，可行走 CAVE 格零碰撞）立起木轮星砂车：两档状态
// （caveCartState 纯函数 / 车斗星砂 / 光晕）与星井同读 S.G.trueBoss 一份源——满载（星砂蓝 #9adcff +
// 浮光 #cfeaff + 蓝青光晕 rgba(95,216,255,.18)）→ 卸空（暗斗 #3a4148 + 零浮光零光晕，井巫 after
// 「星砂落回矿脉深处」同口径）。刻意不设小地图标记（静态纯装饰物、无状态档位，与地面装饰/天气同族）。
// 纯显示零结算零存档零数值变化。本冒烟守护：版本锚点、data.js/drawWorld.js 源级落位（CAVE_CART 单一
// 数据源 + 星井/大灯既有分支逐字零回归 + 刻意无小地图标记断言）、运行期实证（cave 两档渲染捕获：
// 星砂/浮光/光晕/暗斗逐像素色 + caveCartState 纯函数四档 + at(19,10)===TY.CAVE 零碰撞 + NPC 总数
// 30 零变更）、README/package.json/CHANGELOG 同步（tests 树尾/件套口径 135/v22.39 守护描述/入库 135
// 份/地图行/视觉 bullet）、姊妹件套 pin（v2238..v2230 随新现实更新，含 v2230 双锚）复查 + 旧代 v22.38
// 字面量/恒等/件套/串尾 pin 全库零残留 + 坏链防回归。
import { S } from '../js/state.js';
import { GAME_VERSION, CAVE_CART, CAVE_WELL, VILLAGE_LAMP, NPC_SPOTS, TY, SOLID, MAPS } from '../js/data.js';
import { newGame } from '../js/core.js';
import { loadMap, at } from '../js/world.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v22.38 冒烟先例：先装桩再 import main.js；fillRect/arc 捕获供星砂车断言）——
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
const { drawWorld, cam, caveCartState, caveWellState } = await import('../js/view/drawWorld.js');
const { CTX } = await import('../js/view/canvas.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.39 星井矿脉星砂车地标 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const wSrc = fs.readFileSync(path.join(ROOT, 'js/view/drawWorld.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.38 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.38', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 39)), GAME_VERSION);
ok('data.js 含 v22.39 注释（星砂车说明）', dSrc.includes('v22.39 星井矿脉「星砂车」'));
ok('GAME_VERSION 字面量已为 v22.39（旧 v22.38 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v22.39';") && !dSrc.includes("const GAME_VERSION = 'v22." + "38';"));
ok('data.js 仍保留 v22.38 历史注释（累积注释块，姊妹 pin 不失效）',
  dSrc.includes('v22.38 星井矿脉「星井」') && dSrc.includes('v22.37 体验打磨'));

// —— data.js 源级落位：CAVE_CART 单一数据源 ——
ok('CAVE_CART 位于矿车区东缘 (19,10)', CAVE_CART && CAVE_CART.x === 19 && CAVE_CART.y === 10,
  JSON.stringify(CAVE_CART));
ok('data.js 导出块含 CAVE_CART（可被 drawWorld 与冒烟共享）', /CAVE_CART,/.test(dSrc) && dSrc.includes('CAVE_CART'));
ok('data.js 含 v22.39 星砂车注释（台词同源口径：满载/卸空）', dSrc.includes('星砂落回矿脉深处') && dSrc.includes('被矿车拉去喂记忆之灯'));
ok('CAVE_WELL 未动（(16,11) 仍为单一数据源）', CAVE_WELL && CAVE_WELL.x === 16 && CAVE_WELL.y === 11);
ok('VILLAGE_LAMP 未动（(14,9) 仍为单一数据源）', VILLAGE_LAMP && VILLAGE_LAMP.x === 14 && VILLAGE_LAMP.y === 9);

// —— drawWorld.js 源级落位：drawCaveCart + caveCartState + 主循环接入 ——
ok('drawWorld.js 含 v22.39 注释（星砂车说明）', wSrc.includes('v22.39 星井矿脉「星砂车」'));
ok('drawWorld.js import CAVE_CART（data.js 单一数据源）', wSrc.includes('CAVE_CART'));
ok('drawWorld.js 导出 caveCartState 纯函数（两档状态单一数据源）', wSrc.includes('export function caveCartState'));
ok('caveCartState 档位读 trueBoss（卸空档优先）', wSrc.includes("if (hero && hero.trueBoss) return 'empty';"));
ok('caveCartState 缺省满载档（loaded）', wSrc.includes("return 'loaded';"));
ok('drawWorld 主循环接入 drawCaveCart（cave 专属，位于 drawCaveWell 之后）',
  wSrc.includes("curMap() === 'cave') drawCaveCart(c.x, c.y);") &&
  wSrc.indexOf('drawCaveCart(c.x, c.y)') > wSrc.indexOf('drawCaveWell(c.x, c.y)'));
ok('星砂车绘制先于角色层（在 actors 深度排序之前）',
  wSrc.indexOf('drawCaveCart(c.x, c.y)') > 0 && wSrc.indexOf('const actors = []') > wSrc.indexOf('drawCaveCart(c.x, c.y)'));
ok('满载档星砂蓝 #9adcff（星砂蓝光族，与星井/泉水/试炼青同蓝青族）',
  wSrc.includes("CTX.fillStyle = '#9adcff';"));
ok('满载档星砂浮光 #cfeaff（车斗星屑 3 枚）',
  wSrc.includes("CTX.fillStyle = '#cfeaff';") && wSrc.includes('CTX.fillRect(px + 10, py + 1, 2, 2);'));
ok('满载档蓝青光晕 rgba(95,216,255,.18)（与星井 .22 同族减半档）',
  wSrc.includes("'rgba(95,216,255,.18)'"));
ok('卸空档暗斗 #3a4148（洞窟岩壁同色族）',
  wSrc.includes("CTX.fillStyle = '#3a4148';") && wSrc.includes('CTX.fillRect(px + 7, py + 3, 18, 7);'));
ok('木体共体两色齐备（#8a5a2b 木料 + #6a4a2f 顶缘，与 NPC 木制标记同色族）',
  wSrc.includes("CTX.fillStyle = '#8a5a2b';") && wSrc.includes("CTX.fillStyle = '#6a4a2f';"));
ok('铁轮两枚 #2e333c arc r5（与灯罩/井壁同金属族）',
  wSrc.includes("CTX.arc(px + 9, py + 25, 5, 0, 7)") && wSrc.includes("CTX.arc(px + 23, py + 25, 5, 0, 7)"));
ok('刻意不设小地图标记（静态纯装饰物无状态档位，minimapColor 无 CAVE_CART 分支）',
  !wSrc.includes('x === CAVE_CART.x') && wSrc.includes('&& x === CAVE_WELL.x && y === CAVE_WELL.y'));
ok('既有星井分支逐字零回归（minimapColor 星井色仍为 #9adcff/#5a6472 双档）',
  wSrc.includes("return (hero && hero.trueBoss) ? '#5a6472' : '#9adcff';"));
ok('既有大灯分支逐字零回归（villageLampState 三档仍在）',
  wSrc.includes("if (hero && hero.trueBoss) return 'full';") && wSrc.includes("if (hero && hero.bossDefeated) return 'rekindled';"));

// —— 纯函数运行期实证：caveCartState 四档（与星井/大灯同族只读旗标）——
ok('纯函数：新档（无旗标）→ loaded（满载）', caveCartState({}) === 'loaded');
ok('纯函数：bossDefeated 但未 trueBoss → loaded（砂还在车上）', caveCartState({ bossDefeated: true }) === 'loaded');
ok('纯函数：trueBoss → empty（星砂落回矿脉深处）', caveCartState({ trueBoss: true }) === 'empty');
ok('纯函数：null 防御 → loaded', caveCartState(null) === 'loaded');
ok('纯函数：caveWellState 仍四档零回归（{}/bossDefeated→hum、trueBoss→silent、null→hum）',
  caveWellState({}) === 'hum' && caveWellState({ bossDefeated: true }) === 'hum' &&
  caveWellState({ trueBoss: true }) === 'silent' && caveWellState(null) === 'hum');

// —— 运行期实证：cave 两档渲染捕获（星砂/浮光/光晕/暗斗逐像素色）——
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
    S.G.x = CAVE_CART.x - 1; S.G.y = CAVE_CART.y;
    S.dir = 'R';
    S.scene = 'world';
    S.walk = null;
    loadMap('cave');
    drawWorld();
  } catch (e) { rects.push({ fs: 'THREW:' + e.message, x: -1, y: -1, w: 0, h: 0 }); }
  CTX.fillRect = origFR;
  CTX.arc = origArc;
  const c = cam();
  const px = CAVE_CART.x * 32 - c.x;
  const py = CAVE_CART.y * 32 - c.y;
  const sand = (fs) => rects.find((r) => r.x === px + 7 && r.y === py + 3 && r.w === 18 && r.h === 7 && r.fs === fs);
  // 星砂浮光只数「星砂车格内」的 #cfeaff 2×2（星井同屏也有浮光，按格位排除防串数）
  const inTile = (r) => r.x >= px - 1 && r.x < px + 33 && r.y >= py - 1 && r.y < py + 33;
  const spark = () => rects.filter((r) => r.w === 2 && r.h === 2 && r.fs === '#cfeaff' && inTile(r)).length;
  const halo = (fs, r) => arcs.find((a) => a.r === r && a.fs === fs);
  const wheel = () => arcs.filter((a) => a.r === 5 && a.fs === '#2e333c' && a.x >= px - 1 && a.x < px + 33 && a.y >= py - 1 && a.y < py + 33).length;
  return { rects, arcs, sand, spark, halo, wheel, cam: c, px, py };
}

// 档 A：新档（井还在低鸣·车满载）——星砂蓝 + 3 星屑 + 蓝青光晕 + 双铁轮 + 木体
const capA = captureCave({});
ok('运行期：无抛错（drawWorld 全链路两档之一）', !capA.rects.some((r) => r.fs.startsWith('THREW:')));
ok('运行期：满载档车斗星砂 #9adcff（「被矿车拉去喂记忆之灯」的星砂还在车上）', !!capA.sand('#9adcff'),
  JSON.stringify(capA.rects.filter((r) => r.y === capA.py + 3 && r.x === capA.px + 7).slice(0, 3)));
ok('运行期：满载档星砂浮光 3 枚（#cfeaff 2×2）', capA.spark() === 3, String(capA.spark()));
ok('运行期：满载档蓝青光晕 arc r=14 rgba(95,216,255,.18)', !!capA.halo('rgba(95,216,255,.18)', 14),
  JSON.stringify(capA.arcs.slice(0, 8)));
ok('运行期：铁轮两枚 r=5 #2e333c（共体零状态分支）', capA.wheel() === 2, String(capA.wheel()));
ok('运行期：木体共体落位（#8a5a2b 车斗 + #6a4a2f 顶缘）',
  !!capA.rects.find((r) => r.x === capA.px + 4 && r.y === capA.py + 8 && r.w === 24 && r.h === 13 && r.fs === '#8a5a2b') &&
  !!capA.rects.find((r) => r.x === capA.px + 4 && r.y === capA.py + 8 && r.w === 24 && r.h === 3 && r.fs === '#6a4a2f'));
ok('运行期：星井仍按低鸣档渲染（井水 #9adcff 在 (16,11) 原位）',
  !!capA.rects.find((r) => r.fs === '#9adcff' && r.w === 10 && r.h === 10));

// 档 B：trueBoss（井也不鸣·星砂落回矿脉深处）——暗斗 #3a4148，零浮光零光晕，木体仍在
const capB = captureCave({ trueBoss: true });
ok('运行期：卸空档车斗暗灰 #3a4148（「像什么都没发生过」）', !!capB.sand('#3a4148'));
ok('运行期：卸空档零星砂浮光（#cfeaff 不出现）', capB.spark() === 0, String(capB.spark()));
ok('运行期：卸空档零蓝青光晕（rgba(95,216,255,.18) arc 不出现）', !capB.halo('rgba(95,216,255,.18)', 14));
ok('运行期：卸空档木体/铁轮仍在（共体零状态分支）',
  !!capB.rects.find((r) => r.x === capB.px + 4 && r.y === capB.py + 8 && r.w === 24 && r.h === 13 && r.fs === '#8a5a2b') &&
  capB.wheel() === 2 && !capB.sand('#9adcff'));

// —— 契约：零碰撞 / 零 NPC 变更 / 坐标不冲突 / 既有地标零占位 ——
ok('契约：at(19,10) === TY.CAVE（星砂车立在可行走矿脉岩地上，零碰撞变化）', at(CAVE_CART.x, CAVE_CART.y) === TY.CAVE,
  String(at(CAVE_CART.x, CAVE_CART.y)));
ok('契约：(19,10) 非 SOLID（可行走格）', !SOLID.has(at(CAVE_CART.x, CAVE_CART.y)));
ok('契约：NPC 总数保持 30（零 NPC 变更，v22.38 pin 续守）', Object.keys(NPC_SPOTS).length === 30,
  String(Object.keys(NPC_SPOTS).length));
ok('契约：CAVE_CART 坐标不与其他已用坐标键冲突（非 NPC_SPOTS 键）',
  (CAVE_CART.x + ',' + CAVE_CART.y) in NPC_SPOTS === false);
ok('契约：cave.extras 无 (19,10) 占用（车夫(17,11)/守碑人(17,12)/试炼碑(18,12)/水晶(12,11) 零占位）',
  !MAPS.cave.extras.some((e) => e.x === CAVE_CART.x && e.y === CAVE_CART.y),
  JSON.stringify(MAPS.cave.extras.filter((e) => e.y === 10)));
ok('契约：星井(16,11)/终焉水晶(12,11 仍是 SB 源)/试炼碑(18,12) 零占位与既有地标原样（与星砂车互不占）',
  !MAPS.cave.extras.some((e) => e.x === 16 && e.y === 11) &&
  MAPS.cave.extras.some((e) => e.x === 12 && e.y === 11 && e.ty === 'SB') &&
  MAPS.cave.extras.some((e) => e.x === 18 && e.y === 12 && e.ty === 'TRIAL') &&
  !MAPS.cave.treasure.some((t) => t[0] === 19 && t[1] === 10));

// —— README / package.json / CHANGELOG 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树收录 smoke_v2239_minercart 且位于串尾', readme.includes('smoke_v2238_starwell + smoke_v2239_minercart（npm test 串跑）'));
ok('README 件套口径为一百三十五件套（一百三十四件套清除）',
  readme.includes('冒烟一百三十五件套（一百三十四件套清除）') && !readme.includes('冒烟一百三十四件套（一百三十三件套清' + '除）'));
ok('README 含 v22.39 守护描述（星井矿脉星砂车地标守护）', readme.includes('v22.39 起含星井矿脉星砂车地标守护'));
ok('README 含 smoke_v2239_minercart 入库（135 份）', readme.includes('smoke_v2239_minercart 入库（135 份）'));
ok('README 仍保留 v22.38 守护描述与入库（134 份）（历史口径不漂移）',
  readme.includes('v22.38 起含星井矿脉星井地标守护') && readme.includes('smoke_v2238_starwell 入库（134 份）'));
ok('README 星井矿脉地图行含星砂车可见口径（v22.39）', readme.includes('v22.39 起世界画面可见'));
ok('README 视觉 bullet 含星砂车地标（v22.39 补景收口）', readme.includes('星砂车地标**（v22.39'));
ok('package.json 已收录 smoke_v2239_minercart（npm test 串跑第 135 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2239_minercart.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 135 件套', testChain === 135, String(testChain));
ok('CHANGELOG 含 v22.39 条目', changelog.includes('## v22.39 '));

// —— 姊妹 pin 复查（v2238..v2230 随新现实更新，含 v2230 双锚）——
const s2238 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2238_starwell.mjs'), 'utf8');
const s2237 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2237_minimaplegend.mjs'), 'utf8');
const s2235 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2235_minimapquest.mjs'), 'utf8');
const s2234 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2234_innkeeper.mjs'), 'utf8');
const s2230 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2230_pausewarn.mjs'), 'utf8');
const s2228 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2228_titlesave.mjs'), 'utf8');
const s2229 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2229_metall.mjs'), 'utf8');
ok('smoke_v2238 的 GAME_VERSION 字面量 pin 已更新为 v22.39', s2238.includes("const GAME_VERSION = 'v22.39';"));
ok('smoke_v2238 的 GAME_VERSION 恒等 pin 已更新为 === v22.39', s2238.includes("GAME_VERSION === 'v22.39'"));
ok('smoke_v2238 的 README 串尾 pin 已更新为 + smoke_v2239_minercart',
  s2238.includes('smoke_v2237_minimaplegend + smoke_v2238_starwell + smoke_v2239_minercart（npm test 串跑）'));
ok('smoke_v2238 的 package.json 件套计数 pin 已更新为 === 135', s2238.includes('testChain === 135'));
ok('smoke_v2238 的 README 件套口径 pin 已更新为一百三十五件套', s2238.includes('冒烟一百三十五件套（一百三十四件套清除）'));
ok('smoke_v2237 的 GAME_VERSION 字面量 pin 已更新为 v22.39', s2237.includes("const GAME_VERSION = 'v22.39';"));
ok('smoke_v2235 的 GAME_VERSION 字面量 pin 已更新为 v22.39', s2235.includes("const GAME_VERSION = 'v22.39';"));
ok('smoke_v2234 的 GAME_VERSION 恒等 pin 已更新为 === v22.39', s2234.includes("GAME_VERSION === 'v22.39'"));
ok('smoke_v2228/v2229/v2230 的 regex 串尾锚已延伸至 smoke_v2239_minercart',
  s2228.includes('smoke_v2238_starwell\\.mjs && node tests\\/smoke_v2239_minercart\\.mjs"/.test(pkg)') &&
  s2229.includes('smoke_v2238_starwell\\.mjs && node tests\\/smoke_v2239_minercart\\.mjs"/.test(pkg)') &&
  s2230.includes('smoke_v2238_starwell\\.mjs && node tests\\/smoke_v2239_minercart\\.mjs"/.test(pkg)'));
ok('smoke_v2230 的 escaped 串尾锚已延伸至 smoke_v2239_minercart（s2229 复查链）',
  s2230.includes('smoke_v2238_starwell\\\\.mjs && node tests\\\\/smoke_v2239_minercart\\\\.mjs"'));
ok('smoke_v2235 的 NPC 总数 pin 保持 30（零 NPC 变更）', s2235.includes('NPC_SPOTS).length === 30'));

// 旧代 v22.38 pin 全库零残留（字面量/恒等/件套/串尾/第 134 份）
const allTests = fs.readdirSync(path.join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs'));
const stale = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "38';") || src.includes("GAME_VERSION === 'v22." + "38'") ||
      src.includes('一百三十四件套（一百三十三件套清' + '除）') || src.includes('testChain === ' + '134') ||
      src.includes('smoke_v2238_starwell（npm test ' + '串跑）')) stale.push(f);
}
ok('旧代 v22.38 字面量/恒等/件套/串尾 pin 全库零残留（' + allTests.length + ' 件扫描，含本件）', stale.length === 0, stale.join(','));
// 坏链防回归：不得出现 smoke_v2237_minimaplegend 直接接 smoke_v2238_starwell 再断链/被吞并的形式
let brokenTail = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('smoke_v2237_minimaplegend + smoke_v2238_starwell（npm test ' + '串跑）')) brokenTail.push(f);
}
if (readme.includes('smoke_v2237_minimaplegend + smoke_v2238_starwell（npm test ' + '串跑）')) brokenTail.push('README.md');
ok('坏链 pin 零残留（v2238_starwell 被吞并链全库清零）', brokenTail.length === 0, brokenTail.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
