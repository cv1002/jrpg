// v24.55 专项冒烟：🏨 住店成功战报补「💸 一掷千金 N/1000」进度后缀
// （体验打磨·信息透明·计数现场·纯显示——承 v24.54 商店购买战报「💸 一掷千金 N/1000」/
// v24.53 住店成功战报「🏨 夜宿灯下 N/15」/ v24.52 图鉴收录战报「📖 见多识广 N/10」/
// v24.51 售菇成功战报「🍄 蘑菇商路 N/30」/ v24.50 酿造成功战报「🍶 妙手回春 N/5」同一
// 「计数现场报进度」主线）：消费线（一掷千金=全游唯一消费端口里程碑，计数 hero.spent 由
// buyPotion/buyWeapon/buyArmor/stayInn/brewNow 五处金币扣减唯一产生点共享累计）的住店端口
// 收口——v24.54 已给商店三条购买报文补「（💸 一掷千金 N/1000）」后缀（注释预留「住店/酿造两
// 消费端口本版未动，留待后续轮次同族收口」），本版收口住店端口：住店扣款正是消费动作在旅馆
// 场景的计数现场（与 v24.54「现场是动作本身」同族），住完想确认离一掷千金还差多少此前得按 C
// 翻成就页；现住店成功战报末尾补「（💸 一掷千金 N/1000）」（分子读 hero.spent——stayInn 扣款
// 计数唯一产生点先于报文落账，进度差分即本次；分母读 data.js SPEND_GOAL 单一数据源，与 C 页/
// ACH_LIST spend 的 ok/prog 及 v24.54 商店三条购买报文同读一份源，调阈值只改 data.js 一处全端
// 自动跟随；酿造端口本版未动，同线留待后续轮次收口），纯显示零结算零存档零数值变化
// （hero.spent 计数/applyAchievements 时机/恢复结算/价格/余额/住宿后缀报文逐字未动）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.55 注释 / GAME_VERSION v24.55 与旧 v24.54 字面量
// 零残留 / v24.54·v24.53 历史注释保留 / SPEND_GOAL 处 v24.55 注释 / ACH_LIST spend 条目
// v24.55 翻转补记）、数据契约（SPEND_GOAL 1000 与 ACH_LIST spend 同源互证 ok/prog/d 逐值·
// 无 r 字段 / INN_PRICE 10）、shop.js 源级（住店报文模板逐字含双后缀 + 💸 后缀计数恰 4 +
// 计数行先于报文 + 旧裸报文零残留 + v2454 三购买姊妹端口 pin 兼容 + v2453 夜宿灯下 pin 兼容 +
// 拦截分支零后缀）、运行期真实 stayInn 路径（bind.boxMsg 捕获桩承 smoke_v2453 同款：首住
// 10/1000 · 跨端口累计 25/1000 · 金币不足/精神饱满拦截零计数零后缀 · 第 1000 金当场解锁
// spend（stayInn 先 applyAchievements 后报文，解锁报文在前））、README/package.json/CHANGELOG
// 同步（件套口径 279 + v24.55 守护描述 + smoke_v2455_innspend 入库（299 份）+ package 串尾 +
// CHANGELOG 顶 pin）、哨兵链（前望 280 且 README 尚无 280 口径）、tests 目录与实跑链一一对应
// （279 份）、旧代 v24.54 pin 全库零残留扫描（豁免本套件否定式/历史字面量/v2454 套件）。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v24.54 冒烟先例：先装桩再 import main.js）——
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
const { GAME_VERSION, SPEND_GOAL, INN_PRICE, POTION_PRICE, ACH_LIST } = await import('../js/data.js');
const { stayInn, buyPotion } = await import('../js/shop.js');
// 音效桩：治愈/商店/取消等全部静音，测试只关心报文与结算
const { SFX } = await import('../js/audio.js');
for (const k of Object.keys(SFX)) SFX[k] = () => {};

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.55 住店成功战报「💸 一掷千金 N/1000」进度后缀 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const sSrc = read('js/shop.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.54）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.54', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] >= 55)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js 含 v24.55 注释（住店成功战报「💸 一掷千金 N/1000」进度后缀）',
  dSrc.includes('v24.55 体验打磨·信息透明·计数现场：🏨 住店成功战报补'));
ok('data.js GAME_VERSION 字面量已为 v24.55（旧 v24.54 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.76';") && !dSrc.includes('const GAME_VERSION = ' + "'v24.54';"));
ok('data.js 仍保留 v24.54 历史注释（商店购买战报进度后缀·本版保留）',
  dSrc.includes('v24.54 体验打磨·信息透明·计数现场：💸 商店购买战报补'));
ok('data.js 仍保留 v24.53 历史注释（住店成功战报夜宿灯下后缀·本版保留）',
  dSrc.includes('v24.53 体验打磨·信息透明·计数现场：🏨 住店成功战报补'));
ok('data.js SPEND_GOAL 处含 v24.55 住店战报分母注释',
  dSrc.includes('v24.55 起住店成功战报（shop.js stayInn）同后缀收口'));
ok('data.js ACH_LIST spend 条目注释含 v24.55 翻转补记',
  dSrc.includes('v24.55 再翻转：住店成功战报（stayInn）同后缀收口'));

// —— 数据契约：SPEND_GOAL / INN_PRICE / ACH_LIST spend 同源互证 ——
ok('SPEND_GOAL 数据契约（阈值单一数据源，判定/进度/描述/战报分母四端同读）',
  SPEND_GOAL === 1000, String(SPEND_GOAL));
ok('INN_PRICE 契约（住店单价 10 金，报文 -N 金与余额读数同源）', INN_PRICE === 10, String(INN_PRICE));
ok('POTION_PRICE 契约（药水单价 15 金，跨端口累计实证所依赖）', POTION_PRICE === 15, String(POTION_PRICE));
const spendAch = ACH_LIST.find((a) => a.id === 'spend');
ok('ACH_LIST 含 spend「一掷千金」且 id 唯一', !!spendAch && spendAch.name === '一掷千金' &&
  ACH_LIST.filter((a) => a.id === 'spend').length === 1);
ok('spend 描述/判定/进度读 SPEND_GOAL 与 (g.spent||0) 防御式（三端同源零裸字面量）',
  !!spendAch && spendAch.d === `累计消费金币 ${SPEND_GOAL} 金` &&
  String(spendAch.ok).includes('SPEND_GOAL') && String(spendAch.prog).includes('SPEND_GOAL'));
ok('spend 无 r 字段纯里程碑（一掷千金本身就是奖励）', !!spendAch && !('r' in spendAch));
ok('spend 0/999/1000/2000 四档谓词逐值（缺字段 0/1000 旧档零迁移、超阈值不钳制）',
  spendAch.ok({}) === false && spendAch.prog({}) === `0/${SPEND_GOAL}` &&
  spendAch.ok({ spent: 999 }) === false && spendAch.prog({ spent: 999 }) === `999/${SPEND_GOAL}` &&
  spendAch.ok({ spent: 1000 }) === true && spendAch.prog({ spent: 1000 }) === `${SPEND_GOAL}/${SPEND_GOAL}` &&
  spendAch.ok({ spent: 2000 }) === true && spendAch.prog({ spent: 2000 }) === `2000/${SPEND_GOAL}`);

// —— shop.js 源级落位 ——
ok('shop.js 住店报文模板逐字（完全恢复 + 价格余额 + 🏨 夜宿灯下 N/15 + 💸 一掷千金 N/1000 双后缀）',
  sSrc.includes('完全恢复！（-${INN_PRICE} 金，剩余 ${hero.gold} 金）（🏨 夜宿灯下 ${hero.innRests}/${INN_REST_GOAL}）（💸 一掷千金 ${hero.spent}/${SPEND_GOAL}）`);'));
ok('shop.js 含 v24.55 注释（住店战报消费后缀说明·承 v24.54 同族收口）',
  sSrc.includes('v24.55 体验打磨·信息透明·计数现场') && sSrc.includes('本版收口住店端口'));
ok('shop.js 💸 一掷千金后缀计数恰 4（v24.54 商店三购买 + v24.55 住店）',
  (sSrc.match(/（💸 一掷千金 \$\{hero\.spent\}\/\$\{SPEND_GOAL\}）/g) || []).length === 4);
ok('shop.js 住店旧裸报文零残留（无消费后缀的住店结算行模板不存在）',
  sSrc.split('（🏨 夜宿灯下 ${hero.innRests}/${INN_REST_GOAL}）`);').length - 1 === 0);
ok('shop.js 住店计数行先于报文（hero.spent 自增在 stayInn 报文之前）',
  sSrc.indexOf('hero.spent = (hero.spent || 0) + INN_PRICE;') > -1 &&
  sSrc.indexOf('hero.spent = (hero.spent || 0) + INN_PRICE;') < sSrc.indexOf('（🏨 夜宿灯下 ${hero.innRests}/${INN_REST_GOAL}）（💸 一掷千金'));
ok('shop.js v2454 姊妹端口 pin 兼容（买药水报文逐字保留）',
  sSrc.includes('购买成功：生命药水 +1（-${POTION_PRICE} 金，剩余 ${hero.item}/${POTION_CAP} 瓶 / ${hero.gold} 金）（💸 一掷千金 ${hero.spent}/${SPEND_GOAL}）'));
ok('shop.js v2454 姊妹端口 pin 兼容（装备购买共享模板两处逐字保留）',
  (sSrc.match(/装备了 \$\{name\}（-\$\{price\} 金，剩余 \$\{hero\.gold\} 金/g) || []).length === 2);
ok('shop.js v2451 姊妹端口 pin 兼容（售菇报文「🍄 蘑菇商路」逐字保留）',
  sSrc.includes('（🍄 蘑菇商路 ${hero.sold || 0}/${SELL_GOAL}）'));
ok('shop.js 拦截分支零后缀（金币不足/精神饱满两档拦截报文不带一掷千金）',
  sSrc.includes('金币不足：住一晚需 ${INN_PRICE} 金（当前 ${hero.gold} 金，还差 ${INN_PRICE - hero.gold} 金）') &&
  sSrc.includes('你现在精神饱满。'));

// —— 运行期真实 stayInn/buyPotion 路径（bind.boxMsg 捕获桩，承 smoke_v2453 同款桩法）——
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
function runShop(hero, fn) {
  const msgs = [];
  const oBox = bind.boxMsg;
  const oHud = bind.renderHUD;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  bind.renderHUD = () => {};
  try {
    S.G = hero;
    fn();
    return msgs;
  } finally {
    bind.boxMsg = oBox;
    bind.renderHUD = oHud;
  }
}
// A 档：首住——报文逐字带「（💸 一掷千金 10/1000）」（与 🏨 夜宿灯下 1/15 双后缀并存）
{
  const h = mkHero({ hp: 30, mp: 10, gold: 100 });
  const m = runShop(h, () => stayInn());
  ok('运行期：首住战报逐字「🌙 你美美地睡了一晚，HP +30（60/60）· MP +20（30/30）完全恢复！（-10 金，剩余 90 金）（🏨 夜宿灯下 1/15）（💸 一掷千金 10/1000）」',
    m.length === 1 && m[0] === '🌙 你美美地睡了一晚，HP +30（60/60）· MP +20（30/30）完全恢复！（-10 金，剩余 90 金）（🏨 夜宿灯下 1/15）（💸 一掷千金 10/1000）', m.join(' | '));
  ok('运行期：首住结算一致（gold 100→90 · hp/mp 回满 · spent 0→10 · innRests 0→1）',
    h.gold === 90 && h.hp === 60 && h.mp === 30 && h.spent === 10 && h.innRests === 1,
    `gold=${h.gold} hp=${h.hp}/${h.hpMax} mp=${h.mp}/${h.mpMax} spent=${h.spent} innRests=${h.innRests}`);
  ok('运行期：首住未解锁 spend（10/1000 未达阈值·ach 无 spend）',
    !(h.ach || []).includes('spend'), JSON.stringify(h.ach || []));
}
// B 档：跨端口累计——先购药水（15）后住店（10）= spent 25，住店报文 25/1000
{
  const h = mkHero({ hp: 30, mp: 10, gold: 100, item: 1 });
  const m1 = runShop(h, () => buyPotion());
  const m2 = runShop(h, () => stayInn());
  ok('运行期：跨端口累计住店战报带「（💸 一掷千金 25/1000）」',
    m2.length === 1 && m2[0].includes(`（💸 一掷千金 25/${SPEND_GOAL}）`), m2.join(' | '));
  ok('运行期：跨端口累计结算一致（spent 15+10=25 · gold 100→75）', h.spent === 25 && h.gold === 75,
    `spent=${h.spent} gold=${h.gold}`);
}
// C 档：金币不足拦截（gold 3 < 10）——零计数零后缀
{
  const h = mkHero({ hp: 30, mp: 10, gold: 3, ach: ['firstblood'] });
  const m = runShop(h, () => stayInn());
  ok('运行期：金币不足拦截报差额「金币不足：住一晚需 10 金（当前 3 金，还差 7 金）」且零计数零后缀',
    m.length === 1 && m[0] === '金币不足：住一晚需 10 金（当前 3 金，还差 7 金）' &&
    h.spent === 0 && h.gold === 3 && h.innRests === 0,
    m.join(' | ') + ` spent=${h.spent}`);
}
// D 档：精神饱满早退（hp/mp 全满）——零计数零后缀
{
  const h = mkHero({ gold: 100 });
  const m = runShop(h, () => stayInn());
  ok('运行期：精神饱满早退报「你现在精神饱满。」且不含一掷千金后缀、spent 零计数',
    m.length === 1 && m[0] === '你现在精神饱满。' && !m[0].includes('一掷千金') && h.spent === 0 && h.gold === 100,
    m.join(' | ') + ` spent=${h.spent}`);
}
// E 档：累计第 1000 金当场解锁（spent 990 + 住店 10 = 1000）——stayInn 先 applyAchievements
// 后报文，解锁报文在前（与 buyPotion 顺序相反）
{
  const h = mkHero({ hp: 30, mp: 10, gold: 100, spent: 990, innRests: 15, ach: ['innrest'] });
  const m = runShop(h, () => stayInn());
  ok('运行期：第 1000 金解锁报文在前「🔓 成就解锁：【一掷千金】」+ 住店战报带「（💸 一掷千金 1000/1000）」',
    m.length === 2 && m[0].includes('🔓 成就解锁：【一掷千金】') &&
    m[1].includes(`（💸 一掷千金 ${SPEND_GOAL}/${SPEND_GOAL}）`), m.join(' | '));
  ok('运行期：第 1000 金当场解锁「一掷千金」（ach 含 spend·spent 990→1000·gold 100→90）',
    (h.ach || []).includes('spend') && h.spent === 1000 && h.gold === 90,
    `ach=${JSON.stringify(h.ach || [])} spent=${h.spent} gold=${h.gold}`);
}

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为冒烟二百九十九件套（二百九十八件套清除）',
  readme.includes('冒烟二百九十九件套（二百九十八件套清除）'));
ok('README tests 含 v24.55 守护描述与 smoke_v2455_innspend 入库（299 份）',
  readme.includes('v24.55 起含 「住店成功战报「💸 一掷千金 N/1000」进度后缀」守护') &&
  readme.includes('smoke_v2455_innspend 入库（299 份）'));
ok('README 尚无 280 件套口径（哨兵前望 280 语义：下一版才写 280）',
  !readme.includes('三百件套') && !readme.includes('冒烟三百件套'));
ok('README 仍保留 v24.54 守护描述与 v24.53 守护描述（历史保留）',
  readme.includes('v24.54 起含 「商店购买战报「💸 一掷千金 N/1000」进度后缀」守护') &&
  readme.includes('v24.53 起含 「住店成功战报「🏨 夜宿灯下 N/15」进度后缀」守护'));
ok('README tests 树串尾已延伸至 smoke_v2455_innspend（... + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10 + smoke_v2461_xpcurve11 + smoke_v2462_xpcurve12 + smoke_v2463_xpcurve13 + smoke_v2464_xpcurve14 + smoke_v2465_xpcurve15 + smoke_v2466_xpcurve16 + smoke_v2467_xpcurve17 + smoke_v2468_xpcurve18 + smoke_v2469_xpcurve19 + smoke_v2470_xpcurve20 + smoke_v2471_bellman + smoke_v2472_bellquest + smoke_v2473_xpcurve21 + smoke_v2475_xpcurve22 + smoke_v2476_achprog（npm test 串跑））',
  readme.includes('smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10 + smoke_v2461_xpcurve11 + smoke_v2462_xpcurve12 + smoke_v2463_xpcurve13 + smoke_v2464_xpcurve14 + smoke_v2465_xpcurve15 + smoke_v2466_xpcurve16 + smoke_v2467_xpcurve17 + smoke_v2468_xpcurve18 + smoke_v2469_xpcurve19 + smoke_v2470_xpcurve20 + smoke_v2471_bellman + smoke_v2472_bellquest + smoke_v2473_xpcurve21 + smoke_v2475_xpcurve22 + smoke_v2476_achprog（npm test 串跑）'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 279 份（smoke.mjs + 278 专项）', chain.length === 298 && chainAll.length === 299, String(chain.length));
ok('package.json 链尾为 smoke_v2455_innspend（第 278 份）', chain[chain.length - 1] === 'smoke_v2476_achprog', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2455_innspend.mjs（node tests/ 前缀形态）',
  pkgRaw.includes('node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs'));
ok('package.json 链锚逐字（...smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs\\\"）',
  pkgRaw.includes('smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs && node tests/smoke_v2459_xpcurve9.mjs && node tests/smoke_v2460_xpcurve10.mjs && node tests/smoke_v2461_xpcurve11.mjs && node tests/smoke_v2462_xpcurve12.mjs && node tests/smoke_v2463_xpcurve13.mjs && node tests/smoke_v2464_xpcurve14.mjs && node tests/smoke_v2465_xpcurve15.mjs && node tests/smoke_v2466_xpcurve16.mjs && node tests/smoke_v2467_xpcurve17.mjs && node tests/smoke_v2468_xpcurve18.mjs && node tests/smoke_v2469_xpcurve19.mjs && node tests/smoke_v2470_xpcurve20.mjs && node tests/smoke_v2471_bellman.mjs && node tests/smoke_v2472_bellquest.mjs && node tests/smoke_v2473_xpcurve21.mjs && node tests/smoke_v2475_xpcurve22.mjs && node tests/smoke_v2476_achprog.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.55（startsWith）', changelog.startsWith('## v24.76 '));
ok('CHANGELOG v24.55 条目含「一掷千金」与「进度后缀」与「住店」',
  changelog.includes('一掷千金') && changelog.includes('进度后缀') && changelog.includes('住店'));
ok('CHANGELOG 仍保留 v24.54 与 v24.53 条目（历史保留）',
  changelog.includes('## v24.54 ') && changelog.includes('## v24.53 '));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(chainAll.map((f) => f.replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 279（278 专项 + smoke.mjs）', files.length === 299, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：v2415 树串守护已推进至新链尾 + 前望 280 ——
const t2415 = read('tests/smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v2455_innspend（第 278 份）',
  t2415.includes("chain[chain.length - 1] === 'smoke_v2476_achprog'"));
ok('smoke_v2415 树串 token 数已推进至 279', t2415.includes('treeTok.length === 299'));
ok('smoke_v2415 哨兵「尚无 280」口径（二百七十九件套 bare 否定式）',
  t2415.includes("!readme.includes('三百件套')"));
const s2429 = read('tests/smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 件盘口句已推进（冒烟二百九十九件套（二百九十八件套清除）正形态）',
  s2429.includes("readme.includes('冒烟二百九十九件套（二百九十八件套清除）')"));
ok('smoke_v2429 链尾断言已推进至「=== smoke_v2455_innspend」',
  s2429.includes("=== 'smoke_v2476_achprog'"));
ok('smoke_v2429 入库份数断言随新现实推进（入库 279 份）',
  s2429.includes('入库（299 份）'));

// —— 旧代 pin 零残留扫描（v24.54 / 278 口径；豁免本套件否定式/历史字面量/v2454 套件）——
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v2455_innspend.mjs' || f === 'smoke_v2454_spendprog.mjs') continue;
  const s2 = fs.readFileSync(path.join(testsDir, f), 'utf8');
  const hits = [];
  if (s2.includes('const GAME_VERSION = ' + "'v24.54';")) hits.push('gv');
  if (s2.includes('GAME_VERSION === ' + "'v24.54'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.54")) hits.push('cw');
  if (s2.includes('入库（27' + '8 份）')) hits.push('ruku');
  if (s2.includes('冒烟二百七十八件套（二百七十七' + '件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 27' + '8')) hits.push('fl');
  if (s2.includes('chainAll.length === 27' + '8')) hits.push('cal');
  if (s2.includes('chain.length === 27' + '7')) hits.push('cl');
  if (s2.includes('treeTok.length === 27' + '8')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v2454_" + "spendprog'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.54 GAME_VERSION/顶 pin/278 口径（哨兵链，豁免本套件与 v2454 套件否定式）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.55 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
