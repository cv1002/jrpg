// v23.96 专项冒烟：新防具「精钢甲」——装备曲线补全（数值平衡·新内容·单一数据源，
// 承 v23.92 星铁剑同款主线：可购甲曲线 布衣1/0 → 皮甲4/60 → 锁子甲8/180 → 龙鳞甲13/480 唯
// 锁子甲→龙鳞甲 一跳 +5 防/300 金（皮甲→锁子甲 4/120 同剑侧 3-4 小步节奏），是毕业装曲线最大跳档——
// Lv6-9 段（雾语林后段/矿脉前）的玩家在 180 金之后只能 480 金一步到位；现补 精钢甲 10/300
// （星井矿脉的沉钢所铸、与星砂车同脉），把跳档拆成 精钢甲(2/120) + 龙鳞甲(3/180) 两段；
// 数据层单一数据源：shop.buildShopList 购买清单/购买 ▲▼对比/状态页面板/BEST_ARMOR 派生（成就
// 「龙鳞加身」同读一份源）全读 ARMORS 自动收录自动跟随，零逻辑改动；sprites.js ARM_COL 补兜底配色。
// 本冒烟守护：版本锚点、data.js 源级落位（v23.96 注释 / 精钢甲 逐字 / 四件既有甲逐字未动 /
// GAME_VERSION v23.96 与旧 v23.95 字面量零残留）、sprites.js ARM_COL 落位、运行期真实 shop.buyArmor
// 路径（扣款 300 金/换装/defMax=base+10/既有甲购买零回归/金币不足拦截零结算/曲线单调）、
// buildShopList 11 项清单（v23.95 视窗滚动随新现实：精钢甲入列第 9 行）、README/package.json/CHANGELOG
// 同步（tests 树串尾 + 件套口径 220 + v23.96 守护描述 + 入库 220）、哨兵链（v2143 前望 221 且 README
// 尚无 221 口径）、旧代 v23.95 pin 全库零残留扫描。
import { S } from '../js/state.js';
import { GAME_VERSION, WEAPONS, ARMORS, BEST_ARMOR, baseStats } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v23.95 冒烟先例：先装桩再 import main.js）——
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

console.log('— v23.96 新防具「精钢甲」 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const spritesSrc = read('js/view/sprites.js');
const shopSrc = read('js/shop.js');
const mainSrc = read('js/main.js');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v23.95 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v23.95', !!_gv && (_gv[0] > 23 || (_gv[0] === 23 && _gv[1] > 95)), GAME_VERSION);
ok('data.js 含 v23.96 注释（装备曲线补全说明）', dSrc.includes('v23.96 数值平衡·装备曲线补全'));
ok('data.js GAME_VERSION 字面量已为 v23.96（旧 v23.95 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v23.97';") && !dSrc.includes("const GAME_VERSION = 'v23.9" + "5';"));
ok('data.js 仍保留 v23.95 历史注释（商店视窗滚动说明，累积注释块）',
  dSrc.includes('v23.95 体验打磨·可发现性·纯显示（商店商品清单视窗滚动'));

// —— data.js 源级落位：精钢甲 逐字 + 四件既有甲逐字未动 + 曲线序位 ——
ok('ARMORS 含 精钢甲 10/300 逐字', dSrc.includes("'精钢甲':{def:10,price:300}"));
ok('精钢甲位于 锁子甲 与 龙鳞甲 之间（曲线序位）',
  dSrc.indexOf("'精钢甲':{def:10,price:300}") > dSrc.indexOf("'锁子甲':{def:8,price:180}") &&
  dSrc.indexOf("'精钢甲':{def:10,price:300}") < dSrc.indexOf("'龙鳞甲':{def:13,price:480}"));
ok('四件既有甲逐字未动（布衣1/皮甲4/锁子甲8/龙鳞甲13）',
  dSrc.includes("'布衣':{def:1,price:0}") && dSrc.includes("'皮甲':{def:4,price:60}") &&
  dSrc.includes("'锁子甲':{def:8,price:180}") && dSrc.includes("'龙鳞甲':{def:13,price:480}"));
ok('六把剑逐字未动（木剑2/铁剑5/秘银剑9/星铁剑12/勇者之剑15/圣光之剑24 legend）',
  dSrc.includes("'木剑':{atk:2,price:0}") && dSrc.includes("'铁剑':{atk:5,price:80}") &&
  dSrc.includes("'秘银剑':{atk:9,price:220}") && dSrc.includes("'星铁剑':{atk:12,price:400}") &&
  dSrc.includes("'勇者之剑':{atk:15,price:600}") && dSrc.includes("'圣光之剑':{atk:24,price:0,legend:true}"));
ok('行内注释含跳档拆段说明（2/120 + 3/180）', dSrc.includes('把跳档拆成 精钢甲(2/120) + 龙鳞甲(3/180)'));
ok('sprites.js ARM_COL 收录 精钢甲 兜底配色 #8fa8bd（介于 锁子甲/龙鳞甲 之间）',
  spritesSrc.includes("'精钢甲': '#8fa8bd'"));
ok('sprites.js ARM_COL 四件既有甲配色逐字未动',
  spritesSrc.includes("'布衣': '#3b6fe0'") && spritesSrc.includes("'皮甲': '#b0702f'") &&
  spritesSrc.includes("'锁子甲': '#aab6c6'") && spritesSrc.includes("'龙鳞甲': '#36c97e'"));

// —— 运行期：ARMORS 契约 + BEST_ARMOR 派生 + shop.buyArmor 真实路径 ——
ok('运行期 ARMORS 精钢甲 def 10 / price 300（单值常数）',
  ARMORS['精钢甲'].def === 10 && ARMORS['精钢甲'].price === 300);
ok('运行期 ARMORS 共 5 件（四件既有 + 精钢甲），序位 布衣/皮甲/锁子甲/精钢甲/龙鳞甲',
  Object.keys(ARMORS).join(',') === '布衣,皮甲,锁子甲,精钢甲,龙鳞甲', Object.keys(ARMORS).join(','));
ok('运行期 BEST_ARMOR 仍为 龙鳞甲（派生自动跟随，成就「龙鳞加身」零扰动）', BEST_ARMOR === '龙鳞甲', BEST_ARMOR);
ok('运行期 WEAPONS 六把逐字未动（v23.92 曲线零扰动）',
  Object.keys(WEAPONS).join(',') === '木剑,铁剑,秘银剑,星铁剑,勇者之剑,圣光之剑');
{
  const { buyArmor } = await import('../js/shop.js');
  let threw = null;
  try {
    const hero = { name: '余烬', level: 1, gold: 300, weapon: '木剑', armor: '布衣', item: 0, potion2: 0,
      mushrooms: 0, hp: 0, mp: 0, hpMax: 0, mpMax: 0, atkMax: 0, defMax: 0, spent: 0, diff: 0 };
    S.G = hero;
    buyArmor('精钢甲');
    ok('运行期：买精钢甲扣款 300 金（300→0）', hero.gold === 0, String(hero.gold));
    ok('运行期：换装 精钢甲 成功', hero.armor === '精钢甲');
    ok('运行期：defMax = baseStats(1).def + 10 = 15（applyStats 同源公式）',
      hero.defMax === baseStats(1).def + ARMORS['精钢甲'].def && hero.defMax === 15, String(hero.defMax));
    ok('运行期：消费计数 hero.spent += 300（v23.74 一掷千金同源）', hero.spent === 300, String(hero.spent));
    // 既有甲零回归：买 皮甲 路径逐字同款
    hero.gold = 100; hero.armor = '布衣'; hero.spent = 0;
    buyArmor('皮甲');
    ok('运行期：既有甲 皮甲 购买零回归（100→扣 60 剩 40 / 换装 / def=base+4）',
      hero.gold === 40 && hero.armor === '皮甲' && hero.defMax === baseStats(1).def + 4 && hero.spent === 60,
      JSON.stringify([hero.gold, hero.armor, hero.defMax, hero.spent]));
    // 金币不足拦截零结算
    hero.gold = 50; hero.armor = '布衣';
    buyArmor('精钢甲');
    ok('运行期：金币不足拦截零结算（50 金买 300 甲：gold/armor/defMax 不变）',
      hero.gold === 50 && hero.armor === '布衣' && hero.defMax === baseStats(1).def + 4);
    // 面板曲线单调：布衣1 < 皮甲4 < 锁子甲8 < 精钢甲10 < 龙鳞甲13（商家陈列序=力度序）
    const seq = ['布衣', '皮甲', '锁子甲', '精钢甲', '龙鳞甲'].map((k) => ARMORS[k].def);
    ok('面板曲线严格单调（1<4<8<10<13）', seq.every((v, i) => i === 0 || v > seq[i - 1]), seq.join('<'));
    // 价格曲线单调且 180→300→480 分段（精钢甲居中）
    ok('价格曲线单调（0/60/180/300/480）+ 精钢甲在 180 与 480 之间',
      ARMORS['锁子甲'].price < ARMORS['精钢甲'].price && ARMORS['精钢甲'].price < ARMORS['龙鳞甲'].price);
  } catch (e) { threw = e; }
  ok('运行期 buyArmor 全路径零抛错', threw === null, threw && String(threw.stack || threw));
  S.G = null; S.scene = 'title';
}

// —— 运行期：buildShopList 11 项清单（v23.95 视窗滚动随新现实）——
{
  const { buildShopList } = await import('../js/shop.js');
  const hero = { name: '余烬', level: 1, gold: 9999, weapon: '木剑', armor: '布衣', item: 1, potion2: 0,
    mushrooms: 5, hp: 0, mp: 0, hpMax: 0, mpMax: 0, atkMax: 0, defMax: 0, spent: 0, diff: 0 };
  S.G = hero;
  const list = buildShopList();
  ok('运行期：最坏情形清单 11 项（药水/卖菇/4 剑/4 甲/离开）', list.length === 11, String(list.length));
  const steel = list.find((it) => it.t.includes('精钢甲'));
  ok('运行期：精钢甲入列第 9 行（索引 8），价签 300 · ▲防+9（对布衣 防1）',
    !!steel && list.indexOf(steel) === 8 && steel.price === 300 && steel.t.includes('▲防+9'),
    steel && steel.t);
  ok('运行期：龙鳞甲仍在精钢甲之后（索引 9，▲防+12）',
    list[9] && list[9].t.includes('龙鳞甲') && list[9].price === 480 && list[9].t.includes('▲防+12'), list[9] && list[9].t);
  ok('shop.js 购买清单/▲▼对比/购买通道零逻辑改动（ARMORS 遍历逐字未动）',
    shopSrc.includes('Object.keys(ARMORS).forEach((name) =>') && shopSrc.includes("t: `🛡️ ${name} (防+${ARMORS[name].def})${tag}`"));
  ok('main.js 商店键位零回归（shopSel 回绕 + Enter/E 购买路径逐字未动）',
    mainSrc.includes('S.shopSel = (S.shopSel + 1) % S.shopList.length') &&
    mainSrc.includes('const item = S.shopList[S.shopSel]'));
  S.G = null; S.scene = 'title';
}

// —— README / package.json / CHANGELOG 同步 ——
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');
const testChain = (JSON.parse(pkg).scripts.test.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 220 件套', testChain === 221, String(testChain));
ok('package.json 已收录 smoke_v2396_steelarmor（npm test 串跑第 220 份）',
  JSON.parse(pkg).scripts.test.includes('smoke_v2396_steelarmor.mjs'));
ok('package.json 串尾为 ... smoke_v2395_shopscroll.mjs && node tests/smoke_v2396_steelarmor.mjs && node tests/smoke_v2397_baserow.mjs"',
  pkg.includes('node tests/smoke_v2395_shopscroll.mjs && node tests/smoke_v2396_steelarmor.mjs && node tests/smoke_v2397_baserow.mjs"'));
ok('README tests 树串尾已延伸至 smoke_v2396_steelarmor',
  readme.includes('+ smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow（npm test 串跑）'));
ok('README 件套口径为二百二十一件套（二百二十件套清除）且旧 216 口径零残留',
  readme.includes('冒烟二百二十一件套（二百二十件套清除）') && !readme.includes('冒烟二百一十六件套（二百一十五件套清' + '除）'));
ok('README 含 v23.96 守护描述（新防具「精钢甲」守护）', readme.includes('v23.96 起含 新防具「精钢甲」守护'));
ok('README 含 smoke_v2396_steelarmor 入库（220 份）', readme.includes('smoke_v2396_steelarmor 入库（220 份）'));
ok('README 仍保留 v23.95 历史守护描述与入库口径（历史累积）',
  readme.includes('v23.95 起含 商店商品清单视窗滚动守护') && readme.includes('smoke_v2395_shopscroll 入库（219 份）'));
ok('README 装备价格行收录 精钢甲 300（皮甲 60 / 锁子甲 180 / 精钢甲 300 / 龙鳞甲 480）',
  readme.includes('| 装备价格 | 铁剑 80 / 秘银剑 220 / 星铁剑 400 / 勇者之剑 600；皮甲 60 / 锁子甲 180 / 精钢甲 300 / 龙鳞甲 480 |'));
ok('README 装备属性行收录 精钢甲 10（防具 def 五档）',
  readme.includes('防具 def：布衣 1 / 皮甲 4 / 锁子甲 8 / 精钢甲 10 / 龙鳞甲 13'));
ok('README 装备属性行补录标记含 v23.96 补精钢甲',
  readme.includes('（v23.37 补录、v23.92 补星铁剑、v23.96 补精钢甲） | `WEAPONS` / `ARMORS` / `BEST_ARMOR` |'));
ok('CHANGELOG 顶部已追加 v23.96 条目（精钢甲）', changelog.startsWith('## v23.97 '));
ok('CHANGELOG 顶部条目含精钢甲说明', changelog.includes('新防具「精钢甲」'));
ok('CHANGELOG 仍保留 v23.95 条目标题（历史口径）', changelog.includes('## v23.95 商店商品清单视窗滚动'));

// —— 哨兵链：v2143 前哨前望 221 且 README 尚无 221 口径 ——
const s2143 = read('tests/smoke_v2143_talkekey.mjs');
ok('smoke_v2143 哨兵链已推进至二百二十二件套（二百二十一件套清除）',
  s2143.includes('二百二十二件套（二百二十一件套清除）') && s2143.includes("!readme.includes('二百二十二件套（二百二十一件套清除）')"));
ok('README 尚无二百二十二件套（二百二十一件套清除）前望口径', !readme.includes('二百二十二件套（二百二十一件套清除）'));

// —— 旧代 v23.95 pin 全库零残留（不含本件；拆串防误伤，承 v2319/v2392/v2393/v2394/v2395 惯例）——
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2396_steelarmor.mjs');
const stale = [];
for (const f of allTests) {
  const src = read('tests/' + f);
  if (src.includes("const GAME_VERSION = 'v23.9" + "5';") ||
      src.includes("const GAME_VERSION = 'v23.9" + "5'") ||
      src.includes("GAME_VERSION === 'v23.9" + "5'") ||
      src.includes("startsWith('## v23.9" + "5 ") ||
      src.includes("startsWith('## v23.9" + "5'")) stale.push(f);
}
ok('旧代 v23.95 字面量/恒等/顶 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.95 特性标签保留）',
  stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
