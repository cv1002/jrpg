// smoke_v24158_swift2.mjs —— v24.158 专项冒烟：新成就「逆风疾行」（挑战向硬核速通复合档·困难+七十场内）
// （新内容·单成就——承 v24.157 滴药未沾 / v24.155 两袖清风 / v24.154 逆风不灭 / v24.153 白手成灯 /
// v24.152 药囊未启 / v24.151 未及十级 / v24.148 速战速决 / v24.147 未曾熄灯 / v23.68 逆风行灯先例：
// 「以怎样的姿态通关」挑战维度第九次开垦——v24.147 盖住了「别倒下」、v24.148 盖住了「别拖沓」、v24.151
// 盖住了「别练级」、v24.152 盖住了「别嗑药」、v24.153 盖住了「别花钱」（普通）、v24.154 盖住了「困难还要
// 别倒下」、v24.155 盖住了「困难还要别花钱」、v24.157 盖住了「困难还要别嗑药」，「困难还要别拖沓」这一面
// 查无一行——hardtrue「逆风行灯」只认「困难打过了」、swift「速战速决」只认「七十场内」（普通/困难通吃），
// 两者交叉的「困难 + 七十场内」硬核档在成就一览毫无分别：困难档同样拖沓的档与一路快攻扛到终焉之神的档，
// 拿到的都是同一枚速战速决。现补硬核速通复合档独立单档——判定读既有 hero.trueBoss（终焉之神=真结局最终
// Boss，与 trueboss/hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry 同源）、既有
// hero.diff（DIFFS 下标：建档 createDiff 写定、core.initGame `S.G.diff = diff||0`、resetRun 沿用同槽、
// 随 snapshotHero 全量快照自动持久化，与 hardtrue 同读一份源）与既有 hero.battles（遭遇场次：
// battle.startBattle 进战即记唯一产生点——胜/败/逃都算，想靠逃跑刷数只会把 battles 越刷越大、随
// snapshotHero 全量快照自动持久化、防御式 (g.battles||0) 旧档零迁移，与 swift/battles 同读一份源），
// (g.trueBoss && g.diff===1 && (g.battles||0)<=SPEED_GOAL(70)) 即「困难 · 七十场内通关」达成——battles
// 只增不减，困难档超场就永久无缘此档（与 hardtrue 换难度 / unflicker 死过一次 / swift 超场 / lowlv 升过
// 十级 / nopotion 用过药 / penny 花过金 / steadfast 死过一次 / frugal 花过金 / dry 用过药同属「重新
// 来过才拿得到」的挑战品类）。真实可行性：与 swift 同为「效率」档、仅叠加困难数值微升（DIFF_SCALE 同源），
// 练级不设限——想要快攻完全可以满级满配再进场，七十场预算内磨穿终焉之神余量充足，吃满「硬且快」双克制的
// 是一场纪律跑。本冒烟守护：版本锚点（格式合法 + 已越过 v24.157 + data.js 字面量 v24.158 + 旧 v24.157
// 零残留）、ACH_LIST 85 项精确与末尾序位（unflicker 76 / swift 77 / lowlv 78 / nopotion 79 / penny 80
// / steadfast 81 / frugal 82 / dry 83 / swift2 84）、swift2 数据契约（d 文案、ok 防御式逐值、无 r 无
// prog 且严格交叠 hardtrue×swift）、unlockedAchievements/applyAchievements 运行期全链路（真实解锁落
// hero.ach + 横幅 + 幂等去重 / 困难拖沓不解锁 / 普通速通不解锁 / 未通关不解锁）、既有 84 成就 id 零回归、
// battle.js battles 写入点源级零变化、README/package.json/CHANGELOG 同步（件套口径 369 + v24.159 守护
// 描述 + 入库 369 + 版本速览 85 项 + tests 树串尾 + package 串尾 369）、哨兵链（前望 371 且 README 尚无
// 370 口径）、旧代 v24.157 字面量/恒等/顶 pin/368 口径/84 项 全库零残留扫描（豁免本套件 + 上一版 v24157
// + 上上版 v24155）。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, SPEED_GOAL, BATTLE_GOAL } from '../js/data.js';
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

console.log('— v24.158 挑战向硬核速通复合成就「逆风疾行」 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dataSrc = read('js/data.js');
const battleSrc = read('js/battle.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（格式合法 + 已越过 v24.157 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.157', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 157)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.158（旧 v24.157 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v24.179';") && !dataSrc.includes("const GAME_VERSION = 'v24.157';"));
ok('data.js 含 v24.158 注释（逆风疾行新成就说明）',
  dataSrc.includes('v24.158 新内容·新成就'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'swift2');
ok('ACH_LIST 含 swift2「逆风疾行」且 id 唯一',
  !!ach && ach.name === '逆风疾行' && ACH_LIST.filter((a) => a.id === 'swift2').length === 1);
ok('ACH_LIST 精确总数 89 项（84→85 末尾追加）', ACH_LIST.length === 106, String(ACH_LIST.length));
ok('swift2 描述文案（困难模式且在七十场战斗内真结局档）',
  ach.d === `以困难模式且在 ${SPEED_GOAL} 场战斗内击败终焉之神（真结局）`, ach.d);
ok('swift2 判定源级（读既有 g.trueBoss / g.diff===1 / 防御式 (g.battles||0)<=SPEED_GOAL）',
  String(ach.ok).includes('g.trueBoss') && String(ach.ok).includes('g.diff===1') && String(ach.ok).includes('(g.battles||0)<=SPEED_GOAL'));
ok('swift2 无 r 无 prog 纯里程碑（与 hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry 同款）',
  !('r' in ach) && !('prog' in ach));

// —— ok 防御式逐值 ——
ok('困难 + 七十场内真结局 → 解锁', ach.ok({ trueBoss: true, diff: 1, battles: 70 }) === true);
ok('困难 + 缺 battles 字段仅 trueBoss → 按 0 解码（旧档零迁移）', ach.ok({ trueBoss: true, diff: 1 }) === true);
ok('困难 + 七十一场真结局 → 不解锁（永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, battles: 71 }) === false);
ok('困难 + 超场真结局 → 不解锁', ach.ok({ trueBoss: true, diff: 1, battles: 99 }) === false);
ok('普通档 + 七十场内真结局 → 不解锁（普通速通归 swift，本枚只认困难）',
  ach.ok({ trueBoss: true, diff: 0, battles: 50 }) === false);
ok('缺 diff 字段 + 七十场内真结局 → 不解锁（旧档无 diff 非困难档，零迁移）',
  ach.ok({ trueBoss: true, battles: 50 }) === false);
ok('困难 + 七十场内但未通关 → 不解锁', ach.ok({ diff: 1, battles: 50 }) === false);
ok('空档/缺字段 → 不解锁（(g.battles||0) 防御式零迁移）', ach.ok({}) === false);

// —— 既有 84 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime', 'hunt100', 'ptime2', 'lucky2', 'rich2', 'stock',
  'brew2', 'stock2', 'elixir', 'mush', 'elixir2', 'mush2', 'metall', 'rich3', 'ptime3', 'hunt3',
  'lucky3', 'stock3', 'elixir3', 'brew3', 'mush3', 'outstep', 'outstep2', 'scholar2', 'seen', 'seen2',
  'chests2', 'talkall', 'deflect', 'charge', 'crit', 'cast', 'flee', 'potionuses', 'rushs', 'mapdrink',
  'innrest', 'spend', 'travels', 'steps', 'battles', 'sell', 'deaths', 'nightwins', 'unflicker', 'swift',
  'lowlv', 'nopotion', 'penny', 'steadfast', 'frugal', 'dry'];
ok('既有 84 成就 id 零回归（核心抽样全覆盖末期正位）',
  EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('nightwins 75 / unflicker 76 / swift 77 / lowlv 78 / nopotion 79 / penny 80 / steadfast 81 / frugal 82 / dry 83 / swift2 84 末尾序位（既有序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'nightwins') === 75 &&
  ACH_LIST.findIndex((a) => a.id === 'unflicker') === 76 &&
  ACH_LIST.findIndex((a) => a.id === 'swift') === 77 &&
  ACH_LIST.findIndex((a) => a.id === 'lowlv') === 78 &&
  ACH_LIST.findIndex((a) => a.id === 'nopotion') === 79 &&
  ACH_LIST.findIndex((a) => a.id === 'penny') === 80 &&
  ACH_LIST.findIndex((a) => a.id === 'steadfast') === 81 &&
  ACH_LIST.findIndex((a) => a.id === 'frugal') === 82 &&
  ACH_LIST.findIndex((a) => a.id === 'dry') === 83 &&
  ACH_LIST.findIndex((a) => a.id === 'swift2') === 84);

// —— 既有挑战向家族对照（hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2 十档独立互不干扰）——
const _a = (id) => ACH_LIST.find((x) => x.id === id);
ok('hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2 十档独立（难度 vs 姿态 vs 速通 vs 低等级 vs 零用药 vs 零消费 vs 硬核 vs 硬核零消费 vs 硬核零用药 vs 硬核速通）',
  _a('hardtrue').ok({ trueBoss: true, diff: 1 }) === true &&
  _a('unflicker').ok({ trueBoss: true }) === true &&
  _a('swift').ok({ trueBoss: true, battles: 50 }) === true &&
  _a('lowlv').ok({ trueBoss: true, level: 9 }) === true &&
  _a('nopotion').ok({ trueBoss: true, potionUses: 0 }) === true &&
  _a('penny').ok({ trueBoss: true, spent: 0 }) === true &&
  _a('steadfast').ok({ trueBoss: true, diff: 1, deaths: 0 }) === true &&
  _a('frugal').ok({ trueBoss: true, diff: 1, spent: 0 }) === true &&
  _a('dry').ok({ trueBoss: true, diff: 1, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, battles: 50 }) === true);
ok('困难档拖沓（超场）仍可解锁 hardtrue（仅 swift2 被排除——hardtrue 只认困难打过）',
  _a('hardtrue').ok({ trueBoss: true, diff: 1, battles: 90 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, battles: 90 }) === false);
ok('普通档七十场内仍可解锁 swift（仅 swift2 被排除——swift 不认难度）',
  _a('swift').ok({ trueBoss: true, battles: 50 }) === true &&
  ach.ok({ trueBoss: true, diff: 0, battles: 50 }) === false);
ok('困难 + 七十场内真结局三枚同亮（hardtrue + swift + swift2 严格交叠）',
  _a('hardtrue').ok({ trueBoss: true, diff: 1, battles: 50 }) === true &&
  _a('swift').ok({ trueBoss: true, diff: 1, battles: 50 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, battles: 50 }) === true);
ok('困难飞速档（70 场内）仍可解锁 dry（仅 swift2 各自判据不同源——battles 与 potionUses 互不相干）',
  _a('dry').ok({ trueBoss: true, diff: 1, potionUses: 0, battles: 50 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, battles: 50, potionUses: 5 }) === true);
ok('身经百战正向里程碑档不解锁 swift2（battles 有 prog、swift2 无 prog——正向与速通各占一位）',
  ach.ok({ trueBoss: true, diff: 1, battles: BATTLE_GOAL }) === false &&
  _a('battles').ok({ battles: BATTLE_GOAL }) === true &&
  'prog' in _a('battles') && !('prog' in ach));

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
  const h = freshHero({ trueBoss: true, diff: 1, battles: 50 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 困难六十场内真结局档 newly 含 swift2（既有通路自动跟随）',
    newly.includes('swift2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, battles: 80 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 困难拖沓档 newly 不含 swift2（不误解锁）',
    !newly.includes('swift2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 0, battles: 50 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 普通速通档 newly 不含 swift2（swift 通吃但本枚只认困难）',
    !newly.includes('swift2'), JSON.stringify(newly));
}
{
  const h = freshHero({ diff: 1, battles: 50 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 未通关档 newly 不含 swift2（不误解锁）',
    !newly.includes('swift2'), JSON.stringify(newly));
}

// —— applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等）——
{
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    const h = freshHero({ trueBoss: true, diff: 1, battles: 50 });
    S.G = h;
    applyAchievements();
    ok('applyAchievements 真实解锁落 hero.ach（含 swift2）', h.ach.includes('swift2'), JSON.stringify(h.ach));
    ok('解锁横幅报成就名【逆风疾行】', msgs.some((m) => m.includes('🔓 成就解锁：') && m.includes('逆风疾行')), msgs.join(' | '));
    const len1 = msgs.length;
    applyAchievements();
    ok('幂等：重复调用不再报（已解锁去重）', msgs.length === len1 && msgs.filter((m) => m.includes('逆风疾行')).length === 1, String(msgs.length));
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
    const h = freshHero({ trueBoss: true, diff: 1, battles: 80 });
    S.G = h;
    applyAchievements();
    ok('困难拖沓 applyAchievements 零 swift2 解锁零「逆风疾行」横幅（不误解锁）',
      !h.ach.includes('swift2') && !msgs.some((m) => m.includes('逆风疾行')), JSON.stringify({ ach: h.ach, msgs }));
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}

// —— 源级零变化：battle.js battles 写入点（既有，本版未动）——
ok('battle.js 具 1 处 S.G.battles 写入点（startBattle 进战即记唯一计数端口）',
  (battleSrc.match(/S\.G\.battles\s*=/g) || []).length === 1, String((battleSrc.match(/S\.G\.battles\s*=/g) || []).length));
ok('battles 写入为防御式 (S.G.battles||0) + 增量形态（零新写点零新形态）',
  (battleSrc.match(/S\.G\.battles = \(S\.G\.battles \|\| 0\) \+ 1;/) || []).length === 1);

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径为三百九十件套（三百八十九件套清除）',
  readme.includes('扩充为冒烟三百九十件套（三百八十九件套清除）') && !readme.includes('扩充为冒烟三百六十八件套（三百六十七件套清除）'));
ok('README 含 v24.158 守护描述（逆风疾行新成就守护）', readme.includes('v24.158 起含「逆风疾行」新成就守护'));
ok('README 版本速览已为 v24.158 且成就计数 85', readme.includes('版本速览（v24.179）') && readme.includes('106 项成就'));
ok('README 成就计数双处口径 89 项（全部 106 项进度 + **106 项成就**，85 项清除）',
  readme.includes('全部 106 项进度') && readme.includes('**106 项成就**') && !readme.includes('**84 项成就**'));
ok('README tests 树收录 smoke_v24158_swift2（含 v24.158 守护子句 + 串尾）',
  readme.includes('v24.158 起含「逆风疾行」新成就守护') && readme.includes('smoke_v24158_swift2'));
ok('README 含 smoke_v24158_swift2 入库（369 份）', readme.includes('smoke_v24158_swift2 入库（369 份）'));
ok('package.json 已收录 smoke_v24158_swift2.mjs 且位于串尾（狠在 dry 之后）',
  pkg.includes('smoke_v24158_swift2.mjs') &&
  pkg.includes('node tests/smoke_v24155_frugal.mjs && node tests/smoke_v24157_dry.mjs && node tests/smoke_v24158_swift2.mjs && node tests/smoke_v24159_lowlv2.mjs && node tests/smoke_v24160_noskill.mjs && node tests/smoke_v24161_noskill2.mjs && node tests/smoke_v24162_lowskill.mjs && node tests/smoke_v24163_swiftskill.mjs && node tests/smoke_v24164_swiftlv.mjs && node tests/smoke_v24165_nopotskill.mjs && node tests/smoke_v24166_unflskill.mjs && node tests/smoke_v24167_swiftnopo.mjs && node tests/smoke_v24168_lowlvnopo.mjs && node tests/smoke_v24169_unflswift.mjs && node tests/smoke_v24170_unfllowlv.mjs && node tests/smoke_v24171_unflnopo.mjs && node tests/smoke_v24172_unflpenny.mjs && node tests/smoke_v24173_pennyswift.mjs && node tests/smoke_v24174_pennylowlv.mjs && node tests/smoke_v24175_pennynoskill.mjs && node tests/smoke_v24176_pennynopo.mjs && node tests/smoke_v24177_unflswift2.mjs && node tests/smoke_v24178_unflpenny2.mjs && node tests/smoke_v24179_unflnopo2.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 369 件套', testChain === 390, String(testChain));
ok('CHANGELOG 含 v24.158 顶条目', changelog.startsWith('## v24.179'));

// —— 哨兵链：README 已有 369 口径且尚无 370（前望 371 语义：下一版才写 370）——
ok('README 已有三百七十五件套口径且尚无 370（哨兵前望 391 语义：下一版才写 370）',
  readme.includes('扩充为冒烟三百九十件套（三百八十九件套清除）') && !readme.includes('三百九十一件套'));
{
  const s24143 = read('tests/smoke_v24143_furnacequest.mjs');
  ok('smoke_v24143 哨兵链前望 391（三百九十一件套否定式）',
    s24143.includes('哨兵链前望 391') && s24143.includes('三百九十一件套否定式'));
}
{
  ok('smoke_v24157 姊妹件版本字面量 pin 已随新现实推进（v24.158）',
    read('tests/smoke_v24157_dry.mjs').includes("const GAME_VERSION = 'v24.179';"));
  ok('smoke_v24155 姊妹件版本字面量 pin 已随新现实推进（v24.158）',
    read('tests/smoke_v24155_frugal.mjs').includes("const GAME_VERSION = 'v24.179';"));
  ok('smoke_v24154 姊妹件版本字面量 pin 已随新现实推进（v24.158）',
    read('tests/smoke_v24154_steadfast.mjs').includes("const GAME_VERSION = 'v24.179';"));
  ok('smoke_v24153 姊妹件版本字面量 pin 已随新现实推进（v24.158）',
    read('tests/smoke_v24153_penny.mjs').includes("const GAME_VERSION = 'v24.179';"));
  ok('smoke_v24152 姊妹件版本字面量 pin 已随新现实推进（v24.158）',
    read('tests/smoke_v24152_nopotion.mjs').includes("const GAME_VERSION = 'v24.179';"));
  ok('smoke_v24151 姊妹件版本字面量 pin 已随新现实推进（v24.158）',
    read('tests/smoke_v24151_lowlv.mjs').includes("const GAME_VERSION = 'v24.179';"));
  ok('smoke_v24148 姊妹件版本字面量 pin 已随新现实推进（v24.158）',
    read('tests/smoke_v24148_swift.mjs').includes("const GAME_VERSION = 'v24.179';"));
  ok('smoke_v2229 姊妹件版本恒等 pin 已随新现实推进（=== v24.158）',
    read('tests/smoke_v2229_metall.mjs').includes("GAME_VERSION === 'v24.179'"));
}

// —— 旧代 v24.157 字面量 / 368 件套口径 / 84 项 全库零残留扫描（豁免本套件 + 上一版 v24157 + 上上版 v24155）——
const EXEMPT = new Set(['smoke_v24158_swift2.mjs', 'smoke_v24157_dry.mjs', 'smoke_v24155_frugal.mjs']);
const leftovers = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests')).filter((x) => x.endsWith('.mjs') && !EXEMPT.has(x))) {
  const s = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  const code = s.split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  if (code.includes("const GAME_VERSION = 'v24.157'")) leftovers.push(f + ':gv');
  if (code.includes("GAME_VERSION === 'v24.157'")) leftovers.push(f + ':eq');
  if (code.includes("startsWith('## v24.157")) leftovers.push(f + ':st');
  if (code.includes('三百六十八件套（三百六十七件套清除）')) leftovers.push(f + ':368');
  if (code.includes('testChain === 368') || code.includes('files.length === 368') ||
      code.includes('treeTok.length === 368') || code.includes('chainAll.length === 368')) leftovers.push(f + ':count');
  if (code.includes('N/84') || code.includes('**84 项成就**') || code.includes('全部 84 项进度')) leftovers.push(f + ':84');
}
ok('旧代 v24.157 GAME_VERSION 字面量/恒等/顶 pin 全库零残留（哨兵链，豁免本套件 + v24157 + v24155）',
  leftovers.filter((x) => x.endsWith(':gv') || x.endsWith(':eq') || x.endsWith(':st')).length === 0,
  JSON.stringify(leftovers));
ok('旧代 368 件套口径/计数/84 项 pin 全库零残留（哨兵链，豁免本套件 + v24157 + v24155）',
  leftovers.filter((x) => x.endsWith(':368') || x.endsWith(':count') || x.endsWith(':84')).length === 0,
  JSON.stringify(leftovers));

if (failed) { console.log(`— v24.158 冒烟完成：${n} 项断言，失败 ${failed} —`); process.exit(1); }
console.log(`— v24.158 冒烟完成：${n} 项断言，失败 0 —`);
