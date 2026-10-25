// smoke_v24147_unflicker.mjs —— v24.147 专项冒烟：新成就「未曾熄灯」（挑战向收官里程碑·零阵亡真结局）
// （新内容·单成就——承 v23.68 逆风行灯 hardtrue 先例：成就版图逐线核对——Boss 线三档
// （boss/cave/trueboss）与难度向（hardtrue）皆已齐备，唯独「以怎样的姿态通关」这一挑战维度查无一行：
// 玩家只要打过终焉之神便「记得一切」，但「一次都没倒下就走完全程」的档与死过十几次才过的档在成就
// 一览毫无分别；现补挑战向独立单档——判定读既有 hero.trueBoss（终焉之神=真结局最终 Boss，击败即
// 「走完全程」的终极口径，与 trueboss/hardtrue 同源）与既有 hero.deaths 阵亡计数（battle.loseBattle
// 全游唯一战败结算点写入、随 snapshotHero 全量快照自动持久化、防御式 (g.deaths||0) 旧档零迁移，承
// v23.87 deaths 同款），(g.trueBoss && !(g.deaths||0)) 即「全程零阵亡」达成；死过一次的档永久无缘
// 此档（与 hardtrue 换难度同属「重新来过才拿得到」的挑战品类）；零新计数零新状态零新写点零新存档；
// 无 r 无 prog 纯里程碑（与 hardtrue/lvl12/memoir 同款）；解锁走 winBattle → applyAchievements 既有
// 通路（trueboss/hardtrue 同路径零新增依赖），反馈不迟到。ACH_LIST 76→80 项末尾追加）。
// 本冒烟守护：版本锚点（v24.147、旧 v24.146 字面量零残留、v24.147 注释）、ACH_LIST 80 项精确与末尾
// 序位（nightwins 76 / unflicker 77）、unflicker 数据契约（d 文案、ok 防御式逐值、无 r 无 prog）、
// unlockedAchievements/applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等去重 / 死过
// 不误解锁）、既有 76 成就 id 零回归、battle.loseBattle deaths 写入点源级零变化、README/package.json/
// CHANGELOG 同步（件套口径 361 + v24.147 守护描述 + 入库 361 + 版本速览 + 80 项双处 + tests 树串尾 +
// package 串尾）、哨兵链（前望 371 且 README 尚无 365 口径）、旧代 v24.146 字面量/恒等/顶 pin/360 口径
// 全库零残留扫描（豁免本套件）。
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

console.log('— v24.147 挑战向里程碑成就「未曾熄灯」 冒烟 —');

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
ok('data.js GAME_VERSION 字面量已为 v24.147（旧 v24.146 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v24.159';") && !dataSrc.includes("const GAME_VERSION = 'v24.147';"));
ok('data.js 含 v24.147 注释（未曾熄灯新成就说明）',
  dataSrc.includes('v24.147 新成就·挑战向收官里程碑'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'unflicker');
ok('ACH_LIST 含 unflicker「未曾熄灯」且 id 唯一',
  !!ach && ach.name === '未曾熄灯' && ACH_LIST.filter((a) => a.id === 'unflicker').length === 1);
ok('ACH_LIST 精确总数 83 项（76→77 末尾追加）', ACH_LIST.length === 86, String(ACH_LIST.length));
ok('unflicker 描述文案（零阵亡真结局挑战档）',
  ach.d === '一次冒险中未阵亡击败终焉之神（真结局）', ach.d);
ok('unflicker 判定源级（读既有 g.trueBoss 与防御式 (g.deaths||0)）',
  String(ach.ok).includes('g.trueBoss') && String(ach.ok).includes('(g.deaths||0)'));
ok('unflicker 无 r 无 prog 纯里程碑（与 hardtrue/lvl12/memoir 同款）',
  !('r' in ach) && !('prog' in ach));

// —— ok 防御式逐值 ——
ok('零阵亡真结局 → 解锁', ach.ok({ trueBoss: true }) === true);
ok('零阵亡真结局（deaths 显式 0）→ 解锁', ach.ok({ trueBoss: true, deaths: 0 }) === true);
ok('死过一次真结局 → 不解锁（永久无缘此档）', ach.ok({ trueBoss: true, deaths: 1 }) === false);
ok('死过十几次真结局 → 不解锁', ach.ok({ trueBoss: true, deaths: 10 }) === false);
ok('零阵亡未通关 → 不解锁', ach.ok({ deaths: 0 }) === false);
ok('空档/缺字段 → 不解锁（(g.deaths||0) 防御式零迁移）', ach.ok({}) === false);

// —— 既有 76 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime', 'hunt100', 'ptime2', 'lucky2', 'rich2', 'stock',
  'brew2', 'stock2', 'elixir', 'mush', 'elixir2', 'mush2', 'chests2', 'talkall', 'deflect', 'charge',
  'crit', 'cast', 'flee', 'potionuses', 'rushs', 'mapdrink', 'innrest', 'spend', 'travels', 'steps',
  'battles', 'sell', 'deaths', 'nightwins'];
ok('既有 76 成就 id 零回归（核心抽样全覆盖末期正位）',
  EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('nightwins 76 / unflicker 77 末尾序位（既有序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'nightwins') === 75 &&
  ACH_LIST.findIndex((a) => a.id === 'unflicker') === 76);

// —— 既有 hardtrue 对照（同「挑战向」家族互不干扰）——
ok('hardtrue 与 unflicker 双档独立（难度向 vs 姿态向）',
  ACH_LIST.find((a) => a.id === 'hardtrue').ok({ trueBoss: true, diff: 1 }) === true &&
  ach.ok({ trueBoss: true, diff: 1 }) === true);
ok('死过一次仍可解锁 hardtrue（仅 unflicker 被排除——两者判据不同源）',
  ACH_LIST.find((a) => a.id === 'hardtrue').ok({ trueBoss: true, diff: 1, deaths: 5 }) === true &&
  ach.ok({ trueBoss: true, deaths: 5 }) === false);

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
  const h = freshHero({ trueBoss: true });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 零阵亡真结局档 newly 含 unflicker（既有通路自动跟随）',
    newly.includes('unflicker'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, deaths: 1 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 死过一次档 newly 不含 unflicker（不误解锁）',
    !newly.includes('unflicker'), JSON.stringify(newly));
}

// —— applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等）——
{
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    const h = freshHero({ trueBoss: true });
    S.G = h;
    applyAchievements();
    ok('applyAchievements 真实解锁落 hero.ach（含 unflicker）', h.ach.includes('unflicker'), JSON.stringify(h.ach));
    ok('解锁横幅报成就名【未曾熄灯】', msgs.some((m) => m.includes('🔓 成就解锁：') && m.includes('未曾熄灯')), msgs.join(' | '));
    const len1 = msgs.length;
    applyAchievements();
    ok('幂等：重复调用不再报（已解锁去重）', msgs.length === len1 && msgs.filter((m) => m.includes('未曾熄灯')).length === 1, String(msgs.length));
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
    const h = freshHero({ trueBoss: true, deaths: 3 });
    S.G = h;
    applyAchievements();
    ok('死过三次 applyAchievements 零 unflicker 解锁零「未曾熄灯」横幅（不误解锁）',
      !h.ach.includes('unflicker') && !msgs.some((m) => m.includes('未曾熄灯')), JSON.stringify({ ach: h.ach, msgs }));
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}

// —— 源级零变化：battle.loseBattle deaths 写入点（既有，本版未动）——
ok('battle.js 既有 deaths 写入点源级零变化（loseBattle 战败结算唯一产生点）',
  battleSrc.includes('hero.deaths') && battleSrc.includes('deaths') &&
  /S\.G\.deaths\s*=\s*\(S\.G\.deaths\s*\|\|\s*0\)\s*\+\s*1/.test(battleSrc));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径为三百七十件套（三百六十九件套清除）',
  readme.includes('扩充为冒烟三百七十件套（三百六十九件套清除）') && !readme.includes('冒烟三百六十件套（三百五十九件套清除）'));
ok('README 含 v24.147 守护描述（未曾熄灯挑战里程碑守护）', readme.includes('v24.147 起含「未曾熄灯」新成就守护'));
ok('README 版本速览已为 v24.147 且成就计数 77', readme.includes('版本速览（v24.159）') && readme.includes('86 项成就'));
ok('README 成就计数双处口径 80 项（全部 86 项进度 + **86 项成就**，76 项清除）',
  readme.includes('全部 86 项进度') && readme.includes('**86 项成就**') && !readme.includes('**76 项成就**'));
ok('README tests 树收录 smoke_v24147_unflicker（含 v24.147 守护子句 + 串尾）',
  readme.includes('v24.147 起含「未曾熄灯」新成就守护') && readme.includes('smoke_v24147_unflicker'));
ok('README 含 smoke_v24147_unflicker 入库（361 份）', readme.includes('smoke_v24147_unflicker 入库（361 份）'));
ok('package.json 已收录 smoke_v24147_unflicker.mjs 且位于串尾（狠在 furnacequest 之后）',
  pkg.includes('smoke_v24147_unflicker.mjs') &&
  pkg.includes('node tests/smoke_v24143_furnacequest.mjs && node tests/smoke_v24147_unflicker.mjs && node tests/smoke_v24148_swift.mjs && node tests/smoke_v24151_lowlv.mjs && node tests/smoke_v24152_nopotion.mjs && node tests/smoke_v24153_penny.mjs && node tests/smoke_v24154_steadfast.mjs && node tests/smoke_v24155_frugal.mjs && node tests/smoke_v24157_dry.mjs && node tests/smoke_v24158_swift2.mjs && node tests/smoke_v24159_lowlv2.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 361 件套', testChain === 370, String(testChain));
ok('CHANGELOG 含 v24.147 顶条目', changelog.startsWith('## v24.159'));

// —— 哨兵链：README 已有 361 口径且尚无 365（前望 371 语义：下一版才写 365）——
ok('README 已有三百六十四件套口径且尚无 365（哨兵前望 371 语义：下一版才写 365）',
  readme.includes('三百七十件套（三百六十九件套清除）') && !readme.includes('三百七十一件套'));
{
  const s24143 = read('tests/smoke_v24143_furnacequest.mjs');
  ok('smoke_v24143 哨兵链前望 371（三百七十一件套否定式）',
    s24143.includes('哨兵链前望 371') && s24143.includes('三百七十一件套否定式'));
}
{
  const v = GAME_VERSION;
  const vs = v.replace('v', '').split('.').map(Number);
  ok('smoke_v24136 姊妹件版本字面量 pin 已随新现实推进（v24.147）',
    read('tests/smoke_v24136_herbquest.mjs').includes("const GAME_VERSION = 'v24.159';"));
  ok('smoke_v2229 姊妹件版本恒等 pin 已随新现实推进（=== v24.147）',
    read('tests/smoke_v2229_metall.mjs').includes("GAME_VERSION === 'v24.159'"));
}

// —— 旧代 v24.146 字面量 / 360 件套口径 全库零残留扫描（豁免本套件自身）——
const leftovers = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests')).filter((x) => x.endsWith('.mjs') && x !== 'smoke_v24147_unflicker.mjs' && x !== 'smoke_v24148_swift.mjs')) {
  const s = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  const code = s.split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  if (code.includes("const GAME_VERSION = 'v24.147'")) leftovers.push(f + ':gv');
  if (code.includes("GAME_VERSION === 'v24.147'")) leftovers.push(f + ':eq');
  if (code.includes("startsWith('## v24.147")) leftovers.push(f + ':st');
  if (code.includes('三百六十件套（三百五十九件套清除）')) leftovers.push(f + ':360');
  if (code.includes('testChain === 360') || code.includes('files.length === 360') ||
      code.includes('treeTok.length === 360') || code.includes('chainAll.length === 360')) leftovers.push(f + ':count');
  if (code.includes('N/76') || code.includes('**76 项成就**') || code.includes('全部 76 项进度')) leftovers.push(f + ':76');
}
ok('旧代 v24.146 GAME_VERSION 字面量/恒等/顶 pin 全库零残留（哨兵链，豁免本套件）',
  leftovers.filter((x) => x.endsWith(':gv') || x.endsWith(':eq') || x.endsWith(':st')).length === 0,
  JSON.stringify(leftovers));
ok('旧代 360 件套口径/计数/76 项 pin 全库零残留（哨兵链，豁免本套件）',
  leftovers.filter((x) => x.endsWith(':360') || x.endsWith(':count') || x.endsWith(':76')).length === 0,
  JSON.stringify(leftovers));

if (failed) { console.log(`— v24.147 冒烟完成：${n} 项断言，失败 ${failed} —`); process.exit(1); }
console.log(`— v24.147 冒烟完成：${n} 项断言，失败 0 —`);
