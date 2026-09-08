// v21.69 专项冒烟：灯长通关差分对话（支线「灯长的委托」done 页按主线进度三档分档，
// 内容补全·承 v20.8 side_ember / v21.67 side_bone done 页函数分档先例）。
// 背景：灯长是全游戏唯一 done 页嵌着「会过期的主线状态陈述」的任务 NPC——原页
// 「可广场那盏大灯，还在等灯芯」在击败幽冥魔王（bossDefeated）后即成事实错误
// （主线日志 main_demon.done 自述「镇上的灯重新亮了」、胜利画面「灯芯回来了」），
// 终焉之神散后（trueBoss，井也不鸣了）更与时态不符；v21.67 归入「静态 done 页讲支线
// 余韵」的猎手/守书记等页均为纯支线余韵（不引用主线状态），灯长这页是唯一的漏网。
// 三档：!bossDefeated 原页逐字保留 / bossDefeated（大灯亮了·井仍低鸣，与 main_demon.done
// 同口径）/ trueBoss（井也不鸣·名字回灯，与 main_true.done 同口径）。
// 本冒烟守护：版本锚点、data.js 源级落位（v21.69 注释 + done 三档函数页落位 + 原页
// 默认档逐字保留 + 完成标记/[Enter] 收尾三档齐备）、行宽预算（estW ≤440）、
// side_ember/side_bone 先例与其余支线零回归、运行期实证（三档 npcQuestPages 逐字落位 /
// 防御式求值 / offer·active·turnin 零回归 / done 状态机与顶标归零 / resolveNpcTalk 不重发奖 /
// drawTalk 三档真实渲染不抛错）、README/package.json 同步 + smoke_v2168 件套断言去硬化（v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION, QUESTS, NPCS } from '../js/data.js';
import { npcQuestPages, npcQuestMark, questStatus, resolveNpcTalk } from '../js/quests.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v21.68 冒烟先例：先装桩再 import main.js）——
const noop = () => {};
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
// 中文字符像素宽估算（与 15px sans-serif 实测一致，承 smoke-harness 惯例）
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
const menus = await import('../js/view/menus.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.69 灯长通关差分对话（done 页主线三档） 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.68）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.68', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 69)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.69 注释（灯长通关差分对话说明）',
  dSrc.includes('v21.69 内容补全：灯长通关差分对话'));

// —— data.js 源级落位：side_mushroom done 由静态数组升级为主线进度三档函数页 ——
const qm = QUESTS.side_mushroom;
ok('side_mushroom done 页为函数（主线进度三档分档，承 v20.8/v21.67 先例）',
  !!qm && qm.talk && typeof qm.talk.done === 'function');
const OLD_PAGE = [[
  '谢谢你。井泉的灯油续上了，泉水亮了一点。可广场那盏大灯，还在等灯芯。',
  '（支线任务·已完成）',
  '[Enter] 继续',
]];
const MID_PAGE = [[
  '灯芯回来了，广场的大灯亮起来了。可你听——井还在低鸣。',
  '（支线任务·已完成）',
  '[Enter] 继续',
]];
const TRUE_PAGE = [[
  '井也不鸣了。镇上的灯一盏一盏，都亮回了自己的名字。',
  '（支线任务·已完成）',
  '[Enter] 继续',
]];
const doneDefault = qm.talk.done({});
const doneMid = qm.talk.done({ bossDefeated: true });
const doneTrue = qm.talk.done({ bossDefeated: true, trueBoss: true });
ok('未讨回灯芯档与原页逐字一致（零回归）',
  JSON.stringify(doneDefault) === JSON.stringify(OLD_PAGE), JSON.stringify(doneDefault));
ok('讨回灯芯档（bossDefeated）新页逐字（大灯亮了·井仍低鸣，与 main_demon.done 同口径）',
  JSON.stringify(doneMid) === JSON.stringify(MID_PAGE), JSON.stringify(doneMid));
ok('真结局档（trueBoss）新页逐字（井也不鸣·名字回灯，与 main_true.done 同口径）',
  JSON.stringify(doneTrue) === JSON.stringify(TRUE_PAGE), JSON.stringify(doneTrue));
ok('三档页组结构合法（页数组 + 每页行数组 + [Enter] 收尾 + 完成标记齐备）',
  [doneDefault, doneMid, doneTrue].every((pages) => Array.isArray(pages) &&
    pages.every((pg) => Array.isArray(pg) && /\[Enter\]/.test(pg[pg.length - 1]) &&
      pg.some((ln) => ln.includes('（支线任务·已完成）')))));
// 行宽预算只约束本次新增的两档（档2/档3）：原页（档1）是 v21.52 起既有文案、逐字保留，
// 其长单句在真实渲染中由 drawTalk 的 wrapTalkLine 像素折行兜底（不在本次改动面内）。
ok('新增两档行宽预算内（对话面板 MAX_W=440，15px 估算；原页为 v21.52 既有文案逐字保留）',
  [MID_PAGE, TRUE_PAGE].every((pages) => pages[0].every((ln) => estW(ln) <= 440)),
  [MID_PAGE, TRUE_PAGE].map((p) => p[0].map((ln) => estW(ln)).join('/')).join(' | '));
ok('防御式求值：hero 为 null/无旗标字段均落未讨回档（不抛错）',
  JSON.stringify(qm.talk.done(null)) === JSON.stringify(OLD_PAGE) &&
  JSON.stringify(qm.talk.done({})) === JSON.stringify(OLD_PAGE));
ok('防御式求值：仅 trueBoss 无 bossDefeated 的异常档落真结局档（trueBoss 优先，与判定顺序同口径）',
  JSON.stringify(qm.talk.done({ trueBoss: true })) === JSON.stringify(TRUE_PAGE));

// —— 主线 done 文案同口径守护（分档口径与任务日志同源事实一致）——
ok('main_demon.done 自述「镇上的灯重新亮了——可井还在低鸣」（档2 口径来源零回归）',
  QUESTS.main_demon.done.includes('镇上的灯重新亮了') && QUESTS.main_demon.done.includes('井还在低鸣'));
ok('main_true.done 自述「记忆回到镇上」（档3 口径来源零回归）',
  QUESTS.main_true.done.includes('记忆回到镇上'));

// —— side_ember/side_bone 先例与其余支线零回归 ——
ok('side_ember / side_bone done 仍为 trueBoss 分档函数页（v20.8/v21.67 先例零回归）',
  typeof QUESTS.side_ember.talk.done === 'function' && typeof QUESTS.side_bone.talk.done === 'function');
ok('side_mist / side_stone done 页保持静态数组（本版只动 side_mushroom 一处）',
  Array.isArray(QUESTS.side_mist.talk.done) && Array.isArray(QUESTS.side_stone.talk.done));
ok('side_mushroom offer/turnin 静态页与 active 函数页零回归',
  Array.isArray(qm.talk.offer) && Array.isArray(qm.talk.turnin) && typeof qm.talk.active === 'function');
ok('side_mushroom cond/reward/名称地点零回归（giver=chief · n=MUSHROOM_GOAL · 奖励 40+lv*10 金+2 药）',
  qm.giver === 'chief' && qm.n === 3 && typeof qm.reward.gold === 'function' && qm.reward.item === 2);
ok('NPCS.chief 仍无静态 lines/after（任务页是其唯一对话通道，任务页恒优先）',
  !!NPCS.chief && !('lines' in NPCS.chief) && !('after' in NPCS.chief) && !('linesByStage' in NPCS.chief));

// —— 运行期实证：npcQuestPages 全链路三档 ——
const hDone = { quests: { side_mushroom: 'done' }, mushrooms: 5 };
const hDoneMid = { quests: { side_mushroom: 'done' }, mushrooms: 5, bossDefeated: true };
const hDoneTrue = { quests: { side_mushroom: 'done' }, mushrooms: 5, bossDefeated: true, trueBoss: true };
ok('运行期：done 未讨回档 npcQuestPages 落原页（逐字）',
  JSON.stringify(npcQuestPages(hDone, 'chief')) === JSON.stringify(OLD_PAGE));
ok('运行期：done 讨回灯芯档 npcQuestPages 落档2新页（逐字）',
  JSON.stringify(npcQuestPages(hDoneMid, 'chief')) === JSON.stringify(MID_PAGE));
ok('运行期：done 真结局档 npcQuestPages 落档3新页（逐字）',
  JSON.stringify(npcQuestPages(hDoneTrue, 'chief')) === JSON.stringify(TRUE_PAGE));
ok('运行期：active 函数页按 hero 实时报进度零回归（1/3 株，主线旗标不串档）',
  npcQuestPages({ quests: { side_mushroom: 'active' }, mushrooms: 1, bossDefeated: true }, 'chief')[0]
    .some((ln) => ln.includes('1/3 株')));
ok('运行期：offer/turnin 档不受分档影响（新档 offer 页含「灯芯灭了」；turnin 档落「领取奖励」页）',
  npcQuestPages({ mushrooms: 0 }, 'chief')[0].some((ln) => ln.includes('灯芯灭了')) &&
  npcQuestPages({ quests: { side_mushroom: 'turnin' }, mushrooms: 3, trueBoss: true }, 'chief')[0]
    .some((ln) => ln.includes('[Enter] 领取奖励')));
ok('运行期：done 状态机零回归（questStatus===done、npcQuestMark 归零、resolveNpcTalk 不重发奖）',
  questStatus(hDoneTrue, 'side_mushroom') === 'done' && npcQuestMark(hDoneTrue, 'chief') === null &&
  resolveNpcTalk(hDoneTrue, 'chief') === null);

// —— 运行期实证：drawTalk 三档真实渲染不抛错 ——
function renderTalk(hero) {
  S.G = hero; S.curNpc = 'chief'; S.scene = 'talk';
  S.talkPages = npcQuestPages(hero, 'chief'); S.talkPage = 0; S.talkLineAt = 0; S.talkStartAt = 0;
  let threw = null;
  try { menus.drawTalk(); } catch (e) { threw = e; }
  S.scene = 'title';
  return threw;
}
ok('运行期：drawTalk 渲染未讨回档不抛错', renderTalk(hDone) === null);
ok('运行期：drawTalk 渲染讨回灯芯档不抛错', renderTalk(hDoneMid) === null);
ok('运行期：drawTalk 渲染真结局档不抛错', renderTalk(hDoneTrue) === null);

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2169_chiefdone', readme.includes('smoke_v2169_chiefdone'));
ok('README 件套口径为六十五件套（六十四件套清除）', readme.includes('六十五件套（六十四件套清除）'));
ok('README 含 v21.69 守护描述（灯长通关差分对话守护）',
  readme.includes('灯长通关差分对话守护'));
ok('package.json 已收录 smoke_v2169_chiefdone（npm test 串跑第 65 份）', pkg.includes('smoke_v2169_chiefdone.mjs'));
const s2168 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2168_hardtrue.mjs'), 'utf8');
ok('smoke_v2168 的 README 件套口径断言已去硬化（存活性口径落位，旧精确表达式零残留）',
  s2168.includes("!readme.includes('（六十三件套清除）')") &&
  !s2168.includes("readme.includes('六十四件套（六十三件套清除）')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
