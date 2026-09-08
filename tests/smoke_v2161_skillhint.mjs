// v21.61 专项冒烟：领悟新技能战报补效果摘要「（N MP · hint · 战斗中按 2 选用）」
// （体验打磨·信息透明·纯显示，零结算改动）。技能效果链条的菜单端（drawBattle 技能列表
// 每招带 hint 次行）与状态页端（menus「· 技能名（hint） · N MP」）两端早已量化，唯独
// hero.checkSkills 升级领悟这一刻只报「🌟 领悟了新技能【名】！」——玩家升级瞬间最想确认
// 「这招干什么、耗多少蓝」，只能事后按 2/I 翻菜单。现按状态页同式补效果摘要，mp/hint
// 同读 SKILL_DATA 单一数据源（调技能只改 data.js 一处、三端自动跟随）；SKILL_DATA 漏配时
// 防御式保持原句逐字不变不抛错。承 v21.49-v21.58「战报缺数」/ v21.60「任务进度即时透明」主线。
// 本冒烟守护：版本锚点、hero.js 源级落位（v21.61 注释/SKILL_DATA import/新文案模板/
// 旧裸文案零残留/push 与 includes 拦截逐字零回归）、数据契约（LEARN_AT 6 招全配 SKILL_DATA、
// mp 正整数、hint 非空）、运行期实证六档（冰霜击/治愈术/汲光击逐字报文、已会不多报、
// 无新技等级不报、漏配防御档保持原句）、grantXp 集成档、README/package.json 同步 +
// smoke_v2160 件套断言去硬化（v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION, SKILL_DATA, learnsAt, MAX_LEARN_LV } from '../js/data.js';
import { checkSkills, grantXp } from '../js/hero.js';
import { bind } from '../js/bind.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v21.60 冒烟先例：先装桩再 import main.js）——
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

console.log('— v21.61 领悟新技能战报补效果摘要（N MP · hint · 战斗中按 2 选用）冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.60 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.60', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 61)), GAME_VERSION);
ok('GAME_VERSION 精确为 v21.61（本版守护）', GAME_VERSION === 'v21.61', GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.61 注释（领悟新技能战报补效果摘要说明）', dSrc.includes('v21.61 体验打磨：领悟新技能战报补效果摘要'));

// —— hero.js 源级落位 ——
const hSrc = fs.readFileSync(path.join(ROOT, 'js/hero.js'), 'utf8');
ok('hero.js 含 v21.61 注释（领悟战报补效果摘要说明）', hSrc.includes('v21.61 领悟新技能战报补效果摘要'));
ok('hero.js SKILL_DATA import 接入（单一数据源读取面）',
  /import \{[^}]*\bSKILL_DATA\b[^}]*\} from '\.\/data\.js';/.test(hSrc));
ok('hero.js 新文案模板落位（🌟 + N MP · hint · 战斗中按 2 选用）',
  hSrc.includes('🌟 领悟了新技能【${skill}】！${sd ? `（${sd.mp} MP · ${sd.hint} · 战斗中按 2 选用）` : \'\'}'));
ok('hero.js 旧裸文案零残留（领悟后不带摘要的旧单行已清除）',
  !hSrc.includes('🌟 领悟了新技能【${skill}】！`, SYS_MSG_MS'));
ok('hero.js 领悟结算逐字零回归（skills.push 与 includes 拦截未动）',
  hSrc.includes('hero.skills.push(skill);') && hSrc.includes('if (skill && !hero.skills.includes(skill))'));

// —— 数据契约：LEARN_AT 6 招全配 SKILL_DATA（mp 正整数、hint 非空串）——
// （LEARN_AT 是 data.js 模块内常量不导出，经 learnsAt 纯函数 1..MAX_LEARN_LV 扫描收集——
// 与 hero.checkSkills / skillXpHint / v21.59 成就判定同一份表，单一数据源）
const learnSkills = [];
for (let lv = 1; lv <= MAX_LEARN_LV; lv++) { const s = learnsAt(lv); if (s) learnSkills.push(s); }
ok('LEARN_AT 共 6 招（learnsAt 扫描 1..MAX_LEARN_LV 收集）且全部在 SKILL_DATA 有配（防御式分支理论死代码，契约守护）',
  learnSkills.length === 6 && learnSkills.every((s) => !!SKILL_DATA[s]));
ok('LEARN_AT 每招 mp 为正整数且 hint 为非空串（战报读取面契约）',
  learnSkills.every((s) => Number.isInteger(SKILL_DATA[s].mp) && SKILL_DATA[s].mp > 0 &&
    typeof SKILL_DATA[s].hint === 'string' && SKILL_DATA[s].hint.length > 0));

// —— 运行期实证：checkSkills 真实调用 + bind.boxMsg 捕获（承 v21.40/v21.60 捕获桩法）——
function runLearn(hero) {
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    S.G = hero;
    checkSkills();
    return msgs;
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}

// 冰霜击档：Lv3 领悟 → 报文逐字「（5 MP · 30%冻结（跳过敌回合） · 战斗中按 2 选用）」
const hA = { level: 3, skills: ['火焰斩'] };
const mA = runLearn(hA);
ok('运行期：Lv3 领悟冰霜击报文逐字（SKILL_DATA mp/hint 同源派生）',
  mA.includes('🌟 领悟了新技能【冰霜击】！（5 MP · 30%冻结（跳过敌回合） · 战斗中按 2 选用）'), mA.join(' | '));
ok('运行期：领悟结算零回归（skills 追加冰霜斩外的冰霜击）',
  hA.skills.length === 2 && hA.skills[1] === '冰霜击');

// 治愈术档：Lv4 领悟 → 报文逐字「（5 MP · 恢复HP并解毒 · 战斗中按 2 选用）」
const hB = { level: 4, skills: ['火焰斩', '冰霜击'] };
const mB = runLearn(hB);
ok('运行期：Lv4 领悟治愈术报文逐字（heal 招 hint 同源）',
  mB.includes('🌟 领悟了新技能【治愈术】！（5 MP · 恢复HP并解毒 · 战斗中按 2 选用）'), mB.join(' | '));

// 汲光击档：Lv9 领悟 → 报文逐字「（9 MP · 汲回伤害50%为HP·上限25%HP · 战斗中按 2 选用）」
const hC = { level: 9, skills: ['火焰斩', '冰霜击', '治愈术', '雷鸣', '陨石术'] };
const mC = runLearn(hC);
ok('运行期：Lv9 领悟汲光击报文逐字（drain 招 hint 同源，承 v21.48）',
  mC.includes('🌟 领悟了新技能【汲光击】！（9 MP · 汲回伤害50%为HP·上限25%HP · 战斗中按 2 选用）'), mC.join(' | '));

// 已会不多报：Lv3 但 skills 已含冰霜击 → includes 拦截零报文
const hD = { level: 3, skills: ['火焰斩', '冰霜击'] };
const mD = runLearn(hD);
ok('运行期：已会该招再 checkSkills 不多报（includes 拦截零报文）',
  mD.length === 0 && hD.skills.length === 2, mD.join(' | '));

// 无新技等级不报：Lv2（LEARN_AT 无此级）→ 零报文
const hE = { level: 2, skills: ['火焰斩'] };
const mE = runLearn(hE);
ok('运行期：无新技等级（Lv2）checkSkills 不报（learnsAt 返回 null）', mE.length === 0, mE.join(' | '));

// 起始技能零报文：Lv1 新档（newGame 播种火焰斩）→ checkSkills 被 includes 拦截不多报
const hF = { level: 1, skills: ['火焰斩'] };
const mF = runLearn(hF);
ok('运行期：起始技能火焰斩不误报领悟（newGame 播种路径零报文）', mF.length === 0, mF.join(' | '));

// 防御式档：SKILL_DATA 漏配时不抛错且保持原句逐字（🌟…！无摘要尾缀）
const hG = { level: 3, skills: ['火焰斩'] };
const sdSave = SKILL_DATA['冰霜击'];
delete SKILL_DATA['冰霜击'];
let mG = null, gThrew = null;
try { mG = runLearn(hG); } catch (e) { gThrew = e; } finally { SKILL_DATA['冰霜击'] = sdSave; }
ok('运行期：SKILL_DATA 漏配防御档——不抛错且保持原句「🌟 领悟了新技能【冰霜击】！」逐字（无摘要尾缀）',
  !gThrew && mG && mG.length === 1 && mG[0] === '🌟 领悟了新技能【冰霜击】！', (gThrew && gThrew.message) || (mG || []).join(' | '));

// grantXp 集成档：Lv2（xp 0/20）吃 20 经验 → 升 Lv3 → checkSkills 领悟冰霜击报文带摘要
const hH = { name: '测试者', level: 2, xp: 0, xpNext: 20, hp: 60, hpMax: 60, mp: 20, mpMax: 20,
  atkMax: 24, defMax: 12, weapon: '铁剑', armor: '皮甲', skills: ['火焰斩'] };
const msgsH = [];
const origBoxH = bind.boxMsg;
bind.boxMsg = (t) => { msgsH.push(String(t)); };
try {
  S.G = hH;
  const gH = grantXp(hH, 20);
  ok('运行期：grantXp 集成档升级领悟链路（leveled + level 2→3 + 冰霜击入列）',
    gH.leveled === true && hH.level === 3 && hH.skills.includes('冰霜击'));
} finally {
  bind.boxMsg = origBoxH;
  S.G = null;
}
ok('运行期：grantXp 集成档领悟报文带效果摘要（与直调 checkSkills 同式逐字）',
  msgsH.includes('🌟 领悟了新技能【冰霜击】！（5 MP · 30%冻结（跳过敌回合） · 战斗中按 2 选用）'), msgsH.join(' | '));

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2161_skillhint', readme.includes('smoke_v2161_skillhint'));
ok('README 件套口径为五十七件套（五十六件套清除）', readme.includes('五十七件套（五十六件套清除）'));
ok('README 含 v21.61 守护描述（领悟新技能战报效果摘要守护）',
  readme.includes('领悟新技能战报效果摘要守护'));
ok('package.json 已收录 smoke_v2161_skillhint（npm test 串跑第 57 份）', pkg.includes('smoke_v2161_skillhint.mjs'));
const s2160 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2160_questprog.mjs'), 'utf8');
ok('smoke_v2160 的 README 件套口径断言已去硬化（存活性口径落位，旧精确表达式零残留）',
  s2160.includes("!readme.includes('（五十五件套清除）')") &&
  !s2160.includes("readme.includes('五十六件套（五十五件套清除）')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
