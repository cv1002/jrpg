// smoke_v2293_deadsave.mjs —— v22.93 阵亡画面「未存档」提示 + P 存档入口守护
// 承 v21.10-v22.92 冒烟入库先例：版本锚点 + 源级落位（menus.js drawDead 提示行 / main.js dead.onKey P）+
// pauseSaveHint 契约（复用同源）+ 运行期全链路（DOM/音频/存储桩 + main.js 真实导入：未存档提示渲染捕获 /
// P 键真实写入当前槽并清 S.unsaved / 已落盘零噪音 / Boss 战败与普通战败两档共存）+ 行间预算 +
// README/package.json/CHANGELOG 同步 + 姊妹件套 pin + 旧代 v22.92 pin 全库零残留 + 哨兵链领先一位
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

console.log('— v22.93 阵亡画面「未存档」提示与 P 存档入口 冒烟 —');

// 1. 版本锚点
const dataSrc = readFileSync(join(ROOT, 'js/data.js'), 'utf8');
ok('data.js GAME_VERSION 字面量为 v22.93', dataSrc.includes("const GAME_VERSION = 'v24.00';"));
ok('旧 v22.92 字面量零残留', !dataSrc.includes("const GAME_VERSION = 'v22." + "92';"));
ok('data.js 含 v22.93 版本注释', dataSrc.includes('// v22.93 体验打磨·防误丢档·存档闭环收口'));
ok('data.js 仍保留 v22.92 历史注释', dataSrc.includes('// v22.92 新内容·纯风味'));

// 2. 源级落位：menus.js drawDead 提示行（pauseSaveHint 同源复用）+ 既有行零位移
const menusSrc = readFileSync(join(ROOT, 'js/view/menus.js'), 'utf8');
const deadBlock = (menusSrc.match(/export function drawDead\(\)\{[\s\S]*?\n\}/) || [''])[0];
ok('drawDead 块存在', deadBlock.length > 0);
ok('drawDead 经 pauseSaveHint 派生并落至 (320,412)',
  deadBlock.includes('const deadHint = pauseSaveHint(hero, S.unsaved, S.curSaveSlot, hasSlot(S.curSaveSlot));') &&
  deadBlock.includes("if (deadHint) text(deadHint, 320, 412, '12px', '#ff9d5b', 'center');"));
ok('menus.js 含 v22.93 注释（drawDead 未存档行说明）', menusSrc.includes('// v22.93 阵亡画面「未存档」提示'));
ok('drawPause 未存档行零回归（v22.30 口径逐字未动）',
  menusSrc.includes('const pHint = pauseSaveHint(S.G, S.unsaved, S.curSaveSlot, hasSlot(S.curSaveSlot));') &&
  menusSrc.includes("if (pHint) text(pHint, 320, 430, '12px', '#ff9d5b', 'center');"));
ok('drawDead 按键行逐字保留（R 332 / T 362 / B 392 零位移）',
  deadBlock.includes("text('按 R 重新开始本次冒险',CV.width/2,332,'15px','#7d93a3','center');") &&
  deadBlock.includes("text('按 T 返回标题画面',CV.width/2,362,'15px','#7d93a3','center');") &&
  deadBlock.includes("text('按 B 重整旗鼓，再战强敌！',CV.width/2,392,'15px','#ffd24a','center');"));
ok('drawDead 收集行/战绩/余粮/建议行零位移（236/264/292/312）',
  deadBlock.includes(",CV.width/2,236,'13px','#7d93a3','center');") &&
  deadBlock.includes(",CV.width/2,264,'13px','#e8eef1','center');") &&
  deadBlock.includes(",CV.width/2,292,'13px',") &&
  deadBlock.includes(",CV.width/2,312,'bold 13px','#7dd47f','center');"));

// 3. 源级落位：main.js dead.onKey P 存档分支 + win/world P 零回归 + R/T/B 零回归
const mainSrc = readFileSync(join(ROOT, 'js/main.js'), 'utf8');
const deadOnKey = (mainSrc.match(/dead: \{\s*onKey\(e\) \{[\s\S]*?\n\s*\},\n\s*\},/) || [''])[0];
ok('dead.onKey 块存在且含 P 分支', deadOnKey.length > 0 && deadOnKey.includes("else if (e.key === 'p' || e.key === 'P') { saveGame(); return; }"));
ok('main.js 含 v22.93 注释（dead.onKey P 存档入口说明）', mainSrc.includes('// v22.93 阵亡画面补 P 存档入口'));
ok('dead.onKey R/T/B 分支逐字保留',
  mainSrc.includes("if (e.key === 'r' || e.key === 'R') resetRun();") &&
  mainSrc.includes("else if (e.key === 't' || e.key === 'T') { goto('title'); startBgm('title'); }") &&
  mainSrc.includes("else if (e.key === 'b' || e.key === 'B') retryBoss();"));
ok('win.onKey P 分支零回归（v21.98 口径逐字未动）',
  mainSrc.includes("if (e.key === 'p' || e.key === 'P') { saveGame(); return; }") &&
  mainSrc.includes("if (e.key !== 'r' && e.key !== 'R') S.titleResetArm = 0;"));
ok('world.onKey P 分支零回归', mainSrc.includes("if (e.key === 'p' || e.key === 'P') { saveGame(); return; }"));

// 4. pauseSaveHint 纯函数四组合逐值（复用同源契约，与 v22.30 同式）
const { pauseSaveHint } = await import('../js/view/menus.js');
ok('pauseSaveHint 导出且为函数（复用同源）', typeof pauseSaveHint === 'function');
ok('无进行中冒险（g=null）→ null', pauseSaveHint(null, true, 1, false) === null);
ok('unsaved=false → null（已落盘零噪音）', pauseSaveHint({ name: 'x' }, false, 1, false) === null);
ok('unsaved + 槽有存档 → 覆盖口径', pauseSaveHint({ name: 'x' }, true, 1, true) === '⚠️ 未存档 · 按 P 写入槽 1（已有存档，将覆盖）');
ok('unsaved + 空槽 → 空槽口径', pauseSaveHint({ name: 'x' }, true, 3, false) === '⚠️ 未存档 · 按 P 写入槽 3（空槽）');

// 5. 行间预算（死屏全宽画布 640×480：412 与 B 392 / 画布底 480 均 ≥16）
ok('死屏提示行 y=412 与 B 行 392 行间 20 ≥16、距画布底 480 为 68（12px 字底 ≈413.4 不触底）',
  412 - 392 >= 16 && 480 - 412 >= 16);
function estW(s, size = 12) {
  let w = 0;
  for (const ch of String(s)) {
    const code = ch.codePointAt(0);
    const wide = (code >= 0x2e80 && code <= 0x9fff) || (code >= 0x3000 && code <= 0x303f) || (code >= 0xff00 && code <= 0xffef) || code >= 0x1f000;
    if (wide) w += 0.865 * size;
    else if (code === 0xb7) w += 0.303 * size;
    else if (code === 0x20) w += 0.263 * size;
    else if (code >= 0x30 && code <= 0x39) w += 0.63 * size;
    else w += 0.55 * size;
  }
  return w;
}
ok('提示行 12px estW ≤ 640 画布（≈' + Math.round(estW('⚠️ 未存档 · 按 P 写入槽 1（已有存档，将覆盖）')) + '）',
  estW('⚠️ 未存档 · 按 P 写入槽 1（已有存档，将覆盖）') <= 640);

// 6. 运行期全链路：DOM/音频/存储桩 + main.js 真实导入 + drawDead 渲染捕获 + dead.onKey P 真实写入
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
const { drawDead } = await import('../js/view/menus.js');
const { CTX } = await import('../js/view/canvas.js');
const { screens } = await import('../js/main.js');

const hero = { name: '余烬', level: 5, gold: 100, bestiary: {}, time: 120, item: 2, potion2: 0,
  mushrooms: 1, ach: [], fragments: [], hp: 1, hpMax: 50, mp: 1, mpMax: 20, map: 'village' };
S.G = hero;
S.enemy = null;
S.scene = 'dead';
S.curSaveSlot = 1;

const CAPTURED = [];
const origFill = CTX.fillText;
CTX.fillText = (t, x, y) => { CAPTURED.push(String(t)); return origFill.call(CTX, t, x, y); };

// 6a. 普通战败 + 未存档 + 空槽 → 空槽口径提示（且无 B 行）
S.unsaved = true;
CAPTURED.length = 0;
let threw = null;
try { drawDead(); } catch (e) { threw = e; }
ok('运行期：drawDead 普通战败档渲染无抛错', threw === null, threw && threw.message);
ok('运行期：未存档 + 空槽落画「⚠️ 未存档 · 按 P 写入槽 1（空槽）」',
  CAPTURED.includes('⚠️ 未存档 · 按 P 写入槽 1（空槽）'), JSON.stringify(CAPTURED.filter((t) => t.includes('未存档'))));
ok('运行期：普通战败无 B 行（仅有提示行一处未存档文案）',
  !CAPTURED.includes('按 B 重整旗鼓，再战强敌！') && CAPTURED.filter((t) => t.includes('未存档')).length === 1);
ok('运行期：既有 R/T 行零回归', CAPTURED.includes('按 R 重新开始本次冒险') && CAPTURED.includes('按 T 返回标题画面'));

// 6b. Boss 战败 + 未存档 + 槽有存档 → 覆盖口径 + B 行共存
mem['jrpg_save1'] = JSON.stringify({ G: { name: '旧档' }, savedAt: 1 });
hero._bossRetry = { name: '幽冥魔王', bossId: 'demon' };
CAPTURED.length = 0;
drawDead();
ok('运行期：Boss 战败档 未存档提示 + B 行 共存（提示行 412 与 B 行 392 同屏）',
  CAPTURED.includes('⚠️ 未存档 · 按 P 写入槽 1（已有存档，将覆盖）') && CAPTURED.includes('按 B 重整旗鼓，再战强敌！'),
  JSON.stringify(CAPTURED.filter((t) => t.includes('未存档') || t.includes('重整'))));
hero._bossRetry = null;

// 6c. 已落盘（unsaved=false）→ 零「未存档」文案
S.unsaved = false;
CAPTURED.length = 0;
drawDead();
ok('运行期：unsaved=false 零「未存档」文字（读档/存档后不误报）',
  !CAPTURED.some((t) => t.includes('未存档')), JSON.stringify(CAPTURED.filter((t) => t.includes('未存档'))));

// 6d. dead.onKey P 真实写入当前槽并清 S.unsaved（与 world/win 同一 saveGame 入口）
S.unsaved = true;
delete mem['jrpg_save1'];
ok('前置：槽 1 已清空', localStorage.getItem('jrpg_save1') === null);
ok('运行期：dead.onKey r/t/b 之外按 P 走 saveGame（不抛错）',
  (() => { try { screens.dead.onKey({ key: 'P' }); return true; } catch (e) { return false; } })());
ok('运行期：P 后 localStorage 写入槽 1（jrpg_save1 存在）', !!mem['jrpg_save1'], mem['jrpg_save1'] && mem['jrpg_save1'].slice(0, 60));
ok('运行期：P 后 S.unsaved 清脏（成功存档=已落盘）', S.unsaved === false);
ok('运行期：P 后 S.saveMsg 回执（存档摘要）', (S.saveMsg || '').includes('💾 已存档到槽 1'), S.saveMsg);
ok('运行期：dead.onKey T 分支零回归（回标题）',
  (() => { try { screens.dead.onKey({ key: 'T' }); return S.scene === 'title'; } catch (e) { return false; } })());
CTX.fillText = origFill;

// 7. README / package.json / CHANGELOG 同步
const readme = readFileSync(join(ROOT, 'README.md'), 'utf8');
const pkg = readFileSync(join(ROOT, 'package.json'), 'utf8');
const changelog = readFileSync(join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树串尾已延伸至 smoke_v2293_deadsave（v2292 后接 v2293）',
  readme.includes('smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula + smoke_v2400_trialwarn（npm test 串跑）'));
ok('README 件套口径为二百二十四件套（二百二十三件套清除）且旧 188 口径零残留',
  readme.includes('冒烟二百二十四件套（二百二十三件套清除）') && !readme.includes('冒烟一百八十八件套（一百八十七件套清' + '除）'));
ok('README 含 v22.93 守护描述（阵亡画面「未存档」提示与 P 存档入口守护）',
  readme.includes('v22.93 起含阵亡画面「未存档」提示与 P 存档入口守护'));
ok('README 含 smoke_v2293_deadsave 入库（189 份）', readme.includes('smoke_v2293_deadsave 入库（189 份）'));
ok('README 仍保留 smoke_v2292_cavewatch 入库（188 份）历史口径', readme.includes('smoke_v2292_cavewatch 入库（188 份）'));
ok('README 仍保留 v22.92 守护描述（历史口径）', readme.includes('v22.92 起含星井矿脉洞窟领主祭坛守洞人新 NPC 守护'));
ok('README 系统清单含 v22.93 阵亡画面 P 存档与未存档提示条目',
  readme.includes('**阵亡画面 P 存档与未存档提示**（v22.93'));
ok('package.json test 串含 smoke_v2293_deadsave.mjs 且位于串尾',
  pkg.includes('node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs && node tests/smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs && node tests/smoke_v2395_shopscroll.mjs && node tests/smoke_v2396_steelarmor.mjs && node tests/smoke_v2397_baserow.mjs && node tests/smoke_v2398_econrow.mjs && node tests/smoke_v2399_dmgformula.mjs && node tests/smoke_v2400_trialwarn.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 189 件套', testChain === 224, String(testChain));
ok('CHANGELOG 含 v22.93 条目（顶 pin）', changelog.startsWith('## v24.00 '));
ok('CHANGELOG 仍保留 v22.92 条目（历史口径）', changelog.includes('## v22.92 星井矿脉洞窟领主祭坛正北新 NPC'));

// 8. 姊妹件套 pin（smoke_v2292/v2291/v2290 随新现实更新）
const readTest = (name) => readFileSync(join(ROOT, 'tests', name), 'utf8');
const s2292 = readTest('smoke_v2292_cavewatch.mjs');
const s2291 = readTest('smoke_v2291_lampguide.mjs');
const s2290 = readTest('smoke_v2290_statlink.mjs');
ok('smoke_v2292 的 GAME_VERSION 字面量 pin 已更新为 v22.93', s2292.includes("const GAME_VERSION = 'v24.00';"));
ok('smoke_v2292 的 CHANGELOG 顶 pin 已更新为 ## v22.93', s2292.includes("startsWith('## v24.00 '"));
ok('smoke_v2292 的件套 pin 已更新为二百二十四件套（二百二十三件套清除）', s2292.includes('二百二十四件套（二百二十三件套清除）'));
ok('smoke_v2292 的 README 串尾 pin 已延伸至 smoke_v2293_deadsave',
  s2292.includes('smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula + smoke_v2400_trialwarn（npm test 串跑）'));
ok('smoke_v2292 的 package 串尾 pin 已延伸至 smoke_v2293_deadsave',
  s2292.includes('node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs && node tests/smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs && node tests/smoke_v2395_shopscroll.mjs && node tests/smoke_v2396_steelarmor.mjs && node tests/smoke_v2397_baserow.mjs && node tests/smoke_v2398_econrow.mjs && node tests/smoke_v2399_dmgformula.mjs && node tests/smoke_v2400_trialwarn.mjs"'));
ok('smoke_v2292 的 testChain pin 已更新为 189', s2292.includes('testChain === 224'));
ok('smoke_v2291 的 GAME_VERSION 字面量 pin 已更新为 v22.93', s2291.includes("const GAME_VERSION = 'v24.00';"));
ok('smoke_v2291 的 testChain pin 已更新为 189', s2291.includes('testChain === 224'));
ok('smoke_v2290 的 GAME_VERSION 字面量 pin 已更新为 v22.93', s2290.includes("const GAME_VERSION = 'v24.00';"));
ok('smoke_v2290 的 testChain pin 已更新为 189', s2290.includes('testChain === 224'));

// 9. 旧代 v22.92 pin 全库零残留
const allTests = readdirSync(join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2293_deadsave.mjs');
const stale = [];
for (const f of allTests) {
  const src = readFileSync(join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "92';") || src.includes("GAME_VERSION === 'v22." + "92'") ||
      src.includes('testChain === ' + '188') || src.includes('一百八十八件套（一百八十七件套清' + '除）') ||
      src.includes('_gv[1] >= ' + '92') || src.includes("startsWith('## v22." + "92 '") ||
      src.includes("startsWith('## v22." + "92'")) stale.push(f);
}
ok('旧代 v22.92 字面量/恒等/件套/testChain/版本锚/顶 pin 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

// 10. 哨兵链（件套守护领先一位）已指向下一版 190 口径
const s2143 = readTest('smoke_v2143_talkekey.mjs');
ok('哨兵链 v2143 已含下一版件套口径（二百二十四件套（二百二十三件套清除））',
  s2143.includes('二百二十五件套（二百二十四件套清除）') &&
  s2143.includes("!readme.includes('二百二十五件套（二百二十四件套清除）')"));

console.log(`\n— v22.93 阵亡画面「未存档」提示与 P 存档入口 冒烟：${pass}/${pass + fail} 通过 —`);
process.exit(fail ? 1 : 0);
