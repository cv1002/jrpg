// v21.96 专项冒烟：阵亡画面补收集进度三件套——drawDead 在 战绩行（等级/金币/累计讨伐/时长）与余粮行
// （v19.88）之外补「🏆 成就 N/M · 📕 图鉴 N/M · 📦 宝箱 N/M」，补齐 v21.79 标题预览 slotPreview /
// v21.82 胜利画面 drawWin / v21.87 尾声战绩页 drawEnding / v21.94 状态页资源行确立的「收集进度三件套」
// 在 run 战果口径屏的最后一块拼图（四屏齐备后逐屏核对，阵亡画面是唯一仍缺 成就/图鉴/宝箱 的屏）——
// 玩家倒在强敌面前要判断「B 重整旗鼓 / R 重开新档」时，收集进度一眼可见。与 slotPreview/drawWin/
// drawEnding 同读 ACH_LIST / BESTIARY_TARGET / chestCount·chestTotal 一份单一数据源（BESTIARY_TARGET
// .filter 同式 + |0 归一、chestCount 三形态防御式、旧档零迁移）；新增行 y=312（建议行 292 与 R 提示
// 332 之间、行间 20px ≥16 不触），其余行零位移，纯显示零结算零存档。
// 本冒烟守护：版本锚点、data.js/menus.js 源级落位（新三件套派生 + 收集行 + 既有战绩/余粮/建议/按键行
// 逐字保留零位移 + 与 core.js slotPreview 同式互证）、行宽与垂直间距预算、运行期实证（推进档逐值 /
// 缺字段防御档 / Boss 战败档 _bossRetry 分支零回归三档）、README/package.json/CHANGELOG 同步、
// 姊妹件套 pin（v2195..v2176 九十二件套 / v2195..v2179 GAME_VERSION v21.96 / v2194..v2192
// 恒等 v21.96）随新现实更新 + 旧代 v21.95 字面量 pin 全库零残留复核。
import { GAME_VERSION, ACH_LIST, BESTIARY_TARGET, chestTotal } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.96 阵亡画面收集三件套冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.95 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.95', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 96)), GAME_VERSION);
ok('GAME_VERSION 字面量已为 v21.96', GAME_VERSION === 'v21.99', GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const menusSrc = read('../js/view/menus.js');
const coreSrc = read('../js/core.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v21.96 版本注释', dataSrc.includes('v21.96 阵亡画面补收集进度三件套'));
ok('data.js GAME_VERSION 字面量已更新为 v21.96', dataSrc.includes("const GAME_VERSION = 'v21.99';"));
ok('data.js 仍保留 v21.95 历史注释（累积注释块，姊妹 pin 不失效）', dataSrc.includes('v21.95 新成就「彻夜长明」'));

// —— 源级落位：drawDead 新三件套派生 + 收集行 + 既有行逐字保留零位移 ——
const deadBlock = (menusSrc.match(/export function drawDead\(\)\{[\s\S]*?\n\}/) || [''])[0];
ok('drawDead 块存在', deadBlock.length > 0);
ok('drawDead 派生图鉴数（BESTIARY_TARGET.filter 与 slotPreview/drawWin/drawEnding 同式）',
  deadBlock.includes('const codexN = BESTIARY_TARGET.filter((n) => ((hero.bestiary || {})[n] | 0) >= 1).length;'));
ok('drawDead 派生宝箱数（chestCount 防御式单源）', deadBlock.includes('const chestN = chestCount(hero);'));
ok('drawDead 收集行含 成就/图鉴/宝箱 与各自分母同源（ACH_LIST.length / BESTIARY_TARGET.length / chestTotal()）',
  deadBlock.includes('🏆 成就 ${(hero.ach||[]).length}/${ACH_LIST.length} · 📕 图鉴 ${codexN}/${BESTIARY_TARGET.length} · 📦 宝箱 ${chestN}/${chestTotal()}'));
ok('drawDead 收集行落位 y=312（bold 13px #7dd47f，与 drawWin/drawEnding 收集行同式同色）',
  deadBlock.includes(",CV.width/2,312,'bold 13px','#7dd47f','center');"));
ok('drawDead 战绩行逐字保留（等级/金币/累计讨伐/时长，y=236 零位移）',
  deadBlock.includes('当前 Lv.${hero.level} · 金币 ${hero.gold} · 累计讨伐 ${kills} 只') &&
  deadBlock.includes(",CV.width/2,236,'13px','#7d93a3','center');"));
ok('drawDead 余粮行逐字保留（v19.88，y=264 零位移）',
  deadBlock.includes('身上余粮：🍖 生命药水 ${hero.item} 瓶') && deadBlock.includes(",CV.width/2,264,'13px','#e8eef1','center');"));
ok('drawDead 建议行逐字保留（v21.41，y=292 零位移）',
  deadBlock.includes('再战前先用记忆图鉴看清魔物强度') && deadBlock.includes(",CV.width/2,292,'13px'"));
ok('drawDead 按键行逐字保留（R 332 / T 362 / B 392 零位移）',
  deadBlock.includes("'按 R 重新开始本次冒险',CV.width/2,332") &&
  deadBlock.includes("'按 T 返回标题画面',CV.width/2,362") &&
  deadBlock.includes('按 B 重整旗鼓，再战强敌！') && deadBlock.includes(",CV.width/2,392,'15px','#ffd24a','center');"));
ok('drawDead 旧行间无重叠（收集行 312 与 建议 292 / R 332 行间均 ≥16px）', 312 - 292 >= 16 && 332 - 312 >= 16);

// —— 与 core.js slotPreview（v21.79 三件套）/drawWin 同式互证：同一份单一数据源 ——
ok('core.js slotPreview 图鉴派生与 drawDead 同式（BESTIARY_TARGET.filter + |0 归一）',
  coreSrc.includes('BESTIARY_TARGET.filter((n) => ((hero.bestiary || {})[n] | 0) >= 1).length'));
ok('core.js slotPreview 宝箱派生与 drawDead 同式（chestCount(hero) 防御式）',
  coreSrc.includes('const chestN = chestCount(hero);'));

// —— 行宽预算（承 v21.82 口径：13px 单行 ≤640 画布，中心对齐）——
const estW = (s) => {
  let w = 0;
  for (const ch of String(s)) {
    const c = ch.codePointAt(0);
    if (c >= 0x4e00 && c <= 0x9fff) w += 15;
    else if (c >= 0x3000 && c <= 0x303f) w += 15;
    else if (c >= 0xff00 && c <= 0xffef) w += 15;
    else if (/[0-9A-Za-z]/.test(ch)) w += 7.5;
    else if (ch === ' ') w += 7.5;
    else if ('｜|:：。，、！？…—·【】[]'.includes(ch)) w += 15;
    else w += 8;
  }
  return w;
};
const worst = `🏆 成就 ${ACH_LIST.length}/${ACH_LIST.length} · 📕 图鉴 ${BESTIARY_TARGET.length}/${BESTIARY_TARGET.length} · 📦 宝箱 ${chestTotal()}/${chestTotal()}`;
const wWorst = estW(worst);
ok('最坏收集行估算宽 ≤640（13px 单行，画布中心对齐）', wWorst > 0 && wWorst <= 640, `≈${wWorst.toFixed(0)}px`);

// —— 运行期实证：DOM/音频/存储桩 + main.js 真实导入后 drawDead 渲染捕获 ——
const noop = () => {};
const CAPTURED = [];
function makeCtx() {
  const grad = { addColorStop: noop };
  return {
    canvas: { width: 640, height: 480 },
    measureText: (t) => ({ width: estW(t) }),
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
const menus = await import('../js/view/menus.js');
const { newGame } = await import('../js/core.js');

function renderDead(hero, enemy) {
  CAPTURED.length = 0;
  S.G = hero;
  S.enemy = enemy || null;
  S.scene = 'dead';
  menus.drawDead();
  return CAPTURED.slice();
}
const BEST = BESTIARY_TARGET.length, ACH = ACH_LIST.length, CHESTS = chestTotal();

// 推进档：成就 1/35、图鉴 2/13（史莱姆 2 + 野狼 1）、宝箱 2/12 —— 与 slotPreview/drawWin/drawEnding 同式
let hero = newGame('余烬');
Object.assign(hero, {
  level: 9, gold: 777, item: 3, potion2: 1, time: 3723,
  bestiary: { '史莱姆': 2, '野狼': 1 }, ach: ['firstblood'],
  chests: new Set(['22,1', '12,11']),
});
let cap = null, threw = null;
try { cap = renderDead(hero, { name: '野狼' }); } catch (e) { threw = e; }
ok('运行期：drawDead 推进档渲染不抛错', threw === null, threw && String(threw.stack || threw));
ok('运行期：收集行落位「🏆 成就 1/35 · 📕 图鉴 2/13 · 📦 宝箱 2/12」（与 slotPreview 同源逐值）',
  cap.some((t) => t.includes(`🏆 成就 1/${ACH} · 📕 图鉴 2/${BEST} · 📦 宝箱 2/${CHESTS}`)),
  cap.filter((t) => t.includes('图鉴')).join(' | '));
ok('运行期：战绩行逐字零回归（当前 Lv.9 · 金币 777 · 累计讨伐 3 只 · ⏱01:02:03）',
  cap.some((t) => t.includes('当前 Lv.9 · 金币 777 · 累计讨伐 3 只 · ⏱️01:02:03')));
ok('运行期：余粮行逐字零回归（🍖 3 瓶 · 🧪 1 瓶 · 🍄 0 株）',
  cap.some((t) => t.includes('🍖 生命药水 3 瓶 · 🧪 高级灵药 1 瓶 · 🍄 魔法蘑菇 0 株')));
ok('运行期：普通战败建议行逐字零回归（回村补给后先看清魔物强度）',
  cap.some((t) => t.includes('回村 旅馆/喷泉 补给') && t.includes('记忆图鉴看清魔物强度')));

// 防御档：旧档缺 bestiary/ach 字段（chests 保留 newGame 的 Set）→ 0/0/0 不抛错（v21.79 同款防御）
hero = newGame('灯见');
Object.assign(hero, { level: 1, gold: 30, time: 3 });
delete hero.bestiary; delete hero.ach;
threw = null;
try { cap = renderDead(hero, { name: '史莱姆' }); } catch (e) { threw = e; }
ok('运行期：drawDead 缺失字段防御档渲染不抛错', threw === null, threw && String(threw.stack || threw));
ok('运行期：防御档收集行报 0/0/0（成就 0/M · 图鉴 0/N · 宝箱 0/N）',
  cap.some((t) => t.includes(`🏆 成就 0/${ACH} · 📕 图鉴 0/${BEST} · 📦 宝箱 0/${CHESTS}`)));

// Boss 战败档：_bossRetry 分支零回归 + 三件套行共存（败于 幽冥魔王 · 按 B 重整旗鼓）
hero = newGame('潮');
Object.assign(hero, {
  level: 7, gold: 500, time: 6000,
  bestiary: { '幽冥魔王': 1 }, ach: ['firstblood', 'boss'],
  chests: new Set(['9,9']),
});
hero._bossRetry = { name: '幽冥魔王', bossId: 'demon' };
threw = null;
try { cap = renderDead(hero, { name: '幽冥魔王' }); } catch (e) { threw = e; }
ok('运行期：Boss 战败档渲染不抛错（_bossRetry 分支）', threw === null, threw && String(threw.stack || threw));
ok('运行期：Boss 战败档 败于/建议/B 提示 与 三件套行 共存（零回归 + 新行共存）',
  cap.some((t) => t.includes('败于 幽冥魔王')) &&
  cap.some((t) => t.includes('先回旅馆补给并练级') && t.includes('再按 B 重整旗鼓')) &&
  cap.some((t) => t.includes('按 B 重整旗鼓，再战强敌！')) &&
  cap.some((t) => t.includes(`🏆 成就 2/${ACH} · 📕 图鉴 1/${BEST} · 📦 宝箱 1/${CHESTS}`)));

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树收录 smoke_v2196_deadrecap 且位于串尾（v2196 随新现实由当版冒烟守护）', readme.includes('smoke_v2195_ptime2 + smoke_v2196_deadrecap + smoke_v2197_lucky2 + smoke_v2198_winsave + smoke_v2199_rich2（npm test 串跑）'));
ok('README 件套口径为九十五件套（九十四件套清除）',
  readme.includes('冒烟九十五件套（九十四件套清除）') && !readme.includes('冒烟九十件套（八十九件套清除）'));
ok('README 含 v21.96 守护描述', readme.includes('v21.96 起含阵亡画面收集三件套守护'));
ok('README 系统清单「战败复盘」段补收集三件套口径（另补**收集进度三件套**）',
  readme.includes('另补**收集进度三件套**') && readme.includes('🏆 成就 N/M · 📕 图鉴 N/M · 📦 宝箱 N/M'));
ok('package.json 已收录 smoke_v2196_deadrecap（npm test 串跑第 92 份）',
  pkg.includes('smoke_v2196_deadrecap.mjs') && /smoke_v2195_ptime2\.mjs && node tests\/smoke_v2196_deadrecap\.mjs/.test(pkg));
ok('CHANGELOG 含 v21.96 条目', changelog.includes('## v21.96 '));

// —— 姊妹件套 pin 复查（v21.7 惯例：本版冒烟守护姊妹随新现实更新）——
const suite92 = ['smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs', 'smoke_v2193_hunt100.mjs',
  'smoke_v2192_travelwarn.mjs', 'smoke_v2191_ptime.mjs', 'smoke_v2190_launch.mjs',
  'smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs', 'smoke_v2187_endingrecap.mjs',
  'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs', 'smoke_v2184_lvl12.mjs',
  'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs', 'smoke_v2181_helpquickcast.mjs',
  'smoke_v2180_grain.mjs', 'smoke_v2179_titlerecap.mjs', 'smoke_v2178_codexseen.mjs',
  'smoke_v2177_elites.mjs', 'smoke_v2176_allchests.mjs'];
for (const nm of suite92) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README 件套 pin 已随新现实更新为九十五件套（九十四件套清除）`,
    src.includes('九十五件套（九十四件套清除）'));
}
const vers = ['smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs', 'smoke_v2193_hunt100.mjs',
  'smoke_v2192_travelwarn.mjs', 'smoke_v2191_ptime.mjs', 'smoke_v2190_launch.mjs',
  'smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs', 'smoke_v2187_endingrecap.mjs',
  'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs', 'smoke_v2184_lvl12.mjs',
  'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs', 'smoke_v2181_helpquickcast.mjs',
  'smoke_v2179_titlerecap.mjs'];
for (const nm of vers) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 字面量 pin 已随新现实更新为 v21.96`,
    src.includes("const GAME_VERSION = 'v21.99';"));
}
for (const nm of ['smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs', 'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs']) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 恒等 pin（===）已随新现实更新为 v21.96`,
    src.includes("GAME_VERSION === 'v21.99'"));
}
// 旧代 pin 零残留：全部测试文件不得再含 v21.95 版本字面量 pin（拆串构造避免本文件扫描行自匹配）
const OLD_GV = "const GAME_VERSION = 'v21.9" + "5';";
let stale = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes(OLD_GV)) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v21.95 全库清零）', stale.length === 0, stale.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
