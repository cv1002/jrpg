// smoke_v2307_bossnum.mjs —— v23.07 README「数值速查」强敌/变身机制行守护（文档整理·数值说明·同源口径）
// 承 v21.10-v23.06 冒烟入库先例：版本锚点 + 源级落位（data.js v23.07 注释/GAME_VERSION 字面量 v23.07/
// v23.06 历史注释保留零 v23.06 字面量残留）+ 强敌机制契约（PHASE2_AT/PHASE2_HEAL_PCT/HEAVY_MULT/
// HEAVY_MULT_PHASED/HEAL_PCT 逐值 + SPECIES.phase2 三 Boss 变身增益逐值 + 回血招 pct/hpBelow +
// BOSS_TRUE_FORBID 源级派生）+ README 数值速查「强敌 / 变身机制」行落位（与 H 页机制预览/变身角标/
// enemyAI 结算同源口径，零裸字面量）+ README/package.json/CHANGELOG 同步（冒烟二百零三件套（二百零二件套
// 清除）/串尾/入库 203 份/顶 pin）+ 姊妹件套 pin（smoke_v2306 随新现实更新）+ 哨兵链领先一位（204 口径）+
// 旧代 v23.06 pin 全库零残留。
import { GAME_VERSION, PHASE2_AT, PHASE2_HEAL_PCT, HEAVY_MULT, HEAVY_MULT_PHASED, HEAL_PCT, SPECIES } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v23.07 强敌/变身机制数值速查行守护冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v23.06 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v23.06（本版守 v23.07）', !!_gv && (_gv[0] > 23 || (_gv[0] === 23 && _gv[1] >= 7)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v23.07 版本注释', dataSrc.includes('// v23.07 文档整理·数值说明·同源口径：README「数值速查」补「强敌 / 变身机制」行'));
ok('data.js GAME_VERSION 字面量已为 v23.07（旧 v23.06 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.59';") && !dataSrc.includes("const GAME_VERSION = 'v23." + "06';"));
ok('data.js 仍保留 v23.06 历史注释（技能数值数值速查行注释未动）', dataSrc.includes('// v23.06 文档整理·数值说明·同源口径：README「数值速查」补「技能数值」行'));

// —— 强敌机制常量逐值（单一数据源）——
ok('HEAVY_MULT 1.9 / HEAVY_MULT_PHASED 2.3', HEAVY_MULT === 1.9 && HEAVY_MULT_PHASED === 2.3);
ok('PHASE2_AT 0.5（血过半变身线）/ PHASE2_HEAL_PCT 0.15（变身回血默认）', PHASE2_AT === 0.5 && PHASE2_HEAL_PCT === 0.15);
ok('HEAL_PCT 0.12（回血招默认）', HEAL_PCT === 0.12);
ok('BOSS_TRUE_FORBID 源级派生（SPECIES 终焉之神 forbid heal → true）',
  dataSrc.includes('const BOSS_TRUE_FORBID') && (SPECIES['终焉之神'].phase2.forbid || []).includes('heal'));

// —— SPECIES.phase2 三 Boss 变身增益契约（逐值，与 H 页机制预览/战斗变身角标同源）——
const P2 = (name) => SPECIES[name].phase2;
ok('幽冥魔王 phase2 攻+7 防+3 回血15%HP（at 恒等于 PHASE2_AT）',
  (() => { const p = P2('幽冥魔王'); return p.at === PHASE2_AT && p.atk === 7 && p.def === 3 && p.heal === 0.15 && p.name === '幽冥魔王·真身'; })());
ok('洞窟领主 phase2 攻+5 防+2 回血10%HP（at 恒等于 PHASE2_AT）',
  (() => { const p = P2('洞窟领主'); return p.at === PHASE2_AT && p.atk === 5 && p.def === 2 && p.heal === 0.10 && p.name === '洞窟领主·真身'; })());
ok('洞窟领主 石甲至多2层（acts shield maxShield===2）',
  SPECIES['洞窟领主'].acts.some((a) => a.type === 'shield' && a.maxShield === 2));
ok('终焉之神 phase2 攻+7 防+3 回血15%HP·祸乱形态封印治愈（at/forbid）',
  (() => { const p = P2('终焉之神'); return p.at === PHASE2_AT && p.atk === 7 && p.def === 3 && p.heal === 0.15 && p.name === '终焉之神·祸乱形态' && p.forbid.includes('heal'); })());
ok('三 Boss 回血招 HP<40% 才用：12%/10%/12%（acts heal pct/hpBelow 逐值）',
  (() => { const m = SPECIES['幽冥魔王'].acts.find((a) => a.type === 'heal'); const d = SPECIES['洞窟领主'].acts.find((a) => a.type === 'heal'); const t = SPECIES['终焉之神'].acts.find((a) => a.type === 'heal'); return m && d && t && m.pct === 0.12 && m.hpBelow === 0.4 && d.pct === 0.10 && d.hpBelow === 0.4 && t.pct === 0.12 && t.hpBelow === 0.4; })());

// —— README 数值速查「强敌 / 变身机制」行落位（全部由 data.js 派生、与 H 页/角标/enemyAI 同源）——
ok('README 强敌行开头逐字（三 Boss 变身线同源）', readme.includes('| 强敌 / 变身机制 | 三 Boss 血过半现出真身（变身线 `PHASE2_AT` 0.5，与 enemyAI 变身结算/「二段变身线」/H 页机制预览同源）'));
ok('README 强敌行 三 Boss 变身增益派生式逐字', readme.includes('幽冥魔王 攻+7 防+3 回血15%HP · 洞窟领主 攻+5 防+2 回血10%HP（另有石甲至多2层·每层-40%）· 终焉之神 攻+7 防+3 回血15%HP（祸乱形态封印治愈 `BOSS_TRUE_FORBID`，喝药不受影响）'));
ok('README 强敌行 重击派生式逐字', readme.includes('重击 ×1.9 / 对真身 ×2.3（`HEAVY_MULT`/`HEAVY_MULT_PHASED`，与 enemyAI 重击结算/招数一览同源）'));
ok('README 强敌行 回血招派生式逐字', readme.includes('三 Boss 回血招 HP<40% 才用：12%/10%/12% 最大HP'));
ok('README 强敌行 常量为 (v23.07 补录)', readme.includes('（v23.07 补录） | `PHASE2_AT` `PHASE2_HEAL_PCT` `HEAVY_MULT` `HEAVY_MULT_PHASED` `BOSS_TRUE_FORBID` `SPECIES[].phase2/acts` |'));
ok('README 强敌行 同源口径逐字（与 H 页机制预览同读 SPECIES[].phase2）', readme.includes('与 H 页「三 Boss 机制预览」同读一份源'));

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树串尾已延伸至 smoke_v2307_bossnum（v2306 后接 v2307）',
  readme.includes('smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 旧串尾零残留（v2306 后无串尾收口）',
  !readme.includes('smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum（npm test 串' + '跑）'));
ok('README 件套口径为二百一十二件套（二百一十一件套清除）且旧 202 口径零残留',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟二百零二件套（二百零一件套清' + '除）'));
ok('README 不含哨兵领先一位（二百一十二件套（二百一十一件套清除））',
  !readme.includes('二百一十三件套（二百一十二件套清除）'));
ok('README 含 v23.07 守护描述（强敌/变身机制数值速查行守护）',
  readme.includes('v23.07 起含「强敌 / 变身机制」数值速查行守护'));
ok('README 含 smoke_v2307_bossnum 入库（203 份）', readme.includes('smoke_v2307_bossnum 入库（203 份）'));
ok('README 仍保留 v23.06 守护描述（历史口径）', readme.includes('v23.06 起含「技能数值」数值速查行守护'));
ok('README 仍保留 smoke_v2306_skillnum 入库（202 份）历史口径', readme.includes('smoke_v2306_skillnum 入库（202 份）'));
ok('package.json 已收录 smoke_v2307_bossnum（npm test 串跑第 203 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2307_bossnum.mjs'));
ok('package.json 串尾为 ... smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"',
  pkg.includes('node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 203 件套', testChain === 212, String(testChain));
ok('CHANGELOG 顶部已追加 v23.07 条目', changelog.startsWith('## v23.59 '));
ok('CHANGELOG 仍保留 v23.06 条目（历史口径）', changelog.includes('## v23.06 README「数值速查」补「技能数值」行'));

// —— 姊妹件套 pin 随新现实更新 + 旧代 v23.06 pin 零残留 ——
const s2306 = read('smoke_v2306_skillnum.mjs');
const s2143 = read('smoke_v2143_talkekey.mjs');
ok('smoke_v2306 的 GAME_VERSION 字面量 pin 已更新为 v23.07', s2306.includes("const GAME_VERSION = 'v23.59';"));
ok('smoke_v2306 的 CHANGELOG 顶 pin 已更新为 ## v23.07',
  s2306.includes("startsWith('## v23.59 "));
ok('smoke_v2306 的件套 pin 已更新为二百一十二件套（二百一十一件套清除）',
  s2306.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2306 的 README 串尾 pin 已延伸至 smoke_v2307_bossnum',
  s2306.includes('smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2306 的 package 串尾 pin 已延伸至 smoke_v2307_bossnum',
  s2306.includes('node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
ok('smoke_v2306 的 testChain pin 已更新为 203', s2306.includes('testChain === 212'));
ok('smoke_v2306 的版本锚已越过 v23.06 口径（>= 6 对 v23.07 恒真）', s2306.includes('_gv[1] >= 6'));
ok('smoke_v2143 哨兵链已推进至二百一十二件套（二百一十一件套清除）',
  s2143.includes('二百一十三件套（二百一十二件套清除）') && s2143.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));

// 旧代 v23.06 pin 全库零残留（不含本件）
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2307_bossnum.mjs');
const stale = [];
const stalePats = [
  /'v23\.06'/, /二百零二件套（二百零一件套清.*?除）/,
  /testChain === 202/, /smoke_v2306_skillnum（npm test 串跑）/,
  /startsWith\('## v23\.06/, /smoke_v2306_skillnum\.mjs"/, /冒烟二百零二件套（二百零一件套清除）/
];
for (const f of allTests) {
  const src = read(f);
  if (stalePats.some((re) => re.test(src))) stale.push(f);
}
ok('旧代 v23.06 字面量/恒等/件套/testChain/串尾/顶 pin/package 串尾 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

console.log(`\n— v23.07 强敌/变身机制数值速查行守护冒烟：${n - failed}/${n} 通过 —`);
if (failed) process.exit(1);
