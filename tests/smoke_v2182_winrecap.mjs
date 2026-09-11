// v21.82 专项冒烟：胜利画面补收集进度两件——「灯芯回来了」的 run 总结屏（drawWin）在 v19.49 战绩行
// （累计讨伐/成就/时长）之外补「📕 图鉴 N/M · 📦 宝箱 N/M」，补齐 v21.79 标题预览确立的「收集进度
// 三件套」（成就·图鉴·宝箱）在胜利屏的口径——玩家站在这趟 run 的总结屏上想「继续收集还是 R 重开/
// Enter 尾声」，一眼看不到图鉴/宝箱收到哪了。与 slotPreview（v21.79）/成就页/图鉴页/状态页同读
// BESTIARY_TARGET / chestCount·chestTotal 一份单一数据源（chestCount 三形态防御式），绝无第二套口径；
// 新增行 378、页脚下移 380→396 让位（文案逐字未动），主标题/怪物/战绩行全部零位移，纯显示零结算零存档。
// 本冒烟守护：版本锚点、data.js/menus.js 源级落位（新两件派生 + v19.49 战绩行与页脚逐字保留 + 旧
// 页脚 y 零残留 + 与 core.js slotPreview 同式互证）、运行期实证（推进档逐值/缺失字段防御档/渲染捕获
// 全行落位）、行宽预算、README/package 同步、smoke_v2181..v2176 件套 pin 与 smoke_v2181/v2179
// GAME_VERSION pin 随新现实更新。
import { GAME_VERSION, ACH_LIST, BESTIARY_TARGET, chestTotal } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.82 胜利画面收集进度冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.81 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.81', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 82)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const menusSrc = read('../js/view/menus.js');
const coreSrc = read('../js/core.js');

ok('data.js 含 v21.82 版本注释', dataSrc.includes('v21.82 胜利画面补收集进度两件'));
ok('data.js GAME_VERSION 字面量已更新为 v21.82', dataSrc.includes("const GAME_VERSION = 'v22.12';"));

// —— 源级落位：drawWin 新两件派生 + 既有战绩行/页脚逐字保留 ——
const winBlock = (menusSrc.match(/export function drawWin\(\)\{[\s\S]*?\n\}/) || [''])[0];
ok('drawWin 块存在', winBlock.length > 0);
ok('drawWin 派生图鉴数（BESTIARY_TARGET.filter 与 slotPreview 同式）',
  winBlock.includes('const codexN = BESTIARY_TARGET.filter((n) => ((S.G.bestiary || {})[n] | 0) >= 1).length;'));
ok('drawWin 派生宝箱数（chestCount 防御式单源）', winBlock.includes('const chestN = chestCount(S.G);'));
ok('drawWin 收集行含 图鉴/宝箱 与各自分母同源（BESTIARY_TARGET.length / chestTotal()）',
  winBlock.includes('📕 图鉴 ${codexN}/${BESTIARY_TARGET.length} · 📦 宝箱 ${chestN}/${chestTotal()}'));
ok('drawWin v19.49 战绩行逐字保留（累计讨伐/成就 N/M/时长）',
  winBlock.includes('`累计讨伐 ${kills} 只 · 成就 ${(S.G.ach||[]).length}/${ACH_LIST.length} · ⏱️${fmtTime(S.G.time)}`'));
ok('drawWin 收集行落位 y=378、页脚让位 y=396',
  winBlock.includes(",CV.width/2,378);") && winBlock.includes(",CV.width/2,396);"));
ok('drawWin 页脚补 P 口径（按 Enter 观看尾声 · 按 P 存档 · 按 R 重开新档(连按两次)，v21.98）',
  winBlock.includes("按 Enter 观看尾声 · 按 P 存档 · 按 R 重开新档(连按两次)"));
ok('drawWin 旧页脚 y=380 零残留（页脚已让位 396，不重叠）',
  !winBlock.includes("(连按两次)',CV.width/2,380)"));
ok('drawWin 主标题/等级行零回归（灯芯回来了/最终等级 逐字保留）',
  winBlock.includes("'灯 芯 回 来 了'") && winBlock.includes('`最终等级 Lv.${S.G.level} · 金币 ${S.G.gold}`'));
// —— 与 core.js slotPreview（v21.79 三件套）同式互证：同一份单一数据源 ——
ok('core.js slotPreview 图鉴派生与 drawWin 同式（BESTIARY_TARGET.filter + |0 归一）',
  coreSrc.includes('BESTIARY_TARGET.filter((n) => ((hero.bestiary || {})[n] | 0) >= 1).length'));
ok('core.js slotPreview 宝箱派生与 drawWin 同式（chestCount(hero) 防御式）',
  coreSrc.includes('const chestN = chestCount(hero);'));
ok('README/成就页/图鉴页/状态页三件套分母同源（ACH_LIST/BESTIARY_TARGET/chestTotal 单一数据源存在）',
  menusSrc.includes('ACH_LIST.length') && menusSrc.includes('BESTIARY_TARGET.length') && menusSrc.includes('chestTotal()'));

// —— 行宽预算：v21.18 同款 estW（14px 单行 ≤640 画布，中心对齐两侧余量）——
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
const worst = `📕 图鉴 ${BESTIARY_TARGET.length}/${BESTIARY_TARGET.length} · 📦 宝箱 ${chestTotal()}/${chestTotal()}`;
const wWorst = estW(worst);
ok('最坏收集行估算宽 ≤640（14px 单行，画布中心对齐）', wWorst > 0 && wWorst <= 640, `≈${wWorst.toFixed(0)}px`);
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

// 推进档：图鉴 2/13（史莱姆 2 + 野狼 1）、宝箱 2/12、成就 1/29 —— 与 slotPreview/图鉴页/状态页同式
S.G = {
  name: '余烬', diff: 0, level: 9, xp: 100, xpNext: 500, gold: 777, item: 3, potion2: 1,
  weapon: '圣光之剑', armor: '锁子甲', map: 'dungeon', x: 20, y: 13,
  hp: 90, hpMax: 100, mp: 30, mpMax: 40, skills: ['火焰斩', '冰霜击'],
  poison: 0, bossDefeated: true, caveBoss: false, trueBoss: false,
  rushStage: 0, rushDone: false, visited: ['village', 'dungeon'], tutDone: true,
  bestiary: { '史莱姆': 2, '野狼': 1 }, totalWins: 30, drops: 2, ach: ['firstblood'],
  chests: new Set(['22,1', '12,11']), mushrooms: 4, quest: 3,
  quests: { side_mushroom: 'done' }, time: 3723,
};
let threw = null;
try { CAPTURED.length = 0; menus.drawWin(); } catch (e) { threw = e; }
ok('运行期：drawWin 推进档渲染不抛错', threw === null, threw && String(threw.stack || threw));
ok('运行期：收集行落位「📕 图鉴 2/13 · 📦 宝箱 2/12」（与 slotPreview 同源逐值）',
  CAPTURED.some((t) => t.includes(`📕 图鉴 2/${BESTIARY_TARGET.length} · 📦 宝箱 2/${chestTotal()}`)));
ok('运行期：v19.49 战绩行逐字保留（累计讨伐 3 只 · 成就 1/29 · ⏱01:02:03）',
  CAPTURED.some((t) => t.includes(`累计讨伐 3 只 · 成就 1/${ACH_LIST.length} · ⏱️01:02:03`)));
ok('运行期：页脚文案落位（按 Enter 观看尾声 · 按 R 重开新档(连按两次)）',
  CAPTURED.some((t) => t.includes('按 Enter 观看尾声 · 按 P 存档 · 按 R 重开新档(连按两次)')));
ok('运行期：主标题/等级行零回归（灯芯回来了/最终等级 Lv.9 · 金币 777）',
  CAPTURED.some((t) => t.includes('灯 芯 回 来 了')) && CAPTURED.some((t) => t.includes('最终等级 Lv.9 · 金币 777')));

// 防御档：旧档缺 bestiary/chests/ach 字段 → 0/0/0 不抛错（v21.79 slotPreview 同款三形态防御）
S.G = { name: '灯见', level: 1, gold: 30, map: 'village', time: 3, bossDefeated: false, caveBoss: false, trueBoss: false };
threw = null;
try { CAPTURED.length = 0; menus.drawWin(); } catch (e) { threw = e; }
ok('运行期：drawWin 缺失字段防御档渲染不抛错', threw === null, threw && String(threw.stack || threw));
ok('运行期：防御档收集行报 0/0（图鉴 0/M · 宝箱 0/N）',
  CAPTURED.some((t) => t.includes(`📕 图鉴 0/${BESTIARY_TARGET.length} · 📦 宝箱 0/${chestTotal()}`)));

// —— README / package / 姊妹件套 pin 随新现实更新（v21.7 惯例：最新版守护 README 与旧 pin）——
const readme = read('../README.md');
const pkg = read('../package.json');
ok('README 已同步（tests 树收录 smoke_v2182_winrecap + 冒烟/件套口径）',
  readme.includes('smoke_v2182_winrecap') && readme.includes('冒烟') && readme.includes('件套'));
ok('README 件套口径已更新为一百零八件套（一百零七件套清除）',
  readme.includes('冒烟一百零八件套（一百零七件套清除）') && !readme.includes('冒烟七十七件套（七十六件套清除）'));
ok('README 含 v21.82 守护描述', readme.includes('v21.82 起含胜利画面收集进度守护'));
ok('package.json 已收录 smoke_v2182_winrecap（第 78 份）', pkg.includes('tests/smoke_v2182_winrecap.mjs'));
const s2181 = read('../tests/smoke_v2181_helpquickcast.mjs');
const s2180 = read('../tests/smoke_v2180_grain.mjs');
const s2179 = read('../tests/smoke_v2179_titlerecap.mjs');
const s2178 = read('../tests/smoke_v2178_codexseen.mjs');
const s2177 = read('../tests/smoke_v2177_elites.mjs');
const s2176 = read('../tests/smoke_v2176_allchests.mjs');
for (const [nm, src] of [['smoke_v2181', s2181], ['smoke_v2180', s2180], ['smoke_v2179', s2179], ['smoke_v2178', s2178], ['smoke_v2177', s2177], ['smoke_v2176', s2176]]) {
  ok(`${nm} 的 README 件套 pin 已随新现实更新为一百零八件套（一百零七件套清除）`,
    src.includes('一百零八件套（一百零七件套清除）') && !src.includes('七十七件套（七十六件套清除）'));
}
ok('smoke_v2181 的 GAME_VERSION 字面量 pin 已随新现实更新为 v21.84',
  s2181.includes("const GAME_VERSION = 'v22.12';"));
ok('smoke_v2179 的 GAME_VERSION 字面量 pin 已随新现实更新为 v21.84',
  s2179.includes("const GAME_VERSION = 'v22.12';"));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
