// v22.53 专项冒烟：帮助页「地图指南」星井矿脉/无字回廊行补「无泉水/旅店 · 出发前请补给」r[2] 指针
// （体验打磨·信息透明·纯文字，承 v22.48 地图指南补给/出口指针主线的收口）——四图行各列地标/机制，
// v22.48 后潮灯镇行有「东门→雾语林」出口、雾语林行有「中段营地泉水」补给，唯独星井矿脉/无字回廊
// 两行只列地标没有补给状态——而这两图恰是全游唯二没有泉水/旅店的图（v21.40 进图补给提醒 /
// world.transition「⚠️ {名}没有泉水/旅店 · 出发前请补给！」与 v22.32 快速旅行橙行早已同读
// hasRecoveryPoint 一份源，H 页战前知识中枢的静态一栏却查无此行）；现两行拆 r[1]+r[2] 补
// 「无泉水/旅店 · 出发前请补给」（行数不变仍 8、r[2] 数 3→5、末行基线 398 不触页脚 452）。
// 本冒烟守护：版本锚点、data.js 源级落位（两行 r[2] 逐字 + r[1] 零回归 + v22.53 注释 + 行数 8/r[2] 数 5）、
// 行宽预算（estW 口径 ≤470）、页长派生预算（末行基线 398 / 页脚 452）、数据契约（hasRecoveryPoint 实扫
// cave/gallery 无恢复点 / village·dungeon 有恢复点 + world.js v21.40 提醒源级同口径）、运行期实证
// （drawHelp 地图指南页真实渲染两处新 r[2] 落位 + 四图 Lv 行 + 通关之路金色收尾 + 其余三页零回归）、
// README/package.json/CHANGELOG 同步（tests 树尾 + 件套口径 149 + v22.53 守护描述 + 入库 149 份）、
// 姊妹件套 pin（smoke_v2252 随新现实更新 + v2143-45「件套守护领先一位」哨兵链 150 更新）复查 + 旧代
// v22.52 字面量/恒等/件套/串尾/CHANGELOG pin 全库零残留。
import { S } from '../js/state.js';
import { GAME_VERSION, HELP_PAGES, MAPS, hasRecoveryPoint } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v22.52 冒烟先例：先装桩再 import main.js；fillText 捕获供地图指南行断言）——
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
const { drawHelp } = await import('../js/view/menus.js');
const { CTX } = await import('../js/view/canvas.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.53 地图指南无泉水补给指针 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const wSrc = fs.readFileSync(path.join(ROOT, 'js/world.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.52 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.52（本版守 v22.53）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 53)), GAME_VERSION);
ok('data.js 含 v22.53 注释（无泉水补给指针说明）', dSrc.includes('v22.53 体验打磨·信息透明·纯文字'));
ok('GAME_VERSION 字面量已为 v22.53（旧 v22.52 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v23.26';") && !dSrc.includes("const GAME_VERSION = 'v22." + "52';"));
ok('data.js 仍保留 v22.52/v22.51 世代注释链（矿车轨道/记誓人累积注释未动）',
  dSrc.includes('v22.52 新内容·世界景观·纯显示') && dSrc.includes('v22.51 新内容·纯风味 NPC'));

// —— data.js 源级落位：地图指南两行 r[2] 指针 ——
ok('HELP_PAGES 导入成功且为四页结构（地图指南为第 2 页）', Array.isArray(HELP_PAGES) && HELP_PAGES.length === 4 && Array.isArray(HELP_PAGES[1]));
const guide = HELP_PAGES[1];
ok('地图指南行数保持 8（v22.37 图例/v22.43 机制行后为 8 行，本版只加 r[2] 不增行，短页 sp=34 档不变）', guide.length === 8, String(guide.length));
ok('星井矿脉行 r[2] 含「无泉水/旅店 · 出发前请补给」（与 v21.40/world.transition 同口径）',
  String(guide[2][2]).includes('无泉水/旅店 · 出发前请补给'), String(guide[2][2]));
ok('无字回廊行 r[2] 含「无泉水/旅店 · 出发前请补给」',
  String(guide[3][2]).includes('无泉水/旅店 · 出发前请补给'), String(guide[3][2]));
ok('星井矿脉行 r[1] 既有信息零回归（试炼碑/中央终焉水晶/双徽记化为门）',
  String(guide[2][1]).includes('试炼碑（可问守碑人）') && String(guide[2][1]).includes('中央终焉水晶') &&
  String(guide[2][1]).includes('双徽记化为门'), String(guide[2][1]));
ok('无字回廊行 r[1] 既有信息零回归（名字石碑/守名者(支线)/残焰魔像/终焉之神/极高难）',
  String(guide[3][1]).includes('名字石碑') && String(guide[3][1]).includes('守名者(支线)') &&
  String(guide[3][1]).includes('残焰魔像') && String(guide[3][1]).includes('终焉之神') && String(guide[3][1]).includes('极高难'));
ok('潮灯镇行/雾语林行逐字零回归（v22.48 出口/泉水指针未动）',
  String(guide[0][1]).includes('东门→雾语林') && String(guide[0][1]).includes('喷泉回血') &&
  String(guide[1][1]).includes('中段营地泉水') && String(guide[1][1]).includes('魔王祭坛'));
ok('地图指南页 r[2] 数 3→7（v22.53 新增两行次行 3→5、v22.78 潮灯镇拆 r[1]+r[2] 5→6、v22.87 通关之路行补 r[2] 6→7）',
  guide.reduce((a, r) => a + (r[2] ? 1 : 0), 0) === 7, String(guide.reduce((a, r) => a + (r[2] ? 1 : 0), 0)));
ok('data.js 含 v22.53 地图指南注释（四图行至此补给状态齐全）', dSrc.includes('四图行至此补给状态齐全'));

// —— 行宽预算（v21.11 estW 官方口径：汉字/全角 0.865em、·0.303em 等，@napi-rs 标定，误差 <6%；与 v2237 全页巡检同源）——
const estW = (s, size) => {
  let wsum = 0;
  for (const ch of String(s || '')) {
    const code = ch.codePointAt(0);
    const wide = (code >= 0x2e80 && code <= 0x9fff) || (code >= 0x3000 && code <= 0x303f) || (code >= 0xff00 && code <= 0xffef) || code >= 0x1f000;
    if (wide) wsum += 0.865 * size;
    else if (code === 0xb7) wsum += 0.303 * size;
    else if (code === 0x25) wsum += 0.56 * size;
    else if (code === 0x2b) wsum += 0.543 * size;
    else if (code === 0x2d) wsum += 0.432 * size;
    else if (code === 0x2f) wsum += 0.338 * size;
    else if (code === 0x2e) wsum += 0.226 * size;
    else if (code === 0x2014) wsum += 0.812 * size;
    else if (code >= 0x30 && code <= 0x39) wsum += 0.63 * size;
    else if (code === 0x20) wsum += 0.263 * size;
    else wsum += 0.55 * size;
  }
  return wsum;
};
const wR2 = estW(guide[2][2], 12);
ok('星井矿脉 r[2] 行宽估算 ' + wR2.toFixed(1) + ' ≤ 470 面板预算（12px 次行）', wR2 <= 470, String(wR2));
ok('无字回廊 r[2] 行宽估算 ' + estW(guide[3][2], 12).toFixed(1) + ' ≤ 470 面板预算', estW(guide[3][2], 12) <= 470);
let allOk = true;
guide.forEach((r) => {
  const wMain = estW(r[0] + '   ', 14) + estW(r[1], 14);
  if (wMain > 470) { allOk = false; console.log('    <- 越界行:', r[0], Math.round(wMain)); }
  if (r[2] && estW(r[2], 12) > 470) { allOk = false; console.log('    <- r2越界:', r[0]); }
});
ok('地图指南页全部 8 行（含新增两处 r[2]）估算宽 ≤470（全页行宽巡检）', allOk);

// —— 页长派生预算：末行基线 = 80 + (8-1)*34 + 6*16 = 414，不触页脚 452（v22.78 后 r[2] 数 5→6，398→414；
// v22.87 通关之路（末行）自带 r[2] 不推基线——r[2] 计数对末行主行用 slice(0,-1) 口径）——
ok('页长派生：末行基线 414 ≤440（页脚 452 之上留白，v19.59 式预算）',
  80 + (guide.length - 1) * 34 + (guide.slice(0, -1).reduce((a, r) => a + (r[2] ? 1 : 0), 0)) * 16 === 414,
  String(80 + (guide.length - 1) * 34 + (guide.slice(0, -1).reduce((a, r) => a + (r[2] ? 1 : 0), 0)) * 16));

// —— 数据契约：指针与地图事实逐字一致（hasRecoveryPoint 实扫单一数据源互证）——
ok('契约：星井矿脉无恢复点（hasRecoveryPoint(MAPS.cave) === false）', hasRecoveryPoint(MAPS.cave) === false, String(hasRecoveryPoint(MAPS.cave)));
ok('契约：无字回廊无恢复点（hasRecoveryPoint(MAPS.gallery) === false）', hasRecoveryPoint(MAPS.gallery) === false, String(hasRecoveryPoint(MAPS.gallery)));
ok('契约：潮灯镇/雾语林有恢复点（四图行补给状态齐全的对照端）',
  hasRecoveryPoint(MAPS.village) === true && hasRecoveryPoint(MAPS.dungeon) === true);
ok('契约：world.js 仍含 v21.40 进图补给提醒（「没有泉水/旅店 · 出发前请补给！」源级同口径）',
  wSrc.includes('没有泉水/旅店 · 出发前请补给'));

// —— 运行期实证：drawHelp 地图指南页真实渲染（fillText 捕获）——
function captureHelp() {
  const texts = [];
  const origFT = CTX.fillText;
  CTX.fillText = (t, x, y) => { texts.push({ t: String(t), x, y }); return origFT.call(CTX, t, x, y); };
  let threw = null;
  try {
    S.G = null; // 帮助页不依赖 S.G（world 画布由 drawWorld 内部防御）
    S.helpPage = 1;
    drawHelp();
  } catch (e) { threw = e; }
  CTX.fillText = origFT;
  return { texts, threw };
}
const cap = captureHelp();
const atY = (t, y) => cap.texts.some((x) => x.t.includes(t) && x.y === y);
ok('运行期：地图指南页渲染无抛错', cap.threw === null, cap.threw && cap.threw.message);
ok('运行期：星井矿脉行 r[2] 落位（无泉水/旅店 · 出发前请补给 @ y=182 12px 次级行，v22.78 后 166→182）', atY('无泉水/旅店 · 出发前请补给', 182));
ok('运行期：无字回廊行 r[2] 落位（同文案 @ y=232，v22.78 后 216→232）', atY('无泉水/旅店 · 出发前请补给', 232));
ok('运行期：r[2] 文案只以 12px 次级行出现两次（无主行误混）',
  cap.texts.filter((x) => x.t.includes('无泉水/旅店 · 出发前请补给')).length === 2,
  String(cap.texts.filter((x) => x.t.includes('无泉水/旅店 · 出发前请补给')).length));
ok('运行期：四图 Lv 行按 v22.78 后基线 80/130/164/214 落位（潮灯镇 80 不移、雾语林 114→130/星井矿脉 148→164/回廊主行 198→214 让位潮灯镇 r[2]）',
  atY('潮灯镇 Lv.', 80) && atY('雾语林 Lv.', 130) && atY('星井矿脉 Lv.', 164) && atY('无字回廊 Lv.', 214));
ok('运行期：通关之路金色收尾仍在末行（y=414，v22.78 后 398→414）',
  cap.texts.some((x) => x.t.includes('通关之路') && x.y === 414));
ok('运行期：页脚落位（y=452 第 2/4 页翻页提示）', atY('第 2/4 页', 452));
ok('运行期：其余三页渲染零回归（操作说明/魔物状态/试炼进阶不抛错）',
  (() => {
    for (const p of [0, 2, 3]) {
      S.helpPage = p;
      try { drawHelp(); } catch (e) { return false; }
    }
    S.helpPage = 1;
    return true;
  })());

// —— README / package.json / CHANGELOG 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树已收录 smoke_v2253_supplypoint 且位于串尾', readme.includes('smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 件套口径为二百一十二件套（二百一十一件套清除）',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟一百四十八件套（一百四十七件套清' + '除）'));
ok('README 含 v22.53 守护描述（地图指南无泉水补给指针）', readme.includes('v22.53 起含帮助页地图指南'));
ok('README 含 smoke_v2253_supplypoint 入库（149 份）', readme.includes('smoke_v2253_supplypoint 入库（149 份）'));
ok('package.json 已收录 smoke_v2253_supplypoint（npm test 串跑第 149 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2253_supplypoint.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 149 件套', testChain === 212, String(testChain));
ok('CHANGELOG 顶部已追加 v22.53 条目', changelog.startsWith('## v23.26'));

// —— 姊妹 pin 复查（smoke_v2252 随新现实更新 + v2143-45「件套守护领先一位」哨兵推进至 150）——
const s2252 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2252_rail.mjs'), 'utf8');
ok('smoke_v2252 的 GAME_VERSION 字面量 pin 已更新为 v22.53（旧 v22.52 零残留）',
  s2252.includes("const GAME_VERSION = 'v23.26';") && !s2252.includes("const GAME_VERSION = 'v22." + "52';"));
ok('smoke_v2252 的 README 件套 pin 已随新现实更新为二百一十二件套（二百一十一件套清除）',
  s2252.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2252 的 package.json 件套计数 pin 已更新为 === 149', s2252.includes('testChain === 212'));
ok('smoke_v2252 的 README 串尾 pin 已随新现实延伸至 smoke_v2253_supplypoint',
  s2252.includes('smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2252 的 CHANGELOG pin 已更新为 ## v22.53', s2252.includes("startsWith('## v23.26')"));
const s2143 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2143_talkekey.mjs'), 'utf8');
ok('v2143-45「件套守护领先一位」哨兵链已推进至 150（二百一十二件套（二百一十一件套清除））',
  s2143.includes('二百一十三件套（二百一十二件套清除）') && s2143.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));

// —— 旧代 v22.52 pin 全库零残留 ——
const allTests = fs.readdirSync(path.join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2253_supplypoint.mjs');
const stale = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "52';") || src.includes("GAME_VERSION === 'v22." + "52'") ||
      src.includes('一百四十八件套（一百四十七件套清' + '除）') || src.includes('testChain === ' + '148') ||
      src.includes('smoke_v2252_rail（npm test 串跑）') || src.includes("startsWith('## v22.52')")) stale.push(f);
}
ok('旧代 v22.52 字面量/恒等/件套/串尾/CHANGELOG pin 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
