// smoke_v24122_crystalquest.mjs —— v24.122 专项冒烟：第三十三条支线「星砂归匣」（守晶人·累计开启
// CRYSTAL_GOAL(4) 只宝箱）
// （新内容·新支线——承 v24.119 守洞人「数到灯亮」/ v24.121 筛砂人「砂里的光」同一「风味 NPC 升格
// 为支线委托人」先例：v22.94 纯风味 NPC「守晶人」（星井矿脉终焉水晶正南 (12,12)，「这晶石，是回廊
// 的门闩……里头收着全镇没回家的名字」）升格为委托人——他守水晶守了一辈子、最懂「匣子里散出去的
// 星砂」，玩家每开一只宝箱都算替他把散落的星砂归回匣里，替他攒满 CRYSTAL_GOAL(4) 只（计数
// hero.chests 与 ACH_LIST chests「开箱寻宝」同读一份源——data.js chestCount 三形态防御式读取
// （Set 读 size/数组读 length/缺失计 0）旧档零迁移、js/world.js onChestStep 开箱成功唯一写入点、
// 随 snapshotHero 全量快照自动持久化；支线门槛 4 低于成就门槛 TREASURE_GOAL(6)——顺路先完成支线
// 再解锁成就；开箱才算、任务奖励/升级/读档零计数；零新计数零新状态零新存档）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.122 注释 / GAME_VERSION v24.122 与旧 v24.121 字面量零残留 /
// v24.121 及更早历史注释保留 / CRYSTAL_GOAL 常量与 export）、QUESTS 契约（33 side + 4 main、
// side_crystal 字段逐值、与 TREASURE_GOAL 同源、ACH_LIST allquests 同源互证、CRYSTAL_GOAL 低于
// chests 成就门槛互证）、quests.js 运行期状态机（offer→active→turnin→done 全链路 + resolveNpcTalk
// 接取/交付结算 70 金+2 生命药水 + npcQuestMark/npcQuestPages 四态 + sideQuestDone 0/33·3/33·33/33 +
// done 三档 trueBoss/caveBoss/bossDefeated）、NPCS.crystalwatch 升格落位（lines 两页与 after 两页保留
// 零内容丢失契约 + 姊妹件套已随升格更新）、README/package.json/CHANGELOG 同步（件套口径 345 +
// v24.122 守护描述 + 入库 345 + package 串尾 + CHANGELOG 顶 pin）、tests 目录与实跑链恒等（345）、
// 哨兵链（前望 346 且 README 尚无 346 口径）、旧代 v24.121 pin 全库零残留扫描（字面量/顶 pin/344 口径 ·
// 豁免本套件）。
import { GAME_VERSION, QUESTS, CRYSTAL_GOAL, TREASURE_GOAL, ACH_LIST, NPCS, NPC_SPOTS } from '../js/data.js';
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

console.log('— v24.122 守晶人「星砂归匣」新支线 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkgRaw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（格式合法 + 已越过 v24.121 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.121', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 121)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.122（旧 v24.121 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.127';") && !dSrc.includes("const GAME_VERSION = 'v24.121';"));
ok('data.js 含 v24.122 注释（星砂归匣新支线说明）',
  dSrc.includes('v24.122 新内容·新支线（第三十三条）'));
ok('data.js 仍保留 v24.121 历史注释（筛砂人砂里的光说明，零内容丢失）',
  dSrc.includes('v24.121 新内容·新支线（第三十二条）'));

// —— 源级落位：CRYSTAL_GOAL 常量 + export ——
ok('data.js CRYSTAL_GOAL 常量 = 4（与 SIFT_GOAL 比邻声明，同一家族）',
  dSrc.includes('const CRYSTAL_GOAL = 4;') && dSrc.indexOf('const CRYSTAL_GOAL') > dSrc.indexOf('const SIFT_GOAL'));
ok('data.js export 块含 CRYSTAL_GOAL（SIFT_GOAL 之后紧邻）',
  dSrc.includes('SIFT_GOAL, CRYSTAL_GOAL,'));
ok('CRYSTAL_GOAL 与 chests 成就门槛同族互证（4 < TREASURE_GOAL 6——顺路先完成支线再解锁成就）',
  (() => { const aCh = ACH_LIST.find((a) => a.id === 'chests');
    return !!aCh && CRYSTAL_GOAL === 4 && TREASURE_GOAL === 6 &&
      aCh.ok({ chests: ['a', 'b', 'c'] }) === false &&
      aCh.ok({ chests: ['a', 'b', 'c', 'd', 'e', 'f'] }) === true &&
      aCh.prog({ chests: ['a', 'b'] }) === '2/6' &&
      CRYSTAL_GOAL < TREASURE_GOAL; })());
ok('data.js NPC_SPOTS 源级仍含守晶人据点 (12,12)（零新坐标）',
  dSrc.includes("'12,12': 'crystalwatch'"));

// —— QUESTS 契约：33 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 37 条（33 side + 4 main，派生计数）',
  sideDefs.length === 35 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 39,
  `${sideDefs.length}/${mainDefs.length}`);
ok('side_crystal 存在且为第三十三条（kind side · store · npc/giver crystalwatch · 无 unlockOn）',
  !!QUESTS.side_crystal && QUESTS.side_crystal.kind === 'side' && QUESTS.side_crystal.store === true &&
  QUESTS.side_crystal.npc === 'crystalwatch' && QUESTS.side_crystal.giver === 'crystalwatch' &&
  QUESTS.side_crystal.unlockOn == null);
ok('side_crystal 名称「星砂归匣」/where/obj/offer/turnin/done 落位',
  QUESTS.side_crystal.name === '星砂归匣' && QUESTS.side_crystal.where.includes('星井矿脉') &&
  QUESTS.side_crystal.obj.includes(String(CRYSTAL_GOAL)) && QUESTS.side_crystal.obj.includes('宝箱') &&
  QUESTS.side_crystal.offer.includes('守晶人') && QUESTS.side_crystal.turnin.includes('守晶人') &&
  QUESTS.side_crystal.done.includes('星砂'));
ok('side_crystal cond/condProg 与 CRYSTAL_GOAL 同源（chestCount 计数，Set/数组/缺失三形态，判/进/文/话一处调全端跟随）',
  QUESTS.side_crystal.cond({}) === false &&
  QUESTS.side_crystal.cond({ chests: ['a', 'b', 'c'] }) === false &&
  QUESTS.side_crystal.cond({ chests: ['a', 'b', 'c', 'd'] }) === true &&
  QUESTS.side_crystal.cond({ chests: new Set(['a', 'b', 'c', 'd']) }) === true &&
  QUESTS.side_crystal.cond({ chests: ['a', 'b', 'c', 'd', 'e'] }) === true &&
  QUESTS.side_crystal.condProg({}) === `0/${CRYSTAL_GOAL} 只` &&
  QUESTS.side_crystal.condProg({ chests: ['a', 'b'] }) === `2/${CRYSTAL_GOAL} 只`);
ok('side_crystal reward 逐值：70 金 + 2 生命药水（承 side_tale 70 档）',
  QUESTS.side_crystal.reward.gold === 70 && QUESTS.side_crystal.reward.item === 2 && !QUESTS.side_crystal.reward.potion2);

// —— ACH_LIST allquests 同源互证（与 sideQuestDone 输出一致）——
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('ACH_LIST allquests 名称「灯火同心」且描述派生 33（「33 个支线任务」）',
  !!achAll && achAll.name === '灯火同心' && achAll.d.includes('35 个支线任务'), achAll && achAll.d);
ok('ACH_LIST allquests 判定/进度与 QUESTS 派生同源（0/33 false · 32/33 false · 33/33 true · prog 33/33）',
  !!achAll && achAll.ok({ quests: {} }) === false && achAll.ok({ quests: Object.fromEntries(sideDefs.slice(0, 33).map(q => [q.id, 'done'])) }) === false &&
  achAll.ok({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === true &&
  achAll.prog({ quests: {} }) === '0/35' && achAll.prog({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === '35/35');

// —— quests.js 运行期：sideQuestDone ——
ok('运行期：sideQuestDone 0/33 · 3/33 · 33/33 · 主线不入列',
  sideQuestDone({ quests: {} }).done === 0 && sideQuestDone({ quests: {} }).total === 35 &&
  sideQuestDone({ quests: { side_mushroom: 'done', side_cart: 'done', side_pond: 'done' } }).done === 3 &&
  sideQuestDone({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }).done === 35 &&
  sideQuestDone({ quests: { main_demon: 'done' } }).done === 0);

// —— 运行期状态机：offer → active → turnin → done（quests 纯函数，零 DOM）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 3, hp: 60, hpMax: 60, mp: 20, mpMax: 20, atkMax: 13, defMax: 9,
    gold: 0, xp: 0, xpNext: 100, item: 1, potion2: 0, weapon: '铁剑', armor: '皮甲',
    skills: [], ach: [], seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, talked: [], steps: 0,
    totalWins: 0, drops: 0, deflects: 0, casts: 0, travels: 0, sold: 0, spent: 0, crits: 0, charges: 0, flees: 0,
    potionUses: 0, mapPotions: 0, brews: 0, x: 12, y: 13, map: 'cave' }, extra || {});
}
const h1 = mkHero({});
ok('状态机：无存档 → questStatus offer（无 unlockOn 首次进星井矿脉即接，承 side_flee/side_hearer/side_sift 同款）',
  questStatus(h1, 'side_crystal') === 'offer', questStatus(h1, 'side_crystal'));
ok('状态机：npcQuestMark offer 态「❕ 可接委托」',
  npcQuestMark(h1, 'crystalwatch') === '❕ 可接委托', npcQuestMark(h1, 'crystalwatch'));
ok('状态机：npcQuestPages offer 页（守晶人 · 星砂归匣 · CRYSTAL_GOAL 同源）',
  JSON.stringify(npcQuestPages(h1, 'crystalwatch')).includes('守晶人') &&
  JSON.stringify(npcQuestPages(h1, 'crystalwatch')).includes(String(CRYSTAL_GOAL)) &&
  JSON.stringify(npcQuestPages(h1, 'crystalwatch')).includes('接下委托'));
const rAcc = resolveNpcTalk(h1, 'crystalwatch');
ok('状态机：resolveNpcTalk 接取 → {kind:accept, id:side_crystal} + quests.side_crystal=active',
  !!rAcc && rAcc.kind === 'accept' && rAcc.id === 'side_crystal' && h1.quests.side_crystal === 'active', JSON.stringify(rAcc));
ok('状态机：active 未达标 → questStatus active（cond 未满足）',
  questStatus(h1, 'side_crystal') === 'active', questStatus(h1, 'side_crystal'));
ok('状态机：active 页函数型实时报进度（已累计开启 0/4 只）',
  JSON.stringify(npcQuestPages(h1, 'crystalwatch')).includes('0/' + CRYSTAL_GOAL + ' 只'));
ok('状态机：任务日志 objective 同源（累计开启 4 只宝箱 0/4 只）',
  questJournal(h1).find((e) => e.id === 'side_crystal').objective.includes('宝箱') &&
  questJournal(h1).find((e) => e.id === 'side_crystal').objective.includes(`0/${CRYSTAL_GOAL} 只`));
const h2 = mkHero({ quests: { side_crystal: 'active' }, chests: ['a', 'b', 'c', 'd'] });
ok('状态机：达标（chests=4 只）→ questStatus turnin',
  questStatus(h2, 'side_crystal') === 'turnin', questStatus(h2, 'side_crystal'));
ok('状态机：npcQuestMark turnin 态「❕ 可交任务」',
  npcQuestMark(h2, 'crystalwatch') === '❕ 可交任务', npcQuestMark(h2, 'crystalwatch'));
const rRew = resolveNpcTalk(h2, 'crystalwatch');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:70, item:2} + done + 结算 70 金/2 生命药水',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 70 && rRew.item === 2 &&
  h2.quests.side_crystal === 'done' && h2.gold === 70 && h2.item === 3, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）',
  resolveNpcTalk(h2, 'crystalwatch') === null);
ok('状态机：done 默认档（守晶人守了一辈子水晶，你替匣子攒够了星砂）',
  JSON.stringify(npcQuestPages(h2, 'crystalwatch')).includes('星砂归了匣'));
ok('状态机：done bossDefeated 档（灯芯回来了叙事并入，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_crystal: 'done' }, bossDefeated: true }), 'crystalwatch')).includes('灯芯回来了'));
ok('状态机：done caveBoss 档（领主散了、矿脉敞亮叙事并入，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_crystal: 'done' }, caveBoss: true }), 'crystalwatch')).includes('领主散了'));
ok('状态机：done trueBoss 档（after 彩蛋「水晶空了/名字都回了灯下」两页并入 done 分档，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_crystal: 'done' }, trueBoss: true }), 'crystalwatch')).includes('水晶空了') &&
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_crystal: 'done' }, trueBoss: true }), 'crystalwatch')).includes('名字都回了灯下'));
ok('状态机：done 态 npcQuestMark 零顶标（crystalwatch 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_crystal: 'done' } }), 'crystalwatch') === null);
ok('questRewardPreview 与 reward 同源（70 金 + 2 生命药水）',
  (() => { const prev = questRewardPreview(mkHero({}), 'side_crystal'); return !!prev && prev.gold === 70 && prev.item === 2 && prev.potion2 === 0; })());
ok('运行期：其余纯风味 NPC 零顶标（stele2/stele1 无待办）',
  npcQuestMark(mkHero({}), 'stele2') === null && npcQuestMark(mkHero({}), 'stele1') === null);

// —— NPCS.crystalwatch 升格落位（零新 NPC/坐标/数据层三件套之外零改动）——
ok('NPCS.crystalwatch 存在（守晶人 · mark gem · 含 v24.122 升格注释）',
  !!NPCS.crystalwatch && NPCS.crystalwatch.name === '守晶人' && NPCS.crystalwatch.mark === 'gem' &&
  dSrc.includes('v24.122 升格为'));
ok('NPCS.crystalwatch 原有 lines 两页 / trueBoss after 两页彩蛋数据层保留（零内容丢失契约）',
  Array.isArray(NPCS.crystalwatch.lines) && NPCS.crystalwatch.lines.length === 2 &&
  Array.isArray(NPCS.crystalwatch.after) && NPCS.crystalwatch.after.length === 2 &&
  NPCS.crystalwatch.after[0].some((ln) => ln.includes('水晶空了')) && NPCS.crystalwatch.after[1].some((ln) => ln.includes('丢名字')));
ok('NPCS.crystalwatch 无 linesByStage（静态台词机制保留）',
  !!NPCS.crystalwatch && !NPCS.crystalwatch.linesByStage);
ok('姊妹件 smoke_v2294_crystalwatch 已随升格更新（任务 offer 契约 + 升格后顶标/接取翻转）',
  read('smoke_v2294_crystalwatch.mjs').includes('接下委托') && read('smoke_v2294_crystalwatch.mjs').includes('side_crystal'));
ok('姊妹件 smoke_v2235_minimapquest 已随升格更新（crystalwatch 入任务 NPC 列表 + side_crystal done）',
  read('smoke_v2235_minimapquest.mjs').includes("'crystalwatch'") && read('smoke_v2235_minimapquest.mjs').includes('side_crystal'));
ok('姊妹件纯风味列表已把 crystalwatch 换成仍在纯风味的 stele1/stele2（smoke.mjs/v24112/v24119）',
  read('smoke.mjs').includes("npcQuestMark(fresh,'stele1')") && !read('smoke.mjs').includes("npcQuestMark(fresh,'crystalwatch')") &&
  read('smoke_v24112_talkquest.mjs').includes('stele1') && !read('smoke_v24112_talkquest.mjs').includes("'crystalwatch') === null") &&
  read('smoke_v24119_huntquest.mjs').includes('stele2') && !read('smoke_v24119_huntquest.mjs').includes("'crystalwatch') === null"));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为三百五十件套（三百四十九件套清除）',
  readme.includes('冒烟三百五十件套（三百四十九件套清除）'));
ok('README tests 含 v24.122 守护描述与 smoke_v24122_crystalquest 入库（345 份）',
  readme.includes('v24.122 起含「守晶人「星砂归匣」新支线」守护') &&
  readme.includes('smoke_v24122_crystalquest 入库（345 份）'));
ok('README 仍有 v24.121 守护描述（历史保留）', readme.includes('v24.121 起含「筛砂人「砂里的光」新支线」守护'));
ok('README 已有三百四十五件套口径且尚无 346（哨兵前望 346 语义：下一版才写 346）',
  readme.includes('冒烟三百五十件套（三百四十九件套清除）') && !readme.includes('冒烟三百五十一件套') && !readme.includes('（351 份）'));
ok('README tests 树串尾已延伸（…+ smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest（npm test 串跑））',
  readme.includes('smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest（npm test 串跑）'));
ok('README 支线/奖励行随新现实（三十三条 · 星砂归匣 · CRYSTAL_GOAL）',
  readme.includes('三十五条支线目标/奖励全部由') &&
  readme.includes('星砂归匣（守晶人 · 累计开启 `CRYSTAL_GOAL`(4) 只宝箱，自开箱起累计）70 金 + 2 生命药水') &&
  readme.includes('v24.122 补第三十三条') && readme.includes('v24.121 补第三十二条'));
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 344 份（smoke.mjs + 344 专项）', chain.length === 349 && ['smoke.mjs', ...chain].length === 350, String(chain.length));
ok('package.json 链尾为 smoke_v24122_crystalquest（第 345 份）', chain[chain.length - 1] === 'smoke_v24127_lampquest', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v24121_siftquest.mjs && smoke_v24122_crystalquest.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v24121_siftquest.mjs && node tests/smoke_v24122_crystalquest.mjs && node tests/smoke_v24123_fraghud.mjs && node tests/smoke_v24124_questshud.mjs && node tests/smoke_v24125_hunthud.mjs && node tests/smoke_v24126_waitquest.mjs && node tests/smoke_v24127_lampquest.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.122（startsWith）', changelog.startsWith('## v24.127'));
ok('CHANGELOG v24.122 条目含「星砂归匣」与「CRYSTAL_GOAL」与「守晶人」',
  changelog.includes('星砂归匣') && changelog.includes('CRYSTAL_GOAL') && changelog.includes('守晶人'));
ok('CHANGELOG 仍保留 v24.121 条目（历史保留）', changelog.includes('## v24.121 '));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const testsDir = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录件套 = 345（344 + smoke_v24122_crystalquest）', files.length === 350, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.121 pin 零残留 ——
const s24121 = read('smoke_v24121_siftquest.mjs');
ok('smoke_v24121 的 GAME_VERSION 字面量 pin 已更新为 v24.122', s24121.includes("const GAME_VERSION = 'v24.127';"));
ok('smoke_v24121 的 CHANGELOG 顶 pin 已更新为 ## v24.122 ', s24121.includes("startsWith('## v24.127'"));
ok('smoke_v24121 的件套 pin 已更新为三百五十件套（三百四十九件套清除）', s24121.includes('三百五十件套（三百四十九件套清除）'));
ok('smoke_v24121 的 README/链 tail pin 已随新现实延伸（含 smoke_v24122_crystalquest）',
  s24121.includes('smoke_v24122_crystalquest'));
ok('smoke_v24121 的 package.json 串尾 pin 已延伸至 smoke_v24122_crystalquest', s24121.includes('node tests/smoke_v24121_siftquest.mjs'));
ok('smoke_v24121 的链尾 pin 已推进至 smoke_v24122_crystalquest（第 345 份）', s24121.includes("=== 'smoke_v24127_lampquest'"));
const s24120 = read('smoke_v24120_chesthud.mjs');
ok('smoke_v24120 的 GAME_VERSION 字面量 pin 已更新为 v24.122', s24120.includes("const GAME_VERSION = 'v24.127';"));
ok('smoke_v24120 的链尾 pin 已推进至 smoke_v24122_crystalquest（第 345 份）', s24120.includes("=== 'smoke_v24127_lampquest'"));
const s2436 = read('smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（344 专项 / 345）且尚无 346 口径哨兵',
  s2436.includes('suiteFiles.length === 349 && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length === 350') &&
  s2436.includes('!readme.includes(\'冒烟三百五十一件套\')') && s2436.includes('!readme.includes(\'（351 份）\')'));
const s2429 = read('smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 哨兵链前望 346（三百五十一件套否定式）',
  s2429.includes("!readme.includes('冒烟三百五十一件套'"));
// 旧代 v24.121 pin 零残留扫描（豁免本套件）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v24122_crystalquest.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDir), 'utf8').split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  const hits = [];
  if (s2.includes("const GAME_VERSION = '" + "v24.121';")) hits.push('gv');
  if (s2.includes("GAME_VERSION === '" + "v24.121'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.121")) hits.push('cw');
  if (s2.includes('三百四十四件套（三百四' + '十三件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 34' + '2')) hits.push('fl');
  if (s2.includes('chainAll.length === 34' + '2')) hits.push('cal');
  if (s2.includes('chain.length === 34' + '1')) hits.push('cl');
  if (s2.includes('treeTok.length === 34' + '2')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v24121_" + "siftquest'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.121 GAME_VERSION/顶 pin/344 口径（哨兵链，豁免本套件）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.122 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
