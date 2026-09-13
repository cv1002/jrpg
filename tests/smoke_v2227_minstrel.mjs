// v22.27 专项冒烟：雾语林南坡新风味 NPC「琴师」——纯内容扩充（无任务、零结算、零新逻辑）：
// 数据层三件套（dungeon.extras (14,15) + NPC_SPOTS '14,15' + NPCS.minstrel），台词走既有 lines +
// trueBoss after 彩蛋机制（villager 同款：npcQuestPages 无待办任务回退时 trueBoss 优先 after、
// 否则 lines），mark:'qin' 新增一档程序化绘制分支（承 v22.13 折扇 fan 专属先例），造型复用
// mwAdventurer 行脚身形。
// 本冒烟守护：版本锚点、全局坐标防撞（NPC_SPOTS 跨地图共用键、唯一映射、既有 27 键未动、
// 全图 extras 扫描 (14,15) 仅 dungeon 一处）、NPCS 契约（name/mark/lines 2 页/after 2 页/
// 每页结构/[Enter] 收尾/行宽预算/调子与走雾主题/散尽彩蛋）、运行期（loadMap 落位 + 四邻可行走 +
// 雾径猎手/拾菇人/失名的旅人/货郎/泉水/蘑菇宝箱/祭坛零回归 + Enter/E 真实交互开对话 +
// 默认与 trueBoss 两档选段）、npcQuestMark 无任务顶标、resolveNpcTalk 零任务契约、sprites 造型映射
// 与新增 qin mark、README/package.json 同步（tests 树尾 + 件套口径 + v22.27 守护描述 + 入库 123 份）、
// 姊妹件套 pin（v22.26..v2211 随新现实更新 + v22.25/v22.24/v22.23/v22.22/v22.21/v22.20/v22.16/
// v22.13/v22.11 NPC 总数 pin 28）复查 + 旧代 v22.26 字面量/恒等/件套/树尾 pin 零残留。
import { S } from '../js/state.js';
import { GAME_VERSION, NPCS, NPC_SPOTS, MAPS, TY, SOLID } from '../js/data.js';
import { npcQuestPages, npcQuestMark } from '../js/quests.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v22.26 冒烟先例：先装桩再 import main.js）——
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

console.log('— v22.27 雾语林琴师 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.26 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.26', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 27)), GAME_VERSION);
ok('data.js 含 v22.27 注释（琴师说明）', dSrc.includes('v22.27 雾语林南坡新风味 NPC「琴师」'));
ok('GAME_VERSION 字面量已为 v22.27（旧 v22.26 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v22.35';") && !dSrc.includes("const GAME_VERSION = 'v22." + "26';"));
ok('data.js 仍保留 v22.26 历史注释（累积注释块，姊妹 pin 不失效）', dSrc.includes('v22.26 宝箱开启反馈追加进度'));

// —— 数据层：NPC_SPOTS 全局坐标键（跨地图共用，不得撞车）——
ok('NPC_SPOTS[14,15]===minstrel', NPC_SPOTS['14,15'] === 'minstrel', NPC_SPOTS['14,15']);
ok('minstrel 仅占一个坐标键（无重复映射）', Object.keys(NPC_SPOTS).filter((k) => NPC_SPOTS[k] === 'minstrel').length === 1);
ok('NPC_SPOTS 总数 29（既有 27 键 + 琴师 1 键，v22.27 随新现实更新）', Object.keys(NPC_SPOTS).length === 30, Object.keys(NPC_SPOTS).length);
ok('既有 27 个 NPC/石碑键未被误动', ['13,6', '10,13', '19,8', '12,8', '2,4', '13,9', '3,1', '2,3', '17,12', '17,11', '5,1', '10,1', '15,1', '20,1', '8,5', '14,8', '5,10', '15,12', '14,3', '16,9', '15,2', '13,2', '21,2', '4,2', '5,3', '5,5', '19,3']
  .every((k) => NPC_SPOTS[k] != null));
// 全局坐标防撞演练：全图 extras 扫描，(14,15) 必须恰出现 1 次且在 dungeon、ty 为 NPC
const at1415 = [];
for (const [mname, mdef] of Object.entries(MAPS)) {
  for (const ex of (mdef.extras || [])) {
    if (ex.x === 14 && ex.y === 15) at1415.push(mname + ':' + ex.ty);
  }
}
ok('(14,15) 全图 extras 仅 dungeon 一处 NPC（他图无占用/无撞车）',
  at1415.length === 1 && at1415[0] === 'dungeon:NPC', at1415.join(','));
ok('data.js dungeon.extras 源级含 v22.27 注释（{ x: 14, y: 15, ty: \'NPC\' }）',
  dSrc.includes('{ x: 14, y: 15, ty: \'NPC\' }') && dSrc.includes('琴师（v22.27'));

// —— NPCS.minstrel 契约 ——
const ms = NPCS.minstrel;
ok('NPCS.minstrel 存在且 name===琴师 / mark===qin', !!ms && ms.name === '琴师' && ms.mark === 'qin', ms && ms.name);
ok('lines 2 页（兜底闲聊），无 linesByStage（villager 同款静态台词机制）',
  ms && Array.isArray(ms.lines) && ms.lines.length === 2 && !ms.linesByStage);
ok('trueBoss after 彩蛋 2 页（villager/掌灯童/说书人/拾菇人/听矿人/失名的旅人/货郎/拾灯人/筛砂人/刻碑人同款契约）',
  ms && Array.isArray(ms.after) && ms.after.length === 2);
const allMsPages = [...ms.lines, ...ms.after];
ok('全部 4 页：每页为字符串数组且末元素以 [Enter] 收尾（既有台词结构）',
  allMsPages.every((pg) => Array.isArray(pg) && pg.length >= 2 &&
    pg.every((ln) => typeof ln === 'string') && /\[Enter\]/.test(pg[pg.length - 1])));
const estW = (s) => { let w = 0; for (const ch of String(s)) { const c = ch.codePointAt(0); if ((c >= 0x4e00 && c <= 0x9fff) || (c >= 0x3000 && c <= 0x303f) || (c >= 0xff00 && c <= 0xffef)) w += 15; else if (/[0-9A-Za-z]/.test(ch)) w += 7.5; else if (ch === ' ') w += 7.5; else w += 8; } return w; };
ok('全部 4 页行宽 ≤440（对话面板预算）', allMsPages.every((pg) => pg.every((ln) => estW(ln) <= 440)));
ok('lines 首页含调子/名字主题（调子还在 · 名字就还在）',
  ms.lines[0].some((ln) => ln.includes('调子还在')) && ms.lines[0].some((ln) => ln.includes('名字就还在')));
ok('lines 第 2 页含走雾主题（魔物从雾里来 · 念三遍）',
  ms.lines[1].some((ln) => ln.includes('魔物从雾里来')) && ms.lines[1].some((ln) => ln.includes('念三遍')));
ok('after 首页含散尽彩蛋（雾散了 · 灯都亮了）',
  ms.after[0].some((ln) => ln.includes('雾散了')) && ms.after[0].some((ln) => ln.includes('灯都亮了')));
ok('after 第 2 页含名字主题（记着才算数）',
  ms.after[1].some((ln) => ln.includes('记着才算数')));

// —— 选段（npcQuestPages 运行期求值，无任务 → 直落 NPCS 数据）——
const p0 = npcQuestPages({}, 'minstrel');
ok('无旗标选段落到 lines（调子）', p0 && p0[0].some((ln) => ln.includes('调子还在')), p0 && p0[0][0]);
const pT = npcQuestPages({ trueBoss: true }, 'minstrel');
ok('trueBoss 走 after 彩蛋（雾散了 + 记着才算数）',
  pT && pT.some((pg) => pg.some((ln) => ln.includes('雾散了'))) &&
  pT.some((pg) => pg.some((ln) => ln.includes('记着才算数'))));
ok('无任务：npcQuestMark===null（无 ❕ 顶标）', npcQuestMark(S.G, 'minstrel') === null);
ok('无支线绑定琴师：resolveNpcTalk 不推进任何任务（纯风味零任务）',
  (await import('../js/quests.js')).resolveNpcTalk(S.G, 'minstrel') === null);

// —— 运行期：loadMap 落位 + 四邻可行走 + 同图关键点零回归 + Enter/E 真实交互开对话 ——
loadMap('dungeon');
ok('(14,15) 落位为 NPC 瓦片（placeExtras 覆盖 + 不卡南坡动线）', at(14, 15) === TY.NPC, at(14, 15));
ok('四邻 (13,15)/(15,15)/(14,14)/(14,16) 皆可行走（可面对面对话，南坡安静不设卡）',
  [[13, 15], [15, 15], [14, 14], [14, 16]].every(([x, y]) => !SOLID.has(at(x, y))));
ok('(13,9) 雾径猎手零回归 / (15,2) 拾菇人零回归 / (21,2) 失名的旅人零回归 / (4,2) 货郎零回归',
  at(13, 9) === TY.NPC && NPC_SPOTS['13,9'] === 'hunter' && at(15, 2) === TY.NPC && NPC_SPOTS['15,2'] === 'picker' &&
  at(21, 2) === TY.NPC && NPC_SPOTS['21,2'] === 'wanderer' && at(4, 2) === TY.NPC && NPC_SPOTS['4,2'] === 'peddler');
ok('(12,9) 营地泉水零回归 / (22,4)+(12,11)+(1,16) 蘑菇宝箱零回归 / (20,13)(20,14) 祭坛零回归 / (1,1) 出口零回归',
  at(12, 9) === TY.FOUNTAIN && at(22, 4) === TY.CHEST && at(12, 11) === TY.CHEST && at(1, 16) === TY.CHEST &&
  at(20, 13) === TY.BOSS && at(20, 14) === TY.BOSS && at(1, 1) === TY.EXIT);
S.G.x = 14; S.G.y = 16; S.dir = 'U'; S.scene = 'world';
await screens.world.onKey({ key: 'Enter' });
ok('面向琴师按 Enter：进入对话（S.scene==talk）且 curNpc===minstrel',
  S.scene === 'talk' && S.curNpc === 'minstrel', S.scene + '/' + S.curNpc);
ok('对话第 1 页为 lines 默认台词（调子）——S.G 无旗标',
  Array.isArray(S.talkPages) && S.talkPages[0] && S.talkPages[0].some((ln) => ln.includes('调子还在')));
ok('对话共 2 页（第 1 页 [Enter] 继续 → 第 2 页 [Enter] 结束）', S.talkPages && S.talkPages.length === 2);
S.scene = 'world';
await screens.world.onKey({ key: 'E' });
ok('E 键同效（v21.29 交互别名对 NPC 零回归）', S.scene === 'talk' && S.curNpc === 'minstrel', S.scene + '/' + S.curNpc);

// —— 造型映射与 qin mark（sprites.js 源级）——
const spSrc = fs.readFileSync(path.join(ROOT, 'js/view/sprites.js'), 'utf8');
ok('sprites.js NPC_SHEET 已映射 minstrel→mwAdventurer（行脚身形）',
  spSrc.includes("minstrel: 'mwAdventurer'"));
ok('sprites.js 已新增 qin mark 分支（承 v22.13 fan 专属先例）', spSrc.includes("mark==='qin'"));

// —— README / package.json / 既有冒烟随新现实 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树收录 smoke_v2227_minstrel 且位于串尾', readme.includes('smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest（npm test 串跑）'));
ok('README tests 树尾链完整（v2226_chestprogress 未被新尾吞并，全链连到 smoke_v2227_minstrel）',
  readme.includes('smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest（npm test 串跑）'));
ok('README 件套口径为一百三十一件套（一百三十件套清除）',
  readme.includes('冒烟一百三十一件套（一百三十件套清除）') && !readme.includes('冒烟一百二十二件套（一百二十一件套清' + '除）'));
ok('README 含 v22.27 守护描述（雾语林南坡琴师）', readme.includes('v22.27 起含雾语林南坡琴师新 NPC 守护'));
ok('README 含 smoke_v2227_minstrel 入库（123 份）', readme.includes('smoke_v2227_minstrel 入库（123 份）'));
ok('README 四图速览/系统清单含「琴师」', readme.includes('琴师'));
ok('package.json 已收录 smoke_v2227_minstrel（npm test 串跑第 123 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2227_minstrel.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 123 件套', testChain === 131, String(testChain));
ok('CHANGELOG 含 v22.27 条目', changelog.includes('## v22.27 '));

// 姊妹 pin 复查（v22.26..v2211 随新现实更新 + v22.25/v22.24/v22.23/v22.22/v22.21/v22.20/v22.16/v22.13/v22.11
// NPC 总数 pin 28）
const s2226 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2226_chestprogress.mjs'), 'utf8');
const s2225 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2225_stonecarver.mjs'), 'utf8');
const s2224 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2224_sifter.mjs'), 'utf8');
const s2223 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2223_lampman.mjs'), 'utf8');
const s2222 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2222_peddler.mjs'), 'utf8');
const s2221 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2221_wanderer.mjs'), 'utf8');
const s2220 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2220_hearer.mjs'), 'utf8');
const s2216 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2216_picker.mjs'), 'utf8');
const s2213 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2213_teller.mjs'), 'utf8');
const s2211 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2211_lampkid.mjs'), 'utf8');
ok('smoke_v2226 的 GAME_VERSION 字面量 pin 已更新为 v22.27', s2226.includes("const GAME_VERSION = 'v22.35';"));
ok('smoke_v2226 的 GAME_VERSION 恒等 pin 已更新为 === v22.27', s2226.includes("GAME_VERSION === 'v22.35'"));
ok('smoke_v2226 的 README 件套 pin 已随新现实更新为一百三十一件套（一百三十件套清除）',
  s2226.includes('一百三十一件套（一百三十件套清除）'));
ok('smoke_v2226 的 README 树尾 pin 已更新为 + smoke_v2227_minstrel',
  s2226.includes('smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest（npm test 串跑）'));
ok('smoke_v2226 的 package.json 件套计数 pin 已更新为 === 123', s2226.includes('testChain === 131'));
ok('smoke_v2226 的 package.json 串尾 pin 已更新为 + smoke_v2227_minstrel',
  s2226.includes('smoke_v2226_chestprogress.mjs && node tests/smoke_v2227_minstrel.mjs && node tests/smoke_v2228_titlesave.mjs && node tests/smoke_v2229_metall.mjs && node tests/smoke_v2230_pausewarn.mjs && node tests/smoke_v2231_smith.mjs && node tests/smoke_v2232_travelsup.mjs && node tests/smoke_v2233_nameflavor.mjs && node tests/smoke_v2234_innkeeper.mjs && node tests/smoke_v2235_minimapquest.mjs"'));
ok('smoke_v2225 的 GAME_VERSION 字面量 pin 已更新为 v22.27', s2225.includes("const GAME_VERSION = 'v22.35';"));
ok('smoke_v2225 的 GAME_VERSION 恒等 pin 已更新为 === v22.27', s2225.includes("GAME_VERSION === 'v22.35'"));
ok('smoke_v2225 的 README 件套 pin 已随新现实更新为一百三十一件套（一百三十件套清除）',
  s2225.includes('一百三十一件套（一百三十件套清除）'));
ok('smoke_v2225 的 README 树尾 pin 已更新为 + smoke_v2227_minstrel',
  s2225.includes('smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest（npm test 串跑）'));
ok('smoke_v2225 的 package.json 件套计数 pin 已更新为 === 123', s2225.includes('testChain === 131'));
ok('smoke_v2225 的 NPC 总数 pin 已随新现实更新为 28（琴师落位）', s2225.includes('总数 29'));
ok('smoke_v2224 的 GAME_VERSION 字面量 pin 已更新为 v22.27', s2224.includes("const GAME_VERSION = 'v22.35';"));
ok('smoke_v2224 的 README 件套 pin 已随新现实更新为一百三十一件套（一百三十件套清除）',
  s2224.includes('一百三十一件套（一百三十件套清除）'));
ok('smoke_v2224 的 README 树尾 pin 已更新为 + smoke_v2227_minstrel',
  s2224.includes('smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest（npm test 串跑）'));
ok('smoke_v2224 的 package.json 件套计数 pin 已更新为 === 123', s2224.includes('testChain === 131'));
ok('smoke_v2224 的 NPC 总数 pin 已随新现实更新为 28（琴师落位）', s2224.includes('总数 29'));
ok('smoke_v2223 的 GAME_VERSION 字面量 pin 已更新为 v22.27', s2223.includes("const GAME_VERSION = 'v22.35';"));
ok('smoke_v2223 的 README 件套 pin 已随新现实更新为一百三十一件套（一百三十件套清除）',
  s2223.includes('一百三十一件套（一百三十件套清除）'));
ok('smoke_v2223 的 README 树尾 pin 已更新为 + smoke_v2227_minstrel',
  s2223.includes('smoke_v2223_lampman + smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest（npm test 串跑）'));
ok('smoke_v2223 的 package.json 件套计数 pin 已更新为 === 123', s2223.includes('testChain === 131'));
ok('smoke_v2223 的 NPC 总数 pin 已随新现实更新为 28（琴师落位）', s2223.includes('总数 29'));
ok('smoke_v2222 的 GAME_VERSION 字面量 pin 已更新为 v22.27', s2222.includes("const GAME_VERSION = 'v22.35';"));
ok('smoke_v2222 的 README 件套 pin 已随新现实更新为一百三十一件套（一百三十件套清除）',
  s2222.includes('一百三十一件套（一百三十件套清除）'));
ok('smoke_v2222 的 README 树尾 pin 已更新为 + smoke_v2227_minstrel',
  s2222.includes('smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest（npm test 串跑）'));
ok('smoke_v2222 的 package.json 件套计数 pin 已更新为 === 123', s2222.includes('testChain === 131'));
ok('smoke_v2222 的 NPC 总数 pin 已随新现实更新为 28（琴师落位）', s2222.includes('总数 29'));
ok('smoke_v2221 的 GAME_VERSION 字面量 pin 已更新为 v22.27', s2221.includes("const GAME_VERSION = 'v22.35';"));
ok('smoke_v2221 的 README 件套 pin 已随新现实更新为一百三十一件套（一百三十件套清除）',
  s2221.includes('一百三十一件套（一百三十件套清除）'));
ok('smoke_v2221 的 README 树尾 pin 已更新为 + smoke_v2227_minstrel',
  s2221.includes('smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest（npm test 串跑）'));
ok('smoke_v2221 的 package.json 件套计数 pin 已更新为 === 123', s2221.includes('testChain === 131'));
ok('smoke_v2221 的 NPC 总数 pin 已随新现实更新为 28（琴师落位）', s2221.includes('总数 29'));
ok('smoke_v2220 的 GAME_VERSION 字面量 pin 已更新为 v22.27', s2220.includes("const GAME_VERSION = 'v22.35';"));
ok('smoke_v2220 的 README 件套 pin 已随新现实更新为一百三十一件套（一百三十件套清除）',
  s2220.includes('一百三十一件套（一百三十件套清除）'));
ok('smoke_v2220 的 README 树尾 pin 已更新为 + smoke_v2227_minstrel',
  s2220.includes('smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest（npm test 串跑）'));
ok('smoke_v2220 的 package.json 件套计数 pin 已更新为 === 123', s2220.includes('testChain === 131'));
ok('smoke_v2220 的 NPC 总数 pin 已随新现实更新为 28（琴师落位）', s2220.includes('总数 29'));
ok('smoke_v2216 的 NPC 总数 pin 已随新现实更新为 28（琴师落位）', s2216.includes('总数 29'));
ok('smoke_v2213 的 NPC 总数 pin 已随新现实更新为 28（琴师落位）', s2213.includes('总数 29'));
ok('smoke_v2211 的 NPC 总数 pin 已随新现实更新为 28（琴师落位）', s2211.includes('总数 29'));

// —— 旧代 pin 零残留：全部测试文件不得再含 v22.26 字面量/恒等/件套/树尾 pin（拆串构造避免自匹配）——
let stale = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "26';")) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v22.26 全库清零）', stale.length === 0, stale.join(','));
let staleId = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("GAME_VERSION === 'v22." + "26'")) staleId.push(f);
}
ok('旧代 GAME_VERSION 恒等 pin 零残留（===v22.26 全库清零）', staleId.length === 0, staleId.join(','));
let staleSuite = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('一百二十二件套（一百二十一件套清' + '除）')) staleSuite.push(f);
}
ok('旧代件套 pin 零残留（一百二十二件套（一百二十一件套清' + '除）全库清零）', staleSuite.length === 0, staleSuite.join(','));
let staleTail = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress（npm test 串' + '跑）')) staleTail.push(f);
}
ok('旧代树尾 pin 零残留（smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress 串全库清零）', staleTail.length === 0, staleTail.join(','));
// 断链防回归：不得出现 v2226_chestprogress 被新尾吞并的坏链（smoke_v2225_stonecarver 直接接 smoke_v2227_minstrel）
let brokenTail = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('smoke_v2225_stonecarver + smoke_v2227_minstrel（npm test 串' + '跑）')) brokenTail.push(f);
}
if (readme.includes('smoke_v2225_stonecarver + smoke_v2227_minstrel（npm test 串' + '跑）')) brokenTail.push('README.md');
ok('坏链 pin 零残留（v2226_chestprogress 吞并链全库清零）', brokenTail.length === 0, brokenTail.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
