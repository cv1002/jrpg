// smoke_v2431_elixirprog.mjs —— v24.31 专项冒烟：酿造界面补「🧪 灵药满柜 N/8」进度角标
// （体验打磨·信息透明·决策现场，承 v24.10 酿造界面「🍶 妙手回春 N/5」同屏同款行内角标 / v24.09
// 商店「🍄 蘑菇商路 N/30」+ v24.25 商店「🧪 药香满囊 N/50」同一「成就进度于决策现场可见」主线：
// 灵药线三档（灵药盈囊 3 瓶 / 灵药满柜 8 瓶 / 灵药满仓 16 瓶）的中档里程碑计数现场正是「把菇熬成
// 灵药」的酿造决策现场——brewNow 酿造成功/支线奖励/战斗掉落共享 hero.potion2 持有量字段、snapshotHero
// 全量快照自动持久化、防御式 (hero.potion2||0) 旧档零迁移，材料行（140）只报「已酿灵药 N 瓶」余额
// 读数；成就「灵药满柜」（持有 ELIXIR_STOCK2_GOAL(8) 瓶高级灵药）进度只藏在 C 成就页一行 X/8——站
// 锅前查无一眼之数；现 drawBrew 补「🧪 灵药满柜 N/8」（分子读 hero.potion2 防御式 (hero.potion2||0)、
// 分母读 data.js ELIXIR_STOCK2_GOAL 单一数据源，与 ACH_LIST elixir2 的 ok/prog 同读一份源，调阈值只改
// data.js 一处三端自动跟随；同 v24.19/v24.25 只报中档里程碑先例——灵药盈囊 N/3 与灵药满仓 N/16 同线
// 另两档由 C 页承载），y=312 与「🍶 妙手回春」（288）行间 24、面板底 380 之内零越界；纯显示零结算零
// 存档零数值变化（ELIXIR_STOCK2_GOAL/brewNow 结算/材料/配方/可酿/提示逐字未动）。
// 本冒烟守护：版本锚点、data.js/menus.js 源级落位（v24.31 注释 / GAME_VERSION v24.31 与旧 v24.30
// 字面量零残留 / v24.30 历史注释保留 / ELIXIR_STOCK2_GOAL 常量逐字）、运行期常量实值（ELIXIR_STOCK2_GOAL 8）
// 与 ACH_LIST elixir2 同源互证（ok/prog/d 逐值）与灵药线三档递进互证、计数源 hero.potion2 防御式、
// README/package.json/CHANGELOG 同步（件套口径 256 + v24.31 守护描述 + 入库 256 + tests 树串尾 +
// package 串尾）、tests 目录与实跑链恒等（255）、哨兵链（前望 266 且 README 尚无 266 口径）、旧代
// v24.30 pin 全库零残留扫描（豁免上一版套件 smoke_v2430_goldcurve3.mjs）。
import { ELIXIR_STOCK2_GOAL, ELIXIR_STOCK_GOAL, ELIXIR_STOCK3_GOAL, GAME_VERSION, ACH_LIST } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.31 酿造界面「🧪 灵药满柜 N/8」进度角标 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const mSrc = read('js/view/menus.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const pkg = JSON.parse(pkgRaw).scripts.test;
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v24.30 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.30', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 30)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.31（旧 v24.30 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.41';") && !dSrc.includes("const GAME_VERSION = 'v24.30';"));
ok('data.js 含 v24.31 注释（酿造界面「🧪 灵药满柜 N/8」进度角标说明）',
  dSrc.includes('// v24.31 体验打磨·信息透明·决策现场'));
ok('data.js 仍保留 v24.30 历史注释（数值平衡说明，累积注释块）',
  dSrc.includes('// v24.30 数值平衡·后期金币曲线续平滑'));
ok('data.js ELIXIR_STOCK2_GOAL 常量逐字落位（const ELIXIR_STOCK2_GOAL = 8;）',
  dSrc.includes('const ELIXIR_STOCK2_GOAL = 8;'));
ok('data.js export 块含 ELIXIR_STOCK2_GOAL（既有导出，零新增模块依赖）',
  dSrc.includes('ELIXIR_STOCK_GOAL, ELIXIR_STOCK2_GOAL, ELIXIR_STOCK3_GOAL'));

// —— 运行期常量实值（单一数据源）——
ok('ELIXIR_STOCK2_GOAL === 8（灵药满柜阈值，与 C 页/描述/判定同源）', ELIXIR_STOCK2_GOAL === 8, String(ELIXIR_STOCK2_GOAL));
ok('灵药线三档严格递进（3 < 8 < 16，中档 8 确为三档中段）',
  ELIXIR_STOCK_GOAL < ELIXIR_STOCK2_GOAL && ELIXIR_STOCK2_GOAL < ELIXIR_STOCK3_GOAL,
  `${ELIXIR_STOCK_GOAL}/${ELIXIR_STOCK2_GOAL}/${ELIXIR_STOCK3_GOAL}`);
const elixir2 = ACH_LIST.find((a) => a && a.id === 'elixir2');
ok('ACH_LIST 含 elixir2「灵药满柜」（与 drawBrew 角标同读一份源）', !!elixir2 && elixir2.name === '灵药满柜', elixir2 && elixir2.name);
ok('elixir2 ok 谓词逐值（0/7 false · 8/16 true）',
  !!elixir2 && elixir2.ok({ potion2: 0 }) === false && elixir2.ok({ potion2: 7 }) === false &&
  elixir2.ok({ potion2: 8 }) === true && elixir2.ok({ potion2: 16 }) === true);
ok('elixir2 prog 逐值（0→0/8 · 5→5/8 · 8→8/8）',
  !!elixir2 && elixir2.prog({ potion2: 0 }) === '0/8' && elixir2.prog({ potion2: 5 }) === '5/8' &&
  elixir2.prog({ potion2: 8 }) === '8/8');
ok('elixir2 描述与 ELIXIR_STOCK2_GOAL 同源派生（持有 8 瓶高级灵药）',
  !!elixir2 && elixir2.d === `持有 ${ELIXIR_STOCK2_GOAL} 瓶高级灵药`, elixir2 && elixir2.d);
ok('elixir2 防御式读取（缺字段按 0，旧档零迁移）',
  !!elixir2 && elixir2.ok({}) === false && elixir2.prog({}) === '0/8');

// —— menus.js 源级落位 ——
ok('menus.js import 已含 ELIXIR_STOCK2_GOAL（data.js 既有导出，零新增模块依赖）',
  mSrc.includes('INN_REST_GOAL, TRAVEL_GOAL, SELL_GOAL, POTIONS2_GOAL, BREW2_GOAL, ELIXIR_STOCK2_GOAL, BATTLE_GOAL, DEATH_GOAL } from'));
ok('menus.js drawBrew 补「🧪 灵药满柜 N/8」进度行（模板逐字：分子读 hero.potion2 防御式）',
  mSrc.includes('`🧪 灵药满柜 ${(hero.potion2 || 0)}/${ELIXIR_STOCK2_GOAL}`'));
ok('menus.js 进度行落位参数（320 · 312 · 13px · #8ff0a0 · 居中，妙手回春行之下）',
  mSrc.includes("320, 312, '13px', '#8ff0a0', 'center'"));
ok('menus.js 含 v24.31 注释（drawBrew 行内说明块）', mSrc.includes('v24.31 酿造界面补「🧪 灵药满柜 N/8」进度角标'));
ok('menus.js 妙手回春角标零回归（320 · 288 · 13px · #8ff0a0 · 居中，v24.10 逐字）',
  mSrc.includes("320, 288, '13px', '#8ff0a0', 'center'") && mSrc.includes('`🍶 妙手回春 ${(hero.brews || 0)}/${BREW2_GOAL}`'));
ok('menus.js 材料行零回归（已酿灵药 N 瓶 · 余额读数）',
  mSrc.includes('`魔法蘑菇 ${hero.mushrooms} 株    金币 ${hero.gold}    已酿灵药 ${hero.potion2||0} 瓶`'));
ok('menus.js 酿造面板标题零回归（panel(100,80,440,300,\'🧪 药水酿造\')）',
  mSrc.includes("panel(100,80,440,300,'🧪 药水酿造')"));
ok('menus.js 配方行零回归（BREW_MUSHROOMS/BREW_GOLD 单一数据源派生）',
  mSrc.includes('`配方：${BREW_MUSHROOMS} 株魔法蘑菇 + ${BREW_GOLD} 金币 → 高级灵药 ×1`'));

// —— README 同步 ——
ok('README 含 v24.31 守护描述（酿造界面「🧪 灵药满柜 N/8」进度角标守护）',
  readme.includes('v24.31 起含 酿造界面「🧪 灵药满柜 N/8」进度角标守护'));
ok('README tests 树串尾已延伸至 smoke_v2431_elixirprog（... + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5（npm test 串跑））',
  readme.includes('smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5（npm test 串跑）'));
ok('README 件套口径为二百六十五件套（二百六十四件套清除）',
  readme.includes('冒烟二百六十五件套（二百六十四件套清除）'));
ok('README 尚无 266 件套口径（哨兵前望 266 语义：下一版才写 266）',
  !readme.includes('二百六十六件套（二百六十五件套清除）') && !readme.includes('冒烟二百六十六件套'));
ok('README 含 smoke_v2431_elixirprog 入库（265 份）', readme.includes('smoke_v2431_elixirprog 入库（265 份）'));
ok('README 仍保留 v24.30 历史守护描述与入库口径（v24.30 起含 守护 + smoke_v2430_goldcurve3 入库（265 份））',
  readme.includes('v24.30 起含 「后期金币曲线续平滑（第三轮）」守护') && readme.includes('smoke_v2430_goldcurve3 入库（265 份）'));

// —— package.json 同步 ——
const testChain = (pkg.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 255 件套', testChain === 265, String(testChain));
ok('package.json 已收录 smoke_v2431_elixirprog（npm test 串跑第 265 份）',
  pkg.includes('smoke_v2431_elixirprog.mjs'));
ok('package.json 串尾为 ... && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs"',
  pkgRaw.includes('smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs"'));

// —— CHANGELOG 同步 ——
ok('CHANGELOG 顶部已追加 v24.31 条目（酿造界面灵药满柜进度角标）', changelog.startsWith('## v24.41 '));
ok('CHANGELOG 顶部条目含灵药满柜与 ELIXIR_STOCK2_GOAL/酿造界面口径说明',
  changelog.includes('灵药满柜') && changelog.includes('ELIXIR_STOCK2_GOAL') && changelog.includes('酿造界面'));
ok('CHANGELOG 仍保留 v24.30 与 v24.10 与 v22.17 条目标题（历史口径）',
  changelog.includes('## v24.30 数值平衡') && changelog.includes('## v24.10 体验打磨') && changelog.includes('## v22.17 新成就'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set([...pkg.matchAll(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g)].map((m) => m[0].replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 255 与实跑链恒等', files.length === 265, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：v2415 树串守护已推进至新链尾 + 前望 266 ——
const t2415 = read('tests/smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v2431_elixirprog（第 265 份）',
  t2415.includes("chain[chain.length - 1] === 'smoke_v2441_xpcurve5'"));
ok('smoke_v2415 树串 token 数已推进至 255', t2415.includes('treeTok.length === 265'));
ok('smoke_v2415 哨兵「尚无 266」口径（二百五十五件套 bare 否定式）',
  t2415.includes("!readme.includes('二百六十六件套')"));
const s2430 = read('tests/smoke_v2430_goldcurve3.mjs');
ok('smoke_v2430 哨兵链已推进至「前望 266」口径（二百五十五件套 bare 否定式）',
  s2430.includes("!readme.includes('二百六十六件套')"));
ok('smoke_v2430 既有断言随新现实推进（件套口径 265 + 链尾 v2439 + 入库 263）',
  s2430.includes('二百六十五件套（二百六十四件套清除）') && s2430.includes("=== 'smoke_v2441_xpcurve5'") &&
  s2430.includes('入库（265 份）'));

// —— 旧代 v24.30 pin 全库零残留扫描（哨兵链：无任何测试再断言 v24.30 GAME_VERSION 字面量 / 顶 pin / 254 口径）——
const leftovers = [];
for (const f of fs.readdirSync(testsDir)) {
  if (!f.endsWith('.mjs') || f === 'smoke_v2431_elixirprog.mjs') continue;
  // 承 v24.30 同款豁免：上一版套件（smoke_v2430_goldcurve3）合法的历史/否定式字面量不入扫描。
  if (f === 'smoke_v2430_goldcurve3.mjs') continue;
  const s = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s.includes("const GAME_VERSION = 'v24.30';") || s.includes("GAME_VERSION === 'v24.30'") ||
      s.includes("startsWith('## v24.30") || s.includes('入库（254 份）') ||
      s.includes('二百五十四件套（二百五十三件套清除）') ||
      s.includes("testChain === 254") || s.includes("fileCount === 254") ||
      s.includes("files.length === 254") || s.includes("chainAll.length === 254") ||
      s.includes("treeTok.length === 254") || s.includes("chain[chain.length - 1] === 'smoke_v2430_goldcurve3'")) leftovers.push(f);
}
ok('全库测试零残留 v24.30 GAME_VERSION/顶 pin/254 口径（哨兵链，豁免本套件与上一版否定式）',
  leftovers.length === 0, leftovers.join(','));

console.log(`— v24.31 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
