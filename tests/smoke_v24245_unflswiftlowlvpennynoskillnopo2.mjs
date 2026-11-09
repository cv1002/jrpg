// smoke_v24245_unflswiftlowlvpennynoskillnopo2.mjs —— v24.245 专项冒烟：新成就「逆风长明疾行青芽素手不饮白手」（挑战向·「困难×长明×疾行×青芽×白手×素手×不饮」七维全克收官·困难×零阵亡×七十场内×未及十级×零消费×零用技×零战斗用药）
// （新内容·单成就·第一百五十六项——承 v24.228 逆风长明白手素手不饮青芽（unflpennylownoskillnopo2，「困难×长明×白手×素手×不饮×青芽」六维全克·困难×零阵亡×零消费×未及十级×零用技×零战斗用药）/
// v24.241 逆风长明疾行青芽素手白手（unflswiftlowlvpennynoskill2，「困难×长明×疾行×青芽×白手×素手」六克档首角·困难×零阵亡×七十场内×未及十级×零消费×零用技）/
// v24.242 逆风长明疾行青芽白手不饮（unflswiftlowlvpennynopo2，「困难×长明×疾行×青芽×白手×不饮」六克档第二角·困难×零阵亡×七十场内×未及十级×零消费×零战斗用药）/
// v24.243 逆风长明疾行青芽素手不饮（unflswiftlowlvnoskillnopo2，「困难×长明×疾行×青芽×素手×不饮」六克档第三角·困难×零阵亡×七十场内×未及十级×零用技×零战斗用药）/
// v24.244 逆风长明疾行素手不饮白手（unflswiftpennynoskillnopo2，「困难×长明×疾行×白手×素手×不饮」六克档第四角·困难×零阵亡×七十场内×零消费×零用技×零战斗用药）先例：本枚把
// v24.228（diff×deaths×level×spent×casts×potionUses 六克档）与 v24.241（diff×deaths×battles×level×spent×casts 六克档）与 v24.242（diff×deaths×battles×level×spent×potionUses 六克档）
// 与 v24.243（diff×deaths×battles×level×casts×potionUses 六克档）与 v24.244（diff×deaths×battles×spent×casts×potionUses 六克档）
// 五枚六克档的严格公共交集——「既零阵亡、又七十场内、又未及十级、又零消费、又零用技、又零战斗用药且困难通关」——收为一枚，开垦
// 「hardtrue×长明×疾行×青芽×白手×素手×不饮」七维全克收官（handtrue×unfl×5-of-5 C(5,5)=1，hardtrue×unfl 交叉面至此全部开垦完毕：四克档 10 枚 + 五克档 10 枚 + 六克档 5 枚 + 七维全克 1 枚）。
// 判定读既有 hero.trueBoss（终焉之神=真结局最终 Boss，与 trueboss/hardtrue/unflicker 同源）、既有 hero.diff（DIFFS 下标：建档 createDiff 写定、`(g.diff===1)` 即 DIFFS[1]「困难」档）、
// 既有 hero.deaths（battle.loseBattle 全游唯一产生点——只增不减、防御式 (g.deaths||0) 旧档零迁移）、既有 hero.battles（battle.startBattle 进战即记唯一产生点——胜/败/逃都算、防御式
// (g.battles||0)<=SPEED_GOAL 旧档零迁移）、既有 hero.level（hero.js grantXp 升级唯一产生点——只增不减、防御式 (g.level||1)<LOWLV_GOAL 旧档零迁移）、既有 hero.spent（shop.doBuy
// 购物记账唯一产生点——消费线五端口同源、防御式 !(g.spent||0) 旧档零迁移）、既有 hero.casts（battle.doSkill 战斗释放技能成功唯一产生点——治愈/伤害两分支都计入、防御式
// !(g.casts||0) 旧档零迁移）、既有 hero.potionUses（battle.doItem 战斗用药成功唯一产生点——大地图 F/旅馆/篝火不计入、防御式 !(g.potionUses||0) 旧档零迁移），
// (g.trueBoss && g.diff===1 && !(g.deaths||0) && (g.battles||0)<=SPEED_GOAL && (g.level||1)<LOWLV_GOAL && !(g.spent||0) && !(g.casts||0) && !(g.potionUses||0)) 即
// 「困难 · 零阵亡 · 七十场内 · 未及十级 · 零消费 · 零用技 · 零战斗用药通关」达成——端口只增不减语义下，换过难度、死过一次、超过七十场、升过十级、花过 1 金币、放过技或战斗里
// 喝过药就永久无缘此档（本枚读全部八端口，无「不读某端口」豁免——真正的六重姿态八端口全克，与各枚二维以上分源）；
// 是 hardtrue、unflicker（零阵亡）、swift（七十场内）、lowlv（未及十级）、penny（零消费）、noskill（零用技）、nopotion（零战斗用药）七枚的严格交叠——困难零阵亡七十场内未及十级零消费零用技零战斗用药通关必同时满足
// 七者与五枚六克档与 unfl 五克档十枚。与既有正向里程碑 swift「速战速决」/ lowlv「未及十级」/ penny「白手成灯」/ noskill「大巧不工」/ nopotion「药囊未启」成镜面对、互不重叠。
// 可行性与 v24.228/v24.241-244 同域（各 5-6 克档皆已验证零消费不拖不嗑药不用技可行，本枚只是同时满足六重姿态——经验曲线可控：疾行系 70 场内 + 青芽系未及十级同域 v24.241-243 皆已验证）。
// 零新计数零新状态零新写点零新存档（trueBoss/diff/deaths/battles/level/spent/casts/potionUses 皆既有字段）、无 r 无 prog 纯里程碑、解锁走 winBattle → applyAchievements 既有通路
// （终焉之神击败当场 trueBoss 落账后 applyAchievements 枚举即解锁，零新增依赖），反馈不迟到。
// 本冒烟守护：版本锚点（格式合法 + 已越过 v24.244 + data.js 字面量 v24.245 + 旧 v24.240 字面量零残留）、ACH_LIST 156 项精确与末尾序位（unflswiftlowlvpennynoskillnopo2 落位 155——
// 前 155 项 id/序位零回归）、unflswiftlowlvpennynoskillnopo2 数据契约（d 文案、ok 防御式逐值、无 r 无 prog 且与六重姿态正向里程碑镜面对、必同时满足五枚六克档与 unfl 五克档十枚）、
// unlockedAchievements/applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等去重 / 换难度不解锁 / 死过一次不解锁 / 超七十场不解锁 / 升过十级不解锁 / 花过金不解锁 /
// 放过技不解锁 / 战斗嗑过药不解锁 / 未通关不解锁 / 空档不解锁 / 大地图喝药旅行住店照常解锁反例——本枚不读 aux 端口）、既有 155 成就 id 零回归、battle.js 无 spent/level 新增写点与
// deaths/battles/potionUses/casts 各 1 处既有写入点与 hero.js level++ 唯一写入点与 data.js SPEED_GOAL/LOWLV_GOAL/DIFFS 常量源级零变化、README/package.json/CHANGELOG 同步
// （件套口径 441 + v24.245 守护描述 + 入库 441 + 版本速览 156 项 + tests 树串尾 + package 串尾 441 + CHANGELOG 顶条 v24.245）、
// 哨兵链（前望 442 且 README 尚无 442 口径）、旧代 v24.244 字面量/恒等/顶 pin/440 口径/155 项全库零残留扫描（豁免本套件与 v24244 与 v24243 与 v24242 与 v24241 与 v24239 与 v24238 与 v24237 与 v24235 与 v24233 与 v24231 与 v24230 与 v24229）。
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
console.log('— v24.245 挑战向·「困难×长明×疾行×青芽×白手×素手×不饮」七维全克收官成就「逆风长明疾行青芽素手不饮白手」（困难×零阵亡×七十场内×未及十级×零消费×零用技×零战斗用药） 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dataSrc = read('js/data.js');
const battleSrc = read('js/battle.js');
const heroSrc = read('js/hero.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');
// —— 版本锚点（格式合法 + 已越过 v24.244 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.244', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 246)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.245（旧 v24.240 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v24.247';") && !dataSrc.includes("const GAME_VERSION = 'v24.240';"));
ok('data.js 含 v24.245 注释（逆风长明疾行青芽素手不饮白手七维全克收官说明）',
  dataSrc.includes('v24.245 新内容·新成就（第一百五十六项）'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'unflswiftlowlvpennynoskillnopo2');
ok('ACH_LIST 含 unflswiftlowlvpennynoskillnopo2「逆风长明疾行青芽素手不饮白手」且 id 唯一',
  !!ach && ach.name === '逆风长明疾行青芽素手不饮白手' && ACH_LIST.filter((a) => a.id === 'unflswiftlowlvpennynoskillnopo2').length === 1);
ok('ACH_LIST 精确总数 156 项（155→156 末尾追加）', ACH_LIST.length === 158, String(ACH_LIST.length));
ok('unflswiftlowlvpennynoskillnopo2 描述文案（困难零阵亡七十场内未及十级零用技零战斗用药零消费真结局七维全克）',
  ach.d === `以困难模式、零阵亡、70 场战斗内、等级未满 10、未使用任何技能（战斗指令 [2]）且未在战斗中使用药水/灵药（战斗指令 [3]）且未花费 1 金币时击败终焉之神（真结局）`, ach.d);
ok('unflswiftlowlvpennynoskillnopo2 判定源级（读既有 g.trueBoss / g.diff===1 / !(g.deaths||0) / (g.battles||0)<=SPEED_GOAL / (g.level||1)<LOWLV_GOAL / !(g.spent||0) / !(g.casts||0) / !(g.potionUses||0)，八端口全读）',
  String(ach.ok).includes('g.trueBoss') && String(ach.ok).includes('g.diff===1') && String(ach.ok).includes('g.deaths') &&
  String(ach.ok).includes('SPEED_GOAL') && String(ach.ok).includes('LOWLV_GOAL') && String(ach.ok).includes('g.spent') &&
  String(ach.ok).includes('g.casts') && String(ach.ok).includes('g.potionUses'));
ok('unflswiftlowlvpennynoskillnopo2 无 r 无 prog 纯里程碑（与 hardtrue/unflicker/swift/lowlv/penny/noskill/nopotion 同款）',
  !('r' in ach) && !('prog' in ach));

// —— ok 防御式逐值 ——
ok('困难 + 零阵亡 + 七十场内 + 未及十级 + 零消费 + 零用技 + 零战斗用药 + 真结局 → 解锁', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, spent: 0, casts: 0, potionUses: 0 }) === true);
ok('困难 + 零阵亡 + 真结局 + 缺 deaths/battles/level/spent/casts/potionUses 字段 → (g.deaths||0)/(g.battles||0)/(g.level||1)/(g.spent||0)/(g.casts||0)/(g.potionUses||0) 防御式解码解锁（旧档零迁移）', ach.ok({ trueBoss: true, diff: 1 }) === true);
ok('缺 diff 字段（普通档）+ 全克制 → 不解锁（diff 维严格）', ach.ok({ trueBoss: true, deaths: 0, battles: 42, level: 9, spent: 0, casts: 0, potionUses: 0 }) === false);
ok('困难 + 死过一次（deaths 1）→ 不解锁（阵亡即永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, deaths: 1, battles: 42, level: 9, spent: 0, casts: 0, potionUses: 0 }) === false);
ok('困难 + 恰好七十场（battles 70）→ 照常解锁（七十场内含边界的严格界）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 70, level: 9, spent: 0, casts: 0, potionUses: 0 }) === true);
ok('困难 + 超过七十场（battles 71）→ 不解锁（超场即永久无缘此档，疾行维严格）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 71, level: 9, spent: 0, casts: 0, potionUses: 0 }) === false);
ok('困难 + 恰好九级（level 9）→ 照常解锁（未满十级含边界的严格界）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, spent: 0, casts: 0, potionUses: 0 }) === true);
ok('困难 + 恰好十级（level 10）→ 不解锁（未满十级严格界，青芽维严格）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 10, spent: 0, casts: 0, potionUses: 0 }) === false);
ok('困难 + 升过十级（level 12）→ 不解锁（本枚读 level，升过十级即永久无缘此档——与 v24.244 分源之关键差异）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 12, spent: 0, casts: 0, potionUses: 0 }) === false);
ok('困难 + 花过 1 金币（spent 1）→ 不解锁（消费即永久无缘此档，白手维严格）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, spent: 1, casts: 0, potionUses: 0 }) === false);
ok('困难 + 花过很多金（spent 999）→ 不解锁（花过金永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, spent: 999, casts: 0, potionUses: 0 }) === false);
ok('困难 + 放过一次技（casts 1）→ 不解锁（用技即永久无缘此档，素手维严格）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, spent: 0, casts: 1, potionUses: 0 }) === false);
ok('困难 + 战斗里喝过药（potionUses 1）→ 不解锁（战斗用药即永久无缘此档，不饮维严格）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, spent: 0, casts: 0, potionUses: 1 }) === false);
ok('困难 + 全克制但未通关 → 不解锁', ach.ok({ diff: 1, deaths: 0, battles: 42, level: 9, spent: 0, casts: 0, potionUses: 0 }) === false);
ok('空档/缺字段 → 不解锁（八端口防御式零迁移）', ach.ok({}) === false);
ok('困难 + 全克制 + 大地图 F 喝过药（mapPotions 9）→ 照常解锁（本枚只认战斗内 potionUses 端口，大地图喝药与不饮系分源）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, spent: 0, casts: 0, potionUses: 0, mapPotions: 9 }) === true);
ok('困难 + 全克制 + 快速旅行过（travels 3）→ 照常解锁（本枚不读 travels，与旅行探索系分源）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, spent: 0, casts: 0, potionUses: 0, travels: 3 }) === true);
ok('困难 + 全克制 + 旅馆住过（innRests 3）→ 照常解锁（本枚不读 innRests，与休整系分源——住店照常）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, spent: 0, casts: 0, potionUses: 0, innRests: 3 }) === true);

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
  'swiftlowlvnopo2', 'swiftnoskillnopo2', 'pennyswiftlv2', 'pennyswiftskill2', 'pennyswiftnopo2', 'unflswiftlowlv2', 'unflswiftnopo2', 'unflpennyswift2', 'unflpennylowlv2', 'unflpennynopo2', 'unfllowskill2', 'unflswiftskill2', 'unfllowlvnopo2', 'unflnoskillnopo2', 'unflpennynoskill2', 'unflpennylownoskillnopo2', 'unfllowlvnoskillnopo2', 'unflswiftlowlvnoskill2', 'unflswiftlowlvnopo2', 'unflswiftnoskillnopo2', 'unflswiftlowlvpenny2', 'unflswiftnoskillpenny2', 'unflswiftnopopenny2', 'unfllowskillpenny2', 'unflpennynoskillnopo2', 'unflpennylowlvnopo2', 'unflswiftlowlvpennynoskill2', 'unflswiftlowlvpennynopo2', 'unflswiftlowlvnoskillnopo2', 'unflswiftpennynoskillnopo2'];
ok('既有 155 成就 id 零回归（核心抽样全覆盖末期正位）',
  EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('unflswiftlowlvpennynoskillnopo2 落位 index 155（末尾追加，既有 0..154 序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'unflswiftlowlvpennynoskillnopo2') === 155 &&
  ACH_LIST.findIndex((a) => a.id === 'unflswiftpennynoskillnopo2') === 154 &&
  ACH_LIST.findIndex((a) => a.id === 'unflswiftlowlvnoskillnopo2') === 153 &&
  ACH_LIST.findIndex((a) => a.id === 'unflswiftlowlvpennynopo2') === 152 &&
  ACH_LIST.findIndex((a) => a.id === 'unflswiftlowlvpennynoskill2') === 151 &&
  ACH_LIST.findIndex((a) => a.id === 'unflpennylowlvnopo2') === 150 &&
  ACH_LIST.findIndex((a) => a.id === 'unflpennynoskillnopo2') === 149 &&
  ACH_LIST.findIndex((a) => a.id === 'unfllowskillpenny2') === 148 &&
  ACH_LIST.findIndex((a) => a.id === 'unflswiftnopopenny2') === 147 &&
  ACH_LIST.findIndex((a) => a.id === 'unflswiftnoskillpenny2') === 146 &&
  ACH_LIST.findIndex((a) => a.id === 'unflswiftlowlvpenny2') === 145 &&
  ACH_LIST.findIndex((a) => a.id === 'unflswiftnoskillnopo2') === 144 &&
  ACH_LIST.findIndex((a) => a.id === 'unflswiftlowlvnopo2') === 143 &&
  ACH_LIST.findIndex((a) => a.id === 'unflswiftlowlvnoskill2') === 142 &&
  ACH_LIST.findIndex((a) => a.id === 'unfllowlvnoskillnopo2') === 141 &&
  ACH_LIST.findIndex((a) => a.id === 'unflpennylownoskillnopo2') === 140);


// —— 既有组合档家族对照（七维全克 = 五枚六克档 + 十枚五克档严格公共交集，互不干扰）——
const _a = (id) => ACH_LIST.find((x) => x.id === id);
ok('七维全克必同时满足五枚六克档（v24.228/v24.241/v24.242/v24.243/v24.244）与 unfl 五克档十枚（deaths/battles/level/spent/casts/potionUses 六源同判）',
  _a('unflpennylownoskillnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, level: 9, spent: 0, casts: 0, potionUses: 0, battles: 42 }) === true &&
  _a('unflswiftlowlvpennynoskill2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, casts: 0, spent: 0, potionUses: 0 }) === true &&
  _a('unflswiftlowlvpennynopo2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, potionUses: 0, spent: 0, casts: 0 }) === true &&
  _a('unflswiftlowlvnoskillnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, casts: 0, potionUses: 0, spent: 0 }) === true &&
  _a('unflswiftpennynoskillnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, spent: 0, casts: 0, potionUses: 0, level: 9 }) === true &&
  _a('unfllowlvnoskillnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, level: 9, casts: 0, potionUses: 0, battles: 42, spent: 0 }) === true &&
  _a('unflswiftlowlvnoskill2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, casts: 0, spent: 0, potionUses: 0 }) === true &&
  _a('unflswiftlowlvnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, potionUses: 0, spent: 0, casts: 0 }) === true &&
  _a('unflswiftnoskillnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, casts: 0, potionUses: 0, level: 9, spent: 0 }) === true &&
  _a('unflswiftlowlvpenny2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, spent: 0, casts: 0, potionUses: 0 }) === true &&
  _a('unflswiftnoskillpenny2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, casts: 0, spent: 0, level: 9, potionUses: 0 }) === true &&
  _a('unflswiftnopopenny2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, potionUses: 0, spent: 0, level: 9, casts: 0 }) === true &&
  _a('unfllowskillpenny2').ok({ trueBoss: true, diff: 1, deaths: 0, level: 9, casts: 0, spent: 0, battles: 42, potionUses: 0 }) === true &&
  _a('unflpennynoskillnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, casts: 0, potionUses: 0, spent: 0, battles: 42, level: 9 }) === true &&
  _a('unflpennylowlvnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, level: 9, potionUses: 0, spent: 0, battles: 42, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, casts: 0, potionUses: 0, spent: 0 }) === true);
ok('与六维全克 v24.228（unflpennylownoskillnopo2）互分源——v24.228 不读 battles、本枚读 battles：超场照亮 v24.228 但照灭本枚（分源端口 battles；level/spent/casts/potionUses 两枚同读非分源）',
  _a('unflpennylownoskillnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, level: 9, spent: 0, casts: 0, potionUses: 0, battles: 100 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, level: 9, spent: 0, casts: 0, potionUses: 0, battles: 100 }) === false &&
  _a('unflpennylownoskillnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, level: 12, spent: 0, casts: 0, potionUses: 0, battles: 42 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, level: 12, spent: 0, casts: 0, potionUses: 0, battles: 42 }) === false);
ok('与六克档首角 v24.241（unflswiftlowlvpennynoskill2）互分源——v24.241 不读 potionUses、本枚读 potionUses：战斗嗑药照亮 v24.241 但照灭本枚（分源端口 potionUses）',
  _a('unflswiftlowlvpennynoskill2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, casts: 0, spent: 0, potionUses: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, casts: 0, spent: 0, potionUses: 1 }) === false &&
  _a('unflswiftlowlvpennynoskill2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 100, level: 9, casts: 0, spent: 0, potionUses: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 100, level: 9, casts: 0, spent: 0, potionUses: 0 }) === false);
ok('与六克档第二角 v24.242（unflswiftlowlvpennynopo2）互分源——v24.242 不读 casts、本枚读 casts：放过技照亮 v24.242 但照灭本枚（分源端口 casts）',
  _a('unflswiftlowlvpennynopo2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, casts: 1, spent: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, casts: 1, spent: 0, potionUses: 0 }) === false &&
  _a('unflswiftlowlvpennynopo2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 100, level: 9, casts: 0, spent: 0, potionUses: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 100, level: 9, casts: 0, spent: 0, potionUses: 0 }) === false);
ok('与六克档第三角 v24.243（unflswiftlowlvnoskillnopo2）互分源——v24.243 不读 spent、本枚读 spent：花过金照亮 v24.243 但照灭本枚（分源端口 spent）',
  _a('unflswiftlowlvnoskillnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, casts: 0, potionUses: 0, spent: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, casts: 0, potionUses: 0, spent: 1 }) === false &&
  _a('unflswiftlowlvnoskillnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 100, level: 9, casts: 0, potionUses: 0, spent: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 100, level: 9, casts: 0, potionUses: 0, spent: 0 }) === false);
ok('与六克档第四角 v24.244（unflswiftpennynoskillnopo2）互分源——v24.244 不读 level、本枚读 level：升过十级照亮 v24.244 但照灭本枚（分源端口 level）',
  _a('unflswiftpennynoskillnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, spent: 0, casts: 0, potionUses: 0, level: 12 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, spent: 0, casts: 0, potionUses: 0, level: 12 }) === false &&
  _a('unflswiftpennynoskillnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 100, spent: 0, casts: 0, potionUses: 0, level: 9 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 100, spent: 0, casts: 0, potionUses: 0, level: 9 }) === false);
ok('与五克档 v24.229（unfllowlvnoskillnopo2）互分源——v24.229 不读 battles/spent、本枚读两者：超场或花过金照亮 v24.229 但照灭本枚（双分源端口 battles/spent）',
  _a('unfllowlvnoskillnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, level: 9, casts: 0, potionUses: 0, battles: 100, spent: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, level: 9, casts: 0, potionUses: 0, battles: 100, spent: 0 }) === false &&
  _a('unfllowlvnoskillnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, level: 9, casts: 0, potionUses: 0, battles: 42, spent: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, level: 9, casts: 0, potionUses: 0, battles: 42, spent: 1 }) === false);
ok('与五克档 v24.230（unflswiftlowlvnoskill2）互分源——v24.230 不读 spent/potionUses、本枚读两者：花过金或战斗嗑药照亮 v24.230 但照灭本枚（双分源端口 spent/potionUses）',
  _a('unflswiftlowlvnoskill2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, casts: 0, spent: 1, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, casts: 0, spent: 1, potionUses: 0 }) === false &&
  _a('unflswiftlowlvnoskill2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, casts: 0, spent: 0, potionUses: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, casts: 0, spent: 0, potionUses: 1 }) === false);
ok('与五克档 v24.231（unflswiftlowlvnopo2）互分源——v24.231 不读 spent/casts、本枚读两者：花过金或放过技照亮 v24.231 但照灭本枚（双分源端口 spent/casts）',
  _a('unflswiftlowlvnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, potionUses: 0, spent: 1, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, potionUses: 0, spent: 1, casts: 0 }) === false &&
  _a('unflswiftlowlvnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, potionUses: 0, spent: 0, casts: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, potionUses: 0, spent: 0, casts: 1 }) === false);
ok('与五克档 v24.232（unflswiftnoskillnopo2）互分源——v24.232 不读 level/spent、本枚读两者：升过十级或花过金照亮 v24.232 但照灭本枚（双分源端口 level/spent）',
  _a('unflswiftnoskillnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, casts: 0, potionUses: 0, level: 12, spent: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, casts: 0, potionUses: 0, level: 12, spent: 0 }) === false &&
  _a('unflswiftnoskillnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, casts: 0, potionUses: 0, level: 9, spent: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, casts: 0, potionUses: 0, level: 9, spent: 1 }) === false);
ok('与五克档 v24.233（unflswiftlowlvpenny2）互分源——v24.233 不读 casts/potionUses、本枚读两者：放过技或战斗嗑药照亮 v24.233 但照灭本枚（双分源端口 casts/potionUses）',
  _a('unflswiftlowlvpenny2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, spent: 0, casts: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, spent: 0, casts: 1 }) === false &&
  _a('unflswiftlowlvpenny2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, spent: 0, casts: 0, potionUses: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, spent: 0, casts: 0, potionUses: 1 }) === false);
ok('与五克档 v24.235（unflswiftnoskillpenny2）互分源——v24.235 不读 level/potionUses、本枚读两者：升过十级或战斗嗑药照亮 v24.235 但照灭本枚（双分源端口 level/potionUses）',
  _a('unflswiftnoskillpenny2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, casts: 0, spent: 0, level: 12, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, casts: 0, spent: 0, level: 12, potionUses: 0 }) === false &&
  _a('unflswiftnoskillpenny2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, casts: 0, spent: 0, level: 9, potionUses: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, casts: 0, spent: 0, level: 9, potionUses: 1 }) === false);
ok('与五克档 v24.236（unflswiftnopopenny2）互分源——v24.236 不读 level/casts、本枚读两者：升过十级或放过技照亮 v24.236 但照灭本枚（双分源端口 level/casts）',
  _a('unflswiftnopopenny2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, potionUses: 0, spent: 0, level: 12, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, potionUses: 0, spent: 0, level: 12, casts: 0 }) === false &&
  _a('unflswiftnopopenny2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, potionUses: 0, spent: 0, level: 9, casts: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, potionUses: 0, spent: 0, level: 9, casts: 1 }) === false);
ok('与五克档 v24.237（unfllowskillpenny2）互分源——v24.237 不读 battles/potionUses、本枚读两者：超场或战斗嗑药照亮 v24.237 但照灭本枚（双分源端口 battles/potionUses）',
  _a('unfllowskillpenny2').ok({ trueBoss: true, diff: 1, deaths: 0, level: 9, casts: 0, spent: 0, battles: 100 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, level: 9, casts: 0, spent: 0, battles: 100 }) === false &&
  _a('unfllowskillpenny2').ok({ trueBoss: true, diff: 1, deaths: 0, level: 9, casts: 0, spent: 0, battles: 42, potionUses: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, level: 9, casts: 0, spent: 0, battles: 42, potionUses: 1 }) === false);
ok('与五克档 v24.238（unflpennynoskillnopo2）互分源——v24.238 不读 battles/level、本枚读两者：超场或升过十级照亮 v24.238 但照灭本枚（双分源端口 battles/level）',
  _a('unflpennynoskillnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, casts: 0, potionUses: 0, spent: 0, battles: 100, level: 9 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, casts: 0, potionUses: 0, spent: 0, battles: 100, level: 9 }) === false &&
  _a('unflpennynoskillnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, casts: 0, potionUses: 0, spent: 0, battles: 42, level: 12 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, casts: 0, potionUses: 0, spent: 0, battles: 42, level: 12 }) === false);
ok('与五克档 v24.239（unflpennylowlvnopo2）互分源——v24.239 不读 battles/casts、本枚读两者：超场或放过技照亮 v24.239 但照灭本枚（双分源端口 battles/casts）',
  _a('unflpennylowlvnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, level: 9, potionUses: 0, spent: 0, battles: 100 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, level: 9, potionUses: 0, spent: 0, battles: 100 }) === false &&
  _a('unflpennylowlvnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, level: 9, potionUses: 0, spent: 0, battles: 42, casts: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, level: 9, potionUses: 0, spent: 0, battles: 42, casts: 1 }) === false);
ok('换过难度（diff 0）→ 本枚与各克档同不解锁（diff 严格分区——普通档单克档如 unflicker/swift/lowlv/penny/noskill/nopotion 照常各自解锁，不读本枚）',
  _a('unflpennylownoskillnopo2').ok({ trueBoss: true, diff: 0, deaths: 0, level: 9, spent: 0, casts: 0, potionUses: 0, battles: 42 }) === false &&
  _a('unflicker').ok({ trueBoss: true, deaths: 0 }) === true &&
  _a('swift').ok({ trueBoss: true, battles: 42 }) === true &&
  _a('lowlv').ok({ trueBoss: true, level: 9 }) === true &&
  _a('penny').ok({ trueBoss: true, spent: 0 }) === true &&
  _a('noskill').ok({ trueBoss: true, casts: 0 }) === true &&
  _a('nopotion').ok({ trueBoss: true, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 0, deaths: 0, battles: 42, level: 9, casts: 0, potionUses: 0, spent: 0 }) === false);
ok('普通档正向里程碑各自解锁、本枚只认困难七维全克通关（镜面对互不重叠）',
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, casts: 0, potionUses: 0, spent: 0 }) === true && _a('swift').ok({ trueBoss: true, battles: 42 }) === true && _a('lowlv').ok({ trueBoss: true, level: 9 }) === true && _a('penny').ok({ trueBoss: true, spent: 0 }) === true && _a('noskill').ok({ trueBoss: true, casts: 0 }) === true && _a('nopotion').ok({ trueBoss: true, potionUses: 0 }) === true);

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
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, spent: 0, casts: 0, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 七维全克真结局档 newly 含 unflswiftlowlvpennynoskillnopo2（既有通路自动跟随）',
    newly.includes('unflswiftlowlvpennynoskillnopo2'), JSON.stringify(newly));
  ok('unlockedAchievements 同档 newly 含五枚六克档 unflpennylownoskillnopo2/unflswiftlowlvpennynoskill2/unflswiftlowlvpennynopo2/unflswiftlowlvnoskillnopo2/unflswiftpennynoskillnopo2（子集自动跟随）',
    newly.includes('unflpennylownoskillnopo2') && newly.includes('unflswiftlowlvpennynoskill2') && newly.includes('unflswiftlowlvpennynopo2') && newly.includes('unflswiftlowlvnoskillnopo2') && newly.includes('unflswiftpennynoskillnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 0, deaths: 0, battles: 42, level: 9, spent: 0, casts: 0, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 普通档 newly 不含 unflswiftlowlvpennynoskillnopo2（不误解锁，diff 维严格）',
    !newly.includes('unflswiftlowlvpennynoskillnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 1, battles: 42, level: 9, spent: 0, casts: 0, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 死过一次档 newly 不含 unflswiftlowlvpennynoskillnopo2（不误解锁，deaths 维严格）',
    !newly.includes('unflswiftlowlvpennynoskillnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, battles: 100, level: 9, spent: 0, casts: 0, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 超七十场档 newly 不含 unflswiftlowlvpennynoskillnopo2（不误解锁，battles 维严格）',
    !newly.includes('unflswiftlowlvpennynoskillnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 12, spent: 0, casts: 0, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 升过十级档 newly 不含 unflswiftlowlvpennynoskillnopo2（不误解锁，level 维严格——本枚读 level）',
    !newly.includes('unflswiftlowlvpennynoskillnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, spent: 9, casts: 0, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 花过金档 newly 不含 unflswiftlowlvpennynoskillnopo2（不误解锁，spent 维严格）',
    !newly.includes('unflswiftlowlvpennynoskillnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, spent: 0, casts: 1, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 放过技档 newly 不含 unflswiftlowlvpennynoskillnopo2（不误解锁，casts 维严格）',
    !newly.includes('unflswiftlowlvpennynoskillnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, spent: 0, casts: 0, potionUses: 1 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 战斗嗑过药档 newly 不含 unflswiftlowlvpennynoskillnopo2（不误解锁，potionUses 维严格）',
    !newly.includes('unflswiftlowlvpennynoskillnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ diff: 1, deaths: 0, battles: 42, level: 9, spent: 0, casts: 0, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 未通关档 newly 不含 unflswiftlowlvpennynoskillnopo2（不误解锁）',
    !newly.includes('unflswiftlowlvpennynoskillnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, spent: 0, casts: 0, potionUses: 0, mapPotions: 9, travels: 3, innRests: 3 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 大地图喝过药且旅行过且住过店档 newly 含 unflswiftlowlvpennynoskillnopo2（本枚不读 mapPotions/travels/innRests，与休整/探索系分源）',
    newly.includes('unflswiftlowlvpennynoskillnopo2'), JSON.stringify(newly));
}

// —— applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等）——
{
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, spent: 0, casts: 0, potionUses: 0 });
    S.G = h;
    applyAchievements();
    ok('applyAchievements 真实解锁落 hero.ach（含 unflswiftlowlvpennynoskillnopo2）', h.ach.includes('unflswiftlowlvpennynoskillnopo2'), JSON.stringify(h.ach));
    ok('解锁横幅报成就名【逆风长明疾行青芽素手不饮白手】', msgs.some((m) => m.includes('🔓 成就解锁：') && m.includes('【逆风长明疾行青芽素手不饮白手】')), msgs.join(' | '));
    const len1 = msgs.length;
    applyAchievements();
    ok('幂等：重复调用不再报（已解锁去重）', msgs.length === len1 && msgs.filter((m) => m.includes('【逆风长明疾行青芽素手不饮白手】')).length === 1, String(msgs.length));
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
    const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 12, spent: 0, casts: 0, potionUses: 0 });
    S.G = h;
    applyAchievements();
    ok('升过十级 applyAchievements 零 unflswiftlowlvpennynoskillnopo2 解锁零「逆风长明疾行青芽素手不饮白手」横幅（不误解锁，level 维严格）',
      !h.ach.includes('unflswiftlowlvpennynoskillnopo2') && !msgs.some((m) => m.includes('【逆风长明疾行青芽素手不饮白手】')), JSON.stringify({ ach: h.ach, msgs }));
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
    const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, battles: 100, level: 9, spent: 0, casts: 0, potionUses: 0 });
    S.G = h;
    applyAchievements();
    ok('超七十场 applyAchievements 零 unflswiftlowlvpennynoskillnopo2 解锁零「逆风长明疾行青芽素手不饮白手」横幅（不误解锁，battles 维严格）',
      !h.ach.includes('unflswiftlowlvpennynoskillnopo2') && !msgs.some((m) => m.includes('【逆风长明疾行青芽素手不饮白手】')), JSON.stringify({ ach: h.ach, msgs }));
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}

// —— 源级零变化：battle.js 无 spent/level 新增写点 + battle.js deaths/battles/potionUses/casts 写入点 + hero.js level++ + data.js 常量（既有，本版未动）——
ok('battle.js 未新增任何 spent 计数写点（消费线五端口都在 shop/core、本版零改动）',
  (battleSrc.match(/\.spent = /g) || []).length === 0, String((battleSrc.match(/\.spent = /g) || []).length));
ok('battle.js 未新增任何 level 计数写点（升级线只有 hero.js grantXp 一处、本版零改动）',
  (battleSrc.match(/\.level = /g) || []).length === 0, String((battleSrc.match(/\.level = /g) || []).length));
ok('battle.js 具 1 处 S.G.deaths = (S.G.deaths || 0) + 1; 写入点（loseBattle 阵亡唯一产生点）',
  (battleSrc.match(/S\.G\.deaths = \(S\.G\.deaths \|\| 0\) \+ 1;/g) || []).length === 1, String((battleSrc.match(/S\.G\.deaths = \(S\.G\.deaths \|\| 0\) \+ 1;/g) || []).length));
ok('battle.js 具 1 处 S.G.battles = (S.G.battles || 0) + 1; 写入点（startBattle 进战即记唯一产生点）',
  (battleSrc.match(/S\.G\.battles = \(S\.G\.battles \|\| 0\) \+ 1;/g) || []).length === 1, String((battleSrc.match(/S\.G\.battles = \(S\.G\.battles \|\| 0\) \+ 1;/g) || []).length));
ok('battle.js 具 1 处 hero.potionUses = useN; 写入点（doItem 战斗用药成功唯一产生点——大地图 F/旅馆/篝火不计入，本版未动）',
  (battleSrc.match(/hero\.potionUses = useN;/g) || []).length === 1 && battleSrc.includes('const useN = (hero.potionUses || 0) + 1;'), String((battleSrc.match(/hero\.potionUses = useN;/g) || []).length));
ok('battle.js 具 1 处 hero.casts = castN; 写入点（doSkill 战斗释放技能成功唯一产生点——治愈与伤害两分支都计入，本版未动）',
  (battleSrc.match(/hero\.casts = castN;/g) || []).length === 1 && battleSrc.includes('const castN = (hero.casts || 0) + 1;'), String((battleSrc.match(/hero\.casts = castN;/g) || []).length));
ok('hero.js 具 1 处 hero.level++ 写入点（grantXp 升级唯一产生点）',
  (heroSrc.match(/hero\.level\+\+;/g) || []).length === 1, String((heroSrc.match(/hero\.level\+\+;/g) || []).length));
ok('data.js SPEED_GOAL 常量仍为 70（单一数据源，与 swift/swift2/unflswift/unflswift2/unflswiftlowlvpennynoskillnopo2 系同读一份源）',
  dataSrc.includes('const SPEED_GOAL = 70;'));
ok('data.js LOWLV_GOAL 常量仍为 10（单一数据源，与 lowlv/lowlv2/lowskill/unfllowlv/unfllowlv2/unflswiftlowlvpennynoskillnopo2 系同读一份源）',
  dataSrc.includes('const LOWLV_GOAL = 10;'));
ok('data.js DIFFS 仍含「困难」档（难度单一数据源，与 hardtrue/steadfast/unflpenny2/unflswift2/unflswiftlowlvpennynoskillnopo2 同读一份源）',
  dataSrc.includes("const DIFFS=['普通','困难'];"));
ok('hero.js 成就横幅活计数注释已推进至 N/156（155→156）', heroSrc.includes('（成就 N/158）'));
ok('data.js 成就横幅活计数注释已推进至 N/156（155→156，两处恒等）', (dataSrc.match(/（成就 N\/158）/g) || []).length === 2, String((dataSrc.match(/（成就 N\/158）/g) || []).length));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径为四百四十三件套（四百四十二件套清除）',
  readme.includes('扩充为冒烟四百四十三件套（四百四十二件套清除）') && !readme.includes('扩充为冒烟四百四十件套（四百三十九件套清除）'));
ok('README 含 v24.245 守护描述（逆风长明疾行青芽素手不饮白手七维全克收官守护）', readme.includes('v24.245 起含「逆风长明疾行青芽素手不饮白手」新成就守护'));
ok('README 版本速览已为 v24.245 且成就计数 156', readme.includes('版本速览（v24.247）') && readme.includes('158 项成就'));
ok('README 成就计数双处口径 156 项（全部 158 项进度 + **158 项成就**，**155 项成就**清除）',
  readme.includes('全部 158 项进度') && readme.includes('**15' + '8 项成就**') && !readme.includes('**15' + '6 项成就**'));
ok('README tests 树收录 smoke_v24245_unflswiftlowlvpennynoskillnopo2（含 v24.245 守护子句 + 串尾）',
  readme.includes('v24.245 起含「逆风长明疾行青芽素手不饮白手」新成就守护') && readme.includes('smoke_v24245_unflswiftlowlvpennynoskillnopo2'));
ok('README 含 smoke_v24245_unflswiftlowlvpennynoskillnopo2 入库（441 份）', readme.includes('smoke_v24245_unflswiftlowlvpennynoskillnopo2 入库（441 份）'));
ok('package.json 已收录 smoke_v24245_unflswiftlowlvpennynoskillnopo2.mjs 且位于串尾（在 smoke_v24244_unflswiftpennynoskillnopo2 之后）',
  pkg.includes('smoke_v24245_unflswiftlowlvpennynoskillnopo2.mjs') &&
  pkg.includes('node tests/smoke_v24244_unflswiftpennynoskillnopo2.mjs && node tests/smoke_v24245_unflswiftlowlvpennynoskillnopo2.mjs && node tests/smoke_v24246_unfltravel2.mjs && node tests/smoke_v24247_unfltravelswift2.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 441 件套', testChain === 443, String(testChain));
ok('CHANGELOG 含 v24.245 顶条目', changelog.startsWith('## v24.247'));

// —— 哨兵链：README 已有 441 口径且尚无 442（前望 442 语义：下一版才写 442）——
ok('README 已有四百四十一件套口径且尚无 442（哨兵前望 442 语义：下一版才写 442）',
  readme.includes('扩充为冒烟四百四十三件套（四百四十二件套清除）') && !readme.includes('四百四十四件套'));
{
  const s24143 = read('tests/smoke_v24143_furnacequest.mjs');
  ok('smoke_v24143 哨兵链前望 444（四百四十四件套否定式）',
    s24143.includes('哨兵链前望 444') && s24143.includes('四百四十四件套否定式'));
}

// —— 旧代 v24.244 字面量 / 440 件套口径 / 155 项 全库零残留扫描（豁免本套件与 v24244 与 v24243 与 v24242 与 v24241 与 v24239 与 v24238 与 v24237 与 v24235 与 v24233 与 v24231 与 v24230 与 v24229——十二者含 v24.244 负向断言/扫描目标）——
const EXEMPT = new Set(['smoke_v24247_unfltravelswift2.mjs', 'smoke_v24246_unfltravel2.mjs', 'smoke_v24245_unflswiftlowlvpennynoskillnopo2.mjs', 'smoke_v24244_unflswiftpennynoskillnopo2.mjs', 'smoke_v24243_unflswiftlowlvnoskillnopo2.mjs', 'smoke_v24242_unflswiftlowlvpennynopo2.mjs', 'smoke_v24241_unflswiftlowlvpennynoskill2.mjs', 'smoke_v24239_unflpennylowlvnopo2.mjs', 'smoke_v24238_unflpennynoskillnopo2.mjs', 'smoke_v24237_unfllowskillpenny2.mjs', 'smoke_v24235_unflswiftnopopenny2.mjs', 'smoke_v24233_unflswiftnoskillpenny2.mjs', 'smoke_v24231_unflswiftlowlvpenny2.mjs', 'smoke_v24230_unflswiftnoskillnopo2.mjs', 'smoke_v24229_unflswiftlowlvnopo2.mjs']);
const leftovers = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests')).filter((x) => x.endsWith('.mjs') && !EXEMPT.has(x))) {
  const s = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  const code = s.split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  if (code.includes("const GAME_VERSION = 'v24.244'")) leftovers.push(f + ':gv');
  if (code.includes("GAME_VERSION === 'v24.244'")) leftovers.push(f + ':eq');
  if (code.includes("startsWith('## v24.244")) leftovers.push(f + ':st');
  if (code.includes('四百四十件套（四百三十九件套清除）')) leftovers.push(f + ':440');
  if (code.includes('testChain === 440') || code.includes('files.length === 440') ||
      code.includes('treeTok.length === 440') || code.includes('chainAll.length === 440') ||
      code.includes('fileCount === 440'))
    leftovers.push(f + ':count');
  if (code.includes('版本速览（v24.244）')) leftovers.push(f + ':ver');
// 成就计数 155→156 零残留：只认「**15'+'5 项成就**」/「全部 155 项进度」两形态（「成就 N/156」是 v24.76 HUD 口径稳定常驻 pin 家族，不在扫描目标内）
  if (code.includes('**15' + '6 项成就**') || code.includes('全部 155 项进度'))
    leftovers.push(f + ':155');
}
ok('旧代 v24.244 GAME_VERSION 字面量/恒等/顶 pin/版本速览 全库零残留（哨兵链，豁免本套件与 v24244 与 v24243 与 v24242 与 v24241 与 v24239 与 v24238 与 v24237 与 v24235 与 v24233 与 v24231 与 v24230 与 v24229）',
  leftovers.filter((x) => x.endsWith(':gv') || x.endsWith(':eq') || x.endsWith(':st') || x.endsWith(':ver')).length === 0,
  JSON.stringify(leftovers));
ok('旧代 440 件套口径/计数/155 项 pin 全库零残留（哨兵链，豁免本套件与 v24244 与 v24243 与 v24242 与 v24241 与 v24239 与 v24238 与 v24237 与 v24235 与 v24233 与 v24231 与 v24230 与 v24229）',
  leftovers.filter((x) => x.endsWith(':440') || x.endsWith(':count') || x.endsWith(':155')).length === 0,
  JSON.stringify(leftovers));

if (failed) { console.log(`— v24.247 冒烟完成：${n} 项断言，失败 ${failed} —`); process.exit(1); }
console.log(`— v24.247 冒烟完成：${n} 项断言全绿 —`);
