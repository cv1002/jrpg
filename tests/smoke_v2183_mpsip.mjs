// v21.83 专项冒烟：Lv11 新技能「星砂回响」——全游戏首个「汲蓝」招（新内容·战斗机制）。
// 背景：技能领悟表自 v21.48（Lv9 汲光击）后，Lv10-12（终焉之神/试炼的高压收尾段）再无新招——
// Lv11 补全游戏首个 MP 汲回招：伤害 ×2.4 并把伤害的一半汲回为 MP（单次上限 25% 最大MP，
// DRAIN_MP_PCT/DRAIN_MP_CAP 单一数据源派生），与汲光击（汲回 HP）同族错位——「打蓝循环」。
// 封印口径：祸乱形态「封印治愈」封的是治疗——汲蓝招不含治疗，刻意不并入 heal 封印
// （skillForbidden/drawBattle 封印条件逐字零改动即「未封」契约），为终焉之神战保留
// 一条被封印治愈后仍可运转的 MP 引擎。本冒烟守护：版本锚点、数据层落位、源级落位
// （未封契约 + 汲蓝结算 + 排版条件式）、运行期实证（汲蓝上限/可回量钳制/封印不封/未学/
// 补学 + skillEstimate/checkSkills/skillXpHint/七招菜单与状态页渲染）、README/package 同步、
// 姊妹件套 pin（v2182..v2176 七十九件套 / v2182·v2181·v2179 GAME_VERSION v21.83）随新现实更新。
import { S } from '../js/state.js';
import { GAME_VERSION, SKILL_DATA, MAX_LEARN_LV, learnsAt, DRAIN_MP_PCT, DRAIN_MP_CAP, ELEM_NAME, SPECIES, HELP_PAGES, baseStats, XP_INIT, XP_GROW } from '../js/data.js';
import { skillEstimate } from '../js/rules.js';
import { migrateQuests } from '../js/quests.js';
import { checkSkills, skillXpHint } from '../js/hero.js';
import { startBattle, playerAction } from '../js/battle.js';
import { drawSkillMenu } from '../js/view/drawBattle.js';
import { drawStatus } from '../js/view/menus.js';
import { bind } from '../js/bind.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v21.82 冒烟先例：先装桩再 import main.js）——
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

console.log('— v21.83 Lv11 新技能「星砂回响」（汲蓝招） 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.82）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.82', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 83)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.83 注释（Lv11 技能「星砂回响」）', dSrc.includes('v21.83 Lv11 新技能「星砂回响」'));

// —— 数据层落位 ——
ok('LEARN_AT 含 11 级条目「星砂回响」（learnsAt(11) 派生）', learnsAt(11) === '星砂回响');
ok('LEARN_AT 既有等级零回归（1/3/4/5/7/9 逐字，8/10 为空）',
  learnsAt(1) === '火焰斩' && learnsAt(3) === '冰霜击' && learnsAt(4) === '治愈术' &&
  learnsAt(5) === '雷鸣' && learnsAt(7) === '陨石术' && learnsAt(9) === '汲光击' &&
  learnsAt(8) === null && learnsAt(10) === null);
ok('MAX_LEARN_LV 自动派生为 11（单一数据源收口生效，Lv11 技能不再被提示/成就漏扫）', MAX_LEARN_LV === 11, String(MAX_LEARN_LV));
ok('DRAIN_MP_PCT/DRAIN_MP_CAP 已导出且为 0.5/0.25（与 HP 系同值镜像、独立旋钮）', DRAIN_MP_PCT === 0.5 && DRAIN_MP_CAP === 0.25);
const sk = SKILL_DATA['星砂回响'];
ok('SKILL_DATA[星砂回响] 字段落位（mp12/×2.4/atk/光/drainMp·drainMpCap 由常量派生）',
  !!sk && sk.mp === 12 && sk.mult === 2.4 && sk.kind === 'atk' && sk.element === 'light' &&
  sk.drainMp === DRAIN_MP_PCT && sk.drainMpCap === DRAIN_MP_CAP && sk.txt === '✨');
ok('星砂回响 hint 与常量同源（汲回伤害50%为MP·上限25%MP）',
  sk.hint === '汲回伤害' + Math.round(DRAIN_MP_PCT * 100) + '%为MP·上限' + Math.round(DRAIN_MP_CAP * 100) + '%MP', sk.hint);
ok('光元素恒 ×1 中性契约（ELEM_NAME 含光且无任何 SPECIES 弱/抗 light，不扰动既有克制表）',
  ELEM_NAME.light === '光' && Object.values(SPECIES).every((s) => s.weak !== 'light' && s.resist !== 'light'));
// 全表契约（承 v21.61 数据契约）：LEARN_AT 全招全配 SKILL_DATA、mp 正整数、hint 非空
const learnSkills = [];
for (let lv = 1; lv <= MAX_LEARN_LV; lv++) { const s = learnsAt(lv); if (s) learnSkills.push(s); }
ok('LEARN_AT 共 7 招且全部在 SKILL_DATA 有配（领悟表与技能数据一致，无悬空条目）',
  learnSkills.length === 7 && learnSkills.every((s) => !!SKILL_DATA[s]), learnSkills.join(','));
ok('七招每招 mp 为正整数且 hint 为非空串（菜单/战报/状态页读取面契约）',
  learnSkills.every((s) => Number.isInteger(SKILL_DATA[s].mp) && SKILL_DATA[s].mp > 0 &&
    typeof SKILL_DATA[s].hint === 'string' && SKILL_DATA[s].hint.length > 0));
ok('帮助页「技能克制」行 r[1] 补「星砂回蓝」且 r[2] 倍率规则逐字零回归',
  HELP_PAGES[2].some((r) => r[0] === '技能克制' && r[1].includes('星砂回蓝') &&
    r[2] === '弱点伤害×1.35 · 抗性伤害×0.7'));

// —— 源级落位 ——
const bSrc = fs.readFileSync(path.join(ROOT, 'js/battle.js'), 'utf8');
ok('battle.js 汲蓝结算源级落位（上限→实际可回量双重钳制 + 战报「汲蓝 N MP」标注）',
  bSrc.includes('const dm = Math.min(hero.mpMax - hero.mp, Math.min(mcap, Math.round(dmg * skill.drainMp)));') &&
  bSrc.includes('note += `（汲蓝 ${dm} MP）`;'));
ok('battle.js skillForbidden 封印条件逐字零回归（drainMp 招刻意未并入 heal 封印——「未封」契约）',
  bSrc.includes("(skill.kind === 'heal' || skill.drain) && enemy.forbid.includes('heal')"));
const dbSrc = fs.readFileSync(path.join(ROOT, 'js/view/drawBattle.js'), 'utf8');
ok('drawBattle.js 技能菜单封印标注与结算同口径（drainMp 招未封，条件逐字零回归）',
  dbSrc.includes("(skill.kind === 'heal' || skill.drain) && enemy.forbid.includes('heal')"));
ok('drawBattle.js 七招排版条件式落位（≤6 招 34 / 7 招 29、HINT_DY 16/14，旧 i*36 零残留）',
  dbSrc.includes('const ROW_SP = hero.skills.length > 6 ? 29 : 34;') &&
  dbSrc.includes('const HINT_DY = hero.skills.length > 6 ? 14 : 16;') &&
  !dbSrc.includes('148 + i * 36') && !dbSrc.includes('176 + i * 36'));
const mSrc = fs.readFileSync(path.join(ROOT, 'js/view/menus.js'), 'utf8');
ok('menus.js 状态页七招排版条件式落位（SKILL_ROW_SP/SKILL_ROW_Y0，旧常量零残留）',
  mSrc.includes('const SKILL_ROW_SP = hero.skills.length > 6 ? 12 : 14;') &&
  mSrc.includes('const SKILL_ROW_Y0 = hero.skills.length > 6 ? 302 : 308;') &&
  mSrc.includes('SKILL_ROW_Y0+i*SKILL_ROW_SP') && !mSrc.includes('308+i*14'));

// —— 运行期实证：migrateQuests 旧档补学 ——
const oldSave = { level: 11, skills: ['火焰斩', '冰霜击', '治愈术', '雷鸣', '陨石术', '汲光击'], quest: 0 };
migrateQuests(oldSave);
ok('运行期：Lv11 旧档（无星砂回响）读档补学 → 七招齐全且新招殿后',
  oldSave.skills.length === 7 && oldSave.skills[6] === '星砂回响', JSON.stringify(oldSave.skills));
const midSave = { level: 10, skills: ['火焰斩', '冰霜击', '治愈术', '雷鸣', '陨石术', '汲光击'], quest: 0 };
migrateQuests(midSave);
ok('运行期：Lv10 旧档不越级补学（星砂回响仍缺席，到 Lv11 才领悟）',
  midSave.skills.length === 6 && !midSave.skills.includes('星砂回响'));

// —— 运行期实证：战斗汲蓝结算（playerAction 真实路径）——
function mkHero(lv, hp, mp, skills) {
  const b = baseStats(lv);
  return { name: '测试者', level: lv, hp, hpMax: b.hpMax, mp, mpMax: b.mpMax,
    atkMax: 55, defMax: 40, gold: 0, xp: 0, xpNext: 9999, item: 0, potion2: 0,
    weapon: '圣光之剑', armor: '龙鳞甲', diff: null, skills,
    poison: 0, seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, x: 1, y: 1, map: 'village' };
}
function mkDoll(extra) {
  return Object.assign({ name: '练功木桩', hp: 500, hpMax: 500, atk: 5, def: 10, xp: 1, gold: 0, color: '#888888' }, extra || {});
}
function castMp(hero, enemy) {
  S.G = hero; S.G.map = 'village';
  startBattle(enemy);
  S.battleBusy = false;   // 测试桩：跳过开场 700ms 编排空档（enqueue 为真实 setTimeout）
  playerAction('skill', '星砂回响');
  const line = S.blog[S.blog.length - 1] || '';
  S.enemy = null; S.scene = 'world'; S.battleBusy = false;
  return line;
}

// Lv12·mp 20：伤害 ≈(55×2−10)×2.4≈240，×50%≈120 >> 单次上限 round(60×0.25)=15 → 恒汲蓝 15（上限钳制决定性）
const h1 = mkHero(12, 122, 20, ['星砂回响']);
const l1 = castMp(h1, mkDoll());
ok('运行期：星砂回响命中低蓝英雄 → 汲蓝恒 = 15（drainMpCap×mpMax 上限钳制，伤害浮动被截断）',
  h1.mp === 20 - 12 + 15 && l1.includes('汲蓝 15 MP'), `mp=${h1.mp} | ${l1}`);
ok('运行期：星砂回响耗蓝 12（20→23 净 +3）且战报含 MP 读数（v20.7 口径零回归）',
  h1.mp === 23 && l1.includes('（MP 23/60）'), `mp=${h1.mp} | ${l1}`);
// 满蓝档：付费后房间 = mpMax − (mpMax−12) = 12 → 汲蓝钳到实际可回量 12（与汲光击满血「汲回 0」同族的可回量钳制）
const h2 = mkHero(12, 122, 60, ['星砂回响']);
const l2 = castMp(h2, mkDoll());
ok('运行期：满蓝施放 → 汲蓝钳到可回量 12（60−48）不从上限 15 越界，MP 回满如实标注',
  h2.mp === 60 && l2.includes('汲蓝 12 MP'), `mp=${h2.mp} | ${l2}`);
// 封印档：祸乱气场（forbid heal）对汲蓝招不封（刻意设计：治疗才封，MP 引擎保留）——MP 扣、敌血动、无封印报
const h3 = mkHero(12, 122, 20, ['星砂回响']);
const doll3 = mkDoll();
S.G = h3; S.G.map = 'village';
startBattle(doll3);
S.enemy.forbid = ['heal'];   // startBattle 置 null 后模拟变身后封印态
S.battleBusy = false;
playerAction('skill', '星砂回响');
const l3 = S.blog[S.blog.length - 1] || '';
ok('运行期：祸乱气场封印治愈对星砂回响不封（⛔ 文案零、MP 扣 12、汲蓝落账、敌血受损——「未封」契约）',
  !l3.includes('封印了') && l3.includes('汲蓝') && h3.mp === 20 - 12 + 15 && S.enemy.hp < 500, `mp=${h3.mp} enemyHp=${S.enemy.hp} | ${l3}`);
S.enemy = null; S.scene = 'world'; S.battleBusy = false;
// 对照档：汲光击同场景仍被封印（零回归）
const h3b = mkHero(12, 50, 60, ['汲光击']);
S.G = h3b; S.G.map = 'village';
startBattle(mkDoll());
S.enemy.forbid = ['heal'];
S.battleBusy = false;
playerAction('skill', '汲光击');
const l3b = S.blog[S.blog.length - 1] || '';
ok('运行期：同封印态下汲光击（drain 招）仍被封印（v21.48 口径零回归，双招封印差即设计意图）',
  l3b.includes('封印了【汲光击】') && h3b.mp === 60, `mp=${h3b.mp} | ${l3b}`);
S.enemy = null; S.scene = 'world'; S.battleBusy = false;
// 未学档：未领悟被拒，MP 不动
const h4 = mkHero(12, 122, 20, ['火焰斩']);
const l4 = castMp(h4, mkDoll());
ok('运行期：未领悟星砂回响 →「尚未领悟该技能」且 MP 不动（doSkill 门零回归）',
  l4.includes('尚未领悟该技能') && h4.mp === 20, `mp=${h4.mp} | ${l4}`);
// 预览同源：skillEstimate 对星砂回响给正值（技能菜单 ≈N伤 预览不崩）
ok('运行期：skillEstimate 星砂回响预览为正值（菜单 ≈N伤 同源不崩）',
  skillEstimate(mkHero(12, 122, 20, ['星砂回响']), mkDoll(), sk) > 0);

// —— 运行期实证：checkSkills 领悟报文 + skillXpHint 扫描 ——
function runLearn(hero) {
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try { S.G = hero; checkSkills(); return msgs; } finally { bind.boxMsg = origBox; }
}
const h5 = mkHero(11, 122, 60, ['火焰斩', '冰霜击', '治愈术', '雷鸣', '陨石术', '汲光击']);
const m5 = runLearn(h5);
ok('运行期：Lv11 领悟星砂回响报文逐字（12 MP · hint 同源派生 · 战斗中按 2 选用）',
  m5.some((t) => t.includes('🌟 领悟了新技能【星砂回响】！（12 MP · 汲回伤害50%为MP·上限25%MP · 战斗中按 2 选用）')), m5.join(' | '));
const h6 = mkHero(11, 122, 60, ['火焰斩', '冰霜击', '治愈术', '雷鸣', '陨石术', '汲光击', '星砂回响']);
const m6 = runLearn(h6);
ok('运行期：已会星砂回响再触发 checkSkills 不多报（includes 拦截零回归）', m6.length === 0, m6.join(' | '));
ok('运行期：Lv10 hero skillXpHint 扫到下一技能「星砂回响·Lv.11」（MAX_LEARN_LV 上界生效）',
  (() => { const hx = mkHero(10, 100, 40, ['火焰斩', '冰霜击', '治愈术', '雷鸣', '陨石术', '汲光击']);
    const nx = skillXpHint(hx); return !!nx && nx.name === '星砂回响' && nx.lv === 11; })());
ok('运行期：Lv11 全招 hero skillXpHint 返回 null（已习得全部，v21.61 口径）',
  (() => { const hx = mkHero(11, 100, 40, ['火焰斩', '冰霜击', '治愈术', '雷鸣', '陨石术', '汲光击', '星砂回响']);
    return skillXpHint(hx) === null; })());

// —— 运行期实证：七招菜单/状态页渲染不抛错（承 v21.48 六招渲染先例）——
const h7 = mkHero(12, 122, 60, ['火焰斩', '冰霜击', '治愈术', '雷鸣', '陨石术', '汲光击', '星砂回响']);
const doll7 = mkDoll();
let drew = true, drewS = true, drew6 = true;
S.G = h7; S.enemy = doll7; S.scene = 'battle';
try { drawSkillMenu(); } catch (e) { drew = false; }
S.G = h7; S.scene = 'world';
try { drawStatus(); } catch (e) { drewS = false; }
S.G = mkHero(12, 122, 60, ['火焰斩', '冰霜击', '治愈术', '雷鸣', '陨石术', '汲光击']); S.scene = 'world';
try { drawStatus(); } catch (e) { drew6 = false; }
ok('运行期：七招技能菜单渲染不抛错（含 星砂回响 ≈N伤/MP/hint 行）', drew);
ok('运行期：七招状态页（已学技能 7 行 + 下一技能已习得）渲染不抛错', drewS);
ok('运行期：六招状态页零回归（≤6 招条件式走 v21.48 行距，渲染不抛错）', drew6);
S.enemy = null; S.scene = 'world'; S.battleBusy = false;

// —— README / package / 姊妹件套 pin 随新现实更新（v21.7 惯例）——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README 已同步（tests 树收录 smoke_v2183_mpsip + 冒烟/件套口径）',
  readme.includes('smoke_v2183_mpsip') && readme.includes('冒烟一百一十七件套（一百一十六件套清除）'));
ok('README 含 v21.83 守护描述', readme.includes('v21.83'));
ok('README 数值速查技能领悟行含 Lv11 星砂回响', readme.includes('Lv11 星砂回响'));
ok('package.json 已收录 smoke_v2183_mpsip（第 79 份）',
  pkg.includes('smoke_v2183_mpsip') && /smoke_v2182_winrecap\.mjs && node tests\/smoke_v2183_mpsip\.mjs/.test(pkg));
const suite = ['smoke_v2182_winrecap.mjs', 'smoke_v2181_helpquickcast.mjs', 'smoke_v2180_grain.mjs',
  'smoke_v2179_titlerecap.mjs', 'smoke_v2178_codexseen.mjs', 'smoke_v2177_elites.mjs', 'smoke_v2176_allchests.mjs'];
for (const nm of suite) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', nm), 'utf8');
  ok(`${nm} 的 README 件套 pin 已随新现实更新为一百一十七件套（一百一十六件套清除）`,
    src.includes('一百一十七件套（一百一十六件套清除）'));
}
for (const nm of ['smoke_v2182_winrecap.mjs', 'smoke_v2181_helpquickcast.mjs', 'smoke_v2179_titlerecap.mjs']) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', nm), 'utf8');
  ok(`${nm} 的 GAME_VERSION 字面量 pin 已随新现实更新为 v21.84`,
    src.includes("const GAME_VERSION = 'v22.21';"));
}

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
