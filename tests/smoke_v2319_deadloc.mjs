// v23.79 专项冒烟：阵亡画面战绩行「📍 阵亡地点」——体验打磨·信息透明·纯显示，
// 承 v23.78 战斗画面「📍 所在地」/ v23.77 暂停菜单「📍 地图名」/ v19.89 状态页「📍 地图名」/
// v23.27 快速旅行「当前所在地标注」同一「我在哪」单一数据源口径收口：五屏决策现场
// （状态/快旅/暂停/战斗/阵亡）逐屏核对，唯有阵亡复盘屏查无一行——玩家倒在强敌面前
// （祭坛/试炼碑/传送门直接切战，死时战场可能在雾语林还是星井矿脉），「B 重整旗鼓 / R 重开 /
// T 回标题」三选一现场却看不到地点；现与 drawStatus/drawPause/drawBattle 同读
// (MAPS[curMap()]||{}).name||curMap() 一份源（防御式、加/删/改名地图自动跟随零裸字面量），
// drawDead 战绩行（y=236，v23.10 困难档后缀之后）追加「 · 📍地图名」（与 v23.10 同款同式
// 行内后缀、基线零位移），纯显示零结算零存档零数值变化（战绩行其余字段/余粮行/建议行/
// 收集行/五徽记行/按键行/未存档行逐字未动）。
// 本冒烟守护：版本锚点、menus.js 源级落位（v23.79 注释 / 📍 后缀派生 / 既有行零回归）、
// 运行期 drawDead 真实渲染捕获（village→「📍潮灯镇」/gallery→「📍无字回廊」两档 + 既有行零回归）、
// README/package.json/CHANGELOG 同步（tests 树串尾 + 件套口径 + v23.79 守护描述 + 阵亡行口径 + 入库 215 份）、
// 旧代 v23.78 pin 全库零残留扫描、哨兵链、断链防回归。
import { S } from '../js/state.js';
import { GAME_VERSION } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v23.18 冒烟先例：先装桩再 import main.js）——
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

console.log('— v23.79 阵亡画面「📍 阵亡地点」 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const menusSrc = read('js/view/menus.js');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v23.79 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v23.79', !!_gv && (_gv[0] > 23 || (_gv[0] === 23 && _gv[1] > 79)), GAME_VERSION);
ok('data.js 含 v23.80 注释（身经百战说明）', dSrc.includes('v23.80 新内容·战斗遭遇维度单档里程碑'));
ok('data.js GAME_VERSION 字面量已为 v23.80（旧 v23.79 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v23.85';") && !dSrc.includes("const GAME_VERSION = 'v23.7" + "9';"));
ok('data.js 仍保留 v23.79 历史注释（阵亡地点说明，累积注释块）', dSrc.includes('v23.79 体验打磨·信息透明·纯显示'));
ok('data.js 仍保留 v23.78 历史注释（战斗画面所在地，累积注释块）', dSrc.includes('v23.78 体验打磨·信息透明·纯显示'));
ok('data.js 仍保留 v23.77 历史注释（暂停菜单当前所在地，累积注释块）', dSrc.includes('v23.77 体验打磨·信息透明·纯显示'));
ok('data.js 仍保留 v23.76 历史注释（步行累计里程碑，姊妹 pin 不失效）', dSrc.includes('v23.76 新内容·步行累计维度里程碑'));

// —— menus.js 源级落位：v23.79 注释 + 📍 后缀同数据源派生 + 既有行零回归 ——
ok('menus.js 含 v23.79 注释（阵亡地点说明）', menusSrc.includes('v23.79 体验打磨·信息透明·纯显示'));
ok('menus.js 仍保留 v23.77 注释（drawPause 头部当前所在地，历史注释累积）', menusSrc.includes('v23.77 体验打磨·信息透明·纯显示'));
ok('📍 后缀由 (MAPS[curMap()]||{}).name||curMap() 派生（与 drawStatus/drawPause/drawBattle 单一数据源同式）',
  menusSrc.includes("` · 📍${(MAPS[curMap()] || {}).name || curMap()}`"));
ok('📍 后缀落战绩行 y=236（v23.10 困难档后缀之后、与前缀同一条 text 调用）',
  menusSrc.includes('CV.width/2,236,\'13px\',\'#7d93a3\',\'center\');'));
ok('战绩行既有字段逐字保留（当前 Lv/金币/累计讨伐/⏱️ 前缀 + v23.10 困难档后缀）',
  menusSrc.includes('`当前 Lv.${hero.level} · 金币 ${hero.gold} · 累计讨伐 ${kills} 只 · ⏱️${fmtTime(hero.time)}` + (hero.diff ? \' · \' + DIFFS[hero.diff] : \'\')'));
ok('余粮行零回归（v19.88 剩余补给行逐字）',
  menusSrc.includes('`身上余粮：🍖 生命药水 ${hero.item} 瓶 · 🧪 高级灵药 ${hero.potion2 || 0} 瓶 · 🍄 魔法蘑菇 ${hero.mushrooms || 0} 株`'));
ok('收集行零回归（v21.96/v22.3 四件套行逐字）',
  menusSrc.includes('`🏆 成就 ${(hero.ach||[]).length}/${ACH_LIST.length} · 📕 图鉴 ${codexN}/${BESTIARY_TARGET.length} · 📦 宝箱 ${chestN}/${chestTotal()} · 🕯️ 记忆碎片 ${fragN}/${FRAGMENTS.length}`'));
ok('五徽记进度行零回归（v22.95 冒险进度行逐字）',
  menusSrc.includes("text('冒险进度：' + progD.map(([nm, dn]) => (dn ? '✓ ' : '✗ ') + nm).join(' · '), CV.width / 2, 432, '12px', '#7d93a3', 'center');"));
ok('按键行零回归（R/T/B 三行逐字未动）',
  menusSrc.includes("text('按 R 重新开始本次冒险',CV.width/2,332,'15px','#7d93a3','center');") &&
  menusSrc.includes("text('按 T 返回标题画面',CV.width/2,362,'15px','#7d93a3','center');") &&
  menusSrc.includes("text('按 B 重整旗鼓，再战强敌！',CV.width/2,392,'15px','#ffd24a','center');"));
ok('MAPS 由既有 import 复用（menus.js data.js import 行含 MAPS，零新增模块依赖）',
  menusSrc.includes('import { GAME_VERSION, MAPS,'));
ok('curMap 由既有 state.js import 复用（menus.js 既有 import 行零新增依赖）',
  menusSrc.includes("import { S, curMap } from '../state.js';"));

// —— 运行期：drawDead 真实渲染捕获（village / gallery 两档 📍 + 既有行零回归 + 零抛错）——
{
  const { CTX } = await import('../js/view/canvas.js');
  const { drawDead } = await import('../js/view/menus.js');
  const cap = [];
  const origFt = CTX.fillText;
  CTX.fillText = (t, ...a) => { cap.push(String(t)); return origFt.call(CTX, t, ...a); };
  let threw = null;
  try {
    const hero = { name: '余烬', level: 5, gold: 100, bestiary: {}, time: 120, item: 2, potion2: 0,
      mushrooms: 1, ach: [], fragments: [], hp: 1, hpMax: 50, mp: 1, mpMax: 20, map: 'village' };
    S.G = hero;
    S.enemy = { name: '野狼' };
    S.scene = 'dead';
    S.curSaveSlot = 1;
    S.unsaved = false;
    cap.length = 0;
    drawDead();
    ok('village：战绩行捕获「📍潮灯镇」', cap.some((t) => t.includes('📍潮灯镇')),
      JSON.stringify(cap.filter((t) => t.includes('📍'))));
    ok('战绩行其余字段零回归（当前 Lv.5 · 金币 100 · 累计讨伐 0 只）',
      cap.some((t) => t.includes('当前 Lv.5 · 金币 100 · 累计讨伐 0 只')));
    ok('败于行零回归（S.enemy 名）', cap.includes('败于 野狼'), JSON.stringify(cap.filter((t) => t.includes('败于'))));
    ok('余粮行零回归', cap.some((t) => t.includes('身上余粮：🍖 生命药水 2 瓶')));
    ok('收集行零回归（🏆 成就 0/74）', cap.includes('🏆 成就 0/74 · 📕 图鉴 0/13 · 📦 宝箱 0/12 · 🕯️ 记忆碎片 0/4'),
      JSON.stringify(cap.filter((t) => t.includes('🏆'))));
    ok('五徽记进度行零回归（全 ✗）', cap.some((t) => t.includes('冒险进度：✗ 灯芯 · ✗ 星井 · ✗ 回廊 · ✗ 初灯 · ✗ 试炼场')));
    ok('按键行零回归（R/T 在列、B 无——普通怪战败）',
      cap.includes('按 R 重新开始本次冒险') && cap.includes('按 T 返回标题画面') && !cap.includes('按 B 重整旗鼓，再战强敌！'));
    ok('unsaved=false 零「未存档」文字（v22.93 提示不误报）', !cap.some((t) => t.includes('未存档')));
    cap.length = 0;
    hero.map = 'gallery';
    drawDead();
    ok('gallery（最长名档）：战绩行捕获「📍无字回廊」', cap.some((t) => t.includes('📍无字回廊')),
      JSON.stringify(cap.filter((t) => t.includes('📍'))));
    ok('困难档后缀零回归（v23.10：diff 后缀在 📍 之前同式共存）', (() => {
      hero.diff = 1;
      cap.length = 0;
      drawDead();
      return cap.some((t) => t.includes(' · 困难 · 📍无字回廊'));
    })());
  } catch (e) { threw = e; }
  ok('运行期 drawDead 渲染零抛错', threw === null, threw && String(threw.stack || threw));
  CTX.fillText = origFt;
  S.G = null; S.enemy = null; S.scene = 'title';
}

// —— README / package.json / CHANGELOG 同步 ——
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');
const testChain = (JSON.parse(pkg).scripts.test.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 215 件套', testChain === 215, String(testChain));
ok('package.json 已收录 smoke_v2319_deadloc（npm test 串跑第 215 份）',
  JSON.parse(pkg).scripts.test.includes('smoke_v2319_deadloc.mjs'));
ok('package.json 串尾为 ... smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs"',
  pkg.includes('node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs"'));
ok('README tests 树串尾已延伸至 smoke_v2319_deadloc',
  readme.includes('+ smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc（npm test 串跑）'));
ok('README 件套口径为二百一十五件套（二百一十四件套清除）且旧 214 口径零残留',
  readme.includes('冒烟二百一十五件套（二百一十四件套清除）') && !readme.includes('冒烟二百一十四件套（二百一十三件套清' + '除）'));
ok('README 含 v23.79 守护描述（阵亡画面「📍 阵亡地点」守护）', readme.includes('v23.79 起含 阵亡画面「📍 阵亡地点」守护'));
ok('README 含 smoke_v2319_deadloc 入库（215 份）', readme.includes('smoke_v2319_deadloc 入库（215 份）'));
ok('README 阵亡行含 v23.79 阵亡地点口径', readme.includes('v23.79 起阵亡画面战绩行常显「📍 阵亡地点」'));
ok('README 仍保留 v23.78 历史守护描述与入库口径（历史累积）',
  readme.includes('v23.78 起含 战斗画面「所在地」守护') && readme.includes('smoke_v2318_battlemap 入库（214 份）'));
ok('README 仍保留 v23.77 历史守护描述与入库口径（历史累积）',
  readme.includes('v23.77 起含 暂停菜单「当前所在地」守护') && readme.includes('smoke_v2317_pausemap 入库（213 份）'));
ok('CHANGELOG 顶部已追加 v23.79 条目（阵亡地点）', changelog.startsWith('## v23.85 '));
ok('CHANGELOG 顶部条目含 v23.79 阵亡地点说明', changelog.includes('## v23.79 阵亡画面战绩行补「📍 阵亡地点」'));
ok('CHANGELOG 仍保留 v23.78 条目标题（历史口径）', changelog.includes('## v23.78 战斗画面顶部右缘补「📍 所在地」'));
ok('CHANGELOG 仍保留 v23.77 条目标题（历史口径）', changelog.includes('## v23.77 暂停菜单（Esc）头部补「当前所在地」'));

// —— 哨兵链：v2143 前哨前望 216 且 README 尚无 216 口径 ——
const s2143 = read('tests/smoke_v2143_talkekey.mjs');
ok('smoke_v2143 哨兵链已推进至二百一十六件套（二百一十五件套清除）',
  s2143.includes('二百一十六件套（二百一十五件套清除）') && s2143.includes("!readme.includes('二百一十六件套（二百一十五件套清除）')"));
ok('README 尚无二百一十六件套（二百一十五件套清除）前望口径', !readme.includes('二百一十六件套（二百一十五件套清除）'));

// —— 旧代 v23.79 pin 全库零残留（不含本件；拆串防误伤，承 v2318 惯例）——
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2319_deadloc.mjs');
const stale = [];
for (const f of allTests) {
  const src = read('tests/' + f);
  if (src.includes("const GAME_VERSION = 'v23.7" + "9';") ||
      src.includes("GAME_VERSION === 'v23.7" + "9'") ||
      src.includes("startsWith('## v23.7" + "9 ")) stale.push(f);
}
ok('旧代 v23.79 字面量/恒等/顶 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.79 特性标签保留）',
  stale.length === 0, stale.join(','));

// —— 零回归：ACH_LIST 74 项 / NPCS 37 处不变（本版成就版图并入「身经百战」——v23.80 非显示改动）——
const { ACH_LIST, NPCS } = await import('../js/data.js');
ok('ACH_LIST 精确总数 73（v23.80 身经百战为末项，未动既有 72 项零位移）', ACH_LIST.length === 74, String(ACH_LIST.length));
ok('NPCS 仍 37 处（灯下之声口径未动）', Object.keys(NPCS).length === 37, String(Object.keys(NPCS).length));

console.log(`— v23.79 冒烟结束：${n} 项，失败 ${failed} —`);
if (failed > 0) process.exit(1);
