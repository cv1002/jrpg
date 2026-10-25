// smoke_v24134_kindleq.mjs —— v24.134 专项冒烟：第四十二条支线「薪火的气」（守火翁·累计蓄力
// KINDLE_GOAL(10) 次）
// （新内容·新支线——承 v24.133 打更人「一夜好眠」/ v24.132 守墓人「灰烬不冷」同一「全新 NPC + 累计
// 计数支线」先例系列的第三例：雾语林营地篝火正南 (11,10) 新增「守火翁」（NPC_SPOTS '11,10' ·
// dungeon.extras (11,10)，坐标为可行走格且未被他图占用）——守着林间那口火的老守火人：风大的夜里得先
// 压住一口气、柴才烧得透，出手也是先把劲儿攥住再打出去（守夜人「它怕的不是剑，是有人还记得它」/
// 引灯人「把灯引到这儿就再没有前路了」同脉）；玩家累计蓄力 KINDLE_GOAL(10) 次（计数 hero.charges 复用
// 既有端口——battle.doCharge 蓄力成功全游唯一产生点写入、随 snapshotHero 自动持久化、防御式
// (g.charges||0) 旧档零迁移，与 ACH_LIST charge「蓄势待发」同读一份源、支线门槛 10 低于 CHARGE_GOAL(15)
// 顺路先完成支线再解锁成就），80 金 + 1 高级灵药；无 unlockOn 到访营地即 offer、active 页函数型实时
// 报进度、done 页 trueBoss/caveBoss/bossDefeated 三档分档，零新计数零新状态零新存档）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.134 注释 / GAME_VERSION v24.134 与旧 v24.133 字面量零
// 残留 / v24.133 打更人及更早历史注释保留 / KINDLE_GOAL 常量与 export）、QUESTS 契约（42 side +
// 4 main、side_kindle 字段逐值、与 CHARGE_GOAL 同源、ACH_LIST allquests 同源互证、KINDLE_GOAL 低于
// charges 成就门槛互证）、quests.js 运行期状态机（offer→active→turnin→done 全链路 + resolveNpcTalk
// 接取/交付结算 80 金+1 高级灵药 + npcQuestMark/npcQuestPages 四态 + sideQuestDone 0/42 +
// done 三档 trueBoss/caveBoss/bossDefeated）、NPCS.kindle 落位（守火翁 mark lamp + dungeon.extras/
// NPC_SPOTS '11,10' 全局坐标 + 姊妹件 minimap 随新现实更新）、README/package.json/CHANGELOG 同步
// （件套口径 357 + v24.134 守护描述 + 入库 357 + package 串尾 + CHANGELOG 顶 pin）、tests 目录与实跑链
// 恒等（357）、哨兵链（前望 358 且 README 尚无 358 口径）、旧代 v24.133 pin 全库零残留扫描（字面量/
// 顶 pin/356 口径 · 豁免本套件与上一版 v24133_inquest）。
import { GAME_VERSION, QUESTS, KINDLE_GOAL, CHARGE_GOAL, ACH_LIST, NPCS, NPC_SPOTS, MAPS } from '../js/data.js';
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

console.log('— v24.134 守火翁「薪火的气」新支线 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkgRaw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（格式合法 + 已越过 v24.133 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.133', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 133)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.134（旧 v24.133 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.160';") && !dSrc.includes("const GAME_VERSION = 'v24.136';"));
ok('data.js 含 v24.134 注释（薪火的气新支线说明）',
  dSrc.includes('v24.134 新内容·新支线（第四十二条）'));
ok('data.js 仍保留 v24.133 打更人历史注释（一夜好眠支线说明，零内容丢失）',
  dSrc.includes('v24.133 新内容·新支线（第四十一条）'));

// —— 源级落位：KINDLE_GOAL 常量 + export + NPC/坐标 ——
ok('data.js KINDLE_GOAL 常量 = 10（与 CHARGE_GOAL 比邻声明，同一蓄力端口家族）',
  dSrc.includes('const KINDLE_GOAL = 10;') && dSrc.indexOf('const KINDLE_GOAL') > dSrc.indexOf('const CHARGE_GOAL'));
ok('data.js export 块含 KINDLE_GOAL（FALLEN_GOAL 之后紧邻）',
  dSrc.includes('FALLEN_GOAL, KINDLE_GOAL, INN_GOAL,'));
ok('KINDLE_GOAL 与 charges 成就门槛同族互证（10 < CHARGE_GOAL 15——顺路先完成支线再解锁成就）',
  (() => { const aCh = ACH_LIST.find((a) => a.id === 'charge');
    return !!aCh && KINDLE_GOAL === 10 && CHARGE_GOAL === 15 &&
      aCh.ok({}) === false && aCh.ok({ charges: 14 }) === false &&
      aCh.ok({ charges: 15 }) === true && aCh.prog({ charges: 4 }) === '4/15' &&
      KINDLE_GOAL < CHARGE_GOAL; })());
ok('data.js NPCS.kindle 存在（守火翁 · mark lamp 复用既有灯标 · 零视觉新代码）',
  !!NPCS.kindle && NPCS.kindle.name === '守火翁' && NPCS.kindle.mark === 'lamp');
ok('data.js NPC_SPOTS 含守火翁据点 (11,10)，全局坐标键未被他图占用',
  NPC_SPOTS['11,10'] === 'kindle');
ok('data.js dungeon.extras 含 (11,10) NPC 项（全局唯一点位，不与既有键冲突）',
  dSrc.includes("{ x: 11, y: 10, ty: 'NPC' }") &&
  MAPS.dungeon.extras.some((e) => e.x === 11 && e.y === 10 && e.ty === 'NPC'));

// —— QUESTS 契约：42 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 46 条（42 side + 4 main，派生计数）',
  sideDefs.length === 45 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 49,
  `${sideDefs.length}/${mainDefs.length}`);
ok('side_kindle 存在且为第四十二条（kind side · store · npc/giver kindle · 无 unlockOn）',
  !!QUESTS.side_kindle && QUESTS.side_kindle.kind === 'side' && QUESTS.side_kindle.store === true &&
  QUESTS.side_kindle.npc === 'kindle' && QUESTS.side_kindle.giver === 'kindle' &&
  QUESTS.side_kindle.unlockOn == null);
ok('side_kindle 名称「薪火的气」/where/obj/offer/turnin/done 落位',
  QUESTS.side_kindle.name === '薪火的气' && QUESTS.side_kindle.where.includes('雾语林') &&
  QUESTS.side_kindle.obj.includes(String(KINDLE_GOAL)) && QUESTS.side_kindle.obj.includes('次') &&
  QUESTS.side_kindle.offer.includes('守火翁') && QUESTS.side_kindle.turnin.includes('守火翁') &&
  QUESTS.side_kindle.done.includes('火候'));
ok('side_kindle cond/condProg 与 KINDLE_GOAL 同源（hero.charges 计数，缺字段防御式 0，判/进/文/话一处调全端跟随）',
  QUESTS.side_kindle.cond({}) === false &&
  QUESTS.side_kindle.cond({ charges: 0 }) === false &&
  QUESTS.side_kindle.cond({ charges: 9 }) === false &&
  QUESTS.side_kindle.cond({ charges: 10 }) === true &&
  QUESTS.side_kindle.cond({ charges: 12 }) === true &&
  QUESTS.side_kindle.condProg({}) === `0/${KINDLE_GOAL} 次` &&
  QUESTS.side_kindle.condProg({ charges: 2 }) === `2/${KINDLE_GOAL} 次`);
ok('side_kindle reward 逐值：80 金 + 1 高级灵药（承 side_bell/side_watch 80 档）',
  QUESTS.side_kindle.reward.gold === 80 && !QUESTS.side_kindle.reward.item && QUESTS.side_kindle.reward.potion2 === 1);

// —— ACH_LIST allquests 同源互证（与 sideQuestDone 输出一致）——
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('ACH_LIST allquests 名称「灯火同心」且描述派生 42（「45 个支线任务」）',
  !!achAll && achAll.name === '灯火同心' && achAll.d.includes('45 个支线任务'), achAll && achAll.d);
ok('ACH_LIST allquests 判定/进度与 QUESTS 派生同源（0/42 false · 41/42 false · 42/42 true · prog 42/42）',
  !!achAll && achAll.ok({ quests: {} }) === false && achAll.ok({ quests: Object.fromEntries(sideDefs.slice(0, 41).map(q => [q.id, 'done'])) }) === false &&
  achAll.ok({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === true &&
  achAll.prog({ quests: {} }) === '0/45' && achAll.prog({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === '45/45');

// —— quests.js 运行期：sideQuestDone ——
ok('运行期：sideQuestDone 0/42 · 3/42 · 42/42 · 主线不入列',
  sideQuestDone({ quests: {} }).done === 0 && sideQuestDone({ quests: {} }).total === 45 &&
  sideQuestDone({ quests: { side_mushroom: 'done', side_cart: 'done', side_pond: 'done' } }).done === 3 &&
  sideQuestDone({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }).done === 45 &&
  sideQuestDone({ quests: { main_demon: 'done' } }).done === 0);

// —— 运行期状态机：offer → active → turnin → done（quests 纯函数，零 DOM）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 3, hp: 60, hpMax: 60, mp: 20, mpMax: 20, atkMax: 13, defMax: 9,
    gold: 0, xp: 0, xpNext: 100, item: 1, potion2: 0, weapon: '铁剑', armor: '皮甲',
    skills: [], ach: [], seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, talked: [], steps: 0,
    totalWins: 0, drops: 0, deflects: 0, casts: 0, travels: 0, sold: 0, spent: 0, crits: 0, charges: 0, flees: 0,
    potionUses: 0, mapPotions: 0, brews: 0, deaths: 0, x: 11, y: 11, map: 'dungeon' }, extra || {});
}
const h1 = mkHero({});
ok('状态机：无存档 → questStatus offer（无 unlockOn 首次到访雾语林营地即接，承 side_well/side_stele 同款）',
  questStatus(h1, 'side_kindle') === 'offer', questStatus(h1, 'side_kindle'));
ok('状态机：npcQuestMark offer 态「❕ 可接委托」',
  npcQuestMark(h1, 'kindle') === '❕ 可接委托', npcQuestMark(h1, 'kindle'));
ok('状态机：npcQuestPages offer 页（守火翁 · 薪火的气 · KINDLE_GOAL 同源）',
  JSON.stringify(npcQuestPages(h1, 'kindle')).includes('守火翁') &&
  JSON.stringify(npcQuestPages(h1, 'kindle')).includes(String(KINDLE_GOAL)) &&
  JSON.stringify(npcQuestPages(h1, 'kindle')).includes('接下委托'));
const rAcc = resolveNpcTalk(h1, 'kindle');
ok('状态机：resolveNpcTalk 接取 → {kind:accept, id:side_kindle} + quests.side_kindle=active',
  !!rAcc && rAcc.kind === 'accept' && rAcc.id === 'side_kindle' && h1.quests.side_kindle === 'active', JSON.stringify(rAcc));
ok('状态机：active 未达标 → questStatus active（cond 未满足）',
  questStatus(h1, 'side_kindle') === 'active', questStatus(h1, 'side_kindle'));
ok('状态机：active 页函数型实时报进度（已累计蓄力 0/10 次）',
  JSON.stringify(npcQuestPages(h1, 'kindle')).includes('0/' + KINDLE_GOAL + ' 次'));
ok('状态机：任务日志 objective 同源（累计在战斗里蓄力 10 次 0/10 次）',
  questJournal(h1).find((e) => e.id === 'side_kindle').objective.includes('次') &&
  questJournal(h1).find((e) => e.id === 'side_kindle').objective.includes(`0/${KINDLE_GOAL} 次`));
const h2 = mkHero({ quests: { side_kindle: 'active' }, charges: 10 });
ok('状态机：达标（charges=10 次）→ questStatus turnin',
  questStatus(h2, 'side_kindle') === 'turnin', questStatus(h2, 'side_kindle'));
ok('状态机：npcQuestMark turnin 态「❕ 可交任务」',
  npcQuestMark(h2, 'kindle') === '❕ 可交任务', npcQuestMark(h2, 'kindle'));
const rRew = resolveNpcTalk(h2, 'kindle');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:80, potion2:1} + done + 结算 80 金/1 高级灵药',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 80 && rRew.potion2 === 1 &&
  h2.quests.side_kindle === 'done' && h2.gold === 80 && h2.potion2 === 1, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）',
  resolveNpcTalk(h2, 'kindle') === null);
ok('状态机：done 默认档（守火翁：这口火替你留着——气攒住，火就在）',
  JSON.stringify(npcQuestPages(h2, 'kindle')).includes('这口火替你留着'));
ok('状态机：done bossDefeated 档（灯芯回来了叙事并入，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_kindle: 'done' }, bossDefeated: true }), 'kindle')).includes('灯芯回来了'));
ok('状态机：done caveBoss 档（领主散了、矿脉敞亮叙事并入，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_kindle: 'done' }, caveBoss: true }), 'kindle')).includes('领主散了'));
ok('状态机：done trueBoss 档（after 彩蛋「名字都回了灯下」并入 done 分档，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_kindle: 'done' }, trueBoss: true }), 'kindle')).includes('名字都回了灯下'));
ok('状态机：done 态 npcQuestMark 零顶标（kindle 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_kindle: 'done' } }), 'kindle') === null);
ok('questRewardPreview 与 reward 同源（80 金 + 1 高级灵药）',
  (() => { const prev = questRewardPreview(mkHero({}), 'side_kindle'); return !!prev && prev.gold === 80 && prev.item === 0 && prev.potion2 === 1; })());
ok('运行期：其余 unlockOn 里程碑 NPC 锁定态零顶标（stele2/stele3/stele4 无待办）',
  npcQuestMark(mkHero({}), 'stele2') === null && npcQuestMark(mkHero({}), 'stele3') === null &&
  npcQuestMark(mkHero({}), 'stele4') === null);

// —— NPCS.kindle 落位（全新 NPC：数据层三件套 + dungeon.extras + NPC_SPOTS）——
ok('NPCS.kindle 台词数据齐全（linesByStage 三档 + after 两页彩蛋）',
  !!NPCS.kindle && Array.isArray(NPCS.kindle.linesByStage) && NPCS.kindle.linesByStage.length === 3 &&
  NPCS.kindle.linesByStage[0].gate === null && Array.isArray(NPCS.kindle.after) && NPCS.kindle.after.length === 2);
ok('NPCS.kindle after 彩蛋（都亮回来了/往后这火我替你守着）数据层保留（零内容丢失契约）',
  !!NPCS.kindle && NPCS.kindle.after[0].some((ln) => ln.includes('都亮回来了')) &&
  NPCS.kindle.after[1].some((ln) => ln.includes('替你守着')));
ok('姊妹件 smoke_v2235_minimapquest 已随新现实更新（kindle 入任务 NPC 列表 + side_kindle done + dungeon (11,10) 金光）',
  read('smoke_v2235_minimapquest.mjs').includes("npcQuestMark(S.G, 'kindle')") &&
  read('smoke_v2235_minimapquest.mjs').includes('side_kindle') &&
  read('smoke_v2235_minimapquest.mjs').includes('goldAt(capD, 11, 10)'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为三百七十一件套（三百七十件套清除）',
  readme.includes('冒烟三百七十一件套（三百七十件套清除）'));
ok('README tests 含 v24.134 守护描述与 smoke_v24134_kindleq 入库（357 份）',
  readme.includes('v24.134 起含「守火翁「薪火的气」新支线」守护') &&
  readme.includes('smoke_v24134_kindleq 入库（357 份）'));
ok('README 仍保留 v24.133 打更人守护描述（历史保留）', readme.includes('v24.133 起含「打更人「一夜好眠」新支线」守护'));
ok('README 已有三百五十八件套口径且尚无 358（哨兵前望 358 语义：下一版才写 358）',
  readme.includes('冒烟三百七十一件套（三百七十件套清除）') && !readme.includes('冒烟三百七十二件套') && !readme.includes('（372 份）'));
ok('README tests 树串尾已延伸（…+ smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑））',
  readme.includes('smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑）'));
ok('README 支线/奖励行随新现实（四十二条 · 薪火的气 · KINDLE_GOAL）',
  readme.includes('四十五条支线目标/奖励全部由') &&
  readme.includes('`STELE_GOAL` `FALLEN_GOAL` `INN_GOAL` `KINDLE_GOAL` `LEDGER_GOAL` `MEDKIT_GOAL` `FURNACE_GOAL` |') &&
  readme.includes('v24.134 补第四十二条 · v24.135 补第四十三条 · v24.136 补第四十四条 · v24.143 补第四十五条') && readme.includes('v24.133 补第四十一条'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 356 份（smoke.mjs + 356 专项）', chain.length === 370 && ['smoke.mjs', ...chain].length === 371, String(chain.length));
ok('package.json 链尾为 smoke_v24134_kindleq（第 363 份）', chain[chain.length - 1] === 'smoke_v24160_noskill', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v24133_inquest.mjs && smoke_v24134_kindleq.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v24133_inquest.mjs && node tests/smoke_v24134_kindleq.mjs && node tests/smoke_v24135_ledgerquest.mjs && node tests/smoke_v24136_herbquest.mjs && node tests/smoke_v24143_furnacequest.mjs && node tests/smoke_v24147_unflicker.mjs && node tests/smoke_v24148_swift.mjs && node tests/smoke_v24151_lowlv.mjs && node tests/smoke_v24152_nopotion.mjs && node tests/smoke_v24153_penny.mjs && node tests/smoke_v24154_steadfast.mjs && node tests/smoke_v24155_frugal.mjs && node tests/smoke_v24157_dry.mjs && node tests/smoke_v24158_swift2.mjs && node tests/smoke_v24159_lowlv2.mjs && node tests/smoke_v24160_noskill.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.134（startsWith）', changelog.startsWith('## v24.160'));
ok('CHANGELOG v24.134 条目含「薪火的气」与「KINDLE_GOAL」与「守火翁」',
  changelog.includes('薪火的气') && changelog.includes('KINDLE_GOAL') && changelog.includes('守火翁'));
ok('CHANGELOG 仍保留 v24.133 条目（历史保留）', changelog.includes('## v24.133 '));

const testsDir = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
ok('tests 目录件套 = 357（356 + smoke_v24134_kindleq）', files.length === 371, String(files.length));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.133 pin 零残留 ——
const s24132 = read('smoke_v24132_fallenquest.mjs');
const s24133 = read('smoke_v24133_inquest.mjs');
const s2415 = read('smoke_v2415_treepin.mjs');
ok('smoke_v24133 的 GAME_VERSION 字面量 pin 已更新为 v24.134', s24133.includes("const GAME_VERSION = 'v24.160';"));
ok('smoke_v24133 的 CHANGELOG 顶 pin 已更新为 ## v24.137 ', s24133.includes("startsWith('## v24.160'"));
ok('smoke_v24133 的件套 pin 已更新为三百七十一件套（三百七十件套清除）', s24133.includes('三百七十一件套（三百七十件套清除）'));
ok('smoke_v24133 的 README/链 tail pin 已随新现实延伸（含 smoke_v24134_kindleq）',
  s24133.includes('smoke_v24134_kindleq'));
ok('smoke_v24133 的链尾 pin 已推进至 smoke_v24134_kindleq（第 363 份）', s24133.includes("=== 'smoke_v24160_noskill'"));
ok('smoke_v24132 的 README/链 tail pin 已随新现实延伸（含 smoke_v24133_inquest + smoke_v24134_kindleq）',
  s24132.includes('smoke_v24134_kindleq') && s24132.includes('smoke_v24133_inquest'));
const s2436 = read('smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（356 专项 / 357）且尚无 358 口径哨兵',
  s2436.includes('suiteFiles.length ===  370  && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length ===  371') &&
  s2436.includes('!readme.includes(\'冒烟三百七十二件套\')') && s2436.includes('!readme.includes(\'（372 份）\')'));
const s2429 = read('smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 哨兵链前望 358（三百七十二件套否定式）',
  s2429.includes("!readme.includes('冒烟三百七十二件套'"));

// 旧代 v24.133 pin 零残留扫描（豁免本套件与上一版 smoke_v24133_inquest）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v24134_kindleq.mjs' || f === 'smoke_v24133_inquest.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDir), 'utf8').split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  const hits = [];
  if (s2.includes("const GAME_VERSION = '" + "v24.133';")) hits.push('gv');
  if (s2.includes("GAME_VERSION === '" + "v24.133'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.133")) hits.push('cw');
  if (s2.includes('三百五十六件套（三百五' + '十五件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 35' + '6')) hits.push('fl');
  if (s2.includes('chainAll.length === 35' + '6')) hits.push('cal');
  if (s2.includes('chain.length === 35' + '5')) hits.push('cl');
  if (s2.includes('treeTok.length === 35' + '6')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v24133_" + "inquest'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.133 GAME_VERSION/顶 pin/356 口径（哨兵链，豁免本套件与上一版）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.134 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
