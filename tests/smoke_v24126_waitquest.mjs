// smoke_v24126_waitquest.mjs —— v24.126 专项冒烟：第三十四条支线「灯下记名」（失名的旅人·累计
// 游玩时长 WAIT_GOAL(1200) 秒=20 分钟）
// （新内容·新支线——承 v24.122 守晶人「星砂归匣」/ v24.121 筛砂人「砂里的光」/ v24.119 守洞人
// 「数到灯亮」同一「风味 NPC 升格为支线委托人」先例：v22.21 纯风味 NPC「失名的旅人」（雾语林
// 北环路蘑菇田东头 (21,2)，「雾一进林子，就把我的名字卷走了……你替我记着，成吗」）升格为委托人—
// 他连自己的名字都记不住，只能靠「记得的人」替他保管；玩家在灯下多守的每一刻游玩时光都算替他把
// 名字多记一分，替他守满 WAIT_GOAL(1200) 秒（=20 分钟）（计数 hero.time 复用既有端口 — js/main.js
// render 驱动 tick 唯一累加点（每帧按真实流逝秒数累加、上限 60s）、随 snapshotHero 全量快照自动持久化、
// 防御式 (g.time||0) 旧档零迁移，与 ACH_LIST ptime「长明不熄」同读一份源；支线门槛 20 分钟低于成就
// 门槛 PLAY_TIME_GOAL(60 分钟)——顺路先完成支线再解锁成就；挂机/菜单/战斗全场都在累计，到达即算；
// 零新计数零新状态零新存档）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.126 注释 / GAME_VERSION v24.126 与旧 v24.125 字面量零残留 /
// v24.125 及更早历史注释保留 / WAIT_GOAL 常量与 export）、QUESTS 契约（34 side + 4 main、
// side_wait 字段逐值、与 PLAY_TIME_GOAL 同源、ACH_LIST allquests 同源互证、WAIT_GOAL 低于
// ptime 成就门槛互证）、quests.js 运行期状态机（offer→active→turnin→done 全链路 + resolveNpcTalk
// 接取/交付结算 60 金+2 生命药水 + npcQuestMark/npcQuestPages 四态 + sideQuestDone 0/34·3/34·34/34 +
// done 三档 trueBoss/caveBoss/bossDefeated）、NPCS.wanderer 升格落位（lines 两页与 after 两页保留
// 零内容丢失契约 + 姊妹件套已随升格更新）、README/package.json/CHANGELOG 同步（件套口径 349 +
// v24.126 守护描述 + 入库 349 + package 串尾 + CHANGELOG 顶 pin）、tests 目录与实跑链恒等（349）、
// 哨兵链（前望 350 且 README 尚无 350 口径）、旧代 v24.125 pin 全库零残留扫描（字面量/顶 pin/348 口径 ·
// 豁免本套件）。
import { GAME_VERSION, QUESTS, WAIT_GOAL, PLAY_TIME_GOAL, ACH_LIST, NPCS, NPC_SPOTS } from '../js/data.js';
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

console.log('— v24.126 失名的旅人「灯下记名」新支线 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkgRaw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（格式合法 + 已越过 v24.125 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.125', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 125)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.126（旧 v24.125 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.148';") && !dSrc.includes("const GAME_VERSION = 'v24.125';"));
ok('data.js 含 v24.126 注释（灯下记名新支线说明）',
  dSrc.includes('v24.126 新内容·新支线（第三十四条）'));
ok('data.js 仍保留 v24.125 历史注释（HUD 驱雾百战说明，零内容丢失）',
  dSrc.includes('v24.125 体验打磨·信息透明·计数现场：HUD 常驻'));

// —— 源级落位：WAIT_GOAL 常量 + export ——
ok('data.js WAIT_GOAL 常量 = 1200（与 CRYSTAL_GOAL 比邻声明，同一家族）',
  dSrc.includes('const WAIT_GOAL = 1200;') && dSrc.indexOf('const WAIT_GOAL') > dSrc.indexOf('const CRYSTAL_GOAL'));
ok('data.js export 块含 WAIT_GOAL（CRYSTAL_GOAL 之后紧邻）',
  dSrc.includes('CRYSTAL_GOAL, WAIT_GOAL,'));
ok('WAIT_GOAL 与 ptime 成就门槛同族互证（1200 秒=20 分 < PLAY_TIME_GOAL 3600 秒=60 分——顺路先完成支线再解锁成就）',
  (() => { const aPt = ACH_LIST.find((a) => a.id === 'ptime');
    return !!aPt && WAIT_GOAL === 1200 && PLAY_TIME_GOAL === 3600 &&
      aPt.ok({ time: 3599 }) === false && aPt.ok({ time: 3600 }) === true &&
      aPt.prog({ time: 600 }) === '10/60' &&
      WAIT_GOAL < PLAY_TIME_GOAL; })());
ok('data.js NPC_SPOTS 源级仍含失名的旅人据点 (21,2)（零新坐标）',
  dSrc.includes("'21,2': 'wanderer'"));

// —— QUESTS 契约：34 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 38 条（34 side + 4 main，派生计数）',
  sideDefs.length === 45 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 49,
  `${sideDefs.length}/${mainDefs.length}`);
ok('side_wait 存在且为第三十四条（kind side · store · npc/giver wanderer · 无 unlockOn）',
  !!QUESTS.side_wait && QUESTS.side_wait.kind === 'side' && QUESTS.side_wait.store === true &&
  QUESTS.side_wait.npc === 'wanderer' && QUESTS.side_wait.giver === 'wanderer' &&
  QUESTS.side_wait.unlockOn == null);
ok('side_wait 名称「灯下记名」/where/obj/offer/turnin/done 落位',
  QUESTS.side_wait.name === '灯下记名' && QUESTS.side_wait.where.includes('雾语林') &&
  QUESTS.side_wait.obj.includes(String(Math.floor(WAIT_GOAL / 60))) && QUESTS.side_wait.obj.includes('分钟') &&
  QUESTS.side_wait.offer.includes('失名的旅人') && QUESTS.side_wait.turnin.includes('失名的旅人') &&
  QUESTS.side_wait.done.includes('名字'));
ok('side_wait cond/condProg 与 WAIT_GOAL 同源（hero.time 计数，防御式 (g.time||0)，判/进/文/话一处调全端跟随）',
  QUESTS.side_wait.cond({}) === false &&
  QUESTS.side_wait.cond({ time: 1199 }) === false &&
  QUESTS.side_wait.cond({ time: 1200 }) === true &&
  QUESTS.side_wait.cond({ time: 6000 }) === true &&
  QUESTS.side_wait.condProg({}) === `0/${Math.floor(WAIT_GOAL / 60)} 分` &&
  QUESTS.side_wait.condProg({ time: 300 }) === `5/${Math.floor(WAIT_GOAL / 60)} 分`);
ok('side_wait reward 逐值：60 金 + 2 生命药水（承 side_moon 60 档）',
  QUESTS.side_wait.reward.gold === 60 && QUESTS.side_wait.reward.item === 2 && !QUESTS.side_wait.reward.potion2);

// —— ACH_LIST allquests 同源互证（与 sideQuestDone 输出一致）——
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('ACH_LIST allquests 名称「灯火同心」且描述派生 34（「45 个支线任务」）',
  !!achAll && achAll.name === '灯火同心' && achAll.d.includes('45 个支线任务'), achAll && achAll.d);
ok('ACH_LIST allquests 判定/进度与 QUESTS 派生同源（0/34 false · 33/34 false · 34/34 true · prog 34/34）',
  !!achAll && achAll.ok({ quests: {} }) === false && achAll.ok({ quests: Object.fromEntries(sideDefs.slice(0, 33).map(q => [q.id, 'done'])) }) === false &&
  achAll.ok({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === true &&
  achAll.prog({ quests: {} }) === '0/45' && achAll.prog({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === '45/45');

// —— quests.js 运行期：sideQuestDone ——
ok('运行期：sideQuestDone 0/34 · 3/34 · 34/34 · 主线不入列',
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
    potionUses: 0, mapPotions: 0, brews: 0, time: 0, x: 21, y: 3, map: 'dungeon' }, extra || {});
}
const h1 = mkHero({});
ok('状态机：无存档 → questStatus offer（无 unlockOn 首次进雾语林即接，承 side_walk/side_tale 同款）',
  questStatus(h1, 'side_wait') === 'offer', questStatus(h1, 'side_wait'));
ok('状态机：npcQuestMark offer 态「❕ 可接委托」',
  npcQuestMark(h1, 'wanderer') === '❕ 可接委托', npcQuestMark(h1, 'wanderer'));
ok('状态机：npcQuestPages offer 页（失名的旅人 · 灯下记名 · WAIT_GOAL 同源）',
  JSON.stringify(npcQuestPages(h1, 'wanderer')).includes('失名的旅人') &&
  JSON.stringify(npcQuestPages(h1, 'wanderer')).includes(String(Math.floor(WAIT_GOAL / 60))) &&
  JSON.stringify(npcQuestPages(h1, 'wanderer')).includes('接下委托'));
const rAcc = resolveNpcTalk(h1, 'wanderer');
ok('状态机：resolveNpcTalk 接取 → {kind:accept, id:side_wait} + quests.side_wait=active',
  !!rAcc && rAcc.kind === 'accept' && rAcc.id === 'side_wait' && h1.quests.side_wait === 'active', JSON.stringify(rAcc));
ok('状态机：active 未达标 → questStatus active（cond 未满足）',
  questStatus(h1, 'side_wait') === 'active', questStatus(h1, 'side_wait'));
ok('状态机：active 页函数型实时报进度（已累计 0/20 分）',
  JSON.stringify(npcQuestPages(h1, 'wanderer')).includes('0/' + Math.floor(WAIT_GOAL / 60) + ' 分'));
ok('状态机：任务日志 objective 同源（累计游玩时长 0/20 分）',
  questJournal(h1).find((e) => e.id === 'side_wait').objective.includes('分钟') &&
  questJournal(h1).find((e) => e.id === 'side_wait').objective.includes(`0/${Math.floor(WAIT_GOAL / 60)} 分`));
const h2 = mkHero({ quests: { side_wait: 'active' }, time: 1200 });
ok('状态机：达标（time=1200 秒）→ questStatus turnin',
  questStatus(h2, 'side_wait') === 'turnin', questStatus(h2, 'side_wait'));
ok('状态机：npcQuestMark turnin 态「❕ 可交任务」',
  npcQuestMark(h2, 'wanderer') === '❕ 可交任务', npcQuestMark(h2, 'wanderer'));
const rRew = resolveNpcTalk(h2, 'wanderer');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:60, item:2} + done + 结算 60 金/2 生命药水',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 60 && rRew.item === 2 &&
  h2.quests.side_wait === 'done' && h2.gold === 60 && h2.item === 3, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）',
  resolveNpcTalk(h2, 'wanderer') === null);
ok('状态机：done 默认档（名字还悬在雾里，可我不慌了）',
  JSON.stringify(npcQuestPages(h2, 'wanderer')).includes('名字还悬在雾里'));
ok('状态机：done bossDefeated 档（灯芯回来了叙事并入，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_wait: 'done' }, bossDefeated: true }), 'wanderer')).includes('灯芯回来了'));
ok('状态机：done caveBoss 档（星砂/回廊叙事并入，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_wait: 'done' }, caveBoss: true }), 'wanderer')).includes('碑'));
ok('状态机：done trueBoss 档（after 彩蛋「雾散了/你替我保管的名字」两页并入 done 分档，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_wait: 'done' }, trueBoss: true }), 'wanderer')).includes('雾散') &&
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_wait: 'done' }, trueBoss: true }), 'wanderer')).includes('保管'));
ok('状态机：done 态 npcQuestMark 零顶标（wanderer 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_wait: 'done' } }), 'wanderer') === null);
ok('questRewardPreview 与 reward 同源（60 金 + 2 生命药水）',
  (() => { const prev = questRewardPreview(mkHero({}), 'side_wait'); return !!prev && prev.gold === 60 && prev.item === 2 && prev.potion2 === 0; })());
ok('运行期：其余纯风味 NPC 零顶标（stele2/stele1 无待办）',
  npcQuestMark(mkHero({}), 'stele2') === null && npcQuestMark(mkHero({}), 'stele3') === null);
ok('运行期：旧档无 time 字段（0 秒）不误解锁（防御式旧档零迁移）',
  questStatus(mkHero({ quests: {}, time: undefined }), 'side_wait') === 'offer');

// —— NPCS.wanderer 升格落位（零新 NPC/坐标/数据层三件套之外零改动）——
ok('NPCS.wanderer 存在（失名的旅人 · mark lamp · 含 v24.126 升格注释）',
  !!NPCS.wanderer && NPCS.wanderer.name === '失名的旅人' && NPCS.wanderer.mark === 'lamp' &&
  dSrc.includes('v24.126 升格为'));
ok('NPCS.wanderer 原有 lines 两页 / trueBoss after 两页彩蛋数据层保留（零内容丢失契约）',
  Array.isArray(NPCS.wanderer.lines) && NPCS.wanderer.lines.length === 2 &&
  Array.isArray(NPCS.wanderer.after) && NPCS.wanderer.after.length === 2 &&
  NPCS.wanderer.after[0].some((ln) => ln.includes('雾散')) && NPCS.wanderer.after[1].some((ln) => ln.includes('保管')));
ok('NPCS.wanderer 无 linesByStage（静态台词机制保留）',
  !!NPCS.wanderer && !NPCS.wanderer.linesByStage);
ok('姊妹件 smoke_v2221_wanderer 已随升格更新（任务 offer 契约 + 升格后顶标/接取翻转）',
  read('smoke_v2221_wanderer.mjs').includes('接下委托') && read('smoke_v2221_wanderer.mjs').includes('side_wait'));
ok('姊妹件 smoke_v2235_minimapquest 已随升格更新（wanderer 入任务 NPC 列表 + side_wait done）',
  read('smoke_v2235_minimapquest.mjs').includes("'wanderer'") && read('smoke_v2235_minimapquest.mjs').includes('side_wait'));
ok('姊妹件纯风味列表已把 wanderer 换成仍纯风味的 stele2/stele3（smoke.mjs/v24112/v24119）',
  read('smoke.mjs').includes("npcQuestMark(fresh,'stele2')") && !read('smoke.mjs').includes("npcQuestMark(fresh,'wanderer')") &&
  !read('smoke_v24112_talkquest.mjs').includes("'wanderer') === null") &&
  !read('smoke_v24119_huntquest.mjs').includes("'wanderer') === null"));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为三百六十二件套（三百六十一件套清除）',
  readme.includes('冒烟三百六十二件套（三百六十一件套清除）'));
ok('README tests 含 v24.126 守护描述与 smoke_v24126_waitquest 入库（349 份）',
  readme.includes('v24.126 起含「失名的旅人「灯下记名」新支线」守护') &&
  readme.includes('smoke_v24126_waitquest 入库（349 份）'));
ok('README 仍有 v24.125 守护描述（历史保留）', readme.includes('v24.125 起含'));
ok('README 已有三百四十九件套口径且尚无 350（哨兵前望 350 语义：下一版才写 350）',
  readme.includes('冒烟三百六十二件套（三百六十一件套清除）') && !readme.includes('冒烟三百六十三件套') && !readme.includes('（363 份）'));
ok('README tests 树串尾已延伸（…+ smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑））',
  readme.includes('smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑）'));
ok('README 支线/奖励行随新现实（三十四条 · 灯下记名 · WAIT_GOAL）',
  readme.includes('四十五条支线目标/奖励全部由') &&
  readme.includes('灯下记名（失名的旅人 · 累计游玩时长 `WAIT_GOAL`(1200) 秒=20 分钟）60 金 + 2 生命药水') &&
  readme.includes('v24.126 补第三十四条 · v24.127 补第三十五条 · v24.128 补第三十六条 · v24.129 补第三十七条 · v24.130 补第三十八条 · v24.131 补第三十九条 · v24.132 补第四十条 · v24.133 补第四十一条 · v24.134 补第四十二条 · v24.135 补第四十三条 · v24.136 补第四十四条 · v24.143 补第四十五条') && readme.includes('v24.125 补第三十四条') === false);
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 348 份（smoke.mjs + 348 专项）', chain.length === 361 && ['smoke.mjs', ...chain].length === 362, String(chain.length));
ok('package.json 链尾为 smoke_v24126_waitquest（第 349 份）', chain[chain.length - 1] === 'smoke_v24148_swift', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v24125_hunthud.mjs && smoke_v24126_waitquest.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v24125_hunthud.mjs && node tests/smoke_v24126_waitquest.mjs && node tests/smoke_v24127_lampquest.mjs && node tests/smoke_v24128_stelequest.mjs && node tests/smoke_v24129_stele2quest.mjs && node tests/smoke_v24130_stele3quest.mjs && node tests/smoke_v24131_stele4quest.mjs && node tests/smoke_v24132_fallenquest.mjs && node tests/smoke_v24133_inquest.mjs && node tests/smoke_v24134_kindleq.mjs && node tests/smoke_v24135_ledgerquest.mjs && node tests/smoke_v24136_herbquest.mjs && node tests/smoke_v24143_furnacequest.mjs && node tests/smoke_v24147_unflicker.mjs && node tests/smoke_v24148_swift.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.126（startsWith）', changelog.startsWith('## v24.148'));
ok('CHANGELOG v24.126 条目含「灯下记名」与「WAIT_GOAL」与「失名的旅人」',
  changelog.includes('灯下记名') && changelog.includes('WAIT_GOAL') && changelog.includes('失名的旅人'));
ok('CHANGELOG 仍保留 v24.125 条目（历史保留）', changelog.includes('## v24.125 '));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const testsDir = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录件套 = 349（348 + smoke_v24126_waitquest）', files.length === 362, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.125 pin 零残留 ——
const s24125 = read('smoke_v24125_hunthud.mjs');
ok('smoke_v24125 的 GAME_VERSION 字面量 pin 已更新为 v24.126', s24125.includes("const GAME_VERSION = 'v24.148';"));
ok('smoke_v24125 的 CHANGELOG 顶 pin 已更新为 ## v24.126 ', s24125.includes("startsWith('## v24.148'"));
ok('smoke_v24125 的件套 pin 已更新为三百六十二件套（三百六十一件套清除）', s24125.includes('三百六十二件套（三百六十一件套清除）'));
ok('smoke_v24125 的 README/链 tail pin 已随新现实延伸（含 smoke_v24126_waitquest）',
  s24125.includes('smoke_v24126_waitquest'));
ok('smoke_v24125 的链尾 pin 已推进至 smoke_v24126_waitquest（第 349 份）', s24125.includes("=== 'smoke_v24148_swift'"));
const s24124 = read('smoke_v24124_questshud.mjs');
ok('smoke_v24124 的 GAME_VERSION 字面量 pin 已更新为 v24.126', s24124.includes("const GAME_VERSION = 'v24.148';"));
ok('smoke_v24124 的链尾 pin 已推进至 smoke_v24126_waitquest（第 349 份）', s24124.includes("=== 'smoke_v24148_swift'"));
const s2436 = read('smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（348 专项 / 349）且尚无 350 口径哨兵',
  s2436.includes('suiteFiles.length === 361 && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length === 362') &&
  s2436.includes('!readme.includes(\'冒烟三百六十三件套\')') && s2436.includes('!readme.includes(\'（363 份）\')'));
const s2429 = read('smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 哨兵链前望 350（三百六十三件套否定式）',
  s2429.includes("!readme.includes('冒烟三百六十三件套'"));
// 旧代 v24.125 pin 零残留扫描（豁免本套件）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v24126_waitquest.mjs' || f === 'smoke_v2221_wanderer.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDir), 'utf8').split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  const hits = [];
  if (s2.includes("const GAME_VERSION = '" + "v24.125';")) hits.push('gv');
  if (s2.includes("GAME_VERSION === '" + "v24.125'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.125")) hits.push('cw');
  if (s2.includes('三百四十八件套（三百四' + '十七件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 34' + '7')) hits.push('fl');
  if (s2.includes('chainAll.length === 34' + '7')) hits.push('cal');
  if (s2.includes('chain.length === 34' + '6')) hits.push('cl');
  if (s2.includes('treeTok.length === 34' + '7')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v24125_" + "hunthud'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.125 GAME_VERSION/顶 pin/348 口径（哨兵链，豁免本套件）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.126 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
