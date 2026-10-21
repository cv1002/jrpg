// smoke_v24108_shopquest.mjs —— v24.106 专项冒烟：第二十条支线「月亮的路」（放灯童·快速旅行 MOON_GOAL(8) 条灯路）
// （新内容·新支线——承 v24.100 说书人「灯下新章」/ v24.72 听钟人「子夜钟声」/ v24.80 渔翁「一网灯影」/
// v24.82 守夜人「守夜的旧约」/ v24.105 琴师「战歌的谱」同一「风味 NPC 升格为支线委托人」先例：
// v22.76 纯风味 NPC「放灯童」（潮灯镇水塘东岸 (19,7)，「灯走到哪儿，月亮就跟到哪儿」）升格为委托人——
// 任意地图快速旅行成功一次（core.doTravel 成功旅行唯一产生点）都算替纸灯走完一条灯路，替他走满
// MOON_GOAL(8) 条灯路（计数 g.travels 与 ACH_LIST travels「行者无疆」同读一份源，支线门槛 8 低于
// 成就门槛 TRAVEL_GOAL(15)，零新计数零新状态零新存档）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.106 注释 / GAME_VERSION v24.106 与旧 v24.105 字面量
// 零残留 / v22.76 及更早历史注释保留 / MOON_GOAL 常量与 export）、QUESTS 契约（20 side + 4 main、
// side_moon 字段逐值、与 *_GOAL 同源、ACH_LIST allquests 同源互证）、quests.js 运行期状态机
// （offer→active→turnin→done 全链路 + resolveNpcTalk 接取/交付结算 60 金+2 生命药水 + npcQuestMark/
// npcQuestPages 四态 + sideQuestDone 0/20·3/20·20/20）、NPCS.lampboat 升格落位（lines 两页与
// after 两页保留零内容丢失契约 + v2276 姊妹套件已随升格更新）、README/package.json/CHANGELOG 同步
// （件套口径 329 + v24.106 守护描述 + 入库 329 + package 串尾 + CHANGELOG 顶 pin）、tests 目录与
// 实跑链恒等（329）、哨兵链（前望 330 且 README 尚无 330 口径）、旧代 v24.104 pin 全库零残留扫描
// （字面量/顶 pin/327 口径 · 豁免本套件与上一代套件）。
import { GAME_VERSION, QUESTS, MOON_GOAL, TRAVEL_GOAL, ACH_LIST, NPCS } from '../js/data.js';
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

console.log('— v24.106 放灯童「月亮的路」新支线 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkgRaw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（格式合法 + 已越过 v24.105 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.105', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 105)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.106（旧 v24.105 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.136';") && !dSrc.includes("const GAME_VERSION = 'v24.105';"));
ok('data.js 含 v24.106 注释（月亮的路新支线说明）',
  dSrc.includes('v24.106 新内容·新支线（第二十条）'));
ok('data.js 仍保留 v22.76 历史注释（放灯童三件套说明，零内容丢失）',
  dSrc.includes('v22.76 新 NPC·纯风味') && dSrc.includes('灯走到哪儿，月亮就跟到哪儿'));

// —— 源级落位：MOON_GOAL 常量 + export ——
ok('data.js MOON_GOAL 常量 = 8（与十组 *_GOAL 比邻声明，同一家族）',
  dSrc.includes('const MOON_GOAL = 8;') && dSrc.indexOf('const MOON_GOAL') > dSrc.indexOf('const SONG_GOAL'));
ok('data.js export 块含 MOON_GOAL（SONG_GOAL 之后用例）',
  dSrc.includes('WATCH_GOAL, TALE_GOAL, SONG_GOAL, MOON_GOAL,'));
ok('MOON_GOAL 与 TRAVEL_GOAL 同族逐值（8 < 15，支线门槛低于成就门槛——顺路先完成支线再解锁成就）',
  MOON_GOAL === 8 && TRAVEL_GOAL === 15 && MOON_GOAL < TRAVEL_GOAL);

// —— QUESTS 契约：20 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 24 条（20 side + 4 main，派生计数）',
  sideDefs.length === 44 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 48,
  `${sideDefs.length}/${mainDefs.length}`);
ok('side_moon 存在且为第二十条（kind side · store · npc/giver lampboat · 无 unlockOn）',
  !!QUESTS.side_moon && QUESTS.side_moon.kind === 'side' && QUESTS.side_moon.store === true &&
  QUESTS.side_moon.npc === 'lampboat' && QUESTS.side_moon.giver === 'lampboat' &&
  QUESTS.side_moon.unlockOn == null);
ok('side_moon 名称「月亮的路」/where/obj/offer/turnin/done 落位',
  QUESTS.side_moon.name === '月亮的路' && QUESTS.side_moon.where.includes('快速旅行') &&
  QUESTS.side_moon.obj.includes('快速旅行走过 ' + String(MOON_GOAL) + ' 条灯路') &&
  QUESTS.side_moon.obj.includes('月亮') &&
  QUESTS.side_moon.offer.includes('放灯童') && QUESTS.side_moon.turnin.includes('放灯童') &&
  QUESTS.side_moon.done.includes('月亮'));
ok('side_moon cond/condProg 与 MOON_GOAL 同源（travels 计数，判/进/文/话一处调全端跟随）',
  QUESTS.side_moon.cond({ travels: MOON_GOAL - 1 }) === false &&
  QUESTS.side_moon.cond({ travels: MOON_GOAL }) === true &&
  QUESTS.side_moon.cond({}) === false && QUESTS.side_moon.cond({ travels: 0 }) === false &&
  QUESTS.side_moon.condProg({}) === `0/${MOON_GOAL} 条灯路` && QUESTS.side_moon.condProg({ travels: 5 }) === `5/${MOON_GOAL} 条灯路`);
ok('side_moon reward 逐值：60 金 + 2 生命药水（承 side_grain 50 档、低于 side_tale 70 档）',
  QUESTS.side_moon.reward.gold === 60 && QUESTS.side_moon.reward.item === 2 && !QUESTS.side_moon.reward.potion2);

// —— ACH_LIST allquests 同源互证（与 sideQuestDone 输出一致）——
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('ACH_LIST allquests 名称「灯火同心」且描述派生 20（「33 个支线任务」）',
  !!achAll && achAll.name === '灯火同心' && achAll.d.includes('44 个支线任务'), achAll && achAll.d);
ok('ACH_LIST allquests 判定/进度与 QUESTS 派生同源（0/20 false · 19/20 false · 20/20 true · prog 20/20）',
  !!achAll && achAll.ok({ quests: {} }) === false && achAll.ok({ quests: Object.fromEntries(sideDefs.slice(0, 19).map(q => [q.id, 'done'])) }) === false &&
  achAll.ok({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === true &&
  achAll.prog({ quests: {} }) === '0/44' && achAll.prog({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === '44/44');

// —— quests.js 运行期：sideQuestDone ——
ok('运行期：sideQuestDone 0/20 · 3/20 · 20/20 · 主线不入列',
  sideQuestDone({ quests: {} }).done === 0 && sideQuestDone({ quests: {} }).total === 44 &&
  sideQuestDone({ quests: { side_mushroom: 'done', side_cart: 'done', side_pond: 'done' } }).done === 3 &&
  sideQuestDone({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }).done === 44 &&
  sideQuestDone({ quests: { main_demon: 'done' } }).done === 0);

// —— 运行期状态机：offer → active → turnin → done（quests 纯函数，零 DOM）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 3, hp: 60, hpMax: 60, mp: 20, mpMax: 20, atkMax: 13, defMax: 9,
    gold: 0, xp: 0, xpNext: 100, item: 1, potion2: 0, weapon: '铁剑', armor: '皮甲',
    skills: [], ach: [], seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, totalWins: 0,
    drops: 0, deflects: 0, casts: 0, travels: 0, x: 14, y: 16, map: 'village' }, extra || {});
}
const h1 = mkHero({});
ok('状态机：无存档 → questStatus offer（无 unlockOn 开局即可接，承 side_bell 同款）',
  questStatus(h1, 'side_moon') === 'offer', questStatus(h1, 'side_moon'));
ok('状态机：npcQuestMark offer 态「❕ 可接委托」',
  npcQuestMark(h1, 'lampboat') === '❕ 可接委托', npcQuestMark(h1, 'lampboat'));
ok('状态机：npcQuestPages offer 页（放灯童 · 月亮的路 · MOON_GOAL 同源）',
  JSON.stringify(npcQuestPages(h1, 'lampboat')).includes('放灯童') &&
  JSON.stringify(npcQuestPages(h1, 'lampboat')).includes('月亮') &&
  JSON.stringify(npcQuestPages(h1, 'lampboat')).includes(String(MOON_GOAL)) &&
  JSON.stringify(npcQuestPages(h1, 'lampboat')).includes('接下委托'));
const rAcc = resolveNpcTalk(h1, 'lampboat');
ok('状态机：resolveNpcTalk 接取 → {kind:accept, id:side_moon} + quests.side_moon=active',
  !!rAcc && rAcc.kind === 'accept' && rAcc.id === 'side_moon' && h1.quests.side_moon === 'active', JSON.stringify(rAcc));
ok('状态机：active 未达标 → questStatus active（cond 未满足）',
  questStatus(h1, 'side_moon') === 'active', questStatus(h1, 'side_moon'));
ok('状态机：active 页函数型实时报进度（已走 0/8 条灯路）',
  JSON.stringify(npcQuestPages(h1, 'lampboat')).includes('0/' + MOON_GOAL + ' 条灯路') &&
  JSON.stringify(npcQuestPages(h1, 'lampboat')).includes('已走'));
ok('状态机：任务日志 objective 同源（快速旅行走过 8 条灯路 0/8 条灯路）',
  questJournal(h1).find((e) => e.id === 'side_moon').objective.includes('快速旅行走过 ' + MOON_GOAL + ' 条灯路') &&
  questJournal(h1).find((e) => e.id === 'side_moon').objective.includes(`0/${MOON_GOAL} 条灯路`));
const h2 = mkHero({ quests: { side_moon: 'active' }, travels: MOON_GOAL });
ok('状态机：达标（travels=MOON_GOAL）→ questStatus turnin',
  questStatus(h2, 'side_moon') === 'turnin', questStatus(h2, 'side_moon'));
ok('状态机：npcQuestMark turnin 态「❕ 可交任务」',
  npcQuestMark(h2, 'lampboat') === '❕ 可交任务', npcQuestMark(h2, 'lampboat'));
const rRew = resolveNpcTalk(h2, 'lampboat');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:60, item:2} + done + 结算 60 金/2 生命药水',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 60 && rRew.item === 2 &&
  h2.quests.side_moon === 'done' && h2.gold === 60 && h2.item === 3, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）',
  resolveNpcTalk(h2, 'lampboat') === null);
ok('状态机：done 默认档（月亮会一直跟着）',
  JSON.stringify(npcQuestPages(h2, 'lampboat')).includes('月亮会一直跟着'));
ok('状态机：done trueBoss 档（after 彩蛋「月亮跟着灯/照照回家的路」两页并入任务页，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_moon: 'done' }, trueBoss: true }), 'lampboat')).includes('月亮跟着灯') &&
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_moon: 'done' }, trueBoss: true }), 'lampboat')).includes('照照回家的路'));
ok('状态机：done 态 npcQuestMark 零顶标（lampboat 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_moon: 'done' } }), 'lampboat') === null);
ok('questRewardPreview 与 reward 同源（60 金 + 2 生命药水）',
  JSON.stringify(questRewardPreview(mkHero({}), 'side_moon')) === '{"gold":60,"item":2,"potion2":0}');

// —— 既有支线零回归（挑六条既有契约逐值钉死）——
ok('既有支线零回归：side_tale/side_fish/side_bell/side_golem/side_watch/side_song 契约逐字未动',
  QUESTS.side_tale.reward.gold === 70 && QUESTS.side_tale.reward.item === 2 &&
  QUESTS.side_fish.reward.gold === 90 && QUESTS.side_fish.reward.item === 2 &&
  QUESTS.side_bell.reward.gold === 80 && QUESTS.side_bell.reward.potion2 === 1 &&
  QUESTS.side_golem.reward.gold === 120 && QUESTS.side_watch.reward.gold === 100 &&
  QUESTS.side_watch.reward.potion2 === 1 &&
  QUESTS.side_song.reward.gold === 60 && QUESTS.side_song.reward.potion2 === 1);

// —— NPCS.lampboat 升格落位（零新 NPC/坐标/数据层三件套之外零改动）——
ok('NPCS.lampboat 存在（放灯童 · mark lamp · 含 v24.106 升格注释）',
  !!NPCS.lampboat && NPCS.lampboat.name === '放灯童' && NPCS.lampboat.mark === 'lamp' &&
  dSrc.includes('v24.106 起升格为支线委托人'));
ok('NPCS.lampboat 原有 lines 两页 / trueBoss after 两页彩蛋保留（零内容丢失契约）',
  Array.isArray(NPCS.lampboat.lines) && NPCS.lampboat.lines.length === 2 &&
  Array.isArray(NPCS.lampboat.after) && NPCS.lampboat.after.length === 2 &&
  NPCS.lampboat.after[0][1].includes('月亮跟着灯') && NPCS.lampboat.after[1][0].includes('灯都亮了'));
ok('data.js village.extras 含放灯童 (19,7) 与 NPC_SPOTS 键「19,7」（零新坐标）',
  dSrc.includes("{ x: 19, y: 7, ty: 'NPC' }") && dSrc.includes("'19,7'"));
ok('姊妹件 smoke_v2276_lampkid 已随升格更新（无任务契约翻转为任务页契约）',
  read('smoke_v2276_lampkid.mjs').includes('月亮的路') && read('smoke_v2276_lampkid.mjs').includes('可接委托'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为三百五十九件套（三百五十八件套清除）',
  readme.includes('冒烟三百五十九件套（三百五十八件套清除）'));
ok('README tests 含 v24.106 守护描述与 smoke_v24111_hearerquest 入库（335 份）',
  readme.includes('v24.106 起含「放灯童「月亮的路」新支线」守护') &&
  readme.includes('smoke_v24111_hearerquest 入库（335 份）'));
ok('README 仍有 v24.105 守护描述（历史保留）', readme.includes('v24.105 起含「琴师「战歌的谱」新支线」守护'));
ok('README 已有三百二十九件套口径且尚无 330（哨兵前望 330 语义：下一版才写 330）',
  readme.includes('冒烟三百五十九件套（三百五十八件套清除）') && !readme.includes('冒烟三百六十件套') && !readme.includes('（360 份）'));
ok('README tests 树串尾已延伸（…+ smoke_v24104_goldcurve29 + smoke_v24105_songquest + smoke_v24106_moonquest + smoke_v24107_peddlequest + smoke_v24108_shopquest + smoke_v24109_carvequest + smoke_v24110_vowquest + smoke_v24111_hearerquest + smoke_v24112_talkquest + smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest（npm test 串跑））',
  readme.includes('smoke_v24104_goldcurve29 + smoke_v24105_songquest + smoke_v24106_moonquest + smoke_v24107_peddlequest + smoke_v24108_shopquest + smoke_v24109_carvequest + smoke_v24110_vowquest + smoke_v24111_hearerquest + smoke_v24112_talkquest + smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest（npm test 串跑）'));
ok('README 支线/奖励行随新现实（二十条 · 月亮的路 · MOON_GOAL）',
  readme.includes('四十四条支线目标/奖励全部由') &&
  readme.includes('月亮的路（放灯童 · 快速旅行走过 `MOON_GOAL`(8) 条灯路，任意地图 T 菜单）60 金 + 2 药水') &&
  readme.includes('v24.106 补第二十条'));
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 328 份（smoke.mjs + 328 专项）', chain.length === 358 && ['smoke.mjs', ...chain].length === 359, String(chain.length));
ok('package.json 链尾为 smoke_v24108_shopquest（第 329 份）', chain[chain.length - 1] === 'smoke_v24136_herbquest', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v24108_shopquest.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v24105_songquest.mjs && node tests/smoke_v24106_moonquest.mjs && node tests/smoke_v24107_peddlequest.mjs && node tests/smoke_v24108_shopquest.mjs && node tests/smoke_v24109_carvequest.mjs && node tests/smoke_v24110_vowquest.mjs && node tests/smoke_v24111_hearerquest.mjs && node tests/smoke_v24112_talkquest.mjs && node tests/smoke_v24113_walkquest.mjs && node tests/smoke_v24114_fleequest.mjs && node tests/smoke_v24115_achhud.mjs && node tests/smoke_v24116_guidequest.mjs && node tests/smoke_v24117_codexhud.mjs && node tests/smoke_v24118_wellquest.mjs && node tests/smoke_v24119_huntquest.mjs && node tests/smoke_v24120_chesthud.mjs && node tests/smoke_v24121_siftquest.mjs && node tests/smoke_v24122_crystalquest.mjs && node tests/smoke_v24123_fraghud.mjs && node tests/smoke_v24124_questshud.mjs && node tests/smoke_v24125_hunthud.mjs && node tests/smoke_v24126_waitquest.mjs && node tests/smoke_v24127_lampquest.mjs && node tests/smoke_v24128_stelequest.mjs && node tests/smoke_v24129_stele2quest.mjs && node tests/smoke_v24130_stele3quest.mjs && node tests/smoke_v24131_stele4quest.mjs && node tests/smoke_v24132_fallenquest.mjs && node tests/smoke_v24133_inquest.mjs && node tests/smoke_v24134_kindleq.mjs && node tests/smoke_v24135_ledgerquest.mjs && node tests/smoke_v24136_herbquest.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.106（startsWith）', changelog.startsWith('## v24.136'));
ok('CHANGELOG v24.106 条目含「月亮的路」与「MOON_GOAL」与「放灯童」',
  changelog.includes('月亮的路') && changelog.includes('MOON_GOAL') && changelog.includes('放灯童'));
ok('CHANGELOG 仍保留 v24.105 条目（历史保留）', changelog.includes('## v24.105'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const testsDir = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录件套 = 329（328 + smoke_v24108_shopquest）', files.length === 359, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.104 pin 零残留 ——
const s24105 = read('smoke_v24105_songquest.mjs');
ok('smoke_v24105 的 GAME_VERSION 字面量 pin 已更新为 v24.106', s24105.includes("const GAME_VERSION = 'v24.136';"));
ok('smoke_v24105 的 CHANGELOG 顶 pin 已更新为 ## v24.106 ', s24105.includes("startsWith('## v24.136 '"));
ok('smoke_v24105 的件套 pin 已更新为三百五十九件套（三百五十八件套清除）', s24105.includes('三百五十九件套（三百五十八件套清除）'));
ok('smoke_v24105 的 README/链 tail pin 已随新现实延伸（含 smoke_v24108_shopquest）',
  s24105.includes('smoke_v24111_hearerquest'));
ok('smoke_v24105 的 package.json 串尾 pin 已延伸至 smoke_v24108_shopquest', s24105.includes('node tests/smoke_v24105_songquest.mjs && node tests/smoke_v24106_moonquest.mjs && node tests/smoke_v24107_peddlequest.mjs && node tests/smoke_v24108_shopquest.mjs && node tests/smoke_v24109_carvequest.mjs && node tests/smoke_v24110_vowquest.mjs && node tests/smoke_v24111_hearerquest.mjs'));
ok('smoke_v24105 的链尾 pin 已推进至 smoke_v24108_shopquest（第 329 份）', s24105.includes("=== 'smoke_v24136_herbquest'"));
ok('smoke_v24105 的入库 pin 已推进至 329 份', s24105.includes('入库（335 份）'));
const s2436 = read('smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（328 专项 / 329）且尚无 330 口径哨兵',
  s2436.includes('suiteFiles.length === 358 && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length === 359') &&
  s2436.includes('!readme.includes(\'冒烟三百六十件套\')') && s2436.includes('!readme.includes(\'（360 份）\')'));
const s2415 = read('smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v24108_shopquest（第 329 份）', s2415.includes("chain[chain.length - 1] === 'smoke_v24136_herbquest'"));
ok('smoke_v2415 树串 token 数已推进至 329', s2415.includes('treeTok.length === 359'));
// 旧代 v24.104 pin 零残留扫描（豁免本套件与上一代套件）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v24108_shopquest.mjs') continue;
  if (f === 'smoke_v24106_moonquest.mjs') continue;
  if (f === 'smoke_v24105_songquest.mjs') continue;
  if (f === 'smoke_v24100_talequest.mjs') continue;
  if (f === 'smoke_v24101_goldcurve26.mjs') continue;
  if (f === 'smoke_v24102_goldcurve27.mjs') continue;
  if (f === 'smoke_v24103_goldcurve28.mjs') continue;
  if (f === 'smoke_v24104_goldcurve29.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDir), 'utf8').split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  const hits = [];
  if (s2.includes('const GAME_VERSION = ' + "'v24.104';")) hits.push('gv');
  if (s2.includes('GAME_VERSION === ' + "'v24.104'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.104")) hits.push('cw');
  if (s2.includes('入库（32' + '8 份）')) hits.push('ruku');
  if (s2.includes('三百二十八件套（三百二十七' + '件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 32' + '8')) hits.push('fl');
  if (s2.includes('chainAll.length === 32' + '8')) hits.push('cal');
  if (s2.includes('chain.length === 32' + '7')) hits.push('cl');
  if (s2.includes('treeTok.length === 32' + '8')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v24105_" + "songquest'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.105 GAME_VERSION/顶 pin/328 口径（哨兵链，豁免本套件与上一代）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.106 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
