// v21.42 专项冒烟：创建角色页（create）补 Esc 返回标题——create 是场景表 screens 里唯一没有
// Esc 处理的场景（shop/inn/brew/status/journal/codex/ach/help/travel/talk/pause/world/battle 全部有
// Esc 语义：返回/关闭，title 是根场景无返回需求）；标题页按 Enter 误入创建页后无退路（只能 Enter
// 出发开始新档，或进游戏后经 Esc 菜单「返回标题」绕一圈）。本版 main.js create.onKey 补
// `isEsc(e) → goto('title')`（与 dead.onKey T 回标题同构；title BGM 自 title→create 起仍在播，
// goto('title') 无缝返回无需 startBgm 重启），drawCreate 提示行末补「Esc 返回」，S.createName/
// S.createDiff 保留（再进创建页仍是刚才的选择）。纯入口、零建档逻辑变化、零结算。
// 本冒烟守护：版本锚点、main.js 源级 Esc 处理 + 既有创建键零回归、menus.js 源级新提示 + 旧提示零残留、
// 运行期 title→create→Esc→title 往返实证（createName/createDiff 保留）、↑↓/←→/A/D/W/S 选择零回归、
// drawCreate 渲染实证（新行含 Esc 返回）、world Esc→pause 零回归、README 同步（tests 树/件套口径
// （v21.43 起存活性断言）/v21.42 守护描述/快速上手表创建页行）、package.json 收录、smoke_v2141 件套断言
// 去硬化确认（v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION, HERO_NAMES, DIFFS } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.30-v21.41 冒烟先例：先装桩再 import main.js；ctx 记录所有 fillText）——
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
const { drawCreate } = await import('../js/view/index.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.42 创建角色页 Esc 返回标题 冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.41）——
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.41', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 42)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.42 注释（创建角色页 Esc 返回说明）', dSrc.includes('v21.42'));

// —— main.js 源级：Esc 处理落位 + 既有创建键零回归 ——
const mainSrc = fs.readFileSync(path.join(ROOT, 'js/main.js'), 'utf8');
ok('main.js 含 v21.42 注释（创建页补 Esc 返回）', mainSrc.includes('v21.42'));
ok('main.js create.onKey Esc 处理落位（isEsc(e) → goto(title)，全文件唯一）',
  mainSrc.includes('if (isEsc(e)) { goto(\'title\'); return; }'));
ok('main.js create 选择姓名键零回归（ArrowRight 分支原样）',
  mainSrc.includes('S.createName = (S.createName + 1) % HERO_NAMES.length;'));
ok('main.js create 选择难度键零回归（ArrowDown 分支原样）',
  mainSrc.includes('S.createDiff = (S.createDiff + 1) % DIFFS.length;'));
ok('main.js create Enter 出发分支零回归（beginAdventure 原样）',
  mainSrc.includes('beginAdventure();'));

// —— menus.js 源级：新提示落位 + 旧提示零残留 ——
const mSrc = fs.readFileSync(path.join(ROOT, 'js/view/menus.js'), 'utf8');
ok('menus.js 含 v21.42 注释（创建页 Esc 返回说明）', mSrc.includes('v21.42'));
ok('drawCreate 提示行新口径落位（…Enter 出发！    Esc 返回）',
  mSrc.includes("'← → 选择姓名     ↑ ↓ 选择难度    Enter 出发！    Esc 返回'"));
ok('drawCreate 旧口径提示行（Enter 出发 后直接逗号接面宽参数）源级零残留',
  !mSrc.includes("Enter 出发！',CV.width/2,432)"));

// —— README 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
ok('README tests 树收录 smoke_v2142_createesc', readme.includes('smoke_v2142_createesc'));
ok('README 件套口径为存活性断言（v21.7 惯例：改「冒烟/件套」存在性口径，实件数由 v21.43 冒烟守护）',
  readme.includes('冒烟') && readme.includes('件套'));
ok('README 含 v21.42 守护描述（创建角色页 Esc 返回）', readme.includes('创建角色页 Esc 返回守护'));
ok('README 快速上手表含创建页行（Esc/返回标题/不会建档）', readme.includes('创建页') && readme.includes('返回标题') && readme.includes('Esc') && readme.includes('不会建档'));

// —— package.json 收录 ——
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('package.json 已收录 smoke_v2142_createesc（npm test 串跑第 38 份）', pkg.includes('smoke_v2142_createesc.mjs'));

// —— 运行期实证：title→create→Esc→title 往返 + 选择键零回归 ——
const origName = S.createName, origDiff = S.createDiff, origScene = S.scene;
try {
  ok('import 后初始场景为 title（main.js 启动引导原样）', S.scene === 'title', S.scene);
  screens.title.onKey({ key: 'Enter' });
  ok('title.onKey Enter → create（进入创建页原样）', S.scene === 'create', S.scene);
  // Esc 返回（两种键名）
  screens.create.onKey({ key: 'Escape' });
  ok('create.onKey Escape → title（本次新增）', S.scene === 'title', S.scene);
  screens.title.onKey({ key: 'Enter' });
  screens.create.onKey({ key: 'Esc' });
  ok('create.onKey Esc（别名键）→ title', S.scene === 'title', S.scene);
  // 再进创建页：选择键零回归 + Esc 保留选择
  screens.title.onKey({ key: 'Enter' });
  ok('往返实证：title→create→Esc→title→create 回环', S.scene === 'create', S.scene);
  const nm0 = S.createName, df0 = S.createDiff;
  screens.create.onKey({ key: 'ArrowRight' });
  ok('←/→ 选择姓名零回归（ArrowRight 下一个）', S.createName === (nm0 + 1) % HERO_NAMES.length, S.createName);
  screens.create.onKey({ key: 'ArrowDown' });
  ok('↑/↓ 选择难度零回归（ArrowDown 下一个）', S.createDiff === (df0 + 1) % DIFFS.length, S.createDiff);
  screens.create.onKey({ key: 'd' });
  screens.create.onKey({ key: 's' });
  ok('小写 d/s 别名零回归', S.createName === (nm0 + 2) % HERO_NAMES.length && S.createDiff === (df0 + 2) % DIFFS.length,
    `${S.createName}/${S.createDiff}`);
  const nmKeep = S.createName, dfKeep = S.createDiff;
  screens.create.onKey({ key: 'Escape' });
  ok('Esc 返回保留 createName/createDiff（再进创建页仍是刚才的选择）', S.scene === 'title', S.scene);
  screens.title.onKey({ key: 'Enter' });
  ok('回环后 createName/createDiff 保留', S.createName === nmKeep && S.createDiff === dfKeep,
    `${S.createName}/${S.createDiff}`);
  // drawCreate 渲染：新行含 Esc 返回、旧行零残留
  drawn.length = 0;
  drawCreate();
  ok('drawCreate 渲染含「Esc 返回」（提示行新口径）',
    drawn.some((t) => t.includes('Esc 返回')), drawn.filter((t) => t.includes('选择姓名')).join(' | '));
  ok('drawCreate 渲染整行含「Enter 出发！」（前半零回归）',
    drawn.some((t) => t.includes('Enter 出发！')));
  ok('drawCreate 旧整行（…Enter 出发！无 Esc）渲染零残留',
    !drawn.some((t) => t === '← → 选择姓名     ↑ ↓ 选择难度    Enter 出发！'));
  // world Esc→pause 零回归（Esc 语义面抽查）
  S.scene = 'world';
  screens.world.onKey({ key: 'Escape' });
  ok('world.onKey Escape → pause（Esc 语义零回归）', S.scene === 'pause', S.scene);
  screens.pause.onKey({ key: 'Escape' });
  ok('pause.onKey Escape → world（Esc 关闭零回归）', S.scene === 'world', S.scene);
} finally {
  S.createName = origName;
  S.createDiff = origDiff;
  S.scene = origScene;
}

// —— smoke_v2141 的 README 件套口径断言已去硬化（v21.7 惯例）——
const s2141 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2141_deadhint.mjs'), 'utf8');
ok('smoke_v2141 的 README 件套口径断言已去硬化（v21.7 惯例：改用存活性口径 readme.includes(冒烟/件套)，旧精确断言表达式「readme.includes(三十七件套) && readme.includes(三十六件套清除)」零残留，实件数由本版冒烟守护）',
  s2141.includes("readme.includes('冒烟')") && s2141.includes("readme.includes('件套')") &&
  !s2141.includes("readme.includes('三十七件套') && readme.includes('三十六件套清除')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
