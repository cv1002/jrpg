// v21.60 专项冒烟：讨伐支线击杀进度战报——winBattle 胜利后补报进行中支线「讨伐进度 N/M /
// 目标达成·交付去向」（体验打磨·信息透明·纯显示，零结算改动）。四条讨伐采集型支线
// （side_mist/side_stone/side_ember/side_bone）的进度都读 bestiary 计数（condProg 单一数据源），
// 但击杀目标怪后的胜利战报此前只报金币/经验——玩家想确认「离交付还差几只」只能按 J 翻日志或
// 跑回 NPC 对话；承 v19.93「宝箱蘑菇带任务进度」同一「任务进度即时透明」主线。
// 机制：bestiary 计数结算前快照所有「进行中」condProg 支线的进度串 → 胜利/掉落/碎片结算落账后
// 逐一对比，有变化的补一条战报（未集齐「讨伐进度 N/M」/ 转可交付按 def.turnin 提示去向——
// 与日志 J/NPC 对话同读 condProg/turnin 一份源）。side_name（记忆碎片）按 id 排除
// （v19.90 🕯️ 拾取报文已带 N/N 进度，避免双报）；未接取/已可交付/已完成支线不多报。
// 本冒烟守护：版本锚点、battle.js 源级落位（快照/排除/双模板/import 接入 + bestiary 结算与
// 胜利文案逐字零回归）、四条支线 condProg/turnin 契约、运行期实证六档（进度档/达成档/
// 已可交付不多报/未接取不多报/非目标怪不多报/side_name 排除不双报）、
// README/package.json 同步 + smoke_v2159 件套断言去硬化（v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION, QUESTS, BONE_GOAL, FRAGMENTS } from '../js/data.js';
import { winBattle } from '../js/battle.js';
import { questStatus } from '../js/quests.js';
import { bind } from '../js/bind.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v21.59 冒烟先例：先装桩再 import main.js）——
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

console.log('— v21.60 讨伐支线击杀进度战报（讨伐进度 N/M / 目标达成·交付去向）冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.59 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.59', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 60)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.60 注释（讨伐支线击杀进度战报说明）', dSrc.includes('v21.60 体验打磨：讨伐支线击杀进度战报'));

// —— battle.js 源级落位 ——
const bSrc = fs.readFileSync(path.join(ROOT, 'js/battle.js'), 'utf8');
ok('battle.js 结算前快照块落位（questProgBefore + condProg 谓词 + active 过滤）',
  bSrc.includes('const questProgBefore = {};') && bSrc.includes("questStatus(hero, q.id) === 'active'"));
ok('battle.js side_name（记忆碎片）按 id 排除（v19.90 🕯️ 报文已带进度，避免双报）',
  bSrc.includes("q.id !== 'side_name'"));
ok('battle.js 双战报模板落位（讨伐进度 N/M / 目标达成·def.turnin 去向）',
  bSrc.includes('📜 支线【${q.name}】讨伐进度 ${afterProg}') &&
  bSrc.includes('📜 支线【${q.name}】目标达成（${afterProg}）· ${q.turnin}'));
ok('battle.js QUESTS / questStatus import 接入（单一数据源读取面）',
  bSrc.includes("import { questStatus } from './quests.js';") && /, QUESTS \} from '\.\/data\.js';/.test(bSrc));
ok('battle.js bestiary 计数结算逐字零回归（hero.bestiary[bookName] +1 未动）',
  bSrc.includes('hero.bestiary[bookName] = (hero.bestiary[bookName] || 0) + 1;'));
ok('battle.js 普通胜利文案「🏆 胜利！获得…（剩余 N 金）」逐字零回归（v19.80 口径未动）',
  bSrc.includes('🏆 胜利！获得 ${enemy.gold} 金币、${enemy.xp} 经验 · 距 Lv.${hero.level + 1} 升级还需 ${hero.xpNext - hero.xp} 经验（剩余 ${hero.gold} 金）'));

// —— 数据契约：四条讨伐支线 condProg/turnin/name 齐备（战报读取面单一数据源）——
const HUNTS = ['side_mist', 'side_stone', 'side_ember', 'side_bone'];
ok('四条讨伐支线均具 condProg/turnin/name（战报与日志/NPC 同读一份源）',
  HUNTS.every((id) => { const q = QUESTS[id]; return q && q.condProg && q.turnin && q.name; }));
ok('side_name（记忆碎片）确有 condProg 且为唯一被排除者（双报排除面精确）',
  !!QUESTS.side_name && !!QUESTS.side_name.condProg &&
  Object.values(QUESTS).filter((q) => q.condProg).length === 5);

// —— 运行期实证：winBattle 真实路径 + bind.boxMsg 捕获（承 v21.40 捕获桩法）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 5, hp: 80, hpMax: 80, mp: 30, mpMax: 30,
    atkMax: 30, defMax: 40, gold: 0, xp: 0, xpNext: 9999, item: 1, potion2: 0,
    weapon: '铁剑', armor: '皮甲', diff: null, skills: ['火焰斩'], ach: [],
    poison: 0, seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, totalWins: 0,
    x: 1, y: 1, map: 'cave' }, extra || {});
}
function mkFoe(extra) {
  return Object.assign({ name: '骷髅兵', hp: 0, hpMax: 26, atk: 8, def: 5, xp: 16, gold: 15, color: '#d9d3c0' }, extra || {});
}
function runWin(hero, enemy) {
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  const oldRand = Math.random;
  Math.random = () => 0.99;   // 关闭战斗掉落（rollDrop 38% 档），只验胜利/任务战报
  try {
    S.G = hero; S.scene = 'battle'; S.enemy = enemy; S.battleBusy = true;
    winBattle();
    return msgs;
  } finally {
    bind.boxMsg = origBox;
    Math.random = oldRand;
    S.enemy = null; S.scene = 'world'; S.battleBusy = false;
  }
}

// 进度档：side_bone 进行中，骷髅兵 1→2（未达 BONE_GOAL=3）→ 补报「讨伐进度 2/3 只」
const hA = mkHero({ quests: { side_bone: 'active' }, bestiary: { '骷髅兵': 1 } });
const mA = runWin(hA, mkFoe());
ok('运行期：进度档补报「📜 支线【未归的矿灯】讨伐进度 2/3 只」（condProg 同源派生）',
  mA.includes('📜 支线【未归的矿灯】讨伐进度 2/3 只'), mA.join(' | '));
ok('运行期：进度档普通胜利文案逐字零回归（🏆 获得 15 金币、16 经验 · 剩余 15 金）',
  mA.includes(`🏆 胜利！获得 15 金币、16 经验 · 距 Lv.6 升级还需 ${9999 - 16} 经验（剩余 15 金）`), mA.join(' | '));
ok('运行期：进度档战报顺序 胜利→任务进度（📜 在 🏆 之后，结算落账后再补报）',
  mA.findIndex((m) => m.startsWith('📜')) > mA.findIndex((m) => m.startsWith('🏆')) &&
  mA.findIndex((m) => m.startsWith('🏆')) >= 0, mA.join(' | '));
ok('运行期：进度档结算零回归（bestiary 1→2、金币 15、经验 16、支线仍 active）',
  hA.bestiary['骷髅兵'] === 2 && hA.gold === 15 && hA.xp === 16 && questStatus(hA, 'side_bone') === 'active');

// 达成档：骷髅兵 2→3（达 BONE_GOAL）→ 补报「目标达成（3/3 只）· 亡骨都安顿了！回矿脉找拾骨人」
const hB = mkHero({ quests: { side_bone: 'active' }, bestiary: { '骷髅兵': 2 } });
const mB = runWin(hB, mkFoe());
ok('运行期：达成档补报「📜 支线【未归的矿灯】目标达成（3/3 只）· 亡骨都安顿了！回矿脉找拾骨人」（def.turnin 同源）',
  mB.includes('📜 支线【未归的矿灯】目标达成（3/3 只）· 亡骨都安顿了！回矿脉找拾骨人'), mB.join(' | '));
ok('运行期：达成档支线状态转可交付（questStatus → turnin，与文案口径一致）',
  questStatus(hB, 'side_bone') === 'turnin');

// 已可交付不多报：已达 3 只仍未交付（status 实为 turnin，不在快照内）→ 再杀不多报不刷屏
const hC = mkHero({ quests: { side_bone: 'active' }, bestiary: { '骷髅兵': 3 } });
const mC = runWin(hC, mkFoe());
ok('运行期：已可交付（turnin）再杀目标怪不多报（零 📜 战报，避免刷屏）',
  !mC.some((m) => m.startsWith('📜')), mC.join(' | '));
ok('运行期：已可交付档结算零回归（bestiary 3→4、仍可交付）',
  hC.bestiary['骷髅兵'] === 4 && questStatus(hC, 'side_bone') === 'turnin');

// 未接取不多报：quests 空（side_bone 为 offer）→ 杀目标怪不报进度（未接取不剧透）
const hD = mkHero({ bestiary: { '骷髅兵': 1 } });
const mD = runWin(hD, mkFoe());
ok('运行期：未接取（offer）杀目标怪不多报（零 📜 战报；计数照记 bestiary 1→2 零回归）',
  !mD.some((m) => m.startsWith('📜')) && hD.bestiary['骷髅兵'] === 2, mD.join(' | '));

// 非目标怪不多报：side_bone 进行中但杀的是史莱姆（进度未变）→ 不报
const hE = mkHero({ quests: { side_bone: 'active' } });
const mE = runWin(hE, mkFoe({ name: '史莱姆', color: '#7fd84f' }));
ok('运行期：进行中支线杀非目标怪不多报（进度串未变化 → 零 📜 战报）',
  !mE.some((m) => m.startsWith('📜')), mE.join(' | '));

// side_name 排除不双报：bossDefeated + side_name active + 碎片 3/4 → 杀首段碎片怪
// → 🕯️ 拾取报文带 4/4 进度（v19.90 口径），📜 支线【旧灯卫的名字】不出现
const fragRest = FRAGMENTS.filter((f) => f.id !== FRAGMENTS[0].id).map((f) => f.id);
const hF = mkHero({ bossDefeated: true, quests: { side_name: 'active' }, fragments: [...fragRest] });
const mF = runWin(hF, mkFoe({ name: FRAGMENTS[0].enemy, xp: 60, gold: 0 }));
ok('运行期：side_name 排除——碎片拾取报文仍带 N/N 进度（🕯️ v19.90 口径零回归）',
  mF.some((m) => m.includes('🕯️ 拾起一段记忆') && m.includes(`${FRAGMENTS.length}/${FRAGMENTS.length} 段记忆已集齐`)), mF.join(' | '));
ok('运行期：side_name 排除——📜 支线【旧灯卫的名字】不双报',
  !mF.some((m) => m.includes('📜 支线【旧灯卫的名字】')), mF.join(' | '));

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2160_questprog', readme.includes('smoke_v2160_questprog'));
ok('README 件套口径为五十六件套（五十五件套清除）', readme.includes('五十六件套（五十五件套清除）'));
ok('README 含 v21.60 守护描述（讨伐支线击杀进度战报守护）',
  readme.includes('讨伐支线击杀进度战报守护'));
ok('package.json 已收录 smoke_v2160_questprog（npm test 串跑第 56 份）', pkg.includes('smoke_v2160_questprog.mjs'));
const s2159 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2159_skillach.mjs'), 'utf8');
ok('smoke_v2159 的 README 件套口径断言已去硬化（存活性口径落位，旧精确表达式零残留）',
  s2159.includes("!readme.includes('（五十四件套清除）')") &&
  !s2159.includes("readme.includes('五十五件套（五十四件套清除）')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
