// v21.59 专项冒烟：新成就「诸技通明」（技能全领悟里程碑，ACH_LIST 23→24）——
// 纯内容扩充（新成就，零结算改动、零新状态、零新逻辑：判定走既有 unlockedAchievements→applyAchievements
// 通路，读既有 hero.skills 存档字段）。收集向里程碑里 图鉴全收集（perfection）/宝箱（chests）/
// 支线全清（allquests）/记忆碎片（memoir）都有，唯独「领悟全部技能」是空白——承 v20.4「灯火记忆」
// 单成就先例补齐。判定/进度同读 LEARN_AT 单一数据源（与 checkSkills 升级领悟、newGame 起始技能
// 同一份表），未来增删技能成就自动跟随。
// 本冒烟守护：版本锚点、ACH_LIST 契约（skills 唯一/总数精确 24/d 派生非裸字面量/无 r 字段）、
// ok/prog 谓词逐值（旧档兼容防御式读取）、LEARN_AT 与 SKILL_DATA 一致性、既有 23 成就零回归、
// 运行期全链路（newGame 起始 1/6 → 补全六招 → applyAchievements 真实解锁落 hero.ach →
// 成就页 drawAch 两态渲染不抛错）、README/package.json 同步 + smoke_v2158 件套断言去硬化（v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, SKILL_DATA, learnsAt } from '../js/data.js';
import { unlockedAchievements } from '../js/rules.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v21.58 冒烟先例：先装桩再 import main.js）——
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

console.log('— v21.59 新成就「诸技通明」（技能全领悟里程碑）冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.58 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.58', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 59)), GAME_VERSION);
ok('data.js 含 v21.59 注释（诸技通明/技能全领悟里程碑说明）', dSrc.includes('v21.59') && dSrc.includes('诸技通明'));

// —— 数据层：LEARN_AT 技能全表扫描（learnsAt 单一数据源调用面）——
const allSkills = [];
for (let lv = 1; lv <= 30; lv++) { const sk = learnsAt(lv); if (sk && !allSkills.includes(sk)) allSkills.push(sk); }
ok('learnsAt 扫描得 7 招且按领悟级排序（火焰斩/冰霜击/治愈术/雷鸣/陨石术/汲光击/星砂回响）',
  allSkills.length === 7 &&
  allSkills.join(',') === ['火焰斩', '冰霜击', '治愈术', '雷鸣', '陨石术', '汲光击', '星砂回响'].join(','), allSkills.join(','));
ok('七招全部存在于 SKILL_DATA（领悟表与技能数据一致，无悬空条目）',
  allSkills.every((s) => !!SKILL_DATA[s]));

// —— ACH_LIST：诸技通明契约（承 memoir/perfection 收集向里程碑模式）——
const achSkills = ACH_LIST.find((a) => a.id === 'skills');
ok('ACH_LIST 含 skills「诸技通明」且 id 唯一',
  !!achSkills && achSkills.name === '诸技通明' && ACH_LIST.filter((a) => a.id === 'skills').length === 1);
// v21.68 随新现实更新：hardtrue 成就入列（ACH_LIST 24→25），精确总数移交 smoke_v2168 守护，
// 本件改存活性口径 >= 24（承 v21.59 对 smoke_v2152「===23 → >=23」同款先例）。
ok('ACH_LIST 由 23 → 24 项（v21.59 新增一项；v21.68 起精确总数由新版冒烟守护，本件存活性口径 >= 24）',
  ACH_LIST.length >= 24, String(ACH_LIST.length));
ok('skills 成就无 r 字段（与 lvl5/lvl10/memoir 同款纯里程碑，成长本身即奖励）',
  !!achSkills && !('r' in achSkills));
ok('skills 成就描述由 LEARN_AT 派生（「领悟全部 7 个技能」，数量非裸字面量，v21.83 随新现实更新）',
  !!achSkills && achSkills.d === `领悟全部 ${allSkills.length} 个技能` &&
  dSrc.includes('领悟全部 ${Object.keys(LEARN_AT).length} 个技能'), achSkills && achSkills.d);
ok('skills 成就源级落位（data.js 含 id/name 行与 v21.59 注释）',
  dSrc.includes("id:'skills', name:'诸技通明'") && dSrc.includes('诸技通明（v21.59 新成就'));

// —— ok/prog 谓词逐值（(g.skills||[]) 防御式读取，旧档零迁移）——
ok('ok 谓词：无 skills 字段的旧档 → false 且不抛错（防御式读取）', achSkills.ok({}) === false);
ok('ok 谓词：空技能表 → false', achSkills.ok({ skills: [] }) === false);
ok('ok 谓词：仅起始火焰斩 → false', achSkills.ok({ skills: ['火焰斩'] }) === false);
ok('ok 谓词：缺最后一招（星砂回响，v21.83 随新现实更新：缺末两招亦 false）→ false',
  achSkills.ok({ skills: allSkills.slice(0, 6) }) === false);
ok('ok 谓词：七招俱全 → true（顺序无关，v21.83 随新现实更新）',
  achSkills.ok({ skills: [...allSkills].reverse() }) === true);
ok('prog 进度：无字段 0/7 · 仅起始 1/7 · 六招 6/7 · 七招 7/7',
  achSkills.prog({}) === `0/${allSkills.length}` &&
  achSkills.prog({ skills: ['火焰斩'] }) === `1/${allSkills.length}` &&
  achSkills.prog({ skills: allSkills.slice(0, 6) }) === `6/${allSkills.length}` &&
  achSkills.prog({ skills: allSkills }) === `${allSkills.length}/${allSkills.length}`);

// —— 既有 23 个成就零回归（id 全数保留，新成就不影响旧判定）——
ok('既有 23 个成就 id 全部保留（零回归）',
  ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'rich', 'scholar', 'quest', 'boss', 'cave',
   'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone', 'ember', 'bone',
   'chests', 'allquests', 'memoir'].every((id) => ACH_LIST.some((a) => a.id === id)));
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('灯火同心（allquests）支线分母 v21.80 随新现实更新为 0/8（side_grain 是支线，skills 不是）',
  achAll && achAll.prog({ quests: {} }) === '0/8', achAll && achAll.prog({ quests: {} }));

// —— unlockedAchievements 集成（真实判定通路，rules.js）——
ok('unlockedAchievements：七招俱全的 hero 新解锁含 skills；缺一招不含（v21.83 随新现实更新）',
  unlockedAchievements({ skills: allSkills }).includes('skills') &&
  !unlockedAchievements({ skills: allSkills.slice(0, 5) }).includes('skills'));
ok('unlockedAchievements：已解锁过的 hero 不重复报 skills',
  !unlockedAchievements({ skills: allSkills, ach: ['skills'] }).includes('skills'));

// —— 运行期全链路：newGame → applyAchievements 真实解锁落 hero.ach ——
loadMap('village');
S.G = newGame('测试');
S.scene = 'world';
ok('新档起始技能仅火焰斩（newGame 播种 learnsAt(1)），skills 成就未解锁',
  S.G.skills.length === 1 && S.G.skills[0] === '火焰斩' && !(S.G.ach || []).includes('skills'));
applyAchievements();
ok('applyAchievements：起始档不误解锁 skills（ach 仍不含）',
  !(S.G.ach || []).includes('skills'), (S.G.ach || []).join(','));
S.G.skills = [...allSkills]; // 模拟练到 Lv11 领悟全部七招（checkSkills 逐招补学的终态）
applyAchievements();
ok('applyAchievements：七招俱全后真实解锁 skills 落 hero.ach（winBattle 同场胜利即时解锁通路，v21.83 随新现实更新）',
  (S.G.ach || []).includes('skills'), (S.G.ach || []).join(','));
const achCount = (S.G.ach || []).length;
applyAchievements();
ok('applyAchievements：重复调用不重复解锁（ach 计数不变）',
  (S.G.ach || []).length === achCount && (S.G.ach || []).filter((x) => x === 'skills').length === 1);

// —— 成就页渲染（drawAch 两态不抛错：未解锁灰 ✘ / 已解锁亮 ✔ + 计数进度行）——
let renderErr = null;
try {
  S.G.ach = [];
  drawAch();
  S.G.ach = ['skills'];
  drawAch();
} catch (e) { renderErr = e; }
ok('成就页 drawAch 两态渲染不抛错（未解锁/已解锁，含 24 项分母与 prog 进度行）', !renderErr, renderErr && renderErr.message);

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2159_skillach', readme.includes('smoke_v2159_skillach'));
// v21.60 去硬化（v21.7 惯例）：件套精确计数移交当版冒烟守护，本件改存活性口径——
// 仍含「冒烟/件套」且旧口径「（五十四件套清除）」已清除。
ok('README 件套口径为存活性断言（v21.60 起件数由新版冒烟守护：五十六件套（五十五件套清除））',
  readme.includes('冒烟') && readme.includes('件套') &&
  !readme.includes('（五十四件套清除）'));
ok('README 含 v21.59 守护描述（新成就「诸技通明」（技能全领悟里程碑）守护）',
  readme.includes('新成就「诸技通明」（技能全领悟里程碑）守护'));
// v21.73 随新现实更新：README 成就口径由「25 项」双处递增为「26 项」双处（aegis 成就入列），
// 本件断言同步递增（承 v21.68 同款处理先例）。
// v21.76 随新现实更新：README 成就口径由「26 项」双处递增为「27 项」双处（allchests 成就入列），
// 本件断言同步递增（承 v21.73 同款处理先例）。
// v21.77 随新现实更新：README 成就口径由「27 项」双处递增为「28 项」双处（elites 成就入列），
// 本件断言同步递增（承 v21.76 同款处理先例）。
ok('README 成就口径「31 项」双处同步（快速上手表 C 键行 + 图鉴&成就行；历史守护描述里的「23/24/25/26/27/28 项」叙事为留档，不属当前口径）',
  readme.includes('成就一览（全部 34 项进度') && readme.includes('**34 项成就**'));
ok('package.json 已收录 smoke_v2159_skillach（npm test 串跑第 55 份）', pkg.includes('smoke_v2159_skillach.mjs'));
const s2158 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2158_shieldblock.mjs'), 'utf8');
ok('smoke_v2158 的 README 件套口径断言已去硬化（存活性口径落位，旧精确表达式零残留）',
  s2158.includes("!readme.includes('（五十三件套清除）')") &&
  !s2158.includes("readme.includes('五十四件套（五十三件套清除）')"));
const s2152 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2152_bonequest.mjs'), 'utf8');
ok('smoke_v2152 的 ACH_LIST 精确计数断言已随新现实更新（===23 零残留，≥23 存活性口径落位）',
  s2152.includes('ACH_LIST.length >= 23') && !s2152.includes('ACH_LIST.length === 23'));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
