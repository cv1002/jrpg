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
// 本冒烟守护：版本锚点、全局坐标防撞（NPC_SPOTS 跨地图共用键、唯一映射、既有 35 键未动、全图 extras
// 扫描 (21,3) 仅 gallery 一处）、NPCS 契约（name/mark/lines 2 页/after 2 页/每页结构/[Enter] 收尾/
// 行宽预算/灯主题/祸乱形态预习同源/散尽彩蛋）、运行期（loadMap 落位 + 四邻可行走 + 祭坛 SB 零回归 +
// 同图 NPC/地标零回归 + Enter/E 真实交互开对话 + 默认与 trueBoss 两档选段）、npcQuestMark 无任务顶标、
// resolveNpcTalk 零任务契约、sprites 零改动（默认 mwVillager + 既有 lamp 分支）、README/package.json/
// CHANGELOG 同步（tests 树尾 + 件套口径 187 + v22.91 守护描述 + 入库 187 份）、姊妹件套 pin
// （smoke_v2290 随新现实更新）复查 + 旧代 v22.90 字面量/恒等/件套/串尾/版本锚/顶 pin 全库零残留 +
// 哨兵链 188 口径（v2143 领先一位）。
import { S } from '../js/state.js';
import { GAME_VERSION, NPCS, NPC_SPOTS, MAPS, TY, SOLID, SPECIES } from '../js/data.js';
import { npcQuestPages, npcQuestMark } from '../js/quests.js';
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
  dSrc.includes("const GAME_VERSION = 'v23.38';") && !dSrc.includes("const GAME_VERSION = 'v22." + "90';"));
ok('data.js 仍保留 v22.90/v22.89 世代注释链（历史注释未动）',
  dSrc.includes('// v22.90 体验打磨·可发现性·纯文字') && dSrc.includes('// v22.89 体验打磨·信息透明·纯显示'));

// —— 数据层：NPC_SPOTS 全局坐标键（跨地图共用，不得撞车）——
ok('NPC_SPOTS[21,3]===lampguide', NPC_SPOTS['21,3'] === 'lampguide', NPC_SPOTS['21,3']);
ok('lampguide 仅占一个坐标键（无重复映射）', Object.keys(NPC_SPOTS).filter((k) => NPC_SPOTS[k] === 'lampguide').length === 1);
ok('NPC_SPOTS 总数 36（既有 35 键 + 引灯人 1 键，v22.91 随新现实更新）', Object.keys(NPC_SPOTS).length === 38, Object.keys(NPC_SPOTS).length);
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

// —— 选段（npcQuestPages 运行期求值，无任务 → 直落 NPCS 数据）——
const p0 = npcQuestPages({}, 'lampguide');
ok('无旗标选段落到 lines（前路）', p0 && p0[0].some((ln) => ln.includes('前路')), p0 && p0[0][0]);
const pT = npcQuestPages({ trueBoss: true }, 'lampguide');
ok('trueBoss 走 after 彩蛋（送回灯下）',
  pT && pT.some((pg) => pg.some((ln) => ln.includes('送回灯下'))));
ok('无任务：npcQuestMark===null（无 ❕ 顶标）', npcQuestMark(S.G, 'lampguide') === null);
ok('无支线绑定 lampguide：resolveNpcTalk 不推进任何任务（纯风味零任务）',
  (await import('../js/quests.js')).resolveNpcTalk(S.G, 'lampguide') === null);

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
ok('对话第 1 页为 lines 默认台词（前路）——S.G 无旗标',
  Array.isArray(S.talkPages) && S.talkPages[0] && S.talkPages[0].some((ln) => ln.includes('前路')));
ok('对话共 2 页（第 1 页 [Enter] 继续 → 第 2 页 [Enter] 结束）', S.talkPages && S.talkPages.length === 2);
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
const TAIL = 'smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）';
ok('README tests 树已收录 smoke_v2291_lampguide 且位于串尾', readme.includes(TAIL));
const treeLine = readme.split('\n').find((l) => l.startsWith('├── tests/'));
ok('README tests 树含 smoke_v2291_lampguide 串尾且旧串尾零残留（树为历史清单，总数不守恒）',
  treeLine && treeLine.includes('+ smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）') &&
  !treeLine.includes('smoke_v2290_statlink（npm test 串跑）'));
ok('README 件套口径为二百一十二件套（二百一十一件套清除）且旧 186 口径零残留',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟一百八十六件套（一百八十五件套清' + '除）'));
ok('README 含 v22.91 守护描述（无字回廊终焉之神祭坛引灯人新 NPC）', readme.includes('v22.91 起含无字回廊终焉之神祭坛引灯人新 NPC 守护'));
ok('README 含 smoke_v2291_lampguide 入库（187 份）', readme.includes('smoke_v2291_lampguide 入库（187 份）'));
ok('README 仍保留 smoke_v2290_statlink 入库（186 份）历史口径', readme.includes('smoke_v2290_statlink 入库（186 份）'));
ok('README 仍保留 v22.90 守护描述（历史口径）', readme.includes('v22.90 起含帮助页「操作说明」状态/任务日志 I↔J 双向直达口径守护'));
ok('README 四图速览·无字回廊含「引灯人」', readme.includes('引灯人') && readme.includes('第六位可对话角色'));
ok('README 系统清单面向提示名单含「引灯人/守洞人」', readme.includes('记誓人/引灯人/守洞人/守晶人一目了然'));
ok('package.json 已收录 smoke_v2291_lampguide（npm test 串跑第 187 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2291_lampguide.mjs'));
ok('package.json 串尾为 ... smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"',
  pkg.includes('node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 187 件套', testChain === 212, String(testChain));
ok('CHANGELOG 顶部已追加 v22.91 条目', changelog.startsWith('## v23.38 '));

// 姊妹 pin 复查（smoke_v2290 随新现实更新）
const s2290 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2290_statlink.mjs'), 'utf8');
ok('smoke_v2290 的 GAME_VERSION 字面量 pin 已更新为 v22.91（旧 v22.90 零残留）',
  s2290.includes("const GAME_VERSION = 'v23.38';") && !s2290.includes("const GAME_VERSION = 'v22." + "90';"));
ok('smoke_v2290 的 README 件套 pin 已随新现实更新为二百一十二件套（二百一十一件套清除）',
  s2290.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2290 的 package.json 件套计数 pin 已更新为 === 187', s2290.includes('testChain === 212'));
ok('smoke_v2290 的 README 串尾 pin 已随新现实延伸至 smoke_v2291_lampguide（v2287 起尾部）',
  s2290.includes('smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2290 的 package 串尾 pin 已延伸至 smoke_v2291_lampguide',
  s2290.includes('node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
ok('smoke_v2290 的 CHANGELOG 顶 pin 已更新为 ## v22.91', s2290.includes("startsWith('## v23.38 '"));
ok('smoke_v2290 的哨兵 pin 已更新为二百一十二件套（二百一十一件套清除）', s2290.includes('二百一十二件套（二百一十一件套清除）'));

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
ok('哨兵链 v2143 已含下一版件套口径（二百一十二件套（二百一十一件套清除））',
  s2143.includes('二百一十三件套（二百一十二件套清除）') &&
  s2143.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
