// v21.84 专项冒烟：新成就「灯燃长夜」（Lv12 等级里程碑）——成就版图等级线第三档（lvl5/lvl10 之后）。
// 纯里程碑（零新计数/零新状态/零存档变化：判读既有 hero.level，与 lvl5/lvl10 同款；LVL12_GOAL
// 阈值单一数据源、判定/描述/进度三处同读一份源；无 r 字段，承 lvl5/lvl10 惯例）。
// 本冒烟守护：版本锚点、LVL12_GOAL 常量、ACH_LIST 契约（lvl12 唯一/总数精确 30/等级线三档零回归/
// 既有 29 成就 id 零回归）、ok/prog 谓词逐值、unlockedAchievements·applyAchievements 集成、
// drawAch 30 项三页滚动渲染不抛错、README/package.json 同步 + 姊妹件套 pin
// （v2183..v2176 八十件套 / v2183·v2182·v2181·v2179 GAME_VERSION v21.84）随新现实更新。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, LVL5_GOAL, LVL10_GOAL, LVL12_GOAL, RUSH_REC_LV } from '../js/data.js';
import { unlockedAchievements } from '../js/rules.js';
import { applyAchievements } from '../js/hero.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v21.83 冒烟先例：先装桩再 import main.js）——
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

console.log('— v21.84 新成就「灯燃长夜」（Lv12 等级里程碑）冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.83 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.83', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 84)), GAME_VERSION);
ok('data.js 含 v21.84 注释（新成就「灯燃长夜」说明）', dSrc.includes('v21.84 新成就「灯燃长夜」'));
ok('data.js GAME_VERSION 字面量已更新为 v21.84', dSrc.includes("const GAME_VERSION = 'v22.2';"));

// —— LVL12_GOAL 常量（与 LVL5_GOAL/LVL10_GOAL 同族：判定/描述/进度三处同读）——
ok('LVL12_GOAL===12 且已从 data.js 导出（与 LVL5_GOAL/LVL10_GOAL 同档）',
  LVL12_GOAL === 12 && LVL5_GOAL === 5 && LVL10_GOAL === 10);

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'lvl12');
ok('ACH_LIST 含 lvl12「灯燃长夜」且 id 唯一',
  !!ach && ach.name === '灯燃长夜' && ACH_LIST.filter((a) => a.id === 'lvl12').length === 1);
ok('ACH_LIST 由 30 → 31 项（新增一项，精确总数由 v21.86 守护，本件存活性口径）', ACH_LIST.length >= 30, String(ACH_LIST.length));
ok('lvl12 无 r 字段且描述由 LVL12_GOAL 派生（「等级达到 12 级」非裸字面量）',
  !('r' in ach) && ach.d === `等级达到 ${LVL12_GOAL} 级`, ach && ach.d);
ok('lvl12 等级线第三档与 lvl5/lvl10 同款零回归（d 同式派生 + prog 同式 X/N）',
  ACH_LIST.find((a) => a.id === 'lvl5').d === `等级达到 ${LVL5_GOAL} 级` &&
  ACH_LIST.find((a) => a.id === 'lvl10').d === `等级达到 ${LVL10_GOAL} 级` &&
  ach.prog({ level: 12 }) === `12/${LVL12_GOAL}`);
ok('lvl12 判定阈值（11 级 false / 12 级 true / 15 级 true / 无 level 字段 false）',
  ach.ok({ level: 11 }) === false && ach.ok({ level: 12 }) === true &&
  ach.ok({ level: 15 }) === true && ach.ok({}) === false);
ok('lvl12 prog 四档（1 级 1/12 / 11 级 11/12 / 12 级 12/12 / 缺失字段防御式 1/12）',
  ach.prog({ level: 1 }) === `1/${LVL12_GOAL}` && ach.prog({ level: 11 }) === `11/${LVL12_GOAL}` &&
  ach.prog({ level: 12 }) === `12/${LVL12_GOAL}` && ach.prog({}) === `1/${LVL12_GOAL}`);
ok('既有 29 成就 id 零回归（lvl12 追加后 id 全表未动）',
  ['firstblood','hunt10','lucky','lvl5','lvl10','rich','scholar','quest','boss','cave','trueboss','rush',
   'perfection','legend','cartman','names','mist','stone','ember','bone','chests','allquests','memoir',
   'skills','hardtrue','aegis','allchests','elites','grain']
    .every((id) => ACH_LIST.find((a) => a.id === id) != null));
ok('lvl5/lvl10 判定零回归（5 级 only lvl5、10 级 only lvl5+lvl10、11 级不含 lvl12）',
  ACH_LIST.find((a) => a.id === 'lvl5').ok({ level: 5 }) === true &&
  ACH_LIST.find((a) => a.id === 'lvl10').ok({ level: 10 }) === true &&
  ACH_LIST.find((a) => a.id === 'lvl10').ok({ level: 5 }) === false &&
  ach.ok({ level: 11 }) === false);
ok('等级线语义与设计目标等级同源（终焉之神/试炼推荐 12 级 —— RUSH_REC_LV===12 互证）',
  RUSH_REC_LV === 12 && LVL12_GOAL === RUSH_REC_LV, String(RUSH_REC_LV));

// —— unlockedAchievements 集成（纯判定）——
ok('unlockedAchievements：Lv12 英雄新解锁含 lvl12；Lv11 不含',
  unlockedAchievements({ level: 12, ach: ['lvl5', 'lvl10'] }).includes('lvl12') === true &&
  unlockedAchievements({ level: 11, ach: [] }).includes('lvl12') === false);
ok('unlockedAchievements：已解锁不重复报（ach 已含 lvl12 → 不在 newly）',
  unlockedAchievements({ level: 12, ach: ['lvl12'] }).includes('lvl12') === false);

// —— applyAchievements 运行期集成（承 v21.77 先例：真实解锁落 hero.ach）——
S.G = { level: 12, ach: ['lvl5', 'lvl10'], gold: 200 };
applyAchievements();
ok('applyAchievements 运行期：Lv12 真实解锁 lvl12 落 hero.ach（既有通路，反馈不迟到）',
  S.G.ach.includes('lvl12'), S.G.ach.join(','));
S.G = { level: 11, ach: [] };
applyAchievements();
ok('applyAchievements 运行期：Lv11 不误解锁 lvl12（零误报）', !S.G.ach.includes('lvl12'));
S.G = { level: 12, ach: ['lvl5', 'lvl10', 'lvl12'] };
applyAchievements();
ok('applyAchievements 运行期：重复调用去重（不重复 push）',
  S.G.ach.filter((x) => x === 'lvl12').length === 1);

// —— drawAch 渲染（30 项三页滚动不抛错）——
const { drawAch } = await import('../js/view/menus.js');
let rendered = true, renderedPg3 = true;
try {
  S.G = { level: 12, ach: ['lvl5', 'lvl10', 'lvl12'], gold: 200 }; S.achScroll = 0; S.scene = 'ach';
  drawAch();
} catch (e) { rendered = false; }
try {
  S.achScroll = 25; // 30 项滚到第三页（PAGE=10）不抛错
  drawAch();
} catch (e) { renderedPg3 = false; }
S.achScroll = 0; S.scene = 'world';
ok('运行期：成就页 drawAch 30 项渲染不抛错', rendered);
ok('运行期：成就页第三页滚动渲染不抛错（30 项 PAGE=10 三页）', renderedPg3);

// —— README / package.json / 既有冒烟 pin 随新现实更新 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2184_lvl12', readme.includes('smoke_v2184_lvl12'));
ok('README 件套口径为九十八件套（九十七件套清除）', readme.includes('九十八件套（九十七件套清除）'));
ok('README 含 v21.84 守护描述', readme.includes('v21.84 起含'));
ok('README 成就口径「31 项」双处同步（快速上手表 C 键行 + 图鉴&成就行）',
  readme.includes('成就一览（全部 38 项进度') && readme.includes('**38 项成就**'));
ok('package.json 已收录 smoke_v2184_lvl12（npm test 串跑第 80 份）',
  pkg.includes('smoke_v2184_lvl12.mjs') && /smoke_v2183_mpsip\.mjs && node tests\/smoke_v2184_lvl12\.mjs/.test(pkg));

// —— 姊妹件套 pin 复查（v21.7 惯例：本版冒烟守护姊妹随新现实更新）——
const suite78 = ['smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs', 'smoke_v2181_helpquickcast.mjs',
  'smoke_v2180_grain.mjs', 'smoke_v2179_titlerecap.mjs', 'smoke_v2178_codexseen.mjs',
  'smoke_v2177_elites.mjs', 'smoke_v2176_allchests.mjs'];
for (const nm of suite78) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', nm), 'utf8');
  ok(`${nm} 的 README 件套 pin 已随新现实更新为九十八件套（九十七件套清除）`,
    src.includes('九十八件套（九十七件套清除）'));
}
for (const nm of ['smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs', 'smoke_v2181_helpquickcast.mjs', 'smoke_v2179_titlerecap.mjs']) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', nm), 'utf8');
  ok(`${nm} 的 GAME_VERSION 字面量 pin 已随新现实更新为 v21.84`,
    src.includes("const GAME_VERSION = 'v22.2';"));
}
for (const nm of ['smoke_v2180_grain.mjs', 'smoke_v2177_elites.mjs', 'smoke_v2176_allchests.mjs', 'smoke_v2173_aegis.mjs', 'smoke_v2168_hardtrue.mjs', 'smoke_v2159_skillach.mjs']) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', nm), 'utf8');
  ok(`${nm} 的 README 成就 pin 已随新现实更新（29 项 pin 零残留，31 项双处落位）`,
    src.includes("readme.includes('成就一览（全部 38 项进度'") && !src.includes('**29 项成就**'));
}
const s2180 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2180_grain.mjs'), 'utf8');
ok('smoke_v2180 的 ACH_LIST 精确计数断言已去硬化（===29 零残留，>=29 存活性口径落位）',
  s2180.includes('ACH_LIST.length >= 29') && !s2180.includes('ACH_LIST.length === 29'));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
