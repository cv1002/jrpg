// smoke_v2310_diffsum.mjs —— v23.10 run 总结屏三屏「困难档」标注守护（体验打磨·信息透明·同一口径）
// 承 v21.10-v23.09 冒烟入库先例：版本锚点 + 源级落位（data.js v23.10 注释/GAME_VERSION 字面量 v23.10/
// v23.09 历史注释保留零 v23.09 字面量残留）+ 标注契约（三屏战绩行同读 hero.diff · DIFFS 单一数据源：
// drawDead 战绩行 y=236 / drawWin 战绩行 y=362 / drawEnding 战绩行 y=346 困难档追加「 · 困难」、
// 普通档零后缀零噪音零位移——与 状态页 I「[困难 · …]」/HUD ⚡/标题槽预览难度 同读一份源，与
// v23.08 难度/倍率行「困难档标注」同一主线收口）+ 运行期实证（困难档三屏逐值「 · 困难」/普通档
// 逐字零回归两档）+ README/package.json/CHANGELOG 同步（冒烟二百一十二件套（二百一十一件套清除）/
// 串尾/入库 206 份/顶 pin）+ 姊妹件套 pin（smoke_v2309 随新现实更新）+ 哨兵链领先一位（207 口径）
// + 旧代 v23.09 pin 全库零残留。
import { GAME_VERSION, DIFFS, ACH_LIST, FRAGMENTS } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v23.10 run 总结屏困难档标注守护冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v23.09 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v23.09（本版守 v23.10）', !!_gv && (_gv[0] > 23 || (_gv[0] === 23 && _gv[1] >= 10)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const menusSrc = read('../js/view/menus.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v23.10 版本注释', dataSrc.includes('// v23.10 体验打磨·信息透明·同一口径：run 总结屏三屏'));
ok('data.js GAME_VERSION 字面量已为 v23.10（旧 v23.09 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.48';") && !dataSrc.includes("const GAME_VERSION = 'v23." + "09';"));
ok('data.js 仍保留 v23.09 历史注释（支线/奖励数值速查行注释未动）', dataSrc.includes('// v23.09 文档整理·数值说明·同源口径：README「数值速查」补「支线 / 奖励」行'));

// —— DIFFS 单源契约（与 v23.08 难度行同读一份源）——
ok('DIFFS 两档：普通 / 困难（DIFFS[1] 即困难档标注名）', Array.isArray(DIFFS) && DIFFS.length === 2 && DIFFS[0] === '普通' && DIFFS[1] === '困难');

// —— 源级落位：三屏战绩行困难档标注（同读 hero.diff · DIFFS 一份源、普通档零后缀）——
const DEF_SUFFIX = ' + (hero.diff ? \' · \' + DIFFS[hero.diff] : \'\')';
const deadBlock = (menusSrc.match(/export function drawDead\(\)\{[\s\S]*?\n\}/) || [''])[0];
const winBlock = (menusSrc.match(/export function drawWin\(\)\{[\s\S]*?\n\}/) || [''])[0];
const endBlock = (menusSrc.match(/export function drawEnding\(\)\{[\s\S]*?\n\}/) || [''])[0];
ok('三个导出块存在', deadBlock.length > 0 && winBlock.length > 0 && endBlock.length > 0);
ok('drawDead 战绩行补 v23.10 困难档后缀（hero.diff · DIFFS 单源，模板逐字保留 + 后缀）',
  deadBlock.includes('当前 Lv.${hero.level} · 金币 ${hero.gold} · 累计讨伐 ${kills} 只') &&
  deadBlock.includes('⏱️${fmtTime(hero.time)}` + (hero.diff ? \' · \' + DIFFS[hero.diff] : \'\')') &&
  deadBlock.includes(",CV.width/2,236,'13px','#7d93a3','center');"));
ok('drawWin 战绩行补 v23.10 困难档后缀（S.G.diff · DIFFS 单源，y=362 零位移）',
  winBlock.includes('累计讨伐 ${kills} 只 · 成就 ${(S.G.ach||[]).length}/${ACH_LIST.length}') &&
  winBlock.includes('⏱️${fmtTime(S.G.time)}` + (S.G.diff ? \' · \' + DIFFS[S.G.diff] : \'\')') &&
  winBlock.includes(',CV.width/2,362);'));
ok('drawEnding 战绩行补 v23.10 困难档后缀（hero.diff · DIFFS 单源，y=346 零位移）',
  endBlock.includes('战绩 · 累计讨伐 ${Object.values(hero.bestiary||{}).reduce((a,b)=>a+b,0)} 只') &&
  endBlock.includes('⏱️${fmtTime(hero.time)}` + (hero.diff ? \' · \' + DIFFS[hero.diff] : \'\')') &&
  endBlock.includes(",320,346,'13px','#7d93a3','center');"));
ok('menus.js 已 import DIFFS（三屏后缀同读 data.js 单一数据源）', menusSrc.includes('DIFFS,') || menusSrc.includes('DIFFS ,'));

// —— 行宽预算（v21.18 同款 estW）：最坏战绩行（真实上限值 + 困难后缀）不超画布、后缀增量有界 ——
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
const worstBase = `战绩 · 累计讨伐 300 只 · 成就 ${ACH_LIST.length}/${ACH_LIST.length} · 记忆 ${FRAGMENTS.length}/${FRAGMENTS.length} · 金币 9999 · ⏱️99:59:59`;
const wBase = estW(worstBase);
const wHard = estW(worstBase + ' · 困难');
ok('最坏尾声战绩行（真实上限值）估算宽 ≤640 画布（13px 单行中心对齐，与 v2187 同款口径）', wBase > 0 && wBase <= 640, `≈${wBase.toFixed(0)}px`);
ok('困难后缀「 · 困难」增量有界（≤80px，不改行布局预算）', wHard - wBase <= 80 && wHard - wBase > 0, `≈${(wHard - wBase).toFixed(0)}px`);

// —— 运行期实证：DOM/音频/存储桩 + main.js 真实导入后三屏渲染捕获 ——
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

function makeHero(diff) {
  const h = newGame('余烬');
  Object.assign(h, {
    diff, level: 9, gold: 777, item: 3, potion2: 1, time: 3723,
    bestiary: { '史莱姆': 2, '野狼': 1 }, ach: ['firstblood'],
    chests: new Set(['22,1', '12,11']),
    map: 'dungeon', visited: ['village', 'dungeon'], xp: 100, xpNext: 500,
    hp: 90, hpMax: 100, mp: 30, mpMax: 40, skills: ['火焰斩', '冰霜击'],
    bossDefeated: true, caveBoss: false, trueBoss: false, tutDone: true,
    quest: 3, quests: { side_mushroom: 'done' }, mushrooms: 4,
  });
  return h;
}

// 困难档（diff=1）：三屏战绩行应带「 · 困难」（DIFFS[1] 单一数据源）
S.G = makeHero(1);
S.enemy = { name: '野狼' };
S.scene = 'dead';
let threw = null;
try { CAPTURED.length = 0; menus.drawDead(); } catch (e) { threw = e; }
ok('运行期：drawDead 困难档渲染不抛错', threw === null, threw && String(threw.stack || threw));
ok('运行期：drawDead 困难档战绩行带「 · 困难」（⏱01:02:03 · 困难）',
  CAPTURED.some((t) => t.includes('当前 Lv.9 · 金币 777 · 累计讨伐 3 只 · ⏱️01:02:03 · 困难')),
  CAPTURED.filter((t) => t.includes('累计讨伐')).join(' | '));

S.scene = 'win';
try { CAPTURED.length = 0; menus.drawWin(); } catch (e) { threw = e; }
ok('运行期：drawWin 困难档渲染不抛错', threw === null, threw && String(threw.stack || threw));
ok('运行期：drawWin 困难档战绩行带「 · 困难」',
  CAPTURED.some((t) => t.includes('累计讨伐 3 只') && t.includes('⏱️01:02:03 · 困难')),
  CAPTURED.filter((t) => t.includes('累计讨伐')).join(' | '));

S.scene = 'ending';
try { CAPTURED.length = 0; menus.drawEnding(); } catch (e) { threw = e; }
ok('运行期：drawEnding 困难档渲染不抛错', threw === null, threw && String(threw.stack || threw));
ok('运行期：drawEnding 困难档战绩行带「 · 困难」（战绩 · … ⏱01:02:03 · 困难）',
  CAPTURED.some((t) => t.includes('战绩 · 累计讨伐 3 只') && t.includes('⏱️01:02:03 · 困难')),
  CAPTURED.filter((t) => t.includes('战绩 ·')).join(' | '));

// 普通档（diff=0）：三屏战绩行逐字零回归（零后缀零噪音）
S.G = makeHero(0);
S.scene = 'dead';
try { CAPTURED.length = 0; menus.drawDead(); } catch (e) { threw = e; }
ok('运行期：drawDead 普通档战绩行逐字零回归（无「· 困难」后缀）',
  CAPTURED.some((t) => t.includes('当前 Lv.9 · 金币 777 · 累计讨伐 3 只 · ⏱️01:02:03')) &&
  !CAPTURED.some((t) => t.includes('累计讨伐 3 只') && t.includes('· 困难')),
  CAPTURED.filter((t) => t.includes('累计讨伐')).join(' | '));
S.scene = 'win';
try { CAPTURED.length = 0; menus.drawWin(); } catch (e) { threw = e; }
ok('运行期：drawWin 普通档战绩行逐字零回归（无「· 困难」后缀）',
  CAPTURED.some((t) => t.includes('累计讨伐 3 只 · 成就 1/')) && !CAPTURED.some((t) => t.includes('· 困难')));
S.scene = 'ending';
try { CAPTURED.length = 0; menus.drawEnding(); } catch (e) { threw = e; }
ok('运行期：drawEnding 普通档战绩行逐字零回归（无「· 困难」后缀）',
  CAPTURED.some((t) => t.includes('战绩 · 累计讨伐 3 只')) && !CAPTURED.some((t) => t.includes('· 困难')));

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README 件套口径为二百一十二件套（二百一十一件套清除）且旧 205 口径零残留',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟二百零五件套（二百零四件套清' + '除）'));
ok('README 不含哨兵领先一位（二百一十三件套（二百一十二件套清除））',
  !readme.includes('二百一十三件套（二百一十二件套清除）'));
ok('README 含 v23.10 守护描述（run 总结屏困难档标注守护）',
  readme.includes('v23.10 起含 run 总结屏「困难档」标注守护'));
ok('README 含 smoke_v2310_diffsum 入库（206 份）', readme.includes('smoke_v2310_diffsum 入库（206 份）'));
ok('README 仍保留 v23.09 守护描述（历史口径）', readme.includes('v23.09 起含「支线 / 奖励」数值速查行守护'));
ok('README 仍保留 smoke_v2309_questnum 入库（205 份）历史口径', readme.includes('smoke_v2309_questnum 入库（205 份）'));
ok('README 数值速查「难度 / 倍率」行仍未动（v23.08 历史口径）', readme.includes('（v23.08 补录） | `DIFFS` `DIFF_SCALE` |'));
ok('README tests 树串尾已延伸至 smoke_v2310_diffsum（v2309 后接 v2310）',
  readme.includes('smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 旧串尾零残留（v2309 后无串尾收口）',
  !readme.includes('smoke_v2308_diffnum + smoke_v2309_questnum（npm test 串' + '跑）'));
ok('package.json 已收录 smoke_v2310_diffsum（npm test 串跑第 206 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2310_diffsum.mjs'));
ok('package.json 串尾为 ... smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"',
  pkg.includes('node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 206 件套', testChain === 212, String(testChain));
ok('CHANGELOG 顶部已追加 v23.10 条目', changelog.startsWith('## v23.48 '));
ok('CHANGELOG 仍保留 v23.09 条目（历史口径）', changelog.includes('## v23.09 README「数值速查」补「支线 / 奖励」行'));

// —— 姊妹件套 pin 随新现实更新 + 旧代 v23.09 pin 零残留 ——
const s2309 = read('smoke_v2309_questnum.mjs');
const s2143 = read('smoke_v2143_talkekey.mjs');
ok('smoke_v2309 的 GAME_VERSION 字面量 pin 已更新为 v23.10', s2309.includes("const GAME_VERSION = 'v23.48';"));
ok('smoke_v2309 的 CHANGELOG 顶 pin 已更新为 ## v23.10',
  s2309.includes("startsWith('## v23.48 "));
ok('smoke_v2309 的件套 pin 已更新为二百一十二件套（二百一十一件套清除）',
  s2309.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2309 的 README 串尾 pin 已延伸至 smoke_v2310_diffsum',
  s2309.includes('smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2309 的 package 串尾 pin 已延伸至 smoke_v2310_diffsum',
  s2309.includes('node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
ok('smoke_v2309 的 testChain pin 已更新为 206', s2309.includes('testChain === 212'));
ok('smoke_v2309 的版本锚已越过 v23.09 口径（>= 9 对 v23.10 恒真）', s2309.includes('_gv[1] >= 9'));
ok('smoke_v2143 哨兵链已推进至二百一十三件套（二百一十二件套清除）',
  s2143.includes('二百一十三件套（二百一十二件套清除）') && s2143.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));

// 旧代 v23.09 pin 全库零残留（不含本件）
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2310_diffsum.mjs');
const stale = [];
const stalePats = [
  /'v23\.09'/, /二百零五件套（二百零四件套清.*?除）/,
  /testChain === 205/, /smoke_v2309_questnum（npm test 串跑）/,
  /startsWith\('## v23\.09/, /smoke_v2309_questnum\.mjs"/, /冒烟二百零五件套（二百零四件套清除）/
];
for (const f of allTests) {
  const src = read(f);
  if (stalePats.some((re) => re.test(src))) stale.push(f);
}
ok('旧代 v23.09 字面量/恒等/件套/testChain/串尾/顶 pin/package 串尾 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

console.log(`\n— v23.10 run 总结屏困难档标注守护冒烟：${n - failed}/${n} 通过 —`);
if (failed) process.exit(1);
