// v21.51 专项冒烟：精英「石心魔像」攻击成长 [12,3]→[12,2]（数值平衡·推荐等级名副其实）。
// 背景：atk [12,3] 时 Lv3 登场即 atk 21，对推荐装备（铜剑+皮甲 def 13）的 Lv3 玩家（满血 59）
// 一击均伤 29——均值两击 58 贴线、含 ±10% 浮动上限 32×2=64 ≥ 59，满血两发高飞拳直接带走、
// 连喝药窗口都没有（40000 场蒙特卡洛单场死亡率 35.8%；中期模拟雾语林 10 场连刷死亡 14.7%、
// 99% 凶手是它）——与「⚠ 此敌有些棘手」（threat 1，v21.47 口径）和 v3.26「石甲机制怪不该同时是
// 纯数值最强」原则直接矛盾（v20.9 残焰魔像校准的精英标尺是「重击占满血 92%、满血可存活」，
// 它的普攻两击却已越线）。收为 [12,2] 后：Lv3 atk 18（均伤 23、浮动上限 25×2=50 < 59，
// 满血两击可存活、三击才倒——玩家有喝药/防御窗口），死亡率 →0.6% 而场均喝药 ≈1 瓶
// （威胁降级为「资源压力」而非「即死轮盘」）。def [15,2] 铁壁身份、hp [58,10]、报酬、
// ELITE_GATE_LV/ELITE_CHANCE、石甲 acts 全部未动。属性遇敌时现算，旧档零迁移。
// 本冒烟守护：版本锚点、数据层落位与旧值零残留、设计标尺（满血两击可存活·含浮动上限）
// 及其对旧值的判别力、单一数据源（eliteEncounter/codexStats 同源跟随）、威胁预警口径零回归
// （v21.47）、运行期蒙特卡洛（真实 eliteEncounter+pickAct+cmdDmg：死亡率 <3%、资源压力保留）、
// 同图普通怪/残焰魔像/门槛/概率零回归、README/package.json 同步、smoke_v2150 件套断言去硬化确认。
import { S } from '../js/state.js';
import { GAME_VERSION, ELITE_GOLEM, EMBER_GOLEM, MON_BASE, SPECIES, ELITE_GATE_LV, ELITE_CHANCE, SKILL_DATA, SHIELD_MULT, POTION_HP_PCT, POTION_HP_FLAT, baseStats } from '../js/data.js';
import { startBattle } from '../js/battle.js';
import { eliteEncounter } from '../js/encounter.js';
import { pickAct } from '../js/enemyAI.js';
import { cmdDmg, codexStats } from '../js/rules.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v21.50 冒烟先例：先装桩再 import main.js）——
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

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.51 精英石心魔像攻击成长收口（[12,3]→[12,2]） 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.50）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.50', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 51)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.51 注释（精英石心魔像攻击成长收口）', dSrc.includes('v21.51 数值平衡：精英「石心魔像」攻击成长'));

// —— 数据层落位与零回归 ——
ok('ELITE_GOLEM.atk 落位 [12,2]（基础 12 未动，仅成长 3→2）',
  ELITE_GOLEM.atk[0] === 12 && ELITE_GOLEM.atk[1] === 2, JSON.stringify(ELITE_GOLEM.atk));
ok('ELITE_GOLEM 其余字段零回归（hp[58,10]/def[15,2]/xp[40,6]/gold[45,6]/颜色）',
  ELITE_GOLEM.hp[0] === 58 && ELITE_GOLEM.hp[1] === 10 &&
  ELITE_GOLEM.def[0] === 15 && ELITE_GOLEM.def[1] === 2 &&
  ELITE_GOLEM.xp[0] === 40 && ELITE_GOLEM.xp[1] === 6 &&
  ELITE_GOLEM.gold[0] === 45 && ELITE_GOLEM.gold[1] === 6 &&
  ELITE_GOLEM.color === '#6b8cb0' && ELITE_GOLEM.name === '石心魔像');
ok('data.js 旧基准 atk:[12,3] 源级零残留', !dSrc.includes('atk:[12,3]'));

// —— 设计标尺：Lv3 推荐装备（铜剑+皮甲 def 13，满血 59）满血两击可存活（含浮动上限）——
const bs3 = baseStats(3);
const golemAtk3 = ELITE_GOLEM.atk[0] + 3 * ELITE_GOLEM.atk[1]; // 18
const heroDef3 = bs3.def + 4; // 皮甲 4 → 13
const hitAvg = cmdDmg(golemAtk3, heroDef3, 1, false);          // 无浮动档恒等于裸公式 23
const hitMax = Math.round(Math.max(1, golemAtk3 * 2 - heroDef3) * 1.1); // 浮动上限 25
ok('设计标尺：Lv3 精英均伤 23（18×2-13）且无浮动两击 46 < 满血 59',
  golemAtk3 === 18 && hitAvg === 23 && hitAvg * 2 < bs3.hpMax, `atk=${golemAtk3} hit=${hitAvg} hp=${bs3.hpMax}`);
ok('设计标尺：含浮动上限两击 50 < 满血 59（满血硬打不再被两发带走，有喝药/防御窗口）',
  hitMax === 25 && hitMax * 2 < bs3.hpMax, `hitMax=${hitMax}`);
// 判别力：旧成长 3 时同一标尺失守（atk 21 → 均伤 29、上限 32×2=64 ≥ 59）——证明断言能抓住回退
const oldAtk3 = ELITE_GOLEM.atk[0] + 3 * 3; // 21
const oldHitMax = Math.round(Math.max(1, oldAtk3 * 2 - heroDef3) * 1.1); // 32
ok('判别力：旧成长 3 时同一标尺失守（atk 21、上限 32×2=64 ≥ 59）——断言具备回退判别力',
  oldAtk3 === 21 && cmdDmg(oldAtk3, heroDef3, 1, false) === 29 && oldHitMax * 2 >= bs3.hpMax,
  `oldAtk=${oldAtk3} oldHitMax=${oldHitMax}`);

// —— 单一数据源：遇敌生成与图鉴参考同读 ELITE_GOLEM（改一处全跟随）——
S.G = { name: '测试者', level: 3, map: 'dungeon', hp: 59, hpMax: 59, mp: 24, mpMax: 24, atkMax: 17, defMax: 13,
  gold: 0, xp: 0, xpNext: 9999, item: 0, potion: 3, potion2: 0, weapon: null, armor: null, diff: null,
  skills: [], poison: 0, seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, x: 1, y: 1 };
const gen = eliteEncounter();
ok('运行期：eliteEncounter Lv3 生成 atk===18（12+3×2，与表同源）且精英标记/石甲 acts 合入',
  gen.atk === 18 && gen.isElite === true && (gen.acts || []).some((a) => a.type === 'shield'),
  JSON.stringify({ atk: gen.atk, acts: gen.acts }));
ok('运行期：codexStats(石心魔像,3) 同源跟随（atk===18，图鉴参考自动随源更新）',
  codexStats('石心魔像', 3).atk === 18, JSON.stringify(codexStats('石心魔像', 3)));

// —— 威胁预警口径零回归（v21.47）：无 heavy 招 → 仍「有些棘手」，不升级「明显强于你」——
function warnOf(enemy, hero) {
  S.G = hero; S.G.map = hero.map;
  startBattle(enemy);
  const line = S.blog[0] || '';
  S.enemy = null; S.scene = 'world';
  return line;
}
const wGolem = warnOf(eliteEncounter(), { name: '测试者', level: 3, hp: 66, hpMax: 66, mp: 30, mpMax: 30, atkMax: 17, defMax: 14,
  gold: 0, xp: 0, item: 0, potion2: 0, weapon: null, armor: null, diff: null,
  seen: {}, bestiary: {}, chests: [], fragments: [], x: 1, y: 1, map: 'village' });
ok('运行期：Lv3 遭遇石心魔像 → 仍「此敌有些棘手」（v21.47 口径零回归，不升级）',
  wGolem.includes('石心魔像') && wGolem.includes('有些棘手') && !wGolem.includes('明显强于你'), wGolem);

// —— 运行期蒙特卡洛：真实 eliteEncounter + pickAct + cmdDmg + 药水/技能常量 ——
// 玩家策略（与 /tmp 中期模拟同源）：hp ≤ 40% 且有余药 → 喝药（耗回合）；否则最强可负担技能
// （冰霜击 2.2 > 火焰斩 1.8），蓝不够普攻；石甲减伤按 battle.attackMove 同式（先削层再 ×SHIELD_MULT）。
const TRIALS = 4000;
let mcDead = 0, mcPot = 0;
for (let t = 0; t < TRIALS; t++) {
  const b = baseStats(3);
  const h = { hp: b.hpMax, hpMax: b.hpMax, mp: b.mpMax, mpMax: b.mpMax, atkMax: b.atk + 4, defMax: b.def + 4, potion: 3 };
  S.G = { level: 3, map: 'dungeon' };
  const e = eliteEncounter();
  let r = 0;
  while (h.hp > 0 && e.hp > 0 && r < 100) {
    r++;
    if (h.hp <= h.hpMax * 0.4 && h.potion > 0) {
      h.potion--; mcPot++;
      h.hp = Math.min(h.hpMax, h.hp + Math.floor(h.hpMax * POTION_HP_PCT) + POTION_HP_FLAT);
    } else {
      const sk = h.mp >= SKILL_DATA['冰霜击'].mp ? SKILL_DATA['冰霜击']
        : h.mp >= SKILL_DATA['火焰斩'].mp ? SKILL_DATA['火焰斩'] : null;
      let dmg;
      if (sk) { h.mp -= sk.mp; dmg = Math.max(1, Math.round(Math.max(1, h.atkMax * 2 - e.def) * sk.mult * (0.9 + Math.random() * 0.2))); }
      else dmg = cmdDmg(h.atkMax, e.def, 1, true);
      if ((e.shield || 0) > 0) { e.shield--; dmg = Math.max(1, Math.round(dmg * SHIELD_MULT)); } // battle.attackMove 同式
      e.hp -= dmg;
    }
    if (e.hp <= 0) break;
    const act = pickAct(e); // 真实敌方选招（attack 55 / shield 45·血<50%·至多3层）
    if (act.type === 'shield') e.shield = (e.shield || 0) + 1;
    else h.hp -= cmdDmg(e.atk, h.defMax, 1, true);
  }
  if (h.hp <= 0) mcDead++;
}
const deathPct = mcDead / TRIALS * 100;
ok(`运行期蒙特卡洛：${TRIALS} 场 Lv3 推荐装备精英单场死亡率 < 3%（实测约 0.6%，旧值约 35.8%）`,
  deathPct < 3, `death=${deathPct.toFixed(2)}%`);
ok('运行期蒙特卡洛：精英仍构成资源压力（场均喝药 ≥ 0.5 瓶——威胁降级而非白给）',
  mcPot / TRIALS >= 0.5, `potions=${(mcPot / TRIALS).toFixed(2)}`);

// —— 同图生态与门槛/概率零回归 ——
const stone = MON_BASE.find((m) => m.name === '石魔像');
ok('同图普通怪零回归：石魔像 atk [8,2] 未动（普通遭遇曲线不受影响）',
  stone.atk[0] === 8 && stone.atk[1] === 2);
ok('残焰魔像零回归：EMBER_GOLEM.atk===44（v20.9 回廊精英校准未动）', EMBER_GOLEM.atk === 44);
ok('出没门槛/概率零回归：ELITE_GATE_LV===3 且 ELITE_CHANCE===0.07',
  ELITE_GATE_LV === 3 && ELITE_CHANCE === 0.07);
ok('石甲机制身份零回归：acts 仍 attack/shield 无 heavy（v3.26 机制怪定位未动）',
  !(SPECIES['石心魔像'].acts || []).some((a) => a.type === 'heavy') &&
  (SPECIES['石心魔像'].acts || []).some((a) => a.type === 'shield'));

// —— README / package.json 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
ok('README tests 树收录 smoke_v2151_elitegolem', readme.includes('smoke_v2151_elitegolem'));
// v21.52 去硬化（v21.7 惯例）：件套精确计数移交当版冒烟守护，本件改存活性口径——
// 仍含「冒烟/件套」且旧口径「（四十六件套清除）」已清除。
ok('README 件套口径为存活性断言（v21.52 起件数由新版冒烟守护：四十八件套（四十七件套清除））',
  readme.includes('冒烟') && readme.includes('件套') &&
  !readme.includes('（四十六件套清除）'));
ok('README 含 v21.51 守护描述（精英石心魔像攻击成长收口守护）', readme.includes('精英石心魔像攻击成长收口守护'));
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('package.json 已收录 smoke_v2151_elitegolem（npm test 串跑第 47 份）', pkg.includes('smoke_v2151_elitegolem.mjs'));

// —— smoke_v2150 的 README 件套口径断言已去硬化（v21.7 惯例）——
const s2150 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2150_burnhint.mjs'), 'utf8');
ok('smoke_v2150 的 README 件套口径断言已去硬化（存活性口径落位，旧精确表达式零残留）',
  s2150.includes("!readme.includes('（四十五件套清除）')") &&
  !s2150.includes("readme.includes('四十六件套（四十五件套清除）')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
