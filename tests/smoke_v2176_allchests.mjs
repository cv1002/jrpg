// v21.76 专项冒烟：新成就「一箱不漏」（全图宝箱全收集里程碑，ACH_LIST 26→27）——
// 纯内容扩充（新成就，零结算改动、零新状态、零新逻辑：判定走既有 unlockedAchievements→
// applyAchievements 通路，读既有 hero.chests 存档字段）。收集向「全」档版图的最后一块空白：
// 图鉴全收集（perfection）/支线全清（allquests）/记忆碎片（memoir）/技能全领悟（skills）
// 都有满档里程碑，唯独宝箱只有 6 只半程档「开箱寻宝」（TREASURE_GOAL）——开遍全图 12 只
// （镇2+林3+矿2+星砂宝藏4+廊1，chestTotal() 单一数据源，v21.22 起状态页「已开 X/全图 N」
// 同源公示）的玩家没有任何纪念。判定/进度同读 chestCount/chestTotal 一份源（加/删宝箱只改
// MAPS/CAVE_TREASURE 一处、成就自动跟随，绝无第二套口径）；chestCount 防御式兼容 Set/数组/
// 缺失三形态，旧档零迁移；无 r 字段（与 memoir/skills/aegis/hardtrue 同款纯里程碑——宝箱
// 内容本身就是奖励）。解锁时机：world.onChestStep 开箱当场 applyAchievements（v19.51 既有
// 「反馈不迟到」通路），第 12 只落袋即解锁。可达性前提：hero.chests 以裸「x,y」局部坐标为键，
// 跨图撞键会让 Set 去重、12 永不可达——本冒烟逐图扫描钉死全图坐标唯一性。
// 本冒烟守护：版本锚点、chestCount/chestTotal 契约、全图宝箱坐标键跨图唯一性（可达性）、
// ACH_LIST 契约（allchests 唯一/总数精确 27/无 r 有 prog/d 由 chestTotal 派生）、ok/prog 谓词
// 逐值（Set/数组/缺失三形态）、既有 26 成就零回归、开箱寻宝（6 只半程档）与灯火同心分母不受影响、
// unlockedAchievements 集成、运行期全链路（newGame 不解锁 → 12 只落袋解锁+横幅 → 重复去重）、
// 运行期 E2E（world.move 真实踩箱：预填 11 只后踩第 12 只当场解锁，v19.51 开箱当场判定通路）、
// drawAch 27 项三页滚动渲染不抛错、README/package.json 同步 + smoke_v2175 件套断言去硬化（v21.7
// 惯例）+ smoke_v2173 总数断言随新现实更新确认。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, MAPS, CAVE_TREASURE, TREASURE_GOAL, chestCount, chestTotal } from '../js/data.js';
import { unlockedAchievements } from '../js/rules.js';
import { bind } from '../js/bind.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v21.75 冒烟先例：先装桩再 import main.js）——
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
const { loadMap, move } = await import('../js/world.js');
const { drawAch } = await import('../js/view/menus.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.76 新成就「一箱不漏」（全图宝箱全收集里程碑）冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.75 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.75', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 76)), GAME_VERSION);
ok('data.js 含 v21.76 注释（一箱不漏/全图宝箱全收集里程碑说明）', dSrc.includes('v21.76') && dSrc.includes('一箱不漏'));

// —— 数据源契约：chestTotal/chestCount（v21.22 单一数据源）——
ok('chestTotal() === 12（镇2+林3+矿2+星砂宝藏4+廊1，与 v21.19 全图十二只口径恒等）', chestTotal() === 12, String(chestTotal()));
ok('chestCount 三形态防御式兼容（Set 读 size / 数组读 length / 缺失计 0）',
  chestCount({ chests: new Set(['1,1', '2,2']) }) === 2 &&
  chestCount({ chests: ['1,1', '2,2', '3,3'] }) === 3 &&
  chestCount({}) === 0 && chestCount(null) === 0);
ok('TREASURE_GOAL 仍 6 且 < chestTotal()（开箱寻宝半程档未动，语义自洽）',
  TREASURE_GOAL === 6 && TREASURE_GOAL < chestTotal());

// —— 可达性守护：全图宝箱局部坐标键跨图无冲突（hero.chests 以裸「x,y」为键，
//     撞键则 Set 去重、chestCount 永不可达 chestTotal → 成就死锁；逐图扫描钉死）——
{
  const pos = new Set();
  for (const def of Object.values(MAPS)) {
    for (let y = 0; y < (def.rows || []).length; y++) {
      const row = def.rows[y];
      for (let x = 0; x < row.length; x++) if (row[x] === 'C') pos.add(x + ',' + y);
    }
  }
  for (const [x, y] of (CAVE_TREASURE || [])) pos.add(x + ',' + y);
  ok('全图宝箱坐标键跨图唯一（12 只逐只可开可达，无撞键死锁）', pos.size === chestTotal(), `唯一键 ${pos.size} / 总数 ${chestTotal()}`);
}

// —— ACH_LIST：一箱不漏契约（承 chests 计数成就 + memoir/skills 全收集档模式）——
const achAll6 = ACH_LIST.find((a) => a.id === 'allchests');
ok('ACH_LIST 含 allchests「一箱不漏」且 id 唯一',
  !!achAll6 && achAll6.name === '一箱不漏' && ACH_LIST.filter((a) => a.id === 'allchests').length === 1);
ok('ACH_LIST 由 26 → 27 项（v21.77 起精确总数由新版冒烟守护，本件存活性口径 >= 27）', ACH_LIST.length >= 27, String(ACH_LIST.length));
ok('allchests 成就无 r 字段（与 memoir/skills/aegis/hardtrue 同款纯里程碑——宝箱内容本身就是奖励）',
  !!achAll6 && !('r' in achAll6));
ok('allchests 成就有 prog 字段（计数成就，与 chests/lucky/hunt10 同款实时进度）',
  !!achAll6 && typeof achAll6.prog === 'function');
ok('allchests 描述由 chestTotal() 派生（「开启全图全部 12 个宝箱」——加/删宝箱自动跟随，零裸字面量）',
  !!achAll6 && achAll6.d === `开启全图全部 ${chestTotal()} 个宝箱`, achAll6 && achAll6.d);
ok('allchests 成就源级落位（data.js 含 id/name 行与 v21.76 注释）',
  dSrc.includes("id:'allchests', name:'一箱不漏'") && dSrc.includes('一箱不漏（v21.76 新成就'));

// —— ok/prog 谓词逐值（防御式读取，旧档零迁移）——
ok('ok 谓词：空对象旧档（无 chests 字段）→ false 且不抛错', achAll6.ok({}) === false);
ok('ok 谓词：新档空 Set（0 只）→ false', achAll6.ok({ chests: new Set() }) === false);
ok('ok 谓词：半程 6 只（开箱寻宝刚达成）→ false', achAll6.ok({ chests: new Set(['a', 'b', 'c', 'd', 'e', 'f']) }) === false);
ok('ok 谓词：11 只（差最后一只）→ false',
  achAll6.ok({ chests: new Set(Array.from({ length: 11 }, (_, i) => String(i))) }) === false);
ok('ok 谓词：12 只 Set（全收集）→ true',
  achAll6.ok({ chests: new Set(Array.from({ length: 12 }, (_, i) => String(i))) }) === true);
ok('ok 谓词：12 只数组形态（读档还原前旧档兼容）→ true',
  achAll6.ok({ chests: Array.from({ length: 12 }, (_, i) => String(i)) }) === true);
ok('ok 谓词：超出 13 只（防御式 ≥，未来加箱旧档不反锁）→ true',
  achAll6.ok({ chests: new Set(Array.from({ length: 13 }, (_, i) => String(i))) }) === true);
ok('prog 谓词：0/12、6/12、12/12 三档逐值',
  achAll6.prog({}) === '0/12' &&
  achAll6.prog({ chests: new Set(['a', 'b', 'c', 'd', 'e', 'f']) }) === '6/12' &&
  achAll6.prog({ chests: new Set(Array.from({ length: 12 }, (_, i) => String(i))) }) === '12/12');

// —— 既有 26 个成就零回归（id 全数保留，新成就不影响旧判定）——
ok('既有 26 个成就 id 全部保留（零回归）',
  ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'rich', 'scholar', 'quest', 'boss', 'cave',
   'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone', 'ember', 'bone',
   'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis'].every((id) => ACH_LIST.some((a) => a.id === id)));
const achChests = ACH_LIST.find((a) => a.id === 'chests');
ok('开箱寻宝（chests）半程档零回归（仍 6 只阈值：6 只 ok=true / 5 只 false，prog 6/6）',
  !!achChests && achChests.ok({ chests: new Set(['a', 'b', 'c', 'd', 'e', 'f']) }) === true &&
  achChests.ok({ chests: new Set(['a', 'b', 'c', 'd', 'e']) }) === false &&
  achChests.prog({ chests: new Set(['a', 'b', 'c', 'd', 'e', 'f']) }) === '6/6');
const achAllQuests = ACH_LIST.find((a) => a.id === 'allquests');
ok('灯火同心（allquests）支线分母 v21.80 随新现实更新为 0/8（side_grain 是支线，allchests 不是）',
  achAllQuests && achAllQuests.prog({ quests: {} }) === '0/8', achAllQuests && achAllQuests.prog({ quests: {} }));

// —— unlockedAchievements 集成（真实判定通路，rules.js）——
ok('unlockedAchievements：12 只档新解锁含 allchests；11 只档不含',
  unlockedAchievements({ chests: new Set(Array.from({ length: 12 }, (_, i) => String(i))) }).includes('allchests') &&
  !unlockedAchievements({ chests: new Set(Array.from({ length: 11 }, (_, i) => String(i))) }).includes('allchests'));
ok('unlockedAchievements：已解锁过的 hero 不重复报 allchests',
  !unlockedAchievements({ chests: new Set(Array.from({ length: 12 }, (_, i) => String(i))), ach: ['allchests'] }).includes('allchests'));

// —— 运行期全链路：newGame → applyAchievements 真实解锁落 hero.ach ——
loadMap('village');
S.G = newGame('测试');
S.scene = 'world';
ok('新档建档 chests 为空 Set 且未解锁 allchests',
  S.G.chests instanceof Set && S.G.chests.size === 0 && !(S.G.ach || []).includes('allchests'));
applyAchievements();
ok('applyAchievements：新档 0 只不误解锁 allchests（ach 仍不含）',
  !(S.G.ach || []).includes('allchests'), (S.G.ach || []).join(','));
S.G.chests = new Set(Array.from({ length: 12 }, (_, i) => String(i))); // 模拟开遍全图后的存档终态
{
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try { applyAchievements(); } finally { bind.boxMsg = origBox; }
  ok('applyAchievements：开遍全图 12 只真实解锁 allchests 落 hero.ach',
    (S.G.ach || []).includes('allchests'), (S.G.ach || []).join(','));
  ok('applyAchievements：解锁横幅同报（🔓 成就解锁：【一箱不漏】+ 派生描述）',
    msgs.some((t) => t.includes('🔓 成就解锁：【一箱不漏】') && t.includes(`开启全图全部 ${chestTotal()} 个宝箱`)), msgs.join(' | '));
}
const achCount = (S.G.ach || []).length;
applyAchievements();
ok('applyAchievements：重复调用不重复解锁（ach 计数不变）',
  (S.G.ach || []).length === achCount && (S.G.ach || []).filter((x) => x === 'allchests').length === 1);

// —— 运行期 E2E：world.move 真实踩箱（v19.51 开箱当场判定通路——第 12 只落袋即解锁）——
{
  loadMap('village');
  S.G = newGame('测试者');
  S.scene = 'world';
  // 预填全图其余 11 只（village (22,16)；dungeon (22,4)(12,11)(1,16)+星砂 (17,8)(18,8)(17,9)(18,9)；
  // cave (16,2)(1,12)；gallery (16,1)），唯独留 village (22,1) 作为真实踩踏的第 12 只
  S.G.chests = new Set(['22,16', '22,4', '12,11', '1,16', '17,8', '18,8', '17,9', '18,9', '16,2', '1,12', '16,1']);
  S.G.x = 22; S.G.y = 2; S.walk = null; // (22,1) 正下方，向上走一步即踩箱
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try { move(0, -1); } finally { bind.boxMsg = origBox; }
  ok('E2E：move(0,-1) 真实踩上村庄宝箱 (22,1)（hero 落位 22,1 且 chests 计入该键）',
    S.G.x === 22 && S.G.y === 1 && S.G.chests.has('22,1') && S.G.chests.size === 12,
    `x=${S.G.x},y=${S.G.y},size=${S.G.chests && S.G.chests.size}`);
  ok('E2E：第 12 只落袋当场解锁 allchests（反馈不迟到，onChestStep 既有 applyAchievements 通路）',
    (S.G.ach || []).includes('allchests'), (S.G.ach || []).join(','));
  ok('E2E：解锁横幅与开箱报文双段齐备（🔓 成就解锁：【一箱不漏】 + 📦/🍄 开箱反馈）',
    msgs.some((t) => t.includes('🔓 成就解锁：【一箱不漏】')) &&
    msgs.some((t) => t.includes('📦') || t.includes('🍄')), msgs.join(' | '));
  const before = (S.G.ach || []).length;
  S.walk = null;
  move(0, 1); move(0, -1); S.walk = null; move(0, 1); move(0, -1); // 已开箱格反复踩踏等同普通地面
  ok('E2E：已开箱格再踩不重复计解锁（ach 计数不变，承既有「已开等同地面」行为）',
    (S.G.ach || []).length === before && S.G.chests.size === 12);
}
S.G = null;

// —— 成就页渲染（drawAch 两态不抛错：未解锁灰 ✘ / 已解锁亮 ✔，27 项分母三页滚动）——
loadMap('village');
S.G = newGame('测试');
S.scene = 'world';
let renderErr = null;
try {
  S.G.ach = [];
  drawAch();
  S.G.ach = ['allchests'];
  drawAch();
  S.achScroll = 20; // 27 项翻到第三页（PAGE=10，allchests 在末位）不抛错
  drawAch();
  S.achScroll = 0;
} catch (e) { renderErr = e; }
ok('成就页 drawAch 两态 + 第三页滚动渲染不抛错（未解锁/已解锁，含 27 项分母）', !renderErr, renderErr && renderErr.message);

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2176_allchests', readme.includes('smoke_v2176_allchests'));
ok('README 件套口径为一百二十一件套（一百二十件套清除）', readme.includes('一百二十一件套（一百二十件套清除）'));
ok('README 含 v21.76 守护描述（新成就「一箱不漏」（全图宝箱全收集里程碑）守护）',
  readme.includes('新成就「一箱不漏」（全图宝箱全收集里程碑）守护'));
// v21.77 随新现实更新：README 成就口径由「27 项」双处递增为「28 项」双处（elites 成就入列），
// 本件断言同步递增（承 v21.73/v21.76 同款处理先例）。
ok('README 成就口径「31 项」双处同步（快速上手表 C 键行 + 图鉴&成就行）',
  readme.includes('成就一览（全部 44 项进度') && readme.includes('**44 项成就**'));
ok('package.json 已收录 smoke_v2176_allchests（npm test 串跑第 72 份）', pkg.includes('smoke_v2176_allchests.mjs'));
const s2175 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2175_battletag.mjs'), 'utf8');
ok('smoke_v2175 的 README 件套口径断言已去硬化（存活性口径落位，旧精确表达式零残留）',
  s2175.includes("!readme.includes('（七十件套清除）')") &&
  !s2175.includes("readme.includes('七十一件套（七十件套清除）')"));
const s2173 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2173_aegis.mjs'), 'utf8');
ok('smoke_v2173 的 ACH_LIST 精确计数断言已随新现实更新（===26 零残留，>=26 存活性口径落位）',
  s2173.includes('ACH_LIST.length >= 26') && !s2173.includes('ACH_LIST.length === 26'));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
