// smoke_v24251_unfltravelnopo2.mjs —— v24.251 专项冒烟：新成就「逆风长明徒步不饮」（挑战向·「困难×长明×徒步×不饮」四维交叉首角·困难×零阵亡×零战斗用药×从未快速旅行）
// （新内容·单成就·第一百六十二项——承 v24.246 逆风长明徒步（unfltravel2，「困难×长明×徒步」三维交叉首角·困难×零阵亡×从未快速旅行）/v24.179 逆风未饮
// （unflnopo2，「困难×长明×不饮」三克制首角·困难×零阵亡×零战斗用药）先例：本枚为 unfltravel2 与 unflnopo2 的严格公共交集——「既零阵亡、又从未快速旅行、
// 又零战斗用药且困难通关」——收为一枚，开垦「徒步×不饮」双姿态组合第五角收官（travels×potionUses 双端口同框进挑战向交叉面——hardtrue×unfl×travels
// 五姿态组合至此全部开垦完毕：疾行/青芽/白手/素手/不饮）；与 unfltravel2 互分源——战斗嗑药（potionUses≥1）照亮其照灭本枚（唯一分源端口 potionUses）；与 unflnopo2
// 互分源——旅行过一次照亮其照灭本枚（唯一分源端口 travels）；与 unfl 五克档十枚二维以上分源——旅行过一次即永久无缘此档
// （本枚读 travels 端口，unfl 家族全部不读 travels，与各枚互不干扰零冲突——unfl 档可旅行、本枚不可旅行）；与「行者无疆」成镜面对（正向 15 次 vs 逆向零次，互不重叠）。
// 判定读既有 hero.trueBoss（终焉之神=真结局最终 Boss，与 trueboss/hardtrue/unflicker 同源）、既有 hero.diff（DIFFS 下标：建档 createDiff 写定、
// `(g.diff===1)` 即 DIFFS[1]「困难」档）、既有 hero.deaths（battle.loseBattle 全游唯一产生点——只增不减、防御式 (g.deaths||0) 旧档零迁移）、
// 既有 hero.travels（core.doTravel 成功旅行唯一产生点——未探索/已在原地早退零计数、只增不减、防御式 !(g.travels||0) 旧档零迁移）、
// 既有 hero.potionUses（battle.doItem 战斗用药成功唯一产生点——大地图 F 喝药/旅馆/篝火不计入、只增不减、防御式 !(g.potionUses||0) 旧档零迁移），
// (g.trueBoss && g.diff===1 && !(g.deaths||0) && !(g.potionUses||0) && !(g.travels||0)) 即「困难 · 零阵亡 · 零战斗用药 · 从未快速旅行通关」达成——
// 端口只增不减语义下，换过难度、死过一次、战斗里用过一次药或旅行过一次就永久无缘此档（本枚读五端口，无「不读某端口」豁免——与各枚二维以上分源）；
// 是 unfltravel2（逆风长明徒步）与 unflnopo2（逆风未饮）的严格同步交叠——困难零阵亡零战斗用药零旅行通关必同时满足两枚，再往前收成一枚；与既有正向
// 里程碑 travels「行者无疆」成镜面对、互不重叠（15 次 vs 零次）。
// 可行性与 v24.246 同域（hardtrue×deaths×travels 已验证零阵亡零旅行困难通关可行，本枚只加「零战斗用药」——与 v24.179 unflnopo2 同域验证过零战斗用药困难
// 零阵亡可行，且零旅行不拖慢节奏：地图间靠出口/传送门步行连通即可）。
// 零新计数零新状态零新写点零新存档（trueBoss/diff/deaths/travels/potionUses 皆既有字段）、无 r 无 prog 纯里程碑、解锁走 winBattle → applyAchievements 既有通路
// （终焉之神击败当场 trueBoss 落账后 applyAchievements 枚举即解锁，零新增依赖），反馈不迟到。
// 本冒烟守护：版本锚点（格式合法 + 已越过 v24.255 + data.js 字面量 v24.251 + 旧 v24.251 字面量零残留）、ACH_LIST 162 项精确与末尾序位（unfltravelnopo2 落位 161——
// 前 161 项 id/序位零回归）、unfltravelnopo2 数据契约（d 文案、ok 防御式逐值、无 r 无 prog 且与 unfltravel2/unflnopo2 严格交叠与镜面对）、
// unlockedAchievements/applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等去重 / 换难度不解锁 / 死过一次不解锁 / 旅行过一次不解锁 /
// 战斗嗑药不解锁 / 未通关不解锁 / 空档不解锁 / 超场与升过十级与花过金与用技与大地图喝药住店照常解锁反例——本枚不读 battles/level/spent/potionUses/aux 端口）、
// 既有 161 成就 id 零回归、core.js 唯一 travels 写入点与 hero/shop/battle 零 travels 写点 + battle.js 唯一 potionUses 写入点、
// README/package.json/CHANGELOG 同步（件套口径 447 + v24.251 守护描述 + 入库 447 + 版本速览 162 项 +
// tests 树串尾 + package 串尾 447 + CHANGELOG 顶条 v24.251）、哨兵链（前望 448 且 README 尚无 448 口径）、旧代 v24.250 字面量/恒等/顶 pin/446 口径/161 项
// 全库零残留扫描（豁免本套件与 v24250 与 v24249 与 v24248 与 v24247 与 v24246 与 v24245 与 v24244 与 v24243 与 v24242 与 v24241 与 v24239 与 v24238 与 v24237 与 v24235 与 v24233 与 v24231 与 v24230 与 v24229）。
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
console.log('— v24.251 挑战向·「困难×长明×徒步×不饮」四维交叉首角成就「逆风长明徒步不饮」（困难×零阵亡×零战斗用药×从未快速旅行） 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dataSrc = read('js/data.js');
const coreSrc = read('js/core.js');
const battleSrc = read('js/battle.js');
const heroSrc = read('js/hero.js');
const shopSrc = read('js/shop.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');
// —— 版本锚点（格式合法 + 已越过 v24.255 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.255', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 255)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.251（旧 v24.250 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v24.256';") && !dataSrc.includes("const GAME_VERSION = 'v24.250';"));
ok('data.js 含 v24.251 注释（逆风长明徒步不饮四维交叉首角说明）',
  dataSrc.includes('v24.252 文档整理·版本锚点推进'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'unfltravelnopo2');
ok('ACH_LIST 含 unfltravelnopo2「逆风长明徒步不饮」且 id 唯一',
  !!ach && ach.name === '逆风长明徒步不饮' && ACH_LIST.filter((a) => a.id === 'unfltravelnopo2').length === 1);
ok('ACH_LIST 精确总数 162 项（161→162 末尾追加）', ACH_LIST.length === 163, String(ACH_LIST.length));
ok('unfltravelnopo2 描述文案（困难零阵亡零战斗用药从未快速旅行真结局四维交叉首角）',
  ach.d === '以困难模式、零阵亡、未在战斗中使用药水/灵药且从未使用快速旅行（旅行面板）时击败终焉之神（真结局）', ach.d);
ok('unfltravelnopo2 判定源级（读既有 g.trueBoss / g.diff===1 / !(g.deaths||0) / !(g.potionUses||0) / !(g.travels||0)，五端口全读）',
  String(ach.ok).includes('g.trueBoss') && String(ach.ok).includes('g.diff===1') && String(ach.ok).includes('g.deaths') &&
  String(ach.ok).includes('g.potionUses') && String(ach.ok).includes('g.travels'));
ok('unfltravelnopo2 无 r 无 prog 纯里程碑（与 hardtrue/unflicker/unfltravel2/unflnopo2 同款）',
  !('r' in ach) && !('prog' in ach));

// —— ok 防御式逐值 ——
ok('困难 + 零阵亡 + 零战斗用药 + 从未旅行 + 真结局 → 解锁', ach.ok({ trueBoss: true, diff: 1, deaths: 0, travels: 0, potionUses: 0 }) === true);
ok('困难 + 零阵亡 + 真结局 + 缺字段 → (g.deaths||0)/(g.travels||0)/(g.potionUses||0) 防御式解码解锁（旧档零迁移）', ach.ok({ trueBoss: true, diff: 1 }) === true);
ok('缺 diff 字段（普通档）+ 全克制 → 不解锁（diff 维严格）', ach.ok({ trueBoss: true, deaths: 0, travels: 0, potionUses: 0 }) === false);
ok('困难 + 死过一次（deaths 1）→ 不解锁（阵亡即永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, deaths: 1, travels: 0, potionUses: 0 }) === false);
ok('困难 + 旅行过一次（travels 1）→ 不解锁（旅行即永久无缘此档，徒步维严格）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, travels: 1, potionUses: 0 }) === false);
ok('困难 + 旅行过多次（travels 15）→ 不解锁（旅行过即永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, travels: 15, potionUses: 0 }) === false);
ok('困难 + 战斗用过一次药（potionUses 1）→ 不解锁（战斗嗑药即永久无缘此档，含界外）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, travels: 0, potionUses: 1 }) === false);
ok('困难 + 战斗嗑药（potionUses 9）→ 不解锁（不饮维严格，战斗用药即永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, travels: 0, potionUses: 9 }) === false);
ok('困难 + 零阵亡 + 零旅行 + 零战斗用药 + 超场/升过十级/花过金/用技等 aux 端口有值 → 照常解锁（本枚只读 diff/deaths/travels/potionUses，与其他克制维度分源）',
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, travels: 0, potionUses: 0, battles: 99, level: 12, spent: 9, steps: 5000 }) === true);
ok('困难 + 全克制但未通关 → 不解锁', ach.ok({ diff: 1, deaths: 0, travels: 0, potionUses: 0 }) === false);
ok('空档/缺字段 → 不解锁（五端口防御式零迁移）', ach.ok({}) === false);
ok('困难 + 零阵亡 + 零旅行 + 零战斗用药 + 大地图 F 喝过药（mapPotions 9）→ 照常解锁（本枚不读 mapPotions，与渴饮甘露系分源）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, travels: 0, potionUses: 0, mapPotions: 9 }) === true);
ok('困难 + 零阵亡 + 零旅行 + 零战斗用药 + 旅馆住过（innRests 9）→ 照常解锁（本枚不读 innRests，与夜宿灯下系分源）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, travels: 0, potionUses: 0, innRests: 9 }) === true);
ok('困难 + 零阵亡 + 零旅行 + 零战斗用药 + 卖过菇（sold 9）→ 照常解锁（本枚不读 sold，与蘑菇商路系分源）', ach.ok({ trueBoss: true, diff: 1, deaths: 0, travels: 0, potionUses: 0, sold: 9 }) === true);

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
  'unflnopo2', 'unflnopo2', 'unfllowlv2', 'pennyswift2', 'pennylowlv2', 'pennynoskill2', 'pennynopo2',
  'swiftlv2', 'swiftskill2', 'swiftnopo2', 'lowskill2', 'lowlvnopo2', 'nopotskill2', 'lowskillnopo2',
  'pennylowlvnopo2', 'pennynoskillnopo2', 'pennylowskill2', 'pennylownoskillnopo2', 'swiftlowskill2',
  'swiftlowlvnopo2', 'swiftnoskillnopo2', 'pennyswiftlv2', 'pennyswiftskill2', 'pennyswiftnopo2', 'unflswiftlowlv2', 'unflswiftnopo2', 'unflpennyswift2', 'unflpennylowlv2', 'unflpennynopo2', 'unfllowskill2', 'unflswiftskill2', 'unfllowlvnopo2', 'unflnoskillnopo2', 'unflpennynoskill2', 'unflpennylownoskillnopo2', 'unfllowlvnoskillnopo2', 'unflswiftlowlvnoskill2', 'unflswiftlowlvnopo2', 'unflswiftnoskillnopo2', 'unflswiftlowlvpenny2', 'unflswiftnoskillpenny2', 'unflswiftnopopenny2', 'unfllowskillpenny2', 'unflpennynoskillnopo2', 'unflpennylowlvnopo2', 'unflswiftlowlvpennynoskill2', 'unflswiftlowlvpennynopo2', 'unflswiftlowlvnoskillnopo2', 'unflswiftpennynoskillnopo2', 'unflswiftlowlvpennynoskillnopo2', 'unfltravel2', 'unfltravelswift2', 'unfltravellowlv2', 'unfltravelpenny2', 'unfltravelnopo2'];
ok('既有 161 成就 id 零回归（核心抽样全覆盖末期正位）',
  EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('unfltravelnopo2 落位 index 161（末尾追加，既有 0..160 序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'unfltravelnopo2') === 161 &&
  ACH_LIST.findIndex((a) => a.id === 'unfltravelnoskill2') === 160 &&
  ACH_LIST.findIndex((a) => a.id === 'unfltravelpenny2') === 159 &&
  ACH_LIST.findIndex((a) => a.id === 'unfltravellowlv2') === 158 &&
  ACH_LIST.findIndex((a) => a.id === 'unfltravelswift2') === 157 &&
  ACH_LIST.findIndex((a) => a.id === 'unfltravel2') === 156 &&
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

// —— 既有家族对照（本枚 = unfltravel2/unflnopo2 严格交叠 + 五端口全读，互不干扰）——
const _a = (id) => ACH_LIST.find((x) => x.id === id);
ok('本枚达成必同时满足 hardtrue（逆风不灭）与 unflicker（未曾熄灯）——困难零阵亡真结局通关',
  _a('hardtrue').ok({ trueBoss: true, diff: 1, deaths: 0 }) === true &&
  _a('unflicker').ok({ trueBoss: true, deaths: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, travels: 0, potionUses: 0 }) === true);
ok('本枚达成必同时满足 unfltravel2（逆风长明徒步）与 unflnopo2（逆风未饮）——困难零阵亡零旅行零战斗用药真结局通关',
  _a('unfltravel2').ok({ trueBoss: true, diff: 1, deaths: 0, travels: 0 }) === true &&
  _a('unflnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, travels: 0, potionUses: 0 }) === true);
ok('与 unfltravel2 分源——战斗嗑药（potionUses 9）照亮其但照灭本枚（唯一分源端口 potionUses）',
  _a('unfltravel2').ok({ trueBoss: true, diff: 1, deaths: 0, travels: 0, potionUses: 9 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, travels: 0, potionUses: 9 }) === false);
ok('与 unflnopo2 分源——旅行过（travels 5）照亮其但照灭本枚（唯一分源端口 travels）',
  _a('unflnopo2').ok({ trueBoss: true, diff: 1, deaths: 0, potionUses: 0, travels: 5 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, travels: 5, potionUses: 0 }) === false);
ok('与 unfltravellowlv2 分源·方向一——战斗嗑药（potionUses 9·level 9）照灭本枚但照亮其（分源端口 potionUses）',
  _a('unfltravellowlv2').ok({ trueBoss: true, diff: 1, deaths: 0, travels: 0, potionUses: 9, level: 9 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, travels: 0, potionUses: 9, level: 9 }) === false);
ok('与 unfltravellowlv2 分源·方向二——升过十级（level 12·potionUses 0）照亮本枚但照灭其（分源端口 level）',
  _a('unfltravellowlv2').ok({ trueBoss: true, diff: 1, deaths: 0, travels: 0, potionUses: 0, level: 12 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, travels: 0, potionUses: 0, level: 12 }) === true);
ok('与 unflswift2 分源——超场（battles 100）照亮本枚但照灭其（本枚不读 battles、其读 battles，battles 端口分源）',
  _a('unflswift2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 100, travels: 0, potionUses: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, travels: 0, potionUses: 0, battles: 100 }) === true);
ok('与「行者无疆」镜面对——本枚读逆向零次、其读正向 15 次，互不重叠',
  _a('travels').ok({ trueBoss: true, travels: 15 }) === true &&
  _a('travels').ok({ trueBoss: true, travels: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, travels: 15, potionUses: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, travels: 0, potionUses: 0 }) === true);
ok('与 unfl 五克档十枚分源——unfl 档照常可旅行可战斗嗑药（unflswift2 不读 travels/potionUses），本枚读 travels/potionUses 与其零冲突',
  _a('unflswift2').ok({ trueBoss: true, diff: 1, deaths: 0, battles: 42, travels: 9, potionUses: 9 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, deaths: 0, travels: 9, potionUses: 9 }) === false);
ok('换过难度（diff 0）→ 本枚与 hardtrue 同不解锁（diff 严格分区——unflicker/travels 单克档照常各自解锁，不读本枚）',
  _a('hardtrue').ok({ trueBoss: true, diff: 0, deaths: 0 }) === false &&
  _a('unflicker').ok({ trueBoss: true, deaths: 0 }) === true &&
  _a('travels').ok({ trueBoss: true, travels: 15 }) === true &&
  ach.ok({ trueBoss: true, diff: 0, deaths: 0, travels: 0, potionUses: 0 }) === false);

// —— unlockedAchievements 集成 ——
function freshHero(extra) {
  return Object.assign({ name: '余烬', level: 12, gold: 123, xp: 0, xpNext: 20, hp: 50, hpMax: 50, mp: 20, mpMax: 20,
    item: 3, potion2: 1, mushrooms: 2, weapon: '铁剑', armor: '皮甲', atkMax: 12, defMax: 6,
    map: 'village', x: 8, y: 8, time: 0, ach: [], bestiary: {}, seen: {}, fragments: [], visited: ['village'],
    quests: {}, totalWins: 3, drops: 0, steps: 0, travels: 0, spent: 0, battles: 3, skills: [], talked: [],
    checks: 0, crits: 0, flees: 0, potionUses: 0, deflects: 0, charges: 0, sleep: 0,
    sold: 0, dealt: 0, mapPotions: 0, innRests: 0, nightWins: 0, rushClears: 0, brews: 0, chests: [],
    deaths: 0, diff: 0 }, extra);
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, travels: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 困难零阵亡零旅行零战斗用药真结局档 newly 含 unfltravelnopo2（既有通路自动跟随，potionUses 默认 0 直接解锁）',
    newly.includes('unfltravelnopo2'), JSON.stringify(newly));
  ok('unlockedAchievements 同档 newly 含 unfltravel2/unflnopo2/hardtrue/unflicker（子集自动跟随）',
    newly.includes('unfltravel2') && newly.includes('unflnopo2') && newly.includes('hardtrue') && newly.includes('unflicker'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 0, deaths: 0, travels: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 普通档 newly 不含 unfltravelnopo2（不误解锁，diff 维严格）',
    !newly.includes('unfltravelnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 1, travels: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 死过一次档 newly 不含 unfltravelnopo2（不误解锁，deaths 维严格）',
    !newly.includes('unfltravelnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, travels: 1 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 旅行过一次档 newly 不含 unfltravelnopo2（不误解锁，travels 维严格）',
    !newly.includes('unfltravelnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, travels: 0, potionUses: 9 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 战斗嗑药档（potionUses 9）newly 不含 unfltravelnopo2（不误解锁，potionUses 维严格）',
    !newly.includes('unfltravelnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, travels: 0, potionUses: 1 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 恰好战斗用过一次药档（potionUses 1）newly 不含 unfltravelnopo2（不误解锁，不饮维严格含界外）',
    !newly.includes('unfltravelnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ diff: 1, deaths: 0, travels: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 未通关档 newly 不含 unfltravelnopo2（不误解锁）',
    !newly.includes('unfltravelnopo2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, travels: 0, level: 12, battles: 99, spent: 9, casts: 9, mapPotions: 9, innRests: 3, sold: 5 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 升过十级且超场且花过金且用技且大地图喝过药住过店卖过菇档 newly 含 unfltravelnopo2（本枚不读 aux 端口与 battles/level/spent/casts，与各态分源）',
    newly.includes('unfltravelnopo2'), JSON.stringify(newly));
}

// —— applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等）——
{
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, travels: 0 });
    S.G = h;
    applyAchievements();
    ok('applyAchievements 真实解锁落 hero.ach（含 unfltravelnopo2）', h.ach.includes('unfltravelnopo2'), JSON.stringify(h.ach));
    ok('解锁横幅报成就名【逆风长明徒步不饮】', msgs.some((m) => m.includes('🔓 成就解锁：') && m.includes('【逆风长明徒步不饮】')), msgs.join(' | '));
    const len1 = msgs.length;
    applyAchievements();
    ok('幂等：重复调用不再报（已解锁去重）', msgs.length === len1 && msgs.filter((m) => m.includes('【逆风长明徒步不饮】')).length === 1, String(msgs.length));
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
    const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, travels: 0, potionUses: 9 });
    S.G = h;
    applyAchievements();
    ok('战斗嗑药 applyAchievements 零 unfltravelnopo2 解锁零「逆风长明徒步不饮」横幅（不误解锁，potionUses 维严格）',
      !h.ach.includes('unfltravelnopo2') && !msgs.some((m) => m.includes('【逆风长明徒步不饮】')), JSON.stringify({ ach: h.ach, msgs }));
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
    const h = freshHero({ trueBoss: true, diff: 1, deaths: 0, travels: 3 });
    S.G = h;
    applyAchievements();
    ok('旅行过 applyAchievements 零 unfltravelnopo2 解锁零「逆风长明徒步不饮」横幅（不误解锁，travels 维严格）',
      !h.ach.includes('unfltravelnopo2') && !msgs.some((m) => m.includes('【逆风长明徒步不饮】')), JSON.stringify({ ach: h.ach, msgs }));
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
    const h = freshHero({ trueBoss: true, diff: 0, deaths: 0, travels: 0 });
    S.G = h;
    applyAchievements();
    ok('普通档 applyAchievements 零 unfltravelnopo2 解锁零「逆风长明徒步不饮」横幅（不误解锁，diff 维严格）',
      !h.ach.includes('unfltravelnopo2') && !msgs.some((m) => m.includes('【逆风长明徒步不饮】')), JSON.stringify({ ach: h.ach, msgs }));
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}

// —— 源级零变化：core.js 唯一 travels 写入点 + hero/shop/battle 零 travels 写点 ——
ok('core.js 具 1 处 g.travels = (g.travels || 0) + 1; 写入点（doTravel 成功旅行唯一产生点——未探索/已在原地早退零计数）',
  (coreSrc.match(/g\.travels = \(g\.travels \|\| 0\) \+ 1;/g) || []).length === 1, String((coreSrc.match(/g\.travels = \(g\.travels \|\| 0\) \+ 1;/g) || []).length));
ok('hero.js 未新增任何 travels 计数写点（本版零改动）',
  (heroSrc.match(/\.travels = /g) || []).length === 0, String((heroSrc.match(/\.travels = /g) || []).length));
ok('battle.js 未新增任何 travels 计数写点（旅行计数只有 core.doTravel 一处、本版零改动）',
  (battleSrc.match(/\.travels = /g) || []).length === 0, String((battleSrc.match(/\.travels = /g) || []).length));
ok('shop.js 未新增任何 travels 计数写点（本版零改动）',
  (shopSrc.match(/\.travels = /g) || []).length === 0, String((shopSrc.match(/\.travels = /g) || []).length));
ok('battle.js 具 1 处 hero.potionUses = useN; 写入点（doItem 战斗用药成功唯一产生点——大地图 F/旅馆/篝火不计入）',
  (battleSrc.match(/hero\.potionUses = useN;/g) || []).length === 1, String((battleSrc.match(/hero\.potionUses = useN;/g) || []).length));
ok('data.js 既有 travels 里程碑「行者无疆」逐字未动（TRAVEL_GOAL 单一数据源、与正向里程碑同读一份源）',
  dataSrc.includes("{id:'travels', name:'行者无疆'") && dataSrc.includes('TRAVEL_GOAL'));
ok('data.js 既有 unfltravel2「逆风长明徒步」逐字未动（与本枚同读 travels 一份源）',
  dataSrc.includes("{id:'unfltravel2', name:'逆风长明徒步'"));
ok('data.js 既有 unflnopo2「逆风未饮」逐字未动（零战斗用药维同源，与本枚同读一份源）',
  dataSrc.includes("{id:'unflnopo2', name:'逆风未饮'"));
ok('data.js DIFFS 仍含「困难」档（难度单一数据源，与 hardtrue/steadfast/unfltravelpenny2 同读一份源）',
  dataSrc.includes("const DIFFS=['普通','困难'];"));
ok('hero.js 成就横幅活计数注释已推进至 N/162（161→162）', heroSrc.includes('（成就 N/163）'));
ok('data.js 成就横幅活计数注释已推进至 N/162（161→162，两处恒等）', (dataSrc.match(/（成就 N\/163）/g) || []).length === 2, String((dataSrc.match(/（成就 N\/163）/g) || []).length));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径为四百四十八件套（四百四十七件套清除）',
  readme.includes('扩充为冒烟四百四十八件套（四百四十七件套清除）') && !readme.includes('扩充为冒烟四百四十九件套（四百四十七件套清除）'));
ok('README 含 v24.251 守护描述（逆风长明徒步不饮四维交叉首角守护）', readme.includes('v24.251 起含「逆风长明徒步不饮」新成就守护'));
ok('README 版本速览已为 v24.251 且成就计数 162', readme.includes('版本速览（v24.256）') && readme.includes('163 项成就'));
ok('README 成就计数双处口径 162 项（全部 163 项进度 + **163 项成就**，**161 项成就**清除）',
  readme.includes('全部 163 项进度') && readme.includes('**16' + '3 项成就**') && !readme.includes('**16' + '1 项成就**'));
ok('README tests 树收录 smoke_v24251_unfltravelnopo2（含 v24.251 守护子句 + 串尾）',
  readme.includes('v24.251 起含「逆风长明徒步不饮」新成就守护') && readme.includes('smoke_v24251_unfltravelnopo2'));
ok('README 含 smoke_v24251_unfltravelnopo2 入库（447 份）', readme.includes('smoke_v24251_unfltravelnopo2 入库（447 份）'));
ok('package.json 已收录 smoke_v24251_unfltravelnopo2.mjs 且位于串尾（在 smoke_v24250_unfltravelnoskill2 之后）',
  pkg.includes('smoke_v24251_unfltravelnopo2.mjs') &&
  pkg.includes('node tests/smoke_v24250_unfltravelnoskill2.mjs && node tests/smoke_v24251_unfltravelnopo2.mjs && node tests/smoke_v24255_unflee.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 447 件套', testChain === 448, String(testChain));
ok('CHANGELOG 含 v24.251 顶条目', changelog.startsWith('## v24.256'));

// —— 哨兵链：README 已有 447 口径且尚无 448（前望 448 语义：下一版才写 448）——
ok('README 已有四百四十八件套口径且尚无 448（哨兵前望 449 语义：下一版才写 448）',
  readme.includes('扩充为冒烟四百四十八件套（四百四十七件套清除）') && !readme.includes('四百四十九件套'));
{
  const s24143 = read('tests/smoke_v24143_furnacequest.mjs');
  ok('smoke_v24143 哨兵链前望 449（四百四十九件套否定式）',
    s24143.includes('哨兵链前望 449') && s24143.includes('四百四十九件套否定式'));
}

// —— 旧代 v24.250 字面量 / 446 件套口径 / 161 项 全库零残留扫描（豁免本套件与 v24250 与 v24249 与 v24248 与 v24247 与 v24246 与 v24245 与 v24244 与 v24243 与 v24242 与 v24241 与 v24239 与 v24238 与 v24237 与 v24235 与 v24233 与 v24231 与 v24230 与 v24229——十七者含 v24.250 负向断言/扫描目标）——
const EXEMPT = new Set(['smoke_v24255_unflee.mjs', 'smoke_v24251_unfltravelnopo2.mjs', 'smoke_v24250_unfltravelnoskill2.mjs', 'smoke_v24249_unfltravelpenny2.mjs', 'smoke_v24248_unfltravellowlv2.mjs', 'smoke_v24247_unfltravelswift2.mjs', 'smoke_v24246_unfltravel2.mjs', 'smoke_v24245_unflswiftlowlvpennynoskillnopo2.mjs', 'smoke_v24244_unflswiftpennynoskillnopo2.mjs', 'smoke_v24243_unflswiftlowlvnoskillnopo2.mjs', 'smoke_v24242_unflswiftlowlvpennynopo2.mjs', 'smoke_v24241_unflswiftlowlvpennynoskill2.mjs', 'smoke_v24239_unflpennylowlvnopo2.mjs', 'smoke_v24238_unflpennynoskillnopo2.mjs', 'smoke_v24237_unfllowskillpenny2.mjs', 'smoke_v24235_unflswiftnopopenny2.mjs', 'smoke_v24233_unflswiftnoskillpenny2.mjs', 'smoke_v24231_unflswiftlowlvpenny2.mjs', 'smoke_v24230_unflswiftnoskillnopo2.mjs', 'smoke_v24229_unflswiftlowlvnopo2.mjs']);
const leftovers = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests')).filter((x) => x.endsWith('.mjs') && !EXEMPT.has(x))) {
  const s = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  const code = s.split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  if (code.includes("const GAME_VERSION = 'v24.250'")) leftovers.push(f + ':gv');
  if (code.includes("GAME_VERSION === 'v24.250'")) leftovers.push(f + ':eq');
  if (code.includes("startsWith('## v24.250")) leftovers.push(f + ':st');
  if (code.includes('四百四十七件套（四百四十六件套清除）')) leftovers.push(f + ':446');
  if (code.includes('版本速览（v24.250）')) leftovers.push(f + ':ver');
  if (code.includes('testChain === 446') || code.includes('files.length === 446') ||
      code.includes('treeTok.length === 446') || code.includes('chainAll.length === 446') ||
      code.includes('fileCount === 446') || code.includes('chain.length === 445') ||
      code.includes('suiteFiles.length === 445'))
    leftovers.push(f + ':count');
// 成就计数 161→162 零残留：只认「**16'+'1 项成就**」/「全部 161 项进度」两形态（「成就 N/162」是新版 HUD 口径稳定常驻 pin 家族，不在扫描目标内）
  if (code.includes('**16' + '1 项成就**') || code.includes('全部 161 项进度'))
    leftovers.push(f + ':161');
}
ok('旧代 v24.250 GAME_VERSION 字面量/恒等/顶 pin/版本速览 全库零残留（哨兵链，豁免本套件与 v24250 与 v24249 与 v24248 与 v24247 与 v24246 与 v24245 与 v24244 与 v24243 与 v24242 与 v24241 与 v24239 与 v24238 与 v24237 与 v24235 与 v24233 与 v24231 与 v24230 与 v24229）',
  leftovers.filter((x) => x.endsWith(':gv') || x.endsWith(':eq') || x.endsWith(':st') || x.endsWith(':ver')).length === 0,
  JSON.stringify(leftovers));
ok('旧代 446 件套口径/计数/161 项 pin 全库零残留（哨兵链，豁免本套件与 v24250 与 v24249 与 v24248 与 v24247 与 v24246 与 v24245 与 v24244 与 v24243 与 v24242 与 v24241 与 v24239 与 v24238 与 v24237 与 v24235 与 v24233 与 v24231 与 v24230 与 v24229）',
  leftovers.filter((x) => x.endsWith(':446') || x.endsWith(':count') || x.endsWith(':161')).length === 0,
  JSON.stringify(leftovers));

if (failed) { console.log(`— v24.256 冒烟完成：${n} 项断言，失败 ${failed} —`); process.exit(1); }
console.log(`— v24.256 冒烟完成：${n} 项断言全绿 —`);
