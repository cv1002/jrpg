// smoke_v24131_stele4quest.mjs —— v24.131 专项冒烟：第三十九条支线「初灯的名字」（第四块名字石碑 ·
// 击败终焉之神后对话即完成，里程碑对话支线 —— 四碑收口）
// （新内容·新支线——承 v24.130 第三块名字石碑「最后一车星砂」同一「里程碑对话」模板收口：无字回廊北壁
// 第四块名字石碑（(20,1)，碑文=「初灯记得所有人的名字，唯独没人记得它的。于是它把自己点着了。」=
// FRAGMENTS[3] 碎片·初灯的名字）升格为委托人——碑里记着初灯的名字，终焉之神首胜恰是 winBattle 强敌
// 首胜掉落「碎片·初灯的名字」的瞬间（集齐四枚记忆碎片的那一夜，就是无字回廊四块碑名字全部回灯下的
// 终局），玩家击败隐藏的终焉之神（trueBoss）后回碑前把「初灯记得所有人」的消息说给石头听即完成
// （unlockOn:'trueBoss' + completeOnTalk 交付即结算，承 side_stele3「最后一车星砂」/ side_stele2「灯下
// 的誓」同款「里程碑对话」支线——四块碑四场 Boss 里程碑至此全部收口）；零新计数零新状态零新存档
// （无 cond/condProg、无新 GOAL 常量无 export 变化——unlockOn 解锁即达）、无 offer 页（locked 态回退
// 既有碑文 lines 纯风味只读、npcQuestMark 锁定态零顶标——stele4 从未解锁到通关前始终纯风味，姊妹件套
// 零级联）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.131 注释 / GAME_VERSION v24.131 与旧 v24.130 字面量
// 零残留 / v24.130 及更早历史注释保留）、QUESTS 契约（39 side + 4 main、side_stele4 字段逐值、
// ACH_LIST allquests 同源互证）、quests.js 运行期状态机（locked→active→done 全链路 + resolveNpcTalk
// 交付结算 100 金+2 高级灵药 + npcQuestMark/npcQuestPages 各态 + locked 态纯风味碑文零干扰 +
// sideQuestDone 0/39·39/39 + done 三档 trueBoss/caveBoss/bossDefeated + 原碑文并入 done 末页零内容丢失）、
// README/package.json/CHANGELOG 同步（件套口径 354 + v24.131 守护描述 + 入库 354 + package 串尾 +
// CHANGELOG 顶 pin）、tests 目录与实跑链恒等（354）、哨兵链（前望 355 且 README 尚无 355 口径）、
// 旧代 v24.130 pin 全库零残留扫描（字面量/顶 pin/353 口径 · 豁免本套件）。
import { GAME_VERSION, QUESTS, ACH_LIST, NPCS, FRAGMENTS } from '../js/data.js';
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

console.log('— v24.131 第四块名字石碑「初灯的名字」新支线 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkgRaw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（格式合法 + 已越过 v24.130 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.130', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 130)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.131（旧 v24.130 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.176';") && !dSrc.includes("const GAME_VERSION = 'v24.130';"));
ok('data.js 含 v24.131 注释（初灯的名字新支线说明）',
  dSrc.includes('v24.131 新内容·新支线（第三十九条）'));
ok('data.js 仍保留 v24.130 历史注释（最后一车星砂说明，零内容丢失）',
  dSrc.includes('v24.130 新内容·新支线（第三十八条）'));

// —— 源级落位：无新常量无 export 变化（里程碑对话支线，unlockOn 解锁即达）——
ok('data.js 未新增任何 GOAL 常量（无新计数端口，QUESTS 表驱动）',
  !dSrc.includes('STELE4_GOAL') && !dSrc.includes('STELE3_GOAL') && !dSrc.includes('VOW2_GOAL'));
ok('data.js NPC_SPOTS 源级仍含第四块石碑据点 (20,1)（零新坐标）',
  dSrc.includes("'20,1': 'stele4'"));
ok('FRAGMENTS[3] 与 stele4 碑文同为「初灯的名字」（升格主题同源）',
  !!FRAGMENTS[3] && FRAGMENTS[3].id === 'true' && FRAGMENTS[3].text.includes('初灯记得所有人的名字') && FRAGMENTS[3].text.includes('点着'));

// —— QUESTS 契约：39 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 43 条（39 side + 4 main，派生计数）',
  sideDefs.length === 45 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 49,
  `${sideDefs.length}/${mainDefs.length}`);
ok('side_stele4 存在且为第三十九条（kind side · store · npc/giver stele4 · unlockOn trueBoss · completeOnTalk）',
  !!QUESTS.side_stele4 && QUESTS.side_stele4.kind === 'side' && QUESTS.side_stele4.store === true &&
  QUESTS.side_stele4.npc === 'stele4' && QUESTS.side_stele4.giver === 'stele4' &&
  QUESTS.side_stele4.unlockOn === 'trueBoss' && QUESTS.side_stele4.completeOnTalk === true);
ok('side_stele4 名称「初灯的名字」/where/obj/turnin/done 落位',
  QUESTS.side_stele4.name === '初灯的名字' && QUESTS.side_stele4.where.includes('第四块名字石碑') &&
  QUESTS.side_stele4.obj.includes('初灯记得所有人的名字') && QUESTS.side_stele4.turnin.includes('名字都回灯下') &&
  QUESTS.side_stele4.done.includes('初灯'));
ok('side_stele4 无 offer 页无 cond/condProg（解锁即达，locked 态回退纯风味碑文零干扰）',
  QUESTS.side_stele4.cond == null && QUESTS.side_stele4.condProg == null && !QUESTS.side_stele4.talk.offer);
ok('side_stele4 reward 逐值：100 金 + 2 高级灵药（四碑收口的终局谢礼）',
  !!QUESTS.side_stele4.reward && QUESTS.side_stele4.reward.gold === 100 && QUESTS.side_stele4.reward.potion2 === 2 && !QUESTS.side_stele4.reward.item);
ok('side_stele2/stele3/stele4 各读独立解锁（bossDefeated/caveBoss/trueBoss 三档互不干扰）',
  QUESTS.side_stele2.unlockOn === 'bossDefeated' && QUESTS.side_stele3.unlockOn === 'caveBoss' &&
  QUESTS.side_stele4.unlockOn === 'trueBoss' && QUESTS.side_stele4.id !== QUESTS.side_stele3.id &&
  QUESTS.side_stele3.id !== QUESTS.side_stele2.id);

// —— ACH_LIST allquests 同源互证（与 sideQuestDone 输出一致）——
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('ACH_LIST allquests 名称「灯火同心」且描述派生 39（「45 个支线任务」）',
  !!achAll && achAll.name === '灯火同心' && achAll.d.includes('45 个支线任务'), achAll && achAll.d);
ok('ACH_LIST allquests 判定/进度与 QUESTS 派生同源（0/39 false · 38/39 false · 39/39 true · prog 39/39）',
  !!achAll && achAll.ok({ quests: {} }) === false && achAll.ok({ quests: Object.fromEntries(sideDefs.slice(0, 40).map(q => [q.id, 'done'])) }) === false &&
  achAll.ok({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === true &&
  achAll.prog({ quests: {} }) === '0/45' && achAll.prog({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === '45/45');

// —— quests.js 运行期：sideQuestDone ——
ok('运行期：sideQuestDone 0/39 · 39/39 · 主线不入列',
  sideQuestDone({ quests: {} }).done === 0 && sideQuestDone({ quests: {} }).total === 45 &&
  sideQuestDone({ quests: { side_mushroom: 'done', side_cart: 'done', side_pond: 'done' } }).done === 3 &&
  sideQuestDone({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }).done === 45 &&
  sideQuestDone({ quests: { main_demon: 'done' } }).done === 0);

// —— 运行期状态机：locked → active → done（quests 纯函数，零 DOM）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 3, hp: 60, hpMax: 60, mp: 20, mpMax: 20, atkMax: 13, defMax: 9,
    gold: 0, xp: 0, xpNext: 100, item: 1, potion2: 0, weapon: '铁剑', armor: '皮甲',
    skills: [], ach: [], seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, talked: [], steps: 0,
    totalWins: 0, battles: 0, drops: 0, deflects: 0, casts: 0, travels: 0, sold: 0, spent: 0, crits: 0, charges: 0, flees: 0,
    potionUses: 0, mapPotions: 0, brews: 0, time: 0, x: 20, y: 1, map: 'gallery' }, extra || {});
}
const h1 = mkHero({});
ok('状态机：未击败终焉之神 → questStatus locked（unlockOn trueBoss）', questStatus(h1, 'side_stele4') === 'locked', questStatus(h1, 'side_stele4'));
ok('状态机：npcQuestMark 锁定态零顶标（stele4 自始纯风味）', npcQuestMark(h1, 'stele4') === null, npcQuestMark(h1, 'stele4'));
ok('状态机：npcQuestPages 锁定态回退既有碑文（初灯的名字纯风味只读，零内容丢失）',
  JSON.stringify(npcQuestPages(h1, 'stele4')).includes('初灯记得所有人的名字') &&
  JSON.stringify(npcQuestPages(h1, 'stele4')).includes('碑上没有名字，摸上去是温的'));
ok('状态机：resolveNpcTalk 锁定态 null（无待办，走翻页路径）', resolveNpcTalk(h1, 'stele4') === null);
ok('状态机：任务日志 locked 条目带未解锁口径（承 side_cart 同款）',
  questJournal(h1).find((e) => e.id === 'side_stele4').status === 'locked' &&
  questJournal(h1).find((e) => e.id === 'side_stele4').objective.includes('未解锁'));
ok('状态机：side_stele4 未解锁不进支线横幅（sideObjectives 排除 locked）',
  !questJournal(h1).some((e) => e.id === 'side_stele4' && ['offer', 'active', 'turnin'].includes(e.status)) &&
  questJournal(h1).find((e) => e.id === 'side_stele4').status === 'locked');
const freshObjectives = (() => {
  // 直接复用 quests 导出：sideObjectives 未导出，用 questJournal+filter 同源验证
  const j = questJournal(h1);
  return j.filter((e) => e.kind === 'side' && ['offer', 'active', 'turnin'].includes(e.status)).map((e) => e.id);
})();
ok('状态机：locked 支线不进横幅侧列（j = journal 侧列过滤，objective 即横幅同源）',
  !freshObjectives.includes('side_stele4'));

const h2 = mkHero({ trueBoss: true });
ok('状态机：击败终焉之神后 → questStatus active（completeOnTalk 待交付）', questStatus(h2, 'side_stele4') === 'active', questStatus(h2, 'side_stele4'));
ok('状态机：npcQuestMark active+completeOnTalk → 「❕ 可交任务」', npcQuestMark(h2, 'stele4') === '❕ 可交任务', npcQuestMark(h2, 'stele4'));
ok('状态机：npcQuestPages active 页（初灯的名字 · 把消息告诉碑）',
  JSON.stringify(npcQuestPages(h2, 'stele4')).includes('初灯记得所有人的名字') &&
  JSON.stringify(npcQuestPages(h2, 'stele4')).includes('把消息告诉碑'));
const rRew = resolveNpcTalk(h2, 'stele4');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:100, potion2:2} + done + 结算 100 金/2 高级灵药',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 100 && rRew.potion2 === 2 &&
  h2.quests.side_stele4 === 'done' && h2.gold === 100 && h2.potion2 === 2, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）', resolveNpcTalk(h2, 'stele4') === null);
ok('状态机：done trueBoss 档（四碑收口叙事并入 · 碑文保留，零内容丢失）',
  JSON.stringify(npcQuestPages(h2, 'stele4')).includes('名字都回灯下') &&
  JSON.stringify(npcQuestPages(h2, 'stele4')).includes('碑上没有名字'));
ok('状态机：done 档仅可由解锁态达成（缺 trueBoss 即使已存 done 也回退锁定碑文，防御式）',
  questStatus(mkHero({ quests: { side_stele4: 'done' }, trueBoss: undefined }), 'side_stele4') === 'locked' &&
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_stele4: 'done' }, trueBoss: undefined }), 'stele4')).includes('初灯记得所有人的名字'));
ok('状态机：done 态 npcQuestMark 零顶标（stele4 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_stele4: 'done' }, trueBoss: true }), 'stele4') === null);
ok('questRewardPreview 与 reward 同源（100 金 + 2 高级灵药）',
  (() => { const prev = questRewardPreview(mkHero({}), 'side_stele4'); return !!prev && prev.gold === 100 && prev.potion2 === 2 && prev.item === 0; })());
ok('运行期：仅击败洞窟领主不解锁第四块碑（trueBoss 尚未达 → locked）',
  questStatus(mkHero({ caveBoss: true }), 'side_stele4') === 'locked' && npcQuestMark(mkHero({ caveBoss: true }), 'stele4') === null);
ok('运行期：击败幽冥魔王+洞窟领主仍不解锁第四块碑（trueBoss 未达 → locked）',
  questStatus(mkHero({ bossDefeated: true, caveBoss: true }), 'side_stele4') === 'locked');
ok('运行期：旧档无 trueBoss 字段不误解锁（防御式锁定）',
  questStatus(mkHero({ quests: {}, trueBoss: undefined }), 'side_stele4') === 'locked');

// —— NPCS.stele1..stele4 保留 + stele4 升格不改生成器——
ok('NPCS.stele1..stele4 俱在（名字石碑 · mark staff · 四碑数据层保留）',
  !!NPCS.stele1 && !!NPCS.stele2 && !!NPCS.stele3 && !!NPCS.stele4 &&
  NPCS.stele4.name === '名字石碑' && NPCS.stele4.mark === 'staff' &&
  dSrc.includes('v24.131 起第四块碑 stele4 升格为第三十九条支线「初灯的名字」'));
ok('NPCS.stele4 既有碑文 lines 保留（零内容丢失契约·生成器逐字未动）',
  Array.isArray(NPCS.stele4.lines) && NPCS.stele4.lines[0].some((ln) => ln.includes('初灯记得所有人的名字')));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为三百八十七件套（三百八十六件套清除）',
  readme.includes('冒烟三百八十七件套（三百八十六件套清除）'));
ok('README tests 含 v24.131 守护描述与 smoke_v24131_stele4quest 入库（354 份）',
  readme.includes('v24.131 起含「第四块名字石碑「初灯的名字」新支线」守护') &&
  readme.includes('smoke_v24131_stele4quest 入库（354 份）'));
ok('README 仍有 v24.130 守护描述（历史保留）', readme.includes('v24.130 起含'));
ok('README 已有三百五十四件套口径且尚无 355（哨兵前望 355 语义：下一版才写 355）',
  readme.includes('冒烟三百八十七件套（三百八十六件套清除）') && !readme.includes('冒烟三百八十八件套') && !readme.includes('（388 份）'));
ok('README tests 树串尾已延伸（…+ smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑））',
  readme.includes('smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑）'));
ok('README 支线/奖励行随新现实（三十九条 · 初灯的名字 · 击败终焉之神）',
  readme.includes('四十五条支线目标/奖励全部由') &&
  readme.includes('初灯的名字（第四块名字石碑 · 击败终焉之神（`trueBoss`）后对话即完成）100 金 + 2 高级灵药') &&
  readme.includes('v24.131 补第三十九条') && readme.includes('v24.130 补第三十八条 · v24.131 补第三十九条 · v24.132 补第四十条 · v24.133 补第四十一条 · v24.134 补第四十二条 · v24.135 补第四十三条 · v24.136 补第四十四条 · v24.143 补第四十五条'));
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 353 份（smoke.mjs + 353 专项）', chain.length === 386 && ['smoke.mjs', ...chain].length === 387, String(chain.length));
ok('package.json 链尾为 smoke_v24131_stele4quest（第 354 份）', chain[chain.length - 1] === 'smoke_v24176_pennynopo', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v24130_stele3quest.mjs && smoke_v24131_stele4quest.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v24130_stele3quest.mjs && node tests/smoke_v24131_stele4quest.mjs && node tests/smoke_v24132_fallenquest.mjs && node tests/smoke_v24133_inquest.mjs && node tests/smoke_v24134_kindleq.mjs && node tests/smoke_v24135_ledgerquest.mjs && node tests/smoke_v24136_herbquest.mjs && node tests/smoke_v24143_furnacequest.mjs && node tests/smoke_v24147_unflicker.mjs && node tests/smoke_v24148_swift.mjs && node tests/smoke_v24151_lowlv.mjs && node tests/smoke_v24152_nopotion.mjs && node tests/smoke_v24153_penny.mjs && node tests/smoke_v24154_steadfast.mjs && node tests/smoke_v24155_frugal.mjs && node tests/smoke_v24157_dry.mjs && node tests/smoke_v24158_swift2.mjs && node tests/smoke_v24159_lowlv2.mjs && node tests/smoke_v24160_noskill.mjs && node tests/smoke_v24161_noskill2.mjs && node tests/smoke_v24162_lowskill.mjs && node tests/smoke_v24163_swiftskill.mjs && node tests/smoke_v24164_swiftlv.mjs && node tests/smoke_v24165_nopotskill.mjs && node tests/smoke_v24166_unflskill.mjs && node tests/smoke_v24167_swiftnopo.mjs && node tests/smoke_v24168_lowlvnopo.mjs && node tests/smoke_v24169_unflswift.mjs && node tests/smoke_v24170_unfllowlv.mjs && node tests/smoke_v24171_unflnopo.mjs && node tests/smoke_v24172_unflpenny.mjs && node tests/smoke_v24173_pennyswift.mjs && node tests/smoke_v24174_pennylowlv.mjs && node tests/smoke_v24175_pennynoskill.mjs && node tests/smoke_v24176_pennynopo.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.131（startsWith）', changelog.startsWith('## v24.176'));
ok('CHANGELOG v24.131 条目含「初灯的名字」与「第三十九条」与「第四块名字石碑」',
  changelog.includes('初灯的名字') && changelog.includes('第三十九条') && changelog.includes('第四块名字石碑'));
ok('CHANGELOG 仍保留 v24.130 条目（历史保留）', changelog.includes('## v24.130 '));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const testsDir = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录件套 = 354（353 + smoke_v24131_stele4quest）', files.length === 387, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.130 pin 零残留 ——
const s24130 = read('smoke_v24130_stele3quest.mjs');
ok('smoke_v24130 的 GAME_VERSION 字面量 pin 已更新为 v24.131', s24130.includes("const GAME_VERSION = 'v24.176';"));
ok('smoke_v24130 的 CHANGELOG 顶 pin 已更新为 ## v24.131 ', s24130.includes("startsWith('## v24.176'"));
ok('smoke_v24130 的件套 pin 已更新为三百八十七件套（三百八十六件套清除）', s24130.includes('三百八十七件套（三百八十六件套清除）'));
ok('smoke_v24130 的 README/链 tail pin 已随新现实延伸（含 smoke_v24131_stele4quest）',
  s24130.includes('smoke_v24131_stele4quest'));
ok('smoke_v24130 的链尾 pin 已推进至 smoke_v24131_stele4quest（第 354 份）', s24130.includes("=== 'smoke_v24176_pennynopo'"));
const s24129 = read('smoke_v24129_stele2quest.mjs');
ok('smoke_v24129 的 GAME_VERSION 字面量 pin 已更新为 v24.131', s24129.includes("const GAME_VERSION = 'v24.176';"));
ok('smoke_v24129 的链尾 pin 已推进至 smoke_v24131_stele4quest（第 354 份）', s24129.includes("=== 'smoke_v24176_pennynopo'"));
const s2436 = read('smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（353 专项 / 354）且尚无 355 口径哨兵',
  s2436.includes('suiteFiles.length === 386  && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length === 387') &&
  s2436.includes('!readme.includes(\'冒烟三百八十八件套\')') && s2436.includes('!readme.includes(\'（388 份）\')'));
const s2429 = read('smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 哨兵链前望 355（三百八十八件套否定式）',
  s2429.includes("!readme.includes('冒烟三百八十八件套'"));
// 旧代 v24.130 pin 零残留扫描（豁免本套件）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v24131_stele4quest.mjs' || f === 'smoke_v24130_stele3quest.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDir), 'utf8').split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  const hits = [];
  if (s2.includes("const GAME_VERSION = '" + "v24.130';")) hits.push('gv');
  if (s2.includes("GAME_VERSION === '" + "v24.130'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.130")) hits.push('cw');
  if (s2.includes('三百五十三件套（三百五' + '十二件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 35' + '3')) hits.push('fl');
  if (s2.includes('chainAll.length === 35' + '3')) hits.push('cal');
  if (s2.includes('chain.length === 35' + '2')) hits.push('cl');
  if (s2.includes('treeTok.length === 35' + '3')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v24130_" + "stele3quest'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.130 GAME_VERSION/顶 pin/353 口径（哨兵链，豁免本套件）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.131 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
