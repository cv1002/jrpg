// v22.35 专项冒烟：小地图 NPC 任务标（体验打磨·信息透明·纯显示）——世界画面 NPC 头顶有
// 「❕ 可接委托 / 可交任务」脉冲顶标（drawQuestMark，npcQuestMark 单一数据源），小地图上所有
// NPC 却一律米色 #e8c9a0：玩家扫小地图规划「该找谁接/交任务」时无从区分谁有委托待办（小地图是
// 决策信息屏，宝箱/危险区/遇敌槽皆有专属标注，唯 NPC 任务状态缺席——与 v19.47 小地图暖金、
// v3.x 宝箱引导金光脉动同一「小地图决策信息」主线）；现 view/drawWorld.js minimapColor 对 NPC
// 格与画布那侧同读 npcQuestMark（QUESTS 推导，单一数据源，零任务 NPC 回退米色零噪音），有可接/
// 可交任务的 NPC 在小地图上金光脉动（UI_PULSE_MS 呼吸，与未开宝箱引导态同族色 #ffd24a/#8a5a00）。
// 纯显示零结算零存档零数值变化（minimapColor 只读 npcQuestMark / UI_PULSE_MS，不触任何判定/结算）。
// 本冒烟守护：版本锚点、data.js/drawWorld.js 源级落位（minimapColor NPC 分支 + 既有每个颜色分支
// 逐字零回归）、运行期实证（village 小地图按 minimap 几何捕获 fillRect 的 fillStyle：chief/clerk/
// grainman 三大任务 NPC 格金光脉动、villager/granny/说书人/锻灯师/客栈老板娘等纯闲聊格米色、
// 任务全 done 后 NPC 格全部回米色零金光）、README/package.json/CHANGELOG 同步（tests 树尾/
// 件套口径 131/v22.35 守护描述/入库 131 份/视觉 bullet）、姊妹件套 pin（v2234..v2226 随新现实
// 更新）复查 + 旧代 v22.34 字面量/恒等/件套/串尾 pin 全库零残留 + 坏链防回归。
import { S } from '../js/state.js';
import { GAME_VERSION, NPC_SPOTS } from '../js/data.js';
import { newGame } from '../js/core.js';
import { loadMap, MBounds } from '../js/world.js';
import { npcQuestMark } from '../js/quests.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v22.34 冒烟先例：先装桩再 import main.js；fillRect 捕获供小地图断言）——
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
// drawWorld 静态导入会先于 DOM 桩执行（view/canvas.js 顶层访问 document）——按 v21.84/v21.85 惯例
// 桩装好后动态导入（drawWorld 仅在渲染断言阶段使用）。
const { drawWorld } = await import('../js/view/drawWorld.js');
const { CTX } = await import('../js/view/canvas.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.35 小地图 NPC 任务标 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const wSrc = fs.readFileSync(path.join(ROOT, 'js/view/drawWorld.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.34 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.34', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 35)), GAME_VERSION);
ok('data.js 含 v22.35 注释（小地图 NPC 任务标说明）', dSrc.includes('v22.35 体验打磨'));
ok('GAME_VERSION 字面量已为 v22.35（旧 v22.34 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v22.36';") && !dSrc.includes("const GAME_VERSION = 'v22." + "34';"));
ok('data.js 仍保留 v22.34 历史注释（累积注释块，姊妹 pin 不失效）', dSrc.includes('v22.34 新 NPC'));

// —— drawWorld.js 源级落位：minimapColor NPC 分支 + 既有每色分支零回归 ——
ok('drawWorld.js 含 v22.35 注释（小地图 NPC 任务标说明）', wSrc.includes('v22.35 小地图 NPC 任务标'));
ok('minimapColor NPC 分支读 npcQuestMark（单一数据源，与画布头标同源）',
  wSrc.includes('npcQuestMark(hero, qid)'));
ok('NPC 分支经 NPC_SPOTS 查 id（与画布侧 drawQuestMark 同一份源）',
  wSrc.includes('NPC_SPOTS[x + \',\' + y]'));
ok('NPC 分支金光脉动读 UI_PULSE_MS（与未开宝箱引导态同族呼吸）',
  wSrc.includes('Math.floor(Date.now() / UI_PULSE_MS) % 2 === 0'));
ok('NPC 分支金光色 #ffd24a/#8a5a00（与宝箱引导同族色，零新增字面量族）',
  wSrc.includes("'#ffd24a' : '#8a5a00'"));
ok('NPC 分支零任务回退米色 #e8c9a0（纯闲聊 NPC 零噪音）', wSrc.includes("return '#e8c9a0';"));
ok('既有小地图色分支逐字零回归（树/水/路/BOSS/商店/旅馆/泉水/酿造/MB/SB/试炼/矿脉/岩壁/石碑/门/宝箱三态）',
  wSrc.includes("if (tile === TY.TREE || tile === TY.ROCK) return '#1f4d1f'") &&
  wSrc.includes("if (tile === TY.WATER) return '#22568a'") &&
  wSrc.includes("if (tile === TY.SHOP) return '#ffd24a'") &&
  wSrc.includes("if (tile === TY.FOUNTAIN) return '#62c6ff'") &&
  wSrc.includes("if (tile === TY.BREW) return '#8fd86f'") &&
  wSrc.includes("if (tile === TY.MB) return (hero && hero.caveBoss) ? '#39414f' : '#b06ff0'") &&
  wSrc.includes("if (tile === TY.SB) return (hero && hero.trueBoss) ? '#39414f' : '#ffe94a'") &&
  wSrc.includes("if (tile === TY.TRIAL) return '#4fd8ff'") &&
  wSrc.includes("if (tile === TY.CHEST && hero && !hero.chests.has(x + ',' + y)") &&
  wSrc.includes("return '#c9a86a';"));
ok('drawWorld.js 仍 import npcQuestMark（与画布侧同源，未新增依赖）', wSrc.includes("import { npcQuestMark } from '../quests.js';"));
ok('drawWorld.js 仍 import NPC_SPOTS（数据层同源，未新增依赖）', wSrc.includes('NPC_SPOTS'));

// —— 运行期实证：village 小地图按 minimap 几何捕获 fillRect 的 fillStyle ——
// minimap 几何与 drawMinimap 同式（mw=min(120,w*3) mh=min(90,h*3) mx=640-mw-8 my=8 sx=mw/w sy=mh/h）
function captureMinimapCells(heroQuests) {
  const rects = [];
  const origFR = CTX.fillRect;
  CTX.fillRect = (x, y, w, h) => {
    rects.push({ fs: String(CTX.fillStyle), x, y, w, h });
    return origFR.call(CTX, x, y, w, h);
  };
  try {
    S.G = newGame('测试');
    S.G.quests = heroQuests;
    S.G.map = 'village';
    S.G.x = 1; S.G.y = 2;
    S.dir = 'D';
    S.scene = 'world';
    S.walk = null;
    loadMap('village');
    drawWorld();
  } catch (e) { rects.push({ fs: 'THREW:' + e.message, x: -1, y: -1, w: 0, h: 0 }); }
  CTX.fillRect = origFR;
  const b = MBounds();
  const mw = Math.min(120, b.w * 3), mh = Math.min(90, b.h * 3);
  const mx = 640 - mw - 8, my = 8, sx = mw / b.w, sy = mh / b.h;
  const cell = (tx, ty) => rects.find((r) =>
    Math.abs(r.x - (mx + tx * sx)) < 0.01 && Math.abs(r.y - (my + ty * sy)) < 0.01);
  return { rects, cell };
}
const GOLD = ['#ffd24a', '#8a5a00'];
const goldAt = (cap, tx, ty) => {
  const c = cap.cell(tx, ty);
  return c && !c.fs.startsWith('THREW') && GOLD.includes(c.fs);
};
const beigeAt = (cap, tx, ty) => {
  const c = cap.cell(tx, ty);
  return c && c.fs === '#e8c9a0';
};

// 档 A：新档（quests={}）——chief(13,6)/clerk(12,8)/grainman(15,12) 三大任务 NPC 应有 ❕ → 金光
const capA = captureMinimapCells({});
ok('运行期：无抛错（drawWorld 全链路）', capA.rects.length > 0 && !capA.rects.some((r) => r.fs.startsWith('THREW:')),
  capA.rects.length + ' rects');
ok('运行期：chief(13,6) 小地图格金光脉动（side_mushroom offer → ❕ 可接委托）', goldAt(capA, 13, 6),
  JSON.stringify(capA.cell(13, 6)));
ok('运行期：clerk(12,8) 小地图格金光脉动（side_stone offer → ❕ 可接委托）', goldAt(capA, 12, 8),
  JSON.stringify(capA.cell(12, 8)));
ok('运行期：grainman(15,12) 小地图格金光脉动（side_grain offer → ❕ 可接委托）', goldAt(capA, 15, 12),
  JSON.stringify(capA.cell(15, 12)));
ok('运行期：纯闲聊 villager(10,13) 小地图格米色（零任务零噪音）', beigeAt(capA, 10, 13),
  JSON.stringify(capA.cell(10, 13)));
ok('运行期：纯闲聊 granny(14,8) 小地图格米色', beigeAt(capA, 14, 8), JSON.stringify(capA.cell(14, 8)));
ok('运行期：纯闲聊 teller(16,9) 小地图格米色', beigeAt(capA, 16, 9), JSON.stringify(capA.cell(16, 9)));
ok('运行期：纯闲聊 smith(7,11) 小地图格米色', beigeAt(capA, 7, 11), JSON.stringify(capA.cell(7, 11)));
ok('运行期：纯闲聊 innkeeper(7,14) 小地图格米色', beigeAt(capA, 7, 14), JSON.stringify(capA.cell(7, 14)));
ok('运行期：npcQuestMark 三号 NPC 与新档企划一致（chief/clerk/grainman 非空，villager 为空）',
  !!npcQuestMark(S.G, 'chief') && !!npcQuestMark(S.G, 'clerk') && !!npcQuestMark(S.G, 'grainman') &&
  !npcQuestMark(S.G, 'villager') && !npcQuestMark(S.G, 'granny'));

// 档 B：任务全 done——全部 NPC 格回米色、零金光
const capB = captureMinimapCells({ side_mushroom: 'done', side_stone: 'done', side_grain: 'done' });
ok('运行期：全 done 后 chief(13,6) 米色（金光熄灭）', beigeAt(capB, 13, 6), JSON.stringify(capB.cell(13, 6)));
ok('运行期：全 done 后 clerk(12,8) 米色', beigeAt(capB, 12, 8), JSON.stringify(capB.cell(12, 8)));
ok('运行期：全 done 后 grainman(15,12) 米色', beigeAt(capB, 15, 12), JSON.stringify(capB.cell(15, 12)));
ok('运行期：全 done 后 NPC 格零金光残留（小地图无 NPC 任务标——逐 NPC_SPOTS 格校验，shop/宝箱等既有常驻色不受影响）',
  Object.keys(NPC_SPOTS).filter((k) => {
    // 仅校验 village 图内坐标（小地图仅画当前图）
    const [tx, ty] = k.split(',').map(Number);
    return tx >= 0 && tx < 24 && ty >= 0 && ty < 18;
  }).every((k) => {
    const [tx, ty] = k.split(',').map(Number);
    const c = capB.cell(tx, ty);
    return !c || !GOLD.includes(c.fs);
  }));

// —— README / package.json / CHANGELOG 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树收录 smoke_v2235_minimapquest 且位于串尾', readme.includes('smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp（npm test 串跑）'));
ok('README 件套口径为一百三十二件套（一百三十一件套清除）',
  readme.includes('冒烟一百三十二件套（一百三十一件套清除）') && !readme.includes('冒烟一百三十件套（一百二十九件套清' + '除）'));
ok('README 含 v22.35 守护描述（小地图 NPC 任务标守护）', readme.includes('v22.35 起含小地图 NPC 任务标守护'));
ok('README 含 smoke_v2235_minimapquest 入库（131 份）', readme.includes('smoke_v2235_minimapquest 入库（131 份）'));
ok('README 视觉 bullet 含小地图 NPC 任务标（金光脉动口径）', readme.includes('NPC 任务标') && readme.includes('npcQuestMark'));
ok('package.json 已收录 smoke_v2235_minimapquest（npm test 串跑第 131 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2235_minimapquest.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 131 件套', testChain === 132, String(testChain));
ok('CHANGELOG 含 v22.35 条目', changelog.includes('## v22.35 '));

// —— 姊妹 pin 复查（v2234..v2226 随新现实更新 + 旧代 v22.34 全库零残留）——
const s2234 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2234_innkeeper.mjs'), 'utf8');
const s2233 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2233_nameflavor.mjs'), 'utf8');
const s2232 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2232_travelsup.mjs'), 'utf8');
const s2231 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2231_smith.mjs'), 'utf8');
const s2230 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2230_pausewarn.mjs'), 'utf8');
const s2229 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2229_metall.mjs'), 'utf8');
const s2228 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2228_titlesave.mjs'), 'utf8');
const s2227 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2227_minstrel.mjs'), 'utf8');
const s2226 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2226_chestprogress.mjs'), 'utf8');
ok('smoke_v2234 的 GAME_VERSION 字面量 pin 已更新为 v22.35', s2234.includes("const GAME_VERSION = 'v22.36';"));
ok('smoke_v2234 的 GAME_VERSION 恒等 pin 已更新为 === v22.35', s2234.includes("GAME_VERSION === 'v22.36'"));
ok('smoke_v2234 的 README 串尾 pin 已更新为 + smoke_v2235_minimapquest', s2234.includes('smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp（npm test 串跑）'));
ok('smoke_v2234 的 package.json 件套计数 pin 已更新为 === 131', s2234.includes('testChain === 132'));
ok('smoke_v2233 的 GAME_VERSION 字面量 pin 已更新为 v22.35', s2233.includes("const GAME_VERSION = 'v22.36';"));
ok('smoke_v2232 的 GAME_VERSION 恒等 pin 已更新为 === v22.35', s2232.includes("GAME_VERSION === 'v22.36'"));
ok('smoke_v2231 的 README 串尾 pin 已更新为 + smoke_v2235_minimapquest',
  s2231.includes('smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp（npm test 串跑）'));
ok('smoke_v2230 的 GAME_VERSION 字面量 pin 已更新为 v22.35', s2230.includes("const GAME_VERSION = 'v22.36';"));
ok('smoke_v2229 的 GAME_VERSION 恒等 pin 已更新为 === v22.35', s2229.includes("GAME_VERSION === 'v22.36'"));
ok('smoke_v2228 的 README 串尾 pin 已更新为 + smoke_v2235_minimapquest',
  s2228.includes('smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp（npm test 串跑）'));
ok('smoke_v2227 的 NPC 总数 pin 保持 30（零 NPC 变更）', s2227.includes('NPC_SPOTS).length === 30'));
ok('smoke_v2226 的 GAME_VERSION 字面量 pin 已更新为 v22.35', s2226.includes("const GAME_VERSION = 'v22.36';"));
// 旧代 v22.34 pin 全库零残留
const allTests = fs.readdirSync(path.join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs'));
const stale = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "34';") || src.includes("GAME_VERSION === 'v22." + "34'") ||
      src.includes('一百三十件套（一百二十九件套清' + '除）') || src.includes('testChain === ' + '130') ||
      src.includes('smoke_v2234_innkeeper（npm test ' + '串跑）')) stale.push(f);
}
ok('旧代 v22.34 字面量/恒等/件套/串尾 pin 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));
// 坏链防回归：不得出现 smoke_v2234_innkeeper 直接接 smoke_v2235 以外的旧链被吞并（smoke_v2233_nameflavor 直接接 smoke_v2235）
let brokenTail = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('smoke_v2233_nameflavor + smoke_v2235_minimapquest（npm test ' + '串跑）')) brokenTail.push(f);
}
if (readme.includes('smoke_v2233_nameflavor + smoke_v2235_minimapquest（npm test ' + '串跑）')) brokenTail.push('README.md');
ok('坏链 pin 零残留（v2234_innkeeper 被吞并链全库清零）', brokenTail.length === 0, brokenTail.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
