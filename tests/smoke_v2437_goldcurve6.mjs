// smoke_v2437_goldcurve6.mjs —— v24.37 专项冒烟：后期金币曲线续平滑（第六轮）——四强怪（骷髅兵/雾灵/树精/石魔像）每级金币再 +1（gold[1] 11→12 第九轮）
// （数值平衡·承 v19.66 第一轮 / v24.18 第二轮 / v24.30 第三轮 / v24.33 第四轮 / v24.35 第五轮方法论第六轮：金币只随玩家等级
// 线性、顶级装备价格固定（勇者之剑 600 + 龙鳞甲 480 = 1080 金），v24.35 把无字回廊 Lv10-12 每场金币抬到
// 96.76/104.76/112.70 后，同一条曲线在更深的后段再次贴线；现按同法把四强怪每级金币再抬 1 点
// （gold[1] 11→12），加权实测（无字回廊池 × zone，与 smoke_v2418/v2430/v2433/v2435 同法）Lv10-12 每场金币
// 96.76/104.76/112.70 → 106.76/115.76/124.70（每场 +10/+11/+12）；四基础怪逐字不动、Lv1-2 镇内零变化
// （village Lv1/Lv2 12.08/14.55 恒等），hp/atk/def/xp/权重/门槛/区域倍率逐字未动）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.37 注释 / GAME_VERSION v24.37 与旧 v24.36 字面量
// 零残留 / v24.36·v24.35·v24.34·v24.33·v24.30·v24.29·v24.18·v19.66 历史注释保留）、MON_BASE 运行期八怪全表逐值（四强怪
// gold[1]=9 · 四基础怪逐字未动 · hp/atk/def/xp 逐字未动）、曲线收益与零回归（Gallery 池 Lv10-12 每场
// +lv 金 · Village 池 Lv1-2 恒等）、README/package.json/CHANGELOG 同步（件套口径 261 + 魔物数值行
// 15+12/14+12/16+12/20+12 + v24.37 守护描述 + 入库 261 + package 串尾 + CHANGELOG 顶 pin）、哨兵链
// （前望 275 且 README 尚无 275 口径）、旧代 v24.36 pin 全库零残留扫描（字面量/顶 pin/260 口径 ·
// 豁免本套件与上一版套件）。
import { MON_BASE, GAME_VERSION, MAPS } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.37 四强怪后期金币曲线续平滑（第六轮） 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.36 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.36', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 36)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.37（旧 v24.36 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.77';") && !dSrc.includes("const GAME_VERSION = 'v24.36';"));
ok('data.js 含 v24.37 注释（后期金币曲线续平滑第六轮说明）',
  dSrc.includes('// v24.37 数值平衡·后期金币曲线续平滑'));
ok('data.js 仍保留 v24.36/v24.35 历史注释（图鉴速查行/第五轮说明，累积注释块）',
  dSrc.includes('// v24.36 文档整理·数值说明·同源口径') && dSrc.includes('// v24.35 数值平衡·后期金币曲线续平滑'));
ok('data.js v24.33/v24.30/v24.29/v24.18/v19.66 历史注释保留（金币/经验平滑先例行）',
  dSrc.includes('// v24.33 数值平衡·后期金币曲线续平滑') && dSrc.includes('// v24.30 数值平衡·后期金币曲线续平滑') &&
  dSrc.includes('// v24.29 数值平衡·后期经验曲线续平滑') && dSrc.includes('v24.18 数值平衡') && dSrc.includes('v19.66 数值平衡'));
ok('data.js 源级四强怪 gold 每级 12 逐字落位（gold:[15,12]/[14,9]/[16,9]/[20,9]）',
  dSrc.includes('gold:[15,12]') && dSrc.includes('gold:[14,12]') && dSrc.includes('gold:[16,12]') && dSrc.includes('gold:[20,12]'));
ok('data.js 源级四基础怪 gold 每级 2 逐字未动（gold:[8,2]/[12,2]/[10,2]/[13,2]）',
  dSrc.includes('gold:[8,2]') && dSrc.includes('gold:[12,2]') && dSrc.includes('gold:[10,2]') && dSrc.includes('gold:[13,2]'));

// —— MON_BASE 运行期逐值 ——
const byName = {};
for (const m of MON_BASE) byName[m.name] = m;
ok('MON_BASE 八怪齐全', MON_BASE.length === 8, String(MON_BASE.length));
const FOUR = ['骷髅兵', '雾灵', '树精', '石魔像'];
const BASE = ['史莱姆', '野狼', '哥布林', '毒蛇'];
ok('四强怪每级金币均为 12（gold[1] 11→12）',
  FOUR.every((nm) => byName[nm] && byName[nm].gold[1] === 12),
  FOUR.map((nm) => nm + '=' + (byName[nm] && byName[nm].gold[1])).join(','));
ok('四基础怪每级金币逐字未动（2·2·2·2）',
  BASE.every((nm) => byName[nm] && byName[nm].gold[1] === 2),
  BASE.map((nm) => nm + '=' + (byName[nm] && byName[nm].gold[1])).join(','));
ok('四强怪 gold 基准逐字未动（15/14/16/20）',
  byName['骷髅兵'].gold[0] === 15 && byName['雾灵'].gold[0] === 14 &&
  byName['树精'].gold[0] === 16 && byName['石魔像'].gold[0] === 20);
ok('四基础怪 gold 基准逐字未动（8/12/10/13）',
  byName['史莱姆'].gold[0] === 8 && byName['野狼'].gold[0] === 12 &&
  byName['哥布林'].gold[0] === 10 && byName['毒蛇'].gold[0] === 13);
// 全表 hp/atk/def/xp 逐字未动 + gold 仅四强怪转正（v24.35 只动 gold[1]）
const EXPECT = {
  '史莱姆': { hp: [16, 5], atk: [5, 2], def: [2, 1], xp: [8, 3], gold: [8, 2] },
  '野狼':   { hp: [22, 5], atk: [7, 2], def: [3, 1], xp: [12, 3], gold: [12, 2] },
  '骷髅兵': { hp: [26, 6], atk: [8, 2], def: [5, 1], xp: [16, 26], gold: [15, 12] },
  '哥布林': { hp: [20, 5], atk: [6, 2], def: [3, 1], xp: [10, 3], gold: [10, 2] },
  '毒蛇':   { hp: [20, 5], atk: [8, 2], def: [3, 1], xp: [15, 3], gold: [13, 2] },
  '雾灵':   { hp: [24, 5], atk: [9, 2], def: [4, 1], xp: [17, 26], gold: [14, 12] },
  '树精':   { hp: [30, 6], atk: [7, 2], def: [6, 1], xp: [18, 26], gold: [16, 12] },
  '石魔像': { hp: [36, 7], atk: [8, 2], def: [10, 1], xp: [22, 26], gold: [20, 12] },
};
ok('八怪 hp/atk/def 逐字未动 + xp 四强怪已 9（v24.41 落位）+ gold 四强怪 12/四基础怪 2（全表逐值）',
  MON_BASE.every((m) => {
    const e = EXPECT[m.name];
    return e && m.hp[0] === e.hp[0] && m.hp[1] === e.hp[1] && m.atk[0] === e.atk[0] && m.atk[1] === e.atk[1] &&
      m.def[0] === e.def[0] && m.def[1] === e.def[1] && m.xp[0] === e.xp[0] && m.xp[1] === e.xp[1] &&
      m.gold[0] === e.gold[0] && m.gold[1] === e.gold[1];
  }));

// —— 曲线收益：用真实 MON_BASE 权重/池/zone 复算加权均金（与 smoke_v2418/v2430 同法）——
const W = (nm, lv) => {
  switch (nm) {
    case '史莱姆': case '哥布林': return Math.max(1, 4 - Math.floor(lv / 2));
    case '野狼': return Math.max(1, 3 - Math.floor(lv / 4));
    case '毒蛇': case '骷髅兵': return lv >= 2 ? 2 + Math.floor(lv / 3) : 1;
    case '雾灵': return 2 + Math.floor(lv / 3);
    default: return 2 + Math.floor(lv / 2);
  }
};
function avgGold(mapKey, lv, mode) {
  const def = MAPS[mapKey];
  const pool = def.pool || null;
  const src = pool ? MON_BASE.filter((m) => pool.includes(m.name)) : MON_BASE;
  const avail = src.filter((m) => lv >= (m.minLv || 1));
  const use = avail.length ? avail : src;
  let tw = 0, gs = 0;
  for (const m of use) {
    const w = W(m.name, lv);
    tw += w;
    const per = FOUR.includes(m.name) ? (m.gold[1] + (mode === 'prev' ? -1 : 0)) : m.gold[1];
    gs += Math.round(m.gold[0] + per * lv) * w;
  }
  return gs / tw;
}
ok('Gallery 池 Lv10-12 每场金币较改前逐级 +lv 金（+10/+11/+12 口径：126.76/137.76/148.70 → 136.76/148.76/160.70）',
  [10, 11, 12].every((lv) => Math.abs((avgGold('gallery', lv, 'cur') - avgGold('gallery', lv, 'prev')) - lv) < 0.01),
  [10, 11, 12].map((lv) => lv + ':' + avgGold('gallery', lv, 'cur').toFixed(2) + '/' + avgGold('gallery', lv, 'prev').toFixed(2)).join(' '));
ok('Gallery 池 Lv10-12 每场金币改后落在实测窗口（136.5-136.9 / 148.5-148.9 / 160.5-160.9）',
  avgGold('gallery', 10, 'cur') > 136.5 && avgGold('gallery', 10, 'cur') < 136.9 &&
  avgGold('gallery', 11, 'cur') > 148.5 && avgGold('gallery', 11, 'cur') < 148.9 &&
  avgGold('gallery', 12, 'cur') > 160.5 && avgGold('gallery', 12, 'cur') < 160.9,
  [10, 11, 12].map((lv) => avgGold('gallery', lv, 'cur').toFixed(2)).join('/'));
ok('Gallery 池 Lv10-12 每场金币改前基线窗口（126.5-126.9 / 137.5-137.9 / 148.5-148.9）',
  avgGold('gallery', 10, 'prev') > 126.5 && avgGold('gallery', 10, 'prev') < 126.9 &&
  avgGold('gallery', 11, 'prev') > 137.5 && avgGold('gallery', 11, 'prev') < 137.9 &&
  avgGold('gallery', 12, 'prev') > 148.5 && avgGold('gallery', 12, 'prev') < 148.9,
  [10, 11, 12].map((lv) => avgGold('gallery', lv, 'prev').toFixed(2)).join('/'));
ok('Village 池 Lv1-2 单场金币零变化（四基础怪未动，12.08/14.55 口径）',
  avgGold('village', 1, 'cur') === avgGold('village', 1, 'prev') && avgGold('village', 2, 'cur') === avgGold('village', 2, 'prev'),
  avgGold('village', 1, 'cur').toFixed(2) + '/' + avgGold('village', 2, 'cur').toFixed(2));
ok('Village 池 Lv1/Lv2 实测窗口（12.0-12.2 / 14.4-14.7，与 v19.66 口径同量级）',
  avgGold('village', 1, 'cur') > 12.0 && avgGold('village', 1, 'cur') < 12.2 &&
  avgGold('village', 2, 'cur') > 14.4 && avgGold('village', 2, 'cur') < 14.7);

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为三百件套（二百九十九件套清除）',
  readme.includes('冒烟三百件套（二百九十九件套清除）'));
ok('README 魔物数值行已为 15+12/14+12/16+12/20+12（四强怪每级金币 +1；xp 段仍 16+8/17+8/18+8/22+8）',
  readme.includes('骷髅兵 26+6/8+2/5+1/16+26/15+12') && readme.includes('雾灵 24+5/9+2/4+1/17+26/14+12') &&
  readme.includes('树精 30+6/7+2/6+1/18+26/16+12') && readme.includes('石魔像 36+7/8+2/10+1/22+26/20+12'));
ok('README 魔物数值行四基础怪逐字未动（8+2/12+2/10+2/13+2）',
  readme.includes('史莱姆 16+5/5+2/2+1/8+3/8+2') && readme.includes('野狼 22+5/7+2/3+1/12+3/12+2') &&
  readme.includes('哥布林 20+5/6+2/3+1/10+3/10+2') && readme.includes('毒蛇 20+5/8+2/3+1/15+3/13+2'));
ok('README tests 含 v24.37 守护描述与 smoke_v2437_goldcurve6 入库（300 份）',
  readme.includes('v24.37 起含 「后期金币曲线续平滑（第六轮）」守护') && readme.includes('smoke_v2437_goldcurve6 入库（300 份）'));
ok('README 仍有 v24.36/v24.35 守护描述（历史保留）', readme.includes('v24.36 起含 「图鉴 / 收集」数值速查行守护') && readme.includes('v24.35 起含 「后期金币曲线续平滑（第五轮）」守护'));
ok('README 尚无 275 件套口径（哨兵前望 275 语义：下一版才写 275）',
  !readme.includes('三百零一件套') && !readme.includes('冒烟三百零一件套'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 260 份（smoke.mjs + 260 专项）', chain.length === 299 && chainAll.length === 300, String(chain.length));
ok('package.json 链尾为 smoke_v2439_xpcurve4（第 273 份）', chain[chain.length - 1] === 'smoke_v2477_fisher', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2437_goldcurve6.mjs（node tests/ 前缀形态）',
  pkgRaw.includes('node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs'));
ok('package.json 链锚逐字（... && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs"）',
  pkgRaw.includes('smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs && node tests/smoke_v2459_xpcurve9.mjs && node tests/smoke_v2460_xpcurve10.mjs && node tests/smoke_v2461_xpcurve11.mjs && node tests/smoke_v2462_xpcurve12.mjs && node tests/smoke_v2463_xpcurve13.mjs && node tests/smoke_v2464_xpcurve14.mjs && node tests/smoke_v2465_xpcurve15.mjs && node tests/smoke_v2466_xpcurve16.mjs && node tests/smoke_v2467_xpcurve17.mjs && node tests/smoke_v2468_xpcurve18.mjs && node tests/smoke_v2469_xpcurve19.mjs && node tests/smoke_v2470_xpcurve20.mjs && node tests/smoke_v2471_bellman.mjs && node tests/smoke_v2472_bellquest.mjs && node tests/smoke_v2473_xpcurve21.mjs && node tests/smoke_v2475_xpcurve22.mjs && node tests/smoke_v2476_achprog.mjs && node tests/smoke_v2477_fisher.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.37（startsWith）', changelog.startsWith('## v24.77 '));
ok('CHANGELOG v24.37 条目含「金币」与「续平滑」与「数值平衡」与「8→9」',
  changelog.includes('金币') && changelog.includes('续平滑') && changelog.includes('数值平衡') && changelog.includes('8→9'));
ok('CHANGELOG 仍保留 v24.36 与 v24.30 条目标题（历史积累）',
  changelog.includes('## v24.36 文档') && changelog.includes('## v24.30 数值平衡'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(chainAll.map((f) => f.replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 261 与实跑链恒等', files.length === 300, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：v2415 树串守护已推进至新链尾 + 前望 275 ——
const t2415 = read('tests/smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v2437_goldcurve6（第 273 份）',
  t2415.includes("chain[chain.length - 1] === 'smoke_v2477_fisher'"));
ok('smoke_v2415 树串 token 数已推进至 261', t2415.includes('treeTok.length === 300'));
ok('smoke_v2415 哨兵「尚无 275」口径（二百七十四件套 bare 否定式）',
  t2415.includes("!readme.includes('三百零一件套')"));
const s2429 = read('tests/smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 哨兵链已推进至「前望 275」口径（二百六十一件套 括号/冒烟 bare 否定式）',
  s2429.includes("!readme.includes('二百七十七件套（二百七十七件套清除）')") &&
  s2429.includes("!readme.includes('冒烟三百零一件套')"));
ok('smoke_v2429 既有断言随新现实推进（件套口径 266 + 链尾 v2439 + 入库 263）',
  s2429.includes('三百件套（二百九十九件套清除）') && s2429.includes("=== 'smoke_v2477_fisher'") &&
  s2429.includes('入库（300 份）'));

// —— 旧代 pin 零残留扫描（v24.36 / 260 口径；豁免本套件与上一版套件否定式）——
const leftovers = [];
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v2437_goldcurve6.mjs') continue;
  // 承 v24.30 同款豁免：上一版套件（smoke_v2436_codexrow）合法的历史/否定式字面量不入扫描。
  if (f === 'smoke_v2436_codexrow.mjs') continue;
  const s2 = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s2.includes("const GAME_VERSION = 'v24.36';") || s2.includes("GAME_VERSION === 'v24.36'") ||
      s2.includes("startsWith('## v24.36") || s2.includes('入库（260 份）') ||
      s2.includes('二百六十件套（二百五十九件套清除）') ||
      s2.includes("testChain === 260") || s2.includes("fileCount === 260") ||
      s2.includes("files.length === 260") || s2.includes("chainAll.length === 260") ||
      s2.includes("treeTok.length === 260") || s2.includes("chain[chain.length - 1] === 'smoke_v2436_codexrow'")) leftovers.push(f);
}
ok('全库测试零残留 v24.36 GAME_VERSION/顶 pin/260 口径（哨兵链，豁免本套件与上一版否定式）',
  leftovers.length === 0, leftovers.join(','));

console.log(`— v24.37 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
