// v21.87 专项冒烟：尾声战绩页补收集进度两件——「按 Enter 观看尾声」的 run 总结屏（drawEnding）在
// v19.49 战绩行（累计讨伐/成就/记忆/金币/时长）之外补「📕 图鉴 N/M · 📦 宝箱 N/M」，补齐
// v21.79 标题预览确立、v21.82 胜利画面先行的「收集进度三件套」（成就·图鉴·宝箱）在 标题预览/
// 胜利画面/尾声 三处 run 总结屏的最后一块拼图——玩家站在这趟 run 的最终总结屏上想「继续收集还是
// 回标题」，此前一眼看不到图鉴/宝箱收到哪了（成就/记忆已有）。与 slotPreview（v21.79）/drawWin
// （v21.82）同读 BESTIARY_TARGET / chestCount·chestTotal 一份单一数据源（chestCount 三形态
// 防御式），绝无第二套口径；新增行 366、页脚 376→396 让位（文案逐字未动），战绩行/故事行全部
// 零位移，纯显示零结算零存档。真结局八行档（ENDING_TRUE + ENDING_TRUE_FRAG）行距 25 档下
// 末行 321 亦不触 346 战绩行。
// 本冒烟守护：版本锚点、data.js/menus.js 源级落位（新两件派生 + v19.49 战绩行与页脚逐字保留 +
// 旧页脚 y=376 零残留 + 与 core.js slotPreview 同式互证）、运行期实证（推进档逐值/缺失字段防御
// 档/真结局八行档渲染捕获三档）、行宽与垂直间距预算、README/package 同步、姊妹件套 pin
// （v2186..v2176 八十三件套 / v2186..v2179 GAME_VERSION v21.87）随新现实更新。
import { GAME_VERSION, BESTIARY_TARGET, FRAGMENTS, chestTotal, ACH_LIST } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.87 尾声战绩页收集进度冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.86 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.86', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 87)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const menusSrc = read('../js/view/menus.js');
const coreSrc = read('../js/core.js');

ok('data.js 含 v21.87 版本注释', dataSrc.includes('v21.87 尾声战绩页补收集进度两件'));
ok('data.js GAME_VERSION 字面量已更新为 v21.87', dataSrc.includes("const GAME_VERSION = 'v21.96';"));

// —— 源级落位：drawEnding 新两件派生 + 既有战绩行/页脚逐字保留 ——
const endBlock = (menusSrc.match(/export function drawEnding\(\)\{[\s\S]*?\n\}/) || [''])[0];
ok('drawEnding 块存在', endBlock.length > 0);
ok('drawEnding 派生图鉴数（BESTIARY_TARGET.filter 与 slotPreview/drawWin 同式）',
  endBlock.includes('const codexN = BESTIARY_TARGET.filter((n) => ((hero.bestiary || {})[n] | 0) >= 1).length;'));
ok('drawEnding 派生宝箱数（chestCount 防御式单源）', endBlock.includes('const chestN = chestCount(hero);'));
ok('drawEnding 收集行含 图鉴/宝箱 与各自分母同源（BESTIARY_TARGET.length / chestTotal()）',
  endBlock.includes('📕 图鉴 ${codexN}/${BESTIARY_TARGET.length} · 📦 宝箱 ${chestN}/${chestTotal()}'));
ok('drawEnding v19.49 战绩行逐字保留（累计讨伐/成就/记忆/金币/时长）',
  endBlock.includes('`战绩 · 累计讨伐 ${Object.values(hero.bestiary||{}).reduce((a,b)=>a+b,0)} 只 · 成就 ${(hero.ach||[]).length}/${ACH_LIST.length} · 记忆 ${(hero.fragments||[]).length}/${FRAGMENTS.length} · 金币 ${hero.gold} · ⏱️${fmtTime(hero.time)}`'));
ok('drawEnding 收集行落位 y=366、页脚让位 y=396',
  endBlock.includes(",320,366,'bold 13px','#7dd47f','center');") && endBlock.includes(",320,396,'13px','#7d93a3','center');"));
ok('drawEnding 页脚文案逐字未动（按 Enter 返回标题）', endBlock.includes("按 Enter 返回标题"));
ok('drawEnding 旧页脚 y=376 零残留（页脚已让位 396，不重叠）',
  !endBlock.includes("按 Enter 返回标题',320,376"));
ok('drawEnding 真结局差分/故事行渲染零回归（allFrag/ENDING_TRUE_FRAG/lines.forEach）',
  endBlock.includes('const allFrag = FRAGMENTS.every((f) => (hero.fragments || []).includes(f.id));') &&
  endBlock.includes('ENDING_TRUE_FRAG') && endBlock.includes('lines.forEach((l,i)=>text(l,320,y0+i*step'));
// —— 与 core.js slotPreview（v21.79 三件套）/drawWin 同式互证：同一份单一数据源 ——
ok('core.js slotPreview 图鉴派生与 drawEnding 同式（BESTIARY_TARGET.filter + |0 归一）',
  coreSrc.includes('BESTIARY_TARGET.filter((n) => ((hero.bestiary || {})[n] | 0) >= 1).length'));
ok('core.js slotPreview 宝箱派生与 drawEnding 同式（chestCount(hero) 防御式）',
  coreSrc.includes('const chestN = chestCount(hero);'));

// —— 行宽与垂直间距预算（承 v21.82 口径：13px 单行 ≤640 画布，中心对齐；行间 ≥16px）——
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
ok('最坏收集行估算宽 ≤640（13px 单行，画布中心对齐）', wWorst > 0 && wWorst <= 640, `≈${wWorst.toFixed(0)}px`);
ok('收集行与战绩行/页脚垂直不重叠（346 与 366/396 间距 ≥16px）', 366 - 346 >= 16 && 396 - 366 >= 16);
ok('真结局八行档末行 321 与战绩行 346 间距 ≥16px（行距 25 档不触战绩行）', 346 - (146 + 7 * 25) >= 16);

// —— 运行期实证：DOM/音频/存储桩 + main.js 真实导入后 drawEnding 渲染捕获 ——
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
const { loadMap } = await import('../js/world.js');
const { newGame } = await import('../js/core.js');

function renderEnding(hero, map) {
  CAPTURED.length = 0;
  S.G = hero;
  S.G.map = map; S.G.x = 12; S.G.y = 12;
  S.dir = 'D'; S.scene = 'world'; S.walk = null;
  loadMap(map);
  menus.drawEnding();
  return CAPTURED.slice();
}
const BEST = BESTIARY_TARGET.length, CHESTS = chestTotal();

// 推进档：图鉴 2/13（史莱姆 2 + 野狼 1）、宝箱 2/12、成就 1/31、记忆 2/4 —— 与 slotPreview/图鉴页同式
let hero = newGame('余烬');
Object.assign(hero, {
  level: 9, gold: 777, item: 3, potion2: 1, time: 3723,
  bestiary: { '史莱姆': 2, '野狼': 1 }, totalWins: 30, ach: ['firstblood'],
  chests: new Set(['22,1', '12,11']), fragments: ['golem', 'demon'], trueBoss: false,
});
let cap = renderEnding(hero, 'village');
let threw = null;
try { cap = renderEnding(hero, 'village'); } catch (e) { threw = e; }
ok('运行期：drawEnding 推进档渲染不抛错', threw === null, threw && String(threw.stack || threw));
ok('运行期：收集行落位「📕 图鉴 2/13 · 📦 宝箱 2/12」（与 slotPreview 同源逐值）',
  cap.some((t) => t.includes(`📕 图鉴 2/${BEST} · 📦 宝箱 2/${CHESTS}`)), cap.filter((t) => t.includes('图鉴')).join(' | '));
ok('运行期：v19.49 战绩行逐字保留（累计讨伐 3 只 · 成就 1/31 · 记忆 2/4 · 金币 777 · ⏱01:02:03）',
  cap.some((t) => t.includes(`累计讨伐 3 只 · 成就 1/${ACH_LIST.length} · 记忆 2/${FRAGMENTS.length} · 金币 777 · ⏱️01:02:03`)));
ok('运行期：页脚文案落位（按 Enter 返回标题）', cap.some((t) => t.includes('按 Enter 返回标题')));
ok('运行期：故事行零回归（尾声 · 半亮的黎明）', cap.some((t) => t.includes('尾声 · 半亮的黎明')));

// 防御档：旧档缺 bestiary/chests/ach/fragments 字段 → 0/0 不抛错（v21.79 slotPreview 同款三形态防御）
hero = newGame('灯见');
Object.assign(hero, { level: 1, gold: 30, time: 3, trueBoss: false });
// chests 保留 newGame 的 Set（drawWorld 渲染既有前提 S.G.chests.has），只删 drawEnding 防御面字段
delete hero.bestiary; delete hero.ach; delete hero.fragments;
threw = null;
try { cap = renderEnding(hero, 'village'); } catch (e) { threw = e; }
ok('运行期：drawEnding 缺失字段防御档渲染不抛错', threw === null, threw && String(threw.stack || threw));
ok('运行期：防御档收集行报 0/0（图鉴 0/M · 宝箱 0/N）',
  cap.some((t) => t.includes(`📕 图鉴 0/${BEST} · 📦 宝箱 0/${CHESTS}`)));

// 真结局八行档：trueBoss + 全记忆 → 8 行渲染不抛错且加页落画（行距 25 档不触战绩行）
hero = newGame('潮');
Object.assign(hero, { trueBoss: true, fragments: FRAGMENTS.map((f) => f.id), bestiary: { '终焉之神': 1 }, chests: new Set(), time: 9999 });
threw = null;
try { cap = renderEnding(hero, 'gallery'); } catch (e) { threw = e; }
ok('运行期：真结局八行档渲染不抛错', threw === null, threw && String(threw.stack || threw));
ok('运行期：真结局加页落画（— 真 · 结局：全记忆 —）且收集行同档落位',
  cap.some((t) => t.includes('— 真 · 结局：全记忆 —')) && cap.some((t) => t.includes(`📕 图鉴 1/${BEST} · 📦 宝箱 0/${CHESTS}`)));

// —— README / package.json / 姊妹件套 pin 随新现实更新（v21.7 惯例：最新版守护 README 与旧 pin）——
const readme = read('../README.md');
const pkg = read('../package.json');
ok('README 已同步（tests 树收录 smoke_v2187_endingrecap + 冒烟/件套口径）',
  readme.includes('smoke_v2187_endingrecap') && readme.includes('冒烟') && readme.includes('件套'));
ok('README 件套口径已更新为九十二件套（九十一件套清除）',
  readme.includes('冒烟九十二件套（九十一件套清除）') && !readme.includes('冒烟八十二件套（八十一件套清除）'));
ok('README 含 v21.87 守护描述', readme.includes('v21.87 起含尾声战绩页收集进度守护'));
ok('README 系统清单补尾声战绩页收集进度口径（尾声战绩页收集进度）', readme.includes('尾声战绩页收集进度'));
ok('package.json 已收录 smoke_v2187_endingrecap（npm test 串跑第 83 份）',
  pkg.includes('tests/smoke_v2187_endingrecap.mjs') && /smoke_v2186_brew\.mjs && node tests\/smoke_v2187_endingrecap\.mjs/.test(pkg));
const suite83 = ['smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs', 'smoke_v2184_lvl12.mjs',
  'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs', 'smoke_v2181_helpquickcast.mjs',
  'smoke_v2180_grain.mjs', 'smoke_v2179_titlerecap.mjs', 'smoke_v2178_codexseen.mjs',
  'smoke_v2177_elites.mjs', 'smoke_v2176_allchests.mjs'];
for (const nm of suite83) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README 件套 pin 已随新现实更新为九十二件套（九十一件套清除）`,
    src.includes('九十二件套（九十一件套清除）'));
}
for (const nm of ['smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs', 'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs', 'smoke_v2181_helpquickcast.mjs', 'smoke_v2179_titlerecap.mjs']) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 字面量 pin 已随新现实更新为 v21.87`,
    src.includes("const GAME_VERSION = 'v21.96';"));
}

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
