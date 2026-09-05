// v21.13 专项冒烟：状态页冒险进度徽记行越界修复——徽记行距按数量派生（仓库常驻版）
// 背景：v13.7 四幕重构把冒险进度徽记从四格增到五格（灯芯/星井/回廊/初灯/试炼场），drawStatus 仍按
// 四格 88px 步距排布：第 5 格「✓ 试炼场」x=190+4*88=542，12px 字形宽 @napi-rs/canvas 实测 ≈41px
// （浏览器含 ✓ 全宽字形 ≈47px），右缘 583–589 越过面板右缘 570（panel(70,28,500,424)），徽记压出
// 面板。本版：新增派生化 progressSpacing(n)= min(88, floor((570-190-60)/(n-1)))——n=5 → 80
// （第 5 格 x=510，右缘 ≈557 ≤570）；n≤4 → 88 与旧布局逐值一致；n≥6 自动收紧不复发。
import { GAME_VERSION } from '../js/data.js';
import { S } from '../js/state.js';
import { adventureProgress } from '../js/quests.js';
import { initGame } from '../js/core.js';
import { loadMap } from '../js/world.js';
import { drawStatus, progressSpacing } from '../js/view/menus.js';
import { CTX } from '../js/view/canvas.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.13 状态页徽记行距冒烟 —');

// 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.12
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.12', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 12)));

// —— 徽记数据：仍为五格（灯芯/星井/回廊/初灯/试炼场）——
const prog = adventureProgress({ bossDefeated: true, caveBoss: true, galleryOpen: true, trueBoss: true, rushDone: true });
ok('adventureProgress 仍为 5 格（灯芯/星井/回廊/初灯/试炼场）',
  prog.length === 5 &&
  prog[0][0] === '灯芯' && prog[1][0] === '星井' && prog[2][0] === '回廊' &&
  prog[3][0] === '初灯' && prog[4][0] === '试炼场', JSON.stringify(prog.map(p => p[0])));

// —— 派生式（与 menus.js drawStatus 同源）——
ok('progressSpacing(5) = 80（修复前固定 88 撑出第 5 格）', progressSpacing(5) === 80, `实际 ${progressSpacing(5)}`);
ok('progressSpacing(4) = 88（徽记 ≤4 格时与旧布局逐值一致）', progressSpacing(4) === 88, `实际 ${progressSpacing(4)}`);
ok('progressSpacing(3) = 88（旧四格时代一档），progressSpacing(6) = 64（自动收紧）',
  progressSpacing(3) === 88 && progressSpacing(6) === 64, `3→${progressSpacing(3)} / 6→${progressSpacing(6)}`);
ok('progressSpacing 单调不增（徽记越多行距越紧，不会压出）',
  progressSpacing(3) >= progressSpacing(4) && progressSpacing(4) >= progressSpacing(5) && progressSpacing(5) >= progressSpacing(6));

// —— 宽度预算（纯估算，不依赖 canvas，零依赖约定）——
// 徽记行 12px：起点 x=190，面板右缘 570；估算系数沿用既有冒烟 @napi-rs/canvas 标定口径（宽字符 0.865em）
const estW = (s, size) => {
  let wsum = 0;
  for (const ch of String(s || '')) {
    const code = ch.codePointAt(0);
    const wide = (code >= 0x2e80 && code <= 0x9fff) || (code >= 0x3000 && code <= 0x303f) || (code >= 0xff00 && code <= 0xffef) || code >= 0x1f000;
    if (wide) wsum += 0.865 * size;
    else if (code === 0x20) wsum += 0.263 * size;
    else wsum += 0.55 * size;
  }
  return wsum;
};
const badgeW = estW('✓ 试炼场', 12); // ≈47.2
const lastX = 190 + 4 * progressSpacing(5);
ok('第 5 格「✓ 试炼场」起点 x=510（修复前 542）', lastX === 510, `实际 ${lastX}`);
ok('第 5 格右缘 = ' + (lastX + badgeW).toFixed(1) + ' ≤ 570（修复前 583–589 越界）',
  lastX + badgeW <= 570, `右缘 ${(lastX + badgeW).toFixed(1)}`);
ok('第 5 格距面板右缘余量 ≥10px', 570 - (lastX + badgeW) >= 10, `余量 ${(570 - lastX - badgeW).toFixed(1)}px`);
ok('各格互不重叠（行距 80 > 最宽徽记 ≈47）', progressSpacing(5) > badgeW, `行距 ${progressSpacing(5)} vs 宽 ${badgeW.toFixed(1)}`);

// —— drawStatus 实绘落位（Node stub 画布 + 记录 fillText，承 v21.12 惯例）——
const calls = [];
const origFT = CTX.fillText ? CTX.fillText.bind(CTX) : null;
CTX.fillText = function (t, x, y) { calls.push({ t: String(t), x, y }); if (origFT) origFT(t, x, y); };

initGame('徽记冒烟');
S.G.level = 12; S.G.xp = 0; S.G.xpNext = 1000; S.G.hp = 999; S.G.hpMax = 999; S.G.mp = 99; S.G.mpMax = 99;
S.G.atkMax = 50; S.G.defMax = 30;
S.G.skills = ['火焰斩', '冰霜击', '治愈术', '雷鸣', '陨石术'];
S.G.fragments = ['golem', 'demon', 'cave', 'true'];
S.G.bossDefeated = true; S.G.caveBoss = true; S.G.trueBoss = true; S.G.rushDone = true;
S.G.quests = {}; S.G.bestiary = {};
loadMap('village');

let drew = true;
try { drawStatus(); } catch (e) { drew = false; console.log('   drawStatus:', e.message); }
ok('drawStatus 绘制不抛错（五格满档）', drew);

const badges = calls.filter((c) => /^(✓|✗) /.test(c.t) && c.y === 412);
ok('徽记行仍绘 5 格且同基线 y=412', badges.length === 5 && badges.every((c) => c.y === 412), `实际 ${badges.length}`);
const xs = badges.map((c) => c.x);
ok('徽记 x 序列 = 190/270/350/430/510（行距 80）', JSON.stringify(xs) === JSON.stringify([190, 270, 350, 430, 510]), JSON.stringify(xs));
const lastBadge = badges[4];
ok('实绘第 5 格 = ' + lastBadge.t + ' 起点 510 ≤ 右缘 570',
  lastBadge.t === '✓ 试炼场' && lastBadge.x === 510 && lastBadge.x + estW(lastBadge.t, 12) <= 570);

// —— 旧硬编码不残留（drawStatus 已改用派生式）——
const srcOk = await (async () => {
  try {
    const fs = await import('node:fs');
    const src = fs.readFileSync(new URL('../js/view/menus.js', import.meta.url), 'utf8');
    return !/i\*88/.test(src) && /i\*progressSpacing\(/.test(src) && /export function progressSpacing/.test(src);
  } catch { return false; }
})();
ok('drawStatus 源码已改用 progressSpacing（无 i*88 硬编码残留）', srcOk);

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
