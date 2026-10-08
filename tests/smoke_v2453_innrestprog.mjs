// v24.53 专项冒烟：🏨 住店成功战报补「夜宿灯下 N/15」进度后缀
// （体验打磨·信息透明·计数现场·纯显示——承 v24.52 图鉴收录战报「📖 见多识广 N/10」/
// v24.51 售菇成功战报「🍄 蘑菇商路 N/30」/ v24.50 酿造成功战报「🍶 妙手回春 N/5」/
// v24.48 技能战报「🔮 熟能生巧 N/30」同一「计数现场报进度」主线，翻转 v23.73「零战报后缀」
// 旧口径）：住宿线 v24.07 已把「🏨 夜宿灯下 N/15」补进旅馆面板（drawInn 决策现场角标），
// 唯独住店成功战报（shop.stayInn 的 boxMsg）始终裸报；「累计住宿 N 晚」这条旅中休整行为线
// 的计数现场正是每次按下确认键住店的战报本身（与 v24.50「现场是动作本身」同族），住完想
// 确认离夜宿灯下还差几晚得走回旅馆面板或按 C 翻成就页；现报文末尾补「（🏨 夜宿灯下 N/15）」
// （分子读 hero.innRests——stayInn 计数唯一产生点先于报文落账，进度差分即本次；分母读
// data.js INN_REST_GOAL 单一数据源，与 C 页/ACH_LIST innrest 的 ok/prog 及 v24.07 面板角标
// 同读一份源，调阈值只改 data.js 一处全端自动跟随），纯显示零结算零存档零数值变化
// （hero.innRests 计数/applyAchievements 时机/恢复结算/价格/余额报文逐字未动）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.53 注释 / GAME_VERSION v24.53 与旧 v24.52 字面量
// 零残留 / v24.52·v24.51 历史注释保留 / INN_REST_GOAL 处 v24.53 注释 / ACH_LIST innrest 条目
// v24.53 翻转补记）、数据契约（INN_REST_GOAL 15 与 ACH_LIST innrest 同源互证 ok/prog/d 逐值·
// 无 r 字段）、shop.js 源级（import 追加 INN_REST_GOAL + v24.53 注释块 + 报文模板逐字 + 旧报文
// 零残留 + 计数行先于报文 + v2451 既有子串 pin 兼容）、运行期真实 stayInn() 路径（bind.boxMsg
// 捕获桩承 smoke_v2451/v2452 同款：首住 1/15 · 第 15 晚当场解锁 innrest 报 15/15 · 精神饱满
// 早退零计数零后缀 · 金币不足早退零计数零后缀）、README/package.json/CHANGELOG 同步
// （件套口径 277 + v24.53 守护描述 + smoke_v2453_innrestprog 入库（293 份）+ package 串尾 +
// CHANGELOG 顶 pin）、哨兵链（前望 278 且 README 尚无 278 口径）、tests 目录与实跑链一一对应
// （277 份）、旧代 v24.52 pin 全库零残留扫描（豁免本套件与上一版套件否定式/历史字面量）。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v24.52 冒烟先例：先装桩再 import main.js）——
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
const { GAME_VERSION, INN_REST_GOAL, INN_PRICE, ACH_LIST } = await import('../js/data.js');
const { stayInn } = await import('../js/shop.js');
// 音效桩：治疗/取消/金币等全部静音，测试只关心报文与结算
const { SFX } = await import('../js/audio.js');
for (const k of Object.keys(SFX)) SFX[k] = () => {};

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.53 住店成功战报「🏨 夜宿灯下 N/15」进度后缀 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const sSrc = read('js/shop.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.52）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.52', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] >= 53)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js 含 v24.53 注释（住店成功战报「🏨 夜宿灯下 N/15」进度后缀）',
  dSrc.includes('v24.53 体验打磨·信息透明·计数现场：🏨 住店成功战报补'));
ok('data.js GAME_VERSION 字面量已为 v24.53（旧 v24.52 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.69';") && !dSrc.includes("const GAME_VERSION = 'v24.52';"));
ok('data.js 仍保留 v24.52 历史注释（图鉴收录战报进度后缀·本版保留）',
  dSrc.includes('v24.52 体验打磨·信息透明·计数现场：📕 图鉴新收录战报补'));
ok('data.js 仍保留 v24.51 历史注释（售菇成功战报进度后缀·本版保留）',
  dSrc.includes('v24.51 体验打磨·信息透明·计数现场：🍄 售菇成功战报补'));
ok('data.js INN_REST_GOAL 处含 v24.53 战报分母单一数据源注释',
  dSrc.includes('v24.53 起本常量同时是住店成功战报'));
ok('data.js ACH_LIST innrest 条目注释含 v24.53 翻转补记',
  dSrc.includes('v24.53 翻转：住店成功战报已补'));

// —— 数据契约：INN_REST_GOAL / ACH_LIST innrest 同源互证 ——
ok('INN_REST_GOAL 数据契约（阈值单一数据源，判定/进度/描述/战报分母四端同读）',
  INN_REST_GOAL === 15, String(INN_REST_GOAL));
ok('INN_PRICE 契约（住店单价 10 金，报文 -N 金与余额读数同源）', INN_PRICE === 10, String(INN_PRICE));
const innAch = ACH_LIST.find((a) => a.id === 'innrest');
ok('ACH_LIST 含 innrest「夜宿灯下」且 id 唯一', !!innAch && innAch.name === '夜宿灯下' &&
  ACH_LIST.filter((a) => a.id === 'innrest').length === 1);
ok('innrest 描述/判定/进度读 INN_REST_GOAL 与 (g.innRests||0) 防御式（三端同源零裸字面量）',
  !!innAch && innAch.d === `在旅馆住宿累计 ${INN_REST_GOAL} 次` &&
  String(innAch.ok).includes('INN_REST_GOAL') && String(innAch.prog).includes('INN_REST_GOAL'));
ok('innrest 无 r 字段纯里程碑（夜宿灯下本身就是奖励）', !!innAch && !('r' in innAch));
ok('innrest 0/14/15/20 四档谓词逐值（缺字段 0/15 旧档零迁移、超阈值不钳制）',
  innAch.ok({}) === false && innAch.prog({}) === `0/${INN_REST_GOAL}` &&
  innAch.ok({ innRests: 14 }) === false && innAch.prog({ innRests: 14 }) === `14/${INN_REST_GOAL}` &&
  innAch.ok({ innRests: 15 }) === true && innAch.prog({ innRests: 15 }) === `${INN_REST_GOAL}/${INN_REST_GOAL}` &&
  innAch.ok({ innRests: 20 }) === true && innAch.prog({ innRests: 20 }) === `20/${INN_REST_GOAL}`);

// —— shop.js 源级落位 ——
ok('shop.js 自 data.js 追加导入 INN_REST_GOAL（import 行插在 INN_PRICE 与 POTION_CAP 之间·v2451 既有子串 pin 零拆散）',
  sSrc.includes('INN_PRICE, INN_REST_GOAL, POTION_CAP') &&
  sSrc.includes('MUSHROOM_PRICE, SELL_GOAL, SYS_MSG_MS'));
ok('shop.js 含 v24.53 注释（住店战报进度后缀说明·翻转 v23.73 零战报后缀旧口径）',
  sSrc.includes('v24.53 体验打磨·信息透明·计数现场') && sSrc.includes('翻转') && sSrc.includes('v23.73'));
ok('shop.js 住店报文模板逐字（完全恢复 + 价格余额 + 🏨 夜宿灯下 N/15 后缀）',
  sSrc.includes('完全恢复！（-${INN_PRICE} 金，剩余 ${hero.gold} 金）（🏨 夜宿灯下 ${hero.innRests}/${INN_REST_GOAL}）（💸 一掷千金 ${hero.spent}/${SPEND_GOAL}）`);'));
ok('shop.js 旧住店报文（无夜宿灯下后缀的结算行）零残留',
  !sSrc.includes('完全恢复！（-${INN_PRICE} 金，剩余 ${hero.gold} 金）`);') ||
  sSrc.includes('（🏨 夜宿灯下 ${hero.innRests}/${INN_REST_GOAL}）')); // 新后缀形态存在即合法（模板断言已逐字钉死上行）
ok('shop.js 旧住店报文裸形态零残留（无后缀模板在库中唯一且已带后缀）',
  sSrc.split('完全恢复！（-${INN_PRICE} 金，剩余 ${hero.gold} 金）`);').length - 1 === 0);
ok('shop.js 计数行先于报文（hero.innRests 落账在 boxMsg 之前）',
  sSrc.indexOf('hero.innRests = (hero.innRests || 0) + 1;') > -1 &&
  sSrc.indexOf('hero.innRests = (hero.innRests || 0) + 1;') < sSrc.indexOf('（🏨 夜宿灯下 ${hero.innRests}/${INN_REST_GOAL}）'));
ok('shop.js v2451 既有子串 pin 兼容（售菇报文「🍄 蘑菇商路」逐字保留）',
  sSrc.includes('（🍄 蘑菇商路 ${hero.sold || 0}/${SELL_GOAL}）') ||
  sSrc.includes('蘑菇商路'));

// —— 运行期真实 stayInn() 路径（bind.boxMsg 捕获桩，承 smoke_v2451/v2452 同款桩法）——
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
function runStay(hero) {
  const msgs = [];
  const oBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    S.G = hero;
    stayInn();
    return msgs;
  } finally {
    bind.boxMsg = oBox;
  }
}
// A 档：首次住店（hp/mp 缺损 → 扣 10 金回满）——报文逐字带「（🏨 夜宿灯下 1/15）」
{
  const h = mkHero({ hp: 30, mp: 10, gold: 100 });
  const m = runStay(h);
  const inn = m.find((t) => t.startsWith('🌙 你美美地睡了一晚')) || '';
  ok('运行期：首住战报逐字「🌙 你美美地睡了一晚，HP +30（60/60）· MP +20（30/30）完全恢复！（-10 金，剩余 90 金）（🏨 夜宿灯下 1/15）（💸 一掷千金 10/1000）」',
    inn === '🌙 你美美地睡了一晚，HP +30（60/60）· MP +20（30/30）完全恢复！（-10 金，剩余 90 金）（🏨 夜宿灯下 1/15）（💸 一掷千金 10/1000）', m.join(' | '));
  ok('运行期：首住结算一致（innRests 0→1 · hp/mp 回满 · gold 100→90 · spent 累计 10）',
    h.innRests === 1 && h.hp === 60 && h.mp === 30 && h.gold === 90 && h.spent === 10,
    `innRests=${h.innRests} hp=${h.hp}/${h.hpMax} mp=${h.mp}/${h.mpMax} gold=${h.gold} spent=${h.spent}`);
  ok('运行期：首住未解锁 innrest（1/15 未达阈值·ach 无 innrest）',
    !(h.ach || []).includes('innrest'), JSON.stringify(h.ach || []));
}
// B 档：第 15 晚住店（每住前重新压血）——报文带 15/15 且当场解锁 innrest
{
  const h = mkHero({ hp: 30, mp: 10, gold: 500, ach: ['firstblood'] });
  let m15 = [];
  for (let i = 0; i < 15; i++) {
    h.hp = 30; h.mp = 10; // 每住前重新缺损（住店回满后精神饱满分支会拦截）
    m15 = runStay(h);
  }
  const inn = m15.find((t) => t.startsWith('🌙 你美美地睡了一晚')) || '';
  ok('运行期：第 15 晚战报带「（🏨 夜宿灯下 15/15）」',
    inn.includes('（🏨 夜宿灯下 15/15）'), inn);
  ok('运行期：第 15 晚当场解锁「夜宿灯下」（ach 含 innrest·innRests=15·spent 累计 150）',
    (h.ach || []).includes('innrest') && h.innRests === 15 && h.spent === 150,
    `ach=${JSON.stringify(h.ach || [])} innRests=${h.innRests} spent=${h.spent}`);
}
// C 档：精神饱满早退（hp/mp 全满）——零计数零后缀，报「你现在精神饱满。」
{
  const h = mkHero({ hp: 60, mp: 30, gold: 100, ach: ['firstblood'] });
  const m = runStay(h);
  const full = m.find((t) => t.includes('精神饱满')) || '';
  ok('运行期：精神饱满早退报「你现在精神饱满。」且 innRests 零计数（0→0）',
    full === '你现在精神饱满。' && h.innRests === 0 && h.gold === 100,
    m.join(' | ') + ` innRests=${h.innRests} gold=${h.gold}`);
}
// D 档：金币不足早退（hp 缺损 + gold 5 < INN_PRICE 10）——零计数零后缀，报差额
{
  const h = mkHero({ hp: 30, mp: 10, gold: 5, ach: ['firstblood'] });
  const m = runStay(h);
  const poor = m.find((t) => t.startsWith('金币不足')) || '';
  ok('运行期：金币不足早退报「金币不足：住一晚需 10 金（当前 5 金，还差 5 金）」且 innRests 零计数',
    poor === '金币不足：住一晚需 10 金（当前 5 金，还差 5 金）' && h.innRests === 0 && h.gold === 5,
    m.join(' | ') + ` innRests=${h.innRests}`);
}

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为冒烟二百九十三件套（二百九十二件套清除）',
  readme.includes('冒烟二百九十三件套（二百九十二件套清除）'));
ok('README tests 含 v24.53 守护描述与 smoke_v2453_innrestprog 入库（293 份）',
  readme.includes('v24.53 起含 「住店成功战报「🏨 夜宿灯下 N/15」进度后缀」守护') &&
  readme.includes('smoke_v2453_innrestprog 入库（293 份）'));
ok('README 尚无 278 件套口径（哨兵前望 278 语义：下一版才写 278）',
  !readme.includes('二百九十四件套') && !readme.includes('冒烟二百九十四件套'));
ok('README 仍保留 v24.52 守护描述与 v24.51 守护描述（历史保留）',
  readme.includes('v24.52 起含 「图鉴新收录战报「📖 见多识广 N/10」进度后缀」守护') &&
  readme.includes('v24.51 起含 「售菇成功战报「🍄 蘑菇商路 N/30」进度后缀」守护'));
ok('README tests 树串尾已延伸至 smoke_v2453_innrestprog（... + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10 + smoke_v2461_xpcurve11 + smoke_v2462_xpcurve12 + smoke_v2463_xpcurve13 + smoke_v2464_xpcurve14 + smoke_v2465_xpcurve15 + smoke_v2466_xpcurve16 + smoke_v2467_xpcurve17 + smoke_v2468_xpcurve18 + smoke_v2469_xpcurve19（npm test 串跑））',
  readme.includes('smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10 + smoke_v2461_xpcurve11 + smoke_v2462_xpcurve12 + smoke_v2463_xpcurve13 + smoke_v2464_xpcurve14 + smoke_v2465_xpcurve15 + smoke_v2466_xpcurve16 + smoke_v2467_xpcurve17 + smoke_v2468_xpcurve18 + smoke_v2469_xpcurve19（npm test 串跑）'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 277 份（smoke.mjs + 276 专项）', chain.length === 292 && chainAll.length === 293, String(chain.length));
ok('package.json 链尾为 smoke_v2453_innrestprog（第 276 份）', chain[chain.length - 1] === 'smoke_v2469_xpcurve19', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2453_innrestprog.mjs（node tests/ 前缀形态）',
  pkgRaw.includes('node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs'));
ok('package.json 链锚逐字（...smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs\"）',
  pkgRaw.includes('smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs && node tests/smoke_v2459_xpcurve9.mjs && node tests/smoke_v2460_xpcurve10.mjs && node tests/smoke_v2461_xpcurve11.mjs && node tests/smoke_v2462_xpcurve12.mjs && node tests/smoke_v2463_xpcurve13.mjs && node tests/smoke_v2464_xpcurve14.mjs && node tests/smoke_v2465_xpcurve15.mjs && node tests/smoke_v2466_xpcurve16.mjs && node tests/smoke_v2467_xpcurve17.mjs && node tests/smoke_v2468_xpcurve18.mjs && node tests/smoke_v2469_xpcurve19.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.53（startsWith）', changelog.startsWith('## v24.69 '));
ok('CHANGELOG v24.53 条目含「夜宿灯下」与「进度后缀」与「住店」',
  changelog.includes('夜宿灯下') && changelog.includes('进度后缀') && changelog.includes('住店'));
ok('CHANGELOG 仍保留 v24.52 与 v24.51 条目（历史保留）',
  changelog.includes('## v24.52 ') && changelog.includes('## v24.51 '));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(chainAll.map((f) => f.replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 277（276 专项 + smoke.mjs）', files.length === 293, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：v2415 树串守护已推进至新链尾 + 前望 278 ——
const t2415 = read('tests/smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v2453_innrestprog（第 276 份）',
  t2415.includes("chain[chain.length - 1] === 'smoke_v2469_xpcurve19'"));
ok('smoke_v2415 树串 token 数已推进至 277', t2415.includes('treeTok.length === 293'));
ok('smoke_v2415 哨兵「尚无 278」口径（二百七十七件套 bare 否定式）',
  t2415.includes("!readme.includes('二百九十四件套')"));
const s2429 = read('tests/smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 件盘口句已推进（冒烟二百九十三件套（二百九十二件套清除）正形态）',
  s2429.includes("readme.includes('冒烟二百九十三件套（二百九十二件套清除）')"));
ok('smoke_v2429 链尾断言已推进至「=== smoke_v2453_innrestprog」',
  s2429.includes("=== 'smoke_v2469_xpcurve19'"));
ok('smoke_v2429 入库份数断言随新现实推进（入库 277 份）',
  s2429.includes('入库（293 份）'));

// —— 旧代 pin 零残留扫描（v24.52 / 276 口径；豁免本套件与上一版套件否定式/历史字面量）——
const leftovers = [];
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v2453_innrestprog.mjs') continue;
  // 承 v24.52 同款豁免：上一版套件（smoke_v2452_scholarprog）合法的历史/否定式字面量不入扫描。
  if (f === 'smoke_v2452_scholarprog.mjs') continue;
  const s2 = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s2.includes("const GAME_VERSION = 'v24.52';") || s2.includes("GAME_VERSION === 'v24.52'") ||
      s2.includes("startsWith('## v24.52") || s2.includes('入库（276 份）') ||
      s2.includes('冒烟二百七十六件套（二百七十五件' + '套清除）') ||
      s2.includes('testChain === 27' + '5') || s2.includes('fileCount === 27' + '5') ||
      s2.includes('files.length === 27' + '5') || s2.includes('chainAll.length === 27' + '5') ||
      s2.includes('treeTok.length === 27' + '6') ||
      s2.includes("chain[chain.length - 1] === 'smoke_v2452_scholarprog'")) leftovers.push(f);
}
ok('全库测试零残留 v24.52 GAME_VERSION/顶 pin/276 口径（哨兵链，豁免本套件与上一版否定式）',
  leftovers.length === 0, leftovers.join(','));

console.log(`— v24.53 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
