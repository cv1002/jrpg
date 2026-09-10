// v21.78 专项冒烟：图鉴页脚补「已遭遇 X/13」汇总——v21.37 起图鉴每行已遭遇未讨伐者标真实「已遭遇 ✕N」，
// 但页脚只有「记忆收录 X/13（已讨伐种类数）/累计讨伐（只数）」，没有「至少撞见过几种」的总数——玩家
// 想知道「还剩几种从没碰到过」只能逐行数 ❓ 或数「⚠️ 尚未讨伐」；本版在页脚「累计讨伐」行并列补
// 「已遭遇：N/13」（menus.drawCodex，与每行 seenCt 同读 hero.seen 计数、BESTIARY_TARGET 同源派生，
// 真身经 canonicalName 归一与讨伐同口径——见过 vs 打过双口径一眼可见）。纯显示零结算零存档变化。
// 本冒烟守护：版本锚点、源级落位（met 派生 + 页脚新文案）、运行期实证（三档：全未知 0/13 →
// 部分撞见 → 全撞见）、真实 startBattle 链（seen 计数与页脚同源）、行宽预算、README/package 同步、
// smoke_v2177/smoke_v2176 README 件套口径随新现实更新。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.37 冒烟先例：先装桩再 import main.js；ctx 记录所有 fillText）——
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
const { GAME_VERSION, BESTIARY_TARGET } = await import('../js/data.js');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.78 图鉴页脚已遭遇汇总 冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.77 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.77', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 78)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.78 注释（图鉴页脚已遭遇汇总说明）', dSrc.includes('v21.78'));

// —— 源级落位：met 派生与页脚新文案，旧页脚文案零残留 ——
const mSrc = fs.readFileSync(path.join(ROOT, 'js/view/menus.js'), 'utf8');
ok('menus.js 含 v21.78 注释（已遭遇汇总说明）', mSrc.includes('v21.78'));
ok('menus.js met 派生落位：BESTIARY_TARGET.filter + hero.seen 计数 + |0 归一', 
  mSrc.includes('const met=BESTIARY_TARGET.filter(n=>((hero.seen||{})[n]|0)>0).length;'));
ok('menus.js 页脚已并入「已遭遇：${met}/${BESTIARY_TARGET.length}」', 
  mSrc.includes('已遭遇：${met}/${BESTIARY_TARGET.length}'));
ok('menus.js 旧页脚文案「累计讨伐：${total}   ·   额外掉落」零残留（已并入新行）', 
  !mSrc.includes('`累计讨伐：${total}   ·   额外掉落'));
ok('menus.js 每行 seenCt 口径零回归（仍读 hero.seen |0 归一）', mSrc.includes('seenCt:((hero.seen||{})[n])|0'));

// —— 行宽预算（纯估算，零依赖；系数沿 v21.11/v21.37 官方冒烟标定口径）——
// 页脚行 14px 居中 x=320，面板右缘 560 → 半宽 240、全长 480（面板 80..560）
const estW = (s, size) => {
  let wsum = 0;
  for (const ch of String(s || '')) {
    const code = ch.codePointAt(0);
    const wide = (code >= 0x2e80 && code <= 0x9fff) || (code >= 0x3000 && code <= 0x303f) || (code >= 0xff00 && code <= 0xffef) || code >= 0x1f000;
    if (wide) wsum += 0.865 * size;
    else if (code === 0xb7) wsum += 0.303 * size;
    else if (code === 0xd7) wsum += 0.564 * size;
    else if (code === 0x25) wsum += 0.827 * size;
    else if (code === 0x2b) wsum += 0.543 * size;
    else if (code === 0x2d) wsum += 0.432 * size;
    else if (code === 0x2f) wsum += 0.338 * size;
    else if (code === 0x2e) wsum += 0.226 * size;
    else if (code >= 0x30 && code <= 0x39) wsum += 0.63 * size;
    else if (code === 0x20) wsum += 0.263 * size;
    else wsum += 0.55 * size;
  }
  return wsum;
};
const TOTAL_STR = '累计讨伐：123';
const MET_STR = '已遭遇：' + BESTIARY_TARGET.length + '/' + BESTIARY_TARGET.length;
const DROP_STR = '额外掉落：45';
const footW = estW(TOTAL_STR + '   ·   ' + MET_STR + '   ·   ' + DROP_STR, 14);
ok('页脚行估算宽 ≤480（≥' + estW(TOTAL_STR + '   ·   ' + MET_STR + '   ·   ' + DROP_STR, 14).toFixed(0) + 'px，面板 80..560 全长 480）',
  footW <= 480, `≈${footW.toFixed(1)}`);

// —— 运行期实证：真实 startBattle 链（模块真实导入，seen 计数与页脚同源）——
// 经 state.js 单例读取 S.G
const { S } = await import('../js/state.js');
ok('新档 hero.seen 为空（计 0 起步）', !S.G.seen || Object.keys(S.G.seen).length === 0);

// 档一：全新档，0 撞见 → 页脚「已遭遇：0/13」
S.G.bestiary = {};
S.codexScroll = 0;
drawn.length = 0;
try { drawCodex(); } catch (e) { ok('drawCodex 渲染无异常（全未知档）', false, 'THREW: ' + e.message); }
ok('全未知档页脚「已遭遇：0/' + BESTIARY_TARGET.length + '」（还没碰到任何怪）',
  drawn.some((t) => t.includes('已遭遇：0/' + BESTIARY_TARGET.length)), drawn.filter((t) => t.includes('已遭遇')).join(' | '));
ok('全未知档「记忆收录：0/' + BESTIARY_TARGET.length + '」零回归', drawn.some((t) => t.includes('记忆收录：0/' + BESTIARY_TARGET.length)));

// 档二：真实进战史莱姆 3 次 + 幽冥魔王真身 1 次（canonicalName 归一到「幽冥魔王」）
startBattle({ name: '史莱姆', hp: 16, atk: 5, def: 2, xp: 8, gold: 8, color: '#7fd84f', draw: 'slime' });
startBattle({ name: '史莱姆', hp: 16, atk: 5, def: 2, xp: 8, gold: 8, color: '#7fd84f', draw: 'slime' });
startBattle({ name: '幽冥魔王·真身', hp: 260, atk: 13, def: 9, xp: 40, gold: 60, color: '#b06ff0', draw: 'boss' });
ok('真实进战链：seen[史莱姆]===2（两次）', S.G.seen && S.G.seen['史莱姆'] === 2, JSON.stringify(S.G.seen));
ok('真实进战链：seen[幽冥魔王]===1 且真身键归一（无「·真身」键）',
  S.G.seen && S.G.seen['幽冥魔王'] === 1 && !Object.keys(S.G.seen).some((k) => k.includes('·真身')));
S.G.bestiary = { 野狼: 2 }; // 讨伐 2 次，使 got 分支生效
S.codexScroll = 0;
drawn.length = 0;
try { drawCodex(); } catch (e) { ok('drawCodex 渲染无异常（部分撞见档）', false, 'THREW: ' + e.message); }
ok('部分撞见档页脚「已遭遇：2/' + BESTIARY_TARGET.length + '」（史莱姆 + 幽冥魔王 两种撞见）',
  drawn.some((t) => t.includes('已遭遇：2/' + BESTIARY_TARGET.length)), drawn.filter((t) => t.includes('已遭遇')).join(' | '));
ok('部分撞见档「已遭遇 ✕2」行级零回归（史莱姆）', drawn.some((t) => t.includes('已遭遇 ✕2')));
ok('部分撞见档「已遭遇 ✕1」行级零回归（幽冥魔王）', drawn.some((t) => t.includes('已遭遇 ✕1')));
ok('部分撞见档「记忆收录：1/' + BESTIARY_TARGET.length + '」零回归（bestiary 只记野狼）',
  drawn.some((t) => t.includes('记忆收录：1/' + BESTIARY_TARGET.length)));

// 档三：全 13 种撞见（含未讨伐）→ 页脚「已遭遇：13/13」且「记忆收录」独立
const allSeen = {};
for (const nm of BESTIARY_TARGET) allSeen[nm] = 1;
S.G.seen = allSeen;
S.G.bestiary = { 野狼: 2 };
S.codexScroll = 0;
drawn.length = 0;
try { drawCodex(); } catch (e) { ok('drawCodex 渲染无异常（全撞见档）', false, 'THREW: ' + e.message); }
ok('全撞见档页脚「已遭遇：' + BESTIARY_TARGET.length + '/' + BESTIARY_TARGET.length + '」',
  drawn.some((t) => t.includes('已遭遇：' + BESTIARY_TARGET.length + '/' + BESTIARY_TARGET.length)), drawn.filter((t) => t.includes('已遭遇')).join(' | '));
ok('全撞见档「记忆收录：1/' + BESTIARY_TARGET.length + '」独立（见过≠打过双口径）',
  drawn.some((t) => t.includes('记忆收录：1/' + BESTIARY_TARGET.length)));

// —— README / package.json / 既有冒烟随新现实同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2178_codexseen', readme.includes('smoke_v2178_codexseen'));
ok('README 件套口径为九十六件套（九十五件套清除）', readme.includes('九十六件套（九十五件套清除）'));
ok('README 含 v21.78 守护描述（图鉴页脚已遭遇汇总）', readme.includes('v21.78'));
ok('README 系统清单已同步「已遭遇 X/13」页脚口径', readme.includes('已遭遇 X/13'));
ok('package.json 已收录 smoke_v2178_codexseen（npm test 串跑第 74 份）', pkg.includes('smoke_v2178_codexseen.mjs'));
const s2177 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2177_elites.mjs'), 'utf8');
ok('smoke_v2177 的 README 件套口径断言已随新现实更新（七十六件套落位，两代前 pin 七十四件套零残留）',
  s2177.includes('九十六件套（九十五件套清除）') && !s2177.includes('七十四件套（七十三件套清除）'));
const s2176 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2176_allchests.mjs'), 'utf8');
ok('smoke_v2176 的 README 件套口径断言已随新现实更新（七十五件套 pin 零残留，七十六件套落位）',
  s2176.includes('九十六件套（九十五件套清除）') && !s2176.includes('七十五件套（七十四件套清除）'));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
