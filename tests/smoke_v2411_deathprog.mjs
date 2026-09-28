// v24.11 专项冒烟：阵亡画面补「💪 败而不馁 N/10」进度行——倒在强敌面前一眼看清还差几次
// 拿成就（体验打磨·信息透明·计数现场，承 v24.10 酿造「🍶 妙手回春 N/5」/ v24.09 商店「🍄 蘑菇商路
// N/30」/ v24.08 快速旅行「🚶 行者无疆 N/15」/ v24.07 旅馆「🏨 夜宿灯下 N/15」/ v24.05 试炼碑
// 「📜 千锤百炼 N/3」同款行内进度 / v23.87 败而不馁成就同一「计数现场报进度」主线：阵亡复盘屏
// （drawDead、battle.loseBattle 全游唯一战败结算点）此前只报 战绩/余粮/建议/收集三件套/五徽记/未存档
// （v19.88-v23.79），成就「败而不馁」（累计阵亡 DEATH_GOAL(10) 次，计数 hero.deaths 由
// battle.loseBattle 战败结算点写入、snapshotHero 全量快照自动持久化、防御式 (S.G.deaths||0)
// 旧档零迁移）进度只藏在 C 成就页一行 X/10——倒下的瞬间查无一眼之数；现 drawDead 补「💪 败而不馁
// N/10」（分子读 hero.deaths 防御式 (hero.deaths||0)、分母读 data.js DEATH_GOAL 单一数据源，与
// ACH_LIST deaths 的 ok/prog 同读一份源，调阈值只改 data.js 一处三端自动跟随），13px 绿字居中
// y=452（冒险进度行 432 之下、画布底 480 之内、行间 20 ≥16 不触）；纯显示零结算零存档零数值变化
// （DEATH_GOAL/loseBattle 结算/战绩行/余粮行/建议行/收集行/按键行/未存档行/冒险进度行逐字未动）。
// 本冒烟守护：版本锚点、data.js/menus.js 源级落位（v24.11 注释 / GAME_VERSION v24.11 与旧 v24.10
// 字面量零残留 / v24.10 历史注释保留 / DEATH_GOAL 常量逐字）、运行期常量实值（DEATH_GOAL 10）
// 与 ACH_LIST deaths 同源互证（ok/prog/d 逐值）、计数源 loseBattle 同源互证、
// README/package.json/CHANGELOG 同步（件套口径 235 + v24.11 守护描述 + 入库 235 + tests 树串尾 +
// package 串尾）、哨兵链（v2143 前望 236 且 README 尚无 236 口径）、旧代 v24.10 pin 全库零残留扫描、
// drawDead 既有行零回归（标题/败于/战绩/余粮/建议/收集/按键/未存档/冒险进度逐字未动）。
import { DEATH_GOAL, GAME_VERSION, ACH_LIST } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v24.11 阵亡画面「💪 败而不馁 N/10」进度行 冒烟 —');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const dSrc = read('js/data.js');
const mSrc = read('js/view/menus.js');
const bSrc = read('js/battle.js');
const readme = read('README.md');
const pkg = read('package.json');
const changelog = read('CHANGELOG.md');

// —— 版本锚点（格式合法 + 已越过 v24.10 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v24.10', !!_gv && (_gv[0] > 24 || (_gv[0] === 24 && _gv[1] > 10)), GAME_VERSION);

// —— data.js 源级落位 ——
ok('data.js GAME_VERSION 字面量已为 v24.11（旧 v24.10 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v24.11';") && !dSrc.includes("const GAME_VERSION = 'v24.1" + "0';"));
ok('data.js 含 v24.11 注释（阵亡画面「💪 败而不馁 N/10」进度行说明）',
  dSrc.includes('// v24.11 体验打磨·信息透明·计数现场'));
ok('data.js 仍保留 v24.10 历史注释（酿造界面「🍶 妙手回春 N/5」进度角标说明，累积注释块）',
  dSrc.includes('// v24.10 体验打磨·信息透明·决策现场'));
ok('data.js 常量逐字落位（const DEATH_GOAL = 10;）', dSrc.includes('const DEATH_GOAL = 10;'));

// —— 运行期常量实值（单一数据源）——
ok('DEATH_GOAL === 10（败而不馁阈值，与 C 页/描述/判定同源）', DEATH_GOAL === 10, String(DEATH_GOAL));
const deathsAch = ACH_LIST.find((a) => a && a.id === 'deaths');
ok('ACH_LIST 含 deaths「败而不馁」（与 drawDead 进度行同读一份源）', !!deathsAch && deathsAch.name === '败而不馁', deathsAch && deathsAch.name);
ok('deaths ok 谓词逐值（0/9 false · 10/20 true）',
  !!deathsAch && deathsAch.ok({ deaths: 0 }) === false && deathsAch.ok({ deaths: 9 }) === false &&
  deathsAch.ok({ deaths: 10 }) === true && deathsAch.ok({ deaths: 20 }) === true);
ok('deaths prog 逐值（0→0/10 · 9→9/10 · 10→10/10）',
  !!deathsAch && deathsAch.prog({ deaths: 0 }) === '0/10' && deathsAch.prog({ deaths: 9 }) === '9/10' &&
  deathsAch.prog({ deaths: 10 }) === '10/10');
ok('deaths 描述与 DEATH_GOAL 同源派生（累计阵亡 10 次）',
  !!deathsAch && deathsAch.d === `累计阵亡 ${DEATH_GOAL} 次`, deathsAch && deathsAch.d);

// —— battle.js 计数源端（loseBattle 全游唯一战败结算点）——
ok('battle.js loseBattle 战败结算写入 hero.deaths 防御式计数（(S.G.deaths||0) 旧档零迁移）',
  bSrc.includes('S.G.deaths = (S.G.deaths || 0) + 1;'));

// —— menus.js 源级落位 ——
ok('menus.js import 已含 DEATH_GOAL（data.js 既有导出，零新增模块依赖）',
  mSrc.includes('BREW2_GOAL, DEATH_GOAL } from'));
ok('menus.js drawDead 补「💪 败而不馁 N/10」进度行（模板逐字：分子读 hero.deaths 防御式）',
  mSrc.includes('`💪 败而不馁 ${(hero.deaths || 0)}/${DEATH_GOAL}`'));
ok('menus.js 进度行落位参数（CV.width/2 · 452 · 13px · #8ff0a0 · 居中，冒险进度行之下）',
  mSrc.includes(", CV.width / 2, 452, '13px', '#8ff0a0', 'center'"));
ok('menus.js 含 v24.11 注释（drawDead 行内说明块）', mSrc.includes('v24.11 体验打磨·信息透明·计数现场'));

// —— menus.js 零回归（既有行逐字）——
ok('menus.js 阵亡画面标题零回归（你 倒 下 了 ……）', mSrc.includes("text('你 倒 下 了 ……'"));
ok('menus.js 战绩行零回归（当前 Lv · 金币 · 累计讨伐 · ⏱️ · 困难 · 📍）',
  mSrc.includes('`当前 Lv.${hero.level} · 金币 ${hero.gold} · 累计讨伐 ${kills} 只 · ⏱️${fmtTime(hero.time)}`'));
ok('menus.js 余粮行零回归（身上余粮：药水/灵药/蘑菇）', mSrc.includes('`身上余粮：🍖 生命药水 ${hero.item} 瓶'));
ok('menus.js 建议行零回归（💡 建议：回村 旅馆/喷泉 补给）', mSrc.includes("💡 建议：回村 旅馆/喷泉 补给"));
ok('menus.js 收集行零回归（🏆 成就 N/M · 📕 图鉴 N/M · 📦 宝箱 N/M · 🕯️ 记忆碎片 N/4）',
  mSrc.includes('`🏆 成就 ${(hero.ach||[]).length}/${ACH_LIST.length} · 📕 图鉴 ${codexN}/${BESTIARY_TARGET.length} · 📦 宝箱 ${chestN}/${chestTotal()} · 🕯️ 记忆碎片 ${fragN}/${FRAGMENTS.length}`'));
ok('menus.js 按键行零回归（按 R 重新开始本次冒险 / 按 T 返回标题画面 / 按 B 重整旗鼓）',
  mSrc.includes("text('按 R 重新开始本次冒险'") && mSrc.includes("text('按 T 返回标题画面'") && mSrc.includes("按 B 重整旗鼓，再战强敌！"));
ok('menus.js 未存档行零回归（pauseSaveHint 12px 橙行 y=412）',
  mSrc.includes('if (deadHint) text(deadHint, 320, 412, \'12px\', \'#ff9d5b\', \'center\');'));
ok('menus.js 冒险进度行零回归（y=432 12px 灰行）',
  mSrc.includes("text('冒险进度：' + progD.map(([nm, dn]) => (dn ? '✓ ' : '✗ ') + nm).join(' · '), CV.width / 2, 432, '12px', '#7d93a3', 'center')"));

// —— README 同步 ——
ok('README 含 v24.11 守护描述（阵亡画面「💪 败而不馁 N/10」进度行守护）',
  readme.includes('v24.11 起含 阵亡画面「💪 败而不馁 N/10」进度行守护'));
ok('README tests 树串尾已延伸至 smoke_v2411_deathprog（... + smoke_v2410_brewgoal + smoke_v2411_deathprog（npm test 串跑））',
  readme.includes('+ smoke_v2409_sellgoal + smoke_v2410_brewgoal + smoke_v2411_deathprog（npm test 串跑）'));
ok('README 件套口径为二百三十五件套（二百三十四件套清除）且旧 234 口径零残留',
  readme.includes('冒烟二百三十五件套（二百三十四件套清除）') && !readme.includes('冒烟二百三十四件套（二百三十三件套清除）'));
ok('README 含 smoke_v2411_deathprog 入库（235 份）', readme.includes('smoke_v2411_deathprog 入库（235 份）'));
ok('README 仍保留 v24.10 历史守护描述（酿造界面 + smoke_v2410_brewgoal 口径）',
  readme.includes('v24.10 起含 酿造界面「🍶 妙手回春 N/5」进度角标守护'));
ok('README 阵亡行含 v24.11 说明（阵亡画面常显「💪 败而不馁 N/10」进度行）',
  readme.includes('v24.11 起阵亡画面常显「💪 败而不馁 N/10」进度行'));
ok('README 成就 bullet 含 v24.11 说明（败而不馁 X/10 次 后附进度行口径）',
  readme.includes('败而不馁 X/10 次（累计阵亡，v23.87；**v24.11 起阵亡画面常显「💪 败而不馁 N/10」进度行**'));

// —— package.json 同步 ——
const testChain = (JSON.parse(pkg).scripts.test.match(/smoke_v\d+_\w+\.mjs|smoke\.mjs/g) || []).length;
ok('package.json test 串共 235 件套', testChain === 235, String(testChain));
ok('package.json 已收录 smoke_v2411_deathprog（npm test 串跑第 235 份）',
  JSON.parse(pkg).scripts.test.includes('smoke_v2411_deathprog.mjs'));
ok('package.json 串尾为 ... smoke_v2410_brewgoal.mjs && node tests/smoke_v2411_deathprog.mjs"',
  pkg.includes('node tests/smoke_v2410_brewgoal.mjs && node tests/smoke_v2411_deathprog.mjs"'));

// —— CHANGELOG 同步 ——
ok('CHANGELOG 顶部已追加 v24.11 条目（阵亡画面败而不馁进度行）', changelog.startsWith('## v24.11 '));
ok('CHANGELOG 顶部条目含败而不馁与 DEATH_GOAL/阵亡画面口径说明',
  changelog.includes('败而不馁') && changelog.includes('DEATH_GOAL') && changelog.includes('阵亡画面'));
ok('CHANGELOG 仍保留 v24.10 与 v24.09 条目标题（历史口径）',
  changelog.includes('## v24.10 体验打磨·信息透明·决策现场') && changelog.includes('## v24.09 体验打磨·信息透明·决策现场'));

// —— 哨兵链：v2143 前哨前望 236 且 README 尚无 236 口径 ——
const s2143 = read('tests/smoke_v2143_talkekey.mjs');
ok('smoke_v2143 哨兵链已推进至二百三十六件套（二百三十五件套清除）',
  s2143.includes('二百三十六件套（二百三十五件套清除）') && s2143.includes("!readme.includes('二百三十六件套（二百三十五件套清除）')"));
ok('README 尚无二百三十六件套（二百三十五件套清除）前望口径', !readme.includes('二百三十六件套（二百三十五件套清除）'));

// —— 旧代 v24.10 pin 全库零残留（不含本件；拆串防误伤，承 v2405-v2410 惯例）——
const allTests = fs.readdirSync(new URL('../tests', import.meta.url).pathname).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2411_deathprog.mjs');
const stale = [];
for (const f of allTests) {
  const src = read('tests/' + f);
  if (src.includes("const GAME_VERSION = 'v24.1" + "0';") ||
      src.includes("GAME_VERSION === 'v24.1" + "0'") ||
      src.includes("startsWith('## v24.1" + "0 ") ||
      src.includes("startsWith('## v24.1" + "0'") ||
      src.includes('已为 v24.1' + '0（') ||
      src.includes('已追加 v24.1' + '0 条目') ||
      src.includes('冒烟二百三十四件套（二百三十三件套清' + '除）') ||
      src.includes('二百三十四件套（二百三十三件套清' + '除）') ||
      src.includes('testChain === ' + '234') ||
      src.includes('+ smoke_v2410_brewgoal（npm test 串' + '跑）') ||
      src.includes('node tests/smoke_v2410_brewgoal.mjs' + '"')) stale.push(f);
}
ok('旧代 v24.10 字面量/恒等/顶 pin/件套 234 口径/testChain 234/串尾 & 树串尾 全库零残留（' + allTests.length + ' 件扫描）',
  stale.length === 0, stale.join(','));

console.log(`\n=== ${n} 项断言，${failed === 0 ? '全部通过' : '存在 ' + failed + ' 项失败'} ===`);
process.exit(failed === 0 ? 0 : 1);
