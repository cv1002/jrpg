// v23.99 专项冒烟：README「数值速查」补「伤害公式」行——文档整理·数值说明·同源口径
// （承 v23.01-09/v23.97/v23.98 数值速查行系列同一「数值全部收口进 data.js 单一数据源、
// README 维护者速查与游戏内/结算同读一份源」主线：速查表 22 行已覆盖 基础属性/每级成长/升级经验/
// 技能领悟/装备/经济/区域修正/试炼推荐等级/战斗/克制状态/掉落/遇敌槽/出没生态/试炼彩头/成就档位/
// 魔物数值/技能数值/强敌变身/难度倍率/支线奖励/昼夜时段，唯独全游最核心的「伤害公式」查无一行——
// 基础伤害 `max(1, 攻×2−防)` 的唯一定义在 rules.js `cmdDmg`（威胁预警/伤害估算/技能结算/敌方AI 全部
// 经此函数，改公式只改这一处），普攻结算带 ±10% 浮动（×0.9~1.1，cmdDmg 第 4 参 rollVariance）再
// × 暴击 ×1.8/技能倍率，技能/敌方伤害无浮动；现补录，纯文档零逻辑零结算零存档零数值变化，
// cmdDmg/全部倍率常量逐字未动。
// 本冒烟守护：版本锚点、data.js 源级落位（v23.99 注释 / GAME_VERSION v23.99 与旧 v23.98 字面量
// 零残留 / v23.98 历史注释保留）、运行期伤害公式契约（cmdDmg 基础 max(1, 攻×2−防) 逐值/保底 1/
// 倍率乘算/±10% 浮动 14..16 区间/无浮动档恒等、skillDefUsed 穿透、elemMult 弱点抗性零回归）、
// README/package.json/CHANGELOG 同步（件套口径 223 + v23.99 守护描述 + 入库 223 + tests 树串尾 +
// package 串尾）、既有速查行零回归（战斗/克制状态行）、哨兵链（v2143 前望 224 且 README 尚无 224 口径）、
// 旧代 v23.98 pin 全库零残留扫描（字面量/恒等/顶 pin/件套 222-221 口径/testChain 222）。
import { GAME_VERSION, CRIT_MULT, CHARGE_MULT, ELEM_MULT, SHIELD_MULT, HEAVY_MULT, HEAVY_MULT_PHASED } from '../js/data.js';
import { cmdDmg, skillDefUsed, elemMult } from '../js/rules.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v23.99 「伤害公式」数值速查行 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const rSrc = read('js/rules.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v23.98 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v23.98', !!_gv && (_gv[0] > 23 || (_gv[0] === 23 && _gv[1] > 98)), GAME_VERSION);
ok('data.js 含 v23.99 注释（伤害公式速查行说明）', dSrc.includes('// v23.99 文档整理·数值说明·同源口径'));
ok('data.js GAME_VERSION 字面量已为 v23.99（旧 v23.98 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v23.99';") && !dSrc.includes("const GAME_VERSION = 'v23.9" + "8';"));
ok('data.js 仍保留 v23.98 历史注释（经济行灵药恢复量口径说明，累积注释块）',
  dSrc.includes('// v23.98 文档整理·数值说明·同源口径'));

// —— 运行期：伤害公式契约（v23.99 速查行唯一真源 rules.cmdDmg）——
ok('基础伤害 max(1, 攻×2−防)：cmdDmg(10,5,1,false)=15', cmdDmg(10, 5, 1, false) === 15, String(cmdDmg(10, 5, 1, false)));
ok('保底 1：cmdDmg(3,100,1,false)=1', cmdDmg(3, 100, 1, false) === 1, String(cmdDmg(3, 100, 1, false)));
ok('倍率乘算：cmdDmg(10,5,2,false)=30', cmdDmg(10, 5, 2, false) === 30, String(cmdDmg(10, 5, 2, false)));
ok('技能倍率口径：cmdDmg(10,5,1,false) 与 skillEstimate 同函数（零第二套公式）', rSrc.includes('cmdDmg') && rSrc.includes('Math.max(1, atk * 2 - def)'));
{
  let lo = 999, hi = -1, okRange = true;
  for (let i = 0; i < 300; i++) {
    const v = cmdDmg(10, 5, 1, true);
    lo = Math.min(lo, v); hi = Math.max(hi, v);
    if (v < 14 || v > 16) okRange = false;
  }
  ok('普攻 ±10% 浮动：300 次 cmdDmg(10,5,1,true) 全部落在 [14,16]（raw15×0.9~1.1）', okRange, lo + '..' + hi);
  ok('浮动确实生效（300 次出现多个值）', hi > lo, lo + '..' + hi);
}
ok('穿透防御：skillDefUsed({pierce:0.5},{def:10})=5', skillDefUsed({ pierce: 0.5 }, { def: 10 }) === 5, String(skillDefUsed({ pierce: 0.5 }, { def: 10 })));
ok('元素克制零回归：弱点 ×1.35 / 抗性 ×0.7', elemMult({ element: 'ice' }, { weak: 'ice' }) === ELEM_MULT.weak && elemMult({ element: 'fire' }, { resist: 'fire' }) === ELEM_MULT.resist);
ok('倍率常量存在且为正（CRIT/CHARGE/ELEM/SHIELD/HEAVY 单一数据源）',
  CRIT_MULT > 1 && CHARGE_MULT > 1 && ELEM_MULT.weak > 1 && ELEM_MULT.resist < 1 && SHIELD_MULT < 1 && HEAVY_MULT > 1 && HEAVY_MULT_PHASED > HEAVY_MULT);

// —— README / package.json / CHANGELOG 同步 ——
const testChain = (JSON.parse(pkg).scripts.test.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 223 件套', testChain === 223, String(testChain));
ok('package.json 已收录 smoke_v2399_dmgformula（npm test 串跑第 223 份）',
  JSON.parse(pkg).scripts.test.includes('smoke_v2399_dmgformula.mjs'));
ok('package.json 串尾为 ... smoke_v2398_econrow.mjs && node tests/smoke_v2399_dmgformula.mjs"',
  pkg.includes('node tests/smoke_v2398_econrow.mjs && node tests/smoke_v2399_dmgformula.mjs"'));
ok('README tests 树串尾已延伸至 smoke_v2399_dmgformula',
  readme.includes('+ smoke_v2398_econrow + smoke_v2399_dmgformula（npm test 串跑）'));
ok('README 件套口径为二百二十三件套（二百二十二件套清除）且旧 216 口径零残留',
  readme.includes('冒烟二百二十三件套（二百二十二件套清除）') && !readme.includes('冒烟二百一十六件套（二百一十五件套清' + '除）'));
ok('README 含 v23.99 守护描述（「伤害公式」数值速查行守护）', readme.includes('v23.99 起含 「伤害公式」数值速查行守护'));
ok('README 含 smoke_v2399_dmgformula 入库（223 份）', readme.includes('smoke_v2399_dmgformula 入库（223 份）'));
ok('README 仍保留 v23.98/v23.97 历史守护描述与入库口径（历史累积）',
  readme.includes('v23.98 起含 「经济」数值速查行灵药恢复量口径守护') &&
  readme.includes('smoke_v2398_econrow 入库（222 份）') &&
  readme.includes('v23.97 起含 「基础属性」数值速查行守护') &&
  readme.includes('smoke_v2397_baserow 入库（221 份）'));

// —— README 伤害公式行落位与零回归 ——
ok('README 伤害公式行：max(1, 攻×2−防) 与 rules.cmdDmg 唯一公式口径',
  readme.includes('| 伤害公式 | 基础伤害 = `max(1, 攻×2−防)`（`rules.cmdDmg` 唯一公式'));
ok('README 伤害公式行：±10% 浮动与暴击/倍率叠乘口径', readme.includes('普攻结算带 ±10% 浮动'));
ok('README 伤害公式行：常量源列（rules.cmdDmg + CRIT/CHARGE/ELEM/SHIELD/HEAVY）',
  readme.includes('| `rules.cmdDmg` `CRIT_MULT` `ELEM_MULT` `SHIELD_MULT` `CHARGE_MULT` `HEAVY_MULT` `HEAVY_MULT_PHASED` |'));
ok('README 伤害公式行 补录标记 v23.99 逐字', readme.includes('（v23.99 补录） | `rules.cmdDmg`'));
ok('README 战斗行零回归（速查行逐字未动）',
  readme.includes('| 战斗 | 普攻 12% 暴击 ×1.8 · 逃跑 60% · 防御减伤 50%+回 2MP+50% 反击 ×0.7 · 蓄力 ×1.5 | `CRIT_*` `FLEE_SUCCESS` `DEFEND_*` `COUNTER_*` `CHARGE_MULT` |'));
ok('README 克制/状态行零回归（弱点 ×1.35 · 抗性 ×0.7）',
  readme.includes('| 克制 / 状态 | 弱点 ×1.35 · 抗性 ×0.7；灼烧 4%HP×2 回合 · 中毒 5%HP×3 回合（下限 2）；石甲每层 -40% | `ELEM_MULT` `BURN_PCT` `POISON_*` `DOT_MIN` `SHIELD_MULT` |'));
ok('README 掉落/魔物数值/技能数值行零回归（同表既行逐字未动）',
  readme.includes('| 掉落 | 战斗胜利 38%：8% 装备或 +60 金 / 12% 药水 / 12% 蘑菇 / 6% 灵药；宝箱 林 60% 菇 · 镇/矿/廊 45% 金 | `DROP_*` `CHEST_*` |') &&
  readme.includes('| 魔物数值 | 普通怪 hp/atk/def/xp/gold 五组均为一阶线性'));

ok('CHANGELOG 顶部已追加 v23.99 条目（伤害公式数值速查行）', changelog.startsWith('## v23.99 '));
ok('CHANGELOG 顶部条目含伤害公式口径说明', changelog.includes('「伤害公式」') && changelog.includes('攻×2−防'));
ok('CHANGELOG 仍保留 v23.98 与 v23.97 条目标题（历史口径）',
  changelog.includes('## v23.98 文档整理·数值说明·同源口径') &&
  changelog.includes('## v23.97 文档整理·数值说明·同源口径'));

// —— 哨兵链：v2143 前哨前望 224 且 README 尚无 224 口径 ——
const s2143 = read('tests/smoke_v2143_talkekey.mjs');
ok('smoke_v2143 哨兵链已推进至二百二十四件套（二百二十三件套清除）',
  s2143.includes('二百二十四件套（二百二十三件套清除）') && s2143.includes("!readme.includes('二百二十四件套（二百二十三件套清除）')"));
ok('README 尚无二百二十四件套（二百二十三件套清除）前望口径', !readme.includes('二百二十四件套（二百二十三件套清除）'));

// —— 旧代 v23.98 pin 全库零残留（不含本件；拆串防误伤，承 v2319/v2392-98 惯例）——
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2399_dmgformula.mjs');
const stale = [];
for (const f of allTests) {
  const src = read('tests/' + f);
  if (src.includes("const GAME_VERSION = 'v23.9" + "8';") ||
      src.includes("const GAME_VERSION = 'v23.9" + "8'") ||
      src.includes("GAME_VERSION === 'v23.9" + "8'") ||
      src.includes("startsWith('## v23.9" + "8 ") ||
      src.includes("startsWith('## v23.9" + "8'") ||
      src.includes('二百二十二件套（二百二十一件套清' + '除）') ||
      src.includes('testChain === ' + '222')) stale.push(f);
}
ok('旧代 v23.98 字面量/恒等/顶 pin/件套 222-221 口径/testChain 222 全库零残留（' + allTests.length + ' 件扫描，仅 v23.98 特性标签保留）',
  stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
