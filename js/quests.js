// ============================================================
// quests.js —— 任务状态机（日志由 QUESTS + 旗标推导；兼容旧档 G.quest）
// ============================================================
import { QUESTS, NPCS, learnsAt } from './data.js';

function flagsOn(hero, unlockOn) {
  if (!unlockOn) return true;
  const keys = Array.isArray(unlockOn) ? unlockOn : [unlockOn];
  return keys.every((k) => !!(hero && hero[k]));
}

function stored(hero, id) {
  return hero && hero.quests ? hero.quests[id] : null;
}

export function migrateQuests(hero) {
  if (!hero) return hero;
  if (!hero.quests) hero.quests = {};
  if (!hero.fragments) hero.fragments = [];
  // v19.41 图鉴「已遭遇」记录（信息透明·纯状态）：进战即记（battle.startBattle），
  // 逃跑/战败后图鉴也能揭示名字与出没地；旧档/新档都在此兜底为空对象，
  // 新增字段随 snapshotHero 全量快照自动持久化，零存档结构变更。
  if (!hero.seen) hero.seen = {};
  // v21.89 旧档 visited 兜底（存档兼容·承上方 seen/fragments/skills 兜底同族）：快速旅行两端
  // （menus.drawTravel 渲染 / core.doTravel 判定）直接读 hero.visited，旧档（含单文件时代读档）
  // 可能无此字段——缺字段时按 T 开旅行页即抛 TypeError（v21.88 成就端已 (g.visited||[]) 防御、
  // 旅行端是同一字段仅有的两处直接读）；现读档兜底为 ['village']（任何存档必然到访过起始村、
  // 与 newGame 起始值逐字一致），零迁移判定改动、不误解锁「走遍四方」（其余三图仍须真实到访）、
  // 既有含 visited 的存档逐字不动。
  if (!Array.isArray(hero.visited)) hero.visited = ['village'];
  const quests = hero.quests;
  if (quests.side_mushroom == null) {
    if (hero.quest === 1) quests.side_mushroom = 'active';
    else if (hero.quest === 2) quests.side_mushroom = 'turnin';
    else if (hero.quest >= 3) quests.side_mushroom = 'done';
  }
  if (hero.caveBoss && quests.side_cart == null) quests.side_cart = 'active';
  // v21.48 旧档技能补齐（存档兼容·与上方 seen/fragments 兜底同族）：技能领悟表新增条目
  // （如 v21.48 的 Lv9 汲光击）前已达标的老存档，hero.checkSkills 只在升级瞬间触发、永不回头——
  // 读档（core.load → migrateQuests）按当前等级补学漏掉的技能，老档自动补领新招；
  // 新档（core.newGame → migrateQuests，skills 已含 learnsAt(1)）与升级路径均幂等零变化。
  if (!Array.isArray(hero.skills)) hero.skills = [];
  for (let lv = 1; lv <= (hero.level || 1); lv++) {
    const sk = learnsAt(lv);
    if (sk && !hero.skills.includes(sk)) hero.skills.push(sk);
  }
  syncQuestInt(hero);
  return hero;
}

export function syncQuestInt(hero) {
  const status = hero.quests && hero.quests.side_mushroom;
  hero.quest = status === 'active' ? 1 : status === 'turnin' ? 2 : status === 'done' ? 3 : 0;
}

export function setSideQuest(hero, id, status) {
  if (!hero.quests) hero.quests = {};
  hero.quests[id] = status;
  syncQuestInt(hero);
}

export function mushroomQuestProtects(hero) {
  const status = hero && hero.quests && hero.quests.side_mushroom;
  return status === 'active' || status === 'turnin';
}

/** offer | active | turnin | done | locked | hidden */
export function questStatus(hero, id) {
  const def = QUESTS[id];
  if (!def || !hero) return 'hidden';
  if (def.flag) {
    if (hero[def.flag]) return 'done';
    if (!flagsOn(hero, def.unlockOn)) return def.hiddenUntilUnlock ? 'hidden' : 'locked';
    return 'active';
  }
  if (!flagsOn(hero, def.unlockOn)) return def.hiddenUntilUnlock ? 'hidden' : 'locked';
  const st = stored(hero, id);
  // 条件式交付（单一数据源 QUESTS[].cond）：进行中且条件达成 → 可交付
  if (st === 'active' && def.cond && def.cond(hero)) return 'turnin';
  if (st === 'active' || st === 'turnin' || st === 'done') return st;
  if (def.unlockOn) return 'active';
  return 'offer';
}

function objectiveText(hero, def, status) {
  if (status === 'offer' && def.offer) return def.offer;
  if (status === 'turnin' && def.turnin) return def.turnin;
  if (status === 'done') return def.done || def.obj;
  if (status === 'locked') return def.unlockHint ? ('未解锁 · ' + def.unlockHint) : '未解锁';
  if (def.item && def.n && status === 'active') {
    return `${def.obj} ${hero[def.item] || 0}/${def.n} 株`;
  }
  // 条件式任务实时进度（如 碎片 2/4 枚、雾灵 1/3 只）
  if (def.condProg && status === 'active') return `${def.obj} ${def.condProg(hero)}`;
  return def.obj;
}

export function questJournal(hero) {
  if (!hero) return [];
  const out = [];
  for (const def of Object.values(QUESTS)) {
    const status = questStatus(hero, def.id);
    if (status === 'hidden') continue;
    out.push({
      id: def.id,
      kind: def.kind === 'side' ? 'side' : 'main',
      name: def.name || def.id,
      status,
      objective: objectiveText(hero, def, status),
      where: def.where || '',
      reward: def.reward || null,
    });
  }
  return out;
}

export function mainObjective(hero) {
  if (!hero) return '';
  const log = questJournal(hero);
  const mains = log.filter((e) => e.kind === 'main');
  const cur = mains.find((e) => e.status === 'active');
  if (cur) return cur.objective;
  const last = [...mains].reverse().find((e) => e.status === 'done');
  return last ? last.objective : QUESTS.main_demon.obj;
}

export function sideObjectives(hero) {
  const rank = { turnin: 0, active: 1, offer: 2 };
  return questJournal(hero)
    .filter((e) => e.kind === 'side' && rank[e.status] != null)
    .sort((a, b) => rank[a.status] - rank[b.status])
    .map((e) => e.objective);
}

export function questLines(hero) {
  return { main: mainObjective(hero), sides: sideObjectives(hero), journal: questJournal(hero) };
}

export const QUEST_TAG = {
  offer: '可接', active: '进行中', turnin: '可交付', done: '已完成', locked: '未解锁',
};

function questNpcId(def) {
  return (def && (def.giver || def.npc)) || null;
}

export function questRewardPreview(hero, id) {
  const def = QUESTS[id];
  const reward = def && def.reward;
  if (!reward) return null;
  const gold = typeof reward.gold === 'function' ? reward.gold((hero && hero.level) || 1) : (reward.gold || 0);
  const item = reward.item || 0;
  const potion2 = reward.potion2 || 0;
  if (!gold && !item && !potion2) return null;
  return { gold, item, potion2 };
}

function locSuffix(objective, where, status) {
  if (!where || status === 'done' || status === 'locked') return '';
  const norm = (s) => String(s || '').replace(/[的，。、！？!?·\s]/g, '');
  if (norm(objective).includes(norm(where))) return '';
  return `（${where}）`;
}

/** 任务条文案：与日志同源，未含地点名时补「（地点）」；支线带阶段标签 */
export function questBannerLines(hero) {
  const journal = questJournal(hero);
  const mains = journal.filter((e) => e.kind === 'main');
  const curMain = mains.find((e) => e.status === 'active')
    || [...mains].reverse().find((e) => e.status === 'done');
  const rank = { turnin: 0, active: 1, offer: 2 };
  const sides = journal
    .filter((e) => e.kind === 'side' && rank[e.status] != null)
    .sort((a, b) => rank[a.status] - rank[b.status]);
  return {
    main: curMain ? (curMain.objective + locSuffix(curMain.objective, curMain.where, curMain.status)) : '',
    sides: sides.map((e) => {
      const tag = QUEST_TAG[e.status] || e.status;
      return `${e.name} · ${tag} · ${e.objective}${locSuffix(e.objective, e.where, e.status)}`;
    }),
  };
}

/** 对话确认时推进任务：接委托 / 交任务发奖。无待办则返回 null，由调用方翻页。 */
export function resolveNpcTalk(hero, npcId) {
  if (!hero || !npcId) return null;
  for (const def of Object.values(QUESTS)) {
    if (questNpcId(def) !== npcId) continue;
    const st = questStatus(hero, def.id);
    if (st === 'offer') {
      setSideQuest(hero, def.id, 'active');
      return { kind: 'accept', id: def.id, name: def.name };
    }
    if (st === 'turnin' || (st === 'active' && def.completeOnTalk)) {
      setSideQuest(hero, def.id, 'done');
      const { gold, item, potion2 } = applyQuestReward(hero, def.id);
      return { kind: 'reward', id: def.id, name: def.name, gold, item, potion2 };
    }
  }
  return null;
}

/** 兼容旧 UI：主线优先；有支线时拼在同一句后面。 */
export function questObjective(hero) {
  const { main, sides } = questLines(hero);
  return sides[0] ? `${main}  /  ${sides[0]}` : main;
}

export function adventureProgress(hero) {
  return [
    ['灯芯', !!hero.bossDefeated],
    ['星井', !!hero.caveBoss],
    ['回廊', !!hero.galleryOpen],
    ['初灯', !!hero.trueBoss],
    ['试炼场', !!hero.rushDone],
  ];
}

export function applyQuestReward(hero, id) {
  const def = QUESTS[id];
  const reward = def && def.reward;
  if (!hero || !reward) return { gold: 0, item: 0 };
  const gold = typeof reward.gold === 'function' ? reward.gold(hero.level) : (reward.gold || 0);
  const item = reward.item || 0;
  hero.gold += gold;
  if (item) hero.item = (hero.item || 0) + item;
  if (reward.potion2) hero.potion2 = (hero.potion2 || 0) + reward.potion2;
  return { gold, item, potion2: reward.potion2 || 0 };
}

function talkPagesOf(def, status, hero) {
  if (!def || !def.talk) return null;
  const pages = def.talk[status] || def.talk.offer;
  if (!pages) return null;
  return typeof pages === 'function' ? pages(hero) : pages;
}

/** NPC 是否正有「可交互待办」（接委托 / 交任务）——由 QUESTS.giver/npc 推导 */
export function npcQuestMark(hero, npcId) {
  if (!hero || !npcId) return null;
  for (const def of Object.values(QUESTS)) {
    if (questNpcId(def) !== npcId) continue;
    const st = questStatus(hero, def.id);
    if (st === 'offer') return '❕ 可接委托';
    if (st === 'turnin' || (st === 'active' && def.completeOnTalk)) return '❕ 可交任务';
  }
  return null;
}

export function npcQuestPages(hero, npcId) {
  for (const def of Object.values(QUESTS)) {
    if (questNpcId(def) !== npcId || !def.talk) continue;
    const st = questStatus(hero, def.id);
    const pages = talkPagesOf(def, st === 'locked' ? 'offer' : st, hero);
    if (pages) return pages;
  }
  // 无待办任务时回退到 NPC 静态台词；通关后（trueBoss）若定义 after 彩蛋则优先展示
  const ent = NPCS[npcId];
  if (!ent) return [['……']];
  if (hero && hero.trueBoss && ent.after) return ent.after;
  // linesByStage（井巫）：按主线旗标选段，揭示随进度推进（数据在 data.js，选段在此）
  if (ent.linesByStage) {
    let pick = ent.linesByStage[0].lines;
    for (const st of ent.linesByStage) {
      if (!st.gate || (hero && hero[st.gate])) pick = st.lines;
    }
    return pick;
  }
  // v21.24 函数型 lines（守碑人）：台词由 data.js RUSH_* 试炼常量派生，调用期求值并以 hero 当前等级
  // 实时计算（赏金随等级）；静态 NPC 仍走下方数组直返，行为逐字不变。
  if (typeof ent.lines === 'function') return ent.lines(hero);
  return ent.lines;
}
