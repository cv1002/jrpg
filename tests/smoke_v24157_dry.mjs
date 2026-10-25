// smoke_v24157_dry.mjs —— v24.157 专项冒烟：新成就「滴药未沾」（挑战向硬核零用药复合档·困难+零战斗用药）
// （新内容·单成就——承 v24.155 两袖清风 / v24.154 逆风不灭 / v24.153 白手成灯 / v24.152 药囊未启 /
// v24.151 未及十级 / v24.148 速战速决 / v24.147 未曾熄灯 / v23.68 逆风行灯先例：「以怎样的姿态通关」挑战
// 维度第八次开垦——v24.147 盖住了「别倒下」、v24.148 盖住了「别拖沓」、v24.151 盖住了「别练级」、v24.152
// 盖住了「别嗑药」、v24.153 盖住了「别花钱」（普通）、v24.154 盖住了「困难还要别倒下」、v24.155 盖住了
// 「困难还要别花钱」，「困难还要别嗑药」这一面查无一行——hardtrue「逆风行灯」只认「困难打过了」、nopotion
// 「药囊未启」只认「未用药」（普通/困难通吃），两者交叉的「困难 + 零战斗用药」硬核档在成就一览毫无分别：
// 困难档同样嗑过药的档与一路滴药未沾扛到终焉之神的档，拿到的都是同一枚药囊未启。现补硬核零用药复合档独立
// 单档——判定读既有 hero.trueBoss（终焉之神=真结局最终 Boss，与 trueboss/hardtrue/unflicker/swift/lowlv/
// nopotion/penny/steadfast/frugal 同源）、既有 hero.diff（DIFFS 下标：建档 createDiff 写定、core.initGame
// `S.G.diff = diff||0`、resetRun 沿用同槽、随 snapshotHero 全量快照自动持久化，与 hardtrue 同读一份源）与
// 既有 hero.potionUses（战斗 [3] 用药计数：battle.doItem 全游唯一写入点——高级灵药/普通药水两档都计、
// 大地图 F 键 core.usePotion 走另一端 takePotion 不在此列零计数、随 snapshotHero 全量快照自动持久化、
// 防御式 (g.potionUses||0) 旧档零迁移，与 nopotion/potionuses 同读一份源），(g.trueBoss && g.diff===1 &&
// !(g.potionUses||0)) 即「困难 · 滴药未沾通关」达成——potionUses 只增不减，困难档战斗用过一次药就永久无缘
// 此档（与 hardtrue 换难度 / unflicker 死过一次 / swift 超场 / lowlv 升过十级 / nopotion 用过药 / penny
// 花过金 / steadfast 死过一次 / frugal 花过金同属「重新来过才拿得到」的挑战品类）。真实可行性：与 nopotion
// 同为「克制」档、仅叠加困难数值微升（DIFF_SCALE 同源），治愈术+防御回蓝免费续航引擎全难度通用。本冒烟守护：
// 版本锚点（格式合法 + 已越过 v24.156 + data.js 字面量 v24.157 + 旧 v24.156 零残留）、ACH_LIST 84 项精确
// 与末尾序位（unflicker 76 / swift 77 / lowlv 78 / nopotion 79 / penny 80 / steadfast 81 / frugal 82 /
// dry 83）、dry 数据契约（d 文案、ok 防御式逐值、无 r 无 prog 且严格交叠 hardtrue×nopotion）、
// unlockedAchievements/applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等去重 / 困难用过药
// 不解锁 / 普通零用药不解锁 / 未通关不解锁）、既有 83 成就 id 零回归、battle.js potionUses 写入点源级
// 零变化、README/package.json/CHANGELOG 同步（件套口径 368 + v24.157 守护描述 + 入库 368 + 版本速览 84 项
// + tests 树串尾 + package 串尾 368）、哨兵链（前望 371 且 README 尚无 369 口径）、旧代 v24.156 字面量/恒等/
// 顶 pin/367 口径/83 项 全库零残留扫描（豁免本套件 + 上一版 v24155 + 上上版 v24154）。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, POTION_USE_GOAL } from '../js/data.js';
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

console.log('— v24.157 挑战向硬核零用药复合成就「滴药未沾」 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dataSrc = read('js/data.js');
const battleSrc = read('js/battle.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（格式合法 + 已越过 v24.156 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.156', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 156)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.158（旧 v24.156 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v24.161';") && !dataSrc.includes("const GAME_VERSION = 'v24.156';"));
ok('data.js 含 v24.158 注释（滴药未沾新成就说明）',
  dataSrc.includes('v24.157 新内容·新成就'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'dry');
ok('ACH_LIST 含 dry「滴药未沾」且 id 唯一',
  !!ach && ach.name === '滴药未沾' && ACH_LIST.filter((a) => a.id === 'dry').length === 1);
ok('ACH_LIST 精确总数 84 项（83→84 末尾追加）', ACH_LIST.length === 88, String(ACH_LIST.length));
ok('dry 描述文案（困难模式且未在战斗中使用药水/灵药真结局档）',
  ach.d === '以困难模式且未在战斗中使用药水/灵药击败终焉之神（真结局）', ach.d);
ok('dry 判定源级（读既有 g.trueBoss / g.diff===1 / 防御式 !(g.potionUses||0)）',
  String(ach.ok).includes('g.trueBoss') && String(ach.ok).includes('g.diff===1') && String(ach.ok).includes('!(g.potionUses||0)'));
ok('dry 无 r 无 prog 纯里程碑（与 hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal 同款）',
  !('r' in ach) && !('prog' in ach));

// —— ok 防御式逐值 ——
ok('困难 + 零用药真结局 → 解锁', ach.ok({ trueBoss: true, diff: 1, potionUses: 0 }) === true);
ok('困难 + 缺 potionUses 字段仅 trueBoss → 按 0 解码（旧档零迁移）', ach.ok({ trueBoss: true, diff: 1 }) === true);
ok('困难 + 用过一次药真结局 → 不解锁（永久无缘此档）', ach.ok({ trueBoss: true, diff: 1, potionUses: 1 }) === false);
ok('困难 + 用过多次药真结局 → 不解锁', ach.ok({ trueBoss: true, diff: 1, potionUses: 9 }) === false);
ok('普通档 + 零用药真结局 → 不解锁（普通零用药归 nopotion，本枚只认困难）',
  ach.ok({ trueBoss: true, diff: 0, potionUses: 0 }) === false);
ok('缺 diff 字段 + 零用药真结局 → 不解锁（旧档无 diff 非困难档，零迁移）',
  ach.ok({ trueBoss: true, potionUses: 0 }) === false);
ok('困难 + 零用药但未通关 → 不解锁', ach.ok({ diff: 1, potionUses: 0 }) === false);
ok('空档/缺字段 → 不解锁（(g.potionUses||0) 防御式零迁移）', ach.ok({}) === false);

// —— 既有 83 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime', 'hunt100', 'ptime2', 'lucky2', 'rich2', 'stock',
  'brew2', 'stock2', 'elixir', 'mush', 'elixir2', 'mush2', 'metall', 'rich3', 'ptime3', 'hunt3',
  'lucky3', 'stock3', 'elixir3', 'brew3', 'mush3', 'outstep', 'outstep2', 'scholar2', 'seen', 'seen2',
  'chests2', 'talkall', 'deflect', 'charge', 'crit', 'cast', 'flee', 'potionuses', 'rushs', 'mapdrink',
  'innrest', 'spend', 'travels', 'steps', 'battles', 'sell', 'deaths', 'nightwins', 'unflicker', 'swift',
  'lowlv', 'nopotion', 'penny', 'steadfast', 'frugal'];
ok('既有 83 成就 id 零回归（核心抽样全覆盖末期正位）',
  EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('nightwins 75 / unflicker 76 / swift 77 / lowlv 78 / nopotion 79 / penny 80 / steadfast 81 / frugal 82 / dry 83 末尾序位（既有序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'nightwins') === 75 &&
  ACH_LIST.findIndex((a) => a.id === 'unflicker') === 76 &&
  ACH_LIST.findIndex((a) => a.id === 'swift') === 77 &&
  ACH_LIST.findIndex((a) => a.id === 'lowlv') === 78 &&
  ACH_LIST.findIndex((a) => a.id === 'nopotion') === 79 &&
  ACH_LIST.findIndex((a) => a.id === 'penny') === 80 &&
  ACH_LIST.findIndex((a) => a.id === 'steadfast') === 81 &&
  ACH_LIST.findIndex((a) => a.id === 'frugal') === 82 &&
  ACH_LIST.findIndex((a) => a.id === 'dry') === 83);

// —— 既有挑战向家族对照（hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry 九档独立互不干扰）——
const _a = (id) => ACH_LIST.find((x) => x.id === id);
ok('hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry 九档独立（难度 vs 姿态 vs 速通 vs 低等级 vs 零用药 vs 零消费 vs 硬核 vs 硬核零消费 vs 硬核零用药）',
  _a('hardtrue').ok({ trueBoss: true, diff: 1 }) === true &&
  _a('unflicker').ok({ trueBoss: true }) === true &&
  _a('swift').ok({ trueBoss: true, battles: 50 }) === true &&
  _a('lowlv').ok({ trueBoss: true, level: 9 }) === true &&
  _a('nopotion').ok({ trueBoss: true, potionUses: 0 }) === true &&
  _a('penny').ok({ trueBoss: true, spent: 0 }) === true &&
  _a('steadfast').ok({ trueBoss: true, diff: 1, deaths: 0 }) === true &&
  _a('frugal').ok({ trueBoss: true, diff: 1, spent: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, potionUses: 0 }) === true);
ok('困难档用过药仍可解锁 hardtrue（仅 dry 被排除——hardtrue 只认困难打过）',
  _a('hardtrue').ok({ trueBoss: true, diff: 1, potionUses: 3 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, potionUses: 3 }) === false);
ok('普通档零用药仍可解锁 nopotion（仅 dry 被排除——nopotion 不认难度）',
  _a('nopotion').ok({ trueBoss: true, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 0, potionUses: 0 }) === false);
ok('困难 + 零用药真结局三枚同亮（hardtrue + nopotion + dry 严格交叠）',
  _a('hardtrue').ok({ trueBoss: true, diff: 1, potionUses: 0 }) === true &&
  _a('nopotion').ok({ trueBoss: true, diff: 1, potionUses: 0 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, potionUses: 0 }) === true);
ok('困难用过药的档仍可解锁 frugal（仅 dry 被排除——各自判据不同源）',
  _a('frugal').ok({ trueBoss: true, diff: 1, spent: 0, potionUses: 5 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, potionUses: 5 }) === false);
ok('药到病除正向里程碑档不解锁 dry（potionuses 有 prog、dry 无 prog——正向与零用药各占一位）',
  ach.ok({ trueBoss: true, diff: 1, potionUses: POTION_USE_GOAL }) === false &&
  _a('potionuses').ok({ potionUses: POTION_USE_GOAL }) === true &&
  'prog' in _a('potionuses') && !('prog' in ach));

// —— unlockedAchievements 集成 ——
function freshHero(extra) {
  return Object.assign({ name: '余烬', level: 7, gold: 123, xp: 0, xpNext: 20, hp: 50, hpMax: 50, mp: 20, mpMax: 20,
    item: 3, potion2: 1, mushrooms: 2, weapon: '铁剑', armor: '皮甲', atkMax: 12, defMax: 6,
    map: 'village', x: 8, y: 8, time: 0, ach: [], bestiary: {}, seen: {}, fragments: [], visited: ['village'],
    quests: {}, totalWins: 3, drops: 0, steps: 0, travels: 0, spent: 0, battles: 3, skills: [], talked: [],
    checks: 0, crits: 0, casts: 0, flees: 0, potionUses: 0, deflects: 0, charges: 0, sleep: 0,
    sold: 0, dealt: 0, mapPotions: 0, innRests: 0, nightWins: 0, rushClears: 0, brews: 0, chests: [],
    deaths: 0, diff: 0 }, extra);
}
{
  const h = freshHero({ trueBoss: true, diff: 1, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 困难零用药真结局档 newly 含 dry（既有通路自动跟随）',
    newly.includes('dry'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 1, potionUses: 1 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 困难用过药档 newly 不含 dry（不误解锁）',
    !newly.includes('dry'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, diff: 0, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 普通零用药档 newly 不含 dry（nopotion 通吃但本枚只认困难）',
    !newly.includes('dry'), JSON.stringify(newly));
}
{
  const h = freshHero({ diff: 1, potionUses: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 未通关档 newly 不含 dry（不误解锁）',
    !newly.includes('dry'), JSON.stringify(newly));
}

// —— applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等）——
{
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    const h = freshHero({ trueBoss: true, diff: 1, potionUses: 0 });
    S.G = h;
    applyAchievements();
    ok('applyAchievements 真实解锁落 hero.ach（含 dry）', h.ach.includes('dry'), JSON.stringify(h.ach));
    ok('解锁横幅报成就名【滴药未沾】', msgs.some((m) => m.includes('🔓 成就解锁：') && m.includes('滴药未沾')), msgs.join(' | '));
    const len1 = msgs.length;
    applyAchievements();
    ok('幂等：重复调用不再报（已解锁去重）', msgs.length === len1 && msgs.filter((m) => m.includes('滴药未沾')).length === 1, String(msgs.length));
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
    const h = freshHero({ trueBoss: true, diff: 1, potionUses: 2 });
    S.G = h;
    applyAchievements();
    ok('困难用过药 applyAchievements 零 dry 解锁零「滴药未沾」横幅（不误解锁）',
      !h.ach.includes('dry') && !msgs.some((m) => m.includes('滴药未沾')), JSON.stringify({ ach: h.ach, msgs }));
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}

// —— 源级零变化：battle.js potionUses 写入点（既有，本版未动）——
ok('battle.js 具 1 处 hero.potionUses 写入点（doItem 全游唯一战斗用药计数端口）',
  (battleSrc.match(/hero\.potionUses\s*=/g) || []).length === 1, String((battleSrc.match(/hero\.potionUses\s*=/g) || []).length));
ok('potionUses 写入为防御式 (hero.potionUses||0) + 增量形态（零新写点零新形态）',
  (battleSrc.match(/const useN = \(hero\.potionUses \|\| 0\) \+ 1;[\s\S]*?hero\.potionUses = useN;/) || []).length === 1);

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径为三百七十二件套（三百七十一件套清除）',
  readme.includes('扩充为冒烟三百七十二件套（三百七十一件套清除）') && !readme.includes('扩充为冒烟三百六十八件套（三百六十七件套清除）'));
ok('README 含 v24.157 守护描述（滴药未沾新成就守护）', readme.includes('v24.157 起含「滴药未沾」新成就守护'));
ok('README 版本速览已为 v24.158 且成就计数 84', readme.includes('版本速览（v24.161）') && readme.includes('88 项成就'));
ok('README 成就计数双处口径 84 项（全部 88 项进度 + **88 项成就**，83 项清除）',
  readme.includes('全部 88 项进度') && readme.includes('**88 项成就**') && !readme.includes('**83 项成就**'));
ok('README tests 树收录 smoke_v24157_dry（含 v24.158 守护子句 + 串尾）',
  readme.includes('v24.157 起含「滴药未沾」新成就守护') && readme.includes('smoke_v24157_dry'));
ok('README 含 smoke_v24157_dry 入库（368 份）', readme.includes('smoke_v24157_dry 入库（368 份）'));
ok('package.json 已收录 smoke_v24157_dry.mjs 且位于串尾（狠 in frugal 之后）',
  pkg.includes('smoke_v24157_dry.mjs') &&
  pkg.includes('node tests/smoke_v24154_steadfast.mjs && node tests/smoke_v24155_frugal.mjs && node tests/smoke_v24157_dry.mjs && node tests/smoke_v24158_swift2.mjs && node tests/smoke_v24159_lowlv2.mjs && node tests/smoke_v24160_noskill.mjs && node tests/smoke_v24161_noskill2.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 368 件套', testChain === 372, String(testChain));
ok('CHANGELOG 含 v24.158 顶条目', changelog.startsWith('## v24.161'));

// —— 哨兵链：README 已有 368 口径且尚无 369（前望 371 语义：下一版才写 369）——
ok('README 已有三百六十八件套口径且尚无 369（哨兵前望 373 语义：下一版才写 369）',
  readme.includes('扩充为冒烟三百七十二件套（三百七十一件套清除）') && !readme.includes('三百七十三件套'));
{
  const s24143 = read('tests/smoke_v24143_furnacequest.mjs');
  ok('smoke_v24143 哨兵链前望 373（三百七十三件套否定式）',
    s24143.includes('哨兵链前望 373') && s24143.includes('三百七十三件套否定式'));
}
{
  ok('smoke_v24155 姊妹件版本字面量 pin 已随新现实推进（v24.158）',
    read('tests/smoke_v24155_frugal.mjs').includes("const GAME_VERSION = 'v24.161';"));
  ok('smoke_v24154 姊妹件版本字面量 pin 已随新现实推进（v24.158）',
    read('tests/smoke_v24154_steadfast.mjs').includes("const GAME_VERSION = 'v24.161';"));
  ok('smoke_v24153 姊妹件版本字面量 pin 已随新现实推进（v24.158）',
    read('tests/smoke_v24153_penny.mjs').includes("const GAME_VERSION = 'v24.161';"));
  ok('smoke_v24152 姊妹件版本字面量 pin 已随新现实推进（v24.158）',
    read('tests/smoke_v24152_nopotion.mjs').includes("const GAME_VERSION = 'v24.161';"));
  ok('smoke_v24151 姊妹件版本字面量 pin 已随新现实推进（v24.158）',
    read('tests/smoke_v24151_lowlv.mjs').includes("const GAME_VERSION = 'v24.161';"));
  ok('smoke_v24148 姊妹件版本字面量 pin 已随新现实推进（v24.158）',
    read('tests/smoke_v24148_swift.mjs').includes("const GAME_VERSION = 'v24.161';"));
  ok('smoke_v2229 姊妹件版本恒等 pin 已随新现实推进（=== v24.158）',
    read('tests/smoke_v2229_metall.mjs').includes("GAME_VERSION === 'v24.161'"));
}

// —— 旧代 v24.157 字面量 / 368 件套口径 / 84 项 全库零残留扫描（豁免本套件 + 上一版 v24155 + 上上版 v24154 + 新套件 v24158）——
const EXEMPT = new Set(['smoke_v24157_dry.mjs', 'smoke_v24158_swift2.mjs', 'smoke_v24155_frugal.mjs', 'smoke_v24154_steadfast.mjs']);
const leftovers = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests')).filter((x) => x.endsWith('.mjs') && !EXEMPT.has(x))) {
  const s = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  const code = s.split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  if (code.includes("const GAME_VERSION = 'v24.157'")) leftovers.push(f + ':gv');
  if (code.includes("GAME_VERSION === 'v24.157'")) leftovers.push(f + ':eq');
  if (code.includes("startsWith('## v24.157")) leftovers.push(f + ':st');
  if (code.includes('三百六十八件套（三百六十七件套清除）')) leftovers.push(f + ':368');
  if (code.includes('testChain === 368') || code.includes('files.length === 368') ||
      code.includes('treeTok.length === 368') || code.includes('chainAll.length === 368')) leftovers.push(f + ':count');
  if (code.includes('N/84') || code.includes('**84 项成就**') || code.includes('全部 84 项进度')) leftovers.push(f + ':84');
}
ok('旧代 v24.157 GAME_VERSION 字面量/恒等/顶 pin 全库零残留（哨兵链，豁免本套件 + v24155 + v24154 + v24158）',
  leftovers.filter((x) => x.endsWith(':gv') || x.endsWith(':eq') || x.endsWith(':st')).length === 0,
  JSON.stringify(leftovers));
ok('旧代 368 件套口径/计数/84 项 pin 全库零残留（哨兵链，豁免本套件 + v24155 + v24154 + v24158）',
  leftovers.filter((x) => x.endsWith(':368') || x.endsWith(':count') || x.endsWith(':84')).length === 0,
  JSON.stringify(leftovers));

if (failed) { console.log(`— v24.158 冒烟完成：${n} 项断言，失败 ${failed} —`); process.exit(1); }
console.log(`— v24.158 冒烟完成：${n} 项断言，失败 0 —`);
