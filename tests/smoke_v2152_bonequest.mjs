// v21.52 专项冒烟：星井矿脉新 NPC「拾骨人」+ 讨伐支线「未归的矿灯」（side_bone）+ 单支线成就「亡骨还乡」——
// 纯内容扩充（新支线/新 NPC，零结算改动、零新逻辑：任务状态机/对话解析/奖励结算全走既有 QUESTS 驱动通路）：
// 数据层四件套（cave.extras (5,10) + NPC_SPOTS '5,10' + NPCS.digger + sprites NPC_SHEET digger→mwSage），
// QUESTS.side_bone 四态任务页（offer/active/turnin/done，BONE_GOAL 单一数据源），ACH_LIST 22→23。
// 本冒烟守护：版本锚点、全局坐标防撞（NPC_SPOTS 跨地图共用键、唯一映射、既有 16 键未动、全图 extras 扫描）、
// NPCS/QUESTS/ACH_LIST 契约、运行期（loadMap 落位 + Enter/E 真实交互开对话 + questStatus
// offer→active→turnin→done 全链路与奖励/成就结算 + 旧档兼容）、矿脉无泉水事实零回归、
// README/package.json 同步 + smoke_v2151 件套断言去硬化（v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION, NPCS, NPC_SPOTS, MAPS, TY, QUESTS, ACH_LIST, BONE_GOAL, STONE_GOAL, EMBER_GOAL } from '../js/data.js';
import { npcQuestPages, npcQuestMark, questStatus, resolveNpcTalk, questJournal } from '../js/quests.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v21.51 冒烟先例：先装桩再 import main.js）——
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

console.log('— v21.52 拾骨人·未归的矿灯（星井矿脉讨伐支线）冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.51 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.51', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 52)), GAME_VERSION);
ok('data.js 含 v21.52 注释（拾骨人/未归的矿灯说明）', dSrc.includes('v21.52'));

// —— 数据层：BONE_GOAL 单一数据源（MIST/STONE/EMBER_GOAL 同族）——
ok('BONE_GOAL===3 且已从 data.js 导出（与 STONE_GOAL 同档）', BONE_GOAL === 3 && STONE_GOAL === 3 && EMBER_GOAL === 1);

// —— 数据层：NPC_SPOTS 全局坐标键（跨地图共用，不得撞车）——
ok("NPC_SPOTS['5,10']===digger", NPC_SPOTS['5,10'] === 'digger', NPC_SPOTS['5,10']);
ok('digger 仅占一个坐标键（无重复映射）', Object.keys(NPC_SPOTS).filter((k) => NPC_SPOTS[k] === 'digger').length === 1);
ok('既有 16 个 NPC/石碑键未被误动', ['13,6', '10,13', '19,8', '12,8', '2,4', '13,9', '3,1', '2,3', '17,12', '17,11', '5,1', '10,1', '15,1', '20,1', '8,5', '14,8']
  .every((k) => NPC_SPOTS[k] != null));
// 全局坐标防撞演练：全图 extras 扫描，(5,10) 必须恰出现 1 次且在 cave、ty 为 NPC
const at510 = [];
for (const [mname, mdef] of Object.entries(MAPS)) {
  for (const ex of (mdef.extras || [])) {
    if (ex.x === 5 && ex.y === 10) at510.push(mname + ':' + ex.ty);
  }
}
ok('(5,10) 全图 extras 仅 cave 一处 NPC（他图无占用/无撞车）',
  at510.length === 1 && at510[0] === 'cave:NPC', at510.join(','));
ok("data.js cave.extras 源级落位（{ x: 5, y: 10, ty: 'NPC' }）且含 v21.52 注释",
  dSrc.includes("{ x: 5, y: 10, ty: 'NPC' }") && dSrc.includes('拾骨人（v21.52'));

// —— NPCS.digger 契约 ——
const dg = NPCS.digger;
ok('NPCS.digger 存在且 name===拾骨人 / mark===hood', !!dg && dg.name === '拾骨人' && dg.mark === 'hood', dg && dg.name);
ok('NPCS.digger 含兜底静态 lines（任务页恒优先，lines 仅回退）且每页 [Enter] 收尾',
  !!dg && Array.isArray(dg.lines) && dg.lines.length >= 1 &&
  dg.lines.every((pg) => Array.isArray(pg) && pg.every((ln) => typeof ln === 'string') && /\[Enter\]/.test(pg[pg.length - 1])));

// —— QUESTS.side_bone 契约（承 side_mist/side_stone/side_ember 讨伐采集型模式）——
const qb = QUESTS.side_bone;
ok('QUESTS.side_bone 存在：kind side + store + npc/giver 双指 digger',
  !!qb && qb.kind === 'side' && qb.store === true && qb.npc === 'digger' && qb.giver === 'digger');
ok('side_bone 无 unlockOn（从开局即 offer，保留完整接取流程，承 side_ember 同款）', qb && !('unlockOn' in qb));
ok('side_bone cond/condProg 与 BONE_GOAL 同源（2 只不满足、3 只转可交付、进度文案 2/3 只）',
  qb && qb.cond({ bestiary: { '骷髅兵': 2 } }) === false &&
  qb.cond({ bestiary: { '骷髅兵': 3 } }) === true &&
  qb.condProg({ bestiary: { '骷髅兵': 2 } }) === `2/${BONE_GOAL} 只`);
ok('side_bone 奖励 80 金 + 1 高级灵药（介于 side_stone 60 与 side_ember 100 之间）',
  qb && qb.reward && qb.reward.gold === 80 && qb.reward.potion2 === 1 && !qb.reward.item);
ok('side_bone 任务页四态齐备（offer/active/turnin/done）且每页 [Enter] 收尾',
  qb && qb.talk && ['offer', 'turnin', 'done'].every((k) => Array.isArray(qb.talk[k]) &&
    qb.talk[k].every((pg) => Array.isArray(pg) && /\[Enter\]/.test(pg[pg.length - 1]))) &&
  typeof qb.talk.active === 'function');
ok('side_bone offer 页由 BONE_GOAL 派生（「帮我打 3 只」非裸字面量）',
  qb && qb.talk.offer[0].some((ln) => ln.includes(`${BONE_GOAL} 只`)));

// —— ACH_LIST：亡骨还乡（单支线成就，承 quest/cartman/names/mist/stone/ember 模式）——
const achBone = ACH_LIST.find((a) => a.id === 'bone');
ok('ACH_LIST 含 bone「亡骨还乡」且 id 唯一',
  !!achBone && achBone.name === '亡骨还乡' && ACH_LIST.filter((a) => a.id === 'bone').length === 1);
// v21.59 随新现实更新（承 v21.48 smoke_v2115 r[2] 计数断言 2→3 先例）：skills 成就「诸技通明」
// 入列后 ACH_LIST 总数 23→24——本断言守护「bone 新增一项入列」语义（bone 存在且总数不少于 23），
// 精确总数移交当版冒烟（smoke_v2159 ===24）守护，不再在此硬编码。
ok('ACH_LIST 含 bone 且总数 ≥23（v21.59 起精确总数由当版冒烟守护）', !!achBone && ACH_LIST.length >= 23, String(ACH_LIST.length));
ok('bone 成就判定读 quests.side_bone（未做 false / 已做 true）',
  achBone.ok({ quests: {} }) === false && achBone.ok({ quests: { side_bone: 'done' } }) === true);
// 灯火同心（allquests）自动跟随：支线总数由 QUESTS 派生（6 → 7）
const achAll = ACH_LIST.find((a) => a.id === 'allquests');
ok('灯火同心支线分母自动跟随为 7（side_bone 入列，无需改 achievement 本体）',
  achAll && achAll.prog({ quests: {} }) === '0/7' && achAll.d.includes('7 个支线'), achAll && achAll.prog({ quests: {} }));
ok('allquests 对只做 side_bone 的存档不误判完成',
  achAll.ok({ quests: { side_bone: 'done' } }) === false);

// —— 运行期：questStatus 状态机全链路（接取→讨伐→交付→奖励→成就）——
const h1 = { gold: 10, potion2: 0, bestiary: {} };
ok('新档 questStatus(side_bone)===offer（无 unlockOn 开局可接）', questStatus(h1, 'side_bone') === 'offer');
ok('npcQuestMark(offer)===「❕ 可接委托」（世界头顶任务顶标同源）', npcQuestMark(h1, 'digger') === '❕ 可接委托');
const act1 = resolveNpcTalk(h1, 'digger');
ok('resolveNpcTalk 接取：kind accept + 名字「未归的矿灯」+ quests.side_bone 落 active',
  !!act1 && act1.kind === 'accept' && act1.name === '未归的矿灯' && h1.quests.side_bone === 'active');
h1.bestiary['骷髅兵'] = 2;
ok('讨伐 2/3 时仍 active（cond 未达）且进度文案实时',
  questStatus(h1, 'side_bone') === 'active' && questJournal(h1).find((e) => e.id === 'side_bone').objective.includes('2/3 只'));
h1.bestiary['骷髅兵'] = 3;
ok('讨伐 3/3 时转 turnin（cond 达成）且 npcQuestMark 变「❕ 可交任务」',
  questStatus(h1, 'side_bone') === 'turnin' && npcQuestMark(h1, 'digger') === '❕ 可交任务');
const goldBefore = h1.gold;
const act2 = resolveNpcTalk(h1, 'digger');
ok('resolveNpcTalk 交付：kind reward + 金币 +80 + 灵药 +1 + 状态落 done',
  !!act2 && act2.kind === 'reward' && act2.gold === 80 && act2.potion2 === 1 &&
  h1.gold === goldBefore + 80 && h1.potion2 === 1 && h1.quests.side_bone === 'done');
ok('done 后成就 bone 解锁、npcQuestMark 归零（不再提示）',
  achBone.ok(h1) === true && npcQuestMark(h1, 'digger') === null);
ok('done 后 resolveNpcTalk 返回 null（不重复发奖）', resolveNpcTalk(h1, 'digger') === null && h1.gold === goldBefore + 80);

// —— 任务页运行期求值（npcQuestPages 对函数型 active 页调用期求值）——
const h2 = { bestiary: { '骷髅兵': 1 }, quests: { side_bone: 'active' } };
ok('active 函数页按 hero 实时报进度（已安顿 1/3 只）+ 弱火提示（与图鉴骷髅兵 weak:fire 口径一致）',
  npcQuestPages(h2, 'digger')[0].some((ln) => ln.includes(`1/${BONE_GOAL} 只`)) &&
  npcQuestPages(h2, 'digger')[0].some((ln) => ln.includes('怕火')));
ok('offer 页含委托叙事（没能走出矿洞的兄弟）', npcQuestPages({}, 'digger')[0].some((ln) => ln.includes('没能走出矿洞')));
ok('done 页含「（支线任务·已完成）」', npcQuestPages(h1, 'digger').some((pg) => pg.some((ln) => ln.includes('（支线任务·已完成）'))));

// —— 旧档兼容：有旧支线进度、无 side_bone 字段的老存档自动落 offer（零迁移）——
ok('旧档兼容：quests 只有 side_mushroom 的老档 questStatus 自动落 offer（无需 migrateQuests 播种）',
  questStatus({ quests: { side_mushroom: 'done' }, bestiary: {} }, 'side_bone') === 'offer');

// —— 运行期：loadMap 落位 + Enter/E 真实交互开对话 ——
loadMap('cave');
ok('(5,10) 落位为 NPC 瓦片（placeExtras 覆盖）', at(5, 10) === TY.NPC, String(at(5, 10)));
ok('(5,11) 南走廊可行走（对话站位——cave 的 PATH 经 replaceTiles 转 CAVE 岩地，仍可行走）/ (2,3) 老矿工零回归',
  at(5, 11) === TY.CAVE && at(2, 3) === TY.NPC && NPC_SPOTS['2,3'] === 'miner');
S.G.x = 5; S.G.y = 11; S.dir = 'U'; S.scene = 'world';
await screens.world.onKey({ key: 'Enter' });
ok('面向拾骨人按 Enter：进入对话（S.scene==talk）且 curNpc===digger',
  S.scene === 'talk' && S.curNpc === 'digger', S.scene + '/' + S.curNpc);
ok('对话第 1 页为 offer 页（新档 S.G 无 side_bone 进度 → 可接委托）',
  Array.isArray(S.talkPages) && S.talkPages[0] && S.talkPages[0].some((ln) => ln.includes('没能走出矿洞')));
S.scene = 'world';
await screens.world.onKey({ key: 'E' });
ok('E 键同效（v21.29 交互别名对新 NPC 零回归）', S.scene === 'talk' && S.curNpc === 'digger', S.scene + '/' + S.curNpc);
S.scene = 'world';

// —— 矿脉无泉水事实零回归（v21.17/v21.40 既设：加 NPC 不引入免费恢复点）——
ok('MAPS.cave.extras 仍无 FOUNTAIN/INN（矿脉无免费恢复点事实零回归）',
  !(MAPS.cave.extras || []).some((e) => e.ty === 'FOUNTAIN' || e.ty === 'INN'));

// —— 造型映射（sprites.js 源级）——
const spSrc = fs.readFileSync(path.join(ROOT, 'js/view/sprites.js'), 'utf8');
ok("sprites.js NPC_SHEET 已映射 digger→mwSage（兜帽长者袍，守名者/掌灯阿婆同款）",
  spSrc.includes("digger: 'mwSage'"));

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README tests 树收录 smoke_v2152_bonequest', readme.includes('smoke_v2152_bonequest'));
// v21.53 去硬化（v21.7 惯例）：件套精确计数移交当版冒烟守护，本件改存活性口径——
// 仍含「冒烟/件套」且旧口径「（四十七件套清除）」已清除。
ok('README 件套口径为存活性断言（v21.53 起件数由新版冒烟守护：四十九件套（四十八件套清除））',
  readme.includes('冒烟') && readme.includes('件套') &&
  !readme.includes('（四十七件套清除）'));
ok('README 含 v21.52 守护描述（拾骨人新 NPC 与讨伐支线「未归的矿灯」守护）',
  readme.includes('拾骨人新 NPC 与讨伐支线「未归的矿灯」守护'));
// v21.59 随新现实更新：README 成就口径由「23 项」双处递增为「24 项」双处（skills 成就入列），
// 拾骨人条目事实不变——本断言守护「拾骨人 + 成就总数双处同步」语义，精确总数由 smoke_v2159 守护。
ok('README 星井矿脉条目含拾骨人 + 成就口径随 v21.59 新现实为「24 项」双处同步',
  readme.includes('拾骨人') && (readme.match(/24 项/g) || []).length >= 2);
ok('package.json 已收录 smoke_v2152_bonequest（npm test 串跑第 48 份）', pkg.includes('smoke_v2152_bonequest.mjs'));
const s2151 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2151_elitegolem.mjs'), 'utf8');
ok('smoke_v2151 的 README 件套口径断言已去硬化（存活性口径落位，旧精确表达式零残留）',
  s2151.includes("!readme.includes('（四十六件套清除）')") &&
  !s2151.includes("readme.includes('四十七件套（四十六件套清除）')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
