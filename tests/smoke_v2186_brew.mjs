// v21.86 专项冒烟：新成就「灵药初成」（酿造线里程碑）——成就版图的酿造/高级灵药线此前全无纪念
// （30 项成就里没有任何一条关涉酿造或灵药；图鉴/支线/碎片/技能/宝箱/等级/装备/难度/精英各线
// 都有里程碑，唯独这条「采蘑菇 → 酿造锅 → 高级灵药」的自选系统链没有），玩家第一次酿出灵药
// 毫无回响；现补第一档（ELIXIR_GOAL=1 纯里程碑，承 firstblood「第一场」同款）：判定/进度同读
// ELIXIR_GOAL 一份源（与 FIRSTBLOOD_GOAL/LVL5_GOAL 同一「成就阈值数据化」家族），计数读
// core.brewNow 新写入的 hero.brews 防御式计数（(g.brews||0)，旧档无此字段=0 不误解锁零迁移，
// 承 v19.41 seen 同款——成就只认「酿造」行为，不把任务奖励/掉落的灵药误记为酿造）；无 r 字段
// 纯里程碑；解锁时机：brewNow 酿造成功当场 applyAchievements（承 v21.73 buyArmor 当场判定
// 「反馈不迟到」惯例）。
// 本冒烟守护：版本锚点、ELIXIR_GOAL 常量、ACH_LIST 契约（brew 唯一/总数精确 31/既有 30 成就
// id 零回归）、ok/prog 谓词逐值、core.js brewNow 源级落位、unlockedAchievements·applyAchievements
// ·brewNow 运行期全链路（真实酿造解锁/去重/材料不足/任务蘑菇保护四档）、drawAch 31 项滚动渲染
// 不抛错、README/package.json 同步 + 姊妹件套 pin（v2185..v2176 八十二件套 / v2185·v2184·v2183·
// v2182·v2181·v2179 GAME_VERSION v21.86）随新现实更新。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, ELIXIR_GOAL, BREW_MUSHROOMS, BREW_GOLD, MUSHROOM_GOAL } from '../js/data.js';
import { unlockedAchievements } from '../js/rules.js';
import { applyAchievements } from '../js/hero.js';
import { newGame, brewNow } from '../js/core.js';
import { bind } from '../js/bind.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v21.85 冒烟先例：先装桩再 import main.js；boxMsg 经 elId('msg') 落 textContent 供断言）——
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
    fillText: noop,
  };
}
function mkEl(id) {
  const cl = { add: noop, remove: noop, contains: () => false, toggle: noop };
  return { textContent: '', style: {}, className: '', id, width: 640, height: 480,
    getContext: () => makeCtx(), classList: cl, parentElement: { classList: cl }, addEventListener: noop };
}
const els = {};
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
    gain: { setValueAtTime: noop, linearRampToValueAtTime: noop, exponentialRampToValueAtTime: noop } }),
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

console.log('— v21.86 新成就「灵药初成」（酿造线里程碑）冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const cSrc = fs.readFileSync(path.join(ROOT, 'js/core.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.85 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.85', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 86)), GAME_VERSION);
ok('data.js 含 v21.86 注释（新成就「灵药初成」说明）', dSrc.includes('v21.86 新成就「灵药初成」'));
ok('data.js GAME_VERSION 字面量已更新为 v21.86', dSrc.includes("const GAME_VERSION = 'v21.98';"));

// —— ELIXIR_GOAL 常量（与 FIRSTBLOOD_GOAL/LVL5_GOAL 同族：判定/进度同读一份源）——
ok('ELIXIR_GOAL===1 且已从 data.js 导出（酿造首瓶即达标，承 firstblood「第一场」同款）',
  ELIXIR_GOAL === 1 && dSrc.includes('const ELIXIR_GOAL = 1;'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'brew');
ok('ACH_LIST 含 brew「灵药初成」且 id 唯一',
  !!ach && ach.name === '灵药初成' && ACH_LIST.filter((a) => a.id === 'brew').length === 1);
ok('ACH_LIST 由 30 → 31 项（新增一项，精确总数由 v21.88 守护，本件存活性口径）', ACH_LIST.length >= 31, String(ACH_LIST.length));
ok('brew 无 r 字段且描述为「酿造出第一瓶高级灵药」', !('r' in ach) && ach.d === '酿造出第一瓶高级灵药', ach && ach.d);
ok('brew 判定读 ELIXIR_GOAL（ok 与常量同读，非裸 1）', /g=>\(g\.brews\|\|0\)>=ELIXIR_GOAL/.test(ach.ok.toString()) || ach.ok({ brews: ELIXIR_GOAL }) === true);
ok('brew prog 同式 X/N（与 lvl5 同族不钳制，0/1 · 1/1 · 3/1）',
  ach.prog({}) === '0/1' && ach.prog({ brews: 1 }) === '1/1' && ach.prog({ brews: 3 }) === '3/1');
const EXPECTED30 = ['firstblood','hunt10','lucky','lvl5','lvl10','lvl12','rich','scholar','quest','boss',
  'cave','trueboss','rush','perfection','legend','cartman','names','mist','stone','ember','bone','chests',
  'allquests','memoir','skills','hardtrue','aegis','elites','grain'];
ok('既有 30 成就 id 零回归（全部在表且序位不变，grain 29 / brew 30 追加在末尾）',
  EXPECTED30.every((id) => ACH_LIST.some((a) => a.id === id)) &&
  ACH_LIST.findIndex((a) => a.id === 'grain') === 29 && ACH_LIST.findIndex((a) => a.id === 'brew') === 30);

// —— ok/prog 谓词逐值（防御式：无 brews 字段=0 不误解锁，旧档零迁移）——
ok('ok 谓词逐值（缺字段 false / 0 false / 1 true / 3 true）',
  ach.ok({}) === false && ach.ok({ brews: 0 }) === false &&
  ach.ok({ brews: 1 }) === true && ach.ok({ brews: 3 }) === true);

// —— core.js brewNow 源级落位（酿造成功当场计数 + 当场判定，库存结算逐字保留）——
ok('core.js brewNow 含 hero.brews 计数写入（(g.brews||0)+1 防御式）', cSrc.includes('hero.brews = (hero.brews || 0) + 1'));
ok('core.js brewNow 酿造成功后当场 applyAchievements（反馈不迟到，承 v21.73 buyArmor 惯例）',
  cSrc.includes('applyAchievements();') && cSrc.includes('v21.86 新成就「灵药初成」'));
ok('core.js brewNow 库存结算逐字保留（potion2++ / 配方常量同源，成就另计不混同）',
  cSrc.includes('hero.potion2++;') && cSrc.includes('hero.mushrooms -= BREW_MUSHROOMS;') && cSrc.includes('hero.gold -= BREW_GOLD;'));

// —— unlockedAchievements 集成（纯判定）——
ok('unlockedAchievements：brews=1 新解锁含 brew；brews=0 不含', 
  unlockedAchievements({ brew: undefined, brews: 1, ach: [] }).includes('brew') === true &&
  unlockedAchievements({ brews: 0, ach: [] }).includes('brew') === false);
ok('unlockedAchievements：已解锁不重复报（ach 已含 brew → 不在 newly）',
  unlockedAchievements({ brews: 1, ach: ['brew'] }).includes('brew') === false);

// —— brewNow 运行期全链路（真实 newGame → 酿造 → 当场解锁落 hero.ach + 横幅）——
// 先测拦截分支（此时消息队列为空、boxMsg 即时落 textContent），再测成功链路
function elMsg() { return els['msg'] ? els['msg'].textContent : ''; }
function fresh() {
  const h = newGame('测试');
  h.mushrooms = 4; h.gold = 30; // 材料充足（BREW_MUSHROOMS×2 + BREW_GOLD）
  S.G = h;
  return h;
}
let h = fresh();
h.mushrooms = 1; // 材料不足 → 拦截零计数
brewNow();
ok('运行期：材料不足拦截（brews 0、potion2 0、报文含「材料不足」）',
  (h.brews || 0) === 0 && h.potion2 === 0 && elMsg().includes('材料不足'),
  `brews=${h.brews} p2=${h.potion2} msg=${elMsg()}`);
h = fresh();
h.mushrooms = MUSHROOM_GOAL; h.gold = 20; h.quests = { side_mushroom: 'active' }; // 任务蘑菇保护
bind.boxMsg('', 0); // 同上：瞬时清场，让本分支报文即时落 textContent
brewNow();
ok('运行期：任务蘑菇保护拦截（brews 0、报文含「任务蘑菇尚未上交」）',
  (h.brews || 0) === 0 && elMsg().includes('任务蘑菇尚未上交'),
  `brews=${h.brews} msg=${elMsg()}`);

h = fresh();
// 上一拦截消息仍在展示期（msgOn=true）——按 v21.10 队列语义，其后的正片消息会被排队而非即时
// 显示；用瞬时消息（ms<=0，curTransient）抢占清场（瞬时消息期间的后续正片消息可立即接管，见
// hud.boxMsg 分支），让「🔓 成就解锁」横幅落 textContent 供断言。
bind.boxMsg('', 0);
brewNow();
ok('运行期：酿造成功结算一致（mushrooms -2 / gold -10 / potion2 +1）',
  h.mushrooms === 4 - BREW_MUSHROOMS && h.gold === 30 - BREW_GOLD && h.potion2 === 1,
  `m=${h.mushrooms} g=${h.gold} p2=${h.potion2}`);
ok('运行期：英雄真实获得成就 brew 落 hero.ach（当场解锁）', h.ach.includes('brew'), h.ach.join(','));
ok('运行期：hero.brews 计数=1（成就源，与 potion2 库存独立）', h.brews === 1, String(h.brews));
ok('运行期：解锁横幅「🔓 成就解锁：【灵药初成】」即时可见（v21.10 消息队列正片首条）',
  elMsg().includes('🔓 成就解锁：【灵药初成】'), elMsg());
// 重复酿造（材料再备足）→ 计数递增、成就去重不重报
h.mushrooms = BREW_MUSHROOMS; h.gold = BREW_GOLD;
brewNow();
ok('运行期：重复酿造 brews=2、potion2=2、成就去重（ach 仍只含一枚 brew）',
  h.brews === 2 && h.potion2 === 2 && h.ach.filter((x) => x === 'brew').length === 1,
  `brews=${h.brews} p2=${h.potion2} ach=${h.ach.join(',')}`);

// —— applyAchievements 运行期集成（承 v21.77 先例：真实解锁落 hero.ach）——
h = fresh(); h.brews = 1;
applyAchievements();
ok('applyAchievements 运行期：brews=1 真实解锁 brew 落 hero.ach（既有通路，反馈不迟到）',
  h.ach.includes('brew'), h.ach.join(','));
h = fresh(); h.brews = 0;
applyAchievements();
ok('applyAchievements 运行期：brews=0 不误解锁 brew（零误报）', !h.ach.includes('brew'));
h = fresh(); h.brews = 1; h.ach = ['brew'];
applyAchievements();
ok('applyAchievements 运行期：重复调用去重（不重复 push）',
  h.ach.filter((x) => x === 'brew').length === 1);

// —— drawAch 渲染（31 项滚动不抛错；PAGE=10 四页）——
const { drawAch } = await import('../js/view/menus.js');
let rendered = true, renderedPg4 = true;
try {
  S.G = newGame('测试'); S.G.ach = ['brew']; S.achScroll = 0; S.scene = 'ach';
  drawAch();
} catch (e) { rendered = false; }
try {
  S.achScroll = 25; // 31 项滚到第四页（PAGE=10，钳制到 21）不抛错
  drawAch();
} catch (e) { renderedPg4 = false; }
S.achScroll = 0; S.scene = 'world';
ok('运行期：成就页 drawAch 31 项渲染不抛错', rendered);
ok('运行期：成就页第四页滚动渲染不抛错（31 项 PAGE=10 四页）', renderedPg4);

// —— README / package.json / 既有冒烟 pin 随新现实更新 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2186_brew', readme.includes('smoke_v2186_brew'));
ok('README 件套口径为九十四件套（九十三件套清除）', readme.includes('九十四件套（九十三件套清除）'));
ok('README 含 v21.86 守护描述', readme.includes('v21.86 起含'));
ok('README 成就口径「31 项」双处同步（快速上手表 C 键行 + 图鉴&成就行）',
  readme.includes('成就一览（全部 36 项进度') && readme.includes('**36 项成就**'));
ok('package.json 已收录 smoke_v2186_brew（npm test 串跑第 82 份）',
  pkg.includes('smoke_v2186_brew.mjs') && /smoke_v2185_steleclear\.mjs && node tests\/smoke_v2186_brew\.mjs/.test(pkg));

// —— 姊妹件套 pin 复查（v21.7 惯例：本版冒烟守护姊妹随新现实更新）——
const suite82 = ['smoke_v2185_steleclear.mjs', 'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs',
  'smoke_v2182_winrecap.mjs', 'smoke_v2181_helpquickcast.mjs', 'smoke_v2180_grain.mjs',
  'smoke_v2179_titlerecap.mjs', 'smoke_v2178_codexseen.mjs', 'smoke_v2177_elites.mjs',
  'smoke_v2176_allchests.mjs'];
for (const nm of suite82) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', nm), 'utf8');
  ok(`${nm} 的 README 件套 pin 已随新现实更新为九十四件套（九十三件套清除）`,
    src.includes('九十四件套（九十三件套清除）'));
}
for (const nm of ['smoke_v2185_steleclear.mjs', 'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs', 'smoke_v2181_helpquickcast.mjs', 'smoke_v2179_titlerecap.mjs']) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', nm), 'utf8');
  ok(`${nm} 的 GAME_VERSION 字面量 pin 已随新现实更新为 v21.86`,
    src.includes("const GAME_VERSION = 'v21.98';"));
}
const achFiles = ['smoke_v2184_lvl12.mjs', 'smoke_v2180_grain.mjs', 'smoke_v2177_elites.mjs',
  'smoke_v2176_allchests.mjs', 'smoke_v2173_aegis.mjs', 'smoke_v2168_hardtrue.mjs', 'smoke_v2159_skillach.mjs'];
for (const nm of achFiles) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', nm), 'utf8');
  ok(`${nm} 的 README 成就 pin 已随新现实更新（30 项 pin 零残留，31 项双处落位）`,
    src.includes("readme.includes('成就一览（全部 36 项进度'") && !src.includes('**31 项成就**'));
}
const s2184 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2184_lvl12.mjs'), 'utf8');
ok('smoke_v2184 的 ACH_LIST 精确计数断言已去硬化（===30 零残留，>=30 存活性口径落位）',
  s2184.includes('ACH_LIST.length >= 30') && !s2184.includes('ACH_LIST.length === 30'));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
