// v24.42 专项冒烟：📦 开箱报文补「🎒 满载而归 N/9」成就档位进度后缀
// （体验打磨·信息透明·计数现场·纯显示——承 v24.16 HUD「🚶 千里之行 N/1000」/ v24.17 喝药战报
// 「💧 渴饮甘露 N/10」/ v24.22 胜利战报「⚔️ 驱雾百战 N/100」/ v24.40 用药战报「💊 药到病除 N/15」
// 同一「计数现场报进度」主线：v22.26 给三条开箱报文（蘑菇/金币/药水）补的「已开 X/全图 12」是收集
// 口径（一箱不漏全图档 chestTotal()），成就档位「满载而归 X/9」（宝箱线中档里程碑 = 开箱寻宝 6 只 /
// 满载而归 9 只 / 一箱不漏 12 只，TREASURE2_GOAL 单一数据源，ACH_LIST chests2，计数 chestCount(hero)
// 由 world.onChestStep hero.chests.add 唯一写入点派生）此前只藏在 C 成就页一行 X/9（I 页 v22.9 起改
// 收集四件套口径后零 live 窗口）——宝箱线的计数现场正是每次开箱本身；现同 v24.22 同款在三条报文
// 末尾补「（🎒 满载而归 N/9）」（分子读 chestCount(hero) 与 v22.26 同式、分母读 data.js TREASURE2_GOAL
// 单一数据源，与 C 页/ACH_LIST chests2 的 ok/prog 同读一份源，调阈值只改 data.js 一处全端自动跟随；
// hero.chests.add 先于 applyAchievements/报文落账，进度差分即本只；同 v24.19/v24.25 只报中档里程碑
// 先例——开箱寻宝 N/6 与一箱不漏 N/12 同线另两档由 C 页承载），纯显示零结算零存档零数值变化）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.42 注释 / GAME_VERSION v24.42 与旧 v24.41 字面量
// 零残留 / v24.41 历史注释保留）、运行期常量实值（TREASURE2_GOAL 9 / TREASURE_GOAL 6 / chestTotal 12）
// 与 ACH_LIST chests2 同源互证（ok/prog/d 逐值·无 r 字段）、world.js 源级（import 追加 TREASURE2_GOAL +
// chestProg 计算一处 + 三条报文后缀逐字 + 旧报文零残留 + 计数/掉落/成就判定零回归）、运行期真实
// STEP_HANDLERS[TY.CHEST] 路径（三分支 2/9 后缀 · 9→10 达标当场解锁「满载而归」· 缺数组旧档防御式
// 0→1 · 已开箱格再踩零计数 · 蘑菇支线任务后缀零回归）、README/package.json/CHANGELOG 同步（件套
// 口径 266 + v24.42 守护描述 + smoke_v2442_chestprog 入库（281 份）+ package 串尾 + CHANGELOG 顶 pin）、
// 哨兵链（前望 275 且 README 尚无 275 口径）、旧代 v24.41 pin 全库零残留扫描（豁免本套件与上一版
// 套件否定式）。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v24.41 冒烟先例：先装桩再 import main.js）——
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
const { GAME_VERSION, TY, TREASURE_GOAL, TREASURE2_GOAL, ACH_LIST, chestCount, chestTotal } = await import('../js/data.js');
// 音效桩：开箱路径会调 SFX.chest（v23.49 起弃用 item/coin），测试只关心报文与结算
const { SFX } = await import('../js/audio.js');
SFX.chest = () => {}; SFX.item = () => {}; SFX.coin = () => {}; SFX.levelup = () => {};

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.42 开箱报文「🎒 满载而归 N/9」进度后缀 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const wSrc = read('js/world.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.41）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.41', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] >= 42)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js 含 v24.42 注释（开箱报文「🎒 满载而归 N/9」进度后缀）',
  dSrc.includes('v24.42 体验打磨·信息透明·计数现场：📦 开箱报文补'));
ok('data.js GAME_VERSION 字面量已为 v24.42（旧 v24.41 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.57';") && !dSrc.includes("const GAME_VERSION = 'v24.41';"));
ok('data.js 仍保留 v24.41/v24.40 历史注释（经验第五轮/用药战报，累积注释块）',
  dSrc.includes('v24.41 数值平衡·后期经验曲线续平滑') && dSrc.includes('v24.40 体验打磨·信息透明·计数现场'));

// —— 数据契约：TREASURE2_GOAL / ACH_LIST chests2 同源互证 ——
ok('TREASURE_GOAL===6 · TREASURE2_GOAL===9 · chestTotal()===12（宝箱线三档 6/9/12 单一数据源）',
  TREASURE_GOAL === 6 && TREASURE2_GOAL === 9 && chestTotal() === 12,
  `${TREASURE_GOAL}/${TREASURE2_GOAL}/${chestTotal()}`);
const chAch = ACH_LIST.find((a) => a.id === 'chests2');
ok('ACH_LIST 含 chests2「满载而归」且 id 唯一', !!chAch && chAch.name === '满载而归' &&
  ACH_LIST.filter((a) => a.id === 'chests2').length === 1);
ok('chests2 描述/判定/进度读 TREASURE2_GOAL 与 chestCount（三端同源零裸字面量）',
  !!chAch && chAch.d === `累计开启 ${TREASURE2_GOAL} 个宝箱` &&
  String(chAch.ok).includes('chestCount(g)') && String(chAch.prog).includes('chestCount(g)'));
ok('chests2 无 r 字段纯里程碑（满载而归本身就是奖励）', !!chAch && !('r' in chAch));
ok('chests2 0/8/9/12 四档谓词逐值（缺字段 0/9 旧档零迁移、超阈值不钳制）',
  chAch.ok({ chests: new Set() }) === false && chAch.prog({}) === `0/${TREASURE2_GOAL}` &&
  chAch.ok({ chests: new Set(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']) }) === false &&
  chAch.prog({ chests: new Set(['a', 'b']) }) === `2/${TREASURE2_GOAL}` &&
  chAch.ok({ chests: new Set(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']) }) === true &&
  chAch.ok({ chests: new Set(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l']) }) === true);
ok('宝箱线首档 chests（开箱寻宝）仍为 6 · 封顶 allchests 走 chestTotal（逐字零回归）',
  ACH_LIST.find((a) => a.id === 'chests').d === `累计开启 ${TREASURE_GOAL} 个宝箱` &&
  String(ACH_LIST.find((a) => a.id === 'allchests').ok).includes('chestTotal()'));

// —— world.js 源级落位 ——
ok('world.js 自 data.js 追加导入 TREASURE2_GOAL（import 行邻位保留，零新增模块依赖）',
  wSrc.includes('dayPhase, STEP_GOAL, OUTSTEP2_GOAL, TREASURE2_GOAL } from'));
ok('world.js 含 v24.42 注释（开箱报文进度后缀说明）', wSrc.includes('v24.42 开箱报文补「🎒 满载而归 N/9」'));
ok('world.js chestProg 计算逐字落位（分子 chestCount(hero) 与 v22.26 同式 · 分母 TREASURE2_GOAL）',
  wSrc.includes('const chestProg = `（🎒 满载而归 ${opened}/${TREASURE2_GOAL}）`;'));
ok('world.js 恰 3 处报文携带「已开 ${opened}/${total}」且追加 ${chestProg}（蘑菇/金币/药水）',
  (wSrc.match(/已开 \$\{opened\}\/\$\{total\}\）\$\{chestProg\}/g) || []).length === 3,
  String((wSrc.match(/已开 \$\{opened\}\/\$\{total\}\）\$\{chestProg\}/g) || []).length));
ok('world.js 旧三条报文（无进度后缀原句）零残留',
  !wSrc.includes('`🍄 找到魔法蘑菇！（共 ${hero.mushrooms} 株${qm} · 已开 ${opened}/${total}）`') &&
  !wSrc.includes('`📦 宝箱！获得 ${gold} 金币（共 ${hero.gold} 枚 · 已开 ${opened}/${total}）`') &&
  !wSrc.includes('`📦 宝箱！获得 1 个🍖 生命药水（共 ${hero.item} 瓶 · 已开 ${opened}/${total}）`'));
ok('world.js 计数/掉落/成就判定零回归（hero.chests.add 先于 applyAchievements · 概率判定原位）',
  wSrc.includes('hero.chests.add(x + \',\' + y);') && wSrc.includes('applyAchievements();') &&
  wSrc.includes('Math.random() < CHEST_MUSHROOM') && wSrc.includes('else if (Math.random() < CHEST_GOLD)'));
ok('world.js 蘑菇支线任务后缀与「蘑菇集齐」里程碑零回归（MUSHROOM_GOAL / MILESTONE_MS 原位）',
  wSrc.includes('任务还差 ${MUSHROOM_GOAL - hero.mushrooms} 株') &&
  wSrc.includes("bind.boxMsg('💡 蘑菇集齐了！回去找灯长领取奖励吧！', MILESTONE_MS)"));
ok('world.js v22.26/v23.49 历史注释保留（进度/音效累积注释块）',
  wSrc.includes('v22.26 开箱反馈追加宝箱进度') && wSrc.includes('v23.49 宝箱开启专属音效'));

// —— 运行期三档（强制 Math.random 序列，走真实 STEP_HANDLERS[TY.CHEST]）——
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
// 蘑菇档（蘑菇分支门 = curMap()===S.G.map==='dungeon；rand 0.1 < 0.6）——报文带「（🎒 满载而归 2/9）」
S.G.chests = new Set(['1,1']); // 预开 1 只 → 本只后已开 2/12 · 满载而归 2/9
S.G.mushrooms = 0; S.G.gold = 100; S.G.item = 5; S.G.level = 1;
S.scene = 'world';
const prevMap = S.G.map; S.G.map = 'dungeon';
const mMsg = openChest([0.1], 2, 2);
ok('运行期蘑菇档报文：「🍄 找到魔法蘑菇！（共 1 株 · 已开 2/12）（🎒 满载而归 2/9）」',
  mMsg.includes('找到魔法蘑菇') && mMsg.includes('共 1 株') && mMsg.includes('已开 2/12') &&
  mMsg.includes('（🎒 满载而归 2/9）'), mMsg);
ok('运行期蘑菇档未接支线：无「任务还差」后缀且满载而归后缀在（零噪音 + 新口径）',
  !mMsg.includes('任务还差') && mMsg.includes('满载而归'), mMsg);
ok('运行期蘑菇档结算一致：mushrooms 0→1 · chests 已含 2,2 · chestCount===2',
  S.G.mushrooms === 1 && S.G.chests.has('2,2') && chestCount(S.G) === 2);
S.G.map = prevMap;
// 金币档（地图非 dungeon → 蘑菇分支短路；rand 0.3 < 0.45 → 金币）
S.G.chests = new Set(['1,1']); S.G.gold = 100; S.G.item = 5; S.G.mushrooms = 0;
const gMsg = openChest([0.3], 2, 2);
ok('运行期金币档报文：「📦 宝箱！获得 17 金币（共 117 枚 · 已开 2/12）（🎒 满载而归 2/9）」',
  gMsg.includes('获得 17 金币') && gMsg.includes('共 117 枚') && gMsg.includes('已开 2/12') &&
  gMsg.includes('（🎒 满载而归 2/9）'), gMsg);
ok('运行期金币档结算一致：gold 100→117 · chestCount===2', S.G.gold === 117 && chestCount(S.G) === 2);
// 药水档（rand 0.9：非蘑菇、非金币 → 药水）
S.G.chests = new Set(['1,1']); S.G.gold = 100; S.G.item = 5; S.G.mushrooms = 0;
const pMsg = openChest([0.9], 2, 2);
ok('运行期药水档报文：「📦 宝箱！获得 1 个🍖 生命药水（共 6 瓶 · 已开 2/12）（🎒 满载而归 2/9）」',
  pMsg.includes('生命药水') && pMsg.includes('共 6 瓶') && pMsg.includes('已开 2/12') &&
  pMsg.includes('（🎒 满载而归 2/9）'), pMsg);
ok('运行期药水档结算一致：item 5→6 · chestCount===2', S.G.item === 6 && chestCount(S.G) === 2);
// 达标档：预开 8 只 → 本只后 9/9 当场解锁「满载而归」（applyAchievements 先于报文落账）
S.G.chests = new Set(['1,1', '2,2', '3,3', '4,4', '5,5', '6,6', '7,7', '8,8']);
S.G.gold = 100; S.G.item = 5; S.G.mushrooms = 0; S.G.ach = [];
const nMsg = openChest([0.3], 9, 9);
ok('运行期第 9 只开箱当场解锁「满载而归」（chestCount 9 且 ach 含 chests2）',
  chestCount(S.G) === 9 && (S.G.ach || []).includes('chests2'), `ach=${JSON.stringify(S.G.ach || [])}`);
ok('运行期达标档报文带「（🎒 满载而归 9/9）」（战报与解锁并存）',
  nMsg.includes('（🎒 满载而归 9/9）'), nMsg);
// 防御档：chestCount 三形态防御式已在「数据契约」逐值断言（缺字段 0/9 旧档零迁移，承 v21.22 同款；
// onChestStep 运行期 hero.chests 恒为 Set（core.newGame/restoreChests 初始化），故运行期不再重复缺失档。
// 已开箱格再踩：不重复计数（chestCount 保持 1、Set 大小不变）
S.G.chests = new Set(['2,2']); S.G.gold = 100; S.G.item = 5; S.G.mushrooms = 0;
const before = chestCount(S.G);
openChest([0.1], 2, 2);
ok('运行期已开箱格再踩不重复计数（chestCount 1→1，Set 不增）',
  chestCount(S.G) === before && chestCount(S.G) === 1 && S.G.chests.size === 1,
  String(chestCount(S.G)) + '/' + S.G.chests.size);
bind.boxMsg = origBox;

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为二百八十一件套（二百八十件套清除）',
  readme.includes('冒烟二百八十一件套（二百八十件套清除）'));
ok('README tests 含 v24.42 守护描述与 smoke_v2442_chestprog 入库（281 份）',
  readme.includes('v24.42 起含 「📦 开箱报文「🎒 满载而归 N/9」进度后缀」守护') &&
  readme.includes('smoke_v2442_chestprog 入库（281 份）'));
ok('README 成就 bullet 含 v24.42 开箱报文进度后缀口径（**v24.42 起开箱报文带「🎒 满载而归 N/9」进度后缀**）',
  readme.includes('**v24.42 起开箱报文带「🎒 满载而归 N/9」进度后缀**'));
ok('README 尚无 275 件套口径（哨兵前望 275 语义：下一版才写 275）',
  !readme.includes('二百八十二件套') && !readme.includes('冒烟二百八十二件套'));
ok('README 仍保留 v24.41/v24.40 守护描述（经验第五轮/用药战报，历史保留）',
  readme.includes('v24.41 起含 「后期经验曲线续平滑（第五轮）」守护') &&
  readme.includes('v24.40 起含 「战斗用药战报「💊 药到病除 N/15」进度后缀」守护'));
ok('README tests 树串尾已延伸至 smoke_v2442_chestprog（... + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin（npm test 串跑））',
  readme.includes('smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin（npm test 串跑）'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 273 份（smoke.mjs + 272 专项）', chain.length === 280 && chainAll.length === 281, String(chain.length));
ok('package.json 链尾为 smoke_v2442_chestprog（第 273 份）', chain[chain.length - 1] === 'smoke_v2457_nightwin', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2442_chestprog.mjs（node tests/ 前缀形态）',
  pkgRaw.includes('node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs'));
ok('package.json 链锚逐字（smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs"）',
  pkgRaw.includes('smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.42（startsWith）', changelog.startsWith('## v24.57 '));
ok('CHANGELOG v24.42 条目含「满载而归」「进度后缀」「计数现场」',
  changelog.includes('满载而归') && changelog.includes('进度后缀') && changelog.includes('计数现场'));
ok('CHANGELOG 仍保留 v24.41 与 v24.40 条目（历史保留）',
  changelog.includes('## v24.41 数值平衡') && changelog.includes('## v24.40 体验打磨'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(chainAll.map((f) => f.replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 266 与实跑链恒等', files.length === 281, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：v2415 树串守护已推进至新链尾 + 前望 275 ——
const t2415 = read('tests/smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v2442_chestprog（第 273 份）',
  t2415.includes("chain[chain.length - 1] === 'smoke_v2457_nightwin'"));
ok('smoke_v2415 树串 token 数已推进至 266', t2415.includes('treeTok.length === 281'));
ok('smoke_v2415 哨兵「尚无 275」口径（二百七十四件套 bare 否定式）',
  t2415.includes("!readme.includes('二百八十二件套')"));
const s2429 = read('tests/smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 哨兵链已推进至「前望 275」口径（二百七十四件套 括号/冒烟 bare 否定式）',
  s2429.includes("!readme.includes('二百七十七件套（二百七十七件套清除）')") &&
  s2429.includes("!readme.includes('冒烟二百八十二件套')"));
ok('smoke_v2429 既有断言随新现实推进（件套口径 266 + 链尾 v2442 + 入库 266）',
  s2429.includes('二百八十一件套（二百八十件套清除）') && s2429.includes("=== 'smoke_v2457_nightwin'") &&
  s2429.includes('入库（281 份）'));

// —— 旧代 pin 零残留扫描（v24.41 / 265 口径；豁免本套件与上一版套件否定式）——
const leftovers = [];
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v2442_chestprog.mjs') continue;
  // 承 v24.41 同款豁免：上一版套件（smoke_v2441_xpcurve5）合法的历史/否定式字面量不入扫描。
  if (f === 'smoke_v2441_xpcurve5.mjs') continue;
  const s2 = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s2.includes("const GAME_VERSION = 'v24.41';") || s2.includes("GAME_VERSION === 'v24.41'") ||
      s2.includes("startsWith('## v24.41") || s2.includes('入库（265 份）') ||
      s2.includes('二百六十五件套（二百六十四件套清除）') ||
      s2.includes("testChain === 265") || s2.includes("fileCount === 265") ||
      s2.includes("files.length === 265") || s2.includes("chainAll.length === 265") ||
      s2.includes("treeTok.length === 265") || s2.includes("chain[chain.length - 1] === 'smoke_v2441_xpcurve5'")) leftovers.push(f);
}
ok('全库测试零残留 v24.41 GAME_VERSION/顶 pin/265 口径（哨兵链，豁免本套件与上一版否定式）',
  leftovers.length === 0, leftovers.join(','));

console.log(`— v24.42 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
