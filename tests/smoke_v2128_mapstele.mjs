// v21.28 专项冒烟：帮助页「地图指南」星井矿脉行补试炼碑入口——H 页四页是战前知识中枢（v21.2/v21.14/
// v21.15 主线），试炼碑是星井矿脉除终焉水晶外最重的可选挑战（三连战：幽冥魔王→洞窟领主→终焉之神，
// 全游戏唯一需主动踏入的长线考验），但「地图指南」页的星井矿脉行只写「更强魔物·迷宫·中央终焉水晶·
// 双徽记化为门」——对比同页其他三图行（镇标灯长/守书记、雾语林标魔王祭坛、回廊标守名者/残焰魔像/
// 终焉之神），唯独星井矿脉行没有任何自己的地标，v21.23-v21.27 五版扫过的「试炼信息战前不可见」在
// 「地图指南」这页仍是漏网。本次在描述列中部补「试炼碑（可问守碑人）」，NPC 名读 NPCS.sentinel.name
// 单一数据源（零裸字面量，调 NPC 名只改 data.js 一处），行数不变仍 5、14px 行宽 ≈446.6 ≤470 面板预算
// （承 v21.20/v21.25 全页行宽巡检）。
// 承 v21.24 守碑人 / v21.27 试炼碑位置行守碑人指路同主线；承 v21.10 起冒烟入库先例（仓库常驻版）。
// 零回归面：仅 data.js 一处行文案派生式追加（HELP_PAGES[1][2][1]），无任何逻辑/数值/地图/战斗改动。
import { GAME_VERSION, HELP_PAGES, MAPS, NPCS } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.28 地图指南星井矿脉行试炼碑入口 冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.27 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.27', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 28)));

// —— 官方 estW（v21.11/v21.20/v21.27 冒烟标定口径，与 @napi-rs/canvas 真值标定一致）——
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

const page1 = HELP_PAGES[1];
const caveRow = page1.find((r) => r[0] === '星井矿脉 Lv.' + MAPS.cave.recLv);
ok('帮助页仍 4 页', HELP_PAGES.length === 4);
ok('地图指南页仍 5 行（追加不增行）', page1.length === 5, `实际 ${page1.length}`);
ok('星井矿脉行存在且以 MAPS.cave.recLv 派生（无 r[2]）', !!caveRow && !caveRow[2], caveRow && caveRow[0]);

// —— 派生串独立复算（测试侧重算而非快照）：与 NPCS.sentinel.name 单一数据源逐字相等 ——
const DERIVED = '更强魔物·迷宫·试炼碑（可问' + NPCS.sentinel.name + '）·中央终焉水晶·双徽记化为门';
ok('守碑人 NPC 定义存在（name 契约，v21.24）', !!NPCS.sentinel && NPCS.sentinel.name === '守碑人');
ok('r[1] 与「旧文案 + NPCS.sentinel.name 派生指针」逐字相等（零裸字面量）',
  caveRow[1] === DERIVED, caveRow && caveRow[1]);
ok('r[1] 含试炼碑与守碑人指针（可问 + NPC 名派生）',
  !!caveRow && caveRow[1].includes('试炼碑') && caveRow[1].includes('可问' + NPCS.sentinel.name));
ok('r[1] 保留旧口径关键词（更强魔物/迷宫/中央终焉水晶/双徽记化为门）',
  ['更强魔物', '迷宫', '中央终焉水晶', '双徽记化为门'].every((k) => caveRow && caveRow[1].includes(k)));

// —— 行宽预算：r[1] 14px x=100 + 标签 → 面板右缘 570 − 100 = 470 ——
const w1 = caveRow ? estW(caveRow[0] + '   ', 14) + estW(caveRow[1], 14) : 9999;
ok(`星井矿脉行估算宽 ≤470（实测 ≈${w1.toFixed(1)}，追加前 ≈321）`, w1 <= LINE_MAX, `≈${w1.toFixed(1)}`);

// —— 全页行宽巡检（承 v21.20 常驻巡检，追加行自动纳入）——
let allOk1 = true;
page1.forEach((r) => {
  const w = estW(r[0] + '   ', 14) + estW(r[1], 14);
  if (w > LINE_MAX) { allOk1 = false; console.log('    <- 越界行:', r[0], Math.round(w)); }
});
ok('地图指南页全部 5 行估算宽 ≤470（含追加入口的星井矿脉行）', allOk1);

// —— 零回归：其余 4 行关键词未误动 ——
const checks = [
  ['潮灯镇 Lv.' + MAPS.village.recLv, ['商店', '旅馆', '酿造锅', '灯长', '守书记', '喷泉']],
  ['雾语林 Lv.' + MAPS.dungeon.recLv, ['强魔物', '精英', '魔王祭坛', '裂洞']],
  ['无字回廊 Lv.' + MAPS.gallery.recLv, ['名字石碑', '守名者', '残焰魔像', '终焉之神', '极高难']],
  ['通关之路', ['讨回灯芯', '洞窟领主', '双徽记开门', '终焉之神']],
];
ok('地图指南页其余 4 行关键词全在（镇/林/回廊/通关之路逐字未动）',
  checks.every(([k, kws]) => { const r = page1.find((x) => x[0] === k); return !!r && kws.every((kw) => r[1].includes(kw)); }));

// —— 其余三页零回归：行数未动 + v21.27 试炼碑指针保留 ——
ok('其余三页行数未动（操作 14 / 魔物状态 10 / 试炼进阶 v21.72 起 10）',
  HELP_PAGES[0].length === 14 && HELP_PAGES[2].length === 10 && HELP_PAGES[3].length === 10);
const steleRow = HELP_PAGES[3].find((r) => r[0] === '试炼碑位置');
ok('试炼进阶页试炼碑位置行 v21.27 指针保留（蓝色石碑 + 可问守碑人派生）',
  !!steleRow && steleRow[1].includes('蓝色石碑') && steleRow[1].includes('可问' + NPCS.sentinel.name));

// —— 源码级守护：v21.28 注释 + 派生式落位 ——
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.28 注释（地图指南星井矿脉行补试炼碑入口说明）', dSrc.includes('v21.28 地图指南星井矿脉行补试炼碑入口'));
ok('data.js 星井矿脉行以 NPCS.sentinel.name 派生（无裸「（可问守碑人）」拼接）',
  dSrc.includes("'更强魔物·迷宫·试炼碑（可问' + NPCS.sentinel.name + '）·中央终焉水晶·双徽记化为门'"));

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('README 已同步（tests 树收录 smoke_v2128_mapstele + 冒烟口径已去硬化：实件数由后续版本冒烟守护，v21.7 惯例）',
  readme.includes('smoke_v2128_mapstele') && readme.includes('冒烟') && readme.includes('件套'));
ok('README 系统清单已补「地图指南星井矿脉行补试炼碑入口」口径', readme.includes('地图指南」星井矿脉行补试炼碑入口'));
ok('package.json 已收录 smoke_v2128_mapstele（npm test 串跑第 24 份）',
  pkg.includes('smoke_v2128_mapstele.mjs'));
const s2127 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2127_stelenpc.mjs'), 'utf8');
ok('smoke_v2127 的 README 守护表达式已去硬化（v21.7 惯例：不再以「二十三件套」断言件数，实件数由本版冒烟守护）',
  s2127.includes("includes('冒烟')") && s2127.includes("includes('件套')") && !s2127.includes("includes('二十三件套')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
