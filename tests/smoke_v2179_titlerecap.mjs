// v21.79 专项冒烟：标题页存档预览补「收集进度」三件套——slotPreview 此前报 姓名/等级/金币/地图/进度/
// 难度/存档时间/时长（v19.45/v19.64/v19.65），唯独缺「这个档收集到哪了」：多存档槽玩家想挑更完整的档
// 继续，只能进游戏按 I/C/B 逐页翻；现于预览行末追加 成就N/M·图鉴N/M·宝箱N/M（与成就页「已解锁 X/28」、
// 图鉴页「记忆收录 X/13」、状态页「📦 已开 X/全图 N」同读 ACH_LIST / BESTIARY_TARGET /
// chestCount·chestTotal 一份单一数据源——chestCount 防御式兼容 Set/数组/缺失三形态、旧档零迁移，
// 绝无第二套口径）。纯显示零结算零存档变化，单行 13px 居中 ≤620 宽度预算（640 画布两侧余量）。
// 本冒烟守护：版本锚点、data.js/core.js 源级落位（新三件套派生 + 既有段逐字保留）、运行期实证
// （新档 0/0/0 → 推进档逐值 → 旧布尔 bestiary 归一 → 旧字段缺失防御档 → 难度档 → 空槽 null）、
// 行宽预算、单行性、README/package 同步、smoke_v2178/v2177/v2176 件套 pin 随新现实更新。
import { GAME_VERSION, ACH_LIST, BESTIARY_TARGET, chestTotal, FRAGMENTS } from '../js/data.js';
import { slotPreview, saveKey, newGame } from '../js/core.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.79 标题页存档预览收集进度冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.78 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.78', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 78)));

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const coreSrc = read('../js/core.js');

ok('data.js 含 v21.79 版本注释', dataSrc.includes('v21.79 标题页存档预览补收集进度'));
ok('data.js GAME_VERSION 字面量已更新为 v21.82（v21.82 起精确版本由当版冒烟守护）', dataSrc.includes("const GAME_VERSION = 'v22.23';"));

// —— 源级落位：core.js 新三件套派生 + 既有段逐字保留 ——
ok('core.js 导入 ACH_LIST/BESTIARY_TARGET/chestCount/chestTotal（单一数据源）',
  coreSrc.includes('ACH_LIST') && coreSrc.includes('BESTIARY_TARGET') && coreSrc.includes('chestCount') && coreSrc.includes('chestTotal'));
ok('slotPreview 派生成就数（hero.ach 长度）', coreSrc.includes('const achN = (hero.ach || []).length;'));
ok('slotPreview 派生图鉴数（BESTIARY_TARGET.filter 同源）', coreSrc.includes('BESTIARY_TARGET.filter((n) => ((hero.bestiary || {})[n] | 0) >= 1).length'));
ok('slotPreview 派生宝箱数（chestCount 防御式单源）', coreSrc.includes('const chestN = chestCount(hero);'));
ok('预览行末尾追加三件套段（成就/图鉴/宝箱 与各自分母同源）',
  coreSrc.includes('成就${achN}/${ACH_LIST.length}') && coreSrc.includes('图鉴${codexN}/${BESTIARY_TARGET.length}') && coreSrc.includes('宝箱${chestN}/${chestTotal()}'));
ok('既有预览段逐字保留（姓名/Lv/金币/地图进度/难度/存档时间/时长）',
  coreSrc.includes("${hero.name || '守灯人'} Lv.${hero.level} 金币${hero.gold || 0}") &&
  coreSrc.includes('fmtAgo(data.savedAt)') && coreSrc.includes('fmtTime(hero.time)') && coreSrc.includes('DIFFS[hero.diff]'));
ok('预览模板仍为单行（无换行，y=360 布局不动）', !coreSrc.split('· 成就${achN}')[0].includes('\\n') && !coreSrc.includes("\\n · 成就"));

// —— localStorage 桩（承 v19.65 先例）——
const mem = {};
globalThis.localStorage = {
  getItem: (k) => mem[k] ?? null,
  setItem: (k, v) => { mem[k] = String(v); },
  removeItem: (k) => { delete mem[k]; },
};

// 运行期实证：新档三件套全 0
const fresh = newGame('守灯人');
fresh.level = 1; fresh.gold = 30; fresh.map = 'village'; fresh.time = 3;
delete fresh.ach; delete fresh.bestiary; delete fresh.chests;
mem[saveKey(1)] = JSON.stringify({ G: fresh, chests: [], savedAt: Date.now() });
const pv0 = slotPreview(1);
ok('新档预览含 成就0/M 且分母=ACH_LIST.length（同源）', typeof pv0 === 'string' && pv0.includes(`成就0/${ACH_LIST.length}`));
ok('新档预览含 图鉴0/M 且分母=BESTIARY_TARGET.length（同源）', typeof pv0 === 'string' && pv0.includes(`图鉴0/${BESTIARY_TARGET.length}`));
ok('新档预览含 宝箱0/M 且分母=chestTotal()（同源）', typeof pv0 === 'string' && pv0.includes(`宝箱0/${chestTotal()}`));
ok('新档预览既有段零回归（姓名/Lv/金币/地图/⏱时长）', typeof pv0 === 'string' && pv0.includes('守灯人') && pv0.includes('Lv.1') && pv0.includes('金币30') && pv0.includes('潮灯镇') && pv0.includes('00:00:03'));

// 运行期实证：推进档逐值（成就 2 / 图鉴 2 / 宝箱 2）
const prog = newGame('潮');
prog.level = 8; prog.gold = 500; prog.map = 'village'; prog.time = 3723;
prog.ach = ['firstblood', 'lvl5'];
prog.bestiary = { [BESTIARY_TARGET[0]]: 2, [BESTIARY_TARGET[1]]: 1 };
prog.chests = ['22,1', '12,11'];
mem[saveKey(2)] = JSON.stringify({ G: prog, chests: Array.from(prog.chests), savedAt: Date.now() - 300000 });
const pv1 = slotPreview(2);
ok('推进档预览逐值（成就2/M·图鉴2/N·宝箱2/M 与成就页/图鉴页/状态页同口径）',
  typeof pv1 === 'string' && pv1.includes(`成就2/${ACH_LIST.length}`) && pv1.includes(`图鉴2/${BESTIARY_TARGET.length}`) && pv1.includes(`宝箱2/${chestTotal()}`));
ok('推进档预览既有段零回归（时间戳/时长）', typeof pv1 === 'string' && pv1.includes('5分钟前') && pv1.includes('01:02:03'));

// 旧布尔 bestiary 归一（v21.37 之前旧档 true → |0 归一计数）
const oldStyle = newGame('灯见');
oldStyle.level = 3; oldStyle.map = 'village'; oldStyle.time = 60;
oldStyle.ach = ['firstblood'];
oldStyle.bestiary = { [BESTIARY_TARGET[2]]: true };
mem[saveKey(3)] = JSON.stringify({ G: oldStyle, chests: [], savedAt: Date.now() });
const pv2 = slotPreview(3);
ok('旧布尔 bestiary 经 |0 归一为已收录（图鉴1/N）', typeof pv2 === 'string' && pv2.includes(`图鉴1/${BESTIARY_TARGET.length}`));

// 难度档 + 真结局档（v19.45 口径零回归：仅困难档标注；灯已归还分支）
const hard = newGame('余烬');
hard.level = 12; hard.map = 'gallery'; hard.time = 359999; hard.diff = 1; hard.trueBoss = true;
hard.ach = []; hard.bestiary = {}; hard.chests = [];
mem[saveKey(4)] = JSON.stringify({ G: hard, chests: [], savedAt: Date.now() - 260000000 });
const pv3 = slotPreview(4);
ok('困难档标注零回归且预览含 无字回廊/灯已归还', typeof pv3 === 'string' && pv3.includes('困难') && pv3.includes('无字回廊') && pv3.includes('灯已归还'));

// 空槽返回 null（零回归）
ok('空槽返回 null', slotPreview(9) === null);

// —— 行宽预算：v21.18 同款 estW（13px 单行 ≤640，640 画布中心对齐；v22.5 随 ·🕯️N/4 并入由 ≤620 放宽）——
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
ok('最坏预览行估算宽 ≤640（640 画布中心对齐，v22.5 随碎片并入放宽预算）', wWorst > 0 && wWorst <= 640, `≈${wWorst.toFixed(0)}`);
['余烬','守灯人','灯见','潮'].forEach((nm) => {
  const w = estW(worst.replace('余烬', nm), 13);
  ok(`合理性抽查：${nm} 名预览 ≤640`, w <= 640, `≈${w.toFixed(0)}`);
});

// —— README / package / 姊妹件套 pin 随新现实更新（v21.7 惯例：最新版守护 README 与旧 pin）——
const readme = read('../README.md');
const pkg = read('../package.json');
ok('README 已同步（tests 树收录 smoke_v2179_titlerecap + 冒烟/件套口径）',
  readme.includes('smoke_v2179_titlerecap') && readme.includes('冒烟') && readme.includes('件套'));
ok('README 件套口径已更新为一百一十九件套（一百一十八件套清除）',
  readme.includes('一百一十九件套（一百一十八件套清除）') && !readme.includes('七十五件套（七十四件套清除）'));
ok('package.json 已收录 smoke_v2179_titlerecap（第 75 份）', pkg.includes('tests/smoke_v2179_titlerecap.mjs'));
const s2178 = read('../tests/smoke_v2178_codexseen.mjs');
const s2177 = read('../tests/smoke_v2177_elites.mjs');
const s2176 = read('../tests/smoke_v2176_allchests.mjs');
ok('smoke_v2178 的 README 件套 pin 已随新现实更新为一百一十九件套（一百一十八件套清除）',
  s2178.includes("ok('README 件套口径为一百一十九件套（一百一十八件套清除）'"));
ok('smoke_v2177 的 README 件套 pin 已随新现实更新为一百一十九件套（一百一十八件套清除）',
  s2177.includes("ok('README 件套口径为一百一十九件套（一百一十八件套清除）'"));
ok('smoke_v2176 的 README 件套 pin 已随新现实更新为一百一十九件套（一百一十八件套清除）',
  s2176.includes("ok('README 件套口径为一百一十九件套（一百一十八件套清除）'"));

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
