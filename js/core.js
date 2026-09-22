// ============================================================
// core.js —— 存档 / 对话 / 补给 / 开局 / Boss 重试
// boxMsg / renderHUD / drawStory ← bind.js
// ============================================================
import { S, curMap } from './state.js';
import { MAPS, HERO_NAMES, DEFAULT_NAME, learnsAt, TRAVEL_LIST, BOSS, CAVE_BOSS, TRUE_BOSS, SOLID, ACH_LIST, BESTIARY_TARGET, chestCount, chestTotal, FRAGMENTS, BREW_MUSHROOMS, BREW_GOLD, MUSHROOM_GOAL, XP_INIT, START_GOLD, START_POTIONS, POTION_CAP, SYS_MSG_MS, MILESTONE_MS, NARR_MSG_MS, EVENT_MSG_MS, STRONG_MSG_MS, WIN_MSG_MS, WRAP_GAP_MS, TITLE_RESET_CONFIRM_MS, MAP_POTION_GOAL, DIFFS, NPCS } from './data.js';
import { applyStats, deep, pageTotalMs } from './rules.js';
import { SFX, startBgm } from './audio.js';
import { bind } from './bind.js';
import { hooks } from './hooks.js';
import { goto } from './scene.js';
import { loadMap, transition, at } from './world.js';
import { startBattle } from './battle.js';
import { takePotion, potionAvailability, checkSkills, skillXpHint, applyAchievements } from './hero.js';
import { migrateQuests, questObjective, questLines, adventureProgress, mushroomQuestProtects, npcQuestPages, resolveNpcTalk } from './quests.js';

function newGame(name) {
  return migrateQuests({
    name: name || DEFAULT_NAME,
    diff: 0,
    level: 1, xp: 0, xpNext: XP_INIT, gold: START_GOLD, item: START_POTIONS, potion2: 0,
    weapon: '木剑', armor: '布衣',
    map: 'village',
    x: MAPS.village.playerStart.x,
    y: MAPS.village.playerStart.y,
    hp: 0, mp: 0,
    skills: [learnsAt(1)], // 起始技能 = 技能领悟表 1 级条目（LEARN_AT 单一数据源，v17.7 收口）
    poison: 0,
    bossDefeated: false,
    caveBoss: false,
    trueBoss: false,
    rushStage: 0,
    rushDone: false,
    visited: ['village'],
    tutDone: false,
    bestiary: {},
    totalWins: 0,
    drops: 0,
    ach: [],
    chests: new Set(),
    mushrooms: 0,
    quest: 0,
    quests: {},
    fragments: [],
    story: 0,
    time: 0,
  });
}

// 开局三段（initGame / beginAdventure / resetRun）共用的「建档+摆位」流程
function startRun(name, diff) {
  S.G = newGame(name);
  S.G.diff = diff || 0;
  applyStats(S.G);
  S.G.hp = S.G.hpMax;
  S.G.mp = S.G.mpMax;
  loadMap(S.G.map);
  S.G.x = MAPS[S.G.map].playerStart.x;
  S.G.y = MAPS[S.G.map].playerStart.y;
}

function initGame(name, continueSave) {
  if (continueSave && load()) return;
  startRun(name);
}

function usePotion() {
  S.unsaved = true; // v22.10 未存档提醒置脏
  if (S.scene !== 'world') return;
  const hero = S.G;
  const { hpFull, mpFull, any } = potionAvailability(hero);
  if (!any) {
    bind.boxMsg(hpFull && mpFull ? '✅ 状态满满，无需喝药！' : '🍖 没有可用的药水了！');
    return;
  }
  const result = takePotion();
  // v23.72 成就「渴饮甘露」计数（旅中补给维度首枚里程碑·承 v23.36 以守为攻 / v23.66 药到病除先例）：
  // v23.66 收口战斗六指令时明确把大地图 F 键排除在 [3]药到病除统计之外（战斗用药另一端口、
  // 本函数是大地图喝药唯一产生点——世界画面 F 键唯一入口、战斗内 doItem 走 takePotion 不在此列
  // 零计数），玩家在星井矿脉/无字回廊（全图唯二无补给点图）靠 F 续命多次，成就一览却无回响；
  // 现补独立单档（与药到病除同族不同端口、各自累计互不计入，阈值 MAP_POTION_GOAL 单一数据源），
  // 成功喝药才计数（状态满满/无药早退零计数）——读 hero.mapPotions（本函数局部 const hero = S.G、
  // 随 snapshotHero 全量快照自动持久化），防御式 (hero.mapPotions||0) 旧档零迁移（承 v23.36
  // deflects / v23.66 potionUses 同款）；无 r 字段纯里程碑（药剂本身即回复）；落账当场
  // applyAchievements（承 v23.36 反击落账当场判定「反馈不迟到」惯例，计数源与判定点同处一行
  // 防漏记）；零战报后缀（承 v23.66 口径——喝药报文已带恢复量/剩余库存/HPMP 状态，C 页进度
  // X/10 承载）。takePotion 判定/恢复结算/两档报文/renderHUD 逐字未动。
  hero.mapPotions = (hero.mapPotions || 0) + 1;
  applyAchievements();
  SFX.heal();
  bind.renderHUD();
  // v19.74 喝药反馈追加剩余数量（信息透明·纯显示）：之前只报恢复量，玩家确认背包还剩几瓶
  // 需要再按 I 看状态页。现在直接读结算后的 hero.item / hero.potion2，零数值变化。
  // v21.65 喝药战报补恢复后 HP/MP 状态（信息透明·口径一致·纯显示）：与战斗内 doItem
  // 同式把结算后 HP（灵药含 MP）并入括号句首——恢复量是上限钳制前的公式量，报恢复后
  // 状态让钳制透明（与治愈术 v19.97「（HP X/Y）」同一口径），零结算零数值变化。
  bind.boxMsg(
    result.strong
      ? `🧪 服下高级灵药，恢复 ${result.h} HP、${result.m} MP（HP ${hero.hp}/${hero.hpMax} · MP ${hero.mp}/${hero.mpMax} · 高级灵药剩余 ${hero.potion2} 瓶）`
      : `🍖 使用药水，恢复 ${result.h} 点 HP（HP ${hero.hp}/${hero.hpMax} · 药水剩余 ${hero.item} 瓶）`
  );
}

function brewNow() {
  S.unsaved = true; // v22.10 未存档提醒置脏
  const hero = S.G;
  if (mushroomQuestProtects(hero) && hero.mushrooms <= MUSHROOM_GOAL) {
    SFX.cancel();
    bind.boxMsg(`🍄 任务蘑菇尚未上交（当前 ${hero.mushrooms}/${MUSHROOM_GOAL} 株），先去找灯长吧！`, STRONG_MSG_MS);
    return;
  }
  if (hero.mushrooms < BREW_MUSHROOMS || hero.gold < BREW_GOLD) {
    SFX.cancel();
    // v19.69 酿造材料不足提示具体化（信息透明·纯显示）：此前只报笼统「材料不足」，
    // 玩家不知道自己差多少蘑菇/金币——与 v19.67 商店反馈同一「消费/配方透明」主线，
    // 直接读 data.js BREW_MUSHROOMS/BREW_GOLD 同源常量，配方调整时提示自动跟随
    bind.boxMsg(`材料不足：酿造需要 ${BREW_MUSHROOMS} 株蘑菇 + ${BREW_GOLD} 金币（当前 ${hero.mushrooms || 0}/${hero.gold || 0}）`, EVENT_MSG_MS);
    return;
  }
  hero.mushrooms -= BREW_MUSHROOMS;
  hero.gold -= BREW_GOLD;
  // v23.74 经济消费成就「一掷千金」计数（同 shop 四处注释，全游 5 处金币扣减之一）：
  // 酿造成本扣款成功就地累计 hero.spent + BREW_GOLD，下方既有 hero.brews 计数与
  // applyAchievements 当场判定不动（消费与酿造两端口各自累计）。
  hero.spent = (hero.spent || 0) + BREW_GOLD;
  hero.potion2++;
  // v21.86 新成就「灵药初成」（酿造线里程碑·反馈不迟到）：酿造链此前全无成就纪念（30 项成就里
  // 没有任何一条关涉酿造/灵药），玩家第一次酿出高级灵药这一刻毫无回响；现按 v21.73 buyArmor
  // 当场判定同款（承 world.js 开箱当场判定「反馈不迟到」惯例），酿造成功当场 applyAchievements——
  // 判定读本函数写入的 hero.brews 防御式计数（(g.brews||0)，旧档无此字段=0 不误解锁、零迁移，
  // 承 v19.41 seen 同款），ELIXIR_GOAL 单一数据源在 data.js；applyAchievements 幂等（已解锁
  // 不重报、不重复触发横幅），零结算零数值零存档格式变化（brews 随既有存档快照自动落盘/读回）。
  // potion2 库存结算（含任务奖励/掉落来源）逐字未动——成就只认「酿造」行为，不把「任务送的
  // 灵药」误记为酿造。
  hero.brews = (hero.brews || 0) + 1;
  applyAchievements();
  // v23.33 酿造成功弃用升级琶音（音效反馈·语义修正——承 v23.22 SFX.ach 同族收口）：酿造是制作行为不是
  // 升级——此前成功即播 SFX.levelup()（升级琶音）与升级/成就听感混淆，且首次酿造（灵药初成成就当场
  // 触发）会升级琶音+成就铃声连响（v23.22 已修成就侧，酿造侧是本族最后一个漏网）；现改播 audio.js
  // SFX.craft()（气泡上行三连），与 levelup 琶音/ach 铃声/victory 号角一听即分——首次酿造 = craft+ach
  // 双响（两事件分层不重叠），再酿仅 craft；零结算零数值零存档，成就判定/库存结算/成功报文逐字未动。
  SFX.craft();
  bind.renderHUD();
  // v19.70 酿造成功反馈追加剩余材料（信息透明·纯显示）：v19.69 已补齐材料不足时的差额提示，
  // 但成功分支只报「酿造成功」——玩家交完材料后想确认包里还剩多少蘑菇/金币，还得再按 I 看状态页。
  // 直接读结算后的 hero.mushrooms / hero.gold，在成功文案末尾追加剩余数量，零结算变化。
  // v23.18 酿造成功报文补「还可再酿 N 瓶」（体验打磨·信息透明·纯显示——承 v23.17 酿造面板
  // 「当前材料还可酿造 N 瓶」同一主线）：面板端提示要站在锅前才看得到，连酿时每按一次 Enter 的
  // 成功报文只报剩余材料——「下一锅还能不能酿」仍要心算 min(蘑菇÷2, 金币÷10) 或抬头看面板；
  // 现与 v23.17 同式由 BREW_MUSHROOMS/BREW_GOLD 单一数据源派生计数（同读一份源、零裸字面量、
  // 配方调整两端自动跟随），成功报文就地续报「· 还可再酿 N 瓶」；可酿 0 瓶时零噪音不显示
  // （与 v23.17 面板端「可酿 0 瓶时不显示」同一语义，剩余材料数已自明），纯显示零结算零存档零数值变化。
  const _canBrewMore = Math.min(Math.floor((hero.mushrooms || 0) / BREW_MUSHROOMS), Math.floor((hero.gold || 0) / BREW_GOLD));
  bind.boxMsg(`🧪 酿造成功！高级灵药 +1（剩余 ${hero.mushrooms} 蘑菇 / ${hero.gold} 金币${_canBrewMore > 0 ? ` · 还可再酿 ${_canBrewMore} 瓶` : ''}；F/战斗[3]使用）`, SYS_MSG_MS);
}

function doTravel() {
  S.unsaved = true; // v22.10 未存档提醒置脏
  const [key] = TRAVEL_LIST[S.travelSel];
  if (!(S.G.visited||[]).includes(key)) {
    SFX.cancel();
    bind.boxMsg('尚未探索此地，先去找到入口吧。', EVENT_MSG_MS);
    return;
  }
  // v21.6 快速旅行防误触（体验打磨·纯拦截）：旅行列表常驻标出📍当前位置（menus.drawTravel 同源标注，
  // 目的就是「一眼看出自己在哪、避免误传送」），但该行仍可被选中——选中再按 Enter 会对当前所在地执行
  // transition()：重载整张地图并把主角丢回 playerStart（实测 9,9 → 1,2），费一趟传送却回到原点，
  // 与列表自身的防误传意图自相矛盾。现按 core 侧同源判定（state.curMap，与 G.map 同源）直接拦截并提示，
  // 零重载/零移动/零消耗——地图、位置、BGM、遇敌、存档全部不受影响；传送门/水晶开门等其它入口不走本函数，
  // 逐字不动。
  if (key === curMap()) {
    SFX.cancel();
    bind.boxMsg('已经在这里了！', EVENT_MSG_MS);
    return;
  }
  SFX.door();
  transition(key);
  goto('world');
}

function chiefPages() {
  return npcQuestPages(S.G, 'chief');
}

function openTalk(id) {
  S.curNpc = id;
  S.talkPage = 0;
  S.talkLineAt = Date.now();
  S.talkStartAt = S.talkLineAt;
  S.talkPages = npcQuestPages(S.G, id);
  // v23.13 社交成就「有口皆碑」交谈记录（新内容·单成就）：openTalk 是全游戏唯一交谈入口
  // （world.interact → hooks.openTalk，NPC_SPOTS 全表都走这里），在此记录 hero.talked——
  // 只记 NPCS 内 id（与 ACH_LIST talkall 同读 Object.keys(NPCS) 一份源，加/删 NPC 两端自动
  // 跟随，绝无第二套口径）；(S.G.talked||[]) 防御式 + migrateQuests 兜底 [] + snapshotHero
  // 全量快照自动持久化，旧档零迁移；新 id 记入当场 applyAchievements（承 world.onChestStep
  // 开箱当场判定「反馈不迟到」惯例），最后一位聊到即解锁。
  const th = S.G;
  if (th && NPCS[id]) {
    if (!Array.isArray(th.talked)) th.talked = [];
    if (!th.talked.includes(id)) {
      th.talked.push(id);
      applyAchievements();
    }
  }
  goto('talk');
}
hooks.openTalk = openTalk;

function talkNext() {
  // v22.10 未存档提醒置脏（防误丢档）：对话推进是任务链/奖励结算入口（交任务/领奖全经翻页），置
  // S.unsaved=true；saveGame/load 成功清脏，beforeunload 守卫读之。纯状态标志零结算。
  S.unsaved = true; // v22.10 未存档提醒置脏
  // 打字机（与 drawTalk 同读 rules.pageTotalMs/pageShownAt）：本页未打完时 Enter 先补全本页，不翻页
  const page = S.talkPages[S.talkPage] || [];
  const total = pageTotalMs(page);
  if (Date.now() - (S.talkLineAt || 0) < total) {
    S.talkLineAt = Date.now() - total - 1;
    SFX.select();
    return;
  }
  SFX.select();
  const hero = S.G;
  const act = resolveNpcTalk(hero, S.curNpc);
  if (act && act.kind === 'accept') {
    // v19.99 接取任务反馈追加当前目标（信息透明·纯显示）：此前只报「接受了任务」并提示按 J 看日志，
    // 玩家接完委托后想确认「现在要做什么 / 还差多少」仍需手动翻日志或看 HUD；现在直接读 quests.questObjective
    // 的实时目标文本（与任务日志/状态页同源），接取瞬间即可知道下一步，零结算变化。
    bind.boxMsg(`接受了「${act.name}」！当前目标：${questObjective(hero)}（按 J 查看任务日志）`, NARR_MSG_MS);
    goto('world');
    return;
  }
  if (act && act.kind === 'reward') {
    // v23.50 任务交付专属音效（音效反馈·语义修正——承 v23.22 SFX.ach / v23.33 SFX.craft / v23.40
    // SFX.flee / v23.43 SFX.crit / v23.46 SFX.transform / v23.47 SFX.charge / v23.48 SFX.darkheal /
    // v23.49 SFX.chest 同一「事件音效各归其位」主线的收口，详见 audio.js SFX.quest 与 data.js v23.50
    // 注释）：任务交付奖励（act.kind==='reward'）此前金币档播 SFX.coin()（与售蘑菇同音）、物品档播
    // SFX.victory()（与战斗胜利号角同音）——交任务是「🎁 委托达成」的交付事件，听感却与买东西/打赢仗
    // 无从分辨（刚打赢一场仗回村交任务，两声同响分不清是凯旋还是交付）；现改播音频专属 SFX.quest()
    // （「交付铃」先抑后扬三连，audio.js v23.50），金币/物品两档统一——交付瞬间听声即知是交任务
    // 非购物/凯旋；零结算零数值零存档（交付判定/库存结算/报文/成就判定逐字未动，SFX.coin() 仍服务
    // 售蘑菇、SFX.victory() 仍服务战斗胜利/试炼通关）。
    SFX.quest();
    bind.renderHUD();
    applyAchievements();
    const extra = (act.item ? ` +${act.item} 药水` : '') + (act.potion2 ? ` +${act.potion2} 灵药` : '');
    // v19.77 任务奖励反馈追加剩余金币（信息透明·纯显示）：v19.75/19.76 已给商店/旅馆消费成功文案
    // 带上余额，但任务奖励（灯长、井巫等NPC交付）完成后只报「金币 +N」，玩家确认兜里还剩多少仍需
    // 再按 I 看状态页。现在直接读 applyQuestReward 结算后的 hero.gold，零数值变化。
    // v19.98 任务奖励反馈追加药水/灵药剩余量（信息透明·纯显示）：v19.77 已补齐金币余额，但若奖励包含
    // 生命药水或高级灵药，玩家只能看到「+1 药水/灵药」，确认补给库存是否充足仍需再按 I。现在直接读
    // 结算后的 hero.item / hero.potion2，并带上 POTION_CAP 上限，与 v19.74/19.78/19.83 同源，零数值变化。
    const remain = [];
    if (act.item) remain.push(`药水 ${hero.item}/${POTION_CAP} 瓶`);
    if (act.potion2) remain.push(`灵药 ${hero.potion2} 瓶`);
    bind.boxMsg(`🎁 「${act.name}」完成：金币 +${act.gold}${extra}（剩余 ${hero.gold} 金${remain.length ? '；' + remain.join('，') : ''}）`, WIN_MSG_MS);
    goto('world');
    return;
  }
  S.talkPage++;
  S.talkLineAt = Date.now();
  if (S.talkPage >= S.talkPages.length) goto('world');
}

function beginAdventure() {
  // v22.10 未存档提醒置脏：新开局从故事页起即属「未落盘冒险」（尚未有任何存档），beforeunload 守卫
  // 读 S.unsaved；saveGame/load 成功清脏。纯状态标志零结算。
  S.unsaved = true; // v22.10 未存档提醒置脏
  SFX.select();
  startRun(HERO_NAMES[S.createName], S.createDiff);
  S.storyPage = 1;
  S.storyLineAt = Date.now();
  bind.renderHUD();
  goto('story');
  bind.drawStory();
  if (S.createDiff === 1) bind.boxMsg('⚡ 已开启困难模式：魔物更强！', MILESTONE_MS);
}

const saveKey = (slot) => 'jrpg_save' + slot;

function hasSlot(slot) {
  try { return !!localStorage.getItem(saveKey(slot)); }
  catch (e) { return false; }
}

// 标题画面存档槽「最后游玩时间」格式化：旧档无 savedAt 时返回空串，避免破坏既有显示
function fmtAgo(ms) {
  if (!ms || typeof ms !== 'number') return '';
  const sec = Math.floor((Date.now() - ms) / 1000);
  if (sec < 60) return ' · 刚刚';
  if (sec < 3600) return ' · ' + Math.floor(sec / 60) + '分钟前';
  if (sec < 86400) return ' · ' + Math.floor(sec / 3600) + '小时前';
  return ' · ' + Math.floor(sec / 86400) + '天前';
}

// 累计游玩时长格式化：与状态页/结算页 fmtTime 同算法，slotPreview 纯显示「这个档玩了多久」
// 旧档无 time 字段时按 0 显示 00:00:00，不抛错；零结算变化
function fmtTime(s) {
  s = Math.max(0, Math.floor(s || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor(s % 3600 / 60);
  const ss = s % 60;
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(ss).padStart(2, '0');
}

function slotPreview(slot) {
  try {
    const raw = localStorage.getItem(saveKey(slot));
    if (!raw) return null;
    const data = JSON.parse(raw);
    const hero = data && data.G;
    if (!hero) return null;
    const mapName = (MAPS[hero.map] && MAPS[hero.map].name) || hero.map || '?';
    const prog = hero.trueBoss ? '灯已归还'
      : (hero.bossDefeated && hero.caveBoss) ? '对峙终焉之神中'
      : hero.bossDefeated ? '灯芯已讨回·井仍在鸣'
      : hero.caveBoss ? '已击败洞窟领主'
      : '讨回灯芯中';
    // v19.45 存档预览补难度（信息透明·纯显示）：多存档槽时标题页一眼区分普通/困难档——
    // 难度与「状态面板」同源读 hero.diff（DIFFS 下标），绝无第二套口径；仅困难档追加标注，
    // 普通默认档不刷屏（与 drawStatus 只标困难的惯例一致），纯显示零结算变化
    // v19.64 存档预览补时间戳：saveGame 写入 savedAt，slotPreview 显示相对时间，方便多槽玩家一眼识别最新档
    // v19.65 存档预览补累计游玩时长：slotPreview 追加 ⏱HH:MM:SS，多槽时一眼区分「哪个档玩得更久」，
    // 与状态页/结算页 fmtTime 同源算法，纯显示零结算变化
    // v21.79 存档预览补收集进度（信息透明·纯显示）：多存档槽时标题页此前只报 姓名/等级/金币/地图/进度/
    // 难度/存档时间/时长——「这个档收集到哪了」却无一字，挑更完整的档继续只能进游戏逐页翻；现按
    // 成就页/图鉴页/状态页同口径追加 成就N/M·图鉴N/M·宝箱N/M（推进性计数），与 ACH_LIST /
    // BESTIARY_TARGET / chestCount·chestTotal 同一份单一数据源（chestCount 防御式兼容 Set/数组/缺失
    // 三形态、旧档零迁移），绝无第二套口径；零结算零存档变化，仅追加显示
    // v22.5 存档预览补「🕯️ 记忆碎片 N/4」（体验打磨·信息透明）：v21.79 三件套后，收集进度口径在
    // 状态页（v22.1）/胜利画面（v22.2）/阵亡画面（v22.3）/J 日志/尾声战绩行（v19.49 记忆 N/N）五端齐备，
    // 唯独标题页预览行（选槽即见）仍无碎片——多档玩家挑更完整的档续玩时，真结局关键收集无回声；现按
    // 其余五端同口径并列 ·🕯️N/4（与 hero.fragments·FRAGMENTS.length 同一份单一数据源，
    // (hero.fragments||[]) 防御式旧档零迁移），单行 13px estW 最坏 ≈620.5 ≤640 画布预算，纯显示零结算零存档
    const achN = (hero.ach || []).length;
    const codexN = BESTIARY_TARGET.filter((n) => ((hero.bestiary || {})[n] | 0) >= 1).length;
    const chestN = chestCount(hero);
    const fragN = (hero.fragments || []).length;
    // v23.29 标题页存档预览补「·徽记 N/5」冒险进度计数（体验打磨·信息透明·纯显示——承 v23.21 J 日志
    // 「主线 · N/5」节头同一「五徽记 N/M 汇总」家族收口：冒险进度五徽记（灯芯/星井/回廊/初灯/试炼场，
    // quests.adventureProgress 唯一实现）在 状态页/v22.89 胜利画面/v22.95 阵亡画面/v22.96 尾声/J 日志
    // 五端齐备，唯独标题页存档预览（slotPreview 的 prog 链只覆盖主线四段、试炼场 rushDone 无回声）——
    // 多档挑续玩时「这个档试炼场刷没刷过」选槽第一屏看不到；现与五端同读 quests.adventureProgress 一份
    // 单一数据源（core.js 既有 import 零新增依赖），模板并列 ·徽记N/5（N=已达成徽记数，加/删徽记自动
    // 跟随零裸字面量），纯显示零结算零存档零数值变化。
    const _progB = adventureProgress(hero);
    return `${hero.name || '守灯人'} Lv.${hero.level} 金币${hero.gold || 0} ${mapName}·${prog}${hero.diff ? ' · ' + (DIFFS[hero.diff] || '困难') : ''}${fmtAgo(data.savedAt)} · ⏱${fmtTime(hero.time)} · 成就${achN}/${ACH_LIST.length}·图鉴${codexN}/${BESTIARY_TARGET.length}·宝箱${chestN}/${chestTotal()}·🕯️${fragN}/${FRAGMENTS.length}·徽记${_progB.filter((b) => b[1]).length}/${_progB.length}`;
  } catch (e) {
    return null;
  }
}

function hasSave() {
  return hasSlot(S.curSaveSlot);
}

function snapshotHero(hero) {
  const snap = {
    ...hero,
    map: hero.map || 'village',
    chests: Array.from(hero.chests || []),
  };
  delete snap._bossRetry;
  return snap;
}

function saveGame() {
  try {
    const hero = S.G;
    if (!hero) return;
    const snap = snapshotHero(hero);
    localStorage.setItem(saveKey(S.curSaveSlot), JSON.stringify({ G: snap, chests: snap.chests, savedAt: Date.now() }));
    // v22.10 未存档提醒清脏（成功存档=已落盘）：beforeunload 守卫读 S.unsaved，存档成功即解除离站确认。
    S.unsaved = false; // v22.10 未存档提醒清脏
    // v19.87 存档成功反馈追加角色摘要（信息透明·纯显示）：此前只报「已存档到槽 N」，
    // 玩家按 P 或菜单存档后想确认「当前角色/等级/所在地图/金币」是否写入正确，仍需再按 I 看状态页；
    // 与 v19.86「读档追加角色摘要」的同一信息透明主线一致。
    S.saveMsg = `💾 已存档到槽 ${S.curSaveSlot}：${hero.name} Lv.${hero.level} · ${MAPS[hero.map].name} · ${hero.gold} 金`;
    bind.renderHUD();
    SFX.select();
    setTimeout(() => { S.saveMsg = ''; bind.renderHUD(); }, WRAP_GAP_MS);
  } catch (e) {
    bind.boxMsg('存档失败：' + e.message);
  }
}

function restoreChests(hero, data) {
  const listed = (data && data.chests)
    || (hero && Array.isArray(hero.chests) ? hero.chests : [])
    || [];
  hero.chests = new Set(listed);
}

function load() {
  try {
    const raw = localStorage.getItem(saveKey(S.curSaveSlot));
    if (!raw) return false;
    const data = JSON.parse(raw);
    S.G = migrateQuests(data.G);
    restoreChests(S.G, data);
    const map = (S.G.map && MAPS[S.G.map] && S.G.map)
      || (data.curMap && MAPS[data.curMap] && data.curMap)
      || 'village';
    S.G.map = map;
    loadMap(map);
    const bounds = { w: S.maze[0].length, h: S.maze.length };
    S.G.x = Math.max(0, Math.min(bounds.w - 1, S.G.x | 0));
    S.G.y = Math.max(0, Math.min(bounds.h - 1, S.G.y | 0));
    // 地图重排兼容（v13.5）：旧档坐标若落在墙里，退回该图出生点
    if (SOLID.has(at(S.G.x, S.G.y))) {
      S.G.x = MAPS[map].playerStart.x;
      S.G.y = MAPS[map].playerStart.y;
    }
    applyStats(S.G);
    // v22.10 未存档提醒清脏（读档成功=状态与存档一致）：beforeunload 守卫读 S.unsaved，读档后未动作
    // 的「已存档状态」不再误触发离站确认（承 saveGame 同款清脏）。
    S.unsaved = false; // v22.10 未存档提醒清脏
    S.walk = null;
    bind.renderHUD();
    return true;
  } catch (e) {
    return false;
  }
}

// 标题页 R 重开防误触状态机（v21.16·纯函数·零副作用）：resetRun 是破坏性重置（新档直接覆盖当前冒险），
// 而标题页按 R 此前零确认即执行——玩家从 Esc 菜单「返回标题」时当前冒险仍挂在 S.G 上，误按一次 R 就
// 丢档（v21.6 快速旅行防误触同一「破坏性操作两段触发」家族）。现改为「两按确认」：首次按 R 仅武装
// （返回 { arm: now, fire:false }），TITLE_RESET_CONFIRM_MS 内再按 R 才 fire=true 并解除武装；任一非 R 键
// （isR=false）立即解除武装；超时后再按重新武装（不会连发、不会漏发）。纯函数可单测（smoke_v2116）。
function titleResetCheck(armT, now, isR) {
  if (!isR) return { arm: 0, fire: false };
  if (armT && now - armT <= TITLE_RESET_CONFIRM_MS) return { arm: 0, fire: true };
  return { arm: now, fire: false };
}

// 标题页 X 删除存档槽防误触状态机（v22.7·纯函数·零副作用·承 v21.16 titleResetCheck 同构）：
// 删除存档是不可恢复的破坏性操作——首次按 X 仅武装（返回 { arm: now, fire:false }），
// TITLE_RESET_CONFIRM_MS 内再按 X 才 fire=true 并解除武装；任一非 X 键（isX=false）立即解除武装；
// 超时后再按重新武装（不会连发、不会漏发）。与 R 重开共享同一确认窗口常量——两处标题页破坏性操作
// 同一档防误触节奏，改节奏只改 data.js TITLE_RESET_CONFIRM_MS 一处自动跟随。
function slotDeleteCheck(armT, now, isX) {
  if (!isX) return { arm: 0, fire: false };
  if (armT && now - armT <= TITLE_RESET_CONFIRM_MS) return { arm: 0, fire: true };
  return { arm: now, fire: false };
}

// v22.7 删除存档槽：经 saveKey(n) 同源 localStorage.removeItem（与 hasSlot/saveGame/load 同一份键源，
// 键名/槽位语义改一处自动跟随）；try/catch 防御（与 hasSlot 同款，隐私模式/配额异常不抛错）；
// 删除幂等——空槽 removeItem 也是 no-op 返回 true（空槽不删除的拦截由 main.js title.onKey 的
// hasSlot 门承担：有档才武装、无档只给「无需删除」反馈）；删除仅清存档记录，不影响内存中
// 正在进行的冒险（与 resetRun 语义分工：R=重开覆盖、X=清槽腾位）。
function deleteSlot(n) {
  try {
    localStorage.removeItem(saveKey(n));
    return true;
  } catch (e) {
    return false;
  }
}

function resetRun() {
  // v22.10 未存档提醒置脏：重开=从故事页起新一轮未落盘冒险（承 beginAdventure 同款置脏语义）。
  S.unsaved = true; // v22.10 未存档提醒置脏
  const name = S.G ? S.G.name : DEFAULT_NAME;
  const diff = S.G ? S.G.diff : 0;
  startRun(name, diff);
  S.storyPage = 1;
  S.storyLineAt = Date.now();
  bind.renderHUD();
  goto('story');
  startBgm('village');
  bind.boxMsg('🔄 新的冒险开始！', EVENT_MSG_MS);
}

// Boss 战败重试（从 battle.js 迁出，存档/开局语义）：
// 快照由 battle.startBattle 在强敌开战时写入 G._bossRetry，此处负责恢复现场并重新开战
function retryBoss() {
  const retry = S.G._bossRetry;
  if (!retry || retry.bossId === 'rush') return false;
  let def = BOSS;
  if (retry.bossId === 'true') def = TRUE_BOSS;
  else if (retry.bossId === 'cave') def = CAVE_BOSS;
  const hero = S.G;
  hero.level = retry.level;
  hero.xp = retry.xp;
  hero.weapon = retry.weapon;
  hero.armor = retry.armor;
  hero.gold = retry.gold;
  hero.item = retry.item;
  hero.potion2 = retry.potion2;
  hero.chests = new Set(retry.chests || []);
  applyStats(hero);
  hero.hp = Math.min(hero.hpMax, retry.hp);
  hero.mp = Math.min(hero.mpMax, retry.mp);
  hooks.loadMap(retry.curMap || 'village');
  hero.x = retry.x;
  hero.y = retry.y;
  bind.renderHUD();
  SFX.select();
  bind.boxMsg('🔄 重整旗鼓，再战强敌！', EVENT_MSG_MS);
  startBattle(deep(def));
  return true;
}

export {
  newGame, applyStats, initGame, checkSkills, skillXpHint,
  saveKey, hasSlot, hasSave, slotPreview, saveGame, load, resetRun, retryBoss,
  takePotion, usePotion, questObjective, questLines, adventureProgress,
  brewNow, chiefPages, openTalk, talkNext, doTravel, beginAdventure,
  applyAchievements, titleResetCheck, slotDeleteCheck, deleteSlot,
};
