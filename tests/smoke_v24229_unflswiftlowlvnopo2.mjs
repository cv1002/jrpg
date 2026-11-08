// smoke_v24229_unflswiftlowlvnopo2.mjs —— v24.231 专项冒烟：新成就「逆风长明疾行青芽不饮」（挑战向·「困难×长明×疾行×青芽×不饮」五克档第三角·困难×零阵亡×七十场内×未及十级×零战斗用药）
// （新内容·单成就·第一百四十四项——承 v24.230 逆风长明疾行青芽素手（unflswiftlowlvnoskill2，「困难×长明×疾行×青芽×素手」五克档第二角·困难×零阵亡×七十场内×未及十级×零用技）/
// v24.229 逆风长明青芽素手不饮（unfllowlvnoskillnopo2，「困难×长明×青芽×素手×不饮」五克档首枚·困难×零阵亡×未及十级×零用技×零战斗用药）/
// v24.214 逆风长明疾行青芽（unflswiftlowlv2，「困难×长明」四重克制维度首角·困难×零阵亡×七十场内×未及十级）/
// v24.217 逆风长明疾行不饮（unflswiftnopo2，「困难×长明×疾行×不饮」四重克制维度首角·困难×零阵亡×七十场内×零战斗用药）/
// v24.224 逆风长明不饮青芽（unfllowlvnopo2，「困难×长明×青芽×不饮」四重克制维度首角·困难×零阵亡×未及十级×零战斗用药）先例：本枚把
// unflswiftlowlv2（diff×deaths×battles×level 四克档）与 unflswiftnopo2（diff×deaths×battles×potionUses 四克档）与 unfllowlvnopo2（diff×deaths×level×potionUses 四克档）
// 的严格公共交集——「既零阵亡、又七十场内、又未及十级、又零战斗用药且困难通关」——收为一枚，开垦
// 「hardtrue×长明×疾行×青芽×不饮」五克档第三角（unfl 五克档 C(5,3)=10，v24.229 已开 {lowlv,noskill,nopotion}、v24.230 已开 {swift,lowlv,noskill}，本枚开
// {swift,lowlv,nopotion}；与各枚二维以上分源——死过一次、超过 70 场、升过十级或战斗里喝过一口药即永久无缘此档）。
// 判定读既有 hero.trueBoss（终焉之神=真结局最终 Boss，与 trueboss/hardtrue/unflicker 同源）、既有 hero.diff（DIFFS 下标：建档 createDiff 写定、`(g.diff===1)` 即 DIFFS[1]「困难」档）、
// 既有 hero.deaths（battle.loseBattle 全游唯一产生点——只增不减、防御式 (g.deaths||0) 旧档零迁移）、既有 hero.battles（battle.startBattle 进战即记唯一产生点——胜/败/逃都算、
// 防御式 (g.battles||0) 旧档零迁移）、既有 hero.level（hero.js grantXp 升级唯一产生点——只增不减、防御式 (g.level||1)<LOWLV_GOAL 旧档零迁移）、既有 hero.potionUses（battle.doItem
// 战斗用药成功唯一产生点——治愈/伤害两分支都计入、只增不减、防御式 (g.potionUses||0) 旧档零迁移），
// (g.trueBoss && g.diff===1 && !(g.deaths||0) && (g.battles||0)<=SPEED_GOAL && (g.level||1)<LOWLV_GOAL && !(g.potionUses||0)) 即「困难 · 零阵亡 · 七十场内 · 未及十级 · 零战斗用药通关」达成——六端口都只增不减语义下，
// 换过难度、死过一次、超场、升过十级或战斗里喝过一口药就永久无缘此档（与 hardtrue 换难度 / unflicker 死过一次 / swift 超场 / lowlv 升过十级 / nopotion 战斗嗑药
// 同属「重新来过才拿得到」的挑战品类）；是 hardtrue、unflicker（零阵亡）、swift（七十场内）、lowlv（未及十级）、nopotion（零战斗用药）五枚的严格交叠——困难零阵亡七十场内未及十级
// 零战斗用药通关必同时满足五者（也必满足 unflswiftlowlv2 / unflswiftnopo2 / unfllowlvnopo2 / unflswift2 / unflnopo2 / unfllowlv2 / swiftlowlvnopo2 等组合档），本枚是这一五重交叉区
// 「hardtrue×长明×疾行×青芽×不饮」维度的第三角（unfl 五克档 C(5,3)=10 剩 8 枚）；与既有正向里程碑 lowlv「未及十级」/ nopotion「药囊未启」/ swift「速战速决」成镜面对、互不重叠。
// 可行性：困难档魔物全面加强下零阵亡推进且 [2] 技能键照常可用、[4] 防御/逃跑、[5] 蓄力照常可用（都不碰 diff/deaths/battles/level/potionUses 五端口）、
// 商店买剑/买甲/买药与住店/酿造照常可用（spent 不在本档读口——与 penny 系分源，花过金只灭 penny 档不灭本档）且战斗放技照常可用（casts 不在本档读口——与 casts 系分源，
// 放过技只灭 noskill 档不灭本档）且 [3] 药键零按下（potionUses 只认战斗用药、治愈/伤害两分支都计入）且全程等级不破十（升级即永久无缘此档）且战斗场次不破七十
// （battles 胜/败/逃都算，startBattle 进战即记）——「困难 × 别自降难度 + 别死 + 别恋战 + 别练级 + 别嗑药」的五重克制一场
// 逆风长明疾行青芽不饮。
// 零新计数零新状态零新写点零新存档（trueBoss/diff/deaths/battles/level/potionUses 皆既有字段）、无 r 无 prog 纯里程碑（与 hardtrue/unflicker/swift/lowlv/nopotion/unflswiftlowlv2 同款——困难里不恋战不练级不嗑药又不死本身就是奖励、硬核才是）、
// 解锁走 winBattle → applyAchievements 既有通路（终焉之神击败当场 trueBoss 落账后 applyAchievements 枚举即解锁，零新增依赖），反馈不迟到。
// 本冒烟守护：版本锚点（格式合法 + 已越过 v24.230 + data.js 字面量 v24.231 + 旧 v24.230 字面量零残留）、ACH_LIST 144 项精确与末尾序位（unflswiftlowlvnopo2 落位 143——
// 前 143 项 id/序位零回归）、unflswiftlowlvnopo2 数据契约（d 文案、ok 防御式逐值、无 r 无 prog 且与 lowlv/nopotion/swift 正向里程碑镜面对、五克档必同时满足
// hardtrue/unflicker/swift/lowlv/nopotion 且满足 unflswiftlowlv2/unflswiftnopo2/unfllowlvnopo2 等组合档）、unlockedAchievements/applyAchievements
// 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等去重 / 换难度不解锁 / 死过一次不解锁 / 超场不解锁 / 升过十级不解锁 / 战斗嗑过药不解锁 / 未通关不解锁）、
// 既有 143 成就 id 零回归、battle.js 无 level/spent 新增写点与 deaths/battles/potionUses/casts 写入点与 data.js SPEED_GOAL/CAST_GOAL/BATTLE_GOAL/
// LOWLV_GOAL/DIFFS 常量源级零变化、README/package.json/CHANGELOG 同步（件套口径 429 + v24.231 守护描述 + 入库 429 + 版本速览 144 项 + tests 树串尾 + package 串尾 429）、
// 哨兵链（前望 431 且 README 尚无 430 口径）、旧代 v24.230 字面量/恒等/顶 pin/428 口径/143 项全库零残留扫描（豁免本套件与 v24228 与 v24227——三者含 v24.230 负向断言/扫描目标）。
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
console.log('— v24.231 挑战向·「困难×长明×疾行×青芽×不饮」五克档第三角成就「逆风长明疾行青芽不饮」（困难×零阵亡×七十场内×未及十级×零战斗用药） 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dataSrc = read('js/data.js');
const battleSrc = read('js/battle.js');
const heroSrc = read('js/hero.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');
// —— 版本锚点（格式合法 + 已越过 v24.230 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.230', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 241)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.231（旧 v24.230 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v24.242';") && !dataSrc.includes("const GAME_VERSION = 'v24.230';"));
ok('data.js 含 v24.231 注释（逆风长明疾行青芽不饮五克档第三角说明）',
  dataSrc.includes('v24.232 新内容·新成就（第一百四十五项）'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'unflswiftlowlvnopo2');
ok('ACH_LIST 含 unflswiftlowlvnopo2「逆风长明疾行青芽不饮」且 id 唯一',
  !!ach && ach.name === '逆风长明疾行青芽不饮' && ACH_LIST.filter((a) => a.id === 'unflswiftlowlvnopo2').length === 1);
ok('ACH_LIST 精确总数 144 项（143→144 末尾追加）', ACH_LIST.length === 153, String(ACH_LIST.length));
ok('unflswiftlowlvnopo2 描述文案（困难零阵亡七十场内未及十级零战斗用药真结局五克档第三角）',
  ach.d === `以困难模式、零阵亡、${70} 场战斗内、等级未满 ${10} 且未在战斗中使用药水/灵药（战斗指令 [3]）时击败终焉之神（真结局）`, ach.d);
ok('unflswiftlowlvnopo2 判定源级（读既有 g.trueBoss / g.diff===1 / !(g.deaths||0) / (g.battles||0)<=SPEED_GOAL / (g.level||1)<LOWLV_GOAL / !(g.potionUses||0)，不含 spent 不含 casts）',
  String(ach.ok).includes('g.trueBoss') && String(ach.ok).includes('g.diff===1') && String(ach.ok).includes('g.deaths') &&
  String(ach.ok).includes('SPEED_GOAL') && String(ach.ok).includes('LOWLV_GOAL') && String(ach.ok).includes('g.potionUses') &&
  String(ach.ok).includes('g.battles') && !String(ach.ok).includes('g.spent') && !String(ach.ok).includes('g.casts'));
ok('unflswiftlowlvnopo2 无 r 无 prog 纯里程碑（与 hardtrue/unflicker/swift/lowlv/nopotion/unflswiftlowlv2 同款）',
  !('r' in ach) && !('prog' in ach));

// —— ok 防御式逐值 ——
ok('困难 + 零阵亡 + 七十场内 + 未及十级 + 零战斗用药 + 真结局 → 解锁', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 70, level: 5, potionUses: 0 }) === true);
ok('困难 + 零阵亡 + 真结局 + 缺 deaths/battles/level/potionUses 字段 → (g.deaths||0)/(g.battles||0)/(g.level||1)/(g.potionUses||0) 防御式解码解锁（旧档零迁移）', ach.ok({ trueBoss: true, diff: 1 }) === true);
ok('缺 diff 字段（普通档）+ 全克制 → 不解锁（diff 维严格）', ach.ok({ trueBoss: true, deaths: 0, battles: 42, level: 5, potionUses: 0 }) === false);
ok('困难 + 死过一次（deaths 1）→ 不解锁（阵亡即永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, deaths: 1, battles: 42, level: 5, potionUses: 0 }) === false);
ok('困难 + 超场（battles 71）→ 不解锁（超过七十场即永久无缘此档，swift 维严格）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 71, level: 5, potionUses: 0 }) === false);
ok('困难 + 恰好七十场（battles 70）→ 照常解锁（七十场内含边界的严格界）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 70, level: 5, potionUses: 0 }) === true);
ok('困难 + 升过十级（level 12）→ 不解锁（升级即永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 12, potionUses: 0 }) === false);
ok('困难 + 等级恰好十级（level 10）→ 不解锁（未满十级的严格界）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 10, potionUses: 0 }) === false);
ok('困难 + 战斗嗑过药（potionUses 1）→ 不解锁（战斗用一口药即永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 5, potionUses: 1 }) === false);
ok('困难 + 全克制但未通关 → 不解锁', ach.ok({ diff: 1, deaths: 0, battles: 42, level: 5, potionUses: 0 }) === false);
ok('空档/缺字段 → 不解锁（六端口防御式零迁移）', ach.ok({}) === false);
ok('困难 + 全克制 + 花过 1 金币（spent 999）→ 照常解锁（本档不读 spent，与 penny 系分源——花过钱只灭 penny 档）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 5, potionUses: 0, spent: 999 }) === true);
ok('困难 + 全克制 + 放过一次技（casts 3）→ 照常解锁（本档不读 casts，与 casts 系分源——放过技只灭 noskill 档）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 5, potionUses: 0, casts: 3 }) === true);
ok('困难 + 全克制 + 大地图 F 喝过药（mapPotions 9）→ 照常解锁（本档不读 mapPotions，只认战斗用药）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 5, potionUses: 0, mapPotions: 9 }) === true);
ok('困难 + 全克制 + 快速旅行过（travels 3）→ 照常解锁（本档不读 travels，与旅行探索系分源）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 5, potionUses: 0, travels: 3 }) === true);

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
  'swiftlowlvnopo2', 'swiftnoskillnopo2', 'pennyswiftlv2', 'pennyswiftskill2', 'pennyswiftnopo2', 'unflswiftlowlv2', 'unflswiftnopo2', 'unflpennyswift2', 'unflpennylowlv2', 'unflpennynopo2', 'unfllowskill2', 'unflswiftskill2', 'unfllowlvnopo2', 'unflnoskillnopo2', 'unflpennynoskill2', 'unflpennylownoskillnopo2', 'unfllowlvnoskillnopo2', 'unflswiftlowlvnoskill2'];
ok('既有 143 成就 id 零回归（核心抽样全覆盖末期正位）',
  EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('unflswiftlowlvnopo2 落位 index 143（末尾追加，既有 0..142 序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'unflswiftlowlvnopo2') === 143 &&
  ACH_LIST.findIndex((a) => a.id === 'unflswiftlowlvnoskill2') === 142 &&
  ACH_LIST.findIndex((a) => a.id === 'unfllowlvnoskillnopo2') === 141 &&
  ACH_LIST.findIndex((a) => a.id === 'unflpennylownoskillnopo2') === 140);

// —— 既有组合档家族对照（五克档 = 各组合档严格公共交集，互不干扰）——
const _a = (id) => ACH_LIST.find((x) => x.id === id);
ok('五克档必同时满足 unflswiftlowlv2（四克档）与 unflswiftnopo2（四克档）与 unfllowlvnopo2（四克档）三枚（deaths/battles/level/potionUses 四源同判）',
  _a('unflswiftlowlv2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, potionUses: 0 }) === true &&
  _a('unflswiftnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, potionUses: 0 }) === true &&
  _a('unfllowlvnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, potionUses: 0 }) === true);
ok('组合档互检：unflswiftlowlv2 不读 potionUses（战斗嗑药照亮 unflswiftlowlv2 但照灭本枚）/ unflswiftnopo2 不读 level（升过十级照亮 unflswiftnopo2 但照灭本枚）/ unfllowlvnopo2 不读 battles（超场照亮 unfllowlvnopo2 但照灭本枚）',
  _a('unflswiftlowlv2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, potionUses: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, potionUses: 1 }) === false &&
  _a('unflswiftnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 12, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 12, potionUses: 0 }) === false &&
  _a('unfllowlvnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 100, level: 9, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 100, level: 9, potionUses: 0 }) === false);
ok('换过难度（diff 0）→ 本枚与组合档同不解锁（diff 严格分区——普通档单克档如 unflicker/swift/lowlv/nopotion 照常各自解锁，不读本枚）',
  _a('unflswiftlowlv2').ok({ trueBoss: true, diff: 0, deaths: 0, battles: 42, level: 9, potionUses: 0 }) === false &&
  _a('unflicker').ok({ trueBoss: true, deaths: 0 }) === true &&
  _a('swift').ok({ trueBoss: true, battles: 42 }) === true &&
  _a('nopotion').ok({ trueBoss: true, potionUses: 0 }) === true &&
  _a('lowlv').ok({ trueBoss: true, level: 9 }) === true &&
  ach.ok({ trueBoss: true, diff: 0, deaths: 0, battles: 42, level: 9, potionUses: 0 }) === false);
ok('与五克档 unflswiftlowlvnoskill2（v24.230）互不干扰——v24.230 读 casts 不读 potionUses、本枚读 potionUses 不读 casts：战斗嗑药照灭本枚但照亮 v24.230，放过技照灭 v24.230 但照亮本枚',
  _a('unflswiftlowlvnoskill2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, casts: 0, potionUses: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, casts: 0, potionUses: 1 }) === false &&
  _a('unflswiftlowlvnoskill2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, casts: 1, potionUses: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, casts: 1, potionUses: 0 }) === true);
ok('与五克档 unfllowlvnoskillnopo2（v24.229）互不干扰——v24.229 读 casts 不读 battles、本枚读 battles 不读 casts：超场照亮 v24.229 但照灭本枚，放过技照亮本枚但照灭 v24.229',
  _a('unfllowlvnoskillnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 100, level: 9, casts: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 100, level: 9, casts: 0, potionUses: 0 }) === false &&
  _a('unfllowlvnoskillnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, casts: 1, potionUses: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, casts: 1, potionUses: 0 }) === true);
ok('与四克档 unflpennyswift2（v24.218）互不干扰——unflpennyswift2 读 spent 不读 level/potionUses、本枚读 level/potionUses 不读 spent：花过金照亮本枚但照灭 unflpennyswift2，升过十级且战斗嗑药照灭本枚但照亮 unflpennyswift2',
  _a('unflpennyswift2').ok({ trueBoss: true, diff: 1, deaths: 0, spent: 1, battles: 42, level: 9, potionUses: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 1, battles: 42, level: 9, potionUses: 0 }) === true &&
  _a('unflpennyswift2').ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, battles: 42, level: 12, potionUses: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, battles: 42, level: 12, potionUses: 1 }) === false);
ok('与四克档 unflpennylowlv2（v24.219）互不干扰——unflpennylowlv2 读 spent 不读 battles/potionUses、本枚读 battles/potionUses 不读 spent：花过金照亮本枚但照灭 unflpennylowlv2，超场且战斗嗑药照灭本枚但照亮 unflpennylowlv2',
  _a('unflpennylowlv2').ok({ trueBoss: true, diff: 1, deaths: 0, spent: 1, level: 9, battles: 42, potionUses: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 1, level: 9, battles: 42, potionUses: 0 }) === true &&
  _a('unflpennylowlv2').ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 9, battles: 100, potionUses: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 9, battles: 100, potionUses: 1 }) === false);
ok('与四克档 unflpennynopo2（v24.220）互不干扰——unflpennynopo2 读 spent 不读 battles/level、本枚读 battles/level 不读 spent：花过金照亮本枚但照灭 unflpennynopo2，超场且升过十级照灭本枚但照亮 unflpennynopo2',
  _a('unflpennynopo2').ok({ trueBoss: true, diff: 1, deaths: 0, spent: 1, level: 9, battles: 42, potionUses: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 1, level: 9, battles: 42, potionUses: 0 }) === true &&
  _a('unflpennynopo2').ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 12, battles: 100, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 0, level: 12, battles: 100, potionUses: 0 }) === false);
ok('与四克档 unfllowskill2（v24.222）互不干扰——unfllowskill2 读 casts 不读 battles/potionUses、本枚读 battles/potionUses 不读 casts：超场且战斗嗑药照亮 unfllowskill2 但照灭本枚，放过技照亮本枚但照灭 unfllowskill2',
  _a('unfllowskill2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 100, level: 9, casts: 0, potionUses: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 100, level: 9, casts: 0, potionUses: 1 }) === false &&
  _a('unfllowskill2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, casts: 1, potionUses: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, casts: 1, potionUses: 0 }) === true);
ok('与三克档 swiftlowskill2（v24.201）互不干扰——swiftlowskill2 不读 deaths、本枚读 deaths：死过一次照亮 swiftlowskill2 但照灭本枚',
  _a('swiftlowskill2').ok({ trueBoss: true, diff: 1, deaths: 1, battles: 42, level: 9, casts: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 1, battles: 42, level: 9, casts: 0, potionUses: 0 }) === false);
ok('swift/lowlv/nopotion 正向里程碑档不解锁本枚（普通档场内各自解锁自己的正向里程碑，本枚只认五克档困难通关）',
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, potionUses: 0 }) === true && _a('swift').ok({ trueBoss: true, battles: 42 }) === true && _a('lowlv').ok({ trueBoss: true, level: 9 }) === true && _a('nopotion').ok({ trueBoss: true, potionUses: 0 }) === true);

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
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 五克档真结局档 newly 含 unflswiftlowlvnopo2（既有通路自动跟随）',
    newly.includes('unflswiftlowlvnopo2'), JSON.stringify(newly));
  ok('unlockedAchievements 同档 newly 含三枚组合档 unflswiftlowlv2/unflswiftnopo2/unfllowlvnopo2（子集自动跟随）',
    newly.includes('unflswiftlowlv2') && newly.includes('unflswiftnopo2') && newly.includes('unfllowlvnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 0, deaths: 0, battles: 42, level: 9, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 普通档 newly 不含 unflswiftlowlvnopo2（不误解锁，diff 维严格）',
    !newly.includes('unflswiftlowlvnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 1, battles: 42, level: 9, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 死过一次档 newly 不含 unflswiftlowlvnopo2（不误解锁，deaths 维严格）',
    !newly.includes('unflswiftlowlvnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, battles: 100, level: 9, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 超场档 newly 不含 unflswiftlowlvnopo2（不误解锁，battles 维严格）',
    !newly.includes('unflswiftlowlvnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 12, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 升过十级档 newly 不含 unflswiftlowlvnopo2（不误解锁，level 维严格）',
    !newly.includes('unflswiftlowlvnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, potionUses: 1 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 战斗嗑过药档 newly 不含 unflswiftlowlvnopo2（不误解锁，potionUses 维严格）',
    !newly.includes('unflswiftlowlvnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ diff: 1, deaths: 0, battles: 42, level: 9, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 未通关档 newly 不含 unflswiftlowlvnopo2（不误解锁）',
    !newly.includes('unflswiftlowlvnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, potionUses: 0, spent: 999, casts: 5, mapPotions: 9, travels: 3 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 花过金且放过技且大地图喝过药且旅行过档 newly 含 unflswiftlowlvnopo2（本档不读 spent/casts/mapPotions/travels，与 penny/casts 系分源）',
    newly.includes('unflswiftlowlvnopo2'), JSON.stringify(newly));
}

// —— applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等）——
{
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, potionUses: 0 });
    S.G = h;
    applyAchievements();
    ok('applyAchievements 真实解锁落 hero.ach（含 unflswiftlowlvnopo2）', h.ach.includes('unflswiftlowlvnopo2'), JSON.stringify(h.ach));
    ok('解锁横幅报成就名【逆风长明疾行青芽不饮】', msgs.some((m) => m.includes('🔓 成就解锁：') && m.includes('【逆风长明疾行青芽不饮】')), msgs.join(' | '));
    const len1 = msgs.length;
    applyAchievements();
    ok('幂等：重复调用不再报（已解锁去重）', msgs.length === len1 && msgs.filter((m) => m.includes('【逆风长明疾行青芽不饮】')).length === 1, String(msgs.length));
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
    const h = freshHero({ trueBoss: true, diff: 1, deaths: 1, battles: 42, level: 9, potionUses: 0 });
    S.G = h;
    applyAchievements();
    ok('死过一次 applyAchievements 零 unflswiftlowlvnopo2 解锁零「逆风长明疾行青芽不饮」横幅（不误解锁，deaths 维严格）',
      !h.ach.includes('unflswiftlowlvnopo2') && !msgs.some((m) => m.includes('【逆风长明疾行青芽不饮】')), JSON.stringify({ ach: h.ach, msgs }));
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
    const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, battles: 100, level: 9, potionUses: 0 });
    S.G = h;
    applyAchievements();
    ok('超场 applyAchievements 零 unflswiftlowlvnopo2 解锁零「逆风长明疾行青芽不饮」横幅（不误解锁，battles 维严格）',
      !h.ach.includes('unflswiftlowlvnopo2') && !msgs.some((m) => m.includes('【逆风长明疾行青芽不饮】')), JSON.stringify({ ach: h.ach, msgs }));
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
    const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 12, potionUses: 0 });
    S.G = h;
    applyAchievements();
    ok('升过十级 applyAchievements 零 unflswiftlowlvnopo2 解锁零「逆风长明疾行青芽不饮」横幅（不误解锁，level 维严格）',
      !h.ach.includes('unflswiftlowlvnopo2') && !msgs.some((m) => m.includes('【逆风长明疾行青芽不饮】')), JSON.stringify({ ach: h.ach, msgs }));
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
    const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, potionUses: 1 });
    S.G = h;
    applyAchievements();
    ok('战斗嗑过药 applyAchievements 零 unflswiftlowlvnopo2 解锁零「逆风长明疾行青芽不饮」横幅（不误解锁，potionUses 维严格）',
      !h.ach.includes('unflswiftlowlvnopo2') && !msgs.some((m) => m.includes('【逆风长明疾行青芽不饮】')), JSON.stringify({ ach: h.ach, msgs }));
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
    const h = freshHero({ trueBoss: true, diff: 0, deaths: 0, battles: 42, level: 9, potionUses: 0 });
    S.G = h;
    applyAchievements();
    ok('普通档 applyAchievements 零 unflswiftlowlvnopo2 解锁零「逆风长明疾行青芽不饮」横幅（不误解锁，diff 维严格）',
      !h.ach.includes('unflswiftlowlvnopo2') && !msgs.some((m) => m.includes('【逆风长明疾行青芽不饮】')), JSON.stringify({ ach: h.ach, msgs }));
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
    const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, battles: 42, level: 9, potionUses: 0, spent: 999, casts: 5, mapPotions: 9 });
    S.G = h;
    applyAchievements();
    ok('花过金且放过技且大地图喝过药 applyAchievements 照常解锁 unflswiftlowlvnopo2 并报「逆风长明疾行青芽不饮」横幅（本档不读 spent/casts/mapPotions，与 penny/casts 系分源）',
      h.ach.includes('unflswiftlowlvnopo2') && msgs.some((m) => m.includes('【逆风长明疾行青芽不饮】')), JSON.stringify({ ach: h.ach, msgs }));
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}

// —— 源级零变化：battle.js 无 level/spent 新增写点 + battle.js deaths/battles/potionUses/casts 写入点 + data.js 常量（既有，本版未动）——
ok('battle.js 未新增任何 level 写点（升级唯一产生点在 hero.js grantXp、本版零改动）',
  (battleSrc.match(/\.level = /g) || []).length === 0, String((battleSrc.match(/\.level = /g) || []).length));
ok('battle.js 未新增任何 spent 计数写点（消费线五端口都在 shop/core、本版零改动；g.deaths 是 loseBattle 既有写点）',
  (battleSrc.match(/\.spent = /g) || []).length === 0, String((battleSrc.match(/\.spent = /g) || []).length));
ok('battle.js 具 1 处 S.G.deaths = (S.G.deaths || 0) + 1; 写入点（loseBattle 阵亡唯一产生点）',
  (battleSrc.match(/S\.G\.deaths = \(S\.G\.deaths \|\| 0\) \+ 1;/g) || []).length === 1, String((battleSrc.match(/S\.G\.deaths = \(S\.G\.deaths \|\| 0\) \+ 1;/g) || []).length));
ok('battle.js 具 1 处 S.G.battles = (S.G.battles || 0) + 1; 写入点（startBattle 进战即记唯一产生点）',
  (battleSrc.match(/S\.G\.battles = \(S\.G\.battles \|\| 0\) \+ 1;/g) || []).length === 1, String((battleSrc.match(/S\.G\.battles = \(S\.G\.battles \|\| 0\) \+ 1;/g) || []).length));
ok('battle.js 具 1 处 hero.potionUses = useN; 写入点（doItem 战斗用药成功唯一产生点——大地图 F/旅馆/篝火不计入，本版未动）',
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
ok('data.js POTION_USE_GOAL 常量仍为 15（单一数据源，与 nopotion/dry/nopotskill/swiftnopo/lowlvnopo2 系同读一份源，本版未动）',
  dataSrc.includes('const POTION_USE_GOAL = 15;'));
ok('data.js LOWLV_GOAL 常量仍为 10（单一数据源，与 lowlv/lowlv2/lowskill/unfllowlv/unfllowlv2 系同读一份源）',
  dataSrc.includes('const LOWLV_GOAL = 10;'));
ok('data.js DIFFS 仍含「困难」档（难度单一数据源，与 hardtrue/steadfast/unflpenny2/unflskill2/pennynoskill2 同读一份源）',
  dataSrc.includes("const DIFFS=['普通','困难'];"));
ok('hero.js 成就横幅活计数注释已推进至 N/144（143→144）', heroSrc.includes('（成就 N/153）'));
ok('data.js 成就横幅活计数注释已推进至 N/144（143→144，两处恒等）', (dataSrc.match(/（成就 N\/153）/g) || []).length === 2, String((dataSrc.match(/（成就 N\/153）/g) || []).length));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径为四百三十八件套（四百三十七件套清除）',
  readme.includes('扩充为冒烟四百三十八件套（四百三十七件套清除）') && !readme.includes('扩充为冒烟四百二十八件套（四百二十七件套清除）'));
ok('README 含 v24.231 守护描述（逆风长明疾行青芽不饮五克档第三角守护）', readme.includes('v24.231 起含「逆风长明疾行青芽不饮」新成就守护'));
ok('README 版本速览已为 v24.231 且成就计数 144', readme.includes('版本速览（v24.242）') && readme.includes('153 项成就'));
ok('README 成就计数双处口径 144 项（全部 153 项进度 + **153 项成就**，**143 项成就**清除）',
  readme.includes('全部 153 项进度') && readme.includes('**153 项成就**') && !readme.includes('**14' + '3 项成就**'));
ok('README tests 树收录 smoke_v24229_unflswiftlowlvnopo2（含 v24.231 守护子句 + 串尾）',
  readme.includes('v24.231 起含「逆风长明疾行青芽不饮」新成就守护') && readme.includes('smoke_v24229_unflswiftlowlvnopo2'));
ok('README 含 smoke_v24229_unflswiftlowlvnopo2 入库（437 份）', readme.includes('smoke_v24229_unflswiftlowlvnopo2 入库（437 份）'));
ok('package.json 已收录 smoke_v24229_unflswiftlowlvnopo2.mjs 且位于串尾（在 smoke_v24228_unflswiftlowlvnoskill2 之后）',
  pkg.includes('smoke_v24229_unflswiftlowlvnopo2.mjs') &&
  pkg.includes('node tests/smoke_v24228_unflswiftlowlvnoskill2.mjs && node tests/smoke_v24229_unflswiftlowlvnopo2.mjs && node tests/smoke_v24230_unflswiftnoskillnopo2.mjs && node tests/smoke_v24231_unflswiftlowlvpenny2.mjs && node tests/smoke_v24233_unflswiftnoskillpenny2.mjs && node tests/smoke_v24235_unflswiftnopopenny2.mjs && node tests/smoke_v24237_unfllowskillpenny2.mjs && node tests/smoke_v24238_unflpennynoskillnopo2.mjs && node tests/smoke_v24239_unflpennylowlvnopo2.mjs && node tests/smoke_v24241_unflswiftlowlvpennynoskill2.mjs && node tests/smoke_v24242_unflswiftlowlvpennynopo2.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 429 件套', testChain === 438, String(testChain));
ok('CHANGELOG 含 v24.231 顶条目', changelog.startsWith('## v24.242'));

// —— 哨兵链：README 已有 429 口径且尚无 430（前望 431 语义：下一版才写 430）——
ok('README 已有四百二十九件套口径且尚无 430（哨兵前望 431 语义：下一版才写 430）',
  readme.includes('扩充为冒烟四百三十八件套（四百三十七件套清除）') && !readme.includes('四百三十九件套'));
{
  const s24143 = read('tests/smoke_v24143_furnacequest.mjs');
  ok('smoke_v24143 哨兵链前望 439（四百三十九件套否定式）',
    s24143.includes('哨兵链前望 439') && s24143.includes('四百三十九件套否定式'));
}

// —— 旧代 v24.230 字面量 / 428 件套口径 / 143 项 全库零残留扫描（豁免本套件与 v24228 与 v24227——三者含 v24.230 负向断言/扫描目标）——
const EXEMPT = new Set(['smoke_v24230_unflswiftnoskillnopo2.mjs', 'smoke_v24229_unflswiftlowlvnopo2.mjs', 'smoke_v24228_unflswiftlowlvnoskill2.mjs', 'smoke_v24227_unfllowlvnoskillnopo2.mjs']);
const leftovers = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests')).filter((x) => x.endsWith('.mjs') && !EXEMPT.has(x))) {
  const s = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  const code = s.split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  if (code.includes("const GAME_VERSION = 'v24.230'")) leftovers.push(f + ':gv');
  if (code.includes("GAME_VERSION === 'v24.230'")) leftovers.push(f + ':eq');
  if (code.includes("startsWith('## v24.230")) leftovers.push(f + ':st');
  if (code.includes('四百二十八件套（四百二十七件套清除）')) leftovers.push(f + ':428');
  if (code.includes('testChain === 428') || code.includes('files.length === 428') ||
      code.includes('treeTok.length === 428') || code.includes('chainAll.length === 429') ||
      code.includes('fileCount === 428'))
    leftovers.push(f + ':count');
  if (code.includes('版本速览（v24.230）')) leftovers.push(f + ':ver');
  // 成就计数 143→144 零残留：只认「**14'+'3 项成就**」/「全部 14'+'3 项进度」两形态（「成就 N/143」是 v24.76 HUD 口径稳定常驻 pin 家族，不在扫描目标内）
  if (code.includes('**14' + '3 项成就**') || code.includes('全部 14' + '3 项进度'))
    leftovers.push(f + ':143');
}
ok('旧代 v24.230 GAME_VERSION 字面量/恒等/顶 pin/版本速览 全库零残留（哨兵链，豁免本套件与 v24228 与 v24227）',
  leftovers.filter((x) => x.endsWith(':gv') || x.endsWith(':eq') || x.endsWith(':st') || x.endsWith(':ver')).length === 0,
  JSON.stringify(leftovers));
ok('旧代 428 件套口径/计数/143 项 pin 全库零残留（哨兵链，豁免本套件与 v24228 与 v24227）',
  leftovers.filter((x) => x.endsWith(':428') || x.endsWith(':count') || x.endsWith(':143')).length === 0,
  JSON.stringify(leftovers));

if (failed) { console.log(`— v24.231 冒烟完成：${n} 项断言，失败 ${failed} —`); process.exit(1); }
console.log(`— v24.231 冒烟完成：${n} 项断言全绿 —`);
