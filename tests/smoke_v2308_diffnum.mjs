// smoke_v2308_diffnum.mjs —— v23.08 README「数值速查」难度/倍率行守护（文档整理·数值说明·同源口径）
// 承 v21.10-v23.07 冒烟入库先例：版本锚点 + 源级落位（data.js v23.08 注释/GAME_VERSION 字面量 v23.08/
// v23.07 历史注释保留零 v23.07 字面量残留）+ 难度契约（DIFFS 两档逐值 + DIFF_SCALE hp/atk/def 逐值 +
// battle.startBattle 困难结算源级派生 + menus 创建页/状态页倍率标注 + hud ⚡ 角标 + ACH_LIST hardtrue
// 判定源级落位）+ README 数值速查「难度 / 倍率」行落位（与困难结算/创建页/状态页/HUD/成就判定同源口径，
// 零裸字面量）+ README/package.json/CHANGELOG 同步（冒烟二百一十九件套（二百一十八件套清除）/串尾/入库 204
// 份/顶 pin）+ 姊妹件套 pin（smoke_v2307 随新现实更新）+ 哨兵链领先一位（205 口径）+
// 旧代 v23.07 pin 全库零残留。
import { GAME_VERSION, DIFFS, DIFF_SCALE } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v23.08 难度/倍率数值速查行守护冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v23.07 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v23.07（本版守 v23.08）', !!_gv && (_gv[0] > 23 || (_gv[0] === 23 && _gv[1] >= 8)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v23.08 版本注释', dataSrc.includes('// v23.08 文档整理·数值说明·同源口径：README「数值速查」补「难度 / 倍率」行'));
ok('data.js GAME_VERSION 字面量已为 v23.08（旧 v23.07 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23." + "07';"));
ok('data.js 仍保留 v23.07 历史注释（强敌/变身机制数值速查行注释未动）', dataSrc.includes('// v23.07 文档整理·数值说明·同源口径：README「数值速查」补「强敌 / 变身机制」行'));

// —— 难度常量逐值（单一数据源）——
ok('DIFFS 两档：普通 / 困难', Array.isArray(DIFFS) && DIFFS.length === 2 && DIFFS[0] === '普通' && DIFFS[1] === '困难');
ok('DIFF_SCALE 逐值：hp 1.35 / atk 1.15 / def 1.12（只加血攻防）',
  DIFF_SCALE && DIFF_SCALE.hp === 1.35 && DIFF_SCALE.atk === 1.15 && DIFF_SCALE.def === 1.12 && Object.keys(DIFF_SCALE).length === 3);
ok('data.js DIFFS 字面量逐字（[] 无空格）', dataSrc.includes("const DIFFS=['普通','困难'];"));
ok('data.js DIFF_SCALE 字面量逐字', dataSrc.includes('const DIFF_SCALE={ hp:1.35, atk:1.15, def:1.12 };'));

// —— 困难结算/标注/角标/成就 源级落位（与 README 行同读一份源）——
const battleSrc = read('../js/battle.js');
ok('battle.startBattle 困难结算源级落位（S.G.diff 分支 + DIFF_SCALE 三端乘算）',
  battleSrc.includes('if (S.G.diff) {') &&
  battleSrc.includes('S.enemy.hpMax = Math.round(S.enemy.hpMax * DIFF_SCALE.hp);') &&
  battleSrc.includes('S.enemy.atk = Math.round(S.enemy.atk * DIFF_SCALE.atk);') &&
  battleSrc.includes('S.enemy.def = Math.round(S.enemy.def * DIFF_SCALE.def);'));
const menusSrc = read('../js/view/menus.js');
ok('menus 状态页 I「[困难 · 魔物HP×… 攻×… 防×…]」标注源级落位',
  menusSrc.includes('[困难 · 魔物HP×${DIFF_SCALE.hp} 攻×${DIFF_SCALE.atk} 防×${DIFF_SCALE.def}]'));
ok('menus 创建页倍率标注源级落位（（困难：魔物 HP×1.35 / 攻×1.15 / 防×1.12，挑战性提升））',
  menusSrc.includes('（困难：魔物 HP×${DIFF_SCALE.hp} / 攻×${DIFF_SCALE.atk} / 防×${DIFF_SCALE.def}，挑战性提升）'));
const hudSrc = read('../js/view/hud.js');
ok('hud 地图行 ⚡ 角标源级落位（hero.diff 时）', hudSrc.includes("hero.diff ? ' ⚡' : ''"));
ok('ACH_LIST hardtrue「逆风行灯」判定源级落位（g.trueBoss && g.diff===1）',
  dataSrc.includes("name:'逆风行灯'") && dataSrc.includes('ok:g=>!!(g.trueBoss && g.diff===1)'));

// —— README 数值速查「难度 / 倍率」行落位（全部由 data.js 派生、与困难结算/标注/角标/成就同源）——
ok('README 难度行开头逐字（两档难度 DIFFS 单一数据源）', readme.includes('| 难度 / 倍率 | 两档难度（`DIFFS`）：普通 / 困难——创建页 `←→/↑↓` 选档'));
ok('README 难度行 困难倍率派生式逐字', readme.includes('困难档全魔物 HP×1.35 · 攻×1.15 · 防×1.12（`DIFF_SCALE` 单一数据源'));
ok('README 难度行 三端标注/角标/成就同源逐字', readme.includes('成就「逆风行灯」（`ACH_LIST.hardtrue`，判定 `g.trueBoss && g.diff===1`）同读一份源'));
ok('README 难度行 常量为 (v23.08 补录)', readme.includes('（v23.08 补录） | `DIFFS` `DIFF_SCALE` |'));
ok('README 难度行位于强敌 / 变身机制行之后（表尾追加）',
  readme.indexOf('| 难度 / 倍率 |') > readme.indexOf('| 强敌 / 变身机制 |'));

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树串尾已延伸至 smoke_v2308_diffnum（v2307 后接 v2308）',
  readme.includes('smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll（npm test 串跑）'));
ok('README 旧串尾零残留（v2307 后无串尾收口）',
  !readme.includes('smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum（npm test 串' + '跑）'));
ok('README 件套口径为二百一十九件套（二百一十八件套清除）且旧 203 口径零残留',
  readme.includes('冒烟二百一十九件套（二百一十八件套清除）') && !readme.includes('冒烟二百零三件套（二百零二件套清' + '除）'));
ok('README 不含哨兵领先一位（二百一十九件套（二百一十八件套清除））',
  !readme.includes('二百二十件套（二百一十九件套清除）'));
ok('README 含 v23.08 守护描述（难度/倍率数值速查行守护）',
  readme.includes('v23.08 起含「难度 / 倍率」数值速查行守护'));
ok('README 含 smoke_v2308_diffnum 入库（204 份）', readme.includes('smoke_v2308_diffnum 入库（204 份）'));
ok('README 仍保留 v23.07 守护描述（历史口径）', readme.includes('v23.07 起含「强敌 / 变身机制」数值速查行守护'));
ok('README 仍保留 smoke_v2307_bossnum 入库（203 份）历史口径', readme.includes('smoke_v2307_bossnum 入库（203 份）'));
ok('package.json 已收录 smoke_v2308_diffnum（npm test 串跑第 204 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2308_diffnum.mjs'));
ok('package.json 串尾为 ... smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs && node tests/smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs && node tests/smoke_v2395_shopscroll.mjs"',
  pkg.includes('node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs && node tests/smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs && node tests/smoke_v2395_shopscroll.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 204 件套', testChain === 219, String(testChain));
ok('CHANGELOG 顶部已追加 v23.08 条目', changelog.startsWith('## v23.95 '));
ok('CHANGELOG 仍保留 v23.07 条目（历史口径）', changelog.includes('## v23.07 README「数值速查」补「强敌 / 变身机制」行'));

// —— 姊妹件套 pin 随新现实更新 + 旧代 v23.07 pin 零残留 ——
const s2307 = read('smoke_v2307_bossnum.mjs');
const s2143 = read('smoke_v2143_talkekey.mjs');
ok('smoke_v2307 的 GAME_VERSION 字面量 pin 已更新为 v23.08', s2307.includes("const GAME_VERSION = 'v23.95';"));
ok('smoke_v2307 的 CHANGELOG 顶 pin 已更新为 ## v23.08',
  s2307.includes("startsWith('## v23.95 "));
ok('smoke_v2307 的件套 pin 已更新为二百一十九件套（二百一十八件套清除）',
  s2307.includes('二百一十九件套（二百一十八件套清除）'));
ok('smoke_v2307 的 README 串尾 pin 已延伸至 smoke_v2308_diffnum',
  s2307.includes('smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll（npm test 串跑）'));
ok('smoke_v2307 的 package 串尾 pin 已延伸至 smoke_v2308_diffnum',
  s2307.includes('node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs && node tests/smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs && node tests/smoke_v2395_shopscroll.mjs"'));
ok('smoke_v2307 的 testChain pin 已更新为 204', s2307.includes('testChain === 219'));
ok('smoke_v2307 的版本锚已越过 v23.07 口径（>= 7 对 v23.08 恒真）', s2307.includes('_gv[1] >= 7'));
ok('smoke_v2143 哨兵链已推进至二百一十九件套（二百一十八件套清除）',
  s2143.includes('二百二十件套（二百一十九件套清除）') && s2143.includes("!readme.includes('二百二十件套（二百一十九件套清除）')"));

// 旧代 v23.07 pin 全库零残留（不含本件）
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2308_diffnum.mjs');
const stale = [];
const stalePats = [
  /'v23\.07'/, /二百零三件套（二百零二件套清.*?除）/,
  /testChain === 203/, /smoke_v2307_bossnum（npm test 串跑）/,
  /startsWith\('## v23\.07/, /smoke_v2307_bossnum\.mjs"/, /冒烟二百零三件套（二百零二件套清除）/
];
for (const f of allTests) {
  const src = read(f);
  if (stalePats.some((re) => re.test(src))) stale.push(f);
}
ok('旧代 v23.07 字面量/恒等/件套/testChain/串尾/顶 pin/package 串尾 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

console.log(`\n— v23.08 难度/倍率数值速查行守护冒烟：${n - failed}/${n} 通过 —`);
if (failed) process.exit(1);
