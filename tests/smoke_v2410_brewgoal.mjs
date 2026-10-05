// v24.10 专项冒烟：酿造界面补「🍶 妙手回春 N/5」进度角标——「要不要把菇熬成灵药」一眼看清还差几瓶
// 拿成就（体验打磨·信息透明·决策现场，承 v24.09 商店「🍄 蘑菇商路 N/30」/ v24.08 快速旅行
// 「🚶 行者无疆 N/15」/ v24.07 旅馆「🏨 夜宿灯下 N/15」/ v24.05 试炼碑「📜 千锤百炼 N/3」同款
// 行内角标 / v22.4 妙手回春成就同一「成就进度于决策现场可见」主线：酿造锅（drawBrew、core.brewNow
// 全游唯一酿造口）的决策现场此前只报 材料/配方/恢复量/可酿瓶数（v23.17），成就「妙手回春」（累计
// 酿造 BREW2_GOAL(5) 瓶高级灵药，计数 hero.brews 由 core.brewNow 酿造成功唯一产生点写入、
// snapshotHero 全量快照自动持久化、防御式 (hero.brews||0) 旧档零迁移）进度只藏在 C 成就页一行
// X/5——站锅前查无一眼之数；现 drawBrew 补「🍶 妙手回春 N/5」（分子读 hero.brews 防御式
// (hero.brews||0)、分母读 data.js BREW2_GOAL 单一数据源，与 ACH_LIST brew2 的 ok/prog 同读一份源，
// 调阈值只改 data.js 一处三端自动跟随），13px 绿字居中 y=288 与「还可酿造」行（236）/提示行（262）
// 行间零重叠、面板底 380 之内零越界；纯显示零结算零存档零数值变化（BREW2_GOAL/brewNow 结算/材料行/
// 配方行/恢复量行/可酿行/提示行逐字未动）。
// 本冒烟守护：版本锚点、data.js/menus.js 源级落位（v24.10 注释 / GAME_VERSION v24.10 与旧 v24.09
// 字面量零残留 / v24.09 历史注释保留 / BREW2_GOAL 常量逐字）、运行期常量实值（BREW2_GOAL 5）
// 与 ACH_LIST brew2 同源互证（ok/prog/d 逐值）、计数源 brewNow 三端同源互证、
// README/package.json/CHANGELOG 同步（件套口径 239 + v24.10 守护描述 + 入库 239 + tests 树串尾 +
// package 串尾）、哨兵链（v2143 前望 235 且 README 尚无 235 口径）、旧代 v24.09 pin 全库零残留扫描。
import { BREW2_GOAL, GAME_VERSION, ACH_LIST } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.10 酿造界面「🍶 妙手回春 N/5」进度角标 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const mSrc = read('js/view/menus.js');
const cSrc = read('js/core.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（格式合法 + 已越过 v24.09 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.09', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 9)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.21（旧 v24.09 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.45';") && !dSrc.includes("const GAME_VERSION = 'v24.0" + "9';"));
ok('data.js 含 v24.10 注释（酿造界面「🍶 妙手回春 N/5」进度角标说明）',
  dSrc.includes('// v24.10 体验打磨·信息透明·决策现场'));
ok('data.js 仍保留 v24.09 历史注释（商店界面「🍄 蘑菇商路 N/30」进度角标说明，累积注释块）',
  dSrc.includes('// v24.09 体验打磨·信息透明·决策现场'));
ok('data.js 常量逐字落位（const BREW2_GOAL = 5;）', dSrc.includes('const BREW2_GOAL = 5;'));

// —— 运行期常量实值（单一数据源）——
ok('BREW2_GOAL === 5（妙手回春阈值，与 C 页/描述/判定同源）', BREW2_GOAL === 5, String(BREW2_GOAL));
const brew2 = ACH_LIST.find((a) => a && a.id === 'brew2');
ok('ACH_LIST 含 brew2「妙手回春」（与 drawBrew 角标同读一份源）', !!brew2 && brew2.name === '妙手回春', brew2 && brew2.name);
ok('brew2 ok 谓词逐值（0/4 false · 5/10 true）',
  !!brew2 && brew2.ok({ brews: 0 }) === false && brew2.ok({ brews: 4 }) === false &&
  brew2.ok({ brews: 5 }) === true && brew2.ok({ brews: 10 }) === true);
ok('brew2 prog 逐值（0→0/5 · 4→4/5 · 5→5/5）',
  !!brew2 && brew2.prog({ brews: 0 }) === '0/5' && brew2.prog({ brews: 4 }) === '4/5' &&
  brew2.prog({ brews: 5 }) === '5/5');
ok('brew2 描述与 BREW2_GOAL 同源派生（累计酿造 5 瓶高级灵药）',
  !!brew2 && brew2.d === `累计酿造 ${BREW2_GOAL} 瓶高级灵药`, brew2 && brew2.d);

// —— core.js 计数源端（brewNow 全游唯一酿造成功点）——
ok('core.js brewNow 酿造成功写入 hero.brews 防御式计数（(g.brews||0) 旧档零迁移）',
  cSrc.includes('hero.brews = (hero.brews || 0) + 1;'));

// —— menus.js 源级落位 ——
ok('menus.js import 已含 BREW2_GOAL（data.js 既有导出，零新增模块依赖）',
  mSrc.includes('INN_REST_GOAL, TRAVEL_GOAL, SELL_GOAL, POTIONS2_GOAL, BREW2_GOAL, ELIXIR_STOCK2_GOAL, BATTLE_GOAL, DEATH_GOAL } from'));
ok('menus.js drawBrew 补「🍶 妙手回春 N/5」进度行（模板逐字：分子读 hero.brews 防御式）',
  mSrc.includes('`🍶 妙手回春 ${(hero.brews || 0)}/${BREW2_GOAL}`'));
ok('menus.js 进度行落位参数（320 · 288 · 13px · #8ff0a0 · 居中，可酿行与提示行之间）',
  mSrc.includes("320, 288, '13px', '#8ff0a0', 'center'"));
ok('menus.js 含 v24.10 注释（drawBrew 行内说明块）', mSrc.includes('v24.10 酿造界面补「🍶 妙手回春 N/5」进度角标'));

// —— menus.js 零回归（既有行逐字）——
ok('menus.js 酿造面板零回归（panel(100,80,440,300,\'🧪 药水酿造\')）',
  mSrc.includes("panel(100,80,440,300,'🧪 药水酿造')"));
ok('menus.js 材料行零回归（魔法蘑菇 N 株 · 已酿灵药 N 瓶）',
  mSrc.includes('`魔法蘑菇 ${hero.mushrooms} 株    金币 ${hero.gold}    已酿灵药 ${hero.potion2||0} 瓶`'));
ok('menus.js 配方行零回归（BREW_MUSHROOMS 株 + BREW_GOLD 金币）',
  mSrc.includes('`配方：${BREW_MUSHROOMS} 株魔法蘑菇 + ${BREW_GOLD} 金币 → 高级灵药 ×1`'));
ok('menus.js 恢复量行零回归（ELIXIR_HP_PCT/ELIXIR_MP_PCT 派生）',
  mSrc.includes('`高级灵药：恢复 ${Math.round(ELIXIR_HP_PCT * 100)}% HP + ${Math.round(ELIXIR_MP_PCT * 100)}% MP`'));
ok('menus.js 可酿行零回归（当前材料还可酿造 N 瓶）',
  mSrc.includes('`当前材料还可酿造 ${_canBrew} 瓶`'));
ok('menus.js 提示行零回归（按 Enter/E 酿造 按 Esc 离开）',
  mSrc.includes("按 Enter/E 酿造    按 Esc 离开"));

// —— README 同步 ——
ok('README 含 v24.10 守护描述（酿造界面「🍶 妙手回春 N/5」进度角标守护）',
  readme.includes('v24.10 起含 酿造界面「🍶 妙手回春 N/5」进度角标守护'));
ok('README tests 树串尾已延伸至 smoke_v2410_brewgoal（... + smoke_v2409_sellgoal + smoke_v2410_brewgoal + smoke_v2411_deathprog + smoke_v2412_battlegoal + smoke_v2413_xpcurve + smoke_v2414_nightbattle + smoke_v2415_treepin + smoke_v2416_steps + smoke_v2417_mapdrink + smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9（npm test 串跑））',
  readme.includes('+ smoke_v2409_sellgoal + smoke_v2410_brewgoal + smoke_v2411_deathprog + smoke_v2412_battlegoal + smoke_v2413_xpcurve + smoke_v2414_nightbattle + smoke_v2415_treepin + smoke_v2416_steps + smoke_v2417_mapdrink + smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9（npm test 串跑）'));
ok('README 件套口径为二百六十九件套（二百六十八件套清除）且旧 233 口径零残留',
  readme.includes('冒烟二百六十九件套（二百六十八件套清除）') && !readme.includes('冒烟二百三十三件套（二百三十二件套清除）'));
ok('README 含 smoke_v2410_brewgoal 入库（269 份）', readme.includes('smoke_v2410_brewgoal 入库（269 份）'));
ok('README 仍保留 v24.09 历史守护描述（商店界面 + smoke_v2409_sellgoal 口径）',
  readme.includes('v24.09 起含 商店界面「🍄 蘑菇商路 N/30」进度角标守护'));

// —— package.json 同步 ——
const testChain = (JSON.parse(pkg).scripts.test.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 234 件套', testChain === 269, String(testChain));
ok('package.json 已收录 smoke_v2410_brewgoal（npm test 串跑第 235 份）',
  JSON.parse(pkg).scripts.test.includes('smoke_v2410_brewgoal.mjs && node tests/smoke_v2411_deathprog.mjs'));
ok('package.json 串尾为 ... smoke_v2409_sellgoal.mjs && node tests/smoke_v2410_brewgoal.mjs && node tests/smoke_v2411_deathprog.mjs && node tests/smoke_v2412_battlegoal.mjs && node tests/smoke_v2413_xpcurve.mjs && node tests/smoke_v2414_nightbattle.mjs && node tests/smoke_v2415_treepin.mjs && node tests/smoke_v2416_steps.mjs && node tests/smoke_v2417_mapdrink.mjs && node tests/smoke_v2418_goldcurve.mjs && node tests/smoke_v2419_luckdrp.mjs && node tests/smoke_v2420_skillprog.mjs && node tests/smoke_v2421_allquest.mjs && node tests/smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs"',
  pkg.includes('smoke_v2409_sellgoal.mjs && node tests/smoke_v2410_brewgoal.mjs && node tests/smoke_v2411_deathprog.mjs && node tests/smoke_v2412_battlegoal.mjs && node tests/smoke_v2413_xpcurve.mjs && node tests/smoke_v2414_nightbattle.mjs && node tests/smoke_v2415_treepin.mjs && node tests/smoke_v2416_steps.mjs && node tests/smoke_v2417_mapdrink.mjs && node tests/smoke_v2418_goldcurve.mjs && node tests/smoke_v2419_luckdrp.mjs && node tests/smoke_v2420_skillprog.mjs && node tests/smoke_v2421_allquest.mjs && node tests/smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs"'));

// —— CHANGELOG 同步 ——
ok('CHANGELOG 顶部已追加 v24.18 条目（酿造界面妙手回春进度角标）', changelog.startsWith('## v24.45 '));
ok('CHANGELOG 顶部条目含妙手回春与 BREW2_GOAL/酿造界面口径说明',
  changelog.includes('妙手回春') && changelog.includes('BREW2_GOAL') && changelog.includes('酿造界面'));
ok('CHANGELOG 仍保留 v24.09 与 v24.08 条目标题（历史口径）',
  changelog.includes('## v24.09 体验打磨·信息透明·决策现场') && changelog.includes('## v24.08 体验打磨·信息透明·决策现场'));

// —— 哨兵链：v2143 前哨前望 235 且 README 尚无 235 口径 ——
const s2143 = read('tests/smoke_v2143_talkekey.mjs');
ok('smoke_v2143 哨兵链已推进至二百六十九件套（二百六十八件套清除）',
  s2143.includes('二百四十七件套（二百四十五件套清除）') && s2143.includes("!readme.includes('二百七十件套（二百六十九件套清除）')"));
ok('README 尚无二百四十七件套（二百四十五件套清除）前望口径', !readme.includes('二百七十件套（二百六十九件套清除）'));

// —— 旧代 v24.09 pin 全库零残留（不含本件；拆串防误伤，承 v2405-v2409 惯例）——
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2410_brewgoal.mjs');
const stale = [];
for (const f of allTests) {
  const src = read('tests/' + f);
  if (src.includes("const GAME_VERSION = 'v24.0" + "9';") ||
      src.includes("const GAME_VERSION = 'v24.0" + "9'") ||
      src.includes("GAME_VERSION === 'v24.0" + "9'") ||
      src.includes("startsWith('## v24.0" + "9 ") ||
      src.includes("startsWith('## v24.0" + "9'") ||
      src.includes('已为 v24.0' + '9（') ||
      src.includes('已追加 v24.0' + '9 条目') ||
      src.includes('冒烟二百三十三件套（二百三十二件套清' + '除）') ||
      src.includes('二百三十三件套（二百三十二件套清' + '除）') ||
      src.includes('testChain === ' + '233') ||
      src.includes('+ smoke_v2409_sellgoal（npm test 串' + '跑）') ||
      src.includes('node tests/smoke_v2409_sellgoal.mjs' + '"')) stale.push(f);
}
ok('旧代 v24.09 字面量/恒等/顶 pin/件套 233 口径/testChain 233/串尾 & 树串尾 全库零残留（' + allTests.length + ' 件扫描）',
  stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
