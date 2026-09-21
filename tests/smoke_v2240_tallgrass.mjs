// v22.40 专项冒烟：高草危险格显形（体验打磨·信息透明·纯显示）——'G' 高草自 v3.x 起就是全图通用危险格
// （world.dangerAt 第一道判定即读 loadMap 建图时由原始行字符 'G' 建立的 gCells 单一数据源），世界画面却
// 与普通草一像素之差都没有——雾语林蘑菇田（v22.16 拾菇人/蘑菇宝箱所在）/潮灯镇粮田（v21.80 粮铺掌柜
// 「护粮的委托」）都在高草上，玩家边走边纳闷「哪片草算高草」；现经 world.isTallGrass（gCells 只读
// 访问器，与 dangerAt 同一份源）区分绘制：高草格画深绿剑形草簇（#245a24 叶身三束 + #56a656 草尖三粒，
// 与草皮 #367636/#2f6b2f/#56a656 同色族零新增颜色，草簇高随坐标哈希抖动与小花/草痕同法确定），普通草
// 小花/草痕逐字零回归。纯显示零结算零存档零数值变化（dangerAt/遇敌/踩踏/传送判定逐字未动）。本冒烟守护：
// 版本锚点、world.js/drawWorld.js 源级落位（isTallGrass 访问器 + export 块 + GRASS 分支分流 + 既有
// 装饰逐字零回归）、运行期实证（dungeon/village 两图渲染捕获：草簇/草尖逐像素色与坐标 + 普通草格零草簇 +
// isTallGrass 全图与行字符 'G' 逐格一致 + dangerAt 交叉验证）、契约（at(16,2)===TY.GRASS 零碰撞变化 /
// NPC 总数 30 零变更 / loadMap 重载 gCells 重建）、README/package.json/CHANGELOG 同步（tests 树尾/件套
// 口径 136/v22.40 守护描述/入库 136 份/地图行/视觉 bullet）、姊妹件套 pin（v2239..v2226 随新现实更新，
// 含 v2228/v2229/v2230 正则锚与 v2230 双转义锚）复查 + 旧代 v22.39 字面量/恒等/件套/串尾 pin 全库零
// 残留 + 坏链防回归。
import { S } from '../js/state.js';
import { GAME_VERSION, NPC_SPOTS, TY, SOLID, MAPS } from '../js/data.js';
import { newGame } from '../js/core.js';
import { loadMap, at, dangerAt, isTallGrass } from '../js/world.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— DOM 桩（承 v21.30-v22.39 冒烟先例：先装桩再 import main.js；fillRect 捕获供草簇断言）——
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
const { drawWorld, cam } = await import('../js/view/drawWorld.js');
const { CTX } = await import('../js/view/canvas.js');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

// —— 版本锚点 ——
ok('GAME_VERSION 恒等 v22.40', GAME_VERSION === 'v23.45', GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js GAME_VERSION 字面量 v22.40 精确', dSrc.includes("const GAME_VERSION = 'v23.45';"));

// —— 源级落位：world.js ——
const wSrc = fs.readFileSync(path.join(ROOT, 'js/world.js'), 'utf8');
ok('world.js isTallGrass 访问器（gCells 只读）', wSrc.includes('function isTallGrass(x, y) {\n  return gCells.has(x + \',\' + y);\n}'));
ok('world.js export 块含 isTallGrass', wSrc.includes('dangerAt, isTallGrass,'));
ok('world.js 注释含 v22.40 口径', wSrc.includes('v22.40 高草访问器'));
ok('world.js gCells 单一数据源注释在 loadMap 旁（建图时由原始行字符 G 建立）', wSrc.includes("const gCells = new Set();") && wSrc.includes("row[x] === 'G'"));
ok('world.js dangerAt 逐字零回归（第一道判定仍读 gCells）', wSrc.includes('function dangerAt(x, y) {\n  if (gCells.has(x + \',\' + y)) return true;\n  const dt = MAPS[curMap()].dangerTiles;\n  return !!(dt && dt.includes(at(x, y)));\n}'));

// —— 源级落位：drawWorld.js ——
const vSrc = fs.readFileSync(path.join(ROOT, 'js/view/drawWorld.js'), 'utf8');
ok('drawWorld.js import 含 isTallGrass（与 at/MBounds 同源 import 行）', vSrc.includes("import { at, MBounds, dangerAt, facingCell, portalDest, isTallGrass } from '../world.js';"));
ok('drawWorld.js GRASS 分支高草分流（isTallGrass 判前）', vSrc.includes('if (isTallGrass(x, y)) {'));
ok('drawWorld.js 草簇色板 #245a24 叶身 + #56a656 草尖', vSrc.includes("CTX.fillStyle = '#245a24';") && vSrc.includes("CTX.fillStyle = '#56a656';"));
ok('drawWorld.js 注释含 v22.40 口径', vSrc.includes('v22.40 高草显形'));
ok('drawWorld.js 普通草小花/草痕逐字零回归（白瓣/黄心/草痕色健在）', vSrc.includes("'rgba(232,238,241,.85)'") && vSrc.includes("'#ffd24a'") && vSrc.includes("'rgba(20,60,20,.35)'"));
ok('drawWorld.js minimapColor 既有分支零回归（NPC 米色回退/未开宝箱暖金健在）', vSrc.includes("return '#e8c9a0';") && vSrc.includes("return '#c9a86a';"));

// —— 运行期：isTallGrass 与行字符逐格一致（dungeon / village）——
function grassPredicate(mapName) {
  loadMap(mapName);
  const rows = MAPS[mapName].rows;
  const width = rows[0].length;
  let mismatch = 0, gCount = 0;
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < width; x++) {
      const isG = rows[y][x] === 'G';
      if (isTallGrass(x, y) !== isG) mismatch++;
      if (isG) gCount++;
    }
  }
  // extras/replaceTiles 不影响 gCells（建图时依原始行字符建立——NPC 覆盖格仍是高草源）
  return { mismatch, gCount };
}
const dPred = grassPredicate('dungeon');
const dExp = MAPS.dungeon.rows.flatMap((r) => r.split('')).filter((c) => c === 'G').length;
ok('dungeon：isTallGrass 与行字符 G 逐格一致（蘑菇田高草 ' + dExp + ' 格）', dPred.mismatch === 0 && dPred.gCount === dExp,
  JSON.stringify(dPred));
const vPred = grassPredicate('village');
const vExp = MAPS.village.rows.flatMap((r) => r.split('')).filter((c) => c === 'G').length;
ok('village：isTallGrass 与行字符 G 逐格一致（北侧高草+镇南粮田 ' + vExp + ' 格）', vPred.mismatch === 0 && vPred.gCount === vExp,
  JSON.stringify(vPred));
const cPred = grassPredicate('cave');
ok('cave：无 G 高草（isTallGrass 全图 false）', cPred.mismatch === 0 && cPred.gCount === 0, JSON.stringify(cPred));
const gPred = grassPredicate('gallery');
ok('gallery：无 G 高草', gPred.mismatch === 0 && gPred.gCount === 0, JSON.stringify(gPred));

// —— 运行期：dangerAt 交叉验证（高草即危险，视觉源与遇敌语义永不漂移）——
function dangerCross(mapName) {
  loadMap(mapName);
  const rows = MAPS[mapName].rows;
  const width = rows[0].length;
  const dt = MAPS[mapName].dangerTiles || [];
  let bad = 0;
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < width; x++) {
      // 独立预期（不读 isTallGrass）：行字符 G 恒危险；dangerTiles 命中（如 dungeon 的 '0' 草格）恒危险
      const expected = (rows[y][x] === 'G') || (dt.includes(TY.GRASS) && at(x, y) === TY.GRASS);
      if (dangerAt(x, y) !== expected) bad++;
    }
  }
  return bad;
}
ok('dungeon：dangerAt 与「G 高草/危险草格」全图逐格一致（高草视觉=遇敌语义）', dangerCross('dungeon') === 0,
  String(dangerCross('dungeon')));
ok('village：dangerAt 与「G 高草」全图逐格一致（镇内无 dangerTiles，普通草零危险）', dangerCross('village') === 0,
  String(dangerCross('village')));

// —— 运行期渲染捕获：草簇逐像素色与坐标 ——
function captureMap(mapName, heroX, heroY, flags) {
  const origFR = CTX.fillRect;
  const rects = [];
  CTX.fillRect = (x, y, w, h) => {
    rects.push({ x, y, w, h, fs: String(CTX.fillStyle) });
    return origFR.call(CTX, x, y, w, h);
  };
  try {
    S.G = newGame('测试');
    Object.assign(S.G, flags);
    S.G.map = mapName;
    S.G.x = heroX; S.G.y = heroY;
    S.dir = 'R';
    S.scene = 'world';
    S.walk = null;
    loadMap(mapName);
    drawWorld();
  } catch (e) { rects.push({ fs: 'THREW:' + e.message, x: -1, y: -1, w: 0, h: 0 }); }
  CTX.fillRect = origFR;
  const c = cam();
  return { rects, cam: c };
}
// 草簇公式镜像（与 drawWorld.js drawTileFx 逐字同式）：
const T = 32;
function tuft(tx, ty, camObj) {
  const px = tx * T - camObj.x, py = ty * T - camObj.y;
  const dh = tx * 19 + ty * 37;
  const ht = 10 + (dh % 6);
  const mid = dh % 3;
  return {
    px, py, dh, ht, mid,
    blades: [
      { x: px + 5, y: py + 20 - ht, w: 2, h: ht },
      { x: px + 15, y: py + 22 - ht - mid, w: 2, h: ht + mid },
      { x: px + 24, y: py + 20 - ht, w: 2, h: ht },
    ],
    tips: [
      { x: px + 5, y: py + 19 - ht, w: 2, h: 2 },
      { x: px + 15, y: py + 21 - ht - mid, w: 2, h: 2 },
      { x: px + 24, y: py + 19 - ht, w: 2, h: 2 },
    ],
  };
}
function hasRect(rects, r, fs, pad) {
  const p = pad || 0;
  return rects.some((q) => q.fs === fs && Math.abs(q.x - r.x) <= p && Math.abs(q.y - r.y) <= p && q.w === r.w && q.h === r.h);
}
function countIn(rects, tx, ty, camObj, fs) {
  const px = tx * T - camObj.x, py = ty * T - camObj.y;
  return rects.filter((q) => q.fs === fs && q.x >= px - 1 && q.x < px + 33 && q.y >= py - 1 && q.y < py + 33).length;
}

// dungeon：蘑菇田 (16,2) 草簇（dh=378 → ht=10, mid=0）
{
  const cap = captureMap('dungeon', 14, 3, {});
  ok('dungeon 运行期：无抛错（drawWorld 全链路）', !cap.rects.some((r) => r.fs.startsWith('THREW:')),
    JSON.stringify(cap.rects.filter((r) => r.fs.startsWith('THREW:'))));
  const t = tuft(16, 2, cap.cam);
  ok('dungeon 运行期：蘑菇田 (16,2) 叶身三束 #245a24 逐格落位', t.blades.every((b) => hasRect(cap.rects, b, '#245a24')),
    JSON.stringify(cap.rects.filter((r) => r.fs === '#245a24').slice(0, 6)));
  ok('dungeon 运行期：蘑菇田 (16,2) 草尖三粒 #56a656 逐格落位', t.tips.every((b) => hasRect(cap.rects, b, '#56a656')),
    JSON.stringify(cap.rects.filter((r) => r.fs === '#56a656').slice(0, 6)));
  // 普通草格零草簇：找可见区第一个非高草普通草格
  const rows = MAPS.dungeon.rows;
  let plain = null;
  for (let y = 0; y < rows.length && !plain; y++) {
    for (let x = 0; x < rows[0].length; x++) {
      if (rows[y][x] === '0' && at(x, y) === TY.GRASS) { plain = [x, y]; break; }
    }
  }
  ok('dungeon 运行期：普通草格 (' + plain.join(',') + ') 零草簇（#245a24/#56a656 不出现）',
    countIn(cap.rects, plain[0], plain[1], cap.cam, '#245a24') === 0 && countIn(cap.rects, plain[0], plain[1], cap.cam, '#56a656') === 0,
    String(countIn(cap.rects, plain[0], plain[1], cap.cam, '#245a24')));
}

// village：粮田/北侧高草 (17,3) 草簇（dh=434 → ht=12, mid=2）
{
  const cap = captureMap('village', 13, 5, {});
  ok('village 运行期：无抛错（drawWorld 全链路）', !cap.rects.some((r) => r.fs.startsWith('THREW:')),
    JSON.stringify(cap.rects.filter((r) => r.fs.startsWith('THREW:'))));
  const t = tuft(17, 3, cap.cam);
  ok('village 运行期：北侧高草 (17,3) 叶身三束 #245a24 逐格落位', t.blades.every((b) => hasRect(cap.rects, b, '#245a24')),
    JSON.stringify(cap.rects.filter((r) => r.fs === '#245a24').slice(0, 6)));
  ok('village 运行期：北侧高草 (17,3) 草尖三粒 #56a656 逐格落位', t.tips.every((b) => hasRect(cap.rects, b, '#56a656')),
    JSON.stringify(cap.rects.filter((r) => r.fs === '#56a656').slice(0, 6)));
  ok('village 运行期：镇南粮田 (17,12) 也是高草格（isTallGrass true）', isTallGrass(17, 12));
}

// —— 契约：零碰撞 / 零 NPC 变更 / 重载重建 ——
ok('契约：at(16,2) === TY.GRASS（蘑菇田高草格零碰撞变化）', at(16, 2) === TY.GRASS, String(at(16, 2)));
loadMap('dungeon');
ok('契约：loadMap 重载后 gCells 重建（isTallGrass 仍与行字符一致）', isTallGrass(20, 3) === true && isTallGrass(10, 10) === false);
ok('契约：NPC 总数保持 30（零 NPC 变更，v22.39 pin 续守）', Object.keys(NPC_SPOTS).length === 38,
  String(Object.keys(NPC_SPOTS).length));
ok('契约：TY.GRASS 非 SOLID（高草可走）', !SOLID.has(TY.GRASS));

// —— README / package.json / CHANGELOG 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树收录 smoke_v2240_tallgrass 且位于串尾', readme.includes('smoke_v2240_tallgrass + smoke_v2241_gatearch + smoke_v2242_mushfield + smoke_v2243_encguide + smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 件套口径为二百一十二件套（二百一十一件套清除）',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟一百三十五件套（一百三十四件套清' + '除）'));
ok('README 含 v22.40 守护描述（高草危险格显形守护）', readme.includes('v22.40 起含高草危险格显形守护'));
ok('README 含 smoke_v2240_tallgrass 入库（136 份）', readme.includes('smoke_v2240_tallgrass 入库（136 份）'));
ok('README 仍保留 v22.39 守护描述与入库（135 份）（历史口径不漂移）',
  readme.includes('v22.39 起含星井矿脉星砂车地标守护') && readme.includes('smoke_v2239_minercart 入库（135 份）'));
ok('README 潮灯镇/雾语林地图行含高草显形口径（v22.40）', readme.includes('v22.40 起在世界画面以深绿剑形草簇显形') && readme.includes('v22.40 起蘑菇田高草在世界画面深绿草簇显形'));
ok('README 视觉 bullet 含高草危险格显形（v22.40）', readme.includes('高草危险格显形**（v22.40'));
ok('package.json 已收录 smoke_v2240_tallgrass（npm test 串跑第 136 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2240_tallgrass.mjs'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 136 件套', testChain === 212, String(testChain));
ok('CHANGELOG 含 v22.40 条目', changelog.includes('## v22.40 '));

// —— 姊妹 pin 复查（v2239..v2226 随新现实更新，含 v2228/v2229/v2230 正则锚与 v2230 双转义锚）——
const s2239 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2239_minercart.mjs'), 'utf8');
const s2238 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2238_starwell.mjs'), 'utf8');
const s2237 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2237_minimaplegend.mjs'), 'utf8');
const s2235 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2235_minimapquest.mjs'), 'utf8');
const s2234 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2234_innkeeper.mjs'), 'utf8');
const s2230 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2230_pausewarn.mjs'), 'utf8');
const s2228 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2228_titlesave.mjs'), 'utf8');
const s2229 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2229_metall.mjs'), 'utf8');
ok('smoke_v2239 的 GAME_VERSION 字面量 pin 已更新为 v22.40', s2239.includes("const GAME_VERSION = 'v23.45';"));
ok('smoke_v2239 的 GAME_VERSION 恒等 pin 已更新为 === v22.40', s2239.includes("GAME_VERSION === 'v23.45'"));
ok('smoke_v2239 的 README 串尾 pin 已更新为 + smoke_v2240_tallgrass',
  s2239.includes('smoke_v2240_tallgrass + smoke_v2241_gatearch + smoke_v2242_mushfield + smoke_v2243_encguide + smoke_v2244_fulldanger + smoke_v2245_watcher + smoke_v2246_fountgauge + smoke_v2247_villagewell + smoke_v2248_mapguide + smoke_v2249_shopkeep + smoke_v2250_brewer + smoke_v2251_oathkeep + smoke_v2252_rail + smoke_v2253_supplypoint + smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2239 的 package.json 件套计数 pin 已更新为 === 136', s2239.includes('testChain === 212'));
ok('smoke_v2239 的 README 件套口径 pin 已更新为一百三十六件套', s2239.includes('冒烟二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2238 的 GAME_VERSION 字面量 pin 已更新为 v22.40', s2238.includes("const GAME_VERSION = 'v23.45';"));
ok('smoke_v2237 的 GAME_VERSION 字面量 pin 已更新为 v22.40', s2237.includes("const GAME_VERSION = 'v23.45';"));
ok('smoke_v2235 的 GAME_VERSION 字面量 pin 已更新为 v22.40', s2235.includes("const GAME_VERSION = 'v23.45';"));
ok('smoke_v2234 的 GAME_VERSION 恒等 pin 已更新为 === v22.40', s2234.includes("GAME_VERSION === 'v23.45'"));
ok('smoke_v2230 的 GAME_VERSION 恒等 pin 已更新为 === v22.40', s2230.includes("GAME_VERSION === 'v23.45'"));
ok('smoke_v2228/v2229/v2230 的 regex 串尾锚已延伸至 smoke_v2240_tallgrass',
  s2228.includes('smoke_v2239_minercart\\.mjs && node tests\\/smoke_v2240_tallgrass\\.mjs && node tests\\/smoke_v2241_gatearch.mjs && node tests\\/smoke_v2242_mushfield.mjs && node tests\\/smoke_v2243_encguide.mjs && node tests\\/smoke_v2244_fulldanger.mjs && node tests\\/smoke_v2245_watcher.mjs && node tests\\/smoke_v2246_fountgauge.mjs && node tests\\/smoke_v2247_villagewell.mjs && node tests\\/smoke_v2248_mapguide.mjs && node tests\\/smoke_v2249_shopkeep.mjs && node tests\\/smoke_v2250_brewer.mjs && node tests\\/smoke_v2251_oathkeep.mjs && node tests\\/smoke_v2252_rail.mjs && node tests\\/smoke_v2253_supplypoint.mjs && node tests\\/smoke_v2254_grainfield.mjs && node tests\\/smoke_v2255_steleglow.mjs && node tests\\/smoke_v2256_campfire.mjs && node tests\\/smoke_v2257_pondglow.mjs && node tests\\/smoke_v2258_potionhelp.mjs && node tests\\/smoke_v2259_sandpile.mjs && node tests\\/smoke_v2260_fountripple.mjs && node tests\\/smoke_v2261_rich3.mjs && node tests\\/smoke_v2262_crystal.mjs && node tests\\/smoke_v2263_ptime3.mjs && node tests\\/smoke_v2264_hunt3.mjs && node tests\\/smoke_v2265_lucky3.mjs && node tests\\/smoke_v2266_stock3.mjs && node tests\\/smoke_v2267_elixir3.mjs && node tests\\/smoke_v2268_brew3.mjs && node tests\\/smoke_v2269_mush3.mjs && node tests\\/smoke_v2270_outstep.mjs && node tests\\/smoke_v2271_outstep2.mjs && node tests\\/smoke_v2272_scholar2.mjs && node tests\\/smoke_v2273_seen5.mjs && node tests\\/smoke_v2274_seen2\\.mjs && node tests\\/smoke_v2275_codexempty\\.mjs && node tests\\/smoke_v2276_lampkid\\.mjs && node tests\\/smoke_v2277_pondhint\\.mjs && node tests\\/smoke_v2278_mushguide\\.mjs && node tests\\/smoke_v2279_lampwell\\.mjs && node tests\\/smoke_v2280_grainfield\\.mjs && node tests\\/smoke_v2281_starwell\\.mjs && node tests\\/smoke_v2282_archgate\\.mjs && node tests\\/smoke_v2283_menuekey\\.mjs && node tests\\/smoke_v2284_skillekey\\.mjs && node tests\\/smoke_v2285_winekey\\.mjs && node tests\\/smoke_v2286_titleekey\\.mjs && node tests\\/smoke_v2287_trueroute\\.mjs && node tests\\/smoke_v2288_scrollhint\\.mjs && node tests\\/smoke_v2289_winprog\\.mjs && node tests\\/smoke_v2290_statlink\\.mjs && node tests\\/smoke_v2291_lampguide\\.mjs && node tests\\/smoke_v2292_cavewatch\\.mjs && node tests\\/smoke_v2293_deadsave\\.mjs && node tests\\/smoke_v2294_crystalwatch\\.mjs && node tests\\/smoke_v2295_deadprog\\.mjs && node tests\\/smoke_v2296_endingprog\\.mjs && node tests\\/smoke_v2297_chestmid\\.mjs && node tests\\/smoke_v2298_encnum\\.mjs && node tests\\/smoke_v2299_crosslink\\.mjs && node tests\\/smoke_v2300_sidemore\\.mjs && node tests\\/smoke_v2301_eco\\.mjs && node tests\\/smoke_v2302_cmdprev\\.mjs && node tests\\/smoke_v2303_rushnum\\.mjs && node tests\\/smoke_v2304_achgoal\\.mjs && node tests\\/smoke_v2305_monnum\\.mjs && node tests\\/smoke_v2306_skillnum\\.mjs && node tests\\/smoke_v2307_bossnum\\.mjs && node tests\\/smoke_v2308_diffnum\\.mjs && node tests\\/smoke_v2309_questnum\\.mjs && node tests\\/smoke_v2310_diffsum\\.mjs && node tests\\/smoke_v2311_fragprev\\.mjs && node tests\\/smoke_v2312_voltitle\\.mjs && node tests\\/smoke_v2313_talkall\\.mjs && node tests\\/smoke_v2314_voices\\.mjs && node tests\\/smoke_v2315_talkfoot\\.mjs && node tests\\/smoke_v2316_voiceshead\\.mjs"') &&
  s2229.includes('smoke_v2239_minercart\\.mjs && node tests\\/smoke_v2240_tallgrass\\.mjs && node tests\\/smoke_v2241_gatearch.mjs && node tests\\/smoke_v2242_mushfield.mjs && node tests\\/smoke_v2243_encguide.mjs && node tests\\/smoke_v2244_fulldanger.mjs && node tests\\/smoke_v2245_watcher.mjs && node tests\\/smoke_v2246_fountgauge.mjs && node tests\\/smoke_v2247_villagewell.mjs && node tests\\/smoke_v2248_mapguide.mjs && node tests\\/smoke_v2249_shopkeep.mjs && node tests\\/smoke_v2250_brewer.mjs && node tests\\/smoke_v2251_oathkeep.mjs && node tests\\/smoke_v2252_rail.mjs && node tests\\/smoke_v2253_supplypoint.mjs && node tests\\/smoke_v2254_grainfield.mjs && node tests\\/smoke_v2255_steleglow.mjs && node tests\\/smoke_v2256_campfire.mjs && node tests\\/smoke_v2257_pondglow.mjs && node tests\\/smoke_v2258_potionhelp.mjs && node tests\\/smoke_v2259_sandpile.mjs && node tests\\/smoke_v2260_fountripple.mjs && node tests\\/smoke_v2261_rich3.mjs && node tests\\/smoke_v2262_crystal.mjs && node tests\\/smoke_v2263_ptime3.mjs && node tests\\/smoke_v2264_hunt3.mjs && node tests\\/smoke_v2265_lucky3.mjs && node tests\\/smoke_v2266_stock3.mjs && node tests\\/smoke_v2267_elixir3.mjs && node tests\\/smoke_v2268_brew3.mjs && node tests\\/smoke_v2269_mush3.mjs && node tests\\/smoke_v2270_outstep.mjs && node tests\\/smoke_v2271_outstep2.mjs && node tests\\/smoke_v2272_scholar2.mjs && node tests\\/smoke_v2273_seen5.mjs && node tests\\/smoke_v2274_seen2\\.mjs && node tests\\/smoke_v2275_codexempty\\.mjs && node tests\\/smoke_v2276_lampkid\\.mjs && node tests\\/smoke_v2277_pondhint\\.mjs && node tests\\/smoke_v2278_mushguide\\.mjs && node tests\\/smoke_v2279_lampwell\\.mjs && node tests\\/smoke_v2280_grainfield\\.mjs && node tests\\/smoke_v2281_starwell\\.mjs && node tests\\/smoke_v2282_archgate\\.mjs && node tests\\/smoke_v2283_menuekey\\.mjs && node tests\\/smoke_v2284_skillekey\\.mjs && node tests\\/smoke_v2285_winekey\\.mjs && node tests\\/smoke_v2286_titleekey\\.mjs && node tests\\/smoke_v2287_trueroute\\.mjs && node tests\\/smoke_v2288_scrollhint\\.mjs && node tests\\/smoke_v2289_winprog\\.mjs && node tests\\/smoke_v2290_statlink\\.mjs && node tests\\/smoke_v2291_lampguide\\.mjs && node tests\\/smoke_v2292_cavewatch\\.mjs && node tests\\/smoke_v2293_deadsave\\.mjs && node tests\\/smoke_v2294_crystalwatch\\.mjs && node tests\\/smoke_v2295_deadprog\\.mjs && node tests\\/smoke_v2296_endingprog\\.mjs && node tests\\/smoke_v2297_chestmid\\.mjs && node tests\\/smoke_v2298_encnum\\.mjs && node tests\\/smoke_v2299_crosslink\\.mjs && node tests\\/smoke_v2300_sidemore\\.mjs && node tests\\/smoke_v2301_eco\\.mjs && node tests\\/smoke_v2302_cmdprev\\.mjs && node tests\\/smoke_v2303_rushnum\\.mjs && node tests\\/smoke_v2304_achgoal\\.mjs && node tests\\/smoke_v2305_monnum\\.mjs && node tests\\/smoke_v2306_skillnum\\.mjs && node tests\\/smoke_v2307_bossnum\\.mjs && node tests\\/smoke_v2308_diffnum\\.mjs && node tests\\/smoke_v2309_questnum\\.mjs && node tests\\/smoke_v2310_diffsum\\.mjs && node tests\\/smoke_v2311_fragprev\\.mjs && node tests\\/smoke_v2312_voltitle\\.mjs && node tests\\/smoke_v2313_talkall\\.mjs && node tests\\/smoke_v2314_voices\\.mjs && node tests\\/smoke_v2315_talkfoot\\.mjs && node tests\\/smoke_v2316_voiceshead\\.mjs"') &&
  s2230.includes('smoke_v2239_minercart\\.mjs && node tests\\/smoke_v2240_tallgrass\\.mjs && node tests\\/smoke_v2241_gatearch.mjs && node tests\\/smoke_v2242_mushfield.mjs && node tests\\/smoke_v2243_encguide.mjs && node tests\\/smoke_v2244_fulldanger.mjs && node tests\\/smoke_v2245_watcher.mjs && node tests\\/smoke_v2246_fountgauge.mjs && node tests\\/smoke_v2247_villagewell.mjs && node tests\\/smoke_v2248_mapguide.mjs && node tests\\/smoke_v2249_shopkeep.mjs && node tests\\/smoke_v2250_brewer.mjs && node tests\\/smoke_v2251_oathkeep.mjs && node tests\\/smoke_v2252_rail.mjs && node tests\\/smoke_v2253_supplypoint.mjs && node tests\\/smoke_v2254_grainfield.mjs && node tests\\/smoke_v2255_steleglow.mjs && node tests\\/smoke_v2256_campfire.mjs && node tests\\/smoke_v2257_pondglow.mjs && node tests\\/smoke_v2258_potionhelp.mjs && node tests\\/smoke_v2259_sandpile.mjs && node tests\\/smoke_v2260_fountripple.mjs && node tests\\/smoke_v2261_rich3.mjs && node tests\\/smoke_v2262_crystal.mjs && node tests\\/smoke_v2263_ptime3.mjs && node tests\\/smoke_v2264_hunt3.mjs && node tests\\/smoke_v2265_lucky3.mjs && node tests\\/smoke_v2266_stock3.mjs && node tests\\/smoke_v2267_elixir3.mjs && node tests\\/smoke_v2268_brew3.mjs && node tests\\/smoke_v2269_mush3.mjs && node tests\\/smoke_v2270_outstep.mjs && node tests\\/smoke_v2271_outstep2.mjs && node tests\\/smoke_v2272_scholar2.mjs && node tests\\/smoke_v2273_seen5.mjs && node tests\\/smoke_v2274_seen2\\.mjs && node tests\\/smoke_v2275_codexempty\\.mjs && node tests\\/smoke_v2276_lampkid\\.mjs && node tests\\/smoke_v2277_pondhint\\.mjs && node tests\\/smoke_v2278_mushguide\\.mjs && node tests\\/smoke_v2279_lampwell\\.mjs && node tests\\/smoke_v2280_grainfield\\.mjs && node tests\\/smoke_v2281_starwell\\.mjs && node tests\\/smoke_v2282_archgate\\.mjs && node tests\\/smoke_v2283_menuekey\\.mjs && node tests\\/smoke_v2284_skillekey\\.mjs && node tests\\/smoke_v2285_winekey\\.mjs && node tests\\/smoke_v2286_titleekey\\.mjs && node tests\\/smoke_v2287_trueroute\\.mjs && node tests\\/smoke_v2288_scrollhint\\.mjs && node tests\\/smoke_v2289_winprog\\.mjs && node tests\\/smoke_v2290_statlink\\.mjs && node tests\\/smoke_v2291_lampguide\\.mjs && node tests\\/smoke_v2292_cavewatch\\.mjs && node tests\\/smoke_v2293_deadsave\\.mjs && node tests\\/smoke_v2294_crystalwatch\\.mjs && node tests\\/smoke_v2295_deadprog\\.mjs && node tests\\/smoke_v2296_endingprog\\.mjs && node tests\\/smoke_v2297_chestmid\\.mjs && node tests\\/smoke_v2298_encnum\\.mjs && node tests\\/smoke_v2299_crosslink\\.mjs && node tests\\/smoke_v2300_sidemore\\.mjs && node tests\\/smoke_v2301_eco\\.mjs && node tests\\/smoke_v2302_cmdprev\\.mjs && node tests\\/smoke_v2303_rushnum\\.mjs && node tests\\/smoke_v2304_achgoal\\.mjs && node tests\\/smoke_v2305_monnum\\.mjs && node tests\\/smoke_v2306_skillnum\\.mjs && node tests\\/smoke_v2307_bossnum\\.mjs && node tests\\/smoke_v2308_diffnum\\.mjs && node tests\\/smoke_v2309_questnum\\.mjs && node tests\\/smoke_v2310_diffsum\\.mjs && node tests\\/smoke_v2311_fragprev\\.mjs && node tests\\/smoke_v2312_voltitle\\.mjs && node tests\\/smoke_v2313_talkall\\.mjs && node tests\\/smoke_v2314_voices\\.mjs && node tests\\/smoke_v2315_talkfoot\\.mjs && node tests\\/smoke_v2316_voiceshead\\.mjs"'));
ok('smoke_v2230 的 escaped 串尾锚已延伸至 smoke_v2248_mapguide（双转义复查链，任意转义风格容忍）',
  /smoke_v2240_tallgrass[.\\]{0,6}mjs[\s\S]*?node tests[\\/]{0,6}smoke_v2243_encguide[.\\]{0,6}mjs[\s\S]*?node tests[\\/]{0,6}smoke_v2244_fulldanger[.\\]{0,6}mjs[\s\S]*?node tests[\\/]{0,6}smoke_v2245_watcher[.\\]{0,6}mjs[\s\S]*?node tests[\\/]{0,6}smoke_v2246_fountgauge[.\\]{0,6}mjs[\s\S]*?node tests[\\/]{0,6}smoke_v2247_villagewell[.\\]{0,6}mjs[\s\S]*?node tests[\\/]{0,6}smoke_v2248_mapguide[.\\]{0,6}mjs[\s\S]*?node tests[\\/]{0,6}smoke_v2249_shopkeep[.\\]{0,6}mjs[\s\S]*?node tests[\\/]{0,6}smoke_v2250_brewer[.\\]{0,6}mjs[\s\S]*?node tests[\\/]{0,6}smoke_v2251_oathkeep[.\\]{0,6}mjs[\s\S]*?node tests[\\/]{0,6}smoke_v2252_rail[.\\]{0,6}mjs[\s\S]*?node tests[\\/]{0,6}smoke_v2253_supplypoint[.\\]{0,6}mjs[\s\S]*?node tests[\\/]{0,6}smoke_v2254_grainfield[.\\]{0,6}mjs[\s\S]*?node tests[\\/]{0,6}smoke_v2257_pondglow[.\\]{0,6}mjs[\s\S]*?node tests[\\/]{0,6}smoke_v2258_potionhelp[.\\]{0,6}mjs[\s\S]*?node tests[\\/]{0,6}smoke_v2259_sandpile[.\\]{0,6}mjs[\s\S]*?node tests[\\/]{0,6}smoke_v2260_fountripple[.\\/]{0,6}mjs[^]*?node tests[\\/]{0,6}smoke_v2261_rich3[.\\/]{0,6}mjs/.test(s2230));
ok('smoke_v2226 的 plain 串尾锚已延伸至 smoke_v2240_tallgrass',
  s2228.includes('smoke_v2239_minercart\\.mjs && node tests\\/smoke_v2240_tallgrass\\.mjs && node tests\\/smoke_v2241_gatearch.mjs && node tests\\/smoke_v2242_mushfield.mjs && node tests\\/smoke_v2243_encguide.mjs && node tests\\/smoke_v2244_fulldanger.mjs && node tests\\/smoke_v2245_watcher.mjs && node tests\\/smoke_v2246_fountgauge.mjs && node tests\\/smoke_v2247_villagewell.mjs && node tests\\/smoke_v2248_mapguide.mjs && node tests\\/smoke_v2249_shopkeep.mjs && node tests\\/smoke_v2250_brewer.mjs && node tests\\/smoke_v2251_oathkeep.mjs && node tests\\/smoke_v2252_rail.mjs && node tests\\/smoke_v2253_supplypoint.mjs && node tests\\/smoke_v2254_grainfield.mjs && node tests\\/smoke_v2255_steleglow.mjs && node tests\\/smoke_v2256_campfire.mjs && node tests\\/smoke_v2257_pondglow.mjs && node tests\\/smoke_v2258_potionhelp.mjs && node tests\\/smoke_v2259_sandpile.mjs && node tests\\/smoke_v2260_fountripple.mjs && node tests\\/smoke_v2261_rich3.mjs && node tests\\/smoke_v2262_crystal.mjs && node tests\\/smoke_v2263_ptime3.mjs && node tests\\/smoke_v2264_hunt3.mjs && node tests\\/smoke_v2265_lucky3.mjs && node tests\\/smoke_v2266_stock3.mjs && node tests\\/smoke_v2267_elixir3.mjs && node tests\\/smoke_v2268_brew3.mjs && node tests\\/smoke_v2269_mush3.mjs && node tests\\/smoke_v2270_outstep.mjs && node tests\\/smoke_v2271_outstep2.mjs && node tests\\/smoke_v2272_scholar2.mjs && node tests\\/smoke_v2273_seen5.mjs && node tests\\/smoke_v2274_seen2\\.mjs && node tests\\/smoke_v2275_codexempty\\.mjs && node tests\\/smoke_v2276_lampkid\\.mjs && node tests\\/smoke_v2277_pondhint\\.mjs && node tests\\/smoke_v2278_mushguide\\.mjs && node tests\\/smoke_v2279_lampwell\\.mjs && node tests\\/smoke_v2280_grainfield\\.mjs && node tests\\/smoke_v2281_starwell\\.mjs && node tests\\/smoke_v2282_archgate\\.mjs && node tests\\/smoke_v2283_menuekey\\.mjs && node tests\\/smoke_v2284_skillekey\\.mjs && node tests\\/smoke_v2285_winekey\\.mjs && node tests\\/smoke_v2286_titleekey\\.mjs && node tests\\/smoke_v2287_trueroute\\.mjs && node tests\\/smoke_v2288_scrollhint\\.mjs && node tests\\/smoke_v2289_winprog\\.mjs && node tests\\/smoke_v2290_statlink\\.mjs && node tests\\/smoke_v2291_lampguide\\.mjs && node tests\\/smoke_v2292_cavewatch\\.mjs && node tests\\/smoke_v2293_deadsave\\.mjs && node tests\\/smoke_v2294_crystalwatch\\.mjs && node tests\\/smoke_v2295_deadprog\\.mjs && node tests\\/smoke_v2296_endingprog\\.mjs && node tests\\/smoke_v2297_chestmid\\.mjs && node tests\\/smoke_v2298_encnum\\.mjs && node tests\\/smoke_v2299_crosslink\\.mjs && node tests\\/smoke_v2300_sidemore\\.mjs && node tests\\/smoke_v2301_eco\\.mjs && node tests\\/smoke_v2302_cmdprev\\.mjs && node tests\\/smoke_v2303_rushnum\\.mjs && node tests\\/smoke_v2304_achgoal\\.mjs && node tests\\/smoke_v2305_monnum\\.mjs && node tests\\/smoke_v2306_skillnum\\.mjs && node tests\\/smoke_v2307_bossnum\\.mjs && node tests\\/smoke_v2308_diffnum\\.mjs && node tests\\/smoke_v2309_questnum\\.mjs && node tests\\/smoke_v2310_diffsum\\.mjs && node tests\\/smoke_v2311_fragprev\\.mjs && node tests\\/smoke_v2312_voltitle\\.mjs && node tests\\/smoke_v2313_talkall\\.mjs && node tests\\/smoke_v2314_voices\\.mjs && node tests\\/smoke_v2315_talkfoot\\.mjs && node tests\\/smoke_v2316_voiceshead\\.mjs"'));
ok('smoke_v2235 的 NPC 总数 pin 保持 30（零 NPC 变更）', s2235.includes('NPC_SPOTS).length === 38'));

// 旧代 v22.39 pin 全库零残留（字面量/恒等/件套/串尾/第 135 份）
const allTests = fs.readdirSync(path.join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs'));
const stale = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "39';") || src.includes("GAME_VERSION === 'v22." + "39'") ||
      src.includes('一百三十五件套（一百三十四件套清' + '除）') || src.includes('testChain === ' + '135')) stale.push(f);
}
ok('旧代 v22.39 字面量/恒等/件套/串尾 pin 全库零残留（' + allTests.length + ' 件扫描，含本件）', stale.length === 0, stale.join(','));
// 坏链防回归：不得出现 smoke_v2238_starwell 直接接 smoke_v2239_minercart 再断链/被吞并的形式
let brokenTail = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes('smoke_v2238_starwell + smoke_v2239_minercart（npm test ' + '串跑）')) brokenTail.push(f);
}
if (readme.includes('smoke_v2238_starwell + smoke_v2239_minercart（npm test ' + '串跑）')) brokenTail.push('README.md');
ok('坏链 pin 零残留（v2239_minercart 被吞并链全库清零）', brokenTail.length === 0, brokenTail.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
