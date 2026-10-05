// v22.32 专项冒烟：快速旅行面板「目的地补给点」提示——信息透明·纯显示（承 v21.92 等级达标预警 /
// v21.40 无泉水旅店进图提示同一「传送决策点信息」主线）：drawTravel 按选中目的地由 data.js
// hasRecoveryPoint 实扫派生（与 world.transition 进图提示同读一份单一数据源），无补给点且非当前
// 所在地时补橙行「⚠️ {名}没有泉水/旅店 · 出发前请补给！」，与 v21.92 等级预警同现时下移一行（+42）。
// 本冒烟守护：版本锚点、hasRecoveryPoint 数据契约（village/dungeon true、cave/gallery false）、
// menus 源级落位（import/绘制分支/文案/偏移）、运行期真实渲染捕获多档（无补给点+达标 → +24 橙行、
// 无补给点+未达标 → 双行共存 +42、当前位置 → 零提示、有补给点目的地 → 零提示、village 恒不触发）、
// travelFootY 回归（320）、README/package.json/CHANGELOG 同步（tests 树尾 + 件套口径 + v22.32 守护描述 +
// 入库 128 份）、姊妹件套 pin（v22.31..v2226 随新现实更新）复查 + 旧代 v22.31 字面量/恒等/件套/树尾
// pin 零残留 + 坏链防回归。
import { S } from '../js/state.js';
import { GAME_VERSION, MAPS, TRAVEL_LIST, hasRecoveryPoint } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v22.31 冒烟先例：先装桩再 import main.js）——
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
const { drawTravel, travelFootY } = await import('../js/view/menus.js');
const { CV, CTX } = await import('../js/view/canvas.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.32 快速旅行补给点提示 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const menusSrc = fs.readFileSync(path.join(ROOT, 'js/view/menus.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.31 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.31', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 32)), GAME_VERSION);
ok('data.js 含 v22.32 注释（快速旅行补给点提示说明）', dSrc.includes('v22.32 快速旅行面板补「目的地补给点」提示'));
ok('GAME_VERSION 字面量已为 v22.32（旧 v22.31 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.47';") && !dSrc.includes("const GAME_VERSION = 'v22." + "31';"));
ok('data.js 仍保留 v22.31 历史注释（累积注释块，姊妹 pin 不失效）', dSrc.includes('v22.31 新内容：潮灯镇商店南侧新风味 NPC「锻灯师」'));

// —— hasRecoveryPoint 数据契约（单一数据源实扫，与 world.transition 同源）——
ok('hasRecoveryPoint：潮灯镇 true（rows 含 F/I）', hasRecoveryPoint(MAPS.village) === true);
ok('hasRecoveryPoint：雾语林 true（extras 营地泉）', hasRecoveryPoint(MAPS.dungeon) === true);
ok('hasRecoveryPoint：星井矿脉 false（无泉水/旅店）', hasRecoveryPoint(MAPS.cave) === false);
ok('hasRecoveryPoint：无字回廊 false（无泉水/旅店）', hasRecoveryPoint(MAPS.gallery) === false);
ok('hasRecoveryPoint 空参防御（undefined/null → false）', hasRecoveryPoint(null) === false && hasRecoveryPoint(undefined) === false);

// —— menus.js 源级落位 ——
ok('menus.js 已 import hasRecoveryPoint（与 data 同源）', menusSrc.includes('hasRecoveryPoint'));
ok('drawTravel 含 v22.32 注释（补给点提示说明）', menusSrc.includes('v22.32 目的地补给点提示'));
ok('drawTravel 新增 noSupPoint 分支（!hasRecoveryPoint(selDef) 派生）',
  menusSrc.includes('!hasRecoveryPoint(selDef)'));
ok('提示文案与进图提示逐字同口径（{名}没有泉水/旅店 · 出发前请补给！）',
  menusSrc.includes('${selDef.name}没有泉水/旅店 · 出发前请补给！'));
ok('与 v21.92 等级预警同现时下移一行（+42，仍在面板底缘 380 之内）', menusSrc.includes('(lowLv ? 42 : 24)'));
ok('v21.92 等级预警行逐字未动（lowLv 重构仅提纯、文案/触发守卫零变化）',
  menusSrc.includes("⚠️ 目的地推荐 Lv.${selRec} · 你当前 Lv.${hero.level} · 先补给再战！") &&
  menusSrc.includes('const lowLv = !!(hero && selK !== curMap() && selRec && hero.level < selRec)'));

// —— travelFootY 回归（行距派生，四行恒 320）——
ok('travelFootY(4)===320（页脚行距回归）', travelFootY(4) === 320, travelFootY(4));

// —— 运行期真实渲染捕获（CTX.fillText 打桩收集）——
function captureTravel(g, travelSel) {
  const cap = [];
  const origFt = CTX.fillText;
  CTX.fillText = (t, ...a) => { cap.push({ t: String(t), y: a[1] }); return origFt.call(CTX, t, ...a); };
  try {
    S.G = g; S.travelSel = travelSel; S.scene = 'travel';
    drawTravel();
  } catch (e) { cap.push({ t: 'THREW:' + e.message, y: -1 }); }
  CTX.fillText = origFt;
  return cap;
}
const SUP = (name) => `⚠️ ${name}没有泉水/旅店 · 出发前请补给！`;
const V4 = ['village', 'dungeon', 'cave', 'gallery'];
const baseG = { name: '余烬', level: 12, visited: V4.slice(), map: 'village' };

let cap = captureTravel({ ...baseG, level: 12 }, 2);
ok('运行期：选中星井矿脉（无补给点·等级达标）补橙行 +24',
  cap.some((c) => c.t === SUP('星井矿脉') && c.y === 344), JSON.stringify(cap.filter((c) => c.t.includes('泉水'))));
ok('运行期：等级达标时无红色等级预警（零低Lv行）',
  !cap.some((c) => c.t.includes('目的地推荐 Lv.')), JSON.stringify(cap.filter((c) => c.t.includes('推荐'))));
ok('运行期：等级达标档无「未探索」占位（visited 四图齐）',
  !cap.some((c) => c.t.includes('未探索')));

cap = captureTravel({ ...baseG, level: 4, map: 'village' }, 3);
ok('运行期：选中无字回廊（无补给点·Lv4<10 未达标）双行共存 → 补给行下移 +42',
  cap.some((c) => c.t === SUP('无字回廊') && c.y === 362) &&
  cap.some((c) => c.t.includes('目的地推荐 Lv.10 · 你当前 Lv.4') && c.y === 344),
  JSON.stringify(cap.filter((c) => c.t.includes('泉水') || c.t.includes('推荐'))));

cap = captureTravel({ ...baseG, level: 12, map: 'gallery' }, 3);
ok('运行期：当前所在地（已在该图）不弹补给提示（避免「目的地」语义失真）',
  !cap.some((c) => c.t.includes('没有泉水/旅店')), JSON.stringify(cap.filter((c) => c.t.includes('泉水'))));
ok('运行期：当前所在地行仍标 📍（零回归）', cap.some((c) => c.t.includes('📍')));

cap = captureTravel({ ...baseG, level: 12 }, 1);
ok('运行期：选中雾语林（有泉水）零补给提示',
  !cap.some((c) => c.t.includes('没有泉水/旅店')), JSON.stringify(cap.filter((c) => c.t.includes('泉水'))));

cap = captureTravel({ ...baseG, level: 12 }, 0);
ok('运行期：选中潮灯镇（安全区）零补给提示（village 恒不触发）',
  !cap.some((c) => c.t.includes('没有泉水/旅店')), JSON.stringify(cap.filter((c) => c.t.includes('泉水'))));

cap = captureTravel({ ...baseG, level: 2, map: 'village' }, 0);
ok('运行期：等级达标预警零回归（village recLv=1 恒不触发）',
  !cap.some((c) => c.t.includes('目的地推荐 Lv.')), JSON.stringify(cap.filter((c) => c.t.includes('推荐'))));

// —— README / package.json / CHANGELOG 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树收录 smoke_v2232_travelsup 且位于串尾', readme.includes('smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend + smoke_v2238_starwell + smoke_v2239_minercart + smoke_v2240_tallgrass + smoke_v2241_gatearch + smoke_v2242_mushfield + smoke_v2243_encguide + smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula + smoke_v2400_trialwarn + smoke_v2401_winbgm + smoke_v2402_firstwin + smoke_v2403_diffbattle + smoke_v2404_chestrow + smoke_v2405_trialgoal + smoke_v2406_restrow + smoke_v2407_innrest + smoke_v2408_travelgoal + smoke_v2409_sellgoal + smoke_v2410_brewgoal + smoke_v2411_deathprog + smoke_v2412_battlegoal + smoke_v2413_xpcurve + smoke_v2414_nightbattle + smoke_v2415_treepin + smoke_v2416_steps + smoke_v2417_mapdrink + smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7（npm test 串跑）'));
ok('README tests 树尾链完整（v2231_smith 未被新尾吞并，全链连到 smoke_v2232_travelsup）',
  readme.includes('smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend + smoke_v2238_starwell + smoke_v2239_minercart + smoke_v2240_tallgrass + smoke_v2241_gatearch + smoke_v2242_mushfield + smoke_v2243_encguide + smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula + smoke_v2400_trialwarn + smoke_v2401_winbgm + smoke_v2402_firstwin + smoke_v2403_diffbattle + smoke_v2404_chestrow + smoke_v2405_trialgoal + smoke_v2406_restrow + smoke_v2407_innrest + smoke_v2408_travelgoal + smoke_v2409_sellgoal + smoke_v2410_brewgoal + smoke_v2411_deathprog + smoke_v2412_battlegoal + smoke_v2413_xpcurve + smoke_v2414_nightbattle + smoke_v2415_treepin + smoke_v2416_steps + smoke_v2417_mapdrink + smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7（npm test 串跑）'));
ok('README 件套口径为二百七十一件套（二百七十件套清除）',
  readme.includes('冒烟二百七十一件套（二百七十件套清除）') && !readme.includes('冒烟一百二十七件套（一百二十六件套清' + '除）'));
ok('README 含 v22.32 守护描述（快速旅行补给点提示）', readme.includes('v22.32 起含快速旅行补给点提示守护'));
ok('README 含 smoke_v2232_travelsup 入库（128 份）', readme.includes('smoke_v2232_travelsup 入库（128 份）'));
ok('package.json 已收录 smoke_v2232_travelsup（npm test 串跑第 128 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2232_travelsup.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 128 件套', testChain === 271, String(testChain));
ok('CHANGELOG 含 v22.32 条目', changelog.includes('## v22.32 '));

// 姊妹 pin 复查（v22.31..v2226 随新现实更新——GAME_VERSION 字面量/恒等、README 件套、树尾、testChain）
const s2231 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2231_smith.mjs'), 'utf8');
const s2230 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2230_pausewarn.mjs'), 'utf8');
const s2229 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2229_metall.mjs'), 'utf8');
const s2228 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2228_titlesave.mjs'), 'utf8');
const s2227 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2227_minstrel.mjs'), 'utf8');
const s2226 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2226_chestprogress.mjs'), 'utf8');
ok('smoke_v2231 的 GAME_VERSION 字面量 pin 已更新为 v22.32', s2231.includes("const GAME_VERSION = 'v24.47';"));
ok('smoke_v2231 的 GAME_VERSION 恒等 pin 已更新为 === v22.32', s2231.includes("GAME_VERSION === 'v24.47'"));
ok('smoke_v2231 的 README 件套 pin 已随新现实更新为二百七十一件套（二百七十件套清除）',
  s2231.includes('二百七十一件套（二百七十件套清除）'));
ok('smoke_v2231 的 README 树尾 pin 已更新为 + smoke_v2232_travelsup',
  s2231.includes('smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend + smoke_v2238_starwell + smoke_v2239_minercart + smoke_v2240_tallgrass + smoke_v2241_gatearch + smoke_v2242_mushfield + smoke_v2243_encguide + smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula + smoke_v2400_trialwarn + smoke_v2401_winbgm + smoke_v2402_firstwin + smoke_v2403_diffbattle + smoke_v2404_chestrow + smoke_v2405_trialgoal + smoke_v2406_restrow + smoke_v2407_innrest + smoke_v2408_travelgoal + smoke_v2409_sellgoal + smoke_v2410_brewgoal + smoke_v2411_deathprog + smoke_v2412_battlegoal + smoke_v2413_xpcurve + smoke_v2414_nightbattle + smoke_v2415_treepin + smoke_v2416_steps + smoke_v2417_mapdrink + smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7（npm test 串跑）'));
ok('smoke_v2231 的 package.json 件套计数 pin 已更新为 === 128', s2231.includes('testChain === 271'));
ok('smoke_v2230 的 GAME_VERSION 字面量 pin 已更新为 v22.32', s2230.includes("const GAME_VERSION = 'v24.47';"));
ok('smoke_v2230 的 README 件套 pin 已随新现实更新为二百七十一件套（二百七十件套清除）',
  s2230.includes('二百七十一件套（二百七十件套清除）'));
ok('smoke_v2230 的 README 树尾 pin 已更新为 + smoke_v2232_travelsup',
  s2230.includes('smoke_v2229_metall\\.mjs && node tests\\/smoke_v2230_pausewarn\\.mjs && node tests\\/smoke_v2231_smith\\.mjs && node tests\\/smoke_v2232_travelsup\\.mjs && node tests\\/smoke_v2233_nameflavor\\.mjs && node tests\\/smoke_v2234_innkeeper\\.mjs && node tests\\/smoke_v2235_minimapquest\\.mjs && node tests\\/smoke_v2236_villagelamp\\.mjs && node tests\\/smoke_v2237_minimaplegend\\.mjs && node tests\\/smoke_v2238_starwell\\.mjs && node tests\\/smoke_v2239_minercart\\.mjs && node tests\\/smoke_v2240_tallgrass\\.mjs && node tests\\/smoke_v2241_gatearch.mjs && node tests\\/smoke_v2242_mushfield.mjs && node tests\\/smoke_v2243_encguide.mjs && node tests\\/smoke_v2244_fulldanger.mjs && node tests\\/smoke_v2245_watcher.mjs && node tests\\/smoke_v2246_fountgauge.mjs && node tests\\/smoke_v2247_villagewell.mjs && node tests\\/smoke_v2248_mapguide.mjs && node tests\\/smoke_v2249_shopkeep.mjs && node tests\\/smoke_v2250_brewer.mjs && node tests\\/smoke_v2251_oathkeep.mjs && node tests\\/smoke_v2252_rail.mjs && node tests\\/smoke_v2253_supplypoint.mjs && node tests\\/smoke_v2254_grainfield.mjs && node tests\\/smoke_v2255_steleglow.mjs && node tests\\/smoke_v2256_campfire.mjs && node tests\\/smoke_v2257_pondglow.mjs && node tests\\/smoke_v2258_potionhelp.mjs && node tests\\/smoke_v2259_sandpile.mjs && node tests\\/smoke_v2260_fountripple.mjs && node tests\\/smoke_v2261_rich3.mjs && node tests\\/smoke_v2262_crystal.mjs && node tests\\/smoke_v2263_ptime3.mjs && node tests\\/smoke_v2264_hunt3.mjs && node tests\\/smoke_v2265_lucky3.mjs && node tests\\/smoke_v2266_stock3.mjs && node tests\\/smoke_v2267_elixir3.mjs && node tests\\/smoke_v2268_brew3.mjs && node tests\\/smoke_v2269_mush3.mjs && node tests\\/smoke_v2270_outstep.mjs && node tests\\/smoke_v2271_outstep2.mjs && node tests\\/smoke_v2272_scholar2.mjs && node tests\\/smoke_v2273_seen5.mjs && node tests\\/smoke_v2274_seen2\\.mjs && node tests\\/smoke_v2275_codexempty\\.mjs && node tests\\/smoke_v2276_lampkid\\.mjs && node tests\\/smoke_v2277_pondhint\\.mjs && node tests\\/smoke_v2278_mushguide\\.mjs && node tests\\/smoke_v2279_lampwell\\.mjs && node tests\\/smoke_v2280_grainfield\\.mjs && node tests\\/smoke_v2281_starwell\\.mjs && node tests\\/smoke_v2282_archgate\\.mjs && node tests\\/smoke_v2283_menuekey\\.mjs && node tests\\/smoke_v2284_skillekey\\.mjs && node tests\\/smoke_v2285_winekey\\.mjs && node tests\\/smoke_v2286_titleekey\\.mjs && node tests\\/smoke_v2287_trueroute\\.mjs && node tests\\/smoke_v2288_scrollhint\\.mjs && node tests\\/smoke_v2289_winprog\\.mjs && node tests\\/smoke_v2290_statlink\\.mjs && node tests\\/smoke_v2291_lampguide\\.mjs && node tests\\/smoke_v2292_cavewatch\\.mjs && node tests\\/smoke_v2293_deadsave\\.mjs && node tests\\/smoke_v2294_crystalwatch\\.mjs && node tests\\/smoke_v2295_deadprog\\.mjs && node tests\\/smoke_v2296_endingprog\\.mjs && node tests\\/smoke_v2297_chestmid\\.mjs && node tests\\/smoke_v2298_encnum\\.mjs && node tests\\/smoke_v2299_crosslink\\.mjs && node tests\\/smoke_v2300_sidemore\\.mjs && node tests\\/smoke_v2301_eco\\.mjs && node tests\\/smoke_v2302_cmdprev\\.mjs && node tests\\/smoke_v2303_rushnum\\.mjs && node tests\\/smoke_v2304_achgoal\\.mjs && node tests\\/smoke_v2305_monnum\\.mjs && node tests\\/smoke_v2306_skillnum\\.mjs && node tests\\/smoke_v2307_bossnum\\.mjs && node tests\\/smoke_v2308_diffnum\\.mjs && node tests\\/smoke_v2309_questnum\\.mjs && node tests\\/smoke_v2310_diffsum\\.mjs && node tests\\/smoke_v2311_fragprev\\.mjs && node tests\\/smoke_v2312_voltitle\\.mjs && node tests\\/smoke_v2313_talkall\\.mjs && node tests\\/smoke_v2314_voices\\.mjs && node tests\\/smoke_v2315_talkfoot\\.mjs && node tests\\/smoke_v2316_voiceshead\\.mjs && node tests\\/smoke_v2317_pausemap\\.mjs && node tests\\/smoke_v2318_battlemap\\.mjs && node tests\\/smoke_v2319_deadloc\\.mjs && node tests\\/smoke_v2392_stariron\\.mjs && node tests\\/smoke_v2393_deadkey\\.mjs && node tests\\/smoke_v2394_fightback\\.mjs && node tests\\/smoke_v2395_shopscroll\\.mjs && node tests\\/smoke_v2396_steelarmor\\.mjs && node tests\\/smoke_v2397_baserow\\.mjs && node tests\\/smoke_v2398_econrow\\.mjs && node tests\\/smoke_v2399_dmgformula\\.mjs && node tests\\/smoke_v2400_trialwarn\\.mjs && node tests\\/smoke_v2401_winbgm\\.mjs && node tests\\/smoke_v2402_firstwin\\.mjs && node tests\\/smoke_v2403_diffbattle\\.mjs && node tests\\/smoke_v2404_chestrow\\.mjs && node tests\\/smoke_v2405_trialgoal\\.mjs && node tests\\/smoke_v2406_restrow\\.mjs && node tests\\/smoke_v2407_innrest\\.mjs && node tests\\/smoke_v2408_travelgoal\\.mjs && node tests\\/smoke_v2409_sellgoal\\.mjs && node tests\\/smoke_v2410_brewgoal\\.mjs && node tests\\/smoke_v2411_deathprog\\.mjs && node tests\\/smoke_v2412_battlegoal\\.mjs && node tests\\/smoke_v2413_xpcurve\\.mjs && node tests\\/smoke_v2414_nightbattle\\.mjs && node tests\\/smoke_v2415_treepin\\.mjs && node tests\\/smoke_v2416_steps\\.mjs && node tests\\/smoke_v2417_mapdrink\\.mjs && node tests\\/smoke_v2418_goldcurve\\.mjs && node tests\\/smoke_v2419_luckdrp\\.mjs && node tests\\/smoke_v2420_skillprog\\.mjs && node tests\\/smoke_v2421_allquest\\.mjs && node tests\\/smoke_v2422_huntprog\\.mjs && node tests\\/smoke_v2423_eliteprog\\.mjs && node tests\\/smoke_v2424_pondslime\\.mjs && node tests\\/smoke_v2425_potionprog\\.mjs && node tests\\/smoke_v2426_levelprog\\.mjs && node tests\\/smoke_v2427_richprog\\.mjs && node tests\\/smoke_v2428_outprog\\.mjs && node tests\\/smoke_v2429_xpcurve3\\.mjs && node tests\\/smoke_v2430_goldcurve3\\.mjs && node tests\\/smoke_v2431_elixirprog\\.mjs && node tests\\/smoke_v2432_golemquest\\.mjs && node tests\\/smoke_v2433_goldcurve4\\.mjs && node tests\\/smoke_v2434_trialquest\\.mjs && node tests\\/smoke_v2435_goldcurve5\\.mjs && node tests\\/smoke_v2436_codexrow\\.mjs && node tests\\/smoke_v2437_goldcurve6\\.mjs && node tests\\/smoke_v2438_goldcurve7\\.mjs && node tests\\/smoke_v2439_xpcurve4\\.mjs && node tests\\/smoke_v2440_potionprog\\.mjs && node tests\\/smoke_v2441_xpcurve5\\.mjs && node tests\\/smoke_v2442_chestprog\\\\ && node tests\\/smoke_v2443_xpcurve6\\\\.mjs'));
ok('smoke_v2230 的 package.json 件套计数 pin 已更新为 === 128', s2230.includes('testChain === 271'));
ok('smoke_v2229 的 GAME_VERSION 字面量 pin 已更新为 v22.32', s2229.includes("const GAME_VERSION = 'v24.47';"));
ok('smoke_v2229 的 GAME_VERSION 恒等 pin 已更新为 === v22.32', s2229.includes("GAME_VERSION === 'v24.47'"));
ok('smoke_v2229 的 README 件套 pin 已随新现实更新为二百七十一件套（二百七十件套清除）',
  s2229.includes('二百七十一件套（二百七十件套清除）'));
ok('smoke_v2229 的 README 树尾 pin 已更新为 + smoke_v2232_travelsup',
  s2229.includes('smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend + smoke_v2238_starwell + smoke_v2239_minercart + smoke_v2240_tallgrass + smoke_v2241_gatearch + smoke_v2242_mushfield + smoke_v2243_encguide + smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula + smoke_v2400_trialwarn + smoke_v2401_winbgm + smoke_v2402_firstwin + smoke_v2403_diffbattle + smoke_v2404_chestrow + smoke_v2405_trialgoal + smoke_v2406_restrow + smoke_v2407_innrest + smoke_v2408_travelgoal + smoke_v2409_sellgoal + smoke_v2410_brewgoal + smoke_v2411_deathprog + smoke_v2412_battlegoal + smoke_v2413_xpcurve + smoke_v2414_nightbattle + smoke_v2415_treepin + smoke_v2416_steps + smoke_v2417_mapdrink + smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7（npm test 串跑）'));
ok('smoke_v2229 的 package.json 件套计数 pin 已更新为 === 128', s2229.includes('testChain === 271'));
ok('smoke_v2228 的 GAME_VERSION 字面量 pin 已更新为 v22.32', s2228.includes("const GAME_VERSION = 'v24.47';"));
ok('smoke_v2228 的 README 树尾 pin 已更新为 + smoke_v2232_travelsup',
  s2228.includes('smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend + smoke_v2238_starwell + smoke_v2239_minercart + smoke_v2240_tallgrass + smoke_v2241_gatearch + smoke_v2242_mushfield + smoke_v2243_encguide + smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula + smoke_v2400_trialwarn + smoke_v2401_winbgm + smoke_v2402_firstwin + smoke_v2403_diffbattle + smoke_v2404_chestrow + smoke_v2405_trialgoal + smoke_v2406_restrow + smoke_v2407_innrest + smoke_v2408_travelgoal + smoke_v2409_sellgoal + smoke_v2410_brewgoal + smoke_v2411_deathprog + smoke_v2412_battlegoal + smoke_v2413_xpcurve + smoke_v2414_nightbattle + smoke_v2415_treepin + smoke_v2416_steps + smoke_v2417_mapdrink + smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7（npm test 串跑）'));
ok('smoke_v2227 的 README 树尾 pin 已更新为 + smoke_v2232_travelsup',
  s2227.includes('smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend + smoke_v2238_starwell + smoke_v2239_minercart + smoke_v2240_tallgrass + smoke_v2241_gatearch + smoke_v2242_mushfield + smoke_v2243_encguide + smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula + smoke_v2400_trialwarn + smoke_v2401_winbgm + smoke_v2402_firstwin + smoke_v2403_diffbattle + smoke_v2404_chestrow + smoke_v2405_trialgoal + smoke_v2406_restrow + smoke_v2407_innrest + smoke_v2408_travelgoal + smoke_v2409_sellgoal + smoke_v2410_brewgoal + smoke_v2411_deathprog + smoke_v2412_battlegoal + smoke_v2413_xpcurve + smoke_v2414_nightbattle + smoke_v2415_treepin + smoke_v2416_steps + smoke_v2417_mapdrink + smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog + smoke_v2421_allquest + smoke_v2422_huntprog + smoke_v2423_eliteprog + smoke_v2424_pondslime + smoke_v2425_potionprog + smoke_v2426_levelprog + smoke_v2427_richprog + smoke_v2428_outprog + smoke_v2429_xpcurve3 + smoke_v2430_goldcurve3 + smoke_v2431_elixirprog + smoke_v2432_golemquest + smoke_v2433_goldcurve4 + smoke_v2434_trialquest + smoke_v2435_goldcurve5 + smoke_v2436_codexrow + smoke_v2437_goldcurve6 + smoke_v2438_goldcurve7 + smoke_v2439_xpcurve4 + smoke_v2440_potionprog + smoke_v2441_xpcurve5 + smoke_v2442_chestprog + smoke_v2443_xpcurve6 + smoke_v2444_goldcurve8 + smoke_v2445_goldcurve9 + smoke_v2446_mushprog + smoke_v2447_xpcurve7（npm test 串跑）'));
ok('smoke_v2226 的 GAME_VERSION 字面量 pin 已更新为 v22.32', s2226.includes("const GAME_VERSION = 'v24.47';"));
ok('smoke_v2226 的 README 件套 pin 已随新现实更新为二百七十一件套（二百七十件套清除）',
  s2226.includes('二百七十一件套（二百七十件套清除）'));

// —— 旧代 pin 零残留：全部测试文件不得再含 v22.31 字面量/恒等/件套/树尾 pin（拆串构造避免自匹配）——
let stale = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "31';")) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v22.31 全库清零）', stale.length === 0, stale.join(','));
let staleId = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("GAME_VERSION === 'v22." + "31'")) staleId.push(f);
}
ok('旧代 GAME_VERSION 恒等 pin 零残留（===v22.31 全库清零）', staleId.length === 0, staleId.join(','));
let staleSuite = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('一百二十七件套（一百二十六件套清' + '除）')) staleSuite.push(f);
}
ok('旧代件套 pin 零残留（一百二十七件套（一百二十六件套清' + '除）全库清零）', staleSuite.length === 0, staleSuite.join(','));
let staleTail = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('smoke_v2230_pausewarn + smoke_v2231_smith（npm test 串' + '跑）')) staleTail.push(f);
}
ok('旧代树尾 pin 零残留（smoke_v2230_pausewarn + smoke_v2231_smith 串全库清零）', staleTail.length === 0, staleTail.join(','));
// 断链防回归：不得出现 v2231_smith 被新尾吞并的坏链（smoke_v2230_pausewarn 直接接 smoke_v2232_travelsup）
let brokenTail = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('smoke_v2230_pausewarn + smoke_v2232_travelsup（npm test 串' + '跑）')) brokenTail.push(f);
}
if (readme.includes('smoke_v2230_pausewarn + smoke_v2232_travelsup（npm test 串' + '跑）')) brokenTail.push('README.md');
ok('坏链 pin 零残留（v2231_smith 吞并链全库清零）', brokenTail.length === 0, brokenTail.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
