// v24.20 专项冒烟：🌟 领悟新技能战报补「📖 诸技通明 N/8」进度后缀
// （体验打磨·信息透明·计数现场——承 v24.19 额外掉落战报「🍀 鸿运当头 N/30」/ v24.17 喝药战报
// 「💧 渴饮甘露 N/10」/ v24.16 HUD「🚶 千里之行 N/1000」/ v24.12 胜利画面「⚔️ 身经百战 N/100」/
// v24.10 酿造「🍶 妙手回春 N/5」/ v24.09 商店「🍄 蘑菇商路 N/30」同一「计数现场报进度」主线 /
// v21.59 诸技通明成就（技能全领悟里程碑 = 领悟全部 8 招）：计数 hero.skills 由 hero.checkSkills 升级
// 领悟唯一写入点 push、snapshotHero 全量快照自动持久化、防御式 (hero.skills||[]) 旧档零迁移，此前进度
// 只藏在 C 成就页一行 X/8——技能线的计数现场正是每次「🌟 领悟了新技能」战报本身：升级领悟当场查无
// 一眼之数（领悟是低频事件（整局至多 8 次）、不像 v23.64 熟能生巧每发一报需零战报后缀的取舍，与
// v24.19「现场是动作本身」同族）；现 hero.checkSkills 领悟报文末尾补「（📖 诸技通明 N/8）」（分子读
// (hero.skills||[]).length 防御式旧档零迁移、分母读 data.js Object.keys(LEARN_AT).length 单一数据源——
// 本版 LEARN_AT 由模块内常量改为导出，与 I 状态页「已学技能 N/8」/战斗技能菜单「已学 N/7」/ACH_LIST
// skills 的 ok/prog 同读一份源，调技能表只改 data.js 一处全端自动跟随），纯显示零结算零存档零数值变化
// （LEARN_AT 八招表/learnsAt/MAX_LEARN_LV/checkSkills 拦截与 push/经验结算/成就判定逐字未动）。
// 本冒烟守护：版本锚点、data.js 源级落位（v24.20 注释 / GAME_VERSION v24.20 与旧 v24.19 字面量
// 零残留 / v24.19 与 v24.18 历史注释保留 / LEARN_AT 导出）、数据契约（LEARN_AT 八招 Lv1/3/4/5/7/9/11/12
// 与 learnsAt 扫描同源互证 / Lv2 无新技 / ACH_LIST skills 同源）、hero.js 源级落位（LEARN_AT import /
// 报文模板 / 分子防御式 / 🌟 前缀零回归 / v24.20 注释 / 拦截逐字零回归）、运行期实证（Lv3 领悟冰霜击
// 报文逐字含 2/8 后缀 / 领悟结算零回归 / 重复领悟零报文 / Lv2 不报）、README/package.json/CHANGELOG
// 同步（件套口径 244 + v24.20 守护描述 + v24.19 历史保留 + 入库 244 + package 串尾 + CHANGELOG 顶 pin）、
// 哨兵链（前望 245 且 README 尚无 245 口径）、旧代 v24.19 pin 全库零残留扫描（字面量/顶 pin/243 口径）。
import { S } from '../js/state.js';
import { GAME_VERSION, LEARN_AT, ACH_LIST, SKILL_DATA, learnsAt, MAX_LEARN_LV } from '../js/data.js';
import { checkSkills } from '../js/hero.js';
import { bind } from '../js/bind.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v24.19 冒烟先例：先装桩再 import main.js）——
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

console.log('— v24.20 🌟 领悟新技能战报「📖 诸技通明 N/8」进度后缀 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const hSrc = read('js/hero.js');
const readme = read('README.md');
const pkgRaw = read('package.json');
const changelog = read('CHANGELOG.md');
const testsDir = path.join(ROOT, 'tests');

// —— 版本锚点（格式合法 + 已越过 v24.19 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.19', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 19)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.20（旧 v24.19 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.20';") && !dSrc.includes("const GAME_VERSION = 'v24.19';"));
ok('data.js 含 v24.20 注释（领悟战报「📖 诸技通明 N/8」进度后缀说明）',
  dSrc.includes('// v24.20 体验打磨·信息透明·计数现场'));
ok('data.js 仍保留 v24.19 历史注释（额外掉落战报进度后缀说明，累积注释块）',
  dSrc.includes('// v24.19 体验打磨·信息透明·计数现场'));
ok('data.js 仍保留 v24.18 历史注释（后期金币曲线续平滑说明）',
  dSrc.includes('// v24.18 数值平衡·后期金币曲线续平滑'));
ok('data.js export 块含 LEARN_AT（本版由模块内常量改为导出，与 ACH_LIST 同读一份源）',
  dSrc.includes('baseStats, learnsAt, LEARN_AT, MAX_LEARN_LV'));

// —— 数据契约：LEARN_AT 八招（Lv1/3/4/5/7/9/11/12）+ learnsAt 同源互证 ——
const LEARN_KEYS = Object.keys(LEARN_AT).map(Number).sort((a, b) => a - b);
ok('LEARN_AT 共 8 招（Lv1/3/4/5/7/9/11/12 八档）',
  LEARN_KEYS.length === 8 && LEARN_KEYS.join(',') === '1,3,4,5,7,9,11,12', LEARN_KEYS.join(','));
const scanned = [];
for (let lv = 1; lv <= MAX_LEARN_LV; lv++) { const s = learnsAt(lv); if (s) scanned.push([lv, s]); }
ok('learnsAt 扫描 1..MAX_LEARN_LV 收集 == LEARN_AT 全表（同源互证）',
  scanned.length === LEARN_KEYS.length && scanned.every(([lv, s]) => LEARN_AT[lv] === s));
ok('Lv2 无新技（learnsAt(2) 返回 null）', learnsAt(2) === null, String(learnsAt(2)));

// —— ACH_LIST skills 同源互证（与 LEARN_AT 一份源）——
const skills = ACH_LIST.find((a) => a.id === 'skills');
ok('ACH_LIST skills 名称「诸技通明」', !!skills && skills.name === '诸技通明', skills && skills.name);
ok('ACH_LIST skills 描述与阈值同源（领悟全部 8 个技能）',
  !!skills && skills.d === `领悟全部 ${Object.keys(LEARN_AT).length} 个技能`, skills && skills.d);
const fullSkills = Object.keys(LEARN_AT).map((lv) => LEARN_AT[lv]);
const sixSkills = fullSkills.slice(0, 6);
ok('ACH_LIST skills 判定/进度同读 skills 数组与 LEARN_AT（6 招 6/8 false · 8 招 8/8 true · 缺字段 0/8）',
  !!skills && skills.ok({ skills: sixSkills }) === false && skills.ok({ skills: fullSkills }) === true &&
  skills.prog({ skills: sixSkills }) === `6/${Object.keys(LEARN_AT).length}` &&
  skills.prog({}) === `0/${Object.keys(LEARN_AT).length}`, JSON.stringify(skills && [skills.ok({ skills: sixSkills }), skills.ok({ skills: fullSkills }), skills.prog({ skills: sixSkills })]));

// —— hero.js 源级落位 ——
ok('hero.js import 含 LEARN_AT（data.js 新导出，零新增模块依赖）',
  hSrc.includes('learnsAt, LEARN_AT, ACH_LIST'));
ok('hero.js 领悟报文含「📖 诸技通明 N/8」进度后缀（模板逐字）',
  hSrc.includes('（📖 诸技通明 ${(hero.skills || []).length}/${Object.keys(LEARN_AT).length}）'));
ok('hero.js 报文分子读 (hero.skills||[]).length 防御式', hSrc.includes('(hero.skills || []).length'));
ok('hero.js 报文仍以 🌟 领悟了新技能 前缀开头（原文案零回归）',
  hSrc.includes('🌟 领悟了新技能【${skill}】！'));
ok('hero.js 含 v24.20 注释（领悟战报进度后缀说明）', hSrc.includes('v24.20 体验打磨·信息透明·计数现场'));
ok('hero.js 领悟拦截逐字零回归（includes 拦截与 push 前后序未动）',
  hSrc.includes('if (skill && !hero.skills.includes(skill))') &&
  hSrc.includes('hero.skills.push(skill);') &&
  hSrc.indexOf('hero.skills.push(skill);') < hSrc.indexOf('bind.boxMsg'));

// —— 运行期实证：checkSkills 真实调用 + bind.boxMsg 捕获（承 v21.61 捕获桩法）——
function runLearn(hero) {
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    S.G = hero;
    checkSkills();
    return msgs;
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}

// 冰霜击档：Lv3 领悟 → 报文 = SKILL_DATA 同源派生摘要 + 「（📖 诸技通明 2/8）」后缀
const hA = { level: 3, skills: ['火焰斩'] };
const mA = runLearn(hA);
const sdA = SKILL_DATA['冰霜击'];
const expA = `🌟 领悟了新技能【冰霜击】！${sdA ? `（${sdA.mp} MP · ${sdA.hint} · 战斗中按 2 选用）` : ''}（📖 诸技通明 ${(hA.skills || []).length}/${Object.keys(LEARN_AT).length}）`;
ok('运行期：Lv3 领悟冰霜击报文逐字（SKILL_DATA mp/hint 同源派生 + 诸技通明 2/8 后缀）',
  mA.includes(expA) && mA[0] === expA, mA.join(' | '));
ok('运行期：领悟结算零回归（skills 追加冰霜击且总数为 2）',
  hA.skills.length === 2 && hA.skills[1] === '冰霜击', JSON.stringify(hA.skills));

// 重复领悟档：Lv3 已会冰霜击 → includes 拦截零报文零后缀零重计
const hB = { level: 3, skills: ['火焰斩', '冰霜击'] };
const mB = runLearn(hB);
ok('运行期：重复领悟零报文零后缀零重计（includes 拦截）',
  mB.length === 0 && hB.skills.length === 2, mB.join(' | '));

// 无新技等级：Lv2（LEARN_AT 无此级）→ 零报文
const hC = { level: 2, skills: ['火焰斩'] };
const mC = runLearn(hC);
ok('运行期：无新技等级（Lv2）checkSkills 不报', mC.length === 0, mC.join(' | '));

// —— README / package.json / CHANGELOG 同步 ——
ok('README 件套口径已为二百四十四件套（二百四十三件套清除）',
  readme.includes('冒烟二百四十四件套（二百四十三件套清除）'));
ok('README tests 含 v24.20 守护描述与 smoke_v2420_skillprog 入库（244 份）',
  readme.includes('v24.20 起含 「🌟 领悟新技能」战报「📖 诸技通明 N/8」进度后缀守护') &&
  readme.includes('smoke_v2420_skillprog 入库（244 份）'));
ok('README 仍有 v24.19 守护描述（历史保留）', readme.includes('v24.19 起含 「🎁 额外掉落」战报「🍀 鸿运当头 N/30」进度后缀守护'));
ok('README 已有二百四十四件套口径且尚无 245（哨兵前望 245 语义：下一版才写 245）',
  readme.includes('冒烟二百四十四件套（二百四十三件套清除）') &&
  !readme.includes('二百四十五件套'));
const pkg = JSON.parse(pkgRaw).scripts.test;
const chain = [...pkgRaw.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''));
const chainAll = ['smoke.mjs', ...chain];
ok('package.json 实跑链共 244 份（smoke.mjs + 243 专项）', chain.length === 243 && chainAll.length === 244, String(chain.length));
ok('package.json 链尾为 smoke_v2420_skillprog（第 244 份）', chain[chain.length - 1] === 'smoke_v2420_skillprog', chain[chain.length - 1]);
ok('package.json test 串收录 smoke_v2420_skillprog.mjs（node tests/ 前缀形态）',
  pkgRaw.includes('node tests/smoke_v2420_skillprog.mjs'));
ok('package.json 链锚逐字（smoke_v2419_luckdrp.mjs && node tests/smoke_v2420_skillprog.mjs"）',
  pkgRaw.includes('smoke_v2419_luckdrp.mjs && node tests/smoke_v2420_skillprog.mjs"'));
ok('README tests 树串尾已延伸（smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog（npm test 串跑））',
  readme.includes('smoke_v2418_goldcurve + smoke_v2419_luckdrp + smoke_v2420_skillprog（npm test 串跑）'));
ok('CHANGELOG.md 顶部条目已为 v24.20（startsWith）', changelog.startsWith('## v24.20'));
ok('CHANGELOG v24.20 条目含「诸技通明」与「计数现场」与「领悟」',
  changelog.includes('诸技通明') && changelog.includes('计数现场') && changelog.includes('领悟'));
ok('CHANGELOG 仍保留 v24.19 条目（历史保留）', changelog.includes('## v24.19'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainSet = new Set(chainAll.map((f) => f.replace(/\.mjs$/, '')));
const orphans = files.filter((f) => !chainSet.has(f.replace(/\.mjs$/, '')));
const missed = [...chainSet].filter((f) => !files.includes(f + '.mjs'));
ok('tests 目录件套 = 244（243 + smoke_v2420_skillprog）', files.length === 244, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链（旧代 v24.19 pin 全库零残留）——
const leftovers = [];
for (const f of files) {
  if (f === 'smoke_v2420_skillprog.mjs') continue;
  // 承 v24.19 同款豁免：上一版套件（smoke_v2419_luckdrp）按惯例在否定式断言里保留旧代字面量，/
  // 属合法残留，豁免扫描（本版无 v24.19 否定式残留则自然零残留）。
  if (f === 'smoke_v2419_luckdrp.mjs') continue;
  const s = fs.readFileSync(path.join(testsDir, f), 'utf8');
  if (s.includes("const GAME_VERSION = 'v24.19';") || s.includes("GAME_VERSION === 'v24.19'") ||
      s.includes("startsWith('## v24.19") || s.includes('入库（243 份）') ||
      s.includes('二百四十三件套（二百四十二件套清除）') || s.includes('testChain === 243') ||
      s.includes('fileCount === 243') || s.includes('files.length === 243') ||
      s.includes('chain.length === 242')) leftovers.push(f);
}
ok('全库测试零残留 v24.19 GAME_VERSION/顶 pin/243 口径（哨兵链·豁免上一版否定式）', leftovers.length === 0, leftovers.join(','));

console.log(`— v24.20 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
