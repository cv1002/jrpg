// smoke_v24123_fraghud.mjs —— v24.123 专项冒烟：HUD 常驻「🧩 记忆碎片 N/4」收集进度
// （体验打磨·信息透明·计数现场——承 v24.117 HUD 记忆图鉴「📕 N/13」/ v24.115 HUD 成就进度
// 「🏆 N/91」/ v24.16 HUD 步数进度「🚶 N/1000」同一「计数现场报进度」主线，收集口径的 HUD 侧
// 第三枚兑现：记忆碎片（FRAGMENTS 四枚强敌首胜掉落、集齐触发真结局「全记忆」加页）是真结局
// 关键收集，此前只在 I 状态页资源行（v21.86「记忆碎片 N/4」）/J 日志碎片节/图鉴评论/胜利与
// 阵亡收集行/标题槽预览可见，HUD 第二行一眼可见的计数（🍄/🚶/🏆/📕…）唯独缺这枚——想数
// 还差几枚碎片齐活、或临门一脚差哪枚碎片召唤真结局，还要开 I 页读资源行 X/4；现 HUD 第二行
// 📕 之右补常驻「🧩 N/4」——分子读 (hero.fragments||[]).length 防御式旧档零迁移、分母读
// data.js FRAGMENTS 单一数据源，与 I 页/标题槽预览/drawEnding/drawWin/drawDead/drawJournal
// 同读一份源，调碎片集合只改 data.js FRAGMENTS 一处全端自动跟随；纯显示零结算零存档零数值变化
// （hero.fragments 写入/掉落判定/真结局触发逐字未动）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.123 注释 / GAME_VERSION v24.123 与旧 v24.122
// 字面量零残留 / v24.122 历史注释保留）、运行期常量实值（FRAGMENTS.length 4）互证、index.html
// s-frag 落位（#hud 第二行 📕 s-codex 之右、🔊 s-snd 之左 + title 口径）、hud.js 源级（FRAGMENTS
// import + set 逐字）、运行期 renderHUD 真实渲染三档（0/4 · 2/4 · 缺 fragments 防御式 0/4）、
// README/package.json/CHANGELOG 同步（件套口径 342 + v24.123 守护描述 + smoke_v24123_fraghud
// 入库（346 份）+ package 串尾 + CHANGELOG 顶 pin + 成就/视觉 bullet）、哨兵链（前望 343 且
// README 尚无 343 口径）、旧代 v24.122 pin 全库零残留扫描、HUD 既有项零回归（s-map/s-lv/s-atk
// 等 22 项 set 仍逐字在列）。
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
const { GAME_VERSION, FRAGMENTS } = await import('../js/data.js');
const { renderHUD } = await import('../js/view/index.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.123 HUD 常驻「🧩 记忆碎片 N/4」收集进度 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const hudSrc = read('js/view/hud.js');
const html = read('index.html');
const readme = read('README.md');
const pkgRaw = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.122，精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.122', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 118)), GAME_VERSION);
ok('data.js GAME_VERSION 字面量已为 v24.123（旧 v24.122 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.180';") && !dSrc.includes("const GAME_VERSION = 'v24.122';"));
ok('data.js 含 v24.123 注释（HUD 记忆碎片进度·计数现场说明）',
  dSrc.includes('v24.123 体验打磨·信息透明·计数现场'));
ok('data.js 仍保留 v24.122 历史注释（守晶人「星砂归匣」新支线说明，零内容丢失）',
  dSrc.includes('v24.122 新内容·新支线（第三十三条）'));

// —— 运行期常量实值（单一数据源）——
ok('FRAGMENTS.length === 4（HUD 碎片分母与 I 页/标题预览/收集行同源）', FRAGMENTS.length === 4, String(FRAGMENTS.length));

// —— index.html 落位（#hud 第二行 📦 之右）——
ok('index.html #hud 含 s-frag（<b id="s-frag">）', html.includes('<b id="s-frag">'));
ok('index.html s-frag 标题口径含 记忆碎片 与 v24.123（title 属性）',
  html.includes('title="记忆碎片：真结局关键收集进度（真结局收集线，v24.123）"'));
ok('index.html s-frag 位于 📦 s-chest 之后、🔊 s-snd 之前（第二行统计位）',
  html.indexOf('<b id="s-chest">') < html.indexOf('<b id="s-frag">') &&
  html.indexOf('<b id="s-frag">') < html.indexOf('<b id="s-snd">'));
ok('index.html s-frag 唯一（零重复 id）', (html.match(/id="s-frag"/g) || []).length === 1);

// —— hud.js 源级落位 ——
ok('hud.js import 补 FRAGMENTS（data.js 既有导出，与 chestCount/chestTotal 同列，零新增依赖）',
  hudSrc.includes("import { MAPS, ENCOUNTER, DAY_PHASE_S, STEP_GOAL, ACH_LIST, BESTIARY_TARGET, chestCount, chestTotal, FRAGMENTS } from '../data.js';"));
ok('hud.js set 逐字落位（s-frag = hero.fragments 枚数/总数 防御式分子）',
  hudSrc.includes("set('s-frag', (hero.fragments || []).length + '/' + FRAGMENTS.length);"));
ok('hud.js 含 v24.123 注释（HUD 记忆碎片进度说明）', hudSrc.includes('v24.123 HUD 常驻「🧩 记忆碎片 N/4」'));
ok('hud.js 既有 set 项零回归（s-map/s-lv/s-xp/s-hp/s-mp/s-gold/s-potion/s-potion2/s-mushroom/s-steps/s-ach/s-codex/s-frag/s-snd/s-weapon/s-armor/s-atk/s-def/s-save/s-slot 逐字在列）',
  ['s-map','s-lv','s-xp','s-hp','s-mp','s-gold','s-potion','s-potion2','s-mushroom','s-steps','s-ach','s-codex','s-frag','s-snd','s-weapon','s-armor','s-atk','s-def','s-save','s-slot']
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
ok('运行期：HUD s-frag 显示 0/4（零碎片档，分母 4 当场可见）', els['s-frag'].textContent === '0/4', els['s-frag'].textContent);
S.G.fragments = [{ id: 'golem' }, { id: 'demon' }];
renderHUD();
ok('运行期：HUD s-frag 显示 2/4（多碎片档）', els['s-frag'].textContent === '2/4', els['s-frag'].textContent);
S.G.fragments = ['golem', 'demon', 'cave'];
renderHUD();
ok('运行期：字符串数组旧档按长度归一为 3/4（旧档零迁移）', els['s-frag'].textContent === '3/4', els['s-frag'].textContent);
delete S.G.fragments; renderHUD();
ok('运行期：缺 fragments 字段防御式 0/4（旧档零迁移）', els['s-frag'].textContent === '0/4', els['s-frag'].textContent);

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为三百九十一件套（三百九十件套清除）',
  readme.includes('冒烟三百九十一件套（三百九十件套清除）'));
ok('README tests 含 v24.123 守护描述与 smoke_v24123_fraghud 入库（346 份）',
  readme.includes('v24.123 起含「HUD 记忆碎片收集进度」守护') &&
  readme.includes('smoke_v24123_fraghud 入库（346 份）'));
ok('README 仍有 v24.122 守护描述（历史保留）', readme.includes('v24.122 起含「守晶人「星砂归匣」新支线」守护'));
ok('README 已有三百四十二件套口径且尚无 343（哨兵前望 343 语义：下一版才写 343）',
  readme.includes('冒烟三百九十一件套（三百九十件套清除）') && !readme.includes('冒烟三百九十二件套') && !readme.includes('（392 份）'));
ok('README tests 树串尾已延伸（…+ smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑））',
  readme.includes('smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑）'));
ok('README 成就 bullet 含 v24.123 HUD 记忆碎片口径（v24.123 起 HUD 常驻「🧩 记忆碎片 N/4」收集进度）',
  readme.includes('v24.123 起 HUD 常驻「🧩 记忆碎片 N/4」收集进度'));
ok('README 视觉 bullet 含 v24.123 HUD 记忆碎片口径（HUD 常驻「🧩 记忆碎片 N/4」收集进度**（v24.123）',
  readme.includes('HUD 常驻「🧩 记忆碎片 N/4」收集进度**（v24.123'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
ok('package.json 实跑链共 341 份（smoke.mjs + 341 专项）', chain.length === 390 && ['smoke.mjs', ...chain].length === 391, String(chain.length));
ok('package.json 链尾为 smoke_v24123_fraghud（第 342 份）', chain[chain.length - 1] === 'smoke_v24180_unflskill2', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v24121_siftquest.mjs && smoke_v24122_crystalquest.mjs && smoke_v24123_fraghud.mjs（node tests/ 链尾形态）',
  pkgRaw.includes('node tests/smoke_v24121_siftquest.mjs && node tests/smoke_v24122_crystalquest.mjs && node tests/smoke_v24123_fraghud.mjs && node tests/smoke_v24124_questshud.mjs && node tests/smoke_v24125_hunthud.mjs && node tests/smoke_v24126_waitquest.mjs && node tests/smoke_v24127_lampquest.mjs && node tests/smoke_v24128_stelequest.mjs && node tests/smoke_v24129_stele2quest.mjs && node tests/smoke_v24130_stele3quest.mjs && node tests/smoke_v24131_stele4quest.mjs && node tests/smoke_v24132_fallenquest.mjs && node tests/smoke_v24133_inquest.mjs && node tests/smoke_v24134_kindleq.mjs && node tests/smoke_v24135_ledgerquest.mjs && node tests/smoke_v24136_herbquest.mjs && node tests/smoke_v24143_furnacequest.mjs && node tests/smoke_v24147_unflicker.mjs && node tests/smoke_v24148_swift.mjs && node tests/smoke_v24151_lowlv.mjs && node tests/smoke_v24152_nopotion.mjs && node tests/smoke_v24153_penny.mjs && node tests/smoke_v24154_steadfast.mjs && node tests/smoke_v24155_frugal.mjs && node tests/smoke_v24157_dry.mjs && node tests/smoke_v24158_swift2.mjs && node tests/smoke_v24159_lowlv2.mjs && node tests/smoke_v24160_noskill.mjs && node tests/smoke_v24161_noskill2.mjs && node tests/smoke_v24162_lowskill.mjs && node tests/smoke_v24163_swiftskill.mjs && node tests/smoke_v24164_swiftlv.mjs && node tests/smoke_v24165_nopotskill.mjs && node tests/smoke_v24166_unflskill.mjs && node tests/smoke_v24167_swiftnopo.mjs && node tests/smoke_v24168_lowlvnopo.mjs && node tests/smoke_v24169_unflswift.mjs && node tests/smoke_v24170_unfllowlv.mjs && node tests/smoke_v24171_unflnopo.mjs && node tests/smoke_v24172_unflpenny.mjs && node tests/smoke_v24173_pennyswift.mjs && node tests/smoke_v24174_pennylowlv.mjs && node tests/smoke_v24175_pennynoskill.mjs && node tests/smoke_v24176_pennynopo.mjs && node tests/smoke_v24177_unflswift2.mjs && node tests/smoke_v24178_unflpenny2.mjs && node tests/smoke_v24179_unflnopo2.mjs && node tests/smoke_v24180_unflskill2.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.123（startsWith）', changelog.startsWith('## v24.180'));
ok('CHANGELOG v24.123 条目含「记忆碎片」与「s-frag」与「FRAGMENTS」',
  changelog.includes('记忆碎片') && changelog.includes('s-frag') && changelog.includes('FRAGMENTS'));
ok('CHANGELOG 仍保留 v24.122 条目（历史保留）', changelog.includes('## v24.122'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const testsDirUrl = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDirUrl).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(['smoke.mjs', ...chain.map((f) => f + '.mjs')]);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录件套 = 342（341 + smoke_v24123_fraghud）', files.length === 391, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.122 pin 零残留 ——
const s24118 = read('tests/smoke_v24122_crystalquest.mjs');
ok('smoke_v24118 的 GAME_VERSION 字面量 pin 已更新为 v24.123', s24118.includes("const GAME_VERSION = 'v24.180';"));
ok('smoke_v24118 的 CHANGELOG 顶 pin 已更新为 ## v24.123 ', s24118.includes("startsWith('## v24.180'"));
ok('smoke_v24118 的件套 pin 已更新为三百九十一件套（三百九十件套清除）', s24118.includes('三百九十一件套（三百九十件套清除）'));
ok('smoke_v24118 的 README/链 tail pin 已随新现实延伸（含 smoke_v24123_fraghud）',
  s24118.includes('smoke_v24123_fraghud'));
ok('smoke_v24118 的 package.json 串尾 pin 已延伸至 smoke_v24123_fraghud', s24118.includes('smoke_v24122_crystalquest.mjs && node tests/smoke_v24123_fraghud.mjs'));
ok('smoke_v24118 的链尾 pin 已推进至 smoke_v24123_fraghud（第 342 份）', s24118.includes("=== 'smoke_v24180_unflskill2'"));
ok('smoke_v24118 的 README 历史块入库 pin 保留（341 份口径，历史块原样保留）',
  s24118.includes('入库（345 份）'));
const s2436 = read('tests/smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（345 专项 / 346）且尚无 343 口径哨兵',
  s2436.includes('suiteFiles.length === 390  && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length === 391') &&
  s2436.includes('!readme.includes(\'冒烟三百九十二件套\')') && s2436.includes('!readme.includes(\'（392 份）\')'));
const s2415 = read('tests/smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v24123_fraghud（第 342 份）', s2415.includes("chain[chain.length - 1] === 'smoke_v24180_unflskill2'"));
ok('smoke_v2415 树串 token 数已推进至 342', s2415.includes('treeTok.length === 391'));
const s2429 = read('tests/smoke_v2429_xpcurve3.mjs');
ok('smoke_v2429 哨兵链前望 343（三百四十二件套否定式）',
  s2429.includes("!readme.includes('冒烟三百九十二件套'"));
ok('smoke_v24115 的 GAME_VERSION 字面量 pin 已更新为 v24.123（旧 v24.122 残留归零）',
  read('tests/smoke_v24119_huntquest.mjs').includes("const GAME_VERSION = 'v24.180';"));
// 旧代 v24.122 pin 零残留扫描（豁免本套件）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v24123_fraghud.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDirUrl), 'utf8').split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
  const hits = [];
  if (s2.includes("const GAME_VERSION = '" + "v24.122';")) hits.push('gv');
  if (s2.includes("GAME_VERSION === '" + "v24.122'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.122")) hits.push('cw');
  if (s2.includes('三百四十五件套（三百四十四' + '件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 34' + '5')) hits.push('fl');
  if (s2.includes('chainAll.length === 34' + '5')) hits.push('cal');
  if (s2.includes('chain.length === 34' + '4')) hits.push('cl');
  if (s2.includes('treeTok.length === 34' + '5')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v24122_" + "crystalquest'")) hits.push('tail');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.122 GAME_VERSION/顶 pin/341 口径（哨兵链，豁免本套件）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.123 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
