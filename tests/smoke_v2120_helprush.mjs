// v21.20 专项冒烟：帮助页「试炼进阶」页「试炼三连战」行越界修复——r[2] 拆分 + 「地图指南」/「试炼进阶」
// 两页全页行宽巡检（仓库常驻版，承 v21.10 起冒烟入库先例 + v21.11/v21.14 全页预算惯例）。
// 背景：v21.11 巡检「魔物状态」页、v21.14 巡检「操作说明」页，四页中「地图指南」「试炼进阶」两页从未做
// 行宽巡检；按官方 estW 口径（CJK=0.865×size，@napi-rs/canvas 真值标定）试炼进阶页「试炼三连战」行
// ≈478.6 超面板预算 470——四个帮助页中唯一越界行（面板右缘 570 − 文本起点 100 = 470；真实字形度量
// ≈460·末字距右缘仅 ~10px，后续任何加长即推出面板）。本次按 v19.59 战斗行 / v21.11 战斗掉落·宝箱掉落
// 同款 r[2] 拆分：主行（14px）收「连战三名最强 Boss，全胜获「百炼成钢」」、次行（12px 次级灰，drawHelp
// 既有 r[2] 通路，基线 +18）收「每胜一关回血35%HP/50%MP」——全部信息逐字保留、RUSH_RECOVER 派生不变、
// 行数不变（仍 6 行、sp=34 档）、末行基线 266 不触页脚 452，其余五行与其余三页逐字不动；并把此前无巡检
// 的两页全页行宽巡检纳入常驻冒烟（防将来加长行再犯）。
import { GAME_VERSION, HELP_PAGES, RUSH_RECOVER } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.20 试炼进阶页行宽修复冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.19 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.19', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 19)));

// —— 官方 estW（v21.11/v21.14 冒烟标定口径，与 @napi-rs/canvas 真值标定一致）——
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

// —— 帮助页总数与「试炼进阶」页结构守护 ——
ok('帮助页仍 4 页（操作/地图指南/魔物状态/试炼进阶）', HELP_PAGES.length === 4);
const page3 = HELP_PAGES[3];
// v21.23 行数 6→9（本页新增「幽冥魔王/洞窟领主/终焉之神」三行 Boss 机制预览，见 smoke_v2123_bosshelp）：
// 仍 ≤10 → drawHelp 的 sp=34 页长自适应档不变；末行基线 80+9*34+2*16=418 不触页脚 452
ok('试炼进阶页 9 行（原 6 行 + v21.23 三 Boss 机制预览 3 行，仍 ≤10 保持 sp=34 档）', page3.length === 9, `实际 ${page3.length}`);
const rushRow = page3.find((r) => r[0] === '试炼三连战');
ok('试炼三连战行存在且已拆 r[1]+r[2]', !!rushRow && rushRow.length === 3 && !!rushRow[2]);
ok('r[1] 主行收连战/全胜/百炼成钢（关键词保留，v19.53 起口径）',
  !!rushRow && rushRow[1].includes('连战三名最强 Boss') && rushRow[1].includes('全胜获「百炼成钢」'), rushRow && rushRow[1]);
ok('r[1] 主行不再含回血比例（已移 r[2]，单行 478.6 越界消除）',
  !!rushRow && !rushRow[1].includes('回血') && !rushRow[1].includes('%HP'), rushRow && rushRow[1]);
ok('r[2] 次行回血比例由 RUSH_RECOVER 派生（35%HP/50%MP 逐字同源）',
  !!rushRow && rushRow[2] === '每胜一关回血' + Math.round(RUSH_RECOVER.hp * 100) + '%HP/' + Math.round(RUSH_RECOVER.mp * 100) + '%MP',
  rushRow && rushRow[2]);

// —— 宽度预算 ——
const wR1 = rushRow ? estW('试炼三连战   ', 14) + estW(rushRow[1], 14) : 9999;
const wR2 = rushRow ? estW(rushRow[2], 12) : 9999;
ok('r[1] 估算宽 ≤470（修复前 ≈478.6 越界）', wR1 <= LINE_MAX, `≈${wR1.toFixed(1)}`);
ok('r[2] 估算宽 ≤470（12px 次行 x=100 起，面板右缘 570）', wR2 <= R2_MAX, `≈${wR2.toFixed(1)}`);

// —— 全页行宽巡检：试炼进阶 + 地图指南（此前四页中仅这两页无巡检）——
let allOk3 = true;
page3.forEach((r) => {
  const w = estW(r[0] + '   ', 14) + estW(r[1], 14);
  if (w > LINE_MAX) { allOk3 = false; console.log('    <- 越界行:', r[0], Math.round(w)); }
  if (r[2] && estW(r[2], 12) > R2_MAX) { allOk3 = false; console.log('    <- r2越界:', r[0]); }
});
ok('试炼进阶页全部行估算宽 ≤470', allOk3);
const page1 = HELP_PAGES[1];
let allOk1 = true;
page1.forEach((r) => {
  const w = estW(r[0] + '   ', 14) + estW(r[1], 14);
  if (w > LINE_MAX) { allOk1 = false; console.log('    <- 越界行:', r[0], Math.round(w)); }
});
ok('地图指南页全部行估算宽 ≤470', allOk1);

// —— 零回归守护：其余 5 行关键词未误动（逐字不动由本段保障）——
const p3keys = ['试炼碑位置', '双徽记条件', '重整旗鼓', '快速旅行', '蘑菇宝箱'];
ok('试炼进阶页其余 5 行关键词全在（试炼碑/双徽记/重整旗鼓/快旅/蘑菇宝箱）',
  p3keys.every((k) => page3.some((r) => r[0] === k)) &&
  page3.find((r) => r[0] === '试炼碑位置')[1].includes('蓝色石碑') &&
  page3.find((r) => r[0] === '双徽记条件')[1].includes('洞窟领主') &&
  page3.find((r) => r[0] === '重整旗鼓')[1].includes('原地再战') &&
  page3.find((r) => r[0] === '快速旅行')[1].includes('瞬移') &&
  page3.find((r) => r[0] === '蘑菇宝箱')[1].includes('金光脉动'));

// —— README 同步守护（tests 树收录 smoke_v2120_helprush + 冒烟/件套口径存在；v21.21 起不再以件数断言，
// 承 v21.7 去硬化惯例：件数随版本递增，数字写死必然脱节——实件数由新版冒烟守护 README 口径）——
const readmeOk = await (async () => {
  try {
    const fs = await import('node:fs');
    const txt = fs.readFileSync(new URL('../README.md', import.meta.url), 'utf8');
    return txt.includes('smoke_v2120_helprush') && txt.includes('冒烟') && txt.includes('件套');
  } catch { return false; }
})();
ok('README 已同步（tests 树收录 smoke_v2120_helprush + 冒烟/件套口径存在）', readmeOk);

// —— 上一版（v2119）README 守护已去硬化（承 v21.7 惯例：件数随版本递增，数字写死必然脱节）——
// 注：v2119 头部注释/对 v2118 的守护块里仍会提到旧字面量（历史口径），故只守护「本版 README 守护表达式」
// 已用「冒烟/件套」存在性形态、且其内不再写死「十五件套」
const v2119Ok = await (async () => {
  try {
    const fs = await import('node:fs');
    const txt = fs.readFileSync(new URL('./smoke_v2119_gallerychest.mjs', import.meta.url), 'utf8');
    return txt.includes("txt.includes('冒烟') && txt.includes('件套')")
      && !txt.includes("txt.includes('十五件套')");
  } catch { return false; }
})();
ok('smoke_v2119 的 README 守护表达式已去硬化（不再以「十五件套」断言件数）', v2119Ok);

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
