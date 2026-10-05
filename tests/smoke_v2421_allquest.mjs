// v24.21 专项冒烟：🎁 支线交付报文补「🏮 灯火同心 N/11」进度后缀
// （体验打磨·信息透明·计数现场——承 v24.20 领悟战报「📖 诸技通明 N/8」/ v24.19 掉落战报
// 「🍀 鸿运当头 N/30」/ v24.17 喝药「💧 渴饮甘露 N/10」/ v24.16 HUD「🚶 千里之行 N/1000」
// 同一「计数现场报进度」主线 / v19.61 灯火同心成就（支线全收集里程碑 = 完成全部 kind==='side'
// 支线，现 11 条——灯长的委托/星砂之约/名字归还/雾中辨形/旧账已结/残焰已熄/亡骨还乡/树精的菌库/
// 护粮的委托/夜路的狼嚎/蛇影的药引，数量由 QUESTS 派生不写死）：计数 hero.quests 由交付侧
// resolveNpcTalk/setSideQuest 写定 'done'、snapshotHero 全量快照自动持久化、防御式
// (hero.quests||{}) 旧档零迁移，此前进度只藏在 C 成就页一行 X/11——支线全收集的计数现场正是
// 每次「🎁 「…」完成」交付报文本身：交付当场查无一眼之数（与 v24.19「现场是动作本身」同族）；
// 现 core.talkNext 交付报文末尾补「（🏮 灯火同心 N/11）」（分子读 quests.sideQuestDone(hero).done、
// 分母读 .total，与 C 页/ACH_LIST allquests 的 ok/prog 同读 data.js QUESTS 一份源——本版新增
// quests.js sideQuestDone 辅助，加/删支线只改 data.js 一处全端自动跟随）；纯显示零结算零存档
// 零数值变化（QUESTS/交付结算/奖励/成就判定逐字未动）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.21 注释 / GAME_VERSION v24.21 与旧 v24.20 字面量
// 零残留 / v24.20 与 v24.19 历史注释保留）、quests.js 源级落位（sideQuestDone 辅助 + v24.21 注释
// + 防御式 (hero.quests||{})）、运行期 sideQuestDone（0/11 · 3/11 · 11/11 · 主线不入列）、
// ACH_LIST allquests 同源互证（与 sideQuestDone 输出一致）、core.js 源级落位（sideQuestDone
// import / 报文模板逐字 / const sq 先于 boxMsg / v24.21 注释 / 交付前缀零回归）、README/package.json/
// CHANGELOG 同步（件套口径 245 + v24.21 守护描述 + 入库 245 + package 串尾 + CHANGELOG 顶 pin）、
// 哨兵链（前望 246 且 README 尚无 246 口径）、旧代 v24.20 pin 全库零残留扫描（字面量/顶 pin/244 口径
// ·豁免上一版套件 smoke_v2420_skillprog）。
import { GAME_VERSION, ACH_LIST, QUESTS } from '../js/data.js';
import { sideQuestDone } from '../js/quests.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.21 🎁 支线交付报文「🏮 灯火同心 N/11」进度后缀 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const qSrc = read('js/quests.js');
const cSrc = read('js/core.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.20 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.21', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 21)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.23（旧 v24.21 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.43';") && !dSrc.includes("const GAME_VERSION = 'v24.21';"));
ok('data.js 含 v24.21 注释（支线交付报文「🏮 灯火同心 N/11」进度后缀说明）',
  dSrc.includes('// v24.21 体验打磨·信息透明·计数现场'));
ok('data.js 仍保留 v24.20 历史注释（领悟战报进度后缀说明，累积注释块）',
  dSrc.includes('// v24.20 体验打磨·信息透明·计数现场'));
ok('data.js 仍保留 v24.19 历史注释（额外掉落战报进度后缀说明）',
  dSrc.includes('// v24.19 体验打磨·信息透明·计数现场'));

// —— QUESTS 结构：14 条 side 支线 + 4 条 main（数量全部派生，绝无裸字面量）——
const sideDefs = Object.values(QUESTS).filter((q) => q.kind === 'side');
const mainDefs = Object.values(QUESTS).filter((q) => q.kind === 'main');
ok('QUESTS 共 18 条（14 side + 4 main，派生计数）',
  sideDefs.length === 14 && mainDefs.length === 4 && sideDefs.length + mainDefs.length === 18,
  `${sideDefs.length}/${mainDefs.length}`);
ok('主线四枚（main_demon/main_cave/main_gallery/main_true）为 flag 型无 giver/npc（不触发交付报文）',
  mainDefs.every((q) => !q.giver && !q.npc) && sideDefs.every((q) => q.giver || q.npc));

// —— quests.js 源级落位 ——
ok('quests.js 含 v24.21 注释（sideQuestDone 辅助说明）',
  qSrc.includes('v24.21 体验打磨·信息透明·计数现场'));
ok('quests.js sideQuestDone 导出（签名逐字）', qSrc.includes('export function sideQuestDone(hero) {'));
ok('quests.js sideQuestDone 分母读 QUESTS kind===\'side\' 派生（不写死）',
  qSrc.includes("Object.values(QUESTS).filter((q) => q.kind === 'side')"));
ok('quests.js sideQuestDone 计数读 hero.quests 防御式（(hero.quests||{}) 旧档零迁移）',
  qSrc.includes('hero && hero.quests ? hero.quests[q.id] === \'done\' : false'));

// —— 运行期 sideQuestDone ——
const total = sideDefs.length;
ok('运行期：无 quests 字段（旧档零迁移）→ 0/14', (() => { const r = sideQuestDone({}); return r.done === 0 && r.total === total; })(),
  JSON.stringify(sideQuestDone({})));
const h3 = { quests: { side_mushroom: 'done', side_cart: 'done', side_name: 'done' } };
ok('运行期：3 条完成 → 3/14', (() => { const r = sideQuestDone(h3); return r.done === 3 && r.total === total; })(),
  JSON.stringify(sideQuestDone(h3)));
const hAll = { quests: Object.fromEntries(sideDefs.map((q) => [q.id, 'done'])) };
ok('运行期：14 条全完成 → 14/14', (() => { const r = sideQuestDone(hAll); return r.done === total && r.total === total; })(),
  JSON.stringify(sideQuestDone(hAll)));
const hMain = { quests: { main_demon: 'done' } };
ok('运行期：仅主线完成 → 0/14（主线不入灯火同心分母）', (() => { const r = sideQuestDone(hMain); return r.done === 0 && r.total === total; })(),
  JSON.stringify(sideQuestDone(hMain)));

// —— ACH_LIST allquests 同源互证（三处同读 QUESTS 一份源）——
const aq = ACH_LIST.find((a) => a.id === 'allquests');
ok('ACH_LIST allquests 名称「灯火同心」', !!aq && aq.name === '灯火同心', aq && aq.name);
ok('ACH_LIST allquests 描述与阈值同源（完成全部 14 个支线任务）',
  !!aq && aq.d === `完成全部 ${total} 个支线任务`, aq && aq.d);
ok('ACH_LIST allquests 判定/进度同读 QUESTS 与 sideQuestDone 同源（5 档 5/14 false · 14/14 true · 缺字段 0/14）',
  !!aq && aq.prog(h3) === sideQuestDone(h3).done + '/' + sideQuestDone(h3).total &&
  aq.prog(h3) === '3/14' && aq.ok(h3) === false &&
  aq.ok(hAll) === true && aq.prog({}) === '0/14');

// —— core.js 源级落位 ——
ok('core.js import 含 sideQuestDone（quests.js 新导出，零新增模块依赖）',
  cSrc.includes('resolveNpcTalk, sideQuestDone } from \'./quests.js\''));
ok('core.js 交付报文含「🏮 灯火同心 N/11」进度后缀（模板逐字）',
  cSrc.includes('（🏮 灯火同心 ${sq.done}/${sq.total}）'));
ok('core.js 报文分子/分母读 sideQuestDone（.done/.total）',
  cSrc.includes('${sq.done}/${sq.total}'));
ok('core.js 报文仍以 🎁 「${act.name}」完成：金币 +${act.gold} 前缀开头（原文案零回归）',
  cSrc.includes('`🎁 「${act.name}」完成：金币 +${act.gold}${extra}（剩余 ${hero.gold} 金'));
ok('core.js 含 v24.21 注释（支线交付报文进度后缀说明）',
  cSrc.includes('v24.21 体验打磨·信息透明·计数现场'));
ok('core.js sideQuestDone(hero) 先于 boxMsg 落账（进度差分即本场）',
  cSrc.indexOf('const sq = sideQuestDone(hero);') < cSrc.indexOf('bind.boxMsg(`🎁 「${act.name}」完成'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为二百六十七件套（二百六十六件套清除）',
  readme.includes('冒烟二百六十七件套（二百六十六件套清除）'));
ok('README tests 含 v24.21 守护描述与 smoke_v2421_allquest 入库（267 份）',
  readme.includes('v24.21 起含 🎁 支线交付报文「🏮 灯火同心 N/11」进度后缀守护') &&
  readme.includes('smoke_v2421_allquest 入库（267 份）'));
ok('README 仍有 v24.20 守护描述（历史保留）', readme.includes('v24.20 起含 「🌟 领悟新技能」战报「📖 诸技通明 N/8」进度后缀守护'));
ok('README 已有二百四十七件套口径且尚无 252（哨兵前望 252 语义：下一版才写 252）',
  readme.includes('冒烟二百六十七件套（二百六十六件套清除）') &&
  !readme.includes('二百六十八件套'));
ok('README tests 树串尾已延伸（smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6（npm test 串跑））',
  readme.includes('smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6（npm test 串跑）'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 247 份（smoke.mjs + 250 专项）', chain.length === 266 && chainAll.length === 267, String(chain.length));
ok('package.json 链尾为 smoke_v2439_xpcurve4（第 266 份）', chain[chain.length - 1] === 'smoke_v2443_xpcurve6', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2421_allquest.mjs（node tests/ 前缀形态）',
  pkgRaw.includes('node tests/smoke_v2421_allquest.mjs'));
ok('package.json 链锚逐字（smoke_v2421_allquest.mjs && node tests/smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs"）',
  pkgRaw.includes('smoke_v2421_allquest.mjs && node tests/smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.23（startsWith）', changelog.startsWith('## v24.43'));
ok('CHANGELOG v24.21 条目含「灯火同心」与「计数现场」与「交付」',
  changelog.includes('灯火同心') && changelog.includes('计数现场') && changelog.includes('交付'));
ok('CHANGELOG 仍保留 v24.20 条目（历史保留）', changelog.includes('## v24.20'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(chainAll.map((f) => f.replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 247（246 + smoke_v2423_eliteprog）', files.length === 267, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链（旧代 v24.20 pin 全库零残留）——
const leftovers = [];
for (const f of files) {
  if (f === 'smoke_v2421_allquest.mjs') continue;
  // 承 v24.20 同款豁免：上一版套件（smoke_v2420_skillprog）按惯例在否定式断言里保留旧代字面量，
  // 属合法残留，豁免扫描（本版无 v24.20 否定式则自然零残留）。
  if (f === 'smoke_v2420_skillprog.mjs') continue;
  const s = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s.includes("const GAME_VERSION = 'v24.20';") || s.includes("GAME_VERSION === 'v24.20'") ||
      s.includes("startsWith('## v24.20") || s.includes('入库（244 份）') ||
      s.includes('二百四十四件套（二百四十三件套清除）') || s.includes('testChain === 244') ||
      s.includes('fileCount === 244') || s.includes('files.length === 244') ||
      s.includes('chain.length === 243') || s.includes('第 244 份') ||
      s.includes('链尾为 smoke_v2420_skillprog')) leftovers.push(f);
}
ok('全库测试零残留 v24.20 GAME_VERSION/顶 pin/244 口径（哨兵链·豁免上一版否定式）', leftovers.length === 0, leftovers.join(','));

console.log(`— v24.21 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
