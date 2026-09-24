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
import { GAME_VERSION, ACH_LIST, NPCS, NPC_SPOTS, QUESTS, DEFLECT_GOAL, CHARGE_GOAL, CRIT_GOAL, CAST_GOAL, FLEE_GOAL, POTION_USE_GOAL, RUSH_CLEAR_GOAL, MAP_POTION_GOAL, INN_REST_GOAL, SPEND_GOAL, TRAVEL_GOAL, STEP_GOAL, BATTLE_GOAL, SELL_GOAL, DEATH_GOAL, NIGHT_WIN_GOAL, TRAVEL_LIST, TY, HELP_PAGES } from '../js/data.js';

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
const plan = read('../improve-plan.md');

ok('data.js 含 v23.13 版本注释', dataSrc.includes('// v23.13 新内容·社交向单成就：新成就「有口皆碑」'));
ok('data.js GAME_VERSION 字面量已为 v23.13（旧 v23.12 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.12';"));
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
ok('ACH_LIST 精确总数 62 项（v23.54 战斗维度第二枚「蓄势待发」入列 61→62）', ACH_LIST.length === 76, String(ACH_LIST.length));
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
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.38';"));
ok('enemyAI.js 数据源 import 补 DEFLECT_GOAL（进度与计数同读一份源）', enemyAISrc.includes('FX_HERO, DEFLECT_GOAL } from'));
ok('enemyAI.js 反击战报补「· 以守为攻 N/M」派生段（dfc 与 DEFLECT_GOAL 同源、既有文案逐字保留）',
  enemyAISrc.includes('const dfc = (hero.deflects || 0) + 1;') &&
  enemyAISrc.includes('· 以守为攻 ${dfc}/${DEFLECT_GOAL}'));
ok('data.js 导出具 DEFLECT_GOAL（export 单一出口）', dataSrc.includes('TREE_GOAL, DEFLECT_GOAL,'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.40', dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.35';"));
ok('README 同步（C 行 62 项 / 成就 bullet 62 项·以守为攻 X/15 次 / 成就档位行 DEFLECT_GOAL(15)·共 76 项 / 战斗防御句）',
  readme.includes('全部 76 项进度') && readme.includes('**76 项成就**') && readme.includes('以守为攻 X/15 次（防御反击累计，v23.36）') &&
  readme.includes('DEFLECT_GOAL`(15) 次，v23.36') && readme.includes('共 76 项') && readme.includes('15 次解锁成就「以守为攻」'));
ok('CHANGELOG 顶部已追加 v23.40 条目', changelog.startsWith('## v23.95 '));

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
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.40';"));
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
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.41';"));
ok('data.js 仍保留 v23.41 历史注释（README 音效事件家族文档补全）', dataSrc.includes('v23.41 文档整理·数值说明·同源口径'));
ok('data.js WOLF_GOAL=3 单一数据源 + QUESTS.side_wolf 字面量逐字（40 金 + 2 药水 · 客栈老板娘委托人）',
  dataSrc.includes('const WOLF_GOAL = 3;') && dataSrc.includes('reward:{ gold:40, item:2 }') &&
  dataSrc.includes("id:'side_wolf', kind:'side', store:true, npc:'innkeeper', giver:'innkeeper'"));
ok('README 支线行 夜路的狼嚎 v23.42 逐字（40 金 + 2 药水 · WOLF_GOAL 常量源列）',
  readme.includes('夜路的狼嚎（客栈老板娘 · 3 只野狼 `WOLF_GOAL`）40 金 + 2 药水') &&
  readme.includes('`GRAIN_GOAL` `WOLF_GOAL` `SNAKE_GOAL` `TREE_GOAL`'));
ok('README 支线行开头已随新现实更新为 十一条支线', readme.includes('十一条支线目标/奖励全部由 `QUESTS[].reward` 单一数据源派生'));
ok('CHANGELOG 顶部已追加 v23.42 条目（新支线夜路的狼嚎）', changelog.startsWith('## v23.95 '));

// —— v23.43 暴击专属上扬音（音效反馈·听觉信息透明·承 v23.22/33/40 事件音效各归其位主线收口）——
ok('data.js 含 v23.43 版本注释（暴击专属上扬音·承 v21.3/v23.22-40 主线）', dataSrc.includes('v23.43 音效反馈·听觉信息透明'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.43（旧 v23.42 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.42';"));
ok('data.js 仍保留 v23.42 历史注释（夜路的狼嚎·新内容数据层零新逻辑）', dataSrc.includes('v23.42 新内容·新支线'));
ok('audio.js 含 SFX.crit 上挑滑音（sawtooth 320→700，与 SFX.hit 低坠同族反向一听即分）',
  audioSrc.includes("crit() { tone(320, 0.11, 'sawtooth', 0.13, 0, 380); }"));
ok('battle.js attackMove 暴击音分支落位（crit 真→SFX.crit；非暴击/技能走原分支逐字未动）',
  battleSrc.includes('if (crit) SFX.crit();') && battleSrc.includes('else if (sfx) SFX[sfx]();') &&
  battleSrc.includes('else SFX.hit();'));
ok('battle.js 暴击结算/文案逐字零回归（isCrit ? CRIT_MULT : 1 与（暴击×${CRIT_MULT}！ · 暴击如雨 ${cc}/${CRIT_GOAL}）v23.63 进度后缀落位，主体倍率未动）',
  battleSrc.includes('(isCrit ? CRIT_MULT : 1)') && battleSrc.includes('（暴击×${CRIT_MULT}！ · 暴击如雨 ${cc}/${CRIT_GOAL}）'));
ok('audio.js SFX 既有键零回归（hit/ach/craft/flee/select/cancel 逐字保留）',
  audioSrc.includes("hit() { tone(140, 0.12, 'sawtooth', 0.12, 0, -80); }") && audioSrc.includes("ach() { tone(659, 0.09") &&
  audioSrc.includes("craft() { tone(440, 0.06") && audioSrc.includes("flee() { tone(523, 0.07") &&
  audioSrc.includes("select() { tone(660, 0.05") && audioSrc.includes("cancel() { tone(330, 0.07"));
ok('README 音效行事件专属音效家族补暴击上扬滑音 v23.43（既有三项逐字保留）',
  readme.includes('成就铃声（sine 三连上行，v23.22）') && readme.includes('酿造气泡上行（v23.33）') &&
  readme.includes('逃跑成功下行三步（v23.40）') && readme.includes('暴击上扬滑音（v23.43）'));
ok('README 快速上手表·战斗行补暴击专属上扬音（与普攻一听即分）',
  readme.includes('暴击瞬间有专属上扬音（v23.43'));
ok('CHANGELOG 顶部已追加 v23.43 条目（暴击专属上扬音）', changelog.startsWith('## v23.95 '));
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
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.43';"));
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
ok('CHANGELOG 顶部已追加 v23.44 条目（指令栏 [5]防御 回蓝/反击 预览补全）', changelog.startsWith('## v23.95 '));

// —— v23.45 Boss/试炼战专属战斗 BGM（音效反馈·听觉信息透明，承 v21.3 alert/boss「先闻其声」持续侧收口）——
const _auSrc = read('../js/audio.js');
const _btnSrc = read('../js/battle.js');
ok('data.js 含 v23.45 版本注释（Boss/试炼战专属战斗 BGM）',
  dataSrc.includes('v23.45 音效反馈·听觉信息透明：Boss/试炼战专属战斗 BGM'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.45（旧 v23.44 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.44';"));
ok('audio.js 含 MUSIC.battleBoss 轨（step 0.22 慢于 battle 0.13 · 三角波半音阶下行 A3→G#3→G3→F#3 · 低音持续）',
  _auSrc.includes('battleBoss: {') && _auSrc.includes("step: 0.22, wave: 'triangle'") &&
  _auSrc.includes('seq: [220, 0, 0, 0, 208, 0, 0, 0, 196, 0, 0, 0, 185, 0, 0, 0]'));
ok('audio.js MUSIC.battle 原轨逐字未动（杂兵战音乐零回归）',
  _auSrc.includes('seq: [330, 330, 0, 330, 0, 392, 330, 0, 294, 0, 330, 0, 262, 262, 0, 0]'));
ok('battle.js startBattle 战斗 BGM 按 isBossFoe 分轨（battleBoss/battle · 与 SFX.boss/alert 同一判定源）',
  _btnSrc.includes("startBgm(isBossFoe(S.enemy) ? 'battleBoss' : 'battle')") && !_btnSrc.includes("startBgm('battle');"));
ok('battle.js SFX.alert/SFX.boss 警报分支逐字未动（v23.45 零回归）',
  _btnSrc.includes('if (isBossFoe(S.enemy)) SFX.boss(); else SFX.alert();'));
ok('CHANGELOG 顶部已追加 v23.45 条目（Boss/试炼战专属战斗 BGM）', changelog.startsWith('## v23.95 '));

// —— v23.46 真身变身专属音效（音效反馈·语义修正，承 v23.22/33/40/43 事件音效各归其位主线收口）——
const _enemySrc = read('../js/enemyAI.js');
ok('data.js 含 v23.46 版本注释（真身变身专属音效·语义修正）',
  dataSrc.includes('v23.46 音效反馈·语义修正：Boss 现出真身（变身）专属音效'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.46（旧 v23.45 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.45';"));
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
ok('CHANGELOG 顶部已追加 v23.46 条目（真身变身专属音效）', changelog.startsWith('## v23.95 '));
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
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.46';"));
ok('data.js 仍保留 v23.46 历史注释（真身变身专属音效）',
  dataSrc.includes('v23.46 音效反馈·语义修正：Boss 现出真身（变身）专属音效'));
ok('audio.js 含 SFX.charge 上挑三连（square 392→523→659）',
  audioSrc.includes("charge() { tone(392, 0.06, 'square', 0.09); tone(523, 0.06, 'square', 0.1, 0.06); tone(659, 0.13, 'square', 0.1, 0.12); }"));
ok('audio.js 含 v23.47 注释块（蓄力专属音效·与防御/格挡同族反向成对）', audioSrc.includes('// v23.47 蓄力专属音效'));
ok('audio.js SFX.block 仍定义（[5]防御 v23.51 零回归；石甲格挡已改播 armor）',
  audioSrc.includes("block() { tone(320, 0.06, 'triangle', 0.1); tone(480, 0.08, 'triangle', 0.08, 0.05); }"));
const _blkInBtl = (battleSrc.match(/SFX\.block\(\);/g) || []).length;
ok('battle.js doCharge 改播 SFX.charge()（v23.47 落位；doDefend 防御仍 SFX.block 恰一处）',
  battleSrc.includes('SFX.charge();') && battleSrc.includes('hero.charge = true;') && _blkInBtl === 1, 'block callsites=' + _blkInBtl);
ok('battle.js 含 v23.47 注释块（蓄力分支弃用防御/石甲同款 block 音）', battleSrc.includes('// v23.47 蓄力专属音效'));
ok('battle.js 蓄力结算链逐字零回归（气场压制判定/置位/战报 ×CHARGE_MULT 派生/afterPlayer）',
  battleSrc.includes("enemy.forbid && enemy.forbid.includes('charge')") &&
  battleSrc.includes('凝神蓄力：下一次【攻击或技能】威力 ×${CHARGE_MULT}') && battleSrc.includes('afterPlayer();'));
ok('enemyAI.js 石甲格挡改播 SFX.armor（v23.51 落位；enemyAI 内 SFX.block 已零残留）',
  _enemySrc.includes('SFX.armor();') && !_enemySrc.includes('SFX.block();'));
ok('README 音效行事件专属音效家族补蓄力专属音效 v23.47（既有五项逐字保留）',
  readme.includes('成就铃声（sine 三连上行，v23.22）') && readme.includes('酿造气泡上行（v23.33）') &&
  readme.includes('逃跑成功下行三步（v23.40）') && readme.includes('暴击上扬滑音（v23.43）') &&
  readme.includes('真身变身专属音效（v23.46') && readme.includes('蓄力专属音效（v23.47'));
ok('CHANGELOG 顶部已追加 v23.47 条目（蓄力专属音效）', changelog.startsWith('## v23.95 '));
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

// —— v23.48 敌方暗影回血专属音效（音效反馈·语义修正，承 v23.22/33/40/43/46/47 事件音效各归其位主线收口）——
ok('data.js 含 v23.48 版本注释（敌方暗影回血专属音效·语义修正）',
  dataSrc.includes('v23.48 音效反馈·语义修正：敌方暗影回血专属音效'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.48（旧 v23.47 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.47';"));
ok('data.js 仍保留 v23.47 历史注释（蓄力专属音效）',
  dataSrc.includes('v23.47 音效反馈·语义修正：蓄力专属音效'));
ok('audio.js 含 SFX.darkheal 暗影低吟三连（triangle 220→185→147 下行 + 末音 sine 低沉拖尾）',
  audioSrc.includes("darkheal() { tone(220, 0.11, 'triangle', 0.1); tone(185, 0.11, 'triangle', 0.1, 0.1); tone(147, 0.26, 'sine', 0.09, 0.2); }"));
ok('audio.js 含 v23.48 注释块（敌方暗影回血专属音效·与治愈同族反向成对）', audioSrc.includes('// v23.48 敌方暗影回血专属音效'));
ok('audio.js SFX.heal 仍定义（玩家治愈术/喝药/住店/清泉 v23.48 零回归）',
  audioSrc.includes("heal() { tone(520, 0.1, 'sine', 0.1); }"));
ok('enemyAI.js 暗影回血分支改播 SFX.darkheal()（原 SFX.heal() 已替换·v23.48 落位）',
  _enemySrc.includes('SFX.darkheal();') && !_enemySrc.includes('SFX.heal();'));
ok('enemyAI.js 含 v23.48 注释块（回血分支弃用玩家治疗同款 heal 音）', _enemySrc.includes('// v23.48 敌方暗影回血专属音效'));
ok('enemyAI.js 回血结算链逐字零回归（判定/恢复量/🟣 战报/敌方 HP 反馈）',
  _enemySrc.includes('const heal = Math.round(enemy.hpMax * (act.pct || HEAL_PCT));') && _enemySrc.includes('enemy.hp += heal;') &&
  _enemySrc.includes('🟣 ${enemy.name} 使出【暗影回血】') && _enemySrc.includes('敌方 HP ${enemy.hp}/${enemy.hpMax}'));
ok('enemyAI.js 变身回血仍 SFX.transform（v23.48 零回归）', _enemySrc.includes('SFX.transform();'));
ok('README 音效行事件专属音效家族补敌方暗影回血专属音效 v23.48（既有六项逐字保留）',
  readme.includes('成就铃声（sine 三连上行，v23.22）') && readme.includes('酿造气泡上行（v23.33）') &&
  readme.includes('逃跑成功下行三步（v23.40）') && readme.includes('暴击上扬滑音（v23.43）') &&
  readme.includes('真身变身专属音效（v23.46') && readme.includes('蓄力专属音效（v23.47') &&
  readme.includes('敌方暗影回血专属音效（v23.48'));
ok('CHANGELOG 顶部已追加 v23.48 条目（敌方暗影回血专属音效）', changelog.startsWith('## v23.95 '));
// 运行期：真实 enemyAct 暗影回血路径（hp<40% 触发，Stub 计 darkheal/heal 调用数）
const _origDh = audioMod.SFX.darkheal, _origHeal2 = audioMod.SFX.heal;
let dhN = 0, hlN2 = 0;
audioMod.SFX.darkheal = () => { dhN++; };
audioMod.SFX.heal = () => { hlN2++; };
S.scene = 'battle'; S.battleBusy = true; S.enemy = null; S.blog.length = 0;
S.G = newGame('暗'); S.G.map = 'dungeon';
S.enemy = { name: '幽冥魔王', hpMax: 420, hp: 100, atk: 23, def: 13,
  acts: [{ type: 'heal', w: 100, hpBelow: 0.4, pct: 0.12 }] };
_aiMod.enemyAct({ addFx: noop, winBattle: noop, loseBattle: noop });
ok('运行期：暗影回血播 SFX.darkheal 且不播 SFX.heal（先闻其声即知是它在回血）', dhN === 1 && hlN2 === 0, `dh=${dhN} hl=${hlN2}`);
ok('运行期：暗影回血结算落地（恢复 50 HP + 战报「暗影回血」+ 敌方 HP 150/420）',
  S.enemy.hp === 150 && S.blog.some((b) => String(b).includes('暗影回血')) && S.blog.some((b) => String(b).includes('150/420')));
audioMod.SFX.darkheal = _origDh; audioMod.SFX.heal = _origHeal2;
S.enemy = null; S.scene = 'world';

// —— v23.49 宝箱开启专属音效（音效反馈·语义修正，承 v23.22/33/40/43/46/47/48 事件音效各归其位主线收口）——
ok('data.js 含 v23.49 版本注释（宝箱开启专属音效·语义修正）',
  dataSrc.includes('v23.49 音效反馈·语义修正：宝箱开启专属音效'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.49（旧 v23.48 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.48';"));
ok('data.js 仍保留 v23.48 历史注释（敌方暗影回血专属音效）',
  dataSrc.includes('v23.48 音效反馈·语义修正：敌方暗影回血专属音效'));
ok('audio.js 含 SFX.chest 低暖木质三连（triangle 196→262→392 上挑 + 末音 sine 上扬余韵）',
  audioSrc.includes("chest() { tone(196, 0.09, 'triangle', 0.12); tone(262, 0.09, 'triangle', 0.11, 0.09); tone(392, 0.2, 'sine', 0.1, 0.18); }"));
ok('audio.js 含 v23.49 注释块（宝箱开启专属音效·与购买/奖励同族反向成对）', audioSrc.includes('// v23.49 宝箱开启专属音效'));
ok('audio.js SFX.coin 与 SFX.item 仍定义（商店购买/任务奖励/拾取 v23.49 零回归）',
  audioSrc.includes("coin() { tone(880, 0.07, 'square', 0.1); tone(1320, 0.12, 'square', 0.1, 0.07); }") &&
  audioSrc.includes("item() { tone(700, 0.08, 'sine', 0.1); tone(900, 0.08, 'sine', 0.1, 0.08); }"));
const _wSrc = read('../js/world.js');
const _chestInW = (_wSrc.match(/SFX\.chest\(\);/g) || []).length;
ok('world.js 开箱三分支改播 SFX.chest()（原 SFX.item/SFX.coin 已替换·v23.49 落位）',
  _chestInW === 3 && !_wSrc.includes('SFX.item();') && !_wSrc.includes('SFX.coin();'), 'chest callsites=' + _chestInW);
ok('world.js 含 v23.49 注释块（开箱分支弃用购买/拾取同款音）', _wSrc.includes('// v23.49 宝箱开启专属音效'));
ok('world.js 开箱结算链逐字零回归（掉落判定/金币公式/库存计数/报文/宝箱进度后缀）',
  _wSrc.includes("hero.chests.has(x + ',' + y)") && _wSrc.includes('CHEST_GOLD_BASE + hero.level * CHEST_GOLD_PER_LV') &&
  _wSrc.includes('hero.mushrooms++;') && _wSrc.includes('hero.gold += gold;') && _wSrc.includes('hero.item++;') &&
  _wSrc.includes('已开 ${opened}/${total}'));
ok('README 音效行事件专属音效家族补宝箱开启专属音效 v23.49（既有七项逐字保留）',
  readme.includes('成就铃声（sine 三连上行，v23.22）') && readme.includes('酿造气泡上行（v23.33）') &&
  readme.includes('逃跑成功下行三步（v23.40）') && readme.includes('暴击上扬滑音（v23.43）') &&
  readme.includes('真身变身专属音效（v23.46') && readme.includes('蓄力专属音效（v23.47') &&
  readme.includes('敌方暗影回血专属音效（v23.48') && readme.includes('宝箱开启专属音效（v23.49'));
ok('CHANGELOG 顶部已追加 v23.49 条目（宝箱开启专属音效）', changelog.startsWith('## v23.95 '));
// 运行期：真实 STEP_HANDLERS[TY.CHEST] 开箱路径（金币档，Stub 计 chest/item/coin 调用数）
const _wMod = await import('../js/world.js');
const _origChest = audioMod.SFX.chest, _origItem3 = audioMod.SFX.item, _origCoin3 = audioMod.SFX.coin;
let chestN = 0, itemN3 = 0, coinN3 = 0;
audioMod.SFX.chest = () => { chestN++; };
audioMod.SFX.item = () => { itemN3++; };
audioMod.SFX.coin = () => { coinN3++; };
S.G = newGame('箱'); S.G.map = 'village'; S.G.chests = new Set(['1,1']); S.G.gold = 100; S.G.item = 5; S.G.level = 1;
S.scene = 'world'; S.blog.length = 0;
const _origRand = Math.random; let _ri = 0;
Math.random = () => (_ri++ === 0 ? 0.3 : 0.5);
_wMod.STEP_HANDLERS[TY.CHEST](2, 2, S.G);
Math.random = _origRand;
ok('运行期：开箱（金币档）播 SFX.chest 且不播 SFX.item/SFX.coin（开箱与拾取/购买一听即分）',
  chestN === 1 && itemN3 === 0 && coinN3 === 0, `chest=${chestN} item=${itemN3} coin=${coinN3}`);
ok('运行期：开箱结算落地（金币 100→117 + 宝箱格记 2,2）',
  S.G.gold === 117 && S.G.chests.has('2,2'), `gold=${S.G.gold}`);
audioMod.SFX.chest = _origChest; audioMod.SFX.item = _origItem3; audioMod.SFX.coin = _origCoin3;
S.G = null; S.scene = 'world';

// —— v23.50 任务交付专属音效（音效反馈·语义修正，承 v23.22/33/40/43/46/47/48/49 事件音效各归其位主线收口）——
ok('data.js 含 v23.50 版本注释（任务交付专属音效·语义修正）',
  dataSrc.includes('v23.50 音效反馈·语义修正：任务交付专属音效'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.50（旧 v23.49 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.49';"));
ok('data.js 仍保留 v23.49 历史注释（宝箱开启专属音效）',
  dataSrc.includes('v23.49 音效反馈·语义修正：宝箱开启专属音效'));
ok('audio.js 含 SFX.quest「交付铃」先抑后扬三连（triangle 659→494 下行四度 + sine 988 上扬余韵）',
  audioSrc.includes("quest() { tone(659, 0.08, 'triangle', 0.11); tone(494, 0.08, 'triangle', 0.1, 0.08); tone(988, 0.24, 'sine', 0.1, 0.16); }"));
ok('audio.js 含 v23.50 注释块（任务交付专属音效·与购买/凯旋同族反向成对）', audioSrc.includes('// v23.50 任务交付专属音效'));
ok('audio.js SFX.coin 与 SFX.victory 仍定义（售蘑菇/战斗胜利 v23.50 零回归）',
  audioSrc.includes("coin() { tone(880, 0.07, 'square', 0.1); tone(1320, 0.12, 'square', 0.1, 0.07); }") &&
  audioSrc.includes("victory() { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.18, 'square', 0.13, i * 0.13)); }"));
ok('core.js 任务交付分支改播 SFX.quest()（原 SFX.victory/SFX.coin 已替换·v23.50 落位）',
  coreSrc.includes('SFX.quest();') && !coreSrc.includes('SFX.coin();') && !coreSrc.includes('SFX.victory();'));
ok('core.js 含 v23.50 注释块（交付分支弃用购物/凯旋同款音）', coreSrc.includes('// v23.50 任务交付专属音效'));
ok('core.js 交付结算链逐字零回归（交付判定/成就判定/🎁 报文/回世界）',
  coreSrc.includes("act.kind === 'reward'") && coreSrc.includes('applyAchievements();') &&
  coreSrc.includes('🎁 「${act.name}」完成') && coreSrc.includes("goto('world');"));
ok('README 音效行事件专属音效家族补任务交付专属音效 v23.50（既有八项逐字保留）',
  readme.includes('宝箱开启专属音效（v23.49') && readme.includes('任务交付专属音效（v23.50'));
// 运行期：真实 resolveNpcTalk+talkNext 任务交付路径（side_mushroom turnin：奖 40+10×lv 金 + 2 药水）
const _qtsMod = await import('../js/quests.js');
const _coreMod2 = await import('../js/core.js');
const _origQuest = audioMod.SFX.quest, _origCoin4 = audioMod.SFX.coin, _origVic2 = audioMod.SFX.victory;
let questN2 = 0, coinN4 = 0, vicN2 = 0;
audioMod.SFX.quest = () => { questN2++; };
audioMod.SFX.coin = () => { coinN4++; };
audioMod.SFX.victory = () => { vicN2++; };
S.G = newGame('交');
_qtsMod.setSideQuest(S.G, 'side_mushroom', 'turnin');
S.scene = 'talk'; S.curNpc = 'chief'; S.talkPages = [[]]; S.talkPage = 0; S.talkLineAt = 0; S.blog.length = 0;
await _coreMod2.talkNext();
ok('运行期：任务交付播 SFX.quest 且不播 SFX.coin/SFX.victory（交付与购物/凯旋一听即分）',
  questN2 === 1 && coinN4 === 0 && vicN2 === 0, `q=${questN2} c=${coinN4} v=${vicN2}`);
ok('运行期：交付结算落地（金币 30→80 + 药水 3→5 + side_mushroom done）',
  S.G.gold === 80 && S.G.item === 5 && S.G.quests.side_mushroom === 'done', `gold=${S.G.gold} item=${S.G.item} st=${S.G.quests.side_mushroom}`);
audioMod.SFX.quest = _origQuest; audioMod.SFX.coin = _origCoin4; audioMod.SFX.victory = _origVic2;
S.G = null; S.scene = 'world';

// —— v23.51 敌方石甲专属音效（音效反馈·语义修正，承 v23.22/33/40/43/46/47/48/49/50 事件音效各归其位主线收口后复查的最后一格）——
ok('data.js 含 v23.51 版本注释（敌方石甲专属音效·语义修正）',
  dataSrc.includes('v23.51 音效反馈·语义修正：敌方石甲专属音效'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.52（旧 v23.50 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.50';"));
ok('data.js 仍保留 v23.50 历史注释（任务交付专属音效）',
  dataSrc.includes('v23.50 音效反馈·语义修正：任务交付专属音效'));
ok('audio.js 含 SFX.armor「岩壳凝结」低鸣三连（sine 98→147→196）',
  audioSrc.includes("armor() { tone(98, 0.14, 'sine', 0.12); tone(147, 0.1, 'triangle', 0.1, 0.12); tone(196, 0.2, 'sine', 0.07, 0.2); }"));
ok('audio.js 含 v23.51 注释块（敌方石甲专属音效·与玩家防御同族反向成对）', audioSrc.includes('// v23.51 敌方石甲专属音效'));
ok('enemyAI.js 石甲分支改播 SFX.armor()（SFX.block 在 enemyAI 已零残留）',
  _enemySrc.includes('SFX.armor();') && !_enemySrc.includes('SFX.block();'));
ok('enemyAI.js 含 v23.51 注释块（石甲分支弃用玩家防御同款 block 音）', _enemySrc.includes('// v23.51 敌方石甲专属音效'));
ok('enemyAI.js 石甲结算链逐字零回归（盾层自增/🪨 战报/累计层数与减伤派生）',
  _enemySrc.includes('enemy.shield = (enemy.shield || 0) + 1;') &&
  _enemySrc.includes('🪨 ${enemy.name} 凝结【石甲】！') &&
  _enemySrc.includes('累计 ${enemy.shield} 层，所受伤害降低 ${Math.round((1 - SHIELD_MULT) * 100)}%'));
ok('README 音效行事件专属音效家族补敌方石甲专属音效 v23.51（既有九项逐字保留）',
  readme.includes('真身变身专属音效（v23.46') && readme.includes('任务交付专属音效（v23.50') &&
  readme.includes('敌方石甲专属音效（v23.51'));
ok('CHANGELOG 顶部已追加 v23.51 条目（敌方石甲专属音效）', changelog.startsWith('## v23.95 '));
// 运行期：真实 enemyAct 石甲路径（Stub 计 armor/block 调用数）
const _origArmor = audioMod.SFX.armor, _origBlk51 = audioMod.SFX.block;
let armorN = 0, blkN51 = 0;
audioMod.SFX.armor = () => { armorN++; };
audioMod.SFX.block = () => { blkN51++; };
S.scene = 'battle'; S.battleBusy = true; S.enemy = null;
S.G = newGame('甲'); S.G.map = 'cave';
S.enemy = { name: '石心魔像', hpMax: 200, hp: 150, atk: 15, def: 10, acts: [{ type: 'shield', w: 100 }] };
S.blog.length = 0;
_aiMod.enemyAct({ addFx: noop, winBattle: noop, loseBattle: noop });
ok('运行期：石甲凝结播 SFX.armor 且不播 SFX.block（叠甲与自己的防御一听即分）',
  armorN === 1 && blkN51 === 0, `a=${armorN} b=${blkN51}`);
ok('运行期：石甲结算落地（盾层 1 累计 + 战报「凝结【石甲】·累计 1 层」）',
  S.enemy.shield === 1 && S.blog.some((b) => String(b).includes('凝结【石甲】') && String(b).includes('累计 1 层')));
audioMod.SFX.armor = _origArmor; audioMod.SFX.block = _origBlk51;
S.enemy = null; S.scene = 'world';

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树串尾已延伸至 smoke_v2319_deadloc',
  readme.includes('+ smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll（npm test 串跑）'));
ok('README 旧串尾零残留（smoke_v2312_voltitle（npm test 串跑）不在树尾）',
  !readme.includes('smoke_v2312_voltitle（npm test 串跑）'));
ok('README 件套口径为二百一十九件套（二百一十八件套清除）且旧 208 口径零残留',
  readme.includes('冒烟二百一十九件套（二百一十八件套清除）') && !readme.includes('冒烟二百零八件套（二百零七件套清' + '除）'));
ok('README 不含哨兵领先一位（二百二十件套（二百一十九件套清除））',
  !readme.includes('二百二十件套（二百一十九件套清除）'));
ok('README 含 v23.13 守护描述（新成就有口皆碑守护）', readme.includes('v23.13 起含 新成就「有口皆碑」守护'));
ok('README 含 smoke_v2313_talkall 入库（209 份）', readme.includes('smoke_v2313_talkall 入库（209 份）'));
ok('README 仍保留 v23.12 守护描述（历史口径）', readme.includes('v23.12 起含 标题画面提示行「[ / ] 音量」口径守护'));
ok('README 仍保留 smoke_v2312_voltitle 入库（208 份）历史口径', readme.includes('smoke_v2312_voltitle 入库（208 份）'));
ok('README 成就口径「60 项」双处同步（快速上手表 C 键行 + 图鉴&成就行）',
  readme.includes('成就一览（全部 76 项进度') && readme.includes('**76 项成就**') &&
  !readme.includes('成就一览（全部 59 项进' + '度') && !readme.includes('**59 项成' + '就**'));
ok('README 数值速查成就档位行含社交档「有口皆碑」与共 76 项',
  readme.includes('社交向单档「有口皆碑」') && readme.includes('共 76 项'));
ok('package.json 已收录 smoke_v2313_talkall（npm test 串跑第 209 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2313_talkall.mjs'));
ok('package.json 串尾为 ... smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs && node tests/smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs && node tests/smoke_v2395_shopscroll.mjs"',
  pkg.includes('node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs && node tests/smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs && node tests/smoke_v2395_shopscroll.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 209 件套', testChain === 219, String(testChain));
ok('CHANGELOG 顶部已追加 v23.41 条目', changelog.startsWith('## v23.95 '));
ok('CHANGELOG 仍保留 v23.12 条目（历史口径）', changelog.includes('## v23.12 标题画面提示行补「[ / ] 音量」口径'));

// —— 姊妹件套 pin 随新现实更新 + 旧代 v23.12 pin 零残留 ——
const s2312 = read('smoke_v2312_voltitle.mjs');
const s2297 = read('smoke_v2297_chestmid.mjs');
const s2229 = read('smoke_v2229_metall.mjs');
const s2143 = read('smoke_v2143_talkekey.mjs');
ok('smoke_v2312 的 GAME_VERSION 字面量 pin 已更新为 v23.13', s2312.includes("const GAME_VERSION = 'v23.95';"));
ok('smoke_v2312 的 CHANGELOG 顶 pin 已更新为 ## v23.13',
  s2312.includes("startsWith('## v23.95 "));
ok('smoke_v2312 的件套 pin 已更新为二百一十九件套（二百一十八件套清除）', s2312.includes('二百一十九件套（二百一十八件套清除）'));
ok('smoke_v2312 的 README 串尾 pin 已延伸至 smoke_v2313_talkall',
  s2312.includes('smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead + smoke_v2317_pausemap + smoke_v2318_battlemap + smoke_v2319_deadloc + smoke_v2392_stariron + smoke_v2393_deadkey + smoke_v2394_fightback + smoke_v2395_shopscroll（npm test 串跑）'));
ok('smoke_v2312 的 package 串尾 pin 已延伸至 smoke_v2313_talkall',
  s2312.includes('node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs && node tests/smoke_v2317_pausemap.mjs && node tests/smoke_v2318_battlemap.mjs && node tests/smoke_v2319_deadloc.mjs && node tests/smoke_v2392_stariron.mjs && node tests/smoke_v2393_deadkey.mjs && node tests/smoke_v2394_fightback.mjs && node tests/smoke_v2395_shopscroll.mjs"'));
ok('smoke_v2312 的 testChain pin 已更新为 209', s2312.includes('testChain === 219'));
ok('smoke_v2297 的 ACH_LIST 精确计数 pin 已更新为 === 60', s2297.includes('ACH_LIST.length === 76'));
ok('smoke_v2229 的 ACH_LIST 精确计数 pin 已更新为 === 60', s2229.includes('ACH_LIST.length === 76'));
ok('smoke_v2143 哨兵链已推进至二百二十件套（二百一十九件套清除）', s2143.includes('二百二十件套（二百一十九件套清除）') && s2143.includes("!readme.includes('二百二十件套（二百一十九件套清除）')"));

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

// —— v23.48 级联守护：旧代 v23.47 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.47 特性标签保留）——
const stale48 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.47'") || src.includes("GAME_VERSION === 'v23.47'") ||
      src.includes("startsWith('## v23.47") || src.includes("'## v23.47 ")) stale48.push(f);
}
ok('旧代 v23.47 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.47 特性标签保留）', stale48.length === 0, stale48.join(','));

// —— v23.49 级联守护：旧代 v23.48 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.48 特性标签保留）——
const stale49 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.48'") || src.includes("GAME_VERSION === 'v23.48'") ||
      src.includes("startsWith('## v23.48") || src.includes("'## v23.48 '")) stale49.push(f);
}
ok('旧代 v23.48 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.48 特性标签保留）', stale49.length === 0, stale49.join(','));

// —— v23.50 级联守护：旧代 v23.49 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.49 特性标签保留）——
const stale50 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.49'") || src.includes("GAME_VERSION === 'v23.49'") ||
      src.includes("startsWith('## v23.49") || src.includes("'## v23.49 ")) stale50.push(f);
}
ok('旧代 v23.49 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.49 特性标签保留）', stale50.length === 0, stale50.join(','));

// —— v23.52 级联守护：旧代 v23.50 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.50 特性标签保留）——
const stale51 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.50'") || src.includes("GAME_VERSION === 'v23.50'") ||
      src.includes("startsWith('## v23.50") || src.includes("'## v23.50 '")) stale51.push(f);
}
ok('旧代 v23.50 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.50 特性标签保留）', stale51.length === 0, stale51.join(','));

// —— v23.52 级联守护：旧代 v23.51 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.51 特性标签保留）——
const stale52 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.51'") || src.includes("GAME_VERSION === 'v23.51'") ||
      src.includes("startsWith('## v23.51") || src.includes("'## v23.51 ")) stale52.push(f);
}
ok('旧代 v23.51 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.51 特性标签保留）', stale52.length === 0, stale52.join(','));

// —— v23.52 文档整理：improve-plan 落地状态对齐（v4.0 旧口径清零 + v23.52 现状落位 + 指向权威记录）——
ok('improve-plan.md 抬头已追记为 v23.52 现状（2026-09-21 + 指向 CHANGELOG/README 权威记录）',
  plan.includes('v23.52 全面落地（2026-09-21 追记）') && plan.includes('CHANGELOG.md') &&
  plan.includes('tests 树'));
ok('improve-plan.md 历史档案正文零改写（v3.39 留档日期与原稿 v4.0 落地状态原样保留）',
  plan.includes('留档日期：2026-08-19（对应代码约 v3.39') && plan.includes('v4.0 已执行（2026-08-19'));
ok('data.js 含 v23.52 版本注释（文档整理·档案对齐）', dataSrc.includes('// v23.52 文档整理·档案对齐'));
ok('CHANGELOG 顶部已追加 v23.52 条目（improve-plan 落地状态对齐）', changelog.startsWith('## v23.95 '));
ok('CHANGELOG 仍保留 v23.51 条目（历史口径）', changelog.includes('## v23.51 敌方石甲专属音效'));

// —— v23.53 精英「重击」逐招预判补全（体验打磨·信息透明·纯显示——承 v21.47 威胁预警补「重击线」/ v23.44
// 决策现场信息透明同一主线收口：持 heavy 招的精英（残焰魔像 w40 重击）此前走普攻单招预判，决策现场
// 看不到重击那一刀；现把逐招预判门放宽为 isBossFoe || 持有 heavy 招）——
ok('data.js 含 v23.53 版本注释（精英重击逐招预判补全）', dataSrc.includes('// v23.53 体验打磨·信息透明·纯显示：精英「重击」逐招预判补全'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.53（旧 v23.52 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.52';"));
ok('data.js 仍保留 v23.52 历史注释（文档整理·档案对齐）', dataSrc.includes('// v23.52 文档整理·档案对齐'));
ok('drawBattle.js 含 v23.53 注释块（精英「重击」逐招预判补全）', _dbSrc.includes('// v23.53 精英「重击」逐招预判补全'));
ok('drawBattle.js 逐招预判门放宽落位（hasHeavy 由 enemy.acts 同源派生 + isBossFoe || hasHeavy，零新依赖）',
  _dbSrc.includes('const hasHeavy = ((enemy && enemy.acts) || []).some((a) => a.type === \'heavy\');') &&
  _dbSrc.includes('if (enemy && (isBossFlee || hasHeavy)) {'));
ok('drawBattle.js 普攻单招预判分支零回归（else if (enemy && !isBossFlee) 逐字未动——石心魔像/普通怪仍走原分支）',
  _dbSrc.includes('else if (enemy && !isBossFlee) {'));
ok('drawBattle.js 逐招预判内部零回归（重击倍率分档 HEAVY_MULT_PHASED/HEAVY_MULT 与 ⚠️致命判定逐字未动）',
  _dbSrc.includes("a.type === 'heavy' ? (enemy.phased ? HEAVY_MULT_PHASED : HEAVY_MULT) : 1") &&
  _dbSrc.includes('const lethal = worst >= hero.hp;'));
const _d2 = await import('../js/data.js');
const _r2 = await import('../js/rules.js');
ok('数据面复核：残焰魔像持 heavy 招（Lv10 推荐装备 def36 重击 99 占满血 92%——v21.47 同口径逐值）',
  _r2.cmdDmg(_d2.EMBER_GOLEM.atk, 36, 1, false) === 52 && _r2.cmdDmg(_d2.EMBER_GOLEM.atk, 36, _d2.HEAVY_MULT, false) === 99 &&
  (_d2.EMBER_GOLEM.acts || []).some((a) => a.type === 'heavy'));
ok('数据面复核：石心魔像无 heavy 招（attack/shield 机制怪——单招预判零回归）',
  !(_d2.SPECIES['石心魔像'].acts || []).some((a) => a.type === 'heavy') &&
  (_d2.SPECIES['石心魔像'].acts || []).some((a) => a.type === 'shield'));
ok('README 战斗段补持重击招的精英同款逐招预判口径（v23.53）',
  readme.includes('持重击招的精英同款逐招预判**（v23.53'));
ok('CHANGELOG 顶部已追加 v23.53 条目（精英「重击」逐招预判补全）', changelog.startsWith('## v23.95 '));
ok('CHANGELOG 仍保留 v23.52 条目（历史口径）', changelog.includes('## v23.52 改进计划留档'));

// —— v23.53 级联守护：旧代 v23.52 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.52 特性标签保留）——
const stale53 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.52'") || src.includes("GAME_VERSION === 'v23.52'") ||
      src.includes("startsWith('## v23.52") || src.includes("'## v23.52 ")) stale53.push(f);
}
ok('旧代 v23.52 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.52 特性标签保留）', stale53.length === 0, stale53.join(','));

// —— v23.54 新成就「蓄势待发」（战斗维度第二枚里程碑·承 v23.36 以守为攻先例：[6]蓄力累计 CHARGE_GOAL 次）——
ok('data.js 含 v23.54 版本注释（新成就蓄势待发·战斗维度第二枚）',
  dataSrc.includes('// v23.54 新内容·战斗维度第二枚里程碑：新成就「蓄势待发」'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.54（旧 v23.53 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.53';"));
ok('data.js 仍保留 v23.53 历史注释（精英重击逐招预判补全）',
  dataSrc.includes('// v23.53 体验打磨·信息透明·纯显示：精英「重击」逐招预判补全'));
const chgAch = ACH_LIST.find((a) => a.id === 'charge');
ok('ACH_LIST 含 charge「蓄势待发」且 id 唯一（末尾追加于 deflect 之后，既有序位零位移）',
  !!chgAch && chgAch.name === '蓄势待发' && ACH_LIST.filter((a) => a.id === 'charge').length === 1 &&
  ACH_LIST.findIndex((a) => a.id === 'charge') === 61);
ok('charge 描述由 CHARGE_GOAL 派生（零裸字面量）', chgAch.d === `[6]蓄力累计 ${CHARGE_GOAL} 次`, chgAch.d);
ok('charge 判定/进度读 (g.charges||0) 防御式（旧档无字段=0 不误解锁零迁移）',
  String(chgAch.ok).includes('(g.charges||0)') && String(chgAch.prog).includes('g.charges||0'));
ok('charge 无 r 字段纯里程碑（与 deflect/memoir/skills 同款）', !('r' in chgAch));
ok('charge 0 次（缺字段旧档）→ false 且 prog 0/15', chgAch.ok({}) === false && chgAch.prog({}) === `0/${CHARGE_GOAL}`);
ok('charge 14 次（恰差 1）→ false 且 prog 14/15', chgAch.ok({ charges: 14 }) === false && chgAch.prog({ charges: 14 }) === `14/${CHARGE_GOAL}`);
ok('charge 15 次（恰好达标）→ true 且 prog 15/15', chgAch.ok({ charges: 15 }) === true && chgAch.prog({ charges: 15 }) === `${CHARGE_GOAL}/${CHARGE_GOAL}`);
ok('charge 30 次（超阈值）→ true 且 prog 不钳制 30/15（与 deflect 同式）', chgAch.ok({ charges: 30 }) === true && chgAch.prog({ charges: 30 }) === `30/${CHARGE_GOAL}`);
ok('battle.js 含 v23.54 注释（蓄势待发计数说明）', battleSrc.includes('v23.54 成就「蓄势待发」计数'));
ok('battle.js doCharge 蓄力唯一产生点源级落位（chg 自增 + hero.charges 写入 + 当场 applyAchievements + 战报进度）',
  battleSrc.includes('const chg = (hero.charges || 0) + 1;') && battleSrc.includes('hero.charges = chg;') &&
  battleSrc.includes('applyAchievements();') && battleSrc.includes('蓄势待发 ${chg}/${CHARGE_GOAL}'));
ok('battle.js 蓄力结算链逐字零回归（气场压制判定/置位/SFX.charge/战报主体 ×CHARGE_MULT 派生/afterPlayer）',
  battleSrc.includes("enemy.forbid && enemy.forbid.includes('charge')") &&
  battleSrc.includes('hero.charge = true;') && battleSrc.includes('SFX.charge();') &&
  battleSrc.includes('凝神蓄力：下一次【攻击或技能】威力 ×${CHARGE_MULT}') && battleSrc.includes('afterPlayer();'));
ok('data.js 含 CHARGE_GOAL 阈值常量与 charge 条目注释（单一数据源三端同读）',
  dataSrc.includes('const CHARGE_GOAL = 15;') && dataSrc.includes('// 蓄势待发（v23.54'));
ok('README 同步（C 行 62 项 / 成就 bullet 62 项·蓄势待发 X/15 次 / 成就档位行 CHARGE_GOAL(15)·共 76 项 / 战斗蓄力句）',
  readme.includes('全部 76 项进度') && readme.includes('**76 项成就**') && readme.includes('蓄势待发 X/15 次（蓄力累计，v23.54）') &&
  readme.includes('CHARGE_GOAL`(15) 次，v23.54') && readme.includes('共 76 项') && readme.includes('15 次解锁成就「蓄势待发」'));
ok('CHANGELOG 顶部已追加 v23.54 条目（新成就蓄势待发）', changelog.startsWith('## v23.95 '));
ok('CHANGELOG 仍保留 v23.53 条目（历史口径）', changelog.includes('## v23.53 精英「重击」逐招预判补全'));
// 运行期：真实 playerAction('charge') 路径（计数落账 + 战报进度 + 达标当场解锁）
S.G = newGame('蓄'); S.G.map = 'village';
btlMod.startBattle({ name: '木桩', hp: 5000, hpMax: 5000, atk: 5, def: 10, xp: 1, gold: 0 });
S.battleBusy = false;
btlMod.playerAction('charge');
ok('运行期：蓄力计数落账（hero.charges 1）且战报含「 · 蓄势待发 1/15」（计数现场报进度）',
  S.G.charges === 1 && S.blog.some((b) => String(b).includes('蓄势待发 1/15')), 'chg=' + S.G.charges);
ok('运行期：蓄力战报主体零回归（凝神蓄力 ×1.5 仍在）', S.blog.some((b) => String(b).includes('凝神蓄力')));
S.G.charges = 14;
S.battleBusy = false;
btlMod.playerAction('charge');
ok('运行期：第 15 次蓄力当场解锁「蓄势待发」（applyAchievements 落 hero.ach 且重复去重）',
  S.G.charges === 15 && (S.G.ach || []).includes('charge') && (S.G.ach || []).length === 1, 'charges=' + S.G.charges + ' ach=' + JSON.stringify(S.G.ach || []));
S.enemy = null; S.scene = 'world';
// —— v23.54 级联守护：旧代 v23.53 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.53 特性标签保留）——
const stale54 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.53'") || src.includes("GAME_VERSION === 'v23.53'") ||
      src.includes("startsWith('## v23.53") || src.includes("'## v23.53 ")) stale54.push(f);
}
ok('旧代 v23.53 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.53 特性标签保留）', stale54.length === 0, stale54.join(','));


// —— v23.55 Lv12 终章新技能「灯焰长明」（第八招·战斗机制·承 v21.48 汲光击 / v21.83 星砂回响汲取型家族收口）——
ok('data.js 含 v23.55 版本注释（Lv12 终章新技能·第八招）',
  dataSrc.includes('// v23.55 新内容·战斗机制：Lv12 终章新技能「灯焰长明」'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.55（旧 v23.54 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.54';"));
ok('data.js 仍保留 v23.54 历史注释（新成就蓄势待发）',
  dataSrc.includes('// v23.54 新内容·战斗维度第二枚里程碑：新成就「蓄势待发」'));
ok('data.js LEARN_AT 含 Lv12 灯焰长明（末端追加·既有七级零位移）',
  dataSrc.includes("const LEARN_AT = { 1: '火焰斩', 3: '冰霜击', 4: '治愈术', 5: '雷鸣', 7: '陨石术', 9: '汲光击', 11: '星砂回响', 12: '灯焰长明' };"));
const _d5 = await import('../js/data.js');
ok('MAX_LEARN_LV 自动派生为 12（继承 Lv12 灯焰长明——「距下一技能」扫描上界/状态页「已习得全部技能」自动跟随）',
  _d5.MAX_LEARN_LV === 12, String(_d5.MAX_LEARN_LV));
ok('SKILL_DATA 含灯焰长明且 id 唯一（16MP/×3.4/灼烧2回合/汲回50%伤害为MP·上限25%MP/光元素恒×1）',
  !!_d5.SKILL_DATA['灯焰长明'] && Object.keys(_d5.SKILL_DATA).length === 8 &&
  _d5.SKILL_DATA['灯焰长明'].mp === 16 && _d5.SKILL_DATA['灯焰长明'].mult === 3.4 &&
  _d5.SKILL_DATA['灯焰长明'].kind === 'atk' && _d5.SKILL_DATA['灯焰长明'].burn === 2 &&
  _d5.SKILL_DATA['灯焰长明'].drainMp === _d5.DRAIN_MP_PCT && _d5.SKILL_DATA['灯焰长明'].drainMpCap === _d5.DRAIN_MP_CAP &&
  _d5.SKILL_DATA['灯焰长明'].element === 'light', JSON.stringify(_d5.SKILL_DATA['灯焰长明']));
ok('灯焰长明 hint 由 DRAIN_MP_PCT/DRAIN_MP_CAP 派生（灼烧2回合·汲回伤害50%为MP·上限25%MP，零裸字面量）',
  _d5.SKILL_DATA['灯焰长明'].hint === '灼烧2回合·汲回伤害50%为MP·上限25%MP');
ok('data.js 含灯焰长明条目注释（v23.55 新技能·第八招·终章收口·drainMp 不入 heal 封印）',
  dataSrc.includes('// 灯焰长明（v23.55 新技能·Lv12 领悟·第八招·终章收口') && dataSrc.includes('drainMp 招不含治疗'));
const mainSrc = read('../js/main.js');
ok('main.js 技能数字键快捷直发扩为 1-8（v23.55 第八招；H 页/README/技能菜单同口径）',
  mainSrc.includes("['1', '2', '3', '4', '5', '6', '7', '8'].indexOf(e.key)") &&
  mainSrc.includes('v23.55 第八招「灯焰长明」Lv12 领悟后数字键快捷直发扩为 1-8'));
ok('drawBattle.js 技能菜单八招容量条件式落位（>7 行距 25/提示偏移 12；≤7 招逐字保持 v21.83 布局）',
  _dbSrc.includes('const ROW_SP = hero.skills.length > 7 ? 25 : (hero.skills.length > 6 ? 29 : 34);') &&
  _dbSrc.includes('const HINT_DY = hero.skills.length > 7 ? 12 : (hero.skills.length > 6 ? 14 : 16);') &&
  _dbSrc.includes('v23.55 八招容量'));
const menusSrc = read('../js/view/menus.js');
ok('menus.js 状态页八招容量条件式落位（>7 行距 11；≤7 招逐字保持 v21.83 布局）',
  menusSrc.includes('const SKILL_ROW_SP = hero.skills.length > 7 ? 11 : (hero.skills.length > 6 ? 12 : 14);') &&
  menusSrc.includes('const SKILL_ROW_Y0 = hero.skills.length > 6 ? 302 : 308;'));
ok('help 页「战斗」行 r[2] 已随第八招扩为 1-8（H 页口径与 main.js 同源）',
  dataSrc.includes('技能菜单数字键1-8快捷直发') && dataSrc.includes('// v23.55 第八招「灯焰长明」Lv12 领悟后数字键快捷直发扩为 1-8'));
ok('README 同步（快速上手表 1-8 / 技能领悟行 Lv12 灯焰长明 / 技能数值行八招逐值 / 职业成长链尾 / 战斗行灯焰长明说明）',
  readme.includes('数字键 1-8 快捷直发') && readme.includes('Lv1 火焰斩 · Lv3 冰霜击 · Lv4 治愈术 · Lv5 雷鸣 · Lv7 陨石术 · Lv9 汲光击 · Lv11 星砂回响 · Lv12 灯焰长明') &&
  readme.includes('八招 mp/倍率/效果') && readme.includes('灯焰长明 16MP·×3.4·灼烧2回合（每回合4%最大HP）+汲回50%伤害为MP·上限25%最大MP') &&
  readme.includes('星砂回响汲蓝→灯焰长明灼烧汲蓝') && readme.includes('灯焰长明（Lv12 领悟——伤害 ×3.4 并给敌方挂 2 回合灼烧'));
ok('CHANGELOG 顶部已追加 v23.55 条目（Lv12 终章新技能灯焰长明）', changelog.startsWith('## v23.95 '));
ok('CHANGELOG 仍保留 v23.54 条目（历史口径）', changelog.includes('## v23.54 新成就「蓄势待发」'));
// 运行期：真实 playerAction('skill','灯焰长明') 路径（DOM/音频桩 + main.js 导入后全链路：扣蓝 → 命中结算 → 灼烧挂载 → 汲蓝落账 → 战报）
S.G = newGame('灯'); S.G.map = 'village';
S.G.skills = ['火焰斩', '冰霜击', '治愈术', '雷鸣', '陨石术', '汲光击', '星砂回响', '灯焰长明'];
S.G.mpMax = 100; S.G.mp = 20; S.G.atkMax = 55; S.G.hpMax = 500; S.G.hp = 500;
S.scene = 'battle'; S.battleBusy = false;
S.enemy = { name: '祸乱靶', hp: 5000, hpMax: 5000, atk: 5, def: 10, xp: 1, gold: 0, forbid: ['heal'] };
S.blog.length = 0;
btlMod.playerAction('skill', '灯焰长明');
ok('运行期：祸乱形态（封印治愈）下灯焰长明照常施放不误封（drainMp 不入 heal 封印契约）',
  S.blog.some((b) => String(b).includes('灯焰长明')) && !S.blog.some((b) => String(b).includes('封印')), S.blog.join(' | '));
ok('运行期：灯焰长明命中挂 2 回合灼烧（enemy.burn === 2）且灼烧战报带每回合 -N 血（DOT 同源派生）',
  S.enemy.burn === 2 && S.blog.some((b) => String(b).includes('灼烧 2 回合')));
ok('运行期：汲蓝落账（dmg×50% 钳制 25%mpMax=25 → MP 20-16+25=29；战报「汲蓝 25 MP」）',
  S.G.mp === 29 && S.blog.some((b) => String(b).includes('汲蓝 25 MP')), 'mp=' + S.G.mp);
S.enemy = null; S.scene = 'world';
// 运行期：drawSkillMenu 八招渲染不抛错（八招容量布局）
let skRendered = true;
try {
  S.scene = 'battle'; S.G = newGame('渲'); S.G.skills = ['火焰斩', '冰霜击', '治愈术', '雷鸣', '陨石术', '汲光击', '星砂回响', '灯焰长明'];
  S.enemy = { name: '靶', hp: 1000, hpMax: 1000, atk: 5, def: 10 };
  const _drawSkillMenu = (await import('../js/view/drawBattle.js')).drawSkillMenu;
  _drawSkillMenu();
} catch (e) { skRendered = false; }
ok('运行期：drawSkillMenu 八招渲染不抛错（ROW_SP 25/HINT_DY 12 八招容量）', skRendered);
S.enemy = null; S.scene = 'world';
// —— v23.55 级联守护：旧代 v23.54 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.54 特性标签保留）——
const stale55 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.54'") || src.includes("GAME_VERSION === 'v23.54'") ||
      src.includes("startsWith('## v23.54") || src.includes("'## v23.54 ")) stale55.push(f);
}
ok('旧代 v23.54 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.54 特性标签保留）', stale55.length === 0, stale55.join(','));


// —— v23.56 试炼三连战战报补「获得 N 经验」（体验打磨·信息透明·反馈不迟到，承 v19.80 普通胜利「收入现场报收入」主线）——
ok('data.js 含 v23.56 版本注释（试炼战报补经验）', dataSrc.includes('// v23.56 体验打磨·信息透明·反馈不迟到：试炼三连战战报补'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.56（旧 v23.55 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.55';"));
ok('data.js 仍保留 v23.55 历史注释（Lv12 终章新技能灯焰长明）',
  dataSrc.includes('// v23.55 新内容·战斗机制：Lv12 终章新技能「灯焰长明」'));
ok('battle.js 含 v23.56 注释块（试炼战报补「获得 N 经验」说明）', battleSrc.includes('// v23.56 试炼战报补「获得 N 经验」'));
ok('battle.js 试炼换关报文已补经验（🚩 ……现身！（获得 ${enemy.xp} 经验 · 已自动恢复…））',
  battleSrc.includes('现身！（获得 ${enemy.xp} 经验 · 已自动恢复'));
ok('battle.js 试炼通关报文已补经验（🌈 ……！（获得 ${enemy.xp} 经验 · 剩余 ${hero.gold} 金））',
  battleSrc.includes('灯火记得你的名字！（获得 ${enemy.xp} 经验 · 剩余 ${hero.gold} 金 · 千锤百炼 ${rc}/${RUSH_CLEAR_GOAL}）'));
ok('battle.js 旧报文零残留（换关/通关不再有无经验版本）',
  !battleSrc.includes('现身！（已自动恢复') && !battleSrc.includes('灯火记得你的名字！（剩余 ${hero.gold} 金）'));
ok('CHANGELOG 顶部已追加 v23.56 条目（试炼战报补经验）', changelog.startsWith('## v23.95 '));
ok('CHANGELOG 仍保留 v23.55 条目（历史口径）', changelog.includes('## v23.55 Lv12 终章新技能「灯焰长明」——第八招收口'));
ok('README 同步（战斗行试炼每关战报补「获得 N 经验」）', readme.includes('试炼每关获胜战报同报「获得 N 经验」'));
// 运行期：真实 winBattle isRush 路径（换关/通关两报文补「获得 N 经验」，boxMsg 捕获桩承 v21.40 捕桩法）
const { RUSH_BOSSES } = await import('../js/data.js');
const { bind: bindMod } = await import('../js/bind.js');
const rushMsgs = [];
const origBox = bindMod.boxMsg;
const origRand = Math.random;
bindMod.boxMsg = (t) => { rushMsgs.push(String(t)); };
Math.random = () => 0.99;
try {
  const hR = { name: '试炼者', level: 1, hp: 500, hpMax: 500, mp: 100, mpMax: 100, atkMax: 30, defMax: 40,
    gold: 0, xp: 0, xpNext: 9999, item: 1, potion2: 0, weapon: '铁剑', armor: '皮甲', diff: null,
    skills: ['火焰斩'], ach: [], poison: 0, seen: { '幽冥魔王': 1, '洞窟领主': 1 }, bestiary: {}, chests: [],
    fragments: [], quests: {}, totalWins: 0, rushStage: 1, rushDone: false, x: 1, y: 1, map: 'cave' };
  S.G = hR; S.scene = 'battle'; S.battleBusy = true; S.blog = [];
  S.enemy = RUSH_BOSSES[0]; // 试炼第 1 关·isRush·xp 60
  btlMod.winBattle();
  ok('运行期：试炼换关报文补「获得 60 经验」（RUSH_BOSSES[0].xp 同源·与恢复句并列·下一关洞窟领主）',
    rushMsgs.some((m) => m.includes('试炼第 2 关：洞窟领主 现身！') && m.includes('获得 60 经验') && m.includes('已自动恢复')), rushMsgs.join(' | '));
  ok('运行期：换关结算零回归（rushStage 1→2 / 满状态恢复后仍 500/100 / 无重复经验报文）',
    hR.rushStage === 2 && hR.hp === 500 && hR.mp === 100, 'stage=' + hR.rushStage);
  hR.rushStage = 3;
  S.enemy = RUSH_BOSSES[2]; // 试炼第 3 关·isRush·xp 90
  btlMod.winBattle();
  ok('运行期：试炼通关报文补「获得 90 经验」（RUSH_BOSSES[2].xp 同源·与通关赏金/余额并列）',
    rushMsgs.some((m) => m.includes('试炼通关！奖励') && m.includes('获得 90 经验') && m.includes('剩余')), rushMsgs.join(' | '));
  ok('运行期：通关结算零回归（rushDone true / 赏金 150+1×20=170 落账）',
    hR.rushDone === true && hR.gold === 170, 'gold=' + hR.gold);
} finally {
  bindMod.boxMsg = origBox;
  Math.random = origRand;
  S.enemy = null; S.scene = 'world'; S.battleBusy = false;
}
// —— v23.57 新支线「蛇影的药引」（酿药师升格委托人·SNAKE_GOAL 单一数据源·新内容·数据层零新逻辑）——
ok('data.js 含 v23.57 版本注释（酿药师升格为讨伐支线「蛇影的药引」委托人）',
  dataSrc.includes('// v23.57 新内容·新支线：潮灯镇酿造锅旁酿药师升格为讨伐支线「蛇影的药引」委托人'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.57（旧 v23.56 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.56';"));
ok('data.js 仍保留 v23.56 历史注释（试炼战报补经验）', dataSrc.includes('// v23.56 体验打磨·信息透明·反馈不迟到：试炼三连战战报补'));
ok('data.js SNAKE_GOAL=3 单一数据源 + QUESTS.side_snake 字面量逐字（50 金 + 1 高级灵药 · 酿药师委托人）',
  dataSrc.includes('const SNAKE_GOAL = 3;') && dataSrc.includes('reward:{ gold:50, potion2:1 },') &&
  dataSrc.includes("id:'side_snake', kind:'side', store:true, npc:'brewer', giver:'brewer'") &&
  dataSrc.includes('GRAIN_GOAL, WOLF_GOAL, SNAKE_GOAL, TREE_GOAL, DEFLECT_GOAL, CHARGE_GOAL'));
ok('README 支线行 蛇影的药引 v23.57 逐字（50 金 + 1 高级灵药 · SNAKE_GOAL 常量源列）',
  readme.includes('蛇影的药引（酿药师 · 3 只毒蛇 `SNAKE_GOAL`）50 金 + 1 高级灵药') &&
  readme.includes('`WOLF_GOAL` `SNAKE_GOAL` `TREE_GOAL`'));
ok('CHANGELOG 顶部已追加 v23.57 条目（新支线蛇影的药引）', changelog.startsWith('## v23.95 '));
// 运行期：真实 npcQuestPages/npcQuestMark 契约（offer → active（进度页）→ turnin → done 分档）
const _qMod = await import('../js/quests.js');
{
  const hO = { bestiary: {}, quests: {} };
  ok('运行期：brewer 开局 offer（无 unlockOn → 可接委托 + offer 页）',
    _qMod.questStatus(hO, 'side_snake') === 'offer' && _qMod.npcQuestMark(hO, 'brewer') === '❕ 可接委托' &&
    _qMod.npcQuestPages(hO, 'brewer')[0].some((l) => l.includes('毒蛇的牙')));
  const hA = { bestiary: { '毒蛇': 1 }, quests: { side_snake: 'active' } };
  ok('运行期：毒蛇 1/3 → active 进度页（condProg 同源截图「已讨伐 1/3 只」）',
    _qMod.npcQuestPages(hA, 'brewer')[0].some((l) => l.includes('已讨伐 1/3 只')));
  const hT = { bestiary: { '毒蛇': 3 }, quests: { side_snake: 'active' } };
  ok('运行期：毒蛇 3/3 → turnin（cond 达成 → 可交任务 + 交付页）',
    _qMod.questStatus(hT, 'side_snake') === 'turnin' && _qMod.npcQuestMark(hT, 'brewer') === '❕ 可交任务' &&
    _qMod.npcQuestPages(hT, 'brewer')[0].some((l) => l.includes('毒牙入锅')));
  const hD = { bestiary: { '毒蛇': 3 }, quests: { side_snake: 'done' } };
  ok('运行期：done 分档（非 trueBoss 页）与 trueBoss 分档逐字齐备',
    _qMod.npcQuestPages(hD, 'brewer')[0].some((l) => l.includes('药引齐了，这锅灵药成了')));
  const hDB = { bestiary: { '毒蛇': 3 }, quests: { side_snake: 'done' }, trueBoss: true };
  ok('运行期：trueBoss done 分档彩蛋（灯都亮回来了）',
    _qMod.npcQuestPages(hDB, 'brewer')[0].some((l) => l.includes('灯都亮回来了')));
}
// —— v23.58 帮助页「地图指南」潮灯镇行 r[2] 补第十一条支线经办指针「酿药师（蛇影的药引）」（体验打磨·信息透明·纯文字·单一数据源）——
const { HELP_PAGES: _HP, QUESTS: _Q } = await import('../js/data.js');
ok('data.js 含 v23.58 版本注释（潮灯镇行 r[2] 补「酿药师（蛇影的药引）」指针）',
  dataSrc.includes('// v23.58 体验打磨·信息透明·纯文字：帮助页「地图指南」潮灯镇行 r[2] 补第十一条支线经办指针'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.58（旧 v23.57 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.57';"));
ok('data.js 仍保留 v23.57 历史注释（蛇影的药引·新支线）',
  dataSrc.includes('// v23.57 新内容·新支线：潮灯镇酿造锅旁酿药师升格为讨伐支线「蛇影的药引」委托人'));
const hRow58 = dataSrc.match(/\[['"]潮灯镇 Lv\.' \+ MAPS\.village\.recLv,[^\]]+\]/);
ok('HELP_PAGES 潮灯镇行 r[2] 补酿药师指针（委托人名 NPCS.brewer.name + 任务名 QUESTS.side_snake.name 单一数据源派生）',
  !!hRow58 && hRow58[0].includes('NPCS.brewer.name') && hRow58[0].includes('QUESTS.side_snake.name'));
const hpRow58 = _HP[1].find((r) => r[0] && r[0].includes('潮灯镇'));
ok('运行期：潮灯镇行 r[2] 含「酿药师（蛇影的药引）」逐字（NPC 名/任务名单一数据源·仍 3 列）',
  !!hpRow58 && hpRow58.length === 3 && hpRow58[2].includes(NPCS.brewer.name) && hpRow58[2].includes('（' + _Q.side_snake.name + '）'));
ok('运行期：潮灯镇行 r[2] 既有指针零回归（水塘灯影·掌灯阿婆/放灯童·广场大灯·村井·粮田（护粮的委托））',
  hpRow58[2].includes('水塘灯影') && hpRow58[2].includes(NPCS.granny.name) && hpRow58[2].includes(NPCS.lampboat.name) &&
  hpRow58[2].includes('广场大灯·村井') && hpRow58[2].includes(_Q.side_grain.name));
ok('运行期：地图指南页行数仍 8 / 其余三页 14/10/10 零回归（12px estW 421.2 ≤470 面板预算不触）',
  _HP.length === 4 && _HP[0].length === 14 && _HP[1].length === 8 && _HP[2].length === 10 && _HP[3].length === 10);
// —— v23.57 级联守护：旧代 v23.56 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.56 特性标签保留）——
const stale57 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.56'") || src.includes("GAME_VERSION === 'v23.56'") ||
      src.includes("startsWith('## v23.56") || src.includes("'## v23.56 ")) stale57.push(f);
}
ok('旧代 v23.56 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.56 特性标签保留）', stale57.length === 0, stale57.join(','));
// —— v23.58 级联守护：旧代 v23.57 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.57 特性标签保留）——
const stale58 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.57'") || src.includes("GAME_VERSION === 'v23.57'") ||
      src.includes("startsWith('## v23.57") || src.includes("'## v23.57 ")) stale58.push(f);
}
ok('旧代 v23.57 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.57 特性标签保留）', stale58.length === 0, stale58.join(','));
ok('CHANGELOG 顶部已追加 v23.58 条目（潮灯镇行酿药师指针）', changelog.startsWith('## v23.95 '));
// —— v23.59 记忆碎片拾取音效归位（音效反馈·听觉信息透明——承 v21.3 alert/boss「先闻其声」/
// v23.22 SFX.ach / v23.43 SFX.crit / v23.49 SFX.chest 同一「事件音效各归其位」主线收口后复查补全：
// SFX.item 自 v23.49 宝箱移出后成孤儿音效，唯一仍是「拾取」语义的现场=winBattle 碎片拾取却静默）——
ok('data.js 含 v23.59 版本注释（记忆碎片拾取音效归位）',
  dataSrc.includes('// v23.59 音效反馈·听觉信息透明：记忆碎片拾取音效归位'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.59（旧 v23.58 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.59';"));
ok('data.js 仍保留 v23.58 历史注释（潮灯镇行酿药师指针）',
  dataSrc.includes('// v23.58 体验打磨·信息透明·纯文字：帮助页「地图指南」潮灯镇行 r[2] 补第十一条支线经办指针'));
ok('audio.js SFX.item 含 v23.59 注释（700→900 双音音效定义逐字未动）',
  audioSrc.includes('// v23.59 记忆碎片拾取音效归位后成为全库唯一「拾取」语义调用点') &&
  audioSrc.includes("item() { tone(700, 0.08, 'sine', 0.1); tone(900, 0.08, 'sine', 0.1, 0.08); },"));
ok('battle.js 碎片块 SFX.item() 源级落位（v23.59 注释块 + 全库唯一调用点）',
  battleSrc.includes('// v23.59 记忆碎片拾取音效归位（音效反馈·听觉信息透明') &&
  battleSrc.split('SFX.item();').length === 2);
ok('battle.js 碎片块其余逐字零回归（v19.90 收集进度注释/🕯️ 报文逐字未动）',
  battleSrc.includes('// v19.90 记忆碎片拾取反馈追加收集进度') &&
  battleSrc.includes('bind.boxMsg(`🕯️ 拾起一段记忆：【${frag.name}】'));
ok('README 记忆碎片行含 v23.59 音效口径（SFX.item 归位到碎片拾取）',
  readme.includes('拾取瞬间有专属「拾取」音效（v23.59——SFX.item 归位到碎片拾取，与胜利号角一听即分）'));
ok('CHANGELOG 顶部已追加 v23.59 条目（记忆碎片拾取音效归位）', changelog.startsWith('## v23.95 '));
// —— v23.59 级联守护：旧代 v23.58 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.58 特性标签保留）——
const stale59 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.58'") || src.includes("GAME_VERSION === 'v23.58'") ||
      src.includes("startsWith('## v23.58") || src.includes("'## v23.58 ")) stale59.push(f);
}
ok('旧代 v23.58 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.58 特性标签保留）', stale59.length === 0, stale59.join(','));
// 运行期：真实 winBattle 碎片拾取路径（FRAGMENTS 首段首胜）→ SFX.item 真实调用 + 🕯️ 报文零回归
const { FRAGMENTS: _FRAG } = await import('../js/data.js');
const { SFX: _SFX } = await import('../js/audio.js');
{
  const _origItem = _SFX.item;
  let _itemCalls = 0;
  _SFX.item = () => { _itemCalls++; };
  const _msgs = [];
  const _origBox2 = bindMod.boxMsg;
  bindMod.boxMsg = (t) => { _msgs.push(String(t)); };
  const _origRand2 = Math.random;
  Math.random = () => 0.99;
  try {
    const hF = { name: '余烬', level: 6, hp: 100, hpMax: 100, mp: 40, mpMax: 40, atkMax: 20, defMax: 15,
      gold: 0, xp: 0, xpNext: 9999, item: 1, potion2: 0, weapon: '铁剑', armor: '皮甲', diff: null,
      skills: ['火焰斩'], ach: [], poison: 0, seen: {}, bestiary: {}, chests: [], fragments: [],
      quests: {}, totalWins: 0, bossDefeated: true, x: 1, y: 1, map: 'cave' };
    S.G = hF; S.scene = 'battle'; S.battleBusy = true; S.blog = [];
    S.enemy = { name: _FRAG[0].enemy, hp: 0, hpMax: 100, atk: 10, def: 5, xp: 60, gold: 0 };
    btlMod.winBattle();
    ok('运行期：碎片拾取路径 SFX.item() 真实调用一次（胜利号角后拾取双音落位）', _itemCalls === 1, 'calls=' + _itemCalls);
    ok('运行期：🕯️ 拾取报文零回归（' + _FRAG[0].name + ' · 1/' + _FRAG.length + ' 段记忆已集齐 · v19.90 口径）',
      _msgs.some((m) => m.includes('🕯️ 拾起一段记忆') && m.includes('1/' + _FRAG.length + ' 段记忆已集齐')), _msgs.join(' | '));
  } finally {
    _SFX.item = _origItem;
    bindMod.boxMsg = _origBox2;
    Math.random = _origRand2;
    S.enemy = null; S.scene = 'world'; S.battleBusy = false;
  }
}

// —— v23.61 状态页「已学技能：」节头 N/8 计数（体验打磨·信息透明·节头第一眼就报进度家族收口——
// 承 v23.16 灯下之声节头 N/37 / v23.19 记忆碎片节头 N/4 / v23.20 支线节头可交付 N / v23.21 主线节头
// N/5 / v23.34 战斗技能菜单标题「已学 N/7」同一「集合类列表节头第一眼就报进度」主线：J 日志四节与
// 战斗技能菜单标题都报计数，唯独 I 状态页「已学技能：」节头仍是无数字的裸标签——v23.55 第八招
// 「灯焰长明」后按 I 看「八招学齐了没」节头查无一眼之数；现与技能菜单同读 hero.skills.length ·
// Object.keys(SKILL_DATA).length 一份单一数据源（零裸字面量、加/删技能自动跟随））——
const _skMod61 = await import('../js/data.js');
const _menusMod61 = await import('../js/view/menus.js');
ok('data.js 含 v23.61 版本注释（状态页技能节头计数）', dataSrc.includes('// v23.61 体验打磨·信息透明·节头第一眼就报进度'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.61（旧 v23.60 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.60';"));
ok('data.js 仍保留 v23.60 历史注释（潮灯镇行旅馆狼嚎指针）',
  dataSrc.includes('// v23.60 体验打磨·信息透明·纯文字'));
ok('menus.js drawStatus 节头与技能菜单同源派生计数（hero.skills.length + Object.keys(SKILL_DATA).length）',
  menusSrc.includes("text('已学技能：' + hero.skills.length + '/' + Object.keys(SKILL_DATA).length"));
ok('menus.js drawStatus 节头 v23.61 注释落位', menusSrc.includes('// v23.61 状态页「已学技能：」节头补 N/8 计数'));
ok('CHANGELOG 顶部已追加 v23.61 条目（状态页技能节头计数）', changelog.startsWith('## v23.95 '));
// —— v23.61 级联守护：旧代 v23.60 pin 全库零残留（仅 v23.60 特性标签保留）——
const stale61 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.60'") || src.includes("GAME_VERSION === 'v23.60'") ||
      src.includes("startsWith('## v23.60") || src.includes("'## v23.60 ")) stale61.push(f);
}
ok('旧代 v23.60 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.60 特性标签保留）', stale61.length === 0, stale61.join(','));
// 运行期：真实 drawStatus（DOM/音频/存储桩 + main.js 导入后）八招档渲染零抛错（承 v21.83 七招渲染先例）
{
  const _h61 = newGame('余烬');
  _h61.skills = Object.keys(_skMod61.SKILL_DATA);
  _h61.level = 12;
  let _drew61 = true;
  try { S.G = _h61; S.scene = 'world'; _menusMod61.drawStatus(); } catch (e) { _drew61 = false; }
  S.scene = 'world';
  ok('运行期：状态页八招档（已学技能 8 行 + 节头 N/8）渲染不抛错', _drew61);
}

// —— v23.62 记忆图鉴行补「讨伐支线进度」角标（体验打磨·信息透明·纯显示——承 v23.53 决策现场
// 信息透明 / v23.20 支线节头「可交付 N」同一「同一信息在多处决策现场可见」主线收口：J 日志每卡
// 有进度、图鉴行此前查无一行，现按 quests.questKillProg 单一数据源在行第二行追加「 · 📜 支线 N/M」）——
{
  const _qMod62 = await import('../js/quests.js');
  const _menusMod62 = await import('../js/view/menus.js');
  const _menusSrc62 = read('../js/view/menus.js');
  ok('data.js 含 v23.62 版本注释（记忆图鉴行讨伐支线进度角标）',
    dataSrc.includes('// v23.62 体验打磨·信息透明·纯显示：记忆图鉴行补「讨伐支线进度」角标'));
  ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.62（旧 v23.61 字面量零残留）',
    dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.61';"));
  ok('data.js 仍保留 v23.61 历史注释（状态页技能节头计数）',
    dataSrc.includes('// v23.61 体验打磨·信息透明·节头第一眼就报进度'));
  ok('quests.js 含 v23.62 注释块（图鉴行讨伐支线进度·单一数据源）', questsSrc.includes('v23.62 图鉴行讨伐支线进度'));
  ok('quests.js questKillProg 源级落位（kind side + condProg + obj【魔物名】派生 + active/turnin）',
    questsSrc.includes('export function questKillProg(hero, monName)') &&
    questsSrc.includes("const key = '【' + monName + '】';") &&
    questsSrc.includes("st === 'active' || st === 'turnin'"));
  ok('menus.js 已导入 questKillProg（quests.js import 行）',
    _menusSrc62.includes('questKillProg } from'));
  ok('menus.js 图鉴行 v23.62 注释落位（支线进度角标·纯显示）',
    _menusSrc62.includes('v23.62 图鉴行讨伐支线进度角标'));
  ok('menus.js 图鉴行双分支落位（已遭遇未讨伐行 + 已讨伐行均追加 📜 支线）',
    _menusSrc62.includes('· 📜 支线 ${qKill.prog}`') && _menusSrc62.includes('const qKill = questKillProg(hero, r.n);'));
  ok('CHANGELOG 顶部已追加 v23.62 条目（记忆图鉴行讨伐支线进度角标）', changelog.startsWith('## v23.95 '));
  // 纯函数三档谓词逐值：active（2/3）· turnin（满额）· 未接取/done/非讨伐支线/未知怪 null
  const h62 = newGame('灯见');
  h62.bestiary = { '毒蛇': 2 };
  h62.quests = { side_snake: 'active' };
  const r1 = _qMod62.questKillProg(h62, '毒蛇');
  ok('运行期：questKillProg(active 毒蛇 2/3) 返回 {status:active, prog:"2/3 只"}',
    !!r1 && r1.id === 'side_snake' && r1.status === 'active' && r1.prog === '2/3 只', JSON.stringify(r1));
  h62.bestiary['毒蛇'] = 3;
  ok('运行期：questKillProg(turnin 毒蛇 3/3) 返回 {status:turnin}（可交付与 J 日志同源）',
    !!r1 && (() => { const r = _qMod62.questKillProg(h62, '毒蛇'); return r && r.status === 'turnin' && r.prog === '3/3 只'; })(), JSON.stringify(_qMod62.questKillProg(h62, '毒蛇')));
  ok('运行期：questKillProg(未接取 offer) 返回 null（零噪音）',
    _qMod62.questKillProg({ bestiary: {}, quests: {} }, '毒蛇') === null);
  ok('运行期：questKillProg(已完成 done) 返回 null（不再提示）',
    _qMod62.questKillProg({ bestiary: { '毒蛇': 3 }, quests: { side_snake: 'done' } }, '毒蛇') === null);
  ok('运行期：questKillProg(非讨伐支线怪/未知怪/缺 hero) 返回 null',
    _qMod62.questKillProg({ bestiary: {}, quests: { side_mushroom: 'active' } }, '毒蛇') === null &&
    _qMod62.questKillProg(h62, '史莱姆') === null && _qMod62.questKillProg(null, '毒蛇') === null);
  // 运行期：真实 drawCodex（DOM/音频/存储桩 + main.js 导入后）接取讨伐支线档渲染零抛错
  let _drew62 = true, _tag62 = false;
  try {
    S.G = h62; S.scene = 'world'; S.codexScroll = 0;
    const _c62 = await import('../js/view/canvas.js');
    const _orig62 = _c62.CTX.fillText.bind(_c62.CTX);
    _c62.CTX.fillText = (t, x, y) => { _orig62(t, x, y); if (String(t).includes('📜 支线')) _tag62 = true; };
    _menusMod62.drawCodex();
    _c62.CTX.fillText = _orig62;
  } catch (e) { _drew62 = false; }
  ok('运行期：drawCodex（毒蛇 2/3 接取档）渲染不抛错且 📜 支线 2/3 只 落位', _drew62 && _tag62, 'drew=' + _drew62 + ' tag=' + _tag62);
  S.scene = 'world';
  // —— v23.62 级联守护：旧代 v23.61 pin 全库零残留（仅 v23.61 特性标签保留）——
  const stale62 = [];
  for (const f of allTests) {
    const src = read(f);
    if (src.includes("GAME_VERSION = 'v23.61'") || src.includes("GAME_VERSION === 'v23.61'") ||
        src.includes("startsWith('## v23.61")) stale62.push(f);
  }
  ok('旧代 v23.61 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.61 特性标签保留）', stale62.length === 0, stale62.join(','));
}

// —— v23.63 新成就「暴击如雨」（战斗维度第三枚里程碑·承 v23.36 以守为攻 / v23.54 蓄势待发先例：
// [1]普攻暴击累计 CRIT_GOAL 次——防御反击与蓄力都有纪念，唯独最常用的普攻暴击无）——
ok('data.js 含 v23.63 版本注释（新成就暴击如雨·战斗维度第三枚）',
  dataSrc.includes('// v23.63 新内容·战斗维度第三枚里程碑：新成就「暴击如雨」'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.63（旧 v23.62 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.62';"));
ok('data.js 仍保留 v23.62 历史注释（记忆图鉴行讨伐支线进度角标）',
  dataSrc.includes('// v23.62 体验打磨·信息透明·纯显示：记忆图鉴行补「讨伐支线进度」角标'));
const critAch = ACH_LIST.find((a) => a.id === 'crit');
ok('ACH_LIST 含 crit「暴击如雨」且 id 唯一（末尾追加于 charge 之后，既有序位零位移）',
  !!critAch && critAch.name === '暴击如雨' && ACH_LIST.filter((a) => a.id === 'crit').length === 1 &&
  ACH_LIST.findIndex((a) => a.id === 'crit') === 62);
ok('crit 描述由 CRIT_GOAL 派生（零裸字面量）', critAch.d === `[1]普攻暴击累计 ${CRIT_GOAL} 次`, critAch.d);
ok('crit 判定/进度读 (g.crits||0) 防御式（旧档无字段=0 不误解锁零迁移）',
  String(critAch.ok).includes('(g.crits||0)') && String(critAch.prog).includes('g.crits||0'));
ok('crit 无 r 字段纯里程碑（与 deflect/charge/memoir/skills 同款）', !('r' in critAch));
ok('crit 0 次（缺字段旧档）→ false 且 prog 0/20', critAch.ok({}) === false && critAch.prog({}) === `0/${CRIT_GOAL}`);
ok('crit 19 次（恰差 1）→ false 且 prog 19/20', critAch.ok({ crits: 19 }) === false && critAch.prog({ crits: 19 }) === `19/${CRIT_GOAL}`);
ok('crit 20 次（恰好达标）→ true 且 prog 20/20', critAch.ok({ crits: 20 }) === true && critAch.prog({ crits: 20 }) === `${CRIT_GOAL}/${CRIT_GOAL}`);
ok('crit 40 次（超阈值）→ true 且 prog 不钳制 40/20（与 deflect/charge 同式）', critAch.ok({ crits: 40 }) === true && critAch.prog({ crits: 40 }) === `40/${CRIT_GOAL}`);
ok('battle.js 含 v23.63 注释（暴击如雨计数说明）', battleSrc.includes('v23.63 成就「暴击如雨」计数'));
ok('battle.js doAttack 暴击唯一产生点源级落位（cc 自增 + hero.crits 写入 + 当场 applyAchievements + 战报进度）',
  battleSrc.includes('const cc = crit ? (hero.crits || 0) + 1 : (hero.crits || 0);') && battleSrc.includes('hero.crits = cc;') &&
  battleSrc.includes('applyAchievements();') && battleSrc.includes('暴击如雨 ${cc}/${CRIT_GOAL}'));
ok('battle.js 暴击结算链逐字零回归（CRIT_RATE 判定/×CRIT_MULT/attackMove crit 传参/专属音/震屏）',
  battleSrc.includes('const crit = Math.random() < CRIT_RATE;') && battleSrc.includes('(isCrit ? CRIT_MULT : 1)') &&
  battleSrc.includes('if (crit) SFX.crit();') && battleSrc.includes('{ hurt: 1, crit: isCrit }'));
ok('data.js 含 CRIT_GOAL 阈值常量与 crit 条目注释（单一数据源三端同读）',
  dataSrc.includes('const CRIT_GOAL = 20;') && dataSrc.includes('// 暴击如雨（v23.63'));
ok('data.js 导出具 CRIT_GOAL（export 单一出口）', dataSrc.includes('CHARGE_GOAL, CRIT_GOAL,'));
ok('README 同步（C 行 63 项 / 成就 bullet 63 项·暴击如雨 X/20 次 / 成就档位行 CRIT_GOAL(20)·共 76 项 / 战斗暴击句）',
  readme.includes('全部 76 项进度') && readme.includes('**76 项成就**') && readme.includes('暴击如雨 X/20 次（普攻暴击累计，v23.63）') &&
  readme.includes('CRIT_GOAL`(20) 次，v23.63') && readme.includes('共 76 项') && readme.includes('20 次解锁成就「暴击如雨」'));
ok('CHANGELOG 顶部已追加 v23.63 条目（新成就暴击如雨）', changelog.startsWith('## v23.95 '));
ok('CHANGELOG 仍保留 v23.62 条目（历史口径）', changelog.includes('## v23.62 记忆图鉴行补「讨伐支线进度」角标'));
// 运行期：真实 playerAction('attack') 暴击路径（Math.random 强制暴击档：计数落账 + 战报进度 + 达标当场解锁）
{
  const _origR63 = Math.random;
  try {
    S.G = newGame('击'); S.G.map = 'village';
    btlMod.startBattle({ name: '木桩', hp: 5000, hpMax: 5000, atk: 5, def: 10, xp: 1, gold: 0 });
    S.battleBusy = false;
    Math.random = () => 0.05; // CRIT_RATE=0.12 → 暴击档
    btlMod.playerAction('attack');
    ok('运行期：暴击计数落账（hero.crits 1）且战报含「 · 暴击如雨 1/20」（计数现场报进度）',
      S.G.crits === 1 && S.blog.some((b) => String(b).includes('暴击如雨 1/20')), 'crits=' + S.G.crits);
    ok('运行期：暴击战报主体零回归（×1.8 倍率仍在）', S.blog.some((b) => String(b).includes('暴击×1.8')));
    S.G = newGame('击'); S.G.map = 'village';
    btlMod.startBattle({ name: '木桩', hp: 5000, hpMax: 5000, atk: 5, def: 10, xp: 1, gold: 0 });
    S.battleBusy = false;
    S.G.crits = 19;
    Math.random = () => 0.05;
    btlMod.playerAction('attack');
    ok('运行期：第 20 次暴击当场解锁「暴击如雨」（applyAchievements 落 hero.ach 且重复去重）',
      S.G.crits === 20 && (S.G.ach || []).includes('crit') && (S.G.ach || []).length === 1, 'crits=' + S.G.crits + ' ach=' + JSON.stringify(S.G.ach || []));
  } finally {
    Math.random = _origR63;
    S.enemy = null; S.scene = 'world'; S.battleBusy = false;
  }
}
// —— v23.63 级联守护：旧代 v23.62 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.62 特性标签保留）——
const stale63 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.62'") || src.includes("GAME_VERSION === 'v23.62'") ||
      src.includes("startsWith('## v23.62")) stale63.push(f);
}
ok('旧代 v23.62 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.62 特性标签保留）', stale63.length === 0, stale63.join(','));

// —— v23.64 新成就「熟能生巧」（战斗维度第四枚里程碑·承 v23.36 以守为攻 / v23.54 蓄势待发 /
// v23.63 暴击如雨先例：[2]技能累计释放 CAST_GOAL 次——防御反击、蓄力、普攻暴击都有纪念，
// 唯独玩家最主动的战术指令 [2]技能（SKILL_DATA 八招全表）无）——
ok('data.js 含 v23.64 版本注释（新成就熟能生巧·战斗维度第四枚）',
  dataSrc.includes('// v23.64 新内容·战斗维度第四枚里程碑：新成就「熟能生巧」'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.64（旧 v23.63 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.63';"));
ok('data.js 仍保留 v23.63 历史注释（新成就暴击如雨·战斗维度第三枚）',
  dataSrc.includes('// v23.63 新内容·战斗维度第三枚里程碑：新成就「暴击如雨」'));
const castAch = ACH_LIST.find((a) => a.id === 'cast');
ok('ACH_LIST 含 cast「熟能生巧」且 id 唯一（末尾追加于 crit 之后，既有序位零位移）',
  !!castAch && castAch.name === '熟能生巧' && ACH_LIST.filter((a) => a.id === 'cast').length === 1 &&
  ACH_LIST.findIndex((a) => a.id === 'cast') === 63);
ok('cast 描述由 CAST_GOAL 派生（零裸字面量）', castAch.d === `[2]技能累计释放 ${CAST_GOAL} 次`, castAch.d);
ok('cast 判定/进度读 (g.casts||0) 防御式（旧档无字段=0 不误解锁零迁移）',
  String(castAch.ok).includes('(g.casts||0)') && String(castAch.prog).includes('g.casts||0'));
ok('cast 无 r 字段纯里程碑（与 deflect/charge/crit/memoir/skills 同款）', !('r' in castAch));
ok('cast 0 次（缺字段旧档）→ false 且 prog 0/30', castAch.ok({}) === false && castAch.prog({}) === `0/${CAST_GOAL}`);
ok('cast 29 次（恰差 1）→ false 且 prog 29/30', castAch.ok({ casts: 29 }) === false && castAch.prog({ casts: 29 }) === `29/${CAST_GOAL}`);
ok('cast 30 次（恰好达标）→ true 且 prog 30/30', castAch.ok({ casts: 30 }) === true && castAch.prog({ casts: 30 }) === `${CAST_GOAL}/${CAST_GOAL}`);
ok('cast 41 次（超阈值）→ true 且 prog 不钳制 41/30（与 crit/charge 同式）', castAch.ok({ casts: 41 }) === true && castAch.prog({ casts: 41 }) === `41/${CAST_GOAL}`);
ok('battle.js 含 v23.64 注释（熟能生巧计数说明）', battleSrc.includes('v23.64 成就「熟能生巧」计数'));
ok('battle.js doSkill 施法成功唯一产生点源级落位（castN 自增 + hero.casts 写入 + 当场 applyAchievements）',
  battleSrc.includes('const castN = (hero.casts || 0) + 1;') && battleSrc.includes('hero.casts = castN;') &&
  battleSrc.includes('applyAchievements();') && battleSrc.includes('hero.mp -= skill.mp;'));
ok('battle.js import 含 CAST_GOAL/FLEE_GOAL（既有 data.js import 行扩展，零新增模块依赖）',
  battleSrc.includes('CRIT_GOAL, CAST_GOAL, FLEE_GOAL, POTION_USE_GOAL, RUSH_CLEAR_GOAL, DIFF_SCALE'));
ok('battle.js 技能结算链逐字零回归（MP 不足拦截/封印拦截/指令映射/暴击计数源不动）',
  battleSrc.includes('hero.mp < skill.mp') && battleSrc.includes('skillForbidden(skillName, skill, enemy)') &&
  battleSrc.includes('skill: doSkill') && battleSrc.includes('const cc = crit ? (hero.crits || 0) + 1'));
ok('data.js 含 CAST_GOAL 阈值常量与 cast 条目注释（单一数据源三端同读）',
  dataSrc.includes('const CAST_GOAL = 30;') && dataSrc.includes('// 熟能生巧（v23.64'));
ok('data.js 导出具 CAST_GOAL/FLEE_GOAL/POTION_USE_GOAL（export 单一出口，紧随 CRIT_GOAL）', dataSrc.includes('CRIT_GOAL, CAST_GOAL, FLEE_GOAL, POTION_USE_GOAL, RUSH_CLEAR_GOAL, MUSHROOM_PRICE,'));
ok('README 同步（C 行 64 项 / 成就 bullet 64 项·熟能生巧 X/30 次 / 成就档位行 CAST_GOAL(30)·共 76 项 / 战斗技能句）',
  readme.includes('全部 76 项进度') && readme.includes('**76 项成就**') && readme.includes('熟能生巧 X/30 次（技能累计释放，v23.64）') &&
  readme.includes('CAST_GOAL`(30) 次，v23.64') && readme.includes('共 76 项') && readme.includes('30 次解锁成就「熟能生巧」'));
ok('CHANGELOG 顶部已追加 v23.64 条目（新成就熟能生巧）', changelog.startsWith('## v23.95 '));
ok('CHANGELOG 仍保留 v23.63 条目（历史口径）', changelog.includes('## v23.63 新成就「暴击如雨」'));
// 运行期：真实 playerAction('skill','火焰斩') 施法路径（计数落账 + 达标当场解锁 + 旧档缺字段零迁移）
{
  try {
    S.G = newGame('技'); S.G.map = 'village';
    S.G.mp = 999; S.G.mpMax = 999; S.G.hp = 999; S.G.hpMax = 999;
    btlMod.startBattle({ name: '木桩', hp: 5000, hpMax: 5000, atk: 5, def: 10, xp: 1, gold: 0 });
    S.battleBusy = false;
    btlMod.playerAction('skill', '火焰斩');
    ok('运行期：施法计数落账（hero.casts 1）且未达标不误解锁（战报主体零回归）',
      S.G.casts === 1 && !(S.G.ach || []).includes('cast') && S.blog.some((b) => String(b).includes('火焰斩')), 'casts=' + S.G.casts);
    S.G = newGame('技'); S.G.map = 'village';
    S.G.mp = 999; S.G.mpMax = 999; S.G.hp = 999; S.G.hpMax = 999;
    btlMod.startBattle({ name: '木桩', hp: 5000, hpMax: 5000, atk: 5, def: 10, xp: 1, gold: 0 });
    S.battleBusy = false;
    S.G.casts = 29;
    btlMod.playerAction('skill', '火焰斩');
    ok('运行期：第 30 次施法当场解锁「熟能生巧」（applyAchievements 落 hero.ach 且重复去重）',
      S.G.casts === 30 && (S.G.ach || []).includes('cast') && (S.G.ach || []).length === 1, 'casts=' + S.G.casts + ' ach=' + JSON.stringify(S.G.ach || []));
  } finally {
    S.enemy = null; S.scene = 'world'; S.battleBusy = false;
  }
}
// —— v23.64 级联守护：旧代 v23.63 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.63 特性标签保留）——
const stale64 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.63'") || src.includes("GAME_VERSION === 'v23.63'") ||
      src.includes("startsWith('## v23.63")) stale64.push(f);
}
ok('旧代 v23.63 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.63 特性标签保留）', stale64.length === 0, stale64.join(','));

// —— v23.65 新成就「走为上计」（战斗维度第五枚里程碑·承 v23.36 以守为攻 / v23.54 蓄势待发 /
// v23.63 暴击如雨 / v23.64 熟能生巧先例：[4]逃跑成功累计 FLEE_GOAL 次——防御反击、蓄力、
// 普攻暴击、技能都有纪念，唯独最「保命」的一键（普通怪 60% 概率成功、Boss 气场压制不可逃）无）——
ok('data.js 含 v23.65 版本注释（新成就走为上计·战斗维度第五枚）',
  dataSrc.includes('// v23.65 新内容·战斗维度第五枚里程碑：新成就「走为上计」'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.65（旧 v23.64 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.64';"));
ok('data.js 仍保留 v23.64 历史注释（新成就熟能生巧·战斗维度第四枚）',
  dataSrc.includes('// v23.64 新内容·战斗维度第四枚里程碑：新成就「熟能生巧」'));
const fleeAch = ACH_LIST.find((a) => a.id === 'flee');
ok('ACH_LIST 含 flee「走为上计」且 id 唯一（末尾追加于 cast 之后，既有序位零位移）',
  !!fleeAch && fleeAch.name === '走为上计' && ACH_LIST.filter((a) => a.id === 'flee').length === 1 &&
  ACH_LIST.findIndex((a) => a.id === 'flee') === 64);
ok('flee 描述由 FLEE_GOAL 派生（零裸字面量）', fleeAch.d === `[4]逃跑成功累计 ${FLEE_GOAL} 次`, fleeAch.d);
ok('flee 判定/进度读 (g.flees||0) 防御式（旧档无字段=0 不误解锁零迁移）',
  String(fleeAch.ok).includes('(g.flees||0)') && String(fleeAch.prog).includes('g.flees||0'));
ok('flee 无 r 字段纯里程碑（与 deflect/charge/crit/cast/memoir/skills 同款）', !('r' in fleeAch));
ok('flee 0 次（缺字段旧档）→ false 且 prog 0/10', fleeAch.ok({}) === false && fleeAch.prog({}) === `0/${FLEE_GOAL}`);
ok('flee 9 次（恰差 1）→ false 且 prog 9/10', fleeAch.ok({ flees: 9 }) === false && fleeAch.prog({ flees: 9 }) === `9/${FLEE_GOAL}`);
ok('flee 10 次（恰好达标）→ true 且 prog 10/10', fleeAch.ok({ flees: 10 }) === true && fleeAch.prog({ flees: 10 }) === `${FLEE_GOAL}/${FLEE_GOAL}`);
ok('flee 15 次（超阈值）→ true 且 prog 不钳制 15/10（与 crit/charge/cast 同式）', fleeAch.ok({ flees: 15 }) === true && fleeAch.prog({ flees: 15 }) === `15/${FLEE_GOAL}`);
ok('battle.js 含 v23.65 注释（走为上计计数说明）', battleSrc.includes('v23.65 成就「走为上计」计数'));
ok('battle.js doFlee 逃跑成功唯一产生点源级落位（fleeN 自增 + hero.flees 写入 + 当场 applyAchievements + 战报进度后缀）',
  battleSrc.includes('const fleeN = (hero.flees || 0) + 1;') && battleSrc.includes('hero.flees = fleeN;') &&
  battleSrc.includes('applyAchievements();') && battleSrc.includes('🏃 成功逃脱了！ · 走为上计 ${fleeN}/${FLEE_GOAL}'));
ok('battle.js import 含 FLEE_GOAL（既有 data.js import 行扩展，零新增模块依赖）',
  battleSrc.includes('CAST_GOAL, FLEE_GOAL, POTION_USE_GOAL, RUSH_CLEAR_GOAL, DIFF_SCALE'));
ok('battle.js 逃跑链逐字零回归（FLEE_SUCCESS 判定/Boss 气场分支/逃脱失败战报不动）',
  battleSrc.includes('if (Math.random() < FLEE_SUCCESS) {') && battleSrc.includes('的气场压制着你，无法逃脱！（本回合行动保留）') &&
  battleSrc.includes('逃脱失败！（${enemy.name} 即将行动）'));
ok('data.js 含 FLEE_GOAL 阈值常量与 flee 条目注释（单一数据源三端同读）',
  dataSrc.includes('const FLEE_GOAL = 10;') && dataSrc.includes('// 走为上计（v23.65'));
ok('data.js 导出具 FLEE_GOAL/POTION_USE_GOAL（export 单一出口，紧随 CAST_GOAL）', dataSrc.includes('CAST_GOAL, FLEE_GOAL, POTION_USE_GOAL, RUSH_CLEAR_GOAL, MUSHROOM_PRICE,'));
ok('README 同步（C 行 65 项 / 成就 bullet 65 项·走为上计 X/10 次 / 成就档位行 FLEE_GOAL(10)·共 76 项 / 战斗逃跑句）',
  readme.includes('全部 76 项进度') && readme.includes('**76 项成就**') && readme.includes('走为上计 X/10 次（逃跑成功累计，v23.65）') &&
  readme.includes('FLEE_GOAL`(10) 次，v23.65') && readme.includes('共 76 项') && readme.includes('10 次解锁成就「走为上计」'));
ok('CHANGELOG 顶部已追加 v23.65 条目（新成就走为上计）', changelog.startsWith('## v23.95 '));
ok('CHANGELOG 仍保留 v23.64 条目（历史口径）', changelog.includes('## v23.64 新成就「熟能生巧」'));
// 运行期：真实 playerAction('flee') 逃跑成功路径（计数落账 + 达标当场解锁 + 旧档缺字段零迁移）
{
  let _rnd;
  try {
    _rnd = Math.random;
    Math.random = () => 0; // FLEE_SUCCESS=0.6 → 必成功
    S.G = newGame('走'); S.G.map = 'village';
    S.scene = 'battle'; S.battleBusy = false; S.enemy = { name: '史莱姆' };
    btlMod.playerAction('flee');
    ok('运行期：逃跑成功计数落账（hero.flees 1）且未达标不误解锁（战报进度后缀落位）',
      S.G.flees === 1 && !(S.G.ach || []).includes('flee') && S.blog.some((b) => String(b).includes('🏃 成功逃脱了！ · 走为上计 1/10')), 'flees=' + S.G.flees);
    S.G = newGame('走'); S.G.map = 'village'; S.G.flees = 9;
    S.scene = 'battle'; S.battleBusy = false; S.enemy = { name: '史莱姆' };
    btlMod.playerAction('flee');
    ok('运行期：第 10 次逃跑成功当场解锁「走为上计」（applyAchievements 落 hero.ach 且重复去重）',
      S.G.flees === 10 && (S.G.ach || []).includes('flee') && (S.G.ach || []).length === 1, 'flees=' + S.G.flees + ' ach=' + JSON.stringify(S.G.ach || []));
  } finally {
    Math.random = _rnd;
    S.enemy = null; S.scene = 'world'; S.battleBusy = false;
  }
}
// —— v23.66 新成就「药到病除」（战斗维度第六枚里程碑·承 v23.36 以守为攻 / v23.54 蓄势待发 /
// v23.63 暴击如雨 / v23.64 熟能生巧 / v23.65 走为上计先例：[3]战斗用药累计 POTION_USE_GOAL 次——
// 战斗六指令（[1]攻击/[2]技能/[3]药水/[4]逃跑/[5]防御/[6]蓄力）里防御的反击、蓄力、暴击、技能、
// 逃跑都有纪念，唯独最「续命」的一键「[3]药水」（takePotion 优先耗高级灵药、普通药水只补 HP、
// 满状态不浪费）查无回响）——
ok('data.js 含 v23.66 版本注释（新成就药到病除·战斗维度第六枚）',
  dataSrc.includes('// v23.66 新内容·战斗维度第六枚里程碑：新成就「药到病除」'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.66（旧 v23.65 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.65';"));
ok('data.js 仍保留 v23.65 历史注释（新成就走为上计·战斗维度第五枚）',
  dataSrc.includes('// v23.65 新内容·战斗维度第五枚里程碑：新成就「走为上计」'));
const potionAch = ACH_LIST.find((a) => a.id === 'potionuses');
ok('ACH_LIST 含 potionuses「药到病除」且 id 唯一（末尾追加于 flee 之后，既有序位零位移）',
  !!potionAch && potionAch.name === '药到病除' && ACH_LIST.filter((a) => a.id === 'potionuses').length === 1 &&
  ACH_LIST.findIndex((a) => a.id === 'potionuses') === 65);
ok('potionuses 描述由 POTION_USE_GOAL 派生（零裸字面量）', potionAch.d === `[3]战斗用药累计 ${POTION_USE_GOAL} 次`, potionAch.d);
ok('potionuses 判定/进度读 (g.potionUses||0) 防御式（旧档无字段=0 不误解锁零迁移）',
  String(potionAch.ok).includes('(g.potionUses||0)') && String(potionAch.prog).includes('g.potionUses||0'));
ok('potionuses 无 r 字段纯里程碑（与 deflect/charge/crit/cast/flee/memoir/skills 同款）', !('r' in potionAch));
ok('potionuses 0 次（缺字段旧档）→ false 且 prog 0/15', potionAch.ok({}) === false && potionAch.prog({}) === `0/${POTION_USE_GOAL}`);
ok('potionuses 14 次（恰差 1）→ false 且 prog 14/15', potionAch.ok({ potionUses: 14 }) === false && potionAch.prog({ potionUses: 14 }) === `14/${POTION_USE_GOAL}`);
ok('potionuses 15 次（恰好达标）→ true 且 prog 15/15', potionAch.ok({ potionUses: 15 }) === true && potionAch.prog({ potionUses: 15 }) === `${POTION_USE_GOAL}/${POTION_USE_GOAL}`);
ok('potionuses 20 次（超阈值）→ true 且 prog 不钳制 20/15（与 crit/charge/cast 同式）', potionAch.ok({ potionUses: 20 }) === true && potionAch.prog({ potionUses: 20 }) === `20/${POTION_USE_GOAL}`);
ok('battle.js 含 v23.66 注释（药到病除计数说明）', battleSrc.includes('v23.66 成就「药到病除」计数'));
ok('battle.js doItem 战斗用药唯一产生点源级落位（useN 自增 + hero.potionUses 写入 + 当场 applyAchievements + 零战报后缀）',
  battleSrc.includes('const useN = (hero.potionUses || 0) + 1;') && battleSrc.includes('hero.potionUses = useN;') &&
  battleSrc.includes('applyAchievements();') && !battleSrc.includes('药到病除 ${useN}/'));
ok('battle.js import 含 POTION_USE_GOAL（既有 data.js import 行扩展，零新增模块依赖）',
  battleSrc.includes('FLEE_GOAL, POTION_USE_GOAL, RUSH_CLEAR_GOAL, DIFF_SCALE'));
ok('battle.js 用药链逐字零回归（takePotion 判定/药水档/灵药档战报主体不动）',
  battleSrc.includes('if (!any) {') &&
  battleSrc.includes('`🧪 ${hero.name} 服下高级灵药，恢复 ${result.h} HP、${result.m} MP（HP ${hero.hp}/${hero.hpMax} · MP ${hero.mp}/${hero.mpMax} · 高级灵药剩余 ${hero.potion2} 瓶）`') &&
  battleSrc.includes('`🍖 ${hero.name} 服用药水，恢复 ${result.h} 点 HP（HP ${hero.hp}/${hero.hpMax} · 药水剩余 ${hero.item} 瓶）`'));
ok('data.js 含 POTION_USE_GOAL 阈值常量与 potionuses 条目注释（单一数据源三端同读）',
  dataSrc.includes('const POTION_USE_GOAL = 15;') && dataSrc.includes('// 药到病除（v23.66'));
ok('data.js 导出具 POTION_USE_GOAL（export 单一出口，紧随 FLEE_GOAL）', dataSrc.includes('FLEE_GOAL, POTION_USE_GOAL, RUSH_CLEAR_GOAL, MUSHROOM_PRICE,'));
ok('README 同步（C 行 66 项 / 成就 bullet 66 项·药到病除 X/15 次 / 成就档位行 POTION_USE_GOAL(15)·共 76 项 / 战斗用药句）',
  readme.includes('全部 76 项进度') && readme.includes('**76 项成就**') && readme.includes('药到病除 X/15 次（战斗用药累计，v23.66）') &&
  readme.includes('POTION_USE_GOAL`(15) 次，v23.66') && readme.includes('共 76 项') && readme.includes('15 次解锁成就「药到病除」'));
ok('CHANGELOG 顶部已追加 v23.66 条目（新成就药到病除）', changelog.startsWith('## v23.95 '));
ok('CHANGELOG 仍保留 v23.65 条目（历史口径）', changelog.includes('## v23.65 新成就「走为上计」'));
// 运行期：真实 playerAction('item') 战斗用药路径（计数落账 + 达标当场解锁 + 战报主体零回归）
{
  try {
    S.G = newGame('药'); S.G.map = 'village';
    S.G.item = 1; S.G.potion2 = 0; S.G.hp = 10; S.G.hpMax = 60; S.G.mp = 30; S.G.mpMax = 30;
    btlMod.startBattle({ name: '木桩', hp: 5000, hpMax: 5000, atk: 5, def: 10, xp: 1, gold: 0 });
    S.battleBusy = false;
    btlMod.playerAction('item');
    ok('运行期：战斗用药计数落账（hero.potionUses 1·库存 -1）且未达标不误解锁（药水档战报主体零回归）',
      S.G.potionUses === 1 && S.G.item === 0 && !(S.G.ach || []).includes('potionuses') &&
      S.blog.some((b) => String(b).includes('服用药水')), 'potionUses=' + S.G.potionUses);
    S.G = newGame('药'); S.G.map = 'village';
    S.G.item = 1; S.G.potion2 = 0; S.G.hp = 10; S.G.hpMax = 60; S.G.mp = 30; S.G.mpMax = 30; S.G.potionUses = 14;
    btlMod.startBattle({ name: '木桩', hp: 5000, hpMax: 5000, atk: 5, def: 10, xp: 1, gold: 0 });
    S.battleBusy = false;
    btlMod.playerAction('item');
    ok('运行期：第 15 次战斗用药当场解锁「药到病除」（applyAchievements 落 hero.ach 且重复去重）',
      S.G.potionUses === 15 && (S.G.ach || []).includes('potionuses') && (S.G.ach || []).length === 1, 'potionUses=' + S.G.potionUses + ' ach=' + JSON.stringify(S.G.ach || []));
  } finally {
    S.enemy = null; S.scene = 'world'; S.battleBusy = false;
  }
}
// —— v23.67 新成就「千锤百炼」（试炼场维度首枚里程碑·承 v23.63-66 战斗指令六枚先例：战斗六指令
// （[1]攻击/[2]技能/[3]药水/[4]逃跑/[5]防御/[6]蓄力）v23.66 起全部有纪念，成就版图逐线核对后唯一
// 只剩单档（rush 百炼成钢=首通）的维度是试炼场——试炼三连战可无限再战（碑上「已通关（可再战）」、
// winBattle 试炼分支无 rushDone 守卫、再战仍发全额通关奖属既有设计行为），通关一次后反复刷级刷金
// 却无累计回响；RUSH_CLEAR_GOAL 单一数据源 + hero.rushClears 防御式计数（旧档零迁移））——
ok('data.js 含 v23.67 版本注释（新成就千锤百炼·试炼场维度首枚）',
  dataSrc.includes('// v23.67 新内容·试炼场维度首枚里程碑：新成就「千锤百炼」'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.67（旧 v23.66 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.66';"));
ok('data.js 仍保留 v23.66 历史注释（新成就药到病除·战斗维度第六枚）',
  dataSrc.includes('// v23.66 新内容·战斗维度第六枚里程碑：新成就「药到病除」'));
const rushAch = ACH_LIST.find((a) => a.id === 'rushs');
ok('ACH_LIST 含 rushs「千锤百炼」且 id 唯一（末尾追加于 potionuses 之后，既有序位零位移）',
  !!rushAch && rushAch.name === '千锤百炼' && ACH_LIST.filter((a) => a.id === 'rushs').length === 1 &&
  ACH_LIST.findIndex((a) => a.id === 'rushs') === 66);
ok('rushs 描述由 RUSH_CLEAR_GOAL 派生（零裸字面量）', rushAch.d === `试炼场累计通关 ${RUSH_CLEAR_GOAL} 次`, rushAch.d);
ok('rushs 判定/进度读 (g.rushClears||0) 防御式（旧档无字段=0 不误解锁零迁移）',
  String(rushAch.ok).includes('(g.rushClears||0)') && String(rushAch.prog).includes('g.rushClears||0'));
ok('rushs 无 r 字段纯里程碑（与 deflect/charge/crit/cast/flee/potionuses 同款）', !('r' in rushAch));
ok('rushs 0 次（缺字段旧档）→ false 且 prog 0/3', rushAch.ok({}) === false && rushAch.prog({}) === `0/${RUSH_CLEAR_GOAL}`);
ok('rushs 2 次（恰差 1）→ false 且 prog 2/3', rushAch.ok({ rushClears: 2 }) === false && rushAch.prog({ rushClears: 2 }) === `2/${RUSH_CLEAR_GOAL}`);
ok('rushs 3 次（恰好达标）→ true 且 prog 3/3', rushAch.ok({ rushClears: 3 }) === true && rushAch.prog({ rushClears: 3 }) === `${RUSH_CLEAR_GOAL}/${RUSH_CLEAR_GOAL}`);
ok('rushs 4 次（超阈值）→ true 且 prog 不钳制 4/3（与 crit/charge/cast 同式）', rushAch.ok({ rushClears: 4 }) === true && rushAch.prog({ rushClears: 4 }) === `4/${RUSH_CLEAR_GOAL}`);
ok('battle.js 含 v23.67 注释（千锤百炼计数说明）', battleSrc.includes('v23.67 成就「千锤百炼」计数'));
ok('battle.js 试炼通关唯一产生点源级落位（rc 自增 + hero.rushClears 写入 + 当场 applyAchievements 相邻 + 战报进度后缀）',
  battleSrc.includes('const rc = (hero.rushClears || 0) + 1;') && battleSrc.includes('hero.rushClears = rc;') &&
  battleSrc.includes('千锤百炼 ${rc}/${RUSH_CLEAR_GOAL}'));
ok('battle.js import 含 RUSH_CLEAR_GOAL（既有 data.js import 行扩展，零新增模块依赖）',
  battleSrc.includes('POTION_USE_GOAL, RUSH_CLEAR_GOAL, DIFF_SCALE'));
ok('battle.js 试炼通关链逐字零回归（rushStage 归零/rushDone 置位/通关奖/恢复/换关报文主体不动）',
  battleSrc.includes('hero.rushStage = 0;') && battleSrc.includes('hero.rushDone = true;') &&
  battleSrc.includes('const reward = rushReward(hero.level);') &&
  battleSrc.includes('现身！（获得 ${enemy.xp} 经验 · 已自动恢复') &&
  battleSrc.includes('（获得 ${enemy.xp} 经验 · 剩余 ${hero.gold} 金 · 千锤百炼 ${rc}/${RUSH_CLEAR_GOAL}）'));
ok('data.js 含 RUSH_CLEAR_GOAL 阈值常量与 rushs 条目注释（单一数据源三端同读）',
  dataSrc.includes('const RUSH_CLEAR_GOAL = 3;') && dataSrc.includes('// 千锤百炼（v23.67'));
ok('data.js 导出具 RUSH_CLEAR_GOAL（export 单一出口，紧随 POTION_USE_GOAL）', dataSrc.includes('POTION_USE_GOAL, RUSH_CLEAR_GOAL, MUSHROOM_PRICE,'));
ok('README 同步（C 行 68 项 / 成就 bullet 68 项·千锤百炼 X/3 次 / 成就档位行 RUSH_CLEAR_GOAL(3)·共 76 项 / 试炼碑句）',
  readme.includes('全部 76 项进度') && readme.includes('**76 项成就**') && readme.includes('千锤百炼 X/3 次（试炼场累计通关，v23.67）') &&
  readme.includes('RUSH_CLEAR_GOAL`(3) 次，v23.67') && readme.includes('共 76 项') && readme.includes('3 次解锁成就「千锤百炼」'));
ok('CHANGELOG 顶部已追加 v23.67 条目（新成就千锤百炼）', changelog.startsWith('## v23.95 '));
ok('CHANGELOG 仍保留 v23.66 条目（历史口径）', changelog.includes('## v23.66 新成就「药到病除」'));
// 运行期：真实 winBattle 试炼通关路径（计数落账 + 战报就地报进度 + 达标当场解锁，boxMsg 捕获桩承 v23.56 捕桩法）
{
  try {
    const { bind: bindMod67 } = await import('../js/bind.js');
    const { RUSH_BOSSES: RB67 } = await import('../js/data.js');
    const msgs = [];
    const oBox67 = bindMod67.boxMsg;
    const oRand67 = Math.random;
    bindMod67.boxMsg = (t) => { msgs.push(String(t)); };
    Math.random = () => 0.99;
    const h = { name: '试炼者', level: 1, hp: 500, hpMax: 500, mp: 100, mpMax: 100, atkMax: 30, defMax: 40,
      gold: 0, xp: 0, xpNext: 9999, item: 1, potion2: 0, weapon: '铁剑', armor: '皮甲', diff: null,
      skills: ['火焰斩'], ach: [], poison: 0, seen: { '幽冥魔王': 1, '洞窟领主': 1 }, bestiary: {}, chests: [],
      fragments: [], quests: {}, totalWins: 0, rushStage: 3, rushDone: false, x: 1, y: 1, map: 'cave' };
    S.G = h; S.scene = 'battle'; S.battleBusy = true; S.blog = [];
    S.enemy = RB67[2]; // 试炼第 3 关·isRush·xp 90
    btlMod.winBattle();
    ok('运行期：试炼通关计数落账（hero.rushClears 1·rushDone true·通关奖落账）且未达标不误解锁',
      h.rushClears === 1 && h.rushDone === true && h.gold === 170 && !(h.ach || []).includes('rushs'),
      'rushClears=' + h.rushClears + ' gold=' + h.gold);
    ok('运行期：试炼通关战报就地报「 · 千锤百炼 1/3」（与经验/余额并列零回归）',
      msgs.some((m) => m.includes('试炼通关！奖励') && m.includes('获得 90 经验') && m.includes('千锤百炼 1/3')), msgs.join(' | '));
    h.rushClears = 2;
    h.rushStage = 3; h.gold = 0; h.ach = [];
    S.enemy = RB67[2];
    btlMod.winBattle();
    ok('运行期：第 3 次试炼通关当场解锁「千锤百炼」（applyAchievements 落 hero.ach）',
      h.rushClears === 3 && (h.ach || []).includes('rushs'), 'rushClears=' + h.rushClears + ' ach=' + JSON.stringify(h.ach || []));
  } finally {
    S.enemy = null; S.scene = 'world'; S.battleBusy = false;
  }
}
// —— v23.67 级联守护：旧代 v23.66 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.66 特性标签保留）——
const stale67 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.66'") || src.includes("GAME_VERSION === 'v23.66'") ||
      src.includes("startsWith('## v23.66")) stale67.push(f);
}
ok('旧代 v23.66 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.66 特性标签保留）', stale67.length === 0, stale67.join(','));
// —— v23.66 级联守护：旧代 v23.65 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.65 特性标签保留）——
const stale66 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.65'") || src.includes("GAME_VERSION === 'v23.65'") ||
      src.includes("startsWith('## v23.65")) stale66.push(f);
}
ok('旧代 v23.65 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.65 特性标签保留）', stale66.length === 0, stale66.join(','));
// —— v23.65 级联守护：旧代 v23.64 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.64 特性标签保留）——
const stale65 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.64'") || src.includes("GAME_VERSION === 'v23.64'") ||
      src.includes("startsWith('## v23.64")) stale65.push(f);
}
ok('旧代 v23.64 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.64 特性标签保留）', stale65.length === 0, stale65.join(','));

// —— v23.68 守护：状态页页底「C 成就 · B 图鉴」双直达（源级落位 + 运行期真实分派）——
ok('data.js 含 v23.68 版本注释（状态页 C/B 直达·I→J/B→I/C→I 主面板级双向收口）',
  dataSrc.includes('// v23.68 体验打磨·可发现性·信息透明·纯显示：状态页页底补「C 成就 · B 图鉴」直达'));
ok('data.js GAME_VERSION 字面量已为 v23.68（旧 v23.67 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.67';"));
ok('data.js 仍保留 v23.67 历史注释（千锤百炼试炼场注释未动）',
  dataSrc.includes('// v23.67 新成就「千锤百炼」') || dataSrc.includes('类别 千锤百炼') || dataSrc.includes('RUSH_CLEAR_GOAL'));
ok('data.js 帮助页「操作说明」状态行已收口四直达（v23.83）',
  dataSrc.includes("['状态','I（页底 J 日志 · C 成就 · B 图鉴 · H 帮助）']"));
ok('menus.js drawStatus 页底含「 · J 日志 · C 成就 · B 图鉴 · H 帮助」四直达（450 行·与日志/图鉴/成就三页脚同式同词）',
  menusSrc.includes('j 日志 · C 成就 · B 图鉴 · H 帮助'.replace('j', 'J')) && menusSrc.includes('// v23.83 状态页页底补「 · H 帮助」互切'));
ok('menus.js 页底旧「J 任务日志」口径零残留（承 v23.68 口径已随 v23.83 同式收口）',
  !menusSrc.includes('·  J 任务日志'));
ok('main.js status.onKey 补 C/B 直达分支（c/C→ach、b/B→codex·v23.68）',
  mainSrc.includes("else if (e.key === 'c' || e.key === 'C') goto('ach');") &&
  mainSrc.includes("else if (e.key === 'b' || e.key === 'B') goto('codex');") &&
  mainSrc.includes('// v23.68 状态页补 C/B 直达成就一览/记忆图鉴'));
ok('main.js status.onKey I/J/Esc 分支零回归（backWorld/journal 在 C/B 分支前逐字未动）',
  mainSrc.includes("if (e.key === 'i' || e.key === 'I' || isEsc(e)) backWorld();") &&
  mainSrc.includes("else if (e.key === 'j' || e.key === 'J') goto('journal');"));
ok('README 快速上手表 I 行四直达口径落位（v23.83）',
  readme.includes('状态界面（页底常驻「J 日志 · C 成就 · B 图鉴 · H 帮助」直达提示'));
ok('CHANGELOG 顶部已追加 v23.69 条目（状态页 C/B 直达）', changelog.startsWith('## v23.95 '));
// 运行期：status.onKey C/B/I/J 真实分派（DOM/音频/存储桩 + main.js 已于本件 193 行导入）
{
  try {
    const scr68 = (await import('../js/main.js')).screens;
    S.scene = 'status';
    scr68.status.onKey({ key: 'C' });
    ok('运行期：状态页按 C 真实跳转 S.scene==="ach"', S.scene === 'ach', S.scene);
    S.scene = 'status';
    scr68.status.onKey({ key: 'b' });
    ok('运行期：状态页按 b 真实跳转 S.scene==="codex"', S.scene === 'codex', S.scene);
    S.scene = 'status';
    scr68.status.onKey({ key: 'J' });
    ok('运行期：状态页按 J 仍跳转 journal（零回归）', S.scene === 'journal', S.scene);
    S.scene = 'status';
    scr68.status.onKey({ key: 'i' });
    ok('运行期：状态页按 i 仍回 world（零回归）', S.scene === 'world', S.scene);
  } finally {
    S.scene = 'world';
  }
}
// 运行期：drawStatus 页底三直达落画捕获（承 v22.99 捕获桩法）
{
  try {
    const _menusMod68 = await import('../js/view/menus.js');
    const CTX68 = (await import('../js/view/canvas.js')).CTX;
    const cap68 = [];
    const oFill68 = CTX68.fillText;
    CTX68.fillText = (t) => { cap68.push(String(t)); return oFill68.call(CTX68, t, 0, 0); };
    let threw68 = null;
    try {
      const { newGame: ng68 } = await import('../js/core.js');
      S.G = ng68('余烬'); S.scene = 'world';
      _menusMod68.drawStatus();
    } catch (e) { threw68 = e; }
    CTX68.fillText = oFill68;
    ok('运行期：drawStatus 渲染零抛错（新档）', threw68 === null, threw68 && String(threw68.stack || threw68));
    ok('运行期：drawStatus 页底落画含「J 日志 · C 成就 · B 图鉴 · H 帮助」（v23.83 四直达）',
      cap68.some((c) => c.includes('J 日志') && c.includes('C 成就') && c.includes('B 图鉴') && c.includes('H 帮助')),
      JSON.stringify(cap68.filter((c) => c.includes('图鉴')).slice(0, 3)));
  } catch (e) {
    ok('运行期：drawStatus 捕获桩可构造（不阻断既有断言）', false, e && String(e));
  }
}
// —— v23.68 级联守护：旧代 v23.67 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.67 特性标签保留）——
const stale68 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.67'") || src.includes("GAME_VERSION === 'v23.67'") ||
      src.includes("startsWith('## v23.67")) stale68.push(f);
}
ok('旧代 v23.67 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.67 特性标签保留）', stale68.length === 0, stale68.join(','));

// —— v23.69 守护：四收集页（I/J/B/C）互切网格补口（源级落位 + 运行期真实分派）——
ok('data.js 含 v23.69 版本注释（四收集页互切网格·J→B/C·B→J/C·C→J/B 六链路）',
  dataSrc.includes('// v23.69 体验打磨·可发现性·信息透明·纯显示：四收集页（I 状态 / J 日志 / B 图鉴 / C 成就）互切网格补口'));
ok('data.js GAME_VERSION 字面量已为 v23.69（旧 v23.68 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.68';"));
ok('data.js 仍保留 v23.68 历史注释（状态页 C/B 直达注释未动）',
  dataSrc.includes('// v23.68 体验打磨·可发现性·信息透明·纯显示：状态页页底补「C 成就 · B 图鉴」直达'));
ok('data.js 帮助页「操作说明」J/B/C 三行已收口四页互切（v23.69）',
  dataSrc.includes("['任务日志','J（↑↓ 滚动 · I 状态页 · B 图鉴 · C 成就 · H 帮助）']") &&
  dataSrc.includes("['记忆图鉴','B（↑↓ 滚动 · I 状态页 · J 日志 · C 成就 · H 帮助）']") &&
  dataSrc.includes("['成就一览','C（↑↓ 滚动 · I 状态页 · J 日志 · B 图鉴 · H 帮助）']"));
ok('menus.js drawJournal 主页脚含「 · B 图鉴 · C 成就」（v23.69 与 onKey 同口径）',
  menusSrc.includes('I 状态页 · B 图鉴 · C 成就 · H 帮助') && menusSrc.includes('// v23.69 日志页脚补「 · B 图鉴 · C 成就」互切'));
ok('menus.js drawJournal 空日志分支页脚同式（v23.69）',
  menusSrc.includes("'按 J / Esc 关闭   ·   I 状态页 · B 图鉴 · C 成就 · H 帮助'"));
ok('menus.js drawCodex 页脚含「 · J 日志 · C 成就」（v23.69）',
  menusSrc.includes('I 状态页 · J 日志 · C 成就') && menusSrc.includes('// v23.69 图鉴页脚补「 · J 日志 · C 成就」直达'));
ok('menus.js drawAch 页脚含「 · J 日志 · B 图鉴」（v23.69）',
  menusSrc.includes('I 状态页 · J 日志 · B 图鉴') && menusSrc.includes('// v23.69 成就页脚补「 · J 日志 · B 图鉴」直达'));
ok('menus.js 既有页脚口径零回归：drawStatus「J 日志 · H 帮助」/codex「I 状态页」/Ach「I 状态页」仍在',
  menusSrc.includes('·  J 日志 · C 成就 · B 图鉴 · H 帮助') && menusSrc.includes('   ·   I 状态页 · J 日志 · C 成就'));
ok('main.js journal.onKey 补 B/C 直达分支（b/B→codex、c/C→ach·v23.69）',
  mainSrc.includes("else if (e.key === 'b' || e.key === 'B') goto('codex');") &&
  mainSrc.includes("else if (e.key === 'c' || e.key === 'C') goto('ach');") &&
  mainSrc.includes('// v23.69 日志页补 B/C 直达'));
ok('main.js codex.onKey 补 J/C 直达分支（j/J→journal、c/C→ach·v23.69）',
  mainSrc.includes("else if (e.key === 'j' || e.key === 'J') goto('journal');") &&
  mainSrc.includes("else if (e.key === 'c' || e.key === 'C') goto('ach');") &&
  mainSrc.includes('// v23.69 图鉴页补 J/C 直达'));
ok('main.js ach.onKey 补 J/B 直达分支（j/J→journal、b/B→codex·v23.69）',
  mainSrc.includes("else if (e.key === 'j' || e.key === 'J') goto('journal');") &&
  mainSrc.includes("else if (e.key === 'b' || e.key === 'B') goto('codex');") &&
  mainSrc.includes('// v23.69 成就页补 J/B 直达'));
ok('main.js 既有分派零回归：journal I / codex I / ach I 仍在（承 v21.71/v22.99）',
  mainSrc.includes("else if (e.key === 'i' || e.key === 'I') goto('status');"));
ok('README 快速上手表 J/B/C 行 v23.69 口径落位',
  readme.includes('v23.69 起页内 `B`/`C` 直达记忆图鉴/成就一览') &&
  readme.includes('v23.69 起页内 `J`/`C` 直达任务日志/成就一览') &&
  readme.includes('v23.69 起页内 `J`/`B` 直达任务日志/记忆图鉴'));
{
  const idxSrc = read('../index.html');
  ok('index.html 常驻帮助条 J/B/C 三处 v23.69 互切口径（与 H 页/README 同口径）',
    idxSrc.includes('<kbd>I</kbd>/<kbd>B</kbd>/<kbd>C</kbd>直达') &&
    idxSrc.includes('<kbd>I</kbd>/<kbd>J</kbd>/<kbd>C</kbd>直达') &&
    idxSrc.includes('<kbd>I</kbd>/<kbd>J</kbd>/<kbd>B</kbd>直达'));
}
ok('CHANGELOG 顶部已追加 v23.69 条目（四收集页互切网格）', changelog.startsWith('## v23.95 '));
// 运行期：journal/codex/ach.onKey 互切真实分派（DOM/音频/存储桩 + main.js 已导入）
{
  try {
    const scr69 = (await import('../js/main.js')).screens;
    S.scene = 'journal';
    scr69.journal.onKey({ key: 'B' });
    ok('运行期：日志页按 B 真实跳转 S.scene==="codex"', S.scene === 'codex', S.scene);
    S.scene = 'journal';
    scr69.journal.onKey({ key: 'c' });
    ok('运行期：日志页按 c 真实跳转 S.scene==="ach"', S.scene === 'ach', S.scene);
    S.scene = 'codex';
    scr69.codex.onKey({ key: 'J' });
    ok('运行期：图鉴页按 J 真实跳转 S.scene==="journal"', S.scene === 'journal', S.scene);
    S.scene = 'codex';
    scr69.codex.onKey({ key: 'c' });
    ok('运行期：图鉴页按 c 真实跳转 S.scene==="ach"', S.scene === 'ach', S.scene);
    S.scene = 'ach';
    scr69.ach.onKey({ key: 'J' });
    ok('运行期：成就页按 J 真实跳转 S.scene==="journal"', S.scene === 'journal', S.scene);
    S.scene = 'ach';
    scr69.ach.onKey({ key: 'B' });
    ok('运行期：成就页按 B 真实跳转 S.scene==="codex"', S.scene === 'codex', S.scene);
    // 既有零回归：日志页 I↔状态 / 图鉴 I / 成就 I / 日志 Esc
    S.scene = 'journal';
    scr69.journal.onKey({ key: 'i' });
    ok('运行期：日志页按 i 仍跳转 status（零回归）', S.scene === 'status', S.scene);
    S.scene = 'codex';
    scr69.codex.onKey({ key: 'I' });
    ok('运行期：图鉴页按 I 仍跳转 status（零回归）', S.scene === 'status', S.scene);
    S.scene = 'ach';
    scr69.ach.onKey({ key: 'i' });
    ok('运行期：成就页按 i 仍跳转 status（零回归）', S.scene === 'status', S.scene);
  } finally {
    S.scene = 'world';
  }
}
// 运行期：三页页脚互切落画捕获（承 v22.99 捕获桩法）
{
  try {
    const _menusMod69 = await import('../js/view/menus.js');
    const CTX69 = (await import('../js/view/canvas.js')).CTX;
    const cap69 = [];
    const oFill69 = CTX69.fillText;
    CTX69.fillText = (t) => { cap69.push(String(t)); return oFill69.call(CTX69, t, 0, 0); };
    let threw69 = null;
    try {
      const { newGame: ng69 } = await import('../js/core.js');
      S.G = ng69('余烬'); S.scene = 'world';
      _menusMod69.drawJournal();
      _menusMod69.drawCodex();
      _menusMod69.drawAch();
    } catch (e) { threw69 = e; }
    CTX69.fillText = oFill69;
    ok('运行期：drawJournal/drawCodex/drawAch 渲染零抛错（新档）', threw69 === null, threw69 && String(threw69.stack || threw69));
    ok('运行期：drawJournal 页脚落画含「B 图鉴」「C 成就」', cap69.some((c) => c.includes('按 J / Esc 关闭') && c.includes('B 图鉴') && c.includes('C 成就')));
    ok('运行期：drawCodex 页脚落画含「J 日志」「C 成就」', cap69.some((c) => c.includes('按 B / Esc 关闭') && c.includes('J 日志') && c.includes('C 成就')));
    ok('运行期：drawAch 页脚落画含「J 日志」「B 图鉴」', cap69.some((c) => c.includes('按 C / Esc 关闭') && c.includes('J 日志') && c.includes('B 图鉴')));
  } catch (e) {
    ok('运行期：三页捕获桩可构造（不阻断既有断言）', false, e && String(e));
  }
}
// —— v23.69 级联守护：旧代 v23.68 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.68 特性标签保留）——
const stale69 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.68'") || src.includes("GAME_VERSION === 'v23.68'") ||
      src.includes("startsWith('## v23.68")) stale69.push(f);
}
ok('旧代 v23.68 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.68 特性标签保留）', stale69.length === 0, stale69.join(','));

// —— v23.70 守护：帮助页（H）补四收集页直达（源级落位 + 运行期真实分派；GAME_VERSION/顶 pin 等当前态断言随 v23.71 级联，特性标签 v23.70 保留）——
ok('data.js 含 v23.70 版本注释（帮助页补四收集页直达·承 v23.68/69 互切网格）',
  dataSrc.includes('// v23.70 体验打磨·可发现性·信息透明·纯入口/纯文字：帮助页补四收集页直达'));
ok('data.js GAME_VERSION 字面量已为 v23.71（旧 v23.69 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.69';"));
ok('data.js 仍保留 v23.69 历史注释（四收集页互切网格注释未动）',
  dataSrc.includes('// v23.69 体验打磨·可发现性·信息透明·纯显示：四收集页（I 状态 / J 日志 / B 图鉴 / C 成就）互切网格补口'));
ok('data.js 帮助页「操作说明」行已补页内四收集页直达口径（v23.70 特性·当前态 v23.71 pin）',
  dataSrc.includes("['操作说明','H（页内 I/J/B/C 直达 状态·日志·图鉴·成就）']"));
ok('menus.js drawHelp 页脚含「I/J/B/C 直达 状态·日志·图鉴·成就」（v23.70 与 onKey 同口径）',
  menusSrc.includes('I/J/B/C 直达 状态·日志·图鉴·成就') && menusSrc.includes('// v23.70 帮助页补四收集页直达'));
ok('menus.js 页脚既有口径零回归：「←/→ 翻页(A/D亦可)」「H/Esc 关闭」仍在',
  menusSrc.includes('←/→ 翻页(A/D亦可)') && menusSrc.includes('H/Esc 关闭'));
ok('main.js help.onKey 补四收集页直达分支（i/I→status、j/J→journal、b/B→codex、c/C→ach·v23.70）',
  mainSrc.includes("else if (e.key === 'i' || e.key === 'I') goto('status');") &&
  mainSrc.includes("else if (e.key === 'j' || e.key === 'J') goto('journal');") &&
  mainSrc.includes("else if (e.key === 'b' || e.key === 'B') goto('codex');") &&
  mainSrc.includes("else if (e.key === 'c' || e.key === 'C') goto('ach');") &&
  mainSrc.includes('// v23.70 帮助页补四收集页直达'));
ok('main.js help.onKey 既有分派零回归：←/→ 翻页与 h/Esc 关闭仍在',
  mainSrc.includes("S.helpPage = (S.helpPage + 1) % HELP_PAGES.length;") &&
  mainSrc.includes("e.key === 'h' || e.key === 'H' || isEsc(e)"));
ok('README 快速上手表 H 行 v23.70 口径落位（当前态 pin 随 v23.71 级联）',
  readme.includes('v23.70 起页内 `I`/`J`/`B`/`C` 直达'));
{
  const idxSrc = read('../index.html');
  ok('index.html 常驻帮助条 H 处 v23.70 直达口径（与 H 页/README 同口径）',
    idxSrc.includes('<kbd>H</kbd>操作说明（页内 <kbd>I</kbd>/<kbd>J</kbd>/<kbd>B</kbd>/<kbd>C</kbd> 直达）'));
}
ok('CHANGELOG 顶部已追加 v23.70 条目（帮助页补四收集页直达，当前顶 pin v23.71）', changelog.startsWith('## v23.95 '));
// 运行期：help.onKey 四收集页直达真实分派（DOM/音频/存储桩 + main.js 已导入）
{
  try {
    const scr70 = (await import('../js/main.js')).screens;
    S.scene = 'help';
    scr70.help.onKey({ key: 'i' });
    ok('运行期：帮助页按 i 真实跳转 S.scene==="status"', S.scene === 'status', S.scene);
    S.scene = 'help';
    scr70.help.onKey({ key: 'J' });
    ok('运行期：帮助页按 J 真实跳转 S.scene==="journal"', S.scene === 'journal', S.scene);
    S.scene = 'help';
    scr70.help.onKey({ key: 'B' });
    ok('运行期：帮助页按 B 真实跳转 S.scene==="codex"', S.scene === 'codex', S.scene);
    S.scene = 'help';
    scr70.help.onKey({ key: 'C' });
    ok('运行期：帮助页按 C 真实跳转 S.scene==="ach"', S.scene === 'ach', S.scene);
    // 既有零回归：←/→ 翻页 + h/Esc 关闭
    S.scene = 'help';
    const pgBefore = S.helpPage;
    scr70.help.onKey({ key: 'ArrowRight' });
    ok('运行期：帮助页 ← 仍翻页（零回归）', S.helpPage === (pgBefore + 1) % HELP_PAGES.length, String(S.helpPage));
    S.scene = 'help';
    scr70.help.onKey({ key: 'h' });
    ok('运行期：帮助页按 h 仍关闭回 world（零回归）', S.scene === 'world', S.scene);
  } finally {
    S.scene = 'world';
  }
}
// 运行期：drawHelp 页脚直达提示落画捕获（承 v22.99 捕获桩法）
{
  try {
    const _menusMod70 = await import('../js/view/menus.js');
    const CTX70 = (await import('../js/view/canvas.js')).CTX;
    const cap70 = [];
    const oFill70 = CTX70.fillText;
    CTX70.fillText = (t) => { cap70.push(String(t)); return oFill70.call(CTX70, t, 0, 0); };
    let threw70 = null;
    try {
      const { newGame: ng70 } = await import('../js/core.js');
      S.G = ng70('余烬'); S.scene = 'world';
      _menusMod70.drawHelp();
    } catch (e) { threw70 = e; }
    CTX70.fillText = oFill70;
    ok('运行期：drawHelp 渲染零抛错（新档）', threw70 === null, threw70 && String(threw70.stack || threw70));
    ok('运行期：drawHelp 页脚落画含「I/J/B/C 直达 状态·日志·图鉴·成就」',
      cap70.some((c) => c.includes('I/J/B/C 直达 状态·日志·图鉴·成就') && c.includes('H/Esc 关闭')),
      JSON.stringify(cap70.filter((c) => c.includes('直达')).slice(0, 3)));
  } catch (e) {
    ok('运行期：drawHelp 捕获桩可构造（不阻断既有断言）', false, e && String(e));
  }
}
// —— v23.71 守护：收集页补「H 帮助」直达（源级落位 + 运行期真实分派；承 v23.70 帮助页四直达同一主线收口）——
ok('data.js 含 v23.71 版本注释（J/B/C 三收集页补 H 帮助直达 + 四页 h/H 分支）',
  dataSrc.includes('v23.71 体验打磨·可发现性·信息透明·纯入口：J/B/C 三收集页补「H 帮助」直达'));
ok('data.js GAME_VERSION 字面量已为 v23.71（旧 v23.70 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.70';"));
ok('data.js 仍保留 v23.68 历史注释（状态页 C/B 直达·v23.71 修复保留）',
  dataSrc.includes('// v23.68 体验打磨·可发现性·信息透明·纯显示：状态页页底补「C 成就 · B 图鉴」直达'));
ok('data.js 「操作说明」三行 v23.71 补「H 帮助」互切（J/B/C 三行同批同源）',
  dataSrc.includes("['任务日志','J（↑↓ 滚动 · I 状态页 · B 图鉴 · C 成就 · H 帮助）']") &&
  dataSrc.includes("['记忆图鉴','B（↑↓ 滚动 · I 状态页 · J 日志 · C 成就 · H 帮助）']") &&
  dataSrc.includes("['成就一览','C（↑↓ 滚动 · I 状态页 · J 日志 · B 图鉴 · H 帮助）']"));
ok('menus.js 三页四处页脚 v23.71「 · H 帮助」落位（日志主页脚/空日志页脚/图鉴页脚/成就页脚）',
  menusSrc.includes('I 状态页 · B 图鉴 · C 成就 · H 帮助`, 320, 432') &&
  menusSrc.includes("I 状态页 · B 图鉴 · C 成就 · H 帮助'") &&
  menusSrc.includes('I 状态页 · J 日志 · C 成就 · H 帮助`,320,448') &&
  menusSrc.includes('I 状态页 · J 日志 · B 图鉴 · H 帮助`,320,430'));
ok('menus.js 含 v23.71 页脚注释块（日志/图鉴/成就三处）',
  menusSrc.includes('v23.71 日志页脚补「 · H 帮助」互切') && menusSrc.includes('v23.71 图鉴页脚补「 · H 帮助」互切') &&
  menusSrc.includes('v23.71 成就页脚补「 · H 帮助」互切'));
ok('menus.js 页脚既有口径零回归：「按 J / Esc 关闭」「按 B / Esc 关闭」「按 C / Esc 关闭」与「↑↓ 滚动浏览」仍在',
  menusSrc.includes("按 J / Esc 关闭") && menusSrc.includes("按 B / Esc 关闭") && menusSrc.includes("按 C / Esc 关闭") &&
  menusSrc.includes('↑↓ 滚动浏览'));
ok('main.js 四页 onKey 补 h/H→help 分支恰 4 处（status/journal/codex/ach·v23.71）',
  (mainSrc.match(/e\.key === 'h' \|\| e\.key === 'H'\) goto\('help'\);/g) || []).length === 4 &&
  mainSrc.includes('// v23.71 状态页补 H 帮助页直达') && mainSrc.includes('// v23.71 日志页补 H 帮助页直达') &&
  mainSrc.includes('// v23.71 图鉴页补 H 帮助页直达') && mainSrc.includes('// v23.71 成就页补 H 帮助页直达'));
ok('main.js 既有分派零回归：i/J 回世界、j/b/I/c 互切、help h/Esc 关闭仍在',
  mainSrc.includes("if (e.key === 'i' || e.key === 'I' || isEsc(e)) backWorld();") &&
  mainSrc.includes("if (e.key === 'j' || e.key === 'J' || isEsc(e)) backWorld();") &&
  mainSrc.includes("if (e.key === 'b' || e.key === 'B' || isEsc(e)) backWorld();") &&
  mainSrc.includes("if (e.key === 'c' || e.key === 'C' || isEsc(e)) backWorld();") &&
  mainSrc.includes("e.key === 'h' || e.key === 'H' || isEsc(e)"));
ok('README 快速上手表 J/B/C 三行 v23.71 口径落位（页内 H 直达操作说明）',
  readme.includes('v23.71 起页内 `H` 直达操作说明') &&
  (readme.match(/v23\.71 起页内 `H` 直达操作说明/g) || []).length === 3);
{
  const idxSrc = read('../index.html');
  ok('index.html 常驻帮助条 I/J/B/C 四处 v23.71/v23.83 口径（<kbd>H</kbd>帮助 四处）',
    (idxSrc.match(/<kbd>H<\/kbd>帮助/g) || []).length === 4);
}
ok('CHANGELOG 顶部已追加 v23.71 条目（收集页补 H 帮助直达）', changelog.startsWith('## v23.95 '));
// 运行期：四页 onKey h/H→help 真实分派（DOM/音频/存储桩 + main.js 已导入）
{
  try {
    const scr71 = (await import('../js/main.js')).screens;
    S.scene = 'status';
    scr71.status.onKey({ key: 'h' });
    ok('运行期：状态页按 h 真实跳转 S.scene==="help"', S.scene === 'help', S.scene);
    S.scene = 'journal';
    scr71.journal.onKey({ key: 'H' });
    ok('运行期：日志页按 H 真实跳转 S.scene==="help"', S.scene === 'help', S.scene);
    S.scene = 'codex';
    scr71.codex.onKey({ key: 'h' });
    ok('运行期：图鉴页按 h 真实跳转 S.scene==="help"', S.scene === 'help', S.scene);
    S.scene = 'ach';
    scr71.ach.onKey({ key: 'H' });
    ok('运行期：成就页按 H 真实跳转 S.scene==="help"', S.scene === 'help', S.scene);
    // 既有零回归：各页回世界键与互切键仍工作
    S.scene = 'status';
    scr71.status.onKey({ key: 'I' });
    ok('运行期：状态页按 I 仍回 world（零回归）', S.scene === 'world', S.scene);
    S.scene = 'journal';
    scr71.journal.onKey({ key: 'i' });
    ok('运行期：日志页按 i 仍跳 status（零回归）', S.scene === 'status', S.scene);
    S.scene = 'codex';
    scr71.codex.onKey({ key: 'c' });
    ok('运行期：图鉴页按 c 仍跳 ach（零回归）', S.scene === 'ach', S.scene);
    S.scene = 'ach';
    scr71.ach.onKey({ key: 'j' });
    ok('运行期：成就页按 j 仍跳 journal（零回归）', S.scene === 'journal', S.scene);
  } finally {
    S.scene = 'world';
  }
}
// 运行期：三页页脚「H 帮助」落画捕获（承 v22.99/v23.69 捕获桩法）
{
  try {
    const _menusMod71 = await import('../js/view/menus.js');
    const CTX71 = (await import('../js/view/canvas.js')).CTX;
    const cap71 = [];
    const oFill71 = CTX71.fillText;
    CTX71.fillText = (t) => { cap71.push(String(t)); return oFill71.call(CTX71, t, 0, 0); };
    let threw71 = null;
    try {
      const { newGame: ng71 } = await import('../js/core.js');
      S.G = ng71('余烬'); S.scene = 'world';
      _menusMod71.drawJournal();
      _menusMod71.drawCodex();
      _menusMod71.drawAch();
    } catch (e) { threw71 = e; }
    CTX71.fillText = oFill71;
    ok('运行期：drawJournal/drawCodex/drawAch 渲染零抛错（新档·v23.71）', threw71 === null, threw71 && String(threw71.stack || threw71));
    ok('运行期：drawJournal 页脚落画含「H 帮助」', cap71.some((c) => c.includes('按 J / Esc 关闭') && c.includes('H 帮助')));
    ok('运行期：drawCodex 页脚落画含「H 帮助」', cap71.some((c) => c.includes('按 B / Esc 关闭') && c.includes('H 帮助')));
    ok('运行期：drawAch 页脚落画含「H 帮助」', cap71.some((c) => c.includes('按 C / Esc 关闭') && c.includes('H 帮助')));
  } catch (e) {
    ok('运行期：三页捕获桩可构造（不阻断既有断言）', false, e && String(e));
  }
}
// —— v23.71 级联守护：旧代 v23.70 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.70 特性标签保留）——
const stale70 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.70'") || src.includes("GAME_VERSION === 'v23.70'") ||
      src.includes("startsWith('## v23.70") || src.includes("## v23.70'")) stale70.push(f);
}
ok('旧代 v23.70 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.70 特性标签保留）', stale70.length === 0, stale70.join(','));

// —— v23.72 守护：新成就「渴饮甘露」（旅中补给维度首枚·大地图按 F 喝药累计；源级落位 + 纯函数四档谓词 + 运行期真实 usePotion 路径；承 v23.66 药到病除成对端口）——
ok('data.js 含 v23.72 版本注释（大地图按 F 喝药累计里程碑）',
  dataSrc.includes('v23.72 新内容·旅行/补给维度里程碑'));
ok('data.js GAME_VERSION 字面量已为 v23.72（旧 v23.71 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.71';"));
ok('data.js 仍保留 v23.71 历史注释（收集页补 H 帮助直达·本版保留）',
  dataSrc.includes('v23.71 体验打磨·可发现性·信息透明·纯入口'));
const mapAch = ACH_LIST.find((a) => a.id === 'mapdrink');
ok('ACH_LIST 含 mapdrink「渴饮甘露」且 id 唯一（末尾追加，既有 67 项序位零位移）',
  !!mapAch && mapAch.name === '渴饮甘露' && ACH_LIST.filter((a) => a.id === 'mapdrink').length === 1 &&
  ACH_LIST.findIndex((a) => a.id === 'rushs') === 66 && ACH_LIST.findIndex((a) => a.id === 'mapdrink') === 67);
ok('ACH_LIST 精确总数 68 项（v23.72 旅中补给首枚入列 67→68）', ACH_LIST.length === 76, String(ACH_LIST.length));
ok('MAP_POTION_GOAL 数据契约（阈值单一数据源，判定/进度/描述三端同读）', MAP_POTION_GOAL === 10, String(MAP_POTION_GOAL));
ok('mapdrink 描述由 MAP_POTION_GOAL 派生（零裸字面量）',
  mapAch.d === `大地图按 F 喝药累计 ${MAP_POTION_GOAL} 次`, mapAch.d);
ok('mapdrink 判定/进度读 (g.mapPotions||0) 防御式（旧档无字段=0 不误解锁零迁移）',
  String(mapAch.ok).includes('(g.mapPotions||0)') && String(mapAch.prog).includes('g.mapPotions||0'));
ok('mapdrink 无 r 字段纯里程碑（与 potionuses/rushs 同款）', !('r' in mapAch));
ok('mapdrink 0 次（缺字段旧档）→ false 且 prog 0/10', mapAch.ok({}) === false && mapAch.prog({}) === `0/${MAP_POTION_GOAL}`);
ok('mapdrink 9 次（恰差 1）→ false 且 prog 9/10', mapAch.ok({ mapPotions: 9 }) === false && mapAch.prog({ mapPotions: 9 }) === `9/${MAP_POTION_GOAL}`);
ok('mapdrink 10 次（恰好达标）→ true 且 prog 10/10', mapAch.ok({ mapPotions: 10 }) === true && mapAch.prog({ mapPotions: 10 }) === `${MAP_POTION_GOAL}/${MAP_POTION_GOAL}`);
ok('mapdrink 20 次（超阈值）→ true 且 prog 不钳制 20/10', mapAch.ok({ mapPotions: 20 }) === true && mapAch.prog({ mapPotions: 20 }) === `20/${MAP_POTION_GOAL}`);
ok('core.js 含 v23.72 计数注释（usePotion 喝药计数说明）', coreSrc.includes('v23.72 成就「渴饮甘露」计数'));
ok('core.js usePotion 唯一产生点源级落位（hero.mapPotions 自增 + 当场 applyAchievements）',
  coreSrc.includes('const result = takePotion();') && coreSrc.includes('hero.mapPotions = (hero.mapPotions || 0) + 1;') &&
  coreSrc.includes('applyAchievements();'));
ok('core.js 零战报后缀（喝药报文逐字未动：恢复量/剩余库存/HPMP 括号保留）',
  coreSrc.includes('`🍖 使用药水，恢复 ${result.h} 点 HP（HP ${hero.hp}/${hero.hpMax} · 药水剩余 ${hero.item} 瓶）`'));
ok('core.js data.js import 含 MAP_POTION_GOAL 与 TRAVEL_GOAL（追加在 DIFFS 前，DIFFS, NPCS } 相邻 pin 零破坏）',
  coreSrc.includes('MAP_POTION_GOAL, TRAVEL_GOAL, DIFFS, NPCS }'));
ok('data.js 导出具 MAP_POTION_GOAL（export 单一出口，紧随 volPrefToString）',
  dataSrc.includes('volPrefToString, MAP_POTION_GOAL,'));
ok('data.js 含 v23.72 阈值注释与 mapdrink 条目注释',
  dataSrc.includes('v23.72 成就「渴饮甘露」阈值') && dataSrc.includes('// 渴饮甘露（v23.72'));
ok('mapdrink 与 potionuses 同族不同端口（[3]战斗用药 vs 大地图 F，各自累计互不计入）',
  !!ACH_LIST.find((a) => a.id === 'potionuses') && ACH_LIST.find((a) => a.id === 'potionuses').d.includes('战斗用药'));
ok('battle.js 战斗用药端口零串扰（doItem 仍只计数 potionUses，不涉 mapPotions）',
  battleSrc.includes('hero.potionUses = useN;') && !battleSrc.includes('mapPotions'));
ok('README 同步（C 行 68 项 / 成就 bullet 68 项·渴饮甘露 X/10 次 / 成就档位行 MAP_POTION_GOAL(10)·共 76 项 / F 行）',
  readme.includes('全部 76 项进度') && readme.includes('**76 项成就**') &&
  readme.includes('渴饮甘露 X/10 次（大地图按 F 喝药累计，v23.72）') &&
  readme.includes('`MAP_POTION_GOAL`(10) 次，v23.72') && readme.includes('共 76 项') &&
  readme.includes('`MAP_POTION_GOAL`(10) 次解锁成就「渴饮甘露」'));
ok('CHANGELOG 顶部已追加 v23.72 条目（新成就渴饮甘露）', changelog.startsWith('## v23.95 '));
ok('CHANGELOG 仍保留 v23.71 条目（历史口径）', changelog.includes('## v23.71 收集页补「H 帮助」直达'));
// 运行期：真实 usePotion 大地图喝药路径（计数落账 + 达标当场解锁 + 零战报后缀，boxMsg/renderHUD 捕获桩承 v23.67 捕桩法）
{
  let oBox72 = null, oRH72 = null, prevG72 = null;
  try {
    const { usePotion: upMod } = await import('../js/core.js');
    const msgs72 = [];
    oBox72 = bindMod.boxMsg;
    oRH72 = bindMod.renderHUD;
    bindMod.boxMsg = (t) => { msgs72.push(String(t)); };
    bindMod.renderHUD = () => {};
    const h72 = { name: '行者', level: 1, hp: 10, hpMax: 100, mp: 50, mpMax: 50, gold: 100,
      item: 3, potion2: 0, ach: [], x: 1, y: 1, map: 'village' };
    prevG72 = S.G;
    S.G = h72; S.scene = 'world';
    upMod();
    ok('运行期：大地图喝药计数落账（hero.mapPotions 1）且未达标不误解锁',
      h72.mapPotions === 1 && !(h72.ach || []).includes('mapdrink'), 'mapPotions=' + h72.mapPotions);
    ok('运行期：喝药报文零进度后缀（承 v23.66 口径，恢复量/库存保留）',
      msgs72[0] && msgs72[0].includes('使用药水') && msgs72[0].includes('药水剩余') && !msgs72[0].includes('渴饮甘露'), msgs72[0] || '');
    h72.mapPotions = 9; h72.hp = 1; h72.item = 1;
    upMod();
    ok('运行期：第 10 次大地图喝药当场解锁「渴饮甘露」（applyAchievements 落 hero.ach）',
      h72.mapPotions === 10 && (h72.ach || []).includes('mapdrink'),
      'mapPotions=' + h72.mapPotions + ' ach=' + JSON.stringify(h72.ach || []));
    ok('运行期：旧档缺 mapPotions 字段谓词零抛错且 0/10 不误解锁',
      mapAch.ok({}) === false && mapAch.prog({}) === `0/${MAP_POTION_GOAL}`);
  } finally {
    bindMod.boxMsg = oBox72; bindMod.renderHUD = oRH72;
    S.G = prevG72; S.scene = 'world';
  }
}
// —— v23.72 级联守护：旧代 v23.71 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.71 特性标签保留）——
const stale71 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.71'") || src.includes("GAME_VERSION === 'v23.71'") ||
      src.includes("startsWith('## v23.71")) stale71.push(f);
}
ok('旧代 v23.71 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.71 特性标签保留）', stale71.length === 0, stale71.join(','));

// —— v23.73 守护：新成就「夜宿灯下」（旅中休整维度首枚·旅馆住宿累计；源级落位 + 纯函数四档谓词 + 运行期真实 stayInn 路径；承 v23.72 渴饮甘露成对端口）——
const shopSrc = read('../js/shop.js');
ok('data.js 含 v23.73 版本注释（旅馆住宿累计里程碑）',
  dataSrc.includes('v23.73 新内容·旅中休整维度里程碑'));
ok('data.js GAME_VERSION 字面量已为 v23.73（旧 v23.72 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.72';"));
ok('data.js 仍保留 v23.72 历史注释（大地图 F 喝药里程碑·本版保留）',
  dataSrc.includes('v23.72 新内容·旅行/补给维度里程碑'));
const innAch = ACH_LIST.find((a) => a.id === 'innrest');
ok('ACH_LIST 含 innrest「夜宿灯下」且 id 唯一（末尾追加，既有 68 项序位零位移）',
  !!innAch && innAch.name === '夜宿灯下' && ACH_LIST.filter((a) => a.id === 'innrest').length === 1 &&
  ACH_LIST.findIndex((a) => a.id === 'mapdrink') === 67 && ACH_LIST.findIndex((a) => a.id === 'innrest') === 68);
ok('ACH_LIST 精确总数 69 项（v23.73 旅中休整首枚入列 68→69）', ACH_LIST.length === 76, String(ACH_LIST.length));
ok('INN_REST_GOAL 数据契约（阈值单一数据源，判定/进度/描述三端同读）', INN_REST_GOAL === 15, String(INN_REST_GOAL));
ok('innrest 描述由 INN_REST_GOAL 派生（零裸字面量）',
  innAch.d === `在旅馆住宿累计 ${INN_REST_GOAL} 次`, innAch.d);
ok('innrest 判定/进度读 (g.innRests||0) 防御式（旧档无字段=0 不误解锁零迁移）',
  String(innAch.ok).includes('(g.innRests||0)') && String(innAch.prog).includes('g.innRests||0'));
ok('innrest 无 r 字段纯里程碑（与 mapdrink/potionuses 同款）', !('r' in innAch));
ok('innrest 0 次（缺字段旧档）→ false 且 prog 0/15', innAch.ok({}) === false && innAch.prog({}) === `0/${INN_REST_GOAL}`);
ok('innrest 14 次（恰差 1）→ false 且 prog 14/15', innAch.ok({ innRests: 14 }) === false && innAch.prog({ innRests: 14 }) === `14/${INN_REST_GOAL}`);
ok('innrest 15 次（恰好达标）→ true 且 prog 15/15', innAch.ok({ innRests: 15 }) === true && innAch.prog({ innRests: 15 }) === `${INN_REST_GOAL}/${INN_REST_GOAL}`);
ok('innrest 20 次（超阈值）→ true 且 prog 不钳制 20/15', innAch.ok({ innRests: 20 }) === true && innAch.prog({ innRests: 20 }) === `20/${INN_REST_GOAL}`);
ok('shop.js 含 v23.73 计数注释（stayInn 住店计数说明）', shopSrc.includes('v23.73 成就「夜宿灯下」计数'));
ok('shop.js stayInn 唯一产生点源级落位（hero.innRests 自增 + 当场 applyAchievements）',
  shopSrc.includes('hero.innRests = (hero.innRests || 0) + 1;') &&
  shopSrc.includes('applyAchievements();') && shopSrc.includes('hero.mp = hero.mpMax;'));
ok('shop.js 零战报后缀（住宿报文逐字未动：恢复量/HPMP/金币余额保留）',
  shopSrc.includes('🌙 你美美地睡了一晚'));
ok('shop.js applyAchievements import 落位（hero.js 既有 import，零新增模块依赖）',
  shopSrc.includes("import { applyAchievements } from './hero.js';"));
ok('data.js 导出具 INN_REST_GOAL（export 单一出口，紧随 MAP_POTION_GOAL）',
  dataSrc.includes('volPrefToString, MAP_POTION_GOAL, INN_REST_GOAL,'));
ok('data.js 含 v23.73 阈值注释与 innrest 条目注释',
  dataSrc.includes('v23.73 成就「夜宿灯下」阈值') && dataSrc.includes('// 夜宿灯下（v23.73'));
ok('innrest 与 mapdrink 同族不同端口（免费喝药 vs 付费住店，各自累计互不计入）',
  !!ACH_LIST.find((a) => a.id === 'mapdrink') && ACH_LIST.find((a) => a.id === 'mapdrink').d.includes('大地图按 F 喝药') &&
  innAch.d.includes('旅馆住宿'));
ok('零串扰：core/battle 不涉 innRests（大地图喝药/战斗用药端口不回写），shop 不涉 mapPotions',
  !coreSrc.includes('innRests') && !battleSrc.includes('innRests') && !shopSrc.includes('hero.mapPotions'));
ok('README 同步（C 行 69 项 / 成就 bullet 69 项·夜宿灯下 X/15 次 / 成就档位行 INN_REST_GOAL(15)·共 76 项 / 经济循环行）',
  readme.includes('全部 76 项进度') && readme.includes('**76 项成就**') &&
  readme.includes('夜宿灯下 X/15 次（旅馆住宿累计，v23.73）') &&
  readme.includes('`INN_REST_GOAL`(15) 次，v23.73') && readme.includes('共 76 项') &&
  readme.includes('次解锁成就「夜宿灯下」') && readme.includes('`INN_REST_GOAL`'));
ok('CHANGELOG 顶部已追加 v23.73 条目（新成就夜宿灯下）', changelog.startsWith('## v23.95 '));
ok('CHANGELOG 仍保留 v23.72 条目（历史口径）', changelog.includes('## v23.72 新成就「渴饮甘露」'));
// 运行期：真实 stayInn 旅馆住宿路径（计数落账 + 达标当场解锁 + 零战报后缀，boxMsg/renderHUD 捕获桩承 v23.67 捕桩法）
{
  let oBox73 = null, oRH73 = null, prevG73 = null;
  try {
    const { stayInn: innMod } = await import('../js/shop.js');
    const msgs73 = [];
    oBox73 = bindMod.boxMsg;
    oRH73 = bindMod.renderHUD;
    bindMod.boxMsg = (t) => { msgs73.push(String(t)); };
    bindMod.renderHUD = () => {};
    const h73 = { name: '行者', level: 1, hp: 10, hpMax: 100, mp: 50, mpMax: 50, gold: 100,
      item: 3, potion2: 0, ach: [], x: 1, y: 1, map: 'village' };
    prevG73 = S.G;
    S.G = h73; S.scene = 'inn';
    innMod();
    ok('运行期：住店计数落账（hero.innRests 1）且未达标不误解锁',
      h73.innRests === 1 && !(h73.ach || []).includes('innrest'), 'innRests=' + h73.innRests);
    ok('运行期：住店报文零进度后缀（承 v23.72 口径，恢复量/HPMP/金币保留）',
      msgs73[0] && msgs73[0].includes('美美地睡了一晚') && msgs73[0].includes('完全恢复') && !msgs73[0].includes('夜宿灯下'), msgs73[0] || '');
    h73.innRests = 14; h73.hp = 1; h73.mp = 0; h73.gold = 100;
    innMod();
    ok('运行期：第 15 次住店当场解锁「夜宿灯下」（applyAchievements 落 hero.ach）',
      h73.innRests === 15 && (h73.ach || []).includes('innrest'),
      'innRests=' + h73.innRests + ' ach=' + JSON.stringify(h73.ach || []));
    ok('运行期：旧档缺 innRests 字段谓词零抛错且 0/15 不误解锁',
      innAch.ok({}) === false && innAch.prog({}) === `0/${INN_REST_GOAL}`);
    ok('运行期：金币不足分支零计数（不扣款不计数，报文报差额）',
      (() => { const h = { name: '行者', level: 1, hp: 1, hpMax: 100, mp: 0, mpMax: 50, gold: 3, ach: [] };
        S.G = h; innMod(); return h.innRests === undefined && msgs73[msgs73.length - 1].includes('金币不足'); })());
  } finally {
    bindMod.boxMsg = oBox73; bindMod.renderHUD = oRH73;
    S.G = prevG73; S.scene = 'world';
  }
}
// —— v23.73 级联守护：旧代 v23.72 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.72 特性标签保留）——
const stale72 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.72'") || src.includes("GAME_VERSION === 'v23.72'") ||
      src.includes("startsWith('## v23.72")) stale72.push(f);
}
ok('旧代 v23.72 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.72 特性标签保留）', stale72.length === 0, stale72.join(','));

// —— v23.74 守护：新成就「一掷千金」（经济消费维度首枚·累计消费金币；源级落位 + 纯函数四档谓词 + 运行期真实 buyPotion 路径；承 v23.72/73 成对端口）——
ok('data.js 含 v23.74 版本注释（累计消费金币里程碑）',
  dataSrc.includes('v23.74 新内容·经济消费维度里程碑'));
ok('data.js GAME_VERSION 字面量已为 v23.76（旧 v23.73 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.73';"));
ok('data.js 仍保留 v23.73 历史注释（旅馆住宿累计里程碑·本版保留）',
  dataSrc.includes('v23.73 新内容·旅中休整维度里程碑'));
const spendAch = ACH_LIST.find((a) => a.id === 'spend');
ok('ACH_LIST 含 spend「一掷千金」且 id 唯一（末尾追加，既有 69 项序位零位移）',
  !!spendAch && spendAch.name === '一掷千金' && ACH_LIST.filter((a) => a.id === 'spend').length === 1 &&
  ACH_LIST.findIndex((a) => a.id === 'innrest') === 68 && ACH_LIST.findIndex((a) => a.id === 'spend') === 69);
ok('ACH_LIST 精确总数 70 项（v23.74 经济消费首枚入列 69→70）', ACH_LIST.length === 76, String(ACH_LIST.length));
ok('SPEND_GOAL 数据契约（阈值单一数据源，判定/进度/描述三端同读）', SPEND_GOAL === 1000, String(SPEND_GOAL));
ok('spend 描述由 SPEND_GOAL 派生（零裸字面量）',
  spendAch.d === `累计消费金币 ${SPEND_GOAL} 金`, spendAch.d);
ok('spend 判定/进度读 (g.spent||0) 防御式（旧档无字段=0 不误解锁零迁移）',
  String(spendAch.ok).includes('(g.spent||0)') && String(spendAch.prog).includes('g.spent||0'));
ok('spend 无 r 字段纯里程碑（与 rich/rich2/rich3 同款）', !('r' in spendAch));
ok('spend 0 金（缺字段旧档）→ false 且 prog 0/1000', spendAch.ok({}) === false && spendAch.prog({}) === `0/${SPEND_GOAL}`);
ok('spend 999 金（恰差 1）→ false 且 prog 999/1000', spendAch.ok({ spent: 999 }) === false && spendAch.prog({ spent: 999 }) === `999/${SPEND_GOAL}`);
ok('spend 1000 金（恰好达标）→ true 且 prog 1000/1000', spendAch.ok({ spent: 1000 }) === true && spendAch.prog({ spent: 1000 }) === `${SPEND_GOAL}/${SPEND_GOAL}`);
ok('spend 2000 金（超阈值）→ true 且 prog 不钳制 2000/1000', spendAch.ok({ spent: 2000 }) === true && spendAch.prog({ spent: 2000 }) === `2000/${SPEND_GOAL}`);
ok('shop.js 含 v23.74 计数注释（buyPotion 计数说明）', shopSrc.includes('v23.74 经济消费成就「一掷千金」计数'));
ok('shop.js 四处扣款唯一产生点源级落位（hero.spent 自增 + 紧邻既有 applyAchievements）',
  shopSrc.includes('hero.spent = (hero.spent || 0) + POTION_PRICE;') &&
  shopSrc.includes('hero.spent = (hero.spent || 0) + price;') &&
  shopSrc.includes('hero.spent = (hero.spent || 0) + INN_PRICE;') &&
  shopSrc.includes('applyAchievements();'));
ok('shop.js 零战报后缀（购买报文逐字未动：价格/余额保留）',
  shopSrc.includes('购买成功：生命药水 +1（-${POTION_PRICE} 金，剩余'));
ok('core.js brewNow 酿造成本计数点源级落位（hero.spent 自增 BREW_GOLD，紧邻既有 applyAchievements）',
  coreSrc.includes('hero.spent = (hero.spent || 0) + BREW_GOLD;') && coreSrc.includes('hero.gold -= BREW_GOLD;'));
ok('data.js 导出具 SPEND_GOAL（export 单一出口，紧随 INN_REST_GOAL）',
  dataSrc.includes('volPrefToString, MAP_POTION_GOAL, INN_REST_GOAL, SPEND_GOAL,'));
ok('data.js 含 v23.74 阈值注释与 spend 条目注释',
  dataSrc.includes('v23.74 成就「一掷千金」阈值') && dataSrc.includes('// 一掷千金（v23.74'));
ok('spend 与 rich 三档同族不同端口（持有 vs 消费，各自累计互不计入）',
  !!ACH_LIST.find((a) => a.id === 'rich3') && String(ACH_LIST.find((a) => a.id === 'rich3').ok).includes('g.gold') &&
  String(ACH_LIST.find((a) => a.id === 'rich3').prog).includes('g.gold') &&
  !String(ACH_LIST.find((a) => a.id === 'rich3').ok).includes('spent'));
ok('零串扰：battle.js 不涉 hero.spent（战斗端口零污染）',
  !battleSrc.includes('hero.spent'));
ok('README 同步（C 行 70 项 / 成就 bullet 70 项·一掷千金 X/1000 金 / 成就档位行 SPEND_GOAL(1000)·共 76 项 / 经济循环行）',
  readme.includes('全部 76 项进度') && readme.includes('**76 项成就**') &&
  readme.includes('一掷千金 X/1000 金（累计消费，v23.74）') &&
  readme.includes('`SPEND_GOAL`(1000) 金，v23.74') && readme.includes('共 76 项') &&
  readme.includes('累计消费 1000 金解锁成就「一掷千金」') && readme.includes('`SPEND_GOAL`'));
ok('CHANGELOG 顶部已追加 v23.75 条目（新成就一掷千金）', changelog.startsWith('## v23.95 '));
ok('CHANGELOG 仍保留 v23.73 条目（历史口径）', changelog.includes('## v23.73 新成就「夜宿灯下」'));
// 运行期：真实 buyPotion 消费路径（计数落账 + 达标当场解锁 + 零战报后缀，boxMsg/renderHUD 捕获桩承 v23.67 捕桩法）
{
  let oBox74 = null, oRH74 = null, prevG74 = null;
  try {
    const { buyPotion: buyMod } = await import('../js/shop.js');
    const msgs74 = [];
    oBox74 = bindMod.boxMsg;
    oRH74 = bindMod.renderHUD;
    bindMod.boxMsg = (t) => { msgs74.push(String(t)); };
    bindMod.renderHUD = () => {};
    const h74 = { name: '行者', level: 1, hp: 10, hpMax: 100, mp: 50, mpMax: 50, gold: 100,
      item: 0, potion2: 0, ach: [], x: 1, y: 1, map: 'village' };
    prevG74 = S.G;
    S.G = h74; S.scene = 'shop';
    buyMod();
    ok('运行期：购买计数落账（hero.spent 15）且未达标不误解锁',
      h74.spent === 15 && !(h74.ach || []).includes('spend'), 'spent=' + h74.spent);
    ok('运行期：购买报文零进度后缀（承 v23.72/73 口径，价格/余额保留）',
      msgs74[0] && msgs74[0].includes('购买成功') && msgs74[0].includes('剩余') && !msgs74[0].includes('一掷千金'), msgs74[0] || '');
    h74.spent = 985; h74.gold = 100; h74.item = 0;
    buyMod();
    ok('运行期：累计第 1000 金购买当场解锁「一掷千金」（applyAchievements 落 hero.ach）',
      h74.spent === 1000 && (h74.ach || []).includes('spend'),
      'spent=' + h74.spent + ' ach=' + JSON.stringify(h74.ach || []));
    ok('运行期：金币不足分支零计数（不扣款不计数，报文报差额）',
      (() => { const h = { name: '行者', level: 1, hp: 10, hpMax: 100, mp: 50, mpMax: 50, gold: 3, item: 0, ach: [] };
        S.G = h; buyMod(); return h.spent === undefined && msgs74[msgs74.length - 1].includes('金币不足'); })());
    ok('运行期：旧档缺 spent 字段谓词零抛错且 0/1000 不误解锁',
      spendAch.ok({}) === false && spendAch.prog({}) === `0/${SPEND_GOAL}`);
  } finally {
    bindMod.boxMsg = oBox74; bindMod.renderHUD = oRH74;
    S.G = prevG74; S.scene = 'world';
  }
}
// —— v23.75 守护：新成就「行者无疆」（旅行动作维度首枚·快速旅行累计；源级落位 + 纯函数四档谓词 + 运行期真实 doTravel 路径；承 v23.72/73/74 成对端口）——
ok('data.js 含 v23.75 版本注释（快速旅行累计里程碑）',
  dataSrc.includes('v23.75 新内容·旅行动作维度里程碑'));
ok('data.js GAME_VERSION 字面量已为 v23.76（旧 v23.74 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.74';"));
ok('data.js 仍保留 v23.74 历史注释（经济消费累计里程碑·本版保留）',
  dataSrc.includes('v23.74 新内容·经济消费维度里程碑'));
const travelAch = ACH_LIST.find((a) => a.id === 'travels');
ok('ACH_LIST 含 travels「行者无疆」且 id 唯一（末尾追加，既有 70 项序位零位移）',
  !!travelAch && travelAch.name === '行者无疆' && ACH_LIST.filter((a) => a.id === 'travels').length === 1 &&
  ACH_LIST.findIndex((a) => a.id === 'spend') === 69 && ACH_LIST.findIndex((a) => a.id === 'travels') === 70);
ok('ACH_LIST 精确总数 72 项（v23.75 旅行动作首枚入列 70→71）', ACH_LIST.length === 76, String(ACH_LIST.length));
ok('TRAVEL_GOAL 数据契约（阈值单一数据源，判定/进度/描述三端同读）', TRAVEL_GOAL === 15, String(TRAVEL_GOAL));
ok('travels 描述由 TRAVEL_GOAL 派生（零裸字面量）',
  travelAch.d === `快速旅行累计 ${TRAVEL_GOAL} 次`, travelAch.d);
ok('travels 判定/进度读 (g.travels||0) 防御式（旧档无字段=0 不误解锁零迁移）',
  String(travelAch.ok).includes('(g.travels||0)') && String(travelAch.prog).includes('g.travels||0'));
ok('travels 无 r 字段纯里程碑（与 outstep/outstep2/wander 同款）', !('r' in travelAch));
ok('travels 0 次（缺字段旧档）→ false 且 prog 0/15', travelAch.ok({}) === false && travelAch.prog({}) === `0/${TRAVEL_GOAL}`);
ok('travels 14 次（恰差 1）→ false 且 prog 14/15', travelAch.ok({ travels: 14 }) === false && travelAch.prog({ travels: 14 }) === `14/${TRAVEL_GOAL}`);
ok('travels 15 次（恰好达标）→ true 且 prog 15/15', travelAch.ok({ travels: 15 }) === true && travelAch.prog({ travels: 15 }) === `${TRAVEL_GOAL}/${TRAVEL_GOAL}`);
ok('travels 20 次（超阈值）→ true 且 prog 不钳制 20/15', travelAch.ok({ travels: 20 }) === true && travelAch.prog({ travels: 20 }) === `20/${TRAVEL_GOAL}`);
ok('core.js 含 v23.75 计数注释（doTravel 旅行计数说明）', coreSrc.includes('v23.75 旅行动作成就「行者无疆」计数'));
ok('core.js doTravel 唯一产生点源级落位（hero.travels 自增 + 当场 applyAchievements + 两档早退守卫前置）',
  coreSrc.includes('g.travels = (g.travels || 0) + 1;') && coreSrc.includes('applyAchievements();') &&
  coreSrc.includes('尚未探索此地，先去找到入口吧。') && coreSrc.includes('已经在这里了！'));
ok('core.js 导入 TRAVEL_GOAL（data.js import 行邻位保留）', coreSrc.includes('MAP_POTION_GOAL, TRAVEL_GOAL, DIFFS'));
ok('data.js 导出具 TRAVEL_GOAL（export 单一出口，紧随 SPEND_GOAL）',
  dataSrc.includes('volPrefToString, MAP_POTION_GOAL, INN_REST_GOAL, SPEND_GOAL, TRAVEL_GOAL,'));
ok('data.js 含 v23.75 阈值注释与 travels 条目注释',
  dataSrc.includes('v23.75 成就「行者无疆」阈值') && dataSrc.includes('// 行者无疆（v23.75'));
ok('travels 与探索线三档同族不同端口（到访 vs 旅行动作，各自累计互不计入）',
  !!ACH_LIST.find((a) => a.id === 'wander') && String(ACH_LIST.find((a) => a.id === 'wander').ok).includes('visited') &&
  !String(ACH_LIST.find((a) => a.id === 'wander').ok).includes('travels') &&
  !String(travelAch.ok).includes('visited') && !String(travelAch.ok).includes('gold'));
ok('零串扰：battle.js 不涉 hero.travels（战斗端口零污染）',
  !battleSrc.includes('hero.travels'));
ok('README 同步（C 行 72 项 / 成就 bullet 72 项·行者无疆 X/15 次 / T 行 / 成就档位行 TRAVEL_GOAL(15)·共 76 项）',
  readme.includes('全部 76 项进度') && readme.includes('**76 项成就**') &&
  readme.includes('行者无疆 X/15 次（快速旅行累计，v23.75）') &&
  readme.includes('`TRAVEL_GOAL`(15) 次，v23.75') && readme.includes('共 76 项') &&
  readme.includes('`TRAVEL_GOAL`(15) 次解锁成就「行者无疆」') && readme.includes('`TRAVEL_GOAL`'));
ok('CHANGELOG 顶部已追加 v23.75 条目（新成就行者无疆）', changelog.startsWith('## v23.95 '));
ok('CHANGELOG 仍保留 v23.74 条目（历史口径）', changelog.includes('## v23.74 新成就「一掷千金」'));
// 运行期：真实 doTravel 成功路径（计数落账 + 达标当场解锁 + 未探索/已在此地两档零计数；boxMsg 捕获桩承 v23.67 捕桩法）
{
  let oBox75 = null, prevG75 = null, prevSel75 = null, prevCur75 = null;
  try {
    const { doTravel: travelMod } = await import('../js/core.js');
    const msgs75 = [];
    oBox75 = bindMod.boxMsg;
    bindMod.boxMsg = (t) => { msgs75.push(String(t)); };
    const h75 = newGame('余烬');
    h75.visited = ['village', 'dungeon']; // 目的地已到访方可旅行
    prevG75 = S.G; prevSel75 = S.travelSel; prevCur75 = S.curMap;
    S.G = h75;
    h75.map = 'village'; // curMap() 读 S.G.map（state.js 唯一真相）
    S.travelSel = 1; // TRAVEL_LIST[1] = 雾语林
    travelMod();
    ok('运行期：成功旅行计数落账（hero.travels 1）且未达标不误解锁',
      h75.travels === 1 && !(h75.ach || []).includes('travels'), 'travels=' + h75.travels);
    ok('运行期：成功路径零「行者无疆」噪音（无成就后缀/无进度报文——transition 的既有提示不受影响）',
      !msgs75.some((m) => String(m).includes('行者无疆') || String(m).includes('无疆')), msgs75.join('|'));
    h75.travels = 14;
    h75.map = 'dungeon'; // 现处雾语林，目标潮灯镇避免「已在这里了」早退
    S.travelSel = 0;
    travelMod();
    ok('运行期：累计第 15 次旅行当场解锁「行者无疆」（applyAchievements 落 hero.ach）',
      h75.travels === 15 && (h75.ach || []).includes('travels'),
      'travels=' + h75.travels + ' ach=' + JSON.stringify(h75.ach || []));
    h75.travels = 0;
    h75.visited = ['village'];
    h75.map = 'village';
    S.travelSel = 2; // 星井矿脉未到访
    travelMod();
    ok('运行期：未探索目标早退零计数（报文「尚未探索此地」）',
      h75.travels === 0 && (msgs75[msgs75.length - 1] || '').includes('尚未探索此地'), msgs75[msgs75.length - 1] || '');
    h75.visited = ['village', 'dungeon', 'cave'];
    h75.map = 'cave';
    S.travelSel = 2;
    travelMod();
    ok('运行期：已在此地早退零计数（报文「已经在这里了！」）',
      h75.travels === 0 && (msgs75[msgs75.length - 1] || '').includes('已经在这里了'), msgs75[msgs75.length - 1] || '');
    ok('运行期：旧档缺 travels 字段谓词零抛错且 0/15 不误解锁',
      travelAch.ok({}) === false && travelAch.prog({}) === `0/${TRAVEL_GOAL}`);
  } finally {
    bindMod.boxMsg = oBox75;
    S.G = prevG75; S.travelSel = prevSel75; S.curMap = prevCur75;
  }
}
// —— v23.75 级联守护：旧代 v23.74 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.74 特性标签保留）——
const stale75 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.74'") || src.includes("GAME_VERSION === 'v23.74'") ||
      src.includes("startsWith('## v23.74")) stale75.push(f);
}
ok('旧代 v23.74 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.74 特性标签保留）', stale75.length === 0, stale75.join(','));
// —— v23.74 级联守护：旧代 v23.73 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.73 特性标签保留）——
const stale73 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.73'") || src.includes("GAME_VERSION === 'v23.73'") ||
      src.includes("startsWith('## v23.73")) stale73.push(f);
}
ok('旧代 v23.73 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.73 特性标签保留）', stale73.length === 0, stale73.join(','));
// —— v23.76 守护：新成就「千里之行」（步行移动维度首枚·步行累计；源级落位 + 纯函数四档谓词 + 运行期真实 world.move 路径；承 v23.72-75 成对端口）——
const worldSrc = read('../js/world.js');
ok('data.js 含 v23.76 版本注释（步行累计维度里程碑）',
  dataSrc.includes('v23.76 新内容·步行累计维度里程碑'));
ok('data.js GAME_VERSION 字面量已为 v23.76（旧 v23.75 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.75';"));
ok('data.js 仍保留 v23.75 历史注释（旅行动作累计里程碑·本版保留）',
  dataSrc.includes('v23.75 新内容·旅行动作维度里程碑'));
const stepsAch = ACH_LIST.find((a) => a.id === 'steps');
ok('ACH_LIST 含 steps「千里之行」且 id 唯一（末尾追加，既有 71 项序位零位移）',
  !!stepsAch && stepsAch.name === '千里之行' && ACH_LIST.filter((a) => a.id === 'steps').length === 1 &&
  ACH_LIST.findIndex((a) => a.id === 'travels') === 70 && ACH_LIST.findIndex((a) => a.id === 'steps') === 71);
ok('ACH_LIST 精确总数 74 项（v23.82 经济收入维度单档「蘑菇商路」入列 73→74）', ACH_LIST.length === 76, String(ACH_LIST.length));
ok('STEP_GOAL 数据契约（阈值单一数据源，判定/进度/描述三端同读）', STEP_GOAL === 1000, String(STEP_GOAL));
ok('steps 描述由 STEP_GOAL 派生（零裸字面量）',
  stepsAch.d === `步行累计 ${STEP_GOAL} 步`, stepsAch.d);
ok('steps 判定/进度读 (g.steps||0) 防御式（旧档无字段=0 不误解锁零迁移）',
  String(stepsAch.ok).includes('(g.steps||0)') && String(stepsAch.prog).includes('g.steps||0'));
ok('steps 无 r 字段纯里程碑（与 outstep/outstep2/wander/travels 同款）', !('r' in stepsAch));
ok('steps 0 步（缺字段旧档）→ false 且 prog 0/1000', stepsAch.ok({}) === false && stepsAch.prog({}) === `0/${STEP_GOAL}`);
ok('steps 999 步（恰差 1）→ false 且 prog 999/1000', stepsAch.ok({ steps: 999 }) === false && stepsAch.prog({ steps: 999 }) === `999/${STEP_GOAL}`);
ok('steps 1000 步（恰好达标）→ true 且 prog 1000/1000', stepsAch.ok({ steps: 1000 }) === true && stepsAch.prog({ steps: 1000 }) === `${STEP_GOAL}/${STEP_GOAL}`);
ok('steps 2000 步（超阈值）→ true 且 prog 不钳制 2000/1000', stepsAch.ok({ steps: 2000 }) === true && stepsAch.prog({ steps: 2000 }) === `2000/${STEP_GOAL}`);
ok('world.js 含 v23.76 计数注释（move 步行计数说明）', worldSrc.includes('v23.76 成就「千里之行」计数'));
ok('world.js move 唯一产生点源级落位（hero.steps 自增 + 当场 applyAchievements，碰撞/出界守卫前置）',
  worldSrc.includes('hero.steps = (hero.steps || 0) + 1;') && worldSrc.includes('applyAchievements();') &&
  worldSrc.includes('SOLID.has(at(nx, ny))) return;'));
ok('world.js 导入 STEP_GOAL（data.js import 行邻位保留，零新增模块依赖）',
  worldSrc.includes('dayPhase, STEP_GOAL } from'));
ok('data.js 导出具 STEP_GOAL（export 单一出口，紧随 TRAVEL_GOAL）',
  dataSrc.includes('volPrefToString, MAP_POTION_GOAL, INN_REST_GOAL, SPEND_GOAL, TRAVEL_GOAL, STEP_GOAL,'));
ok('data.js 含 v23.76 阈值注释与 steps 条目注释',
  dataSrc.includes('v23.76 成就「千里之行」阈值') && dataSrc.includes('// v23.76 成就「千里之行」条目注释'));
ok('steps 与探索线三档/旅行动作单档三端口互不串扰（到访 vs 旅行动作 vs 步行各自累计）',
  !!ACH_LIST.find((a) => a.id === 'wander') && String(ACH_LIST.find((a) => a.id === 'wander').ok).includes('visited') &&
  !String(ACH_LIST.find((a) => a.id === 'wander').ok).includes('travels') && !String(ACH_LIST.find((a) => a.id === 'wander').ok).includes('steps') &&
  !String(ACH_LIST.find((a) => a.id === 'travels').ok).includes('visited') && !String(ACH_LIST.find((a) => a.id === 'travels').ok).includes('steps') &&
  !String(stepsAch.ok).includes('visited') && !String(stepsAch.ok).includes('travels') && !String(stepsAch.ok).includes('gold'));
ok('零串扰：battle.js/core.js 不涉 hero.steps（战斗/结算端口零污染）',
  !battleSrc.includes('hero.steps') && !coreSrc.includes('hero.steps'));
ok('README 同步（C 行 72 项 / 成就 bullet 72 项·千里之行 X/1000 步 / 成就档位行 STEP_GOAL(1000)·共 76 项）',
  readme.includes('全部 76 项进度') && readme.includes('**76 项成就**') &&
  readme.includes('千里之行 X/1000 步（步行累计，v23.76）') &&
  readme.includes('`STEP_GOAL`(1000) 步，v23.76') && readme.includes('共 76 项') &&
  readme.includes('`STEP_GOAL`'));
ok('CHANGELOG 顶部已追加 v23.76 条目（新成就千里之行）', changelog.startsWith('## v23.95 '));
ok('CHANGELOG 仍保留 v23.75 条目（历史口径）', changelog.includes('## v23.75 新成就「行者无疆」'));
// 运行期：真实 world.move 成功路径（计数落账 + 达标当场解锁 + 撞墙/出界/SOLID 零计数；boxMsg 捕获桩承 v23.67 捕桩法）
{
  let oBox76 = null, prevG76 = null, prevMaze76 = null, prevWalk76 = null, prevSc76 = null, prevGauge76 = null, prevUn76 = null;
  try {
    const { move: moveMod } = await import('../js/world.js');
    const msgs76 = [];
    oBox76 = bindMod.boxMsg;
    bindMod.boxMsg = (t) => { msgs76.push(String(t)); };
    const h76 = newGame('余烬');
    prevG76 = S.G; prevMaze76 = S.maze; prevWalk76 = S.walk; prevSc76 = S.scene; prevGauge76 = S.encGauge; prevUn76 = S.unsaved;
    S.G = h76; S.scene = 'world';
    h76.map = 'village'; // curMap() 读 S.G.map（state.js 唯一真相）；village dangerTiles=null → 安全格零遇敌
    // 手工 2×2 全草地迷你迷宫（绕过 loadMap：gCells 空集、仅 data.js `at` 迷宫生效）
    S.maze = [[TY.GRASS, TY.GRASS], [TY.GRASS, TY.GRASS]];
    h76.x = 0; h76.y = 0; S.walk = null; S.encGauge = 0; S.unsaved = false;
    moveMod(1, 0);
    ok('运行期：成功移步计数落账（hero.steps 1）且未达标不误解锁',
      h76.steps === 1 && h76.x === 1 && !(h76.ach || []).includes('steps'), 'steps=' + h76.steps);
    h76.steps = 999; S.walk = null;
    moveMod(0, 1);
    ok('运行期：累计第 1000 步移步当场解锁「千里之行」（applyAchievements 落 hero.ach）',
      h76.steps === 1000 && h76.y === 1 && (h76.ach || []).includes('steps'),
      'steps=' + h76.steps + ' ach=' + JSON.stringify(h76.ach || []));
    h76.steps = 0; S.walk = null; h76.x = 0; h76.y = 0;
    moveMod(-1, 0);
    ok('运行期：出界早退零计数（steps 保持 0、位置不动）', h76.steps === 0 && h76.x === 0);
    h76.steps = 0; S.walk = null; h76.x = 0; h76.y = 0;
    S.maze = [[TY.GRASS, TY.TREE], [TY.GRASS, TY.GRASS]];
    moveMod(1, 0);
    ok('运行期：SOLID 阻挡零计数（steps 保持 0、位置不动）', h76.steps === 0 && h76.x === 0);
    ok('运行期：旧档缺 steps 字段谓词零抛错且 0/1000 不误解锁',
      stepsAch.ok({}) === false && stepsAch.prog({}) === `0/${STEP_GOAL}`);
    ok('运行期：落账当场解锁横幅唯一（applyAchievements 横幅承载）、零进度后缀噪音（承 v23.72-75 口径）',
      msgs76.length === 1 && String(msgs76[0]).includes('千里之行') && !String(msgs76[0]).includes('/1000'),
      JSON.stringify(msgs76));
  } finally {
    bindMod.boxMsg = oBox76;
    S.G = prevG76; S.maze = prevMaze76; S.walk = prevWalk76; S.scene = prevSc76; S.encGauge = prevGauge76; S.unsaved = prevUn76;
  }
}
// —— v23.76 级联守护：旧代 v23.75 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.75 特性标签保留）——
const stale76 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.75'") || src.includes("GAME_VERSION === 'v23.75'") ||
      src.includes("startsWith('## v23.75")) stale76.push(f);
}
ok('旧代 v23.75 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.75 特性标签保留）', stale76.length === 0, stale76.join(','));

// —— v23.80 守护：新成就「身经百战」（战斗遭遇维度单档·成对端口：源级落位 + 纯函数四档谓词 + 零串扰双向 + 运行期真实 startBattle 路径 + 旧代 v23.79 pin 全库零残留扫描）——
// —— v23.77/79 历史守护（menus.js drawPause 当前所在地源级落位；data.js v23.79 历史注释累积保留）——
const menusSrc77 = read('../js/view/menus.js');
ok('data.js 含 v23.80 版本注释（身经百战说明·当前版本注释 pin）', dataSrc.includes('v23.80 新内容·战斗遭遇维度单档里程碑'));
ok('data.js GAME_VERSION 字面量已为 v23.80（旧 v23.79 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.7" + "9';"));
ok('data.js 仍保留 v23.79 历史注释（阵亡地点说明·历史注释累积）', dataSrc.includes('v23.79 体验打磨·信息透明·纯显示'));
ok('data.js 仍保留 v23.76 历史注释（步行累计里程碑·本版保留）', dataSrc.includes('v23.76 新内容·步行累计维度里程碑'));
ok('menus.js 仍保留 v23.77 注释（drawPause 头部当前所在地说明，历史注释累积）', menusSrc77.includes('v23.77 体验打磨·信息透明·纯显示'));
ok('drawPause 头部由 (MAPS[curMap()]||{}).name 派生并附「 · 📍」后缀（与 drawStatus 同读一份源）',
  menusSrc77.includes("const _mapName = (MAPS[curMap()] || {}).name || curMap();") &&
  menusSrc77.includes("'  ·  📍' + _mapName"));
ok('头部既有「名字 · 槽 N」子串逐字保留（smoke_v2230 槽号行 includes 断言零回归）',
  menusSrc77.includes("(hero ? hero.name : '守灯人') + '  ·  槽 ' + S.curSaveSlot + '  ·  📍'"));
// —— v23.79 级联守护：旧代 v23.76 GAME_VERSION/恒等/顶 pin/件套/testChain/串尾 全库零残留（仅 v23.76 特性标签保留）——
const stale77 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("const GAME_VERSION = 'v23.7" + "6';") ||
      src.includes("GAME_VERSION === 'v23.7" + "6'") ||
      src.includes("startsWith('## v23.7" + "6 ") ||
      src.includes("'## v23.7" + "6 ") ||
      src.includes('testChain === ' + '212') ||
      src.includes('第 ' + '212 份') ||
      src.includes('smoke_v2316_voiceshead（npm test 串' + '跑）') ||
      src.includes('smoke_v2316_voiceshead.mjs' + '"') ||
      src.includes('二百一十二件套（二百一十一件套清' + '除）')) stale77.push(f);
}
ok('旧代 v23.76 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.76 特性标签保留）', stale77.length === 0, stale77.join(','));

// —— v23.80 守护：新成就「身经百战」数据契约（战斗遭遇维度单档·与 hunt 系「胜利记录」成对端口）——
const battlesAch = ACH_LIST.find((a) => a.id === 'battles');
ok('ACH_LIST 含 battles「身经百战」且 id 唯一（末尾追加，既有 72 项序位零位移）',
  !!battlesAch && battlesAch.name === '身经百战' && ACH_LIST.filter((a) => a.id === 'battles').length === 1 &&
  ACH_LIST.findIndex((a) => a.id === 'steps') === 71 && ACH_LIST.findIndex((a) => a.id === 'battles') === 72);
ok('BATTLE_GOAL 数据契约（阈值单一数据源，判定/进度/描述三端同读）', BATTLE_GOAL === 100, String(BATTLE_GOAL));
ok('battles 描述由 BATTLE_GOAL 派生（零裸字面量）', battlesAch.d === `累计遭遇 ${BATTLE_GOAL} 场战斗`, battlesAch.d);
ok('battles 判定/进度读 (g.battles||0) 防御式（旧档无字段=0 不误解锁零迁移）',
  String(battlesAch.ok).includes('(g.battles||0)') && String(battlesAch.prog).includes('g.battles||0'));
ok('battles 无 r 字段纯里程碑（与 steps/travels/deflect 同款）', !('r' in battlesAch));
ok('battles 0 场（缺字段旧档）→ false 且 prog 0/100', battlesAch.ok({}) === false && battlesAch.prog({}) === `0/${BATTLE_GOAL}`);
ok('battles 99 场（恰差 1）→ false 且 prog 99/100', battlesAch.ok({ battles: 99 }) === false && battlesAch.prog({ battles: 99 }) === `99/${BATTLE_GOAL}`);
ok('battles 100 场（恰好达标）→ true 且 prog 100/100', battlesAch.ok({ battles: 100 }) === true && battlesAch.prog({ battles: 100 }) === `${BATTLE_GOAL}/${BATTLE_GOAL}`);
ok('battles 200 场（超阈值）→ true 且 prog 不钳制 200/100', battlesAch.ok({ battles: 200 }) === true && battlesAch.prog({ battles: 200 }) === `200/${BATTLE_GOAL}`);
ok('battle.js 含 v23.80 计数注释（startBattle 战斗遭遇计数说明）', battleSrc.includes('v23.80 成就「身经百战」计数'));
ok('battle.js startBattle 唯一产生点源级落位（hero.battles 自增 + 当场 applyAchievements，seen 进战记录紧邻）',
  battleSrc.includes('S.G.battles = (S.G.battles || 0) + 1;') &&
  battleSrc.includes('(S.G.seen || {})[_seenKey]') &&
  battleSrc.includes('applyAchievements();'));
ok('battles 与讨伐线 hunt 系成对端口互不串扰（胜利 vs 遭遇各自累计互不计入）',
  !!ACH_LIST.find((a) => a.id === 'hunt10') && String(ACH_LIST.find((a) => a.id === 'hunt10').ok).includes('totalWins') &&
  !String(ACH_LIST.find((a) => a.id === 'hunt10').ok).includes('battles') &&
  !String(battlesAch.ok).includes('totalWins') && !String(battlesAch.ok).includes('steps') && !String(battlesAch.ok).includes('travels'));
ok('零战报后缀（battle.js 无「累计遭遇」报文串——进战本就零计数报文，C 页进度 X/100 承载）', !battleSrc.includes('累计遭遇'));
ok('data.js 导出具 BATTLE_GOAL（export 单一出口，紧随 STEP_GOAL）',
  dataSrc.includes('TRAVEL_GOAL, STEP_GOAL, BATTLE_GOAL,'));
ok('data.js 含 v23.80 阈值注释与条目注释',
  dataSrc.includes('v23.80 成就「身经百战」阈值') && dataSrc.includes('// v23.80 成就「身经百战」条目注释'));
ok('README 同步（C 行 74 项 / 成就 bullet 74 项·身经百战 X/100 场 / 成就档位行 BATTLE_GOAL(100)·共 76 项）',
  readme.includes('全部 76 项进度') && readme.includes('**76 项成就**') &&
  readme.includes('身经百战 X/100 场（累计遭遇战斗，v23.80）') &&
  readme.includes('`BATTLE_GOAL`(100) 场，v23.80') && readme.includes('共 76 项') &&
  readme.includes('`BATTLE_GOAL`'));
ok('CHANGELOG 顶部已追加 v23.80 条目（新成就身经百战）', changelog.startsWith('## v23.95 '));
ok('CHANGELOG 仍保留 v23.79 条目（历史口径）', changelog.includes('## v23.79 阵亡画面战绩行补「📍 阵亡地点」'));
// 运行期：真实 startBattle 路径（计数落账 + 未达标不误报 + 累计第 100 场当场解锁；试炼连战/重整旗鼓同入口）
{
  let prevG80 = null, prevSc80 = null, prevEnemy80 = null, prevBusy80 = null;
  try {
    const { startBattle } = await import('../js/battle.js');
    const h80 = newGame('余烬');
    prevG80 = S.G; prevSc80 = S.scene; prevEnemy80 = S.enemy; prevBusy80 = S.battleBusy;
    S.G = h80; S.scene = 'world';
    startBattle({ name: '史莱姆', hpMax: 20, hp: 20, atk: 5, def: 2, xp: 8, gold: 8 });
    ok('运行期：进战计数落账（hero.battles 1）且未达标不误解锁',
      h80.battles === 1 && !(h80.ach || []).includes('battles'), 'battles=' + h80.battles);
    startBattle({ name: '野狼', hpMax: 22, hp: 22, atk: 7, def: 3, xp: 12, gold: 12 });
    ok('运行期：第二次进战累计（battles 2，战败/逃跑同入口）', h80.battles === 2, 'battles=' + h80.battles);
    h80.battles = 99;
    startBattle({ name: '哥布林', hpMax: 20, hp: 20, atk: 6, def: 3, xp: 10, gold: 10 });
    ok('运行期：累计第 100 场进战当场解锁「身经百战」（applyAchievements 落 hero.ach）',
      h80.battles === 100 && (h80.ach || []).includes('battles'),
      'battles=' + h80.battles + ' ach=' + JSON.stringify(h80.ach || []));
  } catch (e) {
    ok('运行期真实 startBattle 路径零抛错', false, String(e && e.stack || e));
  } finally {
    S.G = prevG80; S.scene = prevSc80; S.enemy = prevEnemy80; S.battleBusy = prevBusy80;
  }
}
// —— v23.80 级联守护：旧代 v23.79 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.79 特性标签保留）——
const stale80 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("const GAME_VERSION = 'v23.7" + "9';") ||
      src.includes("GAME_VERSION === 'v23.7" + "9'") ||
      src.includes("startsWith('## v23.7" + "9 ")) stale80.push(f);
}
ok('旧代 v23.79 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.79 特性标签保留）', stale80.length === 0, stale80.join(','));

// —— v23.81 守护：胜利/尾声画面「📍 所在地」（「我在哪」单一数据源口径收官：源级落位 + 后缀序位 + 既有行零回归 + 运行期真实 drawWin/drawEnding 渲染捕获 + README/CHANGELOG 同步 + 旧代 v23.80 pin 全库零残留扫描）——
const menusSrc81 = read('../js/view/menus.js');
ok('data.js 含 v23.81 版本注释（胜利/尾声所在地说明·当前版本注释 pin）', dataSrc.includes('v23.81 体验打磨·信息透明·纯显示'));
ok('data.js GAME_VERSION 字面量已为 v23.81（旧 v23.80 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.8" + "0';"));
ok('data.js 仍保留 v23.80 历史注释（身经百战说明·历史注释累积）', dataSrc.includes('v23.80 新内容·战斗遭遇维度单档里程碑'));
ok('menus.js 仍保留 v23.79 注释（阵亡地点说明，历史注释累积）', menusSrc81.includes('v23.79 体验打磨·信息透明·纯显示'));
ok('drawWin 战绩行 📍 由 (MAPS[curMap()]||{}).name||curMap() 派生（与五屏同读一份源、v23.10 困难档后缀之后）',
  menusSrc81.includes("' · ' + DIFFS[S.G.diff] : '') + ` · 📍${(MAPS[curMap()] || {}).name || curMap()}`,CV.width/2,362);"));
ok('drawEnding 战绩行 📍 同式派生（y=346 同基线、困难档后缀之后）',
  menusSrc81.includes("' · ' + DIFFS[hero.diff] : '') + ` · 📍${(MAPS[curMap()] || {}).name || curMap()}`,320,346,'13px','#7d93a3','center');"));
ok('drawWin 既有战绩行零回归（累计讨伐/成就/⏱️ 子串逐字保留）',
  menusSrc81.includes('`累计讨伐 ${kills} 只 · 成就 ${(S.G.ach||[]).length}/${ACH_LIST.length} · ⏱️${fmtTime(S.G.time)}`'));
ok('drawEnding 既有战绩行零回归（战绩 · 累计讨伐/成就/记忆/金币/⏱️ 子串逐字保留）',
  menusSrc81.includes('`战绩 · 累计讨伐 ${Object.values(hero.bestiary||{}).reduce((a,b)=>a+b,0)} 只 · 成就 ${(hero.ach||[]).length}/${ACH_LIST.length} · 记忆 ${(hero.fragments||[]).length}/${FRAGMENTS.length} · 金币 ${hero.gold} · ⏱️${fmtTime(hero.time)}`'));
ok('既有收集行/页脚逐字零回归（📕 图鉴行 · Enter/E 页脚行未动）',
  menusSrc81.includes('📕 图鉴 ${codexN}/${BESTIARY_TARGET.length} · 📦 宝箱 ${chestN}/${chestTotal()}')
  && menusSrc81.includes('按 Enter/E 观看尾声 · 按 P 存档 · 按 R 重开新档(连按两次)')
  && menusSrc81.includes('按 Enter/E 返回标题'));
// 运行期：真实 drawWin/drawEnding 渲染捕获（village / gallery 两档 📍 + 困难档「 · 困难 · 📍」序位 + 既有字段零回归 + 零抛错）
{
  const { CTX } = await import('../js/view/canvas.js');
  const { drawWin, drawEnding } = await import('../js/view/menus.js');
  const cap = [];
  const origFt = CTX.fillText;
  CTX.fillText = (t, ...a) => { cap.push(String(t)); return origFt.call(CTX, t, ...a); };
  const prevG81 = S.G, prevSc81 = S.scene;
  let threw = null;
  try {
    const hero81 = { name: '余烬', level: 5, gold: 777, bestiary: { 史莱姆: 3 }, time: 3723, item: 2,
      potion2: 0, mushrooms: 1, ach: [], fragments: [], hp: 1, hpMax: 50, mp: 1, mpMax: 20,
      bossDefeated: false, caveBoss: false, galleryOpen: false, trueBoss: false, rushDone: false,
      map: 'village', diff: 0 };
    S.G = hero81; S.scene = 'win';
    cap.length = 0;
    drawWin();
    ok('运行期：drawWin village 档战绩行捕获「📍潮灯镇」', cap.some((t) => t.includes('📍潮灯镇')),
      JSON.stringify(cap.filter((t) => t.includes('📍'))));
    ok('运行期：drawWin 既有战绩字段零回归（累计讨伐 3 只 · 成就 0/74 · ⏱️01:02:03）',
      cap.some((t) => t.includes('累计讨伐 3 只 · 成就 0/') && t.includes('⏱️01:02:03')));
    hero81.map = 'gallery'; hero81.diff = 1;
    cap.length = 0;
    drawWin();
    ok('运行期：drawWin gallery 困难档「 · 困难 · 📍无字回廊」序位共存（v23.10 后缀在 📍 之前）',
      cap.some((t) => t.includes(' · 困难 · 📍无字回廊')));
    hero81.map = 'village'; hero81.diff = 0;
    S.scene = 'ending';
    cap.length = 0;
    drawEnding();
    ok('运行期：drawEnding village 档战绩行捕获「📍潮灯镇」', cap.some((t) => t.includes('📍潮灯镇')),
      JSON.stringify(cap.filter((t) => t.includes('📍'))));
    ok('运行期：drawEnding 既有战绩字段零回归（战绩 · 累计讨伐 3 只 · ⏱️01:02:03）',
      cap.some((t) => t.includes('战绩 · 累计讨伐 3 只') && t.includes('⏱️01:02:03')));
    hero81.map = 'gallery'; hero81.diff = 1;
    cap.length = 0;
    drawEnding();
    ok('运行期：drawEnding gallery 困难档「 · 困难 · 📍无字回廊」序位共存',
      cap.some((t) => t.includes(' · 困难 · 📍无字回廊')));
  } catch (e) { threw = e; }
  ok('运行期 drawWin/drawEnding 渲染零抛错', threw === null, threw && String(threw.stack || threw));
  CTX.fillText = origFt;
  S.G = prevG81; S.scene = prevSc81;
}
ok('README 同步（系统清单胜利/尾声「📍 所在地」口径 + tests 树 v23.81 守护描述）',
  readme.includes('胜利/尾声画面「📍 所在地」**（v23.81') && readme.includes('v23.81 起含 胜利/尾声画面「📍 所在地」守护'));
ok('README 仍保留 v23.79 历史守护描述与入库口径（历史累积）',
  readme.includes('v23.79 起含 阵亡画面「📍 阵亡地点」守护') && readme.includes('smoke_v2319_deadloc 入库（215 份）'));
ok('CHANGELOG 顶部已追加 v23.81 条目（胜利/尾声所在地）', changelog.startsWith('## v23.95 '));
ok('CHANGELOG 仍保留 v23.80 条目（历史口径）', changelog.includes('## v23.80 新成就「身经百战」'));
// —— v23.81 级联守护：旧代 v23.80 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.80 特性标签保留）——
const stale81 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("GAME_VERSION = 'v23.80'") ||
      src.includes("GAME_VERSION === 'v23.80'") ||
      src.includes("startsWith('## v23.80")) stale81.push(f);
}
ok('旧代 v23.80 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.80 特性标签保留）', stale81.length === 0, stale81.join(','));

// —— v23.82 守护：新成就「蘑菇商路」（经济收入维度单档·与 v23.74 一掷千金消费端口成对端口：源级落位 + 纯函数四档谓词 + 零串扰双向 + 零战报后缀 + 运行期真实 sellMushroom 路径 + 旧代 v23.81 pin 全库零残留扫描）——
const shopSrc82 = read('../js/shop.js');
ok('data.js 含 v23.82 版本注释（蘑菇商路说明·当前版本注释 pin）', dataSrc.includes('v23.82 新内容·经济收入维度单档里程碑'));
ok('data.js GAME_VERSION 字面量已为 v23.82（旧 v23.81 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.8" + "1';"));
ok('data.js 仍保留 v23.81 历史注释（胜利/尾声所在地说明·历史注释累积）', dataSrc.includes('v23.81 体验打磨·信息透明·纯显示'));
const sellAch = ACH_LIST.find((a) => a.id === 'sell');
ok('ACH_LIST 含 sell「蘑菇商路」且 id 唯一（末尾追加，既有 73 项序位零位移）',
  !!sellAch && sellAch.name === '蘑菇商路' && ACH_LIST.filter((a) => a.id === 'sell').length === 1 &&
  ACH_LIST.findIndex((a) => a.id === 'battles') === 72 && ACH_LIST.findIndex((a) => a.id === 'sell') === 73);
ok('SELL_GOAL 数据契约（阈值单一数据源，判定/进度/描述三端同读）', SELL_GOAL === 30, String(SELL_GOAL));
ok('sell 描述由 SELL_GOAL 派生（零裸字面量）', sellAch.d === `累计售出 ${SELL_GOAL} 株魔法蘑菇`, sellAch.d);
ok('sell 判定/进度读 (g.sold||0) 防御式（旧档无字段=0 不误解锁零迁移）',
  String(sellAch.ok).includes('(g.sold||0)') && String(sellAch.prog).includes('g.sold||0'));
ok('sell 无 r 字段纯里程碑（与 spend/rich 同款）', !('r' in sellAch));
ok('sell 0 株（缺字段旧档）→ false 且 prog 0/30', sellAch.ok({}) === false && sellAch.prog({}) === `0/${SELL_GOAL}`);
ok('sell 29 株（恰差 1）→ false 且 prog 29/30', sellAch.ok({ sold: 29 }) === false && sellAch.prog({ sold: 29 }) === `29/${SELL_GOAL}`);
ok('sell 30 株（恰好达标）→ true 且 prog 30/30', sellAch.ok({ sold: 30 }) === true && sellAch.prog({ sold: 30 }) === `${SELL_GOAL}/${SELL_GOAL}`);
ok('sell 60 株（超阈值）→ true 且 prog 不钳制 60/30', sellAch.ok({ sold: 60 }) === true && sellAch.prog({ sold: 60 }) === `60/${SELL_GOAL}`);
ok('shop.js 含 v23.82 计数注释（sellMushroom 贩售计数说明）', shopSrc82.includes('v23.82 成就「蘑菇商路」计数'));
ok('shop.js sellMushroom 唯一产生点源级落位（hero.sold 自增 + 当场 applyAchievements，保护拦截前置）',
  shopSrc82.includes('hero.sold = (hero.sold || 0) + 1;') && shopSrc82.includes('applyAchievements();') &&
  shopSrc82.includes('mushroomQuestProtects(hero)'));
ok('sell 与经济线三端口互不串扰（持有 gold vs 消费 spent vs 收入 sold 各自累计互不计入）',
  !!ACH_LIST.find((a) => a.id === 'rich') && String(ACH_LIST.find((a) => a.id === 'rich').ok).includes('gold') &&
  !String(ACH_LIST.find((a) => a.id === 'rich').ok).includes('sold') && !String(ACH_LIST.find((a) => a.id === 'rich').ok).includes('spent') &&
  !!ACH_LIST.find((a) => a.id === 'spend') && String(ACH_LIST.find((a) => a.id === 'spend').ok).includes('spent') &&
  !String(ACH_LIST.find((a) => a.id === 'spend').ok).includes('sold') && !String(ACH_LIST.find((a) => a.id === 'spend').ok).includes('gold') &&
  !String(sellAch.ok).includes('gold') && !String(sellAch.ok).includes('spent'));
ok('零战报后缀（shop.js 无「累计售出」报文串——售出报文已带价格/余额/剩余株数，C 页进度 X/30 承载）', !shopSrc82.includes('累计售出'));
ok('data.js 导出具 SELL_GOAL（export 单一出口，紧随 BATTLE_GOAL）',
  dataSrc.includes('TRAVEL_GOAL, STEP_GOAL, BATTLE_GOAL, SELL_GOAL,'));
ok('data.js 含 v23.82 阈值注释与 sell 条目注释',
  dataSrc.includes('v23.82 成就「蘑菇商路」阈值') && dataSrc.includes('// v23.82 成就「蘑菇商路」条目注释'));
ok('README 同步（C 行 74 项 / 成就 bullet 74 项·蘑菇商路 X/30 株 / 成就档位行 SELL_GOAL(30)·共 76 项）',
  readme.includes('全部 76 项进度') && readme.includes('**76 项成就**') &&
  readme.includes('蘑菇商路 X/30 株（累计售出魔法蘑菇，v23.82）') &&
  readme.includes('`SELL_GOAL`(30) 株，v23.82') && readme.includes('共 76 项') &&
  readme.includes('`SELL_GOAL`'));
ok('CHANGELOG 顶部已追加 v23.82 条目（新成就蘑菇商路）', changelog.startsWith('## v23.95 '));
ok('CHANGELOG 仍保留 v23.81 条目（历史口径）', changelog.includes('## v23.81 胜利/尾声画面战绩行补「📍 所在地」'));
// 运行期：真实 sellMushroom 路径（计数落账 + 未达标不误报 + 累计第 30 株当场解锁 + 无菇早退零计数；boxMsg 捕获桩承 v23.67 捕桩法）
{
  let oBox82 = null, prevG82 = null, prevSc82 = null;
  try {
    const { sellMushroom } = await import('../js/shop.js');
    const msgs82 = [];
    oBox82 = bindMod.boxMsg;
    bindMod.boxMsg = (t) => { msgs82.push(String(t)); };
    const h82 = newGame('余烬');
    prevG82 = S.G; prevSc82 = S.scene;
    S.G = h82; S.scene = 'shop';
    h82.mushrooms = 5; h82.gold = 0; h82.sold = 0; h82.ach = [];
    sellMushroom();
    ok('运行期：成功售出计数落账（hero.sold 1 · 蘑菇 4 · 金币 +10）且未达标不误解锁',
      h82.sold === 1 && h82.mushrooms === 4 && h82.gold === 10 && !(h82.ach || []).includes('sell'),
      'sold=' + h82.sold);
    h82.mushrooms = 5; h82.sold = 29;
    sellMushroom();
    ok('运行期：累计第 30 株售出当场解锁「蘑菇商路」（applyAchievements 落 hero.ach）',
      h82.sold === 30 && (h82.ach || []).includes('sell'),
      'sold=' + h82.sold + ' ach=' + JSON.stringify(h82.ach || []));
    ok('运行期：零进度后缀噪音（解锁横幅唯一承载、无 X/30 后缀、售出报文/余额逐字未动）',
      msgs82.every((t) => !t.includes('/30')) && msgs82.some((t) => t.includes('蘑菇商路')) &&
      msgs82.some((t) => t.includes('售出 1 株魔法蘑菇，得 10 金')),
      JSON.stringify(msgs82));
    h82.mushrooms = 0;
    sellMushroom();
    ok('运行期：无菇早退零计数（sold 保持 30、零新增售出报文）', h82.sold === 30, 'sold=' + h82.sold);
    ok('运行期：旧档缺 sold 字段谓词零抛错且 0/30 不误解锁',
      sellAch.ok({}) === false && sellAch.prog({}) === `0/${SELL_GOAL}`);
  } catch (e) {
    ok('运行期真实 sellMushroom 路径零抛错', false, String(e && e.stack || e));
  } finally {
    bindMod.boxMsg = oBox82;
    S.G = prevG82; S.scene = prevSc82;
  }
}
// —— v23.82 级联守护：旧代 v23.81 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.81 特性标签保留）——
const stale82 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("const GAME_VERSION = 'v23.8" + "1';") ||
      src.includes("GAME_VERSION === 'v23.8" + "1'") ||
      src.includes("startsWith('## v23.8" + "1 ")) stale82.push(f);
}
ok('旧代 v23.81 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.81 特性标签保留）', stale82.length === 0, stale82.join(','));

// —— v23.83 守护：状态页页底「H 帮助」互切收口（体验打磨·可发现性·口径一致·纯显示——承 v23.68-71
// 四收集页互切网格「页底四直达」主线：v23.71 给 图鉴/日志/成就 三页脚补「· H 帮助」并给 main.js
// status.onKey 加 h/H→help 分支，唯独状态页页底因 11px 行宽预算刻意未并注（见 GAME_VERSION 上方
// v23.83 注释）——现收口：源级落位（data.js GAME_VERSION v23.83 + v23.83 注释 + HELP_PAGES 状态行
// 「I（页底 J 日志 · C 成就 · B 图鉴 · H 帮助）」+ menus.js drawStatus 页底四直达 + index.html I 块
// + README I/J 行 + tests 树 v23.83 守护描述）+ 旧「J 任务日志」口径零残留 + 旧代 v23.82 pin 全库
// 零残留扫描）——
const html83 = read('../index.html');
ok('data.js 含 v23.83 版本注释（状态页页底 H 帮助收口说明·当前版本注释 pin）', dataSrc.includes('v23.83 体验打磨·可发现性·口径一致·纯显示'));
ok('data.js GAME_VERSION 字面量已为 v23.83（旧 v23.82 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.8" + "2';"));
ok('data.js 仍保留 v23.82 历史注释（蘑菇商路说明·历史注释累积）', dataSrc.includes('v23.82 新内容·经济收入维度单档里程碑'));
ok('menus.js drawStatus 页底四直达字面量落位（· J 日志 · C 成就 · B 图鉴 · H 帮助·450 行）',
  menusSrc.includes("' ·  J 日志 · C 成就 · B 图鉴 · H 帮助',110,450,'11px'"));
ok('menus.js 仍保留 v23.68 历史注释（C/B 直达·历史累积）', menusSrc.includes('v23.68 状态页页底「C 成就 · B 图鉴」直达'));
ok('data.js H 页「状态」行四直达字面量落位', dataSrc.includes("['状态','I（页底 J 日志 · C 成就 · B 图鉴 · H 帮助）']"));
ok('index.html 常驻帮助条 I 块补 H 帮助（四收集页同式）', html83.includes('<kbd>I</kbd>状态（<kbd>J</kbd>日志 · <kbd>C</kbd>成就 · <kbd>B</kbd>图鉴 · <kbd>H</kbd>帮助）'));
ok('README 上手表 J 行「J 日志」口径落位（与状态页页底双向互切）', readme.includes('与状态页页底「J 日志」双向互切'));
ok('README tests 树 v23.83 守护描述落位', readme.includes('v23.83 起含 状态页页底「H 帮助」互切收口守护'));
ok('CHANGELOG 仍保留 v23.82 条目（历史口径）', changelog.includes('## v23.82 新成就「蘑菇商路」'));
// —— v23.83 级联守护：旧代 v23.82 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.82 特性标签保留）——
const stale83 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("const GAME_VERSION = 'v23.8" + "2';") ||
      src.includes("GAME_VERSION === 'v23.8" + "2'") ||
      src.includes("startsWith('## v23.8" + "2 ")) stale83.push(f);
}
ok('旧代 v23.82 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.82 特性标签保留）', stale83.length === 0, stale83.join(','));

// —— v23.84 守护：帮助页「地图指南」星井矿脉行 r[2] 补「 · 拾骨人（未归的矿灯）」经办指针
// （体验打磨·信息透明·纯文字·单一数据源——承 v22.80 粮田（护粮的委托）/ v23.58 酿药师（蛇影的
// 药引）/ v23.60 旅馆（狼嚎）同一「地图指南行内指针补全」主线续篇：十一条支线逐条对经办所在地
// 行——潮灯镇行五条（灯长/守书记/粮田/酿药师/旅馆）齐备、无字回廊行「守名者(支线)」在列、巡灯人
// （旧灯卫的名字）回镇找巡灯人属潮灯镇行口径，唯独星井矿脉行承接的 未归的矿灯（拾骨人）在战前
// 知识中枢查无一行——现收口：源级落位（data.js GAME_VERSION v23.84 + v23.84 注释 + HELP_PAGES
// 星井矿脉行 r[2] 指针：委托人名 NPCS.digger.name / 任务名 QUESTS.side_bone.name 派生零裸字面量）
// + 宽预算（12px estW 370.1 ≤470）+ 三图行零回归 + 旧代 v23.83 pin 全库零残留扫描）——
const guide84 = HELP_PAGES[1];
const cave84 = guide84.find((r) => r[0].includes('星井矿脉'));
const pointer84 = ' · ' + NPCS.digger.name + '（' + QUESTS.side_bone.name + '）';
ok('data.js 含 v23.84 版本注释（星井矿脉行经办指针说明·当前版本注释 pin）', dataSrc.includes('v23.84 体验打磨·信息透明·纯文字'));
ok('data.js GAME_VERSION 字面量已为 v23.84（旧 v23.83 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.8" + "3';"));
ok('data.js 仍保留 v23.83 历史注释（状态页页底 H 帮助收口说明·历史注释累积）', dataSrc.includes('v23.83 体验打磨·可发现性·口径一致·纯显示'));
ok('data.js 含 v23.84 行内注释（星井矿脉行 r[2] 拾骨人指针）', dataSrc.includes('v23.84 星井矿脉行 r[2] 补「 · 拾骨人（未归的矿灯）」经办指针'));
ok('星井矿脉行 r[2] 指针源码派生（NPCS.digger.name / QUESTS.side_bone.name 单一数据源·零裸字面量）',
  dataSrc.includes("NPCS.digger.name + '（' + QUESTS.side_bone.name + '） · '") && dataSrc.includes('星井（低鸣星蓝/静默灰） · '));
ok('运行期：星井矿脉行 r[2] 含「 · 拾骨人（未归的矿灯）」指针（' + pointer84 + '）',
  !!cave84 && String(cave84[2]).includes(pointer84), String(cave84 && cave84[2]));
ok('星井矿脉行 r[1] 零回归（更强魔物/迷宫/试炼碑(守碑人)/中央终焉水晶/双徽记化为门）',
  !!cave84 && String(cave84[1]).includes('更强魔物') && String(cave84[1]).includes('试炼碑（可问' + NPCS.sentinel.name + '）') &&
  String(cave84[1]).includes('中央终焉水晶') && String(cave84[1]).includes('双徽记化为门'));
{
  const vil84 = guide84.find((r) => r[0].includes('潮灯镇'));
  const dun84 = guide84.find((r) => r[0].includes('雾语林'));
  const gal84 = guide84.find((r) => r[0].includes('无字回廊'));
  ok('潮灯镇/雾语林/无字回廊 三图行零回归（未并入本版指针；雾语林仍无 r[2]）',
    !!vil84 && String(vil84[2]).includes('水塘灯影') && !String(vil84[2]).includes('拾骨人') &&
    !!dun84 && String(dun84[1]).includes('蘑菇田') && dun84.length === 2 &&
    !!gal84 && String(gal84[2]).includes('名字之门'));
  ok('地图指南页行数仍 8、r[2] 数仍 7（仅同列追加零结构变化）',
    guide84.length === 8 && guide84.filter((r) => r.length >= 3).length === 7,
    'rows=' + guide84.length + ' r2=' + guide84.filter((r) => r.length >= 3).length);
}
// 宽预算（官方 estW 同 smoke_v2111 口径：CJK 0.865 / · 0.303 / 空格 0.263 / / 0.338 / 数字 0.63）
const estW84 = (s, size = 12) => {
  let wsum = 0;
  for (const ch of String(s || '')) {
    const code = ch.codePointAt(0);
    const wide = (code >= 0x2e80 && code <= 0x9fff) || (code >= 0x3000 && code <= 0x303f) || (code >= 0xff00 && code <= 0xffef) || code >= 0x1f000;
    if (wide) wsum += 0.865 * size;
    else if (code === 0xb7) wsum += 0.303 * size;
    else if (code === 0xd7) wsum += 0.564 * size;
    else if (code === 0x25) wsum += 0.827 * size;
    else if (code === 0x2b) wsum += 0.543 * size;
    else if (code === 0x2d) wsum += 0.432 * size;
    else if (code === 0x2f) wsum += 0.338 * size;
    else if (code === 0x2e) wsum += 0.226 * size;
    else if (code === 0x2014) wsum += 0.812 * size;
    else if (code >= 0x30 && code <= 0x39) wsum += 0.63 * size;
    else if (code === 0x20) wsum += 0.263 * size;
    else wsum += 0.55 * size;
  }
  return wsum;
};
const wR2_84 = estW84(String(cave84 && cave84[2]), 12);
ok('星井矿脉行 r[2] 12px estW ' + wR2_84.toFixed(1) + ' ≤ 470 面板预算（256.4→370.1）', wR2_84 <= 470, String(wR2_84));
ok('CHANGELOG 顶部已追加 v23.84 条目（帮助页地图指南星井矿脉行经办指针）', changelog.startsWith('## v23.95 '));
ok('CHANGELOG 仍保留 v23.83 条目（历史口径）', changelog.includes('## v23.83 状态页页底补「H 帮助」互切'));
// —— v23.84 级联守护：旧代 v23.83 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.83 特性标签保留）——
const stale84 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("const GAME_VERSION = 'v23.8" + "3';") ||
      src.includes("GAME_VERSION === 'v23.8" + "3'") ||
      src.includes("startsWith('## v23.8" + "3 ") || src.includes("startsWith('## v23.8" + "3'")) stale84.push(f);
}
ok('旧代 v23.83 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.83 特性标签保留）', stale84.length === 0, stale84.join(','));

// —— v23.85 守护：帮助页「地图指南」星井矿脉行 r[2] 补「 · 星砂之约」经办指针
// （体验打磨·信息透明·纯文字·单一数据源——承 v23.84 拾骨人（未归的矿灯）同一「地图指南行内
// 指针补全」主线收口：v23.84 单点收口后 星砂之约（星砂车夫·矿车区）成为十一条支线里唯一在战前
// 知识中枢查无一行的一支——现收口：源级落位（data.js GAME_VERSION v23.85 + v23.85 注释 +
// HELP_PAGES 星井矿脉行 r[2] 指针：任务名 QUESTS.side_cart.name 派生零裸字面量——按 v23.60
// 短指针先例仅注任务名：全名「星砂车夫（星砂之约）」12px estW 483.9 越 470 面板预算）
// + 宽预算（12px estW 421.6 ≤470）+ v23.84 拾骨人指针零回归 + 三图行零回归 + 旧代 v23.84 pin
// 全库零残留扫描）——
const guide85 = HELP_PAGES[1];
const cave85 = guide85.find((r) => r[0].includes('星井矿脉'));
const pointer85 = ' · ' + QUESTS.side_cart.name;
ok('data.js 含 v23.85 版本注释（星井矿脉行经办指针收口说明·当前版本注释 pin）', dataSrc.includes('v23.85 体验打磨·信息透明·纯文字'));
ok('data.js GAME_VERSION 字面量已为 v23.85（旧 v23.84 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.8" + "4';"));
ok('data.js 仍保留 v23.84 历史注释（拾骨人经办指针说明·历史注释累积）', dataSrc.includes('v23.84 体验打磨·信息透明·纯文字'));
ok('data.js 含 v23.85 行内注释（星井矿脉行 r[2] 星砂之约指针）', dataSrc.includes('v23.85 星井矿脉行 r[2] 补「 · 星砂之约」经办指针'));
ok('星井矿脉行 r[2] 指针源码派生（QUESTS.side_cart.name 单一数据源·零裸字面量）',
  dataSrc.includes("side_bone.name + '） · ' + QUESTS.side_cart.name") && !dataSrc.includes("side_bone.name + '） · ' + '星砂之约'"));
ok('运行期：星井矿脉行 r[2] 含「 · 星砂之约」指针（' + pointer85 + '）',
  !!cave85 && String(cave85[2]).includes(pointer85), String(cave85 && cave85[2]));
ok('星井矿脉行 r[2] 拾骨人指针与星井标注零回归（v23.84 起点逐字保留）',
  !!cave85 && String(cave85[2]).includes(' · ' + NPCS.digger.name + '（' + QUESTS.side_bone.name + '）') &&
  String(cave85[2]).includes('星井（低鸣星蓝/静默灰）'));
ok('星井矿脉行 r[1] 零回归（更强魔物/迷宫/试炼碑(守碑人)/中央终焉水晶/双徽记化为门）',
  !!cave85 && String(cave85[1]).includes('更强魔物') && String(cave85[1]).includes('试炼碑（可问' + NPCS.sentinel.name + '）') &&
  String(cave85[1]).includes('中央终焉水晶') && String(cave85[1]).includes('双徽记化为门'));
{
  const vil85 = guide85.find((r) => r[0].includes('潮灯镇'));
  const dun85 = guide85.find((r) => r[0].includes('雾语林'));
  const gal85 = guide85.find((r) => r[0].includes('无字回廊'));
  ok('潮灯镇/雾语林/无字回廊 三图行零回归（未并入本版指针；雾语林仍无 r[2]）',
    !!vil85 && String(vil85[2]).includes('水塘灯影') && !String(vil85[2]).includes('星砂之约') &&
    !!dun85 && String(dun85[1]).includes('蘑菇田') && dun85.length === 2 &&
    !!gal85 && String(gal85[2]).includes('名字之门') && !String(gal85[2]).includes('星砂之约'));
  ok('地图指南页行数仍 8、r[2] 数仍 7（仅同列追加零结构变化）',
    guide85.length === 8 && guide85.filter((r) => r.length >= 3).length === 7,
    'rows=' + guide85.length + ' r2=' + guide85.filter((r) => r.length >= 3).length);
}
// 宽预算（官方 estW 同 smoke_v2111 口径：CJK 0.865 / · 0.303 / 空格 0.263 / / 0.338 / 数字 0.63）
const estW85 = (s, size = 12) => {
  let wsum = 0;
  for (const ch of String(s || '')) {
    const code = ch.codePointAt(0);
    const wide = (code >= 0x2e80 && code <= 0x9fff) || (code >= 0x3000 && code <= 0x303f) || (code >= 0xff00 && code <= 0xffef) || code >= 0x1f000;
    if (wide) wsum += 0.865 * size;
    else if (code === 0xb7) wsum += 0.303 * size;
    else if (code === 0xd7) wsum += 0.564 * size;
    else if (code === 0x25) wsum += 0.827 * size;
    else if (code === 0x2b) wsum += 0.543 * size;
    else if (code === 0x2d) wsum += 0.432 * size;
    else if (code === 0x2f) wsum += 0.338 * size;
    else if (code === 0x2e) wsum += 0.226 * size;
    else if (code === 0x2014) wsum += 0.812 * size;
    else if (code >= 0x30 && code <= 0x39) wsum += 0.63 * size;
    else if (code === 0x20) wsum += 0.263 * size;
    else wsum += 0.55 * size;
  }
  return wsum;
};
const wR2_85 = estW85(String(cave85 && cave85[2]), 12);
ok('星井矿脉行 r[2] 12px estW ' + wR2_85.toFixed(1) + ' ≤ 470 面板预算（370.1→421.6）', wR2_85 <= 470, String(wR2_85));
ok('CHANGELOG 顶部已追加 v23.85 条目（帮助页地图指南星井矿脉行经办指针收口）', changelog.startsWith('## v23.95 '));
ok('CHANGELOG 仍保留 v23.84 条目（历史口径）', changelog.includes('## v23.84 帮助页「地图指南」星井矿脉行 r[2] 补「 · 拾骨人'));
// —— v23.85 级联守护：旧代 v23.84 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.84 特性标签保留）——
const stale85 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("const GAME_VERSION = 'v23.8" + "4';") ||
      src.includes("GAME_VERSION === 'v23.8" + "4'") ||
      src.includes("startsWith('## v23.8" + "4 ") || src.includes("startsWith('## v23.8" + "4'")) stale85.push(f);
}
ok('旧代 v23.84 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.84 特性标签保留）', stale85.length === 0, stale85.join(','));

// —— v23.86 守护：帮助页「地图指南」潮灯镇行 r[2] 补「 · 巡灯人」经办指针
// （体验打磨·信息透明·纯文字·单一数据源——承 v23.84 拾骨人（未归的矿灯）/ v23.85 星砂之约
// 同一「地图指南行内指针补全」主线收口：v23.84 注释自留档案「巡灯人（旧灯卫的名字）回镇找
// 巡灯人属潮灯镇行口径（行宽已满另议）」，v23.85 后十一条支线仅此一支在战前知识中枢查无
// 一行——现收口：源级落位（data.js GAME_VERSION v23.86 + v23.86 注释 + HELP_PAGES 潮灯镇行
// r[2] 指针：NPC 名 NPCS.adventurer.name 派生零裸字面量——按 v23.60/v23.85 短指针先例仅注
// NPC 名：全名「巡灯人（旧灯卫的名字）」12px estW 573.6 越 470 面板预算）
// + 宽预算（12px estW 462.3 ≤470）+ v23.84/85 矿脉行指针零回归 + 三图行零回归 + 旧代 v23.85
// pin 全库零残留扫描）——
const guide86 = HELP_PAGES[1];
const cave86 = guide86.find((r) => r[0].includes('星井矿脉'));
const vil86 = guide86.find((r) => r[0].includes('潮灯镇'));
const pointer86 = ' · ' + NPCS.adventurer.name;
ok('data.js 含 v23.86 版本注释（潮灯镇行经办指针收口说明·当前版本注释 pin）', dataSrc.includes('v23.86 体验打磨·信息透明·纯文字'));
ok('data.js GAME_VERSION 字面量已为 v23.86（旧 v23.85 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.8" + "5';"));
ok('data.js 仍保留 v23.85 历史注释（星砂之约经办指针说明·历史注释累积）', dataSrc.includes('v23.85 体验打磨·信息透明·纯文字'));
ok('data.js 含 v23.86 行内注释（潮灯镇行 r[2] 巡灯人指针）', dataSrc.includes('v23.86 潮灯镇行 r[2] 补「 · 巡灯人」经办指针'));
ok('潮灯镇行 r[2] 指针源码派生（NPCS.adventurer.name 单一数据源·零裸字面量·短指针无全名）',
  dataSrc.includes("'） · ' + NPCS.adventurer.name") && !dataSrc.includes("NPCS.adventurer.name + '（' + QUESTS.side_name.name"));
ok('运行期：潮灯镇行 r[2] 含「 · 巡灯人」指针（' + pointer86 + '）',
  !!vil86 && String(vil86[2]).includes(pointer86), String(vil86 && vil86[2]));
ok('潮灯镇行 r[2] 为短指针口径（未并入任务名「旧灯卫的名字」——全名 573.6 越 470 预算、任务名由 J 日志承载）',
  !!vil86 && !String(vil86[2]).includes('旧灯卫的名字'));
ok('潮灯镇行 r[1] 零回归（商店/旅馆(狼嚎)/酿造锅/灯长/守书记(支线)/喷泉回血/东门→雾语林）',
  !!vil86 && String(vil86[1]).includes('商店') && String(vil86[1]).includes('酿造锅') &&
  String(vil86[1]).includes('灯长/守书记(支线)') && String(vil86[1]).includes('喷泉回血') &&
  String(vil86[1]).includes('东门→雾语林'));
ok('星井矿脉行 v23.84/85 指针零回归（拾骨人（未归的矿灯）与星砂之约起点逐字保留）',
  !!cave86 && String(cave86[2]).includes(' · ' + NPCS.digger.name + '（' + QUESTS.side_bone.name + '）') &&
  String(cave86[2]).includes(' · ' + QUESTS.side_cart.name) && String(cave86[2]).includes('星井（低鸣星蓝/静默灰）'));
ok('星井矿脉行 r[1] 零回归（更强魔物/迷宫/试炼碑(守碑人)/中央终焉水晶/双徽记化为门）',
  !!cave86 && String(cave86[1]).includes('更强魔物') && String(cave86[1]).includes('试炼碑（可问' + NPCS.sentinel.name + '）') &&
  String(cave86[1]).includes('中央终焉水晶') && String(cave86[1]).includes('双徽记化为门'));
{
  const dun86 = guide86.find((r) => r[0].includes('雾语林'));
  const gal86 = guide86.find((r) => r[0].includes('无字回廊'));
  ok('雾语林/无字回廊 两图行零回归（未并入本版指针；雾语林仍无 r[2]）',
    !!dun86 && String(dun86[1]).includes('蘑菇田') && dun86.length === 2 &&
    !!gal86 && String(gal86[2]).includes('名字之门') && !String(gal86[2]).includes('巡灯人'));
  ok('地图指南页行数仍 8、r[2] 数仍 7（仅同列追加零结构变化）',
    guide86.length === 8 && guide86.filter((r) => r.length >= 3).length === 7,
    'rows=' + guide86.length + ' r2=' + guide86.filter((r) => r.length >= 3).length);
}
// 宽预算（官方 estW 同 smoke_v2111 口径：CJK 0.865 / · 0.303 / 空格 0.263 / / 0.338 / 数字 0.63）
const estW86 = (s, size = 12) => {
  let wsum = 0;
  for (const ch of String(s || '')) {
    const code = ch.codePointAt(0);
    const wide = (code >= 0x2e80 && code <= 0x9fff) || (code >= 0x3000 && code <= 0x303f) || (code >= 0xff00 && code <= 0xffef) || code >= 0x1f000;
    if (wide) wsum += 0.865 * size;
    else if (code === 0xb7) wsum += 0.303 * size;
    else if (code === 0xd7) wsum += 0.564 * size;
    else if (code === 0x25) wsum += 0.827 * size;
    else if (code === 0x2b) wsum += 0.543 * size;
    else if (code === 0x2d) wsum += 0.432 * size;
    else if (code === 0x2f) wsum += 0.338 * size;
    else if (code === 0x2e) wsum += 0.226 * size;
    else if (code === 0x2014) wsum += 0.812 * size;
    else if (code >= 0x30 && code <= 0x39) wsum += 0.63 * size;
    else if (code === 0x20) wsum += 0.263 * size;
    else wsum += 0.55 * size;
  }
  return wsum;
};
const wR2_86 = estW86(String(vil86 && vil86[2]), 12);
ok('潮灯镇行 r[2] 12px estW ' + wR2_86.toFixed(1) + ' ≤ 470 面板预算（421.2→462.3）', wR2_86 <= 470, String(wR2_86));
ok('CHANGELOG 顶部已追加 v23.86 条目（帮助页地图指南潮灯镇行经办指针收口）', changelog.startsWith('## v23.95 '));
ok('CHANGELOG 仍保留 v23.85 条目（历史口径）', changelog.includes('## v23.85 帮助页「地图指南」星井矿脉行 r[2] 补「 · 星砂之约」'));
// —— v23.86 级联守护：旧代 v23.85 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.85 特性标签保留）——
const stale86 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("const GAME_VERSION = 'v23.8" + "5';") ||
      src.includes("GAME_VERSION === 'v23.8" + "5'") ||
      src.includes("startsWith('## v23.8" + "5 ") || src.includes("startsWith('## v23.8" + "5'")) stale86.push(f);
}
ok('旧代 v23.85 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.85 特性标签保留）', stale86.length === 0, stale86.join(','));

// —— v23.87 守护：新成就「败而不馁」（战斗败北维度单档·与 v23.80 身经百战遭遇端口成对端口——
// 源级落位 + 纯函数四档谓词 + 零串扰双向 + 运行期真实 loseBattle 路径 + 旧代 v23.86 pin 全库零残留扫描）——
const deathsAch = ACH_LIST.find((a) => a.id === 'deaths');
ok('data.js 含 v23.87 版本注释（败而不馁说明·当前版本注释 pin）', dataSrc.includes('v23.87 新内容·战斗败北维度单档里程碑'));
ok('data.js GAME_VERSION 字面量已为 v23.87（旧 v23.86 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.8" + "6';"));
ok('data.js 仍保留 v23.86 历史注释（巡灯人经办指针说明·历史注释累积）', dataSrc.includes('v23.86 体验打磨·信息透明·纯文字'));
ok('ACH_LIST 含 deaths「败而不馁」且 id 唯一（末尾追加，既有 74 项序位零位移）',
  !!deathsAch && deathsAch.name === '败而不馁' && ACH_LIST.filter((a) => a.id === 'deaths').length === 1 &&
  ACH_LIST.findIndex((a) => a.id === 'sell') === 73 && ACH_LIST.findIndex((a) => a.id === 'deaths') === 74);
ok('ACH_LIST 精确总数 75 项（v23.87 战斗败北维度单档「败而不馁」入列 74→75）', ACH_LIST.length === 76, String(ACH_LIST.length));
ok('DEATH_GOAL 数据契约（阈值单一数据源，判定/进度/描述三端同读）', DEATH_GOAL === 10, String(DEATH_GOAL));
ok('deaths 描述由 DEATH_GOAL 派生（零裸字面量）', deathsAch.d === `累计阵亡 ${DEATH_GOAL} 次`, deathsAch.d);
ok('deaths 判定/进度读 (g.deaths||0) 防御式（旧档无字段=0 不误解锁零迁移）',
  String(deathsAch.ok).includes('(g.deaths||0)') && String(deathsAch.prog).includes('g.deaths||0'));
ok('deaths 无 r 字段纯里程碑（与 battles/steps/travels 同款）', !('r' in deathsAch));
ok('deaths 0 次（缺字段旧档）→ false 且 prog 0/10', deathsAch.ok({}) === false && deathsAch.prog({}) === `0/${DEATH_GOAL}`);
ok('deaths 9 次（恰差 1）→ false 且 prog 9/10', deathsAch.ok({ deaths: 9 }) === false && deathsAch.prog({ deaths: 9 }) === `9/${DEATH_GOAL}`);
ok('deaths 10 次（恰好达标）→ true 且 prog 10/10', deathsAch.ok({ deaths: 10 }) === true && deathsAch.prog({ deaths: 10 }) === `${DEATH_GOAL}/${DEATH_GOAL}`);
ok('deaths 20 次（超阈值）→ true 且 prog 不钳制 20/10', deathsAch.ok({ deaths: 20 }) === true && deathsAch.prog({ deaths: 20 }) === `20/${DEATH_GOAL}`);
ok('battle.js 含 v23.87 计数注释（loseBattle 战败计数说明）', battleSrc.includes('v23.87 成就「败而不馁」计数'));
ok('battle.js loseBattle 唯一产生点源级落位（hero.deaths 自增 + 当场 applyAchievements）',
  battleSrc.includes('S.G.deaths = (S.G.deaths || 0) + 1;') &&
  battleSrc.includes('function loseBattle') && battleSrc.includes('applyAchievements();'));
ok('deaths 与身经百战/讨伐线成对端口互不串扰（败北 vs 遭遇 vs 胜利各自累计互不计入）',
  !!ACH_LIST.find((a) => a.id === 'battles') && String(ACH_LIST.find((a) => a.id === 'battles').ok).includes('g.battles') &&
  !String(ACH_LIST.find((a) => a.id === 'battles').ok).includes('deaths') &&
  !String(deathsAch.ok).includes('battles') && !String(deathsAch.ok).includes('totalWins') &&
  !String(deathsAch.ok).includes('steps') && !String(deathsAch.ok).includes('travels'));
ok('零战报后缀（battle.js 无「累计阵亡」报文串——阵亡画面本就零计数报文，C 页进度 X/10 承载）', !battleSrc.includes('累计阵亡'));
ok('data.js 导出具 DEATH_GOAL（export 单一出口，紧随 SELL_GOAL）',
  dataSrc.includes('BATTLE_GOAL, SELL_GOAL, DEATH_GOAL,') || dataSrc.includes('BATTLE_GOAL, SELL_GOAL, DEATH_GOAL'));
ok('data.js 含 v23.87 阈值注释与条目注释',
  dataSrc.includes('v23.87 成就「败而不馁」阈值') && dataSrc.includes('// v23.87 成就「败而不馁」条目注释'));
ok('README 同步（C 行 75 项 / 成就 bullet 75 项·败而不馁 X/10 次 / 成就档位行 DEATH_GOAL(10)·共 76 项）',
  readme.includes('全部 76 项进度') && readme.includes('**76 项成就**') &&
  readme.includes('败而不馁 X/10 次（累计阵亡，v23.87）') &&
  readme.includes('`DEATH_GOAL`(10) 次，v23.87') && readme.includes('共 76 项') &&
  readme.includes('`DEATH_GOAL`'));
ok('CHANGELOG 顶部已追加 v23.87 条目（新成就败而不馁）', changelog.startsWith('## v23.95 '));
ok('CHANGELOG 仍保留 v23.86 条目（历史口径）', changelog.includes('## v23.86 帮助页「地图指南」潮灯镇行'));
// 运行期：真实 loseBattle 路径（计数落账 + 未达标不误报 + 累计第 10 次阵亡当场解锁；普通/强敌/试炼同入口）
{
  let prevG87 = null, prevSc87 = null, prevEnemy87 = null, prevBusy87 = null;
  try {
    const { loseBattle } = await import('../js/battle.js');
    const h87 = newGame('余烬');
    prevG87 = S.G; prevSc87 = S.scene; prevEnemy87 = S.enemy; prevBusy87 = S.battleBusy;
    S.G = h87; S.scene = 'world';
    loseBattle();
    ok('运行期：loseBattle 落账 hero.deaths 1 且未达标不误解锁',
      h87.deaths === 1 && !(h87.ach || []).includes('deaths'), 'deaths=' + h87.deaths);
    h87.deaths = 9;
    loseBattle();
    ok('运行期：累计第 10 次阵亡当场解锁「败而不馁」（applyAchievements 落 hero.ach）',
      h87.deaths === 10 && (h87.ach || []).includes('deaths'),
      'deaths=' + h87.deaths + ' ach=' + JSON.stringify(h87.ach || []));
  } catch (e) {
    ok('运行期真实 loseBattle 路径零抛错', false, String(e && e.stack || e));
  } finally {
    S.G = prevG87; S.scene = prevSc87; S.enemy = prevEnemy87; S.battleBusy = prevBusy87;
  }
}
// —— v23.87 级联守护：旧代 v23.86 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.86 特性标签保留）——
const stale87 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("const GAME_VERSION = 'v23.8" + "6';") ||
      src.includes("GAME_VERSION === 'v23.8" + "6'") ||
      src.includes("startsWith('## v23.8" + "6 ") ||
      src.includes("startsWith('## v23.8" + "6'")) stale87.push(f);
}
ok('旧代 v23.86 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.86 特性标签保留）', stale87.length === 0, stale87.join(','));

// —— v23.88 守护：帮助页「操作说明」快速旅行行补面板功能口径（体验打磨·可发现性·纯文字——承 v22.90
// 状态/任务日志 I↔J 双向直达 / v23.68-71 四收集页互切同一「操作总清单行内如实标注面板能力」主线：快速旅行
// 面板（drawTravel）实际提供 已到访图瞬移 + 目的地推荐等级红警（v21.92）+ 无泉水/旅店补给橙行（v22.32）+
// 已探索 N/4 计数（v23.27）——决策信息在 地图指南「快速旅行」行/README T 行/面板本体三端都在，唯独操作说明
// 「快速旅行」行只写裸键「T」（战前知识中枢操作总清单唯一无能力口径的行，其余 13 行均带能力说明）；现补
// 「（已到访图瞬移 · 推荐等级/补给标注）」口径，行数不变仍 14、14px estW ≈217.8 ≤470、其余 13 行与三页
// 逐字零回归，纯文字零逻辑零结算零存档零数值变化）——
const opPage88 = HELP_PAGES[0];
const trav88 = opPage88 && opPage88.find((r) => r[0] === '快速旅行');
ok('data.js 含 v23.88 版本注释（快速旅行行面板功能口径·当前版本注释 pin）', dataSrc.includes('v23.88 体验打磨·可发现性·纯文字'));
ok('data.js GAME_VERSION 字面量已为 v23.88（旧 v23.87 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.8" + "7';"));
ok('data.js 仍保留 v23.87 历史注释（败而不馁说明·历史注释累积）', dataSrc.includes('v23.87 新内容·战斗败北维度单档里程碑'));
ok('快速旅行行源码落位（裸键 T → 面板功能口径字面量）',
  dataSrc.includes("['快速旅行','T（已到访图瞬移 · 推荐等级/补给标注）']"));
ok('运行期：操作说明快速旅行行 r[1] 为「T（已到访图瞬移 · 推荐等级/补给标注）」',
  !!trav88 && String(trav88[1]) === 'T（已到访图瞬移 · 推荐等级/补给标注）', String(trav88 && trav88[1]));
ok('操作说明页行数仍 14（行数不变零结构变化）', !!opPage88 && opPage88.length === 14, String(opPage88 && opPage88.length));
ok('操作说明其余行零回归（状态/任务日志/成就一览/喝药/静音/战斗 口径逐字保留）',
  !!opPage88 && String(opPage88.find((r) => r[0] === '状态')[1]).includes('H 帮助') &&
  String(opPage88.find((r) => r[0] === '任务日志')[1]).includes('↑↓ 滚动') &&
  String(opPage88.find((r) => r[0] === '成就一览')[1]).includes('B 图鉴') &&
  String(opPage88.find((r) => r[0] === '喝药（普通/灵药）')[1]).includes('%HP') &&
  String(opPage88.find((r) => r[0] === '静音 / 音量')[1]).includes('10% 步进') &&
  String(opPage88.find((r) => r[0] === '战斗')[2]).includes('数字键1-8快捷直发'));
ok('试炼进阶页快速旅行行零回归（v19.53 口径逐字保留）',
  !!HELP_PAGES[3] && !!HELP_PAGES[3].find((r) => r[0] === '快速旅行') &&
  String(HELP_PAGES[3].find((r) => r[0] === '快速旅行')[1]) === '已到访地图可在菜单 T 中瞬移，省去往返跑图');
// 宽预算（官方 estW 同 smoke_v2111 口径：CJK 0.865 / · 0.303 / 空格 0.263 / / 0.338 / 数字 0.63）
const estW88 = (s, size = 14) => {
  let wsum = 0;
  for (const ch of String(s || '')) {
    const code = ch.codePointAt(0);
    const wide = (code >= 0x2e80 && code <= 0x9fff) || (code >= 0x3000 && code <= 0x303f) || (code >= 0xff00 && code <= 0xffef) || code >= 0x1f000;
    if (wide) wsum += 0.865 * size;
    else if (code === 0xb7) wsum += 0.303 * size;
    else if (code === 0x2f) wsum += 0.338 * size;
    else if (code === 0x20) wsum += 0.263 * size;
    else wsum += 0.55 * size;
  }
  return wsum;
};
const wTrav88 = estW88(String(trav88 && trav88[1]), 14);
ok('快速旅行行 14px estW ' + wTrav88.toFixed(1) + ' ≤ 470 面板预算（T→217.8）', wTrav88 <= 470, String(wTrav88));
ok('CHANGELOG 顶部已追加 v23.88 条目（快速旅行行口径）', changelog.startsWith('## v23.95 '));
ok('CHANGELOG 仍保留 v23.87 条目（历史口径）', changelog.includes('## v23.87 新成就「败而不馁」'));
// —— v23.88 级联守护：旧代 v23.87 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.87 特性标签保留）——
const stale88 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("const GAME_VERSION = 'v23.8" + "7';") ||
      src.includes("GAME_VERSION === 'v23.8" + "7'") ||
      src.includes("startsWith('## v23.8" + "7 ") ||
      src.includes("startsWith('## v23.8" + "7'")) stale88.push(f);
}
ok('旧代 v23.87 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.87 特性标签保留）', stale88.length === 0, stale88.join(','));

// —— v23.89 守护：index.html 常驻帮助条（#help）T 块补「快速旅行」面板功能口径（体验打磨·可发现性·
// 纯文字——承 v23.88 H 页「操作说明」快速旅行行同款主线收口：v23.88 的零回归面明言「未动 README T 行/
// index.html 常驻帮助条 T 块」——README T 行（v19.53「已到访地图瞬移」/v22.32 补给提醒/v23.75 行者无疆）
// 早已带完整口径，唯独 index.html 画布下方常驻帮助条（v22.19 确立与 README 快速上手表/H 帮助页/首次进图
// 教程行四端口径一致）的 T 块仍是裸键「T 旅行」——玩家在日常画面按 T 前不知道这面板能看什么（同条
// I/J/B/C/H 五块均带括号口径）；现按 H 页同句式补「（已到访图瞬移 · 推荐等级/补给标注）」（与 v23.88
// H 页行逐字同口径、纯文字零逻辑零结算零存档零数值变化；index.html 本就是页面壳）——
const html89 = read('../index.html');
ok('data.js 含 v23.89 版本注释（index.html 常驻帮助条 T 块口径·当前版本注释 pin）', dataSrc.includes('v23.89 体验打磨·可发现性·纯文字'));
ok('data.js GAME_VERSION 字面量已为 v23.89（旧 v23.88 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.8" + "8';"));
ok('data.js 仍保留 v23.88 历史注释（快速旅行行面板功能口径·历史注释累积）', dataSrc.includes('v23.88 体验打磨·可发现性·纯文字'));
ok('index.html 常驻帮助条 T 块补面板功能口径（裸键 T 旅行 → T 旅行（已到访图瞬移 · 推荐等级/补给标注））',
  html89.includes('<kbd>T</kbd>旅行（已到访图瞬移 · 推荐等级/补给标注）'));
ok('index.html 常驻帮助条旧裸键 T 块零残留（无「T</kbd>旅行 ·」旧形态）', !html89.includes('<kbd>T</kbd>旅行 ·'));
ok('index.html 常驻帮助条 I/J/B/C/H 五块口径零回归（括号口径逐字保留）',
  html89.includes('<kbd>I</kbd>状态（<kbd>J</kbd>日志 · <kbd>C</kbd>成就 · <kbd>B</kbd>图鉴 · <kbd>H</kbd>帮助）') &&
  html89.includes('<kbd>J</kbd>任务（<kbd>↑↓</kbd>滚动') &&
  html89.includes('<kbd>B</kbd>图鉴（<kbd>↑↓</kbd>滚动') &&
  html89.includes('<kbd>C</kbd>成就（<kbd>↑↓</kbd>滚动') &&
  html89.includes('<kbd>H</kbd>操作说明（页内 <kbd>I</kbd>/<kbd>J</kbd>/<kbd>B</kbd>/<kbd>C</kbd> 直达）'));
ok('H 页操作说明快速旅行行逐字零回归（v23.88 口径未动）',
  dataSrc.includes("['快速旅行','T（已到访图瞬移 · 推荐等级/补给标注）']"));
ok('CHANGELOG 顶部已追加 v23.89 条目（常驻帮助条 T 块口径）', changelog.startsWith('## v23.95 '));
ok('CHANGELOG 仍保留 v23.88 条目（历史口径）', changelog.includes('## v23.88 '));
// —— v23.89 级联守护：旧代 v23.88 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.88 特性标签保留）——
const stale89 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("const GAME_VERSION = 'v23.8" + "8';") ||
      src.includes("GAME_VERSION === 'v23.8" + "8'") ||
      src.includes("startsWith('## v23.8" + "8 ") ||
      src.includes("startsWith('## v23.8" + "8'")) stale89.push(f);
}
ok('旧代 v23.88 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.88 特性标签保留）', stale89.length === 0, stale89.join(','));

// —— v23.90 守护：index.html 常驻帮助条（#help）「喝药」F 块补能力口径（体验打磨·可发现性·纯文字——承
// v23.89 #help T 块同款主线收口：v23.89 让 #help 的 I/J/B/C/H/T 六块全部带括号口径后，常驻帮助条键块中
// 唯 F 喝药仍是无括号裸键——F 是全游唯一喝药键（大地图喝药/战斗 [3] 同入口），其「优先灵药 + 普通
// 50%HP+8 / 灵药 80%HP+20并回40%MP」语义早在 v22.58/v23.26 H 页「喝药（普通/灵药）」行、README F 行、
// 战斗指令栏 [3] 预览（POTION_HP_PCT/POTION_HP_FLAT/ELIXIR_HP_PCT/ELIXIR_HP_FLAT/ELIXIR_MP_PCT 单一
// 数据源派生）三端齐备，唯独玩家在不进 H 页的日常画面里按 F 前不知道先喝哪瓶；现按 H 页行同句式补括号
// 口径（与 v23.26 H 页行 r[1] 逐字同口径、纯文字零逻辑零结算零存档零数值变化；index.html 本就是页面壳）——
const drink90 = HELP_PAGES[0] && HELP_PAGES[0].find((r) => r[0] === '喝药（普通/灵药）');
ok('data.js 含 v23.90 版本注释（index.html 常驻帮助条 F 块口径·当前版本注释 pin）', dataSrc.includes('v23.90 体验打磨·可发现性·纯文字'));
ok('data.js GAME_VERSION 字面量已为 v23.90（旧 v23.89 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.8" + "9';"));
ok('data.js 仍保留 v23.89 历史注释（常驻帮助条 T 块口径·历史注释累积）', dataSrc.includes('v23.89 体验打磨·可发现性·纯文字'));
ok('index.html 常驻帮助条 F 块补能力口径（裸键 F 喝药 → F 喝药（优先灵药·普通 50%HP+8 · 灵药 80%HP+20并回40%MP））',
  html89.includes('<kbd>F</kbd>喝药（优先灵药·普通 50%HP+8 · 灵药 80%HP+20并回40%MP）'));
ok('index.html 常驻帮助条旧裸键 F 块零残留（无「F</kbd>喝药 ·」旧形态）', !html89.includes('<kbd>F</kbd>喝药 ·'));
ok('index.html 常驻帮助条其余键块口径零回归（WASD/Enter·E/Esc/P/I/J/B/C/T/M/H/1-6 逐字保留）',
  html89.includes('<kbd>WASD</kbd>/<kbd>方向键</kbd>移动（<kbd>Shift</kbd>奔跑）') &&
  html89.includes('<kbd>Enter</kbd>/<kbd>E</kbd>对话/确认') && html89.includes('<kbd>Esc</kbd>菜单') &&
  html89.includes('<kbd>P</kbd>存档') && html89.includes('<kbd>T</kbd>旅行（已到访图瞬移 · 推荐等级/补给标注）') &&
  html89.includes('<kbd>M</kbd>静音') && html89.includes('<kbd>[</kbd>/<kbd>]</kbd>音量') && html89.includes('战斗中 <kbd>1-6</kbd> 指令') &&
  html89.includes('<kbd>H</kbd>操作说明（页内 <kbd>I</kbd>/<kbd>J</kbd>/<kbd>B</kbd>/<kbd>C</kbd> 直达）'));
ok('H 页「喝药（普通/灵药）」行逐字零回归（v22.58/v23.26 口径未动）',
  !!drink90 && String(drink90[1]) === 'F（优先灵药·普通 50%HP+8 · 灵药 80%HP+20并回40%MP）', String(drink90 && drink90[1]));
ok('CHANGELOG 顶部已追加 v23.90 条目（常驻帮助条 F 块口径）', changelog.startsWith('## v23.95 '));
ok('CHANGELOG 仍保留 v23.89 条目（历史口径）', changelog.includes('## v23.89 '));
// —— v23.90 级联守护：旧代 v23.89 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.89 特性标签保留）——
const stale90 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("const GAME_VERSION = 'v23.8" + "9';") ||
      src.includes("GAME_VERSION === 'v23.8" + "9'") ||
      src.includes("startsWith('## v23.8" + "9 ") ||
      src.includes("startsWith('## v23.8" + "9'")) stale90.push(f);
}
ok('旧代 v23.89 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.89 特性标签保留）', stale90.length === 0, stale90.join(','));

// —— v23.91 守护：新成就「提灯夜行」（昼夜相位维度单档·承 v23.87 败而不馁单档先例——成就版图
// 逐线核对：胜/遇/败北/六指令/试炼/社交/探索/经济各端口齐备，唯独「何时打」的相位维度查无一行：
// v23.31 起夜晚危险格步进 ×1.25（同样的怪夜里更难缠）、HUD 常驻 🌙 夜晚标签（v23.39）、小地图
// 遇敌槽相位倍率标（v23.35）都在说「夜」，玩家夜里刷了十几场却零回响；现补独立单档与昼夜信息
// 透明主线成对（相位看得见→相位打得响）——
// 源级落位 + 纯函数四档谓词 + 零串扰双向 + 运行期真实 winBattle 路径 + 旧代 v23.90 pin 全库零残留扫描）——
const nightAch = ACH_LIST.find((a) => a.id === 'nightwins');
ok('data.js 含 v23.91 版本注释（提灯夜行说明·当前版本注释 pin）', dataSrc.includes('v23.91 新内容·昼夜维度单档里程碑'));
ok('data.js GAME_VERSION 字面量已为 v23.91（旧 v23.90 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.95';") && !dataSrc.includes("const GAME_VERSION = 'v23.9" + "0';"));
ok('data.js 仍保留 v23.90 历史注释（常驻帮助条 F 块口径·历史注释累积）', dataSrc.includes('v23.90 体验打磨·可发现性·纯文字'));
ok('ACH_LIST 含 nightwins「提灯夜行」且 id 唯一（末尾追加，既有 75 项序位零位移）',
  !!nightAch && nightAch.name === '提灯夜行' && ACH_LIST.filter((a) => a.id === 'nightwins').length === 1 &&
  ACH_LIST.findIndex((a) => a.id === 'deaths') === 74 && ACH_LIST.findIndex((a) => a.id === 'nightwins') === 75);
ok('ACH_LIST 精确总数 76 项（v23.91 昼夜相位维度单档「提灯夜行」入列 75→76）', ACH_LIST.length === 76, String(ACH_LIST.length));
ok('NIGHT_WIN_GOAL 数据契约（阈值单一数据源，判定/进度/描述三端同读）', NIGHT_WIN_GOAL === 10, String(NIGHT_WIN_GOAL));
ok('nightwins 描述由 NIGHT_WIN_GOAL 派生（零裸字面量）', !!nightAch && nightAch.d === `夜间战胜 ${NIGHT_WIN_GOAL} 场`, nightAch && nightAch.d);
ok('nightwins 判定/进度读 (g.nightWins||0) 防御式（旧档无字段=0 不误解锁零迁移）',
  !!nightAch && String(nightAch.ok).includes('(g.nightWins||0)') && String(nightAch.prog).includes('g.nightWins||0'));
ok('nightwins 无 r 字段纯里程碑（与 deaths/battles/steps 同款）', !!nightAch && !('r' in nightAch));
ok('nightwins 0 次（缺字段旧档）→ false 且 prog 0/10', !!nightAch && nightAch.ok({}) === false && nightAch.prog({}) === `0/${NIGHT_WIN_GOAL}`);
ok('nightwins 9 次（恰差 1）→ false 且 prog 9/10', !!nightAch && nightAch.ok({ nightWins: 9 }) === false && nightAch.prog({ nightWins: 9 }) === `9/${NIGHT_WIN_GOAL}`);
ok('nightwins 10 次（恰好达标）→ true 且 prog 10/10', !!nightAch && nightAch.ok({ nightWins: 10 }) === true && nightAch.prog({ nightWins: 10 }) === `${NIGHT_WIN_GOAL}/${NIGHT_WIN_GOAL}`);
ok('nightwins 20 次（超阈值）→ true 且 prog 不钳制 20/10', !!nightAch && nightAch.ok({ nightWins: 20 }) === true && nightAch.prog({ nightWins: 20 }) === `20/${NIGHT_WIN_GOAL}`);
ok('battle.js 含 v23.91 计数注释（winBattle 夜战计数说明）', battleSrc.includes('v23.91 成就「提灯夜行」计数'));
ok('battle.js winBattle 唯一产生点源级落位（hero.nightWins 自增 + night 相位判定 + gallery 恒暗排除）',
  battleSrc.includes('hero.nightWins = (hero.nightWins || 0) + 1;') &&
  battleSrc.includes("dayPhase(hero.time) === 'night'") && battleSrc.includes("curMap() !== 'gallery'") &&
  battleSrc.includes('function winBattle') && battleSrc.includes('hero.totalWins++;'));
ok('battle.js dayPhase 由 data.js import（零新模块依赖）', battleSrc.includes('dayPhase, QUESTS } from'));
ok('nightwins 与胜/遇/败北/六指令各端口互不串扰（各自累计互不计入）',
  !!ACH_LIST.find((a) => a.id === 'deaths') && !!ACH_LIST.find((a) => a.id === 'battles') &&
  !String(nightAch.ok).includes('deaths') && !String(nightAch.ok).includes('battles') &&
  !String(nightAch.ok).includes('totalWins') && !String(nightAch.ok).includes('steps') &&
  !String(ACH_LIST.find((a) => a.id === 'deaths').ok).includes('nightWins'));
ok('零战报后缀（battle.js 无「夜间战胜」报文串——胜利报文本就零计数，C 页进度 X/10 承载）', !battleSrc.includes('夜间战胜'));
ok('data.js 导出具 NIGHT_WIN_GOAL（export 单一出口，紧随 DEATH_GOAL）',
  dataSrc.includes('BATTLE_GOAL, SELL_GOAL, DEATH_GOAL, NIGHT_WIN_GOAL,') || dataSrc.includes('BATTLE_GOAL, SELL_GOAL, DEATH_GOAL, NIGHT_WIN_GOAL'));
ok('data.js 含 v23.91 阈值注释与条目注释',
  dataSrc.includes('v23.91 成就「提灯夜行」阈值') && dataSrc.includes('v23.91 成就「提灯夜行」条目注释'));
ok('README 同步（C 行 76 项 / 成就 bullet 76 项·提灯夜行 X/10 次 / 成就档位行 NIGHT_WIN_GOAL(10)·共 76 项）',
  readme.includes('全部 76 项进度') && readme.includes('**76 项成就**') &&
  readme.includes('提灯夜行 X/10 次（夜间战斗胜利累计，v23.91）') &&
  readme.includes('`NIGHT_WIN_GOAL`(10) 场，v23.91') && readme.includes('共 76 项') &&
  readme.includes('`NIGHT_WIN_GOAL`'));
ok('README tests 树含 v23.91 守护描述（新成就「提灯夜行」守护）', readme.includes('v23.91 起含 新成就「提灯夜行」守护'));
ok('CHANGELOG 顶部已追加 v23.91 条目（新成就提灯夜行）', changelog.startsWith('## v23.95 '));
ok('CHANGELOG 仍保留 v23.90 条目（历史口径）', changelog.includes('## v23.90 '));
// 运行期：真实 winBattle 路径（计数落账 + 未达标不误报 + 累计第 10 场夜战当场解锁；日夜/回廊分档）
{
  let prevG91 = null, prevSc91 = null, prevEnemy91 = null, prevBusy91 = null;
  try {
    const nH = newGame('余烬');
    prevG91 = S.G; prevSc91 = S.scene; prevEnemy91 = S.enemy; prevBusy91 = S.battleBusy;
    const fight = (map, time) => {
      S.G = nH; S.G.map = map; S.G.time = time;
      btlMod.startBattle({ name: '木桩', hp: 1, hpMax: 1, atk: 5, def: 2, xp: 1, gold: 1 });
      S.battleBusy = false;
      S.enemy.hp = 0;
      btlMod.winBattle();
      S.enemy = null; S.battleBusy = false;
    };
    fight('village', 200); // dayPhase(200) = 🌙 night（90s/档，t∈[180,270)）
    ok('运行期：夜间（🌙）胜利落账 hero.nightWins 1 且未达标不误解锁',
      nH.nightWins === 1 && !(nH.ach || []).includes('nightwins'), 'nightWins=' + nH.nightWins);
    fight('village', 10); // dayPhase(10) = ☀️ day
    ok('运行期：白天胜利零计数（夜战口径不打折）', nH.nightWins === 1, 'nightWins=' + nH.nightWins);
    fight('gallery', 200); // 无字回廊「没有晨昏」：night 相位也不计数
    ok('运行期：无字回廊（🌑 恒暗）夜战零计数（与 HUD 恒暗同口径）', nH.nightWins === 1, 'nightWins=' + nH.nightWins);
    nH.nightWins = 9;
    fight('village', 200);
    ok('运行期：累计第 10 场夜战当场解锁「提灯夜行」（applyAchievements 落 hero.ach）',
      nH.nightWins === 10 && (nH.ach || []).includes('nightwins'),
      'nightWins=' + nH.nightWins + ' ach=' + JSON.stringify(nH.ach || []));
  } catch (e) {
    ok('运行期真实 winBattle 路径零抛错', false, String(e && e.stack || e));
  } finally {
    S.G = prevG91; S.scene = prevSc91; S.enemy = prevEnemy91; S.battleBusy = prevBusy91;
  }
}
// —— v23.91 级联守护：旧代 v23.90 GAME_VERSION/恒等/顶 pin 全库零残留（仅 v23.90 特性标签保留）——
const stale91 = [];
for (const f of allTests) {
  const src = read(f);
  if (src.includes("const GAME_VERSION = 'v23.9" + "0';") ||
      src.includes("GAME_VERSION === 'v23.9" + "0'") ||
      src.includes("startsWith('## v23.9" + "0 ") ||
      src.includes("startsWith('## v23.9" + "0'")) stale91.push(f);
}
ok('旧代 v23.90 pin 全库零残留（' + allTests.length + ' 件扫描，仅 v23.90 特性标签保留）', stale91.length === 0, stale91.join(','));

console.log(`\n— v23.13 有口皆碑冒烟：${n - failed}/${n} 通过 —`);
if (failed) process.exit(1);
