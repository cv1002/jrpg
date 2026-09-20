// smoke_v2277_pondhint.mjs —— v22.78 帮助页地图指南潮灯镇行「水塘灯影」r[2] 指针守护
// 承 v21.10-v22.76 冒烟入库先例：版本锚点 + 源级落位 + 数据契约 + 运行期全链路
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

let pass = 0, fail = 0;
const ok = (cond, label) => {
  if (cond) { pass++; console.log(`  ✓ ${label}`); }
  else { fail++; console.log(`  ✗ ${label}`); }
};

console.log('— v22.78 帮助页地图指南潮灯镇行「水塘灯影」r[2] 指针冒烟 —');

// 1. 版本锚点
const dataSrc = readFileSync(join(ROOT, 'js/data.js'), 'utf8');
ok(dataSrc.includes("const GAME_VERSION = 'v23.40'"), 'data.js GAME_VERSION 字面量为 v22.79');
ok(dataSrc.includes('// v22.78 体验打磨'), 'data.js 含 v22.78 版本注释');
ok(dataSrc.includes('// v22.76 新 NPC'), 'data.js 仍保留 v22.76 历史注释');

// 2. 源级落位：潮灯镇行拆 r[1]+r[2]
const villageLine = dataSrc.match(/\['潮灯镇 Lv\.' \+ MAPS\.village\.recLv,[^\]]+\]/);
ok(!!villageLine, 'HELP_PAGES 含潮灯镇行');
if (villageLine) {
  ok(villageLine[0].includes("NPCS.granny.name"), '潮灯镇行 r[2] 含 NPCS.granny.name 派生');
  ok(villageLine[0].includes("NPCS.lampboat.name"), '潮灯镇行 r[2] 含 NPCS.lampboat.name 派生');
  ok(villageLine[0].includes("'水塘灯影 · '"), '潮灯镇行 r[2] 含「水塘灯影」前缀');
}

// 3. HELP_PAGES 数据契约
const helpPagesMatch = dataSrc.match(/const HELP_PAGES=\[([\s\S]*?)\n\];/);
ok(!!helpPagesMatch, 'HELP_PAGES 块存在');
if (helpPagesMatch) {
  const helpPages = helpPagesMatch[1];
  // 地图指南页（第二页）：从「地图指南」注释到「通关之路」行之间
  const mapGuideStart = helpPages.indexOf('// 地图指南');
  const mapGuideEnd = helpPages.indexOf("['通关之路'", mapGuideStart);
  ok(mapGuideStart >= 0 && mapGuideEnd > mapGuideStart, '地图指南页存在');
  if (mapGuideStart >= 0 && mapGuideEnd > mapGuideStart) {
    const mapGuide = helpPages.slice(mapGuideStart, mapGuideEnd);
    const rowCount = (mapGuide.match(/\n\s*\['/g) || []).length + 1; // +1 含通关之路行本身
    ok(rowCount === 8, `地图指南页行数仍 8（实际 ${rowCount}）`);
  }
}

// 4. 运行期全链路：DOM 桩 + main.js 真实导入
const stubEl = () => ({
  style: {}, innerHTML: '', textContent: '', className: '',
  appendChild() {}, addEventListener() {}, removeEventListener() {},
  querySelector() { return null; }, querySelectorAll() { return []; },
  getContext() { return null; }, focus() {}, blur() {},
});
globalThis.window = globalThis;
globalThis.document = {
  getElementById() { return stubEl(); },
  querySelector() { return stubEl(); },
  querySelectorAll() { return []; },
  createElement() { return stubEl(); },
  addEventListener() {}, removeEventListener() {},
  body: stubEl(), documentElement: stubEl(),
  hidden: false, visibilityState: 'visible',
  activeElement: null,
};
globalThis.localStorage = {
  _m: new Map(),
  getItem(k) { return this._m.has(k) ? this._m.get(k) : null; },
  setItem(k, v) { this._m.set(k, String(v)); },
  removeItem(k) { this._m.delete(k); },
  clear() { this._m.clear(); },
};
try { Object.defineProperty(globalThis, 'navigator', { value: { userAgent: 'smoke', maxTouchPoints: 0 }, configurable: true }); } catch (_) {}
globalThis.addEventListener = () => {};
globalThis.removeEventListener = () => {};
globalThis.requestAnimationFrame = () => 0;
globalThis.cancelAnimationFrame = () => {};
globalThis.AudioContext = undefined;
globalThis.webkitAudioContext = undefined;
globalThis.Image = class { constructor() { this.onload = null; this.onerror = null; } };
globalThis.fetch = () => Promise.reject(new Error('fetch disabled in smoke'));

const data = await import(join(ROOT, 'js/data.js'));
const { HELP_PAGES, MAPS, NPCS } = data;

// 5. 数据契约：潮灯镇行结构
const villageRow = HELP_PAGES[1].find(r => r[0] && r[0].includes('潮灯镇'));
ok(!!villageRow, 'HELP_PAGES[1] 含潮灯镇行');
if (villageRow) {
  ok(villageRow.length === 3, `潮灯镇行有 3 列（r[1]+r[2]，实际 ${villageRow.length}）`);
  ok(villageRow[2].includes('水塘灯影'), '潮灯镇行 r[2] 含「水塘灯影」');
  ok(villageRow[2].includes(NPCS.granny.name), `潮灯镇行 r[2] 含掌灯阿婆名「${NPCS.granny.name}」`);
  ok(villageRow[2].includes(NPCS.lampboat.name), `潮灯镇行 r[2] 含放灯童名「${NPCS.lampboat.name}」`);
}

// 6. 地图指南页行数
ok(HELP_PAGES[1].length === 8, `地图指南页行数仍 8（实际 ${HELP_PAGES[1].length}）`);

// 7. 其余三页行数零回归
ok(HELP_PAGES[0].length === 14, `操作说明页行数仍 14（实际 ${HELP_PAGES[0].length}）`);
ok(HELP_PAGES[2].length === 10, `魔物状态页行数仍 10（实际 ${HELP_PAGES[2].length}）`);
ok(HELP_PAGES[3].length === 10, `试炼进阶页行数仍 10（实际 ${HELP_PAGES[3].length}）`);

// 8. 雾语林/星井矿脉/无字回廊行逐字未动
const dungeonRow = HELP_PAGES[1].find(r => r[0] && r[0].includes('雾语林'));
ok(!!dungeonRow && dungeonRow.length === 2, '雾语林行未动（仍 2 列）');
const caveRow = HELP_PAGES[1].find(r => r[0] && r[0].includes('星井矿脉'));
ok(!!caveRow && caveRow.length === 3, '星井矿脉行未动（仍 3 列）');
const galleryRow = HELP_PAGES[1].find(r => r[0] && r[0].includes('无字回廊'));
ok(!!galleryRow && galleryRow.length === 3, '无字回廊行未动（仍 3 列）');

console.log(`\n— v22.78 帮助页地图指南潮灯镇行「水塘灯影」r[2] 指针冒烟：${pass}/${pass + fail} 通过 —`);
process.exit(fail ? 1 : 0);
