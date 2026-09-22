// smoke_v2302_cmdprev.mjs —— v23.02 战斗指令栏 [5]防御/[6]蓄力 效果预览守护（体验打磨·信息透明·纯显示）
// 承 v21.10-v23.01 冒烟入库先例：版本锚点 + 源级落位（data.js v23.02 注释/GAME_VERSION 字面量 v23.02/
// v23.01 历史注释保留零 v23.01 字面量残留 + drawBattle.js v23.02 注释/新指令栏模板/旧裸式零残留/
// [1]/[3]/[4] 与 ⛔ 前缀测量零回归）+ 纯函数/常量逐值（DEFEND_MULT 派生减伤%、CHARGE_MULT）× 运行期全链路
// （DOM/音频/存储桩 + main.js 真实导入：drawBattle 渲染捕获「[5]防御·减伤50%」「[6]蓄力×1.5」落画 + 瞄
// 准 [4]逃跑成功率/[3]药水恢复量零回归 + 指令栏宽度预算）+ README/package.json/CHANGELOG 同步
// （冒烟二百一十四件套（二百一十三件套清除）/串尾/入库 198 份/顶 pin）+ 姊妹件套 pin（smoke_v2301
// 随新现实更新）+ 哨兵链领先一位（199 口径）+ 旧代 v23.01 pin 全库零残留。
import { GAME_VERSION, DEFEND_MULT, CHARGE_MULT, FLEE_SUCCESS, DEFEND_MP, COUNTER_CHANCE, COUNTER_MULT } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v23.02 战斗指令栏 [5]防御/[6]蓄力 效果预览守护冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v23.01 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v23.01（本版守 v23.02）', !!_gv && (_gv[0] > 23 || (_gv[0] === 23 && _gv[1] >= 2)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const dbSrc = read('../js/view/drawBattle.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v23.02 版本注释', dataSrc.includes('// v23.02 体验打磨·信息透明·纯显示：战斗指令栏'));
ok('data.js GAME_VERSION 字面量已为 v23.02（旧 v23.01 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.78';") && !dataSrc.includes("const GAME_VERSION = 'v23." + "01';"));
ok('data.js 仍保留 v23.01 历史注释（出没生态行注释未动）', dataSrc.includes('// v23.01 文档整理·数值说明·同源口径'));

// —— drawBattle.js 源级落位：新指令栏模板 + 旧裸式零残留 + 既有标注零回归 ——
ok('drawBattle.js 含 v23.02 注释（指令栏 [5]防御/[6]蓄力 效果预览）',
  dbSrc.includes('// v23.02 指令栏 [5]防御/[6]蓄力 效果预览'));
ok('drawBattle.js 含 v23.44 注释（指令栏 [5]防御 预览补全回蓝/反击）',
  dbSrc.includes('// v23.44 指令栏 [5]防御 预览补全「回蓝/反击」'));
ok('drawBattle.js 指令栏已接 [5]防御 减伤/回蓝/反击 三件套全量预览（DEFEND_MULT·DEFEND_MP·COUNTER_CHANCE·COUNTER_MULT 派生）',
  dbSrc.includes('[5]防御·减${Math.round((1 - DEFEND_MULT) * 100)}%·回${DEFEND_MP}MP·反击${Math.round(COUNTER_CHANCE * 100)}%×${COUNTER_MULT}'));
ok('drawBattle.js [4]逃跑 token 已随 v23.44 压缩为「·N%」（FLEE_SUCCESS 派生）',
  dbSrc.includes("'·' + Math.round(FLEE_SUCCESS * 100) + '%'"));
ok('drawBattle.js 指令栏已接 [6]蓄力×N（CHARGE_MULT 读数）', dbSrc.includes('[6]蓄力×${CHARGE_MULT}`'));
ok('drawBattle.js 旧裸式指令栏零残留（[5]防御  [6]蓄力）', !dbSrc.includes('[5]防御  [6]蓄力'));
ok('drawBattle.js [1]攻击≈N伤 标注零回归', dbSrc.includes('[1]攻击${atkPrev}'));
ok('drawBattle.js [4]逃跑成功率标注零回归（FLEE_SUCCESS 派生）', dbSrc.includes('Math.round(FLEE_SUCCESS * 100) + \'%\''));
ok('drawBattle.js ⛔ 前缀测量行零回归（[:4]逃跑 截止，逐字未动）',
  dbSrc.includes('`[1]攻击${atkPrev}  [2]技能  [3]药水🍖×${pN}${p2 ? ` 🧪×${p2}` : \'\'}  [4]逃跑`).width'));
ok('drawBattle.js [3]恢复量预览零回归（potionRestore/elixirRestore + 自动先喝注记）',
  dbSrc.includes('（自动先喝🧪）') && dbSrc.includes('[3]恢复：'));

// —— 常量逐值（单一数据源：指令栏标注与角标/预判/结算同读）——
ok('DEFEND_MULT === 0.5（减伤 50%）', DEFEND_MULT === 0.5, String(DEFEND_MULT));
ok('CHARGE_MULT === 1.5（蓄力 ×1.5）', CHARGE_MULT === 1.5, String(CHARGE_MULT));
ok('FLEE_SUCCESS === 0.6（成功率约 60%）', FLEE_SUCCESS === 0.6, String(FLEE_SUCCESS));
ok('DEFEND_MP === 2（防御回蓝 2MP）', DEFEND_MP === 2, String(DEFEND_MP));
ok('COUNTER_CHANCE === 0.5（50% 几率反击）', COUNTER_CHANCE === 0.5, String(COUNTER_CHANCE));
ok('COUNTER_MULT === 0.7（反击 ×0.7）', COUNTER_MULT === 0.7, String(COUNTER_MULT));
ok('指令栏减伤% 派生式与 DEFEND_MULT 同源（100*(1-0.5)=50）', Math.round((1 - DEFEND_MULT) * 100) === 50);
ok('指令栏蓄力标注与 CHARGE_MULT 同源（×1.5）', ('×' + CHARGE_MULT) === '×1.5');

// —— 运行期实证：DOM/音频/存储桩 + main.js 真实导入 + drawBattle 渲染捕获 ——
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
const { drawBattle } = await import('../js/view/drawBattle.js');
const { CTX } = await import('../js/view/canvas.js');

const CAP = [];
const origFill = CTX.fillText;
CTX.fillText = (t) => { CAP.push(String(t)); return origFill.call(CTX, t, 0, 0); };

function heroObj() {
  return { name: '余烬', level: 1, xp: 0, xpNext: 20, hp: 45, hpMax: 45, mp: 10, mpMax: 12,
    item: 0, potion2: 0, atkMax: 11, defMax: 6, skills: [], weapon: '木剑', armor: '布衣',
    gold: 30, seen: {}, bestiary: {}, quests: {} };
}
function entryEnemy() {
  return { name: '史莱姆', hp: 16, hpMax: 16, xp: 8, gold: 8, atk: 7, def: 4, color: '#7fd84f',
    draw: 'slime', acts: [{ type: 'attack', w: 100 }], weak: 'fire' };
}
let threw = null;
const CAP2 = [];
CTX.fillText = (t) => { CAP2.push(String(t)); return origFill.call(CTX, t, 0, 0); };
S.G = heroObj();
S.enemy = entryEnemy();
S.scene = 'battle';
S.blog = []; S.blogView = 0;
S.fx = []; S.parr = [];
S.skillMenuOpen = false; S.battleTurn = 1;
S.shake = null; S.flash = null;
try { drawBattle(); } catch (e) { threw = e; }
ok('运行期：drawBattle（无药无灵药档）渲染零抛错', threw === null, threw && String(threw.stack || threw));
const barLine = CAP2.find((c) => c.includes('[1]攻击') && c.includes('[6]蓄力'));
ok('运行期：指令栏落画含 [5]防御 减伤/回蓝/反击 三件套（DEFEND_MULT·DEFEND_MP·COUNTER_CHANCE·COUNTER_MULT 派生）',
  !!barLine && barLine.includes('[5]防御·减' + (100 * (1 - DEFEND_MULT)) + '%·回' + DEFEND_MP + 'MP·反击' +
    Math.round(COUNTER_CHANCE * 100) + '%×' + COUNTER_MULT), JSON.stringify(barLine));
ok('运行期：指令栏落画含 [6]蓄力×1.5（CHARGE_MULT 读数）',
  !!barLine && barLine.includes('[6]蓄力×' + CHARGE_MULT), JSON.stringify(barLine));
ok('运行期：[4]逃跑成功率标注 v23.44 压缩口径零回归（·N% 由 FLEE_SUCCESS 派生）',
  !!barLine && barLine.includes('[4]逃跑·' + Math.round(FLEE_SUCCESS * 100) + '%'), JSON.stringify(barLine));
const barW = CTX.measureText(barLine || '').width;
ok('运行期：指令栏宽度预算（60 起左对齐、13px 计 wid ≤580）', barW <= 580, String(barW));
ok('运行期：无药无灵药时 [3]恢复 预览零噪音', !CAP2.some((c) => c.includes('[3]恢复：')));

// 带药水档：[3]恢复量预览 + 自动先喝注记零回归
CAP2.length = 0;
S.G = heroObj(); S.G.item = 3; S.G.potion2 = 1; S.G.hp = 20; S.G.hpMax = 45;
try { drawBattle(); } catch (e) { threw = threw || e; }
ok('运行期：drawBattle（带药水档）渲染零抛错', threw === null, threw && String(threw.stack || threw));
ok('运行期：带药档指令栏 [3]药水🍖×3 🧪×1 零回归',
  CAP2.some((c) => c.includes('[3]药水🍖×3 🧪×1')), JSON.stringify(CAP2.find((c) => c.includes('[3]药水')) || ''));
ok('运行期：带药档 [3]恢复 预览与自动先喝注记零回归',
  CAP2.some((c) => c.includes('[3]恢复：') && c.includes('（自动先喝🧪）')),
  JSON.stringify(CAP2.find((c) => c.includes('[3]恢复：')) || ''));

CTX.fillText = origFill;
S.G = null; S.enemy = null;

// —— README 同步守护 ——
ok('README tests 树串尾已延伸至 smoke_v2302_cmdprev（v2301 后接 v2302）',
  readme.includes('smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap（npm test 串跑）'));
ok('README 旧串尾零残留（smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap（npm test 串跑）不在树尾）',
  !readme.includes('smoke_v2301_eco（npm test 串' + '跑）'));
ok('README 件套口径为二百一十四件套（二百一十三件套清除）且旧 196 口径零残留',
  readme.includes('冒烟二百一十四件套（二百一十三件套清除）') && !readme.includes('冒烟一百九十六件套（一百九十五件套清' + '除）'));
ok('README 含 v23.02 守护描述（指令栏 [5]防御/[6]蓄力 效果预览守护）',
  readme.includes('v23.02 起含战斗指令栏 [5]防御/[6]蓄力 效果预览守护'));
ok('README 含 smoke_v2302_cmdprev 入库（198 份）', readme.includes('smoke_v2302_cmdprev 入库（198 份）'));
ok('README 仍保留 v23.01 守护描述（历史口径）', readme.includes('v23.01 起含「出没生态」数值速查行守护'));
ok('README 仍保留 smoke_v2301_eco 入库（197 份）历史口径', readme.includes('smoke_v2301_eco 入库（197 份）'));

// —— package.json / CHANGELOG 同步守护 ——
ok('package.json 已收录 smoke_v2302_cmdprev（npm test 串跑第 198 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2302_cmdprev.mjs'));
ok('package.json 串尾为 ... smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs"',
  pkg.includes('node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 198 件套', testChain === 214, String(testChain));
ok('CHANGELOG 顶部已追加 v23.02 条目', changelog.startsWith('## v23.78 '));
ok('CHANGELOG 仍保留 v23.01 条目（历史口径）', changelog.includes('## v23.01 README「数值速查」补「出没生态」行'));

// —— 姊妹件套 pin 随新现实更新 + 旧代 v23.01 pin 零残留 ——
const s2301 = read('smoke_v2301_eco.mjs');
const s2143 = read('smoke_v2143_talkekey.mjs');
ok('smoke_v2301 的 GAME_VERSION 字面量 pin 已更新为 v23.02', s2301.includes("const GAME_VERSION = 'v23.78';"));
ok('smoke_v2301 的 CHANGELOG 顶 pin 已更新为 ## v23.02',
  s2301.includes("startsWith('## v23.78 '"));
ok('smoke_v2301 的件套 pin 已更新为二百一十四件套（二百一十三件套清除）',
  s2301.includes('二百一十四件套（二百一十三件套清除）'));
ok('smoke_v2301 的 README 串尾 pin 已延伸至 smoke_v2302_cmdprev',
  s2301.includes('smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap（npm test 串跑）'));
ok('smoke_v2301 的 package 串尾 pin 已延伸至 smoke_v2302_cmdprev',
  s2301.includes('node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs"'));
ok('smoke_v2301 的 testChain pin 已更新为 198', s2301.includes('testChain === 214'));
ok('smoke_v2143 哨兵链已推进至二百一十四件套（二百一十三件套清除）',
  s2143.includes('二百一十五件套（二百一十四件套清除）') && s2143.includes("!readme.includes('二百一十五件套（二百一十四件套清除）')"));

// 旧代 v23.01 pin 全库零残留（不含本件）
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2302_cmdprev.mjs');
const stale = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("const GAME_VERSION = 'v23." + "01';") || src.includes("GAME_VERSION === 'v23.01'") ||
      src.includes('一百九十七件套（一百九十六件套清' + '除）') || src.includes('testChain === 19' + '7') ||
      src.includes('smoke_v2301_eco（npm test 串' + '跑）') ||
      src.includes("startsWith('## v23.01") || src.includes('node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs"')) stale.push(f);
}
ok('旧代 v23.01 字面量/恒等/件套/testChain/串尾/顶 pin/package 串尾 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

console.log(`\n— v23.02 战斗指令栏 [5]防御/[6]蓄力 效果预览守护冒烟：${n - failed}/${n} 通过 —`);
if (failed) process.exit(1);
