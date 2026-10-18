// smoke_v24111_hearerquest.mjs —— v24.111 专项冒烟：第二十五条支线「岩缝里的名字」（听矿人·记忆图鉴讨伐收录累计 BESTIARY_GOAL(4) 种）
// （新内容·新支线——承 v24.110 记誓人「蓄石为誓」/ v24.109 刻碑人「一凿入石」/ v24.108 货栈掌柜「开张的生意」/
// v24.107 货郎「路远灯长」/ v24.106 放灯童「月亮的路」/ v24.105 琴师「战歌的谱」/ v24.100 说书人「灯下新章」同一
// 「风味 NPC 升格为支线委托人」先例：v22.20 纯风味 NPC「听矿人」（星井矿脉北廊 (13,2)，「把耳朵贴上岩壁，这条
// 矿脉会嗡嗡响」）升格为委托人——每讨伐一种新魔物，名字就落进记忆图鉴一处，替他记满 BESTIARY_GOAL(4) 种
// （计数 hero.bestiary 与 ACH_LIST scholar「记忆收藏家」/scholar2「见多识广」同读一份源，支线门槛 4 低于成就
// 门槛 SCHOLAR_GOAL(5)，只有讨伐过才落图鉴——遇见过不算，与说书人 side_tale 的 seen 遭遇端口区分开；零新计数
// 零新状态零新存档）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.111 注释 / GAME_VERSION v24.111 与旧 v24.110 字面量零残留 /
// v22.20 及更早历史注释保留 / BESTIARY_GOAL 常量与 export）、QUESTS 契约（26 side + 4 main、side_hearer 字段
// 逐值、与 *_GOAL 同源、ACH_LIST allquests 同源互证、BESTIARY_GOAL 低于 scholar 门槛互证）、quests.js 运行期
// 状态机（offer→active→turnin→done 全链路 + resolveNpcTalk 接取/交付结算 60 金+1 高级灵药 + npcQuestMark/
// npcQuestPages 四态 + sideQuestDone 0/26·3/26·26/26）、NPCS.hearer 升格落位（lines 两页与 after 两页保留
// 零内容丢失契约 + v2220 姊妹套件已随升格更新）、README/package.json/CHANGELOG 同步（件套口径 334 + v24.111
// 守护描述 + 入库 334 + package 串尾 + CHANGELOG 顶 pin）、tests 目录与实跑链恒等（334）、哨兵链（前望 335 且
// README 尚无 335 口径）、旧代 v24.110 pin 全库零残留扫描（字面量/顶 pin/333 口径 · 豁免本套件与上一代套件）。
import { GAME_VERSION, QUESTS, BESTIARY_GOAL, ACH_LIST, NPCS } from '../js/data.js';
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

console.log('— v24.111 听矿人「岩缝里的名字」新支线 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkgRaw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（格式合法 + 已越过 v24.110 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.110', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 110)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.111（旧 v24.110 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.116';") && !dSrc.includes("const GAME_VERSION = 'v24.110';"));
ok('data.js 含 v24.111 注释（岩缝里的名字新支线说明）',
  dSrc.includes('v24.111 新内容·新支线（第二十五条）'));
ok('data.js 仍保留 v24.110 历史注释（蓄石为誓说明，零内容丢失）',
  dSrc.includes('v24.110 新内容·新支线（第二十四条）') && dSrc.includes('v24.110 升格为支线委托人'));

// —— 源级落位：BESTIARY_GOAL 常量 + export ——
ok('data.js BESTIARY_GOAL 常量 = 4（与 VOW_GOAL 比邻声明，同一家族）',
  dSrc.includes('const BESTIARY_GOAL = 4;') && dSrc.indexOf('const BESTIARY_GOAL') > dSrc.indexOf('const VOW_GOAL'));
ok('data.js export 块含 BESTIARY_GOAL（VOW_GOAL 之后用例）',
  dSrc.includes('VOW_GOAL, BESTIARY_GOAL,'));
ok('BESTIARY_GOAL 与 scholar 成就门槛同族互证（4 < SCHOLAR_GOAL(5)——顺路先完成支线再解锁成就）',
  (() => { const aSch = ACH_LIST.find((a) => a.id === 'scholar');
    return !!aSch && BESTIARY_GOAL === 4 &&
      aSch.ok({ bestiary: Object.fromEntries([0, 1, 2, 3].map((i) => ['m' + i, 1])) }) === false &&
      aSch.ok({ bestiary: Object.fromEntries([0, 1, 2, 3, 4].map((i) => ['m' + i, 1])) }) === true; })());

// —— QUESTS 契约：26 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 29 条（26 side + 4 main，派生计数）',
  sideDefs.length === 29 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 33,
  `${sideDefs.length}/${mainDefs.length}`);
ok('side_hearer 存在且为第二十五条（kind side · store · npc/giver hearer · 无 unlockOn）',
  !!QUESTS.side_hearer && QUESTS.side_hearer.kind === 'side' && QUESTS.side_hearer.store === true &&
  QUESTS.side_hearer.npc === 'hearer' && QUESTS.side_hearer.giver === 'hearer' &&
  QUESTS.side_hearer.unlockOn == null);
ok('side_hearer 名称「岩缝里的名字」/where/obj/offer/turnin/done 落位',
  QUESTS.side_hearer.name === '岩缝里的名字' && QUESTS.side_hearer.where.includes('星井矿脉') &&
  QUESTS.side_hearer.obj.includes(String(BESTIARY_GOAL)) && QUESTS.side_hearer.obj.includes('讨伐过才落图鉴') &&
  QUESTS.side_hearer.offer.includes('听矿人') && QUESTS.side_hearer.turnin.includes('听矿人') &&
  QUESTS.side_hearer.done.includes('歇脚'));
ok('side_hearer cond/condProg 与 BESTIARY_GOAL 同源（bestiary 计数，判/进/文/话一处调全端跟随）',
  QUESTS.side_hearer.cond({ bestiary: Object.fromEntries([0, 1, 2].map((i) => ['m' + i, 1])) }) === false &&
  QUESTS.side_hearer.cond({ bestiary: Object.fromEntries([0, 1, 2, 3].map((i) => ['m' + i, 1])) }) === true &&
  QUESTS.side_hearer.cond({}) === false && QUESTS.side_hearer.cond({ bestiary: {} }) === false &&
  QUESTS.side_hearer.condProg({}) === `0/${BESTIARY_GOAL} 种` &&
  QUESTS.side_hearer.condProg({ bestiary: { a: 1, b: 1, c: 1, d: 1 } }) === `4/${BESTIARY_GOAL} 种`);
ok('side_hearer reward 逐值：60 金 + 1 高级灵药（承 side_song 60+1 灵药档、与 side_stone 同档）',
  QUESTS.side_hearer.reward.gold === 60 && QUESTS.side_hearer.reward.potion2 === 1 && !QUESTS.side_hearer.reward.item);

// —— ACH_LIST allquests 同源互证（与 sideQuestDone 输出一致）——
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('ACH_LIST allquests 名称「灯火同心」且描述派生 25（「29 个支线任务」）',
  !!achAll && achAll.name === '灯火同心' && achAll.d.includes('29 个支线任务'), achAll && achAll.d);
ok('ACH_LIST allquests 判定/进度与 QUESTS 派生同源（0/26 false · 25/26 false · 26/26 true · prog 26/26）',
  !!achAll && achAll.ok({ quests: {} }) === false && achAll.ok({ quests: Object.fromEntries(sideDefs.slice(0, 24).map(q => [q.id, 'done'])) }) === false &&
  achAll.ok({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === true &&
  achAll.prog({ quests: {} }) === '0/29' && achAll.prog({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === '29/29');

// —— quests.js 运行期：sideQuestDone ——
ok('运行期：sideQuestDone 0/26 · 3/26 · 26/26 · 主线不入列',
  sideQuestDone({ quests: {} }).done === 0 && sideQuestDone({ quests: {} }).total === 29 &&
  sideQuestDone({ quests: { side_mushroom: 'done', side_cart: 'done', side_pond: 'done' } }).done === 3 &&
  sideQuestDone({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }).done === 29 &&
  sideQuestDone({ quests: { main_demon: 'done' } }).done === 0);

// —— 运行期状态机：offer → active → turnin → done（quests 纯函数，零 DOM）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 3, hp: 60, hpMax: 60, mp: 20, mpMax: 20, atkMax: 13, defMax: 9,
    gold: 0, xp: 0, xpNext: 100, item: 1, potion2: 0, weapon: '铁剑', armor: '皮甲',
    skills: [], ach: [], seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, totalWins: 0,
    drops: 0, deflects: 0, casts: 0, travels: 0, sold: 0, spent: 0, crits: 0, charges: 0, x: 13, y: 3, map: 'cave' }, extra || {});
}
const h1 = mkHero({});
ok('状态机：无存档 → questStatus offer（无 unlockOn 首次进星井矿脉即可接，承 side_bell 同款）',
  questStatus(h1, 'side_hearer') === 'offer', questStatus(h1, 'side_hearer'));
ok('状态机：npcQuestMark offer 态「❕ 可接委托」',
  npcQuestMark(h1, 'hearer') === '❕ 可接委托', npcQuestMark(h1, 'hearer'));
ok('状态机：npcQuestPages offer 页（听矿人 · 岩缝里的名字 · BESTIARY_GOAL 同源）',
  JSON.stringify(npcQuestPages(h1, 'hearer')).includes('听矿人') &&
  JSON.stringify(npcQuestPages(h1, 'hearer')).includes('岩壁') &&
  JSON.stringify(npcQuestPages(h1, 'hearer')).includes(String(BESTIARY_GOAL)) &&
  JSON.stringify(npcQuestPages(h1, 'hearer')).includes('接下委托'));
const rAcc = resolveNpcTalk(h1, 'hearer');
ok('状态机：resolveNpcTalk 接取 → {kind:accept, id:side_hearer} + quests.side_hearer=active',
  !!rAcc && rAcc.kind === 'accept' && rAcc.id === 'side_hearer' && h1.quests.side_hearer === 'active', JSON.stringify(rAcc));
ok('状态机：active 未达标 → questStatus active（cond 未满足）',
  questStatus(h1, 'side_hearer') === 'active', questStatus(h1, 'side_hearer'));
ok('状态机：active 页函数型实时报进度（已收录 0/4 种）',
  JSON.stringify(npcQuestPages(h1, 'hearer')).includes('0/' + BESTIARY_GOAL + ' 种'));
ok('状态机：任务日志 objective 同源（记忆图鉴收录 4 种 0/4 种）',
  questJournal(h1).find((e) => e.id === 'side_hearer').objective.includes('记忆图鉴收录') &&
  questJournal(h1).find((e) => e.id === 'side_hearer').objective.includes(`0/${BESTIARY_GOAL} 种`));
const h2 = mkHero({ quests: { side_hearer: 'active' }, bestiary: { a: 1, b: 1, c: 1, d: 1 } });
ok('状态机：达标（bestiary=4 种）→ questStatus turnin',
  questStatus(h2, 'side_hearer') === 'turnin', questStatus(h2, 'side_hearer'));
ok('状态机：npcQuestMark turnin 态「❕ 可交任务」',
  npcQuestMark(h2, 'hearer') === '❕ 可交任务', npcQuestMark(h2, 'hearer'));
const rRew = resolveNpcTalk(h2, 'hearer');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:60, potion2:1} + done + 结算 60 金/1 高级灵药',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 60 && rRew.potion2 === 1 &&
  h2.quests.side_hearer === 'done' && h2.gold === 60 && h2.potion2 === 1, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）',
  resolveNpcTalk(h2, 'hearer') === null);
ok('状态机：done 默认档（名字落进图鉴就落进灯下）',
  JSON.stringify(npcQuestPages(h2, 'hearer')).includes('落进了灯下'));
ok('状态机：done trueBoss 档（after 彩蛋「响了这么多年/替我谢谢那盏灯」两页并入任务页，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_hearer: 'done' }, trueBoss: true }), 'hearer')).includes('不响了') &&
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_hearer: 'done' }, trueBoss: true }), 'hearer')).includes('谢谢那盏灯'));
ok('状态机：done 态 npcQuestMark 零顶标（hearer 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_hearer: 'done' } }), 'hearer') === null);
ok('questRewardPreview 与 reward 同源（60 金 + 1 高级灵药）',
  (() => { const prev = questRewardPreview(mkHero({}), 'side_hearer'); return !!prev && prev.gold === 60 && prev.item === 0 && prev.potion2 === 1; })());

// —— NPCS.hearer 升格落位（零新 NPC/坐标/数据层三件套之外零改动）——
ok('NPCS.hearer 存在（听矿人 · mark hat · 含 v24.111 升格注释）',
  !!NPCS.hearer && NPCS.hearer.name === '听矿人' && NPCS.hearer.mark === 'hat' &&
  dSrc.includes('v24.111 升格为支线委托人'));
ok('NPCS.hearer 原有 lines 两页 / trueBoss after 两页彩蛋保留（零内容丢失契约）',
  Array.isArray(NPCS.hearer.lines) && NPCS.hearer.lines.length === 2 &&
  Array.isArray(NPCS.hearer.after) && NPCS.hearer.after.length === 2 &&
  NPCS.hearer.after[0].some((ln) => ln.includes('不响了')) && NPCS.hearer.after[1].some((ln) => ln.includes('领回来')));
ok('data.js cave.extras 含听矿人 (13,2) 与 NPC_SPOTS 键「13,2」（零新坐标）',
  dSrc.includes("{ x: 13, y: 2, ty: 'NPC' }") && dSrc.includes("'13,2'"));
ok('姊妹件 smoke_v2220_hearer 已随升格更新（无任务契约翻转为任务页契约）',
  read('smoke_v2220_hearer.mjs').includes('岩缝里的名字') && read('smoke_v2220_hearer.mjs').includes('可接委托'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为三百三十九件套（三百三十八件套清除）',
  readme.includes('冒烟三百三十九件套（三百三十八件套清除）'));
ok('README tests 含 v24.111 守护描述与 smoke_v24111_hearerquest 入库（335 份）',
  readme.includes('v24.111 起含「听矿人「岩缝里的名字」新支线」守护') &&
  readme.includes('smoke_v24111_hearerquest 入库（335 份）'));
ok('README 仍有 v24.110 守护描述（历史保留）', readme.includes('v24.110 起含「记誓人「蓄石为誓」新支线」守护'));
ok('README 已有三百三十四件套口径且尚无 335（哨兵前望 335 语义：下一版才写 335）',
  readme.includes('冒烟三百三十九件套（三百三十八件套清除）') && !readme.includes('冒烟三百四十件套') && !readme.includes('（340 份）'));
ok('README tests 树串尾已延伸（…+ smoke_v24109_carvequest + smoke_v24110_vowquest + smoke_v24111_hearerquest + smoke_v24112_talkquest + smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest（npm test 串跑））',
  readme.includes('smoke_v24109_carvequest + smoke_v24110_vowquest + smoke_v24111_hearerquest + smoke_v24112_talkquest + smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest（npm test 串跑）'));
ok('README 支线/奖励行随新现实（二十五条 · 岩缝里的名字 · BESTIARY_GOAL）',
  readme.includes('二十九条支线目标/奖励全部由') &&
  readme.includes('岩缝里的名字（听矿人 · 记忆图鉴讨伐收录累计 `BESTIARY_GOAL`(4) 种，讨伐过才落图鉴——遇见过不算）60 金 + 1 高级灵药') &&
  readme.includes('v24.111 补第二十五条') && readme.includes('v24.110 补第二十四条'));
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 333 份（smoke.mjs + 333 专项）', chain.length === 338 && ['smoke.mjs', ...chain].length === 339, String(chain.length));
ok('package.json 链尾为 smoke_v24111_hearerquest（第 334 份）', chain[chain.length - 1] === 'smoke_v24116_guidequest', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v24110_vowquest.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v24110_vowquest.mjs && node tests/smoke_v24111_hearerquest.mjs && node tests/smoke_v24112_talkquest.mjs && node tests/smoke_v24113_walkquest.mjs && node tests/smoke_v24114_fleequest.mjs && node tests/smoke_v24115_achhud.mjs && node tests/smoke_v24116_guidequest.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.111（startsWith）', changelog.startsWith('## v24.116'));
ok('CHANGELOG v24.111 条目含「岩缝里的名字」与「BESTIARY_GOAL」与「听矿人」',
  changelog.includes('岩缝里的名字') && changelog.includes('BESTIARY_GOAL') && changelog.includes('听矿人'));
ok('CHANGELOG 仍保留 v24.110 条目（历史保留）', changelog.includes('## v24.110'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const testsDir = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录件套 = 334（333 + smoke_v24111_hearerquest）', files.length === 339, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.110 pin 零残留 ——
const s24110 = read('smoke_v24110_vowquest.mjs');
ok('smoke_v24110 的 GAME_VERSION 字面量 pin 已更新为 v24.111', s24110.includes("const GAME_VERSION = 'v24.116';"));
ok('smoke_v24110 的 CHANGELOG 顶 pin 已更新为 ## v24.111 ', s24110.includes("startsWith('## v24.116'"));
ok('smoke_v24110 的件套 pin 已更新为三百三十九件套（三百三十八件套清除）', s24110.includes('三百三十九件套（三百三十八件套清除）'));
ok('smoke_v24110 的 README/链 tail pin 已随新现实延伸（含 smoke_v24111_hearerquest）',
  s24110.includes('smoke_v24111_hearerquest'));
ok('smoke_v24110 的 package.json 串尾 pin 已延伸至 smoke_v24111_hearerquest', s24110.includes('node tests/smoke_v24110_vowquest.mjs && node tests/smoke_v24111_hearerquest.mjs'));
ok('smoke_v24110 的链尾 pin 已推进至 smoke_v24111_hearerquest（第 334 份）', s24110.includes("=== 'smoke_v24116_guidequest'"));
ok('smoke_v24110 的入库 pin 已推进至 334 份', s24110.includes('入库（335 份）'));
const s2436 = read('smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（334 专项 / 335）且尚无 336 口径哨兵',
  s2436.includes('suiteFiles.length === 338 && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length === 339') &&
  s2436.includes('!readme.includes(\'冒烟三百四十件套\')') && s2436.includes('!readme.includes(\'（340 份）\')'));
const s2415 = read('smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v24111_hearerquest（第 334 份）', s2415.includes("chain[chain.length - 1] === 'smoke_v24116_guidequest'"));
ok('smoke_v2415 树串 token 数已推进至 334', s2415.includes('treeTok.length === 339'));
// 旧代 v24.110 pin 零残留扫描（豁免本套件与上一代套件）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v24111_hearerquest.mjs') continue;
  if (f === 'smoke_v24110_vowquest.mjs') continue;
  if (f === 'smoke_v24109_carvequest.mjs') continue;
  if (f === 'smoke_v24108_shopquest.mjs') continue;
  if (f === 'smoke_v24107_peddlequest.mjs') continue;
  if (f === 'smoke_v24106_moonquest.mjs') continue;
  if (f === 'smoke_v24100_talequest.mjs') continue;
  if (f === 'smoke_v24101_goldcurve26.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDir), 'utf8').split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  const hits = [];
  if (s2.includes("const GAME_VERSION = '" + "v24.110';")) hits.push('gv');
  if (s2.includes("GAME_VERSION === '" + "v24.110'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.110")) hits.push('cw');
  if (s2.includes('入库（33' + '3 份）')) hits.push('ruku');
  if (s2.includes('三百三十三件套（三百三十' + '二件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 33' + '3')) hits.push('fl');
  if (s2.includes('chainAll.length === 33' + '3')) hits.push('cal');
  if (s2.includes('chain.length === 33' + '2')) hits.push('cl');
  if (s2.includes('treeTok.length === 33' + '3')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v24110_" + "vowquest'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.110 GAME_VERSION/顶 pin/333 口径（哨兵链，豁免本套件）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.111 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
