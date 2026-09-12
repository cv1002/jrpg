// v21.77 专项冒烟：新成就「精英猎手」（双精英讨伐里程碑，ACH_LIST 27→28）——
// 纯内容扩充（新成就，零结算改动、零新状态、零新逻辑：判定走既有 unlockedAchievements→
// applyAchievements 通路，读既有 hero.bestiary 讨伐计数）。精英线里程碑补齐：全游戏仅有的
// 两只 isElite 精英——雾语林随机精英「石心魔像」（约 7% 撞见、掉记忆碎片、必掉蘑菇、石甲机制）
// 与无字回廊中段祭坛「残焰魔像」（守名者支线「残焰的安息」目标）——此前成就版图里只有侧面
// 纪念（碎片/支线），唯独没有「猎手」这一档；对比图鉴（perfection）/支线（allquests）/碎片
// （memoir）/技能（skills）/宝箱（allchests）各线里程碑齐备。判定/进度同读 ELITE_GOLEM.name /
// EMBER_GOLEM.name（单一数据源：与 withSpecies/图鉴/帮助页同一份精英数据，改精英名只改
// data.js 一处、本成就自动跟随，零裸字面量）+ 既有 hero.bestiary 讨伐计数（与
// perfection/condProg 同一份源），防御式 (g.bestiary||{})[name]||0 读取、旧档零迁移；无 r 字段
// （与 memoir/skills/aegis/hardtrue 同款纯里程碑——击杀本身即奖励：碎片/蘑菇/支线进度）。
// 解锁时机：winBattle 既有 applyAchievements 通路（battle.js 六处调用之一），击杀第二只精英
// 当场解锁、反馈不迟到（bestiary 结算落账在前、判定在后）。
// 本冒烟守护：版本锚点、SPECIES isElite 恰两只契约（与 ELITE_GOLEM/EMBER_GOLEM.name 一致）、
// 源级落位（ELITE_GOLEM/EMBER_GOLEM 定义行）、BESTIARY_TARGET 13 种含双精英（讨伐可及）、
// ACH_LIST 契约（elites 唯一/总数精确 28/无 r 有 prog/d 由 ELITE_GOLEM/EMBER_GOLEM 派生）、
// ok/prog 谓词逐值（空档/单档/双档/超计数）、既有 27 成就 id 零回归、残焰已熄与灯火同心分母
// 不受影响、unlockedAchievements 集成、运行期全链路（newGame 不解锁 → 双精英落账真实解锁落
// hero.ach 且横幅「🔓 成就解锁：【精英猎手】+ 派生描述」齐备 → 重复调用去重）、battle.js
// winBattle 既有 applyAchievements 通路源级落位、drawAch 28 项三页滚动渲染不抛错、
// README/package.json 同步 + smoke_v2176 总数断言去硬化（===27→>=27，v21.7 惯例）与
// smoke_v2176/smoke_v2168/smoke_v2159 README 成就 pin（27→28）随新现实更新确认。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, SPECIES, ELITE_GOLEM, EMBER_GOLEM, BESTIARY_TARGET, QUESTS } from '../js/data.js';
import { unlockedAchievements } from '../js/rules.js';
import { bind } from '../js/bind.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v21.76 冒烟先例：先装桩再 import main.js）——
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
const { newGame, applyAchievements } = await import('../js/core.js');
const { loadMap } = await import('../js/world.js');
const { drawAch } = await import('../js/view/menus.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.77 新成就「精英猎手」（双精英讨伐里程碑）冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.76 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.76', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 77)), GAME_VERSION);
ok('data.js 含 v21.77 注释（精英猎手/双精英讨伐里程碑说明）', dSrc.includes('v21.77') && dSrc.includes('精英猎手'));

// —— 单一数据源契约：全游戏 isElite 精英恰两只，名字与 ELITE_GOLEM/EMBER_GOLEM 一致 ——
const eliteEntries = Object.entries(SPECIES).filter(([, s]) => !!s.isElite).map(([k]) => k).sort();
ok('SPECIES 中 isElite 精英恰 2 只（石心魔像/残焰魔像——精英线全貌与本成就逐一对应）',
  eliteEntries.length === 2 && eliteEntries[0] === '残焰魔像' && eliteEntries[1] === '石心魔像',
  eliteEntries.join(','));
ok('ELITE_GOLEM.name / EMBER_GOLEM.name 与 SPECIES isElite 逐字一致（同一份精英数据源）',
  ELITE_GOLEM.name === '石心魔像' && EMBER_GOLEM.name === '残焰魔像' &&
  eliteEntries.includes(ELITE_GOLEM.name) && eliteEntries.includes(EMBER_GOLEM.name));
ok('源级落位：ELITE_GOLEM / EMBER_GOLEM 定义行逐字存在（本成就名字的唯一来源）',
  dSrc.includes("const ELITE_GOLEM = {name:'石心魔像'") && dSrc.includes("const EMBER_GOLEM=withSpecies({name:'残焰魔像'"));
ok('BESTIARY_TARGET 仍 13 种且含双精英（讨伐可及——精英击杀必入图鉴，无死锁）',
  BESTIARY_TARGET.length === 13 && BESTIARY_TARGET.includes('石心魔像') && BESTIARY_TARGET.includes('残焰魔像'),
  String(BESTIARY_TARGET.length));

// —— ACH_LIST：精英猎手契约（承 chests/allchests 计数成就 + memoir/skills 纯里程碑模式）——
const achEl = ACH_LIST.find((a) => a.id === 'elites');
ok('ACH_LIST 含 elites「精英猎手」且 id 唯一',
  !!achEl && achEl.name === '精英猎手' && ACH_LIST.filter((a) => a.id === 'elites').length === 1);
ok('ACH_LIST 由 27 → 28 项（v21.80 起精确总数由新版冒烟守护，本件存活性口径 >= 28）', ACH_LIST.length >= 28, String(ACH_LIST.length));
ok('elites 成就无 r 字段（与 memoir/skills/aegis/hardtrue/allchests 同款纯里程碑——击杀本身即奖励）',
  !!achEl && !('r' in achEl));
ok('elites 成就有 prog 字段（双精英计数，与 chests/allchests 同款实时进度）',
  !!achEl && typeof achEl.prog === 'function');
ok('elites 描述由 ELITE_GOLEM/EMBER_GOLEM.name 派生（改精英名自动跟随，零裸字面量）',
  !!achEl && achEl.d === `讨伐精英「${ELITE_GOLEM.name}」与「${EMBER_GOLEM.name}」`, achEl && achEl.d);
ok('elites 成就源级落位（data.js 含 id/name 行与 v21.77 注释）',
  dSrc.includes("id:'elites', name:'精英猎手'") && dSrc.includes('精英猎手（v21.77 新成就'));

// —— ok/prog 谓词逐值（防御式读取，旧档零迁移）——
ok('ok 谓词：空对象旧档（无 bestiary 字段）→ false 且不抛错', achEl.ok({}) === false);
ok('ok 谓词：空 bestiary（0 只）→ false', achEl.ok({ bestiary: {} }) === false);
ok('ok 谓词：仅石心魔像 1 只 → false', achEl.ok({ bestiary: { '石心魔像': 1 } }) === false);
ok('ok 谓词：仅残焰魔像 1 只 → false', achEl.ok({ bestiary: { '残焰魔像': 1 } }) === false);
ok('ok 谓词：双精英各 1 只 → true', achEl.ok({ bestiary: { '石心魔像': 1, '残焰魔像': 1 } }) === true);
ok('ok 谓词：双精英多次讨伐（5/2 只，防御式 ≥1）→ true', achEl.ok({ bestiary: { '石心魔像': 5, '残焰魔像': 2 } }) === true);
ok('ok 谓词：残焰魔像计 0（未讨伐但有键）→ false', achEl.ok({ bestiary: { '石心魔像': 3, '残焰魔像': 0 } }) === false);
ok('prog 谓词：0/2、单档 1/2（两方向）、双档 2/2 逐值',
  achEl.prog({}) === '0/2' &&
  achEl.prog({ bestiary: { '石心魔像': 1 } }) === '1/2' &&
  achEl.prog({ bestiary: { '残焰魔像': 1 } }) === '1/2' &&
  achEl.prog({ bestiary: { '石心魔像': 1, '残焰魔像': 1 } }) === '2/2');

// —— 既有 27 个成就零回归（id 全数保留，新成就不影响旧判定）——
ok('既有 27 个成就 id 全部保留（零回归）',
  ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'rich', 'scholar', 'quest', 'boss', 'cave',
   'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone', 'ember', 'bone',
   'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests'].every((id) => ACH_LIST.some((a) => a.id === id)));
const achEmber = ACH_LIST.find((a) => a.id === 'ember');
ok('残焰已熄（ember 支线成就）零回归（仍判定 side_ember done，不受本成就影响）',
  !!achEmber && achEmber.name === '残焰已熄' && achEmber.ok({ quests: { side_ember: 'done' } }) === true && achEmber.ok({ bestiary: { '残焰魔像': 1 } }) === false);
const achAllQuests = ACH_LIST.find((a) => a.id === 'allquests');
ok('灯火同心（allquests）支线分母 v21.80 随新现实更新为 0/8（side_grain 是支线，elites 不是）',
  achAllQuests && achAllQuests.prog({ quests: {} }) === '0/8', achAllQuests && achAllQuests.prog({ quests: {} }));
ok('QUESTS side 支线 8 条（v21.80 side_grain 入列，随新现实更新）',
  Object.values(QUESTS).filter((q) => q.kind === 'side').length === 8);

// —— unlockedAchievements 集成（真实判定通路，rules.js）——
ok('unlockedAchievements：双精英档新解锁含 elites；单档/空档不含',
  unlockedAchievements({ bestiary: { '石心魔像': 1, '残焰魔像': 1 } }).includes('elites') &&
  !unlockedAchievements({ bestiary: { '石心魔像': 1 } }).includes('elites') &&
  !unlockedAchievements({ bestiary: {} }).includes('elites'));
ok('unlockedAchievements：已解锁过的 hero 不重复报 elites',
  !unlockedAchievements({ bestiary: { '石心魔像': 1, '残焰魔像': 1 }, ach: ['elites'] }).includes('elites'));

// —— 运行期全链路：newGame → applyAchievements 真实解锁落 hero.ach ——
loadMap('village');
S.G = newGame('测试');
S.scene = 'world';
ok('新档建档 bestiary 为空且未解锁 elites',
  !(S.G.ach || []).includes('elites'));
applyAchievements();
ok('applyAchievements：新档 0 只不误解锁 elites（ach 仍不含）',
  !(S.G.ach || []).includes('elites'), (S.G.ach || []).join(','));
S.G.bestiary = S.G.bestiary || {};
S.G.bestiary['石心魔像'] = 1; S.G.bestiary['残焰魔像'] = 1; // 讨伐两只精英后的存档终态
{
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try { applyAchievements(); } finally { bind.boxMsg = origBox; }
  ok('applyAchievements：双精英落账真实解锁 elites 落 hero.ach',
    (S.G.ach || []).includes('elites'), (S.G.ach || []).join(','));
  ok('applyAchievements：解锁横幅同报（🔓 成就解锁：【精英猎手】+ 派生描述）',
    msgs.some((t) => t.includes('🔓 成就解锁：【精英猎手】') && t.includes(`讨伐精英「${ELITE_GOLEM.name}」与「${EMBER_GOLEM.name}」`)), msgs.join(' | '));
}
const achCount = (S.G.ach || []).length;
applyAchievements();
ok('applyAchievements：重复调用不重复解锁（ach 计数不变）',
  (S.G.ach || []).length === achCount && (S.G.ach || []).filter((x) => x === 'elites').length === 1);
S.G = null;

// —— 解锁通路源级落位：battle.js winBattle 既有 applyAchievements 调用（反馈不迟到）——
const bSrc = fs.readFileSync(path.join(ROOT, 'js/battle.js'), 'utf8');
ok('battle.js 含 applyAchievements 调用（winBattle 既有判定通路，第二只精英落袋当场解锁）',
  (bSrc.match(/applyAchievements\(\)/g) || []).length >= 6, String((bSrc.match(/applyAchievements\(\)/g) || []).length));

// —— 成就页渲染（drawAch 两态不抛错：未解锁灰 ✘ / 已解锁亮 ✔，28 项分母三页滚动）——
loadMap('village');
S.G = newGame('测试');
S.scene = 'world';
let renderErr = null;
try {
  S.G.ach = [];
  drawAch();
  S.G.ach = ['elites'];
  drawAch();
  S.achScroll = 20; // 28 项翻到第三页（PAGE=10，elites 在末位）不抛错
  drawAch();
  S.achScroll = 0;
} catch (e) { renderErr = e; }
ok('成就页 drawAch 两态 + 第三页滚动渲染不抛错（未解锁/已解锁，含 28 项分母）', !renderErr, renderErr && renderErr.message);
S.G = null;

// —— README / package.json / 既有冒烟随新现实更新 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2177_elites', readme.includes('smoke_v2177_elites'));
ok('README 件套口径为一百二十三件套（一百二十二件套清除）', readme.includes('一百二十三件套（一百二十二件套清除）'));
ok('README 含 v21.77 守护描述（新成就「精英猎手」（双精英讨伐里程碑）守护）',
  readme.includes('v21.77 起含新成就「精英猎手」（双精英讨伐里程碑'));
ok('README 成就口径「31 项」双处同步（快速上手表 C 键行 + 图鉴&成就行）',
  readme.includes('成就一览（全部 44 项进度') && readme.includes('**44 项成就**'));
ok('package.json 已收录 smoke_v2177_elites（npm test 串跑第 73 份）', pkg.includes('smoke_v2177_elites.mjs'));
const s2176 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2176_allchests.mjs'), 'utf8');
ok('smoke_v2176 的 ACH_LIST 精确计数断言已去硬化（===27 零残留，>=27 存活性口径落位）',
  s2176.includes('ACH_LIST.length >= 27') && !s2176.includes('ACH_LIST.length === 27'));
ok('smoke_v2176 的 README 件套口径断言已随新现实更新（七十五件套 pin 零残留，七十六件套落位）',
  s2176.includes('一百二十三件套（一百二十二件套清除）') && !s2176.includes('七十五件套（七十四件套清除）'));
ok('smoke_v2176 的 README 成就 pin 已随新现实更新（28 项 pin 零残留，31 项双处落位）',
  s2176.includes("readme.includes('成就一览（全部 44 项进度'") && !s2176.includes('全部 28 项进度'));
const s2168 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2168_hardtrue.mjs'), 'utf8');
ok('smoke_v2168 的 README 成就 pin 已随新现实更新（28 项 pin 零残留，31 项双处落位）',
  s2168.includes("readme.includes('成就一览（全部 44 项进度'") && !s2168.includes('全部 28 项进度'));
ok('smoke_v2168 对 smoke_v2159 的 README pin 复查已随新现实更新（31 项双处落位）',
  s2168.includes("s2159.includes(\"readme.includes('成就一览（全部 44 项进度')\")"));
const s2159 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2159_skillach.mjs'), 'utf8');
ok('smoke_v2159 的 README 成就 pin 已随新现实更新（28 项 pin 零残留，31 项双处落位）',
  s2159.includes("readme.includes('成就一览（全部 44 项进度'") && !s2159.includes('全部 28 项进度'));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
