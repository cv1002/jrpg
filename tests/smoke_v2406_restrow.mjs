// v24.06 专项冒烟：「恢复点 / 补给」数值速查行——README「数值速查」速查表 25 行已覆盖 基础属性/每级成长/
// 升级经验/技能领悟/装备/经济/区域修正/试炼推荐等级/战斗/伤害公式/克制状态/掉落/首胜彩头/宝箱宝藏/遇敌槽/
// 出没生态/试炼彩头/成就档位/魔物数值/技能数值/强敌变身/难度倍率/支线奖励/昼夜时段，唯独「打到一半去哪
// 回血」查无一行——全游恢复链条（喷泉·泉水全恢复（免费）/旅馆 INN_PRICE 住店回满（全游唯一花钱恢复点，
// v23.73「夜宿灯下」计数 hero.innRests·INN_REST_GOAL）/试炼关间 RUSH_RECOVER 35%HP·50%MP（免费）/
// 药水·灵药恢复量见「经济」行）散见 data.js ENCOUNTER.fountain/INN_PRICE/RUSH_RECOVER/INN_REST_GOAL
// 与 world.js 踩泉报文、shop.js stayInn 结算、battle.js 三连战结算、H 页机制行——调任何恢复数值需先通读
// 代码才能对上口径；现补录：数值速查表「遇敌槽」行之后追加「恢复点 / 补给」行（全部由
// ENCOUNTER.fountain/INN_PRICE/RUSH_RECOVER/INN_REST_GOAL 派生、与踩泉报文/stayInn 结算/三连战结算/
// H 页机制行同读同源）；纯文档零逻辑零结算零存档零数值变化，全部数值逐字未动。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.06 注释 / GAME_VERSION v24.06 与旧 v24.05 字面量零残留 /
// v24.05 历史注释保留 / 四常量逐字）、运行期常量实值（ENCOUNTER.fountain -25 · INN_PRICE 10 ·
// RUSH_RECOVER 35%/50% · INN_REST_GOAL 15）、三端源码同源互证（world 踩泉报文 / shop.stayInn 结算 /
// battle 三连战 RUSH_RECOVER）、README/package.json/CHANGELOG 同步（件套口径 230 + v24.06 守护描述 +
// 入库 230 + tests 树串尾 + package 串尾 + 速查表新行·行序）、哨兵链（v2143 前望 231 且 README 尚无
// 231 口径）、旧代 v24.05 pin 全库零残留扫描。
import { ENCOUNTER, INN_PRICE, RUSH_RECOVER, INN_REST_GOAL, GAME_VERSION } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.06 「恢复点 / 补给」数值速查行 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const wSrc = read('js/world.js');
const sSrc = read('js/shop.js');
const bSrc = read('js/battle.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v24.06 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.06', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 6)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.21（旧 v24.05 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.32';") && !dSrc.includes("const GAME_VERSION = 'v24.0" + "5';"));
ok('data.js 含 v24.06 注释（「恢复点 / 补给」数值速查行说明）',
  dSrc.includes('// v24.06 文档整理·数值说明·同源口径'));
ok('data.js 仍保留 v24.05 历史注释（试炼碑「📜 千锤百炼 N/3」进度角标说明，累积注释块）',
  dSrc.includes('// v24.05 体验打磨·信息透明·决策现场'));
ok('data.js 常量逐字落位（const INN_PRICE = 10 / const INN_REST_GOAL = 15）',
  dSrc.includes('const INN_PRICE = 10;') && dSrc.includes('const INN_REST_GOAL = 15;'));

// —— 运行期常量实值（单一数据源）——
ok('ENCOUNTER.fountain === -25（喷泉·泉水遇敌槽安全阀，与 H 页机制行/踩泉报文同源）',
  ENCOUNTER.fountain === -25, String(ENCOUNTER.fountain));
ok('INN_PRICE === 10（旅馆住店价，全游唯一花钱恢复点）', INN_PRICE === 10, String(INN_PRICE));
ok('RUSH_RECOVER === {hp:0.35, mp:0.5}（试炼关间每胜一关恢复）',
  RUSH_RECOVER && RUSH_RECOVER.hp === 0.35 && RUSH_RECOVER.mp === 0.5, JSON.stringify(RUSH_RECOVER));
ok('INN_REST_GOAL === 15（成就「夜宿灯下」累计住宿阈值）', INN_REST_GOAL === 15, String(INN_REST_GOAL));

// —— 三端源码同源互证（报文/结算与速查行读同一份源）——
ok('world.js 踩泉报文含「清泉涌动 … 完全恢复」（喷泉恢复事件实文，v19.94/v22.46 口径）',
  wSrc.includes('清泉涌动') && wSrc.includes('完全恢复'));
ok('world.js 喷泉 -25 读 ENCOUNTER.fountain（零裸字面量）', wSrc.includes('ENCOUNTER.fountain'));
ok('shop.js stayInn 扣款/回满读 INN_PRICE 与 hero.hpMax（hero.gold >= INN_PRICE / hero.hp = hero.hpMax）',
  sSrc.includes('hero.gold >= INN_PRICE') && sSrc.includes('hero.hp = hero.hpMax'));
ok('shop.js stayInn 住宿计数读 hero.innRests 与 INN_REST_GOAL（v23.73「夜宿灯下」同源）',
  sSrc.includes('hero.innRests') && sSrc.includes('INN_REST_GOAL'));
ok('battle.js 三连战关间恢复读 RUSH_RECOVER（RUSH_RECOVER.hp / RUSH_RECOVER.mp）',
  bSrc.includes('RUSH_RECOVER.hp') && bSrc.includes('RUSH_RECOVER.mp'));
ok('battle.js 三连战报文报 35%HP / 50%MP（横幅「已自动恢复35%HP / 50%MP」口径，RUSH_RECOVER 派生）',
  bSrc.includes('已自动恢复') && bSrc.includes('%HP / ') && bSrc.includes('%MP'));

// —— README 速查行落位 ——
ok('README 数值速查表含「恢复点 / 补给」行（| 恢复点 / 补给 |）', readme.includes('| 恢复点 / 补给 |'));
ok('README 新行位于「遇敌槽」行之后（行序：遇敌槽 < 恢复点 < 出没生态）',
  readme.indexOf('| 遇敌槽 |') < readme.indexOf('| 恢复点 / 补给 |') &&
  readme.indexOf('| 恢复点 / 补给 |') < readme.indexOf('| 出没生态 |'));
ok('README 新行含四源派生口径（ENCOUNTER.fountain / INN_PRICE 10 金 / RUSH_RECOVER 35%HP·50%MP（随等级）/ INN_REST_GOAL）',
  readme.includes('`ENCOUNTER.fountain`') && readme.includes('`INN_PRICE` 10 金住店回满') &&
  readme.includes('35%HP·50%MP') && readme.includes('`RUSH_RECOVER`') && readme.includes('`INN_REST_GOAL`'));
ok('README 新行标注 v24.06 补录', readme.includes('（v24.06 补录）'));
ok('README 速查表「经济」行零回归（药水 50%HP+8 / 灵药 80%HP+20并回40%MP 逐字保留）',
  readme.includes('灵药 80%HP+20并回40%MP') || readme.includes('80%HP+20'));
ok('README 速查表「试炼 / 彩头」行零回归（35%HP·50%MP 与 RUSH_RECOVER 口径保留）',
  readme.includes('每胜一关回血 35%HP·50%MP'));
ok('README 速查表「遇敌槽」行零回归（喷泉 -25 逐字保留）', readme.includes('喷泉 -25'));
ok('README H 页「遇敌槽 / 危险格」机制行零回归（喷泉-25 单一数据源口径）',
  readme.includes('遇敌槽 / 危险格') || readme.includes('喷泉 -25'));

// —— README / package.json / CHANGELOG 同步 ——
const testChain = (JSON.parse(pkg).scripts.test.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 230 件套', testChain === 256, String(testChain));
ok('package.json 已收录 smoke_v2406_restrow（npm test 串跑第 230 份）',
  JSON.parse(pkg).scripts.test.includes('smoke_v2406_restrow.mjs'));
ok('package.json 串尾为 ... smoke_v2405_trialgoal.mjs && node tests/smoke_v2406_restrow.mjs && node tests/smoke_v2407_innrest.mjs && node tests/smoke_v2408_travelgoal.mjs && node tests/smoke_v2409_sellgoal.mjs && node tests/smoke_v2410_brewgoal.mjs && node tests/smoke_v2411_deathprog.mjs && node tests/smoke_v2412_battlegoal.mjs && node tests/smoke_v2413_xpcurve.mjs && node tests/smoke_v2414_nightbattle.mjs && node tests/smoke_v2415_treepin.mjs && node tests/smoke_v2416_steps.mjs && node tests/smoke_v2417_mapdrink.mjs && node tests/smoke_v2418_goldcurve.mjs && node tests/smoke_v2419_luckdrp.mjs && node tests/smoke_v2420_skillprog.mjs && node tests/smoke_v2421_allquest.mjs && node tests/smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs"',
  pkg.includes('smoke_v2405_trialgoal.mjs && node tests/smoke_v2406_restrow.mjs && node tests/smoke_v2407_innrest.mjs && node tests/smoke_v2408_travelgoal.mjs && node tests/smoke_v2409_sellgoal.mjs && node tests/smoke_v2410_brewgoal.mjs && node tests/smoke_v2411_deathprog.mjs && node tests/smoke_v2412_battlegoal.mjs && node tests/smoke_v2413_xpcurve.mjs && node tests/smoke_v2414_nightbattle.mjs && node tests/smoke_v2415_treepin.mjs && node tests/smoke_v2416_steps.mjs && node tests/smoke_v2417_mapdrink.mjs && node tests/smoke_v2418_goldcurve.mjs && node tests/smoke_v2419_luckdrp.mjs && node tests/smoke_v2420_skillprog.mjs && node tests/smoke_v2421_allquest.mjs && node tests/smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs"'));
ok('README tests 树串尾已延伸至 smoke_v2406_restrow（... + smoke_v2404_chestrow + smoke_v2405_trialgoal + smoke_v2406_restrow + smoke_v2407_innrest + smoke_v2408_travelgoal + smoke_v2409_sellgoal + smoke_v2410_brewgoal + smoke_v2411_deathprog + smoke_v2412_battlegoal + smoke_v2413_xpcurve + smoke_v2414_nightbattle + smoke_v2415_treepin + smoke_v2416_steps + smoke_v2417_mapdrink + smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest（npm test 串跑））',
  readme.includes('+ smoke_v2404_chestrow + smoke_v2405_trialgoal + smoke_v2406_restrow + smoke_v2407_innrest + smoke_v2408_travelgoal + smoke_v2409_sellgoal + smoke_v2410_brewgoal + smoke_v2411_deathprog + smoke_v2412_battlegoal + smoke_v2413_xpcurve + smoke_v2414_nightbattle + smoke_v2415_treepin + smoke_v2416_steps + smoke_v2417_mapdrink + smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest（npm test 串跑）'));
ok('README 件套口径为二百五十六件套（二百五十五件套清除）且旧 229 口径零残留',
  readme.includes('冒烟二百五十六件套（二百五十五件套清除）') && !readme.includes('冒烟二百二十九件套（二百二十八件套清除）'));
ok('README 含 v24.06 守护描述（「恢复点 / 补给」数值速查行守护）',
  readme.includes('v24.06 起含 「恢复点 / 补给」数值速查行守护'));
ok('README 含 smoke_v2406_restrow 入库（230 份）', readme.includes('smoke_v2406_restrow 入库（230 份）'));
ok('README 仍保留 v24.05 历史守护描述与入库口径（试炼碑千锤百炼 + 229 份）',
  readme.includes('v24.05 起含 试炼碑「千锤百炼」进度角标守护') && readme.includes('smoke_v2405_trialgoal 入库（229 份）'));
ok('README 仍保留 v24.04 历史守护描述（宝箱 / 宝藏 + 228 份）',
  readme.includes('v24.04 起含 「宝箱 / 宝藏」数值速查行守护') && readme.includes('smoke_v2404_chestrow 入库（228 份）'));
ok('CHANGELOG 顶部已追加 v24.18 条目（「恢复点 / 补给」数值速查行）', changelog.startsWith('## v24.32 '));
ok('CHANGELOG 顶部条目含恢复点与 INN_PRICE/RUSH_RECOVER 口径说明',
  changelog.includes('恢复点') && changelog.includes('INN_PRICE') && changelog.includes('RUSH_RECOVER') && changelog.includes('数值速查'));
ok('CHANGELOG 仍保留 v24.05 与 v24.04 条目标题（历史口径）',
  changelog.includes('## v24.05 体验打磨·信息透明·决策现场') && changelog.includes('## v24.04 文档整理·数值说明·同源口径'));

// —— 哨兵链：v2143 前哨前望 231 且 README 尚无 231 口径 ——
const s2143 = read('tests/smoke_v2143_talkekey.mjs');
ok('smoke_v2143 哨兵链已推进至二百五十六件套（二百五十五件套清除）',
  s2143.includes('二百四十七件套（二百四十五件套清除）') && s2143.includes("!readme.includes('二百五十七件套（二百五十六件套清除）')"));
ok('README 尚无二百四十七件套（二百四十五件套清除）前望口径', !readme.includes('二百五十七件套（二百五十六件套清除）'));

// —— 旧代 v24.05 pin 全库零残留（不含本件；拆串防误伤，承 v2400/v2404/v2405 惯例）——
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2406_restrow.mjs');
const stale = [];
for (const f of allTests) {
  const src = read('tests/' + f);
  if (src.includes("const GAME_VERSION = 'v24.0" + "5'") ||
      src.includes("GAME_VERSION === 'v24.0" + "5'") ||
      src.includes("startsWith('## v24.0" + "5 ") ||
      src.includes("startsWith('## v24.0" + "5'") ||
      src.includes('已为 v24.0' + '5（') ||
      src.includes('已追加 v24.0' + '5 条目') ||
      src.includes('冒烟二百二十九件套（二百二十八件套清' + '除）') ||
      src.includes('二百二十九件套（二百二十八件套清' + '除）') ||
      src.includes('testChain === ' + '229') ||
      src.includes('smoke_v2404_chestrow + smoke_v2405_trialgoal（npm test 串' + '跑）') ||
      src.includes('node tests/smoke_v2405_trialgoal.mjs' + '"') ||
      src.includes('smoke_v2405_trialgoal\\' + '.mjs"') ||
      src.includes('smoke_v2405_trialgoal\\\\' + '.mjs"')) stale.push(f);
}
ok('旧代 v24.05 字面量/恒等/顶 pin/件套 229 口径/testChain 229/串尾 & 树串尾 全库零残留（' + allTests.length + ' 件扫描）',
  stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
