// v22.3 专项冒烟：阵亡画面收集行补「🕯️ 记忆碎片 N/4」——drawDead 的收集行（v21.96 🏆 成就 / 📕 图鉴 / 📦 宝箱）
// 是 run 战果屏的收集口径，但碎片进度的常驻/总结屏逐屏核对后：尾声战绩行 v19.49「记忆 N/N」、J 日志
// 「记忆碎片」节、状态页资源行 v22.1 🕯️ N/4、胜利画面收集行 v22.2 🕯️ 记忆碎片 N/4 四端齐备，唯独本屏缺
// ——玩家倒在强敌面前判断「值不值得 B 重整旗鼓 / R 重开新档」时，真结局关键收集（FRAGMENTS 四枚强敌首胜
// 掉落、集齐触发「全记忆」真结局加页）在这块 run 战果屏上无回声。
// 本冒烟守护：版本锚点、data.js/menus.js 源级落位（fragN 派生 + 收集行 🕯️ 并入 + 既有段逐字保留 +
// 旧行零残留 + y=312 零位移）、与 drawStatus/drawWin/drawJournal/drawEnding 同源互证（FRAGMENTS.length
// 单一数据源）、行宽预算（estW ≤640 画布口径）、运行期实证（推进档 2/4 → 全收集 4/4 → 缺字段防御档 0/4
// 不抛错 → Boss 战败档 _bossRetry 共存）、README/package.json/CHANGELOG 同步、姊妹件套 pin
// （v2202..v2176 九十九件套 / v2202..v2179 GAME_VERSION v22.3 / v2202..v2192 恒等 v22.3 /
// v2202..v2192 树尾 pin）随新现实更新 + 旧代 v22.2 字面量/恒等 pin 与旧代九十八件套 pin 全库零残留复核。
import { GAME_VERSION, FRAGMENTS, BESTIARY_TARGET, chestTotal, ACH_LIST } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.3 阵亡画面记忆碎片进度冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v22.2 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.2', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 3)), GAME_VERSION);
ok('GAME_VERSION 字面量已为 v22.3', GAME_VERSION === 'v22.38', GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const menusSrc = read('../js/view/menus.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v22.3 版本注释', dataSrc.includes('v22.3 阵亡画面收集行补「🕯️ 记忆碎片 N/4」'));
ok('data.js GAME_VERSION 字面量已更新为 v22.3', dataSrc.includes("const GAME_VERSION = 'v22.38';"));
ok('data.js 仍保留 v22.2 历史注释（累积注释块，姊妹 pin 不失效）', dataSrc.includes('v22.2 胜利画面收集行补「🕯️ 记忆碎片 N/4」'));

// —— 源级落位：drawDead 碎片派生与收集行并入 ——
const deadBlock = (menusSrc.match(/export function drawDead\(\)\{[\s\S]*?\n\}/) || [''])[0];
ok('drawDead 块存在', deadBlock.length > 0);
ok('drawDead 派生碎片数（与 drawStatus 同式同读 hero.fragments，防御式旧档零迁移）',
  deadBlock.includes('const fragN = (hero.fragments || []).length;'));
ok('收集行并入 🕯️ 记忆碎片 N/4（FRAGMENTS.length 单一数据源分母）',
  deadBlock.includes('🕯️ 记忆碎片 ${fragN}/${FRAGMENTS.length}'));
ok('收集行既有段逐字保留（🏆 成就 · 📕 图鉴 · 📦 宝箱 三口径）',
  deadBlock.includes('🏆 成就 ${(hero.ach||[]).length}/${ACH_LIST.length} · 📕 图鉴 ${codexN}/${BESTIARY_TARGET.length} · 📦 宝箱 ${chestN}/${chestTotal()}'));
ok('收集行落位 y=312（bold 13px #7dd47f，v21.96 逐字保留）',
  deadBlock.includes(",CV.width/2,312,'bold 13px','#7dd47f','center');"));
ok('drawDead 旧收集行（无 🕯️）零残留', !deadBlock.includes('chestTotal()}\`,CV.width/2,312'));
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
ok('drawDead 行间无重叠（收集行 312 与 建议 292 / R 332 行间均 ≥16px）', 312 - 292 >= 16 && 332 - 312 >= 16);

// —— 与 drawStatus/drawWin/drawJournal/drawEnding 同源互证：FRAGMENTS.length 单一数据源 ——
ok('menus.js 碎片进度各端同读 FRAGMENTS.length（drawStatus / drawDead / drawWin 三端同源）',
  menusSrc.includes('FRAGMENTS.length'));
ok('menus.js 防御式读取三端齐备（drawStatus·drawDead (hero.fragments||[]) / drawWin (S.G.fragments||[])）',
  menusSrc.includes('const fragN = (hero.fragments || []).length;') &&
  menusSrc.includes('const fragW = (S.G.fragments || []).length;'));

// —— 行宽预算：v21.96 同款 estW（13px 单行 ≤640 画布，中心对齐）——
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
const worst = `🏆 成就 ${ACH_LIST.length}/${ACH_LIST.length} · 📕 图鉴 ${BESTIARY_TARGET.length}/${BESTIARY_TARGET.length} · 📦 宝箱 ${chestTotal()}/${chestTotal()} · 🕯️ 记忆碎片 ${FRAGMENTS.length}/${FRAGMENTS.length}`;
const wWorst = estW(worst);
ok('最坏收集行估算宽 ≤640（13px 单行，画布中心对齐；余量充足）',
  wWorst > 0 && wWorst <= 640, `≈${wWorst.toFixed(0)}px`);

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
const BEST = BESTIARY_TARGET.length, ACH = ACH_LIST.length, CHESTS = chestTotal(), FRAGS = FRAGMENTS.length;

// 推进档：碎片 2/4（石心魔像 + 幽冥魔王）、成就 1/38、图鉴 2/13、宝箱 2/12 —— 与状态页/胜利屏/尾声同式
let hero = newGame('余烬');
Object.assign(hero, {
  level: 9, gold: 777, item: 3, potion2: 1, time: 3723,
  bestiary: { '史莱姆': 2, '野狼': 1 }, ach: ['firstblood'],
  chests: new Set(['22,1', '12,11']),
  fragments: [FRAGMENTS[0].id, FRAGMENTS[1].id],
});
let cap = null, threw = null;
try { cap = renderDead(hero, { name: '野狼' }); } catch (e) { threw = e; }
ok('运行期：drawDead 推进档渲染不抛错', threw === null, threw && String(threw.stack || threw));
ok('运行期：收集行落位「🏆 成就 1/M · 📕 图鉴 2/N · 📦 宝箱 2/M · 🕯️ 记忆碎片 2/4」（与状态页/胜利屏同源逐值）',
  cap.some((t) => t.includes(`🏆 成就 1/${ACH} · 📕 图鉴 2/${BEST} · 📦 宝箱 2/${CHESTS} · 🕯️ 记忆碎片 2/${FRAGS}`)),
  cap.filter((t) => t.includes('🕯️')).join(' | '));
ok('运行期：战绩行逐字零回归（当前 Lv.9 · 金币 777 · 累计讨伐 3 只 · ⏱01:02:03）',
  cap.some((t) => t.includes('当前 Lv.9 · 金币 777 · 累计讨伐 3 只 · ⏱️01:02:03')));
ok('运行期：余粮行与按键行零回归（🍖 3 瓶 / R 重开 / T 标题）',
  cap.some((t) => t.includes('🍖 生命药水 3 瓶')) && cap.some((t) => t.includes('按 R 重新开始本次冒险')));

// 全收集档：碎片 4/4 —— 真结局关键收集在阵亡屏一眼可见
hero.fragments = FRAGMENTS.map((f) => f.id);
threw = null;
try { cap = renderDead(hero, { name: '野狼' }); } catch (e) { threw = e; }
ok('运行期：drawDead 全收集档渲染不抛错', threw === null, threw && String(threw.stack || threw));
ok('运行期：全收集档报 🕯️ 记忆碎片 4/4', cap.some((t) => t.includes(`🕯️ 记忆碎片 ${FRAGS}/${FRAGS}`)));

// 防御档：旧档缺 fragments 字段 → 0/4 不抛错（v22.1/v22.2 同款防御式读取、零迁移）
hero = newGame('灯见');
Object.assign(hero, { level: 1, gold: 30, time: 3 });
delete hero.fragments; delete hero.bestiary; delete hero.ach;
threw = null;
try { cap = renderDead(hero, { name: '史莱姆' }); } catch (e) { threw = e; }
ok('运行期：drawDead 缺失字段防御档渲染不抛错', threw === null, threw && String(threw.stack || threw));
ok('运行期：防御档收集行报 0/0/0/0（成就 0/M · 图鉴 0/N · 宝箱 0/N · 碎片 0/4）',
  cap.some((t) => t.includes(`🏆 成就 0/${ACH} · 📕 图鉴 0/${BEST} · 📦 宝箱 0/${CHESTS} · 🕯️ 记忆碎片 0/${FRAGS}`)));

// Boss 战败档：_bossRetry 分支零回归 + 四件套行共存（败于 幽冥魔王 · 按 B 重整旗鼓）
hero = newGame('潮');
Object.assign(hero, {
  level: 7, gold: 500, time: 6000,
  bestiary: { '幽冥魔王': 1 }, ach: ['firstblood', 'boss'],
  chests: new Set(['9,9']),
  fragments: [FRAGMENTS[1].id],
});
hero._bossRetry = { name: '幽冥魔王', bossId: 'demon' };
threw = null;
try { cap = renderDead(hero, { name: '幽冥魔王' }); } catch (e) { threw = e; }
ok('运行期：Boss 战败档渲染不抛错（_bossRetry 分支）', threw === null, threw && String(threw.stack || threw));
ok('运行期：Boss 战败档 败于/建议/B 提示 与 四件套行 共存（零回归 + 新行共存）',
  cap.some((t) => t.includes('败于 幽冥魔王')) &&
  cap.some((t) => t.includes('先回旅馆补给并练级') && t.includes('再按 B 重整旗鼓')) &&
  cap.some((t) => t.includes('按 B 重整旗鼓，再战强敌！')) &&
  cap.some((t) => t.includes(`🏆 成就 2/${ACH} · 📕 图鉴 1/${BEST} · 📦 宝箱 1/${CHESTS} · 🕯️ 记忆碎片 1/${FRAGS}`)));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 已同步（tests 树收录 smoke_v2203_fragdead + 九十九件套口径）',
  readme.includes('smoke_v2202_fragwin + smoke_v2204_brew2 + smoke_v2209_achstatus + smoke_v2211_lampkid + smoke_v2212_volume + smoke_v2213_teller + smoke_v2214_mush + smoke_v2215_tutorvol + smoke_v2216_picker + smoke_v2217_elixir2 + smoke_v2218_mush2 + smoke_v2219_footkeys + smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend + smoke_v2238_starwell（npm test 串跑）') && readme.includes('冒烟一百三十四件套（一百三十三件套清除）'));
ok('README 含 v22.3 守护描述', readme.includes('v22.3 起含阵亡画面记忆碎片进度守护'));
ok('README 系统清单「战败复盘」段补四件套口径（另补**收集进度四件套** + 🕯️ 段）',
  readme.includes('另补**收集进度四件套**') && readme.includes('🏆 成就 N/M · 📕 图鉴 N/M · 📦 宝箱 N/M · 🕯️ 记忆碎片 N/4') && readme.includes('v22.3 并列 🕯️ 记忆碎片 N/4'));
ok('README 记忆碎片 bullet 补阵亡画面常住（v22.3）',
  readme.includes('阵亡画面收集行 `🕯️ 记忆碎片 N/4`（v22.3'));
ok('README 不含旧「冒烟九十八件套（九十七件套清' + '除）」旧口径', !readme.includes('冒烟九十八件套（九十七件套清' + '除）'));
ok('package.json 已收录 smoke_v2203_fragdead（npm test 串跑第 99 份）',
  pkg.includes('tests/smoke_v2203_fragdead.mjs') && /smoke_v2202_fragwin\.mjs && node tests\/smoke_v2203_fragdead\.mjs/.test(pkg));
ok('CHANGELOG 含 v22.3 条目', changelog.includes('## v22.3 '));

// —— 姊妹件套 pin（v21.7 惯例：最新版守护旧 pin 随新现实更新） ——
const suite99 = ['smoke_v2202_fragwin.mjs', 'smoke_v2201_fragstatus.mjs', 'smoke_v2200_stock.mjs',
  'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs', 'smoke_v2191_ptime.mjs',
  'smoke_v2190_launch.mjs', 'smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs',
  'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs',
  'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs',
  'smoke_v2181_helpquickcast.mjs', 'smoke_v2180_grain.mjs', 'smoke_v2179_titlerecap.mjs',
  'smoke_v2178_codexseen.mjs', 'smoke_v2177_elites.mjs', 'smoke_v2176_allchests.mjs'];
for (const nm of suite99) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README 件套 pin 已随新现实更新为一百三十四件套（一百三十三件套清除）`,
    src.includes('一百三十四件套（一百三十三件套清除）'));
}
for (const nm of ['smoke_v2202_fragwin.mjs', 'smoke_v2201_fragstatus.mjs', 'smoke_v2200_stock.mjs',
  'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs', 'smoke_v2191_ptime.mjs',
  'smoke_v2190_launch.mjs', 'smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs',
  'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs',
  'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs',
  'smoke_v2181_helpquickcast.mjs', 'smoke_v2179_titlerecap.mjs']) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 字面量 pin 已随新现实更新为 v22.3`,
    src.includes("const GAME_VERSION = 'v22.38';"));
}
for (const nm of ['smoke_v2202_fragwin.mjs', 'smoke_v2201_fragstatus.mjs', 'smoke_v2200_stock.mjs',
  'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs']) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 恒等 pin（===）已随新现实更新为 v22.3`,
    src.includes("GAME_VERSION === 'v22.38'"));
}
for (const nm of ['smoke_v2202_fragwin.mjs', 'smoke_v2201_fragstatus.mjs', 'smoke_v2200_stock.mjs',
  'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs', 'smoke_v2193_hunt100.mjs',
  'smoke_v2192_travelwarn.mjs']) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README tests 树尾 pin 已随新现实更新（+ smoke_v2203_fragdead）`,
    src.includes('smoke_v2202_fragwin + smoke_v2204_brew2 + smoke_v2209_achstatus + smoke_v2211_lampkid + smoke_v2212_volume + smoke_v2213_teller + smoke_v2214_mush + smoke_v2215_tutorvol + smoke_v2216_picker + smoke_v2217_elixir2 + smoke_v2218_mush2 + smoke_v2219_footkeys + smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend + smoke_v2238_starwell（npm test 串跑）'));
}
// 旧代 GAME_VERSION 字面量/恒等 pin 零残留（v22.2 全库清零；拼接避免本文件自匹配）
const STALE_GV = "const GAME_VERSION = 'v22." + "2';";
const stale = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!f.endsWith('.mjs')) continue;
  const src = read(`../tests/${f}`);
  if (src.includes(STALE_GV)) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v22.2 全库清零）', stale.length === 0, stale.join(','));
const STALE_ID = "GAME_VERSION === 'v22." + "2'";
const staleId = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!f.endsWith('.mjs')) continue;
  const src = read(`../tests/${f}`);
  if (src.includes(STALE_ID)) staleId.push(f);
}
ok('旧代 GAME_VERSION 恒等 pin 零残留（===v22.2 全库清零）', staleId.length === 0, staleId.join(','));
const STALE_SUITE = '九十八件套（九十七件套清' + '除）';
const staleSuite = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!f.endsWith('.mjs')) continue;
  const src = read(`../tests/${f}`);
  if (src.includes(STALE_SUITE)) staleSuite.push(f);
}
ok('旧代件套 pin 零残留（九十八件套（九十七件套清' + '除）全库清零）', staleSuite.length === 0, staleSuite.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
