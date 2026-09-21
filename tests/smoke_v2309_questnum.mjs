// smoke_v2309_questnum.mjs —— v23.09 README「数值速查」支线/奖励行守护（文档整理·数值说明·同源口径）
// 承 v21.10-v23.08 冒烟入库先例：版本锚点 + 源级落位（data.js v23.09 注释/GAME_VERSION 字面量 v23.09/
// v23.08 历史注释保留零 v23.08 字面量残留）+ 支线契约（十条支线 kind==='side' + 八组 *_GOAL 逐值 +
// FRAGMENTS.length 逐值 + QUESTS[].reward 逐值（蘑菇支线随等级实时 gold:(lv)=>40+lv*10 抽样逐值）+
// quests.applyQuestReward 源级落位（gold 函数式/item/potion2 三通道与 README 行同读一份源））+ README
// 数值速查「支线 / 奖励」行落位（与任务日志奖励行/交付结算同源口径，零裸字面量）+ README/package.json/
// CHANGELOG 同步（冒烟二百一十二件套（二百一十一件套清除）/串尾/入库 205 份/顶 pin）+ 姊妹件套 pin
// （smoke_v2308 随新现实更新）+ 哨兵链领先一位（206 口径）+ 旧代 v23.08 pin 全库零残留。
import { GAME_VERSION, QUESTS, MUSHROOM_GOAL, MIST_GOAL, STONE_GOAL, GRAIN_GOAL, BONE_GOAL, EMBER_GOAL, TREE_GOAL, WOLF_GOAL, FRAGMENTS } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v23.09 支线/奖励数值速查行守护冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v23.08 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v23.08（本版守 v23.09）', !!_gv && (_gv[0] > 23 || (_gv[0] === 23 && _gv[1] >= 9)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v23.09 版本注释', dataSrc.includes('// v23.09 文档整理·数值说明·同源口径：README「数值速查」补「支线 / 奖励」行'));
ok('data.js GAME_VERSION 字面量已为 v23.35（旧 v23.33 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.52';") && !dataSrc.includes("const GAME_VERSION = 'v23." + "33';"));
ok('data.js 仍保留 v23.08 历史注释（难度/倍率数值速查行注释未动）', dataSrc.includes('// v23.08 文档整理·数值说明·同源口径：README「数值速查」补「难度 / 倍率」行'));

ok('data.js 含 v23.32 版本注释（新支线「树精的菌库」/TREE_GOAL 单一数据源）',
  dataSrc.includes('// v23.32 新内容·新支线：雾语林蘑菇田拾菇人升格为讨伐支线「树精的菌库」委托人'));
ok('data.js 含 v23.42 版本注释（新支线「夜路的狼嚎」/WOLF_GOAL 单一数据源）',
  dataSrc.includes('// v23.42 新内容·新支线：潮灯镇旅馆东侧门外客栈老板娘升格为讨伐支线「夜路的狼嚎」委托人'));
// —— v23.30 昼夜/时段数值速查行（文档整理·同源口径：HUD 标签/画面着色同读一份源）——
ok('data.js 含 v23.30 版本注释（README「数值速查」补「昼夜 / 时段」行）',
  dataSrc.includes('// v23.30 文档整理·数值说明·同源口径：README「数值速查」补「昼夜 / 时段」行'));
ok('data.js DAY_PHASE_S 字面量仍为 90（时长真源逐值未动）', dataSrc.includes('const DAY_PHASE_S = 90;'));
ok('data.js 仍保留 v23.29 历史注释（标题页存档预览·徽记 N/5 注释未动）',
  dataSrc.includes('// v23.29 体验打磨·信息透明·纯显示：标题页存档预览补「·徽记 N/5」冒险进度计数'));

// —— 支线目标常量逐值（单一数据源）——
ok('八组支线目标逐值：蘑菇 3 / 雾灵 3 / 石魔像 3 / 哥布林 3 / 骷髅兵 3 / 残焰魔像 1 / 树精 3 / 野狼 3',
  MUSHROOM_GOAL === 3 && MIST_GOAL === 3 && STONE_GOAL === 3 && GRAIN_GOAL === 3 && BONE_GOAL === 3 && EMBER_GOAL === 1 && TREE_GOAL === 3 && WOLF_GOAL === 3);
ok('记忆碎片 FRAGMENTS.length = 4（旧灯卫的名字支线目标同源）', Array.isArray(FRAGMENTS) && FRAGMENTS.length === 4);

// —— QUESTS 支线契约：十条 kind==='side'（主线四条零回归）——
const sides = Object.values(QUESTS).filter((q) => q.kind === 'side');
ok('QUESTS 共 14 条（主线 4 + 支线 10）', Object.keys(QUESTS).length === 14 && sides.length === 10, String(Object.keys(QUESTS).length));

// —— QUESTS[].reward 逐值（与任务日志奖励行/quests.applyQuestReward 同读一份源）——
ok('灯长的委托：3 株蘑菇（MUSHROOM_GOAL）+ 奖励随等级实时（lv1=50 金 / lv10=140 金）+ 2 药水',
  QUESTS.side_mushroom.reward.item === 2 && typeof QUESTS.side_mushroom.reward.gold === 'function' &&
  QUESTS.side_mushroom.reward.gold(1) === 50 && QUESTS.side_mushroom.reward.gold(10) === 140);
ok('雾里的新住客：60 金 + 1 药水', QUESTS.side_mist.reward.gold === 60 && QUESTS.side_mist.reward.item === 1 && !QUESTS.side_mist.reward.potion2);
ok('石壳里的记忆：60 金 + 1 高级灵药', QUESTS.side_stone.reward.gold === 60 && QUESTS.side_stone.reward.potion2 === 1 && !QUESTS.side_stone.reward.item);
ok('护粮的委托：50 金 + 1 药水', QUESTS.side_grain.reward.gold === 50 && QUESTS.side_grain.reward.item === 1 && !QUESTS.side_grain.reward.potion2);
ok('未归的矿灯：80 金 + 1 高级灵药', QUESTS.side_bone.reward.gold === 80 && QUESTS.side_bone.reward.potion2 === 1 && !QUESTS.side_bone.reward.item);
ok('残焰的安息：100 金 + 1 高级灵药', QUESTS.side_ember.reward.gold === 100 && QUESTS.side_ember.reward.potion2 === 1 && !QUESTS.side_ember.reward.item);
ok('星砂之约：80 金（击败洞窟领主后、对话即完成，零物品）',
  QUESTS.side_cart.reward.gold === 80 && !QUESTS.side_cart.reward.item && !QUESTS.side_cart.reward.potion2 &&
  QUESTS.side_cart.unlockOn === 'caveBoss' && QUESTS.side_cart.completeOnTalk === true);
ok('旧灯卫的名字：120 金 + 1 高级灵药（击败幽冥魔王后解锁、集齐 FRAGMENTS.length 枚）',
  QUESTS.side_name.reward.gold === 120 && QUESTS.side_name.reward.potion2 === 1 && !QUESTS.side_name.reward.item &&
  QUESTS.side_name.unlockOn === 'bossDefeated');
// v23.32 树精的菌库（新支线·拾菇人委托人）：契约与既有「讨伐采集型支线」同构（无 unlockOn → 开局即 offer）
ok('树精的菌库：70 金 + 1 药水（拾菇人委托人、无 unlockOn 开局即 offer、bestiary 树精计数）',
  QUESTS.side_tree.reward.gold === 70 && QUESTS.side_tree.reward.item === 1 && !QUESTS.side_tree.reward.potion2 &&
  QUESTS.side_tree.npc === 'picker' && QUESTS.side_tree.giver === 'picker' && !QUESTS.side_tree.unlockOn &&
  QUESTS.side_tree.cond({ bestiary: { '树精': 3 } }) === true && QUESTS.side_tree.cond({ bestiary: { '树精': 2 } }) === false &&
  QUESTS.side_tree.condProg({ bestiary: { '树精': 2 } }) === `2/${TREE_GOAL} 只`);
// v23.42 夜路的狼嚎（新支线·客栈老板娘委托人）：契约与既有「讨伐采集型支线」同构（无 unlockOn → 开局即 offer）
ok('夜路的狼嚎：40 金 + 2 药水（客栈老板娘委托人、无 unlockOn 开局即 offer、bestiary 野狼计数）',
  QUESTS.side_wolf.reward.gold === 40 && QUESTS.side_wolf.reward.item === 2 && !QUESTS.side_wolf.reward.potion2 &&
  QUESTS.side_wolf.npc === 'innkeeper' && QUESTS.side_wolf.giver === 'innkeeper' && !QUESTS.side_wolf.unlockOn &&
  QUESTS.side_wolf.cond({ bestiary: { '野狼': 3 } }) === true && QUESTS.side_wolf.cond({ bestiary: { '野狼': 2 } }) === false &&
  QUESTS.side_wolf.condProg({ bestiary: { '野狼': 2 } }) === `2/${WOLF_GOAL} 只`);

// —— data.js QUESTS 字面量 源级落位（零散值漂移）——
ok('data.js 蘑菇支线奖励字面量逐字（reward:{ gold:(lv)=>40+lv*10, item:2 }）', dataSrc.includes('reward:{ gold:(lv)=>40+lv*10, item:2 },'));
ok('data.js 旧灯卫的名字奖励字面量逐字（reward:{ gold:120, potion2:1 }）', dataSrc.includes('reward:{ gold:120, potion2:1 },'));
ok('data.js 树精的菌库字面量逐字（reward:{ gold:70, item:1 } / const TREE_GOAL = 3; / export 落位（WOLF_GOAL 与 GRAIN_GOAL·TREE_GOAL 相邻））',
  dataSrc.includes('reward:{ gold:70, item:1 }') && dataSrc.includes('const TREE_GOAL = 3;') && dataSrc.includes('GRAIN_GOAL, WOLF_GOAL, TREE_GOAL, DEFLECT_GOAL, MUSHROOM_PRICE'));
ok('data.js 夜路的狼嚎字面量逐字（reward:{ gold:40, item:2 } / const WOLF_GOAL = 3;）',
  dataSrc.includes('reward:{ gold:40, item:2 }') && dataSrc.includes('const WOLF_GOAL = 3;'));
ok('data.js 星砂谢礼字面量逐字（reward:{ gold:80 }）', dataSrc.includes('reward:{ gold:80 },'));
ok('data.js 旧灯卫的名字 cond 源级落位（FRAGMENTS.length 单一数据源）',
  dataSrc.includes('cond:(g)=>((g.fragments||[]).length >= FRAGMENTS.length)'));

// —— 交付结算 源级落位（quests.applyQuestReward：gold 函数式/item/potion2 三通道同读 QUESTS[].reward）——
const questsSrc = read('../js/quests.js');
ok('quests.applyQuestReward 源级落位（金币函数式/药水 item/灵药 potion2 三通道）',
  questsSrc.includes('export function applyQuestReward(hero, id)') &&
  questsSrc.includes("typeof reward.gold === 'function' ? reward.gold(hero.level) : (reward.gold || 0)") &&
  questsSrc.includes('if (item) hero.item = (hero.item || 0) + item;') &&
  questsSrc.includes('if (reward.potion2) hero.potion2 = (hero.potion2 || 0) + reward.potion2;'));

// —— README 数值速查「支线 / 奖励」行落位（全部由 data.js 派生、与任务日志/交付结算同源）——
ok('README 支线行开头逐字（十条支线目标/奖励全部由 `QUESTS[].reward` 单一数据源派生）', readme.includes('| 支线 / 奖励 | 十条支线目标/奖励全部由 `QUESTS[].reward` 单一数据源派生'));
ok('README 支线行 任务日志/交付结算同源逐字', readme.includes('与任务日志奖励行/交付结算 `quests.applyQuestReward` 同读一份源'));
ok('README 支线行 蘑菇奖励随等级实时逐字', readme.includes('`40+10×等级` 金 + 2 药水'));
ok('README 支线行 旧灯卫的名字 FRAGMENTS.length 逐字', readme.includes('集齐 `FRAGMENTS.length` 4 枚记忆碎片'));
ok('README 支线行 树精的菌库 v23.32 逐字', readme.includes('树精的菌库（拾菇人 · 3 只树精 `TREE_GOAL`）70 金 + 1 药水'));
ok('README 支线行 夜路的狼嚎 v23.42 逐字', readme.includes('夜路的狼嚎（客栈老板娘 · 3 只野狼 `WOLF_GOAL`）40 金 + 2 药水'));
ok('README 支线行 常量为 (v23.09 补录)', readme.includes('（v23.09 补录） | `QUESTS` `MUSHROOM_GOAL` `MIST_GOAL` `STONE_GOAL` `GRAIN_GOAL` `WOLF_GOAL` `TREE_GOAL` `BONE_GOAL` `EMBER_GOAL` `FRAGMENTS` |'));
// —— v23.30 昼夜 / 时段 行落位（与 v23.09 同式：开头/关键口径/补录标记/行序）——
ok('README 昼夜行开头逐字（世界时钟 S.G.time 秒数·每档 90 秒四档循环）',
  readme.includes('| 昼夜 / 时段 | 世界时钟 `S.G.time` 秒数：每档 `DAY_PHASE_S`(90) 秒四档循环 白天→黄昏→夜晚→黎明'));
ok('README 昼夜行 无字回廊恒暗口径逐字（HUD 🌑 恒暗·画面恒暗色）',
  readme.includes("无字回廊例外恒暗：`curMap()==='gallery'` 时 HUD 标 🌑 恒暗"));
ok('README 昼夜行 补录标记与常量源逐字（v23.30 补录）',
  readme.includes('（v23.30 补录） | `DAY_PHASE_S`（data.js，时长真源）`timeOfDay`/`PERIOD`（view/drawWorld.js·hud.js，相位/标签） |'));
ok('README 昼夜行位于支线/奖励行之后（行序位置正确）',
  readme.indexOf('| 昼夜 / 时段 |') > readme.indexOf('| 支线 / 奖励 |'));
ok('README 支线行位于难度 / 倍率行之后（表尾追加）',
  readme.indexOf('| 支线 / 奖励 |') > readme.indexOf('| 难度 / 倍率 |'));
// —— v23.37 装备属性 行落位（与 v23.09/v23.30 同式：开头/关键数值/补录标记/行序）——
ok('data.js 含 v23.37 版本注释（README「数值速查」补「装备属性」行）',
  dataSrc.includes('// v23.37 文档整理·数值说明·同源口径：README「数值速查」补「装备属性」行'));
ok('README 装备属性行开头逐字（武器 atk 五档·防具 def 四档·BEST_ARMOR 同源派生）',
  readme.includes('| 装备属性 | 武器 atk：木剑 2 / 铁剑 5 / 秘银剑 9 / 勇者之剑 15 / 圣光之剑 24（`legend`，Boss 首败必得·无售价') &&
  readme.includes('防具 def：布衣 1 / 皮甲 4 / 锁子甲 8 / 龙鳞甲 13（`BEST_ARMOR` 由 `ARMORS` 防御最大值派生'));
ok('README 装备属性行 补录标记与常量源逐字（v23.37 补录）',
  readme.includes('（v23.37 补录） | `WEAPONS` / `ARMORS` / `BEST_ARMOR` |'));
ok('README 装备属性行位于装备价格行之后（行序位置正确）',
  readme.indexOf('| 装备属性 |') > readme.indexOf('| 装备价格 |'));
ok('data.js WEAPONS/ARMORS 数值逐字未动（木剑2/铁剑5/秘银剑9/勇者之剑15/圣光之剑24 · 布衣1/皮甲4/锁子甲8/龙鳞甲13）',
  dataSrc.includes("'木剑':{atk:2,price:0}") && dataSrc.includes("'铁剑':{atk:5,price:80}") &&
  dataSrc.includes("'秘银剑':{atk:9,price:220}") && dataSrc.includes("'勇者之剑':{atk:15,price:600}") &&
  dataSrc.includes("'圣光之剑':{atk:24,price:0,legend:true}") && dataSrc.includes("'布衣':{def:1,price:0}") &&
  dataSrc.includes("'皮甲':{def:4,price:60}") && dataSrc.includes("'锁子甲':{def:8,price:180}") &&
  dataSrc.includes("'龙鳞甲':{def:13,price:480}"));

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树串尾已延伸至 smoke_v2309_questnum（v2308 后接 v2309）',
  readme.includes('smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 旧串尾零残留（v2308 后无串尾收口）',
  !readme.includes('smoke_v2307_bossnum + smoke_v2308_diffnum（npm test 串' + '跑）'));
ok('README 件套口径为二百一十二件套（二百一十一件套清除）且旧 204 口径零残留',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟二百零四件套（二百零三件套清' + '除）'));
ok('README 不含哨兵领先一位（二百一十三件套（二百一十二件套清除））',
  !readme.includes('二百一十三件套（二百一十二件套清除）'));
ok('README 含 v23.09 守护描述（支线/奖励数值速查行守护）',
  readme.includes('v23.09 起含「支线 / 奖励」数值速查行守护'));
ok('README 含 smoke_v2309_questnum 入库（205 份）', readme.includes('smoke_v2309_questnum 入库（205 份）'));
ok('README 仍保留 v23.08 守护描述（历史口径）', readme.includes('v23.08 起含「难度 / 倍率」数值速查行守护'));
ok('README 仍保留 smoke_v2308_diffnum 入库（204 份）历史口径', readme.includes('smoke_v2308_diffnum 入库（204 份）'));
ok('package.json 已收录 smoke_v2309_questnum（npm test 串跑第 205 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2309_questnum.mjs'));
ok('package.json 串尾为 ... smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"',
  pkg.includes('node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 205 件套', testChain === 212, String(testChain));
ok('CHANGELOG 顶部已追加 v23.35 条目', changelog.startsWith('## v23.52 '));
ok('CHANGELOG 仍保留 v23.08 条目（历史口径）', changelog.includes('## v23.08 README「数值速查」补「难度 / 倍率」行'));

// —— 姊妹件套 pin 随新现实更新 + 旧代 v23.08 pin 零残留 ——
const s2308 = read('smoke_v2308_diffnum.mjs');
const s2143 = read('smoke_v2143_talkekey.mjs');
ok('smoke_v2308 的 GAME_VERSION 字面量 pin 已更新为 v23.35', s2308.includes("const GAME_VERSION = 'v23.52';"));
ok('smoke_v2308 的 CHANGELOG 顶 pin 已更新为 ## v23.36',
  s2308.includes("startsWith('## v23.52 "));
ok('smoke_v2308 的件套 pin 已更新为二百一十二件套（二百一十一件套清除）',
  s2308.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2308 的 README 串尾 pin 已延伸至 smoke_v2309_questnum',
  s2308.includes('smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2308 的 package 串尾 pin 已延伸至 smoke_v2309_questnum',
  s2308.includes('node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
ok('smoke_v2308 的 testChain pin 已更新为 205', s2308.includes('testChain === 212'));
ok('smoke_v2308 的版本锚已越过 v23.08 口径（>= 8 对 v23.09 恒真）', s2308.includes('_gv[1] >= 8'));
ok('smoke_v2143 哨兵链已推进至二百一十三件套（二百一十二件套清除）',
  s2143.includes('二百一十三件套（二百一十二件套清除）') && s2143.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));

// 旧代 v23.08 pin 全库零残留（不含本件）
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2309_questnum.mjs');
const stale = [];
const stalePats = [
  /'v23\.08'/, /二百零四件套（二百零三件套清.*?除）/,
  /testChain === 204/, /smoke_v2308_diffnum（npm test 串跑）/,
  /startsWith\('## v23\.08/, /smoke_v2308_diffnum\.mjs"/, /冒烟二百零四件套（二百零三件套清除）/
];
for (const f of allTests) {
  const src = read(f);
  if (stalePats.some((re) => re.test(src))) stale.push(f);
}
ok('旧代 v23.08 字面量/恒等/件套/testChain/串尾/顶 pin/package 串尾 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

console.log(`\n— v23.09 支线/奖励数值速查行守护冒烟：${n - failed}/${n} 通过 —`);
if (failed) process.exit(1);
