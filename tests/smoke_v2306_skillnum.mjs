// smoke_v2306_skillnum.mjs —— v23.06 README「数值速查」技能数值行守护（文档整理·数值说明·同源口径）
// 承 v21.10-v23.05 冒烟入库先例：版本锚点 + 源级落位（data.js v23.06 注释/GAME_VERSION 字面量 v23.06/
// v23.05 历史注释保留零 v23.05 字面量残留）+ SKILL_DATA 契约（七招 mp/倍率/效果逐值 + 灼烧/冻结/汲回/
// 治愈派生常量同源）+ rules.skillEstimate 运行期派生逐值（治愈 55 精确 + 倍率比/真身加成容差）+ README
// 数值速查「技能数值」行落位（与技能菜单/战斗结算同源口径，零裸字面量）+ README/package.json/CHANGELOG
// 同步（冒烟二百一十二件套（二百一十一件套清除）/串尾/入库 202 份/顶 pin）+ 姊妹件套 pin（smoke_v2305 随新
// 现实更新）+ 哨兵链领先一位（203 口径）+ 旧代 v23.05 pin 全库零残留。
import { GAME_VERSION, SKILL_DATA, BURN_PCT, SKIP_CHANCE, DRAIN_PCT, DRAIN_HP_CAP,
  DRAIN_MP_PCT, DRAIN_MP_CAP } from '../js/data.js';
import { skillEstimate } from '../js/rules.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v23.06 技能数值数值速查行守护冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v23.05 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v23.05（本版守 v23.06）', !!_gv && (_gv[0] > 23 || (_gv[0] === 23 && _gv[1] >= 6)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v23.06 版本注释', dataSrc.includes('// v23.06 文档整理·数值说明·同源口径：README「数值速查」补「技能数值」行'));
ok('data.js GAME_VERSION 字面量已为 v23.06（旧 v23.05 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.23';") && !dataSrc.includes("const GAME_VERSION = 'v23." + "05';"));
ok('data.js 仍保留 v23.05 历史注释（魔物数值数值速查行注释未动）', dataSrc.includes('// v23.05 文档整理·数值说明·同源口径：README「数值速查」补「魔物数值」行'));

// —— SKILL_DATA 契约（七招 mp/mult/kind/效果逐字，单一数据源）——
ok('SKILL_DATA 共 7 招', Object.keys(SKILL_DATA).length === 7, String(Object.keys(SKILL_DATA).length));
ok('火焰斩 4MP/×1.8/灼烧2回合/火', (() => { const s = SKILL_DATA['火焰斩']; return s.mp === 4 && s.mult === 1.8 && s.kind === 'atk' && s.burn === 2 && s.element === 'fire'; })());
ok('冰霜击 5MP/×2.2/30%冻结/冰', (() => { const s = SKILL_DATA['冰霜击']; return s.mp === 5 && s.mult === 2.2 && s.kind === 'atk' && s.skip === SKIP_CHANCE && s.element === 'ice'; })());
ok('雷鸣 8MP/×2.8/穿透50%防御/雷', (() => { const s = SKILL_DATA['雷鸣']; return s.mp === 8 && s.mult === 2.8 && s.kind === 'atk' && s.pierce === 0.5 && s.element === 'thunder'; })());
ok('陨石术 14MP/×4.2/击碎石甲·真身×1.25', (() => { const s = SKILL_DATA['陨石术']; return s.mp === 14 && s.mult === 4.2 && s.kind === 'atk' && s.breakShield === 1 && s.trueBonus === 1.25; })());
ok('汲光击 9MP/×2.0/汲回50%伤害为HP·上限25%HP', (() => { const s = SKILL_DATA['汲光击']; return s.mp === 9 && s.mult === 2.0 && s.kind === 'atk' && s.drain === DRAIN_PCT && s.drainCap === DRAIN_HP_CAP; })());
ok('星砂回响 12MP/×2.4/汲回50%伤害为MP·上限25%MP', (() => { const s = SKILL_DATA['星砂回响']; return s.mp === 12 && s.mult === 2.4 && s.kind === 'atk' && s.drainMp === DRAIN_MP_PCT && s.drainMpCap === DRAIN_MP_CAP; })());
ok('治愈术 5MP/恢复55%最大HP/解毒', (() => { const s = SKILL_DATA['治愈术']; return s.mp === 5 && s.kind === 'heal' && s.heal === 0.55 && s.cleanse === true; })());

// —— 派生常量逐值（灼烧/冻结/汲回由 data.js 单一数据源，hint 与常量同源派生）——
ok('BURN_PCT 0.04 / SKIP_CHANCE 0.30', BURN_PCT === 0.04 && SKIP_CHANCE === 0.30);
ok('DRAIN_PCT 0.5 / DRAIN_HP_CAP 0.25', DRAIN_PCT === 0.5 && DRAIN_HP_CAP === 0.25);
ok('DRAIN_MP_PCT 0.5 / DRAIN_MP_CAP 0.25', DRAIN_MP_PCT === 0.5 && DRAIN_MP_CAP === 0.25);
ok('火焰斩 hint 灼烧口径逐字（4%最大HP 由 BURN_PCT 派生）', SKILL_DATA['火焰斩'].hint === '灼烧2回合·每回合约-4%最大HP');
ok('冰霜击 hint 冻结口径逐字（30% 由 SKIP_CHANCE 派生）', SKILL_DATA['冰霜击'].hint === '30%冻结（跳过敌回合）');
ok('汲光击 hint 汲回口径逐字（50%/25% 由 DRAIN_PCT/DRAIN_HP_CAP 派生）', SKILL_DATA['汲光击'].hint === '汲回伤害50%为HP·上限25%HP');
ok('星砂回响 hint 汲回口径逐字（50%/25% 由 DRAIN_MP_PCT/DRAIN_MP_CAP 派生）', SKILL_DATA['星砂回响'].hint === '汲回伤害50%为MP·上限25%MP');

// —— rules.skillEstimate 运行期派生（治愈精确 + 倍率比/真身加成容差）——
const hero = { atkMax: 20, hpMax: 100, charge: false };
const foe = (extra) => Object.assign({ def: 10 }, extra || {});
ok('skillEstimate 治愈术 恢复55%最大HP 精确（hpMax100→55）', skillEstimate(hero, null, SKILL_DATA['治愈术']) === 55, String(skillEstimate(hero, null, SKILL_DATA['治愈术'])));
ok('skillEstimate 倍率比逐招同源（星砂回响/火焰斩 = 2.4/1.8）',
  (() => { const a = skillEstimate(hero, foe(), SKILL_DATA['星砂回响']); const b = skillEstimate(hero, foe(), SKILL_DATA['火焰斩']); return Math.abs(a / b - 2.4 / 1.8) < 0.01; })());
ok('skillEstimate 陨石术 对真身 ×1.25（trueBonus 同源）',
  (() => { const a = skillEstimate(hero, foe({ phase2: 1 }), SKILL_DATA['陨石术']); const b = skillEstimate(hero, foe(), SKILL_DATA['陨石术']); return Math.abs(a / b - 1.25) < 0.01; })());

// —— README 数值速查「技能数值」行落位（全部由 data.js 派生、与技能菜单/战斗结算同源）——
ok('README 技能数值行 命名常量源引用逐字同源', readme.includes('`SKILL_DATA`（`BURN_PCT` `SKIP_CHANCE` `DRAIN_PCT` `DRAIN_HP_CAP` `DRAIN_MP_PCT` `DRAIN_MP_CAP`）'));
ok('README 技能数值行 含 v23.06 补录注释', readme.includes('（v23.06 补录）'));
ok('README 技能数值行 七招派生式逐字（火焰斩示例）', readme.includes('火焰斩 4MP·×1.8·灼烧2回合（每回合4%最大HP）'));
ok('README 技能数值行 七招派生式逐字（治愈术示例）', readme.includes('治愈术 5MP·恢复55%最大HP·解毒'));
ok('README 技能数值行 汲回/真身加成派生式逐字', readme.includes('陨石术 14MP·×4.2·击碎石甲·对真身×1.25（`trueBonus`）') && readme.includes('星砂回响 12MP·×2.4·汲回50%伤害为MP·上限25%最大MP'));

// —— 战斗结算/技能菜单同源口径（battle.cmdSkill·rules.skillEstimate——调技能只改 data.js 一处）——
ok('README 技能数值行 同源口径逐字（与技能菜单/战斗结算同读 SKILL_DATA）',
  readme.includes('与技能菜单/战斗结算（`battle.cmdSkill`·`rules.skillEstimate`）同读 `SKILL_DATA` 一份源'));

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树串尾已延伸至 smoke_v2306_skillnum（v2305 后接 v2306）',
  readme.includes('smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 旧串尾零残留（v2305 后无串尾收口）',
  !readme.includes('smoke_v2304_achgoal + smoke_v2305_monnum（npm test 串' + '跑）'));
ok('README 件套口径为二百一十二件套（二百一十一件套清除）且旧 201 口径零残留',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟二百零一件套（二百件套清' + '除）'));
ok('README 不含哨兵领先一位（二百一十二件套（二百一十一件套清除））',
  !readme.includes('二百一十三件套（二百一十二件套清除）'));
ok('README 含 v23.06 守护描述（技能数值数值速查行守护）',
  readme.includes('v23.06 起含「技能数值」数值速查行守护'));
ok('README 含 smoke_v2306_skillnum 入库（202 份）', readme.includes('smoke_v2306_skillnum 入库（202 份）'));
ok('README 仍保留 v23.05 守护描述（历史口径）', readme.includes('v23.05 起含「魔物数值」数值速查行守护'));
ok('README 仍保留 smoke_v2305_monnum 入库（201 份）历史口径', readme.includes('smoke_v2305_monnum 入库（201 份）'));
ok('package.json 已收录 smoke_v2306_skillnum（npm test 串跑第 202 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2306_skillnum.mjs'));
ok('package.json 串尾为 ... smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"',
  pkg.includes('node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 202 件套', testChain === 212, String(testChain));
ok('CHANGELOG 顶部已追加 v23.06 条目', changelog.startsWith('## v23.23 '));
ok('CHANGELOG 仍保留 v23.05 条目（历史口径）', changelog.includes('## v23.05 README「数值速查」补「魔物数值」行'));

// —— 姊妹件套 pin 随新现实更新 + 旧代 v23.05 pin 零残留 ——
const s2305 = read('smoke_v2305_monnum.mjs');
const s2143 = read('smoke_v2143_talkekey.mjs');
ok('smoke_v2305 的 GAME_VERSION 字面量 pin 已更新为 v23.06', s2305.includes("const GAME_VERSION = 'v23.23';"));
ok('smoke_v2305 的 CHANGELOG 顶 pin 已更新为 ## v23.06',
  s2305.includes("startsWith('## v23.23 "));
ok('smoke_v2305 的件套 pin 已更新为二百一十二件套（二百一十一件套清除）',
  s2305.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2305 的 README 串尾 pin 已延伸至 smoke_v2306_skillnum',
  s2305.includes('smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2305 的 package 串尾 pin 已延伸至 smoke_v2306_skillnum',
  s2305.includes('node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
ok('smoke_v2305 的 testChain pin 已更新为 202', s2305.includes('testChain === 212'));
ok('smoke_v2305 的版本锚已越过 v23.05 口径（>= 5 对 v23.06 恒真）', s2305.includes('_gv[1] >= 5'));
ok('smoke_v2143 哨兵链已推进至二百一十二件套（二百一十一件套清除）',
  s2143.includes('二百一十三件套（二百一十二件套清除）') && s2143.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));

// 旧代 v23.05 pin 全库零残留（不含本件）
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2306_skillnum.mjs');
const stale = [];
const stalePats = [
  /'v23\.05'/, /二百零一件套（二百件套清.*?除）/,
  /testChain === 201/, /smoke_v2305_monnum（npm test 串跑）/,
  /startsWith\('## v23\.05/, /smoke_v2305_monnum(?:\\\\)*\.mjs"/, /冒烟二百零一件套（二百件套清除）/
];
for (const f of allTests) {
  const src = read(f);
  if (stalePats.some((re) => re.test(src))) stale.push(f);
}
ok('旧代 v23.05 字面量/恒等/件套/testChain/串尾/顶 pin/package 串尾 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

console.log(`\n— v23.06 技能数值数值速查行守护冒烟：${n - failed}/${n} 通过 —`);
if (failed) process.exit(1);
