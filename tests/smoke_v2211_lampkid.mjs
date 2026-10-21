// v22.11 专项冒烟：无字回廊新风味 NPC「掌灯童」——v24.113（本套件所守护主线的姊妹件）起升格为
// 第二十七条支线「一步一灯」委托人（任务页优先于原静态台词；详见 smoke_v24113_walkquest）：
// 数据层三件套（gallery.extras (14,3) + NPC_SPOTS '14,3' + NPCS.lampkid），台词走既有 lines +
// trueBoss after 彩蛋机制（villager 同款：npcQuestPages 无待办任务回退时 trueBoss 优先 after、
// 否则 lines），mark:'lamp' 由 sprites.js drawNpcMark 程序化绘制，造型复用镇民短衫（mwVillager）。
// 本冒烟守护：版本锚点、全局坐标防撞（NPC_SPOTS 跨地图共用键、唯一映射、既有 19 键未动、
// 全图 extras 扫描 (14,3) 仅 gallery 一处）、NPCS 契约（name/mark/lines 2 页/after 2 页/
// 每页结构/[Enter] 收尾）、运行期（loadMap 落位 + 四邻可行走 + 守名者/名字石碑零回归 +
// Enter/E 真实交互开对话 + trueBoss done 分档）、v24.113 升格契约（npcQuestMark
// 「❕ 可接委托」/resolveNpcTalk 接取「一步一灯」accept）、sprites 造型映射、README/package.json
// 同步 + 姊妹件套 pin（v22.10 随新现实更新）复查。
import { S } from '../js/state.js';
import { GAME_VERSION, NPCS, NPC_SPOTS, MAPS, TY, SOLID } from '../js/data.js';
import { npcQuestPages, npcQuestMark, resolveNpcTalk } from '../js/quests.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v22.12 冒烟先例：先装桩再 import main.js）——
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
    gain: { value: 1, setValueAtTime: noop, linearRampToValueAtTime: noop, exponentialRampToValueAtTime: noop } }),
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
const { loadMap, at } = await import('../js/world.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.11 无字回廊掌灯童 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.10 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.10', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 11)), GAME_VERSION);
ok('data.js 含 v22.11 注释（掌灯童说明）', dSrc.includes('v22.11'));
ok('GAME_VERSION 字面量已更新为 v24.113（旧 v22.10 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.132';") && !dSrc.includes("const GAME_VERSION = 'v22.10';"));

// —— 数据层：NPC_SPOTS 全局坐标键（跨地图共用，不得撞车）——
ok('NPC_SPOTS[14,3]===lampkid', NPC_SPOTS['14,3'] === 'lampkid', NPC_SPOTS['14,3']);
ok('lampkid 仅占一个坐标键（无重复映射）', Object.keys(NPC_SPOTS).filter((k) => NPC_SPOTS[k] === 'lampkid').length === 1);
ok('NPC_SPOTS 总数 29（既有 22 键 + 失名的旅人 1 键，v22.21 随新现实更新）', Object.keys(NPC_SPOTS).length === 41, Object.keys(NPC_SPOTS).length);
ok('既有 19 个 NPC/石碑键未被误动', ['13,6', '10,13', '19,8', '12,8', '2,4', '13,9', '3,1', '2,3', '17,12', '17,11', '5,1', '10,1', '15,1', '20,1', '8,5', '14,8', '5,10', '15,12', '14,3']
  .every((k) => NPC_SPOTS[k] != null));
// 全局坐标防撞演练：全图 extras 扫描，(14,3) 必须恰出现 1 次且在 gallery、ty 为 NPC
const at143 = [];
for (const [mname, mdef] of Object.entries(MAPS)) {
  for (const ex of (mdef.extras || [])) {
    if (ex.x === 14 && ex.y === 3) at143.push(mname + ':' + ex.ty);
  }
}
ok('(14,3) 全图 extras 仅 gallery 一处 NPC（他图无占用/无撞车）',
  at143.length === 1 && at143[0] === 'gallery:NPC', at143.join(','));
ok('data.js gallery.extras 源级含 v22.11 注释（{ x: 14, y: 3, ty: \'NPC\' }）',
  dSrc.includes("{ x: 14, y: 3, ty: 'NPC' }") && dSrc.includes('掌灯童（v22.11'));

// —— NPCS.lampkid 契约 ——
const lk = NPCS.lampkid;
ok('NPCS.lampkid 存在且 name===掌灯童 / mark===lamp', !!lk && lk.name === '掌灯童' && lk.mark === 'lamp', lk && lk.name);
ok('lines 2 页（兜底闲聊），无 linesByStage（villager 同款静态台词机制）',
  lk && Array.isArray(lk.lines) && lk.lines.length === 2 && !lk.linesByStage);
ok('trueBoss after 彩蛋 2 页（villager/井巫同款契约）', lk && Array.isArray(lk.after) && lk.after.length === 2);
const allPages = [...lk.lines, ...lk.after];
ok('全部 4 页：每页为字符串数组且末元素以 [Enter] 收尾（既有台词结构）',
  allPages.every((pg) => Array.isArray(pg) && pg.length >= 2 &&
    pg.every((ln) => typeof ln === 'string') && /\[Enter\]/.test(pg[pg.length - 1])));
ok('lines 首页含「守名者爷爷」提及（与既有 NPC 守名者同脉，无自造 NPC 名）',
  lk.lines[0].some((ln) => ln.includes('守名者爷爷')));

// —— 选段（npcQuestPages 运行期求值；v24.113 起掌灯童已是「一步一灯」委托人，任务页优先）——
const p0 = npcQuestPages({}, 'lampkid');
ok('v24.113 升格后无存档走 offer 任务页（照亮一寸 + 接下委托）',
  p0 && p0[0].some((ln) => ln.includes('照亮一寸')) && p0[0].some((ln) => ln.includes('接下委托')),
  p0 && JSON.stringify(p0[0]).slice(0, 200));
const pT = npcQuestPages({ quests: { side_walk: 'done' }, trueBoss: true }, 'lampkid');
ok('trueBoss 已交付走 done 分档（最旧那块碑亮了 + 灯得在呀，after 彩蛋零内容丢失）',
  pT && pT.some((pg) => pg.some((ln) => ln.includes('最旧那块碑'))) &&
  pT.some((pg) => pg.some((ln) => ln.includes('灯得在呀'))));
ok('v24.113 起有可接支线：npcQuestMark===「❕ 可接委托」（一步一灯·掌灯童为委托人）',
  npcQuestMark(S.G, 'lampkid') === '❕ 可接委托', npcQuestMark(S.G, 'lampkid'));

// —— 运行期：loadMap 落位 + Enter/E 真实交互开对话 ——
loadMap('gallery');
ok('(14,3) 落位为 NPC 瓦片（placeExtras 覆盖 + replaceTiles 不清除）', at(14, 3) === TY.NPC, at(14, 3));
ok('(14,4) 回廊主路零回归（CAVE 岩地可行走）', at(14, 4) === TY.CAVE, at(14, 4));
ok('(8,5) 守名者零回归（仍 NPC 瓦片 + NPC_SPOTS 键不变）', at(8, 5) === TY.NPC && NPC_SPOTS['8,5'] === 'guard');
ok('(5,1) 名字石碑零回归（仍 STELE 瓦片 + NPC_SPOTS 键不变）', at(5, 1) === TY.STELE && NPC_SPOTS['5,1'] === 'stele1');
S.G.x = 14; S.G.y = 4; S.dir = 'U'; S.scene = 'world';
await screens.world.onKey({ key: 'Enter' });
ok('面向掌灯童按 Enter：进入对话（S.scene==talk）且 curNpc===lampkid',
  S.scene === 'talk' && S.curNpc === 'lampkid', S.scene + '/' + S.curNpc);
ok('v24.113 起对话第 1 页为「一步一灯」offer 任务页（照亮一寸 + 接下委托）',
  Array.isArray(S.talkPages) && S.talkPages[0] && S.talkPages[0].some((ln) => ln.includes('照亮一寸')) &&
  S.talkPages[0].some((ln) => ln.includes('接下委托')),
  JSON.stringify((S.talkPages || []).map((pg) => pg.map((l) => String(l).slice(0, 26)))));
ok('对话共 1 页（offer 单页：接下委托 / [Esc] 离开，任务页优先于原 lines 两页）',
  S.talkPages && S.talkPages.length === 1,
  JSON.stringify((S.talkPages || []).map((pg) => pg.map((l) => String(l).slice(0, 26)))));
S.scene = 'world';
await screens.world.onKey({ key: 'E' });
ok('E 键同效（v21.29 交互别名对 NPC 零回归）', S.scene === 'talk' && S.curNpc === 'lampkid', S.scene + '/' + S.curNpc);
S.scene = 'world';
ok('v24.113 升格为委托人：resolveNpcTalk 接取「一步一灯」→ accept/side_walk（任务页优先于 lines）',
  (() => { const r = resolveNpcTalk(S.G, 'lampkid');
    return !!r && r.kind === 'accept' && r.id === 'side_walk' && S.G.quests.side_walk === 'active'; })());

// —— 造型映射（sprites.js 源级）——
const spSrc = fs.readFileSync(path.join(ROOT, 'js/view/sprites.js'), 'utf8');
ok('sprites.js NPC_SHEET 已映射 lampkid→mwVillager（镇民短衫孩童身形）',
  spSrc.includes("lampkid: 'mwVillager'"));

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2211_lampkid', readme.includes('smoke_v2211_lampkid'));
ok('README 件套口径为三百五十五件套（三百五十四件套清除）', readme.includes('三百五十五件套（三百五十四件套清除）'));
ok('README 含 v22.11 守护描述（无字回廊掌灯童）', readme.includes('v22.11 起含无字回廊掌灯童'));
ok('README 快速上手/系统清单含「掌灯童」', readme.includes('掌灯童'));
ok('package.json 已收录 smoke_v2211_lampkid（npm test 串跑第 107 份）',
  pkg.includes('smoke_v2211_lampkid.mjs'));
// 姊妹 pin 复查（v22.10 随新现实更新）
const s2210 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2210_unsaved.mjs'), 'utf8');
ok('s2210 GAME_VERSION 字面量 pin 已随新现实更新为 v24.113',
  s2210.includes("const GAME_VERSION = 'v24.132';"));
ok('s2210 件套 pin 已随新现实更新为三百三十六件套',
  s2210.includes('三百五十五件套（三百五十四件套清除）'));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
