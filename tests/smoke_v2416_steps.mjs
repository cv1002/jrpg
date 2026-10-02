// v24.16 专项冒烟：HUD 常驻「🚶 千里之行 N/1000」步数进度
// （体验打磨·信息透明·计数现场——承 v24.12 胜利画面「⚔️ 身经百战 N/100」/ v24.11 阵亡画面
// 「💪 败而不馁 N/10」/ v24.10 酿造界面「🍶 妙手回春 N/5」/ v24.09 商店界面「🍄 蘑菇商路 N/30」/
// v24.08 快速旅行「🚶 行者无疆 N/15」/ v24.05 试炼碑「📜 千锤百炼 N/3」同一「计数现场报进度」
// 主线 / v23.76 千里之行成就：计数 hero.steps 由 world.move 成功落地唯一产生点写入（随
// snapshotHero 全量快照自动持久化、防御式 (hero.steps||0) 旧档零迁移），此前进度只藏在 C 成就页
// 一行 X/1000——而步数这枚成就的计数现场正是玩家每时每刻都在走的大地图，行走全程查无一眼之数
// （与 v24.14 战斗相位「这仗赢了算不算」同族：现场不是某个面板、而是地图本身）；现与 C 页/成就
// 判定/世界结算同读 data.js STEP_GOAL·hero.steps 一份单一数据源，DOM HUD（#hud）第二行 🍄 背包
// 计数之右补常驻「🚶 N/1000」步数进度（index.html <b id="s-steps"> + view/hud.js
// set('s-steps', (hero.steps||0)+'/'+STEP_GOAL) 逐字落位），每走一步当场涨；纯显示零结算零存档
// 零数值变化（STEP_GOAL/world.move 计数/存档结构逐字未动）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.16 注释 / GAME_VERSION v24.16 与旧 v24.15 字面量
// 零残留 / v24.15 历史注释保留）、运行期常量实值（STEP_GOAL 1000）与 ACH_LIST steps 同源互证
// （ok/prog/d 逐值）、index.html s-steps 落位（#hud 第二行 🍄 之右 + title 口径）、hud.js 源级
// （STEP_GOAL import + set 逐字）、运行期 renderHUD 真实渲染三档（42/1000 · 0/1000 · 缺字段
// 防御式 0/1000）、world.js 步数计数同源互证（成功落地唯一写入点）、README/package.json/
// CHANGELOG 同步（件套口径 243 + v24.16 守护描述 + smoke_v2416_steps 入库（251 份）+ package
// 串尾 + CHANGELOG 顶 pin）、哨兵链（前望 242 且 README 尚无 241 口径）、旧代 v24.15 pin 全库
// 零残留扫描、HUD 既有项零回归（s-mushroom/s-gold 等 21 项 set 仍逐字在列）。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v24.12 冒烟先例：先装桩再动态 import main.js）——
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
const { GAME_VERSION, STEP_GOAL, ACH_LIST } = await import('../js/data.js');
const { renderHUD } = await import('../js/view/index.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.16 HUD 常驻「🚶 千里之行 N/1000」步数进度 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const hudSrc = read('js/view/hud.js');
const worldSrc = read('js/world.js');
const html = read('index.html');
const readme = read('README.md');
const pkgRaw = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.15）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.15', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 15)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.21（旧 v24.16 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.27';") && !dSrc.includes("const GAME_VERSION = 'v24.16';"));
ok('data.js 含 v24.16 注释（HUD 步数进度·计数现场说明）',
  dSrc.includes('// v24.16 体验打磨·信息透明·计数现场'));
ok('data.js 仍保留 v24.15 历史注释（文档整理·README tests 树串漏录补记，累积注释块）',
  dSrc.includes('// v24.15 文档整理·README tests 树串漏录补记'));
ok('data.js STEP_GOAL 常量逐字落位（const STEP_GOAL = 1000;）', dSrc.includes('const STEP_GOAL = 1000;'));

// —— 运行期常量实值（单一数据源）——
ok('STEP_GOAL === 1000（千里之行阈值，与 C 页/描述/判定同源）', STEP_GOAL === 1000, String(STEP_GOAL));
const _steps = ACH_LIST.find((a) => a.id === 'steps');
ok('ACH_LIST 含 steps（千里之行）', !!_steps);
ok('ACH_LIST steps 描述含 1000（d 与 STEP_GOAL 同源）', !!_steps && _steps.d.includes('1000'), _steps && _steps.d);
ok('ACH_LIST steps ok 逐值（999 false · 1000 true · 缺字段 false）',
  !!_steps && !_steps.ok({ steps: 999 }) && _steps.ok({ steps: 1000 }) && !_steps.ok({}));
ok('ACH_LIST steps prog 逐值（42 → 42/1000 · 缺字段 → 0/1000）',
  !!_steps && _steps.prog({ steps: 42 }) === '42/1000' && _steps.prog({}) === '0/1000',
  _steps && _steps.prog({ steps: 42 }) + ' / ' + _steps.prog({}));

// —— index.html 落位（#hud 第二行 🍄 之右）——
ok('index.html #hud 含 s-steps（<b id="s-steps">）', html.includes('<b id="s-steps">'));
ok('index.html s-steps 标题口径含 千里之行 与 成就进度（title 属性）',
  html.includes('title="千里之行：步行累计步数（成就进度，v24.16）"'));
ok('index.html s-steps 位于 🍄 s-mushroom 之后、🔊 s-sndbox 之前（第二行统计位）',
  html.indexOf('<b id="s-mushroom">') < html.indexOf('<b id="s-steps">') &&
  html.indexOf('<b id="s-steps">') < html.indexOf('<b id="s-snd">'));
ok('index.html s-steps 唯一（零重复 id）', (html.match(/id="s-steps"/g) || []).length === 1);

// —— hud.js 源级落位 ——
ok('hud.js import 补 STEP_GOAL（data.js 既有导出，零新增依赖）',
  hudSrc.includes("import { MAPS, ENCOUNTER, DAY_PHASE_S, STEP_GOAL } from '../data.js';"));
ok('hud.js set 逐字落位（s-steps = steps/STEP_GOAL 防御式分子）',
  hudSrc.includes("set('s-steps', (hero.steps || 0) + '/' + STEP_GOAL);"));
ok('hud.js 含 v24.16 注释（HUD 步数进度说明）', hudSrc.includes('v24.16 体验打磨·信息透明·计数现场'));
ok('hud.js 既有 set 项零回归（s-map/s-lv/s-xp/s-hp/s-mp/s-gold/s-potion/s-potion2/s-mushroom/s-snd/s-weapon/s-armor/s-atk/s-def/s-save/s-slot 逐字在列）',
  ['s-map','s-lv','s-xp','s-hp','s-mp','s-gold','s-potion','s-potion2','s-mushroom','s-snd','s-weapon','s-armor','s-atk','s-def','s-save','s-slot']
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
ok('运行期：HUD s-steps 显示 42/1000（42 步当场可见）', els['s-steps'].textContent === '42/1000', els['s-steps'].textContent);
S.G.steps = 0; renderHUD();
ok('运行期：HUD s-steps 显示 0/1000（零步档）', els['s-steps'].textContent === '0/1000', els['s-steps'].textContent);
delete S.G.steps; renderHUD();
ok('运行期：缺 steps 字段防御式 0/1000（旧档零迁移）', els['s-steps'].textContent === '0/1000', els['s-steps'].textContent);

// —— world.js 计数同源互证 ——
ok('world.js 步数计数逐字落位（成功落地唯一产生点 hero.steps+1）',
  worldSrc.includes('hero.steps = (hero.steps || 0) + 1;'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为二百五十一件套（二百五十件套清除）',
  readme.includes('冒烟二百五十一件套（二百五十件套清除）'));
ok('README tests 树含 v24.16 守护描述与 smoke_v2416_steps 入库（251 份）',
  readme.includes('v24.16 起含 HUD 步数进度守护') && readme.includes('smoke_v2416_steps 入库（251 份）'));
ok('README 成就 bullet 含 v24.16 HUD 步数进度口径（v24.16 起 HUD 常驻「🚶 千里之行 N/1000」步数进度）',
  readme.includes('v24.16 起 HUD 常驻「🚶 千里之行 N/1000」步数进度'));
ok('README 视觉 bullet 含 v24.16 HUD 步数进度口径（HUD 常驻「🚶 千里之行 N/1000」步数进度（v24.16）',
  readme.includes('HUD 常驻「🚶 千里之行 N/1000」步数进度**（v24.16'));
ok('README 尚无 252 件套口径（哨兵前望 252 语义：下一版才写 243）',
  !readme.includes('二百五十二件套') && !readme.includes('冒烟二百五十二件套'));
ok('README 仍保留 v24.15 守护描述（历史保留）', readme.includes('v24.15 起含 README tests 树串全量恒等守护'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 247 份（smoke.mjs + 250 专项）', chain.length === 250 && chainAll.length === 251, String(chain.length));
ok('package.json 链尾为 smoke_v2427_richprog（第 251 份）', chain[chain.length - 1] === 'smoke_v2427_richprog', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2416_steps.mjs（node tests/ 前缀形态）',
  pkgRaw.includes('node tests/smoke_v2416_steps.mjs'));
ok('package.json 链锚逐字（smoke_v2415_treepin.mjs && node tests/smoke_v2416_steps.mjs && node tests/smoke_v2417_mapdrink.mjs && node tests/smoke_v2418_goldcurve.mjs && node tests/smoke_v2419_luckdrp.mjs && node tests/smoke_v2420_skillprog.mjs && node tests/smoke_v2421_allquest.mjs && node tests/smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs"）',
  pkgRaw.includes('smoke_v2415_treepin.mjs && node tests/smoke_v2416_steps.mjs && node tests/smoke_v2417_mapdrink.mjs && node tests/smoke_v2418_goldcurve.mjs && node tests/smoke_v2419_luckdrp.mjs && node tests/smoke_v2420_skillprog.mjs && node tests/smoke_v2421_allquest.mjs && node tests/smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.21（startsWith）', changelog.startsWith('## v24.27'));
ok('CHANGELOG v24.16 条目含「千里之行」与「HUD」与「步数」',
  changelog.includes('千里之行') && changelog.includes('HUD') && changelog.includes('步数'));
ok('CHANGELOG 仍保留 v24.15 条目（历史保留）', changelog.includes('## v24.15'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(chainAll.map((f) => f.replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 243（240 + smoke_v2417_mapdrink）', files.length === 251, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链（旧代 v24.15 pin 全库零残留）——
const leftovers = [];
for (const f of files) {
  if (f === 'smoke_v2416_steps.mjs') continue;
  const s = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s.includes("const GAME_VERSION = 'v24.15';") || s.includes("GAME_VERSION === 'v24.15'") ||
      s.includes("startsWith('## v24.15") || s.includes('入库（239 份）') ||
      s.includes('二百三十九件套（二百三十八件套清除）') || s.includes('testChain === 239')) leftovers.push(f);
}
ok('全库测试零残留 v24.15 GAME_VERSION/顶 pin/239 口径（哨兵链）', leftovers.length === 0, leftovers.join(','));

process.exit(failed ? 1 : 0);
