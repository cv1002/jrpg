// ============================================================
// view/menus.js —— 商店 / 状态 / 标题等界面
// ============================================================
import { S, curMap } from '../state.js';
import { SKILL_DATA, BESTIARY_TARGET, HELP_PAGES, TRAVEL_LIST, ENDING, ENDING_TRUE, ENDING_TRUE_FRAG, STORY, HERO_NAMES, DIFFS, WEAPONS, ARMORS, ACH_LIST, NPCS, BOSS, baseStats, CHARGE_MULT, codexTag, DIFF_SCALE, INN_PRICE, BREW_MUSHROOMS, BREW_GOLD, POTION_CAP, ELIXIR_HP_PCT, ELIXIR_MP_PCT, FRAGMENTS, LEVEL_GROWTH, CRIT_RATE, CRIT_MULT, ELITE_CHANCE, ELITE_GOLEM } from '../data.js';
import { monReward, skillEstimate, codexStats, spawnLv, pageShownAt, wrapTalkLine } from '../rules.js';
import { hasSlot, hasSave, slotPreview, skillXpHint } from '../core.js';
import { questLines, questJournal, questRewardPreview, adventureProgress, QUEST_TAG } from '../quests.js';
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
  text('绿色▲=更强升级 灰色=买不起 · ↑↓选择  Enter购买  Esc离开',320,470,'12px','#7d93a3','center');
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
  text('[Enter] 住宿休息   [Esc] 离开',320,275,'13px','#7d93a3','center');
}

export function drawBrew(){
  const hero = S.G;
  drawWorld(); panel(100,80,440,300,'🧪 药水酿造');
  text(`魔法蘑菇 ${hero.mushrooms} 株    金币 ${hero.gold}    已酿灵药 ${hero.potion2||0} 瓶`,320,140,'15px','#e8eef1','center');
  text(`配方：${BREW_MUSHROOMS} 株魔法蘑菇 + ${BREW_GOLD} 金币 → 高级灵药 ×1`,320,180,'14px','#ffd24a','center');
  // 灵药描述由 ELIXIR_* 常量推导（v16.1 收口结算/战斗预览/商店文案时漏掉的最后一处旧字面量）：与 takePotion 逐字同源
  text(`高级灵药：恢复 ${Math.round(ELIXIR_HP_PCT * 100)}% HP + ${Math.round(ELIXIR_MP_PCT * 100)}% MP`,320,210,'13px','#7d93a3','center');
  if(hero.mushrooms>=BREW_MUSHROOMS&&hero.gold>=BREW_GOLD) text('按 Enter 酿造    按 Esc 离开',320,262,'14px','#62c6ff','center');
  else text(`材料不足（还差 ${Math.max(0,BREW_MUSHROOMS-hero.mushrooms)} 株蘑菇、${Math.max(0,BREW_GOLD-hero.gold)} 金币）    按 Esc 离开`,320,262,'13px','#e14b3f','center');
}

export function drawStatus(){
  const hero = S.G;
  drawWorld(); panel(70,28,500,424,'— 状态 —');
  const b=baseStats(hero.level);
  text(`${hero.name}  Lv.${hero.level}  ${hero.diff?`[困难 · 魔物HP×${DIFF_SCALE.hp} 攻×${DIFF_SCALE.atk} 防×${DIFF_SCALE.def}]`:''}`,320,72,'bold 18px','#ffd24a','center');
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
  text(`金币：${hero.gold}    药水🍖:${hero.item}  灵药🧪:${hero.potion2||0}   ⏱️${fmtTime(hero.time)}`,110,264,'14px');
  text('已学技能：',110,288,'bold 14px','#ffd24a');
  hero.skills.forEach((s,i)=>{
    const sd=SKILL_DATA[s];
    // v7.4: 技能行补齐 MP 消耗（与战斗技能菜单同源 SKILL_DATA.mp，信息透明·状态页可规划消费）
    text(`· ${s}${sd&&sd.hint?'（'+sd.hint+'）':''}${sd&&sd.mp?` · ${sd.mp} MP`:''}`,120,308+i*16,'12px','#e8eef1');
  });
  const sx=skillXpHint(hero);
  const sxd=sx?SKILL_DATA[sx.name]:null;
  // v7.4: 下一技能提示同步补 MP（与已学技能行同一来源）
  text(sx?`📖 下一技能：${sx.name}（Lv.${sx.lv} · 还差 ${sx.remain} 经验${sxd&&sxd.mp?` · ${sxd.mp} MP`:''}）`:'✨ 已习得全部技能',110,396,'12px',sx?'#62c6ff':'#7d93a3');
  text('冒险进度：',110,412,'bold 13px','#ffd24a');
  adventureProgress(hero).forEach(([nm,dn],i)=>text((dn?'✓':'✗')+' '+nm,190+i*88,412,'12px',dn?'#4cd964':'#5a6a78'));
  const {main,sides}=questLines(hero);
  text('主线：'+main,110,434,'11px','#e8eef1');
  text((sides[0] ? ('支线：'+sides[0]) : '支线：暂无')+'   ·  J 任务日志',110,450,'11px',sides[0]?'#a8ff8a':'#7d93a3');
}

function whereFind(name){
  // v14.5 图鉴位置标注与地图数据同源（data.js MAPS 的 extras）：
  // - v13.7 剧情重构后终焉之神已随主线迁至无字回廊东端祭坛（原「星井矿脉·终焉水晶」为旧位置，水晶已化为开门机关）；
  // - 残焰魔像（回廊中段精英）此前缺表项，会误显「草丛随机遇敌」——补上。
  const LOC={'石心魔像':'雾语林·稀有精英','幽冥魔王':'雾语林祭坛','洞窟领主':'星井矿脉深处','终焉之神':'无字回廊东端','残焰魔像':'无字回廊中段'};
  let loc = LOC[name]||'草丛随机遇敌';
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
  const rows=BESTIARY_TARGET.map(n=>({n,got:!!(hero.bestiary||{})[n]}));
  if(names.length===0){
    text('尚未击败任何敌人。',320,170,'16px','#ffd24a','center');
    text('前往雾语林的草丛，开始你的冒险吧！',320,200,'14px','#7d93a3','center');
  } else {
    if(S.codexScroll<0) S.codexScroll=0;
    if(S.codexScroll>rows.length-PAGE) S.codexScroll=Math.max(0,rows.length-PAGE);
    const shown=rows.slice(S.codexScroll,S.codexScroll+PAGE);
    shown.forEach((r,i)=>{
      const y=92+i*30;
      if(!r.got){ text('❓ ？？？',120,y,'15px','#5a6a78'); text('未讨伐',420,y,'14px','#4b5a66','right'); return; }
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
      if(rw) text(`→ 击败可得：经验 ${rw.xp} · 金币 ${rw.gold}${st?` · HP${st.hp} 攻${st.atk} 防${st.def}`:''}${tagStr}`,124,y+16,'11px','#7d93a3');
    });
  }
  const total=names.reduce((a,n)=>a+hero.bestiary[n],0);
  const have=BESTIARY_TARGET.filter(n=>(hero.bestiary||{})[n]>=1).length;
  text(`记忆收录：${have}/${BESTIARY_TARGET.length}`,320,404,'14px','#62c6ff','center');
  text(`累计讨伐：${total}   ·   额外掉落：${hero.drops||0}`,320,426,'14px','#ffd24a','center');
  const remain=names.length>0?(rows.length-(S.codexScroll+PAGE)):0;
  text(`按 B / Esc 关闭${remain>0?`   ·   ↑↓ 滚动浏览（还有 ${remain} 种）`:''}`,320,448,'12px','#7d93a3','center');
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
    if(prog) text(prog,470,y,'bold 13px',done?'#62c6ff':'#7d93a3','right');
  });
  const remain=ACH_LIST.length-(S.achScroll+PAGE);
  text(remain>0?`还有 ${remain} 项未在本页显示`:'全部成就已在当前页',320,412,'12px','#7d93a3','center');
  text(`按 C / Esc 关闭${remain>0?`   ·   ↑↓ 滚动浏览`:''}`,320,430,'12px','#7d93a3','center');
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

function drawQuestCard(e, hero, x, y, w, yMax) {
  const col = QST_COL[e.status] || '#e8eef1';
  const hot = e.status === 'active' || e.status === 'turnin' || e.status === 'offer';
  const showWhere = !!(e.where && e.status !== 'locked' && e.status !== 'done');
  const rw = e.kind === 'side' ? rewardHint(hero, e) : '';
  const h = e.status === 'done' ? 34 : e.status === 'locked' ? 50 : (showWhere || rw ? 70 : 54);
  if (y + h > yMax) return 0;
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
    text('按 J / Esc 关闭', 320, 432, '12px', '#7d93a3', 'center');
    return;
  }
  const cx = 86;
  const cw = 468;
  const yMax = 418;
  let y = 66;
  CTX.save();
  CTX.beginPath();
  CTX.rect(78, 54, 484, yMax - 54);
  CTX.clip();
  if (mains.length) {
    drawSectionHead('主线', cx, y, '#ffd24a');
    y += 12;
    mains.forEach((e) => { y += drawQuestCard(e, hero, cx, y, cw, yMax); });
    y += 6;
  }
  if (sides.length && y + 24 < yMax) {
    drawSectionHead('支线', cx, y, '#a8ff8a');
    y += 12;
    sides.forEach((e) => { y += drawQuestCard(e, hero, cx, y, cw, yMax); });
  }
  // 记忆碎片（data.js FRAGMENTS 单一数据源）：强敌首胜掉落，未收集灰占位不剧透
  if (y + 24 < yMax) {
    y += 6;
    drawSectionHead('记忆碎片', cx, y, '#8fd0ff');
    y += 16;
    for (const f of FRAGMENTS) {
      if (y + 15 > yMax) break;
      const got = (hero.fragments || []).includes(f.id);
      if (got) {
        text('🕯️ ' + f.name, cx + 6, y, 'bold 12px', '#cfe8ff');
        text(ellipsize(f.text, '11px', cw - 150), cx + 150, y, '11px', '#8aa0b0');
      } else {
        text('🕯️ ？？？', cx + 6, y, '12px', '#4a5a66');
      }
      y += 16;
    }
  }
  CTX.restore();
  text('按 J / Esc 关闭', 320, 432, '12px', '#7d93a3', 'center');
}

export function drawHelp(){
  drawWorld(); panel(70,28,500,424,'— 操作说明 —');
  const P=HELP_PAGES[S.helpPage];
  P.forEach((r,i)=>text(`${r[0]}   ${r[1]}`,100,80+i*34,'14px',i===P.length-1?'#ffd24a':'#e8eef1'));
  text(`第 ${S.helpPage+1}/${HELP_PAGES.length} 页   ·   ← → 翻页   ·   H/Esc 关闭`,320,452,'12px','#7d93a3','center');
}

export function drawTravel(){
  const hero = S.G;
  drawWorld(); panel(120,60,400,320,'🧭 快速旅行');
  TRAVEL_LIST.forEach(([k,nm,desc,hint],i)=>{
    const on=i===S.travelSel, unlocked=hero.visited.includes(k);
    // 当前所在地标注（信息透明·纯显示）：绿色 📍 一眼看出自己在哪，避免误传送
    const here=k===curMap();
    text((on?'▶ ':'  ')+(unlocked?nm:'？？？ · 未探索')+(here?' 📍':''),180,110+i*52,'16px',on?'#ffd24a':(unlocked?'#e8eef1':'#7d93a3'));
    if(unlocked&&desc) text(desc,180,110+i*52+19,'11px','#7d93a3');
    if(unlocked&&hint) text(hint,478,110+i*52,'bold 11px','#ffd24a','right');
  });
  text('↑↓ 选择  ·  Enter 传送  ·  Esc 取消',320,270,'12px','#7d93a3','center');
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

export function drawPause() {
  const hero = S.G;
  drawWorld();
  panel(140, 48, 360, 392, '— 菜单 —');
  text((hero ? hero.name : '守灯人') + '  ·  槽 ' + S.curSaveSlot, 320, 92, '13px', '#62c6ff', 'center');
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
  text('↑↓ 选择  ·  Enter 确定  ·  Esc 关闭', 320, 412, '12px', '#7d93a3', 'center');
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
  if (done && S.talkPage<S.talkPages.length-1 && Math.floor(Date.now()/400)%2===0) {
    text('▼',bx+bw-28,by+bh-14,'bold 14px','#8fd0ff','center');
  }
  CTX.restore();
}

export function drawCreate(){
  const g=CTX.createLinearGradient(0,0,0,CV.height); g.addColorStop(0,'#141a2a');g.addColorStop(1,'#0a0e16');
  CTX.fillStyle=g; CTX.fillRect(0,0,CV.width,CV.height);
  CTX.fillStyle='#ffd24a'; CTX.textAlign='center'; CTX.font='bold 28px sans-serif'; CTX.shadowColor='#ffd24a'; CTX.shadowBlur=22;
  CTX.fillText('选择守灯人',CV.width/2,105); CTX.shadowBlur=0;
  CTX.fillStyle='#e8eef1'; CTX.font='15px sans-serif'; CTX.fillText('姓名',CV.width/2,168);
  CTX.fillStyle='#62c6ff'; CTX.font='bold 42px sans-serif'; CTX.fillText('◀  '+HERO_NAMES[S.createName]+'  ▶',CV.width/2,230);
  CTX.fillStyle='#e8eef1'; CTX.font='15px sans-serif'; CTX.fillText('难度',CV.width/2,300);
  CTX.fillStyle='#ffd24a'; CTX.font='bold 30px sans-serif'; CTX.fillText('▲  '+DIFFS[S.createDiff]+'  ▼',CV.width/2,352);
  CTX.fillStyle='#7d93a3'; CTX.font='13px sans-serif';
  // 困难倍率（信息透明·纯显示）：与 battle.startBattle 结算同源于 DIFF_SCALE，选档前一眼看清确切代价
  CTX.fillText(`（困难：魔物 HP×${DIFF_SCALE.hp} / 攻×${DIFF_SCALE.atk} / 防×${DIFF_SCALE.def}，挑战性提升）`,CV.width/2,382);
  // 每级成长（信息透明·纯显示）：与 hero.grantXp 升级结算同源于 baseStats 推导的 LEVEL_GROWTH——
  // 此前成长数值只在胜利横幅一闪而过，创建页一眼看清「每升一级得到什么」
  CTX.fillText(`每级成长：HP+${LEVEL_GROWTH.hp} · MP+${LEVEL_GROWTH.mp} · 攻+${LEVEL_GROWTH.atk} · 防+${LEVEL_GROWTH.def}`,CV.width/2,408);
  CTX.fillText('← → 选择姓名     ↑ ↓ 选择难度    Enter 出发！',CV.width/2,432);
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
  CTX.font='bold 18px sans-serif'; CTX.fillText('按 Enter 开始新的冒险',CV.width/2,300);
  CTX.font='bold 14px sans-serif'; CTX.fillStyle='#ffd24a';
  const slots=[1,2,3].map(s=>{ const on=S.curSaveSlot===s; return (on?'▶ ':'')+`槽${s}`+(hasSlot(s)?' ✓':'')+(on?' ◀':''); });
  CTX.fillText(slots.join('   '),CV.width/2,340);
  const pv=slotPreview(S.curSaveSlot);
  if(pv){ CTX.fillStyle='#7dd47f'; CTX.font='13px sans-serif'; CTX.fillText(pv,CV.width/2,360); }
  if(hasSave()){ CTX.fillStyle='#62c6ff'; CTX.fillText('按 L 读取当前槽存档',CV.width/2,378); }
  CTX.fillStyle='#7d93a3'; CTX.font='12px sans-serif';
  CTX.fillText('按 1 / 2 / 3 选择存档槽 · L 读档 · WASD 移动 · Esc 菜单 · P 存档 · M 静音',CV.width/2,420);
  // v10.0 可发现性（承接 v9.0 暂停菜单补全）：常驻面板/操作快捷键此前只写在 H 帮助与 README 里，
  // 标题页从未提示——新玩家不开 H 就不知道 I/J/B/C/T/F 这些界面存在。这里补全第二行快捷一览，
  // 与 main.js 世界画面按键分派逐字同源（I状态 J日志 B图鉴 C成就 T旅行 F喝药 H帮助），纯显示不改任何逻辑
  CTX.fillStyle='#5a6a78'; CTX.font='11px sans-serif';
  CTX.fillText('I 状态 · J 日志 · B 记忆图鉴 · C 成就 · T 旅行 · F 喝药 · H 帮助',CV.width/2,442);
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
  boxMsg('按 Enter 继续',0);
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
    text(`当前 Lv.${hero.level} · 金币 ${hero.gold} · 累计讨伐 ${kills} 只 · ⏱️${fmtTime(hero.time)}`,CV.width/2,236,'13px','#7d93a3','center');
    const bossDeath=!!(hero._bossRetry && hero._bossRetry.bossId && hero._bossRetry.bossId!=='rush');
    text(bossDeath?`💡 建议：先回旅馆补给并练级，再按 B 重整旗鼓挑战${hero._bossRetry.name||'强敌'}！`:'💡 建议：回村 旅馆/喷泉 补给，用记忆图鉴(B)查看魔物强度后再战。',CV.width/2,264,'13px',bossDeath?'#ffd24a':'#a8ff8a','center');
  }
  text('按 R 重新开始本次冒险',CV.width/2,304,'15px','#7d93a3','center');
  text('按 T 返回标题画面',CV.width/2,334,'15px','#7d93a3','center');
  if(hero && hero._bossRetry && hero._bossRetry.bossId!=='rush') text('按 B 重整旗鼓，再战强敌！',CV.width/2,364,'15px','#ffd24a','center');
}
bind.drawDead=drawDead;

export function drawWin(){
  CTX.fillStyle='rgba(5,8,12,.96)'; CTX.fillRect(0,0,CV.width,CV.height);
  drawMonster(CV.width/2, 210, BOSS);
  CTX.fillStyle='#ffd24a'; CTX.font='bold 40px sans-serif'; CTX.textAlign='center';
  CTX.fillText('灯 芯 回 来 了',CV.width/2, 300);
  CTX.fillStyle='#e8eef1'; CTX.font='16px sans-serif';
  CTX.fillText(`最终等级 Lv.${S.G.level} · 金币 ${S.G.gold}`,CV.width/2,340);
  CTX.fillStyle='#7d93a3'; CTX.font='14px sans-serif';
  CTX.fillText('按 Enter 观看尾声 · 按 R 重新开始',CV.width/2,380);
}
bind.drawWin=drawWin;

export function drawEnding(){
  const hero = S.G;
  drawWorld(); CTX.fillStyle='rgba(5,8,12,.92)'; CTX.fillRect(0,0,CV.width,CV.height);
  panel(40,110,560,300,'');
  // 真结局差分：记忆碎片集齐则追加「全记忆」页（行距收窄以容下 8 行，不溢面板）
  const allFrag = FRAGMENTS.every((f) => (hero.fragments || []).includes(f.id));
  const lines = hero.trueBoss ? (allFrag ? ENDING_TRUE.concat(ENDING_TRUE_FRAG) : ENDING_TRUE) : ENDING;
  const step = lines.length > 5 ? 25 : 30;
  const y0 = lines.length > 5 ? 146 : 166;
  lines.forEach((l,i)=>text(l,320,y0+i*step,'bold 16px','#e8eef1','center'));
  text(`战绩 · 累计讨伐 ${Object.values(hero.bestiary||{}).reduce((a,b)=>a+b,0)} 只 · 成就 ${(hero.ach||[]).length}/${ACH_LIST.length} · 记忆 ${(hero.fragments||[]).length}/${FRAGMENTS.length} · 金币 ${hero.gold} · ⏱️${fmtTime(hero.time)}`,320,346,'13px','#7d93a3','center');
  text('按 Enter 返回标题',320,376,'13px','#7d93a3','center');
}
bind.drawEnding=drawEnding;
