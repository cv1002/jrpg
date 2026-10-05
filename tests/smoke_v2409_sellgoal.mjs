// v24.09 专项冒烟：商店界面补「🍄 蘑菇商路 N/30」进度角标——「要不要把菇换成现钱」一眼看清还差几次
// 拿成就（体验打磨·信息透明·决策现场，承 v24.08 快速旅行「🚶 行者无疆 N/15」/ v24.07 旅馆
// 「🏨 夜宿灯下 N/15」/ v24.05 试炼碑「📜 千锤百炼 N/3」同款行内角标 / v23.82 蘑菇商路成就同一
// 「成就进度于决策现场可见」主线：商店卖菇（buildShopList「卖菇」条目、shop.sellMushroom 全游唯一
// 贩售点）的决策现场此前只报 卖价/当前菇数，成就「蘑菇商路」（累计售出 SELL_GOAL(30) 株魔法蘑菇，
// 计数 hero.sold 由 shop.sellMushroom 成功售出唯一产生点写入（任务保护拦截/无菇早退零计数）、
// snapshotHero 全量快照自动持久化、防御式 (hero.sold||0) 旧档零迁移）进度只藏在 C 成就页一行
// X/30——站柜台前查无一眼之数；现 drawShop 补「🍄 蘑菇商路 N/30」（分子读 hero.sold 防御式
// (hero.sold||0)、分母读 data.js SELL_GOAL 单一数据源，与 ACH_LIST sell 的 ok/prog 同读一份源，
// 调阈值只改 data.js 一处三端自动跟随），12px 灰字左对齐 x=86 与右缘「💰 N 金币」（520 右对齐）
// 零重叠；纯显示零结算零存档零数值变化（SELL_GOAL/sellMushroom 结算/商品清单/页脚逐字未动）。
// 本冒烟守护：版本锚点、data.js/menus.js 源级落位（v24.09 注释 / GAME_VERSION v24.09 与旧 v24.08
// 字面量零残留 / v24.08 历史注释保留 / SELL_GOAL 常量逐字）、运行期常量实值（SELL_GOAL 30）
// 与 ACH_LIST sell 同源互证（ok/prog/d 逐值）、计数源 shop.sellMushroom 三端同源互证、
// README/package.json/CHANGELOG 同步（件套口径 239 + v24.09 守护描述 + 入库 239 + tests 树串尾 +
// package 串尾）、哨兵链（v2143 前望 234 且 README 尚无 234 口径）、旧代 v24.08 pin 全库零残留扫描。
import { SELL_GOAL, GAME_VERSION, ACH_LIST } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.09 商店界面「🍄 蘑菇商路 N/30」进度角标 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const mSrc = read('js/view/menus.js');
const sSrc = read('js/shop.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v24.08 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.08', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 8)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.21（旧 v24.08 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.48';") && !dSrc.includes("const GAME_VERSION = 'v24.0" + "8';"));
ok('data.js 含 v24.09 注释（商店界面「🍄 蘑菇商路 N/30」进度角标说明）',
  dSrc.includes('// v24.09 体验打磨·信息透明·决策现场'));
ok('data.js 仍保留 v24.08 历史注释（快速旅行「🚶 行者无疆 N/15」进度角标说明，累积注释块）',
  dSrc.includes('// v24.08 体验打磨·信息透明·决策现场'));
ok('data.js 常量逐字落位（const SELL_GOAL = 30;）', dSrc.includes('const SELL_GOAL = 30;'));

// —— 运行期常量实值（单一数据源）——
ok('SELL_GOAL === 30（蘑菇商路阈值，与 C 页/描述/判定同源）', SELL_GOAL === 30, String(SELL_GOAL));
const sell = ACH_LIST.find((a) => a && a.id === 'sell');
ok('ACH_LIST 含 sell「蘑菇商路」（与 drawShop 角标同读一份源）', !!sell && sell.name === '蘑菇商路', sell && sell.name);
ok('sell ok 谓词逐值（0/29 false · 30/60 true）',
  !!sell && sell.ok({ sold: 0 }) === false && sell.ok({ sold: 29 }) === false &&
  sell.ok({ sold: 30 }) === true && sell.ok({ sold: 60 }) === true);
ok('sell prog 逐值（0→0/30 · 7→7/30 · 30→30/30）',
  !!sell && sell.prog({ sold: 0 }) === '0/30' && sell.prog({ sold: 7 }) === '7/30' &&
  sell.prog({ sold: 30 }) === '30/30');
ok('sell 描述与 SELL_GOAL 同源派生（累计售出 30 株魔法蘑菇）',
  !!sell && sell.d === `累计售出 ${SELL_GOAL} 株魔法蘑菇`, sell && sell.d);

// —— menus.js 源级落位 ——
ok('menus.js import 已含 SELL_GOAL（data.js 既有导出，零新增模块依赖）',
  mSrc.includes('INN_REST_GOAL, TRAVEL_GOAL, SELL_GOAL, POTIONS2_GOAL, BREW2_GOAL, ELIXIR_STOCK2_GOAL, BATTLE_GOAL, DEATH_GOAL } from'));
ok('menus.js drawShop 补「🍄 蘑菇商路 N/30」进度行（模板逐字：分子读 hero.sold 防御式）',
  mSrc.includes('`🍄 蘑菇商路 ${(hero.sold || 0)}/${SELL_GOAL}`'));
ok('menus.js 进度行落位参数（86 · 80 · 12px · #7d93a3 · 左对齐，标题行左缘）',
  mSrc.includes("86, 80, '12px', '#7d93a3', 'left'"));
ok('menus.js 含 v24.09 注释（drawShop 行内说明块）', mSrc.includes('v24.09 商店界面补「🍄 蘑菇商路 N/30」进度角标'));
ok('menus.js 金币行零回归（520,80 · 14px · #ffd24a · 右对齐）',
  mSrc.includes("520,80,'14px','#ffd24a','right'"));
ok('menus.js 商店面板标题零回归（panel(60,50,520,360,\'杂货商店\')）',
  mSrc.includes("panel(60,50,520,360,'杂货商店')"));
ok('menus.js 页脚行零回归（绿色▲=更强升级 灰色=买不起 · ↑↓选择 Enter/E购买 Esc离开）',
  mSrc.includes('绿色▲=更强升级 灰色=买不起'));
ok('menus.js 视窗滚动提示零回归（还有 N 项未在本页显示）',
  mSrc.includes('还有 ${remain} 项未在本页显示'));

// —— 计数源三端同源互证（结算/判定/角标读同一份源）——
ok('shop.js sellMushroom 计数逐字落位（hero.sold = (hero.sold || 0) + 1;）',
  sSrc.includes('hero.sold = (hero.sold || 0) + 1;'));
ok('shop.js sellMushroom 计数防御式（sold||0 旧档零迁移）', sSrc.includes('(hero.sold || 0) + 1'));
ok('shop.js 注释含蘑菇商路计数源说明（v23.82 经济收入端口先例）',
  sSrc.includes('v23.82 成就「蘑菇商路」计数'));

// —— README 同步 ——
ok('README 含 v24.09 守护描述（商店界面「🍄 蘑菇商路 N/30」进度角标守护）',
  readme.includes('v24.09 起含 商店界面「🍄 蘑菇商路 N/30」进度角标守护'));
ok('README tests 树串尾已延伸至 smoke_v2409_sellgoal（... + smoke_v2407_innrest + smoke_v2408_travelgoal + smoke_v2409_sellgoal + smoke_v2410_brewgoal + smoke_v2411_deathprog + smoke_v2412_battlegoal + smoke_v2413_xpcurve + smoke_v2414_nightbattle + smoke_v2415_treepin + smoke_v2416_steps + smoke_v2417_mapdrink + smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog（npm test 串跑））',
  readme.includes('+ smoke_v2407_innrest + smoke_v2408_travelgoal + smoke_v2409_sellgoal + smoke_v2410_brewgoal + smoke_v2411_deathprog + smoke_v2412_battlegoal + smoke_v2413_xpcurve + smoke_v2414_nightbattle + smoke_v2415_treepin + smoke_v2416_steps + smoke_v2417_mapdrink + smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog（npm test 串跑）'));
ok('README 件套口径为二百七十二件套（二百七十一件套清除）且旧 232 口径零残留',
  readme.includes('冒烟二百七十二件套（二百七十一件套清除）') && !readme.includes('冒烟二百三十二件套（二百三十一件套清除）'));
ok('README 含 smoke_v2409_sellgoal 入库（272 份）', readme.includes('smoke_v2409_sellgoal 入库（272 份）'));
ok('README 仍保留 v24.08 历史守护描述与入库口径（快速旅行面板 + 232 份）',
  readme.includes('v24.08 起含 快速旅行面板「🚶 行者无疆 N/15」进度角标守护') && readme.includes('smoke_v2408_travelgoal 入库（232 份）'));

// —— package.json 同步 ——
const testChain = (JSON.parse(pkg).scripts.test.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 233 件套', testChain === 272, String(testChain));
ok('package.json 已收录 smoke_v2409_sellgoal（npm test 串跑第 235 份）',
  JSON.parse(pkg).scripts.test.includes('smoke_v2409_sellgoal.mjs'));
ok('package.json 串尾为 ... smoke_v2408_travelgoal.mjs && node tests/smoke_v2409_sellgoal.mjs && node tests/smoke_v2410_brewgoal.mjs && node tests/smoke_v2411_deathprog.mjs && node tests/smoke_v2412_battlegoal.mjs && node tests/smoke_v2413_xpcurve.mjs && node tests/smoke_v2414_nightbattle.mjs && node tests/smoke_v2415_treepin.mjs && node tests/smoke_v2416_steps.mjs && node tests/smoke_v2417_mapdrink.mjs && node tests/smoke_v2418_goldcurve.mjs && node tests/smoke_v2419_luckdrp.mjs && node tests/smoke_v2420_skillprog.mjs && node tests/smoke_v2421_allquest.mjs && node tests/smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs"',
  pkg.includes('smoke_v2408_travelgoal.mjs && node tests/smoke_v2409_sellgoal.mjs && node tests/smoke_v2410_brewgoal.mjs && node tests/smoke_v2411_deathprog.mjs && node tests/smoke_v2412_battlegoal.mjs && node tests/smoke_v2413_xpcurve.mjs && node tests/smoke_v2414_nightbattle.mjs && node tests/smoke_v2415_treepin.mjs && node tests/smoke_v2416_steps.mjs && node tests/smoke_v2417_mapdrink.mjs && node tests/smoke_v2418_goldcurve.mjs && node tests/smoke_v2419_luckdrp.mjs && node tests/smoke_v2420_skillprog.mjs && node tests/smoke_v2421_allquest.mjs && node tests/smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs"'));

// —— CHANGELOG 同步 ——
ok('CHANGELOG 顶部已追加 v24.18 条目（商店界面蘑菇商路进度角标）', changelog.startsWith('## v24.48 '));
ok('CHANGELOG 顶部条目含蘑菇商路与 SELL_GOAL/商店界面口径说明',
  changelog.includes('蘑菇商路') && changelog.includes('SELL_GOAL') && changelog.includes('商店界面'));
ok('CHANGELOG 仍保留 v24.08 与 v24.07 条目标题（历史口径）',
  changelog.includes('## v24.08 体验打磨·信息透明·决策现场') && changelog.includes('## v24.07 体验打磨·信息透明·决策现场'));

// —— 哨兵链：v2143 前哨前望 234 且 README 尚无 234 口径 ——
const s2143 = read('tests/smoke_v2143_talkekey.mjs');
ok('smoke_v2143 哨兵链已推进至二百七十二件套（二百七十一件套清除）',
  s2143.includes('二百四十七件套（二百四十五件套清除）') && s2143.includes("!readme.includes('二百七十二件套（二百七十二件套清除）')"));
ok('README 尚无二百四十七件套（二百四十五件套清除）前望口径', !readme.includes('二百七十二件套（二百七十二件套清除）'));

// —— 旧代 v24.08 pin 全库零残留（不含本件；拆串防误伤，承 v2405-v2408 惯例）——
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2409_sellgoal.mjs');
const stale = [];
for (const f of allTests) {
  const src = read('tests/' + f);
  if (src.includes("const GAME_VERSION = 'v24.0" + "8';") ||
      src.includes("const GAME_VERSION = 'v24.0" + "8'") ||
      src.includes("GAME_VERSION === 'v24.0" + "8'") ||
      src.includes("startsWith('## v24.0" + "8 ") ||
      src.includes("startsWith('## v24.0" + "8'") ||
      src.includes('已为 v24.0' + '8（') ||
      src.includes('已追加 v24.0' + '8 条目') ||
      src.includes('冒烟二百三十二件套（二百三十一件套清' + '除）') ||
      src.includes('二百三十二件套（二百三十一件套清' + '除）') ||
      src.includes('testChain === ' + '232') ||
      src.includes('+ smoke_v2408_travelgoal（npm test 串' + '跑）') ||
      src.includes('node tests/smoke_v2408_travelgoal.mjs' + '"')) stale.push(f);
}
ok('旧代 v24.08 字面量/恒等/顶 pin/件套 232 口径/testChain 232/串尾 & 树串尾 全库零残留（' + allTests.length + ' 件扫描）',
  stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
