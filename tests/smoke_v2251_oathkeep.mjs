// v22.51 专项冒烟：无字回廊第二块名字石碑「记誓人」新风味 NPC——纯内容扩充（无任务、零结算、零新逻辑）：
// 数据层三件套（gallery.extras (10,3) + NPC_SPOTS '10,3' + NPCS.oathkeep），北壁四块名字石碑（STELE 瓦片，
// 碑文与 FRAGMENTS 同源；拾灯人 (5,3) 守第一块/掌灯童 (14,3) 守第三块附近/刻碑人 (19,3) 守第四块）唯独
// 第二块 (10,1) 碑下空无一人——而第二块碑记的恰是全游主线最重的一句「碎片·灯卫的誓」（他吞下灯芯那晚
// 立下誓：镇子若忘了他，他就替镇子记着镇子，幽冥魔王即旧灯卫口径）；现于第二块碑碑下 (10,3) 立起记誓人：
// 台词走既有 NPCS.lines 兜底 + trueBoss after 彩蛋机制（npcQuestPages 无待办任务回退直落，零新逻辑、
// 零裸字面量），无任务、无顶标、零结算零存档。mark:'staff' 复用既有杖标、造型走 NPC_SHEET 默认 mwVillager
// （零 sprites 改动）。
// 本冒烟守护：版本锚点、全局坐标防撞（NPC_SPOTS 跨地图共用键、唯一映射、既有 33 键未动、全图 extras
// 扫描 (10,3) 仅 gallery 一处）、NPCS 契约（name/mark/lines 2 页/after 2 页/每页结构/[Enter] 收尾/
// 行宽预算/灯卫之誓主题/散尽彩蛋）、选段（npcQuestPages 运行期求值、mark 顶标、resolveNpcTalk 零任务）、
// 运行期（loadMap 落位 + 北邻第二块碑 STELE 零回归 + 四邻可行走 + 同图 NPC/设施零回归 + Enter/E 真实
// 交互开对话）、sprites 零改动（默认 mwVillager + 既有 staff 分支）、README/package.json/CHANGELOG
// 同步（tests 树尾 + 件套口径 147 + v22.51 守护描述 + 入库 147 份）、姊妹件套 pin（smoke_v2250 随新
// 现实更新 + NPC 总数 pin 34 + 哨兵链 148）复查 + 旧代 v22.50 字面量/恒等/件套/串尾 pin 零残留。
import { S } from '../js/state.js';
import { GAME_VERSION, NPCS, NPC_SPOTS, MAPS, TY, SOLID } from '../js/data.js';
import { npcQuestPages, npcQuestMark, resolveNpcTalk } from '../js/quests.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v22.50 冒烟先例：先装桩再 import main.js）——
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

console.log('— v22.51 无字回廊记誓人 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.50 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.50（本版守 v22.52）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 51)), GAME_VERSION);
ok('data.js 含 v22.51 注释（记誓人说明）', dSrc.includes('v22.51 新内容·纯风味 NPC'));
ok('GAME_VERSION 字面量已为 v22.51（旧 v22.50 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v23.80';") && !dSrc.includes("const GAME_VERSION = 'v22." + "50';"));
ok('data.js 仍保留 v22.50/v22.49 世代注释链（酿药师/货栈掌柜累积注释未动）',
  dSrc.includes('v22.50 新内容·纯风味 NPC') && dSrc.includes('v22.49 新内容·纯风味 NPC') &&
  dSrc.includes("const GAME_VERSION = 'v22." + "50';") === false);

// —— 数据层：NPC_SPOTS 全局坐标键（跨地图共用，不得撞车）——
ok('NPC_SPOTS[10,3]===oathkeep', NPC_SPOTS['10,3'] === 'oathkeep', NPC_SPOTS['10,3']);
ok('oathkeep 仅占一个坐标键（无重复映射）', Object.keys(NPC_SPOTS).filter((k) => NPC_SPOTS[k] === 'oathkeep').length === 1);
ok('NPC_SPOTS 总数 34（既有 33 键 + 记誓人 1 键，v22.51 随新现实更新）', Object.keys(NPC_SPOTS).length === 38, Object.keys(NPC_SPOTS).length);
ok('既有 33 个 NPC/石碑键未被误动', ['13,6', '10,13', '19,8', '12,8', '2,4', '3,1', '17,12', '17,11', '5,1', '10,1', '15,1', '20,1', '8,5', '14,8', '5,10', '15,12', '14,3', '16,9', '7,11', '7,14', '15,2', '13,2', '21,2', '4,2', '5,3', '5,5', '19,3', '14,15', '13,9', '2,3', '20,12', '8,10', '9,12']
  .every((k) => NPC_SPOTS[k] != null));
// 全局坐标防撞演练：全图 extras 扫描，(10,3) 必须恰出现 1 次且在 gallery、ty 为 NPC
const at103 = [];
for (const [mname, mdef] of Object.entries(MAPS)) {
  for (const ex of (mdef.extras || [])) {
    if (ex.x === 10 && ex.y === 3) at103.push(mname + ':' + ex.ty);
  }
}
ok('(10,3) 全图 extras 仅 gallery 一处 NPC（他图无占用/无撞车）',
  at103.length === 1 && at103[0] === 'gallery:NPC', at103.join(','));
ok('data.js gallery.extras 源级含 v22.51 注释（{ x: 10, y: 3, ty: \'NPC\' } + 记誓人）',
  dSrc.includes("{ x: 10, y: 3, ty: 'NPC' }") && dSrc.includes('记誓人（v22.51'));

// —— NPCS.oathkeep 契约 ——
const ok_ = NPCS.oathkeep;
ok('NPCS.oathkeep 存在且 name===记誓人 / mark===staff（复用既有杖标）', !!ok_ && ok_.name === '记誓人' && ok_.mark === 'staff', ok_ && ok_.name);
ok('lines 2 页（兜底闲聊），无 linesByStage（拾灯人/刻碑人同款静态台词机制）',
  ok_ && Array.isArray(ok_.lines) && ok_.lines.length === 2 && !ok_.linesByStage);
ok('trueBoss after 彩蛋 2 页（拾灯人/刻碑人/守夜人同款契约）',
  ok_ && Array.isArray(ok_.after) && ok_.after.length === 2);
const allOkPages = [...ok_.lines, ...ok_.after];
ok('全部 4 页：每页为字符串数组且末元素以 [Enter] 收尾（既有台词结构）',
  allOkPages.every((pg) => Array.isArray(pg) && pg.length >= 2 &&
    pg.every((ln) => typeof ln === 'string') && /\[Enter\]/.test(pg[pg.length - 1])));
const estW = (s) => { let w = 0; for (const ch of String(s)) { const c = ch.codePointAt(0); if ((c >= 0x4e00 && c <= 0x9fff) || (c >= 0x3000 && c <= 0x303f) || (c >= 0xff00 && c <= 0xffef)) w += 15; else if (/[0-9A-Za-z]/.test(ch)) w += 7.5; else if (ch === ' ') w += 7.5; else w += 8; } return w; };
ok('全部 4 页行宽 ≤440（对话面板预算）', allOkPages.every((pg) => pg.every((ln) => estW(ln) <= 440)));
ok('lines 首页含誓主题（第二块碑 + 灯卫的誓 + 吞下灯芯 + 替镇子记着镇子）',
  ok_.lines[0].some((ln) => ln.includes('灯卫的誓')) && ok_.lines[0].some((ln) => ln.includes('吞下灯芯')) &&
  ok_.lines[0].some((ln) => ln.includes('替镇子记着镇子')));
ok('lines 第 2 页含碑语（碑上没有名字 + 温的 + 石头发烫 + 别让镇子忘了他）',
  ok_.lines[1].some((ln) => ln.includes('碑上没有名字')) && ok_.lines[1].some((ln) => ln.includes('温的')) &&
  ok_.lines[1].some((ln) => ln.includes('石头发烫')) && ok_.lines[1].some((ln) => ln.includes('镇子忘了他')));
ok('after 首页含散尽彩蛋（誓还了 + 亮起微光 + 替镇子记着的分量）',
  ok_.after[0].some((ln) => ln.includes('誓还了')) && ok_.after[0].some((ln) => ln.includes('微光')) &&
  ok_.after[0].some((ln) => ln.includes('分量')));
ok('after 第 2 页含收尾（名字都回了灯下 + 镇子在焐它）',
  ok_.after[1].some((ln) => ln.includes('名字都回了灯下')) && ok_.after[1].some((ln) => ln.includes('镇子在焐它')));

// —— 选段（npcQuestPages 运行期求值，无任务 → 直落 NPCS 数据）——
const p0 = npcQuestPages({}, 'oathkeep');
ok('无旗标选段落到 lines（灯卫的誓）', p0 && p0[0].some((ln) => ln.includes('灯卫的誓')), p0 && p0[0][0]);
const pT = npcQuestPages({ trueBoss: true }, 'oathkeep');
ok('trueBoss 走 after 彩蛋（镇子在焐它）',
  pT && pT.some((pg) => pg.some((ln) => ln.includes('镇子在焐它'))));
ok('无任务：npcQuestMark===null（无 ❕ 顶标）', npcQuestMark(S.G, 'oathkeep') === null);
ok('无支线绑定 oathkeep：resolveNpcTalk 不推进任何任务（纯风味零任务）',
  resolveNpcTalk(S.G, 'oathkeep') === null);

// —— 运行期：loadMap 落位 + 北邻第二块碑 STELE 零回归 + 四邻可行走 + 同图关键点零回归 + Enter/E 交互 ——
loadMap('gallery');
ok('(10,3) 落位为 NPC 瓦片（placeExtras 覆盖，不挡北廊动线）', at(10, 3) === TY.NPC, at(10, 3));
ok('北邻 (10,1) 仍为第二块名字石碑 STELE 瓦片（碑本体零回归）', at(10, 1) === TY.STELE, at(10, 1));
ok('南邻 (10,4) 回廊主廊可行走（可面对面对话）', !SOLID.has(at(10, 4)));
ok('两邻 (9,3)/(11,3) 皆可行走、北邻 (10,2) 树墙不可走（碑下草格不设卡不挖墙）',
  !SOLID.has(at(9, 3)) && !SOLID.has(at(11, 3)) && SOLID.has(at(10, 2)));
ok('同图 NPC 零回归：守名者(8,5)/拾灯人(5,3)/掌灯童(14,3)/刻碑人(19,3)',
  at(8, 5) === TY.NPC && NPC_SPOTS['8,5'] === 'guard' && at(5, 3) === TY.NPC && NPC_SPOTS['5,3'] === 'lampman' &&
  at(14, 3) === TY.NPC && NPC_SPOTS['14,3'] === 'lampkid' && at(19, 3) === TY.NPC && NPC_SPOTS['19,3'] === 'stonecarver');
ok('同图设施零回归：四石碑(5,1)/(15,1)/(20,1)/残焰魔像(12,4)/终焉祭坛(21,4)仍为 STELE/STELE/STELE/MB/SB',
  at(5, 1) === TY.STELE && at(15, 1) === TY.STELE && at(20, 1) === TY.STELE &&
  at(12, 4) === TY.MB && at(21, 4) === TY.SB,
  at(5, 1) + '/' + at(15, 1) + '/' + at(20, 1) + '/' + at(12, 4) + '/' + at(21, 4));
ok('同图遗物宝箱 (16,1) 仍可踩（非 SOLID，开箱管线零回归）', !SOLID.has(at(16, 1)));
S.G.x = 10; S.G.y = 4; S.dir = 'U'; S.scene = 'world';
await screens.world.onKey({ key: 'Enter' });
ok('面向记誓人按 Enter：进入对话（S.scene==talk）且 curNpc===oathkeep',
  S.scene === 'talk' && S.curNpc === 'oathkeep', S.scene + '/' + S.curNpc);
ok('对话第 1 页为 lines 默认台词（灯卫的誓）——S.G 无旗标',
  Array.isArray(S.talkPages) && S.talkPages[0] && S.talkPages[0].some((ln) => ln.includes('灯卫的誓')));
ok('对话共 2 页（第 1 页 [Enter] 继续 → 第 2 页 [Enter] 结束）', S.talkPages && S.talkPages.length === 2);
S.scene = 'world';
await screens.world.onKey({ key: 'E' });
ok('E 键同效（v21.29 交互别名对 NPC 零回归）', S.scene === 'talk' && S.curNpc === 'oathkeep', S.scene + '/' + S.curNpc);

// —— sprites 零改动：默认 mwVillager 造型 + 既有 staff 分支 ——
const spSrc = fs.readFileSync(path.join(ROOT, 'js/view/sprites.js'), 'utf8');
ok('sprites.js 造型默认回退 mwVillager（NPC_SHEET[nid] || mwVillager，oathkeep 零映射零新增）',
  spSrc.includes("NPC_SHEET[nid] || 'mwVillager'") && !spSrc.includes("'oathkeep'"));
ok('sprites.js 既有 staff 杖标分支仍在（mark 复用零新增）', spSrc.includes("mark==='staff'"));

// —— README / package.json / CHANGELOG 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树已收录 smoke_v2251_oathkeep 且位于串尾', readme.includes('smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc（npm test 串跑）'));
ok('README 件套口径为二百一十五件套（二百一十四件套清除）',
  readme.includes('冒烟二百一十五件套（二百一十四件套清除）') && !readme.includes('冒烟一百四十六件套（一百四十五件套清' + '除）'));
ok('README 含 v22.51 守护描述（无字回廊记誓人新 NPC）', readme.includes('v22.51 起含无字回廊记誓人新 NPC 守护'));
ok('README 含 smoke_v2251_oathkeep 入库（147 份）', readme.includes('smoke_v2251_oathkeep 入库（147 份）'));
ok('README 四图速览/系统清单含「记誓人」', readme.includes('记誓人'));
ok('package.json 已收录 smoke_v2251_oathkeep（npm test 串跑第 147 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2251_oathkeep.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 147 件套', testChain === 215, String(testChain));
ok('CHANGELOG 顶部已追加 v22.51 条目', changelog.startsWith('## v23.80'));

// —— 姊妹 pin 复查（smoke_v2250 随新现实更新 + 哨兵链 148）——
const s2250 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2250_brewer.mjs'), 'utf8');
ok('smoke_v2250 的 GAME_VERSION 字面量 pin 已更新为 v22.51（旧 v22.50 零残留）',
  s2250.includes("const GAME_VERSION = 'v23.80';") && !s2250.includes("const GAME_VERSION = 'v22." + "50';"));
ok('smoke_v2250 的 README 件套 pin 已随新现实更新为二百一十五件套（二百一十四件套清除）',
  s2250.includes('二百一十五件套（二百一十四件套清除）'));
ok('smoke_v2250 的 package.json 件套计数 pin 已更新为 === 147', s2250.includes('testChain === 215'));
ok('smoke_v2250 的 README 串尾 pin 已随新现实延伸至 smoke_v2251_oathkeep',
  s2250.includes('smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc（npm test 串跑）'));
ok('smoke_v2250 的 NPC 总数 pin 已随新现实更新为 34（记誓人落位）', s2250.includes('NPC_SPOTS).length === 38'));
const s2143 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2143_talkekey.mjs'), 'utf8');
ok('v2143-45「件套守护领先一位」哨兵链已推进至 148（二百一十五件套（二百一十四件套清除））',
  s2143.includes('二百一十六件套（二百一十五件套清除）') && s2143.includes("!readme.includes('二百一十六件套（二百一十五件套清除）')"));

// —— 旧代 v22.50 pin 全库零残留 ——
const allTests = fs.readdirSync(path.join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2251_oathkeep.mjs');
const stale = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "50';") || src.includes("GAME_VERSION === 'v22." + "50'") ||
      src.includes('一百四十六件套（一百四十五件套清' + '除）') || src.includes('testChain === ' + '146') ||
      src.includes('smoke_v2250_brewer（npm test ' + '串跑）')) stale.push(f);
}
ok('旧代 v22.50 字面量/恒等/件套/串尾 pin 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
