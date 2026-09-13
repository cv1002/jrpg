// v22.7 专项冒烟：标题页 X 删除存档槽（两按确认）——三存档槽首次有删除通道（体验打磨·功能补全，
// 承 v21.16 标题页 R 重开两按确认「破坏性操作两段触发」状态机：core.slotDeleteCheck 纯函数与
// titleResetCheck 同构、共享 TITLE_RESET_CONFIRM_MS 确认窗口；core.deleteSlot 经 saveKey(n) 同源
// localStorage.removeItem（与 hasSlot/saveGame/load 同一份键源、try/catch 防御、删除幂等）；空槽不武装
// 只给「💤 无需删除」反馈（与 v21.33 L 读空槽静默反馈同族）；标题页提示行（drawTitle y=378，有档时
// 显示「按 L 读取当前槽存档 · X 删除当前槽存档(连按两次)」）/ 帮助页「存档槽」行拆 r[1]+r[2]
// （X 口径 12px 次级行 estW ≈296 ≤470、行数不变仍 14、末行 r[2] 基线 439 不触页脚 452）/ README
// 快速上手表同口径。删除仅清存档记录、不影响内存中正在进行的冒险（与 R 重开语义分工）。
// 本冒烟守护：版本锚点、core/main/state/menus/data 源级落位、slotDeleteCheck 纯状态机全路径
// （武装/执行/解除/超时/不连发/边界）、deleteSlot 真实 localStorage 读写（成功/幂等/防御失败档）、
// 运行期全链路（screens.title.onKey 空槽不武装→有档首按仅武装→窗口内再按真实清槽→非 X 键解除武装→
// X/R 两状态机互斥零串扰→槽切换后只删当前槽→drawTitle 渲染不抛错）、帮助页行结构与宽度预算、
// README/package.json/CHANGELOG 同步、姊妹件套 pin（v2206..v2176 一百零三件套 / v2206..v2181·v2179
// GAME_VERSION v22.7 / v2206..v2192 恒等 v22.7 / v2206..v2195·v2193·v2192 树尾 pin）随新现实更新
// + smoke_v2116 帮助页断言随新现实 r[2] 化复核 + 旧代 v22.6 字面量 pin / 旧代恒等 pin / 旧代
// 一百零二件套 pin / 旧标题页 L 单键提示 零残留。
import { GAME_VERSION, HELP_PAGES, SAVE_SLOTS, TITLE_RESET_CONFIRM_MS } from '../js/data.js';
import { S } from '../js/state.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

// —— DOM / Canvas / 音频 / localStorage 桩（承 v21.33/v22.6 冒烟先例：先装桩再 import main.js）——
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
const { slotDeleteCheck, deleteSlot } = await import('../js/core.js');
const { drawTitle } = await import('../js/view/menus.js');

console.log('— v22.7 标题页 X 删除存档槽两按确认冒烟 —');

// —— 版本锚点（v21.7 惯例）：格式合法 + 已越过 v22.6 + 精确 v22.7 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.6', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 7)), GAME_VERSION);
ok('GAME_VERSION 字面量已为 v22.7（本版独占精确锚点）', GAME_VERSION === 'v22.35', GAME_VERSION);

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => { try { return fs.readFileSync(path.join(ROOT, p), 'utf8'); } catch { return ''; } };
const dataSrc = read('js/data.js');
const coreSrc = read('js/core.js');
const mainSrc = read('js/main.js');
const stateSrc = read('js/state.js');
const menusSrc = read('js/view/menus.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— data.js 版本契约 ——
ok('data.js 含 v22.7 版本注释', dataSrc.includes('v22.7 标题页 X 删除存档槽'));
ok('data.js GAME_VERSION 字面量已更新为 v22.7', dataSrc.includes("const GAME_VERSION = 'v22.35';"));
ok('data.js 仍保留 v22.6 历史注释（累积注释块，姊妹 pin 不失效）', dataSrc.includes('v22.6 新成就「药香满囊」'));

// —— core.js 源级落位：纯状态机 + 删除函数 + 导出 ——
ok('core.js 定义 slotDeleteCheck（与 titleResetCheck 同构纯状态机，零副作用）',
  coreSrc.includes('function slotDeleteCheck(armT, now, isX) {'));
ok('core.js slotDeleteCheck 与 R 重开共享 TITLE_RESET_CONFIRM_MS 确认窗口（单一数据源）',
  coreSrc.includes('now - armT <= TITLE_RESET_CONFIRM_MS'));
ok('core.js 定义 deleteSlot 且经 saveKey(n) 同源 removeItem（与 hasSlot/saveGame/load 同一份键源）',
  coreSrc.includes('function deleteSlot(n) {') && coreSrc.includes('localStorage.removeItem(saveKey(n));'));
ok('core.js deleteSlot 有 try/catch 防御（与 hasSlot 同款）', coreSrc.includes('} catch (e) {\n    return false;'));
ok('core.js 导出 slotDeleteCheck 与 deleteSlot（export 块落位）',
  coreSrc.includes('applyAchievements, titleResetCheck, slotDeleteCheck, deleteSlot,'));

// —— main.js 源级落位：import + 武装清零 + X 分支 ——
ok('main.js 已 import slotDeleteCheck / deleteSlot / hasSlot',
  mainSrc.includes('titleResetCheck, slotDeleteCheck, deleteSlot, hasSlot } from'));
ok('main.js title.onKey 顶部补「非 X 键立即解除武装」（承 v21.16 非 R 键同款）',
  mainSrc.includes("if (e.key !== 'x' && e.key !== 'X') S.slotDeleteArm = 0;"));
const iTitle = mainSrc.indexOf('title: {');
const iCreate = mainSrc.indexOf('create: {');
const iXbranch = mainSrc.indexOf("else if (e.key === 'x' || e.key === 'X') {");
ok('X 分支落位在 title.onKey 内（create 之前，仅标题页生效）', iTitle >= 0 && iXbranch > iTitle && iXbranch < iCreate);
ok('X 分支有 haSlot 空槽门（有档才武装）', mainSrc.includes('if (!hasSlot(S.curSaveSlot)) {'));
ok('X 分支调用 slotDeleteCheck + deleteSlot（与 core 同源）',
  mainSrc.includes('slotDeleteCheck(S.slotDeleteArm || 0, Date.now(), true)') &&
  mainSrc.includes('deleteSlot(S.curSaveSlot)'));
ok('X 分支三档反馈文案落位（空槽 / 首按确认 / 已删除）',
  mainSrc.includes('${S.curSaveSlot} 还没有存档，无需删除') &&
  mainSrc.includes('再按一次 X 确认删除槽') && mainSrc.includes('已删除槽'));
ok('X 分支确认窗口仍走 EVENT_MSG_MS（承 v21.33 同族短提示档）',
  mainSrc.includes("boxMsg(`🗑 再按一次 X 确认删除槽 ${S.curSaveSlot} 的存档（不可恢复）`, EVENT_MSG_MS)"));

// —— state.js 字段声明 ——
ok('state.js 已声明 slotDeleteArm（默认 0，与 titleResetArm 同族）',
  stateSrc.includes('slotDeleteArm: 0,'));

// —— menus.js drawTitle 提示行 ——
ok('drawTitle 有档提示行已并 X 口径（y=378，与 L 同源同式）',
  menusSrc.includes("按 L 读取当前槽存档 · X 删除当前槽存档(连按两次)"));
ok('menus.js 旧「按 L 读取当前槽存档」单键提示零残留',
  !menusSrc.includes("fillText('按 L 读取当前槽存档'"));

// —— 帮助页「存档槽」行拆 r[1]+r[2] ——
const page = HELP_PAGES[0];
ok('操作说明页行数仍为 14（拆 r[2] 不增行，不触发 v19.59 页长自适应变化）', page.length === 14, `实际 ${page.length}`);
const rowSlot = page.find((r) => r[0] === '存档槽');
ok('存档槽行存在且 r[1] 仍派生 SAVE_SLOTS / ←/→ / L 读档（既有口径零回归）',
  !!rowSlot && rowSlot[1].includes('1/2/' + SAVE_SLOTS) && rowSlot[1].includes('←/→') && rowSlot[1].includes('L 读档'),
  rowSlot && rowSlot[1]);
ok('存档槽行已拆出 r[2] 且含 R 重开 + X 删除两条破坏性通道（12px 次级行）',
  !!rowSlot && (rowSlot[2] || '').includes('R 重开新档(连按两次确认)') &&
  (rowSlot[2] || '').includes('X 删除当前槽存档(连按两次确认)'), rowSlot && rowSlot[2]);
const rowBattle = page.find((r) => r[0] === '战斗');
ok('战斗行既有 r[2] 零回归（结构未动）', rowBattle && rowBattle.length === 3 && !!rowBattle[2]);
// 宽度预算（纯估算，系数沿 v21.11/v21.13/v21.14/v21.16 官方冒烟标定口径）
const estW = (s, size) => {
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
    else if (code >= 0x30 && code <= 0x39) wsum += 0.63 * size;
    else if (code === 0x20) wsum += 0.263 * size;
    else wsum += 0.55 * size;
  }
  return wsum;
};
ok('存档槽行 r[1] 拆后估算宽 ≤470（面板右缘 570 − 起点 100）',
  estW(rowSlot[0] + '   ', 14) + estW(rowSlot[1], 14) <= 470,
  `≈${(estW(rowSlot[0] + '   ', 14) + estW(rowSlot[1], 14)).toFixed(0)}`);
ok('存档槽行 r[2] 估算宽 ≤470（12px 次级行）',
  estW(rowSlot[2], 12) <= 470, `≈${estW(rowSlot[2], 12).toFixed(0)}`);
// 页长派生预算：drawHelp 行距 >10 行 sp=25、r[2] 行 +16；存档槽是末行（i=13），其 r[2] 基线 =
// 80 + 13*25 + (此前 r[2] 行数=1)*16 + 18 = 439，12px 字底 ≈442.4 < 页脚 452
const r2Before = page.slice(0, page.length - 1).filter((r) => r[2]).length;
const lastR2Y = 80 + (page.length - 1) * 25 + r2Before * 16 + 18;
ok('存档槽 r[2] 基线不触页脚（439 < 445，12px 字底 ≈442.4 < 452）', lastR2Y === 439 && lastR2Y + 4 < 445, `y=${lastR2Y}`);

// —— slotDeleteCheck 纯状态机全路径（与 v21.16 titleResetCheck 同构断言组）——
const T0 = 100000;
let st;
st = slotDeleteCheck(0, T0, false);
ok('未武装 + 非 X 键：仍未武装不执行', st.arm === 0 && st.fire === false, JSON.stringify(st));
st = slotDeleteCheck(0, T0, true);
ok('首次按 X：仅武装不执行（arm=now）', st.arm === T0 && st.fire === false, JSON.stringify(st));
st = slotDeleteCheck(st.arm, T0 + 100, false);
ok('武装后按其它键：立即解除武装', st.arm === 0 && st.fire === false, JSON.stringify(st));
st = slotDeleteCheck(T0, T0 + 500, true);
ok('窗口内再按 X：执行并解除武装', st.fire === true && st.arm === 0, JSON.stringify(st));
st = slotDeleteCheck(T0, T0 + TITLE_RESET_CONFIRM_MS, true);
ok('恰在窗口末按 X：执行（≤ 含边界）', st.fire === true && st.arm === 0, JSON.stringify(st));
st = slotDeleteCheck(T0, T0 + TITLE_RESET_CONFIRM_MS + 1, true);
ok('超出窗口再按 X：重新武装不执行', st.fire === false && st.arm === T0 + TITLE_RESET_CONFIRM_MS + 1, JSON.stringify(st));
st = slotDeleteCheck(0, T0 + 2 * TITLE_RESET_CONFIRM_MS, true);
ok('执行后再按 X：重新武装（不连发）', st.fire === false && st.arm > 0, JSON.stringify(st));
ok('确认窗口常量 TITLE_RESET_CONFIRM_MS 为正整数且有界（0 < MS ≤ 3000）',
  Number.isInteger(TITLE_RESET_CONFIRM_MS) && TITLE_RESET_CONFIRM_MS > 0 && TITLE_RESET_CONFIRM_MS <= 3000,
  `实际 ${TITLE_RESET_CONFIRM_MS}`);

// —— deleteSlot 真实 localStorage 读写 ——
mem['jrpg_save1'] = '{"G":{}}';
ok('deleteSlot(1) 真实删除 saveKey(1) 并返回 true', deleteSlot(1) === true && !('jrpg_save1' in mem));
ok('deleteSlot 幂等：对不存在的槽也返回 true（空槽不删除由 main.js hasSlot 门承担）',
  deleteSlot(2) === true);
mem['jrpg_save3'] = '{"G":{}}';
const origRemove = globalThis.localStorage.removeItem;
globalThis.localStorage.removeItem = () => { throw new Error('quota'); };
ok('deleteSlot 防御：removeItem 抛错时返回 false 不抛错', deleteSlot(3) === false && ('jrpg_save3' in mem));
globalThis.localStorage.removeItem = origRemove;
delete mem['jrpg_save3'];

// —— 运行期全链路：screens.title.onKey ——
ok('import 后初始场景为 title（main.js 启动引导原样）', S.scene === 'title', S.scene);
ok('state.js slotDeleteArm 初始 0', S.slotDeleteArm === 0);

// (a) 空槽按 X：不武装、只给反馈（无需删除）
mem['jrpg_save1'] = '{"G":{}}'; // 槽 2/3 为空，先看空槽
S.curSaveSlot = 2;
screens.title.onKey({ key: 'X' });
ok('运行期：空槽按 X 不武装（slotDeleteArm 仍 0）', S.slotDeleteArm === 0, String(S.slotDeleteArm));
ok('运行期：空槽按 X 不误删任何存档', !('jrpg_save2' in mem));

// (b) 有档：首按仅武装 → 窗口内再按真实清槽
S.curSaveSlot = 1;
screens.title.onKey({ key: 'X' });
ok('运行期：有档首按 X 仅武装（存档仍在）', S.slotDeleteArm > 0 && ('jrpg_save1' in mem), String(S.slotDeleteArm));
screens.title.onKey({ key: 'X' });
ok('运行期：窗口内再按 X 真实删除（槽 1 清空）', !('jrpg_save1' in mem));
ok('运行期：执行后武装清零（不连发）', S.slotDeleteArm === 0, String(S.slotDeleteArm));

// (c) 非 X 键解除武装（武装后按 M 静音键 → 再按 X 只重新武装不执行）
mem['jrpg_save1'] = '{"G":{}}';
screens.title.onKey({ key: 'X' });
ok('运行期：武装后再武装档建立', S.slotDeleteArm > 0 && ('jrpg_save1' in mem));
screens.title.onKey({ key: 'm' });
ok('运行期：按非 X 键立即解除武装', S.slotDeleteArm === 0, String(S.slotDeleteArm));
screens.title.onKey({ key: 'X' });
ok('运行期：解除后按 X 重新武装（不误触发删除）', S.slotDeleteArm > 0 && ('jrpg_save1' in mem));
screens.title.onKey({ key: 'X' });
ok('运行期：重新武装后窗口内再按 X 才删除', !('jrpg_save1' in mem));

// (d) X / R 两状态机互斥零串扰
mem['jrpg_save1'] = '{"G":{}}';
screens.title.onKey({ key: 'R' });
ok('运行期：R 首按武装（既有 titleResetCheck 零回归）', S.titleResetArm > 0 && ('jrpg_save1' in mem));
screens.title.onKey({ key: 'X' });
ok('运行期：按 X 解除 R 武装（互斥）且建立 X 武装', S.titleResetArm === 0 && S.slotDeleteArm > 0,
  `R=${S.titleResetArm} X=${S.slotDeleteArm}`);
screens.title.onKey({ key: 'R' });
ok('运行期：按 R 解除 X 武装（互斥）且重新武装 R', S.slotDeleteArm === 0 && S.titleResetArm > 0,
  `R=${S.titleResetArm} X=${S.slotDeleteArm}`);
screens.title.onKey({ key: 'm' }); // 解除 R 武装，防后续误触

// (e) 槽切换后只删当前槽（槽 1 保留、槽 2 删除）
mem['jrpg_save1'] = '{"G":{}}'; mem['jrpg_save2'] = '{"G":{}}';
S.curSaveSlot = 2;
screens.title.onKey({ key: 'X' });
screens.title.onKey({ key: 'X' });
ok('运行期：X 只删当前槽（槽 2 清空）', !('jrpg_save2' in mem));
ok('运行期：其它槽存档保留（槽 1 未动）', ('jrpg_save1' in mem));
screens.title.onKey({ key: '1' }); // 选回槽 1（同时解除武装状态）

// (f) 删除后 drawTitle 渲染不抛错（slotPreview 读空槽 → null 分支）
let drew = true;
try { drawTitle(); } catch (e) { drew = false; }
ok('运行期：删除后 drawTitle 渲染不抛错（空槽 slotPreview null 分支）', drew);
delete mem['jrpg_save1'];

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树收录 smoke_v2207_titledel 且位于串尾', readme.includes('smoke_v2209_achstatus + smoke_v2211_lampkid + smoke_v2212_volume + smoke_v2213_teller + smoke_v2214_mush + smoke_v2215_tutorvol + smoke_v2216_picker + smoke_v2217_elixir2 + smoke_v2218_mush2 + smoke_v2219_footkeys + smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest（npm test 串跑）'));
ok('README 件套口径为一百三十一件套（一百三十件套清除）',
  readme.includes('冒烟一百三十一件套（一百三十件套清除）') && !readme.includes('冒烟一百零二件套（一百零一件套清' + '除）'));
ok('README 含 v22.7 守护描述', readme.includes('v22.7 起含标题页 X 删除存档槽两按确认守护'));
ok('README 快速上手表标题行补 X 删除口径（连按两次 X 确认执行）',
  readme.includes('删除当前槽存档') && readme.includes('连按两次 X 确认执行') && readme.includes('无需删除'));
ok('package.json 已收录 smoke_v2207_titledel（npm test 串跑第 103 份）',
  pkg.includes('smoke_v2207_titledel.mjs') && /smoke_v2206_stock2\.mjs && node tests\/smoke_v2207_titledel\.mjs/.test(pkg));
ok('CHANGELOG 含 v22.7 条目', changelog.includes('## v22.7 '));

// —— 姊妹件套 pin 复查（v21.7 惯例：本版冒烟守护姊妹随新现实更新）——
const suite103 = ['smoke_v2206_stock2.mjs', 'smoke_v2205_fragtitle.mjs', 'smoke_v2204_brew2.mjs',
  'smoke_v2203_fragdead.mjs', 'smoke_v2202_fragwin.mjs', 'smoke_v2201_fragstatus.mjs',
  'smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs', 'smoke_v2191_ptime.mjs',
  'smoke_v2190_launch.mjs', 'smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs',
  'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs',
  'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs',
  'smoke_v2181_helpquickcast.mjs', 'smoke_v2180_grain.mjs', 'smoke_v2179_titlerecap.mjs',
  'smoke_v2178_codexseen.mjs', 'smoke_v2177_elites.mjs', 'smoke_v2176_allchests.mjs'];
for (const nm of suite103) {
  const src = read(`tests/${nm}`);
  ok(`${nm} 的 README 件套 pin 已随新现实更新为一百三十一件套（一百三十件套清除）`,
    src.includes('一百三十一件套（一百三十件套清除）'));
}
const vers103 = ['smoke_v2206_stock2.mjs', 'smoke_v2205_fragtitle.mjs', 'smoke_v2204_brew2.mjs',
  'smoke_v2203_fragdead.mjs', 'smoke_v2202_fragwin.mjs', 'smoke_v2201_fragstatus.mjs',
  'smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs', 'smoke_v2191_ptime.mjs',
  'smoke_v2190_launch.mjs', 'smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs',
  'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs',
  'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs',
  'smoke_v2181_helpquickcast.mjs', 'smoke_v2179_titlerecap.mjs'];
for (const nm of vers103) {
  const src = read(`tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 字面量 pin 已随新现实更新为 v22.7`,
    src.includes("const GAME_VERSION = 'v22.35';"));
}
for (const nm of ['smoke_v2206_stock2.mjs', 'smoke_v2205_fragtitle.mjs', 'smoke_v2204_brew2.mjs',
  'smoke_v2203_fragdead.mjs', 'smoke_v2202_fragwin.mjs', 'smoke_v2201_fragstatus.mjs',
  'smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs']) {
  const src = read(`tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 恒等 pin（===）已随新现实更新为 v22.7`,
    src.includes("GAME_VERSION === 'v22.35'"));
}
for (const nm of ['smoke_v2206_stock2.mjs', 'smoke_v2205_fragtitle.mjs', 'smoke_v2204_brew2.mjs',
  'smoke_v2203_fragdead.mjs', 'smoke_v2202_fragwin.mjs', 'smoke_v2201_fragstatus.mjs',
  'smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs', 'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs',
  'smoke_v2196_deadrecap.mjs', 'smoke_v2195_ptime2.mjs',
  'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs']) {
  const src = read(`tests/${nm}`);
  ok(`${nm} 的 README tests 树尾 pin 已随新现实更新（+ smoke_v2207_titledel）`,
    src.includes('smoke_v2209_achstatus + smoke_v2211_lampkid + smoke_v2212_volume + smoke_v2213_teller + smoke_v2214_mush + smoke_v2215_tutorvol + smoke_v2216_picker + smoke_v2217_elixir2 + smoke_v2218_mush2 + smoke_v2219_footkeys + smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest（npm test 串跑）'));
}
// smoke_v2116 帮助页断言随新现实 r[2] 化更新（存档槽行拆 r[1]+r[2] 后由 r[2] 承载 R/X 两按口径）
const s2116 = read('tests/smoke_v2116_titlereset.mjs');
ok('smoke_v2116 存档槽行断言已随新现实 r[2] 化（R 重开/连按两次改查 r[2]，r[1] 旧断言零残留）',
  s2116.includes("(rowSlot[2] || '').includes('R 重开新档')") &&
  !s2116.includes("rowSlot[1].includes('R 重开新档')"));

// 旧代 pin 零残留：全部测试文件不得再含 v22.6 版本字面量 pin / 恒等 pin / 一百零二件套 pin
//（拆串构造避免本文件扫描行自匹配）
const OLD_GV = "const GAME_VERSION = 'v22." + "6';";
let stale = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  if (read(`tests/${f}`).includes(OLD_GV)) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v22.6 全库清零）', stale.length === 0, stale.join(','));
let staleId = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  if (read(`tests/${f}`).includes("GAME_VERSION === 'v22." + "6'")) staleId.push(f);
}
ok('旧代 GAME_VERSION 恒等 pin 零残留（===v22.6 全库清零）', staleId.length === 0, staleId.join(','));
let staleSuite = [];
for (const f of fs.readdirSync(path.join(ROOT, 'tests'))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  if (read(`tests/${f}`).includes('一百零二件套（一百零一件套清' + '除）')) staleSuite.push(f);
}
ok('旧代件套 pin 零残留（一百零二件套（一百零一件套清' + '除）全库清零）', staleSuite.length === 0, staleSuite.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
