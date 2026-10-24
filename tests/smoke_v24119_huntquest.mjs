// smoke_v24119_huntquest.mjs —— v24.119 专项冒烟：第三十一条支线「数到灯亮」（守洞人·累计讨伐
// HUNT_TALLY_GOAL(6) 只魔物）
// （新内容·新支线——承 v24.105 琴师「战歌的谱」/ v24.106 放灯童「月亮的路」/ v24.107 货郎「路远灯长」/
// v24.108 货栈掌柜「开张的生意」/ v24.109 刻碑人「一凿入石」/ v24.110 记誓人「蓄石为誓」/ v24.111 听矿人
// 「岩缝里的名字」/ v24.112 镇民「灯下之声」/ v24.113 掌灯童「一步一灯」/ v24.114 老矿工「先撤为敬」/
// v24.116 引灯人「药要带足」/ v24.118 井巫「渴不忘井」同一「风味 NPC 升格为支线委托人」先例：v22.92
// 纯风味 NPC「守洞人」（星井矿脉洞窟领主祭坛正北 (20,7)，「它霸着矿脉，也霸着那车没运走的星砂——
// 镇上的灯，就缺这一车」）升格为委托人——他守着洞口守了一辈子、只守不战，魔物从雾里来，他就替镇子
// 的灯一笔一笔记着缺的那笔账，玩家每讨伐一只魔物都算替他清一笔，清到 HUNT_TALLY_GOAL(6) 只（计数
// hero.totalWins 与 ACH_LIST hunt10「驱雾十战」同读一份源，支线门槛 6 低于成就门槛 HUNT_GOAL(10)——
// 顺路先完成支线再解锁成就；js/battle.js winBattle 胜利结算唯一写入点、随 snapshotHero 全量快照自动
// 持久化、防御式 (g.totalWins||0) 旧档零迁移、精英/Boss/试炼所有胜利都算、只有胜利才落账；零新计数
// 零新状态零新存档）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.119 注释 / GAME_VERSION v24.119 与旧 v24.118 字面量零残留 /
// v24.118 及更早历史注释保留 / HUNT_TALLY_GOAL 常量与 export）、QUESTS 契约（31 side + 4 main、
// side_hunt 字段逐值、与 HUNT_GOAL 同源、ACH_LIST allquests 同源互证、HUNT_TALLY_GOAL 低于 hunt10
// 成就门槛互证）、quests.js 运行期状态机（offer→active→turnin→done 全链路 + resolveNpcTalk 接取/交付
// 结算 60 金+2 生命药水 + npcQuestMark/npcQuestPages 四态 + sideQuestDone 0/31·3/31·31/31 + done 三档
// trueBoss/caveBoss/bossDefeated）、NPCS.cavewatch 升格落位（lines 两页与 after 两页保留零内容丢失
// 契约 + 姊妹件套已随升格更新）、README/package.json/CHANGELOG 同步（件套口径 342 + v24.119 守护描述 +
// 入库 342 + package 串尾 + CHANGELOG 顶 pin）、tests 目录与实跑链恒等（342）、哨兵链（前望 343 且
// README 尚无 343 口径）、旧代 v24.118 pin 全库零残留扫描（字面量/顶 pin/341 口径 · 豁免本套件）。
import { GAME_VERSION, QUESTS, HUNT_TALLY_GOAL, HUNT_GOAL, ACH_LIST, NPCS, NPC_SPOTS } from '../js/data.js';
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

console.log('— v24.119 守洞人「数到灯亮」新支线 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkgRaw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（格式合法 + 已越过 v24.118 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.118', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 118)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.119（旧 v24.118 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.155';") && !dSrc.includes("const GAME_VERSION = 'v24.118';"));
ok('data.js 含 v24.119 注释（数到灯亮新支线说明）',
  dSrc.includes('v24.119 新内容·新支线（第三十一条）'));
ok('data.js 仍保留 v24.118 历史注释（井巫「渴不忘井」说明，零内容丢失）',
  dSrc.includes('v24.118 新内容·新支线（第三十条）'));

// —— 源级落位：HUNT_TALLY_GOAL 常量 + export ——
ok('data.js HUNT_TALLY_GOAL 常量 = 6（与 WELL_GOAL 比邻声明，同一家族）',
  dSrc.includes('const HUNT_TALLY_GOAL = 6;') && dSrc.indexOf('const HUNT_TALLY_GOAL') > dSrc.indexOf('const WELL_GOAL'));
ok('data.js export 块含 HUNT_TALLY_GOAL（WELL_GOAL 之后紧邻）',
  dSrc.includes('WELL_GOAL, HUNT_TALLY_GOAL,'));
ok('HUNT_TALLY_GOAL 与 hunt10 成就门槛同族互证（6 < HUNT_GOAL 10——顺路先完成支线再解锁成就）',
  (() => { const aP = ACH_LIST.find((a) => a.id === 'hunt10');
    return !!aP && HUNT_TALLY_GOAL === 6 && HUNT_GOAL === 10 &&
      aP.ok({ totalWins: 9 }) === false &&
      aP.ok({ totalWins: 10 }) === true &&
      aP.prog({ totalWins: 3 }) === '3/10' &&
      HUNT_TALLY_GOAL < HUNT_GOAL; })());
ok('data.js NPC_SPOTS 源级仍含守洞人据点 (20,7)（零新坐标）',
  dSrc.includes("'20,7': 'cavewatch'"));

// —— QUESTS 契约：31 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 35 条（31 side + 4 main，派生计数）',
  sideDefs.length === 45 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 49,
  `${sideDefs.length}/${mainDefs.length}`);
ok('side_hunt 存在且为第三十一条（kind side · store · npc/giver cavewatch · 无 unlockOn）',
  !!QUESTS.side_hunt && QUESTS.side_hunt.kind === 'side' && QUESTS.side_hunt.store === true &&
  QUESTS.side_hunt.npc === 'cavewatch' && QUESTS.side_hunt.giver === 'cavewatch' &&
  QUESTS.side_hunt.unlockOn == null);
ok('side_hunt 名称「数到灯亮」/where/obj/offer/turnin/done 落位',
  QUESTS.side_hunt.name === '数到灯亮' && QUESTS.side_hunt.where.includes('星井矿脉') &&
  QUESTS.side_hunt.obj.includes(String(HUNT_TALLY_GOAL)) && QUESTS.side_hunt.obj.includes('讨伐') &&
  QUESTS.side_hunt.offer.includes('守洞人') && QUESTS.side_hunt.turnin.includes('守洞人') &&
  QUESTS.side_hunt.done.includes('灯'));
ok('side_hunt cond/condProg 与 HUNT_TALLY_GOAL 同源（totalWins 计数，判/进/文/话一处调全端跟随）',
  QUESTS.side_hunt.cond({ totalWins: 5 }) === false &&
  QUESTS.side_hunt.cond({ totalWins: 6 }) === true &&
  QUESTS.side_hunt.cond({}) === false && QUESTS.side_hunt.cond({ totalWins: 0 }) === false &&
  QUESTS.side_hunt.condProg({}) === `0/${HUNT_TALLY_GOAL} 只` &&
  QUESTS.side_hunt.condProg({ totalWins: 3 }) === `3/${HUNT_TALLY_GOAL} 只`);
ok('side_hunt reward 逐值：60 金 + 2 生命药水（承 side_flee 60 档）',
  QUESTS.side_hunt.reward.gold === 60 && QUESTS.side_hunt.reward.item === 2 && !QUESTS.side_hunt.reward.potion2);

// —— ACH_LIST allquests 同源互证（与 sideQuestDone 输出一致）——
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('ACH_LIST allquests 名称「灯火同心」且描述派生 31（「33 个支线任务」）',
  !!achAll && achAll.name === '灯火同心' && achAll.d.includes('45 个支线任务'), achAll && achAll.d);
ok('ACH_LIST allquests 判定/进度与 QUESTS 派生同源（0/33 false · 32/33 false · 33/33 true · prog 33/33）',
  !!achAll && achAll.ok({ quests: {} }) === false && achAll.ok({ quests: Object.fromEntries(sideDefs.slice(0, 30).map(q => [q.id, 'done'])) }) === false &&
  achAll.ok({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === true &&
  achAll.prog({ quests: {} }) === '0/45' && achAll.prog({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === '45/45');

// —— quests.js 运行期：sideQuestDone ——
ok('运行期：sideQuestDone 0/33 · 3/33 · 33/33 · 主线不入列',
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
    potionUses: 0, mapPotions: 0, x: 20, y: 7, map: 'cave' }, extra || {});
}
const h1 = mkHero({});
ok('状态机：无存档 → questStatus offer（无 unlockOn 开局即接，承 side_flee/side_hearer 同款）',
  questStatus(h1, 'side_hunt') === 'offer', questStatus(h1, 'side_hunt'));
ok('状态机：npcQuestMark offer 态「❕ 可接委托」',
  npcQuestMark(h1, 'cavewatch') === '❕ 可接委托', npcQuestMark(h1, 'cavewatch'));
ok('状态机：npcQuestPages offer 页（守洞人 · 数到灯亮 · HUNT_TALLY_GOAL 同源）',
  JSON.stringify(npcQuestPages(h1, 'cavewatch')).includes('守洞人') &&
  JSON.stringify(npcQuestPages(h1, 'cavewatch')).includes(String(HUNT_TALLY_GOAL)) &&
  JSON.stringify(npcQuestPages(h1, 'cavewatch')).includes('接下委托'));
const rAcc = resolveNpcTalk(h1, 'cavewatch');
ok('状态机：resolveNpcTalk 接取 → {kind:accept, id:side_hunt} + quests.side_hunt=active',
  !!rAcc && rAcc.kind === 'accept' && rAcc.id === 'side_hunt' && h1.quests.side_hunt === 'active', JSON.stringify(rAcc));
ok('状态机：active 未达标 → questStatus active（cond 未满足）',
  questStatus(h1, 'side_hunt') === 'active', questStatus(h1, 'side_hunt'));
ok('状态机：active 页函数型实时报进度（已累计讨伐 0/6 只）',
  JSON.stringify(npcQuestPages(h1, 'cavewatch')).includes('0/' + HUNT_TALLY_GOAL + ' 只'));
ok('状态机：任务日志 objective 同源（累计讨伐 6 只魔物 0/6 只）',
  questJournal(h1).find((e) => e.id === 'side_hunt').objective.includes('讨伐') &&
  questJournal(h1).find((e) => e.id === 'side_hunt').objective.includes(`0/${HUNT_TALLY_GOAL} 只`));
const h2 = mkHero({ quests: { side_hunt: 'active' }, totalWins: 6 });
ok('状态机：达标（totalWins=6 只）→ questStatus turnin',
  questStatus(h2, 'side_hunt') === 'turnin', questStatus(h2, 'side_hunt'));
ok('状态机：npcQuestMark turnin 态「❕ 可交任务」',
  npcQuestMark(h2, 'cavewatch') === '❕ 可交任务', npcQuestMark(h2, 'cavewatch'));
const rRew = resolveNpcTalk(h2, 'cavewatch');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:60, item:2} + done + 结算 60 金/2 生命药水',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 60 && rRew.item === 2 &&
  h2.quests.side_hunt === 'done' && h2.gold === 60 && h2.item === 3, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）',
  resolveNpcTalk(h2, 'cavewatch') === null);
ok('状态机：done 默认档（守洞人数清了，灯数到灯亮）',
  JSON.stringify(npcQuestPages(h2, 'cavewatch')).includes('雾里的账'));
ok('状态机：done bossDefeated 档（灯芯回来了叙事并入，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_hunt: 'done' }, bossDefeated: true }), 'cavewatch')).includes('灯芯回来了'));
ok('状态机：done caveBoss 档（领主散了、矿脉敞亮叙事并入，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_hunt: 'done' }, caveBoss: true }), 'cavewatch')).includes('领主散了'));
ok('状态机：done trueBoss 档（after 彩蛋「祭坛也空了/矿难那年的名字」两页并入 done 分档，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_hunt: 'done' }, trueBoss: true }), 'cavewatch')).includes('祭坛也空了') &&
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_hunt: 'done' }, trueBoss: true }), 'cavewatch')).includes('矿难那年的名字'));
ok('状态机：done 态 npcQuestMark 零顶标（cavewatch 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_hunt: 'done' } }), 'cavewatch') === null);
ok('questRewardPreview 与 reward 同源（60 金 + 2 生命药水）',
  (() => { const prev = questRewardPreview(mkHero({}), 'side_hunt'); return !!prev && prev.gold === 60 && prev.item === 2 && prev.potion2 === 0; })());
ok('运行期：cavewatch 之外纯风味 NPC 零顶标（stele2/stele1 无待办）',
  npcQuestMark(mkHero({}), 'stele2') === null &&
  npcQuestMark(mkHero({}), 'stele3') === null);

// —— NPCS.cavewatch 升格落位（零新 NPC/坐标/数据层三件套之外零改动）——
ok('NPCS.cavewatch 存在（守洞人 · mark pick · 含 v24.119 升格注释）',
  !!NPCS.cavewatch && NPCS.cavewatch.name === '守洞人' && NPCS.cavewatch.mark === 'pick' &&
  dSrc.includes('v24.119 升格为'));
ok('NPCS.cavewatch 原有 lines 两页 / trueBoss after 两页彩蛋数据层保留（零内容丢失契约）',
  Array.isArray(NPCS.cavewatch.lines) && NPCS.cavewatch.lines.length === 2 &&
  Array.isArray(NPCS.cavewatch.after) && NPCS.cavewatch.after.length === 2 &&
  NPCS.cavewatch.after[0].some((ln) => ln.includes('祭坛也空了')) && NPCS.cavewatch.after[1].some((ln) => ln.includes('矿难那年的名字')));
ok('姊妹件 smoke_v2235_minimapquest 已随升格更新（cavewatch 入任务 NPC 列表 + side_hunt done）',
  read('smoke_v2235_minimapquest.mjs').includes("'cavewatch'") && read('smoke_v2235_minimapquest.mjs').includes('side_hunt'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为三百六十七件套（三百六十六件套清除）',
  readme.includes('冒烟三百六十七件套（三百六十六件套清除）'));
ok('README tests 含 v24.119 守护描述与 smoke_v24119_huntquest 入库（342 份）',
  readme.includes('v24.119 起含「守洞人「数到灯亮」新支线」守护') &&
  readme.includes('smoke_v24119_huntquest 入库（342 份）'));
ok('README 仍有 v24.118 守护描述（历史保留）', readme.includes('v24.118 起含「井巫「渴不忘井」新支线」守护'));
ok('README 已有三百四十二件套口径且尚无 343（哨兵前望 343 语义：下一版才写 343）',
  readme.includes('冒烟三百六十七件套（三百六十六件套清除）') && !readme.includes('冒烟三百六十八件套') && !readme.includes('（368 份）'));
ok('README tests 树串尾已延伸（…+ smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑））',
  readme.includes('smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑）'));
ok('README 支线/奖励行随新现实（三十一条 · 数到灯亮 · HUNT_TALLY_GOAL）',
  readme.includes('四十五条支线目标/奖励全部由') &&
  readme.includes('数到灯亮（守洞人 · 累计讨伐 `HUNT_TALLY_GOAL`(6) 只魔物，自首战起累计）60 金 + 2 生命药水') &&
  readme.includes('v24.119 补第三十一条') && readme.includes('v24.118 补第三十一条') === false);
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 341 份（smoke.mjs + 341 专项）', chain.length === 366 && ['smoke.mjs', ...chain].length === 367, String(chain.length));
ok('package.json 链尾为 smoke_v24120_chesthud（第 343 份）', chain[chain.length - 1] === 'smoke_v24155_frugal', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v24118_wellquest.mjs && smoke_v24119_huntquest.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v24118_wellquest.mjs && node tests/smoke_v24119_huntquest.mjs && node tests/smoke_v24120_chesthud.mjs && node tests/smoke_v24121_siftquest.mjs && node tests/smoke_v24122_crystalquest.mjs && node tests/smoke_v24123_fraghud.mjs && node tests/smoke_v24124_questshud.mjs && node tests/smoke_v24125_hunthud.mjs && node tests/smoke_v24126_waitquest.mjs && node tests/smoke_v24127_lampquest.mjs && node tests/smoke_v24128_stelequest.mjs && node tests/smoke_v24129_stele2quest.mjs && node tests/smoke_v24130_stele3quest.mjs && node tests/smoke_v24131_stele4quest.mjs && node tests/smoke_v24132_fallenquest.mjs && node tests/smoke_v24133_inquest.mjs && node tests/smoke_v24134_kindleq.mjs && node tests/smoke_v24135_ledgerquest.mjs && node tests/smoke_v24136_herbquest.mjs && node tests/smoke_v24143_furnacequest.mjs && node tests/smoke_v24147_unflicker.mjs && node tests/smoke_v24148_swift.mjs && node tests/smoke_v24151_lowlv.mjs && node tests/smoke_v24152_nopotion.mjs && node tests/smoke_v24153_penny.mjs && node tests/smoke_v24154_steadfast.mjs && node tests/smoke_v24155_frugal.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.119（startsWith）', changelog.startsWith('## v24.155'));
ok('CHANGELOG v24.119 条目含「数到灯亮」与「HUNT_TALLY_GOAL」与「守洞人」',
  changelog.includes('数到灯亮') && changelog.includes('HUNT_TALLY_GOAL') && changelog.includes('守洞人'));
ok('CHANGELOG 仍保留 v24.118 条目（历史保留）', changelog.includes('## v24.118'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const testsDir = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录件套 = 342（341 + smoke_v24119_huntquest）', files.length === 367, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.118 pin 零残留 ——
const s24118 = read('smoke_v24118_wellquest.mjs');
ok('smoke_v24118 的 GAME_VERSION 字面量 pin 已更新为 v24.119', s24118.includes("const GAME_VERSION = 'v24.155';"));
ok('smoke_v24118 的 CHANGELOG 顶 pin 已更新为 ## v24.119 ', s24118.includes("startsWith('## v24.155'"));
ok('smoke_v24118 的件套 pin 已更新为三百六十七件套（三百六十六件套清除）', s24118.includes('三百六十七件套（三百六十六件套清除）'));
ok('smoke_v24118 的 README/链 tail pin 已随新现实延伸（含 smoke_v24119_huntquest）',
  s24118.includes('smoke_v24119_huntquest'));
ok('smoke_v24118 的 package.json 串尾 pin 已延伸至 smoke_v24119_huntquest', s24118.includes('node tests/smoke_v24118_wellquest.mjs'));
ok('smoke_v24118 的链尾 pin 已推进至 smoke_v24120_chesthud（第 343 份）', s24118.includes("=== 'smoke_v24155_frugal'"));
ok('smoke_v24118 的 README 历史块入库 pin 保留（341 份口径，历史块原样保留）',
  s24118.includes('入库（341 份）'));
const s24117 = read('smoke_v24117_codexhud.mjs');
ok('smoke_v24117 的 GAME_VERSION 字面量 pin 已更新为 v24.119', s24117.includes("const GAME_VERSION = 'v24.155';"));
ok('smoke_v24117 的 CHANGELOG 顶 pin 已更新为 ## v24.119 ', s24117.includes("startsWith('## v24.155'"));
ok('smoke_v24117 的件套 pin 已更新为三百六十七件套（三百六十六件套清除）', s24117.includes('三百六十七件套（三百六十六件套清除）'));
ok('smoke_v24117 的链尾 pin 已推进至 smoke_v24120_chesthud（第 343 份）', s24117.includes("=== 'smoke_v24155_frugal'"));
ok('smoke_v24117 的 package.json 串尾 pin 已延伸至 smoke_v24119_huntquest', s24117.includes('node tests/smoke_v24118_wellquest.mjs && node tests/smoke_v24119_huntquest.mjs && node tests/smoke_v24120_chesthud.mjs && node tests/smoke_v24121_siftquest.mjs && node tests/smoke_v24122_crystalquest.mjs'));
const s2436 = read('smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（341 专项 / 342）且尚无 343 口径哨兵',
  s2436.includes('suiteFiles.length ===  366  && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length ===  367') &&
  s2436.includes('!readme.includes(\'冒烟三百六十八件套\')') && s2436.includes('!readme.includes(\'（368 份）\')'));
const s2429 = read('smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 哨兵链前望 343（三百四十三件套否定式）',
  s2429.includes("!readme.includes('冒烟三百六十八件套'"));
// 旧代 v24.118 pin 零残留扫描（豁免本套件）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v24119_huntquest.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDir), 'utf8').split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  const hits = [];
  if (s2.includes("const GAME_VERSION = '" + "v24.118';")) hits.push('gv');
  if (s2.includes("GAME_VERSION === '" + "v24.118'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.118")) hits.push('cw');
  if (s2.includes('三百四十一件套（三百四' + '十件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 34' + '1')) hits.push('fl');
  if (s2.includes('chainAll.length === 34' + '1')) hits.push('cal');
  if (s2.includes('chain.length === 34' + '0')) hits.push('cl');
  if (s2.includes('treeTok.length === 34' + '1')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v24118_" + "wellquest'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.118 GAME_VERSION/顶 pin/341 口径（哨兵链，豁免本套件）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.119 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
