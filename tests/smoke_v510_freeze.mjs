// v5.1 专项冒烟：敌方冻结状态角标（纯显示回归）
// 验证：skipNext 置位时绘制 ❄️ 冻结 角标；未冻结/已消耗时不绘制；Boss/试炼/技能菜单打开时绘制无异常。
// 注意：必须用动态 import（静态 import 会被提升，先于 globalThis.document 赋值求值，
//        canvas.js 会因此走自动桩而捕获不到 fillText）。

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
const { SKILL_DATA, BOSS, CAVE_BOSS, TRUE_BOSS } = await import('../js/data.js');
const { deep } = await import('../js/rules.js');
const { startBattle } = await import('../js/battle.js');
const { drawBattle } = await import('../js/view/index.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

S.scene = 'world';
startBattle(deep(BOSS));
S.enemy.hp = S.enemy.hpMax; S.battleBusy = false;
S.enemy.skipNext = false;
drawn.length = 0;
drawBattle();
let got = drawn.some((d) => d.t.includes('❄️ 冻结'));
ok('未冻结时不绘制冻结角标', !got, JSON.stringify(drawn.filter((d) => d.t.includes('冻结'))));

S.enemy.skipNext = true;
drawn.length = 0;
drawBattle();
got = drawn.some((d) => d.t.includes('❄️ 冻结'));
ok('skipNext 置位后绘制冻结角标', got, JSON.stringify(drawn.filter((d) => d.t.includes('冻结'))));

// 冻结角标与石甲/灼烧同列（x=620 右对齐）
const freeze = drawn.find((d) => d.t.includes('❄️ 冻结'));
const burn = drawn.find((d) => d.t.includes('灼烧'));
ok('冻结角标右对齐同列 x=620', freeze && freeze.x === 620, freeze && JSON.stringify(freeze));
ok('冻结行在灼烧下行（y 更大）', !burn || (freeze && freeze.y > burn.y));

// 冻结被敌方行动消耗（skipNext 复位）后，角标消失
S.enemy.skipNext = false;
drawn.length = 0;
drawBattle();
got = drawn.some((d) => d.t.includes('❄️ 冻结'));
ok('skipNext 复位后角标消失', !got);

// 各敌方类型回归：Boss / 洞窟领主 / 终焉之神 / 精英，冻结置位时绘制均不抛错
let err = null;
try {
  for (const def of [BOSS, CAVE_BOSS, TRUE_BOSS]) {
    S.enemy = deep(def); S.enemy.hpMax = def.hpMax || def.hp; S.enemy.hp = S.enemy.hpMax;
    S.enemy.skipNext = true; S.battleBusy = false;
    drawBattle();
  }
  S.enemy = { name: '石心魔像', hp: 58, hpMax: 58, atk: 12, def: 15, xp: 40, gold: 45, color: '#6b8cb0', isElite: true, skipNext: true };
  S.battleBusy = false;
  drawBattle();
} catch (e) { err = e; }
ok('Boss/洞窟领主/终焉之神/精英冻结绘制无异常', !err, err && err.message);

// 技能菜单覆盖层打开时冻结角标仍无异常
S.enemy = deep(BOSS); S.enemy.hpMax = S.enemy.hp; S.enemy.hp = S.enemy.hpMax; S.enemy.skipNext = true;
S.battleBusy = false; S.skillMenuOpen = true;
let menuErr = null;
try { drawBattle(); } catch (e) { menuErr = e; }
S.skillMenuOpen = false;
ok('技能菜单打开时冻结绘制无异常', !menuErr, menuErr && menuErr.message);

// 冰霜击冻结路径回归
ok('冰霜击仍可冻结', (SKILL_DATA['冰霜击'].skip || 0) > 0);

console.log(`\n${n - failed}/${n} 通过` + (failed ? `，失败 ${failed}` : ''));
if (failed) process.exit(1);
