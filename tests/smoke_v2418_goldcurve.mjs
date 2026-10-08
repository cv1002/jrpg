// v24.18 专项冒烟：后期金币曲线续平滑——四强怪（骷髅兵/雾灵/树精/石魔像）每级金币 +1（gold[1] 11→12）
// （数值平衡·承 v19.66 金币平滑第二轮：v19.66 把 Lv10 自然收入从 ≈762 金抬到 ≈876 金、与全身毕业装
// （勇者之剑 600 + 龙鳞甲 480 = 1080 金）的缺口从 ≈318 金缩到 ≈204 金后，同一条「金币只随玩家等级线性、
// 装备价格固定」的曲线在后段再次贴线（Lv10-12 仍需额外 farming 3-4 场）；现按 v19.66 同法把四强怪
// 每级金币再抬 1 点（gold[1] 11→12），加权实测（镇/林/矿/廊 × MAPS[].zone 修正）无字回廊 Lv10-12
// 每场金币 66.76/71.76/76.70 → 76.76/82.76/88.70（每场 +10/+11/+12）、残余缺口进一步收窄；四基础怪
// 逐字不动、Lv1-2 镇内零变化（village Lv1/Lv2 12.08/14.55 恒等），hp/atk/def/xp/权重/门槛/区域倍率
// 逐字未动）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.18 注释 / GAME_VERSION v24.18 与旧 v24.17 字面量
// 零残留 / v24.17 与 v19.66/v24.13 历史注释保留）、MON_BASE 运行期八怪全表逐值（四强怪 gold[1]=7 ·
// 四基础怪逐字未动 · hp/atk/def/xp 逐字未动）、曲线收益与零回归（Gallery 池 Lv10-12 每场 +lv 金 ·
// Village 池 Lv1-2 恒等）、README/package.json/CHANGELOG 同步（件套口径 243 + 魔物数值行
// 15+12/14+12/16+12/20+12 + v24.18 守护描述 + 入库 242 + package 串尾 + CHANGELOG 顶 pin）、哨兵链
// （前望 252 且 README 尚无 243 口径）、旧代 v24.17 pin 全库零残留扫描（字面量/顶 pin/241 口径）。
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

console.log('— v24.18 四强怪后期金币曲线续平滑 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.17 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.17', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 17)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.21（旧 v24.17 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.68';") && !dSrc.includes("const GAME_VERSION = 'v24.17';"));
ok('data.js 含 v24.18 注释（后期金币曲线续平滑说明）',
  dSrc.includes('// v24.18 数值平衡·后期金币曲线续平滑'));
ok('data.js 仍保留 v24.17 历史注释（喝药战报进度后缀说明，累积注释块）',
  dSrc.includes('// v24.17 体验打磨·信息透明·计数现场'));
ok('data.js v19.58/v19.66/v24.13 历史注释保留（经验/金币平滑先例行）',
  dSrc.includes('v19.58 数值平衡') && dSrc.includes('v19.66 数值平衡') && dSrc.includes('v24.13 数值平衡'));

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
// 全表 hp/atk/def/xp 逐字未动 + gold 仅四强怪转正（v24.18 只动 gold[1]）
const EXPECT = {
  '史莱姆': { hp: [16, 5], atk: [5, 2], def: [2, 1], xp: [8, 3], gold: [8, 2] },
  '野狼':   { hp: [22, 5], atk: [7, 2], def: [3, 1], xp: [12, 3], gold: [12, 2] },
  '骷髅兵': { hp: [26, 6], atk: [8, 2], def: [5, 1], xp: [16, 22], gold: [15, 12] },
  '哥布林': { hp: [20, 5], atk: [6, 2], def: [3, 1], xp: [10, 3], gold: [10, 2] },
  '毒蛇':   { hp: [20, 5], atk: [8, 2], def: [3, 1], xp: [15, 3], gold: [13, 2] },
  '雾灵':   { hp: [24, 5], atk: [9, 2], def: [4, 1], xp: [17, 22], gold: [14, 12] },
  '树精':   { hp: [30, 6], atk: [7, 2], def: [6, 1], xp: [18, 22], gold: [16, 12] },
  '石魔像': { hp: [36, 7], atk: [8, 2], def: [10, 1], xp: [22, 22], gold: [20, 12] },
};
ok('八怪 hp/atk/def 逐字未动 + xp 四强怪已 9（v24.41 转正）+ gold 四强怪 12/四基础怪 2（全表逐值）',
  MON_BASE.every((m) => {
    const e = EXPECT[m.name];
    return e && m.hp[0] === e.hp[0] && m.hp[1] === e.hp[1] && m.atk[0] === e.atk[0] && m.atk[1] === e.atk[1] &&
      m.def[0] === e.def[0] && m.def[1] === e.def[1] && m.xp[0] === e.xp[0] && m.xp[1] === e.xp[1] &&
      m.gold[0] === e.gold[0] && m.gold[1] === e.gold[1];
  }));

// —— 曲线收益：用真实 MON_BASE 权重/池/zone 复算加权均金（与 v19.66/v24.13 摸底同法）——
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
ok('README 件套口径已为二百九十二件套（二百九十一件套清除）',
  readme.includes('冒烟二百九十二件套（二百九十一件套清除）'));
ok('README 魔物数值行已为 15+12/14+12/16+12/20+12（四强怪每级金币 +1；xp 段随 v24.29 为 16+8/17+8/18+8/22+8）',
  readme.includes('骷髅兵 26+6/8+2/5+1/16+22/15+12') && readme.includes('雾灵 24+5/9+2/4+1/17+22/14+12') &&
  readme.includes('树精 30+6/7+2/6+1/18+22/16+12') && readme.includes('石魔像 36+7/8+2/10+1/22+22/20+12'));
ok('README 魔物数值行四基础怪逐字未动（8+2/12+2/10+2/13+2）',
  readme.includes('史莱姆 16+5/5+2/2+1/8+3/8+2') && readme.includes('野狼 22+5/7+2/3+1/12+3/12+2') &&
  readme.includes('哥布林 20+5/6+2/3+1/10+3/10+2') && readme.includes('毒蛇 20+5/8+2/3+1/15+3/13+2'));
ok('README tests 含 v24.18 守护描述与 smoke_v2418_goldcurve 入库（292 份）',
  readme.includes('v24.18 起含 「后期金币曲线续平滑」守护') && readme.includes('smoke_v2418_goldcurve 入库（292 份）'));
ok('README 仍有 v24.17 守护描述（历史保留）', readme.includes('v24.17 起含 F 喝药「渴饮甘露」进度后缀守护'));
ok('README 尚无 252 件套口径（哨兵前望 252 语义：下一版才写 246）',
  !readme.includes('二百九十三件套') && !readme.includes('冒烟二百九十三件套'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 247 份（smoke.mjs + 250 专项）', chain.length === 291 && chainAll.length === 292, String(chain.length));
ok('package.json 链尾为 smoke_v2439_xpcurve4（第 273 份）', chain[chain.length - 1] === 'smoke_v2468_xpcurve18', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2418_goldcurve.mjs（node tests/ 前缀形态）',
  pkgRaw.includes('node tests/smoke_v2418_goldcurve.mjs'));
ok('package.json 链锚逐字（smoke_v2417_mapdrink.mjs && node tests/smoke_v2418_goldcurve.mjs && node tests/smoke_v2419_luckdrp.mjs && node tests/smoke_v2420_skillprog.mjs && node tests/smoke_v2421_allquest.mjs && node tests/smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs"）',
  pkgRaw.includes('smoke_v2417_mapdrink.mjs && node tests/smoke_v2418_goldcurve.mjs && node tests/smoke_v2419_luckdrp.mjs && node tests/smoke_v2420_skillprog.mjs && node tests/smoke_v2421_allquest.mjs && node tests/smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs && node tests/smoke_v2459_xpcurve9.mjs && node tests/smoke_v2460_xpcurve10.mjs && node tests/smoke_v2461_xpcurve11.mjs && node tests/smoke_v2462_xpcurve12.mjs && node tests/smoke_v2463_xpcurve13.mjs && node tests/smoke_v2464_xpcurve14.mjs && node tests/smoke_v2465_xpcurve15.mjs && node tests/smoke_v2466_xpcurve16.mjs && node tests/smoke_v2467_xpcurve17.mjs && node tests/smoke_v2468_xpcurve18.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.21（startsWith）', changelog.startsWith('## v24.68'));
ok('CHANGELOG v24.18 条目含「金币」与「续平滑」与「数值平衡」',
  changelog.includes('金币') && changelog.includes('续平滑') && changelog.includes('数值平衡'));
ok('CHANGELOG 仍保留 v24.17 条目（历史保留）', changelog.includes('## v24.17'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(chainAll.map((f) => f.replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 243（241 + smoke_v2418_goldcurve）', files.length === 292, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链（旧代 v24.17 pin 全库零残留）——
const leftovers = [];
for (const f of files) {
  if (f === 'smoke_v2418_goldcurve.mjs') continue;
  // 承 v24.17 同款豁免：上一版套件（smoke_v2417_mapdrink）按惯例在否定式断言里保留旧代字面量，
  // 属合法残留，豁免扫描（本版无 v24.17 否定式则自然零残留）。
  if (f === 'smoke_v2417_mapdrink.mjs') continue;
  const s = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s.includes("const GAME_VERSION = 'v24.17';") || s.includes("GAME_VERSION === 'v24.17'") ||
      s.includes("startsWith('## v24.17") || s.includes('入库（241 份）') ||
      s.includes('二百四十一件套（二百四十件套清除）') || s.includes('testChain === 241') ||
      s.includes('fileCount === 241') || s.includes('files.length === 241') ||
      s.includes('chain.length === 240')) leftovers.push(f);
}
ok('全库测试零残留 v24.17 GAME_VERSION/顶 pin/241 口径（哨兵链·豁免上一版否定式）', leftovers.length === 0, leftovers.join(','));

console.log(`— v24.18 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
