// ============================================================
// view/menus.js —— 商店 / 状态 / 标题等界面
// ============================================================
import { S, curMap } from '../state.js';
import { GAME_VERSION, MAPS, SKILL_DATA, BESTIARY_TARGET, HELP_PAGES, HELP_TITLES, TRAVEL_LIST, ENDING, ENDING_TRUE, ENDING_TRUE_FRAG, STORY, HERO_NAMES, NAME_FLAVOR, DIFFS, WEAPONS, ARMORS, ACH_LIST, NPCS, BOSS, baseStats, CHARGE_MULT, codexTag, DIFF_SCALE, INN_PRICE, BREW_MUSHROOMS, BREW_GOLD, POTION_CAP, ELIXIR_HP_PCT, ELIXIR_MP_PCT, FRAGMENTS, LEVEL_GROWTH, CRIT_RATE, CRIT_MULT, ELITE_CHANCE, ELITE_GOLEM, SAVE_SLOTS, UI_PULSE_MS, TREASURE_GOAL, chestCount, chestTotal, hasRecoveryPoint } from '../data.js';
import { monReward, skillEstimate, codexStats, spawnLv, pageShownAt, wrapTalkLine } from '../rules.js';
import { hasSlot, hasSave, slotPreview, skillXpHint } from '../core.js';
import { questLines, questJournal, questRewardPreview, adventureProgress, QUEST_TAG, questKillProg } from '../quests.js';
import { CV, CTX, rr, panel, text, hpbar, fmtTime } from './canvas.js';
import { drawWorld } from './drawWorld.js';
import { drawMonster, drawNpcSprite } from './sprites.js';
import { TILE } from './tiles.js';
import { SFX } from '../audio.js';
import { bind } from '../bind.js';
import { boxMsg } from './hud.js';

export function drawShop(){
  const hero = S.G;
  drawWorld(); panel(60,50,520,360,'杂货商店');
  text('💰 '+hero.gold+' 金币',520,80,'14px','#ffd24a','right');
  S.shopList.forEach((it,i)=>{
    const sel=i===S.shopSel;
    let afford=true;
    if(it.kind==='potion'||it.t.startsWith('🍖')) afford=(hero.gold>=it.price&&hero.item<POTION_CAP);
    else if(it.price>0) afford=hero.gold>=it.price;
    if(it.blocked) afford=false;
    if(sel){ CTX.fillStyle='rgba(255,210,74,.15)'; rr(70,96+i*38,500,32,6); CTX.fill(); }
    const col=sel?'#ffd24a':(!afford?'#7d93a3':(it.up?'#8ff0a0':'#e8eef1'));
    text((sel?'▶':' ')+' '+it.t,86,118+i*38,'15px',col);
    if(it.price>0){
      // 购买差价提示（信息透明·纯显示）：延续 v3.13 旅馆「还差 N 金」/ v3.14 酿造差额 / v14.2 技能
      // MP「还差 N」同一短缺口径——此前买不起只笼统写「（不足）」，差 5 金还是差 500 金要自己心算；
      // 直接报出差额（gold<price 时），背包满（药水背包上限 POTION_CAP=99）则如实标注「背包满」，零结算变化
      const lack = (!afford && hero.gold < it.price) ? `（还差 ${it.price-hero.gold} 金）`
        : (!afford && it.t.startsWith('🍖')) ? '（背包满）' : '';
      text(it.price+'💰'+lack,560,118+i*38,'13px',afford?'#62c6ff':'#e14b3f','right');
    }
  });
  text('绿色▲=更强升级 灰色=买不起 · ↑↓选择  Enter/E购买  Esc离开',320,470,'12px','#7d93a3','center');
}

export function drawInn(){
  const hero = S.G;
  drawWorld(); panel(120,70,400,280,'🏨 旅店');
  text('住一晚可恢复全部 HP/MP',320,130,'15px','#e8eef1','center');
  text(`价格：${INN_PRICE} 金币  (💰${hero.gold})`,320,168,'14px','#ffd24a','center');
  text(`当前   HP ${hero.hp}/${hero.hpMax}   MP ${hero.mp}/${hero.mpMax}`,320,202,'14px','#e8eef1','center');
  if(hero.hp<hero.hpMax||hero.mp<hero.mpMax){
    text(`今晚将恢复   HP +${Math.max(0,hero.hpMax-hero.hp)}   MP +${Math.max(0,hero.mpMax-hero.mp)}`,320,228,'14px','#62c6ff','center');
    if(hero.gold<INN_PRICE) text(`💰 金币不足（还差 ${INN_PRICE-hero.gold} 金），无法入住！`,320,254,'14px','#e14b3f','center');
  } else text('你现在精神饱满，不需要休息。',320,228,'14px','#7d93a3','center');
  text('[Enter/E] 住宿休息   [Esc] 离开',320,275,'13px','#7d93a3','center');
}

export function drawBrew(){
  const hero = S.G;
  drawWorld(); panel(100,80,440,300,'🧪 药水酿造');
  text(`魔法蘑菇 ${hero.mushrooms} 株    金币 ${hero.gold}    已酿灵药 ${hero.potion2||0} 瓶`,320,140,'15px','#e8eef1','center');
  text(`配方：${BREW_MUSHROOMS} 株魔法蘑菇 + ${BREW_GOLD} 金币 → 高级灵药 ×1`,320,180,'14px','#ffd24a','center');
  // 灵药描述由 ELIXIR_* 常量推导（v16.1 收口结算/战斗预览/商店文案时漏掉的最后一处旧字面量）：与 takePotion 逐字同源
  text(`高级灵药：恢复 ${Math.round(ELIXIR_HP_PCT * 100)}% HP + ${Math.round(ELIXIR_MP_PCT * 100)}% MP`,320,210,'13px','#7d93a3','center');
  // v23.17 酿造界面补「还可酿造 N 瓶」（体验打磨·信息透明·纯显示）：材料行与配方行早已量化，
  // 但「这些材料一共还能酿几瓶」要玩家心算 min(蘑菇÷2, 金币÷10)——采菇归来/支线交奖后站在锅前，
  // 想确认「要不要现在多酿几瓶」只能逐次按 Enter 试；现由 BREW_MUSHROOMS/BREW_GOLD 单一数据源
  // 派生计数（与 brewNow 结算判定同读一份源、零裸字面量），可酿 0 瓶时零噪音不显示（材料不足
  // 红字已覆盖该语义），纯显示零结算零存档零数值变化。
  const _canBrew = Math.min(Math.floor((hero.mushrooms || 0) / BREW_MUSHROOMS), Math.floor((hero.gold || 0) / BREW_GOLD));
  if (_canBrew > 0) text(`当前材料还可酿造 ${_canBrew} 瓶`, 320, 236, '13px', '#8ff0a0', 'center');
  if(hero.mushrooms>=BREW_MUSHROOMS&&hero.gold>=BREW_GOLD) text('按 Enter/E 酿造    按 Esc 离开',320,262,'14px','#62c6ff','center');
  else text(`材料不足（还差 ${Math.max(0,BREW_MUSHROOMS-hero.mushrooms)} 株蘑菇、${Math.max(0,BREW_GOLD-hero.gold)} 金币）    按 Esc 离开`,320,262,'13px','#e14b3f','center');
}

// 冒险进度徽记行距（单一数据源，纯显示）：drawStatus 徽记行 190+i*SP——v13.7 四幕重构把徽记从四格
// 增到五格（灯芯/星井/回廊/初灯/试炼场）时仍按四格 88px 步距排布，第 5 格「✓ 试炼场」x=542、
// 12px 字形宽 @napi-rs/canvas 实测 ≈41px（浏览器含 ✓ 全宽字形 ≈47px），右缘 583–589 越过面板右缘
// 570（panel(70,28,500,424)），徽记压出面板——「面板内侧一切文字必须落在面板内」主线在状态页的
// 漏网之鱼（v19.59/v21.11/v21.12 体检了三块版面，状态页徽记行从未做横向体检）。现改按徽记数派生：
// 可用宽 = 面板右缘 570 − 起点 190 − 预留 60（最宽徽记「✓ 试炼场」实宽 ≈47px + 13px 余量），
// n=5 → 80（第 5 格 x=510，右缘 ≈557 ≤570，余量 ≥13px）；n≤4 → min(88, …)=88 与旧布局逐值一致；
// n≥6 自动收紧不复发（与 v21.12 travelFootY 同一「派生化防回归」族，新增徽记忘记调行距也不会再压出）。
export function progressSpacing(n) {
  const X0 = 190, RIGHT = 570, RESERVE = 60;
  return Math.min(88, Math.floor((RIGHT - X0 - RESERVE) / Math.max(1, (n || 1) - 1)));
}

export function drawStatus(){
  const hero = S.G;
  drawWorld(); panel(70,28,500,424,'— 状态 —');
  const b=baseStats(hero.level);
  text(`${hero.name}  Lv.${hero.level}  ${hero.diff?`[困难 · 魔物HP×${DIFF_SCALE.hp} 攻×${DIFF_SCALE.atk} 防×${DIFF_SCALE.def}]`:''}`,320,72,'bold 18px','#ffd24a','center');
  // v19.89 状态页追加当前地图与区域难度（信息透明·纯显示）：此前按 I 看状态时看不到「我现在在哪张图、
  // 这张图推荐多少级、区域难度标签」——玩家常常忘记当前地图名或不确定是否越级探索；
  // 现与快速旅行/世界 transition 同读 data.js MAPS[].name / recLv / zone.label，纯显示零结算，
  // 地图数据调整时此处自动跟随。
  const mapKey=curMap();
  const mapDef=MAPS[mapKey]||{};
  const zoneLabel=mapDef.zone&&mapDef.zone.label?`（${mapDef.zone.label}）`:'';
  text(`📍 ${mapDef.name||mapKey}${zoneLabel} · 推荐 Lv.${mapDef.recLv||'?'}`,320,82,'12px','#7d93a3','center');
  text(`经验 ${hero.xp} / ${hero.xpNext} · 距升级还差 ${Math.max(0,(hero.xpNext||0)-(hero.xp||0))} 经验`,320,98,'13px','#e8eef1','center');
  CTX.fillStyle='#122029'; rr(180,106,280,10,5); CTX.fill();
  CTX.fillStyle='#62c6ff'; rr(180,106,Math.max(0,280*(hero.xp/hero.xpNext)),10,5); CTX.fill();
  text('HP',110,140,'bold 15px','#e14b3f'); hpbar(140,132,150,hero.hp,hero.hpMax,'#e14b3f');
  text('MP',110,164,'bold 15px','#3f8fe1'); hpbar(140,156,150,hero.mp,hero.mpMax,'#3f8fe1');
  text('攻击',110,196,'14px'); text(`${b.atk} +${WEAPONS[hero.weapon].atk} = ${hero.atkMax}`,150,196,'bold 14px','#e8eef1');
  // 暴击率透明度（信息透明·纯显示）：与 battle.js doAttack 的 crit 判定、attackMove 的 ×N 加成
  // 同读 data.js CRIT_RATE/CRIT_MULT（单一数据源，文案由常量推导，绝无第二套口径）——
  // README 早已写明「蓄力与暴击可叠加」，但游戏内从没提过普攻会暴击——状态页一眼看清这 12% 的隐藏加成
  text('· 普攻' + Math.round(CRIT_RATE * 100) + '%暴击 ×' + CRIT_MULT, 288, 196, '11px', '#e8a858');
  text('防御',110,218,'14px'); text(`${b.def} +${ARMORS[hero.armor].def} = ${hero.defMax}`,150,218,'bold 14px','#e8eef1');
  text(`武器：${hero.weapon}    防具：${hero.armor}`,110,242,'14px');
  // v19.72 状态页资源总览追加宝箱计数（信息透明·纯显示）：v19.40 补齐蘑菇后资源行仍缺「已开几个宝箱」——
  // 宝箱是探索深度指标（成就「开箱寻宝」阈值 ${TREASURE_GOAL}），玩家按 I 看状态时理应一眼看到进度；
  // 计数同源于 data.js chestCount(hero) / TREASURE_GOAL，与成就判定/图鉴累计掉落同源，纯显示零结算。
  // v21.22 分母改读 chestTotal()（全图宝箱总数单一数据源）：此前只标「X/6」成就进度，玩家不知道全图
  // 一共几只箱、还剩几只没开——扫箱规划（v19.47 小地图暖金）缺全图总量这块拼图；现并列「已开 X/全图 N」
  // 与「成就 X/M」双口径，去掉「6/12 像开关 12 只」的歧义（6 是成就目标、12 是全图总数，各自与
  // TREASURE_GOAL / chestTotal() 同源，调任一阈值只改 data.js 一处）。纯显示零结算，行宽 estW 预算内。
  // v21.94 资源行补图鉴进度（信息透明·纯显示，承 v21.79 标题预览/v21.82 胜利画面/v21.87 尾声同一
  // 「收集三件套」主线）：三处 run 总结屏的成就·图鉴·宝箱三件套齐备，唯独 I 状态页有 📦 宝箱/⏱ 时长
  // 却无图鉴——玩家按 I 看「这趟收集到哪了」，图鉴 N/13 还得再开 B 页才能看到；现与 slotPreview/drawWin/
  // drawEnding 同读 BESTIARY_TARGET 一份单一数据源（|0 归一防御式，旧布尔 bestiary 零迁移），补
  // 「📕 图鉴 N/13」。纯显示零结算零存档变化；行宽实测（@napi-rs/canvas 14px 最宽组合）≈512 ≤ 面板
  // 右缘 570（smoke_v2122 预算断言随新现实更新）。
  // v22.1 资源行补记忆碎片计数（体验打磨·信息透明，承 v21.94 同一主线）：资源总览行有 金币/🍖/🧪/🍄/
  // 📕图鉴/📦宝箱·成就/⏱时长，唯独真结局关键收集「记忆碎片」缺席——碎片进度此前只在 J 日志「记忆碎片」
  // 节（未收集灰占位）与尾声战绩页可见，状态页一眼看不到还差几枚；现与 drawJournal/drawEnding 同读
  // hero.fragments / FRAGMENTS.length 一份单一数据源（(hero.fragments||[]) 防御式旧档零迁移），补
  // 「🕯️ 记忆碎片 N/4」。纯显示零结算零存档变化；行宽实测（@napi-rs/canvas 14px 最宽组合）≈558 ≤ 面板
  // 右缘 570（smoke_v2122/v2194/v2201 预算断言随新现实更新）。
  // v22.9 资源行「·成就X/6」→「🏆 成就 N/41」总进度（体验打磨·信息透明·口径一致·纯显示）：v21.79 标题
  // 预览/v21.82 胜利画面/v21.96 阵亡画面/v21.87 尾声的「收集口径」都报「🏆 成就 N/M（ACH_LIST 总数）」，
  // 唯独 I 状态页资源行的「·成就X/6」读的是 TREASURE_GOAL（开箱寻宝目标数）——玩家按 I 看到「成就 3/6」
  // 再开 C 页看到「成就 12/41」，两处数字对不上，是 v21.94「收集三件套收官」时把宝箱成就目标误当总数的
  // 口径遗留（v21.22 双口径的第二个数字本就专指开箱寻宝）；现改为与 drawDead 收集行同款四件套口径
  // （🏆/📕/📦/🕯️），🏆 读 (hero.ach||[]).length / ACH_LIST.length 一份单一数据源（防御式旧档零迁移），
  // 开箱寻宝进度依旧在 C 成就页「X/6」可见（信息零丢失、零裸字面量）；行宽 estW 估算 ≈551（净变化
  // -「·成就6/6」≈67px +「 🏆:41/41」≈53px）≤ 570 面板右缘（smoke_v2122/v2194/v2201/v2209 预算断言
  // 随新现实更新）。
  const codexN = BESTIARY_TARGET.filter((n) => ((hero.bestiary || {})[n] | 0) >= 1).length;
  const fragN = (hero.fragments || []).length;
  text(`金币:${hero.gold}  🍖:${hero.item} 🧪:${hero.potion2||0} 🍄:${hero.mushrooms||0} 📕:${codexN}/${BESTIARY_TARGET.length} 📦:${chestCount(hero)}/${chestTotal()} 🏆:${(hero.ach||[]).length}/${ACH_LIST.length}  🕯️:${fragN}/${FRAGMENTS.length}  ⏱️${fmtTime(hero.time)}`,110,264,'14px');
  // v23.61 状态页「已学技能：」节头补 N/8 计数（体验打磨·信息透明·节头第一眼就报进度家族收口——
  // 承 v23.16 灯下之声节头 N/37 / v23.19 记忆碎片节头 N/4 / v23.20 支线节头可交付 N / v23.21 主线节头
  // N/5 / v23.34 战斗技能菜单标题「已学 N/7」同一「集合类列表节头第一眼就报进度」主线：J 日志四节与
  // 战斗技能菜单标题都报计数，唯独 I 状态页「已学技能：」节头仍是无数字的裸标签——v23.55 第八招
  // 「灯焰长明」后玩家按 I 看「八招学齐了没」在节头查无一眼之数（列表就在下方但得逐行数，与 v23.21
  // 主线五徽记同页仍补节头计数同一先例）；现与 v23.34 技能菜单同读 hero.skills.length ·
  // Object.keys(SKILL_DATA).length 一份单一数据源（零裸字面量、加/删技能自动跟随、SKILL_DATA 漏配
  // 防御式 0 容忍保持 0/N 如实），节头直书「已学技能：N/8」；纯显示零结算零存档零数值变化，
  // 技能列表/行距/「📖 下一技能」行逐字未动。
  text('已学技能：' + hero.skills.length + '/' + Object.keys(SKILL_DATA).length, 110, 288, 'bold 14px', '#ffd24a');
  // v21.83 七招容量（承 v21.48 行距 16→14 先例）：Lv11 领悟第 7 招「星砂回响」后行距 14→12、
  // 首行 308→302 双收——≤6 招时逐字保持 v21.48 布局（条件式，零回归）；7 招时末行基线 380
  // （302+12×6）、字底 ≈381.4，不触「📖 下一技能」396（12px 字顶 ≈385.4，留 4px 净隙），
  // 行间 12px 整字高相接（12px 字身 = 整高，无叠无空）。
  // v23.55 八招容量（承 v21.83 先例）：Lv12 领悟第 8 招「灯焰长明」后行距 12→11 单收——≤7 招时
  // 逐字保持 v21.83 布局（条件式，零回归）；8 招时末行（i=7）基线 379（302+11×7）、字底 ≈382.4，
  // 不触「📖 下一技能」396（12px 字顶 ≈386.5，留 4px 净隙；11px 行距下相邻行 12px 字身仅 1px 盒
  // 相接，CJK 墨迹零叠）；首行仍 302 与「已学技能：」标签净隙不变。
  const SKILL_ROW_SP = hero.skills.length > 7 ? 11 : (hero.skills.length > 6 ? 12 : 14);
  const SKILL_ROW_Y0 = hero.skills.length > 6 ? 302 : 308;
  hero.skills.forEach((s,i)=>{
    const sd=SKILL_DATA[s];
    // v7.4: 技能行补齐 MP 消耗（与战斗技能菜单同源 SKILL_DATA.mp，信息透明·状态页可规划消费）
    // v21.48 行距 16→14（排版·六招容量，承 v2.8「状态页垂直空间占满需先压缩」惯例）：v21.48 新增
    // Lv9 汲光击后技能至多 6 招——原 16px 行距第 6 行基线 388 与「📖 下一技能」396（12px 字顶 ≈387）
    // 相触；收紧到 14 后第 6 行基线 378（字底 ≈381），与 396 行留 6px 净隙，其余各行逐字未动。
    text(`· ${s}${sd&&sd.hint?'（'+sd.hint+'）':''}${sd&&sd.mp?` · ${sd.mp} MP`:''}`,120,SKILL_ROW_Y0+i*SKILL_ROW_SP,'12px','#e8eef1');
  });
  const sx=skillXpHint(hero);
  const sxd=sx?SKILL_DATA[sx.name]:null;
  // v7.4: 下一技能提示同步补 MP（与已学技能行同一来源）
  text(sx?`📖 下一技能：${sx.name}（Lv.${sx.lv} · 还差 ${sx.remain} 经验${sxd&&sxd.mp?` · ${sxd.mp} MP`:''}）`:'✨ 已习得全部技能',110,396,'12px',sx?'#62c6ff':'#7d93a3');
  text('冒险进度：',110,412,'bold 13px','#ffd24a');
  const prog=adventureProgress(hero);
  prog.forEach(([nm,dn],i)=>text((dn?'✓':'✗')+' '+nm,190+i*progressSpacing(prog.length),412,'12px',dn?'#4cd964':'#5a6a78'));
  const {main,sides}=questLines(hero);
  text('主线：'+main,110,434,'11px','#e8eef1');
  // v23.00 体验打磨·信息透明·纯显示：状态页「支线」行多条支线在列时补「还有 N 条」计数（可发现性·承
  // v21.45 任务日志「还有 N 条」页脚口径同一「信息不被静默折叠」主线：quests.sideObjectives 按
  // 可交付/进行中/可接 排序返回全部支线目标，状态页此前只显示第一条（sides[0]）——玩家手里同时有
  // 灯长委托/护粮/未归的矿灯/残焰的安息等多条支线时按 I 只能看到一条，不知道还欠几条没交、该不该开
  // J 日志；现由 statusSideSuffix 纯函数派生计数后缀（单条/零条逐字零变化、零裸字面量、计数由数组
  // 长度派生不写死），与 J 日志页脚「还有 N 条」同口径；纯显示零结算零存档零数值变化）
  // v23.68 状态页页底「C 成就 · B 图鉴」直达（体验打磨·可发现性·信息透明·纯显示——承 v22.99 图鉴/成就页脚
  // 「I 状态页」/ v22.90 状态页↔日志页 I↔J 双向互切同一「同一功能所有入口口径一致」主线收口：v22.99 让
  // 图鉴（B）/成就（C）两页脚补「· I 状态页」并加 I→status 分支、v21.71 起状态页页底常驻「J 任务日志」——
  // 单向链路 I→J / J→I / B→I / C→I 齐备，唯独状态页本身「I→C / I→B」查无一行：玩家按 I 看属性/收集进度，
  // 看完想开成就一览或记忆图鉴只能 Esc 回世界再按 C/B（日志却在页底一行直达）；现页底并注「 · C 成就 ·
  // B 图鉴」与 main.js status.onKey 的 c/C→ach、b/B→codex 分支同口径（提示讲的键真的可用，承 v22.99
  // 「提示与键位同源」契约）；11px 全行实测（@napi-rs/canvas 11px sans-serif：最长支线目标
  // 「去无字回廊找守名者，接下替残焰讨回名字的委托」+「（还有 10 条）」+ 三直达 → 右缘 ≈550.3 ≤ 570
  // 面板右缘，预算 460 留 19.7px），行数/基线/颜色/既有「J 任务日志」逐字未动；纯显示零结算零存档零数值变化。
  // v23.83 状态页页底补「 · H 帮助」互切（体验打磨·可发现性·口径一致·纯显示——承 v23.71 四收集页互切
  // 网格「页底四直达」主线收口：v23.71 给 图鉴/日志/成就 三页脚补「· H 帮助」并给 main.js status.onKey 加
  // h/H→help 分支，唯独状态页页底因 11px 行宽预算（v23.68 实测右缘 ≈550.3 +「 · H 帮助」≈43 → ≈593 >
  // 570 面板右缘）刻意未并注——H 键可达性只能靠世界教程/index.html 常驻帮助条/pause 菜单三处承载，
  // 「功能存在就必须能看到入口」主线在状态页这一格留了窟窿；现按其余三页同式收口：页底改
  // 「J 日志 · C 成就 · B 图鉴 · H 帮助」（「J 任务日志」缩短为「J 日志」与 图鉴/日志/成就 三页脚同式——四页
  // 页脚至此同式同词；隔符「   ·  」收紧为「 · 」），与 status.onKey h/H 分支同口径（提示讲的键真的可用）；
  // 11px 实测（@napi-rs/canvas 11px sans-serif 最长支线档「支线：去无字回廊找守名者，接下替残焰讨回名字的
  // 委托（还有 10 条） ·  J 日志 · C 成就 · B 图鉴 · H 帮助」→ 右缘 ≈563.9 ≤ 570 面板右缘、预算 460 留
  // ≈6.1px），行数/基线/颜色/「支线：」与 statusSideSuffix 逐字未动；纯显示零结算零存档零数值变化。
  text((sides[0] ? '支线：'+sides[0]+statusSideSuffix(sides) : '支线：暂无')+' ·  J 日志 · C 成就 · B 图鉴 · H 帮助',110,450,'11px',sides[0]?'#a8ff8a':'#7d93a3');
}

// v23.00 纯显示辅助（与 progressSpacing/pauseSaveHint 同款「纯函数 + 渲染层只画」契约）：状态页
// 「支线」行多条支线在列时追加「还有 N 条」计数后缀（sides 来自 quests.sideObjectives——按
// 可交付/进行中/可接 排序后的全部支线目标数组）；n<=1 逐字零变化（空串），零副作用零状态写入，
// 冒烟可直接断言多档输出（承 skill 参考「纯显示辅助函数要纯」）。
export function statusSideSuffix(sides) {
  const n = (sides || []).length;
  return n > 1 ? `（还有 ${n - 1} 条）` : '';
}

// v23.14 体验打磨·信息透明·可发现性（纯函数·渲染层只画契约，与 statusSideSuffix 同款）：v23.13 有口皆碑
// 成就在 C 成就页只有一行 X/37 进度，玩家想补全 37 处灯下之声却不知道「还差谁」——J 日志此前零相关节；
// 现由 voiceList 从 data.js NPCS 派生全部交谈对象（单一数据源：加/删 NPC 自动跟随、零裸字面量），
// met 读 hero.talked（core.openTalk 唯一写入点）防御式 (hero.talked||[]) 旧档零迁移零抛错；
// 纯显示零结算零存档零数值变化，drawJournal 只画不判。
export function voiceList(hero) {
  const met = (hero && hero.talked) || [];
  return Object.keys(NPCS).map((id) => ({
    id,
    name: (NPCS[id] && NPCS[id].name) || id,
    met: met.includes(id),
  }));
}

function whereFind(name){
  // v14.5 图鉴位置标注与地图数据同源（data.js MAPS 的 extras）：
  // - v13.7 剧情重构后终焉之神已随主线迁至无字回廊东端祭坛（原「星井矿脉·终焉水晶」为旧位置，水晶已化为开门机关）；
  // - 残焰魔像（回廊中段精英）此前缺表项，会误显「草丛随机遇敌」——补上。
  const LOC={'石心魔像':'雾语林·稀有精英','幽冥魔王':'雾语林祭坛','洞窟领主':'星井矿脉深处','终焉之神':'无字回廊东端','残焰魔像':'无字回廊中段'};
  // v19.50 普通魔物出没地（遇敌池单一数据源派生，纯显示）：此前 8 种普通魔物一律笼统标「草丛随机遇敌」，
  // 与真实遇敌池脱钩——v19.44 潮灯镇限定四基础怪、无字回廊限定雾灵/石魔像/骷髅兵后，图鉴仍写
  // 「草丛随机遇敌」会让玩家误以为树精/石魔像也出现在镇内草地（那版恰恰把它们清出镇子）。
  // 现与 encounter.randomEncounter 的 MAPS[].pool 判定同源派生：某魔物出现在一张图 ⇔ 该图无 pool 限定
  // （雾语林/星井矿脉 = 全 8 种）或 pool 含其名；图名读同一 MAPS[].name——今后调任何图的遇敌池，
  // 图鉴出没地自动跟随，永不漂移。BOSS/精英仍走上方 LOC 剧情遭遇表。
  let loc = LOC[name] ||
    Object.values(MAPS).filter((def)=>!def.pool || def.pool.includes(name)).map((def)=>def.name).join(' · ');
  // v12.3: 出没等级门槛（与 battle 遇敌分布同源 MON_BASE.minLv / ELITE_GATE_LV，纯显示）——
  // 树精/石魔像/石心魔像 都要 Lv.3 才在野外出没，图鉴一眼看清「为什么还没遇到它」
  const lv = spawnLv(name);
  if (lv > 1) loc += ' · Lv.' + lv + '起出没';
  // v16.5: 精英出没概率（与 encounter.randomEncounter 的 ELITE_CHANCE 判定同源，纯显示）——
  // 石心魔像「稀有精英」此前只有定性「稀有」无定量，约 7% 的出没率只藏在源码里；
  // 图鉴直接标出确切概率，刷图鉴/刷蘑菇时一眼算清撞不撞得到它
  if (name === ELITE_GOLEM.name) loc += ' · 约' + Math.round(ELITE_CHANCE * 100) + '%';
  return loc;
}

export function drawCodex(){
  const hero = S.G;
  drawWorld(); panel(80,40,480,410,'— 记忆图鉴 —');
  const PAGE=10;
  const names=Object.keys(hero.bestiary||{});
  // v19.41 图鉴「已遭遇」揭示（信息透明·纯显示）：rows 增补 seen（hero.seen，battle.startBattle 进战即记，
  // 与 bestiary 同经 canonicalName 归一）——已遭遇未讨伐的敌人不再伪装成「从没遇到」，见 r.seen 分支
  // v21.37 已遭遇计数（信息透明·纯显示）：v19.41 起 seen 是布尔、图鉴却标写死的「已遭遇 ✕0」——计数与
  // 事实对不上（撞见 3 次仍 ✕0）；现 battle 侧计数（每次进战 +1）、图鉴标真实 ✕N（与讨伐行 ✕N 同族）。
  // seenCt 经 |0 归一：旧档布尔 true → 1（至少撞见一次），undefined/0 → 0，零结算零存档格式变化。
  const rows=BESTIARY_TARGET.map(n=>({n,got:!!(hero.bestiary||{})[n],seen:!!((hero.seen||{})[n]),seenCt:((hero.seen||{})[n])|0}));
  // v22.75 图鉴空态条件收口（体验打磨·信息透明·纯显示）：空态分支只看 hero.bestiary（讨伐数）——
  // 玩家阵亡/逃跑但「已遭遇」过魔物（hero.seen 有计数）时，图鉴砍掉了 v19.41/v21.37 专门设计的
  // 「已遭遇未讨伐：揭示名字/出没地/已遭遇 ✕N」行，只剩「尚未击败任何敌人」占位，而页脚此刻却照常
  // 显示「已遭遇：N/13」——同一屏自相矛盾（有遭遇却不给看）；现把空态条件收敛为「零讨伐 且 零遭遇」，
  // 有已遭遇未讨伐者时走 rows 全量绘制（seen 行按 v19.41 揭示、未见行保持 ❓ 占位、页脚随之自洽）。
  // 纯显示零结算零存档变化；零讨伐零遭遇的新档空态文案逐字保留。
  const seenAny = BESTIARY_TARGET.some((n) => ((hero.seen || {})[n] | 0) > 0);
  if (names.length === 0 && !seenAny) {
    text('尚未击败任何敌人。',320,170,'16px','#ffd24a','center');
    text('前往雾语林的草丛，开始你的冒险吧！',320,200,'14px','#7d93a3','center');
  } else {
    if(S.codexScroll<0) S.codexScroll=0;
    if(S.codexScroll>rows.length-PAGE) S.codexScroll=Math.max(0,rows.length-PAGE);
    const shown=rows.slice(S.codexScroll,S.codexScroll+PAGE);
    shown.forEach((r,i)=>{
      const y=92+i*30;
      // v23.62 图鉴行讨伐支线进度角标（体验打磨·信息透明·纯显示）：图鉴是「该去打哪只」的刷怪中枢，
      // 此前与讨伐采集型支线零联动——J 日志每卡有进度，图鉴行查无一行；现按 quests.questKillProg
      // 单一数据源派生（与 J 日志/支线卡/NPC 任务页同读 QUESTS.condProg 一份源，零裸字面量），
      // 仅该怪挂接进行中/可交付讨伐支线时追加「 · 📜 支线 N/M」，未接取/已完成/掌握怪零噪音，
      // 未遭遇（❓？？？）行名字隐藏故不提示（防剧透），纯显示零结算零存档零数值变化。
      const qKill = questKillProg(hero, r.n);
      if(!r.got){
        // 已遭遇·未讨伐：揭示名字/出没地/「已遭遇 ✕0」，兵力/弱点仍加密（讨伐后同 got 行才显示）——
        // 此前连自己撞见过的强敌（石心魔像/残焰魔像/Boss）都显示 ❓？？？「从没遇到」，与「信息透明」
        // 主题相悖；名字/位置经 whereFind 与 got 行同源（出没等级/精英概率同样揭示，不剧透兵力）
        if(r.seen){
          const n=r.n; const isBoss=/魔王/.test(n);
          const nm=(isBoss?'👿 ':'• ')+n;
          text(nm,120,y,'15px','#8fa8b8');
          const nmw=CTX.measureText(nm).width;
          text('（'+whereFind(n)+'）',128+nmw,y,'12px','#5f8aa8');
          text(`已遭遇 ✕${r.seenCt}`,420,y,'14px','#8fa8b8','right');
          text(`⚠️ 尚未讨伐 · 兵力待收复${qKill ? ` · 📜 支线 ${qKill.prog}` : ''}`,124,y+16,'11px','#7d93a3');
        } else {
          text('❓ ？？？',120,y,'15px','#5a6a78'); text('未讨伐',420,y,'14px','#4b5a66','right');
        }
        return;
      }
      const n=r.n; const isBoss=/魔王/.test(n); const rw=monReward(n,hero.level);
      const nm=(isBoss?'👿 ':'• ')+n;
      text(nm,120,y,'15px',isBoss?'#d88bff':'#e8eef1');
      const nmw=CTX.measureText(nm).width;
      text('（'+whereFind(n)+'）',128+nmw,y,'12px','#5f8aa8');
      text(`讨伐 ✕${hero.bestiary[n]}`,420,y,'14px','#ffd24a','right');
      const tag=codexTag(n); const tagStr=tag?('  · '+tag):'';
      // 魔物强度参考（信息透明·纯显示）：与 battle.js 遇敌属性逐字同源，随玩家等级实时计算，
      // 一眼看出这怪在当前等级有 多少HP/攻/防（已讨伐才显示，未讨伐灰色占位不剧透）
      const st=codexStats(n,hero.level);
      if(rw) text(`→ 击败可得：经验 ${rw.xp} · 金币 ${rw.gold}${st?` · HP${st.hp} 攻${st.atk} 防${st.def}`:''}${tagStr}${qKill ? ` · 📜 支线 ${qKill.prog}` : ''}`,124,y+16,'11px','#7d93a3');
    });
  }
  const total=names.reduce((a,n)=>a+hero.bestiary[n],0);
  const have=BESTIARY_TARGET.filter(n=>(hero.bestiary||{})[n]>=1).length;
  // v21.78 图鉴页脚补「已遭遇 X/13」汇总（信息透明·纯显示）：v21.37 起每行已遭遇未讨伐者标真实「已遭遇 ✕N」，
  // 但页脚只有「记忆收录 X/13（已讨伐种类）/累计讨伐（只数）」，没有「至少撞见过几种」的总数——玩家想知道
  // 「还剩几种从没碰到过」只能逐行数 ❓ 或数「⚠️ 尚未讨伐」；现按 BESTIARY_TARGET 同源补一行汇总
  // （与每行 seenCt 同读 hero.seen，真身经 canonicalName 归一与讨伐同口径），与上方「记忆收录」构成
  // 「见过 vs 打过」双口径，一眼看出「见过 N 种、还差 M 种没撞见」。纯显示零结算零存档变化。
  const met=BESTIARY_TARGET.filter(n=>((hero.seen||{})[n]|0)>0).length;
  text(`记忆收录：${have}/${BESTIARY_TARGET.length}`,320,404,'14px','#62c6ff','center');
  text(`累计讨伐：${total}   ·   已遭遇：${met}/${BESTIARY_TARGET.length}   ·   额外掉落：${hero.drops||0}`,320,426,'14px','#ffd24a','center');
  const remain=names.length>0?(rows.length-(S.codexScroll+PAGE)):0;
  // v22.99 图鉴页脚补「I 状态页」直达口径（可发现性·信息透明·纯文字，承 v22.90 状态页↔日志页 I↔J
  // 双向互切同一主线）：v21.71 起状态页页底「J 任务日志」/日志页页脚「I 状态页」互切，唯独记忆图鉴
  // 页脚只写「按 B / Esc 关闭」——在图鉴里对属性/想回状态页只能 Esc 回世界再按 I；现页脚补
  // 「· I 状态页」与 main.js codex.onKey 新增的 I→goto('status') 分支同口径（提示讲的键真的可用），
  // 行间预算：448 行上移一行仍不触页脚（448+12 <= 480 画布底、上方 426 行间 22 >= 16），纯显示零结算零存档。
  // v23.69 图鉴页脚补「 · J 日志 · C 成就」直达（承 v23.68 状态页页底三直达 / v22.99 I 状态页同一
  // 「四收集页互切网格」主线，详见 data.js GAME_VERSION 上方 v23.69 注释；与 main.js codex.onKey
  // j/J→journal、c/C→ach 新分支同口径（提示讲的键真的可用），B/Esc/↑↓/I 口径逐字零回归，纯文字零逻辑）。
  // v23.71 图鉴页脚补「 · H 帮助」互切（承 v23.70 H 页四直达 / v23.69 三页互切同一「同一功能所有入口
  // 口径一致」主线收口，详见 data.js GAME_VERSION 上方 v23.71 注释；与 main.js codex.onKey h/H→help
  // 新分支同口径（提示讲的键真的可用）；12px 实测最长档全行 ≈405.1、居中右缘 ≈522.6 ≤570 面板右缘，
  // B/Esc/↑↓/I/J/C 口径逐字零回归，纯文字零逻辑）。
  text(`按 B / Esc 关闭${remain>0?`   ·   ↑↓ 滚动浏览（还有 ${remain} 种）`:''}   ·   I 状态页 · J 日志 · C 成就 · H 帮助`,320,448,'12px','#7d93a3','center');
}

export function drawAch(){
  const hero = S.G;
  drawWorld(); panel(80,30,480,430,'— 成就 —');
  const got=(hero.ach||[]).length;
  text(`已解锁 ${got}/${ACH_LIST.length}`,320,70,'bold 14px','#62c6ff','center');
  const PAGE=10;
  if(S.achScroll<0) S.achScroll=0;
  if(S.achScroll>ACH_LIST.length-PAGE) S.achScroll=Math.max(0,ACH_LIST.length-PAGE);
  const shown=ACH_LIST.slice(S.achScroll,S.achScroll+PAGE);
  shown.forEach((a,i)=>{
    const done=(hero.ach||[]).includes(a.id);
    const y=96+i*34;
    const prog=a.prog?a.prog(hero):'';
    text((done?'✔ ':'✘ ')+a.name,120,y,'bold 15px',done?'#4cd964':'#5a6a78');
    text(a.d,132,y+17,'12px',done?'#7d93a3':'#4b5a66');
    // v19.62 成就奖励揭示（信息透明·纯显示）：四条带专享奖励的成就在一览页即标注回报——
    // perfection/trueboss/rush/legend 的 r 字段与结算同源（PERFECTION_GOLD / TRUE_BONUS_GOLD /
    // RUSH_BASE_GOLD·RUSH_GOLD_PER_LV / WEAPONS['圣光之剑']），此前奖励只在解锁瞬间横幅或战斗预览里
    // 一闪而过，未解锁的玩家浏览成就页无从得知「这项成就值多少」；纯显示零结算变化，无 r 字段的其余
    // 16 条不显示。测宽基于上行 text() 已设的 12px 字体，与描述同行右侧紧随（实测合计 ≤273px < 面板右缘）
    if (a.r) {
      const dw = CTX.measureText(a.d).width;
      text(' '+a.r, 132 + dw, y + 17, '12px', done ? '#e8a858' : '#a08a50');
    }
    if(prog) text(prog,470,y,'bold 13px',done?'#62c6ff':'#7d93a3','right');
  });
  const remain=ACH_LIST.length-(S.achScroll+PAGE);
  text(remain>0?`还有 ${remain} 项未在本页显示`:'全部成就已在当前页',320,412,'12px','#7d93a3','center');
  // v22.99 成就页脚补「I 状态页」直达口径（与记忆图鉴页脚同批，详见 drawCodex v22.99 注释）——
  // 行间预算：430 行上方 412 行间 18 >= 16 不触、下方画布底 480 距 50，纯显示零结算零存档。
  // v23.69 成就页脚补「 · J 日志 · B 图鉴」直达（承 v23.68 状态页页底三直达 / v22.99 I 状态页同一
  // 「四收集页互切网格」主线，详见 data.js GAME_VERSION 上方 v23.69 注释；与 main.js ach.onKey
  // j/J→journal、b/B→codex 新分支同口径（提示讲的键真的可用），C/Esc/↑↓/I 口径逐字零回归，纯文字零逻辑）。
  // v23.71 成就页脚补「 · H 帮助」互切（承 v23.70 H 页四直达 / v23.69 三页互切同一「同一功能所有入口
  // 口径一致」主线收口，详见 data.js GAME_VERSION 上方 v23.71 注释；与 main.js ach.onKey h/H→help
  // 新分支同口径（提示讲的键真的可用）；12px 实测最长档全行 ≈333.8、居中右缘 ≈486.9 ≤570 面板右缘，
  // C/Esc/↑↓/I/J/B 口径逐字零回归，纯文字零逻辑）。
  text(`按 C / Esc 关闭${remain>0?`   ·   ↑↓ 滚动浏览`:''}   ·   I 状态页 · J 日志 · B 图鉴 · H 帮助`,320,430,'12px','#7d93a3','center');
}

const QST_COL = {
  offer: '#62c6ff', active: '#ffd24a', turnin: '#a8ff8a', done: '#4cd964', locked: '#5a6a78',
};

function rewardHint(hero, entry) {
  if (!entry || entry.status === 'done' || entry.status === 'locked') return '';
  const r = questRewardPreview(hero, entry.id);
  if (!r) return '';
  const bits = [];
  if (r.gold) bits.push(r.gold + ' 金币');
  if (r.item) bits.push('药水 ×' + r.item);
  if (r.potion2) bits.push('灵药 ×' + r.potion2);
  return bits.join(' · ');
}

function ellipsize(str, fontSpec, maxW) {
  CTX.font = fontSpec + ' sans-serif';
  if (CTX.measureText(str).width <= maxW) return str;
  let s = String(str || '');
  while (s.length && CTX.measureText(s + '…').width > maxW) s = s.slice(0, -1);
  return s + '…';
}

function drawSectionHead(label, x, y, color) {
  text(label, x, y, 'bold 12px', color);
  CTX.strokeStyle = color;
  CTX.globalAlpha = 0.35;
  CTX.lineWidth = 1;
  CTX.beginPath();
  CTX.moveTo(x + 40, y - 4);
  CTX.lineTo(548, y - 4);
  CTX.stroke();
  CTX.globalAlpha = 1;
}

function cardFill(status) {
  if (status === 'turnin') return 'rgba(168,255,138,.12)';
  if (status === 'offer') return 'rgba(98,198,255,.12)';
  if (status === 'active') return 'rgba(255,210,74,.12)';
  return 'rgba(8,14,20,.55)';
}

function cardStroke(status) {
  if (status === 'turnin') return 'rgba(168,255,138,.5)';
  if (status === 'offer') return 'rgba(98,198,255,.45)';
  if (status === 'active') return 'rgba(255,210,74,.4)';
  return 'rgba(58,86,112,.45)';
}

function drawQuestCard(e, hero, x, y, w) {
  const col = QST_COL[e.status] || '#e8eef1';
  const hot = e.status === 'active' || e.status === 'turnin' || e.status === 'offer';
  const showWhere = !!(e.where && e.status !== 'locked' && e.status !== 'done');
  const rw = e.kind === 'side' ? rewardHint(hero, e) : '';
  const h = e.status === 'done' ? 34 : e.status === 'locked' ? 50 : (showWhere || rw ? 70 : 54);
  // v21.45 起不再以 yMax 提前 return 0：日志改用「全量条目 + CTX.translate(-scroll)」整页绘制（drawJournal），
  // 视口外的卡由外层 clip 裁掉（滚动后仍可见），这里的提前截断会让滚动中的下方条目永远画不出来。
  rr(x, y, w, h, 8);
  CTX.fillStyle = cardFill(e.status);
  CTX.fill();
  CTX.save();
  rr(x, y, w, h, 8);
  CTX.clip();
  if (hot) {
    CTX.fillStyle = col;
    CTX.fillRect(x, y + 6, 3, h - 12);
  }
  CTX.restore();
  CTX.strokeStyle = cardStroke(e.status);
  CTX.lineWidth = 1;
  rr(x, y, w, h, 8);
  CTX.stroke();
  const mark = e.status === 'done' ? '✔' : e.status === 'offer' ? '◇' : e.status === 'turnin' ? '!' : e.status === 'locked' ? '·' : '▶';
  const tag = QUEST_TAG[e.status] || e.status;
  CTX.font = 'bold 10px sans-serif';
  const tw = Math.ceil(CTX.measureText(tag).width) + 14;
  const pillX = x + w - 10 - tw;
  CTX.fillStyle = col;
  CTX.globalAlpha = 0.18;
  rr(pillX, y + 8, tw, 16, 8);
  CTX.fill();
  CTX.globalAlpha = 1;
  text(tag, pillX + tw / 2, y + 20, 'bold 10px', col, 'center');
  const nameMax = pillX - x - 28;
  text(ellipsize(mark + '  ' + e.name, 'bold 13px', nameMax), x + 14, y + 21, 'bold 13px', col);
  if (e.status === 'locked') {
    text(ellipsize(e.objective, '11px', w - 28), x + 14, y + 40, '11px', '#6a7c88');
  } else if (e.status !== 'done') {
    text(ellipsize(e.objective, '12px', w - 28), x + 14, y + 40, '12px', '#d5e2ea');
    if (showWhere || rw) {
      const loc = showWhere ? ('📍 ' + e.where) : '';
      const gift = rw ? ('🎁 ' + rw) : '';
      text(ellipsize([loc, gift].filter(Boolean).join('    '), '11px', w - 28), x + 14, y + 58, '11px', '#8aa0b0');
    }
  }
  return h + 8;
}

export function drawJournal(){
  const hero = S.G;
  drawWorld(); panel(70, 28, 500, 424, '— 任务日志 —');
  const log = questJournal(hero);
  const rank = { turnin: 0, active: 1, offer: 2, locked: 3, done: 4 };
  const mains = log.filter((e) => e.kind === 'main');
  const sides = log.filter((e) => e.kind === 'side').sort((a, b) => (rank[a.status] ?? 9) - (rank[b.status] ?? 9));
  if (!log.length) {
    text('没有进行中的任务。', 320, 200, '16px', '#ffd24a', 'center');
    // v21.71 空日志分支页脚同式补「I 状态页」互切提示（详注见下方有日志分支页脚）
    // v23.69 空日志分支页脚同式补「B 图鉴 · C 成就」互切（与有日志分支页脚 v23.69 同批，详见
    // drawJournal 主页脚 v23.69 注释；与 main.js journal.onKey b/B→codex、c/C→ach 同口径）
    // v23.71 空日志分支页脚同式补「 · H 帮助」互切（与有日志分支页脚 v23.71 同批，详见
    // drawJournal 主页脚 v23.71 注释；与 main.js journal.onKey h/H→help 同口径；12px 实测全行
    // ≈253.3、居中右缘 ≈446.7 ≤570 面板右缘，「按 J / Esc 关闭」与「I 状态页 · B 图鉴 · C 成就」逐字未动）
    text('按 J / Esc 关闭   ·   I 状态页 · B 图鉴 · C 成就 · H 帮助', 320, 432, '12px', '#7d93a3', 'center');
    return;
  }
  const cx = 86;
  const cw = 468;
  const yMax = 418;          // 可视区底（clip 内）
  const top = 66;            // 内容起始基线
  const viewH = yMax - top;  // 可视内容高度 352
  // v21.45 任务日志滚动（信息透明·可发现性）：图鉴/成就都有 ↑↓ 滚动（codex/achScroll），日志是唯一没有的
  // 多分区面板——一旦内容超出可视区（开局 6 条支线 + 4 行碎片即超），drawQuestCard 的 yMax 提前截断会让
  // 「可接」支线卡被静默裁掉、碎片区整段不画（v21.45 前 星砂之约/旧灯卫的名字/石壳里的记忆/残焰的安息
  // 在开局日志里完全看不见）。现改为：先按原布局规则排出全量条目高度序列（头/卡/碎片统一 h），
  // 滚动偏移 S.journalScroll（state.js 注册，与 codexScroll/achScroll 同族）绘制期钳制到
  // [0, totalH-viewH]，绘制时 CTX.translate(0,-scroll) 整页上移——clip 只裁视口外的内容，
  // 滚动后下方条目自然进入视口；页脚按 codex 同款口径补「↑↓ 滚动浏览（还有 N 条）」。
  const cardH = (e) => (e.status === 'done' ? 34 : e.status === 'locked' ? 50 : 70);
  const items = [];
  if (mains.length) {
    // v23.21 主线节头补「N/5」进度（体验打磨·信息透明·纯显示——承 v23.16 灯下之声节头「N/37」/
    // v23.19 记忆碎片节头「N/4」/ v23.20 支线节头「可交付 N」同一「节头第一眼就报进度」主线收口：
    // J 日志四节中主线节是最后一个无数字的节头——主线推进在 I 状态页五徽记/胜利（v22.89）/阵亡
    // （v22.95）/尾声（v22.96）四端可见，且五徽记里的「试炼场」（rushDone）在 J 日志无任何卡片承载
    // （RUSH 非 QUESTS 条目，节头反而是该徽记在日志里的唯一锚点），唯独日志主线节头只写「主线」二字；
    // 现与四端同读 quests.adventureProgress(hero) 一份单一数据源（五徽记 灯芯/星井/回廊/初灯/试炼场，
    // 零裸字面量、增删徽记自动跟随），节头直书「主线 · N/5」（N=已达成徽记数，新档 0/5 随推进实时）；
    // 节高 h12/滚动钳制/页脚「还有 N 条」口径逐字未动，纯显示零结算零存档零数值变化。
    const _mainProg = adventureProgress(hero);
    const _mainMet = _mainProg.filter(([, ok]) => ok).length;
    items.push({ kind: 'head', label: `主线 · ${_mainMet}/${_mainProg.length}`, color: '#ffd24a', h: 12 });
    for (const e of mains) items.push({ kind: 'card', e, h: cardH(e) + 8 }); // +8 = drawQuestCard 的间距步距（原 y += drawQuestCard 返回值 h+8）
    items.push({ kind: 'gap', h: 6 });
  }
  if (sides.length) {
    // v23.20 支线节头补「可交付 N」计数（体验打磨·信息透明·动作提示·纯显示——承 v23.16 灯下之声节头
    // 「N/37」/ v23.19 记忆碎片节头「N/4」同一「节头第一眼就报进度」主线：支线的「可交付」态（quests.js
    // questStatus：active 且条件达成即 turnin，QUEST_TAG「可交付」）此前只以卡片右缘 10px 小标签呈现——
    // 玩家翻到「支线」节想确认「有没有可以回去交付的任务」仍要逐卡找绿标，节头作为该节第一视觉锚点却
    // 零信息；现与下方 sides 卡片列表同源派生 `_turninCt = sides.filter(e => e.status === 'turnin').length`
    // （与卡片/世界横幅/NPC 任务页同读 quests.js 一份源、零裸字面量、新增支线自动跟随），>0 时节头直书
    // 「支线 · 可交付 N」（与 turnin 绿 #a8ff8a 同色族）、=0 零噪音保持「支线」原样（承 v23.17/v23.18
    // 「可酿 0 瓶时不显示」同一语义）；行高 h12/滚动钳制/页脚「还有 N 条」口径逐字未动，纯显示零结算
    // 零存档零数值变化。
    const _turninCt = sides.filter((e) => e.status === 'turnin').length;
    items.push({ kind: 'head', label: `支线${_turninCt > 0 ? ` · 可交付 ${_turninCt}` : ''}`, color: '#a8ff8a', h: 12 });
    for (const e of sides) items.push({ kind: 'card', e, h: cardH(e) + 8 });
    items.push({ kind: 'gap', h: 6 });
  }
  // v23.19 记忆碎片节头补「N/4」进度（体验打磨·信息透明·纯显示——承 v23.16 灯下之声节头「N/37」同一
  // 「节头第一眼就报进度」主线）：真结局关键收集的碎片进度在 I 状态页资源行/胜利/阵亡/尾声战绩行/
  // 战斗预览五端可见，J 日志「记忆碎片」节内 4 行也有 🕯️/？？？ 对照——唯独节头本身只写「记忆碎片」
  // 四字，玩家翻到该节要逐行数 🕯️ 才知道集了几枚；现与节内 frag 行同读 hero.fragments / FRAGMENTS.length
  // 一份单一数据源（(hero.fragments||[]) 防御式旧档零迁移零抛错、零裸字面量、增删碎片自动跟随），
  // 节头直书「记忆碎片 N/4」；行高 h16/滚动钳制/页脚「还有 N 条」口径逐字未动，纯显示零结算零存档零数值变化。
  const _fragsGot = (hero.fragments || []);
  items.push({ kind: 'head', label: `记忆碎片 ${_fragsGot.length}/${FRAGMENTS.length}`, color: '#8fd0ff', h: 16 });
  for (const f of FRAGMENTS) items.push({ kind: 'frag', f, h: 16 });
  // v23.14 灯下之声节（信息透明·可发现性——承 v23.13 新成就「有口皆碑」：C 成就页只有一行 X/37，
  // 玩家补全路上不知道「还差谁」；节内 37 处全部由 voiceList 从 data.js NPCS 派生（加/删 NPC 自动
  // 跟随零裸字面量）、✓/· 读 hero.talked 防御式（旧档零迁移），纯显示零结算零存档零数值变化）
  // v23.16 节头补「灯下之声 N/37」进度（信息透明·纯显示——承 v23.14 节/v23.15 对话页脚同一社交收集主线：
  // hero.talked 计数在 C 成就页 X/37、J 节 37 行 ✓/·、v23.15 对话现场页脚三端可见，唯独节头本身无数字——
  // 玩家翻到该节第一眼还要逐行数 ✓ 才知道还差几个；现与同节 voiceList 同读派生计数（NPCS·hero.talked 单一
  // 数据源、零裸字面量、加/删 NPC 自动跟随、防御式旧档零迁移零抛错），节头直书「灯下之声 N/37」；
  // 行高/滚动/页脚「还有 N 条」口径逐字未动，纯显示零结算零存档零数值变化）
  const _voices = voiceList(hero);
  const _voicesMet = _voices.filter((v) => v.met).length;
  items.push({ kind: 'head', label: `灯下之声 ${_voicesMet}/${_voices.length}`, color: '#ffd24a', h: 16 });
  for (const v of _voices) items.push({ kind: 'talk', v, h: 16 });
  const totalH = items.reduce((a, it) => a + it.h, 0);
  const maxScroll = Math.max(0, totalH - viewH);
  if (typeof S.journalScroll !== 'number' || S.journalScroll < 0) S.journalScroll = 0;
  if (S.journalScroll > maxScroll) S.journalScroll = maxScroll; // 越界钳制（逻辑同 codex/ach 的绘制期钳制）
  const scroll = S.journalScroll;
  CTX.save();
  CTX.beginPath();
  CTX.rect(78, 54, 484, yMax - 54);
  CTX.clip();
  CTX.translate(0, -scroll);
  let y = top;
  for (const it of items) {
    if (it.kind === 'head') {
      drawSectionHead(it.label, cx, y, it.color);
    } else if (it.kind === 'card') {
      drawQuestCard(it.e, hero, cx, y, cw);
    } else if (it.kind === 'frag') {
      // 记忆碎片（data.js FRAGMENTS 单一数据源）：强敌首胜掉落，未收集灰占位不剧透
      const got = (hero.fragments || []).includes(it.f.id);
      if (got) {
        text('🕯️ ' + it.f.name, cx + 6, y, 'bold 12px', '#cfe8ff');
        text(ellipsize(it.f.text, '11px', cw - 150), cx + 150, y, '11px', '#8aa0b0');
      } else {
        text('🕯️ ？？？', cx + 6, y, '12px', '#4a5a66');
      }
    } else if (it.kind === 'talk') {
      // v23.14 灯下之声行（voiceList 单一数据源派生，只画不判）：已交谈 ✓ 绿 / 未交谈 · 灰，零噪音零剧透
      text((it.v.met ? '✓ ' : '· ') + it.v.name, cx + 6, y, '12px', it.v.met ? '#a8ff8a' : '#5a6a78');
    }
    y += it.h;
  }
  CTX.restore();
  // 页脚「还有 N 条」：视口底以下仍未滚到的条目数（卡 + 碎片行计数，头/间隔不计）——codex 同款口径
  const viewBottom = scroll + viewH;
  let remain = 0;
  let acc = 0;
  for (const it of items) {
    acc += it.h;
    if (acc > viewBottom && (it.kind === 'card' || it.kind === 'frag' || it.kind === 'talk')) remain++;
  }
  // v21.71 页脚补「I 状态页」互切提示（可发现性·口径一致，承 v21.4 帮助页 A/D 别名 /
  // v21.18「按键提示必须如实反映可用键」主线）：main.js journal.onKey 本就支持 `I` 直达状态页
  // （与 status.onKey 的 `J` 直达日志双向互切），状态页页底也早已常驻「J 任务日志」提示
  // （drawStatus 末行），唯独日志页两处页脚只写「按 J / Esc 关闭」——翻日志想对号属性时
  // 无从知晓 I 可直切状态页。本分支与上方空日志分支同式补齐，双向互切口径自此成对。
  // 纯文字零逻辑零结算；「按 J / Esc 关闭」与「↑↓ 滚动浏览（还有 N 条）」口径逐字保留。
  // v23.69 日志页脚补「 · B 图鉴 · C 成就」互切（体验打磨·可发现性·纯显示，承 v23.68 状态页页底
  // 三直达 / v22.99 图鉴·成就页脚 I 直达 / v22.90 I↔J 双向互切同一「四收集页互切网格」主线，详见
  // data.js GAME_VERSION 上方 v23.69 注释）：v23.68 后 I↔J / I↔B / I↔C 齐备，唯独日志页本身
  // 「J→B / J→C」查无一行——玩家按 J 看支线进度想去图鉴查魔物强度/去成就页查进度只能 Esc 回世界
  // 再按；现页脚并注「 · B 图鉴 · C 成就」与 main.js journal.onKey b/B→codex、c/C→ach 新分支
  // 同口径（提示讲的键真的可用）；「按 J / Esc 关闭」「↑↓ 滚动浏览（还有 N 条）」与 432 基线逐字
  // 零回归，纯显示零结算零存档零数值变化。
  // v23.71 日志页脚补「 · H 帮助」互切（体验打磨·可发现性·纯显示，承 v23.70 H 页四直达 / v23.69
  // 三页互切同一「同一功能所有入口口径一致」主线收口，详见 data.js GAME_VERSION 上方 v23.71 注释）：
  // v23.70 后 H→I/J/B/C 齐备，唯独日志页「J→H」查无一行——玩家按 J 看进度想去查操作说明只能 Esc 回
  // 世界再按 H；现页脚并注「 · H 帮助」与 main.js journal.onKey h/H→help 新分支同口径（提示讲的键真的
  // 可用）；12px 实测（@napi-rs/canvas 12px sans-serif：最长档「按 J / Esc 关闭 · ↑↓ 滚动浏览（还有
  // 43 条） · I 状态页 · B 图鉴 · C 成就 · H 帮助」全行 ≈405.1、居中右缘 ≈522.6 ≤570 面板右缘），
  // 「按 J / Esc 关闭」「↑↓ 滚动浏览（还有 N 条）」与 432 基线逐字零回归，纯显示零结算零存档零数值变化。
  text(`按 J / Esc 关闭${remain > 0 ? `   ·   ↑↓ 滚动浏览（还有 ${remain} 条）` : ''}   ·   I 状态页 · B 图鉴 · C 成就 · H 帮助`, 320, 432, '12px', '#7d93a3', 'center');
}

export function drawHelp(){
  // v21.31 面板标题随页切换：此前硬编码「— 操作说明 —」，翻到地图指南/魔物状态/试炼进阶页时标题
  // 仍是操作说明（标题与页内容脱节）；现改读 data.js HELP_TITLES（与 HELP_PAGES 一一对应、单一数据源，
  // 页数增减自动跟随），`|| '操作说明'` 仅兜底越界索引；纯显示零结算，行内容/行数/页脚/翻页逐字未动。
  drawWorld(); panel(70,28,500,424,'— ' + (HELP_TITLES[S.helpPage] || '操作说明') + ' —');
  const P=HELP_PAGES[S.helpPage];
  // v19.59 帮助页排版修复（操作说明页 14 行在固定 34px 行距下最后两行 y=488/522 落在画布 480 之下、
  // 盖住页脚——玩家看不到「战斗/存档槽」两行）：行距按页长自适应——>10 行长页收紧到 25px（14 行
  // 最后基线 y=405 留白充裕且不再压页脚），短页（地图指南/机制/试炼 ≤7 行）保持 34px、渲染逐位不变；
  // 行若带第三元素 r[2]（data.js 战斗行拆出的次行说明）在其基线 +18px 处以 12px 次级灰另起一行
  const sp = P.length > 10 ? 25 : 34;
  let y = 80;
  P.forEach((r, i) => {
    text(`${r[0]}   ${r[1]}`, 100, y, '14px', i === P.length - 1 ? '#ffd24a' : '#e8eef1');
    if (r[2]) { text(r[2], 100, y + 18, '12px', '#7d93a3'); y += 16; }
    y += sp;
  });
  // v21.39 帮助页翻页入口口径（可发现性·承 v21.29-32/v21.38「同一功能所有入口口径一致」主线）：
  // main.js help.onKey 的翻页分派本就双入口——ArrowRight/ArrowLeft 与 d/D/a/A（与标题页选槽
  // v21.4 A/D 别名同族），页脚却只写「← → 翻页」，README H 行亦然——按 README 标题行（v21.38）
  // 「A/D 亦可」的如实口径补全，读 H 翻页的玩家一眼知道 ←/→ 或 A/D 都能翻；纯文字零逻辑。
  // v23.70 帮助页补四收集页直达（体验打磨·可发现性·信息透明·纯文字，承 v23.68/69 四收集页互切网格同一
  // 「同一功能所有入口口径一致」主线收口：H 页「状态/任务日志/记忆图鉴/成就一览」四行行内早已描述
  // 对应页按键与互切口径（v22.90/v23.69），玩家在 H 页按 I/J/B/C 却无反应（「提示讲的键真的可用」契约），
  // 且 H 是唯一没有出口的菜单页（pause 菜单四页齐、收集页网格已成网）；现与 main.js help.onKey 四分支
  // 同口径补页脚「I/J/B/C 直达 状态·日志·图鉴·成就」——提示讲的键真的可用；12px 实测（@napi-rs/canvas
  // 12px sans-serif：最长档「第 4/4 页 · ←/→ 翻页(A/D亦可) · I/J/B/C 直达 状态·日志·图鉴·成就 ·
  // H/Esc 关闭」全行宽 ≈408.8 ≤470 面板预算、居中 320 右缘 ≈524.4 ≤570 面板右缘），行位/基线/颜色/
  // 「←/→ 翻页(A/D亦可)」「H/Esc 关闭」逐字未动；纯文字零逻辑零结算零存档零数值变化。
  text(`第 ${S.helpPage+1}/${HELP_PAGES.length} 页   ·   ←/→ 翻页(A/D亦可)   ·   I/J/B/C 直达 状态·日志·图鉴·成就   ·   H/Esc 关闭`,320,452,'12px','#7d93a3','center');
}

// v21.12 快速旅行页脚基线（单一公式，绘制与冒烟同源）：末行标题 baseline = 110+(n-1)*52，
// 描述行 = 标题+19，页脚再下移 35px（n=4 → 320）。此前页脚硬编码 270：TRAVEL_LIST 第 4 条目的地
// （无字回廊）加入后末行 baseline 被推到 266（16px 字形底 267），页脚 12px 字形顶 261 —— 实测重叠 6px，
// 页脚还被夹在末行标题与描述之间（描述 baseline 285）。改为派生后：页脚字形顶 311、底 320，
// 与描述底 286 相隔 25px、距 panel 底 380 富余 60px。调行距/条目数只改此处，冒烟同步跟随。
export function travelFootY(n) {
  return 110 + (n - 1) * 52 + 19 + 35;
}

export function drawTravel(){
  const hero = S.G;
  drawWorld(); panel(120,60,400,320,'🧭 快速旅行');
  // v23.27 快速旅行面板标题右「已探索 N/4」计数（体验打磨·信息透明·纯显示——承 v23.13-21
  // 灯下之声/图鉴/成就/碎片各「N/M 汇总」同一收集计数家族收口：TRAVEL_LIST 四图是探索线收集面
  // （成就「踏出灯影/灯影渐远/走遍四方」与行态同读 hero.visited），快速旅行面板却是唯一没有
  // N/M 汇总的收集界面——四行目的地各自显形/？？？，但「还差几张图没到访」要逐行数；现与行态
  // （(hero.visited||[]) 防御式旧档零迁移）及成就 prog 同读 hero.visited 一份单一数据源，总数读
  // TRAVEL_LIST.length（与 Object.keys(MAPS) 四图一一对应，加/删地图自动跟随零裸字面量），
  // 落面板标题右缘（与 drawShop 金币同款右上元信息位：右对齐 510 距面板右缘 520 留 10px 边距、
  // 12px 灰字与 16px 金色标题零重叠——标题居中宽 ≈90px 至 365、计数左起 ≈435，
  // 承 progressSpacing/travelFootY「派生化防回归」族），纯显示零结算零存档零数值变化。
  const _visitedN = TRAVEL_LIST.filter(([k]) => (hero.visited || []).includes(k)).length;
  text(`已探索 ${_visitedN}/${TRAVEL_LIST.length}`, 510, 86, '12px', '#7d93a3', 'right');
  TRAVEL_LIST.forEach(([k,nm,desc,hint],i)=>{
    const on=i===S.travelSel, unlocked=(hero.visited||[]).includes(k);
    // 当前所在地标注（信息透明·纯显示）：绿色 📍 一眼看出自己在哪，避免误传送
    const here=k===curMap();
    text((on?'▶ ':'  ')+(unlocked?nm:'？？？ · 未探索')+(here?' 📍':''),180,110+i*52,'16px',on?'#ffd24a':(unlocked?'#e8eef1':'#7d93a3'));
    if(unlocked&&desc) text(desc,180,110+i*52+19,'11px','#7d93a3');
    if(unlocked&&hint) text(hint,478,110+i*52,'bold 11px','#ffd24a','right');
  });
  text('↑↓ 选择  ·  Enter/E 传送  ·  Esc 取消',320,travelFootY(TRAVEL_LIST.length),'12px','#7d93a3','center');
  // v21.92 目的地等级达标预警（体验打磨·信息透明·纯显示）：列表提示（TRAVEL_LIST「推荐 Lv.X 起」）与
  // 进图预警（v19.56，传送落地后才提示）都只陈述标准，旅行菜单上玩家仍要心算「我 Lv.几、够不够」；
  // 现于选中行页脚区按 MAPS[k].recLv 与 hero.level 实时比对（与 TRAVEL_LIST 提示派生 / world.transition
  // 进图预警 / 状态页推荐等级同读 MAPS.recLv 单一数据源，调门槛只改 MAPS 一处四端同步）——未达标且非
  // 当前所在地（已在该图时由进图预警/状态页承载，避免「目的地」语义失真）补红色预警行；
  // 地处安全区/已达标时不显示（village recLv=1 恒不触发），纯显示零结算零逻辑变化。
  const selK = TRAVEL_LIST[S.travelSel] && TRAVEL_LIST[S.travelSel][0];
  const selRec = (MAPS[selK] || {}).recLv;
  const lowLv = !!(hero && selK !== curMap() && selRec && hero.level < selRec);
  if (lowLv) {
    text(`⚠️ 目的地推荐 Lv.${selRec} · 你当前 Lv.${hero.level} · 先补给再战！`, 320, travelFootY(TRAVEL_LIST.length) + 24, '12px', '#ff5b5b', 'center');
  }
  // v22.32 目的地补给点提示（体验打磨·信息透明·纯显示，承 v21.92 等级达标预警 / v21.40 无泉水旅店
  // 进图提示同一「传送决策点信息」主线）：旅行面板每行的特色提示只标推荐等级/高难，唯独「该地有没有
  // 泉水/旅店」在按下 Enter 前看不到——星井矿脉/无字回廊是全图唯二无补给点的图，直接传送过去血蓝双缺
  // 只能原路折返，落地后才有 v21.40 进图提醒；现按选中目的地由 data.js hasRecoveryPoint 实扫派生
  // （与 world.transition 进图提示同读一份单一数据源，加泉水/旅店提醒自动消失），无补给点且非当前
  // 所在地时补橙行，与 v21.92 等级预警同现时下移一行（+42 仍在面板底缘 380 之内）；
  // 纯显示零结算零逻辑零存档变化。
  const selDef = MAPS[selK];
  const noSupPoint = !!(hero && selDef && selK !== curMap() && !hasRecoveryPoint(selDef));
  if (noSupPoint) {
    text(`⚠️ ${selDef.name}没有泉水/旅店 · 出发前请补给！`, 320, travelFootY(TRAVEL_LIST.length) + (lowLv ? 42 : 24), '12px', '#ff9d5b', 'center');
  }
}

const PAUSE_ITEMS = [
  { id: 'resume', name: '继续冒险', hint: '返回地图' },
  { id: 'status', name: '状态', hint: 'I' },
  { id: 'journal', name: '任务日志', hint: 'J' },
  { id: 'codex', name: '记忆图鉴', hint: 'B' },
  { id: 'ach', name: '成就', hint: 'C' },
  { id: 'travel', name: '快速旅行', hint: 'T' },
  { id: 'save', name: '存档', hint: 'P' },
  { id: 'help', name: '操作说明', hint: 'H' },
  { id: 'title', name: '返回标题', hint: '不会自动存档' },
];

// v22.30 纯显示辅助（与 adventureProgress 同款「纯函数 + 渲染层只画」契约）：Esc 暂停菜单的「未存档 +
// 槽位占位」提示文案。判定输入（g/unsaved/slot/hasS）由调用方以实参传入，函数零副作用零状态写入——
// 冒烟可直接断言四种组合的输出，无需构造完整渲染环境（承 skill 参考「纯显示辅助函数要纯」）。
export function pauseSaveHint(g, unsaved, slot, hasS) {
  if (!(g && unsaved)) return null;
  return `⚠️ 未存档 · 按 P 写入槽 ${slot}${hasS ? '（已有存档，将覆盖）' : '（空槽）'}`;
}

export function drawPause() {
  const hero = S.G;
  drawWorld();
  panel(140, 48, 360, 392, '— 菜单 —');
  // v23.77 体验打磨·信息透明·纯显示：Esc 暂停菜单头部补「当前所在地」——承 v19.89 状态页
  // 「📍 地图名」与 v23.27 快速旅行「当前所在地标注」同一「我在哪」口径：暂停菜单是玩家决定
  // 「存档/继续/快速旅行/回标题」的第一现场，头部此前只报「名字 · 槽号」——按 Esc 想确认
  // 「现在在哪个图」还得退回世界看横幅或按 I 开状态页；现与 drawStatus 同读
  // (MAPS[curMap()]||{}).name 一份单一数据源（加/删地图自动跟随零裸字面量），13px 居中全行
  // 实测 ≤360 面板宽（@napi-rs/canvas 13px：最长档「守灯人 · 槽 2 · 📍星井矿脉」≈147px）；纯显示零结算零存档零数值变化，
  // 头部既有「名字 · 槽 N」子串逐字保留（smoke_v2230 槽号行 includes 断言零回归）。
  const _mapName = (MAPS[curMap()] || {}).name || curMap();
  text((hero ? hero.name : '守灯人') + '  ·  槽 ' + S.curSaveSlot + '  ·  📍' + _mapName, 320, 92, '13px', '#62c6ff', 'center');
  PAUSE_ITEMS.forEach((it, i) => {
    const sel = i === S.pauseSel;
    if (sel) {
      CTX.fillStyle = 'rgba(255,210,74,.15)';
      rr(160, 108 + i * 32, 320, 28, 6);
      CTX.fill();
    }
    const saveHint = it.id === 'save' ? ('P · 写入槽 ' + S.curSaveSlot) : it.hint;
    text((sel ? '▶ ' : '  ') + it.name, 180, 124 + i * 32, '15px', sel ? '#ffd24a' : '#e8eef1');
    text(saveHint, 460, 124 + i * 32, '12px', '#7d93a3', 'right');
  });
  text('↑↓ 选择  ·  Enter/E 确定  ·  Esc 关闭', 320, 412, '12px', '#7d93a3', 'center');
  // v22.30 暂停菜单「未存档 + 槽位占位」提示（体验打磨·防误丢档·信息透明·纯显示，承 v22.10 离站守卫 /
  // v22.28 标题页未存档警告同一「未落盘进度防丢失」主线）：标题页（drawTitle）与浏览器离站（main.js
  // beforeunload）都有对 S.G && S.unsaved 的提醒，唯独 Esc 暂停菜单——玩家决定「要不要存个档」的第一
  // 现场——没有：菜单头部只报槽号，玩家不知道当前冒险是否已落盘、按下 P 会写进有存档的槽还是空槽。
  // 现于面板底部（页脚 412 之下、panel 底缘 440 之内，12px 不越界）落一行：与 beforeunload 守卫同判
  // S.G && S.unsaved（同读 state.js S.unsaved 一份源），槽位占位读 core.hasSlot(S.curSaveSlot)（与标题页
  // 存档槽行/删除确认同源）；文案由 pauseSaveHint 纯函数派生（可冒烟直接断言），零结算零存档格式变化。
  const pHint = pauseSaveHint(S.G, S.unsaved, S.curSaveSlot, hasSlot(S.curSaveSlot));
  if (pHint) text(pHint, 320, 430, '12px', '#ff9d5b', 'center');
}
export { PAUSE_ITEMS };

// 对话逐字音效的模块级游标（页/时间锚变化时重置）
let _talkSig = '';
let _talkN = 0;

// 富文本行（纯显示）：【…】金色强调；maxChars 为打字机已显字数
function drawRichLine(x, y, line, maxChars, font) {
  CTX.font = font + ' sans-serif';
  CTX.textAlign = 'left';
  let cx = x;
  let budget = maxChars;
  for (const part of line.split(/(【[^】]*】)/)) {
    if (budget <= 0) break;
    const show = part.slice(0, budget);
    budget -= show.length;
    if (!show) continue;
    CTX.fillStyle = 'rgba(0,0,0,.55)';
    CTX.fillText(show, cx + 1, y + 1);
    CTX.fillStyle = part.startsWith('【') ? '#ffd24a' : '#e8eef1';
    CTX.fillText(show, cx, y);
    cx += CTX.measureText(show).width;
  }
}

export function drawTalk(){
  drawWorld();
  // 对话聚焦：世界压暗一层
  CTX.fillStyle='rgba(5,8,14,.35)'; CTX.fillRect(0,0,CV.width,CV.height);
  boxMsg('',0);
  const npc=NPCS[S.curNpc];
  const name=npc?npc.name:'???';
  const bx=40,by=300,bw=560,BH=140;
  const p=S.talkPages[S.talkPage]||[];
  const {lines,done}=pageShownAt(p,Date.now()-(S.talkLineAt||0));
  // v15.5 像素感知折行：每个逻辑行折成 ≤可用宽 的视觉片段，打字机预算 lines[i] 沿片段顺序消耗；
  // 视觉行数决定面板高度（向下扩，by+bh 封顶 470 不越画布）。修复长行右缘截断（灯长任务 offer 等）。
  const TX_X=bx+96, TX_Y=342, LINE_H=27, MAX_W=bx+bw-24-TX_X;
  const measure=(s)=>CTX.measureText(s).width;
  const visual=[];
  for (let i=0;i<p.length;i++){
    let budget=lines[i]||0;
    for (const seg of wrapTalkLine(p[i],MAX_W,measure)){
      const show=Math.min(budget,seg.length);
      budget-=show;
      visual.push({text:seg,show});
    }
  }
  const vh=visual.length;
  const bh=Math.min(170,BH+Math.max(0,vh-4)*LINE_H);
  // 面板弹出（纯显示）：开场 140ms 淡入上浮；talkStartAt 只在 openTalk 时设置，翻页不重放
  const popT=Math.min(1,(Date.now()-(S.talkStartAt||0))/140);
  const ease=1-(1-popT)*(1-popT);
  CTX.save();
  CTX.globalAlpha=0.3+0.7*ease;
  CTX.translate(0,(1-ease)*10);
  // 主面板：深底 + 外框 + 内高光边
  CTX.fillStyle='rgba(8,12,20,.93)'; rr(bx,by,bw,bh,12); CTX.fill();
  CTX.strokeStyle='#3a5670'; CTX.lineWidth=2; rr(bx,by,bw,bh,12); CTX.stroke();
  CTX.strokeStyle='rgba(158,200,235,.22)'; CTX.lineWidth=1; rr(bx+3,by+3,bw-6,bh-6,9); CTX.stroke();
  // 名牌 chip（压在面板左上角框线上）
  CTX.font='bold 13px sans-serif';
  const nw=Math.ceil(CTX.measureText(name).width)+24;
  CTX.fillStyle='rgba(20,30,44,.98)'; rr(bx+18,by-13,nw,26,8); CTX.fill();
  CTX.strokeStyle='#5a86b0'; CTX.lineWidth=1.5; rr(bx+18,by-13,nw,26,8); CTX.stroke();
  text(name,bx+18+nw/2,by+5,'bold 13px','#ffd24a','center');
  // 说话人肖像框（面板左侧）：普通 NPC 画 MiniWorld 造型；石碑画碑体
  CTX.fillStyle='rgba(20,30,44,.9)'; rr(bx+16,by+22,64,64,8); CTX.fill();
  CTX.strokeStyle='rgba(90,134,176,.6)'; CTX.lineWidth=1; rr(bx+16,by+22,64,64,8); CTX.stroke();
  if (S.curNpc && S.curNpc.startsWith('stele')) {
    const st=TILE[20]; // TY.STELE
    if (st) { CTX.imageSmoothingEnabled=false; CTX.drawImage(st,bx+32,by+30,48,48); }
  } else {
    drawNpcSprite(bx+48,by+54,S.curNpc,npc&&npc.mark);
  }
  // 打字机正文（节奏与 core.talkNext 同读 rules.pageShownAt）：标点停 4 拍 + 逐字音效 +【】金色强调
  // 逐字音效：每 3 字一声轻响（页/锚变化时游标重置）
  const shownTotal=visual.reduce((a,b)=>a+b.show,0);
  const sig=S.curNpc+'|'+S.talkPage+'|'+S.talkLineAt;
  if (sig!==_talkSig){ _talkSig=sig; _talkN=0; }
  if (shownTotal>_talkN){
    if (Math.floor(shownTotal/3)>Math.floor(_talkN/3)) SFX.tick();
    _talkN=shownTotal;
  }
  visual.forEach((v,i)=>drawRichLine(TX_X,TX_Y+i*LINE_H,v.text,v.show,'15px'));
  // 翻页指示：本页打完且还有后续页时闪烁 ▼
  if (done && S.talkPage<S.talkPages.length-1 && Math.floor(Date.now()/UI_PULSE_MS)%2===0) {
    text('▼',bx+bw-28,by+bh-14,'bold 14px','#8fd0ff','center');
  }
  // v23.15 对话面板底缘补「灯下之声 N/37」收集进度行（信息透明·反馈不迟到·纯显示）：v23.13 社交成就
  // 「有口皆碑」的计数源 hero.talked（core.openTalk 唯一写入点）此前只在 C 成就页 X/37 与 v23.14 J 日志
  // 「灯下之声」节可见，交谈现场本身毫无反馈——与一位新镇民/旅人/名字石碑开口的瞬间，玩家不知道进度
  // 推进了多少；现与 voiceList/drawJournal/成就判定同读 data.js NPCS·hero.talked 一份单一数据源
  // （voiceList 本文件纯函数，(hero && hero.talked) || [] 防御式旧档零迁移零抛错），11px 灰字落面板
  // 底缘左下（bx+24, by+bh-14，与右侧 ▼ 翻页指示同基线互不冲突），纯显示零结算零存档零数值变化
  const _voices = voiceList(S.G);
  const _voicesMet = _voices.filter((v) => v.met).length;
  text(`🗨️ 灯下之声 ${_voicesMet}/${_voices.length}`, bx + 24, by + bh - 14, '11px', '#7d93a3');
  CTX.restore();
}

export function drawCreate(){
  const g=CTX.createLinearGradient(0,0,0,CV.height); g.addColorStop(0,'#141a2a');g.addColorStop(1,'#0a0e16');
  CTX.fillStyle=g; CTX.fillRect(0,0,CV.width,CV.height);
  CTX.fillStyle='#ffd24a'; CTX.textAlign='center'; CTX.font='bold 28px sans-serif'; CTX.shadowColor='#ffd24a'; CTX.shadowBlur=22;
  CTX.fillText('选择守灯人',CV.width/2,105); CTX.shadowBlur=0;
  CTX.fillStyle='#e8eef1'; CTX.font='15px sans-serif'; CTX.fillText('姓名',CV.width/2,168);
  CTX.fillStyle='#62c6ff'; CTX.font='bold 42px sans-serif'; CTX.fillText('◀  '+HERO_NAMES[S.createName]+'  ▶',CV.width/2,230);
  // v22.33 姓名寓意（开场引子·纯显示）：与 HERO_NAMES 逐下标同读 data.js NAME_FLAVOR 单一数据源——
  // 名字下方一行灰色注脚点破各自的世界观（灯芯熄了/见过灯/潮水把名字带上岸），零结算零存档；
  // 原 230/300/352/382/408/432 各基线逐字未动（v21.42 Esc 返回行同行零回归）
  CTX.fillStyle='#8fa3b5'; CTX.font='13px sans-serif'; CTX.fillText('「'+NAME_FLAVOR[S.createName]+'」',CV.width/2,262);
  CTX.fillStyle='#e8eef1'; CTX.font='15px sans-serif'; CTX.fillText('难度',CV.width/2,300);
  CTX.fillStyle='#ffd24a'; CTX.font='bold 30px sans-serif'; CTX.fillText('▲  '+DIFFS[S.createDiff]+'  ▼',CV.width/2,352);
  CTX.fillStyle='#7d93a3'; CTX.font='13px sans-serif';
  // 困难倍率（信息透明·纯显示）：与 battle.startBattle 结算同源于 DIFF_SCALE，选档前一眼看清确切代价
  CTX.fillText(`（困难：魔物 HP×${DIFF_SCALE.hp} / 攻×${DIFF_SCALE.atk} / 防×${DIFF_SCALE.def}，挑战性提升）`,CV.width/2,382);
  // 每级成长（信息透明·纯显示）：与 hero.grantXp 升级结算同源于 baseStats 推导的 LEVEL_GROWTH——
  // 此前成长数值只在胜利横幅一闪而过，创建页一眼看清「每升一级得到什么」
  CTX.fillText(`每级成长：HP+${LEVEL_GROWTH.hp} · MP+${LEVEL_GROWTH.mp} · 攻+${LEVEL_GROWTH.atk} · 防+${LEVEL_GROWTH.def}`,CV.width/2,408);
  // v21.42 创建页补 Esc 返回（体验打磨·可发现性）：create.onKey 新补 `isEsc(e) → goto('title')`
  //（此前创建页是无 Esc 处理的唯一场景，误入无退路是「看不见的入口」）；提示行如实补「Esc 返回」，
  // 与 H 页「菜单 / 取消」行 Esc 语义、dead 画面 T 回标题同口径，纯显示零结算。
  // v22.86 页脚口径同步：create.onKey 出发补 E 键别名（Enter/E 同效收尾——drawTitle/drawCreate 是
  // v22.85 胜利画面/尾声之后最后两处只认 Enter 的确认提示）
  CTX.fillText('← → 选择姓名     ↑ ↓ 选择难度    Enter/E 出发！    Esc 返回',CV.width/2,432);
}

export function drawTitle(){
  const g=CTX.createLinearGradient(0,0,0,CV.height); g.addColorStop(0,'#141a2a');g.addColorStop(1,'#0a0e16');
  CTX.fillStyle=g; CTX.fillRect(0,0,CV.width,CV.height);
  CTX.fillStyle='#ffffff44'; for(let i=0;i<90;i++)CTX.fillRect((i*53)%CV.width,(i*29)%CV.height,2,2);
  const tn=Date.now()/24;
  for(let i=0;i<30;i++){
    const x=((i*83 + tn*(0.35+i%3*0.12)) % (CV.width+16))-8;
    const y=(i*41 + Math.floor(tn/90)) % (CV.height+10)-10;
    const tw=0.5+0.5*Math.sin(tn/70+i*1.7);
    CTX.fillStyle='rgba(255,255,255,'+(0.25+0.4*tw).toFixed(2)+')';
    CTX.fillRect(x,y,2,3);
  }
  CTX.fillStyle='rgba(16,26,42,.85)';
  CTX.beginPath(); CTX.moveTo(0,268); CTX.lineTo(48,178); CTX.lineTo(100,228); CTX.lineTo(172,148); CTX.lineTo(246,232); CTX.lineTo(320,168); CTX.lineTo(398,240); CTX.lineTo(486,156); CTX.lineTo(560,230); CTX.lineTo(640,176); CTX.lineTo(640,480); CTX.lineTo(0,480); CTX.closePath(); CTX.fill();
  CTX.fillStyle='rgba(8,14,24,.92)';
  CTX.beginPath(); CTX.moveTo(0,300); CTX.lineTo(70,238); CTX.lineTo(150,282); CTX.lineTo(260,226); CTX.lineTo(380,300); CTX.lineTo(470,244); CTX.lineTo(560,300); CTX.lineTo(640,258); CTX.lineTo(640,480); CTX.lineTo(0,480); CTX.closePath(); CTX.fill();
  CTX.fillStyle='#0b151d'; CTX.fillRect(0,300,CV.width,180);
  CTX.fillStyle='#ffd24a'; CTX.font='bold 52px sans-serif'; CTX.textAlign='center'; CTX.shadowColor='#ffd24a'; CTX.shadowBlur=30;
  CTX.fillText('潮 灯 记',CV.width/2,180); CTX.shadowBlur=0;
  CTX.fillStyle='#62c6ff'; CTX.font='16px sans-serif'; CTX.fillText('— 灯灭之夜 —',CV.width/2,220);
  CTX.fillStyle=(Math.floor(Date.now()/500)%2)?'#e8eef1':'#7d93a3';
  // v22.86 页脚口径同步：title.onKey 开始新冒险补 E 键别名（Enter/E 同效收尾，与 drawCreate 同批）
  CTX.font='bold 18px sans-serif'; CTX.fillText('按 Enter/E 开始新的冒险',CV.width/2,300);
  CTX.font='bold 14px sans-serif'; CTX.fillStyle='#ffd24a';
  const slotNums=Array.from({length:SAVE_SLOTS},(_,i)=>i+1);
  const slots=slotNums.map(s=>{ const on=S.curSaveSlot===s; return (on?'▶ ':'')+`槽${s}`+(hasSlot(s)?' ✓':'')+(on?' ◀':''); });
  CTX.fillText(slots.join('   '),CV.width/2,340);
  const pv=slotPreview(S.curSaveSlot);
  if(pv){ CTX.fillStyle='#7dd47f'; CTX.font='13px sans-serif'; CTX.fillText(pv,CV.width/2,360); }
  if(hasSave()){ CTX.fillStyle='#62c6ff'; CTX.font='13px sans-serif'; CTX.fillText('按 L 读取当前槽存档 · X 删除当前槽存档(连按两次)',CV.width/2,378); }
  // v22.28 标题画面「内存中未存档冒险」提示（信息透明·纯显示，承 v22.10 beforeunload 离站守卫 /
  // v21.16 标题 R 两按确认 / v21.98 胜利 P 存档同一「未落盘进度防丢失」主线）：Esc 菜单「返回标题」/
  // 阵亡 T / 胜利 T 都会带着内存中的 S.G 回到标题页，而标题画面此前对「有一局未落盘的冒险」零提示——
  // 玩家按 L 读档 / Enter 新开档 / R 重开时，内存里未保存的进度被静默替换（v22.10 只守住了关页/刷新
  // 通道）。现与 beforeunload 守卫同判 S.G && S.unsaved（同读 state.js S.unsaved 一份源：saveGame/load
  // 成功清脏、13 个动作入口置脏），名字/等级/金币读 S.G 单一数据源（与状态页/存档预览同源），
  // 并给出现成的解法「按 P 存档」（v22.28 标题页 P 分支同批落位，与提示同读 S.unsaved 不致误导）。
  if (S.G && S.unsaved) {
    CTX.fillStyle = '#ff9d5b';
    CTX.font = 'bold 12px sans-serif';
    CTX.fillText(`⚠️ 有未存档的冒险：${S.G.name || '守灯人'} Lv.${S.G.level} · ${S.G.gold}金 —— 按 P 存档，读档/新开档将放弃未保存进度`, CV.width/2, 396);
  }
  CTX.fillStyle='#7d93a3'; CTX.font='12px sans-serif';
  // v21.4 标题选槽按键提示（与 main.js title 分派逐字同源）：新增 ←/→（A/D）循环切槽后，提示行同步点名，
  // 保持 v20.3「快捷键可发现性」口径——功能存在就必须能让玩家看到入口；压缩「/」两侧空格抵消新增长度
  // v21.18 可发现性收口：v21.16 给 R 重开加了「两按确认」并把口径写进 H 页存档槽行/README，但标题画面
  // 本行的提示仍只写「L 读档」——玩家正站在按 R 的地点，破坏性按键反而最不可见；本行在 L 读档后补
  // 「R 重开新档(连按两次)」（与 main.js title 分派、core.titleResetCheck 命名字面同口径），12px 估算宽
  // ≈485px ≤640 画布（中心对齐两侧余量 ≈77px），行数/字号/基线逐字不动
  // v23.12 标题页提示行补「[ / ] 音量」口径（体验打磨·可发现性·口径收尾——承 v22.12 主音量调节 /
  // v22.15 教程行 [ / ] 音量 / v22.19 index.html 帮助条同一「功能存在就必须能看到入口」主线：v22.12
  // 起全局快捷键 [ / ] 音量（main.js 全场景生效、含标题画面）的四端口径（H 页「静音 / 音量」行 /
  // README 快速上手表 / 首次进图教程行 / index.html 常驻帮助条）早已齐备，唯独标题画面本提示行只列
  // 「M 静音」不列「[ / ] 音量」——按 M 与按 [ / ] 是同一层级的音频键，站在这行正下方按 [ / ] 却毫无
  // 提示（v21.18「按键提示必须如实反映可用键」同族的最后一块拼图，v22.19 注释「标题 L·R·X」同批
  // 修的是 index.html、本行同为漏网）；现与 M 静音同列收口「 · [ / ] 音量」，与 VOL_STEP（10% 步进）/
  // H 页行/README 上手表/KEY 无 [ ] 冲突同口径，行数/字号/基线逐字未动（追加后缀 12px estW ≈64px，
  // 全行 ≈597px ≤640 画布），纯文字零逻辑零结算零存档零数值变化
  // v23.25 本行删「 · WASD 移动」不实 token（口径收口——承 v21.18「按键提示必须如实反映可用键」：
  // 标题画面 title.onKey 只有 1-3/←→(A/D) 选槽与 L/R/X/P/Enter/E，W/S 按下零反应（W/S 仅在 world 移动 /
  // create 选难度消费），v10.0 起承袭的「WASD 移动」字样与选槽键并排混列属漏网（v21.18 同批修的是
  // H 页与 README、v22.19 修的是 index.html、v23.12 修的是本行 [ / ] 音量，本 token 是同屏最后的
  // 不实项）；删除后本行所余 token（选槽/L/R/Esc/P/M/[ / ] 音量）全部与 title.onKey 分派逐字同源，
  // 纯文字零逻辑零结算零存档零数值变化（删减后 12px 估算宽 ≈533px ≤640 画布，一行字数/基线逐字未动）
  CTX.fillText(`按 ${slotNums.join('/')} 或 ←/→ 选择存档槽 · L 读档 · R 重开新档(连按两次) · Esc 菜单 · P 存档 · M 静音 · [ / ] 音量`,CV.width/2,420);
  // v10.0 可发现性（承接 v9.0 暂停菜单补全）：常驻面板/操作快捷键此前只写在 H 帮助与 README 里，
  // 标题页从未提示——新玩家不开 H 就不知道 I/J/B/C/T/F 这些界面存在。这里补全第二行快捷一览，
  // 与 main.js 世界画面按键分派逐字同源（I状态 J日志 B图鉴 C成就 T旅行 F喝药 H帮助），纯显示不改任何逻辑
  CTX.fillStyle='#5a6a78'; CTX.font='11px sans-serif';
  CTX.fillText('I 状态 · J 日志 · B 记忆图鉴 · C 成就 · T 旅行 · F 喝药 · H 帮助',CV.width/2,442);
  // v19.39 版本号脚注（单一数据源）：data.js GAME_VERSION 与 CHANGELOG 同源，玩家排障/汇报可引用具体版本
  CTX.fillStyle='#3d4a58'; CTX.font='10px sans-serif';
  CTX.fillText(`潮灯记 ${GAME_VERSION}`,CV.width/2,464);
}

export function drawStory(){
  drawWorld(); panel(40,300,560,140,'');
  const shown=Math.min(S.storyPage, STORY.length);
  for(let i=0;i<shown;i++){
    const isNew=(i===shown-1&&shown>1);
    let a=1;
    if(isNew){ a=Math.max(0.03,Math.min(1,(Date.now()-S.storyLineAt)/450)); }
    CTX.globalAlpha=a;
    text(STORY[i],60,334+i*22,['bold 16px','15px','15px','15px','bold 16px'][i], i===0?'#ffd24a':'#e8eef1');
    CTX.globalAlpha=1;
  }
  // v21.74 页脚口径同步：story.onKey 补 E 键别名后，逐帧提示如实标注双键
  // （承 v21.18/v21.70「按键提示必须如实反映可用键」主线）；瞬时消息（ms=0）机制逐字未动。
  boxMsg('按 Enter / E 继续',0);
}
bind.drawStory=drawStory;

export function drawDead(){
  const hero = S.G, enemy=S.enemy;
  CTX.fillStyle='rgba(5,8,12,.95)'; CTX.fillRect(0,0,CV.width,CV.height);
  text('你 倒 下 了 ……',CV.width/2,168,'bold 38px','#e14b3f','center');
  if (hero) {
    const killName=(enemy&&enemy.name)?enemy.name:((hero._bossRetry&&hero._bossRetry.name)||null);
    const kills=Object.values(hero.bestiary||{}).reduce((a,b)=>a+b,0);
    if(killName) text('败于 '+killName,CV.width/2,206,'bold 15px','#ff8a5b','center');
    // v23.10 阵亡画面战绩行补困难档标注（体验打磨·信息透明·同一口径——承 状态页 I「[困难 · 魔物HP×…]」/
    // HUD ⚡ 角标/标题槽预览难度 同一「困难档可见性」主线的 run 总结屏收口：阵亡/胜利/尾声三屏战绩行此前
    // 一字没有难度标志，玩家困难档倒下时只能凭记忆确认这是困难局（v23.08 难度行四端口径唯独总结屏缺席）；
    // 现三屏同读 hero.diff · DIFFS 单一数据源（menus.js 既有 import），困难档追加「 · 困难」、普通档
    // 零后缀零噪音零位移（y=236 逐字未动），纯显示零结算零存档零数值变化。
    // v23.79 体验打磨·信息透明·纯显示：阵亡画面战绩行补「📍 阵亡地点」（「我在哪」单一数据源口径收口——
    // 承 v19.89 状态页「📍 地图名」/ v23.27 快速旅行「当前所在地标注」/ v23.77 暂停菜单「📍 地图名」/
    // v23.78 战斗画面「📍 所在地」同一主线：五屏决策现场逐屏核对，唯有阵亡复盘屏查无一行——玩家倒在强敌
    // 面前（祭坛/试炼碑/传送门直接切战，死时战场可能在雾语林还是星井矿脉），「B 重整旗鼓 / R 重开 /
    // T 回标题」三选一现场却看不到地点（v22.93 未存档提示 / v22.95 冒险进度行刚把另两项决策信息带进
    // 本屏）；现与 drawStatus/drawPause/drawBattle 同读 (MAPS[curMap()]||{}).name||curMap() 一份单一
    // 数据源（防御式：加/删/改名地图自动跟随零裸字面量；curMap 为 state.js 既有全局函数、MAPS 既有
    // import 零新增依赖），在战绩行（y=236）v23.10 困难档后缀之后追加「 · 📍地图名」——与 v23.10 同
    // 款同式行内后缀（战绩行其余字段/余粮行/建议行/收集行/五徽记行/按键行/未存档行逐字未动），
    // 纯显示零结算零存档零数值变化；最长档「当前 Lv.12 · 金币 3000 · 累计讨伐 300 只 · ⏱️120:00 ·
    // 困难 · 📍星井矿脉」13px 居中 estW ≈430 ≤ 640 画布（基线零位移）。
    text(`当前 Lv.${hero.level} · 金币 ${hero.gold} · 累计讨伐 ${kills} 只 · ⏱️${fmtTime(hero.time)}` + (hero.diff ? ' · ' + DIFFS[hero.diff] : '') + ` · 📍${(MAPS[curMap()] || {}).name || curMap()}`,CV.width/2,236,'13px','#7d93a3','center');
    // v19.88 阵亡画面追加剩余补给（信息透明·纯显示）：死亡结算屏此前只报 等级/金币/讨伐/时间，
    // 但玩家紧接着要做「R 重开 / B 重整旗鼓 / T 回标题」的决策，身上还剩多少药水/灵药/蘑菇直接影响
    // 「是否需要先回旅馆/酿造」。现在直接读 hero.item / hero.potion2 / hero.mushrooms，零结算变化。
    text(`身上余粮：🍖 生命药水 ${hero.item} 瓶 · 🧪 高级灵药 ${hero.potion2 || 0} 瓶 · 🍄 魔法蘑菇 ${hero.mushrooms || 0} 株`,CV.width/2,264,'13px','#e8eef1','center');
    const bossDeath=!!(hero._bossRetry && hero._bossRetry.bossId && hero._bossRetry.bossId!=='rush');
    // v21.41 战败提示图鉴入口口径修正（信息透明·口径一致，承 v21.29-32/v21.38-40「同一功能所有入口
    // 口径一致」主线）：普通战败分支原写「用记忆图鉴(B)查看魔物强度后再战」——但 dead 画面的 B 实际
    // 绑定 retryBoss（main.js dead.onKey：强敌战败=重整旗鼓、普通战败/试炼 rush=无反应），图鉴入口
    // 只在世界画面（world.onKey 的 B → codex）；且 codex.onKey 关闭走 backWorld——从 dead 场景打开图鉴
    // 再关会错回 world，故此处只如实标注入口（「图鉴在世界画面按 B 打开」），不绑 B→图鉴，纯文字零行为。
    text(bossDeath?`💡 建议：先回旅馆补给并练级，再按 B 重整旗鼓挑战${hero._bossRetry.name||'强敌'}！`:'💡 建议：回村 旅馆/喷泉 补给，再战前先用记忆图鉴看清魔物强度（图鉴在世界画面按 B 打开）。',CV.width/2,292,'13px',bossDeath?'#ffd24a':'#a8ff8a','center');
    // v22.3 阵亡画面收集行补「🕯️ 记忆碎片 N/4」（体验打磨·信息透明，承 v22.1 状态页碎片 / v22.2 胜利画面碎片 /
    // v21.96 阵亡收集三件套同一主线）：碎片进度的常驻/总结屏逐屏核对——尾声战绩行 v19.49「记忆 N/N」、J 日志
    // 「记忆碎片」节、状态页资源行 v22.1 🕯️ N/4、胜利画面收集行 v22.2 🕯️ 记忆碎片 N/4 四端齐备，唯独本屏
    // （drawDead）收集行（🏆/📕/📦）仍无碎片——玩家倒在强敌面前判断「B 重整旗鼓 / R 重开新档」时，真结局关键
    // 收集（FRAGMENTS 四枚强敌首胜掉落）无回声；现与其余四端同读 hero.fragments / FRAGMENTS.length 一份单一
    // 数据源（(hero.fragments||[]) 防御式旧档零迁移），纯显示零结算零存档变化。
    // v21.96 阵亡画面补收集进度三件套（信息透明·纯显示，承 v21.79 标题预览 slotPreview / v21.82 胜利画面
    // drawWin / v21.87 尾声战绩页 drawEnding / v21.94 状态页资源行同一「收集进度三件套」主线）：四屏齐备后
    // 逐屏核对 run 战果口径屏，阵亡画面（drawDead）是唯一仍缺 成就/图鉴/宝箱 的屏——它有 等级/金币/讨伐/时长
    // 战绩行与余粮行（v19.88），但玩家倒在强敌面前想判断「这趟值不值得 B 重整旗鼓 / R 重开新档」，一眼
    // 看不到收集三件套收到哪了；现与 slotPreview/drawWin/drawEnding 同读 ACH_LIST / BESTIARY_TARGET /
    // chestCount·chestTotal 一份单一数据源（chestCount 三形态防御式、|0 归一旧档零迁移），新增行 y=312
    // （建议行 292 与 R 提示 332 之间、行间 20px ≥16 不触），其余行零位移，纯显示零结算零存档变化。
    const codexN = BESTIARY_TARGET.filter((n) => ((hero.bestiary || {})[n] | 0) >= 1).length;
    const chestN = chestCount(hero);
    const fragN = (hero.fragments || []).length;
    text(`🏆 成就 ${(hero.ach||[]).length}/${ACH_LIST.length} · 📕 图鉴 ${codexN}/${BESTIARY_TARGET.length} · 📦 宝箱 ${chestN}/${chestTotal()} · 🕯️ 记忆碎片 ${fragN}/${FRAGMENTS.length}`,CV.width/2,312,'bold 13px','#7dd47f','center');
  }
  text('按 R 重新开始本次冒险',CV.width/2,332,'15px','#7d93a3','center');
  text('按 T 返回标题画面',CV.width/2,362,'15px','#7d93a3','center');
  if(hero && hero._bossRetry && hero._bossRetry.bossId!=='rush') text('按 B 重整旗鼓，再战强敌！',CV.width/2,392,'15px','#ffd24a','center');
  // v22.93 阵亡画面「未存档」提示（体验打磨·防误丢档·存档闭环收口，承 v22.10 beforeunload 守卫 /
  // v22.28 标题页 P 存档 / v22.30 暂停菜单未存档提示同一「未落盘进度防丢失」主线）：战败复盘屏是
  // 玩家「R 重开 / B 重整旗鼓 / T 回标题」三选一的决策现场——未存档的进行中冒险（S.G && S.unsaved）
  // 按 R 即整段丢弃、按 T 回标题后本局再无落盘机会（存入口只剩标题页 P，且标题页 P 存的正是这局的
  // 进行中状态、随后才能 L 读回续玩）；与 victory 屏 v21.98「按 P 存档 + 本局战果未自动存档」闭环相比，
  // dead 屏既无提示也无 P 分支（v21.70 注释以「战败语境下重开是显式三选一的常态出口」为由维持 R 单击，
  // 但那只是 R 不两按确认的理由、不是不提示的理由）；现复用 pauseSaveHint 纯函数同一份文案（与暂停
  // 菜单同源：调文案只改一处、槽位占位分档「已有存档将覆盖/空槽」），落 12px 橙行 y=412（B 行 392 之下、
  // 画布底 480 之内、行间 20 ≥16 不触、上方全部逐字零位移），S.unsaved=false 时零噪音；纯显示零结算
  // 零存档格式变化（P 存档入口见 main.js dead.onKey 注释）。
  const deadHint = pauseSaveHint(hero, S.unsaved, S.curSaveSlot, hasSlot(S.curSaveSlot));
  if (deadHint) text(deadHint, 320, 412, '12px', '#ff9d5b', 'center');
  // v22.95 阵亡画面补「冒险进度」行（体验打磨·信息透明·下一步指引，承 v22.89 胜利画面同一
  // 「run 总结屏信息补齐」主线）：dead 屏是「R 重开 / B 重整旗鼓 / T 回标题」三选一的决策现场，
  // 但五徽记（灯芯/星井/回廊/初灯/试炼场）在此屏一字没有——玩家倒在强敌面前判断这趟值不值得
  // B 重整旗鼓 / R 重开时，下一步去哪只能按 I 或开 J 日志才能查到（win 屏 v22.89 已有此行）；
  // 现与状态页五徽记 / drawWin 同读 quests.adventureProgress(hero) 一份单一数据源（✓/✗ 五档同式），
  // 落 12px 灰行 y=432（提示行 412 之下、画布底 480 之内、行间 20 ≥16 不触、上方全部逐字零位移，
  // 与 drawWin 434 行同款渲染式），纯显示零结算零存档零数值变化。
  if (hero) {
    const progD = adventureProgress(hero);
    text('冒险进度：' + progD.map(([nm, dn]) => (dn ? '✓ ' : '✗ ') + nm).join(' · '), CV.width / 2, 432, '12px', '#7d93a3', 'center');
  }
}
bind.drawDead=drawDead;

export function drawWin(){
  CTX.fillStyle='rgba(5,8,12,.96)'; CTX.fillRect(0,0,CV.width,CV.height);
  drawMonster(CV.width/2, 210, BOSS);
  CTX.fillStyle='#ffd24a'; CTX.font='bold 40px sans-serif'; CTX.textAlign='center';
  CTX.fillText('灯 芯 回 来 了',CV.width/2, 300);
  CTX.fillStyle='#e8eef1'; CTX.font='16px sans-serif';
  CTX.fillText(`最终等级 Lv.${S.G.level} · 金币 ${S.G.gold}`,CV.width/2,340);
  // v19.49 战绩补全（信息透明·纯显示）：胜利画面此前只报 等级/金币，是唯一一处「战绩口径」缺失的
  // run 总结屏——阵亡画面早有（等级/金币/累计讨伐/时间），尾声战绩页更有（讨伐/成就/记忆/金币/时间），
  // 唯独「灯芯回来了」的瞬间看不到这趟的累计讨伐、成就数与冒险时长，想回味得先按 Enter 进尾声；
  // 此处按同一口径补齐（与 drawDead/drawEnding 同读 hero.bestiary/hero.ach/hero.time，绝无第二套
  // 数据源，成就上限读 ACH_LIST 单一数据源），居中 14px 不抢主标题与按钮行，纯显示零结算变化
  const kills=Object.values(S.G.bestiary||{}).reduce((a,b)=>a+b,0);
  CTX.fillStyle='#a8ff8a'; CTX.font='bold 14px sans-serif';
  // v23.10 胜利画面战绩行补困难档标注（与 drawDead/drawEnding 同读 hero.diff·DIFFS 一份源，y=362 零位移）
  // v23.81 体验打磨·信息透明·纯显示：胜利画面战绩行补「📍 所在地」（「我在哪」单一数据源口径的最后
  // 两屏——承 v19.89 状态页 / v23.27 快速旅行 / v23.77 暂停菜单 / v23.78 战斗画面 / v23.79 阵亡画面
  // 同一主线：五屏决策现场齐备后，run 总结屏全家桶里的胜利/尾声两屏仍查无一行——「灯芯回来了」是本局
  // 唯一的存档/重开/尾声决策现场，玩家刚打赢想回补给（v23.78 同款动机），战绩行却不说自己现在在幽暗森林
  // 祭坛；尾声页（真结局在终焉水晶 / 非真结局经胜利画面进）同为总结屏；现与 drawStatus/drawPause/
  // drawBattle/drawDead 同读 (MAPS[curMap()]||{}).name||curMap() 一份单一数据源（防御式：加/删/改名
  // 地图自动跟随零裸字面量；menus.js 既有 MAPS import 与 curMap 复用零新增依赖），在 v23.10 困难档
  // 后缀之后追加「 · 📍地图名」——与 v23.79 同款同式行内后缀（战绩行其余字段/收集行/进度行/页脚
  // 逐字未动），纯显示零结算零存档零数值变化；最长档「累计讨伐 300 只 · 成就 73/73 · ⏱️120:00 ·
  // 困难 · 📍幽暗森林」bold 14px 实测 ≈340.5px 居中右缘 ≈490.3 ≤ 640 画布（基线零位移）。
  CTX.fillText(`累计讨伐 ${kills} 只 · 成就 ${(S.G.ach||[]).length}/${ACH_LIST.length} · ⏱️${fmtTime(S.G.time)}` + (S.G.diff ? ' · ' + DIFFS[S.G.diff] : '') + ` · 📍${(MAPS[curMap()] || {}).name || curMap()}`,CV.width/2,362);
  // v21.82 胜利画面补收集进度两件（信息透明·纯显示）：v19.49 战绩行已有 成就 N/M（三件套之一），
  // 但 v21.79 标题预览确立的「收集进度三件套」（成就·图鉴·宝箱）在「灯芯回来了」这一刻仍缺 图鉴 N/13
  // 与宝箱 N/12——玩家站在这趟 run 的总结屏上想「继续收集还是 R 重开/Enter 尾声」，一眼看不到
  // 图鉴/宝箱收到哪了；现与 slotPreview（v21.79）/成就页/图鉴页/状态页同读 BESTIARY_TARGET /
  // chestCount·chestTotal 一份单一数据源，绝无第二套口径；页脚下移 380→396 让位（画布 640×480
  // 垂直富余，主标题/怪物/战绩行全部零位移），纯显示零结算零存档变化。
  const codexN = BESTIARY_TARGET.filter((n) => ((S.G.bestiary || {})[n] | 0) >= 1).length;
  const chestN = chestCount(S.G);
  // v22.2 胜利画面收集行补「🕯️ 记忆碎片 N/4」（信息透明·纯显示，承 v22.1 状态页 / v19.49 尾声战绩行同一
  // 主线）：drawWin 的收集行 v21.82 起只有 图鉴/宝箱 两件——但「灯芯回来了」正是幽冥魔王首胜掉落
  // 「碎片·灯卫的誓」的瞬间（battle.winBattle 强敌首胜掉落分支），刚捡起的真结局关键收集在这块 run
  // 总结屏上无回声；现与 drawEnding/drawStatus/drawJournal 同读 (S.G.fragments||[]).length /
  // FRAGMENTS.length 一份单一数据源（防御式旧档零迁移），纯显示零结算零存档变化。
  const fragW = (S.G.fragments || []).length;
  CTX.fillStyle='#7dd47f'; CTX.font='bold 14px sans-serif';
  CTX.fillText(`📕 图鉴 ${codexN}/${BESTIARY_TARGET.length} · 📦 宝箱 ${chestN}/${chestTotal()} · 🕯️ 记忆碎片 ${fragW}/${FRAGMENTS.length}`,CV.width/2,378);
  CTX.fillStyle='#7d93a3'; CTX.font='14px sans-serif';
  // v21.70 胜利画面 R 重开提示补「连按两次」（可发现性·与 main.js win.onKey 两按确认、标题页提示行
  // 「R 重开新档(连按两次)」同口径，承 v21.18「按键提示必须如实反映防误触口径」主线）：win 的 R 自
  // 本版起为两段触发，页脚仍写单击口径会让玩家以为提示过期/失效；只改文案，字号/基线/颜色逐字未动。
  // v21.82 页脚 y 380→396 让位给上方收集进度行（文案逐字未动）。
  // v21.98 页脚补 P 存档口径 + 「战果未自动存档」提示行（体验打磨·信息透明·存档闭环，承 v21.70 防误触
  // 口径）：win 场景的 saveGame 此前不可达（P 无分支、暂停菜单不可进），胜利战果无法落盘——现在页脚补
  // 「按 P 存档」（与 main.js win.onKey P 分支逐字同口径），另加一行 12px 灰字提示「本局战果未自动存档 ·
  // 按 P 存进当前槽，回标题按 L 读档即可继续冒险」（y=416，与页脚 396 行间 20px ≥16 不触、画布底 480
  // 富余），Enter/R 分支与上方收集行逐字零位移，纯显示零结算零存档变化。
  // v22.85 页脚口径同步：win.onKey 观看尾声补 E 键别名后，页脚如实标注双键
  // （承 v21.18/v21.70「按键提示必须如实反映可用键」主线）；P/R/Esc 口径逐字未动。
  CTX.fillText('按 Enter/E 观看尾声 · 按 P 存档 · 按 R 重开新档(连按两次)',CV.width/2,396);
  CTX.fillStyle='#5a6a78'; CTX.font='12px sans-serif';
  CTX.fillText('💡 本局战果未自动存档 · 按 P 存进当前槽，回标题按 L 读档即可继续冒险',CV.width/2,416);
  // v22.89 胜利画面补「冒险进度」行（体验打磨·信息透明·下一步指引，承 v19.49 战绩补全 / v21.82 收集行 /
  // v22.2 碎片行同一「run 总结屏信息补齐」主线）：胜利画面是「灯芯回来了」的总结屏——玩家刚讨回灯芯，
  // 下一步去哪（星井矿脉·洞窟领主 → 双徽记 → 无字回廊·终焉之神 / 试炼场）在此屏一字没有，还得按 I 或
  // 开 J 日志才能查到；现与状态页五徽记同读 quests.adventureProgress(S.G) 一份单一数据源（✓/✗ 五档：
  // 灯芯/星井/回廊/初灯/试炼场，bossDefeated 已亮 ✓、其余灰 ✗ 一眼看清路还长），落 12px 灰行 y=434
  // （提示行 416 之下、画布底 480 之内、行间 18 ≥16 不触，上方全部逐字零位移），纯显示零结算零存档零数值变化。
  const progW = adventureProgress(S.G);
  CTX.fillStyle='#7d93a3'; CTX.font='12px sans-serif';
  CTX.fillText('冒险进度：' + progW.map(([nm, dn]) => (dn ? '✓ ' : '✗ ') + nm).join(' · '),CV.width/2,434);
}
bind.drawWin=drawWin;

export function drawEnding(){
  const hero = S.G;
  drawWorld(); CTX.fillStyle='rgba(5,8,12,.92)'; CTX.fillRect(0,0,CV.width,CV.height);
  // v22.96 面板加高 300→330（底缘 410→440，画布底 480 之内、零行位移）：为新增的「冒险进度」行让位
  panel(40,110,560,330,'');
  // 真结局差分：记忆碎片集齐则追加「全记忆」页（行距收窄以容下 8 行，不溢面板）
  const allFrag = FRAGMENTS.every((f) => (hero.fragments || []).includes(f.id));
  const lines = hero.trueBoss ? (allFrag ? ENDING_TRUE.concat(ENDING_TRUE_FRAG) : ENDING_TRUE) : ENDING;
  const step = lines.length > 5 ? 25 : 30;
  const y0 = lines.length > 5 ? 146 : 166;
  lines.forEach((l,i)=>text(l,320,y0+i*step,'bold 16px','#e8eef1','center'));
  // v23.10 尾声战绩行补困难档标注（与 drawDead/drawWin 同读 hero.diff·DIFFS 一份源，y=346 零位移）
  // v23.81 体验打磨·信息透明·纯显示：尾声战绩行补「📍 所在地」（与 drawWin 同批，见 drawWin v23.81
  // 注释同款口径——与五屏决策现场同读 (MAPS[curMap()]||{}).name||curMap() 一份单一数据源、v23.10 困难
  // 档后缀之后追加「 · 📍地图名」同款同式行内后缀（战绩行其余字段/收集行/进度行/页脚逐字未动），
  // 纯显示零结算零存档零数值变化；最长档「战绩 · 累计讨伐 300 只 · 成就 73/73 · 记忆 4/4 · 金币
  // 9999 · ⏱️120:00 · 困难 · 📍无字回廊」13px 实测 ≈469.6px 居中右缘 ≈554.8 ≤ 560 面板右缘）。
  text(`战绩 · 累计讨伐 ${Object.values(hero.bestiary||{}).reduce((a,b)=>a+b,0)} 只 · 成就 ${(hero.ach||[]).length}/${ACH_LIST.length} · 记忆 ${(hero.fragments||[]).length}/${FRAGMENTS.length} · 金币 ${hero.gold} · ⏱️${fmtTime(hero.time)}` + (hero.diff ? ' · ' + DIFFS[hero.diff] : '') + ` · 📍${(MAPS[curMap()] || {}).name || curMap()}`,320,346,'13px','#7d93a3','center');
  // v21.87 尾声战绩页补收集进度两件（信息透明·纯显示）：v19.49 战绩行（讨伐/成就/记忆/金币/时长）
  // 已覆盖 run 总结屏的战果口径，但 v21.79 标题预览/v21.82 胜利画面确立的「收集进度三件套」
  // （成就·图鉴·宝箱）在「按 Enter 观看尾声」这一刻仍缺 图鉴 N/13 与 宝箱 N/12——玩家站在这趟
  // run 最后的总结屏上想「继续收集还是回标题」，一眼看不到图鉴/宝箱收到哪了；现与 slotPreview
  // /drawWin 同读 BESTIARY_TARGET / chestCount·chestTotal 一份单一数据源（chestCount 三形态
  // 防御式），绝无第二套口径；新增行 366、页脚 376→396 让位（文案逐字未动），战绩行/故事行零位移，
  // 纯显示零结算零存档变化。
  const codexN = BESTIARY_TARGET.filter((n) => ((hero.bestiary || {})[n] | 0) >= 1).length;
  const chestN = chestCount(hero);
  text(`📕 图鉴 ${codexN}/${BESTIARY_TARGET.length} · 📦 宝箱 ${chestN}/${chestTotal()}`,320,366,'bold 13px','#7dd47f','center');
  // v22.85 页脚口径同步：ending.onKey 返回标题补 E 键别名后，页脚如实标注双键
  // （承 v21.18「按键提示必须如实反映可用键」主线），13px estW ≈125 ≤470 预算，纯文字零逻辑。
  text('按 Enter/E 返回标题',320,396,'13px','#7d93a3','center');
  // v22.96 尾声画面补「冒险进度」五徽记行（体验打磨·信息透明·下一步指引，承 v22.89 胜利画面 /
  // v22.95 阵亡画面同一「run 总结屏信息补齐」主线收口）：尾声是「按 Enter 观看尾声」的终局屏——真结局在
  // 击败终焉之神后由 winBattle 直接 goto('ending')（无胜利画面垫场），它就是真结局的总结屏；此前五徽记
  // （灯芯/星井/回廊/初灯/试炼场）在此屏一字没有：真结局档想确认「试炼场还差没差」、非真结局档想确认
  // 「下一步去哪（星井/回廊/初灯/试炼场）」只能按 I 或开 J 日志才能查到（状态页 / drawWin / drawDead
  // 早已齐备，尾声是 run 总结屏全家桶里最后一块）；现与状态页五徽记 / drawWin / drawDead 同读
  // quests.adventureProgress(hero) 一份单一数据源（✓/✗ 五档同式），落 12px 灰行 y=420（页脚 396 之下、
  // 面板底缘 440 之内（v22.96 面板加高 300→330 让位，上方 346/366/396 全部逐字零位移）、行间 24 ≥16
  // 不触、距面板底 20 ≥16），纯显示零结算零存档零数值变化。
  const progE = adventureProgress(hero);
  text('冒险进度：' + progE.map(([nm, dn]) => (dn ? '✓ ' : '✗ ') + nm).join(' · '), 320, 420, '12px', '#7d93a3', 'center');
}
bind.drawEnding=drawEnding;
