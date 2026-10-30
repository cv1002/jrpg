// smoke_v24193_nopotskill2.mjs —— v24.194 专项冒烟：新成就「逆风素手不沾」（挑战向·「零用技×零战斗用药」困难档交叉口收官·困难模式×零用技×零战斗用药）
// （新内容·单成就·第一百一十八项——承 v24.193 逆风不饮青芽（lowlvnopo2，「困难×低等级」交叉区第二角·困难×未及十级×零战斗用药）/ v24.191 逆风素手青灯
// （lowskill2，「困难×低等级」交叉区首角·困难×未及十级×零用技）/ v24.165 素手不沾（nopotskill，零用技×零战斗用药普通档双克制）/ v24.161 逆风守拙（noskill2，
// 困难×零用技）/ v24.157 滴药未沾（dry，困难×零战斗用药）先例：v24.191/192 相继开垦「困难×低等级」交叉区 lowlv×{noskill,nopotion} 两角后，同簇
// 姿态三角 hardtrue×{lowlv, noskill, nopotion} 中唯一仍未开垦的 hardtrue×noskill×nopotion 现已补上——把既有双克制档「素手不沾」（零用技×零战斗用药）
// 再叠上困难模式（diff===1），收官「零用技×零战斗用药」困难档交叉口（hardtrue×{lowlv, noskill, nopotion} 低等级/零用技/零用药三角硬核交叉至此全数开垦完毕）。
// 判定读既有 hero.trueBoss（终焉之神=真结局最终 Boss，与 trueboss/hardtrue/unflicker/swift/lowlv/nopotion/penny/
// steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/
// lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv/pennynoskill/pennynopo/unflswift2/unflpenny2/
// unflnopo2/unflskill2/unfllowlv2/pennyswift2/pennylowlv2/pennynoskill2/pennynopo2/swiftlv2/swiftskill2/swiftnopo2/lowskill2/
// lowlvnopo2 同源）、既有 hero.diff（DIFFS 下标：`(g.diff===1)` 即 DIFFS[1]「困难」档，与 hardtrue/steadfast/frugal/dry/swift2/lowlv2/
// noskill2/unflswift2/unflpenny2/unflnopo2/unflskill2/unfllowlv2/pennyswift2/pennylowlv2/pennynoskill2/pennynopo2/swiftlv2/swiftskill2/
// swiftnopo2/lowskill2/lowlvnopo2 同读一份源）、既有 hero.casts（battle.doSkill 战斗释放技能成功唯一产生点——「释放」即成功出手、治疗与伤害两分支都计入、
// 只增不减、随 snapshotHero 全量快照自动持久化、防御式 (g.casts||0) 旧档零迁移，与 noskill「大巧不工」/noskill2「逆风守拙」/cast「熟能生巧」/lowskill/
// swiftskill/nopotskill/unflskill/pennynoskill/unflskill2/pennynoskill2/swiftskill2 系同读一份源）与既有 hero.potionUses（battle.doItem 战斗用药成功
// 唯一产生点——「战斗指令 [3] 用药」成功即记、大地图 F 喝药/旅馆/篝火不计入、只增不减、随 snapshotHero 全量快照自动持久化、防御式 (g.potionUses||0)
// 旧档零迁移，与 nopotion「药囊未启」/dry「滴药未沾」/potionuses「药到病除」/nopotskill/swiftnopo/lowlvnopo/unflnopo/pennynopo/unflnopo2/pennynopo2/
// swiftnopo2/lowlvnopo2 系同读一份源），
// (g.trueBoss && g.diff===1 && !(g.casts||0) && !(g.potionUses||0)) 即「困难 · 零用技 · 零战斗用药通关」达成——
// diff/casts/potionUses 三端口都只增不减，换过难度、放过一次技或战斗里喝过一口药就永久无缘此档（与 hardtrue 换难度 / noskill 放技 / nopotion 吃药 /
// noskill2 放技 / dry 吃药 同属「重新来过才拿得到」的挑战品类）；是 hardtrue、noskill 与 nopotion 三枚的严格交叠——
// 困难零用技零战斗用药通关必同时满足三者（也必满足 noskill2 与 dry 与 nopotskill），本枚是这一三重交叉区的唯一纪念；与既有正向
// 里程碑 cast「熟能生巧」（战斗释放技能累计达 CAST_GOAL(30) 次）/ potionuses「药到病除」（战斗用药成功达 POTION_USE_GOAL(15) 次）成镜面对、
// 互不重叠——一个纪念「熟能生巧」、一个纪念「药到病除」、一个纪念「逆风的素手不沾」。可行性：困难档魔物全面加强下 [2] 技能键与 [3] 药键双零按下
// （连治疗/伤害技与战斗喝药都封印，血蓝全靠 [1]普攻/[4]防御回蓝（v19.96）/[5]蓄力/喷泉/旅馆与大地图 F 喝药硬撑（本档不禁消费不禁升级不禁大地图
// 喝药—大地图 F 不计入 potionUses）），装备靠开箱/支线/掉落换，吃满「别自降难度 + 别用技 + 别嗑药」三克制的一场逆风素手不沾。
// 零新计数零新状态零新写点零新存档（trueBoss/diff/casts/potionUses 皆既有字段）、无 r 无 prog 纯里程碑（与 hardtrue/
// unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/
// swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv/
// pennynoskill/pennynopo/unflswift2/unflpenny2/unflnopo2/unflskill2/unfllowlv2/pennyswift2/pennylowlv2/pennynoskill2/pennynopo2/
// swiftlv2/swiftskill2/swiftnopo2/lowskill2/lowlvnopo2 同款——困难里不放技又不嗑药本身就是奖励、硬核才是）、解锁走 winBattle → applyAchievements 既有通路
// （终焉之神击败当场 trueBoss 落账后 applyAchievements 枚举即解锁，与 trueboss/hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/
// swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/
// unflnopo/unflpenny/pennyswift/pennylowlv/pennynoskill/pennynopo/unflswift2/unflpenny2/unflnopo2/unflskill2/unfllowlv2/pennyswift2/
// pennylowlv2/pennynoskill2/pennynopo2/swiftlv2/swiftskill2/swiftnopo2/lowskill2/lowlvnopo2 同路径零新增依赖），反馈不迟到。
// 本冒烟守护：版本锚点（格式合法 + 已越过 v24.193 + data.js 字面量 v24.194 + 旧 v24.193 零残留）、
// ACH_LIST 119 项精确与末尾序位（unflicker 76 / swift 77 / lowlv 78 / nopotion 79 / penny 80 / steadfast 81 /
// frugal 82 / dry 83 / swift2 84 / lowlv2 85 / noskill 86 / noskill2 87 / lowskill 88 / swiftskill 89 /
// swiftlv 90 / nopotskill 91 / unflskill 92 / swiftnopo 93 / lowlvnopo 94 / unflswift 95 / unfllowlv 96 /
// unflnopo 97 / unflpenny 98 / pennyswift 99 / pennylowlv 100 / pennynoskill 101 / pennynopo 102 / unflswift2 103 /
// unflpenny2 104 / unflnopo2 105 / unflskill2 106 / unfllowlv2 107 / pennyswift2 108 / pennylowlv2 109 / pennynoskill2 110 /
// pennynopo2 111 / swiftlv2 112 / swiftskill2 113 / swiftnopo2 114 / lowskill2 115 / lowlvnopo2 116 / nopotskill2 117）、
// nopotskill2 数据契约（d 文案、ok 防御式逐值、无 r 无 prog 且与 cast/potionuses 正向里程碑镜面对、三克制必同时满足 hardtrue/noskill/nopotion 且满足
// noskill2/dry/nopotskill）、unlockedAchievements/applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等去重 / 换难度不解锁 /
// 放过技不解锁 / 战斗喝过药不解锁 / 未通关不解锁）、既有 117 成就 id 零回归、battle.js 无新增写点与 data.js CAST_GOAL/POTION_USE_GOAL/DIFFS
// 常量源级零变化、README/package.json/CHANGELOG 同步（件套口径 403 + v24.193 守护描述 + 入库 403 + 版本速览 118 项 + tests 树串尾 +
// package 串尾 403）、哨兵链（前望 404 且 README 尚无 404 口径）、旧代 v24.193 字面量/恒等/顶 pin/402 口径/117 项全库零残留扫描（豁免本套件 +
// 前代 v24192/v24191/v24190/v24189/v24188/v24187/v24186/v24185/v24184/v24183/v24181/
// v24180/v24179/v24178/v24177/v24176/v24175/v24174/v24173。注：成就计数 117→118 的零残留扫描只认「成就 N/117」/「**117 项成就**」/「全部 117 项进度」
// 三形态，「⚔️ 身经百战 N/100」「⚔️ 驱雾百战 N/100」是 BATTLE_GOAL/HUNT2_GOAL 讨伐进度分母非成就计数，不在扫描目标内）。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, CAST_GOAL, POTION_USE_GOAL } from '../js/data.js';
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

console.log('— v24.194 挑战向·「零用技×零战斗用药」困难档交叉口收官成就「逆风素手不沾」 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dataSrc = read('js/data.js');
const battleSrc = read('js/battle.js');
const heroSrc = read('js/hero.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（格式合法 + 已越过 v24.193 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.193', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 192)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.194（旧 v24.193 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v24.194';") && !dataSrc.includes("const GAME_VERSION = 'v24.193';"));
ok('data.js 含 v24.194 注释（逆风素手不沾新成就说明）',
  dataSrc.includes('v24.194 新内容·新成就'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'nopotskill2');
ok('ACH_LIST 含 nopotskill2「逆风素手不沾」且 id 唯一',
  !!ach && ach.name === '逆风素手不沾' && ACH_LIST.filter((a) => a.id === 'nopotskill2').length === 1);
ok('ACH_LIST 精确总数 118 项（117→118 末尾追加）', ACH_LIST.length === 119, String(ACH_LIST.length));
ok('nopotskill2 描述文案（困难零用技零战斗用药真结局三克制档）',
  ach.d === '以困难模式、未使用任何技能（战斗指令 [2]）且未在战斗中使用药水/灵药击败终焉之神（真结局）', ach.d);
ok('nopotskill2 判定源级（读既有 g.trueBoss / g.diff===1 / !(g.casts||0) / !(g.potionUses||0)，不含 LOWLV_GOAL/SPEED_GOAL）',
  String(ach.ok).includes('g.trueBoss') && String(ach.ok).includes('g.diff===1') && String(ach.ok).includes('g.casts') && String(ach.ok).includes('g.potionUses') && !String(ach.ok).includes('LOWLV_GOAL') && !String(ach.ok).includes('SPEED_GOAL'));
ok('nopotskill2 无 r 无 prog 纯里程碑（与 hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv/pennynoskill/pennynopo/unflswift2/unflpenny2/unflnopo2/unflskill2/unfllowlv2/pennyswift2/pennylowlv2/pennynoskill2/pennynopo2/swiftlv2/swiftskill2/swiftnopo2/lowskill2/lowlvnopo2 同款）',
  !('r' in ach) && !('prog' in ach));

// —— ok 防御式逐值 ——
ok('困难 + 零用技 + 零战斗用药 + 真结局 → 解锁', ach.ok({ trueBoss: true, diff: 1, casts: 0, potionUses: 0 }) === true);
ok('困难 + 零用技 + 真结局 + 缺 potionUses 字段 → 按 0 解码解锁（旧档零迁移）', ach.ok({ trueBoss: true, diff: 1, casts: 0 }) === true);
ok('困难 + 零战斗用药 + 真结局 + 缺 casts 字段 → 按 0 解码解锁（旧档零迁移）', ach.ok({ trueBoss: true, diff: 1, potionUses: 0 }) === true);
ok('缺 diff 字段（普通档） + 零用技 + 零战斗用药 → 不解锁（diff 维严格）', ach.ok({ trueBoss: true, casts: 0, potionUses: 0 }) === false);
ok('困难 + 零战斗用药 + 放过 1 次技（casts 1）→ 不解锁（放过一次即永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, casts: 1, potionUses: 0 }) === false);
ok('困难 + 零用技 + 战斗喝过 1 次药（potionUses 1）→ 不解锁（喝过一口即永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, casts: 0, potionUses: 1 }) === false);
ok('困难 + 零用技 + 零战斗用药但未通关 → 不解锁', ach.ok({ diff: 1, casts: 0, potionUses: 0 }) === false);
ok('空档/缺字段 → 不解锁（(g.casts||0)/(g.potionUses||0)/diff 防御式零迁移）', ach.ok({}) === false);
ok('困难 + 零用技 + 零战斗用药 + 死过一次（deaths 1）→ 照常解锁（本档不读 deaths，与 unfl 系分源）', ach.ok({ trueBoss: true, diff: 1, casts: 0, potionUses: 0, deaths: 1 }) === true);
ok('困难 + 零用技 + 零战斗用药 + 花过金（spent 1）→ 照常解锁（本档不读 spent，与 penny 系分源）', ach.ok({ trueBoss: true, diff: 1, casts: 0, potionUses: 0, spent: 1 }) === true);
ok('困难 + 零用技 + 零战斗用药 + 未及十级/升过十级（level 9/12）→ 照常解锁（本档不读 level，与 lowlv 系分源）', ach.ok({ trueBoss: true, diff: 1, casts: 0, potionUses: 0, level: 9 }) === true && ach.ok({ trueBoss: true, diff: 1, casts: 0, potionUses: 0, level: 12 }) === true);
ok('困难 + 零用技 + 零战斗用药 + 超场（battles 100）→ 照常解锁（本档不读 battles，与 swift 系分源）', ach.ok({ trueBoss: true, diff: 1, casts: 0, potionUses: 0, battles: 100 }) === true);

// —— 既有 117 成就 id 零回归 + 末尾序位 ——
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
  'unfllowlv', 'unflnopo', 'unflpenny', 'pennyswift', 'pennylowlv', 'pennynoskill', 'pennynopo', 'unflswift2', 'unflpenny2', 'unflnopo2', 'unflskill2', 'unfllowlv2', 'pennyswift2', 'pennylowlv2', 'pennynoskill2', 'pennynopo2', 'swiftlv2', 'swiftskill2', 'swiftnopo2', 'lowskill2', 'lowlvnopo2', 'nopotskill2'];
ok('既有 117 成就 id 零回归（核心抽样全覆盖末期正位）',
  EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('nightwins 75 / unflicker 76 / swift 77 / lowlv 78 / nopotion 79 / penny 80 / steadfast 81 / frugal 82 / dry 83 / swift2 84 / lowlv2 85 / noskill 86 / noskill2 87 / lowskill 88 / swiftskill 89 / swiftlv 90 / nopotskill 91 / unflskill 92 / swiftnopo 93 / lowlvnopo 94 / unflswift 95 / unfllowlv 96 / unflnopo 97 / unflpenny 98 / pennyswift 99 / pennylowlv 100 / pennynoskill 101 / pennynopo 102 / unflswift2 103 / unflpenny2 104 / unflnopo2 105 / unflskill2 106 / unfllowlv2 107 / pennyswift2 108 / pennylowlv2 109 / pennynoskill2 110 / pennynopo2 111 / swiftlv2 112 / swiftskill2 113 / swiftnopo2 114 / lowskill2 115 / lowlvnopo2 116 / nopotskill2 117 末尾序位（既有序位零位移）',
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
  ACH_LIST.findIndex((a) => a.id === 'lowskill2') === 115 &&
  ACH_LIST.findIndex((a) => a.id === 'lowlvnopo2') === 116 &&
  ACH_LIST.findIndex((a) => a.id === 'nopotskill2') === 117);

// —— 既有挑战向家族对照（hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv/pennynoskill/pennynopo/unflswift2/unflpenny2/unflnopo2/unflskill2/unfllowlv2/pennyswift2/pennylowlv2/pennynoskill2/pennynopo2/swiftlv2/swiftskill2/swiftnopo2/lowskill2/lowlvnopo2 四十三档独立互不干扰）——
const _a = (id) => ACH_LIST.find((x) => x.id === id);
ok('hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv/pennynoskill/pennynopo/unflswift2/unflpenny2/unflnopo2/unflskill2/unfllowlv2/pennyswift2/pennylowlv2/pennynoskill2/pennynopo2/swiftlv2/swiftskill2/swiftnopo2/lowskill2/lowlvnopo2 四十三档独立（难度 vs 姿态 vs 速通 vs 低等级 vs 零用药 vs 零消费 vs 零阵亡 vs 硬核复合六态 vs 零用技 vs 交叉区 vs 三克制十二方）',
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
  _a('lowskill2').ok({ trueBoss: true, diff: 1, level: 9, casts: 0 }) === true &&
  _a('lowlvnopo2').ok({ trueBoss: true, diff: 1, level: 9, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, casts: 0, potionUses: 0 }) === true);
ok('困难×零用技×零战斗用药交叉档必同时满足 hardtrue 与 noskill 与 nopotion（本枚是其三重交叉区唯一纪念——diff/casts/potionUses 三源同判）',
  _a('hardtrue').ok({ trueBoss: true, diff: 1, casts: 0, potionUses: 0 }) === true &&
  _a('noskill').ok({ trueBoss: true, diff: 1, casts: 0, potionUses: 0 }) === true &&
  _a('nopotion').ok({ trueBoss: true, diff: 1, casts: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, casts: 0, potionUses: 0 }) === true);
ok('困难×零用技×零战斗用药也必同时满足 noskill2 与 dry 与 nopotskill（三重克制严格蕴含三个双克档）',
  _a('noskill2').ok({ trueBoss: true, diff: 1, casts: 0, potionUses: 0 }) === true &&
  _a('dry').ok({ trueBoss: true, diff: 1, casts: 0, potionUses: 0 }) === true &&
  _a('nopotskill').ok({ trueBoss: true, diff: 1, casts: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, casts: 0, potionUses: 0 }) === true);
ok('换过难度（diff 0）→ nopotskill2 与 noskill2/dry 同不解锁（diff 严格分区——普通档只亮 nopotskill，nopotskill2 不亮）',
  _a('noskill2').ok({ trueBoss: true, diff: 0, casts: 0, potionUses: 0 }) === false &&
  _a('dry').ok({ trueBoss: true, diff: 0, casts: 0, potionUses: 0 }) === false &&
  _a('nopotskill').ok({ trueBoss: true, diff: 0, casts: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 0, casts: 0, potionUses: 0 }) === false);
ok('放过一次技（casts 1）→ nopotskill2 与 noskill/noskill2/nopotskill 同不解锁（casts 严格分区——放过即永久无缘，nopotion/dry 仍亮）',
  _a('noskill').ok({ trueBoss: true, diff: 1, casts: 1, potionUses: 0 }) === false &&
  _a('noskill2').ok({ trueBoss: true, diff: 1, casts: 1, potionUses: 0 }) === false &&
  _a('nopotion').ok({ trueBoss: true, diff: 1, casts: 1, potionUses: 0 }) === true &&
  _a('dry').ok({ trueBoss: true, diff: 1, casts: 1, potionUses: 0 }) === true &&
  _a('nopotskill').ok({ trueBoss: true, diff: 1, casts: 1, potionUses: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, casts: 1, potionUses: 0 }) === false);
ok('战斗喝过一口药（potionUses 1）→ nopotskill2 与 nopotion/dry/nopotskill 同不解锁（potionUses 严格分区——喝过即永久无缘，noskill/noskill2 仍亮）',
  _a('nopotion').ok({ trueBoss: true, diff: 1, casts: 0, potionUses: 1 }) === false &&
  _a('dry').ok({ trueBoss: true, diff: 1, casts: 0, potionUses: 1 }) === false &&
  _a('noskill').ok({ trueBoss: true, diff: 1, casts: 0, potionUses: 1 }) === true &&
  _a('noskill2').ok({ trueBoss: true, diff: 1, casts: 0, potionUses: 1 }) === true &&
  _a('nopotskill').ok({ trueBoss: true, diff: 1, casts: 0, potionUses: 1 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, casts: 0, potionUses: 1 }) === false);
ok('死过一次 + 困难零用技零战斗用药：nopotskill2 照常亮（本档不读 deaths，与 unflnopo2/unflskill2 分源——两枚三克制 require deaths=0 故不亮）',
  _a('unflnopo2').ok({ trueBoss: true, diff: 1, deaths: 1, potionUses: 0 }) === false &&
  _a('unflskill2').ok({ trueBoss: true, diff: 1, deaths: 1, casts: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 1, casts: 0, potionUses: 0 }) === true);
ok('花过金 + 困难零用技零战斗用药：nopotskill2 照常亮（本档不读 spent，与 pennynoskill2/pennynopo2 分源）',
  _a('pennynoskill2').ok({ trueBoss: true, diff: 1, spent: 1, casts: 0 }) === false &&
  _a('pennynopo2').ok({ trueBoss: true, diff: 1, spent: 1, potionUses: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, spent: 1, casts: 0, potionUses: 0 }) === true);
ok('零用技 + 零战斗用药 + 普通档：nopotskill 亮而 nopotskill2 不亮（两枚 casts/potionUses 同源、diff 分源——普通档不点亮三克制）',
  _a('nopotskill').ok({ trueBoss: true, diff: 0, casts: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 0, casts: 0, potionUses: 0 }) === false);
ok('困难 + 零用技 + 零战斗用药 + 零阵亡：unflnopo2/unflskill2 与 nopotskill2 可同亮（diff/casts/potionUses 同源、deaths 分源）',
  _a('unflnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, potionUses: 0 }) === true &&
  _a('unflskill2').ok({ trueBoss: true, diff: 1, deaths: 0, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, casts: 0, potionUses: 0 }) === true);
ok('与 lowskill2/lowlvnopo2 互不干扰（lowskill2 读 level+casts 不读 potionUses、lowlvnopo2 读 level+potionUses 不读 casts、nopotskill2 读 casts+potionUses 不读 level——放技/喝药各自照明/否决、未及十级不读照常亮）',
  _a('lowskill2').ok({ trueBoss: true, diff: 1, level: 9, casts: 0, potionUses: 1 }) === true &&
  _a('lowlvnopo2').ok({ trueBoss: true, diff: 1, level: 9, casts: 1, potionUses: 0 }) === true &&
  _a('lowskill2').ok({ trueBoss: true, diff: 1, level: 10, casts: 0, potionUses: 0 }) === false &&
  _a('lowlvnopo2').ok({ trueBoss: true, diff: 1, level: 10, casts: 0, potionUses: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, level: 12, casts: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, level: 9, casts: 1, potionUses: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, level: 9, casts: 0, potionUses: 1 }) === false);
ok('与 unfllowlv2/pennylowlv2 互不干扰（unfllowlv2 读 deaths+level、pennylowlv2 读 spent+level、nopotskill2 读 casts+potionUses 不读 deaths/spent/level——死过/花过金各自分区）',
  _a('unfllowlv2').ok({ trueBoss: true, diff: 1, deaths: 0, level: 9, casts: 1 }) === true &&
  _a('pennylowlv2').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, potionUses: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, casts: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 1, spent: 1, casts: 0, potionUses: 0 }) === true);
ok('cast 熟能生巧 / potionuses 药到病除 正向里程碑档不解锁 nopotskill2（技能累计与战斗用药累计各解锁自己的正向里程碑、nopotskill2 只认困难零用技零战斗用药）',
  ach.ok({ trueBoss: true, diff: 1, casts: 31, potionUses: 0 }) === false &&
  _a('cast').ok({ casts: 30 }) === true &&
  _a('cast').ok({ casts: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, casts: 0, potionUses: 16 }) === false &&
  _a('potionuses').ok({ potionUses: 15 }) === true &&
  _a('potionuses').ok({ potionUses: 0 }) === false);

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
  const h = freshHero({ trueBoss: true, diff: 1, casts: 0, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 困难零用技零战斗用药真结局档 newly 含 nopotskill2（既有通路自动跟随）',
    newly.includes('nopotskill2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 0, casts: 0, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 普通档 newly 不含 nopotskill2（不误解锁，diff 维严格）',
    !newly.includes('nopotskill2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, casts: 1, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 放过技档 newly 不含 nopotskill2（不误解锁，casts 维严格）',
    !newly.includes('nopotskill2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, casts: 0, potionUses: 1 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 战斗喝过药档 newly 不含 nopotskill2（不误解锁，potionUses 维严格）',
    !newly.includes('nopotskill2'), JSON.stringify(newly));
}
{
  const h = freshHero({ diff: 1, casts: 0, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 未通关档 newly 不含 nopotskill2（不误解锁）',
    !newly.includes('nopotskill2'), JSON.stringify(newly));
}

// —— applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等）——
{
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    const h = freshHero({ trueBoss: true, diff: 1, casts: 0, potionUses: 0 });
    S.G = h;
    applyAchievements();
    ok('applyAchievements 真实解锁落 hero.ach（含 nopotskill2）', h.ach.includes('nopotskill2'), JSON.stringify(h.ach));
    ok('解锁横幅报成就名【逆风素手不沾】', msgs.some((m) => m.includes('🔓 成就解锁：') && m.includes('逆风素手不沾')), msgs.join(' | '));
    const len1 = msgs.length;
    applyAchievements();
    ok('幂等：重复调用不再报（已解锁去重）', msgs.length === len1 && msgs.filter((m) => m.includes('逆风素手不沾')).length === 1, String(msgs.length));
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
    const h = freshHero({ trueBoss: true, diff: 0, casts: 0, potionUses: 0 });
    S.G = h;
    applyAchievements();
    ok('普通档 applyAchievements 零 nopotskill2 解锁零「逆风素手不沾」横幅（不误解锁）',
      !h.ach.includes('nopotskill2') && !msgs.some((m) => m.includes('逆风素手不沾')), JSON.stringify({ ach: h.ach, msgs }));
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
    const h = freshHero({ trueBoss: true, diff: 1, casts: 1, potionUses: 0 });
    S.G = h;
    applyAchievements();
    ok('放过技 applyAchievements 零 nopotskill2 解锁零「逆风素手不沾」横幅（不误解锁）',
      !h.ach.includes('nopotskill2') && !msgs.some((m) => m.includes('逆风素手不沾')), JSON.stringify({ ach: h.ach, msgs }));
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
    const h = freshHero({ trueBoss: true, diff: 1, casts: 0, potionUses: 1 });
    S.G = h;
    applyAchievements();
    ok('战斗喝过药 applyAchievements 零 nopotskill2 解锁零「逆风素手不沾」横幅（不误解锁）',
      !h.ach.includes('nopotskill2') && !msgs.some((m) => m.includes('逆风素手不沾')), JSON.stringify({ ach: h.ach, msgs }));
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}

// —— 源级零变化：battle.js casts/potionUses 写入点 + data.js CAST_GOAL/POTION_USE_GOAL/DIFFS 常量（既有，本版未动）——
ok('battle.js 具 1 处 hero.casts = castN; 写入点（doSkill 战斗释放技能唯一产生点）',
  (battleSrc.match(/hero\.casts = castN;/g) || []).length === 1, String((battleSrc.match(/hero\.casts = castN;/g) || []).length));
ok('battle.js 具 1 处 hero.potionUses = useN; 写入点（doItem 战斗用药成功唯一产生点）',
  (battleSrc.match(/hero\.potionUses = useN;/g) || []).length === 1, String((battleSrc.match(/hero\.potionUses = useN;/g) || []).length));
ok('data.js CAST_GOAL 常量仍为 30（单一数据源，与 cast/swiftskill/nopotskill 系同读一份源）',
  dataSrc.includes('const CAST_GOAL = 30;'));
ok('data.js POTION_USE_GOAL 常量仍为 15（单一数据源，与 potionuses/nopotskill 系同读一份源）',
  dataSrc.includes('const POTION_USE_GOAL = 15;'));
ok('data.js DIFFS 仍含「困难」档（难度单一数据源，与 hardtrue/steadfast/frugal/dry/swift2/lowlv2/noskill2/unflswift2/unflpenny2/unflnopo2/unflskill2/unfllowlv2/pennyswift2/pennylowlv2/pennynoskill2/pennynopo2/swiftlv2/swiftskill2/swiftnopo2/lowskill2/lowlvnopo2 同读一份源）',
  dataSrc.includes("const DIFFS=['普通','困难'];"));
ok('hero.js 成就横幅活计数注释已推进至 N/118（117→118）', heroSrc.includes('（成就 N/119）'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径为四百零四件套（四百零三件套清除）',
  readme.includes('扩充为冒烟四百零四件套（四百零三件套清除）') && !readme.includes('扩充为冒烟四百零二件套（四百件套清除）'));
ok('README 含 v24.193 守护描述（逆风素手不沾新成就守护）', readme.includes('v24.193 起含「逆风素手不沾」新成就守护'));
ok('README 版本速览已为 v24.194 且成就计数 118', readme.includes('版本速览（v24.194）') && readme.includes('119 项成就'));
ok('README 成就计数双处口径 118 项（全部 119 项进度 + **119 项成就**，116 项清除）',
  readme.includes('全部 119 项进度') && readme.includes('**119 项成就**') && !readme.includes('**116 项成就**'));
ok('README tests 树收录 smoke_v24193_nopotskill2（含 v24.194 守护子句 + 串尾）',
  readme.includes('v24.193 起含「逆风素手不沾」新成就守护') && readme.includes('smoke_v24193_nopotskill2'));
ok('README 含 smoke_v24193_nopotskill2 入库（403 份）', readme.includes('smoke_v24193_nopotskill2 入库（403 份）'));
ok('package.json 已收录 smoke_v24193_nopotskill2.mjs 且位于串尾（在 lowlvnopo2 之后）',
  pkg.includes('smoke_v24193_nopotskill2.mjs') &&
  pkg.includes('node tests/smoke_v24192_lowlvnopo2.mjs && node tests/smoke_v24193_nopotskill2.mjs && node tests/smoke_v24194_lowskillnopo2.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 403 件套', testChain === 404, String(testChain));
ok('CHANGELOG 含 v24.194 顶条目', changelog.startsWith('## v24.194'));

// —— 哨兵链：README 已有 403 口径且尚无 404（前望 405 语义：下一版才写 404）——
ok('README 已有四百零四件套口径且尚无 404（哨兵前望 405 语义：下一版才写 404）',
  readme.includes('扩充为冒烟四百零四件套（四百零三件套清除）') && !readme.includes('四百零五件套'));
{
  const s24143 = read('tests/smoke_v24143_furnacequest.mjs');
  ok('smoke_v24143 哨兵链前望 405（四百零五件套否定式）',
    s24143.includes('哨兵链前望 405') && s24143.includes('四百零五件套否定式'));
}
{
  ok('smoke_v24192 姊妹件版本字面量 pin 已随新现实推进（v24.194）',
    read('tests/smoke_v24192_lowlvnopo2.mjs').includes("const GAME_VERSION = 'v24.194';"));
  ok('smoke_v24191 姊妹件版本字面量 pin 已随新现实推进（v24.194）',
    read('tests/smoke_v24191_lowskill2.mjs').includes("const GAME_VERSION = 'v24.194';"));
  ok('smoke_v24190 姊妹件版本字面量 pin 已随新现实推进（v24.194）',
    read('tests/smoke_v24190_swiftnopo2.mjs').includes("const GAME_VERSION = 'v24.194';"));
  ok('smoke_v24189 姊妹件版本字面量 pin 已随新现实推进（v24.194）',
    read('tests/smoke_v24189_swiftskill2.mjs').includes("const GAME_VERSION = 'v24.194';"));
  ok('smoke_v24188 姊妹件版本字面量 pin 已随新现实推进（v24.194）',
    read('tests/smoke_v24188_swiftlv2.mjs').includes("const GAME_VERSION = 'v24.194';"));
  ok('smoke_v24187 姊妹件版本字面量 pin 已随新现实推进（v24.194）',
    read('tests/smoke_v24187_pennynopo2.mjs').includes("const GAME_VERSION = 'v24.194';"));
  ok('smoke_v24186 姊妹件版本字面量 pin 已随新现实推进（v24.194）',
    read('tests/smoke_v24186_pennynoskill2.mjs').includes("const GAME_VERSION = 'v24.194';"));
  ok('smoke_v24185 姊妹件版本字面量 pin 已随新现实推进（v24.194）',
    read('tests/smoke_v24185_pennylowlv2.mjs').includes("const GAME_VERSION = 'v24.194';"));
  ok('smoke_v24184 姊妹件版本字面量 pin 已随新现实推进（v24.194）',
    read('tests/smoke_v24184_pennyswift2.mjs').includes("const GAME_VERSION = 'v24.194';"));
  ok('smoke_v24183 姊妹件版本字面量 pin 已随新现实推进（v24.194）',
    read('tests/smoke_v24183_unfllowlv2.mjs').includes("const GAME_VERSION = 'v24.194';"));
  ok('smoke_v24181 姊妹件版本字面量 pin 已随新现实推进（v24.194）',
    read('tests/smoke_v24181_lampoilquest.mjs').includes("const GAME_VERSION = 'v24.194';"));
  ok('smoke_v24180 姊妹件版本字面量 pin 已随新现实推进（v24.194）',
    read('tests/smoke_v24180_unflskill2.mjs').includes("const GAME_VERSION = 'v24.194';"));
  ok('smoke_v24179 姊妹件版本字面量 pin 已随新现实推进（v24.194）',
    read('tests/smoke_v24179_unflnopo2.mjs').includes("const GAME_VERSION = 'v24.194';"));
  ok('smoke_v24178 姊妹件版本字面量 pin 已随新现实推进（v24.194）',
    read('tests/smoke_v24178_unflpenny2.mjs').includes("const GAME_VERSION = 'v24.194';"));
  ok('smoke_v24177 姊妹件版本字面量 pin 已随新现实推进（v24.194）',
    read('tests/smoke_v24177_unflswift2.mjs').includes("const GAME_VERSION = 'v24.194';"));
  ok('smoke_v24176 姊妹件版本字面量 pin 已随新现实推进（v24.194）',
    read('tests/smoke_v24176_pennynopo.mjs').includes("const GAME_VERSION = 'v24.194';"));
  ok('smoke_v24175 姊妹件版本字面量 pin 已随新现实推进（v24.194）',
    read('tests/smoke_v24175_pennynoskill.mjs').includes("const GAME_VERSION = 'v24.194';"));
  ok('smoke_v24174 姊妹件版本字面量 pin 已随新现实推进（v24.194）',
    read('tests/smoke_v24174_pennylowlv.mjs').includes("const GAME_VERSION = 'v24.194';"));
  ok('smoke_v24173 姊妹件版本字面量 pin 已随新现实推进（v24.194）',
    read('tests/smoke_v24173_pennyswift.mjs').includes("const GAME_VERSION = 'v24.194';"));
  ok('smoke_v2229 姊妹件版本恒等 pin 已随新现实推进（=== v24.194）',
    read('tests/smoke_v2229_metall.mjs').includes("GAME_VERSION === 'v24.194'"));
}

// —— 旧代 v24.193 字面量 / 402 件套口径 / 117 项 全库零残留扫描（豁免本套件 + 前代 v24192 + v24191 + v24190 + v24189 + v24188 + v24187 + v24186 + v24185 + v24184 + v24183 + v24181 + v24180 + v24179 + v24178 + v24177 + v24176 + v24175 + v24174 + v24173）——
// v24173-24192 是前代公式链载体，其 README 件套负向断言/版本锚点逐代 pin 由历史级联平移而成（v24193 自身
// 自带同款负向与扫描目标）。成就计数 117→118 扫描只认三形态。
const EXEMPT = new Set(['smoke_v24194_lowskillnopo2.mjs', 'smoke_v24193_nopotskill2.mjs', 'smoke_v24192_lowlvnopo2.mjs', 'smoke_v24191_lowskill2.mjs', 'smoke_v24190_swiftnopo2.mjs', 'smoke_v24189_swiftskill2.mjs', 'smoke_v24188_swiftlv2.mjs', 'smoke_v24187_pennynopo2.mjs', 'smoke_v24186_pennynoskill2.mjs', 'smoke_v24185_pennylowlv2.mjs', 'smoke_v24184_pennyswift2.mjs', 'smoke_v24183_unfllowlv2.mjs', 'smoke_v24181_lampoilquest.mjs', 'smoke_v24180_unflskill2.mjs', 'smoke_v24179_unflnopo2.mjs', 'smoke_v24178_unflpenny2.mjs', 'smoke_v24177_unflswift2.mjs', 'smoke_v24176_pennynopo.mjs', 'smoke_v24175_pennynoskill.mjs', 'smoke_v24174_pennylowlv.mjs', 'smoke_v24173_pennyswift.mjs']);
const leftovers = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests')).filter((x) => x.endsWith('.mjs') && !EXEMPT.has(x))) {
  const s = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  const code = s.split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  if (code.includes("const GAME_VERSION = 'v24.193'")) leftovers.push(f + ':gv');
  if (code.includes("GAME_VERSION === 'v24.193'")) leftovers.push(f + ':eq');
  if (code.includes("startsWith('## v24.193")) leftovers.push(f + ':st');
  if (code.includes('四百零三件套（四百零二件套清除）')) leftovers.push(f + ':402');
  if (code.includes('testChain === 403') || code.includes('files.length === 403') ||
      code.includes('treeTok.length === 403') || code.includes('chainAll.length === 403') ||
      code.includes('fileCount === 403'))
    leftovers.push(f + ':count');
  // 成就计数 117→118 零残留：只认「成就 N/117」/「**117 项成就**」/「全部 117 项进度」三形态
  if (code.includes('成就 N/117') || code.includes('**117 项成就**') || code.includes('全部 117 项进度'))
    leftovers.push(f + ':117');
}
ok('旧代 v24.193 GAME_VERSION 字面量/恒等/顶 pin 全库零残留（哨兵链，豁免本套件 + v24192 + v24191 + v24190 + v24189 + v24188 + v24187 + v24186 + v24185 + v24184 + v24183 + v24181 + v24180 + v24179 + v24178 + v24177 + v24176 + v24175 + v24174 + v24173）',
  leftovers.filter((x) => x.endsWith(':gv') || x.endsWith(':eq') || x.endsWith(':st')).length === 0,
  JSON.stringify(leftovers));
ok('旧代 402 件套口径/计数/117 项 pin 全库零残留（哨兵链，豁免本套件 + v24192 + v24191 + v24190 + v24189 + v24188 + v24187 + v24186 + v24185 + v24184 + v24183 + v24181 + v24180 + v24179 + v24178 + v24177 + v24176 + v24175 + v24174 + v24173）',
  leftovers.filter((x) => x.endsWith(':402') || x.endsWith(':count') || x.endsWith(':117')).length === 0,
  JSON.stringify(leftovers));

if (failed) { console.log(`— v24.194 冒烟完成：${n} 项断言，失败 ${failed} —`); process.exit(1); }
console.log(`— v24.194 冒烟完成：${n} 项断言，失败 0 —`);
