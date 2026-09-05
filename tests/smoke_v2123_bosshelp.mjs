// v21.23 专项冒烟：帮助页「试炼进阶」补三 Boss 机制预览（仓库常驻版，承 v21.10 起冒烟入库先例 +
// v21.11/v21.20 全页宽度预算惯例）。
// 背景：三 Boss（幽冥魔王/洞窟领主/终焉之神）的 变身（phase2）/石甲/封印治愈 机制此前只出现在战斗画面角标
// （二段变身线 ·HP<130、变身：攻+7 防+3 回15%、⛔治愈封印）与战报里，帮助页作为「战前知识中枢」
// （v21.2/v21.14/v21.15 主线）四页都查不到——玩家第一次面对 Boss 前无法预习「血过半现真身+回血 /
// 洞窟领主要防石甲 / 终焉之神祸乱形态封印治愈」；本版在「试炼进阶」页新增三行（6→9 行），全部从
// SPECIES.phase2 / acts 派生（同 enemyAI 变身结算、drawBattle 变身线/增益/招数一览同源），零裸字面量。
import { GAME_VERSION, HELP_PAGES, SPECIES, RUSH_RECOVER } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.23 帮助页三 Boss 机制预览冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.22 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.22', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 22)));

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
ok('试炼进阶页 9 行（原 6 行 + v21.23 三 Boss 预览 3 行）', page3.length === 9, `实际 ${page3.length}`);
const row = (label) => page3.find((r) => r[0] === label);
ok('三 Boss 行存在（幽冥魔王/洞窟领主/终焉之神）', !!row('幽冥魔王') && !!row('洞窟领主') && !!row('终焉之神'));

// —— 派生口径（与 data.js phaseBoost / BOSS_SHIELD_MAX / BOSS_TRUE_FORBID 逐字同式，测试侧独立复算）——
const pb = (p) => `攻+${p.atk} 防+${p.def} 回血${Math.round((p.heal || 0) * 100)}%HP`;
const demon = SPECIES['幽冥魔王'], cave = SPECIES['洞窟领主'], tru = SPECIES['终焉之神'];
ok('幽冥魔王行与 SPECIES.phase2 派生串逐字相等（零裸字面量）',
  row('幽冥魔王')[1] === '血量过半现出真身：' + pb(demon.phase2), row('幽冥魔王')[1]);
ok('洞窟领主行与 SPECIES.phase2 + acts.shield.maxShield 派生串逐字相等（零裸字面量）',
  row('洞窟领主')[1] === '石甲（至多' + cave.acts.find((a) => a.type === 'shield').maxShield + '层）· 血量过半现出真身：' + pb(cave.phase2),
  row('洞窟领主')[1]);
ok('终焉之神行 r[1] 与 SPECIES.phase2 派生串逐字相等（零裸字面量）',
  row('终焉之神')[1] === '血量过半进入祸乱形态：' + pb(tru.phase2), row('终焉之神')[1]);
const forbidHeal = !!((tru.phase2.forbid) || []).includes('heal');
ok('终焉之神 r[2] 与 forbid 派生一致（封印治愈技能 · 喝药不受影响——battle.doItem 无 forbid 检查）',
  row('终焉之神')[2] === (forbidHeal ? '祸乱形态封印治愈技能（喝药不受影响）' : ''), row('终焉之神')[2]);
ok('真源健全：三 Boss phase2 均定义且 atk/def/heal 为正数', !!demon.phase2 && !!cave.phase2 && !!tru.phase2 &&
  demon.phase2.atk > 0 && cave.phase2.def > 0 && tru.phase2.heal > 0);
ok('真源一致：洞窟领主石甲至多 2 层（acts.shield.maxShield===2，drawBattle 招数一览同读）',
  cave.acts.find((a) => a.type === 'shield').maxShield === 2);
ok('真源一致：终焉之神 forbid 含 heal（enemyAI 变身赋 forbid、drawBattle「⛔ 治愈封印」同源）', forbidHeal);

// —— 宽度预算（r1 14px x=100 + 标签；r2 12px x=100；面板右缘 570）——
let allW = true;
for (const label of ['幽冥魔王', '洞窟领主', '终焉之神']) {
  const r = row(label);
  const w1 = estW(r[0] + '   ', 14) + estW(r[1], 14);
  const w2 = r[2] ? estW(r[2], 12) : 0;
  if (w1 > LINE_MAX || w2 > LINE_MAX) { allW = false; console.log('    <- 越界:', label, Math.round(w1), Math.round(w2)); }
}
ok('三 Boss 行估算宽 ≤470（r[1] 与 r[2] 均在面板内；实测最大 洞窟领主 ≈403）', allW);

// —— 全页行宽巡检（承 v21.20：新增行自动纳入）——
let allOk3 = true;
page3.forEach((r) => {
  const w = estW(r[0] + '   ', 14) + estW(r[1], 14);
  if (w > LINE_MAX) { allOk3 = false; console.log('    <- 越界行:', r[0], Math.round(w)); }
  if (r[2] && estW(r[2], 12) > LINE_MAX) { allOk3 = false; console.log('    <- r2越界:', r[0]); }
});
ok('试炼进阶页全部 9 行估算宽 ≤470（含新增三行）', allOk3);

// —— drawHelp 布局派生：9 行 ≤10 → sp=34 档；r[2] 2 行 → 末行基线 418 不触页脚 452 ——
const sp = page3.length > 10 ? 25 : 34;
const yEnd = 80 + page3.length * sp + page3.filter((r) => r[2]).length * 16;
ok('drawHelp 页长派生：sp=34 档且末行基线 418 ≤440（页脚 452 前留白）', sp === 34 && yEnd === 418 && yEnd <= 440, `sp=${sp} yEnd=${yEnd}`);

// —— 零回归守护：原 6 行关键词未误动 ——
const p3keys = ['试炼碑位置', '双徽记条件', '试炼三连战', '重整旗鼓', '快速旅行', '蘑菇宝箱'];
ok('原 6 行关键词全在（试炼碑/双徽记/试炼三连战/重整旗鼓/快旅/蘑菇宝箱）', p3keys.every((k) => !!row(k)));
ok('试炼三连战行 r[1]+r[2] 未动（RUSH_RECOVER 派生 35%HP/50%MP 逐字不变）',
  row('试炼三连战')[1] === '连战三名最强 Boss，全胜获「百炼成钢」' &&
  row('试炼三连战')[2] === '每胜一关回血' + Math.round(RUSH_RECOVER.hp * 100) + '%HP/' + Math.round(RUSH_RECOVER.mp * 100) + '%MP');
ok('其余三页行数未动（操作 14 / 地图指南 5 / 魔物状态 10）',
  HELP_PAGES[0].length === 14 && HELP_PAGES[1].length === 5 && HELP_PAGES[2].length === 10);

// —— data.js 派生定义在库 + 注释 ——
const dataSrc = await (async () => { try { return (await import('node:fs')).readFileSync(new URL('../js/data.js', import.meta.url), 'utf8'); } catch { return ''; } })();
ok('data.js 含 BOSS_P2/BOSS_SHIELD_MAX/BOSS_TRUE_FORBID/phaseBoost 定义与「单一数据源」注释',
  dataSrc.includes('const BOSS_P2') && dataSrc.includes('const BOSS_SHIELD_MAX') &&
  dataSrc.includes('const BOSS_TRUE_FORBID') && dataSrc.includes('const phaseBoost') &&
  dataSrc.includes('三 Boss 变身/机制预览派生'));

// —— README 同步守护（tests 树收录 smoke_v2123_bosshelp + 冒烟/件套口径存在 + 试炼进阶关键词）——
const readmeOk = await (async () => {
  try {
    const fs = await import('node:fs');
    const txt = fs.readFileSync(new URL('../README.md', import.meta.url), 'utf8');
    return txt.includes('smoke_v2123_bosshelp') && txt.includes('冒烟') && txt.includes('件套') && txt.includes('试炼进阶');
  } catch { return false; }
})();
ok('README 已同步（tests 树收录 smoke_v2123_bosshelp + 冒烟/件套口径存在）', readmeOk);

// —— package.json 已收录 ——
const pkgOk = await (async () => {
  try {
    const fs = await import('node:fs');
    const txt = fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8');
    return txt.includes('smoke_v2123_bosshelp');
  } catch { return false; }
})();
ok('package.json test 串已收录 smoke_v2123_bosshelp', pkgOk);

// —— 上一版（v2122）README 守护已去硬化（承 v21.7 惯例：件数随版本递增，数字写死必然脱节）——
const v2122Ok = await (async () => {
  try {
    const fs = await import('node:fs');
    const txt = fs.readFileSync(new URL('./smoke_v2122_chesttotal.mjs', import.meta.url), 'utf8');
    return txt.includes("txt.includes('冒烟') && txt.includes('件套')")
      && !txt.includes("txt.includes('十八件套')") && !txt.includes('十八件套');
  } catch { return false; }
})();
ok('smoke_v2122 的 README 守护表达式已去硬化（不再以「件数数字」断言件数）', v2122Ok);

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
