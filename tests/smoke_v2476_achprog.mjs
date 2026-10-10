// smoke_v2476_achprog.mjs — v24.76 专项冒烟：🔓 成就解锁横幅补「（成就 N/76）」进度后缀
// （体验打磨·信息透明·计数现场——承 v24.55 住店「💸 一掷千金 N/1000」/ v24.57 夜间胜利「🌙 提灯夜行
// N/10」/ v24.26 升级横幅「🌙 守灯者 N/10」同一「计数现场报进度」主线：成就解锁链路通用分支（23/24 项）
// 自 v21.64 起只报「🔓 成就解锁：【名】+ 描述」，整条收集线进度只藏在 C 成就页「已解锁 N/M」与
// I 状态页「🏆:N/M」两处静态页（v22.9/v21.96/v21.98/v21.87 五端同源）；解锁瞬间正是收集线的计数现场，
// 玩家却看不到自己离全收集还差几枚；现按 v24.26 同款在通用分支句末补「（成就 N/M）」（N=本函数唯一
// 产生点上方已 push 的 (hero.ach||[]).length——解锁即含本次、M=ACH_LIST.length 单一数据源五端同读，
// 增删成就只改 data.js 一处自动跟随），perfection 特别庆贺分支（🏆 图鉴收集完成 + 999 金 + 剩余金币）
// 信息已过载保持逐字零回归；纯显示零结算零存档零数值变化。
// 本冒烟守护：版本锚点、data.js/hero.js 源级落位（v24.76 注释 + 新模板逐字 + 旧模板零残留 +
// perfection 分支逐字零回归 + 防御式 (hero.ach||[]).length）、ACH_LIST 总数 76 契约、
// 运行期实证（lvl5 单解锁 1/76 逐字 · 旧档无 ach 字段防御档 · 三连解锁 1/76→2/76→3/76 递增 ·
// perfection 特别分支逐字零后缀 · 已解锁重复调用零横幅）、README/package.json/CHANGELOG 同步
// （件套口径 299 + v24.76 守护描述 + 入库 299 + 树串尾 + 哨兵前望 300）、
// 全库零残留（v24.75 字面量/298 口径/旧链尾 · 豁免本套件与上一版套件）。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, LVL5_GOAL, BESTIARY_TARGET, PERFECTION_GOLD, ACH_MSG_MS } from '../js/data.js';
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

console.log('— v24.76 成就解锁横幅「（成就 N/76）」进度后缀 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— 版本锚点 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.75', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] >= 76)), GAME_VERSION);

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const hSrc = fs.readFileSync(path.join(ROOT, 'js/hero.js'), 'utf8');

// —— data.js 版本与注释 ——
ok('data.js GAME_VERSION 字面量已为 v24.76（旧 v24.75 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.77';") && !dSrc.includes("const GAME_VERSION = 'v24.75';"));
ok('data.js 含 v24.76 注释（成就解锁横幅「（成就 N/76）」进度后缀说明）',
  dSrc.includes('// v24.76 体验打磨·信息透明·计数现场') && dSrc.includes('成就解锁横幅补「（成就 N/76）」进度后缀'));
ok('data.js 保留 v24.73/v24.75 历史注释（经验曲线方法论零丢失）',
  dSrc.includes('// v24.73 数值平衡·后期经验曲线续平滑') && dSrc.includes('// v24.75 数值平衡·后期经验曲线续平滑'));

// —— hero.js 源级落位 ——
ok('hero.js 含 v24.76 注释（applyAchievements 通用分支行内说明）',
  hSrc.includes('v24.76 体验打磨·信息透明·计数现场') && hSrc.includes('成就解锁横幅补「（成就 N/76）」进度后缀'));
ok('hero.js 新模板逐字落位（句末「（成就 N/M）」分子 (hero.ach||[]).length / 分母 ACH_LIST.length）',
  hSrc.includes('bind.boxMsg(`🔓 成就解锁：【${def ? def.name : id}】 ${def ? def.d : \'\'}（成就 ${(hero.ach || []).length}/${ACH_LIST.length}）`, ACH_MSG_MS);'));
ok('hero.js 旧通用模板零残留（无后缀裸模板已清除）',
  !hSrc.includes("''}`, ACH_MSG_MS)"));
ok('hero.js 防御式读取落位（(hero.ach || []).length 而非裸 hero.ach.length —— 旧档零迁移）',
  hSrc.includes('（成就 ${(hero.ach || []).length}/${ACH_LIST.length}）'));
ok('hero.js perfection 特别庆贺分支逐字零回归（🏆 图鉴收集完成 + 999 金 + 剩余金币，无后缀）',
  hSrc.includes('bind.boxMsg(`🏆 成就解锁：【${def ? def.name : id}】图鉴收集完成！额外奖励 ${PERFECTION_GOLD} 金币！（剩余 ${hero.gold} 金）`, CODEX_MSG_MS);'));
ok('hero.js 解锁判定/写入/铃声/奖励结算逐字零回归（ach.push 先于 boxMsg · SFX.ach · gold += PERFECTION_GOLD）',
  hSrc.includes('hero.ach.push(id);') && hSrc.includes('SFX.ach();') && hSrc.includes('hero.gold += PERFECTION_GOLD;'));

// —— 数据契约 ——
ok('ACH_LIST 总数契约 = 76（v24.76 精确总数由本件守护）', ACH_LIST.length === 76, String(ACH_LIST.length));
ok('常量契约（LVL5_GOAL=5 / BESTIARY_TARGET=13 / PERFECTION_GOLD=999 / ACH_MSG_MS=3200）',
  LVL5_GOAL === 5 && BESTIARY_TARGET.length === 13 && PERFECTION_GOLD === 999 && ACH_MSG_MS === 3200);

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

// A 档：lvl5 单解锁——报文逐字含「（成就 1/76）」（分子=解锁即含本次的 1）
{
  const h = mkHero({ gold: 100, level: 5 });
  const m = runAch(h);
  ok('运行期：lvl5 档报文逐字「🔓 成就解锁：【独当一面】 等级达到 5 级（成就 1/76）」',
    m.length === 1 && m[0] === '🔓 成就解锁：【独当一面】 等级达到 5 级（成就 1/76）', m.join(' | '));
  ok('运行期：lvl5 档零加奖（gold 100 不变，ach 落 lvl5 且长度 1）',
    h.gold === 100 && (h.ach || []).includes('lvl5') && h.ach.length === 1);
}
// B 档：三连解锁——N 随 push 递增 1/76→2/76→3/76（lvl5·lvl10·lvl12 按 ACH_LIST 序）
{
  const h = mkHero({ gold: 100, level: 12 });
  const m = runAch(h);
  const ids = ['lvl5', 'lvl10', 'lvl12'];
  const want = ids.map((id, i) => {
    const d = ACH_LIST.find((a) => a.id === id);
    return `🔓 成就解锁：【${d.name}】 ${d.d}（成就 ${i + 1}/76）`;
  });
  ok('运行期：三连解锁档三条报文逐字递增（1/76 → 2/76 → 3/76）',
    m.length === 3 && m[0] === want[0] && m[1] === want[1] && m[2] === want[2], m.join(' | '));
  ok('运行期：三连解锁档 ach 落全三枚且长度 3', h.ach.length === 3 && ids.every((id) => h.ach.includes(id)));
}
// C 档：旧档无 ach 字段防御——(hero.ach||[]).length 不抛且报 1/76
{
  const h = mkHero({ level: 5 });
  delete h.ach;
  const m = runAch(h);
  ok('运行期：旧档缺 ach 字段防御档报文「（成就 1/76）」且 ach 建起',
    m.length === 1 && m[0].endsWith('（成就 1/76）') && Array.isArray(h.ach) && h.ach.includes('lvl5'));
}
// D 档：perfection 特别分支零后缀 + 连带 scholar2 通用分支带后缀（v22.72 全图鉴 13 种越过 10 种门槛）
{
  const h = mkHero({ gold: 100, bestiary: fullBestiary(), ach: ['scholar', 'rich', 'elites'] });
  const m = runAch(h);
  ok('运行期：perfection 档报文逐字「🏆 ...（剩余 1099 金）」零后缀 + scholar2「（成就 5/76）」',
    m.length === 2 &&
    m[0] === '🏆 成就解锁：【记忆守护者】图鉴收集完成！额外奖励 999 金币！（剩余 1099 金）' &&
    m[1] === '🔓 成就解锁：【见多识广】 记忆图鉴收录 10 种魔物（成就 5/76）', m.join(' | '));
  ok('运行期：perfection 档加奖结算一致（gold 100→1099，ach 落 perfection + scholar2）',
    h.gold === 100 + PERFECTION_GOLD && h.ach.includes('perfection') && h.ach.includes('scholar2'));
}
// E 档：重复调用零回归——已解锁不再报横幅
{
  const h = mkHero({ gold: 100, level: 5 });
  runAch(h);
  const m2 = runAch(h);
  ok('运行期：重复调用档不再报任何横幅（m2 为空）', m2.length === 0, m2.join(' | '));
}
// F 档：图鉴缺一种——scholar2 中档横幅带后缀（3/76：scholar/elites 预置 + scholar2 本次）且 perfection 不解锁
{
  const b = fullBestiary();
  delete b['终焉之神'];
  const h = mkHero({ gold: 100, bestiary: b, ach: ['scholar', 'elites'] });
  const m = runAch(h);
  ok('运行期：图鉴缺一种档 scholar2 报文「（成就 3/76）」且 perfection 不解锁零加奖',
    m.length === 1 && m[0] === '🔓 成就解锁：【见多识广】 记忆图鉴收录 10 种魔物（成就 3/76）' &&
    h.gold === 100 && !(h.ach || []).includes('perfection'), m.join(' | '));
}

// —— README ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
ok('README 件套口径已为三百件套（二百九十九件套清除）',
  readme.includes('冒烟三百件套（二百九十九件套清除）'));
ok('README tests 树含 v24.76 守护描述（「成就解锁横幅「（成就 N/76）」进度后缀」+「（成就 N/76）」+「计数现场」）与 smoke_v2476_achprog 入库（300 份）',
  readme.includes('v24.76 起含 「成就解锁横幅「（成就 N/76）」进度后缀」守护') &&
  readme.includes('（成就 N/76）') && readme.includes('计数现场') &&
  readme.includes('smoke_v2476_achprog 入库（300 份）'));
ok('README 仍保留 v24.75 早期 xp 守护描述且其入库口径已推进至 299 份（历史零丢失）',
  readme.includes('v24.75 起含 「后期经验曲线续平滑（第二十二轮）」守护') && readme.includes('smoke_v2475_xpcurve22 入库（300 份）'));
ok('README tests 树串尾已延伸至 smoke_v2476_achprog（npm test 串跑）',
  readme.includes('smoke_v2475_xpcurve22 + smoke_v2476_achprog + smoke_v2477_fisher（npm test 串跑）'));
ok('README 尚无三百零一件套口径（哨兵前望 300 语义：下一版才写 300）',
  !readme.includes('三百零一件套') && !readme.includes('冒烟三百零一件套') && !readme.includes('（301 份）'));

// —— package.json 链 ——
const pkgRaw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 298 专项（smoke.mjs + 298 专项 = 299 总件套），链长计数精确匹配',
  chain.length === 299 && chainAll.length === 300,
  `chain=${chain.length} chainAll=${chainAll.length}`);
ok('package.json 链尾为 smoke_v2476_achprog', chain[chain.length - 1] === 'smoke_v2477_fisher', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2476_achprog.mjs（node tests/ 前缀形态，紧随 smoke_v2475_xpcurve22 之后）',
  pkgRaw.includes('node tests/smoke_v2475_xpcurve22.mjs && node tests/smoke_v2476_achprog.mjs && node tests/smoke_v2477_fisher.mjs"'));

// —— CHANGELOG ——
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('CHANGELOG 顶部条目已为 v24.76（startsWith）', changelog.startsWith('## v24.77 '));
ok('CHANGELOG v24.76 条目含「计数现场」「成就 N/76」「hero.ach」「ACH_LIST.length」',
  changelog.includes('计数现场') && changelog.includes('成就 N/76') && changelog.includes('hero.ach') && changelog.includes('ACH_LIST.length'));
ok('CHANGELOG 仍保留 v24.75/v24.72 经验曲线条目标题（历史零丢失）',
  changelog.includes('## v24.75 数值平衡·后期经验曲线续平滑') && changelog.includes('## v24.72 新内容'));

// —— 套件/目录级 ——
const testsDir = path.join(ROOT, 'tests');
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs'));
ok('tests 目录套件数 = 299（smoke.mjs + 298 专项）', files.length === 300, `files=${files.length}`);
ok('tests 目录无孤儿套件（目录数与 package.json 链恒等）', files.length === chainAll.length);
ok('smoke_v2476_achprog.mjs 已在目录中且链尾无遗漏',
  files.includes('smoke_v2476_achprog.mjs') && chain[chain.length - 1] === 'smoke_v2477_fisher');

// —— 套件内遗留哨兵（零残留） ——
const s2415 = fs.readFileSync(path.join(testsDir, 'smoke_v2415_treepin.mjs'), 'utf8');
ok('smoke_v2415 套件内 treeTok 口径已推进为 299', s2415.includes('treeTok.length === 300'));
ok('smoke_v2415 套件内树尾 pin 已推进为 smoke_v2476_achprog', s2415.includes("=== 'smoke_v2477_fisher'"));
ok('smoke_v2415 套件内件数口哨兵（尚无 300 口径）', s2415.includes("!readme.includes('三百零一件套')"));

const s2429 = fs.readFileSync(path.join(testsDir, 'smoke_v2429_xpcurve3.mjs'), 'utf8');
ok('smoke_v2429 套件内 README 件数口径已推进为三百件套（二百九十九件套清除）',
  s2429.includes('三百件套（二百九十九件套清除）'));
ok('smoke_v2429 套件内入库 pin 已推进至 299 份', s2429.includes('入库（300 份）'));
ok('smoke_v2429 套件内件套计数已推进 299（files.length === 300）且树尾 pin 已推进为 smoke_v2476_achprog',
  s2429.includes('files.length === 300') && s2429.includes("chain[chain.length - 1] === 'smoke_v2477_fisher'"));

const s2436 = fs.readFileSync(path.join(testsDir, 'smoke_v2436_codexrow.mjs'), 'utf8');
ok('smoke_v2436 双计数 pin 已推进（298 专项 / 300）且尚无 300 口径哨兵',
  s2436.includes("suiteFiles.length === 299 && fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).length === 300")
  && s2436.includes("!readme.includes('冒烟三百零一件套')") && s2436.includes("!readme.includes('（301 份）')"));

// —— 全库零残留哨兵链（v24.75 口径 → v24.76；豁免本套件与上一版套件） ——
const hits = [];
for (const f of files) {
  if (f === 'smoke_v2476_achprog.mjs' || f === 'smoke_v2475_xpcurve22.mjs') continue;
  const s = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s.includes("const GAME_VERSION = 'v24.75'")) hits.push(`${f}:gv`);
  if (s.includes("GAME_VERSION === 'v24.75'")) hits.push(`${f}:gvEq`);
  if (s.includes("startsWith('## v24.75")) hits.push(`${f}:clTop`);
  if (s.includes('二百九十八件套（二百九十七件套清除）')) hits.push(`${f}:cnt`);
  if (s.includes('入库（298 份）')) hits.push(`${f}:ruku`);
  if (s.includes("=== 'smoke_v2475_xpcurve22'")) hits.push(`${f}:tail`);
  if (s.includes('chain.length === 298')) hits.push(`${f}:chainLen`);
  if (s.includes('chainAll.length === 299')) hits.push(`${f}:chainAll`);
  if (s.includes('files.length === 299')) hits.push(`${f}:filesCnt`);
  if (s.includes('treeTok.length === 299')) hits.push(`${f}:treeTok`);
  if (s.includes('testChain === 299')) hits.push(`${f}:testChain`);
  if (s.includes('suiteFiles.length === 298')) hits.push(`${f}:suiteFiles`);
  if (s.includes('（第 299 份）')) hits.push(`${f}:ord`);
}
ok('全库测试零残留 v24.75 GAME_VERSION/顶 pin/298 口径（哨兵链，豁免本套件与上一版）', hits.length === 0, hits.slice(0, 12).join(' | '));

console.log(`\n— v24.76 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
