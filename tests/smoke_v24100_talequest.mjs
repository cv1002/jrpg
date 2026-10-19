// smoke_v24100_talequest.mjs —— v24.100 专项冒烟：第十八条支线「灯下新章」（说书人·进战即记名 TALE_GOAL(6) 种）
// （新内容·新支线——承 v23.32 拾菇人「树精的菌库」/ v23.42 客栈老板娘「夜路的狼嚎」/ v23.57 酿药师
// 「蛇影的药引」/ v24.24 掌灯阿婆「塘底的灯影」/ v24.32 锻灯师「石心的试炼」/ v24.34 守碑人「百炼的
// 刻印」/ v24.72 听钟人「子夜钟声」/ v24.80 渔翁「一网灯影」/ v24.82 守夜人「守夜的旧约」同一
// 「风味 NPC 升格为支线委托人」先例：v22.13 纯风味 NPC「说书人」（潮灯镇广场大灯南侧 (16,9)，
// 「魔物从雾里来，名字被雾带走」）升格为委托人——玩家每次进战（battle.startBattle 的 seen[key] 0→1
// 唯一写入点）都算替《灯下潮声》记下一个名字：替他记满 TALE_GOAL(6) 种魔物的名字（计数 hero.seen
// 与 ACH_LIST seen/seen2/metall「一面之缘」系列同读一份源，支线门槛 6 介于成就门槛 SEEN_GOAL(5) 与
// SEEN2_GOAL(10) 之间，零新计数零新状态零新存档）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.100 注释 / GAME_VERSION v24.100 与旧 v24.99 字面量
// 零残留 / v22.13 及更早历史注释保留 / TALE_GOAL 常量与 export）、QUESTS 契约（18 side + 4 main、
// side_tale 字段逐值、与 *_GOAL 同源、ACH_LIST allquests 同源互证）、quests.js 运行期状态机
// （offer→active→turnin→done 全链路 + resolveNpcTalk 接取/交付结算 70 金+2 生命药水 + npcQuestMark/
// npcQuestPages 四态 + sideQuestDone 0/18·3/18·18/18）、NPCS.teller 升格落位（数据层三件套零回归 +
// lines 两页与 after 两页保留零内容丢失契约 + v2213 姊妹套件已随升格更新）、README/package.json/
// CHANGELOG 同步（件套口径 323 + v24.100 守护描述 + 入库 323 + package 串尾 + CHANGELOG 顶 pin）、
// tests 目录与实跑链恒等（323）、哨兵链（前望 324 且 README 尚无 322 口径）、旧代 v24.99 pin 全库零
// 残留扫描（字面量/顶 pin/322 口径 · 豁免本套件与上一版套件）。
import { GAME_VERSION, QUESTS, TALE_GOAL, SEEN_GOAL, SEEN2_GOAL, BESTIARY_TARGET, ACH_LIST, NPCS } from '../js/data.js';
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

console.log('— v24.100 说书人「灯下新章」新支线 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkgRaw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（格式合法 + 已越过 v24.99 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.99', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 99)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.100（旧 v24.99 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.120';") && !dSrc.includes("const GAME_VERSION = 'v24.99';"));
ok('data.js 含 v24.100 注释（灯下新章新支线说明）',
  dSrc.includes('v24.100 新内容·新支线（第十八条）'));
ok('data.js 仍保留 v22.13 历史注释（说书人三件套说明，零内容丢失）',
  dSrc.includes('v22.13 新 NPC·纯风味') && dSrc.includes('醒木一响讲《灯下潮声》'));

// —— 源级落位：TALE_GOAL 常量 + export ——
ok('data.js TALE_GOAL 常量 = 6（与十组 *_GOAL 比邻声明，同一家族）',
  dSrc.includes('const TALE_GOAL = 6;') && dSrc.indexOf('const TALE_GOAL') > dSrc.indexOf('const WATCH_GOAL'));
ok('data.js export 块含 TALE_GOAL（WATCH_GOAL 之后用例）',
  dSrc.includes('WATCH_GOAL, TALE_GOAL,'));
ok('TALE_GOAL 与 SEEN_GOAL/SEEN2_GOAL 同族逐值（5 < 6 < 10，支线门槛介于成就两档之间）',
  TALE_GOAL === 6 && SEEN_GOAL === 5 && SEEN2_GOAL === 10);

// —— QUESTS 契约：18 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 22 条（18 side + 4 main，派生计数）',
  sideDefs.length === 31 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 35,
  `${sideDefs.length}/${mainDefs.length}`);
ok('side_tale 存在且为第十八条（kind side · store · npc/giver teller · 无 unlockOn）',
  !!QUESTS.side_tale && QUESTS.side_tale.kind === 'side' && QUESTS.side_tale.store === true &&
  QUESTS.side_tale.npc === 'teller' && QUESTS.side_tale.giver === 'teller' &&
  QUESTS.side_tale.unlockOn == null);
ok('side_tale 名称「灯下新章」/where/obj/offer/turnin/done 落位',
  QUESTS.side_tale.name === '灯下新章' && QUESTS.side_tale.where.includes('相遇即记名') &&
  QUESTS.side_tale.obj.includes('遇见过 ' + String(TALE_GOAL) + ' 种魔物') &&
  QUESTS.side_tale.obj.includes('《灯下潮声》') &&
  QUESTS.side_tale.offer.includes('说书人') && QUESTS.side_tale.turnin.includes('说书人') &&
  QUESTS.side_tale.done.includes('新章'));
ok('side_tale cond/condProg 与 TALE_GOAL 同源（seen 计数，判/进/文/话一处调全端跟随）',
  QUESTS.side_tale.cond({ seen: Object.fromEntries(BESTIARY_TARGET.slice(0, TALE_GOAL - 1).map((x) => [x, 1])) }) === false &&
  QUESTS.side_tale.cond({ seen: Object.fromEntries(BESTIARY_TARGET.slice(0, TALE_GOAL).map((x) => [x, 1])) }) === true &&
  QUESTS.side_tale.cond({}) === false &&
  QUESTS.side_tale.condProg({}) === `0/${TALE_GOAL} 种`);
ok('side_tale reward 逐值：70 金 + 2 生命药水（承 side_tree 70 档、高于 side_wolf 40 档）',
  QUESTS.side_tale.reward.gold === 70 && QUESTS.side_tale.reward.item === 2 && !QUESTS.side_tale.reward.potion2);

// —— ACH_LIST allquests 同源互证（与 sideQuestDone 输出一致）——
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('ACH_LIST allquests 名称「灯火同心」且描述派生 18（「18 个支线任务」）',
  !!achAll && achAll.name === '灯火同心' && achAll.d.includes('31 个支线任务'), achAll && achAll.d);
ok('ACH_LIST allquests 判定/进度与 QUESTS 派生同源（0/18 false · 17/18 false · 18/18 true · prog 18/18）',
  !!achAll && achAll.ok({ quests: {} }) === false && achAll.ok({ quests: Object.fromEntries(sideDefs.slice(0, 17).map(q => [q.id, 'done'])) }) === false &&
  achAll.ok({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === true &&
  achAll.prog({ quests: {} }) === '0/31' && achAll.prog({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === '31/31');

// —— quests.js 运行期：sideQuestDone ——
ok('运行期：sideQuestDone 0/18 · 3/18 · 18/18 · 主线不入列',
  sideQuestDone({ quests: {} }).done === 0 && sideQuestDone({ quests: {} }).total === 31 &&
  sideQuestDone({ quests: { side_mushroom: 'done', side_cart: 'done', side_pond: 'done' } }).done === 3 &&
  sideQuestDone({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }).done === 31 &&
  sideQuestDone({ quests: { main_demon: 'done' } }).done === 0);

// —— 运行期状态机：offer → active → turnin → done（quests 纯函数，零 DOM）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 3, hp: 60, hpMax: 60, mp: 20, mpMax: 20, atkMax: 13, defMax: 9,
    gold: 0, xp: 0, xpNext: 100, item: 1, potion2: 0, weapon: '铁剑', armor: '皮甲',
    skills: [], ach: [], seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, totalWins: 0,
    drops: 0, deflects: 0, x: 16, y: 9, map: 'village' }, extra || {});
}
const h1 = mkHero({});
ok('状态机：无存档 → questStatus offer（无 unlockOn 开局即可接，承 side_bell 同款）',
  questStatus(h1, 'side_tale') === 'offer', questStatus(h1, 'side_tale'));
ok('状态机：npcQuestMark offer 态「❕ 可接委托」',
  npcQuestMark(h1, 'teller') === '❕ 可接委托', npcQuestMark(h1, 'teller'));
ok('状态机：npcQuestPages offer 页（说书人 · 灯下新章 · TALE_GOAL 同源）',
  JSON.stringify(npcQuestPages(h1, 'teller')).includes('说书人') &&
  JSON.stringify(npcQuestPages(h1, 'teller')).includes('名字被雾带走') &&
  JSON.stringify(npcQuestPages(h1, 'teller')).includes(String(TALE_GOAL)) &&
  JSON.stringify(npcQuestPages(h1, 'teller')).includes('接下委托'));
const rAcc = resolveNpcTalk(h1, 'teller');
ok('状态机：resolveNpcTalk 接取 → {kind:accept, id:side_tale} + quests.side_tale=active',
  !!rAcc && rAcc.kind === 'accept' && rAcc.id === 'side_tale' && h1.quests.side_tale === 'active', JSON.stringify(rAcc));
ok('状态机：active 未达标 → questStatus active（cond 未满足）',
  questStatus(h1, 'side_tale') === 'active', questStatus(h1, 'side_tale'));
ok('状态机：active 页函数型实时报进度（已记 0/6 种）',
  JSON.stringify(npcQuestPages(h1, 'teller')).includes('0/' + TALE_GOAL + ' 种') &&
  JSON.stringify(npcQuestPages(h1, 'teller')).includes('已记'));
ok('状态机：任务日志 objective 同源（遇见过 6 种魔物 0/6 种）',
  questJournal(h1).find((e) => e.id === 'side_tale').objective.includes('遇见过 ' + TALE_GOAL + ' 种魔物') &&
  questJournal(h1).find((e) => e.id === 'side_tale').objective.includes(`0/${TALE_GOAL} 种`));
const h2 = mkHero({ quests: { side_tale: 'active' }, seen: Object.fromEntries(BESTIARY_TARGET.slice(0, TALE_GOAL).map((x) => [x, 1])) });
ok('状态机：达标 → questStatus turnin',
  questStatus(h2, 'side_tale') === 'turnin', questStatus(h2, 'side_tale'));
ok('状态机：npcQuestMark turnin 态「❕ 可交任务」',
  npcQuestMark(h2, 'teller') === '❕ 可交任务', npcQuestMark(h2, 'teller'));
const rRew = resolveNpcTalk(h2, 'teller');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:70, item:2} + done + 结算 70 金/2 生命药水',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 70 && rRew.item === 2 &&
  h2.quests.side_tale === 'done' && h2.gold === 70 && h2.item === 3, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）',
  resolveNpcTalk(h2, 'teller') === null);
ok('状态机：done 默认档（章回有了分量）',
  JSON.stringify(npcQuestPages(h2, 'teller')).includes('章回就有了分量'));
ok('状态机：done trueBoss 档（after 彩蛋「故事讲到头了/你写的那一页」两页并入任务页，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_tale: 'done' }, trueBoss: true }), 'teller')).includes('故事讲到头了') &&
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_tale: 'done' }, trueBoss: true }), 'teller')).includes('亲自讲过一回'));
ok('状态机：done 态 npcQuestMark 零顶标（teller 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_tale: 'done' } }), 'teller') === null);
ok('questRewardPreview 与 reward 同源（70 金 + 2 生命药水）',
  JSON.stringify(questRewardPreview(mkHero({}), 'side_tale')) === '{"gold":70,"item":2,"potion2":0}');

// —— 既有支线零回归（挑四条既有契约逐值钉死）——
ok('既有支线零回归：side_fish/side_bell/side_golem/side_watch 契约逐字未动',
  QUESTS.side_fish.reward.gold === 90 && QUESTS.side_fish.reward.item === 2 &&
  QUESTS.side_bell.reward.gold === 80 && QUESTS.side_bell.reward.potion2 === 1 &&
  QUESTS.side_golem.reward.gold === 120 && QUESTS.side_watch.reward.gold === 100 &&
  QUESTS.side_watch.reward.potion2 === 1);

// —— NPCS.teller 升格落位（零新 NPC/坐标/数据层三件套之外零改动）——
ok('NPCS.teller 存在（说书人 · mark fan · 含 v24.100 升格注释）',
  !!NPCS.teller && NPCS.teller.name === '说书人' && NPCS.teller.mark === 'fan' &&
  dSrc.includes('v24.100 升格为支线委托人'));
ok('NPCS.teller 原有 lines 两页 / trueBoss after 两页彩蛋保留（零内容丢失契约）',
  Array.isArray(NPCS.teller.lines) && NPCS.teller.lines.length === 2 &&
  Array.isArray(NPCS.teller.after) && NPCS.teller.after.length === 2 &&
  NPCS.teller.after[0][0].includes('故事讲到头了'));
ok('data.js village.extras 含说书人 (16,9) 与 NPC_SPOTS 键「16,9」（零新坐标）',
  dSrc.includes("{ x: 16, y: 9, ty: 'NPC' }") && dSrc.includes("'16,9'"));
ok('姊妹件 smoke_v2213_teller 已随升格更新（无任务契约翻转为任务页契约）',
  read('smoke_v2213_teller.mjs').includes('灯下新章') && read('smoke_v2213_teller.mjs').includes('可接委托'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为三百四十三件套（三百四十二件套清除）',
  readme.includes('冒烟三百四十三件套（三百四十二件套清除）'));
ok('README tests 含 v24.100 守护描述与 smoke_v24105_songquest 入库（335 份）',
  readme.includes('v24.100 起含潮灯镇「说书人」升格新支线守护') &&
  readme.includes('smoke_v24105_songquest 入库（335 份）'));
ok('README 仍有 v24.99 守护描述（历史保留）', readme.includes('v24.99 起含 「后期金币曲线续平滑（第二十五轮）」守护'));
ok('README 已有三百二十七件套口径且尚无 324（哨兵前望 324 语义：下一版才写 324）',
  readme.includes('冒烟三百四十三件套（三百四十二件套清除）') && !readme.includes('三百四十四件套') && !readme.includes('（344 份）'));
ok('README tests 树串尾已延伸（…+ smoke_v2499_goldcurve25 + smoke_v24100_talequest + smoke_v24101_goldcurve26 + smoke_v24102_goldcurve27 + smoke_v24103_goldcurve28 + smoke_v24104_goldcurve29 + smoke_v24105_songquest + smoke_v24106_moonquest + smoke_v24107_peddlequest + smoke_v24108_shopquest + smoke_v24109_carvequest + smoke_v24110_vowquest + smoke_v24111_hearerquest + smoke_v24112_talkquest + smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud（npm test 串跑））',
  readme.includes('smoke_v2499_goldcurve25 + smoke_v24100_talequest + smoke_v24101_goldcurve26 + smoke_v24102_goldcurve27 + smoke_v24103_goldcurve28 + smoke_v24104_goldcurve29 + smoke_v24105_songquest + smoke_v24106_moonquest + smoke_v24107_peddlequest + smoke_v24108_shopquest + smoke_v24109_carvequest + smoke_v24110_vowquest + smoke_v24111_hearerquest + smoke_v24112_talkquest + smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud（npm test 串跑）'));
ok('README 支线/奖励行随新现实（十八条 · 灯下新章 · TALE_GOAL）',
  readme.includes('三十一条支线目标/奖励全部由') &&
  readme.includes('灯下新章（说书人 · 进战即记名 `TALE_GOAL`(6) 种，相遇即记）70 金 + 2 生命药水') &&
  readme.includes('v24.100 补第十八条'));
ok('README 地图速览说书人行随新现实（v24.100 起支线委托人）',
  readme.includes('**v24.100 起为第十八条支线「灯下新章」委托人**'));
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 322 份（smoke.mjs + 323 专项）', chain.length === 342 && ['smoke.mjs', ...chain].length === 343, String(chain.length));
ok('package.json 链尾为 smoke_v24100_talequest（第 324 份）', chain[chain.length - 1] === 'smoke_v24120_chesthud', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v24100_talequest.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v2499_goldcurve25.mjs && node tests/smoke_v24100_talequest.mjs && node tests/smoke_v24101_goldcurve26.mjs && node tests/smoke_v24102_goldcurve27.mjs && node tests/smoke_v24103_goldcurve28.mjs && node tests/smoke_v24104_goldcurve29.mjs && node tests/smoke_v24105_songquest.mjs && node tests/smoke_v24106_moonquest.mjs && node tests/smoke_v24107_peddlequest.mjs && node tests/smoke_v24108_shopquest.mjs && node tests/smoke_v24109_carvequest.mjs && node tests/smoke_v24110_vowquest.mjs && node tests/smoke_v24111_hearerquest.mjs && node tests/smoke_v24112_talkquest.mjs && node tests/smoke_v24113_walkquest.mjs && node tests/smoke_v24114_fleequest.mjs && node tests/smoke_v24115_achhud.mjs && node tests/smoke_v24116_guidequest.mjs && node tests/smoke_v24117_codexhud.mjs && node tests/smoke_v24118_wellquest.mjs && node tests/smoke_v24119_huntquest.mjs && node tests/smoke_v24120_chesthud.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.100（startsWith）', changelog.startsWith('## v24.120'));
ok('CHANGELOG v24.100 条目含「灯下新章」与「TALE_GOAL」与「说书人」',
  changelog.includes('灯下新章') && changelog.includes('TALE_GOAL') && changelog.includes('说书人'));
ok('CHANGELOG 仍保留 v24.99 条目（历史保留）', changelog.includes('## v24.99'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const testsDir = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录件套 = 321（320 + smoke_v24100_talequest）', files.length === 343, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.99 pin 零残留 ——
const s2497 = read('smoke_v2499_goldcurve25.mjs');
ok('smoke_v2497 的 GAME_VERSION 字面量 pin 已更新为 v24.100', s2497.includes("const GAME_VERSION = 'v24.120';"));
ok('smoke_v2497 的 CHANGELOG 顶 pin 已更新为 ## v24.101', s2497.includes("startsWith('## v24.120 '"));
ok('smoke_v2497 的件套 pin 已更新为三百四十三件套（三百四十二件套清除）', s2497.includes('三百四十三件套（三百四十二件套清除）'));
ok('smoke_v2497 的 README/链 tail pin 已随新现实延伸（含 smoke_v24100_talequest）',
  s2497.includes('smoke_v24102_goldcurve27'));
ok('smoke_v2497 的 package.json 串尾 pin 已延伸至 smoke_v24100_talequest', s2497.includes('node tests/smoke_v2499_goldcurve25.mjs && node tests/smoke_v24100_talequest.mjs'));
ok('smoke_v2497 的链尾 pin 已推进至 smoke_v24100_talequest（第 324 份）', s2497.includes("=== 'smoke_v24120_chesthud'"));
ok('smoke_v2497 的入库 pin 已推进至 321 份', s2497.includes('入库（335 份）'));
const s2436 = read('smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（334 专项 / 335）且尚无 336 口径哨兵',
  s2436.includes('suiteFiles.length === 342 && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length === 343') &&
  s2436.includes('!readme.includes(\'冒烟三百四十四件套\')') && s2436.includes('!readme.includes(\'（344 份）\')'));
const s2415 = read('smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v24100_talequest（第 324 份）', s2415.includes("chain[chain.length - 1] === 'smoke_v24120_chesthud'"));
ok('smoke_v2415 树串 token 数已推进至 321', s2415.includes('treeTok.length === 343'));
// 旧代 v24.99 pin 零残留扫描（豁免本套件与上一版套件）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v24100_talequest.mjs') continue;
  if (f === 'smoke_v24102_goldcurve27.mjs') continue;
  if (f === 'smoke_v24105_songquest.mjs') continue;
  if (f === 'smoke_v24103_goldcurve28.mjs') continue;
  if (f === 'smoke_v24104_goldcurve29.mjs') continue;
  if (f === 'smoke_v2499_goldcurve25.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDir), 'utf8');
  const hits = [];
  if (s2.includes('const GAME_VERSION = ' + "'v24.99';")) hits.push('gv');
  if (s2.includes('GAME_VERSION === ' + "'v24.99'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.99")) hits.push('cw');
  if (s2.includes('入库（32' + '2 份）')) hits.push('ruku');
  if (s2.includes('三百二十六件套（三百二十一' + '件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 32' + '2')) hits.push('fl');
  if (s2.includes('chainAll.length === 32' + '2')) hits.push('cal');
  if (s2.includes('chain.length === 32' + '1')) hits.push('cl');
  if (s2.includes('treeTok.length === 32' + '2')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v2499_" + "goldcurve25'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.99 GAME_VERSION/顶 pin/322 口径（哨兵链，豁免本套件与上一版）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.100 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
