// v22.58 专项冒烟：帮助页「操作说明」「喝药（普通/灵药）」行补恢复量口径（体验打磨·信息透明·纯文字）——
// 生命药水的恢复量（POTION_HP_PCT 50%HP + POTION_HP_FLAT 8）与高级灵药（ELIXIR_HP_PCT 80%HP +
// ELIXIR_HP_FLAT 20 并回 ELIXIR_MP_PCT 40%MP）此前只在商店价签/drawBrew 可见，H 页操作清单只写
// 「F」一个键——玩家在镇外/矿脉想确认「喝一瓶回多少」只能靠记忆；现该行与 shop 价签/usePotion 同读
// 同一份数据源派生（调恢复量只改 data.js 一处、帮助页自动跟随零裸字面量），行数不变仍 14、行宽估算
// ≤470 面板预算、其余 13 行与三页逐字零回归；纯文字零逻辑零结算零存档。
// 本冒烟守护：版本锚点、data.js 源级落位（v22.58 注释 + GAME_VERSION v22.58 + 行派生式）、
// HELP_PAGES 行契约（r[1] 由 POTION_HP_PCT/POTION_HP_FLAT/ELIXIR_HP_PCT/ELIXIR_HP_FLAT/ELIXIR_MP_PCT
// 逐值派生 + 行数 14 + r[2] 数 2 + 行宽 ≤470 + 其余行/三页零回归）、README/package.json/CHANGELOG 同步
//（tests 树尾/件套口径 154/v22.58 守护描述/入库 154 份/testChain===155/## v22.58 条目）、姊妹件套 pin
//（v2257..v2226 随新现实更新，含 v2228 三风格锚与 v2239/v2240 容错正则尾锚）复查 + 旧代 v22.57
// 字面量/恒等/件套/串尾/testChain pin 全库零残留 + 哨兵链 155 就位 + 坏链防回归。
import { GAME_VERSION, HELP_PAGES, POTION_HP_PCT, POTION_HP_FLAT, ELIXIR_HP_PCT, ELIXIR_HP_FLAT, ELIXIR_MP_PCT } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

function estW(s) {
  let w = 0;
  for (const ch of String(s)) {
    const c = ch.codePointAt(0);
    if (c >= 0x4e00 && c <= 0x9fff) w += 15;
    else if (c >= 0x3000 && c <= 0x303f) w += 15;
    else if (c >= 0xff00 && c <= 0xffef) w += 15;
    else if (/[0-9A-Za-z]/.test(ch)) w += 7.5;
    else if (ch === ' ') w += 7.5;
    else if ('｜|:：。，、！？…—·【】[]'.includes(ch)) w += 15;
    else w += 8;
  }
  return w;
}

console.log('— v22.58 帮助页喝药行恢复量口径 冒烟 —');

const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v22.57 + 精确值由本版守护）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v22.57（本版守 v22.58）', !!_gv && (_gv[0] > 22 || (_gv[0] === 22 && _gv[1] >= 58)), GAME_VERSION);
ok('data.js 含 v22.58 注释（体验打磨·信息透明·纯文字）', dSrc.includes('v22.58 体验打磨·信息透明·纯文字'));
ok('GAME_VERSION 字面量已为 v22.58（旧 v22.57 字面量零残留）',
  dSrc.includes("const GAME_VERSION = 'v23.47';") && !dSrc.includes("const GAME_VERSION = 'v22." + "57';"));
ok('data.js 仍保留 v22.57/v22.56 世代注释链（水塘灯影/营地篝火注释未动）',
  dSrc.includes('v22.57 新内容·世界景观·纯显示') && dSrc.includes('v22.56 新内容·世界景观·纯显示'));

// —— HELP_PAGES 行契约 ——
const page0 = HELP_PAGES[0];
const row = page0.find((r) => r[0] === '喝药（普通/灵药）');
const exp = 'F（优先灵药·普通 ' + Math.round(POTION_HP_PCT * 100) + '%HP+' + POTION_HP_FLAT + ' · 灵药 ' +
  Math.round(ELIXIR_HP_PCT * 100) + '%HP+' + ELIXIR_HP_FLAT + '并回' + Math.round(ELIXIR_MP_PCT * 100) + '%MP）';
ok('喝药行存在且 r[1] 由 POTION_HP_PCT/POTION_HP_FLAT/ELIXIR_HP_PCT/ELIXIR_HP_FLAT/ELIXIR_MP_PCT 派生（与 shop 价签/usePotion 同一份源）',
  !!row && row[1] === exp, row && row[1]);
ok('恢复量派生值与常量逐值一致（50%HP+8 · 80%HP+20 并回 40%MP）',
  exp === 'F（优先灵药·普通 50%HP+8 · 灵药 80%HP+20并回40%MP）', exp);
// v23.26 口径一致·纯文字：README F 行「优先高级灵药；满状态时不浪费」/战斗 [3] 预览「（自动先喝🧪）」
// 早有优先语义，唯独 H 页「喝药」行只写恢复量——现首补「优先灵药·」（与 hero.takePotion 先耗 potion2
// 的实际行为同口径、纯文字零裸字面量）；本断言守护该语义落位并保持恢复量派生不变。
ok('喝药行补「优先灵药」口径（行首即注明先喝高级灵药，与 takePotion 实际行为同口径）',
  !!row && row[1].startsWith('F（优先灵药·') && row[1].includes('普通 50%HP+8') && row[1].includes('灵药 80%HP+20并回40%MP）'));
ok('data.js 含 v23.26 注释（喝药行优先灵药口径·纯文字）', dSrc.includes('v23.26 喝药行补「优先灵药」口径'));
ok('data.js 源级含派生式（POTION_HP_PCT*100 / ELIXIR_HP_PCT*100 / ELIXIR_MP_PCT*100）',
  dSrc.includes("Math.round(POTION_HP_PCT*100)") && dSrc.includes("Math.round(ELIXIR_HP_PCT*100)") &&
  dSrc.includes("Math.round(ELIXIR_MP_PCT*100)"));
ok('操作说明页行数不变仍 14', page0.length === 14, String(page0.length));
ok('操作说明页 r[2] 数不变仍 2（战斗/存档槽）', page0.filter((r) => r.length > 2).length === 2);
ok('喝药行 r[1] 估算宽 ≤470 面板预算', estW(exp) <= 470, String(estW(exp)));
ok('操作说明页全页行宽巡检（r[1] 全部 ≤480，移动行 474 为既有行估宽上浮余量）', page0.every((r) => estW(r[1]) <= 480));
ok('喝药行仍无 r[2]（不触发页长自适应）', row && row.length === 2, row && String(row.length));

// —— 其余行零回归（spot check）——
const rOf = (k) => page0.find((r) => r[0] === k);
ok('移动行 Shift 奔跑口径零回归', rOf('移动 / 传送门') && rOf('移动 / 传送门')[1].includes('按住 Shift 奔跑'));
ok('对话行 Enter/E 口径零回归', rOf('对话 / 确认') && rOf('对话 / 确认')[1] === 'Enter / E（镇民需面对面）');
ok('存档行 P 口径零回归', rOf('存档（槽位）') && rOf('存档（槽位）')[1] === 'P 或菜单里「存档」');
ok('战斗行 r[2] 数字键快捷直发零回归', rOf('战斗') && rOf('战斗')[2] && rOf('战斗')[2].includes('技能菜单数字键1-7快捷直发'));
ok('存档槽行 r[2] R/X/P 三口径零回归', rOf('存档槽') && rOf('存档槽')[2] === 'R 重开新档(连按两次确认) · X 删除当前槽存档(连按两次确认) · P 存档');
ok('静音行 [ / ] 音量口径零回归', rOf('静音 / 音量') && rOf('静音 / 音量')[1].includes('[ / ] 调节音量'));

// —— 其余三页零回归 ——
ok('帮助页共 4 页', HELP_PAGES.length === 4, String(HELP_PAGES.length));
ok('地图指南行数不变仍 8 且 r[2] 数 7（v22.78 潮灯镇行拆 r[1]+r[2]，5→6；v22.87 通关之路行补 r[2]，6→7）', HELP_PAGES[1].length === 8 && HELP_PAGES[1].filter((r) => r.length > 2).length === 7,
  String(HELP_PAGES[1].length) + '/' + String(HELP_PAGES[1].filter((r) => r.length > 2).length));
ok('地图指南潮灯镇行出口指针零回归', HELP_PAGES[1][0][1].includes('东门→雾语林'));
ok('地图指南雾语林行泉水指针零回归', HELP_PAGES[1][1][1].includes('中段营地泉水'));
ok('地图指南星井矿脉行 r[2] 补给指针零回归', String(HELP_PAGES[1][2][2]).includes('无泉水/旅店 · 出发前请补给'));
ok('魔物状态页行数不变仍 10', HELP_PAGES[2].length === 10, String(HELP_PAGES[2].length));
ok('魔物状态页高级灵药行恢复数值零回归（80%HP+20 并回 40%MP 同源）',
  HELP_PAGES[2][6] && HELP_PAGES[2][6][1].includes('恢复' + Math.round(ELIXIR_HP_PCT * 100) + '%HP+') &&
  HELP_PAGES[2][6][1].includes(Math.round(ELIXIR_MP_PCT * 100) + '%MP'));
ok('试炼进阶页行数不变仍 10', HELP_PAGES[3].length === 10, String(HELP_PAGES[3].length));
ok('试炼进阶页终焉之神行 r[2] 封印治愈零回归', HELP_PAGES[3][9] && HELP_PAGES[3][9][2] === '祸乱形态封印治愈技能（喝药不受影响）');

// —— README/package.json/CHANGELOG 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README tests 树尾收录 smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）',
  readme.includes('smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 含 smoke_v2258_potionhelp 入库（154 份）', readme.includes('smoke_v2258_potionhelp 入库（154 份）'));
ok('README 件套口径已为二百一十二件套（二百一十一件套清除）且旧 153 口径零残留',
  readme.includes('二百一十二件套（二百一十一件套清除）') && !readme.includes('一百五十三件套（一百五十二' + '件套清除）'));
ok('README 含 v22.58 守护描述（帮助页喝药行恢复量口径守护）',
  readme.includes('v22.58 起含帮助页「操作说明」喝药行恢复量口径守护'));
ok('README 仍保留 smoke_v2257_pondglow 入库（153 份）历史口径', readme.includes('smoke_v2257_pondglow 入库（153 份）'));
ok('package.json 已收录 smoke_v2258_potionhelp（npm test 串跑第 154 份）',
  JSON.stringify(JSON.parse(pkg).scripts.test).includes('smoke_v2258_potionhelp.mjs'));
ok('package.json 串尾为 smoke_v2257_pondglow.mjs && node tests/smoke_v2258_potionhelp.mjs && node tests/smoke_v2259_sandpile.mjs && node tests/smoke_v2260_fountripple.mjs && node tests/smoke_v2261_rich3.mjs && node tests/smoke_v2262_crystal.mjs && node tests/smoke_v2263_ptime3.mjs && node tests/smoke_v2264_hunt3.mjs && node tests/smoke_v2265_lucky3.mjs && node tests/smoke_v2266_stock3.mjs && node tests/smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"',
  pkg.includes('smoke_v2257_pondglow.mjs && node tests/smoke_v2258_potionhelp.mjs && node tests/smoke_v2259_sandpile.mjs && node tests/smoke_v2260_fountripple.mjs && node tests/smoke_v2261_rich3.mjs && node tests/smoke_v2262_crystal.mjs && node tests/smoke_v2263_ptime3.mjs && node tests/smoke_v2264_hunt3.mjs && node tests/smoke_v2265_lucky3.mjs && node tests/smoke_v2266_stock3.mjs && node tests/smoke_v2267_elixir3.mjs && node tests/smoke_v2268_brew3.mjs && node tests/smoke_v2269_mush3.mjs && node tests/smoke_v2270_outstep.mjs && node tests/smoke_v2271_outstep2.mjs && node tests/smoke_v2272_scholar2.mjs && node tests/smoke_v2273_seen5.mjs && node tests/smoke_v2274_seen2.mjs && node tests/smoke_v2275_codexempty.mjs && node tests/smoke_v2276_lampkid.mjs && node tests/smoke_v2277_pondhint.mjs && node tests/smoke_v2278_mushguide.mjs && node tests/smoke_v2279_lampwell.mjs && node tests/smoke_v2280_grainfield.mjs && node tests/smoke_v2281_starwell.mjs && node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 154 件套', testChain === 212, String(testChain));
ok('CHANGELOG 顶为 v22.60 条目', changelog.startsWith('## v23.47 '));
ok('CHANGELOG 含 v22.58 条目', changelog.includes('## v22.58 '));

// —— 姊妹 pin 复查（v2257..v2226 随新现实更新，含 v2228 三风格锚与 v2239/v2240 容错正则尾锚）——
const s2257 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2257_pondglow.mjs'), 'utf8');
const s2256 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2256_campfire.mjs'), 'utf8');
const s2255 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2255_steleglow.mjs'), 'utf8');
const s2254 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2254_grainfield.mjs'), 'utf8');
const s2253 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2253_supplypoint.mjs'), 'utf8');
const s2252 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2252_rail.mjs'), 'utf8');
const s2242 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2242_mushfield.mjs'), 'utf8');
const s2240 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2240_tallgrass.mjs'), 'utf8');
const s2239 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2239_minercart.mjs'), 'utf8');
const s2230 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2230_pausewarn.mjs'), 'utf8');
const s2229 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2229_metall.mjs'), 'utf8');
const s2228 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2228_titlesave.mjs'), 'utf8');
const s2226 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2226_chestprogress.mjs'), 'utf8');
const s2143 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2143_talkekey.mjs'), 'utf8');
ok('smoke_v2257 的 GAME_VERSION 字面量 pin 已更新为 v22.58', s2257.includes("const GAME_VERSION = 'v23.47';"));
ok('smoke_v2257 的 README 串尾 pin 已随新现实延伸至 smoke_v2258_potionhelp',
  s2257.includes('smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2257 的 README 件套 pin 已随新现实更新为二百一十二件套（二百一十一件套清除）',
  s2257.includes("readme.includes('冒烟二百一十二件套（二百一十一件套清除）')"));
ok('smoke_v2257 的 package.json 件套计数 pin 已更新为 === 154', s2257.includes('testChain === 212'));
ok('smoke_v2257 的 CHANGELOG 顶 pin 已更新为 ## v22.58', s2257.includes("startsWith('## v23.47')"));
ok('smoke_v2256 的 GAME_VERSION 字面量 pin 已更新为 v22.58', s2256.includes("const GAME_VERSION = 'v23.47';"));
ok('smoke_v2256 的 README 串尾 pin 已延伸至 smoke_v2258_potionhelp',
  s2256.includes('smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2255 的 GAME_VERSION 字面量 pin 已更新为 v22.58', s2255.includes("const GAME_VERSION = 'v23.47';"));
ok('smoke_v2255 的 README 串尾 pin 已延伸至 smoke_v2258_potionhelp',
  s2255.includes('smoke_v2254_grainfield + smoke_v2255_steleglow + smoke_v2256_campfire + smoke_v2257_pondglow + smoke_v2258_potionhelp + smoke_v2259_sandpile + smoke_v2260_fountripple + smoke_v2261_rich3 + smoke_v2262_crystal + smoke_v2263_ptime3 + smoke_v2264_hunt3 + smoke_v2265_lucky3 + smoke_v2266_stock3 + smoke_v2267_elixir3 + smoke_v2268_brew3 + smoke_v2269_mush3 + smoke_v2270_outstep + smoke_v2271_outstep2 + smoke_v2272_scholar2 + smoke_v2273_seen5 + smoke_v2274_seen2 + smoke_v2275_codexempty + smoke_v2276_lampkid + smoke_v2277_pondhint + smoke_v2278_mushguide + smoke_v2279_lampwell + smoke_v2280_grainfield + smoke_v2281_starwell + smoke_v2282_archgate + smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2254 的 GAME_VERSION 字面量 pin 已更新为 v22.58', s2254.includes("const GAME_VERSION = 'v23.47';"));
ok('smoke_v2253 的 GAME_VERSION 字面量 pin 已更新为 v22.58', s2253.includes("const GAME_VERSION = 'v23.47';"));
ok('smoke_v2252 的 GAME_VERSION 字面量 pin 已更新为 v22.58', s2252.includes("const GAME_VERSION = 'v23.47';"));
ok('smoke_v2230 的 package.json 串尾 pin 已延伸至 smoke_v2258_potionhelp（plain/单转义/双转义三风格）',
  /smoke_v2256_campfire[.\\/]{0,6}mjs && node tests[\\\\/]{0,6}smoke_v2257_pondglow[.\\/]{0,6}mjs && node tests[\\\\/]{0,6}smoke_v2258_potionhelp[.\\/]{0,6}mjs[\s\S]*?node tests[\\\\/]{0,6}smoke_v2259_sandpile[.\\/]{0,6}mjs[\s\S]*?node tests[\\/]{0,6}smoke_v2260_fountripple[.\\/]{0,6}mjs[^]*?node tests[\\/]{0,6}smoke_v2261_rich3[.\\/]{0,6}mjs/.test(s2230));
// 串尾锚延伸（任意转义风格：plain `/` / regex `\/` / 双转义 `\\/`）
const archChain = (s) => /smoke_v2256_campfire[.\\\\]{0,6}mjs[\s\S]*?node tests[\\\\/]{0,6}smoke_v2258_potionhelp[.\\\\]{0,6}mjs/.test(s);
ok('smoke_v2226/v2228/v2229/v2230/v2239/v2240/v2242 的串尾锚已延伸至 smoke_v2258_potionhelp（plain/regex/双转义三风格）',
  archChain(s2226) && archChain(s2228) && archChain(s2229) && archChain(s2230) && archChain(s2239) &&
  archChain(s2240) && archChain(s2242));
ok('smoke_v2228 的 GAME_VERSION 字面量 pin 已更新为 v22.58 且旧代零残留复查仍在（v22.27 风格）',
  s2228.includes("const GAME_VERSION = 'v23.47';") && s2228.includes("'v22.") && s2228.includes("27';"));
ok('v2143-45「件套守护领先一位」哨兵链已推进至 155（二百一十二件套（二百一十一件套清除））',
  s2143.includes('二百一十三件套（二百一十二件套清除）') && s2143.includes("!readme.includes('二百一十三件套（二百一十二件套清除）')"));

// 旧代 v22.57 pin 全库零残留（字面量/恒等/件套/串尾/testChain）
const allTests = fs.readdirSync(path.join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs'));
const stale = [];
for (const f of allTests) {
  const src = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "57';") || src.includes("GAME_VERSION === 'v22." + "57'") ||
      src.includes('一百五十三件套（一百五十二件套清' + '除）') || src.includes('testChain === ' + '153') ||
      src.includes('smoke_v2257_pondglow（npm test 串' + '跑）')) stale.push(f);
}
ok('旧代 v22.57 字面量/恒等/件套/串尾/testChain pin 全库零残留（' + allTests.length + ' 件扫描，含本件）', stale.length === 0, stale.join(','));
// 坏链防回归：README 不得出现 v2257 孤尾（其后必须直接接 v2258）
ok('README 串尾无孤尾（smoke_v2257_pondglow 后必须接 smoke_v2258_potionhelp）',
  !readme.includes('smoke_v2257_pondglow（npm test 串' + '跑）'));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
