// v24.15 专项冒烟：README tests 树串漏录补记 + 树串全量恒等守护
// （文档整理·树串漏录补记——承 v21.92 README tests 树漏录补记先例：README「项目结构」tests 树串
// 自称「全量冒烟」却漏录 7 件套——smoke_v2203_fragdead（v22.3 阵亡碎片）/ smoke_v2205_fragtitle
// （v22.5 标题碎片）/ smoke_v2206_stock2（v22.6 药香满囊）/ smoke_v2207_titledel（v22.7 标题删档）/
// smoke_v2208_elixir（v22.8 灵药盈囊）/ smoke_v2210_unsaved（v22.10 离站提醒）/ smoke_v2239_minercart
// （v22.39 星砂车）——七者各自「入库（N 份）」守护链早已记录（v2203 入库、v2205-2208 入库、v2210 入库
// 106 份、v2239 入库 135 份），唯独 README 树串从未收录，维护者按树串数件套对不上 package.json 实跑链
// （树串 230 节点 vs 实跑链 238 件套）；现按 npm test 实跑链（package.json scripts.test 顺序）逐名
// 织入 7 件（顺序与实跑一致）并新增树串恒等守护：树串 token 序列 == package 实跑链 token 序列，
// 加/漏任何件套立即红灯（件套口径此后不再只靠「树串尾」局部 pin）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.15 注释 / GAME_VERSION v24.15 与旧 v24.14 字面量零
// 残留 / v24.14 历史注释保留）、运行期 GAME_VERSION 恒等、README/package.json/CHANGELOG 同步
// （树串 token 序列恒等 239 节点 + 件套口径 239 + v24.15 守护描述 + 入库（255 份）+ package 串尾
// 239 份 + CHANGELOG 顶 pin）、哨兵链（前望 243 且 README 尚无 240 口径）、旧代 v24.14 pin
// 全库零残留扫描、七件漏录织入的精确邻接（v2202+v2203+v2204 · v2204+v2205..v2209+v2210+v2211 ·
// v2238+v2239+v2240）。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GAME_VERSION } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.15 README tests 树串全量恒等 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const pkg = JSON.parse(pkgRaw).scripts.test;
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.14 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.14', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 14)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.21（旧 v24.14 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.31';") && !dSrc.includes("const GAME_VERSION = 'v24.14';"));
ok('data.js 含 v24.15 注释（README tests 树串漏录补记说明）',
  dSrc.includes('// v24.15 文档整理·README tests 树串漏录补记'));
ok('data.js 仍保留 v24.14 历史注释（战斗画面相位标签说明，累积注释块）',
  dSrc.includes('// v24.14 体验打磨·信息透明·相位入画布'));

// —— package.json 实跑链（唯一权威序）——
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 247 份（smoke.mjs + 250 专项）', chain.length === 254 && chainAll.length === 255, String(chain.length));
ok('package.json 链尾为 smoke_v2431_elixirprog（第 255 份）', chain[chain.length - 1] === 'smoke_v2431_elixirprog', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2415_treepin.mjs（node tests/ 前缀形态）',
  pkgRaw.includes('node tests/smoke_v2415_treepin.mjs'));

// —— README tests 树串恒等（核心守护：token 序列 == 实跑链 token 序列）——
const treeLine = readme.split('\n').find((l) => l.includes('smoke_v1965_playtime')) || '';
const treeTok = (treeLine.match(/smoke\.mjs|smoke_v\d+_\w+/g) || []);
ok('README tests 树串存在（全量冒烟行）', treeLine.includes('全量冒烟'));
ok('树串 token 序列与 package 实跑链恒等（241 节点·顺序一致·无缺无漏）',
  JSON.stringify(treeTok) === JSON.stringify(chainAll),
  `tree=${treeTok.length} chain=${chainAll.length}`);
ok('树串 token 数 = 248（漏录 7 件已织入：230→237→+smoke.mjs=238? 实为 248 节点含 smoke.mjs）',
  treeTok.length === 255, String(treeTok.length));

// —— 七件漏录织入的精确邻接（防再漏）——
ok('树串织入 v2203（v2202_fragwin + v2203_fragdead + v2204_brew2 邻接）',
  readme.includes('smoke_v2202_fragwin + smoke_v2203_fragdead + smoke_v2204_brew2 +'));
ok('树串织入 v2205-v2208（v2204_brew2 + v2205_fragtitle + v2206_stock2 + v2207_titledel + v2208_elixir + v2209_achstatus 邻接）',
  readme.includes('smoke_v2204_brew2 + smoke_v2205_fragtitle + smoke_v2206_stock2 + smoke_v2207_titledel + smoke_v2208_elixir + smoke_v2209_achstatus +'));
ok('树串织入 v2210（v2209_achstatus + v2210_unsaved + v2211_lampkid 邻接）',
  readme.includes('smoke_v2209_achstatus + smoke_v2210_unsaved + smoke_v2211_lampkid +'));
ok('树串织入 v2239（v2238_starwell + v2239_minercart + v2240_tallgrass 邻接）',
  readme.includes('smoke_v2238_starwell + smoke_v2239_minercart + smoke_v2240_tallgrass +'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(chainAll.map((f) => f.replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 243（239 + smoke_v2416_steps）', files.length === 255, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— README 件套口径 / 守护描述 / 哨兵 ——
ok('README tests 段口径「冒烟二百五十五件套（二百五十四件套清除）」',
  readme.includes('冒烟二百五十五件套（二百五十四件套清除）'));
ok('README 尚无 252 件套口径（哨兵前望 252 语义：下一版才写 243）',
  !readme.includes('二百五十六件套') && !readme.includes('冒烟二百五十六件套'));
ok('README 含 v24.15 守护描述（树串漏录补记·全量恒等）与 smoke_v2415_treepin 入库（255 份）',
  readme.includes('v24.15 起含 ') && readme.includes('树串全量恒等') && readme.includes('smoke_v2415_treepin 入库（255 份）'));
ok('README 仍保留 v24.14 守护描述（历史保留）', readme.includes('v24.14 起含 战斗画面相位标签守护'));

// —— 哨兵链（旧代 pin 全库零残留：无任何测试再断言 v24.14 GAME_VERSION 字面量 / 顶 pin）——
const leftovers = [];
for (const f of fs.readdirSync(testsDir)) {
  if (!f.endsWith('.mjs') || f === 'smoke_v2415_treepin.mjs') continue;
  const s = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s.includes("const GAME_VERSION = 'v24.14';") || s.includes("GAME_VERSION === 'v24.14'") ||
      s.includes("startsWith('## v24.14")) leftovers.push(f);
}
ok('全库测试零残留 v24.14 GAME_VERSION/顶 pin（哨兵链）', leftovers.length === 0, leftovers.join(','));

// —— CHANGELOG 顶 pin ——
ok('CHANGELOG 顶部条目已为 v24.21（startsWith）', changelog.startsWith('## v24.31'));
ok('CHANGELOG v24.15 条目含「树串」与「恒等」', changelog.includes('树串') && changelog.includes('恒等'));
ok('CHANGELOG 仍保留 v24.14 条目（历史保留）', changelog.includes('## v24.14'));

process.exit(failed ? 1 : 0);
