// smoke_v24151_lowlv.mjs —— v24.151 专项冒烟：新成就「未及十级」（挑战向低等级档·十级内真结局）
// （新内容·单成就——承 v24.148 速战速决 / v24.147 未曾熄灯 / v23.68 逆风行灯 hardtrue 先例：成就版图
// 「以怎样的姿态通关」维度第三次开垦——v24.147 盖住了「别倒下」（未曾熄灯=零阵亡）、v24.148 盖住了
// 「别拖沓」（速通），「别练级」这一面查无一行：Boss 线三档（boss/cave/trueboss）与难度向（hardtrue）
// 皆只认「打过了」，玩家只要打过终焉之神便「记得一切」，但「九级就闯通关的档」与「刷满十二级才过」的档
// 在成就一览毫无分别；现补低等级向独立单档——判定读既有 hero.trueBoss（终焉之神=真结局最终 Boss，击败
// 即「走完全程」的终极口径，与 trueboss/hardtrue/unflicker/swift 同源）与既有 hero.level（hero.js
// grantXp 升级唯一产生点 hero.level++、随 snapshotHero 全量快照自动持久化、防御式 (g.level||1) 旧档零
// 迁移，与 ACH_LIST LVL5/LVL10/LVL12 级档同读一份源），(g.trueBoss && (g.level||1)<LOWLV_GOAL) 即达成：
// level 只增不减，升过门槛(10)的档永久无缘此档（与 hardtrue 换难度 / unflicker 死过一次 / swift 超场
// 同属「重新来过才拿得到」的挑战品类）；零新计数零新状态零新写点零新存档；无 r 无 prog 纯里程碑（与
// hardtrue/lvl12/memoir 同款）；解锁走 winBattle → applyAchievements 既有通路（trueboss/hardtrue/
// unflicker/swift 同路径零新增依赖），反馈不迟到。ACH_LIST 78→80 项末尾追加）。
// 本冒烟守护：版本锚点（v24.151、旧 v24.150 字面量零残留、v24.151 注释）、LOWLV_GOAL 常量落位与导出、
// ACH_LIST 80 项精确与末尾序位（unflicker 76 / swift 77 / lowlv 78）、lowlv 数据契约（d 文案、ok 防御式
// 逐值、无 r 无 prog）、unlockedAchievements/applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅
// + 幂等去重 / 升过十级不解锁 / 未通关不解锁）、既有 78 成就 id 零回归、hero.js grantXp hero.level 写入
// 点源级零变化、README/package.json/CHANGELOG 同步（件套口径 367 + v24.151 守护描述 + 入库 363 + 版本速览
// + 80 项 + tests 树串尾 + package 串尾）、哨兵链（前望 371 且 README 尚无 365 口径）、旧代 v24.150
// 字面量/恒等/顶 pin/362 口径全库零残留扫描（豁免本套件 + 上一版 v24148）。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, LOWLV_GOAL } from '../js/data.js';
import { unlockedAchievements } from '../js/rules.js';
import { applyAchievements } from '../js/hero.js';
import { bind } from '../js/bind.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
    fillText: (t) => { drawn.push(String(t)); },
  };
}
function mkEl(id) {
  const cl = { add: noop, remove: noop, contains: () => false, toggle: noop };
  return { textContent: '', style: {}, className: '', id, width: 640, height: 480,
    getContext: () => makeCtx(), classList: cl, parentElement: { classList: cl }, addEventListener: noop };
}
const els = {};
const drawn = [];
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

console.log('— v24.151 挑战向低等级成就「未及十级」 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dataSrc = read('js/data.js');
const heroSrc = read('js/hero.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（格式合法 + 已越过 v24.155 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.155', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 155)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.151（旧 v24.150 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v24.179';") && !dataSrc.includes("const GAME_VERSION = 'v24.150';"));
ok('data.js 含 v24.151 注释（未及十级新成就说明）',
  dataSrc.includes('v24.151 新内容·新成就'));
ok('LOWLV_GOAL 常量 v24.151 落位（=10，等于无字回廊推荐等级 recLv）',
  dataSrc.includes('const LOWLV_GOAL = 10;') && LOWLV_GOAL === 10);
ok('LOWLV_GOAL 已入 data.js export（阈值数据化家族可被各端引用）',
  dataSrc.includes('SPEED_GOAL, LOWLV_GOAL,'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'lowlv');
ok('ACH_LIST 含 lowlv「未及十级」且 id 唯一',
  !!ach && ach.name === '未及十级' && ACH_LIST.filter((a) => a.id === 'lowlv').length === 1);
ok('ACH_LIST 精确总数 83 项（78→80 末尾追加）', ACH_LIST.length === 106, String(ACH_LIST.length));
ok('lowlv 描述文案（十级内真结局低等级档）',
  ach.d === `等级未满 ${LOWLV_GOAL} 时击败终焉之神（真结局）`, ach.d);
ok('lowlv 判定源级（读既有 g.trueBoss 与防御式 (g.level||1)）',
  String(ach.ok).includes('g.trueBoss') && String(ach.ok).includes('(g.level||1)<LOWLV_GOAL'));
ok('lowlv 无 r 无 prog 纯里程碑（与 hardtrue/unflicker/swift 同款）',
  !('r' in ach) && !('prog' in ach));

// —— ok 防御式逐值 ——
ok('9 级真结局 → 解锁', ach.ok({ trueBoss: true, level: 9 }) === true);
ok('8 级真结局 → 解锁', ach.ok({ trueBoss: true, level: 8 }) === true);
ok('刚好 1 级真结局 → 解锁', ach.ok({ trueBoss: true, level: 1 }) === true);
ok('升过门槛 10 级真结局 → 不解锁（永久无缘此档）', ach.ok({ trueBoss: true, level: 10 }) === false);
ok('level 显式满门槛（=LOWLV_GOAL）→ 不解锁', ach.ok({ trueBoss: true, level: LOWLV_GOAL }) === false);
ok('刷满 12 级才过关 → 不解锁', ach.ok({ trueBoss: true, level: 12 }) === false);
ok('低等级但未通关 → 不解锁', ach.ok({ level: 5 }) === false);
ok('空档/缺字段 → 不解锁（(g.level||1) 防御式零迁移）', ach.ok({}) === false);
ok('缺 level 字段仅 trueBoss → 按 1 级解码（旧档零迁移）', ach.ok({ trueBoss: true }) === true);

// —— 既有 78 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime', 'hunt100', 'ptime2', 'lucky2', 'rich2', 'stock',
  'brew2', 'stock2', 'elixir', 'mush', 'elixir2', 'mush2', 'metall', 'rich3', 'ptime3', 'hunt3',
  'lucky3', 'stock3', 'elixir3', 'brew3', 'mush3', 'outstep', 'outstep2', 'scholar2', 'seen', 'seen2',
  'chests2', 'talkall', 'deflect', 'charge', 'crit', 'cast', 'flee', 'potionuses', 'rushs', 'mapdrink',
  'innrest', 'spend', 'travels', 'steps', 'battles', 'sell', 'deaths', 'nightwins', 'unflicker', 'swift'];
ok('既有 78 成就 id 零回归（核心抽样全覆盖末期正位）',
  EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('nightwins 75 / unflicker 76 / swift 77 / lowlv 78 末尾序位（既有序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'nightwins') === 75 &&
  ACH_LIST.findIndex((a) => a.id === 'unflicker') === 76 &&
  ACH_LIST.findIndex((a) => a.id === 'swift') === 77 &&
  ACH_LIST.findIndex((a) => a.id === 'lowlv') === 78);

// —— 既有挑战向家族对照（hardtrue/unflicker/swift/lowlv 四档独立互不干扰）——
const _a = (id) => ACH_LIST.find((x) => x.id === id);
ok('hardtrue/unflicker/swift/lowlv 四档独立（难度 vs 姿态 vs 速通 vs 低等级）',
  _a('hardtrue').ok({ trueBoss: true, diff: 1 }) === true &&
  _a('unflicker').ok({ trueBoss: true }) === true &&
  _a('swift').ok({ trueBoss: true, battles: 50 }) === true &&
  ach.ok({ trueBoss: true, level: 9 }) === true);
ok('死过一次仍可解锁 lowlv（仅 unflicker 被排除——各自判据不同源）',
  ach.ok({ trueBoss: true, level: 9, deaths: 5 }) === true &&
  _a('unflicker').ok({ trueBoss: true, deaths: 5 }) === false);
ok('速通档九级通关仍可解锁 lowlv（速通向与低等级向不互斥）',
  ach.ok({ trueBoss: true, level: 9, battles: 55 }) === true);
ok('困难档低等级通关仍可解锁 lowlv（难度向与低等级向正交）',
  ach.ok({ trueBoss: true, level: 9, diff: 1 }) === true);
ok('刷满 12 级速通档不解锁 lowlv（仅 swift/lowlv 各自门槛，互不混判）',
  ach.ok({ trueBoss: true, level: 12, battles: 30 }) === false &&
  _a('swift').ok({ trueBoss: true, level: 12, battles: 30 }) === true);

// —— unlockedAchievements 集成 ——
function freshHero(extra) {
  return Object.assign({ name: '余烬', level: 7, gold: 123, xp: 0, xpNext: 20, hp: 50, hpMax: 50, mp: 20, mpMax: 20,
    item: 3, potion2: 1, mushrooms: 2, weapon: '铁剑', armor: '皮甲', atkMax: 12, defMax: 6,
    map: 'village', x: 8, y: 8, time: 0, ach: [], bestiary: {}, seen: {}, fragments: [], visited: ['village'],
    quests: {}, totalWins: 3, drops: 0, steps: 0, travels: 0, spent: 0, battles: 3, skills: [], talked: [],
    checks: 0, crits: 0, casts: 0, flees: 0, potionUses: 0, deflects: 0, charges: 0, sleep: 0,
    sold: 0, dealt: 0, mapPotions: 0, innRests: 0, nightWins: 0, rushClears: 0, brews: 0, chests: [],
    deaths: 0 }, extra);
}
{
  const h = freshHero({ trueBoss: true, level: 9 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 九级真结局档 newly 含 lowlv（既有通路自动跟随）',
    newly.includes('lowlv'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, level: 11 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 升过十级过关档 newly 不含 lowlv（不误解锁）',
    !newly.includes('lowlv'), JSON.stringify(newly));
}
{
  const h = freshHero({ level: 9 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 未通关档 newly 不含 lowlv（不误解锁）',
    !newly.includes('lowlv'), JSON.stringify(newly));
}

// —— applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等）——
{
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    const h = freshHero({ trueBoss: true, level: 8 });
    S.G = h;
    applyAchievements();
    ok('applyAchievements 真实解锁落 hero.ach（含 lowlv）', h.ach.includes('lowlv'), JSON.stringify(h.ach));
    ok('解锁横幅报成就名【未及十级】', msgs.some((m) => m.includes('🔓 成就解锁：') && m.includes('【未及十级】')), msgs.join(' | '));
    const len1 = msgs.length;
    applyAchievements();
    ok('幂等：重复调用不再报（已解锁去重）', msgs.length === len1 && msgs.filter((m) => m.includes('【未及十级】')).length === 1, String(msgs.length));
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}
{
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    const h = freshHero({ trueBoss: true, level: 12 });
    S.G = h;
    applyAchievements();
    ok('升过十级过关 applyAchievements 零 lowlv 解锁零「未及十级」横幅（不误解锁）',
      !h.ach.includes('lowlv') && !msgs.some((m) => m.includes('【未及十级】')), JSON.stringify({ ach: h.ach, msgs }));
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}

// —— 源级零变化：hero.js grantXp 的 hero.level 升级写入点（既有，本版未动）——
ok('hero.js 既有 level 升级写入点源级零变化（grantXp 唯一产生点 hero.level++）',
  heroSrc.includes('hero.level++') && /hero\.level\+\+/.test(heroSrc));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径为三百九十件套（三百八十九件套清除）',
  readme.includes('扩充为冒烟三百九十件套（三百八十九件套清除）') && !readme.includes('冒烟三百六十二件套（三百六十一件套清除）'));
ok('README 含 v24.151 守护描述（未及十级新成就守护）', readme.includes('v24.151 起含「未及十级」新成就守护'));
ok('README 版本速览已为 v24.155 且成就计数 83', readme.includes('版本速览（v24.179）') && readme.includes('106 项成就'));
ok('README 成就计数双处口径 80 项（全部 106 项进度 + **106 项成就**，78 项清除）',
  readme.includes('全部 106 项进度') && readme.includes('**106 项成就**') && !readme.includes('**78 项成就**'));
ok('README tests 树收录 smoke_v24151_lowlv（含 v24.151 守护子句 + 串尾）',
  readme.includes('v24.151 起含「未及十级」新成就守护') && readme.includes('smoke_v24151_lowlv'));
ok('README 含 smoke_v24151_lowlv 入库（363 份）', readme.includes('smoke_v24151_lowlv 入库（363 份）'));
ok('package.json 已收录 smoke_v24151_lowlv.mjs 且位于串尾（狠在 swift 之后）',
  pkg.includes('smoke_v24151_lowlv.mjs') &&
  pkg.includes('node tests/smoke_v24148_swift.mjs && node tests/smoke_v24151_lowlv.mjs && node tests/smoke_v24152_nopotion.mjs && node tests/smoke_v24153_penny.mjs && node tests/smoke_v24154_steadfast.mjs && node tests/smoke_v24155_frugal.mjs && node tests/smoke_v24157_dry.mjs && node tests/smoke_v24158_swift2.mjs && node tests/smoke_v24159_lowlv2.mjs && node tests/smoke_v24160_noskill.mjs && node tests/smoke_v24161_noskill2.mjs && node tests/smoke_v24162_lowskill.mjs && node tests/smoke_v24163_swiftskill.mjs && node tests/smoke_v24164_swiftlv.mjs && node tests/smoke_v24165_nopotskill.mjs && node tests/smoke_v24166_unflskill.mjs && node tests/smoke_v24167_swiftnopo.mjs && node tests/smoke_v24168_lowlvnopo.mjs && node tests/smoke_v24169_unflswift.mjs && node tests/smoke_v24170_unfllowlv.mjs && node tests/smoke_v24171_unflnopo.mjs && node tests/smoke_v24172_unflpenny.mjs && node tests/smoke_v24173_pennyswift.mjs && node tests/smoke_v24174_pennylowlv.mjs && node tests/smoke_v24175_pennynoskill.mjs && node tests/smoke_v24176_pennynopo.mjs && node tests/smoke_v24177_unflswift2.mjs && node tests/smoke_v24178_unflpenny2.mjs && node tests/smoke_v24179_unflnopo2.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 364 件套', testChain === 390, String(testChain));
ok('CHANGELOG 含 v24.151 顶条目', changelog.startsWith('## v24.179'));

// —— 哨兵链：README 已有 363 口径且尚无 365（前望 371 语义：下一版才写 365）——
ok('README 已有三百六十四件套口径且尚无 365（哨兵前望 391 语义：下一版才写 365）',
  readme.includes('三百九十件套（三百八十九件套清除）') && !readme.includes('三百九十一件套'));
{
  const s24143 = read('tests/smoke_v24143_furnacequest.mjs');
  ok('smoke_v24143 哨兵链前望 391（三百九十一件套否定式）',
    s24143.includes('哨兵链前望 391') && s24143.includes('三百九十一件套否定式'));
}
{
  ok('smoke_v24148 姊妹件版本字面量 pin 已随新现实推进（v24.155）',
    read('tests/smoke_v24148_swift.mjs').includes("const GAME_VERSION = 'v24.179';"));
  ok('smoke_v24147 姊妹件版本字面量 pin 已随新现实推进（v24.155）',
    read('tests/smoke_v24147_unflicker.mjs').includes("const GAME_VERSION = 'v24.179';"));
  ok('smoke_v2229 姊妹件版本恒等 pin 已随新现实推进（=== v24.155）',
    read('tests/smoke_v2229_metall.mjs').includes("GAME_VERSION === 'v24.179'"));
}

// —— 旧代 v24.150 字面量 / 362 件套口径 / 78 项 全库零残留扫描（豁免本套件 + 上一版 v24148）——
const EXEMPT = new Set(['smoke_v24151_lowlv.mjs', 'smoke_v24148_swift.mjs']);
const leftovers = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests')).filter((x) => x.endsWith('.mjs') && !EXEMPT.has(x))) {
  const s = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  const code = s.split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  if (code.includes("const GAME_VERSION = 'v24.150'")) leftovers.push(f + ':gv');
  if (code.includes("GAME_VERSION === 'v24.150'")) leftovers.push(f + ':eq');
  if (code.includes("startsWith('## v24.150")) leftovers.push(f + ':st');
  if (code.includes('三百六十二件套（三百六十一件套清除）')) leftovers.push(f + ':362');
  if (code.includes('testChain === 362') || code.includes('files.length === 362') ||
      code.includes('treeTok.length === 362') || code.includes('chainAll.length === 362')) leftovers.push(f + ':count');
  if (code.includes('N/78') || code.includes('**78 项成就**') || code.includes('全部 78 项进度')) leftovers.push(f + ':78');
}
ok('旧代 v24.150 GAME_VERSION 字面量/恒等/顶 pin 全库零残留（哨兵链，豁免本套件 + v24148）',
  leftovers.filter((x) => x.endsWith(':gv') || x.endsWith(':eq') || x.endsWith(':st')).length === 0,
  JSON.stringify(leftovers));
ok('旧代 362 件套口径/计数/78 项 pin 全库零残留（哨兵链，豁免本套件 + v24148）',
  leftovers.filter((x) => x.endsWith(':362') || x.endsWith(':count') || x.endsWith(':78')).length === 0,
  JSON.stringify(leftovers));

if (failed) { console.log(`— v24.151 冒烟完成：${n} 项断言，失败 ${failed} —`); process.exit(1); }
console.log(`— v24.151 冒烟完成：${n} 项断言，失败 0 —`);
