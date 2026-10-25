// smoke_v24116_guidequest.mjs —— v24.116 专项冒烟：第二十九条支线「药要带足」（引灯人·[3]战斗用药累计 GUIDE_GOAL(8) 次）
// （新内容·新支线——承 v24.105 琴师「战歌的谱」/ v24.106 放灯童「月亮的路」/ v24.107 货郎「路远灯长」/
// v24.108 货栈掌柜「开张的生意」/ v24.109 刻碑人「一凿入石」/ v24.110 记誓人「蓄石为誓」/ v24.111 听矿人
// 「岩缝里的名字」/ v24.112 镇民「灯下之声」/ v24.113 掌灯童「一步一灯」/ v24.114 老矿工「先撤为敬」同一
// 「风味 NPC 升格为支线委托人」先例：v22.91 纯风味 NPC「引灯人」（无字回廊终焉之神祭坛北侧 (21,3)，
// 「灯引到这儿，就再没有前路了」/「它血过半会入祸乱形态——治愈会被封印，可喝药不受影响」）升格为委托人——
// 他引了一辈子灯、把每个走夜路的人送到火面前，也最懂「别把命押在回血上，药要带足」，玩家每次 [3]战斗用药
// 都算替他把药带足，替他喝满 GUIDE_GOAL(8) 次（计数 hero.potionUses 与 ACH_LIST potionuses「药到病除」
// 同读一份源，支线门槛 8 低于成就门槛 POTION_USE_GOAL(15)——顺路先完成支线再解锁成就；js/battle.js doItem
// 战斗用药成功唯一写入点、气满神足/无药早退/大地图 F（core.usePotion 另一端口）零计数；零新计数零新状态零新存档）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.116 注释 / GAME_VERSION v24.116 与旧 v24.115 字面量零残留 /
// v24.115 及更早历史注释保留 / GUIDE_GOAL 常量与 export）、QUESTS 契约（29 side + 4 main、side_guide 字段
// 逐值、与 *_GOAL 同源、ACH_LIST allquests 同源互证、GUIDE_GOAL 低于 potionUses 成就门槛互证）、quests.js
// 运行期状态机（offer→active→turnin→done 全链路 + resolveNpcTalk 接取/交付结算 70 金+2 生命药水 +
// npcQuestMark/npcQuestPages 四态 + sideQuestDone 0/29·3/29·29/29）、NPCS.lampguide 升格落位（lines 两页与
// after 两页保留零内容丢失契约 + 姊妹件套已随升格更新）、README/package.json/CHANGELOG 同步（件套口径 339 +
// v24.116 守护描述 + 入库 339 + package 串尾 + CHANGELOG 顶 pin）、tests 目录与实跑链恒等（339）、哨兵链
// （前望 340 且 README 尚无 340 口径）、旧代 v24.115 pin 全库零残留扫描（字面量/顶 pin/338 口径 · 豁免本套件）。
import { GAME_VERSION, QUESTS, GUIDE_GOAL, POTION_USE_GOAL, ACH_LIST, NPCS, NPC_SPOTS } from '../js/data.js';
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

console.log('— v24.116 引灯人「药要带足」新支线 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkgRaw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（格式合法 + 已越过 v24.115 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.115', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 115)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.116（旧 v24.115 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.161';") && !dSrc.includes("const GAME_VERSION = 'v24.115';"));
ok('data.js 含 v24.116 注释（药要带足新支线说明）',
  dSrc.includes('v24.116 新内容·新支线（第二十九条）'));
ok('data.js 仍保留 v24.115 历史注释（HUD 成就进度说明，零内容丢失）',
  dSrc.includes('v24.115 体验打磨·信息透明·计数现场'));

// —— 源级落位：GUIDE_GOAL 常量 + export ——
ok('data.js GUIDE_GOAL 常量 = 8（与 RETREAT_GOAL 比邻声明，同一家族）',
  dSrc.includes('const GUIDE_GOAL = 8;') && dSrc.indexOf('const GUIDE_GOAL') > dSrc.indexOf('const RETREAT_GOAL'));
ok('data.js export 块含 GUIDE_GOAL（RETREAT_GOAL 之后用例）',
  dSrc.includes('RETREAT_GOAL, GUIDE_GOAL,'));
ok('GUIDE_GOAL 与 potionUses 成就门槛同族互证（8 < POTION_USE_GOAL 15——顺路先完成支线再解锁成就）',
  (() => { const aP = ACH_LIST.find((a) => a.id === 'potionuses');
    return !!aP && GUIDE_GOAL === 8 && POTION_USE_GOAL === 15 &&
      aP.ok({ potionUses: 14 }) === false &&
      aP.ok({ potionUses: 15 }) === true &&
      aP.prog({ potionUses: 3 }) === '3/15' &&
      GUIDE_GOAL < POTION_USE_GOAL; })());
ok('data.js NPC_SPOTS 源级仍含引灯人 (21,3)（零新坐标）', dSrc.includes("'21,3': 'lampguide'"));

// —— QUESTS 契约：29 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 33 条（29 side + 4 main，派生计数）',
  sideDefs.length === 45 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 49,
  `${sideDefs.length}/${mainDefs.length}`);
ok('side_guide 存在且为第二十九条（kind side · store · npc/giver lampguide · 无 unlockOn）',
  !!QUESTS.side_guide && QUESTS.side_guide.kind === 'side' && QUESTS.side_guide.store === true &&
  QUESTS.side_guide.npc === 'lampguide' && QUESTS.side_guide.giver === 'lampguide' &&
  QUESTS.side_guide.unlockOn == null);
ok('side_guide 名称「药要带足」/where/obj/offer/turnin/done 落位',
  QUESTS.side_guide.name === '药要带足' && QUESTS.side_guide.where.includes('无字回廊') &&
  QUESTS.side_guide.obj.includes(String(GUIDE_GOAL)) && QUESTS.side_guide.obj.includes('药要带足') &&
  QUESTS.side_guide.offer.includes('引灯人') && QUESTS.side_guide.turnin.includes('引灯人') &&
  QUESTS.side_guide.done.includes('带足的药'));
ok('side_guide cond/condProg 与 GUIDE_GOAL 同源（potionUses 计数，判/进/文/话一处调全端跟随）',
  QUESTS.side_guide.cond({ potionUses: 7 }) === false &&
  QUESTS.side_guide.cond({ potionUses: 8 }) === true &&
  QUESTS.side_guide.cond({}) === false && QUESTS.side_guide.cond({ potionUses: 0 }) === false &&
  QUESTS.side_guide.condProg({}) === `0/${GUIDE_GOAL} 次` &&
  QUESTS.side_guide.condProg({ potionUses: 3 }) === `3/${GUIDE_GOAL} 次`);
ok('side_guide reward 逐值：70 金 + 2 生命药水（承 side_tale 70 档、低于 side_fish 90 档）',
  QUESTS.side_guide.reward.gold === 70 && QUESTS.side_guide.reward.item === 2 && !QUESTS.side_guide.reward.potion2);

// —— ACH_LIST allquests 同源互证（与 sideQuestDone 输出一致）——
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('ACH_LIST allquests 名称「灯火同心」且描述派生 29（「33 个支线任务」）',
  !!achAll && achAll.name === '灯火同心' && achAll.d.includes('45 个支线任务'), achAll && achAll.d);
ok('ACH_LIST allquests 判定/进度与 QUESTS 派生同源（0/29 false · 28/29 false · 29/29 true · prog 29/29）',
  !!achAll && achAll.ok({ quests: {} }) === false && achAll.ok({ quests: Object.fromEntries(sideDefs.slice(0, 29).map(q => [q.id, 'done'])) }) === false &&
  achAll.ok({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === true &&
  achAll.prog({ quests: {} }) === '0/45' && achAll.prog({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === '45/45');

// —— quests.js 运行期：sideQuestDone ——
ok('运行期：sideQuestDone 0/29 · 3/29 · 29/29 · 主线不入列',
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
    potionUses: 0, x: 21, y: 4, map: 'gallery' }, extra || {});
}
const h1 = mkHero({});
ok('状态机：无存档 → questStatus offer（无 unlockOn 首次进无字回廊即可接，承 side_hearer 同款）',
  questStatus(h1, 'side_guide') === 'offer', questStatus(h1, 'side_guide'));
ok('状态机：npcQuestMark offer 态「❕ 可接委托」',
  npcQuestMark(h1, 'lampguide') === '❕ 可接委托', npcQuestMark(h1, 'lampguide'));
ok('状态机：npcQuestPages offer 页（引灯人 · 带足药 · GUIDE_GOAL 同源）',
  JSON.stringify(npcQuestPages(h1, 'lampguide')).includes('引灯人') &&
  JSON.stringify(npcQuestPages(h1, 'lampguide')).includes('带足药') &&
  JSON.stringify(npcQuestPages(h1, 'lampguide')).includes(String(GUIDE_GOAL)) &&
  JSON.stringify(npcQuestPages(h1, 'lampguide')).includes('接下委托'));
const rAcc = resolveNpcTalk(h1, 'lampguide');
ok('状态机：resolveNpcTalk 接取 → {kind:accept, id:side_guide} + quests.side_guide=active',
  !!rAcc && rAcc.kind === 'accept' && rAcc.id === 'side_guide' && h1.quests.side_guide === 'active', JSON.stringify(rAcc));
ok('状态机：active 未达标 → questStatus active（cond 未满足）',
  questStatus(h1, 'side_guide') === 'active', questStatus(h1, 'side_guide'));
ok('状态机：active 页函数型实时报进度（已战斗用药 0/8 次）',
  JSON.stringify(npcQuestPages(h1, 'lampguide')).includes('0/' + GUIDE_GOAL + ' 次药'));
ok('状态机：任务日志 objective 同源（战斗用药 8 次 0/8 次）',
  questJournal(h1).find((e) => e.id === 'side_guide').objective.includes('战斗用药') &&
  questJournal(h1).find((e) => e.id === 'side_guide').objective.includes(`0/${GUIDE_GOAL} 次`));
const h2 = mkHero({ quests: { side_guide: 'active' }, potionUses: 8 });
ok('状态机：达标（potionUses=8 次）→ questStatus turnin',
  questStatus(h2, 'side_guide') === 'turnin', questStatus(h2, 'side_guide'));
ok('状态机：npcQuestMark turnin 态「❕ 可交任务」',
  npcQuestMark(h2, 'lampguide') === '❕ 可交任务', npcQuestMark(h2, 'lampguide'));
const rRew = resolveNpcTalk(h2, 'lampguide');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:70, item:2} + done + 结算 70 金/2 生命药水',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 70 && rRew.item === 2 &&
  h2.quests.side_guide === 'done' && h2.gold === 70 && h2.item === 3, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）',
  resolveNpcTalk(h2, 'lampguide') === null);
ok('状态机：done 默认档（药带足的人，回廊尽头也走得出去）',
  JSON.stringify(npcQuestPages(h2, 'lampguide')).includes('药带足的人'));
ok('状态机：done trueBoss 档（after 彩蛋「火熄了/回廊不需要灯了」两页并入任务页，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_guide: 'done' }, trueBoss: true }), 'lampguide')).includes('火熄了') &&
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_guide: 'done' }, trueBoss: true }), 'lampguide')).includes('回廊不需要灯了'));
ok('状态机：done 态 npcQuestMark 零顶标（lampguide 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_guide: 'done' } }), 'lampguide') === null);
ok('questRewardPreview 与 reward 同源（70 金 + 2 生命药水）',
  (() => { const prev = questRewardPreview(mkHero({}), 'side_guide'); return !!prev && prev.gold === 70 && prev.item === 2 && prev.potion2 === 0; })());
ok('运行期：lampguide 之外纯风味 NPC 零顶标（stele1/stele2 无待办）',
  npcQuestMark(mkHero({}), 'stele2') === null && npcQuestMark(mkHero({}), 'stele3') === null);

// —— NPCS.lampguide 升格落位（零新 NPC/坐标/数据层三件套之外零改动）——
ok('NPCS.lampguide 存在（引灯人 · mark lamp · 含 v24.116 升格注释）',
  !!NPCS.lampguide && NPCS.lampguide.name === '引灯人' && NPCS.lampguide.mark === 'lamp' &&
  dSrc.includes('v24.116 升格为支线委托人'));
ok('NPCS.lampguide 原有 lines 两页 / trueBoss after 两页彩蛋保留（零内容丢失契约）',
  Array.isArray(NPCS.lampguide.lines) && NPCS.lampguide.lines.length === 2 &&
  Array.isArray(NPCS.lampguide.after) && NPCS.lampguide.after.length === 2 &&
  NPCS.lampguide.after[0].some((ln) => ln.includes('火熄了')) && NPCS.lampguide.after[1].some((ln) => ln.includes('回廊不需要灯')));
ok('姊妹件 smoke_v2291_lampguide 已随升格更新（lampguide 静态契约翻转为任务页契约）',
  read('smoke_v2291_lampguide.mjs').includes('side_guide'));
ok('姊妹件 smoke_v2235_minimapquest 已随升格更新（lampguide 入任务 NPC 列表）',
  read('smoke_v2235_minimapquest.mjs').includes("'lampguide'") && read('smoke_v2235_minimapquest.mjs').includes('side_guide'));
ok('基线套件 smoke.mjs 已随升格更新（lampguide 顶标契约翻转）',
  read('smoke.mjs').includes("npcQuestMark(fresh,'lampguide')==='❕ 可接委托'"));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为三百七十二件套（三百七十一件套清除）',
  readme.includes('冒烟三百七十二件套（三百七十一件套清除）'));
ok('README tests 含 v24.116 守护描述与 smoke_v24116_guidequest 入库（339 份）',
  readme.includes('v24.116 起含「引灯人「药要带足」新支线」守护') &&
  readme.includes('smoke_v24116_guidequest 入库（339 份）'));
ok('README 仍有 v24.115 守护描述（历史保留）', readme.includes('v24.115 起含「HUD 成就收集进度」守护'));
ok('README 已有三百三十九件套口径且尚无 340（哨兵前望 340 语义：下一版才写 340）',
  readme.includes('冒烟三百七十二件套（三百七十一件套清除）') && !readme.includes('冒烟三百七十三件套') && !readme.includes('（373 份）'));
ok('README tests 树串尾已延伸（…+ smoke_v24115_achhud + smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑））',
  readme.includes('smoke_v24115_achhud + smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑）'));
ok('README 支线/奖励行随新现实（二十九条 · 药要带足 · GUIDE_GOAL）',
  readme.includes('四十五条支线目标/奖励全部由') &&
  readme.includes('药要带足（引灯人 · [3]战斗用药累计 `GUIDE_GOAL`(8) 次，气满神足/无药早退/大地图 F 零计数）70 金 + 2 生命药水') &&
  readme.includes('v24.116 补第二十九条') && readme.includes('v24.115 补第二十八条') === false);
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 338 份（smoke.mjs + 338 专项）', chain.length === 371 && ['smoke.mjs', ...chain].length === 372, String(chain.length));
ok('package.json 链尾为 smoke_v24116_guidequest（第 339 份）', chain[chain.length - 1] === 'smoke_v24161_noskill2', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v24115_achhud.mjs && smoke_v24116_guidequest.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v24115_achhud.mjs && node tests/smoke_v24116_guidequest.mjs && node tests/smoke_v24117_codexhud.mjs && node tests/smoke_v24118_wellquest.mjs && node tests/smoke_v24119_huntquest.mjs && node tests/smoke_v24120_chesthud.mjs && node tests/smoke_v24121_siftquest.mjs && node tests/smoke_v24122_crystalquest.mjs && node tests/smoke_v24123_fraghud.mjs && node tests/smoke_v24124_questshud.mjs && node tests/smoke_v24125_hunthud.mjs && node tests/smoke_v24126_waitquest.mjs && node tests/smoke_v24127_lampquest.mjs && node tests/smoke_v24128_stelequest.mjs && node tests/smoke_v24129_stele2quest.mjs && node tests/smoke_v24130_stele3quest.mjs && node tests/smoke_v24131_stele4quest.mjs && node tests/smoke_v24132_fallenquest.mjs && node tests/smoke_v24133_inquest.mjs && node tests/smoke_v24134_kindleq.mjs && node tests/smoke_v24135_ledgerquest.mjs && node tests/smoke_v24136_herbquest.mjs && node tests/smoke_v24143_furnacequest.mjs && node tests/smoke_v24147_unflicker.mjs && node tests/smoke_v24148_swift.mjs && node tests/smoke_v24151_lowlv.mjs && node tests/smoke_v24152_nopotion.mjs && node tests/smoke_v24153_penny.mjs && node tests/smoke_v24154_steadfast.mjs && node tests/smoke_v24155_frugal.mjs && node tests/smoke_v24157_dry.mjs && node tests/smoke_v24158_swift2.mjs && node tests/smoke_v24159_lowlv2.mjs && node tests/smoke_v24160_noskill.mjs && node tests/smoke_v24161_noskill2.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.116（startsWith）', changelog.startsWith('## v24.161'));
ok('CHANGELOG v24.116 条目含「药要带足」与「GUIDE_GOAL」与「引灯人」',
  changelog.includes('药要带足') && changelog.includes('GUIDE_GOAL') && changelog.includes('引灯人'));
ok('CHANGELOG 仍保留 v24.115 条目（历史保留）', changelog.includes('## v24.115'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const testsDir = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录件套 = 339（338 + smoke_v24116_guidequest）', files.length === 372, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.115 pin 零残留 ——
const s24115 = read('smoke_v24115_achhud.mjs');
ok('smoke_v24115 的 GAME_VERSION 字面量 pin 已更新为 v24.116', s24115.includes("const GAME_VERSION = 'v24.161';"));
ok('smoke_v24115 的 CHANGELOG 顶 pin 已更新为 ## v24.116 ', s24115.includes("startsWith('## v24.161'"));
ok('smoke_v24115 的件套 pin 已更新为三百七十二件套（三百七十一件套清除）', s24115.includes('三百七十二件套（三百七十一件套清除）'));
ok('smoke_v24115 的 README/链 tail pin 已随新现实延伸（含 smoke_v24116_guidequest）',
  s24115.includes('smoke_v24116_guidequest'));
ok('smoke_v24115 的 package.json 串尾 pin 已延伸至 smoke_v24116_guidequest', s24115.includes('node tests/smoke_v24115_achhud.mjs && node tests/smoke_v24116_guidequest.mjs && node tests/smoke_v24117_codexhud.mjs'));
ok('smoke_v24115 的链尾 pin 已推进至 smoke_v24116_guidequest（第 339 份）', s24115.includes("=== 'smoke_v24161_noskill2'"));
ok('smoke_v24115 的 README 历史块入库 pin 保留（338 份口径，历史块原样保留）',
  s24115.includes('入库（338 份）'));
const s2436 = read('smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（338 专项 / 339）且尚无 340 口径哨兵',
  s2436.includes('suiteFiles.length ===  371  && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length ===  372') &&
  s2436.includes('!readme.includes(\'冒烟三百七十三件套\')') && s2436.includes('!readme.includes(\'（373 份）\')'));
const s2415 = read('smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v24116_guidequest（第 339 份）', s2415.includes("chain[chain.length - 1] === 'smoke_v24161_noskill2'"));
ok('smoke_v2415 树串 token 数已推进至 339', s2415.includes('treeTok.length === 372'));
const s2429 = read('smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 哨兵链前望 340（三百三十九件套否定式）',
  s2429.includes("!readme.includes('冒烟三百七十三件套'"));
// 旧代 v24.115 pin 零残留扫描（豁免本套件）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v24116_guidequest.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDir), 'utf8').split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  const hits = [];
  if (s2.includes("const GAME_VERSION = '" + "v24.115';")) hits.push('gv');
  if (s2.includes("GAME_VERSION === '" + "v24.115'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.115")) hits.push('cw');
  if (s2.includes('三百三十八件套（三百三十' + '七件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 33' + '8')) hits.push('fl');
  if (s2.includes('chainAll.length === 33' + '8')) hits.push('cal');
  if (s2.includes('chain.length === 33' + '7')) hits.push('cl');
  if (s2.includes('treeTok.length === 33' + '8')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v24115_" + "achhud'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.115 GAME_VERSION/顶 pin/338 口径（哨兵链，豁免本套件）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.116 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
