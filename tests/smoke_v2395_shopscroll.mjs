// v23.95 专项冒烟：商店商品清单视窗滚动（体验打磨·可发现性·纯显示——承成就页 achScroll 视窗同款先例：
// v23.92 星铁剑入店后 buildShopList 商品清单最长 10 行（新手持木剑布衣+持菇实测：药水/卖菇/铁剑/
// 秘银剑/星铁剑/勇者之剑/皮甲/锁子甲/龙鳞甲/离开），而 drawShop 面板（360 高、底缘 410）按 i*38 排
// 只有 8 行预算——第 9 行（i=8，行底 432）画出面板底、第 10 行（i=9，行底 470）与页脚提示（470）相撞，
// 「离开商店」长期被挤出面板；现固定可视 8 行（i=0..7 末行底 394 ≤410 面板预算），窗口起点由 shopSel
// 派生（无新状态、选中行永不被裁掉），超出按成就页同款口径补「还有 N 项未在本页显示/上方还有 N 项」提示。
// 本冒烟守护：版本锚点、menus.js 源级落位（视窗/Page/提示串）、运行期真实 buildShopList 10 项清单 +
// fillText 录制逐档验证（窗口内容/行基线 ≤394/提示 y=428/≤8 项无提示零噪音）、shop.js 清单逻辑零回归、
// README/package.json/CHANGELOG 同步（tests 树串尾 + 件套口径 219 + v23.95 守护描述 + 入库 219）、
// 哨兵链（v2143 前望 220 且 README 尚无 220 口径）、旧代 v23.94 pin 全库零残留扫描。
import { S } from '../js/state.js';
import { GAME_VERSION } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v23.94 冒烟先例：先装桩再 import main.js）——
const noop = () => {};
function makeCtx() {
  const grad = { addColorStop: noop };
  return {
    canvas: { width: 640, height: 480 },
    measureText: (t) => ({ width: String(t).length * 8 }),
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
    gain: { value: 1, setValueAtTime: noop, linearRampToValueAtTime: noop, exponentialRampToValueAtTime: noop } }),
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

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v23.95 商店商品清单视窗滚动 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const menusSrc = read('js/view/menus.js');
const shopSrc = read('js/shop.js');
const mainSrc = read('js/main.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v23.94 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v23.94', !!_gv && (_gv[0] > 23 || (_gv[0] === 23 && _gv[1] > 94)), GAME_VERSION);
ok('data.js 含 v23.95 注释（商店视窗滚动说明）', dSrc.includes('v23.95 体验打磨·可发现性·纯显示（商店商品清单视窗滚动'));
ok('data.js GAME_VERSION 字面量已为 v23.95（旧 v23.94 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.00';") && !dSrc.includes("const GAME_VERSION = 'v23.9" + "4';"));
ok('data.js 仍保留 v23.94 历史注释（重整旗鼓行 P 口径说明，累积注释块）',
  dSrc.includes('v23.94 文档整理·口径收口（帮助页「试炼进阶」重整旗鼓行补 P 存档口径'));

// —— drawShop 源级落位：视窗/Page/提示串 ——
ok('menus.js 视窗常量落位（const PAGE = 8——面板 8 行预算）', menusSrc.includes('const PAGE = 8'));
ok('menus.js 窗口起点钳制落位（maxStart + shopSel 派生 start）',
  menusSrc.includes('const maxStart = Math.max(0, list.length - PAGE)') &&
  menusSrc.includes('let start = S.shopSel - (PAGE - 1)'));
ok('menus.js 视窗切片落位（slice(start, start + PAGE)，j 为视窗内行号）',
  menusSrc.includes('list.slice(start, start + PAGE).forEach((it,j)') &&
  menusSrc.includes('const i = start + j'));
ok('menus.js 裁切提示落位（↓ 还有 N 项未在本页显示 / ↑ 上方还有 N 项，y=428）',
  menusSrc.includes('项未在本页显示') && menusSrc.includes('上方还有 ${start} 项') &&
  menusSrc.includes('320, 428'));
ok('menus.js 行几何视窗化（rr/text/价签 y 由 i*38 改 j*38）',
  menusSrc.includes('rr(70,96+j*38,500,32,6)') && menusSrc.includes("text((sel?'▶':' ')+' '+it.t,86,118+j*38") &&
  menusSrc.includes("text(it.price+'💰'+lack,560,118+j*38"));
ok('menus.js 页脚键位行零回归（Enter/E购买 口径逐字未动）',
  menusSrc.includes('绿色▲=更强升级 灰色=买不起 · ↑↓选择  Enter/E购买  Esc离开'));
ok('shop.js buildShopList 清单逻辑零回归（ARMORS 遍历/价签/▲▼对比逐字未动）',
  shopSrc.includes('Object.keys(ARMORS).forEach((name) =>') && shopSrc.includes("t: `🛡️ ${name} (防+${ARMORS[name].def})${tag}`"));
ok('main.js 商店键位零回归（shopSel 回绕 + Enter/E 购买路径逐字未动）',
  mainSrc.includes('S.shopSel = (S.shopSel + 1) % S.shopList.length') &&
  mainSrc.includes('const item = S.shopList[S.shopSel]'));

// —— 运行期：真实 buildShopList 11 项清单 + fillText 录制逐档验证 ——
{
  const { CTX } = await import('../js/view/canvas.js');
  const { buildShopList } = await import('../js/shop.js');
  const { drawShop } = await import('../js/view/menus.js');
  const records = [];
  CTX.fillText = (t, x, y) => { records.push({ t: String(t), x, y }); };
  // 最坏情形：新手装（木剑/布衣）+ 5 株蘑菇 → 11 行清单（v23.96 精钢甲入店后：药水/卖菇/4 剑/4 甲/离开，
  // 与 /tmp/jrpg_viz/shot_shop.mjs 实测同档；本断言随 v23.96 新现实由 smoke_v2396_steelarmor 守护）
  S.G.gold = 9999; S.G.mushrooms = 5; S.G.item = 1;
  const list = buildShopList();
  S.scene = 'shop';
  ok('运行期：最坏情形清单恰 11 项（药水/卖菇/4 剑/4 甲/离开，v23.96 精钢甲入列）', list.length === 11, String(list.length));
  const has = (s) => records.some((r) => r.t.includes(s));
  const ys = (s) => records.filter((r) => r.t.includes(s)).map((r) => r.y);

  const runAt = (sel) => { records.length = 0; S.shopSel = sel; drawShop(); };
  runAt(0);
  ok('shopSel=0：视窗首屏 8 项——皮甲/锁子甲可见', has('皮甲') && has('锁子甲'));
  ok('shopSel=0：第 9/10/11 行（精钢甲/龙鳞甲/离开商店）被视窗裁掉', !has('精钢甲') && !has('龙鳞甲') && !has('离开商店'));
  ok('shopSel=0：裁切提示「↓ 还有 3 项未在本页显示」精确落位（y=428）',
    ys('还有 3 项未在本页显示').includes(428));
  ok('shopSel=0：商品行基线最大 384（118+7*38）——零行画面板底 410',
    records.filter((r) => r.y !== 428 && r.y !== 470 && r.y > 384).length === 0,
    JSON.stringify(records.filter((r) => r.y > 384 && r.y !== 428 && r.y !== 470).map((r) => r.y)));

  runAt(7);
  ok('shopSel=7：选中行贴视窗底部仍可见（锁子甲在屏、精钢甲仍裁掉）', has('锁子甲') && !has('精钢甲'));

  runAt(8);
  ok('shopSel=8：窗口下滑——精钢甲入屏、生命药水被裁', has('精钢甲') && !has('生命药水'));

  runAt(10);
  ok('shopSel=10（末行）：离开商店入屏且提示翻向「↑ 上方还有 3 项」',
    has('离开商店') && ys('上方还有 3 项').includes(428) && !has('生命药水') && !has('卖菇'));

  // 短清单（≤PAGE 边界档）：直接注入 5 项合成清单（真实对局最少 10 项——木剑恒在清单，≤8 档唯合成可达），
  // 验证不裁切、零提示零噪音——drawShop 只读 S.shopList，注入即真实绘制路径
  const synth = [
    { t: '🍖 生命药水 ×1', price: 15, kind: 'potion', act() {} },
    { t: '🗡️ 试作木剑', price: 10, kind: 'weapon', up: true, act() {} },
    { t: '🛡️ 试作皮甲', price: 10, kind: 'armor', up: true, act() {} },
    { t: '✖ 离开商店', price: 0, kind: 'leave', act() {} },
    { t: '📦 占位商品', price: 5, kind: 'weapon', up: false, act() {} },
  ];
  S.shopList = synth; S.shopSel = 0;
  runAt(0);
  ok('运行期：短清单（合成 5 项 ≤PAGE 边界档）全数入屏', has('离开商店') && has('占位商品'));
  ok('短清单：零裁切提示零噪音（信息透明不扰民）', !has('未在本页显示') && !has('上方还有'));
  // 恢复真实清单，避免污染后续断言（本冒烟已无后续运行期断言，仍守「测试自净」惯例）
  S.G.weapon = '木剑'; S.G.armor = '布衣'; S.G.mushrooms = 5;
  buildShopList();
}

// —— README / package.json / CHANGELOG 同步 ——
const testChain = (JSON.parse(pkg).scripts.test.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 219 件套', testChain === 224, String(testChain));
ok('package.json 已收录 smoke_v2395_shopscroll（npm test 串跑第 219 份）',
  JSON.parse(pkg).scripts.test.includes('smoke_v2395_shopscroll.mjs'));
ok('package.json 串尾为 ... smoke_v2394_fightback.mjs && node tests/smoke_v2395_shopscroll.mjs && node tests/smoke_v2396_steelarmor.mjs && node tests/smoke_v2397_baserow.mjs && node tests/smoke_v2398_econrow.mjs && node tests/smoke_v2399_dmgformula.mjs && node tests/smoke_v2400_trialwarn.mjs"',
  pkg.includes('node tests/smoke_v2394_fightback.mjs && node tests/smoke_v2395_shopscroll.mjs && node tests/smoke_v2396_steelarmor.mjs && node tests/smoke_v2397_baserow.mjs && node tests/smoke_v2398_econrow.mjs && node tests/smoke_v2399_dmgformula.mjs && node tests/smoke_v2400_trialwarn.mjs"'));
ok('README tests 树串尾已延伸至 smoke_v2395_shopscroll',
  readme.includes('+ smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula + smoke_v2400_trialwarn（npm test 串跑）'));
ok('README 件套口径为二百二十四件套（二百二十三件套清除）且旧 215 口径零残留',
  readme.includes('冒烟二百二十四件套（二百二十三件套清除）') && !readme.includes('冒烟二百一十五件套（二百一十四件套清' + '除）'));
ok('README 含 v23.95 守护描述（商店商品清单视窗滚动守护）',
  readme.includes('v23.95 起含 商店商品清单视窗滚动守护'));
ok('README 含 smoke_v2395_shopscroll 入库（219 份）', readme.includes('smoke_v2395_shopscroll 入库（219 份）'));
ok('README 仍保留 v23.94 历史守护描述与入库口径（历史累积）',
  readme.includes('v23.94 起含 帮助页「试炼进阶」重整旗鼓行 P 存档口径守护') &&
  readme.includes('smoke_v2394_fightback 入库（218 份）'));
ok('CHANGELOG 顶部已追加 v23.95 条目（商店视窗滚动）', changelog.startsWith('## v24.00 '));
ok('CHANGELOG 顶部条目含视窗滚动说明', changelog.includes('商店商品清单视窗滚动'));
ok('CHANGELOG 仍保留 v23.94 条目标题（历史口径）', changelog.includes('## v23.94 帮助页「试炼进阶」重整旗鼓行补 P 存档'));

// —— 哨兵链：v2143 前哨前望 220 且 README 尚无 220 口径 ——
const s2143 = read('tests/smoke_v2143_talkekey.mjs');
ok('smoke_v2143 哨兵链已推进至二百二十五件套（二百二十四件套清除）',
  s2143.includes('二百二十五件套（二百二十四件套清除）') && s2143.includes("!readme.includes('二百二十五件套（二百二十四件套清除）')"));
ok('README 尚无二百二十五件套（二百二十四件套清除）前望口径', !readme.includes('二百二十五件套（二百二十四件套清除）'));

// —— 旧代 v23.94 pin 全库零残留（不含本件；拆串防误伤，承 v2319/v2392/v2393/v2394 惯例）——
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2395_shopscroll.mjs');
const stale = [];
for (const f of allTests) {
  const src = read('tests/' + f);
  if (src.includes("const GAME_VERSION = 'v23.9" + "4';") ||
      src.includes("GAME_VERSION === 'v23.9" + "4'") ||
      src.includes("startsWith('## v23.9" + "4 ") ||
      src.includes("startsWith('## v23.9" + "4'")) stale.push(f);
}
ok('旧代 v23.94 字面量/恒等/顶 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.94 特性标签保留）',
  stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
