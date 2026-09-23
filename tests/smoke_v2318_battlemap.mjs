// v23.79 专项冒烟：战斗画面顶部右缘「📍 所在地」——体验打磨·信息透明·纯显示，
// 承 v23.77 暂停菜单「📍 地图名」/ v19.89 状态页「📍 地图名」/ v23.27 快速旅行「当前所在地标注」
// 同一「我在哪」单一数据源口径收口：战斗是玩家最容易忘记自己在哪个图的场景（祭坛/试炼碑/传送门
// 直接切战，打赢想回补给却不知身在雾语林还是星井矿脉），DOM HUD（s-map）在画布下方非画面内、
// v23.77 后「画面内」口径已铺到 状态/快旅/暂停 三端，唯独战斗画面查无一行（连 arenaTheme 都按图
// 区分背景）；现与 drawStatus/drawPause 同读 (MAPS[curMap()]||{}).name||curMap() 一份源
// （防御式、加/删/改名地图自动跟随零裸字面量；drawBattle 补 MAPS import 零新增模块依赖），
// 12px 灰字 620 右对齐（角标列同 x 位、y=26 与左侧「⚔️ 回合 N」同基线的空位），
// 纯显示零结算零存档零数值变化（回合/敌方/预览/指令栏逐字未动）。
// 本冒烟守护：版本锚点、drawBattle.js 源级落位（MAPS import / v23.79 注释 / 📍 行 / 回合行零回归）、
// 运行期 drawBattle 真实渲染捕获（village→「📍潮灯镇」/gallery→「📍无字回廊」两档 + 回合计数零回归）、
// README/package.json/CHANGELOG 同步（tests 树串尾 + 件套口径 + v23.79 守护描述 + 战斗行口径 + 入库 214 份）、
// 旧代 v23.77 pin 全库零残留扫描、哨兵链 v2143 前望 215、断链防回归。
import { S } from '../js/state.js';
import { GAME_VERSION } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v23.17 冒烟先例：先装桩再 import main.js）——
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

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v23.79 战斗画面「📍 所在地」 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const dbSrc = read('js/view/drawBattle.js');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v23.77 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v23.77', !!_gv && (_gv[0] > 23 || (_gv[0] === 23 && _gv[1] > 77)), GAME_VERSION);
ok('data.js 含 v23.79 注释（战斗画面所在地说明）', dSrc.includes('v23.80 新内容·战斗遭遇维度单档里程碑'));
ok('GAME_VERSION 字面量已为 v23.79（旧 v23.77 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v23.87';") && !dSrc.includes("const GAME_VERSION = 'v23.7" + "7';"));
ok('data.js 仍保留 v23.77 历史注释（暂停菜单当前所在地，累积注释块）', dSrc.includes('v23.77 体验打磨·信息透明·纯显示'));
ok('data.js 仍保留 v23.76 历史注释（步行累计里程碑，姊妹 pin 不失效）', dSrc.includes('v23.76 新内容·步行累计维度里程碑'));

// —— drawBattle.js 源级落位：v23.79 注释 + MAPS import + 📍 行 + 既有回合行零回归 ——
ok('drawBattle.js 仍保留 v23.78 注释（战斗画面所在地说明，历史注释累积）', dbSrc.includes('v23.78 体验打磨·信息透明·纯显示'));
ok('drawBattle.js data.js import 补 MAPS（零新增模块依赖）',
  dbSrc.includes("FRAGMENTS, MAPS } from '../data.js';"));
ok('📍 行由 (MAPS[curMap()]||{}).name||curMap() 派生（与 drawStatus/drawPause 单一数据源同式）',
  dbSrc.includes('(MAPS[curMap()] || {}).name || curMap()'));
ok('📍 行落 620 右对齐 12px 灰字（角标列同 x 位、y=26 同基线行）',
  dbSrc.includes("620, 26, '12px', '#7d93a3', 'right'"));
ok('「⚔️ 回合 N」行逐字未动（v12.9 起既有口径零回归）',
  dbSrc.includes("text(`⚔️ 回合 ${S.battleTurn || 1}`, 60, 26, 'bold 14px', '#ffd24a');"));
ok('试炼关行「🧭 试炼三连战 第 N/3 关」零回归（v12.9 口径）',
  dbSrc.includes('`🧭 试炼三连战 第 ${st}/${RUSH_BOSSES.length} 关${rushNote}`'));

// —— 运行期：drawBattle 真实渲染捕获（village / gallery 两档 📍 + 回合计数零回归 + 零抛错）——
{
  const { drawBattle } = await import('../js/view/drawBattle.js');
  const { CTX } = await import('../js/view/canvas.js');
  const cap = [];
  const origFt = CTX.fillText;
  CTX.fillText = (t, ...a) => { cap.push(String(t)); return origFt.call(CTX, t, ...a); };
  const heroObj = () => ({ name: '余烬', level: 3, xp: 0, xpNext: 20, hp: 45, hpMax: 45, mp: 10, mpMax: 12,
    item: 0, potion2: 0, atkMax: 11, defMax: 6, skills: [], weapon: '木剑', armor: '布衣',
    gold: 30, seen: {}, bestiary: {}, quests: {}, map: 'village' });
  const entryEnemy = () => ({ name: '史莱姆', hp: 16, hpMax: 16, xp: 8, gold: 8, atk: 7, def: 4, color: '#7fd84f',
    draw: 'slime', acts: [{ type: 'attack', w: 100 }], weak: 'fire' });
  let threw = null;
  try {
    S.G = heroObj();
    S.enemy = entryEnemy();
    S.scene = 'battle';
    S.blog = []; S.blogView = 0;
    S.fx = []; S.parr = [];
    S.skillMenuOpen = false; S.battleTurn = 2;
    S.shake = null; S.flash = null;
    cap.length = 0;
    drawBattle();
    ok('village：头部捕获「📍潮灯镇」', cap.includes('📍 潮灯镇'), JSON.stringify(cap.filter((t) => t.includes('📍'))));
    ok('回合计数零回归（⚔️ 回合 2）', cap.includes('⚔️ 回合 2'), JSON.stringify(cap.filter((t) => t.includes('回合'))));
    cap.length = 0;
    S.G.map = 'gallery';
    drawBattle();
    ok('gallery（最长名档）：头部捕获「📍无字回廊」', cap.includes('📍 无字回廊'), JSON.stringify(cap.filter((t) => t.includes('📍'))));
    ok('两档渲染零抛错', true);
  } catch (e) { threw = e; }
  ok('运行期 drawBattle 渲染零抛错', threw === null, threw && String(threw.stack || threw));
  CTX.fillText = origFt;
  S.G = null; S.enemy = null; S.scene = 'title';
}

// —— README / package.json / CHANGELOG 同步 ——
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');
const testChain = (JSON.parse(pkg).scripts.test.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 214 件套', testChain === 215, String(testChain));
ok('package.json 已收录 smoke_v2318_battlemap（npm test 串跑第 215 份）',
  JSON.parse(pkg).scripts.test.includes('smoke_v2318_battlemap.mjs'));
ok('package.json 串尾为 ... smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs"',
  pkg.includes('node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs"'));
ok('README tests 树串尾已延伸至 smoke_v2319_deadloc',
  readme.includes('+ smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc（npm test 串跑）'));
ok('README 件套口径为二百一十五件套（二百一十四件套清除）且旧 213 口径零残留',
  readme.includes('冒烟二百一十五件套（二百一十四件套清除）') && !readme.includes('冒烟二百一十三件套（二百一十二件套清' + '除）'));
ok('README 仍保留 v23.78 守护描述（战斗画面「所在地」守护，历史口径）', readme.includes('v23.78 起含 战斗画面「所在地」守护'));
ok('README 含 smoke_v2318_battlemap 入库（214 份）', readme.includes('smoke_v2318_battlemap 入库（214 份）'));
ok('README 仍保留 v23.78 战斗行当前所在地口径（历史口径）', readme.includes('v23.78 起战斗画面顶部常显「📍 当前地图名」'));
ok('README 仍保留 v23.77 历史守护描述与入库口径（历史累积）',
  readme.includes('v23.77 起含 暂停菜单「当前所在地」守护') && readme.includes('smoke_v2317_pausemap 入库（213 份）'));
ok('CHANGELOG 顶部已追加 v23.79 条目（战斗画面所在地）', changelog.startsWith('## v23.87 '));
ok('CHANGELOG 仍保留 v23.78 条目标题（战斗画面顶部右缘补「📍 所在地」，历史口径）', changelog.includes('## v23.78 战斗画面顶部右缘补「📍 所在地」'));
ok('CHANGELOG 仍保留 v23.77 条目标题（历史口径）', changelog.includes('## v23.77 暂停菜单（Esc）头部补「当前所在地」'));

// —— 哨兵链：v2143 前哨前望 215 且 README 尚无 215 口径 ——
const s2143 = read('tests/smoke_v2143_talkekey.mjs');
ok('smoke_v2143 哨兵链已推进至二百一十六件套（二百一十五件套清除）',
  s2143.includes('二百一十六件套（二百一十五件套清除）') && s2143.includes("!readme.includes('二百一十六件套（二百一十五件套清除）')"));
ok('README 尚无二百一十六件套（二百一十五件套清除）前望口径', !readme.includes('二百一十六件套（二百一十五件套清除）'));

// —— 旧代 v23.77 pin 全库零残留（不含本件；拆串防误伤，承 v2317 惯例）——
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2318_battlemap.mjs');
const stale = [];
for (const f of allTests) {
  const src = read('tests/' + f);
  if (src.includes("const GAME_VERSION = 'v23.7" + "7';") ||
      src.includes("GAME_VERSION === 'v23.7" + "7'") ||
      src.includes("startsWith('## v23.7" + "7 ") ||
      src.includes('testChain === ' + '213') ||
      src.includes('第 ' + '213 份') ||
      src.includes('smoke_v2316_voiceshead + smoke_v2317_pausemap（npm test 串' + '跑）') ||
      src.includes('node tests/smoke_v2317_pausemap.mjs' + '"') ||
      src.includes('二百一十三件套（二百一十二件套清' + '除）') ||
      src.includes('二百一十四件套（二百一十四件套清' + '除）')) stale.push(f);
}
ok('旧代 v23.77 字面量/恒等/顶 pin/件套/testChain/串尾 全库零残留（' + allTests.length + ' 件扫描，仅 v23.77 特性标签保留）',
  stale.length === 0, stale.join(','));

// —— 零回归：ACH_LIST 72 项 / NPCS 37 处不变（本版非成就改动、非新 NPC）——
const { ACH_LIST, NPCS } = await import('../js/data.js');
ok('ACH_LIST 精确总数 72（v23.76 千里之行为末项，未动）', ACH_LIST.length === 75, String(ACH_LIST.length));
ok('NPCS 仍 37 处（灯下之声口径未动）', Object.keys(NPCS).length === 37, String(Object.keys(NPCS).length));

console.log(`— v23.79 冒烟结束：${n} 项，失败 ${failed} —`);
if (failed > 0) process.exit(1);
