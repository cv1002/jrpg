// v24.03 专项冒烟：战斗画面「⚡ 困难」角标——体验打磨·信息透明·纯显示，
// 承 v23.08 难度/倍率行 + v23.10 总结屏三屏「 · 困难」同一「难度档位五端同读 hero.diff · DIFFS
// 一份源」主线：创建页倍率标注/状态页 I「[困难 · 魔物HP×1.35 攻×1.15 防×1.12]」/HUD ⚡ 角标/
// 标题槽预览难度/总结屏三屏（drawDead·drawWin·drawEnding v23.10 战绩行「 · 困难」）五端齐备，
// 唯战斗画面查无一行——困难档倍率（battle.startBattle 按 DIFF_SCALE 乘算）实际生效的场景，
// 玩家却看不出「这局是困难档」（HUD ⚡ 在画布下方 DOM、战斗画面内零指示）；现 drawBattle 与五端
// 同读 hero.diff（0 普通/1 困难）· DIFFS 单一数据源，仅困难档于「⚔️ 回合 N」行右侧追加
// 「⚡ 困难」角标（普通档零噪音零位移；补 DIFFS import 零新增模块依赖），纯显示零结算零存档
// 零数值变化（回合/敌方/预览/指令栏逐字未动）。
// 本冒烟守护：版本锚点、data.js/drawBattle.js 源级落位（v24.03 注释 / GAME_VERSION v24.03 与旧
// v24.02 字面量零残留 / v24.02 历史注释保留 / DIFFS import / 角标行 / 回合行零回归）、DIFFS/
// DIFF_SCALE 数据源契约、运行期 drawBattle 真实渲染捕获（普通档零角标 / 困难档「⚡ 困难」/
// 越界 diff 兜底 / 回合计数零回归 / 零抛错）、README/package.json/CHANGELOG 同步（件套口径 227 +
// v24.03 守护描述 + 入库 227 + tests 树串尾 + package 串尾）、哨兵链（v2143 前望 228 且 README
// 尚无 228 口径）、旧代 v24.02 pin 全库零残留扫描（字面量/恒等/顶 pin/件套 226-225 口径/
// testChain 226）。
import { S } from '../js/state.js';
import { GAME_VERSION, DIFFS, DIFF_SCALE } from '../js/data.js';
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

console.log('— v24.03 战斗画面「⚡ 困难」角标 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const dbSrc = read('js/view/drawBattle.js');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v24.02 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.02', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 2)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js 含 v24.03 注释（战斗画面 ⚡ 困难 角标说明）', dSrc.includes('// v24.03 体验打磨·信息透明·纯显示'));
ok('data.js GAME_VERSION 字面量已为 v24.03（旧 v24.02 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.03';") && !dSrc.includes("const GAME_VERSION = 'v24.0" + "2';"));
ok('data.js 仍保留 v24.02 历史注释（首胜 / 彩头 数值速查行，累积注释块）',
  dSrc.includes('// v24.02 文档整理·数值说明·同源口径'));
ok('data.js 仍保留 v24.01 与 v24.00 历史注释（专属 BGM / 试炼碑预警）',
  dSrc.includes('// v24.01 音效反馈·听觉信息透明') && dSrc.includes('// v24.00 体验打磨·信息透明·决策现场'));

// —— DIFFS / DIFF_SCALE 数据源契约（角标与倍率的真源，承 v23.08/v2168 契约）——
ok('DIFFS 契约（恰好两档，[0]=普通 [1]=困难——角标 hero.diff===1 的语义锚点）',
  DIFFS.length === 2 && DIFFS[0] === '普通' && DIFFS[1] === '困难', JSON.stringify(DIFFS));
ok('DIFF_SCALE 契约（困难倍率 hp×1.35 攻×1.15 防×1.12，与 battle.startBattle 结算同源）',
  DIFF_SCALE.hp === 1.35 && DIFF_SCALE.atk === 1.15 && DIFF_SCALE.def === 1.12, JSON.stringify(DIFF_SCALE));

// —— drawBattle.js 源级落位：v24.03 注释 + DIFFS import + 角标行 + 既有回合行零回归 ——
ok('drawBattle.js data.js import 补 DIFFS（零新增模块依赖，承 v23.78 MAPS 先例）',
  dbSrc.includes('CHARGE_MULT, DIFFS, ELEM_NAME'));
ok('drawBattle.js 仍保留既有 import 串尾（FRAGMENTS, MAPS）逐字未动',
  dbSrc.includes("FRAGMENTS, MAPS } from '../data.js';"));
ok('角标行由 hero.diff · DIFFS 单一数据源派生（与五端同读一份源）',
  dbSrc.includes('if (hero.diff) text(`⚡ ${DIFFS[hero.diff] || \'困难\'}`, 200, 26, \'bold 12px\', \'#ff9a7a\');'));
ok('角标行含 DIFFS[hero.diff] || 困难 防御式兜底（与 core.slotPreview 同款）',
  dbSrc.includes("DIFFS[hero.diff] || '困难'"));
ok('「⚔️ 回合 N」行逐字未动（v12.9 起既有口径零回归）',
  dbSrc.includes("text(`⚔️ 回合 ${S.battleTurn || 1}`, 60, 26, 'bold 14px', '#ffd24a');"));

// —— 运行期：drawBattle 真实渲染捕获（普通档零角标 / 困难档 ⚡ 困难 / 越界兜底 / 回合零回归 / 零抛错）——
{
  const { drawBattle } = await import('../js/view/drawBattle.js');
  const { CTX } = await import('../js/view/canvas.js');
  const cap = [];
  const origFt = CTX.fillText;
  CTX.fillText = (t, ...a) => { cap.push(String(t)); return origFt.call(CTX, t, ...a); };
  const heroObj = (diff) => ({ name: '余烬', level: 3, xp: 0, xpNext: 20, hp: 45, hpMax: 45, mp: 10, mpMax: 12,
    item: 0, potion2: 0, atkMax: 11, defMax: 6, skills: [], weapon: '木剑', armor: '布衣',
    gold: 30, seen: {}, bestiary: {}, quests: {}, map: 'village', diff });
  const entryEnemy = () => ({ name: '史莱姆', hp: 16, hpMax: 16, xp: 8, gold: 8, atk: 7, def: 4, color: '#7fd84f',
    draw: 'slime', acts: [{ type: 'attack', w: 100 }], weak: 'fire' });
  let threw = null;
  try {
    S.G = heroObj(0);
    S.enemy = entryEnemy();
    S.scene = 'battle';
    S.blog = []; S.blogView = 0;
    S.fx = []; S.parr = [];
    S.skillMenuOpen = false; S.battleTurn = 4;
    S.shake = null; S.flash = null;
    cap.length = 0;
    drawBattle();
    ok('普通档：头部无「⚡ 困难」角标（零噪音零位移）',
      !cap.some((t) => t.includes('⚡ 困难')), JSON.stringify(cap.filter((t) => t.includes('⚡'))));
    ok('普通档：回合计数零回归（⚔️ 回合 4）', cap.includes('⚔️ 回合 4'), JSON.stringify(cap.filter((t) => t.includes('回合'))));
    ok('普通档：📍 地图名照旧（v23.78 口径零回归）', cap.includes('📍 潮灯镇'), JSON.stringify(cap.filter((t) => t.includes('📍'))));
    cap.length = 0;
    S.G = heroObj(1);
    drawBattle();
    ok('困难档：头部捕获「⚡ 困难」', cap.includes('⚡ 困难'), JSON.stringify(cap.filter((t) => t.includes('⚡'))));
    ok('困难档：回合计数/📍 地图名零回归', cap.includes('⚔️ 回合 4') && cap.includes('📍 潮灯镇'));
    cap.length = 0;
    S.G = heroObj(2);
    drawBattle();
    ok('越界 diff（2）：兜底仍报「⚡ 困难」（DIFFS[hero.diff] || 困难）',
      cap.includes('⚡ 困难'), JSON.stringify(cap.filter((t) => t.includes('⚡'))));
    cap.length = 0;
    S.G = heroObj(undefined);
    drawBattle();
    ok('旧档缺 diff 字段（undefined）：零角标零抛错（防御式）',
      !cap.some((t) => t.includes('⚡ 困难')));
    ok('四档渲染零抛错', true);
  } catch (e) { threw = e; }
  ok('运行期 drawBattle 渲染零抛错', threw === null, threw && String(threw.stack || threw));
  CTX.fillText = origFt;
  S.G = null; S.enemy = null; S.scene = 'title';
}

// —— README / package.json / CHANGELOG 同步 ——
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');
const testChain = (JSON.parse(pkg).scripts.test.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 227 件套', testChain === 227, String(testChain));
ok('package.json 已收录 smoke_v2403_diffbattle（npm test 串跑第 227 份）',
  JSON.parse(pkg).scripts.test.includes('smoke_v2403_diffbattle.mjs'));
ok('package.json 串尾为 ... smoke_v2402_firstwin.mjs && node tests/smoke_v2403_diffbattle.mjs"',
  pkg.includes('node tests/smoke_v2402_firstwin.mjs && node tests/smoke_v2403_diffbattle.mjs"'));
ok('README tests 树串尾已延伸至 smoke_v2403_diffbattle',
  readme.includes('+ smoke_v2400_trialwarn + smoke_v2401_winbgm + smoke_v2402_firstwin + smoke_v2403_diffbattle（npm test 串跑）'));
ok('README 件套口径为二百二十七件套（二百二十六件套清除）且旧 226 口径零残留',
  readme.includes('冒烟二百二十七件套（二百二十六件套清除）') && !readme.includes('冒烟二百二十六件套（二百二十五件套清除）'));
ok('README 含 v24.03 守护描述（「⚡ 困难」角标守护）', readme.includes('v24.03 起含 战斗画面「⚡ 困难」角标守护'));
ok('README 含 smoke_v2403_diffbattle 入库（227 份）', readme.includes('smoke_v2403_diffbattle 入库（227 份）'));
ok('README 战斗 bullet 含 v24.03 口径（战斗画面左上角困难档常显「⚡ 困难」）',
  readme.includes('v24.03 起战斗画面左上角困难档常显「⚡ 困难」') && readme.includes('hero.diff') && readme.includes('DIFFS'));
ok('README 仍保留 v24.02 历史守护描述与入库口径（历史累积）',
  readme.includes('v24.02 起含 「首胜 / 彩头」数值速查行守护') && readme.includes('smoke_v2402_firstwin 入库（226 份）'));
ok('README 仍保留 v24.01 历史守护描述（胜利/阵亡/尾声专属 BGM）', readme.includes('v24.01 起含 胜利/阵亡/尾声专属 BGM 守护'));
ok('CHANGELOG 顶部已追加 v24.03 条目（战斗画面 ⚡ 困难 角标）', changelog.startsWith('## v24.03 '));
ok('CHANGELOG 顶部条目含 ⚡ 困难 与 DIFFS 口径说明',
  changelog.includes('⚡ 困难') && changelog.includes('DIFFS') && changelog.includes('hero.diff'));
ok('CHANGELOG 仍保留 v24.02 与 v24.01 条目标题（历史口径）',
  changelog.includes('## v24.02 文档整理·数值说明·同源口径') && changelog.includes('## v24.01 音效反馈·听觉信息透明'));

// —— 哨兵链：v2143 前哨前望 228 且 README 尚无 228 口径 ——
const s2143 = read('tests/smoke_v2143_talkekey.mjs');
ok('smoke_v2143 哨兵链已推进至二百二十八件套（二百二十七件套清除）',
  s2143.includes('二百二十八件套（二百二十七件套清除）') && s2143.includes("!readme.includes('二百二十八件套（二百二十七件套清除）')"));
ok('README 尚无二百二十八件套（二百二十七件套清除）前望口径', !readme.includes('二百二十八件套（二百二十七件套清除）'));

// —— 旧代 v24.02 pin 全库零残留（不含本件；拆串防误伤，承 v2402 惯例）——
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2403_diffbattle.mjs');
const stale = [];
for (const f of allTests) {
  const src = read('tests/' + f);
  if (src.includes("const GAME_VERSION = 'v24.0" + "2';") ||
      src.includes("const GAME_VERSION = 'v24.0" + "2'") ||
      src.includes("GAME_VERSION === 'v24.0" + "2'") ||
      src.includes("startsWith('## v24.0" + "2 ") ||
      src.includes("startsWith('## v24.0" + "2'") ||
      src.includes('已为 v24.0' + '2（') ||
      src.includes('已追加 v24.0' + '2 条目') ||
      src.includes('二百二十六件套（二百二十五件套清' + '除）') ||
      src.includes('testChain === ' + '226') ||
      src.includes('smoke_v2400_trialwarn + smoke_v2401_winbgm + smoke_v2402_firstwin（npm test 串' + '跑）') ||
      src.includes('node tests/smoke_v2402_firstwin.mjs' + '"')) stale.push(f);
}
ok('旧代 v24.02 字面量/恒等/顶 pin/件套 226-225 口径/testChain 226/串尾 全库零残留（' + allTests.length + ' 件扫描）',
  stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
