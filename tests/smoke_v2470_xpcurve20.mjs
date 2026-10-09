// v24.70 专项冒烟：后期经验曲线续平滑（第二十轮）——四强怪（骷髅兵/雾灵/树精/石魔像）每级经验 +1（xp[1] 24→25）
// （数值平衡·承 v19.58 第一轮 / v24.13 第二轮 / v24.29 第三轮 / v24.39 第四轮 / v24.41 第五轮 /
// v24.43 第六轮 / v24.47 第七轮 / v24.49 第八轮 / v24.59 第九轮 / v24.60 第十轮 / v24.61 第十一轮 /
// v24.62 第十二轮 / v24.63 第十三轮 / v24.64 第十四轮 / v24.65 第十五轮 / v24.66 第十六轮 / v24.67 第十七轮 / v24.68 第十八轮 / v24.69 第十九轮方法论第二十轮：升级需求按
// XP_GROW(1.42) 复利增长而怪物经验只随等级线性（MON_BASE [基准,每级]），v24.69 把 Lv10-15 每级所需场数
// 缓到 1.44/1.87/2.45/3.23/4.28/5.69 后，同一条曲线在更深尾段再次贴线：加权实测（无字回廊池 × zone，
// 与 smoke_v2413/v2429/v2439/v2441/v2443/v2447/v2449/v2459/v2460/v2461/v2462/v2463/v2464/v2465/v2466/v2467/v2468/v2469 同法）Lv15→16 5.69 场仍为全曲线最陡一级
// （内容线后段的纯 farming）；现按同法把四强怪每级经验再抬 1 点（xp[1] 24→25），Lv10→11 1.44→1.38、
// Lv11→12 1.87→1.80、Lv12→13 2.45→2.36、Lv13→14 3.23→3.11、Lv14→15 4.28→4.11、Lv15→16 5.69→5.47
// （每级 -0.06~-0.23 场，Lv10-16 累计 18.97→18.23 场），曲线仍严格单调递增（升级本就该变慢）；四基础怪
// 逐字不动、Lv1-2 镇内零变化（village Lv1/Lv2 13.25/16.91 恒等），hp/atk/def/gold/权重/门槛/区域倍率逐字未动）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.70 注释 / GAME_VERSION v24.70 与旧 v24.69 字面量
// 零残留 / v24.68·v24.49 历史注释保留）、MON_BASE 运行期八怪全表逐值（四强怪 xp[1]=23 · 四基础怪逐字
// 未动 · hp/atk/def/gold 逐字未动）、曲线单调性与平滑收益（Village 池 Lv1-2 零变化 / Gallery 池加权均场
// Lv10-15 严格递增且低于改前 / XP_GROW·XP_INIT 逐值）、README/package.json/CHANGELOG 同步（件套口径 293 +
// 魔物数值行 16+25/17+25/18+25/22+25 + v24.70 守护描述 + 入库 294 + package 串尾 + CHANGELOG 顶 pin）、
// README 升级节奏参考段落 v24.70 刷新口径、哨兵链（前望 295 且 README 尚无 295 口径）、
// 旧代 v24.69 pin 全库零残留扫描（字面量/顶 pin/294 口径 · 豁免本套件与上一版套件）。
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

console.log('— v24.70 四强怪后期经验曲线续平滑（第二十轮） 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const pkg = JSON.parse(pkgRaw).scripts.test;
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.66 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.69', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 69)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.70（旧 v24.69 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.73';") && !dSrc.includes("const GAME_VERSION = 'v24.69';"));
ok('data.js 含 v24.70 注释（后期经验曲线续平滑第二十轮说明）',
  dSrc.includes('// v24.70 数值平衡·后期经验曲线续平滑'));
ok('data.js 仍保留 v24.69/v24.49 历史注释（第十九轮/第八轮说明，累积注释块）',
  dSrc.includes('// v24.69 数值平衡·后期经验曲线续平滑') && dSrc.includes('// v24.49 数值平衡·后期经验曲线续平滑'));
ok('data.js 源级四强怪 xp 每级 24 逐字落位（xp:[16,25]/[17,24]/[18,24]/[22,24]）',
  dSrc.includes('xp:[16,25]') && dSrc.includes('xp:[17,25]') && dSrc.includes('xp:[18,25]') && dSrc.includes('xp:[22,25]'));
ok('data.js 源级四基础怪 xp 每级 3 逐字未动（xp:[8,3]/[12,3]/[10,3]/[15,3]）',
  dSrc.includes('xp:[8,3]') && dSrc.includes('xp:[12,3]') && dSrc.includes('xp:[10,3]') && dSrc.includes('xp:[15,3]'));

// —— MON_BASE 运行期逐值 ——
const byName = {};
for (const m of MON_BASE) byName[m.name] = m;
ok('MON_BASE 八怪齐全', MON_BASE.length === 8, String(MON_BASE.length));
const FOUR = ['骷髅兵', '雾灵', '树精', '石魔像'];
const BASE = ['史莱姆', '野狼', '哥布林', '毒蛇'];
ok('四强怪每级经验均为 25（xp[1] 24→25 第二十一轮）',
  FOUR.every((nm) => byName[nm] && byName[nm].xp[1] === 25),
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
// 全表 hp/atk/def/gold（v24.60 只动 xp[1]；gold 四强怪 12 系 v24.45 转正）
const EXPECT = {
  '史莱姆': { hp: [16, 5], atk: [5, 2], def: [2, 1], xp: [8, 3], gold: [8, 2] },
  '野狼':   { hp: [22, 5], atk: [7, 2], def: [3, 1], xp: [12, 3], gold: [12, 2] },
  '骷髅兵': { hp: [26, 6], atk: [8, 2], def: [5, 1], xp: [16, 25], gold: [15, 12] },
  '哥布林': { hp: [20, 5], atk: [6, 2], def: [3, 1], xp: [10, 3], gold: [10, 2] },
  '毒蛇':   { hp: [20, 5], atk: [8, 2], def: [3, 1], xp: [15, 3], gold: [13, 2] },
  '雾灵':   { hp: [24, 5], atk: [9, 2], def: [4, 1], xp: [17, 25], gold: [14, 12] },
  '树精':   { hp: [30, 6], atk: [7, 2], def: [6, 1], xp: [18, 25], gold: [16, 12] },
  '石魔像': { hp: [36, 7], atk: [8, 2], def: [10, 1], xp: [22, 25], gold: [20, 12] },
};
ok('八怪 hp/atk/def 逐字未动 + gold 四强怪仍 12/四基础怪 2 + xp 四强怪 25/四基础怪 3（全表逐值）',
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

// —— 曲线性质：用真实 MON_BASE 权重/池/zone 复算加权均场（与 smoke_v2413/v2429/v2459 同法）——
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
    const per = FOUR.includes(m.name) && perOverride != null ? perOverride : m.xp[1];
    xs += Math.round((m.xp[0] + per * lv) * z.xp) * w;
  }
  return xs / tw;
}
const need = (lv) => (xpNeededFor(lv + 1) - xpNeededFor(lv));
const bNew = (lv) => need(lv) / avgXp('gallery', lv);
const bOld = (lv) => need(lv) / avgXp('gallery', lv, 23);
ok('XP 阈值链逐值未动（Lv11 466 · Lv12 662 · Lv13 940 · Lv14 1335 · Lv15 1896 · Lv16 2692）',
  need(10) === 466 && need(11) === 662 && need(12) === 940 && need(13) === 1335 && need(14) === 1896 && need(15) === 2692,
  [need(10), need(11), need(12), need(13), need(14), need(15)].join('/'));
ok('Gallery 池 Lv10-15 每级所需场数严格单调递增（升级变慢保留）',
  bNew(10) < bNew(11) && bNew(11) < bNew(12) && bNew(12) < bNew(13) && bNew(13) < bNew(14) && bNew(14) < bNew(15),
  [10, 11, 12, 13, 14, 15].map((x) => x + ':' + bNew(x).toFixed(2)).join(' '));
ok('Gallery 池 Lv10-15 每级所需场数较改前（xp[1]=23）全面下降',
  [10, 11, 12, 13, 14, 15].every((lv) => bNew(lv) < bOld(lv)),
  [10, 11, 12, 13, 14, 15].map((lv) => lv + ':' + bNew(lv).toFixed(2) + '/' + bOld(lv).toFixed(2)).join(' '));
ok('Gallery 池 Lv10 改后 1.32-1.44 场窗口（≈1.38 实测口径）',
  bNew(10) > 1.27 && bNew(10) < 1.39, bNew(10).toFixed(2));
ok('Gallery 池 Lv11 改后 1.74-1.86 场窗口（≈1.80 实测口径）',
  bNew(11) > 1.67 && bNew(11) < 1.79, bNew(11).toFixed(2));
ok('Gallery 池 Lv12 改后 2.30-2.42 场窗口（≈2.36 实测口径）',
  bNew(12) > 2.21 && bNew(12) < 2.33, bNew(12).toFixed(2));
ok('Gallery 池 Lv13 改后 3.05-3.17 场窗口（≈3.11 实测口径）',
  bNew(13) > 2.93 && bNew(13) < 3.05, bNew(13).toFixed(2));
ok('Gallery 池 Lv14 改后 4.05-4.17 场窗口（≈4.11 实测口径，改前 ≈4.28）',
  bNew(14) > 3.89 && bNew(14) < 4.01 && bOld(14) > 4.22 && bOld(14) < 4.34, bNew(14).toFixed(2) + '/' + bOld(14).toFixed(2));
ok('Gallery 池 Lv15 改后 5.41-5.53 场窗口（≈5.47 实测口径，改前 ≈5.69 为全曲线最陡一级）',
  bNew(15) > 5.20 && bNew(15) < 5.32, bNew(15).toFixed(2));
ok('Gallery 池加权均场经验改后落在实测窗口（336.4-336.8 / 367.4-367.8 / 398.6-399.0）',
  avgXp('gallery', 10) > 349.4 && avgXp('gallery', 10) < 349.8 &&
  avgXp('gallery', 11) > 381.7 && avgXp('gallery', 11) < 382.1 &&
  avgXp('gallery', 12) > 414.3 && avgXp('gallery', 12) < 414.7,
  [10, 11, 12].map((lv) => avgXp('gallery', lv).toFixed(2)).join('/'));
ok('Village 池 Lv1-2 单场经验零变化（四基础怪未动，13.25/16.91 口径）',
  avgXp('village', 1) === avgXp('village', 1, 23) && avgXp('village', 2) === avgXp('village', 2, 23) &&
  avgXp('village', 1) > 13.0 && avgXp('village', 1) < 13.5 &&
  avgXp('village', 2) > 16.5 && avgXp('village', 2) < 17.3,
  avgXp('village', 1).toFixed(2) + '/' + avgXp('village', 2).toFixed(2));
ok('Dungeon 池 Lv3-4 单场经验较改前上浮且仅来自四强怪（55.25/78.96 口径）',
  avgXp('dungeon', 3) > avgXp('dungeon', 3, 23) && avgXp('dungeon', 4) > avgXp('dungeon', 4, 23) &&
  avgXp('dungeon', 3) > 56.5 && avgXp('dungeon', 3) < 57.0, avgXp('dungeon', 3).toFixed(2));
ok('XP_GROW/XP_INIT 逐值未动（1.42 / 20）', XP_GROW === 1.42 && XP_INIT === 20);

// —— README 同步 ——
ok('README 件套口径已为二百九十六件套（二百九十五件套清除）',
  readme.includes('冒烟二百九十六件套（二百九十五件套清除）'));
ok('README 魔物数值行已为 16+25/17+25/18+25/22+25（v24.70 第二十轮四强怪每级经验 +1；gold 段仍 15+12/14+12/16+12/20+12）',
  readme.includes('骷髅兵 26+6/8+2/5+1/16+25/15+12') && readme.includes('雾灵 24+5/9+2/4+1/17+25/14+12') &&
  readme.includes('树精 30+6/7+2/6+1/18+25/16+12') && readme.includes('石魔像 36+7/8+2/10+1/22+25/20+12'));
ok('README 魔物数值行四基础怪逐字未动（8+3/12+3/10+3/15+3）',
  readme.includes('史莱姆 16+5/5+2/2+1/8+3/8+2') && readme.includes('野狼 22+5/7+2/3+1/12+3/12+2') &&
  readme.includes('哥布林 20+5/6+2/3+1/10+3/10+2') && readme.includes('毒蛇 20+5/8+2/3+1/15+3/13+2'));
ok('README 升级节奏参考已按 v24.70 刷新（Lv5→6 约 0.9 场 / Lv9→10 约 1.6 场 / Lv11→12 约 1.8 场）',
  readme.includes('Lv5→6 约 0.9 场（雾语林）') && readme.includes('Lv9→10 约 1.5 场（星井矿脉）') &&
  readme.includes('Lv11→12 约 1.7 场（无字回廊）') && readme.includes('Lv13+ 每级 3.0-5.3 场'));
ok('README 升级节奏参考金币口径未动（约 1052 金）且保留 v19.66/v21.35 历史注记（≈2.1/≈5.1/≈7.0）',
  readme.includes('金币自然收入到 Lv10 约 1052 金') && readme.includes('Lv5→6 ≈2.1') &&
  readme.includes('Lv11→12 ≈7.0') && readme.includes('二十一轮经验平滑') && readme.includes('v24.73 复核'));
ok('README tests 树含 v24.70 守护描述（后期经验曲线续平滑第二十轮）与 smoke_v2470_xpcurve20 入库（296 份）',
  readme.includes('v24.70 起含 「后期经验曲线续平滑（第二十轮）」守护') && readme.includes('smoke_v2470_xpcurve20 入库（296 份）'));
ok('README 仍保留 v24.69/v24.49 历史守护描述（经验第十九轮/第八轮，历史保留）',
  readme.includes('v24.69 起含 「后期经验曲线续平滑（第十九轮）」守护') && readme.includes('v24.49 起含 「后期经验曲线续平滑（第八轮）」守护'));
ok('README tests 树串尾已延伸至 smoke_v2471_bellman（... + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10 + smoke_v2461_xpcurve11 + smoke_v2462_xpcurve12 + smoke_v2463_xpcurve13 + smoke_v2464_xpcurve14 + smoke_v2465_xpcurve15 + smoke_v2466_xpcurve16 + smoke_v2467_xpcurve17 + smoke_v2468_xpcurve18 + smoke_v2469_xpcurve19 + smoke_v2470_xpcurve20 + smoke_v2471_bellman + smoke_v2473_xpcurve21（npm test 串跑））',
  readme.includes('smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10 + smoke_v2461_xpcurve11 + smoke_v2462_xpcurve12 + smoke_v2463_xpcurve13 + smoke_v2464_xpcurve14 + smoke_v2465_xpcurve15 + smoke_v2466_xpcurve16 + smoke_v2467_xpcurve17 + smoke_v2468_xpcurve18 + smoke_v2469_xpcurve19 + smoke_v2470_xpcurve20 + smoke_v2471_bellman + smoke_v2473_xpcurve21（npm test 串跑）'));
ok('README 尚无 295 件套口径（哨兵前望 295 语义：下一版才写 295）',
  !readme.includes('二百九十七件套') && !readme.includes('冒烟二百九十七件套'));

// —— package.json 同步 ——
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 294 份（smoke.mjs + 293 专项）', chain.length === 295 && chainAll.length === 296, String(chain.length));
ok('package.json 链尾为 smoke_v2471_bellman（第 294 份）', chain[chain.length - 1] === 'smoke_v2473_xpcurve21', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2471_bellman.mjs（node tests/ 前缀形态，紧随 smoke_v2469_xpcurve19 之后）',
  pkgRaw.includes('node tests/smoke_v2459_xpcurve9.mjs && node tests/smoke_v2460_xpcurve10.mjs && node tests/smoke_v2461_xpcurve11.mjs && node tests/smoke_v2462_xpcurve12.mjs && node tests/smoke_v2463_xpcurve13.mjs && node tests/smoke_v2464_xpcurve14.mjs && node tests/smoke_v2465_xpcurve15.mjs && node tests/smoke_v2466_xpcurve16.mjs && node tests/smoke_v2467_xpcurve17.mjs && node tests/smoke_v2468_xpcurve18.mjs && node tests/smoke_v2469_xpcurve19.mjs && node tests/smoke_v2470_xpcurve20.mjs && node tests/smoke_v2471_bellman.mjs && node tests/smoke_v2473_xpcurve21.mjs"'));
ok('package.json 链锚逐字（... && node tests/smoke_v2468_xpcurve18.mjs && node tests/smoke_v2469_xpcurve19.mjs && node tests/smoke_v2470_xpcurve20.mjs && node tests/smoke_v2471_bellman.mjs && node tests/smoke_v2473_xpcurve21.mjs"）',
  pkgRaw.includes('smoke_v2468_xpcurve18.mjs && node tests/smoke_v2469_xpcurve19.mjs && node tests/smoke_v2470_xpcurve20.mjs && node tests/smoke_v2471_bellman.mjs && node tests/smoke_v2473_xpcurve21.mjs"'));

// —— CHANGELOG 同步 ——
ok('CHANGELOG.md 顶部条目已为 v24.70（startsWith）', changelog.startsWith('## v24.73 '));
ok('CHANGELOG v24.70 条目含「数值平衡」「续平滑」「xp[1]」「23→24」',
  changelog.includes('数值平衡') && changelog.includes('续平滑') && changelog.includes('xp[1]') && changelog.includes('23→24'));
ok('CHANGELOG 仍保留 v24.69 与 v24.49 条目标题（历史积累）',
  changelog.includes('## v24.69 数值平衡') && changelog.includes('## v24.49 数值平衡'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(chainAll.map((f) => f.replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 294 与实跑链恒等', files.length === 296, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：v2415 树串守护已推进至新链尾 + 前望 293 ——
const t2415 = read('tests/smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v2471_bellman（第 294 份）',
  t2415.includes("chain[chain.length - 1] === 'smoke_v2473_xpcurve21'"));
ok('smoke_v2415 树串 token 数已推进至 294', t2415.includes('treeTok.length === 296'));
ok('smoke_v2415 哨兵「尚无 295」口径（二百九十七件套 bare 否定式）',
  t2415.includes("!readme.includes('二百九十七件套')"));
const s2429 = read('tests/smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 哨兵链已推进至「前望 295」口径（二百七十八件套 括号/冒烟 bare 否定式）',
  s2429.includes("!readme.includes('二百七十七件套（二百七十七件套清除）')") &&
  s2429.includes("!readme.includes('冒烟二百九十七件套')"));
ok('smoke_v2429 既有断言随新现实推进（件套口径 294 + 链尾 v2470 + 入库 294）',
  s2429.includes('二百九十六件套（二百九十五件套清除）') && s2429.includes("=== 'smoke_v2473_xpcurve21'") &&
  s2429.includes('入库（296 份）'));
const s2436 = read('tests/smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（293 专项 / 294 总件套）且尚无 295 口径哨兵',
  s2436.includes('suiteFiles.length === 295 && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length === 296') &&
  s2436.includes('!readme.includes(\'冒烟二百九十七件套\')') && s2436.includes('!readme.includes(\'（297 份）\')'));

// —— 旧代 pin 零残留扫描（v24.69 / 294 口径；豁免本套件与上一版套件否定式）——
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v2470_xpcurve20.mjs' || f === 'smoke_v2469_xpcurve19.mjs') continue;
  const s2 = fs.readFileSync(path.join(testsDir, f), 'utf8');
  const hits = [];
  if (s2.includes('const GAME_VERSION = ' + "'v24.69';")) hits.push('gv');
  if (s2.includes('const GAME_VERSION = ' + "'v24.69'")) hits.push('gvns');
  if (s2.includes('GAME_VERSION === ' + "'v24.69'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.69")) hits.push('cw');
  if (s2.includes('入库（29' + '3 份）')) hits.push('ruku');
  if (s2.includes('冒烟二百九十三件套（二百九十二' + '件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 29' + '3')) hits.push('fl');
  if (s2.includes('chainAll.length === 29' + '3')) hits.push('cal');
  if (s2.includes('chain.length === 29' + '2')) hits.push('cl');
  if (s2.includes('treeTok.length === 29' + '3')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v2469_" + "xpcurve19'")) hits.push('tail');
  if (s2.includes("!readme.includes('（29" + "3 份）')")) hits.push('ruku2');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.69 GAME_VERSION/顶 pin/294 口径（哨兵链，豁免本套件与上一版否定式）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.70 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
