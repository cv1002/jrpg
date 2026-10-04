// v24.12 专项冒烟：胜利画面补「⚔️ 身经百战 N/100」进度行——「灯芯回来了」的瞬间一眼看清还差几场
// 拿成就（体验打磨·信息透明·计数现场，承 v24.11 阵亡「💪 败而不馁 N/10」/ v24.10 酿造「🍶 妙手回春
// N/5」/ v24.09 商店「🍄 蘑菇商路 N/30」/ v24.08 快速旅行「🚶 行者无疆 N/15」/ v24.07 旅馆「🏨 夜宿灯下
// N/15」/ v24.05 试炼碑「📜 千锤百炼 N/3」同款行内进度 / v23.80 身经百战成就同一「计数现场报进度」主线
// ：胜利画面（drawWin、battle.winBattle 全游唯一胜利结算点）此前只报 战绩/收集三件套/碎片/页脚/冒险进度
// （v19.49-v22.89），成就「身经百战」（累计遭遇 BATTLE_GOAL(100) 场战斗，计数 hero.battles 由
// battle.startBattle 全游唯一战斗入口写入（胜/败/逃都算，与 totalWins 成对端口）、snapshotHero 全量
// 快照自动持久化、防御式 (S.G.battles||0) 旧档零迁移）进度只藏在 C 成就页一行 X/100——「灯芯回来了」
// 的瞬间查无一眼之数（与 v24.11 阵亡「败而不馁」成对——遭遇 vs 败北两个端口各回各自的总结屏）；现
// drawWin 补「⚔️ 身经百战 N/100」（分子读 S.G.battles 防御式 (S.G.battles||0)、分母读 data.js
// BATTLE_GOAL 单一数据源，与 ACH_LIST battles 的 ok/prog 同读一份源，调阈值只改 data.js 一处三端自动
// 跟随），bold 13px 绿字居中 y=452（冒险进度行 434 之下、画布底 480 之内、行间 18 ≥16 不触）；纯显示
// 零结算零存档零数值变化（BATTLE_GOAL/startBattle 计数/战绩行/收集行/碎片行/页脚/未存档行/冒险进度行
// 逐字未动）。
// 本冒烟守护：版本锚点、data.js/menus.js 源级落位（v24.12 注释 / GAME_VERSION v24.12 与旧 v24.11
// 字面量零残留 / v24.11 历史注释保留 / BATTLE_GOAL 常量逐字）、运行期常量实值（BATTLE_GOAL 100）
// 与 ACH_LIST battles 同源互证（ok/prog/d 逐值）、计数源 startBattle 同源互证、
// README/package.json/CHANGELOG 同步（件套口径 239 + v24.12 守护描述 + 入库 239 + tests 树串尾 +
// package 串尾）、哨兵链（v2143 前望 240 且 README 尚无 237 口径）、旧代 v24.11 pin 全库零残留扫描、
// drawWin 既有行零回归（标题/最终等级/战绩/收集/碎片/页脚/未存档/冒险进度逐字未动）。
import { BATTLE_GOAL, GAME_VERSION, ACH_LIST } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.12 胜利画面「⚔️ 身经百战 N/100」进度行 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const mSrc = read('js/view/menus.js');
const bSrc = read('js/battle.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（格式合法 + 已越过 v24.11 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.11', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 11)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.21（旧 v24.11 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.41';") && !dSrc.includes("const GAME_VERSION = 'v24.1" + "1';"));
ok('data.js 含 v24.12 注释（胜利画面「⚔️ 身经百战 N/100」进度行说明）',
  dSrc.includes('// v24.12 体验打磨·信息透明·计数现场'));
ok('data.js 仍保留 v24.11 历史注释（阵亡画面「💪 败而不馁 N/10」进度行说明，累积注释块）',
  dSrc.includes('// v24.11 体验打磨·信息透明·计数现场'));
ok('data.js 常量逐字落位（const BATTLE_GOAL = 100;）', dSrc.includes('const BATTLE_GOAL = 100;'));

// —— 运行期常量实值（单一数据源）——
ok('BATTLE_GOAL === 100（身经百战阈值，与 C 页/描述/判定同源）', BATTLE_GOAL === 100, String(BATTLE_GOAL));
const battlesAch = ACH_LIST.find((a) => a && a.id === 'battles');
ok('ACH_LIST 含 battles「身经百战」（与 drawWin 进度行同读一份源）', !!battlesAch && battlesAch.name === '身经百战', battlesAch && battlesAch.name);
ok('battles ok 谓词逐值（0/99 false · 100/200 true）',
  !!battlesAch && battlesAch.ok({ battles: 0 }) === false && battlesAch.ok({ battles: 99 }) === false &&
  battlesAch.ok({ battles: 100 }) === true && battlesAch.ok({ battles: 200 }) === true);
ok('battles prog 逐值（0→0/100 · 99→99/100 · 100→100/100）',
  !!battlesAch && battlesAch.prog({ battles: 0 }) === '0/100' && battlesAch.prog({ battles: 99 }) === '99/100' &&
  battlesAch.prog({ battles: 100 }) === '100/100');
ok('battles 描述与 BATTLE_GOAL 同源派生（累计遭遇 100 场战斗）',
  !!battlesAch && battlesAch.d === `累计遭遇 ${BATTLE_GOAL} 场战斗`, battlesAch && battlesAch.d);

// —— battle.js 计数源端（startBattle 全游唯一战斗入口）——
ok('battle.js startBattle 战斗入口写入 hero.battles 防御式计数（(S.G.battles||0) 旧档零迁移）',
  bSrc.includes('S.G.battles = (S.G.battles || 0) + 1;'));

// —— menus.js 源级落位 ——
ok('menus.js import 已含 BATTLE_GOAL（data.js 既有导出，零新增模块依赖）',
  mSrc.includes('BREW2_GOAL, ELIXIR_STOCK2_GOAL, BATTLE_GOAL, DEATH_GOAL } from'));
ok('menus.js drawWin 补「⚔️ 身经百战 N/100」进度行（模板逐字：分子读 S.G.battles 防御式）',
  mSrc.includes('`⚔️ 身经百战 ${(S.G.battles || 0)}/${BATTLE_GOAL}`'));
ok('menus.js 进度行落位参数（CV.width/2 · 452 · bold 13px · #8ff0a0，冒险进度行之下）',
  mSrc.includes("CTX.fillStyle='#8ff0a0'; CTX.font='bold 13px sans-serif'") && mSrc.includes(',CV.width/2,452);'));
ok('menus.js 含 v24.12 注释（drawWin 行内说明块）', mSrc.includes('v24.12 体验打磨·信息透明·计数现场'));

// —— menus.js 零回归（既有行逐字）——
ok('menus.js 胜利画面标题零回归（灯 芯 回 来 了）', mSrc.includes("CTX.fillText('灯 芯 回 来 了',CV.width/2, 300);"));
ok('menus.js 最终等级金币行零回归（最终等级 Lv · 金币）',
  mSrc.includes('CTX.fillText(`最终等级 Lv.${S.G.level} · 金币 ${S.G.gold}`,CV.width/2,340);'));
ok('menus.js 战绩行零回归（累计讨伐 · 成就 · ⏱️ · 困难 · 📍）',
  mSrc.includes('`累计讨伐 ${kills} 只 · 成就 ${(S.G.ach||[]).length}/${ACH_LIST.length} · ⏱️${fmtTime(S.G.time)}`'));
ok('menus.js 收集行零回归（📕 图鉴 N/M · 📦 宝箱 N/M · 🕯️ 记忆碎片 N/4）',
  mSrc.includes('`📕 图鉴 ${codexN}/${BESTIARY_TARGET.length} · 📦 宝箱 ${chestN}/${chestTotal()} · 🕯️ 记忆碎片 ${fragW}/${FRAGMENTS.length}`'));
ok('menus.js 碎片行零回归（记忆碎片 N/4 与收集行同桌）',
  mSrc.includes('const fragW = (S.G.fragments || []).length;'));
ok('menus.js 页脚零回归（按 Enter/E 观看尾声 · 按 P 存档 · 按 R 重开新档(连按两次)）',
  mSrc.includes("按 Enter/E 观看尾声 · 按 P 存档 · 按 R 重开新档(连按两次)"));
ok('menus.js 未存档行零回归（💡 本局战果未自动存档 · 按 P 存进当前槽）',
  mSrc.includes('💡 本局战果未自动存档 · 按 P 存进当前槽，回标题按 L 读档即可继续冒险'));
ok('menus.js 冒险进度行零回归（y=434 12px 灰行）',
  mSrc.includes("('冒险进度：' + progW.map(([nm, dn]) => (dn ? '✓ ' : '✗ ') + nm).join(' · '),CV.width/2,434);"));

// —— README 同步 ——
ok('README 含 v24.12 守护描述（胜利画面「⚔️ 身经百战 N/100」进度行守护）',
  readme.includes('v24.12 起含 胜利画面「⚔️ 身经百战 N/100」进度行守护'));
ok('README tests 树串尾已延伸至 smoke_v2412_battlegoal（... + smoke_v2411_deathprog + smoke_v2412_battlegoal + smoke_v2413_xpcurve + smoke_v2414_nightbattle + smoke_v2415_treepin + smoke_v2416_steps + smoke_v2417_mapdrink + smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5（npm test 串跑））',
  readme.includes('+ smoke_v2410_brewgoal + smoke_v2411_deathprog + smoke_v2412_battlegoal + smoke_v2413_xpcurve + smoke_v2414_nightbattle + smoke_v2415_treepin + smoke_v2416_steps + smoke_v2417_mapdrink + smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5（npm test 串跑）'));
ok('README 件套口径为二百六十五件套（二百六十四件套清除）且旧 235 口径零残留',
  readme.includes('冒烟二百六十五件套（二百六十四件套清除）') && !readme.includes('冒烟二百三十五件套（二百三十四件套清除）'));
ok('README 含 smoke_v2412_battlegoal 入库（265 份）', readme.includes('smoke_v2412_battlegoal 入库（265 份）'));
ok('README 仍保留 v24.11 历史守护描述（阵亡画面 + smoke_v2411_deathprog 口径）',
  readme.includes('v24.11 起含 阵亡画面「💪 败而不馁 N/10」进度行守护'));
ok('README 胜利画面行含 v24.12 说明（胜利画面常显「⚔️ 身经百战 N/100」进度行）',
  readme.includes('v24.12 起胜利画面常显「⚔️ 身经百战 N/100」进度行'));
ok('README 成就 bullet 含 v24.12 说明（身经百战 X/100 场 后附进度行口径）',
  readme.includes('身经百战 X/100 场（累计遭遇战斗，v23.80；**v24.12 起胜利画面常显「⚔️ 身经百战 N/100」进度行**'));

// —— package.json 同步 ——
const testChain = (JSON.parse(pkg).scripts.test.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 236 件套', testChain === 265, String(testChain));
ok('package.json 已收录 smoke_v2412_battlegoal（npm test 串跑第 236 份）',
  JSON.parse(pkg).scripts.test.includes('smoke_v2412_battlegoal.mjs'));
ok('package.json 串尾为 ... smoke_v2411_deathprog.mjs && node tests/smoke_v2412_battlegoal.mjs && node tests/smoke_v2413_xpcurve.mjs && node tests/smoke_v2414_nightbattle.mjs && node tests/smoke_v2415_treepin.mjs && node tests/smoke_v2416_steps.mjs && node tests/smoke_v2417_mapdrink.mjs && node tests/smoke_v2418_goldcurve.mjs && node tests/smoke_v2419_luckdrp.mjs && node tests/smoke_v2420_skillprog.mjs && node tests/smoke_v2421_allquest.mjs && node tests/smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs"',
  pkg.includes('smoke_v2411_deathprog.mjs && node tests/smoke_v2412_battlegoal.mjs && node tests/smoke_v2413_xpcurve.mjs && node tests/smoke_v2414_nightbattle.mjs && node tests/smoke_v2415_treepin.mjs && node tests/smoke_v2416_steps.mjs && node tests/smoke_v2417_mapdrink.mjs && node tests/smoke_v2418_goldcurve.mjs && node tests/smoke_v2419_luckdrp.mjs && node tests/smoke_v2420_skillprog.mjs && node tests/smoke_v2421_allquest.mjs && node tests/smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs"'));

// —— CHANGELOG 同步 ——
ok('CHANGELOG 顶部已追加 v24.18 条目（胜利画面身经百战进度行）', changelog.startsWith('## v24.41 '));
ok('CHANGELOG 顶部条目含身经百战与 BATTLE_GOAL/胜利画面口径说明',
  changelog.includes('身经百战') && changelog.includes('BATTLE_GOAL') && changelog.includes('胜利画面'));
ok('CHANGELOG 仍保留 v24.11 与 v24.10 条目标题（历史口径）',
  changelog.includes('## v24.11 体验打磨·信息透明·计数现场') && changelog.includes('## v24.10 体验打磨·信息透明·决策现场'));

// —— 哨兵链：v2143 前哨前望 240 且 README 尚无 237 口径 ——
const s2143 = read('tests/smoke_v2143_talkekey.mjs');
ok('smoke_v2143 哨兵链已推进至二百六十五件套（二百六十四件套清除）',
  s2143.includes('二百四十七件套（二百四十五件套清除）') && s2143.includes("!readme.includes('二百六十六件套（二百六十五件套清除）')"));
ok('README 尚无二百四十七件套（二百四十五件套清除）前望口径', !readme.includes('二百六十六件套（二百六十五件套清除）'));

// —— 旧代 v24.11 pin 全库零残留（不含本件；拆串防误伤，承 v2405-v2411 惯例）——
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2412_battlegoal.mjs');
const stale = [];
for (const f of allTests) {
  const src = read('tests/' + f);
  if (src.includes("const GAME_VERSION = 'v24.1" + "1';") ||
      src.includes("GAME_VERSION === 'v24.1" + "1'") ||
      src.includes("startsWith('## v24.1" + "1 ") ||
      src.includes("startsWith('## v24.1" + "1'") ||
      src.includes('已为 v24.1' + '1（') ||
      src.includes('已追加 v24.1' + '1 条目') ||
      src.includes('冒烟二百三十五件套（二百三十四件套清' + '除）') ||
      src.includes('二百三十五件套（二百三十四件套清' + '除）') ||
      src.includes('testChain === ' + '235') ||
      src.includes('+ smoke_v2411_deathprog（npm test 串' + '跑）') ||
      src.includes('node tests/smoke_v2411_deathprog.mjs' + '"')) stale.push(f);
}
ok('旧代 v24.11 字面量/恒等/顶 pin/件套 235 口径/testChain 235/串尾 & 树串尾 全库零残留（' + allTests.length + ' 件扫描）',
  stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
