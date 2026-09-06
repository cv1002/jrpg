// v21.24 专项冒烟：星井矿脉试炼碑旁新 NPC「守碑人」——数据层（NPCS/NPC_SPOTS/MAPS.extras）
// + 函数型 lines（台词由 RUSH_* 试炼常量派生，调用期按 hero.level 重算）+ trueBoss 彩蛋 after。
// 仓库常驻版（承 v21.10 起冒烟入库先例 + v21.17 老矿工同款 NPC 契约）。
// 背景：全图四大关键地标（镇/雾语林矿祭坛/终焉水晶/无字回廊）旁各有 NPC 指路，唯独星井矿脉
// 试炼碑只靠 H 页「试炼进阶」与碑上刻字——v21.23 帮 H 页补齐三 Boss 机制预览后，碑旁仍无人在场守望；
// 本版新增「守碑人」：纯闲聊 NPC（无任务），两句台词全部从 RUSH_RECOVER / RUSH_BASE_GOLD /
// RUSH_GOLD_PER_LV / RUSH_BOSSES 派生（试炼恢复/赏金/三连战阵容单一数据源），调试炼数值只改 data.js
// 一处、对话自动跟随，绝无第二套口径。
import { GAME_VERSION, NPCS, NPC_SPOTS, MAPS, RUSH_RECOVER, RUSH_BASE_GOLD, RUSH_GOLD_PER_LV, RUSH_BOSSES } from '../js/data.js';
import { npcQuestPages } from '../js/quests.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.24 试炼碑旁守碑人冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.23 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.23', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 23)));

// —— 数据层：NPC_SPOTS 全局坐标键（跨地图共用，不得撞车）——
ok('NPC_SPOTS[17,12]===sentinel', NPC_SPOTS['17,12'] === 'sentinel', NPC_SPOTS['17,12']);
ok('sentinel 仅占一个坐标键（无重复映射）', Object.keys(NPC_SPOTS).filter((k) => NPC_SPOTS[k] === 'sentinel').length === 1);
ok('既有 NPC 键未被误动（含 v21.17 miner）',
  ['13,6', '10,13', '19,8', '12,8', '2,4', '13,9', '3,1', '2,3', '17,11', '8,5', '5,1', '10,1', '15,1', '20,1']
    .every((k) => NPC_SPOTS[k] != null));

// —— 数据层：MAPS.cave 落位 + 全局坐标防撞演练 ——
const caveExtras = MAPS.cave.extras || [];
ok('MAPS.cave.extras 已含 (17,12) NPC', caveExtras.some((e) => e.x === 17 && e.y === 12 && e.ty === 'NPC'),
  JSON.stringify(caveExtras));
ok('MAPS.cave 既有 extras 未被误动（井巫/老矿工/车夫/终焉水晶/试炼碑）',
  ['3,1', '2,3', '17,11', '12,11', '18,12'].every((k) => {
    const [x, y] = k.split(',').map(Number);
    return caveExtras.some((e) => e.x === x && e.y === y);
  }));
ok('(17,12) 仅 cave 一处放 NPC（他图同坐标无 NPC/占用）',
  Object.entries(MAPS).every(([k, v]) =>
    k === 'cave' || !(v.extras || []).some((e) => e.x === 17 && e.y === 12)));
ok('试炼碑仍在 (18,12)·守碑人贴在碑旁', caveExtras.some((e) => e.x === 18 && e.y === 12 && e.ty === 'TRIAL'));
ok('(17,12) 双侧可行走站位（16,12 / 18,13 均为 0 地面）',
  MAPS.cave.rows[12][16] === '0' && MAPS.cave.rows[13][18] === '0');

// —— 数据层：NPCS.sentinel 契约（函数型 lines + after 彩蛋）——
const sent = NPCS.sentinel;
ok('sentinel 名称为「守碑人」', sent && sent.name === '守碑人', sent && sent.name);
ok('lines 为函数（调用期派生台词）', sent && typeof sent.lines === 'function');
ok('after 彩蛋 2 页（trueBoss 后台词）', sent && Array.isArray(sent.after) && sent.after.length === 2);

function flat(pages) { return (pages || []).flat().join(''); }

// —— 派生台词：与 RUSH_* 常量逐值同源（期望值全部由 data.js 真源复算，非快照）——
const NAMES = RUSH_BOSSES.map((b) => b.name);
const hpPct = Math.round(RUSH_RECOVER.hp * 100);
const mpPct = Math.round(RUSH_RECOVER.mp * 100);
ok('真源健全：恢复比例/奖金基数为正数', RUSH_RECOVER.hp > 0 && RUSH_RECOVER.mp > 0 && RUSH_BASE_GOLD > 0 && RUSH_GOLD_PER_LV > 0);
const pLv10 = npcQuestPages({ level: 10 }, 'sentinel');
ok('默认对话 2 页（含 [Enter] 继续/结束 收尾）',
  Array.isArray(pLv10) && pLv10.length === 2 &&
  pLv10[0].some((l) => l.includes('[Enter] 继续')) &&
  pLv10[1].some((l) => l.includes('[Enter] 结束')), JSON.stringify(pLv10 && pLv10.length));
ok('页 1 列全三连战阵容（与 RUSH_BOSSES 同源）', NAMES.every((nm) => flat(pLv10).includes(nm)));
ok(`关间恢复 ${hpPct}%HP/${mpPct}%MP 与 RUSH_RECOVER 同源`, flat(pLv10).includes(`${hpPct}%HP/${mpPct}%MP`),
  flat(pLv10).match(/\d+%HP\/\d+%MP/)?.[0]);
ok(`Lv.10 赏金 ${RUSH_BASE_GOLD + 10 * RUSH_GOLD_PER_LV} 金与 RUSH 公式同式`,
  flat(pLv10).includes(`${RUSH_BASE_GOLD + 10 * RUSH_GOLD_PER_LV} 金`),
  flat(pLv10).match(/\d+ 金/)?.[0]);
ok('页 2 含三 Boss 机制提示（真身/石甲/封印治愈）',
  flat(pLv10).includes('血过半现真身') && flat(pLv10).includes('石甲加身') && flat(pLv10).includes('封印'));
ok(`Lv.12 重算为 ${RUSH_BASE_GOLD + 12 * RUSH_GOLD_PER_LV} 金（调用期按 hero.level 求值）`,
  flat(npcQuestPages({ level: 12 }, 'sentinel')).includes(`${RUSH_BASE_GOLD + 12 * RUSH_GOLD_PER_LV} 金`));
ok(`等级缺省（空 hero）按 Lv.1 兜底 ${RUSH_BASE_GOLD + RUSH_GOLD_PER_LV} 金`,
  flat(npcQuestPages({}, 'sentinel')).includes(`${RUSH_BASE_GOLD + RUSH_GOLD_PER_LV} 金`));

// —— trueBoss 彩蛋优先（npcQuestPages 既有契约：after > lines）——
const epi = npcQuestPages({ trueBoss: true, level: 10 }, 'sentinel');
ok('trueBoss 后返回 after 彩蛋 2 页', Array.isArray(epi) && epi.length === 2 && flat(epi).includes('三场都胜了'));

// —— 零回归：静态 NPC / linesByStage / 未知 NPC 契约逐字不变 ——
const vil = npcQuestPages({}, 'villager');
ok('villager 仍为静态数组 2 页（非函数路径）', Array.isArray(vil) && vil.length === 2 && typeof vil !== 'function' && flat(vil).includes('雾语林深处那口泉水'));
ok('miner linesByStage 仍按旗标选段', flat(npcQuestPages({ bossDefeated: true }, 'miner')).includes('星砂扣下'));
ok('未知 NPC 仍回退 [……]', Array.isArray(npcQuestPages({}, 'nobody')) && flat(npcQuestPages({}, 'nobody')) === '……');

// —— 源码级守护：quests.js 函数型分支 + sprites.js 造型映射落地 ——
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const qSrc = fs.readFileSync(path.join(ROOT, 'js/quests.js'), 'utf8');
const sSrc = fs.readFileSync(path.join(ROOT, 'js/view/sprites.js'), 'utf8');
ok('quests.js 含函数型 lines 分支', qSrc.includes("typeof ent.lines === 'function'"));
ok('sprites.js NPC 造型映射含 sentinel', /sentinel:\s*'mwSage'/.test(sSrc));

console.log(`\n${n - failed}/${n} 通过`);
process.exit(failed ? 1 : 0);
