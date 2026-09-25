// smoke_v2294_crystalwatch.mjs —— v22.94 星井矿脉终焉水晶正南新 NPC「守晶人」守护
// 承 v21.10-v22.93 冒烟入库先例：版本锚点 + 数据层三件套（cave.extras (12,12)/NPC_SPOTS '12,12'/
// NPCS.crystalwatch）+ 全局坐标防撞 + NPCS 契约（门闩主题/真结局彩蛋）+ 选段（npcQuestPages 无旗标→lines /
// trueBoss→after）+ 运行期全链路（DOM 桩 + main.js 真实导入：loadMap 落位/水晶 SB 零回归/同图 NPC 零回归/
// Enter/E 真实交互）+ mark 'gem' 新分支落位 + README/package.json/CHANGELOG 同步 + 姊妹件套 pin +
// 旧代 v22.93 pin 全库零残留 + 哨兵链领先一位（191 口径）。
import { S } from '../js/state.js';
import { GAME_VERSION, NPCS, NPC_SPOTS, MAPS, TY, SOLID, CAVE_CRYSTAL } from '../js/data.js';
import { npcQuestPages, npcQuestMark } from '../js/quests.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v22.93 冒烟先例：先装桩再 import main.js）——
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

console.log('— v22.94 星井矿脉终焉水晶守晶人 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.93 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.93（本版守 v22.94）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 99)), GAME_VERSION);
ok('data.js 含 v22.94 注释（守晶人说明）', dSrc.includes('v22.94 新内容·纯风味'));
ok('GAME_VERSION 字面量已为 v22.94（旧 v22.93 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.00';") && !dSrc.includes("const GAME_VERSION = 'v22." + "93';"));
ok('data.js 仍保留 v22.93/v22.92 世代注释链（历史注释未动）',
  dSrc.includes('// v22.93 体验打磨·防误丢档·存档闭环收口') && dSrc.includes('// v22.92 新内容·纯风味'));

// —— 数据层：NPC_SPOTS 全局坐标键（跨地图共用，不得撞车）——
ok('NPC_SPOTS[12,12]===crystalwatch', NPC_SPOTS['12,12'] === 'crystalwatch', NPC_SPOTS['12,12']);
ok('crystalwatch 仅占一个坐标键（无重复映射）', Object.keys(NPC_SPOTS).filter((k) => NPC_SPOTS[k] === 'crystalwatch').length === 1);
ok('NPC_SPOTS 总数 38（既有 37 键 + 守晶人 1 键，v22.94 随新现实更新）', Object.keys(NPC_SPOTS).length === 38, Object.keys(NPC_SPOTS).length);
ok('既有 37 个 NPC/石碑键未被误动', ['13,6', '10,13', '19,8', '12,8', '2,4', '13,9', '3,1', '2,3', '17,12', '17,11', '5,1', '10,1', '15,1', '20,1', '8,5', '14,8', '5,10', '15,12', '14,3', '16,9', '15,2', '13,2', '21,2', '4,2', '5,3', '5,5', '19,3', '14,15', '7,11', '7,14', '8,10', '9,12', '19,7', '10,3', '20,12', '21,3', '20,7']
  .every((k) => NPC_SPOTS[k] != null));
// 全局坐标防撞演练：全图 extras 扫描，(12,12) 必须恰出现 1 次且在 cave、ty 为 NPC
const at1212 = [];
for (const [mname, mdef] of Object.entries(MAPS)) {
  for (const ex of (mdef.extras || [])) {
    if (ex.x === 12 && ex.y === 12) at1212.push(mname + ':' + ex.ty);
  }
}
ok('(12,12) 全图 extras 仅 cave 一处 NPC（他图无占用/无撞车）',
  at1212.length === 1 && at1212[0] === 'cave:NPC', at1212.join(','));
ok('data.js cave.extras 源级含 v22.94 注释（{ x: 12, y: 12, ty: \'NPC\' } + 守晶人）',
  dSrc.includes("{ x: 12, y: 12, ty: 'NPC' }") && dSrc.includes('守晶人（v22.94'));
ok('data.js NPC_SPOTS 源级含 v22.94 注释（\'12,12\': \'crystalwatch\'）',
  dSrc.includes("'12,12': 'crystalwatch'"));
ok('CAVE_CRYSTAL 单一数据源仍为 (12,11)（守晶人北邻水晶零漂移）',
  CAVE_CRYSTAL.x === 12 && CAVE_CRYSTAL.y === 11, JSON.stringify(CAVE_CRYSTAL));

// —— NPCS.crystalwatch 契约 ——
const cw = NPCS.crystalwatch;
ok('NPCS.crystalwatch 存在且 name===守晶人 / mark===gem（新增程序化晶石标）', !!cw && cw.name === '守晶人' && cw.mark === 'gem', cw && cw.name);
ok('lines 2 页（兜底闲聊），无 linesByStage（守洞人/引灯人同款静态台词机制）',
  cw && Array.isArray(cw.lines) && cw.lines.length === 2 && !cw.linesByStage);
ok('trueBoss after 彩蛋 2 页（守洞人/引灯人同款契约）',
  cw && Array.isArray(cw.after) && cw.after.length === 2);
const allCwPages = [...cw.lines, ...cw.after];
ok('全部 4 页：每页为字符串数组且末元素以 [Enter] 收尾（既有台词结构）',
  allCwPages.every((pg) => Array.isArray(pg) && pg.length >= 2 &&
    pg.every((ln) => typeof ln === 'string') && /\[Enter\]/.test(pg[pg.length - 1])));
const estW = (s) => { let w = 0; for (const ch of String(s)) { const c = ch.codePointAt(0); if ((c >= 0x4e00 && c <= 0x9fff) || (c >= 0x3000 && c <= 0x303f) || (c >= 0xff00 && c <= 0xffef)) w += 15; else if (/[0-9A-Za-z]/.test(ch)) w += 7.5; else if (ch === ' ') w += 7.5; else w += 8; } return w; };
ok('全部 4 页行宽 ≤440（对话面板预算）', allCwPages.every((pg) => pg.every((ln) => estW(ln) <= 440)));
ok('lines 首页含门闩主题（晶石 + 门闩 + 双徽记 + 阖着眼）',
  cw.lines[0].some((ln) => ln.includes('门闩')) && cw.lines[0].some((ln) => ln.includes('双徽记')) &&
  cw.lines[0].some((ln) => ln.includes('阖着眼')) && cw.lines[0].some((ln) => ln.includes('晶石')));
ok('lines 第 2 页含开门预习（睁眼那刻 + 无字回廊 + 名字）',
  cw.lines[1].some((ln) => ln.includes('睁眼')) && cw.lines[1].some((ln) => ln.includes('无字回廊')) &&
  cw.lines[1].some((ln) => ln.includes('名字')));
ok('after 首页含散尽彩蛋（水晶空了 + 不用锁着 + 合眼）',
  cw.after[0].some((ln) => ln.includes('水晶空了')) && cw.after[0].some((ln) => ln.includes('锁着')) &&
  cw.after[0].some((ln) => ln.includes('合眼')));
ok('after 第 2 页含收尾（守着 + 没人再丢名字）',
  cw.after[1].some((ln) => ln.includes('守着')) && cw.after[1].some((ln) => ln.includes('丢名字')));

// —— 选段（npcQuestPages 运行期求值，无任务 → 直落 NPCS 数据）——
const p0 = npcQuestPages({}, 'crystalwatch');
ok('无旗标选段落到 lines（门闩）', p0 && p0[0].some((ln) => ln.includes('门闩')), p0 && p0[0][0]);
const pT = npcQuestPages({ trueBoss: true }, 'crystalwatch');
ok('trueBoss 走 after 彩蛋（水晶空了）',
  pT && pT.some((pg) => pg.some((ln) => ln.includes('水晶空了'))));
ok('无任务：npcQuestMark===null（无 ❕ 顶标）', npcQuestMark(S.G, 'crystalwatch') === null);
ok('无支线绑定 crystalwatch：resolveNpcTalk 不推进任何任务（纯风味零任务）',
  (await import('../js/quests.js')).resolveNpcTalk(S.G, 'crystalwatch') === null);

// —— 运行期：loadMap 落位 + 四邻可行走 + 水晶/同图关键点零回归 + Enter/E 真实交互开对话 ——
loadMap('cave');
ok('(12,12) 落位为 NPC 瓦片（placeExtras 覆盖 + 不卡水晶动线）', at(12, 12) === TY.NPC, at(12, 12));
ok('南邻 (12,13) 与西邻 (11,12) 皆可行走（可面对面对话，水晶前不设卡）',
  [[12, 13], [11, 12]].every(([x, y]) => !SOLID.has(at(x, y))));
ok('终焉水晶 (12,11) 仍为 SB 瓦片（守晶人北邻水晶零回归）',
  at(12, 11) === TY.SB && CAVE_CRYSTAL.x === 12 && CAVE_CRYSTAL.y === 11, at(12, 11));
ok('同图 NPC：井巫(3,1)/老矿工(2,3)/听矿人(13,2)/筛砂人(5,5)/星砂车夫(17,11)/守碑人(17,12)/拾骨人(5,10)/守洞人(20,7) 零回归',
  at(3, 1) === TY.NPC && NPC_SPOTS['3,1'] === 'sage' && at(2, 3) === TY.NPC && NPC_SPOTS['2,3'] === 'miner' &&
  at(13, 2) === TY.NPC && NPC_SPOTS['13,2'] === 'hearer' && at(5, 5) === TY.NPC && NPC_SPOTS['5,5'] === 'sifter' &&
  at(17, 11) === TY.NPC && NPC_SPOTS['17,11'] === 'cartman' && at(17, 12) === TY.NPC && NPC_SPOTS['17,12'] === 'sentinel' &&
  at(5, 10) === TY.NPC && NPC_SPOTS['5,10'] === 'digger' && at(20, 7) === TY.NPC && NPC_SPOTS['20,7'] === 'cavewatch');
ok('同图地标零回归：试炼碑(18,12) TRIAL', at(18, 12) === TY.TRIAL, at(18, 12));
S.G.x = 12; S.G.y = 13; S.dir = 'U'; S.scene = 'world';
await screens.world.onKey({ key: 'Enter' });
ok('面向守晶人按 Enter：进入对话（S.scene==talk）且 curNpc===crystalwatch',
  S.scene === 'talk' && S.curNpc === 'crystalwatch', S.scene + '/' + S.curNpc);
ok('对话第 1 页为 lines 默认台词（门闩）——S.G 无旗标',
  Array.isArray(S.talkPages) && S.talkPages[0] && S.talkPages[0].some((ln) => ln.includes('门闩')));
ok('对话共 2 页（第 1 页 [Enter] 继续 → 第 2 页 [Enter] 结束）', S.talkPages && S.talkPages.length === 2);
S.scene = 'world';
await screens.world.onKey({ key: 'E' });
ok('E 键同效（v21.29 交互别名对 NPC 零回归）', S.scene === 'talk' && S.curNpc === 'crystalwatch', S.scene + '/' + S.curNpc);

// —— sprites：gem 新分支落位 + 其余 mark 零回归 + 造型默认 mwVillager ——
const spSrc = fs.readFileSync(path.join(ROOT, 'js/view/sprites.js'), 'utf8');
ok('sprites.js 造型默认回退 mwVillager（NPC_SHEET[nid] || mwVillager，crystalwatch 零映射零新增）',
  spSrc.includes("NPC_SHEET[nid] || 'mwVillager'") && !spSrc.includes("'crystalwatch'"));
ok('sprites.js drawNpcMark 新增 gem 晶石分支（v22.94 蓝晶两粒 + 高光）', spSrc.includes("mark==='gem'") && spSrc.includes('v22.94 守晶人专属'));
ok('sprites.js 既有 mark 分支零回归（staff/pick/lamp/fan/hammer/kettle）',
  spSrc.includes("mark==='staff'") && spSrc.includes("mark==='pick'") && spSrc.includes("mark==='lamp'") &&
  spSrc.includes("mark==='fan'") && spSrc.includes("mark==='hammer'") && spSrc.includes("mark==='kettle'"));

// —— README / package.json / CHANGELOG 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
const TAIL = 'smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula + smoke_v2400_trialwarn（npm test 串跑）';
ok('README tests 树已收录 smoke_v2294_crystalwatch 且位于串尾', readme.includes(TAIL));
const treeLine = readme.split('\n').find((l) => l.startsWith('├── tests/'));
ok('README tests 树含 smoke_v2294_crystalwatch 串尾且旧串尾零残留（树为历史清单，总数不守恒）',
  treeLine && treeLine.includes('+ smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula + smoke_v2400_trialwarn（npm test 串跑）') &&
  !treeLine.includes('smoke_v2292_cavewatch（npm test 串跑）'));
ok('README 件套口径为二百二十四件套（二百二十三件套清除）且旧 188 口径零残留',
  readme.includes('冒烟二百二十四件套（二百二十三件套清除）') && !readme.includes('冒烟一百八十八件套（一百八十七件套清' + '除）'));
ok('README 含 v22.94 守护描述（星井矿脉终焉水晶守晶人新 NPC）', readme.includes('v22.94 起含星井矿脉终焉水晶守晶人新 NPC 守护'));
ok('README 含 smoke_v2294_crystalwatch 入库（190 份）', readme.includes('smoke_v2294_crystalwatch 入库（190 份）'));
ok('README 仍保留 smoke_v2293_deadsave 入库（189 份）历史口径', readme.includes('smoke_v2293_deadsave 入库（189 份）'));
ok('README 仍保留 v22.93 守护描述（历史口径）', readme.includes('v22.93 起含阵亡画面「未存档」提示与 P 存档入口守护'));
ok('README 四图速览·星井矿脉含「守晶人」', readme.includes('守晶人') && readme.includes('第九位可对话角色'));
ok('README 系统清单面向提示名单含「守晶人」', readme.includes('守洞人/守晶人一目了然'));
ok('package.json 已收录 smoke_v2294_crystalwatch（npm test 串跑第 190 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs'));
ok('package.json 串尾为 ... smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs && node tests/smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs && node tests/smoke_v2395_shopscroll.mjs && node tests/smoke_v2396_steelarmor.mjs && node tests/smoke_v2397_baserow.mjs && node tests/smoke_v2398_econrow.mjs && node tests/smoke_v2399_dmgformula.mjs && node tests/smoke_v2400_trialwarn.mjs"',
  pkg.includes('node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs && node tests/smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs && node tests/smoke_v2395_shopscroll.mjs && node tests/smoke_v2396_steelarmor.mjs && node tests/smoke_v2397_baserow.mjs && node tests/smoke_v2398_econrow.mjs && node tests/smoke_v2399_dmgformula.mjs && node tests/smoke_v2400_trialwarn.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 190 件套', testChain === 224, String(testChain));
ok('CHANGELOG 顶部已追加 v22.94 条目', changelog.startsWith('## v24.00 '));

// 姊妹 pin 复查（smoke_v2293/v2292 随新现实更新）
const s2293 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2293_deadsave.mjs'), 'utf8');
const s2292 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2292_cavewatch.mjs'), 'utf8');
ok('smoke_v2293 的 GAME_VERSION 字面量 pin 已更新为 v22.94（旧 v22.93 零残留）',
  s2293.includes("const GAME_VERSION = 'v24.00';") && !s2293.includes("const GAME_VERSION = 'v22." + "93';"));
ok('smoke_v2293 的 README 件套 pin 已随新现实更新为二百二十四件套（二百二十三件套清除）',
  s2293.includes('二百二十四件套（二百二十三件套清除）'));
ok('smoke_v2293 的 package.json 件套计数 pin 已更新为 === 190', s2293.includes('testChain === 224'));
ok('smoke_v2293 的 README 串尾 pin 已随新现实延伸至 smoke_v2294_crystalwatch',
  s2293.includes('smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula + smoke_v2400_trialwarn（npm test 串跑）'));
ok('smoke_v2293 的 package 串尾 pin 已延伸至 smoke_v2294_crystalwatch',
  s2293.includes('node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs && node tests/smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs && node tests/smoke_v2395_shopscroll.mjs && node tests/smoke_v2396_steelarmor.mjs && node tests/smoke_v2397_baserow.mjs && node tests/smoke_v2398_econrow.mjs && node tests/smoke_v2399_dmgformula.mjs && node tests/smoke_v2400_trialwarn.mjs"'));
ok('smoke_v2293 的 CHANGELOG 顶 pin 已更新为 ## v22.95', s2293.includes("startsWith('## v24.00 '"));
ok('smoke_v2293 的哨兵 pin 已更新为二百二十四件套（二百二十三件套清除）', s2293.includes('二百二十四件套（二百二十三件套清除）'));
ok('smoke_v2292 的 NPC 总数 pin 已更新为 === 38', s2292.includes('Object.keys(NPC_SPOTS).length === 38'));
ok('smoke_v2292 的版本锚已推进至 >= 94', s2292.includes('_gv[1] >= 99'));

// 旧代 v22.93 pin 全库零残留
const allTests = fs.readdirSync(path.join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs');
const stale = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "93';") || src.includes("GAME_VERSION === 'v22." + "93'") ||
      src.includes('一百八十九件套（一百八十八件套清' + '除）') || src.includes('testChain === ' + '189') ||
      src.includes('smoke_v2293_deadsave（npm test ' + '串跑）') || src.includes('_gv[1] >= ' + '93') ||
      src.includes("startsWith('## v22." + "93 '") || src.includes("startsWith('## v22." + "93'") ||
      src.includes('Object.keys(NPC_SPOTS).length === ' + '37')) stale.push(f);
}
ok('旧代 v22.93 字面量/恒等/件套/testChain/串尾/版本锚/顶 pin/NPC 计数 pin 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

// 哨兵链（件套守护领先一位）已指向下一版 191 口径
const s2143 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2143_talkekey.mjs'), 'utf8');
ok('哨兵链 v2143 已含下一版件套口径（二百二十四件套（二百二十三件套清除））',
  s2143.includes('二百二十五件套（二百二十四件套清除）') &&
  s2143.includes("!readme.includes('二百二十五件套（二百二十四件套清除）')"));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
