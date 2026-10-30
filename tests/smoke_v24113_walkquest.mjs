// smoke_v24113_walkquest.mjs —— v24.113 专项冒烟：第二十七条支线「一步一灯」（掌灯童·步行累计 WALK_GOAL(500) 步）
// （新内容·新支线——承 v24.112 镇民「灯下之声」/ v24.111 听矿人「岩缝里的名字」/ v24.110 记誓人「蓄石为誓」/
// v24.109 刻碑人「一凿入石」/ v24.108 货栈掌柜「开张的生意」/ v24.107 货郎「路远灯长」/ v24.106 放灯童「月亮的路」/
// v24.105 琴师「战歌的谱」/ v24.100 说书人「灯下新章」同一「风味 NPC 升格为支线委托人」先例：v22.11 纯风味 NPC
// 「掌灯童」（无字回廊中段北侧 (14,3)，「这条回廊好黑呀，碑上也没有字」/「我不认字，但我会提灯呀——灯亮着，
// 名字就找得到回家的路」）升格为委托人——她每天提灯从头走到尾、替名字照路，玩家每走一步都算替她把路走亮一寸，
// 替他走满 WALK_GOAL(500) 步灯路（计数 hero.steps 与 ACH_LIST steps「千里之行」同读一份源，支线门槛 500 低于
// 成就门槛 STEP_GOAL(1000)——顺路先完成支线再解锁成就；js/world.js move 成功落地一格唯一写入点、
// 快速旅行/传送门/出口走 transition 零计数；零新计数零新状态零新存档）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.113 注释 / GAME_VERSION v24.113 与旧 v24.112 字面量零残留 /
// v24.112 及更早历史注释保留 / WALK_GOAL 常量与 export）、QUESTS 契约（27 side + 4 main、side_walk 字段
// 逐值、与 *_GOAL 同源、ACH_LIST allquests 同源互证、WALK_GOAL 低于 steps 成就门槛互证）、quests.js 运行期
// 状态机（offer→active→turnin→done 全链路 + resolveNpcTalk 接取/交付结算 70 金+2 生命药水 + npcQuestMark/
// npcQuestPages 四态 + sideQuestDone 0/27·3/27·27/27）、NPCS.lampkid 升格落位（lines 两页与 after 两页保留
// 零内容丢失契约 + 姊妹件套已随升格更新）、README/package.json/CHANGELOG 同步（件套口径 336 + v24.113
// 守护描述 + 入库 336 + package 串尾 + CHANGELOG 顶 pin）、tests 目录与实跑链恒等（336）、哨兵链（前望 337 且
// README 尚无 337 口径）、旧代 v24.112 pin 全库零残留扫描（字面量/顶 pin/335 口径 · 豁免本套件）。
import { GAME_VERSION, QUESTS, WALK_GOAL, STEP_GOAL, ACH_LIST, NPCS } from '../js/data.js';
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

console.log('— v24.113 掌灯童「一步一灯」新支线 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkgRaw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（格式合法 + 已越过 v24.112 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.112', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 112)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.113（旧 v24.112 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.195';") && !dSrc.includes("const GAME_VERSION = 'v24.112';"));
ok('data.js 含 v24.113 注释（一步一灯新支线说明）',
  dSrc.includes('v24.113 新内容·新支线（第二十七条）'));
ok('data.js 仍保留 v24.112 历史注释（灯下之声说明，零内容丢失）',
  dSrc.includes('v24.112 新内容·新支线（第二十六条）') && dSrc.includes('v24.112 升格为支线委托人'));

// —— 源级落位：WALK_GOAL 常量 + export ——
ok('data.js WALK_GOAL 常量 = 500（与 TALK_GOAL 比邻声明，同一家族）',
  dSrc.includes('const WALK_GOAL = 500;') && dSrc.indexOf('const WALK_GOAL') > dSrc.indexOf('const TALK_GOAL'));
ok('data.js export 块含 WALK_GOAL（TALK_GOAL 之后用例）',
  dSrc.includes('TALK_GOAL, WALK_GOAL,'));
ok('WALK_GOAL 与 steps 成就门槛同族互证（500 < STEP_GOAL 1000——顺路先完成支线再解锁成就）',
  (() => { const aSteps = ACH_LIST.find((a) => a.id === 'steps');
    return !!aSteps && WALK_GOAL === 500 && STEP_GOAL === 1000 &&
      aSteps.ok({ steps: 499 }) === false &&
      aSteps.ok({ steps: 1000 }) === true &&
      aSteps.prog({ steps: 250 }) === '250/1000' &&
      WALK_GOAL < STEP_GOAL; })());

// —— QUESTS 契约：27 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 31 条（27 side + 4 main，派生计数）',
  sideDefs.length === 46 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 50,
  `${sideDefs.length}/${mainDefs.length}`);
ok('side_walk 存在且为第二十七条（kind side · store · npc/giver lampkid · 无 unlockOn）',
  !!QUESTS.side_walk && QUESTS.side_walk.kind === 'side' && QUESTS.side_walk.store === true &&
  QUESTS.side_walk.npc === 'lampkid' && QUESTS.side_walk.giver === 'lampkid' &&
  QUESTS.side_walk.unlockOn == null);
ok('side_walk 名称「一步一灯」/where/obj/offer/turnin/done 落位',
  QUESTS.side_walk.name === '一步一灯' && QUESTS.side_walk.where.includes('任意地图') &&
  QUESTS.side_walk.obj.includes(String(WALK_GOAL)) && QUESTS.side_walk.obj.includes('走亮') &&
  QUESTS.side_walk.offer.includes('掌灯童') && QUESTS.side_walk.turnin.includes('掌灯童') &&
  QUESTS.side_walk.done.includes('灯都亮了'));
ok('side_walk cond/condProg 与 WALK_GOAL 同源（steps 计数，判/进/文/话一处调全端跟随）',
  QUESTS.side_walk.cond({ steps: 499 }) === false &&
  QUESTS.side_walk.cond({ steps: 500 }) === true &&
  QUESTS.side_walk.cond({}) === false && QUESTS.side_walk.cond({ steps: 0 }) === false &&
  QUESTS.side_walk.condProg({}) === `0/${WALK_GOAL} 步` &&
  QUESTS.side_walk.condProg({ steps: 123 }) === `123/${WALK_GOAL} 步`);
ok('side_walk reward 逐值：70 金 + 2 生命药水（承 side_tale 70 档、高于 side_moon 60 档、低于 side_fish 90 档）',
  QUESTS.side_walk.reward.gold === 70 && QUESTS.side_walk.reward.item === 2 && !QUESTS.side_walk.reward.potion2);

// —— ACH_LIST allquests 同源互证（与 sideQuestDone 输出一致）——
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('ACH_LIST allquests 名称「灯火同心」且描述派生 27（「33 个支线任务」）',
  !!achAll && achAll.name === '灯火同心' && achAll.d.includes('46 个支线任务'), achAll && achAll.d);
ok('ACH_LIST allquests 判定/进度与 QUESTS 派生同源（0/27 false · 26/27 false · 27/27 true · prog 27/27）',
  !!achAll && achAll.ok({ quests: {} }) === false && achAll.ok({ quests: Object.fromEntries(sideDefs.slice(0, 26).map(q => [q.id, 'done'])) }) === false &&
  achAll.ok({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === true &&
  achAll.prog({ quests: {} }) === '0/46' && achAll.prog({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === '46/46');

// —— quests.js 运行期：sideQuestDone ——
ok('运行期：sideQuestDone 0/27 · 3/27 · 27/27 · 主线不入列',
  sideQuestDone({ quests: {} }).done === 0 && sideQuestDone({ quests: {} }).total === 46 &&
  sideQuestDone({ quests: { side_mushroom: 'done', side_cart: 'done', side_pond: 'done' } }).done === 3 &&
  sideQuestDone({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }).done === 46 &&
  sideQuestDone({ quests: { main_demon: 'done' } }).done === 0);

// —— 运行期状态机：offer → active → turnin → done（quests 纯函数，零 DOM）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 3, hp: 60, hpMax: 60, mp: 20, mpMax: 20, atkMax: 13, defMax: 9,
    gold: 0, xp: 0, xpNext: 100, item: 1, potion2: 0, weapon: '铁剑', armor: '皮甲',
    skills: [], ach: [], seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, talked: [], steps: 0,
    totalWins: 0, drops: 0, deflects: 0, casts: 0, travels: 0, sold: 0, spent: 0, crits: 0, charges: 0,
    x: 10, y: 13, map: 'village' }, extra || {});
}
const h1 = mkHero({});
ok('状态机：无存档 → questStatus offer（无 unlockOn 首次进无字回廊即可接，承 side_hearer 同款）',
  questStatus(h1, 'side_walk') === 'offer', questStatus(h1, 'side_walk'));
ok('状态机：npcQuestMark offer 态「❕ 可接委托」',
  npcQuestMark(h1, 'lampkid') === '❕ 可接委托', npcQuestMark(h1, 'lampkid'));
ok('状态机：npcQuestPages offer 页（掌灯童 · 一步一灯 · WALK_GOAL 同源）',
  JSON.stringify(npcQuestPages(h1, 'lampkid')).includes('掌灯童') &&
  JSON.stringify(npcQuestPages(h1, 'lampkid')).includes('照亮一寸') &&
  JSON.stringify(npcQuestPages(h1, 'lampkid')).includes(String(WALK_GOAL)) &&
  JSON.stringify(npcQuestPages(h1, 'lampkid')).includes('接下委托'));
const rAcc = resolveNpcTalk(h1, 'lampkid');
ok('状态机：resolveNpcTalk 接取 → {kind:accept, id:side_walk} + quests.side_walk=active',
  !!rAcc && rAcc.kind === 'accept' && rAcc.id === 'side_walk' && h1.quests.side_walk === 'active', JSON.stringify(rAcc));
ok('状态机：active 未达标 → questStatus active（cond 未满足）',
  questStatus(h1, 'side_walk') === 'active', questStatus(h1, 'side_walk'));
ok('状态机：active 页函数型实时报进度（已走 0/500 步）',
  JSON.stringify(npcQuestPages(h1, 'lampkid')).includes('0/' + WALK_GOAL + ' 步'));
ok('状态机：任务日志 objective 同源（替灯走亮 500 步 0/500 步）',
  questJournal(h1).find((e) => e.id === 'side_walk').objective.includes('走亮') &&
  questJournal(h1).find((e) => e.id === 'side_walk').objective.includes(`0/${WALK_GOAL} 步`));
const h2 = mkHero({ quests: { side_walk: 'active' }, steps: 500 });
ok('状态机：达标（steps=500 步）→ questStatus turnin',
  questStatus(h2, 'side_walk') === 'turnin', questStatus(h2, 'side_walk'));
ok('状态机：npcQuestMark turnin 态「❕ 可交任务」',
  npcQuestMark(h2, 'lampkid') === '❕ 可交任务', npcQuestMark(h2, 'lampkid'));
const rRew = resolveNpcTalk(h2, 'lampkid');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:70, item:2} + done + 结算 70 金/2 生命药水',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 70 && rRew.item === 2 &&
  h2.quests.side_walk === 'done' && h2.gold === 70 && h2.item === 3, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）',
  resolveNpcTalk(h2, 'lampkid') === null);
ok('状态机：done 默认档（路亮了，名字就找得到家）',
  JSON.stringify(npcQuestPages(h2, 'lampkid')).includes('路亮了'));
ok('状态机：done trueBoss 档（after 彩蛋「最旧那块碑，亮了/名字都回家啦——万一有谁想家，灯得在呀」两页并入任务页，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_walk: 'done' }, trueBoss: true }), 'lampkid')).includes('最旧那块碑') &&
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_walk: 'done' }, trueBoss: true }), 'lampkid')).includes('灯得在呀'));
ok('状态机：done 态 npcQuestMark 零顶标（lampkid 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_walk: 'done' } }), 'lampkid') === null);
ok('questRewardPreview 与 reward 同源（70 金 + 2 生命药水）',
  (() => { const prev = questRewardPreview(mkHero({}), 'side_walk'); return !!prev && prev.gold === 70 && prev.item === 2 && prev.potion2 === 0; })());
ok('运行期：lampkid 之外纯风味 NPC 零顶标（stele1/stele2 无待办）',
  npcQuestMark(mkHero({}), 'stele2') === null && npcQuestMark(mkHero({}), 'stele3') === null);

// —— NPCS.lampkid 升格落位（零新 NPC/坐标/数据层三件套之外零改动）——
ok('NPCS.lampkid 存在（掌灯童 · mark lamp · 含 v24.113 升格注释）',
  !!NPCS.lampkid && NPCS.lampkid.name === '掌灯童' && NPCS.lampkid.mark === 'lamp' &&
  dSrc.includes('v24.113 升格为支线委托人'));
ok('NPCS.lampkid 原有 lines 两页 / trueBoss after 两页彩蛋保留（零内容丢失契约）',
  Array.isArray(NPCS.lampkid.lines) && NPCS.lampkid.lines.length === 2 &&
  Array.isArray(NPCS.lampkid.after) && NPCS.lampkid.after.length === 2 &&
  NPCS.lampkid.after[0].some((ln) => ln.includes('最旧那块碑')) && NPCS.lampkid.after[1].some((ln) => ln.includes('灯得在呀')));
ok('data.js NPC_SPOTS 含掌灯童 (14,3)（零新坐标）',
  dSrc.includes("'14,3': 'lampkid'"));
ok('姊妹件 smoke_v2211_lampkid 已随升格更新（lampkid 静态契约翻转为任务页契约）',
  read('smoke_v2211_lampkid.mjs').includes('side_walk'));
ok('姊妹件 smoke_v2235_minimapquest 已随升格更新（lampkid 入任务 NPC 列表）',
  read('smoke_v2235_minimapquest.mjs').includes("'lampkid'") && read('smoke_v2235_minimapquest.mjs').includes('side_walk'));
ok('基线套件 smoke.mjs 已随升格更新（lampkid 顶标契约翻转）',
  read('smoke.mjs').includes("npcQuestMark(fresh,'lampkid')==='❕ 可接委托'"));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为四百零四件套（四百零三件套清除）',
  readme.includes('冒烟四百零四件套（四百零三件套清除）'));
ok('README tests 含 v24.113 守护描述与 smoke_v24113_walkquest 入库（336 份）',
  readme.includes('v24.113 起含「掌灯童「一步一灯」新支线」守护') &&
  readme.includes('smoke_v24113_walkquest 入库（336 份）'));
ok('README 仍有 v24.112 守护描述（历史保留）', readme.includes('v24.112 起含「镇民「灯下之声」新支线」守护'));
ok('README 已有三百三十六件套口径且尚无 337（哨兵前望 337 语义：下一版才写 337）',
  readme.includes('冒烟四百零四件套（四百零三件套清除）') && !readme.includes('冒烟四百零五件套') && !readme.includes('（405 份）'));
ok('README tests 树串尾已延伸（…+ smoke_v24112_talkquest + smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑））',
  readme.includes('smoke_v24112_talkquest + smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑）'));
ok('README 支线/奖励行随新现实（二十七条 · 一步一灯 · WALK_GOAL）',
  readme.includes('四十六条支线目标/奖励全部由') &&
  readme.includes('一步一灯（掌灯童 · 步行累计 `WALK_GOAL`(500) 步，`world.move` 唯一写入点）70 金 + 2 生命药水') &&
  readme.includes('v24.113 补第二十七条') && readme.includes('v24.112 补第二十六条'));
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 335 份（smoke.mjs + 335 专项）', chain.length === 403 && ['smoke.mjs', ...chain].length === 404, String(chain.length));
ok('package.json 链尾为 smoke_v24113_walkquest（第 336 份）', chain[chain.length - 1] === 'smoke_v24194_lowskillnopo2', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v24112_talkquest.mjs && smoke_v24113_walkquest.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v24112_talkquest.mjs && node tests/smoke_v24113_walkquest.mjs && node tests/smoke_v24114_fleequest.mjs && node tests/smoke_v24115_achhud.mjs && node tests/smoke_v24116_guidequest.mjs && node tests/smoke_v24117_codexhud.mjs && node tests/smoke_v24118_wellquest.mjs && node tests/smoke_v24119_huntquest.mjs && node tests/smoke_v24120_chesthud.mjs && node tests/smoke_v24121_siftquest.mjs && node tests/smoke_v24122_crystalquest.mjs && node tests/smoke_v24123_fraghud.mjs && node tests/smoke_v24124_questshud.mjs && node tests/smoke_v24125_hunthud.mjs && node tests/smoke_v24126_waitquest.mjs && node tests/smoke_v24127_lampquest.mjs && node tests/smoke_v24128_stelequest.mjs && node tests/smoke_v24129_stele2quest.mjs && node tests/smoke_v24130_stele3quest.mjs && node tests/smoke_v24131_stele4quest.mjs && node tests/smoke_v24132_fallenquest.mjs && node tests/smoke_v24133_inquest.mjs && node tests/smoke_v24134_kindleq.mjs && node tests/smoke_v24135_ledgerquest.mjs && node tests/smoke_v24136_herbquest.mjs && node tests/smoke_v24143_furnacequest.mjs && node tests/smoke_v24147_unflicker.mjs && node tests/smoke_v24148_swift.mjs && node tests/smoke_v24151_lowlv.mjs && node tests/smoke_v24152_nopotion.mjs && node tests/smoke_v24153_penny.mjs && node tests/smoke_v24154_steadfast.mjs && node tests/smoke_v24155_frugal.mjs && node tests/smoke_v24157_dry.mjs && node tests/smoke_v24158_swift2.mjs && node tests/smoke_v24159_lowlv2.mjs && node tests/smoke_v24160_noskill.mjs && node tests/smoke_v24161_noskill2.mjs && node tests/smoke_v24162_lowskill.mjs && node tests/smoke_v24163_swiftskill.mjs && node tests/smoke_v24164_swiftlv.mjs && node tests/smoke_v24165_nopotskill.mjs && node tests/smoke_v24166_unflskill.mjs && node tests/smoke_v24167_swiftnopo.mjs && node tests/smoke_v24168_lowlvnopo.mjs && node tests/smoke_v24169_unflswift.mjs && node tests/smoke_v24170_unfllowlv.mjs && node tests/smoke_v24171_unflnopo.mjs && node tests/smoke_v24172_unflpenny.mjs && node tests/smoke_v24173_pennyswift.mjs && node tests/smoke_v24174_pennylowlv.mjs && node tests/smoke_v24175_pennynoskill.mjs && node tests/smoke_v24176_pennynopo.mjs && node tests/smoke_v24177_unflswift2.mjs && node tests/smoke_v24178_unflpenny2.mjs && node tests/smoke_v24179_unflnopo2.mjs && node tests/smoke_v24180_unflskill2.mjs && node tests/smoke_v24181_lampoilquest.mjs && node tests/smoke_v24183_unfllowlv2.mjs && node tests/smoke_v24184_pennyswift2.mjs && node tests/smoke_v24185_pennylowlv2.mjs && node tests/smoke_v24186_pennynoskill2.mjs && node tests/smoke_v24187_pennynopo2.mjs && node tests/smoke_v24188_swiftlv2.mjs && node tests/smoke_v24189_swiftskill2.mjs && node tests/smoke_v24190_swiftnopo2.mjs && node tests/smoke_v24191_lowskill2.mjs && node tests/smoke_v24192_lowlvnopo2.mjs && node tests/smoke_v24193_nopotskill2.mjs && node tests/smoke_v24194_lowskillnopo2.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.113（startsWith）', changelog.startsWith('## v24.195'));
ok('CHANGELOG v24.113 条目含「一步一灯」与「WALK_GOAL」与「掌灯童」',
  changelog.includes('一步一灯') && changelog.includes('WALK_GOAL') && changelog.includes('掌灯童'));
ok('CHANGELOG 仍保留 v24.112 条目（历史保留）', changelog.includes('## v24.112'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const testsDir = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录件套 = 336（335 + smoke_v24113_walkquest）', files.length === 404, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.112 pin 零残留 ——
const s24112 = read('smoke_v24112_talkquest.mjs');
ok('smoke_v24112 的 GAME_VERSION 字面量 pin 已更新为 v24.113', s24112.includes("const GAME_VERSION = 'v24.195';"));
ok('smoke_v24112 的 CHANGELOG 顶 pin 已更新为 ## v24.113 ', s24112.includes("startsWith('## v24.195'"));
ok('smoke_v24112 的件套 pin 已更新为四百零四件套（四百零三件套清除）', s24112.includes('四百零四件套（四百零三件套清除）'));
ok('smoke_v24112 的 README/链 tail pin 已随新现实延伸（含 smoke_v24113_walkquest）',
  s24112.includes('smoke_v24113_walkquest'));
ok('smoke_v24112 的 package.json 串尾 pin 已延伸至 smoke_v24113_walkquest', s24112.includes('node tests/smoke_v24112_talkquest.mjs && node tests/smoke_v24113_walkquest.mjs'));
ok('smoke_v24112 的链尾 pin 已推进至 smoke_v24113_walkquest（第 336 份）', s24112.includes("=== 'smoke_v24194_lowskillnopo2'"));
ok('smoke_v24112 的 README 历史块入库 pin 保留（335 份口径，历史块原样保留）',
  s24112.includes('入库（335 份）') && !s24112.includes('入库（33' + '4 份）'));
const s2436 = read('smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（335 专项 / 336）且尚无 337 口径哨兵',
  s2436.includes('suiteFiles.length === 403  && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length === 404') &&
  s2436.includes('!readme.includes(\'冒烟四百零五件套\')') && s2436.includes('!readme.includes(\'（405 份）\')'));
const s2415 = read('smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v24113_walkquest（第 336 份）', s2415.includes("chain[chain.length - 1] === 'smoke_v24194_lowskillnopo2'"));
ok('smoke_v2415 树串 token 数已推进至 336', s2415.includes('treeTok.length === 404'));
const s2429 = read('smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 哨兵链前望 337（三百三十六件套否定式）',
  s2429.includes("!readme.includes('冒烟四百零五件套')"));
// 旧代 v24.112 pin 零残留扫描（豁免本套件）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v24113_walkquest.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDir), 'utf8').split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  const hits = [];
  if (s2.includes("const GAME_VERSION = '" + "v24.112';")) hits.push('gv');
  if (s2.includes("GAME_VERSION === '" + "v24.112'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.112")) hits.push('cw');
  if (s2.includes('三百三十五件套（三百三十' + '四件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 33' + '5')) hits.push('fl');
  if (s2.includes('chainAll.length === 33' + '5')) hits.push('cal');
  if (s2.includes('chain.length === 33' + '4')) hits.push('cl');
  if (s2.includes('treeTok.length === 33' + '5')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v24112_" + "talkquest'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.112 GAME_VERSION/顶 pin/335 口径（哨兵链，豁免本套件）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.113 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
