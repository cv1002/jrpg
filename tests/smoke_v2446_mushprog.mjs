// v24.46 专项冒烟：🍄 蘑菇线「菇山菌海 N/25」进度后缀——三处捡蘑菇报文（宝箱蘑菇 / 精英蘑菇 /
// 战斗随机掉落）末尾补成就档位进度
// （体验打磨·信息透明·计数现场·纯显示——承 v24.16 HUD「🚶 千里之行 N/1000」/ v24.17 喝药战报
// 「💧 渴饮甘露 N/10」/ v24.22 胜利战报「⚔️ 驱雾百战 N/100」/ v24.24 精英战报「⚔️ 精英猎手 N/2」/
// v24.40 用药战报「💊 药到病除 N/15」/ v24.42 开箱报文「🎒 满载而归 N/9」同一「计数现场报进度」主线：
// 蘑菇持有线三档（菇香满仓 10 株 / 菇山菌海 25 株 / 菇海无涯 50 株）的资源成就此前只有 C 成就页一行
// X/25，而蘑菇的全部三处获取点（宝箱 60% / 精英必掉 1 株 / 战斗随机 12%）各自报文都只报「共/剩余
// N 株」余额读数，成就档位零 live 窗口——蘑菇线的计数现场正是每次「捡到蘑菇」本身（与 v24.40
// 「同一恢复链路两端口径一致」同族）；现按中档里程碑先例在三条蘑菇报文末尾补「（🍄 菇山菌海 N/25）」
// （分子读 hero.mushrooms 防御式 (hero.mushrooms||0)、分母读 data.js MUSH2_GOAL 单一数据源，与
// C 页/ACH_LIST mush2 的 ok/prog 同读一份源，调阈值只改 data.js 一处全端自动跟随；英雄落账先于
// 报文、进度差分即本株；同 v24.19/v24.25 只报中档里程碑先例——菇香满仓 N/10 与菇海无涯 N/50
// 同线另两档由 C 页承载），纯显示零结算零存档零数值变化（mushrooms 计数/掉落/酿造/成就判定逐字未动）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.46 注释 / GAME_VERSION v24.46 与旧 v24.45 字面量
// 零残留 / v24.45 历史注释保留）、运行期常量实值（MUSH_GOAL 10 / MUSH2_GOAL 25 / MUSH3_GOAL 50）
// 与 ACH_LIST mush2 同源互证（ok/prog/d 逐值·无 r 字段）、world.js 源级（import 追加 MUSH2_GOAL +
// 蘑菇报文后缀逐字 + 旧报文零残留 + 计数/掉落/成就判定零回归）、battle.js 源级（精英蘑菇报文后缀
// 逐字 + 既有⚔️ 精英猎手后缀零回归 + import 邻位保留）、rules.js 源级（战斗随机蘑菇掉落后缀逐字 +
// import 追加 + 旧报文零残留）、运行期真实路径（STEP_HANDLERS[TY.CHEST] 蘑菇档后缀 · winBattle
// 精英档后缀 · rollDrop 蘑菇档后缀 · 已开箱/普通怪零蘑菇报文零噪音）、README/package.json/
// CHANGELOG 同步（件套口径 270 + v24.46 守护描述 + smoke_v2446_mushprog 入库（282 份）+
// package 串尾 + CHANGELOG 顶 pin）、哨兵链（前望 275 且 README 尚无 275 口径）、旧代 v24.45 pin
// 全库零残留扫描（豁免本套件与上一版套件否定式）。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v24.45 冒烟先例：先装桩再 import main.js）——
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
const { STEP_HANDLERS } = await import('../js/world.js');
const { bind } = await import('../js/bind.js');
const { GAME_VERSION, TY, MUSH_GOAL, MUSH2_GOAL, MUSH3_GOAL, ACH_LIST, chestCount } = await import('../js/data.js');
const { winBattle } = await import('../js/battle.js');
const { rollDrop } = await import('../js/rules.js');
// 音效桩：开箱/战斗路径会调 SFX.*，测试只关心报文与结算
const { SFX } = await import('../js/audio.js');
SFX.chest = () => {}; SFX.item = () => {}; SFX.coin = () => {}; SFX.levelup = () => {}; SFX.victory = () => {};

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.46 蘑菇线「🍄 菇山菌海 N/25」进度后缀 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const wSrc = read('js/world.js');
const bSrc = read('js/battle.js');
const rSrc = read('js/rules.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.45）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.45', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] >= 46)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js 含 v24.46 注释（蘑菇线「🍄 菇山菌海 N/25」进度后缀）',
  dSrc.includes('v24.46 体验打磨·信息透明·计数现场'));
ok('data.js GAME_VERSION 字面量已为 v24.46（旧 v24.45 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.58';") && !dSrc.includes("const GAME_VERSION = 'v24.45';"));
ok('data.js 仍保留 v24.45/v24.44 历史注释（金币第九轮/第八轮，累积注释块）',
  dSrc.includes('v24.45 数值平衡·后期金币曲线续平滑') && dSrc.includes('v24.44 数值平衡·后期金币曲线续平滑'));

// —— 数据契约：MUSH 家族 / ACH_LIST mush2 同源互证 ——
ok('MUSH_GOAL===10 · MUSH2_GOAL===25 · MUSH3_GOAL===50（蘑菇持有线三档 10/25/50 单一数据源）',
  MUSH_GOAL === 10 && MUSH2_GOAL === 25 && MUSH3_GOAL === 50,
  `${MUSH_GOAL}/${MUSH2_GOAL}/${MUSH3_GOAL}`);
const muAch = ACH_LIST.find((a) => a.id === 'mush2');
ok('ACH_LIST 含 mush2「菇山菌海」且 id 唯一', !!muAch && muAch.name === '菇山菌海' &&
  ACH_LIST.filter((a) => a.id === 'mush2').length === 1);
ok('mush2 描述/判定/进度读 MUSH2_GOAL 与 mushrooms（三端同源零裸字面量）',
  !!muAch && muAch.d === `持有 ${MUSH2_GOAL} 株魔法蘑菇` &&
  String(muAch.ok).includes('(g.mushrooms||0)>=MUSH2_GOAL') && String(muAch.prog).includes('MUSH2_GOAL'));
ok('mush2 无 r 字段纯里程碑（菇山菌海本身就是奖励）', !!muAch && !('r' in muAch));
ok('mush2 0/24/25/50 四档谓词逐值（缺字段 0/25 旧档零迁移、超阈值不钳制）',
  muAch.ok({ mushrooms: 0 }) === false && muAch.prog({}) === `0/${MUSH2_GOAL}` &&
  muAch.ok({ mushrooms: 24 }) === false && muAch.prog({ mushrooms: 3 }) === `3/${MUSH2_GOAL}` &&
  muAch.ok({ mushrooms: 25 }) === true && muAch.ok({ mushrooms: 50 }) === true);
ok('蘑菇线首档 mush（菇香满仓）仍为 10 · 封顶 mush3（菇海无涯）仍为 50（逐字零回归）',
  ACH_LIST.find((a) => a.id === 'mush').d === `持有 ${MUSH_GOAL} 株魔法蘑菇` &&
  ACH_LIST.find((a) => a.id === 'mush2').name === '菇山菌海' && muAch.prog({ mushrooms: 25 }) === `25/${MUSH2_GOAL}` &&
  ACH_LIST.find((a) => a.id === 'mush3').d === `持有 ${MUSH3_GOAL} 株魔法蘑菇`);

// —— world.js 源级落位 ——
ok('world.js 自 data.js 追加导入 MUSH2_GOAL（import 行邻位保留，零新增模块依赖）',
  wSrc.includes('chestTotal, MUSH2_GOAL, dayPhase, STEP_GOAL, OUTSTEP2_GOAL, TREASURE2_GOAL } from'));
ok('world.js 含 v24.46 注释（蘑菇报文进度后缀说明）', wSrc.includes('v24.46 体验打磨·信息透明·计数现场'));
ok('world.js 蘑菇报文模板逐字（共 ${hero.mushrooms} 株 · 已开 ${opened}/${total} + 满载而归 + 菇山菌海）',
  wSrc.includes('`🍄 找到魔法蘑菇！（共 ${hero.mushrooms} 株${qm} · 已开 ${opened}/${total}）${chestProg}（🍄 菇山菌海 ${hero.mushrooms}/${MUSH2_GOAL}）`'));
ok('world.js 恰 1 处蘑菇报文携带菇山菌海后缀（宝箱蘑菇分支专属端口）',
  (wSrc.match(/🍄 菇山菌海 \$\{hero\.mushrooms\}\/\$\{MUSH2_GOAL\}/g) || []).length === 1,
  String((wSrc.match(/🍄 菇山菌海 \$\{hero\.mushrooms\}\/\$\{MUSH2_GOAL\}/g) || []).length));
ok('world.js 金币/药水两分支报文零回归（仅蘑菇分支带菇山菌海，满载而归后缀三条并存）',
  wSrc.includes('`📦 宝箱！获得 ${gold} 金币（共 ${hero.gold} 枚 · 已开 ${opened}/${total}）${chestProg}`') &&
  wSrc.includes('`📦 宝箱！获得 1 个🍖 生命药水（共 ${hero.item} 瓶 · 已开 ${opened}/${total}）${chestProg}`'));
ok('world.js 旧蘑菇报文（无菇山菌海后缀原句）零残留',
  !wSrc.includes('`🍄 找到魔法蘑菇！（共 ${hero.mushrooms} 株${qm} · 已开 ${opened}/${total}）${chestProg}`'));
ok('world.js 计数/掉落/成就判定零回归（hero.chests.add 先于 applyAchievements · 概率判定原位）',
  wSrc.includes('hero.chests.add(x + \',\' + y);') && wSrc.includes('applyAchievements();') &&
  wSrc.includes('Math.random() < CHEST_MUSHROOM') && wSrc.includes('else if (Math.random() < CHEST_GOLD)'));
ok('world.js 蘑菇支线任务后缀与「蘑菇集齐」里程碑零回归（MUSHROOM_GOAL / MILESTONE_MS 原位）',
  wSrc.includes('任务还差 ${MUSHROOM_GOAL - hero.mushrooms} 株') &&
  wSrc.includes("bind.boxMsg('💡 蘑菇集齐了！回去找灯长领取奖励吧！', MILESTONE_MS)"));

// —— battle.js 源级落位 ——
ok('battle.js 自 data.js 追加导入 MUSH2_GOAL（import 行邻位保留，既有 pin 子串零破坏）',
  bSrc.includes('RICH2_GOAL, MUSH2_GOAL, LVL10_GOAL, dayPhase, QUESTS } from'));
ok('battle.js 含 v24.46 注释（精英蘑菇报文进度后缀说明）', bSrc.includes('v24.46 体验打磨·信息透明·计数现场'));
ok('battle.js 精英蘑菇报文模板逐字（剩余 N 株 + ⚔️ 精英猎手 + 🍄 菇山菌海 两后缀并存）',
  bSrc.includes('`💎 从魔像残骸中捡到 1 株魔法蘑菇！（剩余 ${hero.mushrooms || 0} 株）（⚔️ 精英猎手 ${eliteN}/2）（🍄 菇山菌海 ${hero.mushrooms || 0}/${MUSH2_GOAL}）`'));
ok('battle.js 旧精英蘑菇模板（无菇山菌海后缀）零残留',
  !bSrc.includes('`💎 从魔像残骸中捡到 1 株魔法蘑菇！（剩余 ${hero.mushrooms || 0} 株）（⚔️ 精英猎手 ${eliteN}/2）`'));
ok('battle.js eliteN 与 ACH_LIST elites prog 同式（各计 1 / 防御式 old 档零迁移）',
  bSrc.includes('const eliteN = (((hero.bestiary || {})[ELITE_GOLEM.name] || 0) >= 1 ? 1 : 0) + (((hero.bestiary || {})[EMBER_GOLEM.name] || 0) >= 1 ? 1 : 0);'));
ok('battle.js hero.mushrooms++ 先于 boxMsg 落账（进度差分即本株）',
  bSrc.indexOf('hero.mushrooms++;') < bSrc.indexOf('（🍄 菇山菌海 ${hero.mushrooms || 0}/${MUSH2_GOAL}）'));

// —— rules.js 源级落位 ——
ok('rules.js 自 data.js 追加导入 MUSH2_GOAL（import 行邻位保留，零新增模块依赖）',
  rSrc.includes('DROP_MUSHROOM, MUSH2_GOAL, DROP_ELIXIR'));
ok('rules.js 含 v24.46 注释（战斗随机蘑菇掉落报文进度后缀说明）',
  rSrc.includes('v24.46 体验打磨·信息透明·计数现场'));
ok('rules.js 蘑菇掉落文案模板逐字（剩余 N 株 + 🍄 菇山菌海 后缀）',
  rSrc.includes('`🍄 掉落：魔法蘑菇 ×1（剩余 ${hero.mushrooms || 0} 株）（🍄 菇山菌海 ${hero.mushrooms || 0}/${MUSH2_GOAL}）`'));
ok('rules.js 旧蘑菇掉落文案（无菇山菌海后缀）零残留',
  !rSrc.includes('`🍄 掉落：魔法蘑菇 ×1（剩余 ${hero.mushrooms || 0} 株）`'));
ok('rules.js 掉落判定零回归（DROP_MUSHROOM 单一数据源与 v19.83 同法）',
  rSrc.includes('edgeMushroom = edgePotion + DROP_MUSHROOM') && rSrc.includes('hero.mushrooms++;'));

// —— 运行期三端口 ——
let lastMsg = '';
const origBox = bind.boxMsg;
bind.boxMsg = (m) => { lastMsg = m; };
function openChest(seq, cx, cy) {
  const orig = Math.random;
  let i = 0;
  Math.random = () => (i < seq.length ? seq[i++] : 0.5);
  try { STEP_HANDLERS[TY.CHEST](cx, cy, S.G); }
  finally { Math.random = orig; }
  return lastMsg;
}
// 宝箱蘑菇档（蘑菇分支门 = curMap()===S.G.map==='dungeon；rand 0.1 < 0.6）——报文带「（🍄 菇山菌海 1/25）」
S.G.chests = new Set(['1,1']); // 预开 1 只 → 本只后已开 2/12 · 满载而归 2/9
S.G.mushrooms = 0; S.G.gold = 100; S.G.item = 5; S.G.level = 1;
S.scene = 'world';
const prevMap = S.G.map; S.G.map = 'dungeon';
const mMsg = openChest([0.1], 2, 2);
ok('运行期宝箱蘑菇档报文：「🍄 找到魔法蘑菇！（共 1 株 · 已开 2/12）（🎒 满载而归 2/9）（🍄 菇山菌海 1/25）」',
  mMsg.includes('找到魔法蘑菇') && mMsg.includes('共 1 株') && mMsg.includes('已开 2/12') &&
  mMsg.includes('（🎒 满载而归 2/9）') && mMsg.includes('（🍄 菇山菌海 1/25）'), mMsg);
ok('运行期宝箱蘑菇档结算一致：mushrooms 0→1 · chests 已含 2,2 · chestCount===2',
  S.G.mushrooms === 1 && S.G.chests.has('2,2') && chestCount(S.G) === 2);
S.G.map = prevMap;
// 达标档：预置 24 株 → 开箱后 25/25（成就判定与报文并存：mush2 不因本版新增判定点，applyAchievements 既有通路）
S.G.chests = new Set(['1,1']); S.G.mushrooms = 24; S.G.gold = 100; S.G.item = 5;
S.G.map = 'dungeon';
const nMsg = openChest([0.1], 2, 2);
S.G.map = prevMap;
ok('运行期宝箱蘑菇档 24→25 报文带「（🍄 菇山菌海 25/25）」（中档达标瞬间一眼之数）',
  nMsg.includes('（🍄 菇山菌海 25/25）'), nMsg);
S.G.mushrooms = 0;
bind.boxMsg = origBox;
// 精英蘑菇档（winBattle 真实路径 + bind.boxMsg 捕获，承 v24.23 同款桩法）
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 5, hp: 80, hpMax: 80, mp: 30, mpMax: 30,
    atkMax: 30, defMax: 40, gold: 0, xp: 0, xpNext: 9999, item: 1, potion2: 0,
    weapon: '铁剑', armor: '皮甲', diff: null, skills: ['火焰斩'], ach: [],
    poison: 0, seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, totalWins: 0,
    mushrooms: 0, x: 1, y: 1, map: 'cave' }, extra || {});
}
function mkFoe(extra) {
  return Object.assign({ name: '骷髅兵', hp: 0, hpMax: 26, atk: 8, def: 5, xp: 16, gold: 15, color: '#d9d3c0', isElite: false }, extra || {});
}
function runWin(hero, enemy) {
  const msgs = [];
  const oBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  const oldRand = Math.random;
  Math.random = () => 0.99;   // 关闭战斗随机掉落（rollDrop 38% 档），只验精英战报
  try {
    S.G = hero; S.scene = 'battle'; S.enemy = enemy; S.battleBusy = true;
    winBattle();
    return msgs;
  } finally {
    bind.boxMsg = oBox;
    Math.random = oldRand;
    S.enemy = null; S.scene = 'world'; S.battleBusy = false;
  }
}
const hA = mkHero({});
const mA = runWin(hA, mkFoe({ name: '石心魔像', isElite: true, xp: 40, gold: 45 }));
ok('运行期精英档报文含「…剩余 1 株）（⚔️ 精英猎手 1/2）（🍄 菇山菌海 1/25）」',
  mA.some((m) => m.includes('💎 从魔像残骸中捡到 1 株魔法蘑菇！（剩余 1 株）（⚔️ 精英猎手 1/2）（🍄 菇山菌海 1/25）')), mA.join(' | '));
ok('运行期精英档蘑菇落账（mushrooms 0→1，v19.79/v24.23 零回归）', hA.mushrooms === 1, String(hA.mushrooms));
ok('运行期普通怪胜利零蘑菇报文（isElite 分支专属）',
  !runWin(mkHero({}), mkFoe()).some((m) => m.includes('魔像残骸')));
// 战斗随机掉落蘑菇档（rollDrop 纯函数直调：强制 0.21 ∈ [0.20, 0.32) 蘑菇档）
{
  const h = mkHero({ map: 'dungeon' });
  const orig = Math.random;
  Math.random = () => 0.21;
  let drop = '';
  try { drop = rollDrop(h, 'dungeon'); }
  finally { Math.random = orig; }
  ok('运行期战斗随机掉落蘑菇档文案含「🍄 掉落：魔法蘑菇 ×1（剩余 1 株）（🍄 菇山菌海 1/25）」',
    drop.includes('🍄 掉落：魔法蘑菇 ×1（剩余 1 株）（🍄 菇山菌海 1/25）'), drop);
  ok('运行期战斗随机掉落蘑菇档落账（mushrooms 0→1）', h.mushrooms === 1, String(h.mushrooms));
}

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为冒烟二百八十二件套（二百八十一件套清除）',
  readme.includes('冒烟二百八十二件套（二百八十一件套清除）'));
ok('README tests 含 v24.46 守护描述与 smoke_v2446_mushprog 入库（282 份）',
  readme.includes('v24.46 起含 蘑菇线「🍄 菇山菌海 N/25」进度后缀守护') &&
  readme.includes('smoke_v2446_mushprog 入库（282 份）'));
ok('README 成就 bullet 含 v24.46 蘑菇线进度后缀口径（**v24.46 起捡蘑菇/精英蘑菇报文带「🍄 菇山菌海 N/25」进度后缀**）',
  readme.includes('**v24.46 起捡蘑菇报文带「🍄 菇山菌海 N/25」进度后缀**'));
ok('README 尚无 275 件套口径（哨兵前望 275 语义：下一版才写 275）',
  !readme.includes('二百八十三件套') && !readme.includes('冒烟二百八十三件套'));
ok('README 仍保留 v24.45/v24.42 守护描述（金币第九轮/开箱进度后缀，历史保留）',
  readme.includes('v24.45 起含 「后期金币曲线续平滑（第九轮）」守护') &&
  readme.includes('v24.42 起含 「📦 开箱报文「🎒 满载而归 N/9」进度后缀」守护'));
ok('README tests 树串尾已延伸至 smoke_v2446_mushprog（... + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp（npm test 串跑））',
  readme.includes('smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp（npm test 串跑）'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 273 份（smoke.mjs + 272 专项）', chain.length === 281 && chainAll.length === 282, String(chain.length));
ok('package.json 链尾为 smoke_v2446_mushprog（第 273 份）', chain[chain.length - 1] === 'smoke_v2458_pondlamp', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2446_mushprog.mjs（node tests/ 前缀形态）',
  pkgRaw.includes('node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs'));
ok('package.json 链锚逐字（...smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs"）',
  pkgRaw.includes('smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.46（startsWith）', changelog.startsWith('## v24.58 '));
ok('CHANGELOG v24.46 条目含「菇山菌海」「进度后缀」「计数现场」',
  changelog.includes('菇山菌海') && changelog.includes('进度后缀') && changelog.includes('计数现场'));
ok('CHANGELOG 仍保留 v24.45 与 v24.42 条目（历史保留）',
  changelog.includes('## v24.45 数值平衡') && changelog.includes('## v24.42 体验打磨'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(chainAll.map((f) => f.replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 270 与实跑链恒等', files.length === 282, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：v2415 树串守护已推进至新链尾 + 前望 275 ——
const t2415 = read('tests/smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v2446_mushprog（第 273 份）',
  t2415.includes("chain[chain.length - 1] === 'smoke_v2458_pondlamp'"));
ok('smoke_v2415 树串 token 数已推进至 270', t2415.includes('treeTok.length === 282'));
ok('smoke_v2415 哨兵「尚无 275」口径（二百七十四件套 bare 否定式）',
  t2415.includes("!readme.includes('二百八十三件套')"));
const s2429 = read('tests/smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 哨兵链已推进至「前望 275」口径（二百七十四件套 括号/冒烟 bare 否定式）',
  s2429.includes("!readme.includes('二百七十七件套（二百七十七件套清除）')") &&
  s2429.includes("!readme.includes('冒烟二百八十三件套')"));
ok('smoke_v2429 既有断言随新现实推进（件套口径 274 + 链尾 v2450 + 入库 274）',
  s2429.includes('二百八十二件套（二百八十一件套清除）') && s2429.includes("=== 'smoke_v2458_pondlamp'") &&
  s2429.includes('入库（282 份）'));

// —— 旧代 pin 零残留扫描（v24.45 / 269 口径；豁免本套件与上一版套件否定式）——
const leftovers = [];
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v2446_mushprog.mjs') continue;
  // 承 v24.45 同款豁免：上一版套件（smoke_v2445_goldcurve9）合法的历史/否定式字面量不入扫描。
  if (f === 'smoke_v2445_goldcurve9.mjs') continue;
  const s2 = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s2.includes("const GAME_VERSION = 'v24.45';") || s2.includes("GAME_VERSION === 'v24.45'") ||
      s2.includes("startsWith('## v24.45") || s2.includes('入库（269 份）') ||
      s2.includes('二百六十九件套（二百六十八件套清除）') ||
      s2.includes("testChain === 269") || s2.includes("fileCount === 269") ||
      s2.includes("files.length === 269") || s2.includes("chainAll.length === 269") ||
      s2.includes("treeTok.length === 269") || s2.includes("chain[chain.length - 1] === 'smoke_v2445_goldcurve9'")) leftovers.push(f);
}
ok('全库测试零残留 v24.45 GAME_VERSION/顶 pin/269 口径（哨兵链，豁免本套件与上一版否定式）',
  leftovers.length === 0, leftovers.join(','));

console.log(`— v24.46 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
