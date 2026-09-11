// v21.89 专项冒烟：旧档 visited 兜底 + 快速旅行两端防御式读取（存档兼容·韧性，承 v19.41 seen /
// v21.88 wander (g.visited||[]) 同一「旧档零迁移、防御式读取」家族）：v21.88 成就端已防御，但
// 快速旅行两端（menus.drawTravel 渲染 / core.doTravel 判定）仍直接 hero.visited.includes——旧档
// （含单文件时代读档）缺 visited 字段时按 T 开旅行页即抛 TypeError、碾压既有旅行防误触/拦截语义。
// 现：quests.migrateQuests 读档兜底补 ['village']（与 seen/fragments/skills 兜底同族——任何存档
// 必然到访过起始村、与 newGame 起始值逐字一致，零迁移判定改动、不误解锁「走遍四方」——其余三图仍
// 须真实到访）+ 两端防御式读取 (hero.visited||[])/(S.G.visited||[])（沿 v21.88 成就端同式）。
// 本冒烟守护：版本锚点、源级落位（migrateQuests 兜底 / drawTravel 防御 / doTravel 防御 /
// world.transition 既有守卫逐字未动）、运行期四档（旧档 load 真实读档兜底落位 / 未走 load 的
// 缺字段防御档 drawTravel+doTravel 不抛错 / 既有 visited 存档逐字保留零覆盖 / newGame 起始值零回归）、
// 成就互证（兜底 ['village'] 不误解锁 wander）、README/package.json 同步、姊妹件套 pin
// （v2188..v2176 八十五件套 / v2188..v2179 GAME_VERSION v21.89）随新现实更新。
import { GAME_VERSION, ACH_LIST } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.89 旧档 visited 兜底与旅行端防御冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.88 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.88', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 89)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const questsSrc = read('../js/quests.js');
const menuSrc = read('../js/view/menus.js');
const coreSrc = read('../js/core.js');
const worldSrc = read('../js/world.js');

ok('data.js 含 v21.89 版本注释', dataSrc.includes('v21.89 旧档 visited 兜底与旅行端防御式读取'));
ok('data.js GAME_VERSION 字面量已更新为 v21.89', dataSrc.includes("const GAME_VERSION = 'v22.15';"));

// —— 源级落位 ——
ok('quests.js migrateQuests 含 visited 兜底（读档补 [\'village\']，newGame 起始值同式）',
  questsSrc.includes("if (!Array.isArray(hero.visited)) hero.visited = ['village'];"));
ok('menus.js drawTravel 防御式读取（(hero.visited||[]).includes(k)）',
  menuSrc.includes('unlocked=(hero.visited||[]).includes(k);') && !menuSrc.includes('unlocked=hero.visited.includes'));
ok('core.js doTravel 防御式读取（(S.G.visited||[]).includes(key)）',
  coreSrc.includes('if (!(S.G.visited||[]).includes(key)) {') && !coreSrc.includes('if (!S.G.visited.includes(key))'));
ok('world.js transition 既有 visited 守卫逐字未动（v21.26 起同一行）',
  worldSrc.includes('if (S.G.visited && !S.G.visited.includes(name)) S.G.visited.push(name);'));
ok('quests.js 兜底注释落位（设计意图/零迁移/不误解锁）',
  questsSrc.includes('v21.89 旧档 visited 兜底') && questsSrc.includes('不误解锁「走遍四方」'));

// —— 运行期实证：DOM/音频/存储桩 + main.js 真实导入 ——
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
const { load } = await import('../js/core.js');
const { doTravel } = await import('../js/core.js');
const { migrateQuests } = await import('../js/quests.js');
const { drawTravel } = await import('../js/view/menus.js');

// —— 档案：newGame 起始值零回归 ——
const hero0 = newGame('余烬');
ok('运行期：newGame 起始 visited 恰为 [\'village\']（零回归）',
  Array.isArray(hero0.visited) && hero0.visited.length === 1 && hero0.visited[0] === 'village', hero0.visited && hero0.visited.join());

// —— 旧档真实读档路径：load → migrateQuests 兜底落位 ——
mem['jrpg_save1'] = JSON.stringify({
  G: { name: '旧档', level: 3, xp: 10, xpNext: 40, hp: 50, hpMax: 50, mp: 20, mpMax: 20,
    weapon: '铁剑', armor: '皮甲', gold: 100, item: 3, potion2: 0, map: 'village', x: 5, y: 5,
    skills: ['火焰斩'], quests: {}, seen: {}, fragments: [], bestiary: {}, time: 0,
    // 注意：故意不写 visited —— 模拟单文件时代旧档
  },
  chests: [], savedAt: Date.now(),
});
S.curSaveSlot = 1;
const loaded = load();
ok('运行期：旧档 load() 成功（既有读档链路零回归）', loaded === true);
ok('运行期：load 后 migrateQuests 兜底 visited===[\'village\']（旧档不再缺字段）',
  Array.isArray(S.G.visited) && S.G.visited.join() === 'village', S.G.visited && S.G.visited.join());
ok('运行期：兜底不误解锁「走遍四方」（其余三图仍须真实到访）',
  !ACH_LIST.find((a) => a.id === 'wander').ok(S.G));

// —— 旧档（load 后）按 T 开旅行页：不抛错 + 未探索如实显示 ——
S.scene = 'world';
let threw = null;
CAPTURED.length = 0;
try { drawTravel(); } catch (e) { threw = e; }
ok('运行期：旧档 drawTravel 不抛错（此前 hero.visited.includes 会 TypeError）', threw === null, threw && String(threw.stack || threw));
ok('运行期：旧档旅行页「？？？ · 未探索」如实渲染（村外三图均未到访）',
  CAPTURED.filter((t) => t.includes('未探索')).length >= 3, String(CAPTURED.filter((t) => t.includes('未探索')).length));

// —— doTravel 判定端：旧档不抛错 + 拦截口径零回归 ——
S.scene = 'world';
S.travelSel = 1; // 雾语林（未探索）
threw = null;
try { doTravel(); } catch (e) { threw = e; }
ok('运行期：旧档 doTravel 不抛错（未探索拦截返回）', threw === null, threw && String(threw.stack || threw));
ok('运行期：旧档 doTravel 未探索拦截不跳转（场景仍 world，拦截语义零回归）', S.scene === 'world', S.scene);

// —— 未走 load 的防御档（如 retryBoss/内存路径）缺字段也不抛错 ——
const heroRaw = newGame('测试');
delete heroRaw.visited;
S.G = heroRaw;
S.scene = 'world';
threw = null;
CAPTURED.length = 0;
try { drawTravel(); } catch (e) { threw = e; }
ok('运行期：非 load 路径缺 visited 档 drawTravel 不抛错（(hero.visited||[]) 防御）', threw === null, threw && String(threw.stack || threw));
ok('运行期：非 load 路径缺 visited 档 doTravel 不抛错（(S.G.visited||[]) 防御）',
  (() => { S.travelSel = 1; try { doTravel(); } catch (e) { threw = e; } return threw === null; })());

// —— 既有 visited 存档逐字不动（兜底不覆盖）——
const keep = migrateQuests({ name: '老档', level: 2, quests: {}, visited: ['village', 'dungeon'] });
ok('运行期：既有 visited 存档经 migrateQuests 逐字保留零覆盖（兜底仅补缺失）',
  Array.isArray(keep.visited) && keep.visited.join() === 'village,dungeon', keep.visited && keep.visited.join());

// —— README / package.json / 既有冒烟 pin 随新现实更新 同步守护 ——
const readme = read('../README.md');
const pkg = read('../package.json');
ok('README tests 树收录 smoke_v2189_visitedlegacy', readme.includes('smoke_v2189_visitedlegacy'));
ok('README 件套口径为一百一十一件套（一百一十件套清除）',
  readme.includes('冒烟一百一十一件套（一百一十件套清除）') && !readme.includes('冒烟八十四件套（八十三件套清除）'));
ok('README 含 v21.89 守护描述', readme.includes('v21.89 起含旧档 visited 兜底与旅行端防御式读取守护'));
ok('package.json 已收录 smoke_v2189_visitedlegacy（npm test 串跑第 85 份）',
  pkg.includes('smoke_v2189_visitedlegacy.mjs') && /smoke_v2188_wander\.mjs && node tests\/smoke_v2189_visitedlegacy\.mjs/.test(pkg));

// —— 姊妹件套 pin 复查（v21.7 惯例：本版冒烟守护姊妹随新现实更新）——
const suite85 = ['smoke_v2188_wander.mjs', 'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs',
  'smoke_v2185_steleclear.mjs', 'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs',
  'smoke_v2182_winrecap.mjs', 'smoke_v2181_helpquickcast.mjs', 'smoke_v2180_grain.mjs',
  'smoke_v2179_titlerecap.mjs', 'smoke_v2178_codexseen.mjs', 'smoke_v2177_elites.mjs',
  'smoke_v2176_allchests.mjs'];
for (const nm of suite85) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README 件套 pin 已随新现实更新为一百一十一件套（一百一十件套清除）`,
    src.includes('一百一十一件套（一百一十件套清除）'));
}
for (const nm of ['smoke_v2188_wander.mjs', 'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs', 'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs', 'smoke_v2181_helpquickcast.mjs', 'smoke_v2179_titlerecap.mjs']) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 字面量 pin 已随新现实更新为 v21.89`,
    src.includes("const GAME_VERSION = 'v22.15';"));
}

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
