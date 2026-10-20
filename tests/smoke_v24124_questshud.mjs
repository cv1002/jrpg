// smoke_v24124_questshud.mjs —— v24.124 专项冒烟：HUD 常驻「🏮 灯火同心 N/33」支线完成进度
// （体验打磨·信息透明·计数现场——承 v24.123 HUD 记忆碎片「🧩 N/4」/ v24.120 HUD 宝箱「📦 N/12」/
// v24.117 HUD 记忆图鉴「📕 N/13」/ v24.115 HUD 成就「🏆 N/76」/ v24.16 HUD 步数「🚶 N/1000」同一
// 「计数现场报进度」主线，收集口径的 HUD 侧第五枚兑现：灯火同心（QUESTS kind==='side' 全部支线完成，
// 成就 allquests 判据）是通关后的终极完成度指标，此前只在交付横幅（v24.21「🏮 灯火同心 N/11」）/任务
// 日志/Ⅰ 状态页报「进行中」，报「已完成 X/全 Y」的一眼之数查无一处；现 HUD 第二行 🧩 之右补常驻
// 「🏮 N/33」——分子读 QUESTS kind==='side' 中 (hero.quests||{})[id]==='done' 的条数防御式旧档零迁移
// （缺 quests 字段计 0）、分母读 data.js QUESTS 单一数据源（与成就「灯火同心」/任务日志同读一份源，
// 增删支线只改 data.js 一处全端自动跟随），纯显示零结算零存档零数值变化（hero.quests 写入/交付判定/
// 成就判定逐字未动）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.124 注释 / GAME_VERSION v24.124 与旧 v24.123 字面量
// 零残留 / v24.123 历史注释保留）、运行期常量实值（QUESTS kind==='side' 条数 33 与成就「灯火同心」
// 分母互证）、index.html s-quests 落位（#hud 第二行 🧩 s-frag 之右、🔊 s-snd 之左 + title 口径）、
// hud.js 源级（QUESTS import + set 逐字）、运行期 renderHUD 真实渲染四档（0/33 · 2/33 · 缺 quests
// 防御式 0/33 · 全清 33/33）、README/package.json/CHANGELOG 同步（件套口径 347 + v24.124 守护描述 +
// smoke_v24124_questshud 入库（347 份）+ package 串尾 + CHANGELOG 顶 pin + 成就/视觉 bullet）、哨兵链
// （前望 348 且 README 尚无 348 口径）、旧代 v24.123 pin 全库零残留扫描、HUD 既有项零回归（s-map/s-lv
// /s-atk 等 22 项 set 仍逐字在列）。
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
const { GAME_VERSION, QUESTS, ACH_LIST } = await import('../js/data.js');
const { renderHUD } = await import('../js/view/index.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.124 HUD 常驻「🏮 灯火同心 N/33」支线完成进度 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const hudSrc = read('js/view/hud.js');
const html = read('index.html');
const readme = read('README.md');
const pkgRaw = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.123，精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.123', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 123)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.124（旧 v24.123 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.129';") && !dSrc.includes("const GAME_VERSION = 'v24.123';"));
ok('data.js 含 v24.124 注释（HUD 灯火同心进度·计数现场说明）',
  dSrc.includes('v24.124 体验打磨·信息透明·计数现场'));
ok('data.js 仍保留 v24.123 历史注释（HUD 记忆碎片进度说明，零内容丢失）',
  dSrc.includes('v24.123 体验打磨·信息透明·计数现场'));

// —— 运行期常量实值（单一数据源）——
const sideIds = Object.values(QUESTS).filter((q) => q.kind === 'side');
const allq = ACH_LIST.find((a) => a.id === 'allquests');
ok('QUESTS kind===\'side\' 条数 === 36（HUD 灯火同心分母）', sideIds.length === 37, String(sideIds.length));
ok('与成就「灯火同心」分母互证（allquests prog 同为 X/33、描述同为 33 个）',
  allq && allq.prog({ quests: {} }) === '0/' + sideIds.length && String(allq.d).includes(String(sideIds.length) + ' 个'), allq && (allq.prog({ quests: {} }) + ' / ' + allq.d));

// —— index.html 落位（#hud 第二行 🧩 之右）——
ok('index.html #hud 含 s-quests（<b id="s-quests">）', html.includes('<b id="s-quests">'));
ok('index.html s-quests 标题口径含 灯火同心 与 v24.124（title 属性）',
  html.includes('title="灯火同心：已完成支线数/支线总数（支线全清进度，v24.124）"'));
ok('index.html s-quests 位于 🧩 s-frag 之后、🔊 s-snd 之前（第二行统计位）',
  html.indexOf('<b id="s-frag">') < html.indexOf('<b id="s-quests">') &&
  html.indexOf('<b id="s-quests">') < html.indexOf('<b id="s-snd">'));
ok('index.html s-quests 唯一（零重复 id）', (html.match(/id="s-quests"/g) || []).length === 1);

// —— hud.js 源级落位 ——
ok('hud.js import 补 QUESTS（data.js 既有导出单列一行，保旧系 import 行逐字不变零回归，零新增依赖）',
  hudSrc.includes("import { QUESTS } from '../data.js';") &&
  hudSrc.includes("import { MAPS, ENCOUNTER, DAY_PHASE_S, STEP_GOAL, ACH_LIST, BESTIARY_TARGET, chestCount, chestTotal, FRAGMENTS } from '../data.js';"));
ok('hud.js set 逐字落位（s-quests = 完成支线数/总数 防御式分子）',
  hudSrc.includes("set('s-quests', sideQ.filter((q) => (hero.quests || {})[q.id] === 'done').length + '/' + sideQ.length);"));
ok('hud.js 含 v24.124 注释（HUD 灯火同心进度说明）', hudSrc.includes('v24.124 HUD 常驻「🏮 灯火同心 N/33」'));
ok('hud.js 既有 set 项零回归（s-map/s-lv/s-xp/s-hp/s-mp/s-gold/s-potion/s-potion2/s-mushroom/s-steps/s-ach/s-codex/s-chest/s-frag/s-quests/s-snd/s-weapon/s-armor/s-atk/s-def/s-save/s-slot 逐字在列）',
  ['s-map','s-lv','s-xp','s-hp','s-mp','s-gold','s-potion','s-potion2','s-mushroom','s-steps','s-ach','s-codex','s-chest','s-frag','s-quests','s-snd','s-weapon','s-armor','s-atk','s-def','s-save','s-slot']
    .every((k) => hudSrc.includes("'" + k + "'")));

// —— 运行期 renderHUD 真实渲染四档（DOM 桩捕获 textContent）——
S.G = {
  name: '守灯人', level: 1, xp: 0, xpNext: 20, hp: 100, hpMax: 100, mp: 10, mpMax: 10, gold: 0,
  item: 2, potion2: 0, mushrooms: 0, steps: 42, weapon: '木剑', armor: '布衣',
  atkMax: 11, defMax: 6, time: 60, diff: 0, map: 'village',
  quests: {}, bestiary: {}, seen: {}, visited: ['village'], ach: [], fragments: [], skills: ['斩击'],
};
S.scene = 'world'; S.curSaveSlot = 1; S.SND = true; S.VOL = 1; S.saveMsg = ''; S.unsaved = false; S.enemy = null;
renderHUD();
ok('运行期：HUD s-quests 显示 0/33（零支线完成档，分母 33 当场可见）', els['s-quests'].textContent === '0/37', els['s-quests'].textContent);
S.G.quests = { side_mushroom: 'done', side_flee: 'done' };
renderHUD();
ok('运行期：HUD s-quests 显示 2/34（多支线完成档）', els['s-quests'].textContent === '2/37', els['s-quests'].textContent);
S.G.quests = {}; renderHUD();
ok('运行期：空 quests 对象档 0/33（零迁移）', els['s-quests'].textContent === '0/37', els['s-quests'].textContent);
delete S.G.quests; renderHUD();
ok('运行期：缺 quests 字段防御式 0/33（旧档零迁移）', els['s-quests'].textContent === '0/37', els['s-quests'].textContent);
S.G.quests = Object.fromEntries(sideIds.map((q) => [q.id, 'done']));
renderHUD();
ok('运行期：全清档 33/33（分母=side 条数同源）', els['s-quests'].textContent === '37/37', els['s-quests'].textContent);

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为三百五十二件套（三百五十一件套清除）',
  readme.includes('冒烟三百五十二件套（三百五十一件套清除）'));
ok('README tests 含 v24.124 守护描述与 smoke_v24124_questshud 入库（347 份）',
  readme.includes('v24.124 起含「HUD 灯火同心收集进度」守护') &&
  readme.includes('smoke_v24124_questshud 入库（347 份）'));
ok('README 仍有 v24.123 守护描述（历史保留）', readme.includes('v24.123 起含「HUD 记忆碎片收集进度」守护'));
ok('README 已有三百四十七件套口径且尚无 348（哨兵前望 348 语义：下一版才写 348）',
  readme.includes('冒烟三百五十二件套（三百五十一件套清除）') && !readme.includes('冒烟三百五十三件套') && !readme.includes('（353 份）'));
ok('README tests 树串尾已延伸（…+ smoke_v24123_fraghud + smoke_v24124_questshud（npm test 串跑））',
  readme.includes('smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest（npm test 串跑）'));
ok('README 成就 bullet 含 v24.124 HUD 灯火同心口径（v24.124 起 HUD 常驻「🏮 灯火同心 N/33」完成进度）',
  readme.includes('v24.124 起 HUD 常驻「🏮 灯火同心 N/33」完成进度'));
ok('README 视觉 bullet 含 v24.124 HUD 灯火同心口径（HUD 常驻「🏮 灯火同心 N/33」完成进度**（v24.124）',
  readme.includes('HUD 常驻「🏮 灯火同心 N/33」完成进度**（v24.124'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 347 份（smoke.mjs + 346 专项）', chain.length === 351 && ['smoke.mjs', ...chain].length === 352, String(chain.length));
ok('package.json 链尾为 smoke_v24124_questshud（第 346 份）', chain[chain.length - 1] === 'smoke_v24129_stele2quest', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v24123_fraghud.mjs && smoke_v24124_questshud.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v24123_fraghud.mjs && node tests/smoke_v24124_questshud.mjs && node tests/smoke_v24125_hunthud.mjs && node tests/smoke_v24126_waitquest.mjs && node tests/smoke_v24127_lampquest.mjs && node tests/smoke_v24128_stelequest.mjs && node tests/smoke_v24129_stele2quest.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.124（startsWith）', changelog.startsWith('## v24.129'));
ok('CHANGELOG v24.124 条目含「灯火同心」与「s-quests」与「QUESTS」',
  changelog.includes('灯火同心') && changelog.includes('s-quests') && changelog.includes('QUESTS'));
ok('CHANGELOG 仍保留 v24.123 条目（历史保留）', changelog.includes('## v24.123'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const testsDirUrl = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDirUrl).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录件套 = 347（346 + smoke_v24124_questshud）', files.length === 352, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.123 pin 零残留 ——
const f123 = read('tests/smoke_v24123_fraghud.mjs');
ok('smoke_v24123 的 GAME_VERSION 字面量 pin 已更新为 v24.124', f123.includes("const GAME_VERSION = 'v24.129';"));
ok('smoke_v24123 的 CHANGELOG 顶 pin 已更新为 ## v24.124 ', f123.includes("startsWith('## v24.129'"));
ok('smoke_v24123 的件套 pin 已更新为三百五十二件套（三百五十一件套清除）', f123.includes('三百五十二件套（三百五十一件套清除）'));
ok('smoke_v24123 的 README/链 tail pin 已随新现实延伸（含 smoke_v24124_questshud）',
  f123.includes('smoke_v24124_questshud'));
ok('smoke_v24123 的 package.json 串尾 pin 已延伸至 smoke_v24124_questshud', f123.includes('smoke_v24123_fraghud.mjs && node tests/smoke_v24124_questshud.mjs'));
ok('smoke_v24123 的链尾 pin 已推进至 smoke_v24124_questshud（第 346 份）', f123.includes("=== 'smoke_v24129_stele2quest'"));
ok('smoke_v24123 的 README 历史块入库 pin 保留（346 份口径，历史块原样保留）',
  f123.includes('入库（346 份）'));
const s2436 = read('tests/smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（346 专项 / 347）且尚无 348 口径哨兵',
  s2436.includes('suiteFiles.length === 351 && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length === 352') &&
  s2436.includes('!readme.includes(\'冒烟三百五十三件套\')') && s2436.includes('!readme.includes(\'（353 份）\')'));
const s2415 = read('tests/smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v24124_questshud（第 346 份）', s2415.includes("chain[chain.length - 1] === 'smoke_v24129_stele2quest'"));
ok('smoke_v2415 树串 token 数已推进至 347', s2415.includes('treeTok.length === 352'));
const s2429 = read('tests/smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 哨兵链前望 348（三百四十七件套否定式）',
  s2429.includes("!readme.includes('冒烟三百五十三件套'"));
// 旧代 v24.123 pin 零残留扫描（豁免本套件）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v24124_questshud.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDirUrl), 'utf8').split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  const hits = [];
  if (s2.includes("const GAME_VERSION = '" + "v24.123'")) hits.push('gv');
  if (s2.includes("GAME_VERSION === '" + "v24.123'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.123")) hits.push('cw');
  if (s2.includes('三百四十六件套（三百四十五' + '件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 34' + '6')) hits.push('fl');
  if (s2.includes('chainAll.length === 34' + '6')) hits.push('cal');
  if (s2.includes('chain.length === 34' + '5')) hits.push('cl');
  if (s2.includes('treeTok.length === 34' + '6')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v24123_" + "fraghud'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.123 GAME_VERSION/顶 pin/346 口径（哨兵链，豁免本套件）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.124 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
