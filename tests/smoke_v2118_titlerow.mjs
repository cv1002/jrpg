// v21.18 专项冒烟：标题页 R 重开提示行可发现性收口——v21.16 给标题页 R 重开新档加了「两按确认」（破坏性
// 操作不能零确认执行）并把口径写进了 H 帮助页「存档槽」行与 README 快速上手表，但标题画面 `drawTitle`
// 的快捷提示行（y=420，承 v21.4 选槽提示行/ v20.3 「快捷键可发现性」主线）仍只写「L 读档」——玩家正站在
// 实际按 R 的唯一地点，破坏性按键反而没有任何屏幕上入口；本版在该行 L 读档后补「R 重开新档(连按两次)」。
// 本冒烟守护：版本锚点、提示行源码级存在（新/旧全部 token）、模板串宽度预算（12px 估算 ≤620，画布 640
// 中心对齐两侧留 ≥10px）、第二行快捷一览未被误动、README 已同步（tests 树收录 + 十四件套口径）。
import { GAME_VERSION, SAVE_SLOTS } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.18 标题页 R 重开提示行冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.17 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.17', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 17)));

// —— 源码级守护：drawTitle 提示行已补 R 且既有 token 全部在位（纯显示改动，以源码为唯一断言面）——
const srcOk = await (async () => {
  try {
    const fs = await import('node:fs');
    return fs.readFileSync(new URL('../js/view/menus.js', import.meta.url), 'utf8');
  } catch { return ''; }
})();
const hintLine = srcOk.split('\n').find((l) => l.includes('fillText(`按 ') && l.includes('选择存档槽'));
ok('drawTitle 提示行存在（y=420 选槽提示行）', !!hintLine, hintLine || '');
const tokens = ['R 重开新档', '连按两次', 'L 读档', '选择存档槽', '←/→', 'WASD 移动', 'Esc 菜单', 'P 存档', 'M 静音'];
ok('提示行已补「R 重开新档」', !!hintLine && hintLine.includes('R 重开新档'));
ok('提示行已注明「连按两次」确认口径（与 v21.16 两按确认同口径）', !!hintLine && hintLine.includes('连按两次'));
ok('提示行既有 token 逐字保留（L 读档/WASD/Esc/P 存档/M 静音/选槽）',
  !!hintLine && tokens.every((t) => hintLine.includes(t)));

// —— 模板串提取 + 宽度预算（纯估算，零依赖；系数沿 v21.11/v21.13/v21.14 官方冒烟标定口径）——
let rowText = '';
if (hintLine) {
  const b1 = hintLine.indexOf('`');
  const b2 = hintLine.indexOf('`', b1 + 1);
  if (b1 >= 0 && b2 > b1) rowText = hintLine.slice(b1 + 1, b2);
}
const slotStr = Array.from({ length: SAVE_SLOTS }, (_, i) => i + 1).join('/');
rowText = rowText.replace('${slotNums.join(\'/\')}', slotStr);
ok('模板串已按 SAVE_SLOTS 派生展开（1/2/… 与 main.js title 分派同源）', rowText.includes(slotStr), rowText);
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
const wRow = estW(rowText, 12);
ok('提示行补 R 后估算宽 ≤620（画布 640 中心对齐两侧 ≥10px 余量）', wRow > 0 && wRow <= 620, `≈${wRow.toFixed(0)}`);
ok('提示行仍为单行模板串（无折行/无新增行，未触发任何纵向位移）', !!hintLine && !rowText.includes('\n') && !rowText.includes('\r'));
ok('提示行字号仍为 12px（上一行 CTX.font 设置，与改动前同档）', /CTX\.font='12px sans-serif'/.test(srcOk));

// —— 第二行快捷一览未被误动（v10.0 行，与 main.js world 分派同源）——
ok('第二行快捷一览（I/J/B/C/T/F/H）逐字在列',
  srcOk.includes('I 状态 · J 日志 · B 记忆图鉴 · C 成就 · T 旅行 · F 喝药 · H 帮助'));

// —— 版本脚注行仍在（GAME_VERSION 单一数据源）——
ok('标题页版本脚注行仍在（潮灯记 ${GAME_VERSION}）', srcOk.includes('潮灯记 ${GAME_VERSION}'));

// —— README 同步守护（v21.7 去硬化惯例：件数随版本递增，数字写死必然脱节——本次 14→15 即触发其失败，
// 原「十四件套/十三件套」断言降级为「冒烟/件套」存在性，实件数由最新版冒烟（smoke_v2119）守护 README 口径）——
const readmeOk = await (async () => {
  try {
    const fs = await import('node:fs');
    const txt = fs.readFileSync(new URL('../README.md', import.meta.url), 'utf8');
    return txt.includes('smoke_v2118_titlerow') && txt.includes('冒烟') && txt.includes('件套');
  } catch { return false; }
})();
ok('README 已同步（tests 树收录 smoke_v2118_titlerow + 冒烟/件套口径存在）', readmeOk);

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
