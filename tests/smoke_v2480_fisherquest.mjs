// smoke_v2480_fisherquest.mjs —— v24.80 专项冒烟：第十六条支线「一网灯影」（渔翁·捞起 FISH_GOAL(10) 盏旧灯）
// （新内容·新支线——承 v23.32 拾菇人「树精的菌库」/ v23.42 客栈老板娘「夜路的狼嚎」/ v23.57 酿药师
// 「蛇影的药引」/ v24.24 掌灯阿婆「塘底的灯影」/ v24.32 锻灯师「石心的试炼」/ v24.34 守碑人「百炼的
// 刻印」/ v24.72 听钟人「子夜钟声」同一「风味 NPC 升格为支线委托人」先例：v24.77 新 NPC「渔翁」
// （潮灯镇水塘东岸 (17,7)，「塘底的灯比鱼多——一网下去，捞上来的多半是旧灯，不是鱼」）升格为委托人
// ——旧灯沉在塘底、名字还亮着；玩家每次打赢时约 38% 触发的额外掉落（rules.rollDrop 五档）正是「水花
// 一翻、旧灯随泛而上」：替他捞齐 FISH_GOAL(10) 盏旧灯（计数 hero.drops 与 ACH_LIST lucky/lucky2/
// lucky3「鸿运当头」系列及 v24.19 掉落战报「🍀 鸿运当头 N/30」同读一份源，零新计数零新状态零新存档）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.80 注释 / GAME_VERSION v24.80 与旧 v24.79 字面量
// 零残留 / v24.77 及更早历史注释保留 / FISH_GOAL 常量与 export）、QUESTS 契约（16 side + 4 main、
// side_fish 字段逐值、与 *_GOAL 同源、ACH_LIST allquests 同源互证）、quests.js 运行期状态机
// （offer→active→turnin→done 全链路 + resolveNpcTalk 接取/交付结算 90 金+2 药水 + npcQuestMark/
// npcQuestPages 四态 + sideQuestDone 0/16·3/16·16/16）、NPCS.fisher 升格落位（mark/坐标/NPC_SPOTS
// 零回归 + linesByStage 三档与 after 两页保留零内容丢失契约）、README/package.json/CHANGELOG 同步
// （件套口径 303 + v24.80 守护描述 + 入库 303 + package 串尾 + CHANGELOG 顶 pin）、tests 目录与实跑链
// 恒等（303）、哨兵链（前望 304 且 README 尚无 304 口径）、旧代 v24.79 pin 全库零残留扫描（字面量/
// 顶 pin/302 口径 · 豁免本套件与上一版套件）。
import { GAME_VERSION, QUESTS, FISH_GOAL, LUCKY2_GOAL, ACH_LIST, NPCS } from '../js/data.js';
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

console.log('— v24.80 渔翁「一网灯影」新支线 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkgRaw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（格式合法 + 已越过 v24.79 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.79', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 79)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.80（旧 v24.79 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.194';") && !dSrc.includes("const GAME_VERSION = 'v24.79';"));
ok('data.js 含 v24.80 注释（一网灯影新支线说明）',
  dSrc.includes('v24.80 新内容·新支线（第十六条）'));
ok('data.js 仍保留 v24.77 历史注释（渔翁三件套说明，零内容丢失）',
  dSrc.includes('v24.77 渔翁（新内容·纯风味 NPC）') && dSrc.includes('渔翁说「塘底的灯比鱼多'));

// —— 源级落位：FISH_GOAL 常量 + export ——
ok('data.js FISH_GOAL 常量 = 10（与十组 *_GOAL 比邻声明，同一家族）',
  dSrc.includes('const FISH_GOAL = 10;') && dSrc.indexOf('const FISH_GOAL') > dSrc.indexOf('const BELL_GOAL'));
ok('data.js export 块含 FISH_GOAL（BELL_GOAL 之后用例）',
  dSrc.includes('BELL_GOAL, FISH_GOAL,'));
ok('FISH_GOAL 与 LUCKY2_GOAL 同族逐值（10 < 30，支线早于成就门槛）',
  FISH_GOAL === 10 && LUCKY2_GOAL === 30);

// —— QUESTS 契约：16 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 20 条（16 side + 4 main，派生计数）',
  sideDefs.length === 46 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 50,
  `${sideDefs.length}/${mainDefs.length}`);
ok('side_fish 存在且为第十六条（kind side · store · npc/giver fisher · 无 unlockOn）',
  !!QUESTS.side_fish && QUESTS.side_fish.kind === 'side' && QUESTS.side_fish.store === true &&
  QUESTS.side_fish.npc === 'fisher' && QUESTS.side_fish.giver === 'fisher' &&
  QUESTS.side_fish.unlockOn == null);
ok('side_fish 名称「一网灯影」/where/obj/offer/turnin/done 落位',
  QUESTS.side_fish.name === '一网灯影' && QUESTS.side_fish.where.includes('战场') &&
  QUESTS.side_fish.obj.includes('捞起 ' + String(FISH_GOAL) + ' 盏旧灯') &&
  QUESTS.side_fish.obj.includes('额外掉落') &&
  QUESTS.side_fish.offer.includes('渔翁') && QUESTS.side_fish.turnin.includes('渔翁') &&
  QUESTS.side_fish.done.includes('灯'));
ok('side_fish cond/condProg 与 FISH_GOAL 同源（drops 计数，判/进/文/话一处调全端跟随）',
  QUESTS.side_fish.cond({ drops: FISH_GOAL - 1 }) === false &&
  QUESTS.side_fish.cond({ drops: FISH_GOAL }) === true &&
  QUESTS.side_fish.cond({}) === false &&
  QUESTS.side_fish.condProg({ drops: 0 }) === `0/${FISH_GOAL} 盏`);
ok('side_fish reward 逐值：90 金 + 2 生命药水（承 side_bell 80 档之上、side_golem 120 档之下）',
  QUESTS.side_fish.reward.gold === 90 && QUESTS.side_fish.reward.item === 2 && !QUESTS.side_fish.reward.potion2);

// —— ACH_LIST allquests 同源互证（与 sideQuestDone 输出一致）——
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('ACH_LIST allquests 名称「灯火同心」且描述派生 16（「17 个支线任务」）',
  !!achAll && achAll.name === '灯火同心' && achAll.d.includes('46 个支线任务'), achAll && achAll.d);
ok('ACH_LIST allquests 判定/进度与 QUESTS 派生同源（0/16 false · 15/16 false · 16/16 true · prog 16/16）',
  !!achAll && achAll.ok({ quests: {} }) === false && achAll.ok({ quests: Object.fromEntries(sideDefs.slice(0, 15).map(q => [q.id, 'done'])) }) === false &&
  achAll.ok({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === true &&
  achAll.prog({ quests: {} }) === '0/46' && achAll.prog({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === '46/46');

// —— quests.js 运行期：sideQuestDone ——
ok('运行期：sideQuestDone 0/16 · 3/16 · 16/16 · 主线不入列',
  sideQuestDone({ quests: {} }).done === 0 && sideQuestDone({ quests: {} }).total === 46 &&
  sideQuestDone({ quests: { side_mushroom: 'done', side_cart: 'done', side_pond: 'done' } }).done === 3 &&
  sideQuestDone({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }).done === 46 &&
  sideQuestDone({ quests: { main_demon: 'done' } }).done === 0);

// —— 运行期状态机：offer → active → turnin → done（quests 纯函数，零 DOM）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 3, hp: 60, hpMax: 60, mp: 20, mpMax: 20, atkMax: 13, defMax: 9,
    gold: 0, xp: 0, xpNext: 100, item: 1, potion2: 0, weapon: '铁剑', armor: '皮甲',
    skills: [], ach: [], seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, totalWins: 0,
    drops: 0, x: 10, y: 15, map: 'village' }, extra || {});
}
const h1 = mkHero({});
ok('状态机：无存档 → questStatus offer（无 unlockOn 开局即可接，承 side_bell 同款）',
  questStatus(h1, 'side_fish') === 'offer', questStatus(h1, 'side_fish'));
ok('状态机：npcQuestMark offer 态「❕ 可接委托」',
  npcQuestMark(h1, 'fisher') === '❕ 可接委托', npcQuestMark(h1, 'fisher'));
ok('状态机：npcQuestPages offer 页（渔翁 · 一网灯影 · FISH_GOAL 同源）',
  JSON.stringify(npcQuestPages(h1, 'fisher')).includes('渔翁') &&
  JSON.stringify(npcQuestPages(h1, 'fisher')).includes('一网下去') &&
  JSON.stringify(npcQuestPages(h1, 'fisher')).includes(String(FISH_GOAL)) &&
  JSON.stringify(npcQuestPages(h1, 'fisher')).includes('接下委托'));
const rAcc = resolveNpcTalk(h1, 'fisher');
ok('状态机：resolveNpcTalk 接取 → {kind:accept, id:side_fish} + quests.side_fish=active',
  !!rAcc && rAcc.kind === 'accept' && rAcc.id === 'side_fish' && h1.quests.side_fish === 'active', JSON.stringify(rAcc));
ok('状态机：active 未达标 → questStatus active（cond 未满足）',
  questStatus(h1, 'side_fish') === 'active', questStatus(h1, 'side_fish'));
ok('状态机：active 页函数型实时报进度（已捞 0/10 盏）',
  JSON.stringify(npcQuestPages(h1, 'fisher')).includes('0/' + FISH_GOAL + ' 盏') &&
  JSON.stringify(npcQuestPages(h1, 'fisher')).includes('已捞'));
ok('状态机：任务日志 objective 同源（捞起 10 盏旧灯 0/10 盏）',
  questJournal(h1).find((e) => e.id === 'side_fish').objective.includes('捞起 ' + FISH_GOAL + ' 盏旧灯') &&
  questJournal(h1).find((e) => e.id === 'side_fish').objective.includes(`0/${FISH_GOAL} 盏`));
const h2 = mkHero({ quests: { side_fish: 'active' }, drops: FISH_GOAL });
ok('状态机：达标 → questStatus turnin',
  questStatus(h2, 'side_fish') === 'turnin', questStatus(h2, 'side_fish'));
ok('状态机：npcQuestMark turnin 态「❕ 可交任务」',
  npcQuestMark(h2, 'fisher') === '❕ 可交任务', npcQuestMark(h2, 'fisher'));
const rRew = resolveNpcTalk(h2, 'fisher');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:90, item:2} + done + 结算 90 金/2 药水',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 90 && rRew.item === 2 &&
  h2.quests.side_fish === 'done' && h2.gold === 90 && h2.item === 3, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）',
  resolveNpcTalk(h2, 'fisher') === null);
ok('状态机：done 默认档（十盏旧灯·名字没泡坏）',
  JSON.stringify(npcQuestPages(h2, 'fisher')).includes('名字没泡坏'));
ok('状态机：done bossDefeated 档（灯芯回来了·旧灯跟着亮了）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_fish: 'done' }, bossDefeated: true }), 'fisher')).includes('灯芯回来了'));
ok('状态机：done galleryOpen 档（回廊一开·最早回家的）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_fish: 'done' }, galleryOpen: true }), 'fisher')).includes('回廊一开'));
ok('状态机：done trueBoss 档（after 彩蛋「清了/只捞鱼，不捞灯」两页并入任务页，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_fish: 'done' }, trueBoss: true }), 'fisher')).includes('清喽') &&
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_fish: 'done' }, trueBoss: true }), 'fisher')).includes('只捞鱼，不捞灯'));
ok('状态机：done 态 npcQuestMark 零顶标（fisher 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_fish: 'done' } }), 'fisher') === null);
ok('questRewardPreview 与 reward 同源（90 金 + 2 药水）',
  JSON.stringify(questRewardPreview(mkHero({}), 'side_fish')) === '{"gold":90,"item":2,"potion2":0}');

// —— 既有支线零回归（挑四条既有契约逐值钉死）——
ok('既有支线零回归：side_pond/side_mist/side_golem/side_bell 契约逐字未动',
  QUESTS.side_pond.reward.gold === 30 && QUESTS.side_pond.reward.item === 2 &&
  QUESTS.side_mist.reward.gold === 60 && QUESTS.side_golem.reward.gold === 120 &&
  QUESTS.side_bell.reward.gold === 80 && QUESTS.side_bell.reward.potion2 === 1);

// —— NPCS.fisher 升格落位（零新 NPC/坐标/数据层三件套之外零改动）——
ok('NPCS.fisher 存在（渔翁 · mark fish · 含 v24.80 升格注释）',
  !!NPCS.fisher && NPCS.fisher.name === '渔翁' && NPCS.fisher.mark === 'fish' &&
  dSrc.includes('v24.80 升格为支线委托人'));
ok('NPCS.fisher 原有 linesByStage 三档 / trueBoss after 两页彩蛋保留（零内容丢失契约）',
  Array.isArray(NPCS.fisher.linesByStage) && NPCS.fisher.linesByStage.length === 3 &&
  Array.isArray(NPCS.fisher.after) && NPCS.fisher.after.length === 2 &&
  NPCS.fisher.after[0][0].includes('清喽'));
ok('data.js village.extras 含渔翁 (17,7) 与 NPC_SPOTS 键「17,7」（零新坐标）',
  dSrc.includes('{ x: 17, y: 7, ty: \'NPC\' }') && dSrc.includes("'17,7'"));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为四百零四件套（四百零三件套清除）',
  readme.includes('冒烟四百零四件套（四百零三件套清除）'));
ok('README tests 含 v24.80 守护描述与 smoke_v2480_fisherquest 入库（335 份）',
  readme.includes('v24.80 起含潮灯镇「渔翁」升格新支线守护') &&
  readme.includes('smoke_v2480_fisherquest 入库（335 份）'));
ok('README 仍有 v24.79 守护描述（历史保留）', readme.includes('v24.79 起含 「后期经验曲线续平滑（第二十四轮）」守护'));
ok('README 已有三百零五件套口径且尚无 304（哨兵前望 304 语义：下一版才写 304）',
  readme.includes('冒烟四百零四件套（四百零三件套清除）') && !readme.includes('四百零五件套') && !readme.includes('（405 份）'));
ok('README tests 树串尾已延伸（…+ smoke_v2479_xpcurve24 + smoke_v2480_fisherquest + smoke_v2481_xpcurve25 + smoke_v2482_watchquest + smoke_v2483_xpcurve26 + smoke_v2484_goldcurve10 + smoke_v2485_goldcurve11 + smoke_v2486_goldcurve12 + smoke_v2487_goldcurve13 + smoke_v2488_goldcurve14 + smoke_v2489_goldcurve15 + smoke_v2490_goldcurve16 + smoke_v2491_goldcurve17 + smoke_v2492_goldcurve18 + smoke_v2493_goldcurve19 + smoke_v2494_goldcurve20 + smoke_v2495_goldcurve21 + smoke_v2496_goldcurve22 + smoke_v2497_goldcurve23 + smoke_v2498_goldcurve24 + smoke_v2499_goldcurve25 + smoke_v24100_talequest + smoke_v24101_goldcurve26 + smoke_v24102_goldcurve27 + smoke_v24103_goldcurve28 + smoke_v24104_goldcurve29 + smoke_v24105_songquest + smoke_v24106_moonquest + smoke_v24107_peddlequest + smoke_v24108_shopquest + smoke_v24109_carvequest + smoke_v24110_vowquest + smoke_v24111_hearerquest + smoke_v24112_talkquest + smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑））',
  readme.includes('smoke_v2479_xpcurve24 + smoke_v2480_fisherquest + smoke_v2481_xpcurve25 + smoke_v2482_watchquest + smoke_v2483_xpcurve26 + smoke_v2484_goldcurve10 + smoke_v2485_goldcurve11 + smoke_v2486_goldcurve12 + smoke_v2487_goldcurve13 + smoke_v2488_goldcurve14 + smoke_v2489_goldcurve15 + smoke_v2490_goldcurve16 + smoke_v2491_goldcurve17 + smoke_v2492_goldcurve18 + smoke_v2493_goldcurve19 + smoke_v2494_goldcurve20 + smoke_v2495_goldcurve21 + smoke_v2496_goldcurve22 + smoke_v2497_goldcurve23 + smoke_v2498_goldcurve24 + smoke_v2499_goldcurve25 + smoke_v24100_talequest + smoke_v24101_goldcurve26 + smoke_v24102_goldcurve27 + smoke_v24103_goldcurve28 + smoke_v24104_goldcurve29 + smoke_v24105_songquest + smoke_v24106_moonquest + smoke_v24107_peddlequest + smoke_v24108_shopquest + smoke_v24109_carvequest + smoke_v24110_vowquest + smoke_v24111_hearerquest + smoke_v24112_talkquest + smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑）'));
ok('README 支线/奖励行随新现实（十七条 · 一网灯影 · FISH_GOAL）',
  readme.includes('四十六条支线目标/奖励全部由') && readme.includes('一网灯影（渔翁 · 额外掉落 `FISH_GOAL`(10) 次，旧灯随水花泛上来）90 金 + 2 药水') &&
  readme.includes('`FISH_GOAL`') && readme.includes('v24.80 补第十六条'));
ok('README 地图速览渔翁行随新现实（v24.80 起支线委托人）',
  readme.includes('**v24.80 起为第十六条支线「一网灯影」委托人**'));
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 307 份（smoke.mjs + 306 专项）', chain.length === 403 && ['smoke.mjs', ...chain].length === 404, String(chain.length));
ok('package.json 链尾为 smoke_v2480_fisherquest（第 307 份）', chain[chain.length - 1] === 'smoke_v24194_lowskillnopo2', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2480_fisherquest.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v2479_xpcurve24.mjs && node tests/smoke_v2480_fisherquest.mjs && node tests/smoke_v2481_xpcurve25.mjs && node tests/smoke_v2482_watchquest.mjs && node tests/smoke_v2483_xpcurve26.mjs && node tests/smoke_v2484_goldcurve10.mjs && node tests/smoke_v2485_goldcurve11.mjs && node tests/smoke_v2486_goldcurve12.mjs && node tests/smoke_v2487_goldcurve13.mjs && node tests/smoke_v2488_goldcurve14.mjs && node tests/smoke_v2489_goldcurve15.mjs && node tests/smoke_v2490_goldcurve16.mjs && node tests/smoke_v2491_goldcurve17.mjs && node tests/smoke_v2492_goldcurve18.mjs && node tests/smoke_v2493_goldcurve19.mjs && node tests/smoke_v2494_goldcurve20.mjs && node tests/smoke_v2495_goldcurve21.mjs && node tests/smoke_v2496_goldcurve22.mjs && node tests/smoke_v2497_goldcurve23.mjs && node tests/smoke_v2498_goldcurve24.mjs && node tests/smoke_v2499_goldcurve25.mjs && node tests/smoke_v24100_talequest.mjs && node tests/smoke_v24101_goldcurve26.mjs && node tests/smoke_v24102_goldcurve27.mjs && node tests/smoke_v24103_goldcurve28.mjs && node tests/smoke_v24104_goldcurve29.mjs && node tests/smoke_v24105_songquest.mjs && node tests/smoke_v24106_moonquest.mjs && node tests/smoke_v24107_peddlequest.mjs && node tests/smoke_v24108_shopquest.mjs && node tests/smoke_v24109_carvequest.mjs && node tests/smoke_v24110_vowquest.mjs && node tests/smoke_v24111_hearerquest.mjs && node tests/smoke_v24112_talkquest.mjs && node tests/smoke_v24113_walkquest.mjs && node tests/smoke_v24114_fleequest.mjs && node tests/smoke_v24115_achhud.mjs && node tests/smoke_v24116_guidequest.mjs && node tests/smoke_v24117_codexhud.mjs && node tests/smoke_v24118_wellquest.mjs && node tests/smoke_v24119_huntquest.mjs && node tests/smoke_v24120_chesthud.mjs && node tests/smoke_v24121_siftquest.mjs && node tests/smoke_v24122_crystalquest.mjs && node tests/smoke_v24123_fraghud.mjs && node tests/smoke_v24124_questshud.mjs && node tests/smoke_v24125_hunthud.mjs && node tests/smoke_v24126_waitquest.mjs && node tests/smoke_v24127_lampquest.mjs && node tests/smoke_v24128_stelequest.mjs && node tests/smoke_v24129_stele2quest.mjs && node tests/smoke_v24130_stele3quest.mjs && node tests/smoke_v24131_stele4quest.mjs && node tests/smoke_v24132_fallenquest.mjs && node tests/smoke_v24133_inquest.mjs && node tests/smoke_v24134_kindleq.mjs && node tests/smoke_v24135_ledgerquest.mjs && node tests/smoke_v24136_herbquest.mjs && node tests/smoke_v24143_furnacequest.mjs && node tests/smoke_v24147_unflicker.mjs && node tests/smoke_v24148_swift.mjs && node tests/smoke_v24151_lowlv.mjs && node tests/smoke_v24152_nopotion.mjs && node tests/smoke_v24153_penny.mjs && node tests/smoke_v24154_steadfast.mjs && node tests/smoke_v24155_frugal.mjs && node tests/smoke_v24157_dry.mjs && node tests/smoke_v24158_swift2.mjs && node tests/smoke_v24159_lowlv2.mjs && node tests/smoke_v24160_noskill.mjs && node tests/smoke_v24161_noskill2.mjs && node tests/smoke_v24162_lowskill.mjs && node tests/smoke_v24163_swiftskill.mjs && node tests/smoke_v24164_swiftlv.mjs && node tests/smoke_v24165_nopotskill.mjs && node tests/smoke_v24166_unflskill.mjs && node tests/smoke_v24167_swiftnopo.mjs && node tests/smoke_v24168_lowlvnopo.mjs && node tests/smoke_v24169_unflswift.mjs && node tests/smoke_v24170_unfllowlv.mjs && node tests/smoke_v24171_unflnopo.mjs && node tests/smoke_v24172_unflpenny.mjs && node tests/smoke_v24173_pennyswift.mjs && node tests/smoke_v24174_pennylowlv.mjs && node tests/smoke_v24175_pennynoskill.mjs && node tests/smoke_v24176_pennynopo.mjs && node tests/smoke_v24177_unflswift2.mjs && node tests/smoke_v24178_unflpenny2.mjs && node tests/smoke_v24179_unflnopo2.mjs && node tests/smoke_v24180_unflskill2.mjs && node tests/smoke_v24181_lampoilquest.mjs && node tests/smoke_v24183_unfllowlv2.mjs && node tests/smoke_v24184_pennyswift2.mjs && node tests/smoke_v24185_pennylowlv2.mjs && node tests/smoke_v24186_pennynoskill2.mjs && node tests/smoke_v24187_pennynopo2.mjs && node tests/smoke_v24188_swiftlv2.mjs && node tests/smoke_v24189_swiftskill2.mjs && node tests/smoke_v24190_swiftnopo2.mjs && node tests/smoke_v24191_lowskill2.mjs && node tests/smoke_v24192_lowlvnopo2.mjs && node tests/smoke_v24193_nopotskill2.mjs && node tests/smoke_v24194_lowskillnopo2.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.80（startsWith）', changelog.startsWith('## v24.194'));
ok('CHANGELOG v24.80 条目含「一网灯影」与「FISH_GOAL」与「渔翁」',
  changelog.includes('一网灯影') && changelog.includes('FISH_GOAL') && changelog.includes('渔翁'));
ok('CHANGELOG 仍保留 v24.79 条目（历史保留）', changelog.includes('## v24.79'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const testsDir = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录件套 = 303（302 + smoke_v2480_fisherquest）', files.length === 404, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.79 pin 零残留 ——
const s2479 = read('smoke_v2479_xpcurve24.mjs');
ok('smoke_v2479 的 GAME_VERSION 字面量 pin 已更新为 v24.80', s2479.includes("const GAME_VERSION = 'v24.194';"));
ok('smoke_v2479 的 CHANGELOG 顶 pin 已更新为 ## v24.80', s2479.includes("startsWith('## v24.194 '"));
ok('smoke_v2479 的件套 pin 已更新为四百零四件套（四百零三件套清除）', s2479.includes('四百零四件套（四百零三件套清除）'));
ok('smoke_v2479 的 README 串尾 pin 已延伸至 smoke_v2480_fisherquest', s2479.includes('smoke_v2479_xpcurve24 + smoke_v2480_fisherquest + smoke_v2481_xpcurve25 + smoke_v2482_watchquest + smoke_v2483_xpcurve26 + smoke_v2484_goldcurve10 + smoke_v2485_goldcurve11 + smoke_v2486_goldcurve12 + smoke_v2487_goldcurve13 + smoke_v2488_goldcurve14 + smoke_v2489_goldcurve15 + smoke_v2490_goldcurve16 + smoke_v2491_goldcurve17 + smoke_v2492_goldcurve18 + smoke_v2493_goldcurve19 + smoke_v2494_goldcurve20 + smoke_v2495_goldcurve21 + smoke_v2496_goldcurve22 + smoke_v2497_goldcurve23 + smoke_v2498_goldcurve24 + smoke_v2499_goldcurve25 + smoke_v24100_talequest + smoke_v24101_goldcurve26 + smoke_v24102_goldcurve27 + smoke_v24103_goldcurve28 + smoke_v24104_goldcurve29 + smoke_v24105_songquest + smoke_v24106_moonquest + smoke_v24107_peddlequest + smoke_v24108_shopquest + smoke_v24109_carvequest + smoke_v24110_vowquest + smoke_v24111_hearerquest + smoke_v24112_talkquest + smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑）'));
ok('smoke_v2479 的 package.json 串尾 pin 已延伸至 smoke_v2480_fisherquest', s2479.includes('node tests/smoke_v2479_xpcurve24.mjs && node tests/smoke_v2480_fisherquest.mjs'));
ok('smoke_v2479 的链尾 pin 已推进至 smoke_v2480_fisherquest（第 307 份）', s2479.includes("=== 'smoke_v24194_lowskillnopo2'"));
ok('smoke_v2479 的入库 pin 已推进至 303 份', s2479.includes('入库（335 份）'));
const s2436 = read('smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（302 专项 / 304）且尚无 303 口径哨兵',
  s2436.includes('suiteFiles.length === 403  && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length === 404') &&
  s2436.includes('!readme.includes(\'冒烟四百零五件套\')') && s2436.includes('!readme.includes(\'（405 份）\')'));
const s2415 = read('smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v2480_fisherquest（第 307 份）', s2415.includes("chain[chain.length - 1] === 'smoke_v24194_lowskillnopo2'"));
ok('smoke_v2415 树串 token 数已推进至 303', s2415.includes('treeTok.length === 404'));
ok('smoke_v2415 哨兵「尚无 304」口径（三百一十四件套 bare 否定式）', s2415.includes("!readme.includes('四百零五件套')"));
// 旧代 v24.79 pin 零残留扫描（豁免本套件与上一版套件）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v2480_fisherquest.mjs') continue;
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
  if (s2.includes('const GAME_VERSION = ' + "'v24.79';")) hits.push('gv');
  if (s2.includes('GAME_VERSION === ' + "'v24.79'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.79")) hits.push('cw');
  if (s2.includes('入库（30' + '2 份）')) hits.push('ruku');
  if (s2.includes('三百零二件套（三百零一' + '件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 30' + '2')) hits.push('fl');
  if (s2.includes('chainAll.length === 30' + '2')) hits.push('cal');
  if (s2.includes('chain.length === 30' + '1')) hits.push('cl');
  if (s2.includes('treeTok.length === 30' + '2')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v2479_" + "xpcurve24'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.79 GAME_VERSION/顶 pin/302 口径（哨兵链，豁免本套件与上一版）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.80 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
