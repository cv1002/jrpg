// smoke_v2304_achgoal.mjs —— v23.04 README「数值速查」成就档位行守护（文档整理·数值说明·同源口径）
// 承 v21.10-v23.03 冒烟入库先例：版本锚点 + 源级落位（data.js v23.04 注释/GAME_VERSION 字面量 v23.04/
// v23.03 历史注释保留零 v23.03 字面量残留）+ 十三线档位常量契约（等级/金币/讨伐/时长/掉落/药水/灵药/
// 酿造/蘑菇/探索/图鉴收录/图鉴遭遇/宝箱 逐值 + 封顶派生 MAPS/BESTIARY_TARGET/chestTotal + ACH_LIST 59 项）+
// README 数值速查「成就档位」行落位（与判定/描述/进度同源口径，零裸字面量）+
// README/package.json/CHANGELOG 同步（冒烟二百一十五件套（二百一十四件套清除）/串尾/入库 200 份/顶 pin）+
// 姊妹件套 pin（smoke_v2303 随新现实更新）+ 哨兵链领先一位（201 口径）+ 旧代 v23.03 pin 全库零残留。
import { GAME_VERSION, ACH_LIST, LVL5_GOAL, LVL10_GOAL, LVL12_GOAL, RICH_GOLD, RICH2_GOAL, RICH3_GOAL,
  HUNT_GOAL, HUNT2_GOAL, HUNT3_GOAL, PLAY_TIME_GOAL, PLAY_TIME2_GOAL, PLAY_TIME3_GOAL,
  LUCKY_GOAL, LUCKY2_GOAL, LUCKY3_GOAL, POTIONS_GOAL, POTIONS2_GOAL, POTIONS3_GOAL,
  ELIXIR_STOCK_GOAL, ELIXIR_STOCK2_GOAL, ELIXIR_STOCK3_GOAL, ELIXIR_GOAL, BREW2_GOAL, BREW3_GOAL,
  MUSH_GOAL, MUSH2_GOAL, MUSH3_GOAL, OUTSTEP_GOAL, OUTSTEP2_GOAL, SCHOLAR_GOAL, SCHOLAR2_GOAL,
  SEEN_GOAL, SEEN2_GOAL, TREASURE_GOAL, TREASURE2_GOAL, BESTIARY_TARGET, chestTotal, MAPS,
  POTION_CAP, FIRSTBLOOD_GOAL } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v23.04 成就档位数值速查行守护冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v23.03 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v23.03（本版守 v23.04）', !!_gv && (_gv[0] > 23 || (_gv[0] === 23 && _gv[1] >= 4)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v23.04 版本注释', dataSrc.includes('// v23.04 文档整理·数值说明·同源口径：README「数值速查」补「成就档位」行'));
ok('data.js GAME_VERSION 字面量已为 v23.04（旧 v23.03 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.85';") && !dataSrc.includes("const GAME_VERSION = 'v23." + "03';"));
ok('data.js 仍保留 v23.03 历史注释（试炼/彩头数值速查行注释未动）', dataSrc.includes('// v23.03 文档整理·数值说明·同源口径：README「数值速查」补「试炼 / 彩头」行'));

// —— 十三线档位常量契约（单一数据源：判定/描述/进度同读）——
ok('等级三档 5/10/12（LVL5/10/12_GOAL）', LVL5_GOAL === 5 && LVL10_GOAL === 10 && LVL12_GOAL === 12, `${LVL5_GOAL}/${LVL10_GOAL}/${LVL12_GOAL}`);
ok('金币三档 500/1500/3000（RICH_GOLD/RICH2/RICH3）', RICH_GOLD === 500 && RICH2_GOAL === 1500 && RICH3_GOAL === 3000, `${RICH_GOLD}/${RICH2_GOAL}/${RICH3_GOAL}`);
ok('讨伐三档 10/100/300（HUNT/HUNT2/HUNT3）', HUNT_GOAL === 10 && HUNT2_GOAL === 100 && HUNT3_GOAL === 300, `${HUNT_GOAL}/${HUNT2_GOAL}/${HUNT3_GOAL}`);
ok('时长三档 3600/7200/14400 秒（PLAY_TIME/2/3）', PLAY_TIME_GOAL === 3600 && PLAY_TIME2_GOAL === 7200 && PLAY_TIME3_GOAL === 14400, `${PLAY_TIME_GOAL}/${PLAY_TIME2_GOAL}/${PLAY_TIME3_GOAL}`);
ok('掉落三档 5/30/120（LUCKY/LUCKY2/LUCKY3）', LUCKY_GOAL === 5 && LUCKY2_GOAL === 30 && LUCKY3_GOAL === 120, `${LUCKY_GOAL}/${LUCKY2_GOAL}/${LUCKY3_GOAL}`);
ok('药水三档 20/50/99（POTIONS/2/3 且 99=POTION_CAP）', POTIONS_GOAL === 20 && POTIONS2_GOAL === 50 && POTIONS3_GOAL === 99 && POTION_CAP === 99, `${POTIONS_GOAL}/${POTIONS2_GOAL}/${POTIONS3_GOAL}`);
ok('灵药持有三档 3/8/16（ELIXIR_STOCK/2/3）', ELIXIR_STOCK_GOAL === 3 && ELIXIR_STOCK2_GOAL === 8 && ELIXIR_STOCK3_GOAL === 16, `${ELIXIR_STOCK_GOAL}/${ELIXIR_STOCK2_GOAL}/${ELIXIR_STOCK3_GOAL}`);
ok('酿造三档 1/5/12（ELIXIR_GOAL/BREW2/BREW3）', ELIXIR_GOAL === 1 && BREW2_GOAL === 5 && BREW3_GOAL === 12, `${ELIXIR_GOAL}/${BREW2_GOAL}/${BREW3_GOAL}`);
ok('蘑菇三档 10/25/50（MUSH/MUSH2/MUSH3）', MUSH_GOAL === 10 && MUSH2_GOAL === 25 && MUSH3_GOAL === 50, `${MUSH_GOAL}/${MUSH2_GOAL}/${MUSH3_GOAL}`);
ok('探索三档 2/3/4 图（OUTSTEP/OUTSTEP2/全部四图）', OUTSTEP_GOAL === 2 && OUTSTEP2_GOAL === 3 && Object.keys(MAPS).length === 4, `${OUTSTEP_GOAL}/${OUTSTEP2_GOAL}/${Object.keys(MAPS).length}`);
ok('图鉴收录三档 5/10/13 种（SCHOLAR/SCHOLAR2/全图鉴）', SCHOLAR_GOAL === 5 && SCHOLAR2_GOAL === 10 && BESTIARY_TARGET.length === 13, `${SCHOLAR_GOAL}/${SCHOLAR2_GOAL}/${BESTIARY_TARGET.length}`);
ok('图鉴遭遇三档 5/10/13 种（SEEN/SEEN2/全图鉴）', SEEN_GOAL === 5 && SEEN2_GOAL === 10 && BESTIARY_TARGET.length === 13, `${SEEN_GOAL}/${SEEN2_GOAL}/${BESTIARY_TARGET.length}`);
ok('宝箱三档 6/9/12 只（TREASURE/TREASURE2/全图 12 只）', TREASURE_GOAL === 6 && TREASURE2_GOAL === 9 && chestTotal() === 12, `${TREASURE_GOAL}/${TREASURE2_GOAL}/${chestTotal()}`);
ok('首胜单档 FIRSTBLOOD_GOAL === 1', FIRSTBLOOD_GOAL === 1, String(FIRSTBLOOD_GOAL));
ok('ACH_LIST 共 74 项', ACH_LIST.length === 74, String(ACH_LIST.length));

// —— README 数值速查「成就档位」行落位（全部由 data.js 派生、与判定/描述/进度同源）——
ok('README 成就档位行 等级档位与 LVL*_GOAL 同源', readme.includes(`等级 ${LVL5_GOAL}/${LVL10_GOAL}/${LVL12_GOAL} 级`));
ok('README 成就档位行 金币档位与 RICH* 同源', readme.includes(`金币 ${RICH_GOLD}/${RICH2_GOAL}/${RICH3_GOAL} 金`));
ok('README 成就档位行 讨伐档位与 HUNT* 同源', readme.includes(`讨伐 ${HUNT_GOAL}/${HUNT2_GOAL}/${HUNT3_GOAL} 只`));
ok('README 成就档位行 时长档位与 PLAY_TIME* 同源（分钟）', readme.includes(`时长 ${PLAY_TIME_GOAL / 60}/${PLAY_TIME2_GOAL / 60}/${PLAY_TIME3_GOAL / 60} 分钟`));
ok('README 成就档位行 掉落档位与 LUCKY* 同源', readme.includes(`掉落 ${LUCKY_GOAL}/${LUCKY2_GOAL}/${LUCKY3_GOAL} 次`));
ok('README 成就档位行 药水档位与 POTIONS* 同源（99=POTION_CAP）', readme.includes(`药水 ${POTIONS_GOAL}/${POTIONS2_GOAL}/${POTIONS3_GOAL} 瓶`) && readme.includes('POTION_CAP'));
ok('README 成就档位行 灵药档位与 ELIXIR_STOCK* 同源', readme.includes(`灵药 ${ELIXIR_STOCK_GOAL}/${ELIXIR_STOCK2_GOAL}/${ELIXIR_STOCK3_GOAL} 瓶`));
ok('README 成就档位行 酿造档位与 ELIXIR_GOAL/BREW* 同源', readme.includes(`酿造 ${ELIXIR_GOAL}/${BREW2_GOAL}/${BREW3_GOAL} 瓶`));
ok('README 成就档位行 蘑菇档位与 MUSH* 同源', readme.includes(`蘑菇 ${MUSH_GOAL}/${MUSH2_GOAL}/${MUSH3_GOAL} 株`));
ok('README 成就档位行 探索档位与 OUTSTEP*/全部四图 同源', readme.includes(`探索 ${OUTSTEP_GOAL}/${OUTSTEP2_GOAL}/${Object.keys(MAPS).length} 图`));
ok('README 成就档位行 图鉴收录档位与 SCHOLAR*/全图鉴 同源', readme.includes(`图鉴收录 ${SCHOLAR_GOAL}/${SCHOLAR2_GOAL}/${BESTIARY_TARGET.length} 种`));
ok('README 成就档位行 图鉴遭遇档位与 SEEN*/全图鉴 同源', readme.includes(`图鉴遭遇 ${SEEN_GOAL}/${SEEN2_GOAL}/${BESTIARY_TARGET.length} 种`));
ok('README 成就档位行 宝箱档位与 TREASURE*/chestTotal 同源', readme.includes(`宝箱 ${TREASURE_GOAL}/${TREASURE2_GOAL}/${chestTotal()} 只`));
ok('README 成就档位行 共 N 项与 ACH_LIST.length 同源', readme.includes(`共 ${ACH_LIST.length} 项`));
ok('README 成就档位行 含 v23.04 补录注释与 ACH_LIST 引用（v23.13 补社交档/v23.72 补给药端口/v23.73 补休整档/v23.74 补消费档/v23.75 补移动档/v23.76 补步行档/v23.80 补遭遇档/v23.82 补收入档口径随新现实更新）', readme.includes('（v23.04 补录、v23.13 补社交档、v23.72 补给药端口、v23.73 补休整档、v23.74 补消费档、v23.75 补移动档、v23.76 补步行档、v23.80 补遭遇档、v23.82 补收入档）') && readme.includes('`ACH_LIST`'));

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树串尾已延伸至 smoke_v2304_achgoal（v2303 后接 v2304）',
  readme.includes('smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc（npm test 串跑）'));
ok('README 旧串尾零残留（v2303 后无串尾收口）',
  !readme.includes('smoke_v2302_cmdprev + smoke_v2303_rushnum（npm test 串' + '跑）'));
ok('README 件套口径为二百一十五件套（二百一十四件套清除）且旧 199 口径零残留',
  readme.includes('冒烟二百一十五件套（二百一十四件套清除）') && !readme.includes('冒烟一百九十九件套（一百九十八件套清' + '除）'));
ok('README 不含哨兵领先一位（二百一十五件套（二百一十四件套清除））',
  !readme.includes('二百一十六件套（二百一十五件套清除）'));
ok('README 含 v23.04 守护描述（成就档位数值速查行守护）',
  readme.includes('v23.04 起含「成就档位」数值速查行守护'));
ok('README 含 smoke_v2304_achgoal 入库（200 份）', readme.includes('smoke_v2304_achgoal 入库（200 份）'));
ok('README 仍保留 v23.03 守护描述（历史口径）', readme.includes('v23.03 起含「试炼 / 彩头」数值速查行守护'));
ok('README 仍保留 smoke_v2303_rushnum 入库（199 份）历史口径', readme.includes('smoke_v2303_rushnum 入库（199 份）'));
ok('package.json 已收录 smoke_v2304_achgoal（npm test 串跑第 200 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2304_achgoal.mjs'));
ok('package.json 串尾为 ... smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs"',
  pkg.includes('node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 200 件套', testChain === 215, String(testChain));
ok('CHANGELOG 顶部已追加 v23.04 条目', changelog.startsWith('## v23.85 '));
ok('CHANGELOG 仍保留 v23.03 条目（历史口径）', changelog.includes('## v23.03 README「数值速查」补「试炼 / 彩头」行'));

// —— 姊妹件套 pin 随新现实更新 + 旧代 v23.03 pin 零残留 ——
const s2303 = read('smoke_v2303_rushnum.mjs');
const s2143 = read('smoke_v2143_talkekey.mjs');
ok('smoke_v2303 的 GAME_VERSION 字面量 pin 已更新为 v23.04', s2303.includes("const GAME_VERSION = 'v23.85';"));
ok('smoke_v2303 的 CHANGELOG 顶 pin 已更新为 ## v23.04',
  s2303.includes("startsWith('## v23.85 "));
ok('smoke_v2303 的件套 pin 已更新为二百一十五件套（二百一十四件套清除）',
  s2303.includes('二百一十五件套（二百一十四件套清除）'));
ok('smoke_v2303 的 README 串尾 pin 已延伸至 smoke_v2304_achgoal',
  s2303.includes('smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc（npm test 串跑）'));
ok('smoke_v2303 的 package 串尾 pin 已延伸至 smoke_v2304_achgoal',
  s2303.includes('node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs"'));
ok('smoke_v2303 的 testChain pin 已更新为 200', s2303.includes('testChain === 215'));
ok('smoke_v2143 哨兵链已推进至二百一十五件套（二百一十四件套清除）',
  s2143.includes('二百一十六件套（二百一十五件套清除）') && s2143.includes("!readme.includes('二百一十六件套（二百一十五件套清除）')"));

// 旧代 v23.03 pin 全库零残留（不含本件）
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2304_achgoal.mjs');
const stale = [];
const stalePats = [
  /GAME_VERSION = 'v23\.03'/, /GAME_VERSION === 'v23\.03'/, /一百九十九件套（一百九十八件套清.*?除）/,
  /testChain === 199/, /smoke_v2302_cmdprev \+ smoke_v2303_rushnum（npm test 串跑）/,
  /startsWith\('## v23\.03/, /smoke_v2303_rushnum(?:\\\\)*\.mjs"/
];
for (const f of allTests) {
  const src = read(f);
  if (stalePats.some((re) => re.test(src))) stale.push(f);
}
ok('旧代 v23.03 字面量/恒等/件套/testChain/串尾/顶 pin/package 串尾 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

console.log(`\n— v23.04 成就档位数值速查行守护冒烟：${n - failed}/${n} 通过 —`);
if (failed) process.exit(1);
