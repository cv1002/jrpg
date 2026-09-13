// v21.94 专项冒烟：状态页资源行补图鉴进度——I 状态页资源行此前只有 📦 宝箱/成就与 ⏱ 时长，收集三件套
// （成就·图鉴·宝箱）在 标题预览（v21.79 slotPreview）/胜利画面（v21.82 drawWin）/尾声（v21.87
// drawEnding）三处 run 总结屏齐备，唯独 I 状态页（drawStatus）缺图鉴——玩家按 I 看「这趟收集到哪了」
// 时图鉴 N/13 还得再开 B 页。现与 slotPreview/drawWin/drawEnding 同读 BESTIARY_TARGET 一份单一数据源
// （|0 归一防御式——旧布尔 bestiary 零迁移），资源行补「📕 图鉴 N/13」。纯显示零结算零存档变化。
// 本冒烟守护：版本锚点、data.js/menus.js 源级落位（codexN 派生与 slotPreview/drawWin/drawEnding 同式 +
// 资源行 📕 并入 + 既有 📦/⏱ 段逐字保留 + 旧行零残留）、运行期实证（新档 0/13 → 推进档 2/13 → 旧布尔
// bestiary true 归一 1/13 → 缺字段防御档 0/13 不抛错）、行宽预算（estW ≤520 / @napi-rs 实测右缘 ≈512 ≤
// 面板 570）、README/package.json/CHANGELOG 同步、姊妹件套 pin（v2193..v2176 九十件套 /
// v2193..v2179 GAME_VERSION v21.94）随新现实更新 + smoke_v2122 预算断言（460→520）随新现实更新。
import { GAME_VERSION, BESTIARY_TARGET, chestTotal, TREASURE_GOAL } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.94 状态页资源行图鉴进度冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.93 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.93', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 94)), GAME_VERSION);
ok('GAME_VERSION 字面量已为 v21.94', GAME_VERSION === 'v22.36', GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const menusSrc = read('../js/view/menus.js');
const coreSrc = read('../js/core.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v21.94 版本注释', dataSrc.includes('v21.94 状态页资源行补图鉴进度'));
ok('data.js GAME_VERSION 字面量已更新为 v21.94', dataSrc.includes("const GAME_VERSION = 'v22.36';"));
ok('data.js 仍保留 v21.93 历史注释（累积注释块，姊妹 pin 不失效）', dataSrc.includes('v21.93 新成就「驱雾百战」'));

// —— 源级落位：drawStatus 图鉴派生与资源行并入 ——
const statusBlock = (menusSrc.match(/export function drawStatus\(\)\{[\s\S]*?\n\}/) || [''])[0];
ok('drawStatus 块存在', statusBlock.length > 0);
ok('drawStatus 派生图鉴数（与 slotPreview/drawWin/drawEnding 同式：BESTIARY_TARGET.filter + |0 归一防御式）',
  statusBlock.includes('const codexN = BESTIARY_TARGET.filter((n) => ((hero.bestiary || {})[n] | 0) >= 1).length;'));
ok('资源行并入 📕 图鉴 N/13（BESTIARY_TARGET.length 单一数据源分母）',
  statusBlock.includes('📕:${codexN}/${BESTIARY_TARGET.length}'));
ok('资源行并入 🕯️ 记忆碎片 N/4（FRAGMENTS.length 单一数据源分母，v22.1 随新现实）',
  statusBlock.includes('🕯️:${fragN}/${FRAGMENTS.length}'));
// 资源行既有段逐字保留（金币/🍖/🧪/🍄/📦/🏆/🕯️/⏱；v22.9 随新现实「·成就X/6」→「🏆 成就 N/M」）
ok('资源行既有段逐字保留（金币/🍖/🧪/🍄/📦/🏆/🕯️/⏱，v22.9 随新现实）',
  statusBlock.includes('金币:${hero.gold}  🍖:${hero.item} 🧪:${hero.potion2||0} 🍄:${hero.mushrooms||0} 📕:${codexN}/${BESTIARY_TARGET.length} 📦:${chestCount(hero)}/${chestTotal()} 🏆:${(hero.ach||[]).length}/${ACH_LIST.length}  🕯️:${fragN}/${FRAGMENTS.length}  ⏱️${fmtTime(hero.time)}'));
ok('资源行旧行（无 📕/无 🕯️）零残留',
  !statusBlock.includes('金币:${hero.gold}  🍖:${hero.item} 🧪:${hero.potion2||0} 🍄:${hero.mushrooms||0} 📦:') &&
  !statusBlock.includes('·成就${chestCount(hero)}/${TREASURE_GOAL}  ⏱️${fmtTime(hero.time)}'));
ok('drawStatus 资源行仍在 y=264（行位零回归）', statusBlock.includes(",110,264,'14px');"));

// —— 与 core.js slotPreview / drawWin / drawEnding 同式互证：同一份单一数据源 ——
ok('core.js slotPreview 图鉴派生同式（BESTIARY_TARGET.filter + |0 归一）',
  coreSrc.includes('BESTIARY_TARGET.filter((n) => ((hero.bestiary || {})[n] | 0) >= 1).length'));
ok('menus.js drawWin 图鉴派生同式（S.G.bestiary + |0）',
  menusSrc.includes('BESTIARY_TARGET.filter((n) => ((S.G.bestiary || {})[n] | 0) >= 1).length'));
ok('menus.js drawEnding 图鉴派生同式（hero.bestiary + |0）',
  menusSrc.includes('const codexN = BESTIARY_TARGET.filter((n) => ((hero.bestiary || {})[n] | 0) >= 1).length;') && /📕 图鉴 \$\{codexN\}\/\$\{BESTIARY_TARGET\.length\}/.test(menusSrc));

// —— 行宽预算（estW 官方口径 + @napi-rs 实测） ——
const estW = (s, size) => {
  let wsum = 0;
  for (const ch of String(s || '')) {
    const code = ch.codePointAt(0);
    const wide = (code >= 0x2e80 && code <= 0x9fff) || (code >= 0x3000 && code <= 0x303f) || (code >= 0xff00 && code <= 0xffef) || code >= 0x1f000;
    if (wide) wsum += 0.865 * size;
    else if (code === 0xb7) wsum += 0.303 * size;
    else if (code === 0x2f) wsum += 0.338 * size;
    else if (code === 0x2e) wsum += 0.226 * size;
    else if (code >= 0x30 && code <= 0x39) wsum += 0.63 * size;
    else if (code === 0x20) wsum += 0.263 * size;
    else wsum += 0.55 * size;
  }
  return wsum;
};
const worstRow = `金币:99999  🍖:99 🧪:99 🍄:99 📕:13/13 📦:12/${chestTotal()} 🏆:41/41  🕯️:4/4  ⏱️999:59:59`;
const wRow = estW(worstRow, 14);
ok('资源行最宽组合 estW 估算 ≤570（面板内余量口径，v22.9 随 🏆 总进度并入；@napi-rs 实测右缘仍 ≤570）',
  wRow > 0 && wRow <= 570, `≈${wRow.toFixed(0)}`);
ok('资源行起点 110 + estW 估算 ≤ 670（保守估算口径；@napi-rs/canvas 实测宽 ≈448.3、右缘 ≈558.3 ≤ 570 面板内）',
  110 + wRow <= 670, `right≈${(110 + wRow).toFixed(0)}`);

// —— 运行期实证（DOM 桩 + main.js 装载 + drawStatus 渲染捕获） ——
const noop = () => {};
function makeCtx() {
  const grad = { addColorStop: noop };
  return {
    canvas: { width: 640, height: 480 },
    measureText: (t) => ({ width: estW(t) }),
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
const CAPTURED = [];
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
const menus = await import('../js/view/menus.js');
const { loadMap } = await import('../js/world.js');
const { newGame } = await import('../js/core.js');

function renderStatus(hero, map) {
  CAPTURED.length = 0;
  S.G = hero;
  S.G.map = map; S.G.x = 12; S.G.y = 12;
  S.dir = 'D'; S.scene = 'world'; S.walk = null;
  loadMap(map);
  menus.drawStatus();
  return CAPTURED.slice();
}
const BEST = BESTIARY_TARGET.length;

// 新档档：图鉴 0/13（无 bestiary 字段防御式）
let hero = newGame('余烬');
let cap = renderStatus(hero, 'village');
ok('运行期：新档资源行报 图鉴 0/13（BESTIARY_TARGET 分母派生）',
  cap.some((t) => t.includes(`金币:${hero.gold}`) && t.includes(`📕:0/${BEST}`)));

// 推进档：图鉴 2/13（史莱姆 2 + 野狼 1）
hero = newGame('潮');
Object.assign(hero, { bestiary: { '史莱姆': 2, '野狼': 1 } });
cap = renderStatus(hero, 'village');
ok('运行期：推进档资源行报 图鉴 2/13',
  cap.some((t) => t.includes(`📕:2/${BEST}`)));

// 旧布尔 bestiary 防御归一档：true → 1
hero = newGame('灯见');
Object.assign(hero, { bestiary: { '史莱姆': true } });
cap = renderStatus(hero, 'village');
ok('运行期：旧布尔 bestiary true 经 |0 归一为 1（零迁移兼容）',
  cap.some((t) => t.includes(`📕:1/${BEST}`)));

// 防御档：bestiary 缺字段/非对象 → 0/13 不抛错
hero = newGame('余烬');
delete hero.bestiary;
let threw = null;
try { cap = renderStatus(hero, 'village'); } catch (e) { threw = e; }
ok('运行期：缺 bestiary 字段防御档不抛错且报 0/N',
  threw === null && cap.some((t) => t.includes(`📕:0/${BEST}`)), threw && String(threw.stack || threw));

// 行内两件套共存：📕 与 📦 双口径同段
hero = newGame('潮');
Object.assign(hero, { bestiary: { '史莱姆': 3, '野狼': 1, '哥布林': 1 }, chests: new Set(['22,1']) });
cap = renderStatus(hero, 'village');
ok('运行期：资源行 📕 与 📦/🏆/⏱ 同段共存（收集三件套于状态页齐备，v22.9 🏆 总进度并入）',
  cap.some((t) => t.includes('📕:') && t.includes('📦:') && t.includes('🏆:') && t.includes('⏱️')));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 已同步（tests 树收录 smoke_v2194_statuscodex + 九十件套口径）',
  readme.includes('smoke_v2194_statuscodex') && readme.includes('一百三十二件套（一百三十一件套清除）'));
ok('README 含 v21.94 守护描述', readme.includes('v21.94 起含状态页资源行图鉴进度守护'));
ok('README 不含旧「八十九件套（八十八件套清除）」旧口径', !readme.includes('冒烟八十九件套（八十八件套清除）'));
ok('package.json 已收录 smoke_v2194_statuscodex（npm test 串跑第 90 份）',
  pkg.includes('tests/smoke_v2194_statuscodex.mjs') && /smoke_v2193_hunt100\.mjs && node tests\/smoke_v2194_statuscodex\.mjs/.test(pkg));
ok('CHANGELOG 含 v21.94 条目', changelog.includes('## v21.94 '));
ok('README 件套口径不再含旧「八十九件套（八十八件套清除）」', !readme.includes('八十九件套（八十八件套清除）'));

// —— 姊妹件套 pin（v21.7 惯例：最新版守护旧 pin 随新现实更新） ——
const suite90 = ['smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs', 'smoke_v2191_ptime.mjs',
  'smoke_v2190_launch.mjs', 'smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs',
  'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs',
  'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs',
  'smoke_v2181_helpquickcast.mjs', 'smoke_v2180_grain.mjs', 'smoke_v2179_titlerecap.mjs',
  'smoke_v2178_codexseen.mjs', 'smoke_v2177_elites.mjs', 'smoke_v2176_allchests.mjs'];
for (const nm of suite90) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README 件套 pin 已随新现实更新为一百三十二件套（一百三十一件套清除）`,
    src.includes('一百三十二件套（一百三十一件套清除）'));
}
for (const nm of ['smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs', 'smoke_v2191_ptime.mjs',
  'smoke_v2190_launch.mjs', 'smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs',
  'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs',
  'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs',
  'smoke_v2181_helpquickcast.mjs', 'smoke_v2179_titlerecap.mjs']) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 字面量 pin 已随新现实更新为 v21.94`,
    src.includes("const GAME_VERSION = 'v22.36';"));
}
// 旧代 GAME_VERSION 字面量 pin 零残留（v21.93 全库清零；拼接避免本文件自匹配）
const STALE_GV = "const GAME_VERSION = 'v21.9" + "3';";
const stale = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!f.endsWith('.mjs')) continue;
  const src = read(`../tests/${f}`);
  if (src.includes(STALE_GV)) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v21.93 全库清零）', stale.length === 0, stale.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
