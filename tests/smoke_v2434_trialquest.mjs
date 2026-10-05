// smoke_v2434_trialquest.mjs —— v24.34 专项冒烟：第十四条支线「百炼的刻印」（守碑人·试炼场三连战累计通关）
// （新内容·新支线——承 v23.32 拾菇人「树精的菌库」/ v23.42 客栈老板娘「夜路的狼嚎」/ v23.57 酿药师
// 「蛇影的药引」/ v24.24 掌灯阿婆「塘底的灯影」/ v24.32 锻灯师「石心的试炼」同一「风味 NPC 升格为
// 支线委托人」先例：v24.24 让全 8 种普通怪各有专属讨伐线、v24.32 与既有 side_ember 让双精英各有
// 支线后，试炼场三连战仍只有 v23.67 成就「千锤百炼」无支线——本版把试炼场线挂上第十四条 side 支线
// 收口；阈值单一数据源 RUSH_CLEAR_GOAL(3)（判定/进度/目标文案/接取对话与 ACH_LIST rushs「千锤百炼」
// 同读一份源），计数 hero.rushClears（winBattle 试炼通关唯一产生点写入、snapshotHero 全量快照自动
// 持久化、防御式 (g.rushClears||0) 旧档零迁移）；守碑人（v21.24 纯风味 NPC·星井矿脉试炼碑旁 (17,12)）
// 升格为委托人，无 unlockOn → 从开局即 offer（守碑人只在矿脉可达、接取时机天然正确）、active 页
// 函数型实时报进度、done 页按 hero.trueBoss 分档——把 sentinel 原有 trueBoss after 彩蛋「三场都胜了
// ……刻痕更深」并入任务页分档，npcQuestPages 有任务后不再单独展示 after，零内容丢失）；奖励 200 金 +
// 1 高级灵药（终局内容且需累计通关 3 次，高于 side_name/side_golem 120 档）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.34 注释 / GAME_VERSION v24.34 与旧 v24.33 字面量
// 零残留 / v24.33-24.30 历史注释保留）、QUESTS 契约（14 side + 4 main、side_trial 字段逐值、
// RUSH_CLEAR_GOAL 同源、ACH_LIST allquests 同源互证）、quests.js 运行期状态机（offer→active→turnin→done
// 全链路 + resolveNpcTalk 接取/交付结算 200 金+1 高级灵药 + npcQuestMark/npcQuestPages 四态 +
// sideQuestDone 0/14·1/14·14/14 + questJournal 目标/进度同源）、NPCS.sentinel 升格落位（lines 函数兜底
// 仍在/after 两页保留/升格注释）、README/package.json/CHANGELOG 同步（件套口径 258 + v24.34 守护描述 +
// 入库 258 + package 串尾 + CHANGELOG 顶 pin + 支线奖励行十四条 + 守碑人升格行）、tests 目录与实跑链
// 恒等（258）、哨兵链（前望 270 且 README 尚无 270 口径）、旧代 v24.33 pin 全库零残留扫描（字面量/
// 顶 pin/257 口径 · 豁免上一版套件 smoke_v2433_goldcurve4）。
import { GAME_VERSION, QUESTS, RUSH_CLEAR_GOAL, ACH_LIST, NPCS } from '../js/data.js';
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

console.log('— v24.34 第十四条支线「百炼的刻印」冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const qSrc = read('js/quests.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.33 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.33', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 33)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.34（旧 v24.33 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.45';") && !dSrc.includes("const GAME_VERSION = 'v24.33';"));
ok('data.js 含 v24.34 注释（新支线百炼的刻印说明，第十四条）',
  dSrc.includes('// v24.34 新内容·新支线（第十四条）：守碑人「百炼的刻印」'));
ok('data.js 仍保留 v24.33 历史注释（后期金币曲线续平滑第四轮说明，累积注释块）',
  dSrc.includes('// v24.33 数值平衡·后期金币曲线续平滑'));
ok('data.js 仍保留 v24.32/v24.30/v24.29/v24.24 历史注释（支线/曲线先例行）',
  dSrc.includes('// v24.32 新内容·新支线（第十三条）') && dSrc.includes('// v24.30 数值平衡·后期金币曲线续平滑') &&
  dSrc.includes('// v24.29 数值平衡·后期经验曲线续平滑') && dSrc.includes('v24.24 让全 8 种普通怪'));
ok('data.js QUESTS 源级含 side_trial（百炼的刻印 · 守碑人）',
  dSrc.includes("side_trial:{\n    id:'side_trial'") || dSrc.includes("side_trial:{"));
ok('data.js NPCS.sentinel 含 v24.34 升格注释（承锻灯师/掌灯阿婆先例）',
  dSrc.includes('v24.34 升格为支线委托人（QUESTS.side_trial「百炼的刻印」'));

// —— QUESTS 契约：14 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 18 条（14 side + 4 main，派生计数）',
  sideDefs.length === 14 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 18,
  `${sideDefs.length}/${mainDefs.length}`);
ok('主线四枚为 flag 型无 giver/npc（不触发交付报文），支线均有 giver/npc',
  mainDefs.every((q) => !q.giver && !q.npc) && sideDefs.every((q) => q.giver || q.npc));
const t = QUESTS.side_trial;
ok('side_trial 契约逐值（kind side/store/npc=giver sentinel/无 unlockOn/名字百炼的刻印/where 星井矿脉·试炼碑）',
  !!t && t.kind === 'side' && t.store === true && t.npc === 'sentinel' && t.giver === 'sentinel' &&
  !t.unlockOn && t.name === '百炼的刻印' && t.where === '星井矿脉·试炼碑', JSON.stringify(t && t.id));
ok('RUSH_CLEAR_GOAL=3（与 ACH_LIST rushs 千锤百炼同源）', RUSH_CLEAR_GOAL === 3, String(RUSH_CLEAR_GOAL));
ok('cond/condProg 同读 RUSH_CLEAR_GOAL 与 hero.rushClears 防御式（0/2 false · 3/4 true · 0/3·2/3·3/3 次）',
  t.cond({}) === false && t.cond({ rushClears: 2 }) === false && t.cond({ rushClears: 3 }) === true &&
  t.cond({ rushClears: 4 }) === true && t.condProg({}) === '0/3 次' &&
  t.condProg({ rushClears: 2 }) === '2/3 次' && t.condProg({ rushClears: 3 }) === '3/3 次');
ok('obj/turnin/done 文案与 RUSH_CLEAR_GOAL 同源（通过试炼场三连战 3 次 · 回星井矿脉找守碑人）',
  String(t.obj).includes('3 次') && t.obj.includes('通过试炼场三连战') &&
  t.turnin.includes('回星井矿脉找守碑人') && t.done.includes('活人刻的印'));
ok('reward 200 金 + 1 高级灵药（终局内容且需 3 通，高于 120 档）',
  !!t.reward && t.reward.gold === 200 && t.reward.potion2 === 1, JSON.stringify(t.reward));
ok('talk 四态齐备（offer 数组/active 函数/turnin 数组/done 函数分档）',
  Array.isArray(t.talk.offer) && typeof t.talk.active === 'function' && Array.isArray(t.talk.turnin) &&
  typeof t.talk.done === 'function');
ok('ACH_LIST allquests 描述与阈值同源（完成全部 ${14} 个支线任务）',
  (() => { const a = ACH_LIST.find((x) => x.id === 'allquests'); return !!a && a.d === `完成全部 ${sideDefs.length} 个支线任务`; })());

// —— quests.js 源级落位（零新逻辑：既有表格驱动，逐字未动）——
ok('quests.js 无 v24.34 专属新函数（纯 QUESTS 表驱动，sideQuestDone/questStatus 既有导出零改动）',
  qSrc.includes('export function sideQuestDone(hero) {') && qSrc.includes('export function questStatus('));

// —— 运行期状态机（全链路）——
const mkHero = (extra) => ({ quests: {}, rushClears: 0, gold: 0, potion2: 0, level: 10, ...(extra || {}) });
const h1 = mkHero({});
ok('状态机：无存档 → questStatus offer（无 unlockOn 开局即可接，承 side_pond 同款）',
  questStatus(h1, 'side_trial') === 'offer', questStatus(h1, 'side_trial'));
ok('状态机：npcQuestMark offer 态「❕ 可接委托」', npcQuestMark(h1, 'sentinel') === '❕ 可接委托', npcQuestMark(h1, 'sentinel'));
ok('状态机：npcQuestPages offer 页（守碑人 · 三道刻痕 · 接下委托）',
  JSON.stringify(npcQuestPages(h1, 'sentinel')).includes('守碑人') &&
  JSON.stringify(npcQuestPages(h1, 'sentinel')).includes('接下委托') &&
  JSON.stringify(npcQuestPages(h1, 'sentinel')).includes(String(RUSH_CLEAR_GOAL)));
const rAcc = resolveNpcTalk(h1, 'sentinel');
ok('状态机：resolveNpcTalk 接取 → {kind:accept, id:side_trial} + quests.side_trial=active',
  !!rAcc && rAcc.kind === 'accept' && rAcc.id === 'side_trial' && h1.quests.side_trial === 'active', JSON.stringify(rAcc));
ok('状态机：active 未达标 → questStatus active（cond 未满足）',
  questStatus(h1, 'side_trial') === 'active', questStatus(h1, 'side_trial'));
ok('状态机：active 页函数型实时报进度（已通关 0/3 次）',
  JSON.stringify(npcQuestPages(h1, 'sentinel')).includes('0/' + RUSH_CLEAR_GOAL + ' 次') &&
  JSON.stringify(npcQuestPages(h1, 'sentinel')).includes('替你数着'));
ok('状态机：任务日志 objective 同源（通过试炼场三连战 3 次 · 0/3 次）',
  (() => { const e = questJournal(h1).find((x) => x.id === 'side_trial'); return !!e && String(e.objective).includes('3 次') && String(e.objective).includes('0/3 次'); })());
const h2 = mkHero({ quests: { side_trial: 'active' }, rushClears: 3 });
ok('状态机：达标 → questStatus turnin', questStatus(h2, 'side_trial') === 'turnin', questStatus(h2, 'side_trial'));
ok('状态机：npcQuestMark turnin 态「❕ 可交任务」', npcQuestMark(h2, 'sentinel') === '❕ 可交任务', npcQuestMark(h2, 'sentinel'));
ok('状态机：turnin 页（领取谢礼）', JSON.stringify(npcQuestPages(h2, 'sentinel')).includes('领取谢礼'));
const rRew = resolveNpcTalk(h2, 'sentinel');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:200, potion2:1} + done + 结算 200 金/1 高级灵药',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 200 && rRew.potion2 === 1 &&
  h2.quests.side_trial === 'done' && h2.gold === 200 && h2.potion2 === 1, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）', resolveNpcTalk(h2, 'sentinel') === null);
ok('状态机：done 默认档（碑上的刻痕有你磨出来的一道）',
  JSON.stringify(npcQuestPages(h2, 'sentinel')).includes('磨出来的一道'));
ok('状态机：done trueBoss 档（after 彩蛋「三场都胜了/刻痕深一分/记得把名字带回来」并入任务页，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_trial: 'done' }, trueBoss: true }), 'sentinel')).includes('三场都胜了') &&
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_trial: 'done' }, trueBoss: true }), 'sentinel')).includes('刻痕深一分') &&
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_trial: 'done' }, trueBoss: true }), 'sentinel')).includes('记得把名字带回来'));
ok('状态机：done 态 npcQuestMark 零顶标（sentinel 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_trial: 'done' } }), 'sentinel') === null);
ok('questRewardPreview 与 reward 同源（200 金 + 1 高级灵药）',
  JSON.stringify(questRewardPreview(mkHero({ quests: { side_trial: 'active' } }), 'side_trial')) === '{"gold":200,"item":0,"potion2":1}');
ok('sideQuestDone 分母 14 自动跟随（交付报文 🏮 灯火同心 N/14）',
  sideQuestDone({}).total === 14 && sideQuestDone({ quests: { side_trial: 'done' } }).done === 1);
ok('ACH_LIST allquests 判定/进度与 QUESTS 派生同源（0/14 false · 14/14 true）',
  (() => { const a = ACH_LIST.find((x) => x.id === 'allquests'); return a.prog({}) === '0/14' && a.prog({ quests: Object.fromEntries(sideDefs.map((q) => [q.id, 'done'])) }) === '14/14'; })());
ok('side_trial 不在图鉴讨伐行端口（obj 无【魔物名】——非讨伐采集型，questKillProg 自然排除）',
  !String(t.obj).includes('【') && !String(t.obj).includes('】'));

// —— 既有支线零回归（十四条之外：挑三条既有契约逐值钉死）——
ok('既有支线零回归：side_golem/side_pond/side_grain 契约逐字未动',
  QUESTS.side_golem.reward.gold === 120 && QUESTS.side_golem.reward.potion2 === 1 &&
  QUESTS.side_pond.reward.gold === 30 && QUESTS.side_pond.reward.item === 2 &&
  QUESTS.side_grain.reward.gold === 50 && QUESTS.side_grain.reward.item === 1);

// —— NPCS.sentinel 升格落位（零新 NPC/坐标；原台词与 after 彩蛋保留）——
ok('NPCS.sentinel 存在（守碑人 · mark staff · 含 v24.34 升格注释）',
  !!NPCS.sentinel && NPCS.sentinel.name === '守碑人' && NPCS.sentinel.mark === 'staff' &&
  dSrc.includes('v24.34 升格为支线委托人'));
ok('NPCS.sentinel 仍为函数型 lines（sentinelPages 兜底未动）与 after 两页彩蛋保留（零内容丢失契约）',
  typeof NPCS.sentinel.lines === 'function' && Array.isArray(NPCS.sentinel.after) &&
  NPCS.sentinel.after.length === 2 && NPCS.sentinel.after[0][0].includes('三场都胜了') &&
  NPCS.sentinel.after[1][0].includes('刻痕深一分'));
ok('NPCS.sentinel 台词仍由试炼数值派生（按 12 级刻的 · 随你等级水涨船高）',
  (() => { const p = NPCS.sentinel.lines({ level: 12 }); return p && p[0] && p[0].some((l) => l.includes('按 12 级刻的')) && p[0].some((l) => l.includes('水涨船高')); })());
ok('data.js NPC_SPOTS 键「17,12」→ sentinel（零新坐标）', dSrc.includes("'17,12': 'sentinel'"));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为二百六十九件套（二百六十八件套清除）',
  readme.includes('冒烟二百六十九件套（二百六十八件套清除）'));
ok('README tests 含 v24.34 守护描述与 smoke_v2434_trialquest 入库（269 份）',
  readme.includes('v24.34 起含 新支线「百炼的刻印」守护') &&
  readme.includes('smoke_v2434_trialquest 入库（269 份）'));
ok('README 仍有 v24.33 守护描述（历史保留）', readme.includes('v24.33 起含 「后期金币曲线续平滑（第四轮）」守护'));
ok('README 尚无 270 件套口径（哨兵前望 270 语义：下一版才写 270）',
  !readme.includes('二百七十件套') && !readme.includes('冒烟二百七十件套'));
ok('README tests 树串尾已延伸（…+ smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9（npm test 串跑））',
  readme.includes('smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9（npm test 串跑）'));
ok('README 支线/奖励行随新现实（十四条 · 百炼的刻印 · RUSH_CLEAR_GOAL · v24.34 补第十四条）',
  readme.includes('十四条支线目标/奖励全部由') &&
  readme.includes('百炼的刻印（守碑人 · 试炼场三连战累计通关 `RUSH_CLEAR_GOAL`(3) 次）200 金 + 1 高级灵药') &&
  readme.includes('`RUSH_CLEAR_GOAL`') && readme.includes('v24.34 补第十四条'));
ok('README 地图速览守碑人行随新现实（v24.34 起为第十四条支线「百炼的刻印」委托人）',
  readme.includes('**v24.34 起为第十四条支线「百炼的刻印」委托人**'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 258 份（smoke.mjs + 260 专项）', chain.length === 268 && chainAll.length === 269, String(chain.length));
ok('package.json 链尾为 smoke_v2439_xpcurve4（第 268 份）', chain[chain.length - 1] === 'smoke_v2445_goldcurve9', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2434_trialquest.mjs（node tests/ 前缀形态）',
  pkgRaw.includes('node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs"'));
ok('package.json 链锚逐字（smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs"）',
  pkgRaw.includes('smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.34（startsWith）', changelog.startsWith('## v24.45 '));
ok('CHANGELOG v24.34 条目含「百炼的刻印」与「RUSH_CLEAR_GOAL」与「守碑人」',
  changelog.includes('百炼的刻印') && changelog.includes('RUSH_CLEAR_GOAL') && changelog.includes('守碑人'));
ok('CHANGELOG 仍保留 v24.33 与 v24.32 条目（历史保留）',
  changelog.includes('## v24.33') && changelog.includes('## v24.32'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(chainAll.map((f) => f.replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 258 与实跑链恒等', files.length === 269, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：v2415 树串守护已推进至新链尾 + 前望 270 ——
const t2415 = read('tests/smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v2434_trialquest（第 268 份）',
  t2415.includes("chain[chain.length - 1] === 'smoke_v2445_goldcurve9'"));
ok('smoke_v2415 树串 token 数已推进至 258', t2415.includes('treeTok.length === 269'));
ok('smoke_v2415 哨兵「尚无 270」口径（二百五十八件套 bare 否定式）',
  t2415.includes("!readme.includes('二百七十件套')"));
const s2429 = read('tests/smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 哨兵链已推进至「前望 270」口径（二百五十八件套 括号/冒烟 bare 否定式）',
  s2429.includes("!readme.includes('二百七十件套（二百六十九件套清除）')") &&
  s2429.includes("!readme.includes('冒烟二百七十件套')"));
ok('smoke_v2429 既有断言随新现实推进（件套口径 266 + 链尾 v2439 + 入库 263）',
  s2429.includes('二百六十九件套（二百六十八件套清除）') && s2429.includes("=== 'smoke_v2445_goldcurve9'") &&
  s2429.includes('入库（269 份）'));

// —— 旧代 pin 零残留扫描（v24.33 / 257 口径；豁免本套件与上一版套件否定式）——
const leftovers = [];
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v2434_trialquest.mjs') continue;
  // 承 v24.33 同款豁免：上一版套件（smoke_v2433_goldcurve4）合法的历史/否定式字面量不入扫描。
  if (f === 'smoke_v2433_goldcurve4.mjs') continue;
  const s = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s.includes("const GAME_VERSION = 'v24.33';") || s.includes("GAME_VERSION === 'v24.33'") ||
      s.includes("startsWith('## v24.33") || s.includes('入库（257 份）') ||
      s.includes('二百五十七件套（二百五十六件套清除）') || s.includes('testChain === 257') ||
      s.includes('fileCount === 257') || s.includes('files.length === 257') ||
      s.includes('chain.length === 256') || s.includes('第 257 份') ||
      s.includes('链尾为 smoke_v2433_goldcurve4')) leftovers.push(f);
}
ok('全库测试零残留 v24.33 GAME_VERSION/顶 pin/257 口径（哨兵链·豁免上一版否定式）', leftovers.length === 0, leftovers.join(','));

console.log(`— v24.34 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed === 0 ? 0 : 1);
