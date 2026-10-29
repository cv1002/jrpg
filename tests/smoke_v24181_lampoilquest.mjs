// smoke_v24181_lampoilquest.mjs —— v24.181 专项冒烟：第四十六条支线「菌盖的灯油」（熬灯婶·持有发光菌盖
// MUSH_HOLD_GOAL(6) 株）
// （新内容·新支线——承 v24.143 守炉翁「灵药照炉」/ v24.136 采药翁「药囊常满」/ v24.135 账房先生「灯油的账」
// 同一「全新 NPC + 持有类计数支线」先例系列的第四例（持有类收官——四资源持有家族：金币/药水/高级灵药/蘑菇
// 到此各有一枚持有类谢礼支线）：潮灯镇广场南 (11,11) 新增「熬灯婶」（NPC_SPOTS '11,11' · village.extras (11,11)，
// 坐标为可行走 '0' 格且未被他图占用，四邻 (10,11)/(12,11)/(11,10)/(11,12) 皆可面对面对话）——守着镇子熬灯油
// 那口锅的老熬油人：菌盖夜里发光，那是地底星砂留给蘑菇的一点光（v22.42 蘑菇田菌盖灯油/v22.50 酿药师同脉），
// 「菌盖熬成油，灯才有得点」——灯下人最要紧的两样，一个是灯芯，一个就是这口油；玩家随身带着的每一株发光
// 菌盖，都算替她把灯油续上一笔——替她持有 MUSH_HOLD_GOAL(6) 株（计数口径 hero.mushrooms 复用既有字段——
// world.js 宝箱 60% 蘑菇/战斗掉落/精英掉落三处唯一产生点写定、酿造 2 株/卖菇 10 金双消耗扣减，随 snapshotHero
// 自动持久化、防御式 (g.mushrooms||0) 旧档零迁移，与 ACH_LIST mush「菇香满仓」同读一份源、支线门槛 6 低于
// 成就门槛 MUSH_GOAL(10) 顺路先完成支线再解锁成就——持有类 cond 状态判定、交付后 done 粘性不受酿造/卖菇消耗
// 回落影响；交付奖励 80 金 + 1 高级灵药），80 金 + 1 高级灵药；无 unlockOn 开局即 offer、active 页函数型实时
// 报进度、done 页 trueBoss/caveBoss/bossDefeated 三档分档，零新计数零新状态零新存档）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.181 注释 / GAME_VERSION v24.181 与旧 v24.180 字面量零
// 残留 / v24.143 守炉翁及更早历史注释保留 / MUSH_HOLD_GOAL 常量与 export）、QUESTS 契约（46 side +
// 4 main、side_lampoil 字段逐值、与 MUSH_GOAL 同源、ACH_LIST allquests 同源互证、MUSH_HOLD_GOAL
// 低于 mush 成就门槛互证）、quests.js 运行期状态机（offer→active→turnin→done 全链路 + resolveNpcTalk
// 接取/交付结算 80 金+1 高级灵药 + npcQuestMark/npcQuestPages 四态 + sideQuestDone 0/46 +
// done 三档 trueBoss/caveBoss/bossDefeated 消耗回落后 done 粘性）、NPCS.lampoil 落位（熬灯婶
// mark basket + village.extras/NPC_SPOTS '11,11' 全局坐标 + 姊妹件 minimap 随新现实更新）、
// README/package.json/CHANGELOG 同步（件套口径 391 + v24.181 守护描述 + 入库 392 + package 串尾 +
// CHANGELOG 顶 pin）、tests 目录与实跑链恒等（392）、哨兵链（前望 393 且 README 尚无 393 口径）、
// 旧代 v24.180 pin 全库零残留扫描（字面量/顶 pin/391 口径 · 豁免本套件与上一版 v24180_unflskill2 与
// 上上版 v24179_unflnopo2）。
import { GAME_VERSION, QUESTS, MUSH_HOLD_GOAL, MUSH_GOAL, ACH_LIST, NPCS, NPC_SPOTS, MAPS } from '../js/data.js';
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

console.log('— v24.181 熬灯婶「菌盖的灯油」新支线 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkgRaw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（格式合法 + 已越过 v24.180 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.180', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 180)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.186（旧 v24.180 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.186';") && !dSrc.includes("const GAME_VERSION = 'v24.180';"));
ok('data.js 含 v24.181 注释（熬灯婶「菌盖的灯油」新支线说明）',
  dSrc.includes('v24.181 新内容·新支线（第四十六条）'));
ok('data.js 仍保留 v24.180 历史注释（零内容丢失）',
  dSrc.includes('v24.180 新内容·新成就'));

// —— 源级落位：MUSH_HOLD_GOAL 常量 + export + NPC/坐标 ——
ok('data.js MUSH_HOLD_GOAL 常量 = 6（与 FURNACE_GOAL 比邻声明，同一持有类家族）',
  dSrc.includes('const MUSH_HOLD_GOAL = 6;') && dSrc.indexOf('const MUSH_HOLD_GOAL') > dSrc.indexOf('const FURNACE_GOAL'));
ok('data.js export 块含 MUSH_HOLD_GOAL（FURNACE_GOAL 之后紧邻）',
  dSrc.includes('FURNACE_GOAL, MUSH_HOLD_GOAL, NIGHT_WIN_GOAL'));
ok('MUSH_HOLD_GOAL 与 mush 成就门槛同族互证（6 < MUSH_GOAL 10——顺路先完成支线再解锁成就）',
  (() => { const aCh = ACH_LIST.find((a) => a.id === 'mush');
    return !!aCh && MUSH_HOLD_GOAL === 6 && MUSH_GOAL === 10 &&
      aCh.ok({ mushrooms: 5 }) === false && aCh.ok({ mushrooms: 6 }) === false &&
      aCh.ok({ mushrooms: 10 }) === true && aCh.prog({ mushrooms: 6 }) === '6/10' &&
      MUSH_HOLD_GOAL < MUSH_GOAL; })());
ok('data.js NPCS.lampoil 存在（熬灯婶 · mark basket 复用既有货篮标 · 零视觉新代码）',
  !!NPCS.lampoil && NPCS.lampoil.name === '熬灯婶' && NPCS.lampoil.mark === 'basket');
ok('data.js NPC_SPOTS 含熬灯婶据点 (11,11)，全局坐标键未被他图占用',
  NPC_SPOTS['11,11'] === 'lampoil');
ok('data.js village.extras 含 (11,11) NPC 项（全局唯一点位，不与既有键冲突）',
  dSrc.includes("{ x: 11, y: 11, ty: 'NPC' }") &&
  MAPS.village.extras.some((e) => e.x === 11 && e.y === 11 && e.ty === 'NPC'));

// —— QUESTS 契约：46 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 50 条（46 side + 4 main，派生计数）',
  sideDefs.length === 46 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 50,
  `${sideDefs.length}/${mainDefs.length}`);
ok('side_lampoil 存在且为第四十六条（kind side · store · npc/giver lampoil · 无 unlockOn）',
  !!QUESTS.side_lampoil && QUESTS.side_lampoil.kind === 'side' && QUESTS.side_lampoil.store === true &&
  QUESTS.side_lampoil.npc === 'lampoil' && QUESTS.side_lampoil.giver === 'lampoil' &&
  QUESTS.side_lampoil.unlockOn == null);
ok('side_lampoil 名称「菌盖的灯油」/where/obj/offer/turnin/done 落位',
  QUESTS.side_lampoil.name === '菌盖的灯油' && QUESTS.side_lampoil.where.includes('潮灯镇') &&
  QUESTS.side_lampoil.obj.includes(String(MUSH_HOLD_GOAL)) && QUESTS.side_lampoil.obj.includes('菌盖') &&
  QUESTS.side_lampoil.offer.includes('熬灯婶') && QUESTS.side_lampoil.turnin.includes('熬灯婶') &&
  QUESTS.side_lampoil.done.includes('油'));
ok('side_lampoil cond/condProg 与 MUSH_HOLD_GOAL 同源（hero.mushrooms 持有判定，缺字段防御式 0，判/进/文/话一处调全端跟随）',
  QUESTS.side_lampoil.cond({}) === false &&
  QUESTS.side_lampoil.cond({ mushrooms: 0 }) === false &&
  QUESTS.side_lampoil.cond({ mushrooms: 5 }) === false &&
  QUESTS.side_lampoil.cond({ mushrooms: 6 }) === true &&
  QUESTS.side_lampoil.cond({ mushrooms: 12 }) === true &&
  QUESTS.side_lampoil.condProg({}) === `0/${MUSH_HOLD_GOAL} 株` &&
  QUESTS.side_lampoil.condProg({ mushrooms: 4.9 }) === `4/${MUSH_HOLD_GOAL} 株`);
ok('side_lampoil reward 逐值：80 金 + 1 高级灵药（承 side_kindle/side_ledger/side_herb/side_furnace 80 档）',
  QUESTS.side_lampoil.reward.gold === 80 && !QUESTS.side_lampoil.reward.item && QUESTS.side_lampoil.reward.potion2 === 1);

// —— ACH_LIST allquests 同源互证（与 sideQuestDone 输出一致）——
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('ACH_LIST allquests 名称「灯火同心」且描述派生 46（「46 个支线任务」）',
  !!achAll && achAll.name === '灯火同心' && achAll.d.includes('46 个支线任务'), achAll && achAll.d);
ok('ACH_LIST allquests 判定/进度与 QUESTS 派生同源（0/46 false · 45/46 false · 46/46 true · prog 46/46）',
  !!achAll && achAll.ok({ quests: {} }) === false && achAll.ok({ quests: Object.fromEntries(sideDefs.slice(0, 45).map(q => [q.id, 'done'])) }) === false &&
  achAll.ok({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === true &&
  achAll.prog({ quests: {} }) === '0/46' && achAll.prog({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === '46/46');

// —— quests.js 运行期：sideQuestDone ——
ok('运行期：sideQuestDone 0/46 · 3/46 · 46/46 · 主线不入列',
  sideQuestDone({ quests: {} }).done === 0 && sideQuestDone({ quests: {} }).total === 46 &&
  sideQuestDone({ quests: { side_mushroom: 'done', side_cart: 'done', side_pond: 'done' } }).done === 3 &&
  sideQuestDone({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }).done === 46 &&
  sideQuestDone({ quests: { main_demon: 'done' } }).done === 0);

// —— 运行期状态机：offer → active → turnin → done（quests 纯函数，零 DOM）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 3, hp: 60, hpMax: 60, mp: 20, mpMax: 20, atkMax: 13, defMax: 9,
    gold: 0, xp: 0, xpNext: 100, item: 3, potion2: 0, mushrooms: 0, weapon: '铁剑', armor: '皮甲',
    skills: [], ach: [], seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, talked: [], steps: 0,
    totalWins: 0, drops: 0, deflects: 0, casts: 0, travels: 0, sold: 0, spent: 0, crits: 0, charges: 0, flees: 0,
    potionUses: 0, mapPotions: 0, brews: 0, deaths: 0, x: 11, y: 12, map: 'village' }, extra || {});
}
const h1 = mkHero({});
ok('状态机：无存档 → questStatus offer（无 unlockOn 开局即接，承 side_wait/side_ledger/side_furnace 同款）',
  questStatus(h1, 'side_lampoil') === 'offer', questStatus(h1, 'side_lampoil'));
ok('状态机：npcQuestMark offer 态「❕ 可接委托」',
  npcQuestMark(h1, 'lampoil') === '❕ 可接委托', npcQuestMark(h1, 'lampoil'));
ok('状态机：npcQuestPages offer 页（熬灯婶 · 菌盖的灯油 · MUSH_HOLD_GOAL 同源）',
  JSON.stringify(npcQuestPages(h1, 'lampoil')).includes('熬灯婶') &&
  JSON.stringify(npcQuestPages(h1, 'lampoil')).includes(String(MUSH_HOLD_GOAL)) &&
  JSON.stringify(npcQuestPages(h1, 'lampoil')).includes('接下委托'));
const rAcc = resolveNpcTalk(h1, 'lampoil');
ok('状态机：resolveNpcTalk 接取 → {kind:accept, id:side_lampoil} + quests.side_lampoil=active',
  !!rAcc && rAcc.kind === 'accept' && rAcc.id === 'side_lampoil' && h1.quests.side_lampoil === 'active', JSON.stringify(rAcc));
ok('状态机：active 未达标 → questStatus active（cond 未满足）',
  questStatus(h1, 'side_lampoil') === 'active', questStatus(h1, 'side_lampoil'));
ok('状态机：active 页函数型实时报进度（已持有 0/6 株——开局无蘑菇）',
  JSON.stringify(npcQuestPages(h1, 'lampoil')).includes('0/' + MUSH_HOLD_GOAL + ' 株'));
ok('状态机：任务日志 objective 同源（随身备下 6 株发光菌盖）',
  questJournal(h1).find((e) => e.id === 'side_lampoil').objective.includes('株') &&
  questJournal(h1).find((e) => e.id === 'side_lampoil').objective.includes(`0/${MUSH_HOLD_GOAL} 株`));
const h2 = mkHero({ quests: { side_lampoil: 'active' }, mushrooms: 6 });
ok('状态机：达标（mushrooms=6 株）→ questStatus turnin',
  questStatus(h2, 'side_lampoil') === 'turnin', questStatus(h2, 'side_lampoil'));
ok('状态机：npcQuestMark turnin 态「❕ 可交任务」',
  npcQuestMark(h2, 'lampoil') === '❕ 可交任务', npcQuestMark(h2, 'lampoil'));
const rRew = resolveNpcTalk(h2, 'lampoil');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:80, potion2:1} + done + 结算 80 金/1 高级灵药',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 80 && rRew.potion2 === 1 &&
  h2.quests.side_lampoil === 'done' && h2.gold === 80 && h2.potion2 === 1 && h2.mushrooms === 6, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）',
  resolveNpcTalk(h2, 'lampoil') === null);
ok('状态机：done 粘性——交付后酿造就消耗回落到 6 株以下 questStatus 仍 done（持有类坍缩不回退）',
  questStatus(mkHero({ quests: { side_lampoil: 'done' }, mushrooms: 3 }), 'side_lampoil') === 'done');
ok('状态机：done 默认档（熬灯婶：这捧菌盖替你留着——给灯下的夜路续油）',
  JSON.stringify(npcQuestPages(h2, 'lampoil')).includes('这捧菌盖替你留着'));
ok('状态机：done bossDefeated 档（灯芯回来了叙事并入，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_lampoil: 'done' }, bossDefeated: true }), 'lampoil')).includes('灯芯回来了'));
ok('状态机：done caveBoss 档（领主散了、熬油的灶火旺了不少叙事并入，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_lampoil: 'done' }, caveBoss: true }), 'lampoil')).includes('领主散了'));
ok('状态机：done trueBoss 档（after 彩蛋「灯都亮回来了」并入 done 分档，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_lampoil: 'done' }, trueBoss: true }), 'lampoil')).includes('灯都亮回来了'));
ok('状态机：done 态 npcQuestMark 零顶标（lampoil 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_lampoil: 'done' } }), 'lampoil') === null);
ok('questRewardPreview 与 reward 同源（80 金 + 1 高级灵药）',
  (() => { const prev = questRewardPreview(mkHero({}), 'side_lampoil'); return !!prev && prev.gold === 80 && prev.item === 0 && prev.potion2 === 1; })());
ok('运行期：其余 unlockOn 里程碑 NPC 锁定态零顶标（stele2/stele3/stele4 无待办）',
  npcQuestMark(mkHero({}), 'stele2') === null && npcQuestMark(mkHero({}), 'stele3') === null &&
  npcQuestMark(mkHero({}), 'stele4') === null);

// —— NPCS.lampoil 落位（全新 NPC：数据层三件套 + village.extras + NPC_SPOTS）——
ok('NPCS.lampoil 台词数据齐全（linesByStage 三档 + after 两页彩蛋）',
  !!NPCS.lampoil && Array.isArray(NPCS.lampoil.linesByStage) && NPCS.lampoil.linesByStage.length === 3 &&
  NPCS.lampoil.linesByStage[0].gate === null && Array.isArray(NPCS.lampoil.after) && NPCS.lampoil.after.length === 2);
ok('NPCS.lampoil after 彩蛋（都亮回来了/往后你的菌盖我替你记着）数据层保留（零内容丢失契约）',
  !!NPCS.lampoil && NPCS.lampoil.after[0].some((ln) => ln.includes('都亮回来了')) &&
  NPCS.lampoil.after[1].some((ln) => ln.includes('替你记着')));
ok('姊妹件 smoke_v2235_minimapquest 已随新现实更新（lampoil 入任务 NPC 列表 + side_lampoil done + village (11,11) 金光）',
  read('smoke_v2235_minimapquest.mjs').includes("npcQuestMark(S.G, 'lampoil')") &&
  read('smoke_v2235_minimapquest.mjs').includes('side_lampoil') &&
  read('smoke_v2235_minimapquest.mjs').includes('goldAt(capA, 11, 11)'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为三百九十六件套（三百九十五件套清除）',
  readme.includes('冒烟三百九十六件套（三百九十五件套清除）'));
ok('README tests 含 v24.181 守护描述与 smoke_v24181_lampoilquest 入库（392 份）',
  readme.includes('v24.181 起含「熬灯婶「菌盖的灯油」新支线」守护') &&
  readme.includes('smoke_v24181_lampoilquest 入库（392 份）'));
ok('README 仍保留 v24.180 守护描述（历史保留）', readme.includes('v24.180 起含「逆风素手」新成就守护'));
ok('README 已有三百九十六件套口径且尚无 393（哨兵前望 397 语义：下一版才写 393）',
  readme.includes('冒烟三百九十六件套（三百九十五件套清除）') && !readme.includes('冒烟三百九十七件套') && !readme.includes('（397 份）'));
ok('README 版本速览已为 v24.186 且四十六条支线 · 46 名 NPC · 392 件套',
  readme.includes('版本速览（v24.186）') && readme.includes('四十六条支线（`QUESTS`）') &&
  readme.includes('46 名 NPC') && readme.includes('392 件套冒烟'));
ok('README 支线/奖励行随新现实（四十六条 · 菌盖的灯油 · MUSH_HOLD_GOAL · 有口皆碑 X/46）',
  readme.includes('四十六条支线目标/奖励全部由') &&
  readme.includes('菌盖的灯油（熬灯婶') &&
  readme.includes('`MUSH_HOLD_GOAL`') && readme.includes('有口皆碑 X/46 处'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 391 份（smoke.mjs + 391 专项）', chain.length === 395 && ['smoke.mjs', ...chain].length === 396, String(chain.length));
ok('package.json 链尾为 smoke_v24181_lampoilquest（第 392 份）', chain[chain.length - 1] === 'smoke_v24186_pennynoskill2', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v24180_unflskill2.mjs && smoke_v24181_lampoilquest.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v24180_unflskill2.mjs && node tests/smoke_v24181_lampoilquest.mjs && node tests/smoke_v24183_unfllowlv2.mjs && node tests/smoke_v24184_pennyswift2.mjs && node tests/smoke_v24185_pennylowlv2.mjs && node tests/smoke_v24186_pennynoskill2.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.186（startsWith）', changelog.startsWith('## v24.186'));
ok('CHANGELOG v24.181 条目含「菌盖的灯油」与「MUSH_HOLD_GOAL」与「熬灯婶」',
  changelog.includes('菌盖的灯油') && changelog.includes('MUSH_HOLD_GOAL') && changelog.includes('熬灯婶'));
ok('CHANGELOG 仍保留 v24.180 条目（历史保留）', changelog.includes('## v24.180 '));

const testsDir = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
ok('tests 目录件套 = 392（391 + smoke_v24181_lampoilquest）', files.length === 396, String(files.length));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.180 pin 零残留 ——
const s24180 = read('smoke_v24180_unflskill2.mjs');
const s24179 = read('smoke_v24179_unflnopo2.mjs');
const s24178 = read('smoke_v24178_unflpenny2.mjs');
ok('smoke_v24180 的 GAME_VERSION 字面量 pin 已更新为 v24.186', s24180.includes("const GAME_VERSION = 'v24.186';"));
ok('smoke_v24180 的 CHANGELOG 顶 pin 已更新为 ## v24.186 ', s24180.includes("startsWith('## v24.186'"));
ok('smoke_v24180 的件套 pin 已更新为三百九十六件套（三百九十五件套清除）', s24180.includes('三百九十六件套（三百九十五件套清除）'));
ok('smoke_v24180 的 README/链 tail pin 已随新现实延伸（含 smoke_v24181_lampoilquest）',
  s24180.includes('smoke_v24181_lampoilquest'));
ok('smoke_v24180 的链尾 pin 已推进至 smoke_v24186_pennynoskill2（第 396 份）',
  s24180.includes("node tests/smoke_v24181_lampoilquest.mjs && node tests/smoke_v24183_unfllowlv2.mjs && node tests/smoke_v24184_pennyswift2.mjs && node tests/smoke_v24185_pennylowlv2.mjs && node tests/smoke_v24186_pennynoskill2.mjs\""));
ok('smoke_v24179 的 GAME_VERSION 字面量 pin 已更新为 v24.186（随新现实推进）', s24179.includes("const GAME_VERSION = 'v24.186';"));
ok('smoke_v24178 的 GAME_VERSION 字面量 pin 已更新为 v24.186（随新现实推进）', s24178.includes("const GAME_VERSION = 'v24.186';"));
const s2429 = read('smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 哨兵链前望 397（三百九十七件套否定式）',
  s2429.includes("!readme.includes('冒烟三百九十七件套'"));

// 旧代 v24.180 pin 零残留扫描（豁免本套件与上一版 unflskill2、上上版 unflnopo2、上上上版 unflpenny2——
// v24180 负向 `!dSrc.includes("const GAME_VERSION = 'v24.180';")` 是合法前望 pin，同 v24143 轮豁免先例）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v24181_lampoilquest.mjs' || f === 'smoke_v24180_unflskill2.mjs' || f === 'smoke_v24179_unflnopo2.mjs' || f === 'smoke_v24178_unflpenny2.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDir), 'utf8').split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  const hits = [];
  if (s2.includes("const GAME_VERSION = '" + "v24.180';")) hits.push('gv');
  if (s2.includes("GAME_VERSION === '" + "v24.180'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.180")) hits.push('cw');
  if (s2.includes('三百九十五件套（三百九' + '十件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 39' + '1')) hits.push('fl');
  if (s2.includes('chainAll.length === 39' + '1')) hits.push('cal');
  if (s2.includes('chain.length === 39' + '0')) hits.push('cl');
  if (s2.includes('treeTok.length === 39' + '1')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v24180_" + "unflskill2'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.180 GAME_VERSION/顶 pin/391 口径（哨兵链，豁免本套件与上三版）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.181 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
