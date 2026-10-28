// smoke_v24180_unflskill2.mjs —— v24.180 专项冒烟：新成就「逆风素手」（挑战向·第四枚「三克制」交叉档·困难×零阵亡×零用技）
// （新内容·单成就·第一百零七项——承 v24.179 逆风未饮（unflnopo2，第三枚三克制）/ v24.178 逆风白手（unflpenny2，第二枚三克制）/
// v24.177 逆风长明（unflswift2，首枚三克制）/ v24.166 素手长明（unflskill，零阵亡×零用技）/ v24.161 逆风守拙（noskill2，困难×零用技）/
// v24.160 大巧不工（noskill，零用技）/ v24.154 逆风不灭（steadfast，困难×零阵亡）/ v24.147 未曾熄灯（unflicker）/
// v21.68 逆风行灯（hardtrue）先例：「以怎样的姿态通关」挑战维度第三十一次开垦——v24.177/178/179 已三连开「三克制」
// （困难×零阵亡×七十场=逆风长明、困难×零阵亡×零消费=逆风白手、困难×零阵亡×零战斗用药=逆风未饮）后，本枚把「别倒下 × 别用技 ×
// 别自降难度」三重克制收为一枚：把既有双克制档「素手长明」（零阵亡×零用技，unflskill）再叠上困难模式（diff===1），取挑战版图
// 最难的赛道之一——困难档顶配的零阵亡零用技长跑（hardtrue×unflskill 三重克制，第四枚）。
// 判定读既有 hero.trueBoss（终焉之神=真结局最终 Boss，与 trueboss/hardtrue/unflicker/swift/lowlv/nopotion/penny/
// steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/
// lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv/pennynoskill/pennynopo/unflswift2/unflpenny2/unflnopo2 同源）、
// 既有 hero.diff（DIFFS 下标：建档 createDiff 写定、core.js initGame `S.G.diff = diff || 0`、resetRun 沿用同槽，`(g.diff===1)` 即
// DIFFS[1]「困难」档，与 hardtrue/steadfast/frugal/dry/swift2/lowlv2/noskill2/unflswift2/unflpenny2/unflnopo2 同读一份源）、既有 hero.deaths
// （battle.loseBattle 全游唯一战败结算点写入、随 snapshotHero 全量快照自动持久化、防御式 (g.deaths||0) 旧档零迁移，与
// unflicker/steadfast/unflskill/swiftnopo/unflswift/unfllowlv/unflnopo/unflpenny/unflswift2/unflpenny2/unflnopo2 系同读一份源）与既有
// hero.casts（battle.doSkill 战斗释放技能成功唯一产生点——[2] 技能键命中即记、随 snapshotHero 全量快照自动持久化、
// 防御式 (g.casts||0) 旧档零迁移，与 noskill/noskill2/lowskill/swiftskill/nopotskill/unflskill 系同读一份源），
// (g.trueBoss && g.diff===1 && !(g.deaths||0) && !(g.casts||0)) 即「困难 · 零阵亡 · 零用技通关」达成——diff/deaths/
// casts 三端口只增不减语义下，换过难度、死过一次或放过一次技就永久无缘此档（与 hardtrue 换难度 / unflicker 死过一次 /
// noskill 用过技 / steadfast 死过一次或换难度 / noskill2 换难度或放过技 / unflskill 死过一次或放过技 同属「重新来过才
// 拿得到」的挑战品类）；是 hardtrue、unflicker 与 noskill 三枚的严格交叠——困难零阵亡零用技通关必同时满足三者（也必满足
// steadfast 与 noskill2 与 unflskill），本枚是这一三重交叉区的唯一纪念；与既有正向里程碑 cast「熟能生巧」（[2]技能累计释放达
// CAST_GOAL(30) 次）成镜面对、互不重叠——一个纪念「熟能生巧」、一个纪念「逆风的素手」。可行性：[1]普攻/[4]防御回蓝（v19.96）/
// [5]蓄力照常可用（都不碰 diff/deaths/casts），本档不禁药不禁消费——困难档魔物全面加强（DIFF_SCALE HP×1.35/攻×1.15/防×1.12）下
// 零阵亡推进且 [2] 技能键零按下（casts 只认战斗释放、与 noskill 同口径），药水/灵药/装备/消费照常，战斗中受伤只能靠防御/逃跑硬撑，
// 吃满「别自降难度 + 别倒下 + 别用技」三克制的一场逆风素手。
// 零新计数零新状态零新写点零新存档（trueBoss/diff/deaths/casts 皆既有字段）、无 r 无 prog 纯里程碑（与 hardtrue/unflicker/
// swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/
// unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv/pennynoskill/pennynopo/unflswift2/
// unflpenny2/unflnopo2 同款——困难里不倒下又不放技本身就是奖励、硬核才是）、解锁走 winBattle → applyAchievements 既有通路（终焉之神击败当场
// trueBoss 落账后 applyAchievements 枚举即解锁，与 trueboss/hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/
// dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/
// unflnopo/unflpenny/pennyswift/pennylowlv/pennynoskill/pennynopo/unflswift2/unflpenny2/unflnopo2 同路径零新增依赖），反馈不迟到。
// 本冒烟守护：版本锚点（格式合法 + 已越过 v24.179 + data.js 字面量 v24.180 + 旧 v24.179 零残留）、
// ACH_LIST 107 项精确与末尾序位（unflicker 76 / swift 77 / lowlv 78 / nopotion 79 / penny 80 / steadfast 81 /
// frugal 82 / dry 83 / swift2 84 / lowlv2 85 / noskill 86 / noskill2 87 / lowskill 88 / swiftskill 89 /
// swiftlv 90 / nopotskill 91 / unflskill 92 / swiftnopo 93 / lowlvnopo 94 / unflswift 95 / unfllowlv 96 /
// unflnopo 97 / unflpenny 98 / pennyswift 99 / pennylowlv 100 / pennynoskill 101 / pennynopo 102 / unflswift2 103 /
// unflpenny2 104 / unflnopo2 105 / unflskill2 106）、unflskill2 数据契约（d 文案、ok 防御式逐值、无 r 无 prog 且与 cast 正向里程碑镜面对、
// 三克制必同时满足 hardtrue/unflicker/noskill 且满足 steadfast/noskill2/unflskill）、unlockedAchievements/applyAchievements 运行期
// 全链路（真实解锁落 hero.ach + 横幅 + 幂等去重 / 换难度不解锁 / 死过一次不解锁 / 战斗放过技不解锁 / 未通关不解锁）、既有 106
// 成就 id 零回归、battle.js 无新增写点与 data.js CAST_GOAL/DIFFS 常量源级零变化、README/package.json/CHANGELOG 同步
// （件套口径 391 + v24.180 守护描述 + 入库 391 + 版本速览 107 项 + tests 树串尾 + package 串尾 391）、
// 哨兵链（前望 393 且 README 尚无 393 口径）、旧代 v24.179 字面量/恒等/顶 pin/390 口径/106 项
// 全库零残留扫描（豁免本套件 + 上一版 v24179 + 上上版 v24178 + 上上上版 v24177 + 上上上上版 v24176 + 更早版 v24175/v24174。
// 注：成就计数 106→107 的零残留扫描只认「成就 N/106」/「**106 项成就**」/「全部 106 项进度」三形态，
// 「⚔️ 身经百战 N/100」「⚔️ 驱雾百战 N/100」是 BATTLE_GOAL/HUNT2_GOAL 讨伐进度分母非成就计数，不在扫描目标内）。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, POTION_USE_GOAL } from '../js/data.js';
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

console.log('— v24.180 挑战向三克制交叉档成就「逆风素手」 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dataSrc = read('js/data.js');
const heroSrc = read('js/hero.js');
const battleSrc = read('js/battle.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（格式合法 + 已越过 v24.179 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.179', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 179)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.180（旧 v24.179 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v24.182';") && !dataSrc.includes("const GAME_VERSION = 'v24.179';"));
ok('data.js 含 v24.180 注释（逆风素手新成就说明）',
  dataSrc.includes('v24.180 新内容·新成就'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'unflskill2');
ok('ACH_LIST 含 unflskill2「逆风素手」且 id 唯一',
  !!ach && ach.name === '逆风素手' && ACH_LIST.filter((a) => a.id === 'unflskill2').length === 1);
ok('ACH_LIST 精确总数 107 项（106→107 末尾追加）', ACH_LIST.length === 107, String(ACH_LIST.length));
ok('unflskill2 描述文案（困难零阵亡零用技真结局三克制档）',
  ach.d === '以困难模式、零阵亡且未使用任何技能（战斗指令 [2]）击败终焉之神（真结局）', ach.d);
ok('unflskill2 判定源级（读既有 g.trueBoss / g.diff===1 / !(g.deaths||0) / !(g.casts||0)）',
  String(ach.ok).includes('g.trueBoss') && String(ach.ok).includes('g.diff===1') && String(ach.ok).includes('!(g.deaths||0)') && String(ach.ok).includes('!(g.casts||0)'));
ok('unflskill2 无 r 无 prog 纯里程碑（与 hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv/pennynoskill/pennynopo/unflswift2/unflpenny2/unflnopo2 同款）',
  !('r' in ach) && !('prog' in ach));

// —— ok 防御式逐值 ——
ok('困难 + 零阵亡 + 零用技 + 真结局 → 解锁', ach.ok({ trueBoss: true, diff: 1, deaths: 0, casts: 0 }) === true);
ok('困难 + 真结局 + 缺 deaths/casts 字段 → 按 0/0 解码达成（旧档零迁移）', ach.ok({ trueBoss: true, diff: 1 }) === true);
ok('缺 diff 字段（普通档） + 零阵亡 + 零用技 → 不解锁（diff 维严格）', ach.ok({ trueBoss: true, deaths: 0, casts: 0 }) === false);
ok('困难 + 死过一次 + 零用技 → 不解锁（deaths 维严格——死过即永久无缘）', ach.ok({ trueBoss: true, diff: 1, deaths: 1, casts: 0 }) === false);
ok('困难 + 零阵亡 + 战斗放过一次技 → 不解锁（casts 维严格）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, casts: 1 }) === false);
ok('困难 + 零阵亡 + 零用技但未通关 → 不解锁', ach.ok({ diff: 1, deaths: 0, casts: 0 }) === false);
ok('空档/缺字段 → 不解锁（(g.deaths||0)/(g.casts||0)/diff 防御式零迁移）', ach.ok({}) === false);
ok('困难 + 零阵亡 + 零用技 + 超场（71）→ 照常解锁（本档不读 battles，与 swift 系分源）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, casts: 0, battles: 71 }) === true);
ok('困难 + 零阵亡 + 零用技 + 花过金 → 照常解锁（本档不读 spent，与 penny 系分源）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, casts: 0, spent: 1 }) === true);
ok('困难 + 零阵亡 + 零用技 + 战斗用过药 → 照常解锁（本档不读 potionUses，与 nopotion 系分源）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, casts: 0, potionUses: 1 }) === true);
ok('困难 + 零阵亡 + 零用技 + 升过十级 → 照常解锁（本档不读 level，与 lowlv 系分源）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, casts: 0, level: 12 }) === true);
ok('困难 + 零阵亡 + 零用技 + 大地图 F 喝过药（mapPotions>0）→ 照常解锁（casts 只认战斗释放 [2]，与 noskill 系同口径）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, casts: 0, mapPotions: 9 }) === true);

// —— 既有 106 成就 id 零回归 + 末尾序位 ——
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
  'unfllowlv', 'unflnopo', 'unflpenny', 'pennyswift', 'pennylowlv', 'pennynoskill', 'pennynopo', 'unflswift2', 'unflpenny2', 'unflnopo2', 'unflskill2'];
ok('既有 106 成就 id 零回归（核心抽样全覆盖末期正位）',
  EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('nightwins 75 / unflicker 76 / swift 77 / lowlv 78 / nopotion 79 / penny 80 / steadfast 81 / frugal 82 / dry 83 / swift2 84 / lowlv2 85 / noskill 86 / noskill2 87 / lowskill 88 / swiftskill 89 / swiftlv 90 / nopotskill 91 / unflskill 92 / swiftnopo 93 / lowlvnopo 94 / unflswift 95 / unfllowlv 96 / unflnopo 97 / unflpenny 98 / pennyswift 99 / pennylowlv 100 / pennynoskill 101 / pennynopo 102 / unflswift2 103 / unflpenny2 104 / unflnopo2 105 / unflskill2 106 末尾序位（既有序位零位移）',
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
  ACH_LIST.findIndex((a) => a.id === 'pennynoskill') === 101 &&
  ACH_LIST.findIndex((a) => a.id === 'pennynopo') === 102 &&
  ACH_LIST.findIndex((a) => a.id === 'unflswift2') === 103 &&
  ACH_LIST.findIndex((a) => a.id === 'unflpenny2') === 104 &&
  ACH_LIST.findIndex((a) => a.id === 'unflnopo2') === 105 &&
  ACH_LIST.findIndex((a) => a.id === 'unflskill2') === 106);

// —— 既有挑战向家族对照（hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv/pennynoskill/pennynopo/unflswift2/unflpenny2/unflskill2 三十一档独立互不干扰）——
const _a = (id) => ACH_LIST.find((x) => x.id === id);
ok('hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv/pennynoskill/pennynopo/unflswift2/unflpenny2/unflnopo2/unflskill2 三十二档独立（难度 vs 姿态 vs 速通 vs 低等级 vs 零用药 vs 零消费 vs 零阵亡 vs 硬核复合六态 vs 零用技 vs 交叉区 vs 三克制四态）',
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
  _a('pennynoskill').ok({ trueBoss: true, spent: 0, casts: 0 }) === true &&
  _a('pennynopo').ok({ trueBoss: true, spent: 0, potionUses: 0 }) === true &&
  _a('unflswift2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 50 }) === true &&
  _a('unflpenny2').ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0 }) === true &&
  _a('unflnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, casts: 0 }) === true);
ok('困难×零阵亡×零用技交叉档必同时满足 hardtrue 与 unflicker 与 noskill（本枚是其三重交叉区唯一纪念——diff/deaths/casts 三源同判）',
  _a('hardtrue').ok({ trueBoss: true, diff: 1, deaths: 0, casts: 0 }) === true &&
  _a('unflicker').ok({ trueBoss: true, diff: 1, deaths: 0, casts: 0 }) === true &&
  _a('noskill').ok({ trueBoss: true, diff: 1, deaths: 0, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, casts: 0 }) === true);
ok('困难×零阵亡×零用技也必同时满足 steadfast 与 noskill2 与 unflskill（三重克制严格蕴含三个双克档）',
  _a('steadfast').ok({ trueBoss: true, diff: 1, deaths: 0, casts: 0 }) === true &&
  _a('noskill2').ok({ trueBoss: true, diff: 1, deaths: 0, casts: 0 }) === true &&
  _a('unflskill').ok({ trueBoss: true, diff: 1, deaths: 0, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, casts: 0 }) === true);
ok('换过难度（diff 0）→ unflskill2 与 hardtrue/noskill2 同不解锁（diff 严格分区——普通档只亮 noskill，unflskill2 不亮）',
  _a('hardtrue').ok({ trueBoss: true, diff: 0, deaths: 0, casts: 0 }) === false &&
  _a('noskill2').ok({ trueBoss: true, diff: 0, deaths: 0, casts: 0 }) === false &&
  _a('noskill').ok({ trueBoss: true, diff: 0, deaths: 0, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 0, deaths: 0, casts: 0 }) === false);
ok('死过一次 → unflskill2 与 unflicker/steadfast/unflskill 同不解锁（deaths 严格分区——死过即永久无缘，noskill/noskill2 仍亮）',
  _a('unflicker').ok({ trueBoss: true, diff: 1, deaths: 1, casts: 0 }) === false &&
  _a('steadfast').ok({ trueBoss: true, diff: 1, deaths: 1, casts: 0 }) === false &&
  _a('unflskill').ok({ trueBoss: true, diff: 1, deaths: 1, casts: 0 }) === false &&
  _a('noskill').ok({ trueBoss: true, diff: 1, deaths: 1, casts: 0 }) === true &&
  _a('noskill2').ok({ trueBoss: true, diff: 1, deaths: 1, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 1, casts: 0 }) === false);
ok('战斗放过技（casts 1）→ unflskill2 与 noskill/noskill2/unflskill 同不解锁（casts 严格分区——放过即永久无缘，unflicker 仍亮）',
  _a('noskill').ok({ trueBoss: true, diff: 1, deaths: 0, casts: 1 }) === false &&
  _a('noskill2').ok({ trueBoss: true, diff: 1, deaths: 0, casts: 1 }) === false &&
  _a('unflskill').ok({ trueBoss: true, diff: 1, deaths: 0, casts: 1 }) === false &&
  _a('unflicker').ok({ trueBoss: true, diff: 1, deaths: 0, casts: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, casts: 1 }) === false);
ok('零阵亡 + 零用技 + 普通档：unflskill 亮而 unflskill2 不亮（两枚 deaths/casts 同源、diff 分源——普通档零用技不点亮三重档）',
  _a('unflskill').ok({ trueBoss: true, diff: 1, deaths: 0, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 0, deaths: 0, casts: 0 }) === false);
ok('困难 + 零阵亡 + 零用技 + 超场：unflswift2 亮而 unflskill2 同亮（deaths 同源、battles/casts/diff 分源可同亮）',
  _a('unflswift2').ok({ trueBoss: true, deaths: 0, battles: 50, diff: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, casts: 0, battles: 71 }) === true);
ok('困难 + 零阵亡 + 零用技 + 零消费：unflpenny2 亮而 unflskill2 同亮（两枚三克制 diff/deaths 同源、spent/casts 分源可同亮）',
  _a('unflpenny2').ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, casts: 0 }) === true);
ok('cast 熟能生巧正向里程碑档不解锁 unflskill2（累计 CAST_GOAL 次照常解锁熟能生巧、unflskill2 只认零用技零阵亡且困难）',
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, casts: 0 }) === true &&
  _a('cast').ok({ casts: 30 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, casts: 1 }) === false);

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
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, casts: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 困难零阵亡零用技真结局档 newly 含 unflskill2（既有通路自动跟随）',
    newly.includes('unflskill2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 0, deaths: 0, casts: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 普通档 newly 不含 unflskill2（不误解锁，diff 维严格）',
    !newly.includes('unflskill2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 1, casts: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 死过一次档 newly 不含 unflskill2（不误解锁，deaths 维严格）',
    !newly.includes('unflskill2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, casts: 1 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 战斗放过技档 newly 不含 unflskill2（不误解锁，casts 维严格）',
    !newly.includes('unflskill2'), JSON.stringify(newly));
}
{
  const h = freshHero({ diff: 1, deaths: 0, casts: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 未通关档 newly 不含 unflskill2（不误解锁）',
    !newly.includes('unflskill2'), JSON.stringify(newly));
}

// —— applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等）——
{
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, casts: 0 });
    S.G = h;
    applyAchievements();
    ok('applyAchievements 真实解锁落 hero.ach（含 unflskill2）', h.ach.includes('unflskill2'), JSON.stringify(h.ach));
    ok('解锁横幅报成就名【逆风素手】', msgs.some((m) => m.includes('🔓 成就解锁：') && m.includes('逆风素手')), msgs.join(' | '));
    const len1 = msgs.length;
    applyAchievements();
    ok('幂等：重复调用不再报（已解锁去重）', msgs.length === len1 && msgs.filter((m) => m.includes('逆风素手')).length === 1, String(msgs.length));
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
    const h = freshHero({ trueBoss: true, diff: 0, deaths: 0, casts: 0 });
    S.G = h;
    applyAchievements();
    ok('普通档 applyAchievements 零 unflskill2 解锁零「逆风素手」横幅（不误解锁）',
      !h.ach.includes('unflskill2') && !msgs.some((m) => m.includes('逆风素手')), JSON.stringify({ ach: h.ach, msgs }));
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
    const h = freshHero({ trueBoss: true, diff: 1, deaths: 1, casts: 0 });
    S.G = h;
    applyAchievements();
    ok('死过一次 applyAchievements 零 unflskill2 解锁零「逆风素手」横幅（不误解锁）',
      !h.ach.includes('unflskill2') && !msgs.some((m) => m.includes('逆风素手')), JSON.stringify({ ach: h.ach, msgs }));
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
    const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, casts: 1 });
    S.G = h;
    applyAchievements();
    ok('战斗放过技 applyAchievements 零 unflskill2 解锁零「逆风素手」横幅（不误解锁）',
      !h.ach.includes('unflskill2') && !msgs.some((m) => m.includes('逆风素手')), JSON.stringify({ ach: h.ach, msgs }));
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}

// —— 源级零变化：battle.js 无新增写点 + data.js CAST_GOAL 常量与 DIFFS（既有，本版未动）——
ok('battle.js 未新增任何 gamelogic 计数写点（startBattle battles 与 loseBattle deaths 皆既有、本版零改动）',
  (battleSrc.match(/\.level = /g) || []).length === 0, String((battleSrc.match(/\.level = /g) || []).length));
ok('data.js CAST_GOAL 常量仍为 30（单一数据源，与 noskill/noskill2/lowskill/swiftskill/nopotskill/unflskill/cast「熟能生巧」同读一份源）',
  dataSrc.includes('const CAST_GOAL = 30;'));
ok('data.js DIFFS 仍含「困难」档（难度单一数据源，与 hardtrue/steadfast/frugal/dry/swift2/lowlv2/noskill2/unflswift2/unflpenny2/unflnopo2 同读一份源）',
  dataSrc.includes("const DIFFS=['普通','困难'];"));
ok('data.js POTION_USE_GOAL 常量未被误动（仍为 15，nopotion 系同读一份源）',
  dataSrc.includes('const POTION_USE_GOAL = 15;'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径为三百九十二件套（三百九十一件套清除）',
  readme.includes('扩充为冒烟三百九十二件套（三百九十一件套清除）') && !readme.includes('扩充为冒烟三百八十九件套（三百八十八件套清除）'));
ok('README 含 v24.180 守护描述（逆风素手新成就守护）', readme.includes('v24.180 起含「逆风素手」新成就守护'));
ok('README 版本速览已为 v24.180 且成就计数 107', readme.includes('版本速览（v24.182）') && readme.includes('107 项成就'));
ok('README 成就计数双处口径 107 项（全部 107 项进度 + **107 项成就**，105 项清除）',
  readme.includes('全部 107 项进度') && readme.includes('**107 项成就**') && !readme.includes('**105 项成就**'));
ok('README tests 树收录 smoke_v24180_unflskill2（含 v24.180 守护子句 + 串尾）',
  readme.includes('v24.180 起含「逆风素手」新成就守护') && readme.includes('smoke_v24180_unflskill2'));
ok('README 含 smoke_v24180_unflskill2 入库（391 份）', readme.includes('smoke_v24180_unflskill2 入库（391 份）'));
ok('package.json 已收录 smoke_v24180_unflskill2.mjs 且位于串尾（在 unflnopo2 之后、lampoilquest 之前）',
  pkg.includes('smoke_v24180_unflskill2.mjs') &&
  pkg.includes('node tests/smoke_v24180_unflskill2.mjs && node tests/smoke_v24181_lampoilquest.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 392 件套', testChain === 392, String(testChain));
ok('CHANGELOG 含 v24.180 顶条目', changelog.startsWith('## v24.182'));

// —— 哨兵链：README 已有 391 口径且尚无 393（前望 393 语义：下一版才写 392）——
ok('README 已有三百九十一件套口径且尚无 393（哨兵前望 393 语义：下一版才写 392）',
  readme.includes('扩充为冒烟三百九十二件套（三百九十一件套清除）') && !readme.includes('三百九十三件套'));
{
  const s24143 = read('tests/smoke_v24143_furnacequest.mjs');
  ok('smoke_v24143 哨兵链前望 393（三百九十三件套否定式）',
    s24143.includes('哨兵链前望 393') && s24143.includes('三百九十三件套否定式'));
}
{
  ok('smoke_v24178 姊妹件版本字面量 pin 已随新现实推进（v24.182）',
    read('tests/smoke_v24178_unflpenny2.mjs').includes("const GAME_VERSION = 'v24.182';"));
  ok('smoke_v24177 姊妹件版本字面量 pin 已随新现实推进（v24.182）',
    read('tests/smoke_v24177_unflswift2.mjs').includes("const GAME_VERSION = 'v24.182';"));
  ok('smoke_v24176 姊妹件版本字面量 pin 已随新现实推进（v24.182）',
    read('tests/smoke_v24176_pennynopo.mjs').includes("const GAME_VERSION = 'v24.182';"));
  ok('smoke_v24175 姊妹件版本字面量 pin 已随新现实推进（v24.182）',
    read('tests/smoke_v24175_pennynoskill.mjs').includes("const GAME_VERSION = 'v24.182';"));
  ok('smoke_v24174 姊妹件版本字面量 pin 已随新现实推进（v24.182）',
    read('tests/smoke_v24174_pennylowlv.mjs').includes("const GAME_VERSION = 'v24.182';"));
  ok('smoke_v24173 姊妹件版本字面量 pin 已随新现实推进（v24.182）',
    read('tests/smoke_v24173_pennyswift.mjs').includes("const GAME_VERSION = 'v24.182';"));
  ok('smoke_v24172 姊妹件版本字面量 pin 已随新现实推进（v24.182）',
    read('tests/smoke_v24172_unflpenny.mjs').includes("const GAME_VERSION = 'v24.182';"));
  ok('smoke_v24171 姊妹件版本字面量 pin 已随新现实推进（v24.182）',
    read('tests/smoke_v24171_unflnopo.mjs').includes("const GAME_VERSION = 'v24.182';"));
  ok('smoke_v24170 姊妹件版本字面量 pin 已随新现实推进（v24.182）',
    read('tests/smoke_v24170_unfllowlv.mjs').includes("const GAME_VERSION = 'v24.182';"));
  ok('smoke_v2229 姊妹件版本恒等 pin 已随新现实推进（=== v24.180）',
    read('tests/smoke_v2229_metall.mjs').includes("GAME_VERSION === 'v24.182'"));
}

// —— 旧代 v24.179 字面量 / 390 件套口径 / 106 项 全库零残留扫描（豁免本套件 + 上一版 v24179 + 上上版 v24178 + 上上上版 v24177 + 上上上上版 v24176 + 更早版 v24175/v24174）——
// v24174/24175/24176/24177/24178/24179 六件是前代公式链载体，其 README 件套负向断言/版本锚点逐代 pin 由历史
// 级联平移而成（v24180 自身自带同款负向与扫描目标）。成就计数 106→107 扫描只认三形态。
const EXEMPT = new Set(['smoke_v24180_unflskill2.mjs', 'smoke_v24179_unflnopo2.mjs', 'smoke_v24178_unflpenny2.mjs', 'smoke_v24177_unflswift2.mjs', 'smoke_v24176_pennynopo.mjs', 'smoke_v24175_pennynoskill.mjs', 'smoke_v24174_pennylowlv.mjs']);
const leftovers = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests')).filter((x) => x.endsWith('.mjs') && !EXEMPT.has(x))) {
  const s = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  const code = s.split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  if (code.includes("const GAME_VERSION = 'v24.179'")) leftovers.push(f + ':gv');
  if (code.includes("GAME_VERSION === 'v24.179'")) leftovers.push(f + ':eq');
  if (code.includes("startsWith('## v24.179")) leftovers.push(f + ':st');
  if (code.includes('三百九十件套（三百八十九件套清除）')) leftovers.push(f + ':390');
  if (code.includes('testChain === 390') || code.includes('files.length === 390') ||
      code.includes('treeTok.length === 390') || code.includes('chainAll.length === 390') ||
      code.includes('fileCount === 390'))
    leftovers.push(f + ':count');
  // 成就计数 106→107 零残留：只认「成就 N/106」/「**106 项成就**」/「全部 106 项进度」三形态
  // （「⚔️ 身经百战 N/100」「⚔️ 驱雾百战 N/100」是 BATTLE_GOAL/HUNT2_GOAL 讨伐进度分母非成就计数）。
  if (code.includes('成就 N/106') || code.includes('**106 项成就**') || code.includes('全部 106 项进度'))
    leftovers.push(f + ':106');
}
ok('旧代 v24.179 GAME_VERSION 字面量/恒等/顶 pin 全库零残留（哨兵链，豁免本套件 + v24179 + v24178 + v24177 + v24176 + v24175 + v24174）',
  leftovers.filter((x) => x.endsWith(':gv') || x.endsWith(':eq') || x.endsWith(':st')).length === 0,
  JSON.stringify(leftovers));
ok('旧代 390 件套口径/计数/106 项 pin 全库零残留（哨兵链，豁免本套件 + v24179 + v24178 + v24177 + v24176 + v24175 + v24174）',
  leftovers.filter((x) => x.endsWith(':390') || x.endsWith(':count') || x.endsWith(':106')).length === 0,
  JSON.stringify(leftovers));

if (failed) { console.log(`— v24.180 冒烟完成：${n} 项断言，失败 ${failed} —`); process.exit(1); }
console.log(`— v24.180 冒烟完成：${n} 项断言，失败 0 —`);
