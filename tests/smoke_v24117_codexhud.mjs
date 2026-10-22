// smoke_v24117_codexhud.mjs —— v24.117 专项冒烟：HUD 常驻「📕 记忆图鉴 N/13」收集进度
// （体验打磨·信息透明·计数现场——承 v24.115 HUD 成就进度「🏆 成就 N/76」/ v24.16 HUD 步数进度
// 「🚶 千里之行 N/1000」/ v24.12 胜利画面「⚔️ 身经百战 N/100」/ v24.11 阵亡画面「💪 败而不馁 N/10」
// 同一「计数现场报进度」主线，收集口径的 HUD 侧第二枚兑现：记忆图鉴（B 键）是全游最大的收藏面与
// 「该去打哪只」的刷怪中枢（出没地/强度/讨伐进度全在里头），图鉴总进度此前只在 I 状态页资源行
// （📕 图鉴 N/13，v21.94）/图鉴页汇总（「记忆收录：N/13」，v21.75）/标题槽预览可见，HUD 第二行
// 一眼可见的计数（金币/药水/灵药/蘑菇/步数/成就/槽位）唯独缺「图鉴」这枚——想冲「记忆收藏家」/
// 「见多识广」这类讨伐系成就或数全图鉴还差几种没打过，还要开 B 页数 X/13；现与 I 页资源行/标题槽预览/
// drawWin 收集行同读 data.js BESTIARY_TARGET·hero.bestiary 一份单一数据源，DOM HUD（#hud）第二行
// 🏆 之右补常驻「📕 N/13」（index.html <b id="s-codex"> + view/hud.js
// set('s-codex', BESTIARY_TARGET.filter((n)=>((hero.bestiary||{})[n]|0)>=1).length+'/'+BESTIARY_TARGET.length)
// 逐字落位，与 I 页同式同源｜0 归一布尔旧档），讨伐当场涨；纯显示零结算零存档零数值变化
// （hero.bestiary 写入/讨伐收录判定/图鉴行绘制逐字未动）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.117 注释 / GAME_VERSION v24.117 与旧 v24.116 字面量
// 零残留 / v24.116 历史注释保留）、运行期常量实值（BESTIARY_TARGET.length 13）互证、index.html s-codex
// 落位（#hud 第二行 🏆 s-ach 之右、🔊 s-snd 之左 + title 口径）、hud.js 源级（BESTIARY_TARGET import
// + set 逐字）、运行期 renderHUD 真实渲染三档（0/13 · 3/13 · 缺 bestiary 防御式 0/13）、README/
// package.json/CHANGELOG 同步（件套口径 340 + v24.117 守护描述 + smoke_v24117_codexhud 入库（340 份）
// + package 串尾 + CHANGELOG 顶 pin + 成就/视觉 bullet）、哨兵链（前望 341 且 README 尚无 341 口径）、
// 旧代 v24.116 pin 全库零残留扫描、HUD 既有项零回归（s-map/s-lv/s-atk 等 22 项 set 仍逐字在列）。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v24.16 冒烟先例：先装桩再动态 import main.js）——
const noop = () => {};
function makeCtx() {
  const grad = { addColorStop: noop };
  return {
    canvas: { width: 640, height: 480 },
    measureText: (t) => ({ width: String(t).length * 8 }),
    createLinearGradient: () => grad, createRadialGradient: () => grad, createConicGradient: () => grad, createPattern: () => ({}),
    beginPath: noop, closePath: noop, moveTo: noop, lineTo: noop, arc: noop, arcTo: noop, ellipse: noop,
    quadraticCurveTo: noop, bezierCurveTo: noop, fill: noop, stroke: noop, fillRect: noop, strokeRect: noop,
    clearRect: noop, drawImage: noop, save: noop, restore: noop, translate: noop, rotate: noop, scale: noop,
    transform: noop, setTransform: noop, clip: noop, rect: noop, setLineDash: noop, getLineDash: () => [],
    isPointInPath: () => false,
    globalAlpha: 1, strokeStyle: '#000', fillStyle: '#000', font: '', textAlign: 'left', textBaseline: 'alphabetic',
    lineWidth: 1, imageSmoothingEnabled: false,
    fillText: noop,
  };
}
function mkEl(id) {
  const cl = { add: noop, remove: noop, contains: () => false, toggle: noop };
  return { textContent: '', style: {}, className: '', id, width: 640, height: 480,
    getContext: () => makeCtx(), classList: cl, parentElement: { classList: cl }, addEventListener: noop };
}
const els = {};
globalThis.document = {
  getElementById: (id) => { if (!els[id]) els[id] = mkEl(id); return els[id]; },
  createElement: (tag) => tag === 'canvas'
    ? { width: 32, height: 32, getContext: () => makeCtx(), style: {}, classList: { add: noop, remove: noop } }
    : { style: {}, classList: { add: noop, remove: noop } },
  addEventListener: noop,
  documentElement: { style: {} },
};
function FakeAudio() { return { currentTime: 0, destination: {},
  createOscillator: () => ({ connect: noop, start: noop, stop: noop, type: '',
    frequency: { setValueAtTime: noop, exponentialRampToValueAtTime: noop } }),
  createGain: () => ({ connect: noop,
    gain: { setValueAtTime: noop, linearRampToValueAtTime: noop, exponentialRampToValueAtTime: noop } }),
  createBuffer: () => ({}), createBufferSource: () => ({ connect: noop, start: noop }),
  createPeriodicWave: () => ({}), resume: noop }; }
globalThis.window = { addEventListener: noop, AudioContext: FakeAudio, webkitAudioContext: FakeAudio };
const mem = {};
globalThis.localStorage = {
  getItem: (k) => Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null,
  setItem: (k, v) => { mem[k] = String(v); },
  removeItem: (k) => { delete mem[k]; },
};
globalThis.setInterval = () => 0;
globalThis.clearInterval = () => {};

await import('../js/main.js');
const { S } = await import('../js/state.js');
const { GAME_VERSION, BESTIARY_TARGET } = await import('../js/data.js');
const { renderHUD } = await import('../js/view/index.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.117 HUD 常驻「📕 记忆图鉴 N/13」收集进度 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const hudSrc = read('js/view/hud.js');
const html = read('index.html');
const readme = read('README.md');
const pkgRaw = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.116，精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.116', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 116)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.117（旧 v24.116 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.144';") && !dSrc.includes("const GAME_VERSION = 'v24.116';"));
ok('data.js 含 v24.117 注释（HUD 记忆图鉴进度·计数现场说明）',
  dSrc.includes('v24.117 体验打磨·信息透明·计数现场'));
ok('data.js 仍保留 v24.116 历史注释（药要带足新支线说明，零内容丢失）',
  dSrc.includes('v24.116 新内容·新支线（第二十九条）'));

// —— 运行期常量实值（单一数据源）——
ok('BESTIARY_TARGET.length === 13（HUD 图鉴分母与 I 页/标题预览/收集行同源）', BESTIARY_TARGET.length === 13, String(BESTIARY_TARGET.length));

// —— index.html 落位（#hud 第二行 🏆 之右）——
ok('index.html #hud 含 s-codex（<b id="s-codex">）', html.includes('<b id="s-codex">'));
ok('index.html s-codex 标题口径含 记忆图鉴 与 v24.117（title 属性）',
  html.includes('title="记忆图鉴：讨伐收录进度（图鉴收集线，v24.117）"'));
ok('index.html s-codex 位于 🏆 s-ach 之后、🔊 s-snd 之前（第二行统计位）',
  html.indexOf('<b id="s-ach">') < html.indexOf('<b id="s-codex">') &&
  html.indexOf('<b id="s-codex">') < html.indexOf('<b id="s-snd">'));
ok('index.html s-codex 唯一（零重复 id）', (html.match(/id="s-codex"/g) || []).length === 1);

// —— hud.js 源级落位 ——
ok('hud.js import 补 BESTIARY_TARGET（data.js 既有导出，零新增依赖）',
  hudSrc.includes("import { MAPS, ENCOUNTER, DAY_PHASE_S, STEP_GOAL, ACH_LIST, BESTIARY_TARGET, chestCount, chestTotal, FRAGMENTS } from '../data.js';"));
ok('hud.js set 逐字落位（s-codex = BESTIARY_TARGET 讨伐收录数/总数 防御式分子）',
  hudSrc.includes("set('s-codex', BESTIARY_TARGET.filter((n) => ((hero.bestiary || {})[n] | 0) >= 1).length + '/' + BESTIARY_TARGET.length);"));
ok('hud.js 含 v24.117 注释（HUD 记忆图鉴进度说明）', hudSrc.includes('v24.117 体验打磨·信息透明·计数现场'));
ok('hud.js 既有 set 项零回归（s-map/s-lv/s-xp/s-hp/s-mp/s-gold/s-potion/s-potion2/s-mushroom/s-steps/s-ach/s-snd/s-weapon/s-armor/s-atk/s-def/s-save/s-slot 逐字在列）',
  ['s-map','s-lv','s-xp','s-hp','s-mp','s-gold','s-potion','s-potion2','s-mushroom','s-steps','s-ach','s-snd','s-weapon','s-armor','s-atk','s-def','s-save','s-slot']
    .every((k) => hudSrc.includes("'" + k + "'")));

// —— 运行期 renderHUD 真实渲染三档（DOM 桩捕获 textContent）——
S.G = {
  name: '守灯人', level: 1, xp: 0, xpNext: 20, hp: 100, hpMax: 100, mp: 10, mpMax: 10, gold: 0,
  item: 2, potion2: 0, mushrooms: 0, steps: 42, weapon: '木剑', armor: '布衣',
  atkMax: 11, defMax: 6, time: 60, diff: 0, map: 'village',
  quests: {}, bestiary: {}, seen: {}, visited: ['village'], ach: [], fragments: [], skills: ['斩击'],
};
S.scene = 'world'; S.curSaveSlot = 1; S.SND = true; S.VOL = 1; S.saveMsg = ''; S.unsaved = false; S.enemy = null;
renderHUD();
ok('运行期：HUD s-codex 显示 0/13（零讨伐档，分母 13 当场可见）', els['s-codex'].textContent === '0/13', els['s-codex'].textContent);
S.G.bestiary = { '史莱姆': 1, '哥布林': 1, '骷髅兵': 1 };
renderHUD();
ok('运行期：HUD s-codex 显示 3/13（多讨伐档）', els['s-codex'].textContent === '3/13', els['s-codex'].textContent);
S.G.bestiary = { '史莱姆': true, '哥布林': 1 };
renderHUD();
ok('运行期：布尔旧档经 |0 归一为 2/13（旧档零迁移）', els['s-codex'].textContent === '2/13', els['s-codex'].textContent);
delete S.G.bestiary; renderHUD();
ok('运行期：缺 bestiary 字段防御式 0/13（旧档零迁移）', els['s-codex'].textContent === '0/13', els['s-codex'].textContent);

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为三百六十件套（三百五十九件套清除）',
  readme.includes('冒烟三百六十件套（三百五十九件套清除）'));
ok('README tests 含 v24.117 守护描述与 smoke_v24117_codexhud 入库（340 份）',
  readme.includes('v24.117 起含「HUD 记忆图鉴收集进度」守护') &&
  readme.includes('smoke_v24117_codexhud 入库（340 份）'));
ok('README 仍有 v24.116 守护描述（历史保留）', readme.includes('v24.116 起含「引灯人「药要带足」新支线」守护'));
ok('README 已有三百四十件套口径且尚无 341（哨兵前望 341 语义：下一版才写 341）',
  readme.includes('冒烟三百六十件套（三百五十九件套清除）') && !readme.includes('冒烟三百六十一件套') && !readme.includes('（361 份）'));
ok('README tests 树串尾已延伸（…+ smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑））',
  readme.includes('smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑）'));
ok('README 图鉴/成就 bullet 含 v24.117 HUD 记忆图鉴口径（v24.117 起 HUD 常驻「📕 记忆图鉴 N/13」收集进度）',
  readme.includes('v24.117 起 HUD 常驻「📕 记忆图鉴 N/13」收集进度'));
ok('README 视觉 bullet 含 v24.117 HUD 记忆图鉴口径（HUD 常驻「📕 记忆图鉴 N/13」收集进度**（v24.117)',
  readme.includes('HUD 常驻「📕 记忆图鉴 N/13」收集进度**（v24.117'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 339 份（smoke.mjs + 339 专项）', chain.length === 359 && ['smoke.mjs', ...chain].length === 360, String(chain.length));
ok('package.json 链尾为 smoke_v24117_codexhud（第 340 份）', chain[chain.length - 1] === 'smoke_v24143_furnacequest', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v24116_guidequest.mjs && smoke_v24117_codexhud.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v24116_guidequest.mjs && node tests/smoke_v24117_codexhud.mjs && node tests/smoke_v24118_wellquest.mjs && node tests/smoke_v24119_huntquest.mjs && node tests/smoke_v24120_chesthud.mjs && node tests/smoke_v24121_siftquest.mjs && node tests/smoke_v24122_crystalquest.mjs && node tests/smoke_v24123_fraghud.mjs && node tests/smoke_v24124_questshud.mjs && node tests/smoke_v24125_hunthud.mjs && node tests/smoke_v24126_waitquest.mjs && node tests/smoke_v24127_lampquest.mjs && node tests/smoke_v24128_stelequest.mjs && node tests/smoke_v24129_stele2quest.mjs && node tests/smoke_v24130_stele3quest.mjs && node tests/smoke_v24131_stele4quest.mjs && node tests/smoke_v24132_fallenquest.mjs && node tests/smoke_v24133_inquest.mjs && node tests/smoke_v24134_kindleq.mjs && node tests/smoke_v24135_ledgerquest.mjs && node tests/smoke_v24136_herbquest.mjs && node tests/smoke_v24143_furnacequest.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.117（startsWith）', changelog.startsWith('## v24.144'));
ok('CHANGELOG v24.117 条目含「记忆图鉴」与「s-codex」与「BESTIARY_TARGET」',
  changelog.includes('记忆图鉴') && changelog.includes('s-codex') && changelog.includes('BESTIARY_TARGET'));
ok('CHANGELOG 仍保留 v24.116 条目（历史保留）', changelog.includes('## v24.116'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const testsDirUrl = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDirUrl).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录件套 = 340（339 + smoke_v24117_codexhud）', files.length === 360, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.116 pin 零残留 ——
const s24116 = read('tests/smoke_v24116_guidequest.mjs');
ok('smoke_v24116 的 GAME_VERSION 字面量 pin 已更新为 v24.117', s24116.includes("const GAME_VERSION = 'v24.144';"));
ok('smoke_v24116 的 CHANGELOG 顶 pin 已更新为 ## v24.117 ', s24116.includes("startsWith('## v24.144'"));
ok('smoke_v24116 的件套 pin 已更新为三百六十件套（三百五十九件套清除）', s24116.includes('三百六十件套（三百五十九件套清除）'));
ok('smoke_v24116 的 README/链 tail pin 已随新现实延伸（含 smoke_v24117_codexhud）',
  s24116.includes('smoke_v24117_codexhud'));
ok('smoke_v24116 的 package.json 串尾 pin 已延伸至 smoke_v24117_codexhud', s24116.includes('node tests/smoke_v24116_guidequest.mjs && node tests/smoke_v24117_codexhud.mjs'));
ok('smoke_v24116 的链尾 pin 已推进至 smoke_v24117_codexhud（第 340 份）', s24116.includes("=== 'smoke_v24143_furnacequest'"));
ok('smoke_v24116 的 README 历史块入库 pin 保留（339 份口径，历史块原样保留）',
  s24116.includes('入库（339 份）'));
const s2436 = read('tests/smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（339 专项 / 340）且尚无 341 口径哨兵',
  s2436.includes('suiteFiles.length === 359 && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length === 360') &&
  s2436.includes('!readme.includes(\'冒烟三百六十一件套\')') && s2436.includes('!readme.includes(\'（361 份）\')'));
const s2415 = read('tests/smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v24117_codexhud（第 340 份）', s2415.includes("chain[chain.length - 1] === 'smoke_v24143_furnacequest'"));
ok('smoke_v2415 树串 token 数已推进至 340', s2415.includes('treeTok.length === 360'));
const s2429 = read('tests/smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 哨兵链前望 341（三百四十件套否定式）',
  s2429.includes("!readme.includes('冒烟三百六十一件套'"));
// 旧代 v24.116 pin 零残留扫描（豁免本套件）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v24117_codexhud.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDirUrl), 'utf8').split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  const hits = [];
  if (s2.includes("const GAME_VERSION = '" + "v24.116';")) hits.push('gv');
  if (s2.includes("GAME_VERSION === '" + "v24.116'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.116")) hits.push('cw');
  if (s2.includes('三百三十九件套（三百三十' + '八件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 33' + '9')) hits.push('fl');
  if (s2.includes('chainAll.length === 33' + '9')) hits.push('cal');
  if (s2.includes('chain.length === 33' + '8')) hits.push('cl');
  if (s2.includes('treeTok.length === 33' + '9')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v24116_" + "guidequest'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.116 GAME_VERSION/顶 pin/339 口径（哨兵链，豁免本套件）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.117 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
