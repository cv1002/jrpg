// v22.34 专项冒烟：潮灯镇新风味 NPC「客栈老板娘」——纯内容扩充（无任务、零结算、零新逻辑）：
// 数据层三件套（village.extras (7,14) + NPC_SPOTS '7,14' + NPCS.innkeeper），旅馆（INN_PRICE=10
// 住店回满 HP/MP、全游唯一花钱恢复点）此前只是「一间没有人的房子」，老板娘把「先回镇睡满」
// 的补给口径（v21.40 矿脉/回廊没有泉水旅店 ↔ v22.32 旅行面板提醒）落到镇内一端；台词走既有
// lines + trueBoss after 彩蛋机制（villager/锻灯师同款：npcQuestPages 无待办任务回退时 trueBoss
// 优先 after、否则 lines），mark:'kettle' 新增一档程序化绘制分支（承 v22.13 fan / v22.27 qin /
// v22.31 hammer 专属先例），造型复用 mwVillager 镇民短衫身形。
// 本冒烟守护：版本锚点、全局坐标防撞（NPC_SPOTS 跨地图共用键、唯一映射、既有 29 键未动、
// 全图 extras 扫描 (7,14) 仅 village 一处）、NPCS 契约（name/mark/lines 2 页/after 2 页/
// 每页结构/[Enter] 收尾/行宽预算/旅店与补给主题/散尽彩蛋）、运行期（loadMap 落位 + 四邻可行走
// （西邻 (6,14) 旅馆外墙）+ 同图 NPC/设施零回归 + Enter/E 真实交互开对话 + 默认与 trueBoss 两档
// 选段）、npcQuestMark 无任务顶标、resolveNpcTalk 零任务契约、sprites 造型映射与新增 kettle mark、
// README/package.json 同步（tests 树尾 + 件套口径 130 + v22.34 守护描述 + 入库 130 份）、
// 姊妹件套 pin（v22.33..v2226 随新现实更新 + NPC 总数 pin 30）复查 + 旧代 v22.33 字面量/恒等/
// 件套/树尾 pin 零残留。
import { S } from '../js/state.js';
import { GAME_VERSION, NPCS, NPC_SPOTS, MAPS, TY, SOLID } from '../js/data.js';
import { npcQuestPages, npcQuestMark } from '../js/quests.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v22.33 冒烟先例：先装桩再 import main.js）——
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

console.log('— v22.34 潮灯镇客栈老板娘 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.33 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.33', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 34)), GAME_VERSION);
ok('data.js 含 v22.34 注释（客栈老板娘说明）', dSrc.includes('v22.34 新 NPC'));
ok('GAME_VERSION 字面量已为 v22.34（旧 v22.33 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v22.36';") && !dSrc.includes("const GAME_VERSION = 'v22." + "33';"));
ok('data.js 仍保留 v22.33 历史注释（累积注释块，姊妹 pin 不失效）', dSrc.includes('v22.33 新内容：创建角色页「姓名寓意」'));

// —— 数据层：NPC_SPOTS 全局坐标键（跨地图共用，不得撞车）——
ok('NPC_SPOTS[7,14]===innkeeper', NPC_SPOTS['7,14'] === 'innkeeper', NPC_SPOTS['7,14']);
ok('innkeeper 仅占一个坐标键（无重复映射）', Object.keys(NPC_SPOTS).filter((k) => NPC_SPOTS[k] === 'innkeeper').length === 1);
ok('NPC_SPOTS 总数 30（既有 29 键 + 客栈老板娘 1 键，v22.34 随新现实更新）', Object.keys(NPC_SPOTS).length === 30, Object.keys(NPC_SPOTS).length);
ok('既有 29 个 NPC/石碑键未被误动', ['13,6', '10,13', '19,8', '12,8', '2,4', '13,9', '3,1', '2,3', '17,12', '17,11', '5,1', '10,1', '15,1', '20,1', '8,5', '14,8', '5,10', '15,12', '14,3', '16,9', '15,2', '13,2', '21,2', '4,2', '5,3', '5,5', '19,3', '14,15', '7,11']
  .every((k) => NPC_SPOTS[k] != null));
// 全局坐标防撞演练：全图 extras 扫描，(7,14) 必须恰出现 1 次且在 village、ty 为 NPC
const at714 = [];
for (const [mname, mdef] of Object.entries(MAPS)) {
  for (const ex of (mdef.extras || [])) {
    if (ex.x === 7 && ex.y === 14) at714.push(mname + ':' + ex.ty);
  }
}
ok('(7,14) 全图 extras 仅 village 一处 NPC（他图无占用/无撞车）',
  at714.length === 1 && at714[0] === 'village:NPC', at714.join(','));
ok('data.js village.extras 源级含 v22.34 注释（{ x: 7, y: 14, ty: \'NPC\' }）',
  dSrc.includes("{ x: 7, y: 14, ty: 'NPC' }") && dSrc.includes('客栈老板娘（v22.34'));

// —— NPCS.innkeeper 契约 ——
const ik = NPCS.innkeeper;
ok('NPCS.innkeeper 存在且 name===客栈老板娘 / mark===kettle', !!ik && ik.name === '客栈老板娘' && ik.mark === 'kettle', ik && ik.name);
ok('lines 2 页（兜底闲聊），无 linesByStage（villager/锻灯师同款静态台词机制）',
  ik && Array.isArray(ik.lines) && ik.lines.length === 2 && !ik.linesByStage);
ok('trueBoss after 彩蛋 2 页（villager/掌灯童/说书人/拾菇人/听矿人/失名的旅人/货郎/拾灯人/筛砂人/刻碑人/琴师/锻灯师同款契约）',
  ik && Array.isArray(ik.after) && ik.after.length === 2);
const allIkPages = [...ik.lines, ...ik.after];
ok('全部 4 页：每页为字符串数组且末元素以 [Enter] 收尾（既有台词结构）',
  allIkPages.every((pg) => Array.isArray(pg) && pg.length >= 2 &&
    pg.every((ln) => typeof ln === 'string') && /\[Enter\]/.test(pg[pg.length - 1])));
const estW = (s) => { let w = 0; for (const ch of String(s)) { const c = ch.codePointAt(0); if ((c >= 0x4e00 && c <= 0x9fff) || (c >= 0x3000 && c <= 0x303f) || (c >= 0xff00 && c <= 0xffef)) w += 15; else if (/[0-9A-Za-z]/.test(ch)) w += 7.5; else if (ch === ' ') w += 7.5; else w += 8; } return w; };
ok('全部 4 页行宽 ≤440（对话面板预算）', allIkPages.every((pg) => pg.every((ln) => estW(ln) <= 440)));
ok('lines 首页含旅店世界观（落脚 + 热汤 + 灯芯）',
  ik.lines[0].some((ln) => ln.includes('落脚')) && ik.lines[0].some((ln) => ln.includes('热汤')) && ik.lines[0].some((ln) => ln.includes('灯芯')));
ok('lines 第 2 页含补给口径（睡一晚 + 星井矿脉/无字回廊没有泉水/旅店）',
  ik.lines[1].some((ln) => ln.includes('睡一晚')) && ik.lines[1].some((ln) => ln.includes('没有泉水')) && ik.lines[1].some((ln) => ln.includes('旅店')));
ok('after 首页含散尽彩蛋（灯全亮回来 + 一个都没少）',
  ik.after[0].some((ln) => ln.includes('亮回来的')) && ik.after[0].some((ln) => ln.includes('一个都没少')));
ok('after 第 2 页含收尾（没白煮 + 亮的/热的）',
  ik.after[1].some((ln) => ln.includes('没白煮')) && ik.after[1].some((ln) => ln.includes('是热的')));

// —— 选段（npcQuestPages 运行期求值，无任务 → 直落 NPCS 数据）——
const p0 = npcQuestPages({}, 'innkeeper');
ok('无旗标选段落到 lines（落脚）', p0 && p0[0].some((ln) => ln.includes('落脚')), p0 && p0[0][0]);
const pT = npcQuestPages({ trueBoss: true }, 'innkeeper');
ok('trueBoss 走 after 彩蛋（没白煮）',
  pT && pT.some((pg) => pg.some((ln) => ln.includes('没白煮'))));
ok('无任务：npcQuestMark===null（无 ❕ 顶标）', npcQuestMark(S.G, 'innkeeper') === null);
ok('无支线绑定 innkeeper：resolveNpcTalk 不推进任何任务（纯风味零任务）',
  (await import('../js/quests.js')).resolveNpcTalk(S.G, 'innkeeper') === null);

// —— 运行期：loadMap 落位 + 四邻可行走 + 同图关键点零回归 + Enter/E 真实交互开对话 ——
loadMap('village');
ok('(7,14) 落位为 NPC 瓦片（placeExtras 覆盖 + 不卡旅馆/主街动线）', at(7, 14) === TY.NPC, at(7, 14));
ok('四邻 (8,14)/(7,13)/(7,15) 皆可行走（可面对面对话，旅馆门口不设卡）',
  [[8, 14], [7, 13], [7, 15]].every(([x, y]) => !SOLID.has(at(x, y))));
ok('西邻 (6,14) 为旅馆外墙（SOLID，老板娘贴门而立与建筑一体）', SOLID.has(at(6, 14)) || at(6, 14) === TY.TOWN);
ok('同图 NPC：灯长(13,6)/镇民(10,13)/巡灯人(19,8)/守书记(12,8)/井巫(2,4)/掌灯阿婆(14,8)/粮铺掌柜(15,12)/说书人(16,9)/锻灯师(7,11) 零回归',
  at(13, 6) === TY.NPC && NPC_SPOTS['13,6'] === 'chief' && at(10, 13) === TY.NPC && NPC_SPOTS['10,13'] === 'villager' &&
  at(19, 8) === TY.NPC && NPC_SPOTS['19,8'] === 'adventurer' && at(12, 8) === TY.NPC && NPC_SPOTS['12,8'] === 'clerk' &&
  at(2, 4) === TY.NPC && NPC_SPOTS['2,4'] === 'sage' && at(14, 8) === TY.NPC && NPC_SPOTS['14,8'] === 'granny' &&
  at(15, 12) === TY.NPC && NPC_SPOTS['15,12'] === 'grainman' && at(16, 9) === TY.NPC && NPC_SPOTS['16,9'] === 'teller' &&
  at(7, 11) === TY.NPC && NPC_SPOTS['7,11'] === 'smith');
ok('同图设施零回归：商店(8,9)/喷泉(12,6)/酿造锅(10,12)/旅馆(1,13)/城门(20,9)/宝箱(22,1)',
  at(8, 9) === TY.SHOP && at(12, 6) === TY.FOUNTAIN && at(10, 12) === TY.BREW &&
  at(1, 13) === TY.INN && at(20, 9) === TY.GATE && at(22, 1) === TY.CHEST);
S.G.x = 8; S.G.y = 14; S.dir = 'L'; S.scene = 'world';
await screens.world.onKey({ key: 'Enter' });
ok('面向客栈老板娘按 Enter：进入对话（S.scene==talk）且 curNpc===innkeeper',
  S.scene === 'talk' && S.curNpc === 'innkeeper', S.scene + '/' + S.curNpc);
ok('对话第 1 页为 lines 默认台词（落脚）——S.G 无旗标',
  Array.isArray(S.talkPages) && S.talkPages[0] && S.talkPages[0].some((ln) => ln.includes('落脚')));
ok('对话共 2 页（第 1 页 [Enter] 继续 → 第 2 页 [Enter] 结束）', S.talkPages && S.talkPages.length === 2);
S.scene = 'world';
await screens.world.onKey({ key: 'E' });
ok('E 键同效（v21.29 交互别名对 NPC 零回归）', S.scene === 'talk' && S.curNpc === 'innkeeper', S.scene + '/' + S.curNpc);

// —— 造型映射与 kettle mark（sprites.js 源级）——
const spSrc = fs.readFileSync(path.join(ROOT, 'js/view/sprites.js'), 'utf8');
ok('sprites.js NPC_SHEET 已映射 innkeeper→mwVillager（镇民短衫身形）',
  spSrc.includes("innkeeper: 'mwVillager'"));
ok('sprites.js 已新增 kettle mark 分支（承 v22.13 fan / v22.27 qin / v22.31 hammer 专属先例）', spSrc.includes("mark==='kettle'"));

// —— README / package.json / CHANGELOG 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树收录 smoke_v2234_innkeeper 且位于串尾', readme.includes('smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp（npm test 串跑）'));
ok('README 件套口径为一百三十二件套（一百三十一件套清除）',
  readme.includes('冒烟一百三十二件套（一百三十一件套清除）') && !readme.includes('冒烟一百二十八件套（一百二十七件套清' + '除）'));
ok('README 含 v22.34 守护描述（潮灯镇客栈老板娘新 NPC）', readme.includes('v22.34 起含潮灯镇客栈老板娘新 NPC 守护'));
ok('README 含 smoke_v2234_innkeeper 入库（130 份）', readme.includes('smoke_v2234_innkeeper 入库（130 份）'));
ok('README 四图速览/系统清单含「客栈老板娘」', readme.includes('客栈老板娘'));
ok('package.json 已收录 smoke_v2234_innkeeper（npm test 串跑第 130 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2234_innkeeper.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 130 件套', testChain === 132, String(testChain));
ok('CHANGELOG 含 v22.34 条目', changelog.includes('## v22.34 '));

// 姊妹 pin 复查（v22.33..v2226 随新现实更新 + 旧代 v22.33 全库零残留）
const s2233 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2233_nameflavor.mjs'), 'utf8');
const s2232 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2232_travelsup.mjs'), 'utf8');
const s2231 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2231_smith.mjs'), 'utf8');
const s2230 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2230_pausewarn.mjs'), 'utf8');
const s2229 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2229_metall.mjs'), 'utf8');
const s2228 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2228_titlesave.mjs'), 'utf8');
const s2227 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2227_minstrel.mjs'), 'utf8');
const s2226 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2226_chestprogress.mjs'), 'utf8');
ok('smoke_v2233 的 GAME_VERSION 字面量 pin 已更新为 v22.34', s2233.includes("const GAME_VERSION = 'v22.36';"));
ok('smoke_v2233 的 GAME_VERSION 恒等 pin 已更新为 === v22.34', s2233.includes("GAME_VERSION === 'v22.36'"));
ok('smoke_v2233 的 README 件套 pin 已随新现实更新为一百三十二件套（一百三十一件套清除）',
  s2233.includes('一百三十二件套（一百三十一件套清除）'));
ok('smoke_v2233 的 README 串尾 pin 已更新为 + smoke_v2234_innkeeper',
  s2233.includes('smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp（npm test 串跑）'));
ok('smoke_v2233 的 package.json 件套计数 pin 已更新为 === 130', s2233.includes('testChain === 132'));
ok('smoke_v2232 的 GAME_VERSION 字面量 pin 已更新为 v22.34', s2232.includes("const GAME_VERSION = 'v22.36';"));
ok('smoke_v2232 的 README 串尾 pin 已更新为 + smoke_v2234_innkeeper',
  s2232.includes('smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp（npm test 串跑）'));
ok('smoke_v2231 的 NPC 总数 pin 已随新现实更新为 30（客栈老板娘落位）',
  s2231.includes('NPC_SPOTS).length === 30'));
ok('smoke_v2230 的 GAME_VERSION 字面量 pin 已更新为 v22.34', s2230.includes("const GAME_VERSION = 'v22.36';"));
ok('smoke_v2229 的 GAME_VERSION 恒等 pin 已更新为 === v22.34', s2229.includes("GAME_VERSION === 'v22.36'"));
ok('smoke_v2228 的 README 串尾 pin 已更新为 + smoke_v2234_innkeeper',
  s2228.includes('smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp（npm test 串跑）'));
ok('smoke_v2227 的 NPC 总数 pin 已随新现实更新为 30', s2227.includes('NPC_SPOTS).length === 30'));
ok('smoke_v2226 的 GAME_VERSION 字面量 pin 已更新为 v22.34', s2226.includes("const GAME_VERSION = 'v22.36';"));
// 旧代 v22.33 pin 全库零残留
const allTests = fs.readdirSync(path.join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs'));
const stale = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "33';") || src.includes("GAME_VERSION === 'v22." + "33'") ||
      src.includes('一百二十九件套（一百二十八件套清' + '除）') || src.includes('testChain === ' + '129') ||
      src.includes('smoke_v2233_nameflavor（npm test ' + '串跑）')) stale.push(f);
}
ok('旧代 v22.33 字面量/恒等/件套/串尾 pin 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

console.log(`— v22.34 冒烟 ${n} 项断言：${failed === 0 ? '全过' : failed + ' 项失败'} —`);
process.exit(failed === 0 ? 0 : 1);
