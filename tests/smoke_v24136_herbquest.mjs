// smoke_v24136_herbquest.mjs —— v24.136 专项冒烟：第四十四条支线「药囊常满」（采药翁·持有药水
// MEDKIT_GOAL(15) 瓶）
// （新内容·新支线——承 v24.135 账房先生「灯油的账」同一「全新 NPC + 持有类计数支线」先例系列的
// 第二例：雾语林南坡 (13,12) 新增「采药翁」（NPC_SPOTS '13,12' · dungeon.extras (13,12)，坐标为可行走
// '0'/'.' 格且未被他图占用，四邻皆可行走可面对面对话）——守着林间药篓的老采药人：雾里的草晾干了就是
// 药，镇子杂货铺的红瓶大半出自他背出林子的草药，「药和灯一样要紧」；玩家随身备下的每一瓶药水，都算
// 替他把药囊续上一笔——替他持有 MEDKIT_GOAL(15) 瓶（计数口径 hero.item 复用既有字段——newGame 起始
// START_POTIONS(3)、shop.buyPotion/开箱/掉落/任务奖励写定、喝药扣减，随 snapshotHero 自动持久化、
// 防御式 (g.item||0) 旧档零迁移，与 ACH_LIST stock「有备无患」同读一份源、支线门槛 15 低于成就门槛
// POTIONS_GOAL(20) 顺路先完成支线再解锁成就——持有类 cond 状态判定、交付后 done 粘性不受消耗回落
// 影响），80 金 + 1 高级灵药；无 unlockOn 开局即 offer、active 页函数型实时报进度、done 页
// trueBoss/caveBoss/bossDefeated 三档分档，零新计数零新状态零新存档）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.136 注释 / GAME_VERSION v24.136 与旧 v24.135 字面量零
// 残留 / v24.135 账房先生及更早历史注释保留 / MEDKIT_GOAL 常量与 export）、QUESTS 契约（44 side +
// 4 main、side_herb 字段逐值、与 POTIONS_GOAL 同源、ACH_LIST allquests 同源互证、MEDKIT_GOAL 低于
// stock 成就门槛互证）、quests.js 运行期状态机（offer→active→turnin→done 全链路 + resolveNpcTalk
// 接取/交付结算 80 金+1 高级灵药 + npcQuestMark/npcQuestPages 四态 + sideQuestDone 0/44 +
// done 三档 trueBoss/caveBoss/bossDefeated 消耗回落后 done 粘性）、NPCS.herbalist 落位（采药翁
// mark basket + dungeon.extras/NPC_SPOTS '13,12' 全局坐标 + 姊妹件 minimap 随新现实更新）、
// README/package.json/CHANGELOG 同步（件套口径 359 + v24.136 守护描述 + 入库 359 + package 串尾 +
// CHANGELOG 顶 pin）、tests 目录与实跑链恒等（359）、哨兵链（前望 360 且 README 尚无 360 口径）、
// 旧代 v24.135 pin 全库零残留扫描（字面量/顶 pin/358 口径 · 豁免本套件与上一版 v24135_ledgerquest 与
// 上上版 v24134_kindleq）。
import { GAME_VERSION, QUESTS, MEDKIT_GOAL, POTIONS_GOAL, ACH_LIST, NPCS, NPC_SPOTS, MAPS } from '../js/data.js';
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

console.log('— v24.136 采药翁「药囊常满」新支线 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkgRaw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（格式合法 + 已越过 v24.135 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.135', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 135)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.136（旧 v24.135 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.160';") && !dSrc.includes("const GAME_VERSION = 'v24.136';"));
ok('data.js 含 v24.136 注释（药囊常满新支线说明）',
  dSrc.includes('v24.136 新内容·新支线（第四十四条）'));
ok('data.js 仍保留 v24.135 账房先生历史注释（灯油的账支线说明，零内容丢失）',
  dSrc.includes('v24.135 新内容·新支线（第四十三条）'));

// —— 源级落位：MEDKIT_GOAL 常量 + export + NPC/坐标 ——
ok('data.js MEDKIT_GOAL 常量 = 15（与 LEDGER_GOAL 比邻声明，同一持有类家族）',
  dSrc.includes('const MEDKIT_GOAL = 15;') && dSrc.indexOf('const MEDKIT_GOAL') > dSrc.indexOf('const LEDGER_GOAL'));
ok('data.js export 块含 MEDKIT_GOAL（LEDGER_GOAL 之后紧邻）',
  dSrc.includes('INN_GOAL, LEDGER_GOAL, MEDKIT_GOAL,'));
ok('MEDKIT_GOAL 与 stock 成就门槛同族互证（15 < POTIONS_GOAL 20——顺路先完成支线再解锁成就）',
  (() => { const aCh = ACH_LIST.find((a) => a.id === 'stock');
    return !!aCh && MEDKIT_GOAL === 15 && POTIONS_GOAL === 20 &&
      aCh.ok({ item: 14 }) === false && aCh.ok({ item: 15 }) === false &&
      aCh.ok({ item: 20 }) === true && aCh.prog({ item: 4 }) === '4/20' &&
      MEDKIT_GOAL < POTIONS_GOAL; })());
ok('data.js NPCS.herbalist 存在（采药翁 · mark basket 复用既有货篮标 · 零视觉新代码）',
  !!NPCS.herbalist && NPCS.herbalist.name === '采药翁' && NPCS.herbalist.mark === 'basket');
ok('data.js NPC_SPOTS 含采药翁据点 (13,12)，全局坐标键未被他图占用',
  NPC_SPOTS['13,12'] === 'herbalist');
ok('data.js dungeon.extras 含 (13,12) NPC 项（全局唯一点位，不与既有键冲突）',
  dSrc.includes("{ x: 13, y: 12, ty: 'NPC' }") &&
  MAPS.dungeon.extras.some((e) => e.x === 13 && e.y === 12 && e.ty === 'NPC'));

// —— QUESTS 契约：44 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 48 条（44 side + 4 main，派生计数）',
  sideDefs.length === 45 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 49,
  `${sideDefs.length}/${mainDefs.length}`);
ok('side_herb 存在且为第四十四条（kind side · store · npc/giver herbalist · 无 unlockOn）',
  !!QUESTS.side_herb && QUESTS.side_herb.kind === 'side' && QUESTS.side_herb.store === true &&
  QUESTS.side_herb.npc === 'herbalist' && QUESTS.side_herb.giver === 'herbalist' &&
  QUESTS.side_herb.unlockOn == null);
ok('side_herb 名称「药囊常满」/where/obj/offer/turnin/done 落位',
  QUESTS.side_herb.name === '药囊常满' && QUESTS.side_herb.where.includes('雾语林') &&
  QUESTS.side_herb.obj.includes(String(MEDKIT_GOAL)) && QUESTS.side_herb.obj.includes('瓶') &&
  QUESTS.side_herb.offer.includes('采药翁') && QUESTS.side_herb.turnin.includes('采药翁') &&
  QUESTS.side_herb.done.includes('药'));
ok('side_herb cond/condProg 与 MEDKIT_GOAL 同源（hero.item 持有判定，缺字段防御式 0，判/进/文/话一处调全端跟随）',
  QUESTS.side_herb.cond({}) === false &&
  QUESTS.side_herb.cond({ item: 0 }) === false &&
  QUESTS.side_herb.cond({ item: 14 }) === false &&
  QUESTS.side_herb.cond({ item: 15 }) === true &&
  QUESTS.side_herb.cond({ item: 20 }) === true &&
  QUESTS.side_herb.condProg({}) === `0/${MEDKIT_GOAL} 瓶` &&
  QUESTS.side_herb.condProg({ item: 7.9 }) === `7/${MEDKIT_GOAL} 瓶`);
ok('side_herb reward 逐值：80 金 + 1 高级灵药（承 side_kindle/side_bell/side_watch/side_ledger 80 档）',
  QUESTS.side_herb.reward.gold === 80 && !QUESTS.side_herb.reward.item && QUESTS.side_herb.reward.potion2 === 1);

// —— ACH_LIST allquests 同源互证（与 sideQuestDone 输出一致）——
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('ACH_LIST allquests 名称「灯火同心」且描述派生 44（「45 个支线任务」）',
  !!achAll && achAll.name === '灯火同心' && achAll.d.includes('45 个支线任务'), achAll && achAll.d);
ok('ACH_LIST allquests 判定/进度与 QUESTS 派生同源（0/44 false · 43/44 false · 44/44 true · prog 44/44）',
  !!achAll && achAll.ok({ quests: {} }) === false && achAll.ok({ quests: Object.fromEntries(sideDefs.slice(0, 43).map(q => [q.id, 'done'])) }) === false &&
  achAll.ok({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === true &&
  achAll.prog({ quests: {} }) === '0/45' && achAll.prog({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === '45/45');

// —— quests.js 运行期：sideQuestDone ——
ok('运行期：sideQuestDone 0/44 · 3/44 · 44/44 · 主线不入列',
  sideQuestDone({ quests: {} }).done === 0 && sideQuestDone({ quests: {} }).total === 45 &&
  sideQuestDone({ quests: { side_mushroom: 'done', side_cart: 'done', side_pond: 'done' } }).done === 3 &&
  sideQuestDone({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }).done === 45 &&
  sideQuestDone({ quests: { main_demon: 'done' } }).done === 0);

// —— 运行期状态机：offer → active → turnin → done（quests 纯函数，零 DOM）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 3, hp: 60, hpMax: 60, mp: 20, mpMax: 20, atkMax: 13, defMax: 9,
    gold: 0, xp: 0, xpNext: 100, item: 3, potion2: 0, weapon: '铁剑', armor: '皮甲',
    skills: [], ach: [], seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, talked: [], steps: 0,
    totalWins: 0, drops: 0, deflects: 0, casts: 0, travels: 0, sold: 0, spent: 0, crits: 0, charges: 0, flees: 0,
    potionUses: 0, mapPotions: 0, brews: 0, deaths: 0, x: 13, y: 11, map: 'dungeon' }, extra || {});
}
const h1 = mkHero({});
ok('状态机：无存档 → questStatus offer（无 unlockOn 首次到访雾语林南坡即接，承 side_wait/side_ledger 同款）',
  questStatus(h1, 'side_herb') === 'offer', questStatus(h1, 'side_herb'));
ok('状态机：npcQuestMark offer 态「❕ 可接委托」',
  npcQuestMark(h1, 'herbalist') === '❕ 可接委托', npcQuestMark(h1, 'herbalist'));
ok('状态机：npcQuestPages offer 页（采药翁 · 药囊常满 · MEDKIT_GOAL 同源）',
  JSON.stringify(npcQuestPages(h1, 'herbalist')).includes('采药翁') &&
  JSON.stringify(npcQuestPages(h1, 'herbalist')).includes(String(MEDKIT_GOAL)) &&
  JSON.stringify(npcQuestPages(h1, 'herbalist')).includes('接下委托'));
const rAcc = resolveNpcTalk(h1, 'herbalist');
ok('状态机：resolveNpcTalk 接取 → {kind:accept, id:side_herb} + quests.side_herb=active',
  !!rAcc && rAcc.kind === 'accept' && rAcc.id === 'side_herb' && h1.quests.side_herb === 'active', JSON.stringify(rAcc));
ok('状态机：active 未达标 → questStatus active（cond 未满足）',
  questStatus(h1, 'side_herb') === 'active', questStatus(h1, 'side_herb'));
ok('状态机：active 页函数型实时报进度（已持有 3/15 瓶——开局 START_POTIONS 3 瓶）',
  JSON.stringify(npcQuestPages(h1, 'herbalist')).includes('3/' + MEDKIT_GOAL + ' 瓶'));
ok('状态机：任务日志 objective 同源（随身备好 15 瓶药水 3/15 瓶）',
  questJournal(h1).find((e) => e.id === 'side_herb').objective.includes('瓶') &&
  questJournal(h1).find((e) => e.id === 'side_herb').objective.includes(`3/${MEDKIT_GOAL} 瓶`));
const h2 = mkHero({ quests: { side_herb: 'active' }, item: 15 });
ok('状态机：达标（item=15 瓶）→ questStatus turnin',
  questStatus(h2, 'side_herb') === 'turnin', questStatus(h2, 'side_herb'));
ok('状态机：npcQuestMark turnin 态「❕ 可交任务」',
  npcQuestMark(h2, 'herbalist') === '❕ 可交任务', npcQuestMark(h2, 'herbalist'));
const rRew = resolveNpcTalk(h2, 'herbalist');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:80, potion2:1} + done + 结算 80 金/1 高级灵药（持有 15 保住 + 80）',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 80 && rRew.potion2 === 1 &&
  h2.quests.side_herb === 'done' && h2.gold === 80 && h2.potion2 === 1 && h2.item === 15, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）',
  resolveNpcTalk(h2, 'herbalist') === null);
ok('状态机：done 粘性——交付后消耗回落到 15 以下 questStatus 仍 done（持有类坍缩不回退）',
  questStatus(mkHero({ quests: { side_herb: 'done' }, item: 3 }), 'side_herb') === 'done');
ok('状态机：done 默认档（采药翁：这囊药替你留着——给灯下的人续命）',
  JSON.stringify(npcQuestPages(h2, 'herbalist')).includes('这囊药替你留着'));
ok('状态机：done bossDefeated 档（灯芯回来了叙事并入，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_herb: 'done' }, bossDefeated: true }), 'herbalist')).includes('灯芯回来了'));
ok('状态机：done caveBoss 档（领主散了、采药的路好走叙事并入，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_herb: 'done' }, caveBoss: true }), 'herbalist')).includes('领主散了'));
ok('状态机：done trueBoss 档（after 彩蛋「灯都亮回来了」并入 done 分档，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_herb: 'done' }, trueBoss: true }), 'herbalist')).includes('灯都亮回来了'));
ok('状态机：done 态 npcQuestMark 零顶标（herbalist 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_herb: 'done' } }), 'herbalist') === null);
ok('questRewardPreview 与 reward 同源（80 金 + 1 高级灵药）',
  (() => { const prev = questRewardPreview(mkHero({}), 'side_herb'); return !!prev && prev.gold === 80 && prev.item === 0 && prev.potion2 === 1; })());
ok('运行期：其余 unlockOn 里程碑 NPC 锁定态零顶标（stele2/stele3/stele4 无待办）',
  npcQuestMark(mkHero({}), 'stele2') === null && npcQuestMark(mkHero({}), 'stele3') === null &&
  npcQuestMark(mkHero({}), 'stele4') === null);

// —— NPCS.herbalist 落位（全新 NPC：数据层三件套 + dungeon.extras + NPC_SPOTS）——
ok('NPCS.herbalist 台词数据齐全（linesByStage 三档 + after 两页彩蛋）',
  !!NPCS.herbalist && Array.isArray(NPCS.herbalist.linesByStage) && NPCS.herbalist.linesByStage.length === 3 &&
  NPCS.herbalist.linesByStage[0].gate === null && Array.isArray(NPCS.herbalist.after) && NPCS.herbalist.after.length === 2);
ok('NPCS.herbalist after 彩蛋（都亮回来了/往后你的药囊我替你记着）数据层保留（零内容丢失契约）',
  !!NPCS.herbalist && NPCS.herbalist.after[0].some((ln) => ln.includes('都亮回来了')) &&
  NPCS.herbalist.after[1].some((ln) => ln.includes('替你记着')));
ok('姊妹件 smoke_v2235_minimapquest 已随新现实更新（herbalist 入任务 NPC 列表 + side_herb done + dungeon (13,12) 金光）',
  read('smoke_v2235_minimapquest.mjs').includes("npcQuestMark(S.G, 'herbalist')") &&
  read('smoke_v2235_minimapquest.mjs').includes('side_herb') &&
  read('smoke_v2235_minimapquest.mjs').includes('goldAt(capD, 13, 12)'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为三百七十一件套（三百七十件套清除）',
  readme.includes('冒烟三百七十一件套（三百七十件套清除）'));
ok('README tests 含 v24.136 守护描述与 smoke_v24136_herbquest 入库（359 份）',
  readme.includes('v24.136 起含「采药翁「药囊常满」新支线」守护') &&
  readme.includes('smoke_v24136_herbquest 入库（359 份）'));
ok('README 仍保留 v24.135 账房先生守护描述（历史保留）', readme.includes('v24.135 起含「账房先生「灯油的账」新支线」守护'));
ok('README 已有三百六十四件套口径且尚无 360（哨兵前望 360 语义：下一版才写 360）',
  readme.includes('冒烟三百七十一件套（三百七十件套清除）') && !readme.includes('冒烟三百七十二件套') && !readme.includes('（372 份）'));
ok('README tests 树串尾已延伸（…+ smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑））',
  readme.includes('smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑）'));
ok('README 支线/奖励行随新现实（四十四条 · 药囊常满 · MEDKIT_GOAL）',
  readme.includes('四十五条支线目标/奖励全部由') &&
  readme.includes('`STELE_GOAL` `FALLEN_GOAL` `INN_GOAL` `KINDLE_GOAL` `LEDGER_GOAL` `MEDKIT_GOAL` `FURNACE_GOAL` |') &&
  readme.includes('v24.136 补第四十四条 · v24.143 补第四十五条') && readme.includes('v24.135 补第四十三条'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 358 份（smoke.mjs + 358 专项）', chain.length === 370 && ['smoke.mjs', ...chain].length === 371, String(chain.length));
ok('package.json 链尾为 smoke_v24136_herbquest（第 363 份）', chain[chain.length - 1] === 'smoke_v24160_noskill', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v24135_ledgerquest.mjs && smoke_v24136_herbquest.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v24135_ledgerquest.mjs && node tests/smoke_v24136_herbquest.mjs && node tests/smoke_v24143_furnacequest.mjs && node tests/smoke_v24147_unflicker.mjs && node tests/smoke_v24148_swift.mjs && node tests/smoke_v24151_lowlv.mjs && node tests/smoke_v24152_nopotion.mjs && node tests/smoke_v24153_penny.mjs && node tests/smoke_v24154_steadfast.mjs && node tests/smoke_v24155_frugal.mjs && node tests/smoke_v24157_dry.mjs && node tests/smoke_v24158_swift2.mjs && node tests/smoke_v24159_lowlv2.mjs && node tests/smoke_v24160_noskill.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.136（startsWith）', changelog.startsWith('## v24.160'));
ok('CHANGELOG v24.136 条目含「药囊常满」与「MEDKIT_GOAL」与「采药翁」',
  changelog.includes('药囊常满') && changelog.includes('MEDKIT_GOAL') && changelog.includes('采药翁'));
ok('CHANGELOG 仍保留 v24.135 条目（历史保留）', changelog.includes('## v24.135 '));

const testsDir = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
ok('tests 目录件套 = 359（358 + smoke_v24136_herbquest）', files.length === 371, String(files.length));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.135 pin 零残留 ——
const s24135 = read('smoke_v24135_ledgerquest.mjs');
const s24134 = read('smoke_v24134_kindleq.mjs');
const s2415 = read('smoke_v2415_treepin.mjs');
ok('smoke_v24135 的 GAME_VERSION 字面量 pin 已更新为 v24.136', s24135.includes("const GAME_VERSION = 'v24.160';"));
ok('smoke_v24135 的 CHANGELOG 顶 pin 已更新为 ## v24.137 ', s24135.includes("startsWith('## v24.160'"));
ok('smoke_v24135 的件套 pin 已更新为三百七十一件套（三百七十件套清除）', s24135.includes('三百七十一件套（三百七十件套清除）'));
ok('smoke_v24135 的 README/链 tail pin 已随新现实延伸（含 smoke_v24136_herbquest）',
  s24135.includes('smoke_v24136_herbquest'));
ok('smoke_v24135 的链尾 pin 已推进至 smoke_v24136_herbquest（第 363 份）', s24135.includes("=== 'smoke_v24160_noskill'"));
ok('smoke_v24134 的 README/链 tail pin 已随新现实延伸（含 smoke_v24135_ledgerquest + smoke_v24136_herbquest）',
  s24134.includes('smoke_v24136_herbquest') && s24134.includes('smoke_v24135_ledgerquest'));
const s2436 = read('smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（358 专项 / 359）且尚无 360 口径哨兵',
  s2436.includes('suiteFiles.length ===  370  && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length ===  371') &&
  s2436.includes('!readme.includes(\'冒烟三百七十二件套\')') && s2436.includes('!readme.includes(\'（372 份）\')'));
const s2429 = read('smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 哨兵链前望 360（三百七十二件套否定式）',
  s2429.includes("!readme.includes('冒烟三百七十二件套'"));

// 旧代 v24.135 pin 零残留扫描（豁免本套件与上一版 ledgerquest、上上版 kindleq、上上上版 inquest——
// v24133 负向 `!dSrc.includes("const GAME_VERSION = 'v24.135';")` 是合法前望 pin，同 v24135 轮豁免 inquest 先例）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v24136_herbquest.mjs' || f === 'smoke_v24135_ledgerquest.mjs' || f === 'smoke_v24134_kindleq.mjs' || f === 'smoke_v24133_inquest.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDir), 'utf8').split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  const hits = [];
  if (s2.includes("const GAME_VERSION = '" + "v24.135';")) hits.push('gv');
  if (s2.includes("GAME_VERSION === '" + "v24.135'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.136")) hits.push('cw');
  if (s2.includes('三百五十八件套（三百五' + '十七件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 35' + '8')) hits.push('fl');
  if (s2.includes('chainAll.length === 35' + '8')) hits.push('cal');
  if (s2.includes('chain.length === 35' + '7')) hits.push('cl');
  if (s2.includes('treeTok.length === 35' + '8')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v24135_" + "ledgerquest'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.135 GAME_VERSION/顶 pin/358 口径（哨兵链，豁免本套件与上两版）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.136 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
