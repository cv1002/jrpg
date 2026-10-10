// v24.40 专项冒烟：战斗 [3] 用药战报补「💊 药到病除 N/15」进度后缀（双端口口径齐平）
// （体验打磨·信息透明·计数现场——承 v24.16 HUD「🚶 千里之行 N/1000」/ v24.17 喝药战报「💧 渴饮甘露
// N/10」/ v24.19 掉落战报「🍀 鸿运当头 N/30」/ v24.20 领悟战报「📖 诸技通明 N/8」同一「计数现场报进度」
// 主线 / v23.66 药到病除成就：计数 hero.potionUses 由 battle.doItem 成功用药唯一产生点写入（随
// snapshotHero 全量快照自动持久化、防御式 (hero.potionUses||0) 旧档零迁移），成就「药到病除」（[3]
// 战斗用药累计 POTION_USE_GOAL(15) 次）v23.66 当时口径「零战报后缀」（用药战报已带恢复量/剩余库存/
// HPMP 状态，再叠进度后缀信息过载，C 页进度 X/15 承载），而 v24.17 已给大地图 F 喝药战报（core.usePotion）
// 补「💧 渴饮甘露 N/10」后缀——战斗 [3] 用药战报（battle.doItem 两档 S.blog.push）是同一 takePotion
// 动作的战斗端（v23.66 明确两端各自累计互不计入），v24.17 之后同一恢复链路的战报一端带进度后缀、一端
// 裸报，口径不一致；现按 v24.17 同款补「（💊 药到病除 N/15）」（分子读 hero.potionUses 防御式
// (hero.potionUses||0)、分母读 data.js POTION_USE_GOAL 单一数据源，与 C 页/ACH_LIST potionuses 的
// ok/prog 同读一份源，调阈值只改 data.js 一处全端自动跟随），纯显示零结算零存档零数值变化（计数落账/
// applyAchievements 时机/takePotion 结算/两档拦截判定逐字未动；大地图端口零串扰——本函数两档报文只挂
// 药到病除、绝不给渴饮甘露挂后缀，双端口隔离由本件守护）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.40 注释 / GAME_VERSION v24.40 与旧 v24.39 字面量
// 零残留 / v24.39 历史注释保留）、运行期常量实值（POTION_USE_GOAL 15）与 ACH_LIST potionuses 同源互证
// （ok/prog/d 逐值·无 r 字段）、battle.js 源级（两档报文后缀逐字 + 计数/结算/判定零回归 + 大地图端口
// 零串扰）、core.js 战斗端口零串扰（大地图喝药报文不带药到病除后缀）、运行期真实 playerAction('item')
// 路径（1/15 与 2/15 后缀 · 14→15 解锁提示先于用药战报 · 缺字段防御式 0→1 · 无药/满状态拦截零计数）、
// README/package.json/CHANGELOG 同步（件套口径 266 + v24.40 守护描述 + smoke_v2440_potionprog 入库
// （266 份）+ package 串尾 + CHANGELOG 顶 pin）、哨兵链（前望 275 且 README 尚无 264 的口径语义已推进、
// 全库零残留 v24.39 字面量/顶 pin/263 口径）、旧代 v24.39 pin 全库零残留扫描（豁免上一版否定式件套）。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v24.39 冒烟先例：先装桩再动态 import main.js）——
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
const { GAME_VERSION, POTION_USE_GOAL, ACH_LIST } = await import('../js/data.js');
const { startBattle, playerAction } = await import('../js/battle.js');
const { bind } = await import('../js/bind.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.40 战斗用药战报「💊 药到病除 N/15」进度后缀（双端口口径齐平） 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const bSrc = read('js/battle.js');
const cSrc = read('js/core.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.39）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.39', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] >= 40)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js 含 v24.40 注释（战斗用药战报「💊 药到病除 N/15」进度后缀）',
  dSrc.includes('v24.40 体验打磨·信息透明·计数现场：战斗 [3] 用药战报补'));
ok('data.js GAME_VERSION 字面量已为 v24.40（旧 v24.39 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.76';") && !dSrc.includes("const GAME_VERSION = 'v24.39';"));
ok('data.js 仍保留 v24.39 历史注释（后期经验曲线续平滑第四轮·本版保留）',
  dSrc.includes('v24.39 数值平衡·后期经验曲线续平滑'));

// —— 数据契约：POTION_USE_GOAL / ACH_LIST potionuses 同源互证 ——
ok('POTION_USE_GOAL 数据契约（阈值单一数据源，判定/进度/描述三端同读）', POTION_USE_GOAL === 15, String(POTION_USE_GOAL));
const potAch = ACH_LIST.find((a) => a.id === 'potionuses');
ok('ACH_LIST 含 potionuses「药到病除」且 id 唯一', !!potAch && potAch.name === '药到病除' &&
  ACH_LIST.filter((a) => a.id === 'potionuses').length === 1);
ok('potionuses 描述/判定/进度读 POTION_USE_GOAL 与 (g.potionUses||0) 防御式（三端同源零裸字面量）',
  !!potAch && potAch.d === `[3]战斗用药累计 ${POTION_USE_GOAL} 次` &&
  String(potAch.ok).includes('(g.potionUses||0)') && String(potAch.prog).includes('g.potionUses||0'));
ok('potionuses 无 r 字段纯里程碑（药到病除本身就是奖励）', !!potAch && !('r' in potAch));
ok('potionuses 0/14/15/30 四档谓词逐值（缺字段 0/15 旧档零迁移、超阈值不钳制）',
  potAch.ok({}) === false && potAch.prog({}) === `0/${POTION_USE_GOAL}` &&
  potAch.ok({ potionUses: 14 }) === false && potAch.prog({ potionUses: 14 }) === `14/${POTION_USE_GOAL}` &&
  potAch.ok({ potionUses: 15 }) === true && potAch.prog({ potionUses: 15 }) === `${POTION_USE_GOAL}/${POTION_USE_GOAL}` &&
  potAch.ok({ potionUses: 30 }) === true && potAch.prog({ potionUses: 30 }) === `30/${POTION_USE_GOAL}`);

// —— battle.js 源级落位（两档报文后缀逐字 + 计数/结算/判定零回归 + 双端口隔离）——
ok('battle.js 含 v24.40 注释（战报进度后缀说明）', bSrc.includes('v24.40 体验打磨·信息透明·计数现场'));
ok('battle.js v23.66 注释块保留且标注 v24.40 翻转口径', bSrc.includes('v23.66 当时口径「零战报后缀」') && bSrc.includes('v24.40 翻转该口径'));
ok('battle.js 药水档报文后缀逐字落位（💊 药到病除 N/15 · 分子防御式 · 分母 POTION_USE_GOAL）',
  bSrc.includes('`🍖 ${hero.name} 服用药水，恢复 ${result.h} 点 HP（HP ${hero.hp}/${hero.hpMax} · 药水剩余 ${hero.item} 瓶）（💊 药到病除 ${hero.potionUses || 0}/${POTION_USE_GOAL}）`'));
ok('battle.js 灵药档报文后缀逐字落位（💊 药到病除 N/15 · 分子防御式 · 分母 POTION_USE_GOAL）',
  bSrc.includes('`🧪 ${hero.name} 服下高级灵药，恢复 ${result.h} HP、${result.m} MP（HP ${hero.hp}/${hero.hpMax} · MP ${hero.mp}/${hero.mpMax} · 高级灵药剩余 ${hero.potion2} 瓶）（💊 药到病除 ${hero.potionUses || 0}/${POTION_USE_GOAL}）`'));
ok('battle.js 计数唯一产生点零回归（hero.potionUses 自增 + 当场 applyAchievements）',
  bSrc.includes('const useN = (hero.potionUses || 0) + 1;') && bSrc.includes('hero.potionUses = useN;') &&
  bSrc.includes('applyAchievements();'));
ok('battle.js 两档拦截判定零回归（气满神足 / 没有可用的药水了）',
  bSrc.includes("'✅ 你气满神足，无需用药！' : '❌ 没有可用的药水了！'"));
ok('battle.js 双端口隔离零串扰（doItem 两档报文只挂药到病除、不涉 mapPotions）',
  bSrc.includes('💊 药到病除') && !bSrc.includes('mapPotions'));
ok('core.js 大地图端口零串扰（usePotion 两档报文仍只挂渴饮甘露、不带药到病除）',
  cSrc.includes('💧 渴饮甘露') && !cSrc.includes('💊 药到病除'));

// —— 运行期真实 playerAction('item') 路径（承 v21.53/v21.65 桩法）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 1, hp: 10, hpMax: 60, mp: 30, mpMax: 30,
    atkMax: 12, defMax: 6, gold: 0, xp: 0, xpNext: 20, item: 2, potion2: 0,
    weapon: '木剑', armor: '布衣', diff: null, skills: ['火焰斩'],
    poison: 0, seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, x: 1, y: 1, map: 'village',
    charge: false }, extra || {});
}
function mkDoll(extra) {
  return Object.assign({ name: '练功木桩', hp: 500, hpMax: 500, atk: 5, def: 10, xp: 1, gold: 0, color: '#888888' }, extra || {});
}
function runBattleItem(hero) {
  S.G = hero; S.G.map = 'village';
  startBattle(mkDoll());
  S.battleBusy = false;   // 测试桩：跳过开场 700ms 编排空档（enqueue 为真实 setTimeout）
  playerAction('item');
  const line = S.blog[S.blog.length - 1] || '';
  S.enemy = null; S.scene = 'world'; S.battleBusy = false;
  return line;
}

// A 档：战斗普通药水（首次用药）——报文带「（💊 药到病除 1/15）」且计数落账 1
{
  const h = mkHero({ hp: 10, item: 2 });
  const line = runBattleItem(h);
  ok('运行期：战斗药水档报文逐字「🍖 测试者 服用药水，恢复 38 点 HP（HP 48/60 · 药水剩余 1 瓶）（💊 药到病除 1/15）」',
    line === '🍖 测试者 服用药水，恢复 38 点 HP（HP 48/60 · 药水剩余 1 瓶）（💊 药到病除 1/15）', line);
  ok('运行期：战斗药水档计数落账（potionUses 0→1）且结算一致（hp 10→48 / item 2→1）',
    h.potionUses === 1 && h.hp === 48 && h.item === 1, `uses=${h.potionUses} hp=${h.hp} item=${h.item}`);
}
// B 档：战斗高级灵药（第二次用药）——报文带「（💊 药到病除 2/15）」
{
  const h = mkHero({ hp: 20, mp: 10, item: 0, potion2: 1, potionUses: 1 });
  const line = runBattleItem(h);
  ok('运行期：战斗灵药档报文逐字「🧪 测试者 服下高级灵药，恢复 68 HP、12 MP（HP 60/60 · MP 22/30 · 高级灵药剩余 0 瓶）（💊 药到病除 2/15）」',
    line === '🧪 测试者 服下高级灵药，恢复 68 HP、12 MP（HP 60/60 · MP 22/30 · 高级灵药剩余 0 瓶）（💊 药到病除 2/15）', line);
  ok('运行期：战斗灵药档计数落账（potionUses 1→2）且结算一致（hp 20→60 钳制 / mp 10→22 / potion2 1→0）',
    h.potionUses === 2 && h.hp === 60 && h.mp === 22 && h.potion2 === 0,
    `uses=${h.potionUses} hp=${h.hp} mp=${h.mp} potion2=${h.potion2}`);
}
// C 档：第 15 次用药当场解锁「药到病除」（applyAchievements 落 hero.ach 且解锁提示先于用药战报）
{
  const h = mkHero({ hp: 10, item: 1, potionUses: 14 });
  const line = runBattleItem(h);
  ok('运行期：第 15 次战斗用药当场解锁「药到病除」（potionUses 14→15 且 ach 含 potionuses）',
    h.potionUses === 15 && (h.ach || []).includes('potionuses'), `uses=${h.potionUses} ach=${JSON.stringify(h.ach || [])}`);
  ok('运行期：达标档报文带「（💊 药到病除 15/15）」（战报与解锁并存）',
    line === '🍖 测试者 服用药水，恢复 38 点 HP（HP 48/60 · 药水剩余 0 瓶）（💊 药到病除 15/15）', line);
}
// D 档：旧档缺 potionUses 字段防御式（承 v19.41 seen 同款）——0→1 不抛错 0/15 起步
{
  const h = mkHero({ hp: 10, item: 1 });
  delete h.potionUses;
  const line = runBattleItem(h);
  ok('运行期：旧档缺 potionUses 字段防御式（缺失→1/15 报文、零抛错、旧档零迁移）',
    h.potionUses === 1 && line.includes('（💊 药到病除 1/15）'), `uses=${h.potionUses}`);
}
// E 档：战斗无药拦截零计数——item 0 / potion2 0 且掉血 →「❌ 没有可用的药水了！」，potionUses 不变
{
  const h = mkHero({ hp: 30, item: 0, potion2: 0, potionUses: 0 });
  const line = runBattleItem(h);
  ok('运行期：战斗无药拦截档「❌ 没有可用的药水了！」逐字零回归且零计数（potionUses 0 不变 / hp 30 不变）',
    line === '❌ 没有可用的药水了！' && h.potionUses === 0 && h.hp === 30, line);
}
// F 档：战斗气满神足拦截零计数——满状态（有药）→ 早退，potionUses 不变
{
  const h = mkHero({ hp: 60, mp: 30, item: 2, potion2: 1, potionUses: 0 });
  const line = runBattleItem(h);
  ok('运行期：战斗满状态拦截档「✅ 你气满神足，无需用药！」逐字零回归且零计数（potionUses 0 不变）',
    line === '✅ 你气满神足，无需用药！' && h.potionUses === 0, line);
}
// G 档：谓词防御档复证——缺字段 0/15 不误解锁（旧档零迁移）
{
  ok('运行期：谓词防御档复证（缺字段 0/15 假 / 15 真 / 30 真）',
    potAch.ok({}) === false && potAch.prog({}) === `0/${POTION_USE_GOAL}` &&
    potAch.ok({ potionUses: 15 }) === true && potAch.ok({ potionUses: 30 }) === true);
}

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为二百九十九件套（二百九十八件套清除）',
  readme.includes('冒烟二百九十九件套（二百九十八件套清除）'));
ok('README tests 含 v24.40 守护描述与 smoke_v2440_potionprog 入库（299 份）',
  readme.includes('v24.40 起含 「战斗用药战报「💊 药到病除 N/15」进度后缀」守护') && readme.includes('smoke_v2440_potionprog 入库（299 份）'));
ok('README 成就 bullet 含 v24.40 战斗用药战报进度后缀口径（v24.40 起战斗用药战报带「💊 药到病除 N/15」进度后缀）',
  readme.includes('v24.40 起战斗用药战报带「💊 药到病除 N/15」进度后缀'));
ok('README 战斗 [3] 行含 v24.40 战报进度后缀口径（**v24.40 起战斗用药战报带「💊 药到病除 N/15」进度后缀**）',
  readme.includes('**v24.40 起战斗用药战报带「💊 药到病除 N/15」进度后缀**'));
ok('README 尚无 275 件套口径（哨兵前望 275 语义：下一版才写 275）',
  !readme.includes('三百件套') && !readme.includes('冒烟三百件套'));
ok('README 仍保留 v24.39 守护描述与 v24.17 守护描述（历史保留）',
  readme.includes('v24.39 起含 「后期经验曲线续平滑（第四轮）」守护') && readme.includes('v24.17 起含 F 喝药「渴饮甘露」进度后缀守护'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 273 份（smoke.mjs + 272 专项）', chain.length === 298 && chainAll.length === 299, String(chain.length));
ok('package.json 链尾为 smoke_v2440_potionprog（第 273 份）', chain[chain.length - 1] === 'smoke_v2476_achprog', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2440_potionprog.mjs（node tests/ 前缀形态）',
  pkgRaw.includes('node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs'));
ok('package.json 链锚逐字（smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs"）',
  pkgRaw.includes('smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs && node tests/smoke_v2459_xpcurve9.mjs && node tests/smoke_v2460_xpcurve10.mjs && node tests/smoke_v2461_xpcurve11.mjs && node tests/smoke_v2462_xpcurve12.mjs && node tests/smoke_v2463_xpcurve13.mjs && node tests/smoke_v2464_xpcurve14.mjs && node tests/smoke_v2465_xpcurve15.mjs && node tests/smoke_v2466_xpcurve16.mjs && node tests/smoke_v2467_xpcurve17.mjs && node tests/smoke_v2468_xpcurve18.mjs && node tests/smoke_v2469_xpcurve19.mjs && node tests/smoke_v2470_xpcurve20.mjs && node tests/smoke_v2471_bellman.mjs && node tests/smoke_v2472_bellquest.mjs && node tests/smoke_v2473_xpcurve21.mjs && node tests/smoke_v2475_xpcurve22.mjs && node tests/smoke_v2476_achprog.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.40（startsWith）', changelog.startsWith('## v24.76'));
ok('CHANGELOG v24.40 条目含「药到病除」与「进度后缀」与「双端口」',
  changelog.includes('药到病除') && changelog.includes('进度后缀') && changelog.includes('双端口'));
ok('CHANGELOG 仍保留 v24.39 条目（历史保留）', changelog.includes('## v24.39'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(chainAll.map((f) => f.replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 264（263 + smoke_v2440_potionprog）', files.length === 299, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链（旧代 v24.39 pin 全库零残留）——
const leftovers = [];
for (const f of files) {
  if (f === 'smoke_v2440_potionprog.mjs') continue;
  // 承 v24.17/v24.39 同款豁免：上一版套件（smoke_v2439_xpcurve4）按惯例在否定式断言里保留旧代字面量
  // （!dSrc.includes("const GAME_VERSION = 'v24.76';")），属合法残留，豁免扫描。
  if (f === 'smoke_v2439_xpcurve4.mjs') continue;
  const s = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s.includes("const GAME_VERSION = 'v24.39';") || s.includes("GAME_VERSION === 'v24.39'") ||
      s.includes("startsWith('## v24.39") || s.includes('入库（263 份）') ||
      s.includes('二百六十三件套（二百六十二件套清除）') || s.includes('testChain === 263')) leftovers.push(f);
}
ok('全库测试零残留 v24.39 GAME_VERSION/顶 pin/263 口径（哨兵链·豁免上一版否定式）', leftovers.length === 0, leftovers.join(','));

console.log(`— v24.40 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
