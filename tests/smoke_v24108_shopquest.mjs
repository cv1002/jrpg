// smoke_v24108_shopquest.mjs —— v24.108 专项冒烟：第二十二条支线「开张的生意」（货栈掌柜·累计消费 SHOP_GOAL(300) 金）
// （新内容·新支线——承 v24.107 货郎「路远灯长」/ v24.106 放灯童「月亮的路」/ v24.105 琴师「战歌的谱」/
// v24.100 说书人「灯下新章」/ v24.82 守夜人「守夜的旧约」同一「风味 NPC 升格为支线委托人」先例：
// v22.49 纯风味 NPC「货栈掌柜」（潮灯镇商店门前 (8,10)，「雾语林的灯油断供以后货栈的空架子比货还多」）
// 升格为委托人——镇上每花掉一枚金币（买剑甲药水、住店、酿造都算）都算替货栈走出一单生意，替他走满
// SHOP_GOAL(300) 金（计数 hero.spent 与 ACH_LIST spend「一掷千金」同读一份源，支线门槛 300 低于
// 成就门槛 SPEND_GOAL(1000)，零新计数零新状态零新存档）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.108 注释 / GAME_VERSION v24.108 与旧 v24.107 字面量
// 零残留 / v22.49 及更早历史注释保留 / SHOP_GOAL 常量与 export）、QUESTS 契约（22 side + 4 main、
// side_shop 字段逐值、与 *_GOAL 同源、ACH_LIST allquests 同源互证）、quests.js 运行期状态机
// （offer→active→turnin→done 全链路 + resolveNpcTalk 接取/交付结算 80 金+2 生命药水 + npcQuestMark/
// npcQuestPages 四态 + sideQuestDone 0/22·3/22·22/22）、NPCS.shopkeep 升格落位（lines 两页与
// after 两页保留零内容丢失契约 + v2249 姊妹套件已随升格更新）、README/package.json/CHANGELOG 同步
// （件套口径 333 + v24.108 守护描述 + 入库 331 + package 串尾 + CHANGELOG 顶 pin）、tests 目录与
// 实跑链恒等（331）、哨兵链（前望 332 且 README 尚无 332 口径）、旧代 v24.107 pin 全库零残留扫描
// （字面量/顶 pin/330 口径 · 豁免本套件）。
import { GAME_VERSION, QUESTS, SHOP_GOAL, SPEND_GOAL, ACH_LIST, NPCS } from '../js/data.js';
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

console.log('— v24.108 货栈掌柜「开张的生意」新支线 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkgRaw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（格式合法 + 已越过 v24.107 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.107', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 107)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.108（旧 v24.107 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.155';") && !dSrc.includes("const GAME_VERSION = 'v24.107';"));
ok('data.js 含 v24.108 注释（开张的生意新支线说明）',
  dSrc.includes('v24.108 新内容·新支线（第二十二条）'));
ok('data.js 仍保留 v22.49 历史注释（货栈掌柜三件套说明，零内容丢失）',
  dSrc.includes('v22.49 新内容·纯风味 NPC') && dSrc.includes('灰比货多'));

// —— 源级落位：SHOP_GOAL 常量 + export ——
ok('data.js SHOP_GOAL 常量 = 300（与 PEDDLE_GOAL 比邻声明，同一家族）',
  dSrc.includes('const SHOP_GOAL = 300;') && dSrc.indexOf('const SHOP_GOAL') > dSrc.indexOf('const PEDDLE_GOAL'));
ok('data.js export 块含 SHOP_GOAL（PEDDLE_GOAL 之后用例）',
  dSrc.includes('MOON_GOAL, PEDDLE_GOAL, SHOP_GOAL,'));
ok('SHOP_GOAL 与 SPEND_GOAL 同族逐值（300 < 1000，支线门槛低于成就门槛——顺路先完成支线再解锁成就）',
  SHOP_GOAL === 300 && SPEND_GOAL === 1000 && SHOP_GOAL < SPEND_GOAL);

// —— QUESTS 契约：22 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 29 条（22 side + 4 main，派生计数）',
  sideDefs.length === 45 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 49,
  `${sideDefs.length}/${mainDefs.length}`);
ok('side_shop 存在且为第二十二条（kind side · store · npc/giver shopkeep · 无 unlockOn）',
  !!QUESTS.side_shop && QUESTS.side_shop.kind === 'side' && QUESTS.side_shop.store === true &&
  QUESTS.side_shop.npc === 'shopkeep' && QUESTS.side_shop.giver === 'shopkeep' &&
  QUESTS.side_shop.unlockOn == null);
ok('side_shop 名称「开张的生意」/where/obj/offer/turnin/done 落位',
  QUESTS.side_shop.name === '开张的生意' && QUESTS.side_shop.where.includes('累计消费') &&
  QUESTS.side_shop.obj.includes('花掉 ' + String(SHOP_GOAL) + ' 金') &&
  QUESTS.side_shop.obj.includes('住店') &&
  QUESTS.side_shop.offer.includes('货栈掌柜') && QUESTS.side_shop.turnin.includes('货栈掌柜') &&
  QUESTS.side_shop.done.includes('灰掸净了'));
ok('side_shop cond/condProg 与 SHOP_GOAL 同源（spent 计数，判/进/文/话一处调全端跟随）',
  QUESTS.side_shop.cond({ spent: SHOP_GOAL - 1 }) === false &&
  QUESTS.side_shop.cond({ spent: SHOP_GOAL }) === true &&
  QUESTS.side_shop.cond({}) === false && QUESTS.side_shop.cond({ spent: 0 }) === false &&
  QUESTS.side_shop.condProg({}) === `0/${SHOP_GOAL} 金` && QUESTS.side_shop.condProg({ spent: 120 }) === `120/${SHOP_GOAL} 金`);
ok('side_shop reward 逐值：80 金 + 2 生命药水（承 side_bell 80 金档、低于 side_fish 90 档）',
  QUESTS.side_shop.reward.gold === 80 && QUESTS.side_shop.reward.item === 2 && !QUESTS.side_shop.reward.potion2);

// —— ACH_LIST allquests 同源互证（与 sideQuestDone 输出一致）——
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('ACH_LIST allquests 名称「灯火同心」且描述派生 22（「33 个支线任务」）',
  !!achAll && achAll.name === '灯火同心' && achAll.d.includes('45 个支线任务'), achAll && achAll.d);
ok('ACH_LIST allquests 判定/进度与 QUESTS 派生同源（0/22 false · 21/22 false · 22/22 true · prog 22/22）',
  !!achAll && achAll.ok({ quests: {} }) === false && achAll.ok({ quests: Object.fromEntries(sideDefs.slice(0, 24).map(q => [q.id, 'done'])) }) === false &&
  achAll.ok({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === true &&
  achAll.prog({ quests: {} }) === '0/45' && achAll.prog({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === '45/45');

// —— quests.js 运行期：sideQuestDone ——
ok('运行期：sideQuestDone 0/22 · 3/22 · 22/22 · 主线不入列',
  sideQuestDone({ quests: {} }).done === 0 && sideQuestDone({ quests: {} }).total === 45 &&
  sideQuestDone({ quests: { side_mushroom: 'done', side_cart: 'done', side_pond: 'done' } }).done === 3 &&
  sideQuestDone({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }).done === 45 &&
  sideQuestDone({ quests: { main_demon: 'done' } }).done === 0);

// —— 运行期状态机：offer → active → turnin → done（quests 纯函数，零 DOM）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 3, hp: 60, hpMax: 60, mp: 20, mpMax: 20, atkMax: 13, defMax: 9,
    gold: 0, xp: 0, xpNext: 100, item: 1, potion2: 0, weapon: '铁剑', armor: '皮甲',
    skills: [], ach: [], seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, totalWins: 0,
    drops: 0, deflects: 0, casts: 0, travels: 0, sold: 0, spent: 0, x: 8, y: 11, map: 'village' }, extra || {});
}
const h1 = mkHero({});
ok('状态机：无存档 → questStatus offer（无 unlockOn 开局即可接，承 side_moon 同款）',
  questStatus(h1, 'side_shop') === 'offer', questStatus(h1, 'side_shop'));
ok('状态机：npcQuestMark offer 态「❕ 可接委托」',
  npcQuestMark(h1, 'shopkeep') === '❕ 可接委托', npcQuestMark(h1, 'shopkeep'));
ok('状态机：npcQuestPages offer 页（货栈掌柜 · 开张的生意 · SHOP_GOAL 同源）',
  JSON.stringify(npcQuestPages(h1, 'shopkeep')).includes('货栈掌柜') &&
  JSON.stringify(npcQuestPages(h1, 'shopkeep')).includes('比货还多') &&
  JSON.stringify(npcQuestPages(h1, 'shopkeep')).includes(String(SHOP_GOAL)) &&
  JSON.stringify(npcQuestPages(h1, 'shopkeep')).includes('接下委托'));
const rAcc = resolveNpcTalk(h1, 'shopkeep');
ok('状态机：resolveNpcTalk 接取 → {kind:accept, id:side_shop} + quests.side_shop=active',
  !!rAcc && rAcc.kind === 'accept' && rAcc.id === 'side_shop' && h1.quests.side_shop === 'active', JSON.stringify(rAcc));
ok('状态机：active 未达标 → questStatus active（cond 未满足）',
  questStatus(h1, 'side_shop') === 'active', questStatus(h1, 'side_shop'));
ok('状态机：active 页函数型实时报进度（已花 0/300 金）',
  JSON.stringify(npcQuestPages(h1, 'shopkeep')).includes('0/' + SHOP_GOAL + ' 金') &&
  JSON.stringify(npcQuestPages(h1, 'shopkeep')).includes('花掉'));
ok('状态机：任务日志 objective 同源（在镇上花掉 300 金 0/300 金）',
  questJournal(h1).find((e) => e.id === 'side_shop').objective.includes('花掉 ' + SHOP_GOAL + ' 金') &&
  questJournal(h1).find((e) => e.id === 'side_shop').objective.includes(`0/${SHOP_GOAL} 金`));
const h2 = mkHero({ quests: { side_shop: 'active' }, spent: SHOP_GOAL });
ok('状态机：达标（spent=SHOP_GOAL）→ questStatus turnin',
  questStatus(h2, 'side_shop') === 'turnin', questStatus(h2, 'side_shop'));
ok('状态机：npcQuestMark turnin 态「❕ 可交任务」',
  npcQuestMark(h2, 'shopkeep') === '❕ 可交任务', npcQuestMark(h2, 'shopkeep'));
const rRew = resolveNpcTalk(h2, 'shopkeep');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:80, item:2} + done + 结算 80 金/2 生命药水',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 80 && rRew.item === 2 &&
  h2.quests.side_shop === 'done' && h2.gold === 80 && h2.item === 3, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）',
  resolveNpcTalk(h2, 'shopkeep') === null);
ok('状态机：done 默认档（货走起来了）',
  JSON.stringify(npcQuestPages(h2, 'shopkeep')).includes('货走起来了'));
ok('状态机：done trueBoss 档（after 彩蛋「灯亮了旧货卖不动/账本能合上」两页并入任务页，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_shop: 'done' }, trueBoss: true }), 'shopkeep')).includes('旧货') &&
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_shop: 'done' }, trueBoss: true }), 'shopkeep')).includes('账本'));
ok('状态机：done 态 npcQuestMark 零顶标（shopkeep 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_shop: 'done' } }), 'shopkeep') === null);
ok('questRewardPreview 与 reward 同源（80 金 + 2 生命药水）',
  JSON.stringify(questRewardPreview(mkHero({}), 'side_shop')) === '{"gold":80,"item":2,"potion2":0}');

// —— 既有支线零回归（挑八条既有契约逐值钉死）——
ok('既有支线零回归：side_tale/side_fish/side_bell/side_golem/side_watch/side_song/side_moon/side_peddle 契约逐字未动',
  QUESTS.side_tale.reward.gold === 70 && QUESTS.side_tale.reward.item === 2 &&
  QUESTS.side_fish.reward.gold === 90 && QUESTS.side_fish.reward.item === 2 &&
  QUESTS.side_bell.reward.gold === 80 && QUESTS.side_bell.reward.potion2 === 1 &&
  QUESTS.side_golem.reward.gold === 120 && QUESTS.side_watch.reward.gold === 100 &&
  QUESTS.side_watch.reward.potion2 === 1 &&
  QUESTS.side_song.reward.gold === 60 && QUESTS.side_song.reward.potion2 === 1 &&
  QUESTS.side_moon.reward.gold === 60 && QUESTS.side_moon.reward.item === 2 &&
  QUESTS.side_peddle.reward.gold === 70 && QUESTS.side_peddle.reward.item === 2);

// —— NPCS.shopkeep 升格落位（零新 NPC/坐标/数据层三件套之外零改动）——
ok('NPCS.shopkeep 存在（货栈掌柜 · mark basket · 含 v24.108 升格注释）',
  !!NPCS.shopkeep && NPCS.shopkeep.name === '货栈掌柜' && NPCS.shopkeep.mark === 'basket' &&
  dSrc.includes('v24.108 升格为支线委托人'));
ok('NPCS.shopkeep 原有 lines 两页 / trueBoss after 两页彩蛋保留（零内容丢失契约）',
  Array.isArray(NPCS.shopkeep.lines) && NPCS.shopkeep.lines.length === 2 &&
  Array.isArray(NPCS.shopkeep.after) && NPCS.shopkeep.after.length === 2 &&
  NPCS.shopkeep.after[0][0].includes('灯亮了') && NPCS.shopkeep.after[1][0].includes('名字都回了灯下'));
ok('data.js village.extras 含货栈掌柜 (8,10) 与 NPC_SPOTS 键「8,10」（零新坐标）',
  dSrc.includes("{ x: 8, y: 10, ty: 'NPC' }") && dSrc.includes("'8,10'"));
ok('姊妹件 smoke_v2249_shopkeep 已随升格更新（无任务契约翻转为任务页契约）',
  read('smoke_v2249_shopkeep.mjs').includes('开张的生意') && read('smoke_v2249_shopkeep.mjs').includes('可接委托'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为三百六十七件套（三百六十六件套清除）',
  readme.includes('冒烟三百六十七件套（三百六十六件套清除）'));
ok('README tests 含 v24.108 守护描述与 smoke_v24111_hearerquest 入库（335 份）',
  readme.includes('v24.108 起含「货栈掌柜「开张的生意」新支线」守护') &&
  readme.includes('smoke_v24111_hearerquest 入库（335 份）'));
ok('README 仍有 v24.107 守护描述（历史保留）', readme.includes('v24.107 起含「货郎「路远灯长」新支线」守护'));
ok('README 已有三百三十四件套口径且尚无 332（哨兵前望 332 语义：下一版才写 332）',
  readme.includes('冒烟三百六十七件套（三百六十六件套清除）') && !readme.includes('冒烟三百六十八件套') && !readme.includes('（368 份）'));
ok('README tests 树串尾已延伸（…+ smoke_v24106_moonquest + smoke_v24107_peddlequest + smoke_v24108_shopquest + smoke_v24109_carvequest + smoke_v24110_vowquest + smoke_v24111_hearerquest + smoke_v24112_talkquest + smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑））',
  readme.includes('smoke_v24106_moonquest + smoke_v24107_peddlequest + smoke_v24108_shopquest + smoke_v24109_carvequest + smoke_v24110_vowquest + smoke_v24111_hearerquest + smoke_v24112_talkquest + smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑）'));
ok('README 支线/奖励行随新现实（二十二条 · 开张的生意 · SHOP_GOAL）',
  readme.includes('四十五条支线目标/奖励全部由') &&
  readme.includes('开张的生意（货栈掌柜 · 在镇上累计消费 `SHOP_GOAL`(300) 金，买剑甲药水/住店/酿造都算）80 金 + 2 药水') &&
  readme.includes('v24.108 补第二十二条'));
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 330 份（smoke.mjs + 330 专项）', chain.length === 366 && ['smoke.mjs', ...chain].length === 367, String(chain.length));
ok('package.json 链尾为 smoke_v24108_shopquest（第 331 份）', chain[chain.length - 1] === 'smoke_v24155_frugal', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v24108_shopquest.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v24107_peddlequest.mjs && node tests/smoke_v24108_shopquest.mjs && node tests/smoke_v24109_carvequest.mjs && node tests/smoke_v24110_vowquest.mjs && node tests/smoke_v24111_hearerquest.mjs && node tests/smoke_v24112_talkquest.mjs && node tests/smoke_v24113_walkquest.mjs && node tests/smoke_v24114_fleequest.mjs && node tests/smoke_v24115_achhud.mjs && node tests/smoke_v24116_guidequest.mjs && node tests/smoke_v24117_codexhud.mjs && node tests/smoke_v24118_wellquest.mjs && node tests/smoke_v24119_huntquest.mjs && node tests/smoke_v24120_chesthud.mjs && node tests/smoke_v24121_siftquest.mjs && node tests/smoke_v24122_crystalquest.mjs && node tests/smoke_v24123_fraghud.mjs && node tests/smoke_v24124_questshud.mjs && node tests/smoke_v24125_hunthud.mjs && node tests/smoke_v24126_waitquest.mjs && node tests/smoke_v24127_lampquest.mjs && node tests/smoke_v24128_stelequest.mjs && node tests/smoke_v24129_stele2quest.mjs && node tests/smoke_v24130_stele3quest.mjs && node tests/smoke_v24131_stele4quest.mjs && node tests/smoke_v24132_fallenquest.mjs && node tests/smoke_v24133_inquest.mjs && node tests/smoke_v24134_kindleq.mjs && node tests/smoke_v24135_ledgerquest.mjs && node tests/smoke_v24136_herbquest.mjs && node tests/smoke_v24143_furnacequest.mjs && node tests/smoke_v24147_unflicker.mjs && node tests/smoke_v24148_swift.mjs && node tests/smoke_v24151_lowlv.mjs && node tests/smoke_v24152_nopotion.mjs && node tests/smoke_v24153_penny.mjs && node tests/smoke_v24154_steadfast.mjs && node tests/smoke_v24155_frugal.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.108（startsWith）', changelog.startsWith('## v24.155'));
ok('CHANGELOG v24.108 条目含「开张的生意」与「SHOP_GOAL」与「货栈掌柜」',
  changelog.includes('开张的生意') && changelog.includes('SHOP_GOAL') && changelog.includes('货栈掌柜'));
ok('CHANGELOG 仍保留 v24.107 条目（历史保留）', changelog.includes('## v24.107'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const testsDir = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录件套 = 331（330 + smoke_v24108_shopquest）', files.length === 367, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.107 pin 零残留 ——
const s24107 = read('smoke_v24107_peddlequest.mjs');
ok('smoke_v24107 的 GAME_VERSION 字面量 pin 已更新为 v24.108', s24107.includes("const GAME_VERSION = 'v24.155';"));
ok('smoke_v24107 的 CHANGELOG 顶 pin 已更新为 ## v24.108 ', s24107.includes("startsWith('## v24.155 '"));
ok('smoke_v24107 的件套 pin 已更新为三百六十七件套（三百六十六件套清除）', s24107.includes('三百六十七件套（三百六十六件套清除）'));
ok('smoke_v24107 的 README/链 tail pin 已随新现实延伸（含 smoke_v24108_shopquest）',
  s24107.includes('smoke_v24111_hearerquest'));
ok('smoke_v24107 的 package.json 串尾 pin 已延伸至 smoke_v24108_shopquest', s24107.includes('node tests/smoke_v24107_peddlequest.mjs && node tests/smoke_v24108_shopquest.mjs && node tests/smoke_v24109_carvequest.mjs && node tests/smoke_v24110_vowquest.mjs && node tests/smoke_v24111_hearerquest.mjs'));
ok('smoke_v24107 的链尾 pin 已推进至 smoke_v24108_shopquest（第 331 份）', s24107.includes("=== 'smoke_v24155_frugal'"));
ok('smoke_v24107 的入库 pin 已推进至 331 份', s24107.includes('入库（335 份）'));
const s2436 = read('smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（330 专项 / 331）且尚无 332 口径哨兵',
  s2436.includes('suiteFiles.length ===  366  && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length ===  367') &&
  s2436.includes('!readme.includes(\'冒烟三百六十八件套\')') && s2436.includes('!readme.includes(\'（368 份）\')'));
const s2415 = read('smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v24108_shopquest（第 331 份）', s2415.includes("chain[chain.length - 1] === 'smoke_v24155_frugal'"));
ok('smoke_v2415 树串 token 数已推进至 331', s2415.includes('treeTok.length === 367'));
// 旧代 v24.107 pin 零残留扫描（豁免本套件）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v24108_shopquest.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDir), 'utf8').split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  const hits = [];
  if (s2.includes("const GAME_VERSION = '" + "v24.107';")) hits.push('gv');
  if (s2.includes("GAME_VERSION === '" + "v24.107'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.107")) hits.push('cw');
  if (s2.includes('入库（33' + '0 份）')) hits.push('ruku');
  if (s2.includes('三百三十件套（三百二十九' + '件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 33' + '0')) hits.push('fl');
  if (s2.includes('chainAll.length === 33' + '0')) hits.push('cal');
  if (s2.includes('chain.length === 32' + '9')) hits.push('cl');
  if (s2.includes('treeTok.length === 33' + '0')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v24107_" + "peddlequest'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.107 GAME_VERSION/顶 pin/330 口径（哨兵链，豁免本套件）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.108 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
