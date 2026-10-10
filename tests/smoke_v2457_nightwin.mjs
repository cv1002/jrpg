// v24.57 专项冒烟：🏆 夜间胜利战报补「🌙 提灯夜行 N/10」进度后缀
// （体验打磨·信息透明·计数现场·纯显示——承 v24.56 酿造「💸 一掷千金 N/1000」/ v24.55 住店
// 「💸 一掷千金 N/1000」/ v24.54 商店购买「💸 一掷千金 N/1000」同一「计数现场报进度」主线，翻转
// v23.91「零战报后缀」旧口径）：相位线（提灯夜行=夜间战胜 NIGHT_WIN_GOAL(10) 场，计数 hero.nightWins
// 由 battle.winBattle 全游唯一胜利结算点写入、防御式旧档零迁移）的 live 窗口此前只有战斗画面右上角
// 相位标（v24.14，战斗场景内 chrome），胜利结算行本身裸报——夜里打赢的当场，结算行已带余额/驱雾百战/
// 金玉满堂三口径，唯独「这仗算不算夜胜」要抬头看画布角落（与 v24.50「面板是决策现场、战报是结算
// 现场」同族）；现普通胜利战报夜间分支末尾补「（🌙 提灯夜行 N/10）」（分子读上方已落账 hero.nightWins
// ——nightWins 计数唯一产生点先于报文落账、进度差分即本场；分母读 data.js NIGHT_WIN_GOAL 单一数据源，
// 与 C 页/ACH_LIST nightwins 的 ok/prog 及 v24.14 战斗画面相位标同读一份源，调阈值只改 data.js 一处
// 全端自动跟随；仅夜间胜仗报——白天胜仗与无字回廊（nightWinNow=false 且不计数，「被忘掉的地方没有
// 晨昏」与 HUD 🌑 恒暗同口径）零噪音零后缀），夜间判定与计数同处一提（nightWinNow 常量一次求值两用：
// 计数 + 报文开关），纯显示零结算零存档零数值变化（nightWins 计数/applyAchievements 时机/升级分支/
// 掉落/碎片/支线进度战报逐字未动）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.57 注释 / GAME_VERSION v24.57 与旧 v24.56 字面量
// 零残留 / v24.56 历史注释保留 / NIGHT_WIN_GOAL 处 v24.57 注释）、数据契约（NIGHT_WIN_GOAL 10 与
// ACH_LIST nightwins 同源互证 ok/prog/d 逐值·无 r 字段 / dayPhase 四相位逐值）、battle.js 源级
// （import 行头部追加 NIGHT_WIN_GOAL·尾部 dayPhase, QUESTS 邻接 pin 零拆散 + nightWinNow 常量
// 落位 + 胜利战报模板夜间条件后缀逐字 + 🌙 后缀计数恰 1 + 计数行先于报文 + v2422/v2427 姊妹
// pin 兼容）、运行期真实 winBattle 四档（夜间首胜 1/10 · 白天胜仗零后缀零计数 · 无字回廊夜战
// 零计数零后缀 · 第 10 场夜胜当场解锁 nightwins 报 10/10——winBattle 先报文后 applyAchievements
// 解锁报文在结算行之后）、README/package.json/CHANGELOG 同步（件套口径 281 + v24.57 守护描述 +
// smoke_v2457_nightwin 入库（297 份）+ package 串尾 + CHANGELOG 顶 pin）、哨兵链（前望 282 且
// README 尚无 282 口径 + v2415/v2429 随新现实推进）、tests 目录与实跑链一一对应（281 份）、
// 旧代 v24.56 pin 全库零残留扫描（豁免本套件与 v2456 套件否定式；扫描码模式串一律拆拼接形态）。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v24.56 冒烟先例：先装桩再 import main.js）——
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
const { GAME_VERSION, NIGHT_WIN_GOAL, ACH_LIST, dayPhase, DAY_PHASE_S } = await import('../js/data.js');
const { winBattle } = await import('../js/battle.js');
// 音效桩：胜利号角/拾取双音等全部静音，测试只关心报文与结算
const { SFX } = await import('../js/audio.js');
for (const k of Object.keys(SFX)) SFX[k] = () => {};

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.57 夜间胜利战报「🌙 提灯夜行 N/10」进度后缀 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const bSrc = read('js/battle.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.56）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.56', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] >= 57)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js 含 v24.57 注释（夜间胜利战报「🌙 提灯夜行 N/10」进度后缀）',
  dSrc.includes('v24.57 体验打磨·信息透明·计数现场：🏆 夜间胜利战报补'));
ok('data.js GAME_VERSION 字面量已为 v24.57（旧 v24.56 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.74';") && !dSrc.includes('const GAME_VERSION = ' + "'v24.56';"));
ok('data.js 仍保留 v24.56 历史注释（酿造成功战报进度后缀·本版保留）',
  dSrc.includes('v24.56 体验打磨·信息透明·计数现场：🧪 酿造成功战报补'));
ok('data.js NIGHT_WIN_GOAL 处含 v24.57 胜利战报分母注释',
  dSrc.includes('v24.57 起夜间胜利战报（battle.js winBattle 普通胜利分支）同后缀收口'));

// —— 数据契约：NIGHT_WIN_GOAL / ACH_LIST nightwins 同源互证 ——
ok('NIGHT_WIN_GOAL 数据契约（阈值单一数据源，判定/进度/描述/战报分母四端同读）',
  NIGHT_WIN_GOAL === 10, String(NIGHT_WIN_GOAL));
ok('DAY_PHASE_S 契约（90 秒/档，四相位轮转与 v23.91 判定同源）', DAY_PHASE_S === 90, String(DAY_PHASE_S));
ok('dayPhase 四相位逐值（0 day · 90 dusk · 200 night · 270 dawn）',
  dayPhase(0) === 'day' && dayPhase(90) === 'dusk' && dayPhase(200) === 'night' && dayPhase(270) === 'dawn');
const nightAch = ACH_LIST.find((a) => a.id === 'nightwins');
ok('ACH_LIST 含 nightwins「提灯夜行」且 id 唯一', !!nightAch && nightAch.name === '提灯夜行' &&
  ACH_LIST.filter((a) => a.id === 'nightwins').length === 1);
ok('nightwins 描述/判定/进度读 NIGHT_WIN_GOAL 与 (g.nightWins||0) 防御式（三端同源零裸字面量）',
  !!nightAch && nightAch.d === `夜间战胜 ${NIGHT_WIN_GOAL} 场` &&
  String(nightAch.ok).includes('NIGHT_WIN_GOAL') && String(nightAch.prog).includes('NIGHT_WIN_GOAL'));
ok('nightwins 无 r 字段纯里程碑（提灯夜行本身就是奖励）', !!nightAch && !('r' in nightAch));
ok('nightwins 0/9/10/20 四档谓词逐值（缺字段 0/10 旧档零迁移、超阈值不钳制）',
  nightAch.ok({}) === false && nightAch.prog({}) === `0/${NIGHT_WIN_GOAL}` &&
  nightAch.ok({ nightWins: 9 }) === false && nightAch.prog({ nightWins: 9 }) === `9/${NIGHT_WIN_GOAL}` &&
  nightAch.ok({ nightWins: 10 }) === true && nightAch.prog({ nightWins: 10 }) === `${NIGHT_WIN_GOAL}/${NIGHT_WIN_GOAL}` &&
  nightAch.ok({ nightWins: 20 }) === true && nightAch.prog({ nightWins: 20 }) === `20/${NIGHT_WIN_GOAL}`);

// —— battle.js 源级落位 ——
ok('battle.js import 行头部追加 NIGHT_WIN_GOAL（data.js 既有导出，零新增模块依赖）',
  bSrc.includes('import { NIGHT_WIN_GOAL, RUSH_BOSSES,'));
ok('battle.js 既有 import 尾串邻接 pin 零拆散（dayPhase, QUESTS } from 逐字保留）',
  bSrc.includes('dayPhase, QUESTS } from'));
ok('battle.js nightWinNow 常量落位（一次求值两用：夜间判定 + 报文开关，含 gallery 恒暗排除）',
  bSrc.includes("const nightWinNow = curMap() !== 'gallery' && dayPhase(hero.time) === 'night';"));
ok('battle.js 胜利战报夜间条件后缀模板逐字（nightWinNow 三元 + 🌙 提灯夜行 N/10）',
  bSrc.includes('（🌙 提灯夜行 ${hero.nightWins || 0}/${NIGHT_WIN_GOAL}）') &&
  bSrc.includes("${nightWinNow ? `（🌙 提灯夜行 ${hero.nightWins || 0}/${NIGHT_WIN_GOAL}）` : ''}"));
ok('battle.js 🌙 提灯夜行后缀计数恰 1（胜利战报唯一，夜间条件分支）',
  (bSrc.match(/（🌙 提灯夜行 \$\{hero\.nightWins \|\| 0\}\/\$\{NIGHT_WIN_GOAL\}）/g) || []).length === 1);
ok('battle.js nightWins 计数行先于报文（计数唯一产生点先于 boxMsg 落账，进度差分即本场）',
  bSrc.indexOf('hero.nightWins = (hero.nightWins || 0) + 1;') > -1 &&
  bSrc.indexOf('hero.nightWins = (hero.nightWins || 0) + 1;') < bSrc.indexOf('（🌙 提灯夜行'));
ok('battle.js 含 v24.57 注释（翻转 v23.91 零战报后缀旧口径说明）',
  bSrc.includes('v24.57 体验打磨·信息透明·计数现场') && bSrc.includes('翻转 v23.91「零战报后缀」旧口径'));
ok('battle.js v2422 姊妹 pin 兼容（⚔️ 驱雾百战模板逐字保留为前段）',
  bSrc.includes('（⚔️ 驱雾百战 ${hero.totalWins || 0}/${HUNT2_GOAL}）'));
ok('battle.js v2427 姊妹 pin 兼容（💰 金玉满堂模板逐字保留为中段）',
  bSrc.includes('（💰 金玉满堂 ${Math.floor(hero.gold || 0)}/${RICH2_GOAL}）'));
ok('battle.js 报文仍以 🏆 胜利！获得 前缀开头（v19.80 原文案零回归）',
  bSrc.includes('`🏆 胜利！获得 ${enemy.gold} 金币、${enemy.xp} 经验'));

// —— 运行期：winBattle 真实路径 + bind.boxMsg 捕获（承 v24.22 捕桩法）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 5, hp: 80, hpMax: 80, mp: 30, mpMax: 30,
    atkMax: 30, defMax: 40, gold: 0, xp: 0, xpNext: 9999, item: 1, potion2: 0,
    weapon: '铁剑', armor: '皮甲', diff: null, skills: ['火焰斩'], ach: [],
    poison: 0, seen: { 骷髅兵: 1 }, bestiary: {}, chests: [], fragments: [], quests: {}, totalWins: 0,
    x: 1, y: 1, map: 'cave', time: 0, visited: ['village'], nightWins: 0 }, extra || {});
}
function mkFoe(extra) {
  return Object.assign({ name: '骷髅兵', hp: 0, hpMax: 26, atk: 8, def: 5, xp: 16, gold: 15, color: '#d9d3c0' }, extra || {});
}
function runWin(hero, enemy) {
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  const oldRand = Math.random;
  Math.random = () => 0.99;   // 关闭战斗掉落（rollDrop 38% 档），只验胜利战报
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
const winMsg = (msgs) => msgs.find((m) => m.includes('🏆 胜利！')) || '';

// A 档：夜间首胜（t=200 → 🌙 night，cave 非回廊）——结算行逐字带第四口径
{
  const h = mkHero({ time: 200 });
  const m = runWin(h, mkFoe());
  ok('运行期：夜间首胜战报逐字「…（剩余 15 金）（⚔️ 驱雾百战 1/100）（💰 金玉满堂 15/1500）（🌙 提灯夜行 1/10）」',
    winMsg(m) === '🏆 胜利！获得 15 金币、16 经验 · 距 Lv.6 升级还需 9983 经验（剩余 15 金）（⚔️ 驱雾百战 1/100）（💰 金玉满堂 15/1500）（🌙 提灯夜行 1/10）',
    m.join(' | '));
  ok('运行期：夜间首胜结算一致（nightWins 0→1 · totalWins 0→1 · gold 0→15 · xp 0→16）',
    h.nightWins === 1 && h.totalWins === 1 && h.gold === 15 && h.xp === 16,
    `nightWins=${h.nightWins} totalWins=${h.totalWins} gold=${h.gold} xp=${h.xp}`);
  ok('运行期：夜间首胜未解锁 nightwins（1/10 未达阈值·ach 无 nightwins）',
    !(h.ach || []).includes('nightwins'), JSON.stringify(h.ach || []));
}
// B 档：白天胜仗（t=0 → ☀️ day）——零后缀零计数，与 v24.56 前 rendering 逐字一致
{
  const h = mkHero({ time: 0 });
  const m = runWin(h, mkFoe());
  ok('运行期：白天胜仗战报零夜间后缀（与 v24.56 前渲染逐字一致，仅三口径）',
    winMsg(m) === '🏆 胜利！获得 15 金币、16 经验 · 距 Lv.6 升级还需 9983 经验（剩余 15 金）（⚔️ 驱雾百战 1/100）（💰 金玉满堂 15/1500）',
    m.join(' | '));
  ok('运行期：白天胜仗 nightWins 零计数（夜战口径不打折）', h.nightWins === 0, String(h.nightWins));
}
// C 档：无字回廊夜战（map=gallery · t=200）——gallery 恒暗排除，零计数零后缀
{
  const h = mkHero({ map: 'gallery', time: 200 });
  const m = runWin(h, mkFoe());
  ok('运行期：无字回廊夜战战报零夜间后缀（「被忘掉的地方没有晨昏」与 HUD 🌑 恒暗同口径）',
    winMsg(m).includes('（💰 金玉满堂 15/1500）') && !winMsg(m).includes('提灯夜行'), m.join(' | '));
  ok('运行期：无字回廊夜战 nightWins 零计数', h.nightWins === 0, String(h.nightWins));
}
// D 档：累计第 10 场夜胜当场解锁（nightWins 9→10）——winBattle 先报文后 applyAchievements，
// 解锁报文在结算行之后（与消费端口「先解锁后报文」顺序相反，v23.91 通路零改动）
{
  const h = mkHero({ time: 200, nightWins: 9 });
  const m = runWin(h, mkFoe());
  ok('运行期：第 10 场夜胜战报带「（🌙 提灯夜行 10/10）」',
    winMsg(m).includes(`（🌙 提灯夜行 ${NIGHT_WIN_GOAL}/${NIGHT_WIN_GOAL}）`), m.join(' | '));
  ok('运行期：第 10 场夜胜当场解锁「提灯夜行」（ach 含 nightwins·解锁报文在结算行之后）',
    m.some((x) => x.includes('🔓 成就解锁：【提灯夜行】')) && (h.ach || []).includes('nightwins') &&
    m.findIndex((x) => x.includes('🔓 成就解锁：【提灯夜行】')) > m.findIndex((x) => x.includes('🏆 胜利！')),
    m.join(' | ') + ` ach=${JSON.stringify(h.ach || [])}`);
}
// E 档：中档累计（nightWins 6→7）——进度差分即本场
{
  const h = mkHero({ time: 200, nightWins: 6 });
  const m = runWin(h, mkFoe());
  ok('运行期：第 7 场夜胜战报带「（🌙 提灯夜行 7/10）」（分子读已落账 hero.nightWins）',
    winMsg(m).includes('（🌙 提灯夜行 7/' + NIGHT_WIN_GOAL + '）'), m.join(' | '));
}

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为冒烟二百九十七件套（二百九十六件套清除）',
  readme.includes('冒烟二百九十七件套（二百九十六件套清除）'));
ok('README tests 含 v24.57 守护描述与 smoke_v2457_nightwin 入库（297 份）',
  readme.includes('v24.57 起含 「夜间胜利战报「🌙 提灯夜行 N/10」进度后缀」守护') &&
  readme.includes('smoke_v2457_nightwin 入库（297 份）'));
ok('README 尚无 282 件套口径（哨兵前望 282 语义：下一版才写 282）',
  !readme.includes('二百九十八件套') && !readme.includes('冒烟二百九十八件套'));
ok('README 仍保留 v24.56 守护描述（历史保留）',
  readme.includes('v24.56 起含 「酿造成功战报「💸 一掷千金 N/1000」进度后缀」守护'));
ok('README tests 树串尾已延伸至 smoke_v2457_nightwin（... + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10 + smoke_v2461_xpcurve11 + smoke_v2462_xpcurve12 + smoke_v2463_xpcurve13 + smoke_v2464_xpcurve14 + smoke_v2465_xpcurve15 + smoke_v2466_xpcurve16 + smoke_v2467_xpcurve17 + smoke_v2468_xpcurve18 + smoke_v2469_xpcurve19 + smoke_v2470_xpcurve20 + smoke_v2471_bellman + smoke_v2472_bellquest + smoke_v2473_xpcurve21（npm test 串跑））',
  readme.includes('smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10 + smoke_v2461_xpcurve11 + smoke_v2462_xpcurve12 + smoke_v2463_xpcurve13 + smoke_v2464_xpcurve14 + smoke_v2465_xpcurve15 + smoke_v2466_xpcurve16 + smoke_v2467_xpcurve17 + smoke_v2468_xpcurve18 + smoke_v2469_xpcurve19 + smoke_v2470_xpcurve20 + smoke_v2471_bellman + smoke_v2472_bellquest + smoke_v2473_xpcurve21（npm test 串跑）'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 293 份（smoke.mjs + 292 专项）', chain.length === 296 && chainAll.length === 297, String(chain.length));
ok('package.json 链尾为 smoke_v2457_nightwin（第 282 份）', chain[chain.length - 1] === 'smoke_v2473_xpcurve21', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2457_nightwin.mjs（node tests/ 前缀形态）',
  pkgRaw.includes('node tests/smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs && node tests/smoke_v2459_xpcurve9.mjs'));
ok('package.json 链锚逐字（...smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs"）',
  pkgRaw.includes('smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs && node tests/smoke_v2459_xpcurve9.mjs && node tests/smoke_v2460_xpcurve10.mjs && node tests/smoke_v2461_xpcurve11.mjs && node tests/smoke_v2462_xpcurve12.mjs && node tests/smoke_v2463_xpcurve13.mjs && node tests/smoke_v2464_xpcurve14.mjs && node tests/smoke_v2465_xpcurve15.mjs && node tests/smoke_v2466_xpcurve16.mjs && node tests/smoke_v2467_xpcurve17.mjs && node tests/smoke_v2468_xpcurve18.mjs && node tests/smoke_v2469_xpcurve19.mjs && node tests/smoke_v2470_xpcurve20.mjs && node tests/smoke_v2471_bellman.mjs && node tests/smoke_v2472_bellquest.mjs && node tests/smoke_v2473_xpcurve21.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.57（startsWith）', changelog.startsWith('## v24.74 '));
ok('CHANGELOG v24.57 条目含「提灯夜行」与「进度后缀」与「夜间」',
  changelog.includes('提灯夜行') && changelog.includes('进度后缀') && changelog.includes('夜间'));
ok('CHANGELOG 仍保留 v24.56 条目（历史保留）', changelog.includes('## v24.56 '));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(chainAll.map((f) => f.replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 281（280 专项 + smoke.mjs）', files.length === 297, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：v2415 树串守护已推进至新链尾 + 前望 282 ——
const t2415 = read('tests/smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v2457_nightwin（第 282 份）',
  t2415.includes("chain[chain.length - 1] === 'smoke_v2473_xpcurve21'"));
ok('smoke_v2415 树串 token 数已推进至 281', t2415.includes('treeTok.length === 297'));
ok('smoke_v2415 哨兵「尚无 282」口径（二百八十一件套 bare 否定式）',
  t2415.includes("!readme.includes('二百九十八件套')"));
const s2429 = read('tests/smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 件盘口句已推进（冒烟二百九十七件套（二百九十六件套清除）正形态）',
  s2429.includes("readme.includes('冒烟二百九十七件套（二百九十六件套清除）')"));
ok('smoke_v2429 链尾断言已推进至「=== smoke_v2457_nightwin」',
  s2429.includes("=== 'smoke_v2473_xpcurve21'"));
ok('smoke_v2429 入库份数断言随新现实推进（入库 281 份）',
  s2429.includes('入库（297 份）'));

// —— 旧代 pin 零残留扫描（v24.56 / 280 口径；豁免本套件否定式/历史字面量/v2456 套件）——
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v2457_nightwin.mjs' || f === 'smoke_v2456_brewspend.mjs') continue;
  const s2 = fs.readFileSync(path.join(testsDir, f), 'utf8');
  const hits = [];
  if (s2.includes('const GAME_VERSION = ' + "'v24.56';")) hits.push('gv');
  if (s2.includes("const GAME_VERSION = 'v24.56'")) hits.push('gvns');
  if (s2.includes('GAME_VERSION === ' + "'v24.56'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.56")) hits.push('cw');
  if (s2.includes('入库（28' + '0 份）')) hits.push('ruku');
  if (s2.includes('冒烟二百八十件套（二百七十' + '九件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 28' + '0')) hits.push('fl');
  if (s2.includes('chainAll.length === 28' + '0')) hits.push('cal');
  if (s2.includes('chain.length === 27' + '9')) hits.push('cl');
  if (s2.includes('treeTok.length === 28' + '0')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v2456_" + "brewspend'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.56 GAME_VERSION/顶 pin/280 口径（哨兵链，豁免本套件与 v2456 套件否定式）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.57 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
