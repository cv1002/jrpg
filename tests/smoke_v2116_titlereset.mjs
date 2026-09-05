// v21.16 专项冒烟：标题页 R 重开新档防误触——resetRun 此前在标题页零确认即执行（Esc→返回标题后当前
// 冒险仍在内存，误按一次 R 直接丢档），本版改为「两按确认」（首次按 R 仅武装+提示，TITLE_RESET_CONFIRM_MS
// 内再按 R 才执行；非 R 键解除武装）。状态机为 core.titleResetCheck 纯函数（零副作用、可单测），
// 窗口常量收口 data.js TITLE_RESET_CONFIRM_MS（单一数据源），帮助页「存档槽」行与 README 同口径同步。
// 本冒烟守护：版本锚点、窗口常量、状态机全路径（武装/执行/解除/超时/不连发）、帮助页行数与宽度预算、
// README 同步、state 字段声明。
import { GAME_VERSION, HELP_PAGES, SAVE_SLOTS, TITLE_RESET_CONFIRM_MS } from '../js/data.js';
import { S } from '../js/state.js';
import { titleResetCheck } from '../js/core.js';

// core.js 读 localStorage 仅发生在 save/load 调用时，但按 v21.6 冒烟常例仍先铺好桩
const mem = {};
globalThis.localStorage = {
  getItem: (k) => mem[k] ?? null,
  setItem: (k, v) => { mem[k] = String(v); },
  removeItem: (k) => { delete mem[k]; },
};

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.16 标题页 R 重开防误触冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.15 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.15', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 15)));

// —— 确认窗口常量（单一数据源）——
ok('TITLE_RESET_CONFIRM_MS 为正整数且有界（0 < MS ≤ 3000）',
  Number.isInteger(TITLE_RESET_CONFIRM_MS) && TITLE_RESET_CONFIRM_MS > 0 && TITLE_RESET_CONFIRM_MS <= 3000,
  `实际 ${TITLE_RESET_CONFIRM_MS}`);

// —— 状态机全路径（core.titleResetCheck 纯函数）——
const T0 = 100000;
let st;
st = titleResetCheck(0, T0, false);
ok('未武装 + 非 R 键：仍未武装不执行', st.arm === 0 && st.fire === false, JSON.stringify(st));
st = titleResetCheck(0, T0, true);
ok('首次按 R：仅武装不执行（arm=now）', st.arm === T0 && st.fire === false, JSON.stringify(st));
st = titleResetCheck(st.arm, T0 + 100, false);
ok('武装后按其它键：立即解除武装', st.arm === 0 && st.fire === false, JSON.stringify(st));
st = titleResetCheck(T0, T0 + 500, true);
ok('窗口内再按 R：执行并解除武装', st.fire === true && st.arm === 0, JSON.stringify(st));
st = titleResetCheck(T0, T0 + TITLE_RESET_CONFIRM_MS, true);
ok('恰在窗口末按 R：执行（≤ 含边界）', st.fire === true && st.arm === 0, JSON.stringify(st));
st = titleResetCheck(T0, T0 + TITLE_RESET_CONFIRM_MS + 1, true);
ok('超出窗口再按 R：重新武装不执行', st.fire === false && st.arm === T0 + TITLE_RESET_CONFIRM_MS + 1, JSON.stringify(st));
st = titleResetCheck(0, T0 + 2 * TITLE_RESET_CONFIRM_MS, true);
ok('执行后再按 R：重新武装（不连发）', st.fire === false && st.arm > 0, JSON.stringify(st));

// —— state 字段声明（main.js 读写的是 S.titleResetArm）——
ok('state.js 已声明 titleResetArm（默认 0）', 'titleResetArm' in S && S.titleResetArm === 0);

// —— 帮助页操作说明「存档槽」行 ——
const page = HELP_PAGES[0];
ok('操作说明页行数仍为 14（只改行内文字、不增行，不触发 v19.59 页长自适应变化）',
  page.length === 14, `实际 ${page.length}`);
const keys = page.map((r) => r[0]);
ok('操作说明页关键词不重复', new Set(keys).size === keys.length);
const rowSlot = page.find((r) => r[0] === '存档槽');
ok('存档槽行存在', !!rowSlot, JSON.stringify(keys));
ok('存档槽行仍与 SAVE_SLOTS / ←/→ 派生同源', rowSlot && rowSlot[1].includes('1/2/' + SAVE_SLOTS) && rowSlot[1].includes('←/→'), rowSlot && rowSlot[1]);
ok('存档槽行已补「R 重开新档」（可发现性收口）', rowSlot && rowSlot[1].includes('R 重开新档'), rowSlot && rowSlot[1]);
ok('存档槽行已注明「连按两次确认」口径', rowSlot && rowSlot[1].includes('连按两次确认'), rowSlot && rowSlot[1]);
// 相邻行未被误动（防改错行的回归守护）
const rowBattle = page.find((r) => r[0] === '战斗');
ok('战斗行主行未被误动（6 指令仍在）', rowBattle && rowBattle[1].includes('6蓄力') && !rowBattle[1].includes('连按两次'), rowBattle && rowBattle[1]);
const rowMute = page.find((r) => r[0] === '静音');
ok('静音行仍在（M 键口径未动）', rowMute && rowMute[1] === 'M', rowMute && rowMute[1]);

// —— 宽度预算（纯估算，零依赖；系数沿 v21.11/v21.13/v21.14 官方冒烟标定口径）——
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
const LINE_MAX = 470;
const wSlot = estW(rowSlot[0] + '   ', 14) + estW(rowSlot[1], 14);
ok('存档槽行补 R 后估算宽 ≤470（面板右缘 570 − 起点 100）', wSlot <= LINE_MAX, `≈${wSlot.toFixed(0)}`);
let allOk = true;
page.forEach((r) => {
  const w = estW(r[0] + '   ', 14) + estW(r[1], 14);
  if (w > LINE_MAX) { allOk = false; console.log('    <- 越界行:', r[0], Math.round(w)); }
});
ok('操作说明页全部行估算宽 ≤470', allOk);

// —— README 同步守护 ——
const readmeOk = await (async () => {
  try {
    const fs = await import('node:fs');
    const txt = fs.readFileSync(new URL('../README.md', import.meta.url), 'utf8');
    return txt.includes('连按两次') && txt.includes('smoke_v2116_titlereset') && txt.includes('十二件套') && !txt.includes('十一件套');
  } catch { return false; }
})();
ok('README 已同步（标题行连按两次确认 + tests 树收录 v2116 + 冒烟十二件套口径、十一件套清除）', readmeOk);

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
