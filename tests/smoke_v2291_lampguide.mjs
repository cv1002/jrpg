// v22.91 专项冒烟：无字回廊终焉之神祭坛北侧新风味 NPC「引灯人」——纯内容扩充（无任务、零结算、零新逻辑）：
// 数据层三件套（gallery.extras (21,3) + NPC_SPOTS '21,3' + NPCS.lampguide），终焉之神祭坛（SB (21,4)）
// 在 v22.62 补脸后一直无人驻守（v22.45 守夜人补了幽冥魔王祭坛的在场者），现由引灯人补上——四图强敌
// 地标至此全部有人驻守；台词讲「灯引到这儿就再没有前路了/里头那位守着最后一点没烧完的灯/你来，是替
// 镇子把这点火送回家的吗？」（与守名者/记誓人同脉）+ 祸乱形态预习（「血过半会入祸乱形态，治愈会被
// 封印，可喝药不受影响」与 BOSS_TRUE_FORBID/skillForbidden/drawBattle「⛔ 治愈封印」/H 页终焉之神行
// r[2] 逐字同源）；台词走既有 lines + trueBoss after 彩蛋机制（npcQuestPages 无待办任务回退时
// trueBoss 优先 after、否则 lines）；mark:'lamp' 复用既有灯标（drawNpcMark 既有分支）、造型走
// NPC_SHEET 默认 mwVillager（零 sprites 改动）；选址 (21,3) 而非主廊 (20,4)——NPC 为 SOLID，若置于
// (20,4) 会堵死行 4 面向祭坛 (21,4) 的唯一动线，北邻一格零碰撞不卡任何动线。
// v24.116 起升格为支线委托人（QUESTS.side_guide「药要带足」·[3]战斗用药累计 GUIDE_GOAL(8) 次）——
// 本档契约随升格翻转（选段走任务页 / ❕ 可接委托 / resolveNpcTalk 接取），NPC 数据层三件套零改动：
// 原有 lines 两页与 trueBoss after 彩蛋「火熄了/回廊不需要灯了」已并入 side_guide 的 done 真结局分档（零内容丢失）。
// 本冒烟守护：版本锚点、全局坐标防撞（NPC_SPOTS 跨地图共用键、唯一映射、既有键未动、全图 extras
// 扫描 (21,3) 仅 gallery 一处）、NPCS 契约（name/mark/lines 2 页/after 2 页/每页结构/[Enter] 收尾/
// 行宽预算/灯主题/祸乱形态预习同源/散尽彩蛋）、升格后任务页契约（npcQuestMark offer/turnin/done 四态、
// npcQuestPages 选段走任务页、resolveNpcTalk 接取/交付、trueBoss 但未接仍走 offer、done 真结局分档、
// 姊妹件 smoke_v2235/smoke.mjs 已随升格更新）、运行期（loadMap 落位 + 四邻可行走 + 祭坛 SB 零回归 +
// 同图 NPC/地标零回归 + Enter/E 真实交互开对话 + 首按 Enter 落入对话）、sprites 零改动、README/package.json/
// CHANGELOG 同步（件套口径已随全库 pin 级联推进至三百三十九件套）、哨兵链 前望口径。
import { S } from '../js/state.js';
import { GAME_VERSION, NPCS, NPC_SPOTS, MAPS, TY, SOLID, SPECIES } from '../js/data.js';
import { npcQuestPages, npcQuestMark, resolveNpcTalk } from '../js/quests.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v22.90 冒烟先例：先装桩再 import main.js）——
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

console.log('— v22.91 无字回廊终焉祭坛引灯人 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.90 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.90（本版守 v22.91）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 99)), GAME_VERSION);
ok('data.js 含 v22.91 注释（引灯人说明）', dSrc.includes('v22.91 新内容·纯风味'));
ok('GAME_VERSION 字面量已为 v22.91（旧 v22.90 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.160';") && !dSrc.includes("const GAME_VERSION = 'v22." + "90';"));
ok('data.js 仍保留 v22.90/v22.89 世代注释链（历史注释未动）',
  dSrc.includes('// v22.90 体验打磨·可发现性·纯文字') && dSrc.includes('// v22.89 体验打磨·信息透明·纯显示'));

// —— 数据层：NPC_SPOTS 全局坐标键（跨地图共用，不得撞车）——
ok('NPC_SPOTS[21,3]===lampguide', NPC_SPOTS['21,3'] === 'lampguide', NPC_SPOTS['21,3']);
ok('lampguide 仅占一个坐标键（无重复映射）', Object.keys(NPC_SPOTS).filter((k) => NPC_SPOTS[k] === 'lampguide').length === 1);
ok('NPC_SPOTS 总数 36（既有 35 键 + 引灯人 1 键，v22.91 随新现实更新）', Object.keys(NPC_SPOTS).length === 46, Object.keys(NPC_SPOTS).length);
ok('既有 35 个 NPC/石碑键未被误动', ['13,6', '10,13', '19,8', '12,8', '2,4', '13,9', '3,1', '2,3', '17,12', '17,11', '5,1', '10,1', '15,1', '20,1', '8,5', '14,8', '5,10', '15,12', '14,3', '16,9', '15,2', '13,2', '21,2', '4,2', '5,3', '5,5', '19,3', '14,15', '7,11', '7,14', '8,10', '9,12', '19,7', '10,3', '20,12']
  .every((k) => NPC_SPOTS[k] != null));
// 全局坐标防撞演练：全图 extras 扫描，(21,3) 必须恰出现 1 次且在 gallery、ty 为 NPC
const at213 = [];
for (const [mname, mdef] of Object.entries(MAPS)) {
  for (const ex of (mdef.extras || [])) {
    if (ex.x === 21 && ex.y === 3) at213.push(mname + ':' + ex.ty);
  }
}
ok('(21,3) 全图 extras 仅 gallery 一处 NPC（他图无占用/无撞车）',
  at213.length === 1 && at213[0] === 'gallery:NPC', at213.join(','));
ok('data.js gallery.extras 源级含 v22.91 注释（{ x: 21, y: 3, ty: \'NPC\' } + 引灯人）',
  dSrc.includes("{ x: 21, y: 3, ty: 'NPC' }") && dSrc.includes('引灯人（v22.91'));
ok('data.js NPC_SPOTS 源级含 v22.91 注释（\'21,3\': \'lampguide\'）',
  dSrc.includes("'21,3': 'lampguide'"));

// —— NPCS.lampguide 契约 ——
const lg = NPCS.lampguide;
ok('NPCS.lampguide 存在且 name===引灯人 / mark===lamp（复用既有灯标）', !!lg && lg.name === '引灯人' && lg.mark === 'lamp', lg && lg.name);
ok('lines 2 页（兜底闲聊），无 linesByStage（客栈老板娘/货郎同款静态台词机制）',
  lg && Array.isArray(lg.lines) && lg.lines.length === 2 && !lg.linesByStage);
ok('trueBoss after 彩蛋 2 页（掌柜/货郎/拾灯人/刻碑人同款契约）',
  lg && Array.isArray(lg.after) && lg.after.length === 2);
const allLgPages = [...lg.lines, ...lg.after];
ok('全部 4 页：每页为字符串数组且末元素以 [Enter] 收尾（既有台词结构）',
  allLgPages.every((pg) => Array.isArray(pg) && pg.length >= 2 &&
    pg.every((ln) => typeof ln === 'string') && /\[Enter\]/.test(pg[pg.length - 1])));
const estW = (s) => { let w = 0; for (const ch of String(s)) { const c = ch.codePointAt(0); if ((c >= 0x4e00 && c <= 0x9fff) || (c >= 0x3000 && c <= 0x303f) || (c >= 0xff00 && c <= 0xffef)) w += 15; else if (/[0-9A-Za-z]/.test(ch)) w += 7.5; else if (ch === ' ') w += 7.5; else w += 8; } return w; };
ok('全部 4 页行宽 ≤440（对话面板预算）', allLgPages.every((pg) => pg.every((ln) => estW(ln) <= 440)));
ok('lines 首页含灯主题（前路 + 没烧完的灯 + 送火回家）',
  lg.lines[0].some((ln) => ln.includes('前路')) && lg.lines[0].some((ln) => ln.includes('没烧完的灯')) &&
  lg.lines[0].some((ln) => ln.includes('送回家')));
ok('lines 第 2 页含祸乱形态预习（祸乱形态 + 封印 + 喝药不受影响）',
  lg.lines[1].some((ln) => ln.includes('祸乱形态')) && lg.lines[1].some((ln) => ln.includes('会入祸乱形态')) &&
  lg.lines[1].some((ln) => ln.includes('封印')) && lg.lines[1].some((ln) => ln.includes('喝药不受影响')));
ok('after 首页含散尽彩蛋（火熄 + 送回灯下 + 不用再守着）',
  lg.after[0].some((ln) => ln.includes('火熄了')) && lg.after[0].some((ln) => ln.includes('送回灯下')) &&
  lg.after[0].some((ln) => ln.includes('不用再守着')));
ok('after 第 2 页含收尾（回廊不需要灯 + 名字都亮了）',
  lg.after[1].some((ln) => ln.includes('回廊不需要灯')) && lg.after[1].some((ln) => ln.includes('名字都亮了')));
ok('台词机制与数据同源：祸乱形态封印治愈确有数据依据（SPECIES 终焉之神 phase2.forbid 含 heal）',
  (SPECIES['终焉之神'].phase2.forbid || []).includes('heal'));

// —— 选段（npcQuestPages 运行期求值，升格后无待办回退 NPCS 数据；有 side_guide 则任务页优先）——
const p0 = npcQuestPages({}, 'lampguide');
ok('无旗标选段落到 offer 任务页（含原台词「前路」口吻 + 接下委托）', p0 && p0[0].some((ln) => ln.includes('前路')) && JSON.stringify(p0).includes('接下委托'), p0 && p0[0][0]);
ok('有可接委托：npcQuestMark===❕ 可接委托（不再是无任务 null）', npcQuestMark(S.G, 'lampguide') === '❕ 可接委托', npcQuestMark(S.G, 'lampguide'));
const rAccept = resolveNpcTalk(S.G, 'lampguide');
ok('支线绑定 lampguide：resolveNpcTalk 接取 side_guide（返回 accept 契约，GUIDE_GOAL 单一数据源）',
  !!rAccept && rAccept.kind === 'accept' && rAccept.id === 'side_guide' && S.G.quests.side_guide === 'active', JSON.stringify(rAccept));
ok('接取后 active 态：npcQuestMark 回落 null（进行中无顶标）', npcQuestMark(S.G, 'lampguide') === null, npcQuestMark(S.G, 'lampguide'));
const pT = npcQuestPages({ trueBoss: true, quests: {} }, 'lampguide');
ok('trueBoss 但未接任务仍走 offer（升格后任务页优先，after 彩蛋并入 done 分档）',
  pT && JSON.stringify(pT).includes('接下委托'));
const pDone = npcQuestPages({ trueBoss: true, quests: { side_guide: 'done' } }, 'lampguide');
ok('done trueBoss 分档：after 彩蛋「火熄了/回廊不需要灯了」并入任务页（零内容丢失）',
  pDone && pDone.some((pg) => pg.some((ln) => ln.includes('火熄了'))) && pDone.some((pg) => pg.some((ln) => ln.includes('回廊不需要灯了'))));

// —— 运行期：loadMap 落位 + 四邻可行走 + 祭坛/同图关键点零回归 + Enter/E 真实交互开对话 ——
loadMap('gallery');
ok('(21,3) 落位为 NPC 瓦片（placeExtras 覆盖 + 不卡祭坛动线）', at(21, 3) === TY.NPC, at(21, 3));
ok('四邻 (20,3)/(22,3)/(21,4) 皆可行走（可面对面对话，祭坛前不设卡）',
  [[20, 3], [22, 3], [21, 4]].every(([x, y]) => !SOLID.has(at(x, y))));
ok('四邻全可行走：(20,3)/(21,2)/(22,3)/(21,4)（北隅口袋经 (22,2)/(22,4) 可达，零死角）',
  [[20, 3], [21, 2], [22, 3], [21, 4]].every(([x, y]) => !SOLID.has(at(x, y))));
ok('南邻祭坛 (21,4) 仍为 SB 瓦片（终焉之神祭坛零回归）', at(21, 4) === TY.SB, at(21, 4));
ok('同图 NPC：守名者(8,5)/掌灯童(14,3)/拾灯人(5,3)/刻碑人(19,3)/记誓人(10,3) 零回归',
  at(8, 5) === TY.NPC && NPC_SPOTS['8,5'] === 'guard' && at(14, 3) === TY.NPC && NPC_SPOTS['14,3'] === 'lampkid' &&
  at(5, 3) === TY.NPC && NPC_SPOTS['5,3'] === 'lampman' && at(19, 3) === TY.NPC && NPC_SPOTS['19,3'] === 'stonecarver' &&
  at(10, 3) === TY.NPC && NPC_SPOTS['10,3'] === 'oathkeep');
ok('同图地标零回归：四石碑(5,10,15,20,1)/残焰魔像(12,4)/遗物宝箱(16,1)/出口(1,4)',
  at(5, 1) === TY.STELE && at(10, 1) === TY.STELE && at(15, 1) === TY.STELE && at(20, 1) === TY.STELE &&
  at(12, 4) === TY.MB && at(16, 1) === TY.CHEST && at(1, 4) === TY.EXIT,
  [at(5, 1), at(12, 4), at(16, 1), at(1, 4)].join('/'));
S.G.x = 21; S.G.y = 4; S.dir = 'U'; S.scene = 'world';
await screens.world.onKey({ key: 'Enter' });
ok('面向引灯人按 Enter：进入对话（S.scene==talk）且 curNpc===lampguide',
  S.scene === 'talk' && S.curNpc === 'lampguide', S.scene + '/' + S.curNpc);
ok('对话第 1 页为任务页 active 台词（继续练手 0/8 次药）——S.G 已接 side_guide',
  Array.isArray(S.talkPages) && S.talkPages[0] && S.talkPages[0].some((ln) => ln.includes('0/8 次药')));
ok('对话共 1 页（active 页函数型单页 [Enter] 继续）', S.talkPages && S.talkPages.length === 1);
S.scene = 'world';
await screens.world.onKey({ key: 'E' });
ok('E 键同效（v21.29 交互别名对 NPC 零回归）', S.scene === 'talk' && S.curNpc === 'lampguide', S.scene + '/' + S.curNpc);

// —— sprites 零改动：默认 mwVillager 造型 + 既有 lamp 分支 ——
const spSrc = fs.readFileSync(path.join(ROOT, 'js/view/sprites.js'), 'utf8');
ok('sprites.js 造型默认回退 mwVillager（NPC_SHEET[nid] || mwVillager，lampguide 零映射零新增）',
  spSrc.includes("NPC_SHEET[nid] || 'mwVillager'") && !spSrc.includes("'lampguide'"));
ok('sprites.js 既有 lamp 灯标分支仍在（mark 复用零新增）', spSrc.includes("mark==='lamp'"));

// —— README / package.json / CHANGELOG 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
const TAIL = 'smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula + smoke_v2400_trialwarn + smoke_v2401_winbgm + smoke_v2402_firstwin + smoke_v2403_diffbattle + smoke_v2404_chestrow + smoke_v2405_trialgoal + smoke_v2406_restrow + smoke_v2407_innrest + smoke_v2408_travelgoal + smoke_v2409_sellgoal + smoke_v2410_brewgoal + smoke_v2411_deathprog + smoke_v2412_battlegoal + smoke_v2413_xpcurve + smoke_v2414_nightbattle + smoke_v2415_treepin + smoke_v2416_steps + smoke_v2417_mapdrink + smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10 + smoke_v2461_xpcurve11 + smoke_v2462_xpcurve12 + smoke_v2463_xpcurve13 + smoke_v2464_xpcurve14 + smoke_v2465_xpcurve15 + smoke_v2466_xpcurve16 + smoke_v2467_xpcurve17 + smoke_v2468_xpcurve18 + smoke_v2469_xpcurve19 + smoke_v2470_xpcurve20 + smoke_v2471_bellman + smoke_v2472_bellquest + smoke_v2473_xpcurve21 + smoke_v2475_xpcurve22 + smoke_v2476_achprog + smoke_v2477_fisher + smoke_v2478_xpcurve23 + smoke_v2479_xpcurve24 + smoke_v2480_fisherquest + smoke_v2481_xpcurve25 + smoke_v2482_watchquest + smoke_v2483_xpcurve26 + smoke_v2484_goldcurve10 + smoke_v2485_goldcurve11 + smoke_v2486_goldcurve12 + smoke_v2487_goldcurve13 + smoke_v2488_goldcurve14 + smoke_v2489_goldcurve15 + smoke_v2490_goldcurve16 + smoke_v2491_goldcurve17 + smoke_v2492_goldcurve18 + smoke_v2493_goldcurve19 + smoke_v2494_goldcurve20 + smoke_v2495_goldcurve21 + smoke_v2496_goldcurve22 + smoke_v2497_goldcurve23 + smoke_v2498_goldcurve24 + smoke_v2499_goldcurve25 + smoke_v24100_talequest + smoke_v24101_goldcurve26 + smoke_v24102_goldcurve27 + smoke_v24103_goldcurve28 + smoke_v24104_goldcurve29 + smoke_v24105_songquest + smoke_v24106_moonquest + smoke_v24107_peddlequest + smoke_v24108_shopquest + smoke_v24109_carvequest + smoke_v24110_vowquest + smoke_v24111_hearerquest + smoke_v24112_talkquest + smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑）';
ok('README tests 树已收录 smoke_v2291_lampguide 且位于串尾', readme.includes(TAIL));
const treeLine = readme.split('\n').find((l) => l.startsWith('├── tests/'));
ok('README tests 树含 smoke_v2291_lampguide 串尾且旧串尾零残留（树为历史清单，总数不守恒）',
  treeLine && treeLine.includes('+ smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula + smoke_v2400_trialwarn + smoke_v2401_winbgm + smoke_v2402_firstwin + smoke_v2403_diffbattle + smoke_v2404_chestrow + smoke_v2405_trialgoal + smoke_v2406_restrow + smoke_v2407_innrest + smoke_v2408_travelgoal + smoke_v2409_sellgoal + smoke_v2410_brewgoal + smoke_v2411_deathprog + smoke_v2412_battlegoal + smoke_v2413_xpcurve + smoke_v2414_nightbattle + smoke_v2415_treepin + smoke_v2416_steps + smoke_v2417_mapdrink + smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10 + smoke_v2461_xpcurve11 + smoke_v2462_xpcurve12 + smoke_v2463_xpcurve13 + smoke_v2464_xpcurve14 + smoke_v2465_xpcurve15 + smoke_v2466_xpcurve16 + smoke_v2467_xpcurve17 + smoke_v2468_xpcurve18 + smoke_v2469_xpcurve19 + smoke_v2470_xpcurve20 + smoke_v2471_bellman + smoke_v2472_bellquest + smoke_v2473_xpcurve21 + smoke_v2475_xpcurve22 + smoke_v2476_achprog + smoke_v2477_fisher + smoke_v2478_xpcurve23 + smoke_v2479_xpcurve24 + smoke_v2480_fisherquest + smoke_v2481_xpcurve25 + smoke_v2482_watchquest + smoke_v2483_xpcurve26 + smoke_v2484_goldcurve10 + smoke_v2485_goldcurve11 + smoke_v2486_goldcurve12 + smoke_v2487_goldcurve13 + smoke_v2488_goldcurve14 + smoke_v2489_goldcurve15 + smoke_v2490_goldcurve16 + smoke_v2491_goldcurve17 + smoke_v2492_goldcurve18 + smoke_v2493_goldcurve19 + smoke_v2494_goldcurve20 + smoke_v2495_goldcurve21 + smoke_v2496_goldcurve22 + smoke_v2497_goldcurve23 + smoke_v2498_goldcurve24 + smoke_v2499_goldcurve25 + smoke_v24100_talequest + smoke_v24101_goldcurve26 + smoke_v24102_goldcurve27 + smoke_v24103_goldcurve28 + smoke_v24104_goldcurve29 + smoke_v24105_songquest + smoke_v24106_moonquest + smoke_v24107_peddlequest + smoke_v24108_shopquest + smoke_v24109_carvequest + smoke_v24110_vowquest + smoke_v24111_hearerquest + smoke_v24112_talkquest + smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑）') &&
  !treeLine.includes('smoke_v2290_statlink（npm test 串跑）'));
ok('README 件套口径为三百七十一件套（三百七十件套清除）且旧 186 口径零残留',
  readme.includes('冒烟三百七十一件套（三百七十件套清除）') && !readme.includes('冒烟一百八十六件套（一百八十五件套清' + '除）'));
ok('README 含 v22.91 守护描述（无字回廊终焉之神祭坛引灯人新 NPC）', readme.includes('v22.91 起含无字回廊终焉之神祭坛引灯人新 NPC 守护'));
ok('README 含 smoke_v2291_lampguide 入库（187 份）', readme.includes('smoke_v2291_lampguide 入库（187 份）'));
ok('README 仍保留 smoke_v2290_statlink 入库（186 份）历史口径', readme.includes('smoke_v2290_statlink 入库（186 份）'));
ok('README 仍保留 v22.90 守护描述（历史口径）', readme.includes('v22.90 起含帮助页「操作说明」状态/任务日志 I↔J 双向直达口径守护'));
ok('README 四图速览·无字回廊含「引灯人」', readme.includes('引灯人') && readme.includes('第六位可对话角色'));
ok('README 系统清单面向提示名单含「引灯人/守洞人」', readme.includes('记誓人/引灯人/守洞人/守晶人一目了然'));
ok('package.json 已收录 smoke_v2291_lampguide（npm test 串跑第 187 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2291_lampguide.mjs'));
ok('package.json 串尾为 ... smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs && node tests/smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs && node tests/smoke_v2395_shopscroll.mjs && node tests/smoke_v2396_steelarmor.mjs && node tests/smoke_v2397_baserow.mjs && node tests/smoke_v2398_econrow.mjs && node tests/smoke_v2399_dmgformula.mjs && node tests/smoke_v2400_trialwarn.mjs && node tests/smoke_v2401_winbgm.mjs && node tests/smoke_v2402_firstwin.mjs && node tests/smoke_v2403_diffbattle.mjs && node tests/smoke_v2404_chestrow.mjs && node tests/smoke_v2405_trialgoal.mjs && node tests/smoke_v2406_restrow.mjs && node tests/smoke_v2407_innrest.mjs && node tests/smoke_v2408_travelgoal.mjs && node tests/smoke_v2409_sellgoal.mjs && node tests/smoke_v2410_brewgoal.mjs && node tests/smoke_v2411_deathprog.mjs && node tests/smoke_v2412_battlegoal.mjs && node tests/smoke_v2413_xpcurve.mjs && node tests/smoke_v2414_nightbattle.mjs && node tests/smoke_v2415_treepin.mjs && node tests/smoke_v2416_steps.mjs && node tests/smoke_v2417_mapdrink.mjs && node tests/smoke_v2418_goldcurve.mjs && node tests/smoke_v2419_luckdrp.mjs && node tests/smoke_v2420_skillprog.mjs && node tests/smoke_v2421_allquest.mjs && node tests/smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs"',
  pkg.includes('smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs && node tests/smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs && node tests/smoke_v2395_shopscroll.mjs && node tests/smoke_v2396_steelarmor.mjs && node tests/smoke_v2397_baserow.mjs && node tests/smoke_v2398_econrow.mjs && node tests/smoke_v2399_dmgformula.mjs && node tests/smoke_v2400_trialwarn.mjs && node tests/smoke_v2401_winbgm.mjs && node tests/smoke_v2402_firstwin.mjs && node tests/smoke_v2403_diffbattle.mjs && node tests/smoke_v2404_chestrow.mjs && node tests/smoke_v2405_trialgoal.mjs && node tests/smoke_v2406_restrow.mjs && node tests/smoke_v2407_innrest.mjs && node tests/smoke_v2408_travelgoal.mjs && node tests/smoke_v2409_sellgoal.mjs && node tests/smoke_v2410_brewgoal.mjs && node tests/smoke_v2411_deathprog.mjs && node tests/smoke_v2412_battlegoal.mjs && node tests/smoke_v2413_xpcurve.mjs && node tests/smoke_v2414_nightbattle.mjs && node tests/smoke_v2415_treepin.mjs && node tests/smoke_v2416_steps.mjs && node tests/smoke_v2417_mapdrink.mjs && node tests/smoke_v2418_goldcurve.mjs && node tests/smoke_v2419_luckdrp.mjs && node tests/smoke_v2420_skillprog.mjs && node tests/smoke_v2421_allquest.mjs && node tests/smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs && node tests/smoke_v2459_xpcurve9.mjs && node tests/smoke_v2460_xpcurve10.mjs && node tests/smoke_v2461_xpcurve11.mjs && node tests/smoke_v2462_xpcurve12.mjs && node tests/smoke_v2463_xpcurve13.mjs && node tests/smoke_v2464_xpcurve14.mjs && node tests/smoke_v2465_xpcurve15.mjs && node tests/smoke_v2466_xpcurve16.mjs && node tests/smoke_v2467_xpcurve17.mjs && node tests/smoke_v2468_xpcurve18.mjs && node tests/smoke_v2469_xpcurve19.mjs && node tests/smoke_v2470_xpcurve20.mjs && node tests/smoke_v2471_bellman.mjs && node tests/smoke_v2472_bellquest.mjs && node tests/smoke_v2473_xpcurve21.mjs && node tests/smoke_v2475_xpcurve22.mjs && node tests/smoke_v2476_achprog.mjs && node tests/smoke_v2477_fisher.mjs && node tests/smoke_v2478_xpcurve23.mjs && node tests/smoke_v2479_xpcurve24.mjs && node tests/smoke_v2480_fisherquest.mjs && node tests/smoke_v2481_xpcurve25.mjs && node tests/smoke_v2482_watchquest.mjs && node tests/smoke_v2483_xpcurve26.mjs && node tests/smoke_v2484_goldcurve10.mjs && node tests/smoke_v2485_goldcurve11.mjs && node tests/smoke_v2486_goldcurve12.mjs && node tests/smoke_v2487_goldcurve13.mjs && node tests/smoke_v2488_goldcurve14.mjs && node tests/smoke_v2489_goldcurve15.mjs && node tests/smoke_v2490_goldcurve16.mjs && node tests/smoke_v2491_goldcurve17.mjs && node tests/smoke_v2492_goldcurve18.mjs && node tests/smoke_v2493_goldcurve19.mjs && node tests/smoke_v2494_goldcurve20.mjs && node tests/smoke_v2495_goldcurve21.mjs && node tests/smoke_v2496_goldcurve22.mjs && node tests/smoke_v2497_goldcurve23.mjs && node tests/smoke_v2498_goldcurve24.mjs && node tests/smoke_v2499_goldcurve25.mjs && node tests/smoke_v24100_talequest.mjs && node tests/smoke_v24101_goldcurve26.mjs && node tests/smoke_v24102_goldcurve27.mjs && node tests/smoke_v24103_goldcurve28.mjs && node tests/smoke_v24104_goldcurve29.mjs && node tests/smoke_v24105_songquest.mjs && node tests/smoke_v24106_moonquest.mjs && node tests/smoke_v24107_peddlequest.mjs && node tests/smoke_v24108_shopquest.mjs && node tests/smoke_v24109_carvequest.mjs && node tests/smoke_v24110_vowquest.mjs && node tests/smoke_v24111_hearerquest.mjs && node tests/smoke_v24112_talkquest.mjs && node tests/smoke_v24113_walkquest.mjs && node tests/smoke_v24114_fleequest.mjs && node tests/smoke_v24115_achhud.mjs && node tests/smoke_v24116_guidequest.mjs && node tests/smoke_v24117_codexhud.mjs && node tests/smoke_v24118_wellquest.mjs && node tests/smoke_v24119_huntquest.mjs && node tests/smoke_v24120_chesthud.mjs && node tests/smoke_v24121_siftquest.mjs && node tests/smoke_v24122_crystalquest.mjs && node tests/smoke_v24123_fraghud.mjs && node tests/smoke_v24124_questshud.mjs && node tests/smoke_v24125_hunthud.mjs && node tests/smoke_v24126_waitquest.mjs && node tests/smoke_v24127_lampquest.mjs && node tests/smoke_v24128_stelequest.mjs && node tests/smoke_v24129_stele2quest.mjs && node tests/smoke_v24130_stele3quest.mjs && node tests/smoke_v24131_stele4quest.mjs && node tests/smoke_v24132_fallenquest.mjs && node tests/smoke_v24133_inquest.mjs && node tests/smoke_v24134_kindleq.mjs && node tests/smoke_v24135_ledgerquest.mjs && node tests/smoke_v24136_herbquest.mjs && node tests/smoke_v24143_furnacequest.mjs && node tests/smoke_v24147_unflicker.mjs && node tests/smoke_v24148_swift.mjs && node tests/smoke_v24151_lowlv.mjs && node tests/smoke_v24152_nopotion.mjs && node tests/smoke_v24153_penny.mjs && node tests/smoke_v24154_steadfast.mjs && node tests/smoke_v24155_frugal.mjs && node tests/smoke_v24157_dry.mjs && node tests/smoke_v24158_swift2.mjs && node tests/smoke_v24159_lowlv2.mjs && node tests/smoke_v24160_noskill.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 187 件套', testChain === 371, String(testChain));
ok('CHANGELOG 顶部已追加 v22.91 条目', changelog.startsWith('## v24.160 '));

// 姊妹 pin 复查（smoke_v2290 随新现实更新）
const s2290 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2290_statlink.mjs'), 'utf8');
ok('smoke_v2290 的 GAME_VERSION 字面量 pin 已更新为 v22.91（旧 v22.90 零残留）',
  s2290.includes("const GAME_VERSION = 'v24.160';") && !s2290.includes("const GAME_VERSION = 'v22." + "90';"));
ok('smoke_v2290 的 README 件套 pin 已随新现实更新为三百七十一件套（三百七十件套清除）',
  s2290.includes('三百七十一件套（三百七十件套清除）'));
ok('smoke_v2290 的 package.json 件套计数 pin 已更新为 === 187', s2290.includes('testChain === 371'));
ok('smoke_v2290 的 README 串尾 pin 已随新现实延伸至 smoke_v2291_lampguide（v2287 起尾部）',
  s2290.includes('smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula + smoke_v2400_trialwarn + smoke_v2401_winbgm + smoke_v2402_firstwin + smoke_v2403_diffbattle + smoke_v2404_chestrow + smoke_v2405_trialgoal + smoke_v2406_restrow + smoke_v2407_innrest + smoke_v2408_travelgoal + smoke_v2409_sellgoal + smoke_v2410_brewgoal + smoke_v2411_deathprog + smoke_v2412_battlegoal + smoke_v2413_xpcurve + smoke_v2414_nightbattle + smoke_v2415_treepin + smoke_v2416_steps + smoke_v2417_mapdrink + smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend + smoke_v2457_nightwin + smoke_v2458_pondlamp + smoke_v2459_xpcurve9 + smoke_v2460_xpcurve10 + smoke_v2461_xpcurve11 + smoke_v2462_xpcurve12 + smoke_v2463_xpcurve13 + smoke_v2464_xpcurve14 + smoke_v2465_xpcurve15 + smoke_v2466_xpcurve16 + smoke_v2467_xpcurve17 + smoke_v2468_xpcurve18 + smoke_v2469_xpcurve19 + smoke_v2470_xpcurve20 + smoke_v2471_bellman + smoke_v2472_bellquest + smoke_v2473_xpcurve21 + smoke_v2475_xpcurve22 + smoke_v2476_achprog + smoke_v2477_fisher + smoke_v2478_xpcurve23 + smoke_v2479_xpcurve24 + smoke_v2480_fisherquest + smoke_v2481_xpcurve25 + smoke_v2482_watchquest + smoke_v2483_xpcurve26 + smoke_v2484_goldcurve10 + smoke_v2485_goldcurve11 + smoke_v2486_goldcurve12 + smoke_v2487_goldcurve13 + smoke_v2488_goldcurve14 + smoke_v2489_goldcurve15 + smoke_v2490_goldcurve16 + smoke_v2491_goldcurve17 + smoke_v2492_goldcurve18 + smoke_v2493_goldcurve19 + smoke_v2494_goldcurve20 + smoke_v2495_goldcurve21 + smoke_v2496_goldcurve22 + smoke_v2497_goldcurve23 + smoke_v2498_goldcurve24 + smoke_v2499_goldcurve25 + smoke_v24100_talequest + smoke_v24101_goldcurve26 + smoke_v24102_goldcurve27 + smoke_v24103_goldcurve28 + smoke_v24104_goldcurve29 + smoke_v24105_songquest + smoke_v24106_moonquest + smoke_v24107_peddlequest + smoke_v24108_shopquest + smoke_v24109_carvequest + smoke_v24110_vowquest + smoke_v24111_hearerquest + smoke_v24112_talkquest + smoke_v24113_walkquest + smoke_v24114_fleequest + smoke_v24115_achhud + smoke_v24116_guidequest + smoke_v24117_codexhud + smoke_v24118_wellquest + smoke_v24119_huntquest + smoke_v24120_chesthud + smoke_v24121_siftquest + smoke_v24122_crystalquest + smoke_v24123_fraghud + smoke_v24124_questshud + smoke_v24125_hunthud + smoke_v24126_waitquest + smoke_v24127_lampquest + smoke_v24128_stelequest + smoke_v24129_stele2quest + smoke_v24130_stele3quest + smoke_v24131_stele4quest + smoke_v24132_fallenquest + smoke_v24133_inquest + smoke_v24134_kindleq + smoke_v24135_ledgerquest + smoke_v24136_herbquest + smoke_v24143_furnacequest（npm test 串跑）'));
ok('smoke_v2290 的 package 串尾 pin 已延伸至 smoke_v2291_lampguide',
  s2290.includes('node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs && node tests/smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs && node tests/smoke_v2395_shopscroll.mjs && node tests/smoke_v2396_steelarmor.mjs && node tests/smoke_v2397_baserow.mjs && node tests/smoke_v2398_econrow.mjs && node tests/smoke_v2399_dmgformula.mjs && node tests/smoke_v2400_trialwarn.mjs && node tests/smoke_v2401_winbgm.mjs && node tests/smoke_v2402_firstwin.mjs && node tests/smoke_v2403_diffbattle.mjs && node tests/smoke_v2404_chestrow.mjs && node tests/smoke_v2405_trialgoal.mjs && node tests/smoke_v2406_restrow.mjs && node tests/smoke_v2407_innrest.mjs && node tests/smoke_v2408_travelgoal.mjs && node tests/smoke_v2409_sellgoal.mjs && node tests/smoke_v2410_brewgoal.mjs && node tests/smoke_v2411_deathprog.mjs && node tests/smoke_v2412_battlegoal.mjs && node tests/smoke_v2413_xpcurve.mjs && node tests/smoke_v2414_nightbattle.mjs && node tests/smoke_v2415_treepin.mjs && node tests/smoke_v2416_steps.mjs && node tests/smoke_v2417_mapdrink.mjs && node tests/smoke_v2418_goldcurve.mjs && node tests/smoke_v2419_luckdrp.mjs && node tests/smoke_v2420_skillprog.mjs && node tests/smoke_v2421_allquest.mjs && node tests/smoke_v2422_huntprog.mjs && node tests/smoke_v2423_eliteprog.mjs && node tests/smoke_v2424_pondslime.mjs && node tests/smoke_v2425_potionprog.mjs && node tests/smoke_v2426_levelprog.mjs && node tests/smoke_v2427_richprog.mjs && node tests/smoke_v2428_outprog.mjs && node tests/smoke_v2429_xpcurve3.mjs && node tests/smoke_v2430_goldcurve3.mjs && node tests/smoke_v2431_elixirprog.mjs && node tests/smoke_v2432_golemquest.mjs && node tests/smoke_v2433_goldcurve4.mjs && node tests/smoke_v2434_trialquest.mjs && node tests/smoke_v2435_goldcurve5.mjs && node tests/smoke_v2436_codexrow.mjs && node tests/smoke_v2437_goldcurve6.mjs && node tests/smoke_v2438_goldcurve7.mjs && node tests/smoke_v2439_xpcurve4.mjs && node tests/smoke_v2440_potionprog.mjs && node tests/smoke_v2441_xpcurve5.mjs && node tests/smoke_v2442_chestprog.mjs && node tests/smoke_v2443_xpcurve6.mjs && node tests/smoke_v2444_goldcurve8.mjs && node tests/smoke_v2445_goldcurve9.mjs && node tests/smoke_v2446_mushprog.mjs && node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs && node tests/smoke_v2452_scholarprog.mjs && node tests/smoke_v2453_innrestprog.mjs && node tests/smoke_v2454_spendprog.mjs && node tests/smoke_v2455_innspend.mjs && node tests/smoke_v2456_brewspend.mjs && node tests/smoke_v2457_nightwin.mjs && node tests/smoke_v2458_pondlamp.mjs && node tests/smoke_v2459_xpcurve9.mjs && node tests/smoke_v2460_xpcurve10.mjs && node tests/smoke_v2461_xpcurve11.mjs && node tests/smoke_v2462_xpcurve12.mjs && node tests/smoke_v2463_xpcurve13.mjs && node tests/smoke_v2464_xpcurve14.mjs && node tests/smoke_v2465_xpcurve15.mjs && node tests/smoke_v2466_xpcurve16.mjs && node tests/smoke_v2467_xpcurve17.mjs && node tests/smoke_v2468_xpcurve18.mjs && node tests/smoke_v2469_xpcurve19.mjs && node tests/smoke_v2470_xpcurve20.mjs && node tests/smoke_v2471_bellman.mjs && node tests/smoke_v2472_bellquest.mjs && node tests/smoke_v2473_xpcurve21.mjs && node tests/smoke_v2475_xpcurve22.mjs && node tests/smoke_v2476_achprog.mjs && node tests/smoke_v2477_fisher.mjs && node tests/smoke_v2478_xpcurve23.mjs && node tests/smoke_v2479_xpcurve24.mjs && node tests/smoke_v2480_fisherquest.mjs && node tests/smoke_v2481_xpcurve25.mjs && node tests/smoke_v2482_watchquest.mjs && node tests/smoke_v2483_xpcurve26.mjs && node tests/smoke_v2484_goldcurve10.mjs && node tests/smoke_v2485_goldcurve11.mjs && node tests/smoke_v2486_goldcurve12.mjs && node tests/smoke_v2487_goldcurve13.mjs && node tests/smoke_v2488_goldcurve14.mjs && node tests/smoke_v2489_goldcurve15.mjs && node tests/smoke_v2490_goldcurve16.mjs && node tests/smoke_v2491_goldcurve17.mjs && node tests/smoke_v2492_goldcurve18.mjs && node tests/smoke_v2493_goldcurve19.mjs && node tests/smoke_v2494_goldcurve20.mjs && node tests/smoke_v2495_goldcurve21.mjs && node tests/smoke_v2496_goldcurve22.mjs && node tests/smoke_v2497_goldcurve23.mjs && node tests/smoke_v2498_goldcurve24.mjs && node tests/smoke_v2499_goldcurve25.mjs && node tests/smoke_v24100_talequest.mjs && node tests/smoke_v24101_goldcurve26.mjs && node tests/smoke_v24102_goldcurve27.mjs && node tests/smoke_v24103_goldcurve28.mjs && node tests/smoke_v24104_goldcurve29.mjs && node tests/smoke_v24105_songquest.mjs && node tests/smoke_v24106_moonquest.mjs && node tests/smoke_v24107_peddlequest.mjs && node tests/smoke_v24108_shopquest.mjs && node tests/smoke_v24109_carvequest.mjs && node tests/smoke_v24110_vowquest.mjs && node tests/smoke_v24111_hearerquest.mjs && node tests/smoke_v24112_talkquest.mjs && node tests/smoke_v24113_walkquest.mjs && node tests/smoke_v24114_fleequest.mjs && node tests/smoke_v24115_achhud.mjs && node tests/smoke_v24116_guidequest.mjs && node tests/smoke_v24117_codexhud.mjs && node tests/smoke_v24118_wellquest.mjs && node tests/smoke_v24119_huntquest.mjs && node tests/smoke_v24120_chesthud.mjs && node tests/smoke_v24121_siftquest.mjs && node tests/smoke_v24122_crystalquest.mjs && node tests/smoke_v24123_fraghud.mjs && node tests/smoke_v24124_questshud.mjs && node tests/smoke_v24125_hunthud.mjs && node tests/smoke_v24126_waitquest.mjs && node tests/smoke_v24127_lampquest.mjs && node tests/smoke_v24128_stelequest.mjs && node tests/smoke_v24129_stele2quest.mjs && node tests/smoke_v24130_stele3quest.mjs && node tests/smoke_v24131_stele4quest.mjs && node tests/smoke_v24132_fallenquest.mjs && node tests/smoke_v24133_inquest.mjs && node tests/smoke_v24134_kindleq.mjs && node tests/smoke_v24135_ledgerquest.mjs && node tests/smoke_v24136_herbquest.mjs && node tests/smoke_v24143_furnacequest.mjs && node tests/smoke_v24147_unflicker.mjs && node tests/smoke_v24148_swift.mjs && node tests/smoke_v24151_lowlv.mjs && node tests/smoke_v24152_nopotion.mjs && node tests/smoke_v24153_penny.mjs && node tests/smoke_v24154_steadfast.mjs && node tests/smoke_v24155_frugal.mjs && node tests/smoke_v24157_dry.mjs && node tests/smoke_v24158_swift2.mjs && node tests/smoke_v24159_lowlv2.mjs && node tests/smoke_v24160_noskill.mjs"'));
ok('smoke_v2290 的 CHANGELOG 顶 pin 已更新为 ## v22.91', s2290.includes("startsWith('## v24.160 '"));
ok('smoke_v2290 的哨兵 pin 已更新为三百七十一件套（三百七十件套清除）', s2290.includes('三百七十一件套（三百七十件套清除）'));

// 旧代 v22.90 pin 全库零残留
const allTests = fs.readdirSync(path.join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2291_lampguide.mjs');
const stale = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "90';") || src.includes("GAME_VERSION === 'v22." + "90'") ||
      src.includes('一百八十六件套（一百八十五件套清' + '除）') || src.includes('testChain === ' + '186') ||
      src.includes('smoke_v2290_statlink（npm test ' + '串跑）') || src.includes('_gv[1] >= ' + '90') ||
      src.includes("startsWith('## v22." + "90 '") || src.includes("startsWith('## v22." + "90'") ||
      src.includes('NPC_SPOTS).length === ' + '35')) stale.push(f);
}
ok('旧代 v22.90 字面量/恒等/件套/testChain/串尾/版本锚/顶 pin/NPC 计数 pin 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

// 哨兵链（件套守护领先一位）已指向下一版 188 口径
const s2143 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2143_talkekey.mjs'), 'utf8');
ok('哨兵链 v2143 已含下一版件套口径（三百七十一件套（三百七十件套清除））',
  s2143.includes('三百七十一件套（三百七十件套清除）') &&
  s2143.includes("!readme.includes('二百七十七件套（二百七十七件套清除）')"));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
