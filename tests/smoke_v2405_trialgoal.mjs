// v24.05 专项冒烟：试炼碑奖励行补「📜 千锤百炼 N/3」进度角标——「再战几次才能拿满成就」一眼可见
// （体验打磨·信息透明·决策现场，承 v23.62 图鉴行「· 📜 支线 N/M」同款行内角标 / v23.67 千锤百炼
// 成就同一「成就进度于决策现场可见」主线：碑上 v21.85 已如实分档「✅ 已通关（可再战）+ 💰 再战通关奖
// N 金（随等级）」，唯「再战几次才能拿满成就」查无一眼之数——千锤百炼（试炼场累计通关 RUSH_CLEAR_GOAL
// (3) 次，计数 hero.rushClears 由 battle.winBattle 试炼通关唯一产生点写入、snapshotHero 全量快照自动
// 持久化、防御式 (g.rushClears||0) 旧档零迁移）进度此前只藏在 C 成就页一行 X/3，试炼战报也要打完之后
// 才报「 · 千锤百炼 N/M」，站碑前「要不要再打一轮」的决策现场查无一行；现碑上奖励行按 v23.62 同款
// 行内角标补「 · 📜 千锤百炼 N/3」（分子读 hero.rushClears 防御式 (S.G.rushClears||0)、分母读 data.js
// RUSH_CLEAR_GOAL 单一数据源，与 ACH_LIST rushs 的 ok/prog/d 同读一份源，调门槛只改 data.js 一处三端
// 自动跟随），未解锁档零噪音（奖励行整体在 ready 分支内）；纯显示零结算零存档零数值变化。
// 本冒烟守护：版本锚点、data.js/drawWorld.js 源级落位（v24.05 注释 / GAME_VERSION v24.05 与旧 v24.04
// 字面量零残留 / v24.04 历史注释保留 / import 与奖励行模板两档 / 预警行与既有档零回归）、运行期真实
// drawWorld 渲染捕获（未解锁零噪音 · ready 未通关 0/3 · 已通关 1/3 · 2/3 · 3/3 逐值 · 主标签/✅
// 分档照常 · 互斥零残留）、RUSH_CLEAR_GOAL 与 ACH_LIST rushs 同源互证、README/package.json/CHANGELOG
// 同步（件套口径 229 + v24.05 守护描述 + 入库 229 + tests 树串尾 + package 串尾 + 试炼碑句）、哨兵链
// （v2143 前望 230 且 README 尚无 230 口径）、旧代 v24.04 pin 全库零残留扫描。
import { S } from '../js/state.js';
import { GAME_VERSION, RUSH_REC_LV, RUSH_CLEAR_GOAL, ACH_LIST } from '../js/data.js';
import { rushReward } from '../js/rules.js';
import { newGame } from '../js/core.js';
import { loadMap } from '../js/world.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.84-v21.85 冒烟先例：先装桩再 import main.js；fillText 捕获供渲染断言）——
const noop = () => {};
const captured = [];
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
    fillText: (t) => { captured.push(String(t)); },
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
// drawWorld 静态导入会先于 DOM 桩执行（view/canvas.js 顶层访问 document）——按 v21.84 惯例改为
// 桩装好后动态导入（承 v2185 冒烟先例）。
const { drawWorld } = await import('../js/view/drawWorld.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.05 试炼碑「千锤百炼」进度角标 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const wSrc = read('js/view/drawWorld.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v24.04 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.04', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 4)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.06（旧 v24.04 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.06';") && !dSrc.includes("const GAME_VERSION = 'v24.0" + "4';"));
ok('data.js 含 v24.05 注释（试炼碑奖励行「📜 千锤百炼 N/3」进度角标说明）',
  dSrc.includes('// v24.05 体验打磨·信息透明·决策现场'));
ok('data.js 仍保留 v24.04 历史注释（宝箱 / 宝藏 数值速查行说明，累积注释块）',
  dSrc.includes('// v24.04 文档整理·数值说明·同源口径'));

// —— drawWorld.js 源级落位：import + 奖励行两档模板 + 既有结构零回归 ——
ok('drawWorld.js import 补 RUSH_CLEAR_GOAL（与 RUSH_BOSSES/RUSH_REC_LV 同族，零新增模块依赖）',
  wSrc.includes('RUSH_BOSSES, RUSH_CLEAR_GOAL, RUSH_REC_LV'));
ok('drawWorld.js 含 v24.05 注释（奖励行补「📜 千锤百炼 N/3」进度角标）',
  wSrc.includes('v24.05 奖励行补「📜 千锤百炼 N/3」进度角标'));
ok('drawWorld.js 已通关/再战档奖励行模板（· 📜 千锤百炼 同式追加）',
  wSrc.includes('再战通关奖 ${rushReward(S.G.level)} 金（随等级） · 📜 千锤百炼'));
ok('drawWorld.js 未通关/通关奖档奖励行模板（· 📜 千锤百炼 同式追加）',
  wSrc.includes('通关奖 ${rushReward(S.G.level)} 金（随等级） · 📜 千锤百炼'));
ok('drawWorld.js 分子防御式 (S.G.rushClears || 0)（旧档缺字段零迁移，与 ACH_LIST rushs 同一字段）',
  wSrc.includes('${(S.G.rushClears || 0)}/${RUSH_CLEAR_GOAL}'));
ok('drawWorld.js 既有档逐字零回归（试炼·未解锁 / ⚔️ 试炼三连战 / ✅ 已通关（可再战） 全在源）',
  wSrc.includes("'试炼·未解锁'") && wSrc.includes('⚔️ 试炼三连战') && wSrc.includes('✅ 试炼三连战 · 已通关（可再战）'));
ok('drawWorld.js v24.00 预警行零回归（S.G.level < RUSH_REC_LV 条件在）',
  wSrc.includes('if (ready && S.G.level < RUSH_REC_LV) {'));

// —— 常量互证：RUSH_CLEAR_GOAL 与 ACH_LIST rushs（千锤百炼）同读一份源 ——
ok('RUSH_CLEAR_GOAL === 3（试炼场累计通关阈值，单一数据源）', RUSH_CLEAR_GOAL === 3, String(RUSH_CLEAR_GOAL));
{
  const rushs = ACH_LIST.find((a) => a.id === 'rushs');
  ok('ACH_LIST rushs 与 RUSH_CLEAR_GOAL 同源（ok 2/3 false · 3/3 true · prog 1/3 2/3）',
    !!rushs && rushs.ok({ rushClears: 2 }) === false && rushs.ok({ rushClears: 3 }) === true &&
    rushs.prog({ rushClears: 1 }) === '1/3' && rushs.prog({ rushClears: 2 }) === '2/3',
    rushs && JSON.stringify([rushs.ok({ rushClears: 2 }), rushs.ok({ rushClears: 3 }), rushs.prog({ rushClears: 1 }), rushs.prog({ rushClears: 2 })]));
}

// —— 运行期实证：cave 试炼碑 (18,12)，英雄 (18,11) 面向下（承 v2185 渲染构型）——
function renderCave(flags) {
  captured.length = 0;
  S.G = newGame('测试');
  S.G.map = 'cave';
  S.G.x = 18; S.G.y = 11;
  S.G.level = 12;
  S.G.bossDefeated = !!flags.boss;
  S.G.caveBoss = !!flags.cave;
  S.G.rushDone = !!flags.done;
  if (flags.rc != null) S.G.rushClears = flags.rc;
  S.dir = 'D';
  S.scene = 'world';
  S.walk = null;
  loadMap('cave');
  drawWorld();
  return captured.slice();
}
const REW = (tag, rc) => `💰 ${tag} ${rushReward(12)} 金（随等级） · 📜 千锤百炼 ${rc}/${RUSH_CLEAR_GOAL}`;
let cap = renderCave({ boss: false, cave: false, done: false });
ok('未解锁档：只画「试炼·未解锁」（零奖励行 / 零千锤百炼角标）',
  cap.includes('试炼·未解锁') && !cap.some((t) => t.includes('千锤百炼')) && !cap.some((t) => t.includes('通关奖')));
cap = renderCave({ boss: true, cave: true, done: false });
ok('未通关档：奖励行精确「💰 通关奖 390 金（随等级） · 📜 千锤百炼 0/3」（newGame 缺 rushClears 防御式 0）',
  cap.includes(REW('通关奖', 0)), cap.filter((t) => t.includes('通关奖') || t.includes('千锤百炼')).join(' | '));
ok('未通关档：主标签零回归（⚔️ 阵容 · 建议Lv.12）',
  cap.some((t) => t.includes('⚔️ 试炼三连战') && t.includes('建议Lv.' + RUSH_REC_LV)));
ok('未通关档：v24.00 预警联动（Lv12 达标零噪音；Lv6 时预警行同现）',
  !cap.some((t) => t.includes('建议 Lv.')));
S.G.level = 6;
captured.length = 0;
drawWorld();
ok('未通关档 Lv6：v24.00 预警行同现（⚠️ 建议 Lv.12 · 你当前 Lv.6 · 差 6 级）',
  captured.some((t) => t.includes('建议 Lv.12') && t.includes('你当前 Lv.6')), captured.find((t) => t.includes('建议 Lv.')));
S.G.level = 12;
cap = renderCave({ boss: true, cave: true, done: true, rc: 1 });
ok('已通关档 rc=1：奖励行精确「💰 再战通关奖 … · 📜 千锤百炼 1/3」',
  cap.includes(REW('再战通关奖', 1)), cap.filter((t) => t.includes('通关奖')).join(' | '));
ok('已通关档 rc=1：主标签为 ✅ 已通关（可再战）', cap.includes('✅ 试炼三连战 · 已通关（可再战）'));
ok('已通关档 rc=1：未通关奖励行互斥零残留（💰 通关奖 不带「再战」字样的档零渲染）',
  !cap.includes(REW('通关奖', 0)) && !cap.includes(REW('通关奖', 3)));
cap = renderCave({ boss: true, cave: true, done: true, rc: 2 });
ok('已通关档 rc=2：奖励行精确「💰 再战通关奖 … · 📜 千锤百炼 2/3」',
  cap.includes(REW('再战通关奖', 2)), cap.filter((t) => t.includes('千锤百炼')).join(' | '));
cap = renderCave({ boss: true, cave: true, done: true, rc: 3 });
ok('已通关档 rc=3：奖励行精确「💰 再战通关奖 … · 📜 千锤百炼 3/3」（成就满档如实展示）',
  cap.includes(REW('再战通关奖', 3)), cap.filter((t) => t.includes('千锤百炼')).join(' | '));

// —— 宽度预算（承 v21.11/v2185 口径：试炼碑标签 12px 居中方框 ≤480 画布内宽）——
const WIDEST = REW('再战通关奖', 3);
ok('已通关 rc=3 奖励行宽度预算（12px 级 ≈ ' + (WIDEST.length * 8 + 12) + 'px ≤ 480 画布内宽）',
  WIDEST.length * 8 + 12 <= 480);

// —— README / package.json / CHANGELOG 同步 ——
const testChain = (JSON.parse(pkg).scripts.test.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 229 件套', testChain === 230, String(testChain));
ok('package.json 已收录 smoke_v2405_trialgoal（npm test 串跑第 229 份）',
  JSON.parse(pkg).scripts.test.includes('smoke_v2405_trialgoal.mjs'));
ok('package.json 串尾为 ... smoke_v2404_chestrow.mjs && node tests/smoke_v2405_trialgoal.mjs && node tests/smoke_v2406_restrow.mjs"',
  pkg.includes('node tests/smoke_v2404_chestrow.mjs && node tests/smoke_v2405_trialgoal.mjs && node tests/smoke_v2406_restrow.mjs"'));
ok('README tests 树串尾已延伸至 smoke_v2405_trialgoal',
  readme.includes('+ smoke_v2405_trialgoal + smoke_v2406_restrow（npm test 串跑）'));
ok('README 件套口径为二百三十件套（二百二十九件套清除）且旧 228 口径零残留',
  readme.includes('冒烟二百三十件套（二百二十九件套清除）') && !readme.includes('冒烟二百二十八件套（二百二十七件套清除）'));
ok('README 含 v24.05 守护描述（试炼碑「千锤百炼」进度角标守护）',
  readme.includes('v24.05 起含 试炼碑「千锤百炼」进度角标守护'));
ok('README 含 smoke_v2405_trialgoal 入库（229 份）', readme.includes('smoke_v2405_trialgoal 入库（229 份）'));
ok('README 试炼碑句含 v24.05 进度角标口径（📜 千锤百炼 N/3）',
  readme.includes('**v24.05 起奖励行附「📜 千锤百炼 N/3」进度角标**'));
ok('README 仍保留 v24.04 历史守护描述与入库口径（宝箱/宝藏 + 228 份）',
  readme.includes('v24.04 起含 「宝箱 / 宝藏」数值速查行守护') && readme.includes('smoke_v2404_chestrow 入库（228 份）'));
ok('README 快速旅行预警行零回归（v21.92 口径逐字保留）',
  readme.includes('⚠️ 推荐 Lv.N · 你当前 Lv.M · 先补给再战！'));
ok('README 数值速查「试炼推荐等级」行零回归（RUSH_REC_LV 派生口径逐字保留）',
  readme.includes('`RUSH_REC_LV`（`SPECIES[].lv` 派生）'));
ok('CHANGELOG 顶部已追加 v24.06 条目（试炼碑千锤百炼进度角标）', changelog.startsWith('## v24.06 '));
ok('CHANGELOG 顶部条目含千锤百炼与 RUSH_CLEAR_GOAL 口径说明',
  changelog.includes('千锤百炼') && changelog.includes('RUSH_CLEAR_GOAL') && changelog.includes('进度角标'));
ok('CHANGELOG 仍保留 v24.04 与 v24.03 条目标题（历史口径）',
  changelog.includes('## v24.04 文档整理·数值说明·同源口径') && changelog.includes('## v24.03 体验打磨·信息透明·纯显示'));

// —— 哨兵链：v2143 前哨前望 230 且 README 尚无 230 口径 ——
const s2143 = read('tests/smoke_v2143_talkekey.mjs');
ok('smoke_v2143 哨兵链已推进至二百三十一件套（二百三十件套清除）',
  s2143.includes('二百三十一件套（二百三十件套清除）') && s2143.includes("!readme.includes('二百三十一件套（二百三十件套清除）')"));
ok('README 尚无二百三十一件套（二百三十件套清除）前望口径', !readme.includes('二百三十一件套（二百三十件套清除）'));

// —— 旧代 v24.04 pin 全库零残留（不含本件；拆串防误伤，承 v2400/v2404 惯例）——
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2405_trialgoal.mjs');
const stale = [];
for (const f of allTests) {
  const src = read('tests/' + f);
  if (src.includes("const GAME_VERSION = 'v24.0" + "4'") ||
      src.includes("GAME_VERSION === 'v24.0" + "4'") ||
      src.includes("startsWith('## v24.0" + "4 ") ||
      src.includes("startsWith('## v24.0" + "4'") ||
      src.includes('已为 v24.0' + '4（') ||
      src.includes('已追加 v24.0' + '4 条目') ||
      src.includes('冒烟二百二十八件套（二百二十七件套清' + '除）') ||
      src.includes('二百二十八件套（二百二十七件套清' + '除）') ||
      src.includes('testChain === ' + '228') ||
      src.includes('smoke_v2403_diffbattle + smoke_v2404_chestrow（npm test 串' + '跑）') ||
      src.includes('node tests/smoke_v2404_chestrow.mjs' + '"')) stale.push(f);
}
ok('旧代 v24.04 字面量/恒等/顶 pin/件套 228 口径/testChain 228/串尾 全库零残留（' + allTests.length + ' 件扫描）',
  stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
