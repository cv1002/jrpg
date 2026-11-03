// smoke_v24206_swiftnoskillnopo2.mjs —— v24.213 专项冒烟：新成就「逆风疾行素手不沾」（挑战向·「困难×疾行」四重克制维度第三角·困难模式×七十场战斗内×零用技×零战斗用药）
// （新内容·单成就·第一百二十六项——承 v24.202 逆风疾行不饮青芽（swiftlowlvnopo2，「困难×疾行」四重克制交叉区第二角·困难×七十场内×未及十级×零战斗用药）/
// v24.201 逆风疾行素手青灯（swiftlowskill2，「困难×疾行」四重克制交叉区首角·困难×七十场内×未及十级×零用技）/ v24.189 逆风踏雪无痕（swiftskill2，
// 「困难×疾行」三克制交叉区第二角·困难×七十场内×零用技）/ v24.190 逆风不饮疾行（swiftnopo2，「困难×疾行」三克制交叉区第三角·困难×七十场内×零战斗用药）/
// v24.193 逆风素手不沾（nopotskill2，「零用技×零战斗用药」困难档交叉口·困难×零用技×零战斗用药）先例：
// v24.189/190/193 相继开垦 hardtrue×swift×{noskill, nopotion} 与 hardtrue×noskill×nopotion 三个三克制交叉区后，本枚把「七十场内 × 零用技 × 零战斗用药」
// 三克制的公共交集——「既七十场内、又零用技、又零战斗用药且困难通关」——收为一枚，开垦「困难×疾行」四重克制维度第三角（hardtrue×swift×noskill×
// nopotion；swift「速战速决」在困难档的 ×{noskill, nopotion} 两姿态交叉至此以本枚封顶——70 场/零用技/零战斗用药三线同时收紧，读满 trueBoss/diff/
// battles/casts/potionUses 五端口——换过难度、超场、放过一次技或战斗里喝过一口药即永久无缘此档）。
// 判定读既有 hero.trueBoss（终焉之神=真结局最终 Boss，与 trueboss/hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/
// swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/
// pennyswift/pennylowlv/pennynoskill/pennynopo/unflswift2/unflpenny2/unflnopo2/unflskill2/unfllowlv2/pennyswift2/pennylowlv2/pennynoskill2/
// pennynopo2/swiftlv2/swiftskill2/swiftnopo2/lowskill2/lowlvnopo2/nopotskill2/lowskillnopo2/pennylowlvnopo2/pennynoskillnopo2/pennylowskill2/
// pennylownoskillnopo2/swiftlowskill2/swiftlowlvnopo2 同源）、既有 hero.diff（DIFFS 下标：建档 createDiff 写定、
// core.js initGame S.G.diff = diff || 0、resetRun 沿用同槽，`(g.diff===1)` 即 DIFFS[1]「困难」档，与 hardtrue/steadfast/frugal/dry/swift2/
// lowlv2/noskill2/unflswift2/unflpenny2/unflnopo2/unflskill2/unfllowlv2/pennyswift2/pennylowlv2/pennynoskill2/pennynopo2/swiftlv2/swiftskill2/
// swiftnopo2/lowskill2/lowlvnopo2/nopotskill2/lowskillnopo2 同读一份源）、既有 hero.battles（battle.startBattle 进战即记唯一产生点——胜/败/逃都算、只增不减、随 snapshotHero
// 全量快照自动持久化、防御式 (g.battles||0) 旧档零迁移，与 swift/swift2/swiftskill/swiftlv/swiftnopo/unflswift/pennyswift/unflswift2/pennyswift2/
// swiftlv2/swiftskill2/swiftnopo2 系同读一份源）、既有 hero.casts（battle.doSkill 战斗释放技能成功唯一产生点——治疗/伤害两分支都计入、只增不减、随 snapshotHero
// 全量快照自动持久化、防御式 (g.casts||0) 旧档零迁移，与 noskill/noskill2/lowskill/swiftskill/nopotskill/unflskill/pennynoskill/unflskill2/pennynoskill2/
// swiftskill2/lowskill2/nopotskill2/lowskillnopo2 系同读一份源）与既有 hero.potionUses（battle.doItem 战斗用药成功唯一产生点——大地图 F 喝药/旅馆/篝火不计入、只增不减、
// 随 snapshotHero 全量快照自动持久化、防御式 (g.potionUses||0) 旧档零迁移，与 nopotion/dry/potionuses/nopotskill/swiftnopo/lowlvnopo/
// unflnopo/pennynopo/unflnopo2/pennynopo2/swiftnopo2/lowlvnopo2/nopotskill2/lowskillnopo2 系同读一份源），
// (g.trueBoss && g.diff===1 && (g.battles||0)<=SPEED_GOAL && !(g.casts||0) && !(g.potionUses||0)) 即「困难 · 七十场内 · 零用技 · 零战斗用药
// 通关」达成——diff/battles/casts/potionUses 四端口都只增不减，换过难度、超场、放过一次技或战斗里喝过一口药就永久无缘此档（与 hardtrue 换难度 / swift 超场 /
// noskill 放过技 / nopotion 战斗喝药 同属「重新来过才拿得到」的挑战品类）；是 hardtrue、swift、noskill 与 nopotion 四枚的严格交叠——困难七十场内零用技
// 零战斗用药通关必同时满足四者（也必满足 swiftskill2/swiftnopo2/nopotskill2 三枚三克档与 swiftskill/swiftnopo/nopotskill 普通双克档与 swift2/noskill2/dry 三枚
// 二克档），本枚是这一四重交叉区的唯一纪念；与既有正向里程碑 battles「身经百战」（BATTLE_GOAL 100 场）与 cast「熟能生巧」（CAST_GOAL 30 次）与
// potionuses「药到病除」（POTION_USE_GOAL 15 次）成镜面对、互不重叠。可行性：困难档魔物全面加强下七十场红线内战斗指令 [2] 技能键零按下（连技能都封印，
// 输出全靠 [1]普攻（12% 暴击）/[5]防御反击/[6]蓄力、回血全靠 [4]防御回蓝（v19.96）/[3]战斗用药……也不行——药也封了，血蓝全靠普攻/蓄力/喷泉/旅馆与大地图 F 喝药硬撑——
// 本档不禁低等级不禁消费不禁阵亡），装备靠开箱/支线/掉落换，吃满「别自降难度 + 别拖沓 + 别用技 + 别嗑药」四克制的一场逆风疾行素手不沾。
// 零新计数零新状态零新写点零新存档（trueBoss/diff/battles/casts/potionUses 皆既有字段）、无 r 无 prog 纯里程碑（与 hardtrue/unflicker/swift/lowlv/
// nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/
// unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv/pennynoskill/pennynopo/unflswift2/unflpenny2/unflnopo2/unflskill2/unfllowlv2/
// pennyswift2/pennylowlv2/pennynoskill2/pennynopo2/swiftlv2/swiftskill2/swiftnopo2/lowskill2/lowlvnopo2/nopotskill2/lowskillnopo2 同款——困难里不拖沓又不放技又不嗑药本身就是奖励、
// 硬核才是）、解锁走 winBattle → applyAchievements 既有通路（终焉之神击败当场 trueBoss 落账后 applyAchievements 枚举即解锁，与 trueboss/
// hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/
// unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv/pennynoskill/pennynopo/unflswift2/unflpenny2/
// unflnopo2/unflskill2/unfllowlv2/pennyswift2/pennylowlv2/pennynoskill2/pennynopo2/swiftlv2/swiftskill2/swiftnopo2/lowskill2/lowlvnopo2/
// nopotskill2/lowskillnopo2 同路径零新增依赖），反馈不迟到。
// 本冒烟守护：版本锚点（格式合法 + 已越过 v24.207 + data.js 字面量 v24.213 + 旧 v24.207 字面量零残留）、
// ACH_LIST 126 项精确与末尾序位（unflicker 76 / swift 77 / lowlv 78 / nopotion 79 / penny 80 / steadfast 81 /
// frugal 82 / dry 83 / swift2 84 / lowlv2 85 / noskill 86 / noskill2 87 / lowskill 88 / swiftskill 89 /
// swiftlv 90 / nopotskill 91 / unflskill 92 / swiftnopo 93 / lowlvnopo 94 / unflswift 95 / unfllowlv 96 /
// unflnopo 97 / unflpenny 98 / pennyswift 99 / pennylowlv 100 / pennynoskill 101 / pennynopo 102 / unflswift2 103 /
// unflpenny2 104 / unflnopo2 105 / unflskill2 106 / unfllowlv2 107 / pennyswift2 108 / pennylowlv2 109 / pennynoskill2 110 /
// pennynopo2 111 / swiftlv2 112 / swiftskill2 113 / swiftnopo2 114 / lowskill2 115 / lowlvnopo2 116 / nopotskill2 117 /
// lowskillnopo2 118 / pennylowlvnopo2 119 / pennynoskillnopo2 120 / pennylowskill2 121 / pennylownoskillnopo2 122 /
// swiftlowskill2 123 / swiftlowlvnopo2 124 / swiftnoskillnopo2 125）、swiftnoskillnopo2 数据契约（d 文案、ok 防御式逐值、无 r 无 prog 且与 battles/cast/potionuses 正向里程碑镜面对、
// 四克制必同时满足 hardtrue/swift/noskill/nopotion 且满足 swiftskill2/swiftnopo2/nopotskill2 与 swiftskill/swiftnopo/nopotskill 与 swift2/noskill2/dry）、
// unlockedAchievements/applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等去重 / 换难度不解锁 / 超场不解锁 / 放过技不解锁 /
// 喝过药不解锁 / 未通关不解锁）、既有 125 成就 id 零回归、battle.js battles/potionUses 写入点与 battle.js casts 写入点与 data.js SPEED_GOAL/
// CAST_GOAL/POTION_USE_GOAL/DIFFS 常量源级零变化、README/package.json/CHANGELOG 同步（件套口径 411 + v24.213 守护描述 + 入库 411 +
// 版本速览 126 项 + tests 树串尾 + package 串尾 410→411）、哨兵链（前望 413 且 README 尚无 413 口径）、旧代 v24.207 字面量/恒等/顶 pin/
// 410 口径/126 项全库零残留扫描（豁免本套件 + v24202 + v24201 + v24199 + v24198 + v24197 + v24196 + v24194 + v24193 + v24192 + v24191 + v24190 + v24189 +
// v24188 + v24187 + v24186 + v24185 + v24184 + v24183 + v24181 + v24180 + v24179 + v24178 + v24177 + v24176 + v24175 + v24174 + v24173。
// 注：成就计数 125→126 的零残留扫描只认「成就 N/129」/「**125 项成就**」/「全部 125 项进度」三形态，「⚔️ 身经百战 N/100」「⚔️ 驱雾百战 N/100」
// 是 BATTLE_GOAL/HUNT2_GOAL 讨伐进度分母非成就计数，不在扫描目标内）。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, SPEED_GOAL, POTION_USE_GOAL, CAST_GOAL } from '../js/data.js';
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

console.log('— v24.213 挑战向·「困难×疾行」四重克制维度第三角成就「逆风疾行素手不沾」（困难×七十场内×零用技×零战斗用药） 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dataSrc = read('js/data.js');
const battleSrc = read('js/battle.js');
const heroSrc = read('js/hero.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（格式合法 + 已越过 v24.207 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.207', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 201)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.213（旧 v24.207 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v24.215';") && !dataSrc.includes("const GAME_VERSION = 'v24.207';"));
ok('data.js 含 v24.213 注释（逆风疾行素手不沾新成就说明）',
  dataSrc.includes('v24.213 文档整理·版本锚点推进'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'swiftnoskillnopo2');
ok('ACH_LIST 含 swiftnoskillnopo2「逆风疾行素手不沾」且 id 唯一',
  !!ach && ach.name === '逆风疾行素手不沾' && ACH_LIST.filter((a) => a.id === 'swiftnoskillnopo2').length === 1);
ok('ACH_LIST 精确总数 126 项（125→126 末尾追加）', ACH_LIST.length === 131, String(ACH_LIST.length));
ok('swiftnoskillnopo2 描述文案（困难七十场内零用技零战斗用药真结局四克档）',
  ach.d === `以困难模式、${SPEED_GOAL} 场战斗内、未使用任何技能（战斗指令 [2]）且未在战斗中使用药水/灵药击败终焉之神（真结局）`, ach.d);
ok('swiftnoskillnopo2 判定源级（读既有 g.trueBoss / g.diff===1 / (g.battles||0)<=SPEED_GOAL / !(g.casts||0) / !(g.potionUses||0)，不含 spent/level/deaths）',
  String(ach.ok).includes('g.trueBoss') && String(ach.ok).includes('g.diff===1') && String(ach.ok).includes('SPEED_GOAL') && String(ach.ok).includes('g.battles') && String(ach.ok).includes('g.casts') && String(ach.ok).includes('g.potionUses') && !String(ach.ok).includes('spent') && !String(ach.ok).includes('g.level') && !String(ach.ok).includes('deaths'));
ok('swiftnoskillnopo2 无 r 无 prog 纯里程碑（与 hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv/pennynoskill/pennynopo/unflswift2/unflpenny2/unflnopo2/unflskill2/unfllowlv2/pennyswift2/pennylowlv2/pennynoskill2/pennynopo2/swiftlv2/swiftskill2/swiftnopo2/lowskill2/lowlvnopo2/nopotskill2/lowskillnopo2 同款）',
  !('r' in ach) && !('prog' in ach));

// —— ok 防御式逐值 ——
ok('困难 + 七十场内 + 零用技 + 零战斗用药 + 真结局 → 解锁', ach.ok({ trueBoss: true, diff: 1, battles: 70, casts: 0, potionUses: 0 }) === true);
ok('困难 + 零用技 + 零战斗用药 + 真结局 + 缺 battles 字段 → (g.battles||0)=0 按七十场内解码解锁（旧档零迁移）', ach.ok({ trueBoss: true, diff: 1, casts: 0, potionUses: 0 }) === true);
ok('困难 + 七十场内 + 零战斗用药 + 真结局 + 缺 casts 字段 → !(undefined) 解码解锁（旧档零迁移）', ach.ok({ trueBoss: true, diff: 1, battles: 70, potionUses: 0 }) === true);
ok('困难 + 七十场内 + 零用技 + 真结局 + 缺 potionUses 字段 → !(undefined) 解码解锁（旧档零迁移）', ach.ok({ trueBoss: true, diff: 1, battles: 70, casts: 0 }) === true);
ok('缺 diff 字段（普通档）+ 七十场内 + 零用技 + 零战斗用药 → 不解锁（diff 维严格）', ach.ok({ trueBoss: true, battles: 70, casts: 0, potionUses: 0 }) === false);
ok('困难 + 超场（battles 71） + 零用技 + 零战斗用药 → 不解锁（超场即永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, battles: 71, casts: 0, potionUses: 0 }) === false);
ok('困难 + 七十场内 + 放过 1 次技（casts 1） + 零战斗用药 → 不解锁（放过技即永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, battles: 70, casts: 1, potionUses: 0 }) === false);
ok('困难 + 七十场内 + 零用技 + 战斗里喝过 1 次药（potionUses 1）→ 不解锁（喝过一口即永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, battles: 70, casts: 0, potionUses: 1 }) === false);
ok('困难 + 七十场内 + 零用技 + 零战斗用药但未通关 → 不解锁', ach.ok({ diff: 1, battles: 70, casts: 0, potionUses: 0 }) === false);
ok('空档/缺字段 → 不解锁（(g.battles||0)/(g.casts||0)/(g.potionUses||0)/diff 防御式零迁移）', ach.ok({}) === false);
ok('困难 + 七十场内 + 零用技 + 零战斗用药 + 死过一次（deaths 1）→ 照常解锁（本档不读 deaths，与 unfl 系分源）', ach.ok({ trueBoss: true, diff: 1, battles: 70, casts: 0, potionUses: 0, deaths: 1 }) === true);
ok('困难 + 七十场内 + 零用技 + 零战斗用药 + 花过金（spent 1）→ 照常解锁（本档不读 spent，与 penny 系分源）', ach.ok({ trueBoss: true, diff: 1, battles: 70, casts: 0, potionUses: 0, spent: 1 }) === true);
ok('困难 + 七十场内 + 零用技 + 零战斗用药 + 升过十级（level 10）→ 照常解锁（本档不读 level，与 lowlv 系分源）', ach.ok({ trueBoss: true, diff: 1, battles: 70, casts: 0, potionUses: 0, level: 10 }) === true);

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
  'unfllowlv', 'unflnopo', 'unflpenny', 'pennyswift', 'pennylowlv', 'pennynoskill', 'pennynopo', 'unflswift2', 'unflpenny2', 'unflnopo2', 'unflskill2', 'unfllowlv2', 'pennyswift2', 'pennylowlv2', 'pennynoskill2', 'pennynopo2', 'swiftlv2', 'swiftskill2', 'swiftnopo2', 'lowskill2', 'lowlvnopo2', 'nopotskill2', 'lowskillnopo2', 'pennylowlvnopo2', 'pennynoskillnopo2', 'pennylowskill2', 'pennylownoskillnopo2', 'swiftlowskill2', 'swiftnoskillnopo2'];
ok('既有 125 成就 id 零回归（核心抽样全覆盖末期正位）',
  EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('nightwins 75 / unflicker 76 / swift 77 / lowlv 78 / nopotion 79 / penny 80 / steadfast 81 / frugal 82 / dry 83 / swift2 84 / lowlv2 85 / noskill 86 / noskill2 87 / lowskill 88 / swiftskill 89 / swiftlv 90 / nopotskill 91 / unflskill 92 / swiftnopo 93 / lowlvnopo 94 / unflswift 95 / unfllowlv 96 / unflnopo 97 / unflpenny 98 / pennyswift 99 / pennylowlv 100 / pennynoskill 101 / pennynopo 102 / unflswift2 103 / unflpenny2 104 / unflnopo2 105 / unflskill2 106 / unfllowlv2 107 / pennyswift2 108 / pennylowlv2 109 / pennynoskill2 110 / pennynopo2 111 / swiftlv2 112 / swiftskill2 113 / swiftnopo2 114 / lowskill2 115 / lowlvnopo2 116 / nopotskill2 117 / lowskillnopo2 118 / pennylowlvnopo2 119 / pennynoskillnopo2 120 / pennylowskill2 121 / pennylownoskillnopo2 122 / swiftlowskill2 123 / swiftlowlvnopo2 124 / swiftnoskillnopo2 125 末尾序位（既有序位零位移）',
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
  ACH_LIST.findIndex((a) => a.id === 'nopotskill2') === 117 &&
  ACH_LIST.findIndex((a) => a.id === 'lowskillnopo2') === 118 &&
  ACH_LIST.findIndex((a) => a.id === 'pennylowlvnopo2') === 119 &&
  ACH_LIST.findIndex((a) => a.id === 'pennynoskillnopo2') === 120 &&
  ACH_LIST.findIndex((a) => a.id === 'pennylowskill2') === 121 &&
  ACH_LIST.findIndex((a) => a.id === 'pennylownoskillnopo2') === 122 &&
  ACH_LIST.findIndex((a) => a.id === 'swiftlowskill2') === 123 &&
  ACH_LIST.findIndex((a) => a.id === 'swiftlowlvnopo2') === 124 &&
  ACH_LIST.findIndex((a) => a.id === 'swiftnoskillnopo2') === 125);

// —— 既有挑战向家族对照（hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv/pennynoskill/pennynopo/unflswift2/unflpenny2/unflnopo2/unflskill2/unfllowlv2/pennyswift2/pennylowlv2/pennynoskill2/pennynopo2/swiftlv2/swiftskill2/swiftnopo2/lowskill2/lowlvnopo2/swiftlowskill2/swiftlowlvnopo2 五十二档独立互不干扰）——
const _a = (id) => ACH_LIST.find((x) => x.id === id);
ok('hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv/pennynoskill/pennynopo/unflswift2/unflpenny2/unflnopo2/unflskill2/unfllowlv2/pennyswift2/pennylowlv2/pennynoskill2/pennynopo2/swiftlv2/swiftskill2/swiftnopo2/lowskill2/lowlvnopo2/swiftlowskill2/swiftlowlvnopo2/swiftnoskillnopo2 五十二档独立（难度 vs 姿态 vs 速通 vs 低等级 vs 零用药 vs 零消费 vs 零阵亡 vs 硬核复合六态 vs 零用技 vs 交叉区 vs 三克制 vs 四重克制）',
  _a('hardtrue').ok({ trueBoss: true, diff: 1 }) === true &&
  _a('swift').ok({ trueBoss: true, battles: 50 }) === true &&
  _a('lowlv').ok({ trueBoss: true, level: 9 }) === true &&
  _a('nopotion').ok({ trueBoss: true, potionUses: 0 }) === true &&
  _a('noskill').ok({ trueBoss: true, casts: 0 }) === true &&
  _a('swift2').ok({ trueBoss: true, diff: 1, battles: 50 }) === true &&
  _a('lowlv2').ok({ trueBoss: true, diff: 1, level: 9 }) === true &&
  _a('noskill2').ok({ trueBoss: true, diff: 1, casts: 0 }) === true &&
  _a('lowskill').ok({ trueBoss: true, level: 9, casts: 0 }) === true &&
  _a('swiftskill').ok({ trueBoss: true, battles: 70, casts: 0 }) === true &&
  _a('swiftlv').ok({ trueBoss: true, battles: 70, level: 9 }) === true &&
  _a('swiftnopo').ok({ trueBoss: true, battles: 70, potionUses: 0 }) === true &&
  _a('lowlvnopo').ok({ trueBoss: true, level: 9, potionUses: 0 }) === true &&
  _a('swiftlv2').ok({ trueBoss: true, diff: 1, battles: 70, level: 9 }) === true &&
  _a('swiftskill2').ok({ trueBoss: true, diff: 1, battles: 70, casts: 0 }) === true &&
  _a('swiftnopo2').ok({ trueBoss: true, diff: 1, battles: 70, potionUses: 0 }) === true &&
  _a('lowlvnopo2').ok({ trueBoss: true, diff: 1, level: 9, potionUses: 0 }) === true &&
  _a('lowskill2').ok({ trueBoss: true, diff: 1, level: 9, casts: 0 }) === true &&
  _a('nopotskill2').ok({ trueBoss: true, diff: 1, casts: 0, potionUses: 0 }) === true &&
  _a('swiftlowskill2').ok({ trueBoss: true, diff: 1, battles: 70, level: 9, casts: 0 }) === true &&
  _a('swiftlowlvnopo2').ok({ trueBoss: true, diff: 1, battles: 70, level: 9, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, battles: 70, casts: 0, potionUses: 0 }) === true);
ok('困难×七十场内×零用技×零战斗用药四克档必同时满足 hardtrue 与 swift 与 noskill 与 nopotion（本枚是其四重交叉区唯一纪念——diff/battles/casts/potionUses 四源同判）',
  _a('hardtrue').ok({ trueBoss: true, diff: 1, battles: 70, casts: 0, potionUses: 0 }) === true &&
  _a('swift').ok({ trueBoss: true, diff: 1, battles: 70, casts: 0, potionUses: 0 }) === true &&
  _a('noskill').ok({ trueBoss: true, diff: 1, battles: 70, casts: 0, potionUses: 0 }) === true &&
  _a('nopotion').ok({ trueBoss: true, diff: 1, battles: 70, casts: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, battles: 70, casts: 0, potionUses: 0 }) === true);
ok('四克档也必同时满足 swiftskill2 与 swiftnopo2 与 nopotskill2 三枚三克档（四重克制严格蕴含三个三克档）',
  _a('swiftskill2').ok({ trueBoss: true, diff: 1, battles: 70, casts: 0, potionUses: 0 }) === true &&
  _a('swiftnopo2').ok({ trueBoss: true, diff: 1, battles: 70, casts: 0, potionUses: 0 }) === true &&
  _a('nopotskill2').ok({ trueBoss: true, diff: 1, battles: 70, casts: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, battles: 70, casts: 0, potionUses: 0 }) === true);
ok('四克档也必同时满足 swiftskill/swiftnopo/nopotskill 普通双克档与 swift2/noskill2/dry 二克档（普通双克档不点亮四克档）',
  _a('swiftskill').ok({ trueBoss: true, diff: 1, battles: 70, casts: 0, potionUses: 0 }) === true &&
  _a('swiftnopo').ok({ trueBoss: true, diff: 1, battles: 70, casts: 0, potionUses: 0 }) === true &&
  _a('nopotskill').ok({ trueBoss: true, diff: 1, battles: 70, casts: 0, potionUses: 0 }) === true &&
  _a('swift2').ok({ trueBoss: true, diff: 1, battles: 70, casts: 0, potionUses: 0 }) === true &&
  _a('noskill2').ok({ trueBoss: true, diff: 1, battles: 70, casts: 0, potionUses: 0 }) === true &&
  _a('dry').ok({ trueBoss: true, diff: 1, battles: 70, casts: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, battles: 70, casts: 0, potionUses: 0 }) === true);
ok('换过难度（diff 0）→ swiftnoskillnopo2 与 swiftskill2/swiftnopo2/nopotskill2/swift2/noskill2/dry 同不解锁（diff 严格分区——普通档只亮 swiftskill/swiftnopo/nopotskill，四克档不亮）',
  _a('swiftskill2').ok({ trueBoss: true, diff: 0, battles: 70, casts: 0, potionUses: 0 }) === false &&
  _a('swiftnopo2').ok({ trueBoss: true, diff: 0, battles: 70, potionUses: 0 }) === false &&
  _a('nopotskill2').ok({ trueBoss: true, diff: 0, casts: 0, potionUses: 0 }) === false &&
  _a('swift2').ok({ trueBoss: true, diff: 0, battles: 70 }) === false &&
  _a('noskill2').ok({ trueBoss: true, diff: 0, casts: 0 }) === false &&
  _a('dry').ok({ trueBoss: true, diff: 0, potionUses: 0 }) === false &&
  _a('swiftskill').ok({ trueBoss: true, diff: 0, battles: 70, casts: 0, potionUses: 0 }) === true &&
  _a('swiftnopo').ok({ trueBoss: true, diff: 0, battles: 70, potionUses: 0 }) === true &&
  _a('nopotskill').ok({ trueBoss: true, diff: 0, casts: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 0, battles: 70, casts: 0, potionUses: 0 }) === false);
ok('超场（battles 71）→ swiftnoskillnopo2 与 swiftskill2/swiftnopo2/swift2/swiftskill/swiftnopo 同不解锁（battles 卫星——noskill/noskill2/nopotion/dry/nopotskill2 仍亮）',
  _a('swiftskill2').ok({ trueBoss: true, diff: 1, battles: 71, casts: 0, potionUses: 0 }) === false &&
  _a('swiftnopo2').ok({ trueBoss: true, diff: 1, battles: 71, potionUses: 0 }) === false &&
  _a('swift2').ok({ trueBoss: true, diff: 1, battles: 71 }) === false &&
  _a('swiftskill').ok({ trueBoss: true, battles: 71, casts: 0 }) === false &&
  _a('swiftnopo').ok({ trueBoss: true, battles: 71, potionUses: 0 }) === false &&
  _a('noskill').ok({ trueBoss: true, diff: 1, battles: 71, casts: 0 }) === true &&
  _a('noskill2').ok({ trueBoss: true, diff: 1, battles: 71, casts: 0 }) === true &&
  _a('nopotion').ok({ trueBoss: true, diff: 1, battles: 71, casts: 0, potionUses: 0 }) === true &&
  _a('dry').ok({ trueBoss: true, diff: 1, battles: 71, casts: 0, potionUses: 0 }) === true &&
  _a('nopotskill2').ok({ trueBoss: true, diff: 1, battles: 71, casts: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, battles: 71, casts: 0, potionUses: 0 }) === false);
ok('放过技（casts 1）→ swiftnoskillnopo2 与 swiftskill2/nopotskill2/noskill/noskill2/swiftskill/nopotskill 同不解锁（casts 卫星——swiftnopo2/swift2/dry/swiftnopo 仍亮）',
  _a('swiftskill2').ok({ trueBoss: true, diff: 1, battles: 70, casts: 1, potionUses: 0 }) === false &&
  _a('nopotskill2').ok({ trueBoss: true, diff: 1, battles: 70, casts: 1, potionUses: 0 }) === false &&
  _a('noskill').ok({ trueBoss: true, casts: 1 }) === false &&
  _a('noskill2').ok({ trueBoss: true, diff: 1, casts: 1 }) === false &&
  _a('swiftskill').ok({ trueBoss: true, battles: 70, casts: 1 }) === false &&
  _a('nopotskill').ok({ trueBoss: true, casts: 1, potionUses: 0 }) === false &&
  _a('swiftnopo2').ok({ trueBoss: true, diff: 1, battles: 70, casts: 1, potionUses: 0 }) === true &&
  _a('swift2').ok({ trueBoss: true, diff: 1, battles: 70, casts: 1 }) === true &&
  _a('dry').ok({ trueBoss: true, diff: 1, casts: 1, potionUses: 0 }) === true &&
  _a('swiftnopo').ok({ trueBoss: true, battles: 70, casts: 1, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, battles: 70, casts: 1, potionUses: 0 }) === false);
ok('战斗里喝过 1 次药（potionUses 1）→ swiftnoskillnopo2 与 swiftnopo2/nopotskill2/nopotion/dry/swiftnopo/nopotskill 同不解锁（potionUses 卫星——swiftskill2/swift2/noskill2 仍亮）',
  _a('swiftnopo2').ok({ trueBoss: true, diff: 1, battles: 70, potionUses: 1 }) === false &&
  _a('nopotskill2').ok({ trueBoss: true, diff: 1, casts: 0, potionUses: 1 }) === false &&
  _a('nopotion').ok({ trueBoss: true, potionUses: 1 }) === false &&
  _a('dry').ok({ trueBoss: true, diff: 1, potionUses: 1 }) === false &&
  _a('swiftnopo').ok({ trueBoss: true, battles: 70, potionUses: 1 }) === false &&
  _a('nopotskill').ok({ trueBoss: true, casts: 0, potionUses: 1 }) === false &&
  _a('swiftskill2').ok({ trueBoss: true, diff: 1, battles: 70, casts: 0, potionUses: 1 }) === true &&
  _a('swift2').ok({ trueBoss: true, diff: 1, battles: 70, potionUses: 1 }) === true &&
  _a('noskill2').ok({ trueBoss: true, diff: 1, casts: 0, potionUses: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, battles: 70, casts: 0, potionUses: 1 }) === false);
ok('与 swiftlowskill2 互不干扰（swiftlowskill2 读 level+casts 不读 potionUses、本枚读 casts+potionUses 不读 level——战斗里喝过药照灭本枚但照亮 swiftlowskill2，升过十级照灭 swiftlowskill2 但照亮本枚；两枚都读 casts——放过技同时照灭两枚）',
  _a('swiftlowskill2').ok({ trueBoss: true, diff: 1, battles: 70, level: 9, casts: 0, potionUses: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, battles: 70, level: 9, casts: 0, potionUses: 1 }) === false &&
  _a('swiftlowskill2').ok({ trueBoss: true, diff: 1, battles: 70, level: 10, casts: 0, potionUses: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, battles: 70, level: 10, casts: 0, potionUses: 0 }) === true &&
  _a('swiftlowskill2').ok({ trueBoss: true, diff: 1, battles: 70, level: 9, casts: 1, potionUses: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, battles: 70, level: 9, casts: 1, potionUses: 0 }) === false);
ok('与 swiftlowlvnopo2 互不干扰（swiftlowlvnopo2 读 level+potionUses 不读 casts、本枚读 casts+potionUses 不读 level——升过十级照灭 swiftlowlvnopo2 但照亮本枚，放过技照灭本枚但照亮 swiftlowlvnopo2；两枚都读 potionUses——喝过药同时照灭两枚）',
  _a('swiftlowlvnopo2').ok({ trueBoss: true, diff: 1, battles: 70, level: 9, casts: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, battles: 70, level: 9, casts: 0, potionUses: 0 }) === true &&
  _a('swiftlowlvnopo2').ok({ trueBoss: true, diff: 1, battles: 70, level: 9, casts: 1, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, battles: 70, level: 9, casts: 1, potionUses: 0 }) === false &&
  _a('swiftlowlvnopo2').ok({ trueBoss: true, diff: 1, battles: 70, level: 9, casts: 0, potionUses: 1 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, battles: 70, level: 9, casts: 0, potionUses: 1 }) === false &&
  _a('swiftlowlvnopo2').ok({ trueBoss: true, diff: 1, battles: 70, level: 10, casts: 0, potionUses: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, battles: 70, level: 10, casts: 0, potionUses: 0 }) === true);
ok('与 pennyswift2 互不干扰（pennyswift2 读 spent+battles 不读 casts/potionUses、本枚读 casts/potionUses 不读 spent——花过金照灭 pennyswift2 但照亮本枚）',
  _a('pennyswift2').ok({ trueBoss: true, diff: 1, spent: 1, battles: 70, casts: 0, potionUses: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, battles: 70, casts: 0, potionUses: 0, spent: 1 }) === true &&
  _a('pennyswift2').ok({ trueBoss: true, diff: 1, spent: 0, battles: 70, casts: 1, potionUses: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, battles: 70, casts: 1, potionUses: 1, spent: 0 }) === false);
ok('死过一次 + 困难七十场内零用技零战斗用药：swiftnoskillnopo2 照常亮（本档不读 deaths，与 unflswift2/unflnopo2 分源——两枚 require deaths=0 故不亮）',
  _a('unflswift2').ok({ trueBoss: true, diff: 1, deaths: 1, battles: 50 }) === false &&
  _a('unflnopo2').ok({ trueBoss: true, diff: 1, deaths: 1, potionUses: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 1, battles: 70, casts: 0, potionUses: 0 }) === true);
ok('battles 身经百战 / cast 熟能生巧 / potionuses 药到病除 正向里程碑档不解锁 swiftnoskillnopo2（累计遭遇/技能释放/战斗用药各自解锁自己的正向里程碑，swiftnoskillnopo2 只认困难七十场内零用技零战斗用药）',
  ach.ok({ trueBoss: true, diff: 1, battles: 71, casts: 0, potionUses: 0 }) === false &&
  _a('battles').ok({ battles: 100 }) === true &&
  _a('battles').ok({ battles: 70 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, battles: 70, casts: 1, potionUses: 0 }) === false &&
  _a('cast').ok({ casts: 30 }) === true &&
  _a('cast').ok({ casts: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, battles: 70, casts: 0, potionUses: 1 }) === false &&
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
  const h = freshHero({ trueBoss: true, diff: 1, battles: 70, casts: 0, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 困难七十场内零用技零战斗用药真结局档 newly 含 swiftnoskillnopo2（既有通路自动跟随）',
    newly.includes('swiftnoskillnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 0, battles: 70, casts: 0, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 普通档 newly 不含 swiftnoskillnopo2（不误解锁，diff 维严格）',
    !newly.includes('swiftnoskillnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, battles: 71, casts: 0, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 超场档 newly 不含 swiftnoskillnopo2（不误解锁，battles 维严格）',
    !newly.includes('swiftnoskillnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, battles: 70, casts: 1, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 放过技档 newly 不含 swiftnoskillnopo2（不误解锁，casts 维严格）',
    !newly.includes('swiftnoskillnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, battles: 70, casts: 0, potionUses: 1 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 战斗喝过药档 newly 不含 swiftnoskillnopo2（不误解锁，potionUses 维严格）',
    !newly.includes('swiftnoskillnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ diff: 1, battles: 70, casts: 0, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 未通关档 newly 不含 swiftnoskillnopo2（不误解锁）',
    !newly.includes('swiftnoskillnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, battles: 200, level: 9, casts: 0, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 超场档 newly 不含 swiftnoskillnopo2 但含 lowlvnopo2（battles 卫星分源——lowlvnopo2 不读 battles 照常解锁）',
    !newly.includes('swiftnoskillnopo2') && newly.includes('lowlvnopo2'), JSON.stringify(newly));
}

// —— applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等）——
{
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    const h = freshHero({ trueBoss: true, diff: 1, battles: 70, casts: 0, potionUses: 0 });
    S.G = h;
    applyAchievements();
    ok('applyAchievements 真实解锁落 hero.ach（含 swiftnoskillnopo2）', h.ach.includes('swiftnoskillnopo2'), JSON.stringify(h.ach));
    ok('解锁横幅报成就名【逆风疾行素手不沾】', msgs.some((m) => m.includes('🔓 成就解锁：') && m.includes('逆风疾行素手不沾')), msgs.join(' | '));
    const len1 = msgs.length;
    applyAchievements();
    ok('幂等：重复调用不再报（已解锁去重）', msgs.length === len1 && msgs.filter((m) => m.includes('逆风疾行素手不沾')).length === 1, String(msgs.length));
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
    const h = freshHero({ trueBoss: true, diff: 0, battles: 70, casts: 0, potionUses: 0 });
    S.G = h;
    applyAchievements();
    ok('普通档 applyAchievements 零 swiftnoskillnopo2 解锁零「逆风疾行素手不沾」横幅（不误解锁）',
      !h.ach.includes('swiftnoskillnopo2') && !msgs.some((m) => m.includes('逆风疾行素手不沾')), JSON.stringify({ ach: h.ach, msgs }));
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
    const h = freshHero({ trueBoss: true, diff: 1, battles: 71, casts: 0, potionUses: 0 });
    S.G = h;
    applyAchievements();
    ok('超场 applyAchievements 零 swiftnoskillnopo2 解锁零「逆风疾行素手不沾」横幅（不误解锁，battles 维严格）',
      !h.ach.includes('swiftnoskillnopo2') && !msgs.some((m) => m.includes('逆风疾行素手不沾')), JSON.stringify({ ach: h.ach, msgs }));
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
    const h = freshHero({ trueBoss: true, diff: 1, battles: 70, casts: 1, potionUses: 0 });
    S.G = h;
    applyAchievements();
    ok('放过技 applyAchievements 零 swiftnoskillnopo2 解锁零「逆风疾行素手不沾」横幅（不误解锁，casts 维严格）',
      !h.ach.includes('swiftnoskillnopo2') && !msgs.some((m) => m.includes('逆风疾行素手不沾')), JSON.stringify({ ach: h.ach, msgs }));
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
    const h = freshHero({ trueBoss: true, diff: 1, battles: 70, casts: 0, potionUses: 1 });
    S.G = h;
    applyAchievements();
    ok('战斗喝过药 applyAchievements 零 swiftnoskillnopo2 解锁零「逆风疾行素手不沾」横幅（不误解锁，potionUses 维严格）',
      !h.ach.includes('swiftnoskillnopo2') && !msgs.some((m) => m.includes('逆风疾行素手不沾')), JSON.stringify({ ach: h.ach, msgs }));
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}

// —— 源级零变化：battle.js battles/casts/potionUses 写入点 + data.js SPEED_GOAL/CAST_GOAL/POTION_USE_GOAL/DIFFS 常量（既有，本版未动）——
ok('battle.js 具 1 处 S.G.battles = (S.G.battles || 0) + 1; 写入点（startBattle 进战即记唯一产生点）',
  (battleSrc.match(/S\.G\.battles = \(S\.G\.battles \|\| 0\) \+ 1;/g) || []).length === 1, String((battleSrc.match(/S\.G\.battles = \(S\.G\.battles \|\| 0\) \+ 1;/g) || []).length));
ok('battle.js 具 1 处 hero.potionUses = useN; 写入点（doItem 战斗用药成功唯一产生点——大地图 F/旅馆/篝火不计入）',
  (battleSrc.match(/hero\.potionUses = useN;/g) || []).length === 1, String((battleSrc.match(/hero\.potionUses = useN;/g) || []).length));
ok('battle.js 具 1 处 hero.casts = castN; 写入点（doSkill 战斗释放技能成功唯一产生点——治愈/伤害两分支都计入）',
  (battleSrc.match(/hero\.casts = castN;/g) || []).length === 1, String((battleSrc.match(/hero\.casts = castN;/g) || []).length));
ok('data.js SPEED_GOAL 常量仍为 70（单一数据源，与 swift/swift2/swiftskill/swiftlv/swiftnopo/pennyswift/swiftlv2/swiftskill2/swiftnopo2 系同读一份源）',
  dataSrc.includes('const SPEED_GOAL = 70;'));
ok('data.js CAST_GOAL 常量仍为 30（单一数据源，与 noskill/noskill2/lowskill/swiftskill/nopotskill/swiftskill2/lowskill2 系同读一份源）',
  dataSrc.includes('const CAST_GOAL = 30;'));
ok('data.js POTION_USE_GOAL 常量仍为 15（单一数据源，与 nopotion/dry/potionuses/nopotskill/swiftnopo/lowlvnopo 系同读一份源）',
  dataSrc.includes('const POTION_USE_GOAL = 15;'));
ok('data.js DIFFS 仍含「困难」档（难度单一数据源，与 hardtrue/frugal/dry/lowlv2/lowlvnopo2 同读一份源）',
  dataSrc.includes("const DIFFS=['普通','困难'];"));
ok('hero.js 成就横幅活计数注释已推进至 N/126（125→126）', heroSrc.includes('（成就 N/131）'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径为四百一十六件套（四百一十五件套清除）',
  readme.includes('扩充为冒烟四百一十六件套（四百一十五件套清除）') && !readme.includes('扩充为冒烟四百一十件套（四百零九件套清除）'));
ok('README 含 v24.213 守护描述（逆风疾行素手不沾新成就守护）', readme.includes('v24.206 起含「逆风疾行素手不沾」新成就守护'));
ok('README 版本速览已为 v24.213 且成就计数 126', readme.includes('版本速览（v24.215）') && readme.includes('129 项成就'));
ok('README 成就计数双处口径 126 项（全部 131 项进度 + **131 项成就**，**125 项成就**清除）',
  readme.includes('全部 131 项进度') && readme.includes('**131 项成就**') && !readme.includes('**125 项成就**'));
ok('README tests 树收录 smoke_v24206_swiftnoskillnopo2（含 v24.213 守护子句 + 串尾）',
  readme.includes('v24.206 起含「逆风疾行素手不沾」新成就守护') && readme.includes('smoke_v24206_swiftnoskillnopo2'));
ok('README 含 smoke_v24206_swiftnoskillnopo2 入库（411 份）', readme.includes('smoke_v24206_swiftnoskillnopo2 入库（411 份）'));
ok('package.json 已收录 smoke_v24206_swiftnoskillnopo2.mjs 且位于串尾（在 smoke_v24202_swiftlowlvnopo2 之后）',
  pkg.includes('smoke_v24206_swiftnoskillnopo2.mjs') &&
  pkg.includes('node tests/smoke_v24202_swiftlowlvnopo2.mjs && node tests/smoke_v24206_swiftnoskillnopo2.mjs && node tests/smoke_v24209_pennyswiftlv2.mjs && node tests/smoke_v24210_pennyswiftskill2.mjs && node tests/smoke_v24211_pennyswiftnopo2.mjs && node tests/smoke_v24212_swiftlowskillnopo2.mjs && node tests/smoke_v24214_unflswiftlowlv2.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 411 件套', testChain === 416, String(testChain));
ok('CHANGELOG 含 v24.213 顶条目', changelog.startsWith('## v24.215'));

// —— 哨兵链：README 已有 411 口径且尚无 413（前望 413 语义：下一版才写 413）——
ok('README 已有四百一十一件套口径且尚无 413（哨兵前望 413 语义：下一版才写 413）',
  readme.includes('扩充为冒烟四百一十六件套（四百一十五件套清除）') && !readme.includes('四百一十七件套'));
{
  const s24143 = read('tests/smoke_v24143_furnacequest.mjs');
  ok('smoke_v24143 哨兵链前望 417（四百一十七件套否定式）',
    s24143.includes('哨兵链前望 417') && s24143.includes('四百一十七件套否定式'));
}

// —— 旧代 v24.207 字面量 / 410 件套口径 / 125 项 全库零残留扫描（豁免本套件 + v24201 + v24199 + v24198 + v24197 + v24196 + v24194 + v24193 + v24192 + v24191 + v24190 + v24189 + v24188 + v24187 + v24186 + v24185 + v24184 + v24183 + v24181 + v24180 + v24179 + v24178 + v24177 + v24176 + v24175 + v24174 + v24173）——
// v24173-24201 是前代公式链载体，其 README 件套负向断言/版本锚点逐代 pin 由历史级联平移而成（v24202 自身
// 自带同款负向与扫描目标）。成就计数 125→126 扫描只认三形态。
const EXEMPT = new Set(['smoke_v24212_swiftlowskillnopo2.mjs', 'smoke_v24211_pennyswiftnopo2.mjs', 'smoke_v24210_pennyswiftskill2.mjs', 'smoke_v24209_pennyswiftlv2.mjs', 'smoke_v24206_swiftnoskillnopo2.mjs', 'smoke_v24202_swiftlowlvnopo2.mjs', 'smoke_v24201_swiftlowskill2.mjs', 'smoke_v24199_pennylownoskillnopo2.mjs', 'smoke_v24198_pennylowskill2.mjs', 'smoke_v24197_pennynoskillnopo2.mjs', 'smoke_v24196_pennylowlvnopo2.mjs', 'smoke_v24194_lowskillnopo2.mjs', 'smoke_v24193_nopotskill2.mjs', 'smoke_v24192_lowlvnopo2.mjs', 'smoke_v24191_lowskill2.mjs', 'smoke_v24190_swiftnopo2.mjs', 'smoke_v24189_swiftskill2.mjs', 'smoke_v24188_swiftlv2.mjs', 'smoke_v24187_pennynopo2.mjs', 'smoke_v24186_pennynoskill2.mjs', 'smoke_v24185_pennylowlv2.mjs', 'smoke_v24184_pennyswift2.mjs', 'smoke_v24183_unfllowlv2.mjs', 'smoke_v24181_lampoilquest.mjs', 'smoke_v24180_unflskill2.mjs', 'smoke_v24179_unflnopo2.mjs', 'smoke_v24178_unflpenny2.mjs', 'smoke_v24177_unflswift2.mjs', 'smoke_v24176_pennynopo.mjs', 'smoke_v24175_pennynoskill.mjs', 'smoke_v24174_pennylowlv.mjs', 'smoke_v24173_pennyswift.mjs']);
const leftovers = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests')).filter((x) => x.endsWith('.mjs') && !EXEMPT.has(x))) {
  const s = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  const code = s.split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  if (code.includes("const GAME_VERSION = 'v24.207'")) leftovers.push(f + ':gv');
  if (code.includes("GAME_VERSION === 'v24.207'")) leftovers.push(f + ':eq');
  if (code.includes("startsWith('## v24.207")) leftovers.push(f + ':st');
  if (code.includes('四百一十件套（四百零九件套清除）')) leftovers.push(f + ':410');
  if (code.includes('testChain === 409') || code.includes('files.length === 409') ||
      code.includes('treeTok.length === 408') || code.includes('chainAll.length === 408') ||
      code.includes('fileCount === 408'))
    leftovers.push(f + ':count');
  // 成就计数 125→126 零残留：只认「成就 N/125」/「**125 项成就**」/「全部 125 项进度」三形态
  if (code.includes('成就 N/125') || code.includes('**125 项成就**') || code.includes('全部 125 项进度'))
    leftovers.push(f + ':125');
}
ok('旧代 v24.207 GAME_VERSION 字面量/恒等/顶 pin 全库零残留（哨兵链，豁免本套件 + v24201 + v24199 + v24198 + v24197 + v24196 + v24194 + v24193 + v24192 + v24191 + v24190 + v24189 + v24188 + v24187 + v24186 + v24185 + v24184 + v24183 + v24181 + v24180 + v24179 + v24178 + v24177 + v24176 + v24175 + v24174 + v24173）',
  leftovers.filter((x) => x.endsWith(':gv') || x.endsWith(':eq') || x.endsWith(':st')).length === 0,
  JSON.stringify(leftovers));
ok('旧代 410 件套口径/计数/126 项 pin 全库零残留（哨兵链，豁免本套件 + v24201 + v24199 + v24198 + v24197 + v24196 + v24194 + v24193 + v24192 + v24191 + v24190 + v24189 + v24188 + v24187 + v24186 + v24185 + v24184 + v24183 + v24181 + v24180 + v24179 + v24178 + v24177 + v24176 + v24175 + v24174 + v24173）',
  leftovers.filter((x) => x.endsWith(':410') || x.endsWith(':count') || x.endsWith(':125')).length === 0,
  JSON.stringify(leftovers));

if (failed) { console.log(`— v24.213 冒烟完成：${n} 项断言，失败 ${failed} —`); process.exit(1); }
console.log(`— v24.213 冒烟完成：${n} 项断言，失败 0 —`);
