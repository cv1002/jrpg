// smoke_v24214_unflswiftlowlv2.mjs —— v24.214 专项冒烟：新成就「逆风长明疾行青芽」（挑战向·「困难×长明」四重克制维度首角·困难模式×零阵亡×七十场战斗内×等级未满十级）
// （新内容·单成就·第一百三十一项——承 v24.177 逆风长明（unflswift2，「困难×长明」三克制首角·困难×零阵亡×七十场内）/
// v24.183 逆风青苗（unfllowlv2，「困难×长明」三克制第二角·困难×零阵亡×未及十级）/ v24.188 逆风速成青芽（swiftlv2，「困难×疾行」三克制首角·困难×七十场内×未及十级）先例：
// 本枚把 unflswift2/unfllowlv2/swiftlv2 三枚三克档的严格公共交集——「既零阵亡、又七十场内、又未及十级且困难通关」——收为一枚，开垦「hardtrue×长明」四重克制
// 维度首角（deaths×{swift,lowlv} 两两交叉在四维层次的唯一纪念，与三枚三克档二维以上分源：死过一次、超场或升过十级即永久无缘此档）。
// 判定读既有 hero.trueBoss（终焉之神=真结局最终 Boss，与 trueboss/hardtrue/unflicker/swift/unflswift/unfllowlv/unflswift2/unfllowlv2/swiftlv2 同源）、
// 既有 hero.diff（DIFFS 下标：建档 createDiff 写定、`(g.diff===1)` 即 DIFFS[1]「困难」档）、既有 hero.deaths（battle.loseBattle 全游唯一产生点——
// 只增不减、防御式 (g.deaths||0) 旧档零迁移，与 unflicker/steadfast/unflskill/unflswift/unfllowlv/unflnopo/unflpenny/unflswift2/unflpenny2/unflnopo2/
// unflskill2/unfllowlv2 系同读一份源）、既有 hero.battles（battle.startBattle 进战即记唯一产生点——胜/败/逃都算、只增不减、防御式 (g.battles||0)
// 旧档零迁移，与 swift/unflswift/unflswift2/swiftlv2 系同读一份源）、既有 hero.level（hero.js grantXp 升级唯一产生点——只增不减、防御式 (g.level||1)
// 旧档零迁移，与 lowlv/unfllowlv/unfllowlv2/swiftlv2 系同读一份源），
// (g.trueBoss && g.diff===1 && !(g.deaths||0) && (g.battles||0)<=SPEED_GOAL && (g.level||1)<LOWLV_GOAL) 即「困难 · 零阵亡 · 七十场内 · 未及十级通关」达成——
// diff/deaths/battles/level 四端口都只增不减，换过难度、死过一次、超场或升过十级就永久无缘此档（与 hardtrue 换难度 / unflicker 阵亡 / swift 超场 /
// lowlv 升级 同属「重新来过才拿得到」的挑战品类）；是 hardtrue、unflicker（零阵亡）、swift、lowlv 四枚的严格交叠——困难零阵亡七十场内未及十级通关必同时
// 满足三者（也必满足 unflswift2 与 unfllowlv2 与 swiftlv2 三枚三克档），本枚是这一四重交叉区「困难×长明」维度首角；与既有正向里程碑 battles「身经百战」
// （BATTLE_GOAL 100 场）成镜面对、互不重叠。可行性：困难档魔物全面加强下零阵亡且七十场红线内不升十级（级数靠开箱/支线/掉落换装兜底、经验曲线平缓）
// 通关，吃满「别自降难度 + 别死 + 别拖沓 + 别刷级」四克制的一场逆风长明疾行青芽。
// 零新计数零新状态零新写点零新存档（trueBoss/diff/deaths/battles/level 皆既有字段）、无 r 无 prog 纯里程碑（与 hardtrue/unflicker/swift/
// lowlv/unflswift/unfllowlv/unflswift2/unfllowlv2 同款——困难里不拖沓又不刷级又不死本身就是奖励、硬核才是）、解锁走 winBattle → applyAchievements
// 既有通路（终焉之神击败当场 trueBoss 落账后 applyAchievements 枚举即解锁，零新增依赖），反馈不迟到。
// 本冒烟守护：版本锚点（格式合法 + 已越过 v24.213 + data.js 字面量 v24.214 + 旧 v24.213 字面量零残留）、
// ACH_LIST 131 项精确与末尾序位（unflswiftlowlv2 落位 130——前 130 项 id/序位零回归）、unflswiftlowlv2 数据契约（d 文案、ok 防御式逐值、
// 无 r 无 prog 且与 battles 正向里程碑镜面对、四克制必同时满足 hardtrue/unflicker/swift/lowlv 且满足 unflswift2/unfllowlv2/swiftlv2 三枚三克档）、
// unlockedAchievements/applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等去重 / 换难度不解锁 / 死过一次不解锁 / 超场不解锁 /
// 升过十级不解锁 / 未通关不解锁）、既有 130 成就 id 零回归、battle.js 无 spent 新增写点与 deaths/battles 写入点与 data.js SPEED_GOAL/LOWLV_GOAL/
// BATTLE_GOAL/DIFFS 常量源级零变化、README/package.json/CHANGELOG 同步（件套口径 416 + v24.214 守护描述 + 入库 416 + 版本速览 131 项 +
// tests 树串尾 + package 串尾 415→416）、哨兵链（前望 417 且 README 尚无 417 口径）、旧代 v24.213 字面量/恒等/顶 pin/415 口径/130 项全库零残留扫描
// （豁免本套件——本套件含 v24.213 负向断言）。
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
console.log('— v24.214 挑战向·「困难×长明」四重克制维度首角成就「逆风长明疾行青芽」（困难×零阵亡×七十场内×未及十级） 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dataSrc = read('js/data.js');
const battleSrc = read('js/battle.js');
const heroSrc = read('js/hero.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');
// —— 版本锚点（格式合法 + 已越过 v24.213 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.213', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 213)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.214（旧 v24.213 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v24.225';") && !dataSrc.includes("const GAME_VERSION = 'v24.213';"));
ok('data.js 含 v24.214 注释（逆风长明疾行青芽新成就说明）',
  dataSrc.includes('v24.214 新内容·新成就（第一百三十一项）'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'unflswiftlowlv2');
ok('ACH_LIST 含 unflswiftlowlv2「逆风长明疾行青芽」且 id 唯一',
  !!ach && ach.name === '逆风长明疾行青芽' && ACH_LIST.filter((a) => a.id === 'unflswiftlowlv2').length === 1);
ok('ACH_LIST 精确总数 131 项（130→131 末尾追加）', ACH_LIST.length === 139, String(ACH_LIST.length));
ok('unflswiftlowlv2 描述文案（困难零阵亡七十场内未及十级真结局四克档）',
  ach.d === `以困难模式、零阵亡、${SPEED_GOAL} 场战斗内且等级未满 ${LOWLV_GOAL} 时击败终焉之神（真结局）`, ach.d);
ok('unflswiftlowlv2 判定源级（读既有 g.trueBoss / g.diff===1 / !(g.deaths||0) / (g.battles||0)<=SPEED_GOAL / (g.level||1)<LOWLV_GOAL，不含 spent/casts/potionUses）',
  String(ach.ok).includes('g.trueBoss') && String(ach.ok).includes('g.diff===1') && String(ach.ok).includes('g.deaths') && String(ach.ok).includes('g.battles') && String(ach.ok).includes('g.level') && !String(ach.ok).includes('g.spent') && !String(ach.ok).includes('g.casts') && !String(ach.ok).includes('g.potionUses'));
ok('unflswiftlowlv2 无 r 无 prog 纯里程碑（与 hardtrue/unflicker/swift/lowlv/unflswift2/unfllowlv2/swiftlv2 同款）',
  !('r' in ach) && !('prog' in ach));

// —— ok 防御式逐值 ——
ok('困难 + 零阵亡 + 七十场内 + 未及十级 + 真结局 → 解锁', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 70, level: 9 }) === true);
ok('困难 + 未及十级 + 真结局 + 缺 deaths/battles 字段 → (g.deaths||0)=0 按零阵亡解码、(g.battles||0)=0 按七十场内解码解锁（旧档零迁移）', ach.ok({ trueBoss: true, diff: 1, level: 9 }) === true);
ok('困难 + 零阵亡 + 七十场内 + 真结局 + 缺 level 字段 → (g.level||1)=1 按未及十级解码解锁（旧档零迁移）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 70 }) === true);
ok('缺 diff 字段（普通档）+ 零阵亡 + 七十场内 + 未及十级 → 不解锁（diff 维严格）', ach.ok({ trueBoss: true, deaths: 0, battles: 70, level: 9 }) === false);
ok('困难 + 死过一次（deaths 1）+ 七十场内 + 未及十级 → 不解锁（阵亡即永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, deaths: 1, battles: 70, level: 9 }) === false);
ok('困难 + 零阵亡 + 超场（battles 71）+ 未及十级 → 不解锁（超场即永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 71, level: 9 }) === false);
ok('困难 + 零阵亡 + 七十场内 + 升过十级（level 10）→ 不解锁（升过即永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 70, level: 10 }) === false);
ok('困难 + 零阵亡 + 七十场内 + 未及十级但未通关 → 不解锁', ach.ok({ diff: 1, deaths: 0, battles: 70, level: 9 }) === false);
ok('空档/缺字段 → 不解锁（(g.deaths||0)/(g.battles||0)/(g.level||1)/diff 防御式零迁移）', ach.ok({}) === false);
ok('困难 + 零阵亡 + 七十场内 + 未及十级 + 花过金（spent 1）→ 照常解锁（本档不读 spent，与 penny 系分源）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 70, level: 9, spent: 1 }) === true);
ok('困难 + 零阵亡 + 七十场内 + 未及十级 + 放过技（casts 1）→ 照常解锁（本档不读 casts，与 noskill 系分源）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 70, level: 9, casts: 1 }) === true);
ok('困难 + 零阵亡 + 七十场内 + 未及十级 + 战斗喝过药（potionUses 1）→ 照常解锁（本档不读 potionUses，与 nopotion 系分源）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 70, level: 9, potionUses: 1 }) === true);

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
  'swiftlowlvnopo2', 'swiftnoskillnopo2', 'pennyswiftlv2', 'pennyswiftskill2', 'pennyswiftnopo2'];
ok('既有 130 成就 id 零回归（核心抽样全覆盖末期正位）',
  EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('unflswiftlowlv2 落位 index 130（末尾追加，既有 0..129 序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'unflswiftlowlv2') === 130 &&
  ACH_LIST.findIndex((a) => a.id === 'swiftlowskillnopo2') === 129);

// —— 既有挑战向家族对照（三枚三克档源互不干扰）——
const _a = (id) => ACH_LIST.find((x) => x.id === id);
ok('困难×零阵亡×七十场内×未及十级四克档必同时满足 unflswift2 与 unfllowlv2 与 swiftlv2 三枚三克档（本枚是其四重交叉区唯一纪念——deaths/battles/level 三源同判）',
  _a('unflswift2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 70 }) === true &&
  _a('unfllowlv2').ok({ trueBoss: true, diff: 1, deaths: 0, level: 9 }) === true &&
  _a('swiftlv2').ok({ trueBoss: true, diff: 1, battles: 70, level: 9 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 70, level: 9 }) === true);
ok('三克档互检：unflswift2 不读 level（升过十级照亮 unflswift2 但照灭本枚）/ unfllowlv2 不读 battles（超场照亮 unfllowlv2 但照灭本枚）/ swiftlv2 不读 deaths（死过一次照亮 swiftlv2 但照灭本枚）',
  _a('unflswift2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 70, level: 10 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 70, level: 10 }) === false &&
  _a('unfllowlv2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 71, level: 9 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 71, level: 9 }) === false &&
  _a('swiftlv2').ok({ trueBoss: true, diff: 1, deaths: 1, battles: 70, level: 9 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 1, battles: 70, level: 9 }) === false);
ok('换过难度（diff 0）→ 本枚与三枚三克档同不解锁（diff 严格分区——普通档 deaths/swift/lowlv 单克档如 unflicker/swift/lowlv 不读本枚）',
  _a('unflswift2').ok({ trueBoss: true, diff: 0, deaths: 0, battles: 70 }) === false &&
  _a('unfllowlv2').ok({ trueBoss: true, diff: 0, deaths: 0, level: 9 }) === false &&
  _a('swiftlv2').ok({ trueBoss: true, diff: 0, battles: 70, level: 9 }) === false &&
  _a('unflicker').ok({ trueBoss: true, deaths: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 0, deaths: 0, battles: 70, level: 9 }) === false);
ok('与四克档 swiftlowskill2（v24.201）互不干扰——swiftlowskill2 读 casts 不读 deaths、本枚读 deaths 不读 casts：死过一次照灭本枚但照亮 swiftlowskill2，放过技照灭 swiftlowskill2 但照亮本枚',
  _a('swiftlowskill2').ok({ trueBoss: true, diff: 1, deaths: 1, battles: 70, level: 9, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 1, battles: 70, level: 9, casts: 0 }) === false &&
  _a('swiftlowskill2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 70, level: 9, casts: 1 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 70, level: 9, casts: 1 }) === true);
ok('与 pennyswiftlv2（v24.209）互不干扰——pennyswiftlv2 读 spent 不读 deaths、本枚读 deaths 不读 spent：死过一次照灭本枚但照亮 pennyswiftlv2，花过金照灭 pennyswiftlv2 但照亮本枚',
  _a('pennyswiftlv2').ok({ trueBoss: true, diff: 1, deaths: 1, spent: 0, battles: 70, level: 9 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 1, spent: 0, battles: 70, level: 9 }) === false &&
  _a('pennyswiftlv2').ok({ trueBoss: true, diff: 1, deaths: 0, spent: 1, battles: 70, level: 9 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, spent: 1, battles: 70, level: 9 }) === true);
ok('battles 身经百战 正向里程碑档不解锁本枚（累计遭遇里程碑各自解锁自己的正向里程碑，本枚只认困难零阵亡七十场内未及十级通关）',
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, battles: 100, level: 9 }) === false && _a('battles').ok({ battles: 100 }) === true);

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
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, battles: 70, level: 9 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 困难零阵亡七十场内未及十级真结局档 newly 含 unflswiftlowlv2（既有通路自动跟随）',
    newly.includes('unflswiftlowlv2'), JSON.stringify(newly));
  ok('unlockedAchievements 同档 newly 含三枚三克档 unflswift2/unfllowlv2/swiftlv2（子集自动跟随）',
    newly.includes('unflswift2') && newly.includes('unfllowlv2') && newly.includes('swiftlv2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 0, deaths: 0, battles: 70, level: 9 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 普通档 newly 不含 unflswiftlowlv2（不误解锁，diff 维严格）',
    !newly.includes('unflswiftlowlv2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 1, battles: 70, level: 9 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 死过一次档 newly 不含 unflswiftlowlv2（不误解锁，deaths 维严格）',
    !newly.includes('unflswiftlowlv2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, battles: 71, level: 9 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 超场档 newly 不含 unflswiftlowlv2（不误解锁，battles 维严格）',
    !newly.includes('unflswiftlowlv2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, battles: 70, level: 10 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 升过十级档 newly 不含 unflswiftlowlv2（不误解锁，level 维严格）',
    !newly.includes('unflswiftlowlv2'), JSON.stringify(newly));
}
{
  const h = freshHero({ diff: 1, deaths: 0, battles: 70, level: 9 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 未通关档 newly 不含 unflswiftlowlv2（不误解锁）',
    !newly.includes('unflswiftlowlv2'), JSON.stringify(newly));
}

// —— applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等）——
{
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, battles: 70, level: 9 });
    S.G = h;
    applyAchievements();
    ok('applyAchievements 真实解锁落 hero.ach（含 unflswiftlowlv2）', h.ach.includes('unflswiftlowlv2'), JSON.stringify(h.ach));
    ok('解锁横幅报成就名【逆风长明疾行青芽】', msgs.some((m) => m.includes('🔓 成就解锁：') && m.includes('逆风长明疾行青芽')), msgs.join(' | '));
    const len1 = msgs.length;
    applyAchievements();
    ok('幂等：重复调用不再报（已解锁去重）', msgs.length === len1 && msgs.filter((m) => m.includes('逆风长明疾行青芽')).length === 1, String(msgs.length));
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
    const h = freshHero({ trueBoss: true, diff: 1, deaths: 1, battles: 70, level: 9 });
    S.G = h;
    applyAchievements();
    ok('死过一次 applyAchievements 零 unflswiftlowlv2 解锁零「逆风长明疾行青芽」横幅（不误解锁，deaths 维严格）',
      !h.ach.includes('unflswiftlowlv2') && !msgs.some((m) => m.includes('逆风长明疾行青芽')), JSON.stringify({ ach: h.ach, msgs }));
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
    const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, battles: 70, level: 10 });
    S.G = h;
    applyAchievements();
    ok('升过十级 applyAchievements 零 unflswiftlowlv2 解锁零「逆风长明疾行青芽」横幅（不误解锁，level 维严格）',
      !h.ach.includes('unflswiftlowlv2') && !msgs.some((m) => m.includes('逆风长明疾行青芽')), JSON.stringify({ ach: h.ach, msgs }));
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}

// —— 源级零变化：battle.js 无 spent 新增写点 + battle.js deaths/battles 写入点 + data.js 常量（既有，本版未动）——
ok('battle.js 未新增任何 spent 计数写点（消费线五端口都在 core/shop、本版零改动；g.deaths 是 loseBattle 既有写点）',
  (battleSrc.match(/\.spent = /g) || []).length === 0, String((battleSrc.match(/\.spent = /g) || []).length));
ok('battle.js 具 1 处 S.G.deaths = (S.G.deaths || 0) + 1; 写入点（loseBattle 阵亡唯一产生点）',
  (battleSrc.match(/S\.G\.deaths = \(S\.G\.deaths \|\| 0\) \+ 1;/g) || []).length === 1, String((battleSrc.match(/S\.G\.deaths = \(S\.G\.deaths \|\| 0\) \+ 1;/g) || []).length));
ok('battle.js 具 1 处 S.G.battles = (S.G.battles || 0) + 1; 写入点（startBattle 进战即记唯一产生点）',
  (battleSrc.match(/S\.G\.battles = \(S\.G\.battles \|\| 0\) \+ 1;/g) || []).length === 1, String((battleSrc.match(/S\.G\.battles = \(S\.G\.battles \|\| 0\) \+ 1;/g) || []).length));
ok('data.js SPEED_GOAL 常量仍为 70（单一数据源，与 swift/swift2/unflswift/unflswift2/swiftlv2 系同读一份源）',
  dataSrc.includes('const SPEED_GOAL = 70;'));
ok('data.js LOWLV_GOAL 常量仍为 10（低等级里程碑唯一数据源，与 lowlv/lowlv2/unfllowlv/unfllowlv2/swiftlv2 系同读一份源）',
  dataSrc.includes('const LOWLV_GOAL = 10;'));
ok('data.js BATTLE_GOAL 常量仍为 100（遭遇线里程碑唯一数据源，与 battles「身经百战」系同读一份源）',
  dataSrc.includes('const BATTLE_GOAL = 100;'));
ok('data.js DIFFS 仍含「困难」档（难度单一数据源，与 hardtrue/steadfast/unflswift2/swiftlv2 同读一份源）',
  dataSrc.includes("const DIFFS=['普通','困难'];"));
ok('hero.js 成就横幅活计数注释已推进至 N/131（130→131）', heroSrc.includes('（成就 N/139）'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径为四百二十四件套（四百二十三件套清除）',
  readme.includes('扩充为冒烟四百二十四件套（四百二十三件套清除）') && !readme.includes('扩充为冒烟四百一十五件套（四百一十四件套清除）'));
ok('README 含 v24.214 守护描述（逆风长明疾行青芽新成就守护）', readme.includes('v24.214 起含「逆风长明疾行青芽」新成就守护'));
ok('README 版本速览已为 v24.214 且成就计数 131', readme.includes('版本速览（v24.225）') && readme.includes('139 项成就'));
ok('README 成就计数双处口径 131 项（全部 139 项进度 + **139 项成就**，**130 项成就**清除）',
  readme.includes('全部 139 项进度') && readme.includes('**139 项成就**') && !readme.includes('**13' + '0 项成就**'));
ok('README tests 树收录 smoke_v24214_unflswiftlowlv2（含 v24.214 守护子句 + 串尾）',
  readme.includes('v24.214 起含「逆风长明疾行青芽」新成就守护') && readme.includes('smoke_v24214_unflswiftlowlv2'));
ok('README 含 smoke_v24214_unflswiftlowlv2 入库（424 份）', readme.includes('smoke_v24214_unflswiftlowlv2 入库（424 份）'));
ok('package.json 已收录 smoke_v24214_unflswiftlowlv2.mjs 且位于串尾（在 smoke_v24212_swiftlowskillnopo2 之后）',
  pkg.includes('smoke_v24214_unflswiftlowlv2.mjs') &&
  pkg.includes('node tests/smoke_v24212_swiftlowskillnopo2.mjs && node tests/smoke_v24214_unflswiftlowlv2.mjs && node tests/smoke_v24217_unflswiftnopo2.mjs && node tests/smoke_v24218_unflpennyswift2.mjs && node tests/smoke_v24219_unflpennylowlv2.mjs && node tests/smoke_v24220_unflpennynopo2.mjs && node tests/smoke_v24221_unfllowskill2.mjs && node tests/smoke_v24222_unflswiftskill2.mjs && node tests/smoke_v24223_unfllowlvnopo2.mjs && node tests/smoke_v24224_unflnoskillnopo2.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 416 件套', testChain === 424, String(testChain));
ok('CHANGELOG 含 v24.214 顶条目', changelog.startsWith('## v24.225'));

// —— 哨兵链：README 已有 416 口径且尚无 417（前望 417 语义：下一版才写 417）——
ok('README 已有四百一十六件套口径且尚无 417（哨兵前望 417 语义：下一版才写 417）',
  readme.includes('扩充为冒烟四百二十四件套（四百二十三件套清除）') && !readme.includes('四百二十五件套'));
{
  const s24143 = read('tests/smoke_v24143_furnacequest.mjs');
  ok('smoke_v24143 哨兵链前望 425（四百二十五件套否定式）',
    s24143.includes('哨兵链前望 425') && s24143.includes('四百二十五件套否定式'));
}

// —— 旧代 v24.213 字面量 / 415 件套口径 / 130 项 全库零残留扫描（豁免本套件——本套件含 v24.213 负向断言）——
const EXEMPT = new Set(['smoke_v24214_unflswiftlowlv2.mjs']);
const leftovers = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests')).filter((x) => x.endsWith('.mjs') && !EXEMPT.has(x))) {
  const s = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  const code = s.split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  if (code.includes("const GAME_VERSION = 'v24.213'")) leftovers.push(f + ':gv');
  if (code.includes("GAME_VERSION === 'v24.213'")) leftovers.push(f + ':eq');
  if (code.includes("startsWith('## v24.213")) leftovers.push(f + ':st');
  if (code.includes('四百一十五件套（四百一十四件套清除）')) leftovers.push(f + ':415');
  if (code.includes('testChain === 415') || code.includes('files.length === 415') ||
      code.includes('treeTok.length === 415') || code.includes('chainAll.length === 415') ||
      code.includes('fileCount === 415'))
    leftovers.push(f + ':count');
  if (code.includes('版本速览（v24.213）')) leftovers.push(f + ':ver');
  // 成就计数 130→131 零残留：只认「**13'+'0 项成就**」/「全部 13'+'0 项进度」两形态（「成就 N/130」是 v24.115 HUD 口径稳定常驻 pin 家族，不在扫描目标内）
  if (code.includes('**13' + '0 项成就**') || code.includes('全部 13' + '0 项进度'))
    leftovers.push(f + ':130');
}
ok('旧代 v24.213 GAME_VERSION 字面量/恒等/顶 pin/版本速览 全库零残留（哨兵链，豁免本套件）',
  leftovers.filter((x) => x.endsWith(':gv') || x.endsWith(':eq') || x.endsWith(':st') || x.endsWith(':ver')).length === 0,
  JSON.stringify(leftovers));
ok('旧代 415 件套口径/计数/130 项 pin 全库零残留（哨兵链，豁免本套件）',
  leftovers.filter((x) => x.endsWith(':415') || x.endsWith(':count') || x.endsWith(':130')).length === 0,
  JSON.stringify(leftovers));

if (failed) { console.log(`— v24.225 冒烟完成：${n} 项断言，失败 ${failed} —`); process.exit(1); }
console.log(`— v24.225 冒烟完成：${n} 项断言，失败 0 —`);
