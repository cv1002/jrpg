// v21.66 专项冒烟：住店结算报文补恢复量与结算后状态（体验打磨·信息透明·口径一致）。
// 背景：住店恢复链条的面板预览端（drawInn「今晚将恢复 HP +N MP +M」）与免费全恢复
// 对照端（v19.94 清泉「HP +N（X/Y）· MP +M（A/B）完全恢复！」）早已量化，唯独按下
// 确认这一刻的结算报文（shop.stayInn，v19.76 起只报「HP/MP 恢复！」+ 金币后缀）缺数——
// 玩家花 10 金睡一觉，想确认「到底回了多少、现在满没满」仍需瞄 HUD 或按 I 看状态页。
// 本版按清泉同式补「HP +N（X/Y）· MP +M（A/B）完全恢复！」（恢复量 = 结算前后差，
// 与面板预览同读 hpMax-hp/mpMax-mp 一份源；已满项如实报 +0，与清泉同口径），
// v19.76 金币后缀保留。纯显示零结算零数值零存档变化。
// 本冒烟守护：版本锚点、data.js/shop.js 源级落位（v21.66 注释 + 新文案落位 +
// 旧裸文案零残留 + 恢复/扣款结算与拦截分支逐字零回归）、清泉端/面板预览端同源零回归、
// 价格常量契约、运行期实证六档（双缺档逐字报文与结算一致、只缺 MP/只缺 HP 两档 +0 如实报、
// 恢复量与面板预览同口径互证、金币不足差额拦截零回归、满状态拦截零回归）、
// README/package.json 同步 + smoke_v2165 件套断言去硬化（v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION, INN_PRICE } from '../js/data.js';
import { stayInn } from '../js/shop.js';
import { bind } from '../js/bind.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v21.65 冒烟先例：先装桩再 import main.js）——
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

console.log('— v21.66 住店结算报文恢复量与结算后状态 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.65）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.65', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 66)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.66 注释（住店结算报文补恢复量与结算后状态说明）',
  dSrc.includes('v21.66 体验打磨：住店结算报文补恢复量与结算后状态'));

// —— shop.js 源级落位 ——
const sSrc = fs.readFileSync(path.join(ROOT, 'js/shop.js'), 'utf8');
ok('shop.js 含 v21.66 注释（住店结算报文补恢复量与结算后状态）',
  sSrc.includes('v21.66 住店结算报文补恢复量与结算后状态'));
ok('shop.js 新文案落位（HP +N（X/Y）· MP +M（A/B）完全恢复！+ v19.76 金币后缀）',
  sSrc.includes('`🌙 你美美地睡了一晚，HP +${hero.hp - hpBefore}（${hero.hp}/${hero.hpMax}）· MP +${hero.mp - mpBefore}（${hero.mp}/${hero.mpMax}）完全恢复！（-${INN_PRICE} 金，剩余 ${hero.gold} 金）`'));
ok('shop.js 旧裸文案零残留（「HP/MP 恢复！」旧句已清除）',
  !sSrc.includes('你美美地睡了一晚，HP/MP 恢复！'));
ok('shop.js 结算前取值落位（hpBefore/mpBefore 捕获）',
  sSrc.includes('const hpBefore = hero.hp;') && sSrc.includes('const mpBefore = hero.mp;'));

// —— 结算/拦截逐字零回归（只改文案，不改任何恢复/扣款结算与拦截判定）——
ok('shop.js 恢复/扣款结算逐字零回归（满恢复赋值与扣款）',
  sSrc.includes('hero.hp = hero.hpMax;') && sSrc.includes('hero.mp = hero.mpMax;') &&
  sSrc.includes('hero.gold -= INN_PRICE;'));
ok('shop.js 金币不足拦截逐字零回归（v21.63 差额口径）',
  sSrc.includes('`金币不足：住一晚需 ${INN_PRICE} 金（当前 ${hero.gold} 金，还差 ${INN_PRICE - hero.gold} 金）`'));
ok('shop.js 满状态拦截逐字零回归（精神饱满）', sSrc.includes("bind.boxMsg('你现在精神饱满。');"));
ok('shop.js 缺损进入条件逐字零回归（HP 或 MP 不满才可住店）',
  sSrc.includes('if (hero.hp < hero.hpMax || hero.mp < hero.mpMax) {'));

// —— 同源两端零回归（清泉结算端 / 旅馆面板预览端）——
const wSrc = fs.readFileSync(path.join(ROOT, 'js/world.js'), 'utf8');
ok('world.js 清泉端报文逐字零回归（v19.94 同式对照端不受扰）',
  wSrc.includes('`⛲ 清泉涌动，HP +${hero.hp - hpBefore}（${hero.hp}/${hero.hpMax}）· MP +${hero.mp - mpBefore}（${hero.mp}/${hero.mpMax}）完全恢复！`'));
const mSrc = fs.readFileSync(path.join(ROOT, 'js/view/menus.js'), 'utf8');
ok('menus.js drawInn 面板预览端逐字零回归（「今晚将恢复」行不受扰）',
  mSrc.includes('今晚将恢复   HP +${Math.max(0,hero.hpMax-hero.hp)}   MP +${Math.max(0,hero.mpMax-hero.mp)}'));

// —— 价格常量契约（报文所读数据源）——
ok('价格常量契约（INN_PRICE === 10）', INN_PRICE === 10);

// —— 运行期实证：stayInn + bind.boxMsg 捕获（承 v21.40/v21.60-v21.65 捕获桩法）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 1, hp: 60, hpMax: 60, mp: 30, mpMax: 30,
    atkMax: 12, defMax: 6, gold: 50, xp: 0, xpNext: 20, item: 0, potion2: 0,
    weapon: '木剑', armor: '布衣', diff: null, skills: ['火焰斩'],
    poison: 0, seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, x: 1, y: 1, map: 'village',
    charge: false }, extra || {});
}
function runInn(hero) {
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    S.G = hero; S.scene = 'inn';
    stayInn();
    return msgs;
  } finally {
    bind.boxMsg = origBox;
    S.G = null; S.scene = 'title';
  }
}

// A 档：双缺档——报文逐字含恢复量与结算后状态，且 hp/mp/gold 结算一致
{
  const h = mkHero({ hp: 30, mp: 10, gold: 50 });
  const m = runInn(h);
  ok('运行期：双缺档报文逐字「🌙 你美美地睡了一晚，HP +30（60/60）· MP +20（30/30）完全恢复！（-10 金，剩余 40 金）」',
    m.length === 1 && m[0] === '🌙 你美美地睡了一晚，HP +30（60/60）· MP +20（30/30）完全恢复！（-10 金，剩余 40 金）', m.join(' | '));
  ok('运行期：双缺档结算一致（hp 30→60 / mp 10→30 / gold 50→40）',
    h.hp === 60 && h.mp === 30 && h.gold === 40, `hp=${h.hp} mp=${h.mp} gold=${h.gold}`);
}

// B 档：只缺 MP 档——已满 HP 如实报 +0（与清泉同口径），HP 不动
{
  const h = mkHero({ hp: 60, mp: 5, gold: 20 });
  const m = runInn(h);
  ok('运行期：只缺 MP 档报「HP +0（60/60）· MP +25（30/30）完全恢复！（-10 金，剩余 10 金）」',
    m.length === 1 && m[0] === '🌙 你美美地睡了一晚，HP +0（60/60）· MP +25（30/30）完全恢复！（-10 金，剩余 10 金）', m.join(' | '));
  ok('运行期：只缺 MP 档结算一致（hp 60 不动 / mp 5→30 / gold 20→10）',
    h.hp === 60 && h.mp === 30 && h.gold === 10);
}

// C 档：只缺 HP 档——已满 MP 如实报 +0，MP 不动
{
  const h = mkHero({ hp: 15, mp: 30, gold: 100 });
  const m = runInn(h);
  ok('运行期：只缺 HP 档报「HP +45（60/60）· MP +0（30/30）完全恢复！（-10 金，剩余 90 金）」',
    m.length === 1 && m[0] === '🌙 你美美地睡了一晚，HP +45（60/60）· MP +0（30/30）完全恢复！（-10 金，剩余 90 金）', m.join(' | '));
  ok('运行期：只缺 HP 档结算一致（hp 15→60 / mp 30 不动 / gold 100→90）',
    h.hp === 60 && h.mp === 30 && h.gold === 90);
}

// D 档：恢复量与面板预览同源互证——报文 +N 与结算前 hpMax-hp/mpMax-mp 差值逐值相等
{
  const h = mkHero({ hp: 1, mp: 1, gold: 10 });
  const hpGap = h.hpMax - h.hp, mpGap = h.mpMax - h.mp; // = drawInn 预览「今晚将恢复」同一份源
  const m = runInn(h);
  ok('运行期：恢复量与面板预览同口径互证（报 +59/+29 = 结算前差值 59/29）',
    m.length === 1 && m[0].includes(`HP +${hpGap}（60/60）· MP +${mpGap}（30/30）`) && hpGap === 59 && mpGap === 29,
    m.join(' | '));
  ok('运行期：预览同源档结算一致（hp 1→60 / mp 1→30 / gold 10→0）',
    h.hp === 60 && h.mp === 30 && h.gold === 0);
}

// E 档：金币不足拦截零回归——v21.63 差额口径逐字，零结算
{
  const h = mkHero({ hp: 30, mp: 10, gold: 5 });
  const m = runInn(h);
  ok('运行期：金币不足档「金币不足：住一晚需 10 金（当前 5 金，还差 5 金）」逐字零回归（零结算）',
    m.length === 1 && m[0] === '金币不足：住一晚需 10 金（当前 5 金，还差 5 金）' &&
    h.hp === 30 && h.mp === 10 && h.gold === 5, m.join(' | '));
}

// F 档：满状态拦截零回归——「你现在精神饱满。」逐字，gold 不变
{
  const h = mkHero({ hp: 60, mp: 30, gold: 50 });
  const m = runInn(h);
  ok('运行期：满状态拦截档「你现在精神饱满。」逐字零回归（gold 50 不变）',
    m.length === 1 && m[0] === '你现在精神饱满。' && h.gold === 50, m.join(' | '));
}

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2166_innheal', readme.includes('smoke_v2166_innheal'));
ok('README 件套口径为六十二件套（六十一件套清除）', readme.includes('六十二件套（六十一件套清除）'));
ok('README 含 v21.66 守护描述（住店结算报文恢复量与结算后状态守护）',
  readme.includes('住店结算报文恢复量与结算后状态守护'));
ok('package.json 已收录 smoke_v2166_innheal（npm test 串跑第 62 份）', pkg.includes('smoke_v2166_innheal.mjs'));
const s2165 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2165_potionhp.mjs'), 'utf8');
ok('smoke_v2165 的 README 件套口径断言已去硬化（存活性口径落位，旧精确表达式零残留）',
  s2165.includes("!readme.includes('（六十件套清除）')") &&
  !s2165.includes("readme.includes('六十一件套（六十件套清除）')"));
const s2163 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2163_shopgold.mjs'), 'utf8');
ok('smoke_v2163 的住店成功档断言已随 v21.66 新现实更新（新口径落位，v19.76 旧裸文案 pin 零残留）',
  s2163.includes('完全恢复！（-${INN_PRICE} 金，剩余 ${hero.gold} 金）') &&
  s2163.includes('🌙 你美美地睡了一晚，HP +30（60/60）· MP +10（20/20）完全恢复！（-10 金，剩余 0 金）') &&
  !s2163.includes("sSrc.includes('🌙 你美美地睡了一晚，HP/MP 恢复！") &&
  !s2163.includes("m[0] === '🌙 你美美地睡了一晚，HP/MP 恢复！"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
