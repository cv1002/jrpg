// v21.14 专项冒烟：帮助页操作说明补「↑↓ 回看战斗记录」——v21.5 战斗日志回看只存在于战斗画面右下角
// 提示，H 页操作说明与 README 操作清单均未收录（v20.3「快捷键可发现性」主线漏网）。本版仅在
// HELP_PAGES[0]「战斗」行 r[2] 追加「· ↑↓ 回看战斗记录」（12px 次级灰，行数不变）并把同一条目
// 写入 README 快速上手表。本冒烟守护：版本锚点、行数/结构不变、追加内容存在且与 CHARGE_MULT /
// FLEE_SUCCESS 派生同源、r[2]/r[1] 宽度预算 ≤470（面板右缘 570 - 起点 100）、README 同步。
import { GAME_VERSION, HELP_PAGES, CHARGE_MULT, FLEE_SUCCESS, SAVE_SLOTS } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.14 帮助页战斗日志回看冒烟 —');

// 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.13
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.13', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 13)));

// —— 操作说明页结构 ——
const page = HELP_PAGES[0];
ok('操作说明页位于第 1 页（索引 0）', Array.isArray(page) && !!page.length);
ok('操作说明页行数仍为 14（追加只加 r[2] 文字、不增行，不触发 v19.59 页长自适应变化）',
  page.length === 14, `实际 ${page.length}`);
const keys = page.map((r) => r[0]);
ok('操作说明页关键词不重复', new Set(keys).size === keys.length);

// —— 战斗行 ——
const row = page.find((r) => r[0] === '战斗');
ok('战斗行存在', !!row, JSON.stringify(keys));
ok('战斗行 r[1] 主行不变（仍是 6 指令 + FLEE_SUCCESS 派生逃跑率）',
  row && row[1].includes('1攻击') && row[1].includes('2技能') && row[1].includes('3药水') &&
  row[1].includes('4逃跑(约' + Math.round(FLEE_SUCCESS * 100) + '%)') && row[1].includes('5防御') &&
  row[1].includes('6蓄力') && !row[1].includes('回看'), row && row[1]);
ok('战斗行仍带 r[2]（v19.59 拆行结构保留）', row && row.length === 3 && !!row[2]);
const r2 = row && row[2] || '';
ok('r[2] 仍含蓄力/Boss 规则（与 CHARGE_MULT 派生同源）',
  r2.includes('蓄力：下击/技能×' + CHARGE_MULT) && r2.includes('Boss无法逃跑'), r2);
ok('r[2] 已追加「↑↓ 回看战斗记录」（v21.14 新增）',
  r2.includes('↑↓ 回看战斗记录'), r2);

// —— 宽度预算（纯估算，零依赖；系数沿 v21.11/v21.13 官方冒烟标定口径）——
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
const LINE_MAX = 470, R2_MAX = 470;
const wMain = estW(row[0] + '   ', 14) + estW(row[1], 14);
const wR2 = estW(r2, 12);
ok('战斗行主行估算宽 ≤470（r[1] 未加长）', wMain <= LINE_MAX, `≈${wMain.toFixed(0)}`);
ok('战斗行 r[2] 追加后估算宽 ≤470（12px 次行 x=100 起，面板右缘 570）', wR2 <= R2_MAX, `≈${wR2.toFixed(0)}`);

// —— 全页行宽巡检（防将来加长行再犯，承 v21.11 全页预算惯例）——
let allOk = true;
page.forEach((r) => {
  const w = estW(r[0] + '   ', 14) + estW(r[1], 14);
  if (w > LINE_MAX) { allOk = false; console.log('    <- 越界行:', r[0], Math.round(w)); }
  if (r[2] && estW(r[2], 12) > R2_MAX) { allOk = false; console.log('    <- r2越界:', r[0]); }
});
ok('操作说明页全部行估算宽 ≤470', allOk);

// —— README 同步守护 ——
const readmeOk = await (async () => {
  try {
    const fs = await import('node:fs');
    const txt = fs.readFileSync(new URL('../README.md', import.meta.url), 'utf8');
    return txt.includes('战斗中 `↑↓`') && txt.includes('回看战斗记录');
  } catch { return false; }
})();
ok('README 快速上手表已同步「战斗中 ↑↓ 回看战斗记录」', readmeOk);

// —— 零回归守护：相邻行未被误动（存档槽行仍在且仍派生 SAVE_SLOTS）——
const rowSlot = page.find((r) => r[0] === '存档槽');
ok('存档槽行仍在且与 SAVE_SLOTS 派生同源',
  rowSlot && rowSlot[1].includes('1/2/' + SAVE_SLOTS) && rowSlot[1].includes('←/→'), rowSlot && rowSlot[1]);

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
