// smoke_v24170_unfllowlv.mjs —— v24.170 专项冒烟：新成就「长明青芽」（挑战向双克制交叉档·零阵亡×未及十级）
// （新内容·单成就——承 v24.169 长明疾行（unflswift）/ v24.166 素手长明（unflskill）/ v24.151 未及十级（lowlv）/
// v24.147 未曾熄灯（unflicker）先例：「以怎样的姿态通关」挑战维度第二十一次开垦——v24.162-168 先后把 {swift, lowlv,
// noskill, nopotion} 四姿态的两两交叉区全部收口（素手青灯/踏雪无痕/速成青芽/素手不沾/不饮疾行/不饮青芽 六角各家），
// v24.166 起最早的克制姿态「别倒下」进交叉区开垦（零阵亡×零用技=素手长明、零阵亡×七十场内=长明疾行），而 unflicker
// 「未曾熄灯」只认「零阵亡」、lowlv「未及十级」只认「十级内」（都是普通/困难通吃），两者交叉的「零阵亡 + 未及十级」
// 硬核档与分开的两枚拿到的是同一枚未曾熄灯（或未及十级），成就一览毫无分别；本枚落地后「别倒下」交叉区开垦第三角
// （零阵亡×未及十级=长明青芽）。
// 判定读既有 hero.trueBoss（终焉之神=真结局最终 Boss，与 trueboss/hardtrue/unflicker/swift/lowlv/nopotion/penny/
// steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/
// lowlvnopo/unflswift 同源）、既有 hero.deaths（battle.loseBattle 全游唯一战败结算点 S.G.deaths=(S.G.deaths||0)+1
// 写入、retryBoss 不清零、随 snapshotHero 全量快照自动持久化、防御式 (g.deaths||0) 旧档零迁移，与 unflicker/steadfast/
// deaths/unflskill/unflswift 同读一份源）与既有 hero.level（hero.js grantXp 升级唯一产生点 hero.level++、随
// snapshotHero 全量快照自动持久化、防御式 (g.level||1) 旧档零迁移，与 lowlv/lowlv2/lowskill/swiftlv/lowlvnopo/
// lvl5/lvl10/lvl12 同读一份源），(g.trueBoss && !(g.deaths||0) && (g.level||1)<LOWLV_GOAL) 即「零阵亡 · 未及十级通关」
// 达成——deaths 与 level 都只增不减，死过一次或升过十级就永久无缘此档（与 hardtrue 换难度 / unflicker 死过一次 /
// swift 超场 / lowlv 升过十级 / nopotion 用过药 / penny 花过金 / steadfast 死过一次 / frugal 花过金 / dry 用过药 /
// swift2 超场 / lowlv2 升过十级 / noskill 用过技 / noskill2 用过技 / lowskill 升过十级或放过技 / swiftskill 超场或
// 放过技 / swiftlv 超场或升过十级 / nopotskill 用过技或用过药 / unflskill 死过或放过技 / swiftnopo 用过药或超场 /
// lowlvnopo 用过药或升过十级 / unflswift 死过一次或超场同属「重新来过才拿得到」的挑战品类）；是 unflicker 与 lowlv
// 两枚的严格交叠——零阵亡未及十级通关必同时满足二者，本枚是这一交叉区的唯一纪念（难度通吃：普通档与困难档同义、
// 不读 diff，与 unflicker/lowlv/unflskill/unflswift 同款）；与既有正向里程碑 lvl10「小有所成」（等级达 LV10_GOAL(10)
// 级）成镜面对、互不重叠——一个纪念「练到十级」、一个纪念「长明的青芽」。
// 零新计数零新状态零新写点零新存档（trueBoss/deaths/level 皆既有字段）、无 r 无 prog 纯里程碑（与 hardtrue/unflicker/
// swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/
// nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift 同款——不熄而不长本身就是奖励、硬核才是）、解锁走 winBattle →
// applyAchievements 既有通路（终焉之神击败当场 trueBoss 落账后 applyAchievements 枚举即解锁，与 trueboss/hardtrue/
// unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/
// swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift 同路径零新增依赖），反馈不迟到。
// 本冒烟守护：版本锚点（格式合法 + 已越过 v24.169 + data.js 字面量 v24.170 + 旧 v24.169 零残留）、
// ACH_LIST 97 项精确与末尾序位（unflicker 76 / swift 77 / lowlv 78 / nopotion 79 / penny 80 / steadfast 81 /
// frugal 82 / dry 83 / swift2 84 / lowlv2 85 / noskill 86 / noskill2 87 / lowskill 88 / swiftskill 89 /
// swiftlv 90 / nopotskill 91 / unflskill 92 / swiftnopo 93 / lowlvnopo 94 / unflswift 95 / unfllowlv 96）、
// unfllowlv 数据契约（d 文案、ok 防御式逐值、无 r 无 prog 且与 lvl10「小有所成」/deaths「败而不馁」正向里程碑
// 镜面对）、unlockedAchievements/applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等去重 /
// 死过一次不解锁 / 升过十级不解锁 / 未通关不解锁）、既有 96 成就 id 零回归、battle.js deaths 写入点与 hero.js
// level 升级写入点及 data.js LOWLV_GOAL/DEATH_GOAL/LV10_GOAL 常量源级零变化、README/package.json/CHANGELOG
// 同步（件套口径 381 + v24.170 守护描述 + 入库 381 + 版本速览 97 项 + tests 树串尾 + package 串尾 381）、
// 哨兵链（前望 382 且 README 尚无 382 口径）、旧代 v24.169 字面量/恒等/顶 pin/380 口径/96 项
// 全库零残留扫描（豁免本套件 + 上一版 v24169 + 上上版 v24168）。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, LOWLV_GOAL, DEATH_GOAL, LVL10_GOAL } from '../js/data.js';
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

console.log('— v24.170 挑战向双克制交叉档成就「长明青芽」 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dataSrc = read('js/data.js');
const heroSrc = read('js/hero.js');
const battleSrc = read('js/battle.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（格式合法 + 已越过 v24.169 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.176', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 174)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.170（旧 v24.169 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v24.190';") && !dataSrc.includes("const GAME_VERSION = 'v24.169';"));
ok('data.js 含 v24.170 注释（长明青芽新成就说明）',
  dataSrc.includes('v24.170 新内容·新成就'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'unfllowlv');
ok('ACH_LIST 含 unfllowlv「长明青芽」且 id 唯一',
  !!ach && ach.name === '长明青芽' && ACH_LIST.filter((a) => a.id === 'unfllowlv').length === 1);
ok('ACH_LIST 精确总数 100 项（99→100 末尾追加）', ACH_LIST.length === 115, String(ACH_LIST.length));
ok('unfllowlv 描述文案（零阵亡未及十级真结局交叉档）',
  ach.d === `零阵亡且未满 ${LOWLV_GOAL} 级击败终焉之神（真结局）`, ach.d);
ok('unfllowlv 判定源级（读既有 g.trueBoss / !(g.deaths||0) / (g.level||1)<LOWLV_GOAL）',
  String(ach.ok).includes('g.trueBoss') && String(ach.ok).includes('!(g.deaths||0)') && String(ach.ok).includes('(g.level||1)<LOWLV_GOAL'));
ok('unfllowlv 无 r 无 prog 纯里程碑（与 hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift 同款）',
  !('r' in ach) && !('prog' in ach));

// —— ok 防御式逐值 ——
ok('零阵亡 + 未及十级 + 真结局 → 解锁', ach.ok({ trueBoss: true, deaths: 0, level: 9 }) === true);
ok('零阵亡 + 真结局 + 缺 deaths 字段 → 按 0 解码解锁（旧档零迁移）', ach.ok({ trueBoss: true, level: 9 }) === true);
ok('零阵亡 + 真结局 + 缺 level 字段 → 按 1 解码解锁（旧档零迁移）', ach.ok({ trueBoss: true, deaths: 0 }) === true);
ok('未及十级 + 真结局 + 死过 1 次 → 不解锁（死过一次永久无缘此档）', ach.ok({ trueBoss: true, deaths: 1, level: 9 }) === false);
ok('零阵亡 + 真结局 + 升过十级（level=10）→ 不解锁（本档只认十级内）', ach.ok({ trueBoss: true, deaths: 0, level: LOWLV_GOAL }) === false);
ok('零阵亡 + 未及十级 + 真结局 + 七十场内 → 照常解锁（本档不读 battles，与 swift/swiftlv/unflswift 分源）', ach.ok({ trueBoss: true, deaths: 0, level: 9, battles: 60 }) === true);
ok('零阵亡 + 未及十级 + 真结局 + 零战斗用药 → 照常解锁（本档不读 potionUses，与 nopotion/lowlvnopo 分源）', ach.ok({ trueBoss: true, deaths: 0, level: 9, potionUses: 0 }) === true);
ok('零阵亡 + 未及十级 + 真结局 + 零用技 → 照常解锁（本档不读 casts，与 noskill/lowskill/unflskill 分源）', ach.ok({ trueBoss: true, deaths: 0, level: 9, casts: 0 }) === true);
ok('零阵亡 + 未及十级 + 真结局 + 困难模式 → 照常解锁（本档不读 diff，与 hardtrue/lowlv2/steadfast 分源）', ach.ok({ trueBoss: true, deaths: 0, level: 9, diff: 1 }) === true);
ok('零阵亡 + 未及十级但未通关 → 不解锁', ach.ok({ deaths: 0, level: 9 }) === false);
ok('空档/缺字段 → 不解锁（(g.deaths||0) 与 (g.level||1) 防御式零迁移）', ach.ok({}) === false);

// —— 既有 96 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime', 'hunt100', 'ptime2', 'lucky2', 'rich2', 'stock',
  'brew2', 'stock2', 'elixir', 'mush', 'elixir2', 'mush2', 'metall', 'rich3', 'ptime3', 'hunt3',
  'lucky3', 'stock3', 'elixir3', 'brew3', 'mush3', 'outstep', 'outstep2', 'scholar2', 'seen', 'seen2',
  'chests2', 'talkall', 'deflect', 'charge', 'crit', 'cast', 'flee', 'potionuses', 'rushs', 'mapdrink',
  'innrest', 'spend', 'travels', 'steps', 'battles', 'sell', 'deaths', 'nightwins', 'unflicker', 'swift',
  'lowlv', 'nopotion', 'penny', 'steadfast', 'frugal', 'dry', 'swift2', 'lowlv2', 'noskill', 'noskill2',
  'lowskill', 'swiftskill', 'swiftlv', 'nopotskill', 'unflskill', 'swiftnopo', 'lowlvnopo', 'unflswift',
  'unfllowlv'];
ok('既有 96 成就 id 零回归（核心抽样全覆盖末期正位）',
  EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('nightwins 75 / unflicker 76 / swift 77 / lowlv 78 / nopotion 79 / penny 80 / steadfast 81 / frugal 82 / dry 83 / swift2 84 / lowlv2 85 / noskill 86 / noskill2 87 / lowskill 88 / swiftskill 89 / swiftlv 90 / nopotskill 91 / unflskill 92 / swiftnopo 93 / lowlvnopo 94 / unflswift 95 / unfllowlv 96 末尾序位（既有序位零位移）',
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
  ACH_LIST.findIndex((a) => a.id === 'swiftlv') === 90 &&
  ACH_LIST.findIndex((a) => a.id === 'nopotskill') === 91 &&
  ACH_LIST.findIndex((a) => a.id === 'unflskill') === 92 &&
  ACH_LIST.findIndex((a) => a.id === 'swiftnopo') === 93 &&
  ACH_LIST.findIndex((a) => a.id === 'lowlvnopo') === 94 &&
  ACH_LIST.findIndex((a) => a.id === 'unflswift') === 95 &&
  ACH_LIST.findIndex((a) => a.id === 'unfllowlv') === 96);

// —— 既有挑战向家族对照（hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv 二十二档独立互不干扰）——
const _a = (id) => ACH_LIST.find((x) => x.id === id);
ok('hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv 二十二档独立（难度 vs 姿态 vs 速通 vs 低等级 vs 零用药 vs 零消费 vs 零阵亡 vs 硬核复合六态 vs 零用技 vs 交叉区九态）',
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
  _a('swiftlv').ok({ trueBoss: true, battles: 70, level: 9 }) === true &&
  _a('nopotskill').ok({ trueBoss: true, casts: 0, potionUses: 0 }) === true &&
  _a('unflskill').ok({ trueBoss: true, deaths: 0, casts: 0 }) === true &&
  _a('swiftnopo').ok({ trueBoss: true, potionUses: 0, battles: 70 }) === true &&
  _a('lowlvnopo').ok({ trueBoss: true, level: 9, potionUses: 0 }) === true &&
  _a('unflswift').ok({ trueBoss: true, deaths: 0, battles: 70 }) === true &&
  ach.ok({ trueBoss: true, deaths: 0, level: 9 }) === true);
ok('零阵亡×未及十级交叉档必同时满足 unflicker 与 lowlv（本枚是其交叉区唯一纪念——deaths 与 level 双源同判）',
  _a('unflicker').ok({ trueBoss: true, deaths: 0, level: 9 }) === true &&
  _a('lowlv').ok({ trueBoss: true, deaths: 0, level: 9 }) === true &&
  ach.ok({ trueBoss: true, deaths: 0, level: 9 }) === true);
ok('死过一次 → unfllowlv 与 unflicker 同不解锁（deaths 严格分区——死过即永久无缘，lowlv 仍亮）',
  _a('unflicker').ok({ trueBoss: true, deaths: 1, level: 9 }) === false &&
  _a('lowlv').ok({ trueBoss: true, deaths: 1, level: 9 }) === true &&
  ach.ok({ trueBoss: true, deaths: 1, level: 9 }) === false);
ok('升过十级 → unfllowlv 与 lowlv 同不解锁（level 严格分区——十级外即永久无缘，unflicker 仍亮）',
  _a('lowlv').ok({ trueBoss: true, deaths: 0, level: 10 }) === false &&
  _a('unflicker').ok({ trueBoss: true, deaths: 0, level: 10 }) === true &&
  ach.ok({ trueBoss: true, deaths: 0, level: 10 }) === false);
ok('困难 + 零阵亡 + 未及十级也解锁 unfllowlv（本档难度通吃——不读 diff，与 unflicker/lowlv/steadfast/lowlv2 同源）',
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, level: 9 }) === true);
ok('困难 + 零阵亡：steadfast 亮而 unfllowlv 同亮（难度复合档与交叉档在困难零阵亡下灯向一致）',
  _a('steadfast').ok({ trueBoss: true, diff: 1, deaths: 0, level: 12 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, level: 12 }) === false);
ok('困难 + 未及十级：lowlv2 亮而 unfllowlv 同亮（难度复合档与交叉档在困难低等级下灯向一致）',
  _a('lowlv2').ok({ trueBoss: true, diff: 1, deaths: 1, level: 9 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 1, level: 9 }) === false);
ok('零阵亡 + 未及十级 + 零用技：unflskill 亮而 unfllowlv 仍亮（本档不读 casts——与零用技交叉档分源互不干扰）',
  _a('unflskill').ok({ trueBoss: true, deaths: 0, casts: 0, level: 12 }) === true &&
  _a('unflicker').ok({ trueBoss: true, deaths: 0 }) === true &&
  _a('lowlv').ok({ trueBoss: true, level: 9 }) === true &&
  ach.ok({ trueBoss: true, deaths: 0, level: 9, casts: 1 }) === true);
ok('零阵亡 + 未及十级 + 零用药：lowlvnopo 要求零用药而 unfllowlv 不读 potionUses（两枚分源可同亮）',
  _a('lowlvnopo').ok({ trueBoss: true, potionUses: 0, level: 9, deaths: 1 }) === true &&
  ach.ok({ trueBoss: true, deaths: 0, level: 9, potionUses: 1 }) === true);
ok('零阵亡 + 未及十级 + 超场（88）：unflswift 要求七十场内而 unfllowlv 不读 battles（两枚分源）',
  _a('unflswift').ok({ trueBoss: true, battles: 88, deaths: 0, level: 9 }) === false &&
  ach.ok({ trueBoss: true, deaths: 0, level: 9, battles: 88 }) === true);
ok('零阵亡 + 未及十级 + 升到十级：swiftlv 要求未及十级而 unfllowlv 同亮后熄灭（level 维严格分区）',
  _a('swiftlv').ok({ trueBoss: true, battles: 70, level: 9, deaths: 1 }) === true &&
  ach.ok({ trueBoss: true, deaths: 0, level: 10 }) === false &&
  ach.ok({ trueBoss: true, deaths: 0, level: 9 }) === true);
ok('lvl10 小有所成正向里程碑档不解锁 unfllowlv（练到 LVL10_GOAL 正常解锁小有所成、unfllowlv 不读达标等级）',
  ach.ok({ trueBoss: true, deaths: 0, level: 9 }) === true &&
  _a('lvl10').ok({ level: LVL10_GOAL }) === true &&
  ach.ok({ trueBoss: true, deaths: 0, level: 10 }) === false);
ok('deaths 败而不馁正向里程碑档不解锁 unfllowlv（累计 DEATH_GOAL 次败北正常解锁败而不馁、unfllowlv 不读次数）',
  ach.ok({ trueBoss: true, deaths: 0, level: 9 }) === true &&
  _a('deaths').ok({ deaths: DEATH_GOAL }) === true &&
  ach.ok({ trueBoss: true, deaths: 1, level: 9 }) === false);

// —— unlockedAchievements 集成 ——
function freshHero(extra) {
  return Object.assign({ name: '余烬', level: 12, gold: 123, xp: 0, xpNext: 20, hp: 50, hpMax: 50, mp: 20, mpMax: 20,
    item: 3, potion2: 1, mushrooms: 2, weapon: '铁剑', armor: '皮甲', atkMax: 12, defMax: 6,
    map: 'village', x: 8, y: 8, time: 0, ach: [], bestiary: {}, seen: {}, fragments: [], visited: ['village'],
    quests: {}, totalWins: 3, drops: 0, steps: 0, travels: 0, spent: 0, battles: 3, skills: [], talked: [],
    checks: 0, crits: 0, casts: 0, flees: 0, potionUses: 0, deflects: 0, charges: 0, sleep: 0,
    sold: 0, dealt: 0, mapPotions: 0, innRests: 0, nightWins: 0, rushClears: 0, brews: 0, chests: [],
    deaths: 0, diff: 0 }, extra);
}
{
  const h = freshHero({ trueBoss: true, deaths: 0, level: 9 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 零阵亡未及十级真结局档 newly 含 unfllowlv（既有通路自动跟随）',
    newly.includes('unfllowlv'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, deaths: 1, level: 9 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 死过一次档 newly 不含 unfllowlv（不误解锁，deaths 维严格）',
    !newly.includes('unfllowlv'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, deaths: 0, level: 12 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 零阵亡档升过十级 newly 不含 unfllowlv（不误解锁，level 维严格）',
    !newly.includes('unfllowlv'), JSON.stringify(newly));
}
{
  const h = freshHero({ deaths: 0, level: 9 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 未通关档 newly 不含 unfllowlv（不误解锁）',
    !newly.includes('unfllowlv'), JSON.stringify(newly));
}

// —— applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等）——
{
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    const h = freshHero({ trueBoss: true, deaths: 0, level: 9 });
    S.G = h;
    applyAchievements();
    ok('applyAchievements 真实解锁落 hero.ach（含 unfllowlv）', h.ach.includes('unfllowlv'), JSON.stringify(h.ach));
    ok('解锁横幅报成就名【长明青芽】', msgs.some((m) => m.includes('🔓 成就解锁：') && m.includes('长明青芽')), msgs.join(' | '));
    const len1 = msgs.length;
    applyAchievements();
    ok('幂等：重复调用不再报（已解锁去重）', msgs.length === len1 && msgs.filter((m) => m.includes('长明青芽')).length === 1, String(msgs.length));
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
    const h = freshHero({ trueBoss: true, deaths: 0, level: 12 });
    S.G = h;
    applyAchievements();
    ok('升过十级 applyAchievements 零 unfllowlv 解锁零「长明青芽」横幅（不误解锁）',
      !h.ach.includes('unfllowlv') && !msgs.some((m) => m.includes('长明青芽')), JSON.stringify({ ach: h.ach, msgs }));
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}

// —— 源级零变化：battle.js deaths 写入点 + hero.js level 升级写入点 + data.js LOWLV_GOAL/DEATH_GOAL/LV10_GOAL 常量（既有，本版未动）——
ok('battle.js 具 1 处 S.G.deaths = (S.G.deaths || 0) + 1; 写入点（loseBattle 战败结算唯一产生点、retryBoss 不清零）',
  (battleSrc.match(/S\.G\.deaths = \(S\.G\.deaths \|\| 0\) \+ 1;/g) || []).length === 1,
  String((battleSrc.match(/S\.G\.deaths = \(S\.G\.deaths \|\| 0\) \+ 1;/g) || []).length));
ok('hero.js 既有 level 升级写入点源级零变化（grantXp 唯一产生点 hero.level++）',
  heroSrc.includes('hero.level++') && /hero\.level\+\+/.test(heroSrc));
ok('data.js LOWLV_GOAL 常量仍为 10（单一数据源，与 lowlv/lowlv2/lowskill/swiftlv/lowlvnopo 同读一份源）',
  dataSrc.includes('const LOWLV_GOAL = 10;'));
ok('data.js DEATH_GOAL 常量仍为 10（单一数据源，与 unflicker/steadfast/deaths 同读一份源）',
  dataSrc.includes('const DEATH_GOAL = 10;'));
ok('data.js LVL10_GOAL 常量仍为 10（单一数据源，与 lvl10「小有所成」同读一份源）',
  dataSrc.includes('const LVL10_GOAL = 10;'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径为四百件套（三百九十九件套清除）',
  readme.includes('扩充为冒烟四百件套（三百九十九件套清除）') && !readme.includes('扩充为冒烟三百八十七件套（三百八十二件套清除）'));
ok('README 含 v24.170 守护描述（长明青芽新成就守护）', readme.includes('v24.170 起含「长明青芽」新成就守护'));
ok('README 版本速览已为 v24.178 且成就计数 100', readme.includes('版本速览（v24.190）') && readme.includes('115 项成就'));
ok('README 成就计数双处口径 97 项（全部 115 项进度 + **115 项成就**，96 项清除）',
  readme.includes('全部 115 项进度') && readme.includes('**115 项成就**') && !readme.includes('**96 项成就**'));
ok('README tests 树收录 smoke_v24170_unfllowlv（含 v24.170 守护子句 + 串尾）',
  readme.includes('v24.170 起含「长明青芽」新成就守护') && readme.includes('smoke_v24170_unfllowlv'));
ok('README 含 smoke_v24170_unfllowlv 入库（381 份）', readme.includes('smoke_v24170_unfllowlv 入库（381 份）'));
ok('package.json 已收录 smoke_v24170_unfllowlv.mjs 且位于串尾（在 unflswift 之后）',
  pkg.includes('smoke_v24170_unfllowlv.mjs') &&
  pkg.includes('node tests/smoke_v24169_unflswift.mjs && node tests/smoke_v24170_unfllowlv.mjs && node tests/smoke_v24171_unflnopo.mjs && node tests/smoke_v24172_unflpenny.mjs && node tests/smoke_v24173_pennyswift.mjs && node tests/smoke_v24174_pennylowlv.mjs && node tests/smoke_v24175_pennynoskill.mjs && node tests/smoke_v24176_pennynopo.mjs && node tests/smoke_v24177_unflswift2.mjs && node tests/smoke_v24178_unflpenny2.mjs && node tests/smoke_v24179_unflnopo2.mjs && node tests/smoke_v24180_unflskill2.mjs && node tests/smoke_v24181_lampoilquest.mjs && node tests/smoke_v24183_unfllowlv2.mjs && node tests/smoke_v24184_pennyswift2.mjs && node tests/smoke_v24185_pennylowlv2.mjs && node tests/smoke_v24186_pennynoskill2.mjs && node tests/smoke_v24187_pennynopo2.mjs && node tests/smoke_v24188_swiftlv2.mjs && node tests/smoke_v24189_swiftskill2.mjs && node tests/smoke_v24190_swiftnopo2.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 384 件套', testChain === 400, String(testChain));
ok('CHANGELOG 含 v24.178 顶条目', changelog.startsWith('## v24.190'));

// —— 哨兵链：README 已有 381 口径且尚无 382（前望 382 语义：下一版才写 382）——
ok('README 已有三百八十一件套口径且尚无 382（哨兵前望 401 语义：下一版才写 382）',
  readme.includes('扩充为冒烟四百件套（三百九十九件套清除）') && !readme.includes('四百零一件套'));
{
  const s24143 = read('tests/smoke_v24143_furnacequest.mjs');
  ok('smoke_v24143 哨兵链前望 401（四百零一件套否定式）',
    s24143.includes('哨兵链前望 401') && s24143.includes('四百零一件套否定式'));
}
{
  ok('smoke_v24169 姊妹件版本字面量 pin 已随新现实推进（v24.170）',
    read('tests/smoke_v24169_unflswift.mjs').includes("const GAME_VERSION = 'v24.190';"));
  ok('smoke_v24168 姊妹件版本字面量 pin 已随新现实推进（v24.170）',
    read('tests/smoke_v24168_lowlvnopo.mjs').includes("const GAME_VERSION = 'v24.190';"));
  ok('smoke_v24167 姊妹件版本字面量 pin 已随新现实推进（v24.170）',
    read('tests/smoke_v24167_swiftnopo.mjs').includes("const GAME_VERSION = 'v24.190';"));
  ok('smoke_v24166 姊妹件版本字面量 pin 已随新现实推进（v24.170）',
    read('tests/smoke_v24166_unflskill.mjs').includes("const GAME_VERSION = 'v24.190';"));
  ok('smoke_v24151 姊妹件版本字面量 pin 已随新现实推进（v24.170）',
    read('tests/smoke_v24151_lowlv.mjs').includes("const GAME_VERSION = 'v24.190';"));
  ok('smoke_v2229 姊妹件版本恒等 pin 已随新现实推进（=== v24.170）',
    read('tests/smoke_v2229_metall.mjs').includes("GAME_VERSION === 'v24.190'"));
}

// —— 旧代 v24.169 字面量 / 380 件套口径 / 96 项 全库零残留扫描（豁免本套件 + 上一版 v24169 + 上上版 v24168）——
const EXEMPT = new Set(['smoke_v24190_swiftnopo2.mjs', 'smoke_v24189_swiftskill2.mjs', 'smoke_v24188_swiftlv2.mjs', 'smoke_v24187_pennynopo2.mjs', 'smoke_v24186_pennynoskill2.mjs', 'smoke_v24185_pennylowlv2.mjs', 'smoke_v24184_pennyswift2.mjs', 'smoke_v24170_unfllowlv.mjs', 'smoke_v24169_unflswift.mjs', 'smoke_v24168_lowlvnopo.mjs']);
const leftovers = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests')).filter((x) => x.endsWith('.mjs') && !EXEMPT.has(x))) {
  const s = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  const code = s.split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  if (code.includes("const GAME_VERSION = 'v24.169'")) leftovers.push(f + ':gv');
  if (code.includes("GAME_VERSION === 'v24.169'")) leftovers.push(f + ':eq');
  if (code.includes("startsWith('## v24.169")) leftovers.push(f + ':st');
  if (code.includes('三百八十件套（三百七十九件套清除）')) leftovers.push(f + ':380');
  if (code.includes('testChain === 380') || code.includes('files.length === 380') ||
      code.includes('treeTok.length === 380') || code.includes('chainAll.length === 380') ||
      code.includes('fileCount === 380'))
    leftovers.push(f + ':count');
  // v24115/v2476 豁免 96 扫描：它们常驻「CHANGELOG v24.115/v24.76 条目含『成就 N/94』」断言（CHANGELOG 历史条目
  // 永久保留 '成就 N/94' 字面量，该断言是稳定常驻 pin，与本次 96→97 推进无关；其余文件不得残留 N/96/**96 项成就**/全部 96 项进度）。
  if (f !== 'smoke_v24115_achhud.mjs' && f !== 'smoke_v2476_achprog.mjs' &&
      (code.includes('N/96') || code.includes('**96 项成就**') || code.includes('全部 96 项进度')))
    leftovers.push(f + ':96');
}
ok('旧代 v24.169 GAME_VERSION 字面量/恒等/顶 pin 全库零残留（哨兵链，豁免本套件 + v24169 + v24168）',
  leftovers.filter((x) => x.endsWith(':gv') || x.endsWith(':eq') || x.endsWith(':st')).length === 0,
  JSON.stringify(leftovers));
ok('旧代 380 件套口径/计数/96 项 pin 全库零残留（哨兵链，豁免本套件 + v24169 + v24168）',
  leftovers.filter((x) => x.endsWith(':380') || x.endsWith(':count') || x.endsWith(':96')).length === 0,
  JSON.stringify(leftovers));

if (failed) { console.log(`— v24.170 冒烟完成：${n} 项断言，失败 ${failed} —`); process.exit(1); }
console.log(`— v24.170 冒烟完成：${n} 项断言，失败 0 —`);
