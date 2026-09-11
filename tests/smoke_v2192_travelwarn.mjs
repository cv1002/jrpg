// v21.92 专项冒烟：快速旅行目的地等级达标预警（体验打磨·信息透明·纯显示，承 v19.56 进图预警 /
// v19.89 状态页推荐等级 / v21.46 试炼推荐等级同一「难度透明」主线）——快速旅行列表的「推荐 Lv.X 起」
// 提示（TRAVEL_LIST 派生）与进图预警（v19.56，传送落地后才提示）都只陈述标准，玩家在旅行菜单上仍要
// 自己心算「我 Lv.几、够不够」；现于 drawTravel 选中行页脚区按 MAPS[k].recLv 与 hero.level 实时比对，
// 未达标（且非当前所在地）补红色预警行「⚠️ 目的地推荐 Lv.N · 你当前 Lv.M · 先补给再战！」——与
// TRAVEL_LIST 提示派生 / world.transition 进图预警 / 状态页推荐等级同读 MAPS.recLv 单一数据源。
// 本冒烟守护：版本锚点、MAPS.recLv 数据契约（1/3/6/10 与 TRAVEL_LIST 四图一一对应）、menus.js 源级
// 落位（selRec 比对 / 预警行 / 页脚 +24 让位 / 既有行逐字零回归）、运行期四档（未达标命中 / 达标不
// 显示 / 当前所在地不显示 / 安全区恒不触发）、README/package.json/CHANGELOG 同步（含 v21.91 README
// tests 树漏录补记）、姊妹件套 pin（v2191..v2176 八十八件套 / v2191..v2179 GAME_VERSION v21.92 /
// 旧代 pin 零残留）随新现实更新。
import { GAME_VERSION, MAPS, TRAVEL_LIST } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.92 快速旅行目的地等级达标预警冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.91 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.91', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 92)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已更新为 v21.92', GAME_VERSION === 'v22.11', GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const menusSrc = read('../js/view/menus.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v21.92 版本注释', dataSrc.includes('v21.92 快速旅行目的地等级达标预警'));
ok('data.js GAME_VERSION 字面量已更新为 v21.92', dataSrc.includes("const GAME_VERSION = 'v22.11';"));
ok('data.js 仍保留 v21.91 历史注释（累积注释块，姊妹 pin 不失效）', dataSrc.includes('v21.91 新成就「长明不熄」'));

// —— MAPS.recLv 数据契约（与 TRAVEL_LIST 四图一一对应，单一数据源）——
ok('MAPS.recLv 四图契约 村1/林3/矿6/廊10', MAPS.village.recLv === 1 && MAPS.dungeon.recLv === 3 &&
  MAPS.cave.recLv === 6 && MAPS.gallery.recLv === 10,
  `${MAPS.village.recLv}/${MAPS.dungeon.recLv}/${MAPS.cave.recLv}/${MAPS.gallery.recLv}`);
ok('TRAVEL_LIST 仍恰四图且顺序 village/dungeon/cave/gallery',
  TRAVEL_LIST.length === 4 && TRAVEL_LIST.map((x) => x[0]).join(',') === 'village,dungeon,cave,gallery');

// —— menus.js 源级落位 ——
ok('menus.js 含 v21.92 预警注释', menusSrc.includes('v21.92 目的地等级达标预警'));
ok('menus.js 选中行比对落位（selK/selRec 派生，防御式 MAPS[selK]||{}）',
  menusSrc.includes('const selK = TRAVEL_LIST[S.travelSel] && TRAVEL_LIST[S.travelSel][0];') &&
  menusSrc.includes('const selRec = (MAPS[selK] || {}).recLv;'));
ok('menus.js 预警行文案与条件落位（未达标且非当前所在地）',
  menusSrc.includes('selK !== curMap()') && menusSrc.includes('hero.level < selRec') &&
  menusSrc.includes('⚠️ 目的地推荐 Lv.${selRec} · 你当前 Lv.${hero.level} · 先补给再战！') &&
  menusSrc.includes("'#ff5b5b'"));
ok('menus.js 预警行让位页脚 +24（travelFootY(TRAVEL_LIST.length) + 24）',
  menusSrc.includes('travelFootY(TRAVEL_LIST.length) + 24'));
ok('menus.js 既有行逐字零回归（forEach 行/desc/提示/页脚原文未动）',
  menusSrc.includes('TRAVEL_LIST.forEach(([k,nm,desc,hint],i)=>') &&
  menusSrc.includes("text(hint,478,110+i*52,'bold 11px','#ffd24a','right')") &&
  menusSrc.includes("text('↑↓ 选择  ·  Enter 传送  ·  Esc 取消',320,travelFootY(TRAVEL_LIST.length),'12px','#7d93a3','center')") &&
  menusSrc.includes("const here=k===curMap()"));

// —— 运行期实证：DOM/音频/存储桩 + main.js 真实导入后 drawTravel 四档 ——
const noop = () => {};
const CAPTURED = [];
function makeCtx() {
  const grad = { addColorStop: noop };
  return {
    canvas: { width: 640, height: 480 },
    measureText: (t) => ({ width: String(t).length * 7 }),
    createLinearGradient: () => grad, createRadialGradient: () => grad, createConicGradient: () => grad, createPattern: () => ({}),
    beginPath: noop, closePath: noop, moveTo: noop, lineTo: noop, arc: noop, arcTo: noop, ellipse: noop,
    quadraticCurveTo: noop, bezierCurveTo: noop, fill: noop, stroke: noop, fillRect: noop, strokeRect: noop,
    clearRect: noop, drawImage: noop, save: noop, restore: noop, translate: noop, rotate: noop, scale: noop,
    transform: noop, setTransform: noop, clip: noop, rect: noop, setLineDash: noop, getLineDash: () => [],
    isPointInPath: () => false,
    globalAlpha: 1, strokeStyle: '#000', fillStyle: '#000', font: '', textAlign: 'left', textBaseline: 'alphabetic',
    lineWidth: 1, imageSmoothingEnabled: false,
    fillText: (t) => { CAPTURED.push(String(t)); },
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
    gain: { setValueAtTime: noop, linearRampToValueAtTime: noop, exponentialRampToValueAtTime: noop } }),
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
const { newGame } = await import('../js/core.js');
const { drawTravel, travelFootY } = await import('../js/view/menus.js');

function runTravel(hero, sel) {
  CAPTURED.length = 0;
  S.G = hero;
  S.travelSel = sel;
  S.scene = 'travel';
  let threw = null;
  try { drawTravel(); } catch (e) { threw = e; }
  return threw;
}

// 档 1：Lv.1 在村，选中雾语林（推荐 Lv.3）→ 预警行命中（未到访目的地同样预警——首次决策点）
let h = newGame('余烬');
h.level = 1;
let thr = runTravel(h, 1);
ok('运行期：未达标档 drawTravel 不抛错', thr === null, thr && String(thr.stack || thr));
ok('运行期：Lv.1 选中雾语林 → 「⚠️ 目的地推荐 Lv.3 · 你当前 Lv.1 · 先补给再战！」命中',
  CAPTURED.includes('⚠️ 目的地推荐 Lv.3 · 你当前 Lv.1 · 先补给再战！'), CAPTURED.join('|'));
ok('运行期：命中档页脚与原名行零回归（页脚 + ？？？占位）',
  CAPTURED.includes('↑↓ 选择  ·  Enter 传送  ·  Esc 取消') && CAPTURED.some((t) => t.includes('？？？ · 未探索')));

// 档 2：Lv.1 在村，选中星井矿脉（推荐 Lv.6）→ 预警数值同源派生
thr = runTravel(newGame('灯见'), 2);
ok('运行期：Lv.1 选中星井矿脉 → 「推荐 Lv.6 · 你当前 Lv.1」数值派生正确',
  CAPTURED.includes('⚠️ 目的地推荐 Lv.6 · 你当前 Lv.1 · 先补给再战！'), CAPTURED.join('|'));

// 档 3：Lv.3（恰达标）选中雾语林 → 不显示预警
h = newGame('潮');
h.level = 3;
thr = runTravel(h, 1);
ok('运行期：达标档 drawTravel 不抛错', thr === null, thr && String(thr.stack || thr));
ok('运行期：Lv.3 选中雾语林（恰达标）→ 零预警行',
  !CAPTURED.some((t) => t.includes('目的地推荐')));

// 档 4：Lv.1 选中当前所在地（雾语林、G.map=dungeon）→ 不显示预警（语义由进图预警/状态页承载）
h = newGame('灯');
h.level = 1;
h.map = 'dungeon';
h.visited = ['village', 'dungeon'];
thr = runTravel(h, 1);
ok('运行期：当前所在地档 drawTravel 不抛错', thr === null, thr && String(thr.stack || thr));
ok('运行期：Lv.1 选中当前所在地（雾语林 📍）→ 零预警行（k!==curMap() 守卫）',
  !CAPTURED.some((t) => t.includes('目的地推荐')));

// 档 5：Lv.1 在村，选中潮灯镇（安全区 recLv=1）→ 恒不触发
h = newGame('星');
h.level = 1;
thr = runTravel(h, 0);
ok('运行期：安全区档 drawTravel 不抛错', thr === null, thr && String(thr.stack || thr));
ok('运行期：Lv.1 选中潮灯镇（recLv=1 恒达标）→ 零预警行',
  !CAPTURED.some((t) => t.includes('目的地推荐')));

// 档 6：高等级（Lv.10 选中无字回廊，恰达标）→ 零预警
h = newGame('砂');
h.level = 10;
h.visited = ['village', 'dungeon', 'cave', 'gallery'];
thr = runTravel(h, 3);
ok('运行期：Lv.10 选中无字回廊（恰达标）→ 零预警行',
  !CAPTURED.some((t) => t.includes('目的地推荐')));

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树收录 smoke_v2191_ptime（v21.91 漏树，本版补录）', readme.includes('smoke_v2191_ptime'));
ok('README tests 树收录 smoke_v2193_hunt100/smoke_v2194_statuscodex/smoke_v2195_ptime2 且位于串尾（v2192 + 新件；v2195 随新现实由当版冒烟守护）', readme.includes('smoke_v2193_hunt100 + smoke_v2194_statuscodex + smoke_v2195_ptime2 + smoke_v2196_deadrecap + smoke_v2197_lucky2 + smoke_v2198_winsave + smoke_v2199_rich2 + smoke_v2200_stock + smoke_v2201_fragstatus + smoke_v2202_fragwin + smoke_v2204_brew2 + smoke_v2209_achstatus + smoke_v2210_unsaved + smoke_v2211_lampkid（npm test 串跑）'));
ok('README 件套口径为一百零七件套（一百零六件套清除）',
  readme.includes('冒烟一百零七件套（一百零六件套清除）') && !readme.includes('冒烟八十七件套（八十六件套清除）'));
ok('README 含 v21.92 守护描述', readme.includes('v21.92 起含快速旅行目的地等级达标预警守护'));
ok('README 系统清单快速旅行句含目的地等级达标预警（v21.92 口径）',
  readme.includes('目的地等级达标预警'));
ok('package.json 已收录 smoke_v2192_travelwarn（npm test 串跑第 88 份）',
  pkg.includes('smoke_v2192_travelwarn.mjs') && /smoke_v2191_ptime\.mjs && node tests\/smoke_v2192_travelwarn\.mjs/.test(pkg));
ok('CHANGELOG 含 v21.92 条目', changelog.includes('## v21.92 '));

// —— 姊妹件套 pin 复查（v21.7 惯例：本版冒烟守护姊妹随新现实更新）——
const suite88 = ['smoke_v2191_ptime.mjs', 'smoke_v2190_launch.mjs', 'smoke_v2189_visitedlegacy.mjs',
  'smoke_v2188_wander.mjs', 'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs',
  'smoke_v2185_steleclear.mjs', 'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs',
  'smoke_v2182_winrecap.mjs', 'smoke_v2181_helpquickcast.mjs', 'smoke_v2180_grain.mjs',
  'smoke_v2179_titlerecap.mjs', 'smoke_v2178_codexseen.mjs', 'smoke_v2177_elites.mjs',
  'smoke_v2176_allchests.mjs'];
for (const nm of suite88) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README 件套 pin 已随新现实更新为一百零七件套（一百零六件套清除）`,
    src.includes('一百零七件套（一百零六件套清除）'));
}
const vers = ['smoke_v2191_ptime.mjs', 'smoke_v2190_launch.mjs', 'smoke_v2189_visitedlegacy.mjs',
  'smoke_v2188_wander.mjs', 'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs',
  'smoke_v2185_steleclear.mjs', 'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs',
  'smoke_v2182_winrecap.mjs', 'smoke_v2181_helpquickcast.mjs', 'smoke_v2179_titlerecap.mjs'];
for (const nm of vers) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 字面量 pin 已随新现实更新为 v21.92`,
    src.includes("const GAME_VERSION = 'v22.11';"));
}
// 旧代 pin 零残留：全部测试文件不得再含 v21.91 版本字面量 pin（拆串构造避免本文件扫描行自匹配）
const OLD_GV = "const GAME_VERSION = 'v21.9" + "1';";
let stale = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes(OLD_GV)) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v21.91 全库清零）', stale.length === 0, stale.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
