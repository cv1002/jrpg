// v21.41 专项冒烟：战败画面图鉴入口口径修正——drawDead 普通战败提示「用记忆图鉴(B)查看魔物强度后再战」
// 与 dead 场景真实按键分派冲突：main.js dead.onKey 的 B 绑定 retryBoss（强敌战败=重整旗鼓、普通战败/
// 试炼 rush=无反应——retryBoss 无 _bossRetry 时直接 return false），记忆图鉴入口只在世界画面
// （world.onKey 的 B → codex）；且 codex.onKey 关闭走 backWorld（从 dead 打开图鉴再关会错回 world），
// 故本版仅修正提示文字口径（如实标注「图鉴在世界画面按 B 打开」），不绑 B→图鉴。纯文字、零逻辑零结算。
// 本冒烟守护：版本锚点、menus.js 源级新口径 + 旧口径零残留、main.js 分派事实源级落位（dead B=retryBoss /
// world B=codex / codex 关闭=backWorld）、运行期 drawDead 双分支渲染实证（普通战败新提示 / Boss 战败
// 重整旗鼓提示逐字零回归 / 试炼 rush 走普通分支）、普通战败 dead.onKey 按 B 无反应（retryBoss 空
// _bossRetry 早退、场景不变）、README 同步（tests 树/三十七件套（三十六件套清除）/v21.41 守护描述/
// 战败复盘口径）、package.json 收录、smoke_v2140 件套断言去硬化确认（v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.30-v21.40 冒烟先例：先装桩再 import main.js；ctx 记录所有 fillText）——
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
const { drawDead } = await import('../js/view/index.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.41 战败画面图鉴入口口径修正 冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.40）——
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.40', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 41)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.41 注释（战败图鉴入口口径说明）', dSrc.includes('v21.41'));

// —— menus.js 源级：新口径落位 + 旧口径零残留 ——
const mSrc = fs.readFileSync(path.join(ROOT, 'js/view/menus.js'), 'utf8');
ok('menus.js 含 v21.41 注释（战败提示图鉴入口口径说明）', mSrc.includes('v21.41'));
ok('drawDead 普通战败新提示落位（图鉴在世界画面按 B 打开）',
  mSrc.includes('再战前先用记忆图鉴看清魔物强度（图鉴在世界画面按 B 打开）'));
ok('drawDead 旧口径渲染字面量（"💡 建议：回村 旅馆/喷泉 补给，用记忆图鉴(B)…"）源级零残留',
  !mSrc.includes("'💡 建议：回村 旅馆/喷泉 补给，用记忆图鉴(B)"));
ok('drawDead Boss 战败分支「再按 B 重整旗鼓」逐字零回归',
  mSrc.includes("再按 B 重整旗鼓挑战${hero._bossRetry.name||'强敌'}！"));

// —— main.js 分派事实源级落位（证明提示只改文字、分派未动且 B≠图鉴）——
const mainSrc = fs.readFileSync(path.join(ROOT, 'js/main.js'), 'utf8');
ok('main.js dead.onKey B 绑定 retryBoss（战败画面按 B 不等于开图鉴）',
  mainSrc.includes("else if (e.key === 'b' || e.key === 'B') retryBoss();"));
ok('main.js world.onKey B 绑定 codex（图鉴入口在世界画面）',
  mainSrc.includes("if (e.key === 'b' || e.key === 'B') { goto('codex'); return; }"));
ok('main.js codex.onKey 关闭走 backWorld（从 dead 进图鉴再关会错回 world，故不绑 B→图鉴）',
  mainSrc.includes("if (e.key === 'b' || e.key === 'B' || isEsc(e)) backWorld();"));

// —— README 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
ok('README tests 树收录 smoke_v2141_deadhint', readme.includes('smoke_v2141_deadhint'));
ok('README 件套口径为三十七件套（三十六件套清除）', readme.includes('三十七件套') && readme.includes('三十六件套清除'));
ok('README 含 v21.41 守护描述（战败画面图鉴入口口径）', readme.includes('v21.41 起含战败画面图鉴入口口径守护'));
ok('README 战败复盘口径同步（普通怪提示看清魔物强度·图鉴入口在世界画面按 B）',
  readme.includes('普通怪提示回村补给并看清魔物强度') && readme.includes('图鉴入口在世界画面按 B'));
ok('README 阵亡行「强敌战败后 B 重整旗鼓」保留（该行本就如实）',
  readme.includes('强敌战败后 `B` 重整旗鼓'));

// —— package.json 收录 ——
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('package.json 已收录 smoke_v2141_deadhint（npm test 串跑第 37 份）', pkg.includes('smoke_v2141_deadhint.mjs'));

// —— 运行期实证：drawDead 双分支渲染（fillText 捕获）——
const origG = S.G, origEnemy = S.enemy;
try {
  S.enemy = { name: '史莱姆' };
  S.G = { level: 3, gold: 120, bestiary: { 史莱姆: 2 }, time: 0,
    item: 2, potion2: 1, mushrooms: 1, _bossRetry: null };
  drawn.length = 0;
  drawDead();
  ok('普通战败：新提示渲染（「再战前先用记忆图鉴看清魔物强度（图鉴在世界画面按 B 打开）」）',
    drawn.some((t) => t.includes('再战前先用记忆图鉴看清魔物强度') && t.includes('图鉴在世界画面按 B 打开')),
    drawn.filter((t) => t.includes('建议')).join(' | '));
  ok('普通战败：旧口径「用记忆图鉴(B)查看魔物强度」渲染零残留',
    !drawn.some((t) => t.includes('用记忆图鉴(B)')));
  ok('普通战败：无「按 B 重整旗鼓」行（非强敌战败如实）',
    !drawn.some((t) => t.includes('按 B 重整旗鼓')));
  // Boss 战败分支零回归
  S.G = { level: 5, gold: 120, bestiary: {}, time: 0,
    item: 1, potion2: 0, mushrooms: 0, _bossRetry: { bossId: 'main', name: '幽冥魔王' } };
  drawn.length = 0;
  drawDead();
  ok('Boss 战败：重整旗鼓提示零回归（「再按 B 重整旗鼓挑战幽冥魔王！」）',
    drawn.some((t) => t.includes('再按 B 重整旗鼓挑战幽冥魔王')), drawn.filter((t) => t.includes('建议')).join(' | '));
  ok('Boss 战败：不出现普通战败新提示（if/else 分支互斥）',
    !drawn.some((t) => t.includes('图鉴在世界画面按 B 打开')));
  // 试炼 rush 战败（bossId==='rush'）：bossDeath=false → 普通分支提示，与 retryBoss 对 rush 早退同口径
  S.G = { level: 5, gold: 120, bestiary: {}, time: 0,
    item: 1, potion2: 0, mushrooms: 0, _bossRetry: { bossId: 'rush', name: '试炼' } };
  drawn.length = 0;
  drawDead();
  ok('试炼(字 rush)战败：走普通分支提示（与 retryBoss 对 rush 早退的口径一致）',
    drawn.some((t) => t.includes('图鉴在世界画面按 B 打开')));
  // 运行期分派：普通战败按 B 无反应（retryBoss 空 _bossRetry 早退，场景不变）
  S.G = { level: 3, gold: 120, bestiary: {}, time: 0,
    item: 1, potion2: 0, mushrooms: 0, _bossRetry: null };
  const scBefore = S.scene;
  screens.dead.onKey({ key: 'b' });
  ok('普通战败 dead.onKey 按 B 无反应（retryBoss 空 _bossRetry 早退、场景不变）', S.scene === scBefore, S.scene);
  screens.dead.onKey({ key: 'B' });
  ok('大写 B 同样无反应', S.scene === scBefore, S.scene);
} finally {
  S.G = origG;
  S.enemy = origEnemy;
}

// —— smoke_v2140 的 README 件套口径断言已去硬化（v21.7 惯例）——
const s2140 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2140_norecover.mjs'), 'utf8');
ok('smoke_v2140 的 README 件套口径断言已去硬化（v21.7 惯例：改用存活性口径 readme.includes(冒烟/件套)，旧精确断言表达式「readme.includes 三十六件套 且 readme.includes 三十五件套清除」零残留，实件数由本版冒烟守护）',
  s2140.includes("readme.includes('冒烟')") && s2140.includes("readme.includes('件套')") &&
  !s2140.includes("readme.includes('三十六件套') && readme.includes('三十五件套清除')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
