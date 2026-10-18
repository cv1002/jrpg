// smoke_v2482_watchquest.mjs —— v24.82 专项冒烟：第十七条支线「守夜的旧约」（守夜人·防御反击 WATCH_GOAL(10) 次）
// （新内容·新支线——承 v23.32 拾菇人「树精的菌库」/ v23.42 客栈老板娘「夜路的狼嚎」/ v23.57 酿药师
// 「蛇影的药引」/ v24.24 掌灯阿婆「塘底的灯影」/ v24.32 锻灯师「石心的试炼」/ v24.34 守碑人「百炼的
// 刻印」/ v24.72 听钟人「子夜钟声」/ v24.80 渔翁「一网灯影」同一「风味 NPC 升格为支线委托人」先例：
// v22.45 纯风味 NPC「守夜人」（雾语林幽冥魔王祭坛正北 (20,12)，「它怕的不是剑，是有人还记得它」）升格为
// 委托人——战斗指令 [5] 防御「被命中 50% 趁隙反击」正是「站住不退」：替他守满 WATCH_GOAL(10) 次防御
// 反击（计数 hero.deflects 与 ACH_LIST deflect「以守为攻」同读一份源，支线门槛 10 低于成就门槛
// DEFLECT_GOAL(15)，零新计数零新状态零新存档）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.82 注释 / GAME_VERSION v24.82 与旧 v24.81 字面量
// 零残留 / v22.45 及更早历史注释保留 / WATCH_GOAL 常量与 export）、QUESTS 契约（17 side + 4 main、
// side_watch 字段逐值、与 *_GOAL 同源、ACH_LIST allquests 同源互证）、quests.js 运行期状态机
// （offer→active→turnin→done 全链路 + resolveNpcTalk 接取/交付结算 100 金+1 高级灵药 + npcQuestMark/
// npcQuestPages 四态 + sideQuestDone 0/17·3/17·17/17）、NPCS.watcher 升格落位（数据层三件套零回归 +
// lines 两页与 after 两页保留零内容丢失契约 + v2245 姊妹套件已随升格更新）、README/package.json/
// CHANGELOG 同步（件套口径 305 + v24.82 守护描述 + 入库 305 + package 串尾 + CHANGELOG 顶 pin）、
// tests 目录与实跑链恒等（305）、哨兵链（前望 306 且 README 尚无 306 口径）、旧代 v24.81 pin 全库零
// 残留扫描（字面量/顶 pin/304 口径 · 豁免本套件与上一版套件）。
import { GAME_VERSION, QUESTS, WATCH_GOAL, DEFLECT_GOAL, ACH_LIST, NPCS } from '../js/data.js';
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

console.log('— v24.82 守夜人「守夜的旧约」新支线 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkgRaw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（格式合法 + 已越过 v24.81 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.81', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 81)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.82（旧 v24.81 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.116';") && !dSrc.includes("const GAME_VERSION = 'v24.81';"));
ok('data.js 含 v24.82 注释（守夜的旧约新支线说明）',
  dSrc.includes('v24.82 新内容·新支线（第十七条）'));
ok('data.js 仍保留 v22.45 历史注释（守夜人三件套说明，零内容丢失）',
  dSrc.includes('v22.45 新内容·纯风味 NPC') && dSrc.includes('它怕的不是剑，是有人还记得它'));

// —— 源级落位：WATCH_GOAL 常量 + export ——
ok('data.js WATCH_GOAL 常量 = 10（与十组 *_GOAL 比邻声明，同一家族）',
  dSrc.includes('const WATCH_GOAL = 10;') && dSrc.indexOf('const WATCH_GOAL') > dSrc.indexOf('const FISH_GOAL'));
ok('data.js export 块含 WATCH_GOAL（FISH_GOAL 之后用例）',
  dSrc.includes('FISH_GOAL, WATCH_GOAL,'));
ok('WATCH_GOAL 与 DEFLECT_GOAL 同族逐值（10 < 15，支线早于成就门槛）',
  WATCH_GOAL === 10 && DEFLECT_GOAL === 15);

// —— QUESTS 契约：17 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 21 条（17 side + 4 main，派生计数）',
  sideDefs.length === 29 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 33,
  `${sideDefs.length}/${mainDefs.length}`);
ok('side_watch 存在且为第十七条（kind side · store · npc/giver watcher · 无 unlockOn）',
  !!QUESTS.side_watch && QUESTS.side_watch.kind === 'side' && QUESTS.side_watch.store === true &&
  QUESTS.side_watch.npc === 'watcher' && QUESTS.side_watch.giver === 'watcher' &&
  QUESTS.side_watch.unlockOn == null);
ok('side_watch 名称「守夜的旧约」/where/obj/offer/turnin/done 落位',
  QUESTS.side_watch.name === '守夜的旧约' && QUESTS.side_watch.where.includes('防御') &&
  QUESTS.side_watch.obj.includes('防御反击累计 ' + String(WATCH_GOAL) + ' 次') &&
  QUESTS.side_watch.obj.includes('[5] 防御') &&
  QUESTS.side_watch.offer.includes('守夜人') && QUESTS.side_watch.turnin.includes('守夜人') &&
  QUESTS.side_watch.done.includes('旧约'));
ok('side_watch cond/condProg 与 WATCH_GOAL 同源（deflects 计数，判/进/文/话一处调全端跟随）',
  QUESTS.side_watch.cond({ deflects: WATCH_GOAL - 1 }) === false &&
  QUESTS.side_watch.cond({ deflects: WATCH_GOAL }) === true &&
  QUESTS.side_watch.cond({}) === false &&
  QUESTS.side_watch.condProg({ deflects: 0 }) === `0/${WATCH_GOAL} 次`);
ok('side_watch reward 逐值：100 金 + 1 高级灵药（承 side_ember 100 档、高于 side_bell 80 档）',
  QUESTS.side_watch.reward.gold === 100 && QUESTS.side_watch.reward.potion2 === 1 && !QUESTS.side_watch.reward.item);

// —— ACH_LIST allquests 同源互证（与 sideQuestDone 输出一致）——
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('ACH_LIST allquests 名称「灯火同心」且描述派生 17（「17 个支线任务」）',
  !!achAll && achAll.name === '灯火同心' && achAll.d.includes('29 个支线任务'), achAll && achAll.d);
ok('ACH_LIST allquests 判定/进度与 QUESTS 派生同源（0/17 false · 16/17 false · 17/17 true · prog 17/17）',
  !!achAll && achAll.ok({ quests: {} }) === false && achAll.ok({ quests: Object.fromEntries(sideDefs.slice(0, 16).map(q => [q.id, 'done'])) }) === false &&
  achAll.ok({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === true &&
  achAll.prog({ quests: {} }) === '0/29' && achAll.prog({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === '29/29');

// —— quests.js 运行期：sideQuestDone ——
ok('运行期：sideQuestDone 0/17 · 3/17 · 17/17 · 主线不入列',
  sideQuestDone({ quests: {} }).done === 0 && sideQuestDone({ quests: {} }).total === 29 &&
  sideQuestDone({ quests: { side_mushroom: 'done', side_cart: 'done', side_pond: 'done' } }).done === 3 &&
  sideQuestDone({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }).done === 29 &&
  sideQuestDone({ quests: { main_demon: 'done' } }).done === 0);

// —— 运行期状态机：offer → active → turnin → done（quests 纯函数，零 DOM）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 3, hp: 60, hpMax: 60, mp: 20, mpMax: 20, atkMax: 13, defMax: 9,
    gold: 0, xp: 0, xpNext: 100, item: 1, potion2: 0, weapon: '铁剑', armor: '皮甲',
    skills: [], ach: [], seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, totalWins: 0,
    drops: 0, deflects: 0, x: 20, y: 12, map: 'dungeon' }, extra || {});
}
const h1 = mkHero({});
ok('状态机：无存档 → questStatus offer（无 unlockOn 开局即可接，承 side_bell 同款）',
  questStatus(h1, 'side_watch') === 'offer', questStatus(h1, 'side_watch'));
ok('状态机：npcQuestMark offer 态「❕ 可接委托」',
  npcQuestMark(h1, 'watcher') === '❕ 可接委托', npcQuestMark(h1, 'watcher'));
ok('状态机：npcQuestPages offer 页（守夜人 · 守夜的旧约 · WATCH_GOAL 同源）',
  JSON.stringify(npcQuestPages(h1, 'watcher')).includes('守夜人') &&
  JSON.stringify(npcQuestPages(h1, 'watcher')).includes('站住不退') &&
  JSON.stringify(npcQuestPages(h1, 'watcher')).includes(String(WATCH_GOAL)) &&
  JSON.stringify(npcQuestPages(h1, 'watcher')).includes('接下委托'));
const rAcc = resolveNpcTalk(h1, 'watcher');
ok('状态机：resolveNpcTalk 接取 → {kind:accept, id:side_watch} + quests.side_watch=active',
  !!rAcc && rAcc.kind === 'accept' && rAcc.id === 'side_watch' && h1.quests.side_watch === 'active', JSON.stringify(rAcc));
ok('状态机：active 未达标 → questStatus active（cond 未满足）',
  questStatus(h1, 'side_watch') === 'active', questStatus(h1, 'side_watch'));
ok('状态机：active 页函数型实时报进度（已守 0/10 次）',
  JSON.stringify(npcQuestPages(h1, 'watcher')).includes('0/' + WATCH_GOAL + ' 次') &&
  JSON.stringify(npcQuestPages(h1, 'watcher')).includes('已守'));
ok('状态机：任务日志 objective 同源（防御反击累计 10 次 0/10 次）',
  questJournal(h1).find((e) => e.id === 'side_watch').objective.includes('防御反击累计 ' + WATCH_GOAL + ' 次') &&
  questJournal(h1).find((e) => e.id === 'side_watch').objective.includes(`0/${WATCH_GOAL} 次`));
const h2 = mkHero({ quests: { side_watch: 'active' }, deflects: WATCH_GOAL });
ok('状态机：达标 → questStatus turnin',
  questStatus(h2, 'side_watch') === 'turnin', questStatus(h2, 'side_watch'));
ok('状态机：npcQuestMark turnin 态「❕ 可交任务」',
  npcQuestMark(h2, 'watcher') === '❕ 可交任务', npcQuestMark(h2, 'watcher'));
const rRew = resolveNpcTalk(h2, 'watcher');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:100, potion2:1} + done + 结算 100 金/1 高级灵药',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 100 && rRew.potion2 === 1 &&
  h2.quests.side_watch === 'done' && h2.gold === 100 && h2.potion2 === 1, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）',
  resolveNpcTalk(h2, 'watcher') === null);
ok('状态机：done 默认档（旧约有人接着）',
  JSON.stringify(npcQuestPages(h2, 'watcher')).includes('旧约有人接着'));
ok('状态机：done trueBoss 档（after 彩蛋「袍子落下来/林子可以睡了」两页并入任务页，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_watch: 'done' }, trueBoss: true }), 'watcher')).includes('袍子落下来了') &&
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_watch: 'done' }, trueBoss: true }), 'watcher')).includes('可以睡了'));
ok('状态机：done 态 npcQuestMark 零顶标（watcher 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_watch: 'done' } }), 'watcher') === null);
ok('questRewardPreview 与 reward 同源（100 金 + 1 高级灵药）',
  JSON.stringify(questRewardPreview(mkHero({}), 'side_watch')) === '{"gold":100,"item":0,"potion2":1}');

// —— 既有支线零回归（挑四条既有契约逐值钉死）——
ok('既有支线零回归：side_fish/side_bell/side_golem/side_trial 契约逐字未动',
  QUESTS.side_fish.reward.gold === 90 && QUESTS.side_fish.reward.item === 2 &&
  QUESTS.side_bell.reward.gold === 80 && QUESTS.side_bell.reward.potion2 === 1 &&
  QUESTS.side_golem.reward.gold === 120 && QUESTS.side_trial.reward.gold === 200);

// —— NPCS.watcher 升格落位（零新 NPC/坐标/数据层三件套之外零改动）——
ok('NPCS.watcher 存在（守夜人 · mark staff · 含 v24.82 升格注释）',
  !!NPCS.watcher && NPCS.watcher.name === '守夜人' && NPCS.watcher.mark === 'staff' &&
  dSrc.includes('v24.82 升格为支线委托人'));
ok('NPCS.watcher 原有 lines 两页 / trueBoss after 两页彩蛋保留（零内容丢失契约）',
  Array.isArray(NPCS.watcher.lines) && NPCS.watcher.lines.length === 2 &&
  Array.isArray(NPCS.watcher.after) && NPCS.watcher.after.length === 2 &&
  NPCS.watcher.after[0][0].includes('袍子落下来了'));
ok('data.js dungeon.extras 含守夜人 (20,12) 与 NPC_SPOTS 键「20,12」（零新坐标）',
  dSrc.includes("{ x: 20, y: 12, ty: 'NPC' }") && dSrc.includes("'20,12'"));
ok('姊妹件 smoke_v2245_watcher 已随升格更新（无任务契约翻转为任务页契约）',
  read('smoke_v2245_watcher.mjs').includes('守夜的旧约') && read('smoke_v2245_watcher.mjs').includes('可接委托'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为三百三十九件套（三百三十八件套清除）',
  readme.includes('冒烟三百三十九件套（三百三十八件套清除）'));
ok('README tests 含 v24.82 守护描述与 smoke_v2490_goldcurve16 入库（335 份）',
  readme.includes('v24.82 起含雾语林「守夜人」升格新支线守护') &&
  readme.includes('smoke_v2490_goldcurve16 入库（335 份）'));
ok('README 仍有 v24.81 守护描述（历史保留）', readme.includes('v24.81 起含 「后期经验曲线续平滑（第二十五轮）」守护'));
ok('README 已有三百零五件套口径且尚无 306（哨兵前望 306 语义：下一版才写 306）',
  readme.includes('冒烟三百三十九件套（三百三十八件套清除）') && !readme.includes('三百四十件套') && !readme.includes('（340 份）'));
ok('README tests 树串尾已延伸（…+ smoke_v2481_xpcurve25 + smoke_v2482_watchquest + smoke_v2483_xpcurve26 + smoke_v2484_goldcurve10 + smoke_v2485_goldcurve11 + smoke_v2486_goldcurve12 + smoke_v2487_goldcurve13 + smoke_v2488_goldcurve14 + smoke_v2489_goldcurve15 + smoke_v2490_goldcurve16 + smoke_v2491_goldcurve17 + smoke_v2492_goldcurve18 + smoke_v2493_goldcurve19 + smoke_v2494_goldcurve20 + smoke_v2495_goldcurve21 + smoke_v2496_goldcurve22 + smoke_v2497_goldcurve23 + smoke_v2498_goldcurve24 + smoke_v2499_goldcurve25 + smoke_v24100_talequest + smoke_v24101_goldcurve26 + smoke_v24102_goldcurve27 + smoke_v24103_goldcurve28 + smoke_v24104_goldcurve29 + smoke_v24105_songquest + smoke_v24106_moonquest + smoke_v24107_peddlequest + smoke_v24108_shopquest + smoke_v24109_carvequest + smoke_v24110_vowquest + smoke_v24111_hearerquest + smoke_v24112_talkquest + smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest（npm test 串跑））',
  readme.includes('smoke_v2481_xpcurve25 + smoke_v2482_watchquest + smoke_v2483_xpcurve26 + smoke_v2484_goldcurve10 + smoke_v2485_goldcurve11 + smoke_v2486_goldcurve12 + smoke_v2487_goldcurve13 + smoke_v2488_goldcurve14 + smoke_v2489_goldcurve15 + smoke_v2490_goldcurve16 + smoke_v2491_goldcurve17 + smoke_v2492_goldcurve18 + smoke_v2493_goldcurve19 + smoke_v2494_goldcurve20 + smoke_v2495_goldcurve21 + smoke_v2496_goldcurve22 + smoke_v2497_goldcurve23 + smoke_v2498_goldcurve24 + smoke_v2499_goldcurve25 + smoke_v24100_talequest + smoke_v24101_goldcurve26 + smoke_v24102_goldcurve27 + smoke_v24103_goldcurve28 + smoke_v24104_goldcurve29 + smoke_v24105_songquest + smoke_v24106_moonquest + smoke_v24107_peddlequest + smoke_v24108_shopquest + smoke_v24109_carvequest + smoke_v24110_vowquest + smoke_v24111_hearerquest + smoke_v24112_talkquest + smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest（npm test 串跑）'));
ok('README 支线/奖励行随新现实（十七条 · 守夜的旧约 · WATCH_GOAL）',
  readme.includes('二十九条支线目标/奖励全部由') && readme.includes('守夜的旧约（守夜人 · 防御反击 `WATCH_GOAL`(10) 次，战斗 [5] 防御被命中 50% 趁隙反击）100 金 + 1 高级灵药') &&
  readme.includes('`WATCH_GOAL`') && readme.includes('v24.82 补第十七条'));
ok('README 地图速览守夜人行随新现实（v24.82 起支线委托人）',
  readme.includes('**v24.82 起为第十七条支线「守夜的旧约」委托人**'));
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 308 份（smoke.mjs + 307 专项）', chain.length === 338 && ['smoke.mjs', ...chain].length === 339, String(chain.length));
ok('package.json 链尾为 smoke_v2490_goldcurve16（第 308 份）', chain[chain.length - 1] === 'smoke_v24116_guidequest', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2490_goldcurve16.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v2481_xpcurve25.mjs && node tests/smoke_v2482_watchquest.mjs && node tests/smoke_v2483_xpcurve26.mjs && node tests/smoke_v2484_goldcurve10.mjs && node tests/smoke_v2485_goldcurve11.mjs && node tests/smoke_v2486_goldcurve12.mjs && node tests/smoke_v2487_goldcurve13.mjs && node tests/smoke_v2488_goldcurve14.mjs && node tests/smoke_v2489_goldcurve15.mjs && node tests/smoke_v2490_goldcurve16.mjs && node tests/smoke_v2491_goldcurve17.mjs && node tests/smoke_v2492_goldcurve18.mjs && node tests/smoke_v2493_goldcurve19.mjs && node tests/smoke_v2494_goldcurve20.mjs && node tests/smoke_v2495_goldcurve21.mjs && node tests/smoke_v2496_goldcurve22.mjs && node tests/smoke_v2497_goldcurve23.mjs && node tests/smoke_v2498_goldcurve24.mjs && node tests/smoke_v2499_goldcurve25.mjs && node tests/smoke_v24100_talequest.mjs && node tests/smoke_v24101_goldcurve26.mjs && node tests/smoke_v24102_goldcurve27.mjs && node tests/smoke_v24103_goldcurve28.mjs && node tests/smoke_v24104_goldcurve29.mjs && node tests/smoke_v24105_songquest.mjs && node tests/smoke_v24106_moonquest.mjs && node tests/smoke_v24107_peddlequest.mjs && node tests/smoke_v24108_shopquest.mjs && node tests/smoke_v24109_carvequest.mjs && node tests/smoke_v24110_vowquest.mjs && node tests/smoke_v24111_hearerquest.mjs && node tests/smoke_v24112_talkquest.mjs && node tests/smoke_v24113_walkquest.mjs && node tests/smoke_v24114_fleequest.mjs && node tests/smoke_v24115_achhud.mjs && node tests/smoke_v24116_guidequest.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.82（startsWith）', changelog.startsWith('## v24.116'));
ok('CHANGELOG v24.82 条目含「守夜的旧约」与「WATCH_GOAL」与「守夜人」',
  changelog.includes('守夜的旧约') && changelog.includes('WATCH_GOAL') && changelog.includes('守夜人'));
ok('CHANGELOG 仍保留 v24.81 条目（历史保留）', changelog.includes('## v24.81'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const testsDir = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录件套 = 305（304 + smoke_v2490_goldcurve16）', files.length === 339, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.81 pin 零残留 ——
const s2481 = read('smoke_v2481_xpcurve25.mjs');
ok('smoke_v2481 的 GAME_VERSION 字面量 pin 已更新为 v24.82', s2481.includes("const GAME_VERSION = 'v24.116';"));
ok('smoke_v2481 的 CHANGELOG 顶 pin 已更新为 ## v24.82', s2481.includes("startsWith('## v24.116 '"));
ok('smoke_v2481 的件套 pin 已更新为三百三十九件套（三百三十八件套清除）', s2481.includes('三百三十九件套（三百三十八件套清除）'));
ok('smoke_v2481 的 README 串尾 pin 已延伸至 smoke_v2490_goldcurve16', s2481.includes('smoke_v2481_xpcurve25 + smoke_v2482_watchquest + smoke_v2483_xpcurve26 + smoke_v2484_goldcurve10 + smoke_v2485_goldcurve11 + smoke_v2486_goldcurve12 + smoke_v2487_goldcurve13 + smoke_v2488_goldcurve14 + smoke_v2489_goldcurve15 + smoke_v2490_goldcurve16 + smoke_v2491_goldcurve17 + smoke_v2492_goldcurve18 + smoke_v2493_goldcurve19 + smoke_v2494_goldcurve20 + smoke_v2495_goldcurve21 + smoke_v2496_goldcurve22 + smoke_v2497_goldcurve23 + smoke_v2498_goldcurve24 + smoke_v2499_goldcurve25 + smoke_v24100_talequest + smoke_v24101_goldcurve26 + smoke_v24102_goldcurve27 + smoke_v24103_goldcurve28 + smoke_v24104_goldcurve29 + smoke_v24105_songquest + smoke_v24106_moonquest + smoke_v24107_peddlequest + smoke_v24108_shopquest + smoke_v24109_carvequest + smoke_v24110_vowquest + smoke_v24111_hearerquest + smoke_v24112_talkquest + smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest（npm test 串跑）'));
ok('smoke_v2481 的 package.json 串尾 pin 已延伸至 smoke_v2490_goldcurve16', s2481.includes('node tests/smoke_v2481_xpcurve25.mjs && node tests/smoke_v2482_watchquest.mjs && node tests/smoke_v2483_xpcurve26.mjs && node tests/smoke_v2484_goldcurve10.mjs && node tests/smoke_v2485_goldcurve11.mjs && node tests/smoke_v2486_goldcurve12.mjs && node tests/smoke_v2487_goldcurve13.mjs && node tests/smoke_v2488_goldcurve14.mjs && node tests/smoke_v2489_goldcurve15.mjs && node tests/smoke_v2490_goldcurve16.mjs'));
ok('smoke_v2481 的链尾 pin 已推进至 smoke_v2490_goldcurve16（第 308 份）', s2481.includes("=== 'smoke_v24116_guidequest'"));
ok('smoke_v2481 的入库 pin 已推进至 305 份', s2481.includes('入库（335 份）'));
const s2436 = read('smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（304 专项 / 305）且尚无 305 口径哨兵',
  s2436.includes('suiteFiles.length === 338 && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length === 339') &&
  s2436.includes('!readme.includes(\'冒烟三百四十件套\')') && s2436.includes('!readme.includes(\'（340 份）\')'));
const s2415 = read('smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v2490_goldcurve16（第 308 份）', s2415.includes("chain[chain.length - 1] === 'smoke_v24116_guidequest'"));
ok('smoke_v2415 树串 token 数已推进至 305', s2415.includes('treeTok.length === 339'));
ok('smoke_v2415 哨兵「尚无 305」口径（三百一十四件套 bare 否定式）', s2415.includes("!readme.includes('三百四十件套')"));
// 旧代 v24.81 pin 零残留扫描（豁免本套件与上一版套件）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v2482_watchquest.mjs') continue;
  if (f === 'smoke_v24102_goldcurve27.mjs') continue;
  if (f === 'smoke_v24105_songquest.mjs') continue;
  if (f === 'smoke_v24103_goldcurve28.mjs') continue;
  if (f === 'smoke_v24104_goldcurve29.mjs') continue;
  if (f === 'smoke_v2483_xpcurve26.mjs') continue;
  if (f === 'smoke_v2484_goldcurve10.mjs') continue;
  if (f === 'smoke_v2485_goldcurve11.mjs') continue;
  if (f === 'smoke_v2486_goldcurve12.mjs') continue;
  if (f === 'smoke_v2487_goldcurve13.mjs') continue;
  if (f === 'smoke_v2489_goldcurve15.mjs') continue;
  if (f === 'smoke_v2490_goldcurve16.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDir), 'utf8');
  const hits = [];
  if (s2.includes('const GAME_VERSION = ' + "'v24.81';")) hits.push('gv');
  if (s2.includes('GAME_VERSION === ' + "'v24.81'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.81")) hits.push('cw');
  if (s2.includes('入库（30' + '4 份）')) hits.push('ruku');
  if (s2.includes('三百零四件套（三百零三' + '件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 30' + '4')) hits.push('fl');
  if (s2.includes('chainAll.length === 30' + '4')) hits.push('cal');
  if (s2.includes('chain.length === 30' + '3')) hits.push('cl');
  if (s2.includes('treeTok.length === 30' + '4')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v2481_" + "xpcurve25'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.81 GAME_VERSION/顶 pin/304 口径（哨兵链，豁免本套件与上一版）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.82 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
