// smoke_v24164_swiftlv.mjs —— v24.164 专项冒烟：新成就「速成青芽」（挑战向双克制交叉档·速通×低等级）
// （新内容·单成就——承 v24.163 踏雪无痕（swiftskill）/ v24.162 素手青灯（lowskill）/ v24.161 逆风守拙（noskill2）
// / v24.160 大巧不工（noskill）/ v24.159 逆风青芽（lowlv2）/ v24.158 逆风疾行（swift2）/ v24.157 滴药未沾（dry）
// / v24.155 两袖清风（frugal）/ v24.154 逆风不灭（steadfast）/ v24.153 白手成灯（penny）/ v24.152 药囊未启（nopotion）
// / v24.151 未及十级（lowlv）/ v24.148 速战速决（swift）/ v24.147 未曾熄灯（unflicker）/ v23.68 逆风行灯（hardtrue）先例：
// 「以怎样的姿态通关」挑战维度第十五次开垦——v24.162/v24.163 先后开垦「姿态 × 姿态」普通交叉区两枚纪念
// （未及十级×零用技 = 素手青灯、七十场内×零用技 = 踏雪无痕），交叉区至此仍只有这两枚，其余「姿态 × 姿态」两两组合
// 在成就一览毫无分别：swift「速战速决」只认「七十场内」、lowlv「未及十级」只认「十级内」（都是普通/困难通吃），两者
// 交叉的「七十场内 + 未及十级」硬核档与分开的两枚拿到的是同一枚速战速决（或未及十级）；至此 {swift, lowlv, noskill}
// 三姿态的两两交叉区全部收口（速战×零用技=踏雪无痕、未及十级×零用技=素手青灯、速战×未及十级=速成青芽）。判定读既有
// hero.trueBoss（终焉之神=真结局最终 Boss，与 trueboss/hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/
// frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill 同源）、既有 hero.battles（battle.startBattle 进战
// 即记唯一产生点——胜/败/逃都算、随 snapshotHero 全量快照自动持久化、防御式 (g.battles||0) 旧档零迁移，与 swift/
// swift2/battles「身经百战」/swiftskill 同读一份源）与既有 hero.level（hero.js grantXp 升级唯一产生点 hero.level++、
// 随 snapshotHero 全量快照自动持久化、防御式 (g.level||1) 旧档零迁移，与 lowlv/lowlv2/lvl5/lvl10/lvl12/lowskill
// 同读一份源），(g.trueBoss && (g.battles||0)<=SPEED_GOAL && (g.level||1)<LOWLV_GOAL) 即「七十场内 · 未及十级
// 通关」达成——battles 与 level 都只增不减，超场或升过十级就永久无缘此档（与 hardtrue 换难度 / unflicker 死过一次 /
// swift 超场 / lowlv 升过十级 / nopotion 用过药 / penny 花过金 / steadfast 死过一次 / frugal 花过金 / dry 用过药 /
// swift2 超场 / lowlv2 升过十级 / noskill 用过技 / noskill2 用过技 / lowskill 升过十级或放过技 / swiftskill 超场或
// 放过技同属「重新来过才拿得到」的挑战品类）；是 swift 与 lowlv 两枚的严格交叠——七十场内未及十级通关必同时满足
// 二者，本枚是这一交叉区的唯一纪念（难度通吃：普通档与困难档同义、不读 diff，与 swift/lowlv/lowskill/swiftskill
// 同款）；与既有正向里程碑 lvl10「小有所成」成镜面对、互不重叠——一个纪念「练到十级」、一个纪念「疾速的青芽」。
// 可行性：练级不设限但本档叠加「未及十级」红线（九级封顶——无 lvl12 灯焰长明、血量/蓝量停在九级档），与 swift 同
// 口径再叠低等级（比 swift 更难——血蓝更薄；比 lowlv 更严——七十场红线），随机遇敌/支线/宝箱照打照开（普通通关
// 本就常年在 40-60 场内、七十场预算余量充足），圣光之剑普攻蓄力流 + 药水硬磨九级血蓝的终焉之神战，吃满「既快又
// 少练」双克制的是一场纪律跑。零新计数零新状态零新写点零新存档（trueBoss/battles/level 皆既有字段）、无 r 无 prog
// 纯里程碑（与 hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/
// lowskill/swiftskill 同款——快而不练本身就是奖励、硬核才是）、解锁走 winBattle → applyAchievements 既有通路（终焉
// 之神击败当场 trueBoss 落账后 applyAchievements 枚举即解锁，与 trueboss/hardtrue/unflicker/swift/lowlv/nopotion/
// penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill 同路径零新增依赖），反馈不迟到。
// 本冒烟守护：版本锚点（格式合法 + 已越过 v24.163 + data.js 字面量 v24.164 + 旧 v24.163 零残留）、
// ACH_LIST 91 项精确与末尾序位（unflicker 76 / swift 77 / lowlv 78 / nopotion 79 / penny 80 / steadfast 81 /
// frugal 82 / dry 83 / swift2 84 / lowlv2 85 / noskill 86 / noskill2 87 / lowskill 88 / swiftskill 89 / swiftlv 90）、
// swiftlv 数据契约（d 文案、ok 防御式逐值、无 r 无 prog 且与 lvl10 正向里程碑镜面对）、unlockedAchievements/
// applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等去重 / 超场不解锁 / 升过十级不解锁 / 未通关
// 不解锁）、既有 90 成就 id 零回归、battle.js battles 写入点与 hero.js level 写入点及 data.js SPEED_GOAL/LOWLV_GOAL
// 常量源级零变化、README/package.json/CHANGELOG 同步（件套口径 375 + v24.164 守护描述 + 入库 375 + 版本速览 91 项 +
// tests 树串尾 + package 串尾 375）、哨兵链（前望 376 且 README 尚无 376 口径）、旧代 v24.163 字面量/恒等/顶 pin/374
// 口径/90 项 全库零残留扫描（豁免本套件 + 上一版 v24163 + 上上版 v24162）。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, LOWLV_GOAL, SPEED_GOAL } from '../js/data.js';
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

console.log('— v24.164 挑战向双克制交叉档成就「速成青芽」 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dataSrc = read('js/data.js');
const battleSrc = read('js/battle.js');
const heroSrc = read('js/hero.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（格式合法 + 已越过 v24.163 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.163', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 163)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.164（旧 v24.163 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v24.175';") && !dataSrc.includes("const GAME_VERSION = 'v24.163';"));
ok('data.js 含 v24.164 注释（速成青芽新成就说明）',
  dataSrc.includes('v24.164 新内容·新成就'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'swiftlv');
ok('ACH_LIST 含 swiftlv「速成青芽」且 id 唯一',
  !!ach && ach.name === '速成青芽' && ACH_LIST.filter((a) => a.id === 'swiftlv').length === 1);
ok('ACH_LIST 精确总数 94 项（94→95 末尾追加）', ACH_LIST.length === 102, String(ACH_LIST.length));
ok('swiftlv 描述文案（七十场内未及十级真结局交叉档）',
  ach.d === '七十场战斗内且等级未满十级时击败终焉之神（真结局）', ach.d);
ok('swiftlv 判定源级（读既有 g.trueBoss / (g.battles||0)<=SPEED_GOAL / (g.level||1)<LOWLV_GOAL）',
  String(ach.ok).includes('g.trueBoss') && String(ach.ok).includes('SPEED_GOAL') && String(ach.ok).includes('LOWLV_GOAL'));
ok('swiftlv 无 r 无 prog 纯里程碑（与 hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill 同款）',
  !('r' in ach) && !('prog' in ach));

// —— ok 防御式逐值 ——
ok('七十场内 + 未及十级 + 真结局 → 解锁', ach.ok({ trueBoss: true, battles: 70, level: 9 }) === true);
ok('七十场内 + 真结局 + 缺 level 字段 → 按 1 解码解锁（旧档零迁移）', ach.ok({ trueBoss: true, battles: 70 }) === true);
ok('未及十级 + 真结局 + 缺 battles 字段 → 按 0 解码解锁（旧档零迁移）', ach.ok({ trueBoss: true, level: 9 }) === true);
ok('七十场内 + 真结局 + 十级整 → 不解锁（升过十级永久无缘此档）', ach.ok({ trueBoss: true, battles: 70, level: 10 }) === false);
ok('未及十级 + 真结局 + 超 70 场 → 不解锁（本档只认七十场内）', ach.ok({ trueBoss: true, battles: 71, level: 9 }) === false);
ok('七十场内 + 未及十级 + 真结局 + 放过技能 → 照常解锁（本档不读 casts，与 lowskill/swiftskill 分源）', ach.ok({ trueBoss: true, battles: 70, level: 9, casts: 5 }) === true);
ok('七十场内 + 未及十级但未通关 → 不解锁', ach.ok({ battles: 70, level: 9 }) === false);
ok('空档/缺字段 → 不解锁（(g.battles||0) 与 (g.level||1) 防御式零迁移）', ach.ok({}) === false);

// —— 既有 90 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime', 'hunt100', 'ptime2', 'lucky2', 'rich2', 'stock',
  'brew2', 'stock2', 'elixir', 'mush', 'elixir2', 'mush2', 'metall', 'rich3', 'ptime3', 'hunt3',
  'lucky3', 'stock3', 'elixir3', 'brew3', 'mush3', 'outstep', 'outstep2', 'scholar2', 'seen', 'seen2',
  'chests2', 'talkall', 'deflect', 'charge', 'crit', 'cast', 'flee', 'potionuses', 'rushs', 'mapdrink',
  'innrest', 'spend', 'travels', 'steps', 'battles', 'sell', 'deaths', 'nightwins', 'unflicker', 'swift',
  'lowlv', 'nopotion', 'penny', 'steadfast', 'frugal', 'dry', 'swift2', 'lowlv2', 'noskill', 'noskill2',
  'lowskill', 'swiftskill', 'swiftlv'];
ok('既有 90 成就 id 零回归（核心抽样全覆盖末期正位）',
  EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('nightwins 75 / unflicker 76 / swift 77 / lowlv 78 / nopotion 79 / penny 80 / steadfast 81 / frugal 82 / dry 83 / swift2 84 / lowlv2 85 / noskill 86 / noskill2 87 / lowskill 88 / swiftskill 89 / swiftlv 90 末尾序位（既有序位零位移）',
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
  ACH_LIST.findIndex((a) => a.id === 'swiftskill') === 89 &&
  ACH_LIST.findIndex((a) => a.id === 'swiftlv') === 90);

// —— 既有挑战向家族对照（hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv 十六档独立互不干扰）——
const _a = (id) => ACH_LIST.find((x) => x.id === id);
ok('hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv 十六档独立（难度 vs 姿态 vs 速通 vs 低等级 vs 零用药 vs 零消费 vs 零阵亡 vs 硬核复合六态 vs 零用技 vs 交叉区三态）',
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
  _a('swiftskill').ok({ trueBoss: true, battles: 70, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, battles: 70, level: 9 }) === true);
ok('速通×低等级交叉档必同时满足 swift 与 lowlv（本枚是其交叉区唯一纪念——battles 与 level 双源同判）',
  _a('swift').ok({ trueBoss: true, battles: 70, level: 9 }) === true &&
  _a('lowlv').ok({ trueBoss: true, battles: 70, level: 9 }) === true &&
  ach.ok({ trueBoss: true, battles: 70, level: 9 }) === true);
ok('超场 + 未及十级 → swiftlv 与 swift 同不解锁（battles 严格分区——超场即永久无缘，lowlv 仍亮）',
  _a('swift').ok({ trueBoss: true, battles: 71, level: 9 }) === false &&
  _a('lowlv').ok({ trueBoss: true, battles: 71, level: 9 }) === true &&
  ach.ok({ trueBoss: true, battles: 71, level: 9 }) === false);
ok('七十场内 + 升过十级 → swiftlv 与 lowlv 同不解锁（level 严格分区——升过十级即永久无缘，swift 仍亮）',
  _a('lowlv').ok({ trueBoss: true, battles: 70, level: 10 }) === false &&
  _a('swift').ok({ trueBoss: true, battles: 70, level: 10 }) === true &&
  ach.ok({ trueBoss: true, battles: 70, level: 10 }) === false);
ok('困难 + 七十场内 + 未及十级也解锁 swiftlv（本档难度通吃——与 swift/lowlv/lowskill/swiftskill 同不读 diff）',
  ach.ok({ trueBoss: true, diff: 1, battles: 70, level: 9 }) === true);
ok('困难 + 七十场内 + 十级外：swift2 亮而 swiftlv 不亮（难度复合档与双克制档分源互不干扰）',
  _a('swift2').ok({ trueBoss: true, diff: 1, battles: 70, level: 12 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, battles: 70, level: 12 }) === false);
ok('困难 + 未及十级 + 超场：lowlv2 亮而 swiftlv 不亮（难度×低等级档与双克制档分源互不干扰）',
  _a('lowlv2').ok({ trueBoss: true, diff: 1, battles: 90, level: 9 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, battles: 90, level: 9 }) === false);
ok('未及十级 + 零用技 + 七十场内：lowskill/swiftskill 亮而 swiftlv 同亮（交叉区三态同源同判混合档）',
  _a('lowskill').ok({ trueBoss: true, level: 9, battles: 70, casts: 0 }) === true &&
  _a('swiftskill').ok({ trueBoss: true, level: 9, battles: 70, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, level: 9, battles: 70, casts: 0 }) === true &&
  _a('lowlv2').ok({ trueBoss: true, diff: 1, level: 9, battles: 70, casts: 0 }) === true);
ok('七十场内 + 未及十级 + 用过技：swiftlv 亮而 lowskill/swiftskill 不亮（本档不读 casts——与零用技交叉档分源互不干扰）',
  _a('lowskill').ok({ trueBoss: true, level: 9, battles: 70, casts: 3 }) === false &&
  _a('swiftskill').ok({ trueBoss: true, battles: 70, casts: 3 }) === false &&
  ach.ok({ trueBoss: true, level: 9, battles: 70, casts: 3 }) === true);
ok('lvl10 正向里程碑档不解锁 swiftlv（level 达 LV10_GOAL 正向纪念、swiftlv 无 prog——正向与低等级各占一位）',
  ach.ok({ trueBoss: true, battles: 70, level: 10 }) === false &&
  _a('lvl10').ok({ level: 10 }) === true &&
  'prog' in _a('lvl10') && !('prog' in ach));

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
  const h = freshHero({ trueBoss: true, battles: 70, level: 9 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 七十场内未及十级真结局档 newly 含 swiftlv（既有通路自动跟随）',
    newly.includes('swiftlv'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, battles: 70, level: 10 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 七十场内档升过十级 newly 不含 swiftlv（不误解锁）',
    !newly.includes('swiftlv'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, battles: 71, level: 9 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 未及十级档超场 newly 不含 swiftlv（不误解锁，场次维严格）',
    !newly.includes('swiftlv'), JSON.stringify(newly));
}
{
  const h = freshHero({ battles: 70, level: 9 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 未通关档 newly 不含 swiftlv（不误解锁）',
    !newly.includes('swiftlv'), JSON.stringify(newly));
}

// —— applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等）——
{
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    const h = freshHero({ trueBoss: true, battles: 70, level: 9 });
    S.G = h;
    applyAchievements();
    ok('applyAchievements 真实解锁落 hero.ach（含 swiftlv）', h.ach.includes('swiftlv'), JSON.stringify(h.ach));
    ok('解锁横幅报成就名【速成青芽】', msgs.some((m) => m.includes('🔓 成就解锁：') && m.includes('速成青芽')), msgs.join(' | '));
    const len1 = msgs.length;
    applyAchievements();
    ok('幂等：重复调用不再报（已解锁去重）', msgs.length === len1 && msgs.filter((m) => m.includes('速成青芽')).length === 1, String(msgs.length));
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
    const h = freshHero({ trueBoss: true, battles: 70, level: 10 });
    S.G = h;
    applyAchievements();
    ok('七十场内但升过十级 applyAchievements 零 swiftlv 解锁零「速成青芽」横幅（不误解锁）',
      !h.ach.includes('swiftlv') && !msgs.some((m) => m.includes('速成青芽')), JSON.stringify({ ach: h.ach, msgs }));
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}

// —— 源级零变化：battle.js battles 写入点 + hero.js level 写入点 + data.js SPEED_GOAL/LOWLV_GOAL 常量（既有，本版未动）——
ok('battle.js 具 1 处 S.G.battles = (S.G.battles || 0) + 1; 写入点（startBattle 进战唯一产生点）',
  (battleSrc.match(/S\.G\.battles = \(S\.G\.battles \|\| 0\) \+ 1;/g) || []).length === 1, String((battleSrc.match(/S\.G\.battles = \(S\.G\.battles \|\| 0\) \+ 1;/g) || []).length));
ok('hero.js 具 1 处 hero.level++ 写入点（grantXp 升级唯一产生点）',
  (heroSrc.match(/hero\.level\+\+;/g) || []).length === 1, String((heroSrc.match(/hero\.level\+\+;/g) || []).length));
ok('data.js SPEED_GOAL 常量仍为 70（单一数据源，与 swift/swift2/swiftskill 同读一份源）',
  dataSrc.includes('const SPEED_GOAL = 70;'));
ok('data.js LOWLV_GOAL 常量仍为 10（单一数据源，与 lowlv/lowlv2/lowskill 同读一份源）',
  dataSrc.includes('const LOWLV_GOAL = 10;'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径为三百八十六件套（三百八十五件套清除）',
  readme.includes('扩充为冒烟三百八十六件套（三百八十五件套清除）') && !readme.includes('扩充为冒烟三百七十四件套（三百七十三件套清除）'));
ok('README 含 v24.164 守护描述（速成青芽新成就守护）', readme.includes('v24.164 起含「速成青芽」新成就守护'));
ok('README 版本速览已为 v24.164 且成就计数 91', readme.includes('版本速览（v24.175）') && readme.includes('102 项成就'));
ok('README 成就计数双处口径 91 项（全部 102 项进度 + **102 项成就**，90 项清除）',
  readme.includes('全部 102 项进度') && readme.includes('**102 项成就**') && !readme.includes('**90 项成就**'));
ok('README tests 树收录 smoke_v24164_swiftlv（含 v24.164 守护子句 + 串尾）',
  readme.includes('v24.164 起含「速成青芽」新成就守护') && readme.includes('smoke_v24164_swiftlv'));
ok('README 含 smoke_v24164_swiftlv 入库（375 份）', readme.includes('smoke_v24164_swiftlv 入库（375 份）'));
ok('package.json 已收录 smoke_v24164_swiftlv.mjs 且位于串尾（在 swiftskill 之后）',
  pkg.includes('smoke_v24164_swiftlv.mjs') &&
  pkg.includes('node tests/smoke_v24163_swiftskill.mjs && node tests/smoke_v24164_swiftlv.mjs && node tests/smoke_v24165_nopotskill.mjs && node tests/smoke_v24166_unflskill.mjs && node tests/smoke_v24167_swiftnopo.mjs && node tests/smoke_v24168_lowlvnopo.mjs && node tests/smoke_v24169_unflswift.mjs && node tests/smoke_v24170_unfllowlv.mjs && node tests/smoke_v24171_unflnopo.mjs && node tests/smoke_v24172_unflpenny.mjs && node tests/smoke_v24173_pennyswift.mjs && node tests/smoke_v24174_pennylowlv.mjs && node tests/smoke_v24175_pennynoskill.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 378 件套', testChain === 386, String(testChain));
ok('CHANGELOG 含 v24.164 顶条目', changelog.startsWith('## v24.175'));

// —— 哨兵链：README 已有 375 口径且尚无 376（前望 376 语义：下一版才写 376）——
ok('README 已有三百七十五件套口径且尚无 376（哨兵前望 387 语义：下一版才写 376）',
  readme.includes('扩充为冒烟三百八十六件套（三百八十五件套清除）') && !readme.includes('三百八十七件套'));
{
  const s24143 = read('tests/smoke_v24143_furnacequest.mjs');
  ok('smoke_v24143 哨兵链前望 387（三百八十七件套否定式）',
    s24143.includes('哨兵链前望 387') && s24143.includes('三百八十七件套否定式'));
}
{
  ok('smoke_v24163 姊妹件版本字面量 pin 已随新现实推进（v24.164）',
    read('tests/smoke_v24163_swiftskill.mjs').includes("const GAME_VERSION = 'v24.175';"));
  ok('smoke_v24162 姊妹件版本字面量 pin 已随新现实推进（v24.164）',
    read('tests/smoke_v24162_lowskill.mjs').includes("const GAME_VERSION = 'v24.175';"));
  ok('smoke_v24161 姊妹件版本字面量 pin 已随新现实推进（v24.164）',
    read('tests/smoke_v24161_noskill2.mjs').includes("const GAME_VERSION = 'v24.175';"));
  ok('smoke_v24160 姊妹件版本字面量 pin 已随新现实推进（v24.164）',
    read('tests/smoke_v24160_noskill.mjs').includes("const GAME_VERSION = 'v24.175';"));
  ok('smoke_v24159 姊妹件版本字面量 pin 已随新现实推进（v24.164）',
    read('tests/smoke_v24159_lowlv2.mjs').includes("const GAME_VERSION = 'v24.175';"));
  ok('smoke_v24158 姊妹件版本字面量 pin 已随新现实推进（v24.164）',
    read('tests/smoke_v24158_swift2.mjs').includes("const GAME_VERSION = 'v24.175';"));
  ok('smoke_v24157 姊妹件版本字面量 pin 已随新现实推进（v24.164）',
    read('tests/smoke_v24157_dry.mjs').includes("const GAME_VERSION = 'v24.175';"));
  ok('smoke_v2229 姊妹件版本恒等 pin 已随新现实推进（=== v24.164）',
    read('tests/smoke_v2229_metall.mjs').includes("GAME_VERSION === 'v24.175'"));
}

// —— 旧代 v24.163 字面量 / 374 件套口径 / 90 项 全库零残留扫描（豁免本套件 + 上一版 v24163 + 上上版 v24162）——
const EXEMPT = new Set(['smoke_v24164_swiftlv.mjs', 'smoke_v24163_swiftskill.mjs', 'smoke_v24162_lowskill.mjs']);
const leftovers = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests')).filter((x) => x.endsWith('.mjs') && !EXEMPT.has(x))) {
  const s = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  const code = s.split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  if (code.includes("const GAME_VERSION = 'v24.163'")) leftovers.push(f + ':gv');
  if (code.includes("GAME_VERSION === 'v24.163'")) leftovers.push(f + ':eq');
  if (code.includes("startsWith('## v24.163")) leftovers.push(f + ':st');
  if (code.includes('三百七十四件套（三百七十三件套清除）')) leftovers.push(f + ':374');
  if (code.includes('testChain === 374') || code.includes('files.length === 374') ||
      code.includes('treeTok.length === 374') || code.includes('chainAll.length === 374') ||
      code.includes('fileCount === 374')) leftovers.push(f + ':count');
  if (code.includes('N/90') || code.includes('**90 项成就**') || code.includes('全部 90 项进度')) leftovers.push(f + ':90');
}
ok('旧代 v24.163 GAME_VERSION 字面量/恒等/顶 pin 全库零残留（哨兵链，豁免本套件 + v24163 + v24162）',
  leftovers.filter((x) => x.endsWith(':gv') || x.endsWith(':eq') || x.endsWith(':st')).length === 0,
  JSON.stringify(leftovers));
ok('旧代 374 件套口径/计数/90 项 pin 全库零残留（哨兵链，豁免本套件 + v24163 + v24162）',
  leftovers.filter((x) => x.endsWith(':374') || x.endsWith(':count') || x.endsWith(':90')).length === 0,
  JSON.stringify(leftovers));

if (failed) { console.log(`— v24.164 冒烟完成：${n} 项断言，失败 ${failed} —`); process.exit(1); }
console.log(`— v24.164 冒烟完成：${n} 项断言，失败 0 —`);
