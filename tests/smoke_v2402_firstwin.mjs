// v24.02 专项冒烟：「首胜 / 彩头」数值速查行——README「数值速查」速查表 23 行已覆盖 基础属性/每级成长/
// 升级经验/技能领悟/装备/经济/区域修正/试炼推荐等级/战斗/伤害公式/克制状态/掉落/遇敌槽/出没生态/
// 试炼彩头/成就档位/魔物数值/技能数值/强敌变身/难度倍率/支线奖励/昼夜时段，唯独强敌首胜掉落与精英
// 必掉（精英石心魔像必掉 1 株魔法蘑菇 battle.winBattle isElite 分支 · 幽冥魔王首胜 ⚔️ 圣光之剑
// WEAPONS.legend · 洞窟领主首胜星砂宝藏 4 只显形 CAVE_TREASURE · 终焉之神额外 +300 金 TRUE_BONUS_GOLD ·
// 图鉴全收成就「记忆守护者」另 +999 金 PERFECTION_GOLD）与四枚记忆碎片（FRAGMENTS 单一数据源：石心魔像·
// 守门人的脚印 / 幽冥魔王·灯卫的誓 / 洞窟领主·最后一车星砂 / 终焉之神·初灯的名字，集齐触发真结局
// 「全记忆」加页）此前只散见 battle.js winBattle 分支/各版 CHANGELOG/游戏内战利品预览——现于「掉落」行
// 之后补录「首胜 / 彩头」行（全部由 FRAGMENTS/WEAPONS.legend/CAVE_TREASURE/TRUE_BONUS_GOLD/
// PERFECTION_GOLD 派生，与战利品预览/J 日志碎片节/真结局「全记忆」判定同读一份源），纯文档零逻辑零
// 结算零存档零数值变化。
// 本冒烟守护：版本锚点、data.js/README/battle.js 源级落位（v24.02 注释 / GAME_VERSION v24.02 与旧
// v24.01 字面量零残留 / v24.01 历史注释保留 / 速查行与 FRAGMENTS 四枚逐值 / battle.js isElite·碎片·
// 圣光之剑·彩头分支）、运行期数据实证（FRAGMENTS/WEAPONS.legend/CAVE_TREASURE/TRUE_BONUS_GOLD/
// PERFECTION_GOLD 逐值）、README/package.json/CHANGELOG 同步（件套口径 226 + v24.02 守护描述 +
// 入库 226 + tests 树串尾 + package 串尾）、哨兵链（v2143 前望 227 且 README 尚无 227 口径）、旧代
// v24.01 pin 全库零残留扫描（字面量/恒等/顶 pin/件套 225-224 口径/testChain 225）。
import { S } from '../js/state.js';
import { GAME_VERSION, FRAGMENTS, WEAPONS, CAVE_TREASURE, TRUE_BONUS_GOLD, PERFECTION_GOLD } from '../js/data.js';
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

console.log('— v24.02 首胜 / 彩头 数值速查行 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const bSrc = read('js/battle.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v24.01 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.01', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 1)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js 含 v24.02 注释（首胜/彩头 数值速查行说明）', dSrc.includes('// v24.02 文档整理·数值说明·同源口径'));
ok('data.js GAME_VERSION 字面量已为 v24.03（旧 v24.01 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.03';") && !dSrc.includes("const GAME_VERSION = 'v24.0" + "1';"));
ok('data.js 仍保留 v24.01 历史注释（胜利/阵亡/尾声专属 BGM 说明，累积注释块）',
  dSrc.includes('// v24.01 音效反馈·听觉信息透明'));
ok('data.js 仍保留 v24.00 与 v23.99 历史注释（试炼碑预警/伤害公式行）',
  dSrc.includes('// v24.00 体验打磨·信息透明·决策现场') && dSrc.includes('// v23.99 文档整理·数值说明·同源口径'));

// —— FRAGMENTS 四枚逐值（首胜/彩头行的数据真源）——
ok('FRAGMENTS 共 4 枚（真结局全记忆判定同源）', Array.isArray(FRAGMENTS) && FRAGMENTS.length === 4, String(FRAGMENTS && FRAGMENTS.length));
const fragSig = FRAGMENTS.map((f) => f.enemy + '·' + f.name).join('|');
ok('FRAGMENTS 四枚逐值（石心魔像·守门人的脚印 / 幽冥魔王·灯卫的誓 / 洞窟领主·最后一车星砂 / 终焉之神·初灯的名字）',
  fragSig === '石心魔像·碎片·守门人的脚印|幽冥魔王·碎片·灯卫的誓|洞窟领主·碎片·最后一车星砂|终焉之神·碎片·初灯的名字', fragSig);
ok('FRAGMENTS 四枚 enemy 与强敌名一一对应（战利品预览同判查找键）',
  ['石心魔像', '幽冥魔王', '洞窟领主', '终焉之神'].every((e) => FRAGMENTS.some((f) => f.enemy === e)));

// —— 首胜彩头数值逐值（与 battle.js 结算同源）——
ok('圣光之剑 legend 逐值（攻 24 · 无售价 · 首胜必得）',
  WEAPONS['圣光之剑'] && WEAPONS['圣光之剑'].atk === 24 && WEAPONS['圣光之剑'].legend === true && WEAPONS['圣光之剑'].price === 0,
  JSON.stringify(WEAPONS['圣光之剑']));
ok('CAVE_TREASURE 逐值（星砂宝藏 4 只 = chestTotal 12 的宝藏份额）',
  Array.isArray(CAVE_TREASURE) && CAVE_TREASURE.length === 4, String(CAVE_TREASURE && CAVE_TREASURE.length));
ok('TRUE_BONUS_GOLD 逐值（终焉之神额外 +300 金）', TRUE_BONUS_GOLD === 300, String(TRUE_BONUS_GOLD));
ok('PERFECTION_GOLD 逐值（记忆守护者 +999 金）', PERFECTION_GOLD === 999, String(PERFECTION_GOLD));

// —— battle.js winBattle 分支源级落位（首胜/必掉结算点）——
ok('battle.js isElite 必掉蘑菇分支在（hero.mushrooms++ 唯一精英胜利分支）',
  bSrc.includes('if (enemy.isElite) {') && bSrc.includes('hero.mushrooms++;'));
ok('battle.js 碎片首胜掉落分支在（FRAGMENTS.find 按名归一查找）',
  bSrc.includes('const frag = FRAGMENTS.find') && bSrc.includes('(hero.fragments || []).includes(frag.id)'));
ok('battle.js 圣光之剑首胜分支在（isBoss 且未持剑必得）',
  bSrc.includes("hero.weapon !== '圣光之剑'") && bSrc.includes("hero.weapon = '圣光之剑';"));
ok('battle.js 洞窟领主星砂宝藏与终焉之神 +300 分支在',
  bSrc.includes('星砂宝箱显形') && bSrc.includes('hero.gold += TRUE_BONUS_GOLD;'));

// —— README 数值速查「首胜 / 彩头」行 ——
ok('README 数值速查含「首胜 / 彩头」行（掉落行之后）',
  readme.includes('| 首胜 / 彩头 |') && readme.indexOf('| 掉落 |') < readme.indexOf('| 首胜 / 彩头 |') &&
  readme.indexOf('| 首胜 / 彩头 |') < readme.indexOf('| 遇敌槽 |'));
ok('README 首胜/彩头行含精英必掉蘑菇口径（battle.winBattle isElite 分支）',
  readme.includes('精英石心魔像**必掉** 1 株魔法蘑菇') && readme.includes('isElite'));
ok('README 首胜/彩头行含四枚碎片口径（FRAGMENTS 单一数据源）',
  readme.includes('守门人的脚印') && readme.includes('灯卫的誓') && readme.includes('最后一车星砂') && readme.includes('初灯的名字') &&
  readme.includes('真结局「全记忆」判定'));
ok('README 首胜/彩头行含圣光之剑/星砂宝藏/+300/+999 口径',
  readme.includes('WEAPONS.legend') && readme.includes('CAVE_TREASURE') && readme.includes('TRUE_BONUS_GOLD') &&
  readme.includes('PERFECTION_GOLD'));
ok('README 掉落行零回归（DROP_*/CHEST_* 与 38%/60%/45% 口徑逐字保留）',
  readme.includes('| 掉落 | 战斗胜利 38%：8% 装备或 +60 金 / 12% 药水 / 12% 蘑菇 / 6% 灵药；宝箱 林 60% 菇 · 镇/矿/廊 45% 金'));

// —— README / package.json / CHANGELOG 同步 ——
const testChain = (JSON.parse(pkg).scripts.test.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 226 件套', testChain === 227, String(testChain));
ok('package.json 已收录 smoke_v2402_firstwin（npm test 串跑第 226 份）',
  JSON.parse(pkg).scripts.test.includes('smoke_v2402_firstwin.mjs'));
ok('package.json 串尾为 ... smoke_v2401_winbgm.mjs && node tests/smoke_v2402_firstwin.mjs && node tests/smoke_v2403_diffbattle.mjs"',
  pkg.includes('node tests/smoke_v2401_winbgm.mjs && node tests/smoke_v2402_firstwin.mjs && node tests/smoke_v2403_diffbattle.mjs"'));
ok('README tests 树串尾已延伸至 smoke_v2403_diffbattle',
  readme.includes('+ smoke_v2400_trialwarn + smoke_v2401_winbgm + smoke_v2402_firstwin + smoke_v2403_diffbattle（npm test 串跑）'));
ok('README 件套口径为二百二十七件套（二百二十六件套清除）且旧 216 口径零残留',
  readme.includes('冒烟二百二十七件套（二百二十六件套清除）') && !readme.includes('冒烟二百一十六件套（二百一十五件套清' + '除）'));
ok('README 含 v24.02 守护描述（「首胜 / 彩头」数值速查行守护）', readme.includes('v24.02 起含 「首胜 / 彩头」数值速查行守护'));
ok('README 含 smoke_v2402_firstwin 入库（226 份）', readme.includes('smoke_v2402_firstwin 入库（226 份）'));
ok('README 仍保留 v24.01 历史守护描述与入库口径（历史累积）',
  readme.includes('v24.01 起含 胜利/阵亡/尾声专属 BGM 守护') && readme.includes('smoke_v2401_winbgm 入库（225 份）'));
ok('README 仍保留 v24.00 历史守护描述（试炼碑等级达标预警守护）', readme.includes('v24.00 起含 试炼碑等级达标预警守护'));
ok('CHANGELOG 顶部已追加 v24.03 条目（首胜 / 彩头 数值速查行）', changelog.startsWith('## v24.03 '));
ok('CHANGELOG 顶部条目含首胜/彩头口径说明',
  changelog.includes('首胜 / 彩头') && changelog.includes('守门人的脚印') && changelog.includes('PERFECTION_GOLD'));
ok('CHANGELOG 仍保留 v24.01 与 v24.00 条目标题（历史口径）',
  changelog.includes('## v24.01 音效反馈·听觉信息透明') && changelog.includes('## v24.00 体验打磨·信息透明·决策现场'));

// —— 哨兵链：v2143 前哨前望 227 且 README 尚无 227 口径 ——
const s2143 = read('tests/smoke_v2143_talkekey.mjs');
ok('smoke_v2143 哨兵链已推进至二百二十八件套（二百二十七件套清除）',
  s2143.includes('二百二十八件套（二百二十七件套清除）') && s2143.includes("!readme.includes('二百二十八件套（二百二十七件套清除）')"));
ok('README 尚无二百二十八件套（二百二十七件套清除）前望口径', !readme.includes('二百二十八件套（二百二十七件套清除）'));

// —— 旧代 v24.01 pin 全库零残留（不含本件；拆串防误伤，承 v2319/v2392-2401 惯例）——
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2402_firstwin.mjs');
const stale = [];
for (const f of allTests) {
  const src = read('tests/' + f);
  if (src.includes("const GAME_VERSION = 'v24.0" + "1';") ||
      src.includes("const GAME_VERSION = 'v24.0" + "1'") ||
      src.includes("GAME_VERSION === 'v24.0" + "1'") ||
      src.includes("startsWith('## v24.0" + "1 ") ||
      src.includes("startsWith('## v24.0" + "1'") ||
      src.includes('已为 v24.0' + '1（') ||
      src.includes('二百二十五件套（二百二十四件套清' + '除）') ||
      src.includes('testChain === ' + '225')) stale.push(f);
}
ok('旧代 v24.01 字面量/恒等/顶 pin/件套 225-224 口径/testChain 225 全库零残留（' + allTests.length + ' 件扫描，仅 v24.01 特性标签保留）',
  stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
