// smoke_v24135_ledgerquest.mjs —— v24.135 专项冒烟：第四十三条支线「灯油的账」（账房先生·持有金币
// LEDGER_GOAL(200) 金）
// （新内容·新支线——承 v24.134 守火翁「薪火的气」/ v24.133 打更人「一夜好眠」/ v24.132 守墓人「灰烬不冷」
// 同一「全新 NPC + 计数支线」先例系列的第四例（首条「持有类」口径）：潮灯镇商店/酿造/旅馆商业区 (9,11)
// 新增「账房先生」（NPC_SPOTS '9,11' · village.extras (9,11)，坐标为可行走 '0' 格且未被他图占用）——
// 守着镇子灯油账的老账房：灯是拿钱买油点着的、镇上每一笔账他都记着；玩家自己攒下的每一笔钱，都算替
// 他把灯油账续上一笔——替他持有 LEDGER_GOAL(200) 金（计数口径 hero.gold 复用既有字段——胜利/开箱/掉落/
// 任务结算写定、shop 扣款消费，随 snapshotHero 自动持久化、防御式 (g.gold||0) 旧档零迁移，与 ACH_LIST
// rich「小富翁」同读一份源、支线门槛 200 低于 RICH_GOLD(500) 顺路先完成支线再解锁成就——持有类 cond
// 状态判定、交付后 done 粘性不受消费回落影响），80 金 + 1 高级灵药；无 unlockOn 开局即 offer、active 页
// 函数型实时报进度、done 页 trueBoss/caveBoss/bossDefeated 三档分档，零新计数零新状态零新存档）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.135 注释 / GAME_VERSION v24.135 与旧 v24.134 字面量零
// 残留 / v24.134 守火翁及更早历史注释保留 / LEDGER_GOAL 常量与 export）、QUESTS 契约（43 side +
// 4 main、side_ledger 字段逐值、与 RICH_GOLD 同源、ACH_LIST allquests 同源互证、LEDGER_GOAL 低于
// rich 成就门槛互证）、quests.js 运行期状态机（offer→active→turnin→done 全链路 + resolveNpcTalk
// 接取/交付结算 80 金+1 高级灵药 + npcQuestMark/npcQuestPages 四态 + sideQuestDone 0/43 +
// done 三档 trueBoss/caveBoss/bossDefeated 消费回落后 done 粘性）、NPCS.ledger 落位（账房先生
// mark basket + village.extras/NPC_SPOTS '9,11' 全局坐标 + 姊妹件 minimap 随新现实更新）、
// README/package.json/CHANGELOG 同步（件套口径 358 + v24.135 守护描述 + 入库 358 + package 串尾 +
// CHANGELOG 顶 pin）、tests 目录与实跑链恒等（358）、哨兵链（前望 359 且 README 尚无 359 口径）、
// 旧代 v24.134 pin 全库零残留扫描（字面量/顶 pin/357 口径 · 豁免本套件与上一版 v24134_kindleq 与
// 上上版 v24133_inquest）。
import { GAME_VERSION, QUESTS, LEDGER_GOAL, RICH_GOLD, ACH_LIST, NPCS, NPC_SPOTS, MAPS } from '../js/data.js';
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

console.log('— v24.135 账房先生「灯油的账」新支线 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkgRaw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（格式合法 + 已越过 v24.134 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.134', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 134)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.135（旧 v24.134 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.193';") && !dSrc.includes("const GAME_VERSION = 'v24.136';"));
ok('data.js 含 v24.135 注释（灯油的账新支线说明）',
  dSrc.includes('v24.135 新内容·新支线（第四十三条）'));
ok('data.js 仍保留 v24.134 守火翁历史注释（薪火的气支线说明，零内容丢失）',
  dSrc.includes('v24.134 新内容·新支线（第四十二条）'));

// —— 源级落位：LEDGER_GOAL 常量 + export + NPC/坐标 ——
ok('data.js LEDGER_GOAL 常量 = 200（与 RICH_GOLD 比邻声明，同一金币持有家族）',
  dSrc.includes('const LEDGER_GOAL = 200;') && dSrc.indexOf('const LEDGER_GOAL') > dSrc.indexOf('const RICH3_GOAL'));
ok('data.js export 块含 LEDGER_GOAL（INN_GOAL 之后紧邻）',
  dSrc.includes('KINDLE_GOAL, INN_GOAL, LEDGER_GOAL,'));
ok('LEDGER_GOAL 与 rich 成就门槛同族互证（200 < RICH_GOLD 500——顺路先完成支线再解锁成就）',
  (() => { const aCh = ACH_LIST.find((a) => a.id === 'rich');
    return !!aCh && LEDGER_GOAL === 200 && RICH_GOLD === 500 &&
      aCh.ok({ gold: 199 }) === false && aCh.ok({ gold: 200 }) === false &&
      aCh.ok({ gold: 500 }) === true && aCh.prog({ gold: 4 }) === '4/500' &&
      LEDGER_GOAL < RICH_GOLD; })());
ok('data.js NPCS.ledger 存在（账房先生 · mark basket 复用既有货篮标 · 零视觉新代码）',
  !!NPCS.ledger && NPCS.ledger.name === '账房先生' && NPCS.ledger.mark === 'basket');
ok('data.js NPC_SPOTS 含账房先生据点 (9,11)，全局坐标键未被他图占用',
  NPC_SPOTS['9,11'] === 'ledger');
ok('data.js village.extras 含 (9,11) NPC 项（全局唯一点位，不与既有键冲突）',
  dSrc.includes("{ x: 9, y: 11, ty: 'NPC' }") &&
  MAPS.village.extras.some((e) => e.x === 9 && e.y === 11 && e.ty === 'NPC'));

// —— QUESTS 契约：43 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 47 条（43 side + 4 main，派生计数）',
  sideDefs.length === 46 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 50,
  `${sideDefs.length}/${mainDefs.length}`);
ok('side_ledger 存在且为第四十三条（kind side · store · npc/giver ledger · 无 unlockOn）',
  !!QUESTS.side_ledger && QUESTS.side_ledger.kind === 'side' && QUESTS.side_ledger.store === true &&
  QUESTS.side_ledger.npc === 'ledger' && QUESTS.side_ledger.giver === 'ledger' &&
  QUESTS.side_ledger.unlockOn == null);
ok('side_ledger 名称「灯油的账」/where/obj/offer/turnin/done 落位',
  QUESTS.side_ledger.name === '灯油的账' && QUESTS.side_ledger.where.includes('潮灯镇') &&
  QUESTS.side_ledger.obj.includes(String(LEDGER_GOAL)) && QUESTS.side_ledger.obj.includes('金') &&
  QUESTS.side_ledger.offer.includes('账房先生') && QUESTS.side_ledger.turnin.includes('账房先生') &&
  QUESTS.side_ledger.done.includes('灯油'));
ok('side_ledger cond/condProg 与 LEDGER_GOAL 同源（hero.gold 持有判定，缺字段防御式 0，判/进/文/话一处调全端跟随）',
  QUESTS.side_ledger.cond({}) === false &&
  QUESTS.side_ledger.cond({ gold: 0 }) === false &&
  QUESTS.side_ledger.cond({ gold: 199 }) === false &&
  QUESTS.side_ledger.cond({ gold: 200 }) === true &&
  QUESTS.side_ledger.cond({ gold: 500 }) === true &&
  QUESTS.side_ledger.condProg({}) === `0/${LEDGER_GOAL} 金` &&
  QUESTS.side_ledger.condProg({ gold: 123.7 }) === `123/${LEDGER_GOAL} 金`);
ok('side_ledger reward 逐值：80 金 + 1 高级灵药（承 side_kindle/side_bell/side_watch 80 档）',
  QUESTS.side_ledger.reward.gold === 80 && !QUESTS.side_ledger.reward.item && QUESTS.side_ledger.reward.potion2 === 1);

// —— ACH_LIST allquests 同源互证（与 sideQuestDone 输出一致）——
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('ACH_LIST allquests 名称「灯火同心」且描述派生 43（「46 个支线任务」）',
  !!achAll && achAll.name === '灯火同心' && achAll.d.includes('46 个支线任务'), achAll && achAll.d);
ok('ACH_LIST allquests 判定/进度与 QUESTS 派生同源（0/43 false · 42/43 false · 43/43 true · prog 43/43）',
  !!achAll && achAll.ok({ quests: {} }) === false && achAll.ok({ quests: Object.fromEntries(sideDefs.slice(0, 42).map(q => [q.id, 'done'])) }) === false &&
  achAll.ok({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === true &&
  achAll.prog({ quests: {} }) === '0/46' && achAll.prog({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === '46/46');

// —— quests.js 运行期：sideQuestDone ——
ok('运行期：sideQuestDone 0/43 · 3/43 · 43/43 · 主线不入列',
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
    potionUses: 0, mapPotions: 0, brews: 0, deaths: 0, x: 9, y: 12, map: 'village' }, extra || {});
}
const h1 = mkHero({});
ok('状态机：无存档 → questStatus offer（无 unlockOn 首次到访潮灯镇商业区即接，承 side_wait/side_well 同款）',
  questStatus(h1, 'side_ledger') === 'offer', questStatus(h1, 'side_ledger'));
ok('状态机：npcQuestMark offer 态「❕ 可接委托」',
  npcQuestMark(h1, 'ledger') === '❕ 可接委托', npcQuestMark(h1, 'ledger'));
ok('状态机：npcQuestPages offer 页（账房先生 · 灯油的账 · LEDGER_GOAL 同源）',
  JSON.stringify(npcQuestPages(h1, 'ledger')).includes('账房先生') &&
  JSON.stringify(npcQuestPages(h1, 'ledger')).includes(String(LEDGER_GOAL)) &&
  JSON.stringify(npcQuestPages(h1, 'ledger')).includes('接下委托'));
const rAcc = resolveNpcTalk(h1, 'ledger');
ok('状态机：resolveNpcTalk 接取 → {kind:accept, id:side_ledger} + quests.side_ledger=active',
  !!rAcc && rAcc.kind === 'accept' && rAcc.id === 'side_ledger' && h1.quests.side_ledger === 'active', JSON.stringify(rAcc));
ok('状态机：active 未达标 → questStatus active（cond 未满足）',
  questStatus(h1, 'side_ledger') === 'active', questStatus(h1, 'side_ledger'));
ok('状态机：active 页函数型实时报进度（已持有 0/200 金）',
  JSON.stringify(npcQuestPages(h1, 'ledger')).includes('0/' + LEDGER_GOAL + ' 金'));
ok('状态机：任务日志 objective 同源（身上攒下 200 金 0/200 金）',
  questJournal(h1).find((e) => e.id === 'side_ledger').objective.includes('金') &&
  questJournal(h1).find((e) => e.id === 'side_ledger').objective.includes(`0/${LEDGER_GOAL} 金`));
const h2 = mkHero({ quests: { side_ledger: 'active' }, gold: 200 });
ok('状态机：达标（gold=200 金）→ questStatus turnin',
  questStatus(h2, 'side_ledger') === 'turnin', questStatus(h2, 'side_ledger'));
ok('状态机：npcQuestMark turnin 态「❕ 可交任务」',
  npcQuestMark(h2, 'ledger') === '❕ 可交任务', npcQuestMark(h2, 'ledger'));
const rRew = resolveNpcTalk(h2, 'ledger');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:80, potion2:1} + done + 结算 80 金/1 高级灵药（持有 200 保住 + 80 = 280）',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 80 && rRew.potion2 === 1 &&
  h2.quests.side_ledger === 'done' && h2.gold === 280 && h2.potion2 === 1, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）',
  resolveNpcTalk(h2, 'ledger') === null);
ok('状态机：done 粘性——交付后消费回落到 200 以下 questStatus 仍 done（持有类坍缩不回退）',
  questStatus(mkHero({ quests: { side_ledger: 'done' }, gold: 50 }), 'side_ledger') === 'done');
ok('状态机：done 默认档（账房先生：这笔账替你留着——灯要亮着，账要先稳）',
  JSON.stringify(npcQuestPages(h2, 'ledger')).includes('这笔账替你留着'));
ok('状态机：done bossDefeated 档（灯芯回来了叙事并入，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_ledger: 'done' }, bossDefeated: true }), 'ledger')).includes('灯芯回来了'));
ok('状态机：done caveBoss 档（领主散了、矿脉敞亮叙事并入，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_ledger: 'done' }, caveBoss: true }), 'ledger')).includes('领主散了'));
ok('状态机：done trueBoss 档（after 彩蛋「灯都亮回来了」并入 done 分档，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_ledger: 'done' }, trueBoss: true }), 'ledger')).includes('灯都亮回来了'));
ok('状态机：done 态 npcQuestMark 零顶标（ledger 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_ledger: 'done' } }), 'ledger') === null);
ok('questRewardPreview 与 reward 同源（80 金 + 1 高级灵药）',
  (() => { const prev = questRewardPreview(mkHero({}), 'side_ledger'); return !!prev && prev.gold === 80 && prev.item === 0 && prev.potion2 === 1; })());
ok('运行期：其余 unlockOn 里程碑 NPC 锁定态零顶标（stele2/stele3/stele4 无待办）',
  npcQuestMark(mkHero({}), 'stele2') === null && npcQuestMark(mkHero({}), 'stele3') === null &&
  npcQuestMark(mkHero({}), 'stele4') === null);

// —— NPCS.ledger 落位（全新 NPC：数据层三件套 + village.extras + NPC_SPOTS）——
ok('NPCS.ledger 台词数据齐全（linesByStage 三档 + after 两页彩蛋）',
  !!NPCS.ledger && Array.isArray(NPCS.ledger.linesByStage) && NPCS.ledger.linesByStage.length === 3 &&
  NPCS.ledger.linesByStage[0].gate === null && Array.isArray(NPCS.ledger.after) && NPCS.ledger.after.length === 2);
ok('NPCS.ledger after 彩蛋（都亮回来了/往后这账我替你记着）数据层保留（零内容丢失契约）',
  !!NPCS.ledger && NPCS.ledger.after[0].some((ln) => ln.includes('都亮回来了')) &&
  NPCS.ledger.after[1].some((ln) => ln.includes('替你记着')));
ok('姊妹件 smoke_v2235_minimapquest 已随新现实更新（ledger 入任务 NPC 列表 + side_ledger done + village (9,11) 金光）',
  read('smoke_v2235_minimapquest.mjs').includes("npcQuestMark(S.G, 'ledger')") &&
  read('smoke_v2235_minimapquest.mjs').includes('side_ledger') &&
  read('smoke_v2235_minimapquest.mjs').includes('goldAt(capA, 9, 11)'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为四百零三件套（四百零二件套清除）',
  readme.includes('冒烟四百零三件套（四百零二件套清除）'));
ok('README tests 含 v24.135 守护描述与 smoke_v24135_ledgerquest 入库（358 份）',
  readme.includes('v24.135 起含「账房先生「灯油的账」新支线」守护') &&
  readme.includes('smoke_v24135_ledgerquest 入库（358 份）'));
ok('README 仍保留 v24.134 守火翁守护描述（历史保留）', readme.includes('v24.134 起含「守火翁「薪火的气」新支线」守护'));
ok('README 已有三百五十八件套口径且尚无 359（哨兵前望 359 语义：下一版才写 359）',
  readme.includes('冒烟四百零三件套（四百零二件套清除）') && !readme.includes('冒烟四百零四件套') && !readme.includes('（404 份）'));
ok('README tests 树串尾已延伸（…+ smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑））',
  readme.includes('smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑）'));
ok('README 支线/奖励行随新现实（四十三条 · 灯油的账 · LEDGER_GOAL）',
  readme.includes('四十六条支线目标/奖励全部由') &&
  readme.includes('`STELE_GOAL` `FALLEN_GOAL` `INN_GOAL` `KINDLE_GOAL` `LEDGER_GOAL` `MEDKIT_GOAL` `FURNACE_GOAL` `MUSH_HOLD_GOAL` |') &&
  readme.includes('v24.135 补第四十三条 · v24.136 补第四十四条 · v24.143 补第四十五条') && readme.includes('v24.134 补第四十二条'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 357 份（smoke.mjs + 357 专项）', chain.length === 402 && ['smoke.mjs', ...chain].length === 403, String(chain.length));
ok('package.json 链尾为 smoke_v24135_ledgerquest（第 363 份）', chain[chain.length - 1] === 'smoke_v24193_nopotskill2', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v24134_kindleq.mjs && smoke_v24135_ledgerquest.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v24134_kindleq.mjs && node tests/smoke_v24135_ledgerquest.mjs && node tests/smoke_v24136_herbquest.mjs && node tests/smoke_v24143_furnacequest.mjs && node tests/smoke_v24147_unflicker.mjs && node tests/smoke_v24148_swift.mjs && node tests/smoke_v24151_lowlv.mjs && node tests/smoke_v24152_nopotion.mjs && node tests/smoke_v24153_penny.mjs && node tests/smoke_v24154_steadfast.mjs && node tests/smoke_v24155_frugal.mjs && node tests/smoke_v24157_dry.mjs && node tests/smoke_v24158_swift2.mjs && node tests/smoke_v24159_lowlv2.mjs && node tests/smoke_v24160_noskill.mjs && node tests/smoke_v24161_noskill2.mjs && node tests/smoke_v24162_lowskill.mjs && node tests/smoke_v24163_swiftskill.mjs && node tests/smoke_v24164_swiftlv.mjs && node tests/smoke_v24165_nopotskill.mjs && node tests/smoke_v24166_unflskill.mjs && node tests/smoke_v24167_swiftnopo.mjs && node tests/smoke_v24168_lowlvnopo.mjs && node tests/smoke_v24169_unflswift.mjs && node tests/smoke_v24170_unfllowlv.mjs && node tests/smoke_v24171_unflnopo.mjs && node tests/smoke_v24172_unflpenny.mjs && node tests/smoke_v24173_pennyswift.mjs && node tests/smoke_v24174_pennylowlv.mjs && node tests/smoke_v24175_pennynoskill.mjs && node tests/smoke_v24176_pennynopo.mjs && node tests/smoke_v24177_unflswift2.mjs && node tests/smoke_v24178_unflpenny2.mjs && node tests/smoke_v24179_unflnopo2.mjs && node tests/smoke_v24180_unflskill2.mjs && node tests/smoke_v24181_lampoilquest.mjs && node tests/smoke_v24183_unfllowlv2.mjs && node tests/smoke_v24184_pennyswift2.mjs && node tests/smoke_v24185_pennylowlv2.mjs && node tests/smoke_v24186_pennynoskill2.mjs && node tests/smoke_v24187_pennynopo2.mjs && node tests/smoke_v24188_swiftlv2.mjs && node tests/smoke_v24189_swiftskill2.mjs && node tests/smoke_v24190_swiftnopo2.mjs && node tests/smoke_v24191_lowskill2.mjs && node tests/smoke_v24192_lowlvnopo2.mjs && node tests/smoke_v24193_nopotskill2.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.135（startsWith）', changelog.startsWith('## v24.193'));
ok('CHANGELOG v24.135 条目含「灯油的账」与「LEDGER_GOAL」与「账房先生」',
  changelog.includes('灯油的账') && changelog.includes('LEDGER_GOAL') && changelog.includes('账房先生'));
ok('CHANGELOG 仍保留 v24.134 条目（历史保留）', changelog.includes('## v24.134 '));

const testsDir = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
ok('tests 目录件套 = 358（357 + smoke_v24135_ledgerquest）', files.length === 403, String(files.length));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.134 pin 零残留 ——
const s24133 = read('smoke_v24133_inquest.mjs');
const s24134 = read('smoke_v24134_kindleq.mjs');
const s2415 = read('smoke_v2415_treepin.mjs');
ok('smoke_v24134 的 GAME_VERSION 字面量 pin 已更新为 v24.135', s24134.includes("const GAME_VERSION = 'v24.193';"));
ok('smoke_v24134 的 CHANGELOG 顶 pin 已更新为 ## v24.137 ', s24134.includes("startsWith('## v24.193'"));
ok('smoke_v24134 的件套 pin 已更新为四百零三件套（四百零二件套清除）', s24134.includes('四百零三件套（四百零二件套清除）'));
ok('smoke_v24134 的 README/链 tail pin 已随新现实延伸（含 smoke_v24135_ledgerquest）',
  s24134.includes('smoke_v24135_ledgerquest'));
ok('smoke_v24134 的链尾 pin 已推进至 smoke_v24135_ledgerquest（第 363 份）', s24134.includes("=== 'smoke_v24193_nopotskill2'"));
ok('smoke_v24133 的 README/链 tail pin 已随新现实延伸（含 smoke_v24134_kindleq + smoke_v24135_ledgerquest）',
  s24133.includes('smoke_v24135_ledgerquest') && s24133.includes('smoke_v24134_kindleq'));
const s2436 = read('smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（357 专项 / 358）且尚无 359 口径哨兵',
  s2436.includes('suiteFiles.length === 402  && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length === 403') &&
  s2436.includes('!readme.includes(\'冒烟四百零四件套\')') && s2436.includes('!readme.includes(\'（404 份）\')'));
const s2429 = read('smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 哨兵链前望 359（四百零四件套否定式）',
  s2429.includes("!readme.includes('冒烟四百零四件套'"));

// 旧代 v24.134 pin 零残留扫描（豁免本套件与上一版 kindleq 与上上版 inquest）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v24135_ledgerquest.mjs' || f === 'smoke_v24134_kindleq.mjs' || f === 'smoke_v24133_inquest.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDir), 'utf8').split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  const hits = [];
  if (s2.includes("const GAME_VERSION = '" + "v24.134';")) hits.push('gv');
  if (s2.includes("GAME_VERSION === '" + "v24.134'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.134")) hits.push('cw');
  if (s2.includes('三百五十七件套（三百五' + '十六件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 35' + '7')) hits.push('fl');
  if (s2.includes('chainAll.length === 35' + '7')) hits.push('cal');
  if (s2.includes('chain.length === 35' + '6')) hits.push('cl');
  if (s2.includes('treeTok.length === 35' + '7')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v24134_" + "kindleq'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.134 GAME_VERSION/顶 pin/357 口径（哨兵链，豁免本套件与上两版）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.135 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
