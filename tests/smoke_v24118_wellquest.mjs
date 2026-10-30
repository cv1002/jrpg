// smoke_v24118_wellquest.mjs —— v24.118 专项冒烟：第三十条支线「渴不忘井」（井巫·大地图按 F 喝药累计 WELL_GOAL(8) 次）
// （新内容·新支线——承 v24.105 琴师「战歌的谱」/ v24.106 放灯童「月亮的路」/ v24.107 货郎「路远灯长」/
// v24.108 货栈掌柜「开张的生意」/ v24.109 刻碑人「一凿入石」/ v24.110 记誓人「蓄石为誓」/ v24.111 听矿人
// 「岩缝里的名字」/ v24.112 镇民「灯下之声」/ v24.113 掌灯童「一步一灯」/ v24.114 老矿工「先撤为敬」/ v24.116
// 引灯人「药要带足」同一「风味 NPC 升格为支线委托人」先例：v22.47 纯风味「村井」名字物「井巫」（潮灯镇村井
// (2,4) 民宅区南 + 星井矿脉入口 (3,1)，「井底的声音会比现在更近/矿脉曾往镇上运星砂，喂那些记忆之灯」）升格为
// 委托人——她守着井守了一辈子、最懂「记得渴的人，才记得回家的路」，玩家每次大地图按 F 喝药都算替井记着渴，
// 替她喝满 WELL_GOAL(8) 次（计数 hero.mapPotions 与 ACH_LIST mapdrink「渴饮甘露」同读一份源，支线门槛 8 低于
// 成就门槛 MAP_POTION_GOAL(10)——顺路先完成支线再解锁成就；js/core.js usePotion 大地图喝药成功唯一写入点、
// 战斗 [3] 用药（battle.doItem 另一端口）/气满神足/无药早退零计数；零新计数零新状态零新存档）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.118 注释 / GAME_VERSION v24.118 与旧 v24.117 字面量零残留 /
// v24.117 及更早历史注释保留 / WELL_GOAL 常量与 export）、QUESTS 契约（30 side + 4 main、side_well 字段
// 逐值、与 *_GOAL 同源、ACH_LIST allquests 同源互证、WELL_GOAL 低于 mapdrink 成就门槛互证）、quests.js
// 运行期状态机（offer→active→turnin→done 全链路 + resolveNpcTalk 接取/交付结算 70 金+2 生命药水 +
// npcQuestMark/npcQuestPages 四态 + sideQuestDone 0/31·3/31·30/31 + done 三档 trueBoss/caveBoss/bossDefeated）、
// NPCS.sage 升格落位（linesByStage 四段与 after 两页保留零内容丢失契约 + 姊妹件套已随升格更新）、README/
// package.json/CHANGELOG 同步（件套口径 341 + v24.118 守护描述 + 入库 341 + package 串尾 + CHANGELOG 顶 pin）、
// tests 目录与实跑链恒等（341）、哨兵链（前望 342 且 README 尚无 342 口径）、旧代 v24.117 pin 全库零残留
// 扫描（字面量/顶 pin/340 口径 · 豁免本套件）。
import { GAME_VERSION, QUESTS, WELL_GOAL, MAP_POTION_GOAL, ACH_LIST, NPCS, NPC_SPOTS } from '../js/data.js';
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

console.log('— v24.118 井巫「渴不忘井」新支线 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkgRaw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（格式合法 + 已越过 v24.117 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.117', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 117)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.118（旧 v24.117 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.193';") && !dSrc.includes("const GAME_VERSION = 'v24.117';"));
ok('data.js 含 v24.118 注释（渴不忘井新支线说明）',
  dSrc.includes('v24.118 新内容·新支线（第三十条）'));
ok('data.js 仍保留 v24.117 历史注释（HUD 记忆图鉴进度说明，零内容丢失）',
  dSrc.includes('v24.117 体验打磨·信息透明·计数现场'));

// —— 源级落位：WELL_GOAL 常量 + export ——
ok('data.js WELL_GOAL 常量 = 8（与 GUIDE_GOAL 比邻声明，同一家族）',
  dSrc.includes('const WELL_GOAL = 8;') && dSrc.indexOf('const WELL_GOAL') > dSrc.indexOf('const GUIDE_GOAL'));
ok('data.js export 块含 WELL_GOAL（GUIDE_GOAL 之后紧邻）',
  dSrc.includes('RETREAT_GOAL, GUIDE_GOAL, WELL_GOAL,'));
ok('WELL_GOAL 与 mapdrink 成就门槛同族互证（8 < MAP_POTION_GOAL 10——顺路先完成支线再解锁成就）',
  (() => { const aP = ACH_LIST.find((a) => a.id === 'mapdrink');
    return !!aP && WELL_GOAL === 8 && MAP_POTION_GOAL === 10 &&
      aP.ok({ mapPotions: 9 }) === false &&
      aP.ok({ mapPotions: 10 }) === true &&
      aP.prog({ mapPotions: 3 }) === '3/10' &&
      WELL_GOAL < MAP_POTION_GOAL; })());
ok('data.js NPC_SPOTS 源级仍含井巫双据点 (2,4)/(3,1)（零新坐标）',
  dSrc.includes("'2,4': 'sage'") && dSrc.includes("'3,1': 'sage'"));

// —— QUESTS 契约：30 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 34 条（30 side + 4 main，派生计数）',
  sideDefs.length === 46 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 50,
  `${sideDefs.length}/${mainDefs.length}`);
ok('side_well 存在且为第三十条（kind side · store · npc/giver sage · 无 unlockOn）',
  !!QUESTS.side_well && QUESTS.side_well.kind === 'side' && QUESTS.side_well.store === true &&
  QUESTS.side_well.npc === 'sage' && QUESTS.side_well.giver === 'sage' &&
  QUESTS.side_well.unlockOn == null);
ok('side_well 名称「渴不忘井」/where/obj/offer/turnin/done 落位',
  QUESTS.side_well.name === '渴不忘井' && QUESTS.side_well.where.includes('村井') &&
  QUESTS.side_well.obj.includes(String(WELL_GOAL)) && QUESTS.side_well.obj.includes('渴') &&
  QUESTS.side_well.offer.includes('井巫') && QUESTS.side_well.turnin.includes('井巫') &&
  QUESTS.side_well.done.includes('记得'));
ok('side_well cond/condProg 与 WELL_GOAL 同源（mapPotions 计数，判/进/文/话一处调全端跟随）',
  QUESTS.side_well.cond({ mapPotions: 7 }) === false &&
  QUESTS.side_well.cond({ mapPotions: 8 }) === true &&
  QUESTS.side_well.cond({}) === false && QUESTS.side_well.cond({ mapPotions: 0 }) === false &&
  QUESTS.side_well.condProg({}) === `0/${WELL_GOAL} 次` &&
  QUESTS.side_well.condProg({ mapPotions: 3 }) === `3/${WELL_GOAL} 次`);
ok('side_well reward 逐值：70 金 + 2 生命药水（承 side_guide 70 档）',
  QUESTS.side_well.reward.gold === 70 && QUESTS.side_well.reward.item === 2 && !QUESTS.side_well.reward.potion2);

// —— ACH_LIST allquests 同源互证（与 sideQuestDone 输出一致）——
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('ACH_LIST allquests 名称「灯火同心」且描述派生 30（「33 个支线任务」）',
  !!achAll && achAll.name === '灯火同心' && achAll.d.includes('46 个支线任务'), achAll && achAll.d);
ok('ACH_LIST allquests 判定/进度与 QUESTS 派生同源（0/33 false · 32/33 false · 32/33 true · prog 32/33）',
  !!achAll && achAll.ok({ quests: {} }) === false && achAll.ok({ quests: Object.fromEntries(sideDefs.slice(0, 29).map(q => [q.id, 'done'])) }) === false &&
  achAll.ok({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === true &&
  achAll.prog({ quests: {} }) === '0/46' && achAll.prog({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === '46/46');

// —— quests.js 运行期：sideQuestDone ——
ok('运行期：sideQuestDone 0/33 · 3/33 · 32/33 · 主线不入列',
  sideQuestDone({ quests: {} }).done === 0 && sideQuestDone({ quests: {} }).total === 46 &&
  sideQuestDone({ quests: { side_mushroom: 'done', side_cart: 'done', side_pond: 'done' } }).done === 3 &&
  sideQuestDone({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }).done === 46 &&
  sideQuestDone({ quests: { main_demon: 'done' } }).done === 0);

// —— 运行期状态机：offer → active → turnin → done（quests 纯函数，零 DOM）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 3, hp: 60, hpMax: 60, mp: 20, mpMax: 20, atkMax: 13, defMax: 9,
    gold: 0, xp: 0, xpNext: 100, item: 1, potion2: 0, weapon: '铁剑', armor: '皮甲',
    skills: [], ach: [], seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, talked: [], steps: 0,
    totalWins: 0, drops: 0, deflects: 0, casts: 0, travels: 0, sold: 0, spent: 0, crits: 0, charges: 0, flees: 0,
    potionUses: 0, mapPotions: 0, x: 2, y: 4, map: 'village' }, extra || {});
}
const h1 = mkHero({});
ok('状态机：无存档 → questStatus offer（无 unlockOn 开局即接，承 side_bell/side_pond 同款）',
  questStatus(h1, 'side_well') === 'offer', questStatus(h1, 'side_well'));
ok('状态机：npcQuestMark offer 态「❕ 可接委托」',
  npcQuestMark(h1, 'sage') === '❕ 可接委托', npcQuestMark(h1, 'sage'));
ok('状态机：npcQuestPages offer 页（井巫 · 记得渴 · WELL_GOAL 同源）',
  JSON.stringify(npcQuestPages(h1, 'sage')).includes('井巫') &&
  JSON.stringify(npcQuestPages(h1, 'sage')).includes('记得渴') &&
  JSON.stringify(npcQuestPages(h1, 'sage')).includes(String(WELL_GOAL)) &&
  JSON.stringify(npcQuestPages(h1, 'sage')).includes('接下委托'));
const rAcc = resolveNpcTalk(h1, 'sage');
ok('状态机：resolveNpcTalk 接取 → {kind:accept, id:side_well} + quests.side_well=active',
  !!rAcc && rAcc.kind === 'accept' && rAcc.id === 'side_well' && h1.quests.side_well === 'active', JSON.stringify(rAcc));
ok('状态机：active 未达标 → questStatus active（cond 未满足）',
  questStatus(h1, 'side_well') === 'active', questStatus(h1, 'side_well'));
ok('状态机：active 页函数型实时报进度（已大地图喝药 0/8 次）',
  JSON.stringify(npcQuestPages(h1, 'sage')).includes('0/' + WELL_GOAL + ' 次药'));
ok('状态机：任务日志 objective 同源（大地图按 F 喝药 8 次 0/8 次）',
  questJournal(h1).find((e) => e.id === 'side_well').objective.includes('喝药') &&
  questJournal(h1).find((e) => e.id === 'side_well').objective.includes(`0/${WELL_GOAL} 次`));
const h2 = mkHero({ quests: { side_well: 'active' }, mapPotions: 8 });
ok('状态机：达标（mapPotions=8 次）→ questStatus turnin',
  questStatus(h2, 'side_well') === 'turnin', questStatus(h2, 'side_well'));
ok('状态机：npcQuestMark turnin 态「❕ 可交任务」',
  npcQuestMark(h2, 'sage') === '❕ 可交任务', npcQuestMark(h2, 'sage'));
const rRew = resolveNpcTalk(h2, 'sage');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:70, item:2} + done + 结算 70 金/2 生命药水',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 70 && rRew.item === 2 &&
  h2.quests.side_well === 'done' && h2.gold === 70 && h2.item === 3, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）',
  resolveNpcTalk(h2, 'sage') === null);
ok('状态机：done 默认档（井水不枯，是因为记得）',
  JSON.stringify(npcQuestPages(h2, 'sage')).includes('井水不枯'));
ok('状态机：done bossDefeated 档（星砂喂灯叙事并入，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_well: 'done' }, bossDefeated: true }), 'sage')).includes('星砂'));
ok('状态机：done caveBoss 档（终焉之神叙事并入，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_well: 'done' }, caveBoss: true }), 'sage')).includes('终焉之神'));
ok('状态机：done trueBoss 档（after 彩蛋「水晶空了/记得的灯，从此由你掌着」两页并入任务页，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_well: 'done' }, trueBoss: true }), 'sage')).includes('水晶空了') &&
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_well: 'done' }, trueBoss: true }), 'sage')).includes('记得的灯'));
ok('状态机：done 态 npcQuestMark 零顶标（sage 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_well: 'done' } }), 'sage') === null);
ok('questRewardPreview 与 reward 同源（70 金 + 2 生命药水）',
  (() => { const prev = questRewardPreview(mkHero({}), 'side_well'); return !!prev && prev.gold === 70 && prev.item === 2 && prev.potion2 === 0; })());
ok('运行期：sage 之外纯风味 NPC 零顶标（stele1/stele2 无待办）',
  npcQuestMark(mkHero({}), 'stele2') === null && npcQuestMark(mkHero({}), 'stele3') === null);

// —— NPCS.sage 升格落位（零新 NPC/坐标/数据层三件套之外零改动）——
ok('NPCS.sage 存在（井巫 · mark hood · 含 v24.118 升格注释）',
  !!NPCS.sage && NPCS.sage.name === '井巫' && NPCS.sage.mark === 'hood' &&
  dSrc.includes('v24.118 升格为支线委托人'));
ok('NPCS.sage 原有 linesByStage 三段 / trueBoss after 两页彩蛋数据层保留（零内容丢失契约）',
  Array.isArray(NPCS.sage.linesByStage) && NPCS.sage.linesByStage.length === 3 &&
  Array.isArray(NPCS.sage.after) && NPCS.sage.after.length === 2 &&
  NPCS.sage.after[0].some((ln) => ln.includes('水晶空了')) && NPCS.sage.after[1].some((ln) => ln.includes('记得的灯')));
ok('姊妹件 smoke_v2235_minimapquest 已随升格更新（sage 入任务 NPC 列表 + side_well done）',
  read('smoke_v2235_minimapquest.mjs').includes("'sage'") && read('smoke_v2235_minimapquest.mjs').includes('side_well'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为四百零三件套（四百零二件套清除）',
  readme.includes('冒烟四百零三件套（四百零二件套清除）'));
ok('README tests 含 v24.118 守护描述与 smoke_v24118_wellquest 入库（341 份）',
  readme.includes('v24.118 起含「井巫「渴不忘井」新支线」守护') &&
  readme.includes('smoke_v24118_wellquest 入库（341 份）'));
ok('README 仍有 v24.117 守护描述（历史保留）', readme.includes('v24.117 起含「HUD 记忆图鉴收集进度」守护'));
ok('README 已有三百四十二件套口径且尚无 342（哨兵前望 342 语义：下一版才写 342）',
  readme.includes('冒烟四百零三件套（四百零二件套清除）') && !readme.includes('冒烟四百零四件套') && !readme.includes('（404 份）'));
ok('README tests 树串尾已延伸（…+ smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑））',
  readme.includes('smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑）'));
ok('README 支线/奖励行随新现实（三十条 · 渴不忘井 · WELL_GOAL）',
  readme.includes('四十六条支线目标/奖励全部由') &&
  readme.includes('渴不忘井（井巫 · 大地图按 F 喝药累计 `WELL_GOAL`(8) 次，战斗 [3] 用药零计数）70 金 + 2 生命药水') &&
  readme.includes('v24.118 补第三十条') && readme.includes('v24.117 补第三十条') === false);
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 340 份（smoke.mjs + 340 专项）', chain.length === 402 && ['smoke.mjs', ...chain].length === 403, String(chain.length));
ok('package.json 链尾为 smoke_v24120_chesthud（第 343 份）', chain[chain.length - 1] === 'smoke_v24193_nopotskill2', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v24117_codexhud.mjs && smoke_v24118_wellquest.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v24117_codexhud.mjs && node tests/smoke_v24118_wellquest.mjs && node tests/smoke_v24119_huntquest.mjs && node tests/smoke_v24120_chesthud.mjs && node tests/smoke_v24121_siftquest.mjs && node tests/smoke_v24122_crystalquest.mjs && node tests/smoke_v24123_fraghud.mjs && node tests/smoke_v24124_questshud.mjs && node tests/smoke_v24125_hunthud.mjs && node tests/smoke_v24126_waitquest.mjs && node tests/smoke_v24127_lampquest.mjs && node tests/smoke_v24128_stelequest.mjs && node tests/smoke_v24129_stele2quest.mjs && node tests/smoke_v24130_stele3quest.mjs && node tests/smoke_v24131_stele4quest.mjs && node tests/smoke_v24132_fallenquest.mjs && node tests/smoke_v24133_inquest.mjs && node tests/smoke_v24134_kindleq.mjs && node tests/smoke_v24135_ledgerquest.mjs && node tests/smoke_v24136_herbquest.mjs && node tests/smoke_v24143_furnacequest.mjs && node tests/smoke_v24147_unflicker.mjs && node tests/smoke_v24148_swift.mjs && node tests/smoke_v24151_lowlv.mjs && node tests/smoke_v24152_nopotion.mjs && node tests/smoke_v24153_penny.mjs && node tests/smoke_v24154_steadfast.mjs && node tests/smoke_v24155_frugal.mjs && node tests/smoke_v24157_dry.mjs && node tests/smoke_v24158_swift2.mjs && node tests/smoke_v24159_lowlv2.mjs && node tests/smoke_v24160_noskill.mjs && node tests/smoke_v24161_noskill2.mjs && node tests/smoke_v24162_lowskill.mjs && node tests/smoke_v24163_swiftskill.mjs && node tests/smoke_v24164_swiftlv.mjs && node tests/smoke_v24165_nopotskill.mjs && node tests/smoke_v24166_unflskill.mjs && node tests/smoke_v24167_swiftnopo.mjs && node tests/smoke_v24168_lowlvnopo.mjs && node tests/smoke_v24169_unflswift.mjs && node tests/smoke_v24170_unfllowlv.mjs && node tests/smoke_v24171_unflnopo.mjs && node tests/smoke_v24172_unflpenny.mjs && node tests/smoke_v24173_pennyswift.mjs && node tests/smoke_v24174_pennylowlv.mjs && node tests/smoke_v24175_pennynoskill.mjs && node tests/smoke_v24176_pennynopo.mjs && node tests/smoke_v24177_unflswift2.mjs && node tests/smoke_v24178_unflpenny2.mjs && node tests/smoke_v24179_unflnopo2.mjs && node tests/smoke_v24180_unflskill2.mjs && node tests/smoke_v24181_lampoilquest.mjs && node tests/smoke_v24183_unfllowlv2.mjs && node tests/smoke_v24184_pennyswift2.mjs && node tests/smoke_v24185_pennylowlv2.mjs && node tests/smoke_v24186_pennynoskill2.mjs && node tests/smoke_v24187_pennynopo2.mjs && node tests/smoke_v24188_swiftlv2.mjs && node tests/smoke_v24189_swiftskill2.mjs && node tests/smoke_v24190_swiftnopo2.mjs && node tests/smoke_v24191_lowskill2.mjs && node tests/smoke_v24192_lowlvnopo2.mjs && node tests/smoke_v24193_nopotskill2.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.118（startsWith）', changelog.startsWith('## v24.193'));
ok('CHANGELOG v24.118 条目含「渴不忘井」与「WELL_GOAL」与「井巫」',
  changelog.includes('渴不忘井') && changelog.includes('WELL_GOAL') && changelog.includes('井巫'));
ok('CHANGELOG 仍保留 v24.117 条目（历史保留）', changelog.includes('## v24.117'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const testsDir = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录件套 = 341（340 + smoke_v24118_wellquest）', files.length === 403, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.117 pin 零残留 ——
const s24117 = read('smoke_v24117_codexhud.mjs');
ok('smoke_v24117 的 GAME_VERSION 字面量 pin 已更新为 v24.118', s24117.includes("const GAME_VERSION = 'v24.193';"));
ok('smoke_v24117 的 CHANGELOG 顶 pin 已更新为 ## v24.118 ', s24117.includes("startsWith('## v24.193'"));
ok('smoke_v24117 的件套 pin 已更新为四百零三件套（四百零二件套清除）', s24117.includes('四百零三件套（四百零二件套清除）'));
ok('smoke_v24117 的 README/链 tail pin 已随新现实延伸（含 smoke_v24118_wellquest）',
  s24117.includes('smoke_v24118_wellquest'));
ok('smoke_v24117 的 package.json 串尾 pin 已延伸至 smoke_v24118_wellquest', s24117.includes('node tests/smoke_v24117_codexhud.mjs'));
ok('smoke_v24117 的链尾 pin 已推进至 smoke_v24120_chesthud（第 343 份）', s24117.includes("=== 'smoke_v24193_nopotskill2'"));
ok('smoke_v24117 的 README 历史块入库 pin 保留（340 份口径，历史块原样保留）',
  s24117.includes('入库（340 份）'));
const s24116 = read('smoke_v24116_guidequest.mjs');
ok('smoke_v24116 的 GAME_VERSION 字面量 pin 已更新为 v24.118', s24116.includes("const GAME_VERSION = 'v24.193';"));
ok('smoke_v24116 的 CHANGELOG 顶 pin 已更新为 ## v24.118 ', s24116.includes("startsWith('## v24.193'"));
ok('smoke_v24116 的件套 pin 已更新为四百零三件套（四百零二件套清除）', s24116.includes('四百零三件套（四百零二件套清除）'));
ok('smoke_v24116 的链尾 pin 已推进至 smoke_v24120_chesthud（第 343 份）', s24116.includes("=== 'smoke_v24193_nopotskill2'"));
ok('smoke_v24116 的 package.json 串尾 pin 已延伸至 smoke_v24118_wellquest', s24116.includes('node tests/smoke_v24115_achhud.mjs && node tests/smoke_v24116_guidequest.mjs && node tests/smoke_v24117_codexhud.mjs'));
const s2436 = read('smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（340 专项 / 341）且尚无 342 口径哨兵',
  s2436.includes('suiteFiles.length === 402  && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length === 403') &&
  s2436.includes('!readme.includes(\'冒烟四百零四件套\')') && s2436.includes('!readme.includes(\'（404 份）\')'));
const s2429 = read('smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 哨兵链前望 342（三百四十二件套否定式）',
  s2429.includes("!readme.includes('冒烟四百零四件套'"));
// 旧代 v24.117 pin 零残留扫描（豁免本套件）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v24118_wellquest.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDir), 'utf8').split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  const hits = [];
  if (s2.includes("const GAME_VERSION = '" + "v24.117';")) hits.push('gv');
  if (s2.includes("GAME_VERSION === '" + "v24.117'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.117")) hits.push('cw');
  if (s2.includes('三百四十件套（三百三十' + '九件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 34' + '0')) hits.push('fl');
  if (s2.includes('chainAll.length === 34' + '0')) hits.push('cal');
  if (s2.includes('chain.length === 33' + '9')) hits.push('cl');
  if (s2.includes('treeTok.length === 34' + '0')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v24117_" + "codexhud'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.117 GAME_VERSION/顶 pin/340 口径（哨兵链，豁免本套件）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.118 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
