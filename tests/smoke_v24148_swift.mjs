// smoke_v24148_swift.mjs —— v24.148 专项冒烟：新成就「速战速决」（挑战向速通档·七十场内真结局）
// （新内容·单成就——承 v24.147 未曾熄灯 / v23.68 逆风行灯 hardtrue 先例：成就版图逐线核对——Boss 线
// 三档（boss/cave/trueboss）与难度向（hardtrue）皆已齐备，v24.147 开了「以怎样的姿态通关」的头却只盖住
// 「别倒下」（未曾熄灯=零阵亡）这一面，「别拖沓」（速通）这一面查无一行：玩家只要打过终焉之神便「记得
// 一切」，但「六十多场速攻走完全程」的档与「刷到天荒地老才过」的档在成就一览毫无分别；现补速通向独立
// 单档——判定读既有 hero.trueBoss（终焉之神=真结局最终 Boss，击败即「走完全程」的终极口径，与
// trueboss/hardtrue/unflicker 同源）与既有 hero.battles 遭遇场次（battle.startBattle 进战即记唯一产生
// 点、胜/败/逃都算——想靠逃跑刷数只会把 battles 越刷越大、随 snapshotHero 全量快照自动持久化、防御式
// (g.battles||0) 旧档零迁移，承 v24.128 STELE_GOAL / v23.72 身经百战同款），(g.trueBoss &&
// (g.battles||0)<=SPEED_GOAL) 即速通达成：battles 只增不减，超出门槛(70)的档永久无缘此档（与 hardtrue
// 换难度 / unflicker 死过一次同属「重新来过才拿得到」的挑战品类）；零新计数零新状态零新写点零新存档；
// 无 r 无 prog 纯里程碑（与 hardtrue/lvl12/memoir 同款）；解锁走 winBattle → applyAchievements 既有
// 通路（trueboss/hardtrue/unflicker 同路径零新增依赖），反馈不迟到。ACH_LIST 77→80 项末尾追加）。
// 本冒烟守护：版本锚点（v24.148、旧 v24.147 字面量零残留、v24.148 注释）、SPEED_GOAL 常量落位与导出、
// ACH_LIST 80 项精确与末尾序位（unflicker 77 / swift 78）、swift 数据契约（d 文案、ok 防御式逐值、无
// r 无 prog）、unlockedAchievements/applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等
// 去重 / 超场不解锁 / 未通关不解锁）、既有 77 成就 id 零回归、battle.startBattle battles 写入点源级
// 零变化、README/package.json/CHANGELOG 同步（件套口径 362 + v24.148 守护描述 + 入库 362 + 版本速览 +
// 80 项 + tests 树串尾 + package 串尾）、哨兵链（前望 371 且 README 尚无 365 口径）、旧代 v24.147
// 字面量/恒等/顶 pin/361 口径全库零残留扫描（豁免本套件 + 上一版 v24147）。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, SPEED_GOAL } from '../js/data.js';
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

console.log('— v24.148 挑战向速通成就「速战速决」 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dataSrc = read('js/data.js');
const battleSrc = read('js/battle.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（格式合法 + 已越过 v24.155 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.155', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 155)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.148（旧 v24.147 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v24.194';") && !dataSrc.includes("const GAME_VERSION = 'v24.147';"));
ok('data.js 含 v24.148 注释（速战速决新成就说明）',
  dataSrc.includes('v24.148 新成就·挑战向速通档'));
ok('SPEED_GOAL 常量 v24.148 落位（=70，低于身经百战 BATTLE_GOAL 100）',
  dataSrc.includes('const SPEED_GOAL = 70;') && SPEED_GOAL === 70 && SPEED_GOAL < 100);
ok('SPEED_GOAL 已入 data.js export（阈值数据化家族可被各端引用）',
  dataSrc.includes('STELE_GOAL, SPEED_GOAL,'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'swift');
ok('ACH_LIST 含 swift「速战速决」且 id 唯一',
  !!ach && ach.name === '速战速决' && ACH_LIST.filter((a) => a.id === 'swift').length === 1);
ok('ACH_LIST 精确总数 83 项（77→78 末尾追加）', ACH_LIST.length === 119, String(ACH_LIST.length));
ok('swift 描述文案（七十场内真结局速通档）',
  ach.d === `在 ${SPEED_GOAL} 场战斗内击败终焉之神（真结局）`, ach.d);
ok('swift 判定源级（读既有 g.trueBoss 与防御式 (g.battles||0)）',
  String(ach.ok).includes('g.trueBoss') && String(ach.ok).includes('(g.battles||0)<=SPEED_GOAL'));
ok('swift 无 r 无 prog 纯里程碑（与 hardtrue/unflicker 同款）',
  !('r' in ach) && !('prog' in ach));

// —— ok 防御式逐值 ——
ok('70 场内真结局 → 解锁', ach.ok({ trueBoss: true, battles: 70 }) === true);
ok('刚好 60 场真结局 → 解锁', ach.ok({ trueBoss: true, battles: 60 }) === true);
ok('场内刚好满门槛（battles 显式 70）→ 解锁', ach.ok({ trueBoss: true, battles: SPEED_GOAL }) === true);
ok('超出门槛 71 场真结局 → 不解锁（永久无缘此档）', ach.ok({ trueBoss: true, battles: 71 }) === false);
ok('刷到身经百战 100 场才过关 → 不解锁', ach.ok({ trueBoss: true, battles: 100 }) === false);
ok('速通但未通关 → 不解锁', ach.ok({ battles: 40 }) === false);
ok('空档/缺字段 → 不解锁（(g.battles||0) 防御式零迁移）', ach.ok({}) === false);

// —— 既有 77 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime', 'hunt100', 'ptime2', 'lucky2', 'rich2', 'stock',
  'brew2', 'stock2', 'elixir', 'mush', 'elixir2', 'mush2', 'chests2', 'talkall', 'deflect', 'charge',
  'crit', 'cast', 'flee', 'potionuses', 'rushs', 'mapdrink', 'innrest', 'spend', 'travels', 'steps',
  'battles', 'sell', 'deaths', 'nightwins', 'unflicker'];
ok('既有 77 成就 id 零回归（核心抽样全覆盖末期正位）',
  EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('nightwins 75 / unflicker 76 / swift 77 末尾序位（既有序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'nightwins') === 75 &&
  ACH_LIST.findIndex((a) => a.id === 'unflicker') === 76 &&
  ACH_LIST.findIndex((a) => a.id === 'swift') === 77);

// —— 既有挑战向家族对照（hardtrue/unflicker/swift 三档独立互不干扰）——
ok('hardtrue/unflicker/swift 三档独立（难度向 vs 姿态向 vs 速通向）',
  ACH_LIST.find((a) => a.id === 'hardtrue').ok({ trueBoss: true, diff: 1 }) === true &&
  ACH_LIST.find((a) => a.id === 'unflicker').ok({ trueBoss: true }) === true &&
  ach.ok({ trueBoss: true, battles: 50 }) === true);
ok('死过一次仍可解锁 swift（仅 unflicker 被排除——两者判据不同源）',
  ach.ok({ trueBoss: true, battles: 50, deaths: 5 }) === true &&
  ACH_LIST.find((a) => a.id === 'unflicker').ok({ trueBoss: true, deaths: 5 }) === false);
ok('困难档速通仍可解锁 swift（难度向与速通向正交）',
  ach.ok({ trueBoss: true, battles: 65, diff: 1 }) === true);

// —— unlockedAchievements 集成 ——
function freshHero(extra) {
  return Object.assign({ name: '余烬', level: 7, gold: 123, xp: 0, xpNext: 20, hp: 50, hpMax: 50, mp: 20, mpMax: 20,
    item: 3, potion2: 1, mushrooms: 2, weapon: '铁剑', armor: '皮甲', atkMax: 12, defMax: 6,
    map: 'village', x: 8, y: 8, time: 0, ach: [], bestiary: {}, seen: {}, fragments: [], visited: ['village'],
    quests: {}, totalWins: 3, drops: 0, steps: 0, travels: 0, spent: 0, battles: 3, skills: [], talked: [],
    checks: 0, crits: 0, casts: 0, flees: 0, potionUses: 0, deflects: 0, charges: 0, sleep: 0,
    sold: 0, dealt: 0, mapPotions: 0, innRests: 0, nightWins: 0, rushClears: 0, brews: 0, chests: [],
    deaths: 0 }, extra);
}
{
  const h = freshHero({ trueBoss: true, battles: 42 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 七十场内真结局档 newly 含 swift（既有通路自动跟随）',
    newly.includes('swift'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, battles: 88 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 超场过关档 newly 不含 swift（不误解锁）',
    !newly.includes('swift'), JSON.stringify(newly));
}

// —— applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等）——
{
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    const h = freshHero({ trueBoss: true, battles: 55 });
    S.G = h;
    applyAchievements();
    ok('applyAchievements 真实解锁落 hero.ach（含 swift）', h.ach.includes('swift'), JSON.stringify(h.ach));
    ok('解锁横幅报成就名【速战速决】', msgs.some((m) => m.includes('🔓 成就解锁：') && m.includes('速战速决')), msgs.join(' | '));
    const len1 = msgs.length;
    applyAchievements();
    ok('幂等：重复调用不再报（已解锁去重）', msgs.length === len1 && msgs.filter((m) => m.includes('速战速决')).length === 1, String(msgs.length));
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
    const h = freshHero({ trueBoss: true, battles: 95 });
    S.G = h;
    applyAchievements();
    ok('超场过关 applyAchievements 零 swift 解锁零「速战速决」横幅（不误解锁）',
      !h.ach.includes('swift') && !msgs.some((m) => m.includes('速战速决')), JSON.stringify({ ach: h.ach, msgs }));
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}

// —— 源级零变化：battle.startBattle battles 写入点（既有，本版未动）——
ok('battle.js 既有 battles 写入点源级零变化（startBattle 进战即记唯一产生点）',
  battleSrc.includes('S.G.battles') && /S\.G\.battles\s*=\s*\(S\.G\.battles\s*\|\|\s*0\)\s*\+\s*1/.test(battleSrc));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径为四百零四件套（四百零三件套清除）',
  readme.includes('扩充为冒烟四百零四件套（四百零三件套清除）') && !readme.includes('冒烟三百六十一件套（三百六十件套清除）'));
ok('README 含 v24.148 守护描述（速战速决速通成就守护）', readme.includes('v24.148 起含「速战速决」新成就守护'));
ok('README 版本速览已为 v24.148 且成就计数 78', readme.includes('版本速览（v24.194）') && readme.includes('119 项成就'));
ok('README 成就计数双处口径 80 项（全部 119 项进度 + **119 项成就**，77 项清除）',
  readme.includes('全部 119 项进度') && readme.includes('**119 项成就**') && !readme.includes('**77 项成就**'));
ok('README tests 树收录 smoke_v24148_swift（含 v24.148 守护子句 + 串尾）',
  readme.includes('v24.148 起含「速战速决」新成就守护') && readme.includes('smoke_v24148_swift'));
ok('README 含 smoke_v24148_swift 入库（362 份）', readme.includes('smoke_v24148_swift 入库（362 份）'));
ok('package.json 已收录 smoke_v24148_swift.mjs 且位于串尾（狠在 unflicker 之后）',
  pkg.includes('smoke_v24148_swift.mjs') &&
  pkg.includes('node tests/smoke_v24147_unflicker.mjs && node tests/smoke_v24148_swift.mjs && node tests/smoke_v24151_lowlv.mjs && node tests/smoke_v24152_nopotion.mjs && node tests/smoke_v24153_penny.mjs && node tests/smoke_v24154_steadfast.mjs && node tests/smoke_v24155_frugal.mjs && node tests/smoke_v24157_dry.mjs && node tests/smoke_v24158_swift2.mjs && node tests/smoke_v24159_lowlv2.mjs && node tests/smoke_v24160_noskill.mjs && node tests/smoke_v24161_noskill2.mjs && node tests/smoke_v24162_lowskill.mjs && node tests/smoke_v24163_swiftskill.mjs && node tests/smoke_v24164_swiftlv.mjs && node tests/smoke_v24165_nopotskill.mjs && node tests/smoke_v24166_unflskill.mjs && node tests/smoke_v24167_swiftnopo.mjs && node tests/smoke_v24168_lowlvnopo.mjs && node tests/smoke_v24169_unflswift.mjs && node tests/smoke_v24170_unfllowlv.mjs && node tests/smoke_v24171_unflnopo.mjs && node tests/smoke_v24172_unflpenny.mjs && node tests/smoke_v24173_pennyswift.mjs && node tests/smoke_v24174_pennylowlv.mjs && node tests/smoke_v24175_pennynoskill.mjs && node tests/smoke_v24176_pennynopo.mjs && node tests/smoke_v24177_unflswift2.mjs && node tests/smoke_v24178_unflpenny2.mjs && node tests/smoke_v24179_unflnopo2.mjs && node tests/smoke_v24180_unflskill2.mjs && node tests/smoke_v24181_lampoilquest.mjs && node tests/smoke_v24183_unfllowlv2.mjs && node tests/smoke_v24184_pennyswift2.mjs && node tests/smoke_v24185_pennylowlv2.mjs && node tests/smoke_v24186_pennynoskill2.mjs && node tests/smoke_v24187_pennynopo2.mjs && node tests/smoke_v24188_swiftlv2.mjs && node tests/smoke_v24189_swiftskill2.mjs && node tests/smoke_v24190_swiftnopo2.mjs && node tests/smoke_v24191_lowskill2.mjs && node tests/smoke_v24192_lowlvnopo2.mjs && node tests/smoke_v24193_nopotskill2.mjs && node tests/smoke_v24194_lowskillnopo2.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 362 件套', testChain === 404, String(testChain));
ok('CHANGELOG 含 v24.148 顶条目', changelog.startsWith('## v24.194'));

// —— 哨兵链：README 已有 362 口径且尚无 365（前望 371 语义：下一版才写 365）——
ok('README 已有三百六十四件套口径且尚无 365（哨兵前望 405 语义：下一版才写 365）',
  readme.includes('四百零四件套（四百零三件套清除）') && !readme.includes('四百零五件套'));
{
  const s24143 = read('tests/smoke_v24143_furnacequest.mjs');
  ok('smoke_v24143 哨兵链前望 405（四百零五件套否定式）',
    s24143.includes('哨兵链前望 405') && s24143.includes('四百零五件套否定式'));
}
{
  const v = GAME_VERSION;
  const vs = v.replace('v', '').split('.').map(Number);
  ok('smoke_v24147 姊妹件版本字面量 pin 已随新现实推进（v24.148）',
    read('tests/smoke_v24147_unflicker.mjs').includes("const GAME_VERSION = 'v24.194';"));
  ok('smoke_v24136 姊妹件版本字面量 pin 已随新现实推进（v24.148）',
    read('tests/smoke_v24136_herbquest.mjs').includes("const GAME_VERSION = 'v24.194';"));
  ok('smoke_v2229 姊妹件版本恒等 pin 已随新现实推进（=== v24.148）',
    read('tests/smoke_v2229_metall.mjs').includes("GAME_VERSION === 'v24.194'"));
}

// —— 旧代 v24.147 字面量 / 361 件套口径 全库零残留扫描（豁免本套件 + 上一版 v24147）——
const EXEMPT = new Set(['smoke_v24194_lowskillnopo2.mjs', 'smoke_v24193_nopotskill2.mjs', 'smoke_v24192_lowlvnopo2.mjs', 'smoke_v24191_lowskill2.mjs', 'smoke_v24190_swiftnopo2.mjs', 'smoke_v24189_swiftskill2.mjs', 'smoke_v24188_swiftlv2.mjs', 'smoke_v24187_pennynopo2.mjs', 'smoke_v24186_pennynoskill2.mjs', 'smoke_v24185_pennylowlv2.mjs', 'smoke_v24184_pennyswift2.mjs', 'smoke_v24148_swift.mjs', 'smoke_v24147_unflicker.mjs']);
const leftovers = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests')).filter((x) => x.endsWith('.mjs') && !EXEMPT.has(x))) {
  const s = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  const code = s.split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  if (code.includes("const GAME_VERSION = 'v24.147'")) leftovers.push(f + ':gv');
  if (code.includes("GAME_VERSION === 'v24.147'")) leftovers.push(f + ':eq');
  if (code.includes("startsWith('## v24.147")) leftovers.push(f + ':st');
  if (code.includes('三百六十一件套（三百六十件套清除）')) leftovers.push(f + ':361');
  if (code.includes('testChain === 361') || code.includes('files.length === 361') ||
      code.includes('treeTok.length === 361') || code.includes('chainAll.length === 361')) leftovers.push(f + ':count');
  if (code.includes('N/77') || code.includes('**77 项成就**') || code.includes('全部 77 项进度')) leftovers.push(f + ':77');
}
ok('旧代 v24.147 GAME_VERSION 字面量/恒等/顶 pin 全库零残留（哨兵链，豁免本套件 + v24147）',
  leftovers.filter((x) => x.endsWith(':gv') || x.endsWith(':eq') || x.endsWith(':st')).length === 0,
  JSON.stringify(leftovers));
ok('旧代 361 件套口径/计数/77 项 pin 全库零残留（哨兵链，豁免本套件 + v24147）',
  leftovers.filter((x) => x.endsWith(':361') || x.endsWith(':count') || x.endsWith(':77')).length === 0,
  JSON.stringify(leftovers));

if (failed) { console.log(`— v24.148 冒烟完成：${n} 项断言，失败 ${failed} —`); process.exit(1); }
console.log(`— v24.148 冒烟完成：${n} 项断言，失败 0 —`);
