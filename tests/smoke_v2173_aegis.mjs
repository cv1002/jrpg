// v21.73 专项冒烟：新成就「龙鳞加身」（最强铠甲里程碑，ACH_LIST 25→26）——
// 纯内容扩充（新成就，零结算改动、零新状态、零新逻辑：判定走既有 unlockedAchievements→
// applyAchievements 通路，读既有 hero.armor 存档字段）。里程碑版图中武器端「黎明归剑」
// （legend：装备圣光之剑）早有里程碑，防具端四件铠甲（布衣/皮甲/锁子甲/龙鳞甲）却没有任何
// 对应纪念——承 v20.4「灯火记忆」/v21.59「诸技通明」/v21.68「逆风行灯」单成就先例补齐。
// 目标铠甲读 BEST_ARMOR 单一数据源（ARMORS 最大防御派生：增删铠甲/调防自动跟随，绝无
// 第二套口径；ARMORS 声明在 ACH_LIST 之前，无 v21.68 的 TDZ 困扰，无需字面量钉死）。
// 判定 g.armor===BEST_ARMOR：newGame 建档「布衣」、buyArmor/rollDrop 换装写定、applyStats
// 同源；旧档无 armor 字段（undefined）→ false 不误解锁，零迁移；无 r 无 prog 纯里程碑。
// 解锁时机：shop.buyArmor 结算当场 applyAchievements（本版补齐——buyWeapon 早已当场判定、
// buyArmor 此前漏接；最强铠甲唯一来源就是商店，rollDrop 装备档只到锁子甲，承 world.js
// 开箱当场判定「反馈不迟到」惯例）。
// 本冒烟守护：版本锚点、BEST_ARMOR 派生契约（===ARMORS 最大防御者、源级 reduce 零裸字面量）、
// ACH_LIST 契约（aegis 唯一/总数精确 26/无 r 无 prog/d 由 BEST_ARMOR+ARMORS 派生）、ok 谓词
// 逐值六档（旧档兼容防御式读取）、既有 25 成就零回归、运行期全链路（newGame 布衣不误解锁 →
// buyArmor 龙鳞甲当场真实解锁落 hero.ach 且报文双段齐备 → 重复调用去重 → 非最强铠/金币不足
// 两档不误解锁零结算）、成就页 drawAch 两态渲染不抛错、README/package.json 同步 +
// smoke_v2172 件套断言去硬化（v21.7 惯例）+ smoke_v2168/smoke_v2159 口径随新现实更新。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, ARMORS, BEST_ARMOR } from '../js/data.js';
import { unlockedAchievements } from '../js/rules.js';
import { buyArmor } from '../js/shop.js';
import { bind } from '../js/bind.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v21.72 冒烟先例：先装桩再 import main.js）——
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

console.log('— v21.73 新成就「龙鳞加身」（最强铠甲里程碑）冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const sShop = fs.readFileSync(path.join(ROOT, 'js/shop.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.72 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.72', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 73)), GAME_VERSION);
ok('data.js 含 v21.73 注释（龙鳞加身/最强铠甲里程碑说明）', dSrc.includes('v21.73') && dSrc.includes('龙鳞加身'));

// —— 数据源契约：BEST_ARMOR（ARMORS 最大防御派生，单一数据源）——
ok('BEST_ARMOR 派生正确（=== ARMORS 防御值最大者，当前为龙鳞甲）',
  BEST_ARMOR === '龙鳞甲' && ARMORS[BEST_ARMOR].def === Math.max(...Object.values(ARMORS).map((a) => a.def)),
  BEST_ARMOR);
ok('BEST_ARMOR 源级派生零裸字面量（reduce 派生落位，无字符串字面量直赋）',
  dSrc.includes('const BEST_ARMOR = Object.keys(ARMORS).reduce') && !dSrc.includes("const BEST_ARMOR = '"));
ok('ARMORS 契约（四件铠甲，龙鳞甲 防13 价480——最佳即最贵，成就目标的经济份量锚点）',
  Object.keys(ARMORS).length === 4 && ARMORS['龙鳞甲'].def === 13 && ARMORS['龙鳞甲'].price === 480);

// —— ACH_LIST：龙鳞加身契约（承 legend 装备里程碑 + lvl5/lvl10/memoir 纯里程碑模式）——
const achAegis = ACH_LIST.find((a) => a.id === 'aegis');
ok('ACH_LIST 含 aegis「龙鳞加身」且 id 唯一',
  !!achAegis && achAegis.name === '龙鳞加身' && ACH_LIST.filter((a) => a.id === 'aegis').length === 1);
ok('ACH_LIST 由 25 → 26 项（v21.73 新增一项；v21.76 起精确总数由新版冒烟守护，本件存活性口径 >= 26）', ACH_LIST.length >= 26, String(ACH_LIST.length));
ok('aegis 成就无 r 字段（与 lvl5/lvl10/memoir/skills/hardtrue 同款纯里程碑——商店有售非掉落奖励）',
  !!achAegis && !('r' in achAegis));
ok('aegis 成就无 prog 字段（与 legend/boss/cave/trueboss 同款纯布尔里程碑，单布尔无计数可报）',
  !!achAegis && !('prog' in achAegis));
ok('aegis 描述由 BEST_ARMOR+ARMORS 派生（「装备最强铠甲「龙鳞甲」（防+13）」——调 ARMORS 自动跟随）',
  !!achAegis && achAegis.d === `装备最强铠甲「${BEST_ARMOR}」（防+${ARMORS[BEST_ARMOR].def}）`, achAegis && achAegis.d);
ok('aegis 成就源级落位（data.js 含 id/name 行与 v21.73 注释）',
  dSrc.includes("id:'aegis', name:'龙鳞加身'") && dSrc.includes('龙鳞加身（v21.73 新成就'));

// —— ok 谓词逐值（防御式读取，旧档零迁移）——
ok('ok 谓词：空对象旧档（无 armor 字段）→ false 且不抛错', achAegis.ok({}) === false);
ok('ok 谓词：建档初始铠甲（armor=布衣）→ false', achAegis.ok({ armor: '布衣' }) === false);
ok('ok 谓词：中级铠甲（armor=皮甲）→ false', achAegis.ok({ armor: '皮甲' }) === false);
ok('ok 谓词：次强铠甲（armor=锁子甲，rollDrop 装备档天花板）→ false', achAegis.ok({ armor: '锁子甲' }) === false);
ok('ok 谓词：最强铠甲（armor=龙鳞甲）→ true', achAegis.ok({ armor: '龙鳞甲' }) === true);
ok('ok 谓词：最强铠甲+其余字段齐备（通关档终态）→ true', achAegis.ok({ armor: '龙鳞甲', trueBoss: true, diff: 1 }) === true);

// —— 既有 25 个成就零回归（id 全数保留，新成就不影响旧判定）——
ok('既有 25 个成就 id 全部保留（零回归）',
  ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'rich', 'scholar', 'quest', 'boss', 'cave',
   'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone', 'ember', 'bone',
   'chests', 'allquests', 'memoir', 'skills', 'hardtrue'].every((id) => ACH_LIST.some((a) => a.id === id)));
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('灯火同心（allquests）支线分母 v21.80 随新现实更新为 0/8（side_grain 是支线，aegis 不是）',
  achAll && achAll.prog({ quests: {} }) === '0/8', achAll && achAll.prog({ quests: {} }));

// —— unlockedAchievements 集成（真实判定通路，rules.js）——
ok('unlockedAchievements：龙鳞甲档新解锁含 aegis；锁子甲档不含',
  unlockedAchievements({ armor: '龙鳞甲' }).includes('aegis') &&
  !unlockedAchievements({ armor: '锁子甲' }).includes('aegis'));
ok('unlockedAchievements：已解锁过的 hero 不重复报 aegis',
  !unlockedAchievements({ armor: '龙鳞甲', ach: ['aegis'] }).includes('aegis'));

// —— shop.js 源级：buyArmor 当场判定成就（反馈不迟到，与 buyWeapon 同式）——
const buyArmorBody = (sShop.match(/export function buyArmor\(name\) \{[\s\S]*?\n\}/) || [''])[0];
ok('buyArmor 函数体内含 applyAchievements() 当场判定（本版接线落位）',
  buyArmorBody.includes('applyAchievements();'), buyArmorBody.slice(0, 80));
ok('buyWeapon 当场判定零回归（既有 applyAchievements(); 调用仍在）',
  (sShop.match(/export function buyWeapon\(name\) \{[\s\S]*?\n\}/) || [''])[0].includes('applyAchievements();'));

// —— 运行期全链路：newGame → applyAchievements 真实解锁落 hero.ach ——
loadMap('village');
S.G = newGame('测试');
S.scene = 'world';
ok('新档建档铠甲为布衣且未解锁 aegis',
  S.G.armor === '布衣' && !(S.G.ach || []).includes('aegis'));
applyAchievements();
ok('applyAchievements：新档布衣不误解锁 aegis（ach 仍不含）',
  !(S.G.ach || []).includes('aegis'), (S.G.ach || []).join(','));
S.G.armor = '龙鳞甲'; // 模拟买下最强铠甲后的存档终态
applyAchievements();
ok('applyAchievements：装备最强铠甲真实解锁 aegis 落 hero.ach',
  (S.G.ach || []).includes('aegis'), (S.G.ach || []).join(','));
const achCount = (S.G.ach || []).length;
applyAchievements();
ok('applyAchievements：重复调用不重复解锁（ach 计数不变）',
  (S.G.ach || []).length === achCount && (S.G.ach || []).filter((x) => x === 'aegis').length === 1);

// —— 运行期实证：buyArmor 当场解锁（承 v21.63 捕获桩法：bind.boxMsg 捕获 + S.G 挂载）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 10, hp: 60, hpMax: 60, mp: 20, mpMax: 20,
    atkMax: 12, defMax: 6, gold: 0, xp: 0, xpNext: 20, item: 0, potion2: 0,
    weapon: '木剑', armor: '布衣', diff: 0, skills: ['火焰斩'], ach: [],
    poison: 0, seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, x: 1, y: 1, map: 'village',
    charge: false }, extra || {});
}
function runShop(hero, fn, ...args) {
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    S.G = hero;
    fn(...args);
    return msgs;
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}
{
  const h = mkHero({ gold: 480 });
  const m = runShop(h, buyArmor, '龙鳞甲');
  ok('运行期：buyArmor 龙鳞甲当场解锁 aegis（反馈不迟到，不等下一场胜利）',
    (h.ach || []).includes('aegis'), (h.ach || []).join(','));
  ok('运行期：buyArmor 结算零回归（480→0 扣款 + armor 换装 + 装备报文首段逐字）',
    h.gold === 0 && h.armor === '龙鳞甲' && m.some((t) => t.startsWith('装备了 龙鳞甲（-480 金')), m.join(' | '));
  ok('运行期：成就解锁横幅同报（🔓 成就解锁：【龙鳞加身】+ 派生描述）',
    m.some((t) => t.includes('🔓 成就解锁：【龙鳞加身】') && t.includes('装备最强铠甲「龙鳞甲」（防+13）')), m.join(' | '));
}
{
  const h = mkHero({ gold: 180 });
  const m = runShop(h, buyArmor, '锁子甲');
  ok('运行期：buyArmor 锁子甲（次强铠）不解锁 aegis 且结算零回归',
    !(h.ach || []).includes('aegis') && h.gold === 0 && h.armor === '锁子甲', m.join(' | '));
}
{
  const h = mkHero({ gold: 100 });
  const m = runShop(h, buyArmor, '龙鳞甲');
  ok('运行期：buyArmor 金币不足不解锁不扣款不换装（差额拦截零回归）',
    !(h.ach || []).includes('aegis') && h.gold === 100 && h.armor === '布衣' &&
    m.some((t) => t.includes('金币不足') && t.includes('还差 380 金')), m.join(' | '));
}

// —— 成就页渲染（drawAch 两态不抛错：未解锁灰 ✘ / 已解锁亮 ✔，26 项分母三页滚动）——
loadMap('village');
S.G = newGame('测试');
S.scene = 'world';
let renderErr = null;
try {
  S.G.ach = [];
  drawAch();
  S.G.ach = ['aegis'];
  drawAch();
  S.achScroll = 20; // 26 项翻到第三页（PAGE=10，aegis 在末位）不抛错
  drawAch();
  S.achScroll = 0;
} catch (e) { renderErr = e; }
ok('成就页 drawAch 两态 + 第三页滚动渲染不抛错（未解锁/已解锁，含 26 项分母）', !renderErr, renderErr && renderErr.message);

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2173_aegis', readme.includes('smoke_v2173_aegis'));
// v21.74 去硬化（v21.7 惯例）：件套精确计数移交当版冒烟守护，本件改存活性口径——
// 仍含「冒烟/件套」且旧口径「（六十八件套清除）」已清除。
ok('README 件套口径为存活性断言（v21.74 起件数由新版冒烟守护：七十件套（六十九件套清除））',
  readme.includes('冒烟') && readme.includes('件套') &&
  !readme.includes('（六十八件套清除）'));
ok('README 含 v21.73 守护描述（新成就「龙鳞加身」（最强铠甲里程碑）守护）',
  readme.includes('新成就「龙鳞加身」（最强铠甲里程碑）守护'));
// v21.76 随新现实更新：README 成就口径由「26 项」双处递增为「27 项」双处（allchests 成就入列），
// 本件断言同步递增（承 v21.73 对 smoke_v2168/smoke_v2159 README pin 同款处理先例）。
// v21.77 随新现实更新：README 成就口径由「27 项」双处递增为「28 项」双处（elites 成就入列），
// 本件断言同步递增（承 v21.76 同款处理先例）。
ok('README 成就口径「29 项」双处同步（快速上手表 C 键行 + 图鉴&成就行）',
  readme.includes('成就一览（全部 29 项进度') && readme.includes('**29 项成就**'));
ok('package.json 已收录 smoke_v2173_aegis（npm test 串跑第 69 份）', pkg.includes('smoke_v2173_aegis.mjs'));
const s2172 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2172_helpfrag.mjs'), 'utf8');
ok('smoke_v2172 的 README 件套口径断言已去硬化（存活性口径落位，旧精确表达式零残留）',
  s2172.includes("!readme.includes('（六十七件套清除）')") &&
  !s2172.includes("readme.includes('六十八件套（六十七件套清除）')"));
const s2168 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2168_hardtrue.mjs'), 'utf8');
ok('smoke_v2168 的 ACH_LIST 精确计数断言已随新现实更新（===25 零残留，>=25 存活性口径落位）',
  s2168.includes('ACH_LIST.length >= 25') && !s2168.includes('ACH_LIST.length === 25'));
ok('smoke_v2168 的 README 成就口径断言已随新现实更新（「28 项」pin 零残留，「29 项」双处落位）',
  s2168.includes("readme.includes('成就一览（全部 29 项进度')") && !s2168.includes('全部 28 项进度'));
const s2159 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2159_skillach.mjs'), 'utf8');
ok('smoke_v2159 的 README 成就口径断言已随新现实更新（「28 项」pin 零残留，「29 项」双处落位）',
  s2159.includes("readme.includes('成就一览（全部 29 项进度')") && !s2159.includes('全部 28 项进度'));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
