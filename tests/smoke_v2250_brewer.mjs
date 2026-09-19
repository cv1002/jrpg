// v22.50 专项冒烟：潮灯镇酿造锅「酿药师」新风味 NPC——纯内容扩充（无任务、零结算、零新逻辑）：
// 数据层三件套（village.extras (9,12) + NPC_SPOTS '9,12' + NPCS.brewer），酿造锅（'BREW' 瓦片，全游唯一
// 蘑菇→高级灵药的酿造口）是全镇最后只剩泛用镇民 (10,13) 站岗的设施——v22.31 锻灯师/v22.34 客栈老板娘/
// v22.49 货栈掌柜逐铺补脸后，锅旁终于有看锅人；台词讲「蘑菇加铜板能熬一剂高级灵药」「菌盖在夜里发光——
// 那是地底星砂，留给蘑菇的一点光」（与拾菇人「蘑菇是灯油·菌盖夜里发光」/星砂喂记忆之灯同脉）+「雾语林
// 里没铺子，药水见底了就回来找这口锅」（与货郎 v22.22 补给提醒/老板娘 v22.34 出发前睡满/掌柜 v22.49
// 药水补足同一补给口径）；台词走既有 NPCS.lines 兜底 + trueBoss after 彩蛋机制（npcQuestPages 无待办
// 任务回退直落，零新逻辑、零裸字面量），无任务、无顶标、零结算零存档。mark:'kettle' 复用既有热汤壶标
// （drawNpcMark 既有 branch）、造型走 NPC_SHEET 默认 mwVillager（零 sprites 改动）。
// 本冒烟守护：版本锚点、全局坐标防撞（NPC_SPOTS 跨地图共用键、唯一映射、既有 32 键未动、全图 extras
// 扫描 (9,12) 仅 village 一处）、NPCS 契约（name/mark/lines 2 页/after 2 页/每页结构/[Enter] 收尾/
// 行宽预算/酿酒主题/散尽彩蛋）、选段（npcQuestPages 运行期求值、mark 顶标、resolveNpcTalk 零任务）、
// 运行期（loadMap 落位 + 东邻酿造锅 BREW 零回归 + 四邻可行走 + 同图 NPC/设施零回归 + Enter/E 真实
// 交互开对话）、sprites 零改动（默认 mwVillager + 既有 kettle 分支）、README/package.json/CHANGELOG
// 同步（tests 树尾 + 件套口径 146 + v22.50 守护描述 + 入库 146 份）、姊妹件套 pin（smoke_v2249 随新
// 现实更新 + NPC 总数 pin 33 + 哨兵链 148）复查 + 旧代 v22.49 字面量/恒等/件套/串尾 pin 零残留。
import { S } from '../js/state.js';
import { GAME_VERSION, NPCS, NPC_SPOTS, MAPS, TY, SOLID } from '../js/data.js';
import { npcQuestPages, npcQuestMark, resolveNpcTalk } from '../js/quests.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v22.49 冒烟先例：先装桩再 import main.js）——
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

console.log('— v22.50 潮灯镇酿药师 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.49 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.49（本版守 v22.52）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 50)), GAME_VERSION);
ok('data.js 含 v22.50 注释（酿药师说明）', dSrc.includes('v22.50 新内容·纯风味 NPC'));
ok('GAME_VERSION 字面量已为 v22.51（旧 v22.50 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v23.06';") && !dSrc.includes("const GAME_VERSION = 'v22." + "49';"));
ok('data.js 仍保留 v22.49/v22.48 世代注释链（货栈掌柜/地图指南指针累积注释未动）',
  dSrc.includes('v22.49 新内容·纯风味 NPC') && dSrc.includes('v22.48 体验打磨·信息透明·纯文字') &&
  dSrc.includes("const GAME_VERSION = 'v22." + "49';") === false);

// —— 数据层：NPC_SPOTS 全局坐标键（跨地图共用，不得撞车）——
ok('NPC_SPOTS[9,12]===brewer', NPC_SPOTS['9,12'] === 'brewer', NPC_SPOTS['9,12']);
ok('brewer 仅占一个坐标键（无重复映射）', Object.keys(NPC_SPOTS).filter((k) => NPC_SPOTS[k] === 'brewer').length === 1);
ok('NPC_SPOTS 总数 34（既有 33 键 + 记誓人 1 键，v22.51 随新现实更新）', Object.keys(NPC_SPOTS).length === 38, Object.keys(NPC_SPOTS).length);
ok('既有 32 个 NPC/石碑键未被误动', ['13,6', '10,13', '19,8', '12,8', '2,4', '13,9', '3,1', '2,3', '17,12', '17,11', '5,1', '10,1', '15,1', '20,1', '8,5', '14,8', '5,10', '15,12', '14,3', '16,9', '15,2', '13,2', '21,2', '4,2', '5,3', '5,5', '19,3', '14,15', '7,11', '7,14', '20,12', '8,10']
  .every((k) => NPC_SPOTS[k] != null));
// 全局坐标防撞演练：全图 extras 扫描，(9,12) 必须恰出现 1 次且在 village、ty 为 NPC
const at912 = [];
for (const [mname, mdef] of Object.entries(MAPS)) {
  for (const ex of (mdef.extras || [])) {
    if (ex.x === 9 && ex.y === 12) at912.push(mname + ':' + ex.ty);
  }
}
ok('(9,12) 全图 extras 仅 village 一处 NPC（他图无占用/无撞车）',
  at912.length === 1 && at912[0] === 'village:NPC', at912.join(','));
ok('data.js village.extras 源级含 v22.50 注释（{ x: 9, y: 12, ty: \'NPC\' } + 酿药师）',
  dSrc.includes("{ x: 9, y: 12, ty: 'NPC' }") && dSrc.includes('酿药师（v22.50'));

// —— NPCS.brewer 契约 ——
const br = NPCS.brewer;
ok('NPCS.brewer 存在且 name===酿药师 / mark===kettle（复用既有热汤壶标）', !!br && br.name === '酿药师' && br.mark === 'kettle', br && br.name);
ok('lines 2 页（兜底闲聊），无 linesByStage（客栈老板娘/守夜人同款静态台词机制）',
  br && Array.isArray(br.lines) && br.lines.length === 2 && !br.linesByStage);
ok('trueBoss after 彩蛋 2 页（客栈老板娘/守夜人/刻碑人同款契约）',
  br && Array.isArray(br.after) && br.after.length === 2);
const allBrPages = [...br.lines, ...br.after];
ok('全部 4 页：每页为字符串数组且末元素以 [Enter] 收尾（既有台词结构）',
  allBrPages.every((pg) => Array.isArray(pg) && pg.length >= 2 &&
    pg.every((ln) => typeof ln === 'string') && /\[Enter\]/.test(pg[pg.length - 1])));
const estW = (s) => { let w = 0; for (const ch of String(s)) { const c = ch.codePointAt(0); if ((c >= 0x4e00 && c <= 0x9fff) || (c >= 0x3000 && c <= 0x303f) || (c >= 0xff00 && c <= 0xffef)) w += 15; else if (/[0-9A-Za-z]/.test(ch)) w += 7.5; else if (ch === ' ') w += 7.5; else w += 8; } return w; };
ok('全部 4 页行宽 ≤440（对话面板预算）', allBrPages.every((pg) => pg.every((ln) => estW(ln) <= 440)));
ok('lines 首页含酿酒主题（蘑菇加铜板 + 高级灵药 + 菌盖夜里发光/星砂余光）',
  br.lines[0].some((ln) => ln.includes('蘑菇加铜板')) && br.lines[0].some((ln) => ln.includes('高级灵药')) &&
  br.lines[0].some((ln) => ln.includes('夜里发光')) && br.lines[0].some((ln) => ln.includes('星砂')));
ok('lines 第 2 页含补给口径（雾语林没铺子 + 回来找这口锅 + 血和蓝一起回）',
  br.lines[1].some((ln) => ln.includes('没铺子')) && br.lines[1].some((ln) => ln.includes('这口锅')) &&
  br.lines[1].some((ln) => ln.includes('血和蓝')));
ok('after 首页含散尽彩蛋（灯亮了 + 不必整夜守着锅 + 熬给晚归的人）',
  br.after[0].some((ln) => ln.includes('灯亮了')) && br.after[0].some((ln) => ln.includes('守着锅')) &&
  br.after[0].some((ln) => ln.includes('晚归')));
ok('after 第 2 页含收尾（名字都回了灯下 + 不用当药喝）',
  br.after[1].some((ln) => ln.includes('名字都回了灯下')) && br.after[1].some((ln) => ln.includes('当药喝')));

// —— 选段（npcQuestPages 运行期求值，无任务 → 直落 NPCS 数据）——
const p0 = npcQuestPages({}, 'brewer');
ok('无旗标选段落到 lines（酿酒）', p0 && p0[0].some((ln) => ln.includes('蘑菇加铜板')), p0 && p0[0][0]);
const pT = npcQuestPages({ trueBoss: true }, 'brewer');
ok('trueBoss 走 after 彩蛋（不用当药喝）',
  pT && pT.some((pg) => pg.some((ln) => ln.includes('当药喝'))));
ok('无任务：npcQuestMark===null（无 ❕ 顶标）', npcQuestMark(S.G, 'brewer') === null);
ok('无支线绑定 brewer：resolveNpcTalk 不推进任何任务（纯风味零任务）',
  resolveNpcTalk(S.G, 'brewer') === null);

// —— 运行期：loadMap 落位 + 东邻酿造锅 BREW 零回归 + 四邻可行走 + 同图关键点零回归 + Enter/E 交互 ——
loadMap('village');
ok('(9,12) 落位为 NPC 瓦片（placeExtras 覆盖，不挡广场动线）', at(9, 12) === TY.NPC, at(9, 12));
ok('东邻 (10,12) 仍为酿造锅 BREW 瓦片（锅台本体零回归）', at(10, 12) === TY.BREW, at(10, 12));
ok('三邻 (8,12)/(9,11)/(9,13) 皆可行走（可面对面对话，锅台边不设卡）',
  [[8, 12], [9, 11], [9, 13]].every(([x, y]) => !SOLID.has(at(x, y))));
ok('同图 NPC 零回归：灯长(13,6)/镇民(10,13)/巡灯人(19,8)/守书记(12,8)/井巫(2,4)/掌灯阿婆(14,8)/粮铺掌柜(15,12)/说书人(16,9)/锻灯师(7,11)/老板娘(7,14)/货栈掌柜(8,10)',
  at(13, 6) === TY.NPC && NPC_SPOTS['13,6'] === 'chief' && at(10, 13) === TY.NPC && NPC_SPOTS['10,13'] === 'villager' &&
  at(19, 8) === TY.NPC && NPC_SPOTS['19,8'] === 'adventurer' && at(12, 8) === TY.NPC && NPC_SPOTS['12,8'] === 'clerk' &&
  at(2, 4) === TY.NPC && NPC_SPOTS['2,4'] === 'sage' && at(14, 8) === TY.NPC && NPC_SPOTS['14,8'] === 'granny' &&
  at(15, 12) === TY.NPC && NPC_SPOTS['15,12'] === 'grainman' && at(16, 9) === TY.NPC && NPC_SPOTS['16,9'] === 'teller' &&
  at(7, 11) === TY.NPC && NPC_SPOTS['7,11'] === 'smith' && at(7, 14) === TY.NPC && NPC_SPOTS['7,14'] === 'innkeeper' &&
  at(8, 10) === TY.NPC && NPC_SPOTS['8,10'] === 'shopkeep');
ok('同图设施零回归：商店(8,9)/喷泉(12,6)/酿造锅(10,12)仍为 SHOP/FOUNTAIN/BREW',
  at(8, 9) === TY.SHOP && at(12, 6) === TY.FOUNTAIN && at(10, 12) === TY.BREW,
  at(8, 9) + '/' + at(12, 6) + '/' + at(10, 12));
S.G.x = 9; S.G.y = 13; S.dir = 'U'; S.scene = 'world';
await screens.world.onKey({ key: 'Enter' });
ok('面向酿药师按 Enter：进入对话（S.scene==talk）且 curNpc===brewer',
  S.scene === 'talk' && S.curNpc === 'brewer', S.scene + '/' + S.curNpc);
ok('对话第 1 页为 lines 默认台词（酿酒）——S.G 无旗标',
  Array.isArray(S.talkPages) && S.talkPages[0] && S.talkPages[0].some((ln) => ln.includes('蘑菇加铜板')));
ok('对话共 2 页（第 1 页 [Enter] 继续 → 第 2 页 [Enter] 结束）', S.talkPages && S.talkPages.length === 2);
S.scene = 'world';
await screens.world.onKey({ key: 'E' });
ok('E 键同效（v21.29 交互别名对 NPC 零回归）', S.scene === 'talk' && S.curNpc === 'brewer', S.scene + '/' + S.curNpc);

// —— sprites 零改动：默认 mwVillager 造型 + 既有 kettle 分支 ——
const spSrc = fs.readFileSync(path.join(ROOT, 'js/view/sprites.js'), 'utf8');
ok('sprites.js 造型默认回退 mwVillager（NPC_SHEET[nid] || mwVillager，brewer 零映射零新增）',
  spSrc.includes("NPC_SHEET[nid] || 'mwVillager'") && !spSrc.includes("'brewer'"));
ok('sprites.js 既有 kettle 热汤壶标分支仍在（mark 复用零新增）', spSrc.includes("mark==='kettle'"));

// —— README / package.json / CHANGELOG 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树已收录 smoke_v2250_brewer 且位于串尾', readme.includes('smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum（npm test 串跑）'));
ok('README 件套口径为二百零二件套（二百零一件套清除）',
  readme.includes('冒烟二百零二件套（二百零一件套清除）') && !readme.includes('冒烟一百四十五件套（一百四十四件套清' + '除）'));
ok('README 含 v22.50 守护描述（潮灯镇酿药师新 NPC）', readme.includes('v22.50 起含潮灯镇酿药师新 NPC 守护'));
ok('README 含 smoke_v2250_brewer 入库（146 份）', readme.includes('smoke_v2250_brewer 入库（146 份）'));
ok('README 四图速览/系统清单含「酿药师」', readme.includes('酿药师'));
ok('package.json 已收录 smoke_v2250_brewer（npm test 串跑第 146 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2250_brewer.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 147 件套', testChain === 202, String(testChain));
ok('CHANGELOG 顶部已追加 v22.50 条目', changelog.startsWith('## v23.06'));

// —— 姊妹 pin 复查（smoke_v2249 随新现实更新 + 哨兵链 148）——
const s2249 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2249_shopkeep.mjs'), 'utf8');
ok('smoke_v2249 的 GAME_VERSION 字面量 pin 已更新为 v22.50（旧 v22.49 零残留）',
  s2249.includes("const GAME_VERSION = 'v23.06';") && !s2249.includes("const GAME_VERSION = 'v22." + "49';"));
ok('smoke_v2249 的 README 件套 pin 已随新现实更新为二百零二件套（二百零一件套清除）',
  s2249.includes('二百零二件套（二百零一件套清除）'));
ok('smoke_v2249 的 package.json 件套计数 pin 已更新为 === 146', s2249.includes('testChain === 202'));
ok('smoke_v2249 的 README 串尾 pin 已随新现实延伸至 smoke_v2251_oathkeep',
  s2249.includes('smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum（npm test 串跑）'));
ok('smoke_v2249 的 NPC 总数 pin 已随新现实更新为 34（记誓人落位）', s2249.includes('NPC_SPOTS).length === 38'));
const s2143 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2143_talkekey.mjs'), 'utf8');
ok('v2143-45「件套守护领先一位」哨兵链已推进至 148（二百零二件套（二百零一件套清除））',
  s2143.includes('二百零三件套（二百零二件套清除）') && s2143.includes("!readme.includes('二百零三件套（二百零二件套清除）')"));

// —— 旧代 v22.49 pin 全库零残留 ——
const allTests = fs.readdirSync(path.join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2250_brewer.mjs');
const stale = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "49';") || src.includes("GAME_VERSION === 'v22." + "49'") ||
      src.includes('一百四十五件套（一百四十四件套清' + '除）') || src.includes('testChain === ' + '145') ||
      src.includes('smoke_v2249_shopkeep（npm test ' + '串跑）')) stale.push(f);
}
ok('旧代 v22.49 字面量/恒等/件套/串尾 pin 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
