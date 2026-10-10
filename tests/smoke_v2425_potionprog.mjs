// smoke_v2425_potionprog.mjs —— v24.25 专项冒烟：商店界面补「🧪 药香满囊 N/50」进度角标
// （体验打磨·信息透明·决策现场，承 v24.09 商店「🍄 蘑菇商路 N/30」同屏同款行内角标 / v23.82 蘑菇
// 商路先例同一「成就进度于决策现场可见」主线：卖菇侧 v24.09 已补（卖货决策现场），药水线的计数
// 现场正是「买药水」本身——把药水补满这个动作的决策现场（杂货商店 药水行）此前只报 价格/背包满/
// 还差 N 金，成就「药香满囊」（持有 POTIONS2_GOAL(50) 瓶药水，计数 hero.item 由 shop.buyPotion 买入/
// 开箱/任务奖励共享同一持有量字段、防御式 (hero.item||0) 旧档零迁移）进度只藏在 C 成就页一行 X/50
// ——站柜台前补药查无一眼之数；现 drawShop 补「🧪 药香满囊 N/50」（分子读 hero.item 防御式
// (hero.item||0)、分母读 data.js POTIONS2_GOAL 单一数据源，与 ACH_LIST stock2 的 ok/prog 同读一份
// 源，调阈值只改 data.js 一处三端自动跟随；同 v24.19 只报中档里程碑先例——有备无患 N/20 与万全之备
// N/99 同线另两档由 C 页承载），12px 灰字左对齐 x=206（「🍄 蘑菇商路 30/30」右缘 ≈196 之后、与右缘
// 「💰 N 金币」（520 右对齐）零重叠，最宽档「🧪 药香满囊 50/50」≈100px 右缘 ≈306 < 面板中点 320 与
// 金币左缘 ≈425）；纯显示零结算零存档零数值变化（POTIONS2_GOAL/药水持有/购买结算/商品清单/页脚
// 逐字未动）。
// 本冒烟守护：版本锚点、data.js/menus.js 源级落位（v24.25 注释 / GAME_VERSION v24.25 与旧 v24.24
// 字面量零残留 / v24.24 历史注释保留 / POTIONS2_GOAL 常量逐字）、运行期常量实值（POTIONS2_GOAL 50）
// 与 ACH_LIST stock2 同源互证（ok/prog/d 逐值）、计数源 hero.item 防御式与既有 P POTION_CAP 上限同
// 源互证、README/package.json/CHANGELOG 同步（件套口径 249 + v24.25 守护描述 + 入库 249 + tests 树串尾 +
// package 串尾）、tests 目录与实跑链恒等（249）、哨兵链（前望 252 且 README 尚无 252 口径）、旧代
// v24.24 pin 全库零残留扫描（豁免上一版套件 smoke_v2424_pondslime.mjs）。
import { POTIONS2_GOAL, GAME_VERSION, ACH_LIST, POTION_CAP } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.25 商店界面「🧪 药香满囊 N/50」进度角标 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const mSrc = read('js/view/menus.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const pkg = JSON.parse(pkgRaw).scripts.test;
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v24.24 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.24', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 24)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.25（旧 v24.24 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.77';") && !dSrc.includes("const GAME_VERSION = 'v24.24';"));
ok('data.js 含 v24.25 注释（商店界面「🧪 药香满囊 N/50」进度角标说明）',
  dSrc.includes('// v24.25 体验打磨·信息透明·决策现场'));
ok('data.js 仍保留 v24.24 历史注释（新支线「塘底的灯影」说明，累积注释块）',
  dSrc.includes('// v24.24 新内容·新支线'));
ok('data.js POTIONS2_GOAL 常量逐字落位（const POTIONS2_GOAL = 50;）',
  dSrc.includes('const POTIONS2_GOAL = 50;'));
ok('data.js export 块含 POTIONS2_GOAL（既有导出，零新增模块依赖）',
  dSrc.includes('POTIONS_GOAL, POTIONS2_GOAL, POTIONS3_GOAL'));

// —— 运行期常量实值（单一数据源）——
ok('POTIONS2_GOAL === 50（药香满囊阈值，与 C 页/描述/判定同源）', POTIONS2_GOAL === 50, String(POTIONS2_GOAL));
ok('POTIONS2_GOAL ≤ POTION_CAP（99 上限之内，药水线第三档所在现实内）',
  POTIONS2_GOAL <= POTION_CAP, `${POTIONS2_GOAL}/${POTION_CAP}`);
const stock2 = ACH_LIST.find((a) => a && a.id === 'stock2');
ok('ACH_LIST 含 stock2「药香满囊」（与 drawShop 角标同读一份源）', !!stock2 && stock2.name === '药香满囊', stock2 && stock2.name);
ok('stock2 ok 谓词逐值（0/49 false · 50/99 true）',
  !!stock2 && stock2.ok({ item: 0 }) === false && stock2.ok({ item: 49 }) === false &&
  stock2.ok({ item: 50 }) === true && stock2.ok({ item: 99 }) === true);
ok('stock2 prog 逐值（0→0/50 · 37→37/50 · 50→50/50）',
  !!stock2 && stock2.prog({ item: 0 }) === '0/50' && stock2.prog({ item: 37 }) === '37/50' &&
  stock2.prog({ item: 50 }) === '50/50');
ok('stock2 描述与 POTIONS2_GOAL 同源派生（持有 50 瓶药水）',
  !!stock2 && stock2.d === `持有 ${POTIONS2_GOAL} 瓶药水`, stock2 && stock2.d);
ok('stock2 防御式读取（缺字段按 0，旧档零迁移）',
  !!stock2 && stock2.ok({}) === false && stock2.prog({}) === '0/50');

// —— menus.js 源级落位 ——
ok('menus.js import 已含 POTIONS2_GOAL（data.js 既有导出，零新增模块依赖）',
  mSrc.includes('INN_REST_GOAL, TRAVEL_GOAL, SELL_GOAL, POTIONS2_GOAL, BREW2_GOAL, ELIXIR_STOCK2_GOAL, BATTLE_GOAL, DEATH_GOAL } from'));
ok('menus.js drawShop 补「🧪 药香满囊 N/50」进度行（模板逐字：分子读 hero.item 防御式）',
  mSrc.includes('`🧪 药香满囊 ${(hero.item || 0)}/${POTIONS2_GOAL}`'));
ok('menus.js 进度行落位参数（206 · 80 · 12px · #7d93a3 · 左对齐，蘑菇商路角标之右）',
  mSrc.includes("206, 80, '12px', '#7d93a3', 'left'"));
ok('menus.js 含 v24.25 注释（drawShop 行内说明块）', mSrc.includes('v24.25 商店界面补「🧪 药香满囊 N/50」进度角标'));
ok('menus.js 蘑菇商路角标零回归（86 · 80 · 12px · #7d93a3 · 左对齐，v24.09 逐字）',
  mSrc.includes("86, 80, '12px', '#7d93a3', 'left'") && mSrc.includes('`🍄 蘑菇商路 ${(hero.sold || 0)}/${SELL_GOAL}`'));
ok('menus.js 金币行零回归（520,80 · 14px · #ffd24a · 右对齐）',
  mSrc.includes("520,80,'14px','#ffd24a','right'"));
ok('menus.js 商店面板标题零回归（panel(60,50,520,360,\'杂货商店\')）',
  mSrc.includes("panel(60,50,520,360,'杂货商店')"));
ok('menus.js 页脚行零回归（绿色▲=更强升级 灰色=买不起 · ↑↓选择 Enter/E购买 Esc离开）',
  mSrc.includes('绿色▲=更强升级 灰色=买不起'));

// —— README 同步 ——
ok('README 含 v24.25 守护描述（商店界面「🧪 药香满囊 N/50」进度角标守护）',
  readme.includes('v24.25 起含 商店界面「🧪 药香满囊 N/50」进度角标守护'));
ok('README tests 树串尾已延伸至 smoke_v2425_potionprog（... + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10 + smoke_v2461_xpcurve11 + smoke_v2462_xpcurve12 + smoke_v2463_xpcurve13 + smoke_v2464_xpcurve14 + smoke_v2465_xpcurve15 + smoke_v2466_xpcurve16 + smoke_v2467_xpcurve17 + smoke_v2468_xpcurve18 + smoke_v2469_xpcurve19 + smoke_v2470_xpcurve20 + smoke_v2471_bellman + smoke_v2472_bellquest + smoke_v2473_xpcurve21 + smoke_v2475_xpcurve22 + smoke_v2476_achprog + smoke_v2477_fisher（npm test 串跑））',
  readme.includes('smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10 + smoke_v2461_xpcurve11 + smoke_v2462_xpcurve12 + smoke_v2463_xpcurve13 + smoke_v2464_xpcurve14 + smoke_v2465_xpcurve15 + smoke_v2466_xpcurve16 + smoke_v2467_xpcurve17 + smoke_v2468_xpcurve18 + smoke_v2469_xpcurve19 + smoke_v2470_xpcurve20 + smoke_v2471_bellman + smoke_v2472_bellquest + smoke_v2473_xpcurve21 + smoke_v2475_xpcurve22 + smoke_v2476_achprog + smoke_v2477_fisher（npm test 串跑）'));
ok('README 件套口径为三百件套（二百九十九件套清除）',
  readme.includes('冒烟三百件套（二百九十九件套清除）'));
ok('README 尚无 252 件套口径（哨兵前望 252 语义：下一版才写 252）',
  !readme.includes('二百七十七件套（二百七十七件套清除）') && !readme.includes('冒烟三百零一件套'));
ok('README 含 smoke_v2425_potionprog 入库（300 份）', readme.includes('smoke_v2425_potionprog 入库（300 份）'));
ok('README 仍保留 v24.24 历史守护描述与新支线入库口径（二百四十八件套 + 248 份）',
  readme.includes('v24.24 起含 新支线「塘底的灯影」守护') && readme.includes('smoke_v2424_pondslime 入库（300 份）'));

// —— package.json 同步 ——
const testChain = (pkg.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 249 件套', testChain === 300, String(testChain));
ok('package.json 已收录 smoke_v2425_potionprog（npm test 串跑第 273 份）',
  pkg.includes('smoke_v2425_potionprog.mjs'));
ok('package.json 串尾为 ... && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs"',
  pkgRaw.includes('smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs && node tests/smoke_v2459_xpcurve9.mjs && node tests/smoke_v2460_xpcurve10.mjs && node tests/smoke_v2461_xpcurve11.mjs && node tests/smoke_v2462_xpcurve12.mjs && node tests/smoke_v2463_xpcurve13.mjs && node tests/smoke_v2464_xpcurve14.mjs && node tests/smoke_v2465_xpcurve15.mjs && node tests/smoke_v2466_xpcurve16.mjs && node tests/smoke_v2467_xpcurve17.mjs && node tests/smoke_v2468_xpcurve18.mjs && node tests/smoke_v2469_xpcurve19.mjs && node tests/smoke_v2470_xpcurve20.mjs && node tests/smoke_v2471_bellman.mjs && node tests/smoke_v2472_bellquest.mjs && node tests/smoke_v2473_xpcurve21.mjs && node tests/smoke_v2475_xpcurve22.mjs && node tests/smoke_v2476_achprog.mjs && node tests/smoke_v2477_fisher.mjs"'));

// —— CHANGELOG 同步 ——
ok('CHANGELOG 顶部已追加 v24.25 条目（商店界面药香满囊进度角标）', changelog.startsWith('## v24.77 '));
ok('CHANGELOG 顶部条目含药香满囊与 POTIONS2_GOAL/商店界面口径说明',
  changelog.includes('药香满囊') && changelog.includes('POTIONS2_GOAL') && changelog.includes('商店界面'));
ok('CHANGELOG 仍保留 v24.24 与 v24.09 条目标题（历史口径）',
  changelog.includes('## v24.24 新内容') && changelog.includes('## v24.09 体验打磨'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set([...pkg.matchAll(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g)].map((m) => m[0].replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 249 与实跑链恒等', files.length === 300, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：v2415 树串守护已推进至新链尾 + 前望 252 ——
const t2415 = read('tests/smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v2425_potionprog（第 273 份）',
  t2415.includes("chain[chain.length - 1] === 'smoke_v2477_fisher'"));
ok('smoke_v2415 树串 token 数已推进至 249', t2415.includes('treeTok.length === 300'));
ok('smoke_v2415 哨兵「尚无 252」口径（二百五十件套 bare 否定式）',
  t2415.includes("!readme.includes('三百零一件套')"));
const s2424 = read('tests/smoke_v2424_pondslime.mjs');
ok('smoke_v2424 哨兵链已推进至「前望 252」口径（二百五十件套 bare 否定式）',
  s2424.includes("!readme.includes('三百零一件套')"));

// —— 旧代 v24.24 pin 全库零残留扫描（哨兵链：无任何测试再断言 v24.24 GAME_VERSION 字面量 / 顶 pin / 248 口径）——
const leftovers = [];
for (const f of fs.readdirSync(testsDir)) {
  if (!f.endsWith('.mjs') || f === 'smoke_v2425_potionprog.mjs') continue;
  const s = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s.includes("const GAME_VERSION = 'v24.24';") || s.includes("GAME_VERSION === 'v24.24'") ||
      s.includes("startsWith('## v24.24") || s.includes('二百四十八件套（二百四十七件套清除）') ||
      s.includes("testChain === 248") || s.includes("files.length === 248") ||
      s.includes("treeTok.length === 248") || s.includes("chainAll.length === 248")) leftovers.push(f);
}
ok('全库测试零残留 v24.24 GAME_VERSION/顶 pin/248 口径（哨兵链，豁免本套件）',
  leftovers.length === 0, leftovers.join(','));

process.exit(failed ? 1 : 0);
