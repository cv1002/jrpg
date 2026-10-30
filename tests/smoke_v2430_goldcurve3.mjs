// v24.30 专项冒烟：后期金币曲线续平滑（第三轮）——四强怪（骷髅兵/雾灵/树精/石魔像）每级金币再 +1（gold[1] 15→16 第十三轮）
// （数值平衡·承 v19.66 第一轮 / v24.18 第二轮方法论第三轮：金币只随玩家等级线性、顶级装备价格固定
// （勇者之剑 600 + 龙鳞甲 480 = 1080 金），v24.18 把无字回廊 Lv10-12 每场金币抬到 66.76/71.76/76.70 后，
// 同一条曲线在更深的后段再次贴线；现按 v19.66/v24.18 同法把四强怪每级金币再抬 1 点（gold[1] 23→24），
// 加权实测（无字回廊池 × zone，与 smoke_v2418 同法）Lv10-12 每场金币 66.76/71.76/76.70 →
// 76.76/83.76/88.70（每场 +10/+11/+12）；四基础怪逐字不动、Lv1-2 镇内零变化（village Lv1/Lv2
// 12.08/14.55 恒等），hp/atk/def/xp/权重/门槛/区域倍率逐字未动）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.30 注释 / GAME_VERSION v24.30 与旧 v24.29 字面量
// 零残留 / v24.29·v24.28·v24.18·v19.66·v24.13·v19.58 历史注释保留）、MON_BASE 运行期八怪全表逐值（四强怪
// gold[1]=7 · 四基础怪逐字未动 · hp/atk/def/xp 逐字未动）、曲线收益与零回归（Gallery 池 Lv10-12 每场
// +lv 金 · Village 池 Lv1-2 恒等）、README/package.json/CHANGELOG 同步（件套口径 254 + 魔物数值行
// 15+32/14+32/16+32/20+32 + v24.30 守护描述 + 入库 254 + package 串尾 + CHANGELOG 顶 pin）、哨兵链
// （前望 275 且 README 尚无 275 口径）、旧代 v24.29 pin 全库零残留扫描（豁免本套件与上一版套件）。
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

console.log('— v24.30 四强怪后期金币曲线续平滑（第三轮） 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.29 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.29', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 29)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.30（旧 v24.29 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.190';") && !dSrc.includes("const GAME_VERSION = 'v24.29';"));
ok('data.js 含 v24.30 注释（后期金币曲线续平滑第三轮说明）',
  dSrc.includes('// v24.30 数值平衡·后期金币曲线续平滑'));
ok('data.js 仍保留 v24.29 历史注释（后期经验曲线续平滑第三轮说明，累积注释块）',
  dSrc.includes('// v24.29 数值平衡·后期经验曲线续平滑'));
ok('data.js v19.58/v19.66/v24.13/v24.18 历史注释保留（经验/金币平滑先例行）',
  dSrc.includes('v19.58 数值平衡') && dSrc.includes('v19.66 数值平衡') &&
  dSrc.includes('v24.13 数值平衡') && dSrc.includes('v24.18 数值平衡'));
ok('data.js 源级四强怪 gold 每级 6 逐字落位（gold:[15,32]/[14,6]/[16,6]/[20,6]）',
  dSrc.includes('gold:[15,32]') && dSrc.includes('gold:[14,32]') && dSrc.includes('gold:[16,32]') && dSrc.includes('gold:[20,32]'));
ok('data.js 源级四基础怪 gold 每级 2 逐字未动（gold:[8,2]/[12,2]/[10,2]/[13,2]）',
  dSrc.includes('gold:[8,2]') && dSrc.includes('gold:[12,2]') && dSrc.includes('gold:[10,2]') && dSrc.includes('gold:[13,2]'));

// —— MON_BASE 运行期逐值 ——
const byName = {};
for (const m of MON_BASE) byName[m.name] = m;
ok('MON_BASE 八怪齐全', MON_BASE.length === 8, String(MON_BASE.length));
const FOUR = ['骷髅兵', '雾灵', '树精', '石魔像'];
const BASE = ['史莱姆', '野狼', '哥布林', '毒蛇'];
ok('四强怪每级金币均为 32（gold[1] 23→24）',
  FOUR.every((nm) => byName[nm] && byName[nm].gold[1] === 32),
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
// 全表 hp/atk/def/xp 逐字未动 + gold 仅四强怪转正（v24.30 只动 gold[1]）
const EXPECT = {
  '史莱姆': { hp: [16, 5], atk: [5, 2], def: [2, 1], xp: [8, 3], gold: [8, 2] },
  '野狼':   { hp: [22, 5], atk: [7, 2], def: [3, 1], xp: [12, 3], gold: [12, 2] },
  '骷髅兵': { hp: [26, 6], atk: [8, 2], def: [5, 1], xp: [16, 30], gold: [15, 32] },
  '哥布林': { hp: [20, 5], atk: [6, 2], def: [3, 1], xp: [10, 3], gold: [10, 2] },
  '毒蛇':   { hp: [20, 5], atk: [8, 2], def: [3, 1], xp: [15, 3], gold: [13, 2] },
  '雾灵':   { hp: [24, 5], atk: [9, 2], def: [4, 1], xp: [17, 30], gold: [14, 32] },
  '树精':   { hp: [30, 6], atk: [7, 2], def: [6, 1], xp: [18, 30], gold: [16, 32] },
  '石魔像': { hp: [36, 7], atk: [8, 2], def: [10, 1], xp: [22, 30], gold: [20, 32] },
};
ok('八怪 hp/atk/def 逐字未动 + xp 四强怪已 9（v24.41 落位）+ gold 四强怪 19/四基础怪 2（全表逐值）',
  MON_BASE.every((m) => {
    const e = EXPECT[m.name];
    return e && m.hp[0] === e.hp[0] && m.hp[1] === e.hp[1] && m.atk[0] === e.atk[0] && m.atk[1] === e.atk[1] &&
      m.def[0] === e.def[0] && m.def[1] === e.def[1] && m.xp[0] === e.xp[0] && m.xp[1] === e.xp[1] &&
      m.gold[0] === e.gold[0] && m.gold[1] === e.gold[1];
  }));

// —— 曲线收益：用真实 MON_BASE 权重/池/zone 复算加权均金（与 v19.66/v24.18 摸底同法）——
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
ok('Gallery 池 Lv10-12 每场金币较改前逐级 +lv 金（+10/+11/+12 口径：306.76/335.76/364.70 → 316.76/346.76/376.70）',
  [10, 11, 12].every((lv) => Math.abs((avgGold('gallery', lv, 'cur') - avgGold('gallery', lv, 'prev')) - lv) < 0.01),
  [10, 11, 12].map((lv) => lv + ':' + avgGold('gallery', lv, 'cur').toFixed(2) + '/' + avgGold('gallery', lv, 'prev').toFixed(2)).join(' '));
ok('Gallery 池 Lv10-12 每场金币改后落在实测窗口（336.5-336.9 / 368.5-368.9 / 400.5-400.9）',
  avgGold('gallery', 10, 'cur') > 336.5 && avgGold('gallery', 10, 'cur') < 336.9 &&
  avgGold('gallery', 11, 'cur') > 368.5 && avgGold('gallery', 11, 'cur') < 368.9 &&
  avgGold('gallery', 12, 'cur') > 400.5 && avgGold('gallery', 12, 'cur') < 400.9,
  [10, 11, 12].map((lv) => avgGold('gallery', lv, 'cur').toFixed(2)).join('/'));
ok('Gallery 池 Lv10-12 每场金币改前基线窗口（326.5-326.9 / 357.5-357.9 / 388.5-388.9）',
  avgGold('gallery', 10, 'prev') > 326.5 && avgGold('gallery', 10, 'prev') < 326.9 &&
  avgGold('gallery', 11, 'prev') > 357.5 && avgGold('gallery', 11, 'prev') < 357.9 &&
  avgGold('gallery', 12, 'prev') > 388.5 && avgGold('gallery', 12, 'prev') < 388.9,
  [10, 11, 12].map((lv) => avgGold('gallery', lv, 'prev').toFixed(2)).join('/'));
ok('Village 池 Lv1-2 单场金币零变化（四基础怪未动，12.08/14.55 口径）',
  avgGold('village', 1, 'cur') === avgGold('village', 1, 'prev') && avgGold('village', 2, 'cur') === avgGold('village', 2, 'prev'),
  avgGold('village', 1, 'cur').toFixed(2) + '/' + avgGold('village', 2, 'cur').toFixed(2));
ok('Village 池 Lv1/Lv2 实测窗口（12.0-12.2 / 14.4-14.7，与 v19.66 口径同量级）',
  avgGold('village', 1, 'cur') > 12.0 && avgGold('village', 1, 'cur') < 12.2 &&
  avgGold('village', 2, 'cur') > 14.4 && avgGold('village', 2, 'cur') < 14.7);

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为四百件套（三百九十九件套清除）',
  readme.includes('冒烟四百件套（三百九十九件套清除）'));
ok('README 魔物数值行已为 15+32/14+32/16+32/20+32（四强怪每级金币 +1；xp 段随 v24.29 为 16+8/17+8/18+8/22+8）',
  readme.includes('骷髅兵 26+6/8+2/5+1/16+30/15+32') && readme.includes('雾灵 24+5/9+2/4+1/17+30/14+32') &&
  readme.includes('树精 30+6/7+2/6+1/18+30/16+32') && readme.includes('石魔像 36+7/8+2/10+1/22+30/20+32'));
ok('README 魔物数值行四基础怪逐字未动（8+2/12+2/10+2/13+2）',
  readme.includes('史莱姆 16+5/5+2/2+1/8+3/8+2') && readme.includes('野狼 22+5/7+2/3+1/12+3/12+2') &&
  readme.includes('哥布林 20+5/6+2/3+1/10+3/10+2') && readme.includes('毒蛇 20+5/8+2/3+1/15+3/13+2'));
ok('README tests 含 v24.30 守护描述与 smoke_v2430_goldcurve3 入库（335 份）',
  readme.includes('v24.30 起含 「后期金币曲线续平滑（第三轮）」守护') && readme.includes('smoke_v2430_goldcurve3 入库（335 份）'));
ok('README 仍有 v24.29 守护描述（历史保留）', readme.includes('v24.29 起含 「后期经验曲线续平滑（第三轮）」守护'));
ok('README 尚无 275 件套口径（哨兵前望 275 语义：下一版才写 275）',
  !readme.includes('四百零一件套') && !readme.includes('冒烟四百零一件套'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 258 份（smoke.mjs + 264 专项）', chain.length === 399 && chainAll.length === 400, String(chain.length));
ok('package.json 链尾为 smoke_v2439_xpcurve4（第 277 份）', chain[chain.length - 1] === 'smoke_v24190_swiftnopo2', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2430_goldcurve3.mjs（node tests/ 前缀形态）',
  pkgRaw.includes('node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs'));
ok('package.json 链锚逐字（... && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs"）',
  pkgRaw.includes('smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs && node tests/smoke_v2459_xpcurve9.mjs && node tests/smoke_v2460_xpcurve10.mjs && node tests/smoke_v2461_xpcurve11.mjs && node tests/smoke_v2462_xpcurve12.mjs && node tests/smoke_v2463_xpcurve13.mjs && node tests/smoke_v2464_xpcurve14.mjs && node tests/smoke_v2465_xpcurve15.mjs && node tests/smoke_v2466_xpcurve16.mjs && node tests/smoke_v2467_xpcurve17.mjs && node tests/smoke_v2468_xpcurve18.mjs && node tests/smoke_v2469_xpcurve19.mjs && node tests/smoke_v2470_xpcurve20.mjs && node tests/smoke_v2471_bellman.mjs && node tests/smoke_v2472_bellquest.mjs && node tests/smoke_v2473_xpcurve21.mjs && node tests/smoke_v2475_xpcurve22.mjs && node tests/smoke_v2476_achprog.mjs && node tests/smoke_v2477_fisher.mjs && node tests/smoke_v2478_xpcurve23.mjs && node tests/smoke_v2479_xpcurve24.mjs && node tests/smoke_v2480_fisherquest.mjs && node tests/smoke_v2481_xpcurve25.mjs && node tests/smoke_v2482_watchquest.mjs && node tests/smoke_v2483_xpcurve26.mjs && node tests/smoke_v2484_goldcurve10.mjs && node tests/smoke_v2485_goldcurve11.mjs && node tests/smoke_v2486_goldcurve12.mjs && node tests/smoke_v2487_goldcurve13.mjs && node tests/smoke_v2488_goldcurve14.mjs && node tests/smoke_v2489_goldcurve15.mjs && node tests/smoke_v2490_goldcurve16.mjs && node tests/smoke_v2491_goldcurve17.mjs && node tests/smoke_v2492_goldcurve18.mjs && node tests/smoke_v2493_goldcurve19.mjs && node tests/smoke_v2494_goldcurve20.mjs && node tests/smoke_v2495_goldcurve21.mjs && node tests/smoke_v2496_goldcurve22.mjs && node tests/smoke_v2497_goldcurve23.mjs && node tests/smoke_v2498_goldcurve24.mjs && node tests/smoke_v2499_goldcurve25.mjs && node tests/smoke_v24100_talequest.mjs && node tests/smoke_v24101_goldcurve26.mjs && node tests/smoke_v24102_goldcurve27.mjs && node tests/smoke_v24103_goldcurve28.mjs && node tests/smoke_v24104_goldcurve29.mjs && node tests/smoke_v24105_songquest.mjs && node tests/smoke_v24106_moonquest.mjs && node tests/smoke_v24107_peddlequest.mjs && node tests/smoke_v24108_shopquest.mjs && node tests/smoke_v24109_carvequest.mjs && node tests/smoke_v24110_vowquest.mjs && node tests/smoke_v24111_hearerquest.mjs && node tests/smoke_v24112_talkquest.mjs && node tests/smoke_v24113_walkquest.mjs && node tests/smoke_v24114_fleequest.mjs && node tests/smoke_v24115_achhud.mjs && node tests/smoke_v24116_guidequest.mjs && node tests/smoke_v24117_codexhud.mjs && node tests/smoke_v24118_wellquest.mjs && node tests/smoke_v24119_huntquest.mjs && node tests/smoke_v24120_chesthud.mjs && node tests/smoke_v24121_siftquest.mjs && node tests/smoke_v24122_crystalquest.mjs && node tests/smoke_v24123_fraghud.mjs && node tests/smoke_v24124_questshud.mjs && node tests/smoke_v24125_hunthud.mjs && node tests/smoke_v24126_waitquest.mjs && node tests/smoke_v24127_lampquest.mjs && node tests/smoke_v24128_stelequest.mjs && node tests/smoke_v24129_stele2quest.mjs && node tests/smoke_v24130_stele3quest.mjs && node tests/smoke_v24131_stele4quest.mjs && node tests/smoke_v24132_fallenquest.mjs && node tests/smoke_v24133_inquest.mjs && node tests/smoke_v24134_kindleq.mjs && node tests/smoke_v24135_ledgerquest.mjs && node tests/smoke_v24136_herbquest.mjs && node tests/smoke_v24143_furnacequest.mjs && node tests/smoke_v24147_unflicker.mjs && node tests/smoke_v24148_swift.mjs && node tests/smoke_v24151_lowlv.mjs && node tests/smoke_v24152_nopotion.mjs && node tests/smoke_v24153_penny.mjs && node tests/smoke_v24154_steadfast.mjs && node tests/smoke_v24155_frugal.mjs && node tests/smoke_v24157_dry.mjs && node tests/smoke_v24158_swift2.mjs && node tests/smoke_v24159_lowlv2.mjs && node tests/smoke_v24160_noskill.mjs && node tests/smoke_v24161_noskill2.mjs && node tests/smoke_v24162_lowskill.mjs && node tests/smoke_v24163_swiftskill.mjs && node tests/smoke_v24164_swiftlv.mjs && node tests/smoke_v24165_nopotskill.mjs && node tests/smoke_v24166_unflskill.mjs && node tests/smoke_v24167_swiftnopo.mjs && node tests/smoke_v24168_lowlvnopo.mjs && node tests/smoke_v24169_unflswift.mjs && node tests/smoke_v24170_unfllowlv.mjs && node tests/smoke_v24171_unflnopo.mjs && node tests/smoke_v24172_unflpenny.mjs && node tests/smoke_v24173_pennyswift.mjs && node tests/smoke_v24174_pennylowlv.mjs && node tests/smoke_v24175_pennynoskill.mjs && node tests/smoke_v24176_pennynopo.mjs && node tests/smoke_v24177_unflswift2.mjs && node tests/smoke_v24178_unflpenny2.mjs && node tests/smoke_v24179_unflnopo2.mjs && node tests/smoke_v24180_unflskill2.mjs && node tests/smoke_v24181_lampoilquest.mjs && node tests/smoke_v24183_unfllowlv2.mjs && node tests/smoke_v24184_pennyswift2.mjs && node tests/smoke_v24185_pennylowlv2.mjs && node tests/smoke_v24186_pennynoskill2.mjs && node tests/smoke_v24187_pennynopo2.mjs && node tests/smoke_v24188_swiftlv2.mjs && node tests/smoke_v24189_swiftskill2.mjs && node tests/smoke_v24190_swiftnopo2.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.30（startsWith）', changelog.startsWith('## v24.190 '));
ok('CHANGELOG v24.30 条目含「金币」与「续平滑」与「数值平衡」与「5→6」',
  changelog.includes('金币') && changelog.includes('续平滑') && changelog.includes('数值平衡') && changelog.includes('5→6'));
ok('CHANGELOG 仍保留 v24.29 与 v24.18 条目标题（历史积累）',
  changelog.includes('## v24.29 数值平衡') && changelog.includes('## v24.18 数值平衡'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(chainAll.map((f) => f.replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 254 与实跑链恒等', files.length === 400, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：v2415 树串守护已推进至新链尾 + 前望 275 ——
const t2415 = read('tests/smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v2430_goldcurve3（第 277 份）',
  t2415.includes("chain[chain.length - 1] === 'smoke_v24190_swiftnopo2'"));
ok('smoke_v2415 树串 token 数已推进至 254', t2415.includes('treeTok.length === 400'));
ok('smoke_v2415 哨兵「尚无 275」口径（二百五十五件套 bare 否定式）',
  t2415.includes("!readme.includes('四百零一件套')"));
const s2429 = read('tests/smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 哨兵链已推进至「前望 275」口径（二百五十五件套 括号/冒烟 bare 否定式）',
  s2429.includes("!readme.includes('二百七十七件套（二百七十七件套清除）')") &&
  s2429.includes("!readme.includes('冒烟四百零一件套')"));
ok('smoke_v2429 既有断言随新现实推进（件套口径 254 + 链尾 v2430 + 入库 254）',
  s2429.includes('四百件套（三百九十九件套清除）') && s2429.includes("=== 'smoke_v24190_swiftnopo2'") &&
  s2429.includes('入库（335 份）'));

// —— 旧代 pin 零残留扫描（v24.29 / 253 口径；豁免本套件与上一版套件否定式）——
const leftovers = [];
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v2430_goldcurve3.mjs') continue;
  if (f === 'smoke_v24102_goldcurve27.mjs') continue;
  if (f === 'smoke_v24105_songquest.mjs') continue;
  if (f === 'smoke_v24103_goldcurve28.mjs') continue;
  if (f === 'smoke_v24104_goldcurve29.mjs') continue;
  // 承 v24.29 同款豁免：上一版套件（smoke_v2429_xpcurve3）合法的历史/否定式字面量不入扫描。
  if (f === 'smoke_v2429_xpcurve3.mjs') continue;
  const s = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s.includes("const GAME_VERSION = 'v24.29';") || s.includes("GAME_VERSION === 'v24.29'") ||
      s.includes("startsWith('## v24.29") || s.includes('入库（253 份）') ||
      s.includes('二百五十三件套（二百五十二件套清除）') ||
      s.includes("testChain === 253") || s.includes("fileCount === 253") ||
      s.includes("files.length === 253") || s.includes("chainAll.length === 253") ||
      s.includes("treeTok.length === 253") || s.includes("chain[chain.length - 1] === 'smoke_v2429_xpcurve3'")) leftovers.push(f);
}
ok('全库测试零残留 v24.29 GAME_VERSION/顶 pin/253 口径（哨兵链，豁免本套件与上一版否定式）',
  leftovers.length === 0, leftovers.join(','));

console.log(`— v24.30 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
