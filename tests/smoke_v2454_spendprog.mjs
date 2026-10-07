// v24.54 专项冒烟：💸 商店购买战报补「一掷千金 N/1000」进度后缀
// （体验打磨·信息透明·计数现场·纯显示——承 v24.53 住店成功战报「🏨 夜宿灯下 N/15」/
// v24.52 图鉴收录战报「📖 见多识广 N/10」/ v24.51 售菇成功战报「🍄 蘑菇商路 N/30」/
// v24.50 酿造成功战报「🍶 妙手回春 N/5」同一「计数现场报进度」主线，翻转 v23.74「零战报后缀」
// 旧口径）：消费线（一掷千金=全游唯一消费端口里程碑，计数 hero.spent 由 buyPotion/buyWeapon/
// buyArmor/stayInn/brewNow 五处金币扣减唯一产生点共享累计）此前是全游唯一没有任何 live 窗口的
// 行为线——持有线 rich 三档 v24.27 已上胜利战报、收入线 v24.51 已上售出战报、住宿线 v24.53 已上
// 住店战报，唯独「花出去的钱」查无一眼之数；而商店三条购买报文（药水/武器/防具）正是消费动作
// 最高频的计数现场：买完想确认离一掷千金还差多少得按 C 翻成就页；现三条购买报文末尾补
// 「（💸 一掷千金 N/1000）」（分子读 hero.spent——扣款计数唯一产生点先于报文落账，进度差分即
// 本次；分母读 data.js SPEND_GOAL 单一数据源，与 C 页/ACH_LIST spend 的 ok/prog 同读一份源，
// 调阈值只改 data.js 一处全端自动跟随；住店/酿造两消费端口本版未动，留待后续轮次同族收口），
// 纯显示零结算零存档零数值变化（hero.spent 计数/applyAchievements 时机/扣款/换装/攻防对比/
// 库存/余额报文逐字未动）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.54 注释 / GAME_VERSION v24.54 与旧 v24.53 字面量
// 零残留 / v24.53·v24.52 历史注释保留 / SPEND_GOAL 处 v24.54 注释 / ACH_LIST spend 条目
// v24.54 翻转补记）、数据契约（SPEND_GOAL 1000 与 ACH_LIST spend 同源互证 ok/prog/d 逐值·
// 无 r 字段）、shop.js 源级（import 追加 SPEND_GOAL + v24.54 注释块 + 三条报文模板逐字 + 旧裸
// 报文零残留 + 计数行先于报文 + v2453/v2451 姊妹端口 pin 兼容）、运行期真实 buyPotion/buyWeapon/
// buyArmor 路径（bind.boxMsg 捕获桩承 smoke_v2453 同款：首购 15/1000 · 装备攻防对比带后缀 ·
// 跨端口累计 95/1000 · 金币不足/背包满拦截零后缀零计数 · 第 1000 金当场解锁 spend）、
// README/package.json/CHANGELOG 同步（件套口径 278 + v24.54 守护描述 + smoke_v2454_spendprog
// 入库（283 份）+ package 串尾 + CHANGELOG 顶 pin）、哨兵链（前望 279 且 README 尚无 279 口径）、
// tests 目录与实跑链一一对应（278 份）、旧代 v24.53 pin 全库零残留扫描（豁免本套件否定式/历史字面量）。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v24.53 冒烟先例：先装桩再 import main.js）——
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
const { GAME_VERSION, SPEND_GOAL, POTION_PRICE, POTION_CAP, WEAPONS, ARMORS, ACH_LIST, baseStats } = await import('../js/data.js');
const { buyPotion, buyWeapon, buyArmor } = await import('../js/shop.js');
// 音效桩：商店/取消等全部静音，测试只关心报文与结算
const { SFX } = await import('../js/audio.js');
for (const k of Object.keys(SFX)) SFX[k] = () => {};

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.54 商店购买战报「💸 一掷千金 N/1000」进度后缀 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const sSrc = read('js/shop.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.53）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.53', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] >= 54)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js 含 v24.54 注释（商店购买战报「💸 一掷千金 N/1000」进度后缀）',
  dSrc.includes('v24.54 体验打磨·信息透明·计数现场：💸 商店购买战报补'));
ok('data.js GAME_VERSION 字面量已为 v24.54（旧 v24.53 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.59';") && !dSrc.includes('const GAME_VERSION = ' + "'v24.53';"));
ok('data.js 仍保留 v24.53 历史注释（住店成功战报进度后缀·本版保留）',
  dSrc.includes('v24.53 体验打磨·信息透明·计数现场：🏨 住店成功战报补'));
ok('data.js 仍保留 v24.52 历史注释（图鉴收录战报进度后缀·本版保留）',
  dSrc.includes('v24.52 体验打磨·信息透明·计数现场：📕 图鉴新收录战报补'));
ok('data.js SPEND_GOAL 处含 v24.54 战报分母单一数据源注释',
  dSrc.includes('v24.54 起本常量同时是商店购买战报'));
ok('data.js ACH_LIST spend 条目注释含 v24.54 翻转补记',
  dSrc.includes('v24.54 翻转：商店三条购买战报'));

// —— 数据契约：SPEND_GOAL / ACH_LIST spend 同源互证 ——
ok('SPEND_GOAL 数据契约（阈值单一数据源，判定/进度/描述/战报分母四端同读）',
  SPEND_GOAL === 1000, String(SPEND_GOAL));
ok('POTION_PRICE 契约（药水单价 15 金，报文 -N 金与余额读数同源）', POTION_PRICE === 15, String(POTION_PRICE));
ok('装备价格契约（铁剑 80 / 皮甲 60，运行期实证所依赖）',
  WEAPONS['铁剑'].price === 80 && ARMORS['皮甲'].price === 60);
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
ok('shop.js 自 data.js 追加导入 SPEND_GOAL（import 行尾追加·v2453 既有子串 pin 零拆散）',
  sSrc.includes('NARR_MSG_MS, SPEND_GOAL } from') &&
  sSrc.includes('INN_PRICE, INN_REST_GOAL, POTION_CAP') &&
  sSrc.includes('MUSHROOM_PRICE, SELL_GOAL, SYS_MSG_MS'));
ok('shop.js 含 v24.54 注释（购买战报进度后缀说明·翻转 v23.74 零战报后缀旧口径）',
  sSrc.includes('v24.54 体验打磨·信息透明·计数现场') && sSrc.includes('翻转') && sSrc.includes('v23.74'));
ok('shop.js 买药水报文模板逐字（价格/库存余额 + 💸 一掷千金 N/1000 后缀）',
  sSrc.includes('购买成功：生命药水 +1（-${POTION_PRICE} 金，剩余 ${hero.item}/${POTION_CAP} 瓶 / ${hero.gold} 金）（💸 一掷千金 ${hero.spent}/${SPEND_GOAL}）'));
ok('shop.js 💸 一掷千金后缀计数恰 4（v24.54 商店三购买 + v24.55 住店）',
  (sSrc.match(/（💸 一掷千金 \$\{hero\.spent\}\/\$\{SPEND_GOAL\}）/g) || []).length === 4);
ok('shop.js 旧购买裸报文零残留（buyPotion 旧结尾模板零残留 + 装备旧结尾模板零残留）',
  sSrc.split('瓶 / ${hero.gold} 金）`);').length - 1 === 0 &&
  sSrc.split("''}）`);").length - 1 === 0);
ok('shop.js 计数行先于报文（hero.spent 自增在 boxMsg 之前·buyPotion 锚）',
  sSrc.indexOf('hero.spent = (hero.spent || 0) + POTION_PRICE;') > -1 &&
  sSrc.indexOf('hero.spent = (hero.spent || 0) + POTION_PRICE;') < sSrc.indexOf('（💸 一掷千金 ${hero.spent}/${SPEND_GOAL}）'));
ok('shop.js v2453 姊妹端口 pin 兼容（住店报文「🏨 夜宿灯下」逐字保留）',
  sSrc.includes('（🏨 夜宿灯下 ${hero.innRests}/${INN_REST_GOAL}）'));
ok('shop.js v2451 姊妹端口 pin 兼容（售菇报文「🍄 蘑菇商路」逐字保留）',
  sSrc.includes('（🍄 蘑菇商路 ${hero.sold || 0}/${SELL_GOAL}）'));
ok('shop.js 拦截分支零后缀（金币不足/背包满两档拦截报文不带一掷千金）',
  sSrc.includes('金币不足：生命药水需 ${POTION_PRICE} 金（当前 ${hero.gold} 金，还差 ${POTION_PRICE - hero.gold} 金）') &&
  sSrc.includes('背包已满（药水上限 ${POTION_CAP} 瓶），先去用掉一些吧！'));

// —— 运行期真实 buyPotion/buyWeapon/buyArmor 路径（bind.boxMsg 捕获桩，承 smoke_v2453 同款桩法）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 1, hp: 45, hpMax: 45, mp: 16, mpMax: 16,
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
// A 档：首购药水——报文逐字带「（💸 一掷千金 15/1000）」
{
  const h = mkHero({ gold: 15, item: 1 });
  const m = runShop(h, () => buyPotion());
  ok('运行期：首购药水战报逐字「购买成功：生命药水 +1（-15 金，剩余 2/99 瓶 / 0 金）（💸 一掷千金 15/1000）」',
    m.length === 1 && m[0] === '购买成功：生命药水 +1（-15 金，剩余 2/99 瓶 / 0 金）（💸 一掷千金 15/1000）', m.join(' | '));
  ok('运行期：首购药水结算一致（gold 15→0 · item 1→2 · spent 0→15）',
    h.gold === 0 && h.item === 2 && h.spent === 15,
    `gold=${h.gold} item=${h.item} spent=${h.spent}`);
  ok('运行期：首购未解锁 spend（15/1000 未达阈值·ach 无 spend）',
    !(h.ach || []).includes('spend'), JSON.stringify(h.ach || []));
}
// B 档：购武器铁剑——攻防对比报文带后缀（12→14 = baseStats(1).atk 9 + 铁剑 5）
{
  const h = mkHero({ gold: 100, weapon: '木剑', atkMax: 12 });
  const m = runShop(h, () => buyWeapon('铁剑'));
  const expected = `装备了 铁剑（-80 金，剩余 20 金 · 攻击 12→${baseStats(1).atk + WEAPONS['铁剑'].atk}）（💸 一掷千金 80/${SPEND_GOAL}）`;
  ok('运行期：购铁剑战报逐字（攻防对比 + 一掷千金后缀）', m.length === 1 && m[0] === expected, m.join(' | ') + ' ≠ ' + expected);
  ok('运行期：购铁剑结算一致（gold 100→20 · weapon 木剑→铁剑 · spent 0→80）',
    h.gold === 20 && h.weapon === '铁剑' && h.spent === 80 && h.atkMax === baseStats(1).atk + WEAPONS['铁剑'].atk,
    `gold=${h.gold} weapon=${h.weapon} spent=${h.spent} atkMax=${h.atkMax}`);
}
// C 档：购防具皮甲——防御对比报文带后缀（6→9 = baseStats(1).def 5 + 皮甲 4）
{
  const h = mkHero({ gold: 100, armor: '布衣', defMax: 6 });
  const m = runShop(h, () => buyArmor('皮甲'));
  const expected = `装备了 皮甲（-60 金，剩余 40 金 · 防御 6→${baseStats(1).def + ARMORS['皮甲'].def}）（💸 一掷千金 60/${SPEND_GOAL}）`;
  ok('运行期：购皮甲战报逐字（防御对比 + 一掷千金后缀）', m.length === 1 && m[0] === expected, m.join(' | ') + ' ≠ ' + expected);
  ok('运行期：购皮甲结算一致（gold 100→40 · armor 布衣→皮甲 · spent 0→60）',
    h.gold === 40 && h.armor === '皮甲' && h.spent === 60 && h.defMax === baseStats(1).def + ARMORS['皮甲'].def,
    `gold=${h.gold} armor=${h.armor} spent=${h.spent} defMax=${h.defMax}`);
}
// D 档：跨端口累计——先药水（15）后铁剑（80）= spent 95，第二条报文 95/1000
{
  const h = mkHero({ gold: 115, item: 1 });
  const m1 = runShop(h, () => buyPotion());
  const m2 = runShop(h, () => buyWeapon('铁剑'));
  ok('运行期：跨端口累计战报第二段带「（💸 一掷千金 95/1000）」',
    m2.length === 1 && m2[0].includes(`（💸 一掷千金 95/${SPEND_GOAL}）`), m2.join(' | '));
  ok('运行期：跨端口累计结算一致（spent 15+80=95 · gold 115→20）', h.spent === 95 && h.gold === 20,
    `spent=${h.spent} gold=${h.gold}`);
}
// E 档：金币不足拦截（秘银剑 220 > gold 100）——零计数零后缀
{
  const h = mkHero({ gold: 100, ach: ['firstblood'] });
  const m = runShop(h, () => buyWeapon('秘银剑'));
  ok('运行期：金币不足拦截报差额「金币不足：秘银剑 需 220 金（当前 100 金，还差 120 金）」且零计数零后缀',
    m.length === 1 && m[0] === '金币不足：秘银剑 需 220 金（当前 100 金，还差 120 金）' &&
    h.spent === 0 && h.gold === 100 && h.weapon === '木剑',
    m.join(' | ') + ` spent=${h.spent}`);
}
// F 档：背包满拦截（item 99）——零计数零后缀
{
  const h = mkHero({ gold: 999, item: 99 });
  const m = runShop(h, () => buyPotion());
  ok('运行期：背包满拦截报「背包已满」且不含一掷千金后缀、spent 零计数',
    m.length === 1 && m[0].includes('背包已满') && !m[0].includes('一掷千金') && h.spent === 0 && h.item === 99,
    m.join(' | ') + ` spent=${h.spent}`);
}
// G 档：累计第 1000 金当场解锁（spent 985 + 药水 15 = 1000）
{
  const h = mkHero({ gold: 100, item: 0, spent: 985, ach: ['firstblood'] });
  const m = runShop(h, () => buyPotion());
  ok('运行期：第 1000 金战报带「（💸 一掷千金 1000/1000）」（含 🔓 成就解锁第二条报文）',
    m.length === 2 && m[0].includes(`（💸 一掷千金 ${SPEND_GOAL}/${SPEND_GOAL}）`) &&
    m[1].includes('🔓 成就解锁：【一掷千金】'), m.join(' | '));
  ok('运行期：第 1000 金当场解锁「一掷千金」（ach 含 spend·spent 985→1000·gold 100→85）',
    (h.ach || []).includes('spend') && h.spent === 1000 && h.gold === 85,
    `ach=${JSON.stringify(h.ach || [])} spent=${h.spent} gold=${h.gold}`);
}

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为冒烟二百八十三件套（二百八十二件套清除）',
  readme.includes('冒烟二百八十三件套（二百八十二件套清除）'));
ok('README tests 含 v24.54 守护描述与 smoke_v2454_spendprog 入库（283 份）',
  readme.includes('v24.54 起含 「商店购买战报「💸 一掷千金 N/1000」进度后缀」守护') &&
  readme.includes('smoke_v2454_spendprog 入库（283 份）'));
ok('README 尚无 279 件套口径（哨兵前望 279 语义：下一版才写 279）',
  !readme.includes('二百八十四件套') && !readme.includes('冒烟二百八十四件套'));
ok('README 仍保留 v24.53 守护描述与 v24.52 守护描述（历史保留）',
  readme.includes('v24.53 起含 「住店成功战报「🏨 夜宿灯下 N/15」进度后缀」守护') &&
  readme.includes('v24.52 起含 「图鉴新收录战报「📖 见多识广 N/10」进度后缀」守护'));
ok('README tests 树串尾已延伸至 smoke_v2454_spendprog（... + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9（npm test 串跑））',
  readme.includes('smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9（npm test 串跑）'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 278 份（smoke.mjs + 277 专项）', chain.length === 282 && chainAll.length === 283, String(chain.length));
ok('package.json 链尾为 smoke_v2454_spendprog（第 277 份）', chain[chain.length - 1] === 'smoke_v2459_xpcurve9', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2454_spendprog.mjs（node tests/ 前缀形态）',
  pkgRaw.includes('node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs'));
ok('package.json 链锚逐字（...smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs\\\"）',
  pkgRaw.includes('smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs && node tests/smoke_v2459_xpcurve9.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.54（startsWith）', changelog.startsWith('## v24.59 '));
ok('CHANGELOG v24.54 条目含「一掷千金」与「进度后缀」与「购买」',
  changelog.includes('一掷千金') && changelog.includes('进度后缀') && changelog.includes('购买'));
ok('CHANGELOG 仍保留 v24.53 与 v24.52 条目（历史保留）',
  changelog.includes('## v24.53 ') && changelog.includes('## v24.52 '));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(chainAll.map((f) => f.replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 278（277 专项 + smoke.mjs）', files.length === 283, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：v2415 树串守护已推进至新链尾 + 前望 279 ——
const t2415 = read('tests/smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v2454_spendprog（第 277 份）',
  t2415.includes("chain[chain.length - 1] === 'smoke_v2459_xpcurve9'"));
ok('smoke_v2415 树串 token 数已推进至 278', t2415.includes('treeTok.length === 283'));
ok('smoke_v2415 哨兵「尚无 279」口径（二百七十八件套 bare 否定式）',
  t2415.includes("!readme.includes('二百八十四件套')"));
const s2429 = read('tests/smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 件盘口句已推进（冒烟二百八十三件套（二百八十二件套清除）正形态）',
  s2429.includes("readme.includes('冒烟二百八十三件套（二百八十二件套清除）')"));
ok('smoke_v2429 链尾断言已推进至「=== smoke_v2454_spendprog」',
  s2429.includes("=== 'smoke_v2459_xpcurve9'"));
ok('smoke_v2429 入库份数断言随新现实推进（入库 278 份）',
  s2429.includes('入库（283 份）'));

// —— 旧代 pin 零残留扫描（v24.53 / 277 口径；豁免本套件否定式/历史字面量）——
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v2454_spendprog.mjs') continue;
  const s2 = fs.readFileSync(path.join(testsDir, f), 'utf8');
  const hits = [];
  if (s2.includes('const GAME_VERSION = ' + "'v24.53';")) hits.push('gv');
  if (s2.includes('GAME_VERSION === ' + "'v24.53'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.53")) hits.push('cw');
  if (s2.includes('入库（27' + '7 份）')) hits.push('ruku');
  if (s2.includes('冒烟二百七十七件套（二百七十六件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 27' + '7')) hits.push('fl');
  if (s2.includes('chainAll.length === 27' + '7')) hits.push('cal');
  if (s2.includes('chain.length === 27' + '6')) hits.push('cl');
  if (s2.includes('treeTok.length === 27' + '7')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v2453_innrestprog'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.53 GAME_VERSION/顶 pin/277 口径（哨兵链，豁免本套件否定式）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.54 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
