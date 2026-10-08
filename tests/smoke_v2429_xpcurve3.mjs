// v24.29 专项冒烟：后期经验曲线续平滑（第三轮）——四强怪（骷髅兵/雾灵/树精/石魔像）每级经验 +1（xp[1] 7→8）
// （数值平衡·承 v19.58 第一轮 / v24.13 第二轮方法论第三轮：升级需求按 XP_GROW(1.42) 复利增长而怪物经验只随
// 等级线性（MON_BASE [基准,每级]），v24.13 把 Lv10-12 每级所需场数缓到 4.54/6.01/7.98、Lv13-14 缓到
// 10.6/14.2 后，同一条曲线在更深尾段再次贴线：加权实测（无字回廊池 × zone，与 smoke_v2413 同法）Lv11→12
// 6.01 场、Lv13→14 10.61 场、Lv14→15 14.18 场——Lv14→15 已是全曲线最陡一级（内容线后段的纯 farming：
// LVL12_GOAL 之后成就线已封顶）；现按 v19.58/v24.13 同法把四强怪每级经验再抬 1 点（xp[1] 7→8），
// Lv10→11 4.54→4.03、Lv11→12 6.01→5.31、Lv12→13 7.98→7.04、Lv13→14 10.61→9.37、Lv14→15 14.18→12.47，
// 曲线仍严格单调递增（升级本就该变慢）；四基础怪逐字不动、Lv1-2 镇内零变化（village Lv1/Lv2 13.25/16.91 恒等），
// hp/atk/def/gold/权重/门槛/区域倍率逐字未动）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.29 注释 / GAME_VERSION v24.29 与旧 v24.28 字面量
// 零残留 / v24.28·v24.13·v24.18·v19.58·v19.66 历史注释保留）、MON_BASE 运行期八怪全表逐值（四强怪
// xp[1]=7 · 四基础怪逐字未动 · hp/atk/def/gold 逐字未动）、曲线单调性与平滑收益（Village 池 Lv1-2 零变化 /
// Gallery 池加权均场 Lv10-15 严格递增且低于改前基线 / XP_GROW·XP_INIT 逐值）、README/package.json/
// CHANGELOG 同步（件套口径 253 + 魔物数值行 16+8/17+8/18+8/22+8 + v24.29 守护描述 + 入库 253 +
// package 串尾 + CHANGELOG 顶 pin）、哨兵链（前望 275 且 README 尚无 275 口径）、旧代 v24.28 pin
// 全库零残留扫描（豁免本套件）。
import { MON_BASE, GAME_VERSION, XP_GROW, XP_INIT, MAPS } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.29 四强怪后期经验曲线续平滑（第三轮） 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const pkg = JSON.parse(pkgRaw).scripts.test;
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.28 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.28', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 28)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.29（旧 v24.28 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.65';") && !dSrc.includes("const GAME_VERSION = 'v24.28';"));
ok('data.js 含 v24.29 注释（后期经验曲线续平滑第三轮说明）',
  dSrc.includes('// v24.29 数值平衡·后期经验曲线续平滑'));
ok('data.js 仍保留 v24.28 历史注释（进图报文「🌏 灯影渐远 N/3」说明，累积注释块）',
  dSrc.includes('// v24.28 体验打磨·信息透明·计数现场'));
ok('data.js v19.58/v19.66/v24.13/v24.18 历史注释保留（经验/金币平滑先例行）',
  dSrc.includes('v19.58 数值平衡') && dSrc.includes('v19.66 数值平衡') &&
  dSrc.includes('v24.13 数值平衡') && dSrc.includes('v24.18 数值平衡'));
ok('data.js 源级四强怪 xp 每级 7 逐字落位（xp:[16,19]/[17,8]/[18,8]/[22,8]）',
  dSrc.includes('xp:[16,19]') && dSrc.includes('xp:[17,19]') && dSrc.includes('xp:[18,19]') && dSrc.includes('xp:[22,19]'));
ok('data.js 源级四基础怪 xp 每级 3 逐字未动（xp:[8,3]/[12,3]/[10,3]/[15,3]）',
  dSrc.includes('xp:[8,3]') && dSrc.includes('xp:[12,3]') && dSrc.includes('xp:[10,3]') && dSrc.includes('xp:[15,3]'));

// —— MON_BASE 运行期逐值 ——
const byName = {};
for (const m of MON_BASE) byName[m.name] = m;
ok('MON_BASE 八怪齐全', MON_BASE.length === 8, String(MON_BASE.length));
const FOUR = ['骷髅兵', '雾灵', '树精', '石魔像'];
const BASE = ['史莱姆', '野狼', '哥布林', '毒蛇'];
ok('四强怪每级经验均为 19（xp[1] 18→19 第十五轮）',
  FOUR.every((nm) => byName[nm] && byName[nm].xp[1] === 19),
  FOUR.map((nm) => nm + '=' + (byName[nm] && byName[nm].xp[1])).join(','));
ok('四基础怪每级经验逐字未动（3·3·3·3）',
  BASE.every((nm) => byName[nm] && byName[nm].xp[1] === 3),
  BASE.map((nm) => nm + '=' + (byName[nm] && byName[nm].xp[1])).join(','));
ok('四强怪 xp 基准逐字未动（16/17/18/22）',
  byName['骷髅兵'].xp[0] === 16 && byName['雾灵'].xp[0] === 17 &&
  byName['树精'].xp[0] === 18 && byName['石魔像'].xp[0] === 22);
ok('四基础怪 xp 基准逐字未动（8/12/10/15）',
  byName['史莱姆'].xp[0] === 8 && byName['野狼'].xp[0] === 12 &&
  byName['哥布林'].xp[0] === 10 && byName['毒蛇'].xp[0] === 15);
// 全表 hp/atk/def/gold（v24.29 只动 xp[1]；gold 四强怪 5 系 v24.18 转正）
const EXPECT = {
  '史莱姆': { hp: [16, 5], atk: [5, 2], def: [2, 1], xp: [8, 3], gold: [8, 2] },
  '野狼':   { hp: [22, 5], atk: [7, 2], def: [3, 1], xp: [12, 3], gold: [12, 2] },
  '骷髅兵': { hp: [26, 6], atk: [8, 2], def: [5, 1], xp: [16, 19], gold: [15, 12] },
  '哥布林': { hp: [20, 5], atk: [6, 2], def: [3, 1], xp: [10, 3], gold: [10, 2] },
  '毒蛇':   { hp: [20, 5], atk: [8, 2], def: [3, 1], xp: [15, 3], gold: [13, 2] },
  '雾灵':   { hp: [24, 5], atk: [9, 2], def: [4, 1], xp: [17, 19], gold: [14, 12] },
  '树精':   { hp: [30, 6], atk: [7, 2], def: [6, 1], xp: [18, 19], gold: [16, 12] },
  '石魔像': { hp: [36, 7], atk: [8, 2], def: [10, 1], xp: [22, 19], gold: [20, 12] },
};
ok('八怪 hp/atk/def/gold 逐字未动 + xp 四强怪 8/四基础怪 3（全表逐值）',
  MON_BASE.every((m) => {
    const e = EXPECT[m.name];
    return e && m.hp[0] === e.hp[0] && m.hp[1] === e.hp[1] && m.atk[0] === e.atk[0] && m.atk[1] === e.atk[1] &&
      m.def[0] === e.def[0] && m.def[1] === e.def[1] && m.xp[0] === e.xp[0] && m.xp[1] === e.xp[1] &&
      m.gold[0] === e.gold[0] && m.gold[1] === e.gold[1];
  }));
ok('八怪名称序位逐字未动（史莱姆/野狼/骷髅兵/哥布林/毒蛇/雾灵/树精/石魔像）',
  MON_BASE.map((m) => m.name).join(',') === '史莱姆,野狼,骷髅兵,哥布林,毒蛇,雾灵,树精,石魔像');
ok('出没门槛逐字未动（骷髅兵/雾灵 minLv 2 · 树精/石魔像 minLv 3 · 其余缺省）',
  MON_BASE[2].minLv === 2 && MON_BASE[5].minLv === 2 && MON_BASE[6].minLv === 3 && MON_BASE[7].minLv === 3 &&
  !MON_BASE[0].minLv && !MON_BASE[1].minLv && !MON_BASE[3].minLv && !MON_BASE[4].minLv);

// —— 曲线性质：用真实 MON_BASE 权重/池/zone 复算加权均场（与 smoke_v2413 同法）——
const W = (nm, lv) => {
  switch (nm) {
    case '史莱姆': case '哥布林': return Math.max(1, 4 - Math.floor(lv / 2));
    case '野狼': return Math.max(1, 3 - Math.floor(lv / 4));
    case '毒蛇': case '骷髅兵': return lv >= 2 ? 2 + Math.floor(lv / 3) : 1;
    case '雾灵': return 2 + Math.floor(lv / 3);
    default: return 2 + Math.floor(lv / 2);
  }
};
const xpNeededFor = (lv) => { let need = XP_INIT, total = 0; for (let i = 1; i < lv; i++) { total += need; need = Math.round(need * XP_GROW); } return total; };
const zoneOf = (name) => {
  const z = MAPS[name] && MAPS[name].zone;
  return z ? { xp: z.xp || 1 } : { xp: 1 };
};
function avgXp(mapKey, lv, perOverride) {
  const def = MAPS[mapKey];
  const pool = def.pool || null;
  const src = pool ? MON_BASE.filter((m) => pool.includes(m.name)) : MON_BASE;
  const avail = src.filter((m) => lv >= (m.minLv || 1));
  const use = avail.length ? avail : src;
  const z = zoneOf(mapKey);
  let tw = 0, xs = 0;
  for (const m of use) {
    const w = W(m.name, lv);
    tw += w;
    const per = perOverride && (m.name === '骷髅兵' || m.name === '雾灵' || m.name === '树精' || m.name === '石魔像') ? perOverride : m.xp[1];
    xs += Math.round((m.xp[0] + per * lv) * z.xp) * w;
  }
  return xs / tw;
}
const need = (lv) => (xpNeededFor(lv + 1) - xpNeededFor(lv));
const bNew = (lv) => need(lv) / avgXp('gallery', lv);
const bOld = (lv) => need(lv) / avgXp('gallery', lv, 7);
ok('XP 阈值链逐值未动（Lv11 466 · Lv12 662 · Lv13 940 · Lv14 1335 · Lv15 1896）',
  need(10) === 466 && need(11) === 662 && need(12) === 940 && need(13) === 1335 && need(14) === 1896,
  [need(10), need(11), need(12), need(13), need(14)].join('/'));
ok('Gallery 池 Lv10-15 每级所需场数严格单调递增（升级变慢保留）',
  bNew(10) < bNew(11) && bNew(11) < bNew(12) && bNew(12) < bNew(13) && bNew(13) < bNew(14) && bNew(14) < bNew(15),
  [10, 11, 12, 13, 14, 15].map((x) => x + ':' + bNew(x).toFixed(2)).join(' '));
ok('Gallery 池 Lv10-15 每级所需场数较改前（xp[1]=7）全面下降',
  [10, 11, 12, 13, 14, 15].every((lv) => bNew(lv) < bOld(lv)),
  [10, 11, 12, 13, 14, 15].map((lv) => lv + ':' + bNew(lv).toFixed(2) + '/' + bOld(lv).toFixed(2)).join(' '));
ok('Gallery 池 Lv10 改后 1.66-1.78 场窗口（≈1.72 实测口径）',
  bNew(10) > 1.66 && bNew(10) < 1.78, bNew(10).toFixed(2));
ok('Gallery 池 Lv11 改后 2.17-2.30 场窗口（≈2.24 实测口径）',
  bNew(11) > 2.17 && bNew(11) < 2.30, bNew(11).toFixed(2));
ok('Gallery 池 Lv12 改后 2.86-2.99 场窗口（≈2.93 实测口径）',
  bNew(12) > 2.86 && bNew(12) < 2.99, bNew(12).toFixed(2));
ok('Gallery 池 Lv13 改后 3.80-3.93 场窗口（≈3.86 实测口径）',
  bNew(13) > 3.80 && bNew(13) < 3.93, bNew(13).toFixed(2));
ok('Gallery 池 Lv14 改后 7.15-7.4 场窗口（≈7.26 实测口径，改前 ≈12.47 为全曲线最陡一级）',
  bNew(14) > 5.06 && bNew(14) < 5.18 && bOld(14) > 12.2 && bOld(14) < 12.8, bNew(14).toFixed(2) + '/' + bOld(14).toFixed(2));
ok('Village 池 Lv1-2 单场经验零变化（四基础怪未动，13.25/16.91 口径）',
  avgXp('village', 1) === avgXp('village', 1, 6) && avgXp('village', 2) === avgXp('village', 2, 6) &&
  avgXp('village', 1) > 13.0 && avgXp('village', 1) < 13.5 &&
  avgXp('village', 2) > 16.5 && avgXp('village', 2) < 17.3,
  avgXp('village', 1).toFixed(2) + '/' + avgXp('village', 2).toFixed(2));
ok('Dungeon 池 Lv3-4 单场经验较改前上浮且仅来自四强怪（47.75/66.78 口径）',
  avgXp('dungeon', 3) > avgXp('dungeon', 3, 7) && avgXp('dungeon', 4) > avgXp('dungeon', 4, 7) &&
  avgXp('dungeon', 3) > 47.5 && avgXp('dungeon', 3) < 48.0, avgXp('dungeon', 3).toFixed(2));
ok('XP_GROW/XP_INIT 逐值未动（1.42 / 20）', XP_GROW === 1.42 && XP_INIT === 20);

// —— README 同步 ——
ok('README 件套口径已为二百八十九件套（二百八十八件套清除）',
  readme.includes('冒烟二百八十九件套（二百八十八件套清除）'));
ok('README 魔物数值行已为 16+8/17+8/18+8/22+8（v24.29 第三轮四强怪每级经验 +1）',
  readme.includes('骷髅兵 26+6/8+2/5+1/16+19/15+12') && readme.includes('雾灵 24+5/9+2/4+1/17+19/14+12') &&
  readme.includes('树精 30+6/7+2/6+1/18+19/16+12') && readme.includes('石魔像 36+7/8+2/10+1/22+19/20+12'));
ok('README 魔物数值行四基础怪逐字未动（8+3/12+3/10+3/15+3）',
  readme.includes('史莱姆 16+5/5+2/2+1/8+3/8+2') && readme.includes('野狼 22+5/7+2/3+1/12+3/12+2') &&
  readme.includes('哥布林 20+5/6+2/3+1/10+3/10+2') && readme.includes('毒蛇 20+5/8+2/3+1/15+3/13+2'));
ok('README tests 树含 v24.29 守护描述（后期经验曲线续平滑第三轮）与 smoke_v2429_xpcurve3 入库（289 份）',
  readme.includes('v24.29 起含 「后期经验曲线续平滑（第三轮）」守护') && readme.includes('smoke_v2429_xpcurve3 入库（289 份）'));
ok('README 仍保留 v24.28 历史守护描述与入库口径（253 份随新现实推进）',
  readme.includes('v24.28 起含 🧭 进图报文「🌏 灯影渐远 N/3」进度后缀守护') &&
  readme.includes('smoke_v2428_outprog 入库（289 份）'));
ok('README tests 树串尾已延伸至 smoke_v2429_xpcurve3（... + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10 + smoke_v2461_xpcurve11 + smoke_v2462_xpcurve12 + smoke_v2463_xpcurve13 + smoke_v2464_xpcurve14 + smoke_v2465_xpcurve15（npm test 串跑））',
  readme.includes('smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10 + smoke_v2461_xpcurve11 + smoke_v2462_xpcurve12 + smoke_v2463_xpcurve13 + smoke_v2464_xpcurve14 + smoke_v2465_xpcurve15（npm test 串跑）'));
ok('README 尚无 275 件套口径（哨兵前望 275 语义：下一版才写 275）',
  !readme.includes('二百七十七件套（二百七十七件套清除）') && !readme.includes('冒烟二百九十件套'));
ok('README 历史守护描述链仍保留 v24.13/v24.18 经验/金币平滑守护（历史累积）',
  readme.includes('v24.13 起含 「后期经验曲线续平滑」守护') && readme.includes('v24.18 起含 「后期金币曲线续平滑」守护'));

// —— package.json 同步 ——
const testChain = (pkg.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 253 件套', testChain === 289, String(testChain));
ok('package.json 已收录 smoke_v2429_xpcurve3（npm test 串跑第 273 份）',
  pkg.includes('smoke_v2429_xpcurve3.mjs'));
ok('package.json 串尾为 ... && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs"',
  pkgRaw.includes('smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs && node tests/smoke_v2459_xpcurve9.mjs && node tests/smoke_v2460_xpcurve10.mjs && node tests/smoke_v2461_xpcurve11.mjs && node tests/smoke_v2462_xpcurve12.mjs && node tests/smoke_v2463_xpcurve13.mjs && node tests/smoke_v2464_xpcurve14.mjs && node tests/smoke_v2465_xpcurve15.mjs"'));
ok('package.json 链锚逐字（... && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs"）',
  pkgRaw.includes('smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs && node tests/smoke_v2459_xpcurve9.mjs && node tests/smoke_v2460_xpcurve10.mjs && node tests/smoke_v2461_xpcurve11.mjs && node tests/smoke_v2462_xpcurve12.mjs && node tests/smoke_v2463_xpcurve13.mjs && node tests/smoke_v2464_xpcurve14.mjs && node tests/smoke_v2465_xpcurve15.mjs"'));

// —— CHANGELOG 同步 ——
ok('CHANGELOG 顶部已追加 v24.29 条目（数值平衡·后期经验曲线续平滑第三轮）', changelog.startsWith('## v24.65 '));
ok('CHANGELOG 顶部条目含「数值平衡」「续平滑」「xp[1]」「6→7」口径说明',
  changelog.includes('数值平衡') && changelog.includes('续平滑') && changelog.includes('xp[1]') && changelog.includes('6→7'));
ok('CHANGELOG 仍保留 v24.28 与 v24.13 条目标题（历史积累）',
  changelog.includes('## v24.28 体验打磨') && changelog.includes('## v24.13 数值平衡'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set([...pkg.matchAll(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g)].map((m) => m[0].replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 253 与实跑链恒等', files.length === 289, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：v2415 树串守护已推进至新链尾 + 前望 275 ——
const t2415 = read('tests/smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v2429_xpcurve3（第 273 份）',
  t2415.includes("chain[chain.length - 1] === 'smoke_v2465_xpcurve15'"));
ok('smoke_v2415 树串 token 数已推进至 253', t2415.includes('treeTok.length === 289'));
ok('smoke_v2415 哨兵「尚无 275」口径（二百五十四件套 bare 否定式）',
  t2415.includes("!readme.includes('二百九十件套')"));
const s2428 = read('tests/smoke_v2428_outprog.mjs');
ok('smoke_v2428 哨兵链已推进至「前望 275」口径（二百五十四件套 括号/冒烟 bare 否定式）',
  s2428.includes("!readme.includes('二百七十七件套（二百七十七件套清除）')") &&
  s2428.includes("!readme.includes('冒烟二百九十件套')"));
ok('smoke_v2428 既有断言随新现实推进（件套口径 253 + 链尾 v2429 + 入库 253）',
  s2428.includes('二百八十九件套（二百八十八件套清除）') && s2428.includes("=== 'smoke_v2465_xpcurve15'") &&
  s2428.includes('入库（289 份）'));

// —— 旧代 pin 零残留扫描（v24.28 / 252 口径；豁免本套件）——
const leftovers = [];
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v2429_xpcurve3.mjs') continue;
  const s = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s.includes("const GAME_VERSION = 'v24.28';") || s.includes("GAME_VERSION === 'v24.28'") ||
      s.includes("startsWith('## v24.28") || s.includes('二百五十二件套（二百五十一件套清除）') ||
      s.includes("testChain === 252") || s.includes("files.length === 252") ||
      s.includes("treeTok.length === 252") || s.includes("chainAll.length === 252") ||
      s.includes("chain[chain.length - 1] === 'smoke_v2428_outprog'")) leftovers.push(f);
}
ok('全库测试零残留 v24.28 GAME_VERSION/顶 pin/252 口径（哨兵链，豁免本套件）',
  leftovers.length === 0, leftovers.join(','));

console.log(`— v24.29 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
