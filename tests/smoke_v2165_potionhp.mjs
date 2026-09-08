// v21.65 专项冒烟：喝药战报补恢复后 HP/MP 状态（体验打磨·信息透明·口径一致）。
// 背景：恢复链条的治愈术端（battle v19.97「（HP X/Y）」）、防御回蓝端（v19.96「（MP X/Y）」）、
// 中毒/受击端（v21.8/v20.2「（我方 HP X/Y）」）早已报结算后状态，唯独喝药这一端（战斗内
// doItem 与大地图 usePotion，v19.74 起只报恢复量与库存）缺数——恢复量是上限钳制前的公式量
// （HP 95/100 喝药报「恢复 35」实际只回 5），玩家想确认「回完现在多少血」仍需瞄 HUD。
// 本版两端同式把结算后 HP（灵药含 MP）并入同一括号句首、库存量保留（承 v19.74 同源同改），
// 全部读结算后的 hero.hp/hpMax/mp/mpMax/item/potion2。纯显示零结算零数值零存档变化。
// 本冒烟守护：版本锚点、data.js/battle.js/core.js 源级落位（v21.65 注释 + 四条新文案落位 +
// 旧裸文案零残留 + takePotion 结算/拦截判定逐字零回归）、恢复公式常量契约、运行期实证八档
// （战斗药水/战斗灵药/大地图药水/大地图灵药逐字报文与结算一致、钳制档体现上限钳制、
// 无药拦截/满状态拦截/灵药优先档零回归）、README/package.json 同步 + smoke_v2164 件套断言去硬化（v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION, POTION_HP_PCT, POTION_HP_FLAT, ELIXIR_HP_PCT, ELIXIR_HP_FLAT, ELIXIR_MP_PCT } from '../js/data.js';
import { startBattle, playerAction } from '../js/battle.js';
import { usePotion } from '../js/core.js';
import { bind } from '../js/bind.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v21.64 冒烟先例：先装桩再 import main.js）——
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

console.log('— v21.65 喝药战报恢复后 HP/MP 状态 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.64）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.64', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 65)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.65 注释（喝药战报补恢复后 HP/MP 状态说明）',
  dSrc.includes('v21.65 体验打磨：喝药战报补恢复后 HP/MP 状态'));

// —— battle.js / core.js 源级落位 ——
const bSrc = fs.readFileSync(path.join(ROOT, 'js/battle.js'), 'utf8');
const cSrc = fs.readFileSync(path.join(ROOT, 'js/core.js'), 'utf8');
ok('battle.js 含 v21.65 注释（喝药战报补恢复后状态）', bSrc.includes('v21.65 喝药战报补恢复后 HP/MP 状态'));
ok('battle.js 灵药新文案落位（HP X/Y · MP A/B · 库存同括号）',
  bSrc.includes('`🧪 ${hero.name} 服下高级灵药，恢复 ${result.h} HP、${result.m} MP（HP ${hero.hp}/${hero.hpMax} · MP ${hero.mp}/${hero.mpMax} · 高级灵药剩余 ${hero.potion2} 瓶）`'));
ok('battle.js 药水新文案落位（HP X/Y · 库存同括号）',
  bSrc.includes('`🍖 ${hero.name} 服用药水，恢复 ${result.h} 点 HP（HP ${hero.hp}/${hero.hpMax} · 药水剩余 ${hero.item} 瓶）`'));
ok('battle.js 旧裸文案零残留（恢复量后直接收尾库存的旧句已清除）',
  !bSrc.includes('MP（高级灵药剩余') && !bSrc.includes('HP（药水剩余'));
ok('core.js 含 v21.65 注释（喝药战报补恢复后状态）', cSrc.includes('v21.65 喝药战报补恢复后 HP/MP 状态'));
ok('core.js 灵药新文案落位（与战斗内同式、无 hero.name 前缀）',
  cSrc.includes('`🧪 服下高级灵药，恢复 ${result.h} HP、${result.m} MP（HP ${hero.hp}/${hero.hpMax} · MP ${hero.mp}/${hero.mpMax} · 高级灵药剩余 ${hero.potion2} 瓶）`'));
ok('core.js 药水新文案落位（与战斗内同式、无 hero.name 前缀）',
  cSrc.includes('`🍖 使用药水，恢复 ${result.h} 点 HP（HP ${hero.hp}/${hero.hpMax} · 药水剩余 ${hero.item} 瓶）`'));
ok('core.js 旧裸文案零残留（恢复量后直接收尾库存的旧句已清除）',
  !cSrc.includes('MP（高级灵药剩余') && !cSrc.includes('HP（药水剩余'));

// —— 结算/判定逐字零回归（只改文案，不改任何恢复结算与拦截判定）——
const hSrc = fs.readFileSync(path.join(ROOT, 'js/hero.js'), 'utf8');
ok('hero.js takePotion 钳制结算逐字零回归（min 钳到上限 / 灵药优先 / 库存递减）',
  hSrc.includes('hero.hp = Math.min(hero.hpMax, hero.hp + h);') &&
  hSrc.includes('hero.mp = Math.min(hero.mpMax, hero.mp + m);') &&
  hSrc.includes('hero.potion2--;') && hSrc.includes('hero.item--;'));
ok('hero.js potionAvailability 判定逐字零回归（灵药优先 / 满状态不浪费）',
  hSrc.includes('const strongOk = hero.potion2 > 0 && (!hpFull || !mpFull);') &&
  hSrc.includes('const weakOk = hero.item > 0 && !hpFull;'));
ok('battle.js doItem 拦截分支逐字零回归（气满神足 / 没有可用的药水了）',
  bSrc.includes("'✅ 你气满神足，无需用药！' : '❌ 没有可用的药水了！'"));
ok('core.js usePotion 拦截分支逐字零回归（状态满满 / 没有可用的药水了）',
  cSrc.includes("'✅ 状态满满，无需喝药！' : '🍖 没有可用的药水了！'"));

// —— 恢复公式常量契约（报文所读数据源）——
ok('恢复公式常量契约（POTION 50%+8 / ELIXIR 80%+20 且 MP 40%）',
  POTION_HP_PCT === 0.5 && POTION_HP_FLAT === 8 &&
  ELIXIR_HP_PCT === 0.8 && ELIXIR_HP_FLAT === 20 && ELIXIR_MP_PCT === 0.4);

// —— 运行期实证：战斗内 startBattle + playerAction('item') 真实路径（承 v21.53 桩法），
//    大地图 usePotion + bind.boxMsg 捕获（承 v21.40/v21.60-v21.64 捕获桩法）——
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
function runWorldPotion(hero) {
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    S.G = hero; S.scene = 'world';
    usePotion();
    return msgs;
  } finally {
    bind.boxMsg = origBox;
    S.G = null; S.scene = 'title';
  }
}

// A 档：战斗普通药水（不钳制）——报文逐字含恢复后 HP 48/60，且 hp 10→48 / item 2→1 结算一致
{
  const h = mkHero({ hp: 10, item: 2 });
  const line = runBattleItem(h);
  ok('运行期：战斗药水档报文逐字「🍖 测试者 服用药水，恢复 38 点 HP（HP 48/60 · 药水剩余 1 瓶）」',
    line === '🍖 测试者 服用药水，恢复 38 点 HP（HP 48/60 · 药水剩余 1 瓶）', line);
  ok('运行期：战斗药水档结算一致（hp 10→48 = 公式量 38 未钳制 / item 2→1）',
    h.hp === 48 && h.item === 2 - 1, `hp=${h.hp} item=${h.item}`);
}

// B 档：战斗高级灵药——报文逐字含 HP 60/60 · MP 22/30（HP 钳制体现），且 hp 20→60 / mp 10→22 / potion2 1→0
{
  const h = mkHero({ hp: 20, mp: 10, item: 0, potion2: 1 });
  const line = runBattleItem(h);
  ok('运行期：战斗灵药档报文逐字「🧪 测试者 服下高级灵药，恢复 68 HP、12 MP（HP 60/60 · MP 22/30 · 高级灵药剩余 0 瓶）」',
    line === '🧪 测试者 服下高级灵药，恢复 68 HP、12 MP（HP 60/60 · MP 22/30 · 高级灵药剩余 0 瓶）', line);
  ok('运行期：战斗灵药档结算一致（hp 20→60 钳制 / mp 10→22 / potion2 1→0）',
    h.hp === 60 && h.mp === 22 && h.potion2 === 0, `hp=${h.hp} mp=${h.mp} potion2=${h.potion2}`);
}

// C 档：大地图普通药水（不钳制）——报文逐字（无 hero.name 前缀）且结算一致
{
  const h = mkHero({ hp: 10, item: 2 });
  const m = runWorldPotion(h);
  ok('运行期：大地图药水档报文逐字「🍖 使用药水，恢复 38 点 HP（HP 48/60 · 药水剩余 1 瓶）」',
    m.length === 1 && m[0] === '🍖 使用药水，恢复 38 点 HP（HP 48/60 · 药水剩余 1 瓶）', m.join(' | '));
  ok('运行期：大地图药水档结算一致（hp 10→48 / item 2→1）', h.hp === 48 && h.item === 1);
}

// D 档：大地图高级灵药——报文逐字（无 hero.name 前缀）且 HP/MP/库存结算一致
{
  const h = mkHero({ hp: 20, mp: 10, item: 0, potion2: 1 });
  const m = runWorldPotion(h);
  ok('运行期：大地图灵药档报文逐字「🧪 服下高级灵药，恢复 68 HP、12 MP（HP 60/60 · MP 22/30 · 高级灵药剩余 0 瓶）」',
    m.length === 1 && m[0] === '🧪 服下高级灵药，恢复 68 HP、12 MP（HP 60/60 · MP 22/30 · 高级灵药剩余 0 瓶）', m.join(' | '));
  ok('运行期：大地图灵药档结算一致（hp 20→60 钳制 / mp 10→22 / potion2 1→0）',
    h.hp === 60 && h.mp === 22 && h.potion2 === 0);
}

// E 档：钳制档（战斗药水）——恢复量报公式量 38，括号（HP 60/60）体现上限钳制（55+38=93 → 60）
{
  const h = mkHero({ hp: 55, item: 1 });
  const line = runBattleItem(h);
  ok('运行期：钳制档报「恢复 38 点 HP（HP 60/60 · 药水剩余 0 瓶）」（公式量如实报，钳制由 HP 读数体现）',
    line === '🍖 测试者 服用药水，恢复 38 点 HP（HP 60/60 · 药水剩余 0 瓶）', line);
  ok('运行期：钳制档结算一致（hp 55→60 钳到上限 / item 1→0）', h.hp === 60 && h.item === 0);
}

// F 档：战斗无药拦截零回归——item 0 / potion2 0 且掉血 →「❌ 没有可用的药水了！」，零结算
{
  const h = mkHero({ hp: 30, item: 0, potion2: 0 });
  const line = runBattleItem(h);
  ok('运行期：战斗无药拦截档「❌ 没有可用的药水了！」逐字零回归（hp 30 不变）',
    line === '❌ 没有可用的药水了！' && h.hp === 30, line);
}

// G 档：大地图满状态拦截零回归——hp/mp 全满（有药）→「✅ 状态满满，无需喝药！」，零结算
{
  const h = mkHero({ hp: 60, mp: 30, item: 5, potion2: 1 });
  const m = runWorldPotion(h);
  ok('运行期：大地图满状态拦截档「✅ 状态满满，无需喝药！」逐字零回归（item 5 / potion2 1 不变）',
    m.length === 1 && m[0] === '✅ 状态满满，无需喝药！' && h.item === 5 && h.potion2 === 1, m.join(' | '));
}

// H 档：灵药优先档零回归——item 2 + potion2 1 同时持有 → 走灵药分支（item 不动）
{
  const h = mkHero({ hp: 20, mp: 10, item: 2, potion2: 1 });
  const m = runWorldPotion(h);
  ok('运行期：灵药优先档走灵药分支（报灵药文案且 item 2 不动 / potion2 1→0）',
    m.length === 1 && m[0].startsWith('🧪 服下高级灵药') && h.item === 2 && h.potion2 === 0, m.join(' | '));
}

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2165_potionhp', readme.includes('smoke_v2165_potionhp'));
// v21.66 去硬化（v21.7 惯例）：件套精确计数移交当版冒烟守护，本件改存活性口径——
// 仍含「冒烟/件套」且旧口径「（六十件套清除）」已清除。
ok('README 件套口径为存活性断言（v21.66 起件数由新版冒烟守护：六十二件套（六十一件套清除））',
  readme.includes('冒烟') && readme.includes('件套') &&
  !readme.includes('（六十件套清除）'));
ok('README 含 v21.65 守护描述（喝药战报恢复后 HP/MP 状态守护）',
  readme.includes('喝药战报恢复后 HP/MP 状态守护'));
ok('package.json 已收录 smoke_v2165_potionhp（npm test 串跑第 61 份）', pkg.includes('smoke_v2165_potionhp.mjs'));
const s2164 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2164_achname.mjs'), 'utf8');
ok('smoke_v2164 的 README 件套口径断言已去硬化（存活性口径落位，旧精确表达式零残留）',
  s2164.includes("!readme.includes('（五十九件套清除）')") &&
  !s2164.includes("readme.includes('六十件套（五十九件套清除）')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
