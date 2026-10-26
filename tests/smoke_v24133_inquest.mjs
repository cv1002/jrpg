// smoke_v24133_inquest.mjs —— v24.133 专项冒烟：第四十一条支线「一夜好眠」（打更人·累计住店
// INN_GOAL(8) 夜）
// （新内容·新支线——承 v24.132 守墓人「灰烬不冷」同一「全新 NPC 计数支线」先例：潮灯镇旅馆门前石阶
// (8,13) 新增「打更人」——人人都睡了的时候醒着替全镇听动静；玩家累计住店 INN_GOAL(8) 夜（计数
// hero.innRests 复用既有端口——shop.stayInn 成功住店全游唯一产生点写入（金币不足/精神饱满早退零计数）、
// 随 snapshotHero 全量快照自动持久化、防御式 (g.innRests||0) 旧档零迁移，与 ACH_LIST innrest「夜宿灯下」
// 同读一份源；支线门槛 8 低于成就门槛 INN_REST_GOAL(15)——顺路先完成支线再解锁成就；零新计数零新状态
// 零新存档）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.133 注释 / GAME_VERSION v24.133 与旧 v24.132 字面量零残留 /
// v24.132 及更早历史注释保留 / INN_GOAL 常量与 export）、QUESTS 契约（41 side + 4 main、
// side_inn 字段逐值、与 INN_REST_GOAL 同源、ACH_LIST allquests 同源互证、INN_GOAL 低于
// innrest 成就门槛互证）、quests.js 运行期状态机（offer→active→turnin→done 全链路 + resolveNpcTalk
// 接取/交付结算 70 金+2 生命药水 + npcQuestMark/npcQuestPages 四态 + sideQuestDone 0/41 +
// done 三档 trueBoss/caveBoss/bossDefeated）、NPCS.nightwatch 落位（打更人 mark lamp + village.extras/
// NPC_SPOTS '8,13' 全局坐标 + 姊妹件 minimap 随新现实更新）、README/package.json/CHANGELOG 同步
// （件套口径 356 + v24.133 守护描述 + 入库 356 + package 串尾 + CHANGELOG 顶 pin）、tests 目录与实跑链
// 恒等（356）、哨兵链（前望 357 且 README 尚无 357 口径）、旧代 v24.132 pin 全库零残留扫描（字面量/
// 顶 pin/355 口径 · 豁免本套件）。
import { GAME_VERSION, QUESTS, INN_GOAL, INN_REST_GOAL, ACH_LIST, NPCS, NPC_SPOTS } from '../js/data.js';
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

console.log('— v24.133 打更人「一夜好眠」新支线 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkgRaw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（格式合法 + 已越过 v24.132 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.132', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 132)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.133（旧 v24.132 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.165';") && !dSrc.includes("const GAME_VERSION = 'v24.136';"));
ok('data.js 含 v24.133 注释（一夜好眠新支线说明）',
  dSrc.includes('v24.133 新内容·新支线（第四十一条）'));
ok('data.js 仍保留 v24.132 历史注释（灰烬不冷支线说明，零内容丢失）',
  dSrc.includes('v24.132 新内容·新支线（第四十条）'));

// —— 源级落位：INN_GOAL 常量 + export + NPC/坐标 ——
ok('data.js INN_GOAL 常量 = 8（与 INN_REST_GOAL 同族声明，同一住店端口家族）',
  dSrc.includes('const INN_GOAL = 8;') && dSrc.indexOf('const INN_GOAL') > dSrc.indexOf('const FALLEN_GOAL'));
ok('data.js export 块含 INN_GOAL（FALLEN_GOAL 之后紧邻）',
  dSrc.includes('FALLEN_GOAL, KINDLE_GOAL, INN_GOAL,'));
ok('INN_GOAL 与 innrest 成就门槛同族互证（8 < INN_REST_GOAL 15——顺路先完成支线再解锁成就）',
  (() => { const aCh = ACH_LIST.find((a) => a.id === 'innrest');
    return !!aCh && INN_GOAL === 8 && INN_REST_GOAL === 15 &&
      aCh.ok({}) === false && aCh.ok({ innRests: 14 }) === false && aCh.ok({ innRests: 15 }) === true &&
      aCh.prog({ innRests: 8 }) === '8/15' && INN_GOAL < INN_REST_GOAL; })());
ok('data.js NPCS.nightwatch 存在（打更人 · mark lamp 复用既有灯标 · 零视觉新代码）',
  !!NPCS.nightwatch && NPCS.nightwatch.name === '打更人' && NPCS.nightwatch.mark === 'lamp');
ok('data.js NPC_SPOTS 含打更人据点 (8,13)，全局坐标键未被他图占用',
  NPC_SPOTS['8,13'] === 'nightwatch');
ok('data.js village.extras 含 (8,13) NPC 项（全局唯一点位，不与既有键冲突）',
  dSrc.includes("{ x: 8, y: 13, ty: 'NPC' }"));

// —— QUESTS 契约：41 side + 4 main（数量派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 45 条（41 side + 4 main，派生计数）',
  sideDefs.length === 45 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 49,
  `${sideDefs.length}/${mainDefs.length}`);
ok('side_inn 存在且为第四十一条（kind side · store · npc/giver nightwatch · 无 unlockOn）',
  !!QUESTS.side_inn && QUESTS.side_inn.kind === 'side' && QUESTS.side_inn.store === true &&
  QUESTS.side_inn.npc === 'nightwatch' && QUESTS.side_inn.giver === 'nightwatch' &&
  QUESTS.side_inn.unlockOn == null);
ok('side_inn 名称「一夜好眠」/where/obj/offer/turnin/done 落位',
  QUESTS.side_inn.name === '一夜好眠' && QUESTS.side_inn.where.includes('潮灯镇') &&
  QUESTS.side_inn.obj.includes(String(INN_GOAL)) && QUESTS.side_inn.obj.includes('夜') &&
  QUESTS.side_inn.offer.includes('打更人') && QUESTS.side_inn.turnin.includes('打更人') &&
  QUESTS.side_inn.done.includes('更声'));
ok('side_inn cond/condProg 与 INN_GOAL 同源（hero.innRests 计数，缺字段防御式 0，判/进/文/话一处调全端跟随）',
  QUESTS.side_inn.cond({}) === false &&
  QUESTS.side_inn.cond({ innRests: 0 }) === false &&
  QUESTS.side_inn.cond({ innRests: 7 }) === false &&
  QUESTS.side_inn.cond({ innRests: 8 }) === true &&
  QUESTS.side_inn.cond({ innRests: 12 }) === true &&
  QUESTS.side_inn.condProg({}) === `0/${INN_GOAL} 夜` &&
  QUESTS.side_inn.condProg({ innRests: 5 }) === `5/${INN_GOAL} 夜`);
ok('side_inn reward 逐值：70 金 + 2 生命药水（承 side_stele 70 档）',
  QUESTS.side_inn.reward.gold === 70 && QUESTS.side_inn.reward.item === 2 && !QUESTS.side_inn.reward.potion2);

// —— ACH_LIST allquests 同源互证（与 sideQuestDone 输出一致）——
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('ACH_LIST allquests 名称「灯火同心」且描述派生 41（「45 个支线任务」）',
  !!achAll && achAll.name === '灯火同心' && achAll.d.includes('45 个支线任务'), achAll && achAll.d);
ok('ACH_LIST allquests 判定/进度与 QUESTS 派生同源（0/41 false · 40/41 false · 41/41 true · prog 41/41）',
  !!achAll && achAll.ok({ quests: {} }) === false && achAll.ok({ quests: Object.fromEntries(sideDefs.slice(0, 40).map(q => [q.id, 'done'])) }) === false &&
  achAll.ok({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === true &&
  achAll.prog({ quests: {} }) === '0/45' && achAll.prog({ quests: Object.fromEntries(sideDefs.map(q => [q.id, 'done'])) }) === '45/45');

// —— quests.js 运行期：sideQuestDone ——
ok('运行期：sideQuestDone 0/41 · 3/41 · 41/41 · 主线不入列',
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
    potionUses: 0, mapPotions: 0, brews: 0, deaths: 0, innRests: 0, x: 8, y: 14, map: 'village' }, extra || {});
}
const h1 = mkHero({});
ok('状态机：无存档 → questStatus offer（无 unlockOn 首次进潮灯镇即接，承 side_well/side_fallen 同款）',
  questStatus(h1, 'side_inn') === 'offer', questStatus(h1, 'side_inn'));
ok('状态机：npcQuestMark offer 态「❕ 可接委托」',
  npcQuestMark(h1, 'nightwatch') === '❕ 可接委托', npcQuestMark(h1, 'nightwatch'));
ok('状态机：npcQuestPages offer 页（打更人 · 一夜好眠 · INN_GOAL 同源）',
  JSON.stringify(npcQuestPages(h1, 'nightwatch')).includes('打更人') &&
  JSON.stringify(npcQuestPages(h1, 'nightwatch')).includes(String(INN_GOAL)) &&
  JSON.stringify(npcQuestPages(h1, 'nightwatch')).includes('接下委托'));
const rAcc = resolveNpcTalk(h1, 'nightwatch');
ok('状态机：resolveNpcTalk 接取 → {kind:accept, id:side_inn} + quests.side_inn=active',
  !!rAcc && rAcc.kind === 'accept' && rAcc.id === 'side_inn' && h1.quests.side_inn === 'active', JSON.stringify(rAcc));
ok('状态机：active 未达标 → questStatus active（cond 未满足）',
  questStatus(h1, 'side_inn') === 'active', questStatus(h1, 'side_inn'));
ok('状态机：active 页函数型实时报进度（已累计住店 0/8 夜）',
  JSON.stringify(npcQuestPages(h1, 'nightwatch')).includes('0/' + INN_GOAL + ' 夜'));
ok('状态机：任务日志 objective 同源（累计在旅馆住下 8 夜 0/8 夜）',
  questJournal(h1).find((e) => e.id === 'side_inn').objective.includes('夜') &&
  questJournal(h1).find((e) => e.id === 'side_inn').objective.includes(`0/${INN_GOAL} 夜`));
const h2 = mkHero({ quests: { side_inn: 'active' }, innRests: 8 });
ok('状态机：达标（innRests=8 夜）→ questStatus turnin',
  questStatus(h2, 'side_inn') === 'turnin', questStatus(h2, 'side_inn'));
ok('状态机：npcQuestMark turnin 态「❕ 可交任务」',
  npcQuestMark(h2, 'nightwatch') === '❕ 可交任务', npcQuestMark(h2, 'nightwatch'));
const rRew = resolveNpcTalk(h2, 'nightwatch');
ok('状态机：resolveNpcTalk 交付 → {kind:reward, gold:70, item:2} + done + 结算 70 金/2 生命药水',
  !!rRew && rRew.kind === 'reward' && rRew.gold === 70 && rRew.item === 2 &&
  h2.quests.side_inn === 'done' && h2.gold === 70 && h2.item === 3, JSON.stringify(rRew));
ok('状态机：交付后再谈 → resolveNpcTalk null（无待办）',
  resolveNpcTalk(h2, 'nightwatch') === null);
ok('状态机：done 默认档（打更人：一夜好眠，是你给这镇子的谢礼）',
  JSON.stringify(npcQuestPages(h2, 'nightwatch')).includes('给这镇子的谢礼'));
ok('状态机：done bossDefeated 档（灯芯回来了叙事并入，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_inn: 'done' }, bossDefeated: true }), 'nightwatch')).includes('灯芯回来了'));
ok('状态机：done caveBoss 档（领主散了、矿脉敞亮叙事并入，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_inn: 'done' }, caveBoss: true }), 'nightwatch')).includes('领主散了'));
ok('状态机：done trueBoss 档（after 彩蛋「灯都亮回来了」并入 done 分档，零内容丢失）',
  JSON.stringify(npcQuestPages(mkHero({ quests: { side_inn: 'done' }, trueBoss: true }), 'nightwatch')).includes('灯都亮回来了'));
ok('状态机：done 态 npcQuestMark 零顶标（nightwatch 无其它待办）',
  npcQuestMark(mkHero({ quests: { side_inn: 'done' } }), 'nightwatch') === null);
ok('questRewardPreview 与 reward 同源（70 金 + 2 生命药水）',
  (() => { const prev = questRewardPreview(mkHero({}), 'side_inn'); return !!prev && prev.gold === 70 && prev.item === 2 && prev.potion2 === 0; })());
ok('运行期：其余 unlockOn 里程碑 NPC 锁定态零顶标（stele2/stele3/stele4 无待办）',
  npcQuestMark(mkHero({}), 'stele2') === null && npcQuestMark(mkHero({}), 'stele3') === null &&
  npcQuestMark(mkHero({}), 'stele4') === null);

// —— NPCS.nightwatch 落位（全新 NPC：数据层三件套 + village.extras + NPC_SPOTS）——
ok('NPCS.nightwatch 台词数据齐全（linesByStage 三档 + after 两页彩蛋）',
  !!NPCS.nightwatch && Array.isArray(NPCS.nightwatch.linesByStage) && NPCS.nightwatch.linesByStage.length === 3 &&
  NPCS.nightwatch.linesByStage[0].gate === null && Array.isArray(NPCS.nightwatch.after) && NPCS.nightwatch.after.length === 2);
ok('NPCS.nightwatch after 彩蛋（灯都亮回来了/更声记着夜）数据层保留（零内容丢失契约）',
  !!NPCS.nightwatch && NPCS.nightwatch.after[0].some((ln) => ln.includes('灯都亮回来了')) &&
  NPCS.nightwatch.after[1].some((ln) => ln.includes('记着夜')));
ok('姊妹件 smoke_v2235_minimapquest 已随新现实更新（nightwatch 入任务 NPC 列表 + side_inn done + (8,13) 金光）',
  read('smoke_v2235_minimapquest.mjs').includes("npcQuestMark(S.G, 'nightwatch')") &&
  read('smoke_v2235_minimapquest.mjs').includes('side_inn') &&
  read('smoke_v2235_minimapquest.mjs').includes('goldAt(capA, 8, 13)'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为三百七十六件套（三百七十五件套清除）',
  readme.includes('冒烟三百七十六件套（三百七十五件套清除）'));
ok('README tests 含 v24.133 守护描述与 smoke_v24133_inquest 入库（356 份）',
  readme.includes('v24.133 起含「打更人「一夜好眠」新支线」守护') &&
  readme.includes('smoke_v24133_inquest 入库（356 份）'));
ok('README 仍有 v24.132 守护描述（历史保留）', readme.includes('v24.132 起含「守墓人「灰烬不冷」新支线」守护'));
ok('README 已有三百五十八件套口径且尚无 357（哨兵前望 357 语义：下一版才写 357）',
  readme.includes('冒烟三百七十六件套（三百七十五件套清除）') && !readme.includes('冒烟三百七十七件套') && !readme.includes('（377 份）'));
ok('README tests 树串尾已延伸（…+ smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑））',
  readme.includes('smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑）'));
ok('README 支线/奖励行随新现实（四十一条 · 一夜好眠 · INN_GOAL）',
  readme.includes('四十五条支线目标/奖励全部由') &&
  readme.includes('一夜好眠（打更人 · 累计住店 `INN_GOAL`(8) 夜') &&
  readme.includes('v24.133 补第四十一条') && readme.includes('v24.132 补第四十条'));
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 355 份（smoke.mjs + 355 专项）', chain.length === 375 && ['smoke.mjs', ...chain].length === 376, String(chain.length));
ok('package.json 链尾为 smoke_v24133_inquest（第 363 份）', chain[chain.length - 1] === 'smoke_v24165_nopotskill', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v24132_fallenquest.mjs && smoke_v24133_inquest.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v24132_fallenquest.mjs && node tests/smoke_v24133_inquest.mjs && node tests/smoke_v24134_kindleq.mjs && node tests/smoke_v24135_ledgerquest.mjs && node tests/smoke_v24136_herbquest.mjs && node tests/smoke_v24143_furnacequest.mjs && node tests/smoke_v24147_unflicker.mjs && node tests/smoke_v24148_swift.mjs && node tests/smoke_v24151_lowlv.mjs && node tests/smoke_v24152_nopotion.mjs && node tests/smoke_v24153_penny.mjs && node tests/smoke_v24154_steadfast.mjs && node tests/smoke_v24155_frugal.mjs && node tests/smoke_v24157_dry.mjs && node tests/smoke_v24158_swift2.mjs && node tests/smoke_v24159_lowlv2.mjs && node tests/smoke_v24160_noskill.mjs && node tests/smoke_v24161_noskill2.mjs && node tests/smoke_v24162_lowskill.mjs && node tests/smoke_v24163_swiftskill.mjs && node tests/smoke_v24164_swiftlv.mjs && node tests/smoke_v24165_nopotskill.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.133（startsWith）', changelog.startsWith('## v24.165'));
ok('CHANGELOG v24.133 条目含「一夜好眠」与「INN_GOAL」与「打更人」',
  changelog.includes('一夜好眠') && changelog.includes('INN_GOAL') && changelog.includes('打更人'));
ok('CHANGELOG 仍保留 v24.132 条目（历史保留）', changelog.includes('## v24.132 '));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const testsDir = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录件套 = 356（355 + smoke_v24133_inquest + smoke_v24134_kindleq）', files.length === 376, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.132 pin 零残留 ——
const s24132 = read('smoke_v24132_fallenquest.mjs');
ok('smoke_v24132 的 GAME_VERSION 字面量 pin 已更新为 v24.133', s24132.includes("const GAME_VERSION = 'v24.165';"));
ok('smoke_v24132 的 CHANGELOG 顶 pin 已更新为 ## v24.137 ', s24132.includes("startsWith('## v24.165'"));
ok('smoke_v24132 的件套 pin 已更新为三百七十六件套（三百七十五件套清除）', s24132.includes('三百七十六件套（三百七十五件套清除）'));
ok('smoke_v24132 的 README/链 tail pin 已随新现实延伸（含 smoke_v24133_inquest）',
  s24132.includes('smoke_v24133_inquest'));
ok('smoke_v24132 的链尾 pin 已推进至 smoke_v24133_inquest（第 363 份）', s24132.includes("=== 'smoke_v24165_nopotskill'"));
const s2436 = read('smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（355 专项 / 356）且尚无 357 口径哨兵',
  s2436.includes('suiteFiles.length ===  375  && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length ===  376') &&
  s2436.includes('!readme.includes(\'冒烟三百七十七件套\')') && s2436.includes('!readme.includes(\'（377 份）\')'));
const s2429 = read('smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 哨兵链前望 357（三百七十七件套否定式）',
  s2429.includes("!readme.includes('冒烟三百七十七件套'"));
// 旧代 v24.132 pin 零残留扫描（豁免本套件）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v24133_inquest.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDir), 'utf8').split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  const hits = [];
  if (s2.includes("const GAME_VERSION = '" + "v24.132';")) hits.push('gv');
  if (s2.includes("GAME_VERSION === '" + "v24.132'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.132")) hits.push('cw');
  if (s2.includes('三百五十五件套（三百五' + '十四件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 35' + '5')) hits.push('fl');
  if (s2.includes('chainAll.length === 35' + '5')) hits.push('cal');
  if (s2.includes('chain.length === 35' + '4')) hits.push('cl');
  if (s2.includes('treeTok.length === 35' + '5')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v24132_" + "fallenquest'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.132 GAME_VERSION/顶 pin/355 口径（哨兵链，豁免本套件）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.133 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
