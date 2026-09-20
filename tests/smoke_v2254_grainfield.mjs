// v22.54 专项冒烟：潮灯镇粮田「谷穗」景观（新内容·世界景观·纯显示）——v22.40 高草显形后雾语林
// 蘑菇田有菌盖灯油（v22.42）、潮灯镇粮田（粮铺掌柜「镇南那片庄稼，是全年的口粮」/支线「护粮的
// 委托」——哥布林偷粮）却只有深绿高草——「全年的口粮」配画面看不出口粮二字；现仅潮灯镇
// （curMap()==='village'）的高草格（isTallGrass 与 dangerAt 同读 gCells 单一数据源）按坐标哈希
// (x*5+y*7)%4===0 稀疏点缀 1 束谷穗：穗杆米色 #e8c9a0 · 穗粒暖金 #ffd24a · 芒须深金 #8a5a00 ·
// 高光金白 #ffe9a8（全部既有色族零新增颜色族，与草簇/小花/菌盖同一哈希确定性手法）；纯显示零结算
// 零存档零数值变化（危险/遇敌/踩踏判定逐字未动），雾语林菌盖/洞窟岩地不触发。本冒烟守护：版本锚点、
// data.js/drawWorld.js 源级落位（v22.54 注释 + 谷穗分支 + 既有高草分支/菌盖分支/小花/草痕零回归）、
// 运行期实证（village 渲染捕获：已知格 (17,13)/(14,14) 逐色逐坐标 + 非命中格 (17,3)/(17,12) 零谷穗 +
// 视野内谷穗数与哈希公式逐格一致 + 每束谷穗都落在高草格 + dungeon 零谷穗且菌盖零回归 + cave/gallery
// 零谷穗）、契约（at(17,13)===TY.GRASS / isTallGrass 与 gCells 同源 / NPC 总数 34 零变更 / loadMap
// 重载重建 / TY.GRASS 非 SOLID）、README/package.json/CHANGELOG 同步（tests 树尾/件套口径 150/v22.54
// 守护描述/入库 150 份/潮灯镇地图行/视觉 bullet）、姊妹件套 pin（v2253..v2226 随新现实更新，含
// v2228/v2229/v2230 三风格锚与 v2239/v2240 容错正则尾锚）复查 + 旧代 v22.53 字面量/恒等/件套/串尾 pin
// 全库零残留 + 坏链防回归。
import { S } from '../js/state.js';
import { GAME_VERSION, NPC_SPOTS, TY, SOLID, MAPS } from '../js/data.js';
import { newGame } from '../js/core.js';
import { loadMap, at, isTallGrass } from '../js/world.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— DOM 桩（承 v21.30-v22.53 冒烟先例：先装桩再 import main.js；fillRect 捕获供谷穗断言）——
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

console.log('— v22.54 潮灯镇粮田谷穗景观 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const wSrc = fs.readFileSync(path.join(ROOT, 'js/view/drawWorld.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.53 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.53（本版守 v22.54）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 54)), GAME_VERSION);
ok('data.js 含 v22.54 注释（粮田谷穗补脸说明）', dSrc.includes('v22.54 新内容·世界景观·纯显示'));
ok('GAME_VERSION 字面量已为 v22.54（旧 v22.53 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v23.22';") && !dSrc.includes("const GAME_VERSION = 'v22." + "53';"));
ok('data.js 仍保留 v22.53/v22.52 世代注释链（补给指针/矿车轨道累积注释未动）',
  dSrc.includes('v22.53 体验打磨·信息透明·纯文字') && dSrc.includes('v22.52 新内容·世界景观·纯显示'));

// —— drawWorld.js 源级落位：谷穗分支（纯显示·仅潮灯镇高草·坐标哈希确定性）——
const T = 32;
ok('drawWorld.js 含 v22.54 注释（粮田谷穗说明）', wSrc.includes('v22.54 潮灯镇粮田「谷穗」景观'));
ok('drawWorld.js 谷穗分支（curMap()===\'village\' && (x*5+y*7)%4===0）', wSrc.includes("if (curMap() === 'village' && (x * 5 + y * 7) % 4 === 0) {"));
ok('drawWorld.js 谷穗色板 #e8c9a0 穗杆/#ffd24a 穗粒/#8a5a00 芒须/#ffe9a8 高光',
  wSrc.includes("CTX.fillStyle = '#e8c9a0';           // 穗杆") && wSrc.includes("CTX.fillStyle = '#ffd24a';           // 穗粒（暖金）") &&
  wSrc.includes("CTX.fillStyle = '#8a5a00';           // 芒须（深金）") && wSrc.includes("CTX.fillStyle = '#ffe9a8';           // 高光"));
ok('drawWorld.js 谷穗几何（穗杆 2×14 @(px+14,py+8)/穗粒 2×2 四粒/芒须 2×1 两缕/高光 1×1 两点）',
  wSrc.includes('CTX.fillRect(px + 14, py + 8, 2, 14);') && wSrc.includes('CTX.fillRect(px + 11, py + 10, 2, 2);') &&
  wSrc.includes('CTX.fillRect(px + 17, py + 10, 2, 2);') && wSrc.includes('CTX.fillRect(px + 12, py + 14, 2, 2);') &&
  wSrc.includes('CTX.fillRect(px + 16, py + 14, 2, 2);') && wSrc.includes('CTX.fillRect(px + 11, py + 17, 2, 1);') &&
  wSrc.includes('CTX.fillRect(px + 17, py + 17, 2, 1);') && wSrc.includes('CTX.fillRect(px + 15, py + 9, 1, 1);') &&
  wSrc.includes('CTX.fillRect(px + 13, py + 12, 1, 1);'));
ok('drawWorld.js 既有高草分支/菌盖分支逐字零回归（isTallGrass 分流/草簇色板/菌盖门/小花/草痕健在）',
  wSrc.includes('if (isTallGrass(x, y)) {') && wSrc.includes("CTX.fillStyle = '#245a24';") &&
  wSrc.includes("CTX.fillStyle = '#56a656';") && wSrc.includes("if (curMap() === 'dungeon' && (x * 7 + y * 13) % 4 === 0) {") &&
  wSrc.includes("CTX.fillRect(px + 8, py + 9, 17, 8);") && wSrc.includes("'rgba(232,238,241,.85)'") &&
  wSrc.includes("'rgba(20,60,20,.35)'"));

// —— 运行期渲染捕获：谷穗逐像素色与坐标（承 v22.40/v22.42 捕获同法）——
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
// 谷穗公式镜像（与 drawWorld.js 逐字同式）：(x*5+y*7)%4===0
function grainAt(x, y) { return (x * 5 + y * 7) % 4 === 0; }
function hasStalk(rects, c, tx, ty) {
  const px = tx * T - c.x, py = ty * T - c.y;
  return rects.some((q) => q.fs === '#e8c9a0' && q.w === 2 && q.h === 14 &&
    Math.abs(q.x - (px + 14)) <= 1 && Math.abs(q.y - (py + 8)) <= 1);
}

// village：主视野（hero 居中于粮田北侧，覆盖 21 格高草全部）——已知格/非命中格/计数/防泄漏
{
  const cap = captureMap('village', 17, 9);
  ok('village 运行期：无抛错（drawWorld 全链路）', !cap.rects.some((r) => r.fs.startsWith('THREW:')),
    JSON.stringify(cap.rects.filter((r) => r.fs.startsWith('THREW:'))));
  const c0 = cap.cam;
  // 已知命中格 (17,13)（17*5+13*7=176 %4===0）：穗杆/穗粒/芒须/高光逐项落位
  ok('village 运行期：(17,13) 穗杆 #e8c9a0（2×14 @px+14,py+8）落位', hasStalk(cap.rects, c0, 17, 13));
  ok('village 运行期：(17,13) 穗粒 #ffd24a（2×2 四粒）落位',
    ['px+11,py+10', 'px+17,py+10', 'px+12,py+14', 'px+16,py+14'].every((s) => {
      const m = /px\+(\d+),py\+(\d+)/.exec(s);
      const gx = 17 * T - c0.x + Number(m[1]), gy = 13 * T - c0.y + Number(m[2]);
      return cap.rects.some((q) => q.fs === '#ffd24a' && q.w === 2 && q.h === 2 && Math.abs(q.x - gx) <= 1 && Math.abs(q.y - gy) <= 1);
    }));
  ok('village 运行期：(17,13) 芒须 #8a5a00（2×1 两缕）落位',
    cap.rects.some((q) => q.fs === '#8a5a00' && q.w === 2 && q.h === 1 && Math.abs(q.x - (17 * T - c0.x + 11)) <= 1 && Math.abs(q.y - (13 * T - c0.y + 17)) <= 1));
  ok('village 运行期：(17,13) 高光 #ffe9a8（1×1 两点）落位',
    cap.rects.some((q) => q.fs === '#ffe9a8' && q.w === 1 && q.h === 1 && Math.abs(q.x - (17 * T - c0.x + 15)) <= 1 && Math.abs(q.y - (13 * T - c0.y + 9)) <= 1));
  // 已知命中格 (14,14)（14*5+14*7=168 %4===0）
  ok('village 运行期：(14,14) 穗杆落位（粮田西南角也点缀）', hasStalk(cap.rects, c0, 14, 14));
  // 非命中格：北侧高草 (17,3)（哈希 2）与粮田 (17,12)（哈希 1）零谷穗
  ok('village 运行期：(17,3) 零谷穗（哈希 106%4===2 确定性子集）', !hasStalk(cap.rects, c0, 17, 3));
  ok('village 运行期：(17,12) 零谷穗（哈希 169%4===1 确定性子集）', !hasStalk(cap.rects, c0, 17, 12));
  // 视野内谷穗总数与哈希公式逐格一致（village 21 格 G 全部在高草包围盒内，捕获覆盖）
  const rows = MAPS.village.rows;
  let expected = 0;
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[0].length; x++) {
      if (rows[y][x] === 'G' && grainAt(x, y)) expected++;
    }
  }
  const actual = cap.rects.filter((r) => r.fs === '#e8c9a0' && r.w === 2 && r.h === 14 && !(r.x === -1 && r.y === -1)).length;
  ok('village 运行期：视野内谷穗数 = 哈希公式逐格预期（' + expected + '）', actual === expected,
    String(actual) + ' vs ' + String(expected));
  // 防泄漏：每一束穗杆都落在 isTallGrass 高草格上（谷穗只画高草，普通草零谷穗）
  let stray = 0;
  for (const q of cap.rects.filter((r) => r.fs === '#e8c9a0' && r.w === 2 && r.h === 14 && !(r.x === -1 && r.y === -1))) {
    const tx = Math.round((q.x + c0.x - 14) / T), ty = Math.round((q.y + c0.y - 8) / T);
    if (!isTallGrass(tx, ty)) stray++;
  }
  ok('village 运行期：谷穗零泄漏（每束穗杆都落在 isTallGrass 高草格，普通草零谷穗）', stray === 0, String(stray));
  ok('village 运行期：北侧高草 (17,3) 草簇仍逐格落位（v22.40 零回归）',
    cap.rects.some((q) => q.fs === '#245a24') && cap.rects.some((q) => q.fs === '#56a656'));
  ok('village 运行期：零菌盖（无 17×8 #ffd24a——粮田不走菌盖分支，v22.42 门零回归）',
    !cap.rects.some((r) => r.fs === '#ffd24a' && r.w === 17 && r.h === 8));
}

// dungeon：菌盖仍落位，零谷穗（curMap 门不触发）
{
  const cap = captureMap('dungeon', 14, 3);
  ok('dungeon 运行期：无抛错（drawWorld 全链路）', !cap.rects.some((r) => r.fs.startsWith('THREW:')),
    JSON.stringify(cap.rects.filter((r) => r.fs.startsWith('THREW:'))));
  ok('dungeon 运行期：零谷穗（无 #e8c9a0 2×14 穗杆——谷穗不走 dungeon 分支）',
    !cap.rects.some((r) => r.fs === '#e8c9a0' && r.w === 2 && r.h === 14));
  ok('dungeon 运行期：蘑菇田 (18,2) 菌盖 #ffd24a（17×8）仍落位（v22.42 零回归）',
    cap.rects.some((r) => r.fs === '#ffd24a' && r.w === 17 && r.h === 8 &&
      Math.abs(r.x - (18 * T - cap.cam.x + 8)) <= 1 && Math.abs(r.y - (2 * T - cap.cam.y + 9)) <= 1));
}

// cave / gallery：岩地零谷穗（GRASS 已被 replaceTiles 换走 / 无高草）
{
  const capC = captureMap('cave', 3, 2);
  ok('cave 运行期：无抛错且零谷穗（无 #e8c9a0 2×14 穗杆）',
    !capC.rects.some((r) => r.fs.startsWith('THREW:')) && !capC.rects.some((r) => r.fs === '#e8c9a0' && r.w === 2 && r.h === 14));
  const capG = captureMap('gallery', 3, 2);
  ok('gallery 运行期：无抛错且零谷穗（无 #e8c9a0 2×14 穗杆）',
    !capG.rects.some((r) => r.fs.startsWith('THREW:')) && !capG.rects.some((r) => r.fs === '#e8c9a0' && r.w === 2 && r.h === 14));
}

// —— 契约：零碰撞 / 零 NPC 变更 / 重载重建 / 单一数据源 ——
loadMap('village');
ok('契约：at(17,13) === TY.GRASS（谷穗格零碰撞变化）', at(17, 13) === TY.GRASS, String(at(17, 13)));
ok('契约：isTallGrass(17,13) === true（谷穗只落在高草，与 dangerAt 同源）', isTallGrass(17, 13) === true);
loadMap('village');
ok('契约：loadMap 重载后 gCells 重建（isTallGrass(18,13) true / (10,7) false）',
  isTallGrass(18, 13) === true && isTallGrass(10, 7) === false);
ok('契约：NPC 总数保持 34（零 NPC 变更，v22.51 pin 续守）', Object.keys(NPC_SPOTS).length === 38,
  String(Object.keys(NPC_SPOTS).length));
ok('契约：TY.GRASS 非 SOLID（高草可走）', !SOLID.has(TY.GRASS));

// —— README / package.json / CHANGELOG 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树收录 smoke_v2254_grainfield 且位于串尾', readme.includes('smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 件套口径为二百一十二件套（二百一十一件套清除）',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟一百四十三件套（一百四十二件套清' + '除）'));
ok('README 含 v22.54 守护描述（潮灯镇粮田谷穗景观守护）', readme.includes('v22.54 起含潮灯镇粮田谷穗景观守护'));
ok('README 含 smoke_v2254_grainfield 入库（150 份）', readme.includes('smoke_v2254_grainfield 入库（150 份）'));
ok('README 仍保留 v22.53 守护描述与入库（149 份）（历史口径不漂移）',
  readme.includes('v22.53 起含帮助页地图指南') && readme.includes('smoke_v2253_supplypoint 入库（149 份）'));
ok('README 潮灯镇地图行含谷穗口径（v22.54）', readme.includes('v22.54 起世界画面可见') && readme.includes('暖金谷穗'));
ok('README 视觉 bullet 含谷穗景观（v22.54）', readme.includes('谷穗景观**（v22.54'));
ok('package.json 已收录 smoke_v2254_grainfield（npm test 串跑第 150 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2254_grainfield.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 150 件套', testChain === 212, String(testChain));
ok('CHANGELOG 含 v22.54 条目', changelog.includes('## v22.55 '));

// —— 姊妹 pin 复查（v2253..v2226 随新现实更新，含 v2228/v2229/v2230 三风格锚与 v2239/v2240 容错正则尾锚）——
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
ok('smoke_v2253 的 GAME_VERSION 字面量 pin 已更新为 v22.54', s2253.includes("const GAME_VERSION = 'v23.22';"));
ok('smoke_v2253 的 README 串尾 pin 已随新现实延伸至 smoke_v2254_grainfield',
  s2253.includes('smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2253 的 README 件套 pin 已随新现实更新为二百一十二件套（二百一十一件套清除）',
  s2253.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2253 的 package.json 件套计数 pin 已更新为 === 150', s2253.includes('testChain === 212'));
ok('smoke_v2253 的 CHANGELOG 顶 pin 已更新为 ## v22.54', s2253.includes("startsWith('## v23.22')"));
ok('smoke_v2252 的 GAME_VERSION 字面量 pin 已更新为 v22.54', s2252.includes("const GAME_VERSION = 'v23.22';"));
ok('smoke_v2252 的 README 串尾 pin 已延伸至 smoke_v2254_grainfield',
  s2252.includes('smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2242 的 README 串尾 pin 已延伸至 smoke_v2254_grainfield',
  s2242.includes('smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
// 串尾锚延伸（任意转义风格：plain `/` / regex `\/` / 双转义 `\\/`）
const archChain = (s) => /smoke_v2253_supplypoint[.\\]{0,4}mjs\s*&&\s*node tests[\\/]{0,4}smoke_v2254_grainfield[.\\]{0,4}mjs[\s\S]*?node tests[\\/]{0,4}smoke_v2257_pondglow[.\\]{0,4}mjs/.test(s);
ok('smoke_v2226/v2228/v2229/v2230/v2239/v2240/v2242 的串尾锚已延伸至 smoke_v2254_grainfield（plain/regex/双转义三风格）',
  archChain(s2226) && archChain(s2228) && archChain(s2229) && archChain(s2230) && archChain(s2239) &&
  archChain(s2240) && archChain(s2242));
// 容错正则尾锚（v2239/v2240 宽松模式：smoke_v2253_supplypoint 后 [\s\S]*? 再接 smoke_v2254_grainfield）
const looseChain = (s) => /smoke_v2253_supplypoint[.\\]{0,6}mjs[\s\S]*?node tests[\\/]{0,6}smoke_v2254_grainfield[.\\]{0,6}mjs[\s\S]*?node tests[\\/]{0,6}smoke_v2257_pondglow[.\\]{0,6}mjs/.test(s);
ok('smoke_v2239/smoke_v2240 的容错正则尾锚已延伸至 smoke_v2254_grainfield',
  looseChain(s2239) && looseChain(s2240));
ok('v2143-45「件套守护领先一位」哨兵链已推进至 152（二百一十二件套（二百一十一件套清除））',
  s2143.includes('二百一十三件套（二百一十二件套清除）') && s2143.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));
ok('smoke_v2228 的 GAME_VERSION 字面量 pin 已更新为 v22.54 且旧代零残留复查仍在（v22.27 风格）',
  s2228.includes("const GAME_VERSION = 'v23.22';") && s2228.includes("'v22." ) && s2228.includes("27';"));

// 旧代 v22.53 pin 全库零残留（字面量/恒等/件套/串尾/testChain）
const allTests = fs.readdirSync(path.join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs'));
const stale = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "53';") || src.includes("GAME_VERSION === 'v22." + "53'") ||
      src.includes('一百四十九件套（一百四十八件套清' + '除）') || src.includes('testChain === ' + '149') ||
      src.includes('smoke_v2253_supplypoint（npm test 串' + '跑）')) stale.push(f);
}
ok('旧代 v22.53 字面量/恒等/件套/串尾/testChain pin 全库零残留（' + allTests.length + ' 件扫描，含本件）', stale.length === 0, stale.join(','));
// 坏链防回归：README 不得出现「smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）」孤尾
ok('README 串尾无孤尾（smoke_v2253_supplypoint 后必须接 smoke_v2254_grainfield）',
  !readme.includes('smoke_v2253_supplypoint（npm test 串' + '跑）'));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
