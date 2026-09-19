// smoke_v2298_encnum.mjs —— v22.98 遇敌槽机制数值说明补录（README 数值速查 + 视觉段小地图口径）守护
// 承 v21.10-v22.97 冒烟入库先例：版本锚点 + 源级落位（data.js v22.98 注释/GAME_VERSION 字面量 v22.98/
// v22.97 历史注释保留零 v22.97 字面量残留）+ ENCOUNTER 数据契约（dangerMin/dangerVar/calm/fountain/full/
// warn/warnFlash 七字段逐值 + HELP_PAGES「遇敌槽 / 危险格」机制行派生复核与 README 新行同源同值）+
// README 数值速查「遇敌槽」行落位（ENCOUNTER 单一数据源引用 + 五档数值 + v22.98 补录注释）+
// README 视觉段小地图口径三段落位（遇敌槽红条/全域危险/大灯·星井状态标）+ README/package.json/CHANGELOG
// 同步（二百零三件套（二百零二件套清除）/串尾/入库 194 份/顶 pin）+ 姊妹件套 pin（smoke_v2297 随新现实
// 更新）+ 哨兵链领先一位（195 口径）+ 旧代 v22.97 pin 全库零残留。
import { GAME_VERSION, ENCOUNTER, HELP_PAGES } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.98 遇敌槽机制数值说明守护冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v22.97 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.97（本版守 v22.98）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 99)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v22.98 版本注释', dataSrc.includes('// v22.98 文档整理·数值说明·同源口径：README「数值速查」补「遇敌槽」行'));
ok('data.js GAME_VERSION 字面量已为 v22.98（旧 v22.97 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.07';") && !dataSrc.includes("const GAME_VERSION = 'v22." + "97';"));
ok('data.js 仍保留 v22.97 历史注释（满载而归注释未动）', dataSrc.includes('// v22.97 新内容·单成就·宝箱线中档里程碑：新成就「满载而归」'));

// —— ENCOUNTER 数据契约（七字段逐值，v22.43 机制行同源）——
ok('ENCOUNTER.dangerMin === 10', ENCOUNTER.dangerMin === 10, String(ENCOUNTER.dangerMin));
ok('ENCOUNTER.dangerVar === 9', ENCOUNTER.dangerVar === 9, String(ENCOUNTER.dangerVar));
ok('ENCOUNTER.calm === -6', ENCOUNTER.calm === -6, String(ENCOUNTER.calm));
ok('ENCOUNTER.fountain === -25', ENCOUNTER.fountain === -25, String(ENCOUNTER.fountain));
ok('ENCOUNTER.full === 100', ENCOUNTER.full === 100, String(ENCOUNTER.full));
ok('ENCOUNTER.warn === 70', ENCOUNTER.warn === 70, String(ENCOUNTER.warn));
ok('ENCOUNTER.warnFlash === 330', ENCOUNTER.warnFlash === 330, String(ENCOUNTER.warnFlash));

// —— HELP_PAGES「遇敌槽 / 危险格」机制行派生复核（与 README 新行同源同值）——
const encRow = (HELP_PAGES[1] || []).find((r) => String(r[0]).includes('遇敌槽'));
ok('HELP_PAGES 地图指南含「遇敌槽 / 危险格」机制行（v22.43 既有）', !!encRow);
if (encRow) {
  const hi = `${ENCOUNTER.dangerMin}~${ENCOUNTER.dangerMin + ENCOUNTER.dangerVar - 1}`;
  ok('H 页机制行危险格步进由 ENCOUNTER 派生（+10~18）', String(encRow[1]).includes(hi), String(encRow[1]).slice(0, 60));
  ok('H 页机制行槽满/安全格/喷泉/预警线同源（100/-6/-25/70）',
    String(encRow[1]).includes(String(ENCOUNTER.full)) && String(encRow[1]).includes('必遇敌') &&
    String(encRow[2]).includes('雾语林/矿脉/回廊全图皆危险格') &&
    String(encRow[2]).includes(String(Math.abs(ENCOUNTER.calm))) &&
    String(encRow[2]).includes(String(Math.abs(ENCOUNTER.fountain))) &&
    String(encRow[2]).includes(String(ENCOUNTER.warn)));
}

// —— README 数值速查「遇敌槽」行落位 ——
const hi2 = `${ENCOUNTER.dangerMin}~${ENCOUNTER.dangerMin + ENCOUNTER.dangerVar - 1}`;
ok('README 数值速查含「遇敌槽」行（v22.98 补录）',
  readme.includes('| 遇敌槽 |') && readme.includes('v22.98 补录'));
ok('README 遇敌槽行由 ENCOUNTER 单一数据源派生（零裸字面量口径：dangerMin~dangerMin+dangerVar-1 引用）',
  readme.includes('`dangerMin`~`dangerMin+dangerVar-1`') && readme.includes('`ENCOUNTER` |'));
ok('README 遇敌槽行数值与 ENCOUNTER 逐字同值（+10~18/-6/-25/100/70/330ms）',
  readme.includes(hi2) && readme.includes('安全格 -6') && readme.includes('喷泉 -25') &&
  readme.includes('槽满 100 必遇敌') && readme.includes('槽达 70 ⚠️ 危险逼近（330ms 快闪）'));

// —— README 视觉段小地图口径三段落位 ——
ok('README 视觉段含「遇敌槽红条 / 全域危险」口径（与 v22.37/43/44 图例/机制行/全域标注同口径）',
  readme.includes('**遇敌槽红条 / 全域危险**') && readme.includes('遇敌槽色带+百分比读数') &&
  readme.includes('全域危险'));
ok('README 视觉段含「大灯/星井状态标」口径（与 v22.36/38 画布同档同源）',
  readme.includes('**大灯/星井状态标**') && readme.includes('熄冷灰/亮暖金') && readme.includes('低鸣星蓝/静默灰'));

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树串尾已延伸至 smoke_v2298_encnum（v2297 后接 v2298）',
  readme.includes('smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum（npm test 串跑）'));
ok('README 旧串尾零残留（smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum（npm test 串跑）不在树尾）',
  !readme.includes('smoke_v2297_chestmid（npm test 串' + '跑）'));
ok('README 件套口径为二百零三件套（二百零二件套清除）且旧 193 口径零残留',
  readme.includes('冒烟二百零三件套（二百零二件套清除）') && !readme.includes('冒烟一百九十三件套（一百九十二件套清' + '除）'));
ok('README 含 v22.98 守护描述（遇敌槽机制数值说明守护）', readme.includes('v22.98 起含遇敌槽机制数值说明守护'));
ok('README 含 smoke_v2298_encnum 入库（194 份）', readme.includes('smoke_v2298_encnum 入库（194 份）'));
ok('README 仍保留 v22.97 守护描述（历史口径）', readme.includes('v22.97 起含新成就「满载而归」守护'));
ok('README 仍保留 smoke_v2297_chestmid 入库（193 份）历史口径', readme.includes('smoke_v2297_chestmid 入库（193 份）'));
ok('package.json 已收录 smoke_v2298_encnum（npm test 串跑第 194 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2298_encnum.mjs'));
ok('package.json 串尾为 ... smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs"',
  pkg.includes('node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 194 件套', testChain === 203, String(testChain));
ok('CHANGELOG 顶部已追加 v22.98 条目', changelog.startsWith('## v23.07 '));
ok('CHANGELOG 仍保留 v22.97 条目（历史口径）', changelog.includes('## v22.97 新成就「满载而归」'));

// —— 姊妹件套 pin 随新现实更新 + 旧代 v22.97 pin 零残留 ——
const s2297 = read('smoke_v2297_chestmid.mjs');
const s2296 = read('smoke_v2296_endingprog.mjs');
const s2143 = read('smoke_v2143_talkekey.mjs');
ok('smoke_v2297 的 GAME_VERSION 字面量 pin 已更新为 v22.98', s2297.includes("const GAME_VERSION = 'v23.07';"));
ok('smoke_v2297 的 CHANGELOG 顶 pin 已更新为 ## v22.98', s2297.includes("startsWith('## v23.07 '"));
ok('smoke_v2297 的件套 pin 已更新为二百零三件套（二百零二件套清除）',
  s2297.includes('二百零三件套（二百零二件套清除）'));
ok('smoke_v2297 的 README 串尾 pin 已延伸至 smoke_v2298_encnum',
  s2297.includes('smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum（npm test 串跑）'));
ok('smoke_v2297 的 package 串尾 pin 已延伸至 smoke_v2298_encnum',
  s2297.includes('node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs"'));
ok('smoke_v2297 的 testChain pin 已更新为 194', s2297.includes('testChain === 203'));
ok('smoke_v2297 的版本锚已推进至 >= 98', s2297.includes('_gv[1] >= 99'));
ok('smoke_v2296 的 GAME_VERSION 字面量 pin 已更新为 v22.98', s2296.includes("const GAME_VERSION = 'v23.07';"));
ok('smoke_v2143 哨兵链已推进至二百零三件套（二百零二件套清除）',
  s2143.includes('二百零四件套（二百零三件套清除）') && s2143.includes("!readme.includes('二百零四件套（二百零三件套清除）')"));

// 旧代 v22.97 pin 全库零残留（不含本件）
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2298_encnum.mjs');
const stale = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("const GAME_VERSION = 'v22." + "97';") || src.includes("const GAME_VERSION = 'v22." + "97'") || src.includes("GAME_VERSION === 'v22." + "97'") ||
      src.includes('一百九十三件套（一百九十二件套清' + '除）') || src.includes('testChain === ' + '193') ||
      src.includes('smoke_v2297_chestmid（npm test 串' + '跑）') || src.includes('_gv[1] >= ' + '97') ||
      src.includes("startsWith('## v22." + "97") || src.includes('smoke_v2297_chestmid.mjs"')) stale.push(f);
}
ok('旧代 v22.97 字面量/恒等/件套/testChain/串尾/版本锚/顶 pin/package 串尾 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

console.log(`\n— v22.98 遇敌槽机制数值说明守护冒烟：${n - failed}/${n} 通过 —`);
if (failed) process.exit(1);
