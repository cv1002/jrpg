// v22.30 专项冒烟：Esc 暂停菜单「未存档 + 槽位占位」提示——体验打磨·防误丢档·信息透明·纯显示，
// 承 v22.10 beforeunload 离站守卫 / v22.28 标题页未存档警告同一「未落盘进度防丢失」主线：
// 标题页（drawTitle）与浏览器离站都有对 S.G && S.unsaved 的提醒，唯独 Esc 暂停菜单——玩家决定
// 「要不要存个档」的第一现场——没有：菜单头部只报槽号，玩家不知道当前冒险是否已落盘、按下 P 会
// 写进有存档的槽还是空槽。现补 pauseSaveHint 纯函数（文案派生）+ drawPause 面板底部一行（430，
// 页脚 412 之下、panel 底缘 440 之内），与 beforeunload 守卫同判 S.unsaved、槽位占位读
// core.hasSlot（与标题页存档槽行/删除确认同源），零结算零存档格式变化。
// 本冒烟守护：版本锚点、pauseSaveHint 纯函数四组合逐值、menus.js 源级落位（注释/调用点/绘制点）、
// 运行期 drawPause 渲染捕获（unsaved 真 → 橙行含槽位占位、unsaved 假 → 零「未存档」文字）、
// state.js S.unsaved 源级存在、README/package.json 同步（tests 树尾 + 件套口径 + v22.30 守护描述 +
// 入库 126 份）、姊妹件套 pin（v2229..v2225 随新现实更新）复查、旧代 v22.29 字面量/恒等/件套/树尾
// pin 零残留、断链防回归、index.html 壳要素零回归。
import { S } from '../js/state.js';
import { GAME_VERSION } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v22.29 冒烟先例：先装桩再 import main.js）——
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

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.30 暂停菜单未存档提示 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const menusSrc = read('js/view/menus.js');
const stateSrc = read('js/state.js');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.29 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.29', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 30)), GAME_VERSION);
ok('data.js 含 v22.30 注释（暂停菜单未存档提示说明）', dSrc.includes('v22.30 暂停菜单「未存档 + 槽位占位」提示'));
ok('GAME_VERSION 字面量已为 v22.30（旧 v22.29 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v23.73';") && !dSrc.includes("const GAME_VERSION = 'v22." + "29';"));
ok('data.js 仍保留 v22.29 历史注释（累积注释块，姊妹 pin 不失效）', dSrc.includes('v22.29 新成就「萍水相逢」'));

// —— pauseSaveHint 纯函数四组合逐值（「纯函数 + 渲染层只画」契约，无需构造渲染环境）——
const { pauseSaveHint } = await import('../js/view/menus.js');
ok('pauseSaveHint 导出且为函数', typeof pauseSaveHint === 'function');
ok('无进行中冒险（g=null）→ null（不误报：S.G 为空时标题/离站守卫同样不提醒）', pauseSaveHint(null, true, 1, false) === null);
ok('有冒险但已落盘（unsaved=false）→ null（读档/刚存档后零噪音）', pauseSaveHint({ name: 'x' }, false, 1, false) === null);
ok('unsaved + 槽有存档 → 「⚠️ 未存档 · 按 P 写入槽 1（已有存档，将覆盖）」',
  pauseSaveHint({ name: 'x' }, true, 1, true) === '⚠️ 未存档 · 按 P 写入槽 1（已有存档，将覆盖）',
  pauseSaveHint({ name: 'x' }, true, 1, true));
ok('unsaved + 空槽 → 「⚠️ 未存档 · 按 P 写入槽 3（空槽）」',
  pauseSaveHint({ name: 'x' }, true, 3, false) === '⚠️ 未存档 · 按 P 写入槽 3（空槽）',
  pauseSaveHint({ name: 'x' }, true, 3, false));

// —— menus.js 源级落位：注释标记 + drawPause 调用点 + 绘制点 + hasSlot 同源 ——
ok('menus.js 含 v22.30 注释（drawPause 未存档行说明）', menusSrc.includes('v22.30 暂停菜单「未存档 + 槽位占位」提示'));
ok('drawPause 经 pauseSaveHint 派生并落至 (320,430)',
  menusSrc.includes('const pHint = pauseSaveHint(S.G, S.unsaved, S.curSaveSlot, hasSlot(S.curSaveSlot));') &&
  menusSrc.includes("if (pHint) text(pHint, 320, 430, '12px', '#ff9d5b', 'center');"));
ok('hasSlot 已由既有 import 复用（core 同源，与标题页存档槽行/删除确认一致）',
  menusSrc.includes("import { hasSlot, hasSave, slotPreview, skillXpHint } from '../core.js';"));
ok('state.js S 注册表含 unsaved 字段（与 beforeunload 守卫/标题页警告同读一份源）',
  stateSrc.includes('unsaved: false'));

// —— 运行期：drawPause 真实渲染捕获（unsaved 真 → 橙行含槽位占位；unsaved 假 → 零「未存档」）——
{
  const { CTX } = await import('../js/view/canvas.js');
  const { drawPause } = await import('../js/view/menus.js');
  const cap = [];
  const origFt = CTX.fillText;
  CTX.fillText = (t, ...a) => { cap.push(String(t)); return origFt.call(CTX, t, ...a); };
  try {
    const hero = { name: '守灯人', level: 1 };
    S.G = hero;
    S.scene = 'pause';
    S.unsaved = true;
    S.curSaveSlot = 1;
    cap.length = 0;
    drawPause();
    ok('unsaved=true + 空槽：渲染捕获到「⚠️ 未存档 · 按 P 写入槽 1（空槽）」',
      cap.includes('⚠️ 未存档 · 按 P 写入槽 1（空槽）'), JSON.stringify(cap.filter((t) => t.includes('未存档'))));
    ok('同时仍绘制既有页脚「↑↓ 选择 · Enter/E 确定 · Esc 关闭」（零回归，页脚随 v22.83 Enter/E 口径）',
      cap.includes('↑↓ 选择  ·  Enter/E 确定  ·  Esc 关闭'));
    ok('菜单头部槽号行零回归（守灯人 · 槽 1）', cap.includes('守灯人  ·  槽 1'));
    cap.length = 0;
    S.unsaved = false;
    drawPause();
    ok('unsaved=false（已落盘）：零「未存档」文字（读档/刚存档后不误报噪音）',
      !cap.some((t) => t.includes('未存档')), JSON.stringify(cap.filter((t) => t.includes('未存档'))));
  } finally {
    CTX.fillText = origFt;
    S.G = null;
    S.scene = 'title';
    S.unsaved = false;
  }
}

// —— README / package.json / CHANGELOG 同步 ——
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');
ok('README tests 树收录 smoke_v2230_pausewarn 且位于串尾',
  readme.includes('smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend + smoke_v2238_starwell + smoke_v2240_tallgrass + smoke_v2241_gatearch + smoke_v2242_mushfield + smoke_v2243_encguide + smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 件套口径为二百一十二件套（二百一十一件套清除）',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟一百二十五件套（一百二十四件套清' + '除）'));
ok('README 含 v22.30 守护描述（暂停菜单未存档提示守护）', readme.includes('v22.30 起含暂停菜单未存档提示守护'));
ok('README 含 smoke_v2230_pausewarn 入库（126 份）', readme.includes('smoke_v2230_pausewarn 入库（126 份）'));
ok('README 仍保留 v22.29 历史守护描述（累积描述，姊妹 pin 不失效）', readme.includes('v22.29 起含「萍水相逢」图鉴已遭遇全收集里程碑守护'));
ok('package.json 已收录 smoke_v2230_pausewarn（npm test 串跑第 126 份）',
  pkg.includes('smoke_v2230_pausewarn.mjs') && /smoke_v2229_metall\.mjs && node tests\/smoke_v2230_pausewarn\.mjs && node tests\/smoke_v2231_smith\.mjs && node tests\/smoke_v2232_travelsup\.mjs && node tests\/smoke_v2233_nameflavor\.mjs && node tests\/smoke_v2234_innkeeper\.mjs && node tests\/smoke_v2235_minimapquest\.mjs && node tests\/smoke_v2236_villagelamp\.mjs && node tests\/smoke_v2237_minimaplegend\.mjs && node tests\/smoke_v2238_starwell\.mjs && node tests\/smoke_v2239_minercart\.mjs && node tests\/smoke_v2240_tallgrass\.mjs && node tests\/smoke_v2241_gatearch.mjs && node tests\/smoke_v2242_mushfield.mjs && node tests\/smoke_v2243_encguide.mjs && node tests\/smoke_v2244_fulldanger.mjs && node tests\/smoke_v2245_watcher.mjs && node tests\/smoke_v2246_fountgauge.mjs && node tests\/smoke_v2247_villagewell.mjs && node tests\/smoke_v2248_mapguide.mjs && node tests\/smoke_v2249_shopkeep.mjs && node tests\/smoke_v2250_brewer.mjs && node tests\/smoke_v2251_oathkeep.mjs && node tests\/smoke_v2252_rail.mjs && node tests\/smoke_v2253_supplypoint.mjs && node tests\/smoke_v2254_grainfield.mjs && node tests\/smoke_v2255_steleglow.mjs && node tests\/smoke_v2256_campfire.mjs && node tests\/smoke_v2257_pondglow.mjs && node tests\/smoke_v2258_potionhelp.mjs && node tests\/smoke_v2259_sandpile.mjs && node tests\/smoke_v2260_fountripple.mjs && node tests\/smoke_v2261_rich3.mjs && node tests\/smoke_v2262_crystal.mjs && node tests\/smoke_v2263_ptime3.mjs && node tests\/smoke_v2264_hunt3.mjs && node tests\/smoke_v2265_lucky3.mjs && node tests\/smoke_v2266_stock3.mjs && node tests\/smoke_v2267_elixir3.mjs && node tests\/smoke_v2268_brew3.mjs && node tests\/smoke_v2269_mush3.mjs && node tests\/smoke_v2270_outstep.mjs && node tests\/smoke_v2271_outstep2.mjs && node tests\/smoke_v2272_scholar2.mjs && node tests\/smoke_v2273_seen5.mjs && node tests\/smoke_v2274_seen2\.mjs && node tests\/smoke_v2275_codexempty\.mjs && node tests\/smoke_v2276_lampkid\.mjs && node tests\/smoke_v2277_pondhint\.mjs && node tests\/smoke_v2278_mushguide\.mjs && node tests\/smoke_v2279_lampwell\.mjs && node tests\/smoke_v2280_grainfield\.mjs && node tests\/smoke_v2281_starwell\.mjs && node tests\/smoke_v2282_archgate\.mjs && node tests\/smoke_v2283_menuekey\.mjs && node tests\/smoke_v2284_skillekey\.mjs && node tests\/smoke_v2285_winekey\.mjs && node tests\/smoke_v2286_titleekey\.mjs && node tests\/smoke_v2287_trueroute\.mjs && node tests\/smoke_v2288_scrollhint\.mjs && node tests\/smoke_v2289_winprog\.mjs && node tests\/smoke_v2290_statlink\.mjs && node tests\/smoke_v2291_lampguide\.mjs && node tests\/smoke_v2292_cavewatch\.mjs && node tests\/smoke_v2293_deadsave\.mjs && node tests\/smoke_v2294_crystalwatch\.mjs && node tests\/smoke_v2295_deadprog\.mjs && node tests\/smoke_v2296_endingprog\.mjs && node tests\/smoke_v2297_chestmid\.mjs && node tests\/smoke_v2298_encnum\.mjs && node tests\/smoke_v2299_crosslink\.mjs && node tests\/smoke_v2300_sidemore\.mjs && node tests\/smoke_v2301_eco\.mjs && node tests\/smoke_v2302_cmdprev\.mjs && node tests\/smoke_v2303_rushnum\.mjs && node tests\/smoke_v2304_achgoal\.mjs && node tests\/smoke_v2305_monnum\.mjs && node tests\/smoke_v2306_skillnum\.mjs && node tests\/smoke_v2307_bossnum\.mjs && node tests\/smoke_v2308_diffnum\.mjs && node tests\/smoke_v2309_questnum\.mjs && node tests\/smoke_v2310_diffsum\.mjs && node tests\/smoke_v2311_fragprev\.mjs && node tests\/smoke_v2312_voltitle\.mjs && node tests\/smoke_v2313_talkall\.mjs && node tests\/smoke_v2314_voices\.mjs && node tests\/smoke_v2315_talkfoot\.mjs && node tests\/smoke_v2316_voiceshead\.mjs"/.test(pkg));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 126 件套', testChain === 212, String(testChain));
ok('CHANGELOG 含 v22.30 条目', changelog.includes('## v22.30 '));

// —— 姊妹件套 pin 复查（v21.7 惯例：本版冒烟守护姊妹随新现实更新）——
const s2229 = read('tests/smoke_v2229_metall.mjs');
const s2228 = read('tests/smoke_v2228_titlesave.mjs');
const s2227 = read('tests/smoke_v2227_minstrel.mjs');
const s2226 = read('tests/smoke_v2226_chestprogress.mjs');
const s2225 = read('tests/smoke_v2225_stonecarver.mjs');
ok('smoke_v2229 的 GAME_VERSION 字面量 pin 已更新为 v22.30', s2229.includes("const GAME_VERSION = 'v23.73';"));
ok('smoke_v2229 的 GAME_VERSION 恒等 pin 已更新为 === v22.30', s2229.includes("GAME_VERSION === 'v23.73'"));
ok('smoke_v2229 的 README 件套 pin 已更新为二百一十二件套（二百一十一件套清除）',
  s2229.includes('smoke_v2230_pausewarn\\.mjs && node tests\\/smoke_v2231_smith\\.mjs && node tests\\/smoke_v2232_travelsup\\.mjs && node tests\\/smoke_v2233_nameflavor\\.mjs && node tests\\/smoke_v2234_innkeeper\\.mjs && node tests\\/smoke_v2235_minimapquest\\.mjs && node tests\\/smoke_v2236_villagelamp\\.mjs && node tests\\/smoke_v2237_minimaplegend\\.mjs && node tests\\/smoke_v2238_starwell\\.mjs && node tests\\/smoke_v2239_minercart\\.mjs && node tests\\/smoke_v2240_tallgrass\\.mjs && node tests\\/smoke_v2241_gatearch.mjs && node tests\\/smoke_v2242_mushfield.mjs && node tests\\/smoke_v2243_encguide.mjs && node tests\\/smoke_v2244_fulldanger.mjs && node tests\\/smoke_v2245_watcher.mjs && node tests\\/smoke_v2246_fountgauge.mjs && node tests\\/smoke_v2247_villagewell.mjs && node tests\\/smoke_v2248_mapguide.mjs && node tests\\/smoke_v2249_shopkeep.mjs && node tests\\/smoke_v2250_brewer.mjs && node tests\\/smoke_v2251_oathkeep.mjs && node tests\\/smoke_v2252_rail.mjs && node tests\\/smoke_v2253_supplypoint.mjs && node tests\\/smoke_v2254_grainfield.mjs && node tests\\/smoke_v2255_steleglow.mjs && node tests\\/smoke_v2256_campfire.mjs && node tests\\/smoke_v2257_pondglow.mjs && node tests\\/smoke_v2258_potionhelp.mjs && node tests\\/smoke_v2259_sandpile.mjs && node tests\\/smoke_v2260_fountripple.mjs && node tests\\/smoke_v2261_rich3.mjs && node tests\\/smoke_v2262_crystal.mjs && node tests\\/smoke_v2263_ptime3.mjs && node tests\\/smoke_v2264_hunt3.mjs && node tests\\/smoke_v2265_lucky3.mjs && node tests\\/smoke_v2266_stock3.mjs && node tests\\/smoke_v2267_elixir3.mjs && node tests\\/smoke_v2268_brew3.mjs && node tests\\/smoke_v2269_mush3.mjs && node tests\\/smoke_v2270_outstep.mjs && node tests\\/smoke_v2271_outstep2.mjs && node tests\\/smoke_v2272_scholar2.mjs && node tests\\/smoke_v2273_seen5.mjs && node tests\\/smoke_v2274_seen2\\.mjs && node tests\\/smoke_v2275_codexempty\\.mjs && node tests\\/smoke_v2276_lampkid\\.mjs && node tests\\/smoke_v2277_pondhint\\.mjs && node tests\\/smoke_v2278_mushguide\\.mjs && node tests\\/smoke_v2279_lampwell\\.mjs && node tests\\/smoke_v2280_grainfield\\.mjs && node tests\\/smoke_v2281_starwell\\.mjs && node tests\\/smoke_v2282_archgate\\.mjs && node tests\\/smoke_v2283_menuekey\\.mjs && node tests\\/smoke_v2284_skillekey\\.mjs && node tests\\/smoke_v2285_winekey\\.mjs && node tests\\/smoke_v2286_titleekey\\.mjs && node tests\\/smoke_v2287_trueroute\\.mjs && node tests\\/smoke_v2288_scrollhint\\.mjs && node tests\\/smoke_v2289_winprog\\.mjs && node tests\\/smoke_v2290_statlink\\.mjs && node tests\\/smoke_v2291_lampguide\\.mjs && node tests\\/smoke_v2292_cavewatch\\.mjs && node tests\\/smoke_v2293_deadsave\\.mjs && node tests\\/smoke_v2294_crystalwatch\\.mjs && node tests\\/smoke_v2295_deadprog\\.mjs && node tests\\/smoke_v2296_endingprog\\.mjs && node tests\\/smoke_v2297_chestmid\\.mjs && node tests\\/smoke_v2298_encnum\\.mjs && node tests\\/smoke_v2299_crosslink\\.mjs && node tests\\/smoke_v2300_sidemore\\.mjs && node tests\\/smoke_v2301_eco\\.mjs && node tests\\/smoke_v2302_cmdprev\\.mjs && node tests\\/smoke_v2303_rushnum\\.mjs && node tests\\/smoke_v2304_achgoal\\.mjs && node tests\\/smoke_v2305_monnum\\.mjs && node tests\\/smoke_v2306_skillnum\\.mjs && node tests\\/smoke_v2307_bossnum\\.mjs && node tests\\/smoke_v2308_diffnum\\.mjs && node tests\\/smoke_v2309_questnum\\.mjs && node tests\\/smoke_v2310_diffsum\\.mjs && node tests\\/smoke_v2311_fragprev\\.mjs && node tests\\/smoke_v2312_voltitle\\.mjs && node tests\\/smoke_v2313_talkall\\.mjs && node tests\\/smoke_v2314_voices\\.mjs && node tests\\/smoke_v2315_talkfoot\\.mjs && node tests\\/smoke_v2316_voiceshead\\.mjs"'));
ok('smoke_v2229 的 README 树尾 pin 已更新为 + smoke_v2230_pausewarn',
  s2229.includes('smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend + smoke_v2238_starwell + smoke_v2240_tallgrass + smoke_v2241_gatearch + smoke_v2242_mushfield + smoke_v2243_encguide + smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2229 的 package.json 件套计数 pin 已更新为 === 126', s2229.includes('testChain === 212'));
ok('smoke_v2229 的 package.json 串尾 pin 已更新为 + smoke_v2232_travelsup',
  s2229.includes('smoke_v2230_pausewarn\\.mjs && node tests\\/smoke_v2231_smith\\.mjs && node tests\\/smoke_v2232_travelsup\\.mjs && node tests\\/smoke_v2233_nameflavor\\.mjs && node tests\\/smoke_v2234_innkeeper\\.mjs && node tests\\/smoke_v2235_minimapquest\\.mjs && node tests\\/smoke_v2236_villagelamp\\.mjs && node tests\\/smoke_v2237_minimaplegend\\.mjs && node tests\\/smoke_v2238_starwell\\.mjs && node tests\\/smoke_v2239_minercart\\.mjs && node tests\\/smoke_v2240_tallgrass\\.mjs && node tests\\/smoke_v2241_gatearch.mjs && node tests\\/smoke_v2242_mushfield.mjs && node tests\\/smoke_v2243_encguide.mjs && node tests\\/smoke_v2244_fulldanger.mjs && node tests\\/smoke_v2245_watcher.mjs && node tests\\/smoke_v2246_fountgauge.mjs && node tests\\/smoke_v2247_villagewell.mjs && node tests\\/smoke_v2248_mapguide.mjs && node tests\\/smoke_v2249_shopkeep.mjs && node tests\\/smoke_v2250_brewer.mjs && node tests\\/smoke_v2251_oathkeep.mjs && node tests\\/smoke_v2252_rail.mjs && node tests\\/smoke_v2253_supplypoint.mjs && node tests\\/smoke_v2254_grainfield.mjs && node tests\\/smoke_v2255_steleglow.mjs && node tests\\/smoke_v2256_campfire.mjs && node tests\\/smoke_v2257_pondglow.mjs && node tests\\/smoke_v2258_potionhelp.mjs && node tests\\/smoke_v2259_sandpile.mjs && node tests\\/smoke_v2260_fountripple.mjs && node tests\\/smoke_v2261_rich3.mjs && node tests\\/smoke_v2262_crystal.mjs && node tests\\/smoke_v2263_ptime3.mjs && node tests\\/smoke_v2264_hunt3.mjs && node tests\\/smoke_v2265_lucky3.mjs && node tests\\/smoke_v2266_stock3.mjs && node tests\\/smoke_v2267_elixir3.mjs && node tests\\/smoke_v2268_brew3.mjs && node tests\\/smoke_v2269_mush3.mjs && node tests\\/smoke_v2270_outstep.mjs && node tests\\/smoke_v2271_outstep2.mjs && node tests\\/smoke_v2272_scholar2.mjs && node tests\\/smoke_v2273_seen5.mjs && node tests\\/smoke_v2274_seen2\\.mjs && node tests\\/smoke_v2275_codexempty\\.mjs && node tests\\/smoke_v2276_lampkid\\.mjs && node tests\\/smoke_v2277_pondhint\\.mjs && node tests\\/smoke_v2278_mushguide\\.mjs && node tests\\/smoke_v2279_lampwell\\.mjs && node tests\\/smoke_v2280_grainfield\\.mjs && node tests\\/smoke_v2281_starwell\\.mjs && node tests\\/smoke_v2282_archgate\\.mjs && node tests\\/smoke_v2283_menuekey\\.mjs && node tests\\/smoke_v2284_skillekey\\.mjs && node tests\\/smoke_v2285_winekey\\.mjs && node tests\\/smoke_v2286_titleekey\\.mjs && node tests\\/smoke_v2287_trueroute\\.mjs && node tests\\/smoke_v2288_scrollhint\\.mjs && node tests\\/smoke_v2289_winprog\\.mjs && node tests\\/smoke_v2290_statlink\\.mjs && node tests\\/smoke_v2291_lampguide\\.mjs && node tests\\/smoke_v2292_cavewatch\\.mjs && node tests\\/smoke_v2293_deadsave\\.mjs && node tests\\/smoke_v2294_crystalwatch\\.mjs && node tests\\/smoke_v2295_deadprog\\.mjs && node tests\\/smoke_v2296_endingprog\\.mjs && node tests\\/smoke_v2297_chestmid\\.mjs && node tests\\/smoke_v2298_encnum\\.mjs && node tests\\/smoke_v2299_crosslink\\.mjs && node tests\\/smoke_v2300_sidemore\\.mjs && node tests\\/smoke_v2301_eco\\.mjs && node tests\\/smoke_v2302_cmdprev\\.mjs && node tests\\/smoke_v2303_rushnum\\.mjs && node tests\\/smoke_v2304_achgoal\\.mjs && node tests\\/smoke_v2305_monnum\\.mjs && node tests\\/smoke_v2306_skillnum\\.mjs && node tests\\/smoke_v2307_bossnum\\.mjs && node tests\\/smoke_v2308_diffnum\\.mjs && node tests\\/smoke_v2309_questnum\\.mjs && node tests\\/smoke_v2310_diffsum\\.mjs && node tests\\/smoke_v2311_fragprev\\.mjs && node tests\\/smoke_v2312_voltitle\\.mjs && node tests\\/smoke_v2313_talkall\\.mjs && node tests\\/smoke_v2314_voices\\.mjs && node tests\\/smoke_v2315_talkfoot\\.mjs && node tests\\/smoke_v2316_voiceshead\\.mjs"'));
ok('smoke_v2228 的 GAME_VERSION 字面量 pin 已更新为 v22.30', s2228.includes("const GAME_VERSION = 'v23.73';"));
ok('smoke_v2228 的 README 树尾 pin 已更新为 + smoke_v2230_pausewarn',
  s2228.includes('smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend + smoke_v2238_starwell + smoke_v2240_tallgrass + smoke_v2241_gatearch + smoke_v2242_mushfield + smoke_v2243_encguide + smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2227 的 README 树尾 pin 已更新为 + smoke_v2230_pausewarn',
  s2227.includes('smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend + smoke_v2238_starwell + smoke_v2240_tallgrass + smoke_v2241_gatearch + smoke_v2242_mushfield + smoke_v2243_encguide + smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2226 的 README 件套 pin 已更新为二百一十二件套（二百一十一件套清除）',
  s2226.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2225 的 README 树尾 pin 已更新为 + smoke_v2230_pausewarn',
  s2225.includes('smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend + smoke_v2238_starwell + smoke_v2240_tallgrass + smoke_v2241_gatearch + smoke_v2242_mushfield + smoke_v2243_encguide + smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));

// —— 旧代 pin 零残留：全部测试文件不得再含 v22.29 字面量/恒等/件套/树尾 pin（拆串构造避免自匹配）——
let stale = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read('tests/' + f);
  if (src.includes("const GAME_VERSION = 'v22." + "29';")) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v22.29 全库清零）', stale.length === 0, stale.join(','));
let staleId = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read('tests/' + f);
  if (src.includes("GAME_VERSION === 'v22." + "29'")) staleId.push(f);
}
ok('旧代 GAME_VERSION 恒等 pin 零残留（===v22.29 全库清零）', staleId.length === 0, staleId.join(','));
let staleSuite = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read('tests/' + f);
  if (src.includes('冒烟一百二十五件套（一百二十四件套清' + '除）')) staleSuite.push(f);
}
ok('旧代件套 pin 零残留（冒烟一百二十五件套（一百二十四件套清' + '除）全库清零）', staleSuite.length === 0, staleSuite.join(','));
let staleTail = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read('tests/' + f);
  if (src.includes('smoke_v2228_titlesave + smoke_v2229_metall（npm test 串' + '跑）')) staleTail.push(f);
}
ok('旧代树尾 pin 零残留（smoke_v2228_titlesave + smoke_v2229_metall 串全库清零）', staleTail.length === 0, staleTail.join(','));
// 断链防回归：不得出现 v2229_metall 被新尾吞并的坏链（smoke_v2228_titlesave 直接接 smoke_v2230_pausewarn）
let brokenTail = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read('tests/' + f);
  if (src.includes('smoke_v2228_titlesave + smoke_v2230_pausewarn（npm test 串' + '跑）')) brokenTail.push(f);
}
if (readme.includes('smoke_v2228_titlesave + smoke_v2230_pausewarn（npm test 串' + '跑）')) brokenTail.push('README.md');
ok('坏链 pin 零残留（v2229_metall 吞并链全库清零）', brokenTail.length === 0, brokenTail.join(','));

// —— index.html 壳要素零回归 ——
const html = read('index.html');
ok('index.html 壳要素零回归（canvas 640×480 + js/main.js 模块入口 + hud/quest/msg）',
  html.includes('<canvas id="game" width="640" height="480">') && html.includes('<script type="module" src="js/main.js') &&
  html.includes('id="hud"') && html.includes('id="quest"') && html.includes('id="msg"') &&
  html.includes('<title>潮灯记 · JRPG</title>'));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
