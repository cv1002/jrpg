// v22.31 专项冒烟：潮灯镇新风味 NPC「锻灯师」——内容扩充（v22.31 纯风味；v24.32 起升格为支线委托人
// 「石心的试炼」，零结算、零新逻辑）：
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
  dSrc.includes("const GAME_VERSION = 'v24.56';") && !dSrc.includes("const GAME_VERSION = 'v22." + "30';"));
ok('data.js 仍保留 v22.30 历史注释（累积注释块，姊妹 pin 不失效）', dSrc.includes('v22.30 暂停菜单「未存档 + 槽位占位」提示'));

// —— 数据层：NPC_SPOTS 全局坐标键（跨地图共用，不得撞车）——
ok('NPC_SPOTS[7,11]===smith', NPC_SPOTS['7,11'] === 'smith', NPC_SPOTS['7,11']);
ok('smith 仅占一个坐标键（无重复映射）', Object.keys(NPC_SPOTS).filter((k) => NPC_SPOTS[k] === 'smith').length === 1);
ok('NPC_SPOTS 总数 29（既有 28 键 + 锻灯师 1 键，v22.31 随新现实更新）', Object.keys(NPC_SPOTS).length === 38, Object.keys(NPC_SPOTS).length);
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

// —— 选段（npcQuestPages 运行期求值；v24.32 起锻灯师为新支线「石心的试炼」委托人 → 任务四档优先，
// 原 lines 兜底闲聊与 trueBoss after 彩蛋并入 done 分档，承 v23.32 拾菇人 / v23.42 客栈老板娘 /
// v23.57 酿药师 / v24.24 掌灯阿婆「风味 NPC 升格为支线委托人」同款先例，零内容丢失）——
const p0 = npcQuestPages({}, 'smith');
ok('新档选段为任务 offer 页（锻灯师 · 试金石 · 石心魔像）',
  p0 && p0[0].some((ln) => ln.includes('锻灯师')) && p0[0].some((ln) => ln.includes('试金石')) &&
  p0[0].some((ln) => ln.includes('石心魔像')), p0 && p0[0] && p0[0][0]);
const pD = npcQuestPages({ quests: { side_golem: 'done' } }, 'smith');
ok('done 默认档（锤砧齐了 · 灯记住路）', pD && pD[0].some((ln) => ln.includes('锤砧齐了')));
const pT = npcQuestPages({ trueBoss: true, quests: { side_golem: 'done' } }, 'smith');
ok('done trueBoss 档（after 彩蛋并入：灯芯全亮回来了 + 铁锤归我管）',
  pT && pT.some((pg) => pg.some((ln) => ln.includes('亮回来了'))) &&
  pT.some((pg) => pg.some((ln) => ln.includes('铁锤归我管'))));
ok('有可接委托：npcQuestMark===❕ 可接委托（v24.32 升格后不再是无任务 null）',
  npcQuestMark({ quests: {} }, 'smith') === '❕ 可接委托', npcQuestMark({ quests: {} }, 'smith'));
ok('resolveNpcTalk 已绑定支线（接取 → {kind:accept, id:side_golem}）',
  (await import('../js/quests.js')).resolveNpcTalk({ quests: {} }, 'smith').kind === 'accept');

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
ok('对话第 1 页为任务 offer 页（锻灯师 · 试金石）——v24.32 起 S.G 无任务槽 → offer 优先',
  Array.isArray(S.talkPages) && S.talkPages[0] && S.talkPages[0].some((ln) => ln.includes('试金石')));
ok('对话共 1 页（offer 页 4 行 · [Enter] 接下委托）', S.talkPages && S.talkPages.length === 1);
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
ok('README tests 树收录 smoke_v2231_smith 且位于串尾', readme.includes('smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend + smoke_v2238_starwell + smoke_v2239_minercart + smoke_v2240_tallgrass + smoke_v2241_gatearch + smoke_v2242_mushfield + smoke_v2243_encguide + smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula + smoke_v2400_trialwarn + smoke_v2401_winbgm + smoke_v2402_firstwin + smoke_v2403_diffbattle + smoke_v2404_chestrow + smoke_v2405_trialgoal + smoke_v2406_restrow + smoke_v2407_innrest + smoke_v2408_travelgoal + smoke_v2409_sellgoal + smoke_v2410_brewgoal + smoke_v2411_deathprog + smoke_v2412_battlegoal + smoke_v2413_xpcurve + smoke_v2414_nightbattle + smoke_v2415_treepin + smoke_v2416_steps + smoke_v2417_mapdrink + smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend（npm test 串跑）'));
ok('README tests 树尾链完整（v2230_pausewarn 未被新尾吞并，全链连到 smoke_v2231_smith）',
  readme.includes('smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend + smoke_v2238_starwell + smoke_v2239_minercart + smoke_v2240_tallgrass + smoke_v2241_gatearch + smoke_v2242_mushfield + smoke_v2243_encguide + smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula + smoke_v2400_trialwarn + smoke_v2401_winbgm + smoke_v2402_firstwin + smoke_v2403_diffbattle + smoke_v2404_chestrow + smoke_v2405_trialgoal + smoke_v2406_restrow + smoke_v2407_innrest + smoke_v2408_travelgoal + smoke_v2409_sellgoal + smoke_v2410_brewgoal + smoke_v2411_deathprog + smoke_v2412_battlegoal + smoke_v2413_xpcurve + smoke_v2414_nightbattle + smoke_v2415_treepin + smoke_v2416_steps + smoke_v2417_mapdrink + smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend（npm test 串跑）'));
ok('README 件套口径为二百八十件套（二百七十九件套清除）',
  readme.includes('冒烟二百八十件套（二百七十九件套清除）') && !readme.includes('冒烟一百二十六件套（一百二十五件套清' + '除）'));
ok('README 含 v22.31 守护描述（潮灯镇锻灯师新 NPC）', readme.includes('v22.31 起含潮灯镇锻灯师新 NPC 守护'));
ok('README 含 smoke_v2231_smith 入库（128 份）', readme.includes('smoke_v2231_smith 入库（128 份）'));
ok('README 四图速览/系统清单含「锻灯师」', readme.includes('锻灯师'));
ok('package.json 已收录 smoke_v2231_smith（npm test 串跑第 127 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2231_smith.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 127 件套', testChain === 280, String(testChain));
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
ok('smoke_v2230 的 GAME_VERSION 字面量 pin 已更新为 v22.31', s2230.includes("const GAME_VERSION = 'v24.56';"));
ok('smoke_v2230 的 README 件套 pin 已随新现实更新为二百八十件套（二百七十九件套清除）',
  s2230.includes('二百八十件套（二百七十九件套清除）'));
ok('smoke_v2230 的 README 树尾 pin 已更新为 + smoke_v2231_smith',
  s2230.includes('smoke_v2229_metall\\.mjs && node tests\\/smoke_v2230_pausewarn\\.mjs && node tests\\/smoke_v2231_smith\\.mjs && node tests\\/smoke_v2232_travelsup\\.mjs && node tests\\/smoke_v2233_nameflavor\\.mjs && node tests\\/smoke_v2234_innkeeper\\.mjs && node tests\\/smoke_v2235_minimapquest\\.mjs && node tests\\/smoke_v2236_villagelamp\\.mjs && node tests\\/smoke_v2237_minimaplegend\\.mjs && node tests\\/smoke_v2238_starwell\\.mjs && node tests\\/smoke_v2239_minercart\\.mjs && node tests\\/smoke_v2240_tallgrass\\.mjs && node tests\\/smoke_v2241_gatearch.mjs && node tests\\/smoke_v2242_mushfield.mjs && node tests\\/smoke_v2243_encguide.mjs && node tests\\/smoke_v2244_fulldanger.mjs && node tests\\/smoke_v2245_watcher.mjs && node tests\\/smoke_v2246_fountgauge.mjs && node tests\\/smoke_v2247_villagewell.mjs && node tests\\/smoke_v2248_mapguide.mjs && node tests\\/smoke_v2249_shopkeep.mjs && node tests\\/smoke_v2250_brewer.mjs && node tests\\/smoke_v2251_oathkeep.mjs && node tests\\/smoke_v2252_rail.mjs && node tests\\/smoke_v2253_supplypoint.mjs && node tests\\/smoke_v2254_grainfield.mjs && node tests\\/smoke_v2255_steleglow.mjs && node tests\\/smoke_v2256_campfire.mjs && node tests\\/smoke_v2257_pondglow.mjs && node tests\\/smoke_v2258_potionhelp.mjs && node tests\\/smoke_v2259_sandpile.mjs && node tests\\/smoke_v2260_fountripple.mjs && node tests\\/smoke_v2261_rich3.mjs && node tests\\/smoke_v2262_crystal.mjs && node tests\\/smoke_v2263_ptime3.mjs && node tests\\/smoke_v2264_hunt3.mjs && node tests\\/smoke_v2265_lucky3.mjs && node tests\\/smoke_v2266_stock3.mjs && node tests\\/smoke_v2267_elixir3.mjs && node tests\\/smoke_v2268_brew3.mjs && node tests\\/smoke_v2269_mush3.mjs && node tests\\/smoke_v2270_outstep.mjs && node tests\\/smoke_v2271_outstep2.mjs && node tests\\/smoke_v2272_scholar2.mjs && node tests\\/smoke_v2273_seen5.mjs && node tests\\/smoke_v2274_seen2\\.mjs && node tests\\/smoke_v2275_codexempty\\.mjs && node tests\\/smoke_v2276_lampkid\\.mjs && node tests\\/smoke_v2277_pondhint\\.mjs && node tests\\/smoke_v2278_mushguide\\.mjs && node tests\\/smoke_v2279_lampwell\\.mjs && node tests\\/smoke_v2280_grainfield\\.mjs && node tests\\/smoke_v2281_starwell\\.mjs && node tests\\/smoke_v2282_archgate\\.mjs && node tests\\/smoke_v2283_menuekey\\.mjs && node tests\\/smoke_v2284_skillekey\\.mjs && node tests\\/smoke_v2285_winekey\\.mjs && node tests\\/smoke_v2286_titleekey\\.mjs && node tests\\/smoke_v2287_trueroute\\.mjs && node tests\\/smoke_v2288_scrollhint\\.mjs && node tests\\/smoke_v2289_winprog\\.mjs && node tests\\/smoke_v2290_statlink\\.mjs && node tests\\/smoke_v2291_lampguide\\.mjs && node tests\\/smoke_v2292_cavewatch\\.mjs && node tests\\/smoke_v2293_deadsave\\.mjs && node tests\\/smoke_v2294_crystalwatch\\.mjs && node tests\\/smoke_v2295_deadprog\\.mjs && node tests\\/smoke_v2296_endingprog\\.mjs && node tests\\/smoke_v2297_chestmid\\.mjs && node tests\\/smoke_v2298_encnum\\.mjs && node tests\\/smoke_v2299_crosslink\\.mjs && node tests\\/smoke_v2300_sidemore\\.mjs && node tests\\/smoke_v2301_eco\\.mjs && node tests\\/smoke_v2302_cmdprev\\.mjs && node tests\\/smoke_v2303_rushnum\\.mjs && node tests\\/smoke_v2304_achgoal\\.mjs && node tests\\/smoke_v2305_monnum\\.mjs && node tests\\/smoke_v2306_skillnum\\.mjs && node tests\\/smoke_v2307_bossnum\\.mjs && node tests\\/smoke_v2308_diffnum\\.mjs && node tests\\/smoke_v2309_questnum\\.mjs && node tests\\/smoke_v2310_diffsum\\.mjs && node tests\\/smoke_v2311_fragprev\\.mjs && node tests\\/smoke_v2312_voltitle\\.mjs && node tests\\/smoke_v2313_talkall\\.mjs && node tests\\/smoke_v2314_voices\\.mjs && node tests\\/smoke_v2315_talkfoot\\.mjs && node tests\\/smoke_v2316_voiceshead\\.mjs && node tests\\/smoke_v2317_pausemap\\.mjs && node tests\\/smoke_v2318_battlemap\\.mjs && node tests\\/smoke_v2319_deadloc\\.mjs && node tests\\/smoke_v2392_stariron\\.mjs && node tests\\/smoke_v2393_deadkey\\.mjs && node tests\\/smoke_v2394_fightback\\.mjs && node tests\\/smoke_v2395_shopscroll\\.mjs && node tests\\/smoke_v2396_steelarmor\\.mjs && node tests\\/smoke_v2397_baserow\\.mjs && node tests\\/smoke_v2398_econrow\\.mjs && node tests\\/smoke_v2399_dmgformula\\.mjs && node tests\\/smoke_v2400_trialwarn\\.mjs && node tests\\/smoke_v2401_winbgm\\.mjs && node tests\\/smoke_v2402_firstwin\\.mjs && node tests\\/smoke_v2403_diffbattle\\.mjs && node tests\\/smoke_v2404_chestrow\\.mjs && node tests\\/smoke_v2405_trialgoal\\.mjs && node tests\\/smoke_v2406_restrow\\.mjs && node tests\\/smoke_v2407_innrest\\.mjs && node tests\\/smoke_v2408_travelgoal\\.mjs && node tests\\/smoke_v2409_sellgoal\\.mjs && node tests\\/smoke_v2410_brewgoal\\.mjs && node tests\\/smoke_v2411_deathprog\\.mjs && node tests\\/smoke_v2412_battlegoal\\.mjs && node tests\\/smoke_v2413_xpcurve\\.mjs && node tests\\/smoke_v2414_nightbattle\\.mjs && node tests\\/smoke_v2415_treepin\\.mjs && node tests\\/smoke_v2416_steps\\.mjs && node tests\\/smoke_v2417_mapdrink\\.mjs && node tests\\/smoke_v2418_goldcurve\\.mjs && node tests\\/smoke_v2419_luckdrp\\.mjs && node tests\\/smoke_v2420_skillprog\\.mjs && node tests\\/smoke_v2421_allquest\\.mjs && node tests\\/smoke_v2422_huntprog\\.mjs && node tests\\/smoke_v2423_eliteprog\\.mjs && node tests\\/smoke_v2424_pondslime\\.mjs && node tests\\/smoke_v2425_potionprog\\.mjs && node tests\\/smoke_v2426_levelprog\\.mjs && node tests\\/smoke_v2427_richprog\\.mjs && node tests\\/smoke_v2428_outprog\\.mjs && node tests\\/smoke_v2429_xpcurve3\\.mjs && node tests\\/smoke_v2430_goldcurve3\\.mjs && node tests\\/smoke_v2431_elixirprog\\.mjs && node tests\\/smoke_v2432_golemquest\\.mjs && node tests\\/smoke_v2433_goldcurve4\\.mjs && node tests\\/smoke_v2434_trialquest\\.mjs && node tests\\/smoke_v2435_goldcurve5\\.mjs && node tests\\/smoke_v2436_codexrow\\.mjs && node tests\\/smoke_v2437_goldcurve6\\.mjs && node tests\\/smoke_v2438_goldcurve7\\.mjs && node tests\\/smoke_v2439_xpcurve4\\.mjs && node tests\\/smoke_v2440_potionprog\\.mjs && node tests\\/smoke_v2441_xpcurve5\\.mjs && node tests\\/smoke_v2442_chestprog\\\\ && node tests\\/smoke_v2443_xpcurve6\\\\.mjs'));
ok('smoke_v2230 的 package.json 件套计数 pin 已更新为 === 127', s2230.includes('testChain === 280'));
ok('smoke_v2229 的 GAME_VERSION 字面量 pin 已更新为 v22.31', s2229.includes("const GAME_VERSION = 'v24.56';"));
ok('smoke_v2229 的 GAME_VERSION 恒等 pin 已更新为 === v22.31', s2229.includes("GAME_VERSION === 'v24.56'"));
ok('smoke_v2229 的 README 件套 pin 已随新现实更新为二百八十件套（二百七十九件套清除）',
  s2229.includes('二百八十件套（二百七十九件套清除）'));
ok('smoke_v2229 的 README 树尾 pin 已更新为 + smoke_v2231_smith',
  s2229.includes('smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend + smoke_v2238_starwell + smoke_v2239_minercart + smoke_v2240_tallgrass + smoke_v2241_gatearch + smoke_v2242_mushfield + smoke_v2243_encguide + smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula + smoke_v2400_trialwarn + smoke_v2401_winbgm + smoke_v2402_firstwin + smoke_v2403_diffbattle + smoke_v2404_chestrow + smoke_v2405_trialgoal + smoke_v2406_restrow + smoke_v2407_innrest + smoke_v2408_travelgoal + smoke_v2409_sellgoal + smoke_v2410_brewgoal + smoke_v2411_deathprog + smoke_v2412_battlegoal + smoke_v2413_xpcurve + smoke_v2414_nightbattle + smoke_v2415_treepin + smoke_v2416_steps + smoke_v2417_mapdrink + smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend（npm test 串跑）'));
ok('smoke_v2229 的 package.json 件套计数 pin 已更新为 === 127', s2229.includes('testChain === 280'));
ok('smoke_v2228 的 GAME_VERSION 字面量 pin 已更新为 v22.31', s2228.includes("const GAME_VERSION = 'v24.56';"));
ok('smoke_v2228 的 README 树尾 pin 已更新为 + smoke_v2231_smith',
  s2228.includes('smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend + smoke_v2238_starwell + smoke_v2239_minercart + smoke_v2240_tallgrass + smoke_v2241_gatearch + smoke_v2242_mushfield + smoke_v2243_encguide + smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula + smoke_v2400_trialwarn + smoke_v2401_winbgm + smoke_v2402_firstwin + smoke_v2403_diffbattle + smoke_v2404_chestrow + smoke_v2405_trialgoal + smoke_v2406_restrow + smoke_v2407_innrest + smoke_v2408_travelgoal + smoke_v2409_sellgoal + smoke_v2410_brewgoal + smoke_v2411_deathprog + smoke_v2412_battlegoal + smoke_v2413_xpcurve + smoke_v2414_nightbattle + smoke_v2415_treepin + smoke_v2416_steps + smoke_v2417_mapdrink + smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend（npm test 串跑）'));
ok('smoke_v2227 的 README 树尾 pin 已更新为 + smoke_v2231_smith',
  s2227.includes('smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend + smoke_v2238_starwell + smoke_v2239_minercart + smoke_v2240_tallgrass + smoke_v2241_gatearch + smoke_v2242_mushfield + smoke_v2243_encguide + smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula + smoke_v2400_trialwarn + smoke_v2401_winbgm + smoke_v2402_firstwin + smoke_v2403_diffbattle + smoke_v2404_chestrow + smoke_v2405_trialgoal + smoke_v2406_restrow + smoke_v2407_innrest + smoke_v2408_travelgoal + smoke_v2409_sellgoal + smoke_v2410_brewgoal + smoke_v2411_deathprog + smoke_v2412_battlegoal + smoke_v2413_xpcurve + smoke_v2414_nightbattle + smoke_v2415_treepin + smoke_v2416_steps + smoke_v2417_mapdrink + smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend（npm test 串跑）'));
ok('smoke_v2226 的 GAME_VERSION 字面量 pin 已更新为 v22.31', s2226.includes("const GAME_VERSION = 'v24.56';"));
ok('smoke_v2226 的 README 件套 pin 已随新现实更新为二百八十件套（二百七十九件套清除）',
  s2226.includes('二百八十件套（二百七十九件套清除）'));
ok('smoke_v2225 的 README 树尾 pin 已更新为 + smoke_v2231_smith',
  s2225.includes('smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend + smoke_v2238_starwell + smoke_v2239_minercart + smoke_v2240_tallgrass + smoke_v2241_gatearch + smoke_v2242_mushfield + smoke_v2243_encguide + smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula + smoke_v2400_trialwarn + smoke_v2401_winbgm + smoke_v2402_firstwin + smoke_v2403_diffbattle + smoke_v2404_chestrow + smoke_v2405_trialgoal + smoke_v2406_restrow + smoke_v2407_innrest + smoke_v2408_travelgoal + smoke_v2409_sellgoal + smoke_v2410_brewgoal + smoke_v2411_deathprog + smoke_v2412_battlegoal + smoke_v2413_xpcurve + smoke_v2414_nightbattle + smoke_v2415_treepin + smoke_v2416_steps + smoke_v2417_mapdrink + smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7 + smoke_v2448_castprog + smoke_v2449_xpcurve8 + smoke_v2450_brewprog + smoke_v2451_sellprog + smoke_v2452_scholarprog + smoke_v2453_innrestprog + smoke_v2454_spendprog + smoke_v2455_innspend + smoke_v2456_brewspend（npm test 串跑）'));
ok('smoke_v2225 的 package.json 件套计数 pin 已更新为 === 127', s2225.includes('testChain === 280'));
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
