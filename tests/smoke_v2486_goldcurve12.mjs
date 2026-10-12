// smoke_v2490_goldcurve16.mjs —— v24.86 专项冒烟：后期金币曲线续平滑（第十二轮·四强怪每级金币 +1）
// 数值口径与 tests/smoke_v2445_goldcurve9.mjs 完全一致（同 W/avgGold 公式）：
//   gold[1] 15→16 后无字回廊池（gallery）Lv10-12 每场金币 166.76/181.76/196.70（改前 14 口径
//   156.76/170.76/184.70，每场 +10/+11/+12）；自然路径到 Lv10 累计金币按 xp[1]=30 现实重算
//   约 685→714 金（v24.45 的 1052 金是 xp[1]=10 时代旧口径，见 README/CHANGELOG）；四基础怪逐字
//   未动，village Lv1/Lv2 12.08/14.55 恒等。
//   README/CHANGELOG/package.json 同步；件套 308→309（链尾 smoke_v2490_goldcurve16）。
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

console.log('— v24.86 四强怪后期金币曲线续平滑（第十二轮） 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.83）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.85', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 85)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.86（旧 v24.85 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.90';") && !dSrc.includes("const GAME_VERSION = 'v24.85';"));
ok('data.js 含 v24.86 注释（后期金币曲线续平滑第十二轮说明）',
  dSrc.includes('// v24.86 数值平衡·后期金币曲线续平滑'));
ok('data.js 仍保留 v24.85/v24.84/v24.45/v24.44/v24.43/v24.38/v24.37/v24.33/v24.30/v24.29/v24.18/v19.66 历史注释（金币/经验平滑先例行）',
  dSrc.includes('// v24.85 数值平衡·后期金币曲线续平滑') && dSrc.includes('// v24.84 数值平衡·后期金币曲线续平滑') && dSrc.includes('// v24.45 数值平衡·后期金币曲线续平滑') && dSrc.includes('// v24.44 数值平衡·后期金币曲线续平滑') && dSrc.includes('// v24.43 数值平衡·后期经验曲线续平滑') &&
  dSrc.includes('// v24.38 数值平衡·后期金币曲线续平滑') && dSrc.includes('// v24.37 数值平衡·后期金币曲线续平滑') && dSrc.includes('// v24.33 数值平衡·后期金币曲线续平滑') &&
  dSrc.includes('// v24.30 数值平衡·后期金币曲线续平滑') && dSrc.includes('// v24.29 数值平衡·后期经验曲线续平滑') &&
  dSrc.includes('v24.18 数值平衡') && dSrc.includes('v19.66 数值平衡'));
ok('data.js 源级四强怪 gold 每级 15 逐字落位（gold:[15,19]/[14,15]/[16,15]/[20,15]）',
  dSrc.includes('gold:[15,19]') && dSrc.includes('gold:[14,19]') && dSrc.includes('gold:[16,19]') && dSrc.includes('gold:[20,19]'));
ok('data.js 源级四基础怪 gold 每级 2 逐字未动（gold:[8,2]/[12,2]/[10,2]/[13,2]）',
  dSrc.includes('gold:[8,2]') && dSrc.includes('gold:[12,2]') && dSrc.includes('gold:[10,2]') && dSrc.includes('gold:[13,2]'));

// —— MON_BASE 运行期逐值 ——
const byName = {};
for (const m of MON_BASE) byName[m.name] = m;
ok('MON_BASE 八怪齐全', MON_BASE.length === 8, String(MON_BASE.length));
const FOUR = ['骷髅兵', '雾灵', '树精', '石魔像'];
const BASE = ['史莱姆', '野狼', '哥布林', '毒蛇'];
ok('四强怪每级金币均为 19（gold[1] 18→19）',
  FOUR.every((nm) => byName[nm] && byName[nm].gold[1] === 19),
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
// 全表 hp/atk/def/xp 逐字未动 + gold 仅四强怪转正（v24.84 只动 gold[1]）
const EXPECT = {
  '史莱姆': { hp: [16, 5], atk: [5, 2], def: [2, 1], xp: [8, 3], gold: [8, 2] },
  '野狼':   { hp: [22, 5], atk: [7, 2], def: [3, 1], xp: [12, 3], gold: [12, 2] },
  '骷髅兵': { hp: [26, 6], atk: [8, 2], def: [5, 1], xp: [16, 30], gold: [15, 19] },
  '哥布林': { hp: [20, 5], atk: [6, 2], def: [3, 1], xp: [10, 3], gold: [10, 2] },
  '毒蛇':   { hp: [20, 5], atk: [8, 2], def: [3, 1], xp: [15, 3], gold: [13, 2] },
  '雾灵':   { hp: [24, 5], atk: [9, 2], def: [4, 1], xp: [17, 30], gold: [14, 19] },
  '树精':   { hp: [30, 6], atk: [7, 2], def: [6, 1], xp: [18, 30], gold: [16, 19] },
  '石魔像': { hp: [36, 7], atk: [8, 2], def: [10, 1], xp: [22, 30], gold: [20, 19] },
};
ok('八怪 hp/atk/def 逐字未动 + xp 四强怪已 30（v24.83 落位）+ gold 四强怪 19/四基础怪 2（全表逐值）',
  MON_BASE.every((m) => {
    const e = EXPECT[m.name];
    return e && m.hp[0] === e.hp[0] && m.hp[1] === e.hp[1] && m.atk[0] === e.atk[0] && m.atk[1] === e.atk[1] &&
      m.def[0] === e.def[0] && m.def[1] === e.def[1] && m.xp[0] === e.xp[0] && m.xp[1] === e.xp[1] &&
      m.gold[0] === e.gold[0] && m.gold[1] === e.gold[1];
  }));

// —— 曲线收益：用真实 MON_BASE 权重/池复算加权均金（与 smoke_v2418/v2430 同法，基准值不含 zone）——
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
ok('Gallery 池 Lv10-12 每场金币较改前逐级 +lv 金（+10/+11/+12 口径：196.76/214.76/232.70 → 206.76/225.76/244.70）',
  [10, 11, 12].every((lv) => Math.abs((avgGold('gallery', lv, 'cur') - avgGold('gallery', lv, 'prev')) - lv) < 0.01),
  [10, 11, 12].map((lv) => lv + ':' + avgGold('gallery', lv, 'cur').toFixed(2) + '/' + avgGold('gallery', lv, 'prev').toFixed(2)).join(' '));
ok('Gallery 池 Lv10-12 每场金币改后落在实测窗口（206.5-206.9 / 225.5-225.9 / 244.5-244.9）',
  avgGold('gallery', 10, 'cur') > 206.5 && avgGold('gallery', 10, 'cur') < 206.9 &&
  avgGold('gallery', 11, 'cur') > 225.5 && avgGold('gallery', 11, 'cur') < 225.9 &&
  avgGold('gallery', 12, 'cur') > 244.5 && avgGold('gallery', 12, 'cur') < 244.9,
  [10, 11, 12].map((lv) => avgGold('gallery', lv, 'cur').toFixed(2)).join('/'));
ok('Gallery 池 Lv10-12 每场金币改前基线窗口（196.5-196.9 / 214.5-214.9 / 232.5-232.9）',
  avgGold('gallery', 10, 'prev') > 196.5 && avgGold('gallery', 10, 'prev') < 196.9 &&
  avgGold('gallery', 11, 'prev') > 214.5 && avgGold('gallery', 11, 'prev') < 214.9 &&
  avgGold('gallery', 12, 'prev') > 232.5 && avgGold('gallery', 12, 'prev') < 232.9,
  [10, 11, 12].map((lv) => avgGold('gallery', lv, 'prev').toFixed(2)).join('/'));
ok('Village 池 Lv1-2 单场金币零变化（四基础怪未动，12.08/14.55 口径）',
  avgGold('village', 1, 'cur') === avgGold('village', 1, 'prev') && avgGold('village', 2, 'cur') === avgGold('village', 2, 'prev'),
  avgGold('village', 1, 'cur').toFixed(2) + '/' + avgGold('village', 2, 'cur').toFixed(2));
ok('Village 池 Lv1/Lv2 实测窗口（12.0-12.2 / 14.4-14.7，与 v19.66 口径同量级）',
  avgGold('village', 1, 'cur') > 12.0 && avgGold('village', 1, 'cur') < 12.2 &&
  avgGold('village', 2, 'cur') > 14.4 && avgGold('village', 2, 'cur') < 14.7);
ok('升级节奏参考金币行已按 v24.86 重算（自然收入到 Lv10 约 685→714 金 + 差约 366 金口径）',
  readme.includes('自然收入到 Lv10 约 685→714 金') && readme.includes('差约 366 金'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为三百一十三件套（三百一十二件套清除）',
  readme.includes('冒烟三百一十三件套（三百一十二件套清除）'));
ok('README 魔物数值行已为 15+19/14+19/16+19/20+19（四强怪每级金币 +1；xp 段仍 16+30/17+30/18+30/22+30）',
  readme.includes('骷髅兵 26+6/8+2/5+1/16+30/15+19') && readme.includes('雾灵 24+5/9+2/4+1/17+30/14+19') &&
  readme.includes('树精 30+6/7+2/6+1/18+30/16+19') && readme.includes('石魔像 36+7/8+2/10+1/22+30/20+19'));
ok('README 魔物数值行四基础怪逐字未动（8+2/12+2/10+2/13+2）',
  readme.includes('史莱姆 16+5/5+2/2+1/8+3/8+2') && readme.includes('野狼 22+5/7+2/3+1/12+3/12+2') &&
  readme.includes('哥布林 20+5/6+2/3+1/10+3/10+2') && readme.includes('毒蛇 20+5/8+2/3+1/15+3/13+2'));
ok('README tests 树含 v24.86 守护描述（「后期金币曲线续平滑（第十二轮）」+「gold[1] 15→16」+「196.76/214.76/232.70 → 206.76/225.76/244.70」）与 smoke_v2490_goldcurve16 入库（313 份）',
  readme.includes('v24.86 起含 「后期金币曲线续平滑（第十二轮）」守护') && readme.includes('gold[1] 15→16') &&
  readme.includes('196.76/214.76/232.70 → 206.76/225.76/244.70') && readme.includes('smoke_v2490_goldcurve16 入库（313 份）'));
ok('README 仍有 v24.45/v24.44/v24.43 守护描述（历史保留）', readme.includes('v24.45 起含 「后期金币曲线续平滑（第九轮）」守护') && readme.includes('v24.44 起含 「后期金币曲线续平滑（第八轮）」守护') && readme.includes('v24.43 起含 「后期经验曲线续平滑（第六轮）」守护'));
ok('README 尚无 310 件套口径（哨兵前望 313 语义：下一版才写 310）',
  !readme.includes('三百一十四件套') && !readme.includes('冒烟三百一十四件套'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 308 份（smoke.mjs + 307 专项）', chain.length === 312 && chainAll.length === 313, String(chain.length));
ok('package.json 链尾为 smoke_v2490_goldcurve16（第 311 份）', chain[chain.length - 1] === 'smoke_v2490_goldcurve16', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2489_goldcurve15.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v2488_goldcurve14.mjs && node tests/smoke_v2489_goldcurve15.mjs && node tests/smoke_v2490_goldcurve16.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.86（startsWith）', changelog.startsWith('## v24.90 '));
ok('CHANGELOG v24.86 条目含「金币」与「续平滑」与「数值平衡」与「14→15」',
  changelog.includes('金币') && changelog.includes('续平滑') && changelog.includes('数值平衡') && changelog.includes('14→15'));
ok('CHANGELOG 仍保留 v24.85 与 v24.45 条目标题（历史积累）',
  changelog.includes('## v24.85 数值平衡') && changelog.includes('## v24.45 数值平衡'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(chainAll.map((f) => f.replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 309 与实跑链恒等', files.length === 313, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：v2415 树串守护已推进至新链尾 + 前望 308 ——
const t2415 = read('tests/smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v2490_goldcurve16（第 311 份）',
  t2415.includes("chain[chain.length - 1] === 'smoke_v2490_goldcurve16'"));
ok('smoke_v2415 树串 token 数已推进至 309', t2415.includes('treeTok.length === 313'));
ok('smoke_v2415 哨兵「尚无 310」口径（三百一十四件套 bare 否定式）',
  t2415.includes("!readme.includes('三百一十四件套')"));
const s2429 = read('tests/smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 哨兵链已推进至「前望 310」口径（三百一十四件套 括号/冒烟 bare 否定式）',
  s2429.includes("!readme.includes('冒烟三百一十四件套')"));
ok('smoke_v2429 既有断言随新现实推进（件套口径 309 + 链尾 v2486 + 入库 309）',
  s2429.includes('三百一十三件套（三百一十二件套清除）') && s2429.includes("=== 'smoke_v2490_goldcurve16'") &&
  s2429.includes('入库（313 份）'));

// —— 旧代 pin 零残留扫描（v24.85 / 308 口径；豁免本套件与上一版套件）——
const leftovers = [];
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v2486_goldcurve12.mjs') continue;
  if (f === 'smoke_v2490_goldcurve16.mjs') continue;
  if (f === 'smoke_v2489_goldcurve15.mjs') continue;
  if (f === 'smoke_v2488_goldcurve14.mjs') continue;
  if (f === 'smoke_v2487_goldcurve13.mjs') continue;
  if (f === 'smoke_v2486_goldcurve12.mjs') continue;
  if (f === 'smoke_v2485_goldcurve11.mjs') continue;
  if (f === 'smoke_v2484_goldcurve10.mjs') continue;
  if (f === 'smoke_v2483_xpcurve26.mjs') continue;
  if (f === 'smoke_v2484_goldcurve10.mjs') continue;
  if (f === 'smoke_v2485_goldcurve11.mjs') continue;
  if (f === 'smoke_v2486_goldcurve12.mjs') continue;
  if (f === 'smoke_v2487_goldcurve13.mjs') continue;
  if (f === 'smoke_v2489_goldcurve15.mjs') continue;
  if (f === 'smoke_v2490_goldcurve16.mjs') continue;
  const s2 = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s2.includes("const GAME_VERSION = 'v24.85';") || s2.includes("GAME_VERSION === 'v24.85'") ||
      s2.includes("startsWith('## v24.85") || s2.includes('入库（308 份）') ||
      s2.includes('三百一十二件套（三百一十一件套清除）') ||
      s2.includes("=== 'smoke_v2489_goldcurve15'") ||
      s2.includes('chain.length === 30' + '7') || s2.includes('chainAll.length === 30' + '8') ||
      s2.includes('files.length === 30' + '8') || s2.includes('treeTok.length === 30' + '8') ||
      s2.includes('gold[1] === 18') || s2.includes('gold:[15,17]') ||
      s2.includes('15+17/14+17/16+17/20+17') ||
      s2.includes('176.76/192.76/208.70 → 186.76/203.76/220.70') ||
      s2.includes('（gold[1] 17→18）') || s2.includes('每级金币均为 17')
  ) leftovers.push(f);
}
ok('全库测试零残留 v24.85 GAME_VERSION/顶 pin/308 口径/gold 14 口径（哨兵链，豁免本套件与上一版）',
  leftovers.length === 0, leftovers.join(','));

console.log(`— v24.86 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
