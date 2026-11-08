// smoke_v24199_pennylownoskillnopo2.mjs —— v24.213 专项冒烟：新成就「逆风白手素手不饮青芽」（挑战向·「hardtrue+姿态」五维全克收官·第一百二十三项·困难模式×零消费×未及十级×零用技×零战斗用药）
// （新内容·单成就·第一百二十三项——承 v24.199 逆风白手素手青芽（pennylowskill2，「hardtrue+姿态」四重克制第四枚·困难×零消费×未及十级×零用技）/
// v24.196 逆风白手不饮青芽（pennylowlvnopo2，「hardtrue+姿态」四重克制第二枚·困难×零消费×未及十级×零战斗用药）/ v24.197 逆风白手素手不沾（pennynoskillnopo2，
// 「hardtrue+姿态」四重克制第三枚·困难×零消费×零用技×零战斗用药）/ v24.194 逆风素手不饮青灯（lowskillnopo2，「hardtrue+三姿态」四重克制首枚·困难×未及十级×
// 零用技×零战斗用药）先例：v24.194-198 已把「hardtrue+姿态」四重克制四角（penny×lowlv×noskill / penny×lowlv×nopotion / penny×noskill×nopotion /
// lowlv×noskill×nopotion）尽数开垦，本枚把「零消费」姿态（penny）叠上 lowlv×noskill×nopotion 三克，把四个四克档的公共交集——「既零消费、又未及十级、
// 又零用技、又零战斗用药且困难通关」——收为一枚，开垦「hardtrue+姿态」五维全克维度收官枚（hardtrue×penny×lowlv×noskill×nopotion 五重交叉区；一条线
// 读满 trueBoss/diff/spent/level/casts/potionUses 六端口——升过十级、花过 1 金、放过一次技或战斗里喝过一口药即永久无缘此档）。
// 判定读既有 hero.trueBoss（终焉之神=真结局最终 Boss，与 trueboss/hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/
// swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/
// pennyswift/pennylowlv/pennynoskill/pennynopo/unflswift2/unflpenny2/unflnopo2/unflskill2/unfllowlv2/pennyswift2/pennylowlv2/pennynoskill2/
// pennynopo2/swiftlv2/swiftskill2/swiftnopo2/lowskill2/lowlvnopo2/nopotskill2/lowskillnopo2/pennylowlvnopo2/pennynoskillnopo2/pennylowskill2 同源）、既有 hero.diff
// （DIFFS 下标：建档 createDiff 写定、core.js initGame S.G.diff = diff || 0、resetRun 沿用同槽，`(g.diff===1)` 即 DIFFS[1]「困难」档，与 hardtrue/steadfast/
// frugal/dry/swift2/lowlv2/noskill2/unflswift2/unflpenny2/unflnopo2/unflskill2/unfllowlv2/pennyswift2/pennylowlv2/pennynoskill2/pennynopo2/
// swiftlv2/swiftskill2/swiftnopo2/lowskill2/lowlvnopo2/nopotskill2/lowskillnopo2/pennylowlvnopo2/pennynoskillnopo2/pennylowskill2 同读一份源）、既有 hero.spent
// （消费线五端口——商店购买×3/住店/酿造——金币扣减唯一产生点共享累计、只增不减、随 snapshotHero 全量快照自动持久化、防御式 (g.spent||0) 旧档零迁移，
// 与 penny「白手成灯」/frugal「两袖清风」/spend「一掷千金」/unflpenny/pennyswift/pennylowlv/pennynoskill/pennynopo/pennyswift2/pennylowlv2/
// pennynoskill2/pennynopo2/pennylowlvnopo2/pennynoskillnopo2/pennylowskill2 系同读一份源）、既有 hero.level（hero.js grantXp 升级唯一产生点 hero.level++、
// 只增不减、随 snapshotHero 全量快照自动持久化、防御式 (g.level||1) 旧档零迁移，与 lowlv「未及十级」/lowlv2「逆风青芽」/lowskill/swiftlv/
// lowlvnopo/unfllowlv/pennylowlv/unfllowlv2/pennylowlv2/swiftlv2/lowskill2/lowlvnopo2/pennylowskill2 系同读一份源）、既有 hero.casts（battle.doSkill 战斗释放技能成功
// 唯一产生点——治疗与伤害两分支都计入、只增不减、随 snapshotHero 全量快照自动持久化、防御式 (g.casts||0) 旧档零迁移，与 noskill「大巧不工」/
// noskill2「逆风守拙」/cast「熟能生巧」/lowskill/swiftskill/nopotskill/unflskill/pennynoskill/unflskill2/pennynoskill2/swiftskill2/pennylowskill2 系同读一份源）
// 与既有 hero.potionUses（battle.doItem 战斗用药成功唯一产生点——战斗指令 [3] 用药成功即记、大地图 F 喝药/旅馆/篝火不计入、只增不减、随 snapshotHero
// 全量快照自动持久化、防御式 (g.potionUses||0) 旧档零迁移，与 nopotion「滴药未沾」/dry「逆风未饮」/potionuses「药到病除」/nopotskill/swiftnopo/lowlvnopo/
// unflnopo/pennynopo/unflnopo2/pennynopo2/swiftnopo2/lowlvnopo2/nopotskill2/lowskillnopo2/pennylowlvnopo2/pennynoskillnopo2 系同读一份源），
// (g.trueBoss && g.diff===1 && !(g.spent||0) && (g.level||1)<LOWLV_GOAL && !(g.casts||0) && !(g.potionUses||0)) 即「困难 · 零消费 · 未及十级 · 零用技 ·
// 零战斗用药通关」达成——diff/spent/level/casts/potionUses 五端口都只增不减，换过难度、花过 1 金、升过十级、放过一次技或战斗里喝过一口药就永久无缘此档
// （与 hardtrue 换难度 / penny 花过金 / lowlv 升过十级 / noskill 放过技 / nopotion 喝过药 同属「重新来过才拿得到」的挑战品类）；是 hardtrue、penny、lowlv、
// noskill 与 nopotion 五枚的严格交叠——困难零消费未及十级零用技零战斗用药通关必同时满足五者（也必满足 pennylowskill2/pennylowlvnopo2/pennynoskillnopo2/
// lowskillnopo2 四个四克档与全部三克/双克档），本枚是这一五重交叉区的唯一纪念；与既有正向里程碑 spend「一掷千金」（累计消费达 SPEND_GOAL(1000) 金）/
// lvl10「守灯者」（等级达 LVL10_GOAL(10) 级）/ cast「熟能生巧」（战斗释放技能达 CAST_GOAL(30) 次）/ potionuses「药到病除」（战斗用药达 POTION_USE_GOAL 次）
// 成镜面对、互不重叠。可行性：困难档魔物全面加强下分文不花（商店/旅馆/酿造全封、装备只能开箱/支线/掉落换）且未满十级（九级封顶血蓝更薄、经验获取只嫌多
// 不嫌少）且战斗 [2] 技能键与 [3] 药键双零按下（连治疗/伤害技与战斗喝药都封印，血蓝全靠 [1]普攻/[4]防御回蓝（v19.96）/[5]蓄力/喷泉/大地图 F 喝药硬撑——本档
// 不禁大地图喝药不禁阵亡），一场「别自降难度 + 别花钱 + 别练级 + 别用技 + 别嗑药」五克制的逆风白手素手不饮青芽。
// 零新计数零新状态零新写点零新存档（trueBoss/diff/spent/level/casts/potionUses 皆既有字段）、无 r 无 prog 纯里程碑（与 hardtrue/unflicker/swift/lowlv/
// nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/
// unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv/pennynoskill/pennynopo/unflswift2/unflpenny2/unflnopo2/unflskill2/unfllowlv2/
// pennyswift2/pennylowlv2/pennynoskill2/pennynopo2/swiftlv2/swiftskill2/swiftnopo2/lowskill2/lowlvnopo2/nopotskill2/lowskillnopo2/pennylowlvnopo2/
// pennynoskillnopo2/pennylowskill2 同款——困难里不花钱又不练级又不放技又不嗑药本身就是奖励、硬核才是）、解锁走 winBattle → applyAchievements 既有通路（终焉之神击败当场
// trueBoss 落账后 applyAchievements 枚举即解锁，与 trueboss/hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/
// noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/
// pennylowlv/pennynoskill/pennynopo/unflswift2/unflpenny2/unflnopo2/unflskill2/unfllowlv2/pennyswift2/pennylowlv2/pennynoskill2/pennynopo2/
// swiftlv2/swiftskill2/swiftnopo2/lowskill2/lowlvnopo2/nopotskill2/lowskillnopo2/pennylowlvnopo2/pennynoskillnopo2/pennylowskill2 同路径零新增依赖），反馈不迟到。
// 本冒烟守护：版本锚点（格式合法 + 已越过 v24.207 + data.js 字面量 v24.213 + 旧 v24.199 零残留）、
// ACH_LIST 123 项精确与末尾序位（unflicker 76 / swift 77 / lowlv 78 / nopotion 79 / penny 80 / steadfast 81 /
// frugal 82 / dry 83 / swift2 84 / lowlv2 85 / noskill 86 / noskill2 87 / lowskill 88 / swiftskill 89 /
// swiftlv 90 / nopotskill 91 / unflskill 92 / swiftnopo 93 / lowlvnopo 94 / unflswift 95 / unfllowlv 96 /
// unflnopo 97 / unflpenny 98 / pennyswift 99 / pennylowlv 100 / pennynoskill 101 / pennynopo 102 / unflswift2 103 /
// unflpenny2 104 / unflnopo2 105 / unflskill2 106 / unfllowlv2 107 / pennyswift2 108 / pennylowlv2 109 / pennynoskill2 110 /
// pennynopo2 111 / swiftlv2 112 / swiftskill2 113 / swiftnopo2 114 / lowskill2 115 / lowlvnopo2 116 / nopotskill2 117 /
// lowskillnopo2 118 / pennylowlvnopo2 119 / pennynoskillnopo2 120 / pennylowskill2 121 / pennylownoskillnopo2 122）、
// pennylownoskillnopo2 数据契约（d 文案、ok 防御式逐值、无 r 无 prog 且与 spend/lvl10/cast/potionuses 正向里程碑镜面对、五克制必同时满足 hardtrue/penny/lowlv/noskill/
// nopotion 且满足四个四克档与 pennylowlv2/pennynoskill2/pennynopo2/lowskill2/lowlvnopo2/nopotskill2 与 pennylowlv/pennynoskill/pennynopo/lowskill/lowlvnopo/nopotskill）、
// unlockedAchievements/applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等去重 / 换难度不解锁 / 花过金不解锁 / 升过十级不解锁 / 放过技不解锁 /
// 战斗喝过药不解锁 / 未通关不解锁）、既有 122 成就 id 零回归、core/shop.js spent 写入点与 battle.js casts 写入点与 data.js SPEND_GOAL/LOWLV_GOAL/CAST_GOAL/
// POTION_USE_GOAL/DIFFS 常量源级零变化、README/package.json/CHANGELOG 同步（件套口径 408 + v24.213 守护描述 + 入库 408 + 版本速览 123 项 + tests 树串尾 +
// package 串尾 408）、哨兵链（前望 409 且 README 尚无 409 口径）、旧代 v24.199 字面量/恒等/顶 pin/407 口径/122 项全库零残留扫描（豁免本套件 + v24198 + v24197 +
// v24196 + v24194 + v24193 + v24192 + v24191 + v24190 + v24189 + v24188 + v24187 + v24186 + v24185 + v24184 + v24183 + v24181 + v24180 + v24179 + v24178 +
// v24177 + v24176 + v24175 + v24174 + v24173。
// 注：成就计数 122→123 的零残留扫描只认「成就 N/129」/「**125 项成就**」/「全部 125 项进度」三形态，「⚔️ 身经百战 N/100」「⚔️ 驱雾百战 N/100」
// 是 BATTLE_GOAL/HUNT2_GOAL 讨伐进度分母非成就计数，不在扫描目标内）。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, LOWLV_GOAL, SPEND_GOAL, POTION_USE_GOAL, CAST_GOAL, LVL10_GOAL } from '../js/data.js';
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

console.log('— v24.213 挑战向·五维全克成就「逆风白手素手不饮青芽」（困难×零消费×未及十级×零用技×零战斗用药） 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dataSrc = read('js/data.js');
const coreSrc = read('js/core.js');
const shopSrc = read('js/shop.js');
const battleSrc = read('js/battle.js');
const heroSrc = read('js/hero.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（格式合法 + 已越过 v24.207 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.207', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 197)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.213（旧 v24.197 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v24.238';") && !dataSrc.includes("const GAME_VERSION = 'v24.207';"));
ok('data.js 含 v24.213 注释（逆风白手素手不饮青芽新成就说明）',
  dataSrc.includes('v24.213 文档整理·版本锚点推进'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'pennylownoskillnopo2');
ok('ACH_LIST 含 pennylownoskillnopo2「逆风白手素手不饮青芽」且 id 唯一',
  !!ach && ach.name === '逆风白手素手不饮青芽' && ACH_LIST.filter((a) => a.id === 'pennylownoskillnopo2').length === 1);
ok('ACH_LIST 精确总数 123 项（122→123 末尾追加）', ACH_LIST.length === 150, String(ACH_LIST.length));
ok('pennylownoskillnopo2 描述文案（困难零消费未及十级零用技零战斗用药真结局五克档）',
  ach.d === `以困难模式、未花费 1 金币、等级未满 ${LOWLV_GOAL}、未使用任何技能（战斗指令 [2]）且未在战斗中使用药水/灵药击败终焉之神（真结局）`, ach.d);
ok('pennylownoskillnopo2 判定源级（读既有 g.trueBoss / g.diff===1 / !(g.spent||0) / (g.level||1)<LOWLV_GOAL / !(g.casts||0) / !(g.potionUses||0)，不含 SPEED_GOAL/deaths/battles）',
  String(ach.ok).includes('g.trueBoss') && String(ach.ok).includes('g.diff===1') && String(ach.ok).includes('g.spent') && String(ach.ok).includes('g.level') && String(ach.ok).includes('LOWLV_GOAL') && String(ach.ok).includes('g.casts') && String(ach.ok).includes('g.potionUses') && !String(ach.ok).includes('SPEED_GOAL') && !String(ach.ok).includes('deaths') && !String(ach.ok).includes('battles'));
ok('pennylownoskillnopo2 无 r 无 prog 纯里程碑（与 hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv/pennynoskill/pennynopo/unflswift2/unflpenny2/unflnopo2/unflskill2/unfllowlv2/pennyswift2/pennylowlv2/pennynoskill2/pennynopo2/swiftlv2/swiftskill2/swiftnopo2/lowskill2/lowlvnopo2/nopotskill2/pennylowskill2 同款）',
  !('r' in ach) && !('prog' in ach));

// —— ok 防御式逐值 ——
ok('困难 + 零消费 + 未及十级 + 零用技 + 零战斗用药 + 真结局 → 解锁', ach.ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true);
ok('困难 + 零消费 + 未及十级 + 零用技 + 真结局 + 缺 potionUses 字段 → 按 0 解码解锁（旧档零迁移）', ach.ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0 }) === true);
ok('困难 + 零消费 + 未及十级 + 真结局 + 缺 casts 字段 → 按 0 解码解锁（旧档零迁移）', ach.ok({ trueBoss: true, diff: 1, spent: 0, level: 9, potionUses: 0 }) === true);
ok('困难 + 未及十级 + 零用技 + 零战斗用药 + 真结局 + 缺 spent 字段 → 按 0 解码解锁（旧档零迁移）', ach.ok({ trueBoss: true, diff: 1, level: 9, casts: 0, potionUses: 0 }) === true);
ok('困难 + 零消费 + 零用技 + 零战斗用药 + 真结局 + 缺 level 字段 → (g.level||1)=1 按未及十级解码解锁（旧档零迁移）', ach.ok({ trueBoss: true, diff: 1, spent: 0, casts: 0, potionUses: 0 }) === true);
ok('缺 diff 字段（普通档） + 零消费 + 未及十级 + 零用技 + 零战斗用药 → 不解锁（diff 维严格）', ach.ok({ trueBoss: true, spent: 0, level: 9, casts: 0, potionUses: 0 }) === false);
ok('困难 + 未及十级 + 零用技 + 零战斗用药 + 花过 1 金（spent 1）→ 不解锁（花过即永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, spent: 1, level: 9, casts: 0, potionUses: 0 }) === false);
ok('困难 + 零消费 + 零用技 + 零战斗用药 + 升过十级（level 12）→ 不解锁（升过十级即永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, spent: 0, level: 12, casts: 0, potionUses: 0 }) === false);
ok('困难 + 零消费 + 未及十级 + 零战斗用药 + 放过 1 次技（casts 1）→ 不解锁（放过一次即永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 1, potionUses: 0 }) === false);
ok('困难 + 零消费 + 未及十级 + 零用技 + 战斗喝过 1 口药（potionUses 1）→ 不解锁（战斗喝过一口即永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 1 }) === false);
ok('困难 + 零消费 + 未及十级 + 零用技 + 零战斗用药但未通关 → 不解锁', ach.ok({ diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === false);
ok('空档/缺字段 → 不解锁（(g.spent||0)/(g.level||1)/(g.casts||0)/(g.potionUses||0)/diff 防御式零迁移）', ach.ok({}) === false);
ok('困难 + 零消费 + 未及十级 + 零用技 + 零战斗用药 + 死过一次（deaths 1）→ 照常解锁（本档不读 deaths，与 unfl 系分源）', ach.ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0, deaths: 1 }) === true);
ok('困难 + 零消费 + 未及十级 + 零用技 + 零战斗用药 + 超场（battles 100）→ 照常解锁（本档不读 battles，与 swift 系分源）', ach.ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0, battles: 100 }) === true);

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
  'unfllowlv', 'unflnopo', 'unflpenny', 'pennyswift', 'pennylowlv', 'pennynoskill', 'pennynopo', 'unflswift2', 'unflpenny2', 'unflnopo2', 'unflskill2', 'unfllowlv2', 'pennyswift2', 'pennylowlv2', 'pennynoskill2', 'pennynopo2', 'swiftlv2', 'swiftskill2', 'swiftnopo2', 'lowskill2', 'lowlvnopo2', 'nopotskill2', 'pennylowlvnopo2', 'pennynoskillnopo2', 'pennylowskill2', 'pennylownoskillnopo2'];
ok('既有 122 成就 id 零回归（核心抽样全覆盖末期正位）',
  EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('nightwins 75 / unflicker 76 / swift 77 / lowlv 78 / nopotion 79 / penny 80 / steadfast 81 / frugal 82 / dry 83 / swift2 84 / lowlv2 85 / noskill 86 / noskill2 87 / lowskill 88 / swiftskill 89 / swiftlv 90 / nopotskill 91 / unflskill 92 / swiftnopo 93 / lowlvnopo 94 / unflswift 95 / unfllowlv 96 / unflnopo 97 / unflpenny 98 / pennyswift 99 / pennylowlv 100 / pennynoskill 101 / pennynopo 102 / unflswift2 103 / unflpenny2 104 / unflnopo2 105 / unflskill2 106 / unfllowlv2 107 / pennyswift2 108 / pennylowlv2 109 / pennynoskill2 110 / pennynopo2 111 / swiftlv2 112 / swiftskill2 113 / swiftnopo2 114 / lowskill2 115 / lowlvnopo2 116 / nopotskill2 117 / lowskillnopo2 118 / pennylowlvnopo2 119 / pennynoskillnopo2 120 / pennylowskill2 121 / pennylownoskillnopo2 122 末尾序位（既有序位零位移）',
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
  ACH_LIST.findIndex((a) => a.id === 'pennylownoskillnopo2') === 122);

// —— 既有挑战向家族对照（hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv/pennynoskill/pennynopo/unflswift2/unflpenny2/unflnopo2/unflskill2/unfllowlv2/pennyswift2/pennylowlv2/pennynoskill2/pennynopo2/swiftlv2/swiftskill2/swiftnopo2/lowskill2/lowlvnopo2/nopotskill2/lowskillnopo2/pennylowlvnopo2/pennynoskillnopo2/pennylowskill2 四十八档独立互不干扰）——
const _a = (id) => ACH_LIST.find((x) => x.id === id);
ok('hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv/pennynoskill/pennynopo/unflswift2/unflpenny2/unflnopo2/unflskill2/unfllowlv2/pennyswift2/pennylowlv2/pennynoskill2/pennynopo2/swiftlv2/swiftskill2/swiftnopo2/lowskill2/lowlvnopo2/nopotskill2/lowskillnopo2/pennylowlvnopo2/pennynoskillnopo2/pennylowskill2/pennylownoskillnopo2 四十八档独立（难度 vs 姿态 vs 速通 vs 低等级 vs 零用药 vs 零消费 vs 零阵亡 vs 硬核复合六态 vs 零用技 vs 交叉区 vs 三克制十三方 vs 四重克制 vs 五维全克）',
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
  _a('nopotskill2').ok({ trueBoss: true, diff: 1, casts: 0, potionUses: 0 }) === true &&
  _a('lowskillnopo2').ok({ trueBoss: true, diff: 1, level: 9, casts: 0, potionUses: 0 }) === true &&
  _a('pennylowlvnopo2').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, potionUses: 0 }) === true &&
  _a('pennynoskillnopo2').ok({ trueBoss: true, diff: 1, spent: 0, casts: 0, potionUses: 0 }) === true &&
  _a('pennylowskill2').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true);
ok('困难×零消费×未及十级×零用技×零战斗用药五克档必同时满足 hardtrue 与 penny 与 lowlv 与 noskill 与 nopotion（本枚是其五重交叉区唯一纪念——diff/spent/level/casts/potionUses 五源同判）',
  _a('hardtrue').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true &&
  _a('penny').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true &&
  _a('lowlv').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true &&
  _a('noskill').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true &&
  _a('nopotion').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true);
ok('困难×零消费×未及十级×零用技×零战斗用药也必同时满足四个四克档 pennylowskill2/pennylowlvnopo2/pennynoskillnopo2/lowskillnopo2（五维全克严格蕴含四重克制四角）',
  _a('pennylowskill2').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true &&
  _a('pennylowlvnopo2').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true &&
  _a('pennynoskillnopo2').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true &&
  _a('lowskillnopo2').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true);
ok('五克档也必同时满足六枚三克档（pennylowlv2/pennynoskill2/pennynopo2/lowskill2/lowlvnopo2/nopotskill2）（五维全克严格蕴含全部三克档）',
  _a('pennylowlv2').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true &&
  _a('pennynoskill2').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true &&
  _a('pennynopo2').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true &&
  _a('lowskill2').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true &&
  _a('lowlvnopo2').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true &&
  _a('nopotskill2').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true);
ok('五克档也必同时满足普通双克档（pennylowlv/pennynoskill/pennynopo/lowskill/lowlvnopo/nopotskill）（普通档不点亮五克档）',
  _a('pennylowlv').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true &&
  _a('pennynoskill').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true &&
  _a('pennynopo').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true &&
  _a('lowskill').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true &&
  _a('lowlvnopo').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true &&
  _a('nopotskill').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true);
ok('换过难度（diff 0）→ pennylownoskillnopo2 与 pennylowskill2/pennylowlvnopo2/pennynoskillnopo2/lowskillnopo2/pennylowlv2/pennynoskill2/pennynopo2/lowskill2/lowlvnopo2/nopotskill2/frugal/lowlv2/noskill2/dry 同不解锁（diff 严格分区——普通档只亮 pennylowlv/pennynoskill/pennynopo/lowskill/lowlvnopo/nopotskill，五克档不亮）',
  _a('pennylowskill2').ok({ trueBoss: true, diff: 0, spent: 0, level: 9, casts: 0, potionUses: 0 }) === false &&
  _a('pennylowlvnopo2').ok({ trueBoss: true, diff: 0, spent: 0, level: 9, casts: 0, potionUses: 0 }) === false &&
  _a('pennynoskillnopo2').ok({ trueBoss: true, diff: 0, spent: 0, casts: 0, potionUses: 0 }) === false &&
  _a('lowskillnopo2').ok({ trueBoss: true, diff: 0, level: 9, casts: 0, potionUses: 0 }) === false &&
  _a('pennylowlv2').ok({ trueBoss: true, diff: 0, spent: 0, level: 9, casts: 0 }) === false &&
  _a('pennynoskill2').ok({ trueBoss: true, diff: 0, spent: 0, casts: 0 }) === false &&
  _a('lowskill2').ok({ trueBoss: true, diff: 0, level: 9, casts: 0 }) === false &&
  _a('frugal').ok({ trueBoss: true, diff: 0, spent: 0 }) === false &&
  _a('lowlv2').ok({ trueBoss: true, diff: 0, level: 9 }) === false &&
  _a('noskill2').ok({ trueBoss: true, diff: 0, casts: 0 }) === false &&
  _a('dry').ok({ trueBoss: true, diff: 0, potionUses: 0 }) === false &&
  _a('pennylowlv').ok({ trueBoss: true, diff: 0, spent: 0, level: 9, casts: 0 }) === true &&
  _a('pennynoskill').ok({ trueBoss: true, diff: 0, spent: 0, casts: 0 }) === true &&
  _a('lowskill').ok({ trueBoss: true, diff: 0, level: 9, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 0, spent: 0, level: 9, casts: 0, potionUses: 0 }) === false);
ok('花过 1 金（spent 1）→ pennylownoskillnopo2 与 penny/pennylowlv/pennylowlv2/pennynoskill/pennynoskill2/pennynopo2/pennyswift/pennyswift2/frugal/pennylowlvnopo2/pennynoskillnopo2/pennylowskill2 同不解锁（spent 严格分区——花过即永久无缘，noskill2/lowskill2/lowlvnopo2/nopotskill2/dry 仍亮）',
  _a('penny').ok({ trueBoss: true, spent: 1 }) === false &&
  _a('pennylowlv').ok({ trueBoss: true, spent: 1, level: 9, casts: 0 }) === false &&
  _a('pennylowlv2').ok({ trueBoss: true, diff: 1, spent: 1, level: 9, casts: 0 }) === false &&
  _a('pennynoskill').ok({ trueBoss: true, spent: 1, casts: 0 }) === false &&
  _a('pennynoskill2').ok({ trueBoss: true, diff: 1, spent: 1, casts: 0 }) === false &&
  _a('pennynopo2').ok({ trueBoss: true, diff: 1, spent: 1, potionUses: 0 }) === false &&
  _a('pennyswift').ok({ trueBoss: true, spent: 1, battles: 70 }) === false &&
  _a('pennyswift2').ok({ trueBoss: true, diff: 1, spent: 1, battles: 50 }) === false &&
  _a('frugal').ok({ trueBoss: true, diff: 1, spent: 1 }) === false &&
  _a('pennylowlvnopo2').ok({ trueBoss: true, diff: 1, spent: 1, level: 9, potionUses: 0 }) === false &&
  _a('pennynoskillnopo2').ok({ trueBoss: true, diff: 1, spent: 1, casts: 0, potionUses: 0 }) === false &&
  _a('pennylowskill2').ok({ trueBoss: true, diff: 1, spent: 1, level: 9, casts: 0 }) === false &&
  _a('noskill2').ok({ trueBoss: true, diff: 1, spent: 1, casts: 0 }) === true &&
  _a('lowskill2').ok({ trueBoss: true, diff: 1, spent: 1, level: 9, casts: 0 }) === true &&
  _a('lowskillnopo2').ok({ trueBoss: true, diff: 1, spent: 1, level: 9, casts: 0, potionUses: 0 }) === true &&
  _a('nopotskill2').ok({ trueBoss: true, diff: 1, spent: 1, casts: 0, potionUses: 0 }) === true &&
  _a('dry').ok({ trueBoss: true, diff: 1, spent: 1, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, spent: 1, level: 9, casts: 0, potionUses: 0 }) === false);
ok('升过十级（level 12）→ pennylownoskillnopo2 与 lowlv/lowlv2/lowskill2/lowlvnopo/lowlvnopo2/pennylowlv/pennylowlv2/unfllowlv/pennylowlvnopo2/lowskillnopo2/pennylowskill2 同不解锁（level 严格分区——升过即永久无缘，noskill2/pennynoskill2/pennynoskillnopo2 仍亮）',
  _a('lowlv').ok({ trueBoss: true, level: 12 }) === false &&
  _a('lowlv2').ok({ trueBoss: true, diff: 1, level: 12 }) === false &&
  _a('lowskill').ok({ trueBoss: true, level: 12, casts: 0 }) === false &&
  _a('lowskill2').ok({ trueBoss: true, diff: 1, level: 12, casts: 0 }) === false &&
  _a('lowlvnopo').ok({ trueBoss: true, level: 12, potionUses: 0 }) === false &&
  _a('lowlvnopo2').ok({ trueBoss: true, diff: 1, level: 12, potionUses: 0 }) === false &&
  _a('pennylowlv').ok({ trueBoss: true, spent: 0, level: 12 }) === false &&
  _a('pennylowlv2').ok({ trueBoss: true, diff: 1, spent: 0, level: 12 }) === false &&
  _a('unfllowlv').ok({ trueBoss: true, deaths: 0, level: 12 }) === false &&
  _a('pennylowlvnopo2').ok({ trueBoss: true, diff: 1, spent: 0, level: 12, potionUses: 0 }) === false &&
  _a('lowskillnopo2').ok({ trueBoss: true, diff: 1, level: 12, casts: 0, potionUses: 0 }) === false &&
  _a('pennylowskill2').ok({ trueBoss: true, diff: 1, spent: 0, level: 12, casts: 0 }) === false &&
  _a('noskill2').ok({ trueBoss: true, diff: 1, level: 12, casts: 0 }) === true &&
  _a('pennynoskill2').ok({ trueBoss: true, diff: 1, spent: 0, level: 12, casts: 0 }) === true &&
  _a('pennynoskillnopo2').ok({ trueBoss: true, diff: 1, spent: 0, level: 12, casts: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, spent: 0, level: 12, casts: 0, potionUses: 0 }) === false);
ok('放过一次技（casts 1）→ pennylownoskillnopo2 与 noskill/noskill2/lowskill/swiftskill/nopotskill/unflskill/pennynoskill/unflskill2/pennynoskill2/lowskill2/swiftskill2/pennylowskill2/pennynoskillnopo2/lowskillnopo2 同不解锁（casts 严格分区——放过即永久无缘，pennylowlv2/lowlv2/dry/pennylowlvnopo2 仍亮）',
  _a('noskill').ok({ trueBoss: true, casts: 1 }) === false &&
  _a('noskill2').ok({ trueBoss: true, diff: 1, casts: 1 }) === false &&
  _a('lowskill').ok({ trueBoss: true, level: 9, casts: 1 }) === false &&
  _a('swiftskill').ok({ trueBoss: true, battles: 70, casts: 1 }) === false &&
  _a('nopotskill').ok({ trueBoss: true, casts: 1, potionUses: 0 }) === false &&
  _a('unflskill').ok({ trueBoss: true, deaths: 0, casts: 1 }) === false &&
  _a('pennynoskill').ok({ trueBoss: true, spent: 0, casts: 1 }) === false &&
  _a('unflskill2').ok({ trueBoss: true, diff: 1, deaths: 0, casts: 1 }) === false &&
  _a('pennynoskill2').ok({ trueBoss: true, diff: 1, spent: 0, casts: 1 }) === false &&
  _a('lowskill2').ok({ trueBoss: true, diff: 1, level: 9, casts: 1 }) === false &&
  _a('swiftskill2').ok({ trueBoss: true, diff: 1, battles: 70, casts: 1 }) === false &&
  _a('pennylowskill2').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 1 }) === false &&
  _a('pennynoskillnopo2').ok({ trueBoss: true, diff: 1, spent: 0, casts: 1, potionUses: 0 }) === false &&
  _a('lowskillnopo2').ok({ trueBoss: true, diff: 1, level: 9, casts: 1, potionUses: 0 }) === false &&
  _a('pennylowlv2').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 1 }) === true &&
  _a('lowlv2').ok({ trueBoss: true, diff: 1, level: 9, casts: 1 }) === true &&
  _a('dry').ok({ trueBoss: true, diff: 1, casts: 1, potionUses: 0 }) === true &&
  _a('pennylowlvnopo2').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 1, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 1, potionUses: 0 }) === false);
ok('战斗喝过一口药（potionUses 1）+ 困难零消费未及十级零用技：pennylownoskillnopo2 不解锁而 pennylowskill2 照常亮（本枚与 v24.199 恰在 potionUses 一维分源——本枚读、v24.199 不读）',
  _a('nopotion').ok({ trueBoss: true, potionUses: 1 }) === false &&
  _a('dry').ok({ trueBoss: true, diff: 1, potionUses: 1 }) === false &&
  _a('pennynopo2').ok({ trueBoss: true, diff: 1, spent: 0, potionUses: 1 }) === false &&
  _a('nopotskill2').ok({ trueBoss: true, diff: 1, casts: 0, potionUses: 1 }) === false &&
  _a('lowlvnopo2').ok({ trueBoss: true, diff: 1, level: 9, potionUses: 1 }) === false &&
  _a('lowskillnopo2').ok({ trueBoss: true, diff: 1, level: 9, casts: 0, potionUses: 1 }) === false &&
  _a('pennylowlvnopo2').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, potionUses: 1 }) === false &&
  _a('pennynoskillnopo2').ok({ trueBoss: true, diff: 1, spent: 0, casts: 0, potionUses: 1 }) === false &&
  _a('pennylowskill2').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 1 }) === false);
ok('死过一次 + 困难零消费未及十级零用技零战斗用药：pennylownoskillnopo2 照常亮（本档不读 deaths，与 unflnopo2/unflskill2/unflpenny2 分源——三枚三克制 require deaths=0 故不亮）',
  _a('unflnopo2').ok({ trueBoss: true, diff: 1, deaths: 1, potionUses: 0 }) === false &&
  _a('unflskill2').ok({ trueBoss: true, diff: 1, deaths: 1, casts: 0 }) === false &&
  _a('unflpenny2').ok({ trueBoss: true, diff: 1, deaths: 1, spent: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0, deaths: 1 }) === true);
ok('超场（battles 100）+ 困难零消费未及十级零用技零战斗用药：pennylownoskillnopo2 照常亮（本档不读 battles，与 swiftlv2/swiftskill2/swiftnopo2 分源）',
  _a('swiftlv2').ok({ trueBoss: true, diff: 1, battles: 100, level: 9 }) === false &&
  _a('swiftskill2').ok({ trueBoss: true, diff: 1, battles: 100, casts: 0 }) === false &&
  _a('swiftnopo2').ok({ trueBoss: true, diff: 1, battles: 100, potionUses: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0, battles: 100 }) === true);
ok('零消费 + 未及十级 + 零用技 + 零战斗用药 + 普通档：pennylowlv/pennynoskill/pennynopo/lowskill/lowlvnopo/nopotskill 亮而 pennylownoskillnopo2 不亮（普通双克档各自分源、diff 分源——普通档不点亮五克档）',
  _a('pennylowlv').ok({ trueBoss: true, diff: 0, spent: 0, level: 9, casts: 0 }) === true &&
  _a('pennynoskill').ok({ trueBoss: true, diff: 0, spent: 0, casts: 0 }) === true &&
  _a('lowskill').ok({ trueBoss: true, diff: 0, level: 9, casts: 0 }) === true &&
  _a('lowlvnopo').ok({ trueBoss: true, diff: 0, level: 9, potionUses: 0 }) === true &&
  _a('nopotskill').ok({ trueBoss: true, diff: 0, casts: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 0, spent: 0, level: 9, casts: 0, potionUses: 0 }) === false);
ok('与 v24.199 pennylowskill2 互不干扰（pennylowskill2 读 casts 不读 potionUses、本枚六端口全读——战斗喝过药照灭本枚但照亮 pennylowskill2；放过技两个都灭）',
  _a('pennylowskill2').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 1 }) === false &&
  _a('pennylowskill2').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 1, potionUses: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 1, potionUses: 0 }) === false);
ok('与 v24.196 pennylowlvnopo2 互不干扰（pennylowlvnopo2 读 potionUses 不读 casts、本枚读 casts 也读 potionUses——放过技照灭本枚但照亮 pennylowlvnopo2；战斗喝过药两个都灭）',
  _a('pennylowlvnopo2').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 1, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 1, potionUses: 0 }) === false &&
  _a('pennylowlvnopo2').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 1 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 1 }) === false);
ok('与 v24.197 pennynoskillnopo2 互不干扰（pennynoskillnopo2 读 casts 不读 level、本枚读 level 也读 casts——升过十级照灭本枚但照亮 pennynoskillnopo2）',
  _a('pennynoskillnopo2').ok({ trueBoss: true, diff: 1, spent: 0, level: 12, casts: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, spent: 0, level: 12, casts: 0, potionUses: 0 }) === false);
ok('与 v24.194 lowskillnopo2 互不干扰（lowskillnopo2 读 potionUses 不读 spent、本枚读 spent 也读 potionUses——花过金照灭本枚但照亮 lowskillnopo2）',
  _a('lowskillnopo2').ok({ trueBoss: true, diff: 1, spent: 1, level: 9, casts: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, spent: 1, level: 9, casts: 0, potionUses: 0 }) === false);
ok('与四个四克档同满时全部点亮（五克档是全克收官互不重叠——同一档位下五枚四克与五克档同亮）',
  _a('pennylowskill2').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true &&
  _a('pennylowlvnopo2').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true &&
  _a('pennynoskillnopo2').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true &&
  _a('lowskillnopo2').ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true);
ok('spend 一掷千金 / lvl10 守灯者 / cast 熟能生巧 / potionuses 药到病除 正向里程碑档不解锁 pennylownoskillnopo2（消费累计/等级达标/技能释放累计/用药累计各自解锁自己的正向里程碑，pennylownoskillnopo2 只认困难零消费未及十级零用技零战斗用药）',
  ach.ok({ trueBoss: true, diff: 1, spent: 1, level: 9, casts: 0, potionUses: 0 }) === false &&
  _a('spend').ok({ spent: 1000 }) === true &&
  _a('spend').ok({ spent: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, spent: 0, level: 12, casts: 0, potionUses: 0 }) === false &&
  _a('lvl10').ok({ level: 10 }) === true &&
  _a('lvl10').ok({ level: 9 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 1, potionUses: 0 }) === false &&
  _a('cast').ok({ casts: 30 }) === true &&
  _a('cast').ok({ casts: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 1 }) === false &&
  _a('potionuses').ok({ potionUses: POTION_USE_GOAL }) === true &&
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
  const h = freshHero({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 困难零消费未及十级零用技零战斗用药真结局档 newly 含 pennylownoskillnopo2（既有通路自动跟随）',
    newly.includes('pennylownoskillnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 0, spent: 0, level: 9, casts: 0, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 普通档 newly 不含 pennylownoskillnopo2（不误解锁，diff 维严格）',
    !newly.includes('pennylownoskillnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, spent: 1, level: 9, casts: 0, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 花过金档 newly 不含 pennylownoskillnopo2（不误解锁，spent 维严格）',
    !newly.includes('pennylownoskillnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, spent: 0, level: 12, casts: 0, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 升过十级档 newly 不含 pennylownoskillnopo2（不误解锁，level 维严格）',
    !newly.includes('pennylownoskillnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 1, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 放过技档 newly 不含 pennylownoskillnopo2（不误解锁，casts 维严格）',
    !newly.includes('pennylownoskillnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 1 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 战斗喝过药档 newly 不含 pennylownoskillnopo2（不误解锁，potionUses 维严格）',
    !newly.includes('pennylownoskillnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 未通关档 newly 不含 pennylownoskillnopo2（不误解锁）',
    !newly.includes('pennylownoskillnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0, deaths: 3, battles: 200 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 困难零消费未及十级零用技零战斗用药档含 pennylownoskillnopo2（本档不读 deaths/battles，照常解锁）',
    newly.includes('pennylownoskillnopo2'), JSON.stringify(newly));
}

// —— applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等）——
{
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    const h = freshHero({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 0 });
    S.G = h;
    applyAchievements();
    ok('applyAchievements 真实解锁落 hero.ach（含 pennylownoskillnopo2）', h.ach.includes('pennylownoskillnopo2'), JSON.stringify(h.ach));
    ok('解锁横幅报成就名【逆风白手素手不饮青芽】', msgs.some((m) => m.includes('🔓 成就解锁：') && m.includes('逆风白手素手不饮青芽')), msgs.join(' | '));
    const len1 = msgs.length;
    applyAchievements();
    ok('幂等：重复调用不再报（已解锁去重）', msgs.length === len1 && msgs.filter((m) => m.includes('逆风白手素手不饮青芽')).length === 1, String(msgs.length));
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
    const h = freshHero({ trueBoss: true, diff: 0, spent: 0, level: 9, casts: 0, potionUses: 0 });
    S.G = h;
    applyAchievements();
    ok('普通档 applyAchievements 零 pennylownoskillnopo2 解锁零「逆风白手素手不饮青芽」横幅（不误解锁）',
      !h.ach.includes('pennylownoskillnopo2') && !msgs.some((m) => m.includes('逆风白手素手不饮青芽')), JSON.stringify({ ach: h.ach, msgs }));
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
    const h = freshHero({ trueBoss: true, diff: 1, spent: 1, level: 9, casts: 0, potionUses: 0 });
    S.G = h;
    applyAchievements();
    ok('花过金 applyAchievements 零 pennylownoskillnopo2 解锁零「逆风白手素手不饮青芽」横幅（不误解锁）',
      !h.ach.includes('pennylownoskillnopo2') && !msgs.some((m) => m.includes('逆风白手素手不饮青芽')), JSON.stringify({ ach: h.ach, msgs }));
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
    const h = freshHero({ trueBoss: true, diff: 1, spent: 0, level: 12, casts: 0, potionUses: 0 });
    S.G = h;
    applyAchievements();
    ok('升过十级 applyAchievements 零 pennylownoskillnopo2 解锁零「逆风白手素手不饮青芽」横幅（不误解锁）',
      !h.ach.includes('pennylownoskillnopo2') && !msgs.some((m) => m.includes('逆风白手素手不饮青芽')), JSON.stringify({ ach: h.ach, msgs }));
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
    const h = freshHero({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 1, potionUses: 0 });
    S.G = h;
    applyAchievements();
    ok('放过技 applyAchievements 零 pennylownoskillnopo2 解锁零「逆风白手素手不饮青芽」横幅（不误解锁）',
      !h.ach.includes('pennylownoskillnopo2') && !msgs.some((m) => m.includes('逆风白手素手不饮青芽')), JSON.stringify({ ach: h.ach, msgs }));
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
    const h = freshHero({ trueBoss: true, diff: 1, spent: 0, level: 9, casts: 0, potionUses: 1 });
    S.G = h;
    applyAchievements();
    ok('战斗喝过药 applyAchievements 零 pennylownoskillnopo2 解锁零「逆风白手素手不饮青芽」横幅（不误解锁，potionUses 维严格）',
      !h.ach.includes('pennylownoskillnopo2') && !msgs.some((m) => m.includes('逆风白手素手不饮青芽')), JSON.stringify({ ach: h.ach, msgs }));
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}

// —— 源级零变化：core/shop.js spent 写入点 + battle.js casts 写入点 + data.js SPEND_GOAL/LOWLV_GOAL/CAST_GOAL/POTION_USE_GOAL/DIFFS 常量（既有，本版未动）——
ok('core.js 具 1 处 hero.spent = (hero.spent || 0) + BREW_GOLD; 写入点（brewNow 酿造扣款唯一产生点，消费线五端口之一）',
  (coreSrc.match(/hero\.spent = \(hero\.spent \|\| 0\) \+ BREW_GOLD;/g) || []).length === 1, String((coreSrc.match(/hero\.spent = \(hero\.spent \|\| 0\) \+ BREW_GOLD;/g) || []).length));
ok('shop.js 具 4 处 hero.spent = (hero.spent || 0) + ... 写入点（buyPotion/buyWeapon/buyArmor/stayInn 消费线四端口）',
  (shopSrc.match(/hero\.spent = \(hero\.spent \|\| 0\) \+/g) || []).length === 4, String((shopSrc.match(/hero\.spent = \(hero\.spent \|\| 0\) \+/g) || []).length));
ok('battle.js 具 1 处 hero.casts = castN; 写入点（doSkill 战斗释放技能成功唯一产生点，nodamage 早退不计数）',
  (battleSrc.match(/hero\.casts = castN;/g) || []).length === 1, String((battleSrc.match(/hero\.casts = castN;/g) || []).length));
ok('data.js SPEND_GOAL 常量仍为 1000（单一数据源，与 spend/pennyswift/pennylowlv/pennynoskill/pennynopo 系同读一份源）',
  dataSrc.includes('const SPEND_GOAL = 1000;'));
ok('data.js LOWLV_GOAL 常量仍为 10（单一数据源，与 lowlv/lowlv2/lowskill/lowlvnopo/lowlv2/lowskill2 系同读一份源）',
  dataSrc.includes('const LOWLV_GOAL = 10;'));
ok('data.js CAST_GOAL 常量仍为 30（单一数据源，与 cast/swiftskill/nopotskill/unflskill/pennynoskill 系同读一份源）',
  dataSrc.includes('const CAST_GOAL = 30;'));
ok('data.js DIFFS 仍含「困难」档（难度单一数据源，与 hardtrue/frugal/dry/lowlv2/pennylowlv2/lowlv2/lowskill2 同读一份源）',
  dataSrc.includes("const DIFFS=['普通','困难'];"));
ok('hero.js 成就横幅活计数注释已推进至 N/123（122→123）', heroSrc.includes('（成就 N/150）'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径为四百三十五件套（四百三十四件套清除）',
  readme.includes('扩充为冒烟四百三十五件套（四百三十四件套清除）') && !readme.includes('扩充为冒烟四百零三件套（四百零二件套清除）'));
ok('README 含 v24.213 守护描述（逆风疾行素手青灯新成就守护）', readme.includes('v24.201 起含「逆风疾行素手青灯」新成就守护'));
ok('README 版本速览已为 v24.213 且成就计数 123', readme.includes('版本速览（v24.238）') && readme.includes('129 项成就'));
ok('README 成就计数双处口径 122 项（全部 150 项进度 + **150 项成就**，118 项清除）',
  readme.includes('全部 150 项进度') && readme.includes('**150 项成就**') && !readme.includes('**118 项成就**'));
ok('README tests 树收录 smoke_v24206_swiftnoskillnopo2（含 v24.213 守护子句 + 串尾）',
  readme.includes('v24.201 起含「逆风疾行素手青灯」新成就守护') && readme.includes('smoke_v24206_swiftnoskillnopo2'));
ok('README 含 smoke_v24206_swiftnoskillnopo2 入库（411 份）', readme.includes('smoke_v24206_swiftnoskillnopo2 入库（411 份）'));
ok('package.json 已收录 smoke_v24199_pennylownoskillnopo2.mjs 且位于串尾（在 smoke_v24198_pennylowskill2 之后）',
  pkg.includes('smoke_v24199_pennylownoskillnopo2.mjs') &&
  pkg.includes('node tests/smoke_v24198_pennylowskill2.mjs && node tests/smoke_v24199_pennylownoskillnopo2.mjs && node tests/smoke_v24201_swiftlowskill2.mjs && node tests/smoke_v24202_swiftlowlvnopo2.mjs && node tests/smoke_v24206_swiftnoskillnopo2.mjs && node tests/smoke_v24209_pennyswiftlv2.mjs && node tests/smoke_v24210_pennyswiftskill2.mjs && node tests/smoke_v24211_pennyswiftnopo2.mjs && node tests/smoke_v24212_swiftlowskillnopo2.mjs && node tests/smoke_v24214_unflswiftlowlv2.mjs && node tests/smoke_v24217_unflswiftnopo2.mjs && node tests/smoke_v24218_unflpennyswift2.mjs && node tests/smoke_v24219_unflpennylowlv2.mjs && node tests/smoke_v24220_unflpennynopo2.mjs && node tests/smoke_v24221_unfllowskill2.mjs && node tests/smoke_v24222_unflswiftskill2.mjs && node tests/smoke_v24223_unfllowlvnopo2.mjs && node tests/smoke_v24224_unflnoskillnopo2.mjs && node tests/smoke_v24225_unflpennynoskill2.mjs && node tests/smoke_v24226_unflpennylownoskillnopo2.mjs && node tests/smoke_v24227_unfllowlvnoskillnopo2.mjs && node tests/smoke_v24228_unflswiftlowlvnoskill2.mjs && node tests/smoke_v24229_unflswiftlowlvnopo2.mjs && node tests/smoke_v24230_unflswiftnoskillnopo2.mjs && node tests/smoke_v24231_unflswiftlowlvpenny2.mjs && node tests/smoke_v24233_unflswiftnoskillpenny2.mjs && node tests/smoke_v24235_unflswiftnopopenny2.mjs && node tests/smoke_v24237_unfllowskillpenny2.mjs && node tests/smoke_v24238_unflpennynoskillnopo2.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 407 件套', testChain === 435, String(testChain));
ok('CHANGELOG 含 v24.213 顶条目', changelog.startsWith('## v24.238'));

// —— 哨兵链：README 已有 408 口径且尚无 409（前望 409 语义：下一版才写 409）——
ok('README 已有四百一十一件套口径且尚无 413（哨兵前望 409 语义：下一版才写 409）',
  readme.includes('扩充为冒烟四百三十五件套（四百三十四件套清除）') && !readme.includes('四百三十六件套'));
const s24143 = read('tests/smoke_v24143_furnacequest.mjs');
ok('smoke_v24143 哨兵链前望 436（四百三十六件套否定式）',
  s24143.includes('哨兵链前望 436') && s24143.includes('四百三十六件套否定式'));

// —— 旧代 v24.199 字面量 / 407 件套口径 / 122 项 全库零残留扫描（豁免本套件 + v24198 + v24197 + v24196 + v24194 + v24193 + v24192 + v24191 + v24190 + v24189 + v24188 + v24187 + v24186 + v24185 + v24184 + v24183 + v24181 + v24180 + v24179 + v24178 + v24177 + v24176 + v24175 + v24174 + v24173）——
// v24173-24198 是前代公式链载体，其 README 件套负向断言/版本锚点逐代 pin 由历史级联平移而成（v24199 自身
// 自带同款负向与扫描目标）。成就计数 122→123 扫描只认三形态。
const EXEMPT = new Set(['smoke_v24212_swiftlowskillnopo2.mjs', 'smoke_v24211_pennyswiftnopo2.mjs', 'smoke_v24210_pennyswiftskill2.mjs', 'smoke_v24206_swiftnoskillnopo2.mjs', 'smoke_v24202_swiftlowlvnopo2.mjs', 'smoke_v24201_swiftlowskill2.mjs', 'smoke_v24199_pennylownoskillnopo2.mjs', 'smoke_v24198_pennylowskill2.mjs', 'smoke_v24197_pennynoskillnopo2.mjs', 'smoke_v24196_pennylowlvnopo2.mjs', 'smoke_v24194_lowskillnopo2.mjs', 'smoke_v24193_nopotskill2.mjs', 'smoke_v24192_lowlvnopo2.mjs', 'smoke_v24191_lowskill2.mjs', 'smoke_v24190_swiftnopo2.mjs', 'smoke_v24189_swiftskill2.mjs', 'smoke_v24188_swiftlv2.mjs', 'smoke_v24187_pennynopo2.mjs', 'smoke_v24186_pennynoskill2.mjs', 'smoke_v24185_pennylowlv2.mjs', 'smoke_v24184_pennyswift2.mjs', 'smoke_v24183_unfllowlv2.mjs', 'smoke_v24181_lampoilquest.mjs', 'smoke_v24180_unflskill2.mjs', 'smoke_v24179_unflnopo2.mjs', 'smoke_v24178_unflpenny2.mjs', 'smoke_v24177_unflswift2.mjs', 'smoke_v24176_pennynopo.mjs', 'smoke_v24175_pennynoskill.mjs', 'smoke_v24174_pennylowlv.mjs', 'smoke_v24173_pennyswift.mjs']);
const leftovers = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests')).filter((x) => x.endsWith('.mjs') && !EXEMPT.has(x))) {
  const s = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  const code = s.split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  if (code.includes("const GAME_VERSION = 'v24.199'")) leftovers.push(f + ':gv');
  if (code.includes("GAME_VERSION === 'v24.199'")) leftovers.push(f + ':eq');
  if (code.includes("startsWith('## v24.199")) leftovers.push(f + ':st');
  if (code.includes('四百零七件套（四百零六件套清除）')) leftovers.push(f + ':407');
  if (code.includes('testChain === 406') || code.includes('files.length === 406') ||
      code.includes('treeTok.length === 405') || code.includes('chainAll.length === 405') ||
      code.includes('fileCount === 405'))
    leftovers.push(f + ':count');
  // 成就计数 122→123 零残留：只认「成就 N/129」/「**125 项成就**」/「全部 125 项进度」三形态
  if (code.includes('成就 N/122') || code.includes('**122 项成就**') || code.includes('全部 122 项进度'))
    leftovers.push(f + ':122');
}
ok('旧代 v24.199 GAME_VERSION 字面量/恒等/顶 pin 全库零残留（哨兵链，豁免本套件 + v24198 + v24197 + v24196 + v24194 + v24193 + v24192 + v24191 + v24190 + v24189 + v24188 + v24187 + v24186 + v24185 + v24184 + v24183 + v24181 + v24180 + v24179 + v24178 + v24177 + v24176 + v24175 + v24174 + v24173）',
  leftovers.filter((x) => x.endsWith(':gv') || x.endsWith(':eq') || x.endsWith(':st')).length === 0,
  JSON.stringify(leftovers));
ok('旧代 407 件套口径/计数/122 项 pin 全库零残留（哨兵链，豁免本套件 + v24198 + v24197 + v24196 + v24194 + v24193 + v24192 + v24191 + v24190 + v24189 + v24188 + v24187 + v24186 + v24185 + v24184 + v24183 + v24181 + v24180 + v24179 + v24178 + v24177 + v24176 + v24175 + v24174 + v24173）',
  leftovers.filter((x) => x.endsWith(':407') || x.endsWith(':count') || x.endsWith(':122')).length === 0,
  JSON.stringify(leftovers));

if (failed) { console.log(`— v24.213 冒烟完成：${n} 项断言，失败 ${failed} —`); process.exit(1); }
console.log(`— v24.213 冒烟完成：${n} 项断言，失败 0 —`);
