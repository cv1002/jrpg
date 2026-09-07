// v21.45 专项冒烟：任务日志（J）滚动——drawJournal 内容超可视区时 ↑↓ 可滚（state.js S.journalScroll，
// 与 codexScroll/achScroll 同族）；v21.45 前 drawQuestCard 的 yMax 提前截断 + 碎片区 y+24<yMax 门会让
// 开局日志静默裁掉 星砂之约/旧灯卫的名字/石壳里的记忆/残焰的安息 四张卡与整段记忆碎片（渲染实证），
// 现改为「全量条目高度序列 + S.journalScroll 绘制期钳制 + CTX.translate(0,-scroll) 整页上移」。
// 本冒烟守护：版本锚点、state/data/main/menus 源级落位 + 旧 yMax 截断零残留、运行期实证
// （开局日志六支线全画 + 滚动偏移 translate + 越界钳制到 totalH-viewH（布局数学独立重算等价）+
// journal.onKey ↑↓/s/S 分派 + J/Esc 关闭零回归）、README/package 同步、smoke_v2144 件套断言去硬化确认。
import { S } from '../js/state.js';
import { GAME_VERSION, FRAGMENTS } from '../js/data.js';
import { questJournal } from '../js/quests.js';
import { drawJournal } from '../js/view/index.js';
import { CTX } from '../js/view/canvas.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v21.44 冒烟先例：先装桩再 import main.js）——
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
const { screens } = await import('../js/main.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.45 任务日志滚动 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.44）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.44', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 45)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.45 注释（任务日志（J）滚动说明）', dSrc.includes('v21.45 新增：任务日志（J）滚动'));

// —— state.js 源级：journalScroll 注册 ——
const sSrc = fs.readFileSync(path.join(ROOT, 'js/state.js'), 'utf8');
ok('state.js 注册 journalScroll: 0', sSrc.includes('journalScroll: 0'));

// —— menus.js 源级：全量条目 + 钳制 + translate 落位、旧 yMax 截断零残留 ——
const mSrc = fs.readFileSync(path.join(ROOT, 'js/view/menus.js'), 'utf8');
ok('menus.js 含 v21.45 注释（任务日志滚动）', mSrc.includes('v21.45 任务日志滚动'));
ok('menus.js drawJournal 使用 S.journalScroll（滚动偏移）', mSrc.includes('S.journalScroll'));
ok('menus.js drawJournal 绘制期钳制到 [0, totalH-viewH]', mSrc.includes('const maxScroll = Math.max(0, totalH - viewH);') && mSrc.includes('if (S.journalScroll > maxScroll) S.journalScroll = maxScroll;'));
ok('menus.js 整页上移 CTX.translate(0, -scroll)', mSrc.includes('CTX.translate(0, -scroll);'));
ok('menus.js 页脚「↑↓ 滚动浏览（还有 N 条）」口径落位', mSrc.includes('↑↓ 滚动浏览（还有'));
ok('menus.js drawQuestCard 旧 yMax 提前截断 `if (y + h > yMax) return 0;` 源级零残留', !mSrc.includes('return 0;'));
ok('menus.js drawQuestCard 签名已去 yMax 参数', !mSrc.includes('function drawQuestCard(e, hero, x, y, w, yMax)'));

// —— main.js 源级：journal.onKey ↑↓ 分派 ——
const mainSrc = fs.readFileSync(path.join(ROOT, 'js/main.js'), 'utf8');
ok('main.js journal.onKey 含 ↑↓ 滚动分派（journalScroll++/--）', mainSrc.includes('S.journalScroll++') && mainSrc.includes('S.journalScroll--'));
ok('main.js 含 v21.45 注释（任务日志滚动）', mainSrc.includes('v21.45 任务日志滚动'));

// —— 运行期实证：drawJournal 全量条目 + 滚动平移 + 越界钳制 ——
const origScene = S.scene;
const origScroll = S.journalScroll;
const origHero = S.G;
let drawnCalls = [];
const origFill = CTX.fillText.bind(CTX);
CTX.fillText = (t, x, y) => { drawnCalls.push({ t: String(t), x, y }); };
let translated = [];
const origTr = CTX.translate.bind(CTX);
CTX.translate = (dx, dy) => { translated.push([dx, dy]); };
try {
  ok('启动引导后 S.G 已建档（新档真实状态）', !!origHero && origHero.level >= 1, origHero && origHero.level);
  ok('启动引导后场景为 title（loadMap(village) 已就绪）', origScene === 'title', origScene);
  // 1) 开局新档：滚动 0 时六条支线 + 主线 + 碎片区全画（v21.45 前 星砂之约/旧灯卫的名字/石壳里的记忆/残焰的安息 被静默裁掉）
  S.journalScroll = 0;
  drawnCalls.length = 0; translated.length = 0;
  drawJournal();
  const names = ['讨回灯芯', '星井之守', '灯长的委托', '星砂之约', '旧灯卫的名字', '雾里的新住客', '石壳里的记忆', '残焰的安息'];
  const absent = names.filter((nm) => !drawnCalls.some((c) => c.t.includes(nm)));
  ok('滚动=0 时日志全量条目落画（4 主线/支线名 + 此前被裁的 星砂之约/旧灯卫的名字/石壳里的记忆/残焰的安息）', absent.length === 0, '缺: ' + absent.join(','));
  ok('滚动=0 时记忆碎片区已画（头 + 4 行占领位）', drawnCalls.some((c) => c.t.includes('记忆碎片')) && drawnCalls.filter((c) => c.t.includes('🕯️')).length === FRAGMENTS.length, drawnCalls.filter((c) => c.t.includes('🕯️')).length);
  ok('滚动=0 时页脚含「↑↓ 滚动浏览（还有 N 条）」提示', drawnCalls.some((c) => c.t.includes('按 J / Esc 关闭') && c.t.includes('↑↓ 滚动浏览（还有')));
  ok('滚动=0 时 translate 为 (0,-0)（零平移零回归）', translated.length > 0 && translated[translated.length - 1][0] === 0 && translated[translated.length - 1][1] === 0, JSON.stringify(translated));
  // 2) 滚动偏移生效：scroll=5 → translate(0,-5)，页脚仍提示
  S.journalScroll = 5;
  drawnCalls.length = 0; translated.length = 0;
  drawJournal();
  ok('scroll=5 时 translate 为 (0,-5)（整页上移）', translated.length > 0 && translated[translated.length - 1][1] === -5, JSON.stringify(translated));
  // 3) 越界钳制：99999 → 钳到 totalH-viewH（布局数学在测试侧独立重算，与绘制侧逐值相等）
  S.journalScroll = 99999;
  drawJournal();
  const h = (e) => (e.status === 'done' ? 34 : e.status === 'locked' ? 50 : 70);
  const jlog = questJournal(S.G);
  const rank = { turnin: 0, active: 1, offer: 2, locked: 3, done: 4 };
  const jmains = jlog.filter((e) => e.kind === 'main');
  const jsides = jlog.filter((e) => e.kind === 'side').sort((a, b) => (rank[a.status] ?? 9) - (rank[b.status] ?? 9));
  let tot = 0;
  if (jmains.length) { tot += 12; for (const e of jmains) tot += h(e) + 8; tot += 6; }
  if (jsides.length) { tot += 12; for (const e of jsides) tot += h(e) + 8; tot += 6; }
  tot += 16 + FRAGMENTS.length * 16;
  const expectMax = Math.max(0, tot - 352);
  ok('scroll=99999 后被钳制到 totalH-viewH（独立布局重算等价：' + expectMax + '）', S.journalScroll === expectMax, S.journalScroll + ' vs ' + expectMax);
  ok('未出现负滚动（floor 0）', S.journalScroll >= 0);
  // 4) journal.onKey 运行期分派：↑↓/s/S 滚动 + J/Esc 关闭零回归
  S.scene = 'journal';
  S.journalScroll = 0;
  screens.journal.onKey({ key: 'ArrowDown' });
  ok("journal.onKey('ArrowDown') → journalScroll=1", S.journalScroll === 1, S.journalScroll);
  screens.journal.onKey({ key: 's' });
  ok("journal.onKey('s')（onArrow 别名）→ journalScroll=2", S.journalScroll === 2, S.journalScroll);
  screens.journal.onKey({ key: 'ArrowUp' });
  ok("journal.onKey('ArrowUp') → journalScroll=1", S.journalScroll === 1, S.journalScroll);
  screens.journal.onKey({ key: 'j' });
  ok("journal.onKey('j') → 关闭回 world（J 关闭零回归）", S.scene === 'world', S.scene);
  S.scene = 'journal';
  screens.journal.onKey({ key: 'Escape' });
  ok("journal.onKey('Escape') → 关闭回 world（Esc 关闭零回归）", S.scene === 'world', S.scene);
  S.scene = 'journal';
  screens.journal.onKey({ key: 'i' });
  ok("journal.onKey('i') → 状态页（I 跳转零回归）", S.scene === 'status', S.scene);
  S.scene = 'title';
} finally {
  CTX.fillText = origFill;
  CTX.translate = origTr;
  S.scene = origScene;
  S.journalScroll = origScroll;
  S.G = origHero;
}

// —— README 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
ok('README tests 树收录 smoke_v2145_journalscroll', readme.includes('smoke_v2145_journalscroll'));
ok('README 件套口径为存活性断言（v21.46 起件数由本版冒烟守护：四十二件套（四十一件套清除））',
  readme.includes('冒烟') && readme.includes('件套') &&
  !readme.includes('（四十件套清除）'));
ok('README 含 v21.45 守护描述（任务日志滚动守护）', readme.includes('v21.45 起含任务日志滚动守护'));
ok('README 快速上手表 J 行含 ↑↓ 滚动口径', readme.includes('`J`') && readme.includes('↑↓ 滚动浏览'));

// —— package.json 收录 ——
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('package.json 已收录 smoke_v2145_journalscroll（npm test 串跑第 41 份）', pkg.includes('smoke_v2145_journalscroll.mjs'));

// —— smoke_v2144 的 README 件套口径断言已去硬化（v21.7 惯例）——
const s2144 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2144_run.mjs'), 'utf8');
ok('smoke_v2144 的 README 件套口径断言已去硬化（v21.7 惯例：改用存活性口径，旧精确表达式「readme.includes(四十件套（三十九件套清除）)」零残留，实件数由本版冒烟守护）',
  s2144.includes("!readme.includes('三十九件套（三十八件套清除）')") &&
  !s2144.includes("readme.includes('四十件套（三十九件套清除）')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
