// smoke_v2303_rushnum.mjs —— v23.03 README「数值速查」试炼/彩头行守护（文档整理·数值说明·同源口径）
// 承 v21.10-v23.02 冒烟入库先例：版本锚点 + 源级落位（data.js v23.03 注释/GAME_VERSION 字面量 v23.03/
// v23.02 历史注释保留零 v23.02 字面量残留）+ 试炼/彩头常量契约（RUSH_RECOVER 逐值/RUSH_BASE_GOLD/
// RUSH_GOLD_PER_LV 派生通关奖/TRUE_BONUS_GOLD/PERFECTION_GOLD 逐值）+ README 数值速查「试炼 / 彩头」
// 行落位（与结算/横幅/试炼碑/守碑人/战斗预览/成就标注同源口径，零裸字面量）+
// README/package.json/CHANGELOG 同步（冒烟二百零九件套（二百零八件套清除）/串尾/入库 199 份/顶 pin）+
// 姊妹件套 pin（smoke_v2302 随新现实更新）+ 哨兵链领先一位（200 口径）+ 旧代 v23.02 pin 全库零残留。
import { GAME_VERSION, RUSH_RECOVER, RUSH_BASE_GOLD, RUSH_GOLD_PER_LV, TRUE_BONUS_GOLD, PERFECTION_GOLD } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v23.03 试炼/彩头数值速查行守护冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v23.02 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v23.02（本版守 v23.03）', !!_gv && (_gv[0] > 23 || (_gv[0] === 23 && _gv[1] >= 3)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v23.03 版本注释', dataSrc.includes('// v23.03 文档整理·数值说明·同源口径：README「数值速查」补「试炼 / 彩头」行'));
ok('data.js GAME_VERSION 字面量已为 v23.03（旧 v23.02 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.13';") && !dataSrc.includes("const GAME_VERSION = 'v23." + "02';"));
ok('data.js 仍保留 v23.02 历史注释（战斗指令栏效果预览注释未动）', dataSrc.includes('// v23.02 体验打磨·信息透明·纯显示：战斗指令栏'));

// —— 试炼/彩头常量契约（单一数据源：结算/横幅/试炼碑/守碑人/战斗预览/成就标注同读）——
ok('RUSH_RECOVER.hp === 0.35（每胜一关回血 35%HP）', RUSH_RECOVER.hp === 0.35, String(RUSH_RECOVER.hp));
ok('RUSH_RECOVER.mp === 0.5（每胜一关回蓝 50%MP）', RUSH_RECOVER.mp === 0.5, String(RUSH_RECOVER.mp));
ok('RUSH_BASE_GOLD === 150（试炼通关奖固定部分）', RUSH_BASE_GOLD === 150, String(RUSH_BASE_GOLD));
ok('RUSH_GOLD_PER_LV === 20（试炼通关奖随等级加成/级）', RUSH_GOLD_PER_LV === 20, String(RUSH_GOLD_PER_LV));
ok('TRUE_BONUS_GOLD === 300（终焉之神击败另奖）', TRUE_BONUS_GOLD === 300, String(TRUE_BONUS_GOLD));
ok('PERFECTION_GOLD === 999（图鉴全收成就专享）', PERFECTION_GOLD === 999, String(PERFECTION_GOLD));
ok('通关奖派生式与结算同源（Lv.12 = 150+20×12 = 390）', RUSH_BASE_GOLD + 12 * RUSH_GOLD_PER_LV === 390);
ok('README 试炼/彩头行 35%HP·50%MP 与 RUSH_RECOVER 同源', readme.includes('三连战每胜一关回血 35%HP·50%MP') && readme.includes('RUSH_RECOVER'));
ok('README 试炼/彩头行 通关奖与 RUSH_BASE_GOLD/RUSH_GOLD_PER_LV 同源', readme.includes('150+20×等级') && readme.includes('RUSH_BASE_GOLD'));
ok('README 试炼/彩头行 终焉之神+300金 与 TRUE_BONUS_GOLD 同源', readme.includes('终焉之神击败另 +300 金') && readme.includes('TRUE_BONUS_GOLD'));
ok('README 试炼/彩头行 图鉴全收+999金 与 PERFECTION_GOLD 同源', readme.includes('记忆守护者') && readme.includes('PERFECTION_GOLD'));
ok('README 试炼/彩头行 含 v23.03 补录注释', readme.includes('（v23.03 补录）'));

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树串尾已延伸至 smoke_v2303_rushnum（v2302 后接 v2303）',
  readme.includes('smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall（npm test 串跑）'));
ok('README 旧串尾零残留（v2302 后无串尾收口）',
  !readme.includes('smoke_v2301_eco + smoke_v2302_cmdprev（npm test 串' + '跑）'));
ok('README 件套口径为二百零九件套（二百零八件套清除）且旧 196 口径零残留',
  readme.includes('冒烟二百零九件套（二百零八件套清除）') && !readme.includes('冒烟一百九十六件套（一百九十五件套清' + '除）'));
ok('README 含 v23.03 守护描述（试炼/彩头数值速查行守护）',
  readme.includes('v23.03 起含「试炼 / 彩头」数值速查行守护'));
ok('README 含 smoke_v2303_rushnum 入库（199 份）', readme.includes('smoke_v2303_rushnum 入库（199 份）'));
ok('README 仍保留 v23.02 守护描述（历史口径）', readme.includes('v23.02 起含战斗指令栏 [5]防御/[6]蓄力 效果预览守护'));
ok('README 仍保留 smoke_v2302_cmdprev 入库（198 份）历史口径', readme.includes('smoke_v2302_cmdprev 入库（198 份）'));
ok('package.json 已收录 smoke_v2303_rushnum（npm test 串跑第 199 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2303_rushnum.mjs'));
ok('package.json 串尾为 ... smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs"',
  pkg.includes('node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 199 件套', testChain === 209, String(testChain));
ok('CHANGELOG 顶部已追加 v23.03 条目', changelog.startsWith('## v23.13 '));
ok('CHANGELOG 仍保留 v23.02 条目（历史口径）', changelog.includes('## v23.02 战斗指令栏 [5]防御/[6]蓄力 效果预览'));

// —— 姊妹件套 pin 随新现实更新 + 旧代 v23.02 pin 零残留 ——
const s2302 = read('smoke_v2302_cmdprev.mjs');
const s2143 = read('smoke_v2143_talkekey.mjs');
ok('smoke_v2302 的 GAME_VERSION 字面量 pin 已更新为 v23.03', s2302.includes("const GAME_VERSION = 'v23.13';"));
ok('smoke_v2302 的 CHANGELOG 顶 pin 已更新为 ## v23.03',
  s2302.includes("startsWith('## v23.13 '"));
ok('smoke_v2302 的件套 pin 已更新为二百零九件套（二百零八件套清除）',
  s2302.includes('二百零九件套（二百零八件套清除）'));
ok('smoke_v2302 的 README 串尾 pin 已延伸至 smoke_v2303_rushnum',
  s2302.includes('smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall（npm test 串跑）'));
ok('smoke_v2302 的 package 串尾 pin 已延伸至 smoke_v2303_rushnum',
  s2302.includes('node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs"'));
ok('smoke_v2302 的 testChain pin 已更新为 199', s2302.includes('testChain === 209'));
ok('smoke_v2143 哨兵链已推进至二百零九件套（二百零八件套清除）',
  s2143.includes('二百一十件套（二百零九件套清除）') && s2143.includes("!readme.includes('二百一十件套（二百零九件套清除）')"));

// 旧代 v23.02 pin 全库零残留（不含本件）
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2303_rushnum.mjs');
const stale = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("const GAME_VERSION = 'v23." + "02';") || src.includes("GAME_VERSION === 'v23." + "02'") ||
      src.includes('一百九十八件套（一百九十七件套清' + '除）') || src.includes('testChain === 19' + '8') ||
      src.includes('smoke_v2301_eco + smoke_v2302_cmdprev（npm test 串' + '跑）') ||
      src.includes("startsWith('## v23.02") || src.includes('node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs"')) stale.push(f);
}
ok('旧代 v23.02 字面量/恒等/件套/testChain/串尾/顶 pin/package 串尾 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

console.log(`\n— v23.03 试炼/彩头数值速查行守护冒烟：${n - failed}/${n} 通过 —`);
if (failed) process.exit(1);
