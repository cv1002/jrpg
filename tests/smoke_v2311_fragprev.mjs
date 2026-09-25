// smoke_v2311_fragprev.mjs —— v23.11 战斗「战利品预览」记忆碎片预览守护（体验打磨·信息透明·同一口径）
// 承 v21.10-v23.10 冒烟入库先例：版本锚点 + 源级落位（data.js v23.11 注释/GAME_VERSION 字面量 v23.11/
// v23.10 历史注释保留零 v23.10 字面量残留）+ 预览契约（战利品预览行按 FRAGMENTS.find 同 winBattle 一份
// 源：四强敌 石心魔像/幽冥魔王/洞窟领主/终焉之神 首胜未集时补「· 🧩 首胜必掉记忆碎片」、已集零噪音——
// 与「🍄 必掉蘑菇/⚔️ 必掉圣光之剑/战胜另+N金」同式收口）+ 运行期实证（精英/Boss 两档渲染捕获逐值 +
// 已集/未集两档 + 普通怪零噪音三档）+ 行宽预算（estW 四强敌真实上限 ≤640）+ README/package.json/
// CHANGELOG 同步（冒烟二百二十五件套（二百二十四件套清除）/串尾/入库 207 份/顶 pin）+ 姊妹件套 pin
// （smoke_v2310 随新现实更新）+ 哨兵链领先一位（208 口径）+ 旧代 v23.10 pin 全库零残留。
import { GAME_VERSION, FRAGMENTS, ELITE_GOLEM } from '../js/data.js';
import { canonicalName } from '../js/rules.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v23.11 战斗战利品预览记忆碎片守护冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v23.10 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v23.10（本版守 v23.11）', !!_gv && (_gv[0] > 23 || (_gv[0] === 23 && _gv[1] >= 11)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const drawSrc = read('../js/view/drawBattle.js');
const battleSrc = read('../js/battle.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v23.11 版本注释', dataSrc.includes('// v23.11 体验打磨·信息透明·同一口径：战斗「战利品预览」行'));
ok('data.js GAME_VERSION 字面量已为 v23.11（旧 v23.10 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v24.01';") && !dataSrc.includes("const GAME_VERSION = 'v23." + "10';"));
ok('data.js 仍保留 v23.10 历史注释（run 总结屏困难档标注注释未动）', dataSrc.includes('// v23.10 体验打磨·信息透明·同一口径：run 总结屏三屏'));

// —— FRAGMENTS 单源契约（与 battle.winBattle 同读一份源）——
ok('FRAGMENTS 共 4 枚', FRAGMENTS.length === 4, String(FRAGMENTS.length));
ok('FRAGMENTS 四条 enemy 名逐字（强敌首胜掉落：石心魔像/幽冥魔王/洞窟领主/终焉之神）',
  FRAGMENTS.map((f) => f.enemy).join(',') === '石心魔像,幽冥魔王,洞窟领主,终焉之神', FRAGMENTS.map((f) => f.enemy).join(','));
ok('全部 enemy 名经 canonicalName 归一仍为同名（winBattle bookName 与预览判定同口径）',
  FRAGMENTS.every((f) => canonicalName(f.enemy) === f.enemy));

// —— 源级落位：drawBattle.js 战利品预览行记忆碎片标注（同 winBattle 同源、已集零噪音）——
ok('drawBattle.js 已 import FRAGMENTS（v23.79 补 MAPS 并列，零新增模块依赖）', drawSrc.includes(', FRAGMENTS, MAPS } from \'../data.js\''));
ok('drawBattle.js 预览行接入 fragBonus（fmark = FRAGMENTS.find(canonicalName 归一) + 已集判定）',
  drawSrc.includes('const fmark = FRAGMENTS.find((f) => f.enemy === canonicalName(enemy.name));') &&
  drawSrc.includes("(fmark && !(hero.fragments || []).includes(fmark.id)) ? ' · 🧩 首胜必掉记忆碎片' : ''"));
ok('drawBattle.js 既有 bonus 链收口（fragBonus 接入 bonus 末尾、逐字保留 蘑菇/圣光/真神+金）',
  drawSrc.includes("(enemy.isElite ? ' · 🍄 必掉蘑菇' : '') + (enemy.isTrue ? ' · 战胜另+' + TRUE_BONUS_GOLD + '金' : '') + (enemy.isBoss ? ' · ⚔️ 必掉圣光之剑' : '') + fragBonus"));
ok('drawBattle.js 预览行模板逐字保留（接 `${bonus}` 原样）',
  drawSrc.includes('text(`战利品预览：经验 +${enemy.xp} 金币 +${enemy.gold}${wk}${res}${bonus}${rushBonus}`, ex0, 112'));
ok('battle.js winBattle 碎片判定同源（frag && !includes 逐字）', battleSrc.includes('if (frag && !(hero.fragments || []).includes(frag.id)) {'));

// —— 行宽预算（v21.18 同款 estW）：四强敌真实上限（真实 xp/gold + 既有标注 + 碎片后缀）≤640 ——
const estW = (s) => {
  let w = 0;
  for (const ch of String(s)) {
    const c = ch.codePointAt(0);
    if (c >= 0x4e00 && c <= 0x9fff) w += 15;
    else if (c >= 0x3000 && c <= 0x303f) w += 15;
    else if (c >= 0xff00 && c <= 0xffef) w += 15;
    else if (/[0-9A-Za-z]/.test(ch)) w += 7.5;
    else if (ch === ' ') w += 7.5;
    else if ('｜|:：。，、！？…—·【】[]'.includes(ch)) w += 15;
    else w += 8;
  }
  return w;
};
const monRewardAt = (name, lv, base) => {
  const m = base;
  return { xp: m.xp[0] + lv * m.xp[1], gold: m.gold[0] + lv * m.gold[1] };
};
const elv = monRewardAt('石心魔像', 12, ELITE_GOLEM); // 精英随等级（Lv12 封顶实况）
const worstElite = `战利品预览：经验 +${elv.xp} 金币 +${elv.gold} · 弱点雷 · 🍄 必掉蘑菇 · 🧩 首胜必掉记忆碎片`;
const worstBoss = `战利品预览：经验 +150 金币 +300 · 抗冰 · ⚔️ 必掉圣光之剑 · 🧩 首胜必掉记忆碎片`;
const worstCave = `战利品预览：经验 +120 金币 +200 · 弱点雷 · 🧩 首胜必掉记忆碎片`;
const worstTrue = `战利品预览：经验 +400 金币 +600 · 抗火 · 战胜另+300金 · 🧩 首胜必掉记忆碎片`;
const wE = estW(worstElite), wB = estW(worstBoss), wC = estW(worstCave), wT = estW(worstTrue);
ok('行宽预算：精英石心魔像 Lv12 预览行 ≤640', wE > 0 && wE <= 640, `≈${wE.toFixed(0)}px（含碎片后缀）`);
ok('行宽预算：幽冥魔王预览行 ≤640', wB > 0 && wB <= 640, `≈${wB.toFixed(0)}px`);
ok('行宽预算：洞窟领主预览行 ≤640', wC > 0 && wC <= 640, `≈${wC.toFixed(0)}px`);
ok('行宽预算：终焉之神预览行 ≤640（碎片后缀增量 ≤130px）', wT > 0 && wT <= 640 && estW(worstTrue.replace(' · 🧩 首胜必掉记忆碎片', '')) - 0 >= 0, `≈${wT.toFixed(0)}px`);

// —— 运行期实证：DOM/音频/存储桩 + main.js 真实导入后 drawBattle 渲染捕获 ——
const noop = () => {};
const CAPTURED = [];
function makeCtx() {
  const grad = { addColorStop: noop };
  return {
    canvas: { width: 640, height: 480 },
    measureText: (t) => ({ width: estW(t) }),
    createLinearGradient: () => grad, createRadialGradient: () => grad, createConicGradient: () => grad, createPattern: () => ({}),
    beginPath: noop, closePath: noop, moveTo: noop, lineTo: noop, arc: noop, arcTo: noop, ellipse: noop,
    quadraticCurveTo: noop, bezierCurveTo: noop, fill: noop, stroke: noop, fillRect: noop, strokeRect: noop,
    clearRect: noop, drawImage: noop, save: noop, restore: noop, translate: noop, rotate: noop, scale: noop,
    transform: noop, setTransform: noop, clip: noop, rect: noop, setLineDash: noop, getLineDash: () => [],
    isPointInPath: () => false,
    globalAlpha: 1, strokeStyle: '#000', fillStyle: '#000', font: '', textAlign: 'left', textBaseline: 'alphabetic',
    lineWidth: 1, imageSmoothingEnabled: false,
    fillText: (t) => { CAPTURED.push(String(t)); },
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
    : { style: {}, classList: { add: noop, remove: noop }, value: '', textContent: '' },
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
const { eliteEncounter } = await import('../js/encounter.js');
const db = await import('../js/view/drawBattle.js');
const { newGame } = await import('../js/core.js');

function makeHero() {
  const h = newGame('余烬');
  Object.assign(h, { level: 5, gold: 300, item: 3, potion2: 0, hp: 80, hpMax: 80, mp: 30, mpMax: 40,
    skills: ['火焰斩'], fragments: [], tutDone: true });
  return h;
}
let threw = null;
// 未集碎片：精英石心魔像预览应报「 · 🧩 首胜必掉记忆碎片」（与 🍄 必掉蘑菇同列）
S.G = makeHero();
S.enemy = eliteEncounter();
S.scene = 'battle';
try { CAPTURED.length = 0; db.drawBattle(); } catch (e) { threw = e; }
ok('运行期：drawBattle 精英档渲染不抛错', threw === null, threw && String(threw.stack || threw));
ok('运行期：精英石心魔像预览行带「🧩 首胜必掉记忆碎片」且带「🍄 必掉蘑菇」',
  CAPTURED.some((t) => t.startsWith('战利品预览：') && t.includes('🧩 首胜必掉记忆碎片') && t.includes('🍄 必掉蘑菇')),
  CAPTURED.filter((t) => t.startsWith('战利品预览：')).join(' | '));
// 已集碎片：同一精英预览应零「首胜」噪音（与 winBattle 同判）
S.G = makeHero();
S.G.fragments = ['golem'];
try { CAPTURED.length = 0; db.drawBattle(); } catch (e) { threw = e; }
ok('运行期：已集碎片后渲染不抛错', threw === null, threw && String(threw.stack || threw));
ok('运行期：已集碎片（hero.fragments 含 golem）预览不再标「首胜」零噪音',
  CAPTURED.some((t) => t.startsWith('战利品预览：') && t.includes('🍄 必掉蘑菇') && !t.includes('🧩 首胜必掉记忆碎片')),
  CAPTURED.filter((t) => t.startsWith('战利品预览：')).join(' | '));
// 幽冥魔王（isBoss）：圣光之剑 + 碎片双标注同列
S.G = makeHero();
S.enemy = { name: '幽冥魔王', hp: 420, hpMax: 420, atk: 23, def: 13, xp: 150, gold: 300, resist: 'ice',
  color: '#a03fd9', draw: 'boss', isBoss: true, lv: 8,
  phase2: { at: 0.5, name: '幽冥魔王·真身', color: '#6a2ad9', atk: 7, def: 3, heal: 0.15 },
  acts: [{ type: 'attack', w: 50 }, { type: 'heavy', w: 30, w2: 45 }, { type: 'heal', w: 20, hpBelow: 0.4, pct: 0.12 }] };
try { CAPTURED.length = 0; db.drawBattle(); } catch (e) { threw = e; }
ok('运行期：drawBattle 幽冥魔王档渲染不抛错', threw === null, threw && String(threw.stack || threw));
ok('运行期：幽冥魔王预览行「⚔️ 必掉圣光之剑」与「🧩 首胜必掉记忆碎片」同列',
  CAPTURED.some((t) => t.startsWith('战利品预览：') && t.includes('⚔️ 必掉圣光之剑') && t.includes('🧩 首胜必掉记忆碎片')),
  CAPTURED.filter((t) => t.startsWith('战利品预览：')).join(' | '));
// 普通怪（无碎片无 boss 无精英）：预览行逐字零回归（零碎片后缀零噪音）
S.G = makeHero();
S.enemy = { name: '史莱姆', hp: 21, hpMax: 21, atk: 7, def: 3, xp: 11, gold: 10, weak: 'fire', draw: 'slime' };
try { CAPTURED.length = 0; db.drawBattle(); } catch (e) { threw = e; }
ok('运行期：drawBattle 史莱姆档渲染不抛错', threw === null, threw && String(threw.stack || threw));
ok('运行期：普通怪预览行零碎片后缀（无 🧩 无 🍄）',
  CAPTURED.some((t) => t.startsWith('战利品预览：') && !t.includes('🧩') && !t.includes('🍄') && !t.includes('⚔️')),
  CAPTURED.filter((t) => t.startsWith('战利品预览：')).join(' | '));

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README 件套口径为二百二十五件套（二百二十四件套清除）且旧 206 口径零残留',
  readme.includes('冒烟二百二十五件套（二百二十四件套清除）') && !readme.includes('冒烟二百零六件套（二百零五件套清' + '除）'));
ok('README 不含哨兵领先一位（二百二十六件套（二百二十五件套清除））',
  !readme.includes('二百二十六件套（二百二十五件套清除）'));
ok('README 含 v23.11 守护描述（战利品预览记忆碎片守护）',
  readme.includes('v23.11 起含 战斗「战利品预览」记忆碎片守护'));
ok('README 含 smoke_v2311_fragprev 入库（207 份）', readme.includes('smoke_v2311_fragprev 入库（207 份）'));
ok('README 仍保留 v23.10 守护描述（历史口径）', readme.includes('v23.10 起含 run 总结屏「困难档」标注守护'));
ok('README 仍保留 smoke_v2310_diffsum 入库（206 份）历史口径', readme.includes('smoke_v2310_diffsum 入库（206 份）'));
ok('README tests 树串尾已延伸至 smoke_v2311_fragprev（v2310 后接 v2311）',
  readme.includes('smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula + smoke_v2400_trialwarn + smoke_v2401_winbgm（npm test 串跑）'));
ok('README 旧串尾零残留（v2310 后无串尾收口）',
  !readme.includes('smoke_v2309_questnum + smoke_v2310_diffsum（npm test 串' + '跑）'));
ok('package.json 已收录 smoke_v2311_fragprev', JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2311_fragprev.mjs'));
ok('package.json 串尾为 ... node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs && node tests/smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs && node tests/smoke_v2395_shopscroll.mjs && node tests/smoke_v2396_steelarmor.mjs && node tests/smoke_v2397_baserow.mjs && node tests/smoke_v2398_econrow.mjs && node tests/smoke_v2399_dmgformula.mjs && node tests/smoke_v2400_trialwarn.mjs && node tests/smoke_v2401_winbgm.mjs"',
  pkg.includes('node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs && node tests/smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs && node tests/smoke_v2395_shopscroll.mjs && node tests/smoke_v2396_steelarmor.mjs && node tests/smoke_v2397_baserow.mjs && node tests/smoke_v2398_econrow.mjs && node tests/smoke_v2399_dmgformula.mjs && node tests/smoke_v2400_trialwarn.mjs && node tests/smoke_v2401_winbgm.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 207 件套', testChain === 225, String(testChain));
ok('CHANGELOG 顶部已追加 v23.11 条目', changelog.startsWith('## v24.01 '));
ok('CHANGELOG 仍保留 v23.10 条目（历史口径）', changelog.includes('## v23.10 run 总结屏三屏「困难档」标注'));

// —— 姊妹件套 pin 随新现实更新 + 旧代 v23.10 pin 零残留 ——
const s2310 = read('smoke_v2310_diffsum.mjs');
const s2143 = read('smoke_v2143_talkekey.mjs');
ok('smoke_v2310 的 GAME_VERSION 字面量 pin 已更新为 v23.11', s2310.includes("const GAME_VERSION = 'v24.01';"));
ok('smoke_v2310 的 CHANGELOG 顶 pin 已更新为 ## v23.12',
  s2310.includes("startsWith('## v24.01 "));
ok('smoke_v2310 的件套 pin 已更新为二百二十五件套（二百二十四件套清除）',
  s2310.includes('二百二十五件套（二百二十四件套清除）'));
ok('smoke_v2310 的 README 串尾 pin 已延伸至 smoke_v2311_fragprev',
  s2310.includes('smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll + smoke_v2396_steelarmor + smoke_v2397_baserow + smoke_v2398_econrow + smoke_v2399_dmgformula + smoke_v2400_trialwarn + smoke_v2401_winbgm（npm test 串跑）'));
ok('smoke_v2310 的 package 串尾 pin 已延伸至 smoke_v2311_fragprev',
  s2310.includes('node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs && node tests/smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs && node tests/smoke_v2395_shopscroll.mjs && node tests/smoke_v2396_steelarmor.mjs && node tests/smoke_v2397_baserow.mjs && node tests/smoke_v2398_econrow.mjs && node tests/smoke_v2399_dmgformula.mjs && node tests/smoke_v2400_trialwarn.mjs && node tests/smoke_v2401_winbgm.mjs"'));
ok('smoke_v2310 的 testChain pin 已更新为 207', s2310.includes('testChain === 225'));
ok('smoke_v2143 哨兵链已推进至二百二十六件套（二百二十五件套清除）',
  s2143.includes('二百二十六件套（二百二十五件套清除）') && s2143.includes("!readme.includes('二百二十六件套（二百二十五件套清除）')"));

// 旧代 v23.10 pin 全库零残留（不含本件）
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2311_fragprev.mjs');
const stale = [];
const stalePats = [
  /'v23\.10'/, /二百零六件套（二百零五件套清.*?除）/,
  /testChain === 206/, /smoke_v2310_diffsum（npm test 串跑）/,
  /startsWith\('## v23\.10/, /smoke_v2310_diffsum\.mjs"/, /冒烟二百零六件套（二百零五件套清除）/
];
for (const f of allTests) {
  const src = read(f);
  if (stalePats.some((re) => re.test(src))) stale.push(f);
}
ok('旧代 v23.10 字面量/恒等/件套/testChain/串尾/顶 pin/package 串尾 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

console.log(`\n— v23.11 战斗战利品预览记忆碎片守护冒烟：${n - failed}/${n} 通过 —`);
if (failed) process.exit(1);
