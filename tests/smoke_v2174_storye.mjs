// v21.74 专项冒烟：开场叙事页翻页补 E 键别名——main.js story.onKey 的 e/E 与 Enter 同路径。
// v21.29-32 把 README 快速上手表、H 页「对话 / 确认」行、新手教程提示、世界画面面向提示全部同步成
// 「Enter / E」，对话进行中（talk.onKey）v21.43 也已同效——但开场叙事页（STORY 五页）同为
// 「按确认键翻页」语境，story.onKey 此前仍只认 Enter：按 E 想翻页毫无反应（v21.16/v21.33/v21.43
// 同族的「文档写的键按了没反应」）。本版补 e/E 别名（翻页 / 末页 goto('world') / 教程提示三状态
// 与 Enter 零行为差），drawStory 逐帧提示与 STORY 末行同步如实标注双键。纯入口零结算。
// 本冒烟守护：版本锚点、main.js 源级新条件 + 旧单 Enter 条件零残留、menus.js 页脚新文案落位 +
// 旧裸文案零残留、data.js STORY 末行双键口径、KEY 无 'e' 映射、运行期 story 场景 e/E/Enter/无关键
// 四路分派实证（翻页/末页进 world/首次教程提示与 Enter 零行为差）、drawStory 渲染与页脚文本实证、
// README/package.json 同步、smoke_v2173 件套断言去硬化确认（v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION, KEY, STORY } from '../js/data.js';
import { drawStory } from '../js/view/index.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v21.73 冒烟先例：先装桩再 import main.js）——
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

// —— 官方 estW（v21.11/v21.14 冒烟标定口径，与 @napi-rs/canvas 真值标定一致）——
const estW = (s, size) => {
  let wsum = 0;
  for (const ch of String(s || '')) {
    const code = ch.codePointAt(0);
    const wide = (code >= 0x2e80 && code <= 0x9fff) || (code >= 0x3000 && code <= 0x303f) || (code >= 0xff00 && code <= 0xffef) || code >= 0x1f000;
    if (wide) wsum += 0.865 * size;
    else if (code === 0xb7) wsum += 0.303 * size;
    else if (code === 0xd7) wsum += 0.564 * size;
    else if (code === 0x25) wsum += 0.827 * size;
    else if (code === 0x2b) wsum += 0.543 * size;
    else if (code === 0x2d) wsum += 0.432 * size;
    else if (code === 0x2f) wsum += 0.338 * size;
    else if (code === 0x2e) wsum += 0.226 * size;
    else if (code >= 0x30 && code <= 0x39) wsum += 0.63 * size;
    else if (code === 0x20) wsum += 0.263 * size;
    else wsum += 0.55 * size;
  }
  return wsum;
};

console.log('— v21.74 开场叙事页 E 键翻页别名 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.73）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.73', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 74)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.74 注释（开场叙事页翻页补 E 键别名说明）', dSrc.includes('v21.74 体验打磨：开场叙事页翻页补 E 键别名'));

// —— data.js 源级：STORY 末行双键口径落位 + 旧单 Enter 文案零残留 ——
ok('data.js STORY 末行新文案落位（[ Enter / E ] 去把灯芯讨回来）',
  dSrc.includes("'[ Enter / E ] 去把灯芯讨回来'"));
ok('data.js STORY 末行旧单 Enter 文案源级零残留', !dSrc.includes("'[ Enter ] 去把灯芯讨回来'"));
ok('STORY 数据契约（五页，末行含 Enter / E 双键口径）',
  STORY.length === 5 && STORY[4].includes('Enter / E'), String(STORY.length));
ok('STORY 末行行宽 estW ≤520 叙事面板预算（15px，面板内宽 60..580）',
  estW(STORY[4], 15) <= 520, estW(STORY[4], 15));

// —— main.js 源级：新条件落位 + 旧单 Enter 条件零残留 ——
const mainSrc = fs.readFileSync(path.join(ROOT, 'js/main.js'), 'utf8');
ok('main.js 含 v21.74 注释（开场叙事翻页补 E 键别名）', mainSrc.includes('v21.74 开场叙事翻页补 E 键别名'));
ok('main.js story.onKey 新条件落位（Enter/e/E 之外才早退，全文件唯一）',
  mainSrc.includes("if (e.key !== 'Enter' && e.key !== 'e' && e.key !== 'E') return;"));
// 注：旧条件串在 pause.onKey 仍合法存在（暂停菜单无 E 别名需求）——零残留口径 = 全文件仅剩 pause 一处。
const oldCondCount = mainSrc.split("if (e.key !== 'Enter') return;").length - 1;
ok('main.js story.onKey 旧单 Enter 条件零残留（全文件仅剩 pause 一处合法保留）', oldCondCount === 1, String(oldCondCount));
ok("KEY 无 'e' 映射（不与移动键冲突）", !KEY['e'] && !KEY['E']);

// —— menus.js 源级：drawStory 页脚新文案落位 + 旧裸文案零残留 ——
const mSrc = fs.readFileSync(path.join(ROOT, 'js/view/menus.js'), 'utf8');
ok('menus.js 含 v21.74 注释（页脚口径同步）', mSrc.includes('v21.74 页脚口径同步'));
ok("menus.js drawStory 页脚新文案落位（boxMsg('按 Enter / E 继续',0)）",
  mSrc.includes("boxMsg('按 Enter / E 继续',0);"));
ok('menus.js drawStory 页脚旧裸文案源级零残留', !mSrc.includes("boxMsg('按 Enter 继续',0)"));

// —— 运行期实证：story 场景 e/E/Enter/无关键 四路分派 ——
const origScene = S.scene;
const origPage = S.storyPage;
const origLineAt = S.storyLineAt;
const origTut = S.G && S.G.tutDone;
try {
  ok('import 后初始场景为 title（main.js 启动引导原样）', origScene === 'title', origScene);
  // 1) 中段页 + 小写 e → 翻页（与 Enter 同行为）
  S.scene = 'story'; S.storyPage = 0; S.storyLineAt = Date.now();
  screens.story.onKey({ key: 'e' });
  ok("story.onKey('e')（第 1 页）→ 翻至第 2 页（scene 仍在 story）",
    S.storyPage === 1 && S.scene === 'story', `${S.storyPage}/${S.scene}`);
  // 2) 中段页 + 大写 E → 再翻页
  screens.story.onKey({ key: 'E' });
  ok("story.onKey('E')（第 2 页）→ 翻至第 3 页（与 Enter 同行为）",
    S.storyPage === 2 && S.scene === 'story', `${S.storyPage}/${S.scene}`);
  // 3) 无关键 → 原地不动（早退分支保留）
  screens.story.onKey({ key: 'x' });
  ok("story.onKey('x')（无关键）→ storyPage 不变仍在 story", S.storyPage === 2 && S.scene === 'story', `${S.storyPage}/${S.scene}`);
  // 4) Enter 零回归：中段页仍翻页
  screens.story.onKey({ key: 'Enter' });
  ok('story.onKey Enter（第 3 页）→ 翻至第 4 页（Enter 零回归）', S.storyPage === 3 && S.scene === 'story', `${S.storyPage}/${S.scene}`);
  // 5) 末页之后 + 小写 e → 进 world + 首次教程提示（与 Enter 同路径，v21.30 口径）
  S.G.tutDone = false;
  S.storyPage = STORY.length;
  screens.story.onKey({ key: 'e' });
  ok("story.onKey('e')（末页之后）→ goto world 且首次教程标记 tutDone 落账",
    S.scene === 'world' && S.G.tutDone === true, `${S.scene}/tutDone=${S.G.tutDone}`);
  ok('首次教程提示真实发出（💡 教程 · Enter/E对话 口径）',
    els.msg && els.msg.textContent.includes('💡 教程') && els.msg.textContent.includes('Enter/E对话'),
    els.msg && els.msg.textContent);
  // 6) 非首次档末页 + 大写 E → 进 world（教程不再发，旅程报文走队列不阻塞断言）
  S.scene = 'story'; S.storyPage = STORY.length; S.G.tutDone = true;
  let threw6 = null;
  try { screens.story.onKey({ key: 'E' }); } catch (e) { threw6 = e; }
  ok("story.onKey('E')（末页之后·非首次档）→ goto world 不抛错",
    threw6 === null && S.scene === 'world', (threw6 && String(threw6)) || S.scene);
  // 7) drawStory 渲染不抛错 + 逐帧页脚文本实证（boxMsg 瞬时直写 msg 元素）
  S.scene = 'story'; S.storyPage = 2; S.storyLineAt = Date.now();
  let threw7 = null;
  try { drawStory(); } catch (e) { threw7 = e; }
  ok('drawStory 渲染不抛错', threw7 === null, threw7 && String(threw7.stack || threw7));
  ok('drawStory 页脚逐帧提示为「按 Enter / E 继续」（瞬时消息直写）',
    els.msg && els.msg.textContent === '按 Enter / E 继续', els.msg && els.msg.textContent);
} finally {
  S.scene = origScene;
  S.storyPage = origPage;
  S.storyLineAt = origLineAt;
  if (S.G) S.G.tutDone = origTut;
}

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2174_storye', readme.includes('smoke_v2174_storye'));
ok('README 件套口径为七十件套（六十九件套清除）', readme.includes('七十件套（六十九件套清除）'));
ok('README 含 v21.74 守护描述（开场叙事页 E 键翻页别名守护）',
  readme.includes('v21.74 起含开场叙事页 E 键翻页别名守护'));
ok('README 快速上手表 Enter/E 行含开场叙事页同效口径',
  readme.includes('`Enter` / `E`') && readme.includes('开场叙事页 `E` 同效翻页'));
ok('package.json 已收录 smoke_v2174_storye（npm test 串跑第 70 份）', pkg.includes('smoke_v2174_storye.mjs'));
const s2173 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2173_aegis.mjs'), 'utf8');
ok('smoke_v2173 的 README 件套口径断言已去硬化（存活性口径落位，旧精确表达式零残留）',
  s2173.includes("!readme.includes('（六十八件套清除）')") &&
  !s2173.includes("readme.includes('六十九件套（六十八件套清除）')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
