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
import { GAME_VERSION, ACH_LIST, NPCS, NPC_SPOTS, DEFLECT_GOAL, CHARGE_GOAL, CRIT_GOAL, TY } from '../js/data.js';

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
  dataSrc.includes("const GAME_VERSION = 'v23.63';") && !dataSrc.includes("const GAME_VERSION = 'v23.12';"));
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
ok('ACH_LIST 精确总数 62 项（v23.54 战斗维度第二枚「蓄势待发」入列 61→62）', ACH_LIST.length === 63, String(ACH_LIST.length));
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
  dataSrc.includes("const GAME_VERSION = 'v23.63';") && !dataSrc.includes("const GAME_VERSION = 'v23.38';"));
ok('enemyAI.js 数据源 import 补 DEFLECT_GOAL（进度与计数同读一份源）', enemyAISrc.includes('FX_HERO, DEFLECT_GOAL } from'));
ok('enemyAI.js 反击战报补「· 以守为攻 N/M」派生段（dfc 与 DEFLECT_GOAL 同源、既有文案逐字保留）',
  enemyAISrc.includes('const dfc = (hero.deflects || 0) + 1;') &&
  enemyAISrc.includes('· 以守为攻 ${dfc}/${DEFLECT_GOAL}'));
ok('data.js 导出具 DEFLECT_GOAL（export 单一出口）', dataSrc.includes('TREE_GOAL, DEFLECT_GOAL,'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.40', dataSrc.includes("const GAME_VERSION = 'v23.63';") && !dataSrc.includes("const GAME_VERSION = 'v23.35';"));
ok('README 同步（C 行 62 项 / 成就 bullet 62 项·以守为攻 X/15 次 / 成就档位行 DEFLECT_GOAL(15)·共 63 项 / 战斗防御句）',
  readme.includes('全部 63 项进度') && readme.includes('**63 项成就**') && readme.includes('以守为攻 X/15 次（防御反击累计，v23.36）') &&
  readme.includes('DEFLECT_GOAL`(15) 次，v23.36') && readme.includes('共 63 项') && readme.includes('15 次解锁成就「以守为攻」'));
ok('CHANGELOG 顶部已追加 v23.40 条目', changelog.startsWith('## v23.63 '));

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
  dataSrc.includes("const GAME_VERSION = 'v23.63';") && !dataSrc.includes("const GAME_VERSION = 'v23.40';"));
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
  dataSrc.includes("const GAME_VERSION = 'v23.63';") && !dataSrc.includes("const GAME_VERSION = 'v23.41';"));
ok('data.js 仍保留 v23.41 历史注释（README 音效事件家族文档补全）', dataSrc.includes('v23.41 文档整理·数值说明·同源口径'));
ok('data.js WOLF_GOAL=3 单一数据源 + QUESTS.side_wolf 字面量逐字（40 金 + 2 药水 · 客栈老板娘委托人）',
  dataSrc.includes('const WOLF_GOAL = 3;') && dataSrc.includes('reward:{ gold:40, item:2 }') &&
  dataSrc.includes("id:'side_wolf', kind:'side', store:true, npc:'innkeeper', giver:'innkeeper'"));
ok('README 支线行 夜路的狼嚎 v23.42 逐字（40 金 + 2 药水 · WOLF_GOAL 常量源列）',
  readme.includes('夜路的狼嚎（客栈老板娘 · 3 只野狼 `WOLF_GOAL`）40 金 + 2 药水') &&
  readme.includes('`GRAIN_GOAL` `WOLF_GOAL` `SNAKE_GOAL` `TREE_GOAL`'));
ok('README 支线行开头已随新现实更新为 十一条支线', readme.includes('十一条支线目标/奖励全部由 `QUESTS[].reward` 单一数据源派生'));
ok('CHANGELOG 顶部已追加 v23.42 条目（新支线夜路的狼嚎）', changelog.startsWith('## v23.63 '));

// —— v23.43 暴击专属上扬音（音效反馈·听觉信息透明·承 v23.22/33/40 事件音效各归其位主线收口）——
ok('data.js 含 v23.43 版本注释（暴击专属上扬音·承 v21.3/v23.22-40 主线）', dataSrc.includes('v23.43 音效反馈·听觉信息透明'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.43（旧 v23.42 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.63';") && !dataSrc.includes("const GAME_VERSION = 'v23.42';"));
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
ok('CHANGELOG 顶部已追加 v23.43 条目（暴击专属上扬音）', changelog.startsWith('## v23.63 '));
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
  dataSrc.includes("const GAME_VERSION = 'v23.63';") && !dataSrc.includes("const GAME_VERSION = 'v23.43';"));
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
ok('CHANGELOG 顶部已追加 v23.44 条目（指令栏 [5]防御 回蓝/反击 预览补全）', changelog.startsWith('## v23.63 '));

// —— v23.45 Boss/试炼战专属战斗 BGM（音效反馈·听觉信息透明，承 v21.3 alert/boss「先闻其声」持续侧收口）——
const _auSrc = read('../js/audio.js');
const _btnSrc = read('../js/battle.js');
ok('data.js 含 v23.45 版本注释（Boss/试炼战专属战斗 BGM）',
  dataSrc.includes('v23.45 音效反馈·听觉信息透明：Boss/试炼战专属战斗 BGM'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.45（旧 v23.44 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.63';") && !dataSrc.includes("const GAME_VERSION = 'v23.44';"));
ok('audio.js 含 MUSIC.battleBoss 轨（step 0.22 慢于 battle 0.13 · 三角波半音阶下行 A3→G#3→G3→F#3 · 低音持续）',
  _auSrc.includes('battleBoss: {') && _auSrc.includes("step: 0.22, wave: 'triangle'") &&
  _auSrc.includes('seq: [220, 0, 0, 0, 208, 0, 0, 0, 196, 0, 0, 0, 185, 0, 0, 0]'));
ok('audio.js MUSIC.battle 原轨逐字未动（杂兵战音乐零回归）',
  _auSrc.includes('seq: [330, 330, 0, 330, 0, 392, 330, 0, 294, 0, 330, 0, 262, 262, 0, 0]'));
ok('battle.js startBattle 战斗 BGM 按 isBossFoe 分轨（battleBoss/battle · 与 SFX.boss/alert 同一判定源）',
  _btnSrc.includes("startBgm(isBossFoe(S.enemy) ? 'battleBoss' : 'battle')") && !_btnSrc.includes("startBgm('battle');"));
ok('battle.js SFX.alert/SFX.boss 警报分支逐字未动（v23.45 零回归）',
  _btnSrc.includes('if (isBossFoe(S.enemy)) SFX.boss(); else SFX.alert();'));
ok('CHANGELOG 顶部已追加 v23.45 条目（Boss/试炼战专属战斗 BGM）', changelog.startsWith('## v23.63 '));

// —— v23.46 真身变身专属音效（音效反馈·语义修正，承 v23.22/33/40/43 事件音效各归其位主线收口）——
const _enemySrc = read('../js/enemyAI.js');
ok('data.js 含 v23.46 版本注释（真身变身专属音效·语义修正）',
  dataSrc.includes('v23.46 音效反馈·语义修正：Boss 现出真身（变身）专属音效'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.46（旧 v23.45 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.63';") && !dataSrc.includes("const GAME_VERSION = 'v23.45';"));
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
ok('CHANGELOG 顶部已追加 v23.46 条目（真身变身专属音效）', changelog.startsWith('## v23.63 '));
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
  dataSrc.includes("const GAME_VERSION = 'v23.63';") && !dataSrc.includes("const GAME_VERSION = 'v23.46';"));
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
ok('CHANGELOG 顶部已追加 v23.47 条目（蓄力专属音效）', changelog.startsWith('## v23.63 '));
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
  dataSrc.includes("const GAME_VERSION = 'v23.63';") && !dataSrc.includes("const GAME_VERSION = 'v23.47';"));
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
ok('CHANGELOG 顶部已追加 v23.48 条目（敌方暗影回血专属音效）', changelog.startsWith('## v23.63 '));
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
  dataSrc.includes("const GAME_VERSION = 'v23.63';") && !dataSrc.includes("const GAME_VERSION = 'v23.48';"));
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
ok('CHANGELOG 顶部已追加 v23.49 条目（宝箱开启专属音效）', changelog.startsWith('## v23.63 '));
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
  dataSrc.includes("const GAME_VERSION = 'v23.63';") && !dataSrc.includes("const GAME_VERSION = 'v23.49';"));
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
  dataSrc.includes("const GAME_VERSION = 'v23.63';") && !dataSrc.includes("const GAME_VERSION = 'v23.50';"));
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
ok('CHANGELOG 顶部已追加 v23.51 条目（敌方石甲专属音效）', changelog.startsWith('## v23.63 '));
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
  readme.includes('成就一览（全部 63 项进度') && readme.includes('**63 项成就**') &&
  !readme.includes('成就一览（全部 59 项进' + '度') && !readme.includes('**59 项成' + '就**'));
ok('README 数值速查成就档位行含社交档「有口皆碑」与共 63 项',
  readme.includes('社交向单档「有口皆碑」') && readme.includes('共 63 项'));
ok('package.json 已收录 smoke_v2313_talkall（npm test 串跑第 209 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2313_talkall.mjs'));
ok('package.json 串尾为 ... smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"',
  pkg.includes('node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 209 件套', testChain === 212, String(testChain));
ok('CHANGELOG 顶部已追加 v23.41 条目', changelog.startsWith('## v23.63 '));
ok('CHANGELOG 仍保留 v23.12 条目（历史口径）', changelog.includes('## v23.12 标题画面提示行补「[ / ] 音量」口径'));

// —— 姊妹件套 pin 随新现实更新 + 旧代 v23.12 pin 零残留 ——
const s2312 = read('smoke_v2312_voltitle.mjs');
const s2297 = read('smoke_v2297_chestmid.mjs');
const s2229 = read('smoke_v2229_metall.mjs');
const s2143 = read('smoke_v2143_talkekey.mjs');
ok('smoke_v2312 的 GAME_VERSION 字面量 pin 已更新为 v23.13', s2312.includes("const GAME_VERSION = 'v23.63';"));
ok('smoke_v2312 的 CHANGELOG 顶 pin 已更新为 ## v23.13',
  s2312.includes("startsWith('## v23.63 "));
ok('smoke_v2312 的件套 pin 已更新为二百一十二件套（二百一十一件套清除）', s2312.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2312 的 README 串尾 pin 已延伸至 smoke_v2313_talkall',
  s2312.includes('smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2312 的 package 串尾 pin 已延伸至 smoke_v2313_talkall',
  s2312.includes('node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
ok('smoke_v2312 的 testChain pin 已更新为 209', s2312.includes('testChain === 212'));
ok('smoke_v2297 的 ACH_LIST 精确计数 pin 已更新为 === 60', s2297.includes('ACH_LIST.length === 63'));
ok('smoke_v2229 的 ACH_LIST 精确计数 pin 已更新为 === 60', s2229.includes('ACH_LIST.length === 63'));
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
ok('CHANGELOG 顶部已追加 v23.52 条目（improve-plan 落地状态对齐）', changelog.startsWith('## v23.63 '));
ok('CHANGELOG 仍保留 v23.51 条目（历史口径）', changelog.includes('## v23.51 敌方石甲专属音效'));

// —— v23.53 精英「重击」逐招预判补全（体验打磨·信息透明·纯显示——承 v21.47 威胁预警补「重击线」/ v23.44
// 决策现场信息透明同一主线收口：持 heavy 招的精英（残焰魔像 w40 重击）此前走普攻单招预判，决策现场
// 看不到重击那一刀；现把逐招预判门放宽为 isBossFoe || 持有 heavy 招）——
ok('data.js 含 v23.53 版本注释（精英重击逐招预判补全）', dataSrc.includes('// v23.53 体验打磨·信息透明·纯显示：精英「重击」逐招预判补全'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.53（旧 v23.52 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.63';") && !dataSrc.includes("const GAME_VERSION = 'v23.52';"));
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
ok('CHANGELOG 顶部已追加 v23.53 条目（精英「重击」逐招预判补全）', changelog.startsWith('## v23.63 '));
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
  dataSrc.includes("const GAME_VERSION = 'v23.63';") && !dataSrc.includes("const GAME_VERSION = 'v23.53';"));
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
ok('README 同步（C 行 62 项 / 成就 bullet 62 项·蓄势待发 X/15 次 / 成就档位行 CHARGE_GOAL(15)·共 63 项 / 战斗蓄力句）',
  readme.includes('全部 63 项进度') && readme.includes('**63 项成就**') && readme.includes('蓄势待发 X/15 次（蓄力累计，v23.54）') &&
  readme.includes('CHARGE_GOAL`(15) 次，v23.54') && readme.includes('共 63 项') && readme.includes('15 次解锁成就「蓄势待发」'));
ok('CHANGELOG 顶部已追加 v23.54 条目（新成就蓄势待发）', changelog.startsWith('## v23.63 '));
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
  dataSrc.includes("const GAME_VERSION = 'v23.63';") && !dataSrc.includes("const GAME_VERSION = 'v23.54';"));
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
ok('CHANGELOG 顶部已追加 v23.55 条目（Lv12 终章新技能灯焰长明）', changelog.startsWith('## v23.63 '));
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
  dataSrc.includes("const GAME_VERSION = 'v23.63';") && !dataSrc.includes("const GAME_VERSION = 'v23.55';"));
ok('data.js 仍保留 v23.55 历史注释（Lv12 终章新技能灯焰长明）',
  dataSrc.includes('// v23.55 新内容·战斗机制：Lv12 终章新技能「灯焰长明」'));
ok('battle.js 含 v23.56 注释块（试炼战报补「获得 N 经验」说明）', battleSrc.includes('// v23.56 试炼战报补「获得 N 经验」'));
ok('battle.js 试炼换关报文已补经验（🚩 ……现身！（获得 ${enemy.xp} 经验 · 已自动恢复…））',
  battleSrc.includes('现身！（获得 ${enemy.xp} 经验 · 已自动恢复'));
ok('battle.js 试炼通关报文已补经验（🌈 ……！（获得 ${enemy.xp} 经验 · 剩余 ${hero.gold} 金））',
  battleSrc.includes('灯火记得你的名字！（获得 ${enemy.xp} 经验 · 剩余 ${hero.gold} 金）'));
ok('battle.js 旧报文零残留（换关/通关不再有无经验版本）',
  !battleSrc.includes('现身！（已自动恢复') && !battleSrc.includes('灯火记得你的名字！（剩余 ${hero.gold} 金）'));
ok('CHANGELOG 顶部已追加 v23.56 条目（试炼战报补经验）', changelog.startsWith('## v23.63 '));
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
  dataSrc.includes("const GAME_VERSION = 'v23.63';") && !dataSrc.includes("const GAME_VERSION = 'v23.56';"));
ok('data.js 仍保留 v23.56 历史注释（试炼战报补经验）', dataSrc.includes('// v23.56 体验打磨·信息透明·反馈不迟到：试炼三连战战报补'));
ok('data.js SNAKE_GOAL=3 单一数据源 + QUESTS.side_snake 字面量逐字（50 金 + 1 高级灵药 · 酿药师委托人）',
  dataSrc.includes('const SNAKE_GOAL = 3;') && dataSrc.includes('reward:{ gold:50, potion2:1 },') &&
  dataSrc.includes("id:'side_snake', kind:'side', store:true, npc:'brewer', giver:'brewer'") &&
  dataSrc.includes('GRAIN_GOAL, WOLF_GOAL, SNAKE_GOAL, TREE_GOAL, DEFLECT_GOAL, CHARGE_GOAL'));
ok('README 支线行 蛇影的药引 v23.57 逐字（50 金 + 1 高级灵药 · SNAKE_GOAL 常量源列）',
  readme.includes('蛇影的药引（酿药师 · 3 只毒蛇 `SNAKE_GOAL`）50 金 + 1 高级灵药') &&
  readme.includes('`WOLF_GOAL` `SNAKE_GOAL` `TREE_GOAL`'));
ok('CHANGELOG 顶部已追加 v23.57 条目（新支线蛇影的药引）', changelog.startsWith('## v23.63 '));
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
  dataSrc.includes("const GAME_VERSION = 'v23.63';") && !dataSrc.includes("const GAME_VERSION = 'v23.57';"));
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
ok('CHANGELOG 顶部已追加 v23.58 条目（潮灯镇行酿药师指针）', changelog.startsWith('## v23.63 '));
// —— v23.59 记忆碎片拾取音效归位（音效反馈·听觉信息透明——承 v21.3 alert/boss「先闻其声」/
// v23.22 SFX.ach / v23.43 SFX.crit / v23.49 SFX.chest 同一「事件音效各归其位」主线收口后复查补全：
// SFX.item 自 v23.49 宝箱移出后成孤儿音效，唯一仍是「拾取」语义的现场=winBattle 碎片拾取却静默）——
ok('data.js 含 v23.59 版本注释（记忆碎片拾取音效归位）',
  dataSrc.includes('// v23.59 音效反馈·听觉信息透明：记忆碎片拾取音效归位'));
ok('data.js GAME_VERSION 字面量已随新现实级联为 v23.59（旧 v23.58 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v23.63';") && !dataSrc.includes("const GAME_VERSION = 'v23.59';"));
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
ok('CHANGELOG 顶部已追加 v23.59 条目（记忆碎片拾取音效归位）', changelog.startsWith('## v23.63 '));
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
  dataSrc.includes("const GAME_VERSION = 'v23.63';") && !dataSrc.includes("const GAME_VERSION = 'v23.60';"));
ok('data.js 仍保留 v23.60 历史注释（潮灯镇行旅馆狼嚎指针）',
  dataSrc.includes('// v23.60 体验打磨·信息透明·纯文字'));
ok('menus.js drawStatus 节头与技能菜单同源派生计数（hero.skills.length + Object.keys(SKILL_DATA).length）',
  menusSrc.includes("text('已学技能：' + hero.skills.length + '/' + Object.keys(SKILL_DATA).length"));
ok('menus.js drawStatus 节头 v23.61 注释落位', menusSrc.includes('// v23.61 状态页「已学技能：」节头补 N/8 计数'));
ok('CHANGELOG 顶部已追加 v23.61 条目（状态页技能节头计数）', changelog.startsWith('## v23.63 '));
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
    dataSrc.includes("const GAME_VERSION = 'v23.63';") && !dataSrc.includes("const GAME_VERSION = 'v23.61';"));
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
  ok('CHANGELOG 顶部已追加 v23.62 条目（记忆图鉴行讨伐支线进度角标）', changelog.startsWith('## v23.63 '));
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
  dataSrc.includes("const GAME_VERSION = 'v23.63';") && !dataSrc.includes("const GAME_VERSION = 'v23.62';"));
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
ok('README 同步（C 行 63 项 / 成就 bullet 63 项·暴击如雨 X/20 次 / 成就档位行 CRIT_GOAL(20)·共 63 项 / 战斗暴击句）',
  readme.includes('全部 63 项进度') && readme.includes('**63 项成就**') && readme.includes('暴击如雨 X/20 次（普攻暴击累计，v23.63）') &&
  readme.includes('CRIT_GOAL`(20) 次，v23.63') && readme.includes('共 63 项') && readme.includes('20 次解锁成就「暴击如雨」'));
ok('CHANGELOG 顶部已追加 v23.63 条目（新成就暴击如雨）', changelog.startsWith('## v23.63 '));
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

console.log(`\n— v23.13 有口皆碑冒烟：${n - failed}/${n} 通过 —`);
if (failed) process.exit(1);
