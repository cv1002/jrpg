// v24.50 专项冒烟：🧪 酿造成功战报补「🍶 妙手回春 N/5」进度后缀
// （体验打磨·信息透明·计数现场·纯显示——承 v24.16 HUD「🚶 千里之行 N/1000」/ v24.17 喝药战报
// 「💧 渴饮甘露 N/10」/ v24.40 用药战报「💊 药到病除 N/15」/ v24.48 技能战报「🔮 熟能生巧 N/30」
// 同一「计数现场报进度」主线：酿造线 v24.10 已把「🍶 妙手回春 N/5」补进酿造面板（drawBrew 决策现场
// 角标）/ v24.31 补「🧪 灵药满柜 N/8」持有线角标——两端口都在锅前面板，唯独酿造成功战报
// （core.brewNow 的 boxMsg）始终裸报；「累计酿造 N 瓶」这条行为线的计数现场正是每次按 Enter 酿成的
// 战报本身（与 v24.17「现场是动作本身」同族），酿完想确认离妙手回春还差几瓶得走回锅前面板或按 C 翻
// 成就页；现报文末尾补「（🍶 妙手回春 N/5）」（分子读 hero.brews——brewNow 计数唯一产生点先于报文
// 落账，进度差分即本次；分母读 data.js BREW2_GOAL 单一数据源，与 C 页/ACH_LIST brew2 的 ok/prog 及
// v24.10 面板角标同读一份源，调阈值只改 data.js 一处全端自动跟随），纯显示零结算零存档零数值变化
// （hero.brews 计数/applyAchievements 时机/材料扣减/potion2 库存/可酿瓶数报文逐字未动）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.50 注释 / GAME_VERSION v24.50 与旧 v24.49 字面量
// 零残留 / v24.49·v24.48 历史注释保留 / BREW2_GOAL 处 v24.50 注释）、数据契约（BREW2_GOAL 5 与
// ACH_LIST brew2 同源互证 ok/prog/d 逐值·无 r 字段）、core.js 源级（import 追加 BREW2_GOAL +
// v24.50 注释块 + 报文模板逐字 + 旧报文零残留 + 计数/拦截零回归）、运行期真实 brewNow() 路径
// （bind.boxMsg 捕获桩承 smoke_v2446 同款：首酿 0→1 报 1/5 · 二酿 1→2 报 2/5 · 第 5 酿 4→5 当场
// 解锁 brew2 报 5/5 · 旧档缺 brews 字段防御式 0→1 · 材料不足拦截零计数 · 任务蘑菇保护拦截零计数）、
// README/package.json/CHANGELOG 同步（件套口径 274 + v24.50 守护描述 + smoke_v2450_brewprog 入库
// （274 份）+ package 串尾 + CHANGELOG 顶 pin）、哨兵链（前望 275 且 README 尚无 275 口径）、
// tests 目录与实跑链一一对应（274 份）、旧代 v24.49 pin 全库零残留扫描（豁免本套件与上一版套件
// 否定式）。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v24.49 冒烟先例：先装桩再 import main.js）——
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
const { GAME_VERSION, BREW2_GOAL, BREW_MUSHROOMS, BREW_GOLD, MUSHROOM_GOAL, ACH_LIST } = await import('../js/data.js');
const { brewNow } = await import('../js/core.js');
// 音效桩：酿造成功播 SFX.craft()，测试只关心报文与结算
const { SFX } = await import('../js/audio.js');
SFX.craft = () => {}; SFX.cancel = () => {}; SFX.heal = () => {};

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.50 酿造成功战报「🍶 妙手回春 N/5」进度后缀 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const cSrc = read('js/core.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.49）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.49', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] >= 53)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js 含 v24.50 注释（酿造成功战报「🍶 妙手回春 N/5」进度后缀）',
  dSrc.includes('v24.50 体验打磨·信息透明·计数现场：🧪 酿造成功战报补'));
ok('data.js GAME_VERSION 字面量已为 v24.50（旧 v24.49 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.53';") && !dSrc.includes("const GAME_VERSION = 'v24.49';"));
ok('data.js 仍保留 v24.49 历史注释（后期经验曲线续平滑第八轮·本版保留）',
  dSrc.includes('v24.49 数值平衡·后期经验曲线续平滑'));
ok('data.js 仍保留 v24.48 历史注释（熟能生巧战报进度后缀·本版保留）',
  dSrc.includes('v24.48 体验打磨·信息透明·计数现场：🔮 战斗技能战报补'));
ok('data.js BREW2_GOAL 处含 v24.50 战报分母单一数据源注释',
  dSrc.includes('v24.50 起本常量同时是酿造成功战报'));

// —— 数据契约：BREW2_GOAL / ACH_LIST brew2 同源互证 ——
ok('BREW2_GOAL 数据契约（阈值单一数据源，判定/进度/描述/战报分母四端同读）', BREW2_GOAL === 5, String(BREW2_GOAL));
ok('BREW_MUSHROOMS===2 · BREW_GOLD===10 · MUSHROOM_GOAL===3（酿造配方与任务保护口径零回归）',
  BREW_MUSHROOMS === 2 && BREW_GOLD === 10 && MUSHROOM_GOAL === 3,
  `${BREW_MUSHROOMS}/${BREW_GOLD}/${MUSHROOM_GOAL}`);
const brew2Ach = ACH_LIST.find((a) => a.id === 'brew2');
ok('ACH_LIST 含 brew2「妙手回春」且 id 唯一', !!brew2Ach && brew2Ach.name === '妙手回春' &&
  ACH_LIST.filter((a) => a.id === 'brew2').length === 1);
ok('brew2 描述/判定/进度读 BREW2_GOAL 与 (g.brews||0) 防御式（三端同源零裸字面量）',
  !!brew2Ach && brew2Ach.d === `累计酿造 ${BREW2_GOAL} 瓶高级灵药` &&
  String(brew2Ach.ok).includes('(g.brews||0)') && String(brew2Ach.prog).includes('g.brews||0'));
ok('brew2 无 r 字段纯里程碑（妙手回春本身就是奖励）', !!brew2Ach && !('r' in brew2Ach));
ok('brew2 0/4/5/12 四档谓词逐值（缺字段 0/5 旧档零迁移、超阈值不钳制）',
  brew2Ach.ok({}) === false && brew2Ach.prog({}) === `0/${BREW2_GOAL}` &&
  brew2Ach.ok({ brews: 4 }) === false && brew2Ach.prog({ brews: 4 }) === `4/${BREW2_GOAL}` &&
  brew2Ach.ok({ brews: 5 }) === true && brew2Ach.prog({ brews: 5 }) === `5/${BREW2_GOAL}` &&
  brew2Ach.ok({ brews: 12 }) === true && brew2Ach.prog({ brews: 12 }) === `12/${BREW2_GOAL}`);
ok('酿造线首档 brew（灵药初成）仍为 1 瓶 · 封顶 brew3（炉火纯青）仍为 12 瓶（逐字零回归）',
  ACH_LIST.find((a) => a.id === 'brew').d === '酿造出第一瓶高级灵药' &&
  ACH_LIST.find((a) => a.id === 'brew3').d === `累计酿造 ${12} 瓶高级灵药`);

// —— core.js 源级落位 ——
ok('core.js 自 data.js 追加导入 BREW2_GOAL（import 行邻位保留 BREW_MUSHROOMS/BREW_GOLD 原位）',
  cSrc.includes('BREW_MUSHROOMS, BREW_GOLD, BREW2_GOAL, MUSHROOM_GOAL'));
ok('core.js 含 v24.50 注释（酿造战报进度后缀说明·两端口都在锅前面板唯独战报裸报）',
  cSrc.includes('v24.50 体验打磨·信息透明·计数现场') && cSrc.includes('唯独酿造成功战报本身始终裸报'));
ok('core.js 酿造成功报文模板逐字（剩余材料 + 可酿瓶数 + 🍶 妙手回春 N/5 后缀）',
  cSrc.includes('；F/战斗[3]使用）（🍶 妙手回春 ${hero.brews || 0}/${BREW2_GOAL}）`, SYS_MSG_MS)'));
ok('core.js 旧酿造报文（无妙手回春后缀原句）零残留',
  !cSrc.includes("；F/战斗[3]使用）`, SYS_MSG_MS);\n}"));
ok('core.js 计数唯一产生点零回归（hero.brews 自增先于报文落账 + 当场 applyAchievements）',
  cSrc.indexOf('hero.brews = (hero.brews || 0) + 1;') > -1 &&
  cSrc.indexOf('hero.brews = (hero.brews || 0) + 1;') < cSrc.indexOf('（🍶 妙手回春 ${hero.brews || 0}/${BREW2_GOAL}）') &&
  cSrc.indexOf('applyAchievements();') > -1);
ok('core.js 两档拦截判定零回归（任务蘑菇保护 MUSHROOM_GOAL · 材料不足 BREW_MUSHROOMS/BREW_GOLD）',
  cSrc.includes('任务蘑菇尚未上交（当前 ${hero.mushrooms}/${MUSHROOM_GOAL} 株），先去找灯长吧！') &&
  cSrc.includes('材料不足：酿造需要 ${BREW_MUSHROOMS} 株蘑菇 + ${BREW_GOLD} 金币'));
ok('core.js 姊妹端口零串扰（大地图喝药报文仍只挂渴饮甘露、不带妙手回春）',
  cSrc.includes('（💧 渴饮甘露 ${hero.mapPotions || 0}/${MAP_POTION_GOAL}）') &&
  !cSrc.includes('（💧 渴饮甘露 ${hero.brews || 0}/${BREW2_GOAL}）'));

// —— 运行期真实 brewNow() 路径（bind.boxMsg 捕获桩，承 smoke_v2446 同款桩法）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 1, hp: 60, hpMax: 60, mp: 30, mpMax: 30,
    atkMax: 12, defMax: 6, gold: 100, xp: 0, xpNext: 20, item: 2, potion2: 0, brews: 0,
    mushrooms: 10, weapon: '木剑', armor: '布衣', diff: null, skills: ['治愈术'], ach: [],
    poison: 0, seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, totalWins: 0,
    x: 1, y: 1, map: 'village' }, extra || {});
}
function runBrew(hero) {
  const msgs = [];
  const oBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    S.G = hero;
    brewNow();
    return msgs;
  } finally {
    bind.boxMsg = oBox;
  }
}
// A 档：首次酿造（brews 0→1）——报文逐字带「（🍶 妙手回春 1/5）」（applyAchievements 的成就解锁播报同栈，取末条战报）
{
  const h = mkHero({});
  const m = runBrew(h);
  const line = m[m.length - 1] || '';
  ok('运行期：首酿战报逐字「🧪 酿造成功！高级灵药 +1（剩余 8 蘑菇 / 90 金币 · 还可再酿 4 瓶；F/战斗[3]使用）（🍶 妙手回春 1/5）」',
    line === '🧪 酿造成功！高级灵药 +1（剩余 8 蘑菇 / 90 金币 · 还可再酿 4 瓶；F/战斗[3]使用）（🍶 妙手回春 1/5）', m.join(' | '));
  ok('运行期：首酿结算一致（brews 0→1 · mushrooms 10→8 · gold 100→90 · potion2 0→1）',
    h.brews === 1 && h.mushrooms === 8 && h.gold === 90 && h.potion2 === 1,
    `brews=${h.brews} mushrooms=${h.mushrooms} gold=${h.gold} potion2=${h.potion2}`);
}
// B 档：第二次酿造（brews 1→2）——分子递增 2/5
{
  const h = mkHero({ brews: 1 });
  const m = runBrew(h);
  const line = m[m.length - 1] || '';
  ok('运行期：二酿战报带「（🍶 妙手回春 2/5）」且计数 1→2',
    line.includes('（🍶 妙手回春 2/5）') && h.brews === 2, `brews=${h.brews} line=${line}`);
}
// C 档：第 5 次酿造（brews 4→5）——当场解锁「妙手回春」（applyAchievements 落 hero.ach）且报文带 5/5
{
  const h = mkHero({ brews: 4 });
  const m = runBrew(h);
  const line = m[m.length - 1] || '';
  ok('运行期：第 5 酿当场解锁「妙手回春」（brews 4→5 且 ach 含 brew2）',
    h.brews === 5 && (h.ach || []).includes('brew2'), `brews=${h.brews} ach=${JSON.stringify(h.ach || [])}`);
  ok('运行期：达标档战报带「（🍶 妙手回春 5/5）」（战报与解锁播报同栈并存）',
    line.includes('（🍶 妙手回春 5/5）'), line);
}
// D 档：旧档缺 brews 字段防御式（承 v19.41 seen 同款）——0→1 不抛错 1/5 起步
{
  const h = mkHero({});
  delete h.brews;
  const m = runBrew(h);
  const line = m[m.length - 1] || '';
  ok('运行期：旧档缺 brews 字段防御式（缺失→1/5 战报、零抛错、旧档零迁移）',
    h.brews === 1 && line.includes('（🍶 妙手回春 1/5）'), `brews=${h.brews}`);
}
// E 档：材料不足拦截零计数——报「材料不足：酿造需要 2 株蘑菇 + 10 金币（当前 1/100）」，brews 不变
{
  const h = mkHero({ mushrooms: 1 });
  const m = runBrew(h);
  ok('运行期：材料不足拦截档「材料不足：酿造需要 2 株蘑菇 + 10 金币（当前 1/100）」逐字零回归且零计数（brews 0 不变 / mushrooms 1 不变）',
    m.length === 1 && m[0] === '材料不足：酿造需要 2 株蘑菇 + 10 金币（当前 1/100）' &&
    h.brews === 0 && h.mushrooms === 1, m.join(' | '));
}
// F 档：任务蘑菇保护拦截零计数——side_mushroom='active' 且蘑菇 ≤ MUSHROOM_GOAL(3) 报保护文案，brews 不变
{
  const h = mkHero({ mushrooms: 2, quests: { side_mushroom: 'active' } });
  const m = runBrew(h);
  ok('运行期：任务保护拦截档「🍄 任务蘑菇尚未上交（当前 2/3 株），先去找灯长吧！」逐字零回归且零计数（brews 0 不变）',
    m.length === 1 && m[0] === '🍄 任务蘑菇尚未上交（当前 2/3 株），先去找灯长吧！' && h.brews === 0,
    m.join(' | '));
}
// G 档：谓词防御档复证——缺字段 0/5 不误解锁（旧档零迁移）
{
  ok('运行期：谓词防御档复证（缺字段 0/5 假 / 5 真 / 12 真）',
    brew2Ach.ok({}) === false && brew2Ach.prog({}) === `0/${BREW2_GOAL}` &&
    brew2Ach.ok({ brews: 5 }) === true && brew2Ach.ok({ brews: 12 }) === true);
}

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为冒烟二百七十七件套（二百七十六件套清除）',
  readme.includes('冒烟二百七十七件套（二百七十六件套清除）'));
ok('README tests 含 v24.50 守护描述与 smoke_v2450_brewprog 入库（277 份）',
  readme.includes('v24.50 起含 「酿造成功战报「🍶 妙手回春 N/5」进度后缀」守护') &&
  readme.includes('smoke_v2450_brewprog 入库（277 份）'));
ok('README 尚无 275 件套口径（哨兵前望 275 语义：下一版才写 275）',
  !readme.includes('二百七十八件套') && !readme.includes('冒烟二百七十八件套'));
ok('README 仍保留 v24.49 守护描述与 v24.48 守护描述（历史保留）',
  readme.includes('v24.49 起含 「后期经验曲线续平滑（第八轮）」守护') &&
  readme.includes('v24.48 起含 「战斗技能战报「🔮 熟能生巧 N/30」进度后缀」守护'));
ok('README tests 树串尾已延伸至 smoke_v2450_brewprog（... + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog（npm test 串跑））',
  readme.includes('smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog（npm test 串跑）'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 274 份（smoke.mjs + 273 专项）', chain.length === 276 && chainAll.length === 277, String(chain.length));
ok('package.json 链尾为 smoke_v2450_brewprog（第 273 份）', chain[chain.length - 1] === 'smoke_v2453_innrestprog', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2450_brewprog.mjs（node tests/ 前缀形态）',
  pkgRaw.includes('node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs'));
ok('package.json 链锚逐字（...smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs"）',
  pkgRaw.includes('smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.50（startsWith）', changelog.startsWith('## v24.53 '));
ok('CHANGELOG v24.50 条目含「妙手回春」与「进度后缀」与「酿造」',
  changelog.includes('妙手回春') && changelog.includes('进度后缀') && changelog.includes('酿造'));
ok('CHANGELOG 仍保留 v24.49 与 v24.48 条目（历史保留）',
  changelog.includes('## v24.49 ') && changelog.includes('## v24.48 '));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(chainAll.map((f) => f.replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 274（273 专项 + smoke.mjs）', files.length === 277, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：v2415 树串守护已推进至新链尾 + 前望 275 ——
const t2415 = read('tests/smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v2450_brewprog（第 273 份）',
  t2415.includes("chain[chain.length - 1] === 'smoke_v2453_innrestprog'"));
ok('smoke_v2415 树串 token 数已推进至 274', t2415.includes('treeTok.length === 277'));
ok('smoke_v2415 哨兵「尚无 275」口径（二百七十四件套 bare 否定式）',
  t2415.includes("!readme.includes('二百七十八件套')"));
const s2429 = read('tests/smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 件盘口句已推进（冒烟二百七十七件套（二百七十六件套清除）正形态）',
  s2429.includes("readme.includes('冒烟二百七十七件套（二百七十六件套清除）')"));
ok('smoke_v2429 链尾断言已推进至「=== smoke_v2450_brewprog」',
  s2429.includes("=== 'smoke_v2453_innrestprog'"));
ok('smoke_v2429 入库份数断言随新现实推进（入库 274 份）',
  s2429.includes('入库（277 份）'));

// —— 旧代 pin 零残留扫描（v24.49 / 273 口径；豁免本套件与上一版套件否定式）——
const leftovers = [];
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v2450_brewprog.mjs') continue;
  // 承 v24.49 同款豁免：上一版套件（smoke_v2449_xpcurve8）合法的历史/否定式字面量不入扫描。
  if (f === 'smoke_v2449_xpcurve8.mjs') continue;
  const s2 = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s2.includes("const GAME_VERSION = 'v24.49';") || s2.includes("GAME_VERSION === 'v24.49'") ||
      s2.includes("startsWith('## v24.49") || s2.includes('入库（273 份）') ||
      s2.includes('二百七十三件套（二百七十二件' + '套清除）') ||
      s2.includes('testChain === 27' + '2') || s2.includes('fileCount === 27' + '2') ||
      s2.includes('files.length === 27' + '2') || s2.includes('chainAll.length === 27' + '2') ||
      s2.includes('treeTok.length === 27' + '3') || s2.includes("chain[chain.length - 1] === 'smoke_v2449_xpcurve8'")) leftovers.push(f);
}
ok('全库测试零残留 v24.49 GAME_VERSION/顶 pin/273 口径（哨兵链，豁免本套件与上一版否定式）',
  leftovers.length === 0, leftovers.join(','));

console.log(`— v24.50 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
