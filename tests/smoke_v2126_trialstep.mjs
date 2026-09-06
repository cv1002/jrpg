// v21.26 专项冒烟：试炼碑未解锁提示徽记进度即时化——data.js 新增纯函数 trialSteleHint(hero)，
// onTrialStele 未集齐双徽记时按其调用：0 枚输出与原文案逐字一致，1 枚指明「已得【X】/所差【Y】+ (1/2)」，
// 两位 Boss 名读 BOSS/CAVE_BOSS 单一数据源（零裸字面量），双徽记返回 ''（调用方 startRush 分支不引用）。
// 承 v19.72 宝箱进度 / v21.22 宝箱双口径同「进度即时透明」主线；承 v21.10 起冒烟入库先例（仓库常驻版）。
// 零回归面：world.onTrialStele 仅改未解锁分支的 boxMsg 来源（startRush 分支/水晶/祭坛/开箱/遇敌全未动），
// 0 枚文案逐字不变；无任何数值/战斗/任务/存档改动。
import { GAME_VERSION, BOSS, CAVE_BOSS, trialSteleHint } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.26 试炼碑未解锁提示进度即时 冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.25 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.25', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 26)));

// —— trialSteleHint 纯函数契约 ——
ok('trialSteleHint 已导出且为纯函数', typeof trialSteleHint === 'function');
const LEGACY = '…试炼碑需要两枚徽记（幽冥魔王 + 洞窟领主）。';
ok('0 枚徽记（空对象）→ 与原文案逐字一致（零显示变化）', trialSteleHint({}) === LEGACY, trialSteleHint({}));
ok('0 枚徽记（hero 缺失兜底）→ 与原文案逐字一致', trialSteleHint(undefined) === LEGACY);
ok('0 枚徽记文案由 BOSS.name/CAVE_BOSS.name 派生（≠硬编码）',
  trialSteleHint({}) === '…试炼碑需要两枚徽记（' + BOSS.name + ' + ' + CAVE_BOSS.name + '）。');
const m1 = trialSteleHint({ bossDefeated: true });
ok('已得幽冥魔王（bossDefeated）→ 指明已得【幽冥魔王】且所差【洞窟领主】',
  m1.includes('【' + BOSS.name + '】') && m1.includes('去击败【' + CAVE_BOSS.name + '】') && m1.includes('（1/2）'), m1);
const m2 = trialSteleHint({ caveBoss: true });
ok('已得洞窟领主（caveBoss）→ 指明已得【洞窟领主】且所差【幽冥魔王】',
  m2.includes('【' + CAVE_BOSS.name + '】') && m2.includes('去击败【' + BOSS.name + '】') && m2.includes('（1/2）'), m2);
ok('双徽记已集齐 → 返回 \'\'（调用方 startRush 分支不引用，契约兜底）', trialSteleHint({ bossDefeated: true, caveBoss: true }) === '');
ok('hero 字段缺省（无 bossDefeated/caveBoss 键）→ 仍按 0 枚原文案', trialSteleHint({ level: 10 }) === LEGACY);
ok('分支不重复双写：1 枚分支不含另一枚的【已得】组合（已得/所差互斥）',
  m1.includes('已得') && !m1.includes('【' + CAVE_BOSS.name + '】的徽记，去击败【' + BOSS.name + '】'));

// —— 源码级守护：名字派生零裸字面量 + v21.26 注释 + world 调用面 ——
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const wSrc = fs.readFileSync(path.join(ROOT, 'js/world.js'), 'utf8');
ok('data.js 含 v21.26 注释（试炼碑未解锁提示进度即时说明）', dSrc.includes('试炼碑未解锁提示（v21.26'));
ok('data.js 函数体内以 BOSS.name/CAVE_BOSS.name 派生文案（不含裸「幽冥魔王 + 洞窟领主」拼接）',
  dSrc.includes('BOSS.name + \' + \' + CAVE_BOSS.name') && dSrc.includes('BOSS.name ? CAVE_BOSS.name : BOSS.name'));
ok('world.js 已 import trialSteleHint', /import\s*\{[^}]*trialSteleHint[^}]*\}\s*from\s*'\.\/data\.js'/.test(wSrc));
ok('world.js onTrialStele 未解锁分支改调 trialSteleHint（不再含旧静态文案字面量）',
  wSrc.includes('bind.boxMsg(trialSteleHint(hero), NARR_MSG_MS)') && !wSrc.includes('试炼碑需要两枚徽记（幽冥魔王 + 洞窟领主）'));
ok('world.js startRush 分支未动（双徽记判定不变）', wSrc.includes('if (hero.bossDefeated && hero.caveBoss) startRush();'));

// —— README / package.json / 既有冒烟去硬化 同步守护 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
const s2125 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2125_rushreward.mjs'), 'utf8');
ok('README 已同步（tests 树收录 smoke_v2126_trialstep + 冒烟二十二件套口径、二十一件套清除）',
  readme.includes('smoke_v2126_trialstep') && readme.includes('二十二件套') && !readme.includes('二十一件套'));
ok('README 试炼碑状态标签句已补「按已得徽记实时提示」口径', readme.includes('按已得徽记实时提示还差哪枚'));
ok('package.json 已收录 smoke_v2126_trialstep（npm test 串跑第 22 份）',
  pkg.includes('smoke_v2126_trialstep.mjs'));
ok('smoke_v2125 的 README 守护表达式已去硬化（v21.7 惯例：不再以「二十一件套」断言件数，实件数由本版冒烟守护）',
  s2125.includes("includes('冒烟')") && s2125.includes("includes('件套')") && !s2125.includes("includes('二十一件套')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
