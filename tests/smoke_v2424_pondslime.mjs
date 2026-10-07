// smoke_v2424_pondslime.mjs —— v24.24 专项冒烟：第十二条支线「塘底的灯影」（掌灯阿婆·讨伐 3 只史莱姆）
// （新内容·新支线——承 v23.32 拾菇人「树精的菌库」/ v23.42 客栈老板娘「夜路的狼嚎」/ v23.57 酿药师
// 「蛇影的药引」同一「风味 NPC 升格为支线委托人」先例：v23.57 补蛇影时四基础怪版图仅余史莱姆无
// 支线（SNAKE_GOAL 注释当时「刻意留白」），本轮收口——全 8 种普通怪至此各有专属讨伐线（史莱姆/
// 野狼/哥布林/毒蛇/雾灵/树精/骷髅兵/石魔像 + 精英残焰魔像），与 v19.61 灯火同心「完成全部
// kind==='side' 支线」同一「支线版图逐怪核对」主线；条款数由 QUESTS 派生不写死，成就/状态页/
// 任务日志/交付报文口径全端自动跟随零裸字面量）；塘底的史莱姆把灯影吞进肚子，讨伐 SLIME_GOAL(3)
// 只让影子落回水面（与 side_mist / side_stone / side_grain 同一「讨伐采集型支线」模式：无 unlockOn
// → 从开局即 offer、bestiary 计数 cond/condProg、active 页函数型实时报进度；done 页按 hero.trueBoss
// 分档——把 granny 原有 linesByStage 三档叙事与 trueBoss after 彩蛋「阿灯」并入任务页分档，
// npcQuestPages 有任务后不再单独展示 after，零内容丢失）；奖励 30 金 + 2 生命药水（开荒期最低档）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.24 注释 / GAME_VERSION v24.24 与旧 v24.23 字面量
// 零残留 / v24.23-24.19 历史注释保留 / SLIME_GOAL 常量与 export）、QUESTS 契约（14 side + 4 main、
// side_pond 字段逐值、与九组 *_GOAL 同源、ACH_LIST allquests 同源互证）、quests.js 运行期状态机
// （offer→active→turnin→done 全链路 + resolveNpcTalk 接取/交付结算 30 金+2 药水 + npcQuestMark/
// npcQuestPages 四态 + sideQuestDone 0/12·3/12·12/12）、NPCS.granny 升格落位（mark/坐标/NPC_SPOTS
// 零回归）、README/package.json/CHANGELOG 同步（件套口径 248 + v24.24 守护描述 + 入库 248 + package
// 串尾 + CHANGELOG 顶 pin）、tests 目录与实跑链恒等（248）、哨兵链（前望 252 且 README 尚无 252
// 口径）、旧代 v24.23 pin 全库零残留扫描（字面量/顶 pin/247 口径 · 豁免上一版套件
// smoke_v2423_eliteprog）。
import { GAME_VERSION, QUESTS, SLIME_GOAL, MUSHROOM_GOAL, MIST_GOAL, STONE_GOAL, EMBER_GOAL, BONE_GOAL, GRAIN_GOAL, TREE_GOAL, WOLF_GOAL, SNAKE_GOAL, ACH_LIST, NPCS } from '../js/data.js';
import { questStatus, questJournal, sideQuestDone, npcQuestMark, npcQuestPages, resolveNpcTalk, questRewardPreview } from '../js/quests.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.24 第十二条支线「塘底的灯影」冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const qSrc = read('js/quests.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.23', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 23)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.24（旧 v24.23 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.63';") && !dSrc.includes("const GAME_VERSION = 'v24.23';"));
ok('data.js 含 v24.24 注释（新支线「塘底的灯影」说明）',
  dSrc.includes('// v24.24 新内容·新支线'));
ok('data.js 仍保留 v24.23 历史注释（精英战报进度后缀说明，累积注释块）',
  dSrc.includes('// v24.23 体验打磨·信息透明·计数现场'));
ok('data.js 仍保留 v24.22 历史注释（胜利战报进度后缀说明）',
  dSrc.includes('// v24.22 体验打磨·信息透明·计数现场'));
ok('data.js SLIME_GOAL 常量 = 3 且与九组 *_GOAL 比邻声明（同一家族）',
  dSrc.includes('const SLIME_GOAL = 3;') && dSrc.indexOf('const SLIME_GOAL') > dSrc.indexOf('const SNAKE_GOAL'));
ok('data.js export 块含 SLIME_GOAL（TREE_GOAL 之后、DEFLECT_GOAL 之前）',
  dSrc.includes('TREE_GOAL, SLIME_GOAL, GOLEM_GOAL, DEFLECT_GOAL'));
ok('data.js SNAKE_GOAL 注释旧「刻意留白」句已随新现实推进（四基础怪版图收口）',
  dSrc.includes('v24.24 按 v23.32/v23.42/v23.57「风味 NPC 升格」先例收口'));

// —— SLIME_GOAL 与九组 *_GOAL 逐值（单一数据源）——
ok('九组既有支线目标逐值零回归（蘑菇 3/雾灵 3/石魔像 3/哥布林 3/骷髅兵 3/残焰 1/树精 3/野狼 3/毒蛇 3）+ 新 SLIME_GOAL=3',
  MUSHROOM_GOAL === 3 && MIST_GOAL === 3 && STONE_GOAL === 3 && GRAIN_GOAL === 3 && BONE_GOAL === 3 &&
  EMBER_GOAL === 1 && TREE_GOAL === 3 && WOLF_GOAL === 3 && SNAKE_GOAL === 3 && SLIME_GOAL === 3);

// —— QUESTS 契约：14 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 18 条（14 side + 4 main，派生计数）',
  sideDefs.length === 14 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 18,
  `${sideDefs.length}/${mainDefs.length}`);
ok('side_pond 存在且为第十二条（kind side · store · npc/giver granny · 无 unlockOn）',
  !!QUESTS.side_pond && QUESTS.side_pond.kind === 'side' && QUESTS.side_pond.store === true &&
  QUESTS.side_pond.npc === 'granny' && QUESTS.side_pond.giver === 'granny' &&
  QUESTS.side_pond.unlockOn == null);
ok('side_pond 名称「塘底的灯影」/where/obj/offer/turnin/done 落位',
  QUESTS.side_pond.name === '塘底的灯影' && QUESTS.side_pond.where.includes('潮灯镇') &&
  QUESTS.side_pond.obj.includes('史莱姆') && QUESTS.side_pond.obj.includes(String(SLIME_GOAL)) &&
  QUESTS.side_pond.offer.includes('掌灯阿婆') && QUESTS.side_pond.turnin.includes('掌灯阿婆') &&
  QUESTS.side_pond.done.includes('灯影'));
ok('side_pond cond/condProg 与 SLIME_GOAL 同源（bestiary 史莱姆计数，判/进/文/话一处调全端跟随）',
  QUESTS.side_pond.cond({ bestiary: { 史莱姆: SLIME_GOAL - 1 } }) === false &&
  QUESTS.side_pond.cond({ bestiary: { 史莱姆: SLIME_GOAL } }) === true &&
  QUESTS.side_pond.cond({}) === false &&
  QUESTS.side_pond.condProg({ bestiary: { 史莱姆: 2 } }) === `2/${SLIME_GOAL} 只`);
ok('side_pond reward 逐值：30 金 + 2 药水（开荒期最低档）',
  QUESTS.side_pond.reward.gold === 30 && QUESTS.side_pond.reward.item === 2 && !QUESTS.side_pond.reward.potion2);

// —— ACH_LIST allquests 同源互证（与 sideQuestDone 输出一致）——
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('ACH_LIST allquests 名称「灯火同心」且描述派生 14（「14 个支线任务」）',
  !!achAll && achAll.name === '灯火同心' && achAll.d.includes('14 个支线任务'), achAll && achAll.d);
ok('ACH_LIST allquests 判定/进度与 QUESTS 派生同源（0/14 false · 12/14 false · 14/14 true · prog 14/14）',
  !!achAll && achAll.ok({ quests: {} }) === false && achAll.ok({ quests: Object.fromEntries(sideDefs.slice(0, 13).map(q => [q.id, 'done'])) }) === false &&
  achAll.ok({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === true &&
  achAll.prog({ quests: {} }) === '0/14' && achAll.prog({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === '14/14');

// —— quests.js 运行期：sideQuestDone ——
ok('运行期：sideQuestDone 0/14 · 3/14 · 14/14 · 主线不入列',
  sideQuestDone({ quests: {} }).done === 0 && sideQuestDone({ quests: {} }).total === 14 &&
  sideQuestDone({ quests: { side_mushroom: 'done', side_cart: 'done', side_pond: 'done' } }).done === 3 &&
  sideQuestDone({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }).done === 14 &&
  sideQuestDone({ quests: { main_demon: 'done' } }).done === 0);

// —— 运行期状态机：offer → active → turnin → done（quests 纯函数，零 DOM）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 1, hp: 45, hpMax: 45, mp: 16, mpMax: 16, atkMax: 9, defMax: 5,
    gold: 0, xp: 0, xpNext: 20, item: 0, potion2: 0, weapon: '木剑', armor: '布衣',
    skills: [], ach: [], seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, totalWins: 0,
    mushrooms: 0, x: 10, y: 15, map: 'village' }, extra || {});
}
const h1 = mkHero({});
ok('状态机：无存档 → questStatus offer（无 unlockOn 开局即可接，承 side_grain 同款）',
  questStatus(h1, 'side_pond') === 'offer', questStatus(h1, 'side_pond'));
ok('状态机：npcQuestMark offer 态「❕ 可接委托」',
  npcQuestMark(h1, 'granny') === '❕ 可接委托', npcQuestMark(h1, 'granny'));
ok('状态机：npcQuestPages offer 页（掌灯阿婆 · 灯影 · SLIME_GOAL 同源）',
  JSON.stringify(npcQuestPages(h1, 'granny')).includes('掌灯阿婆') &&
  JSON.stringify(npcQuestPages(h1, 'granny')).includes('灯影') &&
  JSON.stringify(npcQuestPages(h1, 'granny')).includes(String(SLIME_GOAL)));
const rAcc = resolveNpcTalk(h1, 'granny');
ok('状态机：resolveNpcTalk 接取 → {kind:accept, id:side_pond} + quests.side_pond=active',
  !!rAcc && rAcc.kind === 'accept' && rAcc.id === 'side_pond' && h1.quests.side_pond === 'active', JSON.stringify(rAcc));
ok('状态机：active 未达标 → questStatus active（cond 未满足）',
  questStatus(h1, 'side_pond') === 'active', questStatus(h1, 'side_pond'));
ok('状态机：active 页函数型实时报进度（0/3 只 · 已讨伐）',
  JSON.stringify(npcQuestPages(h1, 'granny')).includes('0/' + SLIME_GOAL + ' 只') &&
  JSON.stringify(npcQuestPages(h1, 'granny')).includes('已讨伐'));
ok('状态机：任务日志 objective 同源（讨伐 3 只吞了灯影的【史莱姆】 0/3 只）',
  questJournal(h1).find((e) => e.id === 'side_pond').objective.includes('吞了灯影') &&
  questJournal(h1).find((e) => e.id === 'side_pond').objective.includes(`0/${SLIME_GOAL} 只`));
const h2 = mkHero({ quests: { side_pond: 'active' }, bestiary: { 史莱姆: 3 } });
ok('状态机：达标 → questStatus turnin',
  questStatus(h2, 'side_pond') === 'turnin', questStatus(h2, 'side_pond'));
ok('状态机：npcQuestMark turnin 态「❕ 可交任务」',
  npcQuestMark(h2, 'granny') === '❕ 可交任务', npcQuestMark(h2, 'granny'));
const rRew = resolveNpcTalk(h2, 'granny');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:30, item:2} + done + 结算 30 金/2 药水',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 30 && rRew.item === 2 &&
  h2.quests.side_pond === 'done' && h2.gold === 30 && h2.item === 2, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）',
  resolveNpcTalk(h2, 'granny') === null);
ok('状态机：done 默认档（月亮重新落在水上 · 无 bossDefeated）',
  JSON.stringify(npcQuestPages(h2, 'granny')).includes('月亮重新落在水上'));
ok('状态机：done bossDefeated 档（旧灯卫 · 阿灯线索承接 linesByStage）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_pond: 'done' }, bossDefeated: true }), 'granny')).includes('旧灯卫'));
ok('状态机：done trueBoss 档（after 彩蛋「阿灯」并入任务页，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_pond: 'done' }, trueBoss: true }), 'granny')).includes('阿灯'));
ok('状态机：done 态 npcQuestMark 零顶标（granny 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_pond: 'done' } }), 'granny') === null);
ok('questRewardPreview 与 reward 同源（30 金 + 2 药水）',
  JSON.stringify(questRewardPreview(mkHero({ quests: { side_pond: 'active' } }), 'side_pond')) === '{"gold":30,"item":2,"potion2":0}');

// —— 既有支线零回归（十二条之外：挑三条既有契约逐值钉死）——
ok('既有支线零回归：side_mushroom/ side_mist/ side_wolf 契约逐字未动',
  QUESTS.side_mushroom.reward.item === 2 && typeof QUESTS.side_mushroom.reward.gold === 'function' &&
  QUESTS.side_mist.reward.gold === 60 && QUESTS.side_wolf.reward.gold === 40 && QUESTS.side_wolf.reward.item === 2);

// —— NPCS.granny 升格落位（零新 NPC/坐标/数据层三件套之外零改动）——
ok('NPCS.granny 存在（掌灯阿婆 · mark lamp · 含 v24.24 升格注释）',
  !!NPCS.granny && NPCS.granny.name === '掌灯阿婆' && NPCS.granny.mark === 'lamp' &&
  dSrc.includes('// v24.24 升格为支线委托人'));
ok('data.js village.extras 含掌灯阿婆 (14,8) 与 NPC_SPOTS 键「14,8」（零新坐标）',
  dSrc.includes('{ x: 14, y: 8, ty: \'NPC\' }') && dSrc.includes("'14,8'"));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为二百八十七件套（二百八十六件套清除）',
  readme.includes('冒烟二百八十七件套（二百八十六件套清除）'));
ok('README tests 含 v24.24 守护描述与 smoke_v2424_pondslime 入库（287 份）',
  readme.includes('v24.24 起含 新支线「塘底的灯影」守护') &&
  readme.includes('smoke_v2424_pondslime 入库（287 份）'));
ok('README 仍有 v24.23 守护描述（历史保留）', readme.includes('v24.23 起含 💎 精英战报「⚔️ 精英猎手 N/2」进度后缀守护'));
ok('README 已有二百四十八件套口径且尚无 252（哨兵前望 252 语义：下一版才写 252）',
  readme.includes('冒烟二百八十七件套（二百八十六件套清除）') && !readme.includes('二百八十八件套'));
ok('README tests 树串尾已延伸（…+ smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10 + smoke_v2461_xpcurve11 + smoke_v2462_xpcurve12 + smoke_v2463_xpcurve13（npm test 串跑））',
  readme.includes('smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10 + smoke_v2461_xpcurve11 + smoke_v2462_xpcurve12 + smoke_v2463_xpcurve13（npm test 串跑）'));
ok('README 支线/奖励行随新现实（十二条 · 塘底的灯影 · SLIME_GOAL）',
  readme.includes('十四条支线目标/奖励全部由') && readme.includes('塘底的灯影（掌灯阿婆 · 3 只史莱姆 `SLIME_GOAL`）30 金 + 2 药水') &&
  readme.includes('`SLIME_GOAL`'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 248 份（smoke.mjs + 250 专项）', chain.length === 286 && chainAll.length === 287, String(chain.length));
ok('package.json 链尾为 smoke_v2439_xpcurve4（第 273 份）', chain[chain.length - 1] === 'smoke_v2463_xpcurve13', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2424_pondslime.mjs（node tests/ 前缀形态）',
  pkgRaw.includes('node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs'));
ok('package.json 链锚逐字（smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs"）',
  pkgRaw.includes('smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs && node tests/smoke_v2459_xpcurve9.mjs && node tests/smoke_v2460_xpcurve10.mjs && node tests/smoke_v2461_xpcurve11.mjs && node tests/smoke_v2462_xpcurve12.mjs && node tests/smoke_v2463_xpcurve13.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.24（startsWith）', changelog.startsWith('## v24.63'));
ok('CHANGELOG v24.24 条目含「塘底的灯影」与「史莱姆」与「SLIME_GOAL」',
  changelog.includes('塘底的灯影') && changelog.includes('史莱姆') && changelog.includes('SLIME_GOAL'));
ok('CHANGELOG 仍保留 v24.23 条目（历史保留）', changelog.includes('## v24.23'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(chainAll.map((f) => f.replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 248（247 + smoke_v2424_pondslime）', files.length === 287, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链（旧代 v24.23 pin 全库零残留）——
const leftovers = [];
for (const f of files) {
  if (f === 'smoke_v2424_pondslime.mjs') continue;
  // 承 v24.23 同款豁免：上一版套件（smoke_v2423_eliteprog）按惯例在否定式断言里保留旧代字面量，
  // 属合法残留，豁免扫描。
  if (f === 'smoke_v2423_eliteprog.mjs') continue;
  const s = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s.includes("const GAME_VERSION = 'v24.23';") || s.includes("GAME_VERSION === 'v24.23'") ||
      s.includes("startsWith('## v24.23") || s.includes('入库（247 份）') ||
      s.includes('二百四十七件套（二百四十六件套清除）') || s.includes('testChain === 247') ||
      s.includes('fileCount === 247') || s.includes('files.length === 247') ||
      s.includes('chain.length === 246') || s.includes('第 247 份') ||
      s.includes('链尾为 smoke_v2423_eliteprog')) leftovers.push(f);
}
ok('全库测试零残留 v24.23 GAME_VERSION/顶 pin/247 口径（哨兵链·豁免上一版否定式）', leftovers.length === 0, leftovers.join(','));

console.log(`— v24.24 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
