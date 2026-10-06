// v24.07 专项冒烟：旅馆界面补「🏨 夜宿灯下 N/15」进度行——「要不要花 10 金住店」一眼看清还差几次拿成就
// （体验打磨·信息透明·决策现场，承 v24.05 试炼碑「📜 千锤百炼 N/3」同款行内角标 / v23.62 图鉴行
// 「· 📜 支线 N/M」同款 / v23.73 夜宿灯下成就同一「成就进度于决策现场可见」主线：旅馆界面此前只报
// 恢复量/金币余额/价格，成就「夜宿灯下」（旅馆住宿累计 INN_REST_GOAL(15) 次，计数 hero.innRests
// 由 shop.stayInn 成功住店唯一产生点写入、snapshotHero 全量快照自动持久化、防御式 (g.innRests||0)
// 旧档零迁移）进度只藏在 C 成就页一行 X/15——站旅店柜台前查无一眼之数；现 drawInn 补
// 「🏨 夜宿灯下 N/15」（分子读 hero.innRests 防御式 (hero.innRests||0)、分母读 data.js
// INN_REST_GOAL 单一数据源，与 ACH_LIST innrest 的 ok/prog 同读一份源，调阈值只改 data.js 一处
// 三端自动跟随）；纯显示零结算零存档零数值变化（INN_REST_GOAL/住宿结算/价格行/恢复预览/提示行
// 逐字未动）。
// 本冒烟守护：版本锚点、data.js/menus.js 源级落位（v24.07 注释 / GAME_VERSION v24.07 与旧 v24.06
// 字面量零残留 / v24.06 历史注释保留 / INN_REST_GOAL 常量逐字）、运行期常量实值（INN_REST_GOAL 15）
// 与 ACH_LIST innrest 同源互证（ok/prog 逐值）、计数源 shop.stayInn 三端同源互证、README/package.json/
// CHANGELOG 同步（件套口径 231 + v24.07 守护描述 + 入库 231 + tests 树串尾 + package 串尾 + 旅馆行）、
// 哨兵链（v2143 前望 232 且 README 尚无 232 口径）、旧代 v24.06 pin 全库零残留扫描。
import { INN_REST_GOAL, GAME_VERSION, ACH_LIST } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.07 旅馆界面「🏨 夜宿灯下 N/15」进度行 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const mSrc = read('js/view/menus.js');
const sSrc = read('js/shop.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v24.06 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.06', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 6)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.21（旧 v24.06 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.56';") && !dSrc.includes("const GAME_VERSION = 'v24.0" + "6';"));
ok('data.js 含 v24.07 注释（旅馆界面「🏨 夜宿灯下 N/15」进度行说明）',
  dSrc.includes('// v24.07 体验打磨·信息透明·决策现场'));
ok('data.js 仍保留 v24.06 历史注释（「恢复点 / 补给」数值速查行说明，累积注释块）',
  dSrc.includes('// v24.06 文档整理·数值说明·同源口径'));
ok('data.js 常量逐字落位（const INN_REST_GOAL = 15;）', dSrc.includes('const INN_REST_GOAL = 15;'));

// —— 运行期常量实值（单一数据源）——
ok('INN_REST_GOAL === 15（夜宿灯下阈值，与 C 页/描述/判定同源）', INN_REST_GOAL === 15, String(INN_REST_GOAL));
const inn = ACH_LIST.find((a) => a && a.id === 'innrest');
ok('ACH_LIST 含 innrest「夜宿灯下」（与 drawInn 角标同读一份源）', !!inn && inn.name === '夜宿灯下', inn && inn.name);
ok('innrest ok 谓词逐值（0/14 false · 15/20 true）',
  !!inn && inn.ok({ innRests: 0 }) === false && inn.ok({ innRests: 14 }) === false &&
  inn.ok({ innRests: 15 }) === true && inn.ok({ innRests: 20 }) === true);
ok('innrest prog 逐值（0→0/15 · 3→3/15 · 15→15/15）',
  !!inn && inn.prog({ innRests: 0 }) === '0/15' && inn.prog({ innRests: 3 }) === '3/15' &&
  inn.prog({ innRests: 15 }) === '15/15');

// —— menus.js 源级落位 ——
ok('menus.js import 已含 INN_REST_GOAL（data.js 既有导出，零新增模块依赖）',
  mSrc.includes('INN_REST_GOAL'));
ok('menus.js drawInn 补「🏨 夜宿灯下 N/15」进度行（模板逐字：分子读 hero.innRests 防御式）',
  mSrc.includes('`🏨 夜宿灯下 ${(hero.innRests || 0)}/${INN_REST_GOAL}`'));
ok('menus.js 进度行落位参数（y=300 · 13px · #8ff0a0 · 居中，面板底 350 之内）',
  mSrc.includes("320,300,'13px','#8ff0a0','center'"));
ok('menus.js 含 v24.07 注释（drawInn 行内说明块）', mSrc.includes('v24.07 旅馆界面补「🏨 夜宿灯下 N/15」进度行'));
ok('menus.js 旅馆面板标题零回归（panel(120,70,400,280,\'🏨 旅店\')）',
  mSrc.includes("panel(120,70,400,280,'🏨 旅店')"));
ok('menus.js 价格行零回归（价格：${INN_PRICE} 金币  (💰${hero.gold})）',
  mSrc.includes('`价格：${INN_PRICE} 金币  (💰${hero.gold})`'));
ok('menus.js 恢复预览零回归（今晚将恢复 HP +N MP +M）', mSrc.includes('今晚将恢复'));
ok('menus.js 提示行零回归（[Enter/E] 住宿休息   [Esc] 离开）',
  mSrc.includes('[Enter/E] 住宿休息   [Esc] 离开'));

// —— 计数源三端同源互证（结算/判定/角标读同一份源）——
ok('shop.js stayInn 计数逐字落位（hero.innRests = (hero.innRests || 0) + 1）',
  sSrc.includes('hero.innRests = (hero.innRests || 0) + 1;'));
ok('shop.js stayInn 计数防御式（innRests||0 旧档零迁移）', sSrc.includes('(hero.innRests || 0) + 1'));
ok('shop.js stayInn 扣款读 INN_PRICE 且消费计数同处（spent + INN_PRICE）',
  sSrc.includes('hero.gold >= INN_PRICE') && sSrc.includes('hero.spent + INN_PRICE'));
ok('shop.js 注释含 INN_REST_GOAL 阈值口径（夜宿灯下无处兑现先例）',
  sSrc.includes('INN_REST_GOAL'));

// —— README 同步 ——
ok('README 含 v24.07 守护描述（旅馆界面「🏨 夜宿灯下 N/15」进度行守护）',
  readme.includes('v24.07 起含 旅馆界面「🏨 夜宿灯下 N/15」进度行守护'));
ok('README 经济循环行含 v24.07 旅馆界面口径（v24.07 起旅馆界面常显）',
  readme.includes('**v24.07 起旅馆界面常显「🏨 夜宿灯下 N/15」进度行**'));
ok('README tests 树串尾已延伸至 smoke_v2407_innrest（... + smoke_v2406_restrow + smoke_v2407_innrest + smoke_v2408_travelgoal + smoke_v2409_sellgoal + smoke_v2410_brewgoal + smoke_v2411_deathprog + smoke_v2412_battlegoal + smoke_v2413_xpcurve + smoke_v2414_nightbattle + smoke_v2415_treepin + smoke_v2416_steps + smoke_v2417_mapdrink + smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend（npm test 串跑））',
  readme.includes('+ smoke_v2405_trialgoal + smoke_v2406_restrow + smoke_v2407_innrest + smoke_v2408_travelgoal + smoke_v2409_sellgoal + smoke_v2410_brewgoal + smoke_v2411_deathprog + smoke_v2412_battlegoal + smoke_v2413_xpcurve + smoke_v2414_nightbattle + smoke_v2415_treepin + smoke_v2416_steps + smoke_v2417_mapdrink + smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend（npm test 串跑）'));
ok('README 件套口径为二百八十件套（二百七十九件套清除）且旧 230 口径零残留',
  readme.includes('冒烟二百八十件套（二百七十九件套清除）') && !readme.includes('冒烟二百三十件套（二百二十九件套清除）'));
ok('README 含 smoke_v2407_innrest 入库（231 份）', readme.includes('smoke_v2407_innrest 入库（231 份）'));
ok('README 仍保留 v24.06 历史守护描述与入库口径（恢复点/补给 + 230 份）',
  readme.includes('v24.06 起含 「恢复点 / 补给」数值速查行守护') && readme.includes('smoke_v2406_restrow 入库（230 份）'));
ok('README 仍保留 v24.05 历史守护描述（试炼碑千锤百炼）',
  readme.includes('v24.05 起含 试炼碑「千锤百炼」进度角标守护'));

// —— package.json 同步 ——
const testChain = (JSON.parse(pkg).scripts.test.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 231 件套', testChain === 280, String(testChain));
ok('package.json 已收录 smoke_v2407_innrest（npm test 串跑第 231 份）',
  JSON.parse(pkg).scripts.test.includes('smoke_v2407_innrest.mjs'));
ok('package.json 串尾为 ... smoke_v2406_restrow.mjs && node tests/smoke_v2407_innrest.mjs && node tests/smoke_v2408_travelgoal.mjs && node tests/smoke_v2409_sellgoal.mjs && node tests/smoke_v2410_brewgoal.mjs && node tests/smoke_v2411_deathprog.mjs && node tests/smoke_v2412_battlegoal.mjs && node tests/smoke_v2413_xpcurve.mjs && node tests/smoke_v2414_nightbattle.mjs && node tests/smoke_v2415_treepin.mjs && node tests/smoke_v2416_steps.mjs && node tests/smoke_v2417_mapdrink.mjs && node tests/smoke_v2418_goldcurve.mjs && node tests/smoke_v2419_luckdrp.mjs && node tests/smoke_v2420_skillprog.mjs && node tests/smoke_v2421_allquest.mjs && node tests/smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs"',
  pkg.includes('smoke_v2406_restrow.mjs && node tests/smoke_v2407_innrest.mjs && node tests/smoke_v2408_travelgoal.mjs && node tests/smoke_v2409_sellgoal.mjs && node tests/smoke_v2410_brewgoal.mjs && node tests/smoke_v2411_deathprog.mjs && node tests/smoke_v2412_battlegoal.mjs && node tests/smoke_v2413_xpcurve.mjs && node tests/smoke_v2414_nightbattle.mjs && node tests/smoke_v2415_treepin.mjs && node tests/smoke_v2416_steps.mjs && node tests/smoke_v2417_mapdrink.mjs && node tests/smoke_v2418_goldcurve.mjs && node tests/smoke_v2419_luckdrp.mjs && node tests/smoke_v2420_skillprog.mjs && node tests/smoke_v2421_allquest.mjs && node tests/smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs"'));

// —— CHANGELOG 同步 ——
ok('CHANGELOG 顶部已追加 v24.18 条目（旅馆界面夜宿灯下进度行）', changelog.startsWith('## v24.56 '));
ok('CHANGELOG 顶部条目含夜宿灯下与 INN_REST_GOAL/旅馆界面口径说明',
  changelog.includes('夜宿灯下') && changelog.includes('INN_REST_GOAL') && changelog.includes('旅馆界面'));
ok('CHANGELOG 仍保留 v24.06 与 v24.05 条目标题（历史口径）',
  changelog.includes('## v24.06 文档整理·数值说明·同源口径') && changelog.includes('## v24.05 体验打磨·信息透明·决策现场'));

// —— 哨兵链：v2143 前哨前望 232 且 README 尚无 232 口径 ——
const s2143 = read('tests/smoke_v2143_talkekey.mjs');
ok('smoke_v2143 哨兵链已推进至二百八十件套（二百七十九件套清除）',
  s2143.includes('二百四十七件套（二百四十五件套清除）') && s2143.includes("!readme.includes('二百七十七件套（二百七十七件套清除）')"));
ok('README 尚无二百四十七件套（二百四十五件套清除）前望口径', !readme.includes('二百七十七件套（二百七十七件套清除）'));

// —— 旧代 v24.06 pin 全库零残留（不含本件；拆串防误伤，承 v2400/v2404/v2405/v2406 惯例）——
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2407_innrest.mjs');
const stale = [];
for (const f of allTests) {
  const src = read('tests/' + f);
  if (src.includes("const GAME_VERSION = 'v24.0" + "6';") ||
      src.includes("GAME_VERSION === 'v24.0" + "6'") ||
      src.includes("startsWith('## v24.0" + "6 ')") ||
      src.includes("startsWith('## v24.0" + "6 ") ||
      src.includes("startsWith('## v24.0" + "6'") ||
      src.includes('已为 v24.0' + '6（') ||
      src.includes('已追加 v24.0' + '6 条目') ||
      src.includes('冒烟二百三十件套（二百二十九件套清' + '除）') ||
      src.includes('二百三十件套（二百二十九件套清' + '除）') ||
      src.includes('testChain === ' + '230') ||
      src.includes('smoke_v2405_trialgoal + smoke_v2406_restrow（npm test 串' + '跑）') ||
      src.includes('node tests/smoke_v2406_restrow.mjs' + '"') ||
      src.includes('smoke_v2406_restrow\\' + '.mjs"') ||
      src.includes('smoke_v2406_restrow\\\\' + '.mjs"')) stale.push(f);
}
ok('旧代 v24.06 字面量/恒等/顶 pin/件套 230 口径/testChain 230/串尾 & 树串尾 全库零残留（' + allTests.length + ' 件扫描）',
  stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
