// v22.75 专项冒烟：图鉴空态条件收口（体验打磨·信息透明·纯显示，承 v19.41 已遭遇揭示 / v21.37 遭遇计数化 /
// v21.78 页脚已遭遇汇总同一主线）——drawCodex 空态分支此前只看 hero.bestiary（零讨伐即显示
// 「尚未击败任何敌人」）：玩家阵亡/逃跑但「已遭遇」过魔物（hero.seen 有计数，如被史莱姆撞死 2 次
// 或从野狼脚下逃生 3 次）时，图鉴会砍掉 v19.41/v21.37 专门设计的「已遭遇未讨伐：揭示名字/出没地/
// 已遭遇 ✕N」行，只剩「尚未击败任何敌人」占位——而页脚此刻却照常显示「已遭遇：N/13」，同一屏
// 自相矛盾（有遭遇却不给看）。本版把空态条件收敛为「零讨伐 且 零遭遇」（seenAny 读 BESTIARY_TARGET
// 与 hero.seen |0 归一，与 rows/页脚同源），有已遭遇未讨伐者时走 rows 全量绘制（seen 行揭名、未见行
// ❓ 占位、页脚自洽）；纯显示零结算零存档变化，零讨伐零遭遇新档空态文案逐字保留。
// 本冒烟守护：版本锚点、源级落位（seenAny 派生 + 空态条件改动 + 旧条件零残留）、运行期实证（四档：
// 零讨伐零遭遇空态 / 零讨伐有遭遇揭名 / 既有讨伐零回归 / 全未知页脚已遭遇 0/13 与记忆收录 0/13）、
// README/package/CHANGELOG 同步、姊妹件套 pin（v2274..v2258 一百七十一件套 / v2274·v2273·v2272·
// v2271·v2270·v2269·v2268·v2267·v2266·v2265·v2264·v2263·v2262·v2261·v2260·v2259·v2258
// GAME_VERSION v22.75）随新现实更新 + 旧代 v22.74 字面量/恒等/件套/串尾/testChain/顶 pin 全库零残留。
import { GAME_VERSION, ACH_LIST, BESTIARY_TARGET } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.75 图鉴空态条件收口冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v22.74 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.74（本版守 v22.79）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 99)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v22.75 版本注释', dataSrc.includes('v22.75 体验打磨·图鉴空态条件收口'));
ok('data.js GAME_VERSION 字面量已为 v22.75（旧 v22.74 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.32';") && !dataSrc.includes("const GAME_VERSION = 'v22." + "74';"));
ok('data.js 仍保留 v22.74 历史注释（似曾相识成就注释未动）', dataSrc.includes('v22.74 新成就·图鉴遭遇线中档里程碑「似曾相识」'));

// —— 源级落位：menus.js seenAny 派生 + 空态条件改动，旧条件零残留 ——
const mSrc = read('../js/view/menus.js');
ok('menus.js 含 v22.75 注释（图鉴空态条件收口说明）', mSrc.includes('v22.75 图鉴空态条件收口'));
ok('menus.js seenAny 派生落位：BESTIARY_TARGET.some + hero.seen + |0 归一',
  mSrc.includes('const seenAny = BESTIARY_TARGET.some((n) => ((hero.seen || {})[n] | 0) > 0);'));
ok('menus.js 空态条件已收敛为「零讨伐 且 零遭遇」',
  mSrc.includes('if (names.length === 0 && !seenAny) {'));
ok('menus.js 旧空态条件零残留（裸露 if(names.length===0){ 已清除）',
  !mSrc.includes('if(names.length===0){'));
ok('menus.js rows 增补 seenCt 零回归（仍读 hero.seen |0 归一）', mSrc.includes('seenCt:((hero.seen||{})[n])|0'));
ok('menus.js 空态文案逐字保留（尚未击败任何敌人）', mSrc.includes("尚未击败任何敌人。"));

// —— 数据契约：ACH_LIST 零变化（本版非成就版）——
ok('ACH_LIST 仍 58 项（本版非成就改动，零回归）', ACH_LIST.length === 60, String(ACH_LIST.length));
ok('BESTIARY_TARGET 仍 13 种（页脚分母零回归）', BESTIARY_TARGET.length === 13, String(BESTIARY_TARGET.length));

// —— 运行期实证：DOM/音频/存储桩 + main.js 真实导入后 drawCodex 全档 ——
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
    fillText: (t) => { CAPTURED.push(String(t)); },
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
const { newGame } = await import('../js/core.js');
const { drawCodex } = await import('../js/view/menus.js');

function runCodex(hero) {
  S.G = hero;
  S.scene = 'world';
  S.codexScroll = 0;
  CAPTURED.length = 0;
  drawCodex();
  return CAPTURED.join('\n');
}

// 档一：零讨伐零遭遇（纯新档）→ 空态文案逐字保留（零回归）
let hero = newGame('余烬');
let txt = runCodex(hero);
ok('档一（新档）：显示「尚未击败任何敌人」空态', txt.includes('尚未击败任何敌人。'));

// 档二：零讨伐有遭遇（被撞死/逃跑过）→ seen 行揭名，不再被空态占位砍掉（本版核心修复）
hero = newGame('灯见');
hero.seen = { 史莱姆: 2, 野狼: 3 };
txt = runCodex(hero);
ok('档二（零讨伐有遭遇）：不再显示「尚未击败任何敌人」空态', !txt.includes('尚未击败任何敌人。'));
ok('档二（零讨伐有遭遇）：史莱姆行揭名（已遭遇 ✕2）', txt.includes('史莱姆') && txt.includes('已遭遇 ✕2'));
ok('档二（零讨伐有遭遇）：野狼行揭名（已遭遇 ✕3）', txt.includes('野狼') && txt.includes('已遭遇 ✕3'));
ok('档二（零讨伐有遭遇）：已遭遇未讨伐行揭示出没地', txt.includes('（') && txt.includes('尚未讨伐 · 兵力待收复'));
ok('档二（零讨伐有遭遇）：未见行保持 ❓ 占位（未讨伐不剧透）', txt.includes('？？？') && txt.includes('未讨伐'));
ok('档二（零讨伐有遭遇）：页脚「记忆收录：0/13」与「已遭遇：2/13」自洽',
  txt.includes('记忆收录：0/13') && txt.includes('已遭遇：2/13'));

// 档三：既有讨伐零回归（got 行照常显示讨伐 ✕N）
hero = newGame('潮');
hero.bestiary = { 野狼: 2 };
hero.seen = { 野狼: 2 };
txt = runCodex(hero);
ok('档三（有讨伐）：野狼 got 行显示「讨伐 ✕2」零回归', txt.includes('讨伐 ✕2'));
ok('档三（有讨伐）：页脚「记忆收录：1/13」与「已遭遇：1/13」零回归',
  txt.includes('记忆收录：1/13') && txt.includes('已遭遇：1/13'));

// 档四：全未知（零讨伐零遭遇）页脚已遭遇 0/13 与记忆收录 0/13（v21.78 口径零回归）
hero = newGame('灯');
txt = runCodex(hero);
ok('档四（新档）：页脚「已遭遇：0/13」零回归', txt.includes('已遭遇：0/13'));
ok('档四（新档）：页脚「记忆收录：0/13」零回归', txt.includes('记忆收录：0/13'));

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树串尾已延伸至 smoke_v2275_codexempty（v2274 后接 v2275）',
  readme.includes('smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 件套口径为二百一十二件套（二百一十一件套清除）且旧 170 口径零残留',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟一百七十件套（一百六十九件套清' + '除）'));
ok('README 含 v22.75 守护描述（图鉴空态已遭遇揭示守护）', readme.includes('v22.75 起含图鉴空态已遭遇揭示守护'));
ok('README 含 smoke_v2275_codexempty 入库（171 份）', readme.includes('smoke_v2275_codexempty 入库（171 份）'));
ok('README 仍保留 smoke_v2274_seen2 入库（170 份）历史口径', readme.includes('smoke_v2274_seen2 入库（170 份）'));
ok('README 成就口径「58 项」双处不变（本版非成就版，零回归）',
  readme.includes('成就一览（全部 60 项进度') && readme.includes('**60 项成就**'));
ok('package.json 已收录 smoke_v2275_codexempty（npm test 串跑第 171 份）',
  pkg.includes('smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 171 件套', testChain === 212, String(testChain));
ok('CHANGELOG 含 v22.75 条目（顶 pin）', changelog.startsWith('## v23.32 '));

// —— 姊妹件套 pin 随新现实更新 + 旧代 v22.74 pin 零残留 ——
const s2274 = read('smoke_v2274_seen2.mjs');
const s2143 = read('smoke_v2143_talkekey.mjs');
ok('smoke_v2274 的 GAME_VERSION 字面量 pin 已更新为 v22.75', s2274.includes("const GAME_VERSION = 'v23.32';"));
ok('smoke_v2274 的 CHANGELOG 顶 pin 已更新为 ## v22.78', s2274.includes("startsWith('## v23.32'") );
ok('smoke_v2274 的件套 pin 已更新为二百一十二件套（二百一十一件套清除）', s2274.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2274 的 README 串尾 pin 已延伸至 smoke_v2275_codexempty', s2274.includes('smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2274 的 package.json 串尾 plain pin 已延伸至 smoke_v2275_codexempty', s2274.includes('smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs'));
ok('smoke_v2143 哨兵链已推进至二百一十二件套（二百一十一件套清除）', s2143.includes('二百一十三件套（二百一十二件套清除）') && s2143.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));
ok('smoke_v2274 旧 v22.74 字面量 pin 零残留', !s2274.includes("const GAME_VERSION = 'v22.74';"));
ok('smoke_v2274 旧一百七十件套（一百六十九件套清除）pin 零残留', !s2274.includes('一百七十件套（一百六十九件套清除）'));

console.log(`\n— v22.75 图鉴空态条件收口冒烟：${n - failed}/${n} 通过 —`);
if (failed) process.exit(1);
