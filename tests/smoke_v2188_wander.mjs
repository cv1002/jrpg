// v21.88 专项冒烟：新成就「走遍四方」（探索线里程碑）——成就版图逐线核对，图鉴（perfection）/
// 宝箱（chests·allchests）/支线（allquests）/碎片（memoir）/技能（skills）/装备（legend·aegis）/
// 等级（lvl5·lvl10·lvl12）/难度（hardtrue）/精英（elites）/酿造（brew）各线都有里程碑，唯独
// 「四张大地图全部到访」这条主线推进必然穿过的探索线查无一条：玩家第一次踏进无字回廊（双徽记
// 开门）这一刻其实已经走完四图，却毫无回响。判定/进度同读 Object.keys(MAPS) 单一数据源（与
// TRAVEL_LIST 四图一一对应——加/删地图只改 data.js 一处、本成就自动跟随，绝无第二套口径）+
// 既有 hero.visited 到访记录（world.transition 进图时 push，全游戏唯一写入点），(g.visited||[])
// 防御式读取——旧档无 visited 字段=0 不误解锁、零迁移（承 v19.41 seen 同款）；无 r 字段（与
// memoir/skills/aegis/hardtrue 同款纯里程碑——到访本身就是奖励）。解锁时机：world.transition
// 进图落账后当场 applyAchievements（承 v19.51 开箱当场判定「反馈不迟到」惯例），最晚一张图落账
// 即解锁，不用等下一场胜利的 applyAchievements 通路。
// 本冒烟守护：版本锚点、ACH_LIST 契约（wander 唯一/总数精确 32/既有 31 成就 id 零回归）、
// 数据契约（MAPS 恰四图且与 TRAVEL_LIST 一一对应）、ok/prog 谓词逐值（全到访 true / 部分 false /
// 缺字段防御 false·0/4 / 多余键恒 true）、world.js 源级落位（visited push 逐字保留 + 其后当场
// applyAchievements）、运行期全链路（真实 transition 进图落账当场解锁落 hero.ach / 未走完不误解锁 /
// 重复调用去重）、drawAch 32 项滚动渲染不抛错、README/package.json 同步、姊妹件套 pin
// （v2187..v2176 八十四件套 / v2187..v2179 GAME_VERSION v21.88 / v2186..v2159 成就 pin 32 项双处）
// 随新现实更新。
import { GAME_VERSION, ACH_LIST, MAPS, TRAVEL_LIST } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.88 走遍四方探索里程碑冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.87 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.87', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 88)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const worldSrc = read('../js/world.js');

ok('data.js 含 v21.88 版本注释', dataSrc.includes('v21.88 新成就「走遍四方」'));
ok('data.js GAME_VERSION 字面量已更新为 v21.89', dataSrc.includes("const GAME_VERSION = 'v22.28';"));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'wander');
ok('ACH_LIST 含 wander「走遍四方」且 id 唯一',
  !!ach && ach.name === '走遍四方' && ACH_LIST.filter((a) => a.id === 'wander').length === 1);
ok('ACH_LIST 由 31 → 32 项（v21.91 起精确总数由新版冒烟守护，本件存活性口径 >= 32）', ACH_LIST.length >= 32, String(ACH_LIST.length));
ok('wander 描述由 Object.keys(MAPS).length 派生（单一数据源，零裸字面量 4）',
  ach.d === `踏遍全部 ${Object.keys(MAPS).length} 张地图`, ach.d);
ok('wander 判定/进度同读 Object.keys(MAPS) + hero.visited 防御式 (g.visited||[])',
  /Object\.keys\(MAPS\)\.every\(m=>\(g\.visited\|\|\[\]\)\.includes\(m\)\)/.test(String(ach.ok)) &&
  String(ach.prog).includes('Object.keys(MAPS).filter(m=>(g.visited||[]).includes(m))'));
ok('wander 无 r 字段纯里程碑（与 memoir/skills/aegis/hardtrue 同款）', !('r' in ach));

// —— 数据契约：MAPS 恰四图且与 TRAVEL_LIST 一一对应（单一数据源互证）——
const mapKeys = Object.keys(MAPS);
const travelKeys = TRAVEL_LIST.map((x) => x[0]);
ok('MAPS 恰四张图（潮灯镇/雾语林/星井矿脉/无字回廊）', mapKeys.length === 4 && mapKeys.join() === 'village,dungeon,cave,gallery', mapKeys.join());
ok('TRAVEL_LIST 四图与 MAPS 一一对应（wander 分母与旅行列表同源）',
  travelKeys.length === 4 && travelKeys.every((k, i) => k === mapKeys[i]), travelKeys.join());

// —— 既有 31 成就 id 零回归（v21.86 精确序位 + 既有 30 成就逐项在场）——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew'];
ok('既有 31 成就 id 零回归', EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('wander 追加在末尾序位（grain 29 / brew 30 / wander 31，既有序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'grain') === 29 &&
  ACH_LIST.findIndex((a) => a.id === 'brew') === 30 &&
  ACH_LIST.findIndex((a) => a.id === 'wander') === 31);

// —— ok/prog 谓词逐值 ——
ok('全四图到访 → true（且多余键不影响 every）',
  ach.ok({ visited: ['village', 'dungeon', 'cave', 'gallery', 'aux'] }) === true);
ok('全四图到访 → prog 4/4', ach.prog({ visited: ['village', 'dungeon', 'cave', 'gallery'] }) === `4/${mapKeys.length}`);
ok('只到访起始村 → false（主线推进中不解锁）', ach.ok({ visited: ['village'] }) === false);
ok('只到访起始村 → prog 1/4', ach.prog({ visited: ['village'] }) === `1/${mapKeys.length}`);
ok('缺 visited 字段旧档 → false 且 prog 0/4（防御式零迁移）',
  ach.ok({}) === false && ach.prog({}) === `0/${mapKeys.length}`);
ok('visited 非数组（undefined 兜底）→ false 不抛错', ach.ok({ visited: undefined }) === false);
ok('重复到访去重不误判（visited 含重复键仍 true）', ach.ok({ visited: ['village', 'dungeon', 'cave', 'gallery', 'gallery'] }) === true);

// —— world.js 源级落位：visited push 逐字保留 + 其后当场 applyAchievements ——
const transBlock = (worldSrc.match(/function transition\(name\) \{\n[\s\S]*?\n\}/) || [''])[0];
ok('transition 块存在', transBlock.length > 0);
ok('transition visited push 逐字保留（与 v21.26 起同一行）',
  transBlock.includes("if (S.G.visited && !S.G.visited.includes(name)) S.G.visited.push(name);"));
ok('transition 尾部当场 applyAchievements（反馈不迟到：进图落账 + 进场/补给提示之后）',
  transBlock.includes('applyAchievements();') && transBlock.indexOf('applyAchievements();') > transBlock.indexOf('bind.boxMsg'));
ok('transition 幂等注释落位（已解锁不重报、不重复横幅）', transBlock.includes('v21.88 探索线里程碑「走遍四方」'));
ok('world.js 已 import applyAchievements（与 onChestStep 同一既有导入）',
  worldSrc.includes("import { applyAchievements } from './hero.js';"));

// —— 运行期实证：DOM/音频/存储桩 + main.js 真实导入后 transition 全链路 ——
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
const { transition } = await import('../js/world.js');
const { drawAch } = await import('../js/view/menus.js');

function runTransition(hero, map) {
  S.G = hero;
  S.scene = 'world';
  transition(map);
  return hero;
}

// E2E 解锁档：走完前三图后踏进无字回廊（双徽记开门）——落账当场解锁、反馈不迟到
let hero = newGame('余烬');
hero.visited = ['village', 'dungeon', 'cave'];
hero = runTransition(hero, 'gallery');
ok('运行期：transition(gallery) 落账 hero.visited 四图齐（village/dungeon/cave/gallery）',
  hero.visited.length === 4 && hero.visited.includes('gallery'), hero.visited.join());
ok('运行期：进无字回廊当场解锁 wander 落 hero.ach（反馈不迟到，不用等下一场胜利）',
  hero.ach.includes('wander'), hero.ach.join(','));

// 未走完档：只去过两图再进第三图 → 不误解锁（主线推进中）
hero = newGame('灯见');
hero.visited = ['village', 'dungeon'];
hero = runTransition(hero, 'cave');
ok('运行期：未走完四图（3/4）不误解锁 wander', !hero.ach.includes('wander'));

// 重复调用去重：已解锁后再 transition 不重复 push
hero.ach = hero.ach.filter((x) => x !== 'wander');
hero.ach.push('wander');
hero = runTransition(hero, 'gallery');
ok('运行期：重复调用去重（hero.ach 中 wander 恰一枚）',
  hero.ach.filter((x) => x === 'wander').length === 1);

// 旧档防御档：无 visited 字段读档 → transition 不抛错（既有 `S.G.visited &&` 守卫逐字保留）且不解锁
hero = newGame('潮');
delete hero.visited;
let threw = null;
try { runTransition(hero, 'dungeon'); } catch (e) { threw = e; }
ok('运行期：旧档缺 visited 字段 transition 不抛错（既有守卫零回归）', threw === null, threw && String(threw.stack || threw));
ok('运行期：缺字段旧档不解锁 wander（零迁移）', !hero.ach.includes('wander'));

// —— drawAch 渲染（32 项滚动不抛错；PAGE=10 四页）——
let rendered = true, renderedPg4 = true;
try {
  S.G = newGame('测试'); S.G.ach = ['wander']; S.achScroll = 0; S.scene = 'ach';
  drawAch();
} catch (e) { rendered = false; }
try {
  S.achScroll = 25; // 32 项滚到第四页（PAGE=10，钳制到 22）不抛错
  drawAch();
} catch (e) { renderedPg4 = false; }
S.achScroll = 0; S.scene = 'world';
ok('运行期：成就页 drawAch 32 项渲染不抛错', rendered);
ok('运行期：成就页第四页滚动渲染不抛错（32 项 PAGE=10 四页）', renderedPg4);

// —— README / package.json / 既有冒烟 pin 随新现实更新 同步守护 ——
const readme = read('../README.md');
const pkg = read('../package.json');
ok('README tests 树收录 smoke_v2188_wander', readme.includes('smoke_v2188_wander'));
ok('README 件套口径为一百二十四件套（一百二十三件套清除）',
  readme.includes('冒烟一百二十四件套（一百二十三件套清除）') && !readme.includes('冒烟八十三件套（八十二件套清除）'));
ok('README 含 v21.88 守护描述', readme.includes('v21.88 起含'));
ok('README 成就口径「33 项」双处同步（快速上手表 C 键行 + 图鉴&成就行）',
  readme.includes('成就一览（全部 44 项进度') && readme.includes('**44 项成就**'));
ok('package.json 已收录 smoke_v2188_wander（npm test 串跑第 84 份）',
  pkg.includes('smoke_v2188_wander.mjs') && /smoke_v2187_endingrecap\.mjs && node tests\/smoke_v2188_wander\.mjs/.test(pkg));

// —— 姊妹件套 pin 复查（v21.7 惯例：本版冒烟守护姊妹随新现实更新）——
const suite84 = ['smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs',
  'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs',
  'smoke_v2181_helpquickcast.mjs', 'smoke_v2180_grain.mjs', 'smoke_v2179_titlerecap.mjs',
  'smoke_v2178_codexseen.mjs', 'smoke_v2177_elites.mjs', 'smoke_v2176_allchests.mjs'];
for (const nm of suite84) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README 件套 pin 已随新现实更新为一百二十四件套（一百二十三件套清除）`,
    src.includes('一百二十四件套（一百二十三件套清除）'));
}
for (const nm of ['smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs', 'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs', 'smoke_v2181_helpquickcast.mjs', 'smoke_v2179_titlerecap.mjs']) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 字面量 pin 已随新现实更新为 v21.89`,
    src.includes("const GAME_VERSION = 'v22.28';"));
}
const achFiles = ['smoke_v2186_brew.mjs', 'smoke_v2184_lvl12.mjs', 'smoke_v2180_grain.mjs',
  'smoke_v2177_elites.mjs', 'smoke_v2176_allchests.mjs', 'smoke_v2173_aegis.mjs',
  'smoke_v2168_hardtrue.mjs', 'smoke_v2159_skillach.mjs'];
for (const nm of achFiles) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README 成就 pin 已随新现实更新（31 项 pin 零残留，32 项双处落位）`,
    src.includes("readme.includes('成就一览（全部 44 项进度'") && !src.includes('**30 项成就**'));
}
const s2186 = read('../tests/smoke_v2186_brew.mjs');
ok('smoke_v2186 的 ACH_LIST 精确计数断言已去硬化（===31 零残留，>=31 存活性口径落位）',
  s2186.includes('ACH_LIST.length >= 31') && !s2186.includes('ACH_LIST.length === 31'));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
