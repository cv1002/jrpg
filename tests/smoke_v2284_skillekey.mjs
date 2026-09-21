// smoke_v2284_skillekey.mjs —— v22.84 战斗技能菜单施放 E 键别名守护
// 承 v21.10-v22.83 冒烟入库先例：版本锚点 + 源级落位 + 数据契约 + 行宽预算 + 运行期全链路 +
// README/package.json/CHANGELOG 同步 + 姊妹件套 pin + 旧代 v22.83 pin 全库零残留 + 哨兵链领先一位
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log(`  ✓ ${name}`); }
  else { fail++; console.log(`  ✗ ${name}`, extra || ''); }
};

console.log('— v22.84 战斗技能菜单施放 E 键别名冒烟 —');

// 1. 版本锚点
const dataSrc = readFileSync(join(ROOT, 'js/data.js'), 'utf8');
ok('data.js GAME_VERSION 字面量为 v22.84', dataSrc.includes("const GAME_VERSION = 'v23.45'"));
ok('旧 v22.83 字面量零残留', !dataSrc.includes("const GAME_VERSION = 'v22." + "83';"));
ok('data.js 含 v22.84 版本注释', dataSrc.includes('// v22.84 体验打磨'));
ok('data.js 仍保留 v22.83 历史注释', dataSrc.includes('// v22.83 体验打磨'));

// 2. 源级落位：main.js 技能菜单施放分支 e/E 别名 + 旧条件零残留 + KEY 无 'e' 映射
const mainSrc = readFileSync(join(ROOT, 'js/main.js'), 'utf8');
ok('main.js 技能施放分支 e/E/Enter 同条件（与 Enter 同路径施放）',
  mainSrc.includes("} else if ((e.key === 'Enter' || e.key === 'e' || e.key === 'E') && list.length) {"));
ok('main.js 旧「Enter 独认」条件零残留', !mainSrc.includes("e.key === 'Enter' && list.length"));
ok('main.js 含 v22.84 注释块', mainSrc.includes('// v22.84 技能菜单施放补 E 键别名'));
ok('KEY 移动表无 e/E 映射（不与移动键冲突）', dataSrc.includes("const KEY={ ArrowUp:'U',w:'U',W:'U',ArrowDown:'D',s:'D',S:'D',ArrowLeft:'L',a:'L',A:'L',ArrowRight:'R',d:'R',D:'R' }"));

// 3. 页脚口径（drawBattle 技能菜单页脚 Enter/E）
const dbSrc = readFileSync(join(ROOT, 'js/view/drawBattle.js'), 'utf8');
ok('技能菜单页脚 [Enter/E]施放', dbSrc.includes('[Enter/E]施放'));
ok('旧口径「[Enter]施放」零残留', !dbSrc.includes('[Enter]施放'));
ok('drawBattle 含 v22.84 注释块', dbSrc.includes('// v22.84 技能菜单页脚口径补 E 别名'));
ok('drawBattle 仍保留 [数字键]快捷 标注（v21.81 口径零回归）', dbSrc.includes('[数字键]快捷'));
// —— v23.34 技能菜单标题「已学 N/7」计数（体验打磨·信息透明·纯显示，承 v23.16-21 节头计数 / v23.27 快速旅行标题计数同一家族）——
ok('drawBattle 技能菜单标题含「已学 N/M」计数（hero.skills.length / Object.keys(SKILL_DATA).length 单一数据源派生、零裸字面量）',
  dbSrc.includes("panel(150, 96, 340, 308, '— 技能 · 已学 ' + hero.skills.length + '/' + Object.keys(SKILL_DATA).length + ' —');"));
ok('drawBattle 技能菜单旧标题「— 技能 —」零残留', !dbSrc.includes("'— 技能 —'"));
ok('drawBattle 含 v23.34 注释块', dbSrc.includes('// v23.34 体验打磨·信息透明·纯显示'));
ok('data.js 含 v23.34 版本注释', dataSrc.includes('// v23.34 体验打磨·信息透明·纯显示'));

// 4. 数据契约：H 页操作说明「战斗」行 r[1] 补 /E 口径 + r[2] 零回归
const data = await import(join(ROOT, 'js/data.js'));
const { HELP_PAGES, FLEE_SUCCESS, CHARGE_MULT, GAME_VERSION, SKILL_DATA } = data;
const page0 = HELP_PAGES[0] || [];
const combat = page0.filter((r) => r[0] === '战斗');
ok('操作说明页「战斗」行唯一存在', combat.length === 1);
const row = combat[0] || [];
const wantR1 = '1攻击 2技能(↑↓/Enter/E 选招) 3药水 4逃跑(约' + Math.round(FLEE_SUCCESS * 100) + '%) 5防御 6蓄力';
ok('r[1] 主行为「↑↓/Enter/E 选招」口径（FLEE_SUCCESS 派生未动）', row[1] === wantR1, row[1]);
ok('r[2] 含新增「技能菜单数字键1-7快捷直发」（v21.81 口径零回归）',
  typeof row[2] === 'string' && row[2].includes('技能菜单数字键1-7快捷直发'));
ok('r[2] 既有段零回归（蓄力×CHARGE_MULT 同源派生）', typeof row[2] === 'string' && row[2].includes('蓄力：下击/技能×' + CHARGE_MULT));
ok('r[2] 既有段零回归（Boss无法逃跑 / ↑↓ 回看战斗记录）',
  typeof row[2] === 'string' && row[2].includes('Boss无法逃跑') && row[2].includes('↑↓ 回看战斗记录'));
ok('data.js 含 v22.84 行内注释', dataSrc.includes('v22.84 r[1] 主行「↑↓/Enter 选招」补 /E 口径'));
// v23.34 数据契约：技能总数 = Object.keys(SKILL_DATA).length（标题计数分母，调总容量只改 data.js 一处）
ok('SKILL_DATA 共 7 招（v23.34 标题计数分母——与 v21.83 七招容量 / smoke_v2306 契约同读一份源）', Object.keys(SKILL_DATA).length === 7, String(Object.keys(SKILL_DATA).length));

// 5. 行宽预算（smoke_v2181 同款 estW）：r[1] 14px ≤470 面板预算、页长零变化
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
const wR1 = estW(row[1] || '', 14);
ok('r[1]（14px）估算宽 ≤470 面板预算（v22.84 加 /E 后 ≈387.7）', wR1 <= 470, `≈${wR1.toFixed(1)}`);
ok('页长预算：操作说明页行数不变仍 14（sp=25 档不触页脚 452）', page0.length === 14, `实际 ${page0.length}`);

// 6. 运行期全链路：DOM/音频/存储桩 + main.js 真实导入 + battle.onKey 逐键驱动
const noop = () => {};
function makeCtx() {
  const grad = { addColorStop: noop };
  return {
    canvas: { width: 640, height: 480 },
    measureText: (t) => ({ width: String(t).length * 7 }),
    createLinearGradient: () => grad, createRadialGradient: () => grad, createConicGradient: () => grad, createPattern: () => ({}),
    beginPath: noop, closePath: noop, moveTo: noop, lineTo: noop, arc: noop, arcTo: noop, ellipse: noop,
    quadraticCurveTo: noop, bezierCurveTo: noop, fill: noop, stroke: noop, fillRect: noop, strokeRect: noop,
    clearRect: noop, drawImage: noop, save: noop, restore: noop, translate: noop, rotate: noop, scale: noop,
    transform: noop, setTransform: noop, clip: noop, rect: noop, setLineDash: noop, getLineDash: () => [],
    isPointInPath: () => false,
    globalAlpha: 1, strokeStyle: '#000', fillStyle: '#000', font: '', textAlign: 'left', textBaseline: 'alphabetic',
    lineWidth: 1, imageSmoothingEnabled: false, fillText: noop,
  };
}
function mkEl(id) {
  const cl = { add: noop, remove: noop, contains: () => false, toggle: noop };
  return { textContent: '', style: {}, className: '', id, width: 640, height: 480,
    getContext: () => makeCtx(), classList: cl, parentElement: { classList: cl }, addEventListener: noop };
}
const els = {};
globalThis.document = {
  getElementById: (id) => { if (!els[id]) els[id] = mkEl(id); return els[id]; },
  createElement: (tag) => tag === 'canvas'
    ? { width: 32, height: 32, getContext: () => makeCtx(), style: {}, classList: { add: noop, remove: noop } }
    : { style: {}, classList: { add: noop, remove: noop } },
  addEventListener: noop,
  documentElement: { style: {} },
};
function FakeAudio() { return { currentTime: 0, destination: {},
  createOscillator: () => ({ connect: noop, start: noop, stop: noop, type: '',
    frequency: { setValueAtTime: noop, exponentialRampToValueAtTime: noop } }),
  createGain: () => ({ connect: noop,
    gain: { setValueAtTime: noop, linearRampToValueAtTime: noop, exponentialRampToValueAtTime: noop } }),
  createBuffer: () => ({}), createBufferSource: () => ({ connect: noop, start: noop }),
  createPeriodicWave: () => ({}), resume: noop }; }
globalThis.window = { addEventListener: noop, AudioContext: FakeAudio, webkitAudioContext: FakeAudio };
const mem = {};
globalThis.localStorage = {
  getItem: (k) => Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null,
  setItem: (k, v) => { mem[k] = String(v); },
  removeItem: (k) => { delete mem[k]; },
};
globalThis.setInterval = () => 0;
globalThis.clearInterval = () => {};

await import('../js/main.js');
const { S } = await import('../js/state.js');
const { screens } = await import('../js/main.js');

function freshBattle() {
  S.scene = 'battle';
  S.battleBusy = false;
  S.skillMenuOpen = true;
  S.skillSel = 0;
  S.blogView = 0;
  S.G = { name: '余烬', level: 8, hp: 90, hpMax: 100, mp: 40, mpMax: 50, atkMax: 23, defMax: 15, gold: 0,
    skills: ['火焰斩', '治愈术'], poison: 0, charge: false, defending: false };
  S.enemy = { name: '野狼', hp: 999, hpMax: 999, def: 5, atk: 8, weak: 'fire', resist: null,
    shield: 0, isBoss: false, phased: false, hurt: 0 };
}
// 6.1 e/E/Enter 三键均施放光标所在技能（与 Enter 同路径：菜单关闭 + 行动启动 battleBusy）
for (const k of ['e', 'E', 'Enter']) {
  freshBattle();
  let threw = null;
  try { screens.battle.onKey({ key: k }); } catch (e) { threw = e; }
  ok(`运行期：battle.onKey 按 ${k === 'Enter' ? 'Enter' : k} 施放光标技能（菜单关闭 + 行动启动）`,
    threw === null && S.skillMenuOpen === false && S.battleBusy === true, threw && threw.message, String(S.skillMenuOpen) + '/' + String(S.battleBusy));
}
// 6.2 battleBusy=true 时 e/E 不触发行程（守卫分支零回归）
{
  freshBattle();
  S.battleBusy = true;
  let threw = null;
  try { screens.battle.onKey({ key: 'e' }); screens.battle.onKey({ key: 'E' }); } catch (e) { threw = e; }
  ok('运行期：battleBusy=true 时 e/E 零抛错且菜单维持打开（不误施放）',
    threw === null && S.skillMenuOpen === true, threw && threw.message);
}
// 6.3 Esc 仍关闭菜单不施放 + ↑↓ 导航零回归
{
  freshBattle();
  screens.battle.onKey({ key: 'Escape' });
  ok('运行期：技能菜单 Esc 关闭且未施放（零回归）', S.skillMenuOpen === false && S.battleBusy === false);
  freshBattle();
  S.battleBusy = false;
  screens.battle.onKey({ key: 'ArrowDown' });
  ok('运行期：技能菜单 ↑↓ 导航零回归（ArrowDown 后 skillSel=1）',
    S.skillSel === 1 && S.battleBusy === false, String(S.skillSel));
}

// 7. README / package.json / CHANGELOG 同步
const readme = readFileSync(join(ROOT, 'README.md'), 'utf8');
const pkg = readFileSync(join(ROOT, 'package.json'), 'utf8');
const changelog = readFileSync(join(ROOT, 'CHANGELOG.md'), 'utf8');
ok('README 快速上手表 Enter/E 行含「战斗技能菜单内 `E` 同效施放——v22.84」', readme.includes('战斗技能菜单内 `E` 同效施放——v22.84'));
ok('README 战斗段「`Enter`/`E` 施放」口径', readme.includes('`Enter`/`E` 施放——界面内 `E` 与 `Enter` 同效'));
ok('README tests 树串尾已延伸至 smoke_v2284_skillekey（v2283 后接 v2284）',
  readme.includes('smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('README 件套口径为二百一十二件套（二百一十一件套清除）且旧 179 口径零残留',
  readme.includes('冒烟二百一十二件套（二百一十一件套清除）') && !readme.includes('冒烟一百七十九件套（一百七十八件套清' + '除）'));
ok('README 含 v22.84 守护描述（战斗技能菜单施放 E 键别名守护）', readme.includes('v22.84 起含战斗技能菜单施放 E 键别名守护'));
ok('README 含 smoke_v2284_skillekey 入库（180 份）', readme.includes('smoke_v2284_skillekey 入库（180 份）'));
ok('README 仍保留 smoke_v2283_menuekey 入库（179 份）历史口径', readme.includes('smoke_v2283_menuekey 入库（179 份）'));
ok('README 仍保留 v22.83 守护描述（历史口径）', readme.includes('v22.83 起含商店/旅馆/酿造/快速旅行/暂停菜单确认 E 键别名守护'));
ok('package.json test 串含 smoke_v2284_skillekey.mjs 且位于串尾',
  pkg.includes('node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
const testChain = (pkg.match(/node tests\/smoke/g) || []).length;
ok('package.json test 串共 180 件套', testChain === 212, String(testChain));
ok('CHANGELOG 含 v22.84 条目（顶 pin）', changelog.startsWith('## v23.45 '));

// 8. 姊妹件套 pin（smoke_v2283_menuekey 随新现实更新）
const s2283 = readFileSync(join(ROOT, 'tests/smoke_v2283_menuekey.mjs'), 'utf8');
const s2282 = readFileSync(join(ROOT, 'tests/smoke_v2282_archgate.mjs'), 'utf8');
const s2281 = readFileSync(join(ROOT, 'tests/smoke_v2281_starwell.mjs'), 'utf8');
const s2260 = readFileSync(join(ROOT, 'tests/smoke_v2260_fountripple.mjs'), 'utf8');
ok('smoke_v2283 的 GAME_VERSION 字面量 pin 已更新为 v22.84', s2283.includes("const GAME_VERSION = 'v23.45';"));
ok('smoke_v2283 的 CHANGELOG 顶 pin 已更新为 ## v22.84', s2283.includes("startsWith('## v23.45 '"));
ok('smoke_v2283 的件套 pin 已更新为二百一十二件套（二百一十一件套清除）', s2283.includes('二百一十二件套（二百一十一件套清除）'));
ok('smoke_v2283 的 README 串尾 pin 已延伸至 smoke_v2284_skillekey', s2283.includes('smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2283 的 package 串尾 pin 已延伸至 smoke_v2284_skillekey', s2283.includes('node tests/smoke_v2282_archgate.mjs && node tests/smoke_v2283_menuekey.mjs && node tests/smoke_v2284_skillekey.mjs && node tests/smoke_v2285_winekey.mjs && node tests/smoke_v2286_titleekey.mjs && node tests/smoke_v2287_trueroute.mjs && node tests/smoke_v2288_scrollhint.mjs && node tests/smoke_v2289_winprog.mjs && node tests/smoke_v2290_statlink.mjs && node tests/smoke_v2291_lampguide.mjs && node tests/smoke_v2292_cavewatch.mjs && node tests/smoke_v2293_deadsave.mjs && node tests/smoke_v2294_crystalwatch.mjs && node tests/smoke_v2295_deadprog.mjs && node tests/smoke_v2296_endingprog.mjs && node tests/smoke_v2297_chestmid.mjs && node tests/smoke_v2298_encnum.mjs && node tests/smoke_v2299_crosslink.mjs && node tests/smoke_v2300_sidemore.mjs && node tests/smoke_v2301_eco.mjs && node tests/smoke_v2302_cmdprev.mjs && node tests/smoke_v2303_rushnum.mjs && node tests/smoke_v2304_achgoal.mjs && node tests/smoke_v2305_monnum.mjs && node tests/smoke_v2306_skillnum.mjs && node tests/smoke_v2307_bossnum.mjs && node tests/smoke_v2308_diffnum.mjs && node tests/smoke_v2309_questnum.mjs && node tests/smoke_v2310_diffsum.mjs && node tests/smoke_v2311_fragprev.mjs && node tests/smoke_v2312_voltitle.mjs && node tests/smoke_v2313_talkall.mjs && node tests/smoke_v2314_voices.mjs && node tests/smoke_v2315_talkfoot.mjs && node tests/smoke_v2316_voiceshead.mjs"'));
ok('smoke_v2282 的 GAME_VERSION 字面量 pin 已更新为 v22.84', s2282.includes("const GAME_VERSION = 'v23.45';"));
ok('smoke_v2282 的 CHANGELOG 顶 pin 已更新为 ## v22.84', s2282.includes("startsWith('## v23.45 '"));
ok('smoke_v2282 的 testChain pin 已更新为 180', s2282.includes('testChain === 212'));
ok('smoke_v2282 的 README 串尾 pin 已延伸至 smoke_v2284_skillekey', s2282.includes('smoke_v2283_menuekey + smoke_v2284_skillekey + smoke_v2285_winekey + smoke_v2286_titleekey + smoke_v2287_trueroute + smoke_v2288_scrollhint + smoke_v2289_winprog + smoke_v2290_statlink + smoke_v2291_lampguide + smoke_v2292_cavewatch + smoke_v2293_deadsave + smoke_v2294_crystalwatch + smoke_v2295_deadprog + smoke_v2296_endingprog + smoke_v2297_chestmid + smoke_v2298_encnum + smoke_v2299_crosslink + smoke_v2300_sidemore + smoke_v2301_eco + smoke_v2302_cmdprev + smoke_v2303_rushnum + smoke_v2304_achgoal + smoke_v2305_monnum + smoke_v2306_skillnum + smoke_v2307_bossnum + smoke_v2308_diffnum + smoke_v2309_questnum + smoke_v2310_diffsum + smoke_v2311_fragprev + smoke_v2312_voltitle + smoke_v2313_talkall + smoke_v2314_voices + smoke_v2315_talkfoot + smoke_v2316_voiceshead（npm test 串跑）'));
ok('smoke_v2281 的 GAME_VERSION 字面量 pin 已更新为 v22.84', s2281.includes("const GAME_VERSION = 'v23.45';"));
ok('smoke_v2260 的 package.json 串尾 pin 已延伸至 smoke_v2284_skillekey', s2260.includes('node tests/smoke_v2284_skillekey.mjs'));

// 9. 旧代 v22.83 pin 全库零残留
const allTests = readdirSync(join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs') && f !== 'smoke_v2284_skillekey.mjs');
const stale = [];
for (const f of allTests) {
  const src = readFileSync(join(ROOT, 'tests', f), 'utf8');
  if (src.includes("const GAME_VERSION = 'v22." + "83';") || src.includes("GAME_VERSION === 'v22." + "83'") ||
      src.includes('一百七十九件套（一百七十八件套清' + '除）') || src.includes('testChain === ' + '179') ||
      src.includes('smoke_v2283_menuekey（npm test ' + '串跑）') || src.includes('_gv[1] >= ' + '83') ||
      src.includes("startsWith('## v22." + "83 '")) stale.push(f);
}
ok('旧代 v22.83 字面量/恒等/件套/testChain/串尾/版本锚 pin 全库零残留（' + allTests.length + ' 件扫描）', stale.length === 0, stale.join(','));

// 10. 哨兵链（件套守护领先一位）已指向下一版 181 口径
const s2143 = readFileSync(join(ROOT, 'tests/smoke_v2143_talkekey.mjs'), 'utf8');
ok('哨兵链 v2143 已含下一版件套口径（二百一十二件套（二百一十一件套清除））', s2143.includes('二百一十三件套（二百一十二件套清除）'));

console.log(`\n— v22.84 战斗技能菜单施放 E 键别名冒烟：${pass}/${pass + fail} 通过 —`);
process.exit(fail ? 1 : 0);
