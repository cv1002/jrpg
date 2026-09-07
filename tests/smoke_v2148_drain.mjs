// v21.48 专项冒烟：Lv9 新技能「汲光击」——全游戏首个「汲回」招（新内容·战斗机制）。
// 背景：技能领悟表自 v17.x 起停在 Lv7 陨石术，Lv8-12 再无新招（v17.7 MAX_LEARN_LV 收口注释
// 早已预留「新增 9 级技能」的位置）。本版新增：LEARN_AT 9 级条目 + SKILL_DATA drain/drainCap
// （DRAIN_PCT/DRAIN_HP_CAP 单一数据源派生）+ 光元素（恒 ×1 中性，不扰动既有克制表）+
// battle.doSkill 汲回结算（min(drainCap×hpMax, 伤害×drain) 再钳制实际可回量）+
// 祸乱形态「封印治愈」对 drain 招同封（skillForbidden 与技能菜单 ⛔封印 双端同口径）+
// 六招排版容量（技能菜单行距 36→34 / 状态页技能行 16→14）+ H 页「技能克制」行拆 r[1]+r[2] +
// migrateQuests 旧档按等级补学。本冒烟守护：版本锚点、数据层落位、源级落位、运行期实证
// （汲回/满血/封印/未学/补学 + skillEstimate 预览 + 六招菜单渲染）、README/package 同步、
// smoke_v2115 r[2] 计数更新确认、smoke_v2147 件套断言去硬化确认（v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION, SKILL_DATA, MAX_LEARN_LV, learnsAt, DRAIN_PCT, DRAIN_HP_CAP, ELEM_NAME, SPECIES, HELP_PAGES, baseStats } from '../js/data.js';
import { elemMult, skillEstimate, cmdDmg } from '../js/rules.js';
import { migrateQuests } from '../js/quests.js';
import { startBattle, playerAction } from '../js/battle.js';
import { drawSkillMenu } from '../js/view/drawBattle.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v21.47 冒烟先例：先装桩再 import main.js）——
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

console.log('— v21.48 Lv9 新技能「汲光击」（汲回招） 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.47）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.47', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 48)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.48 注释（Lv9 技能「汲光击」）', dSrc.includes('v21.48 新增：Lv9 技能「汲光击」'));

// —— 数据层落位 ——
ok('LEARN_AT 含 9 级条目「汲光击」（learnsAt(9) 派生）', learnsAt(9) === '汲光击');
ok('LEARN_AT 其余等级零回归（1/3/4/5/7 逐字，8/10 为空）',
  learnsAt(1) === '火焰斩' && learnsAt(3) === '冰霜击' && learnsAt(4) === '治愈术' &&
  learnsAt(5) === '雷鸣' && learnsAt(7) === '陨石术' && learnsAt(8) === null && learnsAt(10) === null);
ok('MAX_LEARN_LV 自动派生为 9（v17.7 单一数据源收口生效，新技能不再被提示漏扫）', MAX_LEARN_LV === 9);
const sk = SKILL_DATA['汲光击'];
ok('SKILL_DATA[汲光击] 字段落位（mp9/×2.0/atk/光/drain/drainCap 由常量派生）',
  !!sk && sk.mp === 9 && sk.mult === 2.0 && sk.kind === 'atk' && sk.element === 'light' &&
  sk.drain === DRAIN_PCT && sk.drainCap === DRAIN_HP_CAP);
ok('DRAIN_PCT/DRAIN_HP_CAP 已导出且为 0.5/0.25', DRAIN_PCT === 0.5 && DRAIN_HP_CAP === 0.25);
ok('汲光击 hint 与常量同源（汲回伤害50%为HP·上限25%HP）',
  sk.hint === '汲回伤害' + Math.round(DRAIN_PCT * 100) + '%为HP·上限' + Math.round(DRAIN_HP_CAP * 100) + '%HP', sk.hint);
ok('ELEM_NAME 补「光」（元素表覆盖全部技能元素）', ELEM_NAME.light === '光');
ok('光元素恒 ×1 中性（无魔物弱/抗引用 light，不扰动既有克制表）',
  Object.values(SPECIES).every((sp) => sp.weak !== 'light' && sp.resist !== 'light') &&
  elemMult(sk, SPECIES['残焰魔像']) === 1 && elemMult(sk, SPECIES['石魔像']) === 1 && elemMult(sk, SPECIES['终焉之神']) === 1);

// —— 源级落位 ——
const bSrc = fs.readFileSync(path.join(ROOT, 'js/battle.js'), 'utf8');
ok('battle.js skillForbidden 把 drain 招并入 heal 封印口径',
  bSrc.includes("(skill.kind === 'heal' || skill.drain) && enemy.forbid.includes('heal')"));
ok('battle.js 汲回结算源级落位（上限→实际可回量双重钳制 + 战报标注）',
  bSrc.includes('const dr = Math.min(hero.hpMax - hero.hp, Math.min(cap, Math.round(dmg * skill.drain)));') &&
  bSrc.includes('note += `（汲回 ${dr} HP）`;'));
const dbSrc = fs.readFileSync(path.join(ROOT, 'js/view/drawBattle.js'), 'utf8');
ok('drawBattle.js 技能菜单封印标注与结算同口径（drain 同封）',
  dbSrc.includes("(skill.kind === 'heal' || skill.drain) && enemy.forbid.includes('heal')"));
ok('drawBattle.js 技能菜单行距 36→34 落位（ROW_SP，六招容量）且旧 i*36 零残留',
  dbSrc.includes('const ROW_SP = 34;') && dbSrc.includes('148 + i * ROW_SP') &&
  !dbSrc.includes('148 + i * 36') && !dbSrc.includes('160 + i * 36') && !dbSrc.includes('176 + i * 36'));
const mSrc = fs.readFileSync(path.join(ROOT, 'js/view/menus.js'), 'utf8');
ok('menus.js 状态页技能行距 16→14 落位（六招容量）且旧 308+i*16 零残留',
  mSrc.includes('308+i*14') && !mSrc.includes('308+i*16'));
const qSrc = fs.readFileSync(path.join(ROOT, 'js/quests.js'), 'utf8');
ok('quests.js migrateQuests 旧档补学落位（learnsAt import + 按等级补齐循环）',
  /import\s*\{[^}]*\blearnsAt\b[^}]*\}\s*from\s*'\.\/data\.js'/.test(qSrc) && qSrc.includes('hero.skills.push(sk);'));

// —— H 页「技能克制」行（拆 r[1]+r[2] 补「汲光回血」，行数不变仍 10）——
const page2 = HELP_PAGES[2];
const rowCounter = page2.find((r) => r[0] === '技能克制');
ok('技能克制行已拆 r[1]+r[2] 且 r[1] 收「汲光回血」（倍率规则移 r[2]）',
  !!rowCounter && rowCounter.length === 3 && rowCounter[1].includes('汲光回血') && !rowCounter[1].includes('弱点伤害'),
  rowCounter && JSON.stringify(rowCounter));
ok('技能克制 r[2] 倍率规则由 ELEM_MULT 派生（弱点×1.35 · 抗性×0.7）',
  !!rowCounter && rowCounter[2] === '弱点伤害×1.35 · 抗性伤害×0.7', rowCounter && rowCounter[2]);
ok('魔物状态页行数仍为 10（拆 r[2] 不增行，sp=34 档不变）', page2.length === 10, `实际 ${page2.length}`);
// 宽度预算（estW 系数沿 v21.11/v21.15 官方冒烟标定口径）
const estW = (s, size) => {
  let wsum = 0;
  for (const ch of String(s || '')) {
    const code = ch.codePointAt(0);
    const wide = (code >= 0x2e80 && code <= 0x9fff) || (code >= 0x3000 && code <= 0x303f) || (code >= 0xff00 && code <= 0xffef) || code >= 0x1f000;
    if (wide) wsum += 0.865 * size;
    else if (code === 0xb7) wsum += 0.303 * size;
    else if (code === 0xd7) wsum += 0.564 * size;
    else if (code === 0x25) wsum += 0.827 * size;
    else if (code === 0x2b) wsum += 0.543 * size;
    else if (code === 0x2d) wsum += 0.432 * size;
    else if (code === 0x2f) wsum += 0.338 * size;
    else if (code === 0x2e) wsum += 0.226 * size;
    else if (code >= 0x30 && code <= 0x39) wsum += 0.63 * size;
    else if (code === 0x20) wsum += 0.263 * size;
    else wsum += 0.55 * size;
  }
  return wsum;
};
const wC1 = rowCounter ? estW(rowCounter[0] + '   ', 14) + estW(rowCounter[1], 14) : 9999;
const wC2 = rowCounter ? estW(rowCounter[2], 12) : 9999;
ok('技能克制 r[1] 估算宽 ≤470（单行追加会 ≈520 越界，拆分后消除）', wC1 <= 470, `≈${wC1.toFixed(1)}`);
ok('技能克制 r[2] 估算宽 ≤470', wC2 <= 470, `≈${wC2.toFixed(1)}`);
ok('魔物状态页末行基线 434 不触页脚 452（10 行 ×34 + 3 处 r[2] ×16，80+306+48=434）',
  80 + 34 * (page2.length - 1) + 16 * page2.filter((r) => r && r.length > 2).length === 434);

// —— 运行期实证：migrateQuests 旧档补学 ——
const oldSave = { level: 10, skills: ['火焰斩', '冰霜击', '治愈术', '雷鸣', '陨石术'], quest: 0 };
migrateQuests(oldSave);
ok('运行期：Lv10 旧档（无汲光击）读档补学 → 六招齐全且新招殿后',
  oldSave.skills.length === 6 && oldSave.skills[5] === '汲光击', JSON.stringify(oldSave.skills));
const midSave = { level: 8, skills: ['火焰斩', '冰霜击', '治愈术', '雷鸣', '陨石术'], quest: 0 };
migrateQuests(midSave);
ok('运行期：Lv8 旧档不越级补学（汲光击仍缺席，到 Lv9 才领悟）',
  midSave.skills.length === 5 && !midSave.skills.includes('汲光击'));
const newSave = { level: 1, quest: 0 };
migrateQuests(newSave);
ok('运行期：无 skills 字段的更老档兜底为 [火焰斩]（learnsAt(1) 起始技能单一数据源）',
  JSON.stringify(newSave.skills) === JSON.stringify(['火焰斩']), JSON.stringify(newSave.skills));

// —— 运行期实证：战斗汲回结算（playerAction 真实路径）——
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
function castDrain(hero, enemy) {
  S.G = hero; S.G.map = 'village';
  startBattle(enemy);
  S.battleBusy = false;   // 测试桩：跳过开场 700ms 编排空档（enqueue 为真实 setTimeout）
  playerAction('skill', '汲光击');
  const line = S.blog[S.blog.length - 1] || '';
  S.enemy = null; S.scene = 'world'; S.battleBusy = false;
  return line;
}

// Lv12·残血 50/122：伤害 180-220 ×50% = 90-110，超出单次上限 round(122×0.25)=31 → 恒汲回 31（上限钳制决定性）
const h1 = mkHero(12, 50, 60, ['汲光击']);
const l1 = castDrain(h1, mkDoll());
ok('运行期：汲光击命中残血英雄 → 汲回恒 = 31（drainCap×hpMax 上限钳制，伤害浮动被截断）',
  h1.hp === 50 + 31 && l1.includes('汲回 31 HP'), `hp=${h1.hp} | ${l1}`);
ok('运行期：汲光击耗蓝 9（60→51）且战报含 MP 读数（v20.7 口径零回归）',
  h1.mp === 60 - 9 && l1.includes('（MP 51/60）'), `mp=${h1.mp} | ${l1}`);
// 满血档：如实报「汲回 0 HP」
const h2 = mkHero(12, 122, 60, ['汲光击']);
const l2 = castDrain(h2, mkDoll());
ok('运行期：满血施放 → 汲回 0 HP 如实标注（HP 122/122 不动）',
  h2.hp === 122 && l2.includes('汲回 0 HP'), `hp=${h2.hp} | ${l2}`);
// 封印档：祸乱气场（forbid heal）同封 drain 招——MP 不扣、敌血不动、战报点名
const h3 = mkHero(12, 50, 60, ['汲光击']);
const doll3 = mkDoll();
S.G = h3; S.G.map = 'village';
startBattle(doll3);
S.enemy.forbid = ['heal'];   // startBattle 置 null 后模拟变身后封印态
S.battleBusy = false;
playerAction('skill', '汲光击');
const l3 = S.blog[S.blog.length - 1] || '';
ok('运行期：祸乱气场封印治愈对汲光击同效（⛔ 封印提示 + MP/敌血双不动）',
  l3.includes('封印了【汲光击】') && h3.mp === 60 && S.enemy.hp === 500, `mp=${h3.mp} enemyHp=${S.enemy.hp} | ${l3}`);
S.enemy = null; S.scene = 'world'; S.battleBusy = false;
// 未学档：未领悟被拒，MP 不动
const h4 = mkHero(12, 50, 60, ['火焰斩']);
const l4 = castDrain(h4, mkDoll());
ok('运行期：未领悟汲光击 →「尚未领悟该技能」且 MP 不动（doSkill 门零回归）',
  l4.includes('尚未领悟该技能') && h4.mp === 60, `mp=${h4.mp} | ${l4}`);
// 预览同源：skillEstimate 对汲光击给正值（技能菜单 ≈N伤 预览不崩）
ok('运行期：skillEstimate 汲光击预览为正值（菜单 ≈N伤 同源不崩）',
  skillEstimate(mkHero(12, 122, 60, ['汲光击']), mkDoll(), sk) > 0);
// 六招菜单渲染：含封印敌时 ⛔封印 标注路径不抛错
let drew = true;
try {
  S.G = mkHero(12, 50, 60, ['火焰斩', '冰霜击', '治愈术', '雷鸣', '陨石术', '汲光击']);
  S.enemy = mkDoll({ forbid: ['heal'] });
  drawSkillMenu();
} catch (e) { drew = false; console.log('   drawSkillMenu:', e.message); }
ok('运行期：六招技能菜单（含 drain 封印标注）渲染不抛错', drew);
S.enemy = null;

// —— README / package.json 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
ok('README tests 树收录 smoke_v2148_drain', readme.includes('smoke_v2148_drain'));
ok('README 件套口径为四十四件套（四十三件套清除）', readme.includes('四十四件套（四十三件套清除）'));
ok('README 含 v21.48 守护描述（Lv9 新技能「汲光击」守护）', readme.includes('Lv9 新技能「汲光击」守护'));
ok('README 数值速查技能领悟行含 Lv9 汲光击', readme.includes('Lv9 汲光击'));
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('package.json 已收录 smoke_v2148_drain（npm test 串跑第 44 份）', pkg.includes('smoke_v2148_drain.mjs'));

// —— smoke_v2115 r[2] 计数断言已随新现实更新（2→3）——
const s2115 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2115_elixir.mjs'), 'utf8');
ok('smoke_v2115 的 r[2] 计数断言已更新为 3（技能克制/战斗掉落/宝箱掉落各 1 处，旧 ===2 零残留）',
  s2115.includes('.length === 3') && !s2115.includes('.length === 2);'));

// —— smoke_v2147 的 README 件套口径断言已去硬化（v21.7 惯例）——
const s2147 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2147_heavywarn.mjs'), 'utf8');
ok('smoke_v2147 的 README 件套口径断言已去硬化（存活性口径落位，旧精确表达式零残留）',
  s2147.includes("!readme.includes('（四十二件套清除）')") &&
  !s2147.includes("readme.includes('四十三件套（四十二件套清除）')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
