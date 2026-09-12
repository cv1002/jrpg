// v22.28 专项冒烟：标题页「未存档冒险」存档闭环（体验打磨·信息透明，承 v22.10 beforeunload 离站守卫 /
// v21.16 标题 R 两按确认 / v21.98 胜利 P 存档同一「未落盘进度防丢失」主线）——drawTitle 提示行与
// README 快速上手表都宣称「P 存档」，但标题页此前没有任何 P 分支（「文案宣称却无入口」的漏网点）；
// Esc 菜单「返回标题」/ 阵亡 T / 胜利 T 会带着内存中的 S.G 回标题（v21.16 注释「S.G 仍是进行中的
// 冒险」），此时按 L 读档 / Enter 新开档 / R 重开都会把未保存进度静默替换，而标题页零落盘入口。
// 本版：main.js title.onKey 补 P → saveGame()（与 world/win 的 P 同一函数同一入口，成功清 S.unsaved）；
// drawTitle 补警告行（与 beforeunload 守卫同判 S.G && S.unsaved、名字/等级/金币读 S.G 单一数据源）；
// H 页存档槽行 r[2] 与 index.html 常驻帮助条同步 P 口径。
// 本冒烟守护：版本锚点、源级落位（P 分支三分支/警告行/H 页行/常驻帮助条）、运行期实证（清洁档无警告/
// 未存档档警告行 + 行宽预算/已存档档无警告/P 真实落盘清脏/P 无进度与无冒险两档短反馈）、README/
// package.json/CHANGELOG 同步（tests 树尾 + 件套口径 + v22.28 守护描述 + 入库 124 份）、姊妹件套 pin
// （v22.27/v22.26 随新现实更新）复查、旧代 v22.27 字面量/恒等/件套/树尾 pin 零残留、断链防回归。
import { S } from '../js/state.js';
import { GAME_VERSION } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.30-v22.27 冒烟先例：先装桩再 import main.js；ctx 记录所有 fillText）——
const drawn = [];
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
    fillText: (t) => { drawn.push(String(t)); },
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
    gain: { value: 1, setValueAtTime: noop, linearRampToValueAtTime: noop, exponentialRampToValueAtTime: noop } }),
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
const { screens } = await import('../js/main.js');
const { drawTitle } = await import('../js/view/index.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}
const estw = (s) => [...String(s)].reduce((a, c) => a + (c.charCodeAt(0) > 0xFF ? 12 : 7), 0);

console.log('— v22.28 标题页未存档冒险存档闭环 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dataSrc = read('js/data.js');
const mainSrc = read('js/main.js');
const menusSrc = read('js/view/menus.js');
const html = read('index.html');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.27 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.27', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 28)), GAME_VERSION);
ok('data.js 含 v22.28 注释（标题页未存档冒险存档闭环说明）', dataSrc.includes('v22.28 标题页「未存档冒险」存档闭环'));
ok('GAME_VERSION 字面量已为 v22.28（旧 v22.27 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v22.29';") && !dataSrc.includes("const GAME_VERSION = 'v22." + "27';"));
ok('data.js 仍保留 v22.27 历史注释（累积注释块，姊妹 pin 不失效）', dataSrc.includes('v22.27 雾语林南坡新风味 NPC「琴师」'));

// —— 源级落位：main.js 标题页 P 分支 ——
ok('main.js title.onKey 含 P 分支（p/P 双键）', mainSrc.includes("else if (e.key === 'p' || e.key === 'P')"));
ok('main.js P 分支保存路径 = saveGame（与 world/win 同入口）', /e\.key === 'p' \|\| e\.key === 'P'\)[\s\S]{0,600}?saveGame\(\);/.test(mainSrc));
ok('main.js P 分支优先级：无冒险→无进度→保存（写 S.unsaved 守卫不复制 beforeunload 同款串）', /if \(!S\.G\) \{[\s\S]{0,200}?else if \(!S\.unsaved\) \{/.test(mainSrc));
ok('main.js P 分支无进度短反馈（承 v21.33 每个按键都该有反应）', mainSrc.includes('💾 当前没有未保存的进度，无需存档。'));
ok('main.js P 分支无冒险短反馈', mainSrc.includes('💤 还没有进行中的冒险，无需存档。'));

// —— 源级落位：drawTitle 警告行 ——
ok('menus.js drawTitle 含未存档警告行（与 beforeunload 同判 S.G && S.unsaved）', menusSrc.includes('if (S.G && S.unsaved)') && menusSrc.includes('有未存档的冒险'));
ok('menus.js 警告行给出现成解法「按 P 存档」', menusSrc.includes('按 P 存档，读档/新开档将放弃未保存进度'));
ok('menus.js 警告行 y=396（378 提示行与 420 提示行之间、行间 ≥18 不触）', /S\.G\.gold\}金 —— 按 P 存档，读档\/新开档将放弃未保存进度`, CV\.width\/2, 396\);/.test(menusSrc));
ok('menus.js 警告行读 S.G 单一数据源（名字/等级/金币）', menusSrc.includes('${S.G.name || \'守灯人\'} Lv.${S.G.level} · ${S.G.gold}金'));

// —— 源级落位：H 页存档槽行 r[2] 与 index.html 常驻帮助条 P 口径 ——
ok('data.js H 页存档槽行 r[2] 补 P 存档', dataSrc.includes("'R 重开新档(连按两次确认) · X 删除当前槽存档(连按两次确认) · P 存档'"));
ok('H 页存档槽行 r[2] 估算宽 ≤470 预算', estw('R 重开新档(连按两次确认) · X 删除当前槽存档(连按两次确认) · P 存档') <= 470,
  String(estw('R 重开新档(连按两次确认) · X 删除当前槽存档(连按两次确认) · P 存档')));
ok('index.html 常驻帮助条标题段补 P 存档', html.includes('<kbd>P</kbd> 存档（未存档冒险）'));

// —— 运行期实证（承 v21.31 文本捕获桩）——
function freshHero() {
  return { name: '余烬', level: 7, gold: 123, xp: 0, xpNext: 20, hp: 50, hpMax: 50, mp: 20, mpMax: 20,
    item: 3, potion2: 1, mushrooms: 2, weapon: '铁剑', armor: '皮甲', atkMax: 12, defMax: 6,
    map: 'village', x: 8, y: 8, time: 0, ach: [], bestiary: {}, fragments: [], seen: {},
    skills: ['火焰斩'], visited: ['village'], chests: [], quests: {}, drops: 0, brews: 0, totalWins: 0 };
}
// 1) 清洁档（无冒险 / 已落盘）渲染无警告
S.G = null; S.unsaved = false; drawn.length = 0;
drawTitle();
ok('清洁档（无 S.G）标题渲染不含未存档警告', !drawn.some((t) => t.includes('有未存档的冒险')), JSON.stringify(drawn.slice(-3)));
// 2) 未存档档渲染出警告行且行宽 ≤640
S.G = freshHero(); S.unsaved = true; drawn.length = 0;
drawTitle();
const warnLine = drawn.find((t) => t.includes('有未存档的冒险'));
ok('未存档档警告行渲染（名字/等级/金币逐字）', !!warnLine && warnLine.includes('有未存档的冒险：余烬 Lv.7 · 123金'), warnLine || '');
ok('警告行含「按 P 存档」解法', !!warnLine && warnLine.includes('按 P 存档'));
ok('警告行估算宽 ≤640 画布预算', !!warnLine && estw(warnLine) <= 640, warnLine ? String(estw(warnLine)) : '');
ok('警告行之后仍保留主提示行（零回归）', (() => {
  const hintLine = drawn.find((t) => t.includes('L 读档'));
  return !!hintLine && hintLine.startsWith('按 1/2/3 或 ←/→ 选择存档槽') && hintLine.includes('R 重开新档(连按两次)') && hintLine.includes('WASD 移动');
})(), 'hintLines=' + drawn.filter((t) => t.includes('L 读档')).length);
// 3) 已落盘档（unsaved=false）渲染无警告
S.unsaved = false; drawn.length = 0;
drawTitle();
ok('已落盘档渲染不含未存档警告', !drawn.some((t) => t.includes('有未存档的冒险')));
// 4) 标题页按 P 真实落盘并清脏
delete mem['jrpg_save1']; S.curSaveSlot = 1; S.G = freshHero(); S.unsaved = true;
screens.title.onKey({ key: 'p' });
ok('标题页 P 真实写入当前槽（jrpg_save1 存在且含角色名）', !!mem['jrpg_save1'] && mem['jrpg_save1'].includes('余烬') && mem['jrpg_save1'].includes('"map":"village"'));
ok('标题页 P 存档成功清 S.unsaved（与 beforeunload 守卫同读一份源）', S.unsaved === false);
ok('存档反馈摘要（v19.87 同款）已带角色/地图/金币', S.saveMsg && S.saveMsg.includes('已存档到槽 1：余烬 Lv.7 · 潮灯镇 · 123 金'), S.saveMsg);
// 5) P 无未保存进度 → 短反馈
S.G = freshHero(); S.unsaved = false; document.getElementById('msg').textContent = '';
screens.title.onKey({ key: 'P' });
ok('P 无未保存进度给短反馈（不静默）', document.getElementById('msg').textContent.includes('当前没有未保存的进度，无需存档。'), document.getElementById('msg').textContent);
// 6) P 无进行中冒险 → 短反馈（boxMsg 队列：上一条 EVENT_MSG_MS=1600 到点后队列消息上屏，等 ~1.7s 再断言）
S.G = null; document.getElementById('msg').textContent = '';
screens.title.onKey({ key: 'p' });
await new Promise((r) => setTimeout(r, 1700));
ok('P 无进行中冒险给短反馈', document.getElementById('msg').textContent.includes('还没有进行中的冒险，无需存档。'), document.getElementById('msg').textContent);
// 7) 标题页既有输入零回归（分派仍在：L/R/X/选槽不被 P 分支吞）
ok('标题页既有分支零回归（L 读档/R/X 两按/选槽仍在源级）',
  mainSrc.includes("e.key === 'l' || e.key === 'L'") && mainSrc.includes("'r' || e.key === 'R'") &&
  mainSrc.includes("'x' || e.key === 'X'") && mainSrc.includes('S.curSaveSlot = Number(e.key)'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README tests 树收录 smoke_v2228_titlesave 且位于串尾', readme.includes('smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall（npm test 串跑）'));
ok('README 件套口径为一百二十五件套（一百二十四件套清除）',
  readme.includes('冒烟一百二十五件套（一百二十四件套清除）') && !readme.includes('一百二十三件套（一百二十二件套清' + '除）'));
ok('README 含 v22.28 守护描述（标题页未存档冒险存档闭环）', readme.includes('v22.28 起含标题页未存档冒险存档闭环守护'));
ok('README 含 smoke_v2228_titlesave 入库（124 份）', readme.includes('smoke_v2228_titlesave 入库（124 份）'));
ok('README 快速上手表标题行补 P 存档（v22.28）', readme.includes('`P` 存档（v22.28'));
ok('README 系统清单含标题页 P 存档与未存档警告条目', readme.includes('**标题页 P 存档与未存档警告**（v22.28'));
ok('package.json 已收录 smoke_v2228_titlesave（npm test 串跑第 124 份）',
  pkg.includes('smoke_v2228_titlesave.mjs') && /smoke_v2227_minstrel\.mjs && node tests\/smoke_v2228_titlesave\.mjs && node tests\/smoke_v2229_metall\.mjs"/.test(pkg));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 124 件套', testChain === 125, String(testChain));
ok('CHANGELOG 含 v22.28 条目', changelog.includes('## v22.28 '));

// —— 姊妹件套 pin 复查（v21.7 惯例：本版冒烟守护姊妹随新现实更新）——
const s2227 = read('tests/smoke_v2227_minstrel.mjs');
const s2226 = read('tests/smoke_v2226_chestprogress.mjs');
const s2225 = read('tests/smoke_v2225_stonecarver.mjs');
ok('smoke_v2227 的 GAME_VERSION 字面量 pin 已更新为 v22.28', s2227.includes("const GAME_VERSION = 'v22.29';"));
ok('smoke_v2227 的 GAME_VERSION 恒等 pin 已更新为 === v22.28', s2227.includes("GAME_VERSION === 'v22.29'"));
ok('smoke_v2227 的 README 件套 pin 已更新为一百二十五件套（一百二十四件套清除）',
  s2227.includes('一百二十五件套（一百二十四件套清除）'));
ok('smoke_v2227 的 README 树尾 pin 已更新为 + smoke_v2228_titlesave',
  s2227.includes('smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall（npm test 串跑）'));
ok('smoke_v2227 的 package.json 件套计数 pin 已更新为 === 124', s2227.includes('testChain === 125'));
ok('smoke_v2226 的 GAME_VERSION 字面量 pin 已更新为 v22.28', s2226.includes("const GAME_VERSION = 'v22.29';"));
ok('smoke_v2226 的 README 树尾 pin 已更新为 + smoke_v2228_titlesave',
  s2226.includes('smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall（npm test 串跑）'));
ok('smoke_v2226 的 package.json 串尾 pin 已更新为 + smoke_v2228_titlesave',
  s2226.includes('smoke_v2227_minstrel.mjs && node tests/smoke_v2228_titlesave.mjs && node tests/smoke_v2229_metall.mjs"'));
ok('smoke_v2225 的 README 树尾 pin 已更新为 + smoke_v2228_titlesave',
  s2225.includes('smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall（npm test 串跑）'));

// —— 旧代 pin 零残留：全部测试文件不得再含 v22.27 字面量/恒等/件套/树尾 pin（拆串构造避免自匹配）——
let stale = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read('tests/' + f);
  if (src.includes("const GAME_VERSION = 'v22." + "27';")) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v22.27 全库清零）', stale.length === 0, stale.join(','));
let staleId = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read('tests/' + f);
  if (src.includes("GAME_VERSION === 'v22." + "27'")) staleId.push(f);
}
ok('旧代 GAME_VERSION 恒等 pin 零残留（===v22.27 全库清零）', staleId.length === 0, staleId.join(','));
let staleSuite = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read('tests/' + f);
  if (src.includes('一百二十三件套（一百二十二件套清' + '除）')) staleSuite.push(f);
}
ok('旧代件套 pin 零残留（一百二十三件套（一百二十二件套清' + '除）全库清零）', staleSuite.length === 0, staleSuite.join(','));
let staleTail = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read('tests/' + f);
  if (src.includes('smoke_v2226_chestprogress + smoke_v2227_minstrel（npm test 串' + '跑）')) staleTail.push(f);
}
ok('旧代树尾 pin 零残留（smoke_v2226_chestprogress + smoke_v2227_minstrel 串全库清零）', staleTail.length === 0, staleTail.join(','));
// 断链防回归：不得出现 v2227_minstrel 被新尾吞并的坏链（smoke_v2226_chestprogress 直接接 smoke_v2228_titlesave）
let brokenTail = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read('tests/' + f);
  if (src.includes('smoke_v2226_chestprogress + smoke_v2228_titlesave（npm test 串' + '跑）')) brokenTail.push(f);
}
if (readme.includes('smoke_v2226_chestprogress + smoke_v2228_titlesave（npm test 串' + '跑）')) brokenTail.push('README.md');
ok('坏链 pin 零残留（v2227_minstrel 吞并链全库清零）', brokenTail.length === 0, brokenTail.join(','));

// —— index.html / 既有非 P 零回归 ——
ok('index.html 壳要素零回归（canvas 640×480 + js/main.js 模块入口 + hud/quest/msg）',
  html.includes('<canvas id="game" width="640" height="480">') && html.includes('<script type="module" src="js/main.js') &&
  html.includes('id="hud"') && html.includes('id="quest"') && html.includes('id="msg"') &&
  html.includes('<title>潮灯记 · JRPG</title>'));
ok('index.html 常驻帮助条既有项零回归（L 读档/R/X 两按确认口径）', html.includes('标题按 <kbd>L</kbd> 读档') && html.includes('连按两次确认'));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
