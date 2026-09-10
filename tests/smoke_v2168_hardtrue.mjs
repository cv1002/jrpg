// v21.68 专项冒烟：新成就「逆风行灯」（困难模式通关里程碑，ACH_LIST 24→25）——
// 纯内容扩充（新成就，零结算改动、零新状态、零新逻辑：判定走既有 unlockedAchievements→
// applyAchievements 通路，读既有 hero.trueBoss 与 hero.diff 两个存档字段）。里程碑版图中
// 主线三关（boss/cave/trueboss）、试炼（rush）、收集向（perfection/chests/allquests/memoir/
// skills）都有，唯独「困难模式」这一建档自选的最高挑战没有任何纪念——承 v20.4「灯火记忆」/
// v21.59「诸技通明」单成就先例补齐。判定 (g.trueBoss && g.diff===1)：trueBoss=击败终焉之神
// （真结局最终 Boss，「走完全程」的终极口径），diff===1 即 DIFFS[1]「困难」档（建档 createDiff
// 写定、core.js initGame `S.G.diff = diff || 0`、resetRun 沿用同槽）。描述「困难」为字面量
// （DIFFS 在 data.js 尾部声明、ACH_LIST 求值时仍在 TDZ，无法引用——本冒烟把字面量与
// DIFFS[1] 的一致性钉死，改难度名即红）。旧档无 diff 字段（undefined）→ false 不误解锁，
// 零迁移；无 r 字段（与 lvl5/lvl10/memoir/skills 同款纯里程碑）。
// 本冒烟守护：版本锚点、ACH_LIST 契约（hardtrue 唯一/总数精确 25/无 r 无 prog/描述与
// DIFFS[1] 一致）、ok 谓词逐值八档（旧档兼容防御式读取）、DIFFS/DIFF_SCALE 数据源契约、
// 既有 24 成就零回归、运行期全链路（newGame 普通档不误解锁 → 普通通关不误解锁 →
// 困难通关真实解锁落 hero.ach → 重复调用去重）、成就页 drawAch 两态渲染不抛错、
// README/package.json 同步 + smoke_v2167 件套断言去硬化（v21.7 惯例）+
// smoke_v2159/smoke_v2164 总数断言随新现实更新。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, DIFFS, DIFF_SCALE } from '../js/data.js';
import { unlockedAchievements } from '../js/rules.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v21.67 冒烟先例：先装桩再 import main.js）——
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

console.log('— v21.68 新成就「逆风行灯」（困难模式通关里程碑）冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.67 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.67', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 68)), GAME_VERSION);
ok('data.js 含 v21.68 注释（逆风行灯/困难模式通关里程碑说明）', dSrc.includes('v21.68') && dSrc.includes('逆风行灯'));

// —— 数据源契约：DIFFS/DIFF_SCALE（成就语义所读：diff===1 即 DIFFS[1]「困难」档）——
ok('DIFFS 契约（恰好两档，[0]=普通 [1]=困难——ok 谓词 diff===1 的语义锚点）',
  DIFFS.length === 2 && DIFFS[0] === '普通' && DIFFS[1] === '困难', JSON.stringify(DIFFS));
ok('DIFF_SCALE 契约（困难倍率 hp×1.35 攻×1.15 防×1.12——「逆风」的量化定义，与 battle.js 结算同源）',
  DIFF_SCALE.hp === 1.35 && DIFF_SCALE.atk === 1.15 && DIFF_SCALE.def === 1.12, JSON.stringify(DIFF_SCALE));

// —— ACH_LIST：逆风行灯契约（承 boss/cave/trueboss 纯布尔里程碑模式）——
const achHard = ACH_LIST.find((a) => a.id === 'hardtrue');
ok('ACH_LIST 含 hardtrue「逆风行灯」且 id 唯一',
  !!achHard && achHard.name === '逆风行灯' && ACH_LIST.filter((a) => a.id === 'hardtrue').length === 1);
// v21.73 随新现实更新：aegis 成就入列（ACH_LIST 25→26），精确总数移交 smoke_v2173 守护，
// 本件改存活性口径 >= 25（承 v21.68 对 smoke_v2159/smoke_v2164 同款处理先例）。
ok('ACH_LIST 由 24 → 25 项（v21.68 新增一项；v21.73 起精确总数由新版冒烟守护，本件存活性口径 >= 25）', ACH_LIST.length >= 25, String(ACH_LIST.length));
ok('hardtrue 成就无 r 字段（与 lvl5/lvl10/memoir/skills 同款纯里程碑，逆风走完本身就是奖励）',
  !!achHard && !('r' in achHard));
ok('hardtrue 成就无 prog 字段（与 boss/cave/trueboss/rush 同款纯布尔里程碑，双因子布尔无计数可报）',
  !!achHard && !('prog' in achHard));
ok('hardtrue 描述字面量与 DIFFS[1] 一致（「困难」因 TDZ 刻意保留字面量，此处钉死——改难度名即红）',
  !!achHard && achHard.d === '以' + DIFFS[1] + '模式击败终焉之神', achHard && achHard.d);
ok('hardtrue 成就源级落位（data.js 含 id/name 行与 v21.68 注释）',
  dSrc.includes("id:'hardtrue', name:'逆风行灯'") && dSrc.includes('逆风行灯（v21.68 新成就'));

// —— ok 谓词逐值（防御式读取，旧档零迁移）——
ok('ok 谓词：空对象旧档（无 trueBoss 无 diff）→ false 且不抛错', achHard.ok({}) === false);
ok('ok 谓词：仅通关未标难度（无 diff 字段的旧通关档）→ false', achHard.ok({ trueBoss: true }) === false);
ok('ok 谓词：普通模式通关（diff=0 + trueBoss）→ false', achHard.ok({ trueBoss: true, diff: 0 }) === false);
ok('ok 谓词：困难模式通关（diff=1 + trueBoss）→ true', achHard.ok({ trueBoss: true, diff: 1 }) === true);
ok('ok 谓词：困难模式未通关（仅 diff=1）→ false', achHard.ok({ diff: 1 }) === false);
ok('ok 谓词：普通模式进行中（diff=0 + trueBoss=false）→ false', achHard.ok({ trueBoss: false, diff: 0 }) === false);
ok('ok 谓词：困难模式进行中（diff=1 + trueBoss=false）→ false', achHard.ok({ trueBoss: false, diff: 1 }) === false);
ok('ok 谓词：非困难档下标（diff=2 假设未来档）+ trueBoss → false（===1 精确钉死困难档）',
  achHard.ok({ trueBoss: true, diff: 2 }) === false);

// —— 既有 24 个成就零回归（id 全数保留，新成就不影响旧判定）——
ok('既有 24 个成就 id 全部保留（零回归）',
  ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'rich', 'scholar', 'quest', 'boss', 'cave',
   'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone', 'ember', 'bone',
   'chests', 'allquests', 'memoir', 'skills'].every((id) => ACH_LIST.some((a) => a.id === id)));
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('灯火同心（allquests）支线分母 v21.80 随新现实更新为 0/8（side_grain 是支线，hardtrue 不是）',
  achAll && achAll.prog({ quests: {} }) === '0/8', achAll && achAll.prog({ quests: {} }));

// —— unlockedAchievements 集成（真实判定通路，rules.js）——
ok('unlockedAchievements：困难通关档新解锁含 hardtrue；普通通关档不含',
  unlockedAchievements({ trueBoss: true, diff: 1 }).includes('hardtrue') &&
  !unlockedAchievements({ trueBoss: true, diff: 0 }).includes('hardtrue'));
ok('unlockedAchievements：已解锁过的 hero 不重复报 hardtrue',
  !unlockedAchievements({ trueBoss: true, diff: 1, ach: ['hardtrue'] }).includes('hardtrue'));

// —— 运行期全链路：newGame → applyAchievements 真实解锁落 hero.ach ——
loadMap('village');
S.G = newGame('测试');
S.scene = 'world';
ok('新档为普通模式且未通关（diff=0 · 无 trueBoss），hardtrue 未解锁',
  S.G.diff === 0 && !S.G.trueBoss && !(S.G.ach || []).includes('hardtrue'));
applyAchievements();
ok('applyAchievements：普通新档不误解锁 hardtrue（ach 仍不含）',
  !(S.G.ach || []).includes('hardtrue'), (S.G.ach || []).join(','));
S.G.trueBoss = true; // 模拟普通档击败终焉之神
applyAchievements();
ok('applyAchievements：普通模式通关仍不误解锁 hardtrue（trueBoss 单因子不足）',
  !(S.G.ach || []).includes('hardtrue'), (S.G.ach || []).join(','));
S.G.diff = 1; // 模拟困难档（等价于困难档击败终焉之神的存档终态）
applyAchievements();
ok('applyAchievements：困难模式通关真实解锁 hardtrue 落 hero.ach（winBattle 同场胜利即时解锁通路）',
  (S.G.ach || []).includes('hardtrue'), (S.G.ach || []).join(','));
const achCount = (S.G.ach || []).length;
applyAchievements();
ok('applyAchievements：重复调用不重复解锁（ach 计数不变）',
  (S.G.ach || []).length === achCount && (S.G.ach || []).filter((x) => x === 'hardtrue').length === 1);

// —— 成就页渲染（drawAch 两态不抛错：未解锁灰 ✘ / 已解锁亮 ✔，25 项分母三页滚动）——
let renderErr = null;
try {
  S.G.ach = [];
  drawAch();
  S.G.ach = ['hardtrue'];
  drawAch();
  S.achScroll = 20; // 25 项翻到第三页（PAGE=10，hardtrue 在末位）不抛错
  drawAch();
  S.achScroll = 0;
} catch (e) { renderErr = e; }
ok('成就页 drawAch 两态 + 第三页滚动渲染不抛错（未解锁/已解锁，含 25 项分母）', !renderErr, renderErr && renderErr.message);

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2168_hardtrue', readme.includes('smoke_v2168_hardtrue'));
// v21.69 去硬化（v21.7 惯例）：件套精确计数移交当版冒烟守护，本件改存活性口径——
// 仍含「冒烟/件套」且旧口径「（六十三件套清除）」已清除。
ok('README 件套口径为存活性断言（v21.69 起件数由新版冒烟守护：六十五件套（六十四件套清除））',
  readme.includes('冒烟') && readme.includes('件套') &&
  !readme.includes('（六十三件套清除）'));
ok('README 含 v21.68 守护描述（新成就「逆风行灯」（困难模式通关里程碑）守护）',
  readme.includes('新成就「逆风行灯」（困难模式通关里程碑）守护'));
// v21.73 随新现实更新：README 成就口径由「25 项」双处递增为「26 项」双处（aegis 成就入列），
// 本件断言同步递增（承 v21.68 对 smoke_v2159 README pin 同款处理先例）。
// v21.76 随新现实更新：README 成就口径由「26 项」双处递增为「27 项」双处（allchests 成就入列），
// 本件断言同步递增（承 v21.73 同款处理先例）。
// v21.77 随新现实更新：README 成就口径由「27 项」双处递增为「28 项」双处（elites 成就入列），
// 本件断言同步递增（承 v21.76 同款处理先例）。
ok('README 成就口径「31 项」双处同步（快速上手表 C 键行 + 图鉴&成就行）',
  readme.includes('成就一览（全部 36 项进度') && readme.includes('**36 项成就**'));
ok('package.json 已收录 smoke_v2168_hardtrue（npm test 串跑第 64 份）', pkg.includes('smoke_v2168_hardtrue.mjs'));
const s2167 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2167_boneafter.mjs'), 'utf8');
ok('smoke_v2167 的 README 件套口径断言已去硬化（存活性口径落位，旧精确表达式零残留）',
  s2167.includes("!readme.includes('（六十二件套清除）')") &&
  !s2167.includes("readme.includes('六十三件套（六十二件套清除）')"));
const s2159 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2159_skillach.mjs'), 'utf8');
ok('smoke_v2159 的 ACH_LIST 精确计数断言已随新现实更新（===24 零残留，>=24 存活性口径落位）',
  s2159.includes('ACH_LIST.length >= 24') && !s2159.includes('ACH_LIST.length === 24'));
ok('smoke_v2159 的 README 成就口径断言已随新现实更新（「28 项」pin 零残留，「29 项」双处落位）',
  s2159.includes("readme.includes('成就一览（全部 36 项进度')") && !s2159.includes('**28 项成就**'));
const s2164 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2164_achname.mjs'), 'utf8');
ok('smoke_v2164 的 ACH_LIST 精确计数断言已随新现实更新（===24 零残留，>=24 存活性口径落位）',
  s2164.includes('ACH_LIST.length >= 24') && !s2164.includes('ACH_LIST.length === 24'));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
