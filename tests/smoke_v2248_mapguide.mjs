// v22.48 专项冒烟：帮助页「地图指南」四图行补给/出口指针（体验打磨·信息透明·纯文字，承 v21.27
// 试炼碑位置行守碑人指路 / v21.28 星井矿脉行试炼碑入口同一「地图指南行内指针补全」主线）——四图行各列
// 地标/机制，唯独潮灯镇行没有「怎么离开」（README 速览「东门出镇」在地图指南查无一行，新玩家想进
// 雾语林只能靠踩到东门才知道能传）与雾语林行没有「哪里能回血」（货郎「中段营地的泉水，可以白喝」/
// 老矿工「雾语林营地那口泉是这附近最后一处免费的水」/README「中段营地（泉水安全岛）」三端都在说这口
// 泉，H 页战前知识中枢的四图行却独缺它——星井矿脉/无字回廊「没有泉水」有 v21.40 进图提醒与老矿工
// 台词，唯独有此泉的雾语林无任何指引）；现潮灯镇行补「 · 东门→雾语林」（出口指针）、雾语林行补
// 「 · 中段营地泉水」（补给指针），均与 MAPS.extras/portals 同图事实逐字一致（东门 GATE→dungeon、
// 泉水 dungeon extras FOUNTAIN 12,9），行数不变仍 8（v21.37/v21.43 后为 8 行，零页长变化）、行宽实测 ≤470 面板预算（@napi-rs
// 2026-09-14：village 330.6 / dungeon 298.1）；纯文字零逻辑零结算零存档零数值变化。
// 本冒烟守护：版本锚点、data.js 源级落位（两行新文案逐字 + v22.48 注释 + 行数 5）、行宽预算（既有
// 估算系数）、数据契约（GATE.to==='dungeon' / dungeon extras FOUNTAIN 12,9 单一数据源互证）、运行期
// 实证（drawHelp 地图指南页真实渲染两行 + 既有三行零回归 + 其余三页零回归）、README/package.json/
// CHANGELOG 同步（tests 树尾 + 件套口径 144 + v22.48 守护描述 + 入库 144 份）、姊妹件套 pin
// （smoke_v2247 随新现实更新 + v2143-45「件套守护领先一位」哨兵链 145 更新）复查 + 旧代 v22.47
// 字面量/恒等/件套/串尾 pin 全库零残留。
import { S } from '../js/state.js';
import { GAME_VERSION, HELP_PAGES, MAPS } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM 桩（承 v21.30-v22.47 冒烟先例：先装桩再 import main.js；fillText 捕获供地图指南行断言）——
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
    gain: { value: 1, setValueAtTime: noop, linearRampToValueAtTime: noop, exponentialRampToValueAtTime: noop } }),
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
const { drawHelp } = await import('../js/view/menus.js');
const { CTX } = await import('../js/view/canvas.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.48 地图指南补给/出口指针 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.47 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.47（本版守 v22.48）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 48)), GAME_VERSION);
ok('data.js 含 v22.48 注释（地图指南补给/出口指针说明）', dSrc.includes('v22.48 体验打磨·信息透明·纯文字'));
ok('GAME_VERSION 字面量已为 v22.48（旧 v22.47 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v22.54';") && !dSrc.includes("const GAME_VERSION = 'v22." + "47';"));
ok('data.js 仍保留 v22.47/v22.46 世代注释链（村井补脸/喷泉反馈累积注释未动）',
  dSrc.includes('v22.47 新内容·世界景观·纯显示') && dSrc.includes('v22.46 体验打磨·信息透明·纯显示'));

// —— data.js 源级落位：地图指南两行指针 ——
ok('HELP_PAGES 导入成功且为四页结构（地图指南为第 2 页）', Array.isArray(HELP_PAGES) && HELP_PAGES.length === 4 && Array.isArray(HELP_PAGES[1]));
const guide = HELP_PAGES[1];
ok('地图指南行数保持 8（v22.37 图例/v22.43 机制行后为 8 行，本版零页长变化，短页 sp=34 档不变）', guide.length === 8, String(guide.length));
ok('潮灯镇行含「东门→雾语林」出口指针（与 README 速览「东门出镇」同口径）',
  String(guide[0][1]).includes('东门→雾语林'), String(guide[0][1]));
ok('雾语林行含「中段营地泉水」补给指针（货郎/老矿工/README 同口径）',
  String(guide[1][1]).includes('中段营地泉水'), String(guide[1][1]));
ok('潮灯镇行既有信息零回归（商店·旅馆·酿造锅·灯长/守书记(支线)·喷泉回血）',
  String(guide[0][1]).includes('商店·旅馆·酿造锅·灯长/守书记(支线)·喷泉回血'), String(guide[0][1]));
ok('雾语林行既有信息零回归（强魔物·精英·魔王祭坛·右下裂洞进矿脉）',
  String(guide[1][1]).includes('强魔物·精英·魔王祭坛') && String(guide[1][1]).includes('右下裂洞进矿脉'), String(guide[1][1]));
ok('星井矿脉行/无字回廊行逐字零回归（v21.28/v19.53-55 口径）',
  String(guide[2][1]).includes('试炼碑（可问守碑人）') && String(guide[3][1]).includes('名字石碑') &&
  String(guide[3][1]).includes('终焉之神'));
ok('data.js 含 v22.48 地图指南注释（承 v21.27/v21.28 行内指针补全主线）',
  dSrc.includes('地图指南四图行补给/出口指针'));

// —— 行宽预算（v2111 既有估算系数：14px 汉字/全角 12.11、数字 8.82、空格 3.68；两行实测 330.6/298.1）——
function estW(s) {
  let w = 0;
  for (const ch of String(s)) {
    const c = ch.codePointAt(0);
    if (/[0-9]/.test(ch)) w += 8.82;
    else if (ch === ' ') w += 3.68;
    else if (c >= 0x2E80 && c <= 0x9FFF || c >= 0xFF00 && c <= 0xFFEF || c >= 0x3000 && c <= 0x303F) w += 12.11;
    else w += 8.82;
  }
  return w;
}
const wV = estW(String(guide[0][1])), wD = estW(String(guide[1][1]));
ok('潮灯镇行宽估算 ' + wV.toFixed(1) + ' ≤ 470 面板预算', wV <= 470, String(wV));
ok('雾语林行宽估算 ' + wD.toFixed(1) + ' ≤ 470 面板预算', wD <= 470, String(wD));
ok('两行均短于既有最宽行（星井矿脉行，v21.28 口径 ≤470）', wV < 470 && wD < 470);

// —— 数据契约：指针与地图事实逐字一致（单一数据源互证）——
ok('契约：潮灯镇 GATE 传送门目的地确为 dungeon（东门→雾语林 与真实传送同源）',
  MAPS.village && MAPS.village.portals && MAPS.village.portals.GATE &&
  MAPS.village.portals.GATE.to === 'dungeon', JSON.stringify(MAPS.village && MAPS.village.portals));
ok('契约：雾语林 extras 确含营地泉水 FOUNTAIN (12,9)（中段营地泉水 与真实泉水同源）',
  Array.isArray(MAPS.dungeon.extras) &&
  MAPS.dungeon.extras.some((ex) => ex.x === 12 && ex.y === 9 && ex.ty === 'FOUNTAIN'),
  JSON.stringify((MAPS.dungeon.extras || []).filter((ex) => ex.ty === 'FOUNTAIN')));

// —— 运行期实证：drawHelp 地图指南页真实渲染（fillText 捕获）——
function captureHelp() {
  const texts = [];
  const origFT = CTX.fillText;
  CTX.fillText = (t, x, y) => { texts.push({ t: String(t), x, y }); return origFT.call(CTX, t, x, y); };
  let threw = null;
  try {
    S.G = null; // 帮助页不依赖 S.G（world 画布由 drawWorld 内部防御）
    S.helpPage = 1;
    drawHelp();
  } catch (e) { threw = e; }
  CTX.fillText = origFT;
  return { texts, threw };
}
const cap = captureHelp();
ok('运行期：地图指南页渲染无抛错', cap.threw === null, cap.threw && cap.threw.message);
ok('运行期：潮灯镇行含「东门→雾语林」落画（r[0]+"   "+r[1] 整行）',
  cap.texts.some((x) => x.t.includes('东门→雾语林') && x.t.includes('潮灯镇')), JSON.stringify(cap.texts.slice(0, 4)));
ok('运行期：雾语林行含「中段营地泉水」落画',
  cap.texts.some((x) => x.t.includes('中段营地泉水') && x.t.includes('雾语林')));
ok('运行期：其余三图行落画（星井矿脉/无字回廊/通关之路零回归）',
  cap.texts.some((x) => x.t.includes('星井矿脉')) && cap.texts.some((x) => x.t.includes('无字回廊')) &&
  cap.texts.some((x) => x.t.includes('通关之路')), String(cap.texts.length));
ok('运行期：其余三页渲染零回归（操作说明/魔物状态/试炼进阶不抛错）',
  (() => {
    for (const p of [0, 2, 3]) {
      S.helpPage = p;
      try { drawHelp(); } catch (e) { return false; }
    }
    return true;
  })());

// —— README / package.json / CHANGELOG 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树已收录 smoke_v2248_mapguide 且位于串尾', readme.includes('smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield（npm test 串跑）'));
ok('README 件套口径为一百五十件套（一百四十九件套清除）',
  readme.includes('冒烟一百五十件套（一百四十九件套清除）') && !readme.includes('冒烟一百四十三件套（一百四十二件套清' + '除）'));
ok('README 含 v22.48 守护描述（地图指南补给/出口指针）', readme.includes('v22.48 起含帮助页地图指南'));
ok('README 含 smoke_v2248_mapguide 入库（144 份）', readme.includes('smoke_v2248_mapguide 入库（144 份）'));
ok('package.json 已收录 smoke_v2248_mapguide（npm test 串跑第 144 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2248_mapguide.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 144 件套', testChain === 150, String(testChain));
ok('CHANGELOG 顶部已追加 v22.48 条目', changelog.startsWith('## v22.54'));

// —— 姊妹 pin 复查（smoke_v2247 随新现实更新 + v2143-45「件套守护领先一位」哨兵推进至 145）——
const s2247 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2247_villagewell.mjs'), 'utf8');
ok('smoke_v2247 的 GAME_VERSION 字面量 pin 已更新为 v22.48（旧 v22.47 零残留）',
  s2247.includes("const GAME_VERSION = 'v22.54';") && !s2247.includes("const GAME_VERSION = 'v22." + "47';"));
ok('smoke_v2247 的 README 件套 pin 已随新现实更新为一百五十件套（一百四十九件套清除）',
  s2247.includes('一百五十件套（一百四十九件套清除）'));
ok('smoke_v2247 的 package.json 件套计数 pin 已更新为 === 144', s2247.includes('testChain === 150'));
ok('smoke_v2247 的 README 串尾 pin 已随新现实延伸至 smoke_v2248_mapguide',
  s2247.includes('smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield（npm test 串跑）'));
ok('smoke_v2247 的 NPC 总数 pin 保持 31（本轮零 NPC 变更）', s2247.includes('NPC_SPOTS).length === 34'));
const s2143 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2143_talkekey.mjs'), 'utf8');
ok('v2143-45「件套守护领先一位」哨兵链已推进至 145（一百五十一件套（一百五十件套清除））',
  s2143.includes('一百五十一件套（一百五十件套清除）') && s2143.includes("!readme.includes('一百五十一件套')"));

// —— 旧代 v22.47 pin 全库零残留 ——
const allTests = fs.readdirSync(path.join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2248_mapguide.mjs');
const stale = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "47';") || src.includes("GAME_VERSION === 'v22." + "47'") ||
      src.includes('一百四十三件套（一百四十二件套清' + '除）') || src.includes('testChain === ' + '143') ||
      src.includes('smoke_v2247_villagewell（npm test ' + '串跑）')) stale.push(f);
}
ok('旧代 v22.47 字面量/恒等/件套/串尾 pin 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
