// smoke_v24164_swiftlv.mjs —— v24.163 专项冒烟：新成就「踏雪无痕」（挑战向双克制交叉档·速通×零用技）
// （新内容·单成就——承 v24.162 素手青灯（lowskill）/ v24.161 逆风守拙（noskill2）/ v24.160 大巧不工（noskill）
// / v24.159 逆风青芽（lowlv2）/ v24.158 逆风疾行（swift2）/ v24.157 滴药未沾（dry）/ v24.155 两袖清风（frugal）
// / v24.154 逆风不灭（steadfast）/ v24.153 白手成灯（penny）/ v24.152 药囊未启（nopotion）/ v24.151 未及十级（lowlv）
// / v24.148 速战速决（swift）/ v24.147 未曾熄灯（unflicker）/ v23.68 逆风行灯（hardtrue）先例：「以怎样的姿态通关」
// 挑战维度第十四次开垦——v24.162 首开「姿态 × 姿态」普通交叉区（未及十级×零用技 = 素手青灯），交叉区至此仍只
// 有一枚纪念，其余「姿态 × 姿态」两两组合在成就一览毫无分别：swift「速战速决」只认「七十场内」、noskill「大巧
// 不工」只认「零用技」（都是普通/困难通吃），两者交叉的「七十场内 + 零用技」硬核档与分开的两枚拿到的是同一枚
// 速战速决（或大巧不工）。判定读既有 hero.trueBoss（终焉之神=真结局最终 Boss，与 trueboss/hardtrue/unflicker/
// swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill 同源）、既有
// hero.battles（battle.startBattle 进战即记唯一产生点——胜/败/逃都算、随 snapshotHero 全量快照自动持久化、
// 防御式 (g.battles||0) 旧档零迁移，与 swift/swift2/battles「身经百战」同读一份源）与既有 hero.casts
// （battle.doSkill [2]技能释放成功唯一产生点——治愈与伤害两分支都计、随 snapshotHero 全量快照自动持久化、防御式
// (g.casts||0) 旧档零迁移，与 cast「熟能生巧」/side_song「战歌的谱」/noskill/noskill2/lowskill 同读一份源），
// (g.trueBoss && (g.battles||0)<=SPEED_GOAL && !(g.casts||0)) 即「七十场内 · 零用技通关」达成——battles 与
// casts 都只增不减，超场或放过一个技能就永久无缘此档（与 hardtrue 换难度 / unflicker 死过一次 / swift 超场 /
// lowlv 升过十级 / nopotion 用过药 / penny 花过金 / steadfast 死过一次 / frugal 花过金 / dry 用过药 / swift2 超场 /
// lowlv2 升过十级 / noskill 用过技 / lowskill 升过十级或放过技同属「重新来过才拿得到」的挑战品类）；是 swift 与
// noskill 两枚的严格交叠——七十场内零用技通关必同时满足二者，本枚是这一交叉区的唯一纪念（难度通吃：普通档与
// 困难档同义、不读 diff）；与既有正向里程碑 cast「熟能生巧」成镜面对、互不重叠——一个纪念「用满 N 次技能」、
// 一个纪念「疾速的大巧若拙」。可行性：与 noskill 同为「克制」档、仅叠加七十场红线（随机遇敌/支线/宝箱照打照
// 开、普通通关本就常年在 40-60 场内，预算余量充足），[1]普攻/[4]防御回蓝（v19.96）/[5]蓄力/[3]用药四路都不碰
// casts，药水管够的普攻蓄力流依旧可行——吃满「既快又不用技」双克制的是一场纪律跑。零新计数零新状态零新写点零新
// 存档（trueBoss/battles/casts 皆既有字段）、无 r 无 prog 纯里程碑（与 hardtrue/unflicker/swift/lowlv/nopotion/
// penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill 同款——快而不技本身就是奖励、硬核才是）、
// 解锁走 winBattle → applyAchievements 既有通路（终焉之神击败当场 trueBoss 落账后 applyAchievements 枚举即解锁，
// 与 trueboss/hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/
// noskill2/lowskill 同路径零新增依赖），反馈不迟到。
// 本冒烟守护：版本锚点（格式合法 + 已越过 v24.162 + data.js 字面量 v24.163 + 旧 v24.162 零残留）、
// ACH_LIST 90 项精确与末尾序位（unflicker 76 / swift 77 / lowlv 78 / nopotion 79 / penny 80 / steadfast 81 /
// frugal 82 / dry 83 / swift2 84 / lowlv2 85 / noskill 86 / noskill2 87 / lowskill 88 / swiftskill 89）、
// swiftskill 数据契约（d 文案、ok 防御式逐值、无 r 无 prog 且与 cast 正向里程碑镜面对）、unlockedAchievements/
// applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等去重 / 超场不解锁 / 用过技不解锁 / 未通关
// 不解锁）、既有 89 成就 id 零回归、hero.js casts 写入点与 data.js SPEED_GOAL/CAST_GOAL 常量源级零变化、
// README/package.json/CHANGELOG 同步（件套口径 374 + v24.163 守护描述 + 入库 374 + 版本速览 90 项 + tests 树
// 串尾 + package 串尾 374）、哨兵链（前望 376 且 README 尚无 374 口径）、旧代 v24.162 字面量/恒等/顶 pin/373 口径/
// 89 项 全库零残留扫描（豁免本套件 + 上一版 v24162 + 上上版 v24161）。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, CAST_GOAL, SPEED_GOAL } from '../js/data.js';
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

console.log('— v24.163 挑战向双克制交叉档成就「踏雪无痕」 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dataSrc = read('js/data.js');
const battleSrc = read('js/battle.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（格式合法 + 已越过 v24.162 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.162', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 162)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.163（旧 v24.162 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v24.172';") && !dataSrc.includes("const GAME_VERSION = 'v24.162';"));
ok('data.js 含 v24.163 注释（踏雪无痕新成就说明）',
  dataSrc.includes('v24.163 新内容·新成就'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'swiftskill');
ok('ACH_LIST 含 swiftskill「踏雪无痕」且 id 唯一',
  !!ach && ach.name === '踏雪无痕' && ACH_LIST.filter((a) => a.id === 'swiftskill').length === 1);
ok('ACH_LIST 精确总数 90 项（89→90 末尾追加）', ACH_LIST.length === 99, String(ACH_LIST.length));
ok('swiftskill 描述文案（七十场内零用技真结局交叉档）',
  ach.d === '七十场战斗内且未使用任何技能（战斗指令 [2]）击败终焉之神（真结局）', ach.d);
ok('swiftskill 判定源级（读既有 g.trueBoss / (g.battles||0)<=SPEED_GOAL / 防御式 !(g.casts||0)）',
  String(ach.ok).includes('g.trueBoss') && String(ach.ok).includes('SPEED_GOAL') && String(ach.ok).includes('!(g.casts||0)'));
ok('swiftskill 无 r 无 prog 纯里程碑（与 hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill 同款）',
  !('r' in ach) && !('prog' in ach));

// —— ok 防御式逐值 ——
ok('七十场内 + 真结局 + 零用技 → 解锁', ach.ok({ trueBoss: true, battles: 70, casts: 0 }) === true);
ok('七十场内 + 真结局 + 缺 battles 字段 → 按 0 解码解锁（旧档零迁移）', ach.ok({ trueBoss: true, casts: 0 }) === true);
ok('七十场内 + 真结局 + 缺 casts 字段 → 按 0 解码解锁（旧档零迁移）', ach.ok({ trueBoss: true, battles: 70 }) === true);
ok('七十场内 + 真结局 + 放过 1 次技 → 不解锁（永久无缘此档）', ach.ok({ trueBoss: true, battles: 70, casts: 1 }) === false);
ok('七十场内 + 真结局 + 放过 N 次技 → 不解锁', ach.ok({ trueBoss: true, battles: 70, casts: CAST_GOAL }) === false);
ok('超 70 场 + 零用技 → 不解锁（本档只认七十场内）', ach.ok({ trueBoss: true, battles: 71, casts: 0 }) === false);
ok('七十场内 + 零用技但未通关 → 不解锁', ach.ok({ battles: 70, casts: 0 }) === false);
ok('空档/缺字段 → 不解锁（(g.battles||0) 与 (g.casts||0) 防御式零迁移）', ach.ok({}) === false);

// —— 既有 89 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime', 'hunt100', 'ptime2', 'lucky2', 'rich2', 'stock',
  'brew2', 'stock2', 'elixir', 'mush', 'elixir2', 'mush2', 'metall', 'rich3', 'ptime3', 'hunt3',
  'lucky3', 'stock3', 'elixir3', 'brew3', 'mush3', 'outstep', 'outstep2', 'scholar2', 'seen', 'seen2',
  'chests2', 'talkall', 'deflect', 'charge', 'crit', 'cast', 'flee', 'potionuses', 'rushs', 'mapdrink',
  'innrest', 'spend', 'travels', 'steps', 'battles', 'sell', 'deaths', 'nightwins', 'unflicker', 'swift',
  'lowlv', 'nopotion', 'penny', 'steadfast', 'frugal', 'dry', 'swift2', 'lowlv2', 'noskill', 'noskill2',
  'lowskill', 'swiftskill'];
ok('既有 89 成就 id 零回归（核心抽样全覆盖末期正位）',
  EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('nightwins 75 / unflicker 76 / swift 77 / lowlv 78 / nopotion 79 / penny 80 / steadfast 81 / frugal 82 / dry 83 / swift2 84 / lowlv2 85 / noskill 86 / noskill2 87 / lowskill 88 / swiftskill 89 末尾序位（既有序位零位移）',
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
  ACH_LIST.findIndex((a) => a.id === 'lowlv2') === 85 &&
  ACH_LIST.findIndex((a) => a.id === 'noskill') === 86 &&
  ACH_LIST.findIndex((a) => a.id === 'noskill2') === 87 &&
  ACH_LIST.findIndex((a) => a.id === 'lowskill') === 88 &&
  ACH_LIST.findIndex((a) => a.id === 'swiftskill') === 89);

// —— 既有挑战向家族对照（hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill 十五档独立互不干扰）——
const _a = (id) => ACH_LIST.find((x) => x.id === id);
ok('hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill 十五档独立（难度 vs 姿态 vs 速通 vs 低等级 vs 零用药 vs 零消费 vs 零阵亡 vs 硬核复合六态 vs 零用技 vs 交叉区两态）',
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
  _a('lowlv2').ok({ trueBoss: true, diff: 1, level: 9 }) === true &&
  _a('noskill').ok({ trueBoss: true, casts: 0 }) === true &&
  _a('noskill2').ok({ trueBoss: true, diff: 1, casts: 0 }) === true &&
  _a('lowskill').ok({ trueBoss: true, level: 9, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, battles: 70, casts: 0 }) === true);
ok('速通×零用技交叉档必同时满足 swift 与 noskill（本枚是其交叉区唯一纪念——battles 与 casts 双源同判）',
  _a('swift').ok({ trueBoss: true, battles: 70, casts: 0 }) === true &&
  _a('noskill').ok({ trueBoss: true, battles: 70, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, battles: 70, casts: 0 }) === true);
ok('超场 + 零用技 → swiftskill 与 swift 同不解锁（battles 严格分区——超场即永久无缘）',
  _a('swift').ok({ trueBoss: true, battles: 71, casts: 0 }) === false &&
  _a('noskill').ok({ trueBoss: true, battles: 71, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, battles: 71, casts: 0 }) === false);
ok('七十场内 + 用过技 → swiftskill 与 noskill 同不解锁（casts 严格分区——放过技即永久无缘）',
  _a('noskill').ok({ trueBoss: true, battles: 70, casts: 1 }) === false &&
  _a('swift').ok({ trueBoss: true, battles: 70, casts: 1 }) === true &&
  ach.ok({ trueBoss: true, battles: 70, casts: 1 }) === false);
ok('困难 + 七十场内 + 零用技也解锁 swiftskill（本档难度通吃——与 swift/noskill/lowskill 同不读 diff）',
  ach.ok({ trueBoss: true, diff: 1, battles: 70, casts: 0 }) === true);
ok('困难 + 七十场内 + 用过技：swift2 亮而 swiftskill 不亮（难度复合档与双克制档分源互不干扰）',
  _a('swift2').ok({ trueBoss: true, diff: 1, battles: 70, casts: 3 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, battles: 70, casts: 3 }) === false);
ok('困难 + 零用技 + 超场：noskill2 亮而 swiftskill 不亮（难度×零技档与双克制档分源互不干扰）',
  _a('noskill2').ok({ trueBoss: true, diff: 1, battles: 90, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, battles: 90, casts: 0 }) === false);
ok('未及十级 + 零用技 + 七十场内：lowskill 亮而 swiftskill 不亮（交叉区两态分源互不干扰）',
  _a('lowskill').ok({ trueBoss: true, level: 9, battles: 70, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, level: 9, battles: 70, casts: 0 }) === true &&
  _a('lowlv2').ok({ trueBoss: true, diff: 1, level: 9, battles: 70, casts: 0 }) === true);
ok('cast 正向里程碑档不解锁 swiftskill（casts 达 CAST_GOAL 正向纪念、swiftskill 无 prog——正向与零用技各占一位）',
  ach.ok({ trueBoss: true, battles: 70, casts: CAST_GOAL }) === false &&
  _a('cast').ok({ casts: CAST_GOAL }) === true &&
  'prog' in _a('cast') && !('prog' in ach));

// —— unlockedAchievements 集成 ——
function freshHero(extra) {
  return Object.assign({ name: '余烬', level: 9, gold: 123, xp: 0, xpNext: 20, hp: 50, hpMax: 50, mp: 20, mpMax: 20,
    item: 3, potion2: 1, mushrooms: 2, weapon: '铁剑', armor: '皮甲', atkMax: 12, defMax: 6,
    map: 'village', x: 8, y: 8, time: 0, ach: [], bestiary: {}, seen: {}, fragments: [], visited: ['village'],
    quests: {}, totalWins: 3, drops: 0, steps: 0, travels: 0, spent: 0, battles: 3, skills: [], talked: [],
    checks: 0, crits: 0, casts: 0, flees: 0, potionUses: 0, deflects: 0, charges: 0, sleep: 0,
    sold: 0, dealt: 0, mapPotions: 0, innRests: 0, nightWins: 0, rushClears: 0, brews: 0, chests: [],
    deaths: 0, diff: 0 }, extra);
}
{
  const h = freshHero({ trueBoss: true, battles: 70, casts: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 七十场内零用技真结局档 newly 含 swiftskill（既有通路自动跟随）',
    newly.includes('swiftskill'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, battles: 70, casts: 2 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 七十场内档用过技 newly 不含 swiftskill（不误解锁）',
    !newly.includes('swiftskill'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, battles: 71, casts: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 零用技档超场 newly 不含 swiftskill（不误解锁，场次维严格）',
    !newly.includes('swiftskill'), JSON.stringify(newly));
}
{
  const h = freshHero({ battles: 70, casts: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 未通关档 newly 不含 swiftskill（不误解锁）',
    !newly.includes('swiftskill'), JSON.stringify(newly));
}

// —— applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等）——
{
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    const h = freshHero({ trueBoss: true, battles: 70, casts: 0 });
    S.G = h;
    applyAchievements();
    ok('applyAchievements 真实解锁落 hero.ach（含 swiftskill）', h.ach.includes('swiftskill'), JSON.stringify(h.ach));
    ok('解锁横幅报成就名【踏雪无痕】', msgs.some((m) => m.includes('🔓 成就解锁：') && m.includes('踏雪无痕')), msgs.join(' | '));
    const len1 = msgs.length;
    applyAchievements();
    ok('幂等：重复调用不再报（已解锁去重）', msgs.length === len1 && msgs.filter((m) => m.includes('踏雪无痕')).length === 1, String(msgs.length));
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
    const h = freshHero({ trueBoss: true, battles: 70, casts: 3 });
    S.G = h;
    applyAchievements();
    ok('七十场内但用过技 applyAchievements 零 swiftskill 解锁零「踏雪无痕」横幅（不误解锁）',
      !h.ach.includes('swiftskill') && !msgs.some((m) => m.includes('踏雪无痕')), JSON.stringify({ ach: h.ach, msgs }));
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}

// —— 源级零变化：battle.js casts 写入点与 data.js CAST_GOAL/SPEED_GOAL 常量（既有，本版未动）——
ok('battle.js 具 1 处 hero.casts = castN 写入点（doSkill 释放成功唯一产生点）',
  (battleSrc.match(/hero\.casts = castN;/g) || []).length === 1, String((battleSrc.match(/hero\.casts = castN;/g) || []).length));
ok('data.js CAST_GOAL 常量仍为 30（单一数据源，与 cast/side_song 同读一份源）',
  dataSrc.includes('const CAST_GOAL = 30;'));
ok('data.js SPEED_GOAL 常量仍为 70（单一数据源，与 swift/swift2 同读一份源）',
  dataSrc.includes('const SPEED_GOAL = 70;'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径为三百八十三件套（三百八十二件套清除）',
  readme.includes('扩充为冒烟三百八十三件套（三百八十二件套清除）') && !readme.includes('扩充为冒烟三百七十三件套（三百七十二件套清除）'));
ok('README 含 v24.163 守护描述（踏雪无痕新成就守护）', readme.includes('v24.163 起含「踏雪无痕」新成就守护'));
ok('README 版本速览已为 v24.163 且成就计数 90', readme.includes('版本速览（v24.172）') && readme.includes('99 项成就'));
ok('README 成就计数双处口径 90 项（全部 99 项进度 + **99 项成就**，89 项清除）',
  readme.includes('全部 99 项进度') && readme.includes('**99 项成就**') && !readme.includes('**89 项成就**'));
ok('README tests 树收录 smoke_v24163_swiftskill（含 v24.163 守护子句 + 串尾）',
  readme.includes('v24.163 起含「踏雪无痕」新成就守护') && readme.includes('smoke_v24163_swiftskill'));
ok('README 含 smoke_v24163_swiftskill 入库（374 份）', readme.includes('smoke_v24163_swiftskill 入库（374 份）'));
ok('package.json 已收录 smoke_v24164_swiftlv.mjs 且位于串尾（在 lowskill 之后）',
  pkg.includes('smoke_v24164_swiftlv.mjs') &&
  pkg.includes('node tests/smoke_v24162_lowskill.mjs && node tests/smoke_v24163_swiftskill.mjs && node tests/smoke_v24164_swiftlv.mjs && node tests/smoke_v24165_nopotskill.mjs && node tests/smoke_v24166_unflskill.mjs && node tests/smoke_v24167_swiftnopo.mjs && node tests/smoke_v24168_lowlvnopo.mjs && node tests/smoke_v24169_unflswift.mjs && node tests/smoke_v24170_unfllowlv.mjs && node tests/smoke_v24171_unflnopo.mjs && node tests/smoke_v24172_unflpenny.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 374 件套', testChain === 383, String(testChain));
ok('CHANGELOG 含 v24.163 顶条目', changelog.startsWith('## v24.172'));

// —— 哨兵链：README 已有 374 口径且尚无 375（前望 376 语义：下一版才写 375）——
ok('README 已有三百七十五件套口径且尚无 376（哨兵前望 384 语义：下一版才写 375）',
  readme.includes('扩充为冒烟三百八十三件套（三百八十二件套清除）') && !readme.includes('三百八十四件套'));
{
  const s24143 = read('tests/smoke_v24143_furnacequest.mjs');
  ok('smoke_v24143 哨兵链前望 384（三百八十四件套否定式）',
    s24143.includes('哨兵链前望 384') && s24143.includes('三百八十四件套否定式'));
}
{
  ok('smoke_v24162 姊妹件版本字面量 pin 已随新现实推进（v24.163）',
    read('tests/smoke_v24162_lowskill.mjs').includes("const GAME_VERSION = 'v24.172';"));
  ok('smoke_v24161 姊妹件版本字面量 pin 已随新现实推进（v24.163）',
    read('tests/smoke_v24161_noskill2.mjs').includes("const GAME_VERSION = 'v24.172';"));
  ok('smoke_v24160 姊妹件版本字面量 pin 已随新现实推进（v24.163）',
    read('tests/smoke_v24160_noskill.mjs').includes("const GAME_VERSION = 'v24.172';"));
  ok('smoke_v24159 姊妹件版本字面量 pin 已随新现实推进（v24.163）',
    read('tests/smoke_v24159_lowlv2.mjs').includes("const GAME_VERSION = 'v24.172';"));
  ok('smoke_v24158 姊妹件版本字面量 pin 已随新现实推进（v24.163）',
    read('tests/smoke_v24158_swift2.mjs').includes("const GAME_VERSION = 'v24.172';"));
  ok('smoke_v24157 姊妹件版本字面量 pin 已随新现实推进（v24.163）',
    read('tests/smoke_v24157_dry.mjs').includes("const GAME_VERSION = 'v24.172';"));
  ok('smoke_v2229 姊妹件版本恒等 pin 已随新现实推进（=== v24.163）',
    read('tests/smoke_v2229_metall.mjs').includes("GAME_VERSION === 'v24.172'"));
}

// —— 旧代 v24.162 字面量 / 373 件套口径 / 89 项 全库零残留扫描（豁免本套件 + 上一版 v24162 + 上上版 v24161）——
const EXEMPT = new Set(['smoke_v24163_swiftskill.mjs', 'smoke_v24162_lowskill.mjs', 'smoke_v24161_noskill2.mjs']);
const leftovers = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests')).filter((x) => x.endsWith('.mjs') && !EXEMPT.has(x))) {
  const s = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  const code = s.split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  if (code.includes("const GAME_VERSION = 'v24.162'")) leftovers.push(f + ':gv');
  if (code.includes("GAME_VERSION === 'v24.162'")) leftovers.push(f + ':eq');
  if (code.includes("startsWith('## v24.162")) leftovers.push(f + ':st');
  if (code.includes('三百七十三件套（三百七十二件套清除）')) leftovers.push(f + ':373');
  if (code.includes('testChain === 373') || code.includes('files.length === 373') ||
      code.includes('treeTok.length === 373') || code.includes('chainAll.length === 373') ||
      code.includes('fileCount === 373')) leftovers.push(f + ':count');
  if (code.includes('N/89') || code.includes('**89 项成就**') || code.includes('全部 89 项进度')) leftovers.push(f + ':89');
}
ok('旧代 v24.162 GAME_VERSION 字面量/恒等/顶 pin 全库零残留（哨兵链，豁免本套件 + v24162 + v24161）',
  leftovers.filter((x) => x.endsWith(':gv') || x.endsWith(':eq') || x.endsWith(':st')).length === 0,
  JSON.stringify(leftovers));
ok('旧代 373 件套口径/计数/89 项 pin 全库零残留（哨兵链，豁免本套件 + v24162 + v24161）',
  leftovers.filter((x) => x.endsWith(':373') || x.endsWith(':count') || x.endsWith(':89')).length === 0,
  JSON.stringify(leftovers));

if (failed) { console.log(`— v24.163 冒烟完成：${n} 项断言，失败 ${failed} —`); process.exit(1); }
console.log(`— v24.163 冒烟完成：${n} 项断言，失败 0 —`);
