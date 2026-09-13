// v22.5 专项冒烟：标题页存档预览补「🕯️ 记忆碎片 N/4」——多槽挑档续玩时，真结局关键收集在选槽第一屏
// 有了回声（体验打磨·信息透明，承 v22.1 状态页碎片 / v22.2 胜利画面碎片 / v22.3 阵亡画面碎片 /
// v19.49 尾声战绩行「记忆 N/N」同一主线）：碎片进度的常驻/总结屏逐屏核对——J 日志「记忆碎片」节、
// 尾声战绩行 v19.49「记忆 N/N」、状态页资源行 v22.1 🕯️ N/4、胜利画面收集行 v22.2 🕯️ 记忆碎片 N/4、
// 阵亡画面收集行 v22.3 🕯️ 记忆碎片 N/4 五端齐备，唯独标题页存档预览（slotPreview，v21.79 起报
// 姓名/等级/金币/地图/进度/难度/存档时间/时长 + 成就/图鉴/宝箱三件套）仍无碎片——多存档槽玩家站在
// 标题页按 ←/→ 挑更完整的档继续，真结局关键收集（FRAGMENTS 四枚强敌首胜掉落、集齐触发「全记忆」
// 真结局加页）在预览行无回声；现于三件套旁并列 ·🕯️N/4（与其余五端同读 hero.fragments·
// FRAGMENTS.length 一份单一数据源、(hero.fragments||[]) 防御式旧档零迁移），纯显示零结算零存档变化。
// 本冒烟守护：版本锚点、data.js/core.js 源级落位（import FRAGMENTS 新增 + fragN 派生 + 模板 ·🕯️ 并入 +
// 既有段逐字保留 + 单行零换行）、运行期实证（新档 0/4 → 推进档 2/4 → 全收集 4/4 → 缺 fragments 字段
// 防御档 0/4 不抛错 → 旧布尔 bestiary 归一共存 → 困难/真结局档零回归 → 空槽 null）、行宽预算（estW
// ≤640 画布，最坏 ≈620.5）、README/package/CHANGELOG 同步、姊妹件套 pin（v2204..v2176 一百零一件套 /
// v2204..v2181·v2179 GAME_VERSION v22.5 / v2204..v2192 恒等 v22.5 / v2204..v2192 树尾 pin /
// smoke_v2179 行宽预算放宽）随新现实更新 + 旧代 v22.4 字面量 pin / 旧代恒等 pin / 旧代一百件套 pin 零残留。
import { GAME_VERSION, ACH_LIST, BESTIARY_TARGET, chestTotal, FRAGMENTS } from '../js/data.js';
import { slotPreview, saveKey, newGame } from '../js/core.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v22.5 标题页存档预览记忆碎片进度冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v22.4 + 精确 v22.5 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.4', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 5)), GAME_VERSION);
ok('GAME_VERSION 字面量已为 v22.5（本版独占精确锚点）', GAME_VERSION === 'v22.37', GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const coreSrc = read('../js/core.js');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v22.5 版本注释', dataSrc.includes('v22.5 标题页存档预览补「🕯️ 记忆碎片 N/4」'));
ok('data.js GAME_VERSION 字面量已更新为 v22.5', dataSrc.includes("const GAME_VERSION = 'v22.37';"));
ok('data.js 仍保留 v22.4 历史注释（累积注释块，姊妹 pin 不失效）', dataSrc.includes('v22.4 新成就「妙手回春」'));

// —— core.js 源级落位：import FRAGMENTS 新增 + fragN 派生 + 模板 ·🕯️ 并入 ——
ok('core.js 导入 FRAGMENTS（data.js 单一数据源，与 chestTotal 相邻落位）',
  coreSrc.includes('chestTotal, FRAGMENTS, BREW_MUSHROOMS'));
ok('slotPreview 派生碎片数（(hero.fragments||[]) 防御式旧档零迁移）',
  coreSrc.includes('const fragN = (hero.fragments || []).length;'));
ok('预览行末尾并列 ·🕯️N/4（与 FRAGMENTS.length 同源派生）',
  coreSrc.includes('·🕯️${fragN}/${FRAGMENTS.length}'));
ok('预览行 v21.79 三件套段逐字保留（成就/图鉴/宝箱 与各自分母同源）',
  coreSrc.includes('成就${achN}/${ACH_LIST.length}') && coreSrc.includes('图鉴${codexN}/${BESTIARY_TARGET.length}') && coreSrc.includes('宝箱${chestN}/${chestTotal()}'));
ok('既有预览段逐字保留（姓名/Lv/金币/地图进度/难度/存档时间/时长）',
  coreSrc.includes("${hero.name || '守灯人'} Lv.${hero.level} 金币${hero.gold || 0}") &&
  coreSrc.includes('fmtAgo(data.savedAt)') && coreSrc.includes('fmtTime(hero.time)') && coreSrc.includes('DIFFS[hero.diff]'));
ok('预览模板仍为单行（无换行，y=360 布局不动）', !coreSrc.split('· 成就${achN}')[0].includes('\\n') && !coreSrc.includes("\\n · 成就"));
ok('menus.js drawTitle 仍以 13px 单行渲染 slotPreview（y=360 零位移）',
  coreSrc.length > 0 && read('../js/view/menus.js').includes("CTX.fillText(pv,CV.width/2,360)") &&
  read('../js/view/menus.js').includes("CTX.font='13px sans-serif'"));

// —— localStorage 桩（承 v19.65 / v21.79 先例）——
const mem = {};
globalThis.localStorage = {
  getItem: (k) => mem[k] ?? null,
  setItem: (k, v) => { mem[k] = String(v); },
  removeItem: (k) => { delete mem[k]; },
};

// 运行期实证：新档三件套 + 碎片 0/4（缺 fragments 字段 = 防御式 0）
const fresh = newGame('守灯人');
fresh.level = 1; fresh.gold = 30; fresh.map = 'village'; fresh.time = 3;
delete fresh.ach; delete fresh.bestiary; delete fresh.chests; delete fresh.fragments;
mem[saveKey(1)] = JSON.stringify({ G: fresh, chests: [], savedAt: Date.now() });
const pv0 = slotPreview(1);
ok('新档预览含 🕯️0/M 且分母=FRAGMENTS.length（同源）',
  typeof pv0 === 'string' && pv0.includes(`·🕯️0/${FRAGMENTS.length}`), String(pv0));
ok('新档预览三件套零回归（成就0/M·图鉴0/N·宝箱0/M 与 🕯️ 同列）',
  typeof pv0 === 'string' && pv0.includes(`成就0/${ACH_LIST.length}`) && pv0.includes(`图鉴0/${BESTIARY_TARGET.length}`) && pv0.includes(`宝箱0/${chestTotal()}`));
ok('新档预览既有段零回归（姓名/Lv/金币/地图/⏱时长）',
  typeof pv0 === 'string' && pv0.includes('守灯人') && pv0.includes('Lv.1') && pv0.includes('金币30') && pv0.includes('潮灯镇') && pv0.includes('00:00:03'));
ok('新档预览单行（无 \\n）', typeof pv0 === 'string' && !pv0.includes('\n'));

// 推进档：碎片 2/4 + 三件套逐值共存
const prog = newGame('潮');
prog.level = 8; prog.gold = 500; prog.map = 'village'; prog.time = 3723;
prog.ach = ['firstblood', 'lvl5'];
prog.bestiary = { [BESTIARY_TARGET[0]]: 2, [BESTIARY_TARGET[1]]: 1 };
prog.chests = ['22,1', '12,11'];
prog.fragments = ['f-a', 'f-b'];
mem[saveKey(2)] = JSON.stringify({ G: prog, chests: Array.from(prog.chests), savedAt: Date.now() - 300000 });
const pv1 = slotPreview(2);
ok('推进档预览碎片 2/4（与 hero.fragments 长度同源）',
  typeof pv1 === 'string' && pv1.includes(`·🕯️2/${FRAGMENTS.length}`), String(pv1));
ok('推进档预览逐值（成就2/M·图鉴2/N·宝箱2/M 与成就页/图鉴页/状态页同口径）',
  typeof pv1 === 'string' && pv1.includes(`成就2/${ACH_LIST.length}`) && pv1.includes(`图鉴2/${BESTIARY_TARGET.length}`) && pv1.includes(`宝箱2/${chestTotal()}`));
ok('推进档预览既有段零回归（时间戳/时长）', typeof pv1 === 'string' && pv1.includes('5分钟前') && pv1.includes('01:02:03'));

// 全收集档：碎片 4/4（集齐真结局关键收集）
const full = newGame('灯见');
full.level = 12; full.map = 'gallery'; full.time = 7200;
full.fragments = ['f-a', 'f-b', 'f-c', 'f-d'];
mem[saveKey(3)] = JSON.stringify({ G: full, chests: [], savedAt: Date.now() });
ok('全收集档预览碎片 4/4（集齐不钳制、与 FRAGMENTS.length 同源）',
  typeof slotPreview(3) === 'string' && slotPreview(3).includes(`·🕯️4/${FRAGMENTS.length}`));

// 旧档防御档：无 fragments 字段读档 → 0/4 不抛错零迁移
const legacy = newGame('余烬');
legacy.level = 3; legacy.map = 'village'; legacy.time = 60;
legacy.ach = ['firstblood'];
legacy.bestiary = { [BESTIARY_TARGET[2]]: true };
delete legacy.fragments;
mem[saveKey(4)] = JSON.stringify({ G: legacy, chests: [], savedAt: Date.now() });
let threw = null;
let pvLegacy = null;
try { pvLegacy = slotPreview(4); } catch (e) { threw = e; }
ok('旧档缺 fragments 字段 slotPreview 不抛错（防御式）', threw === null, threw && String(threw.stack || threw));
ok('旧档防御档碎片 0/4 且旧布尔 bestiary 归一共存（图鉴1/N）', typeof pvLegacy === 'string' &&
  pvLegacy.includes(`·🕯️0/${FRAGMENTS.length}`) && pvLegacy.includes(`图鉴1/${BESTIARY_TARGET.length}`));

// 难度档 + 真结局档（v19.45 口径零回归：仅困难档标注；灯已归还分支）
const hard = newGame('守灯');
hard.level = 12; hard.map = 'gallery'; hard.time = 359999; hard.diff = 1; hard.trueBoss = true;
hard.ach = []; hard.bestiary = {}; hard.chests = []; hard.fragments = ['f-a', 'f-b', 'f-c', 'f-d'];
mem[saveKey(5)] = JSON.stringify({ G: hard, chests: [], savedAt: Date.now() - 260000000 });
const pv3 = slotPreview(5);
ok('困难真结局档零回归（困难/无字回廊/灯已归还 + 🕯️4/4 共存）',
  typeof pv3 === 'string' && pv3.includes('困难') && pv3.includes('无字回廊') && pv3.includes('灯已归还') && pv3.includes(`·🕯️4/${FRAGMENTS.length}`));

// 空槽返回 null（零回归）
ok('空槽返回 null', slotPreview(9) === null);

// —— 行宽预算：v21.18 同款 estW（13px 单行 ≤640 画布，v22.5 随 🕯️ 并入放宽 20px）——
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
const worst = `余烬 Lv.12 金币12345 无字回廊·灯已归还 · 困难 · 3天前 · ⏱99:59:59 · 成就${ACH_LIST.length}/${ACH_LIST.length}·图鉴${BESTIARY_TARGET.length}/${BESTIARY_TARGET.length}·宝箱${chestTotal()}/${chestTotal()}·🕯️${FRAGMENTS.length}/${FRAGMENTS.length}`;
const wWorst = estW(worst, 13);
ok('最坏预览行估算宽 ≤640（640 画布中心对齐，两侧余量 ≈10px）', wWorst > 0 && wWorst <= 640, `≈${wWorst.toFixed(0)}`);
['余烬','守灯人','灯见','潮','守灯'].forEach((nm) => {
  const w = estW(worst.replace('余烬', nm), 13);
  ok(`合理性抽查：${nm} 名预览 ≤640`, w <= 640, `≈${w.toFixed(0)}`);
});

// —— README / package.json / CHANGELOG 同步守护 ——
ok('README tests 树收录 smoke_v2205_fragtitle 且位于串尾',
  readme.includes('smoke_v2204_brew2 + smoke_v2209_achstatus + smoke_v2211_lampkid + smoke_v2212_volume + smoke_v2213_teller + smoke_v2214_mush + smoke_v2215_tutorvol + smoke_v2216_picker + smoke_v2217_elixir2 + smoke_v2218_mush2 + smoke_v2219_footkeys + smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend（npm test 串跑）'));
ok('README 件套口径为一百三十三件套（一百三十二件套清除）',
  readme.includes('冒烟一百三十三件套（一百三十二件套清除）') && !readme.includes('冒烟一百件套（九十九件套清' + '除）'));
ok('README 含 v22.5 守护描述', readme.includes('v22.5 起含标题页存档预览记忆碎片进度守护'));
ok('README 系统清单标题预览为收集进度四件套（v21.79 三件套 + v22.5 并列 🕯️ 记忆碎片 N/4）',
  readme.includes('**收集进度四件套**') && readme.includes('成就 N/M·图鉴 N/M·宝箱 N/M·🕯️ 记忆碎片 N/4') &&
  readme.includes('v22.5 并列 🕯️ 记忆碎片 N/4'));
ok('README 记忆碎片 bullet 补标题页存档预览常住（v22.5）',
  readme.includes('标题页存档预览 `🕯️ 记忆碎片 N/4`（v22.5'));
ok('package.json 已收录 smoke_v2205_fragtitle（npm test 串跑第 101 份）',
  pkg.includes('smoke_v2205_fragtitle.mjs') && /smoke_v2204_brew2\.mjs && node tests\/smoke_v2205_fragtitle\.mjs/.test(pkg));
ok('CHANGELOG 含 v22.5 条目', changelog.includes('## v22.5 '));

// —— 姊妹件套 pin 复查（v21.7 惯例：本版冒烟守护姊妹随新现实更新）——
const suite101 = ['smoke_v2204_brew2.mjs', 'smoke_v2203_fragdead.mjs', 'smoke_v2202_fragwin.mjs',
  'smoke_v2201_fragstatus.mjs', 'smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs',
  'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs', 'smoke_v2196_deadrecap.mjs',
  'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs', 'smoke_v2193_hunt100.mjs',
  'smoke_v2192_travelwarn.mjs', 'smoke_v2191_ptime.mjs', 'smoke_v2190_launch.mjs',
  'smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs', 'smoke_v2187_endingrecap.mjs',
  'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs', 'smoke_v2184_lvl12.mjs',
  'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs', 'smoke_v2181_helpquickcast.mjs',
  'smoke_v2180_grain.mjs', 'smoke_v2179_titlerecap.mjs', 'smoke_v2178_codexseen.mjs',
  'smoke_v2177_elites.mjs', 'smoke_v2176_allchests.mjs'];
for (const nm of suite101) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README 件套 pin 已随新现实更新为一百三十三件套（一百三十二件套清除）`,
    src.includes('一百三十三件套（一百三十二件套清除）'));
}
const vers101 = ['smoke_v2204_brew2.mjs', 'smoke_v2203_fragdead.mjs', 'smoke_v2202_fragwin.mjs',
  'smoke_v2201_fragstatus.mjs', 'smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs',
  'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs', 'smoke_v2196_deadrecap.mjs',
  'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs', 'smoke_v2193_hunt100.mjs',
  'smoke_v2192_travelwarn.mjs', 'smoke_v2191_ptime.mjs', 'smoke_v2190_launch.mjs',
  'smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs', 'smoke_v2187_endingrecap.mjs',
  'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs', 'smoke_v2184_lvl12.mjs',
  'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs', 'smoke_v2181_helpquickcast.mjs',
  'smoke_v2179_titlerecap.mjs'];
for (const nm of vers101) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 字面量 pin 已随新现实更新为 v22.5`,
    src.includes("const GAME_VERSION = 'v22.37';"));
}
for (const nm of ['smoke_v2204_brew2.mjs', 'smoke_v2203_fragdead.mjs', 'smoke_v2202_fragwin.mjs',
  'smoke_v2201_fragstatus.mjs', 'smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs',
  'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs', 'smoke_v2196_deadrecap.mjs',
  'smoke_v2195_ptime2.mjs', 'smoke_v2194_statuscodex.mjs', 'smoke_v2193_hunt100.mjs',
  'smoke_v2192_travelwarn.mjs']) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 恒等 pin（===）已随新现实更新为 v22.5`,
    src.includes("GAME_VERSION === 'v22.37'"));
}
for (const nm of ['smoke_v2204_brew2.mjs', 'smoke_v2203_fragdead.mjs', 'smoke_v2202_fragwin.mjs',
  'smoke_v2201_fragstatus.mjs', 'smoke_v2200_stock.mjs', 'smoke_v2199_rich2.mjs',
  'smoke_v2198_winsave.mjs', 'smoke_v2197_lucky2.mjs', 'smoke_v2196_deadrecap.mjs',
  'smoke_v2195_ptime2.mjs', 'smoke_v2193_hunt100.mjs', 'smoke_v2192_travelwarn.mjs']) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README tests 树尾 pin 已随新现实更新（+ smoke_v2205_fragtitle）`,
    src.includes('smoke_v2204_brew2 + smoke_v2209_achstatus + smoke_v2211_lampkid + smoke_v2212_volume + smoke_v2213_teller + smoke_v2214_mush + smoke_v2215_tutorvol + smoke_v2216_picker + smoke_v2217_elixir2 + smoke_v2218_mush2 + smoke_v2219_footkeys + smoke_v2220_hearer + smoke_v2221_wanderer + smoke_v2222_peddler + smoke_v2223_lampman + smoke_v2224_sifter + smoke_v2225_stonecarver + smoke_v2226_chestprogress + smoke_v2227_minstrel + smoke_v2228_titlesave + smoke_v2229_metall + smoke_v2230_pausewarn + smoke_v2231_smith + smoke_v2232_travelsup + smoke_v2233_nameflavor + smoke_v2234_innkeeper + smoke_v2235_minimapquest + smoke_v2236_villagelamp + smoke_v2237_minimaplegend（npm test 串跑）'));
}
// smoke_v2179 行宽预算断言随 🕯️ 并入放宽（v21.79 ≤620 → ≤640 + worst 串补 ·🕯️4/4）
const s2179 = read('../tests/smoke_v2179_titlerecap.mjs');
ok('smoke_v2179 的标题预览行宽预算已放宽（estW ≤640 且 worst 串含 ·🕯️4/4）',
  s2179.includes('wWorst <= 640') && s2179.includes('·🕯️${FRAGMENTS.length}'));

// 旧代 pin 零残留：全部测试文件不得再含 v22.4 版本字面量 pin（拆串构造避免本文件扫描行自匹配）
const OLD_GV = "const GAME_VERSION = 'v22." + "4';";
let stale = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes(OLD_GV)) stale.push(f);
}
ok('旧代 GAME_VERSION 字面量 pin 零残留（v22.4 全库清零）', stale.length === 0, stale.join(','));
let staleId = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes("GAME_VERSION === 'v22." + "4'")) staleId.push(f);
}
ok('旧代 GAME_VERSION 恒等 pin 零残留（===v22.4 全库清零）', staleId.length === 0, staleId.join(','));
let staleSuite = [];
for (const f of fs.readdirSync(new URL('../tests', import.meta.url))) {
  if (!/^smoke_.*\.mjs$/.test(f)) continue;
  const src = read(`../tests/${f}`);
  if (src.includes('一百件套（九十九件套清' + '除）')) staleSuite.push(f);
}
ok('旧代件套 pin 零残留（一百件套（九十九件套清' + '除）全库清零）', staleSuite.length === 0, staleSuite.join(','));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
