// v21.37 专项冒烟：图鉴「已遭遇」计数化——v19.41 起 hero.seen 只记布尔「撞见过」，图鉴已遭遇行却标写死的
// 「已遭遇 ✕0」（撞见 3 次仍 ✕0，计数与事实对不上、与讨伐行 ✕N 口径不一致）；本版 battle.startBattle
// 每次进战 key 值 +1（真身经 canonicalName 归一，与 bestiary 同口径）、图鉴标真实「已遭遇 ✕N」，
// 旧档布尔 true 经 |0 归一为 1（至少撞见一次）。纯追加语义：零结算、零存档格式变化、零掉落/经验/逃跑影响。
// 承 v21.10 起冒烟入库先例（仓库常驻版）。
import { S } from '../js/state.js';
import { GAME_VERSION } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.30-v21.36 冒烟先例：先装桩再 import main.js；ctx 记录所有 fillText）——
const drawn = [];
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
    fillText: (t) => { drawn.push(String(t)); },
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
const { drawCodex } = await import('../js/view/index.js');
const { startBattle } = await import('../js/battle.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.37 图鉴已遭遇计数 冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.36）——
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.36', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 37)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.37 注释（图鉴已遭遇计数化说明）', dSrc.includes('v21.37'));

// —— 源级落位：battle 侧计数 / 图鉴侧 ✕N，旧布尔赋值与写死 ✕0 零残留 ——
const bSrc = fs.readFileSync(path.join(ROOT, 'js/battle.js'), 'utf8');
const mSrc = fs.readFileSync(path.join(ROOT, 'js/view/menus.js'), 'utf8');
ok('battle.js 含 v21.37 注释（计数化说明）', bSrc.includes('v21.37'));
ok('battle.js 计数落位：(S.G.seen[_seenKey] || 0) + 1', bSrc.includes('(S.G.seen[_seenKey] || 0) + 1'));
ok('battle.js 首见分支落位：else S.G.seen = { [_seenKey]: 1 }', bSrc.includes('else S.G.seen = { [_seenKey]: 1 }'));
ok('battle.js 旧布尔赋值零残留（S.G.seen[_seenKey] = true 已清除）', !bSrc.includes('S.G.seen[_seenKey] = true'));
ok('menus.js 含 v21.37 注释（seenCt |0 归一说明）', mSrc.includes('v21.37'));
ok('menus.js rows 增补 seenCt 且经 |0 归一（旧档 true→1）', mSrc.includes('seenCt:((hero.seen||{})[n])|0'));
ok('menus.js 已遭遇行改读 ✕${r.seenCt}（真实撞见次数）', mSrc.includes('`已遭遇 ✕${r.seenCt}`'));
ok('menus.js 写死「已遭遇 ✕0」零残留', !mSrc.includes("'已遭遇 ✕0'"));
ok('menus.js 讨伐行 ✕${hero.bestiary[n]} 零回归（got 分支未动）', mSrc.includes('`讨伐 ✕${hero.bestiary[n]}`'));

// —— 运行期实证：真实 startBattle 链（模块真实导入）——
ok('新档 hero.seen 为空（v19.41 字段未预置，计 0 起步）', !S.G.seen || Object.keys(S.G.seen).length === 0);
startBattle({ name: '史莱姆', hp: 16, atk: 5, def: 2, xp: 8, gold: 8, color: '#7fd84f', draw: 'slime' });
ok('第 1 次进战：seen[史莱姆]===1', S.G.seen && S.G.seen['史莱姆'] === 1, S.G.seen && S.G.seen['史莱姆']);
startBattle({ name: '史莱姆', hp: 16, atk: 5, def: 2, xp: 8, gold: 8, color: '#7fd84f', draw: 'slime' });
ok('第 2 次进战：seen[史莱姆]===2（计数递增而非布尔）', S.G.seen['史莱姆'] === 2, S.G.seen['史莱姆']);
startBattle({ name: '史莱姆', hp: 16, atk: 5, def: 2, xp: 8, gold: 8, color: '#7fd84f', draw: 'slime' });
ok('第 3 次进战：seen[史莱姆]===3', S.G.seen['史莱姆'] === 3, S.G.seen['史莱姆']);
startBattle({ name: '幽冥魔王·真身', hp: 260, atk: 13, def: 9, xp: 40, gold: 60, color: '#b06ff0', draw: 'boss' });
ok('真身经 canonicalName 归一：seen[幽冥魔王]===1 且无「·真身」键（与 bestiary 同口径）',
  S.G.seen['幽冥魔王'] === 1 && !S.G.seen['幽冥魔王·真身'] && !Object.keys(S.G.seen).some((k) => k.includes('·真身')),
  JSON.stringify(S.G.seen));
ok('bestiary 零影响：仍为空（碰过≠击败，计数不污染讨伐记录）', !S.G.bestiary || Object.keys(S.G.bestiary).length === 0);

// —— 旧档兼容实证：布尔 true 经 |0 归一为 1（v19.41 旧档只有 { 名: true }）——
S.G.seen['哥布林'] = true;
ok('(true|0)===1（旧档布尔 → 图鉴显示 ✕1，不显示 NaN/true）', ((S.G.seen['哥布林']) | 0) === 1);
ok('(undefined|0)===0（未遭遇 → 0，不显示 NaN）', ((S.G.seen['毒蛇'] || 0) | 0) === 0);

// —— 图鉴渲染实证：drawCodex 已遭遇行显示真实 ✕N，讨伐行零回归 ——
S.G.bestiary = { 野狼: 2 }; // 讨伐 2 次，使 rows 分支生效（图鉴既有的「有记录才渲染」行为，非本版改动）
S.codexScroll = 0;
drawn.length = 0;
try { drawCodex(); } catch (e) { ok('drawCodex 渲染无异常', false, 'THREW: ' + e.message); }
ok('图鉴已遭遇行显示「已遭遇 ✕3」（史莱姆撞见 3 次）', drawn.some((t) => t.includes('已遭遇 ✕3')));
ok('图鉴已遭遇行显示「已遭遇 ✕1」（哥布林：旧档布尔 true 归一为 1）', drawn.some((t) => t.includes('已遭遇 ✕1')));
ok('图鉴讨伐行显示「讨伐 ✕2」（野狼 got 分支零回归）', drawn.some((t) => t.includes('讨伐 ✕2')));
ok('未遭遇到的行不显示「已遭遇 ✕N」假计数（骷髅兵等仍 未讨伐 占位）', drawn.some((t) => t.includes('未讨伐')));
ok('无「已遭遇 ✕0」残留渲染（写死 0 已被真实计数取代）', !drawn.some((t) => t.includes('已遭遇 ✕0')));
ok('图鉴页脚记忆收录零回归（1/13 种讨伐——bestiary 只记了野狼 1 种）', drawn.some((t) => t.includes('记忆收录：1/13')));

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2137_seencount', readme.includes('smoke_v2137_seencount'));
ok('README 件套口径存在性（v21.7 去硬化惯例：不再断言精确件数「三十三件套/三十二件套清除」，实件数由最新版冒烟守护——v21.44 起为四十件套）',
  readme.includes('冒烟') && readme.includes('件套清除）') && !readme.includes('includes(\'三十三件套\')'));
ok('README 含 v21.37 守护描述（图鉴已遭遇计数化）', readme.includes('v21.37'));
ok('README 系统清单已同步「已遭遇 ✕N」计数口径', readme.includes('已遭遇 ✕N'));
ok('package.json 已收录 smoke_v2137_seencount（npm test 串跑第 33 份）',
  pkg.includes('smoke_v2137_seencount.mjs'));
const s2136 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2136_granny.mjs'), 'utf8');
ok('smoke_v2136 的 README 件套口径断言已去硬化（v21.7 惯例：不再以「三十二件套/三十一件套清除」写字面件数，实件数由本版冒烟守护）',
  s2136.includes("includes('冒烟')") && s2136.includes("includes('件套')") && !s2136.includes("includes('三十一件套清除')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
