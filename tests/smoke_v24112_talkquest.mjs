// smoke_v24112_talkquest.mjs —— v24.112 专项冒烟：第二十六条支线「灯下之声」（镇民·与 TALK_GOAL(10) 处灯下之声交谈）
// （新内容·新支线——承 v24.111 听矿人「岩缝里的名字」/ v24.110 记誓人「蓄石为誓」/ v24.109 刻碑人「一凿入石」/
// v24.108 货栈掌柜「开张的生意」/ v24.107 货郎「路远灯长」/ v24.106 放灯童「月亮的路」/ v24.105 琴师「战歌的谱」/
// v24.100 说书人「灯下新章」同一「风味 NPC 升格为支线委托人」先例：基础 NPC「镇民」（潮灯镇 (10,13)，
// 「雾语林深处那口泉水，能把忘了的名字烫回来」/「魔物是从雾里长出来的——像被丢掉的记忆」）升格为委托人——
// 灯灭那阵子全镇人只顾赶路、灯下无声，每次与 NPC 交谈都算替镇子把一句话接回灯下，替他聊满 TALK_GOAL(10)
// 处灯下之声（计数 hero.talked 与 ACH_LIST talkall「有口皆碑」同读一份源，支线门槛 10 低于成就门槛
// Object.keys(NPCS).length(39)——顺路先完成支线再解锁成就；core.openTalk 全游戏唯一交谈入口唯一写入点；
// 零新计数零新状态零新存档）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.112 注释 / GAME_VERSION v24.112 与旧 v24.111 字面量零残留 /
// v24.111 及更早历史注释保留 / TALK_GOAL 常量与 export）、QUESTS 契约（26 side + 4 main、side_talk 字段
// 逐值、与 *_GOAL 同源、ACH_LIST allquests 同源互证、TALK_GOAL 低于 talkall 门槛互证）、quests.js 运行期
// 状态机（offer→active→turnin→done 全链路 + resolveNpcTalk 接取/交付结算 70 金+2 生命药水 + npcQuestMark/
// npcQuestPages 四态 + sideQuestDone 0/26·3/26·26/26）、NPCS.villager 升格落位（lines 两页与 after 两页保留
// 零内容丢失契约 + 姊妹件套已随升格更新）、README/package.json/CHANGELOG 同步（件套口径 335 + v24.112
// 守护描述 + 入库 335 + package 串尾 + CHANGELOG 顶 pin）、tests 目录与实跑链恒等（335）、哨兵链（前望 336 且
// README 尚无 336 口径）、旧代 v24.111 pin 全库零残留扫描（字面量/顶 pin/334 口径 · 豁免本套件）。
import { GAME_VERSION, QUESTS, TALK_GOAL, ACH_LIST, NPCS } from '../js/data.js';
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

console.log('— v24.112 镇民「灯下之声」新支线 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkgRaw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（格式合法 + 已越过 v24.111 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.111', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 111)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.112（旧 v24.111 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.192';") && !dSrc.includes("const GAME_VERSION = 'v24.111';"));
ok('data.js 含 v24.112 注释（灯下之声新支线说明）',
  dSrc.includes('v24.112 新内容·新支线（第二十六条）'));
ok('data.js 仍保留 v24.111 历史注释（岩缝里的名字说明，零内容丢失）',
  dSrc.includes('v24.111 新内容·新支线（第二十五条）') && dSrc.includes('v24.111 升格为支线委托人'));

// —— 源级落位：TALK_GOAL 常量 + export ——
ok('data.js TALK_GOAL 常量 = 10（与 BESTIARY_GOAL 比邻声明，同一家族）',
  dSrc.includes('const TALK_GOAL = 10;') && dSrc.indexOf('const TALK_GOAL') > dSrc.indexOf('const BESTIARY_GOAL'));
ok('data.js export 块含 TALK_GOAL（BESTIARY_GOAL 之后用例）',
  dSrc.includes('BESTIARY_GOAL, TALK_GOAL,'));
ok('TALK_GOAL 与 talkall 成就门槛同族互证（10 < Object.keys(NPCS).length(45)——顺路先完成支线再解锁成就）',
  (() => { const aTalk = ACH_LIST.find((a) => a.id === 'talkall');
    const allIds = Object.keys(NPCS);
    return !!aTalk && TALK_GOAL === 10 && allIds.length === 46 &&
      aTalk.ok({ talked: allIds.slice(0, 36) }) === false &&
      aTalk.ok({ talked: allIds }) === true &&
      TALK_GOAL < allIds.length; })());

// —— QUESTS 契约：26 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 30 条（26 side + 4 main，派生计数）',
  sideDefs.length === 46 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 50,
  `${sideDefs.length}/${mainDefs.length}`);
ok('side_talk 存在且为第二十六条（kind side · store · npc/giver villager · 无 unlockOn）',
  !!QUESTS.side_talk && QUESTS.side_talk.kind === 'side' && QUESTS.side_talk.store === true &&
  QUESTS.side_talk.npc === 'villager' && QUESTS.side_talk.giver === 'villager' &&
  QUESTS.side_talk.unlockOn == null);
ok('side_talk 名称「灯下之声」/where/obj/offer/turnin/done 落位',
  QUESTS.side_talk.name === '灯下之声' && QUESTS.side_talk.where.includes('潮灯镇') &&
  QUESTS.side_talk.obj.includes(String(TALK_GOAL)) && QUESTS.side_talk.obj.includes('灯下之声') &&
  QUESTS.side_talk.offer.includes('镇民') && QUESTS.side_talk.turnin.includes('镇民') &&
  QUESTS.side_talk.done.includes('说开了才亮'));
ok('side_talk cond/condProg 与 TALK_GOAL 同源（talked 计数，判/进/文/话一处调全端跟随）',
  QUESTS.side_talk.cond({ talked: ['a', 'b'] }) === false &&
  QUESTS.side_talk.cond({ talked: Array.from({ length: TALK_GOAL }, (_, i) => 'n' + i) }) === true &&
  QUESTS.side_talk.cond({}) === false && QUESTS.side_talk.cond({ talked: [] }) === false &&
  QUESTS.side_talk.condProg({}) === `0/${TALK_GOAL} 处` &&
  QUESTS.side_talk.condProg({ talked: ['a', 'b', 'c'] }) === `3/${TALK_GOAL} 处`);
ok('side_talk reward 逐值：70 金 + 2 生命药水（承 side_tale 70 档、高于 side_moon 60 档、低于 side_fish 90 档）',
  QUESTS.side_talk.reward.gold === 70 && QUESTS.side_talk.reward.item === 2 && !QUESTS.side_talk.reward.potion2);

// —— ACH_LIST allquests 同源互证（与 sideQuestDone 输出一致）——
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('ACH_LIST allquests 名称「灯火同心」且描述派生 26（「33 个支线任务」）',
  !!achAll && achAll.name === '灯火同心' && achAll.d.includes('46 个支线任务'), achAll && achAll.d);
ok('ACH_LIST allquests 判定/进度与 QUESTS 派生同源（0/26 false · 25/26 false · 26/26 true · prog 26/26）',
  !!achAll && achAll.ok({ quests: {} }) === false && achAll.ok({ quests: Object.fromEntries(sideDefs.slice(0, 25).map(q => [q.id, 'done'])) }) === false &&
  achAll.ok({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === true &&
  achAll.prog({ quests: {} }) === '0/46' && achAll.prog({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === '46/46');

// —— quests.js 运行期：sideQuestDone ——
ok('运行期：sideQuestDone 0/26 · 3/26 · 26/26 · 主线不入列',
  sideQuestDone({ quests: {} }).done === 0 && sideQuestDone({ quests: {} }).total === 46 &&
  sideQuestDone({ quests: { side_mushroom: 'done', side_cart: 'done', side_pond: 'done' } }).done === 3 &&
  sideQuestDone({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }).done === 46 &&
  sideQuestDone({ quests: { main_demon: 'done' } }).done === 0);

// —— 运行期状态机：offer → active → turnin → done（quests 纯函数，零 DOM）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 3, hp: 60, hpMax: 60, mp: 20, mpMax: 20, atkMax: 13, defMax: 9,
    gold: 0, xp: 0, xpNext: 100, item: 1, potion2: 0, weapon: '铁剑', armor: '皮甲',
    skills: [], ach: [], seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, talked: [],
    totalWins: 0, drops: 0, deflects: 0, casts: 0, travels: 0, sold: 0, spent: 0, crits: 0, charges: 0,
    x: 10, y: 13, map: 'village' }, extra || {});
}
const h1 = mkHero({});
ok('状态机：无存档 → questStatus offer（无 unlockOn 开局即可接，承 side_bell/side_pond 同款）',
  questStatus(h1, 'side_talk') === 'offer', questStatus(h1, 'side_talk'));
ok('状态机：npcQuestMark offer 态「❕ 可接委托」',
  npcQuestMark(h1, 'villager') === '❕ 可接委托', npcQuestMark(h1, 'villager'));
ok('状态机：npcQuestPages offer 页（镇民 · 灯下之声 · TALK_GOAL 同源）',
  JSON.stringify(npcQuestPages(h1, 'villager')).includes('镇民') &&
  JSON.stringify(npcQuestPages(h1, 'villager')).includes('灯灭那阵子') &&
  JSON.stringify(npcQuestPages(h1, 'villager')).includes(String(TALK_GOAL)) &&
  JSON.stringify(npcQuestPages(h1, 'villager')).includes('接下委托'));
const rAcc = resolveNpcTalk(h1, 'villager');
ok('状态机：resolveNpcTalk 接取 → {kind:accept, id:side_talk} + quests.side_talk=active',
  !!rAcc && rAcc.kind === 'accept' && rAcc.id === 'side_talk' && h1.quests.side_talk === 'active', JSON.stringify(rAcc));
ok('状态机：active 未达标 → questStatus active（cond 未满足）',
  questStatus(h1, 'side_talk') === 'active', questStatus(h1, 'side_talk'));
ok('状态机：active 页函数型实时报进度（已同 0/10 处交谈）',
  JSON.stringify(npcQuestPages(h1, 'villager')).includes('0/' + TALK_GOAL + ' 处'));
ok('状态机：任务日志 objective 同源（与 10 处灯下之声交谈 0/10 处）',
  questJournal(h1).find((e) => e.id === 'side_talk').objective.includes('灯下之声') &&
  questJournal(h1).find((e) => e.id === 'side_talk').objective.includes(`0/${TALK_GOAL} 处`));
const h2 = mkHero({ quests: { side_talk: 'active' }, talked: Array.from({ length: 10 }, (_, i) => 'npc' + i) });
ok('状态机：达标（talked=10 处）→ questStatus turnin',
  questStatus(h2, 'side_talk') === 'turnin', questStatus(h2, 'side_talk'));
ok('状态机：npcQuestMark turnin 态「❕ 可交任务」',
  npcQuestMark(h2, 'villager') === '❕ 可交任务', npcQuestMark(h2, 'villager'));
const rRew = resolveNpcTalk(h2, 'villager');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:70, item:2} + done + 结算 70 金/2 生命药水',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 70 && rRew.item === 2 &&
  h2.quests.side_talk === 'done' && h2.gold === 70 && h2.item === 3, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）',
  resolveNpcTalk(h2, 'villager') === null);
ok('状态机：done 默认档（话都说开了）',
  JSON.stringify(npcQuestPages(h2, 'villager')).includes('坐坐'));
ok('状态机：done trueBoss 档（after 彩蛋「雾散了/魔物回雾里去了——像被丢掉的记忆」两页并入任务页，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_talk: 'done' }, trueBoss: true }), 'villager')).includes('雾散了') &&
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_talk: 'done' }, trueBoss: true }), 'villager')).includes('被丢掉的记忆'));
ok('状态机：done 态 npcQuestMark 零顶标（villager 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_talk: 'done' } }), 'villager') === null);
ok('questRewardPreview 与 reward 同源（70 金 + 2 生命药水）',
  (() => { const prev = questRewardPreview(mkHero({}), 'side_talk'); return !!prev && prev.gold === 70 && prev.item === 2 && prev.potion2 === 0; })());
ok('运行期：villager 之外纯风味 NPC 零顶标（stele1/stele2 无待办）',
  npcQuestMark(mkHero({}), 'stele2') === null && npcQuestMark(mkHero({}), 'stele3') === null);

// —— NPCS.villager 升格落位（零新 NPC/坐标/数据层三件套之外零改动）——
ok('NPCS.villager 存在（镇民 · mark basket · 含 v24.112 升格注释）',
  !!NPCS.villager && NPCS.villager.name === '镇民' && NPCS.villager.mark === 'basket' &&
  dSrc.includes('v24.112 升格为支线委托人'));
ok('NPCS.villager 原有 lines 两页 / trueBoss after 两页彩蛋保留（零内容丢失契约）',
  Array.isArray(NPCS.villager.lines) && NPCS.villager.lines.length === 2 &&
  Array.isArray(NPCS.villager.after) && NPCS.villager.after.length === 2 &&
  NPCS.villager.after[0].some((ln) => ln.includes('雾散了')) && NPCS.villager.after[1].some((ln) => ln.includes('被丢掉的记忆')));
ok('data.js NPC_SPOTS 含镇民 (10,13)（零新坐标）',
  dSrc.includes("'10,13': 'villager'"));
ok('姊妹件 smoke_v2124_sentinel 已随升格更新（villager 静态契约翻转为任务页契约）',
  read('smoke_v2124_sentinel.mjs').includes('灯下之声'));
ok('姊妹件 smoke_v2235_minimapquest 已随升格更新（villager 入任务 NPC 列表）',
  read('smoke_v2235_minimapquest.mjs').includes("'villager'") && read('smoke_v2235_minimapquest.mjs').includes('side_talk'));
ok('基线套件 smoke.mjs 已随升格更新（villager 顶标契约翻转）',
  read('smoke.mjs').includes("npcQuestMark(fresh,'villager')==='❕ 可接委托'"));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为四百零二件套（四百零一件套清除）',
  readme.includes('冒烟四百零二件套（四百零一件套清除）'));
ok('README tests 含 v24.112 守护描述与 smoke_v24112_talkquest 入库（335 份）',
  readme.includes('v24.112 起含「镇民「灯下之声」新支线」守护') &&
  readme.includes('smoke_v24112_talkquest 入库（335 份）'));
ok('README 仍有 v24.111 守护描述（历史保留）', readme.includes('v24.111 起含「听矿人「岩缝里的名字」新支线」守护'));
ok('README 已有三百三十五件套口径且尚无 336（哨兵前望 336 语义：下一版才写 336）',
  readme.includes('冒烟四百零二件套（四百零一件套清除）') && !readme.includes('冒烟四百零三件套') && !readme.includes('（403 份）'));
ok('README tests 树串尾已延伸（…+ smoke_v24111_hearerquest + smoke_v24112_talkquest + smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑））',
  readme.includes('smoke_v24111_hearerquest + smoke_v24112_talkquest + smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑）'));
ok('README 支线/奖励行随新现实（二十六条 · 灯下之声 · TALK_GOAL）',
  readme.includes('四十六条支线目标/奖励全部由') &&
  readme.includes('灯下之声（镇民 · 与镇里镇外灯下之声交谈累计 `TALK_GOAL`(10) 处，`core.openTalk` 唯一写入点）70 金 + 2 生命药水') &&
  readme.includes('v24.112 补第二十六条') && readme.includes('v24.111 补第二十五条'));
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 334 份（smoke.mjs + 334 专项）', chain.length === 401 && ['smoke.mjs', ...chain].length === 402, String(chain.length));
ok('package.json 链尾为 smoke_v24112_talkquest（第 335 份）', chain[chain.length - 1] === 'smoke_v24192_lowlvnopo2', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v24111_hearerquest.mjs && smoke_v24112_talkquest.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v24111_hearerquest.mjs && node tests/smoke_v24112_talkquest.mjs && node tests/smoke_v24113_walkquest.mjs && node tests/smoke_v24114_fleequest.mjs && node tests/smoke_v24115_achhud.mjs && node tests/smoke_v24116_guidequest.mjs && node tests/smoke_v24117_codexhud.mjs && node tests/smoke_v24118_wellquest.mjs && node tests/smoke_v24119_huntquest.mjs && node tests/smoke_v24120_chesthud.mjs && node tests/smoke_v24121_siftquest.mjs && node tests/smoke_v24122_crystalquest.mjs && node tests/smoke_v24123_fraghud.mjs && node tests/smoke_v24124_questshud.mjs && node tests/smoke_v24125_hunthud.mjs && node tests/smoke_v24126_waitquest.mjs && node tests/smoke_v24127_lampquest.mjs && node tests/smoke_v24128_stelequest.mjs && node tests/smoke_v24129_stele2quest.mjs && node tests/smoke_v24130_stele3quest.mjs && node tests/smoke_v24131_stele4quest.mjs && node tests/smoke_v24132_fallenquest.mjs && node tests/smoke_v24133_inquest.mjs && node tests/smoke_v24134_kindleq.mjs && node tests/smoke_v24135_ledgerquest.mjs && node tests/smoke_v24136_herbquest.mjs && node tests/smoke_v24143_furnacequest.mjs && node tests/smoke_v24147_unflicker.mjs && node tests/smoke_v24148_swift.mjs && node tests/smoke_v24151_lowlv.mjs && node tests/smoke_v24152_nopotion.mjs && node tests/smoke_v24153_penny.mjs && node tests/smoke_v24154_steadfast.mjs && node tests/smoke_v24155_frugal.mjs && node tests/smoke_v24157_dry.mjs && node tests/smoke_v24158_swift2.mjs && node tests/smoke_v24159_lowlv2.mjs && node tests/smoke_v24160_noskill.mjs && node tests/smoke_v24161_noskill2.mjs && node tests/smoke_v24162_lowskill.mjs && node tests/smoke_v24163_swiftskill.mjs && node tests/smoke_v24164_swiftlv.mjs && node tests/smoke_v24165_nopotskill.mjs && node tests/smoke_v24166_unflskill.mjs && node tests/smoke_v24167_swiftnopo.mjs && node tests/smoke_v24168_lowlvnopo.mjs && node tests/smoke_v24169_unflswift.mjs && node tests/smoke_v24170_unfllowlv.mjs && node tests/smoke_v24171_unflnopo.mjs && node tests/smoke_v24172_unflpenny.mjs && node tests/smoke_v24173_pennyswift.mjs && node tests/smoke_v24174_pennylowlv.mjs && node tests/smoke_v24175_pennynoskill.mjs && node tests/smoke_v24176_pennynopo.mjs && node tests/smoke_v24177_unflswift2.mjs && node tests/smoke_v24178_unflpenny2.mjs && node tests/smoke_v24179_unflnopo2.mjs && node tests/smoke_v24180_unflskill2.mjs && node tests/smoke_v24181_lampoilquest.mjs && node tests/smoke_v24183_unfllowlv2.mjs && node tests/smoke_v24184_pennyswift2.mjs && node tests/smoke_v24185_pennylowlv2.mjs && node tests/smoke_v24186_pennynoskill2.mjs && node tests/smoke_v24187_pennynopo2.mjs && node tests/smoke_v24188_swiftlv2.mjs && node tests/smoke_v24189_swiftskill2.mjs && node tests/smoke_v24190_swiftnopo2.mjs && node tests/smoke_v24191_lowskill2.mjs && node tests/smoke_v24192_lowlvnopo2.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.112（startsWith）', changelog.startsWith('## v24.192'));
ok('CHANGELOG v24.112 条目含「灯下之声」与「TALK_GOAL」与「镇民」',
  changelog.includes('灯下之声') && changelog.includes('TALK_GOAL') && changelog.includes('镇民'));
ok('CHANGELOG 仍保留 v24.111 条目（历史保留）', changelog.includes('## v24.111'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const testsDir = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录件套 = 335（334 + smoke_v24112_talkquest）', files.length === 402, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.111 pin 零残留 ——
const s24111 = read('smoke_v24111_hearerquest.mjs');
ok('smoke_v24111 的 GAME_VERSION 字面量 pin 已更新为 v24.112', s24111.includes("const GAME_VERSION = 'v24.192';"));
ok('smoke_v24111 的 CHANGELOG 顶 pin 已更新为 ## v24.112 ', s24111.includes("startsWith('## v24.192'"));
ok('smoke_v24111 的件套 pin 已更新为四百零二件套（四百零一件套清除）', s24111.includes('四百零二件套（四百零一件套清除）'));
ok('smoke_v24111 的 README/链 tail pin 已随新现实延伸（含 smoke_v24112_talkquest）',
  s24111.includes('smoke_v24112_talkquest'));
ok('smoke_v24111 的 package.json 串尾 pin 已延伸至 smoke_v24112_talkquest', s24111.includes('node tests/smoke_v24111_hearerquest.mjs && node tests/smoke_v24112_talkquest.mjs'));
ok('smoke_v24111 的链尾 pin 已推进至 smoke_v24112_talkquest（第 335 份）', s24111.includes("=== 'smoke_v24192_lowlvnopo2'"));
ok('smoke_v24111 的入库 pin 已推进至 335 份', s24111.includes('入库（335 份）'));
const s2436 = read('smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（334 专项 / 335）且尚无 336 口径哨兵',
  s2436.includes('suiteFiles.length === 401  && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length === 402') &&
  s2436.includes('!readme.includes(\'冒烟四百零三件套\')') && s2436.includes('!readme.includes(\'（403 份）\')'));
const s2415 = read('smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v24112_talkquest（第 335 份）', s2415.includes("chain[chain.length - 1] === 'smoke_v24192_lowlvnopo2'"));
ok('smoke_v2415 树串 token 数已推进至 335', s2415.includes('treeTok.length === 402'));
const s2429 = read('smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 哨兵链前望 336（三百三十五件套否定式）',
  s2429.includes("!readme.includes('冒烟四百零三件套')"));
// 旧代 v24.111 pin 零残留扫描（豁免本套件）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v24112_talkquest.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDir), 'utf8').split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  const hits = [];
  if (s2.includes("const GAME_VERSION = '" + "v24.111';")) hits.push('gv');
  if (s2.includes("GAME_VERSION === '" + "v24.111'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.111")) hits.push('cw');
  if (s2.includes('入库（33' + '4 份）')) hits.push('ruku');
  if (s2.includes('三百三十四件套（三百三十' + '三件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 33' + '4')) hits.push('fl');
  if (s2.includes('chainAll.length === 33' + '4')) hits.push('cal');
  if (s2.includes('chain.length === 33' + '3')) hits.push('cl');
  if (s2.includes('treeTok.length === 33' + '4')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v24111_" + "hearerquest'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.111 GAME_VERSION/顶 pin/334 口径（哨兵链，豁免本套件）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.112 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
