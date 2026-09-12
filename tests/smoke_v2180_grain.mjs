// v21.80 专项冒烟：潮灯镇新 NPC「粮铺掌柜」+ 讨伐支线「护粮的委托」（side_grain）+ 单支线成就「护粮安民」——
// 纯内容扩充（新支线/新 NPC，零结算改动、零新逻辑：任务状态机/对话解析/奖励结算全走既有 QUESTS 驱动通路）：
// 数据层四件套（village.extras (15,12) + NPC_SPOTS '15,12' + NPCS.grainman + sprites NPC_SHEET grainman→mwCartman），
// QUESTS.side_grain 四态任务页（offer/active/turnin/done，GRAIN_GOAL 单一数据源），ACH_LIST 28→29。
// 本冒烟守护：版本锚点、全局坐标防撞（NPC_SPOTS 跨地图共用键、唯一映射、既有 17 键未动、全图 extras 扫描）、
// NPCS/QUESTS/ACH_LIST 契约、灯火同心分母 7→8（随新现实更新）、运行期（loadMap 落位 + Enter/E 真实交互
// 开对话 + questStatus offer→active→turnin→done 全链路与奖励/成就结算）、哥布林弱冰口径（SPECIES 同源）、
// README/package.json 同步 + smoke_v2179/v2178/v2177/v2176 件套与 README 成就 pin 随新现实更新。
import { S } from '../js/state.js';
import { GAME_VERSION, NPCS, NPC_SPOTS, MAPS, TY, QUESTS, ACH_LIST, GRAIN_GOAL, BONE_GOAL, STONE_GOAL, SPECIES } from '../js/data.js';
import { npcQuestPages, npcQuestMark, questStatus, resolveNpcTalk, questJournal } from '../js/quests.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v21.79 冒烟先例：先装桩再 import main.js）——
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
const { screens } = await import('../js/main.js');
const { loadMap, at } = await import('../js/world.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.80 粮铺掌柜·护粮的委托（潮灯镇讨伐支线）冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.79 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.79', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 80)), GAME_VERSION);
ok('data.js 含 v21.80 注释（粮铺掌柜/护粮的委托说明）', dSrc.includes('v21.80'));

// —— 数据层：GRAIN_GOAL 单一数据源（MIST/STONE/EMBER/BONE_GOAL 同族）——
ok('GRAIN_GOAL===3 且已从 data.js 导出（与 BONE_GOAL/STONE_GOAL 同档）', GRAIN_GOAL === 3 && BONE_GOAL === 3 && STONE_GOAL === 3);

// —— 数据层：NPC_SPOTS 全局坐标键（跨地图共用，不得撞车）——
ok("NPC_SPOTS['15,12']===grainman", NPC_SPOTS['15,12'] === 'grainman', NPC_SPOTS['15,12']);
ok('grainman 仅占一个坐标键（无重复映射）', Object.keys(NPC_SPOTS).filter((k) => NPC_SPOTS[k] === 'grainman').length === 1);
ok('既有 17 个 NPC/石碑键未被误动', ['13,6', '10,13', '19,8', '12,8', '2,4', '13,9', '3,1', '2,3', '17,12', '17,11', '5,1', '10,1', '15,1', '20,1', '8,5', '14,8', '5,10']
  .every((k) => NPC_SPOTS[k] != null));
// 全局坐标防撞演练：全图 extras 扫描，(15,12) 必须恰出现 1 次且在 village、ty 为 NPC
const at1512 = [];
for (const [mname, mdef] of Object.entries(MAPS)) {
  for (const ex of (mdef.extras || [])) {
    if (ex.x === 15 && ex.y === 12) at1512.push(mname + ':' + ex.ty);
  }
}
ok('(15,12) 全图 extras 仅 village 一处 NPC（他图无占用/无撞车）',
  at1512.length === 1 && at1512[0] === 'village:NPC', at1512.join(','));
ok("data.js village.extras 源级落位（{ x: 15, y: 12, ty: 'NPC' }）且含 v21.80 注释",
  dSrc.includes("{ x: 15, y: 12, ty: 'NPC' }") && dSrc.includes('粮铺掌柜（v21.80'));

// —— NPCS.grainman 契约 ——
const gm = NPCS.grainman;
ok('NPCS.grainman 存在且 name===粮铺掌柜 / mark===basket', !!gm && gm.name === '粮铺掌柜' && gm.mark === 'basket', gm && gm.name);
ok('NPCS.grainman 含兜底静态 lines（任务页恒优先，lines 仅回退）且每页 [Enter] 收尾',
  !!gm && Array.isArray(gm.lines) && gm.lines.length >= 1 &&
  gm.lines.every((pg) => Array.isArray(pg) && pg.every((ln) => typeof ln === 'string') && /\[Enter\]/.test(pg[pg.length - 1])));

// —— QUESTS.side_grain 契约（承 side_mist/side_stone/side_ember/side_bone 讨伐采集型模式）——
const qg = QUESTS.side_grain;
ok('QUESTS.side_grain 存在：kind side + store + npc/giver 双指 grainman',
  !!qg && qg.kind === 'side' && qg.store === true && qg.npc === 'grainman' && qg.giver === 'grainman');
ok('side_grain 无 unlockOn（从开局即 offer，保留完整接取流程，承 side_ember 同款）', qg && !('unlockOn' in qg));
ok('side_grain cond/condProg 与 GRAIN_GOAL 同源（2 只不满足、3 只转可交付、进度文案 2/3 只）',
  qg && qg.cond({ bestiary: { '哥布林': 2 } }) === false &&
  qg.cond({ bestiary: { '哥布林': 3 } }) === true &&
  qg.condProg({ bestiary: { '哥布林': 2 } }) === `2/${GRAIN_GOAL} 只`);
ok('side_grain 奖励 50 金 + 1 生命药水（开荒期档，介于 side_mist 60 之下的最低配）',
  qg && qg.reward && qg.reward.gold === 50 && qg.reward.item === 1 && !qg.reward.potion2);
ok('side_grain 任务页四态齐备（offer/turnin/done 静态页 + active 函数页）且每页 [Enter] 收尾',
  qg && qg.talk && ['offer', 'turnin', 'done'].every((k) => Array.isArray(qg.talk[k]) &&
    qg.talk[k].every((pg) => Array.isArray(pg) && /\[Enter\]/.test(pg[pg.length - 1]))) &&
  typeof qg.talk.active === 'function' &&
  [qg.talk.active({}), qg.talk.active({ bestiary: { '哥布林': 1 } })].every((pages) => Array.isArray(pages) &&
    pages.every((pg) => Array.isArray(pg) && /\[Enter\]/.test(pg[pg.length - 1]))));
ok('side_grain offer 页由 GRAIN_GOAL 派生（「帮我 3 只」非裸字面量）',
  qg && qg.talk.offer[0].some((ln) => ln.includes(`${GRAIN_GOAL} 只`)));
ok('side_grain 哥布林弱冰提示与 SPECIES 单一数据源口径一致（weak:ice）',
  qg && qg.talk.active({}).some((pg) => pg.some((ln) => ln.includes('哥布林'))) &&
  SPECIES['哥布林'] && SPECIES['哥布林'].weak === 'ice');

// —— ACH_LIST：护粮安民（单支线成就，承 quest/cartman/names/mist/stone/ember/bone 模式）——
const achGrain = ACH_LIST.find((a) => a.id === 'grain');
ok('ACH_LIST 含 grain「护粮安民」且 id 唯一',
  !!achGrain && achGrain.name === '护粮安民' && ACH_LIST.filter((a) => a.id === 'grain').length === 1);
ok('ACH_LIST 由 28 → 29 项（v21.84 起精确总数由新版冒烟守护，本件存活性口径 >= 29）', ACH_LIST.length >= 29, String(ACH_LIST.length));
ok('grain 成就判定读 quests.side_grain（未做 false / 已做 true）',
  achGrain.ok({ quests: {} }) === false && achGrain.ok({ quests: { side_grain: 'done' } }) === true);
// 灯火同心（allquests）自动跟随：支线总数由 QUESTS 派生（7 → 8，v21.80 随新现实更新）
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('灯火同心支线分母自动跟随为 8（side_grain 入列，无需改 achievement 本体）',
  achAll && achAll.prog({ quests: {} }) === '0/8' && achAll.d.includes('8 个支线'), achAll && achAll.prog({ quests: {} }));
ok('allquests 对只做 side_grain 的存档不误判完成',
  achAll.ok({ quests: { side_grain: 'done' } }) === false);

// —— 运行期：questStatus 状态机全链路（接取→讨伐→交付→奖励→成就）——
const h1 = { gold: 10, item: 0, bestiary: {} };
ok('新档 questStatus(side_grain)===offer（无 unlockOn 开局可接）', questStatus(h1, 'side_grain') === 'offer');
ok('npcQuestMark(offer)===「❕ 可接委托」（世界头顶任务顶标同源）', npcQuestMark(h1, 'grainman') === '❕ 可接委托');
const act1 = resolveNpcTalk(h1, 'grainman');
ok('resolveNpcTalk 接取：kind accept + 名字「护粮的委托」+ quests.side_grain 落 active',
  !!act1 && act1.kind === 'accept' && act1.name === '护粮的委托' && h1.quests.side_grain === 'active');
h1.bestiary['哥布林'] = 2;
ok('讨伐 2/3 时仍 active（cond 未达）且进度文案实时',
  questStatus(h1, 'side_grain') === 'active' && questJournal(h1).find((e) => e.id === 'side_grain').objective.includes('2/3 只'));
h1.bestiary['哥布林'] = 3;
ok('讨伐 3/3 时转 turnin（cond 达成）且 npcQuestMark 变「❕ 可交任务」',
  questStatus(h1, 'side_grain') === 'turnin' && npcQuestMark(h1, 'grainman') === '❕ 可交任务');
const goldBefore = h1.gold;
const itemBefore = h1.item || 0;
const act2 = resolveNpcTalk(h1, 'grainman');
ok('resolveNpcTalk 交付：kind reward + 金币 +50 + 药水 +1 + 状态落 done',
  !!act2 && act2.kind === 'reward' && act2.gold === 50 && act2.item === 1 &&
  h1.gold === goldBefore + 50 && h1.item === itemBefore + 1 && h1.quests.side_grain === 'done');
ok('done 后成就 grain 解锁、npcQuestMark 归零（不再提示）',
  achGrain.ok(h1) === true && npcQuestMark(h1, 'grainman') === null);
ok('done 后 resolveNpcTalk 返回 null（不重复发奖）', resolveNpcTalk(h1, 'grainman') === null && h1.gold === goldBefore + 50);

// —— 任务页运行期求值（npcQuestPages 对函数型 active 页调用期求值）——
const h2 = { bestiary: { '哥布林': 1 }, quests: { side_grain: 'active' } };
ok('active 函数页按 hero 实时报进度（已驱赶 1/3 只）',
  npcQuestPages(h2, 'grainman')[0].some((ln) => ln.includes(`1/${GRAIN_GOAL} 只`)));
ok('offer 页含委托叙事（庄稼/哥布林）', npcQuestPages({}, 'grainman')[0].some((ln) => ln.includes('庄稼')));
ok('done 页含「（支线任务·已完成）」', npcQuestPages(h1, 'grainman').some((pg) => pg.some((ln) => ln.includes('（支线任务·已完成）'))));

// —— 旧档兼容：有旧支线进度、无 side_grain 字段的老存档自动落 offer（零迁移）——
ok('旧档兼容：quests 只有 side_mushroom 的老档 questStatus 自动落 offer（无需 migrateQuests 播种）',
  questStatus({ quests: { side_mushroom: 'done' }, bestiary: {} }, 'side_grain') === 'offer');

// —— 运行期：loadMap 落位 + Enter/E 真实交互开对话 ——
loadMap('village');
ok('(15,12) 落位为 NPC 瓦片（placeExtras 覆盖）', at(15, 12) === TY.NPC, String(at(15, 12)));
ok('(15,11) 北邻草地可行走（对话站位）/ (14,8) 掌灯阿婆零回归',
  at(15, 11) === TY.GRASS && at(14, 8) === TY.NPC && NPC_SPOTS['14,8'] === 'granny');
S.G.x = 15; S.G.y = 11; S.dir = 'D'; S.scene = 'world';
await screens.world.onKey({ key: 'Enter' });
ok('面向粮铺掌柜按 Enter：进入对话（S.scene==talk）且 curNpc===grainman',
  S.scene === 'talk' && S.curNpc === 'grainman', S.scene + '/' + S.curNpc);
ok('对话第 1 页为 offer 页（新档 S.G 无 side_grain 进度 → 可接委托）',
  Array.isArray(S.talkPages) && S.talkPages[0] && S.talkPages[0].some((ln) => ln.includes('接下委托')));
S.scene = 'world';
await screens.world.onKey({ key: 'E' });
ok('E 键同效（v21.29 交互别名对新 NPC 零回归）', S.scene === 'talk' && S.curNpc === 'grainman', S.scene + '/' + S.curNpc);
S.scene = 'world';

// —— 造型映射（sprites.js 源级）——
const spSrc = fs.readFileSync(path.join(ROOT, 'js/view/sprites.js'), 'utf8');
ok("sprites.js NPC_SHEET 已映射 grainman→mwCartman（杂货商贩造型，星砂车夫同款）",
  spSrc.includes("grainman: 'mwCartman'"));

// —— README / package.json / 既有冒烟 pin 随新现实更新 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2180_grain', readme.includes('smoke_v2180_grain'));
ok('README 件套口径为一百二十八件套（一百二十七件套清除）', readme.includes('一百二十八件套（一百二十七件套清除）'));
ok('README 含 v21.80 守护描述（粮铺掌柜新 NPC 与讨伐支线「护粮的委托」守护）',
  readme.includes('v21.80 起含潮灯镇粮铺掌柜新 NPC 与讨伐支线「护粮的委托」守护'));
ok('README 成就口径「31 项」双处同步（快速上手表 C 键行 + 图鉴&成就行）',
  readme.includes('成就一览（全部 45 项进度') && readme.includes('**45 项成就**'));
ok('README 潮灯镇条目含粮铺掌柜/护粮的委托', readme.includes('粮铺掌柜') && readme.includes('护粮的委托'));
ok('package.json 已收录 smoke_v2180_grain（npm test 串跑第 76 份）', pkg.includes('smoke_v2180_grain.mjs'));
const s2179 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2179_titlerecap.mjs'), 'utf8');
ok('smoke_v2179 的 README 件套 pin 已随新现实更新为一百二十八件套（一百二十七件套清除）',
  s2179.includes("ok('README 件套口径已更新为一百二十八件套（一百二十七件套清除）'"));
const s2178 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2178_codexseen.mjs'), 'utf8');
ok('smoke_v2178 的 README 件套 pin 已随新现实更新为一百二十八件套（一百二十七件套清除）',
  s2178.includes("ok('README 件套口径为一百二十八件套（一百二十七件套清除）'"));
const s2177 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2177_elites.mjs'), 'utf8');
ok('smoke_v2177 的 README 件套 pin 已随新现实更新为一百二十八件套（一百二十七件套清除）',
  s2177.includes("ok('README 件套口径为一百二十八件套（一百二十七件套清除）'"));
const s2176 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2176_allchests.mjs'), 'utf8');
ok('smoke_v2176 的 README 件套 pin 已随新现实更新为一百二十八件套（一百二十七件套清除）',
  s2176.includes("ok('README 件套口径为一百二十八件套（一百二十七件套清除）'"));
ok('smoke_v2177 的 ACH_LIST 精确计数断言已去硬化（===28 零残留，>=28 存活性口径落位）',
  s2177.includes('ACH_LIST.length >= 28') && !s2177.includes('ACH_LIST.length === 28'));
ok('smoke_v2176 的 README 成就 pin 已随新现实更新（28 项 pin 零残留，31 项双处落位）',
  s2176.includes("readme.includes('成就一览（全部 45 项进度'") && !s2176.includes('全部 28 项进度'));
ok('smoke_v2173 的 README 成就 pin 已随新现实更新（28 项 pin 零残留，31 项双处落位）',
  fs.readFileSync(path.join(ROOT, 'tests/smoke_v2173_aegis.mjs'), 'utf8')
    .includes("readme.includes('成就一览（全部 45 项进度'"));
ok('smoke_v2168 的 README 成就 pin 已随新现实更新（28 项 pin 零残留，31 项双处落位）',
  fs.readFileSync(path.join(ROOT, 'tests/smoke_v2168_hardtrue.mjs'), 'utf8')
    .includes("readme.includes('成就一览（全部 45 项进度'"));
ok('smoke_v2159 的 README 成就 pin 已随新现实更新（28 项 pin 零残留，31 项双处落位）',
  fs.readFileSync(path.join(ROOT, 'tests/smoke_v2159_skillach.mjs'), 'utf8')
    .includes("readme.includes('成就一览（全部 45 项进度'"));
ok('灯火同心 0/7 pin 已悉数随新现实更新为 0/8（v2152/v2159/v2168/v2173/v2176/v2177 六件源级复查）',
  ['smoke_v2152_bonequest.mjs', 'smoke_v2159_skillach.mjs', 'smoke_v2168_hardtrue.mjs', 'smoke_v2173_aegis.mjs', 'smoke_v2176_allchests.mjs', 'smoke_v2177_elites.mjs']
    .every((f) => fs.readFileSync(path.join(ROOT, 'tests/' + f), 'utf8').includes("=== '0/8'")));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
