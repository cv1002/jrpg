// smoke_v24128_stelequest.mjs —— v24.128 专项冒烟：第三十六条支线「看好矿车」（第一块名字石碑·
// 累计遭遇 STELE_GOAL(40) 场战斗）
// （新内容·新支线——承 v24.127 拾灯人「彻夜长明」/ v24.126 失名的旅人「灯下记名」/ v24.122 守晶人
// 「星砂归匣」同一「风味 NPC 升格为支线委托人」先例：无字回廊北壁四块名字石碑中最靠西的第一块
// （(5,1)，碑文=「旧矿的守门人走丢那天，把最后一句『看好矿车』说给了石头听」= FRAGMENTS[0] 碎片·
// 守门人的脚印）升格为委托人——碑里还存着守门人那句没说完的话，如今石头把它托付给肯替它记着的人；
// 玩家在灯下走进的每一场战斗，石头都当作替守门人多看了一夜矿车，替他守满 STELE_GOAL(40) 场
// （计数 hero.battles 复用既有端口 — js/battle.js startBattle 进战即记唯一产生点（胜/败/逃都算）、
// 随 snapshotHero 全量快照自动持久化、防御式 (g.battles||0) 旧档零迁移，与 ACH_LIST battle「身经百战」
// 同读一份源；支线门槛 40 低于成就门槛 BATTLE_GOAL(100)——顺路先完成支线再解锁成就）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.128 注释 / GAME_VERSION v24.128 与旧 v24.127 字面量
// 零残留 / v24.127 及更早历史注释保留 / STELE_GOAL 常量与 export）、QUESTS 契约（36 side + 4 main、
// side_stele 字段逐值、与 BATTLE_GOAL 同源、ACH_LIST allquests 同源互证、STELE_GOAL 低于 battle
// 成就门槛互证）、quests.js 运行期状态机（offer→active→turnin→done 全链路 + resolveNpcTalk 接取/
// 交付结算 70 金+2 生命药水 + npcQuestMark/npcQuestPages 四态 + sideQuestDone 0/36·3/36·36/36 +
// done 三档 trueBoss/caveBoss/bossDefeated + 原碑文并入 done 末页零内容丢失）、NPCS.stele1 升格落位
// （stele1-4 数据层保留 + 姊妹件套已随升格更新）、README/package.json/CHANGELOG 同步（件套口径 351 +
// v24.128 守护描述 + 入库 351 + package 串尾 + CHANGELOG 顶 pin）、tests 目录与实跑链恒等（351）、
// 哨兵链（前望 352 且 README 尚无 352 口径）、旧代 v24.127 pin 全库零残留扫描（字面量/顶 pin/350 口径 ·
// 豁免本套件）。
import { GAME_VERSION, QUESTS, STELE_GOAL, BATTLE_GOAL, ACH_LIST, NPCS, NPC_SPOTS, FRAGMENTS } from '../js/data.js';
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

console.log('— v24.128 第一块名字石碑「看好矿车」新支线 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkgRaw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（格式合法 + 已越过 v24.127 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.127', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 127)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.128（旧 v24.127 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.132';") && !dSrc.includes("const GAME_VERSION = 'v24.127';"));
ok('data.js 含 v24.128 注释（看好矿车新支线说明）',
  dSrc.includes('v24.128 新内容·新支线（第三十六条）'));
ok('data.js 仍保留 v24.127 历史注释（彻夜长明说明，零内容丢失）',
  dSrc.includes('v24.127 新内容·新支线（第三十五条）'));

// —— 源级落位：STELE_GOAL 常量 + export ——
ok('data.js STELE_GOAL 常量 = 40（与 LAMP_GOAL 比邻声明，同一家族）',
  dSrc.includes('const STELE_GOAL = 40;') && dSrc.indexOf('const STELE_GOAL') > dSrc.indexOf('const LAMP_GOAL'));
ok('data.js export 块含 STELE_GOAL（LAMP_GOAL 之后紧邻）',
  dSrc.includes('CRYSTAL_GOAL, WAIT_GOAL, LAMP_GOAL, STELE_GOAL,'));
ok('STELE_GOAL 与 battle 成就门槛同族互证（40 场 < BATTLE_GOAL 100 场——顺路先完成支线再解锁成就）',
  (() => { const aBt = ACH_LIST.find((a) => a.id === 'battles');
    return STELE_GOAL === 40 && BATTLE_GOAL === 100 &&
      STELE_GOAL < BATTLE_GOAL && aBt && aBt.ok({ battles: 99 }) === false && aBt.ok({ battles: 100 }) === true; })());
ok('data.js NPC_SPOTS 源级仍含第一块石碑据点 (5,1)（零新坐标）',
  dSrc.includes("'5,1': 'stele1'"));
ok('FRAGMENTS[0] 与 stele1 碑文同为「守门人的脚印」（升格主题同源）',
  !!FRAGMENTS[0] && FRAGMENTS[0].id === 'golem' && FRAGMENTS[0].text.includes('守门人') && FRAGMENTS[0].text.includes('看好矿车'));

// —— QUESTS 契约：36 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 40 条（36 side + 4 main，派生计数）',
  sideDefs.length === 40 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 44,
  `${sideDefs.length}/${mainDefs.length}`);
ok('side_stele 存在且为第三十六条（kind side · store · npc/giver stele1 · 无 unlockOn）',
  !!QUESTS.side_stele && QUESTS.side_stele.kind === 'side' && QUESTS.side_stele.store === true &&
  QUESTS.side_stele.npc === 'stele1' && QUESTS.side_stele.giver === 'stele1' &&
  QUESTS.side_stele.unlockOn == null);
ok('side_stele 名称「看好矿车」/where/obj/offer/turnin/done 落位',
  QUESTS.side_stele.name === '看好矿车' && QUESTS.side_stele.where.includes('无字回廊') &&
  QUESTS.side_stele.obj.includes(String(STELE_GOAL)) && QUESTS.side_stele.obj.includes('场战斗') &&
  QUESTS.side_stele.offer.includes('名字石碑') && QUESTS.side_stele.turnin.includes('名字石碑') &&
  QUESTS.side_stele.done.includes('看好矿车'));
ok('side_stele cond/condProg 与 STELE_GOAL 同源（hero.battles 计数，防御式 (g.battles||0)，判/进/文/话一处调全端跟随）',
  QUESTS.side_stele.cond({}) === false &&
  QUESTS.side_stele.cond({ battles: 39 }) === false &&
  QUESTS.side_stele.cond({ battles: 40 }) === true &&
  QUESTS.side_stele.cond({ battles: 60 }) === true &&
  QUESTS.side_stele.condProg({}) === `0/${STELE_GOAL} 场` &&
  QUESTS.side_stele.condProg({ battles: 15 }) === `15/${STELE_GOAL} 场`);
ok('side_stele reward 逐值：70 金 + 2 生命药水（承 side_wait 70 档）',
  QUESTS.side_stele.reward.gold === 70 && QUESTS.side_stele.reward.item === 2 && !QUESTS.side_stele.reward.potion2);
ok('side_lamp 与 side_stele 各读独立端口（time 时长 vs battles 场次 互不干扰）',
  QUESTS.side_lamp.cond({ time: 3600, battles: 0 }) === true &&
  QUESTS.side_stele.cond({ time: 3600, battles: 0 }) === false &&
  QUESTS.side_stele.cond({ time: 0, battles: 40 }) === true);

// —— ACH_LIST allquests 同源互证（与 sideQuestDone 输出一致）——
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('ACH_LIST allquests 名称「灯火同心」且描述派生 36（「40 个支线任务」）',
  !!achAll && achAll.name === '灯火同心' && achAll.d.includes('40 个支线任务'), achAll && achAll.d);
ok('ACH_LIST allquests 判定/进度与 QUESTS 派生同源（0/36 false · 35/36 false · 36/36 true · prog 36/36）',
  !!achAll && achAll.ok({ quests: {} }) === false && achAll.ok({ quests: Object.fromEntries(sideDefs.slice(0, 39).map(q => [q.id, 'done'])) }) === false &&
  achAll.ok({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === true &&
  achAll.prog({ quests: {} }) === '0/40' && achAll.prog({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === '40/40');

// —— quests.js 运行期：sideQuestDone ——
ok('运行期：sideQuestDone 0/36 · 3/36 · 36/36 · 主线不入列',
  sideQuestDone({ quests: {} }).done === 0 && sideQuestDone({ quests: {} }).total === 40 &&
  sideQuestDone({ quests: { side_mushroom: 'done', side_cart: 'done', side_pond: 'done' } }).done === 3 &&
  sideQuestDone({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }).done === 40 &&
  sideQuestDone({ quests: { main_demon: 'done' } }).done === 0);

// —— 运行期状态机：offer → active → turnin → done（quests 纯函数，零 DOM）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 3, hp: 60, hpMax: 60, mp: 20, mpMax: 20, atkMax: 13, defMax: 9,
    gold: 0, xp: 0, xpNext: 100, item: 1, potion2: 0, weapon: '铁剑', armor: '皮甲',
    skills: [], ach: [], seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, talked: [], steps: 0,
    totalWins: 0, battles: 0, drops: 0, deflects: 0, casts: 0, travels: 0, sold: 0, spent: 0, crits: 0, charges: 0, flees: 0,
    potionUses: 0, mapPotions: 0, brews: 0, time: 0, x: 5, y: 1, map: 'gallery' }, extra || {});
}
const h1 = mkHero({});
ok('状态机：无存档 → questStatus offer（无 unlockOn 首次进无字回廊即接，承 side_guide 同款）',
  questStatus(h1, 'side_stele') === 'offer', questStatus(h1, 'side_stele'));
ok('状态机：npcQuestMark offer 态「❕ 可接委托」（石碑顶标亮起）',
  npcQuestMark(h1, 'stele1') === '❕ 可接委托', npcQuestMark(h1, 'stele1'));
ok('状态机：npcQuestPages offer 页（名字石碑 · 看好矿车 · 守门人 · STELE_GOAL 同源）',
  JSON.stringify(npcQuestPages(h1, 'stele1')).includes('看好矿车') &&
  JSON.stringify(npcQuestPages(h1, 'stele1')).includes('守门人') &&
  JSON.stringify(npcQuestPages(h1, 'stele1')).includes(String(STELE_GOAL)) &&
  JSON.stringify(npcQuestPages(h1, 'stele1')).includes('接下委托'));
const rAcc = resolveNpcTalk(h1, 'stele1');
ok('状态机：resolveNpcTalk 接取 → {kind:accept, id:side_stele} + quests.side_stele=active',
  !!rAcc && rAcc.kind === 'accept' && rAcc.id === 'side_stele' && h1.quests.side_stele === 'active', JSON.stringify(rAcc));
ok('状态机：active 未达标 → questStatus active（cond 未满足）',
  questStatus(h1, 'side_stele') === 'active', questStatus(h1, 'side_stele'));
ok('状态机：active 页函数型实时报进度（已累计 0/40 场）',
  JSON.stringify(npcQuestPages(h1, 'stele1')).includes('0/' + STELE_GOAL + ' 场'));
ok('状态机：任务日志 objective 同源（累计遭遇战斗 0/40 场）',
  questJournal(h1).find((e) => e.id === 'side_stele').objective.includes('场战斗') &&
  questJournal(h1).find((e) => e.id === 'side_stele').objective.includes(`0/${STELE_GOAL} 场`));
const h2 = mkHero({ quests: { side_stele: 'active' }, battles: 40 });
ok('状态机：达标（battles=40 场）→ questStatus turnin',
  questStatus(h2, 'side_stele') === 'turnin', questStatus(h2, 'side_stele'));
ok('状态机：npcQuestMark turnin 态「❕ 可交任务」',
  npcQuestMark(h2, 'stele1') === '❕ 可交任务', npcQuestMark(h2, 'stele1'));
const rRew = resolveNpcTalk(h2, 'stele1');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:70, item:2} + done + 结算 70 金/2 生命药水',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 70 && rRew.item === 2 &&
  h2.quests.side_stele === 'done' && h2.gold === 70 && h2.item === 3, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）',
  resolveNpcTalk(h2, 'stele1') === null);
ok('状态机：done 默认档（名字还悬在雾里 · 原碑文并入末页，零内容丢失）',
  JSON.stringify(npcQuestPages(h2, 'stele1')).includes('矿车没停') &&
  JSON.stringify(npcQuestPages(h2, 'stele1')).includes('碑上没有名字，摸上去是温的'));
ok('状态机：done bossDefeated 档（灯芯回来了叙事并入 · 碑文保留，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_stele: 'done' }, bossDefeated: true }), 'stele1')).includes('灯芯回来了') &&
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_stele: 'done' }, bossDefeated: true }), 'stele1')).includes('碑上没有名字'));
ok('状态机：done caveBoss 档（星砂/矿车叙事并入 · 碑文保留，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_stele: 'done' }, caveBoss: true }), 'stele1')).includes('最后一车') &&
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_stele: 'done' }, caveBoss: true }), 'stele1')).includes('碑上没有名字'));
ok('状态机：done trueBoss 档（守门人的脚印叙事并入 · 碑文保留，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_stele: 'done' }, trueBoss: true }), 'stele1')).includes('名字都回灯下') &&
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_stele: 'done' }, trueBoss: true }), 'stele1')).includes('碑上没有名字，摸上去是温的'));
ok('状态机：done 态 npcQuestMark 零顶标（stele1 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_stele: 'done' } }), 'stele1') === null);
ok('questRewardPreview 与 reward 同源（70 金 + 2 生命药水）',
  (() => { const prev = questRewardPreview(mkHero({}), 'side_stele'); return !!prev && prev.gold === 70 && prev.item === 2 && prev.potion2 === 0; })());
ok('运行期：其余纯风味 NPC 零顶标（stele2/stele3 无待办，stele1 已升格不在纯风味列）',
  npcQuestMark(mkHero({}), 'stele2') === null && npcQuestMark(mkHero({}), 'stele3') === null);
ok('运行期：旧档无 battles 字段（0 场）不误解锁（防御式旧档零迁移）',
  questStatus(mkHero({ quests: {}, battles: undefined }), 'side_stele') === 'offer');

// —— NPCS.stele1 升格落位（零新 NPC/坐标/数据层四碑之外零改动）——
ok('NPCS.stele1..stele4 俱在（名字石碑 · mark staff · 四碑数据层保留）',
  !!NPCS.stele1 && !!NPCS.stele2 && !!NPCS.stele3 && !!NPCS.stele4 &&
  NPCS.stele1.name === '名字石碑' && NPCS.stele1.mark === 'staff' && dSrc.includes('升格为第三十六条支线「看好矿车」的委托人'));
ok('NPCS.stele1 原有碑文 lines 保留（零内容丢失契约）',
  Array.isArray(NPCS.stele1.lines) && NPCS.stele1.lines[0].some((ln) => ln.includes('碑上没有名字，摸上去是温的')));
ok('NPCS.stele2 碑文仍为灯卫的誓（未升格，纯风味只读）',
  Array.isArray(NPCS.stele2.lines) && NPCS.stele2.lines[0].some((ln) => ln.includes('吞下灯芯')));
ok('姊妹件 smoke_v2235_minimapquest 已随升格更新（stele1 入任务 NPC 列表 + side_stele done）',
  read('smoke_v2235_minimapquest.mjs').includes("'stele1'") && read('smoke_v2235_minimapquest.mjs').includes('side_stele'));
ok('姊妹件纯风味列表已把 stele1 换成仍纯风味的 stele2（smoke.mjs/v24112/v24119/v24127）',
  read('smoke.mjs').includes("npcQuestMark(fresh,'stele2')") && !read('smoke.mjs').includes("npcQuestMark(fresh,'stele1')") &&
  !read('smoke_v24112_talkquest.mjs').includes("'stele1') === null") &&
  !read('smoke_v24119_huntquest.mjs').includes("'stele1') === null") &&
  !read('smoke_v24127_lampquest.mjs').includes("'stele1') === null"));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为三百五十五件套（三百五十四件套清除）',
  readme.includes('冒烟三百五十五件套（三百五十四件套清除）'));
ok('README tests 含 v24.128 守护描述与 smoke_v24128_stelequest 入库（351 份）',
  readme.includes('v24.128 起含「第一块名字石碑「看好矿车」新支线」守护') &&
  readme.includes('smoke_v24128_stelequest 入库（351 份）'));
ok('README 仍有 v24.127 守护描述（历史保留）', readme.includes('v24.127 起含'));
ok('README 已有三百五十一件套口径且尚无 352（哨兵前望 352 语义：下一版才写 352）',
  readme.includes('冒烟三百五十五件套（三百五十四件套清除）') && !readme.includes('冒烟三百五十六件套') && !readme.includes('（356 份）'));
ok('README tests 树串尾已延伸（…+ smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest（npm test 串跑））',
  readme.includes('smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest（npm test 串跑）'));
ok('README 支线/奖励行随新现实（三十六条 · 看好矿车 · STELE_GOAL）',
  readme.includes('四十条支线目标/奖励全部由') &&
  readme.includes('看好矿车（第一块名字石碑 · 累计遭遇 `STELE_GOAL`(40) 场战斗）70 金 + 2 生命药水') &&
  readme.includes('v24.128 补第三十六条 · v24.129 补第三十七条 · v24.130 补第三十八条 · v24.131 补第三十九条 · v24.132 补第四十条') && readme.includes('v24.127 补第三十六条') === false);
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 350 份（smoke.mjs + 350 专项）', chain.length === 354 && ['smoke.mjs', ...chain].length === 355, String(chain.length));
ok('package.json 链尾为 smoke_v24128_stelequest（第 351 份）', chain[chain.length - 1] === 'smoke_v24132_fallenquest', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v24127_lampquest.mjs && smoke_v24128_stelequest.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v24127_lampquest.mjs && node tests/smoke_v24128_stelequest.mjs && node tests/smoke_v24129_stele2quest.mjs && node tests/smoke_v24130_stele3quest.mjs && node tests/smoke_v24131_stele4quest.mjs && node tests/smoke_v24132_fallenquest.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.128（startsWith）', changelog.startsWith('## v24.132'));
ok('CHANGELOG v24.128 条目含「看好矿车」与「STELE_GOAL」与「名字石碑」',
  changelog.includes('看好矿车') && changelog.includes('STELE_GOAL') && changelog.includes('名字石碑'));
ok('CHANGELOG 仍保留 v24.127 条目（历史保留）', changelog.includes('## v24.127 '));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const testsDir = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录件套 = 351（351 + smoke_v24128_stelequest）', files.length === 355, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.127 pin 零残留 ——
const s24127 = read('smoke_v24127_lampquest.mjs');
ok('smoke_v24127 的 GAME_VERSION 字面量 pin 已更新为 v24.128', s24127.includes("const GAME_VERSION = 'v24.132';"));
ok('smoke_v24127 的 CHANGELOG 顶 pin 已更新为 ## v24.128 ', s24127.includes("startsWith('## v24.132'"));
ok('smoke_v24127 的件套 pin 已更新为三百五十五件套（三百五十四件套清除）', s24127.includes('三百五十五件套（三百五十四件套清除）'));
ok('smoke_v24127 的 README/链 tail pin 已随新现实延伸（含 smoke_v24128_stelequest）',
  s24127.includes('smoke_v24128_stelequest'));
ok('smoke_v24127 的链尾 pin 已推进至 smoke_v24128_stelequest（第 351 份）', s24127.includes("=== 'smoke_v24132_fallenquest'"));
const s24126 = read('smoke_v24126_waitquest.mjs');
ok('smoke_v24126 的 GAME_VERSION 字面量 pin 已更新为 v24.128', s24126.includes("const GAME_VERSION = 'v24.132';"));
ok('smoke_v24126 的链尾 pin 已推进至 smoke_v24128_stelequest（第 351 份）', s24126.includes("=== 'smoke_v24132_fallenquest'"));
const s2436 = read('smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（350 专项 / 351）且尚无 352 口径哨兵',
  s2436.includes('suiteFiles.length === 354 && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length === 355') &&
  s2436.includes('!readme.includes(\'冒烟三百五十六件套\')') && s2436.includes('!readme.includes(\'（356 份）\')'));
const s2429 = read('smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 哨兵链前望 352（三百五十六件套否定式）',
  s2429.includes("!readme.includes('冒烟三百五十六件套'"));
// 旧代 v24.127 pin 零残留扫描（豁免本套件）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v24128_stelequest.mjs' || f === 'smoke_v24127_lampquest.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDir), 'utf8').split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  const hits = [];
  if (s2.includes("const GAME_VERSION = '" + "v24.127';")) hits.push('gv');
  if (s2.includes("GAME_VERSION === '" + "v24.127'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.127")) hits.push('cw');
  if (s2.includes('三百五十件套（三百四' + '十九件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 35' + '0')) hits.push('fl');
  if (s2.includes('chainAll.length === 35' + '0')) hits.push('cal');
  if (s2.includes('chain.length === 34' + '9')) hits.push('cl');
  if (s2.includes('treeTok.length === 35' + '0')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v24127_" + "lampquest'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.127 GAME_VERSION/顶 pin/350 口径（哨兵链，豁免本套件）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.128 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
