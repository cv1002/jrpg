// v22.13 专项冒烟：潮灯镇新风味 NPC「说书人」——纯内容扩充（无任务、零结算、零新逻辑）：
// 数据层三件套（village.extras (16,9) + NPC_SPOTS '16,9' + NPCS.teller），台词走既有 lines +
// trueBoss after 彩蛋机制（villager 同款：npcQuestPages 无待办任务回退时 trueBoss 优先 after、
// 否则 lines），mark:'fan' 由 sprites.js drawNpcMark 程序化绘制（折扇），造型复用 mwHunter。
// 本冒烟守护：版本锚点、全局坐标防撞（NPC_SPOTS 跨地图共用键、唯一映射、既有 19 键未动、
// 全图 extras 扫描 (16,9) 仅 village 一处）、NPCS 契约（name/mark/lines 2 页/after 2 页/
// 每页结构/[Enter] 收尾）、运行期（loadMap 落位 + 四邻可行走 + 灯长/掌灯阿婆/守书记/酿造锅/
// 商店零回归 + Enter/E 真实交互开对话 + default 与 trueBoss 两档选段）、npcQuestMark 无任务
// 顶标、resolveNpcTalk 零任务契约、sprites 造型映射与折扇 mark、README/package.json 同步 +
// 姊妹件套 pin（v22.12/v22.11 随新现实更新）复查。
import { S } from '../js/state.js';
import { GAME_VERSION, NPCS, NPC_SPOTS, MAPS, TY, SOLID } from '../js/data.js';
import { npcQuestPages, npcQuestMark } from '../js/quests.js';
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

console.log('— v22.13 潮灯镇说书人 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.12 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.12', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 13)), GAME_VERSION);
ok('data.js 含 v22.13 注释（说书人说明）', dSrc.includes('v22.13 潮灯镇说书人'));
ok('GAME_VERSION 字面量已更新为 v22.13（旧 v22.12 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v22.37';") && !dSrc.includes("const GAME_VERSION = 'v22.12';"));

// —— 数据层：NPC_SPOTS 全局坐标键（跨地图共用，不得撞车）——
ok('NPC_SPOTS[16,9]===teller', NPC_SPOTS['16,9'] === 'teller', NPC_SPOTS['16,9']);
ok('teller 仅占一个坐标键（无重复映射）', Object.keys(NPC_SPOTS).filter((k) => NPC_SPOTS[k] === 'teller').length === 1);
ok('NPC_SPOTS 总数 29（既有 22 键 + 失名的旅人 1 键，v22.21 随新现实更新）', Object.keys(NPC_SPOTS).length === 30, Object.keys(NPC_SPOTS).length);
ok('既有 19 个 NPC/石碑键未被误动', ['13,6', '10,13', '19,8', '12,8', '2,4', '13,9', '3,1', '2,3', '17,12', '17,11', '5,1', '10,1', '15,1', '20,1', '8,5', '14,8', '5,10', '15,12', '14,3']
  .every((k) => NPC_SPOTS[k] != null));
// 全局坐标防撞演练：全图 extras 扫描，(16,9) 必须恰出现 1 次且在 village、ty 为 NPC
const at169 = [];
for (const [mname, mdef] of Object.entries(MAPS)) {
  for (const ex of (mdef.extras || [])) {
    if (ex.x === 16 && ex.y === 9) at169.push(mname + ':' + ex.ty);
  }
}
ok('(16,9) 全图 extras 仅 village 一处 NPC（他图无占用/无撞车）',
  at169.length === 1 && at169[0] === 'village:NPC', at169.join(','));
ok('data.js village.extras 源级含 v22.13 注释（{ x: 16, y: 9, ty: \'NPC\' }）',
  dSrc.includes('{ x: 16, y: 9, ty: \'NPC\' }') && dSrc.includes('说书人（v22.13'));

// —— NPCS.teller 契约 ——
const tl = NPCS.teller;
ok('NPCS.teller 存在且 name===说书人 / mark===fan', !!tl && tl.name === '说书人' && tl.mark === 'fan', tl && tl.name);
ok('lines 2 页（兜底闲聊），无 linesByStage（villager 同款静态台词机制）',
  tl && Array.isArray(tl.lines) && tl.lines.length === 2 && !tl.linesByStage);
ok('trueBoss after 彩蛋 2 页（villager/掌灯童同款契约）', tl && Array.isArray(tl.after) && tl.after.length === 2);
const allTlPages = [...tl.lines, ...tl.after];
ok('全部 4 页：每页为字符串数组且末元素以 [Enter] 收尾（既有台词结构）',
  allTlPages.every((pg) => Array.isArray(pg) && pg.length >= 2 &&
    pg.every((ln) => typeof ln === 'string') && /\[Enter\]/.test(pg[pg.length - 1])));
ok('lines 首页含「《灯下潮声》」段子招牌', tl.lines[0].some((ln) => ln.includes('灯下潮声')));
ok('lines 第 2 页含世界观同脉（雾/灯 主题跨行齐备）',
  tl.lines[1].some((ln) => ln.includes('雾')) && tl.lines[1].some((ln) => ln.includes('灯')));

// —— 选段（npcQuestPages 运行期求值，无任务 → 直落 NPCS 数据）——
const p0 = npcQuestPages({}, 'teller');
ok('无旗标选段落到 lines（灯下潮声）', p0 && p0[0].some((ln) => ln.includes('灯下潮声')), p0 && p0[0][0]);
const pT = npcQuestPages({ trueBoss: true }, 'teller');
ok('trueBoss 走 after 彩蛋（醒木一收 + 等你亲自来讲）',
  pT && pT.some((pg) => pg.some((ln) => ln.includes('醒木一收'))) &&
  pT.some((pg) => pg.some((ln) => ln.includes('亲自来讲'))));
ok('无任务：npcQuestMark===null（无 ❕ 顶标）', npcQuestMark(S.G, 'teller') === null);
ok('无支线绑定说书人：resolveNpcTalk 不推进任何任务（纯风味零任务）',
  (await import('../js/quests.js')).resolveNpcTalk(S.G, 'teller') === null);

// —— 运行期：loadMap 落位 + 四邻可行走 + 同图关键点零回归 + Enter/E 真实交互开对话 ——
loadMap('village');
ok('(16,9) 落位为 NPC 瓦片（placeExtras 覆盖 + replaceTiles 不清除）', at(16, 9) === TY.NPC, at(16, 9));
ok('四邻 (15,9)/(17,9)/(16,8)/(16,10) 皆可行走（广场可四面对话）',
  [[15, 9], [17, 9], [16, 8], [16, 10]].every(([x, y]) => !SOLID.has(at(x, y))));
ok('(13,6) 灯长零回归（仍 NPC 瓦片 + NPC_SPOTS 键不变）', at(13, 6) === TY.NPC && NPC_SPOTS['13,6'] === 'chief');
ok('(14,8) 掌灯阿婆零回归（仍 NPC 瓦片 + NPC_SPOTS 键不变）', at(14, 8) === TY.NPC && NPC_SPOTS['14,8'] === 'granny');
ok('(12,8) 守书记零回归（仍 NPC 瓦片 + NPC_SPOTS 键不变）', at(12, 8) === TY.NPC && NPC_SPOTS['12,8'] === 'clerk');
ok('(10,12) 酿造锅零回归 / (8,9) 商店零回归', at(10, 12) === TY.BREW && at(8, 9) === TY.SHOP);
S.G.x = 16; S.G.y = 10; S.dir = 'U'; S.scene = 'world';
await screens.world.onKey({ key: 'Enter' });
ok('面向说书人按 Enter：进入对话（S.scene==talk）且 curNpc===teller',
  S.scene === 'talk' && S.curNpc === 'teller', S.scene + '/' + S.curNpc);
ok('对话第 1 页为 lines 默认台词（灯下潮声）——S.G 无旗标',
  Array.isArray(S.talkPages) && S.talkPages[0] && S.talkPages[0].some((ln) => ln.includes('灯下潮声')));
ok('对话共 2 页（第 1 页 [Enter] 继续 → 第 2 页 [Enter] 结束）', S.talkPages && S.talkPages.length === 2);
S.scene = 'world';
await screens.world.onKey({ key: 'E' });
ok('E 键同效（v21.29 交互别名对 NPC 零回归）', S.scene === 'talk' && S.curNpc === 'teller', S.scene + '/' + S.curNpc);

// —— 造型映射与折扇 mark（sprites.js 源级）——
const spSrc = fs.readFileSync(path.join(ROOT, 'js/view/sprites.js'), 'utf8');
ok('sprites.js NPC_SHEET 已映射 teller→mwHunter（旅人斗篷身形）',
  spSrc.includes("teller: 'mwHunter'"));
ok('sprites.js drawNpcMark 含折扇 mark===\'fan\' 分支（纯显示）',
  spSrc.includes("mark==='fan'"));

// —— README / package.json / 既有冒烟随新现实 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2213_teller 且位于串尾', readme.includes('smoke_v2212_volume + smoke_v2213_teller + smoke_v2214_mush + smoke_v2215_tutorvol + smoke_v2216_picker + smoke_v2217_elixir2 + smoke_v2218_mush2 + smoke_v2219_footkeys + smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend（npm test 串跑）'));
ok('README 件套口径为一百三十三件套（一百三十二件套清除）', readme.includes('一百三十三件套（一百三十二件套清除）'));
ok('README 含 v22.13 守护描述（潮灯镇说书人）', readme.includes('v22.13 起含潮灯镇说书人'));
ok('README 快速上手/系统清单含「说书人」', readme.includes('说书人'));
ok('package.json 已收录 smoke_v2213_teller（npm test 串跑第 109 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2213_teller.mjs'));
// 姊妹 pin 复查（v22.12/v22.11 随新现实更新）
const s2212 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2212_volume.mjs'), 'utf8');
const s2211 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2211_lampkid.mjs'), 'utf8');
ok('s2212 GAME_VERSION 字面量 pin 已随新现实更新为 v22.13',
  s2212.includes("const GAME_VERSION = 'v22.37';") && !s2212.includes("=== 'v22.12'"));
ok('s2212 件套 pin 已随新现实更新为一百一十二件套', s2212.includes('一百三十三件套（一百三十二件套清除）'));
ok('s2211 件套 pin 已随新现实更新为一百一十二件套', s2211.includes('一百三十三件套（一百三十二件套清除）'));
ok('s2211 NPC 总数 pin 已随新现实更新为 22（听矿人落位）', s2211.includes('总数 29'));

console.log(`\n${n - failed}/${n} 通过` + (failed ? `（失败 ${failed}）` : ''));
process.exit(failed ? 1 : 0);
