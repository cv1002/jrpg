// v21.11 专项冒烟：帮助页「魔物状态」页三行越界修复——面板内宽度预算 + 信息完整性（仓库常驻版）
// 背景：v19.59 修过操作页 14px 行越界（战斗行拆 r[2]），但魔物状态页 v19.57+ 添加的
// 「石心魔像·石甲 / 战斗掉落 / 宝箱掉落」三行 14px 实测 x 终点 578/632/649，超面板右缘 570，
// 其中「宝箱掉落」达 649 已出画布 640（末尾被裁）。本版：石甲行压缩「下一次攻击」→「下一击」、
// 掉落两行拆 r[1]+r[2]（drawHelp 已支持 r[2] 次级行，v19.59 同款）。
import { GAME_VERSION, HELP_PAGES, DROP_EQUIP, DROP_POTION, DROP_MUSHROOM, DROP_ELIXIR, DROP_GOLD, CHEST_MUSHROOM, CHEST_GOLD, CHEST_GOLD_BASE, CHEST_GOLD_PER_LV, SHIELD_MULT, ELITE_GATE_LV, ELITE_CHANCE } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.11 帮助页宽度冒烟 —');

// 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.10
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.10', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 10)));

// —— 宽度预算（纯估算，不依赖 canvas，零依赖约定）——
// drawHelp：14px 从 x=100，面板右缘 570 → 内容宽上限 470（含 3 空格前缀 r[0]+'   '）
// 估算系数经 @napi-rs/canvas 实测标定（14px sans-serif：汉字/全角标点 12.11、数字 8.82、空格 3.68、
// ·4.24、%11.58、+7.6、-6.05、/4.73、×7.9、—11.37 → 系数 = 实宽/14），整体误差 <6%，杜绝「估出假越界」
const estW = (s, size) => {
  let wsum = 0;
  for (const ch of String(s || '')) {
    const code = ch.codePointAt(0);
    // 0x2E80-0x9FFF CJK / 0x3000-0x303F 中日韩标点 / 0xFF00-0xFFEF 全角形式 / emoji → 全宽 0.865em
    const wide = (code >= 0x2e80 && code <= 0x9fff) || (code >= 0x3000 && code <= 0x303f) || (code >= 0xff00 && code <= 0xffef) || code >= 0x1f000;
    if (wide) wsum += 0.865 * size;
    else if (code === 0xb7) wsum += 0.303 * size;      // ·
    else if (code === 0xd7) wsum += 0.564 * size;      // ×
    else if (code === 0x25) wsum += 0.827 * size;      // %
    else if (code === 0x2b) wsum += 0.543 * size;      // +
    else if (code === 0x2d) wsum += 0.432 * size;      // -
    else if (code === 0x2f) wsum += 0.338 * size;      // /
    else if (code === 0x2e) wsum += 0.226 * size;      // .
    else if (code === 0x2014) wsum += 0.812 * size;    // —
    else if (code >= 0x30 && code <= 0x39) wsum += 0.63 * size;   // 数字
    else if (code === 0x20) wsum += 0.263 * size;      // 空格
    else wsum += 0.55 * size;                          // 其它半角（字母等）
  }
  return wsum;
};
const LINE_MAX = 470;   // 570 - 100（面板右缘 - 起点）
const R2_MAX = 470;     // r[2] 12px 起点同为 x=100

// —— 页 2（魔物状态）结构 ——
const page = HELP_PAGES[2];
ok('魔物状态页行数仍为 10（拆分不增行、压缩不删行）', page.length === 10, `实际 ${page.length}`);
ok('魔物状态页位于第 3 页（索引 2）', Array.isArray(HELP_PAGES[2]));

// —— 三处修复行 ——
const findRow = (key) => page.find((r) => r[0] === key);
const rowShield = findRow('石心魔像·石甲');
const rowDrop = findRow('战斗掉落');
const rowChest = findRow('宝箱掉落');
ok('三处修复行均存在', !!(rowShield && rowDrop && rowChest));

// 1) 石甲行：压缩文案（「下一次攻击」→「下一击」），语义等价（-40% 仍由 SHIELD_MULT 派生）
ok('石甲行已压缩「下一次攻击」→「下一击」', rowShield && !rowShield[1].includes('下一次攻击') && rowShield[1].includes('下一击'));
ok('石甲行减伤百分比与 SHIELD_MULT 同源', rowShield && rowShield[1].includes('-' + Math.round((1 - SHIELD_MULT) * 100) + '%'));
const wShield = estW(rowShield[0] + '   ', 14) + estW(rowShield[1], 14);
ok('石甲行估算宽 ≤470（修复前 578 越界）', wShield <= LINE_MAX, `≈${wShield.toFixed(0)}`);

// 2) 战斗掉落行：r[1]+r[2] 拆分，百分比区间完整保留且与常量同源
ok('战斗掉落行已拆 r[2]', rowDrop && rowDrop.length === 3 && !!rowDrop[2], `len=${rowDrop && rowDrop.length}`);
const dropAll = (rowDrop && (rowDrop[1] + ' · ' + (rowDrop[2] || ''))) || '';
ok('战斗掉落行含全部四档：装备/药水/蘑菇/灵药',
  dropAll.includes(Math.round(DROP_EQUIP * 100) + '%') &&
  dropAll.includes(Math.round(DROP_POTION * 100) + '%') &&
  dropAll.includes(Math.round(DROP_MUSHROOM * 100) + '%') &&
  dropAll.includes(Math.round(DROP_ELIXIR * 100) + '%'), dropAll);
ok('战斗掉落行主行含装备档 +60 金（与 DROP_GOLD 同源）', dropAll.includes('+' + DROP_GOLD + '金'));
const wDrop = estW(rowDrop[0] + '   ', 14) + estW(rowDrop[1], 14);
const wDrop2 = estW(rowDrop[2], 12);
ok('战斗掉落主行估算宽 ≤470（修复前 632 越界）', wDrop <= LINE_MAX, `≈${wDrop.toFixed(0)}`);
ok('战斗掉落 r[2] 估算宽 ≤470', wDrop2 <= R2_MAX, `≈${wDrop2.toFixed(0)}`);

// 3) 宝箱掉落行：r[1]+r[2] 拆分，两图掉率 + 金币公式完整保留
ok('宝箱掉落行已拆 r[2]', rowChest && rowChest.length === 3 && !!rowChest[2], `len=${rowChest && rowChest.length}`);
const chestAll = (rowChest && (rowChest[1] + ' · ' + (rowChest[2] || ''))) || '';
ok('宝箱掉落行含雾语林三档 60/18/22',
  chestAll.includes(Math.round(CHEST_MUSHROOM * 100) + '%蘑菇') &&
  chestAll.includes(Math.round((1 - CHEST_MUSHROOM) * CHEST_GOLD * 100) + '%金币') &&
  chestAll.includes(Math.round((1 - CHEST_MUSHROOM) * (1 - CHEST_GOLD) * 100) + '%药水'), chestAll);
ok('宝箱掉落行含城镇/矿脉两档 45/55',
  chestAll.includes(Math.round(CHEST_GOLD * 100) + '%金币') && chestAll.includes(Math.round((1 - CHEST_GOLD) * 100) + '%药水'));
ok('宝箱掉落行含金币公式 12+级×5（与常量同源）', chestAll.includes(CHEST_GOLD_BASE + '+级×' + CHEST_GOLD_PER_LV), chestAll);
const wChest = estW(rowChest[0] + '   ', 14) + estW(rowChest[1], 14);
const wChest2 = estW(rowChest[2], 12);
ok('宝箱掉落主行估算宽 ≤470（修复前 649 越界）', wChest <= LINE_MAX, `≈${wChest.toFixed(0)}`);
ok('宝箱掉落 r[2] 估算宽 ≤470', wChest2 <= R2_MAX, `≈${wChest2.toFixed(0)}`);

// —— 全页行宽预算（防将来加长行再犯）——
let allOk = true;
page.forEach((r) => {
  const wMain = estW(r[0] + '   ', 14) + estW(r[1], 14);
  if (wMain > LINE_MAX) { allOk = false; console.log('    <- 越界行:', r[0], Math.round(wMain)); }
  if (r[2] && estW(r[2], 12) > R2_MAX) { allOk = false; console.log('    <- r2越界:', r[0]); }
});
ok('魔物状态页全部行估算宽 ≤470', allOk);

// —— 数值等值守护：拆分前后百分比总数不变（纯显示零结算，DROP_* / CHEST_* 未被改动）——
ok('DROP 常量仍为装备 8 / 药水 12 / 蘑菇 12 / 灵药 6',
  DROP_EQUIP === 0.08 && DROP_POTION === 0.12 && DROP_MUSHROOM === 0.12 && DROP_ELIXIR === 0.06);
ok('CHEST 常量仍为 60% 蘑菇 / 45% 金币档 / 12+级×5',
  CHEST_MUSHROOM === 0.6 && CHEST_GOLD === 0.45 && CHEST_GOLD_BASE === 12 && CHEST_GOLD_PER_LV === 5);
ok('SHIELD_MULT 未变（减伤 40% 口径）', SHIELD_MULT === 0.6);
ok('ELITE 门槛/概率未变', ELITE_GATE_LV === 3 && ELITE_CHANCE === 0.07);

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
