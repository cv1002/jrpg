// v19.65 专项冒烟：存档槽预览追加累计游玩时长
import { GAME_VERSION } from '../js/data.js';
import { slotPreview, saveKey, newGame } from '../js/core.js';

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

console.log('— v19.65 存档槽累计时长冒烟 —');

// v21.7 修复（版本锚点去硬化）：原断言 GAME_VERSION==='v19.65' 是「一次性」锚点——版本继续递增后必然失败
// （实测 v21.6 下 5/6），且本测试自 v19.65 起从未挂进 npm test、静默腐烂。改为「格式合法 + 已越过 v19.65」
// 的单调断言：随版本递增不再需要每次同步，版本意外回退时仍会立刻报警。
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v19.65', !!_gv && (_gv[0] > 19 || (_gv[0] === 19 && _gv[1] >= 65)));

// 构造一个带 savedAt/time 的档
const hero = newGame('时长测试');
hero.level = 12;
hero.gold = 888;
hero.map = 'dungeon';
hero.diff = 1;
hero.time = 7384; // 2:03:04
mem[saveKey(1)] = JSON.stringify({ G: hero, chests: [], savedAt: Date.now() });

const pv = slotPreview(1);
ok('slotPreview 返回字符串', typeof pv === 'string');
ok('slotPreview 仍含姓名/等级/金币/地图/进度/难度', pv.includes('时长测试') && pv.includes('Lv.12') && pv.includes('金币888') && pv.includes('雾语林') && pv.includes('困难'));
ok('slotPreview 含累计游玩时长 02:03:04', pv.includes('02:03:04'));

// 旧档无 time 字段兼容：按 0 显示 00:00:00
const oldHero = newGame('旧档');
oldHero.level = 3;
oldHero.gold = 100;
oldHero.map = 'village';
delete oldHero.time;
mem[saveKey(2)] = JSON.stringify({ G: oldHero, chests: [], savedAt: Date.now() - 120000 });
const pv2 = slotPreview(2);
ok('旧档无 time 字段不抛错且显示 00:00:00', typeof pv2 === 'string' && pv2.includes('00:00:00'));

// 空槽返回 null
ok('空槽返回 null', slotPreview(9) === null);

console.log(`${n - failed}/${n} 通过`);
if (failed > 0) process.exit(1);
