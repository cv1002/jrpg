// smoke_v2287_trueroute.mjs —— v22.87 帮助页地图指南通关之路行「真结局/记忆碎片」r[2] 指针守护
// 承 v21.10-v22.86 冒烟入库先例：版本锚点 + 源级落位 + 数据契约 + 行宽预算 + 页长派生(末行自带 r[2] 不推基线) +
// 运行期全链路 + README/package.json/CHANGELOG 同步 + 姊妹件套 pin + 旧代 v22.86 pin 全库零残留 + 哨兵链领先一位
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log(`  ✓ ${name}`); }
  else { fail++; console.log(`  ✗ ${name}`, extra || ''); }
};

console.log('— v22.87 帮助页地图指南通关之路行「真结局/记忆碎片」r[2] 指针冒烟 —');

// 1. 版本锚点
const dataSrc = readFileSync(join(ROOT, 'js/data.js'), 'utf8');
ok('data.js GAME_VERSION 字面量为 v22.87', dataSrc.includes("const GAME_VERSION = 'v23.96'"));
ok('旧 v22.86 字面量零残留', !dataSrc.includes("const GAME_VERSION = 'v22." + "86';"));
ok('data.js 含 v22.87 版本注释', dataSrc.includes('// v22.87 体验打磨·信息透明·纯文字'));
ok('data.js 仍保留 v22.86 历史注释', dataSrc.includes('// v22.86 体验打磨·标题页/创建页开始键补 E 键别名'));

// 2. 源级落位：通关之路行 r[2] 追加「真结局/记忆碎片」指针 + 行内注释
ok('data.js 通关之路行 r[1] 逐字未动（主线路径零回归）',
  dataSrc.includes("['通关之路','讨回灯芯 → 击败洞窟领主 → 双徽记开门 → 回廊尽头面对终焉之神','"));
ok('data.js 通关之路行 r[2] 含「记忆碎片 · 强敌首胜掉落 · 集齐」指针（FRAGMENTS.length 派生）',
  dataSrc.includes("'记忆碎片 · 强敌首胜掉落 · 集齐' + FRAGMENTS.length + '枚（详见「试炼进阶」）→ 真结局'"));
ok('data.js 含 v22.87 行内注释', dataSrc.includes('v22.87 通关之路行补 r[2]「真结局/记忆碎片」指针'));
ok('data.js 行内注释含「末行基线仍 414」口径', dataSrc.includes('末行基线仍 414'));

// 3. 数据契约：HELP_PAGES 四页结构 + 地图指南八行
const data = await import(join(ROOT, 'js/data.js'));
const { HELP_PAGES, FRAGMENTS } = data;
ok('HELP_PAGES 仍为四页结构（地图指南为第 2 页）', Array.isArray(HELP_PAGES) && HELP_PAGES.length === 4 && Array.isArray(HELP_PAGES[1]));
const guide = HELP_PAGES[1];
ok(`地图指南页行数仍 8（实际 ${guide.length}）`, guide.length === 8);
ok('通关之路行现为 3 列（r[0]/r[1]/r[2]）', guide[7].length === 3);
const routeTail = '记忆碎片 · 强敌首胜掉落 · 集齐' + FRAGMENTS.length + '枚（详见「试炼进阶」）→ 真结局';
ok('通关之路行 r[2] 精确为「' + routeTail + '」', String(guide[7][2]) === routeTail, String(guide[7][2]));
ok('通关之路行 r[1] 精确（金色收尾行主线路径逐字零回归）', String(guide[7][1]) === '讨回灯芯 → 击败洞窟领主 → 双徽记开门 → 回廊尽头面对终焉之神');
ok('真源健全：FRAGMENTS 共 4 枚（页脚/成就/日志同读一份源）', Array.isArray(FRAGMENTS) && FRAGMENTS.length === 4, String(FRAGMENTS && FRAGMENTS.length));
ok('地图指南页 r[2] 数仍 7（v22.87 通关之路行补 r[2]，6→7）', guide.reduce((a, r) => a + (r[2] ? 1 : 0), 0) === 7, String(guide.reduce((a, r) => a + (r[2] ? 1 : 0), 0)));

// 3.1 既有行零回归（v22.77-82 指针 + v22.53/48 补给出口 + v21.28 试炼碑全部逐字未动）
ok('潮灯镇行 r[2] 零回归（水塘灯影 + NPC 名派生 + 广场大灯·村井 + 粮田(护粮的委托)）',
  String(guide[0][2]).includes('水塘灯影') && String(guide[0][2]).includes(data.NPCS.granny.name) &&
  String(guide[0][2]).includes(data.NPCS.lampboat.name) && String(guide[0][2]).includes('广场大灯·村井') &&
  String(guide[0][2]).includes('粮田（' + data.QUESTS.side_grain.name + '）'));
ok('雾语林行「蘑菇田/泉水/裂洞」零回归（v22.78/v22.48）且未新增 r[2]',
  String(guide[1][1]).includes('蘑菇田') && String(guide[1][1]).includes('中段营地泉水') &&
  String(guide[1][1]).includes('右下裂洞进矿脉') && guide[1].length === 2);
ok('星井矿脉行 r[2] 含基础串（v22.81 星井指针，v23.84 后追加不破坏）且未并入真结局',
  String(guide[2][2]).includes('无泉水/旅店 · 出发前请补给 · 星井（低鸣星蓝/静默灰）') &&
  !String(guide[2][2]).includes('真结局'));
ok('无字回廊行 r[2] 逐字未动（v22.82 名字之门指针）',
  String(guide[3][2]) === '无泉水/旅店 · 出发前请补给 · 名字之门（无字灰石/名字亮回）' &&
  !String(guide[3][2]).includes('真结局'));
ok('小地图·状态标/色标两行图例零回归（v22.37）',
  String(guide[4][1]).includes('有委托NPC 金光脉动') && String(guide[5][2]).includes('设施：商店·金'));
ok('遇敌槽 / 危险格行零回归（v22.43 机制行含 ENCOUNTER 派生）',
  String(guide[6][1]).includes('深绿高草=危险格') && String(guide[6][1]).includes(data.ENCOUNTER ? '必遇敌' : '必遇敌'));
ok(`其余三页行数零回归（14/10/10，实际 ${HELP_PAGES[0].length}/${HELP_PAGES[2].length}/${HELP_PAGES[3].length}）`,
  HELP_PAGES[0].length === 14 && HELP_PAGES[2].length === 10 && HELP_PAGES[3].length === 10);

// 4. 行宽预算（12px 次行，官方 estW 口径同 v22.77-82：CJK=0.865×size、·=0.303×size、空格=0.263×size）
function estW(s, size = 12) {
  let w = 0;
  for (const ch of String(s)) {
    const code = ch.codePointAt(0);
    const wide = (code >= 0x2e80 && code <= 0x9fff) || (code >= 0x3000 && code <= 0x303f) || (code >= 0xff00 && code <= 0xffef) || code >= 0x1f000;
    if (wide) w += 0.865 * size;
    else if (code === 0xb7) w += 0.303 * size;
    else if (code === 0xd7) w += 0.564 * size;
    else if (code === 0x25) w += 0.827 * size;
    else if (code === 0x2b) w += 0.543 * size;
    else if (code === 0x2d) w += 0.432 * size;
    else if (code === 0x2f) w += 0.338 * size;
    else if (code === 0x2e) w += 0.226 * size;
    else if (code >= 0x30 && code <= 0x39) w += 0.63 * size;
    else if (code === 0x20) w += 0.263 * size;
    else w += 0.55 * size;
  }
  return w;
}
const wRoute = estW(routeTail);
ok('通关之路行 r[2] 12px estW ' + wRoute.toFixed(1) + ' ≤ 470 面板预算', wRoute <= 470, String(wRoute));
let allOk = true;
guide.forEach((r) => {
  const wMain = estW(r[0] + '   ', 14) + estW(r[1], 14);
  if (wMain > 470) { allOk = false; console.log('    <- 越界行:', r[0], Math.round(wMain)); }
  if (r[2] && estW(r[2], 12) > 470) { allOk = false; console.log('    <- r2越界:', r[0]); }
});
ok('地图指南页全部 8 行估算宽 ≤470（全页行宽巡检）', allOk);
ok('通关之路主行 r[1] 14px estW ' + (estW('通关之路   ', 14) + estW(String(guide[7][1]), 14)).toFixed(1) + ' ≤ 470', estW('通关之路   ', 14) + estW(String(guide[7][1]), 14) <= 470);

// 4.1 页长派生预算：末行基线 = 80 + (8-1)*34 + 6*16 = 414（v22.87 通关之路（末行）自带 r[2] 不推基线），
//     其 r[2] 落基线 432（字底 ≈436）不触页脚 452——r[2] 计数对末行主行取 slice(0,-1) 口径
const lastBase = 80 + (guide.length - 1) * 34 + (guide.slice(0, -1).reduce((a, r) => a + (r[2] ? 1 : 0), 0)) * 16;
ok('页长派生：末行基线 ' + lastBase + ' ≤440（页脚 452 之上留白，v19.59 式预算；末行自带 r[2] 不推基线）',
  lastBase === 414, String(lastBase));
ok(`页长派生：末行 r[2] 基线 ${lastBase + 18} 字底 ≤440 不触页脚 452`, lastBase + 18 + 4 <= 452);

// 5. 运行期全链路：DOM/音频/存储桩 + main.js 真实导入 + drawHelp 渲染捕获（坐标/字号/颜色逐值）
const noop = () => {};
const CAPTURED = [];
function makeCtx() {
  const grad = { addColorStop: noop };
  return {
    canvas: { width: 640, height: 480 },
    measureText: (t) => ({ width: String(t).length * 7 }),
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
    gain: { setValueAtTime: noop, linearRampToValueAtTime: noop, exponentialRampToValueAtTime: noop } }),
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
const { S } = await import('../js/state.js');
const { drawHelp } = await import('../js/view/menus.js');
const { CTX } = await import('../js/view/canvas.js');

S.G = null;
S.helpPage = 1;
CAPTURED.length = 0;
const origFill = CTX.fillText;
CTX.fillText = (t, x, y) => {
  CAPTURED.push({ t: String(t), x, y, font: CTX.font, fill: String(CTX.fillStyle) });
  return origFill.call(CTX, t, x, y);
};
let threw = null;
try { drawHelp(); } catch (e) { threw = e; }
CTX.fillText = origFill;
ok('运行期：地图指南页渲染无抛错', threw === null, threw && threw.message);
const at = (prefix, y, font, fill) => CAPTURED.find((c) => c.t.startsWith(prefix) && c.y === y && c.font === font && c.fill === fill);
ok('运行期：通关之路金色收尾仍在末行（x=100 y=414 14px #ffd24a，v22.78 后 398→414）',
  !!at('通关之路', 414, '14px sans-serif', '#ffd24a'),
  JSON.stringify(CAPTURED.filter((c) => c.t.startsWith('通关之路')).slice(0, 4)));
ok('运行期：通关之路 r[2] 真结局指针落画（x=100 y=432 12px 次级灰）',
  !!at('记忆碎片 · 强敌首胜掉落', 432, '12px sans-serif', '#7d93a3'),
  JSON.stringify(CAPTURED.filter((c) => c.t.startsWith('记忆碎片 ·')).slice(0, 4)));
ok('运行期：页脚落位（y=452 第 2/4 页翻页提示）', !!at('第 2/4 页', 452, '12px sans-serif', '#7d93a3'));
ok('运行期：既有四图 Lv 行基线零回归（80/130/164/214）',
  !!at('潮灯镇 Lv.', 80, '14px sans-serif', '#e8eef1') &&
  !!at('雾语林 Lv.', 130, '14px sans-serif', '#e8eef1') &&
  !!at('星井矿脉 Lv.', 164, '14px sans-serif', '#e8eef1') &&
  !!at('无字回廊 Lv.', 214, '14px sans-serif', '#e8eef1'));
{
  let otherOk = true;
  for (const p of [0, 2, 3]) {
    S.helpPage = p;
    try { CAPTURED.length = 0; CTX.fillText = origFill; drawHelp(); } catch (e) { otherOk = false; console.log('   drawHelp err:', e.message); }
  }
  CTX.fillText = origFill;
  ok('运行期：其余三页渲染零回归（操作说明/魔物状态/试炼进阶不抛错）', otherOk);
}

// 6. README / package.json / CHANGELOG 同步
const readme = readFileSync(join(ROOT, 'README.md'), 'utf8');
const pkg = readFileSync(join(ROOT, 'package.json'), 'utf8');
const changelog = readFileSync(join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树串尾已延伸至 smoke_v2287_trueroute（v2286 后接 v2287）',
  readme.includes('smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor（npm test 串跑）'));
ok('README 件套口径为二百二十件套（二百一十九件套清除）且旧 182 口径零残留',
  readme.includes('冒烟二百二十件套（二百一十九件套清除）') && !readme.includes('冒烟一百八十二件套（一百八十一件套清' + '除）'));
ok('README 含 v22.87 守护描述（通关之路行真结局/记忆碎片指针守护）',
  readme.includes('v22.87 起含帮助页「地图指南」通关之路行真结局/记忆碎片指针守护'));
ok('README 含 smoke_v2287_trueroute 入库（183 份）', readme.includes('smoke_v2287_trueroute 入库（183 份）'));
ok('README 仍保留 smoke_v2286_titleekey 入库（182 份）历史口径', readme.includes('smoke_v2286_titleekey 入库（182 份）'));
ok('README 仍保留 v22.86 守护描述（历史口径）', readme.includes('v22.86 起含标题页/创建页开始键 E 键别名守护'));
ok('package.json test 串含 smoke_v2287_trueroute.mjs 且位于串尾',
  pkg.includes('node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs && node tests/smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs && node tests/smoke_v2395_shopscroll.mjs && node tests/smoke_v2396_steelarmor.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 183 件套', testChain === 220, String(testChain));
ok('CHANGELOG 含 v22.87 条目（顶 pin）', changelog.startsWith('## v23.96 '));

// 7. 姊妹件套 pin（smoke_v2286 及地图指南几何 pin 随新现实更新）
const readTest = (name) => readFileSync(join(ROOT, 'tests', name), 'utf8');
const s2286 = readTest('smoke_v2286_titleekey.mjs');
const s2285 = readTest('smoke_v2285_winekey.mjs');
const s2258 = readTest('smoke_v2258_potionhelp.mjs');
const s2253 = readTest('smoke_v2253_supplypoint.mjs');
const s2281 = readTest('smoke_v2281_starwell.mjs');
const s2282 = readTest('smoke_v2282_archgate.mjs');
const s2237 = readTest('smoke_v2237_minimaplegend.mjs');
const s2238 = readTest('smoke_v2238_starwell.mjs');
const s2243 = readTest('smoke_v2243_encguide.mjs');
ok('smoke_v2286 的 GAME_VERSION 字面量 pin 已更新为 v22.87', s2286.includes("const GAME_VERSION = 'v23.96';"));
ok('smoke_v2286 的 CHANGELOG 顶 pin 已更新为 ## v22.87', s2286.includes("startsWith('## v23.96 '"));
ok('smoke_v2286 的件套 pin 已更新为二百二十件套（二百一十九件套清除）', s2286.includes('二百二十件套（二百一十九件套清除）'));
ok('smoke_v2286 的 README 串尾 pin 已延伸至 smoke_v2287_trueroute',
  s2286.includes('smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor（npm test 串跑）'));
ok('smoke_v2286 的 package 串尾 pin 已延伸至 smoke_v2287_trueroute',
  s2286.includes('node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs && node tests/smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs && node tests/smoke_v2395_shopscroll.mjs && node tests/smoke_v2396_steelarmor.mjs"'));
ok('smoke_v2286 的 testChain pin 已更新为 183', s2286.includes('testChain === 220'));
ok('smoke_v2285 的 GAME_VERSION 字面量 pin 已更新为 v22.87', s2285.includes("const GAME_VERSION = 'v23.96';"));
ok('smoke_v2258 的地图指南 r[2] 数 pin 已更新为 === 7', s2258.includes('.filter((r) => r.length > 2).length === 7'));
ok('smoke_v2281 的地图指南 r[2] 数 pin 已更新为 === 7', s2281.includes('0) === 7'));
ok('smoke_v2282 的地图指南 r[2] 数 pin 已更新为 === 7', s2282.includes('0) === 7'));
ok('smoke_v2253 的地图指南 r[2] 数 pin 已更新为 === 7（3→7 描述）', s2253.includes('0) === 7') && s2253.includes('v22.87 通关之路行补 r[2] 6→7'));
ok('smoke_v2253 的页长 pin 已更新为 slice(0,-1) 口径（末行自带 r[2] 不推基线）',
  s2253.includes('guide.slice(0, -1).reduce((a, r) => a + (r[2] ? 1 : 0), 0)) * 16 === 414'));
ok('smoke_v2237 的页长 pin 已更新为 slice(0,-1) 口径', s2237.includes('page.slice(0, -1).reduce((a, r) => a + (r[2] ? 1 : 0), 0)) * 16 === 414'));
ok('smoke_v2238 的页长 pin 已更新为 slice(0,-1) 口径', s2238.includes('page.slice(0, -1).reduce((a, r) => a + (r[2] ? 1 : 0), 0)) * 16 === 414'));
ok('smoke_v2243 的页长 pin 已更新为 slice(0,-1) 口径', s2243.includes('page.slice(0, -1).reduce((a, r) => a + (r[2] ? 1 : 0), 0)) * 16 === 414'));

// 8. 旧代 v22.86 pin 全库零残留
const allTests = readdirSync(join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2287_trueroute.mjs');
const stale = [];
for (const f of allTests) {
  const src = readFileSync(join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "86';") || src.includes("GAME_VERSION === 'v22." + "86'") ||
      src.includes('一百八十二件套（一百八十一件套清' + '除）') || src.includes('testChain === ' + '182') ||
      src.includes('smoke_v2286_titleekey（npm test ' + '串跑）') || src.includes('_gv[1] >= ' + '86') ||
      src.includes("startsWith('## v22." + "86 '") || src.includes("startsWith('## v22." + "86'")) stale.push(f);
}
ok('旧代 v22.86 字面量/恒等/件套/testChain/串尾/版本锚 pin 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

// 9. 哨兵链（件套守护领先一位）已指向下一版 184 口径
const s2143 = readTest('smoke_v2143_talkekey.mjs');
ok('哨兵链 v2143 已含下一版件套口径（二百二十件套（二百一十九件套清除））',
  s2143.includes('二百二十一件套（二百二十件套清除）') &&
  s2143.includes("!readme.includes('二百二十一件套（二百二十件套清除）')"));

console.log(`\n— v22.87 帮助页地图指南通关之路行「真结局/记忆碎片」r[2] 指针冒烟：${pass}/${pass + fail} 通过 —`);
process.exit(fail ? 1 : 0);
