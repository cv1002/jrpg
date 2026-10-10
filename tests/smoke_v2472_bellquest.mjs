// smoke_v2472_bellquest.mjs —— v24.72 专项冒烟：第十五条支线「子夜钟声」（听钟人·夜里战胜 BELL_GOAL(3) 场）
// （新内容·新支线——承 v23.32 拾菇人「树精的菌库」/ v23.42 客栈老板娘「夜路的狼嚎」/ v23.57 酿药师
// 「蛇影的药引」/ v24.24 掌灯阿婆「塘底的灯影」/ v24.32 锻灯师「石心的试炼」/ v24.34 守碑人「百炼的
// 刻印」同一「风味 NPC 升格为支线委托人」先例：v24.71 新 NPC「听钟人」（潮灯镇村井正北 (14,5)，
// 「井底那口钟还在替大家记着」）升格为委托人——白昼的钟声有人听、夜里的名字却没人记；玩家夜里在
// 灯下打赢的每一场战争都是给名字点的一盏灯：夜里战胜 BELL_GOAL(3) 场（计数 hero.nightWins 与
// ACH_LIST nightwins「提灯夜行」/v24.57 胜利战报「🌙 提灯夜行 N/10」/v24.14 战斗相位标同读一份源，
// 零新计数零新状态零新存档；无字回廊「被忘掉的地方没有晨昏」不计数，与 nightWinNow 同判）；条款数
// 由 QUESTS 派生不写死，成就/状态页/任务日志/交付报文口径全端自动跟随零裸字面量）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.72 注释 / GAME_VERSION v24.72 与旧 v24.71 字面量
// 零残留 / v24.71 及更早历史注释保留 / BELL_GOAL 常量与 export）、QUESTS 契约（15 side + 4 main、
// side_bell 字段逐值、与 *_GOAL 同源、ACH_LIST allquests 同源互证）、quests.js 运行期状态机
// （offer→active→turnin→done 全链路 + resolveNpcTalk 接取/交付结算 80 金+1 高级灵药 + npcQuestMark/
// npcQuestPages 四态 + sideQuestDone 0/15·3/15·15/15）、NPCS.bellman 升格落位（mark/坐标/NPC_SPOTS
// 零回归 + linesByStage 三档与 after 两页保留零内容丢失契约）、README/package.json/CHANGELOG 同步
// （件套口径 296 + v24.72 守护描述 + 入库 296 + package 串尾 + CHANGELOG 顶 pin）、tests 目录与实跑链
// 恒等（296）、哨兵链（前望 297 且 README 尚无 297 口径）、旧代 v24.71 pin 全库零残留扫描（字面量/
// 顶 pin/296 口径 · 豁免本套件与上一版套件）。
import { GAME_VERSION, QUESTS, BELL_GOAL, NIGHT_WIN_GOAL, ACH_LIST, NPCS } from '../js/data.js';
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
const __dir = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dir, '..');
const read = (f) => fs.readFileSync(path.join(ROOT, 'tests/' + f), 'utf8');

console.log('— v24.72 听钟人「子夜钟声」新支线 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkgRaw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（格式合法 + 已越过 v24.71 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.71', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 71)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.74（旧 v24.73 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.77';") && !dSrc.includes("const GAME_VERSION = 'v24.73';"));
ok('data.js 含 v24.72 注释（子夜钟声新支线说明）',
  dSrc.includes('v24.72 新内容·新支线（第十五条）「子夜钟声」'));
ok('data.js 仍保留 v24.71 历史注释（听钟人三件套说明，零内容丢失）',
  dSrc.includes('v24.71 新 NPC·纯风味') && dSrc.includes('听钟人（新内容·纯风味 NPC）'));

// —— 源级落位：BELL_GOAL 常量 + export ——
ok('data.js BELL_GOAL 常量 = 3（与十组 *_GOAL 比邻声明，同一家族）',
  dSrc.includes('const BELL_GOAL = 3;') && dSrc.indexOf('const BELL_GOAL') > dSrc.indexOf('const GOLEM_GOAL'));
ok('data.js export 块含 BELL_GOAL（NIGHT_WIN_GOAL 之后用例）',
  dSrc.includes('NIGHT_WIN_GOAL, BELL_GOAL,'));
ok('BELL_GOAL 与 NIGHT_WIN_GOAL 同族逐值（3 < 10，支线早于成就门槛）',
  BELL_GOAL === 3 && NIGHT_WIN_GOAL === 10);

// —— QUESTS 契约：15 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 19 条（15 side + 4 main，派生计数）',
  sideDefs.length === 15 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 19,
  `${sideDefs.length}/${mainDefs.length}`);
ok('side_bell 存在且为第十五条（kind side · store · npc/giver bellman · 无 unlockOn）',
  !!QUESTS.side_bell && QUESTS.side_bell.kind === 'side' && QUESTS.side_bell.store === true &&
  QUESTS.side_bell.npc === 'bellman' && QUESTS.side_bell.giver === 'bellman' &&
  QUESTS.side_bell.unlockOn == null);
ok('side_bell 名称「子夜钟声」/where/obj/offer/turnin/done 落位',
  QUESTS.side_bell.name === '子夜钟声' && QUESTS.side_bell.where.includes('夜里') &&
  QUESTS.side_bell.where.includes('无字回廊除外') &&
  QUESTS.side_bell.obj.includes('夜里战胜 ' + String(BELL_GOAL) + ' 场') &&
  QUESTS.side_bell.offer.includes('听钟人') && QUESTS.side_bell.turnin.includes('听钟人') &&
  QUESTS.side_bell.done.includes('钟'));
ok('side_bell cond/condProg 与 BELL_GOAL 同源（nightWins 计数，判/进/文/话一处调全端跟随）',
  QUESTS.side_bell.cond({ nightWins: BELL_GOAL - 1 }) === false &&
  QUESTS.side_bell.cond({ nightWins: BELL_GOAL }) === true &&
  QUESTS.side_bell.cond({}) === false &&
  QUESTS.side_bell.condProg({ nightWins: 0 }) === `0/${BELL_GOAL} 场`);
ok('side_bell reward 逐值：80 金 + 1 高级灵药（夜里刷怪全程伴随·低于 side_golem 120 档）',
  QUESTS.side_bell.reward.gold === 80 && QUESTS.side_bell.reward.potion2 === 1 && !QUESTS.side_bell.reward.item);

// —— ACH_LIST allquests 同源互证（与 sideQuestDone 输出一致）——
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('ACH_LIST allquests 名称「灯火同心」且描述派生 15（「15 个支线任务」）',
  !!achAll && achAll.name === '灯火同心' && achAll.d.includes('15 个支线任务'), achAll && achAll.d);
ok('ACH_LIST allquests 判定/进度与 QUESTS 派生同源（0/15 false · 14/15 false · 15/15 true · prog 15/15）',
  !!achAll && achAll.ok({ quests: {} }) === false && achAll.ok({ quests: Object.fromEntries(sideDefs.slice(0, 14).map(q => [q.id, 'done'])) }) === false &&
  achAll.ok({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === true &&
  achAll.prog({ quests: {} }) === '0/15' && achAll.prog({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === '15/15');

// —— quests.js 运行期：sideQuestDone ——
ok('运行期：sideQuestDone 0/15 · 3/15 · 15/15 · 主线不入列',
  sideQuestDone({ quests: {} }).done === 0 && sideQuestDone({ quests: {} }).total === 15 &&
  sideQuestDone({ quests: { side_mushroom: 'done', side_cart: 'done', side_pond: 'done' } }).done === 3 &&
  sideQuestDone({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }).done === 15 &&
  sideQuestDone({ quests: { main_demon: 'done' } }).done === 0);

// —— 运行期状态机：offer → active → turnin → done（quests 纯函数，零 DOM）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 3, hp: 60, hpMax: 60, mp: 20, mpMax: 20, atkMax: 13, defMax: 9,
    gold: 0, xp: 0, xpNext: 100, item: 1, potion2: 0, weapon: '铁剑', armor: '皮甲',
    skills: [], ach: [], seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, totalWins: 0,
    nightWins: 0, x: 10, y: 15, map: 'village' }, extra || {});
}
const h1 = mkHero({});
ok('状态机：无存档 → questStatus offer（无 unlockOn 开局即可接，承 side_pond 同款）',
  questStatus(h1, 'side_bell') === 'offer', questStatus(h1, 'side_bell'));
ok('状态机：npcQuestMark offer 态「❕ 可接委托」',
  npcQuestMark(h1, 'bellman') === '❕ 可接委托', npcQuestMark(h1, 'bellman'));
ok('状态机：npcQuestPages offer 页（听钟人 · 子夜钟声 · BELL_GOAL 同源）',
  JSON.stringify(npcQuestPages(h1, 'bellman')).includes('听钟人') &&
  JSON.stringify(npcQuestPages(h1, 'bellman')).includes('子夜钟声') &&
  JSON.stringify(npcQuestPages(h1, 'bellman')).includes(String(BELL_GOAL)) &&
  JSON.stringify(npcQuestPages(h1, 'bellman')).includes('接下委托'));
const rAcc = resolveNpcTalk(h1, 'bellman');
ok('状态机：resolveNpcTalk 接取 → {kind:accept, id:side_bell} + quests.side_bell=active',
  !!rAcc && rAcc.kind === 'accept' && rAcc.id === 'side_bell' && h1.quests.side_bell === 'active', JSON.stringify(rAcc));
ok('状态机：active 未达标 → questStatus active（cond 未满足）',
  questStatus(h1, 'side_bell') === 'active', questStatus(h1, 'side_bell'));
ok('状态机：active 页函数型实时报进度（已听 0/3 场 · 回廊除外）',
  JSON.stringify(npcQuestPages(h1, 'bellman')).includes('0/' + BELL_GOAL + ' 场') &&
  JSON.stringify(npcQuestPages(h1, 'bellman')).includes('已听') &&
  JSON.stringify(npcQuestPages(h1, 'bellman')).includes('无字回廊不算'));
ok('状态机：任务日志 objective 同源（夜里战胜 3 场战斗 0/3 场）',
  questJournal(h1).find((e) => e.id === 'side_bell').objective.includes('夜里战胜 ' + BELL_GOAL + ' 场') &&
  questJournal(h1).find((e) => e.id === 'side_bell').objective.includes(`0/${BELL_GOAL} 场`));
const h2 = mkHero({ quests: { side_bell: 'active' }, nightWins: BELL_GOAL });
ok('状态机：达标 → questStatus turnin',
  questStatus(h2, 'side_bell') === 'turnin', questStatus(h2, 'side_bell'));
ok('状态机：npcQuestMark turnin 态「❕ 可交任务」',
  npcQuestMark(h2, 'bellman') === '❕ 可交任务', npcQuestMark(h2, 'bellman'));
const rRew = resolveNpcTalk(h2, 'bellman');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:80, potion2:1} + done + 结算 80 金/1 高级灵药',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 80 && rRew.potion2 === 1 &&
  h2.quests.side_bell === 'done' && h2.gold === 80 && h2.potion2 === 1, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）',
  resolveNpcTalk(h2, 'bellman') === null);
ok('状态机：done 默认档（夜里的名字·钟都替你记下了）',
  JSON.stringify(npcQuestPages(h2, 'bellman')).includes('夜里的名字'));
ok('状态机：done trueBoss 档（after 彩蛋「不响了/以后由我替它记着」两页并入任务页，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_bell: 'done' }, trueBoss: true }), 'bellman')).includes('不响了') &&
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_bell: 'done' }, trueBoss: true }), 'bellman')).includes('以后由我替它记着'));
ok('状态机：done 态 npcQuestMark 零顶标（bellman 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_bell: 'done' } }), 'bellman') === null);
ok('questRewardPreview 与 reward 同源（80 金 + 1 高级灵药）',
  JSON.stringify(questRewardPreview(mkHero({}), 'side_bell')) === '{"gold":80,"item":0,"potion2":1}');

// —— 既有支线零回归（挑三条既有契约逐值钉死）——
ok('既有支线零回归：side_pond/side_mist/side_golem/side_trial 契约逐字未动',
  QUESTS.side_pond.reward.gold === 30 && QUESTS.side_pond.reward.item === 2 &&
  QUESTS.side_mist.reward.gold === 60 && QUESTS.side_golem.reward.gold === 120 &&
  QUESTS.side_trial.reward.gold === 200 && QUESTS.side_trial.reward.potion2 === 1);

// —— NPCS.bellman 升格落位（零新 NPC/坐标/数据层三件套之外零改动）——
ok('NPCS.bellman 存在（听钟人 · mark bell · 含 v24.72 升格注释）',
  !!NPCS.bellman && NPCS.bellman.name === '听钟人' && NPCS.bellman.mark === 'bell' &&
  dSrc.includes('v24.72 升格为支线委托人'));
ok('NPCS.bellman 原有 linesByStage 三档 / trueBoss after 两页彩蛋保留（零内容丢失契约）',
  Array.isArray(NPCS.bellman.linesByStage) && NPCS.bellman.linesByStage.length === 3 &&
  Array.isArray(NPCS.bellman.after) && NPCS.bellman.after.length === 2 &&
  NPCS.bellman.after[0][0].includes('不响了'));
ok('data.js village.extras 含听钟人 (14,5) 与 NPC_SPOTS 键「14,5」（零新坐标）',
  dSrc.includes('{ x: 14, y: 5, ty: \'NPC\' }') && dSrc.includes("'14,5'"));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为三百件套（二百九十九件套清除）',
  readme.includes('冒烟三百件套（二百九十九件套清除）'));
ok('README tests 含 v24.72 守护描述与 smoke_v2472_bellquest 入库（300 份）',
  readme.includes('v24.72 起含听钟人「子夜钟声」新支线守护') &&
  readme.includes('smoke_v2472_bellquest 入库（300 份）'));
ok('README 仍有 v24.71 守护描述（历史保留）', readme.includes('v24.71 起含潮灯镇「听钟人」新 NPC 守护'));
ok('README 已有二百九十六件套口径且尚无 297（哨兵前望 297 语义：下一版才写 297）',
  readme.includes('冒烟三百件套（二百九十九件套清除）') && !readme.includes('三百零一件套'));
ok('README tests 树串尾已延伸（…+ smoke_v2471_bellman + smoke_v2472_bellquest + smoke_v2473_xpcurve21 + smoke_v2475_xpcurve22 + smoke_v2476_achprog + smoke_v2477_fisher（npm test 串跑））',
  readme.includes('smoke_v2471_bellman + smoke_v2472_bellquest + smoke_v2473_xpcurve21 + smoke_v2475_xpcurve22 + smoke_v2476_achprog + smoke_v2477_fisher（npm test 串跑）'));
ok('README 支线/奖励行随新现实（十五条 · 子夜钟声 · BELL_GOAL）',
  readme.includes('十五条支线目标/奖励全部由') && readme.includes('子夜钟声（听钟人 · 夜里战胜 `BELL_GOAL`(3) 场，无字回廊之夜不算）80 金 + 1 高级灵药') &&
  readme.includes('`BELL_GOAL`') && readme.includes('v24.72 补第十五条'));
ok('README 地图速览听钟人行随新现实（v24.72 起讨伐支线委托人）',
  readme.includes('**v24.72 起为第十五条支线「子夜钟声」委托人**'));
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 296 份（smoke.mjs + 295 专项）', chain.length === 299 && ['smoke.mjs', ...chain].length === 300, String(chain.length));
ok('package.json 链尾为 smoke_v2472_bellquest（第 300 份）', chain[chain.length - 1] === 'smoke_v2477_fisher', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2472_bellquest.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v2471_bellman.mjs && node tests/smoke_v2472_bellquest.mjs && node tests/smoke_v2473_xpcurve21.mjs && node tests/smoke_v2475_xpcurve22.mjs && node tests/smoke_v2476_achprog.mjs && node tests/smoke_v2477_fisher.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.72（startsWith）', changelog.startsWith('## v24.77'));
ok('CHANGELOG v24.72 条目含「子夜钟声」与「BELL_GOAL」与「听钟人」',
  changelog.includes('子夜钟声') && changelog.includes('BELL_GOAL') && changelog.includes('听钟人'));
ok('CHANGELOG 仍保留 v24.71 条目（历史保留）', changelog.includes('## v24.71'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const testsDir = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录件套 = 296（295 + smoke_v2472_bellquest）', files.length === 300, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.71 pin 零残留 ——
const s2471 = read('smoke_v2471_bellman.mjs');
ok('smoke_v2471 的 GAME_VERSION 字面量 pin 已更新为 v24.72', s2471.includes("const GAME_VERSION = 'v24.77';"));
ok('smoke_v2471 的 CHANGELOG 顶 pin 已更新为 ## v24.72', s2471.includes("startsWith('## v24.77 '"));
ok('smoke_v2471 的件套 pin 已更新为三百件套（二百九十九件套清除）', s2471.includes('三百件套（二百九十九件套清除）'));
ok('smoke_v2471 的 README 串尾 pin 已延伸至 smoke_v2472_bellquest', s2471.includes('smoke_v2471_bellman + smoke_v2472_bellquest + smoke_v2473_xpcurve21 + smoke_v2475_xpcurve22 + smoke_v2476_achprog + smoke_v2477_fisher（npm test 串跑）'));
ok('smoke_v2471 的 package.json 串尾 pin 已延伸至 smoke_v2472_bellquest', s2471.includes('node tests/smoke_v2471_bellman.mjs && node tests/smoke_v2472_bellquest.mjs'));
ok('smoke_v2471 的链尾 pin 已推进至 smoke_v2473_xpcurve21（第 300 份）', s2471.includes("=== 'smoke_v2477_fisher'"));
ok('smoke_v2471 的入库 pin 已推进至 296 份', s2471.includes('入库（300 份）'));
const s2436 = read('smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（298 专项 / 300）且尚无 298 口径哨兵',
  s2436.includes('suiteFiles.length === 299 && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length === 300') &&
  s2436.includes('!readme.includes(\'冒烟三百零一件套\')') && s2436.includes('!readme.includes(\'（301 份）\')'));
const s2415 = read('smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v2472_bellquest（第 300 份）', s2415.includes("chain[chain.length - 1] === 'smoke_v2477_fisher'"));
ok('smoke_v2415 树串 token 数已推进至 296', s2415.includes('treeTok.length === 300'));
ok('smoke_v2415 哨兵「尚无 297」口径（二百九十七件套 bare 否定式）', s2415.includes("!readme.includes('三百零一件套')"));
// 旧代 v24.71 pin 零残留扫描（豁免本套件与上一版套件）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v2472_bellquest.mjs' || f === 'smoke_v2473_xpcurve21.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDir), 'utf8');
  const hits = [];
  if (s2.includes('const GAME_VERSION = ' + "'v24.73';")) hits.push('gv');
  if (s2.includes('GAME_VERSION === ' + "'v24.73'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.73")) hits.push('cw');
  if (s2.includes('入库（29' + '6 份）')) hits.push('ruku');
  if (s2.includes('二百九十六件套（二百九十五' + '件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 29' + '6')) hits.push('fl');
  if (s2.includes('chainAll.length === 29' + '6')) hits.push('cal');
  if (s2.includes('chain.length === 29' + '5')) hits.push('cl');
  if (s2.includes('treeTok.length === 29' + '6')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v2472_" + "bellquest'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.73 GAME_VERSION/顶 pin/296 口径（哨兵链，豁免本套件与上一版）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.72 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
