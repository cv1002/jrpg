// v21.75 专项冒烟：战斗画面普通魔物补「敌方特性」角标（体验打磨·信息透明）。
// 背景：drawBattle 的「敌方招数一览」（620,162 右对齐槽位）只覆盖持 acts 的 Boss/精英，
// 普通魔物在该位置刻意留白（「无 acts 不显示避免噪音」）——但带 SPECIES tag 的普通怪
// （毒蛇「☠️ 会施毒 · 扣血N回合」/雾灵「❄️ 雾凝成冰」）的招牌机制在战斗内全程无一字提示：
// 图鉴 tag 要已讨伐才揭示、威胁预警只报强弱不报机制，第一次撞见毒蛇的玩家只有中招后才知道
// 它会施毒。本版在无 acts 时于同一槽位直读 SPECIES[canonicalName(enemy.name)].tag 显示
// 「敌方特性：…」——调特性文案只改 data.js SPECIES 一处，图鉴 codexTag / 帮助页
// 「石心魔像·出没」行 / 战斗角标三端同源自动跟随；无 tag 的普通怪保持留白零噪音。
// 纯显示零结算零存档变化。
// 本冒烟守护：版本锚点、drawBattle.js 源级 else 分支落位 + SPECIES/canonicalName 同源读取、
// SPECIES tag 契约（毒蛇/雾灵有 tag、六种白板普通怪无 tag 零噪音、acts 强敌不进 else 分支）、
// encounter.scaleEnemy 实例不带 tag 契约（角标走 SPECIES 单一数据源）、运行期实证六档
// （毒蛇战亮「敌方特性：☠️ 会施毒 · 扣血3回合」且无招数一览 / 雾灵战亮「雾凝成冰」/
// 史莱姆战双无零噪音 / 石心魔像与幽冥魔王招数一览零回归无特性行 / 全档渲染不抛错）、
// README/package.json 同步、smoke_v2174 件套断言去硬化确认（v21.7 惯例）。
// 注意：必须用动态 import（静态 import 会被提升，先于 globalThis.document 赋值求值，
//       canvas.js 会因此走自动桩而捕获不到 fillText——承 smoke_v510 先例）。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v21.74 冒烟先例：先装桩再动态 import main.js；
//    fillText 捕获承 smoke_v510 先例：所有 ctx 共用同一 drawn 数组）——
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
    fillText: (t, x, y) => { drawn.push({ t: String(t), x, y }); },
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
const { S } = await import('../js/state.js');
const { GAME_VERSION, SPECIES, MON_BASE, POISON_TURNS, withSpecies, BOSS } = await import('../js/data.js');
const { scaleEnemy } = await import('../js/encounter.js');
const { deep } = await import('../js/rules.js');
const { drawBattle } = await import('../js/view/index.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.75 战斗画面普通魔物「敌方特性」角标 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.74）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.74', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 75)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.75 注释（战斗画面普通魔物补「敌方特性」角标说明）',
  dSrc.includes('v21.75 体验打磨：战斗画面普通魔物补「敌方特性」角标'));

// —— drawBattle.js 源级：else 分支落位 + 同源读取 ——
const dbSrc = fs.readFileSync(path.join(ROOT, 'js/view/drawBattle.js'), 'utf8');
ok('drawBattle.js 含 v21.75 注释（普通魔物「敌方特性」角标）', dbSrc.includes('v21.75 普通魔物「敌方特性」角标'));
ok('drawBattle.js 特性角标落位（`敌方特性：${spTag}` 与招数一览同槽位 620,162 右对齐同式同色）',
  dbSrc.includes('`敌方特性：${spTag}`') && dbSrc.includes("text(`敌方特性：${spTag}`, 620, 162, 'bold 11px', '#8fa8b8', 'right')"));
ok('drawBattle.js 特性读 SPECIES[canonicalName(enemy.name)].tag 单一数据源（零裸字面量）',
  dbSrc.includes('(SPECIES[canonicalName(enemy.name)] || {}).tag'));
ok('drawBattle.js 招数一览块改 if/else（特性仅在无 acts 分支，与招数一览不并存）',
  /text\(`敌方招数：\$\{tags\.join\(' \/ '\)\}`, 620, 162[\s\S]*?\}\s*else\s*\{[\s\S]*?敌方特性/.test(dbSrc));

// —— SPECIES tag 契约：毒蛇/雾灵有 tag（本版受益怪），六种白板普通怪无 tag（零噪音）——
ok("SPECIES 毒蛇 tag 契约（含「会施毒」且回合数由 POISON_TURNS 派生）",
  !!SPECIES['毒蛇'] && typeof SPECIES['毒蛇'].tag === 'string' &&
  SPECIES['毒蛇'].tag.includes('会施毒') && SPECIES['毒蛇'].tag === '☠️ 会施毒 · 扣血' + POISON_TURNS + '回合',
  SPECIES['毒蛇'] && SPECIES['毒蛇'].tag);
ok("SPECIES 雾灵 tag 契约（❄️ 雾凝成冰）",
  !!SPECIES['雾灵'] && SPECIES['雾灵'].tag === '❄️ 雾凝成冰', SPECIES['雾灵'] && SPECIES['雾灵'].tag);
ok('SPECIES 六种白板普通怪无 tag（史莱姆/野狼/骷髅兵/哥布林/树精/石魔像——留白零噪音）',
  ['史莱姆', '野狼', '骷髅兵', '哥布林', '树精', '石魔像'].every((nm) => !(SPECIES[nm] || {}).tag));
ok('acts 强敌不进 else 分支契约（石心魔像/残焰魔像/幽冥魔王/洞窟领主/终焉之神 均持 acts——招数一览原样承载）',
  ['石心魔像', '残焰魔像', '幽冥魔王', '洞窟领主', '终焉之神'].every((nm) => Array.isArray((SPECIES[nm] || {}).acts) && SPECIES[nm].acts.length > 0));

// —— encounter.scaleEnemy 契约：普通怪实例不带 tag（角标走 SPECIES 同源读取，无双份数据）——
const snakeBase = MON_BASE.find((m) => m.name === '毒蛇');
ok('scaleEnemy 实例不带 tag（毒蛇模板实例化后 tag 为 undefined——单一数据源走 SPECIES）',
  !!snakeBase && scaleEnemy(snakeBase, 3).tag === undefined);

// —— 运行期实证：drawBattle 真实渲染 + fillText 捕获 ——
function renderWith(enemy) {
  S.scene = 'battle';
  S.enemy = enemy;
  S.battleBusy = false;
  S.skillMenuOpen = false;
  S.blog = ['⚔️ 遭遇了 ' + enemy.name + '！'];
  S.blogView = 0;
  S.battleTurn = 1;
  drawn.length = 0;
  let threw = null;
  try { drawBattle(); } catch (e) { threw = e; }
  S.enemy = null;
  S.scene = 'world';
  return threw;
}
const mkSnake = () => ({ name: '毒蛇', hp: 35, hpMax: 35, atk: 14, def: 7, xp: 24, gold: 19,
  color: '#59c96b', poison: 0.35, weak: 'ice', draw: 'snake' });
const mkGhost = () => ({ name: '雾灵', hp: 39, hpMax: 39, atk: 15, def: 8, xp: 27, gold: 22,
  color: '#b48ae8', weak: 'ice', resist: 'fire', draw: 'ghost' });
const mkSlime = () => ({ name: '史莱姆', hp: 31, hpMax: 31, atk: 11, def: 5, xp: 17, gold: 12,
  color: '#7fd84f', weak: 'fire', draw: 'slime' });
const mkGolem = () => withSpecies({ name: '石心魔像', hp: 98, hpMax: 98, atk: 20, def: 23, xp: 64, gold: 69,
  color: '#6b8cb0', isElite: true });

// 1) 毒蛇战：特性角标落位 + 无招数一览
let threw1 = renderWith(mkSnake());
ok('运行期：毒蛇战渲染不抛错', threw1 === null, threw1 && String(threw1.stack || threw1));
const snakeTag = drawn.find((d) => d.t.indexOf('敌方特性：') === 0);
ok('运行期：毒蛇战亮「敌方特性：☠️ 会施毒 · 扣血3回合」（逐字 = SPECIES 同源派生）',
  !!snakeTag && snakeTag.t === '敌方特性：' + SPECIES['毒蛇'].tag, snakeTag && snakeTag.t);
ok('运行期：毒蛇特性角标与招数一览同槽位（x=620 右对齐 · y=162）',
  !!snakeTag && snakeTag.x === 620 && snakeTag.y === 162, snakeTag && JSON.stringify(snakeTag));
ok('运行期：毒蛇战无「敌方招数：」（无 acts 不进招数一览，两角标不并存）',
  !drawn.some((d) => d.t.indexOf('敌方招数：') === 0));

// 2) 雾灵战：风味特性同样亮出
let threw2 = renderWith(mkGhost());
ok('运行期：雾灵战亮「敌方特性：❄️ 雾凝成冰」且渲染不抛错',
  threw2 === null && drawn.some((d) => d.t === '敌方特性：' + SPECIES['雾灵'].tag));

// 3) 史莱姆战：无 tag 双无（留白零噪音契约）
let threw3 = renderWith(mkSlime());
ok('运行期：史莱姆战（无 tag）特性与招数一览双无（留白零噪音）且渲染不抛错',
  threw3 === null &&
  !drawn.some((d) => d.t.indexOf('敌方特性：') === 0) &&
  !drawn.some((d) => d.t.indexOf('敌方招数：') === 0));

// 4) 石心魔像战（精英·持 acts）：招数一览零回归、特性角标不出现
let threw4 = renderWith(mkGolem());
ok('运行期：石心魔像战「敌方招数：」零回归（普攻 / 石甲）且无「敌方特性」',
  threw4 === null &&
  drawn.some((d) => d.t.indexOf('敌方招数：') === 0 && d.t.includes('石甲')) &&
  !drawn.some((d) => d.t.indexOf('敌方特性：') === 0));

// 5) 幽冥魔王战（Boss·持 acts）：招数一览零回归、特性角标不出现
let threw5 = renderWith(deep(BOSS));
ok('运行期：幽冥魔王战「敌方招数：」零回归（普攻 / 重击 / 回血）且无「敌方特性」',
  threw5 === null &&
  drawn.some((d) => d.t.indexOf('敌方招数：') === 0 && d.t.includes('重击') && d.t.includes('回血')) &&
  !drawn.some((d) => d.t.indexOf('敌方特性：') === 0));

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2175_battletag', readme.includes('smoke_v2175_battletag'));
ok('README 件套口径为七十一件套（七十件套清除）', readme.includes('七十一件套（七十件套清除）'));
ok('README 含 v21.75 守护描述（战斗画面普通魔物「敌方特性」角标守护）',
  readme.includes('v21.75 起含战斗画面普通魔物「敌方特性」角标守护'));
ok('README 战斗段落同步「敌方特性」角标口径', readme.includes('敌方特性'));
ok('package.json 已收录 smoke_v2175_battletag（npm test 串跑第 71 份）', pkg.includes('smoke_v2175_battletag.mjs'));
const s2174 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2174_storye.mjs'), 'utf8');
ok('smoke_v2174 的 README 件套口径断言已去硬化（存活性口径落位，旧精确表达式零残留）',
  s2174.includes("!readme.includes('（六十九件套清除）')") &&
  !s2174.includes("readme.includes('七十件套（六十九件套清除）')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
