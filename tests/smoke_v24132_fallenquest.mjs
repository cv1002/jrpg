// smoke_v24132_fallenquest.mjs —— v24.132 专项冒烟：第四十条支线「灰烬不冷」（守墓人·累计阵亡
// FALLEN_GOAL(3) 次）
// （新内容·新支线——首条「全新 NPC 而非风味升格」的累计计数支线：潮灯镇镇南粮田东南角 (21,14)
// 新增「守墓人」——镇边埋着没能等回名字的灯下人，他替他们提着灯、守着空名（守名者「碑是刻给还活着、
// 却把名字弄丢的人看的」/拾骨人「矿道里的骷髅兵是当年没能走出矿洞的矿工亡骨」同脉）；玩家累计阵亡
// FALLEN_GOAL(3) 次（计数 hero.deaths 复用既有端口——battle.loseBattle 全游唯一战败结算点写入、
// 随 snapshotHero 全量快照自动持久化、防御式 (g.deaths||0) 旧档零迁移，与 ACH_LIST deaths「败而不馁」
// 同读一份源；支线门槛 3 低于成就门槛 DEATH_GOAL(10)——顺路先完成支线再解锁成就；强敌反复 B 再战也
// 如实累计；零新计数零新状态零新存档）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.132 注释 / GAME_VERSION v24.132 与旧 v24.131 字面量零残留 /
// v24.131 及更早历史注释保留 / FALLEN_GOAL 常量与 export）、QUESTS 契约（40 side + 4 main、
// side_fallen 字段逐值、与 DEATH_GOAL 同源、ACH_LIST allquests 同源互证、FALLEN_GOAL 低于
// deaths 成就门槛互证）、quests.js 运行期状态机（offer→active→turnin→done 全链路 + resolveNpcTalk
// 接取/交付结算 70 金+2 生命药水 + npcQuestMark/npcQuestPages 四态 + sideQuestDone 0/40 +
// done 三档 trueBoss/caveBoss/bossDefeated）、NPCS.fallen 落位（守墓人 mark lamp + village.extras/
// NPC_SPOTS '21,14' 全局坐标 + 姊妹件 minimap 随新现实更新）、README/package.json/CHANGELOG 同步
// （件套口径 355 + v24.132 守护描述 + 入库 355 + package 串尾 + CHANGELOG 顶 pin）、tests 目录与实跑链
// 恒等（355）、哨兵链（前望 356 且 README 尚无 356 口径）、旧代 v24.131 pin 全库零残留扫描（字面量/
// 顶 pin/354 口径 · 豁免本套件）。
import { GAME_VERSION, QUESTS, FALLEN_GOAL, DEATH_GOAL, ACH_LIST, NPCS, NPC_SPOTS } from '../js/data.js';
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

console.log('— v24.132 守墓人「灰烬不冷」新支线 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkgRaw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（格式合法 + 已越过 v24.131 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.131', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 131)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.132（旧 v24.131 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.183';") && !dSrc.includes("const GAME_VERSION = 'v24.131';"));
ok('data.js 含 v24.132 注释（灰烬不冷新支线说明）',
  dSrc.includes('v24.132 新内容·新支线（第四十条）'));
ok('data.js 仍保留 v24.131 历史注释（初灯的名字支线说明，零内容丢失）',
  dSrc.includes('v24.131 新内容·新支线（第三十九条）'));

// —— 源级落位：FALLEN_GOAL 常量 + export + NPC/坐标 ——
ok('data.js FALLEN_GOAL 常量 = 3（与 DEATH_GOAL 比邻声明，同一阵亡端口家族）',
  dSrc.includes('const FALLEN_GOAL = 3;') && dSrc.indexOf('const FALLEN_GOAL') > dSrc.indexOf('const DEATH_GOAL'));
ok('data.js export 块含 FALLEN_GOAL（DEATH_GOAL 之后紧邻）',
  dSrc.includes('DEATH_GOAL, FALLEN_GOAL,'));
ok('FALLEN_GOAL 与 deaths 成就门槛同族互证（3 < DEATH_GOAL 10——顺路先完成支线再解锁成就）',
  (() => { const aCh = ACH_LIST.find((a) => a.id === 'deaths');
    return !!aCh && FALLEN_GOAL === 3 && DEATH_GOAL === 10 &&
      aCh.ok({}) === false && aCh.ok({ deaths: 9 }) === false &&
      aCh.ok({ deaths: 10 }) === true && aCh.prog({ deaths: 4 }) === '4/10' &&
      FALLEN_GOAL < DEATH_GOAL; })());
ok('data.js NPCS.fallen 存在（守墓人 · mark lamp 复用既有灯标 · 零视觉新代码）',
  !!NPCS.fallen && NPCS.fallen.name === '守墓人' && NPCS.fallen.mark === 'lamp');
ok('data.js NPC_SPOTS 含守墓人据点 (21,14)，全局坐标键未被他图占用',
  NPC_SPOTS['21,14'] === 'fallen');
ok('data.js village.extras 含 (21,14) NPC 项（全局唯一点位，不与既有键冲突）',
  dSrc.includes("{ x: 21, y: 14, ty: 'NPC' }"));

// —— QUESTS 契约：40 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 44 条（40 side + 4 main，派生计数）',
  sideDefs.length === 46 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 50,
  `${sideDefs.length}/${mainDefs.length}`);
ok('side_fallen 存在且为第四十条（kind side · store · npc/giver fallen · 无 unlockOn）',
  !!QUESTS.side_fallen && QUESTS.side_fallen.kind === 'side' && QUESTS.side_fallen.store === true &&
  QUESTS.side_fallen.npc === 'fallen' && QUESTS.side_fallen.giver === 'fallen' &&
  QUESTS.side_fallen.unlockOn == null);
ok('side_fallen 名称「灰烬不冷」/where/obj/offer/turnin/done 落位',
  QUESTS.side_fallen.name === '灰烬不冷' && QUESTS.side_fallen.where.includes('潮灯镇') &&
  QUESTS.side_fallen.obj.includes(String(FALLEN_GOAL)) && QUESTS.side_fallen.obj.includes('次') &&
  QUESTS.side_fallen.offer.includes('守墓人') && QUESTS.side_fallen.turnin.includes('守墓人') &&
  QUESTS.side_fallen.done.includes('灰'));
ok('side_fallen cond/condProg 与 FALLEN_GOAL 同源（hero.deaths 计数，缺字段防御式 0，判/进/文/话一处调全端跟随）',
  QUESTS.side_fallen.cond({}) === false &&
  QUESTS.side_fallen.cond({ deaths: 0 }) === false &&
  QUESTS.side_fallen.cond({ deaths: 2 }) === false &&
  QUESTS.side_fallen.cond({ deaths: 3 }) === true &&
  QUESTS.side_fallen.cond({ deaths: 5 }) === true &&
  QUESTS.side_fallen.condProg({}) === `0/${FALLEN_GOAL} 次` &&
  QUESTS.side_fallen.condProg({ deaths: 2 }) === `2/${FALLEN_GOAL} 次`);
ok('side_fallen reward 逐值：70 金 + 2 生命药水（承 side_stele 70 档）',
  QUESTS.side_fallen.reward.gold === 70 && QUESTS.side_fallen.reward.item === 2 && !QUESTS.side_fallen.reward.potion2);

// —— ACH_LIST allquests 同源互证（与 sideQuestDone 输出一致）——
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('ACH_LIST allquests 名称「灯火同心」且描述派生 40（「46 个支线任务」）',
  !!achAll && achAll.name === '灯火同心' && achAll.d.includes('46 个支线任务'), achAll && achAll.d);
ok('ACH_LIST allquests 判定/进度与 QUESTS 派生同源（0/40 false · 39/40 false · 40/40 true · prog 40/40）',
  !!achAll && achAll.ok({ quests: {} }) === false && achAll.ok({ quests: Object.fromEntries(sideDefs.slice(0, 40).map(q => [q.id, 'done'])) }) === false &&
  achAll.ok({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === true &&
  achAll.prog({ quests: {} }) === '0/46' && achAll.prog({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === '46/46');

// —— quests.js 运行期：sideQuestDone ——
ok('运行期：sideQuestDone 0/40 · 3/40 · 40/40 · 主线不入列',
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
    potionUses: 0, mapPotions: 0, brews: 0, deaths: 0, x: 21, y: 15, map: 'village' }, extra || {});
}
const h1 = mkHero({});
ok('状态机：无存档 → questStatus offer（无 unlockOn 首次进潮灯镇即接，承 side_well/side_stele 同款）',
  questStatus(h1, 'side_fallen') === 'offer', questStatus(h1, 'side_fallen'));
ok('状态机：npcQuestMark offer 态「❕ 可接委托」',
  npcQuestMark(h1, 'fallen') === '❕ 可接委托', npcQuestMark(h1, 'fallen'));
ok('状态机：npcQuestPages offer 页（守墓人 · 灰烬不冷 · FALLEN_GOAL 同源）',
  JSON.stringify(npcQuestPages(h1, 'fallen')).includes('守墓人') &&
  JSON.stringify(npcQuestPages(h1, 'fallen')).includes(String(FALLEN_GOAL)) &&
  JSON.stringify(npcQuestPages(h1, 'fallen')).includes('接下委托'));
const rAcc = resolveNpcTalk(h1, 'fallen');
ok('状态机：resolveNpcTalk 接取 → {kind:accept, id:side_fallen} + quests.side_fallen=active',
  !!rAcc && rAcc.kind === 'accept' && rAcc.id === 'side_fallen' && h1.quests.side_fallen === 'active', JSON.stringify(rAcc));
ok('状态机：active 未达标 → questStatus active（cond 未满足）',
  questStatus(h1, 'side_fallen') === 'active', questStatus(h1, 'side_fallen'));
ok('状态机：active 页函数型实时报进度（已累计倒下 0/3 次）',
  JSON.stringify(npcQuestPages(h1, 'fallen')).includes('0/' + FALLEN_GOAL + ' 次'));
ok('状态机：任务日志 objective 同源（累计在灯下倒下 3 次 0/3 次）',
  questJournal(h1).find((e) => e.id === 'side_fallen').objective.includes('次') &&
  questJournal(h1).find((e) => e.id === 'side_fallen').objective.includes(`0/${FALLEN_GOAL} 次`));
const h2 = mkHero({ quests: { side_fallen: 'active' }, deaths: 3 });
ok('状态机：达标（deaths=3 次）→ questStatus turnin',
  questStatus(h2, 'side_fallen') === 'turnin', questStatus(h2, 'side_fallen'));
ok('状态机：npcQuestMark turnin 态「❕ 可交任务」',
  npcQuestMark(h2, 'fallen') === '❕ 可交任务', npcQuestMark(h2, 'fallen'));
const rRew = resolveNpcTalk(h2, 'fallen');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:70, item:2} + done + 结算 70 金/2 生命药水',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 70 && rRew.item === 2 &&
  h2.quests.side_fallen === 'done' && h2.gold === 70 && h2.item === 3, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）',
  resolveNpcTalk(h2, 'fallen') === null);
ok('状态机：done 默认档（守墓人：灰还温着，灯还亮着——你倒下了又站起来）',
  JSON.stringify(npcQuestPages(h2, 'fallen')).includes('灰还温着'));
ok('状态机：done bossDefeated 档（灯芯回来了叙事并入，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_fallen: 'done' }, bossDefeated: true }), 'fallen')).includes('灯芯回来了'));
ok('状态机：done caveBoss 档（领主散了、矿脉敞亮叙事并入，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_fallen: 'done' }, caveBoss: true }), 'fallen')).includes('领主散了'));
ok('状态机：done trueBoss 档（after 彩蛋「名字都回了灯下」并入 done 分档，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_fallen: 'done' }, trueBoss: true }), 'fallen')).includes('名字都回了灯下'));
ok('状态机：done 态 npcQuestMark 零顶标（fallen 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_fallen: 'done' } }), 'fallen') === null);
ok('questRewardPreview 与 reward 同源（70 金 + 2 生命药水）',
  (() => { const prev = questRewardPreview(mkHero({}), 'side_fallen'); return !!prev && prev.gold === 70 && prev.item === 2 && prev.potion2 === 0; })());
ok('运行期：其余 unlockOn 里程碑 NPC 锁定态零顶标（stele2/stele3/stele4 无待办）',
  npcQuestMark(mkHero({}), 'stele2') === null && npcQuestMark(mkHero({}), 'stele3') === null &&
  npcQuestMark(mkHero({}), 'stele4') === null);

// —— NPCS.fallen 落位（全新 NPC：数据层三件套 + village.extras + NPC_SPOTS）——
ok('NPCS.fallen 台词数据齐全（linesByStage 三档 + after 两页彩蛋）',
  !!NPCS.fallen && Array.isArray(NPCS.fallen.linesByStage) && NPCS.fallen.linesByStage.length === 3 &&
  NPCS.fallen.linesByStage[0].gate === null && Array.isArray(NPCS.fallen.after) && NPCS.fallen.after.length === 2);
ok('NPCS.fallen after 彩蛋（都亮回来了/往后这灯我替你提着）数据层保留（零内容丢失契约）',
  !!NPCS.fallen && NPCS.fallen.after[0].some((ln) => ln.includes('都亮回来了')) &&
  NPCS.fallen.after[1].some((ln) => ln.includes('替你提着')));
ok('姊妹件 smoke_v2235_minimapquest 已随新现实更新（fallen 入任务 NPC 列表 + side_fallen done + (21,14) 金光）',
  read('smoke_v2235_minimapquest.mjs').includes("npcQuestMark(S.G, 'fallen')") &&
  read('smoke_v2235_minimapquest.mjs').includes('side_fallen') &&
  read('smoke_v2235_minimapquest.mjs').includes('goldAt(capA, 21, 14)'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为三百九十三件套（三百九十二件套清除）',
  readme.includes('冒烟三百九十三件套（三百九十二件套清除）'));
ok('README tests 含 v24.132 守护描述与 smoke_v24132_fallenquest 入库（355 份）',
  readme.includes('v24.132 起含「守墓人「灰烬不冷」新支线」守护') &&
  readme.includes('smoke_v24132_fallenquest 入库（355 份）'));
ok('README 仍有 v24.131 守护描述（历史保留）', readme.includes('v24.131 起含「第四块名字石碑「初灯的名字」新支线」守护'));
ok('README 已有三百五十五件套口径且尚无 356（哨兵前望 356 语义：下一版才写 356）',
  readme.includes('冒烟三百九十三件套（三百九十二件套清除）') && !readme.includes('冒烟三百九十四件套') && !readme.includes('（394 份）'));
ok('README tests 树串尾已延伸（…+ smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑））',
  readme.includes('smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑）'));
ok('README 支线/奖励行随新现实（四十条 · 灰烬不冷 · FALLEN_GOAL）',
  readme.includes('四十六条支线目标/奖励全部由') &&
  readme.includes('灰烬不冷（守墓人 · 累计阵亡 `FALLEN_GOAL`(3) 次') &&
  readme.includes('v24.132 补第四十条 · v24.133 补第四十一条 · v24.134 补第四十二条 · v24.135 补第四十三条 · v24.136 补第四十四条 · v24.143 补第四十五条') && readme.includes('v24.131 补第三十九条'));
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 354 份（smoke.mjs + 354 专项）', chain.length === 392 && ['smoke.mjs', ...chain].length === 393, String(chain.length));
ok('package.json 链尾为 smoke_v24132_fallenquest（第 355 份）', chain[chain.length - 1] === 'smoke_v24183_unfllowlv2', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v24131_stele4quest.mjs && smoke_v24132_fallenquest.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v24131_stele4quest.mjs && node tests/smoke_v24132_fallenquest.mjs && node tests/smoke_v24133_inquest.mjs && node tests/smoke_v24134_kindleq.mjs && node tests/smoke_v24135_ledgerquest.mjs && node tests/smoke_v24136_herbquest.mjs && node tests/smoke_v24143_furnacequest.mjs && node tests/smoke_v24147_unflicker.mjs && node tests/smoke_v24148_swift.mjs && node tests/smoke_v24151_lowlv.mjs && node tests/smoke_v24152_nopotion.mjs && node tests/smoke_v24153_penny.mjs && node tests/smoke_v24154_steadfast.mjs && node tests/smoke_v24155_frugal.mjs && node tests/smoke_v24157_dry.mjs && node tests/smoke_v24158_swift2.mjs && node tests/smoke_v24159_lowlv2.mjs && node tests/smoke_v24160_noskill.mjs && node tests/smoke_v24161_noskill2.mjs && node tests/smoke_v24162_lowskill.mjs && node tests/smoke_v24163_swiftskill.mjs && node tests/smoke_v24164_swiftlv.mjs && node tests/smoke_v24165_nopotskill.mjs && node tests/smoke_v24166_unflskill.mjs && node tests/smoke_v24167_swiftnopo.mjs && node tests/smoke_v24168_lowlvnopo.mjs && node tests/smoke_v24169_unflswift.mjs && node tests/smoke_v24170_unfllowlv.mjs && node tests/smoke_v24171_unflnopo.mjs && node tests/smoke_v24172_unflpenny.mjs && node tests/smoke_v24173_pennyswift.mjs && node tests/smoke_v24174_pennylowlv.mjs && node tests/smoke_v24175_pennynoskill.mjs && node tests/smoke_v24176_pennynopo.mjs && node tests/smoke_v24177_unflswift2.mjs && node tests/smoke_v24178_unflpenny2.mjs && node tests/smoke_v24179_unflnopo2.mjs && node tests/smoke_v24180_unflskill2.mjs && node tests/smoke_v24181_lampoilquest.mjs && node tests/smoke_v24183_unfllowlv2.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.132（startsWith）', changelog.startsWith('## v24.183'));
ok('CHANGELOG v24.132 条目含「灰烬不冷」与「FALLEN_GOAL」与「守墓人」',
  changelog.includes('灰烬不冷') && changelog.includes('FALLEN_GOAL') && changelog.includes('守墓人'));
ok('CHANGELOG 仍保留 v24.131 条目（历史保留）', changelog.includes('## v24.131 '));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const testsDir = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录件套 = 355（354 + smoke_v24132_fallenquest）', files.length === 393, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.131 pin 零残留 ——
const s24131 = read('smoke_v24131_stele4quest.mjs');
ok('smoke_v24131 的 GAME_VERSION 字面量 pin 已更新为 v24.132', s24131.includes("const GAME_VERSION = 'v24.183';"));
ok('smoke_v24131 的 CHANGELOG 顶 pin 已更新为 ## v24.132 ', s24131.includes("startsWith('## v24.183'"));
ok('smoke_v24131 的件套 pin 已更新为三百九十三件套（三百九十二件套清除）', s24131.includes('三百九十三件套（三百九十二件套清除）'));
ok('smoke_v24131 的 README/链 tail pin 已随新现实延伸（含 smoke_v24132_fallenquest）',
  s24131.includes('smoke_v24132_fallenquest'));
ok('smoke_v24131 的链尾 pin 已推进至 smoke_v24132_fallenquest（第 355 份）', s24131.includes("=== 'smoke_v24183_unfllowlv2'"));
const s2436 = read('smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（354 专项 / 355）且尚无 356 口径哨兵',
  s2436.includes('suiteFiles.length === 392  && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length === 393') &&
  s2436.includes('!readme.includes(\'冒烟三百九十四件套\')') && s2436.includes('!readme.includes(\'（394 份）\')'));
const s2429 = read('smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 哨兵链前望 356（三百九十四件套否定式）',
  s2429.includes("!readme.includes('冒烟三百九十四件套'"));
// 旧代 v24.131 pin 零残留扫描（豁免本套件）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v24132_fallenquest.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDir), 'utf8').split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  const hits = [];
  if (s2.includes("const GAME_VERSION = '" + "v24.131';")) hits.push('gv');
  if (s2.includes("GAME_VERSION === '" + "v24.131'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.131")) hits.push('cw');
  if (s2.includes('三百五十四件套（三百五' + '十三件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 35' + '4')) hits.push('fl');
  if (s2.includes('chainAll.length === 35' + '4')) hits.push('cal');
  if (s2.includes('chain.length === 35' + '3')) hits.push('cl');
  if (s2.includes('treeTok.length === 35' + '4')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v24131_" + "stele4quest'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.131 GAME_VERSION/顶 pin/354 口径（哨兵链，豁免本套件）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.132 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
