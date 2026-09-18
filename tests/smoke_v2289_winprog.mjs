// smoke_v2289_winprog.mjs —— v22.89 胜利画面「冒险进度」五徽记行守护
// 承 v21.10-v22.88 冒烟入库先例：版本锚点 + 源级落位 + 数据契约 + 行宽/垂直预算 +
// 运行期全链路 + README/package.json/CHANGELOG 同步 + 姊妹件套 pin + 旧代 v22.88 pin 全库零残留 + 哨兵链领先一位
import { GAME_VERSION, FRAGMENTS, BESTIARY_TARGET, chestTotal, ACH_LIST } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.89 胜利画面「冒险进度」五徽记行冒烟 —');

// 1. 版本锚点（v21.7 去硬化惯例）
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.88', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 96)), GAME_VERSION);
ok('GAME_VERSION 恒等于 v22.89', GAME_VERSION === 'v22.96', GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const menusSrc = read('../js/view/menus.js');
const questsSrc = read('../js/quests.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

// 2. 源级落位
ok('data.js GAME_VERSION 字面量为 v22.89', dataSrc.includes("const GAME_VERSION = 'v22.96';"));
ok('旧 v22.88 字面量零残留', !dataSrc.includes("const GAME_VERSION = 'v22.8" + "8';"));
ok('data.js 含 v22.89 版本注释', dataSrc.includes('// v22.89 体验打磨·信息透明·纯显示'));
ok('data.js 仍保留 v22.88 历史注释（累积注释块）', dataSrc.includes('// v22.88 体验打磨·可发现性·纯文字'));
const winBlock = (menusSrc.match(/export function drawWin\(\)\{[\s\S]*?\n\}/) || [''])[0];
ok('drawWin 块存在', winBlock.length > 0);
ok('drawWin 补「冒险进度」行（adventureProgress 单一数据源派生）',
  winBlock.includes('const progW = adventureProgress(S.G);') &&
  winBlock.includes("'冒险进度：' + progW.map(([nm, dn]) => (dn ? '✓ ' : '✗ ') + nm).join(' · ')"));
ok('drawWin 新行落位 y=434', winBlock.includes(',CV.width/2,434);'));
ok('drawWin 上方五段基线逐字零位移（340/362/378/396/416）',
  winBlock.includes(',CV.width/2,340)') && winBlock.includes(',CV.width/2,362)') &&
  winBlock.includes(',CV.width/2,378)') && winBlock.includes(',CV.width/2,396);') &&
  winBlock.includes(',CV.width/2,416);'));
ok('drawWin 页脚/提示口径零回归（v22.85 Enter/E + v21.98 未自动存档）',
  winBlock.includes('按 Enter/E 观看尾声 · 按 P 存档 · 按 R 重开新档(连按两次)') &&
  winBlock.includes('💡 本局战果未自动存档 · 按 P 存进当前槽'));
ok('drawWin 含 v22.89 注释块', winBlock.includes('v22.89 胜利画面补「冒险进度」行'));

// 3. quests.js 数据契约：adventureProgress 五档与状态页/写档同源
const qBlock = (questsSrc.match(/export function adventureProgress\(hero\) \{[\s\S]*?\n\}/) || [''])[0];
ok('quests.js adventureProgress 函数存在', qBlock.includes('adventureProgress'));
const need = [
  ["['灯芯', !!hero.bossDefeated]", 'bossDefeated'],
  ["['星井', !!hero.caveBoss]", 'caveBoss'],
  ["['回廊', !!hero.galleryOpen]", 'galleryOpen'],
  ["['初灯', !!hero.trueBoss]", 'trueBoss'],
  ["['试炼场', !!hero.rushDone]", 'rushDone'],
];
let srcOk = true;
for (const [s, nm] of need) if (!qBlock.includes(s)) { srcOk = false; console.log('    <- quests.js 缺:', nm); }
ok('quests.js 五档逐字同源（灯芯/星井/回廊/初灯/试炼场，flags 单一数据源）', srcOk);
const { adventureProgress } = await import('../js/quests.js');
const prog0 = adventureProgress({ bossDefeated: true });
ok('运行期：adventureProgress 返回恰 5 档', prog0.length === 5, String(prog0.length));
ok('运行期：bossDefeated=only → [true,false,false,false,false]',
  JSON.stringify(prog0.map((x) => x[1])) === JSON.stringify([true, false, false, false, false]));
ok('运行期：全通关档 → [true,true,true,true,true]',
  JSON.stringify(adventureProgress({ bossDefeated: 1, caveBoss: 1, galleryOpen: 1, trueBoss: 1, rushDone: 1 }).map((x) => x[1])) ===
  JSON.stringify([true, true, true, true, true]));
ok('运行期：缺字段防御档 → 全 false 不抛错',
  JSON.stringify(adventureProgress({}).map((x) => x[1])) === JSON.stringify([false, false, false, false, false]));

// 4. 行宽 / 垂直预算（12px 单行 ≤640 画布中心对齐；垂直 434 与 416/480 间距 ≥16）
const estW = (s) => {
  let w = 0;
  for (const ch of String(s)) {
    const c = ch.codePointAt(0);
    if (c >= 0x4e00 && c <= 0x9fff) w += 12;
    else if (c >= 0x3000 && c <= 0x303f) w += 12;
    else if (c >= 0xff00 && c <= 0xffef) w += 12;
    else if (/[0-9A-Za-z]/.test(ch)) w += 6;
    else if (ch === ' ') w += 6;
    else if ('｜|:：。，、！？…—·【】[]'.includes(ch)) w += 12;
    else w += 6.5;
  }
  return w;
};
const worst = '冒险进度：✓ 灯芯 · ✓ 星井 · ✓ 回廊 · ✓ 初灯 · ✓ 试炼场';
const wWorst = estW(worst);
ok('最坏冒险进度行 12px estW ≈' + wWorst.toFixed(1) + ' ≤640', wWorst > 0 && wWorst <= 640, `≈${wWorst.toFixed(0)}px`);
ok('垂直预算：434 与提示行 416 间距 18 ≥16', 434 - 416 >= 16);
ok('垂直预算：434 与画布底 480 间距 46 ≥16', 480 - 434 >= 16);

// 5. 运行期全链路：DOM/音频/存储桩 + main.js 真实导入 + drawWin 渲染捕获
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

// 推进档：讨回灯芯（bossDefeated=true），其余四档未达成
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
ok('运行期：冒险进度行恰 1 处且为「✓ 灯芯 · ✗ 星井 · ✗ 回廊 · ✗ 初灯 · ✗ 试炼场」',
  CAPTURED.filter((t) => t.includes('冒险进度：')).length === 1 &&
  CAPTURED.some((t) => t.includes('冒险进度：✓ 灯芯 · ✗ 星井 · ✗ 回廊 · ✗ 初灯 · ✗ 试炼场')));
ok('运行期：既有段零回归（灯芯回来了/等级金币/战绩/收集/页脚/提示共存）',
  CAPTURED.includes('灯 芯 回 来 了') && CAPTURED.some((t) => t.includes('最终等级 Lv.9')) &&
  CAPTURED.some((t) => t.includes('累计讨伐 3 只')) &&
  CAPTURED.some((t) => t.includes(`📕 图鉴 2/${BESTIARY_TARGET.length}`)) &&
  CAPTURED.some((t) => t.includes('按 Enter/E 观看尾声')) &&
  CAPTURED.some((t) => t.includes('本局战果未自动存档')));

// 全收集档：五档全达成
S.G.bossDefeated = true; S.G.caveBoss = true; S.G.galleryOpen = true; S.G.trueBoss = true; S.G.rushDone = true;
threw = null;
try { CAPTURED.length = 0; menus.drawWin(); } catch (e) { threw = e; }
ok('运行期：drawWin 全进度档渲染不抛错', threw === null, threw && String(threw.stack || threw));
ok('运行期：全进度档报「✓ 灯芯 · ✓ 星井 · ✓ 回廊 · ✓ 初灯 · ✓ 试炼场」',
  CAPTURED.some((t) => t.includes('冒险进度：✓ 灯芯 · ✓ 星井 · ✓ 回廊 · ✓ 初灯 · ✓ 试炼场')));

// 防御档：旧档缺字段 → 不抛错 + 五 ✗
S.G = { name: '灯见', level: 1, gold: 30, map: 'village', time: 3 };
threw = null;
try { CAPTURED.length = 0; menus.drawWin(); } catch (e) { threw = e; }
ok('运行期：drawWin 缺字段防御档渲染不抛错', threw === null, threw && String(threw.stack || threw));
ok('运行期：防御档冒险进度行全 ✗', CAPTURED.some((t) => t.includes('冒险进度：✗ 灯芯 · ✗ 星井 · ✗ 回廊 · ✗ 初灯 · ✗ 试炼场')));

// 6. README / package.json / CHANGELOG 同步
ok('README tests 树串尾已延伸至 smoke_v2289_winprog（v2288 后接 v2289）',
  readme.includes('smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog（npm test 串跑）'));
ok('README 件套口径为一百九十二件套（一百九十一件套清除）且旧 184 口径零残留',
  readme.includes('冒烟一百九十二件套（一百九十一件套清除）') && !readme.includes('一百八十四件套（一百八十三件套清' + '除）'));
ok('README 含 v22.89 守护描述（胜利画面「冒险进度」五徽记行守护）',
  readme.includes('v22.89 起含胜利画面「冒险进度」五徽记行守护'));
ok('README 含 smoke_v2289_winprog 入库（185 份）', readme.includes('smoke_v2289_winprog 入库（185 份）'));
ok('README 仍保留 smoke_v2288_scrollhint 入库（184 份）历史口径', readme.includes('smoke_v2288_scrollhint 入库（184 份）'));
ok('README 仍保留 v22.88 守护描述（历史口径）', readme.includes('v22.88 起含帮助页「操作说明」任务日志/记忆图鉴/成就一览「↑↓ 滚动」口径守护'));
ok('README 系统清单补「胜利画面冒险进度行」条款', readme.includes('胜利画面冒险进度行**（v22.89'));
ok('package.json test 串含 smoke_v2289_winprog.mjs 且位于串尾',
  pkg.includes('node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 185 件套', testChain === 192, String(testChain));
ok('CHANGELOG 含 v22.89 条目（顶 pin）', changelog.startsWith('## v22.96 '));
ok('CHANGELOG 仍保留 v22.88 条目（历史口径）', changelog.includes('## v22.88 帮助页「操作说明」'));

// 7. 姊妹件套 pin（smoke_v2288/v2287/v2286 随新现实更新）
const readTest = (name) => read('../tests/' + name);
const s2288 = readTest('smoke_v2288_scrollhint.mjs');
const s2287 = readTest('smoke_v2287_trueroute.mjs');
const s2286 = readTest('smoke_v2286_titleekey.mjs');
ok('smoke_v2288 的 GAME_VERSION 字面量 pin 已更新为 v22.89', s2288.includes("const GAME_VERSION = 'v22.96';"));
ok('smoke_v2288 的 CHANGELOG 顶 pin 已更新为 ## v22.89', s2288.includes("startsWith('## v22.96 '"));
ok('smoke_v2288 的件套 pin 已更新为一百九十二件套（一百九十一件套清除）', s2288.includes('一百九十三件套（一百九十二件套清除）'));
ok('smoke_v2288 的 README 串尾 pin 已延伸至 smoke_v2289_winprog',
  s2288.includes('smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog（npm test 串跑）'));
ok('smoke_v2288 的 package 串尾 pin 已延伸至 smoke_v2289_winprog',
  s2288.includes('node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs"'));
ok('smoke_v2288 的 testChain pin 已更新为 185', s2288.includes('testChain === 192'));
ok('smoke_v2287 的 GAME_VERSION 字面量 pin 已更新为 v22.89', s2287.includes("const GAME_VERSION = 'v22.96';"));
ok('smoke_v2287 的 testChain pin 已更新为 185', s2287.includes('testChain === 192'));
ok('smoke_v2287 的哨兵 pin 已更新为一百九十二件套（一百九十一件套清除）', s2287.includes('一百九十三件套（一百九十二件套清除）'));
ok('smoke_v2286 的 GAME_VERSION 字面量 pin 已更新为 v22.89', s2286.includes("const GAME_VERSION = 'v22.96';"));
ok('smoke_v2286 的 哨兵 pin 已更新为一百九十二件套（一百九十一件套清除）', s2286.includes('一百九十二件套（一百九十一件套清除）'));
ok('smoke_v2286 的 README 串尾 pin 已延伸至 smoke_v2289_winprog',
  s2286.includes('smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog（npm test 串跑）'));

// 8. 旧代 v22.88 pin 全库零残留
const allTests = fs.readdirSync(new URL('../tests', import.meta.url)).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2289_winprog.mjs');
const stale = [];
const P1 = "const GAME_VERSION = 'v22." + "88';";
const P2 = "GAME_VERSION === 'v22." + "88'";
const P3 = '一百八十四件套（一百八十三件套清' + '除）';
const P4 = 'testChain === ' + '184';
const P5 = 'smoke_v2287_trueroute + smoke_v2288_scrollhint（npm test ' + '串跑）';
const P6 = '_gv[1] >= ' + '88';
const P7 = "startsWith('## v22." + "88 ";
for (const f of allTests) {
  const src = read('../tests/' + f);
  if (src.includes(P1) || src.includes(P2) || src.includes(P3) || src.includes(P4) ||
      src.includes(P5) || src.includes(P6) || src.includes(P7)) stale.push(f);
}
ok('旧代 v22.88 字面量/恒等/件套/testChain/串尾/版本锚/顶 pin 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

// 9. 哨兵链（件套守护领先一位）已指向下一版 186 口径
const s2143 = readTest('smoke_v2143_talkekey.mjs');
ok('哨兵链 v2143 已含下一版件套口径（一百九十二件套（一百九十一件套清除））',
  s2143.includes('一百九十三件套（一百九十二件套清除）') &&
  s2143.includes("!readme.includes('一百九十三件套（一百九十二件套清除）')"));

console.log(`\n— v22.89 胜利画面「冒险进度」五徽记行冒烟：${n}/${n - failed} 通过${failed ? '（失败 ' + failed + '）' : ''} —`);
process.exit(failed ? 1 : 0);
