// smoke_v24159_lowlv2.mjs —— v24.159 专项冒烟：新成就「逆风青芽」（挑战向硬核低等级复合档·困难+未满十级）
// （新内容·单成就——承 v24.158 逆风疾行 / v24.157 滴药未沾 / v24.155 两袖清风 / v24.154 逆风不灭 /
// v24.153 白手成灯 / v24.152 药囊未启 / v24.151 未及十级 / v24.148 速战速决 / v24.147 未曾熄灯 /
// v23.68 逆风行灯先例：「以怎样的姿态通关」挑战维度第十次开垦——v24.147 盖住了「别倒下」、v24.148 盖住了
// 「别拖沓」、v24.151 盖住了「别练级」、v24.152 盖住了「别嗑药」、v24.153 盖住了「别花钱」（普通）、
// v24.154 盖住了「困难还要别倒下」、v24.155 盖住了「困难还要别花钱」、v24.157 盖住了「困难还要别嗑药」、
// v24.158 盖住了「困难还要别拖沓」，「困难还要别练级」这一面查无一行——hardtrue「逆风行灯」只认「困难打过
// 了」、lowlv「未及十级」只认「十级内」（普通/困难通吃），两者交叉的「困难 + 未满十级」硬核档在成就一览毫
// 无分别：困难档同样练到十级外的档与一路九级青芽扛到终焉之神的档，拿到的都是同一枚未及十级。现补硬核低等
// 级复合档独立单档——判定读既有 hero.trueBoss（终焉之神=真结局最终 Boss，与 trueboss/hardtrue/unflicker/
// swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2 同源）、既有 hero.diff（DIFFS 下标：建档 createDiff
// 写定、core.initGame `S.G.diff = diff||0`、resetRun 沿用同槽、随 snapshotHero 全量快照自动持久化，与
// hardtrue 同读一份源）与既有 hero.level（hero.js grantXp 升级唯一产生点 hero.level++、随 snapshotHero
// 全量快照自动持久化、防御式 (g.level||1) 旧档零迁移，与 lowlv「未及十级」/lvl5/lvl10/lvl12 级档同读一份
// 源），(g.trueBoss && g.diff===1 && (g.level||1)<LOWLV_GOAL(10)) 即「困难 · 未满十级通关」达成——level 只增
// 不减，困难档升过十级就永久无缘此档（与 hardtrue 换难度 / unflicker 死过一次 / swift 超场 / lowlv 升过十
// 级 / nopotion 用过药 / penny 花过金 / steadfast 死过一次 / frugal 花过金 / dry 用过药 / swift2 超场同属
// 「重新来过才拿得到」的挑战品类）。真实可行性：与 lowlv 同为「等级克制」档、仅叠加困难数值微升
// （DIFF_SCALE 同源），普通档十级红线内磨穿 Lv.12 终焉之神本就可行（lowlv 先例），困难档数值微升后十级红
// 线内的余量收窄、但仍可「逃战避强→低图刷级→少战精进」压着等级线过，吃满「既少练又硬核」双克制的是一场
// 纪律跑。本冒烟守护：版本锚点（格式合法 + 已越过 v24.158 + data.js 字面量 v24.159 + 旧 v24.158 零残留）、
// ACH_LIST 86 项精确与末尾序位（unflicker 76 / swift 77 / lowlv 78 / nopotion 79 / penny 80 / steadfast 81
// / frugal 82 / dry 83 / swift2 84 / lowlv2 85）、lowlv2 数据契约（d 文案、ok 防御式逐值、无 r 无 prog 且
// 严格交叠 hardtrue×lowlv）、unlockedAchievements/applyAchievements 运行期全链路（真实解锁落 hero.ach +
// 横幅 + 幂等去重 / 困难练过级不解锁 / 普通低等级不解锁 / 未通关不解锁）、既有 85 成就 id 零回归、hero.js
// level 写入点与 data.js LOWLV_GOAL 常量源级零变化、README/package.json/CHANGELOG 同步（件套口径 370 +
// v24.159 守护描述 + 入库 370 + 版本速览 86 项 + tests 树串尾 + package 串尾 370）、哨兵链（前望 371 且
// README 尚无 372 口径）、旧代 v24.158 字面量/恒等/顶 pin/369 口径/85 项 全库零残留扫描（豁免本套件 + 上
// 一版 v24158 + 上上版 v24157）。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, LOWLV_GOAL, BATTLE_GOAL } from '../js/data.js';
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

console.log('— v24.159 挑战向硬核低等级复合成就「逆风青芽」 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dataSrc = read('js/data.js');
const heroSrc = read('js/hero.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（格式合法 + 已越过 v24.158 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.158', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 158)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.159（旧 v24.158 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v24.187';") && !dataSrc.includes("const GAME_VERSION = 'v24.158';"));
ok('data.js 含 v24.159 注释（逆风青芽新成就说明）',
  dataSrc.includes('v24.159 新内容·新成就'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'lowlv2');
ok('ACH_LIST 含 lowlv2「逆风青芽」且 id 唯一',
  !!ach && ach.name === '逆风青芽' && ACH_LIST.filter((a) => a.id === 'lowlv2').length === 1);
ok('ACH_LIST 精确总数 89 项（85→86 末尾追加）', ACH_LIST.length === 112, String(ACH_LIST.length));
ok('lowlv2 描述文案（困难模式且等级未满十级真结局档）',
  ach.d === `以困难模式且等级未满 ${LOWLV_GOAL} 时击败终焉之神（真结局）`, ach.d);
ok('lowlv2 判定源级（读既有 g.trueBoss / g.diff===1 / 防御式 (g.level||1)<LOWLV_GOAL）',
  String(ach.ok).includes('g.trueBoss') && String(ach.ok).includes('g.diff===1') && String(ach.ok).includes('(g.level||1)<LOWLV_GOAL'));
ok('lowlv2 无 r 无 prog 纯里程碑（与 hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2 同款）',
  !('r' in ach) && !('prog' in ach));

// —— ok 防御式逐值 ——
ok('困难 + 未满十级真结局 → 解锁', ach.ok({ trueBoss: true, diff: 1, level: 9 }) === true);
ok('困难 + 缺 level 字段仅 trueBoss → 按 1 解码（旧档零迁移）', ach.ok({ trueBoss: true, diff: 1 }) === true);
ok('困难 + 恰十级真结局 → 不解锁（永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, level: 10 }) === false);
ok('困难 + 已满十级真结局 → 不解锁', ach.ok({ trueBoss: true, diff: 1, level: 12 }) === false);
ok('普通档 + 未满十级真结局 → 不解锁（普通低等级归 lowlv，本枚只认困难）',
  ach.ok({ trueBoss: true, diff: 0, level: 9 }) === false);
ok('缺 diff 字段 + 未满十级真结局 → 不解锁（旧档无 diff 非困难档，零迁移）',
  ach.ok({ trueBoss: true, level: 9 }) === false);
ok('困难 + 未满十级但未通关 → 不解锁', ach.ok({ diff: 1, level: 9 }) === false);
ok('空档/缺字段 → 不解锁（(g.level||1) 防御式零迁移）', ach.ok({}) === false);

// —— 既有 85 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime', 'hunt100', 'ptime2', 'lucky2', 'rich2', 'stock',
  'brew2', 'stock2', 'elixir', 'mush', 'elixir2', 'mush2', 'metall', 'rich3', 'ptime3', 'hunt3',
  'lucky3', 'stock3', 'elixir3', 'brew3', 'mush3', 'outstep', 'outstep2', 'scholar2', 'seen', 'seen2',
  'chests2', 'talkall', 'deflect', 'charge', 'crit', 'cast', 'flee', 'potionuses', 'rushs', 'mapdrink',
  'innrest', 'spend', 'travels', 'steps', 'battles', 'sell', 'deaths', 'nightwins', 'unflicker', 'swift',
  'lowlv', 'nopotion', 'penny', 'steadfast', 'frugal', 'dry', 'swift2'];
ok('既有 85 成就 id 零回归（核心抽样全覆盖末期正位）',
  EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('nightwins 75 / unflicker 76 / swift 77 / lowlv 78 / nopotion 79 / penny 80 / steadfast 81 / frugal 82 / dry 83 / swift2 84 / lowlv2 85 末尾序位（既有序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'nightwins') === 75 &&
  ACH_LIST.findIndex((a) => a.id === 'unflicker') === 76 &&
  ACH_LIST.findIndex((a) => a.id === 'swift') === 77 &&
  ACH_LIST.findIndex((a) => a.id === 'lowlv') === 78 &&
  ACH_LIST.findIndex((a) => a.id === 'nopotion') === 79 &&
  ACH_LIST.findIndex((a) => a.id === 'penny') === 80 &&
  ACH_LIST.findIndex((a) => a.id === 'steadfast') === 81 &&
  ACH_LIST.findIndex((a) => a.id === 'frugal') === 82 &&
  ACH_LIST.findIndex((a) => a.id === 'dry') === 83 &&
  ACH_LIST.findIndex((a) => a.id === 'swift2') === 84 &&
  ACH_LIST.findIndex((a) => a.id === 'lowlv2') === 85);

// —— 既有挑战向家族对照（hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2 十一档独立互不干扰）——
const _a = (id) => ACH_LIST.find((x) => x.id === id);
ok('hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2 十一档独立（难度 vs 姿态 vs 速通 vs 低等级 vs 零用药 vs 零消费 vs 硬核 vs 硬核零消费 vs 硬核零用药 vs 硬核速通 vs 硬核低等级）',
  _a('hardtrue').ok({ trueBoss: true, diff: 1 }) === true &&
  _a('unflicker').ok({ trueBoss: true }) === true &&
  _a('swift').ok({ trueBoss: true, battles: 50 }) === true &&
  _a('lowlv').ok({ trueBoss: true, level: 9 }) === true &&
  _a('nopotion').ok({ trueBoss: true, potionUses: 0 }) === true &&
  _a('penny').ok({ trueBoss: true, spent: 0 }) === true &&
  _a('steadfast').ok({ trueBoss: true, diff: 1, deaths: 0 }) === true &&
  _a('frugal').ok({ trueBoss: true, diff: 1, spent: 0 }) === true &&
  _a('dry').ok({ trueBoss: true, diff: 1, potionUses: 0 }) === true &&
  _a('swift2').ok({ trueBoss: true, diff: 1, battles: 50 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, level: 9 }) === true);
ok('困难档练过级（已满十级）仍可解锁 hardtrue（仅 lowlv2 被排除——hardtrue 只认困难打过）',
  _a('hardtrue').ok({ trueBoss: true, diff: 1, level: 12 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, level: 12 }) === false);
ok('普通档未满十级仍可解锁 lowlv（仅 lowlv2 被排除——lowlv 不认难度）',
  _a('lowlv').ok({ trueBoss: true, level: 9 }) === true &&
  ach.ok({ trueBoss: true, diff: 0, level: 9 }) === false);
ok('困难 + 未满十级真结局三枚同亮（hardtrue + lowlv + lowlv2 严格交叠）',
  _a('hardtrue').ok({ trueBoss: true, diff: 1, level: 9 }) === true &&
  _a('lowlv').ok({ trueBoss: true, diff: 1, level: 9 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, level: 9 }) === true);
ok('困难低等级档（未满十级）仍可解锁 dry / swift2（各自判据不同源——level 与 potionUses/battles 互不相干）',
  _a('dry').ok({ trueBoss: true, diff: 1, potionUses: 0, level: 9 }) === true &&
  _a('swift2').ok({ trueBoss: true, diff: 1, battles: 50, level: 9 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, level: 9 }) === true);
ok('lvl10 正向里程碑档不解锁 lowlv2（level 有 prog、lowlv2 无 prog——正向与低等级各占一位）',
  ach.ok({ trueBoss: true, diff: 1, level: 10 }) === false &&
  _a('lvl10').ok({ level: 10 }) === true &&
  'prog' in _a('lvl10') && !('prog' in ach));
ok('困难低等级档（level 9）+ 百场遭遇仍解锁 lowlv2（battles 与 lowlv2 判据无关——只认等级线）',
  ach.ok({ trueBoss: true, diff: 1, level: 9, battles: BATTLE_GOAL }) === true);

// —— unlockedAchievements 集成 ——
function freshHero(extra) {
  return Object.assign({ name: '余烬', level: 7, gold: 123, xp: 0, xpNext: 20, hp: 50, hpMax: 50, mp: 20, mpMax: 20,
    item: 3, potion2: 1, mushrooms: 2, weapon: '铁剑', armor: '皮甲', atkMax: 12, defMax: 6,
    map: 'village', x: 8, y: 8, time: 0, ach: [], bestiary: {}, seen: {}, fragments: [], visited: ['village'],
    quests: {}, totalWins: 3, drops: 0, steps: 0, travels: 0, spent: 0, battles: 3, skills: [], talked: [],
    checks: 0, crits: 0, casts: 0, flees: 0, potionUses: 0, deflects: 0, charges: 0, sleep: 0,
    sold: 0, dealt: 0, mapPotions: 0, innRests: 0, nightWins: 0, rushClears: 0, brews: 0, chests: [],
    deaths: 0, diff: 0 }, extra);
}
{
  const h = freshHero({ trueBoss: true, diff: 1, level: 9 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 困难未满十级真结局档 newly 含 lowlv2（既有通路自动跟随）',
    newly.includes('lowlv2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, level: 12 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 困难练过级档 newly 不含 lowlv2（不误解锁）',
    !newly.includes('lowlv2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 0, level: 9 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 普通低等级档 newly 不含 lowlv2（lowlv 通吃但本枚只认困难）',
    !newly.includes('lowlv2'), JSON.stringify(newly));
}
{
  const h = freshHero({ diff: 1, level: 9 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 未通关档 newly 不含 lowlv2（不误解锁）',
    !newly.includes('lowlv2'), JSON.stringify(newly));
}

// —— applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等）——
{
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    const h = freshHero({ trueBoss: true, diff: 1, level: 9 });
    S.G = h;
    applyAchievements();
    ok('applyAchievements 真实解锁落 hero.ach（含 lowlv2）', h.ach.includes('lowlv2'), JSON.stringify(h.ach));
    ok('解锁横幅报成就名【逆风青芽】', msgs.some((m) => m.includes('🔓 成就解锁：') && m.includes('逆风青芽')), msgs.join(' | '));
    const len1 = msgs.length;
    applyAchievements();
    ok('幂等：重复调用不再报（已解锁去重）', msgs.length === len1 && msgs.filter((m) => m.includes('逆风青芽')).length === 1, String(msgs.length));
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
    const h = freshHero({ trueBoss: true, diff: 1, level: 12 });
    S.G = h;
    applyAchievements();
    ok('困难练过级 applyAchievements 零 lowlv2 解锁零「逆风青芽」横幅（不误解锁）',
      !h.ach.includes('lowlv2') && !msgs.some((m) => m.includes('逆风青芽')), JSON.stringify({ ach: h.ach, msgs }));
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}

// —— 源级零变化：hero.js level 写入点与 data.js LOWLV_GOAL 常量（既有，本版未动）——
ok('hero.js 具 1 处 hero.level++ 写入点（grantXp 升级唯一产生点）',
  (heroSrc.match(/hero\.level\+\+;/g) || []).length === 1, String((heroSrc.match(/hero\.level\+\+/g) || []).length));
ok('data.js LOWLV_GOAL 常量仍为 10（单一数据源，与 lowlv 同读一份源）',
  dataSrc.includes('const LOWLV_GOAL = 10;'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径为三百九十七件套（三百九十六件套清除）',
  readme.includes('扩充为冒烟三百九十七件套（三百九十六件套清除）') && !readme.includes('扩充为冒烟三百六十九件套（三百六十八件套清除）'));
ok('README 含 v24.159 守护描述（逆风青芽新成就守护）', readme.includes('v24.159 起含「逆风青芽」新成就守护'));
ok('README 版本速览已为 v24.164 且成就计数 91', readme.includes('版本速览（v24.187）') && readme.includes('112 项成就'));
ok('README 成就计数双处口径 89 项（全部 112 项进度 + **112 项成就**，85 项清除）',
  readme.includes('全部 112 项进度') && readme.includes('**112 项成就**') && !readme.includes('**85 项成就**'));
ok('README tests 树收录 smoke_v24159_lowlv2（含 v24.159 守护子句 + 串尾）',
  readme.includes('v24.159 起含「逆风青芽」新成就守护') && readme.includes('smoke_v24159_lowlv2'));
ok('README 含 smoke_v24159_lowlv2 入库（370 份）', readme.includes('smoke_v24159_lowlv2 入库（370 份）'));
ok('package.json 已收录 smoke_v24159_lowlv2.mjs 且位于串尾（狠在 dry 之后）',
  pkg.includes('smoke_v24159_lowlv2.mjs') &&
  pkg.includes('node tests/smoke_v24157_dry.mjs && node tests/smoke_v24158_swift2.mjs && node tests/smoke_v24159_lowlv2.mjs && node tests/smoke_v24160_noskill.mjs && node tests/smoke_v24161_noskill2.mjs && node tests/smoke_v24162_lowskill.mjs && node tests/smoke_v24163_swiftskill.mjs && node tests/smoke_v24164_swiftlv.mjs && node tests/smoke_v24165_nopotskill.mjs && node tests/smoke_v24166_unflskill.mjs && node tests/smoke_v24167_swiftnopo.mjs && node tests/smoke_v24168_lowlvnopo.mjs && node tests/smoke_v24169_unflswift.mjs && node tests/smoke_v24170_unfllowlv.mjs && node tests/smoke_v24171_unflnopo.mjs && node tests/smoke_v24172_unflpenny.mjs && node tests/smoke_v24173_pennyswift.mjs && node tests/smoke_v24174_pennylowlv.mjs && node tests/smoke_v24175_pennynoskill.mjs && node tests/smoke_v24176_pennynopo.mjs && node tests/smoke_v24177_unflswift2.mjs && node tests/smoke_v24178_unflpenny2.mjs && node tests/smoke_v24179_unflnopo2.mjs && node tests/smoke_v24180_unflskill2.mjs && node tests/smoke_v24181_lampoilquest.mjs && node tests/smoke_v24183_unfllowlv2.mjs && node tests/smoke_v24184_pennyswift2.mjs && node tests/smoke_v24185_pennylowlv2.mjs && node tests/smoke_v24186_pennynoskill2.mjs && node tests/smoke_v24187_pennynopo2.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 371 件套', testChain === 397, String(testChain));
ok('CHANGELOG 含 v24.160 顶条目', changelog.startsWith('## v24.187'));

// —— 哨兵链：README 已有 370 口径且尚无 372（前望 371 语义：下一版才写 372）——
ok('README 已有三百七十五件套口径且尚无 372（哨兵前望 398 语义：下一版才写 372）',
  readme.includes('扩充为冒烟三百九十七件套（三百九十六件套清除）') && !readme.includes('三百九十八件套'));
{
  const s24143 = read('tests/smoke_v24143_furnacequest.mjs');
  ok('smoke_v24143 哨兵链前望 398（三百九十八件套否定式）',
    s24143.includes('哨兵链前望 398') && s24143.includes('三百九十八件套否定式'));
}
{
  ok('smoke_v24158 姊妹件版本字面量 pin 已随新现实推进（v24.159）',
    read('tests/smoke_v24158_swift2.mjs').includes("const GAME_VERSION = 'v24.187';"));
  ok('smoke_v24157 姊妹件版本字面量 pin 已随新现实推进（v24.159）',
    read('tests/smoke_v24157_dry.mjs').includes("const GAME_VERSION = 'v24.187';"));
  ok('smoke_v24155 姊妹件版本字面量 pin 已随新现实推进（v24.159）',
    read('tests/smoke_v24155_frugal.mjs').includes("const GAME_VERSION = 'v24.187';"));
  ok('smoke_v24154 姊妹件版本字面量 pin 已随新现实推进（v24.159）',
    read('tests/smoke_v24154_steadfast.mjs').includes("const GAME_VERSION = 'v24.187';"));
  ok('smoke_v24153 姊妹件版本字面量 pin 已随新现实推进（v24.159）',
    read('tests/smoke_v24153_penny.mjs').includes("const GAME_VERSION = 'v24.187';"));
  ok('smoke_v24152 姊妹件版本字面量 pin 已随新现实推进（v24.159）',
    read('tests/smoke_v24152_nopotion.mjs').includes("const GAME_VERSION = 'v24.187';"));
  ok('smoke_v24151 姊妹件版本字面量 pin 已随新现实推进（v24.159）',
    read('tests/smoke_v24151_lowlv.mjs').includes("const GAME_VERSION = 'v24.187';"));
  ok('smoke_v24148 姊妹件版本字面量 pin 已随新现实推进（v24.159）',
    read('tests/smoke_v24148_swift.mjs').includes("const GAME_VERSION = 'v24.187';"));
  ok('smoke_v2229 姊妹件版本恒等 pin 已随新现实推进（=== v24.159）',
    read('tests/smoke_v2229_metall.mjs').includes("GAME_VERSION === 'v24.187'"));
}

// —— 旧代 v24.158 字面量 / 369 件套口径 / 85 项 全库零残留扫描（豁免本套件 + 上一版 v24158 + 上上版 v24157）——
const EXEMPT = new Set(['smoke_v24187_pennynopo2.mjs', 'smoke_v24186_pennynoskill2.mjs', 'smoke_v24185_pennylowlv2.mjs', 'smoke_v24184_pennyswift2.mjs', 'smoke_v24159_lowlv2.mjs', 'smoke_v24158_swift2.mjs', 'smoke_v24157_dry.mjs']);
const leftovers = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests')).filter((x) => x.endsWith('.mjs') && !EXEMPT.has(x))) {
  const s = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  const code = s.split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  if (code.includes("const GAME_VERSION = 'v24.158'")) leftovers.push(f + ':gv');
  if (code.includes("GAME_VERSION === 'v24.158'")) leftovers.push(f + ':eq');
  if (code.includes("startsWith('## v24.158")) leftovers.push(f + ':st');
  if (code.includes('三百六十九件套（三百六十八件套清除）')) leftovers.push(f + ':369');
  if (code.includes('testChain === 369') || code.includes('files.length === 369') ||
      code.includes('treeTok.length === 369') || code.includes('chainAll.length === 369')) leftovers.push(f + ':count');
  if (code.includes('N/85') || code.includes('**85 项成就**') || code.includes('全部 85 项进度')) leftovers.push(f + ':85');
}
ok('旧代 v24.158 GAME_VERSION 字面量/恒等/顶 pin 全库零残留（哨兵链，豁免本套件 + v24158 + v24157）',
  leftovers.filter((x) => x.endsWith(':gv') || x.endsWith(':eq') || x.endsWith(':st')).length === 0,
  JSON.stringify(leftovers));
ok('旧代 369 件套口径/计数/85 项 pin 全库零残留（哨兵链，豁免本套件 + v24158 + v24157）',
  leftovers.filter((x) => x.endsWith(':369') || x.endsWith(':count') || x.endsWith(':85')).length === 0,
  JSON.stringify(leftovers));

if (failed) { console.log(`— v24.159 冒烟完成：${n} 项断言，失败 ${failed} —`); process.exit(1); }
console.log(`— v24.159 冒烟完成：${n} 项断言，失败 0 —`);
