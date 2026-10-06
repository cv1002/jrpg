// v24.48 专项冒烟：战斗 [2] 技能战报补「🔮 熟能生巧 N/30」进度后缀（战斗五指令口径齐平）
// （体验打磨·信息透明·计数现场——承 v24.16 HUD「🚶 千里之行 N/1000」/ v24.17 喝药战报「💧 渴饮甘露
// N/10」/ v24.22 胜利战报「⚔️ 驱雾百战 N/100」/ v24.40 用药战报「💊 药到病除 N/15」同一「计数现场报
// 进度」主线 / v23.36-23.65「战斗操作」维度：五指令里程碑（以守为攻/蓄势待发/暴击如雨/熟能生巧/走为上计）
// 逐配战报，其中 v24.40 已把药到病除按 v24.17 口径翻转补后缀，而 [2]技能的「熟能生巧」（累计释放
// CAST_GOAL(30) 次，计数 hero.casts 由 battle.doSkill 施法成功唯一产生点写入、snapshotHero 全量快照
// 自动持久化、防御式 (hero.casts||0) 旧档零迁移）仍承 v23.64「零战报后缀」旧口径——技能战报（治愈/
// 伤害两分支，v23.64 计数两分支都计入）正是施法动作本身的现场，同链路的暴击/蓄力/反击/逃跑四端战报
// 早已各带 N/GOAL 进度后缀，唯独技能端裸报，同一战斗日志口径不一致；现按同族在两条施法战报末尾补
// 「（🔮 熟能生巧 N/30）」（分子读本函数计数唯一产生点已落账的 castN——hero.casts = castN 先于报文，
// 进度差分即本次；分母读 data.js CAST_GOAL 单一数据源，与 C 页/ACH_LIST cast 的 ok/prog 同读一份源，
// 调阈值只改 data.js 一处全端自动跟随；同 v24.19/v24.25 只报中档里程碑先例——本线仅此一档无姊妹档），
// 纯显示零结算零存档零数值变化（hero.casts 计数/MP 扣除/倍率/治疗/汲回/灼烧/封印拦截判定/applyAchievements
// 时机逐字未动）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.48 注释 / GAME_VERSION v24.48 与旧 v24.47 字面量
// 零残留 / v24.47 历史注释保留 / CAST_GOAL 处注释）、数据契约（CAST_GOAL 30 与 ACH_LIST cast 同源互证
// ok/prog/d 逐值·无 r 字段）、battle.js 源级（两条报文后缀逐字 + 计数/拦截/applyAchievements 零回归 +
// doItem 端口零串扰）、运行期真实 playerAction('skill', ...) 路径（治愈分支 1/30 与 2/30 逐字 · 伤害分支
// 形态断言 · 29→30 当场解锁 · 缺字段防御式 0→1 · MP 不足/尚未领悟拦截零计数）、README/package.json/
// CHANGELOG 同步（件套口径 272 + v24.48 守护描述 + smoke_v2448_castprog 入库（275 份）+ package 串尾 +
// CHANGELOG 顶 pin）、哨兵链（前望 275 且 README 尚无 275 口径）、tests 目录与实跑链一一对应（272 份）、
// 旧代 v24.47 pin 全库零残留扫描（豁免上一版套件否定式）。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v24.47 冒烟先例：先装桩再动态 import main.js）——
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
const { S } = await import('../js/state.js');
const { GAME_VERSION, CAST_GOAL, ACH_LIST } = await import('../js/data.js');
const { startBattle, playerAction } = await import('../js/battle.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.48 战斗技能战报「🔮 熟能生巧 N/30」进度后缀（战斗五指令口径齐平） 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const bSrc = read('js/battle.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.47）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.47', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] >= 48)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js 含 v24.48 注释（战斗技能战报「🔮 熟能生巧 N/30」进度后缀）',
  dSrc.includes('v24.48 体验打磨·信息透明·计数现场：🔮 战斗技能战报补'));
ok('data.js GAME_VERSION 字面量已为 v24.48（旧 v24.47 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.51';") && !dSrc.includes("const GAME_VERSION = 'v24.47';"));
ok('data.js 仍保留 v24.47 历史注释（后期经验曲线续平滑第七轮·本版保留）',
  dSrc.includes('v24.47 数值平衡·后期经验曲线续平滑'));
ok('data.js CAST_GOAL 处含 v24.48 后缀分母单一数据源注释',
  dSrc.includes('v24.48 体验打磨·信息透明·计数现场：上方阈值同时是战斗技能战报'));

// —— 数据契约：CAST_GOAL / ACH_LIST cast 同源互证 ——
ok('CAST_GOAL 数据契约（阈值单一数据源，判定/进度/描述三端同读）', CAST_GOAL === 30, String(CAST_GOAL));
const castAch = ACH_LIST.find((a) => a.id === 'cast');
ok('ACH_LIST 含 cast「熟能生巧」且 id 唯一', !!castAch && castAch.name === '熟能生巧' &&
  ACH_LIST.filter((a) => a.id === 'cast').length === 1);
ok('cast 描述/判定/进度读 CAST_GOAL 与 (g.casts||0) 防御式（三端同源零裸字面量）',
  !!castAch && castAch.d === `[2]技能累计释放 ${CAST_GOAL} 次` &&
  String(castAch.ok).includes('(g.casts||0)') && String(castAch.prog).includes('g.casts||0'));
ok('cast 无 r 字段纯里程碑（熟能生巧本身就是奖励）', !!castAch && !('r' in castAch));
ok('cast 0/29/30/60 四档谓词逐值（缺字段 0/30 旧档零迁移、超阈值不钳制）',
  castAch.ok({}) === false && castAch.prog({}) === `0/${CAST_GOAL}` &&
  castAch.ok({ casts: 29 }) === false && castAch.prog({ casts: 29 }) === `29/${CAST_GOAL}` &&
  castAch.ok({ casts: 30 }) === true && castAch.prog({ casts: 30 }) === `${CAST_GOAL}/${CAST_GOAL}` &&
  castAch.ok({ casts: 60 }) === true && castAch.prog({ casts: 60 }) === `60/${CAST_GOAL}`);

// —— battle.js 源级落位（两条报文后缀逐字 + 计数/拦截零回归 + 姊妹端口零串扰）——
ok('battle.js 含 v24.48 注释（战报进度后缀说明·五指令口径齐平）',
  bSrc.includes('v24.48 体验打磨·信息透明·计数现场') && bSrc.includes('唯独技能端裸报'));
ok('battle.js v23.64 注释块保留且标注 v24.48 翻转口径（不再「零战报后缀」独占）',
  bSrc.includes('v23.64 成就「熟能生巧」计数') && bSrc.includes('仍承 v23.64「零战报后缀」旧口径'));
ok('battle.js 治愈分支报文后缀逐字落位（🔮 熟能生巧 N/30 · 分子 castN · 分母 CAST_GOAL）',
  bSrc.includes("`💚 ${hero.name} 使出【${skillName}】，恢复 ${heal} 点 HP${extra}${charged ? '（蓄力保留）' : ''}！（HP ${hero.hp}/${hero.hpMax}）（🔮 熟能生巧 ${castN}/${CAST_GOAL}）`"));
ok('battle.js 伤害分支报文后缀逐字落位（🔮 熟能生巧 N/30 · 分子 castN · 分母 CAST_GOAL）',
  bSrc.includes("`✨ ${hero.name} 使出【${skillName}】，造成 <dmg> 伤害${note}${charged ? '（蓄力）' : ''}！（MP ${hero.mp}/${hero.mpMax}）（🔮 熟能生巧 ${castN}/${CAST_GOAL}）`"));
ok('battle.js 计数唯一产生点零回归（castN 自增 + 当场 applyAchievements）',
  bSrc.includes('const castN = (hero.casts || 0) + 1;') && bSrc.includes('hero.casts = castN;') &&
  bSrc.includes('applyAchievements();'));
ok('battle.js 两档拦截判定零回归（MP 不足 / 尚未领悟该技能）',
  bSrc.includes('❌ MP 不足！') && bSrc.includes('❌ 尚未领悟该技能'));
ok('battle.js 姊妹端口零串扰（doItem 用药报文仍只挂药到病除、不带熟能生巧）',
  bSrc.includes("`🍖 ${hero.name} 服用药水，恢复 ${result.h} 点 HP（HP ${hero.hp}/${hero.hpMax} · 药水剩余 ${hero.item} 瓶）（💊 药到病除 ${hero.potionUses || 0}/${POTION_USE_GOAL}）`") &&
  !bSrc.includes('（💊 药到病除 ${castN}/${CAST_GOAL}）'));

// —— 运行期真实 playerAction('skill', ...) 路径（承 v21.53/v21.65 桩法）——
function mkHero(extra) {
  return Object.assign({ name: '测试者', level: 1, hp: 10, hpMax: 60, mp: 30, mpMax: 30,
    atkMax: 12, defMax: 6, gold: 0, xp: 0, xpNext: 20, item: 2, potion2: 0,
    weapon: '木剑', armor: '布衣', diff: null, skills: ['治愈术', '火焰斩'],
    poison: 0, seen: {}, bestiary: {}, chests: [], fragments: [], quests: {}, x: 1, y: 1, map: 'village',
    charge: false }, extra || {});
}
function mkDoll(extra) {
  return Object.assign({ name: '练功木桩', hp: 500, hpMax: 500, atk: 5, def: 10, xp: 1, gold: 0, color: '#888888' }, extra || {});
}
function runBattleSkill(skillName, hero) {
  S.G = hero; S.G.map = 'village';
  startBattle(mkDoll());
  S.battleBusy = false;   // 测试桩：跳过开场 700ms 编排空档（enqueue 为真实 setTimeout）
  playerAction('skill', skillName);
  const line = S.blog[S.blog.length - 1] || '';
  S.enemy = null; S.scene = 'world'; S.battleBusy = false;
  return line;
}

// A 档：治愈分支（首次施法）——报文逐字带「（🔮 熟能生巧 1/30）」且计数落账 1
{
  const h = mkHero({ hp: 10, mp: 30 });
  const line = runBattleSkill('治愈术', h);
  ok('运行期：治愈分支报文逐字「💚 测试者 使出【治愈术】，恢复 33 点 HP！（HP 43/60）（🔮 熟能生巧 1/30）」',
    line === '💚 测试者 使出【治愈术】，恢复 33 点 HP！（HP 43/60）（🔮 熟能生巧 1/30）', line);
  ok('运行期：治愈分支计数落账（casts 0→1）且结算一致（hp 10→43 / mp 30→25）',
    h.casts === 1 && h.hp === 43 && h.mp === 25, `casts=${h.casts} hp=${h.hp} mp=${h.mp}`);
}
// B 档：治愈分支（第二次施法）——分子递增 2/30
{
  const h = mkHero({ hp: 10, mp: 30, casts: 1 });
  const line = runBattleSkill('治愈术', h);
  ok('运行期：治愈分支第二次报文带「（🔮 熟能生巧 2/30）」且计数 1→2',
    line === '💚 测试者 使出【治愈术】，恢复 33 点 HP！（HP 43/60）（🔮 熟能生巧 2/30）' && h.casts === 2,
    `casts=${h.casts} line=${line}`);
}
// C 档：伤害分支（火焰斩）——形态断言（伤害有 ±10% 方差不定值，逐段钉形）+ 后缀 1/30
{
  const h = mkHero({ hp: 60, mp: 30 });
  const line = runBattleSkill('火焰斩', h);
  const m = /^✨ 测试者 使出【火焰斩】，造成 (\d+) 伤害（灼烧 2 回合·每回合 -20 HP）！（MP 26\/30）（🔮 熟能生巧 1\/30）（敌方 HP 剩余 (\d+)\/500）$/.exec(line);
  ok('运行期：伤害分支报文形态逐段（✨…造成 N 伤害（灼烧 2 回合·每回合 -20 HP）！（MP 26/30）（🔮 熟能生巧 1/30）（敌方 HP 剩余 M/500））',
    !!m, line);
  ok('运行期：伤害分支结算一致（casts 0→1 / mp 30→26 / 敌方掉血=伤害值）',
    h.casts === 1 && h.mp === 26 && !!m && Number(m[2]) === 500 - Number(m[1]),
    `casts=${h.casts} mp=${h.mp}`);
}
// D 档：第 30 次施法当场解锁「熟能生巧」（applyAchievements 落 hero.ach 且战报带 30/30）
{
  const h = mkHero({ hp: 60, mp: 30, casts: 29 });
  const line = runBattleSkill('火焰斩', h);
  ok('运行期：第 30 次施法当场解锁「熟能生巧」（casts 29→30 且 ach 含 cast）',
    h.casts === 30 && (h.ach || []).includes('cast'), `casts=${h.casts} ach=${JSON.stringify(h.ach || [])}`);
  ok('运行期：达标档报文带「（🔮 熟能生巧 30/30）」（战报与解锁并存）',
    line.includes('（🔮 熟能生巧 30/30）'), line);
}
// E 档：旧档缺 casts 字段防御式（承 v19.41 seen 同款）——0→1 不抛错 1/30 起步
{
  const h = mkHero({ hp: 10, mp: 30 });
  delete h.casts;
  const line = runBattleSkill('治愈术', h);
  ok('运行期：旧档缺 casts 字段防御式（缺失→1/30 报文、零抛错、旧档零迁移）',
    h.casts === 1 && line.includes('（🔮 熟能生巧 1/30）'), `casts=${h.casts}`);
}
// F 档：MP 不足拦截零计数——报「❌ MP 不足！【火焰斩】需要 4 MP（当前 3/30）」，casts 不变
{
  const h = mkHero({ hp: 60, mp: 3 });
  const line = runBattleSkill('火焰斩', h);
  ok('运行期：MP 不足拦截档「❌ MP 不足！【火焰斩】需要 4 MP（当前 3/30）」逐字零回归且零计数（casts undefined 不变 / mp 3 不变）',
    line === '❌ MP 不足！【火焰斩】需要 4 MP（当前 3/30）' && h.casts === undefined && h.mp === 3, line);
}
// G 档：尚未领悟拦截零计数——报「❌ 尚未领悟该技能」，casts 不变
{
  const h = mkHero({ hp: 60, mp: 30, skills: ['治愈术'] });
  const line = runBattleSkill('火焰斩', h);
  ok('运行期：尚未领悟拦截档「❌ 尚未领悟该技能」逐字零回归且零计数（casts undefined 不变）',
    line === '❌ 尚未领悟该技能' && h.casts === undefined, line);
}
// H 档：谓词防御档复证——缺字段 0/30 不误解锁（旧档零迁移）
{
  ok('运行期：谓词防御档复证（缺字段 0/30 假 / 30 真 / 60 真）',
    castAch.ok({}) === false && castAch.prog({}) === `0/${CAST_GOAL}` &&
    castAch.ok({ casts: 30 }) === true && castAch.ok({ casts: 60 }) === true);
}

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为二百七十五件套（二百七十四件套清除）',
  readme.includes('冒烟二百七十五件套（二百七十四件套清除）'));
ok('README tests 含 v24.48 守护描述与 smoke_v2448_castprog 入库（275 份）',
  readme.includes('v24.48 起含 「战斗技能战报「🔮 熟能生巧 N/30」进度后缀」守护') && readme.includes('smoke_v2448_castprog 入库（275 份）'));
ok('README 战斗 [2] 技能行含 v24.48 战报进度后缀口径（**v24.48 起战斗技能战报带「🔮 熟能生巧 N/30」进度后缀**）',
  readme.includes('**v24.48 起战斗技能战报带「🔮 熟能生巧 N/30」进度后缀**'));
ok('README 成就 bullet 含 v24.48 战斗技能战报进度后缀口径',
  readme.includes('v24.48 起战斗技能战报带「🔮 熟能生巧 N/30」进度后缀'));
ok('README 尚无 275 件套口径（哨兵前望 275 语义：下一版才写 275）',
  !readme.includes('二百七十六件套') && !readme.includes('冒烟二百七十六件套'));
ok('README 仍保留 v24.47 守护描述与 v24.40 守护描述（历史保留）',
  readme.includes('v24.47 起含 「后期经验曲线续平滑（第七轮）」守护') && readme.includes('v24.40 起含 「战斗用药战报「💊 药到病除 N/15」进度后缀」守护'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 273 份（smoke.mjs + 272 专项）', chain.length === 274 && chainAll.length === 275, String(chain.length));
ok('package.json 链尾为 smoke_v2448_castprog（第 273 份）', chain[chain.length - 1] === 'smoke_v2451_sellprog', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2448_castprog.mjs（node tests/ 前缀形态）',
  pkgRaw.includes('node tests/smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs'));
ok('package.json 链锚逐字（…smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs"）',
  pkgRaw.includes('smoke_v2447_xpcurve7.mjs && node tests/smoke_v2448_castprog.mjs && node tests/smoke_v2449_xpcurve8.mjs && node tests/smoke_v2450_brewprog.mjs && node tests/smoke_v2451_sellprog.mjs"'));
ok('CHANGELOG.md 顶部条目已为 v24.48（startsWith）', changelog.startsWith('## v24.51'));
ok('CHANGELOG v24.48 条目含「熟能生巧」与「进度后缀」与「五指令」',
  changelog.includes('熟能生巧') && changelog.includes('进度后缀') && changelog.includes('五指令'));
ok('CHANGELOG 仍保留 v24.47 条目（历史保留）', changelog.includes('## v24.47'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(chainAll.map((f) => f.replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 272（271 + smoke_v2448_castprog）', files.length === 275, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链（旧代 v24.47 pin 全库零残留）——
const leftovers = [];
for (const f of files) {
  if (f === 'smoke_v2448_castprog.mjs') continue;
  // 承 v24.17/v24.40 同款豁免：上一版套件（smoke_v2447_xpcurve7）按惯例在否定式断言里保留旧代字面量
  // （!dSrc.includes("const GAME_VERSION = 'v24.47';")），属合法残留，豁免扫描。
  if (f === 'smoke_v2447_xpcurve7.mjs') continue;
  const s = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s.includes("const GAME_VERSION = 'v24.47';") || s.includes("GAME_VERSION === 'v24.47'") ||
      s.includes("startsWith('## v24.47") || s.includes('入库（271 份）') ||
      s.includes('二百七十二件套（二百七十一件套清除）') || s.includes('testChain === 271') ||
      s.includes('fileCount === 271') || s.includes('files.length === 271') ||
      s.includes('chainAll.length === 271') || s.includes('treeTok.length === 271')) leftovers.push(f);
}
ok('全库测试零残留 v24.47 GAME_VERSION/顶 pin/271 口径（哨兵链·豁免上一版否定式）', leftovers.length === 0, leftovers.join(','));

console.log(`— v24.48 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
