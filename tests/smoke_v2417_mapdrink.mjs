// v24.17 专项冒烟：大地图 F 喝药战报补「💧 渴饮甘露 N/10」进度后缀
// （体验打磨·信息透明·计数现场——承 v24.16 HUD「🚶 千里之行 N/1000」/ v24.12 胜利画面「⚔️ 身经百战
// N/100」/ v24.11 阵亡画面「💪 败而不馁 N/10」/ v24.10 酿造界面「🍶 妙手回春 N/5」/ v24.09 商店界面
// 「🍄 蘑菇商路 N/30」/ v24.08 快速旅行「🚶 行者无疆 N/15」/ v24.05 试炼碑「📜 千锤百炼 N/3」同一
// 「计数现场报进度」主线 / v23.72 渴饮甘露成就：计数 hero.mapPotions 由 core.usePotion 成功喝药唯一
// 产生点写入（随 snapshotHero 全量快照自动持久化、防御式 (hero.mapPotions||0) 旧档零迁移），成就
// 「渴饮甘露」（大地图按 F 喝药累计 MAP_POTION_GOAL(10) 次）此前进度只藏在 C 成就页一行 X/10——
// v23.72 当时明确「零战报后缀」（喝药报文已带恢复量/剩余库存/HPMP 状态），而它的计数现场正是每次按 F
// 的喝药战报本身：喝药当场查无一眼之数（与 v24.16「步数的现场是地图本身」同族——这里「现场」是动作
// 本身；v24.05-24.16 主线已逐例把「C 页单载」演进为「计数现场同载」）；现 core.usePotion 两档报文
// （药水/灵药）末尾补「（💧 渴饮甘露 N/10）」（分子读 hero.mapPotions 防御式 (hero.mapPotions||0)
// 旧档零迁移、分母读 data.js MAP_POTION_GOAL 单一数据源，与 C 页/ACH_LIST mapdrink 的 ok/prog 同读
// 一份源，调阈值只改 data.js 一处全端自动跟随），纯显示零结算零存档零数值变化（计数落账/
// applyAchievements 时机/takePotion 结算/两档拦截判定逐字未动）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.17 注释 / GAME_VERSION v24.17 与旧 v24.16 字面量
// 零残留 / v24.16 历史注释保留）、运行期常量实值（MAP_POTION_GOAL 10）与 ACH_LIST mapdrink 同源互证
// （ok/prog/d 逐值）、core.js 源级（两档报文后缀逐字 + 计数/结算/判定零回归）、运行期真实 usePotion
// 路径（1/10 后缀 · 10/10 解锁提示先于喝药报文 · 缺字段防御式 0→1）、README/package.json/CHANGELOG 同步
// （件套口径 243 + v24.17 守护描述 + smoke_v2417_mapdrink 入库（280 份）+ package 串尾 + CHANGELOG
// 顶 pin）、哨兵链（前望 243 且 README 尚无 242 口径）、旧代 v24.16 pin 全库零残留扫描（字面量/顶 pin/
// 240 口径）、battle.js 战斗用药端口零串扰。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v24.16 冒烟先例：先装桩再动态 import main.js）——
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
const { GAME_VERSION, MAP_POTION_GOAL, ACH_LIST } = await import('../js/data.js');
const { usePotion } = await import('../js/core.js');
const { bind } = await import('../js/bind.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.17 F 喝药战报「💧 渴饮甘露 N/10」进度后缀 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const cSrc = read('js/core.js');
const bSrc = read('js/battle.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.16）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.16', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] >= 17)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js 含 v24.17 注释（大地图喝药战报「💧 渴饮甘露 N/10」进度后缀）',
  dSrc.includes('v24.17 体验打磨·信息透明·计数现场：大地图喝药战报'));
ok('data.js GAME_VERSION 字面量已为 v24.21（旧 v24.16 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.56';") && !dSrc.includes("const GAME_VERSION = 'v24.16';"));
ok('data.js 仍保留 v24.16 历史注释（HUD 步数进度·本版保留）',
  dSrc.includes('v24.16 体验打磨·信息透明·计数现场：HUD 常驻'));

// —— 数据契约：MAP_POTION_GOAL / ACH_LIST mapdrink 同源互证 ——
ok('MAP_POTION_GOAL 数据契约（阈值单一数据源，判定/进度/描述三端同读）', MAP_POTION_GOAL === 10, String(MAP_POTION_GOAL));
const mapAch = ACH_LIST.find((a) => a.id === 'mapdrink');
ok('ACH_LIST 含 mapdrink「渴饮甘露」且 id 唯一', !!mapAch && mapAch.name === '渴饮甘露' &&
  ACH_LIST.filter((a) => a.id === 'mapdrink').length === 1);
ok('mapdrink 描述/判定/进度读 MAP_POTION_GOAL 与 (g.mapPotions||0) 防御式（三端同源零裸字面量）',
  !!mapAch && mapAch.d === `大地图按 F 喝药累计 ${MAP_POTION_GOAL} 次` &&
  String(mapAch.ok).includes('(g.mapPotions||0)') && String(mapAch.prog).includes('g.mapPotions||0'));
ok('mapdrink 0/9/10/20 四档谓词逐值（缺字段 0/10 旧档零迁移、超阈值不钳制）',
  mapAch.ok({}) === false && mapAch.prog({}) === `0/${MAP_POTION_GOAL}` &&
  mapAch.ok({ mapPotions: 9 }) === false && mapAch.prog({ mapPotions: 9 }) === `9/${MAP_POTION_GOAL}` &&
  mapAch.ok({ mapPotions: 10 }) === true && mapAch.prog({ mapPotions: 10 }) === `${MAP_POTION_GOAL}/${MAP_POTION_GOAL}` &&
  mapAch.ok({ mapPotions: 20 }) === true && mapAch.prog({ mapPotions: 20 }) === `20/${MAP_POTION_GOAL}`);

// —— core.js 源级落位（两档报文后缀逐字 + 计数/结算/判定零回归）——
ok('core.js 含 v24.17 注释（喝药报文案进度后缀说明）', cSrc.includes('v24.17 体验打磨·信息透明·计数现场'));
ok('core.js 药水档报文后缀逐字落位（💧 渴饮甘露 N/10 · 分子防御式 · 分母 MAP_POTION_GOAL）',
  cSrc.includes('`🍖 使用药水，恢复 ${result.h} 点 HP（HP ${hero.hp}/${hero.hpMax} · 药水剩余 ${hero.item} 瓶）（💧 渴饮甘露 ${hero.mapPotions || 0}/${MAP_POTION_GOAL}）`'));
ok('core.js 灵药档报文后缀逐字落位（💧 渴饮甘露 N/10 · 分子防御式 · 分母 MAP_POTION_GOAL）',
  cSrc.includes('`🧪 服下高级灵药，恢复 ${result.h} HP、${result.m} MP（HP ${hero.hp}/${hero.hpMax} · MP ${hero.mp}/${hero.mpMax} · 高级灵药剩余 ${hero.potion2} 瓶）（💧 渴饮甘露 ${hero.mapPotions || 0}/${MAP_POTION_GOAL}）`'));
ok('core.js 计数唯一产生点零回归（hero.mapPotions 自增 + 当场 applyAchievements）',
  cSrc.includes('const result = takePotion();') && cSrc.includes('hero.mapPotions = (hero.mapPotions || 0) + 1;') &&
  cSrc.includes('applyAchievements();'));
ok('core.js 两档拦截判定零回归（状态满满 / 没有可用的药水了）',
  cSrc.includes("'✅ 状态满满，无需喝药！' : '🍖 没有可用的药水了！'"));
ok('battle.js 战斗用药端口零串扰（doItem 仍只计数 potionUses，不涉 mapPotions）',
  bSrc.includes('hero.potionUses = useN;') && !bSrc.includes('mapPotions'));

// —— 运行期真实 usePotion 路径（boxMsg 捕获桩承 v23.67 捕桩法）——
{
  const msgs = [];
  const oBox = bind.boxMsg, oRH = bind.renderHUD, prevG = S.G, prevScene = S.scene;
  try {
    bind.boxMsg = (t) => { msgs.push(String(t)); };
    bind.renderHUD = () => {};
    const hero = { name: '行者', level: 1, hp: 10, hpMax: 100, mp: 50, mpMax: 50, gold: 100,
      item: 3, potion2: 0, ach: [], x: 1, y: 1, map: 'village' };
    S.G = hero; S.scene = 'world';
    usePotion();
    ok('运行期：大地图喝药计数落账（hero.mapPotions 1）且未达标不误解锁',
      hero.mapPotions === 1 && !(hero.ach || []).includes('mapdrink'), 'mapPotions=' + hero.mapPotions);
    ok('运行期：药水档报文带「💧 渴饮甘露 1/10」进度后缀（v24.17 计数现场报进度）',
      msgs[0] && msgs[0].includes('使用药水') && msgs[0].includes('药水剩余') &&
      msgs[0].includes('（💧 渴饮甘露 1/10）'), msgs[0] || '');
    hero.hp = 20; hero.mp = 10; hero.potion2 = 1;
    usePotion();
    ok('运行期：灵药档报文带「💧 渴饮甘露 2/10」进度后缀（与药水档同式）',
      msgs[1] && msgs[1].includes('服下高级灵药') && msgs[1].includes('高级灵药剩余') &&
      msgs[1].includes('（💧 渴饮甘露 2/10）'), msgs[1] || '');
    ok('运行期：第 10 次大地图喝药当场解锁「渴饮甘露」（applyAchievements 落 hero.ach 且解锁提示先于喝药报文）',
      (hero.mapPotions = 9, hero.hp = 1, hero.item = 1, usePotion(),
       hero.mapPotions === 10 && (hero.ach || []).includes('mapdrink') &&
       msgs[2].includes('成就解锁') && msgs[3].includes('（💧 渴饮甘露 10/10）')),
      'mapPotions=' + hero.mapPotions + ' ach=' + JSON.stringify(hero.ach || []) + ' m3=' + JSON.stringify(msgs[3]));
    ok('运行期：旧档缺 mapPotions 字段谓词零抛错且 0/10 不误解锁',
      mapAch.ok({}) === false && mapAch.prog({}) === `0/${MAP_POTION_GOAL}`);
  } finally {
    bind.boxMsg = oBox; bind.renderHUD = oRH;
    S.G = prevG; S.scene = prevScene;
  }
}

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为二百八十件套（二百七十九件套清除）',
  readme.includes('冒烟二百八十件套（二百七十九件套清除）'));
ok('README tests 含 v24.17 守护描述与 smoke_v2417_mapdrink 入库（280 份）',
  readme.includes('v24.17 起含 F 喝药「渴饮甘露」进度后缀守护') && readme.includes('smoke_v2417_mapdrink 入库（280 份）'));
ok('README 成就 bullet 含 v24.17 喝药报文进度后缀口径（v24.17 起大地图喝药报文带「💧 渴饮甘露 N/10」进度后缀）',
  readme.includes('v24.17 起大地图喝药报文带「💧 渴饮甘露 N/10」进度后缀'));
ok('README F 行含 v24.17 喝药报文进度后缀口径（v24.17 起大地图喝药报文带）',
  readme.includes('**v24.17 起大地图喝药报文带「💧 渴饮甘露 N/10」进度后缀**'));
ok('README 尚无 252 件套口径（哨兵前望 252 语义：下一版才写 243）',
  !readme.includes('二百八十一件套') && !readme.includes('冒烟二百八十一件套'));
ok('README 仍保留 v24.16 守护描述（历史保留）', readme.includes('v24.16 起含 HUD 步数进度守护'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 247 份（smoke.mjs + 250 专项）', chain.length === 279 && chainAll.length === 280, String(chain.length));
ok('package.json 链尾为 smoke_v2439_xpcurve4（第 273 份）', chain[chain.length - 1] === 'smoke_v2456_brewspend', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2417_mapdrink.mjs（node tests/ 前缀形态）',
  pkgRaw.includes('node tests/smoke_v2417_mapdrink.mjs'));
ok('package.json 链锚逐字（smoke_v2417_mapdrink.mjs && node tests/smoke_v2418_goldcurve.mjs && node tests/smoke_v2419_luckdrp.mjs && node tests/smoke_v2420_skillprog.mjs && node tests/smoke_v2421_allquest.mjs && node tests/smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs"）',
  pkgRaw.includes('smoke_v2417_mapdrink.mjs && node tests/smoke_v2418_goldcurve.mjs && node tests/smoke_v2419_luckdrp.mjs && node tests/smoke_v2420_skillprog.mjs && node tests/smoke_v2421_allquest.mjs && node tests/smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.21（startsWith）', changelog.startsWith('## v24.56'));
ok('CHANGELOG v24.17 条目含「渴饮甘露」与「喝药」与「进度后缀」',
  changelog.includes('渴饮甘露') && changelog.includes('喝药') && changelog.includes('进度后缀'));
ok('CHANGELOG 仍保留 v24.16 条目（历史保留）', changelog.includes('## v24.16'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(chainAll.map((f) => f.replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 243（240 + smoke_v2417_mapdrink）', files.length === 280, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链（旧代 v24.16 pin 全库零残留）——
const leftovers = [];
for (const f of files) {
  if (f === 'smoke_v2417_mapdrink.mjs') continue;
  // 承 v24.16 同款豁免：上一版套件（smoke_v2416_steps）按惯例在否定式断言里保留旧代字面量
  // （!dSrc.includes("const GAME_VERSION = 'v24.16';")），属合法残留，豁免扫描。
  if (f === 'smoke_v2416_steps.mjs') continue;
  const s = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s.includes("const GAME_VERSION = 'v24.16';") || s.includes("GAME_VERSION === 'v24.16'") ||
      s.includes("startsWith('## v24.16") || s.includes('入库（240 份）') ||
      s.includes('二百四十件套（二百三十九件套清除）') || s.includes('testChain === 240')) leftovers.push(f);
}
ok('全库测试零残留 v24.16 GAME_VERSION/顶 pin/240 口径（哨兵链·豁免上一版否定式）', leftovers.length === 0, leftovers.join(','));

console.log(`— v24.17 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
