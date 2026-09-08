// v21.46 专项冒烟：试炼推荐等级标注（信息透明收口）——data.js 新增 RUSH_REC_LV = max(RUSH_BOSSES 各关
// SPECIES[].lv) 单一数据源派生（8/7/12 → 12），三端同读：守碑人台词（sentinelPages 追加「这碑的阵仗，
// 是按 N 级刻的」）、试炼碑标签（drawWorld 追加「· 建议Lv.N」）、H 页「试炼进阶」「试炼三连战」行 r[2]
// 追加「建议Lv.N」。试炼此前是信息透明体系里唯一没有推荐等级标注的最重挑战（v20.6 实测 Lv11 约 42% /
// Lv12 约 100% 通关，玩家只能从碑上阵容末位「终焉之神Lv12」自行推断）。本冒烟守护：版本锚点、RUSH_REC_LV
// 派生健全（与 SPECIES[].lv 同源逐值、导出）、守碑人台词运行期（含 N 级口径、after 彩蛋零回归）、
// H 页 r[2] 落位与行宽预算、drawWorld 源级 + 运行期标签实证（ready/未解锁两态）、README/package 同步、
// smoke_v2145 件套断言去硬化确认（v21.7 惯例）。
import { S } from '../js/state.js';
import { GAME_VERSION, NPCS, SPECIES, RUSH_BOSSES, RUSH_REC_LV, HELP_PAGES } from '../js/data.js';
import { npcQuestPages } from '../js/quests.js';
import { drawWorld } from '../js/view/index.js';
import { CTX } from '../js/view/canvas.js';
import { loadMap } from '../js/world.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// —— DOM / Canvas 桩（承 v21.29-v21.45 冒烟先例：先装桩再 import main.js）——
const noop = () => {};
function makeCtx() {
  const grad = { addColorStop: noop };
  return {
    canvas: { width: 640, height: 480 },
    measureText: (t) => ({ width: String(t).length * 8 }),
    createLinearGradient: () => grad, createRadialGradient: () => grad, createConicGradient: () => grad, createPattern: () => ({}),
    beginPath: noop, closePath: noop, moveTo: noop, lineTo: noop, arc: noop, arcTo: noop, ellipse: noop,
    quadraticCurveTo: noop, bezierCurveTo: noop, fill: noop, stroke: noop, fillRect: noop, strokeRect: noop,
    clearRect: noop, drawImage: noop, save: noop, restore: noop, translate: noop, rotate: noop, scale: noop,
    transform: noop, setTransform: noop, clip: noop, rect: noop, setLineDash: noop, getLineDash: () => [],
    isPointInPath: () => false,
    globalAlpha: 1, strokeStyle: '#000', fillStyle: '#000', font: '', textAlign: 'left', textBaseline: 'alphabetic',
    lineWidth: 1, imageSmoothingEnabled: false,
    fillText: noop,
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

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.46 试炼推荐等级标注 冒烟 —');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// —— 版本锚点（v21.7 去硬化惯例：格式合法 + 已越过 v21.45）——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.45', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 46)), GAME_VERSION);
const dSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
ok('data.js 含 v21.46 注释（试炼推荐等级标注）', dSrc.includes('v21.46 新增：试炼推荐等级标注'));

// —— RUSH_REC_LV 派生健全（与 SPECIES[].lv 同源逐值、导出）——
ok('RUSH_REC_LV 已导出且为正数', typeof RUSH_REC_LV === 'number' && RUSH_REC_LV > 0, RUSH_REC_LV);
ok('RUSH_REC_LV === max(各关 SPECIES[].lv)（8/7/12 → 12 派生逐值）',
  RUSH_REC_LV === Math.max(...RUSH_BOSSES.map((b) => (SPECIES[b.name] && SPECIES[b.name].lv) || 1)) &&
  RUSH_REC_LV === 12, RUSH_REC_LV);
ok('真源健全：三 Boss SPECIES[].lv 均为正数（8/7/12）',
  SPECIES['幽冥魔王'].lv === 8 && SPECIES['洞窟领主'].lv === 7 && SPECIES['终焉之神'].lv === 12);
ok('RUSH_BOSSES 三关与 RUSH_REC_LV 口径同源（阵容名可查 SPECIES）',
  RUSH_BOSSES.length === 3 && RUSH_BOSSES.every((b) => SPECIES[b.name] && SPECIES[b.name].lv > 0));

// —— 守碑人台词运行期：新推荐等级段 + after 彩蛋零回归 ——
const sent = NPCS.sentinel;
ok('sentinel 仍为函数型 lines（sentinelPages）', sent && typeof sent.lines === 'function');
const pPages = npcQuestPages({ level: 10 }, 'sentinel');
const flat = (arr) => arr.flat(Infinity).map((s) => String(s));
const p0 = flat(pPages[0]);
ok('守碑人第一页含推荐等级口径（按 12 级刻的 · 碑光可护不住你）',
  p0.some((s) => s.includes('按 12 级刻的')) && p0.some((s) => s.includes('碑光可护不住你')), p0.join('|'));
ok('守碑人第一页其余台词零回归（三道刻痕/恢复/赏金/[Enter] 继续）',
  p0.some((s) => s.includes('三道刻痕')) && p0.some((s) => s.includes('%HP/')) &&
  p0.some((s) => s.includes('金（随你等级水涨船高）')) && p0.some((s) => s === '[Enter] 继续'));
const pages2 = npcQuestPages({ level: 12 }, 'sentinel');
ok('守碑人第二页（机制页）零回归（真身/石甲/封印治愈/[Enter] 结束）静置',
  flat(pages2[1] || []).some((s) => s.includes('治愈术会被封印')) &&
  flat(pages2[1] || []).some((s) => s === '[Enter] 结束'));
const epi = npcQuestPages({ trueBoss: true, level: 10 }, 'sentinel');
ok('守碑人 trueBoss 后 after 彩蛋零回归（碑光熄灭/刻痕更深）',
  flat(epi).some((s) => s.includes('刻痕深一分')) && !flat(epi).some((s) => s.includes('碑光可护不住你')));

// —— H 页「试炼进阶」：r[2] 追加建议等级 + 行宽预算 + 行数不变 ——
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
    else if (code === 0x2014) wsum += 0.812 * size;
    else if (code >= 0x30 && code <= 0x39) wsum += 0.63 * size;
    else if (code === 0x20) wsum += 0.263 * size;
    else wsum += 0.55 * size;
  }
  return wsum;
};
const page3 = HELP_PAGES[3];
const rushRow = page3 && page3.find((r) => r[0] === '试炼三连战');
ok('试炼三连战行存在且仍为 r[1]+r[2] 结构', !!rushRow && rushRow.length === 3 && !!rushRow[2]);
ok('r[2] 含由 RUSH_REC_LV 派生的「建议Lv.12」', rushRow[2].includes('建议Lv.' + RUSH_REC_LV), rushRow[2]);
ok('r[2] 既有口径零回归（回血%HP/%MP · 赏金 150+等级×20金）',
  rushRow[2].includes('%HP/') && rushRow[2].includes('%MP') &&
  rushRow[2].includes('全胜另得') && rushRow[2].includes('金'));
{
  const wR2 = estW(rushRow[2], 12);
  ok('试炼三连战行 r[2] 估算宽 ≤470（v21.11 面板预算）', wR2 <= 470, `≈${wR2.toFixed(1)}`);
}
ok('试炼进阶页行数 v21.72 起为 10（记忆碎片行增行；r[2] 追加不增行先例见 v21.46）', page3.length === 10, page3.length);
ok('试炼进阶页 r[2] 仍 2 个（试炼三连战/终焉之神）',
  page3.filter((r) => r && r.length >= 3 && r[2]).length === 2, page3.filter((r) => r && r.length >= 3 && r[2]).length);

// —— drawWorld.js 源级：import + 标签追加 + 旧标签零残留 ——
const wSrc = fs.readFileSync(path.join(ROOT, 'js/view/drawWorld.js'), 'utf8');
ok('drawWorld.js 已 import RUSH_REC_LV', wSrc.includes('RUSH_REC_LV'));
ok('drawWorld.js 碑上标签含「· 建议Lv.${RUSH_REC_LV}」', wSrc.includes('· 建议Lv.${RUSH_REC_LV}'));
ok('drawWorld.js 旧标签（不带建议等级）源级零残留', !wSrc.includes('`⚔️ 试炼三连战 ${roster}` : \'试炼·未解锁\''));
ok('drawWorld.js 含 v21.46 注释（碑上标签补建议等级）', wSrc.includes('v21.46 碑上标签补'));

// —— 运行期实证：drawWorld 试炼碑标签 ready / 未解锁 两态 ——
const origScene = S.scene;
const origHero = S.G;
let drawnCalls = [];
const origFill = CTX.fillText.bind(CTX);
CTX.fillText = (t) => { drawnCalls.push(String(t)); };
try {
  ok('启动引导后 S.G 已建档（新档真实状态）', !!S.G && S.G.level >= 1, S.G && S.G.level);
  loadMap('cave');
  ok('loadMap(cave) 后 G.map 已同步为 cave（碑标签绘制条件成立）', S.G.map === 'cave', S.G.map);
  // ready 态（双徽记）：标签含阵容 + 建议等级 + 通关奖，无「未解锁」
  S.G.bossDefeated = true; S.G.caveBoss = true;
  drawnCalls.length = 0;
  drawWorld();
  const labHit = drawnCalls.find((t) => t.includes('试炼三连战'));
  ok('ready 态碑上标签落画：含阵容（终焉之神Lv12）与「建议Lv.12」',
    !!labHit && labHit.includes('终焉之神Lv12') && labHit.includes('建议Lv.12'), labHit);
  ok('ready 态未画「试炼·未解锁」（双徽记已集齐）',
    !drawnCalls.some((t) => t.includes('试炼·未解锁')));
  ok('ready 态通关奖标签零回归（💰 通关奖 …随等级）',
    drawnCalls.some((t) => t.includes('通关奖') && t.includes('随等级')));
  // 未解锁态：只画「试炼·未解锁」，无建议等级标注
  S.G.bossDefeated = false; S.G.caveBoss = false;
  drawnCalls.length = 0;
  drawWorld();
  ok('未解锁态只画「试炼·未解锁」（无阵容/无建议等级）',
    drawnCalls.some((t) => t.includes('试炼·未解锁')) &&
    !drawnCalls.some((t) => t.includes('建议Lv.')));
} finally {
  CTX.fillText = origFill;
  S.scene = origScene;
  S.G = origHero;
}

// —— README 同步 ——
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
ok('README tests 树收录 smoke_v2146_trialrec', readme.includes('smoke_v2146_trialrec'));
ok('README 件套口径为存活性断言（v21.47 起件数由本版冒烟守护：四十三件套（四十二件套清除））',
  readme.includes('冒烟') && readme.includes('件套') &&
  !readme.includes('（四十一件套清除）'));
ok('README 含 v21.46 守护描述（试炼推荐等级标注守护）', readme.includes('试炼推荐等级标注守护'));
ok('README 星井矿脉行守碑人/系统清单含「建议Lv.12」推荐等级口径', readme.includes('建议Lv.12') && readme.includes('守碑人'));

// —— package.json 收录 ——
const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
ok('package.json 已收录 smoke_v2146_trialrec（npm test 串跑第 42 份）', pkg.includes('smoke_v2146_trialrec.mjs'));

// —— smoke_v2145 的 README 件套口径断言已去硬化（v21.7 惯例）——
const s2145 = fs.readFileSync(path.join(ROOT, 'tests/smoke_v2145_journalscroll.mjs'), 'utf8');
ok('smoke_v2145 的 README 件套口径断言已去硬化（v21.7 惯例：改用存活性口径，旧精确表达式「readme.includes(四十一件套（四十件套清除）)」零残留，实件数由本版冒烟守护）',
  s2145.includes("!readme.includes('（四十件套清除）')") &&
  !s2145.includes("readme.includes('四十一件套（四十件套清除）')"));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
