// smoke_v2479_xpcurve24.mjs — v24.79 专项冒烟：后期经验曲线续平滑（第二十四轮·四强怪每级经验 +1）
// 数值口径与 tests/smoke_v2478_xpcurve23.mjs 完全一致（同 W/xpNeededFor/zoneOf/avgXp/need 公式）：
//   xp[1] 27→28 后无字回廊池（gallery）Lv10-15 的每场加权经验 400.59/424.88/461.10/497.50/534.00/570.43，
//   Lv10-15 每级升级所需场数 1.20/1.56/2.04/2.68/3.55/4.72（改前 27 口径 1.24/1.61/2.11/2.78/3.67/4.89，
//   每级 -0.04~-0.17 场、累计 16.30→15.75 场），曲线仍严格单调递增；雾语林 Lv5→6 0.78→0.76 场（显示
//   「约 0.8」不变）、星井矿脉 Lv9→10 1.41→1.36 场（显示「约 1.4」不变）、无字回廊 Lv11→12 1.61→1.56
//   场（显示「约 1.6」不变）；四基础怪零变化，village Lv1/Lv2 13.25/16.91 恒等。
//   README/CHANGELOG/package.json 同步；件套 301→302（链尾 smoke_v2479_xpcurve24）。
import { MON_BASE, XP_GROW, XP_INIT, MAPS } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let pass = 0, fail = 0;
function ok(name, cond, extra = '') {
  if (cond) { pass++; }
  else { fail++; console.log('  ✗ ' + name + (extra ? ' — ' + extra : '')); }
}

const dSrc = fs.readFileSync(path.join(__dirname, '../js/data.js'), 'utf8');
const readme = fs.readFileSync(path.join(__dirname, '../README.md'), 'utf8');
const changelog = fs.readFileSync(path.join(__dirname, '../CHANGELOG.md'), 'utf8');
const pkgRaw = fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8');

// —— data.js 版本与注释 ——
ok('data.js GAME_VERSION 字面量已为 v24.79（旧 v24.78 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.123';") && !dSrc.includes("const GAME_VERSION = 'v24.78';"));
ok('data.js 含 v24.79 注释（后期经验曲线续平滑第二十四轮说明）',
  dSrc.includes('// v24.79 数值平衡·后期经验曲线续平滑'));
ok('data.js 保留 v24.78/v24.75 历史注释（第二十三轮/第二十二轮方法论零丢失）',
  dSrc.includes('// v24.78 数值平衡·后期经验曲线续平滑') && dSrc.includes('// v24.75 数值平衡·后期经验曲线续平滑'));
// 源级锚：本轮 xp[1] 27→28 逐字落位（v24.78 第二十三轮已为 27 口径）
ok('data.js 源级四强怪 xp 每级 28 逐字落位（xp:[16,30]/xp:[17,30]/xp:[18,30]/xp:[22,30]）',
  dSrc.includes('xp:[16,30]') && dSrc.includes('xp:[17,30]') && dSrc.includes('xp:[18,30]') && dSrc.includes('xp:[22,30]'));

// —— MON_BASE 结构 ——
const FOUR = ['骷髅兵', '雾灵', '树精', '石魔像'];
const BASE4 = ['史莱姆', '野狼', '哥布林', '毒蛇'];
const byName = Object.fromEntries(MON_BASE.map((m) => [m.name, m]));
ok('四强怪每级经验均为 29（xp[1] 29→30 第二十六轮）', FOUR.every((nm) => byName[nm] && byName[nm].xp[1] === 30));
ok('四基础怪 xp 逐字未动（史莱姆/野狼/哥布林/毒蛇 xp 仍为 [8,3]/[12,3]/[10,3]/[15,3]）',
  BASE4.every((nm) => byName[nm]) && byName['史莱姆'].xp.join() === '8,3' && byName['野狼'].xp.join() === '12,3'
  && byName['哥布林'].xp.join() === '10,3' && byName['毒蛇'].xp.join() === '15,3');

// —— 升级曲线（与 smoke_v2475 同法；perOverride 27=改后 26=改前） ——
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
const zoneOf = (name) => { const z = MAPS[name] && MAPS[name].zone; return z ? { xp: z.xp || 1 } : { xp: 1 }; };
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
const bNew = (lv) => need(lv) / avgXp('gallery', lv, 28);
const bOld = (lv) => need(lv) / avgXp('gallery', lv, 27);

ok('XP 阈值链逐值未动（Lv11 466 · Lv12 662 · Lv13 940 · Lv14 1335 · Lv15 1896 · Lv16 2692）',
  need(10) === 466 && need(11) === 662 && need(12) === 940 && need(13) === 1335 && need(14) === 1896 && need(15) === 2692,
  [need(10), need(11), need(12), need(13), need(14), need(15)].join('/'));
ok('经验曲线仍单调递增（Lv10-15 每场所需场数 1.20<1.56<2.04<2.68<3.55<4.72）',
  bNew(10) < bNew(11) && bNew(11) < bNew(12) && bNew(12) < bNew(13) && bNew(13) < bNew(14) && bNew(14) < bNew(15));
ok('xp[1] 27→28 后每场升级场数缓速（Lv10-15 窗口 1.14-1.26/1.50-1.62/1.98-2.10/2.62-2.74/3.49-3.61/4.66-4.78）',
  bNew(10) > 1.14 && bNew(10) < 1.26 && bNew(11) > 1.50 && bNew(11) < 1.62 && bNew(12) > 1.98 && bNew(12) < 2.10
  && bNew(13) > 2.62 && bNew(13) < 2.74 && bNew(14) > 3.49 && bNew(14) < 3.61 && bNew(15) > 4.66 && bNew(15) < 4.78,
  [bNew(10), bNew(11), bNew(12), bNew(13), bNew(14), bNew(15)].map((x) => x.toFixed(2)).join('/'));
ok('改前口径 27 仍在预期窗（Lv14 3.61-3.73 · Lv15 4.83-4.95）',
  bOld(14) > 3.61 && bOld(14) < 3.73 && bOld(15) > 4.83 && bOld(15) < 4.95);
ok('avgXp gallery Lv10/11/12（xp[1]=28 口径）≈400.59/424.88/461.10',
  avgXp('gallery', 10, 28) > 388.4 && avgXp('gallery', 10, 28) < 388.8
  && avgXp('gallery', 11, 28) > 424.7 && avgXp('gallery', 11, 28) < 425.1
  && avgXp('gallery', 12, 28) > 460.9 && avgXp('gallery', 12, 28) < 461.3);
ok('village Lv1/Lv2 每场经验 13.25/16.91 恒等（四基础怪未动 → 镇内节奏零变化）',
  Math.abs(avgXp('village', 1) - 13.25) < 0.01 && Math.abs(avgXp('village', 2) - 16.91) < 0.01);
ok('dungeon Lv3-4 单场经验较改前上浮且仅来自四强怪（61.25/88.70 口径）',
  Math.abs(avgXp('dungeon', 3) - 64.25) < 0.01 && Math.abs(avgXp('dungeon', 4) - 93.57) < 0.01);
ok('XP_GROW 1.42 / XP_INIT 20 逐字未动（节奏公式单一数据源）', XP_GROW === 1.42 && XP_INIT === 20);

// —— README ——
ok('README 件套口径已为三百四十六件套（三百四十五件套清除）',
  readme.includes('冒烟三百四十六件套（三百四十五件套清除）'));
ok('README 魔物数值行（骷髅兵）已为 16+29（金币 15+12 未动）', readme.includes('骷髅兵 26+6/8+2/5+1/16+30/15+32'));
ok('README 魔物数值行（雾灵）已为 17+28（金币 14+12 未动）', readme.includes('雾灵 24+5/9+2/4+1/17+30/14+32'));
ok('README 魔物数值行（树精）已为 18+28（金币 16+12 未动）', readme.includes('树精 30+6/7+2/6+1/18+30/16+32'));
ok('README 魔物数值行（石魔像）已为 22+28（金币 20+12 未动）', readme.includes('石魔像 36+7/8+2/10+1/22+30/20+32'));
ok('README 四基础怪逐字未动',
  readme.includes('史莱姆 16+5/5+2/2+1/8+3/8+2') && readme.includes('野狼 22+5/7+2/3+1/12+3/12+2')
  && readme.includes('哥布林 20+5/6+2/3+1/10+3/10+2') && readme.includes('毒蛇 20+5/8+2/3+1/15+3/13+2'));
ok('README 升级节奏参考段落已按 v24.79 刷新口径（Lv5→6 约 0.8 场 / Lv9→10 约 1.4 场 / Lv11→12 约 1.6 场，Lv13+ 每级 2.5-4.5 场）',
  readme.includes('Lv5→6 约 0.7 场（雾语林）') && readme.includes('Lv9→10 约 1.3 场（星井矿脉）')
  && readme.includes('Lv11→12 约 1.5 场（无字回廊）') && readme.includes('Lv13+ 每级 2.5-4.5 场'));
ok('README 金币口径未动（约 946→975 金 + Lv5→6 ≈2.1 + Lv11→12 ≈7.0）',
  readme.includes('金币自然收入到 Lv10 约 1062→1091 金') && readme.includes('Lv5→6 ≈2.1') && readme.includes('Lv11→12 ≈7.0'));
ok('README 历史叙述含二十六轮经验再平滑 + v24.90 复核', readme.includes('二十六轮经验再平滑') && readme.includes('v24.104 复核'));
ok('README tests 树含 v24.79 守护描述（「后期经验曲线续平滑（第二十四轮）」+「xp[1] 27→28」+「Lv10→11 1.24→1.20…」+「Lv5→6 0.78→0.76」）与 smoke_v2479_xpcurve24 入库（335 份）',
  readme.includes('v24.79 起含 「后期经验曲线续平滑（第二十四轮）」守护') && readme.includes('xp[1] 27→28')
  && readme.includes('Lv10→11 1.24→1.20') && readme.includes('Lv5→6 0.78→0.76') && readme.includes('smoke_v2479_xpcurve24 入库（335 份）'));
ok('README 仍保留 v24.78/v24.75/v24.70 早期 xp 守护描述（历史零丢失）',
  readme.includes('v24.78 起含 「后期经验曲线续平滑（第二十三轮）」守护') && readme.includes('v24.75 起含 「后期经验曲线续平滑（第二十二轮）」守护') && readme.includes('v24.70 起含 「后期经验曲线续平滑（第二十轮）」守护'));
ok('README tests 树串尾已延伸至 smoke_v2475_xpcurve22 + smoke_v2476_achprog + smoke_v2477_fisher + smoke_v2478_xpcurve23 + smoke_v2479_xpcurve24 + smoke_v2480_fisherquest + smoke_v2481_xpcurve25 + smoke_v2482_watchquest + smoke_v2483_xpcurve26 + smoke_v2484_goldcurve10 + smoke_v2485_goldcurve11 + smoke_v2486_goldcurve12 + smoke_v2487_goldcurve13 + smoke_v2488_goldcurve14 + smoke_v2489_goldcurve15 + smoke_v2490_goldcurve16 + smoke_v2491_goldcurve17 + smoke_v2492_goldcurve18 + smoke_v2493_goldcurve19 + smoke_v2494_goldcurve20 + smoke_v2495_goldcurve21 + smoke_v2496_goldcurve22 + smoke_v2497_goldcurve23 + smoke_v2498_goldcurve24 + smoke_v2499_goldcurve25 + smoke_v24100_talequest + smoke_v24101_goldcurve26 + smoke_v24102_goldcurve27 + smoke_v24103_goldcurve28 + smoke_v24104_goldcurve29 + smoke_v24105_songquest + smoke_v24106_moonquest + smoke_v24107_peddlequest + smoke_v24108_shopquest + smoke_v24109_carvequest + smoke_v24110_vowquest + smoke_v24111_hearerquest + smoke_v24112_talkquest + smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud（npm test 串跑）',
  readme.includes('smoke_v2475_xpcurve22 + smoke_v2476_achprog + smoke_v2477_fisher + smoke_v2478_xpcurve23 + smoke_v2479_xpcurve24 + smoke_v2480_fisherquest + smoke_v2481_xpcurve25 + smoke_v2482_watchquest + smoke_v2483_xpcurve26 + smoke_v2484_goldcurve10 + smoke_v2485_goldcurve11 + smoke_v2486_goldcurve12 + smoke_v2487_goldcurve13 + smoke_v2488_goldcurve14 + smoke_v2489_goldcurve15 + smoke_v2490_goldcurve16 + smoke_v2491_goldcurve17 + smoke_v2492_goldcurve18 + smoke_v2493_goldcurve19 + smoke_v2494_goldcurve20 + smoke_v2495_goldcurve21 + smoke_v2496_goldcurve22 + smoke_v2497_goldcurve23 + smoke_v2498_goldcurve24 + smoke_v2499_goldcurve25 + smoke_v24100_talequest + smoke_v24101_goldcurve26 + smoke_v24102_goldcurve27 + smoke_v24103_goldcurve28 + smoke_v24104_goldcurve29 + smoke_v24105_songquest + smoke_v24106_moonquest + smoke_v24107_peddlequest + smoke_v24108_shopquest + smoke_v24109_carvequest + smoke_v24110_vowquest + smoke_v24111_hearerquest + smoke_v24112_talkquest + smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud（npm test 串跑）'));
ok('README 尚无三百一十四件套口径（哨兵前望 303 语义：下一版才写 303）',
  !readme.includes('三百四十七件套') && !readme.includes('冒烟三百四十七件套'));

// —— package.json 链 ——
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 301 专项（smoke.mjs + 301 专项 = 302 总件套），链长计数精确匹配',
  chain.length === 345 && chainAll.length === 346,
  `chain=${chain.length} chainAll=${chainAll.length}`);
ok('package.json 链尾为 smoke_v2479_xpcurve24', chain[chain.length - 1] === 'smoke_v24123_fraghud', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2479_xpcurve24.mjs（node tests/ 前缀形态，紧随 smoke_v2478_xpcurve23 之后）',
  pkgRaw.includes('node tests/smoke_v2478_xpcurve23.mjs && node tests/smoke_v2479_xpcurve24.mjs && node tests/smoke_v2480_fisherquest.mjs && node tests/smoke_v2481_xpcurve25.mjs && node tests/smoke_v2482_watchquest.mjs && node tests/smoke_v2483_xpcurve26.mjs && node tests/smoke_v2484_goldcurve10.mjs && node tests/smoke_v2485_goldcurve11.mjs && node tests/smoke_v2486_goldcurve12.mjs && node tests/smoke_v2487_goldcurve13.mjs && node tests/smoke_v2488_goldcurve14.mjs && node tests/smoke_v2489_goldcurve15.mjs && node tests/smoke_v2490_goldcurve16.mjs && node tests/smoke_v2491_goldcurve17.mjs && node tests/smoke_v2492_goldcurve18.mjs && node tests/smoke_v2493_goldcurve19.mjs && node tests/smoke_v2494_goldcurve20.mjs && node tests/smoke_v2495_goldcurve21.mjs && node tests/smoke_v2496_goldcurve22.mjs && node tests/smoke_v2497_goldcurve23.mjs && node tests/smoke_v2498_goldcurve24.mjs && node tests/smoke_v2499_goldcurve25.mjs && node tests/smoke_v24100_talequest.mjs && node tests/smoke_v24101_goldcurve26.mjs && node tests/smoke_v24102_goldcurve27.mjs && node tests/smoke_v24103_goldcurve28.mjs && node tests/smoke_v24104_goldcurve29.mjs && node tests/smoke_v24105_songquest.mjs && node tests/smoke_v24106_moonquest.mjs && node tests/smoke_v24107_peddlequest.mjs && node tests/smoke_v24108_shopquest.mjs && node tests/smoke_v24109_carvequest.mjs && node tests/smoke_v24110_vowquest.mjs && node tests/smoke_v24111_hearerquest.mjs && node tests/smoke_v24112_talkquest.mjs && node tests/smoke_v24113_walkquest.mjs && node tests/smoke_v24114_fleequest.mjs && node tests/smoke_v24115_achhud.mjs && node tests/smoke_v24116_guidequest.mjs && node tests/smoke_v24117_codexhud.mjs && node tests/smoke_v24118_wellquest.mjs && node tests/smoke_v24119_huntquest.mjs && node tests/smoke_v24120_chesthud.mjs && node tests/smoke_v24121_siftquest.mjs && node tests/smoke_v24122_crystalquest.mjs && node tests/smoke_v24123_fraghud.mjs"'));

// —— CHANGELOG ——
ok('CHANGELOG 顶部条目已为 v24.79（startsWith）', changelog.startsWith('## v24.123 '));
ok('CHANGELOG v24.79 条目含「数值平衡」「续平滑」「xp[1]」「27→28」',
  changelog.includes('数值平衡') && changelog.includes('续平滑') && changelog.includes('xp[1]') && changelog.includes('27→28'));
ok('CHANGELOG 仍保留 v24.78/v24.76 条目标题（历史零丢失）',
  changelog.includes('## v24.78 数值平衡·后期经验曲线续平滑') && changelog.includes('## v24.76 体验打磨'));

// —— 套件/目录级 ——
const testsDir = __dirname;
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs'));
ok('tests 目录套件数 = 302（smoke.mjs + 301 专项）', files.length === 346, `files=${files.length}`);
ok('tests 目录无孤儿套件（目录数与 package.json 链恒等）', files.length === chainAll.length);
ok('smoke_v2479_xpcurve24.mjs 已在目录中且链尾无遗漏',
  files.includes('smoke_v2479_xpcurve24.mjs') && chain[chain.length - 1] === 'smoke_v24123_fraghud');

// —— 套件内遗留哨兵（零残留） ——
const s2415 = fs.readFileSync(path.join(__dirname, 'smoke_v2415_treepin.mjs'), 'utf8');
ok('smoke_v2415 套件内 treeTok 口径已推进为 302', s2415.includes('treeTok.length === 346'));
ok('smoke_v2415 套件内树尾 pin 已推进为 smoke_v2479_xpcurve24', s2415.includes("=== 'smoke_v24123_fraghud'"));
ok('smoke_v2415 套件内件数口哨兵（尚无 303 口径）', s2415.includes("!readme.includes('三百四十七件套')"));

const s2429 = fs.readFileSync(path.join(__dirname, 'smoke_v2429_xpcurve3.mjs'), 'utf8');
ok('smoke_v2429 套件内 README 件数口径已推进为三百四十六件套（三百四十五件套清除）',
  s2429.includes('三百四十六件套（三百四十五件套清除）'));
ok('smoke_v2429 套件内 xp[1] 推进至 28（xp[1] 29→30 第二十六轮）', s2429.includes('xp[1] 29→30 第二十六轮'));
ok('smoke_v2429 套件内链尾 pin 已推进为 smoke_v2479_xpcurve24', s2429.includes("=== 'smoke_v24123_fraghud'"));
ok('smoke_v2429 套件内入库 pin 已推进至 302 份', s2429.includes('入库（335 份）'));
ok('smoke_v2429 套件内尚无 303 口径哨兵', s2429.includes("!readme.includes('冒烟三百四十七件套')"));

const s2436 = fs.readFileSync(path.join(__dirname, 'smoke_v2436_codexrow.mjs'), 'utf8');
ok('smoke_v2436 双计数 pin 已推进（301 专项 / 304）且尚无 303 口径哨兵',
  s2436.includes('suiteFiles.length === 345 && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length === 346')
  && s2436.includes('!readme.includes(\'冒烟三百四十七件套\')') && s2436.includes('!readme.includes(\'（347 份）\')'));

// —— 全库零残留哨兵链（v24.78 口径 → v24.79；豁免本套件与上一版套件） ——
const hits = [];
for (const f of files) {
  if (f === 'smoke_v24102_goldcurve27.mjs') continue;
  if (f === 'smoke_v24105_songquest.mjs') continue;
  if (f === 'smoke_v24103_goldcurve28.mjs') continue;
  if (f === 'smoke_v24104_goldcurve29.mjs') continue;
  if (f === 'smoke_v2479_xpcurve24.mjs' || f === 'smoke_v2478_xpcurve23.mjs') continue;
  const s = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s.includes("const GAME_VERSION = 'v24.78'")) hits.push(`${f}:gv`);
  if (s.includes("GAME_VERSION === 'v24.78'")) hits.push(`${f}:gvEq`);
  if (s.includes("startsWith('## v24.78")) hits.push(`${f}:clTop`);
  if (s.includes('三百零一件套（三百件套清除）')) hits.push(`${f}:cnt`);
  if (s.includes('入库（301 份）')) hits.push(`${f}:ruku`);
  if (s.includes("=== 'smoke_v2478_xpcurve23'")) hits.push(`${f}:tail`);
  if (s.includes('chain.length === 300')) hits.push(`${f}:chainLen`);
  if (s.includes('chainAll.length === 301')) hits.push(`${f}:chainAll`);
  if (s.includes('files.length === 301')) hits.push(`${f}:filesCnt`);
  if (s.includes('treeTok.length === 301')) hits.push(`${f}:treeTok`);
  if (s.includes('testChain === 301')) hits.push(`${f}:testChain`);
  if (s.includes('xp[1] === 27')) hits.push(`${f}:xp1`);
  if (s.includes('xp:[16,27]')) hits.push(`${f}:xpTuple`);
  if (s.includes('16+27/15+12')) hits.push(`${f}:rowSkel`);
  if (s.includes('59.75')) hits.push(`${f}:dun3`);
  if (s.includes('r3.xp === 97')) hits.push(`${f}:monRew`);
  if (s.includes('Lv13+ 每级 2.8-4.9 场')) hits.push(`${f}:rhy2`);
  if (s.includes('二十三轮经验再平滑')) hits.push(`${f}:round23`);
  if (s.includes('v24.78 复核')) hits.push(`${f}:rev`);
}
ok('全库测试零残留 v24.78 GAME_VERSION/顶 pin/301 口径（哨兵链，豁免本套件与上一版）', hits.length === 0, hits.slice(0, 12).join(' | '));

console.log(`\n— v24.79 冒烟完成：${pass} 项断言，失败 ${fail} —`);
process.exit(fail ? 1 : 0);
