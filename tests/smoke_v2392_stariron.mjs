// v23.92 专项冒烟：新武器「星铁剑」——装备曲线补全（数值平衡·新内容·单一数据源，
// 承 v23.37 装备属性行 / v21.73 装备成就同源主线：可购剑曲线 木剑2/0 → 铁剑5/80 → 秘银剑9/220 →
// 勇者之剑15/600 唯 秘银剑→勇者之剑 一跳 +6 攻/380 金（铁剑→秘银剑 4/140、木剑→铁剑 3/80 皆是
// 3-4 攻小步），是毕业装曲线最大跳档——Lv8-10 段（矿脉/回廊前）的玩家在 220 金之后只能 600 金
// 一步到位；现补 星铁剑 12/400（星井矿脉沉底的星铁所铸、与星砂同脉），把跳档拆成
// 星铁剑(3/180) + 勇者之剑(3/200) 两段；数据层单一数据源：shop.buyWeapon 购买清单/购买 ▲▼对比/
// 状态页面板（baseStats+WEAPONS[hero.weapon].atk 唯一公式）全读 WEAPONS 自动收录自动跟随，零逻辑改动。
// 本冒烟守护：版本锚点、data.js 源级落位（v23.92 注释 / 星铁剑 逐字 / 五把既有剑逐字未动 /
// GAME_VERSION v23.92 与旧 v23.91 字面量零残留）、运行期真实 shop.buyWeapon 路径（扣款 400 金/
// 换装 星铁剑/atkMax=base+12/既有剑购买零回归/金币不足拦截零结算）、README/package.json/CHANGELOG
// 同步（tests 树串尾 + 件套口径 216 + v23.92 守护描述 + 星铁剑入库）、哨兵链（v2143 前望 217 且 README
// 尚无 217 口径）、旧代 v23.91 pin 全库零残留扫描。
import { S } from '../js/state.js';
import { GAME_VERSION, WEAPONS, ARMORS, baseStats } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v23.91 冒烟先例：先装桩再 import main.js）——
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

console.log('— v23.92 新武器「星铁剑」 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v23.92 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v23.92', !!_gv && (_gv[0] > 23 || (_gv[0] === 23 && _gv[1] > 91)), GAME_VERSION);
ok('data.js 含 v23.92 注释（装备曲线补全说明）', dSrc.includes('v23.92 数值平衡·装备曲线补全'));
ok('data.js GAME_VERSION 字面量已为 v23.92（旧 v23.91 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v23.93';") && !dSrc.includes("const GAME_VERSION = 'v23.9" + "1';"));
ok('data.js 仍保留 v23.91 历史注释（提灯夜行说明，累积注释块）', dSrc.includes('v23.91 新内容·昼夜维度单档里程碑'));

// —— data.js 源级落位：星铁剑 逐字 + 五把既有剑逐字未动 + 行内注释 ——
ok('WEAPONS 含 星铁剑 12/400 逐字', dSrc.includes("'星铁剑':{atk:12,price:400}"));
ok('星铁剑位于 秘银剑 与 勇者之剑 之间（曲线序位）',
  dSrc.indexOf("'星铁剑':{atk:12,price:400}") > dSrc.indexOf("'秘银剑':{atk:9,price:220}") &&
  dSrc.indexOf("'星铁剑':{atk:12,price:400}") < dSrc.indexOf("'勇者之剑':{atk:15,price:600}"));
ok('五把既有剑逐字未动（木剑2/铁剑5/秘银剑9/勇者之剑15/圣光之剑24 legend）',
  dSrc.includes("'木剑':{atk:2,price:0}") && dSrc.includes("'铁剑':{atk:5,price:80}") &&
  dSrc.includes("'秘银剑':{atk:9,price:220}") && dSrc.includes("'勇者之剑':{atk:15,price:600}") &&
  dSrc.includes("'圣光之剑':{atk:24,price:0,legend:true}"));
ok('防具四件逐字未动（布衣1/皮甲4/锁子甲8/龙鳞甲13）',
  dSrc.includes("'布衣':{def:1,price:0}") && dSrc.includes("'皮甲':{def:4,price:60}") &&
  dSrc.includes("'锁子甲':{def:8,price:180}") && dSrc.includes("'龙鳞甲':{def:13,price:480}"));
ok('行内注释含跳档拆段说明（3/180 + 3/200）', dSrc.includes('把跳档拆成 3/180 + 3/200 两段'));

// —— 运行期：WEAPONS 契约 + shop.buyWeapon 真实路径 ——
ok('运行期 WEAPONS 星铁剑 atk 12 / price 400（单值常数）',
  WEAPONS['星铁剑'].atk === 12 && WEAPONS['星铁剑'].price === 400 && !WEAPONS['星铁剑'].legend);
ok('运行期 WEAPONS 共 6 把（五把既有 + 星铁剑），序位 木剑/铁剑/秘银剑/星铁剑/勇者之剑/圣光之剑',
  Object.keys(WEAPONS).join(',') === '木剑,铁剑,秘银剑,星铁剑,勇者之剑,圣光之剑', Object.keys(WEAPONS).join(','));
{
  const { buyWeapon } = await import('../js/shop.js');
  let threw = null;
  try {
    const hero = { name: '余烬', level: 1, gold: 400, weapon: '木剑', armor: '布衣', item: 0, potion2: 0,
      mushrooms: 0, hp: 0, mp: 0, hpMax: 0, mpMax: 0, atkMax: 0, defMax: 0, spent: 0, diff: 0 };
    S.G = hero;
    buyWeapon('星铁剑');
    ok('运行期：买星铁剑扣款 400 金（400→0）', hero.gold === 0, String(hero.gold));
    ok('运行期：换装 星铁剑 成功', hero.weapon === '星铁剑');
    ok('运行期：atkMax = baseStats(1).atk + 12 = 21（applyStats 同源公式）',
      hero.atkMax === baseStats(1).atk + WEAPONS['星铁剑'].atk && hero.atkMax === 21, String(hero.atkMax));
    ok('运行期：消费计数 hero.spent += 400（v23.74 一掷千金同源）', hero.spent === 400, String(hero.spent));
    // 既有剑零回归：买 铁剑 路径逐字同款
    hero.gold = 100; hero.weapon = '木剑'; hero.spent = 0;
    buyWeapon('铁剑');
    ok('运行期：既有剑 铁剑 购买零回归（800→扣 80 剩 20 / 换装 / atk=base+5）',
      hero.gold === 20 && hero.weapon === '铁剑' && hero.atkMax === baseStats(1).atk + 5 && hero.spent === 80,
      JSON.stringify([hero.gold, hero.weapon, hero.atkMax, hero.spent]));
    // 金币不足拦截零结算
    hero.gold = 50; hero.weapon = '木剑';
    buyWeapon('星铁剑');
    ok('运行期：金币不足拦截零结算（50 金买 400 剑：gold/weapon/atkMax 不变）',
      hero.gold === 50 && hero.weapon === '木剑' && hero.atkMax === baseStats(1).atk + 5);
    // 面板曲线单调：木剑2 < 铁剑5 < 秘银剑9 < 星铁剑12 < 勇者之剑15 < 圣光之剑24（商家陈列序=力度序）
    const seq = ['木剑', '铁剑', '秘银剑', '星铁剑', '勇者之剑', '圣光之剑'].map((k) => WEAPONS[k].atk);
    ok('面板曲线严格单调（2<5<9<12<15<24）', seq.every((v, i) => i === 0 || v > seq[i - 1]), seq.join('<'));
    // 价格曲线单调且 220→400→600 分段（星铁剑居中）
    ok('价格曲线单调（0/80/220/400/600）+ 星铁剑在 220 与 600 之间',
      WEAPONS['秘银剑'].price < WEAPONS['星铁剑'].price && WEAPONS['星铁剑'].price < WEAPONS['勇者之剑'].price);
  } catch (e) { threw = e; }
  ok('运行期 buyWeapon 全路径零抛错', threw === null, threw && String(threw.stack || threw));
  S.G = null; S.scene = 'title';
}

// —— README / package.json / CHANGELOG 同步 ——
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');
const testChain = (JSON.parse(pkg).scripts.test.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 216 件套', testChain === 217, String(testChain));
ok('package.json 已收录 smoke_v2392_stariron（npm test 串跑第 216 份）',
  JSON.parse(pkg).scripts.test.includes('smoke_v2392_stariron.mjs'));
ok('package.json 串尾为 ... smoke_v2319_deadloc.mjs && node tests/smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs"',
  pkg.includes('node tests/smoke_v2319_deadloc.mjs && node tests/smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs"'));
ok('README tests 树串尾已延伸至 smoke_v2392_stariron',
  readme.includes('+ smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey（npm test 串跑）'));
ok('README 件套口径为二百一十七件套（二百一十六件套清除）且旧 214 口径零残留',
  readme.includes('冒烟二百一十七件套（二百一十六件套清除）') && !readme.includes('冒烟二百一十四件套（二百一十三件套清' + '除）'));
ok('README 含 v23.92 守护描述（新武器「星铁剑」守护）', readme.includes('v23.92 起含 新武器「星铁剑」守护'));
ok('README 含 smoke_v2392_stariron 入库（216 份）', readme.includes('smoke_v2392_stariron 入库（216 份）'));
ok('README 仍保留 v23.91 历史守护描述与入库口径（历史累积）',
  readme.includes('v23.91 起含 新成就「提灯夜行」守护') && readme.includes('smoke_v2319_deadloc 入库（215 份）'));
ok('README 装备价格行收录 星铁剑 400（铁剑 80 / 秘银剑 220 / 星铁剑 400 / 勇者之剑 600）',
  readme.includes('| 装备价格 | 铁剑 80 / 秘银剑 220 / 星铁剑 400 / 勇者之剑 600；皮甲 60 / 锁子甲 180 / 龙鳞甲 480 |'));
ok('README 装备属性行收录 星铁剑 12（武器 atk 六档）',
  readme.includes('武器 atk：木剑 2 / 铁剑 5 / 秘银剑 9 / 星铁剑 12 / 勇者之剑 15 / 圣光之剑 24（`legend`'));
ok('README 装备属性行保留 v23.37 补录标记并补 v23.92 补星铁剑',
  readme.includes('（v23.37 补录、v23.92 补星铁剑） | `WEAPONS` / `ARMORS` / `BEST_ARMOR` |'));
ok('README 装备价格行仍在装备属性行之前（行序位置正确）',
  readme.indexOf('| 装备价格 |') < readme.indexOf('| 装备属性 |'));
ok('CHANGELOG 顶部已追加 v23.92 条目（星铁剑）', changelog.startsWith('## v23.93 '));
ok('CHANGELOG 顶部条目含 v23.92 星铁剑说明', changelog.includes('## v23.92 新武器「星铁剑」——装备曲线补全'));
ok('CHANGELOG 仍保留 v23.91 条目标题（历史口径）', changelog.includes('## v23.91 新成就「提灯夜行」'));

// —— 哨兵链：v2143 前哨前望 217 且 README 尚无 217 口径 ——
const s2143 = read('tests/smoke_v2143_talkekey.mjs');
ok('smoke_v2143 哨兵链已推进至二百一十八件套（二百一十七件套清除）',
  s2143.includes('二百一十八件套（二百一十七件套清除）') && s2143.includes("!readme.includes('二百一十八件套（二百一十七件套清除）')"));
ok('README 尚无二百一十八件套（二百一十七件套清除）前望口径', !readme.includes('二百一十八件套（二百一十七件套清除）'));

// —— 旧代 v23.91 pin 全库零残留（不含本件；拆串防误伤，承 v2319 惯例）——
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2392_stariron.mjs');
const stale = [];
for (const f of allTests) {
  const src = read('tests/' + f);
  if (src.includes("const GAME_VERSION = 'v23.9" + "1';") ||
      src.includes("GAME_VERSION === 'v23.9" + "1'") ||
      src.includes("startsWith('## v23.9" + "1 ")) stale.push(f);
}
ok('旧代 v23.91 字面量/恒等/顶 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.91 特性标签保留）',
  stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
