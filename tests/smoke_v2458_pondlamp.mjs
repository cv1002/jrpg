// v24.58 专项冒烟：潮灯镇水塘「夜泊纸灯」夜间景观（新内容·世界景观·纯显示——承 v22.57 水塘灯影
// 同一 water 分支 / v22.76 放灯童「灯走到哪儿，月亮就跟到哪儿」同一「孩子把灯放到水上」主线）：
// 水塘灯影随大灯三档常亮，但「夜里有人放灯」这件事此前一像素都没有——掌灯阿婆（14,8 南岸）守的是
// 塘南岸的旧故事（「灯灭那晚，塘里的月亮也熄了」），放灯童（19,7 东岸）守的是东岸的新灯
// （「灯走到哪儿，月亮就跟到哪儿」），孩子把纸灯放到水上这件事却从不上画面；现仅潮灯镇
// （curMap()==='village'）且夜间相位（dayPhase 与 HUD 相位标签/小地图倍率/v24.14 战斗相位标/
// v24.57 提灯夜行战报同读 data.js dayPhase(S.G.time) 一份单一数据源）的水塘 6 格水面按坐标哈希
// dhw%3===0 泊 2 盏纸灯（(18,6)/(16,7)）：金白光晕 14×9 + 灯油金灯身三层（6×1/8×3/6×1）+ 金白焰心
// 2×2 + 水面倒影拖尾 10×1/4×1——全部既有色族零新增颜色（rgba(255,233,168,*) 金白族 /
// rgba(255,210,74,*) 灯油金族），随 ph 轻晃（sin 连续位移、灯格存在与否由坐标哈希确定、零时间依赖
// 布尔——纸灯不随时钟生灭）；白天/黄昏/黎明与 dungeon/cave/gallery 零噪音零触发，WATER 仍 SOLID、
// 遇敌/踩踏/传送判定逐字未动。本冒烟守护：版本锚点、data.js/drawWorld.js 源级落位（v24.58 注释块 /
// GAME_VERSION v24.58 与旧 v24.57 字面量零残留 / v24.57 历史注释保留 / 夜间门 + dhw2 哈希 + 七矩形
// 几何逐字 + 五档色板逐字 + v22.57 灯影/v22.60 泉涌零回归）、数据契约（dayPhase 四相位逐值 /
// 水塘格 at()===TY.WATER 逐点 / WATER∈SOLID 零碰撞 / NPC_SPOTS 总数 38 零变更）、运行期渲染实证
// （village 夜间：两灯位七矩形逐组落位 + 光晕总数恰 2 · village 白天：零纸灯 · dungeon/cave/gallery
// 夜间零泄漏）、README/package.json/CHANGELOG 同步（件套口径 282 + v24.58 守护描述 +
// smoke_v2458_pondlamp 入库（284 份）+ package 串尾 + CHANGELOG 顶 pin）、哨兵链（前望 283 且
// README 尚无 283 口径 + v2415/v2429 随新现实推进）、tests 目录与实跑链一一对应（282 份）、
// 旧代 v24.57 pin 全库零残留扫描（豁免本套件与 v2457 套件否定式；扫描码模式串一律拆拼接形态）。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v24.57 冒烟先例：先装桩再 import main.js；fillRect 捕获供纸灯断言）——
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
const { S } = await import('../js/state.js');
const { GAME_VERSION, TY, SOLID, NPC_SPOTS, MAPS, dayPhase, DAY_PHASE_S } = await import('../js/data.js');
const { newGame } = await import('../js/core.js');
const { loadMap, at } = await import('../js/world.js');
const { drawWorld, cam } = await import('../js/view/drawWorld.js');
const { CTX } = await import('../js/view/canvas.js');
// 音效桩：开局/BGM 全部静音，测试只关心绘制矩形
const { SFX } = await import('../js/audio.js');
for (const k of Object.keys(SFX)) SFX[k] = () => {};

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.58 潮灯镇水塘「夜泊纸灯」夜间景观 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const wSrc = read('js/view/drawWorld.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.57）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.57', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] >= 58)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js 含 v24.58 注释（潮灯镇水塘「夜泊纸灯」）',
  dSrc.includes('v24.58 体验打磨·世界景观·纯显示：潮灯镇水塘「夜泊纸灯」'));
ok('data.js GAME_VERSION 字面量已为 v24.58（旧 v24.57 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.60';") && !dSrc.includes('const GAME_VERSION = ' + "'v24.57';"));
ok('data.js 仍保留 v24.57 历史注释（夜间胜利战报进度后缀·本版保留）',
  dSrc.includes('v24.57 体验打磨·信息透明·计数现场：🏆 夜间胜利战报补'));

// —— 数据契约：dayPhase 四相位 / 水塘格 / 零碰撞 / 零 NPC 变更 ——
ok('DAY_PHASE_S 契约（90 秒/档，四相位轮转与 v23.91/v24.57 判定同源）', DAY_PHASE_S === 90, String(DAY_PHASE_S));
ok('dayPhase 四相位逐值（0 day · 90 dusk · 200 night · 270 dawn）',
  dayPhase(0) === 'day' && dayPhase(90) === 'dusk' && dayPhase(200) === 'night' && dayPhase(270) === 'dawn');
loadMap('village');
ok('契约：水塘格 at()===TY.WATER 逐点（北岸 (16..18,6) · 南岸 (14..16,7)，两灯位 (18,6)/(16,7) 在内）',
  at(16, 6) === TY.WATER && at(17, 6) === TY.WATER && at(18, 6) === TY.WATER &&
  at(14, 7) === TY.WATER && at(15, 7) === TY.WATER && at(16, 7) === TY.WATER,
  `16,6=${at(16, 6)} 18,6=${at(18, 6)} 16,7=${at(16, 7)}`);
ok('契约：TY.WATER ∈ SOLID（水面仍不可行走，零碰撞变化）', SOLID.has(TY.WATER));
ok('契约：NPC_SPOTS 总数 38 零变更（零 NPC 增减，v22.51 pin 续守）', Object.keys(NPC_SPOTS).length === 38,
  String(Object.keys(NPC_SPOTS).length));

// —— drawWorld.js 源级落位 ——
ok('drawWorld.js 含 v24.58 注释（夜泊纸灯说明）',
  wSrc.includes('v24.58 体验打磨·世界景观·纯显示：潮灯镇水塘「夜泊纸灯」'));
ok('drawWorld.js 夜间相位门（dayPhase(S.G.time)===night，与 HUD/v24.14/v24.57 同读一份源）',
  wSrc.includes("if (S.G && dayPhase((S.G && S.G.time) || 0) === 'night')"));
ok('drawWorld.js 纸灯坐标哈希（dhw2 = x*31+y*17 · dhw2%3===0 恰两格 (18,6)/(16,7)）',
  wSrc.includes('const dhw2 = x * 31 + y * 17;') && wSrc.includes('if (dhw2 % 3 === 0) {'));
ok('drawWorld.js 纸灯轻晃（sin 连续位移·零时间依赖布尔）',
  wSrc.includes('const bob = Math.sin(ph * 1.2 + dhw2) * 1.5;'));
ok('drawWorld.js 纸灯五档色板逐字（金白 .22 光晕 / 灯油金 .85 灯身 / 金白 .95 焰心 / 灯油金 .3 倒影 / 金白 .18 倒影尾）',
  wSrc.includes("CTX.fillStyle = 'rgba(255,233,168,.22)';") &&
  wSrc.includes("CTX.fillStyle = 'rgba(255,210,74,.85)';") &&
  wSrc.includes("CTX.fillStyle = 'rgba(255,233,168,.95)';") &&
  wSrc.includes("CTX.fillStyle = 'rgba(255,210,74,.3)';") &&
  wSrc.includes("CTX.fillStyle = 'rgba(255,233,168,.18)';"));
ok('drawWorld.js 纸灯七矩形几何逐字（光晕 14×9@+9,+7 / 灯顶 6×1@+13,+9 / 灯身 8×3@+12,+10 / 灯底 6×1@+13,+13 / 焰心 2×2@+15,+11 / 倒影 10×1@+11,+22 / 倒影尾 4×1@+14,+24）',
  wSrc.includes('CTX.fillRect(px + 9, py + 7 + bob, 14, 9);') &&
  wSrc.includes('CTX.fillRect(px + 13, py + 9 + bob, 6, 1);') &&
  wSrc.includes('CTX.fillRect(px + 12, py + 10 + bob, 8, 3);') &&
  wSrc.includes('CTX.fillRect(px + 13, py + 13 + bob, 6, 1);') &&
  wSrc.includes('CTX.fillRect(px + 15, py + 11 + bob, 2, 2);') &&
  wSrc.includes('CTX.fillRect(px + 11, py + 22 + bob * 0.6, 10, 1);') &&
  wSrc.includes('CTX.fillRect(px + 14, py + 24 + bob * 0.6, 4, 1);'));
ok('drawWorld.js 🏮 纸灯绘制块计数恰 1（water 分支唯一，含 v24.58 注释伴生）',
  (wSrc.match(/v24\.58 体验打磨·世界景观·纯显示：潮灯镇水塘「夜泊纸灯」/g) || []).length === 1);
ok('drawWorld.js v22.57 水塘灯影零回归（villageLampState 三档块逐字保留）',
  wSrc.includes('const lp = villageLampState(S.G);') && wSrc.includes("CTX.fillStyle = 'rgba(255,233,168,.55)';"));
ok('drawWorld.js v22.60 泉涌涟漪零回归（dhf 哈希块逐字保留）',
  wSrc.includes('const dhf = x * 11 + y * 5;'));
ok('drawWorld.js dayPhase 既有 import 零新增（data.js 既有导出复用）',
  wSrc.includes('UI_PULSE_MS, dayPhase, VILLAGE_LAMP,'));

// —— 运行期渲染捕获（承 v22.56 捕获同法；bob 浮动 ±2.5 容差）——
function captureMap(mapName, heroX, heroY, time) {
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
    S.G.time = time;
    S.dir = 'R';
    S.scene = 'world';
    S.walk = null;
    loadMap(mapName);
    drawWorld();
  } catch (e) { rects.push({ fs: 'THREW:' + e.message, x: -1, y: -1, w: 0, h: 0 }); }
  CTX.fillRect = origFR;
  return { rects, cam: cam() };
}
function hasRect(rects, fs, w, h, tx, ty, ox, oy, camXY, tol) {
  const t = tol == null ? 1 : tol;
  return rects.some((q) => q.fs === fs && q.w === w && q.h === h &&
    Math.abs(q.x - (tx * 32 - camXY.x + ox)) <= t && Math.abs(q.y - (ty * 32 - camXY.y + oy)) <= t);
}
// dhw2：18*31+6*17=660（%3=0）· 16*31+7*17=615（%3=0）——恰 (18,6)/(16,7) 两盏
// village：玩家站广场 (16,11)，水塘在视野内
{
  const cap = captureMap('village', 16, 11, 200);
  const c = cap.cam;
  ok('village 夜间运行期：无抛错（drawWorld 全链路）', !cap.rects.some((r) => r.fs.startsWith('THREW:')),
    JSON.stringify(cap.rects.filter((r) => r.fs.startsWith('THREW:')).slice(0, 2)));
  ok('village 夜间运行期：(18,6) 纸灯金白光晕 14×9 @+9,+7 落位（±2.5 容差·bob 轻晃）',
    hasRect(cap.rects, 'rgba(255,233,168,.22)', 14, 9, 18, 6, 9, 7, c, 2.5));
  ok('village 夜间运行期：(18,6) 纸灯灯身三层 6×1@+13,+9 · 8×3@+12,+10 · 6×1@+13,+13 逐组落位',
    hasRect(cap.rects, 'rgba(255,210,74,.85)', 6, 1, 18, 6, 13, 9, c, 2.5) &&
    hasRect(cap.rects, 'rgba(255,210,74,.85)', 8, 3, 18, 6, 12, 10, c, 2.5) &&
    hasRect(cap.rects, 'rgba(255,210,74,.85)', 6, 1, 18, 6, 13, 13, c, 2.5));
  ok('village 夜间运行期：(18,6) 金白焰心 2×2 @+15,+11 落位',
    hasRect(cap.rects, 'rgba(255,233,168,.95)', 2, 2, 18, 6, 15, 11, c, 2.5));
  ok('village 夜间运行期：(18,6) 水面倒影 10×1@+11,+22 与倒影尾 4×1@+14,+24 落位',
    hasRect(cap.rects, 'rgba(255,210,74,.3)', 10, 1, 18, 6, 11, 22, c, 2.5) &&
    hasRect(cap.rects, 'rgba(255,233,168,.18)', 4, 1, 18, 6, 14, 24, c, 2.5));
  ok('village 夜间运行期：(16,7) 第二盏纸灯金白光晕 14×9 @+9,+7 落位',
    hasRect(cap.rects, 'rgba(255,233,168,.22)', 14, 9, 16, 7, 9, 7, c, 2.5));
  const halos = cap.rects.filter((r) => r.fs === 'rgba(255,233,168,.22)' && r.w === 14 && r.h === 9 &&
    !(r.x === -1 && r.y === -1)).length;
  ok('village 夜间运行期：金白光晕总数 = 2（恰两盏纸灯，水塘 6 格零多余）', halos === 2, String(halos));
}
// village 白天（t=0）：零纸灯
{
  const cap = captureMap('village', 16, 11, 0);
  ok('village 白天运行期：零纸灯光晕 14×9（夜间门不触发）',
    !cap.rects.some((r) => r.fs === 'rgba(255,233,168,.22)' && r.w === 14 && r.h === 9));
}
// village 黄昏（t=120）/黎明（t=300）：零纸灯（仅夜间相位泊灯）
{
  const capD = captureMap('village', 16, 11, 120);
  ok('village 黄昏运行期：零纸灯光晕 14×9（仅夜间相位）',
    !capD.rects.some((r) => r.fs === 'rgba(255,233,168,.22)' && r.w === 14 && r.h === 9));
  const capA = captureMap('village', 16, 11, 300);
  ok('village 黎明运行期：零纸灯光晕 14×9（仅夜间相位）',
    !capA.rects.some((r) => r.fs === 'rgba(255,233,168,.22)' && r.w === 14 && r.h === 9));
}
// dungeon/cave/gallery 夜间：零纸灯（village 门防泄漏）
{
  const capD = captureMap('dungeon', 12, 8, 200);
  ok('dungeon 夜间运行期：零纸灯光晕 14×9（营地泉水/篝火在 dungeon，纸灯不走此分支）',
    !capD.rects.some((r) => r.fs === 'rgba(255,233,168,.22)' && r.w === 14 && r.h === 9));
  const capC = captureMap('cave', 16, 10, 200);
  ok('cave 夜间运行期：零纸灯光晕 14×9（星井/星砂车零回归、无纸灯）',
    !capC.rects.some((r) => r.fs === 'rgba(255,233,168,.22)' && r.w === 14 && r.h === 9));
  const capG = captureMap('gallery', 12, 3, 200);
  ok('gallery 夜间运行期：零纸灯光晕 14×9（回廊恒暗无晨昏、石碑温光零回归、无纸灯）',
    !capG.rects.some((r) => r.fs === 'rgba(255,233,168,.22)' && r.w === 14 && r.h === 9));
}

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为冒烟二百八十四件套（二百八十三件套清除）',
  readme.includes('冒烟二百八十四件套（二百八十三件套清除）'));
ok('README tests 含 v24.58 守护描述与 smoke_v2458_pondlamp 入库（284 份）',
  readme.includes('v24.58 起含 「潮灯镇水塘「夜泊纸灯」夜间景观」守护') &&
  readme.includes('smoke_v2458_pondlamp 入库（284 份）'));
ok('README 尚无 283 件套口径（哨兵前望 283 语义：下一版才写 283）',
  !readme.includes('二百八十五件套') && !readme.includes('冒烟二百八十五件套'));
ok('README 仍保留 v24.57 守护描述（历史保留）',
  readme.includes('v24.57 起含 「夜间胜利战报「🌙 提灯夜行 N/10」进度后缀」守护'));
ok('README tests 树串尾已延伸至 smoke_v2458_pondlamp（... + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10（npm test 串跑））',
  readme.includes('smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10（npm test 串跑）'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 284 份（smoke.mjs + 283 专项）', chain.length === 283 && chainAll.length === 284, String(chain.length));
ok('package.json 链尾为 smoke_v2458_pondlamp（第 282 份）', chain[chain.length - 1] === 'smoke_v2460_xpcurve10', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2458_pondlamp.mjs（node tests/ 前缀形态）',
  pkgRaw.includes('node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs && node tests/smoke_v2459_xpcurve9.mjs'));
ok('package.json 链锚逐字（...smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs\"）',
  pkgRaw.includes('smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs && node tests/smoke_v2459_xpcurve9.mjs && node tests/smoke_v2460_xpcurve10.mjs\"'));
ok('CHANGELOG.md 顶部条目已为 v24.58（startsWith）', changelog.startsWith('## v24.60 '));
ok('CHANGELOG v24.58 条目含「夜泊纸灯」与「水塘」与「夜间」',
  changelog.includes('夜泊纸灯') && changelog.includes('水塘') && changelog.includes('夜间'));
ok('CHANGELOG 仍保留 v24.57 条目（历史保留）', changelog.includes('## v24.57 '));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(chainAll.map((f) => f.replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 282（281 专项 + smoke.mjs）', files.length === 284, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：v2415 树串守护已推进至新链尾 + 前望 283 ——
const t2415 = read('tests/smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v2458_pondlamp（第 282 份）',
  t2415.includes("chain[chain.length - 1] === 'smoke_v2460_xpcurve10'"));
ok('smoke_v2415 树串 token 数已推进至 282', t2415.includes('treeTok.length === 284'));
ok('smoke_v2415 哨兵「尚无 283」口径（二百八十二件套 bare 否定式）',
  t2415.includes("!readme.includes('二百八十五件套')"));
const s2429 = read('tests/smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 件盘口句已推进（冒烟二百八十四件套（二百八十三件套清除）正形态）',
  s2429.includes("readme.includes('冒烟二百八十四件套（二百八十三件套清除）')"));
ok('smoke_v2429 链尾断言已推进至「=== smoke_v2458_pondlamp」',
  s2429.includes("=== 'smoke_v2460_xpcurve10'"));
ok('smoke_v2429 入库份数断言随新现实推进（入库 282 份）',
  s2429.includes('入库（284 份）'));

// —— 旧代 pin 零残留扫描（v24.57 / 281 口径；豁免本套件与 v2457 套件否定式）——
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v2458_pondlamp.mjs' || f === 'smoke_v2457_nightwin.mjs') continue;
  const s2 = fs.readFileSync(path.join(testsDir, f), 'utf8');
  const hits = [];
  if (s2.includes('const GAME_VERSION = ' + "'v24.57';")) hits.push('gv');
  if (s2.includes('const GAME_VERSION = ' + "'v24.57'")) hits.push('gvns');
  if (s2.includes('GAME_VERSION === ' + "'v24.57'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.57")) hits.push('cw');
  if (s2.includes('入库（28' + '1 份）')) hits.push('ruku');
  if (s2.includes('冒烟二百八十一件套（二百八十' + '件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 28' + '1')) hits.push('fl');
  if (s2.includes('chainAll.length === 28' + '1')) hits.push('cal');
  if (s2.includes('chain.length === 28' + '0')) hits.push('cl');
  if (s2.includes('treeTok.length === 28' + '1')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v2457_" + "nightwin'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.57 GAME_VERSION/顶 pin/281 口径（哨兵链，豁免本套件与 v2457 套件否定式）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.58 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
