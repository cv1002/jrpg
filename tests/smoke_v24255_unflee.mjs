// smoke_v24255_unflee.mjs —— v24.255 专项冒烟：新成就「从未言退」（姿态·零逃跑档·真结局）
// （新内容·单成就·第一百六十三项——承 v24.153 白手成灯（penny，「零消费」姿态档·真结局）/ v24.155 两袖清风（frugal）
// / v24.173 白手疾行（pennyswift）先例：「以怎样的姿态通关」版图里「别逃跑」这一面查无一行——走为上计（flee）纪念的是
// 逃跑成功累计（FLEE_GOAL 次）的正向里程碑，本枚纪念它的镜面对：全程一次都未成功逃跑便击败终焉之神（与一掷千金/白手成灯、
// 行者无疆/徒步组合同一「正向里程碑 vs 逆向零次」镜面对先例）。判定读既有 hero.trueBoss（终焉之神=真结局最终 Boss，
// 与 trueboss/hardtrue/unflicker 同源）与既有 hero.flees（battle.doFlee 逃跑成功唯一产生点——失败不计、只增不减、
// 防御式 !(g.flees||0) 旧档零迁移），(g.trueBoss && !(g.flees||0)) 即达成：成功逃过一次就永久无缘此档（与 hardtrue 换难度、
// unflicker 死过一次、swift 超场、lowlv 升过十级、penny 花过一金同属「重新来过才拿得到」的挑战品类）。
// 零新计数零新状态零新写点零新存档（trueBoss/flees 皆既有字段）；无 r 无 prog 纯里程碑（与 hardtrue/unflicker/penny 同款）；
// 解锁时机：winBattle → applyAchievements 既有通路（trueboss/hardtrue/unflicker/penny 同路径零新增依赖），反馈不迟到。
// ACH_LIST 162→163 项末尾追加。真实可行性：战士全程不按 [4] 即可（Boss 战本就禁逃）——本档偏「克制」，老练玩家自然可得。
// 本冒烟守护：版本锚点（格式合法 + 已越过 v24.255 + data.js 字面量 v24.255 + 旧 v24.254 字面量零残留）、
// ACH_LIST 163 项精确与末尾序位（unflee 落位 162——前 162 项 id/序位零回归）、unflee 数据契约（d 文案、ok 防御式逐值、
// 无 r 无 prog）、unlockedAchievements/applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等去重 /
// 逃过一次不解锁 / 未通关不解锁）、既有 163 成就 id 零回归、battle.js 唯一 flees 写入点与 core/shop/hero 零 flees 写点、
// README/package.json/CHANGELOG 同步（件套口径 448 + v24.255 守护描述 + 入库 448 + 版本速览 163 项 +
// tests 树串尾 + package 串尾 448 + CHANGELOG 顶条 v24.255）、哨兵链（前望 449 且 README 尚无 449 口径）、
// 旧代 v24.254 字面量/恒等/顶 pin/447 口径/162 项 全库零残留扫描（豁免本套件与 v24251/v24250/v24249）。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, FLEE_GOAL } from '../js/data.js';
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

console.log('— v24.255 挑战向零逃跑成就「从未言退」 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dataSrc = read('js/data.js');
const battleSrc = read('js/battle.js');
const coreSrc = read('js/core.js');
const heroSrc = read('js/hero.js');
const shopSrc = read('js/shop.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.255', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 255)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.255（旧 v24.254 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v24.256';") && !dataSrc.includes("const GAME_VERSION = 'v24.254';"));
ok('data.js 含 v24.255 注释（从未言退新成就说明）',
  dataSrc.includes('v24.256 文档整理·版本锚点推进'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'unflee');
ok('ACH_LIST 含 unflee「从未言退」且 id 唯一',
  !!ach && ach.name === '从未言退' && ACH_LIST.filter((a) => a.id === 'unflee').length === 1);
ok('ACH_LIST 精确总数 163 项（162→163 末尾追加）', ACH_LIST.length === 163, String(ACH_LIST.length));
ok('unflee 描述文案（从未逃跑成功真结局档）',
  ach.d === '从未逃跑成功击败终焉之神（真结局）', ach.d);
ok('unflee 判定源级（读既有 g.trueBoss 与防御式 !(g.flees||0)）',
  String(ach.ok).includes('g.trueBoss') && String(ach.ok).includes('!(g.flees||0)'));
ok('unflee 无 r 无 prog 纯里程碑（与 hardtrue/unflicker/penny 同款）',
  !('r' in ach) && !('prog' in ach));

// —— ok 防御式逐值 ——
ok('零逃跑真结局 → 解锁', ach.ok({ trueBoss: true, flees: 0 }) === true);
ok('缺 flees 字段仅 trueBoss → 按 0 解码（旧档零迁移）', ach.ok({ trueBoss: true }) === true);
ok('成功逃过一次真结局 → 不解锁（永久无缘此档）', ach.ok({ trueBoss: true, flees: 1 }) === false);
ok('成功逃过多次真结局 → 不解锁', ach.ok({ trueBoss: true, flees: 9 }) === false);
ok('刷满走为上计 FLEE_GOAL 次真结局 → 不解锁（unflee 与 flee 各占一位互不重叠）',
  ach.ok({ trueBoss: true, flees: FLEE_GOAL }) === false);
ok('零逃跑但未通关 → 不解锁', ach.ok({ flees: 0 }) === false);
ok('空档/缺字段 → 不解锁（(g.flees||0) 防御式零迁移）', ach.ok({}) === false);

// —— 既有成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'flee', 'unflicker', 'swift', 'lowlv', 'nopotion', 'penny',
  'unfltravel2', 'unfltravelswift2', 'unfltravellowlv2', 'unfltravelpenny2', 'unfltravelnoskill2', 'unfltravelnopo2'];
ok('既有成就 id 零回归（抽样覆盖姿态家族/正向里程碑/末尾正位）',
  EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('unfltravelnopo2 161 / unflee 162 末尾序位（既有序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'unfltravelnopo2') === 161 &&
  ACH_LIST.findIndex((a) => a.id === 'unflee') === 162);

// —— 既有姿态家族对照（penny/flee 镜面对独立互不干扰）——
const _a = (id) => ACH_LIST.find((x) => x.id === id);
ok('penny/unflee 各自独立（零消费 vs 零逃跑，面向不同）',
  _a('penny').ok({ trueBoss: true, spent: 0, flees: 5 }) === true &&
  ach.ok({ trueBoss: true, flees: 0, spent: 300 }) === true);
ok('flee 正向里程碑 vs unflee 逆向零次镜面对（互不重叠：用技/嗑药/花金不影响本枚）',
  _a('flee').ok({ flees: FLEE_GOAL }) === true &&
  ach.ok({ trueBoss: true, flees: 0, casts: 30, potionUses: 15, spent: 5000 }) === true);
ok('失败逃跑不计入 flees（仅成功落账）→ 失败后仍可解锁本枚（端口语义与走为上计同源）',
  _a('flee').ok({ flees: 0 }) === false && ach.ok({ trueBoss: true, flees: 0 }) === true);
ok('困难档零逃跑通关仍可解锁（难度向与零逃跑向正交）',
  ach.ok({ trueBoss: true, flees: 0, diff: 1 }) === true);
ok('零阵亡档照常独立（unflicker 与 unflee 分属不同端口）',
  _a('unflicker').ok({ trueBoss: true, deaths: 0 }) === true &&
  ach.ok({ trueBoss: true, flees: 0, deaths: 5 }) === true);

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
  const h = freshHero({ trueBoss: true, flees: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 零逃跑真结局档 newly 含 unflee（既有通路自动跟随）',
    newly.includes('unflee'), JSON.stringify(newly));
}
{
  const h = freshHero({ trueBoss: true, flees: 2 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 逃过两次的过关档 newly 不含 unflee（不误解锁）',
    !newly.includes('unflee'), JSON.stringify(newly));
}
{
  const h = freshHero({ flees: 0 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 未通关档 newly 不含 unflee（不误解锁）',
    !newly.includes('unflee'), JSON.stringify(newly));
}

// —— applyAchievements 运行期全链路 ——
{
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    const h = freshHero({ trueBoss: true, flees: 0 });
    S.G = h;
    applyAchievements();
    ok('applyAchievements 真实解锁落 hero.ach（含 unflee）', h.ach.includes('unflee'), JSON.stringify(h.ach));
    ok('解锁横幅报成就名【从未言退】', msgs.some((m) => m.includes('🔓 成就解锁：') && m.includes('从未言退')), msgs.join(' | '));
    const len1 = msgs.length;
    applyAchievements();
    ok('幂等：重复调用不再报（已解锁去重）', msgs.length === len1 && msgs.filter((m) => m.includes('从未言退')).length === 1, String(msgs.length));
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
    const h = freshHero({ trueBoss: true, flees: 1 });
    S.G = h;
    applyAchievements();
    ok('逃过一次 applyAchievements 零 unflee 解锁零「从未言退」横幅（不误解锁）',
      !h.ach.includes('unflee') && !msgs.some((m) => m.includes('从未言退')), JSON.stringify({ ach: h.ach, msgs }));
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}

// —— 源级零变化：battle.js 唯一 flees 写入点 + core/shop/hero 零 flees 写点 ——
ok('battle.js 具 1 处 hero.flees = fleeN; 写入点（doFlee 逃跑成功唯一产生点——失败不计）',
  (battleSrc.match(/hero\.flees = /g) || []).length === 1, String((battleSrc.match(/hero\.flees = /g) || []).length));
ok('core.js 未新增任何 flees 计数写点（本版零改动）',
  (coreSrc.match(/\.flees = /g) || []).length === 0, String((coreSrc.match(/\.flees = /g) || []).length));
ok('shop.js 未新增任何 flees 计数写点（本版零改动）',
  (shopSrc.match(/\.flees = /g) || []).length === 0, String((shopSrc.match(/\.flees = /g) || []).length));
ok('hero.js 未新增任何 flees 计数写点（本版零改动）',
  (heroSrc.match(/\.flees = /g) || []).length === 0, String((heroSrc.match(/\.flees = /g) || []).length));
ok('data.js 既有 flee 里程碑「走为上计」逐字未动（FLEE_GOAL 单一数据源、与正向里程碑同读一份源）',
  dataSrc.includes("{id:'flee', name:'走为上计'") && dataSrc.includes('FLEE_GOAL'));
ok('hero.js 成就横幅活计数注释已推进至 N/163（162→163）', heroSrc.includes('（成就 N/163）'));
ok('data.js 成就横幅活计数注释已推进至 N/163（162→163，两处恒等）', (dataSrc.match(/（成就 N\/163）/g) || []).length === 2, String((dataSrc.match(/（成就 N\/163）/g) || []).length));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径为四百四十八件套（四百四十七件套清除）',
  readme.includes('扩充为冒烟四百四十八件套（四百四十七件套清除）') && !readme.includes('扩充为冒烟四百四十七件套（四百四十六件套清除）'));
ok('README 含 v24.255 守护描述（从未言退零逃跑档守护）', readme.includes('v24.255 起含「从未言退」新成就守护'));
ok('README 版本速览已为 v24.255 且成就计数 163', readme.includes('版本速览（v24.256）') && readme.includes('163 项成就'));
ok('README 成就计数双处口径 163 项（全部 163 项进度 + **163 项成就**，162 项清除）',
  readme.includes('全部 163 项进度') && readme.includes('**16' + '3 项成就**') && !readme.includes('**16' + '2 项成就**'));
ok('README tests 树收录 smoke_v24255_unflee（含 v24.255 守护子句 + 串尾）',
  readme.includes('v24.255 起含「从未言退」新成就守护') && readme.includes('smoke_v24255_unflee'));
ok('README 含 smoke_v24255_unflee 入库（448 份）', readme.includes('smoke_v24255_unflee 入库（448 份）'));
ok('package.json 已收录 smoke_v24255_unflee.mjs 且位于串尾（在 smoke_v24251_unfltravelnopo2 之后）',
  pkg.includes('smoke_v24255_unflee.mjs') &&
  pkg.includes('node tests/smoke_v24251_unfltravelnopo2.mjs && node tests/smoke_v24255_unflee.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 448 件套', testChain === 448, String(testChain));
ok('CHANGELOG 含 v24.255 顶条目', changelog.startsWith('## v24.256 '));

// —— 哨兵链 ——
ok('README 已有四百四十八件套口径且尚无 449（哨兵前望 449 语义：下一版才写 449）',
  readme.includes('扩充为冒烟四百四十八件套（四百四十七件套清除）') && !readme.includes('四百四十九件套'));
{
  const s24143 = read('tests/smoke_v24143_furnacequest.mjs');
  ok('smoke_v24143 哨兵链前望 449（四百四十九件套否定式）',
    s24143.includes('哨兵链前望 449') && s24143.includes('四百四十九件套否定式'));
}
{
  ok('smoke_v24251 姊妹件版本字面量 pin 已随新现实推进（v24.255）',
    read('tests/smoke_v24251_unfltravelnopo2.mjs').includes("const GAME_VERSION = 'v24.256';"));
  ok('smoke_v24153 姊妹件版本字面量 pin 已随新现实推进（v24.255）',
    read('tests/smoke_v24153_penny.mjs').includes("const GAME_VERSION = 'v24.256';"));
}

// —— 旧代 v24.254 字面量 / 447 件套口径 / 162 项 全库零残留扫描（豁免本套件与 v24251/v24250/v24249）——
const EXEMPT = new Set(['smoke_v24255_unflee.mjs', 'smoke_v24251_unfltravelnopo2.mjs', 'smoke_v24250_unfltravelnoskill2.mjs', 'smoke_v24249_unfltravelpenny2.mjs']);
const leftovers = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests')).filter((x) => x.endsWith('.mjs') && !EXEMPT.has(x))) {
  const s = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  const code = s.split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  if (code.includes("const GAME_VERSION = 'v24.254'")) leftovers.push(f + ':gv');
  if (code.includes("GAME_VERSION === 'v24.254'")) leftovers.push(f + ':eq');
  if (code.includes("startsWith('## v24.254")) leftovers.push(f + ':st');
  if (code.includes('版本速览（v24.254）')) leftovers.push(f + ':ver');
  if (code.includes('四百四十七件套（四百四十六件套清除）')) leftovers.push(f + ':447');
  if (code.includes('testChain === 447') || code.includes('files.length === 447') ||
      code.includes('treeTok.length === 447') || code.includes('chainAll.length === 447') ||
      code.includes('fileCount === 447') || code.includes('chain.length === 446') ||
      code.includes('suiteFiles.length === 446'))
    leftovers.push(f + ':count');
  if (code.includes('**16' + '2 项成就**') || code.includes('全部 162 项进度'))
    leftovers.push(f + ':162');
}
ok('旧代 v24.254 GAME_VERSION 字面量/恒等/顶 pin/版本速览 全库零残留（哨兵链，豁免本套件与 v24251/v24250/v24249）',
  leftovers.filter((x) => x.endsWith(':gv') || x.endsWith(':eq') || x.endsWith(':st') || x.endsWith(':ver')).length === 0,
  JSON.stringify(leftovers));
ok('旧代 447 件套口径/计数/162 项 pin 全库零残留（哨兵链，豁免本套件与 v24251/v24250/v24249）',
  leftovers.filter((x) => x.endsWith(':447') || x.endsWith(':count') || x.endsWith(':162')).length === 0,
  JSON.stringify(leftovers));

if (failed) { console.log(`— v24.256 冒烟完成：${n} 项断言，失败 ${failed} —`); process.exit(1); }
console.log(`— v24.256 冒烟完成：${n} 项断言，失败 0 —`);
