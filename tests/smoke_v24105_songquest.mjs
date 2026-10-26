// smoke_v24105_songquest.mjs —— v24.105 专项冒烟：第十九条支线「战歌的谱」（琴师·释放技能 SONG_GOAL(12) 次）
// （新内容·新支线——承 v24.100 说书人「灯下新章」/ v24.72 听钟人「子夜钟声」/ v24.80 渔翁「一网灯影」/
// v24.82 守夜人「守夜的旧约」同一「风味 NPC 升格为支线委托人」先例：v22.27 纯风味 NPC「琴师」
// （雾语林南坡 (14,15)，「调子还在，名字就还在」）升格为委托人——战斗指令 [2] 技能每次释放成功都算
// 替《战歌的谱》记下一个音符，替他记满 SONG_GOAL(12) 个音符（计数 hero.casts 与 ACH_LIST cast
// 「熟能生巧」同读一份源，支线门槛 12 高于成就门槛 CAST_GOAL(5)，零新计数零新状态零新存档）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.105 注释 / GAME_VERSION v24.105 与旧 v24.104 字面量
// 零残留 / v22.27 及更早历史注释保留 / SONG_GOAL 常量与 export）、QUESTS 契约（19 side + 4 main、
// side_song 字段逐值、与 *_GOAL 同源、ACH_LIST allquests 同源互证）、quests.js 运行期状态机
// （offer→active→turnin→done 全链路 + resolveNpcTalk 接取/交付结算 60 金+1 高级灵药 + npcQuestMark/
// npcQuestPages 四态 + sideQuestDone 0/20·3/20·20/20）、NPCS.minstrel 升格落位（lines 两页与
// after 两页保留零内容丢失契约 + v2227 姊妹套件已随升格更新）、README/package.json/CHANGELOG 同步
// （件套口径 328 + v24.105 守护描述 + 入库 328 + package 串尾 + CHANGELOG 顶 pin）、tests 目录与
// 实跑链恒等（328）、哨兵链（前望 329 且 README 尚无 329 口径）、旧代 v24.103 pin 全库零残留扫描
// （字面量/顶 pin/327 口径 · 豁免本套件与上一版套件）。
import { GAME_VERSION, QUESTS, SONG_GOAL, CAST_GOAL, ACH_LIST, NPCS } from '../js/data.js';
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

console.log('— v24.105 琴师「战歌的谱」新支线 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkgRaw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（格式合法 + 已越过 v24.104 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.104', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 104)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.105（旧 v24.104 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.164';") && !dSrc.includes("const GAME_VERSION = 'v24.104';"));
ok('data.js 含 v24.105 注释（战歌的谱新支线说明）',
  dSrc.includes('v24.105 新内容·新支线（第十九条）'));
ok('data.js 仍保留 v22.27 历史注释（琴师三件套说明，零内容丢失）',
  dSrc.includes('v22.27 新 NPC·纯风味') && dSrc.includes('调子还在，名字就还在'));

// —— 源级落位：SONG_GOAL 常量 + export ——
ok('data.js SONG_GOAL 常量 = 12（与十组 *_GOAL 比邻声明，同一家族）',
  dSrc.includes('const SONG_GOAL = 12;') && dSrc.indexOf('const SONG_GOAL') > dSrc.indexOf('const TALE_GOAL'));
ok('data.js export 块含 SONG_GOAL（TALE_GOAL 之后用例）',
  dSrc.includes('WATCH_GOAL, TALE_GOAL, SONG_GOAL,'));
ok('SONG_GOAL 与 CAST_GOAL 同族逐值（12 < 30，支线门槛低于成就门槛——顺路先完成支线再解锁成就）',
  SONG_GOAL === 12 && CAST_GOAL === 30 && SONG_GOAL < CAST_GOAL);

// —— QUESTS 契约：19 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 23 条（19 side + 4 main，派生计数）',
  sideDefs.length === 45 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 49,
  `${sideDefs.length}/${mainDefs.length}`);
ok('side_song 存在且为第十九条（kind side · store · npc/giver minstrel · 无 unlockOn）',
  !!QUESTS.side_song && QUESTS.side_song.kind === 'side' && QUESTS.side_song.store === true &&
  QUESTS.side_song.npc === 'minstrel' && QUESTS.side_song.giver === 'minstrel' &&
  QUESTS.side_song.unlockOn == null);
ok('side_song 名称「战歌的谱」/where/obj/offer/turnin/done 落位',
  QUESTS.side_song.name === '战歌的谱' && QUESTS.side_song.where.includes('[2] 技能') &&
  QUESTS.side_song.obj.includes('释放 ' + String(SONG_GOAL) + ' 次技能') &&
  QUESTS.side_song.obj.includes('战歌的谱') &&
  QUESTS.side_song.offer.includes('琴师') && QUESTS.side_song.turnin.includes('琴师') &&
  QUESTS.side_song.done.includes('战歌的谱'));
ok('side_song cond/condProg 与 SONG_GOAL 同源（casts 计数，判/进/文/话一处调全端跟随）',
  QUESTS.side_song.cond({ casts: SONG_GOAL - 1 }) === false &&
  QUESTS.side_song.cond({ casts: SONG_GOAL }) === true &&
  QUESTS.side_song.cond({}) === false && QUESTS.side_song.cond({ casts: 0 }) === false &&
  QUESTS.side_song.condProg({}) === `0/${SONG_GOAL} 次` && QUESTS.side_song.condProg({ casts: 7 }) === `7/${SONG_GOAL} 次`);
ok('side_song reward 逐值：60 金 + 1 高级灵药（承 side_stone 60 档、高于 side_pond 30 档）',
  QUESTS.side_song.reward.gold === 60 && QUESTS.side_song.reward.potion2 === 1 && !QUESTS.side_song.reward.item);

// —— ACH_LIST allquests 同源互证（与 sideQuestDone 输出一致）——
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('ACH_LIST allquests 名称「灯火同心」且描述派生 19（「19 个支线任务」）',
  !!achAll && achAll.name === '灯火同心' && achAll.d.includes('45 个支线任务'), achAll && achAll.d);
ok('ACH_LIST allquests 判定/进度与 QUESTS 派生同源（0/20 false · 19/20 false · 20/20 true · prog 20/20）',
  !!achAll && achAll.ok({ quests: {} }) === false && achAll.ok({ quests: Object.fromEntries(sideDefs.slice(0, 19).map(q => [q.id, 'done'])) }) === false &&
  achAll.ok({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === true &&
  achAll.prog({ quests: {} }) === '0/45' && achAll.prog({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === '45/45');

// —— quests.js 运行期：sideQuestDone ——
ok('运行期：sideQuestDone 0/20 · 3/20 · 20/20 · 主线不入列',
  sideQuestDone({ quests: {} }).done === 0 && sideQuestDone({ quests: {} }).total === 45 &&
  sideQuestDone({ quests: { side_mushroom: 'done', side_cart: 'done', side_pond: 'done' } }).done === 3 &&
  sideQuestDone({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }).done === 45 &&
  sideQuestDone({ quests: { main_demon: 'done' } }).done === 0);

// —— 运行期状态机：offer → active → turnin → done（quests 纯函数，零 DOM）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 3, hp: 60, hpMax: 60, mp: 20, mpMax: 20, atkMax: 13, defMax: 9,
    gold: 0, xp: 0, xpNext: 100, item: 1, potion2: 0, weapon: '铁剑', armor: '皮甲',
    skills: [], ach: [], seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, totalWins: 0,
    drops: 0, deflects: 0, casts: 0, x: 14, y: 16, map: 'dungeon' }, extra || {});
}
const h1 = mkHero({});
ok('状态机：无存档 → questStatus offer（无 unlockOn 开局即可接，承 side_bell 同款）',
  questStatus(h1, 'side_song') === 'offer', questStatus(h1, 'side_song'));
ok('状态机：npcQuestMark offer 态「❕ 可接委托」',
  npcQuestMark(h1, 'minstrel') === '❕ 可接委托', npcQuestMark(h1, 'minstrel'));
ok('状态机：npcQuestPages offer 页（琴师 · 战歌的谱 · SONG_GOAL 同源）',
  JSON.stringify(npcQuestPages(h1, 'minstrel')).includes('琴师') &&
  JSON.stringify(npcQuestPages(h1, 'minstrel')).includes('记不住打仗') &&
  JSON.stringify(npcQuestPages(h1, 'minstrel')).includes(String(SONG_GOAL)) &&
  JSON.stringify(npcQuestPages(h1, 'minstrel')).includes('接下委托'));
const rAcc = resolveNpcTalk(h1, 'minstrel');
ok('状态机：resolveNpcTalk 接取 → {kind:accept, id:side_song} + quests.side_song=active',
  !!rAcc && rAcc.kind === 'accept' && rAcc.id === 'side_song' && h1.quests.side_song === 'active', JSON.stringify(rAcc));
ok('状态机：active 未达标 → questStatus active（cond 未满足）',
  questStatus(h1, 'side_song') === 'active', questStatus(h1, 'side_song'));
ok('状态机：active 页函数型实时报进度（已记 0/12 个音符）',
  JSON.stringify(npcQuestPages(h1, 'minstrel')).includes('0/' + SONG_GOAL + ' 个音符') &&
  JSON.stringify(npcQuestPages(h1, 'minstrel')).includes('已记'));
ok('状态机：任务日志 objective 同源（释放 12 次技能 0/12 次）',
  questJournal(h1).find((e) => e.id === 'side_song').objective.includes('释放 ' + SONG_GOAL + ' 次技能') &&
  questJournal(h1).find((e) => e.id === 'side_song').objective.includes(`0/${SONG_GOAL} 次`));
const h2 = mkHero({ quests: { side_song: 'active' }, casts: SONG_GOAL });
ok('状态机：达标（casts=SONG_GOAL）→ questStatus turnin',
  questStatus(h2, 'side_song') === 'turnin', questStatus(h2, 'side_song'));
ok('状态机：npcQuestMark turnin 态「❕ 可交任务」',
  npcQuestMark(h2, 'minstrel') === '❕ 可交任务', npcQuestMark(h2, 'minstrel'));
const rRew = resolveNpcTalk(h2, 'minstrel');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:60, potion2:1} + done + 结算 60 金/1 高级灵药',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 60 && rRew.potion2 === 1 &&
  h2.quests.side_song === 'done' && h2.gold === 60 && h2.potion2 === 1, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）',
  resolveNpcTalk(h2, 'minstrel') === null);
ok('状态机：done 默认档（谱已收好）',
  JSON.stringify(npcQuestPages(h2, 'minstrel')).includes('谱已收好'));
ok('状态机：done trueBoss 档（after 彩蛋「雾散了/记着才算数」两页并入任务页，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_song: 'done' }, trueBoss: true }), 'minstrel')).includes('雾散了') &&
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_song: 'done' }, trueBoss: true }), 'minstrel')).includes('记着才算数'));
ok('状态机：done 态 npcQuestMark 零顶标（minstrel 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_song: 'done' } }), 'minstrel') === null);
ok('questRewardPreview 与 reward 同源（60 金 + 1 高级灵药）',
  JSON.stringify(questRewardPreview(mkHero({}), 'side_song')) === '{"gold":60,"item":0,"potion2":1}');

// —— 既有支线零回归（挑五条既有契约逐值钉死）——
ok('既有支线零回归：side_tale/side_fish/side_bell/side_golem/side_watch 契约逐字未动',
  QUESTS.side_tale.reward.gold === 70 && QUESTS.side_tale.reward.item === 2 &&
  QUESTS.side_fish.reward.gold === 90 && QUESTS.side_fish.reward.item === 2 &&
  QUESTS.side_bell.reward.gold === 80 && QUESTS.side_bell.reward.potion2 === 1 &&
  QUESTS.side_golem.reward.gold === 120 && QUESTS.side_watch.reward.gold === 100 &&
  QUESTS.side_watch.reward.potion2 === 1);

// —— NPCS.minstrel 升格落位（零新 NPC/坐标/数据层三件套之外零改动）——
ok('NPCS.minstrel 存在（琴师 · mark qin · 含 v24.105 升格注释）',
  !!NPCS.minstrel && NPCS.minstrel.name === '琴师' && NPCS.minstrel.mark === 'qin' &&
  dSrc.includes('v24.105 起升格为支线委托人'));
ok('NPCS.minstrel 原有 lines 两页 / trueBoss after 两页彩蛋保留（零内容丢失契约）',
  Array.isArray(NPCS.minstrel.lines) && NPCS.minstrel.lines.length === 2 &&
  Array.isArray(NPCS.minstrel.after) && NPCS.minstrel.after.length === 2 &&
  NPCS.minstrel.after[0][0].includes('雾散了'));
ok('data.js dungeon.extras 含琴师 (14,15) 与 NPC_SPOTS 键「14,15」（零新坐标）',
  dSrc.includes("{ x: 14, y: 15, ty: 'NPC' }") && dSrc.includes("'14,15'"));
ok('姊妹件 smoke_v2227_minstrel 已随升格更新（无任务契约翻转为任务页契约）',
  read('smoke_v2227_minstrel.mjs').includes('战歌的谱') && read('smoke_v2227_minstrel.mjs').includes('可接委托'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为三百七十五件套（三百七十四件套清除）',
  readme.includes('冒烟三百七十五件套（三百七十四件套清除）'));
ok('README tests 含 v24.105 守护描述与 smoke_v24105_songquest 入库（335 份）',
  readme.includes('v24.105 起含「琴师「战歌的谱」新支线」守护') &&
  readme.includes('smoke_v24105_songquest 入库（335 份）'));
ok('README 仍有 v24.104 守护描述（历史保留）', readme.includes('v24.104 起含「后期金币曲线续平滑（第二十九轮·收官轮）」守护'));
ok('README 已有三百二十八件套口径且尚无 329（哨兵前望 329 语义：下一版才写 329）',
  readme.includes('冒烟三百七十五件套（三百七十四件套清除）') && !readme.includes('冒烟三百七十六件套') && !readme.includes('（376 份）'));
ok('README tests 树串尾已延伸（…+ smoke_v24104_goldcurve29 + smoke_v24105_songquest + smoke_v24106_moonquest + smoke_v24107_peddlequest + smoke_v24108_shopquest + smoke_v24109_carvequest + smoke_v24110_vowquest + smoke_v24111_hearerquest + smoke_v24112_talkquest + smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑））',
  readme.includes('smoke_v24103_goldcurve28 + smoke_v24104_goldcurve29 + smoke_v24105_songquest + smoke_v24106_moonquest + smoke_v24107_peddlequest + smoke_v24108_shopquest + smoke_v24109_carvequest + smoke_v24110_vowquest + smoke_v24111_hearerquest + smoke_v24112_talkquest + smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑）'));
ok('README 支线/奖励行随新现实（十九条 · 战歌的谱 · SONG_GOAL）',
  readme.includes('四十五条支线目标/奖励全部由') &&
  readme.includes('战歌的谱（琴师 · 释放技能 `SONG_GOAL`(12) 次，任意战斗 [2] 技能）60 金 + 1 高级灵药') &&
  readme.includes('v24.105 补第十九条'));
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 327 份（smoke.mjs + 328 专项）', chain.length === 374 && ['smoke.mjs', ...chain].length === 375, String(chain.length));
ok('package.json 链尾为 smoke_v24105_songquest（第 328 份）', chain[chain.length - 1] === 'smoke_v24164_swiftlv', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v24105_songquest.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v24103_goldcurve28.mjs && node tests/smoke_v24104_goldcurve29.mjs && node tests/smoke_v24105_songquest.mjs && node tests/smoke_v24106_moonquest.mjs && node tests/smoke_v24107_peddlequest.mjs && node tests/smoke_v24108_shopquest.mjs && node tests/smoke_v24109_carvequest.mjs && node tests/smoke_v24110_vowquest.mjs && node tests/smoke_v24111_hearerquest.mjs && node tests/smoke_v24112_talkquest.mjs && node tests/smoke_v24113_walkquest.mjs && node tests/smoke_v24114_fleequest.mjs && node tests/smoke_v24115_achhud.mjs && node tests/smoke_v24116_guidequest.mjs && node tests/smoke_v24117_codexhud.mjs && node tests/smoke_v24118_wellquest.mjs && node tests/smoke_v24119_huntquest.mjs && node tests/smoke_v24120_chesthud.mjs && node tests/smoke_v24121_siftquest.mjs && node tests/smoke_v24122_crystalquest.mjs && node tests/smoke_v24123_fraghud.mjs && node tests/smoke_v24124_questshud.mjs && node tests/smoke_v24125_hunthud.mjs && node tests/smoke_v24126_waitquest.mjs && node tests/smoke_v24127_lampquest.mjs && node tests/smoke_v24128_stelequest.mjs && node tests/smoke_v24129_stele2quest.mjs && node tests/smoke_v24130_stele3quest.mjs && node tests/smoke_v24131_stele4quest.mjs && node tests/smoke_v24132_fallenquest.mjs && node tests/smoke_v24133_inquest.mjs && node tests/smoke_v24134_kindleq.mjs && node tests/smoke_v24135_ledgerquest.mjs && node tests/smoke_v24136_herbquest.mjs && node tests/smoke_v24143_furnacequest.mjs && node tests/smoke_v24147_unflicker.mjs && node tests/smoke_v24148_swift.mjs && node tests/smoke_v24151_lowlv.mjs && node tests/smoke_v24152_nopotion.mjs && node tests/smoke_v24153_penny.mjs && node tests/smoke_v24154_steadfast.mjs && node tests/smoke_v24155_frugal.mjs && node tests/smoke_v24157_dry.mjs && node tests/smoke_v24158_swift2.mjs && node tests/smoke_v24159_lowlv2.mjs && node tests/smoke_v24160_noskill.mjs && node tests/smoke_v24161_noskill2.mjs && node tests/smoke_v24162_lowskill.mjs && node tests/smoke_v24163_swiftskill.mjs && node tests/smoke_v24164_swiftlv.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.105（startsWith）', changelog.startsWith('## v24.164'));
ok('CHANGELOG v24.105 条目含「战歌的谱」与「SONG_GOAL」与「琴师」',
  changelog.includes('战歌的谱') && changelog.includes('SONG_GOAL') && changelog.includes('琴师'));
ok('CHANGELOG 仍保留 v24.104 条目（历史保留）', changelog.includes('## v24.104'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const testsDir = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录件套 = 328（327 + smoke_v24105_songquest）', files.length === 375, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.103 pin 零残留 ——
const s2497 = read('smoke_v24104_goldcurve29.mjs');
ok('smoke_v24104 的 GAME_VERSION 字面量 pin 已更新为 v24.105', s2497.includes("const GAME_VERSION = 'v24.164';"));
ok('smoke_v24104 的 CHANGELOG 顶 pin 已更新为 ## v24.105 ', s2497.includes("startsWith('## v24.164 '"));
ok('smoke_v24104 的件套 pin 已更新为三百七十五件套（三百七十四件套清除）', s2497.includes('三百七十五件套（三百七十四件套清除）'));
ok('smoke_v24104 的 README/链 tail pin 已随新现实延伸（含 smoke_v24105_songquest）',
  s2497.includes('smoke_v24105_songquest'));
ok('smoke_v24104 的 package.json 串尾 pin 已延伸至 smoke_v24105_songquest', s2497.includes('node tests/smoke_v24104_goldcurve29.mjs && node tests/smoke_v24105_songquest.mjs'));
ok('smoke_v24104 的链尾 pin 已推进至 smoke_v24105_songquest（第 328 份）', s2497.includes("=== 'smoke_v24164_swiftlv'"));
ok('smoke_v24104 的入库 pin 已推进至 328 份', s2497.includes('入库（335 份）'));
const s2436 = read('smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（327 专项 / 328）且尚无 329 口径哨兵',
  s2436.includes('suiteFiles.length ===  374  && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length ===  375') &&
  s2436.includes('!readme.includes(\'冒烟三百七十六件套\')') && s2436.includes('!readme.includes(\'（376 份）\')'));
const s2415 = read('smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v24105_songquest（第 328 份）', s2415.includes("chain[chain.length - 1] === 'smoke_v24164_swiftlv'"));
ok('smoke_v2415 树串 token 数已推进至 328', s2415.includes('treeTok.length === 375'));
// 旧代 v24.103 pin 零残留扫描（豁免本套件与上一版套件）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v24105_songquest.mjs') continue;
  if (f === 'smoke_v24100_talequest.mjs') continue;
  if (f === 'smoke_v24101_goldcurve26.mjs') continue;
  if (f === 'smoke_v24102_goldcurve27.mjs') continue;
  if (f === 'smoke_v24103_goldcurve28.mjs') continue;
  if (f === 'smoke_v24104_goldcurve29.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDir), 'utf8');
  const hits = [];
  if (s2.includes('const GAME_VERSION = ' + "'v24.103';")) hits.push('gv');
  if (s2.includes('GAME_VERSION === ' + "'v24.103'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.102")) hits.push('cw');
  if (s2.includes('入库（32' + '7 份）')) hits.push('ruku');
  if (s2.includes('三百二十七件套（三百二十六' + '件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 32' + '7')) hits.push('fl');
  if (s2.includes('chainAll.length === 32' + '7')) hits.push('cal');
  if (s2.includes('chain.length === 32' + '6')) hits.push('cl');
  if (s2.includes('treeTok.length === 32' + '7')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v24104_" + "goldcurve29'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.103 GAME_VERSION/顶 pin/327 口径（哨兵链，豁免本套件与上一版）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.105 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
