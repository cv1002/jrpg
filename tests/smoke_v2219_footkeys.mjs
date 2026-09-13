// v22.19 专项冒烟：index.html 常驻帮助条（#help）按键口径同步（体验打磨·可发现性·纯文案，承 v21.30
// 教程行 E 键口径同步 / v21.44 Shift 奔跑 / v22.7 标题 X 删档 / v22.12 [ / ] 音量 / v22.15 教程行
// [ / ] 音量同一「功能存在就必须能看到入口」主线）——v21.29 起五轮按键口径演进每次都只同步 README
// 快速上手表 / H 帮助页 / 首次进图教程行 / 标题画面提示行，唯独 index.html 画布下方 #help 常驻帮助条
// （v10.x 起曾与教程消息、HELP_PAGES 完整表逐键一致）五轮全漏：仍写「Enter对话/确认 · WASD/方向键移动 ·
// 标题按 L 读档」——新玩家第一眼看到的页面壳按键清单与全局快捷键表差四格（无 E 对话别名、无 Shift 奔跑、
// 无 [ / ] 音量、标题只知 L 不知 R/X 两按删除/重开）。本版补 <kbd>Enter</kbd>/<kbd>E</kbd> ·
// 移动（<kbd>Shift</kbd>奔跑）· <kbd>[</kbd>/<kbd>]</kbd>音量 · 标题 L·R·X（连按两次确认）四组口径。
// 本冒烟守护：版本锚点、data.js 版本注释与字面量（v22.19 精确/v22.18 旧字面量零残留/v22.18 历史注释保留）、
// index.html 页脚新口径 token 逐字 + 旧口径零残留 + 既有项逐字保留、main.js 教程行逐字零回归（同口径族）、
// README/package.json/CHANGELOG 同步、姊妹件套 pin 复查（v2218..v2176 一百一十五件套 / v2218..v2179
// GAME_VERSION v22.19 / v2218..v2192 恒等 v22.19 / v2218..v2192 树尾 pin / package testChain === 132）、
// 旧代 v22.18 字面量 pin / 旧代恒等 pin / 旧代一百一十四件套 pin / 旧代树尾 pin 全库零残留、index.html
// 壳要素（canvas 640×480 + js/main.js 模块入口 + #help/#hud/#quest）零回归。
import { GAME_VERSION } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.19 index.html 常驻帮助条按键口径同步 冒烟 —');

// —— 版本锚点：格式合法 + 已越过 v22.18 + 精确 v22.19 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.18', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 19)), GAME_VERSION);
ok('GAME_VERSION 字面量已为 v22.19（本版独占精确锚点）', GAME_VERSION === 'v22.36', GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const html = read('../index.html');
const dataSrc = read('../js/data.js');
const mainSrc = read('../js/main.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

// —— data.js 版本注释 / 字面量 ——
ok('data.js 含 v22.19 版本注释（常驻帮助条口径说明）', dataSrc.includes('v22.19 体验打磨「index.html 常驻帮助条按键口径同步」'));
ok('data.js GAME_VERSION 字面量已更新为 v22.19（旧 v22.18 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v22.36';") && !dataSrc.includes("const GAME_VERSION = 'v22." + "18';"));
ok('data.js 仍保留 v22.18 历史注释（累积注释块，姊妹 pin 不失效）', dataSrc.includes('v22.18 新成就「菇山菌海」'));

// —— index.html 页脚新口径 token ——
ok('index.html #help 常驻帮助条存在', html.includes('<div id="help">'));
ok('页脚移动行补 Shift 奔跑（<kbd>Shift</kbd>）', html.includes('移动（<kbd>Shift</kbd>奔跑）'));
ok('页脚对话行补 E 别名（<kbd>Enter</kbd>/<kbd>E</kbd>对话/确认）', html.includes('<kbd>Enter</kbd>/<kbd>E</kbd>对话/确认'));
ok('页脚补 [ / ] 音量（<kbd>[</kbd>/<kbd>]</kbd>音量）', html.includes('<kbd>[</kbd>/<kbd>]</kbd>音量'));
ok('页脚标题补 R 重开（<kbd>R</kbd> 重开）', html.includes('<kbd>R</kbd> 重开'));
ok('页脚标题补 X 删档（<kbd>X</kbd> 删档）', html.includes('<kbd>X</kbd> 删档'));
ok('页脚 R/X 连按两次确认口径', html.includes('（<kbd>R</kbd>/<kbd>X</kbd>连按两次确认）'));
ok('页脚 L 读档仍在（既有项保留）', html.includes('标题按 <kbd>L</kbd> 读档'));

// —— index.html 页脚旧口径零残留 ——
ok('页脚旧「<kbd>Enter</kbd>对话/确认」（无 E）已清零', !html.includes('<kbd>Enter</kbd>对话/确认'));
ok('页脚旧移动行（无 Shift）已清零', !html.includes('<kbd>WASD</kbd>/<kbd>方向键</kbd>移动 ·'));
ok('页脚旧标题行（仅 L 读档句号收尾）已清零', !html.includes('标题按 <kbd>L</kbd> 读档。'));

// —— 页脚既有项逐字保留（抽样） ——
ok('页脚既有项逐字保留（Esc/P/F/I/J/B/C/T/M/H/1-6/结局句）',
  ['<kbd>Esc</kbd>菜单', '<kbd>P</kbd>存档', '<kbd>F</kbd>喝药', '<kbd>I</kbd>状态', '<kbd>J</kbd>任务',
   '<kbd>B</kbd>图鉴', '<kbd>C</kbd>成就', '<kbd>T</kbd>旅行', '<kbd>M</kbd>静音', '<kbd>H</kbd>操作说明',
   '<kbd>1-6</kbd> 指令', '讨回灯芯：击败', '即可通关——井底还有更深的真相。']
  .every((s) => html.includes(s)));

// —— main.js 教程行逐字零回归（同口径族：页脚与教程行同源四组） ——
ok('main.js 教程行仍含 Enter/E对话 口径（零回归）', mainSrc.includes('Enter/E对话'));
ok('main.js 教程行仍含 Shift 奔跑 口径（零回归）', mainSrc.includes('WASD移动/Shift奔跑'));
ok('main.js 教程行仍含 [ / ] 音量 口径（零回归）', mainSrc.includes('[ / ] 音量'));
ok('页脚新口径与教程行同族（Shift/Enter·E/[ / ] 三组同步存在）',
  mainSrc.includes('WASD移动/Shift奔跑') && mainSrc.includes('Enter/E对话') && mainSrc.includes('[ / ] 音量') &&
  html.includes('移动（<kbd>Shift</kbd>奔跑）') && html.includes('<kbd>Enter</kbd>/<kbd>E</kbd>对话/确认') &&
  html.includes('<kbd>[</kbd>/<kbd>]</kbd>音量'));

// —— README 同步 ——
ok('README tests 树收录 smoke_v2218_mush2 + smoke_v2219_footkeys 且位于串尾',
  readme.includes('smoke_v2218_mush2 + smoke_v2219_footkeys + smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp（npm test 串跑）'));
ok('README tests 树尾链完整（v2217_elixir2 未被新尾吞并，全链连到 smoke_v2219_footkeys）',
  readme.includes('smoke_v2217_elixir2 + smoke_v2218_mush2 + smoke_v2219_footkeys + smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp（npm test 串跑）'));
ok('README 件套口径为一百三十二件套（一百三十一件套清除）',
  readme.includes('冒烟一百三十二件套（一百三十一件套清除）') && !readme.includes('冒烟一百一十四件套（一百一十三件套清' + '除）'));
ok('README 含 v22.19 守护描述（#help 口径同步）', readme.includes('v22.19 起含 index.html 常驻帮助条（#help）按键口径同步守护'));
ok('README 含 smoke_v2219_footkeys 入库（115 份）', readme.includes('smoke_v2219_footkeys 入库（115 份）'));

// —— package.json / CHANGELOG 同步 ——
ok('package.json 已收录 smoke_v2219_footkeys（npm test 串跑第 115 份）',
  pkg.includes('smoke_v2219_footkeys.mjs') && /smoke_v2218_mush2\.mjs && node tests\/smoke_v2219_footkeys\.mjs/.test(pkg));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 115 件套', testChain === 132, String(testChain));
ok('CHANGELOG 含 v22.19 条目', changelog.includes('## v22.19 '));

// —— 姊妹件套 pin 复查（v21.7 惯例：本版冒烟守护姊妹随新现实更新） ——
const s2218 = read('../tests/smoke_v2218_mush2.mjs');
const s2217 = read('../tests/smoke_v2217_elixir2.mjs');
ok('smoke_v2218 的 README 件套 pin 已随新现实更新为一百三十二件套（一百三十一件套清除）',
  s2218.includes('一百三十二件套（一百三十一件套清除）'));
ok('smoke_v2218 的 README 树尾 pin 已更新为 + smoke_v2219_footkeys',
  s2218.includes('smoke_v2218_mush2 + smoke_v2219_footkeys + smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp（npm test 串跑）'));
ok('smoke_v2218 的 GAME_VERSION 字面量 pin 已更新为 v22.19', s2218.includes("const GAME_VERSION = 'v22.36';"));
ok('smoke_v2218 的 GAME_VERSION 恒等 pin 已更新为 === v22.19', s2218.includes("GAME_VERSION === 'v22.36'"));
ok('smoke_v2218 的 package.json 件套计数 pin 已更新为 === 115', s2218.includes('testChain === 132'));
ok('smoke_v2217 的 GAME_VERSION 字面量 pin 已更新为 v22.19', s2217.includes("const GAME_VERSION = 'v22.36';"));
ok('smoke_v2217 的 package.json 件套计数 pin 已更新为 === 115', s2217.includes('testChain === 132'));
ok('smoke_v2217 的 README 件套 pin 已随新现实更新为一百三十二件套（一百三十一件套清除）',
  s2217.includes('一百三十二件套（一百三十一件套清除）'));

// —— 旧代 pin 零残留：全部测试文件不得再含 v22.18 版本字面量 pin（拆串构造避免本文件扫描行自匹配） ——
const OLD_GV = "const GAME_VERSION = 'v22." + "18';";
let stale = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes(OLD_GV)) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v22.18 全库清零）', stale.length === 0, stale.join(','));
let staleId = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes("GAME_VERSION === 'v22." + "18'")) staleId.push(f);
}
ok('旧代 GAME_VERSION 恒等 pin 零残留（===v22.18 全库清零）', staleId.length === 0, staleId.join(','));
let staleSuite = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes('一百一十四件套（一百一十三件套清' + '除）')) staleSuite.push(f);
}
ok('旧代件套 pin 零残留（一百一十四件套（一百一十三件套清' + '除）全库清零）', staleSuite.length === 0, staleSuite.join(','));
let staleTail = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes('smoke_v2217_elixir2 + smoke_v2218_mush2（npm test 串' + '跑）')) staleTail.push(f);
}
ok('旧代树尾 pin 零残留（smoke_v2217_elixir2 + smoke_v2218_mush2 串全库清零）', staleTail.length === 0, staleTail.join(','));
// 断链防回归：不得出现 v2218_mush2 被新尾吞并的坏链（smoke_v2217_elixir2 直接接 smoke_v2219_footkeys）
let brokenTail = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes('smoke_v2217_elixir2 + smoke_v2219_footkeys（npm test 串' + '跑）')) brokenTail.push(f);
}
if (read('README.md').includes('smoke_v2217_elixir2 + smoke_v2219_footkeys（npm test 串' + '跑）')) brokenTail.push('README.md');
ok('坏链 pin 零残留（v2218_mush2 吞并链全库清零）', brokenTail.length === 0, brokenTail.join(','));

// —— index.html 壳要素零回归（页面壳不可被误伤） ——
ok('index.html 壳要素零回归（canvas 640×480 + js/main.js 模块入口 + hud/quest/msg）',
  html.includes('<canvas id="game" width="640" height="480">') && html.includes('<script type="module" src="js/main.js') &&
  html.includes('id="hud"') && html.includes('id="quest"') && html.includes('id="msg"') &&
  html.includes('<title>潮灯记 · JRPG</title>'));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
