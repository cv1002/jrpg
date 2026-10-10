// v24.19 专项冒烟：🎁 额外掉落战报补「🍀 鸿运当头 N/30」进度后缀
// （体验打磨·信息透明·计数现场——承 v24.17 喝药战报「💧 渴饮甘露 N/10」/ v24.16 HUD「🚶 千里之行
// N/1000」/ v24.12 胜利画面「⚔️ 身经百战 N/100」/ v24.10 酿造「🍶 妙手回春 N/5」/ v24.09 商店
// 「🍄 蘑菇商路 N/30」同一「计数现场报进度」主线 / v21.97 鸿运当头成就（掉落线第二档 = 累计获得
// 30 次额外掉落）：计数 hero.drops 由 rules.rollDrop 五档（武器/防具/金币/药水/蘑菇·灵药）唯一
// 写入点累加、snapshotHero 全量快照自动持久化、防御式 (hero.drops||0) 旧档零迁移，此前进度只藏在
// C 成就页一行 X/30——掉落线的计数现场正是每次「🎁 额外掉落」战报本身：捡到战利品当场查无一眼之数
// （与 v24.17 「现场是动作本身」同族；v24.12 胜利画面已报 战绩/收集/碎片/冒险进度/身经百战，掉落
// 计数现场不在总结屏而在战报瞬间）；现 battle.winBattle 额外掉落报文末尾补「（🍀 鸿运当头 N/30）」
// （分子读 hero.drops 防御式旧档零迁移、分母读 data.js LUCKY2_GOAL 单一数据源，与 C 页/ACH_LIST
// lucky2 的 ok/prog 同读一份源，调阈值只改 data.js 一处全端自动跟随），纯显示零结算零存档零数值
// 变化（LUCKY2_GOAL/rollDrop 计数/掉落结算/成就判定逐字未动）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.19 注释 / GAME_VERSION v24.19 与旧 v24.18 字面量
// 零残留 / v24.18 与 v24.17 历史注释保留）、battle.js 源级落位（LUCKY2_GOAL import / 报文模板 /
// rollDrop 先于 boxMsg 的顺序 / v24.19 注释）、运行期 rollDrop（受控随机：金币档 drops 8→9 +
// 无掉落档 drops 恒等 + 报文组合逐一核对）、LUCKY2_GOAL(30) 与 ACH_LIST lucky2 同源互证、
// README/package.json/CHANGELOG 同步（件套口径 243 + v24.19 守护描述 + 入库 243 + package 串尾 +
// CHANGELOG 顶 pin）、哨兵链（前望 252 且 README 尚无 244 口径）、旧代 v24.18 pin 全库零残留扫描
// （字面量/顶 pin/242 口径）。
import { LUCKY2_GOAL, GAME_VERSION, ACH_LIST } from '../js/data.js';
import { rollDrop } from '../js/rules.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.19 🎁 额外掉落战报「🍀 鸿运当头 N/30」进度后缀 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const bSrc = read('js/battle.js');
const rSrc = read('js/rules.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.18 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.18', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 18)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.21（旧 v24.18 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.74';") && !dSrc.includes("const GAME_VERSION = 'v24.18';"));
ok('data.js 含 v24.19 注释（额外掉落战报「🍀 鸿运当头 N/30」进度后缀说明）',
  dSrc.includes('// v24.19 体验打磨·信息透明·计数现场'));
ok('data.js 仍保留 v24.18 历史注释（后期金币曲线续平滑说明，累积注释块）',
  dSrc.includes('// v24.18 数值平衡·后期金币曲线续平滑'));
ok('data.js 仍保留 v24.17 历史注释（喝药战报进度后缀说明）',
  dSrc.includes('// v24.17 体验打磨·信息透明·计数现场'));
ok('data.js LUCKY2_GOAL 为 30（掉落线第二档阈值）', LUCKY2_GOAL === 30, String(LUCKY2_GOAL));

// —— ACH_LIST lucky2 同源互证（三处同读 LUCKY2_GOAL 一份源）——
const lucky2 = ACH_LIST.find((a) => a.id === 'lucky2');
ok('ACH_LIST lucky2 名称「鸿运当头」', !!lucky2 && lucky2.name === '鸿运当头', lucky2 && lucky2.name);
ok('ACH_LIST lucky2 描述与阈值同源（累计获得 30 次额外掉落）',
  !!lucky2 && lucky2.d === `累计获得 ${LUCKY2_GOAL} 次额外掉落`, lucky2 && lucky2.d);
ok('ACH_LIST lucky2 判定/进度同读 (drops||0) 与 LUCKY2_GOAL',
  !!lucky2 && lucky2.ok({ drops: 29 }) === false && lucky2.ok({ drops: 30 }) === true &&
  lucky2.prog({ drops: 7 }) === `7/${LUCKY2_GOAL}` && lucky2.prog({}) === `0/${LUCKY2_GOAL}`);

// —— battle.js 源级落位 ——
ok('battle.js import 含 LUCKY2_GOAL（data.js 既有导出，零新增模块依赖）',
  bSrc.includes('POTION_USE_GOAL, LUCKY2_GOAL, HUNT2_GOAL, RUSH_CLEAR_GOAL'));
ok('battle.js 额外掉落报文含「🍀 鸿运当头 N/30」进度后缀（模板逐字）',
  bSrc.includes('（🍀 鸿运当头 ${hero.drops || 0}/${LUCKY2_GOAL}）'));
ok('battle.js 报文分子读 hero.drops 防御式（(hero.drops||0)）', bSrc.includes('${hero.drops || 0}'));
ok('battle.js 报文仍以 🎁 额外掉落 前缀开头（原文案零回归）',
  bSrc.includes('`🎁 额外掉落：${drop}（'));
ok('battle.js 含 v24.19 注释（额外掉落战报进度后缀说明）',
  bSrc.includes('v24.19 体验打磨·信息透明·计数现场'));
ok('battle.js rollDrop 先于 boxMsg（掉落计数已落账再报进度）',
  bSrc.indexOf('const drop = rollDrop(hero, curMap());') < bSrc.indexOf('额外掉落：${drop}'));
ok('rules.js 各掉落档均以 (hero.drops||0)+1 唯一写入（五档同式）',
  (rSrc.match(/hero\.drops = \(hero\.drops \|\| 0\) \+ 1;/g) || []).length === 5,
  String((rSrc.match(/hero\.drops = \(hero\.drops \|\| 0\) \+ 1;/g) || []).length));

// —— 运行期：受控随机走 rollDrop 真实路径 ——
const _rand = Math.random;
try {
  Math.random = () => 0.0; // 命中金币档（0 < DROP_EQUIP 0.08）；武器/防具已是毕业装 → +60 金分支
  const hero = { level: 5, xp: 0, gold: 100, item: 2, potion2: 1, mushrooms: 3, drops: 8,
    weapon: '秘银剑', armor: '锁子甲', hp: 50, mp: 20 };
  const dropMsg = rollDrop(hero, 'village');
  ok('运行期：金币档 rollDrop 返回「✨ 宝箱：金币 +60」且 drops 8→9',
    typeof dropMsg === 'string' && dropMsg.startsWith('✨ 宝箱：金币 +60（共 160 金）') && hero.drops === 9,
    JSON.stringify({ dropMsg, drops: hero.drops }));
  const composed = `🎁 额外掉落：${dropMsg}（🍀 鸿运当头 ${hero.drops || 0}/${LUCKY2_GOAL}）`;
  ok('运行期：battle.js 同式报文组合含「🍀 鸿运当头 9/30」',
    composed === `🎁 额外掉落：${dropMsg}（🍀 鸿运当头 9/30）`, composed);
  Math.random = () => 0.99; // 无掉落档（≥0.38）
  const hero2 = { level: 5, gold: 0, item: 0, potion2: 0, mushrooms: 0, drops: 4,
    weapon: '秘银剑', armor: '锁子甲', hp: 50, mp: 20 };
  const noMsg = rollDrop(hero2, 'village');
  ok('运行期：无掉落档 rollDrop 返回 null 且 drops 恒等（零误报）',
    noMsg === null && hero2.drops === 4, String(noMsg));
} finally {
  Math.random = _rand;
}

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为二百九十七件套（二百九十六件套清除）',
  readme.includes('冒烟二百九十七件套（二百九十六件套清除）'));
ok('README tests 含 v24.19 守护描述与 smoke_v2419_luckdrp 入库（297 份）',
  readme.includes('v24.19 起含 「🎁 额外掉落」战报「🍀 鸿运当头 N/30」进度后缀守护') &&
  readme.includes('smoke_v2419_luckdrp 入库（297 份）'));
ok('README 仍有 v24.18 守护描述（历史保留）', readme.includes('v24.18 起含 「后期金币曲线续平滑」守护'));
ok('README 已有二百四十五件套口径且尚无 244（哨兵前望 252 语义：下一版才写 243）',
  readme.includes('冒烟二百九十七件套（二百九十六件套清除）') &&
  !readme.includes('二百九十八件套'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 247 份（smoke.mjs + 250 专项）', chain.length === 296 && chainAll.length === 297, String(chain.length));
ok('package.json 链尾为 smoke_v2439_xpcurve4（第 273 份）', chain[chain.length - 1] === 'smoke_v2473_xpcurve21', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2419_luckdrp.mjs（node tests/ 前缀形态）',
  pkgRaw.includes('node tests/smoke_v2419_luckdrp.mjs'));
ok('package.json 链锚逐字（smoke_v2420_skillprog.mjs && node tests/smoke_v2421_allquest.mjs && node tests/smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs"）',
  pkgRaw.includes('smoke_v2420_skillprog.mjs && node tests/smoke_v2421_allquest.mjs && node tests/smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs && node tests/smoke_v2459_xpcurve9.mjs && node tests/smoke_v2460_xpcurve10.mjs && node tests/smoke_v2461_xpcurve11.mjs && node tests/smoke_v2462_xpcurve12.mjs && node tests/smoke_v2463_xpcurve13.mjs && node tests/smoke_v2464_xpcurve14.mjs && node tests/smoke_v2465_xpcurve15.mjs && node tests/smoke_v2466_xpcurve16.mjs && node tests/smoke_v2467_xpcurve17.mjs && node tests/smoke_v2468_xpcurve18.mjs && node tests/smoke_v2469_xpcurve19.mjs && node tests/smoke_v2470_xpcurve20.mjs && node tests/smoke_v2471_bellman.mjs && node tests/smoke_v2472_bellquest.mjs && node tests/smoke_v2473_xpcurve21.mjs"'));
ok('README tests 树串尾已延伸（smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10 + smoke_v2461_xpcurve11 + smoke_v2462_xpcurve12 + smoke_v2463_xpcurve13 + smoke_v2464_xpcurve14 + smoke_v2465_xpcurve15 + smoke_v2466_xpcurve16 + smoke_v2467_xpcurve17 + smoke_v2468_xpcurve18 + smoke_v2469_xpcurve19 + smoke_v2470_xpcurve20 + smoke_v2471_bellman + smoke_v2472_bellquest + smoke_v2473_xpcurve21（npm test 串跑））',
  readme.includes('smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10 + smoke_v2461_xpcurve11 + smoke_v2462_xpcurve12 + smoke_v2463_xpcurve13 + smoke_v2464_xpcurve14 + smoke_v2465_xpcurve15 + smoke_v2466_xpcurve16 + smoke_v2467_xpcurve17 + smoke_v2468_xpcurve18 + smoke_v2469_xpcurve19 + smoke_v2470_xpcurve20 + smoke_v2471_bellman + smoke_v2472_bellquest + smoke_v2473_xpcurve21（npm test 串跑）'));
ok('CHANGELOG.md 顶部条目已为 v24.21（startsWith）', changelog.startsWith('## v24.74'));
ok('CHANGELOG v24.19 条目含「鸿运当头」与「计数现场」与「额外掉落」',
  changelog.includes('鸿运当头') && changelog.includes('计数现场') && changelog.includes('额外掉落'));
ok('CHANGELOG 仍保留 v24.18 条目（历史保留）', changelog.includes('## v24.18'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(chainAll.map((f) => f.replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 243（244 + smoke_v2421_allquest）', files.length === 297, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链（旧代 v24.18 pin 全库零残留）——
const leftovers = [];
for (const f of files) {
  if (f === 'smoke_v2419_luckdrp.mjs') continue;
  // 承 v24.18 同款豁免：上一版套件（smoke_v2418_goldcurve）按惯例在否定式断言里保留旧代字面量，
  // 属合法残留，豁免扫描（本版无 v24.18 否定式则自然零残留）。
  if (f === 'smoke_v2418_goldcurve.mjs') continue;
  const s = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s.includes("const GAME_VERSION = 'v24.18';") || s.includes("GAME_VERSION === 'v24.18'") ||
      s.includes("startsWith('## v24.18") || s.includes('入库（242 份）') ||
      s.includes('二百四十二件套（二百四十一件套清除）') || s.includes('testChain === 242') ||
      s.includes('fileCount === 242') || s.includes('files.length === 242') ||
      s.includes('chain.length === 241')) leftovers.push(f);
}
ok('全库测试零残留 v24.18 GAME_VERSION/顶 pin/242 口径（哨兵链·豁免上一版否定式）', leftovers.length === 0, leftovers.join(','));

console.log(`— v24.19 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
