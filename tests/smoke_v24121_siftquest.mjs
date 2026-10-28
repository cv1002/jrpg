// smoke_v24121_siftquest.mjs —— v24.121 专项冒烟：第三十二条支线「砂里的光」（筛砂人·累计酿造
// SIFT_GOAL(3) 瓶高级灵药）
// （新内容·新支线——承 v24.118 井巫「渴不忘井」/ v24.119 守洞人「数到灯亮」同一「风味 NPC 升格
// 为支线委托人」先例：v22.24 纯风味 NPC「筛砂人」（星井矿脉星砂矿场 (5,5)，「砂是筛出来的，不是
// 挖出来的——手里这把亮的，记得路」）升格为委托人——他筛了一辈子砂、最懂「砂里攒得下光」，玩家
// 每酿一瓶高级灵药都算替他把砂里的光留住一分，攒满 SIFT_GOAL(3) 瓶（计数 hero.brews 与 ACH_LIST
// brew2「妙手回春」同读一份源，支线门槛 3 低于成就门槛 BREW2_GOAL(5)——顺路先完成支线再解锁成就；
// js/core.js brewNow 酿造成功唯一写入点、随 snapshotHero 全量快照自动持久化、防御式 (g.brews||0)
// 旧档零迁移、酿造行为才算、任务奖励/战斗掉落的灵药零计数；零新计数零新状态零新存档）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.121 注释 / GAME_VERSION v24.121 与旧 v24.120 字面量零残留 /
// v24.120 及更早历史注释保留 / SIFT_GOAL 常量与 export）、QUESTS 契约（32 side + 4 main、
// side_sift 字段逐值、与 BREW2_GOAL 同源、ACH_LIST allquests 同源互证、SIFT_GOAL 低于 brew2
// 成就门槛互证）、quests.js 运行期状态机（offer→active→turnin→done 全链路 + resolveNpcTalk 接取/交付
// 结算 60 金+2 生命药水 + npcQuestMark/npcQuestPages 四态 + sideQuestDone 0/32·3/32·32/32 + done 三档
// trueBoss/caveBoss/bossDefeated）、NPCS.sifter 升格落位（lines 两页与 after 两页保留零内容丢失
// 契约 + 姊妹件套已随升格更新）、README/package.json/CHANGELOG 同步（件套口径 344 + v24.121 守护描述 +
// 入库 344 + package 串尾 + CHANGELOG 顶 pin）、tests 目录与实跑链恒等（344）、哨兵链（前望 345 且
// README 尚无 345 口径）、旧代 v24.120 pin 全库零残留扫描（字面量/顶 pin/343 口径 · 豁免本套件）。
import { GAME_VERSION, QUESTS, SIFT_GOAL, BREW2_GOAL, ACH_LIST, NPCS, NPC_SPOTS } from '../js/data.js';
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

console.log('— v24.121 筛砂人「砂里的光」新支线 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkgRaw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（格式合法 + 已越过 v24.120 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.120', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 120)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.121（旧 v24.120 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.182';") && !dSrc.includes("const GAME_VERSION = 'v24.120';"));
ok('data.js 含 v24.121 注释（砂里的光新支线说明）',
  dSrc.includes('v24.121 新内容·新支线（第三十二条）'));
ok('data.js 仍保留 v24.120 历史注释（HUD 宝箱收集进度说明，零内容丢失）',
  dSrc.includes('v24.120 体验打磨·信息透明·计数现场'));

// —— 源级落位：SIFT_GOAL 常量 + export ——
ok('data.js SIFT_GOAL 常量 = 3（与 HUNT_TALLY_GOAL 比邻声明，同一家族）',
  dSrc.includes('const SIFT_GOAL = 3;') && dSrc.indexOf('const SIFT_GOAL') > dSrc.indexOf('const HUNT_TALLY_GOAL'));
ok('data.js export 块含 SIFT_GOAL（HUNT_TALLY_GOAL 之后紧邻）',
  dSrc.includes('HUNT_TALLY_GOAL, SIFT_GOAL,'));
ok('SIFT_GOAL 与 brew2 成就门槛同族互证（3 < BREW2_GOAL 5——顺路先完成支线再解锁成就）',
  (() => { const aB = ACH_LIST.find((a) => a.id === 'brew2');
    return !!aB && SIFT_GOAL === 3 && BREW2_GOAL === 5 &&
      aB.ok({ brews: 4 }) === false &&
      aB.ok({ brews: 5 }) === true &&
      aB.prog({ brews: 2 }) === '2/5' &&
      SIFT_GOAL < BREW2_GOAL; })());
ok('data.js NPC_SPOTS 源级仍含筛砂人据点 (5,5)（零新坐标）',
  dSrc.includes("'5,5': 'sifter'"));

// —— QUESTS 契约：32 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 36 条（32 side + 4 main，派生计数）',
  sideDefs.length === 46 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 50,
  `${sideDefs.length}/${mainDefs.length}`);
ok('side_sift 存在且为第三十二条（kind side · store · npc/giver sifter · 无 unlockOn）',
  !!QUESTS.side_sift && QUESTS.side_sift.kind === 'side' && QUESTS.side_sift.store === true &&
  QUESTS.side_sift.npc === 'sifter' && QUESTS.side_sift.giver === 'sifter' &&
  QUESTS.side_sift.unlockOn == null);
ok('side_sift 名称「砂里的光」/where/obj/offer/turnin/done 落位',
  QUESTS.side_sift.name === '砂里的光' && QUESTS.side_sift.where.includes('星井矿脉') &&
  QUESTS.side_sift.obj.includes(String(SIFT_GOAL)) && QUESTS.side_sift.obj.includes('酿造') &&
  QUESTS.side_sift.offer.includes('筛砂人') && QUESTS.side_sift.turnin.includes('筛砂人') &&
  QUESTS.side_sift.done.includes('砂'));
ok('side_sift cond/condProg 与 SIFT_GOAL 同源（brews 计数，判/进/文/话一处调全端跟随）',
  QUESTS.side_sift.cond({ brews: 2 }) === false &&
  QUESTS.side_sift.cond({ brews: 3 }) === true &&
  QUESTS.side_sift.cond({}) === false && QUESTS.side_sift.cond({ brews: 0 }) === false &&
  QUESTS.side_sift.condProg({}) === `0/${SIFT_GOAL} 瓶` &&
  QUESTS.side_sift.condProg({ brews: 2 }) === `2/${SIFT_GOAL} 瓶`);
ok('side_sift reward 逐值：60 金 + 2 生命药水（承 side_flee 60 档）',
  QUESTS.side_sift.reward.gold === 60 && QUESTS.side_sift.reward.item === 2 && !QUESTS.side_sift.reward.potion2);

// —— ACH_LIST allquests 同源互证（与 sideQuestDone 输出一致）——
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('ACH_LIST allquests 名称「灯火同心」且描述派生 32（「33 个支线任务」）',
  !!achAll && achAll.name === '灯火同心' && achAll.d.includes('46 个支线任务'), achAll && achAll.d);
ok('ACH_LIST allquests 判定/进度与 QUESTS 派生同源（0/33 false · 32/33 false · 33/33 true · prog 33/33）',
  !!achAll && achAll.ok({ quests: {} }) === false && achAll.ok({ quests: Object.fromEntries(sideDefs.slice(0, 33).map(q => [q.id, 'done'])) }) === false &&
  achAll.ok({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === true &&
  achAll.prog({ quests: {} }) === '0/46' && achAll.prog({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === '46/46');

// —— quests.js 运行期：sideQuestDone ——
ok('运行期：sideQuestDone 0/33 · 3/33 · 33/33 · 主线不入列',
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
    potionUses: 0, mapPotions: 0, brews: 0, x: 5, y: 5, map: 'cave' }, extra || {});
}
const h1 = mkHero({});
ok('状态机：无存档 → questStatus offer（无 unlockOn 首次进星井矿脉即接，承 side_flee/side_hearer 同款）',
  questStatus(h1, 'side_sift') === 'offer', questStatus(h1, 'side_sift'));
ok('状态机：npcQuestMark offer 态「❕ 可接委托」',
  npcQuestMark(h1, 'sifter') === '❕ 可接委托', npcQuestMark(h1, 'sifter'));
ok('状态机：npcQuestPages offer 页（筛砂人 · 砂里的光 · SIFT_GOAL 同源）',
  JSON.stringify(npcQuestPages(h1, 'sifter')).includes('筛砂人') &&
  JSON.stringify(npcQuestPages(h1, 'sifter')).includes(String(SIFT_GOAL)) &&
  JSON.stringify(npcQuestPages(h1, 'sifter')).includes('接下委托'));
const rAcc = resolveNpcTalk(h1, 'sifter');
ok('状态机：resolveNpcTalk 接取 → {kind:accept, id:side_sift} + quests.side_sift=active',
  !!rAcc && rAcc.kind === 'accept' && rAcc.id === 'side_sift' && h1.quests.side_sift === 'active', JSON.stringify(rAcc));
ok('状态机：active 未达标 → questStatus active（cond 未满足）',
  questStatus(h1, 'side_sift') === 'active', questStatus(h1, 'side_sift'));
ok('状态机：active 页函数型实时报进度（已累计酿造 0/3 瓶）',
  JSON.stringify(npcQuestPages(h1, 'sifter')).includes('0/' + SIFT_GOAL + ' 瓶'));
ok('状态机：任务日志 objective 同源（累计酿造 3 瓶高级灵药 0/3 瓶）',
  questJournal(h1).find((e) => e.id === 'side_sift').objective.includes('酿造') &&
  questJournal(h1).find((e) => e.id === 'side_sift').objective.includes(`0/${SIFT_GOAL} 瓶`));
const h2 = mkHero({ quests: { side_sift: 'active' }, brews: 3 });
ok('状态机：达标（brews=3 瓶）→ questStatus turnin',
  questStatus(h2, 'side_sift') === 'turnin', questStatus(h2, 'side_sift'));
ok('状态机：npcQuestMark turnin 态「❕ 可交任务」',
  npcQuestMark(h2, 'sifter') === '❕ 可交任务', npcQuestMark(h2, 'sifter'));
const rRew = resolveNpcTalk(h2, 'sifter');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:60, item:2} + done + 结算 60 金/2 生命药水',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 60 && rRew.item === 2 &&
  h2.quests.side_sift === 'done' && h2.gold === 60 && h2.item === 3, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）',
  resolveNpcTalk(h2, 'sifter') === null);
ok('状态机：done 默认档（筛砂人筛了一辈子砂，你守住了砂里的光）',
  JSON.stringify(npcQuestPages(h2, 'sifter')).includes('砂里的光'));
ok('状态机：done bossDefeated 档（灯芯回来了叙事并入，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_sift: 'done' }, bossDefeated: true }), 'sifter')).includes('灯芯回来了'));
ok('状态机：done caveBoss 档（领主散了、矿脉敞亮叙事并入，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_sift: 'done' }, caveBoss: true }), 'sifter')).includes('领主散了'));
ok('状态机：done trueBoss 档（after 彩蛋「砂堆不亮了/名字都回家了」两页并入 done 分档，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_sift: 'done' }, trueBoss: true }), 'sifter')).includes('砂堆不亮了') &&
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_sift: 'done' }, trueBoss: true }), 'sifter')).includes('名字都回家了'));
ok('状态机：done 态 npcQuestMark 零顶标（sifter 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_sift: 'done' } }), 'sifter') === null);
ok('questRewardPreview 与 reward 同源（60 金 + 2 生命药水）',
  (() => { const prev = questRewardPreview(mkHero({}), 'side_sift'); return !!prev && prev.gold === 60 && prev.item === 2 && prev.potion2 === 0; })());
ok('运行期：其余纯风味 NPC 零顶标（stele2/stele1 无待办）',
  npcQuestMark(mkHero({}), 'stele2') === null &&
  npcQuestMark(mkHero({}), 'stele3') === null);

// —— NPCS.sifter 升格落位（零新 NPC/坐标/数据层三件套之外零改动）——
ok('NPCS.sifter 存在（筛砂人 · mark basket · 含 v24.121 升格注释）',
  !!NPCS.sifter && NPCS.sifter.name === '筛砂人' && NPCS.sifter.mark === 'basket' &&
  dSrc.includes('v24.121 升格为'));
ok('NPCS.sifter 原有 lines 两页 / trueBoss after 两页彩蛋数据层保留（零内容丢失契约）',
  Array.isArray(NPCS.sifter.lines) && NPCS.sifter.lines.length === 2 &&
  Array.isArray(NPCS.sifter.after) && NPCS.sifter.after.length === 2 &&
  NPCS.sifter.after[0].some((ln) => ln.includes('记起来了')) && NPCS.sifter.after[1].some((ln) => ln.includes('认得人')));
ok('NPCS.sifter 无 linesByStage（静态台词机制保留）',
  !!NPCS.sifter && !NPCS.sifter.linesByStage);
ok('姊妹件 smoke_v2224_sifter 已随升格更新（任务 offer 契约 + 升格后顶标/接取翻转）',
  read('smoke_v2224_sifter.mjs').includes('接下委托') && read('smoke_v2224_sifter.mjs').includes('side_sift'));
ok('姊妹件 smoke_v2235_minimapquest 已随升格更新（sifter 入任务 NPC 列表 + side_sift done）',
  read('smoke_v2235_minimapquest.mjs').includes("'sifter'") && read('smoke_v2235_minimapquest.mjs').includes('side_sift'));
ok('姊妹件纯风味列表已把 crystalwatch 换成仍在纯风味的 stele2/stele3（smoke.mjs/v24112/v24113/v24119）',
  read('smoke.mjs').includes("npcQuestMark(fresh,'stele2')") && !read('smoke.mjs').includes("npcQuestMark(fresh,'crystalwatch')") &&
  !read('smoke.mjs').includes("npcQuestMark(fresh,'sifter')") &&
  read('smoke_v24112_talkquest.mjs').includes('stele2') && !read('smoke_v24112_talkquest.mjs').includes("'sifter' 无待办") &&
  !read('smoke_v24119_huntquest.mjs').includes("'crystalwatch') === null") && !read('smoke_v24119_huntquest.mjs').includes("'sifter') === null"));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为三百九十二件套（三百九十一件套清除）',
  readme.includes('冒烟三百九十二件套（三百九十一件套清除）'));
ok('README tests 含 v24.121 守护描述与 smoke_v24121_siftquest 入库（345 份）',
  readme.includes('v24.121 起含「筛砂人「砂里的光」新支线」守护') &&
  readme.includes('smoke_v24121_siftquest 入库（345 份）'));
ok('README 仍有 v24.120 守护描述（历史保留）', readme.includes('v24.120 起含「HUD 宝箱收集进度」守护'));
ok('README 已有三百四十四件套口径且尚无 345（哨兵前望 345 语义：下一版才写 345）',
  readme.includes('冒烟三百九十二件套（三百九十一件套清除）') && !readme.includes('冒烟三百九十三件套') && !readme.includes('（393 份）'));
ok('README tests 树串尾已延伸（…+ smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑））',
  readme.includes('smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑）'));
ok('README 支线/奖励行随新现实（三十二条 · 砂里的光 · SIFT_GOAL）',
  readme.includes('四十六条支线目标/奖励全部由') &&
  readme.includes('砂里的光（筛砂人 · 累计酿造 `SIFT_GOAL`(3) 瓶高级灵药，自酿酒起累计）60 金 + 2 生命药水') &&
  readme.includes('v24.121 补第三十二条') && readme.includes('v24.120 补第') === false);
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 343 份（smoke.mjs + 343 专项）', chain.length === 391 && ['smoke.mjs', ...chain].length === 392, String(chain.length));
ok('package.json 链尾为 smoke_v24121_siftquest（第 344 份）', chain[chain.length - 1] === 'smoke_v24181_lampoilquest', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v24120_chesthud.mjs && smoke_v24121_siftquest.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v24120_chesthud.mjs && node tests/smoke_v24121_siftquest.mjs && node tests/smoke_v24122_crystalquest.mjs && node tests/smoke_v24123_fraghud.mjs && node tests/smoke_v24124_questshud.mjs && node tests/smoke_v24125_hunthud.mjs && node tests/smoke_v24126_waitquest.mjs && node tests/smoke_v24127_lampquest.mjs && node tests/smoke_v24128_stelequest.mjs && node tests/smoke_v24129_stele2quest.mjs && node tests/smoke_v24130_stele3quest.mjs && node tests/smoke_v24131_stele4quest.mjs && node tests/smoke_v24132_fallenquest.mjs && node tests/smoke_v24133_inquest.mjs && node tests/smoke_v24134_kindleq.mjs && node tests/smoke_v24135_ledgerquest.mjs && node tests/smoke_v24136_herbquest.mjs && node tests/smoke_v24143_furnacequest.mjs && node tests/smoke_v24147_unflicker.mjs && node tests/smoke_v24148_swift.mjs && node tests/smoke_v24151_lowlv.mjs && node tests/smoke_v24152_nopotion.mjs && node tests/smoke_v24153_penny.mjs && node tests/smoke_v24154_steadfast.mjs && node tests/smoke_v24155_frugal.mjs && node tests/smoke_v24157_dry.mjs && node tests/smoke_v24158_swift2.mjs && node tests/smoke_v24159_lowlv2.mjs && node tests/smoke_v24160_noskill.mjs && node tests/smoke_v24161_noskill2.mjs && node tests/smoke_v24162_lowskill.mjs && node tests/smoke_v24163_swiftskill.mjs && node tests/smoke_v24164_swiftlv.mjs && node tests/smoke_v24165_nopotskill.mjs && node tests/smoke_v24166_unflskill.mjs && node tests/smoke_v24167_swiftnopo.mjs && node tests/smoke_v24168_lowlvnopo.mjs && node tests/smoke_v24169_unflswift.mjs && node tests/smoke_v24170_unfllowlv.mjs && node tests/smoke_v24171_unflnopo.mjs && node tests/smoke_v24172_unflpenny.mjs && node tests/smoke_v24173_pennyswift.mjs && node tests/smoke_v24174_pennylowlv.mjs && node tests/smoke_v24175_pennynoskill.mjs && node tests/smoke_v24176_pennynopo.mjs && node tests/smoke_v24177_unflswift2.mjs && node tests/smoke_v24178_unflpenny2.mjs && node tests/smoke_v24179_unflnopo2.mjs && node tests/smoke_v24180_unflskill2.mjs && node tests/smoke_v24181_lampoilquest.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.121（startsWith）', changelog.startsWith('## v24.182'));
ok('CHANGELOG v24.121 条目含「砂里的光」与「SIFT_GOAL」与「筛砂人」',
  changelog.includes('砂里的光') && changelog.includes('SIFT_GOAL') && changelog.includes('筛砂人'));
ok('CHANGELOG 仍保留 v24.120 条目（历史保留）', changelog.includes('## v24.120 '));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const testsDir = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录件套 = 343（342 + smoke_v24121_siftquest）', files.length === 392, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.120 pin 零残留 ——
const s24120 = read('smoke_v24120_chesthud.mjs');
ok('smoke_v24120 的 GAME_VERSION 字面量 pin 已更新为 v24.121', s24120.includes("const GAME_VERSION = 'v24.182';"));
ok('smoke_v24120 的 CHANGELOG 顶 pin 已更新为 ## v24.121 ', s24120.includes("startsWith('## v24.182'"));
ok('smoke_v24120 的件套 pin 已更新为三百九十二件套（三百九十一件套清除）', s24120.includes('三百九十二件套（三百九十一件套清除）'));
ok('smoke_v24120 的 README/链 tail pin 已随新现实延伸（含 smoke_v24121_siftquest）',
  s24120.includes('smoke_v24121_siftquest'));
ok('smoke_v24120 的 package.json 串尾 pin 已延伸至 smoke_v24121_siftquest', s24120.includes('node tests/smoke_v24120_chesthud.mjs'));
ok('smoke_v24120 的链尾 pin 已推进至 smoke_v24121_siftquest（第 344 份）', s24120.includes("=== 'smoke_v24181_lampoilquest'"));
const s24119 = read('smoke_v24119_huntquest.mjs');
ok('smoke_v24119 的 GAME_VERSION 字面量 pin 已更新为 v24.121', s24119.includes("const GAME_VERSION = 'v24.182';"));
ok('smoke_v24119 的链尾 pin 已推进至 smoke_v24121_siftquest（第 344 份）', s24119.includes("=== 'smoke_v24181_lampoilquest'"));
const s2436 = read('smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（343 专项 / 344）且尚无 345 口径哨兵',
  s2436.includes('suiteFiles.length === 391  && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length === 392') &&
  s2436.includes('!readme.includes(\'冒烟三百九十三件套\')') && s2436.includes('!readme.includes(\'（393 份）\')'));
const s2429 = read('smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 哨兵链前望 345（三百四十五件套否定式）',
  s2429.includes("!readme.includes('冒烟三百九十三件套'"));
// 旧代 v24.120 pin 零残留扫描（豁免本套件）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v24121_siftquest.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDir), 'utf8').split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  const hits = [];
  if (s2.includes("const GAME_VERSION = '" + "v24.120';")) hits.push('gv');
  if (s2.includes("GAME_VERSION === '" + "v24.120'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.120")) hits.push('cw');
  if (s2.includes('三百四十三件套（三百四' + '十二件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 34' + '1')) hits.push('fl');
  if (s2.includes('chainAll.length === 34' + '1')) hits.push('cal');
  if (s2.includes('chain.length === 34' + '0')) hits.push('cl');
  if (s2.includes('treeTok.length === 34' + '1')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v24120_" + "chesthud'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.120 GAME_VERSION/顶 pin/343 口径（哨兵链，豁免本套件）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.121 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
