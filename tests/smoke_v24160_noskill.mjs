// smoke_v24160_noskill.mjs —— v24.160 专项冒烟：新成就「大巧不工」（挑战向零用技通关档·未用任何技能击败终焉之神）
// （新内容·单成就——承 v24.159 逆风青芽 / v24.158 逆风疾行 / v24.157 滴药未沾 / v24.155 两袖清风 /
// v24.154 逆风不灭 / v24.153 白手成灯 / v24.152 药囊未启 / v24.151 未及十级 / v24.148 速战速决 /
// v24.147 未曾熄灯 / v23.68 逆风行灯先例：「以怎样的姿态通关」挑战维度第十一次开垦——此前十轮盖住了
// 「别倒下/别拖沓/别练级/别嗑药/别花钱」五姿态与其困难复合五面，「别用技」这一面查无一行：玩家只要打过
// 终焉之神便「记得一切」，但「全程一个技能都没放过」的拙档与「战战开场先上三层 buff」的档在成就一览毫无
// 分别。判定读既有 hero.trueBoss（终焉之神=真结局最终 Boss，与 trueboss/hardtrue/unflicker/swift/lowlv/
// nopotion/penny/steadfast/frugal/dry/swift2/lowlv2 同源）与既有 hero.casts（battle.doSkill [2]技能
// 释放成功唯一产生点——治愈与伤害两分支都计、MP 不足/被封印拦截未出手不计、随 snapshotHero 全量快照自动
// 持久化、防御式 (g.casts||0) 旧档零迁移，与 cast「熟能生巧」/side_song「战歌的谱」同读一份源），
// (g.trueBoss && !(g.casts||0)) 即「零用技通关」达成——casts 只增不减，任何一场战斗放过一个技能就永久
// 无缘此档（与 hardtrue 换难度 / unflicker 死过一次 / swift 超场 / lowlv 升过十级 / nopotion 用过药 /
// penny 花过金 / steadfast 死过一次 / frugal 花过金 / dry 用过药 / swift2 超场 / lowlv2 升过十级同属
// 「重新来过才拿得到」的挑战品类）。本冒烟守护：版本锚点（格式合法 + 已越过 v24.159 + data.js 字面量
// v24.160 + 旧 v24.159 零残留）、ACH_LIST 89 项精确与末尾序位（unflicker 76 / swift 77 / lowlv 78 /
// nopotion 79 / penny 80 / steadfast 81 / frugal 82 / dry 83 / swift2 84 / lowlv2 85 / noskill 86）、
// noskill 数据契约（d 文案、ok 防御式逐值、无 r 无 prog 且与 cast 正向里程碑镜面对）、
// unlockedAchievements/applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等去重 / 用过技不解锁 /
// 未通关不解锁）、既有 86 成就 id 零回归、hero.js casts 写入点与 data.js CAST_GOAL 常量源级零变化、
// README/package.json/CHANGELOG 同步（件套口径 371 + v24.160 守护描述 + 入库 371 + 版本速览 89 项 + tests
// 树串尾 + package 串尾 371）、哨兵链（前望 375 且 README 尚无 372 口径）、旧代 v24.159 字面量/恒等/顶 pin/
// 370 口径/86 项 全库零残留扫描（豁免本套件 + 上一版 v24159 + 上上版 v24158）。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, CAST_GOAL } from '../js/data.js';
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

console.log('— v24.160 挑战向零用技通关成就「大巧不工」 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dataSrc = read('js/data.js');
const battleSrc = read('js/battle.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（格式合法 + 已越过 v24.159 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.159', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 159)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.160（旧 v24.159 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v24.163';") && !dataSrc.includes("const GAME_VERSION = 'v24.159';"));
ok('data.js 含 v24.160 注释（大巧不工新成就说明）',
  dataSrc.includes('v24.160 新内容·新成就'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'noskill');
ok('ACH_LIST 含 noskill「大巧不工」且 id 唯一',
  !!ach && ach.name === '大巧不工' && ACH_LIST.filter((a) => a.id === 'noskill').length === 1);
ok('ACH_LIST 精确总数 89 项（86→87 末尾追加）', ACH_LIST.length === 90, String(ACH_LIST.length));
ok('noskill 描述文案（未使用任何技能真结局档）',
  ach.d === '未使用任何技能（战斗指令 [2]）击败终焉之神（真结局）', ach.d);
ok('noskill 判定源级（读既有 g.trueBoss / 防御式 !(g.casts||0)）',
  String(ach.ok).includes('g.trueBoss') && String(ach.ok).includes('!(g.casts||0)'));
ok('noskill 无 r 无 prog 纯里程碑（与 hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2 同款）',
  !('r' in ach) && !('prog' in ach));

// —— ok 防御式逐值 ——
ok('真结局 + 零用技 → 解锁', ach.ok({ trueBoss: true, casts: 0 }) === true);
ok('真结局 + 缺 casts 字段仅 trueBoss → 按 0 解码（旧档零迁移）', ach.ok({ trueBoss: true }) === true);
ok('真结局 + 放过 1 次技 → 不解锁（永久无缘此档）', ach.ok({ trueBoss: true, casts: 1 }) === false);
ok('真结局 + 放过 N 次技 → 不解锁', ach.ok({ trueBoss: true, casts: CAST_GOAL }) === false);
ok('零用技但未通关 → 不解锁', ach.ok({ casts: 0 }) === false);
ok('空档/缺字段 → 不解锁（(g.casts||0) 防御式零迁移）', ach.ok({}) === false);

// —— 既有 86 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime', 'hunt100', 'ptime2', 'lucky2', 'rich2', 'stock',
  'brew2', 'stock2', 'elixir', 'mush', 'elixir2', 'mush2', 'metall', 'rich3', 'ptime3', 'hunt3',
  'lucky3', 'stock3', 'elixir3', 'brew3', 'mush3', 'outstep', 'outstep2', 'scholar2', 'seen', 'seen2',
  'chests2', 'talkall', 'deflect', 'charge', 'crit', 'cast', 'flee', 'potionuses', 'rushs', 'mapdrink',
  'innrest', 'spend', 'travels', 'steps', 'battles', 'sell', 'deaths', 'nightwins', 'unflicker', 'swift',
  'lowlv', 'nopotion', 'penny', 'steadfast', 'frugal', 'dry', 'swift2', 'lowlv2'];
ok('既有 86 成就 id 零回归（核心抽样全覆盖末期正位）',
  EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('nightwins 75 / unflicker 76 / swift 77 / lowlv 78 / nopotion 79 / penny 80 / steadfast 81 / frugal 82 / dry 83 / swift2 84 / lowlv2 85 / noskill 86 末尾序位（既有序位零位移）',
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
  ACH_LIST.findIndex((a) => a.id === 'noskill') === 86);

// —— 既有挑战向家族对照（hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill 十二档独立互不干扰）——
const _a = (id) => ACH_LIST.find((x) => x.id === id);
ok('hardtrue/unflicker/swift/lowlv/nopotion/penny/steadfast/frugal/dry/swift2/lowlv2/noskill 十二档独立（难度 vs 姿态 vs 速通 vs 低等级 vs 零用药 vs 零消费 vs 硬核 vs 硬核复合四态 vs 零用技）',
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
  ach.ok({ trueBoss: true, casts: 0 }) === true);
ok('真结局 + 零用技 + 用过药不解锁 nopotion（仅 noskill 亮——casts 与 potionUses 分源互不干扰）',
  ach.ok({ trueBoss: true, casts: 0, potionUses: 3 }) === true &&
  _a('nopotion').ok({ trueBoss: true, casts: 0, potionUses: 3 }) === false);
ok('真结局 + 放过技（casts 1）仍可解锁 hardtrue（仅 noskill 被排除——hardtrue 只认困难打过、不认用技与否）',
  _a('hardtrue').ok({ trueBoss: true, diff: 1, casts: 9 }) === true &&
  ach.ok({ trueBoss: true, diff: 1, casts: 9 }) === false);
ok('cast 正向里程碑档不解锁 noskill（casts 达 CAST_GOAL 正向纪念、noskill 无 prog——正向与零用技各占一位）',
  ach.ok({ trueBoss: true, casts: CAST_GOAL }) === false &&
  _a('cast').ok({ casts: CAST_GOAL }) === true &&
  'prog' in _a('cast') && !('prog' in ach));
ok('零用技真结局 + 满释放计数仍只解 noskill（casts 计数与 noskill 判据无关——只认真结局+零技）',
  ach.ok({ trueBoss: true, casts: 0, battles: 999 }) === true);

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
  const h = freshHero({ trueBoss: true, casts: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 零用技真结局档 newly 含 noskill（既有通路自动跟随）',
    newly.includes('noskill'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, casts: 2 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 用过技档 newly 不含 noskill（不误解锁）',
    !newly.includes('noskill'), JSON.stringify(newly));
}
{
  const h = freshHero({ casts: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 未通关档 newly 不含 noskill（不误解锁）',
    !newly.includes('noskill'), JSON.stringify(newly));
}

// —— applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等）——
{
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    const h = freshHero({ trueBoss: true, casts: 0 });
    S.G = h;
    applyAchievements();
    ok('applyAchievements 真实解锁落 hero.ach（含 noskill）', h.ach.includes('noskill'), JSON.stringify(h.ach));
    ok('解锁横幅报成就名【大巧不工】', msgs.some((m) => m.includes('🔓 成就解锁：') && m.includes('大巧不工')), msgs.join(' | '));
    const len1 = msgs.length;
    applyAchievements();
    ok('幂等：重复调用不再报（已解锁去重）', msgs.length === len1 && msgs.filter((m) => m.includes('大巧不工')).length === 1, String(msgs.length));
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
    const h = freshHero({ trueBoss: true, casts: 3 });
    S.G = h;
    applyAchievements();
    ok('用过技 applyAchievements 零 noskill 解锁零「大巧不工」横幅（不误解锁）',
      !h.ach.includes('noskill') && !msgs.some((m) => m.includes('大巧不工')), JSON.stringify({ ach: h.ach, msgs }));
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}

// —— 源级零变化：battle.js casts 写入点与 data.js CAST_GOAL 常量（既有，本版未动）——
ok('battle.js 具 1 处 hero.casts = castN 写入点（doSkill 释放成功唯一产生点）',
  (battleSrc.match(/hero\.casts = castN;/g) || []).length === 1, String((battleSrc.match(/hero\.casts = castN;/g) || []).length));
ok('data.js CAST_GOAL 常量仍为 30（单一数据源，与 cast/side_song 同读一份源）',
  dataSrc.includes('const CAST_GOAL = 30;'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径为三百七十四件套（三百七十三件套清除）',
  readme.includes('扩充为冒烟三百七十四件套（三百七十三件套清除）') && !readme.includes('扩充为冒烟三百七十件套（三百六十九件套清除）'));
ok('README 含 v24.160 守护描述（大巧不工新成就守护）', readme.includes('v24.160 起含「大巧不工」新成就守护'));
ok('README 版本速览已为 v24.163 且成就计数 90', readme.includes('版本速览（v24.163）') && readme.includes('90 项成就'));
ok('README 成就计数双处口径 89 项（全部 90 项进度 + **90 项成就**，86 项清除）',
  readme.includes('全部 90 项进度') && readme.includes('**90 项成就**') && !readme.includes('**86 项成就**'));
ok('README tests 树收录 smoke_v24160_noskill（含 v24.160 守护子句 + 串尾）',
  readme.includes('v24.160 起含「大巧不工」新成就守护') && readme.includes('smoke_v24160_noskill'));
ok('README 含 smoke_v24160_noskill 入库（371 份）', readme.includes('smoke_v24160_noskill 入库（371 份）'));
ok('package.json 已收录 smoke_v24160_noskill.mjs 且位于串尾（在 lowlv2 之后）',
  pkg.includes('smoke_v24160_noskill.mjs') &&
  pkg.includes('node tests/smoke_v24159_lowlv2.mjs && node tests/smoke_v24160_noskill.mjs && node tests/smoke_v24161_noskill2.mjs && node tests/smoke_v24162_lowskill.mjs && node tests/smoke_v24163_swiftskill.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 371 件套', testChain === 374, String(testChain));
ok('CHANGELOG 含 v24.160 顶条目', changelog.startsWith('## v24.163'));

// —— 哨兵链：README 已有 371 口径且尚无 372（前望 375 语义：下一版才写 372）——
ok('README 已有三百七十五件套口径且尚无 372（哨兵前望 375 语义：下一版才写 372）',
  readme.includes('扩充为冒烟三百七十四件套（三百七十三件套清除）') && !readme.includes('三百七十五件套'));
{
  const s24143 = read('tests/smoke_v24143_furnacequest.mjs');
  ok('smoke_v24143 哨兵链前望 375（三百七十五件套否定式）',
    s24143.includes('哨兵链前望 375') && s24143.includes('三百七十五件套否定式'));
}
{
  ok('smoke_v24159 姊妹件版本字面量 pin 已随新现实推进（v24.160）',
    read('tests/smoke_v24159_lowlv2.mjs').includes("const GAME_VERSION = 'v24.163';"));
  ok('smoke_v24158 姊妹件版本字面量 pin 已随新现实推进（v24.160）',
    read('tests/smoke_v24158_swift2.mjs').includes("const GAME_VERSION = 'v24.163';"));
  ok('smoke_v24157 姊妹件版本字面量 pin 已随新现实推进（v24.160）',
    read('tests/smoke_v24157_dry.mjs').includes("const GAME_VERSION = 'v24.163';"));
  ok('smoke_v24155 姊妹件版本字面量 pin 已随新现实推进（v24.160）',
    read('tests/smoke_v24155_frugal.mjs').includes("const GAME_VERSION = 'v24.163';"));
  ok('smoke_v24154 姊妹件版本字面量 pin 已随新现实推进（v24.160）',
    read('tests/smoke_v24154_steadfast.mjs').includes("const GAME_VERSION = 'v24.163';"));
  ok('smoke_v24153 姊妹件版本字面量 pin 已随新现实推进（v24.160）',
    read('tests/smoke_v24153_penny.mjs').includes("const GAME_VERSION = 'v24.163';"));
  ok('smoke_v24152 姊妹件版本字面量 pin 已随新现实推进（v24.160）',
    read('tests/smoke_v24152_nopotion.mjs').includes("const GAME_VERSION = 'v24.163';"));
  ok('smoke_v2229 姊妹件版本恒等 pin 已随新现实推进（=== v24.160）',
    read('tests/smoke_v2229_metall.mjs').includes("GAME_VERSION === 'v24.163'"));
}

// —— 旧代 v24.159 字面量 / 370 件套口径 / 86 项 全库零残留扫描（豁免本套件 + 上一版 v24159 + 上上版 v24158）——
const EXEMPT = new Set(['smoke_v24160_noskill.mjs', 'smoke_v24159_lowlv2.mjs', 'smoke_v24158_swift2.mjs']);
const leftovers = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests')).filter((x) => x.endsWith('.mjs') && !EXEMPT.has(x))) {
  const s = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  const code = s.split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  if (code.includes("const GAME_VERSION = 'v24.159'")) leftovers.push(f + ':gv');
  if (code.includes("GAME_VERSION === 'v24.159'")) leftovers.push(f + ':eq');
  if (code.includes("startsWith('## v24.159")) leftovers.push(f + ':st');
  if (code.includes('三百七十件套（三百六十九件套清除）')) leftovers.push(f + ':370');
  if (code.includes('testChain === 370') || code.includes('files.length === 370') ||
      code.includes('treeTok.length === 370') || code.includes('chainAll.length === 370')) leftovers.push(f + ':count');
  if (code.includes('N/86') || code.includes('**86 项成就**') || code.includes('全部 86 项进度')) leftovers.push(f + ':86');
}
ok('旧代 v24.159 GAME_VERSION 字面量/恒等/顶 pin 全库零残留（哨兵链，豁免本套件 + v24159 + v24158）',
  leftovers.filter((x) => x.endsWith(':gv') || x.endsWith(':eq') || x.endsWith(':st')).length === 0,
  JSON.stringify(leftovers));
ok('旧代 370 件套口径/计数/86 项 pin 全库零残留（哨兵链，豁免本套件 + v24159 + v24158）',
  leftovers.filter((x) => x.endsWith(':370') || x.endsWith(':count') || x.endsWith(':86')).length === 0,
  JSON.stringify(leftovers));

if (failed) { console.log(`— v24.160 冒烟完成：${n} 项断言，失败 ${failed} —`); process.exit(1); }
console.log(`— v24.160 冒烟完成：${n} 项断言，失败 0 —`);
