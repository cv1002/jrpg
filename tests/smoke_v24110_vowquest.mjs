// smoke_v24110_vowquest.mjs —— v24.110 专项冒烟：第二十四条支线「蓄石为誓」（记誓人·[6]蓄力累计 VOW_GOAL(12) 次）
// （新内容·新支线——承 v24.109 刻碑人「一凿入石」/ v24.108 货栈掌柜「开张的生意」/ v24.107 货郎「路远灯长」/
// v24.106 放灯童「月亮的路」/ v24.105 琴师「战歌的谱」/ v24.100 说书人「灯下新章」同一「风味 NPC 升格为支线
// 委托人」先例：v22.51 纯风味 NPC「记誓人」（无字回廊第二块名字石碑碑下 (10,3)，「一句话撑到今天，还在石头
// 发烫」）升格为委托人——[6]凝神蓄力（下次攻击/技能威力 ×CHARGE_MULT、治疗保留蓄力）每次都是替那句誓添
// 一笔分量，替他蓄满 VOW_GOAL(12) 次（计数 hero.charges 与 ACH_LIST charge「蓄势待发」同读一份源，支线
// 门槛 12 低于成就门槛 CHARGE_GOAL(15)，蓄的不是力是那句誓的分量；零新计数零新状态零新存档）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.110 注释 / GAME_VERSION v24.110 与旧 v24.109 字面量
// 零残留 / v22.51 及更早历史注释保留 / VOW_GOAL 常量与 export）、QUESTS 契约（26 side + 4 main、
// side_vow 字段逐值、与 *_GOAL 同源、ACH_LIST allquests 同源互证）、quests.js 运行期状态机
// （offer→active→turnin→done 全链路 + resolveNpcTalk 接取/交付结算 70 金+2 生命药水 + npcQuestMark/
// npcQuestPages 四态 + sideQuestDone 0/26·3/26·26/26）、NPCS.oathkeep 升格落位（lines 两页与
// after 两页保留零内容丢失契约 + v2251 姊妹套件已随升格更新）、README/package.json/CHANGELOG 同步
// （件套口径 333 + v24.110 守护描述 + 入库 333 + package 串尾 + CHANGELOG 顶 pin）、tests 目录与
// 实跑链恒等（333）、哨兵链（前望 334 且 README 尚无 334 口径）、旧代 v24.109 pin 全库零残留扫描
// （字面量/顶 pin/332 口径 · 豁免本套件与上一代套件）。
import { GAME_VERSION, QUESTS, VOW_GOAL, CHARGE_GOAL, ACH_LIST, NPCS } from '../js/data.js';
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

console.log('— v24.110 记誓人「蓄石为誓」新支线 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkgRaw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（格式合法 + 已越过 v24.109 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.109', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 109)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.110（旧 v24.109 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.138';") && !dSrc.includes("const GAME_VERSION = 'v24.110';"));
ok('data.js 含 v24.110 注释（蓄石为誓新支线说明）',
  dSrc.includes('v24.110 新内容·新支线（第二十四条）'));
ok('data.js 仍保留 v22.51 历史注释（记誓人说明，零内容丢失）',
  dSrc.includes('v22.51 新内容·纯风味 NPC') && dSrc.includes('石头发烫'));

// —— 源级落位：VOW_GOAL 常量 + export ——
ok('data.js VOW_GOAL 常量 = 12（与 CARVE_GOAL 比邻声明，同一家族）',
  dSrc.includes('const VOW_GOAL = 12;') && dSrc.indexOf('const VOW_GOAL') > dSrc.indexOf('const CARVE_GOAL'));
ok('data.js export 块含 VOW_GOAL（CARVE_GOAL 之后用例）',
  dSrc.includes('CARVE_GOAL, VOW_GOAL,'));
ok('VOW_GOAL 与 CHARGE_GOAL 同族逐值（12 < 15，支线门槛低于成就门槛——顺路先完成支线再解锁成就）',
  VOW_GOAL === 12 && CHARGE_GOAL === 15 && VOW_GOAL < CHARGE_GOAL);

// —— QUESTS 契约：26 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 29 条（26 side + 4 main，派生计数）',
  sideDefs.length === 44 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 48,
  `${sideDefs.length}/${mainDefs.length}`);
ok('side_vow 存在且为第二十四条（kind side · store · npc/giver oathkeep · 无 unlockOn）',
  !!QUESTS.side_vow && QUESTS.side_vow.kind === 'side' && QUESTS.side_vow.store === true &&
  QUESTS.side_vow.npc === 'oathkeep' && QUESTS.side_vow.giver === 'oathkeep' &&
  QUESTS.side_vow.unlockOn == null);
ok('side_vow 名称「蓄石为誓」/where/obj/offer/turnin/done 落位',
  QUESTS.side_vow.name === '蓄石为誓' && QUESTS.side_vow.where.includes('蓄力') &&
  QUESTS.side_vow.obj.includes(String(VOW_GOAL)) && QUESTS.side_vow.obj.includes('凝神蓄力') &&
  QUESTS.side_vow.offer.includes('记誓人') && QUESTS.side_vow.turnin.includes('记誓人') &&
  QUESTS.side_vow.done.includes('碑还是温的'));
ok('side_vow cond/condProg 与 VOW_GOAL 同源（charges 计数，判/进/文/话一处调全端跟随）',
  QUESTS.side_vow.cond({ charges: VOW_GOAL - 1 }) === false &&
  QUESTS.side_vow.cond({ charges: VOW_GOAL }) === true &&
  QUESTS.side_vow.cond({}) === false && QUESTS.side_vow.cond({ charges: 0 }) === false &&
  QUESTS.side_vow.condProg({}) === `0/${VOW_GOAL} 次` && QUESTS.side_vow.condProg({ charges: 4 }) === `4/${VOW_GOAL} 次`);
ok('side_vow reward 逐值：70 金 + 2 生命药水（承 side_tale 70 档、低于 side_fish 90 档）',
  QUESTS.side_vow.reward.gold === 70 && QUESTS.side_vow.reward.item === 2 && !QUESTS.side_vow.reward.potion2);

// —— ACH_LIST allquests 同源互证（与 sideQuestDone 输出一致）——
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('ACH_LIST allquests 名称「灯火同心」且描述派生 24（「33 个支线任务」）',
  !!achAll && achAll.name === '灯火同心' && achAll.d.includes('44 个支线任务'), achAll && achAll.d);
ok('ACH_LIST allquests 判定/进度与 QUESTS 派生同源（0/26 false · 25/26 false · 26/26 true · prog 26/26）',
  !!achAll && achAll.ok({ quests: {} }) === false && achAll.ok({ quests: Object.fromEntries(sideDefs.slice(0, 24).map(q => [q.id, 'done'])) }) === false &&
  achAll.ok({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === true &&
  achAll.prog({ quests: {} }) === '0/44' && achAll.prog({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === '44/44');

// —— quests.js 运行期：sideQuestDone ——
ok('运行期：sideQuestDone 0/26 · 3/26 · 26/26 · 主线不入列',
  sideQuestDone({ quests: {} }).done === 0 && sideQuestDone({ quests: {} }).total === 44 &&
  sideQuestDone({ quests: { side_mushroom: 'done', side_cart: 'done', side_pond: 'done' } }).done === 3 &&
  sideQuestDone({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }).done === 44 &&
  sideQuestDone({ quests: { main_demon: 'done' } }).done === 0);

// —— 运行期状态机：offer → active → turnin → done（quests 纯函数，零 DOM）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 3, hp: 60, hpMax: 60, mp: 20, mpMax: 20, atkMax: 13, defMax: 9,
    gold: 0, xp: 0, xpNext: 100, item: 1, potion2: 0, weapon: '铁剑', armor: '皮甲',
    skills: [], ach: [], seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, totalWins: 0,
    drops: 0, deflects: 0, casts: 0, travels: 0, sold: 0, spent: 0, crits: 0, charges: 0, x: 10, y: 4, map: 'gallery' }, extra || {});
}
const h1 = mkHero({});
ok('状态机：无存档 → questStatus offer（无 unlockOn 开局即可接，承 side_moon 同款）',
  questStatus(h1, 'side_vow') === 'offer', questStatus(h1, 'side_vow'));
ok('状态机：npcQuestMark offer 态「❕ 可接委托」',
  npcQuestMark(h1, 'oathkeep') === '❕ 可接委托', npcQuestMark(h1, 'oathkeep'));
ok('状态机：npcQuestPages offer 页（记誓人 · 蓄石为誓 · VOW_GOAL 同源）',
  JSON.stringify(npcQuestPages(h1, 'oathkeep')).includes('记誓人') &&
  JSON.stringify(npcQuestPages(h1, 'oathkeep')).includes('第二块碑') &&
  JSON.stringify(npcQuestPages(h1, 'oathkeep')).includes(String(VOW_GOAL)) &&
  JSON.stringify(npcQuestPages(h1, 'oathkeep')).includes('接下委托'));
const rAcc = resolveNpcTalk(h1, 'oathkeep');
ok('状态机：resolveNpcTalk 接取 → {kind:accept, id:side_vow} + quests.side_vow=active',
  !!rAcc && rAcc.kind === 'accept' && rAcc.id === 'side_vow' && h1.quests.side_vow === 'active', JSON.stringify(rAcc));
ok('状态机：active 未达标 → questStatus active（cond 未满足）',
  questStatus(h1, 'side_vow') === 'active', questStatus(h1, 'side_vow'));
ok('状态机：active 页函数型实时报进度（已蓄 0/12 次）',
  JSON.stringify(npcQuestPages(h1, 'oathkeep')).includes('0/' + VOW_GOAL + ' 次') &&
  JSON.stringify(npcQuestPages(h1, 'oathkeep')).includes('分量是一口气'));
ok('状态机：任务日志 objective 同源（凝神蓄力 12 次 0/12 次）',
  questJournal(h1).find((e) => e.id === 'side_vow').objective.includes('凝神蓄力') &&
  questJournal(h1).find((e) => e.id === 'side_vow').objective.includes(`0/${VOW_GOAL} 次`));
const h2 = mkHero({ quests: { side_vow: 'active' }, charges: VOW_GOAL });
ok('状态机：达标（charges=VOW_GOAL）→ questStatus turnin',
  questStatus(h2, 'side_vow') === 'turnin', questStatus(h2, 'side_vow'));
ok('状态机：npcQuestMark turnin 态「❕ 可交任务」',
  npcQuestMark(h2, 'oathkeep') === '❕ 可交任务', npcQuestMark(h2, 'oathkeep'));
const rRew = resolveNpcTalk(h2, 'oathkeep');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:70, item:2} + done + 结算 70 金/2 生命药水',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 70 && rRew.item === 2 &&
  h2.quests.side_vow === 'done' && h2.gold === 70 && h2.item === 3, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）',
  resolveNpcTalk(h2, 'oathkeep') === null);
ok('状态机：done 默认档（分量蓄进去了）',
  JSON.stringify(npcQuestPages(h2, 'oathkeep')).includes('分量蓄进去了'));
ok('状态机：done trueBoss 档（after 彩蛋「誓还了/镇子在焐它」两页并入任务页，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_vow: 'done' }, trueBoss: true }), 'oathkeep')).includes('誓还了') &&
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_vow: 'done' }, trueBoss: true }), 'oathkeep')).includes('镇子在焐它'));
ok('状态机：done 态 npcQuestMark 零顶标（oathkeep 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_vow: 'done' } }), 'oathkeep') === null);
ok('questRewardPreview 与 reward 同源（70 金 + 2 生命药水）',
  JSON.stringify(questRewardPreview(mkHero({}), 'side_vow')) === '{"gold":70,"item":2,"potion2":0}');

// —— NPCS.oathkeep 升格落位（零新 NPC/坐标/数据层三件套之外零改动）——
ok('NPCS.oathkeep 存在（记誓人 · mark staff · 含 v24.110 升格注释）',
  !!NPCS.oathkeep && NPCS.oathkeep.name === '记誓人' && NPCS.oathkeep.mark === 'staff' &&
  dSrc.includes('v24.110 升格为支线委托人'));
ok('NPCS.oathkeep 原有 lines 两页 / trueBoss after 两页彩蛋保留（零内容丢失契约）',
  Array.isArray(NPCS.oathkeep.lines) && NPCS.oathkeep.lines.length === 2 &&
  Array.isArray(NPCS.oathkeep.after) && NPCS.oathkeep.after.length === 2 &&
  NPCS.oathkeep.after[0].some((ln) => ln.includes('誓还了')) && NPCS.oathkeep.after[1].some((ln) => ln.includes('镇子在焐它')));
ok('data.js gallery.extras 含记誓人 (10,3) 与 NPC_SPOTS 键「10,3」（零新坐标）',
  dSrc.includes("{ x: 10, y: 3, ty: 'NPC' }") && dSrc.includes("'10,3'"));
ok('姊妹件 smoke_v2251_oathkeep 已随升格更新（无任务契约翻转为任务页契约）',
  read('smoke_v2251_oathkeep.mjs').includes('蓄石为誓') && read('smoke_v2251_oathkeep.mjs').includes('可接委托'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为三百五十九件套（三百五十八件套清除）',
  readme.includes('冒烟三百五十九件套（三百五十八件套清除）'));
ok('README tests 含 v24.110 守护描述与 smoke_v24111_hearerquest 入库（335 份）',
  readme.includes('v24.110 起含「记誓人「蓄石为誓」新支线」守护') &&
  readme.includes('smoke_v24111_hearerquest 入库（335 份）'));
ok('README 仍有 v24.109 守护描述（历史保留）', readme.includes('v24.109 起含「刻碑人「一凿入石」新支线」守护'));
ok('README 已有三百三十四件套口径且尚无 334（哨兵前望 334 语义：下一版才写 334）',
  readme.includes('冒烟三百五十九件套（三百五十八件套清除）') && !readme.includes('冒烟三百六十件套') && !readme.includes('（360 份）'));
ok('README tests 树串尾已延伸（…+ smoke_v24108_shopquest + smoke_v24109_carvequest + smoke_v24110_vowquest + smoke_v24111_hearerquest + smoke_v24112_talkquest + smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest（npm test 串跑））',
  readme.includes('smoke_v24108_shopquest + smoke_v24109_carvequest + smoke_v24110_vowquest + smoke_v24111_hearerquest + smoke_v24112_talkquest + smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest（npm test 串跑）'));
ok('README 支线/奖励行随新现实（二十四条 · 蓄石为誓 · VOW_GOAL）',
  readme.includes('四十四条支线目标/奖励全部由') &&
  readme.includes('蓄石为誓（记誓人 · [6]蓄力累计 `VOW_GOAL`(12) 次，凝神蓄力攒的就是那句誓的分量）70 金 + 2 药水') &&
  readme.includes('v24.110 补第二十四条'));
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 332 份（smoke.mjs + 332 专项）', chain.length === 358 && ['smoke.mjs', ...chain].length === 359, String(chain.length));
ok('package.json 链尾为 smoke_v24111_hearerquest（第 333 份）', chain[chain.length - 1] === 'smoke_v24136_herbquest', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v24110_vowquest.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v24109_carvequest.mjs && node tests/smoke_v24110_vowquest.mjs && node tests/smoke_v24111_hearerquest.mjs && node tests/smoke_v24112_talkquest.mjs && node tests/smoke_v24113_walkquest.mjs && node tests/smoke_v24114_fleequest.mjs && node tests/smoke_v24115_achhud.mjs && node tests/smoke_v24116_guidequest.mjs && node tests/smoke_v24117_codexhud.mjs && node tests/smoke_v24118_wellquest.mjs && node tests/smoke_v24119_huntquest.mjs && node tests/smoke_v24120_chesthud.mjs && node tests/smoke_v24121_siftquest.mjs && node tests/smoke_v24122_crystalquest.mjs && node tests/smoke_v24123_fraghud.mjs && node tests/smoke_v24124_questshud.mjs && node tests/smoke_v24125_hunthud.mjs && node tests/smoke_v24126_waitquest.mjs && node tests/smoke_v24127_lampquest.mjs && node tests/smoke_v24128_stelequest.mjs && node tests/smoke_v24129_stele2quest.mjs && node tests/smoke_v24130_stele3quest.mjs && node tests/smoke_v24131_stele4quest.mjs && node tests/smoke_v24132_fallenquest.mjs && node tests/smoke_v24133_inquest.mjs && node tests/smoke_v24134_kindleq.mjs && node tests/smoke_v24135_ledgerquest.mjs && node tests/smoke_v24136_herbquest.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.110（startsWith）', changelog.startsWith('## v24.138'));
ok('CHANGELOG v24.110 条目含「蓄石为誓」与「VOW_GOAL」与「记誓人」',
  changelog.includes('蓄石为誓') && changelog.includes('VOW_GOAL') && changelog.includes('记誓人'));
ok('CHANGELOG 仍保留 v24.109 条目（历史保留）', changelog.includes('## v24.109'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const testsDir = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录件套 = 333（332 + smoke_v24111_hearerquest）', files.length === 359, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.109 pin 零残留 ——
const s24109 = read('smoke_v24109_carvequest.mjs');
ok('smoke_v24109 的 GAME_VERSION 字面量 pin 已更新为 v24.110', s24109.includes("const GAME_VERSION = 'v24.138';"));
ok('smoke_v24109 的 CHANGELOG 顶 pin 已更新为 ## v24.110 ', s24109.includes("startsWith('## v24.138 '"));
ok('smoke_v24109 的件套 pin 已更新为三百五十九件套（三百五十八件套清除）', s24109.includes('三百五十九件套（三百五十八件套清除）'));
ok('smoke_v24109 的 README/链 tail pin 已随新现实延伸（含 smoke_v24111_hearerquest）',
  s24109.includes('smoke_v24111_hearerquest'));
ok('smoke_v24109 的 package.json 串尾 pin 已延伸至 smoke_v24111_hearerquest', s24109.includes('node tests/smoke_v24109_carvequest.mjs && node tests/smoke_v24110_vowquest.mjs'));
ok('smoke_v24109 的链尾 pin 已推进至 smoke_v24111_hearerquest（第 333 份）', s24109.includes("=== 'smoke_v24136_herbquest'"));
ok('smoke_v24109 的入库 pin 已推进至 333 份', s24109.includes('入库（335 份）'));
const s2436 = read('smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（334 专项 / 335）且尚无 336 口径哨兵',
  s2436.includes('suiteFiles.length === 358 && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length === 359') &&
  s2436.includes('!readme.includes(\'冒烟三百六十件套\')') && s2436.includes('!readme.includes(\'（360 份）\')'));
const s2415 = read('smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v24111_hearerquest（第 333 份）', s2415.includes("chain[chain.length - 1] === 'smoke_v24136_herbquest'"));
ok('smoke_v2415 树串 token 数已推进至 333', s2415.includes('treeTok.length === 359'));
// 旧代 v24.109 pin 零残留扫描（豁免本套件与上一代套件）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v24110_vowquest.mjs') continue;
  if (f === 'smoke_v24109_carvequest.mjs') continue;
  if (f === 'smoke_v24108_shopquest.mjs') continue;
  if (f === 'smoke_v24107_peddlequest.mjs') continue;
  if (f === 'smoke_v24106_moonquest.mjs') continue;
  if (f === 'smoke_v24100_talequest.mjs') continue;
  if (f === 'smoke_v24101_goldcurve26.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDir), 'utf8').split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  const hits = [];
  if (s2.includes("const GAME_VERSION = '" + "v24.109';")) hits.push('gv');
  if (s2.includes("GAME_VERSION === '" + "v24.109'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.109")) hits.push('cw');
  if (s2.includes('入库（33' + '2 份）')) hits.push('ruku');
  if (s2.includes('三百三十二件套（三百三十' + '一件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 33' + '2')) hits.push('fl');
  if (s2.includes('chainAll.length === 33' + '2')) hits.push('cal');
  if (s2.includes('chain.length === 33' + '1')) hits.push('cl');
  if (s2.includes('treeTok.length === 33' + '2')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v24109_" + "carvequest'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.109 GAME_VERSION/顶 pin/332 口径（哨兵链，豁免本套件）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.110 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
