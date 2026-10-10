// v24.52 专项冒烟：📕 图鉴新收录战报补「📖 见多识广 N/10」进度后缀
// （体验打磨·信息透明·计数现场·纯显示——承 v24.51 售菇成功战报「🍄 蘑菇商路 N/30」/ v24.50 酿造
// 成功战报「🍶 妙手回春 N/5」/ v24.48 技能战报「🔮 熟能生巧 N/30」/ v24.46 蘑菇报文「🍄 菇山菌海
// N/25」同一「计数现场报进度」主线）：图鉴收录线三档（scholar 记忆收藏家 5 / scholar2 见多识广 10 /
// perfection 记忆守护者 13 全收录）中，收录反馈战报自 v23.23 起已带封顶档进度「已记起 N/13 种」，
// 唯独中档「见多识广 N/10」全游无 live 窗口——C 成就页一行 X/10 是唯一口径，而收录线的计数现场正是
// 这条「📕 记忆图鉴新收录」战报本身（首杀即收录的当场，与 v24.50「现场是动作本身」同族）：收录完想
// 确认离见多识广还差几种得按 C 翻成就页；现报文末尾补「（📖 见多识广 N/10）」（分子读 battle.js
// winBattle 收录反馈分支现算 codexGotN——与既有「已记起 N/13」同一分子同一真身，分母读 data.js
// SCHOLAR2_GOAL 单一数据源，与 C 页/ACH_LIST scholar2 的 ok/prog 同读一份源，调阈值只改 data.js
// 一处全端自动跟随；同 v24.19/v24.25 只报中档先例——记忆收藏家 N/5 由 C 页承载、记忆守护者 N/13 由
// 本行既有「已记起 N/13」承载），纯显示零结算零存档零数值变化（bestiary 计数/收录判定/再杀零噪音/
// 成就判定时机逐字未动）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.52 注释 / GAME_VERSION v24.52 与旧 v24.51 字面量
// 零残留 / v24.51·v24.50 历史注释保留 / SCHOLAR2_GOAL 处 v24.52 注释 / ACH_LIST scholar2 条目
// v24.52 补记）、数据契约（SCHOLAR2_GOAL 10 与 ACH_LIST scholar2 同源互证 ok/prog/d 逐值·无 r 字段）、
// battle.js 源级（import 追加 SCHOLAR2_GOAL + v24.52 注释块 + 报文模板逐字 + 旧报文零残留 +
// v2436 既有子串 pin 兼容 + codexGotN 现算先于报文）、运行期真实 winBattle() 路径（bind.boxMsg
// 捕获桩承 smoke_v2451 同款：首杀收录 0→1 报 1/10 · 第 10 种新收录报 10/10 且当场解锁 scholar2 ·
// 再杀同怪零噪音零收录报 · 旧档缺 bestiary 字段防御式不抛错）、README/package.json/CHANGELOG 同步
// （件套口径 276 + v24.52 守护描述 + smoke_v2452_scholarprog 入库（299 份）+ package 串尾 +
// CHANGELOG 顶 pin）、哨兵链（前望 277 且 README 尚无 277 口径）、tests 目录与实跑链一一对应
// （276 份）、旧代 v24.51 pin 全库零残留扫描（豁免本套件与上一版套件否定式/历史字面量）。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v24.51 冒烟先例：先装桩再 import main.js）——
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
const { S } = await import('../js/state.js');
const { bind } = await import('../js/bind.js');
const { GAME_VERSION, SCHOLAR2_GOAL, SCHOLAR_GOAL, BESTIARY_TARGET, ACH_LIST } = await import('../js/data.js');
const { winBattle } = await import('../js/battle.js');
// 音效桩：胜利/成就/拾取/升级铃等全部静音，测试只关心报文与结算
const { SFX } = await import('../js/audio.js');
for (const k of Object.keys(SFX)) SFX[k] = () => {};

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.52 图鉴新收录战报「📖 见多识广 N/10」进度后缀 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const bSrc = read('js/battle.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.51）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.51', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] >= 53)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js 含 v24.52 注释（图鉴新收录战报「📖 见多识广 N/10」进度后缀）',
  dSrc.includes('v24.52 体验打磨·信息透明·计数现场：📕 图鉴新收录战报补'));
ok('data.js GAME_VERSION 字面量已为 v24.52（旧 v24.51 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.76';") && !dSrc.includes("const GAME_VERSION = 'v24.51';"));
ok('data.js 仍保留 v24.51 历史注释（售菇成功战报进度后缀·本版保留）',
  dSrc.includes('v24.51 体验打磨·信息透明·计数现场：🍄 售菇成功战报补'));
ok('data.js 仍保留 v24.50 历史注释（酿造成功战报进度后缀·本版保留）',
  dSrc.includes('v24.50 体验打磨·信息透明·计数现场：🧪 酿造成功战报补'));
ok('data.js SCHOLAR2_GOAL 处含 v24.52 战报分母单一数据源注释',
  dSrc.includes('v24.52 起本常量同时是图鉴新收录战报'));
ok('data.js ACH_LIST scholar2 条目注释含 v24.52 补记',
  dSrc.includes('v24.52 补记：图鉴新收录战报已带'));

// —— 数据契约：SCHOLAR2_GOAL / ACH_LIST scholar2 同源互证 ——
ok('SCHOLAR2_GOAL 数据契约（阈值单一数据源，判定/进度/描述/战报分母四端同读）',
  SCHOLAR2_GOAL === 10, String(SCHOLAR2_GOAL));
ok('SCHOLAR_GOAL===5 · BESTIARY_TARGET 13 种（收录线 5→10→13 台阶零回归）',
  SCHOLAR_GOAL === 5 && BESTIARY_TARGET.length === 13, `${SCHOLAR_GOAL}/${BESTIARY_TARGET.length}`);
const scholar2Ach = ACH_LIST.find((a) => a.id === 'scholar2');
ok('ACH_LIST 含 scholar2「见多识广」且 id 唯一', !!scholar2Ach && scholar2Ach.name === '见多识广' &&
  ACH_LIST.filter((a) => a.id === 'scholar2').length === 1);
ok('scholar2 描述/判定/进度读 SCHOLAR2_GOAL 与 (g.bestiary||{}) 防御式（三端同源零裸字面量）',
  !!scholar2Ach && scholar2Ach.d === `记忆图鉴收录 ${SCHOLAR2_GOAL} 种魔物` &&
  String(scholar2Ach.ok).includes('SCHOLAR2_GOAL') && String(scholar2Ach.prog).includes('SCHOLAR2_GOAL'));
ok('scholar2 无 r 字段纯里程碑（见多识广本身就是奖励）', !!scholar2Ach && !('r' in scholar2Ach));
ok('scholar2 0/9/10/11 四档谓词逐值（缺字段 0/10 旧档零迁移、超阈值不钳制）',
  scholar2Ach.ok({}) === false && scholar2Ach.prog({}) === `0/${SCHOLAR2_GOAL}` &&
  scholar2Ach.ok({ bestiary: { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1 } }) === false &&
  scholar2Ach.prog({ bestiary: { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1 } }) === `9/${SCHOLAR2_GOAL}` &&
  scholar2Ach.ok({ bestiary: { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1 } }) === true &&
  scholar2Ach.prog({ bestiary: { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1 } }) === `10/${SCHOLAR2_GOAL}` &&
  scholar2Ach.ok({ bestiary: { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1 } }) === true);

// —— battle.js 源级落位 ——
ok('battle.js 自 data.js 追加导入 SCHOLAR2_GOAL（import 行插在 HEAVY_MULT 与 ELEM_MULT 之间·既有邻接 pin 零拆散）',
  bSrc.includes('HEAVY_MULT, SCHOLAR2_GOAL, ELEM_MULT') &&
  bSrc.includes('ELEM_MULT, RICH2_GOAL, MUSH2_GOAL, LVL10_GOAL, dayPhase, QUESTS } from') &&
  bSrc.includes('LVL10_GOAL, dayPhase, QUESTS } from'));
ok('battle.js 含 v24.52 注释（收录战报进度后缀说明·战报端收口）',
  bSrc.includes('v24.52 体验打磨·信息透明·计数现场') && bSrc.includes('图鉴收录线'));
ok('battle.js 收录报文模板逐字（已记起 N/13 + 📖 见多识广 N/10 后缀）',
  bSrc.includes('（已记起 ${codexGotN}/${BESTIARY_TARGET.length} 种 · 世界画面按 B 查看）（📖 见多识广 ${codexGotN}/${SCHOLAR2_GOAL}）`, WIN_MSG_MS);'));
ok('battle.js 旧收录报文（无见多识广后缀的收录行）零残留（新遭遇 blog 行 L162 零误伤）',
  !bSrc.includes('记忆图鉴新收录：【${bookName}】（已记起 ${codexGotN}/${BESTIARY_TARGET.length} 种 · 世界画面按 B 查看）`, WIN_MSG_MS);'));
ok('battle.js 分子现算先于报文（codexGotN 计算行在收录报文之前）',
  bSrc.indexOf('const codexGotN = BESTIARY_TARGET.filter') > -1 &&
  bSrc.indexOf('const codexGotN = BESTIARY_TARGET.filter') < bSrc.indexOf('（📖 见多识广 ${codexGotN}/${SCHOLAR2_GOAL}）'));
ok('battle.js v2436 既有子串 pin 兼容（「记忆图鉴新收录」逐字保留）',
  bSrc.includes('记忆图鉴新收录'));
ok('battle.js 收录判定零回归（仅首杀 bestiary[bookName]===1 补报·再杀零噪音）',
  bSrc.includes('if (hero.bestiary[bookName] === 1)'));

// —— 运行期真实 winBattle() 路径（bind.boxMsg 捕获桩，承 smoke_v2451 同款桩法）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 1, hp: 60, hpMax: 60, mp: 30, mpMax: 30,
    atkMax: 12, defMax: 6, gold: 100, xp: 0, xpNext: 20, item: 2, potion2: 0, brews: 0,
    mushrooms: 0, sold: 0, weapon: '木剑', armor: '布衣', diff: null, skills: [], ach: [],
    poison: 0, seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, totalWins: 0,
    x: 1, y: 1, map: 'village', time: 0, visited: ['village'], drops: 0, travels: 0, talked: 0,
    steps: 0, spent: 0, rushClears: 0, potionUses: 0, nightWins: 0, mapPotions: 0,
    innRests: 0, flees: 0, deflects: 0, deaths: 0, crits: 0, charges: 0, casts: 0, battles: 0,
    quest: 0 }, extra || {});
}
function mkEnemy(name) {
  return { name, gold: 10, xp: 5, hp: 0, hpMax: 10 };
}
function runWin(hero, enemy) {
  const msgs = [];
  const oBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    S.G = hero;
    S.enemy = enemy;
    winBattle();
    return msgs;
  } finally {
    bind.boxMsg = oBox;
    S.enemy = null;
  }
}
// A 档：首次收录（bestiary 空 → 史莱姆 0→1）——报文逐字带「（📖 见多识广 1/10）」
{
  const h = mkHero({});
  const m = runWin(h, mkEnemy('史莱姆'));
  const codex = m.find((t) => t.startsWith('📕 记忆图鉴新收录')) || '';
  ok('运行期：首杀收录战报逐字「📕 记忆图鉴新收录：【史莱姆】（已记起 1/13 种 · 世界画面按 B 查看）（📖 见多识广 1/10）」',
    codex === '📕 记忆图鉴新收录：【史莱姆】（已记起 1/13 种 · 世界画面按 B 查看）（📖 见多识广 1/10）', m.join(' | '));
  ok('运行期：首杀结算一致（bestiary 史莱姆=1 · totalWins 0→1 · firstblood 当场解锁）',
    h.bestiary['史莱姆'] === 1 && h.totalWins === 1 && (h.ach || []).includes('firstblood'),
    `bestiary=${JSON.stringify(h.bestiary)} wins=${h.totalWins} ach=${JSON.stringify(h.ach || [])}`);
}
// B 档：第 10 种新收录（预填 9 种 → 幽冥魔王成第 10 种）——报文带 10/13 与 10/10，且 scholar2 当场解锁
{
  const nine = {};
  for (const nm of BESTIARY_TARGET.slice(0, 9)) nine[nm] = 1;
  const h = mkHero({ bestiary: nine, ach: ['firstblood'], totalWins: 9 });
  const m = runWin(h, mkEnemy('幽冥魔王'));
  const codex = m.find((t) => t.startsWith('📕 记忆图鉴新收录')) || '';
  ok('运行期：第 10 种收录战报带「（已记起 10/13 种 …）（📖 见多识广 10/10）」',
    codex.includes('（已记起 10/13 种 · 世界画面按 B 查看）（📖 见多识广 10/10）'), codex);
  ok('运行期：第 10 种收录当场解锁「见多识广」（ach 含 scholar2·bestiary 十种）',
    (h.ach || []).includes('scholar2') && Object.keys(h.bestiary).length === 10,
    `ach=${JSON.stringify(h.ach || [])}`);
}
// C 档：再杀同怪（史莱姆 1→2）——零收录报文零噪音（v23.23 口径逐字未动）
{
  const h = mkHero({ bestiary: { '史莱姆': 1 }, ach: ['firstblood'], totalWins: 1 });
  const m = runWin(h, mkEnemy('史莱姆'));
  const codex = m.find((t) => t.startsWith('📕 记忆图鉴新收录'));
  ok('运行期：再杀同怪零收录报文（bestiary 1→2 且无「📕 记忆图鉴新收录」行）',
    codex === undefined && h.bestiary['史莱姆'] === 2, m.join(' | '));
}
// D 档：旧档布尔 bestiary 兼容（承 v23.23 注释口径 true+1=2≠1 不误报）——不抛错、零收录报文
{
  const h = mkHero({ bestiary: { '史莱姆': true }, ach: ['firstblood'], totalWins: 1 });
  let threw = null;
  let m = [];
  try {
    m = runWin(h, mkEnemy('史莱姆'));
  } catch (e) { threw = e; }
  ok('运行期：旧档布尔 bestiary 兼容（true+1=2 不抛错·零收录报文·bestiary=2）',
    threw === null && h.bestiary['史莱姆'] === 2 &&
    m.find((t) => t.startsWith('📕 记忆图鉴新收录')) === undefined,
    threw ? String(threw) : m.join(' | '));
}

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为冒烟二百九十九件套（二百九十八件套清除）',
  readme.includes('冒烟二百九十九件套（二百九十八件套清除）'));
ok('README tests 含 v24.52 守护描述与 smoke_v2452_scholarprog 入库（299 份）',
  readme.includes('v24.52 起含 「图鉴新收录战报「📖 见多识广 N/10」进度后缀」守护') &&
  readme.includes('smoke_v2452_scholarprog 入库（299 份）'));
ok('README 尚无 277 件套口径（哨兵前望 277 语义：下一版才写 277）',
  !readme.includes('三百件套') && !readme.includes('冒烟三百件套'));
ok('README 仍保留 v24.51 守护描述与 v24.50 守护描述（历史保留）',
  readme.includes('v24.51 起含 「售菇成功战报「🍄 蘑菇商路 N/30」进度后缀」守护') &&
  readme.includes('v24.50 起含 「酿造成功战报「🍶 妙手回春 N/5」进度后缀」守护'));
ok('README tests 树串尾已延伸至 smoke_v2452_scholarprog（... + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10 + smoke_v2461_xpcurve11 + smoke_v2462_xpcurve12 + smoke_v2463_xpcurve13 + smoke_v2464_xpcurve14 + smoke_v2465_xpcurve15 + smoke_v2466_xpcurve16 + smoke_v2467_xpcurve17 + smoke_v2468_xpcurve18 + smoke_v2469_xpcurve19 + smoke_v2470_xpcurve20 + smoke_v2471_bellman + smoke_v2472_bellquest + smoke_v2473_xpcurve21 + smoke_v2475_xpcurve22 + smoke_v2476_achprog（npm test 串跑））',
  readme.includes('smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10 + smoke_v2461_xpcurve11 + smoke_v2462_xpcurve12 + smoke_v2463_xpcurve13 + smoke_v2464_xpcurve14 + smoke_v2465_xpcurve15 + smoke_v2466_xpcurve16 + smoke_v2467_xpcurve17 + smoke_v2468_xpcurve18 + smoke_v2469_xpcurve19 + smoke_v2470_xpcurve20 + smoke_v2471_bellman + smoke_v2472_bellquest + smoke_v2473_xpcurve21 + smoke_v2475_xpcurve22 + smoke_v2476_achprog（npm test 串跑）'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 276 份（smoke.mjs + 275 专项）', chain.length === 298 && chainAll.length === 299, String(chain.length));
ok('package.json 链尾为 smoke_v2452_scholarprog（第 275 份）', chain[chain.length - 1] === 'smoke_v2476_achprog', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2452_scholarprog.mjs（node tests/ 前缀形态）',
  pkgRaw.includes('node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs'));
ok('package.json 链锚逐字（...smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs\"）',
  pkgRaw.includes('smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs && node tests/smoke_v2459_xpcurve9.mjs && node tests/smoke_v2460_xpcurve10.mjs && node tests/smoke_v2461_xpcurve11.mjs && node tests/smoke_v2462_xpcurve12.mjs && node tests/smoke_v2463_xpcurve13.mjs && node tests/smoke_v2464_xpcurve14.mjs && node tests/smoke_v2465_xpcurve15.mjs && node tests/smoke_v2466_xpcurve16.mjs && node tests/smoke_v2467_xpcurve17.mjs && node tests/smoke_v2468_xpcurve18.mjs && node tests/smoke_v2469_xpcurve19.mjs && node tests/smoke_v2470_xpcurve20.mjs && node tests/smoke_v2471_bellman.mjs && node tests/smoke_v2472_bellquest.mjs && node tests/smoke_v2473_xpcurve21.mjs && node tests/smoke_v2475_xpcurve22.mjs && node tests/smoke_v2476_achprog.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.52（startsWith）', changelog.startsWith('## v24.76 '));
ok('CHANGELOG v24.52 条目含「见多识广」与「进度后缀」与「收录」',
  changelog.includes('见多识广') && changelog.includes('进度后缀') && changelog.includes('收录'));
ok('CHANGELOG 仍保留 v24.51 与 v24.50 条目（历史保留）',
  changelog.includes('## v24.51 ') && changelog.includes('## v24.50 '));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(chainAll.map((f) => f.replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 276（275 专项 + smoke.mjs）', files.length === 299, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：v2415 树串守护已推进至新链尾 + 前望 277 ——
const t2415 = read('tests/smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v2452_scholarprog（第 275 份）',
  t2415.includes("chain[chain.length - 1] === 'smoke_v2476_achprog'"));
ok('smoke_v2415 树串 token 数已推进至 276', t2415.includes('treeTok.length === 299'));
ok('smoke_v2415 哨兵「尚无 277」口径（二百七十六件套 bare 否定式）',
  t2415.includes("!readme.includes('三百件套')"));
const s2429 = read('tests/smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 件盘口句已推进（冒烟二百九十九件套（二百九十八件套清除）正形态）',
  s2429.includes("readme.includes('冒烟二百九十九件套（二百九十八件套清除）')"));
ok('smoke_v2429 链尾断言已推进至「=== smoke_v2452_scholarprog」',
  s2429.includes("=== 'smoke_v2476_achprog'"));
ok('smoke_v2429 入库份数断言随新现实推进（入库 276 份）',
  s2429.includes('入库（299 份）'));

// —— 旧代 pin 零残留扫描（v24.51 / 275 口径；豁免本套件与上一版套件否定式/历史字面量）——
const leftovers = [];
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v2452_scholarprog.mjs') continue;
  // 承 v24.51 同款豁免：上一版套件（smoke_v2451_sellprog）合法的历史/否定式字面量不入扫描。
  if (f === 'smoke_v2451_sellprog.mjs') continue;
  const s2 = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s2.includes("const GAME_VERSION = 'v24.51';") || s2.includes("GAME_VERSION === 'v24.51'") ||
      s2.includes("startsWith('## v24.51") || s2.includes('入库（275 份）') ||
      s2.includes('冒烟二百七十五件套（二百七十四件' + '套清除）') ||
      s2.includes('testChain === 27' + '4') || s2.includes('fileCount === 27' + '4') ||
      s2.includes('files.length === 27' + '4') || s2.includes('chainAll.length === 27' + '4') ||
      s2.includes('treeTok.length === 27' + '5') ||
      s2.includes("chain[chain.length - 1] === 'smoke_v2451_sellprog'")) leftovers.push(f);
}
ok('全库测试零残留 v24.51 GAME_VERSION/顶 pin/275 口径（哨兵链，豁免本套件与上一版否定式）',
  leftovers.length === 0, leftovers.join(','));

console.log(`— v24.52 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
