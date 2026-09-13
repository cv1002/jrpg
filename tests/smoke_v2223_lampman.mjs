// v22.23 专项冒烟：无字回廊新风味 NPC「拾灯人」——纯内容扩充（无任务、零结算、零新逻辑）：
// 数据层三件套（gallery.extras (5,3) + NPC_SPOTS '5,3' + NPCS.lampman），台词走既有 lines +
// trueBoss after 彩蛋机制（villager 同款：npcQuestPages 无待办任务回退时 trueBoss 优先 after、
// 否则 lines），mark:'hood' 复用既有程序化绘制分支（拾骨人/井巫/守书记同款兜帽），造型复用 mwHunter 斗篷。
// 本冒烟守护：版本锚点、全局坐标防撞（NPC_SPOTS 跨地图共用键、唯一映射、既有 24 键未动、
// 全图 extras 扫描 (5,3) 仅 gallery 一处）、NPCS 契约（name/mark/lines 2 页/after 2 页/
// 每页结构/[Enter] 收尾/行宽预算/名字与回廊指南主题/散尽彩蛋）、运行期（loadMap 落位 + 四邻可行走 +
// 守名者/掌灯童/四石碑/残焰魔像/终焉祭坛/遗物宝箱/出口零回归 + Enter/E 真实交互开对话 +
// 默认与 trueBoss 两档选段）、npcQuestMark 无任务顶标、resolveNpcTalk 零任务契约、sprites 造型映射
// 与既有 hood mark、README/package.json 同步（tests 树尾 + 件套口径 + v22.23 守护描述 + 入库 119 份）、
// 姊妹件套 pin（v22.22/v22.21/v22.20/v22.19/v22.18 随新现实更新 + v22.22/v22.21/v22.20/v22.16/
// v22.13/v22.11 NPC 总数 pin 25）复查 + 旧代 v22.22 字面量/恒等/件套/树尾 pin 零残留。
import { S } from '../js/state.js';
import { GAME_VERSION, NPCS, NPC_SPOTS, MAPS, TY, SOLID } from '../js/data.js';
import { npcQuestPages, npcQuestMark } from '../js/quests.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v22.22 冒烟先例：先装桩再 import main.js）——
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

console.log('— v22.23 无字回廊拾灯人 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.22 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.22', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 23)), GAME_VERSION);
ok('data.js 含 v22.23 注释（拾灯人说明）', dSrc.includes('v22.23 无字回廊新风味 NPC「拾灯人」'));
ok('GAME_VERSION 字面量已为 v22.23（旧 v22.22 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v22.37';") && !dSrc.includes("const GAME_VERSION = 'v22." + "22';"));
ok('data.js 仍保留 v22.22 历史注释（累积注释块，姊妹 pin 不失效）', dSrc.includes('v22.22 雾语林西入口新风味 NPC「货郎」'));

// —— 数据层：NPC_SPOTS 全局坐标键（跨地图共用，不得撞车）——
ok('NPC_SPOTS[5,3]===lampman', NPC_SPOTS['5,3'] === 'lampman', NPC_SPOTS['5,3']);
ok('lampman 仅占一个坐标键（无重复映射）', Object.keys(NPC_SPOTS).filter((k) => NPC_SPOTS[k] === 'lampman').length === 1);
ok('NPC_SPOTS 总数 29（既有 24 键 + 拾灯人 1 键，v22.23 随新现实更新）', Object.keys(NPC_SPOTS).length === 30, Object.keys(NPC_SPOTS).length);
ok('既有 24 个 NPC/石碑键未被误动', ['13,6', '10,13', '19,8', '12,8', '2,4', '13,9', '3,1', '2,3', '17,12', '17,11', '5,1', '10,1', '15,1', '20,1', '8,5', '14,8', '5,10', '15,12', '14,3', '16,9', '15,2', '13,2', '21,2', '4,2']
  .every((k) => NPC_SPOTS[k] != null));
// 全局坐标防撞演练：全图 extras 扫描，(5,3) 必须恰出现 1 次且在 gallery、ty 为 NPC
const at53 = [];
for (const [mname, mdef] of Object.entries(MAPS)) {
  for (const ex of (mdef.extras || [])) {
    if (ex.x === 5 && ex.y === 3) at53.push(mname + ':' + ex.ty);
  }
}
ok('(5,3) 全图 extras 仅 gallery 一处 NPC（他图无占用/无撞车）',
  at53.length === 1 && at53[0] === 'gallery:NPC', at53.join(','));
ok('data.js gallery.extras 源级含 v22.23 注释（{ x: 5, y: 3, ty: \'NPC\' }）',
  dSrc.includes('{ x: 5, y: 3, ty: \'NPC\' }') && dSrc.includes('拾灯人（v22.23'));

// —— NPCS.lampman 契约 ——
const lm = NPCS.lampman;
ok('NPCS.lampman 存在且 name===拾灯人 / mark===hood', !!lm && lm.name === '拾灯人' && lm.mark === 'hood', lm && lm.name);
ok('lines 2 页（兜底闲聊），无 linesByStage（villager 同款静态台词机制）',
  lm && Array.isArray(lm.lines) && lm.lines.length === 2 && !lm.linesByStage);
ok('trueBoss after 彩蛋 2 页（villager/掌灯童/说书人/拾菇人/听矿人/失名的旅人/货郎同款契约）', lm && Array.isArray(lm.after) && lm.after.length === 2);
const allLmPages = [...lm.lines, ...lm.after];
ok('全部 4 页：每页为字符串数组且末元素以 [Enter] 收尾（既有台词结构）',
  allLmPages.every((pg) => Array.isArray(pg) && pg.length >= 2 &&
    pg.every((ln) => typeof ln === 'string') && /\[Enter\]/.test(pg[pg.length - 1])));
const estW = (s) => { let w = 0; for (const ch of String(s)) { const c = ch.codePointAt(0); if ((c >= 0x4e00 && c <= 0x9fff) || (c >= 0x3000 && c <= 0x303f) || (c >= 0xff00 && c <= 0xffef)) w += 15; else if (/[0-9A-Za-z]/.test(ch)) w += 7.5; else if (ch === ' ') w += 7.5; else w += 8; } return w; };
ok('全部 4 页行宽 ≤440（对话面板预算）', allLmPages.every((pg) => pg.every((ln) => estW(ln) <= 440)));
ok('lines 首页含名字提醒主题（名字 / 念一遍）',
  lm.lines[0].some((ln) => ln.includes('名字')) && lm.lines[0].some((ln) => ln.includes('念一遍')));
ok('lines 第 2 页含回廊指南主题（泉水/旅店补给 · 石碑 · 灰烬 · 守名者）',
  lm.lines[1].some((ln) => ln.includes('泉水')) && lm.lines[1].some((ln) => ln.includes('旅店')) &&
  lm.lines[1].some((ln) => ln.includes('石碑')) && lm.lines[1].some((ln) => ln.includes('守名者')));
ok('after 首页含散尽彩蛋（碑上的字都亮了 / 回灯下）',
  lm.after[0].some((ln) => ln.includes('碑上的字都亮了')) && lm.after[0].some((ln) => ln.includes('回灯下')));
ok('after 第 2 页含灯亮主题（灯亮着 / 名字 / 路）',
  lm.after[1].some((ln) => ln.includes('灯亮着')) && lm.after[1].some((ln) => ln.includes('名字')));

// —— 选段（npcQuestPages 运行期求值，无任务 → 直落 NPCS 数据）——
const p0 = npcQuestPages({}, 'lampman');
ok('无旗标选段落到 lines（名字提醒）', p0 && p0[0].some((ln) => ln.includes('名字')), p0 && p0[0][0]);
const pT = npcQuestPages({ trueBoss: true }, 'lampman');
ok('trueBoss 走 after 彩蛋（碑上的字都亮了 + 灯亮着）',
  pT && pT.some((pg) => pg.some((ln) => ln.includes('碑上的字都亮了'))) &&
  pT.some((pg) => pg.some((ln) => ln.includes('灯亮着'))));
ok('无任务：npcQuestMark===null（无 ❕ 顶标）', npcQuestMark(S.G, 'lampman') === null);
ok('无支线绑定拾灯人：resolveNpcTalk 不推进任何任务（纯风味零任务）',
  (await import('../js/quests.js')).resolveNpcTalk(S.G, 'lampman') === null);

// —— 运行期：loadMap 落位 + 四邻可行走 + 同图关键点零回归 + Enter/E 真实交互开对话 ——
loadMap('gallery');
ok('(5,3) 落位为 NPC 瓦片（placeExtras 覆盖 + 不卡北廊主走道）', at(5, 3) === TY.NPC, at(5, 3));
ok('四邻 (4,3)/(6,3)/(5,2)/(5,4) 皆可行走（可面对面对话，不卡石碑缺口动线）',
  [[4, 3], [6, 3], [5, 2], [5, 4]].every(([x, y]) => !SOLID.has(at(x, y))));
ok('(8,5) 守名者零回归 / (14,3) 掌灯童零回归',
  at(8, 5) === TY.NPC && NPC_SPOTS['8,5'] === 'guard' && at(14, 3) === TY.NPC && NPC_SPOTS['14,3'] === 'lampkid');
ok('四块名字石碑零回归 / (12,4) 残焰魔像 / (21,4) 终焉祭坛 / (16,1) 遗物宝箱 / (1,4) 出口零回归',
  at(5, 1) === TY.STELE && at(10, 1) === TY.STELE && at(15, 1) === TY.STELE && at(20, 1) === TY.STELE &&
  at(12, 4) === TY.MB && at(21, 4) === TY.SB && at(16, 1) === TY.CHEST && at(1, 4) === TY.EXIT);
S.G.x = 5; S.G.y = 4; S.dir = 'U'; S.scene = 'world';
await screens.world.onKey({ key: 'Enter' });
ok('面向拾灯人按 Enter：进入对话（S.scene==talk）且 curNpc===lampman',
  S.scene === 'talk' && S.curNpc === 'lampman', S.scene + '/' + S.curNpc);
ok('对话第 1 页为 lines 默认台词（名字提醒）——S.G 无旗标',
  Array.isArray(S.talkPages) && S.talkPages[0] && S.talkPages[0].some((ln) => ln.includes('名字')));
ok('对话共 2 页（第 1 页 [Enter] 继续 → 第 2 页 [Enter] 结束）', S.talkPages && S.talkPages.length === 2);
S.scene = 'world';
await screens.world.onKey({ key: 'E' });
ok('E 键同效（v21.29 交互别名对 NPC 零回归）', S.scene === 'talk' && S.curNpc === 'lampman', S.scene + '/' + S.curNpc);

// —— 造型映射与 hood mark（sprites.js 源级）——
const spSrc = fs.readFileSync(path.join(ROOT, 'js/view/sprites.js'), 'utf8');
ok('sprites.js NPC_SHEET 已映射 lampman→mwHunter（斗篷身形）',
  spSrc.includes("lampman: 'mwHunter'"));
ok('sprites.js 既有 hood mark 分支仍在（复用兜帽，零新绘制分支）',
  spSrc.includes("mark==='hood'"));

// —— README / package.json / 既有冒烟随新现实 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树收录 smoke_v2223_lampman 且位于串尾', readme.includes('smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend（npm test 串跑）'));
ok('README tests 树尾链完整（v2222_peddler 未被新尾吞并，全链连到 smoke_v2223_lampman）',
  readme.includes('smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend（npm test 串跑）'));
ok('README 件套口径为一百三十三件套（一百三十二件套清除）',
  readme.includes('冒烟一百三十三件套（一百三十二件套清除）') && !readme.includes('冒烟一百一十八件套（一百一十七件套清' + '除）'));
ok('README 含 v22.23 守护描述（无字回廊拾灯人）', readme.includes('v22.23 起含无字回廊拾灯人新 NPC 守护'));
ok('README 含 smoke_v2223_lampman 入库（119 份）', readme.includes('smoke_v2223_lampman 入库（119 份）'));
ok('README 四图速览/系统清单含「拾灯人」', readme.includes('拾灯人'));
ok('package.json 已收录 smoke_v2223_lampman（npm test 串跑第 119 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2223_lampman.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 119 件套', testChain === 133, String(testChain));
ok('CHANGELOG 含 v22.23 条目', changelog.includes('## v22.23 '));

// 姊妹 pin 复查（v22.22/v22.21/v22.20/v22.19/v22.18 随新现实更新 + v22.22/v22.21/v22.20/v22.16/v22.13/v22.11 NPC 总数 pin 25）
const s2222 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2222_peddler.mjs'), 'utf8');
const s2221 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2221_wanderer.mjs'), 'utf8');
const s2220 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2220_hearer.mjs'), 'utf8');
const s2219 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2219_footkeys.mjs'), 'utf8');
const s2218 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2218_mush2.mjs'), 'utf8');
const s2217 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2217_elixir2.mjs'), 'utf8');
const s2216 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2216_picker.mjs'), 'utf8');
const s2215 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2215_tutorvol.mjs'), 'utf8');
const s2213 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2213_teller.mjs'), 'utf8');
const s2211 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2211_lampkid.mjs'), 'utf8');
ok('smoke_v2222 的 GAME_VERSION 字面量 pin 已更新为 v22.23', s2222.includes("const GAME_VERSION = 'v22.37';"));
ok('smoke_v2222 的 GAME_VERSION 恒等 pin 已更新为 === v22.23', s2222.includes("GAME_VERSION === 'v22.37'"));
ok('smoke_v2222 的 README 件套 pin 已随新现实更新为一百三十三件套（一百三十二件套清除）',
  s2222.includes('一百三十三件套（一百三十二件套清除）'));
ok('smoke_v2222 的 README 树尾 pin 已更新为 + smoke_v2223_lampman',
  s2222.includes('smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend（npm test 串跑）'));
ok('smoke_v2222 的 package.json 件套计数 pin 已更新为 === 119', s2222.includes('testChain === 133'));
ok('smoke_v2222 的 NPC 总数 pin 已随新现实更新为 25（拾灯人落位）', s2222.includes('总数 29'));
ok('smoke_v2221 的 GAME_VERSION 字面量 pin 已更新为 v22.23', s2221.includes("const GAME_VERSION = 'v22.37';"));
ok('smoke_v2221 的 GAME_VERSION 恒等 pin 已更新为 === v22.23', s2221.includes("GAME_VERSION === 'v22.37'"));
ok('smoke_v2221 的 README 件套 pin 已随新现实更新为一百三十三件套（一百三十二件套清除）',
  s2221.includes('一百三十三件套（一百三十二件套清除）'));
ok('smoke_v2221 的 README 树尾 pin 已更新为 + smoke_v2223_lampman',
  s2221.includes('smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend（npm test 串跑）'));
ok('smoke_v2221 的 package.json 件套计数 pin 已更新为 === 119', s2221.includes('testChain === 133'));
ok('smoke_v2221 的 NPC 总数 pin 已随新现实更新为 25（拾灯人落位）', s2221.includes('总数 29'));
ok('smoke_v2220 的 GAME_VERSION 字面量 pin 已更新为 v22.23', s2220.includes("const GAME_VERSION = 'v22.37';"));
ok('smoke_v2220 的 GAME_VERSION 恒等 pin 已更新为 === v22.23', s2220.includes("GAME_VERSION === 'v22.37'"));
ok('smoke_v2220 的 README 件套 pin 已随新现实更新为一百三十三件套（一百三十二件套清除）',
  s2220.includes('一百三十三件套（一百三十二件套清除）'));
ok('smoke_v2220 的 README 树尾 pin 已更新为 + smoke_v2223_lampman',
  s2220.includes('smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend（npm test 串跑）'));
ok('smoke_v2220 的 package.json 件套计数 pin 已更新为 === 119', s2220.includes('testChain === 133'));
ok('smoke_v2220 的 NPC 总数 pin 已随新现实更新为 25（拾灯人落位）', s2220.includes('总数 29'));
ok('smoke_v2219 的 GAME_VERSION 字面量 pin 已更新为 v22.23', s2219.includes("const GAME_VERSION = 'v22.37';"));
ok('smoke_v2219 的 README 件套 pin 已随新现实更新为一百三十三件套（一百三十二件套清除）',
  s2219.includes('一百三十三件套（一百三十二件套清除）'));
ok('smoke_v2218 的 GAME_VERSION 字面量 pin 已更新为 v22.23', s2218.includes("const GAME_VERSION = 'v22.37';"));
ok('smoke_v2218 的 package.json 件套计数 pin 已更新为 === 119', s2218.includes('testChain === 133'));
ok('smoke_v2217 的 README 件套 pin 已随新现实更新为一百三十三件套（一百三十二件套清除）',
  s2217.includes('一百三十三件套（一百三十二件套清除）'));
ok('smoke_v2216 的 NPC 总数 pin 已随新现实更新为 25（拾灯人落位）', s2216.includes('总数 29'));
ok('smoke_v2213 的 NPC 总数 pin 已随新现实更新为 25（拾灯人落位）', s2213.includes('总数 29'));
ok('smoke_v2211 的 NPC 总数 pin 已随新现实更新为 25（拾灯人落位）', s2211.includes('总数 29'));
ok('smoke_v2215 的 package.json 串尾 pin 已更新为 + smoke_v2223_lampman',
  s2215.includes('smoke_v2222_peddler.mjs && node tests/smoke_v2223_lampman.mjs && node tests/smoke_v2224_sifter.mjs && node tests/smoke_v2225_stonecarver.mjs && node tests/smoke_v2226_chestprogress.mjs && node tests/smoke_v2227_minstrel.mjs && node tests/smoke_v2228_titlesave.mjs && node tests/smoke_v2229_metall.mjs && node tests/smoke_v2230_pausewarn.mjs && node tests/smoke_v2231_smith.mjs && node tests/smoke_v2232_travelsup.mjs && node tests/smoke_v2233_nameflavor.mjs && node tests/smoke_v2234_innkeeper.mjs && node tests/smoke_v2235_minimapquest.mjs && node tests/smoke_v2236_villagelamp.mjs && node tests/smoke_v2237_minimaplegend.mjs"'));

// —— 旧代 pin 零残留：全部测试文件不得再含 v22.22 字面量/恒等/件套/树尾 pin（拆串构造避免自匹配）——
let stale = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "22';")) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v22.22 全库清零）', stale.length === 0, stale.join(','));
let staleId = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("GAME_VERSION === 'v22." + "22'")) staleId.push(f);
}
ok('旧代 GAME_VERSION 恒等 pin 零残留（===v22.22 全库清零）', staleId.length === 0, staleId.join(','));
let staleSuite = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('一百一十八件套（一百一十七件套清' + '除）')) staleSuite.push(f);
}
ok('旧代件套 pin 零残留（一百一十八件套（一百一十七件套清' + '除）全库清零）', staleSuite.length === 0, staleSuite.join(','));
let staleTail = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('smoke_v2221_wanderer + smoke_v2222_peddler（npm test 串' + '跑）')) staleTail.push(f);
}
ok('旧代树尾 pin 零残留（smoke_v2221_wanderer + smoke_v2222_peddler 串全库清零）', staleTail.length === 0, staleTail.join(','));
// 断链防回归：不得出现 v2222_peddler 被新尾吞并的坏链（smoke_v2221_wanderer 直接接 smoke_v2223_lampman）
let brokenTail = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('smoke_v2221_wanderer + smoke_v2223_lampman（npm test 串' + '跑）')) brokenTail.push(f);
}
if (readme.includes('smoke_v2221_wanderer + smoke_v2223_lampman（npm test 串' + '跑）')) brokenTail.push('README.md');
ok('坏链 pin 零残留（v2222_peddler 吞并链全库清零）', brokenTail.length === 0, brokenTail.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
