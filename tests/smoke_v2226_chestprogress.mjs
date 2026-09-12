// v22.26 专项冒烟：宝箱开启反馈追加「已开 X/全图 N」进度——体验打磨·信息透明·纯显示（承 v19.93 宝箱
// 蘑菇任务进度 / v21.22 状态页「已开 X/全图 N · 成就 X/M」双口径同一主线）：world.onChestStep 三条开箱
// 报文（蘑菇/金币/药水）由只报本次所得与库存补「已开 ${opened}/${total}」，opened/total 与状态页同读
// data.js chestCount/chestTotal 一份单一数据源（chestCount Set/数组/缺失三形态防御式、chestTotal 由
// MAPS 'C' 瓦片 + CAVE_TREASURE 派生）。
// 本冒烟守护：版本锚点、world.js 源级落位（import 追加 + 三处新报文 + 旧报文零残留）、数据契约
// （CHEST_* 逐值 / chestTotal===12 / chestCount 三形态）、运行期三档（蘑菇 60%/金币 45%/药水 22% 强制
// Math.random 序列）逐字报文与库存/金币/蘑菇结算一致 + 已开箱格再踩不重复计数 + MUSHROOM_GOAL 任务
// 进度后缀零回归（未接支线不显示）、README/package.json/CHANGELOG 同步（tests 树尾 + 件套 122 +
// v22.26 守护描述 + 入库 122 份 + testChain===122）、姊妹件套 pin（v2225..v2215 随新现实更新 + 串尾
// pin）复查 + 旧代 v22.25 字面量/恒等/件套/树尾 pin 零残留。
import { S } from '../js/state.js';
import { GAME_VERSION, TY, CHEST_MUSHROOM, CHEST_GOLD, CHEST_GOLD_BASE, CHEST_GOLD_PER_LV, chestCount, chestTotal } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v22.25 冒烟先例：先装桩再 import main.js）——
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
const { STEP_HANDLERS } = await import('../js/world.js');
const { SFX } = await import('../js/audio.js');
const { bind } = await import('../js/bind.js');
// 音效桩：开箱路径会调 SFX.item/coin，测试只关心报文与结算
SFX.item = () => {}; SFX.coin = () => {}; SFX.levelup = () => {};
// 报文间谍：直接捕获 bind.boxMsg 调用（绕开消息队列定时器，逐条精确）
let lastMsg = '';
bind.boxMsg = (t) => { lastMsg = t; };

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.26 宝箱开启反馈宝箱进度 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const wSrc = fs.readFileSync(path.join(ROOT, 'js/world.js'), 'utf8');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.25 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.25', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 26)), GAME_VERSION);
ok('data.js 含 v22.26 注释（宝箱开启反馈追加进度）', dSrc.includes('v22.26 宝箱开启反馈追加进度'));
ok('GAME_VERSION 字面量已为 v22.26（旧 v22.25 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v22.31';") && !dSrc.includes("const GAME_VERSION = 'v22." + "25';"));
ok('data.js 仍保留 v22.25 历史注释（累积注释块，姊妹 pin 不失效）', dSrc.includes('v22.25 无字回廊新风味 NPC「刻碑人」'));

// —— world.js 源级落位 ——
ok('world.js 自 data.js 追加导入 chestCount/chestTotal', wSrc.includes('trialSteleHint, hasRecoveryPoint, chestCount, chestTotal } from'));
ok('world.js 在 applyAchievements 后计算一次 opened/total（单一数据源）',
  wSrc.includes('const opened = chestCount(hero), total = chestTotal();'));
const suffixCount = (wSrc.match(/已开 \$\{opened\}\/\$\{total\}/g) || []).length;
ok('world.js 恰 3 处报文携带「已开 ${opened}/${total}」（蘑菇/金币/药水）', suffixCount === 3, String(suffixCount));
ok('蘑菇报文保留 v19.93 任务进度后缀（MUSHROOM_GOAL 同源）',
  wSrc.includes('任务还差 ${MUSHROOM_GOAL - hero.mushrooms} 株') && wSrc.includes('MUSHROOM_GOAL'));
ok('旧三条报文零残留（不带进度的原句全库清除）',
  !wSrc.includes('`🍄 找到魔法蘑菇！（共 ${hero.mushrooms} 株${qm}）`') &&
  !wSrc.includes('`📦 宝箱！获得 ${gold} 金币（共 ${hero.gold} 枚）`') &&
  !wSrc.includes('`📦 宝箱！获得 1 个🍖 生命药水（共 ${hero.item} 瓶）`'));
ok('既有掉落判定逐字未动（CHEST_MUSHROOM / CHEST_GOLD 两段随机）',
  wSrc.includes('Math.random() < CHEST_MUSHROOM') && wSrc.includes('else if (Math.random() < CHEST_GOLD)'));
ok('「蘑菇集齐」里程碑报文与成就即时判定零回归（MILESTONE_MS / applyAchievements 原位）',
  wSrc.includes("bind.boxMsg('💡 蘑菇集齐了！回去找灯长领取奖励吧！', MILESTONE_MS)") && wSrc.includes('applyAchievements();'));

// —— 数据契约（CHEST_* 逐值 / chestTotal / chestCount 三形态）——
ok('CHEST_MUSHROOM===0.6 · CHEST_GOLD===0.45（掉落概率零回归）', CHEST_MUSHROOM === 0.6 && CHEST_GOLD === 0.45);
ok('CHEST_GOLD_BASE===12 · CHEST_GOLD_PER_LV===5（金币=12+级×5 零回归）', CHEST_GOLD_BASE === 12 && CHEST_GOLD_PER_LV === 5);
ok('chestTotal()===12（镇2+林3+矿2+星砂宝藏4+回廊1）', chestTotal() === 12, String(chestTotal()));
ok('chestCount 三形态防御式（Set size / 数组 length / 缺失 0）',
  chestCount({ chests: new Set(['1,1', '2,2']) }) === 2 &&
  chestCount({ chests: ['1,1', '2,2', '3,3'] }) === 3 &&
  chestCount({}) === 0 && chestCount(null) === 0);

// —— 运行期三档（强制 Math.random 序列，走真实 STEP_HANDLERS[TY.CHEST]）——
function openChest(seq, cx, cy) {
  const orig = Math.random;
  let i = 0;
  Math.random = () => (i < seq.length ? seq[i++] : 0.5);
  try { STEP_HANDLERS[TY.CHEST](cx, cy, S.G); }
  finally { Math.random = orig; }
  return lastMsg;
}
// 蘑菇档（蘑菇分支门 = curMap()===S.G.map==='dungeon；rand 0.1 < 0.6）
S.G.chests = new Set(['1,1']); // 预开 1 只 → 本只后已开 2/12
S.G.mushrooms = 0; S.G.gold = 100; S.G.item = 5; S.G.level = 1;
S.scene = 'world';
const prevMap = S.G.map; S.G.map = 'dungeon';
const mMsg = openChest([0.1], 2, 2);
ok('蘑菇档报文：「🍄 找到魔法蘑菇！（共 1 株 · 已开 2/12）」', mMsg.includes('找到魔法蘑菇') && mMsg.includes('共 1 株') && mMsg.includes('已开 2/12'), mMsg);
ok('蘑菇档未接支线：无「任务还差」后缀（MUSHROOM_GOAL 进度零噪音）', !mMsg.includes('任务还差'), mMsg);
ok('蘑菇档结算一致：mushrooms 0→1 · chests 已含 2,2 · chestCount===2',
  S.G.mushrooms === 1 && S.G.chests.has('2,2') && chestCount(S.G) === 2);
S.G.map = prevMap;
// 金币档（地图非 dungeon → 蘑菇分支短路；rand 0.3 < 0.45 → 金币）
S.G.chests = new Set(['1,1']); S.G.gold = 100; S.G.item = 5; S.G.mushrooms = 0;
const gMsg = openChest([0.3], 2, 2);
ok('金币档报文：「📦 宝箱！获得 17 金币（共 117 枚 · 已开 2/12）」',
  gMsg.includes('获得 17 金币') && gMsg.includes('共 117 枚') && gMsg.includes('已开 2/12'), gMsg);
ok('金币档结算一致：gold 100→117 · chestCount===2',
  S.G.gold === 117 && chestCount(S.G) === 2);
// 药水档（rand 0.9：非蘑菇、非金币 → 药水）
S.G.chests = new Set(['1,1']); S.G.gold = 100; S.G.item = 5; S.G.mushrooms = 0;
const pMsg = openChest([0.9], 2, 2);
ok('药水档报文：「📦 宝箱！获得 1 个🍖 生命药水（共 6 瓶 · 已开 2/12）」',
  pMsg.includes('生命药水') && pMsg.includes('共 6 瓶') && pMsg.includes('已开 2/12'), pMsg);
ok('药水档结算一致：item 5→6 · chestCount===2', S.G.item === 6 && chestCount(S.G) === 2);
// 已开箱格再踩：不重复计数（chestCount 保持 1、Set 大小不变）
S.G.chests = new Set(['2,2']); S.G.gold = 100; S.G.item = 5; S.G.mushrooms = 0;
const before = chestCount(S.G);
openChest([0.1], 2, 2);
ok('已开箱格再踩不重复计数（chestCount 1→1，Set 不增）',
  chestCount(S.G) === before && chestCount(S.G) === 1 && S.G.chests.size === 1,
  String(chestCount(S.G)) + '/' + S.G.chests.size);

// —— README / package.json / CHANGELOG 同步 ——
ok('README tests 树收录 smoke_v2226_chestprogress 且位于串尾', readme.includes('smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith（npm test 串跑）'));
ok('README 件套口径为一百二十七件套（一百二十六件套清除）',
  readme.includes('冒烟一百二十七件套（一百二十六件套清除）') && !readme.includes('冒烟一百二十一件套（一百二十件套清' + '除）'));
ok('README 含 v22.26 守护描述（宝箱开启反馈宝箱进度）', readme.includes('v22.26 起含宝箱开启反馈宝箱进度守护'));
ok('README 含 smoke_v2226_chestprogress 入库（122 份）', readme.includes('smoke_v2226_chestprogress 入库（122 份）'));
ok('README 系统清单补「开箱报文带宝箱进度」（v22.26）',
  readme.includes('开箱报文带宝箱进度') && readme.includes('v22.26'));
ok('package.json 已收录 smoke_v2226_chestprogress（npm test 串跑第 122 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2226_chestprogress.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 122 件套', testChain === 127, String(testChain));
ok('CHANGELOG 含 v22.26 条目', changelog.includes('## v22.26 '));

// 姊妹 pin 复查（v2225..v2215 随新现实更新）
const sib = {};
for (const f of ['v2225_stonecarver', 'v2224_sifter', 'v2223_lampman', 'v2222_peddler', 'v2221_wanderer', 'v2220_hearer', 'v2219_footkeys', 'v2218_mush2', 'v2217_elixir2', 'v2216_picker', 'v2215_tutorvol']) {
  sib[f] = fs.readFileSync(path.join(ROOT, 'tests/smoke_' + f + '.mjs'), 'utf8');
}
const sibNames = Object.keys(sib);
ok('姊妹件套（v2225..v2215）GAME_VERSION 字面量 pin 已更新为 v22.26',
  sibNames.every((k) => sib[k].includes("const GAME_VERSION = 'v22.31';")));
ok('姊妹件套（v2225..v2215）GAME_VERSION 恒等 pin 已更新为 === v22.26',
  sibNames.every((k) => sib[k].includes("GAME_VERSION === 'v22.31'")));
ok('姊妹件套（v2225..v2215）README 件套 pin 已更新为一百二十七件套（一百二十六件套清除）',
  sibNames.every((k) => sib[k].includes('一百二十七件套（一百二十六件套清除）')));
ok('姊妹件套（v2225..v2215）README 树尾 pin 已更新为 + smoke_v2226_chestprogress',
  sibNames.every((k) => sib[k].includes('smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith（npm test 串跑）')));
ok('姊妹件套（v2225..v2215）package.json 件套计数 pin 已更新为 === 122',
  sibNames.every((k) => sib[k].includes('testChain === 127')));
ok('串尾 pin（v2215/v2220..v2225）已更新为 + smoke_v2226_chestprogress',
  ['v2215_tutorvol', 'v2220_hearer', 'v2221_wanderer', 'v2222_peddler', 'v2223_lampman', 'v2224_sifter', 'v2225_stonecarver']
    .every((k) => sib[k].includes('smoke_v2225_stonecarver.mjs && node tests/smoke_v2226_chestprogress.mjs && node tests/smoke_v2227_minstrel.mjs && node tests/smoke_v2228_titlesave.mjs && node tests/smoke_v2229_metall.mjs && node tests/smoke_v2230_pausewarn.mjs && node tests/smoke_v2231_smith.mjs"')));

// —— 旧代 pin 零残留：全部测试文件不得再含 v22.25 字面量/恒等/件套/树尾 pin（拆串构造避免自匹配）——
let stale = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "25';")) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v22.25 全库清零）', stale.length === 0, stale.join(','));
let staleId = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("GAME_VERSION === 'v22." + "25'")) staleId.push(f);
}
ok('旧代 GAME_VERSION 恒等 pin 零残留（===v22.25 全库清零）', staleId.length === 0, staleId.join(','));
let staleSuite = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('一百二十一件套（一百二十件套清' + '除）')) staleSuite.push(f);
}
ok('旧代件套 pin 零残留（一百二十一件套（一百二十件套清' + '除）全库清零）', staleSuite.length === 0, staleSuite.join(','));
let staleTail = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('smoke_v2224_sifter + smoke_v2225_stonecarver（npm test 串' + '跑）')) staleTail.push(f);
}
ok('旧代树尾 pin 零残留（smoke_v2224_sifter + smoke_v2225_stonecarver 串全库清零）', staleTail.length === 0, staleTail.join(','));
let staleOld = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('smoke_v2223_lampman + smoke_v2225_stonecarver（npm test 串' + '跑）')) staleOld.push(f);
}
ok('旧代中段树尾 pin 零残留（smoke_v2223_lampman + smoke_v2225_stonecarver 串全库清零）', staleOld.length === 0, staleOld.join(','));
// 断链防回归：跳过 stonecarver 的坏链（v2224_sifter 直接接 v2226_chestprogress）不得存在于全库（含 README）
let brokenTail = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('smoke_v2224_sifter + smoke_v2226_chestprogress（npm test 串' + '跑）')) brokenTail.push(f);
}
if (readme.includes('smoke_v2224_sifter + smoke_v2226_chestprogress（npm test 串' + '跑）')) brokenTail.push('README.md');
ok('坏链 pin 零残留（v2225_stonecarver 吞并链全库清零）', brokenTail.length === 0, brokenTail.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
