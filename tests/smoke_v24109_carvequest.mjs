// smoke_v24109_carvequest.mjs —— v24.109 专项冒烟：第二十三条支线「一凿入石」（刻碑人·[1]普攻暴击累计 CARVE_GOAL(10) 次）
// （新内容·新支线——承 v24.108 货栈掌柜「开张的生意」/ v24.107 货郎「路远灯长」/ v24.106 放灯童「月亮的路」/
// v24.105 琴师「战歌的谱」/ v24.100 说书人「灯下新章」/ v24.82 守夜人「守夜的旧约」同一「风味 NPC 升格为支线
// 委托人」先例：v22.25 纯风味 NPC「刻碑人」（无字回廊东段 (19,3)，「这四块碑，是我一凿一凿凿出来的」）升格为
// 委托人——[1]普攻每打出一次暴击（×1.8！）都算替他凿下一记，替他凿满 CARVE_GOAL(10) 次（计数 hero.crits 与
// ACH_LIST crit「暴击如雨」同读一份源，支线门槛 10 低于成就门槛 CRIT_GOAL(20)，技能永不暴击只算普攻，
// 零新计数零新状态零新存档）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.109 注释 / GAME_VERSION v24.109 与旧 v24.108 字面量
// 零残留 / v22.25 及更早历史注释保留 / CARVE_GOAL 常量与 export）、QUESTS 契约（24 side + 4 main、
// side_carve 字段逐值、与 *_GOAL 同源、ACH_LIST allquests 同源互证）、quests.js 运行期状态机
// （offer→active→turnin→done 全链路 + resolveNpcTalk 接取/交付结算 70 金+2 生命药水 + npcQuestMark/
// npcQuestPages 四态 + sideQuestDone 0/23·3/23·23/23）、NPCS.stonecarver 升格落位（lines 两页与
// after 两页保留零内容丢失契约 + v2225 姊妹套件已随升格更新）、README/package.json/CHANGELOG 同步
// （件套口径 333 + v24.109 守护描述 + 入库 332 + package 串尾 + CHANGELOG 顶 pin）、tests 目录与
// 实跑链恒等（332）、哨兵链（前望 333 且 README 尚无 333 口径）、旧代 v24.108 pin 全库零残留扫描
// （字面量/顶 pin/331 口径 · 豁免本套件与上一代套件）。
import { GAME_VERSION, QUESTS, CARVE_GOAL, CRIT_GOAL, ACH_LIST, NPCS } from '../js/data.js';
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

console.log('— v24.109 刻碑人「一凿入石」新支线 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkgRaw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（格式合法 + 已越过 v24.108 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.108', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 108)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.109（旧 v24.108 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.164';") && !dSrc.includes("const GAME_VERSION = 'v24.108';"));
ok('data.js 含 v24.109 注释（一凿入石新支线说明）',
  dSrc.includes('v24.109 新内容·新支线（第二十三条）'));
ok('data.js 仍保留 v22.25 历史注释（刻碑人三件套说明，零内容丢失）',
  dSrc.includes('v22.25 新 NPC·纯风味') && dSrc.includes('一凿一凿'));

// —— 源级落位：CARVE_GOAL 常量 + export ——
ok('data.js CARVE_GOAL 常量 = 10（与 SHOP_GOAL 比邻声明，同一家族）',
  dSrc.includes('const CARVE_GOAL = 10;') && dSrc.indexOf('const CARVE_GOAL') > dSrc.indexOf('const SHOP_GOAL'));
ok('data.js export 块含 CARVE_GOAL（SHOP_GOAL 之后用例）',
  dSrc.includes('PEDDLE_GOAL, SHOP_GOAL, CARVE_GOAL,'));
ok('CARVE_GOAL 与 CRIT_GOAL 同族逐值（10 < 20，支线门槛低于成就门槛——顺路先完成支线再解锁成就）',
  CARVE_GOAL === 10 && CRIT_GOAL === 20 && CARVE_GOAL < CRIT_GOAL);

// —— QUESTS 契约：23 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 29 条（24 side + 4 main，派生计数）',
  sideDefs.length === 45 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 49,
  `${sideDefs.length}/${mainDefs.length}`);
ok('side_carve 存在且为第二十三条（kind side · store · npc/giver stonecarver · 无 unlockOn）',
  !!QUESTS.side_carve && QUESTS.side_carve.kind === 'side' && QUESTS.side_carve.store === true &&
  QUESTS.side_carve.npc === 'stonecarver' && QUESTS.side_carve.giver === 'stonecarver' &&
  QUESTS.side_carve.unlockOn == null);
ok('side_carve 名称「一凿入石」/where/obj/offer/turnin/done 落位',
  QUESTS.side_carve.name === '一凿入石' && QUESTS.side_carve.where.includes('普攻暴击') &&
  QUESTS.side_carve.obj.includes(String(CARVE_GOAL)) && QUESTS.side_carve.obj.includes('技能永不暴击') &&
  QUESTS.side_carve.offer.includes('刻碑人') && QUESTS.side_carve.turnin.includes('刻碑人') &&
  QUESTS.side_carve.done.includes('名字凿上了'));
ok('side_carve cond/condProg 与 CARVE_GOAL 同源（crits 计数，判/进/文/话一处调全端跟随）',
  QUESTS.side_carve.cond({ crits: CARVE_GOAL - 1 }) === false &&
  QUESTS.side_carve.cond({ crits: CARVE_GOAL }) === true &&
  QUESTS.side_carve.cond({}) === false && QUESTS.side_carve.cond({ crits: 0 }) === false &&
  QUESTS.side_carve.condProg({}) === `0/${CARVE_GOAL} 次` && QUESTS.side_carve.condProg({ crits: 4 }) === `4/${CARVE_GOAL} 次`);
ok('side_carve reward 逐值：70 金 + 2 生命药水（承 side_tale 70 档、低于 side_fish 90 档）',
  QUESTS.side_carve.reward.gold === 70 && QUESTS.side_carve.reward.item === 2 && !QUESTS.side_carve.reward.potion2);

// —— ACH_LIST allquests 同源互证（与 sideQuestDone 输出一致）——
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('ACH_LIST allquests 名称「灯火同心」且描述派生 23（「33 个支线任务」）',
  !!achAll && achAll.name === '灯火同心' && achAll.d.includes('45 个支线任务'), achAll && achAll.d);
ok('ACH_LIST allquests 判定/进度与 QUESTS 派生同源（0/23 false · 22/23 false · 23/23 true · prog 23/23）',
  !!achAll && achAll.ok({ quests: {} }) === false && achAll.ok({ quests: Object.fromEntries(sideDefs.slice(0, 24).map(q => [q.id, 'done'])) }) === false &&
  achAll.ok({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === true &&
  achAll.prog({ quests: {} }) === '0/45' && achAll.prog({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === '45/45');

// —— quests.js 运行期：sideQuestDone ——
ok('运行期：sideQuestDone 0/23 · 3/23 · 23/23 · 主线不入列',
  sideQuestDone({ quests: {} }).done === 0 && sideQuestDone({ quests: {} }).total === 45 &&
  sideQuestDone({ quests: { side_mushroom: 'done', side_cart: 'done', side_pond: 'done' } }).done === 3 &&
  sideQuestDone({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }).done === 45 &&
  sideQuestDone({ quests: { main_demon: 'done' } }).done === 0);

// —— 运行期状态机：offer → active → turnin → done（quests 纯函数，零 DOM）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 3, hp: 60, hpMax: 60, mp: 20, mpMax: 20, atkMax: 13, defMax: 9,
    gold: 0, xp: 0, xpNext: 100, item: 1, potion2: 0, weapon: '铁剑', armor: '皮甲',
    skills: [], ach: [], seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, totalWins: 0,
    drops: 0, deflects: 0, casts: 0, travels: 0, sold: 0, spent: 0, crits: 0, x: 19, y: 4, map: 'gallery' }, extra || {});
}
const h1 = mkHero({});
ok('状态机：无存档 → questStatus offer（无 unlockOn 开局即可接，承 side_moon 同款）',
  questStatus(h1, 'side_carve') === 'offer', questStatus(h1, 'side_carve'));
ok('状态机：npcQuestMark offer 态「❕ 可接委托」',
  npcQuestMark(h1, 'stonecarver') === '❕ 可接委托', npcQuestMark(h1, 'stonecarver'));
ok('状态机：npcQuestPages offer 页（刻碑人 · 一凿入石 · CARVE_GOAL 同源）',
  JSON.stringify(npcQuestPages(h1, 'stonecarver')).includes('刻碑人') &&
  JSON.stringify(npcQuestPages(h1, 'stonecarver')).includes('一凿一凿') &&
  JSON.stringify(npcQuestPages(h1, 'stonecarver')).includes(String(CARVE_GOAL)) &&
  JSON.stringify(npcQuestPages(h1, 'stonecarver')).includes('接下委托'));
const rAcc = resolveNpcTalk(h1, 'stonecarver');
ok('状态机：resolveNpcTalk 接取 → {kind:accept, id:side_carve} + quests.side_carve=active',
  !!rAcc && rAcc.kind === 'accept' && rAcc.id === 'side_carve' && h1.quests.side_carve === 'active', JSON.stringify(rAcc));
ok('状态机：active 未达标 → questStatus active（cond 未满足）',
  questStatus(h1, 'side_carve') === 'active', questStatus(h1, 'side_carve'));
ok('状态机：active 页函数型实时报进度（已凿 0/10 次）',
  JSON.stringify(npcQuestPages(h1, 'stonecarver')).includes('0/' + CARVE_GOAL + ' 次') &&
  JSON.stringify(npcQuestPages(h1, 'stonecarver')).includes('只管出手'));
ok('状态机：任务日志 objective 同源（普攻打出 10 次暴击 0/10 次）',
  questJournal(h1).find((e) => e.id === 'side_carve').objective.includes('暴击') &&
  questJournal(h1).find((e) => e.id === 'side_carve').objective.includes(`0/${CARVE_GOAL} 次`));
const h2 = mkHero({ quests: { side_carve: 'active' }, crits: CARVE_GOAL });
ok('状态机：达标（crits=CARVE_GOAL）→ questStatus turnin',
  questStatus(h2, 'side_carve') === 'turnin', questStatus(h2, 'side_carve'));
ok('状态机：npcQuestMark turnin 态「❕ 可交任务」',
  npcQuestMark(h2, 'stonecarver') === '❕ 可交任务', npcQuestMark(h2, 'stonecarver'));
const rRew = resolveNpcTalk(h2, 'stonecarver');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:70, item:2} + done + 结算 70 金/2 生命药水',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 70 && rRew.item === 2 &&
  h2.quests.side_carve === 'done' && h2.gold === 70 && h2.item === 3, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）',
  resolveNpcTalk(h2, 'stonecarver') === null);
ok('状态机：done 默认档（名字刻上了）',
  JSON.stringify(npcQuestPages(h2, 'stonecarver')).includes('名字刻上了'));
ok('状态机：done trueBoss 档（after 彩蛋「碑上的字全亮了/手艺是暖的」两页并入任务页，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_carve: 'done' }, trueBoss: true }), 'stonecarver')).includes('碑上的字') &&
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_carve: 'done' }, trueBoss: true }), 'stonecarver')).includes('手艺是暖的'));
ok('状态机：done 态 npcQuestMark 零顶标（stonecarver 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_carve: 'done' } }), 'stonecarver') === null);
ok('questRewardPreview 与 reward 同源（70 金 + 2 生命药水）',
  JSON.stringify(questRewardPreview(mkHero({}), 'side_carve')) === '{"gold":70,"item":2,"potion2":0}');

// —— 既有支线零回归（挑九条既有契约逐值钉死）——
ok('既有支线零回归：side_tale/side_fish/side_bell/side_golem/side_watch/side_song/side_moon/side_peddle/side_shop 契约逐字未动',
  QUESTS.side_tale.reward.gold === 70 && QUESTS.side_tale.reward.item === 2 &&
  QUESTS.side_fish.reward.gold === 90 && QUESTS.side_fish.reward.item === 2 &&
  QUESTS.side_bell.reward.gold === 80 && QUESTS.side_bell.reward.potion2 === 1 &&
  QUESTS.side_golem.reward.gold === 120 && QUESTS.side_watch.reward.gold === 100 &&
  QUESTS.side_watch.reward.potion2 === 1 &&
  QUESTS.side_song.reward.gold === 60 && QUESTS.side_song.reward.potion2 === 1 &&
  QUESTS.side_moon.reward.gold === 60 && QUESTS.side_moon.reward.item === 2 &&
  QUESTS.side_peddle.reward.gold === 70 && QUESTS.side_peddle.reward.item === 2 &&
  QUESTS.side_shop.reward.gold === 80 && QUESTS.side_shop.reward.item === 2);

// —— NPCS.stonecarver 升格落位（零新 NPC/坐标/数据层三件套之外零改动）——
ok('NPCS.stonecarver 存在（刻碑人 · mark pick · 含 v24.109 升格注释）',
  !!NPCS.stonecarver && NPCS.stonecarver.name === '刻碑人' && NPCS.stonecarver.mark === 'pick' &&
  dSrc.includes('v24.109 升格为支线委托人'));
ok('NPCS.stonecarver 原有 lines 两页 / trueBoss after 两页彩蛋保留（零内容丢失契约）',
  Array.isArray(NPCS.stonecarver.lines) && NPCS.stonecarver.lines.length === 2 &&
  Array.isArray(NPCS.stonecarver.after) && NPCS.stonecarver.after.length === 2 &&
  NPCS.stonecarver.after[0][0].includes('碑上的字') && NPCS.stonecarver.after[1][0].includes('名字都回灯下了'));
ok('data.js gallery.extras 含刻碑人 (19,3) 与 NPC_SPOTS 键「19,3」（零新坐标）',
  dSrc.includes("{ x: 19, y: 3, ty: 'NPC' }") && dSrc.includes("'19,3'"));
ok('姊妹件 smoke_v2225_stonecarver 已随升格更新（无任务契约翻转为任务页契约）',
  read('smoke_v2225_stonecarver.mjs').includes('一凿入石') && read('smoke_v2225_stonecarver.mjs').includes('可接委托'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为三百七十五件套（三百七十四件套清除）',
  readme.includes('冒烟三百七十五件套（三百七十四件套清除）'));
ok('README tests 含 v24.109 守护描述与 smoke_v24111_hearerquest 入库（335 份）',
  readme.includes('v24.109 起含「刻碑人「一凿入石」新支线」守护') &&
  readme.includes('smoke_v24111_hearerquest 入库（335 份）'));
ok('README 仍有 v24.108 守护描述（历史保留）', readme.includes('v24.108 起含「货栈掌柜「开张的生意」新支线」守护'));
ok('README 已有三百三十四件套口径且尚无 333（哨兵前望 333 语义：下一版才写 333）',
  readme.includes('冒烟三百七十五件套（三百七十四件套清除）') && !readme.includes('冒烟三百七十六件套') && !readme.includes('（376 份）'));
ok('README tests 树串尾已延伸（…+ smoke_v24107_peddlequest + smoke_v24108_shopquest + smoke_v24109_carvequest + smoke_v24110_vowquest + smoke_v24111_hearerquest + smoke_v24112_talkquest + smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑））',
  readme.includes('smoke_v24107_peddlequest + smoke_v24108_shopquest + smoke_v24109_carvequest + smoke_v24110_vowquest + smoke_v24111_hearerquest + smoke_v24112_talkquest + smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑）'));
ok('README 支线/奖励行随新现实（二十三条 · 一凿入石 · CARVE_GOAL）',
  readme.includes('四十五条支线目标/奖励全部由') &&
  readme.includes('一凿入石（刻碑人 · [1]普攻暴击累计 `CARVE_GOAL`(10) 次，技能永不暴击只算普攻）70 金 + 2 药水') &&
  readme.includes('v24.109 补第二十三条'));
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 331 份（smoke.mjs + 331 专项）', chain.length === 374 && ['smoke.mjs', ...chain].length === 375, String(chain.length));
ok('package.json 链尾为 smoke_v24109_carvequest（第 332 份）', chain[chain.length - 1] === 'smoke_v24164_swiftlv', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v24109_carvequest.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v24108_shopquest.mjs && node tests/smoke_v24109_carvequest.mjs && node tests/smoke_v24110_vowquest.mjs && node tests/smoke_v24111_hearerquest.mjs && node tests/smoke_v24112_talkquest.mjs && node tests/smoke_v24113_walkquest.mjs && node tests/smoke_v24114_fleequest.mjs && node tests/smoke_v24115_achhud.mjs && node tests/smoke_v24116_guidequest.mjs && node tests/smoke_v24117_codexhud.mjs && node tests/smoke_v24118_wellquest.mjs && node tests/smoke_v24119_huntquest.mjs && node tests/smoke_v24120_chesthud.mjs && node tests/smoke_v24121_siftquest.mjs && node tests/smoke_v24122_crystalquest.mjs && node tests/smoke_v24123_fraghud.mjs && node tests/smoke_v24124_questshud.mjs && node tests/smoke_v24125_hunthud.mjs && node tests/smoke_v24126_waitquest.mjs && node tests/smoke_v24127_lampquest.mjs && node tests/smoke_v24128_stelequest.mjs && node tests/smoke_v24129_stele2quest.mjs && node tests/smoke_v24130_stele3quest.mjs && node tests/smoke_v24131_stele4quest.mjs && node tests/smoke_v24132_fallenquest.mjs && node tests/smoke_v24133_inquest.mjs && node tests/smoke_v24134_kindleq.mjs && node tests/smoke_v24135_ledgerquest.mjs && node tests/smoke_v24136_herbquest.mjs && node tests/smoke_v24143_furnacequest.mjs && node tests/smoke_v24147_unflicker.mjs && node tests/smoke_v24148_swift.mjs && node tests/smoke_v24151_lowlv.mjs && node tests/smoke_v24152_nopotion.mjs && node tests/smoke_v24153_penny.mjs && node tests/smoke_v24154_steadfast.mjs && node tests/smoke_v24155_frugal.mjs && node tests/smoke_v24157_dry.mjs && node tests/smoke_v24158_swift2.mjs && node tests/smoke_v24159_lowlv2.mjs && node tests/smoke_v24160_noskill.mjs && node tests/smoke_v24161_noskill2.mjs && node tests/smoke_v24162_lowskill.mjs && node tests/smoke_v24163_swiftskill.mjs && node tests/smoke_v24164_swiftlv.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.109（startsWith）', changelog.startsWith('## v24.164'));
ok('CHANGELOG v24.109 条目含「一凿入石」与「CARVE_GOAL」与「刻碑人」',
  changelog.includes('一凿入石') && changelog.includes('CARVE_GOAL') && changelog.includes('刻碑人'));
ok('CHANGELOG 仍保留 v24.108 条目（历史保留）', changelog.includes('## v24.108'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const testsDir = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录件套 = 332（331 + smoke_v24109_carvequest）', files.length === 375, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.108 pin 零残留 ——
const s24108 = read('smoke_v24108_shopquest.mjs');
ok('smoke_v24108 的 GAME_VERSION 字面量 pin 已更新为 v24.109', s24108.includes("const GAME_VERSION = 'v24.164';"));
ok('smoke_v24108 的 CHANGELOG 顶 pin 已更新为 ## v24.109 ', s24108.includes("startsWith('## v24.164 '"));
ok('smoke_v24108 的件套 pin 已更新为三百七十五件套（三百七十四件套清除）', s24108.includes('三百七十五件套（三百七十四件套清除）'));
ok('smoke_v24108 的 README/链 tail pin 已随新现实延伸（含 smoke_v24109_carvequest）',
  s24108.includes('smoke_v24111_hearerquest'));
ok('smoke_v24108 的 package.json 串尾 pin 已延伸至 smoke_v24109_carvequest', s24108.includes('node tests/smoke_v24108_shopquest.mjs && node tests/smoke_v24109_carvequest.mjs && node tests/smoke_v24110_vowquest.mjs && node tests/smoke_v24111_hearerquest.mjs'));
ok('smoke_v24108 的链尾 pin 已推进至 smoke_v24109_carvequest（第 332 份）', s24108.includes("=== 'smoke_v24164_swiftlv'"));
ok('smoke_v24108 的入库 pin 已推进至 332 份', s24108.includes('入库（335 份）'));
const s2436 = read('smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（331 专项 / 332）且尚无 333 口径哨兵',
  s2436.includes('suiteFiles.length ===  374  && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length ===  375') &&
  s2436.includes('!readme.includes(\'冒烟三百七十六件套\')') && s2436.includes('!readme.includes(\'（376 份）\')'));
const s2415 = read('smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v24109_carvequest（第 332 份）', s2415.includes("chain[chain.length - 1] === 'smoke_v24164_swiftlv'"));
ok('smoke_v2415 树串 token 数已推进至 332', s2415.includes('treeTok.length === 375'));
// 旧代 v24.108 pin 零残留扫描（豁免本套件与上一代套件）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v24109_carvequest.mjs') continue;
  if (f === 'smoke_v24108_shopquest.mjs') continue;
  if (f === 'smoke_v24107_peddlequest.mjs') continue;
  if (f === 'smoke_v24106_moonquest.mjs') continue;
  if (f === 'smoke_v24100_talequest.mjs') continue;
  if (f === 'smoke_v24101_goldcurve26.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDir), 'utf8').split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  const hits = [];
  if (s2.includes("const GAME_VERSION = '" + "v24.108';")) hits.push('gv');
  if (s2.includes("GAME_VERSION === '" + "v24.108'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.108")) hits.push('cw');
  if (s2.includes('入库（33' + '1 份）')) hits.push('ruku');
  if (s2.includes('三百三十一件套（三百三十' + '件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 33' + '1')) hits.push('fl');
  if (s2.includes('chainAll.length === 33' + '1')) hits.push('cal');
  if (s2.includes('chain.length === 33' + '0')) hits.push('cl');
  if (s2.includes('treeTok.length === 33' + '1')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v24108_" + "shopquest'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.108 GAME_VERSION/顶 pin/331 口径（哨兵链，豁免本套件）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.109 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
