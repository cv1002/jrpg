// smoke_v2301_eco.mjs —— v23.01 README「数值速查」出没生态行守护（文档整理·数值说明·同源口径）
// 承 v21.10-v23.00 冒烟入库先例：版本锚点 + 源级落位（data.js v23.01 注释/GAME_VERSION 字面量 v23.01/
// v23.00 历史注释保留零 v23.00 字面量残留）+ 出没生态数据契约（MON_BASE[].minLv 门槛集/遇敌池
// MAPS[].pool/ELITE_GATE_LV·ELITE_CHANCE 逐值 + encounterWeight 门槛逐值 + randomEncounter 出没实证）+
// README 数值速查「出没生态」行落位（与图鉴「Lv.X起出没」标注/遇敌权重/精英判定同源口径，零裸字面量）+
// README/package.json/CHANGELOG 同步（冒烟二百一十二件套（二百一十一件套清除）/串尾/入库 197 份/顶 pin）+
// 姊妹件套 pin（smoke_v2300 随新现实更新）+ 哨兵链领先一位（198 口径）+ 旧代 v23.00 pin 全库零残留。
import { GAME_VERSION, MON_BASE, MAPS, ELITE_GATE_LV, ELITE_CHANCE } from '../js/data.js';
import { encounterWeight, randomEncounter } from '../js/encounter.js';
import { S } from '../js/state.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v23.01 出没生态数值速查行守护冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v22.99 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.99（本版守 v23.01）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 99)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v23.01 版本注释', dataSrc.includes('// v23.01 文档整理·数值说明·同源口径：README「数值速查」补「出没生态」行'));
ok('data.js GAME_VERSION 字面量已为 v23.01（旧 v23.00 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.74';") && !dataSrc.includes("const GAME_VERSION = 'v23." + "00';"));
ok('data.js 仍保留 v23.00 历史注释（状态页支线行注释未动）', dataSrc.includes('// v23.00 体验打磨·信息透明·纯显示'));

// —— MON_BASE 出没门槛契约（单一数据源：图鉴「Lv.X起出没」/encounterWeight 同读 minLv）——
const byName = Object.fromEntries(MON_BASE.map((m) => [m.name, m]));
const srt = (a) => a.slice().sort().join('/');
const Lv2 = srt(MON_BASE.filter((m) => m.minLv === 2).map((m) => m.name));
const Lv3 = srt(MON_BASE.filter((m) => m.minLv === 3).map((m) => m.name));
const noGate = srt(MON_BASE.filter((m) => !m.minLv).map((m) => m.name));
ok('MON_BASE 共 8 种魔物', MON_BASE.length === 8, String(MON_BASE.length));
ok('出没门槛 Lv.2 集 = 骷髅兵/雾灵', Lv2 === srt(['骷髅兵', '雾灵']), Lv2);
ok('出没门槛 Lv.3 集 = 树精/石魔像', Lv3 === srt(['树精', '石魔像']), Lv3);
ok('无门槛（Lv.1 起）集 = 史莱姆/哥布林/毒蛇/野狼', noGate === srt(['史莱姆', '野狼', '哥布林', '毒蛇']), noGate);
ok('毒蛇为无门槛（v19.43 四基础怪口径，Lv.1 即入新手池）', !byName['毒蛇'].minLv);

// —— 遇敌池契约（MAPS[].pool 单一数据源，无 pool 定义 = 全池 8 种）——
const vp = (MAPS.village.pool || []).join('/');
const gp = (MAPS.gallery.pool || []).join('/');
ok('潮灯镇遇敌池 = 四基础怪（史莱姆/野狼/哥布林/毒蛇）', vp === '史莱姆/野狼/哥布林/毒蛇', vp);
ok('无字回廊遇敌池 = 雾灵/石魔像/骷髅兵', gp === '雾灵/石魔像/骷髅兵', gp);
ok('雾语林无 pool 定义（全池 8 种）', !MAPS.dungeon.pool);
ok('星井矿脉无 pool 定义（全池 8 种）', !MAPS.cave.pool);
ok('四图遇敌池总数守恒（镇 4 + 廊 3 + 林 8 + 矿 8 = 23）',
  (MAPS.village.pool || []).length + (MAPS.gallery.pool || []).length +
  MON_BASE.length * 2 === 23, String(4 + 3 + 16));

// —— 精英出没契约（ELITE_GATE_LV/ELITE_CHANCE：randomEncounter 精英判定与图鉴「约N%」同源）——
ok('ELITE_GATE_LV === 3（雾语林 Lv.3 起撞精英）', ELITE_GATE_LV === 3, String(ELITE_GATE_LV));
ok('ELITE_CHANCE === 0.07（约 7%）', ELITE_CHANCE === 0.07, String(ELITE_CHANCE));

// —— encounterWeight 门槛逐值（与 minLv 同读一份源）——
ok('骷髅兵 Lv.1 权重 0（门槛生效）', encounterWeight(byName['骷髅兵'], 1) === 0);
ok('骷髅兵 Lv.2 权重 2（2+⌊2/3⌋）', encounterWeight(byName['骷髅兵'], 2) === 2, String(encounterWeight(byName['骷髅兵'], 2)));
ok('雾灵 Lv.1 权重 0（门槛生效）', encounterWeight(byName['雾灵'], 1) === 0);
ok('雾灵 Lv.2 权重 2', encounterWeight(byName['雾灵'], 2) === 2);
ok('树精 Lv.2 权重 0（Lv.3 门槛）', encounterWeight(byName['树精'], 2) === 0);
ok('石魔像 Lv.2 权重 0（Lv.3 门槛）', encounterWeight(byName['石魔像'], 2) === 0);
ok('树精 Lv.3 权重 3（2+⌊3/2⌋）', encounterWeight(byName['树精'], 3) === 3, String(encounterWeight(byName['树精'], 3)));
ok('石魔像 Lv.3 权重 3', encounterWeight(byName['石魔像'], 3) === 3);
ok('史莱姆 Lv.1 权重 4（4-⌊1/2⌋）', encounterWeight(byName['史莱姆'], 1) === 4, String(encounterWeight(byName['史莱姆'], 1)));
ok('史莱姆 Lv.6 权重 1（下限钳制）', encounterWeight(byName['史莱姆'], 6) === 1, String(encounterWeight(byName['史莱姆'], 6)));
ok('毒蛇 Lv.1 权重 1（lv>=2 前恒 1）', encounterWeight(byName['毒蛇'], 1) === 1, String(encounterWeight(byName['毒蛇'], 1)));
ok('毒蛇 Lv.2 权重 2（2+⌊2/3⌋）', encounterWeight(byName['毒蛇'], 2) === 2);

// —— randomEncounter 出没实证（真实路径：Lv.1 雾语林只出四基础怪 + Lv.3 精英概率通道存在）——
const origRandom = Math.random;
try {
  S.G = { level: 1, map: 'dungeon' };
  Math.random = () => 0;
  const e1 = randomEncounter();
  ok('运行期：Lv.1 雾语林 randomEncounter 出没于四基础怪集内',
    ['史莱姆', '野狼', '哥布林', '毒蛇'].includes(e1.name) && e1.hpMax >= 1, e1.name);
  S.G = { level: 3, map: 'dungeon' };
  Math.random = () => 0.05; // ≥ ELITE_CHANCE(0.07)? 0.05 < 0.07 → 精英通道
  const e2 = randomEncounter();
  ok('运行期：Lv.3 雾语林 roll<7% 走精英通道（石心魔像）', e2.name === '石心魔像', e2.name);
  Math.random = () => 0.5;
  const e3 = randomEncounter();
  ok('运行期：Lv.3 雾语林 roll≥7% 走普通池（出没于门槛集内）',
    ['史莱姆', '野狼', '哥布林', '毒蛇', '骷髅兵', '雾灵', '树精', '石魔像'].includes(e3.name), e3.name);
  Math.random = () => 0;
  S.G = { level: 1, map: 'village' };
  const e4 = randomEncounter();
  ok('运行期：Lv.1 潮灯镇 randomEncounter 恒为四基础怪（遇敌池限定）',
    ['史莱姆', '野狼', '哥布林', '毒蛇'].includes(e4.name), e4.name);
} finally {
  Math.random = origRandom;
  S.G = null;
}

// —— README 数值速查「出没生态」行落位（v23.01 补录，与图鉴/遇敌/图鉴标注同源）——
ok('README 数值速查含「出没生态」行（v23.01 补录）',
  readme.includes('| 出没生态 |') && readme.includes('v23.01 补录'));
ok('README 出没生态行由单一数据源派生（MON_BASE[].minLv/MAPS[].pool/ELITE_GATE_LV·ELITE_CHANCE 引用）',
  readme.includes('`MON_BASE[].minLv`') && readme.includes('`MAPS[].pool`') &&
  readme.includes('`ELITE_GATE_LV`') && readme.includes('`ELITE_CHANCE`'));
ok('README 出没生态行门槛集与 MON_BASE 逐字同源（骷髅兵/雾灵 Lv.2 起 · 树精/石魔像 Lv.3 起）',
  readme.includes('出没门槛：骷髅兵/雾灵 Lv.2 起 · 树精/石魔像 Lv.3 起 · 其余 Lv.1 起'));
ok('README 出没生态行遇敌池与 MAPS[].pool 逐字同源（镇四基础/林矿全 8/廊三强）',
  readme.includes('潮灯镇限定四基础怪（史莱姆/野狼/哥布林/毒蛇）') &&
  readme.includes('雾语林/星井矿脉全 8 种') && readme.includes('无字回廊限定 雾灵/石魔像/骷髅兵') &&
  readme.includes('无 pool 定义=全池'));
ok('README 出没生态行精英口径与 ELITE_GATE_LV/ELITE_CHANCE 逐字同源（Lv.3 起约 7%）',
  readme.includes('雾语林 Lv.3 起约 7% 撞见精英石心魔像'));

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树串尾已延伸至 smoke_v2301_eco（v2300 后接 v2301）',
  readme.includes('smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 旧串尾零残留（smoke_v2300_sidemore 后无串尾收口）',
  !readme.includes('smoke_v2300_sidemore（npm test 串' + '跑）'));
ok('README 件套口径为二百一十二件套（二百一十一件套清除）且旧 195 口径零残留',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟一百九十五件套（一百九十四件套清' + '除）'));
ok('README 含 v23.01 守护描述（出没生态数值速查行守护）',
  readme.includes('v23.01 起含「出没生态」数值速查行守护'));
ok('README 含 smoke_v2301_eco 入库（197 份）', readme.includes('smoke_v2301_eco 入库（197 份）'));
ok('README 仍保留 v23.00 守护描述（历史口径）', readme.includes('v23.00 起含状态页「支线」行多条支线计数守护'));
ok('README 仍保留 smoke_v2300_sidemore 入库（196 份）历史口径', readme.includes('smoke_v2300_sidemore 入库（196 份）'));
ok('package.json 已收录 smoke_v2301_eco（npm test 串跑第 197 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2301_eco.mjs'));
ok('package.json 串尾为 ... smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"',
  pkg.includes('node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 197 件套', testChain === 212, String(testChain));
ok('CHANGELOG 顶部已追加 v23.01 条目', changelog.startsWith('## v23.74 '));
ok('CHANGELOG 仍保留 v23.00 条目（历史口径）', changelog.includes('## v23.00 状态页「支线」行多条支线计数'));

// —— 姊妹件套 pin 随新现实更新 + 旧代 v23.00 pin 零残留 ——
const s2300 = read('smoke_v2300_sidemore.mjs');
const s2143 = read('smoke_v2143_talkekey.mjs');
ok('smoke_v2300 的 GAME_VERSION 字面量 pin 已更新为 v23.01', s2300.includes("const GAME_VERSION = 'v23.74';"));
ok('smoke_v2300 的 CHANGELOG 顶 pin 已更新为 ## v23.01',
  s2300.includes("startsWith('## v23.74 '"));
ok('smoke_v2300 的件套 pin 已更新为二百一十二件套（二百一十一件套清除）',
  s2300.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2300 的 README 串尾 pin 已延伸至 smoke_v2301_eco',
  s2300.includes('smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2300 的 package 串尾 pin 已延伸至 smoke_v2301_eco',
  s2300.includes('node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
ok('smoke_v2300 的 testChain pin 已更新为 197', s2300.includes('testChain === 212'));
ok('smoke_v2143 哨兵链已推进至二百一十二件套（二百一十一件套清除）',
  s2143.includes('二百一十三件套（二百一十二件套清除）') && s2143.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));

// 旧代 v23.00 pin 全库零残留（不含本件）
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2301_eco.mjs');
const stale = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("const GAME_VERSION = 'v23." + "00';") || src.includes("GAME_VERSION === 'v23.00'") ||
      src.includes('一百九十六件套（一百九十五件套清' + '除）') || src.includes('testChain === 19' + '6') ||
      src.includes('smoke_v2300_sidemore（npm test 串' + '跑）') ||
      src.includes("startsWith('## v23.00") || src.includes('node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs"')) stale.push(f);
}
ok('旧代 v23.00 字面量/恒等/件套/testChain/串尾/顶 pin/package 串尾 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

console.log(`\n— v23.01 出没生态数值速查行守护冒烟：${n - failed}/${n} 通过 —`);
if (failed) process.exit(1);
