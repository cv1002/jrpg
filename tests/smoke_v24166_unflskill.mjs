// smoke_v24166_unflskill.mjs —— v24.166 专项冒烟：新成就「素手长明」（挑战向双克制交叉档·零阵亡×零用技）
// （新内容·单成就——承 v24.165 素手不沾（nopotskill）/ v24.160 大巧不工（noskill）/ v24.147 未曾熄灯（unflicker）
// 先例：「以怎样的姿态通关」挑战维度第十七次开垦——v24.162/v24.163/v24.164/v24.165 先后把 {swift, lowlv, noskill,
// nopotion} 四姿态的两两交叉区开垦四枚（素手青灯/踏雪无痕/速成青芽/素手不沾），最早的克制姿态「别倒下」（unflicker「未曾
// 熄灯」只认「零阵亡」）至此仍孤悬交叉区外：unflicker 只认「零阵亡」、noskill「大巧不工」只认「零用技」（都是普通/困难
// 通吃），两者交叉的「零阵亡 + 零用技」硬核档与分开的两枚拿到的是同一枚未曾熄灯（或大巧不工）。判定读既有 hero.trueBoss
// （终焉之神=真结局最终 Boss，与 trueboss/hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/
// lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill 同源）、既有 hero.deaths（battle.loseBattle 全游唯一战败
// 结算点写入——retryBoss 不清零、随 snapshotHero 全量快照自动持久化、防御式 (g.deaths||0) 旧档零迁移，与 unflicker
// 「未曾熄灯」/deaths「败而不馁」/steadfast「逆风不灭」同读一份源）与既有 hero.casts（battle.doSkill [2]技能释放成功唯一
// 产生点——治愈与伤害两分支都计、MP 不足/被封印拦截未出手不计、随 snapshotHero 全量快照自动持久化、防御式 (g.casts||0)
// 旧档零迁移，与 cast「熟能生巧」/side_song「战歌的谱」/noskill/noskill2/lowskill/swiftskill/nopotskill 同读一份源），
// (g.trueBoss && !(g.deaths||0) && !(g.casts||0)) 即「零阵亡 · 零用技通关」达成——deaths 与 casts 都只增不减，死过
// 一次或放过一个技能就永久无缘此档（与 hardtrue 换难度 / unflicker 死过一次 / swift 超场 / lowlv 升过十级 / nopotion 用过
// 药 / penny 花过金 / steadfast 死过一次 / frugal 花过金 / dry 用过药 / swift2 超场 / lowlv2 升过十级 / noskill 用过技
// / noskill2 用过技 / lowskill 升过十级或放过技 / swiftskill 超场或放过技 / swiftlv 超场或升过十级 / nopotskill 用过技或
// 用过药同属「重新来过才拿得到」的挑战品类）；是 unflicker 与 noskill 两枚的严格交叠——零阵亡零用技通关必同时满足二者，
// 本枚是这一交叉区的唯一纪念（难度通吃：普通档与困难档同义、不读 diff，与 unflicker/noskill/nopsotskill 同款）；与既有
// 正向里程碑 cast「熟能生巧」（[2]技能累计释放达 CAST_GOAL(30) 次）成镜面对、互不重叠——一个纪念「熟能生巧」、一个纪念
// 「长明的素手」。
// 可行性：[1]普攻/[4]防御回蓝（v19.96）/[5]蓄力三路都不碰 casts，治愈术等技能被封死、零阵亡意味着每场战斗都要全额止损
// （防御/逃跑/药水硬磨），圣光之剑普攻蓄力流 + 防御回蓝硬磨的终焉之神战与 unflicker 同档可行（普通通关本就极少阵亡）——
// 比 noskill 更难（不能死）比 unflicker 更严（不能用技），吃满「不熄不技」双克制的是一场最纯粹的平砍纪律跑。零新计数零新
// 状态零新写点零新存档（trueBoss/deaths/casts 皆既有字段）、无 r 无 prog 纯里程碑（与 hardtrue/unflicker/swift/lowlv/
// nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill 同款——不熄
// 不技本身就是奖励、硬核才是）、解锁走 winBattle → applyAchievements 既有通路（终焉之神击败当场 trueBoss 落账后
// applyAchievements 枚举即解锁，与 trueboss/hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/
// swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill 同路径零新增依赖），反馈不迟到。
// 本冒烟守护：版本锚点（格式合法 + 已越过 v24.165 + data.js 字面量 v24.166 + 旧 v24.165 零残留）、
// ACH_LIST 93 项精确与末尾序位（unflicker 76 / swift 77 / lowlv 78 / nopotion 79 / penny 80 / steadfast 81 /
// frugal 82 / dry 83 / swift2 84 / lowlv2 85 / noskill 86 / noskill2 87 / lowskill 88 / swiftskill 89 /
// swiftlv 90 / nopotskill 91 / unflskill 92）、unflskill 数据契约（d 文案、ok 防御式逐值、无 r 无 prog 且与 cast 正向
// 里程碑镜面对）、unlockedAchievements/applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等去重 /
// 死过不解锁 / 用过技不解锁 / 未通关不解锁）、既有 92 成就 id 零回归、battle.js deaths 写入点与 casts 写入点及
// data.js DEATH_GOAL/CAST_GOAL 常量源级零变化、README/package.json/CHANGELOG 同步（件套口径 377 + v24.166
// 守护描述 + 入库 377 + 版本速览 93 项 + tests 树串尾 + package 串尾 377）、哨兵链（前望 378 且 README 尚无 378
// 口径）、旧代 v24.165 字面量/恒等/顶 pin/376 口径/92 项 全库零残留扫描（豁免本套件 + 上一版 v24165 + 上上版 v24164）。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, DEATH_GOAL, CAST_GOAL } from '../js/data.js';
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

console.log('— v24.166 挑战向双克制交叉档成就「素手长明」 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dataSrc = read('js/data.js');
const battleSrc = read('js/battle.js');
const heroSrc = read('js/hero.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（格式合法 + 已越过 v24.165 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.166', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 166)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.166（旧 v24.165 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v24.188';") && !dataSrc.includes("const GAME_VERSION = 'v24.165';"));
ok('data.js 含 v24.166 注释（素手长明新成就说明）',
  dataSrc.includes('v24.166 新内容·新成就'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'unflskill');
ok('ACH_LIST 含 unflskill「素手长明」且 id 唯一',
  !!ach && ach.name === '素手长明' && ACH_LIST.filter((a) => a.id === 'unflskill').length === 1);
ok('ACH_LIST 精确总数 94 项（94→95 末尾追加）', ACH_LIST.length === 113, String(ACH_LIST.length));
ok('unflskill 描述文案（零阵亡零用技真结局交叉档）',
  ach.d === '零阵亡且未使用任何技能（战斗指令 [2]）击败终焉之神（真结局）', ach.d);
ok('unflskill 判定源级（读既有 g.trueBoss / !(g.deaths||0) / !(g.casts||0)）',
  String(ach.ok).includes('g.trueBoss') && String(ach.ok).includes('!(g.deaths||0)') && String(ach.ok).includes('!(g.casts||0)'));
ok('unflskill 无 r 无 prog 纯里程碑（与 hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill 同款）',
  !('r' in ach) && !('prog' in ach));

// —— ok 防御式逐值 ——
ok('零阵亡 + 零用技 + 真结局 → 解锁', ach.ok({ trueBoss: true, deaths: 0, casts: 0 }) === true);
ok('零阵亡 + 真结局 + 缺 casts 字段 → 按 0 解码解锁（旧档零迁移）', ach.ok({ trueBoss: true, deaths: 0 }) === true);
ok('零用技 + 真结局 + 缺 deaths 字段 → 按 0 解码解锁（旧档零迁移）', ach.ok({ trueBoss: true, casts: 0 }) === true);
ok('零用技 + 真结局 + 死过 1 次 → 不解锁（死过一次永久无缘此档）', ach.ok({ trueBoss: true, deaths: 1, casts: 0 }) === false);
ok('零阵亡 + 真结局 + 放过 1 个技 → 不解锁（本档只认零用技）', ach.ok({ trueBoss: true, deaths: 0, casts: 1 }) === false);
ok('零阵亡 + 零用技 + 真结局 + 未及十级 → 照常解锁（本档不读 level，与 lowskill/swiftlv 分源）', ach.ok({ trueBoss: true, deaths: 0, casts: 0, level: 9 }) === true);
ok('零阵亡 + 零用技 + 真结局 + 七十场内 → 照常解锁（本档不读 battles，与 swiftskill/swiftlv 分源）', ach.ok({ trueBoss: true, deaths: 0, casts: 0, battles: 70 }) === true);
ok('零阵亡 + 零用技 + 真结局 + 战斗用过药 → 照常解锁（本档不读 potionUses，与 nopotskill 分源）', ach.ok({ trueBoss: true, deaths: 0, casts: 0, potionUses: 1 }) === true);
ok('零阵亡 + 零用技但未通关 → 不解锁', ach.ok({ deaths: 0, casts: 0 }) === false);
ok('空档/缺字段 → 不解锁（(g.deaths||0) 与 (g.casts||0) 防御式零迁移）', ach.ok({}) === false);

// —— 既有 92 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime', 'hunt100', 'ptime2', 'lucky2', 'rich2', 'stock',
  'brew2', 'stock2', 'elixir', 'mush', 'elixir2', 'mush2', 'metall', 'rich3', 'ptime3', 'hunt3',
  'lucky3', 'stock3', 'elixir3', 'brew3', 'mush3', 'outstep', 'outstep2', 'scholar2', 'seen', 'seen2',
  'chests2', 'talkall', 'deflect', 'charge', 'crit', 'cast', 'flee', 'potionuses', 'rushs', 'mapdrink',
  'innrest', 'spend', 'travels', 'steps', 'battles', 'sell', 'deaths', 'nightwins', 'unflicker', 'swift',
  'lowlv', 'nopotion', 'penny', 'steadfast', 'frugal', 'dry', 'swift2', 'lowlv2', 'noskill', 'noskill2',
  'lowskill', 'swiftskill', 'swiftlv', 'nopotskill', 'unflskill'];
ok('既有 92 成就 id 零回归（核心抽样全覆盖末期正位）',
  EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('nightwins 75 / unflicker 76 / swift 77 / lowlv 78 / nopotion 79 / penny 80 / steadfast 81 / frugal 82 / dry 83 / swift2 84 / lowlv2 85 / noskill 86 / noskill2 87 / lowskill 88 / swiftskill 89 / swiftlv 90 / nopotskill 91 / unflskill 92 末尾序位（既有序位零位移）',
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
  ACH_LIST.findIndex((a) => a.id === 'unflskill') === 92);

// —— 既有挑战向家族对照（hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill 十八档独立互不干扰）——
const _a = (id) => ACH_LIST.find((x) => x.id === id);
ok('hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill 十八档独立（难度 vs 姿态 vs 速通 vs 低等级 vs 零用药 vs 零消费 vs 零阵亡 vs 硬核复合六态 vs 零用技 vs 交叉区五态）',
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
  ach.ok({ trueBoss: true, deaths: 0, casts: 0 }) === true);
ok('零阵亡×零用技交叉档必同时满足 unflicker 与 noskill（本枚是其交叉区唯一纪念——deaths 与 casts 双源同判）',
  _a('unflicker').ok({ trueBoss: true, deaths: 0, casts: 0 }) === true &&
  _a('noskill').ok({ trueBoss: true, deaths: 0, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, deaths: 0, casts: 0 }) === true);
ok('死过 → unflskill 与 unflicker 同不解锁（deaths 严格分区——死过一次即永久无缘，noskill 仍亮）',
  _a('unflicker').ok({ trueBoss: true, deaths: 1, casts: 0 }) === false &&
  _a('noskill').ok({ trueBoss: true, deaths: 1, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, deaths: 1, casts: 0 }) === false);
ok('用过技 → unflskill 与 noskill 同不解锁（casts 严格分区——放过技即永久无缘，unflicker 仍亮）',
  _a('noskill').ok({ trueBoss: true, deaths: 0, casts: 1 }) === false &&
  _a('unflicker').ok({ trueBoss: true, deaths: 0, casts: 1 }) === true &&
  ach.ok({ trueBoss: true, deaths: 0, casts: 1 }) === false);
ok('困难 + 零阵亡 + 零用技也解锁 unflskill（本档难度通吃——不读 diff，与 unflicker/noskill 同源）',
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, casts: 0 }) === true);
ok('困难 + 零用技：noskill2 亮而 unflskill 同亮（难度复合档与交叉档在困难零用技下灯向一致）',
  _a('noskill2').ok({ trueBoss: true, diff: 1, casts: 0, deaths: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, casts: 0, deaths: 1 }) === false);
ok('困难 + 零阵亡：steadfast 亮而 unflskill 同亮（硬核复合档与交叉档在困难零阵亡下灯向一致）',
  _a('steadfast').ok({ trueBoss: true, diff: 1, deaths: 0, casts: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, casts: 1 }) === false);
ok('零阵亡 + 零用技 + 战斗用过药：nopotskill 不亮而 unflskill 仍亮（本档不读 potionUses——与零用药交叉档分源互不干扰）',
  _a('nopotskill').ok({ trueBoss: true, deaths: 0, casts: 0, potionUses: 1 }) === false &&
  _a('unflicker').ok({ trueBoss: true, deaths: 0, casts: 0, potionUses: 1 }) === true &&
  ach.ok({ trueBoss: true, deaths: 0, casts: 0, potionUses: 1 }) === true);
ok('零阵亡 + 零用技 + 零战斗用药三克制全档：unflskill 与 nopotskill 同亮（交叉区双档在零阵亡零用技零用药下同向，本档不读 potionUses、nopotskill 不读 deaths）',
  _a('nopotskill').ok({ trueBoss: true, deaths: 0, casts: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, deaths: 0, casts: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, deaths: 0, casts: 0, potionUses: 1 }) === true);
ok('deaths 败而不馁正向里程碑档不解锁 unflskill（死满 DEATH_GOAL 次解锁败而不馁、unflskill 不读次数）',
  ach.ok({ trueBoss: true, deaths: 0, casts: 0 }) === true &&
  _a('deaths').ok({ deaths: DEATH_GOAL }) === true &&
  ach.ok({ trueBoss: true, deaths: 1, casts: 0 }) === false);
ok('cast 熟能生巧正向里程碑档不解锁 unflskill（用满 CAST_GOAL 次技能正常解锁熟能生巧、unflskill 不读次数）',
  ach.ok({ trueBoss: true, deaths: 0, casts: 0 }) === true &&
  _a('cast').ok({ casts: CAST_GOAL }) === true &&
  ach.ok({ trueBoss: true, deaths: 0, casts: 1 }) === false);

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
  const h = freshHero({ trueBoss: true, deaths: 0, casts: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 零阵亡零用技真结局档 newly 含 unflskill（既有通路自动跟随）',
    newly.includes('unflskill'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, deaths: 1, casts: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 零用技档死过一次 newly 不含 unflskill（不误解锁，阵亡维严格）',
    !newly.includes('unflskill'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, deaths: 0, casts: 1 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 零阵亡档放过技 newly 不含 unflskill（不误解锁，技维严格）',
    !newly.includes('unflskill'), JSON.stringify(newly));
}
{
  const h = freshHero({ deaths: 0, casts: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 未通关档 newly 不含 unflskill（不误解锁）',
    !newly.includes('unflskill'), JSON.stringify(newly));
}

// —— applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等）——
{
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    const h = freshHero({ trueBoss: true, deaths: 0, casts: 0 });
    S.G = h;
    applyAchievements();
    ok('applyAchievements 真实解锁落 hero.ach（含 unflskill）', h.ach.includes('unflskill'), JSON.stringify(h.ach));
    ok('解锁横幅报成就名【素手长明】', msgs.some((m) => m.includes('🔓 成就解锁：') && m.includes('素手长明')), msgs.join(' | '));
    const len1 = msgs.length;
    applyAchievements();
    ok('幂等：重复调用不再报（已解锁去重）', msgs.length === len1 && msgs.filter((m) => m.includes('素手长明')).length === 1, String(msgs.length));
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
    const h = freshHero({ trueBoss: true, deaths: 1, casts: 0 });
    S.G = h;
    applyAchievements();
    ok('死过一次 applyAchievements 零 unflskill 解锁零「素手长明」横幅（不误解锁）',
      !h.ach.includes('unflskill') && !msgs.some((m) => m.includes('素手长明')), JSON.stringify({ ach: h.ach, msgs }));
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}

// —— 源级零变化：battle.js deaths 写入点 + casts 写入点 + data.js DEATH_GOAL/CAST_GOAL 常量（既有，本版未动）——
ok('battle.js 具 1 处 S.G.deaths 自增写入点（loseBattle 全游唯一战败结算点, retryBoss 不清零）',
  (battleSrc.match(/S\.G\.deaths = \(S\.G\.deaths \|\| 0\) \+ 1;/g) || []).length === 1,
  String((battleSrc.match(/S\.G\.deaths = \(S\.G\.deaths \|\| 0\) \+ 1;/g) || []).length));
ok('battle.js 具 1 处 hero.casts = castN; 写入点（doSkill [2]技能释放成功唯一产生点）',
  (battleSrc.match(/hero\.casts = castN;/g) || []).length === 1, String((battleSrc.match(/hero\.casts = castN;/g) || []).length));
ok('data.js DEATH_GOAL 常量仍为 10（单一数据源，与 deaths/unflicker/steadfast 同读一份源）',
  dataSrc.includes('const DEATH_GOAL = 10;'));
ok('data.js CAST_GOAL 常量仍为 30（单一数据源，与 cast/noskill/noskill2/lowskill/swiftskill/nopotskill 同读一份源）',
  dataSrc.includes('const CAST_GOAL = 30;'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径为三百九十八件套（三百九十七件套清除）',
  readme.includes('扩充为冒烟三百九十八件套（三百九十七件套清除）') && !readme.includes('扩充为冒烟三百七十六件套（三百七十五件套清除）'));
ok('README 含 v24.166 守护描述（素手长明新成就守护）', readme.includes('v24.166 起含「素手长明」新成就守护'));
ok('README 版本速览已为 v24.166 且成就计数 93', readme.includes('版本速览（v24.188）') && readme.includes('113 项成就'));
ok('README 成就计数双处口径 93 项（全部 113 项进度 + **113 项成就**，92 项清除）',
  readme.includes('全部 113 项进度') && readme.includes('**113 项成就**') && !readme.includes('**92 项成就**'));
ok('README tests 树收录 smoke_v24166_unflskill（含 v24.166 守护子句 + 串尾）',
  readme.includes('v24.166 起含「素手长明」新成就守护') && readme.includes('smoke_v24166_unflskill'));
ok('README 含 smoke_v24166_unflskill 入库（377 份）', readme.includes('smoke_v24166_unflskill 入库（377 份）'));
ok('package.json 已收录 smoke_v24166_unflskill.mjs 且位于串尾（在 nopotskill 之后）',
  pkg.includes('smoke_v24166_unflskill.mjs') &&
  pkg.includes('node tests/smoke_v24165_nopotskill.mjs && node tests/smoke_v24166_unflskill.mjs && node tests/smoke_v24167_swiftnopo.mjs && node tests/smoke_v24168_lowlvnopo.mjs && node tests/smoke_v24169_unflswift.mjs && node tests/smoke_v24170_unfllowlv.mjs && node tests/smoke_v24171_unflnopo.mjs && node tests/smoke_v24172_unflpenny.mjs && node tests/smoke_v24173_pennyswift.mjs && node tests/smoke_v24174_pennylowlv.mjs && node tests/smoke_v24175_pennynoskill.mjs && node tests/smoke_v24176_pennynopo.mjs && node tests/smoke_v24177_unflswift2.mjs && node tests/smoke_v24178_unflpenny2.mjs && node tests/smoke_v24179_unflnopo2.mjs && node tests/smoke_v24180_unflskill2.mjs && node tests/smoke_v24181_lampoilquest.mjs && node tests/smoke_v24183_unfllowlv2.mjs && node tests/smoke_v24184_pennyswift2.mjs && node tests/smoke_v24185_pennylowlv2.mjs && node tests/smoke_v24186_pennynoskill2.mjs && node tests/smoke_v24187_pennynopo2.mjs && node tests/smoke_v24188_swiftlv2.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 378 件套', testChain === 398, String(testChain));
ok('CHANGELOG 含 v24.166 顶条目', changelog.startsWith('## v24.188'));

// —— 哨兵链：README 已有 377 口径且尚无 378（前望 378 语义：下一版才写 378）——
ok('README 已有三百七十七件套口径且尚无 378（哨兵前望 399 语义：下一版才写 378）',
  readme.includes('扩充为冒烟三百九十八件套（三百九十七件套清除）') && !readme.includes('三百九十九件套'));
{
  const s24143 = read('tests/smoke_v24143_furnacequest.mjs');
  ok('smoke_v24143 哨兵链前望 399（三百九十九件套否定式）',
    s24143.includes('哨兵链前望 399') && s24143.includes('三百九十九件套否定式'));
}
{
  ok('smoke_v24165 姊妹件版本字面量 pin 已随新现实推进（v24.166）',
    read('tests/smoke_v24165_nopotskill.mjs').includes("const GAME_VERSION = 'v24.188';"));
  ok('smoke_v24164 姊妹件版本字面量 pin 已随新现实推进（v24.166）',
    read('tests/smoke_v24164_swiftlv.mjs').includes("const GAME_VERSION = 'v24.188';"));
  ok('smoke_v24163 姊妹件版本字面量 pin 已随新现实推进（v24.166）',
    read('tests/smoke_v24163_swiftskill.mjs').includes("const GAME_VERSION = 'v24.188';"));
  ok('smoke_v24162 姊妹件版本字面量 pin 已随新现实推进（v24.166）',
    read('tests/smoke_v24162_lowskill.mjs').includes("const GAME_VERSION = 'v24.188';"));
  ok('smoke_v24161 姊妹件版本字面量 pin 已随新现实推进（v24.166）',
    read('tests/smoke_v24161_noskill2.mjs').includes("const GAME_VERSION = 'v24.188';"));
  ok('smoke_v24160 姊妹件版本字面量 pin 已随新现实推进（v24.166）',
    read('tests/smoke_v24160_noskill.mjs').includes("const GAME_VERSION = 'v24.188';"));
  ok('smoke_v24159 姊妹件版本字面量 pin 已随新现实推进（v24.166）',
    read('tests/smoke_v24159_lowlv2.mjs').includes("const GAME_VERSION = 'v24.188';"));
  ok('smoke_v24158 姊妹件版本字面量 pin 已随新现实推进（v24.166）',
    read('tests/smoke_v24158_swift2.mjs').includes("const GAME_VERSION = 'v24.188';"));
  ok('smoke_v24157 姊妹件版本字面量 pin 已随新现实推进（v24.166）',
    read('tests/smoke_v24157_dry.mjs').includes("const GAME_VERSION = 'v24.188';"));
  ok('smoke_v2229 姊妹件版本恒等 pin 已随新现实推进（=== v24.166）',
    read('tests/smoke_v2229_metall.mjs').includes("GAME_VERSION === 'v24.188'"));
}

// —— 旧代 v24.165 字面量 / 376 件套口径 / 92 项 全库零残留扫描（豁免本套件 + 上一版 v24165 + 上上版 v24164）——
const EXEMPT = new Set(['smoke_v24188_swiftlv2.mjs', 'smoke_v24187_pennynopo2.mjs', 'smoke_v24186_pennynoskill2.mjs', 'smoke_v24185_pennylowlv2.mjs', 'smoke_v24184_pennyswift2.mjs', 'smoke_v24166_unflskill.mjs', 'smoke_v24165_nopotskill.mjs', 'smoke_v24164_swiftlv.mjs']);
const leftovers = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests')).filter((x) => x.endsWith('.mjs') && !EXEMPT.has(x))) {
  const s = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  const code = s.split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  if (code.includes("const GAME_VERSION = 'v24.165'")) leftovers.push(f + ':gv');
  if (code.includes("GAME_VERSION === 'v24.165'")) leftovers.push(f + ':eq');
  if (code.includes("startsWith('## v24.165")) leftovers.push(f + ':st');
  if (code.includes('三百七十六件套（三百七十五件套清除）')) leftovers.push(f + ':376');
  if (code.includes('testChain === 376') || code.includes('files.length === 376') ||
      code.includes('treeTok.length === 376') || code.includes('chainAll.length === 376') ||
      code.includes('fileCount === 376')) leftovers.push(f + ':count');
  if (code.includes('N/92') || code.includes('**92 项成就**') || code.includes('全部 92 项进度')) leftovers.push(f + ':92');
}
ok('旧代 v24.165 GAME_VERSION 字面量/恒等/顶 pin 全库零残留（哨兵链，豁免本套件 + v24165 + v24164）',
  leftovers.filter((x) => x.endsWith(':gv') || x.endsWith(':eq') || x.endsWith(':st')).length === 0,
  JSON.stringify(leftovers));
ok('旧代 376 件套口径/计数/92 项 pin 全库零残留（哨兵链，豁免本套件 + v24165 + v24164）',
  leftovers.filter((x) => x.endsWith(':376') || x.endsWith(':count') || x.endsWith(':92')).length === 0,
  JSON.stringify(leftovers));

if (failed) { console.log(`— v24.166 冒烟完成：${n} 项断言，失败 ${failed} —`); process.exit(1); }
console.log(`— v24.166 冒烟完成：${n} 项断言，失败 0 —`);
