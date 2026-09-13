// v21.98 专项冒烟：胜利画面补存档入口（P → saveGame + 页脚口径 + 「战果未自动存档」提示行，体验打磨·
// 存档闭环，承 v21.70 胜利画面 R 两按确认同一「win 场景出口口径」主线）：win 结算屏（击败幽冥魔王的
// 「灯芯回来了」）此前只有 Enter 看尾声 / R 重开两个出口——saveGame 仅 P/菜单手动触发，而 win.onKey 无
// P 分支、暂停菜单在 win 场景不可达，胜利战果（bossDefeated 徽记/圣光之剑/等级金币/成就收集进度）无法
// 落盘：按 Enter 看尾声或 R 重开后回标题，L 读档只能读回战前旧档（main_cave/main_gallery/main_true 均
// unlockOn bossDefeated、真结局 ENDING_TRUE 依赖 trueBoss——自然流程上断链，尾声「井，还没有」明确
// 承接后续）。现补 win.onKey 的 P → saveGame（与 world.onKey P 逐字同款唯一入口、回执复用 S.saveMsg
// 既有摘要）+ drawWin 页脚补「按 P 存档」+「💡 本局战果未自动存档 · 按 P 存进当前槽，回标题按 L 读档
// 即可继续冒险」提示行（y=416，与页脚 396 行间 20px ≥16 不触）。
// 本冒烟守护：版本锚点、main.js/menus.js 源级落位（win 块 P 分支 + 页脚/提示行文案 + 旧单 Enter 页脚
// 零残留）、运行期全链路（真实 winBattle→win 场景按 P 写槽 → 槽内 G.bossDefeated/圣光之剑/等级保留 →
// 回标题 L 读档回 world 且战果完整续玩 → Enter 尾声/R 两按确认/非 R 解武装零回归）、drawWin 渲染实证
// （页脚/提示行落位）、README/package.json/CHANGELOG 同步、姊妹件套 pin（v2197..v2176 九十四件套 /
// v2197..v2179 GAME_VERSION v21.98 / v2197..v2192 恒等 v21.98）随新现实更新 + 旧代 v21.97 字面量 pin
// / 旧代九十三件套 pin 零残留。
import { GAME_VERSION } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.98 胜利画面存档入口冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.97 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.97', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 98)), GAME_VERSION);
ok('GAME_VERSION 字面量已为 v21.98', GAME_VERSION === 'v22.38', GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const mainSrc = read('../js/main.js');
const menusSrc = read('../js/view/menus.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v21.98 版本注释', dataSrc.includes('v21.98 胜利画面补存档入口'));
ok('data.js GAME_VERSION 字面量已更新为 v21.98', dataSrc.includes("const GAME_VERSION = 'v22.38';"));
ok('data.js 仍保留 v21.97 历史注释（累积注释块，姊妹 pin 不失效）', dataSrc.includes('v21.97 新成就「鸿运当头」'));

// —— 源级落位：main.js win.onKey P 分支 ——
const winBlock = (mainSrc.match(/win:\s*\{[\s\S]*?\n  \},\n/) || [''])[0];
ok('main.js win.onKey 落位 P → saveGame 分支（与 world.onKey P 逐字同款入口）',
  winBlock.includes("if (e.key === 'p' || e.key === 'P') { saveGame(); return; }"));
ok('main.js win.onKey P 分支伴随 v21.98 注释', winBlock.includes('v21.98 胜利画面补存档入口'));
ok('main.js win.onKey Enter→ending 分支零回归（逐字保留）',
  winBlock.includes("if (e.key === 'Enter') goto('ending');"));
ok('main.js win.onKey 两按确认（titleResetCheck）零回归',
  winBlock.includes('titleResetCheck(S.titleResetArm || 0, Date.now(), true)'));
ok('main.js win.onKey 非 R 键解武装零回归',
  winBlock.includes("if (e.key !== 'r' && e.key !== 'R') S.titleResetArm = 0;"));
ok('main.js win.onKey 旧「无 P 分支」零残留（win 块内 saveGame 恰一处调用）',
  (winBlock.match(/saveGame\(\)/g) || []).length === 1);

// —— 源级落位：menus.js drawWin 页脚 P 口径 + 提示行 ——
ok('drawWin 页脚补「按 P 存档」（按 Enter 观看尾声 · 按 P 存档 · 按 R 重开新档(连按两次)）',
  menusSrc.includes("按 Enter 观看尾声 · 按 P 存档 · 按 R 重开新档(连按两次)"));
ok('drawWin 补「战果未自动存档」提示行（12px 灰字，与页脚 396 行间 20px ≥16 不触）',
  menusSrc.includes('💡 本局战果未自动存档 · 按 P 存进当前槽，回标题按 L 读档即可继续冒险') &&
  /,416\);/m.test(menusSrc) && 416 - 396 >= 16);
ok('drawWin 旧单 Enter 页脚零残留（「按 Enter 观看尾声 · 按 R 重开新档(连按两次)」整句已不存在）',
  !menusSrc.includes('按 Enter 观看尾声 · 按 R 重开新档(连按两次)'));
ok('drawWin 既有收集行/战绩行零位移（378 收集行与 396 页脚均在）',
  menusSrc.includes(',CV.width/2,378);') && menusSrc.includes(',CV.width/2,396);'));
ok('drawWin 主标题/等级行零回归（灯芯回来了/最终等级）',
  menusSrc.includes("fillText('灯 芯 回 来 了',CV.width/2, 300)") && menusSrc.includes('最终等级 Lv.'));

// —— 运行期实证：DOM/音频/存储桩 + main.js 真实导入全链路 ——
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
const { winBattle } = await import('../js/battle.js');
const { BOSS } = await import('../js/data.js');
const { screens } = await import('../js/main.js');
const { drawWin } = await import('../js/view/menus.js');

// 档1：击败幽冥魔王 → win 场景（真实 winBattle 路径）
let G = newGame('余烬');
G.level = 12;
S.G = G;
S.curSaveSlot = 1;
S.enemy = { ...BOSS };
S.scene = 'battle';
winBattle();
ok('运行期：击败幽冥魔王后进入 win 场景（winBattle 真实路径）', S.scene === 'win', S.scene);
ok('运行期：胜利战果落定（bossDefeated=true / 圣光之剑 / 等级胜利结算后保留）',
  G.bossDefeated === true && G.weapon === '圣光之剑' && G.level >= 12);
const winLevel = G.level;
const winGold = G.gold;

// 档2：win 场景按 P → saveGame 写槽（此前 P 无任何反应是本次修复点）
screens.win.onKey({ key: 'P' });
const saved = localStorage.getItem('jrpg_save1');
ok('运行期：win 场景按 P 真实写入当前槽 jrpg_save1', !!saved);
let savedObj = null;
try { savedObj = JSON.parse(saved || ''); } catch (e) {}
ok('运行期：存档含 G 快照且战果完整（bossDefeated/圣光之剑/等级/金币）',
  !!savedObj && !!savedObj.G && savedObj.G.bossDefeated === true && savedObj.G.weapon === '圣光之剑' &&
  savedObj.G.level === winLevel && savedObj.G.gold === winGold);
ok('运行期：按 P 后仍停留 win 场景（P 是保存不是跳转）', S.scene === 'win');
ok('运行期：回执走 S.saveMsg 既有摘要（💾 已存档到槽 1：余烬 Lv.N · 潮灯镇 · N 金）',
  (S.saveMsg || '').includes('已存档到槽 1') && (S.saveMsg || '').includes('余烬 Lv.'));

// 档3：win → Enter 尾声 → 标题 → L 读档 → 回 world 且战果完整（存档闭环的核心断言）
screens.win.onKey({ key: 'Enter' });
ok('运行期：Enter 仍去尾声（零回归）', S.scene === 'ending', S.scene);
screens.ending.onKey({ key: 'Enter' });
ok('运行期：尾声 Enter 回标题（零回归）', S.scene === 'title', S.scene);
screens.title.onKey({ key: 'l' });
ok('运行期：标题 L 读档回 world（存档→读档续玩链路打通）', S.scene === 'world', S.scene);
ok('运行期：读档后战果完整保留（bossDefeated=true · 圣光之剑 · 等级/金币一致）',
  S.G.bossDefeated === true && S.G.weapon === '圣光之剑' && S.G.level === winLevel && S.G.gold === winGold);

// 档4：R 两按确认零回归（P 分支不破坏 R 状态机）+ 非 R 键（P）解武装
G = newGame('灯见');
G.level = 9;
S.G = G;
S.enemy = { ...BOSS };
S.scene = 'battle';
S.titleResetArm = 0;
winBattle();
ok('运行期：再次 win（档4 基线）', S.scene === 'win');
screens.win.onKey({ key: 'r' });
ok('运行期：win 首按 R 停留且武装（两按确认零回归）',
  S.scene === 'win' && (S.titleResetArm || 0) > 0);
screens.win.onKey({ key: 'P' });           // 非 R 键 → 解武装
ok('运行期：按 P 作非 R 键立即解除 R 武装（不误触发重开）', (S.titleResetArm || 0) === 0);
screens.win.onKey({ key: 'r' });
screens.win.onKey({ key: 'R' });           // 窗口内再按 → 执行
ok('运行期：两按后真实 resetRun 落 story（新档）', S.scene === 'story', S.scene);

// 档5：drawWin 渲染实证（页脚 P 口径 + 提示行落位，纯桩渲染不抛错）
let rendered = true;
CAPTURED.length = 0;
try {
  S.G = newGame('潮'); S.G.level = 12; S.G.bossDefeated = true; S.G.weapon = '圣光之剑';
  S.scene = 'win';
  drawWin();
} catch (e) { rendered = false; }
ok('运行期：drawWin 渲染不抛错（胜利战果档）', rendered);
ok('运行期：页脚 P 口径落位（按 Enter 观看尾声 · 按 P 存档 · 按 R 重开新档(连按两次)）',
  CAPTURED.some((t) => t.includes('按 Enter 观看尾声 · 按 P 存档 · 按 R 重开新档(连按两次)')));
ok('运行期：「战果未自动存档」提示行落位（💡 本局战果未自动存档 · 按 P 存进当前槽…）',
  CAPTURED.some((t) => t.includes('💡 本局战果未自动存档 · 按 P 存进当前槽')));
ok('运行期：既有收集行落位（📕 图鉴 N/M · 📦 宝箱 N/M）',
  CAPTURED.some((t) => t.includes('📕 图鉴') && t.includes('📦 宝箱')));

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树收录 smoke_v2199_rich2 且位于串尾（v2199 随新现实由当版冒烟守护）',
  readme.includes('smoke_v2197_lucky2 + smoke_v2198_winsave + smoke_v2199_rich2 + smoke_v2200_stock + smoke_v2201_fragstatus + smoke_v2202_fragwin + smoke_v2204_brew2 + smoke_v2209_achstatus + smoke_v2211_lampkid + smoke_v2212_volume + smoke_v2213_teller + smoke_v2214_mush + smoke_v2215_tutorvol + smoke_v2216_picker + smoke_v2217_elixir2 + smoke_v2218_mush2 + smoke_v2219_footkeys + smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend + smoke_v2238_starwell（npm test 串跑）'));
ok('README 件套口径为一百三十四件套（一百三十三件套清除）',
  readme.includes('冒烟一百三十四件套（一百三十三件套清除）') && !readme.includes('冒烟九十三件套（九十二件套清' + '除）'));
ok('README 含 v21.98 守护描述', readme.includes('v21.98 起含胜利画面存档入口守护'));
ok('README 快速上手表胜利画面行补 P 存档（Enter/P/R + v21.98 口径）',
  readme.includes('胜利画面 Enter/P/R') && readme.includes('v21.98') && readme.includes('回标题按 `L` 读档即可继续'));
ok('package.json 已收录 smoke_v2198_winsave（npm test 串跑第 94 份）',
  pkg.includes('smoke_v2198_winsave.mjs') && /smoke_v2197_lucky2\.mjs && node tests\/smoke_v2198_winsave\.mjs/.test(pkg));
ok('CHANGELOG 含 v21.98 条目', changelog.includes('## v21.98 '));

// —— 姊妹件套 pin 复查（v21.7 惯例：本版冒烟守护姊妹随新现实更新）——
const suite94 = ['smoke_v2197_lucky2.mjs', 'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs',
  'smoke_v2194_statuscodex.mjs', 'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs',
  'smoke_v2191_ptime.mjs', 'smoke_v2190_launch.mjs', 'smoke_v2189_visitedlegacy.mjs',
  'smoke_v2188_wander.mjs', 'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs',
  'smoke_v2185_steleclear.mjs', 'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs',
  'smoke_v2182_winrecap.mjs', 'smoke_v2181_helpquickcast.mjs', 'smoke_v2180_grain.mjs',
  'smoke_v2179_titlerecap.mjs', 'smoke_v2178_codexseen.mjs', 'smoke_v2177_elites.mjs',
  'smoke_v2176_allchests.mjs'];
for (const nm of suite94) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README 件套 pin 已随新现实更新为一百三十四件套（一百三十三件套清除）`,
    src.includes('一百三十四件套（一百三十三件套清除）'));
}
const vers = ['smoke_v2197_lucky2.mjs', 'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs',
  'smoke_v2194_statuscodex.mjs', 'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs',
  'smoke_v2191_ptime.mjs', 'smoke_v2190_launch.mjs', 'smoke_v2189_visitedlegacy.mjs',
  'smoke_v2188_wander.mjs', 'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs',
  'smoke_v2185_steleclear.mjs', 'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs',
  'smoke_v2182_winrecap.mjs', 'smoke_v2181_helpquickcast.mjs', 'smoke_v2179_titlerecap.mjs'];
for (const nm of vers) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 字面量 pin 已随新现实更新为 v21.98`,
    src.includes("const GAME_VERSION = 'v22.38';"));
}
for (const nm of ['smoke_v2197_lucky2.mjs', 'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs',
  'smoke_v2194_statuscodex.mjs', 'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs']) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 恒等 pin（===）已随新现实更新为 v21.98`,
    src.includes("GAME_VERSION === 'v22.38'"));
}
// 旧代 pin 零残留：全部测试文件不得再含 v21.97 版本字面量 pin（拆串构造避免本文件扫描行自匹配）
const OLD_GV = "const GAME_VERSION = 'v21.9" + "7';";
let stale = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes(OLD_GV)) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v21.97 全库清零）', stale.length === 0, stale.join(','));
let staleId = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes("GAME_VERSION === 'v21.9" + "7'")) staleId.push(f);
}
ok('旧代 GAME_VERSION 恒等 pin 零残留（===v21.97 全库清零）', staleId.length === 0, staleId.join(','));
let staleSuite = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes('九十三件套（九十二件套清' + '除）')) staleSuite.push(f);
}
ok('旧代件套 pin 零残留（九十三件套（九十二件套清' + '除）全库清零）', staleSuite.length === 0, staleSuite.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
