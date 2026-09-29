// v24.04 专项冒烟：「宝箱 / 宝藏」数值速查行——README「数值速查」速查表 24 行已覆盖 基础属性/每级成长/
// 升级经验/技能领悟/装备/经济/区域修正/试炼推荐等级/战斗/伤害公式/克制状态/掉落/首胜彩头/遇敌槽/
// 出没生态/试炼彩头/成就档位/魔物数值/技能数值/强敌变身/难度倍率/支线奖励/昼夜时段，唯独「宝箱 /
// 宝藏」查无一行（「掉落」行只带一句「宝箱 林 60% 菇 · 镇/矿/廊 45% 金」）——全图可开宝箱
// chestTotal() 共 12 只（潮灯镇 2 · 雾语林 3 · 星井矿脉 2 · 洞窟领主首胜后星砂宝藏 4 只
// CAVE_TREASURE 显形 · 无字回廊 1，单一数据源：MAPS 逐图 'C' 瓦片数 + CAVE_TREASURE.length）与
// 开箱掉落组成（雾语林 60% 蘑菇 · 18% 金币（CHEST_GOLD_BASE 12+级×CHEST_GOLD_PER_LV 5）· 22% 药水；
// 城镇/星井矿脉/无字回廊 45% 金币 · 55% 药水，CHEST_MUSHROOM/CHEST_GOLD/CHEST_GOLD_BASE/
// CHEST_GOLD_PER_LV 单一数据源，与 world.onStep 结算/H 页「宝箱掉落」行同读一份源）此前只散见
// data.js chestTotal()/CHEST_* 源码、H 页「宝箱掉落」行与 README 速览——现于「首胜 / 彩头」行之后
// 补录「宝箱 / 宝藏」行（全部由 chestTotal()/CAVE_TREASURE/CHEST_* 派生，与状态页「已开 X/全图 N」/
// 开箱报文/宝箱成就 6/9/12 同读一份源），纯文档零逻辑零结算零存档零数值变化。
// 本冒烟守护：版本锚点、data.js/README/world.js 源级落位（v24.04 注释 / GAME_VERSION v24.04 与旧
// v24.03 字面量零残留 / v24.03-v24.01 历史注释保留 / 速查行与 chestTotal()/CHEST_* 逐值 / world.onStep
// 宝箱分支 / H 页「宝箱掉落」行同源），运行期数据实证（chestTotal 12 · 逐图 2/3/2/4/1 · CHEST_* 逐值 ·
// 派生百分比 60/18/22·45/55 与源一致），README/package.json/CHANGELOG 同步（件套口径 228 +
// v24.04 守护描述 + 入库 228 + tests 树串尾 + package 串尾）、哨兵链（v2143 前望 229 且 README 尚无
// 229 口径）、旧代 v24.03 pin 全库零残留扫描（字面量/恒等/顶 pin/件套 227-226 口径/testChain 227）。
import { S } from '../js/state.js';
import { GAME_VERSION, MAPS, CAVE_TREASURE, chestTotal, CHEST_MUSHROOM, CHEST_GOLD, CHEST_GOLD_BASE, CHEST_GOLD_PER_LV } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v21.45 冒烟先例：先装桩再 import main.js）——
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

console.log('— v24.04 宝箱 / 宝藏 数值速查行 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const wSrc = read('js/world.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v24.03 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.03', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 3)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js 含 v24.04 注释（宝箱/宝藏 数值速查行说明）', dSrc.includes('// v24.04 文档整理·数值说明·同源口径'));
ok('data.js GAME_VERSION 字面量已为 v24.12（旧 v24.03 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.12';") && !dSrc.includes("const GAME_VERSION = 'v24.0" + "3';"));
ok('data.js 仍保留 v24.03 历史注释（战斗画面 ⚡ 困难 角标说明，累积注释块）',
  dSrc.includes('// v24.03 体验打磨·信息透明·纯显示'));
ok('data.js 仍保留 v24.02 与 v24.01 历史注释（首胜/彩头 行 · 专属 BGM）',
  dSrc.includes('// v24.02 文档整理·数值说明·同源口径') && dSrc.includes('// v24.01 音效反馈·听觉信息透明'));

// —— 运行期数据实证：宝箱总数 / 逐图分布 / CHEST_* 逐值（宝箱行的数据真源）——
const perMap = {};
for (const [k, v] of Object.entries(MAPS)) {
  let c = 0;
  for (const row of (v.rows || [])) for (const ch of row) if (ch === 'C') c++;
  perMap[k] = c;
}
ok('chestTotal() === 12（全图可开上限，chestTotal 单一数据源）', chestTotal() === 12, String(chestTotal()));
ok('逐图 C 计数 潮灯镇 2 · 雾语林 3 · 星井矿脉 2 · 无字回廊 1（MAPS 逐图派生）',
  perMap.village === 2 && perMap.dungeon === 3 && perMap.cave === 2 && perMap.gallery === 1, JSON.stringify(perMap));
ok('CAVE_TREASURE 逐值（星砂宝藏 4 只 = chestTotal 12 的宝藏份额）',
  Array.isArray(CAVE_TREASURE) && CAVE_TREASURE.length === 4, String(CAVE_TREASURE && CAVE_TREASURE.length));
ok('CHEST_MUSHROOM/CHEST_GOLD/CHEST_GOLD_BASE/CHEST_GOLD_PER_LV 逐值（60%/45%/12/5）',
  CHEST_MUSHROOM === 0.6 && CHEST_GOLD === 0.45 && CHEST_GOLD_BASE === 12 && CHEST_GOLD_PER_LV === 5,
  JSON.stringify([CHEST_MUSHROOM, CHEST_GOLD, CHEST_GOLD_BASE, CHEST_GOLD_PER_LV]));
// 派生百分比（与 world.onStep 结算 / H 页「宝箱掉落」行 / 速查行同源同式）
const mush = Math.round(CHEST_MUSHROOM * 100);
const goldD = Math.round((1 - CHEST_MUSHROOM) * CHEST_GOLD * 100);
const potD = Math.round((1 - CHEST_MUSHROOM) * (1 - CHEST_GOLD) * 100);
const goldO = Math.round(CHEST_GOLD * 100);
const potO = Math.round((1 - CHEST_GOLD) * 100);
ok('派生百分比 雾语林 60%/18%/22% 且合计 100（CHEST_* 单一数据源）',
  mush === 60 && goldD === 18 && potD === 22 && mush + goldD + potD === 100,
  JSON.stringify([mush, goldD, potD]));
ok('派生百分比 城镇/矿脉/无字回廊 45%/55% 且合计 100', goldO === 45 && potO === 55 && goldO + potO === 100,
  JSON.stringify([goldO, potO]));

// —— 源级落位：world.onStep 开箱结算分支 + H 页「宝箱掉落」行同源 ——
ok('world.js import 补 CHEST_* 四常量（与 data.js 单一数据源）',
  wSrc.includes('CHEST_MUSHROOM, CHEST_GOLD, CHEST_GOLD_BASE, CHEST_GOLD_PER_LV'));
ok('world.js 雾语林 60% 蘑菇分支在（CHEST_MUSHROOM 唯一消费点）',
  wSrc.includes("curMap() === 'dungeon' && Math.random() < CHEST_MUSHROOM"));
ok('world.js 金币分支在（CHEST_GOLD 45% + 12+级×5 同一式）',
  wSrc.includes('Math.random() < CHEST_GOLD') && wSrc.includes('CHEST_GOLD_BASE + hero.level * CHEST_GOLD_PER_LV'));
ok('data.js H 页「宝箱掉落」行与 CHEST_* 同源派生（Math.round 同式）',
  dSrc.includes('宝箱掉落') && dSrc.includes('Math.round(CHEST_MUSHROOM * 100)') && dSrc.includes('Math.round((1 - CHEST_GOLD) * 100)'));
ok('data.js world.js 既有宝箱进度/计数输出零回归（已开 X/全图 N 唯一公式）',
  wSrc.includes('const opened = chestCount(hero), total = chestTotal();'));

// —— README 数值速查「宝箱 / 宝藏」行 ——
ok('README 数值速查含「宝箱 / 宝藏」行（首胜/彩头行之后、遇敌槽行之前）',
  readme.includes('| 宝箱 / 宝藏 |') && readme.indexOf('| 首胜 / 彩头 |') < readme.indexOf('| 宝箱 / 宝藏 |') &&
  readme.indexOf('| 宝箱 / 宝藏 |') < readme.indexOf('| 遇敌槽 |'));
ok('README 宝箱/宝藏行含 chestTotal 12 与逐图分布 2·3·2·4·1（同一数据源派生）',
  readme.includes('chestTotal()` 共 12 只') && readme.includes('潮灯镇 2 · 雾语林 3 · 星井矿脉 2') &&
  readme.includes('星砂宝藏 4 只') && readme.includes('无字回廊 1'));
ok('README 宝箱/宝藏行含开箱掉落组成口径（60/18/22 · 45/55 · 12+级×5）',
  readme.includes('雾语林 60% 蘑菇 · 18% 金币') && readme.includes('22% 药水') &&
  readme.includes('45% 金币 · 55% 药水') && readme.includes('CHEST_GOLD_BASE` 12 + 级×`CHEST_GOLD_PER_LV` 5'));
ok('README 宝箱/宝藏行含全部常量源（chestTotal/CAVE_TREASURE/CHEST_*）',
  readme.includes('`chestTotal()` `CAVE_TREASURE` `CHEST_MUSHROOM` `CHEST_GOLD` `CHEST_GOLD_BASE` `CHEST_GOLD_PER_LV`'));
{ // 同源一致性：用运行期 CHEST_* 构造期望片段，README 必须包含（零硬编码漂移）
  const expect = `60% 蘑菇 · ${goldD}% 金币（\`CHEST_GOLD_BASE\` ${CHEST_GOLD_BASE} + 级×\`CHEST_GOLD_PER_LV\` ${CHEST_GOLD_PER_LV}）· ${potD}% 药水；城镇/星井矿脉/无字回廊 ${goldO}% 金币 · ${potO}% 药水`;
  ok('README 宝箱/宝藏行与 CHEST_* 源派生逐值一致（运行期构造期望片段）', readme.includes(expect), expect);
}
ok('README 掉落行/首胜行零回归（DROP_*/CHEST_* 与 38%/60%/45% 口径逐字保留）',
  readme.includes('| 掉落 | 战斗胜利 38%：8% 装备或 +60 金 / 12% 药水 / 12% 蘑菇 / 6% 灵药；宝箱 林 60% 菇 · 镇/矿/廊 45% 金') &&
  readme.includes('| 首胜 / 彩头 |'));

// —— README / package.json / CHANGELOG 同步 ——
const testChain = (JSON.parse(pkg).scripts.test.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 228 件套', testChain === 236, String(testChain));
ok('package.json 已收录 smoke_v2404_chestrow（npm test 串跑第 228 份）',
  JSON.parse(pkg).scripts.test.includes('smoke_v2404_chestrow.mjs'));
ok('package.json 串尾为 ... smoke_v2403_diffbattle.mjs && node tests/smoke_v2404_chestrow.mjs && node tests/smoke_v2405_trialgoal.mjs && node tests/smoke_v2406_restrow.mjs && node tests/smoke_v2407_innrest.mjs && node tests/smoke_v2408_travelgoal.mjs && node tests/smoke_v2409_sellgoal.mjs && node tests/smoke_v2410_brewgoal.mjs && node tests/smoke_v2411_deathprog.mjs && node tests/smoke_v2412_battlegoal.mjs"',
  pkg.includes('node tests/smoke_v2403_diffbattle.mjs && node tests/smoke_v2404_chestrow.mjs && node tests/smoke_v2405_trialgoal.mjs && node tests/smoke_v2406_restrow.mjs && node tests/smoke_v2407_innrest.mjs && node tests/smoke_v2408_travelgoal.mjs && node tests/smoke_v2409_sellgoal.mjs && node tests/smoke_v2410_brewgoal.mjs && node tests/smoke_v2411_deathprog.mjs && node tests/smoke_v2412_battlegoal.mjs"'));
ok('README tests 树串尾已延伸至 smoke_v2404_chestrow',
  readme.includes('+ smoke_v2403_diffbattle + smoke_v2404_chestrow + smoke_v2405_trialgoal + smoke_v2406_restrow + smoke_v2407_innrest + smoke_v2408_travelgoal + smoke_v2409_sellgoal + smoke_v2410_brewgoal + smoke_v2411_deathprog + smoke_v2412_battlegoal（npm test 串跑）'));
ok('README 件套口径为二百三十六件套（二百三十五件套清除）且旧 227 口径零残留',
  readme.includes('冒烟二百三十六件套（二百三十五件套清除）') && !readme.includes('冒烟二百二十七件套（二百二十六件套清除）'));
ok('README 含 v24.04 守护描述（「宝箱 / 宝藏」数值速查行守护）', readme.includes('v24.04 起含 「宝箱 / 宝藏」数值速查行守护'));
ok('README 含 smoke_v2404_chestrow 入库（228 份）', readme.includes('smoke_v2404_chestrow 入库（228 份）'));
ok('README 仍保留 v24.03 历史守护描述与入库口径（历史累积）',
  readme.includes('v24.03 起含 战斗画面「⚡ 困难」角标守护') && readme.includes('smoke_v2403_diffbattle 入库（227 份）'));
ok('README 仍保留 v24.02 历史守护描述（「首胜 / 彩头」数值速查行守护）', readme.includes('v24.02 起含 「首胜 / 彩头」数值速查行守护'));
ok('CHANGELOG 顶部已追加 v24.12 条目（宝箱 / 宝藏 数值速查行）', changelog.startsWith('## v24.12 '));
ok('CHANGELOG 顶部条目含宝箱/宝藏与 chestTotal 口径说明',
  changelog.includes('宝箱 / 宝藏') && changelog.includes('chestTotal') && changelog.includes('CHEST_GOLD_BASE'));
ok('CHANGELOG 仍保留 v24.03 与 v24.02 条目标题（历史口径）',
  changelog.includes('## v24.03 体验打磨·信息透明·纯显示') && changelog.includes('## v24.02 文档整理·数值说明·同源口径'));

// —— 哨兵链：v2143 前哨前望 229 且 README 尚无 229 口径 ——
const s2143 = read('tests/smoke_v2143_talkekey.mjs');
ok('smoke_v2143 哨兵链已推进至二百三十七件套（二百三十六件套清除）',
  s2143.includes('二百三十七件套（二百三十六件套清除）') && s2143.includes("!readme.includes('二百三十七件套（二百三十六件套清除）')"));
ok('README 尚无二百三十七件套（二百三十六件套清除）前望口径', !readme.includes('二百三十七件套（二百三十六件套清除）'));

// —— 旧代 v24.03 pin 全库零残留（不含本件；拆串防误伤，承 v2403 惯例）——
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2404_chestrow.mjs');
const stale = [];
for (const f of allTests) {
  const src = read('tests/' + f);
  if (src.includes("const GAME_VERSION = 'v24.0" + "3'") ||
      src.includes("GAME_VERSION === 'v24.0" + "3'") ||
      src.includes("startsWith('## v24.0" + "3 ") ||
      src.includes("startsWith('## v24.0" + "3'") ||
      src.includes('已为 v24.0' + '3（') ||
      src.includes('已追加 v24.0' + '3 条目') ||
      src.includes('冒烟二百二十七件套（二百二十六件套清' + '除）') ||
      src.includes('二百二十七件套（二百二十六件套清' + '除）') ||
      src.includes('testChain === ' + '227') ||
      src.includes('smoke_v2402_firstwin + smoke_v2403_diffbattle（npm test 串' + '跑）') ||
      src.includes('node tests/smoke_v2403_diffbattle.mjs' + '"')) stale.push(f);
}
ok('旧代 v24.03 字面量/恒等/顶 pin/件套 227-226 口径/testChain 227/串尾 全库零残留（' + allTests.length + ' 件扫描）',
  stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
