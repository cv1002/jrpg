// v24.71 专项冒烟：潮灯镇「听钟人」新 NPC（新内容·纯风味·数据层三件套，承 v22.76 放灯童 /
// v22.13 说书人 / v22.34 客栈老板娘 / v22.49 货栈掌柜 / v22.50 酿药师「NPC 就是数据」先例）——村井正北
// (14,5) 的听钟人：村井（v22.47「井底那口钟还在替大家记着」）终于有人驻守。本冒烟守护：
// 版本锚点、源级落位（data.js 三件套 + GAME_VERSION + sprites.js bell mark）、NPC 数据契约（唯一键/
// 总数 39/38/台词结构/分档/trueBoss 彩蛋）、同图零回归（13 镇民 + 设施键位）、运行期全链路（DOM 桩 +
// main.js 真实导入：openTalk/interact/talkNext/npcQuestMark/resolveNpcTalk/voiceList/drawWorld）、
// README/package/CHANGELOG 同步、姊妹件套 pin 随新现实更新、旧代 v24.70 pin 全库零残留。
import { GAME_VERSION, NPCS, NPC_SPOTS, ACH_LIST, MAPS } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.71 潮灯镇「听钟人」新 NPC 冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v24.70 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.70', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 70)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const spritesSrc = read('../js/view/sprites.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

// —— 源级落位：data.js v24.71 注释 + 三件套 + GAME_VERSION + sprites.js bell 分支 ——
ok('data.js 含 v24.71 版本注释（听钟人三件套说明，注释按引入版次锚定 v24.71）', dataSrc.includes('v24.71 新 NPC·纯风味'));
ok('data.js GAME_VERSION 字面量已为 v24.71（旧 v24.70 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v24.71';") && !dataSrc.includes("const GAME_VERSION = 'v24.70';"));
ok('data.js 仍保留 v24.70 历史注释（第二十轮经验平滑注释未动）', dataSrc.includes('v24.70 数值平衡·后期经验曲线续平滑'));
ok('data.js NPC_SPOTS 含 14,5 → bellman 键', dataSrc.includes("'14,5': 'bellman'"));
ok('data.js NPCS 含 bellman 听钟人（name/mark/linesByStage 落位）', dataSrc.includes("bellman:{name:'听钟人', mark:'bell', linesByStage:["));
ok('data.js village.extras 含 { x: 14, y: 5, ty: \'NPC\' }', dataSrc.includes("{ x: 14, y: 5, ty: 'NPC' }"));
ok('sprites.js 含 v24.71 听钟人 bell 小铃分支（mark===\'bell\'）', spritesSrc.includes("mark==='bell'"));

// —— 数据契约：唯一键 / 总数 39 / NPCS 38 / 台词结构 / 非成就版零回归 ——
ok("NPC_SPOTS['14,5'] === 'bellman'", NPC_SPOTS['14,5'] === 'bellman');
ok('bellman 仅占一个坐标键（无重复映射）', Object.keys(NPC_SPOTS).filter((k) => NPC_SPOTS[k] === 'bellman').length === 1);
ok('NPC_SPOTS 总数 39（既有 38 键 + 听钟人 1 键，v24.71 随新现实更新）', Object.keys(NPC_SPOTS).length === 39, String(Object.keys(NPC_SPOTS).length));
ok('NPCS 总数 38（既有 37 处 + 听钟人 1 处，v24.71 随新现实更新）', Object.keys(NPCS).length === 38, String(Object.keys(NPCS).length));
const ent = NPCS.bellman;
ok('NPCS.bellman 存在且 name=听钟人 / mark=bell', !!ent && ent.name === '听钟人' && ent.mark === 'bell');
ok('bellman.linesByStage 三档（null/bossDefeated/galleryOpen，各两页）',
  Array.isArray(ent.linesByStage) && ent.linesByStage.length === 3 &&
  ent.linesByStage[0].gate === null && ent.linesByStage[1].gate === 'bossDefeated' && ent.linesByStage[2].gate === 'galleryOpen' &&
  ent.linesByStage.every((s) => Array.isArray(s.lines) && s.lines.length === 2),
  String(ent && ent.linesByStage && ent.linesByStage.map((s) => s.gate).join(',')));
ok('bellman.after 两页（trueBoss 彩蛋，各三行）', Array.isArray(ent.after) && ent.after.length === 2 && ent.after.every((p) => p.length === 3));
ok('bellman 无任务字段（零任务契约）', ent && !('quest' in ent) && !('giver' in ent));
ok('ACH_LIST 仍 76 项（本版非成就改动，零回归）', ACH_LIST.length === 76, String(ACH_LIST.length));
// 同图零回归：潮灯镇 13 镇民 + 设施键位逐字未动
const villageSpots = { '13,6': 'chief', '10,13': 'villager', '19,8': 'adventurer', '12,8': 'clerk', '2,4': 'sage', '14,8': 'granny', '15,12': 'grainman', '16,9': 'teller', '7,11': 'smith', '7,14': 'innkeeper', '8,10': 'shopkeep', '9,12': 'brewer', '19,7': 'lampboat' };
ok('同图 13 镇民 NPC_SPOTS 键位零回归', Object.entries(villageSpots).every(([k, v]) => NPC_SPOTS[k] === v));
ok('village.extras 含听钟人 (14,5) 且酿造锅 (10,12)/商店 S/旅馆 I 逐字未动',
  MAPS.village.extras.some((e) => e.x === 14 && e.y === 5 && e.ty === 'NPC') &&
  MAPS.village.extras.some((e) => e.x === 10 && e.y === 12 && e.ty === 'BREW') &&
  MAPS.village.rows[9][8] === 'S' && MAPS.village.rows[13].startsWith('1IIIII1'));
ok('听钟人坐标 (14,5) 四邻 (13,5)/(15,5)/(14,4)/(14,6) 皆可行走未占用（南邻 (14,6) 即村井 VILLAGE_WELL）',
  ['13,5', '15,5', '14,4', '14,6'].every((k) => !Object.prototype.hasOwnProperty.call(NPC_SPOTS, k)) &&
  MAPS.village.rows[5][13] === '0' && MAPS.village.rows[5][15] === '0' && MAPS.village.rows[4][14] === '0' && MAPS.village.rows[6][14] === '0');

// —— 运行期实证：DOM/音频/存储桩 + main.js 真实导入 ——
const noop = () => {};
const CAPTURED = [];
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
const { newGame } = await import('../js/core.js');
const { npcQuestPages, npcQuestMark, resolveNpcTalk } = await import('../js/quests.js');
const { openTalk, talkNext } = await import('../js/core.js');
const { interact } = await import('../js/world.js');
const { drawTalk } = await import('../js/view/menus.js');
const { voiceList } = await import('../js/view/menus.js');
const { drawWorld } = await import('../js/view/drawWorld.js');

// 档一：普通新档——npcQuestPages 直落 linesByStage[0] 两页
let hero = newGame('余烬');
S.G = hero;
let pages = npcQuestPages(hero, 'bellman');
ok('运行期：npcQuestPages 新档直落默认档两页', pages === ent.linesByStage[0].lines && pages.length === 2);
ok('运行期：默认档首页含「听钟人/井底那口钟/记着」台词', pages[0].join('').includes('听钟人') && pages[0].join('').includes('井底那口钟') && pages[0].join('').includes('记着'));
// 档二：bossDefeated
hero = newGame('灯见');
hero.bossDefeated = true;
S.G = hero;
pages = npcQuestPages(hero, 'bellman');
ok('运行期：bossDefeated 后直落第二档两页（灯芯归来）', pages === ent.linesByStage[1].lines && pages.length === 2);
ok('运行期：第二档首页含「灯芯回来了」', pages[0].join('').includes('灯芯回来了'));
// 档三：galleryOpen
hero = newGame('潮');
hero.bossDefeated = true;
hero.galleryOpen = true;
S.G = hero;
pages = npcQuestPages(hero, 'bellman');
ok('运行期：galleryOpen 后直落第三档两页（回廊开启）', pages === ent.linesByStage[2].lines && pages.length === 2);
ok('运行期：第三档首页含「回廊开了」', pages[0].join('').includes('回廊开了'));
// 档四：trueBoss after 彩蛋
hero = newGame('灯');
hero.trueBoss = true;
S.G = hero;
pages = npcQuestPages(hero, 'bellman');
ok('运行期：trueBoss 后 npcQuestPages 直落 after 两页', pages === ent.after && pages.length === 2);
ok('运行期：after 首页含「不响了/钟」彩蛋台词', pages[0].join('').includes('不响了') && pages[0].join('').includes('井底那口钟'));
// 零任务契约：无顶标、无任务对话副作用
hero = newGame('余烬');
S.G = hero;
ok('运行期：npcQuestMark 对 bellman 回退 null（无任务顶标）', npcQuestMark(hero, 'bellman') === null);
ok('运行期：resolveNpcTalk 对 bellman 返回 null（零任务结算）', resolveNpcTalk(hero, 'bellman') === null);
// openTalk → talk 场景；drawTalk 渲染出台词
hero = newGame('灯');
S.G = hero;
S.scene = 'world';
openTalk('bellman');
ok("运行期：openTalk('bellman') 进 talk 场景（curNpc/talkPages 落位）", S.scene === 'talk' && S.curNpc === 'bellman' && S.talkPages.length === 2);
CAPTURED.length = 0;
drawTalk();
const drawnTalk = CAPTURED.join('\n');
ok('运行期：drawTalk 渲染出「听钟人」对话文本', drawnTalk.includes('听钟人'));
// interact 真实通路：站在 (14,4) 面南 → 与听钟人对话
S.G.x = 14; S.G.y = 4; S.dir = 'D';
S.scene = 'world';
interact();
ok("运行期：interact 面南 (14,5) 真实开 bellman 对话", S.scene === 'talk' && S.curNpc === 'bellman');
// talkNext 翻页 → 第二页 → 再翻回 world
S.talkLineAt = 0; // 跳过打字机补全（typed 行为由 core.talkNext 自带路径覆盖）
talkNext();
ok('运行期：talkNext 翻至第二页（talkPage=1）', S.scene === 'talk' && S.talkPage === 1);
S.talkLineAt = 0;
talkNext();
ok('运行期：talkNext 末页结束对话回 world', S.scene === 'world');
// voiceList 派生：加/删 NPC 自动跟随（38 处）
const v0 = voiceList({});
ok('运行期：voiceList 空档 38 条全 met=false（NPCS 38 处派生）', v0.length === 38 && v0.every((x) => !x.met), String(v0.length));
const vFull = voiceList({ talked: Object.keys(NPCS).slice() });
ok('运行期：voiceList 全聊 38 条全 met=true（灯下之声口径自动跟随）', vFull.length === 38 && vFull.every((x) => x.met));
// drawWorld 渲染不抛错（村井旁新 NPC 入画）
S.G = newGame('余烬');
S.scene = 'world';
let worldOk = true;
try { CAPTURED.length = 0; drawWorld(); } catch (e) { worldOk = false; console.log('   drawWorld err:', e.message); }
ok('运行期：drawWorld 村井旁渲染不抛错', worldOk);

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树串尾已延伸至 smoke_v2471_bellman（... + smoke_v2470_xpcurve20 + smoke_v2471_bellman（npm test 串跑））',
  readme.includes('smoke_v2470_xpcurve20 + smoke_v2471_bellman（npm test 串跑）'));
ok('README 件套口径为二百九十五件套（二百九十四件套清除）',
  readme.includes('冒烟二百九十五件套（二百九十四件套清除）'));
ok('README 含 v24.71 守护描述（潮灯镇听钟人新 NPC 守护，按引入版次锚定 v24.71）', readme.includes('v24.71 起含潮灯镇「听钟人」新 NPC 守护'));
ok('README 含 smoke_v2471_bellman 入库（295 份）', readme.includes('smoke_v2471_bellman 入库（295 份）'));
ok('README 仍保留 smoke_v2470_xpcurve20 入库（295 份）历史口径', readme.includes('smoke_v2470_xpcurve20 入库（295 份）'));
ok('README 潮灯镇行含听钟人描述（第十四位可对话角色）',
  readme.includes('村井旁新增 听钟人') && readme.includes('第十四位可对话角色'));
ok('README 成就口径「76 项」双处不变（本版非成就版，零回归）',
  readme.includes('成就一览（全部 76 项进度') && readme.includes('**76 项成就**'));
ok('package.json 已收录 smoke_v2471_bellman（npm test 串跑第 295 份）',
  pkg.includes('node tests/smoke_v2470_xpcurve20.mjs && node tests/smoke_v2471_bellman.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 295 件套', testChain === 295, String(testChain));
ok('CHANGELOG 含 v24.71 条目（顶 pin）', changelog.startsWith('## v24.71 '));
ok('CHANGELOG v24.71 条目含「听钟人/第十四位」', changelog.includes('听钟人') && changelog.includes('第十四位可对话角色'));
ok('CHANGELOG 仍保留 v24.70 条目标题（历史积累）', changelog.includes('## v24.70 数值平衡'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const testsDir = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainAll = ['smoke.mjs', ...[...pkg.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''))];
const chainFiles = ['smoke.mjs', ...[...pkg.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1])];
const chainSet = new Set(chainFiles);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录件套 = 295 与实跑链恒等', files.length === 295, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹套件 pin 随新现实更新 + 旧代 v24.70 pin 零残留 ——
const s2470 = read('smoke_v2470_xpcurve20.mjs');
ok('smoke_v2470 的 GAME_VERSION 字面量 pin 已更新为 v24.71', s2470.includes("const GAME_VERSION = 'v24.71';"));
ok('smoke_v2470 的 CHANGELOG 顶 pin 已更新为 ## v24.71', s2470.includes("startsWith('## v24.71 '"));
ok('smoke_v2470 的件套 pin 已更新为二百九十五件套（二百九十四件套清除）', s2470.includes('二百九十五件套（二百九十四件套清除）'));
ok('smoke_v2470 的 README 串尾 pin 已延伸至 smoke_v2471_bellman', s2470.includes('smoke_v2470_xpcurve20 + smoke_v2471_bellman（npm test 串跑）'));
ok('smoke_v2470 的 package.json 串尾 pin 已延伸至 smoke_v2471_bellman', s2470.includes('node tests/smoke_v2470_xpcurve20.mjs && node tests/smoke_v2471_bellman.mjs'));
ok('smoke_v2470 的链尾 pin 已推进至 smoke_v2471_bellman（第 295 份）', s2470.includes("=== 'smoke_v2471_bellman'"));
ok('smoke_v2470 的入库 pin 已推进至 295 份', s2470.includes('入库（295 份）'));
const s2436 = read('smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（294 专项 / 295 总件套）且尚无 296 口径哨兵',
  s2436.includes('suiteFiles.length === 294 && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length === 295') &&
  s2436.includes('!readme.includes(\'冒烟二百九十六件套\')') && s2436.includes('!readme.includes(\'（296 份）\')'));
const s2415 = read('smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v2471_bellman（第 295 份）', s2415.includes("chain[chain.length - 1] === 'smoke_v2471_bellman'"));
ok('smoke_v2415 树串 token 数已推进至 295', s2415.includes('treeTok.length === 295'));
ok('smoke_v2415 哨兵「尚无 296」口径（二百九十六件套 bare 否定式）', s2415.includes("!readme.includes('二百九十六件套')"));
const s2234 = read('smoke_v2234_innkeeper.mjs');
ok('smoke_v2234 的 NPC_SPOTS 总数 pin 已推进至 39', s2234.includes('NPC_SPOTS).length === 39'));
const s2314 = read('smoke_v2314_voices.mjs');
ok('smoke_v2314 的 NPCS 精确 pin 已推进至 38（ALL.length === 38）', s2314.includes('ALL.length === 38'));
ok('smoke_v2314 的 voiceList 运行期 38 已推进（空档/全聊 38）', s2314.includes('v.length === 38'));
// 旧代 v24.70 pin 零残留扫描（豁免本套件与上一版套件否定式）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v2471_bellman.mjs' || f === 'smoke_v2470_xpcurve20.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDir), 'utf8');
  const hits = [];
  if (s2.includes('const GAME_VERSION = ' + "'v24.70';")) hits.push('gv');
  if (s2.includes('GAME_VERSION === ' + "'v24.70'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.70")) hits.push('cw');
  if (s2.includes('入库（29' + '4 份）')) hits.push('ruku');
  if (s2.includes('二百九十四件套（二百九十三' + '件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 29' + '4')) hits.push('fl');
  if (s2.includes('chainAll.length === 29' + '4')) hits.push('cal');
  if (s2.includes('chain.length === 29' + '3')) hits.push('cl');
  if (s2.includes('treeTok.length === 29' + '4')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v2470_" + "xpcurve20'")) hits.push('tail');
  if (s2.includes('NPC_SPOTS).length === 3' + '8')) hits.push('ns38');
  if (s2.includes('NPCS).length === 3' + '7')) hits.push('np37');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.70 GAME_VERSION/顶 pin/295 口径/38·37 计数 pin（哨兵链，豁免本套件与上一版）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.71 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
