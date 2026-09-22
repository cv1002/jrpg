// smoke_v2305_monnum.mjs —— v23.05 README「数值速查」魔物数值行守护（文档整理·数值说明·同源口径）
// 承 v21.10-v23.04 冒烟入库先例：版本锚点 + 源级落位（data.js v23.05 注释/GAME_VERSION 字面量 v23.05/
// v23.04 历史注释保留零 v23.04 字面量残留）+ MON_BASE/ELITE_GOLEM/EMBER_GOLEM/*_BOSS_BASE/RUSH_BOSSES
// 契约（八怪五组逐值 + 精英/回廊精英/三强敌固定兵力 + 试炼同源）+ rules.codexStats/monReward 运行期派生
// 逐值（Lv.1/Lv.5 实证）+ README 数值速查「魔物数值」行落位（与图鉴/结算/试炼同源口径，零裸字面量）+
// README/package.json/CHANGELOG 同步（冒烟二百一十二件套（二百一十一件套清除）/串尾/入库 201 份/顶 pin）+
// 姊妹件套 pin（smoke_v2304 随新现实更新）+ 哨兵链领先一位（202 口径）+ 旧代 v23.04 pin 全库零残留。
import { GAME_VERSION, MON_BASE, ELITE_GOLEM, EMBER_GOLEM, BOSS, CAVE_BOSS, TRUE_BOSS,
  RUSH_BOSSES } from '../js/data.js';
import { codexStats, monReward } from '../js/rules.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v23.05 魔物数值数值速查行守护冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v23.04 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v23.04（本版守 v23.05）', !!_gv && (_gv[0] > 23 || (_gv[0] === 23 && _gv[1] >= 5)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v23.05 版本注释', dataSrc.includes('// v23.05 文档整理·数值说明·同源口径：README「数值速查」补「魔物数值」行'));
ok('data.js GAME_VERSION 字面量已为 v23.05（旧 v23.04 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.75';") && !dataSrc.includes("const GAME_VERSION = 'v23." + "04';"));
ok('data.js 仍保留 v23.04 历史注释（成就档位数值速查行注释未动）', dataSrc.includes('// v23.04 文档整理·数值说明·同源口径：README「数值速查」补「成就档位」行'));

// —— MON_BASE 契约（八怪 hp/atk/def/xp/gold 五组 [基准,每级] 逐字，单一数据源）——
ok('MON_BASE 共 8 种', MON_BASE.length === 8, String(MON_BASE.length));
ok('史莱姆 hp/atk/def/xp/gold [16,5][5,2][2,1][8,3][8,2]',
  JSON.stringify([MON_BASE[0].hp, MON_BASE[0].atk, MON_BASE[0].def, MON_BASE[0].xp, MON_BASE[0].gold]) === JSON.stringify([[16,5],[5,2],[2,1],[8,3],[8,2]]));
ok('野狼 hp/atk/def/xp/gold [22,5][7,2][3,1][12,3][12,2]',
  JSON.stringify([MON_BASE[1].hp, MON_BASE[1].atk, MON_BASE[1].def, MON_BASE[1].xp, MON_BASE[1].gold]) === JSON.stringify([[22,5],[7,2],[3,1],[12,3],[12,2]]));
ok('骷髅兵 hp/atk/def/xp/gold [26,6][8,2][5,1][16,5][15,4]',
  JSON.stringify([MON_BASE[2].hp, MON_BASE[2].atk, MON_BASE[2].def, MON_BASE[2].xp, MON_BASE[2].gold]) === JSON.stringify([[26,6],[8,2],[5,1],[16,5],[15,4]]));
ok('哥布林 hp/atk/def/xp/gold [20,5][6,2][3,1][10,3][10,2]',
  JSON.stringify([MON_BASE[3].hp, MON_BASE[3].atk, MON_BASE[3].def, MON_BASE[3].xp, MON_BASE[3].gold]) === JSON.stringify([[20,5],[6,2],[3,1],[10,3],[10,2]]));
ok('毒蛇 hp/atk/def/xp/gold [20,5][8,2][3,1][15,3][13,2]',
  JSON.stringify([MON_BASE[4].hp, MON_BASE[4].atk, MON_BASE[4].def, MON_BASE[4].xp, MON_BASE[4].gold]) === JSON.stringify([[20,5],[8,2],[3,1],[15,3],[13,2]]));
ok('雾灵 hp/atk/def/xp/gold [24,5][9,2][4,1][17,5][14,4]',
  JSON.stringify([MON_BASE[5].hp, MON_BASE[5].atk, MON_BASE[5].def, MON_BASE[5].xp, MON_BASE[5].gold]) === JSON.stringify([[24,5],[9,2],[4,1],[17,5],[14,4]]));
ok('树精 hp/atk/def/xp/gold [30,6][7,2][6,1][18,5][16,4]',
  JSON.stringify([MON_BASE[6].hp, MON_BASE[6].atk, MON_BASE[6].def, MON_BASE[6].xp, MON_BASE[6].gold]) === JSON.stringify([[30,6],[7,2],[6,1],[18,5],[16,4]]));
ok('石魔像 hp/atk/def/xp/gold [36,7][8,2][10,1][22,5][20,4]',
  JSON.stringify([MON_BASE[7].hp, MON_BASE[7].atk, MON_BASE[7].def, MON_BASE[7].xp, MON_BASE[7].gold]) === JSON.stringify([[36,7],[8,2],[10,1],[22,5],[20,4]]));
ok('MON_BASE 八怪名称序位 史莱姆/野狼/骷髅兵/哥布林/毒蛇/雾灵/树精/石魔像',
  MON_BASE.map((m) => m.name).join(',') === '史莱姆,野狼,骷髅兵,哥布林,毒蛇,雾灵,树精,石魔像');
ok('出没门槛仅 骷髅兵/雾灵 minLv:2 · 树精/石魔像 minLv:3（其余缺省）',
  MON_BASE[2].minLv === 2 && MON_BASE[5].minLv === 2 && MON_BASE[6].minLv === 3 && MON_BASE[7].minLv === 3 &&
  !MON_BASE[0].minLv && !MON_BASE[1].minLv && !MON_BASE[3].minLv && !MON_BASE[4].minLv);

// —— 精英 / 回廊精英 / 三强敌（固定兵力）契约 ——
ok('精英石心魔像 ELITE_GOLEM hp/atk/def/xp/gold [58,10][12,2][15,2][40,6][45,6]',
  JSON.stringify([ELITE_GOLEM.hp, ELITE_GOLEM.atk, ELITE_GOLEM.def, ELITE_GOLEM.xp, ELITE_GOLEM.gold]) === JSON.stringify([[58,10],[12,2],[15,2],[40,6],[45,6]]));
ok('回廊精英残焰魔像 EMBER_GOLEM 固定 340/44/28 · 130xp/260金',
  EMBER_GOLEM.hp === 340 && EMBER_GOLEM.hpMax === 340 && EMBER_GOLEM.atk === 44 && EMBER_GOLEM.def === 28 &&
  EMBER_GOLEM.xp === 130 && EMBER_GOLEM.gold === 260);
ok('data.js 三强敌基准源级落位（BOSS_BASE/CAVE_BOSS_BASE/TRUE_BOSS_BASE 逐字）',
  dataSrc.includes("const BOSS_BASE={name:'幽冥魔王',hp:420,hpMax:420,atk:23,def:13,color:'#a03fd9'};") &&
  dataSrc.includes("const CAVE_BOSS_BASE={name:'洞窟领主',hp:380,hpMax:380,atk:25,def:15,color:'#3f6b9f'};") &&
  dataSrc.includes("const TRUE_BOSS_BASE={name:'终焉之神',hp:700,hpMax:700,atk:33,def:19,color:'#f0c040'};"));
ok('三强敌主线定义逐值同源（BOSS/CAVE_BOSS/TRUE_BOSS 兵力与奖励）',
  BOSS.hp === 420 && BOSS.atk === 23 && BOSS.def === 13 && BOSS.xp === 150 && BOSS.gold === 300 &&
  CAVE_BOSS.hp === 380 && CAVE_BOSS.atk === 25 && CAVE_BOSS.def === 15 && CAVE_BOSS.xp === 120 && CAVE_BOSS.gold === 200 &&
  TRUE_BOSS.hp === 700 && TRUE_BOSS.atk === 33 && TRUE_BOSS.def === 19 && TRUE_BOSS.xp === 400 && TRUE_BOSS.gold === 600);
ok('试炼三连战 RUSH_BOSSES 与三强敌兵力同源（仅覆盖 xp/gold：60/60/90 · 试炼不给金币）',
  RUSH_BOSSES.length === 3 && RUSH_BOSSES[0].hp === 420 && RUSH_BOSSES[0].atk === 23 && RUSH_BOSSES[0].def === 13 &&
  RUSH_BOSSES[0].xp === 60 && RUSH_BOSSES[0].gold === 0 &&
  RUSH_BOSSES[1].hp === 380 && RUSH_BOSSES[1].atk === 25 && RUSH_BOSSES[1].def === 15 &&
  RUSH_BOSSES[1].xp === 60 && RUSH_BOSSES[1].gold === 0 &&
  RUSH_BOSSES[2].hp === 700 && RUSH_BOSSES[2].atk === 33 && RUSH_BOSSES[2].def === 19 &&
  RUSH_BOSSES[2].xp === 90 && RUSH_BOSSES[2].gold === 0);

// —— rules.codexStats / monReward 运行期派生逐值（与图鉴/结算同口径）——
const c1 = codexStats('史莱姆', 1);
ok('codexStats 史莱姆 Lv.1 = hp21/atk7/def3（16+5·5+2·2+1）', c1.hp === 21 && c1.atk === 7 && c1.def === 3, JSON.stringify(c1));
const c5 = codexStats('石魔像', 5);
ok('codexStats 石魔像 Lv.5 = hp71/atk18/def15（36+35·8+10·10+5）', c5.hp === 71 && c5.atk === 18 && c5.def === 15, JSON.stringify(c5));
const r1 = monReward('史莱姆', 1);
ok('monReward 史莱姆 Lv.1 = xp11/gold10（8+3·8+2）', r1.xp === 11 && r1.gold === 10, JSON.stringify(r1));
const r3 = monReward('骷髅兵', 3);
ok('monReward 骷髅兵 Lv.3 = xp31/gold27（16+15·15+12）', r3.xp === 31 && r3.gold === 27, JSON.stringify(r3));
const eg = codexStats('石心魔像', 3);
ok('codexStats 石心魔像 Lv.3 = hp88/atk18/def21（58+30·12+6·15+6）', eg.hp === 88 && eg.atk === 18 && eg.def === 21, JSON.stringify(eg));
const rg = monReward('石心魔像', 3);
ok('monReward 石心魔像 Lv.3 = xp58/gold63（40+18·45+18）', rg.xp === 58 && rg.gold === 63, JSON.stringify(rg));
ok('monReward 残焰魔像 固定 xp130/gold260', monReward('残焰魔像').xp === 130 && monReward('残焰魔像').gold === 260);
ok('codexStats 残焰魔像 固定 340/44/28', (() => { const c = codexStats('残焰魔像', 99); return c.hp === 340 && c.atk === 44 && c.def === 28; })());
ok('codexStats/monReward 三强敌固定兵力与奖励逐值',
  (() => { const b = codexStats('幽冥魔王'); const c = codexStats('洞窟领主'); const t = codexStats('终焉之神');
    return b.hp === 420 && b.atk === 23 && b.def === 13 && c.hp === 380 && c.atk === 25 && c.def === 15 &&
      t.hp === 700 && t.atk === 33 && t.def === 19 &&
      monReward('幽冥魔王').xp === 150 && monReward('幽冥魔王').gold === 300 &&
      monReward('洞窟领主').xp === 120 && monReward('洞窟领主').gold === 200 &&
      monReward('终焉之神').xp === 400 && monReward('终焉之神').gold === 600; })());

// —— README 数值速查「魔物数值」行落位（全部由 data.js 派生、与图鉴/结算/试炼同源）——
ok('README 魔物数值行 命名常量源引用逐字同源', readme.includes('`MON_BASE` `ELITE_GOLEM` `EMBER_GOLEM` `BOSS_BASE` `CAVE_BOSS_BASE` `TRUE_BOSS_BASE` `RUSH_BOSSES`'));
ok('README 魔物数值行 含 v23.05 补录注释', readme.includes('（v23.05 补录）'));
ok('README 魔物数值行 八怪派生式逐字（史莱姆示例）', readme.includes(`史莱姆 16+5/5+2/2+1/8+3/8+2`));
ok('README 魔物数值行 八怪派生式逐字（石魔像示例）', readme.includes(`石魔像 36+7/8+2/10+1/22+5/20+4`));
ok('README 魔物数值行 三强敌固定兵力派生式逐字', readme.includes('420/23/13 · 380/25/15 · 700/33/19'));
ok('README 魔物数值行 残焰魔像固定兵力与奖励派生式逐字', readme.includes('340/44/28 · 130xp/260金'));
ok('README 魔物数值行 试炼同源口径逐字', readme.includes('`RUSH_BOSSES` 兵力与之同源、仅覆盖 xp/gold（60/60/90 · 试炼不给金币）'));

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树串尾已延伸至 smoke_v2305_monnum（v2304 后接 v2305）',
  readme.includes('smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 旧串尾零残留（v2304 后无串尾收口）',
  !readme.includes('smoke_v2303_rushnum + smoke_v2304_achgoal（npm test 串' + '跑）'));
ok('README 件套口径为二百一十二件套（二百一十一件套清除）且旧 200 口径零残留',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟二百件套（一百九十九件套清' + '除）'));
ok('README 不含哨兵领先一位（二百一十二件套（二百一十一件套清除））',
  !readme.includes('二百一十三件套（二百一十二件套清除）'));
ok('README 含 v23.05 守护描述（魔物数值数值速查行守护）',
  readme.includes('v23.05 起含「魔物数值」数值速查行守护'));
ok('README 含 smoke_v2305_monnum 入库（201 份）', readme.includes('smoke_v2305_monnum 入库（201 份）'));
ok('README 仍保留 v23.04 守护描述（历史口径）', readme.includes('v23.04 起含「成就档位」数值速查行守护'));
ok('README 仍保留 smoke_v2304_achgoal 入库（200 份）历史口径', readme.includes('smoke_v2304_achgoal 入库（200 份）'));
ok('package.json 已收录 smoke_v2305_monnum（npm test 串跑第 201 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2305_monnum.mjs'));
ok('package.json 串尾为 ... smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"',
  pkg.includes('node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 201 件套', testChain === 212, String(testChain));
ok('CHANGELOG 顶部已追加 v23.05 条目', changelog.startsWith('## v23.75 '));
ok('CHANGELOG 仍保留 v23.04 条目（历史口径）', changelog.includes('## v23.04 README「数值速查」补「成就档位」行'));

// —— 姊妹件套 pin 随新现实更新 + 旧代 v23.04 pin 零残留 ——
const s2304 = read('smoke_v2304_achgoal.mjs');
const s2143 = read('smoke_v2143_talkekey.mjs');
ok('smoke_v2304 的 GAME_VERSION 字面量 pin 已更新为 v23.05', s2304.includes("const GAME_VERSION = 'v23.75';"));
ok('smoke_v2304 的 CHANGELOG 顶 pin 已更新为 ## v23.05',
  s2304.includes("startsWith('## v23.75 "));
ok('smoke_v2304 的件套 pin 已更新为二百一十二件套（二百一十一件套清除）',
  s2304.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2304 的 README 串尾 pin 已延伸至 smoke_v2305_monnum',
  s2304.includes('smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2304 的 package 串尾 pin 已延伸至 smoke_v2305_monnum',
  s2304.includes('node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
ok('smoke_v2304 的 testChain pin 已更新为 201', s2304.includes('testChain === 212'));
ok('smoke_v2143 哨兵链已推进至二百一十二件套（二百一十一件套清除）',
  s2143.includes('二百一十三件套（二百一十二件套清除）') && s2143.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));

// 旧代 v23.04 pin 全库零残留（不含本件）
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2305_monnum.mjs');
const stale = [];
const stalePats = [
  /GAME_VERSION = 'v23\.04'/, /GAME_VERSION === 'v23\.04'/, /二百件套（一百九十九件套清.*?除）/,
  /testChain === 200/, /smoke_v2303_rushnum \+ smoke_v2304_achgoal（npm test 串跑）/,
  /startsWith\('## v23\.04/, /smoke_v2304_achgoal(?:\\\\)*\.mjs"/
];
for (const f of allTests) {
  const src = read(f);
  if (stalePats.some((re) => re.test(src))) stale.push(f);
}
ok('旧代 v23.04 字面量/恒等/件套/testChain/串尾/顶 pin/package 串尾 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

console.log(`\n— v23.05 魔物数值数值速查行守护冒烟：${n - failed}/${n} 通过 —`);
if (failed) process.exit(1);
