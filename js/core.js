// ============================================================
// core.js —— 存档 / 对话 / 补给 / 开局 / Boss 重试
// boxMsg / renderHUD / drawStory ← bind.js
// ============================================================
import { S } from './state.js';
import { MAPS, HERO_NAMES, DEFAULT_NAME, learnsAt, TRAVEL_LIST, BOSS, CAVE_BOSS, TRUE_BOSS, SOLID, BREW_MUSHROOMS, BREW_GOLD, MUSHROOM_GOAL, XP_INIT } from './data.js';
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
    level: 1, xp: 0, xpNext: XP_INIT, gold: 30, item: 3, potion2: 0,
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
  bind.boxMsg(
    result.strong
      ? `🧪 服下高级灵药，恢复 ${result.h} HP、${result.m} MP`
      : `🍖 使用药水，恢复 ${result.h} 点 HP`
  );
}

function brewNow() {
  const hero = S.G;
  if (mushroomQuestProtects(hero) && hero.mushrooms <= MUSHROOM_GOAL) {
    SFX.cancel();
    bind.boxMsg('🍄 任务蘑菇尚未上交，先去找灯长吧！', 2000);
    return;
  }
  if (hero.mushrooms < BREW_MUSHROOMS || hero.gold < BREW_GOLD) {
    SFX.cancel();
    bind.boxMsg('材料不足，无法酿造！', 1600);
    return;
  }
  hero.mushrooms -= BREW_MUSHROOMS;
  hero.gold -= BREW_GOLD;
  hero.potion2++;
  SFX.levelup();
  bind.renderHUD();
  bind.boxMsg('🧪 酿造成功！高级灵药已放入背包（F/战斗[3]使用）', 2200);
}

function doTravel() {
  const [key] = TRAVEL_LIST[S.travelSel];
  if (!S.G.visited.includes(key)) {
    SFX.cancel();
    bind.boxMsg('尚未探索此地，先去找到入口吧。', 1600);
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
    bind.boxMsg(`接受了「${act.name}」！按 J 可查看任务日志`, 1800);
    goto('world');
    return;
  }
  if (act && act.kind === 'reward') {
    if (act.item) SFX.victory();
    else SFX.coin();
    bind.renderHUD();
    applyAchievements();
    const extra = (act.item ? ` +${act.item} 药水` : '') + (act.potion2 ? ` +${act.potion2} 灵药` : '');
    bind.boxMsg(`🎁 「${act.name}」完成：金币 +${act.gold}${extra}`, 2600);
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
  if (S.createDiff === 1) bind.boxMsg('⚡ 已开启困难模式：魔物更强！', 2400);
}

const saveKey = (slot) => 'jrpg_save' + slot;

function hasSlot(slot) {
  try { return !!localStorage.getItem(saveKey(slot)); }
  catch (e) { return false; }
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
    return `${hero.name || '守灯人'} Lv.${hero.level} 金币${hero.gold || 0} ${mapName}·${prog}`;
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
    localStorage.setItem(saveKey(S.curSaveSlot), JSON.stringify({ G: snap, chests: snap.chests }));
    S.saveMsg = `💾 已存档到槽 ${S.curSaveSlot}`;
    bind.renderHUD();
    SFX.select();
    setTimeout(() => { S.saveMsg = ''; bind.renderHUD(); }, 1800);
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

function resetRun() {
  const name = S.G ? S.G.name : DEFAULT_NAME;
  const diff = S.G ? S.G.diff : 0;
  startRun(name, diff);
  S.storyPage = 1;
  S.storyLineAt = Date.now();
  bind.renderHUD();
  goto('story');
  startBgm('village');
  bind.boxMsg('🔄 新的冒险开始！', 1600);
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
  bind.boxMsg('🔄 重整旗鼓，再战强敌！', 1600);
  startBattle(deep(def));
  return true;
}

export {
  newGame, applyStats, initGame, checkSkills, skillXpHint,
  saveKey, hasSlot, hasSave, slotPreview, saveGame, load, resetRun, retryBoss,
  takePotion, usePotion, questObjective, questLines, adventureProgress,
  brewNow, chiefPages, openTalk, talkNext, doTravel, beginAdventure,
  applyAchievements,
};
