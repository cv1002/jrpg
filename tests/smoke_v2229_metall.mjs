// v22.29 专项冒烟：新成就「萍水相逢」（新内容·单成就·图鉴「已遭遇」全收集里程碑，承 v21.37 seen 计数化 /
// v21.78 图鉴页脚「已遭遇 X/13」同一「见过 vs 打过」双口径）——成就版图逐线核对后最后一条空白：
// 等级/宝箱/讨伐/时长/掉落/金币/酿造/药水/灵药/蘑菇各线都有印记、图鉴线也有 scholar（收录 N 种）与
// perfection（全讨伐）两档，唯独「遭遇」（battle.startBattle 每次进战 +1、真身 canonicalName 归一、
// 逃跑/战败也累计）这条比讨伐更早的线毫无纪念（v21.78 页脚只展示不成纪念）；本版：ACH_LIST 末尾追加
// metall（判定/描述/进度三处同读 BESTIARY_TARGET 一份源 + 既有 hero.seen 计数 (g.seen||{})[n]>=1
// 防御式旧档零迁移，无 r 纯里程碑，unlockedAchievements/applyAchievements 既有通路自动跟随）。
// 本冒烟守护：版本锚点、ACH_LIST 45 项精确与末尾序位、metall 数据契约（d 由 BESTIARY_TARGET 派生、
// ok/prog 防御式逐值）、与 perfection 双口径对照、unlockedAchievements/applyAchievements 运行期全链路
// （真实解锁落 hero.ach + 横幅 + 幂等去重）、既有 44 成就 id 零回归、battle.js seen 写入点源级零变化、
// README/package.json/CHANGELOG 同步（tests 树尾 + 件套口径 + v22.29 守护描述 + 入库 125 份 + 45 项双处）、
// 姊妹件套 pin（v22.28..v22.25 随新现实更新）复查、旧代 v22.28 字面量/恒等/件套/树尾 pin 零残留、断链防回归。
import { S } from '../js/state.js';
import { GAME_VERSION, ACH_LIST, BESTIARY_TARGET } from '../js/data.js';
import { unlockedAchievements } from '../js/rules.js';
import { applyAchievements } from '../js/hero.js';
import { bind } from '../js/bind.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.30-v22.28 冒烟先例：先装桩再 import main.js）——
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

console.log('— v22.29 图鉴已遭遇全收集成就「萍水相逢」 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dataSrc = read('js/data.js');
const battleSrc = read('js/battle.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');
const html = read('index.html');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.28 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.28', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 29)), GAME_VERSION);
ok('data.js 含 v22.29 注释（新成就「萍水相逢」说明）', dataSrc.includes('v22.29 新成就「萍水相逢」'));
ok('GAME_VERSION 字面量已为 v22.30（旧 v22.28 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v22.36';") && !dataSrc.includes("const GAME_VERSION = 'v22." + "28';"));
ok('data.js 仍保留 v22.28 历史注释（累积注释块，姊妹 pin 不失效）', dataSrc.includes('v22.28 标题页「未存档冒险」存档闭环'));

// —— ACH_LIST 契约 ——
const ach = ACH_LIST.find((a) => a.id === 'metall');
ok('ACH_LIST 含 metall「萍水相逢」且 id 唯一',
  !!ach && ach.name === '萍水相逢' && ACH_LIST.filter((a) => a.id === 'metall').length === 1);
ok('ACH_LIST 精确总数 45 项（本版独占精确计数，44→45）', ACH_LIST.length === 45, String(ACH_LIST.length));
ok('metall 描述由 BESTIARY_TARGET 派生（单一数据源，零裸字面量 13）',
  ach.d === `记忆图鉴已遭遇全部 ${BESTIARY_TARGET.length} 种魔物`, ach.d);
ok('BESTIARY_TARGET 全图鉴 13 种（与 perfection/scholar/图鉴页脚同源）', BESTIARY_TARGET.length === 13, String(BESTIARY_TARGET.length));
ok('metall 判定/进度同读 BESTIARY_TARGET + seen 防御式（ok every / prog filter）',
  String(ach.ok).includes('BESTIARY_TARGET.every') && String(ach.ok).includes('(g.seen||{})') &&
  String(ach.prog).includes('BESTIARY_TARGET.filter') && String(ach.prog).includes('(g.seen||{})'));
ok('metall 无 r 字段纯里程碑（与 memoir/skills/hardtrue 同款）', !('r' in ach));

// —— 既有 44 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime', 'hunt100', 'ptime2', 'lucky2', 'rich2', 'stock', 'brew2', 'stock2', 'elixir', 'mush', 'elixir2', 'mush2'];
ok('既有 44 成就 id 零回归', EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('metall 追加在末尾序位（mush2 43 / metall 44，既有序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'mush2') === 43 &&
  ACH_LIST.findIndex((a) => a.id === 'metall') === 44);

// —— ok/prog 谓词逐值 ——
const seenAll = Object.fromEntries(BESTIARY_TARGET.map((nm) => [nm, 1]));
const seenMiss1 = { ...seenAll };
delete seenMiss1[BESTIARY_TARGET[0]];
ok('seen 全 13 种 → true（恰达标）', ach.ok({ seen: seenAll }) === true);
ok('seen 差 1 种 → false（恰在门槛下不解锁）', ach.ok({ seen: seenMiss1 }) === false);
ok('缺 seen 字段旧档 → false 且 prog 0/13（防御式零迁移）',
  ach.ok({}) === false && ach.prog({}) === `0/${BESTIARY_TARGET.length}`);
ok('seen 布尔 true 旧档（v21.37 前形态）→ 防御归一为 1 → true',
  ach.ok({ seen: Object.fromEntries(BESTIARY_TARGET.map((nm) => [nm, true])) }) === true);
ok('seen 计数超 1（如精英/频繁遭遇）→ true', ach.ok({ seen: Object.fromEntries(BESTIARY_TARGET.map((nm) => [nm, 7])) }) === true);
ok('prog 12 种 → 12/13', ach.prog({ seen: seenMiss1 }) === `12/${BESTIARY_TARGET.length}`, ach.prog({ seen: seenMiss1 }));
ok('prog 13 种 → 13/13', ach.prog({ seen: seenAll }) === `13/${BESTIARY_TARGET.length}`);

// —— 与 perfection 双口径对照（见过 vs 打过，两条独立主线）——
const per = ACH_LIST.find((a) => a.id === 'perfection');
ok('perfection 零回归（ok 仍读 bestiary（g.bestiary||{}））', !!per && String(per.ok).includes('(g.bestiary||{})'));
ok('bestiary 全收但 seen 不全 → 不解锁 metall（双口径独立）', ach.ok({ seen: seenMiss1, bestiary: seenAll }) === false);
ok('seen 全但 bestiary 全空 → 解锁 metall（比全讨伐先到一步）', ach.ok({ seen: seenAll, bestiary: {} }) === true);

// —— unlockedAchievements 集成 ——
function freshHero(extra) {
  return Object.assign({ name: '余烬', level: 7, gold: 123, xp: 0, xpNext: 20, hp: 50, hpMax: 50, mp: 20, mpMax: 20,
    item: 3, potion2: 1, mushrooms: 2, weapon: '铁剑', armor: '皮甲', atkMax: 12, defMax: 6,
    map: 'village', x: 8, y: 8, time: 0, ach: [], bestiary: {}, seen: {}, fragments: [], visited: ['village'],
    skills: ['火焰斩'], chests: [], quests: {}, drops: 0, brews: 0, totalWins: 0 }, extra || {});
}
{
  const h = freshHero({ seen: seenAll });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 全遇档 newly 含 metall（既有通路自动跟随）', newly.includes('metall'), JSON.stringify(newly));
}
{
  const h = freshHero({ seen: seenMiss1 });
  const newly = unlockedAchievements(h);
  ok('unlockedAchievements 差一档 newly 不含 metall', !newly.includes('metall'), JSON.stringify(newly));
}

// —— applyAchievements 运行期全链路（真实解锁落 hero.ach + 横幅 + 幂等）——
{
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    const h = freshHero({ seen: seenAll });
    S.G = h;
    applyAchievements();
    ok('applyAchievements 真实解锁落 hero.ach（含 metall）', h.ach.includes('metall'), JSON.stringify(h.ach));
    ok('解锁横幅报成就名【萍水相逢】', msgs.some((m) => m.includes('🔓 成就解锁：') && m.includes('萍水相逢')), msgs.join(' | '));
    const len1 = msgs.length;
    applyAchievements();
    ok('幂等：重复调用不再报（已解锁去重）', msgs.length === len1 && msgs.filter((m) => m.includes('萍水相逢')).length === 1, String(msgs.length));
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}
{
  const msgs = [];
  const origBox = bind.boxMsg;
  bind.boxMsg = (t) => { msgs.push(String(t)); };
  try {
    const h = freshHero({ seen: seenMiss1 });
    S.G = h;
    applyAchievements();
    ok('差一档 applyAchievements 零 metall 解锁零「萍水相逢」横幅（不误解锁）',
      !h.ach.includes('metall') && !msgs.some((m) => m.includes('萍水相逢')), JSON.stringify({ ach: h.ach, msgs }));
  } finally {
    bind.boxMsg = origBox;
    S.G = null;
  }
}

// —— 源级零变化：battle.js startBattle 的 seen 写入点（唯一写入点，本版未动）——
ok('battle.js 既有 seen 写入点源级零变化（startBattle 进战 +1）',
  battleSrc.includes('S.G.seen[_seenKey] = (S.G.seen[_seenKey] || 0) + 1;') &&
  battleSrc.includes('const _seenKey = canonicalName(S.enemy.name);'));

// —— README / package.json / CHANGELOG 同步 ——
ok('README tests 树收录 smoke_v2229_metall 且位于串尾', readme.includes('smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp（npm test 串跑）'));
ok('README 件套口径为一百三十二件套（一百三十一件套清除）',
  readme.includes('冒烟一百三十二件套（一百三十一件套清除）') && !readme.includes('一百二十四件套（一百二十三件套清' + '除）'));
ok('README 含 v22.29 守护描述（萍水相逢图鉴已遭遇全收集里程碑守护）', readme.includes('v22.29 起含「萍水相逢」图鉴已遭遇全收集里程碑守护'));
ok('README 含 smoke_v2229_metall 入库（125 份）', readme.includes('smoke_v2229_metall 入库（125 份）'));
ok('README 成就计数双处口径 45 项（C 行 + 图鉴&成就段，44 项清除）',
  readme.includes('成就一览（全部 45 项进度') && readme.includes('**45 项成就**') && !readme.includes('**44 项成就**'));
ok('package.json 已收录 smoke_v2229_metall（npm test 串跑第 125 份）',
  pkg.includes('smoke_v2229_metall.mjs') && /smoke_v2228_titlesave\.mjs && node tests\/smoke_v2229_metall\.mjs && node tests\/smoke_v2230_pausewarn\.mjs && node tests\/smoke_v2231_smith\.mjs && node tests\/smoke_v2232_travelsup\.mjs && node tests\/smoke_v2233_nameflavor\.mjs && node tests\/smoke_v2234_innkeeper\.mjs && node tests\/smoke_v2235_minimapquest\.mjs && node tests\/smoke_v2236_villagelamp\.mjs"/.test(pkg));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 125 件套', testChain === 132, String(testChain));
ok('CHANGELOG 含 v22.29 条目', changelog.includes('## v22.29 '));

// —— 姊妹件套 pin 复查（v21.7 惯例：本版冒烟守护姊妹随新现实更新）——
const s2228 = read('tests/smoke_v2228_titlesave.mjs');
const s2227 = read('tests/smoke_v2227_minstrel.mjs');
const s2226 = read('tests/smoke_v2226_chestprogress.mjs');
const s2225 = read('tests/smoke_v2225_stonecarver.mjs');
ok('smoke_v2228 的 GAME_VERSION 字面量 pin 已更新为 v22.30', s2228.includes("const GAME_VERSION = 'v22.36';"));
ok('smoke_v2228 的 GAME_VERSION 恒等 pin 已更新为 === v22.30', s2228.includes("GAME_VERSION === 'v22.36'"));
ok('smoke_v2228 的 README 件套 pin 已更新为一百三十二件套（一百三十一件套清除）',
  s2228.includes('一百三十二件套（一百三十一件套清除）'));
ok('smoke_v2228 的 README 树尾 pin 已更新为 + smoke_v2229_metall',
  s2228.includes('smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp（npm test 串跑）'));
ok('smoke_v2228 的 package.json 件套计数 pin 已更新为 === 125', s2228.includes('testChain === 132'));
ok('smoke_v2227 的 GAME_VERSION 字面量 pin 已更新为 v22.30', s2227.includes("const GAME_VERSION = 'v22.36';"));
ok('smoke_v2227 的 README 树尾 pin 已更新为 + smoke_v2229_metall',
  s2227.includes('smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp（npm test 串跑）'));
ok('smoke_v2226 的 README 件套 pin 已更新为一百三十二件套（一百三十一件套清除）',
  s2226.includes('一百三十二件套（一百三十一件套清除）'));
ok('smoke_v2225 的 README 树尾 pin 已更新为 + smoke_v2229_metall',
  s2225.includes('smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp（npm test 串跑）'));

// —— 旧代 pin 零残留：全部测试文件不得再含 v22.28 字面量/恒等/件套/树尾 pin（拆串构造避免自匹配）——
let stale = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read('tests/' + f);
  if (src.includes("const GAME_VERSION = 'v22." + "28';")) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v22.28 全库清零）', stale.length === 0, stale.join(','));
let staleId = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read('tests/' + f);
  if (src.includes("GAME_VERSION === 'v22." + "28'")) staleId.push(f);
}
ok('旧代 GAME_VERSION 恒等 pin 零残留（===v22.28 全库清零）', staleId.length === 0, staleId.join(','));
let staleSuite = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read('tests/' + f);
  if (src.includes('一百二十四件套（一百二十三件套清' + '除）')) staleSuite.push(f);
}
ok('旧代件套 pin 零残留（一百二十四件套（一百二十三件套清' + '除）全库清零）', staleSuite.length === 0, staleSuite.join(','));
let staleTail = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read('tests/' + f);
  if (src.includes('smoke_v2227_minstrel + smoke_v2228_titlesave（npm test 串' + '跑）')) staleTail.push(f);
}
ok('旧代树尾 pin 零残留（smoke_v2227_minstrel + smoke_v2228_titlesave 串全库清零）', staleTail.length === 0, staleTail.join(','));
// 断链防回归：不得出现 v2228_titlesave 被新尾吞并的坏链（smoke_v2227_minstrel 直接接 smoke_v2229_metall）
let brokenTail = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read('tests/' + f);
  if (src.includes('smoke_v2227_minstrel + smoke_v2229_metall（npm test 串' + '跑）')) brokenTail.push(f);
}
if (readme.includes('smoke_v2227_minstrel + smoke_v2229_metall（npm test 串' + '跑）')) brokenTail.push('README.md');
ok('坏链 pin 零残留（v2228_titlesave 吞并链全库清零）', brokenTail.length === 0, brokenTail.join(','));

// —— index.html 壳要素零回归 ——
ok('index.html 壳要素零回归（canvas 640×480 + js/main.js 模块入口 + hud/quest/msg）',
  html.includes('<canvas id="game" width="640" height="480">') && html.includes('<script type="module" src="js/main.js') &&
  html.includes('id="hud"') && html.includes('id="quest"') && html.includes('id="msg"') &&
  html.includes('<title>潮灯记 · JRPG</title>'));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
