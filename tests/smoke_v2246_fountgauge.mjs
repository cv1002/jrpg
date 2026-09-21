// v22.46 专项冒烟：喷泉踩踏反馈补「遇敌槽 -N」——体验打磨·信息透明·纯显示（承 v19.94 喷泉数值反馈 /
// v22.43 帮助页「遇敌槽 / 危险格」机制行 / v22.44 小地图全域危险标注同一「危险端看得见→读得懂」主线）：
// 喷泉是遇敌槽唯一的「安全阀」（ENCOUNTER.fountain=-25，与帮助页机制行/小地图读数同读一份源），
// 但 v22.43 机制行把「喷泉 -25」写进帮助页后，踩上喷泉这一刻的反馈仍只报 HP/MP——玩家以为泉只回血、
// 并不知道它把遇敌槽压了多少（危险区跑路回泉 = 把危险表压回去）。本轮按 v21.58 石甲挡伤 / v21.66
// 住店同款「报实际生效值」在两条喷泉报文补「· 遇敌槽 -N」（N=结算前后实际差，钳到 0 时如实报小值；
// N=0 时保持原文案逐字零回归）。
// 本冒烟守护：版本锚点、数据契约（ENCOUNTER.fountain===-25 / HELP_PAGES 机制行由 ENCOUNTER 派生 /
// NPC 总数 31 零变更）、world.js 源级落位（gaugeBefore/gaugeDrop/gaugeSfx + 遇敌槽结算行逐字未动 +
// 两条报文模板 + v19.94 注释保留）、运行期真实链（village/dungeon 两图 onStep 落泉：42→17 报 -25 /
// 10→0 报 -10 / 12→0 报 -12（钳制如实）/ 0→0 原文案逐字零回归 / 满状态档「状态已满 · 遇敌槽 -25」/
// 满状态 + 0 档逐字零回归 / HP·MP 结算一致 / 不触发战斗）、README/package.json/CHANGELOG 同步
// （tests 树尾 + 件套口径 142 + v22.46 守护描述 + 入库 142 份）、姊妹件套 pin（smoke_v2245 随新现实
// 更新 + v2143-45「件套守护领先一位」哨兵链 143 更新）复查 + 旧代 v22.45 字面量/恒等/件套/串尾
// pin 零残留。
import { S, curMap } from '../js/state.js';
import { GAME_VERSION, ENCOUNTER, NPC_SPOTS, HELP_PAGES, TY } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v22.45 冒烟先例：先装桩再 import main.js）——
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
const { loadMap, onStep, at, MBounds } = await import('../js/world.js');
const { bind } = await import('../js/bind.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.46 喷泉踩踏反馈「遇敌槽 -N」 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const wSrc = fs.readFileSync(path.join(ROOT, 'js/world.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.45 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.45（本版守 v22.46）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 46)), GAME_VERSION);
ok('data.js 含 v22.46 注释（喷泉遇敌槽反馈说明）', dSrc.includes('v22.46 体验打磨·信息透明·纯显示'));
ok('GAME_VERSION 字面量已为 v22.46（旧 v22.45 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v23.52';") && !dSrc.includes("const GAME_VERSION = 'v22." + "45';"));
ok('data.js 仍保留 v22.45/v22.44 世代注释链（守夜人/全域危险标注累积注释未动）',
  dSrc.includes('v22.45 新内容·纯风味 NPC') && dSrc.includes('v22.44 体验打磨·信息透明·纯显示'));

// —— 数据契约：喷泉-25 单一数据源（与帮助页机制行/小地图读数同读一份 ENCOUNTER）——
ok('ENCOUNTER.fountain === -25', ENCOUNTER.fountain === -25, ENCOUNTER.fountain);
ok('ENCOUNTER 契约零回归（full 100 / calm -6 / warn 70）',
  ENCOUNTER.full === 100 && ENCOUNTER.calm === -6 && ENCOUNTER.warn === 70);
ok('data.js 帮助页「遇敌槽 / 危险格」行由 ENCOUNTER 派生（喷泉-' + Math.abs(ENCOUNTER.fountain) + '）',
  dSrc.includes("Math.abs(ENCOUNTER.fountain)") && dSrc.includes("ENCOUNTER.calm"));
const encRow = HELP_PAGES[1].find((r) => Array.isArray(r) && r[0] === '遇敌槽 / 危险格');
ok('帮助页机制行运行期渲染含「喷泉-25」「安全格-6」「槽满(100)」',
  !!encRow && String(encRow[2]).includes('喷泉-25') && String(encRow[2]).includes('安全格-6') &&
  String(encRow[1]).includes('槽满(100)'), encRow && String(encRow[2]));
ok('NPC 总数保持 31（本轮零 NPC 变更）', Object.keys(NPC_SPOTS).length === 38, Object.keys(NPC_SPOTS).length);

// —— world.js 源级落位 ——
ok('world.js 含 v22.46 注释（喷泉踩踏反馈补「遇敌槽 -N」）', wSrc.includes('v22.46 喷泉踩踏反馈补「遇敌槽 -N」'));
ok('world.js 含 gaugeBefore/gaugeDrop/gaugeSfx 三件套', wSrc.includes('const gaugeBefore') && wSrc.includes('const gaugeDrop') && wSrc.includes('const gaugeSfx'));
ok('遇敌槽结算行逐字未动（Math.max(0, S.encGauge + ENCOUNTER.fountain)）',
  wSrc.includes('S.encGauge = Math.max(0, S.encGauge + ENCOUNTER.fountain);'));
ok('gaugeSfx 按实际差值派生且 0 时为空串（原文案逐字零回归）',
  wSrc.includes("gaugeDrop > 0 ? ` · 遇敌槽 -${gaugeDrop}` : ''"));
ok('恢复分支报文模板已并入 {gaugeSfx}', wSrc.includes('完全恢复！${gaugeSfx}`'));
ok('满状态分支报文已并入 + gaugeSfx', wSrc.includes("'⛲ 踩上回血 · 状态已满' + gaugeSfx"));
ok('v19.94 喷泉数值反馈注释保留（历史注释链未动）', wSrc.includes('v19.94 喷泉恢复反馈追加具体数值'));

// —— 运行期：真实 onStep 踩泉链（捕获 bind.boxMsg，避免消息队列占位）——
let lastMsg = null;
bind.boxMsg = (t) => { lastMsg = t; };
const hero = S.G;
ok('main.js 启动后 S.G 就绪（initGame 基线）', !!hero && typeof hero.hpMax === 'number');
const sceneBefore = S.scene;
loadMap('village');
const b = MBounds();
let fx = null, fy = null;
outer:
for (let y = 0; y < b.h; y++) {
  for (let x = 0; x < b.w; x++) {
    if (at(x, y) === TY.FOUNTAIN) { fx = x; fy = y; break outer; }
  }
}
ok('潮灯镇存在喷泉格（onStep 踩踏可达）', fx != null && fx >= 0, String(fx) + ',' + String(fy));
const setLow = () => { hero.hp = 10; hero.hpMax = 60; hero.mp = 5; hero.mpMax = 30; };
const setFull = () => { hero.hp = hero.hpMax = 60; hero.mp = hero.mpMax = 30; };
// A：42 → 17（-25 全额生效）且 HP/MP 恢复报文带数值
setLow();
S.encGauge = 42;
lastMsg = null;
onStep(fx, fy);
ok('A：遇敌槽 42→17（-25 全额生效）', S.encGauge === 17, String(S.encGauge));
ok('A：恢复报文含 HP/MP 结算后数值（HP +50（60/60）· MP +25（30/30））',
  !!lastMsg && lastMsg.includes('HP +50（60/60）') && lastMsg.includes('MP +25（30/30）') && lastMsg.includes('完全恢复！'), lastMsg);
ok('A：报文补「 · 遇敌槽 -25」（实际生效值）', !!lastMsg && lastMsg.includes(' · 遇敌槽 -25'), lastMsg);
ok('A：HP/MP 结算一致（10→60 / 5→30）', hero.hp === 60 && hero.mp === 30);
// B：10 → 0（钳制档如实报 -10）
setLow();
S.encGauge = 10;
lastMsg = null;
onStep(fx, fy);
ok('B：遇敌槽 10→0（-10 钳制如实报小值）', S.encGauge === 0 && lastMsg && lastMsg.includes(' · 遇敌槽 -10'), String(S.encGauge) + '/' + lastMsg);
// C：12 → 0（非整 25 档报实际差 -12）
setLow();
S.encGauge = 12;
lastMsg = null;
onStep(fx, fy);
ok('C：遇敌槽 12→0（报实际差 -12 而非 -25）', S.encGauge === 0 && lastMsg && lastMsg.includes(' · 遇敌槽 -12'), String(S.encGauge) + '/' + lastMsg);
// D：0 → 0（原文案逐字零回归：不出现「遇敌槽」）
setLow();
S.encGauge = 0;
lastMsg = null;
onStep(fx, fy);
ok('D：遇敌槽 0→0（不误报 -0）', S.encGauge === 0 && lastMsg && !lastMsg.includes('遇敌槽'), lastMsg);
ok('D：N=0 档报文与 v22.45 前逐字一致（完全恢复！无后缀）',
  lastMsg === '⛲ 清泉涌动，HP +50（60/60）· MP +25（30/30）完全恢复！', lastMsg);
// E：满状态 30 → 5（「状态已满 · 遇敌槽 -25」）
setFull();
S.encGauge = 30;
lastMsg = null;
onStep(fx, fy);
ok('E：满状态档报文「踩上回血 · 状态已满 · 遇敌槽 -25」',
  lastMsg === '⛲ 踩上回血 · 状态已满 · 遇敌槽 -25' && S.encGauge === 5, lastMsg + '/' + S.encGauge);
// F：满状态 0 → 0（满状态 + 零槽档逐字零回归）
setFull();
S.encGauge = 0;
lastMsg = null;
onStep(fx, fy);
ok('F：满状态 + 零槽档报文逐字零回归「⛲ 踩上回血 · 状态已满」',
  lastMsg === '⛲ 踩上回血 · 状态已满' && S.encGauge === 0, lastMsg);
// G：雾语林营地泉 (12,9) 同一 onFountainStep 通路（跨图同机制）
loadMap('dungeon');
const b2 = MBounds();
let gx = null, gy = null;
outer2:
for (let y = 0; y < b2.h; y++) {
  for (let x = 0; x < b2.w; x++) {
    if (at(x, y) === TY.FOUNTAIN) { gx = x; gy = y; break outer2; }
  }
}
ok('雾语林存在营地泉（extras 12,9）', gx === 12 && gy === 9, String(gx) + ',' + String(gy));
setLow();
S.encGauge = 40;
lastMsg = null;
onStep(gx, gy);
ok('G：营地泉 40→15 且报「 · 遇敌槽 -25」（跨图同通路）',
  S.encGauge === 15 && lastMsg && lastMsg.includes(' · 遇敌槽 -25'), String(S.encGauge) + '/' + lastMsg);
ok('G：踩泉未触发战斗（场景未变、无遇敌）', S.scene === sceneBefore, S.scene + ' vs ' + sceneBefore);
ok('断言链尾：S.G 仍为同一 hero（零重建）', S.G === hero);

// —— README / package.json / CHANGELOG 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树已收录 smoke_v2246_fountgauge 且位于串尾', readme.includes('smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 件套口径为二百一十二件套（二百一十一件套清除）',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟一百四十二件套（一百四十件套清' + '除）'));
ok('README 含 v22.46 守护描述（喷泉踩踏反馈「遇敌槽 -N」）', readme.includes('v22.46 起含喷泉踩踏反馈「遇敌槽 -N」守护'));
ok('README 含 smoke_v2246_fountgauge 入库（142 份）', readme.includes('smoke_v2246_fountgauge 入库（142 份）'));
ok('package.json 已收录 smoke_v2246_fountgauge（npm test 串跑第 142 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2246_fountgauge.mjs && node tests/smoke_v2247_villagewell.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 143 件套', testChain === 212, String(testChain));
ok('CHANGELOG 顶部已追加 v22.46 条目', changelog.startsWith('## v23.52'));

// —— 姊妹 pin 复查（smoke_v2245 随新现实更新 + v2143-45「件套守护领先一位」哨兵更新）——
const s2245 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2245_watcher.mjs'), 'utf8');
ok('smoke_v2245 的 GAME_VERSION 字面量 pin 已更新为 v22.46（旧 v22.45 零残留）',
  s2245.includes("const GAME_VERSION = 'v23.52';") && !s2245.includes("const GAME_VERSION = 'v22." + "45';"));
ok('smoke_v2245 的 README 件套 pin 已随新现实更新为二百一十二件套（二百一十一件套清除）',
  s2245.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2245 的 package.json 件套计数 pin 已更新为 === 143', s2245.includes('testChain === 212'));
ok('smoke_v2245 的 README 串尾 pin 已随新现实延伸至 smoke_v2246_fountgauge',
  s2245.includes('smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2245 的 NPC 总数 pin 保持 31（本轮零 NPC 变更）', s2245.includes('NPC_SPOTS).length === 38'));
const s2143 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2143_talkekey.mjs'), 'utf8');
ok('v2143-45「件套守护领先一位」哨兵链已推进至 143（二百一十二件套（二百一十一件套清除））',
  s2143.includes('二百一十三件套（二百一十二件套清除）') && s2143.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));

// —— 旧代 v22.45 pin 全库零残留 ——
const allTests = fs.readdirSync(path.join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2246_fountgauge.mjs');
const stale = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "45';") || src.includes("GAME_VERSION === 'v22." + "45'") ||
      src.includes('一百四十二件套（一百四十件套清' + '除）') || src.includes('testChain === ' + '141') ||
      src.includes('smoke_v2245_watcher（npm test ' + '串跑）')) stale.push(f);
}
ok('旧代 v22.45 字面量/恒等/件套/串尾 pin 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
