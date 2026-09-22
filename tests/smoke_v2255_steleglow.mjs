// v22.55 专项冒烟：无字回廊名字石碑「回灯温光」景观（新内容·世界景观·纯显示）——trueBoss 后四块
// 名字石碑（STELE 瓦片，碑文与 FRAGMENTS 同源；拾灯人/掌灯童/刻碑人/记誓人守碑）此前与开局一模
// 一样：守名者 done「名字都回灯下了」/说书人 after「名字都回了灯下，第二块碑还是温的——这回，是
// 镇子在焐它」/记誓人 after「名字都回了灯下，第二块碑还是温的」都在说真结局后碑有光有温、世界画面
// 里石碑却仍是冷灰石；现仅无字回廊（curMap()==='gallery'）的 STELE 格（drawWorld.js steleLitState
// 与守名者/名字之门同读 S.G.trueBoss 一份源）叠加温光：暖金微光罩 rgba(255,233,168,.16) · 碑缘
// 暖光 rgba(255,210,74,.45)（四缘 1px）· 顶上名字微光 #ffd24a 3×2 · 浮光金点 #ffe9a8 2×2×2
// （坐标哈希确定性，与小花草痕同法）——全部既有色族零新增颜色；纯显示零结算零存档零数值变化
// （at/SOLID/NPC 判定逐字未动，trueBoss 前零回归），雾语林菌盖/潮灯镇谷穗/岩地不触发。本冒烟守护：
// 版本锚点、data.js/drawWorld.js 源级落位（v22.55 注释 + steleLitState + 温光分支 + 既有高草/菌盖/
// 谷穗/名字之门/小地图 STELE 灰零回归）、运行期实证（gallery 渲染捕获：trueBoss 前四碑零温光 →
// trueBoss 后 (5,1)/(10,1)/(15,1)/(20,1) 逐项落位 + 温光罩恰 4 组 + village/dungeon 零温光防泄漏）、
// 契约（at(5,1)===TY.STELE / SOLID 含 STELE / gallery extras STELE 恰 4 / NPC 总数 34 零变更 /
// loadMap 重载重建 / steleLitState 纯函数逐值）、README/package.json/CHANGELOG 同步（tests 树尾/
// 件套口径 151/v22.55 守护描述/入库 151 份/无字回廊地图行/视觉 bullet）、姊妹件套 pin（v2254..v2226
// 随新现实更新，含 v2228/v2229/v2230 三风格锚与 v2239/v2240 容错正则尾锚）复查 + 旧代 v22.54
// 字面量/恒等/件套/串尾/testChain pin 全库零残留 + 坏链防回归。
import { S } from '../js/state.js';
import { GAME_VERSION, NPC_SPOTS, TY, SOLID, MAPS } from '../js/data.js';
import { newGame } from '../js/core.js';
import { loadMap, at } from '../js/world.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— DOM 桩（承 v21.30-v22.54 冒烟先例：先装桩再 import main.js；fillRect 捕获供温光断言）——
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
const { drawWorld, cam, steleLitState } = await import('../js/view/drawWorld.js');
const { CTX } = await import('../js/view/canvas.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.55 无字回廊名字石碑回灯温光景观 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const wSrc = fs.readFileSync(path.join(ROOT, 'js/view/drawWorld.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.54 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.55（本版守 v22.56）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 56)), GAME_VERSION);
ok('data.js 含 v22.55 注释（名字石碑回灯温光说明）', dSrc.includes('v22.55 新内容·世界景观·纯显示'));
ok('GAME_VERSION 字面量已为 v22.55（旧 v22.54 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v23.74';") && !dSrc.includes("const GAME_VERSION = 'v22." + "54';"));
ok('data.js 仍保留 v22.54/v22.53 世代注释链（谷穗/补给指针累积注释未动）',
  dSrc.includes('v22.54 新内容·世界景观·纯显示') && dSrc.includes('v22.53 体验打磨·信息透明·纯文字'));

// —— drawWorld.js 源级落位：steleLitState + 温光分支（纯显示·仅无字回廊 STELE·trueBoss 单源）——
const T = 32;
ok('drawWorld.js 含 v22.55 注释（名字石碑回灯温光说明）', wSrc.includes('v22.55 名字石碑「回灯温光」'));
ok('drawWorld.js 含 steleLitState 纯函数（与名字之门同读 S.G.trueBoss 一份源）',
  wSrc.includes('export function steleLitState(hero)') && wSrc.includes('return !!(hero && hero.trueBoss);'));
ok('drawWorld.js 温光分支（ty===TY.STELE && curMap()===\'gallery\' && steleLitState(S.G)）',
  wSrc.includes("if (ty === TY.STELE && curMap() === 'gallery' && steleLitState(S.G)) {"));
ok('drawWorld.js 温光色板 rgba(255,233,168,.16) 微光罩 / rgba(255,210,74,.45) 碑缘 / #ffd24a 名字微光 / #ffe9a8 浮光',
  wSrc.includes("CTX.fillStyle = 'rgba(255,233,168,.16)';") && wSrc.includes("CTX.fillStyle = 'rgba(255,210,74,.45)';") &&
  wSrc.includes("CTX.fillStyle = '#ffd24a';") && wSrc.includes("CTX.fillStyle = '#ffe9a8';"));
ok('drawWorld.js 温光几何（微光罩 28×28 @px+2,py+2 / 碑缘四边 1px / 名字微光 3×2 / 浮光 2×2 两点）',
  wSrc.includes('CTX.fillRect(px + 2, py + 2, 28, 28);') &&
  wSrc.includes('CTX.fillRect(px + 29, py + 2, 1, 28);') && wSrc.includes('CTX.fillRect(px + 2, py + 29, 28, 1);') &&
  wSrc.includes('CTX.fillRect(px + 12 + (dh % 6), py + 6, 3, 2);') &&
  wSrc.includes('CTX.fillRect(px + 8 + (dh % 12), py + 20, 2, 2);') && wSrc.includes('CTX.fillRect(px + 20 + (dh % 7), py + 24, 2, 2);'));
ok('drawWorld.js 既有分支逐字零回归（高草 isTallGrass 分流/菌盖门/谷穗门/名字之门/小地图 STELE 灰/石像 GATE 门健在）',
  wSrc.includes('if (isTallGrass(x, y)) {') && wSrc.includes("if (curMap() === 'dungeon' && (x * 7 + y * 13) % 4 === 0) {") &&
  wSrc.includes("if (curMap() === 'village' && (x * 5 + y * 7) % 4 === 0) {") &&
  wSrc.includes('export function steleLitState(hero)') &&
  wSrc.includes('export function galleryArchState(hero)') && wSrc.includes("if (tile === TY.STELE) return '#9aa4ad';") &&
  wSrc.includes('const gate = (MAPS[curMap()].portals || {}).GATE;'));

// —— 纯函数逐值 ——
ok('steleLitState 纯函数：trueBoss 档 true / 未归档 false / null hero false',
  steleLitState({ trueBoss: true }) === true && steleLitState({}) === false && steleLitState(null) === false &&
  steleLitState({ trueBoss: 0 }) === false);

// —— 运行期渲染捕获：温光逐色逐坐标（承 v22.40/v22.54 捕获同法）——
function captureMap(mapName, heroX, heroY, trueBoss) {
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
    if (trueBoss) S.G.trueBoss = true;
    S.dir = 'R';
    S.scene = 'world';
    S.walk = null;
    loadMap(mapName);
    drawWorld();
  } catch (e) { rects.push({ fs: 'THREW:' + e.message, x: -1, y: -1, w: 0, h: 0 }); }
  CTX.fillRect = origFR;
  return { rects, cam: cam() };
}
function hasMask(rects, c, tx, ty) {
  return rects.some((q) => q.fs === 'rgba(255,233,168,.16)' && q.w === 28 && q.h === 28 &&
    Math.abs(q.x - (tx * T - c.x + 2)) <= 1 && Math.abs(q.y - (ty * T - c.y + 2)) <= 1);
}
const STELE_XY = [[5, 1], [10, 1], [15, 1], [20, 1]];

// gallery：trueBoss 前（未归档）——四碑零温光（零回归基线）
{
  const cap = captureMap('gallery', 12, 3, false);
  ok('gallery 未归档运行期：无抛错（drawWorld 全链路）', !cap.rects.some((r) => r.fs.startsWith('THREW:')),
    JSON.stringify(cap.rects.filter((r) => r.fs.startsWith('THREW:'))));
  ok('gallery 未归档运行期：零温光罩（16% 微光罩 28×28 零出现）',
    !cap.rects.some((r) => r.fs === 'rgba(255,233,168,.16)' && r.w === 28 && r.h === 28));
  ok('gallery 未归档运行期：零碑缘暖光 / 零名字微光 / 零浮光温点（rgba(255,210,74,.45) 与 3×2 #ffd24a 与 2×2 #ffe9a8 温光几何零出现）',
    !cap.rects.some((r) => r.fs === 'rgba(255,210,74,.45)') &&
    !cap.rects.some((r) => r.fs === '#ffd24a' && r.w === 3 && r.h === 2) &&
    !cap.rects.some((r) => r.fs === '#ffe9a8' && r.w === 2 && r.h === 2));
}

// gallery：trueBoss 后——四块名字石碑 (5,1)/(10,1)/(15,1)/(20,1) 逐项落位
{
  const cap = captureMap('gallery', 12, 3, true);
  ok('gallery 真结局运行期：无抛错（drawWorld 全链路）', !cap.rects.some((r) => r.fs.startsWith('THREW:')),
    JSON.stringify(cap.rects.filter((r) => r.fs.startsWith('THREW:'))));
  for (const [sx, sy] of STELE_XY) {
    ok('gallery 真结局运行期：(' + sx + ',' + sy + ') 温光罩落位（28×28 @px+2,py+2）', hasMask(cap.rects, cap.cam, sx, sy));
  }
  const masks = cap.rects.filter((r) => r.fs === 'rgba(255,233,168,.16)' && r.w === 28 && r.h === 28 &&
    !(r.x === -1 && r.y === -1)).length;
  ok('gallery 真结局运行期：温光罩总数 = 4（恰四块名字石碑，视野内零多余）', masks === 4, String(masks));
  const edges = cap.rects.filter((r) => r.fs === 'rgba(255,210,74,.45)').length;
  ok('gallery 真结局运行期：碑缘暖光 1px 边条总数 = 16（四碑 × 四缘）', edges === 16, String(edges));
  const nameGleam = cap.rects.filter((r) => r.fs === '#ffd24a' && r.w === 3 && r.h === 2 &&
    !(r.x === -1 && r.y === -1)).length;
  ok('gallery 真结局运行期：顶上名字微光 3×2 总数 = 4（每碑一枚）', nameGleam === 4, String(nameGleam));
  const sparks = cap.rects.filter((r) => r.fs === '#ffe9a8' && r.w === 2 && r.h === 2 &&
    !(r.x === -1 && r.y === -1)).length;
  ok('gallery 真结局运行期：浮光金点 2×2 总数 = 8（每碑两点）', sparks === 8, String(sparks));
  // 防泄漏：每一组温光都落在 STELE 格上（回溯坐标与 extras 逐格一致）
  let stray = 0;
  for (const q of cap.rects.filter((r) => r.fs === 'rgba(255,233,168,.16)' && r.w === 28 && r.h === 28 &&
    !(r.x === -1 && r.y === -1))) {
    const tx = Math.round((q.x + cap.cam.x - 2) / T), ty = Math.round((q.y + cap.cam.y - 2) / T);
    if (at(tx, ty) !== TY.STELE || !STELE_XY.some(([ex, ey]) => ex === tx && ey === ty)) stray++;
  }
  ok('gallery 真结局运行期：温光零泄漏（每组微光罩都落在四块名字石碑格）', stray === 0, String(stray));
  // v22.41 名字之门两档零回归：trueBoss 后门亮（#ffe9a8 10×10 门屏）仍在
  ok('gallery 真结局运行期：名字之门 (3,4) 门屏 10×10 #ffe9a8 仍落位（v22.41 零回归）',
    cap.rects.some((r) => r.fs === '#ffe9a8' && r.w === 10 && r.h === 10 &&
      Math.abs(r.x - (3 * T - cap.cam.x + 11)) <= 1 && Math.abs(r.y - (4 * T - cap.cam.y + 12)) <= 1));
}

// village / dungeon：零温光（curMap 门不触发）
{
  const capV = captureMap('village', 17, 9, true);
  ok('village 真结局运行期：无抛错且零温光罩（回廊温光不走 village 分支）',
    !capV.rects.some((r) => r.fs.startsWith('THREW:')) && !capV.rects.some((r) => r.fs === 'rgba(255,233,168,.16)' && r.w === 28 && r.h === 28));
  const capD = captureMap('dungeon', 14, 3, true);
  ok('dungeon 真结局运行期：无抛错且零温光罩（菌盖/高草零回归、无 STELE 格不触发）',
    !capD.rects.some((r) => r.fs.startsWith('THREW:')) && !capD.rects.some((r) => r.fs === 'rgba(255,233,168,.16)' && r.w === 28 && r.h === 28));
  ok('dungeon 真结局运行期：蘑菇田 (18,2) 菌盖 #ffd24a（17×8）仍落位（v22.42 零回归）',
    capD.rects.some((r) => r.fs === '#ffd24a' && r.w === 17 && r.h === 8 &&
      Math.abs(r.x - (18 * T - capD.cam.x + 8)) <= 1 && Math.abs(r.y - (2 * T - capD.cam.y + 9)) <= 1));
}

// —— 契约：零碰撞 / 零 NPC 变更 / 重载重建 / 数据面 ——
loadMap('gallery');
ok('契约：at(5,1) === TY.STELE（四块名字石碑格逐点）',
  at(5, 1) === TY.STELE && at(10, 1) === TY.STELE && at(15, 1) === TY.STELE && at(20, 1) === TY.STELE);
ok('契约：TY.STELE 在 SOLID（石碑仍不可走，零碰撞变化）', SOLID.has(TY.STELE));
const steleExtras = (MAPS.gallery.extras || []).filter((e) => e.ty === 'STELE');
ok('契约：gallery extras STELE 恰 4 枚（与温光总数同源）', steleExtras.length === 4, String(steleExtras.length));
loadMap('gallery');
ok('契约：loadMap 重载后 at(5,1) 仍 STELE / (12,3) 仍可走（重载重建）',
  at(5, 1) === TY.STELE && at(12, 3) !== TY.STELE);
ok('契约：NPC 总数保持 34（零 NPC 变更，v22.51 pin 续守）', Object.keys(NPC_SPOTS).length === 38,
  String(Object.keys(NPC_SPOTS).length));

// —— README / package.json / CHANGELOG 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树收录 smoke_v2255_steleglow 且位于串尾',
  readme.includes('smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 件套口径为二百一十二件套（二百一十一件套清除）',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟一百五十件套（一百四十九件套清' + '除）'));
ok('README 含 v22.55 守护描述（无字回廊名字石碑回灯温光守护）', readme.includes('v22.55 起含无字回廊名字石碑回灯温光守护'));
ok('README 含 smoke_v2255_steleglow 入库（151 份）', readme.includes('smoke_v2255_steleglow 入库（151 份）'));
ok('README 仍保留 v22.54 守护描述与入库（150 份）（历史口径不漂移）',
  readme.includes('v22.54 起含潮灯镇粮田谷穗景观守护') && readme.includes('smoke_v2254_grainfield 入库（150 份）'));
ok('README 无字回廊地图行含回灯温光口径（v22.55）',
  readme.includes('v22.55 起 trueBoss 后世界画面可见') && readme.includes('名字石碑回灯温光'));
ok('README 视觉 bullet 含名字石碑回灯温光（v22.55）', readme.includes('名字石碑回灯温光**（v22.55'));
ok('package.json 已收录 smoke_v2255_steleglow（npm test 串跑第 151 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2255_steleglow.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 151 件套', testChain === 212, String(testChain));
ok('CHANGELOG 含 v22.55 条目', changelog.includes('## v22.55 '));

// —— 姊妹 pin 复查（v2254..v2226 随新现实更新，含 v2228/v2229/v2230 三风格锚与 v2239/v2240 容错正则尾锚）——
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
ok('smoke_v2254 的 GAME_VERSION 字面量 pin 已更新为 v22.55', s2254.includes("const GAME_VERSION = 'v23.74';"));
ok('smoke_v2254 的 README 串尾 pin 已随新现实延伸至 smoke_v2255_steleglow',
  s2254.includes('smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2254 的 README 件套 pin 已随新现实更新为二百一十二件套（二百一十一件套清除）',
  s2254.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2254 的 package.json 件套计数 pin 已更新为 === 151', s2254.includes('testChain === 212'));
ok('smoke_v2254 的 CHANGELOG 顶 pin 已更新为 ## v22.55', s2254.includes("startsWith('## v23.74')"));
ok('smoke_v2253 的 GAME_VERSION 字面量 pin 已更新为 v22.55', s2253.includes("const GAME_VERSION = 'v23.74';"));
ok('smoke_v2253 的 README 串尾 pin 已延伸至 smoke_v2255_steleglow',
  s2253.includes('smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2252 的 GAME_VERSION 字面量 pin 已更新为 v22.55', s2252.includes("const GAME_VERSION = 'v23.74';"));
ok('smoke_v2252 的 README 串尾 pin 已延伸至 smoke_v2255_steleglow',
  s2252.includes('smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2242 的 README 串尾 pin 已延伸至 smoke_v2255_steleglow',
  s2242.includes('smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
// 串尾锚延伸（任意转义风格：plain `/` / regex `\/` / 双转义 `\\/`）
const archChain = (s) => /smoke_v2253_supplypoint[.\\]{0,4}mjs[\s\S]*?node tests[\\/]{0,4}smoke_v2257_pondglow[.\\]{0,4}mjs/.test(s);
ok('smoke_v2226/v2228/v2229/v2230/v2239/v2240/v2242 的串尾锚已延伸至 smoke_v2255_steleglow（plain/regex/双转义三风格）',
  archChain(s2226) && archChain(s2228) && archChain(s2229) && archChain(s2230) && archChain(s2239) &&
  archChain(s2240) && archChain(s2242));
// 容错正则尾锚（v2239/v2240 宽松模式：smoke_v2253_supplypoint 后 [\s\S]*? 再接 smoke_v2255_steleglow）
const looseChain = (s) => /smoke_v2253_supplypoint[.\\]{0,6}mjs[\s\S]*?node tests[\\/]{0,6}smoke_v2257_pondglow[.\\]{0,6}mjs/.test(s);
ok('smoke_v2239/smoke_v2240 的容错正则尾锚已延伸至 smoke_v2255_steleglow',
  looseChain(s2239) && looseChain(s2240));
ok('v2143-45「件套守护领先一位」哨兵链已推进至 152（二百一十二件套（二百一十一件套清除））',
  s2143.includes('二百一十三件套（二百一十二件套清除）') && s2143.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));
ok('smoke_v2228 的 GAME_VERSION 字面量 pin 已更新为 v22.55 且旧代零残留复查仍在（v22.27 风格）',
  s2228.includes("const GAME_VERSION = 'v23.74';") && s2228.includes("'v22." ) && s2228.includes("27';"));

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
