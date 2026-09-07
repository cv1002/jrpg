// v21.40 专项冒烟：无泉水/旅店图进图补给提醒——world.transition 对无免费恢复点的图（cave/gallery，
// 全图唯二没有泉水/旅店：潮灯镇 rows 含 F/I、雾语林 extras 含 FOUNTAIN 12,9，唯二无恢复点的就是
// 星井矿脉/无字回廊——与 v21.17 老矿工「矿脉没有泉水/旅店」逐字同源）追加
// 「⚠️ 星井矿脉没有泉水/旅店 · 出发前请补给！」提醒；判定由 data.js 新增纯函数 hasRecoveryPoint
// 对 MAPS 数据实扫（rows 'F'/'I' 瓦片或 extras FOUNTAIN/INN），零裸字面量、单一数据源（以后给某图
// 加泉水只改 MAPS 一处、提醒自动消失）；传送门/出口/快速旅行/水晶开门四条入口全走 transition 统一生效。
// 本冒烟守护：版本锚点、hasRecoveryPoint 纯函数四图逐值 + 数据面（cave/gallery 无 F/I/FOUNTAIN/INN）、
// world.js 调用面源级落位（import + 判定 + 文案）、README 同步（T 行/系统清单/tests 树/三十六件套/
// v21.40 守护描述）、package.json 收录、运行期 transition 消息实证（等级达标/不足 + 有恢复点图零提醒）、
// smoke_v2139 件套断言去硬化确认（v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION, MAPS, hasRecoveryPoint } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.30-v21.39 冒烟先例：先装桩再 import main.js；boxMsg 在运行期被 bind 覆盖捕获）——
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
const { transition } = await import('../js/world.js');
const { bind } = await import('../js/bind.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.40 无泉水/旅店图进图补给提醒 冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.39）——
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.39', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 40)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.40 注释（无泉水/旅店提醒说明）', dSrc.includes('v21.40'));

// —— hasRecoveryPoint 纯函数：四图逐值（数据层单一数据源）——
ok('hasRecoveryPoint 已导出（typeof function）', typeof hasRecoveryPoint === 'function');
ok('潮灯镇有恢复点（rows 含 F 喷泉 / I 旅店）', hasRecoveryPoint(MAPS.village) === true);
ok('雾语林有恢复点（extras 营地泉水 12,9 FOUNTAIN）', hasRecoveryPoint(MAPS.dungeon) === true);
ok('星井矿脉无恢复点（唯一无补给的练级图）', hasRecoveryPoint(MAPS.cave) === false);
ok('无字回廊无恢复点（终局冲刺区）', hasRecoveryPoint(MAPS.gallery) === false);
ok('hasRecoveryPoint(null) 兜底 false（防误传 undefined）', hasRecoveryPoint(null) === false);
// 数据面佐证：cave/gallery 的 false 是「地图事实」而非函数事故——rows 无 F/I 瓦片、extras 无 FOUNTAIN/INN
const caveRows = (MAPS.cave.rows || []).join('');
const galRows = (MAPS.gallery.rows || []).join('');
ok('数据面：cave rows 无 F/I 瓦片', !caveRows.includes('F') && !caveRows.includes('I'));
ok('数据面：gallery rows 无 F/I 瓦片', !galRows.includes('F') && !galRows.includes('I'));
ok('数据面：cave/gallery extras 无 FOUNTAIN/INN',
  (MAPS.cave.extras || []).every((e) => e.ty !== 'FOUNTAIN' && e.ty !== 'INN') &&
  (MAPS.gallery.extras || []).every((e) => e.ty !== 'FOUNTAIN' && e.ty !== 'INN'));

// —— world.js 调用面源级落位 ——
const wSrc = fs.readFileSync(path.join(ROOT, 'js/world.js'), 'utf8');
ok('world.js 含 v21.40 注释（进图补给提醒说明）', wSrc.includes('v21.40'));
ok('world.js 已 import hasRecoveryPoint', /hasRecoveryPoint/.test(wSrc.split('\n').find((l) => l.includes("from './data.js'")) || ''));
ok('transition 判定落位（hasRecoveryPoint(MAPS[name])）', wSrc.includes('if (!hasRecoveryPoint(MAPS[name]))'));
ok('提醒文案落位（没有泉水/旅店 · 出发前请补给）', wSrc.includes('没有泉水/旅店 · 出发前请补给'));

// —— README 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const tRow = readme.split('\n').find((l) => l.includes('| `T` |'));
ok('README T 行存在', !!tRow);
ok('README T 行已补「无泉水/旅店」补给提醒口径', !!tRow && tRow.includes('无泉水/旅店') && tRow.includes('出发前请补给'));
ok('README 系统清单快速旅行条目含补给提醒', readme.includes('进图时 `world.transition` 统一提示'));
ok('README tests 树收录 smoke_v2140_norecover', readme.includes('smoke_v2140_norecover'));
ok('README 件套口径存在性（v21.7 去硬化惯例：不再以「三十六件套/三十五件套清除」断言精确件数，实件数由 v21.41 冒烟守护「三十七件套」）',
  readme.includes('冒烟') && readme.includes('件套'));
ok('README 含 v21.40 守护描述（无泉水/旅店图进图补给提醒）', readme.includes('v21.40 起含无泉水/旅店图进图补给提醒守护'));

// —— package.json 收录 ——
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('package.json 已收录 smoke_v2140_norecover（npm test 串跑第 36 份）', pkg.includes('smoke_v2140_norecover.mjs'));

// —— 运行期实证：transition 消息捕获（bind.boxMsg 覆盖为捕获器，四入口同走本函数）——
const msgs = [];
const origBoxMsg = bind.boxMsg;
bind.boxMsg = (t) => { msgs.push(String(t)); };
try {
  S.G.level = 99;                 // 等级达标 → 第一句是「进入了…」
  S.G.visited = ['village', 'cave', 'gallery'];
  msgs.length = 0;
  transition('cave');
  ok('进入星井矿脉（等级达标）：首句「进入了【星井矿脉】」', msgs.length >= 1 && msgs[0].includes('进入了【星井矿脉】'), msgs.join(' | '));
  ok('进入星井矿脉：紧随「⚠️ 星井矿脉没有泉水/旅店 · 出发前请补给！」', msgs.length >= 2 && msgs[1].includes('没有泉水/旅店') && msgs[1].includes('出发前请补给'), msgs.join(' | '));
  msgs.length = 0;
  S.G.level = 99;
  transition('gallery');
  ok('进入无字回廊：首句「进入了【无字回廊】」', msgs.length >= 1 && msgs[0].includes('进入了【无字回廊】'), msgs.join(' | '));
  ok('进入无字回廊：紧随无补给提醒', msgs.length >= 2 && msgs[1].includes('没有泉水/旅店'), msgs.join(' | '));
  msgs.length = 0;
  S.G.level = 1;                  // 等级不足分支：危险预警 + 无补给提醒双发（v21.40 对两分支都生效）
  transition('cave');
  ok('低等级进星井矿脉：首句「魔物远强于你」预警（v19.56 零回归）', msgs.length >= 1 && msgs[0].includes('魔物远强于你'), msgs.join(' | '));
  ok('低等级进星井矿脉：无补给提醒仍紧随其后', msgs.length >= 2 && msgs[1].includes('没有泉水/旅店'), msgs.join(' | '));
  msgs.length = 0;
  S.G.level = 99;
  transition('village');
  ok('进潮灯镇（有泉水/旅店）：只有「进入了【潮灯镇】」且零无补给提醒（不误报）',
    msgs.length === 1 && msgs[0].includes('进入了【潮灯镇】'), msgs.join(' | '));
  ok('进雾语林（extras 泉水）：零无补给提醒（不误报）', (msgs.length = 0, transition('dungeon'), msgs.length === 1 && msgs[0].includes('进入了【雾语林】')), msgs.join(' | '));
} finally {
  bind.boxMsg = origBoxMsg;
}

// —— smoke_v2139 的 README 件套口径断言已去硬化（v21.7 惯例）——
const s2139 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2139_helpkey.mjs'), 'utf8');
ok('smoke_v2139 的 README 件套口径断言已去硬化（v21.7 惯例：改用存活性口径 readme.includes(冒烟/件套)，旧精确断言表达式「readme.includes(\'三十五件套\') && readme.includes(\'三十四件套清除\')」零残留，实件数由本版冒烟守护）',
  s2139.includes("readme.includes('冒烟')") && s2139.includes("readme.includes('件套')") &&
  !s2139.includes("readme.includes('三十五件套') && readme.includes('三十四件套清除')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
