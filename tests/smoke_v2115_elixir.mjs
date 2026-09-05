// v21.15 专项冒烟：帮助页「魔物状态」页「高级灵药」行补全配方与恢复数值——此前该行只写
// 「酿造或掉落获得 🧪：可同时恢复 HP/MP」，配方（几株蘑菇+几金）与确切恢复量只能走到酿造锅
// （drawBrew）才看得到；本版改为全部由 data.js 单一数据源派生（BREW_MUSHROOMS / BREW_GOLD /
// ELIXIR_HP_PCT / ELIXIR_MP_PCT，与 drawBrew/brewNow 逐字同源），零新增字面量，并同步修正
// README 数值速查表「酿造 3 菇+10 金」这一处与 BREW_MUSHROOMS=2 脱节的过时口径。本冒烟守护：
// 版本锚点、页结构不变（仍 10 行）、派生内容逐字等价、旧含糊文案清除、行宽预算 ≤470、
// 相邻行零回归、README 两处同步。
import { GAME_VERSION, HELP_PAGES, BREW_MUSHROOMS, BREW_GOLD, ELIXIR_HP_PCT, ELIXIR_MP_PCT, SAVE_SLOTS } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.15 帮助页高级灵药行冒烟 —');

// 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.14
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.14', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 14)));

// —— 魔物状态页结构 ——
const page = HELP_PAGES[2];
ok('魔物状态页位于第 3 页（索引 2）', Array.isArray(page) && !!page.length);
ok('魔物状态页行数仍为 10（只改 r[1] 文字、不增行，不触发 v19.59 页长自适应变化）',
  page.length === 10, `实际 ${page.length}`);
const keys = page.map((r) => r[0]);
ok('魔物状态页关键词不重复', new Set(keys).size === keys.length);
ok('魔物状态页无 r[2] 行误动（战斗掉落/宝箱掉落 r[2] 仍各 1 处）',
  page.filter((r) => r && r.length > 2).length === 2);

// —— 高级灵药行 ——
const row = page.find((r) => r[0] === '高级灵药');
ok('高级灵药行存在', !!row, JSON.stringify(keys));
const expect = '酿造：' + BREW_MUSHROOMS + '株蘑菇+' + BREW_GOLD + '金 → 🧪 恢复'
  + Math.round(ELIXIR_HP_PCT * 100) + '%HP+' + Math.round(ELIXIR_MP_PCT * 100) + '%MP（战斗[3]优先）';
ok('高级灵药行与单一数据源派生串逐字相等（零裸字面量）', !!row && row[1] === expect, row && row[1]);
ok('高级灵药行已含配方（BREW_MUSHROOMS/BREW_GOLD 派生）',
  !!row && row[1].includes(BREW_MUSHROOMS + '株蘑菇+' + BREW_GOLD + '金'));
ok('高级灵药行已含恢复量（ELIXIR_HP_PCT/ELIXIR_MP_PCT 派生）',
  !!row && row[1].includes('恢复' + Math.round(ELIXIR_HP_PCT * 100) + '%HP+' + Math.round(ELIXIR_MP_PCT * 100) + '%MP'));
ok('高级灵药行保留「战斗[3]优先」旧口径', !!row && row[1].includes('（战斗[3]优先）'));
ok('旧含糊文案「酿造或掉落获得」已清除', !!row && !row[1].includes('酿造或掉落获得'));

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
const LINE_MAX = 470, R2_MAX = 470;
const wRow = estW(row[0] + '   ', 14) + estW(row[1], 14);
ok('高级灵药行估算宽 ≤470（面板右缘 570 − 起点 100，含余量）', wRow <= LINE_MAX, `≈${wRow.toFixed(0)}`);

// —— 全页行宽巡检（防将来加长行再犯，承 v21.11/v21.14 全页预算惯例）——
let allOk = true;
page.forEach((r) => {
  const w = estW(r[0] + '   ', 14) + estW(r[1], 14);
  if (w > LINE_MAX) { allOk = false; console.log('    <- 越界行:', r[0], Math.round(w)); }
  if (r[2] && estW(r[2], 12) > R2_MAX) { allOk = false; console.log('    <- r2越界:', r[0]); }
});
ok('魔物状态页全部行估算宽 ≤470', allOk);

// —— 零回归守护：相邻行仍在且仍未脱钩（与各自单一数据源派生口径一致）——
const keep = ['毒蛇中毒', '中毒自救', '技能克制', '石心魔像·石甲', '石心魔像·出没', '残焰魔像', '战斗掉落', '宝箱掉落', '魔物强度'];
ok('相邻 9 行关键词全部在位', keep.every((k) => page.some((r) => r[0] === k)));
const dropRow = page.find((r) => r[0] === '战斗掉落');
ok('战斗掉落行仍与掉落常量派生同源（胜利后约 N% 触发）',
  !!dropRow && dropRow[1].includes('胜利后约') && dropRow[1].includes('% 触发随机掉落'));
const chestRow = page.find((r) => r[0] === '宝箱掉落');
ok('宝箱掉落行仍含开箱掉落口径与 r[2] 城镇/矿脉行', !!chestRow && chestRow[1].includes('开箱掉落') && !!(chestRow[2] || '').includes('城镇/矿脉'));

// —— README 同步守护：数值速查表酿造配方 3 菇→2 菇（与 BREW_MUSHROOMS 同源），tests/ 清单与新条目 ——
const readmeOk = await (async () => {
  try {
    const fs = await import('node:fs');
    const txt = fs.readFileSync(new URL('../README.md', import.meta.url), 'utf8');
    return txt.includes('酿造 ' + BREW_MUSHROOMS + ' 菇+10 金→灵药') &&
      !txt.includes('酿造 3 菇+10 金') &&
      txt.includes('smoke_v2115_elixir') &&
      txt.includes('十一件套');
  } catch { return false; }
})();
ok('README 数值速查「酿 X 菇+10 金」已与 BREW_MUSHROOMS 同源（3 菇口径清除）且 tests/ 清单已同步', readmeOk);

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
