// v22.57 专项冒烟：潮灯镇「水塘灯影」景观（新内容·世界景观·纯显示）——掌灯阿婆（14,8 水塘南岸）
// 「灯灭那晚，塘里的月亮也熄了」/after「你看这塘水，倒映着整座镇子的灯——名字找回来了，灯也亮了」：
// 镇子的灯（v22.36 大灯三档/v22.47 村井两档）都已上画面，唯独水塘这面「镜子」仍是死水一片——灯有脸，
// 影没有。现仅潮灯镇（curMap()==='village'）的 WATER 格（6 格：北岸 (16..18,6) + 南岸 (14..16,7)）
// 按状态叠加灯影（与广场大灯同读 villageLampState 一份源三档——熄灯 dead/归来 rekindled/全亮 full）：
// 微光罩 20×18 + 灯柱 5×12 + 波光 22×2 +（全亮）第二波光 12×1·焰心 2×2 /（熄灯）余烬 2×2——全部
// 既有色族零新增颜色（灯油金 rgba(255,210,74,*) 同族/金白 rgba(255,233,168,*) 同族/熄灯灰
// rgba(90,85,96,*) 同 #5a5560 族/余烬暗铜 rgba(138,90,0,*) 同 #8a5a00 族），坐标哈希确定性零时间依赖
// （局部 dhw = x*31+y*17——water 分支先于函数级 const dh，不可引用）；纯显示零结算零存档零数值变化
// （WATER 仍 SOLID、遇敌/踩踏/传送判定逐字未动），dungeon/cave/gallery 零触发，不设小地图标记。
// 本冒烟守护：版本锚点、data.js/drawWorld.js 源级落位（v22.57 注释 + GAME_VERSION v22.57 + water 分支
// 三档色板/几何/局部哈希 + 既有分支零回归）、运行期实证（village 渲染捕获：三档逐矩形落位 + 灯柱恰 6
// 组 + 波光/光罩/焰心/余烬逐格 + dungeon/cave/gallery 零灯影防泄漏）、契约（WATER 恰 6 格/
// SOLID 含 WATER/villageLampState 逐值/大灯村井喷泉零回归/loadMap 重载重建/NPC 总数 34 零变更）、
// README/package.json/CHANGELOG 同步（tests 树尾/件套口径 153/v22.57 守护描述/入库 153 份/潮灯镇
// 地图行/视觉 bullet）、姊妹件套 pin（v2256..v2226 随新现实更新，含 v2228/v2229/v2230 三风格锚与
// v2239/v2240 容错正则尾锚）复查 + 旧代 v22.56 字面量/恒等/件套/串尾/testChain pin 全库零残留 +
// 坏链防回归。
import { S } from '../js/state.js';
import { GAME_VERSION, NPC_SPOTS, TY, SOLID, MAPS } from '../js/data.js';
import { newGame } from '../js/core.js';
import { loadMap, at } from '../js/world.js';
import { villageLampState } from '../js/view/drawWorld.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— DOM 桩（承 v21.30-v22.56 冒烟先例：先装桩再 import main.js；fillRect 捕获供灯影断言）——
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

console.log('— v22.57 潮灯镇水塘灯影景观 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const wSrc = fs.readFileSync(path.join(ROOT, 'js/view/drawWorld.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.56 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.56（本版守 v22.57）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 57)), GAME_VERSION);
ok('data.js 含 v22.57 注释（水塘灯影说明）', dSrc.includes('v22.57 新内容·世界景观·纯显示'));
ok('GAME_VERSION 字面量已为 v22.57（旧 v22.56 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v22.57';") && !dSrc.includes("const GAME_VERSION = 'v22." + "56';"));
ok('data.js 仍保留 v22.56/v22.55 世代注释链（营地篝火/石碑温光累积注释未动）',
  dSrc.includes('v22.56 新内容·世界景观·纯显示') && dSrc.includes('v22.55 新内容·世界景观·纯显示'));

// —— drawWorld.js 源级落位：v22.57 水塘灯影分支 + 三档色板 + 几何 + 既有分支零回归 ——
const T = 32;
ok('drawWorld.js 含 v22.57 注释（水塘灯影说明）', wSrc.includes('v22.57 潮灯镇「水塘灯影」'));
ok('drawWorld.js water 分支含 village 灯影门（curMap()===\'village\' && S.G）',
  wSrc.includes("if (curMap() === 'village' && S.G) {") && wSrc.includes('const lp = villageLampState(S.G);'));
ok('drawWorld.js 局部哈希 dhw = x * 31 + y * 17（water 分支先于函数级 const dh，不可引用）',
  wSrc.includes('const dhw = x * 31 + y * 17;') && wSrc.includes('const lx = 10 + (dhw % 5);'));
ok('drawWorld.js 全亮档色板（rgba(255,233,168,.18) 光罩/.55 灯柱/.32 波光/.8 焰心 + rgba(255,210,74,.2) 第二波光）',
  wSrc.includes("CTX.fillStyle = 'rgba(255,233,168,.18)';") && wSrc.includes("CTX.fillStyle = 'rgba(255,233,168,.55)';") &&
  wSrc.includes("CTX.fillStyle = 'rgba(255,233,168,.32)';") && wSrc.includes("CTX.fillStyle = 'rgba(255,233,168,.8)';") &&
  wSrc.includes("CTX.fillStyle = 'rgba(255,210,74,.2)';"));
ok('drawWorld.js 归来档色板（rgba(255,210,74,.12) 光罩/.45 灯柱/.28 波光）',
  wSrc.includes("CTX.fillStyle = 'rgba(255,210,74,.12)';") && wSrc.includes("CTX.fillStyle = 'rgba(255,210,74,.45)';") &&
  wSrc.includes("CTX.fillStyle = 'rgba(255,210,74,.28)';"));
ok('drawWorld.js 熄灯档色板（rgba(90,85,96,.12) 光罩/.3 灯柱 + rgba(138,90,0,.18) 余烬）',
  wSrc.includes("CTX.fillStyle = 'rgba(90,85,96,.12)';") && wSrc.includes("CTX.fillStyle = 'rgba(90,85,96,.3)';") &&
  wSrc.includes("CTX.fillStyle = 'rgba(138,90,0,.18)';"));
ok('drawWorld.js 灯影几何（光罩 20×18 @+6,+5 / 灯柱 5×12 @+lx,+9 / 波光 22×2 @+5,+23 / 第二波光 12×1 @+8+(dhw%6),+19 / 焰心 2×2 @+lx+1,+7 / 余烬 2×2 @+lx+8,+19）',
  wSrc.includes('CTX.fillRect(px + 6, py + 5, 20, 18);') &&
  wSrc.includes('CTX.fillRect(px + lx, py + 9, 5, 12);') && wSrc.includes('CTX.fillRect(px + 5, py + 23, 22, 2);') &&
  wSrc.includes('CTX.fillRect(px + 8 + (dhw % 6), py + 19, 12, 1);') && wSrc.includes('CTX.fillRect(px + lx + 1, py + 7, 2, 2);') &&
  wSrc.includes('CTX.fillRect(px + lx + 8, py + 19, 2, 2);'));
ok('drawWorld.js 既有分支逐字零回归（水纹/喷泉/水晶尘/高草/菌盖/谷穗/石碑温光/名字之门/大灯/村井/星井/星砂车/轨道/营火/小地图 STELE 灰/GATE 门健在）',
  wSrc.includes("CTX.fillStyle = 'rgba(158,232,255,'") && wSrc.includes('if (ty === TY.FOUNTAIN) {') &&
  wSrc.includes("if (ty === TY.CAVE || ty === TY.SB) {") &&
  wSrc.includes('if (isTallGrass(x, y)) {') && wSrc.includes("if (curMap() === 'dungeon' && (x * 7 + y * 13) % 4 === 0) {") &&
  wSrc.includes("if (curMap() === 'village' && (x * 5 + y * 7) % 4 === 0) {") &&
  wSrc.includes("if (ty === TY.STELE && curMap() === 'gallery' && steleLitState(S.G)) {") &&
  wSrc.includes('export function steleLitState(hero)') && wSrc.includes('export function galleryArchState(hero)') &&
  wSrc.includes('export function villageLampState(hero)') && wSrc.includes('export function villageWellState(hero)') &&
  wSrc.includes('export function caveWellState(hero)') && wSrc.includes('export function caveCartState(hero)') &&
  wSrc.includes('function drawCaveRail(camX, camY)') && wSrc.includes('function drawCampFire(camX, camY)') &&
  wSrc.includes("if (tile === TY.STELE) return '#9aa4ad';") && wSrc.includes('const gate = (MAPS[curMap()].portals || {}).GATE;'));

// —— 运行期渲染捕获：灯影逐色逐坐标（承 v22.54/v22.55/v22.56 捕获同法）——
const POND = [[16, 6], [17, 6], [18, 6], [14, 7], [15, 7], [16, 7]];
function captureVillage(flags, heroX = 15, heroY = 8) {
  const origFR = CTX.fillRect;
  const rects = [];
  CTX.fillRect = (x, y, w, h) => {
    rects.push({ x, y, w, h, fs: String(CTX.fillStyle) });
    return origFR.call(CTX, x, y, w, h);
  };
  try {
    S.G = newGame('测试');
    if (flags.bossDefeated) S.G.bossDefeated = true;
    if (flags.trueBoss) { S.G.trueBoss = true; S.G.bossDefeated = true; }
    S.G.map = 'village';
    S.G.x = heroX; S.G.y = heroY;
    S.dir = 'R';
    S.scene = 'world';
    S.walk = null;
    loadMap('village');
    drawWorld();
  } catch (e) { rects.push({ fs: 'THREW:' + e.message, x: -1, y: -1, w: 0, h: 0 }); }
  CTX.fillRect = origFR;
  return { rects, cam: cam() };
}
function pondCount(cap, fs, w, h) {
  return cap.rects.filter((q) => q.fs === fs && q.w === w && q.h === h && !(q.x === -1 && q.y === -1)).length;
}
// dhw = x*31 + y*17；lx = 10 + dhw%5；第二波光 x 偏移 = 8 + dhw%6
function hasPondRect(cap, fs, w, h, tx, ty, dx) {
  const dhw = tx * 31 + ty * 17;
  const lx = 10 + (dhw % 5);
  const c = cap.cam;
  return cap.rects.some((q) => q.fs === fs && q.w === w && q.h === h &&
    Math.abs(q.x - (tx * T - c.x + (dx === undefined ? lx : dx))) <= 1 &&
    Math.abs(q.y - (ty * T - c.y + 9)) <= 1);
}

// 熄灯档（newGame 默认）
{
  const cap = captureVillage({});
  ok('熄灯档 运行期：无抛错（drawWorld 全链路）', !cap.rects.some((r) => r.fs.startsWith('THREW:')),
    JSON.stringify(cap.rects.filter((r) => r.fs.startsWith('THREW:'))));
  ok('熄灯档 运行期：灰影灯柱 rgba(90,85,96,.3) 5×12 恰 6 组（全部水塘格）', pondCount(cap, 'rgba(90,85,96,.3)', 5, 12) === 6,
    String(pondCount(cap, 'rgba(90,85,96,.3)', 5, 12)));
  ok('熄灯档 运行期：灰影灯柱逐格落位（dhw 哈希 lx 逐格）',
    POND.every(([tx, ty]) => hasPondRect(cap, 'rgba(90,85,96,.3)', 5, 12, tx, ty)));
  ok('熄灯档 运行期：微光罩 rgba(90,85,96,.12) 20×18 恰 6 组', pondCount(cap, 'rgba(90,85,96,.12)', 20, 18) === 6);
  ok('熄灯档 运行期：余烬 rgba(138,90,0,.18) 2×2 恰 6 组（@+lx+8,+19）', pondCount(cap, 'rgba(138,90,0,.18)', 2, 2) === 6);
  ok('熄灯档 运行期：大灯三档零回归（无 rgba(255,210,74,.25)/rgba(255,233,168,.35) 光晕 arc——熄灯档灰晕）',
    cap.rects.filter((r) => r.fs === 'rgba(138,90,0,.25)').length === 0);
}

// 归来档（bossDefeated）
{
  const cap = captureVillage({ bossDefeated: true });
  ok('归来档 运行期：暖金灯柱 rgba(255,210,74,.45) 5×12 恰 6 组', pondCount(cap, 'rgba(255,210,74,.45)', 5, 12) === 6,
    String(pondCount(cap, 'rgba(255,210,74,.45)', 5, 12)));
  ok('归来档 运行期：暖金灯柱逐格落位（dhw 哈希 lx 逐格）', POND.every(([tx, ty]) => hasPondRect(cap, 'rgba(255,210,74,.45)', 5, 12, tx, ty)));
  ok('归来档 运行期：光罩 rgba(255,210,74,.12) 20×18 恰 6 组 + 波光 rgba(255,210,74,.28) 22×2 恰 6 组',
    pondCount(cap, 'rgba(255,210,74,.12)', 20, 18) === 6 && pondCount(cap, 'rgba(255,210,74,.28)', 22, 2) === 6);
  ok('归来档 运行期：零金白（全亮档 rgba(255,233,168,*) 灯柱不出现）', pondCount(cap, 'rgba(255,233,168,.55)', 5, 12) === 0);
}

// 全亮档（trueBoss）
{
  const cap = captureVillage({ trueBoss: true });
  ok('全亮档 运行期：金白灯柱 rgba(255,233,168,.55) 5×12 恰 6 组', pondCount(cap, 'rgba(255,233,168,.55)', 5, 12) === 6,
    String(pondCount(cap, 'rgba(255,233,168,.55)', 5, 12)));
  ok('全亮档 运行期：金白灯柱逐格落位（dhw 哈希 lx 逐格）', POND.every(([tx, ty]) => hasPondRect(cap, 'rgba(255,233,168,.55)', 5, 12, tx, ty)));
  ok('全亮档 运行期：微光罩 rgba(255,233,168,.18) 20×18 恰 6 组', pondCount(cap, 'rgba(255,233,168,.18)', 20, 18) === 6);
  ok('全亮档 运行期：波光 rgba(255,233,168,.32) 22×2 恰 6 组', pondCount(cap, 'rgba(255,233,168,.32)', 22, 2) === 6);
  ok('全亮档 运行期：第二波光 rgba(255,210,74,.2) 12×1 恰 6 组（@+8+(dhw%6),+19）', pondCount(cap, 'rgba(255,210,74,.2)', 12, 1) === 6,
    String(pondCount(cap, 'rgba(255,210,74,.2)', 12, 1)));
  ok('全亮档 运行期：第二波光逐格落位（dhw%6 逐格）',
    POND.every(([tx, ty]) => { const dhw = tx * 31 + ty * 17; const c = cap.cam;
      return cap.rects.some((q) => q.fs === 'rgba(255,210,74,.2)' && q.w === 12 && q.h === 1 &&
        Math.abs(q.x - (tx * T - c.x + 8 + (dhw % 6))) <= 1 && Math.abs(q.y - (ty * T - c.y + 19)) <= 1); }));
  ok('全亮档 运行期：焰心 rgba(255,233,168,.8) 2×2 恰 6 组（@+lx+1,+7）', pondCount(cap, 'rgba(255,233,168,.8)', 2, 2) === 6);
  ok('全亮档 运行期：零熄灯/归来色（灰影 .3 与暖金 .45 灯柱不出现）',
    pondCount(cap, 'rgba(90,85,96,.3)', 5, 12) === 0 && pondCount(cap, 'rgba(255,210,74,.45)', 5, 12) === 0);
}

// dungeon / cave / gallery：零灯影（curMap 门不触发）
{
  const origFR = CTX.fillRect;
  const grab = (mapName, hx, hy) => {
    const rects = [];
    CTX.fillRect = (x, y, w, h) => { rects.push({ x, y, w, h, fs: String(CTX.fillStyle) }); return origFR.call(CTX, x, y, w, h); };
    try {
      S.G = newGame('测试'); S.G.trueBoss = true; S.G.bossDefeated = true;
      S.G.map = mapName; S.G.x = hx; S.G.y = hy; S.dir = 'R'; S.scene = 'world'; S.walk = null;
      loadMap(mapName); drawWorld();
    } catch (e) { rects.push({ fs: 'THREW:' + e.message, x: -1, y: -1, w: 0, h: 0 }); }
    CTX.fillRect = origFR;
    return rects;
  };
  const rD = grab('dungeon', 12, 8);
  ok('dungeon 运行期：无抛错且零金白灯柱 5×12（水塘灯影不走 dungeon 分支）',
    !rD.some((r) => r.fs.startsWith('THREW:')) && !rD.some((r) => r.fs === 'rgba(255,233,168,.55)' && r.w === 5 && r.h === 12));
  ok('dungeon 运行期：营地篝火零回归（暖橙光晕 rgba(255,200,90,.25) 22×22 仍在 (11,9)）',
    rD.some((r) => r.fs === 'rgba(255,200,90,.25)' && r.w === 22 && r.h === 22));
  const rC = grab('cave', 1, 2);
  ok('cave 运行期：无抛错且零灯影（星井/星砂车/轨道零回归）',
    !rC.some((r) => r.fs.startsWith('THREW:')) && !rC.some((r) => r.fs === 'rgba(255,233,168,.55)' && r.w === 5 && r.h === 12));
  const rG = grab('gallery', 12, 3);
  ok('gallery 运行期：无抛错且零灯影（石碑温光/名字之门零回归）',
    !rG.some((r) => r.fs.startsWith('THREW:')) && !rG.some((r) => r.fs === 'rgba(255,233,168,.55)' && r.w === 5 && r.h === 12));
}

// —— 契约：villageLampState 纯函数 / 水塘数据面 / 零碰撞 / 重载重建 / NPC 总数 ——
loadMap('village');
ok('契约：villageLampState 纯函数三档逐值（{}→dead / bossDefeated→rekindled / trueBoss→full）',
  villageLampState({}) === 'dead' && villageLampState({ bossDefeated: true }) === 'rekindled' &&
  villageLampState({ trueBoss: true }) === 'full' && villageLampState(null) === 'dead');
const waterPts = [];
MAPS.village.rows.forEach((r, y) => { [...r].forEach((c, x) => { if (c === '3') waterPts.push(x + ',' + y); }); });
ok('契约：village 水塘 WATER 格恰 6 格（(14..18,6)/(14..16,7)）', waterPts.length === 6 && waterPts.sort().join('|') === '14,7|15,7|16,6|16,7|17,6|18,6',
  waterPts.sort().join('|'));
ok('契约：at(16,6) === TY.WATER（水塘格仍是水，零碰撞变化）', at(16, 6) === TY.WATER);
ok('契约：TY.WATER 在 SOLID（不可行走，语义未动）', SOLID.has(TY.WATER));
ok('契约：广场大灯 (14,9) PATH / 村井 (14,6) GRASS / 喷泉 (12,6) FOUNTAIN 零回归', at(14, 9) === TY.PATH && at(14, 6) === TY.GRASS && at(12, 6) === TY.FOUNTAIN);
loadMap('village');
ok('契约：loadMap 重载后 at(16,6) 仍 WATER / at(14,6) 仍 GRASS（重载重建）',
  at(16, 6) === TY.WATER && at(14, 6) === TY.GRASS);
ok('契约：NPC 总数保持 34（零 NPC 变更，v22.51 pin 续守）', Object.keys(NPC_SPOTS).length === 34,
  String(Object.keys(NPC_SPOTS).length));

// —— README / package.json / CHANGELOG 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树收录 smoke_v2257_pondglow 且位于串尾（v2255 连续保留）',
  readme.includes('smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow（npm test 串跑）'));
ok('README 件套口径为一百五十三件套（一百五十二件套清除）',
  readme.includes('冒烟一百五十三件套（一百五十二件套清除）') && !readme.includes('冒烟一百五十二件套（一百五十一件套清' + '除）'));
ok('README 含 v22.57 守护描述（潮灯镇水塘灯影景观守护）', readme.includes('v22.57 起含潮灯镇水塘灯影景观守护'));
ok('README 含 smoke_v2257_pondglow 入库（153 份）', readme.includes('smoke_v2257_pondglow 入库（153 份）'));
ok('README 仍保留 v22.56 守护描述与入库（152 份）（历史口径不漂移）',
  readme.includes('v22.56 起含雾语林营地篝火景观守护') && readme.includes('smoke_v2256_campfire 入库（152 份）'));
ok('README 潮灯镇地图行含水塘灯影口径（v22.57）',
  readme.includes('水塘灯影**（v22.57 起世界画面可见') && readme.includes('(14..18,6)'));
ok('README 视觉 bullet 含水塘灯影景观（v22.57）', readme.includes('水塘灯影景观**（v22.57'));
ok('package.json 已收录 smoke_v2257_pondglow（npm test 串跑第 153 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2257_pondglow.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 153 件套', testChain === 153, String(testChain));
ok('CHANGELOG 含 v22.57 条目', changelog.includes('## v22.57 '));

// —— 姊妹 pin 复查（v2256..v2226 随新现实更新，含 v2228/v2229/v2230 三风格锚与 v2239/v2240 容错正则尾锚）——
const s2256 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2256_campfire.mjs'), 'utf8');
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
ok('smoke_v2256 的 GAME_VERSION 字面量 pin 已更新为 v22.57', s2256.includes("const GAME_VERSION = 'v22.57';"));
ok('smoke_v2256 的 README 串尾 pin 已随新现实延伸至 smoke_v2257_pondglow',
  s2256.includes('smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow（npm test 串跑）'));
ok('smoke_v2256 的 README 件套 pin 已随新现实更新为一百五十三件套（一百五十二件套清除）',
  s2256.includes('一百五十三件套（一百五十二件套清除）'));
ok('smoke_v2256 的 package.json 件套计数 pin 已更新为 === 153', s2256.includes('testChain === 153'));
ok('smoke_v2256 的 CHANGELOG 顶 pin 已更新为 ## v22.57', s2256.includes("startsWith('## v22.57')"));
ok('smoke_v2230 的 package.json 串尾 plain pin 已延伸至 smoke_v2257_pondglow',
  s2230.includes('smoke_v2256_campfire.mjs && node tests\\/smoke_v2257_pondglow.mjs"'));
ok('smoke_v2255 的 GAME_VERSION 字面量 pin 已更新为 v22.57', s2255.includes("const GAME_VERSION = 'v22.57';"));
ok('smoke_v2255 的 README 串尾 pin 已延伸至 smoke_v2257_pondglow',
  s2255.includes('smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow（npm test 串跑）'));
ok('smoke_v2254 的 GAME_VERSION 字面量 pin 已更新为 v22.57', s2254.includes("const GAME_VERSION = 'v22.57';"));
ok('smoke_v2254 的 README 串尾 pin 已延伸至 smoke_v2257_pondglow',
  s2254.includes('smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow（npm test 串跑）'));
ok('smoke_v2253 的 GAME_VERSION 字面量 pin 已更新为 v22.57', s2253.includes("const GAME_VERSION = 'v22.57';"));
ok('smoke_v2253 的 README 串尾 pin 已延伸至 smoke_v2257_pondglow',
  s2253.includes('smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow（npm test 串跑）'));
ok('smoke_v2252 的 GAME_VERSION 字面量 pin 已更新为 v22.57', s2252.includes("const GAME_VERSION = 'v22.57';"));
ok('smoke_v2252 的 README 串尾 pin 已延伸至 smoke_v2257_pondglow',
  s2252.includes('smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow（npm test 串跑）'));
ok('smoke_v2242 的 README 串尾 pin 已延伸至 smoke_v2257_pondglow',
  s2242.includes('smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow（npm test 串跑）'));
// 串尾锚延伸（任意转义风格：plain `/` / regex `\/` / 双转义 `\\/`）
const archChain = (s) => /smoke_v2254_grainfield[.\\]{0,4}mjs[\s\S]*?node tests[\\/]{0,4}smoke_v2257_pondglow[.\\]{0,4}mjs/.test(s);
ok('smoke_v2226/v2228/v2229/v2230/v2239/v2240/v2242 的串尾锚已延伸至 smoke_v2257_pondglow（plain/regex/双转义三风格）',
  archChain(s2226) && archChain(s2228) && archChain(s2229) && archChain(s2230) && archChain(s2239) &&
  archChain(s2240) && archChain(s2242));
// 容错正则尾锚（v2239/v2240 宽松模式：smoke_v2254_grainfield 后 [\s\S]*? 再接 smoke_v2257_pondglow）
const looseChain = (s) => /smoke_v2254_grainfield[.\\]{0,6}mjs[\s\S]*?node tests[\\/]{0,6}smoke_v2257_pondglow[.\\]{0,6}mjs/.test(s);
ok('smoke_v2239/smoke_v2240 的容错正则尾锚已延伸至 smoke_v2257_pondglow',
  looseChain(s2239) && looseChain(s2240));
ok('v2143-45「件套守护领先一位」哨兵链已推进至 154（一百五十四件套（一百五十三件套清除））',
  s2143.includes('一百五十四件套（一百五十三件套清除）') && s2143.includes("!readme.includes('一百五十四件套')"));
ok('smoke_v2228 的 GAME_VERSION 字面量 pin 已更新为 v22.57 且旧代零残留复查仍在（v22.27 风格）',
  s2228.includes("const GAME_VERSION = 'v22.57';") && s2228.includes("'v22." ) && s2228.includes("27';"));
ok('smoke_v2256 的旧代零残留扫描已指向 v22.56（字面量/恒等/件套/串尾/testChain）',
  s2256.includes("const GAME_VERSION = 'v22.\" + \"56';") &&
  s2256.includes("一百五十二件套（一百五十一件套清' + '除）'") &&
  s2256.includes("smoke_v2256_campfire（npm test 串' + '跑）')) stale.push(f);\")"));

// 旧代 v22.56 pin 全库零残留（字面量/恒等/件套/串尾/testChain）
const allTests = fs.readdirSync(path.join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs'));
const stale = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "56';") || src.includes("GAME_VERSION === 'v22." + "56'") ||
      src.includes('一百五十二件套（一百五十一件套清' + '除）') || src.includes('testChain === ' + '152') ||
      src.includes('smoke_v2256_campfire（npm test 串' + '跑）')) stale.push(f);
}
ok('旧代 v22.56 字面量/恒等/件套/串尾/testChain pin 全库零残留（' + allTests.length + ' 件扫描，含本件）', stale.length === 0, stale.join(','));
// 坏链防回归：README 不得出现 v2256 孤尾（其后必须直接接 v2257）
ok('README 串尾无孤尾（smoke_v2256_campfire 后必须接 smoke_v2257_pondglow）',
  !readme.includes('smoke_v2256_campfire（npm test 串' + '跑）'));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
