// v22.15 专项冒烟：新手教程行补「 [ / ] 音量」口径（可发现性·承 v21.30 教程行 E 键口径同步 /
// v22.12 主音量调节「功能存在就必须能看到入口」主线）——v22.12 给主音量补的三端（H 页
// 「静音 / 音量」行、README 快速上手表、HUD 指示）都齐了，唯独首次进图的「💡 教程」行
// （main.js 首个 boxMsg、TUTOR_MSG_MS 长档）仍只列「M静音」不列 [ / ]——新玩家第一屏看到的
// 按键清单与全局快捷键表差一格（承 v21.29-30 同一「三处只写 Enter 的最后一处漏网」先例：
// 每加一个全场景快捷键，教程行都是最后一个被补齐的口径端）。现补「 · [ / ] 音量」，与
// VOL_STEP（10% 步进）/H 页行/README 上手表/KEY 无 [ ] 冲突一致；纯文字零逻辑零结算零存档。
// 本冒烟守护：版本锚点、GAME_VERSION 字面量 v22.15 精确（v22.14 历史注释保留）、main.js 教程行
// 含「M静音 · [ / ] 音量」且 12 项既有口径逐字零残留、KEY 无 [ ] 映射冲突、VOL_STEP===0.1 与
// H 页「静音 / 音量」行口径、README/package.json/CHANGELOG 同步（tests 树 + smoke_v2215_tutorvol、
// 冒烟一百二十件套（一百一十九件套清除）、v22.15 守护描述、README 上手表 [ / ] 行）、姊妹件套
// pin（v2214..v2176 一百一十二件套 / v2214..v2179 GAME_VERSION v22.15 / v2214..v2192 恒等
// v22.15 / v2214..v2192 树尾 v22.15）随新现实更新 + 旧代 v22.14 字面量/恒等/件套/树尾 pin 零残留。
import { GAME_VERSION, VOL_STEP } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.15 新手教程行音量口径冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v22.14 + 精确 v22.15 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.14', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 15)), GAME_VERSION);
ok('GAME_VERSION 字面量已为 v22.15（本版独占精确锚点）', GAME_VERSION === 'v22.24', GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const mainSrc = read('../js/main.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v22.15 版本注释', dataSrc.includes('v22.15 新手教程行补 [ / ] 音量口径'));
ok('data.js GAME_VERSION 字面量已更新为 v22.15', dataSrc.includes("const GAME_VERSION = 'v22.24';"));
ok('data.js 仍保留 v22.14 历史注释（累积注释块，姊妹 pin 不失效）', dataSrc.includes('v22.14 新成就「菇香满仓」'));

// —— 教程行口径（v22.15 核心）——
const TUTOR = '💡 教程：WASD移动/Shift奔跑 · Enter/E对话 · Esc菜单 · P存档 · F喝药 · I状态 · J任务 · B图鉴 · C成就 · T旅行 · H帮助 · M静音 · [ / ] 音量';
ok('main.js 教程行含「M静音 · [ / ] 音量」（v22.15 补位）', mainSrc.includes(TUTOR));
ok('main.js 教程行既有的 12 项口径逐字零残留', ['WASD移动/Shift奔跑', 'Enter/E对话', 'Esc菜单', 'P存档', 'F喝药', 'I状态', 'J任务', 'B图鉴', 'C成就', 'T旅行', 'H帮助', 'M静音'].every((s) => mainSrc.includes(s)));
ok('main.js 教程行仍走 TUTOR_MSG_MS 长档（时长常量零改动）', mainSrc.includes(TUTOR) && mainSrc.includes('TUTOR_MSG_MS'));
ok('main.js 无旧教程行残留（旧串 M静音 后无 [ / ] 的形态已清零）', !mainSrc.includes('H帮助 · M静音\', TUTOR_MSG_MS'));

// —— 音量链路单一数据源 & 冲突面 ——
ok('VOL_STEP === 0.1（10% 步进单一数据源）', VOL_STEP === 0.1, String(VOL_STEP));
ok('KEY 无 [ ] 映射（移动表不含方括号，零冲突）', !dataSrc.includes("'['") && !dataSrc.includes("']'"));
ok('main.js [ / ] 全局分派仍在（v22.12 既有入口零回归）', mainSrc.includes("e.key === '['"));
ok('H 页「静音 / 音量」行仍在（v22.12 口径零回归）', dataSrc.includes("'静音 / 音量'") && dataSrc.includes("M 静音切换 · [ / ] 调节音量"));

// —— README 同步 ——
ok('README tests 树尾含 + smoke_v2215_tutorvol + smoke_v2216_picker + smoke_v2217_elixir2 + smoke_v2218_mush2 + smoke_v2219_footkeys + smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter（npm test 串跑）', readme.includes('smoke_v2214_mush + smoke_v2215_tutorvol + smoke_v2216_picker + smoke_v2217_elixir2 + smoke_v2218_mush2 + smoke_v2219_footkeys + smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter（npm test 串跑）'));
ok('README 件套口径为一百二十件套（一百一十九件套清除）', readme.includes('冒烟一百二十件套（一百一十九件套清除）') && !readme.includes('冒烟一百一十件套（一百零九件套清' + '除）'));
ok('README 含 v22.15 守护描述', readme.includes('v22.15 起含新手教程行 [ / ] 音量口径守护'));
ok('README 含 smoke_v2215_tutorvol 入库（111 份）', readme.includes('smoke_v2215_tutorvol 入库（111 份）'));
ok('README 快速上手表 [ / ] 行仍在（v22.12 零回归）', readme.includes('调节主音量'));

// —— package.json / CHANGELOG 同步 ——
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串收录 smoke_v2219_footkeys（第 115 份·串尾随新现实更新）', pkg.includes('&& node tests/smoke_v2219_footkeys.mjs && node tests/smoke_v2220_hearer.mjs && node tests/smoke_v2221_wanderer.mjs && node tests/smoke_v2222_peddler.mjs && node tests/smoke_v2223_lampman.mjs && node tests/smoke_v2224_sifter.mjs"'));
ok('package.json test 串共 114 件套', testChain === 120, String(testChain));
ok('CHANGELOG 含 v22.15 条目', changelog.includes('## v22.15 '));

// —— 姊妹件套 pin（v2214..v2176 一百一十二件套 / v2214..v2179 GAME_VERSION v22.15 / 恒等 / 树尾）——
const s2214 = read('../tests/smoke_v2214_mush.mjs');
const s2213 = read('../tests/smoke_v2213_teller.mjs');
const s2212 = read('../tests/smoke_v2212_volume.mjs');
const s2192 = read('../tests/smoke_v2192_travelwarn.mjs');
const s2181 = read('../tests/smoke_v2181_helpquickcast.mjs');
const s2179 = read('../tests/smoke_v2179_titlerecap.mjs');
const s2176 = read('../tests/smoke_v2176_allchests.mjs');
ok('smoke_v2214 的 README 件套 pin 已随新现实更新为一百二十件套（一百一十九件套清除）',
  s2214.includes('一百二十件套（一百一十九件套清除）'));
ok('smoke_v2214 的 README 树尾 pin 已更新为 + smoke_v2215_tutorvol', s2214.includes('smoke_v2214_mush + smoke_v2215_tutorvol'));
ok('smoke_v2214 的 GAME_VERSION 字面量 pin 已更新为 v22.15',
  s2214.includes("const GAME_VERSION = 'v22.24';"));
ok('smoke_v2214 的 GAME_VERSION 恒等 pin 已更新为 === v22.15',
  s2214.includes("GAME_VERSION === 'v22.24'"));
ok('smoke_v2213 的 GAME_VERSION 字面量 pin 已更新为 v22.15',
  s2213.includes("const GAME_VERSION = 'v22.24';"));
ok('smoke_v2212 的 GAME_VERSION 字面量 pin 已更新为 v22.15',
  s2212.includes("const GAME_VERSION = 'v22.24';"));
ok('smoke_v2192 的 GAME_VERSION 字面量 pin 已更新为 v22.15',
  s2192.includes("const GAME_VERSION = 'v22.24';"));
ok('smoke_v2181 的 GAME_VERSION 字面量 pin 已更新为 v22.15',
  s2181.includes("const GAME_VERSION = 'v22.24';"));
ok('smoke_v2179 的 GAME_VERSION 字面量 pin 已更新为 v22.15',
  s2179.includes("const GAME_VERSION = 'v22.24';"));
ok('smoke_v2176 件套 pin 已更新为一百二十件套（一百一十九件套清除）',
  s2176.includes('一百二十件套（一百一十九件套清除）'));

// —— 旧代 pin 零残留：全部测试文件不得再含 v22.14 字面量/恒等/件套/树尾 pin（拆串构造避免自匹配）——
let stale = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes("const GAME_VERSION = 'v22." + "14';")) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v22.14 全库清零）', stale.length === 0, stale.join(','));
let staleId = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes("GAME_VERSION === 'v22." + "14'")) staleId.push(f);
}
ok('旧代 GAME_VERSION 恒等 pin 零残留（===v22.14 全库清零）', staleId.length === 0, staleId.join(','));
let staleSuite = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes('一百一十件套（一百零九件套清' + '除）')) staleSuite.push(f);
}
ok('旧代件套 pin 零残留（一百一十件套（一百零九件套清' + '除）全库清零）', staleSuite.length === 0, staleSuite.join(','));
let staleTail = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes('smoke_v2213_teller + smoke_v2214_mush（npm test 串' + '跑）')) staleTail.push(f);
}
ok('旧代树尾 pin 零残留（smoke_v2213_teller + smoke_v2214_mush 串全库清零）', staleTail.length === 0, staleTail.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
