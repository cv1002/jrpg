// v24.20 专项冒烟：🌟 领悟新技能战报补「📖 诸技通明 N/8」进度后缀
// （体验打磨·信息透明·计数现场——承 v24.19 掉落战报「🍀 鸿运当头 N/30」/ v24.17 喝药战报
// 「💧 渴饮甘露 N/10」/ v24.16 HUD「🚶 千里之行 N/1000」/ v24.12 胜利画面「⚔️ 身经百战 N/100」
// 同一「计数现场报进度」主线 / v21.59 诸技通明成就（技能全领悟里程碑 = 累计领悟全部 8 招）：
// 计数 hero.skills 由 hero.checkSkills 升级领悟唯一写入点 push、snapshotHero 全量快照自动持久化、
// 防御式 (hero.skills||[]) 旧档零迁移，此前进度只藏在 C 成就页一行 X/8——技能领悟线的计数现场
// 正是每次「🌟 领悟了新技能」战报本身：升级领悟当场查无一眼之数（领悟是低频事件（整局至多 8 次）、
// 不像 v23.64 熟能生巧每发一报需零战报后缀的取舍，与 v24.19「现场是动作本身」同族）；现
// hero.checkSkills 领悟报文末尾补「（📖 诸技通明 N/8）」（分子读 (hero.skills||[]).length 防御式
// 旧档零迁移、分母读 data.js Object.keys(LEARN_AT).length 单一数据源——本版 LEARN_AT 由模块内常量
// 改为导出，与 I 状态页「已学技能 N/8」/战斗技能菜单「已学 N/7」/ACH_LIST skills 的 ok/prog
// 同读一份源，调技能表只改 data.js 一处全端自动跟随），纯显示零结算零存档零数值变化（LEARN_AT 表/
// checkSkills 领悟拦截/skills push/经验结算/成就判定逐字未动）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.20 注释 / GAME_VERSION v24.20 与旧 v24.19 字面量
// 零残留 / v24.19 与 v24.18 历史注释保留 / LEARN_AT 导出）、LEARN_AT 八招全表（learnsAt 扫描
// 1..MAX_LEARN_LV 同源互证）、ACH_LIST skills 同源互证、hero.js 源级落位（LEARN_AT import /
// 报文模板逐字 / v24.20 注释）、运行期 checkSkills（捕获桩：Lv3 领悟冰霜击报文含「（📖 诸技通明
// 2/8）」+ push 结算零回归（防重：已会不多报）、Lv2 无新技零报文零后缀）、README/package.json/
// CHANGELOG 同步（件套口径 244 + v24.20 守护描述 + 入库 244 + package 串尾 + CHANGELOG 顶 pin）、
// 哨兵链（前望 252 且 README 尚无 252 口径）、旧代 v24.19 pin 全库零残留扫描（字面量/顶 pin/243 口径
// ·豁免上一版套件 smoke_v2419_luckdrp）。
import { GAME_VERSION, LEARN_AT, ACH_LIST, MAX_LEARN_LV, learnsAt } from '../js/data.js';
import { checkSkills } from '../js/hero.js';
import { bind } from '../js/bind.js';
import { S } from '../js/state.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.20 🌟 领悟新技能战报「📖 诸技通明 N/8」进度后缀 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const hSrc = read('js/hero.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.19 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.19', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 19)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.21（旧 v24.19 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.58';") && !dSrc.includes("const GAME_VERSION = 'v24.19';"));
ok('data.js 含 v24.20 注释（领悟战报「📖 诸技通明 N/8」进度后缀说明）',
  dSrc.includes('// v24.20 体验打磨·信息透明·计数现场'));
ok('data.js 仍保留 v24.19 历史注释（额外掉落战报进度后缀说明，累积注释块）',
  dSrc.includes('// v24.19 体验打磨·信息透明·计数现场'));
ok('data.js 仍保留 v24.18 历史注释（后期金币曲线续平滑说明）',
  dSrc.includes('// v24.18 数值平衡·后期金币曲线续平滑'));
ok('data.js export 块含 LEARN_AT（本版由模块内常量改为导出，与 ACH_LIST 同读一份源）',
  dSrc.includes('baseStats, learnsAt, LEARN_AT, MAX_LEARN_LV'));

// —— LEARN_AT 结构化：八招全表（与 learnsAt 扫描 1..MAX_LEARN_LV 同源互证）——
const lvKeys = Object.keys(LEARN_AT).map(Number).sort((a, b) => a - b);
ok('LEARN_AT 共 8 招（Lv1/3/4/5/7/9/11/12 八档）', lvKeys.length === 8 && lvKeys.join(',') === '1,3,4,5,7,9,11,12', lvKeys.join(','));
const scanned = [];
for (let lv = 1; lv <= MAX_LEARN_LV; lv++) { const s = learnsAt(lv); if (s) scanned.push([lv, s]); }
ok('learnsAt 扫描 1..MAX_LEARN_LV 收集 == LEARN_AT 全表（同源互证）',
  scanned.length === lvKeys.length && scanned.every(([lv, nm]) => LEARN_AT[lv] === nm));
ok('Lv2 无新技（learnsAt(2) 返回 null）', learnsAt(2) === null);

// —— ACH_LIST skills 同源互证（三处同读 LEARN_AT 一份源）——
const sk = ACH_LIST.find((a) => a.id === 'skills');
ok('ACH_LIST skills 名称「诸技通明」', !!sk && sk.name === '诸技通明', sk && sk.name);
ok('ACH_LIST skills 描述与阈值同源（领悟全部 8 个技能）',
  !!sk && sk.d === `领悟全部 ${Object.keys(LEARN_AT).length} 个技能`, sk && sk.d);
ok('ACH_LIST skills 判定/进度同读 skills 数组与 LEARN_AT（6 招 6/8 false · 8 招 8/8 true · 缺字段 0/8）',
  !!sk && sk.ok({ skills: Object.values(LEARN_AT).slice(0, 6) }) === false &&
  sk.ok({ skills: Object.values(LEARN_AT) }) === true &&
  sk.prog({ skills: Object.values(LEARN_AT).slice(0, 5) }) === `5/${Object.keys(LEARN_AT).length}` &&
  sk.prog({}) === `0/${Object.keys(LEARN_AT).length}`);

// —— hero.js 源级落位 ——
ok('hero.js import 含 LEARN_AT（data.js 新导出，零新增模块依赖）',
  hSrc.includes('learnsAt, ACH_LIST, LEARN_AT, WEAPONS'));
ok('hero.js 领悟报文含「📖 诸技通明 N/8」进度后缀（模板逐字）',
  hSrc.includes('（📖 诸技通明 ${(hero.skills || []).length}/${Object.keys(LEARN_AT).length}）'));
ok('hero.js 报文分子读 (hero.skills||[]).length 防御式', hSrc.includes('${(hero.skills || []).length}'));
ok('hero.js 报文仍以 🌟 领悟了新技能 前缀开头（原文案零回归）',
  hSrc.includes('`🌟 领悟了新技能【${skill}】！${sd ? `（${sd.mp} MP · ${sd.hint} · 战斗中按 2 选用）` : \'\'}'));
ok('hero.js 含 v24.20 注释（领悟战报进度后缀说明）',
  hSrc.includes('v24.20 体验打磨·信息透明·计数现场'));
ok('hero.js 领悟拦截逐字零回归（扣留式 includes 拦截与 push 前后序未动）',
  hSrc.indexOf('if (skill && !hero.skills.includes(skill))') < hSrc.indexOf('hero.skills.push(skill)'));

// —— 运行期：受控 checkSkills 真实调用 + bind.boxMsg 捕获（承 v21.61 捕获桩法）——
function runLearn(hero) {
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    S.G = hero;
    checkSkills();
    return msgs;
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}
// Lv3 领悟冰霜击：已有起始 1 招 → 报文「（📖 诸技通明 2/8）」
const hA = { level: 3, skills: ['火焰斩'] };
const mA = runLearn(hA);
ok('运行期：Lv3 领悟冰霜击报文逐字（SKILL_DATA mp/hint 同源派生 + 诸技通明 2/8 后缀）',
  mA.includes('🌟 领悟了新技能【冰霜击】！（5 MP · 30%冻结（跳过敌回合） · 战斗中按 2 选用）（📖 诸技通明 2/8）'),
  mA.join(' | '));
ok('运行期：领悟结算零回归（skills 追加冰霜击且总数为 2）',
  hA.skills.length === 2 && hA.skills[1] === '冰霜击', JSON.stringify(hA.skills));
// 已会不多报（includes 拦截）：Lv3 但已含冰霜击 → 零报文、skills 长度不变
const hB = { level: 3, skills: ['火焰斩', '冰霜击'] };
const mB = runLearn(hB);
ok('运行期：重复领悟零报文零后缀零重计（includes 拦截）',
  mB.length === 0 && hB.skills.length === 2, mB.join(' | '));
// Lv2 无新技：learnsAt(2) null → 零报文
const hC = { level: 2, skills: ['火焰斩'] };
const mC = runLearn(hC);
ok('运行期：无新技等级（Lv2）checkSkills 不报', mC.length === 0, mC.join(' | '));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为二百八十二件套（二百八十一件套清除）',
  readme.includes('冒烟二百八十二件套（二百八十一件套清除）'));
ok('README tests 含 v24.20 守护描述与 smoke_v2420_skillprog 入库（282 份）',
  readme.includes('v24.20 起含 「🌟 领悟新技能」战报「📖 诸技通明 N/8」进度后缀守护') &&
  readme.includes('smoke_v2420_skillprog 入库（282 份）'));
ok('README 仍有 v24.19 守护描述（历史保留）', readme.includes('v24.19 起含 「🎁 额外掉落」战报「🍀 鸿运当头 N/30」进度后缀守护'));
ok('README 已有二百四十五件套口径且尚无 252（哨兵前望 252 语义：下一版才写 246）',
  readme.includes('冒烟二百八十二件套（二百八十一件套清除）') &&
  !readme.includes('二百八十三件套'));
ok('README tests 树串尾已延伸（smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp（npm test 串跑））',
  readme.includes('smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp（npm test 串跑）'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 247 份（smoke.mjs + 250 专项）', chain.length === 281 && chainAll.length === 282, String(chain.length));
ok('package.json 链尾为 smoke_v2439_xpcurve4（第 273 份）', chain[chain.length - 1] === 'smoke_v2458_pondlamp', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2420_skillprog.mjs（node tests/ 前缀形态）',
  pkgRaw.includes('node tests/smoke_v2420_skillprog.mjs'));
ok('package.json 链锚逐字（smoke_v2420_skillprog.mjs && node tests/smoke_v2421_allquest.mjs && node tests/smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs"）',
  pkgRaw.includes('smoke_v2420_skillprog.mjs && node tests/smoke_v2421_allquest.mjs && node tests/smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.21（startsWith）', changelog.startsWith('## v24.58'));
ok('CHANGELOG v24.20 条目含「诸技通明」与「计数现场」与「领悟」',
  changelog.includes('诸技通明') && changelog.includes('计数现场') && changelog.includes('领悟'));
ok('CHANGELOG 仍保留 v24.19 条目（历史保留）', changelog.includes('## v24.19'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(chainAll.map((f) => f.replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 244（244 + smoke_v2421_allquest）', files.length === 282, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链（旧代 v24.19 pin 全库零残留）——
const leftovers = [];
for (const f of files) {
  if (f === 'smoke_v2420_skillprog.mjs') continue;
  // 承 v24.19 同款豁免：上一版套件（smoke_v2419_luckdrp）按惯例在否定式断言里保留旧代字面量，
  // 属合法残留，豁免扫描（本版无 v24.19 否定式则自然零残留）。
  if (f === 'smoke_v2419_luckdrp.mjs') continue;
  const s = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s.includes("const GAME_VERSION = 'v24.19';") || s.includes("GAME_VERSION === 'v24.19'") ||
      s.includes("startsWith('## v24.19") || s.includes('入库（243 份）') ||
      s.includes('二百四十三件套（二百四十二件套清除）') || s.includes('testChain === 243') ||
      s.includes('fileCount === 243') || s.includes('files.length === 243') ||
      s.includes('chain.length === 242')) leftovers.push(f);
}
ok('全库测试零残留 v24.19 GAME_VERSION/顶 pin/243 口径（哨兵链·豁免上一版否定式）', leftovers.length === 0, leftovers.join(','));

console.log(`— v24.20 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
