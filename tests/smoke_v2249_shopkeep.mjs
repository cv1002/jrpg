// v22.49 专项冒烟：潮灯镇商店「货栈掌柜」新风味 NPC——纯内容扩充（无任务、零结算、零新逻辑）：
// 数据层三件套（village.extras (8,10) + NPC_SPOTS '8,10' + NPCS.shopkeep），商店（'S' 瓦片，全游唯一
// 买装备/药水/卖蘑菇的铺子）是全镇最热闹的门面——v22.31 锻灯师补了铺子南侧草角、v22.34 客栈老板娘
// 补了旅馆门口，唯独铺子自己门口此前只有一块 S 瓦片（「设施有脸」主线的收口）；台词讲「雾语林的灯油
// 断供以后货栈的空架子比货还多」（与拾菇人「蘑菇是灯油」/货郎灯油营生同脉）+ 出发前把药水补足提醒
// （与货郎 v22.22 同口径）；台词走既有 lines + trueBoss after 彩蛋机制（npcQuestPages 无待办任务回退
// 时 trueBoss 优先 after、否则 lines）；mark:'basket' 复用既有货篮标（drawNpcMark 既有分支）、
// 造型走 NPC_SHEET 默认 mwVillager（零 sprites 改动）。
// 本冒烟守护：版本锚点、全局坐标防撞（NPC_SPOTS 跨地图共用键、唯一映射、既有 31 键未动、全图 extras
// 扫描 (8,10) 仅 village 一处）、NPCS 契约（name/mark/lines 2 页/after 2 页/每页结构/[Enter] 收尾/
// 行宽预算/灯油主题/散尽彩蛋）、选段（npcQuestPages 运行期求值、mark 顶标、resolveNpcTalk 零任务）、
// 运行期（loadMap 落位 + 西邻商店 S 瓦片零回归 + 四邻可行走 + 同图 NPC/设施零回归 + Enter/E 真实
// 交互开对话）、sprites 零改动（默认 mwVillager + 既有 basket 分支）、README/package.json/CHANGELOG
// 同步（tests 树尾 + 件套口径 145 + v22.49 守护描述 + 入库 145 份）、姊妹件套 pin（smoke_v2248 随新
// 现实更新 + NPC 总数 pin 32 + 哨兵链 146）复查 + 旧代 v22.48 字面量/恒等/件套/串尾 pin 零残留。
import { S } from '../js/state.js';
import { GAME_VERSION, NPCS, NPC_SPOTS, MAPS, TY, SOLID } from '../js/data.js';
import { npcQuestPages, npcQuestMark, resolveNpcTalk } from '../js/quests.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v22.48 冒烟先例：先装桩再 import main.js）——
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

console.log('— v22.49 潮灯镇货栈掌柜 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.48 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.48（本版守 v22.49）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 49)), GAME_VERSION);
ok('data.js 含 v22.49 注释（货栈掌柜说明）', dSrc.includes('v22.49 新内容·纯风味 NPC'));
ok('GAME_VERSION 字面量已为 v22.49（旧 v22.48 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v23.90';") && !dSrc.includes("const GAME_VERSION = 'v22." + "48';"));
ok('data.js 仍保留 v22.48/v22.47 世代注释链（地图指南指针/村井补脸累积注释未动）',
  dSrc.includes('v22.48 体验打磨·信息透明·纯文字') && dSrc.includes('v22.47 新内容·世界景观·纯显示') &&
  dSrc.includes("const GAME_VERSION = 'v22." + "48';") === false);

// —— 数据层：NPC_SPOTS 全局坐标键（跨地图共用，不得撞车）——
ok('NPC_SPOTS[8,10]===shopkeep', NPC_SPOTS['8,10'] === 'shopkeep', NPC_SPOTS['8,10']);
ok('shopkeep 仅占一个坐标键（无重复映射）', Object.keys(NPC_SPOTS).filter((k) => NPC_SPOTS[k] === 'shopkeep').length === 1);
ok('NPC_SPOTS 总数 32（既有 31 键 + 货栈掌柜 1 键，v22.49 随新现实更新）', Object.keys(NPC_SPOTS).length === 38, Object.keys(NPC_SPOTS).length);
ok('既有 31 个 NPC/石碑键未被误动', ['13,6', '10,13', '19,8', '12,8', '2,4', '13,9', '3,1', '2,3', '17,12', '17,11', '5,1', '10,1', '15,1', '20,1', '8,5', '14,8', '5,10', '15,12', '14,3', '16,9', '15,2', '13,2', '21,2', '4,2', '5,3', '5,5', '19,3', '14,15', '7,11', '7,14', '20,12']
  .every((k) => NPC_SPOTS[k] != null));
// 全局坐标防撞演练：全图 extras 扫描，(8,10) 必须恰出现 1 次且在 village、ty 为 NPC
const at910 = [];
for (const [mname, mdef] of Object.entries(MAPS)) {
  for (const ex of (mdef.extras || [])) {
    if (ex.x === 8 && ex.y === 10) at910.push(mname + ':' + ex.ty);
  }
}
ok('(8,10) 全图 extras 仅 village 一处 NPC（他图无占用/无撞车）',
  at910.length === 1 && at910[0] === 'village:NPC', at910.join(','));
ok('data.js village.extras 源级含 v22.49 注释（{ x: 8, y: 10, ty: \'NPC\' } + 货栈掌柜）',
  dSrc.includes("{ x: 8, y: 10, ty: 'NPC' }") && dSrc.includes('货栈掌柜（v22.49'));

// —— NPCS.shopkeep 契约 ——
const sk = NPCS.shopkeep;
ok('NPCS.shopkeep 存在且 name===货栈掌柜 / mark===basket（复用既有货篮标）', !!sk && sk.name === '货栈掌柜' && sk.mark === 'basket', sk && sk.name);
ok('lines 2 页（兜底闲聊），无 linesByStage（客栈老板娘/守夜人同款静态台词机制）',
  sk && Array.isArray(sk.lines) && sk.lines.length === 2 && !sk.linesByStage);
ok('trueBoss after 彩蛋 2 页（客栈老板娘/守夜人/刻碑人同款契约）',
  sk && Array.isArray(sk.after) && sk.after.length === 2);
const allSkPages = [...sk.lines, ...sk.after];
ok('全部 4 页：每页为字符串数组且末元素以 [Enter] 收尾（既有台词结构）',
  allSkPages.every((pg) => Array.isArray(pg) && pg.length >= 2 &&
    pg.every((ln) => typeof ln === 'string') && /\[Enter\]/.test(pg[pg.length - 1])));
const estW = (s) => { let w = 0; for (const ch of String(s)) { const c = ch.codePointAt(0); if ((c >= 0x4e00 && c <= 0x9fff) || (c >= 0x3000 && c <= 0x303f) || (c >= 0xff00 && c <= 0xffef)) w += 15; else if (/[0-9A-Za-z]/.test(ch)) w += 7.5; else if (ch === ' ') w += 7.5; else w += 8; } return w; };
ok('全部 4 页行宽 ≤440（对话面板预算）', allSkPages.every((pg) => pg.every((ln) => estW(ln) <= 440)));
ok('lines 首页含灯油/老货主题（行脚老货 + 灯油断供 + 灰比货多）',
  sk.lines[0].some((ln) => ln.includes('行脚老货')) && sk.lines[0].some((ln) => ln.includes('灯油')) &&
  sk.lines[0].some((ln) => ln.includes('灰比货多')));
ok('lines 第 2 页含补给提醒（药水补足 + 菇田灯油 + 不懂发光）',
  sk.lines[1].some((ln) => ln.includes('药水补足')) && sk.lines[1].some((ln) => ln.includes('菇田')) &&
  sk.lines[1].some((ln) => ln.includes('发光')));
ok('after 首页含散尽彩蛋（灯亮了 + 旧货卖不动 + 不缺笑话听）',
  sk.after[0].some((ln) => ln.includes('灯亮了')) && sk.after[0].some((ln) => ln.includes('旧货')) &&
  sk.after[0].some((ln) => ln.includes('笑话听')));
ok('after 第 2 页含收尾（名字回了灯下 + 账本能合上）',
  sk.after[1].some((ln) => ln.includes('名字都回了灯下')) && sk.after[1].some((ln) => ln.includes('账本')));

// —— 选段（npcQuestPages 运行期求值，无任务 → 直落 NPCS 数据）——
const p0 = npcQuestPages({}, 'shopkeep');
ok('无旗标选段落到 lines（老货）', p0 && p0[0].some((ln) => ln.includes('行脚老货')), p0 && p0[0][0]);
const pT = npcQuestPages({ trueBoss: true }, 'shopkeep');
ok('trueBoss 走 after 彩蛋（账本能合上）',
  pT && pT.some((pg) => pg.some((ln) => ln.includes('账本'))));
ok('无任务：npcQuestMark===null（无 ❕ 顶标）', npcQuestMark(S.G, 'shopkeep') === null);
ok('无支线绑定 shopkeep：resolveNpcTalk 不推进任何任务（纯风味零任务）',
  resolveNpcTalk(S.G, 'shopkeep') === null);

// —— 运行期：loadMap 落位 + 西邻商店 S 瓦片零回归 + 四邻可行走 + 同图关键点零回归 + Enter/E 交互 ——
loadMap('village');
ok('(8,10) 落位为 NPC 瓦片（placeExtras 覆盖，不挡主街动线）', at(8, 10) === TY.NPC, at(8, 10));
ok('北邻 (8,9) 仍为商店 S 瓦片（铺子本体零回归）', at(8, 9) === TY.SHOP, at(8, 9));
ok('四邻 (7,10)/(9,10)/(8,11) 皆可行走（可面对面对话，店铺门口不设卡）',
  [[7, 10], [9, 10], [8, 11]].every(([x, y]) => !SOLID.has(at(x, y))));
ok('同图 NPC 零回归：灯长(13,6)/镇民(10,13)/巡灯人(19,8)/守书记(12,8)/井巫(2,4)/掌灯阿婆(14,8)/粮铺掌柜(15,12)/说书人(16,9)/锻灯师(7,11)/老板娘(7,14)',
  at(13, 6) === TY.NPC && NPC_SPOTS['13,6'] === 'chief' && at(10, 13) === TY.NPC && NPC_SPOTS['10,13'] === 'villager' &&
  at(19, 8) === TY.NPC && NPC_SPOTS['19,8'] === 'adventurer' && at(12, 8) === TY.NPC && NPC_SPOTS['12,8'] === 'clerk' &&
  at(2, 4) === TY.NPC && NPC_SPOTS['2,4'] === 'sage' && at(14, 8) === TY.NPC && NPC_SPOTS['14,8'] === 'granny' &&
  at(15, 12) === TY.NPC && NPC_SPOTS['15,12'] === 'grainman' && at(16, 9) === TY.NPC && NPC_SPOTS['16,9'] === 'teller' &&
  at(7, 11) === TY.NPC && NPC_SPOTS['7,11'] === 'smith' && at(7, 14) === TY.NPC && NPC_SPOTS['7,14'] === 'innkeeper');
ok('同图设施零回归：酿造锅(10,12)/喷泉(12,6)仍为 BREW/FOUNTAIN', at(10, 12) === TY.BREW && at(12, 6) === TY.FOUNTAIN, at(10, 12) + '/' + at(12, 6));
S.G.x = 8; S.G.y = 11; S.dir = 'U'; S.scene = 'world';
await screens.world.onKey({ key: 'Enter' });
ok('面向货栈掌柜按 Enter：进入对话（S.scene==talk）且 curNpc===shopkeep',
  S.scene === 'talk' && S.curNpc === 'shopkeep', S.scene + '/' + S.curNpc);
ok('对话第 1 页为 lines 默认台词（老货）——S.G 无旗标',
  Array.isArray(S.talkPages) && S.talkPages[0] && S.talkPages[0].some((ln) => ln.includes('行脚老货')));
ok('对话共 2 页（第 1 页 [Enter] 继续 → 第 2 页 [Enter] 结束）', S.talkPages && S.talkPages.length === 2);
S.scene = 'world';
await screens.world.onKey({ key: 'E' });
ok('E 键同效（v21.29 交互别名对 NPC 零回归）', S.scene === 'talk' && S.curNpc === 'shopkeep', S.scene + '/' + S.curNpc);

// —— sprites 零改动：默认 mwVillager 造型 + 既有 basket 分支 ——
const spSrc = fs.readFileSync(path.join(ROOT, 'js/view/sprites.js'), 'utf8');
ok('sprites.js 造型默认回退 mwVillager（NPC_SHEET[nid] || mwVillager，shopkeep 零映射零新增）',
  spSrc.includes("NPC_SHEET[nid] || 'mwVillager'") && !spSrc.includes("'shopkeep'"));
ok('sprites.js 既有 basket 货篮标分支仍在（mark 复用零新增）', spSrc.includes("mark==='basket'"));

// —— README / package.json / CHANGELOG 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树已收录 smoke_v2249_shopkeep 且位于串尾', readme.includes('smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc（npm test 串跑）'));
ok('README 件套口径为二百一十五件套（二百一十四件套清除）',
  readme.includes('冒烟二百一十五件套（二百一十四件套清除）') && !readme.includes('冒烟一百四十四件套（一百四十三件套清' + '除）'));
ok('README 含 v22.49 守护描述（潮灯镇货栈掌柜新 NPC）', readme.includes('v22.49 起含潮灯镇货栈掌柜新 NPC 守护'));
ok('README 含 smoke_v2249_shopkeep 入库（145 份）', readme.includes('smoke_v2249_shopkeep 入库（145 份）'));
ok('README 四图速览/系统清单含「货栈掌柜」', readme.includes('货栈掌柜'));
ok('package.json 已收录 smoke_v2249_shopkeep（npm test 串跑第 145 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2250_brewer.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 145 件套', testChain === 215, String(testChain));
ok('CHANGELOG 顶部已追加 v22.49 条目', changelog.startsWith('## v23.90'));

// —— 姊妹 pin 复查（smoke_v2248 随新现实更新 + 哨兵链 146）——
const s2248 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2248_mapguide.mjs'), 'utf8');
ok('smoke_v2248 的 GAME_VERSION 字面量 pin 已更新为 v22.49（旧 v22.48 零残留）',
  s2248.includes("const GAME_VERSION = 'v23.90';") && !s2248.includes("const GAME_VERSION = 'v22." + "48';"));
ok('smoke_v2248 的 README 件套 pin 已随新现实更新为二百一十五件套（二百一十四件套清除）',
  s2248.includes('二百一十五件套（二百一十四件套清除）'));
ok('smoke_v2248 的 package.json 件套计数 pin 已更新为 === 145', s2248.includes('testChain === 215'));
ok('smoke_v2248 的 README 串尾 pin 已随新现实延伸至 smoke_v2249_shopkeep',
  s2248.includes('smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc（npm test 串跑）'));
ok('smoke_v2248 的 NPC 总数 pin 已随新现实更新为 32（货栈掌柜落位）', s2248.includes('NPC_SPOTS).length === 38'));
const s2143 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2143_talkekey.mjs'), 'utf8');
ok('v2143-45「件套守护领先一位」哨兵链已推进至 146（二百一十五件套（二百一十四件套清除））',
  s2143.includes('二百一十六件套（二百一十五件套清除）') && s2143.includes("!readme.includes('二百一十六件套（二百一十五件套清除）')"));

// —— 旧代 v22.48 pin 全库零残留 ——
const allTests = fs.readdirSync(path.join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2250_brewer.mjs');
const stale = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "48';") || src.includes("GAME_VERSION === 'v22." + "48'") ||
      src.includes('一百四十四件套（一百四十三件套清' + '除）') || src.includes('testChain === ' + '144') ||
      src.includes('smoke_v2248_mapguide（npm test ' + '串跑）')) stale.push(f);
}
ok('旧代 v22.48 字面量/恒等/件套/串尾 pin 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
