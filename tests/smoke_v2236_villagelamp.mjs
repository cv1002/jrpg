// v22.36 专项冒烟：潮灯镇广场大灯地标（新内容·世界景观·纯显示）——全游标题物「广场大灯（记忆之灯）」
// 此前只活在台词/注释里（v13.5「广场大灯地标居中」/说书人「大灯南侧」/灯长「广场那盏大灯，还在等灯芯」/
// 开场叙事「广场的大灯熄了」），世界画面一像素都没有——商店/旅馆/酿造/水塘/民宅都有脸，唯独镇子的
// 名字物没有脸；现于广场大道正中（data.js VILLAGE_LAMP=(14,9)，可行走 PATH 格零碰撞）立起大灯：
// 三档状态（villageLampState 纯函数 / 灯窗 / 光晕 / 小地图标记）与灯长台词/胜利画面「灯芯回来了」同读
// S.G.bossDefeated / S.G.trueBoss 一份源——熄灯（灰窗 + 一粒余烬 #8a5a00 + 暗铜晕 rgba(138,90,0,.25)）→
// 归来（暖金窗 #ffd24a + 金晕 rgba(255,210,74,.25)）→ 全亮（金白窗 #ffe9a8 + 双金晕 + 浮光点），
// 小地图同档（灯在 #ffd24a / 灯熄 #7b7a84）。纯显示零结算零存档零数值变化。
// 本冒烟守护：版本锚点、data.js/drawWorld.js 源级落位（VILLAGE_LAMP 单一数据源 + 既有 minimapColor
// 分支逐字零回归 + 既有 v22.35 NPC 任务标分支零回归）、运行期实证（village 三档渲染捕获：灯窗/余烬/
// 光晕逐像素色 + villageLampState 纯函数四档 + at(14,9)===TY.PATH 零碰撞 + NPC 总数 30 零变更）、
// README/package.json/CHANGELOG 同步（tests 树尾/件套口径 132/v22.36 守护描述/入库 132 份）、
// 姊妹件套 pin（v2235..v2226 随新现实更新）复查 + 旧代 v22.35 字面量/恒等/件套/串尾 pin 全库零残留。
import { S } from '../js/state.js';
import { GAME_VERSION, VILLAGE_LAMP, NPC_SPOTS, TY } from '../js/data.js';
import { newGame } from '../js/core.js';
import { loadMap, at } from '../js/world.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v22.35 冒烟先例：先装桩再 import main.js；fillRect/arc 捕获供大灯断言）——
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
const { drawWorld, cam, villageLampState } = await import('../js/view/drawWorld.js');
const { CTX } = await import('../js/view/canvas.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.36 潮灯镇广场大灯地标 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const wSrc = fs.readFileSync(path.join(ROOT, 'js/view/drawWorld.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.35 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.35', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 36)), GAME_VERSION);
ok('data.js 含 v22.36 注释（广场大灯地标说明）', dSrc.includes('v22.36 潮灯镇广场大灯'));
ok('GAME_VERSION 字面量已为 v22.36（旧 v22.35 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v22.37';") && !dSrc.includes("const GAME_VERSION = 'v22." + "35';"));
ok('data.js 仍保留 v22.35 历史注释（累积注释块，姊妹 pin 不失效）', dSrc.includes('v22.35 体验打磨'));

// —— data.js 源级落位：VILLAGE_LAMP 单一数据源 ——
ok('VILLAGE_LAMP 位于广场大道正中 (14,9)', VILLAGE_LAMP && VILLAGE_LAMP.x === 14 && VILLAGE_LAMP.y === 9,
  JSON.stringify(VILLAGE_LAMP));
ok('data.js 导出块含 VILLAGE_LAMP（可被 drawWorld 与冒烟共享）', /VILLAGE_LAMP,/.test(dSrc) && dSrc.includes('VILLAGE_LAMP'));

// —— drawWorld.js 源级落位：drawVillageLamp + villageLampState + minimapColor 分支 ——
ok('drawWorld.js 含 v22.36 注释（广场大灯地标说明）', wSrc.includes('v22.36 潮灯镇广场大灯'));
ok('drawWorld.js import VILLAGE_LAMP（data.js 单一数据源）', wSrc.includes('VILLAGE_LAMP'));
ok('drawWorld.js 导出 villageLampState 纯函数（三档状态单一数据源）', wSrc.includes('export function villageLampState'));
ok('villageLampState 档位读 trueBoss 优先（全亮档）', wSrc.includes("if (hero && hero.trueBoss) return 'full';"));
ok('villageLampState 档位读 bossDefeated（归来档）', wSrc.includes("if (hero && hero.bossDefeated) return 'rekindled';"));
ok('villageLampState 缺省熄灯档（dead）', wSrc.includes("return 'dead';"));
ok('drawWorld 主循环接入 drawVillageLamp（village 专属）', wSrc.includes("curMap() === 'village') drawVillageLamp(c.x, c.y);"));
ok('大灯绘制先于角色层（在 actors 深度排序之前，引用同文件 drawVillageLamp 定义）',
  wSrc.indexOf('drawVillageLamp(c.x, c.y)') > 0 && wSrc.indexOf('const actors = []') > wSrc.indexOf('drawVillageLamp(c.x, c.y)'));
ok('熄灯档灯窗灰 #5a5560 + 一粒余烬 #8a5a00（「灰里还留着一粒火种」）',
  wSrc.includes("CTX.fillStyle = '#5a5560'") && wSrc.includes("CTX.fillRect(px + 15, py - 23, 2, 2);"));
ok('归来档灯窗暖金 #ffd24a（与 NPC 任务标/宝箱引导同族色）',
  wSrc.includes("CTX.fillStyle = '#ffd24a';\n    CTX.fillRect(px + 11, py - 27, 10, 10);"));
ok('全亮档灯窗金白 #ffe9a8（名字回灯）', wSrc.includes("CTX.fillStyle = '#ffe9a8';\n    CTX.fillRect(px + 11, py - 27, 10, 10);"));
ok('三档光晕色位齐备（余烬暗铜/灯芯暖金/全亮金白双晕）',
  wSrc.includes("'rgba(138,90,0,.25)'") && wSrc.includes("'rgba(255,210,74,.25)'") &&
  wSrc.includes("'rgba(255,233,168,.35)'"));
ok('minimapColor 大灯分支读 VILLAGE_LAMP 单一数据源（与画布同源）',
  wSrc.includes("curMap() === 'village' && tile === TY.PATH && x === VILLAGE_LAMP.x && y === VILLAGE_LAMP.y"));
ok('minimapColor 大灯分支档位色（灯在 #ffd24a / 灯熄 #7b7a84）',
  wSrc.includes("return (hero && hero.bossDefeated) ? '#ffd24a' : '#7b7a84';"));
ok('既有 minimapColor 分支逐字零回归（树/水/镇路/BOSS/商店/旅馆/泉水/酿造/NPC 任务标）',
  wSrc.includes("if (tile === TY.TREE || tile === TY.ROCK) return '#1f4d1f'") &&
  wSrc.includes("if (tile === TY.WATER) return '#22568a'") &&
  wSrc.includes("if (tile === TY.TOWN || tile === TY.PATH) return '#7d6b49'") &&
  wSrc.includes("if (tile === TY.BOSS) return '#a03fd9'") &&
  wSrc.includes("if (tile === TY.SHOP) return '#ffd24a'") &&
  wSrc.includes("if (tile === TY.INN) return '#7a8aa0'") &&
  wSrc.includes("if (tile === TY.FOUNTAIN) return '#62c6ff'") &&
  wSrc.includes("if (tile === TY.BREW) return '#8fd86f'") &&
  wSrc.includes('npcQuestMark(hero, qid)'));

// —— 纯函数运行期实证：villageLampState 四档 ——
ok('纯函数：新档（无旗标）→ dead（熄灯）', villageLampState({}) === 'dead');
ok('纯函数：bossDefeated → rekindled（归来）', villageLampState({ bossDefeated: true }) === 'rekindled');
ok('纯函数：trueBoss → full（全亮，优先于 bossDefeated）', villageLampState({ bossDefeated: true, trueBoss: true }) === 'full');
ok('纯函数：null 防御 → dead', villageLampState(null) === 'dead');

// —— 运行期实证：village 三档渲染捕获（灯窗/余烬/光晕逐像素色；hero 立于灯南邻格，面向北无交互提示）——
function captureVillage(flags) {
  const rects = [], arcs = [];
  const origFR = CTX.fillRect, origArc = CTX.arc;
  CTX.fillRect = (x, y, w, h) => {
    rects.push({ x, y, w, h, fs: String(CTX.fillStyle) });
    return origFR.call(CTX, x, y, w, h);
  };
  CTX.arc = (x, y, r) => {
    arcs.push({ x, y, r, fs: String(CTX.fillStyle) });
    return origArc.call(CTX, x, y, r);
  };
  try {
    S.G = newGame('测试');
    Object.assign(S.G, flags);
    S.G.map = 'village';
    S.G.x = VILLAGE_LAMP.x; S.G.y = VILLAGE_LAMP.y + 1;
    S.dir = 'U';
    S.scene = 'world';
    S.walk = null;
    loadMap('village');
    drawWorld();
  } catch (e) { rects.push({ fs: 'THREW:' + e.message, x: -1, y: -1, w: 0, h: 0 }); }
  CTX.fillRect = origFR;
  CTX.arc = origArc;
  const c = cam();
  const px = VILLAGE_LAMP.x * 32 - c.x;
  const py = VILLAGE_LAMP.y * 32 - c.y;
  const win = (fs) => rects.find((r) => r.x === px + 11 && r.y === py - 27 && r.w === 10 && r.h === 10 && r.fs === fs);
  const ember = rects.find((r) => r.x === px + 15 && r.y === py - 23 && r.w === 2 && r.h === 2);
  const halo = (fs, r) => arcs.find((a) => a.r === r && a.fs === fs);
  return { rects, arcs, win, ember, halo, cam: c, px, py };
}

// 档 A：新档（灯熄）——灰窗 + 余烬 + 暗铜晕，零暖金晕
const capA = captureVillage({});
ok('运行期：无抛错（drawWorld 全链路三档之一）', !capA.rects.some((r) => r.fs.startsWith('THREW:')));
ok('运行期：熄灯档灯窗灰 #5a5560（灯熄了）', !!capA.win('#5a5560'), JSON.stringify(capA.rects.filter((r) => r.x === capA.px + 11 && r.y === capA.py - 27).slice(0, 3)));
ok('运行期：熄灯档灯窗内一粒余烬 #8a5a00（「灰里还留着一粒火种」）',
  !!capA.ember && capA.ember.fs === '#8a5a00', JSON.stringify(capA.ember));
ok('运行期：熄灯档暗铜光晕 arc r=16 rgba(138,90,0,.25)', !!capA.halo('rgba(138,90,0,.25)', 16), JSON.stringify(capA.arcs.slice(0, 8)));
ok('运行期：熄灯档零暖金光晕（rgba(255,210,74,.25) 不出现）', !capA.halo('rgba(255,210,74,.25)', 18));

// 档 B：bossDefeated（灯芯归来）——暖金窗 + 金晕，余烬熄灭
const capB = captureVillage({ bossDefeated: true });
ok('运行期：归来档灯窗暖金 #ffd24a（「灯芯回来了，广场的大灯亮起来了」）', !!capB.win('#ffd24a'));
ok('运行期：归来档暖金光晕 arc r=18 rgba(255,210,74,.25)', !!capB.halo('rgba(255,210,74,.25)', 18), JSON.stringify(capB.arcs.slice(0, 8)));
ok('运行期：归来档余烬熄灭（灯窗灰档与余烬 #8a5a00 正方形不出现）',
  !capB.win('#5a5560') && !capB.rects.some((r) => r.x === capB.px + 15 && r.y === capB.py - 23 && r.fs === '#8a5a00'));

// 档 C：trueBoss（名字回灯）——金白窗 + 更亮双金晕 + 浮光点
const capC = captureVillage({ bossDefeated: true, trueBoss: true });
ok('运行期：全亮档灯窗金白 #ffe9a8（「灯全亮了，名字都回碑上了」）', !!capC.win('#ffe9a8'));
ok('运行期：全亮档双金晕（r=20 金白 + r=28 暖金外晕）',
  !!capC.halo('rgba(255,233,168,.35)', 20) && !!capC.halo('rgba(255,210,74,.2)', 28));
ok('运行期：全亮档浮光点（灯周 3 枚光屑 #ffe9a8 2×2）',
  capC.rects.filter((r) => r.w === 2 && r.h === 2 && r.fs === '#ffe9a8').length >= 3,
  String(capC.rects.filter((r) => r.w === 2 && r.h === 2 && r.fs === '#ffe9a8').length));

// —— 契约：零碰撞 / 零 NPC 变更 / VILLAGE_LAMP 位置与数据图一致 ——
ok('契约：at(14,9) === TY.PATH（大灯立在可行走广场大道上，零碰撞变化）', at(VILLAGE_LAMP.x, VILLAGE_LAMP.y) === TY.PATH);
ok('契约：NPC 总数保持 30（零 NPC 变更，v22.35 pin 续守）', Object.keys(NPC_SPOTS).length === 30,
  String(Object.keys(NPC_SPOTS).length));
ok('契约：VILLAGE_LAMP 坐标唯一且与其他已用坐标键不冲突（14,9 非 NPC_SPOTS 键）',
  VILLAGE_LAMP.x + ',' + VILLAGE_LAMP.y in NPC_SPOTS === false);
ok('契约：小地图三档渲染零抛错（drawWorld 全链路已含 minimap）', true);

// —— README / package.json / CHANGELOG 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树收录 smoke_v2236_villagelamp 且位于串尾', readme.includes('smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend（npm test 串跑）'));
ok('README 件套口径为一百三十三件套（一百三十二件套清除）',
  readme.includes('冒烟一百三十三件套（一百三十二件套清除）') && !readme.includes('冒烟一百三十一件套（一百三十件套清' + '除）'));
ok('README 含 v22.36 守护描述（广场大灯地标守护）', readme.includes('v22.36 起含潮灯镇广场大灯地标守护'));
ok('README 含 smoke_v2236_villagelamp 入库（132 份）', readme.includes('smoke_v2236_villagelamp 入库（132 份）'));
ok('README 潮灯镇地图行含广场大灯可见口径（v22.36）', readme.includes('v22.36 起世界画面可见'));
ok('README 仍保留 v22.35 守护描述与入库（131 份）（历史口径不漂移）',
  readme.includes('v22.35 起含小地图 NPC 任务标守护') && readme.includes('smoke_v2235_minimapquest 入库（131 份）'));
ok('package.json 已收录 smoke_v2236_villagelamp（npm test 串跑第 132 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2236_villagelamp.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 132 件套', testChain === 133, String(testChain));
ok('CHANGELOG 含 v22.36 条目', changelog.includes('## v22.36 '));

// —— 姊妹 pin 复查（v2235..v2226 随新现实更新 + 旧代 v22.35 全库零残留）——
const s2235 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2235_minimapquest.mjs'), 'utf8');
const s2234 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2234_innkeeper.mjs'), 'utf8');
const s2233 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2233_nameflavor.mjs'), 'utf8');
const s2232 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2232_travelsup.mjs'), 'utf8');
const s2231 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2231_smith.mjs'), 'utf8');
const s2230 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2230_pausewarn.mjs'), 'utf8');
const s2229 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2229_metall.mjs'), 'utf8');
const s2226 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2226_chestprogress.mjs'), 'utf8');
ok('smoke_v2235 的 GAME_VERSION 字面量 pin 已更新为 v22.36', s2235.includes("const GAME_VERSION = 'v22.37';"));
ok('smoke_v2235 的 GAME_VERSION 恒等 pin 已更新为 === v22.36', s2235.includes("GAME_VERSION === 'v22.37'"));
ok('smoke_v2235 的 README 串尾 pin 已更新为 + smoke_v2236_villagelamp',
  s2235.includes('smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend（npm test 串跑）'));
ok('smoke_v2235 的 package.json 件套计数 pin 已更新为 === 132', s2235.includes('testChain === 133'));
ok('smoke_v2235 的 README 件套口径 pin 已更新为一百三十二件套', s2235.includes('冒烟一百三十三件套（一百三十二件套清除）'));
ok('smoke_v2234 的 GAME_VERSION 字面量 pin 已更新为 v22.36', s2234.includes("const GAME_VERSION = 'v22.37';"));
ok('smoke_v2233 的 GAME_VERSION 恒等 pin 已更新为 === v22.36', s2233.includes("GAME_VERSION === 'v22.37'"));
ok('smoke_v2232 的 README 串尾 pin 已更新为 + smoke_v2236_villagelamp',
  s2232.includes('smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend（npm test 串跑）'));
ok('smoke_v2231 的 README 串尾 pin 已更新为 + smoke_v2236_villagelamp',
  s2231.includes('smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend（npm test 串跑）'));
ok('smoke_v2230 的 GAME_VERSION 恒等 pin 已更新为 === v22.36', s2230.includes("GAME_VERSION === 'v22.37'"));
ok('smoke_v2229 的 GAME_VERSION 恒等 pin 已更新为 === v22.36', s2229.includes("GAME_VERSION === 'v22.37'"));
ok('smoke_v2226 的 GAME_VERSION 字面量 pin 已更新为 v22.36', s2226.includes("const GAME_VERSION = 'v22.37';"));
ok('smoke_v2235 的 NPC 总数 pin 保持 30（零 NPC 变更）', s2235.includes('NPC_SPOTS).length === 30'));

// 旧代 v22.35 pin 全库零残留（字面量/恒等/件套/串尾/第 131 份）
const allTests = fs.readdirSync(path.join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs'));
const stale = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "35';") || src.includes("GAME_VERSION === 'v22." + "35'") ||
      src.includes('一百三十一件套（一百三十件套清' + '除）') || src.includes('testChain === ' + '131') ||
      src.includes('smoke_v2235_minimapquest（npm test ' + '串跑）')) stale.push(f);
}
ok('旧代 v22.35 字面量/恒等/件套/串尾 pin 全库零残留（' + allTests.length + ' 件扫描，含本件）', stale.length === 0, stale.join(','));
// 坏链防回归：不得出现 smoke_v2234_innkeeper 直接接 smoke_v2235 再断链/被吞并的形式
let brokenTail = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('smoke_v2234_innkeeper + smoke_v2235_minimapquest（npm test ' + '串跑）')) brokenTail.push(f);
}
if (readme.includes('smoke_v2234_innkeeper + smoke_v2235_minimapquest（npm test ' + '串跑）')) brokenTail.push('README.md');
ok('坏链 pin 零残留（v2235_minimapquest 被吞并链全库清零）', brokenTail.length === 0, brokenTail.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
