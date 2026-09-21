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
import { GAME_VERSION, ACH_LIST, NPCS, NPC_SPOTS, DEFLECT_GOAL } from '../js/data.js';

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
const enemyAISrc = read('../js/enemyAI.js');
const battleSrc = read('../js/battle.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v23.13 版本注释', dataSrc.includes('// v23.13 新内容·社交向单成就：新成就「有口皆碑」'));
ok('data.js GAME_VERSION 字面量已为 v23.13（旧 v23.12 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.47';") && !dataSrc.includes("const GAME_VERSION = 'v23.12';"));
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
ok('ACH_LIST 精确总数 61 项（v23.36 战斗维度新成就入列 60→61）', ACH_LIST.length === 61, String(ACH_LIST.length));
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

// —— v23.36 战斗维度新成就「以守为攻」（防御反击累计 DEFLECT_GOAL 次）——
const defl = ACH_LIST.find((a) => a.id === 'deflect');
ok('ACH_LIST 含 deflect「以守为攻」且 id 唯一（末尾追加，既有 60 项序位零位移）',
  !!defl && defl.name === '以守为攻' && ACH_LIST.filter((a) => a.id === 'deflect').length === 1 &&
  ACH_LIST.findIndex((a) => a.id === 'deflect') === 60);
ok('DEFLECT_GOAL 数据契约（阈值单一数据源，判定/进度/描述三端同读）', DEFLECT_GOAL === 15, String(DEFLECT_GOAL));
ok('deflect 描述由 DEFLECT_GOAL 派生（零裸字面量）', defl.d === `防御反击累计 ${DEFLECT_GOAL} 次`, defl.d);
ok('deflect 判定/进度读 (g.deflects||0) 防御式（旧档无字段=0 不误解锁零迁移）',
  String(defl.ok).includes('(g.deflects||0)') && String(defl.prog).includes('g.deflects||0'));
ok('deflect 无 r 字段纯里程碑（与 talkall/memoir/skills 同款）', !('r' in defl));
ok('deflect 0 次（缺字段旧档）→ false 且 prog 0/15', defl.ok({}) === false && defl.prog({}) === `0/${DEFLECT_GOAL}`);
ok('deflect 14 次（恰差 1）→ false 且 prog 14/15', defl.ok({ deflects: 14 }) === false && defl.prog({ deflects: 14 }) === `14/${DEFLECT_GOAL}`);
ok('deflect 15 次（恰好达标）→ true 且 prog 15/15', defl.ok({ deflects: 15 }) === true && defl.prog({ deflects: 15 }) === `${DEFLECT_GOAL}/${DEFLECT_GOAL}`);
ok('deflect 30 次（超阈值）→ true 且 prog 不钳制 30/15（与 hunt10 同式）', defl.ok({ deflects: 30 }) === true && defl.prog({ deflects: 30 }) === `30/${DEFLECT_GOAL}`);
ok('enemyAI.js 含 v23.36 注释（以守为攻计数说明）', enemyAISrc.includes('v23.36 成就「以守为攻」计数'));
ok('enemyAI.js 反击唯一产生点源级落位（hero.deflects 自增 + 当场 applyAchievements 经 deps）',
  enemyAISrc.includes('hero.deflects = (hero.deflects || 0) + 1;') &&
  enemyAISrc.includes('if (deps.applyAchievements) deps.applyAchievements();'));
ok('battle.js BATTLE_DEPS 追加 applyAchievements（enemyAI 侧零新增 import，不反向 import battle.js）',
  battleSrc.includes('const BATTLE_DEPS = { addFx, winBattle, loseBattle, applyAchievements };'));
ok('data.js 含 v23.36 版本注释与 deflect 条目注释', dataSrc.includes('v23.36 新内容·战斗维度里程碑') && dataSrc.includes('// 以守为攻（v23.36'));
// —— v23.38 反击战报补「以守为攻 N/M」进度（体验打磨·信息透明·反馈不迟到·纯显示）——
ok('data.js 含 v23.38 版本注释（反击战报补以守为攻进度）', dataSrc.includes('v23.38 体验打磨·信息透明·反馈不迟到'));
ok('data.js GAME_VERSION 已级联 v23.40（旧 v23.38 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.47';") && !dataSrc.includes("const GAME_VERSION = 'v23.38';"));
ok('enemyAI.js 数据源 import 补 DEFLECT_GOAL（进度与计数同读一份源）', enemyAISrc.includes('FX_HERO, DEFLECT_GOAL } from'));
ok('enemyAI.js 反击战报补「· 以守为攻 N/M」派生段（dfc 与 DEFLECT_GOAL 同源、既有文案逐字保留）',
  enemyAISrc.includes('const dfc = (hero.deflects || 0) + 1;') &&
  enemyAISrc.includes('· 以守为攻 ${dfc}/${DEFLECT_GOAL}'));
ok('data.js 导出具 DEFLECT_GOAL（export 单一出口）', dataSrc.includes('TREE_GOAL, DEFLECT_GOAL,'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.40', dataSrc.includes("const GAME_VERSION = 'v23.47';") && !dataSrc.includes("const GAME_VERSION = 'v23.35';"));
ok('README 同步（C 行 61 项 / 成就 bullet 61 项·以守为攻 X/15 次 / 成就档位行 DEFLECT_GOAL(15)·共 61 项 / 战斗防御句）',
  readme.includes('全部 61 项进度') && readme.includes('**61 项成就**') && readme.includes('以守为攻 X/15 次（防御反击累计，v23.36）') &&
  readme.includes('DEFLECT_GOAL`(15) 次，v23.36') && readme.includes('共 61 项') && readme.includes('15 次解锁成就「以守为攻」'));
ok('CHANGELOG 顶部已追加 v23.40 条目', changelog.startsWith('## v23.47 '));

// —— v23.39 HUD 昼夜标签补「×倍率 · 剩Xs」（体验打磨·信息透明·纯显示）——
const hudSrc = read('../js/view/hud.js');
ok('data.js 含 v23.39 版本注释（HUD 昼夜标签补倍率与剩秒）', dataSrc.includes('v23.39 体验打磨·信息透明·纯显示'));
ok('hud.js 数据源 import 补 ENCOUNTER/DAY_PHASE_S（与 tickEncounter/小地图同读一份源）',
  hudSrc.includes('import { MAPS, ENCOUNTER, DAY_PHASE_S } from'));
ok('hud.js 相位标签派生段源级落位（phaseK 由 phaseGauge 派生、剩秒 = DAY_PHASE_S − floor(time)%DAY_PHASE_S、×1 零噪音）',
  hudSrc.includes('const phaseK = curMap() === \'gallery\' ? 1 : ((ENCOUNTER.phaseGauge || {})[timeOfDay()] || 1);') &&
  hudSrc.includes('const phaseLeft = DAY_PHASE_S - (Math.floor(gtime) % DAY_PHASE_S);') &&
  hudSrc.includes("(phaseK !== 1 ? '×' + phaseK : '')") &&
  hudSrc.includes("' ·剩' + phaseLeft + 's'"));
ok('hud.js 恒暗例外保留（无字回廊不显示倍率/剩秒，与 v14.8/drawTimeTint 同判）',
  hudSrc.includes("curMap() === 'gallery' ? '🌑 恒暗'"));

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
const { renderHUD } = await import('../js/view/hud.js');

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

// —— v23.39 HUD 昼夜标签补「×倍率 · 剩Xs」运行期（DOM 桩 + renderHUD 真实路径）——
const h1 = newGame('昼');
S.G = h1;
S.scene = 'world';
h1.time = 200; // floor(200/90)%4=2 → night；200%90=20 → 剩 70s
renderHUD();
ok('运行期：HUD 夜晚标签含 ×1.25 与 剩70s（与 tickEncounter 同读 phaseGauge/DAY_PHASE_S 派生）',
  els['s-map'].textContent.includes('🌙 夜晚×1.25') && els['s-map'].textContent.includes('剩70s'),
  els['s-map'].textContent);
h1.time = 0; // day；×1 零噪音
renderHUD();
ok('运行期：HUD 白天标签含 剩90s 且不显示 ×1（×1 相位零噪音）',
  els['s-map'].textContent.includes('☀️ 白天') && els['s-map'].textContent.includes('剩90s') && !els['s-map'].textContent.includes('×1'),
  els['s-map'].textContent);
h1.time = 450; // floor(450/90)%4=1 → dusk；450%90=0 → 剩 90s
renderHUD();
ok('运行期：HUD 黄昏整倍时刻剩秒回满 90s（t=整倍即新一轮，与 dayPhase 分档同式）',
  els['s-map'].textContent.includes('🌆 黄昏') && els['s-map'].textContent.includes('剩90s'),
  els['s-map'].textContent);
h1.time = 0;
h1.map = 'gallery'; // 无字回廊恒暗例外
renderHUD();
ok('运行期：无字回廊 HUD 仍标 🌑 恒暗且不显示剩秒（恒暗例外，与 v14.8/drawTimeTint 同判；zone 倍率照常）',
  els['s-map'].textContent.includes('🌑 恒暗') && !els['s-map'].textContent.includes('剩'),
  els['s-map'].textContent);
h1.map = 'village';

// —— v23.40 逃跑成功专属音效（音效反馈·语义修正·弃用菜单移动音）——
ok('data.js 含 v23.40 版本注释（逃跑成功专属音效·承 v23.22/v23.33 同族）', dataSrc.includes('v23.40 音效反馈·语义修正'));
const audioSrc = read('../js/audio.js');
ok('audio.js 含 v23.40 注释与 SFX.flee（square 下行快三步 523→392→294，末音略长如脚步远去收尾）',
  audioSrc.includes('v23.40 逃跑成功专属音效') &&
  audioSrc.includes("flee() { tone(523, 0.07, 'square', 0.09); tone(392, 0.07, 'square', 0.09, 0.07); tone(294, 0.12, 'square', 0.09, 0.14); }"));
ok('battle.js doFlee 逃脱成功分支源级落位（v23.40 注释 + SFX.flee()；Boss 气场压制分支仍 SFX.cancel 逐字未动）',
  battleSrc.includes('v23.40 逃跑成功专属音效') && battleSrc.includes('SFX.flee();') &&
  battleSrc.includes('的气场压制着你，无法逃脱！（本回合行动保留）') && battleSrc.includes('逃脱失败！（'));
ok('audio.js SFX 对象新增 flee 键且既有键零回归（select/cancel/alert/victory/ach/craft 逐字保留）',
  audioSrc.includes('select() { tone(660, 0.05') && audioSrc.includes('cancel() { tone(330, 0.07') &&
  audioSrc.includes('alert() { tone(494, 0.08') && audioSrc.includes('victory() { [523, 659, 784, 1047, 1319]') &&
  audioSrc.includes('ach() { tone(659, 0.09') && audioSrc.includes('craft() { tone(440, 0.06'));

// 运行期：真实路径（DOM/音频桩 + main.js 导入后 playerAction('flee') 全链路）
const audioMod = await import('../js/audio.js');
const btlMod = await import('../js/battle.js');
const _origRandom = Math.random;
const _origFlee = audioMod.SFX.flee, _origSelect = audioMod.SFX.select, _origCancel = audioMod.SFX.cancel;
let fleeN = 0, selN = 0, cancelN = 0;
audioMod.SFX.flee = () => { fleeN++; };
audioMod.SFX.select = () => { selN++; };
audioMod.SFX.cancel = () => { cancelN++; };
const h2 = newGame('逃');
S.G = h2; S.scene = 'battle'; S.battleBusy = false; S.enemy = { name: '史莱姆' };
Math.random = () => 0; // FLEE_SUCCESS=0.6 → 必成功
btlMod.playerAction('flee');
ok('运行期：普通怪逃脱成功播 SFX.flee 且不再播 SFX.select（弃用菜单移动音）', fleeN === 1 && selN === 0, `flee=${fleeN} sel=${selN}`);
ok('运行期：逃脱成功正常离场（回 world、enemy 清空、battleBusy 释放、BGM 恢复）',
  S.scene === 'world' && S.enemy === null && S.battleBusy === false);
S.scene = 'battle'; S.battleBusy = false; S.enemy = { name: '幽冥魔王', isBoss: true };
btlMod.playerAction('flee');
ok('运行期：Boss 气场压制分支仍 SFX.cancel（不误播 SFX.flee）', cancelN === 1 && fleeN === 1, `cancel=${cancelN} flee=${fleeN}`);
audioMod.SFX.flee = _origFlee; audioMod.SFX.select = _origSelect; audioMod.SFX.cancel = _origCancel;
Math.random = _origRandom;
S.enemy = null; S.scene = 'world';

// —— v23.41 README 音效行补「事件专属音效」家族（文档整理·同源口径·纯文档）——
ok('data.js 含 v23.41 版本注释（README 音效事件家族文档补全）', dataSrc.includes('v23.41 文档整理·数值说明·同源口径'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.41（旧 v23.40 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.47';") && !dataSrc.includes("const GAME_VERSION = 'v23.40';"));
ok('data.js 仍保留 v23.40 历史注释（音效反馈·语义修正，与 audio.js SFX.flee 注释同族）',
  dataSrc.includes('v23.40 音效反馈·语义修正'));
ok('README 音效行补「事件专属音效」括号（成就铃声 v23.22 / 酿造气泡上行 v23.33 / 逃跑下行三步 v23.40）',
  readme.includes('**事件专属音效**') && readme.includes('成就铃声（sine 三连上行，v23.22）') &&
  readme.includes('酿造气泡上行（v23.33）') && readme.includes('逃跑成功下行三步（v23.40）') &&
  readme.includes('同一「事件音效各归其位」主线'));
ok('README 音效行既有口径逐字保留（战斗开场警报音 / 主音量调节段未动）',
  readme.includes('战斗开场警报音') && readme.includes('进战瞬间一听即知来的是杂兵还是强敌') &&
  readme.includes('主音量调节') && readme.includes('10% 步进、0~100%'));
ok('README 音效行仍在快速上手表·音效哨兵可见域（BGM / 音效 行未被拆分）',
  readme.includes('- **BGM / 音效**'));

// —— v23.42 新支线「夜路的狼嚎」（客栈老板娘升格委托人·WOLF_GOAL 单一数据源·新内容·数据层零新逻辑）——
ok('data.js 含 v23.42 版本注释（客栈老板娘升格为讨伐支线「夜路的狼嚎」委托人）',
  dataSrc.includes('// v23.42 新内容·新支线：潮灯镇旅馆东侧门外客栈老板娘升格为讨伐支线「夜路的狼嚎」委托人'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.42（旧 v23.41 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.47';") && !dataSrc.includes("const GAME_VERSION = 'v23.41';"));
ok('data.js 仍保留 v23.41 历史注释（README 音效事件家族文档补全）', dataSrc.includes('v23.41 文档整理·数值说明·同源口径'));
ok('data.js WOLF_GOAL=3 单一数据源 + QUESTS.side_wolf 字面量逐字（40 金 + 2 药水 · 客栈老板娘委托人）',
  dataSrc.includes('const WOLF_GOAL = 3;') && dataSrc.includes('reward:{ gold:40, item:2 }') &&
  dataSrc.includes("id:'side_wolf', kind:'side', store:true, npc:'innkeeper', giver:'innkeeper'"));
ok('README 支线行 夜路的狼嚎 v23.42 逐字（40 金 + 2 药水 · WOLF_GOAL 常量源列）',
  readme.includes('夜路的狼嚎（客栈老板娘 · 3 只野狼 `WOLF_GOAL`）40 金 + 2 药水') &&
  readme.includes('`GRAIN_GOAL` `WOLF_GOAL` `TREE_GOAL`'));
ok('README 支线行开头已随新现实更新为 十条支线', readme.includes('十条支线目标/奖励全部由 `QUESTS[].reward` 单一数据源派生'));
ok('CHANGELOG 顶部已追加 v23.42 条目（新支线夜路的狼嚎）', changelog.startsWith('## v23.47 '));

// —— v23.43 暴击专属上扬音（音效反馈·听觉信息透明·承 v23.22/33/40 事件音效各归其位主线收口）——
ok('data.js 含 v23.43 版本注释（暴击专属上扬音·承 v21.3/v23.22-40 主线）', dataSrc.includes('v23.43 音效反馈·听觉信息透明'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.43（旧 v23.42 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.47';") && !dataSrc.includes("const GAME_VERSION = 'v23.42';"));
ok('data.js 仍保留 v23.42 历史注释（夜路的狼嚎·新内容数据层零新逻辑）', dataSrc.includes('v23.42 新内容·新支线'));
ok('audio.js 含 SFX.crit 上挑滑音（sawtooth 320→700，与 SFX.hit 低坠同族反向一听即分）',
  audioSrc.includes("crit() { tone(320, 0.11, 'sawtooth', 0.13, 0, 380); }"));
ok('battle.js attackMove 暴击音分支落位（crit 真→SFX.crit；非暴击/技能走原分支逐字未动）',
  battleSrc.includes('if (crit) SFX.crit();') && battleSrc.includes('else if (sfx) SFX[sfx]();') &&
  battleSrc.includes('else SFX.hit();'));
ok('battle.js 暴击结算/文案逐字零回归（isCrit ? CRIT_MULT : 1 与（暴击×${CRIT_MULT}！）未动）',
  battleSrc.includes('(isCrit ? CRIT_MULT : 1)') && battleSrc.includes('（暴击×${CRIT_MULT}！）'));
ok('audio.js SFX 既有键零回归（hit/ach/craft/flee/select/cancel 逐字保留）',
  audioSrc.includes("hit() { tone(140, 0.12, 'sawtooth', 0.12, 0, -80); }") && audioSrc.includes("ach() { tone(659, 0.09") &&
  audioSrc.includes("craft() { tone(440, 0.06") && audioSrc.includes("flee() { tone(523, 0.07") &&
  audioSrc.includes("select() { tone(660, 0.05") && audioSrc.includes("cancel() { tone(330, 0.07"));
ok('README 音效行事件专属音效家族补暴击上扬滑音 v23.43（既有三项逐字保留）',
  readme.includes('成就铃声（sine 三连上行，v23.22）') && readme.includes('酿造气泡上行（v23.33）') &&
  readme.includes('逃跑成功下行三步（v23.40）') && readme.includes('暴击上扬滑音（v23.43）'));
ok('README 快速上手表·战斗行补暴击专属上扬音（与普攻一听即分）',
  readme.includes('暴击瞬间有专属上扬音（v23.43'));
ok('CHANGELOG 顶部已追加 v23.43 条目（暴击专属上扬音）', changelog.startsWith('## v23.47 '));
// 运行期：真实路径（startBattle + playerAction('attack')，Math.random 强制暴击/非暴击两档）
const _origCrit = audioMod.SFX.crit, _origHit2 = audioMod.SFX.hit;
let critN = 0, hitN2 = 0;
audioMod.SFX.crit = () => { critN++; };
audioMod.SFX.hit = () => { hitN2++; };
S.G = newGame('试'); S.G.map = 'village';
btlMod.startBattle({ name: '木桩', hp: 5000, hpMax: 5000, atk: 5, def: 10, xp: 1, gold: 0 });
S.battleBusy = false;
Math.random = () => 0.05; // CRIT_RATE=0.12 → 暴击档
btlMod.playerAction('attack');
ok('运行期：暴击普攻播 SFX.crit 且不播 SFX.hit（听声即知这一刀暴了）', critN === 1 && hitN2 === 0, `crit=${critN} hit=${hitN2}`);
S.G = newGame('试'); S.G.map = 'village';
btlMod.startBattle({ name: '木桩', hp: 5000, hpMax: 5000, atk: 5, def: 10, xp: 1, gold: 0 });
S.battleBusy = false;
Math.random = () => 0.99; // 非暴击档
btlMod.playerAction('attack');
ok('运行期：非暴击普攻仍播 SFX.hit（不误播 SFX.crit）', hitN2 === 1 && critN === 1, `crit=${critN} hit=${hitN2}`);
audioMod.SFX.crit = _origCrit; audioMod.SFX.hit = _origHit2;
Math.random = _origRandom;
S.enemy = null; S.scene = 'world';

// —— v23.44 战斗指令栏 [5]防御 预览补全「回蓝/反击」（体验打磨·信息透明·纯显示——承 v23.02 指令栏
// 效果透明家族收口的末两格 + v23.36 成就「以守为攻」同一「防御=减伤+回蓝+反击」口径）——
const _dbSrc = read('../js/view/drawBattle.js');
ok('data.js 含 v23.44 版本注释（指令栏 [5]防御 预览补全回蓝/反击）',
  dataSrc.includes('v23.44 体验打磨·信息透明·纯显示：战斗指令栏'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.44（旧 v23.43 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.47';") && !dataSrc.includes("const GAME_VERSION = 'v23.43';"));
ok('data.js 仍保留 v23.43 历史注释（暴击专属上扬音）', dataSrc.includes('v23.43 音效反馈·听觉信息透明'));
ok('drawBattle.js 含 v23.44 注释块（[5]防御 回蓝/反击 预览补全）',
  _dbSrc.includes('// v23.44 指令栏 [5]防御 预览补全「回蓝/反击」'));
ok('drawBattle.js 指令栏 [5]防御 三件套全量预览（DEFEND_MULT·DEFEND_MP·COUNTER_CHANCE·COUNTER_MULT 派生·与角标/预判/结算同源）',
  _dbSrc.includes('[5]防御·减${Math.round((1 - DEFEND_MULT) * 100)}%·回${DEFEND_MP}MP·反击${Math.round(COUNTER_CHANCE * 100)}%×${COUNTER_MULT}'));
ok('drawBattle.js [4]逃跑 token v23.44 压缩口径（·N% 由 FLEE_SUCCESS 派生）',
  _dbSrc.includes("'·' + Math.round(FLEE_SUCCESS * 100) + '%'"));
ok('drawBattle.js [4]逃跑旧「·成功率约」口径零残留（v23.44 已压缩）', !_dbSrc.includes("'·成功率约'"));
ok('drawBattle.js ⛔ 前缀测量行零回归（[:4]逃跑 截止逐字未动）',
  _dbSrc.includes("`[1]攻击${atkPrev}  [2]技能  [3]药水🍖×${pN}${p2 ? ` 🧪×${p2}` : ''}  [4]逃跑`).width"));
ok('CHANGELOG 顶部已追加 v23.44 条目（指令栏 [5]防御 回蓝/反击 预览补全）', changelog.startsWith('## v23.47 '));

// —— v23.45 Boss/试炼战专属战斗 BGM（音效反馈·听觉信息透明，承 v21.3 alert/boss「先闻其声」持续侧收口）——
const _auSrc = read('../js/audio.js');
const _btnSrc = read('../js/battle.js');
ok('data.js 含 v23.45 版本注释（Boss/试炼战专属战斗 BGM）',
  dataSrc.includes('v23.45 音效反馈·听觉信息透明：Boss/试炼战专属战斗 BGM'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.45（旧 v23.44 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.47';") && !dataSrc.includes("const GAME_VERSION = 'v23.44';"));
ok('audio.js 含 MUSIC.battleBoss 轨（step 0.22 慢于 battle 0.13 · 三角波半音阶下行 A3→G#3→G3→F#3 · 低音持续）',
  _auSrc.includes('battleBoss: {') && _auSrc.includes("step: 0.22, wave: 'triangle'") &&
  _auSrc.includes('seq: [220, 0, 0, 0, 208, 0, 0, 0, 196, 0, 0, 0, 185, 0, 0, 0]'));
ok('audio.js MUSIC.battle 原轨逐字未动（杂兵战音乐零回归）',
  _auSrc.includes('seq: [330, 330, 0, 330, 0, 392, 330, 0, 294, 0, 330, 0, 262, 262, 0, 0]'));
ok('battle.js startBattle 战斗 BGM 按 isBossFoe 分轨（battleBoss/battle · 与 SFX.boss/alert 同一判定源）',
  _btnSrc.includes("startBgm(isBossFoe(S.enemy) ? 'battleBoss' : 'battle')") && !_btnSrc.includes("startBgm('battle');"));
ok('battle.js SFX.alert/SFX.boss 警报分支逐字未动（v23.45 零回归）',
  _btnSrc.includes('if (isBossFoe(S.enemy)) SFX.boss(); else SFX.alert();'));
ok('CHANGELOG 顶部已追加 v23.45 条目（Boss/试炼战专属战斗 BGM）', changelog.startsWith('## v23.47 '));

// —— v23.46 真身变身专属音效（音效反馈·语义修正，承 v23.22/33/40/43 事件音效各归其位主线收口）——
const _enemySrc = read('../js/enemyAI.js');
ok('data.js 含 v23.46 版本注释（真身变身专属音效·语义修正）',
  dataSrc.includes('v23.46 音效反馈·语义修正：Boss 现出真身（变身）专属音效'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.46（旧 v23.45 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.47';") && !dataSrc.includes("const GAME_VERSION = 'v23.45';"));
ok('data.js 仍保留 v23.45 历史注释（Boss/试炼战专属战斗 BGM）',
  dataSrc.includes('v23.45 音效反馈·听觉信息透明：Boss/试炼战专属战斗 BGM'));
ok('audio.js 含 SFX.transform 上涌三连（低音 saw 60→210 + 中音 triangle 300→520 + 高音 sine 1180→760）',
  audioSrc.includes("transform() { tone(60, 0.5, 'sawtooth', 0.13, 0, 150); tone(300, 0.34, 'triangle', 0.1, 0.08, 220); tone(1180, 0.5, 'sine', 0.06, 0.2, -420); }"));
ok('audio.js 含 v23.46 注释块（真身变身专属音效·与逃脱离场同族成对）', audioSrc.includes('// v23.46 真身变身专属音效'));
ok('audio.js SFX.thunder 仍定义（雷鸣技能走 SFX[sfx] 不受影响，v23.46 零回归）',
  audioSrc.includes("thunder() { tone(90, 0.3, 'sawtooth', 0.16, 0);") && audioSrc.includes("tone(800, 0.1, 'square', 0.08, 0, 300)"));
ok('enemyAI.js 变身分支改播 SFX.transform()（原 SFX.thunder() 已替换·v23.46 落位）',
  _enemySrc.includes('SFX.transform();') && !_enemySrc.includes('SFX.thunder();'));
ok('enemyAI.js 含 v23.46 注释块（变身分支弃用雷鸣落雷音）', _enemySrc.includes('// v23.46 真身变身专属音效'));
ok('enemyAI.js 变身结算链逐字零回归（判定/攻防加算/回血/战报/闪光/释放 busy）',
  _enemySrc.includes('enemy.hp < enemy.hpMax * (phase.at || PHASE2_AT)') && _enemySrc.includes('enemy.atk += atkUp;') &&
  _enemySrc.includes('enemy.hp = Math.min(enemy.hpMax, enemy.hp + heal);') && _enemySrc.includes('S.flash = { t0: Date.now() };') &&
  _enemySrc.includes('S.battleBusy = false;'));
ok('README 音效行事件专属音效家族补真身变身专属音效 v23.46（既有四项逐字保留）',
  readme.includes('成就铃声（sine 三连上行，v23.22）') && readme.includes('酿造气泡上行（v23.33）') &&
  readme.includes('逃跑成功下行三步（v23.40）') && readme.includes('暴击上扬滑音（v23.43）') &&
  readme.includes('真身变身专属音效（v23.46'));
ok('CHANGELOG 顶部已追加 v23.46 条目（真身变身专属音效）', changelog.startsWith('## v23.47 '));
// 运行期：真实 enemyAct 变身路径（Boss 血过半触发，Stub 计 transform/thunder 调用数）
const _origTr = audioMod.SFX.transform, _origTh = audioMod.SFX.thunder;
let trN = 0, thN = 0;
audioMod.SFX.transform = () => { trN++; };
audioMod.SFX.thunder = () => { thN++; };
S.scene = 'battle'; S.battleBusy = true; S.enemy = null;
S.G = newGame('变'); S.G.map = 'cave';
S.enemy = { name: '幽冥魔王', hpMax: 420, hp: 100, atk: 23, def: 13,
  acts: [{ type: 'attack', w: 100 }],
  phase2: { at: 0.5, name: '幽冥魔王·真身', atk: 7, def: 3, heal: 0.15 } };
S.flash = null; S.blog.length = 0;
const _aiMod = await import('../js/enemyAI.js');
_aiMod.enemyAct({ addFx: noop, winBattle: noop, loseBattle: noop });
ok('运行期：Boss 血过半变身播 SFX.transform 且不再播 SFX.thunder（弃用雷鸣落雷音）', trN === 1 && thN === 0, `tr=${trN} th=${thN}`);
ok('运行期：变身一次性（phased 置位 + 真身名生效 + 战报「现出真身」+ 全屏闪光投递）',
  S.enemy.phased === true && S.enemy.name === '幽冥魔王·真身' &&
  S.blog.some((b) => String(b).includes('现出真身')) && !!S.flash);
audioMod.SFX.transform = _origTr; audioMod.SFX.thunder = _origTh;
S.enemy = null; S.scene = 'world';

// —— v23.47 蓄力专属音效（音效反馈·语义修正，承 v23.22/33/40/43/46 事件音效各归其位主线收口）——
ok('data.js 含 v23.47 版本注释（蓄力专属音效·语义修正）',
  dataSrc.includes('v23.47 音效反馈·语义修正：蓄力专属音效'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.47（旧 v23.46 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.47';") && !dataSrc.includes("const GAME_VERSION = 'v23.46';"));
ok('data.js 仍保留 v23.46 历史注释（真身变身专属音效）',
  dataSrc.includes('v23.46 音效反馈·语义修正：Boss 现出真身（变身）专属音效'));
ok('audio.js 含 SFX.charge 上挑三连（square 392→523→659）',
  audioSrc.includes("charge() { tone(392, 0.06, 'square', 0.09); tone(523, 0.06, 'square', 0.1, 0.06); tone(659, 0.13, 'square', 0.1, 0.12); }"));
ok('audio.js 含 v23.47 注释块（蓄力专属音效·与防御/格挡同族反向成对）', audioSrc.includes('// v23.47 蓄力专属音效'));
ok('audio.js SFX.block 仍定义（[5]防御/石甲格挡 v23.47 零回归）',
  audioSrc.includes("block() { tone(320, 0.06, 'triangle', 0.1); tone(480, 0.08, 'triangle', 0.08, 0.05); }"));
const _blkInBtl = (battleSrc.match(/SFX\.block\(\);/g) || []).length;
ok('battle.js doCharge 改播 SFX.charge()（v23.47 落位；doDefend 防御仍 SFX.block 恰一处）',
  battleSrc.includes('SFX.charge();') && battleSrc.includes('hero.charge = true;') && _blkInBtl === 1, 'block callsites=' + _blkInBtl);
ok('battle.js 含 v23.47 注释块（蓄力分支弃用防御/石甲同款 block 音）', battleSrc.includes('// v23.47 蓄力专属音效'));
ok('battle.js 蓄力结算链逐字零回归（气场压制判定/置位/战报 ×CHARGE_MULT 派生/afterPlayer）',
  battleSrc.includes("enemy.forbid && enemy.forbid.includes('charge')") &&
  battleSrc.includes('凝神蓄力：下一次【攻击或技能】威力 ×${CHARGE_MULT}') && battleSrc.includes('afterPlayer();'));
ok('enemyAI.js 石甲格挡仍 SFX.block（v23.47 零回归）', _enemySrc.includes('SFX.block();'));
ok('README 音效行事件专属音效家族补蓄力专属音效 v23.47（既有五项逐字保留）',
  readme.includes('成就铃声（sine 三连上行，v23.22）') && readme.includes('酿造气泡上行（v23.33）') &&
  readme.includes('逃跑成功下行三步（v23.40）') && readme.includes('暴击上扬滑音（v23.43）') &&
  readme.includes('真身变身专属音效（v23.46') && readme.includes('蓄力专属音效（v23.47'));
ok('CHANGELOG 顶部已追加 v23.47 条目（蓄力专属音效）', changelog.startsWith('## v23.47 '));
// 运行期：真实 playerAction('charge')/('defend') 路径（Stub 计 charge/block 调用数）
const _origChg = audioMod.SFX.charge, _origBlk2 = audioMod.SFX.block;
let chgN = 0, blkN2 = 0;
audioMod.SFX.charge = () => { chgN++; };
audioMod.SFX.block = () => { blkN2++; };
S.G = newGame('蓄'); S.G.map = 'village';
btlMod.startBattle({ name: '木桩', hp: 5000, hpMax: 5000, atk: 5, def: 10, xp: 1, gold: 0 });
S.battleBusy = false;
btlMod.playerAction('charge');
ok('运行期：蓄力播 SFX.charge 且不播 SFX.block（听声即知在蓄力非防御）', chgN === 1 && blkN2 === 0, `chg=${chgN} blk=${blkN2}`);
ok('运行期：蓄力生效（charge 置位 + 战报「凝神蓄力」落账）',
  S.G.charge === true && S.blog.some((b) => String(b).includes('凝神蓄力')));
S.G = newGame('防'); S.G.map = 'village';
btlMod.startBattle({ name: '木桩', hp: 5000, hpMax: 5000, atk: 5, def: 10, xp: 1, gold: 0 });
S.battleBusy = false;
btlMod.playerAction('defend');
ok('运行期：防御仍播 SFX.block（不误播 SFX.charge）', blkN2 === 1 && chgN === 1, `chg=${chgN} blk=${blkN2}`);
audioMod.SFX.charge = _origChg; audioMod.SFX.block = _origBlk2;
S.enemy = null; S.scene = 'world';

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
  readme.includes('成就一览（全部 61 项进度') && readme.includes('**61 项成就**') &&
  !readme.includes('成就一览（全部 59 项进' + '度') && !readme.includes('**59 项成' + '就**'));
ok('README 数值速查成就档位行含社交档「有口皆碑」与共 61 项',
  readme.includes('社交向单档「有口皆碑」') && readme.includes('共 61 项'));
ok('package.json 已收录 smoke_v2313_talkall（npm test 串跑第 209 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2313_talkall.mjs'));
ok('package.json 串尾为 ... smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"',
  pkg.includes('node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 209 件套', testChain === 212, String(testChain));
ok('CHANGELOG 顶部已追加 v23.41 条目', changelog.startsWith('## v23.47 '));
ok('CHANGELOG 仍保留 v23.12 条目（历史口径）', changelog.includes('## v23.12 标题画面提示行补「[ / ] 音量」口径'));

// —— 姊妹件套 pin 随新现实更新 + 旧代 v23.12 pin 零残留 ——
const s2312 = read('smoke_v2312_voltitle.mjs');
const s2297 = read('smoke_v2297_chestmid.mjs');
const s2229 = read('smoke_v2229_metall.mjs');
const s2143 = read('smoke_v2143_talkekey.mjs');
ok('smoke_v2312 的 GAME_VERSION 字面量 pin 已更新为 v23.13', s2312.includes("const GAME_VERSION = 'v23.47';"));
ok('smoke_v2312 的 CHANGELOG 顶 pin 已更新为 ## v23.13',
  s2312.includes("startsWith('## v23.47 "));
ok('smoke_v2312 的件套 pin 已更新为二百一十二件套（二百一十一件套清除）', s2312.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2312 的 README 串尾 pin 已延伸至 smoke_v2313_talkall',
  s2312.includes('smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2312 的 package 串尾 pin 已延伸至 smoke_v2313_talkall',
  s2312.includes('node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
ok('smoke_v2312 的 testChain pin 已更新为 209', s2312.includes('testChain === 212'));
ok('smoke_v2297 的 ACH_LIST 精确计数 pin 已更新为 === 60', s2297.includes('ACH_LIST.length === 61'));
ok('smoke_v2229 的 ACH_LIST 精确计数 pin 已更新为 === 60', s2229.includes('ACH_LIST.length === 61'));
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

// —— v23.39 级联守护：旧代 v23.38 GAME_VERSION/顶 pin 全库零残留（仅 v23.38 特性标签保留）——
const stale39 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("const GAME_VERSION = 'v23.38';") || src.includes("GAME_VERSION === 'v23.38'") ||
      src.includes("startsWith('## v23.38")) stale39.push(f);
}
ok('旧代 v23.38 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.38 特性标签保留）', stale39.length === 0, stale39.join(','));

// —— v23.40 级联守护：旧代 v23.39 GAME_VERSION/顶 pin 全库零残留（仅 v23.39 特性标签保留）——
const stale40 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("const GAME_VERSION = 'v23.39';") || src.includes("GAME_VERSION === 'v23.39'") ||
      src.includes("startsWith('## v23.39")) stale40.push(f);
}
ok('旧代 v23.39 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.39 特性标签保留）', stale40.length === 0, stale40.join(','));

// —— v23.41 级联守护：旧代 v23.40 GAME_VERSION/顶 pin 全库零残留（仅 v23.40 特性标签保留）——
const stale41 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.40'") || src.includes("GAME_VERSION === 'v23.40'") ||
      src.includes("startsWith('## v23.40") || src.includes("'## v23.40 ")) stale41.push(f);
}
ok('旧代 v23.40 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.40 特性标签保留）', stale41.length === 0, stale41.join(','));

// —— v23.42 级联守护：旧代 v23.41 GAME_VERSION/顶 pin 全库零残留（仅 v23.41 特性标签保留）——
const stale42 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.41'") || src.includes("GAME_VERSION === 'v23.41'") ||
      src.includes("startsWith('## v23.41") || src.includes("'## v23.41 ")) stale42.push(f);
}
ok('旧代 v23.41 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.41 特性标签保留）', stale42.length === 0, stale42.join(','));

// —— v23.43 级联守护：旧代 v23.42 GAME_VERSION/顶 pin 全库零残留（仅 v23.42 特性标签保留）——
const stale43 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.42'") || src.includes("GAME_VERSION === 'v23.42'") ||
      src.includes("startsWith('## v23.42") || src.includes("'## v23.42 ")) stale43.push(f);
}
ok('旧代 v23.42 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.42 特性标签保留）', stale43.length === 0, stale43.join(','));

// —— v23.44 级联守护：旧代 v23.43 GAME_VERSION/顶 pin 全库零残留（仅 v23.43 特性标签保留）——
const stale44 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.43'") || src.includes("GAME_VERSION === 'v23.43'") ||
      src.includes("startsWith('## v23.43") || src.includes("'## v23.43 ")) stale44.push(f);
}
ok('旧代 v23.43 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.43 特性标签保留）', stale44.length === 0, stale44.join(','));

// —— v23.45 级联守护：旧代 v23.44 GAME_VERSION/顶 pin 全库零残留（仅 v23.44 特性标签保留）——
const stale45 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.44'") || src.includes("GAME_VERSION === 'v23.44'") ||
      src.includes("startsWith('## v23.44") || src.includes("'## v23.44 ")) stale45.push(f);
}
ok('旧代 v23.44 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.44 特性标签保留）', stale45.length === 0, stale45.join(','));

// —— v23.46 级联守护：旧代 v23.45 GAME_VERSION/顶 pin 全库零残留（仅 v23.45 特性标签保留）——
const stale46 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.45'") || src.includes("GAME_VERSION === 'v23.45'") ||
      src.includes("startsWith('## v23.45") || src.includes("'## v23.45 ")) stale46.push(f);
}
ok('旧代 v23.45 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.45 特性标签保留）', stale46.length === 0, stale46.join(','));

// —— v23.47 级联守护：旧代 v23.46 GAME_VERSION/顶 pin 全库零残留（仅 v23.46 特性标签保留）——
const stale47 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.46'") || src.includes("GAME_VERSION === 'v23.46'") ||
      src.includes("startsWith('## v23.46") || src.includes("'## v23.46 ")) stale47.push(f);
}
ok('旧代 v23.46 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.46 特性标签保留）', stale47.length === 0, stale47.join(','));

console.log(`\n— v23.13 有口皆碑冒烟：${n - failed}/${n} 通过 —`);
if (failed) process.exit(1);
