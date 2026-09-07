// v21.36 专项冒烟：潮灯镇水塘南岸新风味 NPC「掌灯阿婆」——纯内容扩充（无任务、零结算、零新逻辑）：
// 数据层三件套（village.extras (14,8) + NPC_SPOTS '14,8' + NPCS.granny），台词走既有 linesByStage 机制
// （巡灯人/雾径猎手同款：按 bossDefeated / galleryOpen 旗标选段；井巫同款 trueBoss after 彩蛋），
// 造型复用 mwSage（守名者/守碑人同款）。
// 本冒烟守护：版本锚点、全局坐标防撞（NPC_SPOTS 跨地图共用键、唯一映射、既有键未动、全图 extras 扫描）、
// NPCS 契约（name/mark/linesByStage 三段门/每页结构/[Enter] 收尾）、运行期（loadMap 落位 +
// Enter/E 真实交互开对话 + 默认段选段）、npcQuestMark 无任务顶标、sprites 造型映射、
// README/package.json 同步 + smoke_v2135 件套断言去硬化（v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION, NPCS, NPC_SPOTS, MAPS, TY } from '../js/data.js';
import { npcQuestPages, npcQuestMark } from '../js/quests.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v21.35 冒烟先例：先装桩再 import main.js）——
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
const { loadMap, at } = await import('../js/world.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.36 潮灯镇掌灯阿婆 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.35 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.35', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 36)), GAME_VERSION);
ok('data.js 含 v21.36 注释（掌灯阿婆说明）', dSrc.includes('v21.36'));

// —— 数据层：NPC_SPOTS 全局坐标键（跨地图共用，不得撞车）——
ok('NPC_SPOTS[14,8]===granny', NPC_SPOTS['14,8'] === 'granny', NPC_SPOTS['14,8']);
ok('granny 仅占一个坐标键（无重复映射）', Object.keys(NPC_SPOTS).filter((k) => NPC_SPOTS[k] === 'granny').length === 1);
ok('既有 15 个 NPC/石碑键未被误动', ['13,6', '10,13', '19,8', '12,8', '2,4', '13,9', '3,1', '2,3', '17,12', '17,11', '5,1', '10,1', '15,1', '20,1', '8,5']
  .every((k) => NPC_SPOTS[k] != null));
// 全局坐标防撞演练：全图 extras 扫描，(14,8) 必须恰出现 1 次且在 village、ty 为 NPC
const at148 = [];
for (const [mname, mdef] of Object.entries(MAPS)) {
  for (const ex of (mdef.extras || [])) {
    if (ex.x === 14 && ex.y === 8) at148.push(mname + ':' + ex.ty);
  }
}
ok('(14,8) 全图 extras 仅 village 一处 NPC（他图无占用/无撞车）',
  at148.length === 1 && at148[0] === 'village:NPC', at148.join(','));
ok('data.js village.extras 源级含 v21.36 注释（{ x: 14, y: 8, ty: \'NPC\' }）',
  dSrc.includes("{ x: 14, y: 8, ty: 'NPC' }") && dSrc.includes('掌灯阿婆（v21.36'));

// —— NPCS.granny 契约 ——
const g = NPCS.granny;
ok('NPCS.granny 存在且 name===掌灯阿婆 / mark===lamp', !!g && g.name === '掌灯阿婆' && g.mark === 'lamp', g && g.name);
ok('linesByStage 三段门顺序 null → bossDefeated → galleryOpen（巡灯人同款机制）',
  g && g.linesByStage && g.linesByStage.length === 3 &&
  g.linesByStage[0].gate === null && g.linesByStage[1].gate === 'bossDefeated' && g.linesByStage[2].gate === 'galleryOpen');
ok('trueBoss after 彩蛋 2 页（井巫/守碑人同款契约）', g && Array.isArray(g.after) && g.after.length === 2);
const allPages = [...g.linesByStage.flatMap((s) => s.lines), ...g.after];
ok('全部 8 页：每页为字符串数组且末元素以 [Enter] 收尾（既有台词结构）',
  allPages.length === 8 && allPages.every((pg) => Array.isArray(pg) && pg.length >= 2 &&
    pg.every((ln) => typeof ln === 'string') && /\[Enter\]/.test(pg[pg.length - 1])));

// —— 阶段选段（npcQuestPages 运行期求值，无任务 → 直落 NPCS 数据）——
const p0 = npcQuestPages({}, 'granny');
ok('默认段（无旗标）选段落到 stage1（灯灭那晚）', p0 && p0[0].some((ln) => ln.includes('灯灭那晚')), p0 && p0[0] && p0[0][0]);
const pB = npcQuestPages({ bossDefeated: true }, 'granny');
ok('bossDefeated 段（灯芯回来了）', pB && pB[0].some((ln) => ln.includes('灯芯回来了')));
const pG = npcQuestPages({ galleryOpen: true }, 'granny');
ok('galleryOpen 段（回廊开了 + 阿灯）',
  pG && pG.some((pg) => pg.some((ln) => ln.includes('回廊开了'))) &&
  pG.some((pg) => pg.some((ln) => ln.includes('阿灯'))));
const pT = npcQuestPages({ trueBoss: true }, 'granny');
ok('trueBoss 走 after 彩蛋（塘水倒映整座镇子的灯）', pT && pT[0].some((ln) => ln.includes('塘水')));
ok('galleryOpen 段含守卫旗标下更多剧情？——不，无任务：npcQuestMark===null（无 ❕ 顶标）',
  npcQuestMark(S.G, 'granny') === null);

// —— 运行期：loadMap 落位 + Enter/E 真实交互开对话 ——
loadMap('village');
ok('(14,8) 落位为 NPC 瓦片（placeExtras 覆盖）', at(14, 8) === TY.NPC, at(14, 8));
ok('(13,6) 灯长零回归（仍 NPC 瓦片 + NPC_SPOTS 键不变）', at(13, 6) === TY.NPC && NPC_SPOTS['13,6'] === 'chief');
ok('(14,9) 广场路可行走 / (14,7) 塘水零回归', at(14, 9) === TY.PATH && at(14, 7) === TY.WATER);
S.G.x = 14; S.G.y = 9; S.dir = 'U'; S.scene = 'world';
await screens.world.onKey({ key: 'Enter' });
ok('面向阿婆按 Enter：进入对话（S.scene==talk）且 curNpc===granny',
  S.scene === 'talk' && S.curNpc === 'granny', S.scene + '/' + S.curNpc);
ok('对话第 1 页为默认段台词（掌灯阿婆：灯灭那晚…）——S.G 无旗标',
  Array.isArray(S.talkPages) && S.talkPages[0] && S.talkPages[0].some((ln) => ln.includes('灯灭那晚')));
ok('对话共 2 页（第 1 页 [Enter] 继续 → 第 2 页 [Enter] 结束）', S.talkPages && S.talkPages.length === 2);
S.scene = 'world';
await screens.world.onKey({ key: 'E' });
ok('E 键同效（v21.29 交互别名对 NPC 零回归）', S.scene === 'talk' && S.curNpc === 'granny', S.scene + '/' + S.curNpc);

// —— 造型映射（sprites.js 源级）——
const spSrc = fs.readFileSync(path.join(ROOT, 'js/view/sprites.js'), 'utf8');
ok('sprites.js NPC_SHEET 已映射 granny→mwSage（长者袍，守名者/守碑人同款）',
  spSrc.includes("granny: 'mwSage'"));

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2136_granny', readme.includes('smoke_v2136_granny'));
ok('README 件套口径为三十二件套（三十一件套清除）',
  readme.includes('三十二件套') && readme.includes('三十一件套清除'));
ok('README 含 v21.36 守护描述（潮灯镇掌灯阿婆）',
  readme.includes('v21.36 起含潮灯镇掌灯阿婆'));
ok('README 地图/系统清单含「掌灯阿婆」', readme.includes('掌灯阿婆'));
ok('package.json 已收录 smoke_v2136_granny（npm test 串跑第 32 份）',
  pkg.includes('smoke_v2136_granny.mjs'));
const s2135 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2135_levelpace.mjs'), 'utf8');
ok('smoke_v2135 的 README 件套断言已去硬化（v21.7 惯例：改为「冒烟/件套」存在性口径，不再断言「三十一件套」）',
  s2135.includes("includes('冒烟')") && s2135.includes("includes('件套')") && !s2135.includes("includes('三十一件套')"));
ok('smoke_v2135 的 GAME_VERSION 精确锚点已去硬化（v21.7 惯例：不再以 === "v21.35" 断言，精确值由本版守护）',
  !s2135.includes("GAME_VERSION === 'v21.35'") && s2135.includes('已越过 v21.35'));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
