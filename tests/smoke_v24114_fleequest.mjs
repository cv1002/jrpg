// smoke_v24114_fleequest.mjs —— v24.114 专项冒烟：第二十八条支线「先撤为敬」（老矿工·[4]逃跑成功累计 RETREAT_GOAL(6) 次）
// （新内容·新支线——承 v24.113 掌灯童「一步一灯」/ v24.112 镇民「灯下之声」/ v24.111 听矿人「岩缝里的名字」/
// v24.110 记誓人「蓄石为誓」/ v24.109 刻碑人「一凿入石」/ v24.108 货栈掌柜「开张的生意」/ v24.107 货郎「路远灯长」/
// v24.106 放灯童「月亮的路」/ v24.105 琴师「战歌的谱」/ v24.100 说书人「灯下新章」同一「风味 NPC 升格为支线委托人」
// 先例：v21.17 纯风味 NPC「老矿工」（星井矿脉入口矿道旁 (2,3)，「头回来矿里？记住——这儿没有泉水，也没有旅店」/
// 「两枚徽记没凑齐之前，碰都不要碰」）升格为委托人——他在这条矿脉里刨了一辈子，最懂「留得下命，才挖得到砂」，
// 玩家每次 [4]逃跑成功都算替他练一手保命章法，替他撤满 RETREAT_GOAL(6) 次（计数 hero.flees 与 ACH_LIST flee
// 「走为上计」同读一份源，支线门槛 6 低于成就门槛 FLEE_GOAL(10)——顺路先完成支线再解锁成就；js/battle.js
// doFlee 逃跑成功唯一写入点、失败不计；零新计数零新状态零新存档）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.114 注释 / GAME_VERSION v24.114 与旧 v24.113 字面量零残留 /
// v24.113 及更早历史注释保留 / RETREAT_GOAL 常量与 export）、QUESTS 契约（28 side + 4 main、side_flee 字段
// 逐值、与 *_GOAL 同源、ACH_LIST allquests 同源互证、RETREAT_GOAL 低于 flees 成就门槛互证）、quests.js 运行期
// 状态机（offer→active→turnin→done 全链路 + resolveNpcTalk 接取/交付结算 60 金+2 生命药水 + npcQuestMark/
// npcQuestPages 四态 + sideQuestDone 0/28·3/28·28/28）、NPCS.miner 升格落位（linesByStage 三段与 after 两页保留
// 零内容丢失契约 + 姊妹件套已随升格更新）、README/package.json/CHANGELOG 同步（件套口径 337 + v24.114
// 守护描述 + 入库 337 + package 串尾 + CHANGELOG 顶 pin）、tests 目录与实跑链恒等（337）、哨兵链（前望 338 且
// README 尚无 338 口径）、旧代 v24.113 pin 全库零残留扫描（字面量/顶 pin/336 口径 · 豁免本套件）。
import { GAME_VERSION, QUESTS, RETREAT_GOAL, FLEE_GOAL, ACH_LIST, NPCS } from '../js/data.js';
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

console.log('— v24.114 老矿工「先撤为敬」新支线 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkgRaw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（格式合法 + 已越过 v24.113 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.113', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 113)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.114（旧 v24.113 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.138';") && !dSrc.includes("const GAME_VERSION = 'v24.113';"));
ok('data.js 含 v24.114 注释（先撤为敬新支线说明）',
  dSrc.includes('v24.114 新内容·新支线（第二十八条）'));
ok('data.js 仍保留 v24.113 历史注释（一步一灯说明，零内容丢失）',
  dSrc.includes('v24.113 新内容·新支线（第二十七条）') && dSrc.includes('v24.113 升格为支线委托人'));

// —— 源级落位：RETREAT_GOAL 常量 + export ——
ok('data.js RETREAT_GOAL 常量 = 6（与 WALK_GOAL 比邻声明，同一家族）',
  dSrc.includes('const RETREAT_GOAL = 6;') && dSrc.indexOf('const RETREAT_GOAL') > dSrc.indexOf('const WALK_GOAL'));
ok('data.js export 块含 RETREAT_GOAL（WALK_GOAL 之后用例）',
  dSrc.includes('WALK_GOAL, RETREAT_GOAL,'));
ok('RETREAT_GOAL 与 flees 成就门槛同族互证（6 < FLEE_GOAL 10——顺路先完成支线再解锁成就）',
  (() => { const aFlee = ACH_LIST.find((a) => a.id === 'flee');
    return !!aFlee && RETREAT_GOAL === 6 && FLEE_GOAL === 10 &&
      aFlee.ok({ flees: 9 }) === false &&
      aFlee.ok({ flees: 10 }) === true &&
      aFlee.prog({ flees: 3 }) === '3/10' &&
      RETREAT_GOAL < FLEE_GOAL; })());

// —— QUESTS 契约：28 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 32 条（28 side + 4 main，派生计数）',
  sideDefs.length === 44 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 48,
  `${sideDefs.length}/${mainDefs.length}`);
ok('side_flee 存在且为第二十八条（kind side · store · npc/giver miner · 无 unlockOn）',
  !!QUESTS.side_flee && QUESTS.side_flee.kind === 'side' && QUESTS.side_flee.store === true &&
  QUESTS.side_flee.npc === 'miner' && QUESTS.side_flee.giver === 'miner' &&
  QUESTS.side_flee.unlockOn == null);
ok('side_flee 名称「先撤为敬」/where/obj/offer/turnin/done 落位',
  QUESTS.side_flee.name === '先撤为敬' && QUESTS.side_flee.where.includes('星井矿脉') &&
  QUESTS.side_flee.obj.includes(String(RETREAT_GOAL)) && QUESTS.side_flee.obj.includes('留得下命') &&
  QUESTS.side_flee.offer.includes('老矿工') && QUESTS.side_flee.turnin.includes('老矿工') &&
  QUESTS.side_flee.done.includes('保命'));
ok('side_flee cond/condProg 与 RETREAT_GOAL 同源（flees 计数，判/进/文/话一处调全端跟随）',
  QUESTS.side_flee.cond({ flees: 5 }) === false &&
  QUESTS.side_flee.cond({ flees: 6 }) === true &&
  QUESTS.side_flee.cond({}) === false && QUESTS.side_flee.cond({ flees: 0 }) === false &&
  QUESTS.side_flee.condProg({}) === `0/${RETREAT_GOAL} 次` &&
  QUESTS.side_flee.condProg({ flees: 3 }) === `3/${RETREAT_GOAL} 次`);
ok('side_flee reward 逐值：60 金 + 2 生命药水（承 side_moon 60 档、低于 side_fish 90 档）',
  QUESTS.side_flee.reward.gold === 60 && QUESTS.side_flee.reward.item === 2 && !QUESTS.side_flee.reward.potion2);

// —— ACH_LIST allquests 同源互证（与 sideQuestDone 输出一致）——
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('ACH_LIST allquests 名称「灯火同心」且描述派生 28（「33 个支线任务」）',
  !!achAll && achAll.name === '灯火同心' && achAll.d.includes('44 个支线任务'), achAll && achAll.d);
ok('ACH_LIST allquests 判定/进度与 QUESTS 派生同源（0/28 false · 27/28 false · 28/28 true · prog 28/28）',
  !!achAll && achAll.ok({ quests: {} }) === false && achAll.ok({ quests: Object.fromEntries(sideDefs.slice(0, 27).map(q => [q.id, 'done'])) }) === false &&
  achAll.ok({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === true &&
  achAll.prog({ quests: {} }) === '0/44' && achAll.prog({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === '44/44');

// —— quests.js 运行期：sideQuestDone ——
ok('运行期：sideQuestDone 0/28 · 3/28 · 28/28 · 主线不入列',
  sideQuestDone({ quests: {} }).done === 0 && sideQuestDone({ quests: {} }).total === 44 &&
  sideQuestDone({ quests: { side_mushroom: 'done', side_cart: 'done', side_pond: 'done' } }).done === 3 &&
  sideQuestDone({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }).done === 44 &&
  sideQuestDone({ quests: { main_demon: 'done' } }).done === 0);

// —— 运行期状态机：offer → active → turnin → done（quests 纯函数，零 DOM）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 3, hp: 60, hpMax: 60, mp: 20, mpMax: 20, atkMax: 13, defMax: 9,
    gold: 0, xp: 0, xpNext: 100, item: 1, potion2: 0, weapon: '铁剑', armor: '皮甲',
    skills: [], ach: [], seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, talked: [], steps: 0,
    totalWins: 0, drops: 0, deflects: 0, casts: 0, travels: 0, sold: 0, spent: 0, crits: 0, charges: 0, flees: 0,
    x: 10, y: 13, map: 'village' }, extra || {});
}
const h1 = mkHero({});
ok('状态机：无存档 → questStatus offer（无 unlockOn 首次进星井矿脉即可接，承 side_hearer 同款）',
  questStatus(h1, 'side_flee') === 'offer', questStatus(h1, 'side_flee'));
ok('状态机：npcQuestMark offer 态「❕ 可接委托」',
  npcQuestMark(h1, 'miner') === '❕ 可接委托', npcQuestMark(h1, 'miner'));
ok('状态机：npcQuestPages offer 页（老矿工 · 先撤为敬 · RETREAT_GOAL 同源）',
  JSON.stringify(npcQuestPages(h1, 'miner')).includes('老矿工') &&
  JSON.stringify(npcQuestPages(h1, 'miner')).includes('留得下命') &&
  JSON.stringify(npcQuestPages(h1, 'miner')).includes(String(RETREAT_GOAL)) &&
  JSON.stringify(npcQuestPages(h1, 'miner')).includes('接下委托'));
const rAcc = resolveNpcTalk(h1, 'miner');
ok('状态机：resolveNpcTalk 接取 → {kind:accept, id:side_flee} + quests.side_flee=active',
  !!rAcc && rAcc.kind === 'accept' && rAcc.id === 'side_flee' && h1.quests.side_flee === 'active', JSON.stringify(rAcc));
ok('状态机：active 未达标 → questStatus active（cond 未满足）',
  questStatus(h1, 'side_flee') === 'active', questStatus(h1, 'side_flee'));
ok('状态机：active 页函数型实时报进度（已逃跑成功 0/6 次）',
  JSON.stringify(npcQuestPages(h1, 'miner')).includes('0/' + RETREAT_GOAL + ' 次'));
ok('状态机：任务日志 objective 同源（逃跑成功 6 次 0/6 次）',
  questJournal(h1).find((e) => e.id === 'side_flee').objective.includes('逃跑成功') &&
  questJournal(h1).find((e) => e.id === 'side_flee').objective.includes(`0/${RETREAT_GOAL} 次`));
const h2 = mkHero({ quests: { side_flee: 'active' }, flees: 6 });
ok('状态机：达标（flees=6 次）→ questStatus turnin',
  questStatus(h2, 'side_flee') === 'turnin', questStatus(h2, 'side_flee'));
ok('状态机：npcQuestMark turnin 态「❕ 可交任务」',
  npcQuestMark(h2, 'miner') === '❕ 可交任务', npcQuestMark(h2, 'miner'));
const rRew = resolveNpcTalk(h2, 'miner');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:60, item:2} + done + 结算 60 金/2 生命药水',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 60 && rRew.item === 2 &&
  h2.quests.side_flee === 'done' && h2.gold === 60 && h2.item === 3, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）',
  resolveNpcTalk(h2, 'miner') === null);
ok('状态机：done 默认档（命留住了，砂就总有得挖）',
  JSON.stringify(npcQuestPages(h2, 'miner')).includes('砂就总有得挖'));
ok('状态机：done trueBoss 档（after 彩蛋「矿洞里亮堂了/喝口井水再走」两页并入任务页，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_flee: 'done' }, trueBoss: true }), 'miner')).includes('矿洞里亮堂了') &&
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_flee: 'done' }, trueBoss: true }), 'miner')).includes('喝口井水再走'));
ok('状态机：done 态 npcQuestMark 零顶标（miner 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_flee: 'done' } }), 'miner') === null);
ok('questRewardPreview 与 reward 同源（60 金 + 2 生命药水）',
  (() => { const prev = questRewardPreview(mkHero({}), 'side_flee'); return !!prev && prev.gold === 60 && prev.item === 2 && prev.potion2 === 0; })());
ok('运行期：miner 之外纯风味 NPC 零顶标（stele1/stele2 无待办）',
  npcQuestMark(mkHero({}), 'stele2') === null && npcQuestMark(mkHero({}), 'stele3') === null);

// —— NPCS.miner 升格落位（零新 NPC/坐标/数据层三件套之外零改动）——
ok('NPCS.miner 存在（老矿工 · mark pick · 含 v24.114 升格注释）',
  !!NPCS.miner && NPCS.miner.name === '老矿工' && NPCS.miner.mark === 'pick' &&
  dSrc.includes('v24.114 升格为支线委托人'));
ok('NPCS.miner 原有 linesByStage 三段 / trueBoss after 两页彩蛋保留（零内容丢失契约）',
  Array.isArray(NPCS.miner.linesByStage) && NPCS.miner.linesByStage.length === 3 &&
  Array.isArray(NPCS.miner.after) && NPCS.miner.after.length === 2 &&
  NPCS.miner.after[0].some((ln) => ln.includes('矿洞里亮堂了')) && NPCS.miner.after[1].some((ln) => ln.includes('喝口井水再走')));
ok('data.js NPC_SPOTS 含老矿工 (2,3)（零新坐标）',
  dSrc.includes("'2,3': 'miner'"));
ok('姊妹件 smoke_v2117_miner 已随升格更新（miner 静态契约翻转为任务页契约）',
  read('smoke_v2117_miner.mjs').includes('side_flee'));
ok('姊妹件 smoke_v2235_minimapquest 已随升格更新（miner 入任务 NPC 列表）',
  read('smoke_v2235_minimapquest.mjs').includes("'miner'") && read('smoke_v2235_minimapquest.mjs').includes('side_flee'));
ok('基线套件 smoke.mjs 已随升格更新（miner 顶标契约翻转）',
  read('smoke.mjs').includes("npcQuestMark(fresh,'miner')==='❕ 可接委托'"));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为三百五十九件套（三百五十八件套清除）',
  readme.includes('冒烟三百五十九件套（三百五十八件套清除）'));
ok('README tests 含 v24.114 守护描述与 smoke_v24114_fleequest 入库（337 份）',
  readme.includes('v24.114 起含「老矿工「先撤为敬」新支线」守护') &&
  readme.includes('smoke_v24114_fleequest 入库（337 份）'));
ok('README 仍有 v24.113 守护描述（历史保留）', readme.includes('v24.113 起含「掌灯童「一步一灯」新支线」守护'));
ok('README 已有三百三十七件套口径且尚无 338（哨兵前望 338 语义：下一版才写 338）',
  readme.includes('冒烟三百五十九件套（三百五十八件套清除）') && !readme.includes('冒烟三百六十件套') && !readme.includes('（360 份）'));
ok('README tests 树串尾已延伸（…+ smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest（npm test 串跑））',
  readme.includes('smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest（npm test 串跑）'));
ok('README 支线/奖励行随新现实（二十八条 · 先撤为敬 · RETREAT_GOAL）',
  readme.includes('四十四条支线目标/奖励全部由') &&
  readme.includes('先撤为敬（老矿工 · [4]逃跑成功累计 `RETREAT_GOAL`(6) 次，逃跑成功才落账——失败不计）60 金 + 2 生命药水') &&
  readme.includes('v24.114 补第二十八条') && readme.includes('v24.113 补第二十七条'));
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 336 份（smoke.mjs + 336 专项）', chain.length === 358 && ['smoke.mjs', ...chain].length === 359, String(chain.length));
ok('package.json 链尾为 smoke_v24114_fleequest（第 337 份）', chain[chain.length - 1] === 'smoke_v24136_herbquest', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v24113_walkquest.mjs && smoke_v24114_fleequest.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v24113_walkquest.mjs && node tests/smoke_v24114_fleequest.mjs && node tests/smoke_v24115_achhud.mjs && node tests/smoke_v24116_guidequest.mjs && node tests/smoke_v24117_codexhud.mjs && node tests/smoke_v24118_wellquest.mjs && node tests/smoke_v24119_huntquest.mjs && node tests/smoke_v24120_chesthud.mjs && node tests/smoke_v24121_siftquest.mjs && node tests/smoke_v24122_crystalquest.mjs && node tests/smoke_v24123_fraghud.mjs && node tests/smoke_v24124_questshud.mjs && node tests/smoke_v24125_hunthud.mjs && node tests/smoke_v24126_waitquest.mjs && node tests/smoke_v24127_lampquest.mjs && node tests/smoke_v24128_stelequest.mjs && node tests/smoke_v24129_stele2quest.mjs && node tests/smoke_v24130_stele3quest.mjs && node tests/smoke_v24131_stele4quest.mjs && node tests/smoke_v24132_fallenquest.mjs && node tests/smoke_v24133_inquest.mjs && node tests/smoke_v24134_kindleq.mjs && node tests/smoke_v24135_ledgerquest.mjs && node tests/smoke_v24136_herbquest.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.114（startsWith）', changelog.startsWith('## v24.138'));
ok('CHANGELOG v24.114 条目含「先撤为敬」与「RETREAT_GOAL」与「老矿工」',
  changelog.includes('先撤为敬') && changelog.includes('RETREAT_GOAL') && changelog.includes('老矿工'));
ok('CHANGELOG 仍保留 v24.113 条目（历史保留）', changelog.includes('## v24.113'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const testsDir = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录件套 = 337（336 + smoke_v24114_fleequest）', files.length === 359, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.113 pin 零残留 ——
const s24113 = read('smoke_v24113_walkquest.mjs');
ok('smoke_v24113 的 GAME_VERSION 字面量 pin 已更新为 v24.114', s24113.includes("const GAME_VERSION = 'v24.138';"));
ok('smoke_v24113 的 CHANGELOG 顶 pin 已更新为 ## v24.114 ', s24113.includes("startsWith('## v24.138'"));
ok('smoke_v24113 的件套 pin 已更新为三百五十九件套（三百五十八件套清除）', s24113.includes('三百五十九件套（三百五十八件套清除）'));
ok('smoke_v24113 的 README/链 tail pin 已随新现实延伸（含 smoke_v24114_fleequest）',
  s24113.includes('smoke_v24114_fleequest'));
ok('smoke_v24113 的 package.json 串尾 pin 已延伸至 smoke_v24114_fleequest', s24113.includes('node tests/smoke_v24113_walkquest.mjs && node tests/smoke_v24114_fleequest.mjs'));
ok('smoke_v24113 的链尾 pin 已推进至 smoke_v24114_fleequest（第 337 份）', s24113.includes("=== 'smoke_v24136_herbquest'"));
ok('smoke_v24113 的 README 历史块入库 pin 保留（336 份口径，历史块原样保留）',
  s24113.includes('入库（336 份）'));
const s2436 = read('smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（336 专项 / 337）且尚无 338 口径哨兵',
  s2436.includes('suiteFiles.length === 358 && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length === 359') &&
  s2436.includes('!readme.includes(\'冒烟三百六十件套\')') && s2436.includes('!readme.includes(\'（360 份）\')'));
const s2415 = read('smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v24114_fleequest（第 337 份）', s2415.includes("chain[chain.length - 1] === 'smoke_v24136_herbquest'"));
ok('smoke_v2415 树串 token 数已推进至 337', s2415.includes('treeTok.length === 359'));
const s2429 = read('smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 哨兵链前望 338（三百三十七件套否定式）',
  s2429.includes("!readme.includes('冒烟三百六十件套')"));
// 旧代 v24.113 pin 零残留扫描（豁免本套件）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v24114_fleequest.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDir), 'utf8').split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  const hits = [];
  if (s2.includes("const GAME_VERSION = '" + "v24.113';")) hits.push('gv');
  if (s2.includes("GAME_VERSION === '" + "v24.113'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.113")) hits.push('cw');
  if (s2.includes('三百三十六件套（三百三十' + '五件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 33' + '6')) hits.push('fl');
  if (s2.includes('chainAll.length === 33' + '6')) hits.push('cal');
  if (s2.includes('chain.length === 33' + '5')) hits.push('cl');
  if (s2.includes('treeTok.length === 33' + '6')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v24113_" + "walkquest'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.113 GAME_VERSION/顶 pin/336 口径（哨兵链，豁免本套件）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.114 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
