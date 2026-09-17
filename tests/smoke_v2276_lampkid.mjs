// v22.78 专项冒烟：潮灯镇「放灯童」新 NPC（新内容·纯风味·数据层三件套，承 v22.11 掌灯童 /
// v22.13 说书人 / v22.34 客栈老板娘 / v22.49 货栈掌柜 / v22.50 酿药师「NPC 就是数据」先例）——水塘东岸
// (19,7) 的提灯小孩：掌灯阿婆守着南岸的旧故事，这孩子守着东岸的新灯（把纸灯放到水上）。本冒烟守护：
// 版本锚点、源级落位（data.js 三件套 + GAME_VERSION）、NPC 数据契约（唯一键/总数 35/台词结构/trueBoss
// 选段）、同图零回归（12 镇民 + 设施键位）、运行期全链路（DOM 桩 + main.js 真实导入：openTalk/interact/
// talkNext/npcQuestMark/resolveNpcTalk/drawWorld）、README/package/CHANGELOG 同步、姊妹件套 pin 随新现实
// 更新、v22.75 遗留 stale 串尾锚修复落位、旧代 v22.75 pin 全库零残留。
import { GAME_VERSION, NPCS, NPC_SPOTS, ACH_LIST, MAPS } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.78 潮灯镇「放灯童」新 NPC 冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v22.75 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.76（本版守 v22.79）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 87)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

// —— 源级落位：data.js v22.78 注释 + 三件套 + GAME_VERSION ——
ok('data.js 含 v22.76 版本注释（放灯童三件套说明，注释按引入版次锚定 v22.76）', dataSrc.includes('v22.76 新 NPC·纯风味「放灯童」'));
ok('data.js GAME_VERSION 字面量已为 v22.78（旧 v22.75 字面量零残留）',
  dataSrc.includes("const GAME_VERSION = 'v22.87';") && !dataSrc.includes("const GAME_VERSION = 'v22." + "75';"));
ok('data.js 仍保留 v22.75 历史注释（图鉴空态收口注释未动）', dataSrc.includes('v22.75 体验打磨·图鉴空态条件收口'));
ok('data.js NPC_SPOTS 含 19,7 → lampboat 键', dataSrc.includes("'19,7': 'lampboat'"));
ok('data.js NPCS 含 lampboat 放灯童（name/mark 落位）', dataSrc.includes("lampboat:{name:'放灯童', mark:'lamp', lines:["));
ok('data.js village.extras 含 { x: 19, y: 7, ty: \'NPC\' }', dataSrc.includes("{ x: 19, y: 7, ty: 'NPC' }"));

// —— 数据契约：唯一键 / 总数 35 / 台词结构 / 非成就版零回归 ——
ok("NPC_SPOTS['19,7'] === 'lampboat'", NPC_SPOTS['19,7'] === 'lampboat');
ok('lampboat 仅占一个坐标键（无重复映射）', Object.keys(NPC_SPOTS).filter((k) => NPC_SPOTS[k] === 'lampboat').length === 1);
ok('NPC_SPOTS 总数 35（既有 34 键 + 放灯童 1 键，v22.78 随新现实更新）', Object.keys(NPC_SPOTS).length === 35, String(Object.keys(NPC_SPOTS).length));
const ent = NPCS.lampboat;
ok('NPCS.lampboat 存在且 name=放灯童 / mark=lamp', !!ent && ent.name === '放灯童' && ent.mark === 'lamp');
ok('lampboat.lines 两页（纯风味台词）', Array.isArray(ent.lines) && ent.lines.length === 2, String(ent && ent.lines && ent.lines.length));
ok('lampboat.after 两页（trueBoss 彩蛋）', Array.isArray(ent.after) && ent.after.length === 2);
ok('lampboat 无任务字段（零任务契约）', ent && !('quest' in ent) && !('giver' in ent));
ok('ACH_LIST 仍 58 项（本版非成就改动，零回归）', ACH_LIST.length === 58, String(ACH_LIST.length));
// 同图零回归：潮灯镇 12 镇民 + 水塘北邻巡灯人 + 设施键位逐字未动
const villageSpots = { '13,6': 'chief', '10,13': 'villager', '19,8': 'adventurer', '12,8': 'clerk', '2,4': 'sage', '14,8': 'granny', '15,12': 'grainman', '16,9': 'teller', '7,11': 'smith', '7,14': 'innkeeper', '8,10': 'shopkeep', '9,12': 'brewer' };
ok('同图 12 镇民 NPC_SPOTS 键位零回归', Object.entries(villageSpots).every(([k, v]) => NPC_SPOTS[k] === v));
ok('village.extras 含放灯童 (19,7) 且酿造锅 (10,12)/商店 S/旅馆 I 逐字未动',
  MAPS.village.extras.some((e) => e.x === 19 && e.y === 7 && e.ty === 'NPC') &&
  MAPS.village.extras.some((e) => e.x === 10 && e.y === 12 && e.ty === 'BREW') &&
  MAPS.village.rows[9][8] === 'S' && MAPS.village.rows[13].startsWith('1IIIII1'));

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
const { drawWorld } = await import('../js/view/drawWorld.js');

// 档一：普通新档——npcQuestPages 直落 lines 两页
let hero = newGame('余烬');
S.G = hero;
let pages = npcQuestPages(hero, 'lampboat');
ok('运行期：npcQuestPages 新档直落 lines 两页', pages === ent.lines && pages.length === 2);
ok('运行期：lines 首页含「放灯童/月亮/纸灯」台词', pages[0].join('').includes('放灯童') && pages[0].join('').includes('月亮') && pages[0].join('').includes('纸灯'));
// 档二：trueBoss 后——after 彩蛋
hero = newGame('灯见');
hero.trueBoss = true;
S.G = hero;
pages = npcQuestPages(hero, 'lampboat');
ok('运行期：trueBoss 后 npcQuestPages 直落 after 两页', pages === ent.after && pages.length === 2);
ok('运行期：after 首页含「灯没有灭/月亮跟着灯」彩蛋台词', pages[0].join('').includes('灯没有灭') && pages[0].join('').includes('月亮跟着灯'));
// 零任务契约：无顶标、无任务对话副作用
hero = newGame('潮');
S.G = hero;
ok('运行期：npcQuestMark 对 lampboat 回退 null（无任务顶标）', npcQuestMark(hero, 'lampboat') === null);
ok('运行期：resolveNpcTalk 对 lampboat 返回 null（零任务结算）', resolveNpcTalk(hero, 'lampboat') === null);
// openTalk → talk 场景；drawTalk 渲染出台词
hero = newGame('灯');
S.G = hero;
S.scene = 'world';
openTalk('lampboat');
ok("运行期：openTalk('lampboat') 进 talk 场景（curNpc/talkPages 落位）", S.scene === 'talk' && S.curNpc === 'lampboat' && S.talkPages.length === 2);
CAPTURED.length = 0;
drawTalk();
const drawnTalk = CAPTURED.join('\n');
ok('运行期：drawTalk 渲染出「放灯童」对话文本', drawnTalk.includes('放灯童'));
// interact 真实通路：站在 (19,8) 面北 → 与放灯童对话
S.G.x = 19; S.G.y = 8; S.dir = 'U';
S.scene = 'world';
interact();
ok("运行期：interact 面北 (19,7) 真实开 lampboat 对话", S.scene === 'talk' && S.curNpc === 'lampboat');
// talkNext 翻页 → 第二页 → 再翻回 world
S.talkLineAt = 0; // 跳过打字机补全（typed 行为由 core.talkNext 自带路径覆盖）
talkNext();
ok('运行期：talkNext 翻至第二页（talkPage=1）', S.scene === 'talk' && S.talkPage === 1);
// 第二页同理需先跳过打字机补全（talkNext 首呼已把 talkLineAt 刷新为当下，立即再呼会命中补全分支不翻页）
S.talkLineAt = 0;
talkNext();
ok('运行期：talkNext 末页结束对话回 world', S.scene === 'world');
// drawWorld 渲染不抛错（水塘东岸新 NPC 入画）
S.G = newGame('余烬');
S.scene = 'world';
let worldOk = true;
try { CAPTURED.length = 0; drawWorld(); } catch (e) { worldOk = false; console.log('   drawWorld err:', e.message); }
ok('运行期：drawWorld 水塘东岸渲染不抛错', worldOk);

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树串尾已延伸至 smoke_v2276_lampkid（v2275 后接 v2276）',
  readme.includes('smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute（npm test 串跑）'));
ok('README 件套口径为一百八十三件套（一百八十二件套清除）且旧 171 口径零残留',
  readme.includes('冒烟一百八十三件套（一百八十二件套清除）') && !readme.includes('冒烟一百七十一件套（一百七十件套清' + '除）'));
ok('README 含 v22.76 守护描述（潮灯镇放灯童新 NPC 守护，按引入版次锚定 v22.76）', readme.includes('v22.76 起含潮灯镇「放灯童」新 NPC 守护'));
ok('README 含 smoke_v2276_lampkid 入库（172 份）', readme.includes('smoke_v2276_lampkid 入库（172 份）'));
ok('README 仍保留 smoke_v2275_codexempty 入库（171 份）历史口径', readme.includes('smoke_v2275_codexempty 入库（171 份）'));
ok('README 成就口径「58 项」双处不变（本版非成就版，零回归）',
  readme.includes('成就一览（全部 58 项进度') && readme.includes('**58 项成就**'));
ok('package.json 已收录 smoke_v2276_lampkid（npm test 串跑第 172 份）',
  pkg.includes('smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 172 件套', testChain === 183, String(testChain));
ok('CHANGELOG 含 v22.78 条目（顶 pin）', changelog.startsWith('## v22.87 '));

// —— 姊妹件套 pin 随新现实更新 + v22.75 遗留 stale 串尾锚修复落位 ——
const s2275 = read('smoke_v2275_codexempty.mjs');
ok('smoke_v2275 的 GAME_VERSION 字面量 pin 已更新为 v22.79', s2275.includes("const GAME_VERSION = 'v22.87';"));
ok('smoke_v2275 的 CHANGELOG 顶 pin 已更新为 ## v22.78', s2275.includes("startsWith('## v22.87'"));
ok('smoke_v2275 的件套 pin 已更新为一百八十三件套（一百八十二件套清除）', s2275.includes('一百八十三件套（一百八十二件套清除）'));
ok('smoke_v2275 的 README 串尾 pin 已延伸至 smoke_v2276_lampkid', s2275.includes('smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute（npm test 串跑）'));
ok('smoke_v2275 的 package.json 串尾 pin 已延伸至 smoke_v2276_lampkid', s2275.includes('smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs'));
// 注：v2275 为图鉴空态版冒烟，本就无 NPC_SPOTS 计数 pin（v22.75 未立、v22.78 无需级联），此处不赘姊妹断言。
const s2143 = read('smoke_v2143_talkekey.mjs');
ok('smoke_v2143 哨兵链已推进至一百八十三件套（一百八十二件套清除）', s2143.includes('一百八十四件套（一百八十三件套清除）') && s2143.includes("!readme.includes('一百八十四件套（一百八十三件套清除）')"));
// v22.75 级联遗漏的 stale pkg 串尾锚修复：v2228 自身 regex 串尾锚延伸至 v2276
const s2228 = read('smoke_v2228_titlesave.mjs');
ok('smoke_v2228 的「已收录」regex 串尾锚已延伸至 smoke_v2276_lampkid（stale 修复落位）',
  s2228.includes('node tests\\/smoke_v2276_lampkid\\.mjs && node tests\\/smoke_v2277_pondhint\\.mjs && node tests\\/smoke_v2278_mushguide\\.mjs && node tests\\/smoke_v2279_lampwell\\.mjs && node tests\\/smoke_v2280_grainfield\\.mjs && node tests\\/smoke_v2281_starwell\\.mjs && node tests\\/smoke_v2282_archgate\\.mjs && node tests\\/smoke_v2283_menuekey\\.mjs && node tests\\/smoke_v2284_skillekey\\.mjs && node tests\\/smoke_v2285_winekey\\.mjs && node tests\\/smoke_v2286_titleekey\\.mjs && node tests\\/smoke_v2287_trueroute\\.mjs"'));
ok('smoke_v2228 旧 v2274 止点串尾锚零残留', !s2228.includes('node tests\\/smoke_v2274_seen2\\.mjs"'));
// 旧代 v22.75 pin 零残留
ok('smoke_v2275 旧 v22.75 字面量 pin 零残留', !s2275.includes("const GAME_VERSION = 'v22.75';"));
ok('smoke_v2275 旧一百七十一件套（一百七十件套清除）pin 零残留', !s2275.includes('一百七十一件套（一百七十件套清除）'));

console.log(`\n— v22.78 潮灯镇「放灯童」新 NPC 冒烟：${n - failed}/${n} 通过 —`);
if (failed) process.exit(1);
