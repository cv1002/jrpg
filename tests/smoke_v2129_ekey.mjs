// v21.29 专项冒烟：大地图 E 键交互别名——world 场景 E/Enter 同效调用 interact（体验打磨·可发现性，
// 承 v21.14/v21.18「功能存在就必须能看到入口」主线：交互此前只有 Enter 一个入口（README/H 页/新手
// 提示均只写 Enter），而 WASD 移动的玩家右手在方向键上、左手按 Enter 是最远的组合，E 是 JRPG 通行
// 的交互键位；本次 main.js world.onKey 新增 E 分支，H 页「操作说明」「对话 / 确认」行与 README 快速
// 上手表同口径标注。零逻辑改动：interact()/世界/战斗/商店/存档一切逐字不动，仅多一个键盘入口）。
// 承 v21.10 起冒烟入库先例（仓库常驻版）。
import { S } from '../js/state.js';
import { HELP_PAGES, KEY, GAME_VERSION } from '../js/data.js';
import { bind } from '../js/bind.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v5.1/v21.x 冒烟先例：先装桩再 import main.js，canvas 走桩捕获绘制）——
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

console.log('— v21.29 大地图 E 键交互别名 冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.28 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.28', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 29)));

// —— 源级落位：world.onKey E 分支 + 与 KEY 无冲突 ——
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mSrc = fs.readFileSync(path.join(ROOT, 'js/main.js'), 'utf8');
ok("main.js world.onKey 含 E 分支（'e' || 'E' → interact）",
  mSrc.includes("if (e.key === 'e' || e.key === 'E') { interact(); return; }"));
ok('main.js 注释 v21.29 落位', mSrc.includes('v21.29 交互别名'));
ok("KEY 无 'e' 映射（不与移动键冲突）", !KEY['e'] && !KEY['E']);

// —— 运行期实证：screens.world.onKey('E'/'e') 真实触发 interact ——
// 置于 和平村 (10,15) 面向上方 (10,14)（'.' 路径格）→ interact 走 bind.boxMsg（'这里没什么特别的'）
let calls = [];
const origBox = bind.boxMsg;
bind.boxMsg = (t) => { calls.push(String(t)); };
const origScene = S.scene;
S.scene = 'world';
S.G.x = 10; S.G.y = 15; S.G.dir = 'U';
try {
  calls.length = 0;
  screens.world.onKey({ key: 'E' });
  ok("world.onKey('E') 触发 interact（boxMsg「（这里没什么特别的）」）",
    calls.length === 1 && calls[0].includes('这里没什么特别的'), JSON.stringify(calls));
  calls.length = 0;
  screens.world.onKey({ key: 'e' });
  ok("world.onKey('e') 同样触发 interact（小写同效）",
    calls.length === 1 && calls[0].includes('这里没什么特别的'), JSON.stringify(calls));
  calls.length = 0;
  screens.world.onKey({ key: 'Enter' });
  ok('Enter 行为逐字保留（仍触发 interact）',
    calls.length === 1 && calls[0].includes('这里没什么特别的'), JSON.stringify(calls));
} finally {
  bind.boxMsg = origBox;
  S.scene = origScene;
}

// —— 同场景其余快捷键零回归：I 仍进状态页 ——
S.scene = 'world';
screens.world.onKey({ key: 'I' });
ok('world.onKey("I") 仍进入状态页（其余键位逐字不动）', S.scene === 'status', S.scene);
S.scene = 'world';

// —— H 页「操作说明」对话/确认行同步 ——
const page0 = HELP_PAGES[0];
const dialogRow = page0.find((r) => r[0] === '对话 / 确认');
ok('帮助页操作说明「对话 / 确认」行存在', !!dialogRow);
ok("行文案为 'Enter / E（镇民需面对面）'（与 main.js/README 同口径）",
  !!dialogRow && dialogRow[1] === 'Enter / E（镇民需面对面）', dialogRow && dialogRow[1]);

// —— 行宽预算：操作说明页为长页（sp=25），该行短、必不越界（官方 estW 口径，v21.11 同款）——
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
const w = dialogRow ? estW(dialogRow[0] + '   ', 14) + estW(dialogRow[1], 14) : 9999;
ok(`对话/确认行估算宽 ≤470（实测 ≈${w.toFixed(1)}）`, w <= 470, `≈${w.toFixed(1)}`);

// —— data.js 含 v21.29 注释（H 页行同步说明）——
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.29 注释（大地图 E 键交互别名说明）', dSrc.includes('v21.29 大地图 E 键交互别名'));

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README 已同步（tests 树收录 smoke_v2129_ekey；件套计数改由后续版本冒烟统一守护）',
  readme.includes('smoke_v2129_ekey') && readme.includes('冒烟') && readme.includes('件套'));
ok("README 快速上手表已同步（Enter / E 行）", readme.includes('`Enter` / `E`'));
ok('package.json 已收录 smoke_v2129_ekey（npm test 串跑第 25 份）',
  pkg.includes('smoke_v2129_ekey.mjs'));
const s2128 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2128_mapstele.mjs'), 'utf8');
ok('smoke_v2128 的 README 守护表达式已去硬化（v21.7 惯例：不再以「二十四件套」断言件数，实件数由本版冒烟守护）',
  s2128.includes("includes('冒烟')") && s2128.includes("includes('件套')") && !s2128.includes("includes('二十四件套')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
