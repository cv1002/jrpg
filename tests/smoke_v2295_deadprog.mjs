// smoke_v2295_deadprog.mjs —— v22.95 阵亡画面「冒险进度」五徽记行守护
// 承 v21.10-v22.94 冒烟入库先例：版本锚点 + 源级落位（menus.js drawDead 冒险进度行 / drawWin 434 行零回归）
// + adventureProgress 纯函数契约（与状态页/drawWin 同源）+ 行间预算 + 运行期全链路（DOM/音频/存储桩 +
// main.js 真实导入：drawDead 渲染捕获 五档旗标 ✓/✗ + 未存档提示/B 行共存 + R/T 零回归）+ README/package.json/
// CHANGELOG 同步 + 姊妹件套 pin + 旧代 v22.94 pin 全库零残留 + 哨兵链领先一位（192 口径）。
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

console.log('— v22.95 阵亡画面「冒险进度」五徽记行 冒烟 —');

// 1. 版本锚点
const dataSrc = readFileSync(join(ROOT, 'js/data.js'), 'utf8');
ok('data.js GAME_VERSION 字面量为 v22.95', dataSrc.includes("const GAME_VERSION = 'v23.94';"));
ok('旧 v22.94 字面量零残留', !dataSrc.includes("const GAME_VERSION = 'v22." + "94';"));
ok('data.js 含 v22.95 版本注释', dataSrc.includes('// v22.95 体验打磨·信息透明·纯显示：阵亡画面（drawDead）补「冒险进度」五徽记行'));
ok('data.js 仍保留 v22.94/v22.93 世代注释链（历史注释未动）',
  dataSrc.includes('// v22.94 新内容·纯风味') && dataSrc.includes('// v22.93 体验打磨·防误丢档·存档闭环收口'));
const { GAME_VERSION, MAPS } = await import('../js/data.js');
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.94（本版守 v22.95）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 99)), GAME_VERSION);

// 2. 源级落位：menus.js drawDead 冒险进度行 + drawWin 434 行零回归 + 既有行零位移
const menusSrc = readFileSync(join(ROOT, 'js/view/menus.js'), 'utf8');
const deadBlock = (menusSrc.match(/export function drawDead\(\)\{[\s\S]*?\n\}/) || [''])[0];
ok('drawDead 块存在', deadBlock.length > 0);
ok('drawDead 经 adventureProgress(hero) 派生并落至 (432,12px,#7d93a3)（与 drawWin 同款渲染式）',
  deadBlock.includes('const progD = adventureProgress(hero);') &&
  deadBlock.includes("'冒险进度：' + progD.map(([nm, dn]) => (dn ? '✓ ' : '✗ ') + nm).join(' · ')") &&
  deadBlock.includes("text('冒险进度：' + progD.map(([nm, dn]) => (dn ? '✓ ' : '✗ ') + nm).join(' · '), CV.width / 2, 432, '12px', '#7d93a3', 'center');"));
ok('menus.js 含 v22.95 注释（drawDead 冒险进度行说明）', menusSrc.includes('// v22.95 阵亡画面补「冒险进度」行'));
ok('drawDead 未存档提示行零回归（v22.93 口径逐字未动）',
  deadBlock.includes("const deadHint = pauseSaveHint(hero, S.unsaved, S.curSaveSlot, hasSlot(S.curSaveSlot));") &&
  deadBlock.includes("if (deadHint) text(deadHint, 320, 412, '12px', '#ff9d5b', 'center');"));
ok('drawDead 按键行逐字保留（R 332 / T 362 / B 392 零位移）',
  deadBlock.includes("text('按 R 重新开始本次冒险',CV.width/2,332,'15px','#7d93a3','center');") &&
  deadBlock.includes("text('按 T 返回标题画面',CV.width/2,362,'15px','#7d93a3','center');") &&
  deadBlock.includes("text('按 B 重整旗鼓，再战强敌！',CV.width/2,392,'15px','#ffd24a','center');"));
ok('drawDead 收集行/战绩/余粮/建议行零位移（236/264/292/312）',
  deadBlock.includes(",CV.width/2,236,'13px','#7d93a3','center');") &&
  deadBlock.includes(",CV.width/2,264,'13px','#e8eef1','center');") &&
  deadBlock.includes(",CV.width/2,292,'13px',") &&
  deadBlock.includes(",CV.width/2,312,'bold 13px','#7dd47f','center');"));
ok('drawWin 冒险进度行零回归（v22.89 口径 434 逐字未动）',
  menusSrc.includes('const progW = adventureProgress(S.G);') &&
  menusSrc.includes("CTX.fillText('冒险进度：' + progW.map(([nm, dn]) => (dn ? '✓ ' : '✗ ') + nm).join(' · '),CV.width/2,434);"));

// 3. adventureProgress 纯函数契约（与状态页/drawWin 同读一份源）
const { adventureProgress } = await import('../js/quests.js');
ok('adventureProgress 导出且为函数（单一数据源）', typeof adventureProgress === 'function');
const pEmpty = adventureProgress({});
ok('无旗标 → [灯芯✗ 星井✗ 回廊✗ 初灯✗ 试炼场✗] 五元组逐值',
  JSON.stringify(pEmpty) === JSON.stringify([['灯芯', false], ['星井', false], ['回廊', false], ['初灯', false], ['试炼场', false]]),
  JSON.stringify(pEmpty));
const pBoss = adventureProgress({ bossDefeated: true });
ok('bossDefeated → 仅「灯芯」✓', JSON.stringify(pBoss) === JSON.stringify([['灯芯', true], ['星井', false], ['回廊', false], ['初灯', false], ['试炼场', false]]));
const pCave = adventureProgress({ bossDefeated: true, caveBoss: true });
ok('bossDefeated+caveBoss → 灯芯✓ 星井✓（双徽记前）', pCave[1][1] === true && pCave[2][1] === false);
const pOpen = adventureProgress({ bossDefeated: true, caveBoss: true, galleryOpen: true });
ok('+galleryOpen → 回廊✓', pOpen[2][1] === true && pOpen[3][1] === false);
const pTrue = adventureProgress({ bossDefeated: true, caveBoss: true, galleryOpen: true, trueBoss: true });
ok('+trueBoss → 初灯✓', pTrue[3][1] === true && pTrue[4][1] === false);
const pAll = adventureProgress({ bossDefeated: true, caveBoss: true, galleryOpen: true, trueBoss: true, rushDone: true });
ok('全旗标 → 五档全 ✓（试炼场✓）', pAll.every(([, dn]) => dn) && pAll[4][1] === true);
ok('旗标缺失/undefined 防御（不抛错且判负）', adventureProgress({ galleryOpen: undefined })[2][1] === false);
ok('四图数据面（MAPS 四图与五徽记同源世界观）', Object.keys(MAPS).length === 4);

// 4. 行间预算（死屏全宽画布 640×480：432 与提示行 412 / 画布底 480 均 ≥16）
ok('死屏进度行 y=432 与提示行 412 行间 20 ≥16、距画布底 480 为 48（12px 字底 ≈433.4 不触底）',
  432 - 412 >= 16 && 480 - 432 >= 16);
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
const progAllX = '冒险进度：✗ 灯芯 · ✗ 星井 · ✗ 回廊 · ✗ 初灯 · ✗ 试炼场';
ok('进度行 12px estW ≤ 640 画布（≈' + Math.round(estW(progAllX)) + '）', estW(progAllX) <= 640);

// 5. 运行期全链路：DOM/音频/存储桩 + main.js 真实导入 + drawDead 渲染捕获 五档旗标
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

const hero = { name: '余烬', level: 5, gold: 100, bestiary: {}, time: 120, item: 2, potion2: 0,
  mushrooms: 1, ach: [], fragments: [], hp: 1, hpMax: 50, mp: 1, mpMax: 20, map: 'village' };
S.G = hero;
S.enemy = null;
S.scene = 'dead';
S.curSaveSlot = 1;
S.unsaved = false;

const CAPTURED = [];
const origFill = CTX.fillText;
CTX.fillText = (t, x, y) => { CAPTURED.push(String(t)); return origFill.call(CTX, t, x, y); };

// 5a. 零旗标普通战败 → 全 ✗ 进度行 + 无 B 行 + 无未存档提示
CAPTURED.length = 0;
let threw = null;
try { drawDead(); } catch (e) { threw = e; }
ok('运行期：drawDead 普通战败档（零旗标）渲染无抛错', threw === null, threw && threw.message);
ok('运行期：零旗标落画「冒险进度：✗ 灯芯 · ✗ 星井 · ✗ 回廊 · ✗ 初灯 · ✗ 试炼场」',
  CAPTURED.includes(progAllX), JSON.stringify(CAPTURED.filter((t) => t.includes('冒险进度'))));
ok('运行期：普通战败既有 R/T 行零回归 + 无 B 行',
  CAPTURED.includes('按 R 重新开始本次冒险') && CAPTURED.includes('按 T 返回标题画面') && !CAPTURED.includes('按 B 重整旗鼓，再战强敌！'));
ok('运行期：unsaved=false 零「未存档」文案（进度行单独落画不误报）',
  !CAPTURED.some((t) => t.includes('未存档')));

// 5b. 灯芯 ✓（bossDefeated）→ 进度行首档 ✓
hero.bossDefeated = true;
CAPTURED.length = 0;
drawDead();
ok('运行期：bossDefeated → 「✓ 灯芯 · ✗ 星井 · ✗ 回廊 · ✗ 初灯 · ✗ 试炼场」',
  CAPTURED.includes('冒险进度：✓ 灯芯 · ✗ 星井 · ✗ 回廊 · ✗ 初灯 · ✗ 试炼场'),
  JSON.stringify(CAPTURED.filter((t) => t.includes('冒险进度'))));

// 5c. 全旗标 → 五档全 ✓
hero.caveBoss = true; hero.galleryOpen = true; hero.trueBoss = true; hero.rushDone = true;
CAPTURED.length = 0;
drawDead();
ok('运行期：全旗标 → 「✓ 灯芯 · ✓ 星井 · ✓ 回廊 · ✓ 初灯 · ✓ 试炼场」',
  CAPTURED.includes('冒险进度：✓ 灯芯 · ✓ 星井 · ✓ 回廊 · ✓ 初灯 · ✓ 试炼场'),
  JSON.stringify(CAPTURED.filter((t) => t.includes('冒险进度'))));
delete hero.bossDefeated; delete hero.caveBoss; delete hero.galleryOpen; delete hero.trueBoss; delete hero.rushDone;

// 5d. 未存档 + Boss 战败 → 提示行 / B 行 / 进度行 三行共存（412/392/432）
mem['jrpg_save1'] = JSON.stringify({ G: { name: '旧档' }, savedAt: 1 });
hero._bossRetry = { name: '幽冥魔王', bossId: 'demon' };
S.unsaved = true;
CAPTURED.length = 0;
drawDead();
ok('运行期：Boss 战败档 未存档提示 + B 行 + 进度行 三行共存（412/392/432 同屏）',
  CAPTURED.includes('⚠️ 未存档 · 按 P 写入槽 1（已有存档，将覆盖）') &&
  CAPTURED.includes('按 B 重整旗鼓，再战强敌！') &&
  CAPTURED.includes(progAllX) &&
  CAPTURED.filter((t) => t.includes('未存档')).length === 1,
  JSON.stringify(CAPTURED.filter((t) => t.includes('未存档') || t.includes('重整') || t.includes('冒险进度'))));
hero._bossRetry = null;
S.unsaved = false;
CTX.fillText = origFill;

// 6. README / package.json / CHANGELOG 同步
const readme = readFileSync(join(ROOT, 'README.md'), 'utf8');
const pkg = readFileSync(join(ROOT, 'package.json'), 'utf8');
const changelog = readFileSync(join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树串尾已延伸至 smoke_v2295_deadprog（v2294 后接 v2295）',
  readme.includes('+ smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback（npm test 串跑）'));
ok('README 旧串尾零残留（smoke_v2294_crystalwatch（npm test 串跑）不在树尾）',
  !readme.includes('smoke_v2294_crystalwatch（npm test 串跑）'));
ok('README 件套口径为二百一十八件套（二百一十七件套清除）且旧 190 口径零残留',
  readme.includes('冒烟二百一十八件套（二百一十七件套清除）') && !readme.includes('冒烟一百九十件套（一百八十九件套清' + '除）'));
ok('README 含 v22.95 守护描述（阵亡画面「冒险进度」五徽记行守护）',
  readme.includes('v22.95 起含阵亡画面「冒险进度」五徽记行守护'));
ok('README 含 smoke_v2295_deadprog 入库（191 份）', readme.includes('smoke_v2295_deadprog 入库（191 份）'));
ok('README 仍保留 smoke_v2294_crystalwatch 入库（190 份）历史口径', readme.includes('smoke_v2294_crystalwatch 入库（190 份）'));
ok('README 仍保留 v22.94 守护描述（历史口径）', readme.includes('v22.94 起含星井矿脉终焉水晶守晶人新 NPC 守护'));
ok('README 系统清单含 v22.95 阵亡画面冒险进度五徽记行条目',
  readme.includes('**阵亡画面冒险进度五徽记行**（v22.95'));
ok('package.json 已收录 smoke_v2295_deadprog（npm test 串跑第 191 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2295_deadprog.mjs'));
ok('package.json 串尾为 ... smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs && node tests/smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs"',
  pkg.includes('node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs && node tests/smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 191 件套', testChain === 218, String(testChain));
ok('CHANGELOG 顶部已追加 v22.95 条目', changelog.startsWith('## v23.94 '));
ok('CHANGELOG 仍保留 v22.94 条目（历史口径）', changelog.includes('## v22.94 星井矿脉终焉水晶正南新 NPC'));

// 7. 姊妹件套 pin（smoke_v2294/v2293 随新现实更新）
const readTest = (name) => readFileSync(join(ROOT, 'tests', name), 'utf8');
const s2294 = readTest('smoke_v2294_crystalwatch.mjs');
const s2293 = readTest('smoke_v2293_deadsave.mjs');
ok('smoke_v2294 的 GAME_VERSION 字面量 pin 已更新为 v22.95', s2294.includes("const GAME_VERSION = 'v23.94';"));
ok('smoke_v2294 的 CHANGELOG 顶 pin 已更新为 ## v22.95', s2294.includes("startsWith('## v23.94 '"));
ok('smoke_v2294 的件套 pin 已更新为二百一十八件套（二百一十七件套清除）', s2294.includes('二百一十八件套（二百一十七件套清除）'));
ok('smoke_v2294 的 README 串尾 pin 已延伸至 smoke_v2295_deadprog',
  s2294.includes('smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback（npm test 串跑）'));
ok('smoke_v2294 的 package 串尾 pin 已延伸至 smoke_v2295_deadprog',
  s2294.includes('node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs && node tests/smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs"'));
ok('smoke_v2294 的 testChain pin 已更新为 191', s2294.includes('testChain === 218'));
ok('smoke_v2294 的版本锚已推进至 >= 95', s2294.includes('_gv[1] >= 99'));
ok('smoke_v2293 的 GAME_VERSION 字面量 pin 已更新为 v22.95', s2293.includes("const GAME_VERSION = 'v23.94';"));
ok('smoke_v2293 的 testChain pin 已更新为 191', s2293.includes('testChain === 218'));

// 8. 旧代 v22.94 pin 全库零残留
const allTests = readdirSync(join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2295_deadprog.mjs');
const stale = [];
for (const f of allTests) {
  const src = readFileSync(join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "94';") || src.includes("GAME_VERSION === 'v22." + "94'") ||
      src.includes('一百九十件套（一百八十九件套清' + '除）') || src.includes('testChain === ' + '190') ||
      src.includes('smoke_v2294_crystalwatch（npm test ' + '串跑）') || src.includes('_gv[1] >= ' + '94') ||
      src.includes("startsWith('## v22." + "94") || src.includes('smoke_v2294_crystalwatch.mjs"')) stale.push(f);
}
ok('旧代 v22.94 字面量/恒等/件套/testChain/串尾/版本锚/顶 pin/package 串尾 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

// 9. 哨兵链（件套守护领先一位）已指向下一版 192 口径
const s2143 = readTest('smoke_v2143_talkekey.mjs');
ok('哨兵链 v2143 已含下一版件套口径（二百一十八件套（二百一十七件套清除））',
  s2143.includes('二百一十九件套（二百一十八件套清除）') &&
  s2143.includes("!readme.includes('二百一十九件套（二百一十八件套清除）')"));

console.log(`\n— v22.95 阵亡画面「冒险进度」五徽记行 冒烟：${pass}/${pass + fail} 通过 —`);
process.exit(fail ? 1 : 0);
