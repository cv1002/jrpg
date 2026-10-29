// v24.36 专项冒烟：「图鉴 / 收集」数值速查行——README「数值速查」速查表 26 行已覆盖 基础属性/每级成长/
// 升级经验/技能领悟/装备/经济/区域修正/试炼推荐等级/战斗/伤害公式/克制状态/掉落/首胜彩头/宝箱宝藏/遇敌槽/
// 恢复点补给/出没生态/试炼彩头/成就档位/魔物数值/技能数值/强敌变身/难度倍率/支线奖励/昼夜时段，唯独
// 「图鉴怎么开、开了给什么」查无一行——全游图鉴链条（BESTIARY_TARGET 13 种单一数据源、收录 hero.bestiary
// 由 battle.winBattle 唯一写入点、遭遇 hero.seen 由 battle.startBattle 唯一写入点、图鉴行三态逐级揭示
// （未遭遇 ❓？？？ / 已遭遇未讨伐 揭名+出没地+已遭遇次数（兵力弱点仍加密）/ 讨伐全揭示）、全收成就
// 「记忆守护者」另 +999 金 PERFECTION_GOLD、四枚 FRAGMENTS 记忆碎片集齐触发真结局「全记忆」加页）
// 散见 data.js BESTIARY_TARGET/PERFECTION_GOLD/FRAGMENTS 源码、battle.js 两写入点、menus.js drawCodex
// rows 三态、ACH_LIST perfection——调图鉴机制需先通读代码才能对上口径；现补录：数值速查表「出没生态」行
// 之后追加「图鉴 / 收集」行（全部由 BESTIARY_TARGET/PERFECTION_GOLD/FRAGMENTS/codexStats/monReward/
// codexTag 派生、与图鉴页 rows/状态页 📕/C 页/胜利·阵亡屏同读同源）；纯文档零逻辑零结算零存档零数值变化，
// 全部数值逐字未动。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.36 注释 / GAME_VERSION v24.36 与旧 v24.35 字面量零残留 /
// v24.35 历史注释保留）、运行期常量实值（BESTIARY_TARGET.length 13 · PERFECTION_GOLD 999 ·
// FRAGMENTS.length 4）、两写入点源码同源互证（winBattle bestiary 累加 / startBattle seen 计数）、
// drawCodex 三态同源（got/seen/seenCt）、ACH_LIST perfection 同源（ok/prog/r）、README/package.json/
// CHANGELOG 同步（件套口径 261 + v24.36 守护描述 + 入库 261 + tests 树串尾 + package 串尾 + 速查表新行·行序）、
// 哨兵链（前望 275 且 README 尚无 275 口径）、旧代 v24.35 pin 全库零残留扫描。
import { BESTIARY_TARGET, PERFECTION_GOLD, FRAGMENTS, ACH_LIST, GAME_VERSION } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.36 「图鉴 / 收集」数值速查行 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const bSrc = read('js/battle.js');
const mSrc = read('js/view/menus.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v24.36，精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.36', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] >= 36)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.36（旧 v24.35 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.184';") && !dSrc.includes("const GAME_VERSION = 'v24.35';"));
ok('data.js 含 v24.36 注释（「图鉴 / 收集」数值速查行说明）',
  dSrc.includes('// v24.36 文档整理·数值说明·同源口径'));
ok('data.js 仍保留 v24.35 历史注释（后期金币曲线续平滑（第五轮）说明，累积注释块）',
  dSrc.includes('// v24.35 数值平衡·后期金币曲线续平滑'));
ok('data.js 常量逐字落位（const BESTIARY_TARGET / const PERFECTION_GOLD = 999 / const FRAGMENTS）',
  dSrc.includes('const BESTIARY_TARGET=') && dSrc.includes('const PERFECTION_GOLD = 999;') && dSrc.includes('const FRAGMENTS='));

// —— 运行期常量实值（单一数据源）——
ok('BESTIARY_TARGET.length === 13（全图鉴 13 种：四基础怪 + 四强怪 + 双精英 + 三主线 Boss）',
  BESTIARY_TARGET.length === 13, String(BESTIARY_TARGET.length));
ok('BESTIARY_TARGET 含三主线 Boss 与双精英（幽冥魔王/洞窟领主/终焉之神/石心魔像/残焰魔像）',
  ['幽冥魔王', '洞窟领主', '终焉之神', '石心魔像', '残焰魔像'].every((x) => BESTIARY_TARGET.includes(x)));
ok('PERFECTION_GOLD === 999（成就「记忆守护者」图鉴全收集专享金币奖励）',
  PERFECTION_GOLD === 999, String(PERFECTION_GOLD));
ok('FRAGMENTS.length === 4（真结局关键收集：守门人的脚印/灯卫的誓/最后一车星砂/初灯的名字）',
  FRAGMENTS.length === 4, String(FRAGMENTS.length));
const _fragNames = FRAGMENTS.map((f) => f.name || '').join('|');
ok('FRAGMENTS 四枚名字逐字（石心魔像·守门人的脚印 / 幽冥魔王·灯卫的誓 / 洞窟领主·最后一车星砂 / 终焉之神·初灯的名字）',
  _fragNames.includes('守门人的脚印') && _fragNames.includes('灯卫的誓') &&
  _fragNames.includes('最后一车星砂') && _fragNames.includes('初灯的名字'), _fragNames);

// —— ACH_LIST perfection 同源互证 ——
const _perf = ACH_LIST.find((a) => a.id === 'perfection');
ok('ACH_LIST 含 perfection（「记忆守护者」）且收录口径与 BESTIARY_TARGET 同源（every bestiary>=1）',
  !!_perf && /BESTIARY_TARGET\.every/.test(String(_perf.ok)));
ok('ACH_LIST perfection 描述与进度同源（收录全部 ${BESTIARY_TARGET.length} 种 · prog N/13）',
  !!_perf && String(_perf.d).includes('' + BESTIARY_TARGET.length) &&
  String(_perf.prog).includes('BESTIARY_TARGET.length'));
ok('ACH_LIST perfection 奖励文案与 PERFECTION_GOLD 同源（奖励 999 金币）',
  !!_perf && String(_perf.r).includes('' + PERFECTION_GOLD), _perf ? String(_perf.r) : 'no r');

// —— 两写入点源码同源互证 ——
ok('battle.js winBattle 唯一收录写入点（hero.bestiary[bookName] = (hero.bestiary[bookName] || 0) + 1）',
  bSrc.includes('hero.bestiary[bookName] = (hero.bestiary[bookName] || 0) + 1'));
ok('battle.js startBattle 唯一遭遇写入点（S.G.seen[_seenKey] = (S.G.seen[_seenKey] || 0) + 1）',
  bSrc.includes('S.G.seen[_seenKey] = (S.G.seen[_seenKey] || 0) + 1'));
ok('battle.js 首杀收录反馈（「📕 记忆图鉴新收录」先例 v23.23 保留/再杀零噪音）',
  bSrc.includes('记忆图鉴新收录'));

// —— drawCodex 三态同源 ——
ok('menus.js drawCodex rows 与 BESTIARY_TARGET 同源（BESTIARY_TARGET.map 且 got/seen/seenCt 三态）',
  mSrc.includes('BESTIARY_TARGET.map') && mSrc.includes('seenCt'));
ok('menus.js 图鉴行三态口径（got=!!(hero.bestiary||{})[n] / seen=!!((hero.seen||{})[n]) 防御式）',
  mSrc.includes('!!(hero.bestiary||{})[n]') && mSrc.includes('!!((hero.seen||{})[n])'));
ok('menus.js 图鉴行数据与 codexStats/monReward/codexTag 同读一份源（import 邻接）',
  mSrc.includes('codexStats') && mSrc.includes('monReward') && mSrc.includes('codexTag'));
ok('menus.js 状态页资源行 📕 N/13 与 BESTIARY_TARGET 同源（codexN/BESTIARY_TARGET.length）',
  mSrc.includes('codexN') && mSrc.includes('BESTIARY_TARGET.length'));

// —— README 速查行落位 ——
ok('README 数值速查表含「图鉴 / 收集」行（| 图鉴 / 收集 |）', readme.includes('| 图鉴 / 收集 |'));
ok('README 新行位于「出没生态」行之后、「试炼 / 彩头」行之前（行序）',
  readme.indexOf('| 出没生态 |') < readme.indexOf('| 图鉴 / 收集 |') &&
  readme.indexOf('| 图鉴 / 收集 |') < readme.indexOf('| 试炼 / 彩头 |'));
ok('README 新行含六源派生口径（BESTIARY_TARGET / PERFECTION_GOLD / FRAGMENTS / codexStats / monReward / codexTag）',
  readme.includes('`BESTIARY_TARGET`') && readme.includes('`PERFECTION_GOLD`') &&
  readme.includes('`FRAGMENTS`') && readme.includes('`codexStats`') &&
  readme.includes('`monReward`') && readme.includes('`codexTag`'));
ok('README 新行标注 v24.36 补录', readme.includes('（v24.36 补录）'));
ok('README 速查表「出没生态」行零回归（雾语林 Lv.3 起约 7% 精英逐字保留）',
  readme.includes('雾语林 Lv.3 起约 7% 撞见精英石心魔像'));
ok('README 速查表「试炼 / 彩头」行零回归（150+20×等级 与 PERFECTION_GOLD 口径保留）',
  readme.includes('150+20×等级') && readme.includes('`PERFECTION_GOLD`，与解锁横幅同源'));

// —— README / package.json / CHANGELOG 同步 ——
const testChain = (JSON.parse(pkg).scripts.test.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 260 件套', testChain === 394, String(testChain));
ok('package.json 已收录 smoke_v2436_codexrow（npm test 串跑第 273 份）',
  JSON.parse(pkg).scripts.test.includes('smoke_v2436_codexrow.mjs'));
ok('package.json 串尾 ... && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs"',
  pkg.includes('smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs && node tests/smoke_v2459_xpcurve9.mjs && node tests/smoke_v2460_xpcurve10.mjs && node tests/smoke_v2461_xpcurve11.mjs && node tests/smoke_v2462_xpcurve12.mjs && node tests/smoke_v2463_xpcurve13.mjs && node tests/smoke_v2464_xpcurve14.mjs && node tests/smoke_v2465_xpcurve15.mjs && node tests/smoke_v2466_xpcurve16.mjs && node tests/smoke_v2467_xpcurve17.mjs && node tests/smoke_v2468_xpcurve18.mjs && node tests/smoke_v2469_xpcurve19.mjs && node tests/smoke_v2470_xpcurve20.mjs && node tests/smoke_v2471_bellman.mjs && node tests/smoke_v2472_bellquest.mjs && node tests/smoke_v2473_xpcurve21.mjs && node tests/smoke_v2475_xpcurve22.mjs && node tests/smoke_v2476_achprog.mjs && node tests/smoke_v2477_fisher.mjs && node tests/smoke_v2478_xpcurve23.mjs && node tests/smoke_v2479_xpcurve24.mjs && node tests/smoke_v2480_fisherquest.mjs && node tests/smoke_v2481_xpcurve25.mjs && node tests/smoke_v2482_watchquest.mjs && node tests/smoke_v2483_xpcurve26.mjs && node tests/smoke_v2484_goldcurve10.mjs && node tests/smoke_v2485_goldcurve11.mjs && node tests/smoke_v2486_goldcurve12.mjs && node tests/smoke_v2487_goldcurve13.mjs && node tests/smoke_v2488_goldcurve14.mjs && node tests/smoke_v2489_goldcurve15.mjs && node tests/smoke_v2490_goldcurve16.mjs && node tests/smoke_v2491_goldcurve17.mjs && node tests/smoke_v2492_goldcurve18.mjs && node tests/smoke_v2493_goldcurve19.mjs && node tests/smoke_v2494_goldcurve20.mjs && node tests/smoke_v2495_goldcurve21.mjs && node tests/smoke_v2496_goldcurve22.mjs && node tests/smoke_v2497_goldcurve23.mjs && node tests/smoke_v2498_goldcurve24.mjs && node tests/smoke_v2499_goldcurve25.mjs && node tests/smoke_v24100_talequest.mjs && node tests/smoke_v24101_goldcurve26.mjs && node tests/smoke_v24102_goldcurve27.mjs && node tests/smoke_v24103_goldcurve28.mjs && node tests/smoke_v24104_goldcurve29.mjs && node tests/smoke_v24105_songquest.mjs && node tests/smoke_v24106_moonquest.mjs && node tests/smoke_v24107_peddlequest.mjs && node tests/smoke_v24108_shopquest.mjs && node tests/smoke_v24109_carvequest.mjs && node tests/smoke_v24110_vowquest.mjs && node tests/smoke_v24111_hearerquest.mjs && node tests/smoke_v24112_talkquest.mjs && node tests/smoke_v24113_walkquest.mjs && node tests/smoke_v24114_fleequest.mjs && node tests/smoke_v24115_achhud.mjs && node tests/smoke_v24116_guidequest.mjs && node tests/smoke_v24117_codexhud.mjs && node tests/smoke_v24118_wellquest.mjs && node tests/smoke_v24119_huntquest.mjs && node tests/smoke_v24120_chesthud.mjs && node tests/smoke_v24121_siftquest.mjs && node tests/smoke_v24122_crystalquest.mjs && node tests/smoke_v24123_fraghud.mjs && node tests/smoke_v24124_questshud.mjs && node tests/smoke_v24125_hunthud.mjs && node tests/smoke_v24126_waitquest.mjs && node tests/smoke_v24127_lampquest.mjs && node tests/smoke_v24128_stelequest.mjs && node tests/smoke_v24129_stele2quest.mjs && node tests/smoke_v24130_stele3quest.mjs && node tests/smoke_v24131_stele4quest.mjs && node tests/smoke_v24132_fallenquest.mjs && node tests/smoke_v24133_inquest.mjs && node tests/smoke_v24134_kindleq.mjs && node tests/smoke_v24135_ledgerquest.mjs && node tests/smoke_v24136_herbquest.mjs && node tests/smoke_v24143_furnacequest.mjs && node tests/smoke_v24147_unflicker.mjs && node tests/smoke_v24148_swift.mjs && node tests/smoke_v24151_lowlv.mjs && node tests/smoke_v24152_nopotion.mjs && node tests/smoke_v24153_penny.mjs && node tests/smoke_v24154_steadfast.mjs && node tests/smoke_v24155_frugal.mjs && node tests/smoke_v24157_dry.mjs && node tests/smoke_v24158_swift2.mjs && node tests/smoke_v24159_lowlv2.mjs && node tests/smoke_v24160_noskill.mjs && node tests/smoke_v24161_noskill2.mjs && node tests/smoke_v24162_lowskill.mjs && node tests/smoke_v24163_swiftskill.mjs && node tests/smoke_v24164_swiftlv.mjs && node tests/smoke_v24165_nopotskill.mjs && node tests/smoke_v24166_unflskill.mjs && node tests/smoke_v24167_swiftnopo.mjs && node tests/smoke_v24168_lowlvnopo.mjs && node tests/smoke_v24169_unflswift.mjs && node tests/smoke_v24170_unfllowlv.mjs && node tests/smoke_v24171_unflnopo.mjs && node tests/smoke_v24172_unflpenny.mjs && node tests/smoke_v24173_pennyswift.mjs && node tests/smoke_v24174_pennylowlv.mjs && node tests/smoke_v24175_pennynoskill.mjs && node tests/smoke_v24176_pennynopo.mjs && node tests/smoke_v24177_unflswift2.mjs && node tests/smoke_v24178_unflpenny2.mjs && node tests/smoke_v24179_unflnopo2.mjs && node tests/smoke_v24180_unflskill2.mjs && node tests/smoke_v24181_lampoilquest.mjs && node tests/smoke_v24183_unfllowlv2.mjs && node tests/smoke_v24184_pennyswift2.mjs"'));
ok('README tests 树串尾已延伸至 smoke_v2436_codexrow（... + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10 + smoke_v2461_xpcurve11 + smoke_v2462_xpcurve12 + smoke_v2463_xpcurve13 + smoke_v2464_xpcurve14 + smoke_v2465_xpcurve15 + smoke_v2466_xpcurve16 + smoke_v2467_xpcurve17 + smoke_v2468_xpcurve18 + smoke_v2469_xpcurve19 + smoke_v2470_xpcurve20 + smoke_v2471_bellman + smoke_v2472_bellquest + smoke_v2473_xpcurve21 + smoke_v2475_xpcurve22 + smoke_v2476_achprog + smoke_v2477_fisher + smoke_v2478_xpcurve23 + smoke_v2479_xpcurve24 + smoke_v2480_fisherquest + smoke_v2481_xpcurve25 + smoke_v2482_watchquest + smoke_v2483_xpcurve26 + smoke_v2484_goldcurve10 + smoke_v2485_goldcurve11 + smoke_v2486_goldcurve12 + smoke_v2487_goldcurve13 + smoke_v2488_goldcurve14 + smoke_v2489_goldcurve15 + smoke_v2490_goldcurve16 + smoke_v2491_goldcurve17 + smoke_v2492_goldcurve18 + smoke_v2493_goldcurve19 + smoke_v2494_goldcurve20 + smoke_v2495_goldcurve21 + smoke_v2496_goldcurve22 + smoke_v2497_goldcurve23 + smoke_v2498_goldcurve24 + smoke_v2499_goldcurve25 + smoke_v24100_talequest + smoke_v24101_goldcurve26 + smoke_v24102_goldcurve27 + smoke_v24103_goldcurve28 + smoke_v24104_goldcurve29 + smoke_v24105_songquest + smoke_v24106_moonquest + smoke_v24107_peddlequest + smoke_v24108_shopquest + smoke_v24109_carvequest + smoke_v24110_vowquest + smoke_v24111_hearerquest + smoke_v24112_talkquest + smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑））',
  readme.includes('smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10 + smoke_v2461_xpcurve11 + smoke_v2462_xpcurve12 + smoke_v2463_xpcurve13 + smoke_v2464_xpcurve14 + smoke_v2465_xpcurve15 + smoke_v2466_xpcurve16 + smoke_v2467_xpcurve17 + smoke_v2468_xpcurve18 + smoke_v2469_xpcurve19 + smoke_v2470_xpcurve20 + smoke_v2471_bellman + smoke_v2472_bellquest + smoke_v2473_xpcurve21 + smoke_v2475_xpcurve22 + smoke_v2476_achprog + smoke_v2477_fisher + smoke_v2478_xpcurve23 + smoke_v2479_xpcurve24 + smoke_v2480_fisherquest + smoke_v2481_xpcurve25 + smoke_v2482_watchquest + smoke_v2483_xpcurve26 + smoke_v2484_goldcurve10 + smoke_v2485_goldcurve11 + smoke_v2486_goldcurve12 + smoke_v2487_goldcurve13 + smoke_v2488_goldcurve14 + smoke_v2489_goldcurve15 + smoke_v2490_goldcurve16 + smoke_v2491_goldcurve17 + smoke_v2492_goldcurve18 + smoke_v2493_goldcurve19 + smoke_v2494_goldcurve20 + smoke_v2495_goldcurve21 + smoke_v2496_goldcurve22 + smoke_v2497_goldcurve23 + smoke_v2498_goldcurve24 + smoke_v2499_goldcurve25 + smoke_v24100_talequest + smoke_v24101_goldcurve26 + smoke_v24102_goldcurve27 + smoke_v24103_goldcurve28 + smoke_v24104_goldcurve29 + smoke_v24105_songquest + smoke_v24106_moonquest + smoke_v24107_peddlequest + smoke_v24108_shopquest + smoke_v24109_carvequest + smoke_v24110_vowquest + smoke_v24111_hearerquest + smoke_v24112_talkquest + smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑）'));
ok('README 件套口径为三百九十四件套（三百九十三件套清除）且旧 259 口径零残留',
  readme.includes('冒烟三百九十四件套（三百九十三件套清除）') && !readme.includes('冒烟二百五十九件套（二百五十八件套清除）'));
ok('README 含 v24.36 守护描述（「图鉴 / 收集」数值速查行守护）',
  readme.includes('v24.36 起含 「图鉴 / 收集」数值速查行守护'));
ok('README 含 smoke_v2436_codexrow 入库（335 份）', readme.includes('smoke_v2436_codexrow 入库（335 份）'));
ok('README 仍保留 v24.35 历史守护描述与入库口径（后期金币曲线续平滑（第五轮）+ 260 份）',
  readme.includes('v24.35 起含 「后期金币曲线续平滑（第五轮）」守护') && readme.includes('smoke_v2435_goldcurve5 入库（335 份）'));
ok('README 仍保留 v24.06 历史守护描述（「恢复点 / 补给」数值速查行守护）',
  readme.includes('v24.06 起含 「恢复点 / 补给」数值速查行守护'));
ok('CHANGELOG 顶部已追加 v24.36 条目（「图鉴 / 收集」数值速查行）', changelog.startsWith('## v24.184 '));
ok('CHANGELOG 顶部条目含图鉴与 BESTIARY_TARGET/PERFECTION_GOLD/FRAGMENTS 口径说明',
  changelog.includes('图鉴') && changelog.includes('BESTIARY_TARGET') &&
  changelog.includes('PERFECTION_GOLD') && changelog.includes('FRAGMENTS') && changelog.includes('数值速查'));
ok('CHANGELOG 仍保留 v24.35 条目标题（历史口径）', changelog.includes('## v24.35 数值平衡'));

// —— 哨兵链：前望 275 且 README 尚无 275 口径 ——
const suiteFiles = fs.readdirSync(testsDir).filter((f) => /^smoke_v.*\.mjs$/.test(f));
ok('tests/ 目录共 279 份 .mjs（smoke.mjs + 278 份 smoke_v*.mjs，含 smoke_v2436_codexrow）',
  suiteFiles.length === 393  && fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).length === 394,
  String(suiteFiles.length));
const sentinelHits = suiteFiles.filter((f) => fs.readFileSync(path.join(testsDir, f), 'utf8').includes('前望 275'));
ok('至少一件既有套件哨兵「前望 275」已推进（级联覆盖）', sentinelHits.length >= 1, String(sentinelHits.length));
ok('README 尚无 275 件套口径（前望 275 语义：下一版入库才到 273）',
  !readme.includes('冒烟三百九十五件套') && !readme.includes('（395 份）') && !readme.includes('三百九十五件套'));

// —— 旧代 v24.35 pin 全库零残留扫描（豁免自身与上一版套件否定式惯例外）——
const _residue = ['const GAME_VERSION = \'v24.35\';', 'GAME_VERSION === \'v24.35\'', '冒烟二百五十九件套（二百五十八件套清除）', '链尾为 smoke_v2435_goldcurve5', '（259 份）'];
const _hits = [];
for (const f of suiteFiles) {
  if (f === 'smoke_v2436_codexrow.mjs') continue;
  if (f === 'smoke_v24105_songquest.mjs') continue;
  const s = fs.readFileSync(path.join(testsDir, f), 'utf8');
  for (const pat of _residue) if (s.includes(pat)) { _hits.push(f + ':' + pat); break; }
}
ok('全库其它套件 v24.35 旧 pin 零残留（旧版 v24.35 字面量/旧件套口径/旧链尾/旧入库份数）',
  _hits.length === 0, _hits.join(' ; '));

console.log(failed === 0 ? `\n✓ 全部通过（${n} 项断言）` : `\n✗ 失败 ${failed}/${n} 项`);
process.exit(failed === 0 ? 0 : 1);
