// v21.12 专项冒烟：快速旅行页脚与末行重叠修复——页脚位置由列表长度派生（仓库常驻版）
// 背景：drawTravel 页脚此前硬编码 y=270；TRAVEL_LIST 第 4 条目的地（无字回廊）加入后末行
// baseline=110+3*52=266（16px 字形底 267），页脚 12px 字形顶 261 —— @napi-rs/canvas 实测重叠 6px，
// 页脚还被夹在末行标题与描述（baseline 285）之间。本版：页脚派生 travelFootY(n)=110+(n-1)*52+19+35，
// n=4 → 320，字形顶 311 与描述底 286 相隔 25px、距 panel 底 380 富余 60px。
import { GAME_VERSION, TRAVEL_LIST } from '../js/data.js';
import { S, curMap } from '../js/state.js';
import { drawTravel, travelFootY } from '../js/view/menus.js';

const mem = {};
globalThis.localStorage = {
  getItem: (k) => mem[k] ?? null,
  setItem: (k, v) => { mem[k] = String(v); },
  removeItem: (k) => { delete mem[k]; },
};

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.12 快速旅行页脚冒烟 —');

// 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.11
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.11', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 11)));

// 布局前提：旅行列表条目数（页脚派生的分母）
ok('TRAVEL_LIST 仍为 4 条（village/dungeon/cave/gallery）', TRAVEL_LIST.length === 4, `实际 ${TRAVEL_LIST.length}`);

// —— 派生式（与 menus.js drawTravel 同源）——
const N = TRAVEL_LIST.length;
const LAST_TITLE = 110 + (N - 1) * 52;   // 末行标题 baseline（现 266）
const LAST_DESC = LAST_TITLE + 19;        // 末行描述 baseline（现 285）
const footY = travelFootY(N);             // 页脚 baseline（现 320）

ok('页脚派生值 = 320（修复前硬编码 270）', footY === 320, `实际 ${footY}`);

// —— 垂直预算（用 @napi-rs/canvas 实测字形界标定：16px ascent≈13/descent≈1；12px ascent≈9/descent≈0；11px ascent≈9/descent≈1）——
const titleBottom = LAST_TITLE + 1;        // 16px 字形底（267）
const descBottom = LAST_DESC + 1;          // 11px 字形底（286）
const footTop = footY - 9;                 // 12px 字形顶（311）
ok('页脚不再重叠末行标题（修复前重叠 6px）', footTop > titleBottom, `footTop=${footTop} vs titleBottom=${titleBottom}`);
ok('页脚不再夹在末行标题与描述之间（修复前 270∈261..270 夹 266..285）', footTop > descBottom, `footTop=${footTop} vs descBottom=${descBottom}`);
ok('页脚与描述行间隔 ≥20px', footTop - descBottom >= 20, `间隔 ${footTop - descBottom}px`);
ok('页脚仍落在 panel 内（panel 底 380，余量 ≥40px）', 380 - footY >= 40, `余量 ${380 - footY}px`);

// —— 派生式随条目数自愈（防止将来再加目的地又踩重叠）——
ok('n=5 时页脚仍不越 panel（372 ≤ 380）', travelFootY(5) <= 380, `n=5 → ${travelFootY(5)}`);
ok('n=3 时页脚 268 > 末行标题 214+1（旧三目的地布局也安全）', travelFootY(3) - 9 > 110 + 2 * 52 + 1, `n=3 → ${travelFootY(3)}`);

// —— 旧硬编码值不残留（drawTravel 源码已改用派生）——
const srcOk = await (async () => {
  try {
    const fs = await import('node:fs');
    const src = fs.readFileSync(new URL('../js/view/menus.js', import.meta.url), 'utf8');
    return !/drawTravel[\s\S]{0,600}?320,270/.test(src) && src.includes('travelFootY(TRAVEL_LIST.length)');
  } catch { return false; }
})();
ok('drawTravel 源码已改用 travelFootY 派生（无 270 硬编码残留）', srcOk);

// —— 旅行界面绘制不抛错（Node stub 画布，承 v21.6 惯例）——
S.G = { visited: ['village', 'dungeon', 'cave', 'gallery'], name: '守灯人', map: 'village' };
S.scene = 'travel';
S.travelSel = 0;
let drew = true;
try { drawTravel(); } catch (e) { drew = false; console.log('   drawTravel:', e.message); }
ok('drawTravel 绘制不抛错', drew);
ok('curMap 仍可读（状态未受干扰）', typeof curMap === 'function');

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
