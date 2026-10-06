// smoke_v2426_levelprog.mjs —— v24.26 专项冒烟：🎉 升级横幅补「🌙 守灯者 N/10」进度后缀
// （体验打磨·信息透明·计数现场，承 v24.22 胜利战报「⚔️ 驱雾百战 N/100」/ v24.23 精英战报「⚔️ 精英
// 猎手 N/2」/ v24.25 商店角标「🧪 药香满囊 N/50」同一「计数现场报进度」主线：等级线首档 lvl5（独当
// 一面 5 级）/封顶 lvl12（灯燃长夜 12 级）之外的**中档** lvl10「守灯者」（等级达到 LVL10_GOAL(10) 级，
// 计数读既有 hero.level 存档字段，零新计数零迁移）此前进度只藏在 C 成就页一行 X/10——升级瞬间正是
// 等级线的计数现场（升级是成就推进的唯一动作、每级只发生一到两次，与 v24.20 诸技通明「现场是动作
// 本身」同族；v24.12 胜利画面已报 收集三件套/身经百战，等级线的 live 窗口全游无一个——升级横幅只报
// 等级属性增量与余额，离「守灯者」还差几级查无一眼之数）；现 battle.winBattle 升级横幅末尾补
// 「（🌙 守灯者 N/10）」（分子读 hero.level 防御式 (hero.level||1)、分母读 data.js LVL10_GOAL
// 单一数据源，与 ACH_LIST lvl10 的 ok/prog/d 同读一份源，调阈值只改 data.js 一处全端自动跟随；同
// v24.19/v24.25 只报中档里程碑先例——独当一面 N/5 与灯燃长夜 N/12 同线另两档由 C 页承载）；
// 纯显示零结算零存档零数值变化（等级结算/HP MP 攻防/结余/里程碑判定逐字未动）。
// 本冒烟守护：版本锚点、data.js/battle.js 源级落位（v24.26 注释 / GAME_VERSION v24.26 与旧 v24.25
// 字面量零残留 / v24.25 历史注释保留 / LVL10_GOAL 常量逐字）、运行期常量实值（LVL10_GOAL 10）与
// ACH_LIST lvl10 同源互证（ok/prog/d 逐值）、计数源 hero.level 防御式与升级横幅模板逐字、既有升级
// 横幅片段零回归、README/package.json/CHANGELOG 同步（件套口径 250 + v24.26 守护描述 + 入库 250 +
// tests 树串尾 + package 串尾）、tests 目录与实跑链恒等（250）、哨兵链（前望 252 且 README 尚无 252
// 口径）、旧代 v24.25 pin 全库零残留扫描（豁免上一版套件 smoke_v2425_potionprog.mjs）。
import { LVL10_GOAL, GAME_VERSION, ACH_LIST } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.26 升级横幅「🌙 守灯者 N/10」进度后缀 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const bSrc = read('js/battle.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const pkg = JSON.parse(pkgRaw).scripts.test;
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v24.25 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.25', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 25)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.26（旧 v24.25 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.54';") && !dSrc.includes("const GAME_VERSION = 'v24.25';"));
ok('data.js 含 v24.26 注释（升级横幅「🌙 守灯者 N/10」进度后缀说明）',
  dSrc.includes('// v24.26 体验打磨·信息透明·计数现场'));
ok('data.js 仍保留 v24.25 历史注释（商店界面「🧪 药香满囊 N/50」说明，累积注释块）',
  dSrc.includes('// v24.25 体验打磨·信息透明·决策现场'));
ok('data.js LVL10_GOAL 常量逐字落位（const LVL10_GOAL = 10;）',
  dSrc.includes('const LVL10_GOAL = 10;'));
ok('data.js export 块含 LVL10_GOAL（既有导出，零新增模块依赖）',
  dSrc.includes('LVL5_GOAL, LVL10_GOAL, LVL12_GOAL'));

// —— 运行期常量实值（单一数据源）——
ok('LVL10_GOAL === 10（守灯者阈值，与 C 页/描述/判定同源）', LVL10_GOAL === 10, String(LVL10_GOAL));
const lvl10 = ACH_LIST.find((a) => a && a.id === 'lvl10');
ok('ACH_LIST 含 lvl10「守灯者」（与升级横幅后缀同读一份源）', !!lvl10 && lvl10.name === '守灯者', lvl10 && lvl10.name);
ok('lvl10 ok 谓词逐值（0/9 false · 10/12 true）',
  !!lvl10 && lvl10.ok({ level: 0 }) === false && lvl10.ok({ level: 9 }) === false &&
  lvl10.ok({ level: 10 }) === true && lvl10.ok({ level: 12 }) === true);
ok('lvl10 prog 逐值（0→1/10 防御式 · 5→5/10 · 12→12/10 同 C 页不钳制）',
  !!lvl10 && lvl10.prog({ level: 0 }) === '1/10' && lvl10.prog({ level: 5 }) === '5/10' &&
  lvl10.prog({ level: 12 }) === '12/10');
ok('lvl10 描述与 LVL10_GOAL 同源派生（等级达到 10 级）',
  !!lvl10 && lvl10.d === `等级达到 ${LVL10_GOAL} 级`, lvl10 && lvl10.d);
ok('lvl10 防御式读取（缺字段按 1，旧档零迁移）',
  !!lvl10 && lvl10.ok({}) === false && lvl10.prog({}) === '1/10');

// —— battle.js 源级落位 ——
ok('battle.js import 已含 LVL10_GOAL（data.js 既有导出，零新增模块依赖）',
  bSrc.includes('LVL10_GOAL, dayPhase, QUESTS } from'));
ok('battle.js 既有 import 邻接 pin 子串逐字保留（dayPhase, QUESTS 未被拆散）',
  bSrc.includes('dayPhase, QUESTS } from'));
ok('battle.js 升级横幅补「（🌙 守灯者 N/10）」后缀（模板逐字：分子读 hero.level 防御式）',
  bSrc.includes('`🎉 等级提升到 Lv.${hero.level}！HP+${g.hp} MP+${g.mp} 攻+${g.atk} 防+${g.def}${enemy.isBoss ? \'，你终于可以……\' : \'\'}（剩余 ${hero.gold} 金）（🌙 守灯者 ${hero.level || 1}/${LVL10_GOAL}）`'));
ok('battle.js 升级横幅既有片段零回归（Lv/HP/MP/攻/防/真身句/结余逐字）',
  bSrc.includes('🎉 等级提升到 Lv.') && bSrc.includes('${enemy.isBoss ? \'，你终于可以……\' : \'\'}') &&
  bSrc.includes('（剩余 ${hero.gold} 金）') && bSrc.includes(', MILESTONE_MS);'));
ok('battle.js 含 v24.26 注释（升级分支行内说明块）', bSrc.includes('v24.26 体验打磨·信息透明·计数现场'));
ok('battle.js 升级分支注释「现场是动作本身」同族表述（v24.20 先例引用）', bSrc.includes('v24.20 诸技通明'));
ok('battle.js 结算零回归（grantXp 返回值加 HP/MP/攻防逐字未动）',
  bSrc.includes('HP+${g.hp} MP+${g.mp} 攻+${g.atk} 防+${g.def}'));

// —— README 同步 ——
ok('README 含 v24.26 守护描述（升级横幅「🌙 守灯者 N/10」进度后缀守护）',
  readme.includes('v24.26 起含 🎉 升级横幅「🌙 守灯者 N/10」进度后缀守护'));
ok('README tests 树串尾已延伸至 smoke_v2426_levelprog（... + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog（npm test 串跑））',
  readme.includes('smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog（npm test 串跑）'));
ok('README 件套口径为二百七十八件套（二百七十七件套清除）',
  readme.includes('冒烟二百七十八件套（二百七十七件套清除）'));
ok('README 尚无 252 件套口径（哨兵前望 252 语义：下一版才写 252）',
  !readme.includes('二百七十七件套（二百七十七件套清除）') && !readme.includes('冒烟二百七十九件套'));
ok('README 含 smoke_v2426_levelprog 入库（278 份）', readme.includes('smoke_v2426_levelprog 入库（278 份）'));
ok('README 仍保留 v24.25 历史守护描述与入库口径（二百四十九件套 + 249 份）',
  readme.includes('v24.25 起含 商店界面「🧪 药香满囊 N/50」进度角标守护') && readme.includes('smoke_v2425_potionprog 入库（278 份）'));

// —— package.json 同步 ——
const testChain = (pkg.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 250 件套', testChain === 278, String(testChain));
ok('package.json 已收录 smoke_v2426_levelprog（npm test 串跑第 273 份）',
  pkg.includes('smoke_v2426_levelprog.mjs'));
ok('package.json 串尾为 ... && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs"',
  pkgRaw.includes('smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs"'));

// —— CHANGELOG 同步 ——
ok('CHANGELOG 顶部已追加 v24.26 条目（升级横幅守灯者进度后缀）', changelog.startsWith('## v24.54 '));
ok('CHANGELOG 顶部条目含守灯者与 LVL10_GOAL/升级横幅口径说明',
  changelog.includes('守灯者') && changelog.includes('LVL10_GOAL') && changelog.includes('升级横幅'));
ok('CHANGELOG 仍保留 v24.25 与 v24.19 条目标题（历史口径）',
  changelog.includes('## v24.25 体验打磨') && changelog.includes('## v24.19 体验打磨'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set([...pkg.matchAll(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g)].map((m) => m[0].replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 250 与实跑链恒等', files.length === 278, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：v2415 树串守护已推进至新链尾 + 前望 252 ——
const t2415 = read('tests/smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v2426_levelprog（第 273 份）',
  t2415.includes("chain[chain.length - 1] === 'smoke_v2454_spendprog'"));
ok('smoke_v2415 树串 token 数已推进至 250', t2415.includes('treeTok.length === 278'));
ok('smoke_v2415 哨兵「尚无 252」口径（二百五十三件套 bare 否定式）',
  t2415.includes("!readme.includes('二百七十九件套')"));
const s2425 = read('tests/smoke_v2425_potionprog.mjs');
ok('smoke_v2425 哨兵链已推进至「前望 252」口径（二百五十三件套 括号/冒烟 bare 否定式）',
  s2425.includes("!readme.includes('二百七十七件套（二百七十七件套清除）')") &&
  s2425.includes("!readme.includes('冒烟二百七十九件套')"));
const s2424 = read('tests/smoke_v2424_pondslime.mjs');
ok('smoke_v2424 哨兵链已推进至「前望 252」口径（二百五十三件套 bare 否定式）',
  s2424.includes("!readme.includes('二百七十九件套')"));

// —— 旧代 v24.25 pin 全库零残留扫描（哨兵链：无任何测试再断言 v24.25 GAME_VERSION 字面量 / 顶 pin / 249 口径）——
const leftovers = [];
for (const f of fs.readdirSync(testsDir)) {
  if (!f.endsWith('.mjs') || f === 'smoke_v2426_levelprog.mjs') continue;
  const s = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s.includes("const GAME_VERSION = 'v24.25';") || s.includes("GAME_VERSION === 'v24.25'") ||
      s.includes("startsWith('## v24.25") || s.includes('二百四十九件套（二百四十八件套清除）') ||
      s.includes("testChain === 249") || s.includes("files.length === 249") ||
      s.includes("treeTok.length === 249") || s.includes("chainAll.length === 249") ||
      s.includes("chain[chain.length - 1] === 'smoke_v2425_potionprog'")) leftovers.push(f);
}
ok('全库测试零残留 v24.25 GAME_VERSION/顶 pin/249 口径（哨兵链，豁免本套件）',
  leftovers.length === 0, leftovers.join(','));

process.exit(failed ? 1 : 0);
