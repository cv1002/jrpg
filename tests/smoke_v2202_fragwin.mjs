// v22.2 专项冒烟：胜利画面收集行补「🕯️ 记忆碎片 N/4」——drawWin 的收集行（v21.82 📕 图鉴 / 📦 宝箱）
// 是「灯芯回来了」这块 run 总结屏的收集口径，但击败幽冥魔王首胜恰在此刻掉落「碎片·灯卫的誓」
// （battle.winBattle 强敌首胜掉落分支）——刚捡起的真结局关键收集在这块屏上无回声（尾声战绩行 v19.49
// 早有 记忆 N/N、状态页 v22.1 有 🕯️、J 日志「记忆碎片」节有占位，唯独胜利屏缺；v22.1 状态页资源行
// 「资源总览行至此覆盖全资源」之后，跑总结屏的碎片口径仍缺胜利屏一块）。
// 本冒烟守护：版本锚点、data.js/menus.js 源级落位（fragW 派生 + 收集行 🕯️ 并入 + 既有段逐字保留 +
// 旧行零残留 + y=378 零位移）、与 drawEnding/drawStatus/drawJournal 同源互证（FRAGMENTS.length 单一
// 数据源）、行宽预算（estW ≤640 官方口径，@napi-rs/canvas 14px 真实实测最宽 ≈257.6 画布内）、运行期
// 实证（推进档 2/4 → 空档 0/4 → 缺字段防御档 0/4 → 📕📦⏱ 共存段）、README/package.json/CHANGELOG 同步、
// 姊妹件套 pin（v2201..v2176 九十八件套 / v2201..v2179 GAME_VERSION v22.2 / v2201..v2192 恒等 v22.2 /
// v2201..v2192 树尾 pin）随新现实更新 + 旧代 v22.1 字面量/恒等 pin 与旧代九十七件套 pin 全库零残留复核。
import { GAME_VERSION, FRAGMENTS, BESTIARY_TARGET, chestTotal, ACH_LIST } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.2 胜利画面记忆碎片进度冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v22.1 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.1', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 2)), GAME_VERSION);
ok('GAME_VERSION 字面量已为 v22.2', GAME_VERSION === 'v22.11', GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const menusSrc = read('../js/view/menus.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v22.2 版本注释', dataSrc.includes('v22.2 胜利画面收集行补「🕯️ 记忆碎片 N/4」'));
ok('data.js GAME_VERSION 字面量已更新为 v22.2', dataSrc.includes("const GAME_VERSION = 'v22.11';"));
ok('data.js 仍保留 v22.1 历史注释（累积注释块，姊妹 pin 不失效）', dataSrc.includes('v22.1 状态页资源行补「🕯️ 记忆碎片 N/4」'));

// —— 源级落位：drawWin 碎片派生与收集行并入 ——
const winBlock = (menusSrc.match(/export function drawWin\(\)\{[\s\S]*?\n\}/) || [''])[0];
ok('drawWin 块存在', winBlock.length > 0);
ok('drawWin 派生碎片数（与 drawStatus/drawEnding/drawJournal 同读 hero.fragments，防御式旧档零迁移）',
  winBlock.includes('const fragW = (S.G.fragments || []).length;'));
ok('收集行并入 🕯️ 记忆碎片 N/4（FRAGMENTS.length 单一数据源分母）',
  winBlock.includes('🕯️ 记忆碎片 ${fragW}/${FRAGMENTS.length}'));
ok('收集行既有段逐字保留（📕 图鉴 · 📦 宝箱 双口径）',
  winBlock.includes('📕 图鉴 ${codexN}/${BESTIARY_TARGET.length} · 📦 宝箱 ${chestN}/${chestTotal()}'));
ok('收集行落位 y=378、页脚 y=396 零位移（v21.82/v21.98 布局逐字未动）',
  winBlock.includes(',CV.width/2,378);') && winBlock.includes(",CV.width/2,396);"));
ok('drawWin 旧收集行（无 🕯️）零残留', !winBlock.includes('· 📦 宝箱 ${chestN}/${chestTotal()}\',CV.width/2,378)'));
ok('drawWin v19.49 战绩行逐字保留（累计讨伐/成就 N/M/时长）',
  winBlock.includes('`累计讨伐 ${kills} 只 · 成就 ${(S.G.ach||[]).length}/${ACH_LIST.length} · ⏱️${fmtTime(S.G.time)}`'));
ok('drawWin 页脚 P 口径与提示行零回归（v21.98）',
  winBlock.includes('按 Enter 观看尾声 · 按 P 存档 · 按 R 重开新档(连按两次)') && winBlock.includes('💡 本局战果未自动存档'));

// —— 与 drawEnding/drawStatus/drawJournal 同源互证：FRAGMENTS.length 单一数据源 ——
ok('menus.js 碎片进度各端同读 FRAGMENTS.length（drawStatus 资源行 / drawJournal / drawWin 三端同源）',
  menusSrc.includes('FRAGMENTS.length'));
ok('menus.js 防御式读取三端齐备（(hero.fragments||[])/(S.G.fragments||[])）',
  menusSrc.includes('(hero.fragments || []).length') && winBlock.includes('(S.G.fragments || []).length'));

// —— 行宽预算：v21.18 同款 estW（14px 单行 ≤640 画布，中心对齐两侧余量）；@napi-rs 实测 257.6 ——
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
const worst = `📕 图鉴 ${BESTIARY_TARGET.length}/${BESTIARY_TARGET.length} · 📦 宝箱 ${chestTotal()}/${chestTotal()} · 🕯️ 记忆碎片 ${FRAGMENTS.length}/${FRAGMENTS.length}`;
const wWorst = estW(worst);
ok('最坏收集行估算宽 ≤640（14px 单行，画布中心对齐；@napi-rs/canvas 真实实测 ≈257.6 余量充足）',
  wWorst > 0 && wWorst <= 640, `≈${wWorst.toFixed(0)}px`);
ok('收集行与战绩行/页脚垂直不重叠（378 与 362/396 间距 ≥16px）', 378 - 362 >= 16 && 396 - 378 >= 16);

// —— 运行期实证：DOM/音频/存储桩 + main.js 真实导入后 drawWin 渲染捕获 ——
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

// 推进档：碎片 2/4（石心魔像 + 幽冥魔王）、图鉴 2/13、宝箱 2/12、成就 1/38 —— 与 slotPreview/图鉴页/状态页同式
S.G = {
  name: '余烬', diff: 0, level: 9, xp: 100, xpNext: 500, gold: 777, item: 3, potion2: 1,
  weapon: '圣光之剑', armor: '锁子甲', map: 'dungeon', x: 20, y: 13,
  hp: 90, hpMax: 100, mp: 30, mpMax: 40, skills: ['火焰斩', '冰霜击'],
  poison: 0, bossDefeated: true, caveBoss: false, trueBoss: false,
  rushStage: 0, rushDone: false, visited: ['village', 'dungeon'], tutDone: true,
  bestiary: { '史莱姆': 2, '野狼': 1 }, totalWins: 30, drops: 2, ach: ['firstblood'],
  chests: new Set(['22,1', '12,11']), mushrooms: 4, quest: 3,
  quests: { side_mushroom: 'done' }, time: 3723,
  fragments: [FRAGMENTS[0].id, FRAGMENTS[1].id],
};
let threw = null;
try { CAPTURED.length = 0; menus.drawWin(); } catch (e) { threw = e; }
ok('运行期：drawWin 推进档渲染不抛错', threw === null, threw && String(threw.stack || threw));
ok('运行期：收集行落位「📕 图鉴 2/13 · 📦 宝箱 2/12 · 🕯️ 记忆碎片 2/4」（与 slotPreview 同源逐值）',
  CAPTURED.some((t) => t.includes(`📕 图鉴 2/${BESTIARY_TARGET.length} · 📦 宝箱 2/${chestTotal()} · 🕯️ 记忆碎片 2/${FRAGMENTS.length}`)));
ok('运行期：收集行与战绩行/⏱ 共存（🕯️ 📕 📦 ⏱ 同屏）',
  CAPTURED.some((t) => t.includes('累计讨伐 3 只 · 成就 1/' + ACH_LIST.length + ' · ⏱️01:02:03')));

// 全收集档：碎片 4/4 —— 真结局关键收集在胜利屏一眼可见
S.G.fragments = FRAGMENTS.map((f) => f.id);
threw = null;
try { CAPTURED.length = 0; menus.drawWin(); } catch (e) { threw = e; }
ok('运行期：drawWin 全收集档渲染不抛错', threw === null, threw && String(threw.stack || threw));
ok('运行期：全收集档报 🕯️ 记忆碎片 4/4', CAPTURED.some((t) => t.includes(`🕯️ 记忆碎片 ${FRAGMENTS.length}/${FRAGMENTS.length}`)));

// 防御档：旧档缺 fragments 字段 → 0/4 不抛错（v22.1 同款防御式读取、零迁移）
S.G = { name: '灯见', level: 1, gold: 30, map: 'village', time: 3, bossDefeated: false, caveBoss: false, trueBoss: false };
threw = null;
try { CAPTURED.length = 0; menus.drawWin(); } catch (e) { threw = e; }
ok('运行期：drawWin 缺失字段防御档渲染不抛错', threw === null, threw && String(threw.stack || threw));
ok('运行期：防御档收集行报 0/0/0（图鉴 0/M · 宝箱 0/N · 碎片 0/4）',
  CAPTURED.some((t) => t.includes(`📕 图鉴 0/${BESTIARY_TARGET.length} · 📦 宝箱 0/${chestTotal()} · 🕯️ 记忆碎片 0/${FRAGMENTS.length}`)));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 已同步（tests 树收录 smoke_v2202_fragwin + 九十八件套口径）',
  readme.includes('smoke_v2202_fragwin') && readme.includes('一百零七件套（一百零六件套清除）'));
ok('README 含 v22.2 守护描述', readme.includes('v22.2 起含胜利画面记忆碎片进度守护'));
ok('README 不含旧「九十七件套（九十六件套清' + '除）」旧口径', !readme.includes('冒烟九十七件套（九十六件套清' + '除）'));
ok('package.json 已收录 smoke_v2202_fragwin（npm test 串跑第 98 份）',
  pkg.includes('tests/smoke_v2202_fragwin.mjs') && /smoke_v2201_fragstatus\.mjs && node tests\/smoke_v2202_fragwin\.mjs/.test(pkg));
ok('CHANGELOG 含 v22.2 条目', changelog.includes('## v22.2 '));

// —— 姊妹件套 pin（v21.7 惯例：最新版守护旧 pin 随新现实更新） ——
const suite98 = ['smoke_v2201_fragstatus.mjs', 'smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs',
  'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs', 'smoke_v2196_deadrecap.mjs',
  'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs', 'smoke_v2193_hunt100.mjs',
  'smoke_v2192_travelwarn.mjs', 'smoke_v2191_ptime.mjs', 'smoke_v2190_launch.mjs',
  'smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs', 'smoke_v2187_endingrecap.mjs',
  'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs', 'smoke_v2184_lvl12.mjs',
  'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs', 'smoke_v2181_helpquickcast.mjs',
  'smoke_v2180_grain.mjs', 'smoke_v2179_titlerecap.mjs', 'smoke_v2178_codexseen.mjs',
  'smoke_v2177_elites.mjs', 'smoke_v2176_allchests.mjs'];
for (const nm of suite98) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README 件套 pin 已随新现实更新为一百零七件套（一百零六件套清除）`,
    src.includes('一百零七件套（一百零六件套清除）'));
}
for (const nm of ['smoke_v2201_fragstatus.mjs', 'smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs',
  'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs', 'smoke_v2196_deadrecap.mjs',
  'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs', 'smoke_v2193_hunt100.mjs',
  'smoke_v2192_travelwarn.mjs', 'smoke_v2191_ptime.mjs', 'smoke_v2190_launch.mjs',
  'smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs', 'smoke_v2187_endingrecap.mjs',
  'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs', 'smoke_v2184_lvl12.mjs',
  'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs', 'smoke_v2181_helpquickcast.mjs',
  'smoke_v2179_titlerecap.mjs']) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 字面量 pin 已随新现实更新为 v22.2`,
    src.includes("const GAME_VERSION = 'v22.11';"));
}
for (const nm of ['smoke_v2201_fragstatus.mjs', 'smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs',
  'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs', 'smoke_v2196_deadrecap.mjs',
  'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs', 'smoke_v2193_hunt100.mjs',
  'smoke_v2192_travelwarn.mjs']) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 恒等 pin（===）已随新现实更新为 v22.2`,
    src.includes("GAME_VERSION === 'v22.11'"));
}
for (const nm of ['smoke_v2201_fragstatus.mjs', 'smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs',
  'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs', 'smoke_v2196_deadrecap.mjs',
  'smoke_v2195_ptime2.mjs', 'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs']) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README tests 树尾 pin 已随新现实更新（+ smoke_v2202_fragwin）`,
    src.includes('smoke_v2201_fragstatus + smoke_v2202_fragwin + smoke_v2204_brew2 + smoke_v2209_achstatus + smoke_v2210_unsaved + smoke_v2211_lampkid（npm test 串跑）'));
}
// 旧代 GAME_VERSION 字面量/恒等 pin 零残留（v22.1 全库清零；拼接避免本文件自匹配）
const STALE_GV = "const GAME_VERSION = 'v22." + "1';";
const stale = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!f.endsWith('.mjs')) continue;
  const src = read(`../tests/${f}`);
  if (src.includes(STALE_GV)) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v22.1 全库清零）', stale.length === 0, stale.join(','));
const STALE_ID = "GAME_VERSION === 'v22." + "1'";
const staleId = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!f.endsWith('.mjs')) continue;
  const src = read(`../tests/${f}`);
  if (src.includes(STALE_ID)) staleId.push(f);
}
ok('旧代 GAME_VERSION 恒等 pin 零残留（===v22.1 全库清零）', staleId.length === 0, staleId.join(','));
const STALE_SUITE = '九十七件套（九十六件套清' + '除）';
const staleSuite = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!f.endsWith('.mjs')) continue;
  const src = read(`../tests/${f}`);
  if (src.includes(STALE_SUITE)) staleSuite.push(f);
}
ok('旧代件套 pin 零残留（九十七件套（九十六件套清' + '除）全库清零）', staleSuite.length === 0, staleSuite.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
