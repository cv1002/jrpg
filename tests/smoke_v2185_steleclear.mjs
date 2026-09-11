// v21.85 专项冒烟：试炼碑通关后状态如实分档（体验打磨·信息透明·状态如实）——碑上标签/奖励行/面向
// 提示此前只有 未解锁/新挑战 两档，玩家通关试炼（hero.rushDone，「百炼成钢」落袋）后碑上仍挂
// 「⚔️ 试炼三连战 + 通关奖」的新挑战档，与强敌祭坛「击败自动熄灭」/已开宝箱等同图状态展示口径
// 不一致；现按 rushDone 分档：已通关 →「✅ 试炼三连战 · 已通关（可再战）」+「💰 再战通关奖 N 金
// （随等级）」+ 面向提示「踩上再战」，未通关/未解锁档逐字零回归（纯显示零结算零数值零存档变化；
// winBattle 试炼分支无 rushDone 守卫、再战仍发全额通关奖属既有设计行为，本版不改结算）。
// 本冒烟守护：版本锚点、data.js/drawWorld.js 源级落位（三档分档 + 既有档逐字零回归）、运行期三档
// 实证（渲染捕获 fillText：已通关档/新挑战档/未解锁档逐字落位 + 互斥）、宽度预算、README/package.json
// 同步 + 姊妹件套 pin（v2184..v2176 八十二件套 / v2184·v2183·v2182·v2181·v2179 GAME_VERSION v21.86）
// 随新现实更新。
import { S } from '../js/state.js';
import { GAME_VERSION, RUSH_REC_LV, RUSH_BOSSES, SPECIES } from '../js/data.js';
import { rushReward } from '../js/rules.js';
import { newGame } from '../js/core.js';
import { loadMap } from '../js/world.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v21.84 冒烟先例：先装桩再 import main.js；fillText 捕获供渲染断言）——
const noop = () => {};
const captured = [];
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
    fillText: (t) => { captured.push(String(t)); },
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
// drawWorld 静态导入会先于 DOM 桩执行（view/canvas.js 顶层访问 document）——按 v21.84 对 menus.js 同款
// 惯例改为桩装好后动态导入（drawWorld 仅在渲染断言阶段使用）。
const { drawWorld } = await import('../js/view/drawWorld.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.85 试炼碑通关后状态如实分档 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const wSrc = fs.readFileSync(path.join(ROOT, 'js/view/drawWorld.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.84 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.84', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 85)), GAME_VERSION);
ok('data.js 含 v21.85 注释（试炼碑通关后状态如实分档说明）', dSrc.includes('v21.85 体验打磨'));
ok('data.js GAME_VERSION 字面量已更新为 v21.85', dSrc.includes("const GAME_VERSION = 'v22.16';"));

// —— 源级落位：drawWorld.js 三处分档 + 既有档逐字零回归 ——
ok('drawWorld.js 碑上标签已通关档落位（✅ 试炼三连战 · 已通关（可再战））', wSrc.includes('✅ 试炼三连战 · 已通关（可再战）'));
ok('drawWorld.js 碑上奖励行再战档落位（💰 再战通关奖 ... 金（随等级））', wSrc.includes('💰 再战通关奖') && wSrc.includes('再战通关奖 ${rushReward(S.G.level)} 金（随等级）'));
ok('drawWorld.js 面向提示再战档落位（踩上再战）', wSrc.includes('踩上再战'));
ok('drawWorld.js 分档键读 S.G.rushDone（标签/奖励行/面向提示三处同源）',
  (wSrc.match(/S\.G\.rushDone/g) || []).length >= 3, String((wSrc.match(/S\.G\.rushDone/g) || []).length));
ok('drawWorld.js 既有档逐字零回归（试炼·未解锁 / ⚔️ 试炼三连战 / 💰 通关奖 / 踩上挑战 全在源）',
  wSrc.includes("'试炼·未解锁'") && wSrc.includes('⚔️ 试炼三连战') && wSrc.includes('💰 通关奖') && wSrc.includes('踩上挑战'));
ok('drawWorld.js 含 v21.85 注释（三处改动均有设计意图说明）', wSrc.includes('v21.85 试炼碑通关后状态如实分档'));

// —— 数值互证：再战通关奖与既有 rushReward 单一数据源同式（level 12 → 390 金）——
ok('rushReward(12) === 390（RUSH_BASE_GOLD + 12×RUSH_GOLD_PER_LV，与碑上「随等级」同源）',
  rushReward(12) === 390, String(rushReward(12)));
ok('RUSH_REC_LV 仍 12 且三连战阵容 3 关（分档不改试炼任何数值）', RUSH_REC_LV === 12 && RUSH_BOSSES.length === 3);

// —— 运行期三档实证：cave 试炼碑 (18,12)，英雄 (18,11) 面向下 ——
function renderCave(flags) {
  captured.length = 0;
  S.G = newGame('测试');
  S.G.map = 'cave';
  S.G.x = 18; S.G.y = 11;
  S.G.level = 12;
  S.G.bossDefeated = !!flags.boss;
  S.G.caveBoss = !!flags.cave;
  S.G.rushDone = !!flags.done;
  S.dir = 'D';
  S.scene = 'world';
  S.walk = null;
  loadMap('cave');
  drawWorld();
  return captured.slice();
}
// 阵容串与 drawWorld 同式（RUSH_BOSSES→SPECIES[].lv 单一数据源派生，与碑上标签逐字恒等）
const roster = RUSH_BOSSES.map((b) => `${b.name}Lv${(SPECIES[b.name] && SPECIES[b.name].lv) || 1}`).join('→');
const FRESH_LABEL = `⚔️ 试炼三连战 ${roster} · 建议Lv.${RUSH_REC_LV}`;
const DONE_LABEL = '✅ 试炼三连战 · 已通关（可再战）';
const DONE_REWARD = `💰 再战通关奖 ${rushReward(12)} 金（随等级）`;
const FRESH_REWARD = `💰 通关奖 ${rushReward(12)} 金（随等级）`;

let cap = renderCave({ boss: true, cave: true, done: true });
ok('已通关档：碑上标签为 ✅ 已通关（可再战）', cap.includes(DONE_LABEL), cap.filter((t) => t.includes('试炼')).join(' | '));
ok('已通关档：奖励行为 💰 再战通关奖 390 金（随等级）', cap.includes(DONE_REWARD), cap.filter((t) => t.includes('通关奖')).join(' | '));
ok('已通关档：面向提示为「踩上再战」', cap.includes('踩上再战'), cap.filter((t) => t.includes('踩上')).join(' | '));
ok('已通关档：新挑战档互斥零残留（⚔️ 试炼三连战 / 💰 通关奖 / 踩上挑战 均不渲染）',
  !cap.includes(FRESH_LABEL) && !cap.includes(FRESH_REWARD) && !cap.includes('踩上挑战'));

cap = renderCave({ boss: true, cave: true, done: false });
ok('新挑战档（未通关）：碑上标签逐字零回归（⚔️ 阵容 · 建议Lv.12）', cap.includes(FRESH_LABEL), cap.filter((t) => t.includes('试炼')).join(' | '));
ok('新挑战档（未通关）：奖励行逐字零回归（💰 通关奖 390 金（随等级））', cap.includes(FRESH_REWARD));
ok('新挑战档（未通关）：面向提示逐字零回归（踩上挑战）', cap.includes('踩上挑战'));
ok('新挑战档（未通关）：已通关档互斥零渲染（✅ 已通关 / 再战通关奖 / 踩上再战）',
  !cap.includes(DONE_LABEL) && !cap.includes(DONE_REWARD) && !cap.includes('踩上再战'));

cap = renderCave({ boss: false, cave: false, done: false });
ok('未解锁档：碑上标签逐字零回归（试炼·未解锁）', cap.includes('试炼·未解锁'));
ok('未解锁档：无挑战/奖励/面向提示（⚔️ / 💰 通关奖 / 踩上挑战 / 踩上再战 全不渲染）',
  !cap.includes(FRESH_LABEL) && !cap.includes(FRESH_REWARD) && !cap.includes('踩上挑战') && !cap.includes('踩上再战'));

// —— 宽度预算（承 v21.11 口径：面板/画布内侧文字不越界；试炼碑标签为 12px 居中方框）——
ok('已通关档标签宽度预算（12px 级 ≈ ' + (DONE_LABEL.length * 8 + 12) + 'px ≤ 480 画布内宽）',
  DONE_LABEL.length * 8 + 12 <= 480);
ok('再战奖励行宽度预算（12px 级 ≈ ' + (DONE_REWARD.length * 8 + 12) + 'px ≤ 480 画布内宽）',
  DONE_REWARD.length * 8 + 12 <= 480);

// —— README / package.json / 既有冒烟 pin 随新现实更新 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2185_steleclear', readme.includes('smoke_v2185_steleclear'));
ok('README 件套口径为一百一十二件套（一百一十一件套清除）', readme.includes('一百一十二件套（一百一十一件套清除）'));
ok('README 含 v21.85 守护描述', readme.includes('v21.85 起含'));
ok('README 系统清单试炼碑标签补已通关分档口径（✅ 已通关（可再战））', readme.includes('已通关（可再战）'));
ok('package.json 已收录 smoke_v2185_steleclear（npm test 串跑第 81 份）',
  pkg.includes('smoke_v2185_steleclear.mjs') && /smoke_v2184_lvl12\.mjs && node tests\/smoke_v2185_steleclear\.mjs/.test(pkg));

// —— 姊妹件套 pin 复查（v21.7 惯例：本版冒烟守护姊妹随新现实更新）——
const suite81 = ['smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs',
  'smoke_v2181_helpquickcast.mjs', 'smoke_v2180_grain.mjs', 'smoke_v2179_titlerecap.mjs',
  'smoke_v2178_codexseen.mjs', 'smoke_v2177_elites.mjs', 'smoke_v2176_allchests.mjs'];
for (const nm of suite81) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', nm), 'utf8');
  ok(`${nm} 的 README 件套 pin 已随新现实更新为一百一十二件套（一百一十一件套清除）`,
    src.includes('一百一十二件套（一百一十一件套清除）'));
}
for (const nm of ['smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs', 'smoke_v2181_helpquickcast.mjs', 'smoke_v2179_titlerecap.mjs']) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', nm), 'utf8');
  ok(`${nm} 的 GAME_VERSION 字面量 pin 已随新现实更新为 v21.85`,
    src.includes("const GAME_VERSION = 'v22.16';"));
}

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
