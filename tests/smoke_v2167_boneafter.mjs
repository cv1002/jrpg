// v21.67 专项冒烟：拾骨人通关后差分对话（内容补全·承 v20.8 side_ember done 页 trueBoss 分档先例）。
// 背景：讨伐采集型支线里只有 side_ember 的 done 页按 hero.trueBoss 分档（通关后点破
// 「初灯的名字也回来了」）；拾骨人此前是全游戏唯一「通关后仍只有静态完成页」的任务 NPC
// （守名者有分档、老矿工/守碑人/掌灯阿婆等非任务 NPC 有 after 彩蛋、灯长/猎手/守书记等
// 任务 NPC 的静态 done 页讲各自支线余韵），而「亡骨名字回灯下」的主题与终焉之神被打败
// （名字归还）天然同脉——通关后再访，拾骨人亲口点破「矿道里像有人挨个点名」。
// 未通关档保持 v21.52 原页逐字不变；talkPagesOf 对函数型 done 页调用期求值（与
// side_stone/side_bone 的函数型 active 页同机制），零判定/零奖励/零存档变化。
// 本冒烟守护：版本锚点、data.js 源级落位（v21.67 注释 + done 函数页两档文案落位 +
// v21.52 原页默认档逐字保留 + 完成标记/[Enter] 收尾两档齐备）、side_ember 先例零回归、
// 其余任务页零回归、运行期实证八档（未通关 done 档原页逐字 / 通关 done 档新页逐字 /
// active 函数页进度零回归 / offer·turnin 静态页零回归 / done 优先级压过兜底 lines /
// 通关后 resolveNpcTalk 不重发奖 / npcQuestMark done 归零 / drawTalk 真实渲染两档不抛错）、
// 对话行宽预算（estW ≤440）、README/package.json 同步 + smoke_v2166 件套断言去硬化（v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION, QUESTS, NPCS } from '../js/data.js';
import { npcQuestPages, npcQuestMark, questStatus, resolveNpcTalk } from '../js/quests.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v21.66 冒烟先例：先装桩再 import main.js）——
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

console.log('— v21.67 拾骨人通关后差分对话 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.66）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.66', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 67)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.67 注释（拾骨人通关后差分对话说明）',
  dSrc.includes('v21.67 内容补全：拾骨人通关后差分对话'));

// —— data.js 源级落位：side_bone done 由静态数组升级为 trueBoss 分档函数页 ——
const qb = QUESTS.side_bone;
ok('side_bone done 页为函数（trueBoss 分档，承 v20.8 side_ember 先例）',
  !!qb && qb.talk && typeof qb.talk.done === 'function');
const doneDefault = qb.talk.done({});
const doneTrue = qb.talk.done({ trueBoss: true });
// 任务页结构 = 页数组（每页 = 行数组）；side_bone done 两档均单页
const OLD_PAGE = [[
  '拾骨人：矿道安静了些。站着挨饿的兄弟少了，',
  '灯镇的方向，又亮了一点。',
  '（支线任务·已完成）',
  '[Enter] 结束',
]];
const NEW_PAGE = [[
  '拾骨人：初灯的名字都回来了……昨夜矿道里，',
  '像有人挨个点名。点到名的兄弟，都歇下了。',
  '（支线任务·已完成）',
  '[Enter] 结束',
]];
ok('未通关档与 v21.52 原页逐字一致（零回归）',
  JSON.stringify(doneDefault) === JSON.stringify(OLD_PAGE), JSON.stringify(doneDefault));
ok('通关档为新页（初灯的名字回来了/挨个点名）且保留完成标记与 [Enter] 收尾',
  JSON.stringify(doneTrue) === JSON.stringify(NEW_PAGE), JSON.stringify(doneTrue));
ok('两档页组结构合法（页数组 + 每页行数组 + [Enter] 收尾）',
  [doneDefault, doneTrue].every((pages) => Array.isArray(pages) &&
    pages.every((pg) => Array.isArray(pg) && /\[Enter\]/.test(pg[pg.length - 1]))));
ok('通关档行宽预算内（对话面板 MAX_W=440，15px 估算）',
  NEW_PAGE[0].every((ln) => estW(ln) <= 440), NEW_PAGE[0].map((ln) => estW(ln)).join('/'));
ok('防御式求值：hero 为 null/无 trueBoss 字段均落未通关档（不抛错）',
  JSON.stringify(qb.talk.done(null)) === JSON.stringify(OLD_PAGE) &&
  JSON.stringify(qb.talk.done({})) === JSON.stringify(OLD_PAGE));

// —— side_ember 先例与其余讨伐支线零回归 ——
ok('side_ember done 仍为 trueBoss 分档函数页（v20.8 先例零回归）',
  typeof QUESTS.side_ember.talk.done === 'function');
ok('side_mist / side_stone done 页保持静态数组（本版只动 side_bone 一处）',
  Array.isArray(QUESTS.side_mist.talk.done) && Array.isArray(QUESTS.side_stone.talk.done));
ok('side_bone offer/turnin 静态页与 active 函数页零回归',
  Array.isArray(qb.talk.offer) && Array.isArray(qb.talk.turnin) && typeof qb.talk.active === 'function');
ok('NPCS.digger 仍无 after（done 函数页是通关差分唯一通道，任务页恒优先于静态 lines）',
  !!NPCS.digger && !('after' in NPCS.digger) && Array.isArray(NPCS.digger.lines));

// —— 运行期实证：npcQuestPages 全链路 ——
const hDone = { quests: { side_bone: 'done' }, bestiary: { '骷髅兵': 3 } };
ok('运行期：done 未通关档 npcQuestPages 落原页（逐字）',
  JSON.stringify(npcQuestPages(hDone, 'digger')) === JSON.stringify(OLD_PAGE));
const hDoneTrue = { quests: { side_bone: 'done' }, bestiary: { '骷髅兵': 3 }, trueBoss: true };
ok('运行期：done 通关档 npcQuestPages 落新页（逐字）',
  JSON.stringify(npcQuestPages(hDoneTrue, 'digger')) === JSON.stringify(NEW_PAGE));
const hActive = { quests: { side_bone: 'active' }, bestiary: { '骷髅兵': 1 }, trueBoss: true };
ok('运行期：active 函数页按 hero 实时报进度零回归（已安顿 1/3 只，通关标志不串档）',
  npcQuestPages(hActive, 'digger')[0].some((ln) => ln.includes('1/3 只')));
ok('运行期：offer/turnin 档不受分档影响（新档 offer 页含「没能走出矿洞」；3 只达标档落 turnin 页）',
  npcQuestPages({ bestiary: {} }, 'digger')[0].some((ln) => ln.includes('没能走出矿洞')) &&
  npcQuestPages({ quests: { side_bone: 'active' }, bestiary: { '骷髅兵': 3 }, trueBoss: true }, 'digger')[0]
    .some((ln) => ln.includes('[Enter] 领取谢礼')));
ok('运行期：done 状态机零回归（questStatus===done、npcQuestMark 归零、resolveNpcTalk 不重发奖）',
  questStatus(hDoneTrue, 'side_bone') === 'done' && npcQuestMark(hDoneTrue, 'digger') === null &&
  resolveNpcTalk(hDoneTrue, 'digger') === null);

// —— 运行期实证：drawTalk 两档真实渲染不抛错 ——
function renderTalk(hero) {
  S.G = hero; S.curNpc = 'digger'; S.scene = 'talk';
  S.talkPages = npcQuestPages(hero, 'digger'); S.talkPage = 0; S.talkLineAt = 0; S.talkStartAt = 0;
  let threw = null;
  try { menus.drawTalk(); } catch (e) { threw = e; }
  S.scene = 'title';
  return threw;
}
ok('运行期：drawTalk 渲染未通关档不抛错', renderTalk(hDone) === null);
ok('运行期：drawTalk 渲染通关档不抛错', renderTalk(hDoneTrue) === null);

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2167_boneafter', readme.includes('smoke_v2167_boneafter'));
// v21.68 去硬化（v21.7 惯例）：件套精确计数移交当版冒烟守护，本件改存活性口径——
// 仍含「冒烟/件套」且旧口径「（六十二件套清除）」已清除。
ok('README 件套口径为存活性断言（v21.68 起件数由新版冒烟守护：六十四件套（六十三件套清除））',
  readme.includes('冒烟') && readme.includes('件套') &&
  !readme.includes('（六十二件套清除）'));
ok('README 含 v21.67 守护描述（拾骨人通关后差分对话守护）',
  readme.includes('拾骨人通关后差分对话守护'));
ok('package.json 已收录 smoke_v2167_boneafter（npm test 串跑第 63 份）', pkg.includes('smoke_v2167_boneafter.mjs'));
const s2166 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2166_innheal.mjs'), 'utf8');
ok('smoke_v2166 的 README 件套口径断言已去硬化（存活性口径落位，旧精确表达式零残留）',
  s2166.includes("!readme.includes('（六十一件套清除）')") &&
  !s2166.includes("readme.includes('六十二件套（六十一件套清除）')"));
const s2152 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2152_bonequest.mjs'), 'utf8');
ok('smoke_v2152 的 done 页断言已随 v21.67 新现实更新（函数页两档求值落位，旧 Array.isArray(done) pin 零残留）',
  s2152.includes("typeof qb.talk.done === 'function'") &&
  !s2152.includes("['offer', 'turnin', 'done'].every((k) => Array.isArray(qb.talk[k])"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
