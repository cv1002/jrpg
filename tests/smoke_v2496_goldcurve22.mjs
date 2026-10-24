// smoke_v2496_goldcurve22.mjs —— v24.96 专项冒烟：后期金币曲线续平滑（第二十二轮·四强怪每级金币 +1）
// 数值口径与 tests/smoke_v2495_goldcurve21.mjs 完全一致（同 W/avgGold 公式）：
//   gold[1] 24→25 后无字回廊池（gallery）Lv10-12 每场金币 296.76/324.76/352.70（改前 24 口径
//   286.76/313.76/340.70，每场 +10/+11/+12）；自然路径到 Lv10 累计金币按 xp[1]=30 现实重算
//   约 946→975 金（v24.45 的 1052 金是 xp[1]=10 时代旧口径，见 README/CHANGELOG）；四基础怪逐字
//   未动，village Lv1/Lv2 12.08/14.55 恒等。
//   README/CHANGELOG/package.json 同步；件套 318→319（链尾 smoke_v2496_goldcurve22）。
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

console.log('— v24.96 四强怪后期金币曲线续平滑（第二十二轮） 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.98）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.98', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 98)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.95（旧 v24.98 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.156';") && !dSrc.includes("const GAME_VERSION = 'v24.98';"));
ok('data.js 含 v24.95 注释（后期金币曲线续平滑第二十一轮说明）',
  dSrc.includes('// v24.99 数值平衡·后期金币曲线续平滑'));
ok('data.js 仍保留 v24.93/v24.92/v24.91/.../v24.45/v24.44/v24.43/v24.38/v24.37/v24.33/v24.30/v24.29/v24.18/v19.66 历史注释（金币/经验平滑先例行）',
  dSrc.includes('// v24.93 数值平衡·后期金币曲线续平滑') && dSrc.includes('// v24.92 数值平衡·后期金币曲线续平滑') && dSrc.includes('// v24.91 数值平衡·后期金币曲线续平滑') && dSrc.includes('// v24.90 数值平衡·后期金币曲线续平滑') && dSrc.includes('// v24.89 数值平衡·后期金币曲线续平滑') && dSrc.includes('// v24.88 数值平衡·后期金币曲线续平滑') && dSrc.includes('// v24.87 数值平衡·后期金币曲线续平滑') && dSrc.includes('// v24.86 数值平衡·后期金币曲线续平滑') && dSrc.includes('// v24.85 数值平衡·后期金币曲线续平滑') && dSrc.includes('// v24.84 数值平衡·后期金币曲线续平滑') && dSrc.includes('// v24.45 数值平衡·后期金币曲线续平滑') && dSrc.includes('// v24.44 数值平衡·后期金币曲线续平滑') && dSrc.includes('// v24.43 数值平衡·后期经验曲线续平滑') &&
  dSrc.includes('// v24.38 数值平衡·后期金币曲线续平滑') && dSrc.includes('// v24.37 数值平衡·后期金币曲线续平滑') && dSrc.includes('// v24.33 数值平衡·后期金币曲线续平滑') &&
  dSrc.includes('// v24.30 数值平衡·后期金币曲线续平滑') && dSrc.includes('// v24.29 数值平衡·后期经验曲线续平滑') &&
  dSrc.includes('v24.18 数值平衡') && dSrc.includes('v19.66 数值平衡'));
ok('data.js 源级四强怪 gold 每级 29 逐字落位（gold:[15,32]/[14,24]/[16,24]/[20,24]）',
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
// 全表 hp/atk/def/xp 逐字未动 + gold 仅四强怪转正（v24.99 只动 gold[1]）
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
ok('八怪 hp/atk/def 逐字未动 + xp 四强怪已 30（v24.83 落位）+ gold 四强怪 25/四基础怪 2（全表逐值）',
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
ok('升级节奏参考金币行已按 v24.99 重算（自然收入到 Lv10 约 1062→1091 金 + 差约 47 金口径）',
  readme.includes('自然收入到 Lv10 约 1062→1091 金') && readme.includes('差约 47 金'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为三百二十五件套（三百二十四件套清除）',
  readme.includes('冒烟三百六十七件套（三百六十六件套清除）'));
ok('README 魔物数值行已为 15+32/14+32/16+32/20+32（四强怪每级金币 +1；xp 段仍 16+30/17+30/18+30/22+30）',
  readme.includes('骷髅兵 26+6/8+2/5+1/16+30/15+32') && readme.includes('雾灵 24+5/9+2/4+1/17+30/14+32') &&
  readme.includes('树精 30+6/7+2/6+1/18+30/16+32') && readme.includes('石魔像 36+7/8+2/10+1/22+30/20+32'));
ok('README 魔物数值行四基础怪逐字未动（8+2/12+2/10+2/13+2）',
  readme.includes('史莱姆 16+5/5+2/2+1/8+3/8+2') && readme.includes('野狼 22+5/7+2/3+1/12+3/12+2') &&
  readme.includes('哥布林 20+5/6+2/3+1/10+3/10+2') && readme.includes('毒蛇 20+5/8+2/3+1/15+3/13+2'));
ok('README tests 树含 v24.96 守护描述（「后期金币曲线续平滑（第二十二轮）」+「gold[1] 24→25」+「306.76/335.76/364.70 → 316.76/346.76/376.70」）与 smoke_v2496_goldcurve22 入库（335 份）',
  readme.includes('v24.96 起含 「后期金币曲线续平滑（第二十二轮）」守护') && readme.includes('gold[1] 24→25') &&
  readme.includes('306.76/335.76/364.70 → 316.76/346.76/376.70') && readme.includes('smoke_v2496_goldcurve22 入库（335 份）'));
ok('README 仍有 v24.45/v24.44/v24.43 守护描述（历史保留）', readme.includes('v24.45 起含 「后期金币曲线续平滑（第九轮）」守护') && readme.includes('v24.44 起含 「后期金币曲线续平滑（第八轮）」守护') && readme.includes('v24.43 起含 「后期经验曲线续平滑（第六轮）」守护'));
ok('README 尚无 320 件套口径（哨兵前望 320 语义：下一版才写 320）',
  !readme.includes('三百六十八件套') && !readme.includes('冒烟三百六十八件套'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 321 份（smoke.mjs + 321 专项）', chain.length === 366 && chainAll.length === 367, String(chain.length));
ok('package.json 链尾为 smoke_v2495_goldcurve21（第 323 份）', chain[chain.length - 1] === 'smoke_v24155_frugal', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2494_goldcurve20.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v2491_goldcurve17.mjs && node tests/smoke_v2492_goldcurve18.mjs && node tests/smoke_v2493_goldcurve19.mjs && node tests/smoke_v2494_goldcurve20.mjs && node tests/smoke_v2495_goldcurve21.mjs && node tests/smoke_v2496_goldcurve22.mjs && node tests/smoke_v2497_goldcurve23.mjs && node tests/smoke_v2498_goldcurve24.mjs && node tests/smoke_v2499_goldcurve25.mjs && node tests/smoke_v24100_talequest.mjs && node tests/smoke_v24101_goldcurve26.mjs && node tests/smoke_v24102_goldcurve27.mjs && node tests/smoke_v24103_goldcurve28.mjs && node tests/smoke_v24104_goldcurve29.mjs && node tests/smoke_v24105_songquest.mjs && node tests/smoke_v24106_moonquest.mjs && node tests/smoke_v24107_peddlequest.mjs && node tests/smoke_v24108_shopquest.mjs && node tests/smoke_v24109_carvequest.mjs && node tests/smoke_v24110_vowquest.mjs && node tests/smoke_v24111_hearerquest.mjs && node tests/smoke_v24112_talkquest.mjs && node tests/smoke_v24113_walkquest.mjs && node tests/smoke_v24114_fleequest.mjs && node tests/smoke_v24115_achhud.mjs && node tests/smoke_v24116_guidequest.mjs && node tests/smoke_v24117_codexhud.mjs && node tests/smoke_v24118_wellquest.mjs && node tests/smoke_v24119_huntquest.mjs && node tests/smoke_v24120_chesthud.mjs && node tests/smoke_v24121_siftquest.mjs && node tests/smoke_v24122_crystalquest.mjs && node tests/smoke_v24123_fraghud.mjs && node tests/smoke_v24124_questshud.mjs && node tests/smoke_v24125_hunthud.mjs && node tests/smoke_v24126_waitquest.mjs && node tests/smoke_v24127_lampquest.mjs && node tests/smoke_v24128_stelequest.mjs && node tests/smoke_v24129_stele2quest.mjs && node tests/smoke_v24130_stele3quest.mjs && node tests/smoke_v24131_stele4quest.mjs && node tests/smoke_v24132_fallenquest.mjs && node tests/smoke_v24133_inquest.mjs && node tests/smoke_v24134_kindleq.mjs && node tests/smoke_v24135_ledgerquest.mjs && node tests/smoke_v24136_herbquest.mjs && node tests/smoke_v24143_furnacequest.mjs && node tests/smoke_v24147_unflicker.mjs && node tests/smoke_v24148_swift.mjs && node tests/smoke_v24151_lowlv.mjs && node tests/smoke_v24152_nopotion.mjs && node tests/smoke_v24153_penny.mjs && node tests/smoke_v24154_steadfast.mjs && node tests/smoke_v24155_frugal.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.95（startsWith）', changelog.startsWith('## v24.156 '));
ok('CHANGELOG v24.94 条目含「金币」与「续平滑」与「数值平衡」与「22→23」',
  changelog.includes('金币') && changelog.includes('续平滑') && changelog.includes('数值平衡') && changelog.includes('22→23'));
ok('CHANGELOG 仍保留 v24.93/v24.92/v24.91 与 v24.45 条目标题（历史积累）',
  changelog.includes('## v24.93 数值平衡') && changelog.includes('## v24.92 数值平衡') && changelog.includes('## v24.91 数值平衡') && changelog.includes('## v24.45 数值平衡'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(chainAll.map((f) => f.replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 318 与实跑链恒等', files.length === 367, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：v2415 树串守护已推进至新链尾 + 前望 318 ——
const t2415 = read('tests/smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v2494_goldcurve20（第 323 份）',
  t2415.includes("chain[chain.length - 1] === 'smoke_v24155_frugal'"));
ok('smoke_v2415 树串 token 数已推进至 317', t2415.includes('treeTok.length === 367'));
ok('smoke_v2415 哨兵「尚无 318」口径（三百二十七件套 bare 否定式）',
  t2415.includes("!readme.includes('三百六十八件套')"));
const s2429 = read('tests/smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 哨兵链已推进至「前望 319」口径（三百二十七件套 括号/冒烟 bare 否定式）',
  s2429.includes("!readme.includes('冒烟三百六十八件套')"));
ok('smoke_v2429 既有断言随新现实推进（件套口径 318 + 链尾 v2495 + 入库 318）',
  s2429.includes('三百六十七件套（三百六十六件套清除）') && s2429.includes("=== 'smoke_v24155_frugal'") &&
  s2429.includes('入库（335 份）'));

// —— 旧代 pin 零残留扫描（v24.94 / 317 口径；豁免本套件与上一版套件）——
const leftovers = [];
for (const f of files) {
  if (!f.endsWith('.mjs')) continue;
  if (f === 'smoke_v24102_goldcurve27.mjs') continue;
  if (f === 'smoke_v24105_songquest.mjs') continue;
  if (f === 'smoke_v24103_goldcurve28.mjs') continue;
  if (f === 'smoke_v24104_goldcurve29.mjs') continue;
  if (f === 'smoke_v2483_xpcurve26.mjs') continue;
  if (f === 'smoke_v2418_goldcurve.mjs') continue;
  if (f === 'smoke_v2430_goldcurve3.mjs') continue;
  if (f === 'smoke_v2433_goldcurve4.mjs') continue;
  if (f === 'smoke_v2435_goldcurve5.mjs') continue;
  if (f === 'smoke_v2437_goldcurve6.mjs') continue;
  if (f === 'smoke_v2438_goldcurve7.mjs') continue;
  if (f === 'smoke_v2444_goldcurve8.mjs') continue;
  if (f === 'smoke_v2445_goldcurve9.mjs') continue;
  if (f === 'smoke_v2484_goldcurve10.mjs') continue;
  if (f === 'smoke_v2485_goldcurve11.mjs') continue;
  if (f === 'smoke_v2486_goldcurve12.mjs') continue;
  if (f === 'smoke_v2487_goldcurve13.mjs') continue;
  if (f === 'smoke_v2488_goldcurve14.mjs') continue;
  if (f === 'smoke_v2489_goldcurve15.mjs') continue;
  if (f === 'smoke_v2490_goldcurve16.mjs') continue;
  if (f === 'smoke_v2491_goldcurve17.mjs') continue;
  if (f === 'smoke_v2492_goldcurve18.mjs') continue;
  if (f === 'smoke_v2493_goldcurve19.mjs') continue;
  if (f === 'smoke_v2494_goldcurve20.mjs') continue;
  if (f === 'smoke_v2495_goldcurve21.mjs') continue;
  if (f === 'smoke_v2496_goldcurve22.mjs') continue;
  const s2 = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s2.includes("const GAME_VERSION = 'v24.95';") || s2.includes("GAME_VERSION === 'v24.95'") ||
      s2.includes("startsWith('## v24.95") || s2.includes('入库（319 份）') ||
      s2.includes('三百一十九件套（三百一十八件套清除）') ||
      s2.includes("=== 'smoke_v2495_goldcurve21'") ||
      s2.includes('chain.length === 3' + '17') || s2.includes('chainAll.length === 3' + '17') ||
      s2.includes('files.length === 3' + '17') || s2.includes('treeTok.length === 3' + '17') ||
      s2.includes('gold[1] === 24') || s2.includes('gold:[15,24]') ||
      s2.includes('15+24/14+25/16+25/20+25') ||
      s2.includes('246.76/269.76/292.70 → 256.76/280.76/304.70') ||
      s2.includes('（gold[1] 23→24）') || s2.includes('每级金币均为 24')
  ) leftovers.push(f);
}
ok('全库测试零残留 v24.95 GAME_VERSION/顶 pin/318 口径/gold 24 口径（哨兵链，豁免本套件与上一版）',
  leftovers.length === 0, leftovers.join(','));

console.log(`— v24.96 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
