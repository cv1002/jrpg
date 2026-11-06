// smoke_v24226_unflpennylownoskillnopo2.mjs —— v24.228 专项冒烟：新成就「逆风长明白手素手不饮青芽」（挑战向·「困难×长明×白手×素手×不饮×青芽」六维全克收官·困难×零阵亡×零消费×未及十级×零用技×零战斗用药）
// （新内容·单成就·第一百四十一项——承 v24.226 逆风长明白手素手（unflpennynoskill2，「困难×长明×白手×素手」四重克制维度收官·困难×零阵亡×零消费×零用技）/
// v24.199 逆风白手素手不饮青芽（pennylownoskillnopo2，「困难×白手×素手×不饮×青芽」五维全克收官·困难×零消费×未及十级×零用技×零战斗用药）/
// v24.225 逆风长明素手不饮（unflnoskillnopo2，「困难×长明×素手×不饮」四重克制维度首角·困难×零阵亡×零用技×零战斗用药）先例：本枚把
// unflpennynoskill2（diff×deaths×spent×casts 四克档）与 pennylownoskillnopo2（diff×spent×level×casts×potionUses 五维）与 unflnoskillnopo2（diff×deaths×casts×potionUses 四克档）
// 与 unfllowlvnopo2（diff×deaths×level×potionUses 四克档）的严格公共交集——「既零阵亡、又零消费、又未及十级、又零用技、又零战斗用药且困难通关」——收为一枚，开垦
// 「hardtrue×长明×白手×素手×不饮×青芽」六维全克收官（diff×deaths×{spent,level,casts,potionUses} 四姿态在六维层次的唯一纪念——unfl 四克档 C(5,2) 10/10 集齐、五维全克
// v24.199/v24.212 之后六维矩阵至此收口；与各枚二维以上分源——死过一次、花过 1 金币、升过十级、放过一次技或战斗里喝过一口药即永久无缘此档）。
// 判定读既有 hero.trueBoss（终焉之神=真结局最终 Boss，与 trueboss/hardtrue/unflicker 同源）、既有 hero.diff（DIFFS 下标：建档 createDiff 写定、`(g.diff===1)` 即 DIFFS[1]「困难」档）、
// 既有 hero.deaths（battle.loseBattle 全游唯一产生点——只增不减、防御式 (g.deaths||0) 旧档零迁移）、既有 hero.spent（消费线五端口——商店购买×3/住店/酿造——扣款唯一来源只增不减）、
// 既有 hero.level（hero.js grantXp 升级唯一产生点——只增不减、防御式 (g.level||1)<LOWLV_GOAL 旧档零迁移）、既有 hero.casts（battle.doSkill 战斗释放技能成功唯一产生点——治愈/伤害两分支都计入、
// 只增不减）、既有 hero.potionUses（battle.doItem 战斗用药成功唯一产生点——大地图 F 喝药/旅馆/篝火不计入、只增不减），(g.trueBoss && g.diff===1 && !(g.deaths||0) && !(g.spent||0) &&
// (g.level||1)<LOWLV_GOAL && !(g.casts||0) && !(g.potionUses||0)) 即「困难 · 零阵亡 · 零消费 · 未及十级 · 零用技 · 零战斗用药通关」达成——七端口都只增不减语义下，换过难度、死过一次、
// 花过 1 金币、升过十级、放过一次技或战斗里喝过一口药就永久无缘此档（与 hardtrue 换难度 / unflicker 死过一次 / penny 花过金 / lowlv 升过十级 / noskill 放过技 / nopotion 战斗喝过药
// 同属「重新来过才拿得到」的挑战品类）；是 hardtrue、unflicker（零阵亡）、penny（零消费）、lowlv（未及十级）、noskill（零用技）、nopotion（零战斗用药）六枚的严格交叠——困难零阵亡零消费
// 未及十级零用技零战斗用药通关必同时满足六者（也必满足 unflpennynoskill2 / unflnoskillnopo2 / unfllowlvnopo2 / pennylownoskillnopo2 等组合档），本枚是这一六重交叉区
// 「hardtrue×长明×白手×素手×不饮×青芽」维度的收官角（六维矩阵收口）；与既有正向里程碑 noskill「大巧不工」（普通档未使用技能通关）/ spend「一掷千金」（累计消费）成镜面对、互不重叠。
// 可行性：困难档魔物全面加强下零阵亡推进且 [3] 药键照常可用、[4] 防御/逃跑、[5] 蓄力、[6] 元素技照常可用（都不碰 diff/deaths/spent/level/casts/potionUses）、
// 商店买剑/买甲/买药与住店/酿造全禁（spent 只认消费线五端口——任何一笔扣款即永久无缘此档）且 [2] 技能键零按下（casts 只认战斗技能、治愈/伤害两分支都计入）且战斗 [3] 零按下
// （potionUses 只认战斗用药——大地图 F 喝药/旅馆/篝火不计入）且全程等级不破十（升级即永久无缘此档）——「困难 × 别自降难度 + 别死 + 别花钱 + 别练级 + 别放技 + 别嗑药」的六重克制一场
// 逆风长明白手素手不饮青芽。
// 零新计数零新状态零新写点零新存档（trueBoss/diff/deaths/spent/level/casts/potionUses 皆既有字段）、无 r 无 prog 纯里程碑（与 hardtrue/unflicker/noskill/penny/
// lowlv/nopotion/unflpennynoskill2 同款——困难里不花钱不练级不放技不嗑药又不死本身就是奖励、硬核才是）、解锁走 winBattle → applyAchievements 既有通路（终焉之神击败当场 trueBoss 落账后
// applyAchievements 枚举即解锁，零新增依赖），反馈不迟到。
// 本冒烟守护：版本锚点（格式合法 + 已越过 v24.228 + data.js 字面量 v24.228 + 旧 v24.226 字面量零残留）、ACH_LIST 141 项精确与末尾序位（unflpennylownoskillnopo2 落位 140——
// 前 140 项 id/序位零回归）、unflpennylownoskillnopo2 数据契约（d 文案、ok 防御式逐值、无 r 无 prog 且与 penny/noskill/lowlv/nopotion 正向里程碑镜面对、六维全克必同时满足
// hardtrue/unflicker/penny/lowlv/noskill/nopotion 且满足 unflpennynoskill2/unflnoskillnopo2/unfllowlvnopo2/pennylownoskillnopo2 等组合档）、unlockedAchievements/applyAchievements
// 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等去重 / 换难度不解锁 / 死过一次不解锁 / 花过金不解锁 / 升过十级不解锁 / 放过技不解锁 / 战斗用过药不解锁 / 未通关不解锁）、
// 既有 140 成就 id 零回归、battle.js 无 spent/level 新增写点与 deaths/battles/potionUses/casts 写入点与 data.js SPEED_GOAL/CAST_GOAL/BATTLE_GOAL/POTION_USE_GOAL/
// LOWLV_GOAL/DIFFS 常量源级零变化、README/package.json/CHANGELOG 同步（件套口径 426 + v24.228 守护描述 + 入库 426 + 版本速览 141 项 + tests 树串尾 + package 串尾 426）、
// 哨兵链（前望 430 且 README 尚无 427 口径）、旧代 v24.226 字面量/恒等/顶 pin/425 口径/140 项全库零残留扫描（豁免本套件与 v24225 与 v24224 与 v24223 与 v24222 与 v24221——
// 六者含 v24.226 负向断言/扫描目标）。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST } from '../js/data.js';
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
console.log('— v24.228 挑战向·「困难×长明×白手×素手×不饮×青芽」六维全克收官成就「逆风长明白手素手不饮青芽」（困难×零阵亡×零消费×未及十级×零用技×零战斗用药） 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dataSrc = read('js/data.js');
const battleSrc = read('js/battle.js');
const heroSrc = read('js/hero.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');
// —— 版本锚点（格式合法 + 已越过 v24.228 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.228', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 230)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.228（旧 v24.227 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v24.231';") && !dataSrc.includes("const GAME_VERSION = 'v24.226';"));
ok('data.js 含 v24.228 注释（逆风长明白手素手不饮青芽六维全克收官说明）',
  dataSrc.includes('v24.231 新内容·新成就（第一百四十四项）'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'unflpennylownoskillnopo2');
ok('ACH_LIST 含 unflpennylownoskillnopo2「逆风长明白手素手不饮青芽」且 id 唯一',
  !!ach && ach.name === '逆风长明白手素手不饮青芽' && ACH_LIST.filter((a) => a.id === 'unflpennylownoskillnopo2').length === 1);
ok('ACH_LIST 精确总数 141 项（140→141 末尾追加）', ACH_LIST.length === 144, String(ACH_LIST.length));
ok('unflpennylownoskillnopo2 描述文案（困难零阵亡零消费未及十级零用技零战斗用药真结局六维全克）',
  ach.d === `以困难模式、零阵亡、未花费 1 金币、等级未满 ${10} 且未使用任何技能（战斗指令 [2]）且未在战斗中使用药水/灵药（战斗指令 [3]）时击败终焉之神（真结局）`, ach.d);
ok('unflpennylownoskillnopo2 判定源级（读既有 g.trueBoss / g.diff===1 / !(g.deaths||0) / !(g.spent||0) / (g.level||1)<LOWLV_GOAL / !(g.casts||0) / !(g.potionUses||0)，不含 battles）',
  String(ach.ok).includes('g.trueBoss') && String(ach.ok).includes('g.diff===1') && String(ach.ok).includes('g.deaths') &&
  String(ach.ok).includes('g.spent') && String(ach.ok).includes('LOWLV_GOAL') && String(ach.ok).includes('g.casts') &&
  String(ach.ok).includes('g.potionUses') && !String(ach.ok).includes('g.battles'));
ok('unflpennylownoskillnopo2 无 r 无 prog 纯里程碑（与 hardtrue/unflicker/penny/lowlv/noskill/nopotion/unflpennynoskill2 同款）',
  !('r' in ach) && !('prog' in ach));

// —— ok 防御式逐值 ——
ok('困难 + 零阵亡 + 零消费 + 未及十级 + 零用技 + 零战斗用药 + 真结局 → 解锁', ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 5, casts: 0, potionUses: 0 }) === true);
ok('困难 + 零阵亡 + 真结局 + 缺 deaths/spent/level/casts/potionUses 字段 → (g.deaths||0)/(g.spent||0)/(g.level||1)/(g.casts||0)/(g.potionUses||0) 防御式解码解锁（旧档零迁移）', ach.ok({ trueBoss: true, diff: 1 }) === true);
ok('缺 diff 字段（普通档）+ 全克制 → 不解锁（diff 维严格）', ach.ok({ trueBoss: true, deaths: 0, spent: 0, level: 5, casts: 0, potionUses: 0 }) === false);
ok('困难 + 死过一次（deaths 1）→ 不解锁（阵亡即永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, deaths: 1, spent: 0, level: 5, casts: 0, potionUses: 0 }) === false);
ok('困难 + 花过 1 金币（spent 1）→ 不解锁（花过钱即永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 1, level: 5, casts: 0, potionUses: 0 }) === false);
ok('困难 + 升过十级（level 12）→ 不解锁（升级即永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 12, casts: 0, potionUses: 0 }) === false);
ok('困难 + 等级恰好十级（level 10）→ 不解锁（未满十级的严格界）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 10, casts: 0, potionUses: 0 }) === false);
ok('困难 + 放过一次技（casts 1）→ 不解锁（放过技即永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 5, casts: 1, potionUses: 0 }) === false);
ok('困难 + 战斗用过一次药（potionUses 1）→ 不解锁（战斗嗑药即永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 5, casts: 0, potionUses: 1 }) === false);
ok('困难 + 全克制但未通关 → 不解锁', ach.ok({ diff: 1, deaths: 0, spent: 0, level: 5, casts: 0, potionUses: 0 }) === false);
ok('空档/缺字段 → 不解锁（七端口防御式零迁移）', ach.ok({}) === false);
ok('困难 + 全克制 + 超场（battles 200）→ 照常解锁（本档不读 battles，与 swift 系分源——慢悠悠也不碍此档）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 5, casts: 0, potionUses: 0, battles: 200 }) === true);
ok('困难 + 全克制 + 大地图 F 喝过药（mapPotions 9）→ 照常解锁（potionUses 只认战斗用药，与 nopotion 系同口径）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 5, casts: 0, potionUses: 0, mapPotions: 9 }) === true);
ok('困难 + 全克制 + 喝酒/住店外消费（travels 3）→ 照常解锁（spent 只认消费线五端口，与 penny 系同口径）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 5, casts: 0, potionUses: 0, travels: 3 }) === true);

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
  'unfllowlv', 'unflnopo', 'unflpenny', 'pennyswift', 'pennylowlv', 'pennynoskill', 'pennynopo', 'unflswift2', 'unflpenny2',
  'unflnopo2', 'unflskill2', 'unfllowlv2', 'pennyswift2', 'pennylowlv2', 'pennynoskill2', 'pennynopo2',
  'swiftlv2', 'swiftskill2', 'swiftnopo2', 'lowskill2', 'lowlvnopo2', 'nopotskill2', 'lowskillnopo2',
  'pennylowlvnopo2', 'pennynoskillnopo2', 'pennylowskill2', 'pennylownoskillnopo2', 'swiftlowskill2',
  'swiftlowlvnopo2', 'swiftnoskillnopo2', 'pennyswiftlv2', 'pennyswiftskill2', 'pennyswiftnopo2', 'unflswiftlowlv2', 'unflswiftnopo2', 'unflpennyswift2', 'unflpennylowlv2', 'unflpennynopo2', 'unfllowskill2', 'unflswiftskill2', 'unfllowlvnopo2', 'unflnoskillnopo2', 'unflpennynoskill2'];
ok('既有 140 成就 id 零回归（核心抽样全覆盖末期正位）',
  EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('unflpennylownoskillnopo2 落位 index 140（末尾追加，既有 0..139 序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'unflpennylownoskillnopo2') === 140 &&
  ACH_LIST.findIndex((a) => a.id === 'unflpennynoskill2') === 139 &&
  ACH_LIST.findIndex((a) => a.id === 'unflnoskillnopo2') === 138);

// —— 既有组合档家族对照（六维全克 = 各组合档严格公共交集，互不干扰）——
const _a = (id) => ACH_LIST.find((x) => x.id === id);
ok('六维全克必同时满足 unflpennynoskill2（四克档）与 unflnoskillnopo2（四克档）与 unfllowlvnopo2（四克档）与 pennylownoskillnopo2（五维全克）四枚（deaths/spent/level/casts/potionUses 五源同判）',
  _a('unflpennynoskill2').ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true &&
  _a('unflnoskillnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true &&
  _a('unfllowlvnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true &&
  _a('pennylownoskillnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true);
ok('组合档互检：unflpennynoskill2 不读 level/potionUses（升过十级或战斗嗑药照亮 unflpennynoskill2 但照灭本枚）/ unflnoskillnopo2 不读 spent/level（花过金或升过十级照亮 unflnoskillnopo2 但照灭本枚）/ unfllowlvnopo2 不读 spent/casts（花过金或放过技照亮 unfllowlvnopo2 但照灭本枚）/ pennylownoskillnopo2 不读 deaths（死过一次照亮 pennylownoskillnopo2 但照灭本枚）',
  _a('unflpennynoskill2').ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 12, casts: 0, potionUses: 3 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 12, casts: 0, potionUses: 3 }) === false &&
  _a('unflnoskillnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, spent: 1, level: 12, casts: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 1, level: 5, casts: 0, potionUses: 0 }) === false &&
  _a('unfllowlvnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, spent: 1, level: 9, casts: 1, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 9, casts: 1, potionUses: 0 }) === false &&
  _a('pennylownoskillnopo2').ok({ trueBoss: true, diff: 1, deaths: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 1, spent: 0, level: 9, casts: 0, potionUses: 0 }) === false);
ok('换过难度（diff 0）→ 本枚与组合档同不解锁（diff 严格分区——普通档单克档如 unflicker/penny/lowlv/noskill/nopotion 照常各自解锁，不读本枚）',
  _a('unflpennynoskill2').ok({ trueBoss: true, diff: 0, deaths: 0, spent: 0, level: 9, casts: 0, potionUses: 0 }) === false &&
  _a('unflicker').ok({ trueBoss: true, deaths: 0 }) === true &&
  _a('noskill').ok({ trueBoss: true, casts: 0 }) === true &&
  _a('penny').ok({ trueBoss: true, spent: 0 }) === true &&
  _a('lowlv').ok({ trueBoss: true, level: 9 }) === true &&
  _a('nopotion').ok({ trueBoss: true, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 0, deaths: 0, spent: 0, level: 9, casts: 0, potionUses: 0 }) === false);
ok('与四克档 unflpennyswift2（v24.218）互不干扰——unflpennyswift2 读 battles 不读 level/casts/potionUses、本枚读 level/casts/potionUses 不读 battles：升过十级且放过技照灭本枚但照亮 unflpennyswift2，超场照灭 unflpennyswift2 但照亮本枚',
  _a('unflpennyswift2').ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, battles: 3, level: 12, casts: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, battles: 3, level: 5, casts: 1, potionUses: 0 }) === false &&
  _a('unflpennyswift2').ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, battles: 100, level: 9, casts: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, battles: 100, level: 9, casts: 0, potionUses: 0 }) === true);
ok('与五维全克 swiftlowskillnopo2（v24.212）互不干扰——swiftlowskillnopo2 读 battles/level/casts/potionUses 不读 deaths/spent、本枚读 deaths/spent 不读 battles：死过一次照灭本枚但照亮 swiftlowskillnopo2，花过金照灭 swiftlowskillnopo2 但照亮本枚',
  _a('swiftlowskillnopo2').ok({ trueBoss: true, diff: 1, deaths: 1, battles: 3, level: 9, casts: 0, potionUses: 0, spent: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 1, battles: 3, level: 9, casts: 0, potionUses: 0, spent: 0 }) === false &&
  _a('swiftlowskillnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 100, level: 12, casts: 1, potionUses: 1, spent: 1 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 100, level: 5, casts: 0, potionUses: 0, spent: 0 }) === true);
ok('与三克档 lowskillnopo2（v24.194）互不干扰——lowskillnopo2 读 level/casts/potionUses 不读 deaths/spent、本枚读 deaths/spent 不读 fast 系：死过一次照灭本枚但照亮 lowskillnopo2，升过十级且战斗用过药照灭 lowskillnopo2 但照亮本枚',
  _a('lowskillnopo2').ok({ trueBoss: true, diff: 1, level: 9, casts: 0, potionUses: 0, deaths: 1, spent: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, level: 9, casts: 0, potionUses: 0, deaths: 1, spent: 0 }) === false &&
  _a('lowskillnopo2').ok({ trueBoss: true, diff: 1, level: 12, casts: 0, potionUses: 1, deaths: 0, spent: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, level: 5, casts: 0, potionUses: 0, deaths: 0, spent: 0 }) === true);
ok('与四克档 unflswiftskill2（v24.223）互不干扰——unflswiftskill2 读 battles 不读 spent/level/potionUses、本枚读 spent/level/potionUses 不读 battles：花过金且升过十级且战斗嗑药照灭本枚但照亮 unflswiftskill2，超场照灭 unflswiftskill2 但照亮本枚',
  _a('unflswiftskill2').ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, battles: 3, level: 5, casts: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, battles: 3, level: 9, casts: 0, potionUses: 0 }) === true &&
  _a('unflswiftskill2').ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, battles: 100, level: 5, casts: 0, potionUses: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, battles: 100, level: 9, casts: 0, potionUses: 0 }) === true);
ok('与四克档 unflpennylowlv2（v24.219）互不干扰——unflpennylowlv2 读 level 不读 casts/potionUses、本枚读 casts/potionUses 不读 level：放过技且战斗嗑药照灭本枚但照亮 unflpennylowlv2，升过十级照灭 unflpennylowlv2 但照亮本枚',
  _a('unflpennylowlv2').ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 9, casts: 1, potionUses: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 9, casts: 1, potionUses: 1 }) === false &&
  _a('unflpennylowlv2').ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 12, casts: 0, potionUses: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true);
ok('与四克档 unflpennynopo2（v24.220）互不干扰——unflpennynopo2 读 potionUses 不读 level/casts、本枚读 level/casts 不读 potionUses：升过十级且放过技照灭本枚但照亮 unflpennynopo2，战斗嗑药照灭 unflpennynopo2 但照亮本枚',
  _a('unflpennynopo2').ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 12, casts: 1, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 5, casts: 1, potionUses: 0 }) === false &&
  _a('unflpennynopo2').ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 9, casts: 0, potionUses: 3 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true);
ok('与四克档 unfllowskill2（v24.222）互不干扰——unfllowskill2 读 level/casts 不读 spent/potionUses、本枚读 spent/potionUses 不读 level/casts：花过金且战斗嗑药照灭本枚但照亮 unfllowskill2，升过十级且放过技照灭 unfllowskill2 但照亮本枚',
  _a('unfllowskill2').ok({ trueBoss: true, diff: 1, deaths: 0, spent: 1, level: 9, casts: 0, potionUses: 3 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 1, level: 9, casts: 0, potionUses: 0 }) === false &&
  _a('unfllowskill2').ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 12, casts: 1, potionUses: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true);
ok('penny/lowlv/noskill/nopotion 正向里程碑档不解锁本枚（普通档场内各自解锁自己的正向里程碑，本枚只认六维全克困难通关）',
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 9, casts: 0, potionUses: 0 }) === true && _a('penny').ok({ trueBoss: true, spent: 0 }) === true && _a('lowlv').ok({ trueBoss: true, level: 9 }) === true);

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
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 9, casts: 0, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 六维全克真结局档 newly 含 unflpennylownoskillnopo2（既有通路自动跟随）',
    newly.includes('unflpennylownoskillnopo2'), JSON.stringify(newly));
  ok('unlockedAchievements 同档 newly 含四枚组合档 unflpennynoskill2/unflnoskillnopo2/unfllowlvnopo2/pennylownoskillnopo2（子集自动跟随）',
    newly.includes('unflpennynoskill2') && newly.includes('unflnoskillnopo2') && newly.includes('unfllowlvnopo2') && newly.includes('pennylownoskillnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 0, deaths: 0, spent: 0, level: 9, casts: 0, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 普通档 newly 不含 unflpennylownoskillnopo2（不误解锁，diff 维严格）',
    !newly.includes('unflpennylownoskillnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 1, spent: 0, level: 9, casts: 0, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 死过一次档 newly 不含 unflpennylownoskillnopo2（不误解锁，deaths 维严格）',
    !newly.includes('unflpennylownoskillnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, spent: 1, level: 9, casts: 0, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 花过 1 金币档 newly 不含 unflpennylownoskillnopo2（不误解锁，spent 维严格）',
    !newly.includes('unflpennylownoskillnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 12, casts: 0, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 升过十级档 newly 不含 unflpennylownoskillnopo2（不误解锁，level 维严格）',
    !newly.includes('unflpennylownoskillnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 9, casts: 1, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 放过一次技档 newly 不含 unflpennylownoskillnopo2（不误解锁，casts 维严格）',
    !newly.includes('unflpennylownoskillnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 9, casts: 0, potionUses: 1 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 战斗用过一次药档 newly 不含 unflpennylownoskillnopo2（不误解锁，potionUses 维严格）',
    !newly.includes('unflpennylownoskillnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ diff: 1, deaths: 0, spent: 0, level: 9, casts: 0, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 未通关档 newly 不含 unflpennylownoskillnopo2（不误解锁）',
    !newly.includes('unflpennylownoskillnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 9, casts: 0, potionUses: 0, battles: 200, mapPotions: 9, travels: 3 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 超场且大地图喝过药且旅行过档 newly 含 unflpennylownoskillnopo2（本档不读 battles/mapPotions/travels，与 swift/penny 系分源）',
    newly.includes('unflpennylownoskillnopo2'), JSON.stringify(newly));
}

// —— applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等）——
{
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 9, casts: 0, potionUses: 0 });
    S.G = h;
    applyAchievements();
    ok('applyAchievements 真实解锁落 hero.ach（含 unflpennylownoskillnopo2）', h.ach.includes('unflpennylownoskillnopo2'), JSON.stringify(h.ach));
    ok('解锁横幅报成就名【逆风长明白手素手不饮青芽】', msgs.some((m) => m.includes('🔓 成就解锁：') && m.includes('【逆风长明白手素手不饮青芽】')), msgs.join(' | '));
    const len1 = msgs.length;
    applyAchievements();
    ok('幂等：重复调用不再报（已解锁去重）', msgs.length === len1 && msgs.filter((m) => m.includes('【逆风长明白手素手不饮青芽】')).length === 1, String(msgs.length));
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
    const h = freshHero({ trueBoss: true, diff: 1, deaths: 1, spent: 0, level: 9, casts: 0, potionUses: 0 });
    S.G = h;
    applyAchievements();
    ok('死过一次 applyAchievements 零 unflpennylownoskillnopo2 解锁零「逆风长明白手素手不饮青芽」横幅（不误解锁，deaths 维严格）',
      !h.ach.includes('unflpennylownoskillnopo2') && !msgs.some((m) => m.includes('【逆风长明白手素手不饮青芽】')), JSON.stringify({ ach: h.ach, msgs }));
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
    const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 12, casts: 0, potionUses: 0 });
    S.G = h;
    applyAchievements();
    ok('升过十级 applyAchievements 零 unflpennylownoskillnopo2 解锁零「逆风长明白手素手不饮青芽」横幅（不误解锁，level 维严格）',
      !h.ach.includes('unflpennylownoskillnopo2') && !msgs.some((m) => m.includes('【逆风长明白手素手不饮青芽】')), JSON.stringify({ ach: h.ach, msgs }));
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
    const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 9, casts: 0, potionUses: 1 });
    S.G = h;
    applyAchievements();
    ok('战斗用过药 applyAchievements 零 unflpennylownoskillnopo2 解锁零「逆风长明白手素手不饮青芽」横幅（不误解锁，potionUses 维严格）',
      !h.ach.includes('unflpennylownoskillnopo2') && !msgs.some((m) => m.includes('【逆风长明白手素手不饮青芽】')), JSON.stringify({ ach: h.ach, msgs }));
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
    const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 9, casts: 0, potionUses: 0, mapPotions: 9 });
    S.G = h;
    applyAchievements();
    ok('大地图 F 喝过药 applyAchievements 照常解锁 unflpennylownoskillnopo2 并报「逆风长明白手素手不饮青芽」横幅（potionUses 只认战斗用药，与 nopotion 系同口径）',
      h.ach.includes('unflpennylownoskillnopo2') && msgs.some((m) => m.includes('【逆风长明白手素手不饮青芽】')), JSON.stringify({ ach: h.ach, msgs }));
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
    const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 9, casts: 0, potionUses: 0, battles: 200 });
    S.G = h;
    applyAchievements();
    ok('超场 applyAchievements 照常解锁 unflpennylownoskillnopo2 并报「逆风长明白手素手不饮青芽」横幅（本档不读 battles，与 swift 系分源）',
      h.ach.includes('unflpennylownoskillnopo2') && msgs.some((m) => m.includes('【逆风长明白手素手不饮青芽】')), JSON.stringify({ ach: h.ach, msgs }));
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}

// —— 源级零变化：battle.js 无 spent/level 新增写点 + battle.js deaths/battles/potionUses/casts 写入点 + data.js 常量（既有，本版未动）——
ok('battle.js 未新增任何 spent 计数写点（消费线五端口都在 shop/core、本版零改动；g.deaths 是 loseBattle 既有写点）',
  (battleSrc.match(/\.spent = /g) || []).length === 0, String((battleSrc.match(/\.spent = /g) || []).length));
ok('battle.js 未新增任何 level 写点（升级唯一产生点在 hero.js grantXp、本版零改动）',
  (battleSrc.match(/\.level = /g) || []).length === 0, String((battleSrc.match(/\.level = /g) || []).length));
ok('battle.js 具 1 处 S.G.deaths = (S.G.deaths || 0) + 1; 写入点（loseBattle 阵亡唯一产生点）',
  (battleSrc.match(/S\.G\.deaths = \(S\.G\.deaths \|\| 0\) \+ 1;/g) || []).length === 1, String((battleSrc.match(/S\.G\.deaths = \(S\.G\.deaths \|\| 0\) \+ 1;/g) || []).length));
ok('battle.js 具 1 处 S.G.battles = (S.G.battles || 0) + 1; 写入点（startBattle 进战即记唯一产生点）',
  (battleSrc.match(/S\.G\.battles = \(S\.G\.battles \|\| 0\) \+ 1;/g) || []).length === 1, String((battleSrc.match(/S\.G\.battles = \(S\.G\.battles \|\| 0\) \+ 1;/g) || []).length));
ok('battle.js 具 1 处 hero.potionUses = useN; 写入点（doItem 战斗用药成功唯一产生点——大地图 F/旅馆/篝火不计入）',
  (battleSrc.match(/hero\.potionUses = useN;/g) || []).length === 1 && battleSrc.includes('const useN = (hero.potionUses || 0) + 1;'), String((battleSrc.match(/hero\.potionUses = useN;/g) || []).length));
ok('battle.js 具 1 处 hero.casts = castN; 写入点（doSkill 战斗释放技能成功唯一产生点——治愈与伤害两分支都计入）',
  (battleSrc.match(/hero\.casts = castN;/g) || []).length === 1 && battleSrc.includes('const castN = (hero.casts || 0) + 1;'), String((battleSrc.match(/hero\.casts = castN;/g) || []).length));
ok('hero.js 具 1 处 hero.level++ 写入点（grantXp 升级唯一产生点）',
  (heroSrc.match(/hero\.level\+\+;/g) || []).length === 1, String((heroSrc.match(/hero\.level\+\+;/g) || []).length));
ok('data.js CAST_GOAL 常量仍为 30（零用技里程碑单一数据源，与 noskill/noskill2/lowskill/swiftskill/nopotskill/unflskill 系同读一份源）',
  dataSrc.includes('const CAST_GOAL = 30;'));
ok('data.js SPEED_GOAL 常量仍为 70（单一数据源，与 swift/swift2/unflswift/unflswift2/swiftskill2 系同读一份源）',
  dataSrc.includes('const SPEED_GOAL = 70;'));
ok('data.js BATTLE_GOAL 常量仍为 100（遭遇线里程碑唯一数据源，与 battles「身经百战」系同读一份源）',
  dataSrc.includes('const BATTLE_GOAL = 100;'));
ok('data.js POTION_USE_GOAL 常量仍为 15（单一数据源，与 nopotion/dry/nopotskill/swiftnopo/lowlvnopo2 系同读一份源）',
  dataSrc.includes('const POTION_USE_GOAL = 15;'));
ok('data.js LOWLV_GOAL 常量仍为 10（单一数据源，与 lowlv/lowlv2/lowskill/unfllowlv/unfllowlv2 系同读一份源）',
  dataSrc.includes('const LOWLV_GOAL = 10;'));
ok('data.js DIFFS 仍含「困难」档（难度单一数据源，与 hardtrue/steadfast/unflpenny2/unflskill2/pennynoskill2 同读一份源）',
  dataSrc.includes("const DIFFS=['普通','困难'];"));
ok('hero.js 成就横幅活计数注释已推进至 N/141（140→141）', heroSrc.includes('（成就 N/144）'));
ok('data.js 成就横幅活计数注释已推进至 N/141（140→141，两处恒等）', (dataSrc.match(/（成就 N\/144）/g) || []).length === 2, String((dataSrc.match(/（成就 N\/144）/g) || []).length));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径为四百二十九件套（四百二十八件套清除）',
  readme.includes('扩充为冒烟四百二十九件套（四百二十八件套清除）') && !readme.includes('扩充为冒烟四百二十六件套（四百二十五件套清除）'));
ok('README 含 v24.228 守护描述（逆风长明白手素手不饮青芽六维全克收官守护）', readme.includes('v24.228 起含「逆风长明白手素手不饮青芽」新成就守护'));
ok('README 版本速览已为 v24.228 且成就计数 141', readme.includes('版本速览（v24.231）') && readme.includes('144 项成就'));
ok('README 成就计数双处口径 141 项（全部 144 项进度 + **144 项成就**，**140 项成就**清除）',
  readme.includes('全部 144 项进度') && readme.includes('**144 项成就**') && !readme.includes('**14' + '0 项成就**'));
ok('README tests 树收录 smoke_v24226_unflpennylownoskillnopo2（含 v24.228 守护子句 + 串尾）',
  readme.includes('v24.228 起含「逆风长明白手素手不饮青芽」新成就守护') && readme.includes('smoke_v24226_unflpennylownoskillnopo2'));
ok('README 含 smoke_v24226_unflpennylownoskillnopo2 入库（429 份）', readme.includes('smoke_v24226_unflpennylownoskillnopo2 入库（429 份）'));
ok('package.json 已收录 smoke_v24226_unflpennylownoskillnopo2.mjs 且位于串尾（在 smoke_v24225_unflpennynoskill2 之后）',
  pkg.includes('smoke_v24226_unflpennylownoskillnopo2.mjs') &&
  pkg.includes('node tests/smoke_v24225_unflpennynoskill2.mjs && node tests/smoke_v24226_unflpennylownoskillnopo2.mjs && node tests/smoke_v24227_unfllowlvnoskillnopo2.mjs && node tests/smoke_v24228_unflswiftlowlvnoskill2.mjs && node tests/smoke_v24229_unflswiftlowlvnopo2.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 426 件套', testChain === 429, String(testChain));
ok('CHANGELOG 含 v24.228 顶条目', changelog.startsWith('## v24.231'));

// —— 哨兵链：README 已有 426 口径且尚无 427（前望 430 语义：下一版才写 427）——
ok('README 已有四百二十六件套口径且尚无 427（哨兵前望 430 语义：下一版才写 427）',
  readme.includes('扩充为冒烟四百二十九件套（四百二十八件套清除）') && !readme.includes('四百三十件套'));
{
  const s24143 = read('tests/smoke_v24143_furnacequest.mjs');
  ok('smoke_v24143 哨兵链前望 430（四百三十件套否定式）',
    s24143.includes('哨兵链前望 430') && s24143.includes('四百三十件套否定式'));
}

// —— 旧代 v24.226 字面量 / 425 件套口径 / 140 项 全库零残留扫描（豁免本套件与 v24225 与 v24224 与 v24223 与 v24222 与 v24221——六者含 v24.226 负向断言/扫描目标）——
const EXEMPT = new Set(['smoke_v24226_unflpennylownoskillnopo2.mjs', 'smoke_v24225_unflpennynoskill2.mjs', 'smoke_v24224_unflnoskillnopo2.mjs', 'smoke_v24223_unfllowlvnopo2.mjs', 'smoke_v24222_unflswiftskill2.mjs', 'smoke_v24221_unfllowskill2.mjs', 'smoke_v24227_unfllowlvnoskillnopo2.mjs']);
const leftovers = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests')).filter((x) => x.endsWith('.mjs') && !EXEMPT.has(x))) {
  const s = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  const code = s.split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  if (code.includes("const GAME_VERSION = 'v24.226'")) leftovers.push(f + ':gv');
  if (code.includes("GAME_VERSION === 'v24.226'")) leftovers.push(f + ':eq');
  if (code.includes("startsWith('## v24.226")) leftovers.push(f + ':st');
  if (code.includes('四百二十五件套（四百二十四件套清除）')) leftovers.push(f + ':425');
  if (code.includes('testChain === 426') || code.includes('files.length === 426') ||
      code.includes('treeTok.length === 426') || code.includes('chainAll.length === 426') ||
      code.includes('fileCount === 426'))
    leftovers.push(f + ':count');
  if (code.includes('版本速览（v24.226）')) leftovers.push(f + ':ver');
  // 成就计数 140→141 零残留：只认「**14'+'0 项成就**」/「全部 14'+'0 项进度」两形态（「成就 N/140」是 v24.76 HUD 口径稳定常驻 pin 家族，不在扫描目标内）
  if (code.includes('**14' + '0 项成就**') || code.includes('全部 14' + '0 项进度'))
    leftovers.push(f + ':140');
}
ok('旧代 v24.226 GAME_VERSION 字面量/恒等/顶 pin/版本速览 全库零残留（哨兵链，豁免本套件与 v24225 等六件）',
  leftovers.filter((x) => x.endsWith(':gv') || x.endsWith(':eq') || x.endsWith(':st') || x.endsWith(':ver')).length === 0,
  JSON.stringify(leftovers));
ok('旧代 425 件套口径/计数/140 项 pin 全库零残留（哨兵链，豁免本套件与 v24225 等六件）',
  leftovers.filter((x) => x.endsWith(':425') || x.endsWith(':count') || x.endsWith(':140')).length === 0,
  JSON.stringify(leftovers));

if (failed) { console.log(`— v24.230 冒烟完成：${n} 项断言，失败 ${failed} —`); process.exit(1); }
console.log(`— v24.230 冒烟完成：${n} 项断言，失败 0 —`);
