// v21.64 专项冒烟：图鉴全收集（perfection）解锁横幅补成就名【记忆守护者】（体验打磨·信息透明·口径一致）。
// 背景：成就解锁链条的横幅端 24 项里 23 项经 hero.applyAchievements 通用分支报
// 「🔓 成就解锁：【名】+ 描述」，唯独 perfection 的特别庆贺横幅只报
// 「🏆 图鉴收集完成！额外奖励 N 金币！（剩余 M 金）」——玩家集齐图鉴这一刻看不到自己解锁的
// 成就叫什么，「记忆守护者」之名只在事后翻成就页（C）才对得上是这一刻解锁的。
// 本版句首按通用分支同款口径补「成就解锁：【名】」，名读 ACH_LIST 单一数据源
//（def 早已在上方查找，改名自动跟随，绝无第二套口径），防御式回落 `def ? def.name : id`
// 与通用分支逐字同式；🏆 里程碑视觉与 CODEX_MSG_MS 更长档保留，
// 加奖结算（hero.gold += PERFECTION_GOLD）逐字未动，零结算零数值零存档变化。
// 本冒烟守护：版本锚点、data.js/hero.js 源级落位（v21.64 注释 + 新文案落位 + 旧裸文案零残留 +
// 加奖/时长/通用分支逐字零回归）、数据契约（perfection 条目/总数 24/PERFECTION_GOLD/CODEX_MSG_MS）、
// 运行期实证（perfection 档报文逐字含成就名且加奖结算一致、lvl5 通用档报文逐字零回归、
// 重复调用不重复解锁不加奖、未达成不报）、README/package.json 同步 + smoke_v2163 件套断言去硬化（v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, BESTIARY_TARGET, PERFECTION_GOLD, LVL5_GOAL, CODEX_MSG_MS, ACH_MSG_MS } from '../js/data.js';
import { applyAchievements } from '../js/hero.js';
import { bind } from '../js/bind.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v21.63 冒烟先例：先装桩再 import main.js）——
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

console.log('— v21.64 图鉴全收集解锁横幅补成就名 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.63）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.63', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 64)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.64 注释（图鉴全收集解锁横幅补成就名说明）',
  dSrc.includes('v21.64 体验打磨：图鉴全收集（perfection）解锁横幅补成就名'));

// —— hero.js 源级落位 ——
const hSrc = fs.readFileSync(path.join(ROOT, 'js/hero.js'), 'utf8');
ok('hero.js 含 v21.64 注释（perfection 横幅补成就名）', hSrc.includes('v21.64 图鉴全收集横幅补成就名'));
ok('hero.js 新文案落位（句首「成就解锁：【名】」+ 名读 def 单一数据源）',
  hSrc.includes('bind.boxMsg(`🏆 成就解锁：【${def ? def.name : id}】图鉴收集完成！额外奖励 ${PERFECTION_GOLD} 金币！（剩余 ${hero.gold} 金）`, CODEX_MSG_MS);'));
ok('hero.js 旧裸文案零残留（无成就名的旧句已清除）',
  !hSrc.includes('bind.boxMsg(`🏆 图鉴收集完成！额外奖励'));
ok('hero.js 加奖结算逐字零回归（hero.gold += PERFECTION_GOLD 在 boxMsg 之前）',
  hSrc.includes('hero.gold += PERFECTION_GOLD;'));
ok('hero.js 通用分支逐字零回归（其余 23 项「🔓 成就解锁：【名】+ 描述」）',
  hSrc.includes('bind.boxMsg(`🔓 成就解锁：【${def ? def.name : id}】 ${def ? def.d : \'\'}`, ACH_MSG_MS);'));
ok('hero.js 防御式回落与通用分支逐字同式（模板串内两处 ${def ? def.name : id}）',
  (hSrc.match(/\$\{def \? def\.name : id\}/g) || []).length === 2);

// —— 数据契约（横幅所读数据源）——
const achP = ACH_LIST.find((a) => a.id === 'perfection');
ok('ACH_LIST perfection 条目契约（名=记忆守护者 · r 含奖励 · ok/prog 函数）',
  !!achP && achP.name === '记忆守护者' && typeof achP.r === 'string' && achP.r.includes(String(PERFECTION_GOLD)) &&
  typeof achP.ok === 'function' && typeof achP.prog === 'function');
// v21.68 随新现实更新：hardtrue 成就入列（ACH_LIST 24→25），精确总数移交 smoke_v2168 守护，
// 本件改存活性口径 >= 24（承 v21.59 对 smoke_v2152「===23 → >=23」同款先例）。
ok('ACH_LIST 总数契约 >= 24 项（v21.59 起 24 项；v21.68 起精确总数由新版冒烟守护，本件存活性口径）',
  ACH_LIST.length >= 24, String(ACH_LIST.length));
ok('常量契约（PERFECTION_GOLD=999 / LVL5_GOAL=5 / CODEX_MSG_MS=4200 / ACH_MSG_MS=3200）',
  PERFECTION_GOLD === 999 && LVL5_GOAL === 5 && CODEX_MSG_MS === 4200 && ACH_MSG_MS === 3200);
ok('BESTIARY_TARGET 契约 13 种（perfection 判定所读）', BESTIARY_TARGET.length === 13, String(BESTIARY_TARGET.length));

// —— 运行期实证：bind.boxMsg 捕获（承 v21.40/v21.60-v21.63 捕获桩法）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 1, hp: 60, hpMax: 60, mp: 20, mpMax: 20,
    atkMax: 12, defMax: 6, gold: 100, xp: 0, xpNext: 20, item: 3, potion2: 0,
    weapon: '木剑', armor: '布衣', diff: null, skills: ['火焰斩'],
    poison: 0, seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, x: 1, y: 1, map: 'village',
    charge: false }, extra || {});
}
function fullBestiary() {
  const b = {};
  for (const nm of BESTIARY_TARGET) b[nm] = 1;
  return b;
}
function runAch(hero) {
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    S.G = hero;
    applyAchievements();
    return msgs;
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}

// A 档：perfection 解锁——报文逐字含成就名【记忆守护者】，且加奖结算一致（gold +999）
//（全图鉴会连带触发 scholar「记忆收藏家 5 种」、加奖后 gold 1099 越过 RICH_GOLD 会连带 rich——
//  预置 ach 剔除连带项，聚焦本版 perfection 单横幅；v21.77 连带项补充：fullBestiary 含双精英
//  （石心魔像/残焰魔像）会连带 elites「精英猎手」，同样预置剔除，聚焦本版横幅）
{
  const h = mkHero({ gold: 100, bestiary: fullBestiary(), ach: ['scholar', 'rich', 'elites'] });
  const m = runAch(h);
  ok('运行期：perfection 档报文逐字「🏆 成就解锁：【记忆守护者】图鉴收集完成！额外奖励 999 金币！（剩余 1099 金）」',
    m.length === 1 && m[0] === '🏆 成就解锁：【记忆守护者】图鉴收集完成！额外奖励 999 金币！（剩余 1099 金）', m.join(' | '));
  ok('运行期：perfection 档加奖结算一致（gold 100→1099，ach 落 perfection）',
    h.gold === 100 + PERFECTION_GOLD && (h.ach || []).includes('perfection'));
}

// B 档：lvl5 通用分支零回归——报文逐字（🔓 口径）且无加奖
{
  const h = mkHero({ gold: 100, level: 5 });
  const m = runAch(h);
  ok('运行期：lvl5 档报文逐字零回归「🔓 成就解锁：【独当一面】 等级达到 5 级」',
    m.length === 1 && m[0] === '🔓 成就解锁：【独当一面】 等级达到 5 级', m.join(' | '));
  ok('运行期：lvl5 档零加奖（gold 100 不变，ach 落 lvl5）',
    h.gold === 100 && (h.ach || []).includes('lvl5'));
}

// C 档：perfection + lvl5 同时达成——两条横幅各报各的，perfection 带名、lvl5 通用口径
//（预置 scholar/elites 剔除全图鉴连带项，聚焦双解锁对照）
{
  const h = mkHero({ gold: 0, level: 5, bestiary: fullBestiary(), ach: ['scholar', 'elites'] });
  const m = runAch(h);
  ok('运行期：双解锁档两条横幅（lvl5 通用口径 + perfection 带名）',
    m.length === 2 &&
    m.includes('🔓 成就解锁：【独当一面】 等级达到 5 级') &&
    m.includes('🏆 成就解锁：【记忆守护者】图鉴收集完成！额外奖励 999 金币！（剩余 999 金）'),
    m.join(' | '));
  ok('运行期：双解锁档结算一致（gold 0→999，两成就均落）',
    h.gold === PERFECTION_GOLD && h.ach.includes('lvl5') && h.ach.includes('perfection'));
}

// D 档：重复调用零回归——已解锁不再报、不重复加奖
//（预置 scholar/rich/elites：全图鉴连带 scholar 与 elites；首轮加奖后 gold 1099 越过 RICH_GOLD，不预置则第二轮会报 rich）
{
  const h = mkHero({ gold: 100, bestiary: fullBestiary(), ach: ['scholar', 'rich', 'elites'] });
  runAch(h);
  const goldAfterFirst = h.gold;
  const m2 = runAch(h);
  ok('运行期：重复调用档不再报任何横幅（m2 为空）', m2.length === 0, m2.join(' | '));
  ok('运行期：重复调用档不重复加奖（gold 停留 1099）', h.gold === goldAfterFirst && goldAfterFirst === 1099);
}

// E 档：未达成不报——图鉴缺一种，perfection 不解锁、零横幅零加奖
//（12 种仍越过 scholar 的 5 种门槛，预置剔除连带项；v21.77 连带项补充：12 种仍含双精英会连带
//  elites，预置剔除后零横幅断言聚焦 perfection）
{
  const b = fullBestiary();
  delete b['终焉之神'];
  const h = mkHero({ gold: 100, bestiary: b, ach: ['scholar', 'elites'] });
  const m = runAch(h);
  ok('运行期：图鉴缺一种档零横幅零加奖（perfection 不解锁）',
    m.length === 0 && h.gold === 100 && !(h.ach || []).includes('perfection'), m.join(' | '));
}

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2164_achname', readme.includes('smoke_v2164_achname'));
// v21.65 去硬化（v21.7 惯例）：件套精确计数移交当版冒烟守护，本件改存活性口径——
// 仍含「冒烟/件套」且旧口径「（五十九件套清除）」已清除。
ok('README 件套口径为存活性断言（v21.65 起件数由新版冒烟守护：六十一件套（六十件套清除））',
  readme.includes('冒烟') && readme.includes('件套') &&
  !readme.includes('（五十九件套清除）'));
ok('README 含 v21.64 守护描述（图鉴全收集解锁横幅补成就名守护）',
  readme.includes('图鉴全收集解锁横幅补成就名守护'));
ok('package.json 已收录 smoke_v2164_achname（npm test 串跑第 60 份）', pkg.includes('smoke_v2164_achname.mjs'));
const s2163 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2163_shopgold.mjs'), 'utf8');
ok('smoke_v2163 的 README 件套口径断言已去硬化（存活性口径落位，旧精确表达式零残留）',
  s2163.includes("!readme.includes('（五十八件套清除）')") &&
  !s2163.includes("readme.includes('五十九件套（五十八件套清除）')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
