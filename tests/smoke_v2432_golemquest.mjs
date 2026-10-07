// smoke_v2432_golemquest.mjs —— v24.32 专项冒烟：第十三条支线「石心的试炼」（锻灯师·讨伐 1 尊石心魔像）
// （新内容·新支线——承 v23.32 拾菇人「树精的菌库」/ v23.42 客栈老板娘「夜路的狼嚎」/ v23.57 酿药师
// 「蛇影的药引」/ v24.24 掌灯阿婆「塘底的灯影」同一「风味 NPC 升格为支线委托人」先例：v24.24 让全 8 种
// 普通怪各有专属讨伐线收口，精英线（石心魔像/残焰魔像）当时仍只有 v24.23 成就无支线——本版收口，把
// 雾语林随机精英「石心魔像」（ELITE_GOLEM 单一数据源：Lv≥ELITE_GATE_LV(3) 起 ELITE_CHANCE(7%) 撞见、
// 掉记忆碎片、必掉蘑菇、石甲机制）挂上第十三条 side 支线，与 v19.61 灯火同心「完成全部 kind==='side'
// 支线」同一「支线版图核对」主线；条款数由 QUESTS 派生不写死，成就/状态页/任务日志/交付报文口径全端
// 自动跟随零裸字面量）；锻灯师（v22.31 纯风味 NPC·镇内 (7,11)）升格为委托人，讨伐 GOLEM_GOAL(1) 尊
// 让锤砧配齐「试金石」（与 side_mist / side_stone / side_grain 同一「讨伐采集型支线」模式：无 unlockOn
// → 从开局即 offer、bestiary 计数 cond/condProg、active 页函数型实时报进度；done 页按 hero.trueBoss
// 分档——把 smith 原有 trueBoss after 彩蛋「灯芯全亮回来了」并入任务页分档，npcQuestPages 有任务后
// 不再单独展示 after，零内容丢失）；奖励 120 金 + 1 高级灵药（与 side_name 同档：精英级随机遭遇高于
// ember 100 档）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.32 注释 / GAME_VERSION v24.32 与旧 v24.31 字面量
// 零残留 / v24.31-24.19 历史注释保留 / GOLEM_GOAL 常量与 export）、QUESTS 契约（14 side + 4 main、
// side_golem 字段逐值、与十组 *_GOAL 同源、ACH_LIST allquests 同源互证）、quests.js 运行期状态机
// （offer→active→turnin→done 全链路 + resolveNpcTalk 接取/交付结算 120 金+1 高级灵药 + npcQuestMark/
// npcQuestPages 四态 + sideQuestDone 0/14·3/14·14/14）、NPCS.smith 升格落位（mark/坐标/NPC_SPOTS
// 零回归）、README/package.json/CHANGELOG 同步（件套口径 257 + v24.32 守护描述 + 入库 257 + package
// 串尾 + CHANGELOG 顶 pin）、tests 目录与实跑链恒等（256）、哨兵链（前望 275 且 README 尚无 275
// 口径）、旧代 v24.31 pin 全库零残留扫描（字面量/顶 pin/255 口径 · 豁免上一版套件
// smoke_v2431_elixirprog）。
import { GAME_VERSION, QUESTS, GOLEM_GOAL, ELITE_GOLEM, ELITE_GATE_LV, ELITE_CHANCE, MUSHROOM_GOAL, MIST_GOAL, STONE_GOAL, EMBER_GOAL, BONE_GOAL, GRAIN_GOAL, TREE_GOAL, WOLF_GOAL, SNAKE_GOAL, SLIME_GOAL, ACH_LIST, NPCS } from '../js/data.js';
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

console.log('— v24.32 第十三条支线「石心的试炼」冒烟 —');

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
ok('GAME_VERSION 格式合法且已越过 v24.31', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 31)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.32（旧 v24.31 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.58';") && !dSrc.includes("const GAME_VERSION = 'v24.31';"));
ok('data.js 含 v24.32 注释（新支线「石心的试炼」说明）',
  dSrc.includes('// v24.32 新内容·新支线（第十三条）'));
ok('data.js 仍保留 v24.31 历史注释（酿造角标进度说明，累积注释块）',
  dSrc.includes('// v24.31 体验打磨·信息透明·决策现场'));
ok('data.js 仍保留 v24.30 历史注释（金币曲线第三轮说明）',
  dSrc.includes('// v24.30 数值平衡·后期金币曲线续平滑（承 v19.66'));
ok('data.js GOLEM_GOAL 常量 = 1 且与十组 *_GOAL 比邻声明（同一家族）',
  dSrc.includes('const GOLEM_GOAL = 1;') && dSrc.indexOf('const GOLEM_GOAL') > dSrc.indexOf('const SLIME_GOAL'));
ok('data.js export 块含 GOLEM_GOAL（SLIME_GOAL 之后、DEFLECT_GOAL 之前）',
  dSrc.includes('TREE_GOAL, SLIME_GOAL, GOLEM_GOAL, DEFLECT_GOAL'));
ok('data.js SLIME_GOAL 注释「四基础怪收口」句与 GOLEM_GOAL 注释「精英线支线挂钩」句同存（版图核对链完整）',
  dSrc.includes('v24.24 按 v23.32/v23.42/v23.57「风味 NPC 升格」先例收口') &&
  dSrc.includes('精英线至此由本版补上支线挂钩'));

// —— GOLEM_GOAL 与十组 *_GOAL 逐值（单一数据源）——
ok('十组既有支线目标逐值零回归（蘑菇 3/雾灵 3/石魔像 3/哥布林 3/骷髅兵 3/残焰 1/树精 3/野狼 3/毒蛇 3/史莱姆 3）+ 新 GOLEM_GOAL=1',
  MUSHROOM_GOAL === 3 && MIST_GOAL === 3 && STONE_GOAL === 3 && GRAIN_GOAL === 3 && BONE_GOAL === 3 &&
  EMBER_GOAL === 1 && TREE_GOAL === 3 && WOLF_GOAL === 3 && SNAKE_GOAL === 3 && SLIME_GOAL === 3 && GOLEM_GOAL === 1);
ok('ELITE_GOLEM 单一数据源逐值（石心魔像 · Lv≥3 · 7%）',
  ELITE_GOLEM.name === '石心魔像' && ELITE_GATE_LV === 3 && ELITE_CHANCE === 0.07);

// —— QUESTS 契约：14 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 18 条（14 side + 4 main，派生计数）',
  sideDefs.length === 14 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 18,
  `${sideDefs.length}/${mainDefs.length}`);
ok('side_golem 存在且为第十三条（kind side · store · npc/giver smith · 无 unlockOn）',
  !!QUESTS.side_golem && QUESTS.side_golem.kind === 'side' && QUESTS.side_golem.store === true &&
  QUESTS.side_golem.npc === 'smith' && QUESTS.side_golem.giver === 'smith' &&
  QUESTS.side_golem.unlockOn == null);
ok('side_golem 名称「石心的试炼」/where/obj/offer/turnin/done 落位',
  QUESTS.side_golem.name === '石心的试炼' && QUESTS.side_golem.where.includes('雾语林') &&
  QUESTS.side_golem.obj.includes(ELITE_GOLEM.name) && QUESTS.side_golem.obj.includes(String(GOLEM_GOAL)) &&
  QUESTS.side_golem.offer.includes('锻灯师') && QUESTS.side_golem.turnin.includes('锻灯师') &&
  QUESTS.side_golem.done.includes('石心'));
ok('side_golem cond/condProg 与 GOLEM_GOAL 同源（bestiary 石心魔像计数，判/进/文/话一处调全端跟随）',
  QUESTS.side_golem.cond({ bestiary: { [ELITE_GOLEM.name]: GOLEM_GOAL - 1 } }) === false &&
  QUESTS.side_golem.cond({ bestiary: { [ELITE_GOLEM.name]: GOLEM_GOAL } }) === true &&
  QUESTS.side_golem.cond({}) === false &&
  QUESTS.side_golem.condProg({ bestiary: { [ELITE_GOLEM.name]: 0 } }) === `0/${GOLEM_GOAL} 尊`);
ok('side_golem reward 逐值：120 金 + 1 高级灵药（与 side_name 同档·精英级随机遭遇）',
  QUESTS.side_golem.reward.gold === 120 && QUESTS.side_golem.reward.potion2 === 1 && !QUESTS.side_golem.reward.item);

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
ok('状态机：无存档 → questStatus offer（无 unlockOn 开局即可接，承 side_pond 同款）',
  questStatus(h1, 'side_golem') === 'offer', questStatus(h1, 'side_golem'));
ok('状态机：npcQuestMark offer 态「❕ 可接委托」',
  npcQuestMark(h1, 'smith') === '❕ 可接委托', npcQuestMark(h1, 'smith'));
ok('状态机：npcQuestPages offer 页（锻灯师 · 试金石 · GOLEM_GOAL 同源）',
  JSON.stringify(npcQuestPages(h1, 'smith')).includes('锻灯师') &&
  JSON.stringify(npcQuestPages(h1, 'smith')).includes('试金石') &&
  JSON.stringify(npcQuestPages(h1, 'smith')).includes(String(GOLEM_GOAL)));
const rAcc = resolveNpcTalk(h1, 'smith');
ok('状态机：resolveNpcTalk 接取 → {kind:accept, id:side_golem} + quests.side_golem=active',
  !!rAcc && rAcc.kind === 'accept' && rAcc.id === 'side_golem' && h1.quests.side_golem === 'active', JSON.stringify(rAcc));
ok('状态机：active 未达标 → questStatus active（cond 未满足）',
  questStatus(h1, 'side_golem') === 'active', questStatus(h1, 'side_golem'));
ok('状态机：active 页函数型实时报进度（0/1 尊 · 已讨伐）',
  JSON.stringify(npcQuestPages(h1, 'smith')).includes('0/' + GOLEM_GOAL + ' 尊') &&
  JSON.stringify(npcQuestPages(h1, 'smith')).includes('已讨伐'));
ok('状态机：任务日志 objective 同源（讨伐 1 尊雾语林的【石心魔像】 0/1 尊）',
  questJournal(h1).find((e) => e.id === 'side_golem').objective.includes(ELITE_GOLEM.name) &&
  questJournal(h1).find((e) => e.id === 'side_golem').objective.includes(`0/${GOLEM_GOAL} 尊`));
const h2 = mkHero({ quests: { side_golem: 'active' }, bestiary: { [ELITE_GOLEM.name]: 1 } });
ok('状态机：达标 → questStatus turnin',
  questStatus(h2, 'side_golem') === 'turnin', questStatus(h2, 'side_golem'));
ok('状态机：npcQuestMark turnin 态「❕ 可交任务」',
  npcQuestMark(h2, 'smith') === '❕ 可交任务', npcQuestMark(h2, 'smith'));
const rRew = resolveNpcTalk(h2, 'smith');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:120, potion2:1} + done + 结算 120 金/1 高级灵药',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 120 && rRew.potion2 === 1 &&
  h2.quests.side_golem === 'done' && h2.gold === 120 && h2.potion2 === 1, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）',
  resolveNpcTalk(h2, 'smith') === null);
ok('状态机：done 默认档（锤砧齐了 · 灯记住路）',
  JSON.stringify(npcQuestPages(h2, 'smith')).includes('锤砧齐了'));
ok('状态机：done trueBoss 档（after 彩蛋「灯芯全亮回来了 / 铁锤归我管」并入任务页，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_golem: 'done' }, trueBoss: true }), 'smith')).includes('灯芯全亮回来了') &&
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_golem: 'done' }, trueBoss: true }), 'smith')).includes('铁锤归我管'));
ok('状态机：done 态 npcQuestMark 零顶标（smith 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_golem: 'done' } }), 'smith') === null);
ok('questRewardPreview 与 reward 同源（120 金 + 1 高级灵药）',
  JSON.stringify(questRewardPreview(mkHero({ quests: { side_golem: 'active' } }), 'side_golem')) === '{"gold":120,"item":0,"potion2":1}');

// —— 既有支线零回归（十三条之外：挑三条既有契约逐值钉死）——
ok('既有支线零回归：side_pond/side_mist/side_wolf 契约逐字未动',
  QUESTS.side_pond.reward.gold === 30 && QUESTS.side_pond.reward.item === 2 &&
  QUESTS.side_mist.reward.gold === 60 && QUESTS.side_wolf.reward.gold === 40 && QUESTS.side_wolf.reward.item === 2);

// —— NPCS.smith 升格落位（零新 NPC/坐标/数据层三件套之外零改动）——
ok('NPCS.smith 存在（锻灯师 · mark hammer · 含 v24.32 升格注释）',
  !!NPCS.smith && NPCS.smith.name === '锻灯师' && NPCS.smith.mark === 'hammer' &&
  dSrc.includes('锻灯师·石心的试炼（v24.32 新支线·第十三条）'));
ok('NPCS.smith 原有 lines 两页 / trueBoss after 两页彩蛋保留（零内容丢失契约）',
  Array.isArray(NPCS.smith.lines) && NPCS.smith.lines.length === 2 && Array.isArray(NPCS.smith.after) &&
  NPCS.smith.after.length === 2 && NPCS.smith.after[0][0].includes('灯芯全亮回来了'));
ok('data.js village.extras 含锻灯师 (7,11) 与 NPC_SPOTS 键「7,11」（零新坐标）',
  dSrc.includes('{ x: 7, y: 11, ty: \'NPC\' }') && dSrc.includes("'7,11'"));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为二百八十二件套（二百八十一件套清除）',
  readme.includes('冒烟二百八十二件套（二百八十一件套清除）'));
ok('README tests 含 v24.32 守护描述与 smoke_v2432_golemquest 入库（282 份）',
  readme.includes('v24.32 起含 新支线「石心的试炼」守护') &&
  readme.includes('smoke_v2432_golemquest 入库（282 份）'));
ok('README 仍有 v24.31 守护描述（历史保留）', readme.includes('v24.31 起含 酿造界面「🧪 灵药满柜 N/8」进度角标守护'));
ok('README 已有二百五十六件套口径且尚无 275（哨兵前望 275 语义：下一版才写 275）',
  readme.includes('冒烟二百八十二件套（二百八十一件套清除）') && !readme.includes('二百八十三件套'));
ok('README tests 树串尾已延伸（…+ smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp（npm test 串跑））',
  readme.includes('smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp（npm test 串跑）'));
ok('README 支线/奖励行随新现实（十三条 · 石心的试炼 · GOLEM_GOAL）',
  readme.includes('十四条支线目标/奖励全部由') && readme.includes('石心的试炼（锻灯师 · 1 尊石心魔像 `GOLEM_GOAL`）120 金 + 1 高级灵药') &&
  readme.includes('`GOLEM_GOAL`') && readme.includes('v24.32 补第十三条'));
ok('README 地图速览锻灯师行随新现实（v24.32 起讨伐支线委托人）',
  readme.includes('**v24.32 起讨伐支线「石心的试炼」委托人**'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 256 份（smoke.mjs + 260 专项）', chain.length === 281 && chainAll.length === 282, String(chain.length));
ok('package.json 链尾为 smoke_v2439_xpcurve4（第 273 份）', chain[chain.length - 1] === 'smoke_v2458_pondlamp', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2432_golemquest.mjs（node tests/ 前缀形态）',
  pkgRaw.includes('node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs"'));
ok('package.json 链锚逐字（smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs"）',
  pkgRaw.includes('smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.32（startsWith）', changelog.startsWith('## v24.58'));
ok('CHANGELOG v24.32 条目含「石心的试炼」与「GOLEM_GOAL」与「锻灯师」',
  changelog.includes('石心的试炼') && changelog.includes('GOLEM_GOAL') && changelog.includes('锻灯师'));
ok('CHANGELOG 仍保留 v24.31 条目（历史保留）', changelog.includes('## v24.31'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(chainAll.map((f) => f.replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 256（255 + smoke_v2432_golemquest）', files.length === 282, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链（旧代 v24.31 pin 全库零残留）——
const leftovers = [];
for (const f of files) {
  if (f === 'smoke_v2432_golemquest.mjs') continue;
  // 承 v24.31 同款豁免：上一版套件（smoke_v2431_elixirprog）按惯例在否定式断言里保留旧代字面量，
  // 属合法残留，豁免扫描。
  if (f === 'smoke_v2431_elixirprog.mjs') continue;
  const s = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s.includes("const GAME_VERSION = 'v24.31';") || s.includes("GAME_VERSION === 'v24.31'") ||
      s.includes("startsWith('## v24.31") || s.includes('入库（255 份）') ||
      s.includes('二百五十五件套（二百五十四件套清除）') || s.includes('testChain === 255') ||
      s.includes('fileCount === 255') || s.includes('files.length === 255') ||
      s.includes('chain.length === 254') || s.includes('第 255 份') ||
      s.includes('链尾为 smoke_v2431_elixirprog')) leftovers.push(f);
}
ok('全库测试零残留 v24.31 GAME_VERSION/顶 pin/255 口径（哨兵链·豁免上一版否定式）', leftovers.length === 0, leftovers.join(','));

console.log(`— v24.32 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
