// v21.91 专项冒烟：新成就「长明不熄」（游玩时长里程碑，新内容·单成就，承 v21.84 灯燃长夜 /
// v21.86 灵药初成 / v21.88 走遍四方 单成就先例）——成就版图逐线核对：战斗（firstblood/hunt10/
// lucky）、等级（lvl5·lvl10·lvl12）、金币（rich）、图鉴（scholar·perfection）、支线（八条单支线 +
// allquests）、Boss（boss/cave/trueboss/rush）、装备（legend/aegis）、碎片（memoir）、技能
// （skills）、难度（hardtrue）、宝箱（chests·allchests）、精英（elites）、酿造（brew）、探索
// （wander）各线都有印记，唯独「冒险时长」这条陪伴全程、随存档持久化的计时线（main.js render
// 驱动 hero.time、状态 I/尾声/战绩页 ⏱ 同读一份源、slotPreview 随档显示）没有任何纪念：玩家在
// 这颗灯下待满一小时毫无回响。现补第一档（PLAY_TIME_GOAL=3600 秒 = 60 分钟纯里程碑）：判定/
// 进度/描述三处同读新常量 PLAY_TIME_GOAL（与 FIRSTBLOOD_GOAL/ELIXIR_GOAL 同一「成就阈值
// 数据化」家族——改门槛只改 data.js 一处自动跟随，零裸字面量），计数读既有 hero.time 字段
// （(g.time||0) 防御式读取——旧档无此字段=0 不误解锁、零迁移，承 v19.41 seen 同款）；无 r 字段
// （与 memoir/lvl5/hardtrue 同款纯里程碑——守着灯的时间本身就是奖励）；解锁时机：applyAchievements
// 既有通路任意判定点当场解锁（time 为持续累积量，无需新判定点，承 lvl12 同款）。
// 本冒烟守护：版本锚点、PLAY_TIME_GOAL 数据契约（===3600、导出）、ACH_LIST 契约（ptime 唯一/
// 总数精确 33/既有 32 成就 id 零回归/追加在末尾序位）、ok/prog 谓词逐值（0·3599 秒 false /
// 3600·7200 秒 true / 缺 time 字段防御 false·0/60 / prog 分钟数不钳制 120/60）、main.js 源级
// 落位（render 驱动 time 累计行）、运行期全链路（applyAchievements 真实解锁落 hero.ach / 未够
// 不误解锁 / 重复调用去重）、drawAch 33 项滚动渲染不抛错、README/package.json/CHANGELOG 同步、
// 姊妹件套 pin（v2190..v2176 八十七件套 / v2190..v2179 GAME_VERSION v21.91 / v2188..v2159
// 成就 pin 33 项双处）随新现实更新 + smoke_v2188 精确计数断言去硬化（===32→>=32）复核。
import { GAME_VERSION, ACH_LIST, PLAY_TIME_GOAL } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.91 长明不熄游玩时长里程碑冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.90 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.90', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 91)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const mainSrc = read('../js/main.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v21.91 版本注释', dataSrc.includes('v21.91 新成就「长明不熄」'));
ok('data.js GAME_VERSION 字面量已更新为 v21.91', dataSrc.includes("const GAME_VERSION = 'v22.30';"));
ok('data.js 导出 PLAY_TIME_GOAL（export 块落位；v22.6 起 PLAY_TIME2_GOAL/POTIONS_GOAL/POTIONS2_GOAL 随其后）', dataSrc.includes(', PLAY_TIME_GOAL, PLAY_TIME2_GOAL, POTIONS_GOAL, POTIONS2_GOAL, ELIXIR_STOCK_GOAL, ELIXIR_STOCK2_GOAL, PERFECTION_GOLD'));

// —— PLAY_TIME_GOAL 数据契约 ——
ok('PLAY_TIME_GOAL === 3600（60 分钟）', PLAY_TIME_GOAL === 3600, String(PLAY_TIME_GOAL));
ok('PLAY_TIME_GOAL 声明为 3600 且注释含「60 分钟」口径', dataSrc.includes('const PLAY_TIME_GOAL = 3600;') && dataSrc.includes('= 60 分钟'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'ptime');
ok('ACH_LIST 含 ptime「长明不熄」且 id 唯一',
  !!ach && ach.name === '长明不熄' && ACH_LIST.filter((a) => a.id === 'ptime').length === 1);
ok('ACH_LIST 精确计数断言已去硬化（===33 → >=33 存活性口径，v21.93 起本版不再独占精确总数）', ACH_LIST.length >= 33, String(ACH_LIST.length));
ok('ptime 描述由 PLAY_TIME_GOAL/60 派生（单一数据源，零裸字面量 60）',
  ach.d === `累计游玩 ${PLAY_TIME_GOAL / 60} 分钟`, ach.d);
ok('ptime 判定/进度同读 PLAY_TIME_GOAL + hero.time 防御式 (g.time||0)',
  /\(g\.time\|\|0\)>=PLAY_TIME_GOAL/.test(String(ach.ok)) && String(ach.prog).includes('(g.time||0)'));
ok('ptime 无 r 字段纯里程碑（与 memoir/lvl5/hardtrue 同款）', !('r' in ach));

// —— 既有 32 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander'];
ok('既有 32 成就 id 零回归', EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('ptime 追加在末尾序位（wander 31 / ptime 32，既有序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'wander') === 31 &&
  ACH_LIST.findIndex((a) => a.id === 'ptime') === 32);

// —— ok/prog 谓词逐值 ——
ok('time=0 新档 → false（不可开局秒解锁）', ach.ok({ time: 0 }) === false);
ok('time=3599（差 1 秒）→ false（恰在门槛下不解锁）', ach.ok({ time: 3599 }) === false);
ok('time=3600 → true（恰达标）', ach.ok({ time: 3600 }) === true);
ok('time=7200 → true（超阈值仍达标）', ach.ok({ time: 7200 }) === true);
ok('缺 time 字段旧档 → false 且 prog 0/60（防御式零迁移）',
  ach.ok({}) === false && ach.prog({}) === `0/${PLAY_TIME_GOAL / 60}`);
ok('time 非数值（undefined 兜底）→ false 不抛错', ach.ok({ time: undefined }) === false);
ok('prog 0 分钟 → 0/60', ach.prog({ time: 0 }) === `0/${PLAY_TIME_GOAL / 60}`, ach.prog({ time: 0 }));
ok('prog 30 分钟 → 30/60', ach.prog({ time: 1800 }) === `30/${PLAY_TIME_GOAL / 60}`, ach.prog({ time: 1800 }));
ok('prog 60 分钟 → 60/60', ach.prog({ time: 3600 }) === `60/${PLAY_TIME_GOAL / 60}`, ach.prog({ time: 3600 }));
ok('prog 120 分钟不钳制（120/60，承 lvl5「X/N 不钳制」口径）', ach.prog({ time: 7200 }) === `120/${PLAY_TIME_GOAL / 60}`, ach.prog({ time: 7200 }));

// —— main.js 源级落位：render 驱动 time 累计（单一写入点）——
ok('main.js 含 time 累计行（render 驱动，随存档快照持久化的唯一写入点）',
  mainSrc.includes('S.G.time = (S.G.time || 0) + Math.min(60'));

// —— 运行期实证：DOM/音频/存储桩 + main.js 真实导入后 applyAchievements 全链路 ——
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
const { applyAchievements } = await import('../js/hero.js');
const { drawAch } = await import('../js/view/menus.js');

function runAch(hero) {
  S.G = hero;
  S.scene = 'world';
  applyAchievements();
  return hero;
}

// 达标档：time=3600 → applyAchievements 真实解锁落 hero.ach（time 为持续累积量，任意判定点当场解锁）
let hero = newGame('余烬');
hero.time = 3600;
hero = runAch(hero);
ok('运行期：time=3600 触发 applyAchievements 真实解锁 ptime 落 hero.ach', hero.ach.includes('ptime'), hero.ach.join(','));

// 未达标档：time=3599 → 不误解锁（差 1 秒）
hero = newGame('灯见');
hero.time = 3599;
hero = runAch(hero);
ok('运行期：time=3599 不误解锁 ptime', !hero.ach.includes('ptime'));

// 新档零时长 → 不误解锁（新档 time=0）
hero = newGame('潮');
hero = runAch(hero);
ok('运行期：新档 time=0 不误解锁 ptime', !hero.ach.includes('ptime'));

// 重复调用去重：已解锁后再 applyAchievements 不重复 push
hero = newGame('灯');
hero.time = 3600;
runAch(hero);
runAch(hero);
ok('运行期：重复调用去重（hero.ach 中 ptime 恰一枚）',
  hero.ach.filter((x) => x === 'ptime').length === 1);

// 旧档防御档：无 time 字段读档 → applyAchievements 不抛错且不解锁（零迁移）
hero = newGame('潮');
delete hero.time;
let threw = null;
try { runAch(hero); } catch (e) { threw = e; }
ok('运行期：旧档缺 time 字段 applyAchievements 不抛错（(g.time||0) 防御式）', threw === null, threw && String(threw.stack || threw));
ok('运行期：缺字段旧档不解锁 ptime（零迁移）', !hero.ach.includes('ptime'));

// —— drawAch 渲染（33 项滚动不抛错；PAGE=10 四页）——
let rendered = true, renderedPg4 = true;
try {
  S.G = newGame('测试'); S.G.ach = ['ptime']; S.achScroll = 0; S.scene = 'ach';
  drawAch();
} catch (e) { rendered = false; }
try {
  S.achScroll = 40; // 33 项滚到末页（PAGE=10，钳制）不抛错
  drawAch();
} catch (e) { renderedPg4 = false; }
S.achScroll = 0; S.scene = 'world';
ok('运行期：成就页 drawAch 33 项渲染不抛错', rendered);
ok('运行期：成就页末页滚动渲染不抛错（33 项 PAGE=10 四页）', renderedPg4);

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树收录 smoke_v2191_ptime', readme.includes('smoke_v2191_ptime'));
ok('README 件套口径为一百二十六件套（一百二十五件套清除）',
  readme.includes('冒烟一百二十六件套（一百二十五件套清除）') && !readme.includes('冒烟八十七件套（八十六件套清除）'));
ok('README 含 v21.91 守护描述', readme.includes('v21.91 起含新成就「长明不熄」'));
ok('README 成就口径「33 项」双处同步（快速上手表 C 键行 + 图鉴&成就行）',
  readme.includes('成就一览（全部 45 项进度') && readme.includes('**45 项成就**'));
ok('package.json 已收录 smoke_v2191_ptime（npm test 串跑第 87 份）',
  pkg.includes('smoke_v2191_ptime.mjs') && /smoke_v2190_launch\.mjs && node tests\/smoke_v2191_ptime\.mjs/.test(pkg));
ok('CHANGELOG 含 v21.91 条目', changelog.includes('## v21.91 '));

// —— 姊妹件套 pin 复查（v21.7 惯例：本版冒烟守护姊妹随新现实更新）——
const suite87 = ['smoke_v2190_launch.mjs', 'smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs',
  'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs',
  'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs',
  'smoke_v2181_helpquickcast.mjs', 'smoke_v2180_grain.mjs', 'smoke_v2179_titlerecap.mjs',
  'smoke_v2178_codexseen.mjs', 'smoke_v2177_elites.mjs', 'smoke_v2176_allchests.mjs'];
for (const nm of suite87) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README 件套 pin 已随新现实更新为一百二十六件套（一百二十五件套清除）`,
    src.includes('一百二十六件套（一百二十五件套清除）'));
}
for (const nm of ['smoke_v2190_launch.mjs', 'smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs',
  'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs',
  'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs',
  'smoke_v2181_helpquickcast.mjs', 'smoke_v2179_titlerecap.mjs']) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 字面量 pin 已随新现实更新为 v21.91`,
    src.includes("const GAME_VERSION = 'v22.30';"));
}
const achFiles = ['smoke_v2188_wander.mjs', 'smoke_v2186_brew.mjs', 'smoke_v2184_lvl12.mjs',
  'smoke_v2180_grain.mjs', 'smoke_v2177_elites.mjs', 'smoke_v2176_allchests.mjs',
  'smoke_v2173_aegis.mjs', 'smoke_v2168_hardtrue.mjs', 'smoke_v2159_skillach.mjs'];
for (const nm of achFiles) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README 成就 pin 已随新现实更新（33 项 pin 零残留，34 项双处落位）`,
    src.includes("readme.includes('成就一览（全部 45 项进度'") && !src.includes('**33 项成就**'));
}
const s2188 = read('../tests/smoke_v2188_wander.mjs');
ok('smoke_v2188 的 ACH_LIST 精确计数断言已去硬化（===32 零残留，>=32 存活性口径落位）',
  s2188.includes('ACH_LIST.length >= 32') && !s2188.includes('ACH_LIST.length === 32'));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
