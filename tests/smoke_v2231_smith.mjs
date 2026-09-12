// v22.31 专项冒烟：潮灯镇新风味 NPC「锻灯师」——纯内容扩充（无任务、零结算、零新逻辑）：
// 数据层三件套（village.extras (7,11) + NPC_SPOTS '7,11' + NPCS.smith），台词走既有 lines +
// trueBoss after 彩蛋机制（villager 同款：npcQuestPages 无待办任务回退时 trueBoss 优先 after、
// 否则 lines），mark:'hammer' 新增一档程序化绘制分支（承 v22.13 折扇 fan / v22.27 琴 qin 专属先例），
// 造型复用 mwVillager 镇民短衫身形。
// 本冒烟守护：版本锚点、全局坐标防撞（NPC_SPOTS 跨地图共用键、唯一映射、既有 28 键未动、
// 全图 extras 扫描 (7,11) 仅 village 一处）、NPCS 契约（name/mark/lines 2 页/after 2 页/
// 每页结构/[Enter] 收尾/行宽预算/调子与灯匠主题/散尽彩蛋）、运行期（loadMap 落位 + 四邻可行走 +
// 灯长/镇民/巡灯人/守书记/井巫/掌灯阿婆/粮铺掌柜/说书人零回归 + Enter/E 真实交互开对话 +
// 默认与 trueBoss 两档选段）、npcQuestMark 无任务顶标、resolveNpcTalk 零任务契约、sprites 造型映射
// 与新增 hammer mark、README/package.json 同步（tests 树尾 + 件套口径 + v22.31 守护描述 +
// 入库 127 份）、姊妹件套 pin（v22.30..v2225 随新现实更新 + v22.25..v2211 NPC 总数 pin 29）
// 复查 + 旧代 v22.30 字面量/恒等/件套/树尾 pin 零残留。
import { S } from '../js/state.js';
import { GAME_VERSION, NPCS, NPC_SPOTS, MAPS, TY, SOLID } from '../js/data.js';
import { npcQuestPages, npcQuestMark } from '../js/quests.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v22.30 冒烟先例：先装桩再 import main.js）——
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

console.log('— v22.31 潮灯镇锻灯师 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.30 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.30', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 31)), GAME_VERSION);
ok('data.js 含 v22.31 注释（锻灯师说明）', dSrc.includes('v22.31 新内容：潮灯镇商店南侧新风味 NPC「锻灯师」'));
ok('GAME_VERSION 字面量已为 v22.31（旧 v22.30 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v22.31';") && !dSrc.includes("const GAME_VERSION = 'v22." + "30';"));
ok('data.js 仍保留 v22.30 历史注释（累积注释块，姊妹 pin 不失效）', dSrc.includes('v22.30 暂停菜单「未存档 + 槽位占位」提示'));

// —— 数据层：NPC_SPOTS 全局坐标键（跨地图共用，不得撞车）——
ok('NPC_SPOTS[7,11]===smith', NPC_SPOTS['7,11'] === 'smith', NPC_SPOTS['7,11']);
ok('smith 仅占一个坐标键（无重复映射）', Object.keys(NPC_SPOTS).filter((k) => NPC_SPOTS[k] === 'smith').length === 1);
ok('NPC_SPOTS 总数 29（既有 28 键 + 锻灯师 1 键，v22.31 随新现实更新）', Object.keys(NPC_SPOTS).length === 29, Object.keys(NPC_SPOTS).length);
ok('既有 28 个 NPC/石碑键未被误动', ['13,6', '10,13', '19,8', '12,8', '2,4', '13,9', '3,1', '2,3', '17,12', '17,11', '5,1', '10,1', '15,1', '20,1', '8,5', '14,8', '5,10', '15,12', '14,3', '16,9', '15,2', '13,2', '21,2', '4,2', '5,3', '5,5', '19,3', '14,15']
  .every((k) => NPC_SPOTS[k] != null));
// 全局坐标防撞演练：全图 extras 扫描，(7,11) 必须恰出现 1 次且在 village、ty 为 NPC
const at711 = [];
for (const [mname, mdef] of Object.entries(MAPS)) {
  for (const ex of (mdef.extras || [])) {
    if (ex.x === 7 && ex.y === 11) at711.push(mname + ':' + ex.ty);
  }
}
ok('(7,11) 全图 extras 仅 village 一处 NPC（他图无占用/无撞车）',
  at711.length === 1 && at711[0] === 'village:NPC', at711.join(','));
ok('data.js village.extras 源级含 v22.31 注释（{ x: 7, y: 11, ty: \'NPC\' }）',
  dSrc.includes('{ x: 7, y: 11, ty: \'NPC\' }') && dSrc.includes('锻灯师（v22.31'));

// —— NPCS.smith 契约 ——
const sm = NPCS.smith;
ok('NPCS.smith 存在且 name===锻灯师 / mark===hammer', !!sm && sm.name === '锻灯师' && sm.mark === 'hammer', sm && sm.name);
ok('lines 2 页（兜底闲聊），无 linesByStage（villager 同款静态台词机制）',
  sm && Array.isArray(sm.lines) && sm.lines.length === 2 && !sm.linesByStage);
ok('trueBoss after 彩蛋 2 页（villager/掌灯童/说书人/拾菇人/听矿人/失名的旅人/货郎/拾灯人/筛砂人/刻碑人/琴师同款契约）',
  sm && Array.isArray(sm.after) && sm.after.length === 2);
const allSmPages = [...sm.lines, ...sm.after];
ok('全部 4 页：每页为字符串数组且末元素以 [Enter] 收尾（既有台词结构）',
  allSmPages.every((pg) => Array.isArray(pg) && pg.length >= 2 &&
    pg.every((ln) => typeof ln === 'string') && /\[Enter\]/.test(pg[pg.length - 1])));
const estW = (s) => { let w = 0; for (const ch of String(s)) { const c = ch.codePointAt(0); if ((c >= 0x4e00 && c <= 0x9fff) || (c >= 0x3000 && c <= 0x303f) || (c >= 0xff00 && c <= 0xffef)) w += 15; else if (/[0-9A-Za-z]/.test(ch)) w += 7.5; else if (ch === ' ') w += 7.5; else w += 8; } return w; };
ok('全部 4 页行宽 ≤440（对话面板预算）', allSmPages.every((pg) => pg.every((ln) => estW(ln) <= 440)));
ok('lines 首页含灯匠世界观（灯记住路 · 人跟着灯走）',
  sm.lines[0].some((ln) => ln.includes('灯记住路')) && sm.lines[0].some((ln) => ln.includes('人跟着灯走')));
ok('lines 第 2 页含补给口径（进林子前 · 药水/热汤备齐 · 只补灯不补人）',
  sm.lines[1].some((ln) => ln.includes('进林子前')) && sm.lines[1].some((ln) => ln.includes('不补人')));
ok('after 首页含散尽彩蛋（灯芯全亮回来了 · 灯比人先到家）',
  sm.after[0].some((ln) => ln.includes('亮回来了')) && sm.after[0].some((ln) => ln.includes('灯比人先到家')));
ok('after 第 2 页含灯匠收尾（铁锤归我管）',
  sm.after[1].some((ln) => ln.includes('铁锤归我管')));

// —— 选段（npcQuestPages 运行期求值，无任务 → 直落 NPCS 数据）——
const p0 = npcQuestPages({}, 'smith');
ok('无旗标选段落到 lines（灯记住路）', p0 && p0[0].some((ln) => ln.includes('灯记住路')), p0 && p0[0][0]);
const pT = npcQuestPages({ trueBoss: true }, 'smith');
ok('trueBoss 走 after 彩蛋（亮回来了 + 铁锤归我管）',
  pT && pT.some((pg) => pg.some((ln) => ln.includes('亮回来了'))) &&
  pT.some((pg) => pg.some((ln) => ln.includes('铁锤归我管'))));
ok('无任务：npcQuestMark===null（无 ❕ 顶标）', npcQuestMark(S.G, 'smith') === null);
ok('无支线绑定锻灯师：resolveNpcTalk 不推进任何任务（纯风味零任务）',
  (await import('../js/quests.js')).resolveNpcTalk(S.G, 'smith') === null);

// —— 运行期：loadMap 落位 + 四邻可行走 + 同图关键点零回归 + Enter/E 真实交互开对话 ——
loadMap('village');
ok('(7,11) 落位为 NPC 瓦片（placeExtras 覆盖 + 不卡商店/主街动线）', at(7, 11) === TY.NPC, at(7, 11));
ok('四邻 (6,11)/(8,11)/(7,12) 皆可行走（可面对面对话，杂货铺后墙外不设卡）',
  [[6, 11], [8, 11], [7, 12]].every(([x, y]) => !SOLID.has(at(x, y))));
ok('同图 NPC：灯长(13,6)/镇民(10,13)/巡灯人(19,8)/守书记(12,8)/井巫(2,4)/掌灯阿婆(14,8)/粮铺掌柜(15,12)/说书人(16,9) 零回归',
  at(13, 6) === TY.NPC && NPC_SPOTS['13,6'] === 'chief' && at(10, 13) === TY.NPC && NPC_SPOTS['10,13'] === 'villager' &&
  at(19, 8) === TY.NPC && NPC_SPOTS['19,8'] === 'adventurer' && at(12, 8) === TY.NPC && NPC_SPOTS['12,8'] === 'clerk' &&
  at(2, 4) === TY.NPC && NPC_SPOTS['2,4'] === 'sage' && at(14, 8) === TY.NPC && NPC_SPOTS['14,8'] === 'granny' &&
  at(15, 12) === TY.NPC && NPC_SPOTS['15,12'] === 'grainman' && at(16, 9) === TY.NPC && NPC_SPOTS['16,9'] === 'teller');
ok('同图设施零回归：商店(8,9)/喷泉(12,6)/酿造锅(10,12)/旅馆(1,13)/城门(20,9)/宝箱(22,1)',
  at(8, 9) === TY.SHOP && at(12, 6) === TY.FOUNTAIN && at(10, 12) === TY.BREW &&
  at(1, 13) === TY.INN && at(20, 9) === TY.GATE && at(22, 1) === TY.CHEST);
S.G.x = 7; S.G.y = 12; S.dir = 'U'; S.scene = 'world';
await screens.world.onKey({ key: 'Enter' });
ok('面向锻灯师按 Enter：进入对话（S.scene==talk）且 curNpc===smith',
  S.scene === 'talk' && S.curNpc === 'smith', S.scene + '/' + S.curNpc);
ok('对话第 1 页为 lines 默认台词（灯记住路）——S.G 无旗标',
  Array.isArray(S.talkPages) && S.talkPages[0] && S.talkPages[0].some((ln) => ln.includes('灯记住路')));
ok('对话共 2 页（第 1 页 [Enter] 继续 → 第 2 页 [Enter] 结束）', S.talkPages && S.talkPages.length === 2);
S.scene = 'world';
await screens.world.onKey({ key: 'E' });
ok('E 键同效（v21.29 交互别名对 NPC 零回归）', S.scene === 'talk' && S.curNpc === 'smith', S.scene + '/' + S.curNpc);

// —— 造型映射与 hammer mark（sprites.js 源级）——
const spSrc = fs.readFileSync(path.join(ROOT, 'js/view/sprites.js'), 'utf8');
ok('sprites.js NPC_SHEET 已映射 smith→mwVillager（镇民短衫身形）',
  spSrc.includes("smith: 'mwVillager'"));
ok('sprites.js 已新增 hammer mark 分支（承 v22.13 fan / v22.27 qin 专属先例）', spSrc.includes("mark==='hammer'"));

// —— README / package.json / CHANGELOG 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树收录 smoke_v2231_smith 且位于串尾', readme.includes('smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith（npm test 串跑）'));
ok('README tests 树尾链完整（v2230_pausewarn 未被新尾吞并，全链连到 smoke_v2231_smith）',
  readme.includes('smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith（npm test 串跑）'));
ok('README 件套口径为一百二十七件套（一百二十六件套清除）',
  readme.includes('冒烟一百二十七件套（一百二十六件套清除）') && !readme.includes('冒烟一百二十六件套（一百二十五件套清' + '除）'));
ok('README 含 v22.31 守护描述（潮灯镇锻灯师新 NPC）', readme.includes('v22.31 起含潮灯镇锻灯师新 NPC 守护'));
ok('README 含 smoke_v2231_smith 入库（127 份）', readme.includes('smoke_v2231_smith 入库（127 份）'));
ok('README 四图速览/系统清单含「锻灯师」', readme.includes('锻灯师'));
ok('package.json 已收录 smoke_v2231_smith（npm test 串跑第 127 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2231_smith.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 127 件套', testChain === 127, String(testChain));
ok('CHANGELOG 含 v22.31 条目', changelog.includes('## v22.31 '));

// 姊妹 pin 复查（v22.30..v2225 随新现实更新 + v22.25..v2211 NPC 总数 pin 29）
const s2230 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2230_pausewarn.mjs'), 'utf8');
const s2229 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2229_metall.mjs'), 'utf8');
const s2228 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2228_titlesave.mjs'), 'utf8');
const s2227 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2227_minstrel.mjs'), 'utf8');
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
ok('smoke_v2230 的 GAME_VERSION 字面量 pin 已更新为 v22.31', s2230.includes("const GAME_VERSION = 'v22.31';"));
ok('smoke_v2230 的 README 件套 pin 已随新现实更新为一百二十七件套（一百二十六件套清除）',
  s2230.includes('一百二十七件套（一百二十六件套清除）'));
ok('smoke_v2230 的 README 树尾 pin 已更新为 + smoke_v2231_smith',
  s2230.includes('smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith（npm test 串跑）'));
ok('smoke_v2230 的 package.json 件套计数 pin 已更新为 === 127', s2230.includes('testChain === 127'));
ok('smoke_v2229 的 GAME_VERSION 字面量 pin 已更新为 v22.31', s2229.includes("const GAME_VERSION = 'v22.31';"));
ok('smoke_v2229 的 GAME_VERSION 恒等 pin 已更新为 === v22.31', s2229.includes("GAME_VERSION === 'v22.31'"));
ok('smoke_v2229 的 README 件套 pin 已随新现实更新为一百二十七件套（一百二十六件套清除）',
  s2229.includes('一百二十七件套（一百二十六件套清除）'));
ok('smoke_v2229 的 README 树尾 pin 已更新为 + smoke_v2231_smith',
  s2229.includes('smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith（npm test 串跑）'));
ok('smoke_v2229 的 package.json 件套计数 pin 已更新为 === 127', s2229.includes('testChain === 127'));
ok('smoke_v2228 的 GAME_VERSION 字面量 pin 已更新为 v22.31', s2228.includes("const GAME_VERSION = 'v22.31';"));
ok('smoke_v2228 的 README 树尾 pin 已更新为 + smoke_v2231_smith',
  s2228.includes('smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith（npm test 串跑）'));
ok('smoke_v2227 的 README 树尾 pin 已更新为 + smoke_v2231_smith',
  s2227.includes('smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith（npm test 串跑）'));
ok('smoke_v2226 的 GAME_VERSION 字面量 pin 已更新为 v22.31', s2226.includes("const GAME_VERSION = 'v22.31';"));
ok('smoke_v2226 的 README 件套 pin 已随新现实更新为一百二十七件套（一百二十六件套清除）',
  s2226.includes('一百二十七件套（一百二十六件套清除）'));
ok('smoke_v2225 的 README 树尾 pin 已更新为 + smoke_v2231_smith',
  s2225.includes('smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith（npm test 串跑）'));
ok('smoke_v2225 的 package.json 件套计数 pin 已更新为 === 127', s2225.includes('testChain === 127'));
ok('smoke_v2225 的 NPC 总数 pin 已随新现实更新为 29（锻灯师落位）', s2225.includes('总数 29'));
ok('smoke_v2224 的 NPC 总数 pin 已随新现实更新为 29（锻灯师落位）', s2224.includes('总数 29'));
ok('smoke_v2223 的 NPC 总数 pin 已随新现实更新为 29（锻灯师落位）', s2223.includes('总数 29'));
ok('smoke_v2222 的 NPC 总数 pin 已随新现实更新为 29（锻灯师落位）', s2222.includes('总数 29'));
ok('smoke_v2221 的 NPC 总数 pin 已随新现实更新为 29（锻灯师落位）', s2221.includes('总数 29'));
ok('smoke_v2220 的 NPC 总数 pin 已随新现实更新为 29（锻灯师落位）', s2220.includes('总数 29'));
ok('smoke_v2216 的 NPC 总数 pin 已随新现实更新为 29（锻灯师落位）', s2216.includes('总数 29'));
ok('smoke_v2213 的 NPC 总数 pin 已随新现实更新为 29（锻灯师落位）', s2213.includes('总数 29'));
ok('smoke_v2211 的 NPC 总数 pin 已随新现实更新为 29（锻灯师落位）', s2211.includes('总数 29'));

// —— 旧代 pin 零残留：全部测试文件不得再含 v22.30 字面量/恒等/件套/树尾 pin（拆串构造避免自匹配）——
let stale = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "30';")) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v22.30 全库清零）', stale.length === 0, stale.join(','));
let staleId = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("GAME_VERSION === 'v22." + "30'")) staleId.push(f);
}
ok('旧代 GAME_VERSION 恒等 pin 零残留（===v22.30 全库清零）', staleId.length === 0, staleId.join(','));
let staleSuite = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('一百二十六件套（一百二十五件套清' + '除）')) staleSuite.push(f);
}
ok('旧代件套 pin 零残留（一百二十六件套（一百二十五件套清' + '除）全库清零）', staleSuite.length === 0, staleSuite.join(','));
let staleTail = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('smoke_v2229_metall + smoke_v2230_pausewarn（npm test 串' + '跑）')) staleTail.push(f);
}
ok('旧代树尾 pin 零残留（smoke_v2229_metall + smoke_v2230_pausewarn 串全库清零）', staleTail.length === 0, staleTail.join(','));
// 断链防回归：不得出现 v2230_pausewarn 被新尾吞并的坏链（smoke_v2229_metall 直接接 smoke_v2231_smith）
let brokenTail = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('smoke_v2229_metall + smoke_v2231_smith（npm test 串' + '跑）')) brokenTail.push(f);
}
if (readme.includes('smoke_v2229_metall + smoke_v2231_smith（npm test 串' + '跑）')) brokenTail.push('README.md');
ok('坏链 pin 零残留（v2230_pausewarn 吞并链全库清零）', brokenTail.length === 0, brokenTail.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
