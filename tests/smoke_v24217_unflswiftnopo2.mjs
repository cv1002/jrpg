// smoke_v24217_unflswiftnopo2.mjs —— v24.217 专项冒烟：新成就「逆风长明疾行不饮」（挑战向·「困难×长明×不饮」四重克制维度首角·困难模式×零阵亡×七十场战斗内×未在战斗中使用药水/灵药）
// （新内容·单成就·第一百三十二项——承 v24.177 逆风长明（unflswift2，「困难×长明」三克制首角·困难×零阵亡×七十场内）/
// v24.179 逆风未饮（unflnopo2，「困难×不饮」三克制首角·困难×零阵亡×零战斗用药）/ v24.190 逆风不饮疾行（swiftnopo2，「困难×疾行」第三角·困难×七十场内×零战斗用药）先例：
// 本枚把 unflswift2/unflnopo2/swiftnopo2 三枚三克档的严格公共交集——「既零阵亡、又七十场内、又零战斗用药且困难通关」——收为一枚，开垦「hardtrue×不饮」四重克制
// 维度首角（deaths×{swift,nopotion} 两两交叉在四维层次的唯一纪念，与三枚三克档二维以上分源：死过一次、超场或战斗里喝过一口药即永久无缘此档）。
// 判定读既有 hero.trueBoss（终焉之神=真结局最终 Boss，与 trueboss/hardtrue/unflicker/swift/unflswift/unflnopo/unflswift2/unflnopo2/swiftnopo2 同源）、
// 既有 hero.diff（DIFFS 下标：建档 createDiff 写定、`(g.diff===1)` 即 DIFFS[1]「困难」档）、既有 hero.deaths（battle.loseBattle 全游唯一产生点——
// 只增不减、防御式 (g.deaths||0) 旧档零迁移，与 unflicker/steadfast/unflskill/unflswift/unfllowlv/unflnopo/unflpenny/unflswift2/unflpenny2/unflnopo2/
// unflskill2/unfllowlv2 系同读一份源）、既有 hero.battles（battle.startBattle 进战即记唯一产生点——胜/败/逃都算、只增不减、防御式 (g.battles||0)
// 旧档零迁移，与 swift/unflswift/unflswift2/swiftlv2 系同读一份源）、既有 hero.potionUses（battle.doItem 战斗用药成功唯一产生点——只增不减、防御式
// (g.potionUses||0) 旧档零迁移，与 nopotion/swiftnopo/lowlvnopo/unflnopo/unflnopo2/swiftnopo2 系同读一份源；大地图 F 喝药/旅馆/篝火不计入），
// (g.trueBoss && g.diff===1 && !(g.deaths||0) && (g.battles||0)<=SPEED_GOAL && !(g.potionUses||0)) 即「困难 · 零阵亡 · 七十场内 · 零战斗用药通关」达成——
// diff/deaths/battles/potionUses 四端口都只增不减，换过难度、死过一次、超场或战斗里喝过一口药就永久无缘此档（与 hardtrue 换难度 / unflicker 阵亡 / swift 超场 /
// nopotion 喝药 同属「重新来过才拿得到」的挑战品类）；是 hardtrue、unflicker（零阵亡）、swift、nopotion 四枚的严格交叠——困难零阵亡七十场内零战斗用药通关必同时
// 满足三者（也必满足 unflswift2 与 unflnopo2 与 swiftnopo2 三枚三克档），本枚是这一四重交叉区「困难×不饮」维度首角；与既有正向里程碑 battles「身经百战」
// （BATTLE_GOAL 100 场）成镜面对、互不重叠。可行性：困难档魔物全面加强下零阵亡且七十场红线内不喝战斗药（药水/灵药全留给大地图 F/旅馆/篝火，靠防御/蓄力/汲光击边打边回）
// 通关，吃满「别自降难度 + 别死 + 别拖沓 + 别喝奶」四克制的一场逆风长明疾行不饮。
// 零新计数零新状态零新写点零新存档（trueBoss/diff/deaths/battles/potionUses 皆既有字段）、无 r 无 prog 纯里程碑（与 hardtrue/unflicker/swift/
// nopotion/unflswift/unflnopo/unflswift2/unflnopo2 同款——困难里不拖沓又不死又不喝奶本身就是奖励、硬核才是）、解锁走 winBattle → applyAchievements
// 既有通路（终焉之神击败当场 trueBoss 落账后 applyAchievements 枚举即解锁，零新增依赖），反馈不迟到。
// 本冒烟守护：版本锚点（格式合法 + 已越过 v24.214 + data.js 字面量 v24.217 + 旧 v24.216 字面量零残留）、
// ACH_LIST 132 项精确与末尾序位（unflswiftnopo2 落位 131——前 131 项 id/序位零回归）、unflswiftnopo2 数据契约（d 文案、ok 防御式逐值、
// 无 r 无 prog 且与 battles 正向里程碑镜面对、四克制必同时满足 hardtrue/unflicker/swift/nopotion 且满足 unflswift2/unflnopo2/swiftnopo2 三枚三克档）、
// unlockedAchievements/applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等去重 / 换难度不解锁 / 死过一次不解锁 / 超场不解锁 /
// 战斗喝过药不解锁 / 未通关不解锁）、既有 131 成就 id 零回归、battle.js 无 spent 新增写点与 deaths/battles/potionUses 写入点与 data.js SPEED_GOAL/LOWLV_GOAL/
// BATTLE_GOAL/DIFFS 常量源级零变化、README/package.json/CHANGELOG 同步（件套口径 417 + v24.217 守护描述 + 入库 417 + 版本速览 132 项 +
// tests 树串尾 + package 串尾 416→417）、哨兵链（前望 418 且 README 尚无 418 口径）、旧代 v24.216 字面量/恒等/顶 pin/416 口径/131 项全库零残留扫描
// （豁免本套件——本套件含 v24.216 负向断言）。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, SPEED_GOAL, LOWLV_GOAL, BATTLE_GOAL } from '../js/data.js';
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
console.log('— v24.217 挑战向·「困难×长明×不饮」四重克制维度首角成就「逆风长明疾行不饮」（困难×零阵亡×七十场内×零战斗用药） 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dataSrc = read('js/data.js');
const battleSrc = read('js/battle.js');
const heroSrc = read('js/hero.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');
// —— 版本锚点（格式合法 + 已越过 v24.214 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.214', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 214)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.217（旧 v24.216 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v24.254';") && !dataSrc.includes("const GAME_VERSION = 'v24.216';"));
ok('data.js 含 v24.217 注释（逆风长明疾行不饮新成就说明）',
  dataSrc.includes('v24.217 新内容·新成就（第一百三十二项）'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'unflswiftnopo2');
ok('ACH_LIST 含 unflswiftnopo2「逆风长明疾行不饮」且 id 唯一',
  !!ach && ach.name === '逆风长明疾行不饮' && ACH_LIST.filter((a) => a.id === 'unflswiftnopo2').length === 1);
ok('ACH_LIST 精确总数 132 项（131→132 末尾追加）', ACH_LIST.length === 162, String(ACH_LIST.length));
ok('unflswiftnopo2 描述文案（困难零阵亡七十场内零战斗用药真结局四克档）',
  ach.d === `以困难模式、零阵亡、${SPEED_GOAL} 场战斗内且未在战斗中使用药水/灵药时击败终焉之神（真结局）`, ach.d);
ok('unflswiftnopo2 判定源级（读既有 g.trueBoss / g.diff===1 / !(g.deaths||0) / (g.battles||0)<=SPEED_GOAL / !(g.potionUses||0)，不含 spent/casts/level）',
  String(ach.ok).includes('g.trueBoss') && String(ach.ok).includes('g.diff===1') && String(ach.ok).includes('g.deaths') && String(ach.ok).includes('g.battles') && String(ach.ok).includes('g.potionUses') && !String(ach.ok).includes('g.spent') && !String(ach.ok).includes('g.casts') && !String(ach.ok).includes('g.level'));
ok('unflswiftnopo2 无 r 无 prog 纯里程碑（与 hardtrue/unflicker/swift/nopotion/unflswift2/unflnopo2/swiftnopo2 同款）',
  !('r' in ach) && !('prog' in ach));

// —— ok 防御式逐值 ——
ok('困难 + 零阵亡 + 七十场内 + 零战斗用药 + 真结局 → 解锁', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 70, potionUses: 0 }) === true);
ok('困难 + 零阵亡 + 真结局 + 缺 deaths/battles/potionUses 字段 → (g.deaths||0)=0 按零阵亡解码、(g.battles||0)=0 按七十场内解码、(g.potionUses||0)=0 按零战斗用药解码解锁（旧档零迁移）', ach.ok({ trueBoss: true, diff: 1 }) === true);
ok('缺 diff 字段（普通档）+ 零阵亡 + 七十场内 + 零战斗用药 → 不解锁（diff 维严格）', ach.ok({ trueBoss: true, deaths: 0, battles: 70, potionUses: 0 }) === false);
ok('困难 + 死过一次（deaths 1）+ 七十场内 + 零战斗用药 → 不解锁（阵亡即永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, deaths: 1, battles: 70, potionUses: 0 }) === false);
ok('困难 + 零阵亡 + 超场（battles 71）+ 零战斗用药 → 不解锁（超场即永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 71, potionUses: 0 }) === false);
ok('困难 + 零阵亡 + 七十场内 + 战斗喝过药（potionUses 1）→ 不解锁（战斗用药即永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 70, potionUses: 1 }) === false);
ok('困难 + 零阵亡 + 七十场内 + 零战斗用药但未通关 → 不解锁', ach.ok({ diff: 1, deaths: 0, battles: 70, potionUses: 0 }) === false);
ok('空档/缺字段 → 不解锁（(g.deaths||0)/(g.battles||0)/(g.potionUses||0)/diff 防御式零迁移）', ach.ok({}) === false);
ok('困难 + 零阵亡 + 七十场内 + 零战斗用药 + 花过金（spent 1）→ 照常解锁（本档不读 spent，与 penny 系分源）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 70, potionUses: 0, spent: 1 }) === true);
ok('困难 + 零阵亡 + 七十场内 + 零战斗用药 + 放过技（casts 1）→ 照常解锁（本档不读 casts，与 noskill 系分源）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 70, potionUses: 0, casts: 1 }) === true);
ok('困难 + 零阵亡 + 七十场内 + 零战斗用药 + 升过十级（level 12）→ 照常解锁（本档不读 level，与 lowlv 系分源——升过级不碍此档）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 70, potionUses: 0, level: 12 }) === true);

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
  'swiftlowlvnopo2', 'swiftnoskillnopo2', 'pennyswiftlv2', 'pennyswiftskill2', 'pennyswiftnopo2', 'unflswiftlowlv2'];
ok('既有 131 成就 id 零回归（核心抽样全覆盖末期正位）',
  EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('unflswiftnopo2 落位 index 131（末尾追加，既有 0..130 序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'unflswiftnopo2') === 131 &&
  ACH_LIST.findIndex((a) => a.id === 'unflswiftlowlv2') === 130 &&
  ACH_LIST.findIndex((a) => a.id === 'swiftlowskillnopo2') === 129);

// —— 既有挑战向家族对照（三枚三克档源互不干扰）——
const _a = (id) => ACH_LIST.find((x) => x.id === id);
ok('困难×零阵亡×七十场内×零战斗用药四克档必同时满足 unflswift2 与 unflnopo2 与 swiftnopo2 三枚三克档（本枚是其四重交叉区唯一纪念——deaths/battles/potionUses 三源同判）',
  _a('unflswift2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 70, potionUses: 0 }) === true &&
  _a('unflnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 70, potionUses: 0 }) === true &&
  _a('swiftnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 70, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 70, potionUses: 0 }) === true);
ok('三克档互检：unflswift2 不读 potionUses（战斗喝过药照亮 unflswift2 但照灭本枚）/ unflnopo2 不读 battles（超场照亮 unflnopo2 但照灭本枚）/ swiftnopo2 不读 deaths（死过一次照亮 swiftnopo2 但照灭本枚）',
  _a('unflswift2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 70, potionUses: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 70, potionUses: 1 }) === false &&
  _a('unflnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 71, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 71, potionUses: 0 }) === false &&
  _a('swiftnopo2').ok({ trueBoss: true, diff: 1, deaths: 1, battles: 70, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 1, battles: 70, potionUses: 0 }) === false);
ok('换过难度（diff 0）→ 本枚与三枚三克档同不解锁（diff 严格分区——普通档 deaths/swift/nopotion 单克档如 unflicker/swift/nopotion 不读本枚）',
  _a('unflswift2').ok({ trueBoss: true, diff: 0, deaths: 0, battles: 70 }) === false &&
  _a('unflnopo2').ok({ trueBoss: true, diff: 0, deaths: 0, potionUses: 0 }) === false &&
  _a('swiftnopo2').ok({ trueBoss: true, diff: 0, battles: 70, potionUses: 0 }) === false &&
  _a('unflicker').ok({ trueBoss: true, deaths: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 0, deaths: 0, battles: 70, potionUses: 0 }) === false);
ok('与四克档 unflswiftlowlv2（v24.214）互不干扰——unflswiftlowlv2 读 level 不读 potionUses、本枚读 potionUses 不读 level：战斗喝过药照灭本枚但照亮 unflswiftlowlv2，升过十级照灭 unflswiftlowlv2 但照亮本枚',
  _a('unflswiftlowlv2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 70, level: 9, potionUses: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 70, level: 9, potionUses: 1 }) === false &&
  _a('unflswiftlowlv2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 70, level: 12, potionUses: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 70, level: 12, potionUses: 0 }) === true);
ok('与 pennyswiftnopo2（v24.211）互不干扰——pennyswiftnopo2 读 spent 不读 deaths、本枚读 deaths 不读 spent：死过一次照灭本枚但照亮 pennyswiftnopo2，花过金照灭 pennyswiftnopo2 但照亮本枚',
  _a('pennyswiftnopo2').ok({ trueBoss: true, diff: 1, deaths: 1, spent: 0, battles: 70, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 1, spent: 0, battles: 70, potionUses: 0 }) === false &&
  _a('pennyswiftnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, spent: 1, battles: 70, potionUses: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 1, battles: 70, potionUses: 0 }) === true);
ok('battles 身经百战 正向里程碑档不解锁本枚（累计遭遇里程碑各自解锁自己的正向里程碑，本枚只认困难零阵亡七十场内零战斗用药通关）',
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 100, potionUses: 0 }) === false && _a('battles').ok({ battles: 100 }) === true);

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
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, battles: 70, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 困难零阵亡七十场内零战斗用药真结局档 newly 含 unflswiftnopo2（既有通路自动跟随）',
    newly.includes('unflswiftnopo2'), JSON.stringify(newly));
  ok('unlockedAchievements 同档 newly 含三枚三克档 unflswift2/unflnopo2/swiftnopo2（子集自动跟随）',
    newly.includes('unflswift2') && newly.includes('unflnopo2') && newly.includes('swiftnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 0, deaths: 0, battles: 70, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 普通档 newly 不含 unflswiftnopo2（不误解锁，diff 维严格）',
    !newly.includes('unflswiftnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 1, battles: 70, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 死过一次档 newly 不含 unflswiftnopo2（不误解锁，deaths 维严格）',
    !newly.includes('unflswiftnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, battles: 71, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 超场档 newly 不含 unflswiftnopo2（不误解锁，battles 维严格）',
    !newly.includes('unflswiftnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, battles: 70, potionUses: 1 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 战斗喝过药档 newly 不含 unflswiftnopo2（不误解锁，potionUses 维严格）',
    !newly.includes('unflswiftnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ diff: 1, deaths: 0, battles: 70, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 未通关档 newly 不含 unflswiftnopo2（不误解锁）',
    !newly.includes('unflswiftnopo2'), JSON.stringify(newly));
}

// —— applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等）——
{
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, battles: 70, potionUses: 0 });
    S.G = h;
    applyAchievements();
    ok('applyAchievements 真实解锁落 hero.ach（含 unflswiftnopo2）', h.ach.includes('unflswiftnopo2'), JSON.stringify(h.ach));
    ok('解锁横幅报成就名【逆风长明疾行不饮】', msgs.some((m) => m.includes('🔓 成就解锁：') && m.includes('逆风长明疾行不饮')), msgs.join(' | '));
    const len1 = msgs.length;
    applyAchievements();
    ok('幂等：重复调用不再报（已解锁去重）', msgs.length === len1 && msgs.filter((m) => m.includes('【逆风长明疾行不饮】')).length === 1, String(msgs.length));
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
    const h = freshHero({ trueBoss: true, diff: 1, deaths: 1, battles: 70, potionUses: 0 });
    S.G = h;
    applyAchievements();
    ok('死过一次 applyAchievements 零 unflswiftnopo2 解锁零「逆风长明疾行不饮」横幅（不误解锁，deaths 维严格）',
      !h.ach.includes('unflswiftnopo2') && !msgs.some((m) => m.includes('逆风长明疾行不饮')), JSON.stringify({ ach: h.ach, msgs }));
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
    const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, battles: 70, potionUses: 1 });
    S.G = h;
    applyAchievements();
    ok('战斗喝过药 applyAchievements 零 unflswiftnopo2 解锁零「逆风长明疾行不饮」横幅（不误解锁，potionUses 维严格）',
      !h.ach.includes('unflswiftnopo2') && !msgs.some((m) => m.includes('逆风长明疾行不饮')), JSON.stringify({ ach: h.ach, msgs }));
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}

// —— 源级零变化：battle.js 无 spent 新增写点 + battle.js deaths/battles/potionUses 写入点 + data.js 常量（既有，本版未动）——
ok('battle.js 未新增任何 spent 计数写点（消费线五端口都在 core/shop、本版零改动；g.deaths 是 loseBattle 既有写点）',
  (battleSrc.match(/\.spent = /g) || []).length === 0, String((battleSrc.match(/\.spent = /g) || []).length));
ok('battle.js 具 1 处 S.G.deaths = (S.G.deaths || 0) + 1; 写入点（loseBattle 阵亡唯一产生点）',
  (battleSrc.match(/S\.G\.deaths = \(S\.G\.deaths \|\| 0\) \+ 1;/g) || []).length === 1, String((battleSrc.match(/S\.G\.deaths = \(S\.G\.deaths \|\| 0\) \+ 1;/g) || []).length));
ok('battle.js 具 1 处 S.G.battles = (S.G.battles || 0) + 1; 写入点（startBattle 进战即记唯一产生点）',
  (battleSrc.match(/S\.G\.battles = \(S\.G\.battles \|\| 0\) \+ 1;/g) || []).length === 1, String((battleSrc.match(/S\.G\.battles = \(S\.G\.battles \|\| 0\) \+ 1;/g) || []).length));
ok('battle.js 具 1 处 hero.potionUses = useN; 写入点（doItem 战斗用药成功唯一产生点）',
  (battleSrc.match(/hero\.potionUses = useN;/g) || []).length === 1, String((battleSrc.match(/hero\.potionUses = useN;/g) || []).length));
ok('data.js SPEED_GOAL 常量仍为 70（单一数据源，与 swift/swift2/unflswift/unflswift2/swiftnopo2 系同读一份源）',
  dataSrc.includes('const SPEED_GOAL = 70;'));
ok('data.js LOWLV_GOAL 常量仍为 10（低等级里程碑唯一数据源，与 lowlv/lowlv2/unfllowlv/unfllowlv2/swiftlv2 系同读一份源）',
  dataSrc.includes('const LOWLV_GOAL = 10;'));
ok('data.js BATTLE_GOAL 常量仍为 100（遭遇线里程碑唯一数据源，与 battles「身经百战」系同读一份源）',
  dataSrc.includes('const BATTLE_GOAL = 100;'));
ok('data.js DIFFS 仍含「困难」档（难度单一数据源，与 hardtrue/steadfast/unflswift2/unflnopo2 同读一份源）',
  dataSrc.includes("const DIFFS=['普通','困难'];"));
ok('hero.js 成就横幅活计数注释已推进至 N/132（131→132）', heroSrc.includes('（成就 N/162）'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径为四百四十七件套（四百四十六件套清除）',
  readme.includes('扩充为冒烟四百四十七件套（四百四十六件套清除）') && !readme.includes('扩充为冒烟四百一十六件套（四百一十五件套清除）'));
ok('README 含 v24.217 守护描述（逆风长明疾行不饮新成就守护）', readme.includes('v24.217 起含「逆风长明疾行不饮」新成就守护'));
ok('README 版本速览已为 v24.217 且成就计数 132', readme.includes('版本速览（v24.254）') && readme.includes('162 项成就'));
ok('README 成就计数双处口径 132 项（全部 162 项进度 + **162 项成就**，**131 项成就**清除）',
  readme.includes('全部 162 项进度') && readme.includes('**162 项成就**') && !readme.includes('**13' + '1 项成就**'));
ok('README tests 树收录 smoke_v24217_unflswiftnopo2（含 v24.217 守护子句 + 串尾）',
  readme.includes('v24.217 起含「逆风长明疾行不饮」新成就守护') && readme.includes('smoke_v24217_unflswiftnopo2'));
ok('README 含 smoke_v24217_unflswiftnopo2 入库（437 份）', readme.includes('smoke_v24217_unflswiftnopo2 入库（437 份）'));
ok('package.json 已收录 smoke_v24217_unflswiftnopo2.mjs 且位于串尾（在 smoke_v24214_unflswiftlowlv2 之后）',
  pkg.includes('smoke_v24217_unflswiftnopo2.mjs') &&
  pkg.includes('node tests/smoke_v24214_unflswiftlowlv2.mjs && node tests/smoke_v24217_unflswiftnopo2.mjs && node tests/smoke_v24218_unflpennyswift2.mjs && node tests/smoke_v24219_unflpennylowlv2.mjs && node tests/smoke_v24220_unflpennynopo2.mjs && node tests/smoke_v24221_unfllowskill2.mjs && node tests/smoke_v24222_unflswiftskill2.mjs && node tests/smoke_v24223_unfllowlvnopo2.mjs && node tests/smoke_v24224_unflnoskillnopo2.mjs && node tests/smoke_v24225_unflpennynoskill2.mjs && node tests/smoke_v24226_unflpennylownoskillnopo2.mjs && node tests/smoke_v24227_unfllowlvnoskillnopo2.mjs && node tests/smoke_v24228_unflswiftlowlvnoskill2.mjs && node tests/smoke_v24229_unflswiftlowlvnopo2.mjs && node tests/smoke_v24230_unflswiftnoskillnopo2.mjs && node tests/smoke_v24231_unflswiftlowlvpenny2.mjs && node tests/smoke_v24233_unflswiftnoskillpenny2.mjs && node tests/smoke_v24235_unflswiftnopopenny2.mjs && node tests/smoke_v24237_unfllowskillpenny2.mjs && node tests/smoke_v24238_unflpennynoskillnopo2.mjs && node tests/smoke_v24239_unflpennylowlvnopo2.mjs && node tests/smoke_v24241_unflswiftlowlvpennynoskill2.mjs && node tests/smoke_v24242_unflswiftlowlvpennynopo2.mjs && node tests/smoke_v24243_unflswiftlowlvnoskillnopo2.mjs && node tests/smoke_v24244_unflswiftpennynoskillnopo2.mjs && node tests/smoke_v24245_unflswiftlowlvpennynoskillnopo2.mjs && node tests/smoke_v24246_unfltravel2.mjs && node tests/smoke_v24247_unfltravelswift2.mjs && node tests/smoke_v24248_unfltravellowlv2.mjs && node tests/smoke_v24249_unfltravelpenny2.mjs && node tests/smoke_v24250_unfltravelnoskill2.mjs && node tests/smoke_v24251_unfltravelnopo2.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 417 件套', testChain === 447, String(testChain));
ok('CHANGELOG 含 v24.217 顶条目', changelog.startsWith('## v24.254'));

// —— 哨兵链：README 已有 417 口径且尚无 418（前望 418 语义：下一版才写 418）——
ok('README 已有四百一十七件套口径且尚无 418（哨兵前望 418 语义：下一版才写 418）',
  readme.includes('扩充为冒烟四百四十七件套（四百四十六件套清除）') && !readme.includes('四百四十八件套'));
{
  const s24143 = read('tests/smoke_v24143_furnacequest.mjs');
  ok('smoke_v24143 哨兵链前望 448（四百四十八件套否定式）',
    s24143.includes('哨兵链前望 448') && s24143.includes('四百四十八件套否定式'));
}

// —— 旧代 v24.216 字面量 / 416 件套口径 / 131 项 全库零残留扫描（豁免本套件——本套件含 v24.216 负向断言）——
const EXEMPT = new Set(['smoke_v24251_unfltravelnopo2.mjs', 'smoke_v24250_unfltravelnoskill2.mjs', 'smoke_v24249_unfltravelpenny2.mjs', 'smoke_v24248_unfltravellowlv2.mjs', 'smoke_v24247_unfltravelswift2.mjs', 'smoke_v24246_unfltravel2.mjs', 'smoke_v24245_unflswiftlowlvpennynoskillnopo2.mjs', 'smoke_v24217_unflswiftnopo2.mjs']);
const leftovers = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests')).filter((x) => x.endsWith('.mjs') && !EXEMPT.has(x))) {
  const s = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  const code = s.split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  if (code.includes("const GAME_VERSION = 'v24.216'")) leftovers.push(f + ':gv');
  if (code.includes("GAME_VERSION === 'v24.216'")) leftovers.push(f + ':eq');
  if (code.includes("startsWith('## v24.216")) leftovers.push(f + ':st');
  if (code.includes('四百一十六件套（四百一十五件套清除）')) leftovers.push(f + ':416');
  if (code.includes('testChain === 416') || code.includes('files.length === 416') ||
      code.includes('treeTok.length === 416') || code.includes('chainAll.length === 416') ||
      code.includes('fileCount === 416'))
    leftovers.push(f + ':count');
  if (code.includes('版本速览（v24.216）')) leftovers.push(f + ':ver');
  // 成就计数 131→132 零残留：只认「**13'+'1 项成就**」/「全部 13'+'1 项进度」两形态（「成就 N/131」是 v24.76 HUD 口径稳定常驻 pin 家族，不在扫描目标内）
  if (code.includes('**13' + '1 项成就**') || code.includes('全部 13' + '1 项进度'))
    leftovers.push(f + ':131');
}
ok('旧代 v24.216 GAME_VERSION 字面量/恒等/顶 pin/版本速览 全库零残留（哨兵链，豁免本套件）',
  leftovers.filter((x) => x.endsWith(':gv') || x.endsWith(':eq') || x.endsWith(':st') || x.endsWith(':ver')).length === 0,
  JSON.stringify(leftovers));
ok('旧代 416 件套口径/计数/131 项 pin 全库零残留（哨兵链，豁免本套件）',
  leftovers.filter((x) => x.endsWith(':416') || x.endsWith(':count') || x.endsWith(':131')).length === 0,
  JSON.stringify(leftovers));

if (failed) { console.log(`— v24.230 冒烟完成：${n} 项断言，失败 ${failed} —`); process.exit(1); }
console.log(`— v24.230 冒烟完成：${n} 项断言，失败 0 —`);
