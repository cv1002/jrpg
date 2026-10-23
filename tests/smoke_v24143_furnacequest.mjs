// smoke_v24143_furnacequest.mjs —— v24.143 专项冒烟：第四十五条支线「灵药照炉」（守炉翁·持有高级灵药
// FURNACE_GOAL(2) 瓶）
// （新内容·新支线——承 v24.136 采药翁「药囊常满」/ v24.135 账房先生「灯油的账」同一「全新 NPC + 持有类计数
// 支线」先例系列的第三例：星井矿脉东北内室 (21,5) 新增「守炉翁」（NPC_SPOTS '21,5' · cave.extras (21,5)，
// 坐标为可行走 '0' 格且未被他图占用，四邻皆可行走可面对面对话）——守着矿道深处那口老丹炉的老守炉人：
// 星砂入炉、炼出灯下人最后那口猛药，「丹炉的火，是和灯芯一样不能熄的东西」（与守墓人守冢/打更人守夜/
// 守火翁守火/账房先生守账/采药翁守药囊同脉，守着灯下人的丹炉）；玩家手里每多一瓶高级灵药，都算替他
// 把炉口的火续上一把——替他持有 FURNACE_GOAL(2) 瓶（计数口径 hero.potion2 复用既有字段——core.brewNow
// 酿造/支线奖励/战斗掉落写定、喝药扣减，随 snapshotHero 自动持久化、防御式 (g.potion2||0) 旧档零迁移，
// 与 ACH_LIST elixir「灵药盈囊」同读一份源、支线门槛 2 低于成就门槛 ELIXIR_STOCK_GOAL(3) 顺路先完成支线
// 再解锁成就——持有类 cond 状态判定、交付后 done 粘性不受消耗回落影响；交付奖励 80 金 + 1 高级灵药、
// 交付后持有 3 瓶恰过成就门槛当场顺路解锁），80 金 + 1 高级灵药；无 unlockOn 开局即 offer、active 页
// 函数型实时报进度、done 页 trueBoss/caveBoss/bossDefeated 三档分档，零新计数零新状态零新存档）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.143 注释 / GAME_VERSION v24.143 与旧 v24.142 字面量零
// 残留 / v24.136 采药翁及更早历史注释保留 / FURNACE_GOAL 常量与 export）、QUESTS 契约（45 side +
// 4 main、side_furnace 字段逐值、与 ELIXIR_STOCK_GOAL 同源、ACH_LIST allquests 同源互证、FURNACE_GOAL
// 低于 elixir 成就门槛互证）、quests.js 运行期状态机（offer→active→turnin→done 全链路 + resolveNpcTalk
// 接取/交付结算 80 金+1 高级灵药 + npcQuestMark/npcQuestPages 四态 + sideQuestDone 0/45 +
// done 三档 trueBoss/caveBoss/bossDefeated 消耗回落后 done 粘性）、NPCS.furnace 落位（守炉翁
// mark kettle + cave.extras/NPC_SPOTS '21,5' 全局坐标 + 姊妹件 minimap 随新现实更新）、
// README/package.json/CHANGELOG 同步（件套口径 360 + v24.143 守护描述 + 入库 360 + package 串尾 +
// CHANGELOG 顶 pin）、tests 目录与实跑链恒等（360）、哨兵链（前望 362 且 README 尚无 362 口径）、
// 旧代 v24.142 pin 全库零残留扫描（字面量/顶 pin/359 口径 · 豁免本套件与上一版 v24136_herbquest 与
// 上上版 v24135_ledgerquest 与上上上版 v24134_kindleq）。
import { GAME_VERSION, QUESTS, FURNACE_GOAL, ELIXIR_STOCK_GOAL, ACH_LIST, NPCS, NPC_SPOTS, MAPS } from '../js/data.js';
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

console.log('— v24.143 守炉翁「灵药照炉」新支线 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkgRaw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（格式合法 + 已越过 v24.146 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.146', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 146)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.143（旧 v24.142 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.147';") && !dSrc.includes("const GAME_VERSION = 'v24.142';"));
ok('data.js 含 v24.143 注释（灵药照炉新支线说明）',
  dSrc.includes('v24.143 新内容·新支线（第四十五条）'));
ok('data.js 仍保留 v24.142 文档复核历史注释（零内容丢失）',
  dSrc.includes('v24.142 文档整理·版本锚点推进'));

// —— 源级落位：FURNACE_GOAL 常量 + export + NPC/坐标 ——
ok('data.js FURNACE_GOAL 常量 = 2（与 MEDKIT_GOAL 比邻声明，同一持有类家族）',
  dSrc.includes('const FURNACE_GOAL = 2;') && dSrc.indexOf('const FURNACE_GOAL') > dSrc.indexOf('const MEDKIT_GOAL'));
ok('data.js export 块含 FURNACE_GOAL（MEDKIT_GOAL 之后紧邻）',
  dSrc.includes('INN_GOAL, LEDGER_GOAL, MEDKIT_GOAL, FURNACE_GOAL,'));
ok('FURNACE_GOAL 与 elixir 成就门槛同族互证（2 < ELIXIR_STOCK_GOAL 3——顺路先完成支线再解锁成就）',
  (() => { const aCh = ACH_LIST.find((a) => a.id === 'elixir');
    return !!aCh && FURNACE_GOAL === 2 && ELIXIR_STOCK_GOAL === 3 &&
      aCh.ok({ potion2: 1 }) === false && aCh.ok({ potion2: 2 }) === false &&
      aCh.ok({ potion2: 3 }) === true && aCh.prog({ potion2: 1 }) === '1/3' &&
      FURNACE_GOAL < ELIXIR_STOCK_GOAL; })());
ok('data.js NPCS.furnace 存在（守炉翁 · mark kettle 复用既有炉标 · 零视觉新代码）',
  !!NPCS.furnace && NPCS.furnace.name === '守炉翁' && NPCS.furnace.mark === 'kettle');
ok('data.js NPC_SPOTS 含守炉翁据点 (21,5)，全局坐标键未被他图占用',
  NPC_SPOTS['21,5'] === 'furnace');
ok('data.js cave.extras 含 (21,5) NPC 项（全局唯一点位，不与既有键冲突）',
  dSrc.includes("{ x: 21, y: 5, ty: 'NPC' }") &&
  MAPS.cave.extras.some((e) => e.x === 21 && e.y === 5 && e.ty === 'NPC'));

// —— QUESTS 契约：45 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 49 条（45 side + 4 main，派生计数）',
  sideDefs.length === 45 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 49,
  `${sideDefs.length}/${mainDefs.length}`);
ok('side_furnace 存在且为第四十五条（kind side · store · npc/giver furnace · 无 unlockOn）',
  !!QUESTS.side_furnace && QUESTS.side_furnace.kind === 'side' && QUESTS.side_furnace.store === true &&
  QUESTS.side_furnace.npc === 'furnace' && QUESTS.side_furnace.giver === 'furnace' &&
  QUESTS.side_furnace.unlockOn == null);
ok('side_furnace 名称「灵药照炉」/where/obj/offer/turnin/done 落位',
  QUESTS.side_furnace.name === '灵药照炉' && QUESTS.side_furnace.where.includes('星井矿脉') &&
  QUESTS.side_furnace.obj.includes(String(FURNACE_GOAL)) && QUESTS.side_furnace.obj.includes('高级灵药') &&
  QUESTS.side_furnace.offer.includes('守炉翁') && QUESTS.side_furnace.turnin.includes('守炉翁') &&
  QUESTS.side_furnace.done.includes('药'));
ok('side_furnace cond/condProg 与 FURNACE_GOAL 同源（hero.potion2 持有判定，缺字段防御式 0，判/进/文/话一处调全端跟随）',
  QUESTS.side_furnace.cond({}) === false &&
  QUESTS.side_furnace.cond({ potion2: 0 }) === false &&
  QUESTS.side_furnace.cond({ potion2: 1 }) === false &&
  QUESTS.side_furnace.cond({ potion2: 2 }) === true &&
  QUESTS.side_furnace.cond({ potion2: 5 }) === true &&
  QUESTS.side_furnace.condProg({}) === `0/${FURNACE_GOAL} 瓶` &&
  QUESTS.side_furnace.condProg({ potion2: 1.9 }) === `1/${FURNACE_GOAL} 瓶`);
ok('side_furnace reward 逐值：80 金 + 1 高级灵药（承 side_kindle/side_bell/side_watch/side_ledger/side_herb 80 档）',
  QUESTS.side_furnace.reward.gold === 80 && !QUESTS.side_furnace.reward.item && QUESTS.side_furnace.reward.potion2 === 1);

// —— ACH_LIST allquests 同源互证（与 sideQuestDone 输出一致）——
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('ACH_LIST allquests 名称「灯火同心」且描述派生 45（「45 个支线任务」）',
  !!achAll && achAll.name === '灯火同心' && achAll.d.includes('45 个支线任务'), achAll && achAll.d);
ok('ACH_LIST allquests 判定/进度与 QUESTS 派生同源（0/45 false · 44/45 false · 45/45 true · prog 45/45）',
  !!achAll && achAll.ok({ quests: {} }) === false && achAll.ok({ quests: Object.fromEntries(sideDefs.slice(0, 44).map(q => [q.id, 'done'])) }) === false &&
  achAll.ok({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === true &&
  achAll.prog({ quests: {} }) === '0/45' && achAll.prog({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === '45/45');

// —— quests.js 运行期：sideQuestDone ——
ok('运行期：sideQuestDone 0/45 · 3/45 · 45/45 · 主线不入列',
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
    potionUses: 0, mapPotions: 0, brews: 0, deaths: 0, x: 21, y: 6, map: 'cave' }, extra || {});
}
const h1 = mkHero({});
ok('状态机：无存档 → questStatus offer（无 unlockOn 首次到访星井矿脉即接，承 side_wait/side_ledger/side_herb 同款）',
  questStatus(h1, 'side_furnace') === 'offer', questStatus(h1, 'side_furnace'));
ok('状态机：npcQuestMark offer 态「❕ 可接委托」',
  npcQuestMark(h1, 'furnace') === '❕ 可接委托', npcQuestMark(h1, 'furnace'));
ok('状态机：npcQuestPages offer 页（守炉翁 · 灵药照炉 · FURNACE_GOAL 同源）',
  JSON.stringify(npcQuestPages(h1, 'furnace')).includes('守炉翁') &&
  JSON.stringify(npcQuestPages(h1, 'furnace')).includes(String(FURNACE_GOAL)) &&
  JSON.stringify(npcQuestPages(h1, 'furnace')).includes('接下委托'));
const rAcc = resolveNpcTalk(h1, 'furnace');
ok('状态机：resolveNpcTalk 接取 → {kind:accept, id:side_furnace} + quests.side_furnace=active',
  !!rAcc && rAcc.kind === 'accept' && rAcc.id === 'side_furnace' && h1.quests.side_furnace === 'active', JSON.stringify(rAcc));
ok('状态机：active 未达标 → questStatus active（cond 未满足）',
  questStatus(h1, 'side_furnace') === 'active', questStatus(h1, 'side_furnace'));
ok('状态机：active 页函数型实时报进度（已持有 0/2 瓶——开局无高级灵药）',
  JSON.stringify(npcQuestPages(h1, 'furnace')).includes('0/' + FURNACE_GOAL + ' 瓶'));
ok('状态机：任务日志 objective 同源（随身备好 2 瓶高级灵药 0/2 瓶）',
  questJournal(h1).find((e) => e.id === 'side_furnace').objective.includes('瓶') &&
  questJournal(h1).find((e) => e.id === 'side_furnace').objective.includes(`0/${FURNACE_GOAL} 瓶`));
const h2 = mkHero({ quests: { side_furnace: 'active' }, potion2: 2 });
ok('状态机：达标（potion2=2 瓶）→ questStatus turnin',
  questStatus(h2, 'side_furnace') === 'turnin', questStatus(h2, 'side_furnace'));
ok('状态机：npcQuestMark turnin 态「❕ 可交任务」',
  npcQuestMark(h2, 'furnace') === '❕ 可交任务', npcQuestMark(h2, 'furnace'));
const rRew = resolveNpcTalk(h2, 'furnace');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:80, potion2:1} + done + 结算 80 金/1 高级灵药（持有 2 保住 + 80，交付后 3 瓶恰过成就门槛）',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 80 && rRew.potion2 === 1 &&
  h2.quests.side_furnace === 'done' && h2.gold === 80 && h2.potion2 === 3 && h2.item === 3, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）',
  resolveNpcTalk(h2, 'furnace') === null);
ok('状态机：done 粘性——交付后消耗回落到 2 以下 questStatus 仍 done（持有类坍缩不回退）',
  questStatus(mkHero({ quests: { side_furnace: 'done' }, potion2: 1 }), 'side_furnace') === 'done');
ok('状态机：done 默认档（守炉翁：这瓶药替你留着——给灯下的夜路续火）',
  JSON.stringify(npcQuestPages(h2, 'furnace')).includes('这瓶药替你留着'));
ok('状态机：done bossDefeated 档（灯芯回来了叙事并入，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_furnace: 'done' }, bossDefeated: true }), 'furnace')).includes('灯芯回来了'));
ok('状态机：done caveBoss 档（领主散了、炉子添了新火叙事并入，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_furnace: 'done' }, caveBoss: true }), 'furnace')).includes('领主散了'));
ok('状态机：done trueBoss 档（after 彩蛋「灯都亮回来了」并入 done 分档，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_furnace: 'done' }, trueBoss: true }), 'furnace')).includes('灯都亮回来了'));
ok('状态机：done 态 npcQuestMark 零顶标（furnace 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_furnace: 'done' } }), 'furnace') === null);
ok('questRewardPreview 与 reward 同源（80 金 + 1 高级灵药）',
  (() => { const prev = questRewardPreview(mkHero({}), 'side_furnace'); return !!prev && prev.gold === 80 && prev.item === 0 && prev.potion2 === 1; })());
ok('运行期：其余 unlockOn 里程碑 NPC 锁定态零顶标（stele2/stele3/stele4 无待办）',
  npcQuestMark(mkHero({}), 'stele2') === null && npcQuestMark(mkHero({}), 'stele3') === null &&
  npcQuestMark(mkHero({}), 'stele4') === null);

// —— NPCS.furnace 落位（全新 NPC：数据层三件套 + cave.extras + NPC_SPOTS）——
ok('NPCS.furnace 台词数据齐全（linesByStage 三档 + after 两页彩蛋）',
  !!NPCS.furnace && Array.isArray(NPCS.furnace.linesByStage) && NPCS.furnace.linesByStage.length === 3 &&
  NPCS.furnace.linesByStage[0].gate === null && Array.isArray(NPCS.furnace.after) && NPCS.furnace.after.length === 2);
ok('NPCS.furnace after 彩蛋（都亮回来了/往后你的灵药我替你记着）数据层保留（零内容丢失契约）',
  !!NPCS.furnace && NPCS.furnace.after[0].some((ln) => ln.includes('都亮回来了')) &&
  NPCS.furnace.after[1].some((ln) => ln.includes('替你记着')));
ok('姊妹件 smoke_v2235_minimapquest 已随新现实更新（furnace 入任务 NPC 列表 + side_furnace done + cave (21,5) 金光）',
  read('smoke_v2235_minimapquest.mjs').includes("npcQuestMark(S.G, 'furnace')") &&
  read('smoke_v2235_minimapquest.mjs').includes('side_furnace') &&
  read('smoke_v2235_minimapquest.mjs').includes('goldAt(capC, 21, 5)'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为三百六十一件套（三百六十件套清除）',
  readme.includes('冒烟三百六十一件套（三百六十件套清除）'));
ok('README tests 含 v24.143 守护描述与 smoke_v24143_furnacequest 入库（360 份）',
  readme.includes('v24.143 起含「守炉翁「灵药照炉」新支线」守护') &&
  readme.includes('smoke_v24143_furnacequest 入库（360 份）'));
ok('README 仍保留 v24.136 采药翁守护描述（历史保留）', readme.includes('v24.136 起含「采药翁「药囊常满」新支线」守护'));
ok('README 已有三百六十一件套口径且尚无 362（哨兵前望 362 语义：下一版才写 362）',
  readme.includes('冒烟三百六十一件套（三百六十件套清除）') && !readme.includes('冒烟三百六十二件套') && !readme.includes('（362 份）'));
ok('README tests 树串尾已延伸（…+ smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑））',
  readme.includes('smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑）'));
ok('README 支线/奖励行随新现实（四十五条 · 灵药照炉 · FURNACE_GOAL）',
  readme.includes('四十五条支线目标/奖励全部由') &&
  readme.includes('`STELE_GOAL` `FALLEN_GOAL` `INN_GOAL` `KINDLE_GOAL` `LEDGER_GOAL` `MEDKIT_GOAL` `FURNACE_GOAL` |') &&
  readme.includes('v24.143 补第四十五条') && readme.includes('v24.136 补第四十四条'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 359 份（smoke.mjs + 359 专项）', chain.length === 360 && ['smoke.mjs', ...chain].length === 361, String(chain.length));
ok('package.json 链尾为 smoke_v24143_furnacequest（第 361 份）', chain[chain.length - 1] === 'smoke_v24147_unflicker', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v24136_herbquest.mjs && smoke_v24143_furnacequest.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v24136_herbquest.mjs && node tests/smoke_v24143_furnacequest.mjs && node tests/smoke_v24147_unflicker.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.143（startsWith）', changelog.startsWith('## v24.147'));
ok('CHANGELOG v24.143 条目含「灵药照炉」与「FURNACE_GOAL」与「守炉翁」',
  changelog.includes('灵药照炉') && changelog.includes('FURNACE_GOAL') && changelog.includes('守炉翁'));
ok('CHANGELOG 仍保留 v24.136 条目（历史保留）', changelog.includes('## v24.136 '));

const testsDir = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
ok('tests 目录件套 = 360（359 + smoke_v24143_furnacequest）', files.length === 361, String(files.length));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.142 pin 零残留 ——
const s24136 = read('smoke_v24136_herbquest.mjs');
const s24135 = read('smoke_v24135_ledgerquest.mjs');
const s24134 = read('smoke_v24134_kindleq.mjs');
const s2415 = read('smoke_v2415_treepin.mjs');
ok('smoke_v24136 的 GAME_VERSION 字面量 pin 已更新为 v24.143', s24136.includes("const GAME_VERSION = 'v24.147';"));
ok('smoke_v24136 的 CHANGELOG 顶 pin 已更新为 ## v24.143 ', s24136.includes("startsWith('## v24.147'"));
ok('smoke_v24136 的件套 pin 已更新为三百六十一件套（三百六十件套清除）', s24136.includes('三百六十一件套（三百六十件套清除）'));
ok('smoke_v24136 的 README/链 tail pin 已随新现实延伸（含 smoke_v24143_furnacequest）',
  s24136.includes('smoke_v24143_furnacequest'));
ok('smoke_v24136 的链尾 pin 已推进至 smoke_v24143_furnacequest（第 361 份）', s24136.includes("=== 'smoke_v24147_unflicker'"));
ok('smoke_v24135 的 README/链 tail pin 已随新现实延伸（含 smoke_v24136_herbquest + smoke_v24143_furnacequest）',
  s24135.includes('smoke_v24143_furnacequest') && s24135.includes('smoke_v24136_herbquest'));
const s2436 = read('smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（359 专项 / 360）且尚无 362 口径哨兵',
  s2436.includes('suiteFiles.length === 360 && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length === 361') &&
  s2436.includes('!readme.includes(\'冒烟三百六十二件套\')') && s2436.includes('!readme.includes(\'（362 份）\')'));
const s2429 = read('smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 哨兵链前望 362（三百六十二件套否定式）',
  s2429.includes("!readme.includes('冒烟三百六十二件套'"));

// 旧代 v24.142 pin 零残留扫描（豁免本套件与上一版 herbquest、上上版 ledgerquest、上上上版 kindleq、
// 上上上上版 inquest——v24133 负向 `!dSrc.includes("const GAME_VERSION = 'v24.142';")` 是合法前望 pin，
// 同 v24136 轮豁免 inquest 先例）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v24143_furnacequest.mjs' || f === 'smoke_v24136_herbquest.mjs' || f === 'smoke_v24135_ledgerquest.mjs' || f === 'smoke_v24134_kindleq.mjs' || f === 'smoke_v24133_inquest.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDir), 'utf8').split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  const hits = [];
  if (s2.includes("const GAME_VERSION = '" + "v24.142';")) hits.push('gv');
  if (s2.includes("GAME_VERSION === '" + "v24.142'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.142")) hits.push('cw');
  if (s2.includes('三百五十九件套（三百五' + '十八件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 35' + '9')) hits.push('fl');
  if (s2.includes('chainAll.length === 35' + '9')) hits.push('cal');
  if (s2.includes('chain.length === 35' + '8')) hits.push('cl');
  if (s2.includes('treeTok.length === 35' + '9')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v24136_" + "herbquest'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.142 GAME_VERSION/顶 pin/359 口径（哨兵链，豁免本套件与上三版）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.143 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
