// v22.16 专项冒烟：雾语林新风味 NPC「拾菇人」——纯内容扩充（无任务、零结算、零新逻辑）：
// 数据层三件套（dungeon.extras (15,2) + NPC_SPOTS '15,2' + NPCS.picker），台词走既有 lines +
// trueBoss after 彩蛋机制（villager 同款：npcQuestPages 无待办任务回退时 trueBoss 优先 after、
// 否则 lines），mark:'basket' 复用既有程序化绘制分支（装菇竹篮），造型复用 mwVillager。
// 本冒烟守护：版本锚点、全局坐标防撞（NPC_SPOTS 跨地图共用键、唯一映射、既有 20 键未动、
// 全图 extras 扫描 (15,2) 仅 dungeon 一处）、NPCS 契约（name/mark/lines 2 页/after 2 页/
// 每页结构/[Enter] 收尾/行宽预算）、运行期（loadMap 落位 + 四邻可行走 + 雾径猎手/泉水/宝箱/
// 祭坛零回归 + Enter/E 真实交互开对话 + default 与 trueBoss 两档选段）、npcQuestMark 无任务
// 顶标、resolveNpcTalk 零任务契约、sprites 造型映射与既有 basket mark、README/package.json
// 同步（tests 树尾 + 件套口径 + v22.16 守护描述 + 入库 112 份）、姊妹件套 pin（v22.15/v22.14
// 随新现实更新 + v22.13/v22.11 NPC 总数 pin 21）复查 + 旧代 v22.15 字面量/恒等/件套/树尾 pin
// 零残留。
import { S } from '../js/state.js';
import { GAME_VERSION, NPCS, NPC_SPOTS, MAPS, TY, SOLID } from '../js/data.js';
import { npcQuestPages, npcQuestMark } from '../js/quests.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v22.13 冒烟先例：先装桩再 import main.js）——
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

console.log('— v22.16 雾语林拾菇人 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.15 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.15', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 16)), GAME_VERSION);
ok('data.js 含 v22.16 注释（拾菇人说明）', dSrc.includes('v22.16 雾语林新风味 NPC「拾菇人」'));
ok('GAME_VERSION 字面量已为 v22.16（旧 v22.15 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v22.31';") && !dSrc.includes("const GAME_VERSION = 'v22." + "15';"));
ok('data.js 仍保留 v22.15 历史注释（累积注释块，姊妹 pin 不失效）', dSrc.includes('v22.15 新手教程行补 [ / ] 音量口径'));

// —— 数据层：NPC_SPOTS 全局坐标键（跨地图共用，不得撞车）——
ok('NPC_SPOTS[15,2]===picker', NPC_SPOTS['15,2'] === 'picker', NPC_SPOTS['15,2']);
ok('picker 仅占一个坐标键（无重复映射）', Object.keys(NPC_SPOTS).filter((k) => NPC_SPOTS[k] === 'picker').length === 1);
ok('NPC_SPOTS 总数 29（既有 22 键 + 失名的旅人 1 键，v22.21 随新现实更新）', Object.keys(NPC_SPOTS).length === 29, Object.keys(NPC_SPOTS).length);
ok('既有 20 个 NPC/石碑键未被误动', ['13,6', '10,13', '19,8', '12,8', '2,4', '13,9', '3,1', '2,3', '17,12', '17,11', '5,1', '10,1', '15,1', '20,1', '8,5', '14,8', '5,10', '15,12', '14,3', '16,9']
  .every((k) => NPC_SPOTS[k] != null));
// 全局坐标防撞演练：全图 extras 扫描，(15,2) 必须恰出现 1 次且在 dungeon、ty 为 NPC
const at152 = [];
for (const [mname, mdef] of Object.entries(MAPS)) {
  for (const ex of (mdef.extras || [])) {
    if (ex.x === 15 && ex.y === 2) at152.push(mname + ':' + ex.ty);
  }
}
ok('(15,2) 全图 extras 仅 dungeon 一处 NPC（他图无占用/无撞车）',
  at152.length === 1 && at152[0] === 'dungeon:NPC', at152.join(','));
ok('data.js dungeon.extras 源级含 v22.16 注释（{ x: 15, y: 2, ty: \'NPC\' }）',
  dSrc.includes('{ x: 15, y: 2, ty: \'NPC\' }') && dSrc.includes('拾菇人（v22.16'));

// —— NPCS.picker 契约 ——
const pk = NPCS.picker;
ok('NPCS.picker 存在且 name===拾菇人 / mark===basket', !!pk && pk.name === '拾菇人' && pk.mark === 'basket', pk && pk.name);
ok('lines 2 页（兜底闲聊），无 linesByStage（villager 同款静态台词机制）',
  pk && Array.isArray(pk.lines) && pk.lines.length === 2 && !pk.linesByStage);
ok('trueBoss after 彩蛋 2 页（villager/掌灯童/说书人同款契约）', pk && Array.isArray(pk.after) && pk.after.length === 2);
const allPkPages = [...pk.lines, ...pk.after];
ok('全部 4 页：每页为字符串数组且末元素以 [Enter] 收尾（既有台词结构）',
  allPkPages.every((pg) => Array.isArray(pg) && pg.length >= 2 &&
    pg.every((ln) => typeof ln === 'string') && /\[Enter\]/.test(pg[pg.length - 1])));
const estW = (s) => { let w = 0; for (const ch of String(s)) { const c = ch.codePointAt(0); if ((c >= 0x4e00 && c <= 0x9fff) || (c >= 0x3000 && c <= 0x303f) || (c >= 0xff00 && c <= 0xffef)) w += 15; else if (/[0-9A-Za-z]/.test(ch)) w += 7.5; else if (ch === ' ') w += 7.5; else w += 8; } return w; };
ok('全部 4 页行宽 ≤440（对话面板预算）', allPkPages.every((pg) => pg.every((ln) => estW(ln) <= 440)));
ok('lines 首页含灯油主题（菌盖发光/灯油）', pk.lines[0].some((ln) => ln.includes('灯油')) && pk.lines[0].some((ln) => ln.includes('菌盖')));
ok('lines 第 2 页含蘑菇线情报（酿造 2 株→灵药 / 卖菇 10 金）',
  pk.lines[1].some((ln) => ln.includes('酿造')) && pk.lines[1].some((ln) => ln.includes('灵药')) && pk.lines[1].some((ln) => ln.includes('十金一株')));
ok('after 首页含散雾后彩蛋（雾散了 + 记得灯）',
  pk.after[0].some((ln) => ln.includes('雾散了')) && pk.after[0].some((ln) => ln.includes('记得灯')));

// —— 选段（npcQuestPages 运行期求值，无任务 → 直落 NPCS 数据）——
const p0 = npcQuestPages({}, 'picker');
ok('无旗标选段落到 lines（菌盖发光）', p0 && p0[0].some((ln) => ln.includes('菌盖')), p0 && p0[0][0]);
const pT = npcQuestPages({ trueBoss: true }, 'picker');
ok('trueBoss 走 after 彩蛋（雾散了 + 认得回家的路）',
  pT && pT.some((pg) => pg.some((ln) => ln.includes('雾散了'))) &&
  pT.some((pg) => pg.some((ln) => ln.includes('认得回家的路'))));
ok('无任务：npcQuestMark===null（无 ❕ 顶标）', npcQuestMark(S.G, 'picker') === null);
ok('无支线绑定拾菇人：resolveNpcTalk 不推进任何任务（纯风味零任务）',
  (await import('../js/quests.js')).resolveNpcTalk(S.G, 'picker') === null);

// —— 运行期：loadMap 落位 + 四邻可行走 + 同图关键点零回归 + Enter/E 真实交互开对话 ——
loadMap('dungeon');
ok('(15,2) 落位为 NPC 瓦片（placeExtras 覆盖 + replaceTiles 不清除）', at(15, 2) === TY.NPC, at(15, 2));
ok('四邻 (14,2)/(15,1)/(15,3) 皆可行走（0 草格，可面对面对话）',
  [[14, 2], [15, 1], [15, 3]].every(([x, y]) => !SOLID.has(at(x, y))));
ok('(16,2) 为蘑菇高草（G 危险草格——田边实测）', at(16, 2) === TY.GRASS, at(16, 2));
ok('(13,9) 雾径猎手零回归（仍 NPC 瓦片 + NPC_SPOTS 键不变）', at(13, 9) === TY.NPC && NPC_SPOTS['13,9'] === 'hunter');
ok('(12,9) 营地泉水零回归 / (22,4) 北环路蘑菇宝箱零回归', at(12, 9) === TY.FOUNTAIN && at(22, 4) === TY.CHEST);
ok('(20,13) 幽冥魔王祭坛零回归', at(20, 13) === TY.BOSS);
S.G.x = 15; S.G.y = 3; S.dir = 'U'; S.scene = 'world';
await screens.world.onKey({ key: 'Enter' });
ok('面向拾菇人按 Enter：进入对话（S.scene==talk）且 curNpc===picker',
  S.scene === 'talk' && S.curNpc === 'picker', S.scene + '/' + S.curNpc);
ok('对话第 1 页为 lines 默认台词（菌盖/灯油）——S.G 无旗标',
  Array.isArray(S.talkPages) && S.talkPages[0] && S.talkPages[0].some((ln) => ln.includes('菌盖')));
ok('对话共 2 页（第 1 页 [Enter] 继续 → 第 2 页 [Enter] 结束）', S.talkPages && S.talkPages.length === 2);
S.scene = 'world';
await screens.world.onKey({ key: 'E' });
ok('E 键同效（v21.29 交互别名对 NPC 零回归）', S.scene === 'talk' && S.curNpc === 'picker', S.scene + '/' + S.curNpc);

// —— 造型映射与篮 mark（sprites.js 源级）——
const spSrc = fs.readFileSync(path.join(ROOT, 'js/view/sprites.js'), 'utf8');
ok('sprites.js NPC_SHEET 已映射 picker→mwVillager（镇民短衫身形）',
  spSrc.includes("picker: 'mwVillager'"));
ok('sprites.js 既有 mark===\'basket\' 分支仍在（复用装菇竹篮，零新绘制分支）',
  spSrc.includes("mark==='basket'"));

// —— README / package.json / 既有冒烟随新现实 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2216_picker 且位于串尾', readme.includes('smoke_v2215_tutorvol + smoke_v2216_picker + smoke_v2217_elixir2 + smoke_v2218_mush2 + smoke_v2219_footkeys + smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith（npm test 串跑）'));
ok('README 件套口径为一百二十七件套（一百二十六件套清除）', readme.includes('冒烟一百二十七件套（一百二十六件套清除）') && !readme.includes('冒烟一百一十一件套（一百一十件套清' + '除）'));
ok('README 含 v22.16 守护描述（雾语林拾菇人）', readme.includes('v22.16 起含雾语林拾菇人'));
ok('README 含 smoke_v2216_picker 入库（112 份）', readme.includes('smoke_v2216_picker 入库（112 份）'));
ok('README 快速上手/系统清单含「拾菇人」', readme.includes('拾菇人'));
ok('package.json 已收录 smoke_v2216_picker（npm test 串跑第 112 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2216_picker.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 112 件套', testChain === 127, String(testChain));
// 姊妹 pin 复查（v22.15/v22.14 随新现实更新 + v22.13/v22.11 NPC 总数 pin 21）
const s2215 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2215_tutorvol.mjs'), 'utf8');
const s2214 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2214_mush.mjs'), 'utf8');
const s2213 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2213_teller.mjs'), 'utf8');
const s2212 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2212_volume.mjs'), 'utf8');
const s2211 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2211_lampkid.mjs'), 'utf8');
const s2192 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2192_travelwarn.mjs'), 'utf8');
const s2181 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2181_helpquickcast.mjs'), 'utf8');
const s2179 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2179_titlerecap.mjs'), 'utf8');
const s2176 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2176_allchests.mjs'), 'utf8');
ok('smoke_v2215 件套 pin 已随新现实更新为一百一十二件套', s2215.includes('一百二十七件套（一百二十六件套清除）'));
ok('smoke_v2215 的 README 树尾 pin 已更新为 + smoke_v2216_picker', s2215.includes('smoke_v2215_tutorvol + smoke_v2216_picker'));
ok('smoke_v2215 的 GAME_VERSION 字面量 pin 已更新为 v22.16', s2215.includes("const GAME_VERSION = 'v22.31';"));
ok('smoke_v2215 的 GAME_VERSION 恒等 pin 已更新为 === v22.16', s2215.includes("GAME_VERSION === 'v22.31'"));
ok('smoke_v2214 的 README 件套 pin 已随新现实更新为一百二十七件套（一百二十六件套清除）',
  s2214.includes('一百二十七件套（一百二十六件套清除）'));
ok('smoke_v2214 的 README 树尾 pin 已更新为 + smoke_v2216_picker', s2214.includes('smoke_v2214_mush + smoke_v2215_tutorvol + smoke_v2216_picker'));
ok('smoke_v2214 的 GAME_VERSION 字面量 pin 已更新为 v22.16', s2214.includes("const GAME_VERSION = 'v22.31';"));
ok('smoke_v2213 的 GAME_VERSION 字面量 pin 已更新为 v22.16', s2213.includes("const GAME_VERSION = 'v22.31';"));
ok('smoke_v2213 的 NPC 总数 pin 已随新现实更新为 21（拾菇人落位）', s2213.includes('总数 29'));
ok('smoke_v2212 的 GAME_VERSION 字面量 pin 已更新为 v22.16', s2212.includes("const GAME_VERSION = 'v22.31';"));
ok('smoke_v2211 的 GAME_VERSION 字面量 pin 已更新为 v22.16（防 v22.15 残留）', s2211.includes("const GAME_VERSION = 'v22.31';") && !s2211.includes("const GAME_VERSION = 'v22." + "15';"));
ok('smoke_v2211 的 NPC 总数 pin 已随新现实更新为 21（拾菇人落位）', s2211.includes('总数 29'));
ok('smoke_v2192 的 GAME_VERSION 字面量 pin 已更新为 v22.16', s2192.includes("const GAME_VERSION = 'v22.31';"));
ok('smoke_v2181 的 GAME_VERSION 字面量 pin 已更新为 v22.16', s2181.includes("const GAME_VERSION = 'v22.31';"));
ok('smoke_v2179 的 GAME_VERSION 字面量 pin 已更新为 v22.16', s2179.includes("const GAME_VERSION = 'v22.31';"));
ok('smoke_v2176 件套 pin 已更新为一百二十七件套（一百二十六件套清除）',
  s2176.includes('一百二十七件套（一百二十六件套清除）'));

// —— 旧代 pin 零残留：全部测试文件不得再含 v22.15 字面量/恒等/件套/树尾 pin（拆串构造避免自匹配）——
let stale = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "15';")) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v22.15 全库清零）', stale.length === 0, stale.join(','));
let staleId = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("GAME_VERSION === 'v22." + "15'")) staleId.push(f);
}
ok('旧代 GAME_VERSION 恒等 pin 零残留（===v22.15 全库清零）', staleId.length === 0, staleId.join(','));
let staleSuite = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('一百一十一件套（一百一十件套清' + '除）')) staleSuite.push(f);
}
ok('旧代件套 pin 零残留（一百一十一件套（一百一十件套清' + '除）全库清零）', staleSuite.length === 0, staleSuite.join(','));
let staleTail = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('smoke_v2214_mush + smoke_v2215_tutorvol（npm test 串' + '跑）')) staleTail.push(f);
}
ok('旧代树尾 pin 零残留（smoke_v2214_mush + smoke_v2215_tutorvol 串全库清零）', staleTail.length === 0, staleTail.join(','));

console.log(`\n${n - failed}/${n} 通过` + (failed ? `（失败 ${failed}）` : ''));
process.exit(failed ? 1 : 0);
