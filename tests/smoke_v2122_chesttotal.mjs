// v21.22 专项冒烟：全图宝箱总数数据化（chestTotal）+ 状态页宝箱计数双口径——「已开 X/全图 N · 成就 X/M」
// （仓库常驻版，承 v21.10 起冒烟入库先例 + v21.19 全图宝箱计数口径先例）。
// 背景：v21.19 加入无字回廊遗物宝箱后全图共 12 只（镇2+林3+矿2+星砂宝藏4+廊1），TREASURE_GOAL 注释里
// 的「全图可开启宝箱共 11 个」静默脱节（README 早已写「全图第 12 只」）；且游戏内状态页只标「📦 已开/6」
// 成就进度，玩家无从得知全图总量/剩余几只（扫箱规划 v19.47 小地图暖金缺全图总量这块拼图）。本版新增
// data.js chestTotal() 纯函数（MAPS 'C' 瓦片 + CAVE_TREASURE 派生，单一数据源），状态页资源行改并列
// 「已开 X/全图 N · 成就 X/M」双口径。本冒烟守护：版本锚点、chestTotal 导出/逐图正确性/与 v21.19 十二只
// 口径恒等、TREASURE_GOAL 未动、状态行新表达式与宽度预算、data.js 陈年「11 个」注释已除、README 同步
// （宝箱总数口径）、上一版（v2121）README 守护已按 v21.7 惯例去硬化。
import { GAME_VERSION, MAPS, CAVE_TREASURE, TREASURE_GOAL, chestCount, chestTotal } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.22 全图宝箱总数数据化冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.21 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.21', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 21)));

// —— chestTotal 导出与逐图正确性 ——
ok('chestTotal 已导出且为函数', typeof chestTotal === 'function');
const perMap = {};
let staticC = 0;
for (const [key, def] of Object.entries(MAPS)) {
  let c = 0;
  for (const row of (def.rows || [])) for (const ch of row) if (ch === 'C') c++;
  perMap[key] = c;
  staticC += c;
}
ok('逐图静态宝箱数（镇2/林3/矿2/廊1）', perMap.village === 2 && perMap.dungeon === 3 && perMap.cave === 2 && perMap.gallery === 1, JSON.stringify(perMap));
ok('星砂宝藏 2×2 仍 4 只（CAVE_TREASURE）', (CAVE_TREASURE || []).length === 4, String((CAVE_TREASURE || []).length));
ok('chestTotal() === 12（与 v21.19 全图十二只口径恒等）', chestTotal() === 12, String(chestTotal()));
ok('chestTotal() === 静态 8 + 星砂 4（派生自 data 而非写死）', chestTotal() === staticC + (CAVE_TREASURE || []).length);
ok('chestTotal() 为纯净整数且与 MAPS 改动联动（再数一遍恒等）', Number.isInteger(chestTotal()) && chestTotal() === Object.values(MAPS).reduce((s, def) => s + (def.rows || []).reduce((a, row) => a + [...row].filter((ch) => ch === 'C').length, 0), 0) + (CAVE_TREASURE || []).length);

// —— 成就阈值未动且仍可达 ——
ok('TREASURE_GOAL 仍 6（成就门槛未动）', TREASURE_GOAL === 6);
ok('TREASURE_GOAL < chestTotal()（阈值小于全图总数，语义自洽）', TREASURE_GOAL < chestTotal());

// —— 状态页双口径表达式（menus.js） ——
const menuSrc = await (async () => { try { return (await import('node:fs')).readFileSync(new URL('../js/view/menus.js', import.meta.url), 'utf8'); } catch { return ''; } })();
ok('menus.js 已导入 chestTotal', menuSrc.includes('chestTotal'));
ok('状态行改为「已开 X/全图 N · 成就 X/M」双口径',
  menuSrc.includes('📦:${chestCount(hero)}/${chestTotal()}·成就${chestCount(hero)}/${TREASURE_GOAL}'));
ok('旧的单一口径「📦:${chestCount(hero)}/${TREASURE_GOAL}」已不存在',
  !menuSrc.includes('📦:${chestCount(hero)}/${TREASURE_GOAL}'));

// —— 状态行宽度预算（estW 官方口径，14px 左起 x=110，面板右缘 570 → 预算 460；取最大字面量组合） ——
const estW = (s, size) => {
  let wsum = 0;
  for (const ch of String(s || '')) {
    const code = ch.codePointAt(0);
    const wide = (code >= 0x2e80 && code <= 0x9fff) || (code >= 0x3000 && code <= 0x303f) || (code >= 0xff00 && code <= 0xffef) || code >= 0x1f000;
    if (wide) wsum += 0.865 * size;
    else if (code === 0xb7) wsum += 0.303 * size;
    else if (code === 0x2f) wsum += 0.338 * size;
    else if (code === 0x2e) wsum += 0.226 * size;
    else if (code >= 0x30 && code <= 0x39) wsum += 0.63 * size;
    else if (code === 0x20) wsum += 0.263 * size;
    else wsum += 0.55 * size;
  }
  return wsum;
};
const worstLine = `金币:99999  🍖:99 🧪:99 🍄:99 📦:12/${chestTotal()}·成就12/${TREASURE_GOAL}  ⏱️999:59:59`;
const wLine = estW(worstLine, 14);
ok('状态行最宽组合估算 ≤460（面板内，右缘 570 − 起点 110）', wLine > 0 && wLine <= 460, `≈${wLine.toFixed(0)}`);

// —— data.js 陈年「11 个」注释已除、chestTotal 定义在库 ——
const dataSrc = await (async () => { try { return (await import('node:fs')).readFileSync(new URL('../js/data.js', import.meta.url), 'utf8'); } catch { return ''; } })();
ok('data.js 不再含陈年「宝箱共 11 个」字面量（v21.19 后脱节的旧口径）', !dataSrc.includes('宝箱共 11 个'));
ok('data.js 含 chestTotal 定义与「单一数据源」注释', dataSrc.includes('function chestTotal()') && dataSrc.includes('全图宝箱总数（单一数据源'));

// —— README 同步守护（tests 树收录 smoke_v2122_chesttotal + 冒烟/件套口径存在 + chestTotal 宝箱总数口径；
// v21.23 去硬化（承 v21.7 惯例）：原「件数数字」写死——件数随版本递增必然脱节，实件数由最新版冒烟
// （smoke_v2123）守护 README 口径——）
const readmeOk = await (async () => {
  try {
    const fs = await import('node:fs');
    const txt = fs.readFileSync(new URL('../README.md', import.meta.url), 'utf8');
    return txt.includes('smoke_v2122_chesttotal') && txt.includes('冒烟') && txt.includes('件套')
      && txt.includes('chestTotal');
  } catch { return false; }
})();
ok('README 已同步（tests 树收录 smoke_v2122_chesttotal + 冒烟/件套口径存在 + chestTotal 宝箱总数口径）', readmeOk);

// —— 上一版（v2121）README 守护已去硬化（承 v21.7 惯例：件数随版本递增，数字写死必然脱节）——
const v2121Ok = await (async () => {
  try {
    const fs = await import('node:fs');
    const txt = fs.readFileSync(new URL('./smoke_v2121_sndpersist.mjs', import.meta.url), 'utf8');
    return txt.includes("txt.includes('冒烟') && txt.includes('件套')")
      && !txt.includes("txt.includes('十七件套')") && !txt.includes('十七件套');
  } catch { return false; }
})();
ok('smoke_v2121 的 README 守护表达式已去硬化（不再以「十七件套」断言件数）', v2121Ok);

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
