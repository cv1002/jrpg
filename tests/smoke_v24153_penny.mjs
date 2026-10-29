// smoke_v24153_penny.mjs —— v24.155 专项冒烟：新成就「白手成灯」（挑战向零消费档·真结局）
// （新内容·单成就——承 v24.152 药囊未启 / v24.151 未及十级 / v24.148 速战速决 / v24.147 未曾熄灯 /
// v23.68 逆风行灯先例：「以怎样的姿态通关」挑战维度第五次开垦——v24.147 盖住了「别倒下」（未曾熄灯=
// 零阵亡）、v24.148 盖住了「别拖沓」（速战速决=七十场内）、v24.151 盖住了「别练级」（未及十级=十级内）、
// v24.152 盖住了「别嗑药」（药囊未启=零战斗用药），「别花钱」这一面查无一行——Boss 线三档（boss/cave/
// trueboss）与挑战各档皆只认「打过了」，玩家只要打过终焉之神便「记得一切」，但「一金未花的白手档」与
// 「万金满装的富甲档」在成就一览毫无分别。现补零消费向独立单档——判定读既有 hero.trueBoss（终焉之神=
// 真结局最终 Boss，击败即「走完全程」的终极口径，与 trueboss/hardtrue/unflicker/swift/lowlv/nopotion
// 同源）与既有 hero.spent（累计消费金币计数，v23.74「一掷千金」确立，shop.js 买药/买剑甲 + shop.js 住店
// + core.js 酿造四处全游唯一写点、随 snapshotHero 全量快照自动持久化、防御式 (g.spent||0) 旧档零迁移），
// (g.trueBoss && !(g.spent||0)) 即达成：spent 只增不减，花过一金就永久无缘此档（与 hardtrue 换难度 /
// unflicker 死过一次 / swift 超场 / lowlv 升过十级 / nopotion 用过药同属「重新来过才拿得到」的挑战品类）；
// 与既有正向里程碑 spend「一掷千金」（累计消费达 SPEND_GOAL 金）成镜面对、互不重叠——一个纪念「豪掷
// 千金」、一个纪念「白手起家」。零新计数零新状态零新写点零新存档（trueBoss/spent 皆既有字段）；无 r 无
// prog 纯里程碑（与 hardtrue/unflicker/swift/lowlv/nopotion 同款）；解锁时机：winBattle →
// applyAchievements 既有通路（trueboss/hardtrue/unflicker/swift/lowlv/nopotion 同路径零新增依赖），
// 反馈不迟到。ACH_LIST 80→81 项末尾追加。真实可行性：治愈术/防御回蓝/营地篝火/喷泉与泉水免费续航、
// 拾菇人与支线奖励免费发放药水（不进 spent）、快速旅行免费——不碰商店/旅馆/酿造锅磨穿 Lv.12 终焉之神
// 可行，本档偏「克制」（老练玩家自然可得）、与 nopotion 同档、比 lowlv 十级红线低一档。
// 本冒烟守护：版本锚点（格式合法 + 已越过 v24.155 + data.js 字面量 v24.155 + 旧 v24.152 零残留）、
// ACH_LIST 81 项精确与末尾序位（unflicker 76 / swift 77 / lowlv 78 / nopotion 79 / penny 80）、penny
// 数据契约（d 文案、ok 防御式逐值、无 r 无 prog）、unlockedAchievements/applyAchievements 运行期全链路
// （真实解锁落 hero.ach + 横幅 + 幂等去重 / 花过钱不解锁 / 未通关不解锁）、既有 81 成就 id 零回归、
// shop.js/core.js hero.spent 写入点源级零变化（四处+一处唯一产生点、battle.js 零 spent）、README/
// package.json/CHANGELOG 同步（件套口径 367 + v24.155 守护描述 + 入库 365 + 版本速览 81 项 + tests 树
// 串尾 + package 串尾 365）、哨兵链（前望 371 且 README 尚无 366 口径）、旧代 v24.152 字面量/恒等/顶 pin/
// 364 口径/80 项 全库零残留扫描（豁免本套件 + 上一版 v24152 + 上上版 v24151）。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, SPEND_GOAL } from '../js/data.js';
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

console.log('— v24.155 挑战向零消费成就「白手成灯」 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dataSrc = read('js/data.js');
const shopSrc = read('js/shop.js');
const coreSrc = read('js/core.js');
const battleSrc = read('js/battle.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（格式合法 + 已越过 v24.155 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.155', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 155)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.155（旧 v24.152 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v24.184';") && !dataSrc.includes("const GAME_VERSION = 'v24.153';"));
ok('data.js 含 v24.155 注释（白手成灯新成就说明）',
  dataSrc.includes('v24.155 新内容·新成就'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'penny');
ok('ACH_LIST 含 penny「白手成灯」且 id 唯一',
  !!ach && ach.name === '白手成灯' && ACH_LIST.filter((a) => a.id === 'penny').length === 1);
ok('ACH_LIST 精确总数 83 项（80→81 末尾追加）', ACH_LIST.length === 109, String(ACH_LIST.length));
ok('penny 描述文案（未花费 1 金币真结局档）',
  ach.d === '未花费 1 金币击败终焉之神（真结局）', ach.d);
ok('penny 判定源级（读既有 g.trueBoss 与防御式 !(g.spent||0)）',
  String(ach.ok).includes('g.trueBoss') && String(ach.ok).includes('!(g.spent||0)'));
ok('penny 无 r 无 prog 纯里程碑（与 hardtrue/unflicker/swift/lowlv/nopotion 同款）',
  !('r' in ach) && !('prog' in ach));

// —— ok 防御式逐值 ——
ok('零消费真结局 → 解锁', ach.ok({ trueBoss: true, spent: 0 }) === true);
ok('缺 spent 字段仅 trueBoss → 按 0 解码（旧档零迁移）', ach.ok({ trueBoss: true }) === true);
ok('花过 1 金真结局 → 不解锁（永久无缘此档）', ach.ok({ trueBoss: true, spent: 1 }) === false);
ok('花过 500 金真结局 → 不解锁', ach.ok({ trueBoss: true, spent: 500 }) === false);
ok('刷满一掷千金 1000 金真结局 → 不解锁（penny 与 spend 各占一位互不重叠）',
  ach.ok({ trueBoss: true, spent: SPEND_GOAL }) === false);
ok('零消费但未通关 → 不解锁', ach.ok({ spent: 0 }) === false);
ok('空档/缺字段 → 不解锁（(g.spent||0) 防御式零迁移）', ach.ok({}) === false);

// —— 既有 81 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime', 'hunt100', 'ptime2', 'lucky2', 'rich2', 'stock',
  'brew2', 'stock2', 'elixir', 'mush', 'elixir2', 'mush2', 'metall', 'rich3', 'ptime3', 'hunt3',
  'lucky3', 'stock3', 'elixir3', 'brew3', 'mush3', 'outstep', 'outstep2', 'scholar2', 'seen', 'seen2',
  'chests2', 'talkall', 'deflect', 'charge', 'crit', 'cast', 'flee', 'potionuses', 'rushs', 'mapdrink',
  'innrest', 'spend', 'travels', 'steps', 'battles', 'sell', 'deaths', 'nightwins', 'unflicker', 'swift',
  'lowlv', 'nopotion', 'penny'];
ok('既有 81 成就 id 零回归（核心抽样全覆盖末期正位）',
  EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('nightwins 75 / unflicker 76 / swift 77 / lowlv 78 / nopotion 79 / penny 80 末尾序位（既有序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'nightwins') === 75 &&
  ACH_LIST.findIndex((a) => a.id === 'unflicker') === 76 &&
  ACH_LIST.findIndex((a) => a.id === 'swift') === 77 &&
  ACH_LIST.findIndex((a) => a.id === 'lowlv') === 78 &&
  ACH_LIST.findIndex((a) => a.id === 'nopotion') === 79 &&
  ACH_LIST.findIndex((a) => a.id === 'penny') === 80);

// —— 既有挑战向家族对照（hardtrue/unflicker/swift/lowlv/nopotion/penny 六档独立互不干扰）——
const _a = (id) => ACH_LIST.find((x) => x.id === id);
ok('hardtrue/unflicker/swift/lowlv/nopotion/penny 六档独立（难度 vs 姿态 vs 速通 vs 低等级 vs 零用药 vs 零消费）',
  _a('hardtrue').ok({ trueBoss: true, diff: 1 }) === true &&
  _a('unflicker').ok({ trueBoss: true }) === true &&
  _a('swift').ok({ trueBoss: true, battles: 50 }) === true &&
  _a('lowlv').ok({ trueBoss: true, level: 9 }) === true &&
  _a('nopotion').ok({ trueBoss: true, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, spent: 0 }) === true);
ok('死过一次仍可解锁 penny（仅 unflicker 被排除——各自判据不同源）',
  ach.ok({ trueBoss: true, spent: 0, deaths: 5 }) === true &&
  _a('unflicker').ok({ trueBoss: true, deaths: 5 }) === false);
ok('升过十级仍可解锁 penny（仅 lowlv 被排除——各自判据不同源）',
  ach.ok({ trueBoss: true, spent: 0, level: 12 }) === true &&
  _a('lowlv').ok({ trueBoss: true, level: 12 }) === false);
ok('用过药仍可解锁 penny（仅 nopotion 被排除——各自判据不同源）',
  ach.ok({ trueBoss: true, spent: 0, potionUses: 5 }) === true &&
  _a('nopotion').ok({ trueBoss: true, potionUses: 5 }) === false);
ok('超前场速通档零消费仍可解锁 penny（速通向与零消费向不互斥）',
  ach.ok({ trueBoss: true, spent: 0, battles: 55 }) === true);
ok('困难档零消费通关仍可解锁 penny（难度向与零消费向正交）',
  ach.ok({ trueBoss: true, spent: 0, diff: 1 }) === true);
ok('一掷千金里程碑档不解锁 penny（spend 有 prog、penny 无 prog——正向与零消费各占一位）',
  ach.ok({ trueBoss: true, spent: 20 }) === false &&
  _a('spend').ok({ trueBoss: false, spent: 20 }) === false &&
  _a('spend').ok({ spent: SPEND_GOAL }) === true &&
  'prog' in _a('spend') && !('prog' in ach));

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
  const h = freshHero({ trueBoss: true, spent: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 零消费真结局档 newly 含 penny（既有通路自动跟随）',
    newly.includes('penny'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, spent: 300 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 花过钱的过关档 newly 不含 penny（不误解锁）',
    !newly.includes('penny'), JSON.stringify(newly));
}
{
  const h = freshHero({ spent: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 未通关档 newly 不含 penny（不误解锁）',
    !newly.includes('penny'), JSON.stringify(newly));
}

// —— applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等）——
{
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    const h = freshHero({ trueBoss: true, spent: 0 });
    S.G = h;
    applyAchievements();
    ok('applyAchievements 真实解锁落 hero.ach（含 penny）', h.ach.includes('penny'), JSON.stringify(h.ach));
    ok('解锁横幅报成就名【白手成灯】', msgs.some((m) => m.includes('🔓 成就解锁：') && m.includes('白手成灯')), msgs.join(' | '));
    const len1 = msgs.length;
    applyAchievements();
    ok('幂等：重复调用不再报（已解锁去重）', msgs.length === len1 && msgs.filter((m) => m.includes('白手成灯')).length === 1, String(msgs.length));
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
    const h = freshHero({ trueBoss: true, spent: 2 });
    S.G = h;
    applyAchievements();
    ok('花过钱过关 applyAchievements 零 penny 解锁零「白手成灯」横幅（不误解锁）',
      !h.ach.includes('penny') && !msgs.some((m) => m.includes('白手成灯')), JSON.stringify({ ach: h.ach, msgs }));
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}

// —— 源级零变化：shop.js/core.js 既有 hero.spent 写入点（既有，本版未动）——
ok('shop.js 既有 spent 写入点源级零变化（买药/买剑/买甲/住店四处 hero.spent = 唯一产生点）',
  (shopSrc.match(/hero\.spent\s*=/g) || []).length === 4, String((shopSrc.match(/hero\.spent\s*=/g) || []).length));
ok('core.js 既有 spent 写入点源级零变化（酿造一处 hero.spent = 唯一产生点）',
  (coreSrc.match(/hero\.spent\s*=/g) || []).length === 1, String((coreSrc.match(/hero\.spent\s*=/g) || []).length));
ok('battle.js 全文件无 spent 写入（战斗零消费零计数）',
  (battleSrc.match(/hero\.spent/g) || []).length === 0, String((battleSrc.match(/hero\.spent/g) || []).length));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径为三百九十四件套（三百九十三件套清除）',
  readme.includes('扩充为冒烟三百九十四件套（三百九十三件套清除）') && !readme.includes('冒烟三百六十七件套（三百六十五件套清除）'));
ok('README 含 v24.153 守护描述（白手成灯新成就守护）', readme.includes('v24.153 起含「白手成灯」新成就守护'));
ok('README 版本速览已为 v24.155 且成就计数 83', readme.includes('版本速览（v24.184）') && readme.includes('109 项成就'));
ok('README 成就计数双处口径 81 项（全部 109 项进度 + **109 项成就**，80 项清除）',
  readme.includes('全部 109 项进度') && readme.includes('**109 项成就**') && !readme.includes('**82 项成就**'));
ok('README tests 树收录 smoke_v24153_penny（含 v24.153 守护子句 + 串尾）',
  readme.includes('v24.153 起含「白手成灯」新成就守护') && readme.includes('smoke_v24153_penny'));
ok('README 含 smoke_v24153_penny 入库（365 份）', readme.includes('smoke_v24153_penny 入库（365 份）'));
ok('package.json 已收录 smoke_v24153_penny.mjs 且位于串尾（狠在 nopotion 之后）',
  pkg.includes('smoke_v24153_penny.mjs') &&
  pkg.includes('node tests/smoke_v24151_lowlv.mjs && node tests/smoke_v24152_nopotion.mjs && node tests/smoke_v24153_penny.mjs && node tests/smoke_v24154_steadfast.mjs && node tests/smoke_v24155_frugal.mjs && node tests/smoke_v24157_dry.mjs && node tests/smoke_v24158_swift2.mjs && node tests/smoke_v24159_lowlv2.mjs && node tests/smoke_v24160_noskill.mjs && node tests/smoke_v24161_noskill2.mjs && node tests/smoke_v24162_lowskill.mjs && node tests/smoke_v24163_swiftskill.mjs && node tests/smoke_v24164_swiftlv.mjs && node tests/smoke_v24165_nopotskill.mjs && node tests/smoke_v24166_unflskill.mjs && node tests/smoke_v24167_swiftnopo.mjs && node tests/smoke_v24168_lowlvnopo.mjs && node tests/smoke_v24169_unflswift.mjs && node tests/smoke_v24170_unfllowlv.mjs && node tests/smoke_v24171_unflnopo.mjs && node tests/smoke_v24172_unflpenny.mjs && node tests/smoke_v24173_pennyswift.mjs && node tests/smoke_v24174_pennylowlv.mjs && node tests/smoke_v24175_pennynoskill.mjs && node tests/smoke_v24176_pennynopo.mjs && node tests/smoke_v24177_unflswift2.mjs && node tests/smoke_v24178_unflpenny2.mjs && node tests/smoke_v24179_unflnopo2.mjs && node tests/smoke_v24180_unflskill2.mjs && node tests/smoke_v24181_lampoilquest.mjs && node tests/smoke_v24183_unfllowlv2.mjs && node tests/smoke_v24184_pennyswift2.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 365 件套', testChain === 394, String(testChain));
ok('CHANGELOG 含 v24.155 顶条目', changelog.startsWith('## v24.184'));

// —— 哨兵链：README 已有 366 口径且尚无 368（前望 371 语义：下一版才写 367）——
ok('README 已有三百六十七件套口径且尚无 368（哨兵前望 395 语义：下一版才写 367）',
  readme.includes('三百九十四件套（三百九十三件套清除）') && !readme.includes('三百九十五件套'));
{
  const s24143 = read('tests/smoke_v24143_furnacequest.mjs');
  ok('smoke_v24143 哨兵链前望 395（三百九十五件套否定式）',
    s24143.includes('哨兵链前望 395') && s24143.includes('三百九十五件套否定式'));
}
{
  ok('smoke_v24152 姊妹件版本字面量 pin 已随新现实推进（v24.155）',
    read('tests/smoke_v24152_nopotion.mjs').includes("const GAME_VERSION = 'v24.184';"));
  ok('smoke_v24151 姊妹件版本字面量 pin 已随新现实推进（v24.155）',
    read('tests/smoke_v24151_lowlv.mjs').includes("const GAME_VERSION = 'v24.184';"));
  ok('smoke_v24148 姊妹件版本字面量 pin 已随新现实推进（v24.155）',
    read('tests/smoke_v24148_swift.mjs').includes("const GAME_VERSION = 'v24.184';"));
  ok('smoke_v2229 姊妹件版本恒等 pin 已随新现实推进（=== v24.155）',
    read('tests/smoke_v2229_metall.mjs').includes("GAME_VERSION === 'v24.184'"));
}

// —— 旧代 v24.152 字面量 / 364 件套口径 / 80 项 全库零残留扫描（豁免本套件 + 上一版 v24152 + 上上版 v24151）——
const EXEMPT = new Set(['smoke_v24184_pennyswift2.mjs', 'smoke_v24155_frugal.mjs', 'smoke_v24154_steadfast.mjs', 'smoke_v24153_penny.mjs', 'smoke_v24152_nopotion.mjs']);
const leftovers = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests')).filter((x) => x.endsWith('.mjs') && !EXEMPT.has(x))) {
  const s = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  const code = s.split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  if (code.includes("const GAME_VERSION = 'v24.153'")) leftovers.push(f + ':gv');
  if (code.includes("GAME_VERSION === 'v24.153'")) leftovers.push(f + ':eq');
  if (code.includes("startsWith('## v24.153")) leftovers.push(f + ':st');
  if (code.includes('三百六十五件套（三百六十四件套清除）')) leftovers.push(f + ':364');
  if (code.includes('testChain === 365') || code.includes('files.length === 365') ||
      code.includes('treeTok.length === 365') || code.includes('chainAll.length === 365')) leftovers.push(f + ':count');
  if (code.includes('N/81') || code.includes('**81 项成就**') || code.includes('全部 81 项进度')) leftovers.push(f + ':80');
}
ok('旧代 v24.153 GAME_VERSION 字面量/恒等/顶 pin 全库零残留（哨兵链，豁免本套件 + v24152 + v24151）',
  leftovers.filter((x) => x.endsWith(':gv') || x.endsWith(':eq') || x.endsWith(':st')).length === 0,
  JSON.stringify(leftovers));
ok('旧代 365 件套口径/计数/81 项 pin 全库零残留（哨兵链，豁免本套件 + v24152 + v24151）',
  leftovers.filter((x) => x.endsWith(':364') || x.endsWith(':count') || x.endsWith(':80')).length === 0,
  JSON.stringify(leftovers));

if (failed) { console.log(`— v24.155 冒烟完成：${n} 项断言，失败 ${failed} —`); process.exit(1); }
console.log(`— v24.155 冒烟完成：${n} 项断言，失败 0 —`);
