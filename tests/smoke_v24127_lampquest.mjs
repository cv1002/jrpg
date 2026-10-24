// smoke_v24127_lampquest.mjs —— v24.127 专项冒烟：第三十五条支线「彻夜长明」（拾灯人·累计
// 游玩时长 LAMP_GOAL(3600) 秒=60 分钟）
// （新内容·新支线——承 v24.126 失名的旅人「灯下记名」/ v24.122 守晶人「星砂归匣」/ v24.121 筛砂人
// 「砂里的光」同一「风味 NPC 升格为支线委托人」先例：v22.23 纯风味 NPC「拾灯人」（无字回廊西段北侧
// (5,3)，「进了回廊，先把名字在嘴边念一遍——这里摆着的，都是被忘掉的名字」）升格为委托人——他守了
// 一辈子灯、最懂「灯亮着，名字就找得到回家的路」；玩家在灯下多守的每一刻游玩时光都算替他把这一夜
// 看亮，替他守满 LAMP_GOAL(3600) 秒（=60 分钟）（计数 hero.time 复用既有端口 — js/main.js render
// 驱动 tick 唯一累加点（每帧按真实流逝秒数累加、上限 60s）、随 snapshotHero 全量快照自动持久化、
// 防御式 (g.time||0) 旧档零迁移，与 side_wait「灯下记名」/ ACH_LIST ptime「长明不熄」/ ptime2「彻夜
// 长明」同读一份源；支线门槛 60 分钟低于成就门槛 PLAY_TIME2_GOAL(120 分钟)——顺路先完成支线再解锁
// 成就；挂机/菜单/战斗全场都在累计，到达即算；与 WAIT_GOAL 两档阈值 20 分/60 分错开）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.127 注释 / GAME_VERSION v24.127 与旧 v24.126 字面量
// 零残留 / v24.126 及更早历史注释保留 / LAMP_GOAL 常量与 export）、QUESTS 契约（35 side + 4 main、
// side_lamp 字段逐值、与 PLAY_TIME2_GOAL 同源、ACH_LIST allquests 同源互证、LAMP_GOAL 低于 ptime2
// 成就门槛互证）、quests.js 运行期状态机（offer→active→turnin→done 全链路 + resolveNpcTalk 接取/
// 交付结算 60 金+2 生命药水 + npcQuestMark/npcQuestPages 四态 + sideQuestDone 0/35·3/35·35/35 +
// done 三档 trueBoss/caveBoss/bossDefeated）、NPCS.lampman 升格落位（lines 两页与 after 两页保留
// 零内容丢失契约 + 姊妹件套已随升格更新）、README/package.json/CHANGELOG 同步（件套口径 350 +
// v24.127 守护描述 + 入库 350 + package 串尾 + CHANGELOG 顶 pin）、tests 目录与实跑链恒等（350）、
// 哨兵链（前望 351 且 README 尚无 351 口径）、旧代 v24.126 pin 全库零残留扫描（字面量/顶 pin/349 口径 ·
// 豁免本套件）。
import { GAME_VERSION, QUESTS, LAMP_GOAL, PLAY_TIME2_GOAL, ACH_LIST, NPCS, NPC_SPOTS } from '../js/data.js';
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

console.log('— v24.127 拾灯人「彻夜长明」新支线 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkgRaw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（格式合法 + 已越过 v24.126 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.126', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 126)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.127（旧 v24.126 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.152';") && !dSrc.includes("const GAME_VERSION = 'v24.126';"));
ok('data.js 含 v24.127 注释（彻夜长明新支线说明）',
  dSrc.includes('v24.127 新内容·新支线（第三十五条）'));
ok('data.js 仍保留 v24.126 历史注释（灯下记名说明，零内容丢失）',
  dSrc.includes('v24.126 新内容·新支线（第三十四条）'));

// —— 源级落位：LAMP_GOAL 常量 + export ——
ok('data.js LAMP_GOAL 常量 = 3600（与 WAIT_GOAL 比邻声明，同一家族）',
  dSrc.includes('const LAMP_GOAL = 3600;') && dSrc.indexOf('const LAMP_GOAL') > dSrc.indexOf('const WAIT_GOAL'));
ok('data.js export 块含 LAMP_GOAL（WAIT_GOAL 之后紧邻）',
  dSrc.includes('CRYSTAL_GOAL, WAIT_GOAL, LAMP_GOAL,'));
ok('LAMP_GOAL 与 ptime2 成就门槛同族互证（3600 秒=60 分 < PLAY_TIME2_GOAL 7200 秒=120 分——顺路先完成支线再解锁成就）',
  (() => { const aPt2 = ACH_LIST.find((a) => a.id === 'ptime2');
    return !!aPt2 && LAMP_GOAL === 3600 && PLAY_TIME2_GOAL === 7200 &&
      aPt2.ok({ time: 7199 }) === false && aPt2.ok({ time: 7200 }) === true &&
      aPt2.prog({ time: 1200 }) === '20/120' &&
      LAMP_GOAL < PLAY_TIME2_GOAL; })());
ok('data.js NPC_SPOTS 源级仍含拾灯人据点 (5,3)（零新坐标）',
  dSrc.includes("'5,3': 'lampman'"));

// —— QUESTS 契约：35 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 39 条（35 side + 4 main，派生计数）',
  sideDefs.length === 45 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 49,
  `${sideDefs.length}/${mainDefs.length}`);
ok('side_lamp 存在且为第三十五条（kind side · store · npc/giver lampman · 无 unlockOn）',
  !!QUESTS.side_lamp && QUESTS.side_lamp.kind === 'side' && QUESTS.side_lamp.store === true &&
  QUESTS.side_lamp.npc === 'lampman' && QUESTS.side_lamp.giver === 'lampman' &&
  QUESTS.side_lamp.unlockOn == null);
ok('side_lamp 名称「彻夜长明」/where/obj/offer/turnin/done 落位',
  QUESTS.side_lamp.name === '彻夜长明' && QUESTS.side_lamp.where.includes('无字回廊') &&
  QUESTS.side_lamp.obj.includes(String(Math.floor(LAMP_GOAL / 60))) && QUESTS.side_lamp.obj.includes('分钟') &&
  QUESTS.side_lamp.offer.includes('拾灯人') && QUESTS.side_lamp.turnin.includes('拾灯人') &&
  QUESTS.side_lamp.done.includes('灯'));
ok('side_lamp cond/condProg 与 LAMP_GOAL 同源（hero.time 计数，防御式 (g.time||0)，判/进/文/话一处调全端跟随）',
  QUESTS.side_lamp.cond({}) === false &&
  QUESTS.side_lamp.cond({ time: 3599 }) === false &&
  QUESTS.side_lamp.cond({ time: 3600 }) === true &&
  QUESTS.side_lamp.cond({ time: 6000 }) === true &&
  QUESTS.side_lamp.condProg({}) === `0/${Math.floor(LAMP_GOAL / 60)} 分` &&
  QUESTS.side_lamp.condProg({ time: 900 }) === `15/${Math.floor(LAMP_GOAL / 60)} 分`);
ok('side_lamp reward 逐值：60 金 + 2 生命药水（承 side_wait 60 档）',
  QUESTS.side_lamp.reward.gold === 60 && QUESTS.side_lamp.reward.item === 2 && !QUESTS.side_lamp.reward.potion2);
ok('side_wait 与 side_lamp 同读 hero.time 一份源（20 分/60 分两档阈值错开）',
  QUESTS.side_wait.cond({ time: 1199 }) === false && QUESTS.side_wait.cond({ time: 1200 }) === true &&
  QUESTS.side_lamp.cond({ time: 1200 }) === false && QUESTS.side_lamp.cond({ time: 3600 }) === true);

// —— ACH_LIST allquests 同源互证（与 sideQuestDone 输出一致）——
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('ACH_LIST allquests 名称「灯火同心」且描述派生 35（「45 个支线任务」）',
  !!achAll && achAll.name === '灯火同心' && achAll.d.includes('45 个支线任务'), achAll && achAll.d);
ok('ACH_LIST allquests 判定/进度与 QUESTS 派生同源（0/35 false · 34/35 false · 35/35 true · prog 35/35）',
  !!achAll && achAll.ok({ quests: {} }) === false && achAll.ok({ quests: Object.fromEntries(sideDefs.slice(0, 34).map(q => [q.id, 'done'])) }) === false &&
  achAll.ok({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === true &&
  achAll.prog({ quests: {} }) === '0/45' && achAll.prog({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === '45/45');

// —— quests.js 运行期：sideQuestDone ——
ok('运行期：sideQuestDone 0/36 · 3/36 · 36/36 · 主线不入列',
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
    potionUses: 0, mapPotions: 0, brews: 0, time: 0, x: 5, y: 3, map: 'gallery' }, extra || {});
}
const h1 = mkHero({});
ok('状态机：无存档 → questStatus offer（无 unlockOn 首次进无字回廊即接，承 side_guide 同款）',
  questStatus(h1, 'side_lamp') === 'offer', questStatus(h1, 'side_lamp'));
ok('状态机：npcQuestMark offer 态「❕ 可接委托」',
  npcQuestMark(h1, 'lampman') === '❕ 可接委托', npcQuestMark(h1, 'lampman'));
ok('状态机：npcQuestPages offer 页（拾灯人 · 彻夜长明 · LAMP_GOAL 同源）',
  JSON.stringify(npcQuestPages(h1, 'lampman')).includes('拾灯人') &&
  JSON.stringify(npcQuestPages(h1, 'lampman')).includes(String(Math.floor(LAMP_GOAL / 60))) &&
  JSON.stringify(npcQuestPages(h1, 'lampman')).includes('接下委托'));
const rAcc = resolveNpcTalk(h1, 'lampman');
ok('状态机：resolveNpcTalk 接取 → {kind:accept, id:side_lamp} + quests.side_lamp=active',
  !!rAcc && rAcc.kind === 'accept' && rAcc.id === 'side_lamp' && h1.quests.side_lamp === 'active', JSON.stringify(rAcc));
ok('状态机：active 未达标 → questStatus active（cond 未满足）',
  questStatus(h1, 'side_lamp') === 'active', questStatus(h1, 'side_lamp'));
ok('状态机：active 页函数型实时报进度（已累计 0/60 分）',
  JSON.stringify(npcQuestPages(h1, 'lampman')).includes('0/' + Math.floor(LAMP_GOAL / 60) + ' 分'));
ok('状态机：任务日志 objective 同源（累计游玩时长 0/60 分）',
  questJournal(h1).find((e) => e.id === 'side_lamp').objective.includes('分钟') &&
  questJournal(h1).find((e) => e.id === 'side_lamp').objective.includes(`0/${Math.floor(LAMP_GOAL / 60)} 分`));
const h2 = mkHero({ quests: { side_lamp: 'active' }, time: 3600 });
ok('状态机：达标（time=3600 秒）→ questStatus turnin',
  questStatus(h2, 'side_lamp') === 'turnin', questStatus(h2, 'side_lamp'));
ok('状态机：npcQuestMark turnin 态「❕ 可交任务」',
  npcQuestMark(h2, 'lampman') === '❕ 可交任务', npcQuestMark(h2, 'lampman'));
const rRew = resolveNpcTalk(h2, 'lampman');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:60, item:2} + done + 结算 60 金/2 生命药水',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 60 && rRew.item === 2 &&
  h2.quests.side_lamp === 'done' && h2.gold === 60 && h2.item === 3, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）',
  resolveNpcTalk(h2, 'lampman') === null);
ok('状态机：done 默认档（名字还悬在雾里，可灯还亮着）',
  JSON.stringify(npcQuestPages(h2, 'lampman')).includes('名字还悬在雾里'));
ok('状态机：done bossDefeated 档（灯芯回来了叙事并入，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_lamp: 'done' }, bossDefeated: true }), 'lampman')).includes('灯芯回来了'));
ok('状态机：done caveBoss 档（星砂/回廊叙事并入，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_lamp: 'done' }, caveBoss: true }), 'lampman')).includes('星砂'));
ok('状态机：done trueBoss 档（after 彩蛋「廊子空了/往后走夜路」两页并入 done 分档，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_lamp: 'done' }, trueBoss: true }), 'lampman')).includes('廊子空') &&
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_lamp: 'done' }, trueBoss: true }), 'lampman')).includes('往后走夜路'));
ok('状态机：done 态 npcQuestMark 零顶标（lampman 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_lamp: 'done' } }), 'lampman') === null);
ok('questRewardPreview 与 reward 同源（60 金 + 2 生命药水）',
  (() => { const prev = questRewardPreview(mkHero({}), 'side_lamp'); return !!prev && prev.gold === 60 && prev.item === 2 && prev.potion2 === 0; })());
ok('运行期：其余纯风味 NPC 零顶标（stele2/stele3 无待办，stele1 已升格不在纯风味列）',
  npcQuestMark(mkHero({}), 'stele2') === null && npcQuestMark(mkHero({}), 'stele3') === null);
ok('运行期：旧档无 time 字段（0 秒）不误解锁（防御式旧档零迁移）',
  questStatus(mkHero({ quests: {}, time: undefined }), 'side_lamp') === 'offer');

// —— NPCS.lampman 升格落位（零新 NPC/坐标/数据层三件套之外零改动）——
ok('NPCS.lampman 存在（拾灯人 · mark hood · 含 v24.127 升格注释）',
  !!NPCS.lampman && NPCS.lampman.name === '拾灯人' && NPCS.lampman.mark === 'hood' &&
  dSrc.includes('v24.127 升格为支线委托人'));
ok('NPCS.lampman 原有 lines 两页 / trueBoss after 两页彩蛋数据层保留（零内容丢失契约）',
  Array.isArray(NPCS.lampman.lines) && NPCS.lampman.lines.length === 2 &&
  Array.isArray(NPCS.lampman.after) && NPCS.lampman.after.length === 2 &&
  NPCS.lampman.after[0].some((ln) => ln.includes('廊子空')) && NPCS.lampman.after[1].some((ln) => ln.includes('往后走夜路')));
ok('NPCS.lampman 无 linesByStage（静态台词机制保留）',
  !!NPCS.lampman && !NPCS.lampman.linesByStage);
ok('姊妹件 smoke_v2223_lampman 已随升格更新（任务 offer 契约 + 升格后顶标/接取翻转）',
  read('smoke_v2223_lampman.mjs').includes('接下委托') && read('smoke_v2223_lampman.mjs').includes('side_lamp'));
ok('姊妹件 smoke_v2235_minimapquest 已随升格更新（lampman 入任务 NPC 列表 + side_lamp done）',
  read('smoke_v2235_minimapquest.mjs').includes("'lampman'") && read('smoke_v2235_minimapquest.mjs').includes('side_lamp'));
ok('姊妹件纯风味列表已把 lampman 换成仍纯风味的 stele（smoke.mjs/v24112/v24119）',
  read('smoke.mjs').includes("npcQuestMark(fresh,'stele2')") && !read('smoke.mjs').includes("npcQuestMark(fresh,'lampman')") &&
  !read('smoke_v24112_talkquest.mjs').includes("'lampman') === null") &&
  !read('smoke_v24119_huntquest.mjs').includes("'lampman') === null"));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为三百六十四件套（三百六十三件套清除）',
  readme.includes('冒烟三百六十四件套（三百六十三件套清除）'));
ok('README tests 含 v24.127 守护描述与 smoke_v24127_lampquest 入库（350 份）',
  readme.includes('v24.127 起含「拾灯人「彻夜长明」新支线」守护') &&
  readme.includes('smoke_v24127_lampquest 入库（350 份）'));
ok('README 仍有 v24.126 守护描述（历史保留）', readme.includes('v24.126 起含'));
ok('README 已有三百五十件套口径且尚无 351（哨兵前望 351 语义：下一版才写 351）',
  readme.includes('冒烟三百六十四件套（三百六十三件套清除）') && !readme.includes('冒烟三百六十五件套') && !readme.includes('（365 份）'));
ok('README tests 树串尾已延伸（…+ smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑））',
  readme.includes('smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑）'));
ok('README 支线/奖励行随新现实（三十五条 · 彻夜长明 · LAMP_GOAL）',
  readme.includes('四十五条支线目标/奖励全部由') &&
  readme.includes('彻夜长明（拾灯人 · 累计游玩时长 `LAMP_GOAL`(3600) 秒=60 分钟）60 金 + 2 生命药水') &&
  readme.includes('v24.127 补第三十五条 · v24.128 补第三十六条 · v24.129 补第三十七条 · v24.130 补第三十八条 · v24.131 补第三十九条 · v24.132 补第四十条 · v24.133 补第四十一条 · v24.134 补第四十二条 · v24.135 补第四十三条 · v24.136 补第四十四条 · v24.143 补第四十五条') && readme.includes('v24.126 补第三十五条') === false);
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 349 份（smoke.mjs + 349 专项）', chain.length === 363 && ['smoke.mjs', ...chain].length === 364, String(chain.length));
ok('package.json 链尾为 smoke_v24127_lampquest（第 350 份）', chain[chain.length - 1] === 'smoke_v24152_nopotion', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v24126_waitquest.mjs && smoke_v24127_lampquest.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v24126_waitquest.mjs && node tests/smoke_v24127_lampquest.mjs && node tests/smoke_v24128_stelequest.mjs && node tests/smoke_v24129_stele2quest.mjs && node tests/smoke_v24130_stele3quest.mjs && node tests/smoke_v24131_stele4quest.mjs && node tests/smoke_v24132_fallenquest.mjs && node tests/smoke_v24133_inquest.mjs && node tests/smoke_v24134_kindleq.mjs && node tests/smoke_v24135_ledgerquest.mjs && node tests/smoke_v24136_herbquest.mjs && node tests/smoke_v24143_furnacequest.mjs && node tests/smoke_v24147_unflicker.mjs && node tests/smoke_v24148_swift.mjs && node tests/smoke_v24151_lowlv.mjs && node tests/smoke_v24152_nopotion.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.127（startsWith）', changelog.startsWith('## v24.152'));
ok('CHANGELOG v24.127 条目含「彻夜长明」与「LAMP_GOAL」与「拾灯人」',
  changelog.includes('彻夜长明') && changelog.includes('LAMP_GOAL') && changelog.includes('拾灯人'));
ok('CHANGELOG 仍保留 v24.126 条目（历史保留）', changelog.includes('## v24.126 '));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const testsDir = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录件套 = 350（349 + smoke_v24127_lampquest）', files.length === 364, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.126 pin 零残留 ——
const s24126 = read('smoke_v24126_waitquest.mjs');
ok('smoke_v24126 的 GAME_VERSION 字面量 pin 已更新为 v24.127', s24126.includes("const GAME_VERSION = 'v24.152';"));
ok('smoke_v24126 的 CHANGELOG 顶 pin 已更新为 ## v24.127 ', s24126.includes("startsWith('## v24.152'"));
ok('smoke_v24126 的件套 pin 已更新为三百六十四件套（三百六十三件套清除）', s24126.includes('三百六十四件套（三百六十三件套清除）'));
ok('smoke_v24126 的 README/链 tail pin 已随新现实延伸（含 smoke_v24127_lampquest）',
  s24126.includes('smoke_v24127_lampquest'));
ok('smoke_v24126 的链尾 pin 已推进至 smoke_v24127_lampquest（第 350 份）', s24126.includes("=== 'smoke_v24152_nopotion'"));
const s24125 = read('smoke_v24125_hunthud.mjs');
ok('smoke_v24125 的 GAME_VERSION 字面量 pin 已更新为 v24.127', s24125.includes("const GAME_VERSION = 'v24.152';"));
ok('smoke_v24125 的链尾 pin 已推进至 smoke_v24127_lampquest（第 350 份）', s24125.includes("=== 'smoke_v24152_nopotion'"));
const s2436 = read('smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（349 专项 / 350）且尚无 351 口径哨兵',
  s2436.includes('suiteFiles.length === 363 && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length === 364') &&
  s2436.includes('!readme.includes(\'冒烟三百六十五件套\')') && s2436.includes('!readme.includes(\'（365 份）\')'));
const s2429 = read('smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 哨兵链前望 351（三百六十五件套否定式）',
  s2429.includes("!readme.includes('冒烟三百六十五件套'"));
// 旧代 v24.126 pin 零残留扫描（豁免本套件）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v24127_lampquest.mjs' || f === 'smoke_v24126_waitquest.mjs' || f === 'smoke_v2223_lampman.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDir), 'utf8').split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  const hits = [];
  if (s2.includes("const GAME_VERSION = '" + "v24.126';")) hits.push('gv');
  if (s2.includes("GAME_VERSION === '" + "v24.126'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.126")) hits.push('cw');
  if (s2.includes('三百四十九件套（三百四' + '十八件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 34' + '9')) hits.push('fl');
  if (s2.includes('chainAll.length === 34' + '9')) hits.push('cal');
  if (s2.includes('chain.length === 34' + '8')) hits.push('cl');
  if (s2.includes('treeTok.length === 34' + '9')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v24126_" + "waitquest'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.126 GAME_VERSION/顶 pin/349 口径（哨兵链，豁免本套件）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.127 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
