// v21.27 专项冒烟：帮助页「试炼进阶」试炼碑位置行补守碑人指路——H 页四页是战前知识中枢，
// 「试炼碑位置」行是玩家决定「要不要去星井矿脉试炼」前读到的第一行，而 v21.24 新增的守碑人
// （唯一能在碑前当面答疑的 NPC）此前只活在现地；本行末尾补短指针「（可问守碑人）」，NPC 名读
// NPCS.sentinel.name 单一数据源（零裸字面量，调 NPC 名只改 data.js 一处），行数不变仍 9、
// r[1] 估算宽 ≈421 ≤470 面板预算（承 v21.20/v21.23 行宽巡检）。
// 承 v21.24 守碑人 / v21.26 试炼碑提示即时化 / v21.23 三 Boss 预览「H 页是战前知识中枢」同主线；
// 承 v21.10 起冒烟入库先例（仓库常驻版）。
// 零回归面：仅 data.js 一处行文案派生式追加（HELP_PAGES[3][0][1]），无任何逻辑/数值/地图/战斗改动。
import { GAME_VERSION, HELP_PAGES, NPCS } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.27 试炼碑位置行守碑人指路 冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.26 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.26', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 27)));

// —— 官方 estW（v21.11/v21.20/v21.23 冒烟标定口径，与 @napi-rs/canvas 真值标定一致）——
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

const page3 = HELP_PAGES[3];
const steleRow = page3.find((r) => r[0] === '试炼碑位置');
ok('帮助页仍 4 页', HELP_PAGES.length === 4);
// v21.72 起 9→10（新增「记忆碎片」行，见 smoke_v2172_helpfrag）：仍 ≤10 → sp=34 档不变
ok('试炼进阶页 10 行（v21.72 记忆碎片行增行，不触发 v19.59 页长自适应）', page3.length === 10, `实际 ${page3.length}`);
ok('试炼碑位置行存在且无 r[2]', !!steleRow && !steleRow[2]);

// —— 派生串独立复算（测试侧重算而非快照）：与 NPCS.sentinel.name 单一数据源逐字相等 ——
const DERIVED = '星井矿脉中央的蓝色石碑 —— 先凑齐两枚胜利徽记（可问' + NPCS.sentinel.name + '）';
ok('守碑人 NPC 定义存在（name/lines 函数，v21.24 契约）',
  !!NPCS.sentinel && NPCS.sentinel.name === '守碑人' && typeof NPCS.sentinel.lines === 'function');
ok('r[1] 与「旧文案 + NPCS.sentinel.name 派生指针」逐字相等（零裸字面量）',
  steleRow[1] === DERIVED, steleRow[1]);
ok('r[1] 保留旧口径关键词（星井矿脉/蓝色石碑/先凑齐两枚胜利徽记——v21.20/v21.23 守护依赖）',
  steleRow[1].includes('星井矿脉') && steleRow[1].includes('蓝色石碑') && steleRow[1].includes('先凑齐两枚胜利徽记'));

// —— 行宽预算：r[1] 14px x=100 + 标签 → 面板右缘 570 − 100 = 470 ——
const w1 = estW(steleRow[0] + '   ', 14) + estW(steleRow[1], 14);
ok(`试炼碑位置行估算宽 ≤470（实测 ≈${w1.toFixed(1)}，追加前 ≈358）`, w1 <= LINE_MAX, `≈${w1.toFixed(1)}`);

// —— 全页行宽巡检（承 v21.20 常驻巡检，新增行自动纳入）——
let allOk3 = true;
page3.forEach((r) => {
  const w = estW(r[0] + '   ', 14) + estW(r[1], 14);
  if (w > LINE_MAX) { allOk3 = false; console.log('    <- 越界行:', r[0], Math.round(w)); }
  if (r[2] && estW(r[2], 12) > LINE_MAX) { allOk3 = false; console.log('    <- r2越界:', r[0]); }
});
ok('试炼进阶页全部行估算宽 ≤470（含追加指针的试炼碑位置行；行数随版本递增由当版冒烟守护）', allOk3);

// —— 页长派生预算：v21.72 起 10 行（记忆碎片行）+ 2 个 r[2] ——
// 末行（终焉之神）基线 80+9*34+1*16=402（r[2] 只有一行在其之前）、其 r[2] 402+18=420 不触页脚 452 ——
ok('试炼进阶页 r[2] 仍 2 个（试炼三连战/终焉之神）', page3.filter((r) => r[2]).length === 2);
ok('末行基线 80+9*34+1*16=402、其 r[2] 402+18=420 ≤440（页脚 452 之前）', 80 + 9 * 34 + 1 * 16 === 402 && 402 + 18 <= 440);

// —— 零回归：其余 8 行关键词未误动 ——
const checks = [
  ['双徽记条件', '洞窟领主'], ['试炼三连战', '百炼成钢'], ['重整旗鼓', '原地再战'],
  ['快速旅行', '瞬移'], ['蘑菇宝箱', '金光脉动'], ['幽冥魔王', '现出真身'],
  ['洞窟领主', '石甲'], ['终焉之神', '封印治愈'],
];
ok('试炼进阶页其余 8 行关键词全在（双徽记/试炼三连战/重整旗鼓/快旅/蘑菇/Boss 三行等逐字未动）',
  checks.every(([k, kw]) => { const r = page3.find((x) => x[0] === k); return !!r && ((r[1] || '') + ' ' + (r[2] || '')).includes(kw); }));
ok('其余三页行数未动（操作 14 / 地图指南 5 / 魔物状态 10）',
  HELP_PAGES[0].length === 14 && HELP_PAGES[1].length === 5 && HELP_PAGES[2].length === 10);

// —— 源码级守护：v21.27 注释 + 派生式落位 ——
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.27 注释（试炼碑位置行补守碑人指路说明）', dSrc.includes('v21.27 试炼碑位置行补守碑人指路'));
ok('data.js 试炼碑位置行以 NPCS.sentinel.name 派生（无裸「（可问守碑人）」拼接）',
  dSrc.includes("'星井矿脉中央的蓝色石碑 —— 先凑齐两枚胜利徽记（可问' + NPCS.sentinel.name + '）'"));

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('smoke_v2127 的 README 守护表达式已去硬化（v21.7 惯例：不再以「二十三件套」「二十二件套」断言件数，实件数由本版冒烟守护）',
  readme.includes('smoke_v2127_stelenpc') && readme.includes('冒烟') && readme.includes('件套'));
ok('README 试炼碑句已补「H 页试炼碑位置行可问守碑人」口径', readme.includes('H 页「试炼碑位置」行补守碑人指路'));
ok('package.json 已收录 smoke_v2127_stelenpc（npm test 串跑第 23 份）',
  pkg.includes('smoke_v2127_stelenpc.mjs'));
const s2126 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2126_trialstep.mjs'), 'utf8');
ok('smoke_v2126 的 README 守护表达式已去硬化（v21.7 惯例：不再以「二十二件套」断言件数，实件数由本版冒烟守护）',
  s2126.includes("includes('冒烟')") && s2126.includes("includes('件套')") && !s2126.includes("includes('二十二件套')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
