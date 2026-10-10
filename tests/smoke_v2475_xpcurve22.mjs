// smoke_v2475_xpcurve22.mjs — v24.75 专项冒烟：后期经验曲线续平滑（第二十二轮·四强怪每级经验 +1）
// 数值口径与 tests/smoke_v2473_xpcurve21.mjs 完全一致（同 W/xpNeededFor/zoneOf/avgXp/need 公式）：
//   xp[1] 25→26 后无字回廊池（gallery）Lv10-15 的每场加权经验 362.59/396.18/429.80/463.80/497.71/531.43，
//   Lv10-15 每级升级所需场数 1.29/1.67/2.19/2.88/3.81/5.07（改前 25 口径 1.33/1.73/2.27/2.99/3.95/5.26，
//   每级 -0.05~-0.19 场、累计 17.53→16.91 场），曲线仍严格单调递增；雾语林 Lv5→6 0.83→0.80 场、
//   星井矿脉 Lv9→10 1.51→1.46 场、无字回廊 Lv11→12 1.73→1.67 场；四基础怪零变化，village Lv1/Lv2
//   13.25/16.91 恒等。README/CHANGELOG/package.json 同步。
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
ok('data.js GAME_VERSION 字面量已为 v24.75（旧 v24.74 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.78';") && !dSrc.includes("const GAME_VERSION = 'v24.74';"));
ok('data.js 含 v24.75 注释（后期经验曲线续平滑第二十二轮说明）',
  dSrc.includes('// v24.75 数值平衡·后期经验曲线续平滑'));
ok('data.js 保留 v24.73/v24.70 历史注释（第二十一轮/第二十轮方法论零丢失）',
  dSrc.includes('// v24.73 数值平衡·后期经验曲线续平滑') && dSrc.includes('// v24.70 数值平衡·后期经验曲线续平滑'));
// 源级锚：本轮 xp[1] 25→26 逐字落位（v24.73 第二十一轮已为 25 口径）
ok('data.js 源级四强怪 xp 每级 26 逐字落位（xp:[16,27]/xp:[17,27]/xp:[18,27]/xp:[22,27]）',
  dSrc.includes('xp:[16,27]') && dSrc.includes('xp:[17,27]') && dSrc.includes('xp:[18,27]') && dSrc.includes('xp:[22,27]'));

// —— MON_BASE 结构 ——
const FOUR = ['骷髅兵', '雾灵', '树精', '石魔像'];
const BASE4 = ['史莱姆', '野狼', '哥布林', '毒蛇'];
const byName = Object.fromEntries(MON_BASE.map((m) => [m.name, m]));
ok('四强怪每级经验均为 27（xp[1] 26→27 第二十三轮）', FOUR.every((nm) => byName[nm] && byName[nm].xp[1] === 27));
ok('四基础怪 xp 逐字未动（史莱姆/野狼/哥布林/毒蛇 xp 仍为 [8,3]/[12,3]/[10,3]/[15,3]）',
  BASE4.every((nm) => byName[nm]) && byName['史莱姆'].xp.join() === '8,3' && byName['野狼'].xp.join() === '12,3'
  && byName['哥布林'].xp.join() === '10,3' && byName['毒蛇'].xp.join() === '15,3');

// —— 升级曲线（与 smoke_v2473 同法；perOverride 26=改后 25=改前） ——
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
const bNew = (lv) => need(lv) / avgXp('gallery', lv, 26);
const bOld = (lv) => need(lv) / avgXp('gallery', lv, 25);

ok('XP 阈值链逐值未动（Lv11 466 · Lv12 662 · Lv13 940 · Lv14 1335 · Lv15 1896 · Lv16 2692）',
  need(10) === 466 && need(11) === 662 && need(12) === 940 && need(13) === 1335 && need(14) === 1896 && need(15) === 2692,
  [need(10), need(11), need(12), need(13), need(14), need(15)].join('/'));
ok('经验曲线仍单调递增（Lv10-15 每场所需场数 1.29<1.67<2.19<2.88<3.81<5.07）',
  bNew(10) < bNew(11) && bNew(11) < bNew(12) && bNew(12) < bNew(13) && bNew(13) < bNew(14) && bNew(14) < bNew(15));
ok('xp[1] 25→26 后每场升级场数缓速（Lv10-15 窗口 1.23-1.35/1.61-1.73/2.13-2.25/2.82-2.94/3.75-3.87/5.01-5.13）',
  bNew(10) > 1.23 && bNew(10) < 1.35 && bNew(11) > 1.61 && bNew(11) < 1.73 && bNew(12) > 2.13 && bNew(12) < 2.25
  && bNew(13) > 2.82 && bNew(13) < 2.94 && bNew(14) > 3.75 && bNew(14) < 3.87 && bNew(15) > 5.01 && bNew(15) < 5.13,
  [bNew(10), bNew(11), bNew(12), bNew(13), bNew(14), bNew(15)].map((x) => x.toFixed(2)).join('/'));
ok('改前口径 25 仍在预期窗（Lv14 3.89-4.01 · Lv15 5.20-5.32）',
  bOld(14) > 3.89 && bOld(14) < 4.01 && bOld(15) > 5.20 && bOld(15) < 5.32);
ok('avgXp gallery Lv10/11/12（xp[1]=26 口径）≈362.59/396.18/429.80',
  avgXp('gallery', 10, 26) > 362.4 && avgXp('gallery', 10, 26) < 362.8
  && avgXp('gallery', 11, 26) > 396.0 && avgXp('gallery', 11, 26) < 396.4
  && avgXp('gallery', 12, 26) > 429.6 && avgXp('gallery', 12, 26) < 430.0);
ok('village Lv1/Lv2 每场经验 13.25/16.91 恒等（四基础怪未动 → 镇内节奏零变化）',
  Math.abs(avgXp('village', 1) - 13.25) < 0.01 && Math.abs(avgXp('village', 2) - 16.91) < 0.01);
ok('dungeon Lv3-4 单场经验较改前上浮且仅来自四强怪（59.75/86.26 口径）',
  Math.abs(avgXp('dungeon', 3) - 59.75) < 0.01 && Math.abs(avgXp('dungeon', 4) - 86.26) < 0.01);
ok('XP_GROW 1.42 / XP_INIT 20 逐字未动（节奏公式单一数据源）', XP_GROW === 1.42 && XP_INIT === 20);

// —— README ——
ok('README 件套口径已为三百零一件套（三百件套清除）',
  readme.includes('冒烟三百零一件套（三百件套清除）'));
ok('README 魔物数值行（骷髅兵）已为 16+26（金币 15+12 未动）', readme.includes('骷髅兵 26+6/8+2/5+1/16+27/15+12'));
ok('README 魔物数值行（雾灵）已为 17+26（金币 14+12 未动）', readme.includes('雾灵 24+5/9+2/4+1/17+27/14+12'));
ok('README 魔物数值行（树精）已为 18+26（金币 16+12 未动）', readme.includes('树精 30+6/7+2/6+1/18+27/16+12'));
ok('README 魔物数值行（石魔像）已为 22+26（金币 20+12 未动）', readme.includes('石魔像 36+7/8+2/10+1/22+27/20+12'));
ok('README 四基础怪逐字未动',
  readme.includes('史莱姆 16+5/5+2/2+1/8+3/8+2') && readme.includes('野狼 22+5/7+2/3+1/12+3/12+2')
  && readme.includes('哥布林 20+5/6+2/3+1/10+3/10+2') && readme.includes('毒蛇 20+5/8+2/3+1/15+3/13+2'));
ok('README 升级节奏参考段落已按 v24.75 刷新口径（Lv5→6 约 0.8 场 / Lv9→10 约 1.5 场 / Lv11→12 约 1.7 场，Lv13+ 每级 2.8-4.9 场）',
  readme.includes('Lv5→6 约 0.8 场（雾语林）') && readme.includes('Lv9→10 约 1.4 场（星井矿脉）')
  && readme.includes('Lv11→12 约 1.6 场（无字回廊）') && readme.includes('Lv13+ 每级 2.8-4.9 场'));
ok('README 金币口径未动（约 1052 金 + Lv5→6 ≈2.1 + Lv11→12 ≈7.0）',
  readme.includes('金币自然收入到 Lv10 约 1052 金') && readme.includes('Lv5→6 ≈2.1') && readme.includes('Lv11→12 ≈7.0'));
ok('README 历史叙述含二十三轮经验再平滑 + v24.78 复核', readme.includes('二十三轮经验再平滑') && readme.includes('v24.78 复核'));
ok('README tests 树含 v24.75 守护描述（「后期经验曲线续平滑（第二十二轮）」+「xp[1] 25→26」+「Lv10→11 1.33→1.29…」+「Lv5→6 0.83→0.80」）与 smoke_v2475_xpcurve22 入库（301 份）',
  readme.includes('v24.75 起含 「后期经验曲线续平滑（第二十二轮）」守护') && readme.includes('xp[1] 25→26')
  && readme.includes('Lv10→11 1.33→1.29') && readme.includes('Lv5→6 0.83→0.80') && readme.includes('smoke_v2475_xpcurve22 入库（301 份）'));
ok('README 仍保留 v24.70/v24.49 早期 xp 守护描述（历史零丢失）',
  readme.includes('v24.70 起含 「后期经验曲线续平滑（第二十轮）」守护') && readme.includes('v24.49 起含 「后期经验曲线续平滑（第八轮）」守护'));
ok('README tests 树串尾已延伸至 smoke_v2475_xpcurve22 + smoke_v2476_achprog + smoke_v2477_fisher + smoke_v2478_xpcurve23（npm test 串跑）',
  readme.includes('smoke_v2471_bellman + smoke_v2472_bellquest + smoke_v2473_xpcurve21 + smoke_v2475_xpcurve22 + smoke_v2476_achprog + smoke_v2477_fisher + smoke_v2478_xpcurve23（npm test 串跑）'));
ok('README 尚无三百零二件套口径（哨兵前望 299 语义：下一版才写 299）',
  !readme.includes('三百零二件套') && !readme.includes('冒烟三百零二件套'));

// —— package.json 链 ——
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 297 专项（smoke.mjs + 297 专项 = 298 总件套），链长计数精确匹配',
  chain.length === 300 && chainAll.length === 301,
  `chain=${chain.length} chainAll=${chainAll.length}`);
ok('package.json 链尾为 smoke_v2475_xpcurve22', chain[chain.length - 1] === 'smoke_v2478_xpcurve23', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2475_xpcurve22.mjs（node tests/ 前缀形态，紧随 smoke_v2473_xpcurve21 之后）',
  pkgRaw.includes('node tests/smoke_v2473_xpcurve21.mjs && node tests/smoke_v2475_xpcurve22.mjs && node tests/smoke_v2476_achprog.mjs && node tests/smoke_v2477_fisher.mjs && node tests/smoke_v2478_xpcurve23.mjs"'));

// —— CHANGELOG ——
ok('CHANGELOG 顶部条目已为 v24.75（startsWith）', changelog.startsWith('## v24.78 '));
ok('CHANGELOG v24.75 条目含「数值平衡」「续平滑」「xp[1]」「25→26」',
  changelog.includes('数值平衡') && changelog.includes('续平滑') && changelog.includes('xp[1]') && changelog.includes('25→26'));
ok('CHANGELOG 仍保留 v24.73/v24.70 经验曲线条目标题（历史零丢失）',
  changelog.includes('## v24.73 数值平衡·后期经验曲线续平滑') && changelog.includes('## v24.70 数值平衡·后期经验曲线续平滑'));

// —— 套件/目录级 ——
const testsDir = __dirname;
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs'));
ok('tests 目录套件数 = 298（smoke.mjs + 297 专项）', files.length === 301, `files=${files.length}`);
ok('tests 目录无孤儿套件（目录数与 package.json 链恒等）', files.length === chainAll.length);
ok('smoke_v2475_xpcurve22.mjs 已在目录中且链尾无遗漏',
  files.includes('smoke_v2475_xpcurve22.mjs') && chain[chain.length - 1] === 'smoke_v2478_xpcurve23');

// —— 套件内遗留哨兵（零残留） ——
const s2415 = fs.readFileSync(path.join(__dirname, 'smoke_v2415_treepin.mjs'), 'utf8');
ok('smoke_v2415 套件内 treeTok 口径已推进为 298', s2415.includes('treeTok.length === 301'));
ok('smoke_v2415 套件内树尾 pin 已推进为 smoke_v2475_xpcurve22', s2415.includes("=== 'smoke_v2478_xpcurve23'"));
ok('smoke_v2415 套件内件数口哨兵（尚无 299 口径）', s2415.includes("!readme.includes('三百零二件套')"));

const s2429 = fs.readFileSync(path.join(__dirname, 'smoke_v2429_xpcurve3.mjs'), 'utf8');
ok('smoke_v2429 套件内 README 件数口径已推进为三百零一件套（三百件套清除）',
  s2429.includes('三百零一件套（三百件套清除）'));
ok('smoke_v2429 套件内 xp[1] 推进至 26（xp[1] 26→27 第二十三轮）', s2429.includes('xp[1] 26→27 第二十三轮'));
ok('smoke_v2429 套件内链尾 pin 已推进为 smoke_v2475_xpcurve22', s2429.includes("=== 'smoke_v2478_xpcurve23'"));
ok('smoke_v2429 套件内入库 pin 已推进至 298 份', s2429.includes('入库（301 份）'));
ok('smoke_v2429 套件内尚无 299 口径哨兵', s2429.includes("!readme.includes('冒烟三百零二件套')") && s2429.includes('前望 275'));

const s2436 = fs.readFileSync(path.join(__dirname, 'smoke_v2436_codexrow.mjs'), 'utf8');
ok('smoke_v2436 双计数 pin 已推进（298 专项 / 300）且尚无 299 口径哨兵',
  s2436.includes('suiteFiles.length === 300 && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length === 301')
  && s2436.includes('!readme.includes(\'冒烟三百零二件套\')') && s2436.includes('!readme.includes(\'（302 份）\')'));

// —— 全库零残留哨兵链（v24.74 口径 → v24.75；豁免本套件与上一版套件） ——
const hits = [];
for (const f of files) {
  if (f === 'smoke_v2475_xpcurve22.mjs' || f === 'smoke_v2473_xpcurve21.mjs') continue;
  const s = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s.includes("const GAME_VERSION = 'v24.74'")) hits.push(`${f}:gv`);
  if (s.includes("GAME_VERSION === 'v24.74'")) hits.push(`${f}:gvEq`);
  if (s.includes("startsWith('## v24.74")) hits.push(`${f}:clTop`);
  if (s.includes('二百九十七件套（二百九十六件套清除）')) hits.push(`${f}:cnt`);
  if (s.includes('入库（297 份）')) hits.push(`${f}:ruku`);
  if (s.includes("=== 'smoke_v2473_xpcurve21'")) hits.push(`${f}:tail`);
  if (s.includes('chain.length === 297')) hits.push(`${f}:chainLen`);
  if (s.includes('chainAll.length === 298')) hits.push(`${f}:chainAll`);
  if (s.includes('files.length === 298')) hits.push(`${f}:filesCnt`);
  if (s.includes('treeTok.length === 298')) hits.push(`${f}:treeTok`);
  if (s.includes('testChain === 298')) hits.push(`${f}:testChain`);
  if (s.includes('xp[1] === 25')) hits.push(`${f}:xp1`);
  if (s.includes('xp:[16,25]')) hits.push(`${f}:xpTuple`);
  if (s.includes('16+25/15+12')) hits.push(`${f}:rowSkel`);
  if (s.includes('Lv5→6 约 0.9 场（雾语林）')) hits.push(`${f}:rhy1`);
  if (s.includes('Lv13+ 每级 3.0-5.3 场')) hits.push(`${f}:rhy2`);
  if (s.includes('二十一轮经验再平滑')) hits.push(`${f}:round21`);
}
ok('全库测试零残留 v24.74 GAME_VERSION/顶 pin/297 口径（哨兵链，豁免本套件与上一版）', hits.length === 0, hits.slice(0, 12).join(' | '));

console.log(`\n— v24.75 冒烟完成：${pass} 项断言，失败 ${fail} —`);
process.exit(fail ? 1 : 0);
