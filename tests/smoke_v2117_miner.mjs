// v21.17 专项冒烟：星井矿脉新 NPC「老矿工」——v24.114（本套件所守护主线的姊妹件）起升格为
// 第二十八条支线「先撤为敬」委托人（任务页优先于原静态台词；详见 smoke_v24114_fleequest）：
// 数据层（NPCS/NPC_SPOTS/MAPS.extras）+ 阶段台词选段 + 世界落位（loadMap 后 at(2,3)===TY.NPC）
// + 矿脉无泉水事实守护（老矿工的「补给提示」必须与地图事实逐字相符，否则成为误导性文案）+
// 升格后任务契约（npcQuestMark「❕ 可接委托」/resolveNpcTalk 接取「先撤为敬」accept/trueBoss done 分档）。
// 数据只进 data.js（零逻辑改动、零新状态/新计数/新依赖），mark:'pick' 为 sprites.js drawNpcMark 新增纯显示分支。
import { GAME_VERSION, NPCS, NPC_SPOTS, MAPS, TY } from '../js/data.js';
import { S } from '../js/state.js';
import { npcQuestPages, npcQuestMark, resolveNpcTalk } from '../js/quests.js';
import { initGame } from '../js/core.js';
import { loadMap, at } from '../js/world.js';

// core/world 仅在 save/load 时读 localStorage，按 v21.16 冒烟常例仍先铺好桩
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

console.log('— v21.17 老矿工（星井矿脉 · 矿脉生存指南）冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.16 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.16', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 17)), `实际 ${GAME_VERSION}`);

// —— 数据层：NPCS 条目 ——
const miner = NPCS['miner'];
ok('NPCS.miner 存在', !!miner);
ok('NPCS.miner 名称「老矿工」', !!miner && miner.name === '老矿工', miner && miner.name);
ok('NPCS.miner 标记为 pick（矿镐）', !!miner && miner.mark === 'pick', miner && miner.mark);
ok('NPCS.miner 升格后仍保留 linesByStage 三段 + after 两页（零内容丢失契约）', !!miner && !!miner.linesByStage && !!miner.after && miner.linesByStage.length === 3 && miner.after.length === 2);

// —— 数据层：NPC_SPOTS 全局坐标键（跨地图共用，不得撞车）——
ok('NPC_SPOTS[2,3]===miner', NPC_SPOTS['2,3'] === 'miner', NPC_SPOTS['2,3']);
ok('miner 仅占一个坐标键（无重复映射）', Object.keys(NPC_SPOTS).filter((k) => NPC_SPOTS[k] === 'miner').length === 1);
ok('既有 NPC 键未被误动（chief/villager/adventurer/sage/hunter/cartman/guard/clerk/stele×4 全在位）',
  ['13,6', '10,13', '19,8', '12,8', '2,4', '13,9', '3,1', '17,11', '8,5', '5,1', '10,1', '15,1', '20,1']
    .every((k) => NPC_SPOTS[k] != null));

// —— 数据层：MAPS.cave 落位 ——
const caveExtras = MAPS.cave.extras || [];
ok('MAPS.cave.extras 已含 (2,3) NPC', caveExtras.some((e) => e.x === 2 && e.y === 3 && e.ty === 'NPC'),
  JSON.stringify(caveExtras));
ok('MAPS.cave.extras 无 FOUNTAIN（矿脉无泉水是既设事实——老矿工的补给提示不能与地图脱节）',
  !caveExtras.some((e) => e.ty === 'FOUNTAIN'));
ok('MAPS.cave 既有 extras 未被误动（井巫/车夫/终焉水晶/试炼碑）',
  ['3,1', '17,11', '12,11', '18,12'].every((k) => {
    const [x, y] = k.split(',').map(Number);
    return caveExtras.some((e) => e.x === x && e.y === y);
  }));

// —— 阶段台词：linesByStage 三段 + after（数据层全量保留，升格后 npcQuestPages 优先走任务页）——
const st = miner.linesByStage;
ok('linesByStage 共 3 段', Array.isArray(st) && st.length === 3, String(st && st.length));
ok('三段 gate 依次为 null / bossDefeated / caveBoss',
  st[0].gate === null && st[1].gate === 'bossDefeated' && st[2].gate === 'caveBoss');
ok('每段均为 2 页且含 [Enter] 继续/结束 收尾', st.every((s) =>
  s.lines.length === 2 &&
  s.lines[0].some((l) => l.includes('[Enter] 继续')) &&
  s.lines[1].some((l) => l.includes('[Enter] 结束'))));
ok('after 彩蛋 2 页（trueBoss 后台词，npcQuestPages 同源读取）',
  Array.isArray(miner.after) && miner.after.length === 2);
ok('数据层保留「没有泉水/旅店」补给提示（与地图事实相符）与药水补给地点',
  st[0].lines.flat().join('').includes('没有泉水') && st[0].lines.flat().join('').includes('雾语林营地那口泉'));
ok('数据层保留水晶双徽记提示',
  st[0].lines.flat().join('').includes('两枚徽记'));

function flat(pages) { return pages.flat().join(''); }
// v24.114 升格契约：npcQuestPages 有任务后优先走任务页（talk.offer/active/turnin/done 四态）
ok('v24.114 升格后无存档走 offer 任务页（先撤为敬 + 接下委托）',
  !!npcQuestPages({}, 'miner') && flat(npcQuestPages({}, 'miner')).includes('先撤为敬') &&
  flat(npcQuestPages({}, 'miner')).includes('接下委托'),
  JSON.stringify(npcQuestPages({}, 'miner')).slice(0, 160));
ok('v24.114 起有可接支线：npcQuestMark===「❕ 可接委托」（先撤为敬·老矿工为委托人）',
  npcQuestMark({}, 'miner') === '❕ 可接委托', npcQuestMark({}, 'miner'));
ok('trueBoss 已交付走 done 分档（矿洞里亮堂了 + 喝口井水再走，after 彩蛋零内容丢失）',
  (() => { const p = npcQuestPages({ quests: { side_flee: 'done' }, trueBoss: true }, 'miner');
    const t = flat(p); return t.includes('矿洞里亮堂了') && t.includes('喝口井水再走'); })());
ok('台词不含 emoji（与既有 NPC 文案同风格）',
  ![...flat(npcQuestPages({}, 'miner'))].some((ch) => {
    const cp = ch.codePointAt(0);
    return (cp >= 0x1f000 && cp <= 0x1faff);
  }));

// —— 升格后 resolveNpcTalk 接取契约（任务页优先于 linesByStage）——
ok('结算契约：resolveNpcTalk 接取「先撤为敬」→ accept/side_flee', (() => {
  const r = resolveNpcTalk({ quests: {}, gold: 0, item: 0, level: 1, flees: 0 }, 'miner');
  return !!r && r.kind === 'accept' && r.id === 'side_flee';
})());

// —— 世界落位：loadMap('cave') 后 (2,3) 真为 NPC，邻近关键点未受影响 ——
initGame('冒烟');
loadMap('cave');
ok('loadMap(cave) 后 at(2,3)===TY.NPC', at(2, 3) === TY.NPC, `实际 ${at(2, 3)}`);
ok('井巫 at(3,1) / 车夫 at(17,11) / 水晶 at(12,11) / 试炼碑 at(18,12) 仍在位',
  at(3, 1) === TY.NPC && at(17, 11) === TY.NPC && at(12, 11) === TY.SB && at(18, 12) === TY.TRIAL);
ok('矿脉入口安全带未受影响（exit/replaceTiles 区域仍可达）', at(1, 1) === TY.EXIT);

// —— 宽度预算（纯估算，零依赖；系数沿 v21.11/v21.13/v21.14 官方冒烟标定口径）——
const estW = (s, size) => {
  let wsum = 0;
  for (const ch of String(s || '')) {
    const code = ch.codePointAt(0);
    const wide = (code >= 0x2e80 && code <= 0x9fff) || (code >= 0x3000 && code <= 0x303f) || (code >= 0xff00 && code <= 0xffef) || code >= 0x1f000;
    if (wide) wsum += 0.865 * size;
    else if (code === 0xb7) wsum += 0.303 * size;
    else if (code === 0x2d) wsum += 0.432 * size;
    else if (code === 0x20) wsum += 0.263 * size;
    else wsum += 0.55 * size;
  }
  return wsum;
};
const TALK_MAX = 440; // drawTalk MAX_W = bx+bw-24-TX_X = 40+560-24-136
let widthOk = true;
const allMinerLines = [...st.flatMap((s) => s.lines), ...miner.after].flat();
for (const line of allMinerLines) {
  const w = estW(line, 15);
  if (w > TALK_MAX) { widthOk = false; console.log('    <- 超宽台词行:', line, Math.round(w)); }
}
ok(`全部 ${allMinerLines.length} 条台词估算宽 ≤${TALK_MAX}（对话框 MAX_W，超宽由 wrapTalkLine 兜底但不应常态触发）`, widthOk);

// —— 附录：sprites.js 的 mark:'pick' 分支已存在（源码级守护）——
const spritesOk = await (async () => {
  try {
    const fs = await import('node:fs');
    const txt = fs.readFileSync(new URL('../js/view/sprites.js', import.meta.url), 'utf8');
    return txt.includes("mark==='pick'") && txt.includes('老矿工');
  } catch { return false; }
})();
ok('sprites.js 已含 mark pick 分支（矿镐程序化绘制）', spritesOk);

// —— README 同步守护（v21.7 去硬化惯例：件数随版本递增，数字写死必然脱节——本次 13→14 即触发其失败，
// 原「十三件套/十二件套」断言降级为「冒烟/件套」存在性，实件数由最新版冒烟（smoke_v2118）守护 README 口径）——
const readmeOk = await (async () => {
  try {
    const fs = await import('node:fs');
    const txt = fs.readFileSync(new URL('../README.md', import.meta.url), 'utf8');
    return txt.includes('老矿工') && txt.includes('smoke_v2117_miner') &&
      txt.includes('冒烟') && txt.includes('件套');
  } catch { return false; }
})();
ok('README 已同步（矿脉条目含老矿工 + tests 树收录 smoke_v2117_miner + 冒烟/件套口径存在）', readmeOk);

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
