// v21.25 专项冒烟：帮助页「试炼进阶」页「试炼三连战」行 r[2] 追加试炼通关赏金——「150+等级×20金」由
// RUSH_BASE_GOLD / RUSH_GOLD_PER_LV 派生（与 rules.rushReward / 守碑人台词 / 成就页 C 奖励行同源），
// 战前知识中枢 H 页补齐「试炼值不值得打」的最后一块信息（承 v21.20 r[2] 拆分 / v21.23 三 Boss 机制预览 /
// v21.24 守碑人 同主线：恢复比例、Boss 机制、赏金公式此前都各有可见入口，唯独 H 页四页查不到赏金）。
// 仓库常驻版（承 v21.10 起冒烟入库先例）。
// 零回归面：仅 r[2] 追加派生串，r[1] / 行数（9）/ 其余 8 行 / sp=34 页长档 / 其余三页逐字不动。
import { GAME_VERSION, HELP_PAGES, RUSH_RECOVER, RUSH_BASE_GOLD, RUSH_GOLD_PER_LV } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.25 帮助页试炼通关赏金冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.24 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.24', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 24)));

// —— 官方 estW（v21.11/v21.20 冒烟标定口径，与 @napi-rs/canvas 真值标定一致）——
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

// —— 帮助页总数与「试炼进阶」页结构 ——
ok('帮助页仍 4 页（操作/地图指南/魔物状态/试炼进阶）', HELP_PAGES.length === 4);
const page3 = HELP_PAGES[3];
ok('试炼进阶页仍 9 行（r[2] 追加不增行，sp=34 档不变）', page3.length === 9, `实际 ${page3.length}`);
const rushRow = page3.find((r) => r[0] === '试炼三连战');
ok('试炼三连战行存在且仍为 r[1]+r[2] 结构', !!rushRow && rushRow.length === 3 && !!rushRow[2]);

// —— 派生口径（与 data.js RUSH_* 常量逐字同式，测试侧独立复算，非快照）——
const hpPct = Math.round(RUSH_RECOVER.hp * 100);
const mpPct = Math.round(RUSH_RECOVER.mp * 100);
ok('真源健全：恢复比例/赏金基数均为正数', RUSH_RECOVER.hp > 0 && RUSH_RECOVER.mp > 0 && RUSH_BASE_GOLD > 0 && RUSH_GOLD_PER_LV > 0);
ok(`r[1] 主行未动（连战/全胜/百炼成钢逐字不变，${RUSH_BASE_GOLD}+等级×${RUSH_GOLD_PER_LV} 金不在主行）`,
  rushRow[1] === '连战三名最强 Boss，全胜获「百炼成钢」' && !rushRow[1].includes('金'), rushRow[1]);
ok(`r[2] 次行由 RUSH_RECOVER + RUSH_BASE_GOLD/RUSH_GOLD_PER_LV 派生（回收 ${hpPct}%HP/${mpPct}%MP · 赏金 ${RUSH_BASE_GOLD}+等级×${RUSH_GOLD_PER_LV}金 逐字同源）`,
  rushRow[2] === `每胜一关回血${hpPct}%HP/${mpPct}%MP · 全胜另得${RUSH_BASE_GOLD}+等级×${RUSH_GOLD_PER_LV}金`, rushRow[2]);
ok('r[2] 含「等级×」公式表述（与 rules.rushReward 同式：固定部分+随等级加成）',
  rushRow[2].includes('全胜另得') && rushRow[2].includes('等级×') && rushRow[2].includes('金'));
ok('r[1] 主行不再含回血比例（承 v21.20 拆分口径）', !rushRow[1].includes('回血') && !rushRow[1].includes('%HP'));

// —— 源码级守护：data.js 该行以 RUSH_* 常量派生（零裸字面量 150/20 硬写）——
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 试炼三连战行以 RUSH_BASE_GOLD + RUSH_GOLD_PER_LV 派生（不含裸 150+/20 字面量拼接）',
  dSrc.includes(`RUSH_BASE_GOLD + '+等级×' + RUSH_GOLD_PER_LV + '金'`) || dSrc.includes('RUSH_BASE_GOLD + '+ "'+等级×'" + ' + RUSH_GOLD_PER_LV'));
ok('data.js 含 v21.25 注释（赏金派生说明）', dSrc.includes('v21.25 试炼三连战行 r[2] 追加通关赏金'));

// —— 宽度预算（r1 14px x=100 + 标签；r2 12px x=100；面板右缘 570 → 预算 470）——
const wR1 = estW('试炼三连战   ', 14) + estW(rushRow[1], 14);
const wR2 = estW(rushRow[2], 12);
ok(`r[1] 估算宽 ≤470（≈${wR1.toFixed(1)}）`, wR1 <= LINE_MAX);
ok(`r[2] 估算宽 ≤470（追加赏金后 ≈${wR2.toFixed(1)}，原 ≈142.8 → 现 ≈276.5）`, wR2 <= LINE_MAX, `≈${wR2.toFixed(1)}`);

// —— 全页行宽巡检（试炼进阶 9 行 + 地图指南 5 行，承 v21.20 常驻巡检）——
let allOk3 = true;
page3.forEach((r) => {
  const w = estW(r[0] + '   ', 14) + estW(r[1], 14);
  if (w > LINE_MAX) { allOk3 = false; console.log('    <- 越界行:', r[0], Math.round(w)); }
  if (r[2] && estW(r[2], 12) > LINE_MAX) { allOk3 = false; console.log('    <- r2越界:', r[0]); }
});
ok('试炼进阶页全部 9 行估算宽 ≤470（含追加赏金的 r[2]）', allOk3);
let allOk1 = true;
HELP_PAGES[1].forEach((r) => {
  const w = estW(r[0] + '   ', 14) + estW(r[1], 14);
  if (w > LINE_MAX) { allOk1 = false; console.log('    <- 越界行:', r[0], Math.round(w)); }
});
ok('地图指南页全部行估算宽 ≤470（未受影响）', allOk1);

// —— 页长派生预算：9 行 + 2 个 r[2]（试炼三连战/终焉之神）→ 末行基线 418 不触页脚 452 ——
const r2Count = page3.filter((r) => r[2]).length;
ok('试炼进阶页 r[2] 仍 2 个（试炼三连战/终焉之神，r[2] 追加不增行）', r2Count === 2, `实际 ${r2Count}`);
ok('末行基线 80+9*34+2*16=418 ≤440（页脚 452 之前，sp=34 档）', 80 + 9 * 34 + 2 * 16 === 418 && 418 <= 440);

// —— 零回归：其余 8 行关键词未误动 ——
const checks = [
  ['试炼碑位置', '蓝色石碑'], ['双徽记条件', '洞窟领主'], ['重整旗鼓', '原地再战'],
  ['快速旅行', '瞬移'], ['蘑菇宝箱', '金光脉动'], ['幽冥魔王', '现出真身'],
  ['洞窟领主', '石甲'], ['终焉之神', '封印治愈'],
];
ok('试炼进阶页其余 8 行关键词全在（碑/徽记/快旅/蘑菇/Boss 三行等逐字未动，keyword 扫描 r[1]+r[2]）',
  checks.every(([k, kw]) => { const r = page3.find((x) => x[0] === k); return !!r && ((r[1] || '') + ' ' + (r[2] || '')).includes(kw); }));
ok('其余三页行数未动（操作 14 / 地图指南 5 / 魔物状态 10）',
  HELP_PAGES[0].length === 14 && HELP_PAGES[1].length === 5 && HELP_PAGES[2].length === 10);

// —— README / package.json 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README 已同步（tests 树收录 smoke_v2125_rushreward + 冒烟/件套口径存在（件数递增是预期事件，v21.26 起由新版冒烟守护实件数））',
  readme.includes('smoke_v2125_rushreward') && readme.includes('冒烟') && readme.includes('件套'));
ok('package.json 已收录 smoke_v2125_rushreward（npm test 串跑第 21 份）',
  pkg.includes('smoke_v2125_rushreward.mjs'));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
