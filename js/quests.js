// ============================================================
// quests.js —— 任务状态机（日志由 QUESTS + 旗标推导；兼容旧档 G.quest）
// ============================================================
import { QUESTS, NPCS } from './data.js';

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
  const quests = hero.quests;
  if (quests.side_mushroom == null) {
    if (hero.quest === 1) quests.side_mushroom = 'active';
    else if (hero.quest === 2) quests.side_mushroom = 'turnin';
    else if (hero.quest >= 3) quests.side_mushroom = 'done';
  }
  if (hero.caveBoss && quests.side_cart == null) quests.side_cart = 'active';
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
  return ent.lines;
}
