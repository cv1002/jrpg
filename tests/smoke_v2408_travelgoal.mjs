// v24.08 专项冒烟：快速旅行面板标题行左侧补「🚶 行者无疆 N/15」进度角标——「按 Enter/E 传送」一眼看清
// 还差几次拿成就（体验打磨·信息透明·决策现场，承 v24.07 旅馆「🏨 夜宿灯下 N/15」/ v24.05 试炼碑
// 「📜 千锤百炼 N/3」同款行内角标 / v23.75 行者无疆成就同一「成就进度于决策现场可见」主线：
// 快速旅行面板此前只报 行态/推荐等级/补给提示/已探索计数，成就「行者无疆」（快速旅行累计
// TRAVEL_GOAL(15) 次，计数 hero.travels 由 core.doTravel 成功旅行唯一产生点写入（未探索/已在原地
// 早退零计数）、snapshotHero 全量快照自动持久化、防御式 (g.travels||0) 旧档零迁移）进度只藏在
// C 成就页一行 X/15——站旅行面板前查无一眼之数；现 drawTravel 补「🚶 行者无疆 N/15」
// （分子读 hero.travels 防御式 (hero.travels||0)、分母读 data.js TRAVEL_GOAL 单一数据源，与
// ACH_LIST travels 的 ok/prog 同读一份源，调阈值只改 data.js 一处三端自动跟随），12px 灰字左对齐
// x=138 与右缘「已探索 N/4」（510 右对齐）对称、与居中标题（≈275..365）零重叠；纯显示零结算
// 零存档零数值变化（TRAVEL_GOAL/doTravel 结算/行态/页脚/预警行逐字未动）。
// 本冒烟守护：版本锚点、data.js/menus.js 源级落位（v24.08 注释 / GAME_VERSION v24.08 与旧 v24.07
// 字面量零残留 / v24.07 历史注释保留 / TRAVEL_GOAL 常量逐字）、运行期常量实值（TRAVEL_GOAL 15）
// 与 ACH_LIST travels 同源互证（ok/prog 逐值）、计数源 core.doTravel 三端同源互证、README/package.json/
// CHANGELOG 同步（件套口径 232 + v24.08 守护描述 + 入库 232 + tests 树串尾 + package 串尾 + T 行）、
// 哨兵链（v2143 前望 233 且 README 尚无 233 口径）、旧代 v24.07 pin 全库零残留扫描。
import { TRAVEL_GOAL, GAME_VERSION, ACH_LIST } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.08 快速旅行面板「🚶 行者无疆 N/15」进度角标 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const mSrc = read('js/view/menus.js');
const cSrc = read('js/core.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v24.07 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.07', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 7)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.21（旧 v24.07 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.49';") && !dSrc.includes("const GAME_VERSION = 'v24.0" + "7';"));
ok('data.js 含 v24.08 注释（快速旅行面板「🚶 行者无疆 N/15」进度角标说明）',
  dSrc.includes('// v24.08 体验打磨·信息透明·决策现场'));
ok('data.js 仍保留 v24.07 历史注释（旅馆「🏨 夜宿灯下 N/15」进度行说明，累积注释块）',
  dSrc.includes('// v24.07 体验打磨·信息透明·决策现场'));
ok('data.js 常量逐字落位（const TRAVEL_GOAL = 15;）', dSrc.includes('const TRAVEL_GOAL = 15;'));

// —— 运行期常量实值（单一数据源）——
ok('TRAVEL_GOAL === 15（行者无疆阈值，与 C 页/描述/判定同源）', TRAVEL_GOAL === 15, String(TRAVEL_GOAL));
const trav = ACH_LIST.find((a) => a && a.id === 'travels');
ok('ACH_LIST 含 travels「行者无疆」（与 drawTravel 角标同读一份源）', !!trav && trav.name === '行者无疆', trav && trav.name);
ok('travels ok 谓词逐值（0/14 false · 15/20 true）',
  !!trav && trav.ok({ travels: 0 }) === false && trav.ok({ travels: 14 }) === false &&
  trav.ok({ travels: 15 }) === true && trav.ok({ travels: 20 }) === true);
ok('travels prog 逐值（0→0/15 · 3→3/15 · 15→15/15）',
  !!trav && trav.prog({ travels: 0 }) === '0/15' && trav.prog({ travels: 3 }) === '3/15' &&
  trav.prog({ travels: 15 }) === '15/15');
ok('travels 描述与 TRAVEL_GOAL 同源派生（快速旅行累计 15 次）',
  !!trav && trav.d === `快速旅行累计 ${TRAVEL_GOAL} 次`, trav && trav.d);

// —— menus.js 源级落位 ——
ok('menus.js import 已含 TRAVEL_GOAL（data.js 既有导出，零新增模块依赖）',
  mSrc.includes('TRAVEL_GOAL'));
ok('menus.js drawTravel 补「🚶 行者无疆 N/15」进度行（模板逐字：分子读 hero.travels 防御式）',
  mSrc.includes('`🚶 行者无疆 ${(hero.travels || 0)}/${TRAVEL_GOAL}`'));
ok('menus.js 进度行落位参数（138 · 86 · 12px · #7d93a3 · 左对齐，标题行左缘）',
  mSrc.includes("138, 86, '12px', '#7d93a3', 'left'"));
ok('menus.js 含 v24.08 注释（drawTravel 行内说明块）', mSrc.includes('v24.08 快速旅行面板标题行左侧补「🚶 行者无疆 N/15」进度角标'));
ok('menus.js 已探索计数行零回归（510,86 · 12px · #7d93a3 · 右对齐）',
  mSrc.includes("510, 86, '12px', '#7d93a3', 'right'"));
ok('menus.js 面板标题零回归（panel(120,60,400,320,\'🧭 快速旅行\')）',
  mSrc.includes("panel(120,60,400,320,'🧭 快速旅行')"));
ok('menus.js 页脚行零回归（↑↓ 选择 · Enter/E 传送 · Esc 取消）',
  mSrc.includes('[Enter/E] 传送') || mSrc.includes('Enter/E 传送'));
ok('menus.js 等级预警/补给提示零回归（lowLv 分支预警行模板保留）',
  mSrc.includes('目的地推荐 Lv.') && mSrc.includes('没有泉水/旅店 · 出发前请补给'));

// —— 计数源三端同源互证（结算/判定/角标读同一份源）——
ok('core.js doTravel 计数逐字落位（g.travels = (g.travels || 0) + 1;）',
  cSrc.includes('g.travels = (g.travels || 0) + 1;'));
ok('core.js doTravel 计数防御式（travels||0 旧档零迁移）', cSrc.includes('(g.travels || 0) + 1'));
ok('core.js 注释含 TRAVEL_GOAL 阈值口径（行者无疆同源先例）', cSrc.includes('TRAVEL_GOAL'));

// —— README 同步 ——
ok('README 含 v24.08 守护描述（快速旅行面板「🚶 行者无疆 N/15」进度角标守护）',
  readme.includes('v24.08 起含 快速旅行面板「🚶 行者无疆 N/15」进度角标守护'));
ok('README T 行含 v24.08 快速旅行面板口径（v24.08 起快速旅行面板标题行左侧常显）',
  readme.includes('**v24.08 起快速旅行面板标题行左侧常显「🚶 行者无疆 N/15」进度角标**'));
ok('README tests 树串尾已延伸至 smoke_v2408_travelgoal（... + smoke_v2407_innrest + smoke_v2408_travelgoal + smoke_v2409_sellgoal + smoke_v2410_brewgoal + smoke_v2411_deathprog + smoke_v2412_battlegoal + smoke_v2413_xpcurve + smoke_v2414_nightbattle + smoke_v2415_treepin + smoke_v2416_steps + smoke_v2417_mapdrink + smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8（npm test 串跑））',
  readme.includes('+ smoke_v2407_innrest + smoke_v2408_travelgoal + smoke_v2409_sellgoal + smoke_v2410_brewgoal + smoke_v2411_deathprog + smoke_v2412_battlegoal + smoke_v2413_xpcurve + smoke_v2414_nightbattle + smoke_v2415_treepin + smoke_v2416_steps + smoke_v2417_mapdrink + smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8（npm test 串跑）'));
ok('README 件套口径为二百七十三件套（二百七十二件套清除）且旧 231 口径零残留',
  readme.includes('冒烟二百七十三件套（二百七十二件套清除）') && !readme.includes('冒烟二百三十一件套（二百三十件套清除）'));
ok('README 含 smoke_v2408_travelgoal 入库（232 份）', readme.includes('smoke_v2408_travelgoal 入库（232 份）'));
ok('README 仍保留 v24.07 历史守护描述与入库口径（旅馆界面 + 231 份）',
  readme.includes('v24.07 起含 旅馆界面「🏨 夜宿灯下 N/15」进度行守护') && readme.includes('smoke_v2407_innrest 入库（231 份）'));

// —— package.json 同步 ——
const testChain = (JSON.parse(pkg).scripts.test.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 232 件套', testChain === 273, String(testChain));
ok('package.json 已收录 smoke_v2408_travelgoal（npm test 串跑第 232 份）',
  JSON.parse(pkg).scripts.test.includes('smoke_v2408_travelgoal.mjs'));
ok('package.json 串尾为 ... smoke_v2407_innrest.mjs && node tests/smoke_v2408_travelgoal.mjs && node tests/smoke_v2409_sellgoal.mjs && node tests/smoke_v2410_brewgoal.mjs && node tests/smoke_v2411_deathprog.mjs && node tests/smoke_v2412_battlegoal.mjs && node tests/smoke_v2413_xpcurve.mjs && node tests/smoke_v2414_nightbattle.mjs && node tests/smoke_v2415_treepin.mjs && node tests/smoke_v2416_steps.mjs && node tests/smoke_v2417_mapdrink.mjs && node tests/smoke_v2418_goldcurve.mjs && node tests/smoke_v2419_luckdrp.mjs && node tests/smoke_v2420_skillprog.mjs && node tests/smoke_v2421_allquest.mjs && node tests/smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs"',
  pkg.includes('smoke_v2407_innrest.mjs && node tests/smoke_v2408_travelgoal.mjs && node tests/smoke_v2409_sellgoal.mjs && node tests/smoke_v2410_brewgoal.mjs && node tests/smoke_v2411_deathprog.mjs && node tests/smoke_v2412_battlegoal.mjs && node tests/smoke_v2413_xpcurve.mjs && node tests/smoke_v2414_nightbattle.mjs && node tests/smoke_v2415_treepin.mjs && node tests/smoke_v2416_steps.mjs && node tests/smoke_v2417_mapdrink.mjs && node tests/smoke_v2418_goldcurve.mjs && node tests/smoke_v2419_luckdrp.mjs && node tests/smoke_v2420_skillprog.mjs && node tests/smoke_v2421_allquest.mjs && node tests/smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs"'));

// —— CHANGELOG 同步 ——
ok('CHANGELOG 顶部已追加 v24.18 条目（快速旅行面板行者无疆进度角标）', changelog.startsWith('## v24.49 '));
ok('CHANGELOG 顶部条目含行者无疆与 TRAVEL_GOAL/快速旅行面板口径说明',
  changelog.includes('行者无疆') && changelog.includes('TRAVEL_GOAL') && changelog.includes('快速旅行面板'));
ok('CHANGELOG 仍保留 v24.07 与 v24.06 条目标题（历史口径）',
  changelog.includes('## v24.07 体验打磨·信息透明·决策现场') && changelog.includes('## v24.06 文档整理·数值说明·同源口径'));

// —— 哨兵链：v2143 前哨前望 233 且 README 尚无 233 口径 ——
const s2143 = read('tests/smoke_v2143_talkekey.mjs');
ok('smoke_v2143 哨兵链已推进至二百七十三件套（二百七十二件套清除）',
  s2143.includes('二百四十七件套（二百四十五件套清除）') && s2143.includes("!readme.includes('二百七十三件套（二百七十三件套清除）')"));
ok('README 尚无二百四十七件套（二百四十五件套清除）前望口径', !readme.includes('二百七十三件套（二百七十三件套清除）'));

// —— 旧代 v24.07 pin 全库零残留（不含本件；拆串防误伤，承 v2404-v2407 惯例）——
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2408_travelgoal.mjs');
const stale = [];
for (const f of allTests) {
  const src = read('tests/' + f);
  if (src.includes("const GAME_VERSION = 'v24.0" + "7';") ||
      src.includes("GAME_VERSION === 'v24.0" + "7'") ||
      src.includes("startsWith('## v24.0" + "7 ')") ||
      src.includes("startsWith('## v24.0" + "7 ") ||
      src.includes("startsWith('## v24.0" + "7'") ||
      src.includes('已为 v24.0' + '7（') ||
      src.includes('已追加 v24.0' + '7 条目') ||
      src.includes('冒烟二百三十一件套（二百三十件套清' + '除）') ||
      src.includes('二百三十一件套（二百三十件套清' + '除）') ||
      src.includes('testChain === ' + '231') ||
      src.includes('smoke_v2406_restrow + smoke_v2407_innrest（npm test 串' + '跑）') ||
      src.includes('node tests/smoke_v2407_innrest.mjs' + '"') ||
      src.includes('smoke_v2407_innrest\\' + '.mjs"') ||
      src.includes('smoke_v2407_innrest\\\\' + '.mjs"')) stale.push(f);
}
ok('旧代 v24.07 字面量/恒等/顶 pin/件套 231 口径/testChain 231/串尾 & 树串尾 全库零残留（' + allTests.length + ' 件扫描）',
  stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
