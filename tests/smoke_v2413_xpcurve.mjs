// v24.13 专项冒烟：后期经验曲线续平滑——四强怪（骷髅兵/雾灵/树精/石魔像）每级经验 +1（xp[1] 5→6）
// （数值平衡·承 v19.58 经验平滑第二轮：升级需求按 XP_GROW(1.42) 复利增长而怪物经验只随等级线性
// （MON_BASE [基准,每级]），v19.58 把「每级所需场数」从 Lv10-11 的 6.10/8.11 缓到 5.21/6.90 后，
// 同一条曲线在更后段再次越线：加权平均实测（镇/林/矿/廊 × MAPS[].zone 修正）Lv11→12 已达 9.2 场、
// Lv13→14 ≈18.4 场且继续无界膨胀；现按 v19.58 同法把四强怪每级经验再抬 1 点（xp[1] 5→6），
// Lv10-12 每级所需场数 5.20/6.90/9.20 → 4.54/6.01/7.98、Lv13-14 13.0/18.4 → 10.6/14.2，曲线仍严格
// 单调递增（升级本就该变慢）；四基础怪逐字不动、Lv1-2 镇内零变化，hp/atk/def/gold/权重/门槛/区域倍率
// 逐字未动）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.13 注释 / GAME_VERSION v24.13 与旧 v24.12 字面量
// 零残留 / v24.12 历史注释保留）、MON_BASE 运行期八怪全表逐值（四强怪 xp[1]=6 · 四基础怪逐字未动 ·
// hp/atk/def/gold 逐字未动）、曲线单调性与平滑收益（Village 池 Lv1-2 零变化 / Gallery 池加权均场
// Lv10-12 严格递增且低于改前 / XP_GROW·XP_INIT 逐值）、README/package.json/CHANGELOG 同步
// （件套口径 239 + 魔物数值行 16+6/17+6/18+6/22+6 + v24.13 守护描述 + 入库 239 + package 串尾 +
// CHANGELOG 顶 pin）、哨兵链（前望 243 且 README 尚无 239 口径）。
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

console.log('— v24.13 四强怪后期经验曲线续平滑 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（格式合法 + 已越过 v24.12 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.12', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 12)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.21（旧 v24.12 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.74';") && !dSrc.includes("const GAME_VERSION = 'v24.12';"));
ok('data.js 含 v24.13 注释（后期经验曲线续平滑说明）',
  dSrc.includes('// v24.13 数值平衡·后期经验曲线续平滑'));
ok('data.js 仍保留 v24.12 历史注释（胜利画面「⚔️ 身经百战 N/100」进度行说明，累积注释块）',
  dSrc.includes('// v24.12 体验打磨·信息透明·计数现场') || dSrc.includes('BATTLE_GOAL'));
ok('data.js v19.58/v19.66 历史注释保留（经验/金币平滑先例行）',
  dSrc.includes('v19.58 数值平衡') && dSrc.includes('v19.66 数值平衡'));

// —— MON_BASE 运行期逐值 ——
const byName = {};
for (const m of MON_BASE) byName[m.name] = m;
ok('MON_BASE 八怪齐全', MON_BASE.length === 8, String(MON_BASE.length));
const FOUR = ['骷髅兵', '雾灵', '树精', '石魔像'];
const BASE = ['史莱姆', '野狼', '哥布林', '毒蛇'];
ok('四强怪每级经验均为 23（v24.69 第十九轮后 22→23）',
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
// 全表 hp/atk/def/gold（v24.13 只动 xp[1]；v24.18 四强怪 gold[1] 4→5，见 EXPECT）
const EXPECT = {
  '史莱姆': { hp: [16, 5], atk: [5, 2], def: [2, 1], gold: [8, 2] },
  '野狼':   { hp: [22, 5], atk: [7, 2], def: [3, 1], gold: [12, 2] },
  '骷髅兵': { hp: [26, 6], atk: [8, 2], def: [5, 1], gold: [15, 12] },
  '哥布林': { hp: [20, 5], atk: [6, 2], def: [3, 1], gold: [10, 2] },
  '毒蛇':   { hp: [20, 5], atk: [8, 2], def: [3, 1], gold: [13, 2] },
  '雾灵':   { hp: [24, 5], atk: [9, 2], def: [4, 1], gold: [14, 12] },
  '树精':   { hp: [30, 6], atk: [7, 2], def: [6, 1], gold: [16, 12] },
  '石魔像': { hp: [36, 7], atk: [8, 2], def: [10, 1], gold: [20, 12] },
};
ok('八怪 hp/atk/def/xp 逐字未动 + gold 四强怪已 6→7（v24.33 转正）',
  MON_BASE.every((m) => {
    const e = EXPECT[m.name];
    return e && m.hp[0] === e.hp[0] && m.hp[1] === e.hp[1] && m.atk[0] === e.atk[0] && m.atk[1] === e.atk[1] &&
      m.def[0] === e.def[0] && m.def[1] === e.def[1] && m.gold[0] === e.gold[0] && m.gold[1] === e.gold[1];
  }));

// —— 曲线性质：用真实 MON_BASE 权重/池/zone 复算加权均场（与 v24.13 摸底同法）——
const W = (nm, lv) => {
  switch (nm) {
    case '史莱姆': case '哥布林': return Math.max(1, 4 - Math.floor(lv / 2));
    case '野狼': return Math.max(1, 3 - Math.floor(lv / 4));
    case '毒蛇': case '骷髅兵': return lv >= 2 ? 2 + Math.floor(lv / 3) : 1;
    case '雾灵': return 2 + Math.floor(lv / 3);
    default: return 2 + Math.floor(lv / 2);
  }
};
const xpNeededFor = (lv) => { // 升到 lv 累计经验（XP_INIT 起 ×1.42 链式）
  let need = XP_INIT, total = 0;
  for (let i = 1; i < lv; i++) { total += need; need = Math.round(need * XP_GROW); }
  return total;
};
const zoneOf = (name) => {
  const z = MAPS[name] && MAPS[name].zone;
  return z ? { xp: z.xp || 1 } : { xp: 1 };
};
function avgXp(mapKey, lv) {
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
    xs += Math.round((m.xp[0] + m.xp[1] * lv) * z.xp) * w;
  }
  return xs / tw;
}
// 改前基线（xp[1]=6 时，v24.13 二轮后口径）逐值对比
function avgXpBase5(mapKey, lv) {
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
    const per = m.name === '骷髅兵' || m.name === '雾灵' || m.name === '树精' || m.name === '石魔像' ? 6 : m.xp[1];
    xs += Math.round((m.xp[0] + per * lv) * z.xp) * w;
  }
  return xs / tw;
}
const battles = (mapKey, lv) => xpNeededFor(lv + 1) - xpNeededFor(lv) / 1; // 分母在下方
const need = (lv) => (xpNeededFor(lv + 1) - xpNeededFor(lv));
const bNew = (lv) => need(lv) / avgXp('gallery', lv);
const bOld = (lv) => need(lv) / avgXpBase5('gallery', lv);
ok('Gallery 池 Lv10-12 每级所需场数严格单调递增（升级变慢保留）',
  bNew(10) < bNew(11) && bNew(11) < bNew(12), [bNew(10), bNew(11), bNew(12)].map((x) => x.toFixed(2)).join('/'));
ok('Gallery 池 Lv10-12 每级所需场数较改前下降（v24.13 口径 4.03/5.31/7.04 → 3.62/4.77/6.30）',
  bNew(10) < bOld(10) && bNew(11) < bOld(11) && bNew(12) < bOld(12),
  'new=' + [bNew(10), bNew(11), bNew(12)].map((x) => x.toFixed(2)).join('/') + ' old=' + [bOld(10), bOld(11), bOld(12)].map((x) => x.toFixed(2)).join('/'));
ok('Gallery 池 Lv10 改后 1.38-1.50 场窗口（≈1.44 实测口径）',
  bNew(10) > 1.27 && bNew(10) < 1.39, bNew(10).toFixed(2));
ok('Village 池 Lv1-2 单场经验零变化（四基础怪未动，13.2/16.9 口径）',
  avgXp('village', 1) === avgXpBase5('village', 1) && avgXp('village', 2) === avgXpBase5('village', 2),
  avgXp('village', 1).toFixed(1) + '/' + avgXp('village', 2).toFixed(1));
ok('XP_GROW/XP_INIT 逐值未动（1.42 / 20）', XP_GROW === 1.42 && XP_INIT === 20);

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为二百九十七件套（二百九十六件套清除）',
  readme.includes('冒烟二百九十七件套（二百九十六件套清除）'));
ok('README 魔物数值行已为 16+8/17+8/18+8/22+8（v24.29 第三轮四强怪每级经验 +1）',
  readme.includes('骷髅兵 26+6/8+2/5+1/16+25/15+12') && readme.includes('雾灵 24+5/9+2/4+1/17+25/14+12') &&
  readme.includes('树精 30+6/7+2/6+1/18+25/16+12') && readme.includes('石魔像 36+7/8+2/10+1/22+25/20+12'));
ok('README 魔物数值行四基础怪逐字未动（8+3/12+3/10+3/15+3）',
  readme.includes('史莱姆 16+5/5+2/2+1/8+3/8+2') && readme.includes('野狼 22+5/7+2/3+1/12+3/12+2') &&
  readme.includes('哥布林 20+5/6+2/3+1/10+3/10+2') && readme.includes('毒蛇 20+5/8+2/3+1/15+3/13+2'));
ok('README tests 树含 v24.13 守护描述与 smoke_v2413_xpcurve 入库（297 份）',
  readme.includes('v24.13 起含 「后期经验曲线续平滑」守护') && readme.includes('smoke_v2413_xpcurve 入库（297 份）'));
ok('README 尚无 275 件套口径（哨兵前望 275 语义：下一版才写 275）',
  !readme.includes('二百七十七件套（二百七十七件套清除）') && !readme.includes('冒烟二百九十八件套'));
ok('package.json test 串已含 smoke_v2413_xpcurve（第 237 份，紧接 smoke_v2412_battlegoal）',
  pkg.includes('smoke_v2412_battlegoal.mjs && node tests/smoke_v2413_xpcurve.mjs && node tests/smoke_v2414_nightbattle.mjs && node tests/smoke_v2415_treepin.mjs && node tests/smoke_v2416_steps.mjs && node tests/smoke_v2417_mapdrink.mjs && node tests/smoke_v2418_goldcurve.mjs && node tests/smoke_v2419_luckdrp.mjs && node tests/smoke_v2420_skillprog.mjs && node tests/smoke_v2421_allquest.mjs && node tests/smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs && node tests/smoke_v2459_xpcurve9.mjs && node tests/smoke_v2460_xpcurve10.mjs && node tests/smoke_v2461_xpcurve11.mjs && node tests/smoke_v2462_xpcurve12.mjs && node tests/smoke_v2463_xpcurve13.mjs && node tests/smoke_v2464_xpcurve14.mjs && node tests/smoke_v2465_xpcurve15.mjs && node tests/smoke_v2466_xpcurve16.mjs && node tests/smoke_v2467_xpcurve17.mjs && node tests/smoke_v2468_xpcurve18.mjs && node tests/smoke_v2469_xpcurve19.mjs && node tests/smoke_v2470_xpcurve20.mjs && node tests/smoke_v2471_bellman.mjs && node tests/smoke_v2472_bellquest.mjs && node tests/smoke_v2473_xpcurve21.mjs"'));
ok('package.json test 串 smoke_v2413 出现次数为 1', (pkg.match(/smoke_v2413_xpcurve/g) || []).length === 1);
const testsDir0 = path.join(ROOT, 'tests');
const fileCount = fs.readdirSync(testsDir0).filter((f) => f.endsWith('.mjs')).length;
ok('tests 目录件套 = 297（296 + smoke_v2473_xpcurve21 入库）', fileCount === 297, String(fileCount));
ok('CHANGELOG.md 顶部条目已为 v24.21（startsWith）', changelog.startsWith('## v24.74'));
ok('CHANGELOG v24.13 条目含「数值平衡」与「续平滑」',
  changelog.startsWith('## v24.74') && changelog.includes('数值平衡') && changelog.includes('续平滑'));
ok('CHANGELOG 仍保留 v24.12 条目（历史保留）', changelog.includes('## v24.12'));

// —— 哨兵链（旧代 pin 全库零残留：无任何测试再断言 v24.12 GAME_VERSION 字面量）——
const testsDir = path.join(ROOT, 'tests');
const leftovers = [];
for (const f of fs.readdirSync(testsDir)) {
  if (!f.endsWith('.mjs') || f === 'smoke_v2413_xpcurve.mjs') continue;
  const s = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s.includes("const GAME_VERSION = 'v24.12';") || s.includes("GAME_VERSION === 'v24.12'") ||
      s.includes("const GAME_VERSION = 'v24.12'")) leftovers.push(f);
}
ok('旧代 v24.12 GAME_VERSION pin 全库零残留', leftovers.length === 0, leftovers.join(','));

console.log(`\n[XP_CURVE] ${n} 项断言，${failed} 项失败`);
process.exit(failed ? 1 : 0);
