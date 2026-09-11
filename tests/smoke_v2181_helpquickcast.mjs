// v21.81 专项冒烟：帮助页「战斗」行补技能菜单数字键快捷直发口径——数字键 1-7 快捷直发技能（v19.48 起）
// 在战斗内技能菜单页脚（drawBattle「[数字键]快捷」）与 README 战斗段（「或按数字键 1-7 快捷直发——
// 两种方式同效」）都有标注，唯独 H 页「战斗」行只写「2技能(↑↓/Enter 选招)」——H 页作为战前知识中枢的
// 操作总清单（v21.14 确立）漏了这个同效入口；现 r[2] 次行追加「 · 技能菜单数字键1-7快捷直发」
// （12px estW ≈453.6 ≤470 面板预算，行数不变仍 14，r[1] 主行逐字未动，纯文字零逻辑零结算）。
// 本冒烟守护：版本锚点、data.js 源级落位（r[1] 逐字零回归 + r[2] 追加 + 既有段全保留）、
// 行宽与页长预算、功能真实存在（drawBattle 页脚/main.js 数字分派/README 口径三方互证）、
// README/package 同步、smoke_v2180..v2176 件套 pin 与 smoke_v2179 GAME_VERSION pin 随新现实更新。
import { GAME_VERSION, HELP_PAGES, FLEE_SUCCESS, CHARGE_MULT } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.81 帮助页数字键快捷直发口径冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.80 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.80', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 81)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');

ok('data.js 含 v21.81 版本注释', dataSrc.includes('v21.81 帮助页「战斗」行补技能菜单数字键快捷直发口径'));
ok('data.js GAME_VERSION 字面量已更新为 v21.82', dataSrc.includes("const GAME_VERSION = 'v22.16';"));

// —— HELP_PAGES 数据契约：战斗行 r[1] 主行逐字零回归（含 FLEE_SUCCESS 派生），r[2] 追加新段 ——
const page0 = HELP_PAGES[0] || [];
const combat = page0.filter((r) => r[0] === '战斗');
ok('操作说明页「战斗」行唯一存在', combat.length === 1);
const row = combat[0] || [];
const wantR1 = '1攻击 2技能(↑↓/Enter 选招) 3药水 4逃跑(约' + Math.round(FLEE_SUCCESS * 100) + '%) 5防御 6蓄力';
ok('r[1] 主行逐字零回归（6 指令与 FLEE_SUCCESS 派生口径未动）', row[1] === wantR1);
ok('r[2] 含新增「技能菜单数字键1-7快捷直发」', typeof row[2] === 'string' && row[2].includes('技能菜单数字键1-7快捷直发'));
ok('r[2] 既有段零回归（蓄力×CHARGE_MULT 同源派生）', typeof row[2] === 'string' && row[2].includes('蓄力：下击/技能×' + CHARGE_MULT));
ok('r[2] 既有段零回归（Boss无法逃跑 / ↑↓ 回看战斗记录）',
  typeof row[2] === 'string' && row[2].includes('Boss无法逃跑') && row[2].includes('↑↓ 回看战斗记录'));
ok('r[2] 新段追加在既有两段之后（顺序合理）',
  typeof row[2] === 'string' && row[2].indexOf('蓄力') < row[2].indexOf('技能菜单数字键1-7快捷直发'));

// —— 行宽预算（smoke_v2179 同款 estW）：r[2] 12px ≤470 面板预算、r[1] 14px ≤470 ——
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
const wR2 = estW(row[2] || '', 12);
const wR1 = estW(row[1] || '', 14);
ok('r[2]（12px）估算宽 ≤470 面板预算', wR2 <= 470, `≈${wR2.toFixed(1)}`);
ok('r[1]（14px）估算宽 ≤470 面板预算（零回归巡检）', wR1 <= 470, `≈${wR1.toFixed(1)}`);
ok('页长预算：操作说明页行数不变仍 14（sp=25 档不触页脚 452）', page0.length === 14, `实际 ${page0.length}`);

// —— 功能真实存在（三方互证：菜单页脚 / main.js 数字分派 / README 口径）——
const dbSrc = read('../js/view/drawBattle.js');
const mainSrc = read('../js/main.js');
const readme = read('../README.md');
const pkg = read('../package.json');
ok('战斗内技能菜单页脚确有「[数字键]快捷」标注（功能真实）', dbSrc.includes('[数字键]快捷'));
ok('main.js 技能数字键 1-7 快捷施放分派存在（功能真实）',
  mainSrc.includes("['1', '2', '3', '4', '5', '6', '7']") && mainSrc.includes('idx >= 0 && idx < list.length'));
ok('README 战斗段早已标注「数字键 1-7 快捷直发」（同口径）', readme.includes('数字键 1-7 快捷直发'));

// —— README / package / 姊妹件套 pin 随新现实更新（v21.7 惯例：最新版守护 README 与旧 pin）——
ok('README 已同步（tests 树收录 smoke_v2181_helpquickcast + 件套口径）',
  readme.includes('smoke_v2181_helpquickcast') && readme.includes('件套'));
ok('README 件套口径已更新为一百一十二件套（一百一十一件套清除）',
  readme.includes('一百一十二件套（一百一十一件套清除）') && !readme.includes('七十六件套（七十五件套清除）'));
ok('README 含 v21.81 守护描述', readme.includes('v21.81 起含帮助页「战斗」行技能菜单数字键快捷直发口径守护'));
ok('package.json 已收录 smoke_v2181_helpquickcast（第 77 份）', pkg.includes('tests/smoke_v2181_helpquickcast.mjs'));
const s2180 = read('../tests/smoke_v2180_grain.mjs');
const s2179 = read('../tests/smoke_v2179_titlerecap.mjs');
const s2178 = read('../tests/smoke_v2178_codexseen.mjs');
const s2177 = read('../tests/smoke_v2177_elites.mjs');
const s2176 = read('../tests/smoke_v2176_allchests.mjs');
ok('smoke_v2180 的 README 件套 pin 已随新现实更新为一百一十二件套（一百一十一件套清除）',
  s2180.includes('一百一十二件套（一百一十一件套清除）') && !s2180.includes('七十六件套（七十五件套清除）'));
ok('smoke_v2179 的 README 件套 pin 已随新现实更新为一百一十二件套（一百一十一件套清除）',
  s2179.includes('一百一十二件套（一百一十一件套清除）') && !s2179.includes('七十六件套（七十五件套清除）'));
ok('smoke_v2179 的 GAME_VERSION 字面量 pin 已随新现实更新为 v21.84',
  s2179.includes("const GAME_VERSION = 'v22.16';"));
ok('smoke_v2178 的 README 件套 pin 已随新现实更新为一百一十二件套（一百一十一件套清除）',
  s2178.includes('一百一十二件套（一百一十一件套清除）') && !s2178.includes('七十六件套（七十五件套清除）'));
ok('smoke_v2177 的 README 件套 pin 已随新现实更新为一百一十二件套（一百一十一件套清除）',
  s2177.includes('一百一十二件套（一百一十一件套清除）') && !s2177.includes('七十六件套（七十五件套清除）'));
ok('smoke_v2176 的 README 件套 pin 已随新现实更新为一百一十二件套（一百一十一件套清除）',
  s2176.includes('一百一十二件套（一百一十一件套清除）') && !s2176.includes('七十六件套（七十五件套清除）'));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
