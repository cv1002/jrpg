// v21.43 专项冒烟：对话翻页补 E 键别名——talk.onKey 的 e/E 与 Enter 同路径调用 talkNext。
// v21.29-32 把 README 快速上手表、H 页「对话 / 确认」行、新手教程提示、世界画面面向提示全部同步成
// 「Enter / E」，但进入对话之后的每一页 talk.onKey 仍只认 Enter：按 E 想继续/翻页毫无反应——
// 「文档写的键按了没反应」（v21.16/v21.33 同族）。本版补 `e/E → talkNext()`（与 Enter 完全同路径：
// 本页打字机未打完补全本页 / 打完翻页 / 末页结束对话回 world），isEsc 分支逐字未动，纯入口零结算。
// 本冒烟守护：版本锚点、main.js 源级新条件 + 旧单 Enter 行零残留 + isEsc 保留、KEY 无 'e' 映射、
// 运行期 talk 场景 e/E/Enter/Esc 四键分派实证（补全/翻页/结束对话/关闭四状态与 Enter 零行为差）、
// world.onKey E/Enter 交互零回归（v21.29 口径）、H 页「对话 / 确认」行 v21.29 口径零回归、
// README 同步（tests 树/三十九件套（三十八件套清除）/v21.43 守护描述/快速上手表对话内同效口径）、
// package.json 收录、smoke_v2142 件套断言去硬化确认（v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION, KEY, HELP_PAGES } from '../js/data.js';
import { pageTotalMs } from '../js/rules.js';
import { bind } from '../js/bind.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v21.42 冒烟先例：先装桩再 import main.js）——
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

console.log('— v21.43 对话翻页 E 键别名 冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.42）——
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.42', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 43)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.43 注释（对话翻页 E 键别名说明）', dSrc.includes('v21.43'));

// —— main.js 源级：新条件落位 + 旧单 Enter 行零残留 + isEsc 保留 ——
const mainSrc = fs.readFileSync(path.join(ROOT, 'js/main.js'), 'utf8');
ok('main.js 含 v21.43 注释（对话翻页 E 键别名）', mainSrc.includes('v21.43 对话翻页补 E 键别名'));
ok('main.js talk.onKey 新条件落位（Enter/e/E → talkNext，全文件唯一）',
  mainSrc.includes("if (e.key === 'Enter' || e.key === 'e' || e.key === 'E') talkNext();"));
ok('main.js talk.onKey 旧单 Enter 行源级零残留', !mainSrc.includes("if (e.key === 'Enter') talkNext();"));
ok('main.js talk.onKey Esc 关闭分支保留（isEsc → backWorld）',
  mainSrc.includes("else if (isEsc(e)) backWorld();"));
ok("KEY 无 'e' 映射（不与移动键冲突）", !KEY['e'] && !KEY['E']);

// —— 运行期实证：talk 场景 e/E/Enter/Esc 四键分派 ——
const origScene = S.scene;
const origTalk = { pages: S.talkPages, page: S.talkPage, lineAt: S.talkLineAt, npc: S.curNpc };
function enterTalk(pages) {
  S.scene = 'talk';
  S.talkPages = pages;
  S.talkPage = 0;
  S.talkLineAt = Date.now() - 100000; // 页已打完（打字机完成态）
  S.curNpc = 'granny';                // 无任务委托 NPC → resolveNpcTalk 返回 null → 走翻页路径
}
try {
  ok('import 后初始场景为 title（main.js 启动引导原样）', origScene === 'title', origScene);
  // 1) 完成页 + 小写 e → 翻页（与 Enter 同行为）
  enterTalk([['灯灭那晚，雾从井底漫出来。'], ['你替大家记着吧。']]);
  screens.talk.onKey({ key: 'e' });
  ok('talk.onKey(\'e\')（完成页）→ 翻至第 2 页（scene 仍在 talk）',
    S.talkPage === 1 && S.scene === 'talk', `${S.talkPage}/${S.scene}`);
  // 2) 完成页 + 大写 E → 末页翻完结束对话回 world
  S.talkLineAt = Date.now() - 100000;
  screens.talk.onKey({ key: 'E' });
  ok('talk.onKey(\'E\')（末页）→ 结束对话回 world（与 Enter 同行为）',
    S.talkPage === 2 && S.scene === 'world', `${S.talkPage}/${S.scene}`);
  // 3) 打字机未打完态 + e → 补全本页不翻页（与 Enter 同行为：只推进 talkLineAt）
  S.scene = 'talk';
  S.talkPages = [['雾语林的草丛很深的。']];
  S.talkPage = 0;
  S.talkLineAt = Date.now();
  S.curNpc = 'granny';
  const total = pageTotalMs(S.talkPages[0]);
  screens.talk.onKey({ key: 'e' });
  ok('talk.onKey(\'e\')（打字机未打完）→ 只补全本页不翻页（talkPage 不变）',
    S.talkPage === 0 && S.scene === 'talk', `${S.talkPage}/${S.scene}`);
  ok('talk.onKey(\'e\') 补全后打字机计时被推进到完成态（与 Enter 零行为差）',
    Date.now() - S.talkLineAt >= total - 1, `${Date.now() - S.talkLineAt} vs ${total}`);
  // 4) Enter 零回归：完成页按 Enter 仍翻页
  enterTalk([['第一页。'], ['第二页。']]);
  screens.talk.onKey({ key: 'Enter' });
  ok('talk.onKey Enter（完成页）→ 翻页零回归', S.talkPage === 1, S.talkPage);
  // 5) Esc 零回归：两种键名都关闭回 world
  enterTalk([['按完了。']]);
  screens.talk.onKey({ key: 'Escape' });
  ok('talk.onKey Escape → 关闭对话回 world（Esc 零回归）', S.scene === 'world', S.scene);
  S.scene = 'talk'; S.talkPages = [['x']]; S.talkPage = 0; S.talkLineAt = Date.now() - 100000;
  screens.talk.onKey({ key: 'Esc' });
  ok('talk.onKey Esc（别名键）→ 关闭对话回 world', S.scene === 'world', S.scene);
  // 6) world 交互 E/Enter 零回归（v21.29 口径）：置于潮灯镇 (10,15) 面向上方 (10,14) 路径格
  const calls = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { calls.push(String(t)); };
  S.scene = 'world';
  S.G.x = 10; S.G.y = 15; S.G.dir = 'U';
  try {
    calls.length = 0;
    screens.world.onKey({ key: 'e' });
    ok("world.onKey('e') 交互零回归（boxMsg「（这里没什么特别的）」）",
      calls.length === 1 && calls[0].includes('这里没什么特别的'), JSON.stringify(calls));
    calls.length = 0;
    screens.world.onKey({ key: 'Enter' });
    ok("world.onKey('Enter') 交互零回归", calls.length === 1 && calls[0].includes('这里没什么特别的'), JSON.stringify(calls));
  } finally {
    bind.boxMsg = origBox;
  }
  // 7) H 页「对话 / 确认」行 v21.29 口径零回归（Enter / E）
  const dialogRow = HELP_PAGES[0].find((r) => r[0] === '对话 / 确认');
  ok('H 页操作说明「对话 / 确认」行 v21.29 口径零回归（Enter / E（镇民需面对面））',
    !!dialogRow && dialogRow[1] === 'Enter / E（镇民需面对面）', dialogRow && dialogRow[1]);
} finally {
  S.scene = origScene;
  S.talkPages = origTalk.pages; S.talkPage = origTalk.page;
  S.talkLineAt = origTalk.lineAt; S.curNpc = origTalk.npc;
}

// —— README 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
ok('README tests 树收录 smoke_v2143_talkekey', readme.includes('smoke_v2143_talkekey'));
ok('README 件套口径为三十九件套（三十八件套清除）', readme.includes('三十九件套') && readme.includes('三十八件套清除'));
ok('README 含 v21.43 守护描述（对话翻页 E 键别名守护）', readme.includes('对话翻页 E 键别名守护'));
ok('README 快速上手表 Enter/E 行含对话内同效口径（对话进行中 E 同效继续/翻页）',
  readme.includes('`Enter` / `E`') && readme.includes('对话进行中') && readme.includes('同效'));

// —— package.json 收录 ——
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('package.json 已收录 smoke_v2143_talkekey（npm test 串跑第 39 份）', pkg.includes('smoke_v2143_talkekey.mjs'));

// —— smoke_v2142 的 README 件套口径断言已去硬化（v21.7 惯例）——
const s2142 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2142_createesc.mjs'), 'utf8');
ok('smoke_v2142 的 README 件套口径断言已去硬化（v21.7 惯例：改用存活性口径 readme.includes(冒烟/件套)，旧精确断言表达式「readme.includes(三十八件套) && readme.includes(三十七件套清除)」零残留，实件数由本版冒烟守护）',
  s2142.includes("readme.includes('冒烟')") && s2142.includes("readme.includes('件套')") &&
  !s2142.includes("readme.includes('三十八件套') && readme.includes('三十七件套清除')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
