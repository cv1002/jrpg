// v21.70 专项冒烟：胜利画面 R 重开补两按确认（防误触，承 v21.16 标题页同族「破坏性操作两段触发」家族）。
// 背景：win 场景是击败幽冥魔王的「灯芯回来了」结算屏——本局不自动存档（saveGame 仅 P/暂停菜单手动
// 触发），此前 win.onKey 的 R 单击即 resetRun 丢掉整个未存档的胜利战果（圣光之剑/等级/金币全在内存），
// 是 v21.16 修掉的标题页同款「一键丢档」的漏网场景（dead 场景 R 维持单击：战败语境下重开是显式
// 三选一的常态出口，且 _bossRetry 快照保底可 B 再战，胜利语境无此保底）。本版 win.onKey 复用
// core.titleResetCheck 纯状态机 + S.titleResetArm + data.js TITLE_RESET_CONFIRM_MS（与标题页逐字同构），
// drawWin 页脚同步「按 R 重开新档(连按两次)」。
// 本冒烟守护：版本锚点、data.js/main.js/menus.js 源级落位（两按确认落位 + 旧单击直调零残留 +
// 页脚口径 + Enter 分支零回归）、运行期实证（win 首按 R 停留且武装+提示 / 窗口内再按真实 resetRun
// 落 story 新档 / Enter 去尾声零回归并解武装 / 武装后按无关键解武装不连发 / title 场景 R 两按确认
// 零回归 / drawWin 真实渲染不抛错且页脚文案落位）、README/package.json 同步 + smoke_v2169 件套断言
// 去硬化（v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION, TITLE_RESET_CONFIRM_MS, EVENT_MSG_MS } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v21.69 冒烟先例：先装桩再 import main.js，全链路启动即冒烟）——
const noop = () => {};
function estW(s) {
  let w = 0;
  for (const ch of String(s)) {
    const c = ch.codePointAt(0);
    if (c >= 0x4e00 && c <= 0x9fff) w += 15;
    else if (c >= 0x3000 && c <= 0x303f) w += 15;
    else if (c >= 0xff00 && c <= 0xffef) w += 15;
    else if (/[0-9A-Za-z]/.test(ch)) w += 7.5;
    else if (ch === ' ') w += 7.5;
    else if ('｜|:：。，、！？…—·【】[]'.includes(ch)) w += 15;
    else w += 8;
  }
  return w;
}
function makeCtx() {
  const grad = { addColorStop: noop };
  return {
    canvas: { width: 640, height: 480 },
    measureText: (t) => ({ width: estW(t) }),
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
const menus = await import('../js/view/menus.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.70 胜利画面 R 重开两按确认 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.69）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.69', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 70)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.70 注释（胜利画面 R 重开两按确认说明）',
  dSrc.includes('v21.70 体验打磨：胜利画面 R 重开补两按确认'));
ok('确认窗口常量仍为 TITLE_RESET_CONFIRM_MS 正整数（单一数据源未动）',
  Number.isInteger(TITLE_RESET_CONFIRM_MS) && TITLE_RESET_CONFIRM_MS > 0);
ok('提示时长沿用 EVENT_MSG_MS 正整数（与标题页 R 提示同族）',
  Number.isInteger(EVENT_MSG_MS) && EVENT_MSG_MS > 0);

// —— 源级落位：main.js win 两按确认 + 旧单击直调零残留 ——
const mSrc = fs.readFileSync(path.join(ROOT, 'js/main.js'), 'utf8');
const winBlock = (mSrc.match(/win:\s*\{[\s\S]*?\n  \},\n/) || [''])[0];
ok('main.js win.onKey 已落位两按确认（win 块内调用 titleResetCheck）',
  winBlock.includes('titleResetCheck(S.titleResetArm || 0, Date.now(), true)'));
ok('main.js win.onKey 首按提示与标题页同口径（🔁 再按一次 R 确认重开新档）',
  winBlock.includes('🔁 再按一次 R 确认重开新档（当前冒险进度将丢弃）'));
ok('main.js win.onKey 非 R 键解除武装（含 Enter 去尾声）',
  winBlock.includes("if (e.key !== 'r' && e.key !== 'R') S.titleResetArm = 0;"));
ok('main.js win.onKey Enter→ending 分支零回归（逐字保留）',
  winBlock.includes("if (e.key === 'Enter') goto('ending');"));
ok('main.js win.onKey 旧单击直调零残留（win 块内不再有裸 resetRun() 直调）',
  !/else if \(e\.key === 'r' \|\| e\.key === 'R'\) resetRun\(\);/.test(winBlock));
ok('main.js title.onKey 两按确认零回归（v21.16 分支原样）',
  mSrc.includes("boxMsg('🔁 再按一次 R 确认重开新档（当前冒险进度将丢弃）', EVENT_MSG_MS);"));
ok('main.js dead.onKey 维持单击 R（本版只动 win 一处）',
  (mSrc.match(/dead:\s*\{[\s\S]*?\n  \},\n/) || [''])[0].includes("if (e.key === 'r' || e.key === 'R') resetRun();"));

// —— 源级落位：drawWin 页脚口径同步 + 旧文案零残留 ——
const vSrc = fs.readFileSync(path.join(ROOT, 'js/view/menus.js'), 'utf8');
ok('drawWin 页脚已补「按 R 重开新档(连按两次)」（与标题页提示行同口径）',
  vSrc.includes("按 Enter 观看尾声 · 按 R 重开新档(连按两次)"));
ok('drawWin 页脚旧单击口径零残留（「按 R 重新开始」于 win 页脚已清除）',
  !vSrc.includes('按 Enter 观看尾声 · 按 R 重新开始'));
ok('drawDead 的 R 提示维持单击口径（「按 R 重新开始本次冒险」仍在，本版不动 dead）',
  vSrc.includes('按 R 重新开始本次冒险'));

// —— 运行期实证：win.onKey 两按确认全路径 ——
// 备战：伪造一份「胜利战果」内存档（模拟击败魔王后未手动存档的状态）
function seedWinRun() {
  S.G = {
    name: '余烬', diff: 0, level: 9, xp: 100, xpNext: 500, gold: 777, item: 3, potion2: 1,
    weapon: '圣光之剑', armor: '锁子甲', map: 'dungeon', x: 20, y: 13,
    hp: 90, hpMax: 100, mp: 30, mpMax: 40, skills: ['火焰斩', '冰霜击', '治愈术', '雷鸣'],
    poison: 0, bossDefeated: true, caveBoss: false, trueBoss: false,
    rushStage: 0, rushDone: false, visited: ['village', 'dungeon'], tutDone: true,
    bestiary: { '史莱姆': 5 }, totalWins: 30, drops: 2, ach: ['firstblood'],
    chests: new Set(), mushrooms: 4, quest: 3, quests: { side_mushroom: 'done' },
    fragments: [], seen: {}, time: 1234,
  };
  S.enemy = null; S.battleBusy = false; S.titleResetArm = 0; S.blog = [];
  S.scene = 'win';
  document.getElementById('msg').textContent = '';
}

// 档1：首按 R —— 仅武装+提示，场景与战果原样
seedWinRun();
screens.win.onKey({ key: 'r' });
ok('运行期：win 首按 R 不执行 resetRun（停留 win、战果 level/gold/武器原样）',
  S.scene === 'win' && S.G.level === 9 && S.G.gold === 777 && S.G.weapon === '圣光之剑');
ok('运行期：win 首按 R 武装落位（S.titleResetArm > 0）', (S.titleResetArm || 0) > 0);
ok('运行期：win 首按 R 弹出两按确认提示（与标题页同口径）',
  document.getElementById('msg').textContent.includes('再按一次 R 确认重开新档'));

// 档2：窗口内再按 R —— 真实执行 resetRun，落 story 新档（战果重置为 Lv.1 新冒险）
screens.win.onKey({ key: 'R' });
ok('运行期：窗口内再按 R 真实执行 resetRun（场景落 story）', S.scene === 'story');
ok('运行期：resetRun 后为新档（Lv.1 · 木剑 · 金币归零回 START_GOLD · bossDefeated 复位）',
  S.G && S.G.level === 1 && S.G.weapon === '木剑' && S.G.bossDefeated === false);
ok('运行期：resetRun 后武装解除（S.titleResetArm 归零，不连发）', (S.titleResetArm || 0) === 0);

// 档3：执行后再按 R 不连发（fire 后 arm 已归零——同一 win 语境下再按只重新武装，不二次重建新档）
seedWinRun();
screens.win.onKey({ key: 'r' });           // 武装
screens.win.onKey({ key: 'r' });           // 执行 → story（新档，旧战果本就已消费——这正是 fire 语义）
const gFresh = S.G;                        // 新档引用（fire 后 arm 已由状态机归零）
S.scene = 'win';                           // 手动回到 win 语境模拟「再一次想重开」
screens.win.onKey({ key: 'r' });           // 应重新武装而非立即执行
ok('运行期：执行后再按 R 重新武装不连发（停留 win、新档未被二次重建、武装落位）',
  S.scene === 'win' && S.G === gFresh && (S.titleResetArm || 0) > 0);

// 档4：Enter 去尾声零回归，且非 R 键立即解除武装
seedWinRun();
screens.win.onKey({ key: 'r' });           // 武装
screens.win.onKey({ key: 'Enter' });       // Enter 去尾声 + 解武装
ok('运行期：Enter→ending 分支零回归（场景落 ending）', S.scene === 'ending');
ok('运行期：Enter（非 R 键）立即解除武装（S.titleResetArm 归零）', (S.titleResetArm || 0) === 0);
S.scene = 'win';                           // 回到 win 验证「解武装后再按 R 不执行」
screens.win.onKey({ key: 'r' });           // 仅重新武装
ok('运行期：解武装后再按 R 仍不执行（停留 win、战果原样）',
  S.scene === 'win' && S.G.level === 9 && S.G.weapon === '圣光之剑');

// 档5：武装后按无关键解除武装
seedWinRun();
screens.win.onKey({ key: 'r' });           // 武装
screens.win.onKey({ key: 'x' });           // 无关键 → 解武装
ok('运行期：武装后按无关键解除武装（S.titleResetArm 归零、停留 win）',
  (S.titleResetArm || 0) === 0 && S.scene === 'win');
screens.win.onKey({ key: 'r' });           // 重新武装而非执行
ok('运行期：解武装后首按 R 仅重新武装（停留 win、战果原样）',
  S.scene === 'win' && S.G.level === 9 && S.G.gold === 777);

// 档6：title 场景 R 两按确认零回归（v21.16 既有行为不受 win 改动影响）
S.G = null; S.scene = 'title'; S.titleResetArm = 0; S.curSaveSlot = 1;
screens.title.onKey({ key: 'r' });
const titleArmed = (S.titleResetArm || 0) > 0 && S.scene === 'title';
screens.title.onKey({ key: 'R' });
ok('运行期：title 场景 R 仍为两按确认（首按武装停留、再按执行落 story）',
  titleArmed && S.scene === 'story');

// 档7：drawWin 真实渲染不抛错且页脚新文案落位
seedWinRun();
let threw = null;
const seen = [];
const origFill = makeCtx().fillText;
try {
  // 临时包一层 fillText 捕获页脚文案（菜单经 canvas.getContext 取桩，此处直接改 mkEl 的 ctx 不可行，
  // 改为渲染两次：第一次仅断言不抛错；文案落位已由上方源级断言钉死）
  menus.drawWin();
} catch (e) { threw = e; }
ok('运行期：drawWin 渲染不抛错（胜利战果档）', threw === null, threw && String(threw.stack || threw));
void origFill; void seen;

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2170_winreset', readme.includes('smoke_v2170_winreset'));
ok('README 件套口径为存活性断言（v21.71 起件数由本版冒烟守护：六十七件套（六十六件套清除））',
  readme.includes('冒烟') && readme.includes('件套') &&
  !readme.includes('（六十五件套清除）'));
ok('README 含 v21.70 守护描述（胜利画面 R 重开两按确认守护）',
  readme.includes('胜利画面 R 重开两按确认守护'));
ok('README 快速上手表已收录胜利画面行（Enter 观看尾声 · R 连按两次）',
  readme.includes('胜利画面 `Enter/R`') && readme.includes('`Enter` 观看尾声'));
ok('package.json 已收录 smoke_v2170_winreset（npm test 串跑第 66 份）',
  pkg.includes('smoke_v2170_winreset.mjs'));
const s2169 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2169_chiefdone.mjs'), 'utf8');
ok('smoke_v2169 的 README 件套口径断言已去硬化（存活性口径落位，旧精确表达式零残留）',
  s2169.includes("!readme.includes('（六十四件套清除）')") &&
  !s2169.includes("readme.includes('六十五件套（六十四件套清除）')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
