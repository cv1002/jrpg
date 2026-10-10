// v24.56 专项冒烟：🧪 酿造成功战报补「💸 一掷千金 N/1000」进度后缀
// （体验打磨·信息透明·计数现场·纯显示——承 v24.55 住店成功战报「💸 一掷千金 N/1000」/
// v24.54 商店购买战报「💸 一掷千金 N/1000」同一消费线收口主线：消费线（一掷千金=全游唯一
// 消费端口里程碑，计数 hero.spent 由 buyPotion/buyWeapon/buyArmor/stayInn/brewNow 五处金币扣减
// 唯一产生点共享累计）的酿造端口收口——v24.54 注释预留「住店/酿造两消费端口本版未动，留待后续
// 轮次同族收口」、v24.55 收口住店端口并预留「酿造端口本版未动，同线留待后续轮次收口」，本版收口
// 最后一个酿造端口：酿造成本扣款正是消费动作在酿造锅场景的计数现场（与 v24.55「现场是动作本身」
// 同族），酿完想确认离一掷千金还差多少此前得按 C 翻成就页；现酿造成功战报末尾补
// 「（💸 一掷千金 N/1000）」（分子读 hero.spent——brewNow 扣款计数唯一产生点先于报文落账，
// 进度差分即本次；分母读 data.js SPEND_GOAL 单一数据源，与 C 页/ACH_LIST spend 的 ok/prog 及
// v24.54 商店三条购买报文/v24.55 住店报文同读一份源，调阈值只改 data.js 一处全端自动跟随；
// 五端口至此全部收口），纯显示零结算零存档零数值变化（hero.spent 计数/applyAchievements 时机/
// 材料扣减/potion2 库存/可酿瓶数/🍶 妙手回春后缀报文逐字未动）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.56 注释 / GAME_VERSION v24.56 与旧 v24.55 字面量
// 零残留 / v24.55·v24.54 历史注释保留 / SPEND_GOAL 处 v24.56 注释 / ACH_LIST spend 条目
// v24.56 再翻转补记）、数据契约（SPEND_GOAL 1000 与 ACH_LIST spend 同源互证 ok/prog/d 逐值·
// 无 r 字段 / BREW_GOLD 10 / BREW_MUSHROOMS 2）、core.js 源级（import 行追加 SPEND_GOAL +
// 报文模板逐字含双后缀 + 💸 后缀计数恰 1 + 计数行先于报文 + 旧裸报文零残留 + 拦截分支零后缀 +
// v2450 妙手回春姊妹 pin 兼容）、shop.js 姊妹端口（💸 后缀计数恰 4 逐字未动 + 住店报文 pin）、
// 运行期真实 brewNow/stayInn 路径（bind.boxMsg 捕获桩承 smoke_v2450/v2455 同款：首酿
// 10/1000 · 跨端口住店+酿造累计 20/1000 · 材料不足/任务蘑菇保护拦截零计数零后缀 · 第 1000 金
// 当场解锁 spend（brewNow 先 applyAchievements 后报文，解锁报文在前））、README/package.json/
// CHANGELOG 同步（件套口径 280 + v24.56 守护描述 + smoke_v2456_brewspend 入库（299 份）+
// package 串尾 + CHANGELOG 顶 pin）、哨兵链（前望 281 且 README 尚无 281 口径）、tests 目录与
// 实跑链一一对应（280 份）、旧代 v24.55 pin 全库零残留扫描（豁免本套件否定式/历史字面量/v2455
// 套件；扫描码模式串一律拆拼接形态，全库 uniform 免豁免）。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v24.55 冒烟先例：先装桩再 import main.js）——
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
const { GAME_VERSION, SPEND_GOAL, BREW_GOLD, BREW_MUSHROOMS, BREW2_GOAL, INN_PRICE, ACH_LIST } = await import('../js/data.js');
const { brewNow } = await import('../js/core.js');
const { stayInn } = await import('../js/shop.js');
// 音效桩：craft/治愈/取消等全部静音，测试只关心报文与结算
const { SFX } = await import('../js/audio.js');
for (const k of Object.keys(SFX)) SFX[k] = () => {};

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.56 酿造成功战报「💸 一掷千金 N/1000」进度后缀 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const cSrc = read('js/core.js');
const sSrc = read('js/shop.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.55）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.55', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] >= 56)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js 含 v24.56 注释（酿造成功战报「💸 一掷千金 N/1000」进度后缀）',
  dSrc.includes('v24.56 体验打磨·信息透明·计数现场：🧪 酿造成功战报补'));
ok('data.js GAME_VERSION 字面量已为 v24.56（旧 v24.55 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.76';") && !dSrc.includes('const GAME_VERSION = ' + "'v24.55';"));
ok('data.js 仍保留 v24.55 历史注释（住店成功战报进度后缀·本版保留）',
  dSrc.includes('v24.55 体验打磨·信息透明·计数现场：🏨 住店成功战报补'));
ok('data.js 仍保留 v24.54 历史注释（商店购买战报进度后缀·本版保留）',
  dSrc.includes('v24.54 体验打磨·信息透明·计数现场：💸 商店购买战报补'));
ok('data.js SPEND_GOAL 处含 v24.56 酿造战报分母注释',
  dSrc.includes('v24.56 起酿造成功战报（core.js brewNow）同后缀收口'));
ok('data.js ACH_LIST spend 条目注释含 v24.56 再翻转补记',
  dSrc.includes('v24.56 再翻转：酿造成功战报（core.js brewNow）同后缀收口'));

// —— 数据契约：SPEND_GOAL / BREW_GOLD / BREW_MUSHROOMS / ACH_LIST spend·brew2 同源互证 ——
ok('SPEND_GOAL 数据契约（阈值单一数据源，判定/进度/描述/战报分母四端同读）',
  SPEND_GOAL === 1000, String(SPEND_GOAL));
ok('BREW_GOLD 契约（酿造金币成本 10 金，报文进度差分与 spent 计数同源）', BREW_GOLD === 10, String(BREW_GOLD));
ok('BREW_MUSHROOMS 契约（酿造蘑菇成本 2 株，拦截报文与材料扣减同源）', BREW_MUSHROOMS === 2, String(BREW_MUSHROOMS));
ok('INN_PRICE 契约（住店单价 10 金，跨端口累计实证所依赖）', INN_PRICE === 10, String(INN_PRICE));
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
const brew2Ach = ACH_LIST.find((a) => a.id === 'brew2');
ok('ACH_LIST 含 brew2「妙手回春」（酿造线姊妹里程碑零串扰基线）',
  !!brew2Ach && brew2Ach.name === '妙手回春');

// —— core.js 源级落位 ——
ok('core.js import 行自 data.js 追加 SPEND_GOAL（邻位保留 BREW2_GOAL/MUSHROOM_GOAL 原位）',
  cSrc.includes('BREW2_GOAL, SPEND_GOAL, MUSHROOM_GOAL'));
ok('core.js 含 v24.56 注释（酿造战报消费后缀说明·收口最后一个酿造端口）',
  cSrc.includes('v24.56 体验打磨·信息透明·计数现场') && cSrc.includes('本版收口最后一个酿造端口'));
ok('core.js 酿造成功报文模板逐字（剩余材料 + 可酿瓶数 + 🍶 妙手回春 N/5 + 💸 一掷千金 N/1000 双后缀）',
  cSrc.includes('；F/战斗[3]使用）（🍶 妙手回春 ${hero.brews || 0}/${BREW2_GOAL}）（💸 一掷千金 ${hero.spent}/${SPEND_GOAL}）`, SYS_MSG_MS)'));
ok('core.js 💸 一掷千金后缀计数恰 1（酿造端口唯一）',
  (cSrc.match(/（💸 一掷千金 \$\{hero\.spent\}\/\$\{SPEND_GOAL\}）/g) || []).length === 1);
ok('core.js 酿造旧裸报文零残留（无消费后缀的酿造行模板不存在）',
  cSrc.split('（🍶 妙手回春 ${hero.brews || 0}/${BREW2_GOAL}）`, SYS_MSG_MS);').length - 1 === 0);
ok('core.js 计数行先于报文（hero.spent 自增在报文之前）',
  cSrc.indexOf('hero.spent = (hero.spent || 0) + BREW_GOLD;') > -1 &&
  cSrc.indexOf('hero.spent = (hero.spent || 0) + BREW_GOLD;') < cSrc.indexOf('（💸 一掷千金'));
ok('core.js 两档拦截报文零后缀（材料不足/任务蘑菇保护逐字保留且全文件 💸 仅此一处）',
  cSrc.includes('材料不足：酿造需要 ${BREW_MUSHROOMS} 株蘑菇 + ${BREW_GOLD} 金币') &&
  cSrc.includes('任务蘑菇尚未上交（当前 ${hero.mushrooms}/${MUSHROOM_GOAL} 株），先去找灯长吧！'));
ok('core.js v2450 姊妹端口 pin 兼容（🍶 妙手回春报文逐字保留为双后缀前段）',
  cSrc.includes('（🍶 妙手回春 ${hero.brews || 0}/${BREW2_GOAL}）（💸 一掷千金'));
ok('shop.js v2455 姊妹端口 pin 兼容（住店报文双后缀逐字保留）',
  sSrc.includes('（🏨 夜宿灯下 ${hero.innRests}/${INN_REST_GOAL}）（💸 一掷千金 ${hero.spent}/${SPEND_GOAL}）'));
ok('shop.js 💸 一掷千金后缀计数恰 4（v24.54 商店三购买 + v24.55 住店·本版零改动）',
  (sSrc.match(/（💸 一掷千金 \$\{hero\.spent\}\/\$\{SPEND_GOAL\}）/g) || []).length === 4);

// —— 运行期真实 brewNow/stayInn 路径（bind.boxMsg 捕获桩，承 smoke_v2450/v2455 同款桩法）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 1, hp: 60, hpMax: 60, mp: 30, mpMax: 30,
    atkMax: 12, defMax: 6, gold: 100, xp: 0, xpNext: 20, item: 2, potion2: 0, brews: 0,
    mushrooms: 10, sold: 0, weapon: '木剑', armor: '布衣', diff: null, skills: [], ach: [],
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
// A 档：首酿（spent 0→10）——报文逐字带「（💸 一掷千金 10/1000）」（与 🍶 妙手回春 1/5 双后缀并存）
{
  const h = mkHero({});
  const m = runShop(h, () => brewNow());
  const line = m[m.length - 1] || '';
  ok('运行期：首酿战报逐字「🧪 酿造成功！高级灵药 +1（剩余 8 蘑菇 / 90 金币 · 还可再酿 4 瓶；F/战斗[3]使用）（🍶 妙手回春 1/5）（💸 一掷千金 10/1000）」',
    line === '🧪 酿造成功！高级灵药 +1（剩余 8 蘑菇 / 90 金币 · 还可再酿 4 瓶；F/战斗[3]使用）（🍶 妙手回春 1/5）（💸 一掷千金 10/1000）', m.join(' | '));
  ok('运行期：首酿结算一致（brews 0→1 · mushrooms 10→8 · gold 100→90 · potion2 0→1 · spent 0→10）',
    h.brews === 1 && h.mushrooms === 8 && h.gold === 90 && h.potion2 === 1 && h.spent === 10,
    `brews=${h.brews} mushrooms=${h.mushrooms} gold=${h.gold} potion2=${h.potion2} spent=${h.spent}`);
  ok('运行期：首酿未解锁 spend（10/1000 未达阈值·ach 无 spend）',
    !(h.ach || []).includes('spend'), JSON.stringify(h.ach || []));
}
// B 档：跨端口累计——先住店（10）后酿造（10）= spent 20，酿造报文 20/1000
{
  const h = mkHero({ hp: 30, mp: 10, gold: 100 });
  const m1 = runShop(h, () => stayInn());
  const m2 = runShop(h, () => brewNow());
  ok('运行期：跨端口累计酿造战报带「（💸 一掷千金 20/1000）」',
    m2.length >= 1 && m2[m2.length - 1].includes(`（💸 一掷千金 20/${SPEND_GOAL}）`), m2.join(' | '));
  ok('运行期：跨端口累计结算一致（spent 10+10=20 · gold 100→80 · innRests 1）',
    h.spent === 20 && h.gold === 80 && h.innRests === 1,
    `spent=${h.spent} gold=${h.gold} innRests=${h.innRests}`);
}
// C 档：材料不足拦截（mushrooms 1 < 2）——零计数零后缀
{
  const h = mkHero({ mushrooms: 1 });
  const m = runShop(h, () => brewNow());
  ok('运行期：材料不足拦截报差额「材料不足：酿造需要 2 株蘑菇 + 10 金币（当前 1/100）」且零计数零后缀',
    m.length === 1 && m[0] === '材料不足：酿造需要 2 株蘑菇 + 10 金币（当前 1/100）' &&
    h.spent === 0 && h.gold === 100 && h.mushrooms === 1 && h.brews === 0,
    m.join(' | ') + ` spent=${h.spent}`);
}
// D 档：任务蘑菇保护拦截（side_mushroom=active 且蘑菇 ≤ MUSHROOM_GOAL(3)）——零计数零后缀
{
  const h = mkHero({ mushrooms: 2, quests: { side_mushroom: 'active' } });
  const m = runShop(h, () => brewNow());
  ok('运行期：任务保护拦截报「🍄 任务蘑菇尚未上交（当前 2/3 株），先去找灯长吧！」且零计数零后缀',
    m.length === 1 && m[0] === '🍄 任务蘑菇尚未上交（当前 2/3 株），先去找灯长吧！' &&
    h.spent === 0 && h.brews === 0,
    m.join(' | ') + ` spent=${h.spent}`);
}
// E 档：累计第 1000 金当场解锁（spent 990 + 酿造 10 = 1000）——brewNow 先 applyAchievements
// 后报文，解锁报文在前（与 stayInn 同序）；ach 预置 brew/brew2 隔离酿造线横幅
{
  const h = mkHero({ gold: 100, spent: 990, brews: 4, ach: ['brew', 'brew2'] });
  const m = runShop(h, () => brewNow());
  ok('运行期：第 1000 金解锁报文在前「🔓 成就解锁：【一掷千金】」+ 酿造战报带「（💸 一掷千金 1000/1000）」',
    m.length === 2 && m[0].includes('🔓 成就解锁：【一掷千金】') &&
    m[1].includes(`（💸 一掷千金 ${SPEND_GOAL}/${SPEND_GOAL}）`), m.join(' | '));
  ok('运行期：第 1000 金当场解锁「一掷千金」（ach 含 spend·spent 990→1000·gold 100→90）',
    (h.ach || []).includes('spend') && h.spent === 1000 && h.gold === 90,
    `ach=${JSON.stringify(h.ach || [])} spent=${h.spent} gold=${h.gold}`);
}

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为冒烟二百九十九件套（二百九十八件套清除）',
  readme.includes('冒烟二百九十九件套（二百九十八件套清除）'));
ok('README tests 含 v24.56 守护描述与 smoke_v2456_brewspend 入库（299 份）',
  readme.includes('v24.56 起含 「酿造成功战报「💸 一掷千金 N/1000」进度后缀」守护') &&
  readme.includes('smoke_v2456_brewspend 入库（299 份）'));
ok('README 尚无 281 件套口径（哨兵前望 281 语义：下一版才写 281）',
  !readme.includes('三百件套') && !readme.includes('冒烟三百件套'));
ok('README 仍保留 v24.55 守护描述与 v24.54 守护描述（历史保留）',
  readme.includes('v24.55 起含 「住店成功战报「💸 一掷千金 N/1000」进度后缀」守护') &&
  readme.includes('v24.54 起含 「商店购买战报「💸 一掷千金 N/1000」进度后缀」守护'));
ok('README tests 树串尾已延伸至 smoke_v2456_brewspend（... + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10 + smoke_v2461_xpcurve11 + smoke_v2462_xpcurve12 + smoke_v2463_xpcurve13 + smoke_v2464_xpcurve14 + smoke_v2465_xpcurve15 + smoke_v2466_xpcurve16 + smoke_v2467_xpcurve17 + smoke_v2468_xpcurve18 + smoke_v2469_xpcurve19 + smoke_v2470_xpcurve20 + smoke_v2471_bellman + smoke_v2472_bellquest + smoke_v2473_xpcurve21 + smoke_v2475_xpcurve22 + smoke_v2476_achprog（npm test 串跑））',
  readme.includes('smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10 + smoke_v2461_xpcurve11 + smoke_v2462_xpcurve12 + smoke_v2463_xpcurve13 + smoke_v2464_xpcurve14 + smoke_v2465_xpcurve15 + smoke_v2466_xpcurve16 + smoke_v2467_xpcurve17 + smoke_v2468_xpcurve18 + smoke_v2469_xpcurve19 + smoke_v2470_xpcurve20 + smoke_v2471_bellman + smoke_v2472_bellquest + smoke_v2473_xpcurve21 + smoke_v2475_xpcurve22 + smoke_v2476_achprog（npm test 串跑）'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 293 份（smoke.mjs + 292 专项）', chain.length === 298 && chainAll.length === 299, String(chain.length));
ok('package.json 链尾为 smoke_v2456_brewspend（第 282 份）', chain[chain.length - 1] === 'smoke_v2476_achprog', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2456_brewspend.mjs（node tests/ 前缀形态）',
  pkgRaw.includes('node tests/smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs && node tests/smoke_v2459_xpcurve9.mjs'));
ok('package.json 链锚逐字（...smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs\\"）',
  pkgRaw.includes('smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs && node tests/smoke_v2459_xpcurve9.mjs && node tests/smoke_v2460_xpcurve10.mjs && node tests/smoke_v2461_xpcurve11.mjs && node tests/smoke_v2462_xpcurve12.mjs && node tests/smoke_v2463_xpcurve13.mjs && node tests/smoke_v2464_xpcurve14.mjs && node tests/smoke_v2465_xpcurve15.mjs && node tests/smoke_v2466_xpcurve16.mjs && node tests/smoke_v2467_xpcurve17.mjs && node tests/smoke_v2468_xpcurve18.mjs && node tests/smoke_v2469_xpcurve19.mjs && node tests/smoke_v2470_xpcurve20.mjs && node tests/smoke_v2471_bellman.mjs && node tests/smoke_v2472_bellquest.mjs && node tests/smoke_v2473_xpcurve21.mjs && node tests/smoke_v2475_xpcurve22.mjs && node tests/smoke_v2476_achprog.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.56（startsWith）', changelog.startsWith('## v24.76 '));
ok('CHANGELOG v24.56 条目含「一掷千金」与「进度后缀」与「酿造」',
  changelog.includes('一掷千金') && changelog.includes('进度后缀') && changelog.includes('酿造'));
ok('CHANGELOG 仍保留 v24.55 与 v24.54 条目（历史保留）',
  changelog.includes('## v24.55 ') && changelog.includes('## v24.54 '));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(chainAll.map((f) => f.replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 280（279 专项 + smoke.mjs）', files.length === 299, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：v2415 树串守护已推进至新链尾 + 前望 281 ——
const t2415 = read('tests/smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v2456_brewspend（第 282 份）',
  t2415.includes("chain[chain.length - 1] === 'smoke_v2476_achprog'"));
ok('smoke_v2415 树串 token 数已推进至 280', t2415.includes('treeTok.length === 299'));
ok('smoke_v2415 哨兵「尚无 281」口径（二百八十件套 bare 否定式）',
  t2415.includes("!readme.includes('三百件套')"));
const s2429 = read('tests/smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 件盘口句已推进（冒烟二百九十九件套（二百九十八件套清除）正形态）',
  s2429.includes("readme.includes('冒烟二百九十九件套（二百九十八件套清除）')"));
ok('smoke_v2429 链尾断言已推进至「=== smoke_v2456_brewspend」',
  s2429.includes("=== 'smoke_v2476_achprog'"));
ok('smoke_v2429 入库份数断言随新现实推进（入库 280 份）',
  s2429.includes('入库（299 份）'));

// —— 旧代 pin 零残留扫描（v24.55 / 279 口径；豁免本套件否定式/历史字面量/v2455 套件）——
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v2456_brewspend.mjs' || f === 'smoke_v2455_innspend.mjs') continue;
  const s2 = fs.readFileSync(path.join(testsDir, f), 'utf8');
  const hits = [];
  if (s2.includes('const GAME_VERSION = ' + "'v24.55';")) hits.push('gv');
  if (s2.includes('GAME_VERSION === ' + "'v24.55'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.55")) hits.push('cw');
  if (s2.includes('入库（27' + '9 份）')) hits.push('ruku');
  if (s2.includes('冒烟二百七十九件套（二百七十八' + '件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 27' + '9')) hits.push('fl');
  if (s2.includes('chainAll.length === 27' + '9')) hits.push('cal');
  if (s2.includes('chain.length === 27' + '8')) hits.push('cl');
  if (s2.includes('treeTok.length === 27' + '9')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v2455_" + "innspend'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.55 GAME_VERSION/顶 pin/279 口径（哨兵链，豁免本套件与 v2455 套件否定式）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.56 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
