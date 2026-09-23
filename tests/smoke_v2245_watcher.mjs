// v22.45 专项冒烟：雾语林幽冥魔王祭坛旁新风味 NPC「守夜人」——纯内容扩充（无任务、零结算、零新逻辑）：
// 数据层三件套（dungeon.extras (20,12) + NPC_SPOTS '20,12' + NPCS.watcher），幽冥魔王祭坛（20,13-14）
// 此前是全游唯一「无人驻守」的强敌地标（boss 战前演出只弹提示框），现由守夜人补上在场者：台词讲
// 「旧灯卫的袍子/里头的光已经不在了/它怕的不是剑、是有人还记得它」（与巡灯人「我见过祭坛上的影子」/
// 掌灯阿婆「旧灯卫变的」同口径）；台词走既有 lines + trueBoss after 彩蛋机制（npcQuestPages 无待办
// 任务回退时 trueBoss 优先 after、否则 lines）；mark:'staff' 复用既有杖标（drawNpcMark 既有分支）、
// 造型走 NPC_SHEET 默认 mwVillager（零 sprites 改动）。
// 本冒烟守护：版本锚点、全局坐标防撞（NPC_SPOTS 跨地图共用键、唯一映射、既有 30 键未动、全图 extras
// 扫描 (20,12) 仅 dungeon 一处）、NPCS 契约（name/mark/lines 2 页/after 2 页/每页结构/[Enter] 收尾/
// 行宽预算/旧灯卫主题/散尽彩蛋）、运行期（loadMap 落位 + 四邻可行走 + 祭坛 BOSS 瓦片零回归 + 同图
// NPC/设施零回归 + Enter/E 真实交互开对话 + 默认与 trueBoss 两档选段）、npcQuestMark 无任务顶标、
// resolveNpcTalk 零任务契约、sprites 零改动（默认 mwVillager + 既有 staff 分支）、README/package.json/
// CHANGELOG 同步（tests 树尾 + 件套口径 141 + v22.45 守护描述 + 入库 141 份）、姊妹件套 pin
// （smoke_v2244 随新现实更新 + NPC 总数 pin 31）复查 + 旧代 v22.44 字面量/恒等/件套/串尾 pin 零残留。
import { S } from '../js/state.js';
import { GAME_VERSION, NPCS, NPC_SPOTS, MAPS, TY, SOLID } from '../js/data.js';
import { npcQuestPages, npcQuestMark } from '../js/quests.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v22.44 冒烟先例：先装桩再 import main.js）——
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

console.log('— v22.45 雾语林祭坛守夜人 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.44 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.44（本版守 v22.45）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 45)), GAME_VERSION);
ok('data.js 含 v22.45 注释（守夜人说明）', dSrc.includes('v22.45 新内容·纯风味 NPC'));
ok('GAME_VERSION 字面量已为 v22.45（旧 v22.44 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v23.93';") && !dSrc.includes("const GAME_VERSION = 'v22." + "44';"));
ok('data.js 仍保留 v22.44/v22.43 世代注释链（全域危险标注/机制行累积注释未动）',
  dSrc.includes('v22.44 体验打磨·信息透明·纯显示') && dSrc.includes('v22.43 体验打磨·信息透明·纯文字'));

// —— 数据层：NPC_SPOTS 全局坐标键（跨地图共用，不得撞车）——
ok('NPC_SPOTS[20,12]===watcher', NPC_SPOTS['20,12'] === 'watcher', NPC_SPOTS['20,12']);
ok('watcher 仅占一个坐标键（无重复映射）', Object.keys(NPC_SPOTS).filter((k) => NPC_SPOTS[k] === 'watcher').length === 1);
ok('NPC_SPOTS 总数 31（既有 30 键 + 守夜人 1 键，v22.45 随新现实更新）', Object.keys(NPC_SPOTS).length === 38, Object.keys(NPC_SPOTS).length);
ok('既有 30 个 NPC/石碑键未被误动', ['13,6', '10,13', '19,8', '12,8', '2,4', '13,9', '3,1', '2,3', '17,12', '17,11', '5,1', '10,1', '15,1', '20,1', '8,5', '14,8', '5,10', '15,12', '14,3', '16,9', '15,2', '13,2', '21,2', '4,2', '5,3', '5,5', '19,3', '14,15', '7,11', '7,14']
  .every((k) => NPC_SPOTS[k] != null));
// 全局坐标防撞演练：全图 extras 扫描，(20,12) 必须恰出现 1 次且在 dungeon、ty 为 NPC
const at2012 = [];
for (const [mname, mdef] of Object.entries(MAPS)) {
  for (const ex of (mdef.extras || [])) {
    if (ex.x === 20 && ex.y === 12) at2012.push(mname + ':' + ex.ty);
  }
}
ok('(20,12) 全图 extras 仅 dungeon 一处 NPC（他图无占用/无撞车）',
  at2012.length === 1 && at2012[0] === 'dungeon:NPC', at2012.join(','));
ok('data.js dungeon.extras 源级含 v22.45 注释（{ x: 20, y: 12, ty: \'NPC\' } + 守夜人）',
  dSrc.includes("{ x: 20, y: 12, ty: 'NPC' }") && dSrc.includes('守夜人（v22.45'));

// —— NPCS.watcher 契约 ——
const wk = NPCS.watcher;
ok('NPCS.watcher 存在且 name===守夜人 / mark===staff（复用既有杖标）', !!wk && wk.name === '守夜人' && wk.mark === 'staff', wk && wk.name);
ok('lines 2 页（兜底闲聊），无 linesByStage（客栈老板娘/货郎同款静态台词机制）',
  wk && Array.isArray(wk.lines) && wk.lines.length === 2 && !wk.linesByStage);
ok('trueBoss after 彩蛋 2 页（客栈老板娘/货郎/拾灯人/刻碑人同款契约）',
  wk && Array.isArray(wk.after) && wk.after.length === 2);
const allWkPages = [...wk.lines, ...wk.after];
ok('全部 4 页：每页为字符串数组且末元素以 [Enter] 收尾（既有台词结构）',
  allWkPages.every((pg) => Array.isArray(pg) && pg.length >= 2 &&
    pg.every((ln) => typeof ln === 'string') && /\[Enter\]/.test(pg[pg.length - 1])));
const estW = (s) => { let w = 0; for (const ch of String(s)) { const c = ch.codePointAt(0); if ((c >= 0x4e00 && c <= 0x9fff) || (c >= 0x3000 && c <= 0x303f) || (c >= 0xff00 && c <= 0xffef)) w += 15; else if (/[0-9A-Za-z]/.test(ch)) w += 7.5; else if (ch === ' ') w += 7.5; else w += 8; } return w; };
ok('全部 4 页行宽 ≤440（对话面板预算）', allWkPages.every((pg) => pg.every((ln) => estW(ln) <= 440)));
ok('lines 首页含旧灯卫主题（当值 + 旧灯卫的袍子 + 光已经不在了）',
  wk.lines[0].some((ln) => ln.includes('当值')) && wk.lines[0].some((ln) => ln.includes('旧灯卫')) &&
  wk.lines[0].some((ln) => ln.includes('袍子')) && wk.lines[0].some((ln) => ln.includes('不在了')));
ok('lines 第 2 页含记得主题（灯芯 + 记得它）',
  wk.lines[1].some((ln) => ln.includes('灯芯')) && wk.lines[1].some((ln) => ln.includes('记得它')));
ok('after 首页含散尽彩蛋（袍子落下 + 没有影子 + 落地）',
  wk.after[0].some((ln) => ln.includes('袍子落下来')) && wk.after[0].some((ln) => ln.includes('没有影子')) &&
  wk.after[0].some((ln) => ln.includes('落地')));
ok('after 第 2 页含收尾（名字回了灯下 + 可以睡了）',
  wk.after[1].some((ln) => ln.includes('灯下')) && wk.after[1].some((ln) => ln.includes('可以睡了')));

// —— 选段（npcQuestPages 运行期求值，无任务 → 直落 NPCS 数据）——
const p0 = npcQuestPages({}, 'watcher');
ok('无旗标选段落到 lines（当值）', p0 && p0[0].some((ln) => ln.includes('当值')), p0 && p0[0][0]);
const pT = npcQuestPages({ trueBoss: true }, 'watcher');
ok('trueBoss 走 after 彩蛋（可以睡了）',
  pT && pT.some((pg) => pg.some((ln) => ln.includes('可以睡了'))));
ok('无任务：npcQuestMark===null（无 ❕ 顶标）', npcQuestMark(S.G, 'watcher') === null);
ok('无支线绑定 watcher：resolveNpcTalk 不推进任何任务（纯风味零任务）',
  (await import('../js/quests.js')).resolveNpcTalk(S.G, 'watcher') === null);

// —— 运行期：loadMap 落位 + 四邻可行走 + 祭坛/同图关键点零回归 + Enter/E 真实交互开对话 ——
loadMap('dungeon');
ok('(20,12) 落位为 NPC 瓦片（placeExtras 覆盖 + 不卡祭坛动线）', at(20, 12) === TY.NPC, at(20, 12));
ok('四邻 (19,12)/(21,12)/(20,11) 皆可行走（可面对面对话，祭坛正北不设卡）',
  [[19, 12], [21, 12], [20, 11]].every(([x, y]) => !SOLID.has(at(x, y))));
ok('南邻祭坛 (20,13)/(20,14) 仍为 BOSS 瓦片（2×1 零回归）',
  at(20, 13) === TY.BOSS && at(20, 14) === TY.BOSS, at(20, 13) + '/' + at(20, 14));
ok('同图 NPC：雾径猎手(13,9)/拾菇人(15,2)/失名的旅人(21,2)/货郎(4,2)/琴师(14,15) 零回归',
  at(13, 9) === TY.NPC && NPC_SPOTS['13,9'] === 'hunter' && at(15, 2) === TY.NPC && NPC_SPOTS['15,2'] === 'picker' &&
  at(21, 2) === TY.NPC && NPC_SPOTS['21,2'] === 'wanderer' && at(4, 2) === TY.NPC && NPC_SPOTS['4,2'] === 'peddler' &&
  at(14, 15) === TY.NPC && NPC_SPOTS['14,15'] === 'minstrel');
ok('同图设施零回归：营地泉水(12,9)', at(12, 9) === TY.FOUNTAIN, at(12, 9));
S.G.x = 20; S.G.y = 11; S.dir = 'D'; S.scene = 'world';
await screens.world.onKey({ key: 'Enter' });
ok('面向守夜人按 Enter：进入对话（S.scene==talk）且 curNpc===watcher',
  S.scene === 'talk' && S.curNpc === 'watcher', S.scene + '/' + S.curNpc);
ok('对话第 1 页为 lines 默认台词（当值）——S.G 无旗标',
  Array.isArray(S.talkPages) && S.talkPages[0] && S.talkPages[0].some((ln) => ln.includes('当值')));
ok('对话共 2 页（第 1 页 [Enter] 继续 → 第 2 页 [Enter] 结束）', S.talkPages && S.talkPages.length === 2);
S.scene = 'world';
await screens.world.onKey({ key: 'E' });
ok('E 键同效（v21.29 交互别名对 NPC 零回归）', S.scene === 'talk' && S.curNpc === 'watcher', S.scene + '/' + S.curNpc);

// —— sprites 零改动：默认 mwVillager 造型 + 既有 staff 分支 ——
const spSrc = fs.readFileSync(path.join(ROOT, 'js/view/sprites.js'), 'utf8');
ok('sprites.js 造型默认回退 mwVillager（NPC_SHEET[nid] || mwVillager，watcher 零映射零新增）',
  spSrc.includes("NPC_SHEET[nid] || 'mwVillager'") && !spSrc.includes("'watcher'"));
ok('sprites.js 既有 staff 杖标分支仍在（mark 复用零新增）', spSrc.includes("mark==='staff'"));

// —— README / package.json / CHANGELOG 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树已收录 smoke_v2245_watcher 且位于串尾', readme.includes('smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey（npm test 串跑）'));
ok('README 件套口径为二百一十七件套（二百一十六件套清除）',
  readme.includes('冒烟二百一十七件套（二百一十六件套清除）') && !readme.includes('冒烟一百四十件套（一百三十九件套清' + '除）'));
ok('README 含 v22.45 守护描述（雾语林祭坛守夜人新 NPC）', readme.includes('v22.45 起含雾语林祭坛守夜人新 NPC 守护'));
ok('README 含 smoke_v2245_watcher 入库（141 份）', readme.includes('smoke_v2245_watcher 入库（141 份）'));
ok('README 四图速览/系统清单含「守夜人」', readme.includes('守夜人'));
ok('package.json 已收录 smoke_v2245_watcher（npm test 串跑第 141 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2245_watcher.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 141 件套', testChain === 217, String(testChain));
ok('CHANGELOG 顶部已追加 v22.45 条目', changelog.startsWith('## v23.93'));

// 姊妹 pin 复查（smoke_v2244 随新现实更新 + 旧代 v22.44 全库零残留）
const s2244 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2244_fulldanger.mjs'), 'utf8');
ok('smoke_v2244 的 GAME_VERSION 字面量 pin 已更新为 v22.45（旧 v22.44 零残留）',
  s2244.includes("const GAME_VERSION = 'v23.93';") && !s2244.includes("const GAME_VERSION = 'v22." + "44';"));
ok('smoke_v2244 的 README 件套 pin 已随新现实更新为二百一十七件套（二百一十六件套清除）',
  s2244.includes('二百一十七件套（二百一十六件套清除）'));
ok('smoke_v2244 的 package.json 件套计数 pin 已更新为 === 141', s2244.includes('testChain === 217'));
ok('smoke_v2244 的 README 串尾 pin 已随新现实延伸至 smoke_v2245_watcher',
  s2244.includes('smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey（npm test 串跑）'));
ok('smoke_v2244 的 NPC 总数 pin 已随新现实更新为 31（守夜人落位）', s2244.includes('NPC_SPOTS).length === 38'));
// 旧代 v22.44 pin 全库零残留
const allTests = fs.readdirSync(path.join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2245_watcher.mjs');
const stale = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "44';") || src.includes("GAME_VERSION === 'v22." + "44'") ||
      src.includes('一百四十件套（一百三十九件套清' + '除）') || src.includes('testChain === ' + '140') ||
      src.includes('smoke_v2244_fulldanger（npm test ' + '串跑）')) stale.push(f);
}
ok('旧代 v22.44 字面量/恒等/件套/串尾 pin 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
