// smoke_v2313_talkall.mjs —— v23.13 新成就「有口皆碑」（社交向单成就·全新维度收口）守护
// 承 v21.10-v23.12 冒烟入库先例：版本锚点 + 源级落位（data.js GAME_VERSION 字面量 v23.13/v23.13
// 注释/v23.12 历史注释保留、ACH_LIST talkall 末尾追加 + v23.13 注释块、core.js openTalk 交谈记录块
// + NPCS import、quests.js migrateQuests talked 兜底）+ 数据契约（NPCS 37 处含 stele1-4、NPC_SPOTS
// 全值 ∈ NPCS、ACH_LIST 精确总数 60、talkall 唯一/名称/描述/判定/进度全读 Object.keys(NPCS) 单一
// 数据源、既有 59 项 id/序位零回归、无 r 字段纯里程碑）+ ok/prog 谓词逐值（0·36/37 false · 37/37
// true · 缺字段防御式 0/37 · 超集不钳制）+ 运行期全链路（DOM/音频/存储桩 + main.js 真实导入：
// newGame migrateQuests 兜底 []、openTalk 记入/去重/石碑同记、逐位聊遍 37 处 applyAchievements
// 真实解锁、未满不误解锁、旧档缺字段不抛错不解锁、drawAch 60 项滚动渲染不抛错）+
// README/package.json/CHANGELOG 同步（成就 60 项双处/成就有口皆碑数值速查行/串尾/件套 209/顶 pin）+
// 姊妹件套 pin（v2312 随新现实更新）+ 旧代 v23.12 pin 全库零残留 + 哨兵链领先一位（210 口径）。
import { GAME_VERSION, ACH_LIST, NPCS, NPC_SPOTS } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v23.13 有口皆碑社交成就冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v23.12 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v23.12（本版守 v23.13）', !!_gv && (_gv[0] > 23 || (_gv[0] === 23 && _gv[1] >= 13)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const coreSrc = read('../js/core.js');
const questsSrc = read('../js/quests.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v23.13 版本注释', dataSrc.includes('// v23.13 新内容·社交向单成就：新成就「有口皆碑」'));
ok('data.js GAME_VERSION 字面量已为 v23.13（旧 v23.12 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.29';") && !dataSrc.includes("const GAME_VERSION = 'v23.12';"));
ok('data.js 仍保留 v23.12 历史注释（标题画面音量口径注释未动）',
  dataSrc.includes('// v23.12 体验打磨·可发现性·口径收尾'));
ok('data.js ACH_LIST talkall 注释块落位（v23.13 新成就·社交向）',
  dataSrc.includes('有口皆碑（v23.13 新成就·社交向单成就·全新维度收口'));
ok('core.js 含 v23.13 交谈记录注释块（openTalk 全游戏唯一交谈入口）',
  coreSrc.includes('v23.13 社交成就「有口皆碑」交谈记录'));
ok('core.js openTalk 记录块源级落位（NPCS 守卫 + talked 去重 + 当场 applyAchievements）',
  coreSrc.includes('const th = S.G;') && coreSrc.includes('if (th && NPCS[id])') &&
  coreSrc.includes('th.talked.push(id)') && coreSrc.includes('applyAchievements();'));
ok('core.js data.js import 含 NPCS（追加在 import 尾，chestTotal, FRAGMENTS, BREW_MUSHROOMS 相邻 pin 零破坏）', coreSrc.includes("DIFFS, NPCS }"));
ok('quests.js 含 v23.13 talked 兜底（migrateQuests）', questsSrc.includes('v23.13 社交成就「有口皆碑」talked 兜底') &&
  questsSrc.includes('if (!Array.isArray(hero.talked)) hero.talked = [];'));

// —— 数据契约 ——
const N = Object.keys(NPCS).length;
const ALL = Object.keys(NPCS);
ok('NPCS 精确 37 处（33 位镇民/旅人 + 4 面名字石碑 stele1-4）', N === 37, String(N));
ok('NPCS 含 chief 与 stele1..stele4',
  !!NPCS.chief && !!NPCS.stele1 && !!NPCS.stele2 && !!NPCS.stele3 && !!NPCS.stele4);
ok('NPC_SPOTS 全部值 ∈ NPCS（交谈入口全表可记录，无孤儿 id）',
  Object.values(NPC_SPOTS).every((v) => !!NPCS[v]));

const ach = ACH_LIST.find((a) => a.id === 'talkall');
ok('ACH_LIST 含 talkall「有口皆碑」且 id 唯一',
  !!ach && ach.name === '有口皆碑' && ACH_LIST.filter((a) => a.id === 'talkall').length === 1);
ok('ACH_LIST 精确总数 60 项（v2229 精确计数 pin 随新现实更新 59→60）', ACH_LIST.length === 60, String(ACH_LIST.length));
ok('talkall 描述全部由 Object.keys(NPCS).length 派生（零裸字面量 37）',
  ach.d === `与全部 ${N} 处灯下之声交谈过`, ach.d);
ok('talkall 判定/进度同读 Object.keys(NPCS)（ok/prog 同式，与 wander 读 MAPS 同族）',
  String(ach.ok).includes('Object.keys(NPCS)') && String(ach.prog).includes('Object.keys(NPCS)'));
ok('talkall 无 r 字段纯里程碑（与 memoir/skills/aegis/hardtrue 同款）', !('r' in ach));

// —— 既有 59 成就 id 零回归 + 末尾序位 ——
const EXPECTED = ['firstblood', 'hunt10', 'lucky', 'lvl5', 'lvl10', 'lvl12', 'rich', 'scholar', 'quest',
  'boss', 'cave', 'trueboss', 'rush', 'perfection', 'legend', 'cartman', 'names', 'mist', 'stone',
  'ember', 'bone', 'chests', 'allquests', 'memoir', 'skills', 'hardtrue', 'aegis', 'allchests',
  'elites', 'grain', 'brew', 'wander', 'ptime', 'hunt100', 'ptime2', 'lucky2', 'rich2', 'stock',
  'brew2', 'stock2', 'elixir', 'mush', 'elixir2', 'mush2', 'metall', 'rich3', 'ptime3', 'hunt3',
  'lucky3', 'stock3', 'elixir3', 'brew3', 'mush3', 'outstep', 'outstep2', 'scholar2', 'seen', 'seen2',
  'chests2'];
ok('既有 59 成就 id 零回归', EXPECTED.every((id) => ACH_LIST.some((a) => a.id === id)));
ok('talkall 追加在末尾序位（chests2 仍 58、talkall 59，既有序位零位移）',
  ACH_LIST.findIndex((a) => a.id === 'chests2') === 58 && ACH_LIST.findIndex((a) => a.id === 'talkall') === 59);

// —— ok/prog 谓词逐值 ——
const allButOne = ALL.slice(0, N - 1);
ok('talked 空 → false 且 prog 0/N', ach.ok({}) === false && ach.prog({}) === `0/${N}`);
ok('talked N-1 处（恰差 1）→ false 且 prog (N-1)/N', ach.ok({ talked: allButOne }) === false && ach.prog({ talked: allButOne }) === `${N - 1}/${N}`);
ok('talked 全 N 处 → true 且 prog N/N', ach.ok({ talked: ALL }) === true && ach.prog({ talked: ALL }) === `${N}/${N}`);
ok('缺 talked 字段旧档 → false 且 prog 0/N（防御式零迁移）', ach.ok({ bestiary: {} }) === false && ach.prog({ bestiary: {} }) === `0/${N}`);
ok('talked 超集（含未知 id）仍达标且 prog 不钳制 N/N', ach.ok({ talked: [...ALL, '!foo'] }) === true && ach.prog({ talked: [...ALL, '!foo'] }) === `${N}/${N}`);

// —— 运行期实证：DOM/音频/存储桩 + main.js 真实导入后 openTalk → applyAchievements 全链路 ——
const noop = () => {};
function makeCtx() {
  const grad = { addColorStop: noop };
  return {
    canvas: { width: 640, height: 480 },
    measureText: (t) => ({ width: String(t).length * 7 }),
    createLinearGradient: () => grad, createRadialGradient: () => grad, createConicGradient: () => grad, createPattern: () => ({}),
    beginPath: noop, closePath: noop, moveTo: noop, lineTo: noop, arc: noop, arcTo: noop, ellipse: noop,
    quadraticCurveTo: noop, bezierCurveTo: noop, fill: noop, stroke: noop, fillRect: noop, strokeRect: noop,
    clearRect: noop, drawImage: noop, save: noop, restore: noop, translate: noop, rotate: noop, scale: noop,
    transform: noop, setTransform: noop, clip: noop, rect: noop, setLineDash: noop, getLineDash: () => [],
    isPointInPath: () => false,
    globalAlpha: 1, strokeStyle: '#000', fillStyle: '#000', font: '', textAlign: 'left', textBaseline: 'alphabetic',
    lineWidth: 1, imageSmoothingEnabled: false,
    fillText: noop, strokeText: noop,
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
const { newGame, openTalk } = await import('../js/core.js');
const { applyAchievements } = await import('../js/hero.js');
const { drawAch } = await import('../js/view/menus.js');

function runAch(hero) {
  S.G = hero;
  S.scene = 'world';
  applyAchievements();
  return hero;
}

// 新档兜底：migrateQuests 写定 talked=[]
let hero = newGame('余烬');
ok('运行期：newGame 后 hero.talked 已兜底为数组', Array.isArray(hero.talked) && hero.talked.length === 0);

// openTalk 记录：chief 记入 + 场景落位
S.G = hero;
openTalk('chief');
ok('运行期：openTalk(chief) 进 talk 场景且 curNpc/talkPages 落位', S.scene === 'talk' && S.curNpc === 'chief' && Array.isArray(S.talkPages));
ok('运行期：openTalk(chief) 记入 hero.talked', hero.talked.includes('chief'), hero.talked.join(','));

// 重复交谈去重
openTalk('chief');
ok('运行期：重复交谈不重复记入（去重）', hero.talked.length === 1, String(hero.talked.length));

// 名字石碑同为交谈对象（NPC_SPOTS STELE 瓦片同走 openTalk）
openTalk('stele1');
ok('运行期：openTalk(stele1) 记入（名字石碑同记）', hero.talked.includes('stele1') && hero.talked.length === 2);

// 未满档：聊 N-1 处 → applyAchievements 不误解锁
hero = newGame('灯见');
hero.talked = allButOne.slice();
hero = runAch(hero);
ok('运行期：N-1 处不误解锁 talkall', !hero.ach.includes('talkall'), hero.ach.join(','));

// 全量档：逐位聊遍全部 N 处 → openTalk 当场 applyAchievements 真实解锁
hero = newGame('潮');
S.G = hero;
for (const id of ALL) openTalk(id);
ok('运行期：聊遍全部 N 处 hero.talked 恰 N 条', hero.talked.length === N, String(hero.talked.length));
ok('运行期：最后一位聊到即真实解锁 talkall 落 hero.ach', hero.ach.includes('talkall'), hero.ach.join(','));

// 重复调用去重（已解锁再 applyAchievements 不重复 push）
runAch(hero); runAch(hero);
ok('运行期：重复调用去重（hero.ach 中 talkall 恰一枚）', hero.ach.filter((x) => x === 'talkall').length === 1);

// 旧档防御档：删 talked 字段 → applyAchievements 不抛错且不解锁
hero = newGame('潮');
delete hero.talked;
let threw = null;
try { runAch(hero); } catch (e) { threw = e; }
ok('运行期：旧档缺 talked 字段 applyAchievements 不抛错（防御式）', threw === null, threw && String(threw.stack || threw));
ok('运行期：缺字段旧档不解锁 talkall（零迁移）', !hero.ach.includes('talkall'));

// —— drawAch 渲染（60 项滚动不抛错）——
let rendered = true, renderedEnd = true;
try {
  S.G = newGame('测试'); S.G.ach = ['talkall']; S.achScroll = 0; S.scene = 'ach';
  drawAch();
} catch (e) { rendered = false; }
try {
  S.achScroll = 200; // 60 项滚到最末页不抛错
  drawAch();
} catch (e) { renderedEnd = false; }
S.achScroll = 0; S.scene = 'world';
ok('运行期：成就页 drawAch 60 项渲染不抛错', rendered);
ok('运行期：成就页末页滚动渲染不抛错（60 项）', renderedEnd);

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树串尾已延伸至 smoke_v2313_talkall（v2312 后接 v2313）',
  readme.includes('+ smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 旧串尾零残留（smoke_v2312_voltitle（npm test 串跑）不在树尾）',
  !readme.includes('smoke_v2312_voltitle（npm test 串跑）'));
ok('README 件套口径为二百一十二件套（二百一十一件套清除）且旧 208 口径零残留',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟二百零八件套（二百零七件套清' + '除）'));
ok('README 不含哨兵领先一位（二百一十三件套（二百一十二件套清除））',
  !readme.includes('二百一十三件套（二百一十二件套清除）'));
ok('README 含 v23.13 守护描述（新成就有口皆碑守护）', readme.includes('v23.13 起含 新成就「有口皆碑」守护'));
ok('README 含 smoke_v2313_talkall 入库（209 份）', readme.includes('smoke_v2313_talkall 入库（209 份）'));
ok('README 仍保留 v23.12 守护描述（历史口径）', readme.includes('v23.12 起含 标题画面提示行「[ / ] 音量」口径守护'));
ok('README 仍保留 smoke_v2312_voltitle 入库（208 份）历史口径', readme.includes('smoke_v2312_voltitle 入库（208 份）'));
ok('README 成就口径「60 项」双处同步（快速上手表 C 键行 + 图鉴&成就行）',
  readme.includes('成就一览（全部 60 项进度') && readme.includes('**60 项成就**') &&
  !readme.includes('成就一览（全部 59 项进' + '度') && !readme.includes('**59 项成' + '就**'));
ok('README 数值速查成就档位行含社交档「有口皆碑」与共 60 项',
  readme.includes('社交向单档「有口皆碑」') && readme.includes('共 60 项'));
ok('package.json 已收录 smoke_v2313_talkall（npm test 串跑第 209 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2313_talkall.mjs'));
ok('package.json 串尾为 ... smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"',
  pkg.includes('node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 209 件套', testChain === 212, String(testChain));
ok('CHANGELOG 顶部已追加 v23.13 条目', changelog.startsWith('## v23.29 '));
ok('CHANGELOG 仍保留 v23.12 条目（历史口径）', changelog.includes('## v23.12 标题画面提示行补「[ / ] 音量」口径'));

// —— 姊妹件套 pin 随新现实更新 + 旧代 v23.12 pin 零残留 ——
const s2312 = read('smoke_v2312_voltitle.mjs');
const s2297 = read('smoke_v2297_chestmid.mjs');
const s2229 = read('smoke_v2229_metall.mjs');
const s2143 = read('smoke_v2143_talkekey.mjs');
ok('smoke_v2312 的 GAME_VERSION 字面量 pin 已更新为 v23.13', s2312.includes("const GAME_VERSION = 'v23.29';"));
ok('smoke_v2312 的 CHANGELOG 顶 pin 已更新为 ## v23.13',
  s2312.includes("startsWith('## v23.29 "));
ok('smoke_v2312 的件套 pin 已更新为二百一十二件套（二百一十一件套清除）', s2312.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2312 的 README 串尾 pin 已延伸至 smoke_v2313_talkall',
  s2312.includes('smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2312 的 package 串尾 pin 已延伸至 smoke_v2313_talkall',
  s2312.includes('node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
ok('smoke_v2312 的 testChain pin 已更新为 209', s2312.includes('testChain === 212'));
ok('smoke_v2297 的 ACH_LIST 精确计数 pin 已更新为 === 60', s2297.includes('ACH_LIST.length === 60'));
ok('smoke_v2229 的 ACH_LIST 精确计数 pin 已更新为 === 60', s2229.includes('ACH_LIST.length === 60'));
ok('smoke_v2143 哨兵链已推进至二百一十三件套（二百一十二件套清除）', s2143.includes('二百一十三件套（二百一十二件套清除）') && s2143.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));

// 旧代 v23.12 pin 全库零残留（不含本件）
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2313_talkall.mjs');
const stale = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("const GAME_VERSION = 'v23.12';") || src.includes("GAME_VERSION === 'v23.12'") ||
      src.includes('二百零八件套（二百零七件套清' + '除）') || src.includes('testChain === ' + '208') ||
      src.includes('smoke_v2312_voltitle（npm test 串' + '跑）') || src.includes("startsWith('## v23.12 ") ||
      src.includes('smoke_v2312_voltitle.mjs"') || src.includes('全部 59 项进' + '度') ||
      src.includes('**59 项成' + '就**') || src.includes('ACH_LIST.length === ' + '59')) stale.push(f);
}
ok('旧代 v23.12 字面量/恒等/件套/testChain/串尾/顶 pin/package 串尾/成就口径 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

console.log(`\n— v23.13 有口皆碑冒烟：${n - failed}/${n} 通过 —`);
if (failed) process.exit(1);
