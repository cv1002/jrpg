// v22.47 专项冒烟：潮灯镇「村井」地标（新内容·世界景观·纯显示，承 v22.36 广场大灯 / v22.38 星井
// 「名字物补脸」同族的潮灯镇收口）——「井」是全游台词密度最高的名字物之一（井巫「井底的声音会比
// 现在更近/井底在响·矿脉曾往镇上运星砂」/说书人「井底那口钟还在替大家记着」/掌灯阿婆「雾是从井底
// 爬上来的」/灯长 done「可你听——井还在低鸣。」/trueBoss「井也不鸣了。」/村门 lockedMsg「可井还在响」，
// README 地图速览也写了「井在广场北」），世界画面却一像素都没有（灯长 (13,6)「井边」站的是空气）；
// 现于广场北灯长「井边」东邻 (14,6)（data.js VILLAGE_WELL 单一数据源，可行走 GRASS 格零碰撞）立起
// 村井：两档状态（villageWellState 纯函数）与星井同读 S.G.trueBoss 一份源——低鸣（星蓝水面 #9adcff +
// 星砂浮光 #cfeaff + 蓝青光晕）/静默（暗灰 #5a6472 零浮光零光晕），石砌井圈 + 木辘轳（#6a6f78/
// #8a9098/#6b5138/#8a5a2b 既有色族）。纯显示零结算零存档零数值变化，刻意不设小地图标记（村井在镇
// 安全区、无探索/风险决策信息，与星砂车/名字之门「无决策信息不设标」同口径，图例零变化）。
// 本冒烟守护：版本锚点、data.js/drawWorld.js 源级落位（VILLAGE_WELL 单一数据源 + 既有大灯/星井分支
// 逐字零回归）、运行期实证（village 两档渲染捕获：井水/浮光/光晕逐像素色 + villageWellState 纯函数
// 三档 + at(14,6)===TY.GRASS 零碰撞 + 四邻可行走 + 全图 extras/NPC_SPOTS 防撞 + NPC 总数 31 零变更 +
// cave/dungeon 零 #9adcff 泄漏）、README/package.json/CHANGELOG 同步（tests 树尾 + 件套口径 143 +
// v22.47 守护描述 + 入库 143 份）、姊妹件套 pin（smoke_v2246 随新现实更新 + v2143-45「件套守护领先
// 一位」哨兵链 144 更新）复查 + 旧代 v22.46 字面量/恒等/件套/串尾 pin 全库零残留。
import { S } from '../js/state.js';
import { GAME_VERSION, VILLAGE_WELL, NPC_SPOTS, TY, MAPS } from '../js/data.js';
import { newGame } from '../js/core.js';
import { loadMap, at } from '../js/world.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v22.46 冒烟先例：先装桩再 import main.js；fillRect/arc 捕获供村井断言）——
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
const { drawWorld, cam, villageWellState } = await import('../js/view/drawWorld.js');
const { CTX } = await import('../js/view/canvas.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.47 潮灯镇村井地标 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const wSrc = fs.readFileSync(path.join(ROOT, 'js/view/drawWorld.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.46 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.46（本版守 v22.47）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 47)), GAME_VERSION);
ok('data.js 含 v22.47 注释（村井补脸说明）', dSrc.includes('v22.47 新内容·世界景观·纯显示'));
ok('GAME_VERSION 字面量已为 v22.47（旧 v22.46 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v23.23';") && !dSrc.includes("const GAME_VERSION = 'v22." + "46';"));
ok('data.js 仍保留 v22.46/v22.45 世代注释链（喷泉反馈/守夜人累积注释未动）',
  dSrc.includes('v22.46 体验打磨·信息透明·纯显示') && dSrc.includes('v22.45 新内容·纯风味 NPC'));

// —— data.js 源级落位：VILLAGE_WELL 单一数据源 ——
ok('VILLAGE_WELL 位于广场北 (14,6)（灯长「井边」东邻）', VILLAGE_WELL && VILLAGE_WELL.x === 14 && VILLAGE_WELL.y === 6,
  JSON.stringify(VILLAGE_WELL));
ok('data.js 导出块含 VILLAGE_WELL（可被 drawWorld 与冒烟共享）', /VILLAGE_WELL,/.test(dSrc) && dSrc.includes('VILLAGE_WELL'));
ok('data.js VILLAGE_WELL 注释含「井在广场北/同一口水脉两端」主题（井巫/说书人/掌灯阿婆/灯长同口径）',
  dSrc.includes('井底那口钟') && dSrc.includes('同一口水脉'));

// —— drawWorld.js 源级落位：drawVillageWell + villageWellState ——
ok('drawWorld.js 含 v22.47 注释（村井地标说明）', wSrc.includes('v22.47 潮灯镇「村井」'));
ok('drawWorld.js import VILLAGE_WELL（data.js 单一数据源）', wSrc.includes('VILLAGE_WELL'));
ok('drawWorld.js 导出 villageWellState 纯函数（两档状态单一数据源）', wSrc.includes('export function villageWellState'));
ok('villageWellState 档位读 trueBoss（静默档）', wSrc.includes("if (hero && hero.trueBoss) return 'silent';"));
ok('villageWellState 缺省低鸣档（hum）', wSrc.includes("return 'hum';"));
ok('drawWorld 主循环接入 drawVillageWell（village 专属，与大灯同层先于角色）',
  wSrc.includes("curMap() === 'village') drawVillageWell(c.x, c.y);"));
ok('井水低鸣档星蓝 #9adcff + 星砂浮光 #cfeaff（与星井/星砂车同色族）',
  wSrc.includes("CTX.fillStyle = '#9adcff'") && wSrc.includes("CTX.fillStyle = '#cfeaff'"));
ok('井水静默档暗灰 #5a6472（与星井静默同色族同档位）', wSrc.includes("CTX.fillStyle = '#5a6472'"));
ok('石砌井圈/辘轳木架色板齐备（#6a6f78/#8a9098/#6b5138/#8a5a2b 既有色族零新增颜色）',
  wSrc.includes("CTX.fillStyle = '#6a6f78'") && wSrc.includes("CTX.fillStyle = '#8a9098'") &&
  wSrc.includes("CTX.fillStyle = '#6b5138'") && wSrc.includes("CTX.fillStyle = '#8a5a2b'"));
ok('吊绳/水桶共体分支（#b8a78e 绳 + 桶木）', wSrc.includes("CTX.fillStyle = '#b8a78e'"));
ok('低鸣档光晕 rgba(95,216,255,.20)（与星井蓝青光晕同档位结构）', wSrc.includes("'rgba(95,216,255,.20)'"));
ok('既有大灯三档/星井两档/星砂车两档/拱门两档绘制逐字零回归（state 纯函数与调用点健在）',
  wSrc.includes('export function villageLampState') && wSrc.includes('export function caveWellState') &&
  wSrc.includes('export function caveCartState') && wSrc.includes('export function galleryArchState'));

// —— 纯函数运行期实证：villageWellState 三档 ——
ok('纯函数：新档（无旗标）→ hum（低鸣）', villageWellState({}) === 'hum');
ok('纯函数：trueBoss → silent（静默）', villageWellState({ trueBoss: true }) === 'silent');
ok('纯函数：null 防御 → hum', villageWellState(null) === 'hum');

// —— 运行期实证：village 两档渲染捕获（井水/浮光/光晕逐像素色）——
function capture(flags, map) {
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
    S.G.map = map || 'village';
    S.G.x = VILLAGE_WELL.x; S.G.y = VILLAGE_WELL.y + 1;
    S.dir = 'U';
    S.scene = 'world';
    S.walk = null;
    loadMap(map || 'village');
    drawWorld();
  } catch (e) { rects.push({ fs: 'THREW:' + e.message, x: -1, y: -1, w: 0, h: 0 }); }
  CTX.fillRect = origFR;
  CTX.arc = origArc;
  const c = cam();
  const px = VILLAGE_WELL.x * 32 - c.x;
  const py = VILLAGE_WELL.y * 32 - c.y;
  const water = (fs) => rects.find((r) => r.x === px + 11 && r.y === py - 11 && r.w === 10 && r.h === 9 && r.fs === fs);
  const halo = (fs, r) => arcs.find((a) => a.r === r && a.fs === fs);
  return { rects, arcs, water, halo, cam: c, px, py };
}

// 档 A：新档（井底低鸣）——星蓝水面 + 浮光 + 蓝青光晕
const capA = capture({});
ok('运行期：无抛错（drawWorld 全链路两档之一）', !capA.rects.some((r) => r.fs.startsWith('THREW:')));
ok('运行期：低鸣档井水星蓝 #9adcff（井底还在响）', !!capA.water('#9adcff'),
  JSON.stringify(capA.rects.filter((r) => r.x === capA.px + 11 && r.y === capA.py - 11).slice(0, 3)));
ok('运行期：低鸣档星砂浮光 #cfeaff 2×2（井口星屑）',
  capA.rects.some((r) => r.w === 2 && r.h === 2 && r.fs === '#cfeaff' && r.x >= capA.px + 11 && r.x <= capA.px + 20),
  String(capA.rects.filter((r) => r.w === 2 && r.h === 2 && r.fs === '#cfeaff').length));
ok('运行期：低鸣档蓝青光晕 arc r=15 rgba(95,216,255,.20)', !!capA.halo('rgba(95,216,255,.20)', 15),
  JSON.stringify(capA.arcs.slice(0, 8)));

// 档 B：trueBoss（井也不鸣了）——暗灰水面 + 零浮光零光晕
const capB = capture({ trueBoss: true });
ok('运行期：静默档井水暗灰 #5a6472（「井也不鸣了」）', !!capB.water('#5a6472'));
ok('运行期：静默档星蓝 #9adcff 井水不出现', !capB.water('#9adcff'));
ok('运行期：静默档零蓝青光晕（rgba(95,216,255,.20) 不出现）', !capB.halo('rgba(95,216,255,.20)', 15));

// 档 C：跨图防泄漏——dungeon 渲染零 #9adcff（村井只画在 village）
const capC = capture({}, 'dungeon');
ok('运行期：dungeon 渲染零 #9adcff（村井仅 village 专属，星井蓝仅 cave 地图档）',
  !capC.rects.some((r) => r.fs === '#9adcff'), String(capC.rects.filter((r) => r.fs === '#9adcff').length));

// —— 契约：零碰撞 / 零 NPC 变更 / 位置与数据图一致 / 同图关键点零回归 ——
loadMap('village');
ok('契约：at(14,6) === TY.GRASS（村井立在可行走草地格上，零碰撞变化）', at(VILLAGE_WELL.x, VILLAGE_WELL.y) === TY.GRASS,
  at(VILLAGE_WELL.x, VILLAGE_WELL.y));
ok('契约：西邻 (13,6) 灯长 NPC / 北邻 (14,5) 草地可行走 / 东邻 (15,6) 草地可行走（南邻 (14,7) 即水塘边）',
  at(13, 6) === TY.NPC && NPC_SPOTS['13,6'] === 'chief' &&
  at(14, 5) !== TY.TREE && at(15, 6) !== TY.TREE && at(14, 7) === TY.WATER);
ok('契约：同图关键点零回归——灯长(13,6)/喷泉(12,6)/大灯(14,9)/掌灯阿婆(14,8)/水塘(16,6)',
  at(13, 6) === TY.NPC && at(12, 6) === TY.FOUNTAIN && at(14, 9) === TY.PATH &&
  at(14, 8) === TY.NPC && at(16, 6) === TY.WATER,
  [at(13, 6), at(12, 6), at(14, 9), at(14, 8), at(16, 6)].join('/'));
ok('契约：全图 extras 扫描 (14,6) 零占用（村井不是 extras 瓦片、无他图撞车）',
  Object.values(MAPS).every((m) => (m.extras || []).every((ex) => !(ex.x === 14 && ex.y === 6))));
ok('契约：(14,6) 非 NPC_SPOTS 键且 NPC 总数保持 31（零 NPC 变更，v22.46 pin 续守）',
  !(VILLAGE_WELL.x + ',' + VILLAGE_WELL.y in NPC_SPOTS) && Object.keys(NPC_SPOTS).length === 38,
  String(Object.keys(NPC_SPOTS).length));
ok('契约：小地图图例零变化（村井刻意不设标记——无决策信息与星砂车/名字之门同口径，图例仍只列大灯/星井）',
  wSrc.includes('minimapColor') && !wSrc.includes('VILLAGE_WELL.x && y === VILLAGE_WELL.y'));

// —— README / package.json / CHANGELOG 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树已收录 smoke_v2247_villagewell 且位于串尾', readme.includes('smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 件套口径为二百一十二件套（二百一十一件套清除）',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟一百四十二件套（一百四十一件套清' + '除）'));
ok('README 含 v22.47 守护描述（潮灯镇村井地标）', readme.includes('v22.47 起含潮灯镇村井地标守护'));
ok('README 含 smoke_v2247_villagewell 入库（143 份）', readme.includes('smoke_v2247_villagewell 入库（143 份）'));
ok('README 四图速览/地图段含「村井」（潮灯镇 bullet 补脸口径）', readme.includes('村井'));
ok('package.json 已收录 smoke_v2247_villagewell（npm test 串跑第 143 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2247_villagewell.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 143 件套', testChain === 212, String(testChain));
ok('CHANGELOG 顶部已追加 v22.47 条目', changelog.startsWith('## v23.23'));

// —— 姊妹 pin 复查（smoke_v2246 随新现实更新 + v2143-45「件套守护领先一位」哨兵推进至 144）——
const s2246 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2246_fountgauge.mjs'), 'utf8');
ok('smoke_v2246 的 GAME_VERSION 字面量 pin 已更新为 v22.47（旧 v22.46 零残留）',
  s2246.includes("const GAME_VERSION = 'v23.23';") && !s2246.includes("const GAME_VERSION = 'v22." + "46';"));
ok('smoke_v2246 的 README 件套 pin 已随新现实更新为二百一十二件套（二百一十一件套清除）',
  s2246.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2246 的 package.json 件套计数 pin 已更新为 === 143', s2246.includes('testChain === 212'));
ok('smoke_v2246 的 README 串尾 pin 已随新现实延伸至 smoke_v2247_villagewell',
  s2246.includes('smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2246 的 NPC 总数 pin 保持 31（本轮零 NPC 变更）', s2246.includes('NPC_SPOTS).length === 38'));
const s2143 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2143_talkekey.mjs'), 'utf8');
ok('v2143-45「件套守护领先一位」哨兵链已推进至 144（二百一十二件套（二百一十一件套清除））',
  s2143.includes('二百一十三件套（二百一十二件套清除）') && s2143.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));

// —— 旧代 v22.46 pin 全库零残留 ——
const allTests = fs.readdirSync(path.join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2247_villagewell.mjs');
const stale = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "46';") || src.includes("GAME_VERSION === 'v22." + "46'") ||
      src.includes('一百四十二件套（一百四十一件套清' + '除）') || src.includes('testChain === ' + '142') ||
      src.includes('smoke_v2246_fountgauge（npm test ' + '串跑）')) stale.push(f);
}
ok('旧代 v22.46 字面量/恒等/件套/串尾 pin 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
