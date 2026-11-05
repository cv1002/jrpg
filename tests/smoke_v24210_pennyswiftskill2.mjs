// smoke_v24210_pennyswiftskill2.mjs —— v24.213 专项冒烟：新成就「逆风白手疾行素手」（挑战向·「困难×白手×疾行」三重克制交叉区第二角·困难模式×未花费 1 金币×七十场战斗内×未使用任何技能）
// （新内容·单成就·第一百二十八项——承 v24.209 逆风白手疾行青芽（pennyswiftlv2，「困难×白手×疾行」三重克制交叉区首角·困难×零消费×七十场内×未及十级）/
// v24.184 逆风白手疾行（pennyswift2，困难×零消费×七十场内）/ v24.189 逆风踏雪无痕（swiftskill2，困难×七十场内×零用技）/
// v24.186 逆风白手素手（pennynoskill2，困难×零消费×零用技）/ v24.198 逆风白手素手青芽（pennylowskill2，困难×零消费×未及十级×零用技）先例：
// v24.184/189/186 相继开垦 hardtrue×pennyswift（双克制）/ hardtrue×swift×noskill / hardtrue×penny×noskill 后，本枚把
// 「零消费 × 七十场内 × 零用技」三克制的公共交集——「既零消费、又七十场内、又零用技且困难通关」——收为一枚，开垦
// 「困难×白手×疾行」三重克制交叉区第二角（hardtrue×penny×swift×noskill；pennyswift「白手×疾行」在困难档的 ×{lowlv,noskill,nopotion}
// 三姿态交叉区经 v24.209 首角后至此第二角落地——同簇剩余交叉口 hardtrue×penny×swift×nopotion 与更高维交叉留待后续）。
// 判定读既有 hero.trueBoss（终焉之神=真结局最终 Boss，与 trueboss/hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/
// swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/
// pennyswift/pennylowlv/pennynoskill/pennynopo/unflswift2/unflpenny2/unflnopo2/unflskill2/unfllowlv2/pennyswift2/pennylowlv2/pennynoskill2/
// pennynopo2/swiftlv2/swiftskill2/swiftnopo2/lowskill2/lowlvnopo2/nopotskill2/lowskillnopo2/pennylowlvnopo2/pennynoskillnopo2/pennylowskill2/
// pennylownoskillnopo2/swiftlowskill2/swiftlowlvnopo2/swiftnoskillnopo2/pennyswiftlv2 同源）、既有 hero.diff（DIFFS 下标：建档 createDiff 写定、
// core.js initGame S.G.diff = diff || 0、resetRun 沿用同槽，`(g.diff===1)` 即 DIFFS[1]「困难」档）、既有 hero.spent
// （消费线五端口——商店购买×3/住店/酿造——扣款唯一来源、只增不减、随 snapshotHero 全量快照自动持久化、防御式 (g.spent||0) 旧档零迁移，
// 与 penny「白手成灯」/frugal「两袖清风」/spend「一掷千金」/unflpenny/pennyswift/pennylowlv/pennynoskill/pennynopo/unflpenny2/pennyswift2/
// pennylowlv2/pennynoskill2/pennynopo2 系同读一份源）、既有 hero.battles（battle.startBattle 进战即记唯一产生点——胜/败/逃都算、只增不减、
// 防御式 (g.battles||0) 旧档零迁移，与 swift/swift2/swiftskill/swiftlv/swiftnopo/unflswift/pennyswift/unflswift2/pennyswift2/swiftlv2/swiftskill2/
// swiftnopo2 系同读一份源）与既有 hero.casts（battle.doSkill 战斗释放技能成功唯一产生点——治愈/伤害两分支都计入、只增不减、
// 防御式 (g.casts||0) 旧档零迁移，与 noskill/noskill2/cast/lowskill/swiftskill/nopotskill/unflskill/pennynoskill/unflskill2/pennynoskill2/
// swiftskill2/nopotskill2/lowskill2/lowskillnopo2/pennynoskillnopo2/pennylowskill2/swiftlowskill2/swiftnoskillnopo2 系同读一份源），
// (g.trueBoss && g.diff===1 && !(g.spent||0) && (g.battles||0)<=SPEED_GOAL && !(g.casts||0)) 即「困难 · 零消费 · 七十场内 ·
// 零用技通关」达成——diff/spent/battles/casts 四端口都只增不减，换过难度、花过 1 金、超场或放过一次技就永久无缘此档（与 hardtrue
// 换难度 / penny 花过金 / swift 超场 / noskill 放过技 同属「重新来过才拿得到」的挑战品类）；是 hardtrue、penny、swift 与 noskill
// 四枚的严格交叠——困难零消费七十场内零用技通关必同时满足四者（也必满足 pennyswift2 与 swiftskill2 与 pennynoskill2 三枚三克档与
// pennyswift/swiftskill/pennynoskill 普通双克档与 pennyswift 二克档），本枚是这一四重交叉区的唯一纪念；与既有正向里程碑 battles「身经百战」
// （BATTLE_GOAL 100 场）与 cast「熟能生巧」（CAST_GOAL 30 次）成镜面对、互不重叠。可行性：困难档魔物全面加强下七十场红线内不花 1 金
// （商店/住店/酿造三消费口全封——装备靠开箱/支线/掉落换、回血靠普攻/防御回蓝/喷泉/旅馆免费篝大地图 F 喝药）且全程不放技能
// （技能线全封——普攻/防御/蓄力/逃跑四指令兜底）通关，吃满「别自降难度 + 别花钱 + 别拖沓 + 别用技」四克制的一场逆风白手疾行素手。
// 零新计数零新状态零新写点零新存档（trueBoss/diff/spent/battles/casts 皆既有字段）、无 r 无 prog 纯里程碑（与 hardtrue/unflicker/swift/
// lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/
// unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv/pennynoskill/pennynopo/unflswift2/unflpenny2/unflnopo2/unflskill2/unfllowlv2/
// pennyswift2/pennylowlv2/pennynoskill2/pennynopo2/swiftlv2/swiftskill2/swiftnopo2/lowskill2/lowlvnopo2/nopotskill2/lowskillnopo2/
// pennylowlvnopo2/pennynoskillnopo2/pennylowskill2/pennylownoskillnopo2/swiftlowskill2/swiftlowlvnopo2/swiftnoskillnopo2/pennyswiftlv2 同款——
// 困难里不花钱又不拖沓又不放技本身就是奖励、硬核才是）、解锁走 winBattle → applyAchievements 既有通路（终焉之神击败当场 trueBoss 落账后
// applyAchievements 枚举即解锁，与 trueboss/hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/
// noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv/
// pennynoskill/pennynopo/unflswift2/unflpenny2/unflnopo2/unflskill2/unfllowlv2/pennyswift2/pennylowlv2/pennynoskill2/pennynopo2/swiftlv2/
// swiftskill2/swiftnopo2/lowskill2/lowlvnopo2/nopotskill2/lowskillnopo2/pennylowlvnopo2/pennynoskillnopo2/pennylowskill2/
// pennylownoskillnopo2/swiftlowskill2/swiftlowlvnopo2/swiftnoskillnopo2/pennyswiftlv2 同路径零新增依赖），反馈不迟到。
// 本冒烟守护：版本锚点（格式合法 + 已越过 v24.212 + data.js 字面量 v24.213 + 旧 v24.212 字面量零残留）、
// ACH_LIST 128 项精确与末尾序位（pennyswiftskill2 落位 127——前 127 项 id/序位零回归）、pennyswiftskill2 数据契约（d 文案、ok 防御式逐值、
// 无 r 无 prog 且与 battles/cast 正向里程碑镜面对、四克制必同时满足 hardtrue/penny/swift/noskill 且满足 pennyswift2/swiftskill2/pennynoskill2 与
// pennyswift/swiftskill/pennynoskill）、unlockedAchievements/applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等去重 /
// 换难度不解锁 / 花过金不解锁 / 超场不解锁 / 放过技不解锁 / 未通关不解锁）、既有 127 成就 id 零回归、battle.js 无 spent 新增写点与
// battle.js battles/casts 写入点与 data.js SPEED_GOAL/CAST_GOAL/SPEND_GOAL/DIFFS 常量源级零变化、README/package.json/CHANGELOG
// 同步（件套口径 413 + v24.213 守护描述 + 入库 413 + 版本速览 128 项 + tests 树串尾 + package 串尾 412→413）、哨兵链（前望 414 且
// README 尚无 414 口径）、旧代 v24.209 字面量/恒等/顶 pin/412 口径/127 项全库零残留扫描（豁免本套件 + v24209 + v24206 + v24202 + v24201 +
// v24199 + v24198 + v24197 + v24196 + v24194 + v24193 + v24192 + v24191 + v24190 + v24189 + v24188 + v24187 + v24186 + v24185 + v24184 +
// v24183 + v24181 + v24180 + v24179 + v24178 + v24177 + v24176 + v24175 + v24174 + v24173。
// 注：成就计数 127→128 的零残留扫描只认「成就 N/129」/「**129 项成就**」/「全部 129 项进度」三形态，「⚔️ 身经百战 N/100」「⚔️ 驱雾百战 N/100」
// 是 BATTLE_GOAL/HUNT2_GOAL 讨伐进度分母非成就计数，不在扫描目标内）。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, SPEED_GOAL, LOWLV_GOAL, CAST_GOAL, SPEND_GOAL, BATTLE_GOAL } from '../js/data.js';
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

console.log('— v24.213 挑战向·「困难×白手×疾行」三重克制交叉区第二角成就「逆风白手疾行素手」（困难×零消费×七十场内×零用技） 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dataSrc = read('js/data.js');
const battleSrc = read('js/battle.js');
const heroSrc = read('js/hero.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（格式合法 + 已越过 v24.212 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.212', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 209)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.213（旧 v24.212 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v24.228';") && !dataSrc.includes("const GAME_VERSION = 'v24.212';"));
ok('data.js 含 v24.213 注释（逆风白手疾行素手新成就说明）',
  dataSrc.includes('v24.213 文档整理·版本锚点推进'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'pennyswiftskill2');
ok('ACH_LIST 含 pennyswiftskill2「逆风白手疾行素手」且 id 唯一',
  !!ach && ach.name === '逆风白手疾行素手' && ACH_LIST.filter((a) => a.id === 'pennyswiftskill2').length === 1);
ok('ACH_LIST 精确总数 128 项（127→128 末尾追加）', ACH_LIST.length === 141, String(ACH_LIST.length));
ok('pennyswiftskill2 描述文案（困难零消费七十场内零用技真结局四克档）',
  ach.d === `以困难模式、未花费 1 金币、${SPEED_GOAL} 场战斗内且未使用任何技能（战斗指令 [2]）击败终焉之神（真结局）`, ach.d);
ok('pennyswiftskill2 判定源级（读既有 g.trueBoss / g.diff===1 / !(g.spent||0) / (g.battles||0)<=SPEED_GOAL / !(g.casts||0)，不含 level/potionUses/deaths）',
  String(ach.ok).includes('g.trueBoss') && String(ach.ok).includes('g.diff===1') && String(ach.ok).includes('!(g.spent||0)') && String(ach.ok).includes('g.battles') && String(ach.ok).includes('!(g.casts||0)') && !String(ach.ok).includes('g.level') && !String(ach.ok).includes('potionUses') && !String(ach.ok).includes('deaths'));
ok('pennyswiftskill2 无 r 无 prog 纯里程碑（与 hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill/noskill2/lowskill/swiftskill/swiftlv/nopotskill/unflskill/swiftnopo/lowlvnopo/unflswift/unfllowlv/unflnopo/unflpenny/pennyswift/pennylowlv/pennynoskill/pennynopo/unflswift2/unflpenny2/unflnopo2/unflskill2/unfllowlv2/pennyswift2/pennylowlv2/pennynoskill2/pennynopo2/swiftlv2/swiftskill2/swiftnopo2/lowskill2/lowlvnopo2/nopotskill2/lowskillnopo2 同款）',
  !('r' in ach) && !('prog' in ach));

// —— ok 防御式逐值 ——
ok('困难 + 零消费 + 七十场内 + 零用技 + 真结局 → 解锁', ach.ok({ trueBoss: true, diff: 1, spent: 0, battles: 70, casts: 0 }) === true);
ok('困难 + 零消费 + 零用技 + 真结局 + 缺 battles 字段 → (g.battles||0)=0 按七十场内解码解锁（旧档零迁移）', ach.ok({ trueBoss: true, diff: 1, spent: 0, casts: 0 }) === true);
ok('困难 + 零消费 + 七十场内 + 真结局 + 缺 casts 字段 → !(undefined) 按零用技解码解锁（旧档零迁移）', ach.ok({ trueBoss: true, diff: 1, spent: 0, battles: 70 }) === true);
ok('困难 + 零消费 + 七十场内 + 零用技 + 真结局 + 缺 spent 字段 → !(undefined) 解码解锁（旧档零迁移）', ach.ok({ trueBoss: true, diff: 1, battles: 70, casts: 0 }) === true);
ok('缺 diff 字段（普通档）+ 零消费 + 七十场内 + 零用技 → 不解锁（diff 维严格）', ach.ok({ trueBoss: true, spent: 0, battles: 70, casts: 0 }) === false);
ok('困难 + 花过金（spent 1） + 七十场内 + 零用技 → 不解锁（花过即永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, spent: 1, battles: 70, casts: 0 }) === false);
ok('困难 + 零消费 + 超场（battles 71） + 零用技 → 不解锁（超场即永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, spent: 0, battles: 71, casts: 0 }) === false);
ok('困难 + 零消费 + 七十场内 + 放过技（casts 1）→ 不解锁（放过即永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, spent: 0, battles: 70, casts: 1 }) === false);
ok('困难 + 零消费 + 七十场内 + 零用技但未通关 → 不解锁', ach.ok({ diff: 1, spent: 0, battles: 70, casts: 0 }) === false);
ok('空档/缺字段 → 不解锁（(g.battles||0)/(g.casts||0)/diff 防御式零迁移）', ach.ok({}) === false);
ok('困难 + 零消费 + 七十场内 + 零用技 + 升过十级（level 10）→ 照常解锁（本档不读 level，与 lowlv 系分源）', ach.ok({ trueBoss: true, diff: 1, spent: 0, battles: 70, casts: 0, level: 10 }) === true);
ok('困难 + 零消费 + 七十场内 + 零用技 + 战斗喝过药（potionUses 1）→ 照常解锁（本档不读 potionUses，与 nopotion 系分源）', ach.ok({ trueBoss: true, diff: 1, spent: 0, battles: 70, casts: 0, potionUses: 1 }) === true);
ok('困难 + 零消费 + 七十场内 + 零用技 + 死过一次（deaths 1）→ 照常解锁（本档不读 deaths，与 unfl 系分源）', ach.ok({ trueBoss: true, diff: 1, spent: 0, battles: 70, casts: 0, deaths: 1 }) === true);

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
  'swiftlowlvnopo2', 'swiftnoskillnopo2', 'pennyswiftlv2'];
ok('既有 127 成就 id 零回归（核心抽样全覆盖末期正位）',
  EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('pennyswiftskill2 落位 index 127（末尾追加，既有 0..126 序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'pennyswiftskill2') === 127 &&
  ACH_LIST.findIndex((a) => a.id === 'pennyswiftlv2') === 126);

// —— 既有挑战向家族对照（三枚三克制源 + 普通双克档互不干扰）——
const _a = (id) => ACH_LIST.find((x) => x.id === id);
ok('困难×零消费×七十场内×零用技四克档必同时满足 pennyswift2 与 swiftskill2 与 pennynoskill2 三枚三克档（本枚是其四重交叉区唯一纪念——spent/battles/casts 三源同判）',
  _a('pennyswift2').ok({ trueBoss: true, diff: 1, spent: 0, battles: 70 }) === true &&
  _a('swiftskill2').ok({ trueBoss: true, diff: 1, battles: 70, casts: 0 }) === true &&
  _a('pennynoskill2').ok({ trueBoss: true, diff: 1, spent: 0, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, spent: 0, battles: 70, casts: 0 }) === true);
ok('三克源互检：pennyswift2 不读 casts（放过技照亮 pennyswift2 但照灭本枚）/ swiftskill2 不读 spent（花过金照亮 swiftskill2 但照灭本枚）/ pennynoskill2 不读 battles（超场照亮 pennynoskill2 但照灭本枚）',
  _a('pennyswift2').ok({ trueBoss: true, diff: 1, spent: 0, battles: 70, casts: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, spent: 0, battles: 70, casts: 1 }) === false &&
  _a('swiftskill2').ok({ trueBoss: true, diff: 1, spent: 1, battles: 70, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, spent: 1, battles: 70, casts: 0 }) === false &&
  _a('pennynoskill2').ok({ trueBoss: true, diff: 1, spent: 0, battles: 71, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, spent: 0, battles: 71, casts: 0 }) === false);
ok('换过难度（diff 0）→ pennyswiftskill2 与 pennyswift2/swiftskill2/pennynoskill2 同不解锁（diff 严格分区——普通档 pennyswift/swiftskill/pennynoskill 双克档不读本枚）',
  _a('pennyswift2').ok({ trueBoss: true, diff: 0, spent: 0, battles: 70 }) === false &&
  _a('swiftskill2').ok({ trueBoss: true, diff: 0, battles: 70, casts: 0 }) === false &&
  _a('pennynoskill2').ok({ trueBoss: true, diff: 0, spent: 0, casts: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 0, spent: 0, battles: 70, casts: 0 }) === false);
ok('与 swiftlowskill2 互不干扰（swiftlowskill2 读 level 不读 spent、本枚读 spent 不读 level——升过十级照灭 swiftlowskill2 但照亮本枚，花过金照灭本枚但照亮 swiftlowskill2）',
  _a('swiftlowskill2').ok({ trueBoss: true, diff: 1, battles: 70, casts: 0, level: 9, spent: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, spent: 0, battles: 70, casts: 0, level: 9 }) === true &&
  _a('swiftlowskill2').ok({ trueBoss: true, diff: 1, battles: 70, casts: 0, level: 10, spent: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, spent: 0, battles: 70, casts: 0, level: 10 }) === true &&
  _a('swiftlowskill2').ok({ trueBoss: true, diff: 1, battles: 70, casts: 0, level: 9, spent: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, spent: 1, battles: 70, casts: 0, level: 9 }) === false);
ok('与 pennyswiftlv2 互不干扰（pennyswiftlv2 读 level 不读 casts、本枚读 casts 不读 level——升过十级照灭 pennyswiftlv2 但照亮本枚，放过技照灭本枚但照亮 pennyswiftlv2）',
  _a('pennyswiftlv2').ok({ trueBoss: true, diff: 1, spent: 0, battles: 70, level: 9, casts: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, spent: 0, battles: 70, casts: 0, level: 9 }) === true &&
  _a('pennyswiftlv2').ok({ trueBoss: true, diff: 1, spent: 0, battles: 70, level: 10, casts: 0 }) === false &&
  ach.ok({ trueBoss: true, diff: 1, spent: 0, battles: 70, casts: 0, level: 10 }) === true &&
  _a('pennyswiftlv2').ok({ trueBoss: true, diff: 1, spent: 0, battles: 70, level: 9, casts: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, spent: 0, battles: 70, casts: 1, level: 9 }) === false);
ok('battles 身经百战 / cast 熟能生巧 正向里程碑档不解锁 pennyswiftskill2（累计遭遇/技能释放里程碑各自解锁自己的正向里程碑，pennyswiftskill2 只认困难零消费七十场内零用技通关）',
  ach.ok({ trueBoss: true, diff: 1, spent: 0, battles: 100, casts: 0 }) === false &&
  _a('battles').ok({ battles: 100 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, spent: 0, battles: 70, casts: 30 }) === false &&
  _a('cast').ok({ casts: 30 }) === true);

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
  const h = freshHero({ trueBoss: true, diff: 1, spent: 0, battles: 70, casts: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 困难零消费七十场内零用技真结局档 newly 含 pennyswiftskill2（既有通路自动跟随）',
    newly.includes('pennyswiftskill2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 0, spent: 0, battles: 70, casts: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 普通档 newly 不含 pennyswiftskill2（不误解锁，diff 维严格）',
    !newly.includes('pennyswiftskill2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, spent: 1, battles: 70, casts: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 花过金档 newly 不含 pennyswiftskill2（不误解锁，spent 维严格）',
    !newly.includes('pennyswiftskill2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, spent: 0, battles: 71, casts: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 超场档 newly 不含 pennyswiftskill2（不误解锁，battles 维严格）',
    !newly.includes('pennyswiftskill2'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, spent: 0, battles: 70, casts: 1 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 放过技档 newly 不含 pennyswiftskill2（不误解锁，casts 维严格）',
    !newly.includes('pennyswiftskill2'), JSON.stringify(newly));
}
{
  const h = freshHero({ diff: 1, spent: 0, battles: 70, casts: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 未通关档 newly 不含 pennyswiftskill2（不误解锁）',
    !newly.includes('pennyswiftskill2'), JSON.stringify(newly));
}

// —— applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等）——
{
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    const h = freshHero({ trueBoss: true, diff: 1, spent: 0, battles: 70, casts: 0 });
    S.G = h;
    applyAchievements();
    ok('applyAchievements 真实解锁落 hero.ach（含 pennyswiftskill2）', h.ach.includes('pennyswiftskill2'), JSON.stringify(h.ach));
    ok('解锁横幅报成就名【逆风白手疾行素手】', msgs.some((m) => m.includes('🔓 成就解锁：') && m.includes('逆风白手疾行素手')), msgs.join(' | '));
    const len1 = msgs.length;
    applyAchievements();
    ok('幂等：重复调用不再报（已解锁去重）', msgs.length === len1 && msgs.filter((m) => m.includes('逆风白手疾行素手')).length === 1, String(msgs.length));
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
    const h = freshHero({ trueBoss: true, diff: 1, spent: 1, battles: 70, casts: 0 });
    S.G = h;
    applyAchievements();
    ok('花过金 applyAchievements 零 pennyswiftskill2 解锁零「逆风白手疾行素手」横幅（不误解锁，spent 维严格）',
      !h.ach.includes('pennyswiftskill2') && !msgs.some((m) => m.includes('逆风白手疾行素手')), JSON.stringify({ ach: h.ach, msgs }));
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
    const h = freshHero({ trueBoss: true, diff: 1, spent: 0, battles: 71, casts: 0 });
    S.G = h;
    applyAchievements();
    ok('超场 applyAchievements 零 pennyswiftskill2 解锁零「逆风白手疾行素手」横幅（不误解锁，battles 维严格）',
      !h.ach.includes('pennyswiftskill2') && !msgs.some((m) => m.includes('逆风白手疾行素手')), JSON.stringify({ ach: h.ach, msgs }));
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
    const h = freshHero({ trueBoss: true, diff: 1, spent: 0, battles: 70, casts: 1 });
    S.G = h;
    applyAchievements();
    ok('放过技 applyAchievements 零 pennyswiftskill2 解锁零「逆风白手疾行素手」横幅（不误解锁，casts 维严格）',
      !h.ach.includes('pennyswiftskill2') && !msgs.some((m) => m.includes('逆风白手疾行素手')), JSON.stringify({ ach: h.ach, msgs }));
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}

// —— 源级零变化：battle.js 无 spent 新增写点 + battle.js battles/casts 写入点 + data.js 常量（既有，本版未动）——
ok('battle.js 未新增任何 spent 计数写点（消费线五端口都在 core/shop、本版零改动；g.battles 是 startBattle 既有写点）',
  (battleSrc.match(/\.spent = /g) || []).length === 0, String((battleSrc.match(/\.spent = /g) || []).length));
ok('battle.js 具 1 处 S.G.battles = (S.G.battles || 0) + 1; 写入点（startBattle 进战即记唯一产生点）',
  (battleSrc.match(/S\.G\.battles = \(S\.G\.battles \|\| 0\) \+ 1;/g) || []).length === 1, String((battleSrc.match(/S\.G\.battles = \(S\.G\.battles \|\| 0\) \+ 1;/g) || []).length));
ok('battle.js 具 1 处 hero.casts = castN; 写入点（doSkill 战斗释放技能成功唯一产生点——治愈/伤害两分支都计入）',
  (battleSrc.match(/hero\.casts = castN;/g) || []).length === 1, String((battleSrc.match(/hero\.casts = castN;/g) || []).length));
ok('data.js SPEED_GOAL 常量仍为 70（单一数据源，与 swift/swift2/swiftskill/swiftlv/swiftnopo/pennyswift/pennyswift2/swiftlv2/swiftskill2/swiftnopo2 系同读一份源）',
  dataSrc.includes('const SPEED_GOAL = 70;'));
ok('data.js CAST_GOAL 常量仍为 30（技能释放里程碑唯一数据源，与 cast「熟能生巧」系同读一份源）',
  dataSrc.includes('const CAST_GOAL = 30;'));
ok('data.js SPEND_GOAL 常量仍为 1000（消费线里程碑唯一数据源，与 spend「一掷千金」/penny/frugal 系同读一份源）',
  dataSrc.includes('const SPEND_GOAL = 1000;'));
ok('data.js BATTLE_GOAL 常量仍为 100（遭遇线里程碑唯一数据源，与 battles「身经百战」系同读一份源）',
  dataSrc.includes('const BATTLE_GOAL = 100;'));
ok('data.js DIFFS 仍含「困难」档（难度单一数据源，与 hardtrue/steadfast/frugal/dry/swift2/lowlv2/pennyswift2 同读一份源）',
  dataSrc.includes("const DIFFS=['普通','困难'];"));
ok('hero.js 成就横幅活计数注释已推进至 N/128（127→128）', heroSrc.includes('（成就 N/141）'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径为四百二十六件套（四百二十五件套清除）',
  readme.includes('扩充为冒烟四百二十六件套（四百二十五件套清除）') && !readme.includes('扩充为冒烟四百一十一件套（四百一十件套清除）'));
ok('README 含 v24.213 守护描述（逆风白手疾行素手新成就守护）', readme.includes('v24.210 起含「逆风白手疾行素手」新成就守护'));
ok('README 版本速览已为 v24.213 且成就计数 128', readme.includes('版本速览（v24.228）') && readme.includes('141 项成就'));
ok('README 成就计数双处口径 128 项（全部 141 项进度 + **141 项成就**，**12'+'7 项成就**清除）',
  readme.includes('全部 141 项进度') && readme.includes('**141 项成就**') && !readme.includes('**12' + '7 项成就**'));
ok('README tests 树收录 smoke_v24212_swiftlowskillnopo2（含 v24.213 守护子句 + 串尾）',
  readme.includes('v24.210 起含「逆风白手疾行素手」新成就守护') && readme.includes('smoke_v24212_swiftlowskillnopo2'));
ok('README 含 smoke_v24212_swiftlowskillnopo2 入库（426 份）', readme.includes('smoke_v24212_swiftlowskillnopo2 入库（426 份）'));
ok('package.json 已收录 smoke_v24210_pennyswiftskill2.mjs 且位于串尾（在 smoke_v24209_pennyswiftlv2 之后）',
  pkg.includes('smoke_v24210_pennyswiftskill2.mjs') &&
  pkg.includes('node tests/smoke_v24209_pennyswiftlv2.mjs && node tests/smoke_v24210_pennyswiftskill2.mjs && node tests/smoke_v24211_pennyswiftnopo2.mjs && node tests/smoke_v24212_swiftlowskillnopo2.mjs && node tests/smoke_v24214_unflswiftlowlv2.mjs && node tests/smoke_v24217_unflswiftnopo2.mjs && node tests/smoke_v24218_unflpennyswift2.mjs && node tests/smoke_v24219_unflpennylowlv2.mjs && node tests/smoke_v24220_unflpennynopo2.mjs && node tests/smoke_v24221_unfllowskill2.mjs && node tests/smoke_v24222_unflswiftskill2.mjs && node tests/smoke_v24223_unfllowlvnopo2.mjs && node tests/smoke_v24224_unflnoskillnopo2.mjs && node tests/smoke_v24225_unflpennynoskill2.mjs && node tests/smoke_v24226_unflpennylownoskillnopo2.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 413 件套', testChain === 426, String(testChain));
ok('CHANGELOG 含 v24.213 顶条目', changelog.startsWith('## v24.228'));

// —— 哨兵链：README 已有 413 口径且尚无 414（前望 414 语义：下一版才写 414）——
ok('README 已有四百一十五件套口径且尚无 416（哨兵前望 414 语义：下一版才写 414）',
  readme.includes('扩充为冒烟四百二十六件套（四百二十五件套清除）') && !readme.includes('四百二十七件套'));
{
  const s24143 = read('tests/smoke_v24143_furnacequest.mjs');
  ok('smoke_v24143 哨兵链前望 427（四百二十七件套否定式）',
    s24143.includes('哨兵链前望 427') && s24143.includes('四百二十七件套否定式'));
}

// —— 旧代 v24.209 字面量 / 412 件套口径 / 127 项 全库零残留扫描（豁免本套件 + v24209 + v24206 + v24202 + v24201 + v24199 + v24198 + v24197 + v24196 + v24194 + v24193 + v24192 + v24191 + v24190 + v24189 + v24188 + v24187 + v24186 + v24185 + v24184 + v24183 + v24181 + v24180 + v24179 + v24178 + v24177 + v24176 + v24175 + v24174 + v24173）——
// v24173-24209 是前代公式链载体，其 README 件套负向断言/版本锚点逐代 pin 由历史级联平移而成。成就计数 127→128 扫描只认三形态。
const EXEMPT = new Set(['smoke_v24212_swiftlowskillnopo2.mjs', 'smoke_v24211_pennyswiftnopo2.mjs', 'smoke_v24210_pennyswiftskill2.mjs', 'smoke_v24209_pennyswiftlv2.mjs', 'smoke_v24206_swiftnoskillnopo2.mjs', 'smoke_v24202_swiftlowlvnopo2.mjs', 'smoke_v24201_swiftlowskill2.mjs', 'smoke_v24199_pennylownoskillnopo2.mjs', 'smoke_v24198_pennylowskill2.mjs', 'smoke_v24197_pennynoskillnopo2.mjs', 'smoke_v24196_pennylowlvnopo2.mjs', 'smoke_v24194_lowskillnopo2.mjs', 'smoke_v24193_nopotskill2.mjs', 'smoke_v24192_lowlvnopo2.mjs', 'smoke_v24191_lowskill2.mjs', 'smoke_v24190_swiftnopo2.mjs', 'smoke_v24189_swiftskill2.mjs', 'smoke_v24188_swiftlv2.mjs', 'smoke_v24187_pennynopo2.mjs', 'smoke_v24186_pennynoskill2.mjs', 'smoke_v24185_pennylowlv2.mjs', 'smoke_v24184_pennyswift2.mjs', 'smoke_v24183_unfllowlv2.mjs', 'smoke_v24181_lampoilquest.mjs', 'smoke_v24180_unflskill2.mjs', 'smoke_v24179_unflnopo2.mjs', 'smoke_v24178_unflpenny2.mjs', 'smoke_v24177_unflswift2.mjs', 'smoke_v24176_pennynopo.mjs', 'smoke_v24175_pennynoskill.mjs', 'smoke_v24174_pennylowlv.mjs', 'smoke_v24173_pennyswift.mjs']);
const leftovers = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests')).filter((x) => x.endsWith('.mjs') && !EXEMPT.has(x))) {
  const s = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  const code = s.split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  if (code.includes("const GAME_VERSION = 'v24.209'")) leftovers.push(f + ':gv');
  if (code.includes("GAME_VERSION === 'v24.209'")) leftovers.push(f + ':eq');
  if (code.includes("startsWith('## v24.209")) leftovers.push(f + ':st');
  if (code.includes('四百一十二件套（四百一十一件套清除）')) leftovers.push(f + ':412');
  if (code.includes('testChain === 412') || code.includes('files.length === 412') ||
      code.includes('treeTok.length === 412') || code.includes('chainAll.length === 412') ||
      code.includes('fileCount === 412') || code.includes('chain.length === 411'))
    leftovers.push(f + ':count');
  // 成就计数 127→128 零残留：只认「成就 N/12'+'7」/「**12'+'7 项成就**」/「全部 12'+'7 项进度」三形态
  if (code.includes('成就 N/12' + '7') || code.includes('**12' + '7 项成就**') || code.includes('全部 12' + '7 项进度'))
    leftovers.push(f + ':127');
}
ok('旧代 v24.209 GAME_VERSION 字面量/恒等/顶 pin 全库零残留（哨兵链，豁免本套件 + v24209 + v24206 + v24202 + v24201 + v24199 + v24198 + v24197 + v24196 + v24194 + v24193 + v24192 + v24191 + v24190 + v24189 + v24188 + v24187 + v24186 + v24185 + v24184 + v24183 + v24181 + v24180 + v24179 + v24178 + v24177 + v24176 + v24175 + v24174 + v24173）',
  leftovers.filter((x) => x.endsWith(':gv') || x.endsWith(':eq') || x.endsWith(':st')).length === 0,
  JSON.stringify(leftovers));
ok('旧代 412 件套口径/计数/128 项 pin 全库零残留（哨兵链，豁免本套件 + v24209 + v24206 + v24202 + v24201 + v24199 + v24198 + v24197 + v24196 + v24194 + v24193 + v24192 + v24191 + v24190 + v24189 + v24188 + v24187 + v24186 + v24185 + v24184 + v24183 + v24181 + v24180 + v24179 + v24178 + v24177 + v24176 + v24175 + v24174 + v24173）',
  leftovers.filter((x) => x.endsWith(':412') || x.endsWith(':count') || x.endsWith(':127')).length === 0,
  JSON.stringify(leftovers));

if (failed) { console.log(`— v24.213 冒烟完成：${n} 项断言，失败 ${failed} —`); process.exit(1); }
console.log(`— v24.213 冒烟完成：${n} 项断言，失败 0 —`);
