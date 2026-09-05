// v21.19 专项冒烟：无字回廊遗物宝箱——终局区此前是全游戏唯一没有宝箱的地图（village 2 / dungeon 3 / cave 2+4
// 延迟显形，唯独 gallery 0），「被忘掉的名字存放处」没有任何探索奖励；本版在北壁名字石碑群间放一只
// 遗物宝箱（16,1），走 world.onStep 既有开箱管线（hero.chests 持久化、开箱计数成就、45% 金币/55% 药水档），
// 并把 H 页「宝箱掉落」行从「城镇/矿脉」扩为「城镇/矿脉/无字回廊」——宝箱存在了，口径必须跟上（v20.3/v21.14
// 「功能存在就必须能看到」主线）。本冒烟守护：版本锚点、宝箱落位（恰 1 只、坐标 (16,1)、不与石碑/精英/祭坛/
// NPC/玩家起点冲突、可行走）、行宽不变、帮助页口径与宽度预算、README 同步（十五件套 + 地图条目含宝箱 + 数值
// 速查 + 帮助页描述）、上一版（v2118）README 守护已按 v21.7 惯例去硬化。
import { GAME_VERSION, MAPS, TY, SOLID, chToTy, HELP_PAGES, CAVE_TREASURE, TREASURE_GOAL, CHEST_GOLD, CHEST_GOLD_BASE, CHEST_GOLD_PER_LV } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.19 无字回廊遗物宝箱冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.18 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.18', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 18)));

// —— 落位守护：gallery 恰 1 只 'C' 且位于 (16,1)，其余行/其余图不受本次改动影响 ——
const gRows = MAPS.gallery.rows;
const chestSpots = [];
gRows.forEach((row, y) => { for (let x = 0; x < row.length; x++) if (row[x] === 'C') chestSpots.push(x + ',' + y); });
ok('无字回廊恰 1 只宝箱', chestSpots.length === 1, chestSpots.join(' '));
ok('宝箱位于北壁石碑群间 (16,1)', chestSpots.length === 1 && chestSpots[0] === '16,1');
ok('行宽不变（rows[1] 仍 24 列、总行数仍 9）', gRows.length === 9 && gRows[1].length === 24 && gRows[1].length === gRows[0].length);
ok('其余行未被误动（除 rows[1] 外无 C）', gRows.every((row, y) => y === 1 || !row.includes('C')));

// —— 可行性守护：既有开箱管线对 'C' 瓦片均可用 ——
ok('宝箱瓦片可行走（TY.CHEST 不在 SOLID）', !SOLID.has(TY.CHEST));
ok("chToTy('C')===TY.CHEST（开箱/绘制同走既有管线）", chToTy('C') === TY.CHEST);
const gExtras = MAPS.gallery.extras || [];
const occupy = new Set(gExtras.map((e) => e.x + ',' + e.y));
if (MAPS.gallery.playerStart) occupy.add(MAPS.gallery.playerStart.x + ',' + MAPS.gallery.playerStart.y);
ok('宝箱不与石碑/精英/祭坛/NPC/玩家起点冲突', !occupy.has('16,1'), [...occupy].join(' '));
ok('既有四块名字石碑坐标未变（(5,1)(10,1)(15,1)(20,1) 仍在 extras）',
  ['5,1', '10,1', '15,1', '20,1'].every((k) => occupy.has(k)));

// —— 全游戏宝箱总数守护：11 → 12（新增 1 只，阈值成就不受影响）——
let staticC = 0;
for (const m of Object.values(MAPS)) if (m.rows) for (const row of m.rows) for (const ch of row) if (ch === 'C') staticC++;
ok('全游戏静态宝箱 7 → 8（新增恰 1 只）', staticC === 8, String(staticC));
ok('含延迟显形 CAVE_TREASURE 共 12 只 ≤ 成就阈值仍可达成（TREASURE_GOAL=' + TREASURE_GOAL + '）',
  staticC + CAVE_TREASURE.length === 12 && TREASURE_GOAL <= staticC + CAVE_TREASURE.length);

// —— H 页「宝箱掉落」口径守护（宝箱存在了，战前知识中枢必须跟上）——
const rowChest = HELP_PAGES[2].find((r) => r[0] === '宝箱掉落');
const chestAll = rowChest ? rowChest.slice(1).join('') : '';
ok('宝箱掉落行仍在（r[1]+r[2]）', !!rowChest && rowChest.length === 3 && !!rowChest[2]);
ok('r[2] 已扩为「城镇/矿脉/无字回廊」', !!rowChest[2] && rowChest[2].includes('无字回廊'), rowChest[2] || '');
ok('r[2] 两档 45/55 仍由 CHEST_GOLD 派生', !!rowChest[2] && rowChest[2].includes(Math.round(CHEST_GOLD * 100) + '%金币') && rowChest[2].includes(Math.round((1 - CHEST_GOLD) * 100) + '%药水'));
ok('r[1] 雾语林三档与金币公式未误动', chestAll.includes(Math.round(CHEST_GOLD_BASE) + '+级×' + CHEST_GOLD_PER_LV));

// —— r[2] 宽度预算（12px 估算，系数沿 v21.18 官方冒烟标定口径，面板右缘 570 − 起点 100 = 470）——
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
const wR2 = estW(rowChest && rowChest[2], 12);
ok('r[2] 扩写后估算宽 ≤470（面板内）', wR2 > 0 && wR2 <= 470, `≈${wR2.toFixed(0)}`);

// —— README 同步守护（实件数由本版守护：十五件套）——
const readmeOk = await (async () => {
  try {
    const fs = await import('node:fs');
    const txt = fs.readFileSync(new URL('../README.md', import.meta.url), 'utf8');
    return txt.includes('smoke_v2119_gallerychest') && txt.includes('十五件套') && !txt.includes('十四件套')
      && txt.includes('无字回廊') && txt.includes('遗物宝箱');
  } catch { return false; }
})();
ok('README 已同步（tests 树收录 smoke_v2119_gallerychest + 冒烟十五件套口径、十四件套清除 + 无字回廊条目含遗物宝箱）', readmeOk);

// —— 上一版（v2118）README 守护已去硬化（承 v21.7 惯例：件数随版本递增，数字写死必然脱节）——
// 注：v2118 头部注释/去硬化说明里仍会提到旧字面量（历史口径），故只守护「守护表达式」不再写死件数
const v2118Ok = await (async () => {
  try {
    const fs = await import('node:fs');
    const txt = fs.readFileSync(new URL('./smoke_v2118_titlerow.mjs', import.meta.url), 'utf8');
    return txt.includes("txt.includes('冒烟') && txt.includes('件套')")
      && !txt.includes("txt.includes('十四件套')") && !txt.includes("txt.includes('十三件套')");
  } catch { return false; }
})();
ok('smoke_v2118 的 README 守护表达式已去硬化（不再以「十四件套/十三件套」断言件数）', v2118Ok);

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
