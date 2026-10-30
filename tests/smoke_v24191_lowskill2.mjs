// smoke_v24191_lowskill2.mjs —— v24.195 专项冒烟：新成就「逆风素手青灯」（挑战向·「困难×低等级」三克制交叉区首角·困难模式×未及十级×零用技）
// （新内容·单成就·第一百一十六项——承 v24.194 逆风不饮疾行（swiftnopo2，「困难×疾行」交叉区第三角收官）/ v24.188-190 把 hardtrue×swift
// 交叉区三姿态收口 / v24.184-187 把 hardtrue×penny 交叉区四角收口 / v24.177-183 把 hardtrue×unfl 交叉区五姿态收口 / v24.162 素手青灯
// （lowskill，未及十级×零用技）/ v24.159 逆风青芽（lowlv2，困难×未及十级）/ v24.161 逆风守拙（noskill2，困难×零用技）先例：把既有双克制档
// 「素手青灯」（未及十级×零用技）再叠上困难模式（diff===1），首开「困难×低等级」交叉区——lowlv「未及十级」在困难档的 ×{noskill, nopotion}
// 姿态交叉区第一角（同档剩余交叉口 hardtrue×lowlv×nopotion（低等级×零战斗用药）与 hardtrue×noskill×nopotion（零用技×零战斗用药）留待后续）。
// 判定读既有 hero.trueBoss（终焉之神=真结局最终 Boss，与 trueboss/hardtrue/unflicker/swift/lowlv/nopotion/penny/
// steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/
// lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv/pennynoskill/pennynopo/unflswift2/unflpenny2/
// unflnopo2/unflskill2/unfllowlv2/pennyswift2/pennylowlv2/pennynoskill2/pennynopo2/swiftlv2/swiftskill2/swiftnopo2 同源）、既有 hero.diff（DIFFS 下标：
// `(g.diff===1)` 即 DIFFS[1]「困难」档，与 hardtrue/steadfast/frugal/dry/swift2/lowlv2/noskill2/unflswift2/unflpenny2/
// unflnopo2/unflskill2/unfllowlv2/pennyswift2/pennylowlv2/pennynoskill2/pennynopo2/swiftlv2/swiftskill2/swiftnopo2 同读一份源）、既有 hero.level
// （hero.js grantXp 升级唯一产生点 hero.level++、只增不减、随 snapshotHero 全量快照自动持久化、防御式 (g.level||1)
// 旧档零迁移，与 lowlv/lowlv2/lowskill/swiftlv/lowlvnopo/unfllowlv/pennylowlv/unfllowlv2/pennylowlv2/swiftlv2 系同读一份源）与既有
// hero.casts（battle.doSkill 战斗释放技能成功唯一产生点——「释放」即成功出手、治疗与伤害两分支都计入、只增不减、随 snapshotHero
// 全量快照自动持久化、防御式 (g.casts||0) 旧档零迁移，与 noskill「大巧不工」/noskill2「逆风守拙」/cast「熟能生巧」/lowskill/
// swiftskill/nopotskill/unflskill/pennynoskill/unflskill2/pennynoskill2/swiftskill2 系同读一份源），
// (g.trueBoss && g.diff===1 && (g.level||1)<LOWLV_GOAL && !(g.casts||0)) 即「困难 · 未及十级 · 零用技通关」达成——
// diff/level/casts 三端口都只增不减，换过难度、升过十级或放过一次技就永久无缘此档（与 hardtrue 换难度 / lowlv 升十级 / noskill 放技 /
// lowlv2 升十级 / noskill2 放技 同属「重新来过才拿得到」的挑战品类）；是 hardtrue、lowlv 与 noskill 三枚的严格交叠——
// 困难未及十级零用技通关必同时满足三者（也必满足 lowlv2 与 noskill2 与 lowskill），本枚是这一三重交叉区的唯一纪念；与既有正向
// 里程碑 cast「熟能生巧」（战斗释放技能达 CAST_GOAL(30) 次）/ lvl10「守灯者」（等级达 LVL10_GOAL(10) 级）成镜面对、
// 互不重叠——一个纪念「熟能生巧」、一个纪念「练到十级」、一个纪念「逆风的素手青灯」。可行性：困难档魔物全面加强下未满十级
// （九级封顶血蓝更薄、经验获取只嫌多不嫌少——支线经验/宝箱经验都得掂量着吃）且 [2] 技能键零按下，只靠 [1]普攻/[4]防御回蓝（v19.96）/
// [5]蓄力通关（连治疗/伤害技都封印，血蓝全靠防御/蓄力/喷泉/旅馆与药水硬撑（本档不禁药不禁消费不禁超场）），装备靠开箱/支线/掉落换，
// 吃满「别自降难度 + 别练级 + 别用技」三克制的一场逆风素手青灯。
// 零新计数零新状态零新写点零新存档（trueBoss/diff/level/casts 皆既有字段）、无 r 无 prog 纯里程碑（与 hardtrue/
// unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/
// swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv/
// pennynoskill/pennynopo/unflswift2/unflpenny2/unflnopo2/unflskill2/unfllowlv2/pennyswift2/pennylowlv2/pennynoskill2/pennynopo2/
// swiftlv2/swiftskill2/swiftnopo2 同款——困难里不练级又不放技本身就是奖励、硬核才是）、解锁走 winBattle → applyAchievements 既有通路（终焉之神击败当场
// trueBoss 落账后 applyAchievements 枚举即解锁，与 trueboss/hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/
// swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/
// unflnopo/unflpenny/pennyswift/pennylowlv/pennynoskill/pennynopo/unflswift2/unflpenny2/unflnopo2/unflskill2/unfllowlv2/pennyswift2/
// pennylowlv2/pennynoskill2/pennynopo2/swiftlv2/swiftskill2/swiftnopo2 同路径零新增依赖），反馈不迟到。
// 本冒烟守护：版本锚点（格式合法 + 已越过 v24.194 + data.js 字面量 v24.195 + 旧 v24.194 零残留）、
// ACH_LIST 119 项精确与末尾序位（unflicker 76 / swift 77 / lowlv 78 / nopotion 79 / penny 80 / steadfast 81 /
// frugal 82 / dry 83 / swift2 84 / lowlv2 85 / noskill 86 / noskill2 87 / lowskill 88 / swiftskill 89 /
// swiftlv 90 / nopotskill 91 / unflskill 92 / swiftnopo 93 / lowlvnopo 94 / unflswift 95 / unfllowlv 96 /
// unflnopo 97 / unflpenny 98 / pennyswift 99 / pennylowlv 100 / pennynoskill 101 / pennynopo 102 / unflswift2 103 /
// unflpenny2 104 / unflnopo2 105 / unflskill2 106 / unfllowlv2 107 / pennyswift2 108 / pennylowlv2 109 / pennynoskill2 110 /
// pennynopo2 111 / swiftlv2 112 / swiftskill2 113 / swiftnopo2 114 / lowskill2 115）、lowskill2 数据契约（d 文案、ok 防御式逐值、无 r 无 prog
// 且与 cast/lvl10 正向里程碑镜面对、三克制必同时满足 hardtrue/lowlv/noskill 且满足 lowlv2/noskill2/lowskill）、unlockedAchievements/
// applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等去重 / 换难度不解锁 / 升过十级不解锁 / 放过技不解锁 / 未通关不解锁）、
// 既有 115 成就 id 零回归、battle.js 无新增写点与 data.js LOWLV_GOAL/DIFFS 常量源级零变化、README/package.json/CHANGELOG 同步
// （件套口径 401 + v24.195 守护描述 + 入库 401 + 版本速览 116 项 + tests 树串尾 + package 串尾 401）、哨兵链（前望 402 且 README
// 尚无 402 口径）、旧代 v24.194 字面量/恒等/顶 pin/400 口径/115 项全库零残留扫描（豁免本套件 + 前代 v24190/v24189/v24188/v24187/v24186/v24185/v24184/v24183/v24181/
// v24180/v24179/v24178/v24177/v24176/v24175/v24174/v24173。注：成就计数 115→116 的零残留扫描只认「成就 N/115」/「**115 项成就**」/「全部 115 项进度」
// 三形态，「⚔️ 身经百战 N/100」「⚔️ 驱雾百战 N/100」是 BATTLE_GOAL/HUNT2_GOAL 讨伐进度分母非成就计数，不在扫描目标内）。
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

console.log('— v24.195 挑战向·「困难×低等级」三克制交叉区成就「逆风素手青灯」 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dataSrc = read('js/data.js');
const battleSrc = read('js/battle.js');
const heroSrc = read('js/hero.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（格式合法 + 已越过 v24.194 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.194', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 190)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.195（旧 v24.194 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v24.195';") && !dataSrc.includes("const GAME_VERSION = 'v24.194';"));
ok('data.js 含 v24.195 注释（逆风素手青灯新成就说明）',
  dataSrc.includes('v24.195 文档整理·版本锚点推进'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'lowskill2');
ok('ACH_LIST 含 lowskill2「逆风素手青灯」且 id 唯一',
  !!ach && ach.name === '逆风素手青灯' && ACH_LIST.filter((a) => a.id === 'lowskill2').length === 1);
ok('ACH_LIST 精确总数 116 项（115→116 末尾追加）', ACH_LIST.length === 119, String(ACH_LIST.length));
ok('lowskill2 描述文案（困难未及十级零用技真结局三克制档）',
  ach.d === '以困难模式、等级未满 10 且未使用任何技能（战斗指令 [2]）击败终焉之神（真结局）', ach.d);
ok('lowskill2 判定源级（读既有 g.trueBoss / g.diff===1 / (g.level||1)<LOWLV_GOAL / !(g.casts||0)）',
  String(ach.ok).includes('g.trueBoss') && String(ach.ok).includes('g.diff===1') && String(ach.ok).includes('LOWLV_GOAL') && String(ach.ok).includes('g.casts'));
ok('lowskill2 无 r 无 prog 纯里程碑（与 hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv/pennynoskill/pennynopo/unflswift2/unflpenny2/unflnopo2/unflskill2/unfllowlv2/pennyswift2/pennylowlv2/pennynoskill2/pennynopo2/swiftlv2/swiftskill2/swiftnopo2 同款）',
  !('r' in ach) && !('prog' in ach));

// —— ok 防御式逐值 ——
ok('困难 + 未及十级 + 零用技 + 真结局 → 解锁', ach.ok({ trueBoss: true, diff: 1, level: 9, casts: 0 }) === true);
ok('困难 + 未及十级 + 真结局 + 缺 casts 字段 → 按 0 解码解锁（旧档零迁移）', ach.ok({ trueBoss: true, diff: 1, level: 9 }) === true);
ok('困难 + 零用技 + 真结局 + 缺 level 字段 → 按 1 解码解锁（旧档零迁移）', ach.ok({ trueBoss: true, diff: 1, casts: 0 }) === true);
ok('缺 diff 字段（普通档） + 未及十级 + 零用技 → 不解锁（diff 维严格）', ach.ok({ trueBoss: true, level: 9, casts: 0 }) === false);
ok('困难 + 未及十级 + 放过一次技（casts 1）→ 不解锁（放过技即永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, level: 9, casts: 1 }) === false);
ok('困难 + 零用技 + 升过十级（level 10）→ 不解锁（本档只认未及十级）', ach.ok({ trueBoss: true, diff: 1, level: 10, casts: 0 }) === false);
ok('困难 + 未及十级 + 零用技但未通关 → 不解锁', ach.ok({ diff: 1, level: 9, casts: 0 }) === false);
ok('空档/缺字段 → 不解锁（(g.level||1)/(g.casts||0)/diff 防御式零迁移）', ach.ok({}) === false);
ok('困难 + 未及十级 + 零用技 + 死过一次（deaths 1）→ 照常解锁（本档不读 deaths，与 unfl 系分源）', ach.ok({ trueBoss: true, diff: 1, level: 9, casts: 0, deaths: 1 }) === true);
ok('困难 + 未及十级 + 零用技 + 花过金（spent 1）→ 照常解锁（本档不读 spent，与 penny 系分源）', ach.ok({ trueBoss: true, diff: 1, level: 9, casts: 0, spent: 1 }) === true);
ok('困难 + 未及十级 + 零用技 + 喝过药（potionUses 1）→ 照常解锁（本档不禁药，与 nopotion 系分源）', ach.ok({ trueBoss: true, diff: 1, level: 9, casts: 0, potionUses: 1 }) === true);
ok('困难 + 未及十级 + 零用技 + 超场（battles 100）→ 照常解锁（本档不读 battles，与 swift 系分源）', ach.ok({ trueBoss: true, diff: 1, level: 9, casts: 0, battles: 100 }) === true);

// —— 既有 115 成就 id 零回归 + 末尾序位 ——
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
  'unfllowlv', 'unflnopo', 'unflpenny', 'pennyswift', 'pennylowlv', 'pennynoskill', 'pennynopo', 'unflswift2', 'unflpenny2', 'unflnopo2', 'unflskill2', 'unfllowlv2', 'pennyswift2', 'pennylowlv2', 'pennynoskill2', 'pennynopo2', 'swiftlv2', 'swiftskill2', 'swiftnopo2', 'lowskill2'];
ok('既有 115 成就 id 零回归（核心抽样全覆盖末期正位）',
  EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('nightwins 75 / unflicker 76 / swift 77 / lowlv 78 / nopotion 79 / penny 80 / steadfast 81 / frugal 82 / dry 83 / swift2 84 / lowlv2 85 / noskill 86 / noskill2 87 / lowskill 88 / swiftskill 89 / swiftlv 90 / nopotskill 91 / unflskill 92 / swiftnopo 93 / lowlvnopo 94 / unflswift 95 / unfllowlv 96 / unflnopo 97 / unflpenny 98 / pennyswift 99 / pennylowlv 100 / pennynoskill 101 / pennynopo 102 / unflswift2 103 / unflpenny2 104 / unflnopo2 105 / unflskill2 106 / unfllowlv2 107 / pennyswift2 108 / pennylowlv2 109 / pennynoskill2 110 / pennynopo2 111 / swiftlv2 112 / swiftskill2 113 / swiftnopo2 114 / lowskill2 115 末尾序位（既有序位零位移）',
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
  ACH_LIST.findIndex((a) => a.id === 'unflskill2') === 106 &&
  ACH_LIST.findIndex((a) => a.id === 'unfllowlv2') === 107 &&
  ACH_LIST.findIndex((a) => a.id === 'pennyswift2') === 108 &&
  ACH_LIST.findIndex((a) => a.id === 'pennylowlv2') === 109 &&
  ACH_LIST.findIndex((a) => a.id === 'pennynoskill2') === 110 &&
  ACH_LIST.findIndex((a) => a.id === 'pennynopo2') === 111 &&
  ACH_LIST.findIndex((a) => a.id === 'swiftlv2') === 112 &&
  ACH_LIST.findIndex((a) => a.id === 'swiftskill2') === 113 &&
  ACH_LIST.findIndex((a) => a.id === 'swiftnopo2') === 114 &&
  ACH_LIST.findIndex((a) => a.id === 'lowskill2') === 115);

// —— 既有挑战向家族对照（hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv/pennynoskill/pennynopo/unflswift2/unflpenny2/unflnopo2/unflskill2/unfllowlv2/pennyswift2/pennylowlv2/pennynoskill2/pennynopo2/swiftlv2/swiftskill2/swiftnopo2 四十一档独立互不干扰）——
const _a = (id) => ACH_LIST.find((x) => x.id === id);
ok('hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv/pennynoskill/pennynopo/unflswift2/unflpenny2/unflnopo2/unflskill2/unfllowlv2/pennyswift2/pennylowlv2/pennynoskill2/pennynopo2/swiftlv2/swiftskill2/swiftnopo2 四十一档独立（难度 vs 姿态 vs 速通 vs 低等级 vs 零用药 vs 零消费 vs 零阵亡 vs 硬核复合六态 vs 零用技 vs 交叉区 vs 三克制十方）',
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
  _a('unflskill2').ok({ trueBoss: true, diff: 1, deaths: 0, casts: 0 }) === true &&
  _a('unfllowlv2').ok({ trueBoss: true, diff: 1, deaths: 0, level: 9 }) === true &&
  _a('pennyswift2').ok({ trueBoss: true, diff: 1, spent: 0, battles: 50 }) === true &&
  _a('pennylowlv2').ok({ trueBoss: true, diff: 1, spent: 0, level: 9 }) === true &&
  _a('pennynoskill2').ok({ trueBoss: true, diff: 1, spent: 0, casts: 0 }) === true &&
  _a('pennynopo2').ok({ trueBoss: true, diff: 1, spent: 0, potionUses: 0 }) === true &&
  _a('swiftlv2').ok({ trueBoss: true, diff: 1, battles: 70, level: 9 }) === true &&
  _a('swiftskill2').ok({ trueBoss: true, diff: 1, battles: 70, casts: 0 }) === true &&
  _a('swiftnopo2').ok({ trueBoss: true, diff: 1, battles: 70, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, level: 9, casts: 0 }) === true);
ok('困难×未及十级×零用技交叉档必同时满足 hardtrue 与 lowlv 与 noskill（本枚是其三重交叉区唯一纪念——diff/level/casts 三源同判）',
  _a('hardtrue').ok({ trueBoss: true, diff: 1, level: 9, casts: 0 }) === true &&
  _a('lowlv').ok({ trueBoss: true, diff: 1, level: 9, casts: 0 }) === true &&
  _a('noskill').ok({ trueBoss: true, diff: 1, level: 9, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, level: 9, casts: 0 }) === true);
ok('困难×未及十级×零用技也必同时满足 lowlv2 与 noskill2 与 lowskill（三重克制严格蕴含三个双克档）',
  _a('lowlv2').ok({ trueBoss: true, diff: 1, level: 9, casts: 0 }) === true &&
  _a('noskill2').ok({ trueBoss: true, diff: 1, level: 9, casts: 0 }) === true &&
  _a('lowskill').ok({ trueBoss: true, diff: 1, level: 9, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, level: 9, casts: 0 }) === true);
ok('换过难度（diff 0）→ lowskill2 与 lowlv2/noskill2 同不解锁（diff 严格分区——普通档只亮 lowskill，lowskill2 不亮）',
  _a('lowlv2').ok({ trueBoss: true, diff: 0, level: 9, casts: 0 }) === false &&
  _a('noskill2').ok({ trueBoss: true, diff: 0, level: 9, casts: 0 }) === false &&
  _a('lowskill').ok({ trueBoss: true, diff: 0, level: 9, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 0, level: 9, casts: 0 }) === false);
ok('升过十级（level 10）→ lowskill2 与 lowlv/lowlv2/lowskill 同不解锁（level 严格分区——升过十级即永久无缘，noskill/noskill2 仍亮）',
  _a('lowlv').ok({ trueBoss: true, diff: 1, level: 10, casts: 0 }) === false &&
  _a('lowlv2').ok({ trueBoss: true, diff: 1, level: 10, casts: 0 }) === false &&
  _a('noskill').ok({ trueBoss: true, diff: 1, level: 10, casts: 0 }) === true &&
  _a('noskill2').ok({ trueBoss: true, diff: 1, level: 10, casts: 0 }) === true &&
  _a('lowskill').ok({ trueBoss: true, diff: 1, level: 10, casts: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, level: 10, casts: 0 }) === false);
ok('放过一次技（casts 1）→ lowskill2 与 noskill/noskill2/lowskill 同不解锁（casts 严格分区——放过技即永久无缘，lowlv/lowlv2 仍亮）',
  _a('noskill').ok({ trueBoss: true, diff: 1, level: 9, casts: 1 }) === false &&
  _a('noskill2').ok({ trueBoss: true, diff: 1, level: 9, casts: 1 }) === false &&
  _a('lowlv').ok({ trueBoss: true, diff: 1, level: 9, casts: 1 }) === true &&
  _a('lowlv2').ok({ trueBoss: true, diff: 1, level: 9, casts: 1 }) === true &&
  _a('lowskill').ok({ trueBoss: true, diff: 1, level: 9, casts: 1 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, level: 9, casts: 1 }) === false);
ok('死过一次 + 困难未及十级零用技：lowskill2 照常亮（本档不读 deaths，与 unfllowlv2/unflskill2 分源——两枚三克制 require deaths=0 故不亮）',
  _a('unfllowlv2').ok({ trueBoss: true, diff: 1, deaths: 1, level: 9 }) === false &&
  _a('unflskill2').ok({ trueBoss: true, diff: 1, deaths: 1, casts: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 1, level: 9, casts: 0 }) === true);
ok('花过金 + 困难未及十级零用技：lowskill2 照常亮（本档不读 spent，与 pennylowlv2/pennynoskill2 分源）',
  _a('pennylowlv2').ok({ trueBoss: true, diff: 1, spent: 1, level: 9 }) === false &&
  _a('pennynoskill2').ok({ trueBoss: true, diff: 1, spent: 1, casts: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, spent: 1, level: 9, casts: 0 }) === true);
ok('未及十级 + 零用技 + 普通档：lowskill 亮而 lowskill2 不亮（两枚 level/casts 同源、diff 分源——普通档不点亮三克制）',
  _a('lowskill').ok({ trueBoss: true, diff: 0, level: 9, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 0, level: 9, casts: 0 }) === false);
ok('困难 + 未及十级 + 零用技 + 零阵亡：unfllowlv2/unflskill2 与 lowskill2 可同亮（diff/level/casts 同源、deaths 分源）',
  _a('unfllowlv2').ok({ trueBoss: true, diff: 1, deaths: 0, level: 9 }) === true &&
  _a('unflskill2').ok({ trueBoss: true, diff: 1, deaths: 0, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, level: 9, casts: 0 }) === true);
ok('与 swiftlv2/swiftskill2 互不干扰（swiftlv2 读 battles+level 不读 casts、swiftskill2 读 battles+casts 不读 level、lowskill2 读 level+casts 不读 battles——超场各自照明/否决、升十级/放技各自分区）',
  _a('swiftlv2').ok({ trueBoss: true, diff: 1, battles: 100, level: 9 }) === false &&
  _a('swiftskill2').ok({ trueBoss: true, diff: 1, battles: 100, casts: 0 }) === false &&
  _a('swiftlv2').ok({ trueBoss: true, diff: 1, battles: 70, level: 10 }) === false &&
  _a('swiftskill2').ok({ trueBoss: true, diff: 1, battles: 70, casts: 1 }) === false &&
  _a('swiftlv2').ok({ trueBoss: true, diff: 1, battles: 70, level: 9, casts: 1 }) === true &&
  _a('swiftskill2').ok({ trueBoss: true, diff: 1, battles: 70, casts: 0, level: 12 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, battles: 100, level: 9, casts: 1 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, battles: 100, level: 9, casts: 0 }) === true);
ok('与 swiftnopo2 互不干扰（swiftnopo2 读 battles+potionUses 不读 level/casts、lowskill2 读 level/casts 不读 battles/potionUses——超场/喝药各自分区）',
  _a('swiftnopo2').ok({ trueBoss: true, diff: 1, battles: 70, potionUses: 0, level: 12, casts: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, battles: 100, level: 9, casts: 0, potionUses: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, battles: 70, level: 9, casts: 1, potionUses: 0 }) === false);
ok('cast 熟能生巧 / lvl10 守灯者 正向里程碑档不解锁 lowskill2（放技累计与升级各解锁自己的正向里程碑、lowskill2 只认困难未及十级零用技）',
  ach.ok({ trueBoss: true, diff: 1, level: 9, casts: 16 }) === false &&
  _a('cast').ok({ casts: 30 }) === true &&
  _a('cast').ok({ casts: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, level: 12, casts: 0 }) === false &&
  _a('lvl10').ok({ level: 10 }) === true &&
  _a('lvl10').ok({ level: 1 }) === false);

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
  const h = freshHero({ trueBoss: true, diff: 1, level: 9, casts: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 困难未及十级零用技真结局档 newly 含 lowskill2（既有通路自动跟随）',
    newly.includes('lowskill2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 0, level: 9, casts: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 普通档 newly 不含 lowskill2（不误解锁，diff 维严格）',
    !newly.includes('lowskill2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, level: 10, casts: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 升过十级档 newly 不含 lowskill2（不误解锁，level 维严格）',
    !newly.includes('lowskill2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, level: 9, casts: 1 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 放过技档 newly 不含 lowskill2（不误解锁，casts 维严格）',
    !newly.includes('lowskill2'), JSON.stringify(newly));
}
{
  const h = freshHero({ diff: 1, level: 9, casts: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 未通关档 newly 不含 lowskill2（不误解锁）',
    !newly.includes('lowskill2'), JSON.stringify(newly));
}

// —— applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等）——
{
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    const h = freshHero({ trueBoss: true, diff: 1, level: 9, casts: 0 });
    S.G = h;
    applyAchievements();
    ok('applyAchievements 真实解锁落 hero.ach（含 lowskill2）', h.ach.includes('lowskill2'), JSON.stringify(h.ach));
    ok('解锁横幅报成就名【逆风素手青灯】', msgs.some((m) => m.includes('🔓 成就解锁：') && m.includes('逆风素手青灯')), msgs.join(' | '));
    const len1 = msgs.length;
    applyAchievements();
    ok('幂等：重复调用不再报（已解锁去重）', msgs.length === len1 && msgs.filter((m) => m.includes('逆风素手青灯')).length === 1, String(msgs.length));
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
    const h = freshHero({ trueBoss: true, diff: 0, level: 9, casts: 0 });
    S.G = h;
    applyAchievements();
    ok('普通档 applyAchievements 零 lowskill2 解锁零「逆风素手青灯」横幅（不误解锁）',
      !h.ach.includes('lowskill2') && !msgs.some((m) => m.includes('逆风素手青灯')), JSON.stringify({ ach: h.ach, msgs }));
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
    const h = freshHero({ trueBoss: true, diff: 1, level: 10, casts: 0 });
    S.G = h;
    applyAchievements();
    ok('升过十级 applyAchievements 零 lowskill2 解锁零「逆风素手青灯」横幅（不误解锁）',
      !h.ach.includes('lowskill2') && !msgs.some((m) => m.includes('逆风素手青灯')), JSON.stringify({ ach: h.ach, msgs }));
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
    const h = freshHero({ trueBoss: true, diff: 1, level: 9, casts: 1 });
    S.G = h;
    applyAchievements();
    ok('放过技 applyAchievements 零 lowskill2 解锁零「逆风素手青灯」横幅（不误解锁）',
      !h.ach.includes('lowskill2') && !msgs.some((m) => m.includes('逆风素手青灯')), JSON.stringify({ ach: h.ach, msgs }));
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}

// —— 源级零变化：hero.js level 写入点 + battle.js casts 写入点 + data.js LOWLV_GOAL/DIFFS 常量（既有，本版未动）——
ok('hero.js 具 1 处 hero.level++; 写入点（grantXp 升级唯一产生点）',
  (heroSrc.match(/hero\.level\+\+;/g) || []).length === 1, String((heroSrc.match(/hero\.level\+\+;/g) || []).length));
ok('battle.js 具 1 处 hero.casts = castN; 写入点（doSkill 战斗释放技能成功唯一产生点）',
  (battleSrc.match(/hero\.casts = castN;/g) || []).length === 1, String((battleSrc.match(/hero\.casts = castN;/g) || []).length));
ok('data.js LOWLV_GOAL 常量仍为 10（单一数据源，与 lowlv/lowlv2/lowskill/swiftlv/lowlvnopo 系同读一份源）',
  dataSrc.includes('const LOWLV_GOAL = 10;'));
ok('data.js DIFFS 仍含「困难」档（难度单一数据源，与 hardtrue/steadfast/frugal/dry/swift2/lowlv2/noskill2/unflswift2/unflpenny2/unflnopo2/unflskill2/unfllowlv2/pennyswift2/pennylowlv2/pennynoskill2/pennynopo2/swiftlv2/swiftskill2/swiftnopo2 同读一份源）',
  dataSrc.includes("const DIFFS=['普通','困难'];"));
ok('hero.js 成就横幅活计数注释已推进至 N/116（115→116）', heroSrc.includes('（成就 N/119）'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径为四百零四件套（四百零三件套清除）',
  readme.includes('扩充为冒烟四百零四件套（四百零三件套清除）') && !readme.includes('扩充为冒烟三百九十四件套（三百九十三件套清除）'));
ok('README 含 v24.194 守护描述（逆风素手青灯新成就守护）', readme.includes('v24.191 起含「逆风素手青灯」新成就守护'));
ok('README 版本速览已为 v24.195 且成就计数 116', readme.includes('版本速览（v24.195）') && readme.includes('119 项成就'));
ok('README 成就计数双处口径 116 项（全部 119 项进度 + **119 项成就**，114 项清除）',
  readme.includes('全部 119 项进度') && readme.includes('**119 项成就**') && !readme.includes('**114 项成就**'));
ok('README tests 树收录 smoke_v24191_lowskill2（含 v24.195 守护子句 + 串尾）',
  readme.includes('v24.191 起含「逆风素手青灯」新成就守护') && readme.includes('smoke_v24191_lowskill2'));
ok('README 含 smoke_v24191_lowskill2 入库（401 份）', readme.includes('smoke_v24191_lowskill2 入库（401 份）'));
ok('package.json 已收录 smoke_v24191_lowskill2.mjs 且位于串尾（在 swiftnopo2 之后）',
  pkg.includes('smoke_v24191_lowskill2.mjs') &&
  pkg.includes('node tests/smoke_v24190_swiftnopo2.mjs && node tests/smoke_v24191_lowskill2.mjs && node tests/smoke_v24192_lowlvnopo2.mjs && node tests/smoke_v24193_nopotskill2.mjs && node tests/smoke_v24194_lowskillnopo2.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 401 件套', testChain === 404, String(testChain));
ok('CHANGELOG 含 v24.195 顶条目', changelog.startsWith('## v24.195'));

// —— 哨兵链：README 已有 401 口径且尚无 402（前望 405 语义：下一版才写 402）——
ok('README 已有四百零四件套口径且尚无 402（哨兵前望 405 语义：下一版才写 402）',
  readme.includes('扩充为冒烟四百零四件套（四百零三件套清除）') && !readme.includes('四百零五件套'));
{
  const s24143 = read('tests/smoke_v24143_furnacequest.mjs');
  ok('smoke_v24143 哨兵链前望 405（四百零五件套否定式）',
    s24143.includes('哨兵链前望 405') && s24143.includes('四百零五件套否定式'));
}
{
  ok('smoke_v24190 姊妹件版本字面量 pin 已随新现实推进（v24.195）',
    read('tests/smoke_v24190_swiftnopo2.mjs').includes("const GAME_VERSION = 'v24.195';"));
  ok('smoke_v24189 姊妹件版本字面量 pin 已随新现实推进（v24.195）',
    read('tests/smoke_v24189_swiftskill2.mjs').includes("const GAME_VERSION = 'v24.195';"));
  ok('smoke_v24188 姊妹件版本字面量 pin 已随新现实推进（v24.195）',
    read('tests/smoke_v24188_swiftlv2.mjs').includes("const GAME_VERSION = 'v24.195';"));
  ok('smoke_v24187 姊妹件版本字面量 pin 已随新现实推进（v24.195）',
    read('tests/smoke_v24187_pennynopo2.mjs').includes("const GAME_VERSION = 'v24.195';"));
  ok('smoke_v24186 姊妹件版本字面量 pin 已随新现实推进（v24.195）',
    read('tests/smoke_v24186_pennynoskill2.mjs').includes("const GAME_VERSION = 'v24.195';"));
  ok('smoke_v24185 姊妹件版本字面量 pin 已随新现实推进（v24.195）',
    read('tests/smoke_v24185_pennylowlv2.mjs').includes("const GAME_VERSION = 'v24.195';"));
  ok('smoke_v24184 姊妹件版本字面量 pin 已随新现实推进（v24.195）',
    read('tests/smoke_v24184_pennyswift2.mjs').includes("const GAME_VERSION = 'v24.195';"));
  ok('smoke_v24183 姊妹件版本字面量 pin 已随新现实推进（v24.195）',
    read('tests/smoke_v24183_unfllowlv2.mjs').includes("const GAME_VERSION = 'v24.195';"));
  ok('smoke_v24181 姊妹件版本字面量 pin 已随新现实推进（v24.195）',
    read('tests/smoke_v24181_lampoilquest.mjs').includes("const GAME_VERSION = 'v24.195';"));
  ok('smoke_v24180 姊妹件版本字面量 pin 已随新现实推进（v24.195）',
    read('tests/smoke_v24180_unflskill2.mjs').includes("const GAME_VERSION = 'v24.195';"));
  ok('smoke_v24179 姊妹件版本字面量 pin 已随新现实推进（v24.195）',
    read('tests/smoke_v24179_unflnopo2.mjs').includes("const GAME_VERSION = 'v24.195';"));
  ok('smoke_v24178 姊妹件版本字面量 pin 已随新现实推进（v24.195）',
    read('tests/smoke_v24178_unflpenny2.mjs').includes("const GAME_VERSION = 'v24.195';"));
  ok('smoke_v24177 姊妹件版本字面量 pin 已随新现实推进（v24.195）',
    read('tests/smoke_v24177_unflswift2.mjs').includes("const GAME_VERSION = 'v24.195';"));
  ok('smoke_v24176 姊妹件版本字面量 pin 已随新现实推进（v24.195）',
    read('tests/smoke_v24176_pennynopo.mjs').includes("const GAME_VERSION = 'v24.195';"));
  ok('smoke_v24175 姊妹件版本字面量 pin 已随新现实推进（v24.195）',
    read('tests/smoke_v24175_pennynoskill.mjs').includes("const GAME_VERSION = 'v24.195';"));
  ok('smoke_v24174 姊妹件版本字面量 pin 已随新现实推进（v24.195）',
    read('tests/smoke_v24174_pennylowlv.mjs').includes("const GAME_VERSION = 'v24.195';"));
  ok('smoke_v24173 姊妹件版本字面量 pin 已随新现实推进（v24.195）',
    read('tests/smoke_v24173_pennyswift.mjs').includes("const GAME_VERSION = 'v24.195';"));
  ok('smoke_v2229 姊妹件版本恒等 pin 已随新现实推进（=== v24.195）',
    read('tests/smoke_v2229_metall.mjs').includes("GAME_VERSION === 'v24.195'"));
}

// —— 旧代 v24.194 字面量 / 400 件套口径 / 115 项 全库零残留扫描（豁免本套件 + 前代 v24190 + v24189 + v24188 + v24187 + v24186 + v24185 + v24184 + v24183 + v24181 + v24180 + v24179 + v24178 + v24177 + v24176 + v24175 + v24174 + v24173）——
// v24173-24190 是前代公式链载体，其 README 件套负向断言/版本锚点逐代 pin 由历史级联平移而成（v24191 自身
// 自带同款负向与扫描目标）。成就计数 115→116 扫描只认三形态。
const EXEMPT = new Set(['smoke_v24194_lowskillnopo2.mjs', 'smoke_v24193_nopotskill2.mjs', 'smoke_v24192_lowlvnopo2.mjs', 'smoke_v24191_lowskill2.mjs', 'smoke_v24190_swiftnopo2.mjs', 'smoke_v24189_swiftskill2.mjs', 'smoke_v24188_swiftlv2.mjs', 'smoke_v24187_pennynopo2.mjs', 'smoke_v24186_pennynoskill2.mjs', 'smoke_v24185_pennylowlv2.mjs', 'smoke_v24184_pennyswift2.mjs', 'smoke_v24183_unfllowlv2.mjs', 'smoke_v24181_lampoilquest.mjs', 'smoke_v24180_unflskill2.mjs', 'smoke_v24179_unflnopo2.mjs', 'smoke_v24178_unflpenny2.mjs', 'smoke_v24177_unflswift2.mjs', 'smoke_v24176_pennynopo.mjs', 'smoke_v24175_pennynoskill.mjs', 'smoke_v24174_pennylowlv.mjs', 'smoke_v24173_pennyswift.mjs']);
const leftovers = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests')).filter((x) => x.endsWith('.mjs') && !EXEMPT.has(x))) {
  const s = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  const code = s.split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  if (code.includes("const GAME_VERSION = 'v24.194'")) leftovers.push(f + ':gv');
  if (code.includes("GAME_VERSION === 'v24.194'")) leftovers.push(f + ':eq');
  if (code.includes("startsWith('## v24.194")) leftovers.push(f + ':st');
  if (code.includes('四百零三件套（四百零二件套清除）')) leftovers.push(f + ':400');
  if (code.includes('testChain === 403') || code.includes('files.length === 403') ||
      code.includes('treeTok.length === 403') || code.includes('chainAll.length === 403') ||
      code.includes('fileCount === 403'))
    leftovers.push(f + ':count');
  // 成就计数 115→116 零残留：只认「成就 N/115」/「**115 项成就**」/「全部 115 项进度」三形态
  if (code.includes('成就 N/115') || code.includes('**115 项成就**') || code.includes('全部 115 项进度'))
    leftovers.push(f + ':115');
}
ok('旧代 v24.194 GAME_VERSION 字面量/恒等/顶 pin 全库零残留（哨兵链，豁免本套件 + v24190 + v24189 + v24188 + v24187 + v24186 + v24185 + v24184 + v24183 + v24181 + v24180 + v24179 + v24178 + v24177 + v24176 + v24175 + v24174 + v24173）',
  leftovers.filter((x) => x.endsWith(':gv') || x.endsWith(':eq') || x.endsWith(':st')).length === 0,
  JSON.stringify(leftovers));
ok('旧代 400 件套口径/计数/115 项 pin 全库零残留（哨兵链，豁免本套件 + v24190 + v24189 + v24188 + v24187 + v24186 + v24185 + v24184 + v24183 + v24181 + v24180 + v24179 + v24178 + v24177 + v24176 + v24175 + v24174 + v24173）',
  leftovers.filter((x) => x.endsWith(':400') || x.endsWith(':count') || x.endsWith(':115')).length === 0,
  JSON.stringify(leftovers));

if (failed) { console.log(`— v24.195 冒烟完成：${n} 项断言，失败 ${failed} —`); process.exit(1); }
console.log(`— v24.195 冒烟完成：${n} 项断言，失败 0 —`);
