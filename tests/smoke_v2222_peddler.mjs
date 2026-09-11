// v22.22 专项冒烟：雾语林西入口新风味 NPC「货郎」——纯内容扩充（无任务、零结算、零新逻辑）：
// 数据层三件套（dungeon.extras (4,2) + NPC_SPOTS '4,2' + NPCS.peddler），台词走既有 lines +
// trueBoss after 彩蛋机制（villager 同款：npcQuestPages 无待办任务回退时 trueBoss 优先 after、
// 否则 lines），mark:'lamp' 复用既有程序化绘制分支（掌灯童同款灯形），造型复用 mwCartman 商贩。
// 本冒烟守护：版本锚点、全局坐标防撞（NPC_SPOTS 跨地图共用键、唯一映射、既有 23 键未动、
// 全图 extras 扫描 (4,2) 仅 dungeon 一处）、NPCS 契约（name/mark/lines 2 页/after 2 页/
// 每页结构/[Enter] 收尾/行宽预算）、运行期（loadMap 落位 + 四邻可行走 + 雾径猎手/拾菇人/失名的
// 旅人/泉水/蘑菇宝箱/祭坛零回归 + Enter/E 真实交互开对话 + 默认与 trueBoss 两档选段）、
// npcQuestMark 无任务顶标、resolveNpcTalk 零任务契约、sprites 造型映射与既有 lamp mark、
// README/package.json 同步（tests 树尾 + 件套口径 + v22.22 守护描述 + 入库 118 份）、姊妹件套
// pin（v22.21/v22.20/v22.19/v22.18 随新现实更新 + v22.21/v22.20/v22.16/v22.13/v22.11 NPC 总数
// pin 24）复查 + 旧代 v22.21 字面量/恒等/件套/树尾 pin 零残留。
import { S } from '../js/state.js';
import { GAME_VERSION, NPCS, NPC_SPOTS, MAPS, TY, SOLID } from '../js/data.js';
import { npcQuestPages, npcQuestMark } from '../js/quests.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v22.21 冒烟先例：先装桩再 import main.js）——
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

console.log('— v22.22 雾语林货郎 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.21 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.21', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 22)), GAME_VERSION);
ok('data.js 含 v22.22 注释（货郎说明）', dSrc.includes('v22.22 雾语林西入口新风味 NPC「货郎」'));
ok('GAME_VERSION 字面量已为 v22.22（旧 v22.21 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v22.22';") && !dSrc.includes("const GAME_VERSION = 'v22." + "21';"));
ok('data.js 仍保留 v22.21 历史注释（累积注释块，姊妹 pin 不失效）', dSrc.includes('v22.21 雾语林新风味 NPC「失名的旅人」'));

// —— 数据层：NPC_SPOTS 全局坐标键（跨地图共用，不得撞车）——
ok('NPC_SPOTS[4,2]===peddler', NPC_SPOTS['4,2'] === 'peddler', NPC_SPOTS['4,2']);
ok('peddler 仅占一个坐标键（无重复映射）', Object.keys(NPC_SPOTS).filter((k) => NPC_SPOTS[k] === 'peddler').length === 1);
ok('NPC_SPOTS 总数 24（既有 23 键 + 货郎 1 键，v22.22 随新现实更新）', Object.keys(NPC_SPOTS).length === 24, Object.keys(NPC_SPOTS).length);
ok('既有 23 个 NPC/石碑键未被误动', ['13,6', '10,13', '19,8', '12,8', '2,4', '13,9', '3,1', '2,3', '17,12', '17,11', '5,1', '10,1', '15,1', '20,1', '8,5', '14,8', '5,10', '15,12', '14,3', '16,9', '15,2', '13,2', '21,2']
  .every((k) => NPC_SPOTS[k] != null));
// 全局坐标防撞演练：全图 extras 扫描，(4,2) 必须恰出现 1 次且在 dungeon、ty 为 NPC
const at42 = [];
for (const [mname, mdef] of Object.entries(MAPS)) {
  for (const ex of (mdef.extras || [])) {
    if (ex.x === 4 && ex.y === 2) at42.push(mname + ':' + ex.ty);
  }
}
ok('(4,2) 全图 extras 仅 dungeon 一处 NPC（他图无占用/无撞车）',
  at42.length === 1 && at42[0] === 'dungeon:NPC', at42.join(','));
ok('data.js dungeon.extras 源级含 v22.22 注释（{ x: 4, y: 2, ty: \'NPC\' }）',
  dSrc.includes('{ x: 4, y: 2, ty: \'NPC\' }') && dSrc.includes('货郎（v22.22'));

// —— NPCS.peddler 契约 ——
const pd = NPCS.peddler;
ok('NPCS.peddler 存在且 name===货郎 / mark===lamp', !!pd && pd.name === '货郎' && pd.mark === 'lamp', pd && pd.name);
ok('lines 2 页（兜底闲聊），无 linesByStage（villager 同款静态台词机制）',
  pd && Array.isArray(pd.lines) && pd.lines.length === 2 && !pd.linesByStage);
ok('trueBoss after 彩蛋 2 页（villager/掌灯童/说书人/拾菇人/听矿人/失名的旅人同款契约）', pd && Array.isArray(pd.after) && pd.after.length === 2);
const allPdPages = [...pd.lines, ...pd.after];
ok('全部 4 页：每页为字符串数组且末元素以 [Enter] 收尾（既有台词结构）',
  allPdPages.every((pg) => Array.isArray(pg) && pg.length >= 2 &&
    pg.every((ln) => typeof ln === 'string') && /\[Enter\]/.test(pg[pg.length - 1])));
const estW = (s) => { let w = 0; for (const ch of String(s)) { const c = ch.codePointAt(0); if ((c >= 0x4e00 && c <= 0x9fff) || (c >= 0x3000 && c <= 0x303f) || (c >= 0xff00 && c <= 0xffef)) w += 15; else if (/[0-9A-Za-z]/.test(ch)) w += 7.5; else if (ch === ' ') w += 7.5; else w += 8; } return w; };
ok('全部 4 页行宽 ≤440（对话面板预算）', allPdPages.every((pg) => pg.every((ln) => estW(ln) <= 440)));
ok('lines 首页含出发前补给主题（药水 / 铺子 / 泉水）',
  pd.lines[0].some((ln) => ln.includes('药水')) && pd.lines[0].some((ln) => ln.includes('铺子')) && pd.lines[0].some((ln) => ln.includes('泉水')));
ok('lines 第 2 页含蘑菇灯油主题（蘑菇 / 灯油 / 十金）',
  pd.lines[1].some((ln) => ln.includes('蘑菇')) && pd.lines[1].some((ln) => ln.includes('灯油')) && pd.lines[1].some((ln) => ln.includes('十金')));
ok('after 首页含散雾彩蛋（雾散 / 灯油不愁对应「菌盖光还亮着」）',
  pd.after[0].some((ln) => ln.includes('雾散')) && pd.after[0].some((ln) => ln.includes('货')));
ok('after 第 2 页含灯亮主题（灯亮着 / 路）',
  pd.after[1].some((ln) => ln.includes('灯亮着')) && pd.after[1].some((ln) => ln.includes('路')));

// —— 选段（npcQuestPages 运行期求值，无任务 → 直落 NPCS 数据）——
const p0 = npcQuestPages({}, 'peddler');
ok('无旗标选段落到 lines（进林补药水）', p0 && p0[0].some((ln) => ln.includes('药水')), p0 && p0[0][0]);
const pT = npcQuestPages({ trueBoss: true }, 'peddler');
ok('trueBoss 走 after 彩蛋（雾散了 + 灯亮着）',
  pT && pT.some((pg) => pg.some((ln) => ln.includes('雾散'))) &&
  pT.some((pg) => pg.some((ln) => ln.includes('灯亮着'))));
ok('无任务：npcQuestMark===null（无 ❕ 顶标）', npcQuestMark(S.G, 'peddler') === null);
ok('无支线绑定货郎：resolveNpcTalk 不推进任何任务（纯风味零任务）',
  (await import('../js/quests.js')).resolveNpcTalk(S.G, 'peddler') === null);

// —— 运行期：loadMap 落位 + 四邻可行走 + 同图关键点零回归 + Enter/E 真实交互开对话 ——
loadMap('dungeon');
ok('(4,2) 落位为 NPC 瓦片（placeExtras 覆盖 + 不卡林口主道）', at(4, 2) === TY.NPC, at(4, 2));
ok('四邻 (3,2)/(5,2)/(4,1)/(4,3) 皆可行走（可面对面对话，不卡入口动线）',
  [[3, 2], [5, 2], [4, 1], [4, 3]].every(([x, y]) => !SOLID.has(at(x, y))));
ok('(13,9) 雾径猎手零回归 / (15,2) 拾菇人零回归 / (21,2) 失名的旅人零回归',
  at(13, 9) === TY.NPC && NPC_SPOTS['13,9'] === 'hunter' && at(15, 2) === TY.NPC && NPC_SPOTS['15,2'] === 'picker' &&
  at(21, 2) === TY.NPC && NPC_SPOTS['21,2'] === 'wanderer');
ok('(12,9) 营地泉水零回归 / (22,4)+(12,11) 蘑菇宝箱零回归 / (20,13)(20,14) 祭坛零回归 / (1,1) 出口零回归',
  at(12, 9) === TY.FOUNTAIN && at(22, 4) === TY.CHEST && at(12, 11) === TY.CHEST &&
  at(20, 13) === TY.BOSS && at(20, 14) === TY.BOSS && at(1, 1) === TY.EXIT);
S.G.x = 4; S.G.y = 3; S.dir = 'U'; S.scene = 'world';
await screens.world.onKey({ key: 'Enter' });
ok('面向货郎按 Enter：进入对话（S.scene==talk）且 curNpc===peddler',
  S.scene === 'talk' && S.curNpc === 'peddler', S.scene + '/' + S.curNpc);
ok('对话第 1 页为 lines 默认台词（药水/铺子）——S.G 无旗标',
  Array.isArray(S.talkPages) && S.talkPages[0] && S.talkPages[0].some((ln) => ln.includes('药水')));
ok('对话共 2 页（第 1 页 [Enter] 继续 → 第 2 页 [Enter] 结束）', S.talkPages && S.talkPages.length === 2);
S.scene = 'world';
await screens.world.onKey({ key: 'E' });
ok('E 键同效（v21.29 交互别名对 NPC 零回归）', S.scene === 'talk' && S.curNpc === 'peddler', S.scene + '/' + S.curNpc);

// —— 造型映射与 lamp mark（sprites.js 源级）——
const spSrc = fs.readFileSync(path.join(ROOT, 'js/view/sprites.js'), 'utf8');
ok('sprites.js NPC_SHEET 已映射 peddler→mwCartman（商贩身形）',
  spSrc.includes("peddler: 'mwCartman'"));
ok('sprites.js 既有 lamp mark 分支仍在（复用灯形，零新绘制分支）',
  spSrc.includes("mark==='lamp'"));

// —— README / package.json / 既有冒烟随新现实 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树收录 smoke_v2222_peddler 且位于串尾', readme.includes('smoke_v2221_wanderer + smoke_v2222_peddler（npm test 串跑）'));
ok('README tests 树尾链完整（v2221_wanderer 未被新尾吞并，全链连到 smoke_v2222_peddler）',
  readme.includes('smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler（npm test 串跑）'));
ok('README 件套口径为一百一十八件套（一百一十七件套清除）',
  readme.includes('冒烟一百一十八件套（一百一十七件套清除）') && !readme.includes('冒烟一百一十七件套（一百一十六件套清' + '除）'));
ok('README 含 v22.22 守护描述（雾语林西入口货郎）', readme.includes('v22.22 起含雾语林西入口货郎新 NPC 守护'));
ok('README 含 smoke_v2222_peddler 入库（118 份）', readme.includes('smoke_v2222_peddler 入库（118 份）'));
ok('README 四图速览/系统清单含「货郎」', readme.includes('货郎'));
ok('package.json 已收录 smoke_v2222_peddler（npm test 串跑第 118 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2222_peddler.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 118 件套', testChain === 118, String(testChain));
ok('CHANGELOG 含 v22.22 条目', changelog.includes('## v22.22 '));

// 姊妹 pin 复查（v22.21/v22.20/v22.19/v22.18 随新现实更新 + v22.21/v22.20/v22.16/v22.13/v22.11 NPC 总数 pin 24）
const s2221 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2221_wanderer.mjs'), 'utf8');
const s2220 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2220_hearer.mjs'), 'utf8');
const s2219 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2219_footkeys.mjs'), 'utf8');
const s2218 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2218_mush2.mjs'), 'utf8');
const s2217 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2217_elixir2.mjs'), 'utf8');
const s2216 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2216_picker.mjs'), 'utf8');
const s2215 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2215_tutorvol.mjs'), 'utf8');
const s2213 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2213_teller.mjs'), 'utf8');
const s2211 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2211_lampkid.mjs'), 'utf8');
ok('smoke_v2221 的 GAME_VERSION 字面量 pin 已更新为 v22.22', s2221.includes("const GAME_VERSION = 'v22.22';"));
ok('smoke_v2221 的 GAME_VERSION 恒等 pin 已更新为 === v22.22', s2221.includes("GAME_VERSION === 'v22.22'"));
ok('smoke_v2221 的 README 件套 pin 已随新现实更新为一百一十八件套（一百一十七件套清除）',
  s2221.includes('一百一十八件套（一百一十七件套清除）'));
ok('smoke_v2221 的 README 树尾 pin 已更新为 + smoke_v2222_peddler',
  s2221.includes('smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler（npm test 串跑）'));
ok('smoke_v2221 的 package.json 件套计数 pin 已更新为 === 118', s2221.includes('testChain === 118'));
ok('smoke_v2221 的 NPC 总数 pin 已随新现实更新为 24（货郎落位）', s2221.includes('总数 24'));
ok('smoke_v2220 的 GAME_VERSION 字面量 pin 已更新为 v22.22', s2220.includes("const GAME_VERSION = 'v22.22';"));
ok('smoke_v2220 的 GAME_VERSION 恒等 pin 已更新为 === v22.22', s2220.includes("GAME_VERSION === 'v22.22'"));
ok('smoke_v2220 的 README 件套 pin 已随新现实更新为一百一十八件套（一百一十七件套清除）',
  s2220.includes('一百一十八件套（一百一十七件套清除）'));
ok('smoke_v2220 的 README 树尾 pin 已更新为 + smoke_v2222_peddler',
  s2220.includes('smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler（npm test 串跑）'));
ok('smoke_v2220 的 package.json 件套计数 pin 已更新为 === 118', s2220.includes('testChain === 118'));
ok('smoke_v2220 的 NPC 总数 pin 已随新现实更新为 24（货郎落位）', s2220.includes('总数 24'));
ok('smoke_v2219 的 GAME_VERSION 字面量 pin 已更新为 v22.22', s2219.includes("const GAME_VERSION = 'v22.22';"));
ok('smoke_v2219 的 README 件套 pin 已随新现实更新为一百一十八件套（一百一十七件套清除）',
  s2219.includes('一百一十八件套（一百一十七件套清除）'));
ok('smoke_v2218 的 GAME_VERSION 字面量 pin 已更新为 v22.22', s2218.includes("const GAME_VERSION = 'v22.22';"));
ok('smoke_v2218 的 package.json 件套计数 pin 已更新为 === 118', s2218.includes('testChain === 118'));
ok('smoke_v2217 的 README 件套 pin 已随新现实更新为一百一十八件套（一百一十七件套清除）',
  s2217.includes('一百一十八件套（一百一十七件套清除）'));
ok('smoke_v2216 的 NPC 总数 pin 已随新现实更新为 24（货郎落位）', s2216.includes('总数 24'));
ok('smoke_v2213 的 NPC 总数 pin 已随新现实更新为 24（货郎落位）', s2213.includes('总数 24'));
ok('smoke_v2211 的 NPC 总数 pin 已随新现实更新为 24（货郎落位）', s2211.includes('总数 24'));
ok('smoke_v2215 的 package.json 串尾 pin 已更新为 + smoke_v2222_peddler',
  s2215.includes('smoke_v2221_wanderer.mjs && node tests/smoke_v2222_peddler.mjs"'));

// —— 旧代 pin 零残留：全部测试文件不得再含 v22.21 字面量/恒等/件套/树尾 pin（拆串构造避免自匹配）——
let stale = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "21';")) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v22.21 全库清零）', stale.length === 0, stale.join(','));
let staleId = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("GAME_VERSION === 'v22." + "21'")) staleId.push(f);
}
ok('旧代 GAME_VERSION 恒等 pin 零残留（===v22.21 全库清零）', staleId.length === 0, staleId.join(','));
let staleSuite = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('一百一十七件套（一百一十六件套清' + '除）')) staleSuite.push(f);
}
ok('旧代件套 pin 零残留（一百一十七件套（一百一十六件套清' + '除）全库清零）', staleSuite.length === 0, staleSuite.join(','));
let staleTail = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('smoke_v2220_hearer + smoke_v2221_wanderer（npm test 串' + '跑）')) staleTail.push(f);
}
ok('旧代树尾 pin 零残留（smoke_v2220_hearer + smoke_v2221_wanderer 串全库清零）', staleTail.length === 0, staleTail.join(','));
// 断链防回归：不得出现 v2221_wanderer 被新尾吞并的坏链（smoke_v2220_hearer 直接接 smoke_v2222_peddler）
let brokenTail = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('smoke_v2220_hearer + smoke_v2222_peddler（npm test 串' + '跑）')) brokenTail.push(f);
}
if (readme.includes('smoke_v2220_hearer + smoke_v2222_peddler（npm test 串' + '跑）')) brokenTail.push('README.md');
ok('坏链 pin 零残留（v2221_wanderer 吞并链全库清零）', brokenTail.length === 0, brokenTail.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
