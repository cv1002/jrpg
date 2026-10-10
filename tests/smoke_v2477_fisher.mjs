// v24.77 专项冒烟：潮灯镇「渔翁」新 NPC（新内容·纯风味·数据层三件套，承 v22.76 放灯童 /
// v22.13 说书人 / v22.34 客栈老板娘 / v22.49 货栈掌柜 / v22.50 酿药师 / v24.71 听钟人「NPC 就是数据」
// 先例）——水塘东岸 (17,7) 的渔翁：水塘（v22.57 水塘灯影/v24.58 夜泊纸灯）东岸终于有人驻守。本冒烟守护：
// 版本锚点、源级落位（data.js 三件套 + GAME_VERSION + sprites.js fish mark）、NPC 数据契约（唯一键/
// 总数 40/39/台词结构/分档/trueBoss 彩蛋）、同图零回归（13 镇民 + 设施键位）、运行期全链路（DOM 桩 +
// main.js 真实导入：openTalk/interact/talkNext/resolveNpcTalk/npcQuestPages/voiceList/drawWorld）、
// README/package/CHANGELOG 同步、姊妹件套 pin 随新现实更新、旧代 v24.76 pin 全库零残留。
import { GAME_VERSION, NPCS, NPC_SPOTS, ACH_LIST, MAPS } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.77 潮灯镇「渔翁」新 NPC 冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v24.76 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.76', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 76)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const spritesSrc = read('../js/view/sprites.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

// —— 源级落位：data.js v24.77 注释 + 三件套 + GAME_VERSION + sprites.js fish 分支 ——
ok('data.js 含 v24.77 版本注释（渔翁三件套说明，注释按引入版次锚定 v24.77）', dataSrc.includes('v24.77 新 NPC·纯风味'));
ok('data.js GAME_VERSION 字面量已为 v24.77（旧 v24.76 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v24.77';") && !dataSrc.includes("const GAME_VERSION = 'v24.76';"));
ok('data.js 仍保留 v24.76 历史注释（成就解锁横幅计数现场注释未动）', dataSrc.includes('v24.76 体验打磨·信息透明·计数现场'));
ok('data.js NPC_SPOTS 含 17,7 → fisher 键', dataSrc.includes("'17,7': 'fisher'"));
ok('data.js NPCS 含 fisher 渔翁（name/mark/linesByStage 落位）', dataSrc.includes("fisher:{name:'渔翁', mark:'fish', linesByStage:["));
ok('data.js village.extras 含 { x: 17, y: 7, ty: \'NPC\' }', dataSrc.includes("{ x: 17, y: 7, ty: 'NPC' }"));
ok('sprites.js 含 v24.77 渔翁 fish 小鱼分支（mark===\'fish\'）', spritesSrc.includes("mark==='fish'"));

// —— 数据契约：唯一键 / 总数 40 / NPCS 39 / 台词结构 / 非成就版零回归 ——
ok("NPC_SPOTS['17,7'] === 'fisher'", NPC_SPOTS['17,7'] === 'fisher');
ok('fisher 仅占一个坐标键（无重复映射）', Object.keys(NPC_SPOTS).filter((k) => NPC_SPOTS[k] === 'fisher').length === 1);
ok('NPC_SPOTS 总数 40（既有 39 键 + 渔翁 1 键，v24.77 随新现实更新）', Object.keys(NPC_SPOTS).length === 40, String(Object.keys(NPC_SPOTS).length));
ok('NPCS 总数 39（既有 38 处 + 渔翁 1 处，v24.77 随新现实更新）', Object.keys(NPCS).length === 39, String(Object.keys(NPCS).length));
const ent = NPCS.fisher;
ok('NPCS.fisher 存在且 name=渔翁 / mark=fish', !!ent && ent.name === '渔翁' && ent.mark === 'fish');
ok('fisher.linesByStage 三档（null/bossDefeated/galleryOpen，各两页）',
  Array.isArray(ent.linesByStage) && ent.linesByStage.length === 3 &&
  ent.linesByStage[0].gate === null && ent.linesByStage[1].gate === 'bossDefeated' && ent.linesByStage[2].gate === 'galleryOpen' &&
  ent.linesByStage.every((s) => Array.isArray(s.lines) && s.lines.length === 2),
  String(ent && ent.linesByStage && ent.linesByStage.map((s) => s.gate).join(',')));
ok('fisher.after 两页（trueBoss 彩蛋，各三行）', Array.isArray(ent.after) && ent.after.length === 2 && ent.after.every((p) => p.length === 3));
ok('fisher 无任务字段（零任务契约）', ent && !('quest' in ent) && !('giver' in ent));
ok('ACH_LIST 仍 76 项（本版非成就改动，零回归）', ACH_LIST.length === 76, String(ACH_LIST.length));
// 同图零回归：潮灯镇 14 镇民/旅人 + 设施键位逐字未动
const villageSpots = { '13,6': 'chief', '10,13': 'villager', '19,8': 'adventurer', '12,8': 'clerk', '2,4': 'sage', '14,8': 'granny', '15,12': 'grainman', '16,9': 'teller', '7,11': 'smith', '7,14': 'innkeeper', '8,10': 'shopkeep', '9,12': 'brewer', '19,7': 'lampboat', '14,5': 'bellman' };
ok('同图 14 镇民/旅人 NPC_SPOTS 键位零回归', Object.entries(villageSpots).every(([k, v]) => NPC_SPOTS[k] === v));
ok('village.extras 含渔翁 (17,7) 且酿造锅 (10,12)/商店 S/旅馆 I 逐字未动',
  MAPS.village.extras.some((e) => e.x === 17 && e.y === 7 && e.ty === 'NPC') &&
  MAPS.village.extras.some((e) => e.x === 10 && e.y === 12 && e.ty === 'BREW') &&
  MAPS.village.rows[9][8] === 'S' && MAPS.village.rows[13].startsWith('1IIIII1'));
ok('渔翁坐标 (17,7) 西/北邻 (16,7)/(17,6) 皆水面 \'3\'、东/南邻 (18,7)/(17,8) 皆可行走 \'0\' 未占用',
  ['18,7', '17,8'].every((k) => !Object.prototype.hasOwnProperty.call(NPC_SPOTS, k)) &&
  MAPS.village.rows[7][16] === '3' && MAPS.village.rows[6][17] === '3' &&
  MAPS.village.rows[7][18] === '0' && MAPS.village.rows[8][17] === '0');

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

// 档一：普通新档——零任务 NPC：npcQuestPages 回退到 linesByStage 默认档两页
let hero = newGame('余烬');
S.G = hero;
ok('运行期：npcQuestPages 零任务回退到 linesByStage 默认档（两页）',
  (() => { const p = npcQuestPages(hero, 'fisher'); return Array.isArray(p) && p.length === 2; })());
ok('运行期：默认档台词含「旧灯」与「塘」同源叙事', (() => { const p = npcQuestPages(hero, 'fisher'); return p && p[0].join('').includes('渔翁') && p[0].join('').includes('旧灯'); })());
ok('运行期：resolveNpcTalk 零任务返回 null（无待办）', resolveNpcTalk(hero, 'fisher') === null);
ok('运行期：npcQuestMark 零任务无顶标（null）', npcQuestMark(hero, 'fisher') === null);
// 档二：bossDefeated/galleryOpen 分档在数据层
hero = newGame('灯见');
hero.bossDefeated = true;
S.G = hero;
ok('运行期：bossDefeated 后默认档台词切换（灯芯回来了段）', (() => { const p = npcQuestPages(hero, 'fisher'); return p && p[0].join('').includes('灯芯回来了'); })());
hero = newGame('潮');
hero.bossDefeated = true;
hero.galleryOpen = true;
S.G = hero;
ok('运行期：galleryOpen 后默认档台词切换（回廊一开段）', (() => { const p = npcQuestPages(hero, 'fisher'); return p && p[0].join('').includes('回廊一开'); })());
// 档三：trueBoss → after 两页彩蛋
hero = newGame('灯');
hero.trueBoss = true;
S.G = hero;
ok('运行期：trueBoss 后 npcQuestPages 落 after 两页彩蛋（塘水清了·月亮回来了）',
  (() => { const p = npcQuestPages(hero, 'fisher'); return Array.isArray(p) && p.length === 2 && p[0].join('').includes('清喽') && p[1].join('').includes('只捞鱼'); })());
// openTalk → talk 场景；drawTalk 渲染出台词
hero = newGame('灯');
S.G = hero;
S.scene = 'world';
openTalk('fisher');
ok("运行期：openTalk('fisher') 进 talk 场景（curNpc/talkPages 落位 · linesByStage 默认为 2 页）", S.scene === 'talk' && S.curNpc === 'fisher' && S.talkPages.length === 2);
ok('运行期：openTalk 已记入 hero.talked（社交成就计数跟随）', Array.isArray(hero.talked) && hero.talked.includes('fisher'));
CAPTURED.length = 0;
drawTalk();
const drawnTalk = CAPTURED.join('\n');
ok('运行期：drawTalk 渲染出「渔翁」对话文本', drawnTalk.includes('渔翁'));
// interact 真实通路：站在 (17,8) 面北 → 与渔翁对话
S.G.x = 17; S.G.y = 8; S.dir = 'U';
S.scene = 'world';
interact();
ok("运行期：interact 面北 (17,7) 真实开 fisher 对话", S.scene === 'talk' && S.curNpc === 'fisher');
// talkNext 首 Enter（打字机已补全）→ 第二页；再 Enter → 回 world（零任务两页走完）
S.talkLineAt = 0;
talkNext();
ok('运行期：talkNext 首 Enter 翻到第二页（仍在 talk）', S.scene === 'talk' && S.talkPage === 1);
S.talkLineAt = 0;
talkNext();
ok('运行期：talkNext 再 Enter 走完两页回 world（零任务无结算）', S.scene === 'world' && Object.keys(S.G.quests || {}).length === 0);
// voiceList 派生：加/删 NPC 自动跟随（39 处）
const v0 = voiceList({});
ok('运行期：voiceList 空档 39 条全 met=false（NPCS 39 处派生）', v0.length === 39 && v0.every((x) => !x.met), String(v0.length));
const vFull = voiceList({ talked: Object.keys(NPCS).slice() });
ok('运行期：voiceList 全聊 39 条全 met=true（灯下之声口径自动跟随）', vFull.length === 39 && vFull.every((x) => x.met));
// drawWorld 渲染不抛错（水塘东岸新 NPC 入画）
S.G = newGame('余烬');
S.scene = 'world';
let worldOk = true;
try { CAPTURED.length = 0; drawWorld(); } catch (e) { worldOk = false; console.log('   drawWorld err:', e.message); }
ok('运行期：drawWorld 水塘东岸渲染不抛错', worldOk);

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树串尾已延伸至 smoke_v2477_fisher（... + smoke_v2476_achprog + smoke_v2477_fisher（npm test 串跑））',
  readme.includes('smoke_v2476_achprog + smoke_v2477_fisher（npm test 串跑）'));
ok('README 件套口径为三百件套（二百九十九件套清除）',
  readme.includes('冒烟三百件套（二百九十九件套清除）'));
ok('README 含 v24.77 守护描述（潮灯镇渔翁新 NPC 守护，按引入版次锚定 v24.77）', readme.includes('v24.77 起含潮灯镇「渔翁」新 NPC 守护'));
ok('README 含 smoke_v2477_fisher 入库（300 份）', readme.includes('smoke_v2477_fisher 入库（300 份）'));
ok('README 仍保留 smoke_v2476_achprog 入库（300 份）历史口径', readme.includes('smoke_v2476_achprog 入库（300 份）'));
ok('README 潮灯镇行含渔翁描述（第十五位可对话角色）',
  readme.includes('水塘东岸新增 渔翁') && readme.includes('第十五位可对话角色'));
ok('README 成就口径「76 项」双处不变（本版非成就版，零回归）',
  readme.includes('成就一览（全部 76 项进度') && readme.includes('**76 项成就**'));
ok('package.json 已收录 smoke_v2477_fisher（npm test 串跑第 300 份）',
  pkg.includes('node tests/smoke_v2476_achprog.mjs && node tests/smoke_v2477_fisher.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 300 件套', testChain === 300, String(testChain));
ok('CHANGELOG 含 v24.77 条目（顶 pin）', changelog.startsWith('## v24.77 '));
ok('CHANGELOG v24.77 条目含「渔翁/第十五位」', changelog.includes('渔翁') && changelog.includes('第十五位可对话角色'));
ok('CHANGELOG 仍保留 v24.76 条目标题（历史积累）', changelog.includes('## v24.76 体验打磨'));

// —— tests 目录与实跑链一一对应（无孤儿件套、无漏跑件套）——
const testsDir = new URL('../tests/', import.meta.url);
const files = fs.readdirSync(testsDir).filter((f) => f.endsWith('.mjs')).sort((a, b) => a.localeCompare(b));
const chainAll = ['smoke.mjs', ...[...pkg.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1].replace(/\.mjs$/, ''))];
const chainFiles = ['smoke.mjs', ...[...pkg.matchAll(/node tests\/(smoke_v\d+_\w+\.mjs)/g)].map((m) => m[1])];
const chainSet = new Set(chainFiles);
const orphans = files.filter((f) => !chainSet.has(f));
const missed = [...chainSet].filter((f) => !files.includes(f));
ok('tests 目录件套 = 300 与实跑链恒等', files.length === 300, String(files.length));
ok('tests 目录与实跑链零孤儿（每个文件都在链上）', orphans.length === 0, orphans.join(','));
ok('实跑链与 tests 目录零漏跑（链上每件都存在于 tests/）', missed.length === 0, missed.join(','));

// —— 哨兵链：姊妹件套 pin 随新现实更新 + 旧代 v24.76 pin 零残留 ——
const s2476 = read('smoke_v2476_achprog.mjs');
ok('smoke_v2476 的 GAME_VERSION 字面量 pin 已更新为 v24.77', s2476.includes("const GAME_VERSION = 'v24.77';"));
ok('smoke_v2476 的 CHANGELOG 顶 pin 已更新为 ## v24.77', s2476.includes("startsWith('## v24.77 "));
ok('smoke_v2476 的件套 pin 已更新为三百件套（二百九十九件套清除）', s2476.includes('三百件套（二百九十九件套清除）'));
ok('smoke_v2476 的 README 串尾 pin 已延伸至 smoke_v2477_fisher', s2476.includes('smoke_v2476_achprog + smoke_v2477_fisher（npm test 串跑）'));
ok('smoke_v2476 的 package.json 串尾 pin 已延伸至 smoke_v2477_fisher', s2476.includes('node tests/smoke_v2476_achprog.mjs && node tests/smoke_v2477_fisher.mjs'));
ok('smoke_v2476 的链尾 pin 已推进至 smoke_v2477_fisher（第 300 份）', s2476.includes("=== 'smoke_v2477_fisher'"));
ok('smoke_v2476 的入库 pin 已推进至 300 份', s2476.includes('入库（300 份）'));
const s2436 = read('smoke_v2436_codexrow.mjs');
ok('smoke_v2436 双计数 pin 已推进（299 专项 / 300 总件套）且尚无 301 口径哨兵',
  s2436.includes("suiteFiles.length === 299 && fs.readdirSync(testsDir).filter((f) => f.endsWith(\'.mjs\')).length === 300") &&
  s2436.includes("!readme.includes(\'冒烟三百零一件套\')") && s2436.includes("!readme.includes(\'（301 份）\')"));
const s2415 = read('smoke_v2415_treepin.mjs');
ok('smoke_v2415 链尾已推进至 smoke_v2477_fisher（第 300 份）', s2415.includes("chain[chain.length - 1] === 'smoke_v2477_fisher'"));
ok('smoke_v2415 树串 token 数已推进至 300', s2415.includes('treeTok.length === 300'));
ok('smoke_v2415 哨兵「尚无 301」口径（三百零一件套 bare 否定式）', s2415.includes("!readme.includes('三百零一件套')"));
const s2234 = read('smoke_v2234_innkeeper.mjs');
ok('smoke_v2234 的 NPC_SPOTS 总数 pin 已推进至 40', s2234.includes('NPC_SPOTS).length === 40'));
const s2314 = read('smoke_v2314_voices.mjs');
ok('smoke_v2314 的 NPCS 精确 pin 已推进至 39（ALL.length === 39）', s2314.includes('ALL.length === 39'));
ok('smoke_v2314 的 voiceList 运行期 39 已推进（空档/全聊 39）', s2314.includes('v.length === 39'));
// 旧代 v24.76 pin 零残留扫描（豁免本套件与上一版套件否定式）
const leftovers = [], _why = {};
for (const f of files) {
  if (!f.endsWith('.mjs') || f === 'smoke_v2477_fisher.mjs' || f === 'smoke_v2476_achprog.mjs') continue;
  const s2 = fs.readFileSync(new URL(f, testsDir), 'utf8');
  const hits = [];
  if (s2.includes('const GAME_VERSION = ' + "'v24.76';")) hits.push('gv');
  if (s2.includes('GAME_VERSION === ' + "'v24.76'")) hits.push('gveq');
  if (s2.includes("startsWith('## v24.76")) hits.push('cw');
  if (s2.includes('入库（29' + '9 份）')) hits.push('ruku');
  if (s2.includes('二百九十九件套（二百九十八' + '件套清除）')) hits.push('jiakan');
  if (s2.includes('files.length === 29' + '9')) hits.push('fl');
  if (s2.includes('chainAll.length === 29' + '9')) hits.push('cal');
  if (s2.includes('chain.length === 29' + '8')) hits.push('cl');
  if (s2.includes('treeTok.length === 29' + '9')) hits.push('tt');
  if (s2.includes("chain[chain.length - 1] === 'smoke_v2476_" + "achprog'")) hits.push('tail');
  if (s2.includes('NPC_SPOTS).length === 3' + '9')) hits.push('ns39');
  if (s2.includes('NPCS).length === 3' + '8')) hits.push('np38');
  if (hits.length) { leftovers.push(f); _why[f] = hits; }
}
ok('全库测试零残留 v24.76 GAME_VERSION/顶 pin/300 口径/39·38 计数 pin（哨兵链，豁免本套件与上一版）',
  leftovers.length === 0, leftovers.slice(0, 3).map((f) => f + '=' + (_why[f] || []).join('+')).join(' ') + (leftovers.length > 3 ? ` 等${leftovers.length}件` : ''));

console.log(`— v24.77 冒烟完成：${n} 项断言，失败 ${failed} —`);
process.exit(failed ? 1 : 0);
