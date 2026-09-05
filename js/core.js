// ============================================================
// core.js —— 存档 / 对话 / 补给 / 开局 / Boss 重试
// boxMsg / renderHUD / drawStory ← bind.js
// ============================================================
import { S, curMap } from './state.js';
import { MAPS, HERO_NAMES, DEFAULT_NAME, learnsAt, TRAVEL_LIST, BOSS, CAVE_BOSS, TRUE_BOSS, SOLID, BREW_MUSHROOMS, BREW_GOLD, MUSHROOM_GOAL, XP_INIT, START_GOLD, START_POTIONS, POTION_CAP, SYS_MSG_MS, MILESTONE_MS, NARR_MSG_MS, EVENT_MSG_MS, STRONG_MSG_MS, WIN_MSG_MS, WRAP_GAP_MS, TITLE_RESET_CONFIRM_MS, DIFFS } from './data.js';
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
  if (S.scene !== 'world') return;
  const hero = S.G;
  const { hpFull, mpFull, any } = potionAvailability(hero);
  if (!any) {
    bind.boxMsg(hpFull && mpFull ? '✅ 状态满满，无需喝药！' : '🍖 没有可用的药水了！');
    return;
  }
  const result = takePotion();
  SFX.heal();
  bind.renderHUD();
  // v19.74 喝药反馈追加剩余数量（信息透明·纯显示）：之前只报恢复量，玩家确认背包还剩几瓶
  // 需要再按 I 看状态页。现在直接读结算后的 hero.item / hero.potion2，零数值变化。
  bind.boxMsg(
    result.strong
      ? `🧪 服下高级灵药，恢复 ${result.h} HP、${result.m} MP（高级灵药剩余 ${hero.potion2} 瓶）`
      : `🍖 使用药水，恢复 ${result.h} 点 HP（药水剩余 ${hero.item} 瓶）`
  );
}

function brewNow() {
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
  hero.potion2++;
  SFX.levelup();
  bind.renderHUD();
  // v19.70 酿造成功反馈追加剩余材料（信息透明·纯显示）：v19.69 已补齐材料不足时的差额提示，
  // 但成功分支只报「酿造成功」——玩家交完材料后想确认包里还剩多少蘑菇/金币，还得再按 I 看状态页。
  // 直接读结算后的 hero.mushrooms / hero.gold，在成功文案末尾追加剩余数量，零结算变化。
  bind.boxMsg(`🧪 酿造成功！高级灵药 +1（剩余 ${hero.mushrooms} 蘑菇 / ${hero.gold} 金币；F/战斗[3]使用）`, SYS_MSG_MS);
}

function doTravel() {
  const [key] = TRAVEL_LIST[S.travelSel];
  if (!S.G.visited.includes(key)) {
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
  goto('talk');
}
hooks.openTalk = openTalk;

function talkNext() {
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
    if (act.item) SFX.victory();
    else SFX.coin();
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
    return `${hero.name || '守灯人'} Lv.${hero.level} 金币${hero.gold || 0} ${mapName}·${prog}${hero.diff ? ' · ' + (DIFFS[hero.diff] || '困难') : ''}${fmtAgo(data.savedAt)} · ⏱${fmtTime(hero.time)}`;
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

function resetRun() {
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
  applyAchievements, titleResetCheck,
};
