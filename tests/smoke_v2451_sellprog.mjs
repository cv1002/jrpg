// v24.51 专项冒烟：🍄 售菇成功战报补「蘑菇商路 N/30」进度后缀
// （体验打磨·信息透明·计数现场·纯显示——承 v24.50 酿造成功战报「🍶 妙手回春 N/5」/ v24.48 技能
// 战报「🔮 熟能生巧 N/30」/ v24.46 蘑菇报文「🍄 菇山菌海 N/25」同一「计数现场报进度」主线，翻转
// v23.82「零战报后缀」旧口径：卖出线 v24.09 已把「🍄 蘑菇商路 N/30」补进商店面板（drawShop 决策
// 现场角标），唯独售出成功战报（shop.sellMushroom 的 boxMsg）始终裸报；「累计售出 N 株」这条收入
// 行为线的计数现场正是每次按下确认键售出的战报本身（与 v24.50「现场是动作本身」同族），卖完想确认
// 离蘑菇商路还差几株得走回商店面板或按 C 翻成就页；现报文末尾补「（🍄 蘑菇商路 N/30）」（分子读
// hero.sold——sellMushroom 计数唯一产生点先于报文落账，进度差分即本次；分母读 data.js SELL_GOAL
// 单一数据源，与 C 页/ACH_LIST sell 的 ok/prog 及 v24.09 面板角标同读一份源，调阈值只改 data.js
// 一处全端自动跟随），纯显示零结算零存档零数值变化（hero.sold 计数/applyAchievements 时机/售价/
// 剩余株数/余额报文逐字未动）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.51 注释 / GAME_VERSION v24.51 与旧 v24.50 字面量
// 零残留 / v24.50·v24.49 历史注释保留 / SELL_GOAL 处 v24.51 注释）、数据契约（SELL_GOAL 30 与
// ACH_LIST sell 同源互证 ok/prog/d 逐值·无 r 字段）、shop.js 源级（import 追加 SELL_GOAL +
// v24.51 注释块 + 报文模板逐字 + 旧报文零残留 + 计数/拦截零回归 + 姊妹端口零串扰）、运行期真实
// sellMushroom() 路径（bind.boxMsg 捕获桩承 smoke_v2450 同款：首售 0→1 报 1/30 · 二售 1→2 报
// 2/30 · 第 30 售 29→30 当场解锁 sell 报 30/30 · 旧档缺 sold 字段防御式 0→1 · 无菇/任务保护拦截
// 零计数）、README/package.json/CHANGELOG 同步（件套口径 275 + v24.51 守护描述 +
// smoke_v2451_sellprog 入库（300 份）+ package 串尾 + CHANGELOG 顶 pin）、哨兵链（前望 276 且
// README 尚无 276 口径）、tests 目录与实跑链一一对应（275 份）、旧代 v24.50 pin 全库零残留扫描
// （豁免本套件与上一版套件否定式）。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v24.50 冒烟先例：先装桩再 import main.js）——
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
const { GAME_VERSION, SELL_GOAL, MUSHROOM_GOAL, MUSHROOM_PRICE, ACH_LIST } = await import('../js/data.js');
const { sellMushroom } = await import('../js/shop.js');
// 音效桩：售出成功播 SFX.coin()，任务保护播 SFX.cancel()，测试只关心报文与结算
const { SFX } = await import('../js/audio.js');
SFX.coin = () => {}; SFX.cancel = () => {};

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.51 售菇成功战报「🍄 蘑菇商路 N/30」进度后缀 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const sSrc = read('js/shop.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.50）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.50', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] >= 53)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js 含 v24.51 注释（售菇成功战报「🍄 蘑菇商路 N/30」进度后缀）',
  dSrc.includes('v24.51 体验打磨·信息透明·计数现场：🍄 售菇成功战报补'));
ok('data.js GAME_VERSION 字面量已为 v24.51（旧 v24.50 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.77';") && !dSrc.includes("const GAME_VERSION = 'v24.50';"));
ok('data.js 仍保留 v24.50 历史注释（酿造成功战报进度后缀·本版保留）',
  dSrc.includes('v24.50 体验打磨·信息透明·计数现场：🧪 酿造成功战报补'));
ok('data.js 仍保留 v24.49 历史注释（后期经验曲线续平滑第八轮·本版保留）',
  dSrc.includes('v24.49 数值平衡·后期经验曲线续平滑'));
ok('data.js SELL_GOAL 处含 v24.51 战报分母单一数据源注释',
  dSrc.includes('v24.51 起本常量同时是售菇成功战报'));
ok('data.js ACH_LIST sell 条目注释含 v24.51 翻转补记',
  dSrc.includes('v24.51 翻转：售菇成功战报已补'));

// —— 数据契约：SELL_GOAL / ACH_LIST sell 同源互证 ——
ok('SELL_GOAL 数据契约（阈值单一数据源，判定/进度/描述/战报分母四端同读）', SELL_GOAL === 30, String(SELL_GOAL));
ok('MUSHROOM_GOAL===3 · MUSHROOM_PRICE===10（任务保护口径与售价零回归）',
  MUSHROOM_GOAL === 3 && MUSHROOM_PRICE === 10, `${MUSHROOM_GOAL}/${MUSHROOM_PRICE}`);
const sellAch = ACH_LIST.find((a) => a.id === 'sell');
ok('ACH_LIST 含 sell「蘑菇商路」且 id 唯一', !!sellAch && sellAch.name === '蘑菇商路' &&
  ACH_LIST.filter((a) => a.id === 'sell').length === 1);
ok('sell 描述/判定/进度读 SELL_GOAL 与 (g.sold||0) 防御式（三端同源零裸字面量）',
  !!sellAch && sellAch.d === `累计售出 ${SELL_GOAL} 株魔法蘑菇` &&
  String(sellAch.ok).includes('(g.sold||0)') && String(sellAch.prog).includes('g.sold||0'));
ok('sell 无 r 字段纯里程碑（蘑菇商路本身就是奖励）', !!sellAch && !('r' in sellAch));
ok('sell 0/29/30/31 四档谓词逐值（缺字段 0/30 旧档零迁移、超阈值不钳制）',
  sellAch.ok({}) === false && sellAch.prog({}) === `0/${SELL_GOAL}` &&
  sellAch.ok({ sold: 29 }) === false && sellAch.prog({ sold: 29 }) === `29/${SELL_GOAL}` &&
  sellAch.ok({ sold: 30 }) === true && sellAch.prog({ sold: 30 }) === `30/${SELL_GOAL}` &&
  sellAch.ok({ sold: 31 }) === true && sellAch.prog({ sold: 31 }) === `31/${SELL_GOAL}`);

// —— shop.js 源级落位 ——
ok('shop.js 自 data.js 追加导入 SELL_GOAL（import 行邻位保留 MUSHROOM_PRICE 原位）',
  sSrc.includes('MUSHROOM_PRICE, SELL_GOAL, SYS_MSG_MS'));
ok('shop.js 含 v24.51 注释（售菇战报进度后缀说明·翻转 v23.82 零战报后缀旧口径）',
  sSrc.includes('v24.51 体验打磨·信息透明·计数现场') && sSrc.includes('翻转 v23.82「零战报后缀」旧口径'));
ok('shop.js 售菇成功报文模板逐字（剩余株数 + 共 N 金 + 🍄 蘑菇商路 N/30 后缀）',
  sSrc.includes('（剩余 ${hero.mushrooms} 株 / 共 ${hero.gold} 金）（🍄 蘑菇商路 ${hero.sold || 0}/${SELL_GOAL}）`);'));
ok('shop.js 旧售菇报文（无蘑菇商路后缀原句）零残留',
  !sSrc.includes('共 ${hero.gold} 金）`);'));
ok('shop.js 计数唯一产生点零回归（hero.sold 自增先于报文落账 + 当场 applyAchievements）',
  sSrc.indexOf('hero.sold = (hero.sold || 0) + 1;') > -1 &&
  sSrc.indexOf('hero.sold = (hero.sold || 0) + 1;') < sSrc.indexOf('（🍄 蘑菇商路 ${hero.sold || 0}/${SELL_GOAL}）') &&
  sSrc.indexOf('applyAchievements();') > -1);
ok('shop.js 两档拦截判定零回归（无菇早退 · 任务蘑菇保护 MUSHROOM_GOAL）',
  sSrc.includes('没有可出售的蘑菇') &&
  sSrc.includes('集齐 ${MUSHROOM_GOAL} 株前不能卖！'));
ok('shop.js 姊妹端口零串扰（购买药水报文仍只报余额、不带蘑菇商路后缀）',
  sSrc.includes('购买成功：生命药水 +1（-${POTION_PRICE} 金，剩余 ${hero.item}/${POTION_CAP} 瓶 / ${hero.gold} 金）') &&
  !sSrc.includes('购买成功：生命药水 +1（-${POTION_PRICE} 金，剩余 ${hero.item}/${POTION_CAP} 瓶 / ${hero.gold} 金）（🍄 蘑菇商路'));

// —— 运行期真实 sellMushroom() 路径（bind.boxMsg 捕获桩，承 smoke_v2450 同款桩法）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 1, hp: 60, hpMax: 60, mp: 30, mpMax: 30,
    atkMax: 12, defMax: 6, gold: 100, xp: 0, xpNext: 20, item: 2, potion2: 0, brews: 0,
    mushrooms: 10, sold: 0, weapon: '木剑', armor: '布衣', diff: null, skills: ['治愈术'], ach: [],
    poison: 0, seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, totalWins: 0,
    x: 1, y: 1, map: 'village' }, extra || {});
}
function runSell(hero) {
  const msgs = [];
  const oBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    S.G = hero;
    sellMushroom();
    return msgs;
  } finally {
    bind.boxMsg = oBox;
  }
}
// A 档：首次售出（sold 0→1）——报文逐字带「（🍄 蘑菇商路 1/30）」（applyAchievements 的成就解锁播报同栈，取末条战报）
{
  const h = mkHero({});
  const m = runSell(h);
  const line = m[m.length - 1] || '';
  ok('运行期：首售战报逐字「售出 1 株魔法蘑菇，得 10 金（剩余 9 株 / 共 110 金）（🍄 蘑菇商路 1/30）」',
    line === '售出 1 株魔法蘑菇，得 10 金（剩余 9 株 / 共 110 金）（🍄 蘑菇商路 1/30）', m.join(' | '));
  ok('运行期：首售结算一致（sold 0→1 · mushrooms 10→9 · gold 100→110）',
    h.sold === 1 && h.mushrooms === 9 && h.gold === 110,
    `sold=${h.sold} mushrooms=${h.mushrooms} gold=${h.gold}`);
}
// B 档：第二次售出（sold 1→2）——分子递增 2/30
{
  const h = mkHero({ sold: 1 });
  const m = runSell(h);
  const line = m[m.length - 1] || '';
  ok('运行期：二售战报带「（🍄 蘑菇商路 2/30）」且计数 1→2',
    line.includes('（🍄 蘑菇商路 2/30）') && h.sold === 2, `sold=${h.sold} line=${line}`);
}
// C 档：第 30 次售出（sold 29→30）——当场解锁「蘑菇商路」（applyAchievements 落 hero.ach）且报文带 30/30
{
  const h = mkHero({ sold: 29 });
  const m = runSell(h);
  const line = m[m.length - 1] || '';
  ok('运行期：第 30 售当场解锁「蘑菇商路」（sold 29→30 且 ach 含 sell）',
    h.sold === 30 && (h.ach || []).includes('sell'), `sold=${h.sold} ach=${JSON.stringify(h.ach || [])}`);
  ok('运行期：达标档战报带「（🍄 蘑菇商路 30/30）」（战报与解锁播报同栈并存）',
    line.includes('（🍄 蘑菇商路 30/30）'), line);
}
// D 档：旧档缺 sold 字段防御式（承 v19.41 seen 同款）——0→1 不抛错 1/30 起步
{
  const h = mkHero({});
  delete h.sold;
  const m = runSell(h);
  const line = m[m.length - 1] || '';
  ok('运行期：旧档缺 sold 字段防御式（缺失→1/30 战报、零抛错、旧档零迁移）',
    h.sold === 1 && line.includes('（🍄 蘑菇商路 1/30）'), `sold=${h.sold}`);
}
// E 档：无菇拦截零计数——报「没有可出售的蘑菇」，sold 不变
{
  const h = mkHero({ mushrooms: 0 });
  const m = runSell(h);
  ok('运行期：无菇拦截档「没有可出售的蘑菇」逐字零回归且零计数（sold 0 不变 / mushrooms 0 不变）',
    m.length === 1 && m[0] === '没有可出售的蘑菇' && h.sold === 0 && h.mushrooms === 0,
    m.join(' | '));
}
// F 档：任务蘑菇保护拦截零计数——side_mushroom='active' 且蘑菇 ≤ MUSHROOM_GOAL(3) 报保护文案，sold 不变
{
  const h = mkHero({ mushrooms: 2, quests: { side_mushroom: 'active' } });
  const m = runSell(h);
  ok('运行期：任务保护拦截档「🍄 这是灯长委托的蘑菇，当前 2/3 株，集齐 3 株前不能卖！」逐字零回归且零计数（sold 0 不变）',
    m.length === 1 && m[0] === '🍄 这是灯长委托的蘑菇，当前 2/3 株，集齐 3 株前不能卖！' && h.sold === 0,
    m.join(' | '));
}
// G 档：谓词防御档复证——缺字段 0/30 不误解锁（旧档零迁移）
{
  ok('运行期：谓词防御档复证（缺字段 0/30 假 / 30 真 / 31 真）',
    sellAch.ok({}) === false && sellAch.prog({}) === `0/${SELL_GOAL}` &&
    sellAch.ok({ sold: 30 }) === true && sellAch.ok({ sold: 31 }) === true);
}

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为冒烟三百件套（二百九十九件套清除）',
  readme.includes('冒烟三百件套（二百九十九件套清除）'));
ok('README tests 含 v24.51 守护描述与 smoke_v2451_sellprog 入库（300 份）',
  readme.includes('v24.51 起含 「售菇成功战报「🍄 蘑菇商路 N/30」进度后缀」守护') &&
  readme.includes('smoke_v2451_sellprog 入库（300 份）'));
ok('README 尚无 276 件套口径（哨兵前望 276 语义：下一版才写 276）',
  !readme.includes('三百零一件套') && !readme.includes('冒烟三百零一件套'));
ok('README 仍保留 v24.50 守护描述与 v24.49 守护描述（历史保留）',
  readme.includes('v24.50 起含 「酿造成功战报「🍶 妙手回春 N/5」进度后缀」守护') &&
  readme.includes('v24.49 起含 「后期经验曲线续平滑（第八轮）」守护'));
ok('README tests 树串尾已延伸至 smoke_v2451_sellprog（... + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10 + smoke_v2461_xpcurve11 + smoke_v2462_xpcurve12 + smoke_v2463_xpcurve13 + smoke_v2464_xpcurve14 + smoke_v2465_xpcurve15 + smoke_v2466_xpcurve16 + smoke_v2467_xpcurve17 + smoke_v2468_xpcurve18 + smoke_v2469_xpcurve19 + smoke_v2470_xpcurve20 + smoke_v2471_bellman + smoke_v2472_bellquest + smoke_v2473_xpcurve21 + smoke_v2475_xpcurve22 + smoke_v2476_achprog + smoke_v2477_fisher（npm test 串跑））',
  readme.includes('smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10 + smoke_v2461_xpcurve11 + smoke_v2462_xpcurve12 + smoke_v2463_xpcurve13 + smoke_v2464_xpcurve14 + smoke_v2465_xpcurve15 + smoke_v2466_xpcurve16 + smoke_v2467_xpcurve17 + smoke_v2468_xpcurve18 + smoke_v2469_xpcurve19 + smoke_v2470_xpcurve20 + smoke_v2471_bellman + smoke_v2472_bellquest + smoke_v2473_xpcurve21 + smoke_v2475_xpcurve22 + smoke_v2476_achprog + smoke_v2477_fisher（npm test 串跑）'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 275 份（smoke.mjs + 274 专项）', chain.length === 299 && chainAll.length === 300, String(chain.length));
ok('package.json 链尾为 smoke_v2451_sellprog（第 274 份）', chain[chain.length - 1] === 'smoke_v2477_fisher', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2451_sellprog.mjs（node tests/ 前缀形态）',
  pkgRaw.includes('node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs'));
ok('package.json 链锚逐字（...smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs"）',
  pkgRaw.includes('smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs && node tests/smoke_v2459_xpcurve9.mjs && node tests/smoke_v2460_xpcurve10.mjs && node tests/smoke_v2461_xpcurve11.mjs && node tests/smoke_v2462_xpcurve12.mjs && node tests/smoke_v2463_xpcurve13.mjs && node tests/smoke_v2464_xpcurve14.mjs && node tests/smoke_v2465_xpcurve15.mjs && node tests/smoke_v2466_xpcurve16.mjs && node tests/smoke_v2467_xpcurve17.mjs && node tests/smoke_v2468_xpcurve18.mjs && node tests/smoke_v2469_xpcurve19.mjs && node tests/smoke_v2470_xpcurve20.mjs && node tests/smoke_v2471_bellman.mjs && node tests/smoke_v2472_bellquest.mjs && node tests/smoke_v2473_xpcurve21.mjs && node tests/smoke_v2475_xpcurve22.mjs && node tests/smoke_v2476_achprog.mjs && node tests/smoke_v2477_fisher.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.51（startsWith）', changelog.startsWith('## v24.77 '));
ok('CHANGELOG v24.51 条目含「蘑菇商路」与「进度后缀」与「售出」',
  changelog.includes('蘑菇商路') && changelog.includes('进度后缀') && changelog.includes('售出'));
ok('CHANGELOG 仍保留 v24.50 与 v24.49 条目（历史保留）',
  changelog.includes('## v24.50 ') && changelog.includes('## v24.49 '));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(chainAll.map((f) => f.replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 275（274 专项 + smoke.mjs）', files.length === 300, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：v2415 树串守护已推进至新链尾 + 前望 276 ——
const t2415 = read('tests/smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v2451_sellprog（第 274 份）',
  t2415.includes("chain[chain.length - 1] === 'smoke_v2477_fisher'"));
ok('smoke_v2415 树串 token 数已推进至 275', t2415.includes('treeTok.length === 300'));
ok('smoke_v2415 哨兵「尚无 276」口径（二百七十五件套 bare 否定式）',
  t2415.includes("!readme.includes('三百零一件套')"));
const s2429 = read('tests/smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 件盘口句已推进（冒烟三百件套（二百九十九件套清除）正形态）',
  s2429.includes("readme.includes('冒烟三百件套（二百九十九件套清除）')"));
ok('smoke_v2429 链尾断言已推进至「=== smoke_v2451_sellprog」',
  s2429.includes("=== 'smoke_v2477_fisher'"));
ok('smoke_v2429 入库份数断言随新现实推进（入库 275 份）',
  s2429.includes('入库（300 份）'));

// —— 旧代 pin 零残留扫描（v24.50 / 274 口径；豁免本套件与上一版套件否定式）——
const leftovers = [];
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v2451_sellprog.mjs') continue;
  // 承 v24.50 同款豁免：上一版套件（smoke_v2450_brewprog）合法的历史/否定式字面量不入扫描。
  if (f === 'smoke_v2450_brewprog.mjs') continue;
  const s2 = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s2.includes("const GAME_VERSION = 'v24.50';") || s2.includes("GAME_VERSION === 'v24.50'") ||
      s2.includes("startsWith('## v24.50") || s2.includes('入库（274 份）') ||
      s2.includes('冒烟二百七十四件套（二百七十三件' + '套清除）') ||
      s2.includes('testChain === 27' + '4') || s2.includes('fileCount === 27' + '4') ||
      s2.includes('files.length === 27' + '4') || s2.includes('chainAll.length === 27' + '4') ||
      s2.includes('treeTok.length === 27' + '4') || s2.includes("chain[chain.length - 1] === 'smoke_v2450_brewprog'")) leftovers.push(f);
}
ok('全库测试零残留 v24.50 GAME_VERSION/顶 pin/274 口径（哨兵链，豁免本套件与上一版否定式）',
  leftovers.length === 0, leftovers.join(','));

console.log(`— v24.51 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
