// v21.6 专项冒烟：快速旅行防误触——选中「当前所在地」不再重载地图丢回入口（仓库常驻版）
import { GAME_VERSION, TRAVEL_LIST } from '../js/data.js';
import { S, curMap } from '../js/state.js';
import { newGame, doTravel } from '../js/core.js';
import { loadMap } from '../js/world.js';
import { drawTravel } from '../js/view/menus.js';

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

console.log('— v21.6 快速旅行防误触冒烟 —');

// v21.7 修复（版本锚点去硬化）：原「GAME_VERSION===v21.6」是「一次性」锚点，版本递增到 v21.7 后必然失败；
// 改为「格式合法 + 已越过 v21.6」的单调断言——随版本递增免维护，版本意外回退仍会报警。
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.6', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 6)));

// 场景：站在雾语林中段（非入口），全部已到访，选中「当前所在地」
S.G = newGame('旅行测试');
S.scene = 'world';
loadMap('dungeon');
S.G.visited = ['village', 'dungeon'];
S.G.x = 9; S.G.y = 9;
const start = { x: S.G.x, y: S.G.y };

S.travelSel = TRAVEL_LIST.findIndex((t) => t[0] === 'dungeon');
ok('旅行列表含当前地图行', S.travelSel >= 0 && TRAVEL_LIST[S.travelSel][0] === 'dungeon');
doTravel();
ok('同图传送被拦截：地图不变', curMap() === 'dungeon');
ok('同图传送被拦截：位置不变（不再丢回入口）', S.G.x === start.x && S.G.y === start.y);
ok('同图传送被拦截：visited 不变', S.G.visited.join(',') === 'village,dungeon');

// 反向：同图拦截后，换选其它已到访地图仍正常传送
S.travelSel = TRAVEL_LIST.findIndex((t) => t[0] === 'village');
doTravel();
ok('其它已到访地图仍可传送', curMap() === 'village');
ok('传送落位目标图入口', S.G.x > 0 || S.G.y > 0);

// 未探索地图仍被拦截（既有行为逐字保留）
loadMap('village');
S.scene = 'world';
S.G.visited = ['village'];
S.G.x = 5; S.G.y = 5;
S.travelSel = TRAVEL_LIST.findIndex((t) => t[0] === 'gallery');
doTravel();
ok('未探索地图仍被拦截', curMap() === 'village' && S.G.x === 5 && S.G.y === 5);

// curMap 与 G.map 同源（状态单一真相）
ok('curMap 与 G.map 同源', curMap() === S.G.map);

// 旅行界面绘制不抛错（Node stub 画布）
S.scene = 'travel';
S.travelSel = 0;
let drew = true;
try { drawTravel(); } catch (e) { drew = false; console.log('   drawTravel:', e.message); }
ok('drawTravel 绘制不抛错', drew);

console.log(`${n - failed}/${n} 通过`);
if (failed > 0) process.exit(1);
