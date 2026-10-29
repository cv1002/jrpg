// smoke_v24175_pennynoskill.mjs —— v24.178 专项冒烟：新成就「白手素手」（挑战向双克制交叉档·零消费×零用技）
// （新内容·单成就·第一百零二项——承 v24.176 白手青芽（pennylowlv）/ v24.160 大巧不工（noskill）/ v24.153 白手成灯（penny）先例：
// 「以怎样的姿态通关」挑战维度第二十六次开垦——v24.162-168 先后把 {swift, lowlv, noskill, nopotion} 四姿态的两两交叉区全部收口
// （素手青灯/踏雪无痕/速成青芽/素手不沾/不饮疾行/不饮青芽 六角各家），v24.166-172 又把最早的克制姿态「别倒下」拉进交叉区开垦五角
// （零阵亡×零用技=素手长明、零阵亡×七十场内=长明疾行、零阵亡×未及十级=长明青芽、零阵亡×零战斗用药=长明未饮、零阵亡×零消费=
// 长明白手），v24.173-174 又把 penny「白手成灯」拉进交叉区开垦三角（零消费×七十场内=白手疾行、零消费×未及十级=白手青芽）
// ——「别花钱」与「别用技」的「零消费 + 零用技」硬核档与分开的两枚拿到的是同一枚白手成灯（或大巧不工），成就一览毫无分别；
// 本枚开垦「白手成灯」姿态交叉区第四角：零消费×零用技=白手素手。
// 判定读既有 hero.trueBoss（终焉之神=真结局最终 Boss，与 trueboss/hardtrue/unflicker/swift/lowlv/nopotion/penny/
// steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/
// lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv 同源）、既有 hero.spent（消费线五端口——商店购买×3/住店/
// 酿造——扣款唯一来源、只增不减、随 snapshotHero 全量快照自动持久化、防御式 (g.spent||0) 旧档零迁移，与 penny/frugal/spend/
// unflpenny/pennyswift/pennylowlv 同读一份源）与既有 hero.casts（battle.doSkill 战斗释放技能成功唯一产生点、随 snapshotHero
// 全量快照自动持久化、防御式 (g.casts||0) 旧档零迁移，与 noskill/noskill2/lowskill/swiftskill/nopotskill/unflskill 同读
// 一份源），(g.trueBoss && !(g.spent||0) && !(g.casts||0)) 即「零消费 · 零用技通关」达成——
// spent 与 casts 都只增不减，花过 1 金或放过一次技就永久无缘此档（与 hardtrue 换难度 / unflicker 死过一次 / swift 超场 /
// lowlv 升过十级 / nopotion 用过药 / penny 花过金 / steadfast 死过一次 / frugal 花过金 / dry 用过药 / swift2 超场 /
// lowlv2 升过十级 / noskill 用过技 / noskill2 用过技 / lowskill 升过十级或放过技 / swiftskill 超场或放过技 / swiftlv
// 超场或升过十级 / nopotskill 用过技或用过药 / unflskill 死过或放过技 / swiftnopo 用过药或超场 / lowlvnopo 用过药或
// 升过十级 / unflswift 死过一次或超场 / unfllowlv 死过一次或升过十级 / unflnopo 死过一次或战斗用过药 / unflpenny 死过
// 一次或花过金 / pennyswift 花过金或超场 / pennylowlv 花过金或升过十级 同属「重新来过才拿得到」的挑战品类）；是 penny 与
// noskill 两枚的严格交叠——零消费零用技通关必同时满足二者，本枚是这一交叉区的唯一纪念（难度通吃：普通档与困难档同义、不读 diff，与
// unflicker/penny/noskill/pennyswift/pennylowlv 同款）；与既有正向里程碑 spend「一掷千金」（累计消费达 SPEND_GOAL(1000) 金）/
// cast「熟能生巧」（[2]技能累计释放达 CAST_GOAL(30) 次）成镜面对、互不重叠——一个纪念「豪掷千金」、一个纪念「熟能生巧」、一个
// 纪念「白手的素手」。
// 零新计数零新状态零新写点零新存档（trueBoss/spent/casts 皆既有字段）、无 r 无 prog 纯里程碑（与 hardtrue/
// unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/
// swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv 同款
// ——不花又不放本身就是奖励、硬核才是）、解锁走 winBattle → applyAchievements 既有通路（终焉之神击败当场 trueBoss 落账后
// applyAchievements 枚举即解锁，与 trueboss/hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/
// swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/
// unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv 同路径零新增依赖），反馈不迟到。
// 本冒烟守护：版本锚点（格式合法 + 已越过 v24.176 + data.js 字面量 v24.178 + 旧 v24.176 零残留）、
// ACH_LIST 105 项精确与末尾序位（unflicker 76 / swift 77 / lowlv 78 / nopotion 79 / penny 80 / steadfast 81 /
// frugal 82 / dry 83 / swift2 84 / lowlv2 85 / noskill 86 / noskill2 87 / lowskill 88 / swiftskill 89 /
// swiftlv 90 / nopotskill 91 / unflskill 92 / swiftnopo 93 / lowlvnopo 94 / unflswift 95 / unfllowlv 96 /
// unflnopo 97 / unflpenny 98 / pennyswift 99 / pennylowlv 100 / pennynoskill 101）、pennynoskill 数据契约
// （d 文案、ok 防御式逐值、无 r 无 prog 且与 spend/cast 两个正向里程碑镜面对）、unlockedAchievements/applyAchievements
// 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等去重 / 花过金不解锁 / 放过技不解锁 / 未通关不解锁）、既有 101 成就 id
// 零回归、battle.js 无新增写点与 data.js SPEND_GOAL/CAST_GOAL 常量源级零变化、README/package.json/CHANGELOG 同步
// （件套口径 386 + v24.178 守护描述 + 入库 386 + 版本速览 102 项 + tests 树串尾 + package 串尾 386）、
// 哨兵链（前望 387 且 README 尚无 387 口径）、旧代 v24.176 字面量/恒等/顶 pin/385 口径/101 项
// 全库零残留扫描（豁免本套件 + 上一版 v24174 + 上上版 v24173 + 上上上版 v24172 + 上上上上版 v24171 + 更早版 v24170。
// 注：成就计数 101→102 的零残留扫描只认「成就 N/101」/「**101 项成就**」/「全部 101 项进度」三形态，
// 「⚔️ 身经百战 N/100」「⚔️ 驱雾百战 N/100」是 BATTLE_GOAL/HUNT2_GOAL 讨伐进度分母非成就计数，不在扫描目标内）。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, SPEND_GOAL, CAST_GOAL } from '../js/data.js';
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

console.log('— v24.178 挑战向双克制交叉档成就「白手素手」 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dataSrc = read('js/data.js');
const heroSrc = read('js/hero.js');
const battleSrc = read('js/battle.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（格式合法 + 已越过 v24.176 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.176', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 174)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.178（旧 v24.176 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v24.186';") && !dataSrc.includes("const GAME_VERSION = 'v24.176';"));
ok('data.js 含 v24.178 注释（白手素手新成就说明）',
  dataSrc.includes('v24.178 新内容·新成就'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'pennynoskill');
ok('ACH_LIST 含 pennynoskill「白手素手」且 id 唯一',
  !!ach && ach.name === '白手素手' && ACH_LIST.filter((a) => a.id === 'pennynoskill').length === 1);
ok('ACH_LIST 精确总数 102 项（101→102 末尾追加）', ACH_LIST.length === 111, String(ACH_LIST.length));
ok('pennynoskill 描述文案（零消费零用技真结局交叉档）',
  ach.d === '未花费 1 金币且未使用任何技能（战斗指令 [2]）击败终焉之神（真结局）', ach.d);
ok('pennynoskill 判定源级（读既有 g.trueBoss / !(g.spent||0) / !(g.casts||0)）',
  String(ach.ok).includes('g.trueBoss') && String(ach.ok).includes('!(g.spent||0)') && String(ach.ok).includes('!(g.casts||0)'));
ok('pennynoskill 无 r 无 prog 纯里程碑（与 hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv 同款）',
  !('r' in ach) && !('prog' in ach));

// —— ok 防御式逐值 ——
ok('零消费 + 零用技 + 真结局 → 解锁', ach.ok({ trueBoss: true, spent: 0, casts: 0 }) === true);
ok('零消费 + 真结局 + 缺 spent 字段 → 按 0 解码解锁（旧档零迁移）', ach.ok({ trueBoss: true, casts: 0 }) === true);
ok('零消费 + 真结局 + 缺 casts 字段 → 按 0 解码解锁（旧档零迁移）', ach.ok({ trueBoss: true, spent: 0 }) === true);
ok('零消费 + 真结局 + 花过 1 金 → 不解锁（花过一分永久无缘此档）', ach.ok({ trueBoss: true, spent: 1, casts: 0 }) === false);
ok('零消费 + 真结局 + 放过一次技 → 不解锁（放过一次永久无缘此档）', ach.ok({ trueBoss: true, spent: 0, casts: 1 }) === false);
ok('零消费 + 真结局 + 超场（88）→ 照常解锁（本档不读 battles，与 swift/pennyswift 分源）', ach.ok({ trueBoss: true, spent: 0, casts: 0, battles: 88 }) === true);
ok('零消费 + 真结局 + 升过十级（10）→ 照常解锁（本档不读 level，与 lowlv/pennylowlv 分源）', ach.ok({ trueBoss: true, spent: 0, casts: 0, level: 10 }) === true);
ok('零消费 + 真结局 + 战斗用过药 → 照常解锁（本档不读 potionUses，与 nopotion/nopotskill 分源）', ach.ok({ trueBoss: true, spent: 0, casts: 0, potionUses: 1 }) === true);
ok('零消费 + 真结局 + 死过一次 → 照常解锁（本档不读 deaths，与 unflicker/unflpenny 分源）', ach.ok({ trueBoss: true, spent: 0, casts: 0, deaths: 1 }) === true);
ok('零消费 + 真结局 + 困难模式 → 照常解锁（本档不读 diff，与 hardtrue/steadfast 分源）', ach.ok({ trueBoss: true, spent: 0, casts: 0, diff: 1 }) === true);
ok('零消费 + 零用技但未通关 → 不解锁', ach.ok({ spent: 0, casts: 0 }) === false);
ok('空档/缺字段 → 不解锁（(g.spent||0) 与 (g.casts||0) 防御式零迁移）', ach.ok({}) === false);

// —— 既有 101 成就 id 零回归 + 末尾序位 ——
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
  'unfllowlv', 'unflnopo', 'unflpenny', 'pennyswift', 'pennylowlv', 'pennynoskill'];
ok('既有 101 成就 id 零回归（核心抽样全覆盖末期正位）',
  EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('nightwins 75 / unflicker 76 / swift 77 / lowlv 78 / nopotion 79 / penny 80 / steadfast 81 / frugal 82 / dry 83 / swift2 84 / lowlv2 85 / noskill 86 / noskill2 87 / lowskill 88 / swiftskill 89 / swiftlv 90 / nopotskill 91 / unflskill 92 / swiftnopo 93 / lowlvnopo 94 / unflswift 95 / unfllowlv 96 / unflnopo 97 / unflpenny 98 / pennyswift 99 / pennylowlv 100 / pennynoskill 101 末尾序位（既有序位零位移）',
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
  ACH_LIST.findIndex((a) => a.id === 'unfllowlv') === 96 &&
  ACH_LIST.findIndex((a) => a.id === 'unflnopo') === 97 &&
  ACH_LIST.findIndex((a) => a.id === 'unflpenny') === 98 &&
  ACH_LIST.findIndex((a) => a.id === 'pennyswift') === 99 &&
  ACH_LIST.findIndex((a) => a.id === 'pennylowlv') === 100 &&
  ACH_LIST.findIndex((a) => a.id === 'pennynoskill') === 101);

// —— 既有挑战向家族对照（hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv/pennynoskill 二十七档独立互不干扰）——
const _a = (id) => ACH_LIST.find((x) => x.id === id);
ok('hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv/pennynoskill 二十七档独立（难度 vs 姿态 vs 速通 vs 低等级 vs 零用药 vs 零消费 vs 零阵亡 vs 硬核复合六态 vs 零用技 vs 交叉区十四态）',
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
  _a('unfllowlv').ok({ trueBoss: true, deaths: 0, level: 9 }) === true &&
  _a('unflnopo').ok({ trueBoss: true, deaths: 0, potionUses: 0 }) === true &&
  _a('unflpenny').ok({ trueBoss: true, deaths: 0, spent: 0 }) === true &&
  _a('pennyswift').ok({ trueBoss: true, spent: 0, battles: 70 }) === true &&
  _a('pennylowlv').ok({ trueBoss: true, spent: 0, level: 9 }) === true &&
  ach.ok({ trueBoss: true, spent: 0, casts: 0 }) === true);
ok('零消费×零用技交叉档必同时满足 penny 与 noskill（本枚是其交叉区唯一纪念——spent 与 casts 双源同判）',
  _a('penny').ok({ trueBoss: true, spent: 0, casts: 0 }) === true &&
  _a('noskill').ok({ trueBoss: true, spent: 0, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, spent: 0, casts: 0 }) === true);
ok('花过金 → pennynoskill 与 penny 同不解锁（spent 严格分区——花过即永久无缘，noskill 仍亮）',
  _a('penny').ok({ trueBoss: true, spent: 1, casts: 0 }) === false &&
  _a('noskill').ok({ trueBoss: true, spent: 1, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, spent: 1, casts: 0 }) === false);
ok('放过技 → pennynoskill 与 noskill 同不解锁（casts 严格分区——放过即永久无缘，penny 仍亮）',
  _a('noskill').ok({ trueBoss: true, spent: 0, casts: 1 }) === false &&
  _a('penny').ok({ trueBoss: true, spent: 0, casts: 1 }) === true &&
  ach.ok({ trueBoss: true, spent: 0, casts: 1 }) === false);
ok('困难 + 零消费 + 零用技也解锁 pennynoskill（本档难度通吃——不读 diff，与 penny/noskill/pennyswift 同源）',
  ach.ok({ trueBoss: true, diff: 1, spent: 0, casts: 0 }) === true);
ok('困难 + 零消费 + 零用技：frugal 亮而 pennynoskill 同亮、noskill2 亮而 pennynoskill 同亮（难度复合档与交叉档在困难零消费零用技下灯向一致）',
  _a('frugal').ok({ trueBoss: true, diff: 1, spent: 0, casts: 0 }) === true &&
  _a('noskill2').ok({ trueBoss: true, diff: 1, spent: 0, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, spent: 0, casts: 0 }) === true);
ok('零阵亡 + 零消费 + 零用技：unflpenny / unflskill 亮而 pennynoskill 同亮（spent/casts 同源,deaths 分源可同亮）',
  _a('unflpenny').ok({ trueBoss: true, deaths: 0, spent: 0, casts: 0 }) === true &&
  _a('unflskill').ok({ trueBoss: true, deaths: 0, spent: 0, casts: 0 }) === true &&
  _a('unflicker').ok({ trueBoss: true, deaths: 0 }) === true &&
  ach.ok({ trueBoss: true, spent: 0, casts: 0, deaths: 1 }) === true);
ok('零消费 + 七十场内 + 零用技：pennyswift 亮而 pennynoskill 同亮（两枚 spent 同源、battles/casts 分源可同亮）',
  _a('pennyswift').ok({ trueBoss: true, spent: 0, battles: 70, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, spent: 0, battles: 90, casts: 0 }) === true);
ok('零消费 + 未及十级 + 零用技：pennylowlv 亮而 pennynoskill 同亮（两枚 spent 同源、level/casts 分源可同亮）',
  _a('pennylowlv').ok({ trueBoss: true, spent: 0, level: 9, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, spent: 0, level: 9, casts: 0 }) === true);
ok('零消费 + 未及十级 + 没有用技：lowskill 不读 spent 而 pennynoskill 不读 level（两枚分源可同亮）',
  _a('lowskill').ok({ trueBoss: true, level: 9, casts: 0, spent: 1 }) === true &&
  ach.ok({ trueBoss: true, spent: 0, level: 9, casts: 0 }) === true);
ok('零消费 + 零用技 + 战斗用过药：nopotskill 不读 spent 而 pennynoskill 不读 potionUses（两枚分源可同亮）',
  _a('nopotskill').ok({ trueBoss: true, casts: 0, potionUses: 0, spent: 1 }) === true &&
  ach.ok({ trueBoss: true, spent: 0, potionUses: 1, casts: 0 }) === true);
ok('零消费 + 零用技 + 升过十级：swiftlv 不读 spent/casts 而 pennynoskill 不读 level（升过十级只锁 lowlv 系、pennynoskill 照亮）',
  _a('swiftlv').ok({ trueBoss: true, battles: 70, level: 9, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, spent: 0, level: 12, casts: 0 }) === true);
ok('spend 一掷千金正向里程碑档不解锁 pennynoskill（累计 SPEND_GOAL 金照常解锁一掷千金、pennynoskill 只认零消费）',
  ach.ok({ trueBoss: true, spent: 0, casts: 0 }) === true &&
  _a('spend').ok({ spent: SPEND_GOAL }) === true &&
  ach.ok({ trueBoss: true, spent: 1, casts: 0 }) === false);
ok('cast 熟能生巧正向里程碑档不解锁 pennynoskill（累计 CAST_GOAL 次照常解锁熟能生巧、pennynoskill 只认零用技）',
  ach.ok({ trueBoss: true, spent: 0, casts: 0 }) === true &&
  _a('cast').ok({ casts: CAST_GOAL }) === true &&
  ach.ok({ trueBoss: true, spent: 0, casts: 1 }) === false);

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
  const h = freshHero({ trueBoss: true, spent: 0, casts: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 零消费零用技真结局档 newly 含 pennynoskill（既有通路自动跟随）',
    newly.includes('pennynoskill'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, spent: 1, casts: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 花过金档 newly 不含 pennynoskill（不误解锁，spent 维严格）',
    !newly.includes('pennynoskill'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, spent: 0, casts: 1 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 放过技档 newly 不含 pennynoskill（不误解锁，casts 维严格）',
    !newly.includes('pennynoskill'), JSON.stringify(newly));
}
{
  const h = freshHero({ spent: 0, casts: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 未通关档 newly 不含 pennynoskill（不误解锁）',
    !newly.includes('pennynoskill'), JSON.stringify(newly));
}

// —— applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等）——
{
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    const h = freshHero({ trueBoss: true, spent: 0, casts: 0 });
    S.G = h;
    applyAchievements();
    ok('applyAchievements 真实解锁落 hero.ach（含 pennynoskill）', h.ach.includes('pennynoskill'), JSON.stringify(h.ach));
    ok('解锁横幅报成就名【白手素手】', msgs.some((m) => m.includes('🔓 成就解锁：') && m.includes('白手素手')), msgs.join(' | '));
    const len1 = msgs.length;
    applyAchievements();
    ok('幂等：重复调用不再报（已解锁去重）', msgs.length === len1 && msgs.filter((m) => m.includes('白手素手')).length === 1, String(msgs.length));
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
    const h = freshHero({ trueBoss: true, spent: 1, casts: 0 });
    S.G = h;
    applyAchievements();
    ok('花过金 applyAchievements 零 pennynoskill 解锁零「白手素手」横幅（不误解锁）',
      !h.ach.includes('pennynoskill') && !msgs.some((m) => m.includes('白手素手')), JSON.stringify({ ach: h.ach, msgs }));
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
    const h = freshHero({ trueBoss: true, spent: 0, casts: 1 });
    S.G = h;
    applyAchievements();
    ok('放过技 applyAchievements 零 pennynoskill 解锁零「白手素手」横幅（不误解锁）',
      !h.ach.includes('pennynoskill') && !msgs.some((m) => m.includes('白手素手')), JSON.stringify({ ach: h.ach, msgs }));
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}

// —— 源级零变化：battle.js 无新增写点 + data.js SPEND_GOAL/CAST_GOAL 常量（既有，本版未动）——
ok('battle.js 未新增任何 gamelogic 计数写点（startBattle battles 与 doSkill casts 皆既有、本版零改动）',
  (battleSrc.match(/\.level = /g) || []).length === 0, String((battleSrc.match(/\.level = /g) || []).length));
ok('data.js SPEND_GOAL 常量仍为 1000（单一数据源，与 penny/frugal/spend/unflpenny/pennyswift/pennylowlv 同读一份源）',
  dataSrc.includes('const SPEND_GOAL = 1000;'));
ok('data.js CAST_GOAL 常量仍为 30（单一数据源，与 cast/noskill/noskill2/lowskill/swiftskill/nopotskill/unflskill 同读一份源）',
  dataSrc.includes('const CAST_GOAL = 30;'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径为三百九十六件套（三百九十五件套清除）',
  readme.includes('扩充为冒烟三百九十六件套（三百九十五件套清除）') && !readme.includes('扩充为冒烟三百八十七件套（三百八十四件套清除）'));
ok('README 含 v24.176 守护描述（白手素手新成就守护）', readme.includes('v24.175 起含「白手素手」新成就守护'));
ok('README 版本速览已为 v24.178 且成就计数 102', readme.includes('版本速览（v24.186）') && readme.includes('111 项成就'));
ok('README 成就计数双处口径 102 项（全部 111 项进度 + **111 项成就**，101 项清除）',
  readme.includes('全部 111 项进度') && readme.includes('**111 项成就**') && !readme.includes('**101 项成就**'));
ok('README tests 树收录 smoke_v24175_pennynoskill（含 v24.178 守护子句 + 串尾）',
  readme.includes('v24.175 起含「白手素手」新成就守护') && readme.includes('smoke_v24175_pennynoskill'));
ok('README 含 smoke_v24175_pennynoskill 入库（386 份）', readme.includes('smoke_v24175_pennynoskill 入库（386 份）'));
ok('package.json 已收录 smoke_v24175_pennynoskill.mjs 且位于串尾（在 pennylowlv 之后）',
  pkg.includes('smoke_v24175_pennynoskill.mjs') &&
  pkg.includes('node tests/smoke_v24174_pennylowlv.mjs && node tests/smoke_v24175_pennynoskill.mjs && node tests/smoke_v24176_pennynopo.mjs && node tests/smoke_v24177_unflswift2.mjs && node tests/smoke_v24178_unflpenny2.mjs && node tests/smoke_v24179_unflnopo2.mjs && node tests/smoke_v24180_unflskill2.mjs && node tests/smoke_v24181_lampoilquest.mjs && node tests/smoke_v24183_unfllowlv2.mjs && node tests/smoke_v24184_pennyswift2.mjs && node tests/smoke_v24185_pennylowlv2.mjs && node tests/smoke_v24186_pennynoskill2.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 386 件套', testChain === 396, String(testChain));
ok('CHANGELOG 含 v24.178 顶条目', changelog.startsWith('## v24.186'));

// —— 哨兵链：README 已有 386 口径且尚无 387（前望 397 语义：下一版才写 387）——
ok('README 已有三百八十九件套口径且尚无 387（哨兵前望 397 语义：下一版才写 387）',
  readme.includes('扩充为冒烟三百九十六件套（三百九十五件套清除）') && !readme.includes('三百九十七件套'));
{
  const s24143 = read('tests/smoke_v24143_furnacequest.mjs');
  ok('smoke_v24143 哨兵链前望 397（三百九十七件套否定式）',
    s24143.includes('哨兵链前望 397') && s24143.includes('三百九十七件套否定式'));
}
{
  ok('smoke_v24174 姊妹件版本字面量 pin 已随新现实推进（v24.178）',
    read('tests/smoke_v24174_pennylowlv.mjs').includes("const GAME_VERSION = 'v24.186';"));
  ok('smoke_v24173 姊妹件版本字面量 pin 已随新现实推进（v24.178）',
    read('tests/smoke_v24173_pennyswift.mjs').includes("const GAME_VERSION = 'v24.186';"));
  ok('smoke_v24172 姊妹件版本字面量 pin 已随新现实推进（v24.178）',
    read('tests/smoke_v24172_unflpenny.mjs').includes("const GAME_VERSION = 'v24.186';"));
  ok('smoke_v24171 姊妹件版本字面量 pin 已随新现实推进（v24.178）',
    read('tests/smoke_v24171_unflnopo.mjs').includes("const GAME_VERSION = 'v24.186';"));
  ok('smoke_v24170 姊妹件版本字面量 pin 已随新现实推进（v24.178）',
    read('tests/smoke_v24170_unfllowlv.mjs').includes("const GAME_VERSION = 'v24.186';"));
  ok('smoke_v24169 姊妹件版本字面量 pin 已随新现实推进（v24.178）',
    read('tests/smoke_v24169_unflswift.mjs').includes("const GAME_VERSION = 'v24.186';"));
  ok('smoke_v2229 姊妹件版本恒等 pin 已随新现实推进（=== v24.178）',
    read('tests/smoke_v2229_metall.mjs').includes("GAME_VERSION === 'v24.186'"));
}

// —— 旧代 v24.176 字面量 / 385 件套口径 / 101 项 全库零残留扫描（豁免本套件 + 上一版 v24174 + 上上版 v24173 + 上上上版 v24172 + 更早版 v24171 + 更更早版 v24170）——
// v24170/24171/24172/24173/24174 五件是本轮级联的「前代公式链载体」：其 `!readme.includes('扩充为冒烟三百八十七件套（三百八十四件套清除）')`
// 负向断言由上轮 385 公式负向经本轮公式级联平移而成，是合法的逐代负向 pin，不得误报；v24175 自身自带同款负向与扫描目标。
// 注：101→102 扫描只认成就计数三形态（成就 N/101 / **101 项成就** / 全部 101 项进度）；「⚔️ 身经百战 N/100」「⚔️ 驱雾百战 N/100」
// 是 BATTLE_GOAL/HUNT2_GOAL 讨伐进度分母（与成就计数无关），不在扫描目标内。
const EXEMPT = new Set(['smoke_v24186_pennynoskill2.mjs', 'smoke_v24185_pennylowlv2.mjs', 'smoke_v24184_pennyswift2.mjs', 'smoke_v24177_unflswift2.mjs', 'smoke_v24176_pennynopo.mjs', 'smoke_v24175_pennynoskill.mjs', 'smoke_v24174_pennylowlv.mjs', 'smoke_v24173_pennyswift.mjs', 'smoke_v24172_unflpenny.mjs', 'smoke_v24171_unflnopo.mjs', 'smoke_v24170_unfllowlv.mjs']);
const leftovers = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests')).filter((x) => x.endsWith('.mjs') && !EXEMPT.has(x))) {
  const s = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  const code = s.split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  if (code.includes("const GAME_VERSION = 'v24.176'")) leftovers.push(f + ':gv');
  if (code.includes("GAME_VERSION === 'v24.176'")) leftovers.push(f + ':eq');
  if (code.includes("startsWith('## v24.176")) leftovers.push(f + ':st');
  if (code.includes('三百八十七件套（三百八十四件套清除）')) leftovers.push(f + ':385');
  if (code.includes('testChain === 387') || code.includes('files.length === 387') ||
      code.includes('treeTok.length === 387') || code.includes('chainAll.length === 387') ||
      code.includes('fileCount === 387'))
    leftovers.push(f + ':count');
  // 成就计数 101→102 零残留：只认「成就 N/101」/「**101 项成就**」/「全部 101 项进度」三形态
  // （「⚔️ 身经百战 N/100」「⚔️ 驱雾百战 N/100」是 BATTLE_GOAL/HUNT2_GOAL 讨伐进度分母非成就计数）。
  if (code.includes('成就 N/101') || code.includes('**101 项成就**') || code.includes('全部 101 项进度'))
    leftovers.push(f + ':101');
}
ok('旧代 v24.176 GAME_VERSION 字面量/恒等/顶 pin 全库零残留（哨兵链，豁免本套件 + v24174 + v24173 + v24172 + v24171 + v24170）',
  leftovers.filter((x) => x.endsWith(':gv') || x.endsWith(':eq') || x.endsWith(':st')).length === 0,
  JSON.stringify(leftovers));
ok('旧代 385 件套口径/计数/101 项 pin 全库零残留（哨兵链，豁免本套件 + v24174 + v24173 + v24172 + v24171 + v24170）',
  leftovers.filter((x) => x.endsWith(':385') || x.endsWith(':count') || x.endsWith(':101')).length === 0,
  JSON.stringify(leftovers));

if (failed) { console.log(`— v24.178 冒烟完成：${n} 项断言，失败 ${failed} —`); process.exit(1); }
console.log(`— v24.178 冒烟完成：${n} 项断言，失败 0 —`);
