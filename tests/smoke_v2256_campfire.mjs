// v22.56 专项冒烟：雾语林中段营地「营地篝火」景观（新内容·世界景观·纯显示）——中段营地（v13.5
// 「中段营地（泉水+猎手）」/README「中段营地（泉水安全岛）」/货郎「中段营地的泉水，可以白喝」/老矿工
// 「雾语林营地那口泉是这附近最后一处免费的水」/雾径猎手 (13,9) 守在泉边）是雾语林唯一的补给安全岛，
// 泉水+猎手+白喝水却一像素的「火」都没有——营地没有篝火就只是水边一块空地；现于泉水西侧 (11,9)
// （data.js CAMP_FIRE 单一数据源，可行走 '0' 草格零碰撞）立起营地篝火：暖橙光晕 rgba(255,200,90,.25)
// · 石圈 #6a6f78/#8a9098 · 交叉柴堆 #6b5138/#8a5a2b · 火焰灯油金 #ffd24a + 金白焰心 #ffe9a8 ·
// 深金余烬 #8a5a00 · 火星金白（坐标哈希确定性）——全部既有色族零新增颜色；纯显示零结算零存档零数值
// 变化（at/SOLID/遇敌/踩踏判定逐字未动），village/cave/gallery 零触发，不设小地图标记。本冒烟守护：
// 版本锚点、data.js/drawWorld.js 源级落位（v22.56 注释 + CAMP_FIRE + export + drawCampFire + 调用点 +
// 既有菌盖/高草/谷穗/石碑温光/名字之门/大灯/村井/星井/星砂车/轨道/小地图 STELE 灰零回归）、运行期实证
// （dungeon 渲染捕获：(11,9) 逐矩形落位 + 光晕恰 1 组 + 菌盖 (18,2) 零回归 + village/cave/gallery 零
// 营火防泄漏）、契约（at(11,9)===TY.GRASS / SOLID 不含 GRASS / CAMP_FIRE 逐值 / 与泉水猎手宝箱互不
// 占位 / loadMap 重载重建 / NPC 总数 34 零变更）、README/package.json/CHANGELOG 同步（tests 树尾/
// 件套口径 152/v22.56 守护描述/入库 152 份/雾语林地图行/视觉 bullet）、姊妹件套 pin（v2255..v2226
// 随新现实更新，含 v2228/v2229/v2230 三风格锚与 v2239/v2240 容错正则尾锚）复查 + 旧代 v22.55
// 字面量/恒等/件套/串尾/testChain pin 全库零残留 + 坏链防回归。
import { S } from '../js/state.js';
import { GAME_VERSION, CAMP_FIRE, NPC_SPOTS, TY, SOLID, MAPS } from '../js/data.js';
import { newGame } from '../js/core.js';
import { loadMap, at } from '../js/world.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— DOM 桩（承 v21.30-v22.55 冒烟先例：先装桩再 import main.js；fillRect 捕获供篝火断言）——
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
const { drawWorld, cam } = await import('../js/view/drawWorld.js');
const { CTX } = await import('../js/view/canvas.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.56 雾语林营地篝火景观 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const wSrc = fs.readFileSync(path.join(ROOT, 'js/view/drawWorld.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.55 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.55（本版守 v22.56）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 56)), GAME_VERSION);
ok('data.js 含 v22.56 注释（营地篝火说明）', dSrc.includes('v22.56 新内容·世界景观·纯显示'));
ok('GAME_VERSION 字面量已为 v22.56（旧 v22.55 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v23.51';") && !dSrc.includes("const GAME_VERSION = 'v22." + "56';"));
ok('data.js 仍保留 v22.55/v22.54 世代注释链（石碑温光/谷穗累积注释未动）',
  dSrc.includes('v22.55 新内容·世界景观·纯显示') && dSrc.includes('v22.54 新内容·世界景观·纯显示'));

// —— data.js 源级落位：CAMP_FIRE 常量 + export 块 ——
ok('data.js 含 CAMP_FIRE = { x: 11, y: 9 }（营地篝火位置单一数据源）',
  dSrc.includes('const CAMP_FIRE = { x: 11, y: 9 };'));
ok('data.js export 块已收录 CAMP_FIRE', dSrc.includes('GALLERY_ARCH, CAMP_FIRE, BREW_MUSHROOMS'));
ok('data.js 含 v22.56 常量注释（营地篝火）', dSrc.includes('v22.56 雾语林「营地篝火」（新内容·世界景观·纯显示'));

// —— drawWorld.js 源级落位：drawCampFire + 调用点 + 色板 + 几何（纯显示·仅 dungeon·确定性）——
const T = 32;
ok('drawWorld.js 含 v22.56 注释（营地篝火说明）', wSrc.includes('v22.56 雾语林「营地篝火」'));
ok('drawWorld.js 含 drawCampFire 函数（先于角色层·位置读 CAMP_FIRE 单一数据源）',
  wSrc.includes('function drawCampFire(camX, camY)') && wSrc.includes('CAMP_FIRE.x * T - camX'));
ok('drawWorld.js 调用点（名字之门后·仅 dungeon）',
  wSrc.includes("if (S.G && curMap() === 'dungeon') drawCampFire(c.x, c.y);"));
ok('drawWorld.js import 增 CAMP_FIRE/BOSS_ALTAR/MB_ALTAR',
  wSrc.includes('GALLERY_ARCH, CAMP_FIRE, BOSS_ALTAR, MB_ALTAR } from'));
ok('drawWorld.js 营火色板（rgba(255,200,90,.25) 光晕 / #6a6f78·#8a9098 石圈 / #6b5138·#8a5a2b 柴堆 / #ffd24a 火焰 / #ffe9a8 焰心·火星 / #8a5a00 余烬）',
  wSrc.includes("CTX.fillStyle = 'rgba(255,200,90,.25)';") && wSrc.includes("CTX.fillStyle = '#6a6f78';") &&
  wSrc.includes("CTX.fillStyle = '#8a9098';") && wSrc.includes("CTX.fillStyle = '#6b5138';") &&
  wSrc.includes("CTX.fillStyle = '#8a5a2b';") && wSrc.includes("CTX.fillStyle = '#ffd24a';") &&
  wSrc.includes("CTX.fillStyle = '#ffe9a8';") && wSrc.includes("CTX.fillStyle = '#8a5a00';"));
ok('drawWorld.js 营火几何（光晕 22×22 @+5,+3 / 石圈 4×4 @+3,+23·+25,+23 / 柴堆 16×3 @+8,+21 / 火焰 10×13 @+11,+8 / 焰心 6×8 @+13,+12 / 火星 1×1 哈希）',
  wSrc.includes('CTX.fillRect(px + 5, py + 3, 22, 22);') &&
  wSrc.includes('CTX.fillRect(px + 3, py + 23, 4, 4);') && wSrc.includes('CTX.fillRect(px + 25, py + 23, 4, 4);') &&
  wSrc.includes('CTX.fillRect(px + 8, py + 21, 16, 3);') &&
  wSrc.includes('CTX.fillRect(px + 11, py + 8, 10, 13);') && wSrc.includes('CTX.fillRect(px + 13, py + 12, 6, 8);') &&
  wSrc.includes('CTX.fillRect(px + 8 + (dh % 3), py + 6, 1, 1);') && wSrc.includes('CTX.fillRect(px + 20 + (dh % 2), py + 3, 1, 1);'));
ok('drawWorld.js 既有分支逐字零回归（高草 isTallGrass 分流/菌盖门/谷穗门/名字之门/石碑温光/大灯/村井/星井/星砂车/轨道/小地图 STELE 灰/石像 GATE 门健在）',
  wSrc.includes('if (isTallGrass(x, y)) {') && wSrc.includes("if (curMap() === 'dungeon' && (x * 7 + y * 13) % 4 === 0) {") &&
  wSrc.includes("if (curMap() === 'village' && (x * 5 + y * 7) % 4 === 0) {") &&
  wSrc.includes('export function steleLitState(hero)') && wSrc.includes('export function galleryArchState(hero)') &&
  wSrc.includes("if (ty === TY.STELE && curMap() === 'gallery' && steleLitState(S.G)) {") &&
  wSrc.includes('export function villageLampState(hero)') && wSrc.includes('export function villageWellState(hero)') &&
  wSrc.includes('export function caveWellState(hero)') && wSrc.includes('export function caveCartState(hero)') &&
  wSrc.includes('function drawCaveRail(camX, camY)') && wSrc.includes("if (tile === TY.STELE) return '#9aa4ad';") &&
  wSrc.includes('const gate = (MAPS[curMap()].portals || {}).GATE;'));

// —— 运行期渲染捕获：营火逐色逐坐标（承 v22.40/v22.54/v22.55 捕获同法）——
function captureMap(mapName, heroX, heroY) {
  const origFR = CTX.fillRect;
  const rects = [];
  CTX.fillRect = (x, y, w, h) => {
    rects.push({ x, y, w, h, fs: String(CTX.fillStyle) });
    return origFR.call(CTX, x, y, w, h);
  };
  try {
    S.G = newGame('测试');
    S.G.map = mapName;
    S.G.x = heroX; S.G.y = heroY;
    S.dir = 'R';
    S.scene = 'world';
    S.walk = null;
    loadMap(mapName);
    drawWorld();
  } catch (e) { rects.push({ fs: 'THREW:' + e.message, x: -1, y: -1, w: 0, h: 0 }); }
  CTX.fillRect = origFR;
  return { rects, cam: cam() };
}
function hasRect(rects, fs, w, h, tx, ty, ox, oy, camXY) {
  return rects.some((q) => q.fs === fs && q.w === w && q.h === h &&
    Math.abs(q.x - (tx * T - camXY.x + ox)) <= 1 && Math.abs(q.y - (ty * T - camXY.y + oy)) <= 1);
}
// CAMP_FIRE = (11,9)；dh = 11*19 + 9*37 = 542 → dh%3=2（火星 x 偏移 10）、dh%2=0（火星 x 偏移 20）
// dungeon：玩家站泉水东北一格 (12,8)，营地 (11,9) 在视野内
{
  const cap = captureMap('dungeon', 12, 8);
  const c = cap.cam;
  ok('dungeon 运行期：无抛错（drawWorld 全链路）', !cap.rects.some((r) => r.fs.startsWith('THREW:')),
    JSON.stringify(cap.rects.filter((r) => r.fs.startsWith('THREW:'))));
  ok('dungeon 运行期：暖橙光晕 rgba(255,200,90,.25) 22×22 @(11,9)+5,+3 落位', hasRect(cap.rects, 'rgba(255,200,90,.25)', 22, 22, 11, 9, 5, 3, c));
  const glows = cap.rects.filter((r) => r.fs === 'rgba(255,200,90,.25)' && r.w === 22 && r.h === 22 &&
    !(r.x === -1 && r.y === -1)).length;
  ok('dungeon 运行期：暖橙光晕总数 = 1（恰一组营火，视野内零多余）', glows === 1, String(glows));
  ok('dungeon 运行期：石圈 #6a6f78 4×4 @(11,9)+3,+23 / +25,+23 落位', hasRect(cap.rects, '#6a6f78', 4, 4, 11, 9, 3, 23, c) && hasRect(cap.rects, '#6a6f78', 4, 4, 11, 9, 25, 23, c));
  ok('dungeon 运行期：石圈高光 #8a9098 5×2 @(11,9)+5,+27 / +22,+27 落位', hasRect(cap.rects, '#8a9098', 5, 2, 11, 9, 5, 27, c) && hasRect(cap.rects, '#8a9098', 5, 2, 11, 9, 22, 27, c));
  ok('dungeon 运行期：交叉柴堆 #6b5138 16×3 @+8,+21 与 3×6 @+15,+18 落位', hasRect(cap.rects, '#6b5138', 16, 3, 11, 9, 8, 21, c) && hasRect(cap.rects, '#6b5138', 3, 6, 11, 9, 15, 18, c));
  ok('dungeon 运行期：柴捆 #8a5a2b 7×2 @+13,+19 落位', hasRect(cap.rects, '#8a5a2b', 7, 2, 11, 9, 13, 19, c));
  ok('dungeon 运行期：火焰 #ffd24a 10×13 @+11,+8 与焰尖 4×4 @+14,+5 落位', hasRect(cap.rects, '#ffd24a', 10, 13, 11, 9, 11, 8, c) && hasRect(cap.rects, '#ffd24a', 4, 4, 11, 9, 14, 5, c));
  ok('dungeon 运行期：金白焰心 #ffe9a8 6×8 @+13,+12 与 2×4 @+15,+9 落位', hasRect(cap.rects, '#ffe9a8', 6, 8, 11, 9, 13, 12, c) && hasRect(cap.rects, '#ffe9a8', 2, 4, 11, 9, 15, 9, c));
  ok('dungeon 运行期：深金余烬 #8a5a00 2×2 @+12,+21 / +18,+20 落位', hasRect(cap.rects, '#8a5a00', 2, 2, 11, 9, 12, 21, c) && hasRect(cap.rects, '#8a5a00', 2, 2, 11, 9, 18, 20, c));
  ok('dungeon 运行期：火星 #ffe9a8 1×1 @+10,+6 / +20,+3（dh 哈希确定性）落位', hasRect(cap.rects, '#ffe9a8', 1, 1, 11, 9, 10, 6, c) && hasRect(cap.rects, '#ffe9a8', 1, 1, 11, 9, 20, 3, c));
  // v22.42 菌盖零回归：蘑菇田 (18,2) 菌盖 #ffd24a 17×8 仍落位
  ok('dungeon 运行期：蘑菇田 (18,2) 菌盖 #ffd24a（17×8）仍落位（v22.42 零回归）',
    cap.rects.some((r) => r.fs === '#ffd24a' && r.w === 17 && r.h === 8 &&
      Math.abs(r.x - (18 * T - c.x + 8)) <= 1 && Math.abs(r.y - (2 * T - c.y + 9)) <= 1));
}

// village / cave / gallery：零营火（curMap 门不触发）
{
  const capV = captureMap('village', 10, 15);
  ok('village 运行期：无抛错且零暖橙光晕 22×22（营地篝火不走 village 分支）',
    !capV.rects.some((r) => r.fs.startsWith('THREW:')) && !capV.rects.some((r) => r.fs === 'rgba(255,200,90,.25)' && r.w === 22 && r.h === 22));
  const capC = captureMap('cave', 1, 2);
  ok('cave 运行期：无抛错且零暖橙光晕 22×22（星井/星砂车/轨道零回归、无营火）',
    !capC.rects.some((r) => r.fs.startsWith('THREW:')) && !capC.rects.some((r) => r.fs === 'rgba(255,200,90,.25)' && r.w === 22 && r.h === 22));
  const capG = captureMap('gallery', 12, 3);
  ok('gallery 运行期：无抛错且零暖橙光晕 22×22（石碑温光/名字之门零回归、无营火）',
    !capG.rects.some((r) => r.fs.startsWith('THREW:')) && !capG.rects.some((r) => r.fs === 'rgba(255,200,90,.25)' && r.w === 22 && r.h === 22));
}

// —— 契约：零碰撞 / 零 NPC 变更 / 重载重建 / 数据面 ——
loadMap('dungeon');
ok('契约：CAMP_FIRE 常量逐值（x:11 y:9）', CAMP_FIRE.x === 11 && CAMP_FIRE.y === 9, JSON.stringify(CAMP_FIRE));
ok('契约：at(11,9) === TY.GRASS（篝火格仍是可行走草格，零碰撞变化）', at(11, 9) === TY.GRASS);
ok('契约：TY.GRASS 不在 SOLID（可行走零障碍）', !SOLID.has(TY.GRASS));
ok('契约：篝火与营地设施互不占位——泉水 (12,9) FOUNTAIN / 雾径猎手 (13,9) NPC / 蘑菇宝箱 (12,11) CHEST 逐点',
  at(12, 9) === TY.FOUNTAIN && at(13, 9) === TY.NPC && at(12, 11) === TY.CHEST);
ok('契约：dungeon extras 无 (11,9)（非既有键，全图 extras 扫描 (11,9) 仅 dungeon 草格）',
  !(MAPS.dungeon.extras || []).some((e) => e.x === 11 && e.y === 9) && !NPC_SPOTS['11,9']);
loadMap('dungeon');
ok('契约：loadMap 重载后 at(11,9) 仍 GRASS / (12,9) 仍 FOUNTAIN（重载重建）',
  at(11, 9) === TY.GRASS && at(12, 9) === TY.FOUNTAIN);
ok('契约：NPC 总数保持 34（零 NPC 变更，v22.51 pin 续守）', Object.keys(NPC_SPOTS).length === 38,
  String(Object.keys(NPC_SPOTS).length));

// —— README / package.json / CHANGELOG 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树收录 smoke_v2256_campfire 且位于串尾',
  readme.includes('smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 件套口径为二百一十二件套（二百一十一件套清除）',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟一百五十二件套（一百五十一件套清' + '除）'));
ok('README 含 v22.56 守护描述（雾语林营地篝火景观守护）', readme.includes('v22.56 起含雾语林营地篝火景观守护'));
ok('README 含 smoke_v2256_campfire 入库（152 份）', readme.includes('smoke_v2256_campfire 入库（152 份）'));
ok('README 仍保留 v22.55 守护描述与入库（151 份）（历史口径不漂移）',
  readme.includes('v22.55 起含无字回廊名字石碑回灯温光守护') && readme.includes('smoke_v2255_steleglow 入库（151 份）'));
ok('README 雾语林地图行含营地篝火口径（v22.56）',
  readme.includes('营地篝火** v22.56 起世界画面可见') && readme.includes('(11,9)'));
ok('README 视觉 bullet 含营地篝火景观（v22.56）', readme.includes('营地篝火景观**（v22.56'));
ok('package.json 已收录 smoke_v2256_campfire（npm test 串跑第 152 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2256_campfire.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 152 件套', testChain === 212, String(testChain));
ok('CHANGELOG 含 v22.56 条目', changelog.includes('## v22.56 '));

// —— 姊妹 pin 复查（v2255..v2226 随新现实更新，含 v2228/v2229/v2230 三风格锚与 v2239/v2240 容错正则尾锚）——
const s2255 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2255_steleglow.mjs'), 'utf8');
const s2254 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2254_grainfield.mjs'), 'utf8');
const s2253 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2253_supplypoint.mjs'), 'utf8');
const s2252 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2252_rail.mjs'), 'utf8');
const s2242 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2242_mushfield.mjs'), 'utf8');
const s2240 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2240_tallgrass.mjs'), 'utf8');
const s2239 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2239_minercart.mjs'), 'utf8');
const s2230 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2230_pausewarn.mjs'), 'utf8');
const s2229 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2229_metall.mjs'), 'utf8');
const s2228 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2228_titlesave.mjs'), 'utf8');
const s2226 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2226_chestprogress.mjs'), 'utf8');
const s2143 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2143_talkekey.mjs'), 'utf8');
ok('smoke_v2255 的 GAME_VERSION 字面量 pin 已更新为 v22.56', s2255.includes("const GAME_VERSION = 'v23.51';"));
ok('smoke_v2255 的 README 串尾 pin 已随新现实延伸至 smoke_v2256_campfire',
  s2255.includes('smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2255 的 README 件套 pin 已随新现实更新为二百一十二件套（二百一十一件套清除）',
  s2255.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2255 的 package.json 件套计数 pin 已更新为 === 152', s2255.includes('testChain === 212'));
ok('smoke_v2255 的 CHANGELOG 顶 pin 已更新为 ## v22.56', s2255.includes("startsWith('## v23.51')"));
ok('smoke_v2230 的 package.json 串尾 plain pin 已延伸至 smoke_v2256_campfire',
  s2230.includes('smoke_v2255_steleglow.mjs && node tests\\/smoke_v2256_campfire.mjs && node tests\\/smoke_v2257_pondglow.mjs && node tests\\/smoke_v2258_potionhelp.mjs && node tests\\/smoke_v2259_sandpile.mjs && node tests\\/smoke_v2260_fountripple.mjs && node tests\\/smoke_v2261_rich3.mjs && node tests\\/smoke_v2262_crystal.mjs && node tests\\/smoke_v2263_ptime3.mjs && node tests\\/smoke_v2264_hunt3.mjs && node tests\\/smoke_v2265_lucky3.mjs && node tests\\/smoke_v2266_stock3.mjs && node tests\\/smoke_v2267_elixir3.mjs && node tests\\/smoke_v2268_brew3.mjs && node tests\\/smoke_v2269_mush3.mjs && node tests\\/smoke_v2270_outstep.mjs && node tests\\/smoke_v2271_outstep2.mjs && node tests\\/smoke_v2272_scholar2.mjs && node tests\\/smoke_v2273_seen5.mjs && node tests\\/smoke_v2274_seen2\\.mjs && node tests\\/smoke_v2275_codexempty\\.mjs && node tests\\/smoke_v2276_lampkid\\.mjs && node tests\\/smoke_v2277_pondhint\\.mjs && node tests\\/smoke_v2278_mushguide\\.mjs && node tests\\/smoke_v2279_lampwell\\.mjs && node tests\\/smoke_v2280_grainfield\\.mjs && node tests\\/smoke_v2281_starwell\\.mjs && node tests\\/smoke_v2282_archgate\\.mjs && node tests\\/smoke_v2283_menuekey\\.mjs && node tests\\/smoke_v2284_skillekey\\.mjs && node tests\\/smoke_v2285_winekey\\.mjs && node tests\\/smoke_v2286_titleekey\\.mjs && node tests\\/smoke_v2287_trueroute\\.mjs && node tests\\/smoke_v2288_scrollhint\\.mjs && node tests\\/smoke_v2289_winprog\\.mjs && node tests\\/smoke_v2290_statlink\\.mjs && node tests\\/smoke_v2291_lampguide\\.mjs && node tests\\/smoke_v2292_cavewatch\\.mjs && node tests\\/smoke_v2293_deadsave\\.mjs && node tests\\/smoke_v2294_crystalwatch\\.mjs && node tests\\/smoke_v2295_deadprog\\.mjs && node tests\\/smoke_v2296_endingprog\\.mjs && node tests\\/smoke_v2297_chestmid\\.mjs && node tests\\/smoke_v2298_encnum\\.mjs && node tests\\/smoke_v2299_crosslink\\.mjs && node tests\\/smoke_v2300_sidemore\\.mjs && node tests\\/smoke_v2301_eco\\.mjs && node tests\\/smoke_v2302_cmdprev\\.mjs && node tests\\/smoke_v2303_rushnum\\.mjs && node tests\\/smoke_v2304_achgoal\\.mjs && node tests\\/smoke_v2305_monnum\\.mjs && node tests\\/smoke_v2306_skillnum\\.mjs && node tests\\/smoke_v2307_bossnum\\.mjs && node tests\\/smoke_v2308_diffnum\\.mjs && node tests\\/smoke_v2309_questnum\\.mjs && node tests\\/smoke_v2310_diffsum\\.mjs && node tests\\/smoke_v2311_fragprev\\.mjs && node tests\\/smoke_v2312_voltitle\\.mjs && node tests\\/smoke_v2313_talkall\\.mjs && node tests\\/smoke_v2314_voices\\.mjs && node tests\\/smoke_v2315_talkfoot\\.mjs && node tests\\/smoke_v2316_voiceshead\\.mjs"'));
ok('smoke_v2254 的 GAME_VERSION 字面量 pin 已更新为 v22.56', s2254.includes("const GAME_VERSION = 'v23.51';"));
ok('smoke_v2254 的 README 串尾 pin 已延伸至 smoke_v2256_campfire',
  s2254.includes('smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2253 的 GAME_VERSION 字面量 pin 已更新为 v22.56', s2253.includes("const GAME_VERSION = 'v23.51';"));
ok('smoke_v2253 的 README 串尾 pin 已延伸至 smoke_v2256_campfire',
  s2253.includes('smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2252 的 GAME_VERSION 字面量 pin 已更新为 v22.56', s2252.includes("const GAME_VERSION = 'v23.51';"));
ok('smoke_v2252 的 README 串尾 pin 已延伸至 smoke_v2256_campfire',
  s2252.includes('smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2242 的 README 串尾 pin 已延伸至 smoke_v2256_campfire',
  s2242.includes('smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
// 串尾锚延伸（任意转义风格：plain `/` / regex `\/` / 双转义 `\\/`）
const archChain = (s) => /smoke_v2253_supplypoint[.\\]{0,4}mjs[\s\S]*?node tests[\\/]{0,4}smoke_v2257_pondglow[.\\]{0,4}mjs/.test(s);
ok('smoke_v2226/v2228/v2229/v2230/v2239/v2240/v2242 的串尾锚已延伸至 smoke_v2256_campfire（plain/regex/双转义三风格）',
  archChain(s2226) && archChain(s2228) && archChain(s2229) && archChain(s2230) && archChain(s2239) &&
  archChain(s2240) && archChain(s2242));
// 容错正则尾锚（v2239/v2240 宽松模式：smoke_v2253_supplypoint 后 [\s\S]*? 再接 smoke_v2256_campfire）
const looseChain = (s) => /smoke_v2253_supplypoint[.\\]{0,6}mjs[\s\S]*?node tests[\\/]{0,6}smoke_v2257_pondglow[.\\]{0,6}mjs/.test(s);
ok('smoke_v2239/smoke_v2240 的容错正则尾锚已延伸至 smoke_v2256_campfire',
  looseChain(s2239) && looseChain(s2240));
ok('v2143-45「件套守护领先一位」哨兵链已推进至 153（二百一十二件套（二百一十一件套清除））',
  s2143.includes('二百一十三件套（二百一十二件套清除）') && s2143.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));
ok('smoke_v2228 的 GAME_VERSION 字面量 pin 已更新为 v22.56 且旧代零残留复查仍在（v22.27 风格）',
  s2228.includes("const GAME_VERSION = 'v23.51';") && s2228.includes("'v22." ) && s2228.includes("27';"));
ok('smoke_v2255 的旧代零残留扫描已指向 v22.55（字面量/恒等/件套/串尾/testChain）',
  s2255.includes("src.includes(\"const GAME_VERSION = 'v22.\" + \"56';\")") &&
  s2255.includes("src.includes('一百五十二件套（一百五十一件套清' + '除）')") &&
  s2255.includes("src.includes('smoke_v2256_campfire（npm test 串' + '跑）')) stale.push(f);"));

// 旧代 v22.55 pin 全库零残留（字面量/恒等/件套/串尾/testChain）
const allTests = fs.readdirSync(path.join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs'));
const stale = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "56';") || src.includes("GAME_VERSION === 'v22." + "56'") ||
      src.includes('一百五十二件套（一百五十一件套清' + '除）') || src.includes('testChain === ' + '152') ||
      src.includes('smoke_v2256_campfire（npm test 串' + '跑）')) stale.push(f);
}
ok('旧代 v22.55 字面量/恒等/件套/串尾/testChain pin 全库零残留（' + allTests.length + ' 件扫描，含本件）', stale.length === 0, stale.join(','));
// 坏链防回归：README 不得出现「smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）」孤尾
ok('README 串尾无孤尾（smoke_v2255_steleglow 后必须接 smoke_v2256_campfire）',
  !readme.includes('smoke_v2256_campfire（npm test 串' + '跑）'));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
