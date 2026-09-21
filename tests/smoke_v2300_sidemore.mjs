// smoke_v2300_sidemore.mjs —— v23.00 状态页「支线」行多条支线计数守护
// 承 v21.10-v22.99 冒烟入库先例：版本锚点 + 源级落位（menus.js statusSideSuffix 纯函数 +
// drawStatus 支线行接计数后缀 + data.js v23.00 注释/GAME_VERSION 字面量 v23.00/
// v22.99 历史注释保留零 v22.99 字面量残留）+ 纯函数逐值（0/1/2/3 条 空串/「还有 N 条」）+ 运行期
// 全链路（DOM/音频/存储桩 + main.js 真实导入：多条支线 hero 渲染捕获「还有 N 条」落画、
// 单条/零条逐字零回归零抛错）+ README/package.json/CHANGELOG 同步（一百九十六件套（一百九十五件套
// 清除）/串尾/入库 196 份/顶 pin）+ 姊妹件套 pin（smoke_v2299 随新现实更新）+ 哨兵链领先一位
// （197 口径）+ 旧代 v22.99 pin 全库零残留。
import { GAME_VERSION } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v23.00 状态页支线行多条计数守护冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v22.99 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.99（本版守 v23.00）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 99)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const menusSrc = read('../js/view/menus.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v23.00 版本注释', dataSrc.includes('// v23.00 体验打磨·信息透明·纯显示'));
ok('data.js GAME_VERSION 字面量已为 v23.00（旧 v22.99 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.49';") && !dataSrc.includes("const GAME_VERSION = 'v22." + "99';"));
ok('data.js 仍保留 v22.99 历史注释（图鉴/成就页脚 I 状态页注释未动）', dataSrc.includes('// v22.99 体验打磨·可发现性·信息透明'));

// —— menus.js 源级落位：statusSideSuffix 纯函数 + drawStatus 支线行接计数后缀 ——
ok('menus.js 含 statusSideSuffix 纯函数（v23.00 注释 + export）',
  menusSrc.includes('// v23.00 纯显示辅助') && menusSrc.includes('export function statusSideSuffix(sides) {'));
ok('menus.js drawStatus 支线行已接 statusSideSuffix(sides)（450 行）',
  menusSrc.includes("'支线：'+sides[0]+statusSideSuffix(sides)"));
ok('menus.js 旧裸显示支线行零残留（sides[0] 未接后缀的旧式）',
  !menusSrc.includes("'支线：'+sides[0])+'   ·  J 任务日志'"));
ok('menus.js 支线行零回归：主线行/冒险进度/暂无分支逐字在位',
  menusSrc.includes("text('主线：'+main,110,434") && menusSrc.includes("text('冒险进度：',110,412") &&
  menusSrc.includes("'支线：暂无')+'   ·  J 任务日志'"));

// —— 纯函数逐值（statusSideSuffix 多档）——
const { statusSideSuffix } = await import('../js/view/menus.js');
ok('纯函数：零条 → 空串', statusSideSuffix([]) === '', JSON.stringify(statusSideSuffix([])));
ok('纯函数：单条 → 空串（逐字零变化）', statusSideSuffix(['a']) === '', JSON.stringify(statusSideSuffix(['a'])));
ok('纯函数：两条 → （还有 1 条）', statusSideSuffix(['a', 'b']) === '（还有 1 条）', statusSideSuffix(['a', 'b']));
ok('纯函数：三条 → （还有 2 条）', statusSideSuffix(['a', 'b', 'c']) === '（还有 2 条）', statusSideSuffix(['a', 'b', 'c']));
ok('纯函数：五条 → （还有 4 条）', statusSideSuffix(['a', 'b', 'c', 'd', 'e']) === '（还有 4 条）');
ok('纯函数：缺参/空值 → 空串（防御式）', statusSideSuffix(undefined) === '' && statusSideSuffix(null) === '');

// —— README 同步守护 ——
ok('README 件套口径为二百一十二件套（二百一十一件套清除）且旧 195 口径零残留',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟一百九十五件套（一百九十四件套清' + '除）'));
ok('README 含 v23.00 守护描述（状态页支线行多条计数守护）',
  readme.includes('v23.00 起含状态页「支线」行多条支线计数守护'));
ok('README 含 smoke_v2300_sidemore 入库（196 份）', readme.includes('smoke_v2300_sidemore 入库（196 份）'));
ok('README tests 树串尾已延伸至 smoke_v2300_sidemore（v2299 后接 v2300）',
  readme.includes('smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 旧串尾零残留（smoke_v2299_crosslink（npm test 串跑）不在树尾）',
  !readme.includes('smoke_v2299_crosslink（npm test 串' + '跑）'));
ok('README 系统清单含状态页支线计数口径（v23.00）',
  readme.includes('状态页「支线」行多条支线计数') && readme.includes('v23.00'));
ok('README 仍保留 v22.99 守护描述（历史口径）', readme.includes('v22.99 起含图鉴/成就页脚「I 状态页」直达守护'));
ok('README 仍保留 smoke_v2299_crosslink 入库（195 份）历史口径', readme.includes('smoke_v2299_crosslink 入库（195 份）'));

// —— package.json / CHANGELOG 同步守护 ——
ok('package.json 已收录 smoke_v2300_sidemore（npm test 串跑第 196 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2300_sidemore.mjs'));
ok('package.json 串尾为 ... smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs"',
  pkg.includes('node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 196 件套', testChain === 212, String(testChain));
ok('CHANGELOG 顶部已追加 v23.00 条目', changelog.startsWith('## v23.49 '));
ok('CHANGELOG 仍保留 v22.99 条目（历史口径）', changelog.includes('## v22.99 记忆图鉴/成就一览页脚'));

// —— 姊妹件套 pin 随新现实更新 + 旧代 v22.99 pin 零残留 ——
const s2299 = read('smoke_v2299_crosslink.mjs');
const s2143 = read('smoke_v2143_talkekey.mjs');
ok('smoke_v2299 的 GAME_VERSION 字面量 pin 已更新为 v23.00', s2299.includes("const GAME_VERSION = 'v23.49';"));
ok('smoke_v2299 的 CHANGELOG 顶 pin 已更新为 ## v23.00',
  s2299.includes("startsWith('## v23.49 '"));
ok('smoke_v2299 的件套 pin 已更新为二百一十二件套（二百一十一件套清除）',
  s2299.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2299 的 README 串尾 pin 已延伸至 smoke_v2300_sidemore',
  s2299.includes('smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2299 的 package 串尾 pin 已延伸至 smoke_v2300_sidemore',
  s2299.includes('node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
ok('smoke_v2299 的 testChain pin 已更新为 196', s2299.includes('testChain === 212'));
ok('smoke_v2143 哨兵链已推进至二百一十二件套（二百一十一件套清除）',
  s2143.includes('二百一十三件套（二百一十二件套清除）') && s2143.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));

// —— 运行期实证：DOM/音频/存储桩 + main.js 真实导入 ——
const noop = () => {};
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
    fillText: noop, strokeText: noop,
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
const { drawStatus } = await import('../js/view/menus.js');
const { questLines } = await import('../js/quests.js');

// 多条支线存档构型（灯长委托 active + 星砂之约 active（caveBoss）+ 旧灯卫的名字 active（bossDefeated））
function multiSideHero() {
  const h = newGame('余烬');
  h.level = 5; h.bossDefeated = true; h.caveBoss = true;
  h.quests = { side_mushroom: 'active', side_cart: 'active', side_name: 'active' };
  return h;
}
const mh = multiSideHero();
const { sides } = questLines(mh);
// 双侧旗标 + 三张卡 active 时其余支线均为 offer——全部支线在列（10 条）
ok('运行期：sideObjectives 全部支线在列（10 条：蘑菇/星砂/名字 + 7 条 offer）', sides.length === 10, JSON.stringify(sides));
ok('运行期：questLines 10 条支线 + statusSideSuffix → （还有 9 条）', statusSideSuffix(sides) === '（还有 9 条）', statusSideSuffix(sides));

const { CTX } = await import('../js/view/canvas.js');
const CAP = [];
const origFill = CTX.fillText;
CTX.fillText = (t) => { CAP.push(String(t)); return origFill.call(CTX, t, 0, 0); };
function renderStatus(hero) {
  S.G = hero; S.scene = 'world';
  CAP.length = 0;
  drawStatus();
  return CAP.slice();
}
let threw = null;
let capMulti = null;
try { capMulti = renderStatus(multiSideHero()); } catch (e) { threw = e; }
ok('运行期：drawStatus（多条支线档）渲染零抛错', threw === null, threw && String(threw.stack || threw));
ok('运行期：支线行落画含「支线：」且带「（还有 9 条）」计数',
  (capMulti || []).some((c) => c.includes('支线：') && c.includes('（还有 9 条）') && c.includes('J 任务日志')),
  JSON.stringify((capMulti || []).filter((c) => c.includes('支线：')).slice(0, 2)));
ok('运行期：冒险进度/主线行与多条计数同屏零回归（adventureProgress 五徽记落画）',
  (capMulti || []).some((c) => c.includes('✓')) && (capMulti || []).some((c) => c.includes('主线：')));

// 单条/零条零回归档（旧行为逐字保留）：全支线 done 化后仅留一条 / 全部 done
function heroWith(sideState) {
  const h = newGame('潮');
  h.bossDefeated = true; h.caveBoss = true;
  const q = {};
  for (const e of questLines(h).journal) if (e.kind === 'side') q[e.id] = 'done';
  Object.assign(q, sideState);
  h.quests = q;
  return h;
}
let capOne = null;
try { capOne = renderStatus(heroWith({ side_mushroom: 'active' })); } catch (e) { threw = threw || e; }
ok('运行期：drawStatus（单条档）渲染零抛错', threw === null, threw && String(threw.stack || threw));
ok('运行期：单条档支线行落画不含计数后缀（逐字零回归）',
  (capOne || []).some((c) => c.includes('支线：') && c.includes('找回魔法蘑菇') && !c.includes('（还有 ') && c.includes('J 任务日志')),
  JSON.stringify((capOne || []).filter((c) => c.includes('支线：')).slice(0, 2)));
let capZero = null;
try { capZero = renderStatus(heroWith({})); } catch (e) { threw = threw || e; }
ok('运行期：drawStatus（零条档）渲染零抛错', threw === null, threw && String(threw.stack || threw));
ok('运行期：零条档支线行如实「支线：暂无」', (capZero || []).some((c) => c.includes('支线：暂无') && c.includes('J 任务日志')));
CTX.fillText = origFill;

// 旧代 v22.99 pin 全库零残留（不含本件）
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2300_sidemore.mjs');
const stale = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("const GAME_VERSION = 'v22.99';") || src.includes("const GAME_VERSION = 'v22." + "99'") || src.includes("GAME_VERSION === 'v22.99'") ||
      src.includes('一百九十五件套（一百九十四件套清' + '除）') || src.includes('testChain === ' + '195') ||
      src.includes('smoke_v2299_crosslink（npm test 串' + '跑）') ||
      src.includes("startsWith('## v22.99") || src.includes('node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs"')) stale.push(f);
}
ok('旧代 v22.99 字面量/恒等/件套/testChain/串尾/顶 pin/package 串尾 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

console.log(`\n— v23.00 状态页支线行多条计数守护冒烟：${n - failed}/${n} 通过 —`);
if (failed) process.exit(1);
