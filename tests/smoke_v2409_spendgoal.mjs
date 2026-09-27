// v24.09 专项冒烟：商店界面标题行左缘补「💰 一掷千金 N/1000」消费进度角标——「买装备/药水/卖蘑菇」一眼看清
// 累计消费还差多少拿成就（体验打磨·信息透明·决策现场，承 v24.08 快速旅行面板「🚶 行者无疆 N/15」/ v24.07
// 旅馆界面「🏨 夜宿灯下 N/15」/ v24.05 试炼碑「📜 千锤百炼 N/3」同款行内角标 / v23.74 一掷千金成就同一
// 「成就进度于决策现场可见」主线：商店（全游唯一买装备/药水/卖蘑菇的铺子）的消费决策现场此前只报 金币余额/
// 商品差价，成就「一掷千金」（累计消费 SPEND_GOAL(1000) 金，计数 hero.spent 由 shop.buyPotion/buyWeapon/
// buyArmor/stayInn 四处扣款 + core.brewNow 酿造成本五处唯一产生点写入（金币不足/背包满/精神饱满早退零计数）、
// snapshotHero 全量快照自动持久化、防御式 (hero.spent||0) 旧档零迁移）进度只藏在 C 成就页一行 X/1000——站
// 柜台前查无一眼之数；现 drawShop 补「💰 一掷千金 N/1000」（分子读 hero.spent 防御式 (hero.spent||0)、
// 分母读 data.js SPEND_GOAL 单一数据源，与 ACH_LIST spend 的 ok/prog 同读一份源，调阈值只改 data.js 一处
// 三端自动跟随），12px 灰字左对齐 x=80 与右缘「💰 N 金币」（520 右对齐）对称、与居中标题零重叠；纯显示零
// 结算零存档零数值变化（SPEND_GOAL/五扣款点结算/价签/差价/页脚逐字未动）。
// 本冒烟守护：版本锚点、data.js/menus.js 源级落位（v24.09 注释 / GAME_VERSION v24.09 与旧 v24.08
// 字面量零残留 / v24.08 历史注释保留 / SPEND_GOAL 常量逐字）、运行期常量实值（SPEND_GOAL 1000）
// 与 ACH_LIST spend 同源互证（ok/prog 逐值）、购物五扣款点同源互证（shop.js 四处扣款 + core.js brewNow
// 一处）、README/package.json/CHANGELOG 同步（件套口径 233 + v24.09 守护描述 + 入库 233 + tests 树串尾 +
// package 串尾 + 经济循环句）、哨兵链（v2143 前望 234 且 README 尚无 234 口径）、旧代 v24.08 pin 全库零残留扫描。
import { SPEND_GOAL, GAME_VERSION, ACH_LIST } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.09 商店界面「💰 一掷千金 N/1000」进度角标 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const mSrc = read('js/view/menus.js');
const sSrc = read('js/shop.js');
const cSrc = read('js/core.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v24.08 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.08', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 8)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.09（旧 v24.08 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.09';") && !dSrc.includes("const GAME_VERSION = 'v24.0" + "8';"));
ok('data.js 含 v24.09 注释（商店界面「💰 一掷千金 N/1000」进度角标说明）',
  dSrc.includes('// v24.09 体验打磨·信息透明·决策现场'));
ok('data.js 仍保留 v24.08 历史注释（快速旅行面板「🚶 行者无疆 N/15」进度角标说明，累积注释块）',
  dSrc.includes('// v24.08 体验打磨·信息透明·决策现场'));
ok('data.js 常量逐字落位（const SPEND_GOAL = 1000;）', dSrc.includes('const SPEND_GOAL = 1000;'));

// —— 运行期常量实值（单一数据源）——
ok('SPEND_GOAL === 1000（一掷千金阈值，与 C 页/描述/判定同源）', SPEND_GOAL === 1000, String(SPEND_GOAL));
const sp = ACH_LIST.find((a) => a && a.id === 'spend');
ok('ACH_LIST 含 spend「一掷千金」（与 drawShop 角标同读一份源）', !!sp && sp.name === '一掷千金', sp && sp.name);
ok('spend ok 谓词逐值（0/999 false · 1000/2000 true）',
  !!sp && sp.ok({ spent: 0 }) === false && sp.ok({ spent: 999 }) === false &&
  sp.ok({ spent: 1000 }) === true && sp.ok({ spent: 2000 }) === true);
ok('spend prog 逐值（0→0/1000 · 3→3/1000 · 1000→1000/1000）',
  !!sp && sp.prog({ spent: 0 }) === '0/1000' && sp.prog({ spent: 3 }) === '3/1000' &&
  sp.prog({ spent: 1000 }) === '1000/1000');
ok('spend 描述与 SPEND_GOAL 同源派生（累计消费金币 1000 金）',
  !!sp && sp.d === `累计消费金币 ${SPEND_GOAL} 金`, sp && sp.d);

// —— menus.js 源级落位 ——
ok('menus.js import 已含 SPEND_GOAL（data.js 既有导出，零新增模块依赖）',
  mSrc.includes('SPEND_GOAL'));
ok('menus.js drawShop 补「💰 一掷千金 N/1000」进度行（模板逐字：分子读 hero.spent 防御式）',
  mSrc.includes('`💰 一掷千金 ${(hero.spent || 0)}/${SPEND_GOAL}`'));
ok('menus.js 进度行落位参数（80 · 80 · 12px · #7d93a3 · 左对齐，标题行左缘）',
  mSrc.includes("80, 80, '12px', '#7d93a3', 'left'"));
ok('menus.js 含 v24.09 注释（drawShop 行内说明块）', mSrc.includes('v24.09 商店界面标题行左缘补「💰 一掷千金 N/1000」消费进度角标'));
ok('menus.js 金币行零回归（520,80 · 14px · #ffd24a · 右对齐）',
  mSrc.includes("520,80,'14px','#ffd24a','right'"));
ok('menus.js 面板标题零回归（panel(60,50,520,360,\'杂货商店\')）',
  mSrc.includes("panel(60,50,520,360,'杂货商店')"));
ok('menus.js 页脚行零回归（↑↓选择  Enter/E购买  Esc离开）',
  mSrc.includes('Enter/E购买') && mSrc.includes('Esc离开'));
ok('menus.js 差价提示零回归（还差 N 金口径保留）', mSrc.includes('（还差 ') && mSrc.includes('（背包满）'));

// —— 计数源同源互证（结算/判定/角标读同一份源）——
ok('shop.js buyPotion 扣款计数逐字落位（hero.spent += POTION_PRICE）',
  sSrc.includes('hero.spent = (hero.spent || 0) + POTION_PRICE;'));
ok('shop.js buyWeapon/buyArmor 两处扣款计数逐字落位（hero.spent += price）',
  (sSrc.match(/hero\.spent = \(hero\.spent \|\| 0\) \+ price;/g) || []).length >= 2, String((sSrc.match(/hero\.spent = \(hero\.spent \|\| 0\) \+ price;/g) || []).length));
ok('shop.js stayInn 住店扣款计数逐字落位（hero.spent += INN_PRICE）',
  sSrc.includes('hero.spent = (hero.spent || 0) + INN_PRICE;'));
ok('core.js brewNow 酿造成本第五扣款点计数逐字落位（hero.spent += BREW_GOLD）',
  cSrc.includes('hero.spent = (hero.spent || 0) + BREW_GOLD;'));
ok('core.js 注释含一掷千金/五扣款点口径（v23.74 计数注释保留）', cSrc.includes('一掷千金'));

// —— README 同步 ——
ok('README 含 v24.09 守护描述（商店界面「💰 一掷千金 N/1000」进度角标守护）',
  readme.includes('v24.09 起含 商店界面「💰 一掷千金 N/1000」进度角标守护'));
ok('README 经济循环句含 v24.09 商店角标口径（v24.09 起商店界面标题行常显）',
  readme.includes('**v24.09 起商店界面标题行常显「💰 一掷千金 N/1000」进度角标**'));
ok('README tests 树串尾已延伸至 smoke_v2409_spendgoal（... + smoke_v2408_travelgoal + smoke_v2409_spendgoal（npm test 串跑））',
  readme.includes('+ smoke_v2408_travelgoal + smoke_v2409_spendgoal（npm test 串跑）'));
ok('README 件套口径为二百三十三件套（二百三十二件套清除）且旧 232 口径零残留',
  readme.includes('冒烟二百三十三件套（二百三十二件套清除）') && !readme.includes('冒烟二百三十二件套（二百三十一件套清除）'));
ok('README 含 smoke_v2409_spendgoal 入库（233 份）', readme.includes('smoke_v2409_spendgoal 入库（233 份）'));
ok('README 仍保留 v24.08 历史守护描述与入库口径（快速旅行面板 + 232 份）',
  readme.includes('v24.08 起含 快速旅行面板「🚶 行者无疆 N/15」进度角标守护') && readme.includes('smoke_v2408_travelgoal 入库（232 份）'));

// —— package.json 同步 ——
const testChain = (JSON.parse(pkg).scripts.test.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 233 件套', testChain === 233, String(testChain));
ok('package.json 已收录 smoke_v2409_spendgoal（npm test 串跑第 233 份）',
  JSON.parse(pkg).scripts.test.includes('smoke_v2409_spendgoal.mjs'));
ok('package.json 串尾为 ... smoke_v2408_travelgoal.mjs && node tests/smoke_v2409_spendgoal.mjs"',
  pkg.includes('node tests/smoke_v2408_travelgoal.mjs && node tests/smoke_v2409_spendgoal.mjs"'));

// —— CHANGELOG 同步 ——
ok('CHANGELOG 顶部已追加 v24.09 条目（商店界面一掷千金进度角标）', changelog.startsWith('## v24.09 '));
ok('CHANGELOG 顶部条目含一掷千金与 SPEND_GOAL/商店界面口径说明',
  changelog.includes('一掷千金') && changelog.includes('SPEND_GOAL') && changelog.includes('商店界面'));
ok('CHANGELOG 仍保留 v24.08 与 v24.07 条目标题（历史口径）',
  changelog.includes('## v24.08 体验打磨·信息透明·决策现场') && changelog.includes('## v24.07 体验打磨·信息透明·决策现场'));

// —— 哨兵链：v2143 前哨前望 234 且 README 尚无 234 口径 ——
const s2143 = read('tests/smoke_v2143_talkekey.mjs');
ok('smoke_v2143 哨兵链已推进至二百三十四件套（二百三十三件套清除）',
  s2143.includes('二百三十四件套（二百三十三件套清除）') && s2143.includes("!readme.includes('二百三十四件套（二百三十三件套清除）')"));
ok('README 尚无二百三十四件套（二百三十三件套清除）前望口径', !readme.includes('二百三十四件套（二百三十三件套清除）'));

// —— 旧代 v24.08 pin 全库零残留（不含本件；拆串防误伤，承 v2405-v2408 惯例）——
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2409_spendgoal.mjs');
const stale = [];
for (const f of allTests) {
  const src = read('tests/' + f);
  if (src.includes("const GAME_VERSION = 'v24.0" + "8';") ||
      src.includes("GAME_VERSION === 'v24.0" + "8'") ||
      src.includes("startsWith('## v24.0" + "8 ')") ||
      src.includes("startsWith('## v24.0" + "8 ") ||
      src.includes("startsWith('## v24.0" + "8'") ||
      src.includes('已为 v24.0' + '8（') ||
      src.includes('已追加 v24.0' + '8 条目') ||
      src.includes('冒烟二百三十二件套（二百三十一件套清' + '除）') ||
      src.includes('二百三十二件套（二百三十一件套清' + '除）') ||
      src.includes('testChain === ' + '232') ||
      src.includes('smoke_v2407_innrest + smoke_v2408_travelgoal（npm test 串' + '跑）') ||
      src.includes('node tests/smoke_v2408_travelgoal.mjs' + '"') ||
      src.includes('smoke_v2408_travelgoal\\\\' + '.mjs"') ||
      src.includes('smoke_v2408_travelgoal\\\\\\\\' + '.mjs"')) stale.push(f);
}
ok('旧代 v24.08 字面量/恒等/顶 pin/件套 232 口径/testChain 232/串尾 & 树串尾 全库零残留（' + allTests.length + ' 件扫描）',
  stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
