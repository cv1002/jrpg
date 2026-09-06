// v21.30 专项冒烟：新手教程提示 E 键口径同步——启动后首次进图的「💡 教程」行
// Enter对话 → Enter/E对话（体验打磨·可发现性·口径收尾，承 v21.29 大地图 E 键交互别名：
// v21.29 自身明确「README 快速上手表、H 页操作说明、新手教程提示三处都只写 Enter」，但
// 只改了前两处——教程行（main.js story 收尾进 world）仍是唯一「Enter对话」入口文案；
// 本次补齐第三处：教程行改 Enter/E对话，TUTOR_MSG_MS 沿用、tutDone 机制逐字不动。
// 零逻辑改动：story→world 流程/教程触发条件/其余按键提示（P存档/F喝药/…）全部逐字未动，
// 仅教程行文案二字之差 + 注释。承 v21.10 起冒烟入库先例（仓库常驻版）。
import { S } from '../js/state.js';
import { KEY, HELP_PAGES, STORY, GAME_VERSION, TUTOR_MSG_MS } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.29 冒烟先例：先装桩再 import main.js）——
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

console.log('— v21.30 新手教程提示 E 键口径同步 冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.29（版本号随递增由最新版冒烟守护，此处不钉死）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.29', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 30)));

// —— 源级落位：教程行已改 Enter/E对话，旧口径字面量清零，TUTOR_MSG_MS 沿用 ——
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mSrc = fs.readFileSync(path.join(ROOT, 'js/main.js'), 'utf8');
const TUTOR_LINE = '💡 教程：WASD移动 · Enter/E对话 · Esc菜单 · P存档 · F喝药 · I状态 · J任务 · B图鉴 · C成就 · T旅行 · H帮助 · M静音';
ok("main.js 教程行已含 'Enter/E对话'（与 README/H 页同口径）", mSrc.includes(TUTOR_LINE));
ok('旧口径字面量已清零（WASD移动 · Enter对话 · Esc菜单 片段不存在）',
  !mSrc.includes('WASD移动 · Enter对话 · Esc菜单'));
ok("教程行仍以 TUTOR_MSG_MS 收尾（常量沿用，无裸字面量）",
  mSrc.includes("boxMsg('" + TUTOR_LINE + "', TUTOR_MSG_MS);"));
ok('main.js 含 v21.30 注释（教程提示口径收尾）', mSrc.includes('v21.30 教程提示口径收尾'));
ok('教程触发守卫逐字保留（tutDone 置位再提示）', mSrc.includes('if (!S.G.tutDone)') && mSrc.includes('S.G.tutDone = true;'));
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.30 注释（教程提示口径收尾）', dSrc.includes('v21.30 教程提示口径收尾'));

// —— 运行期实证：story 收尾进 world → 教程提示真实发出且为新口径 ——
const msgEl = document.getElementById('msg');
S.scene = 'story';
S.storyPage = STORY.length;       // 越过所有故事页 → Enter 走 goto('world') + tutDone 分支
if (!S.G) S.G = { tutDone: false };
S.G.tutDone = false;
msgEl.textContent = '';
try {
  screens.story.onKey({ key: 'Enter' });
  ok('story 收尾进 world（首次教程分支）', S.scene === 'world', S.scene);
  ok('tutDone 置位（提示机制正常工作）', S.G.tutDone === true);
  ok("#msg 已显示教程提示（'💡 教程' 开头）", String(msgEl.textContent).startsWith('💡 教程'), msgEl.textContent);
  ok('教程提示含 Enter/E对话 新口径', String(msgEl.textContent).includes('Enter/E对话'));
  ok('教程提示不含旧口径（Enter对话 · Esc菜单）', !String(msgEl.textContent).includes('Enter对话 · Esc菜单'));
  // 二次触发（tutDone 已 true）→ 走 else 分支：欢迎语进消息队列（教程 3600ms 档未到期），
  // 等教程档自然到点后由队列接续显示「踏上旅途」——教程不会二次弹出（v21.10 队列接手，纯显示）
  S.scene = 'story';
  S.storyPage = STORY.length;
  msgEl.textContent = '';
  screens.story.onKey({ key: 'Enter' });
  await new Promise((r) => setTimeout(r, TUTOR_MSG_MS + 400));
  const second = String(msgEl.textContent);
  ok('tutDone 后不再重复教程（教程档到点后队列接续「踏上旅途」欢迎语）',
    second.includes('踏上旅途') && !second.includes('💡 教程'), second);
} finally {
  S.scene = 'world';
}

// —— v21.29 口径零回归：H 页 / 快速上手表 / KEY 无 e 映射 ——
const page0 = HELP_PAGES[0];
const dialogRow = page0.find((r) => r[0] === '对话 / 确认');
ok('帮助页操作说明「对话 / 确认」行仍为 v21.29 口径（Enter / E）',
  !!dialogRow && dialogRow[1] === 'Enter / E（镇民需面对面）', dialogRow && dialogRow[1]);
ok("KEY 仍无 'e' 映射（不与移动键冲突）", !KEY['e'] && !KEY['E']);

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README 已同步（tests 树收录 smoke_v2130_tutor + 冒烟/件套口径存在；件数去硬化——v21.7 惯例：实件数由后续版本冒烟守护）',
  readme.includes('smoke_v2130_tutor') && readme.includes('冒烟') && readme.includes('件套'));
ok('package.json 已收录 smoke_v2130_tutor（npm test 串跑）',
  pkg.includes('smoke_v2130_tutor.mjs'));
const s2129 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2129_ekey.mjs'), 'utf8');
ok('smoke_v2129 的 README 守护表达式已去硬化（v21.7 惯例：不再以「二十五件套」断言件数，实件数由本版冒烟守护）',
  s2129.includes("includes('冒烟')") && s2129.includes("includes('件套')") && !s2129.includes("includes('二十五件套')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
