// v21.63 专项冒烟：商店/旅馆金币不足拦截报差额（体验打磨·信息透明）。
// 背景：shop.js 的 buyPotion/buyWeapon/buyArmor/stayInn 四处「金币不足」拦截弹条自
// v19.67 起只报品名与价格（「金币不足：X 需 N 金」）——玩家被拒时想确认「兜里有多少、
// 还差多少」仍需瞄 HUD 或按 I 看状态页；旅馆面板端 drawInn 红字「（还差 N 金）」
//（menus.js）与 v19.69 酿造材料不足「（当前 A/B）」早已量化，唯独按下确认这一刻的拦截
// 弹条缺数。本版四处同式补「（当前 M 金，还差 K 金）」：差额 = 价格 − hero.gold，与各
// 判定 `hero.gold >= price` 同读一份源（进入不足分支差额恒正），调价只改 data.js 常量、
// 面板红字/拦截弹条两端自动跟随。纯显示零结算零数值零存档变化。
// 本冒烟守护：版本锚点、data.js/shop.js 源级落位（v21.63 注释 + 四条新文案落位 +
// 旧裸文案零残留 + 判定/扣款/加库存/恢复结算逐字零回归）、价格常量契约、运行期实证
// 十二档（四处不足分支报文与差额、四处成功/优先拦截分支零回归、边界差额档、
// 住店满状态档、卖蘑菇零回归）、README/package.json 同步 + smoke_v2162 件套断言去硬化（v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION, POTION_PRICE, POTION_CAP, INN_PRICE, WEAPONS, ARMORS, MUSHROOM_PRICE, baseStats } from '../js/data.js';
import { buyPotion, buyWeapon, buyArmor, stayInn, sellMushroom } from '../js/shop.js';
import { bind } from '../js/bind.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v21.62 冒烟先例：先装桩再 import main.js）——
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

console.log('— v21.63 商店/旅馆金币不足拦截报差额 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.62）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.62', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 63)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.63 注释（商店/旅馆金币不足拦截报差额说明）',
  dSrc.includes('v21.63 体验打磨：商店/旅馆金币不足拦截报差额'));

// —— shop.js 源级落位 ——
const sSrc = fs.readFileSync(path.join(ROOT, 'js/shop.js'), 'utf8');
ok('shop.js 含 v21.63 注释（金币不足拦截报差额）', sSrc.includes('v21.63 金币不足拦截报差额'));
ok('shop.js 药水不足新文案落位（含当前/还差）',
  sSrc.includes('金币不足：生命药水需 ${POTION_PRICE} 金（当前 ${hero.gold} 金，还差 ${POTION_PRICE - hero.gold} 金）'));
ok('shop.js 武器/防具不足新文案落位且恰为 2 处（buyWeapon/buyArmor 同式）',
  (sSrc.match(/金币不足：\$\{name\} 需 \$\{price\} 金（当前 \$\{hero\.gold\} 金，还差 \$\{price - hero\.gold\} 金）/g) || []).length === 2);
ok('shop.js 住店不足新文案落位（含当前/还差）',
  sSrc.includes('金币不足：住一晚需 ${INN_PRICE} 金（当前 ${hero.gold} 金，还差 ${INN_PRICE - hero.gold} 金）'));
ok('shop.js 旧裸文案零残留（药水/武器防具/住店三条模板在金字后立即收尾的旧句已清除）',
  !sSrc.includes('需 ${POTION_PRICE} 金`)') &&
  !sSrc.includes('需 ${price} 金`)') &&
  !sSrc.includes('需 ${INN_PRICE} 金`)'));

// —— 判定/结算逐字零回归（只改文案，不改任何经济结算）——
ok('shop.js 购买判定逐字零回归（gold>=POTION_PRICE / gold>=price×2 / gold>=INN_PRICE）',
  sSrc.includes('if (hero.gold >= POTION_PRICE)') &&
  (sSrc.match(/if \(hero\.gold >= price\)/g) || []).length === 2 &&
  sSrc.includes('if (hero.gold >= INN_PRICE)'));
ok('shop.js 扣款/加库存/恢复结算逐字零回归',
  sSrc.includes('hero.gold -= POTION_PRICE;') &&
  (sSrc.match(/hero\.gold -= price;/g) || []).length === 2 &&
  sSrc.includes('hero.gold -= INN_PRICE;') &&
  sSrc.includes('hero.item++;') &&
  sSrc.includes('hero.hp = hero.hpMax;') && sSrc.includes('hero.mp = hero.mpMax;'));
ok('shop.js 成功/拦截分支其余文案逐字零回归（购买成功/装备了/睡了一晚/背包已满/精神饱满）',
  sSrc.includes('购买成功：生命药水 +1（-${POTION_PRICE} 金，剩余 ${hero.item}/${POTION_CAP} 瓶 / ${hero.gold} 金）') &&
  (sSrc.match(/装备了 \$\{name\}（-\$\{price\} 金，剩余 \$\{hero\.gold\} 金/g) || []).length === 2 &&
  sSrc.includes('🌙 你美美地睡了一晚，HP/MP 恢复！（-${INN_PRICE} 金，剩余 ${hero.gold} 金）') &&
  sSrc.includes('🎒 背包已满（药水上限 ${POTION_CAP} 瓶），先去用掉一些吧！') &&
  sSrc.includes('你现在精神饱满。'));

// —— 价格常量契约（差额口径所读数据源）——
ok('价格常量契约（POTION_PRICE=15 / INN_PRICE=10 / POTION_CAP=99 / MUSHROOM_PRICE=10）',
  POTION_PRICE === 15 && INN_PRICE === 10 && POTION_CAP === 99 && MUSHROOM_PRICE === 10);
ok('装备价格契约（铁剑 80 / 皮甲 60，差额实证所依赖）',
  WEAPONS['铁剑'].price === 80 && ARMORS['皮甲'].price === 60);

// —— 运行期实证：bind.boxMsg 捕获（承 v21.40/v21.60/v21.61 捕获桩法）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 1, hp: 30, hpMax: 60, mp: 20, mpMax: 20,
    atkMax: 12, defMax: 6, gold: 0, xp: 0, xpNext: 20, item: 0, potion2: 0,
    weapon: '木剑', armor: '布衣', diff: null, skills: ['火焰斩'],
    poison: 0, seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, x: 1, y: 1, map: 'village',
    charge: false }, extra || {});
}
function runShop(hero, fn, ...args) {
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    S.G = hero;
    fn(...args);
    return msgs;
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}

// A 档：买药水金币不足——报「（当前 7 金，还差 8 金）」且不扣款不进货
{
  const h = mkHero({ gold: 7, item: 0 });
  const m = runShop(h, buyPotion);
  ok('运行期：买药水不足档报文逐字「金币不足：生命药水需 15 金（当前 7 金，还差 8 金）」',
    m.length === 1 && m[0] === '金币不足：生命药水需 15 金（当前 7 金，还差 8 金）', m.join(' | '));
  ok('运行期：买药水不足档零结算（gold 7 / item 0 不变）', h.gold === 7 && h.item === 0);
}

// B 档：买药水差额边界——gold=14 还差 1（差额 = 价格 − 当前，与判定同源）
{
  const h = mkHero({ gold: 14, item: 0 });
  const m = runShop(h, buyPotion);
  ok('运行期：差额边界档 gold=14 报「还差 1 金」（差额 = 15 − 14）',
    m.length === 1 && m[0] === '金币不足：生命药水需 15 金（当前 14 金，还差 1 金）', m.join(' | '));
}

// C 档：买药水成功零回归——报文逐字（v19.78 口径）且扣款/加库存一致
{
  const h = mkHero({ gold: 15, item: 1 });
  const m = runShop(h, buyPotion);
  ok('运行期：买药水成功档报文逐字零回归「购买成功：生命药水 +1（-15 金，剩余 2/99 瓶 / 0 金）」',
    m.length === 1 && m[0] === '购买成功：生命药水 +1（-15 金，剩余 2/99 瓶 / 0 金）', m.join(' | '));
  ok('运行期：买药水成功档结算一致（gold 15→0 / item 1→2）', h.gold === 0 && h.item === 2);
}

// D 档：背包满优先拦截零回归——gold 充足但 item 满，报背包已满、不出现金币不足、零结算
{
  const h = mkHero({ gold: 999, item: 99 });
  const m = runShop(h, buyPotion);
  ok('运行期：背包满档优先拦截（报背包已满、不含金币不足、gold/item 不变）',
    m.length === 1 && m[0].includes('背包已满') && !m[0].includes('金币不足') && h.gold === 999 && h.item === 99,
    m.join(' | '));
}

// E 档：买武器金币不足——报「（当前 50 金，还差 30 金）」且不换装不扣款
{
  const h = mkHero({ gold: 50, weapon: '木剑' });
  const m = runShop(h, buyWeapon, '铁剑');
  ok('运行期：买武器不足档报文逐字「金币不足：铁剑 需 80 金（当前 50 金，还差 30 金）」',
    m.length === 1 && m[0] === '金币不足：铁剑 需 80 金（当前 50 金，还差 30 金）', m.join(' | '));
  ok('运行期：买武器不足档零结算（gold 50 / weapon 木剑 不变）', h.gold === 50 && h.weapon === '木剑');
}

// F 档：买武器成功零回归——报文前缀逐字（v19.75+v20.5 口径）且扣款/换装/面板攻击重算一致
{
  const h = mkHero({ gold: 100, weapon: '木剑', level: 1 });
  const m = runShop(h, buyWeapon, '铁剑');
  ok('运行期：买武器成功档报文零回归（「装备了 铁剑（-80 金，剩余 20 金 · 攻击 」前缀 + 无成就串扰）',
    m.length === 1 && m[0].startsWith('装备了 铁剑（-80 金，剩余 20 金 · 攻击 '), m.join(' | '));
  ok('运行期：买武器成功档结算一致（gold 100→20 / weapon 铁剑 / atkMax=base+5）',
    h.gold === 20 && h.weapon === '铁剑' && h.atkMax === baseStats(1).atk + WEAPONS['铁剑'].atk,
    `gold=${h.gold} weapon=${h.weapon} atkMax=${h.atkMax}`);
}

// G 档：买防具金币不足——报「（当前 30 金，还差 30 金）」且不换装不扣款
{
  const h = mkHero({ gold: 30, armor: '布衣' });
  const m = runShop(h, buyArmor, '皮甲');
  ok('运行期：买防具不足档报文逐字「金币不足：皮甲 需 60 金（当前 30 金，还差 30 金）」',
    m.length === 1 && m[0] === '金币不足：皮甲 需 60 金（当前 30 金，还差 30 金）', m.join(' | '));
  ok('运行期：买防具不足档零结算（gold 30 / armor 布衣 不变）', h.gold === 30 && h.armor === '布衣');
}

// H 档：买防具成功零回归——报文前缀逐字且扣款/换装/面板防御重算一致
{
  const h = mkHero({ gold: 100, armor: '布衣', level: 1 });
  const m = runShop(h, buyArmor, '皮甲');
  ok('运行期：买防具成功档报文零回归（「装备了 皮甲（-60 金，剩余 40 金 · 防御 」前缀 + 无成就串扰）',
    m.length === 1 && m[0].startsWith('装备了 皮甲（-60 金，剩余 40 金 · 防御 '), m.join(' | '));
  ok('运行期：买防具成功档结算一致（gold 100→40 / armor 皮甲 / defMax=base+4）',
    h.gold === 40 && h.armor === '皮甲' && h.defMax === baseStats(1).def + ARMORS['皮甲'].def,
    `gold=${h.gold} armor=${h.armor} defMax=${h.defMax}`);
}

// I 档：住店金币不足——报「（当前 5 金，还差 5 金）」且不扣款不恢复
{
  const h = mkHero({ gold: 5, hp: 30, hpMax: 60, mp: 20, mpMax: 20 });
  const m = runShop(h, stayInn);
  ok('运行期：住店不足档报文逐字「金币不足：住一晚需 10 金（当前 5 金，还差 5 金）」（与 drawInn 红字差额同口径）',
    m.length === 1 && m[0] === '金币不足：住一晚需 10 金（当前 5 金，还差 5 金）', m.join(' | '));
  ok('运行期：住店不足档零结算（gold 5 / hp 30 / mp 20 不变）',
    h.gold === 5 && h.hp === 30 && h.mp === 20);
}

// J 档：住店成功零回归——报文逐字（v19.76 口径）且扣款/恢复一致
{
  const h = mkHero({ gold: 10, hp: 30, hpMax: 60, mp: 10, mpMax: 20 });
  const m = runShop(h, stayInn);
  ok('运行期：住店成功档报文逐字零回归「🌙 你美美地睡了一晚，HP/MP 恢复！（-10 金，剩余 0 金）」',
    m.length === 1 && m[0] === '🌙 你美美地睡了一晚，HP/MP 恢复！（-10 金，剩余 0 金）', m.join(' | '));
  ok('运行期：住店成功档结算一致（gold 10→0 / hp 60 / mp 20 回满）',
    h.gold === 0 && h.hp === 60 && h.mp === 20);
}

// K 档：住店满状态零回归——gold 不足也走满状态分支（拦截顺序不变：先查状态再查钱）
{
  const h = mkHero({ gold: 3, hp: 60, hpMax: 60, mp: 20, mpMax: 20 });
  const m = runShop(h, stayInn);
  ok('运行期：住店满状态档保持「你现在精神饱满。」逐字且零结算（gold 3 不变）',
    m.length === 1 && m[0] === '你现在精神饱满。' && h.gold === 3, m.join(' | '));
}

// L 档：卖蘑菇零回归——本版未动 sellMushroom，报文与结算逐字一致
{
  const h = mkHero({ gold: 0, mushrooms: 5, quests: {} });
  const m = runShop(h, sellMushroom);
  ok('运行期：卖蘑菇档报文逐字零回归「售出 1 株魔法蘑菇，得 10 金（剩余 4 株 / 共 10 金）」且结算一致',
    m.length === 1 && m[0] === '售出 1 株魔法蘑菇，得 10 金（剩余 4 株 / 共 10 金）' &&
    h.mushrooms === 4 && h.gold === 10, m.join(' | '));
}

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2163_shopgold', readme.includes('smoke_v2163_shopgold'));
// v21.64 去硬化（v21.7 惯例）：件套精确计数移交当版冒烟守护，本件改存活性口径——
// 仍含「冒烟/件套」且旧口径「（五十八件套清除）」已清除。
ok('README 件套口径为存活性断言（v21.64 起件数由新版冒烟守护：六十件套（五十九件套清除））',
  readme.includes('冒烟') && readme.includes('件套') &&
  !readme.includes('（五十八件套清除）'));
ok('README 含 v21.63 守护描述（金币不足拦截报差额守护）',
  readme.includes('金币不足拦截报差额守护'));
ok('package.json 已收录 smoke_v2163_shopgold（npm test 串跑第 59 份）', pkg.includes('smoke_v2163_shopgold.mjs'));
const s2162 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2162_phaseboost.mjs'), 'utf8');
ok('smoke_v2162 的 README 件套口径断言已去硬化（存活性口径落位，旧精确表达式零残留）',
  s2162.includes("!readme.includes('（五十七件套清除）')") &&
  !s2162.includes("readme.includes('五十八件套（五十七件套清除）')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
