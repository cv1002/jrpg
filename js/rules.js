// ============================================================
// rules.js —— 无副作用的战斗 / 成长 / 图鉴计算
// ============================================================
import { CHARGE_MULT, MON_BASE, ELITE_GOLEM, EMBER_GOLEM, ACH_LIST, WEAPONS, ARMORS, baseStats, BOSS, CAVE_BOSS, TRUE_BOSS, ELITE_GATE_LV, ELEM_MULT, SHIELD_MULT, DROP_EQUIP, DROP_POTION, DROP_MUSHROOM, DROP_ELIXIR, DROP_GOLD, RUSH_BASE_GOLD, RUSH_GOLD_PER_LV, POTION_HP_PCT, POTION_HP_FLAT, ELIXIR_HP_PCT, ELIXIR_HP_FLAT, ELIXIR_MP_PCT } from './data.js';

export function deep(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function cmdDmg(atk, def, mult, rollVariance) {
  const raw = Math.max(1, atk * 2 - def);
  return Math.round(raw * mult * (rollVariance ? 0.9 + Math.random() * 0.2 : 1));
}

export function elemMult(skill, enemy) {
  if (!skill || !skill.element || !enemy) return 1;
  // 读取单一数据源 ELEM_MULT（weak 1.35 / resist 0.7）：图鉴标注与帮助页同读此源，绝无第二套口径
  if (enemy.weak === skill.element) return ELEM_MULT.weak;
  if (enemy.resist === skill.element) return ELEM_MULT.resist;
  return 1;
}

export function skillDefUsed(skill, enemy) {
  let def = (enemy && enemy.def) || 0;
  if (skill && skill.pierce) def = Math.round(def * (1 - skill.pierce));
  return def;
}

// 石甲减伤（与 battle.attackMove / enemyAI 凝甲提示逐字同源，三处同读 SHIELD_MULT）：
// attackMove 命中时若敌方有石甲会把最终伤害再 ×SHIELD_MULT 取整（保底 1）并消耗 1 层；
// 伤害预览若不还原同一步，就会在石心魔像/洞窟领主凝甲时虚报伤害（≈N伤 比真实高出约 (1/0.6-1)≈67%），
// 玩家会误判「再一刀就破盾收掉」，实际却差出半刀。此处与真实结算同口径补上。
function withShield(dmg, enemy) {
  if (!enemy || (enemy.shield || 0) <= 0) return dmg;
  return Math.max(1, Math.round(dmg * SHIELD_MULT));
}

export function atkEstimate(hero, enemy) {
  if (!hero) return 1;
  const raw = Math.max(1, (hero.atkMax || 0) * 2 - ((enemy && enemy.def) ? enemy.def : 0));
  return withShield(Math.round(raw * (hero.charge ? CHARGE_MULT : 1)), enemy);
}

export function skillEstimate(hero, enemy, skill) {
  if (!skill) return 0;
  if (skill.kind === 'heal') return Math.round((hero.hpMax || 0) * skill.heal);
  let dmg = cmdDmg(hero.atkMax || 0, skillDefUsed(skill, enemy), 1, false) * skill.mult;
  dmg *= elemMult(skill, enemy || {});
  if (enemy && enemy.phase2 && skill.trueBonus) dmg *= skill.trueBonus;
  if (hero.charge) dmg *= CHARGE_MULT;
  return withShield(Math.round(dmg), enemy);
}

// 药水/灵药恢复量（单一数据源·纯函数）：hero.takePotion 结算与 view/drawBattle「[3]恢复」预览
// 同读此源——此前「恢复量公式」在 hero.js takePotion（结算，核心.js usePotion 与 battle.doItem
// 都经它消费）与 drawBattle 药水预览各写一遍 `Math.round(hpMax×POTION_HP_PCT)+POTION_HP_FLAT`、
// `Math.round(hpMax×ELIXIR_HP_PCT)+ELIXIR_HP_FLAT`、`Math.round(mpMax×ELIXIR_MP_PCT)`：
// 改恢复公式（如改成比例+等级加成、或换舍入方式）要改两个文件四行，还极易只改结算漏改预览，
// 界面标「+N HP」实际只回 M HP 悄然对不上。收口为纯函数后结算与预览永远同一份公式，
// 数值逐字不变（与旧公式逐值恒等），零恢复量回归。与 skillEstimate 同一「预览-结算同公式」家族。
export function potionRestore(hero) {
  return { h: Math.round(hero.hpMax * POTION_HP_PCT) + POTION_HP_FLAT };
}

export function elixirRestore(hero) {
  return {
    h: Math.round(hero.hpMax * ELIXIR_HP_PCT) + ELIXIR_HP_FLAT,
    m: Math.round(hero.mpMax * ELIXIR_MP_PCT),
  };
}

// Boss 报酬（单一数据源）：直读 data.js 的 BOSS / CAVE_BOSS / TRUE_BOSS，
// 真身/祸乱形态经 canonicalName 归一——图鉴「击败可得」标注与战斗结算同读同一份数据
const BOSS_DEFS = { '幽冥魔王': BOSS, '洞窟领主': CAVE_BOSS, '终焉之神': TRUE_BOSS };

export function monReward(name, level) {
  const lv = level || 1;
  const base = MON_BASE.find((m) => m.name === name);
  if (base) return { xp: base.xp[0] + lv * base.xp[1], gold: base.gold[0] + lv * base.gold[1] };
  if (name === ELITE_GOLEM.name) return { xp: ELITE_GOLEM.xp[0] + lv * ELITE_GOLEM.xp[1], gold: ELITE_GOLEM.gold[0] + lv * ELITE_GOLEM.gold[1] };
  // 残焰魔像（无字回廊中段精英）：固定兵力（不随玩家等级成长），报酬 xp/gold 直读 data.js EMBER_GOLEM
  // 单一数据源——与 BOSS/CAVE_BOSS/TRUE_BOSS 同为「固定值直达」档（此前漏分支返回 null，图鉴已讨伐行
  // 因 `if(rw)` 守卫整行不绘，玩家打完这位晚期精英反而看不到它的兵力/报酬，与石心魔像/三 Boss 不一致）
  if (name === EMBER_GOLEM.name) return { xp: EMBER_GOLEM.xp, gold: EMBER_GOLEM.gold };
  const boss = BOSS_DEFS[canonicalName(name)];
  if (boss) return { xp: boss.xp, gold: boss.gold };
  return null;
}

// 试炼三连战通关奖励（单一数据源）：battle.winBattle 结算与此处逐字同源，
// 战斗预览行实时显示确切数额（随当前等级）——通关前一眼看清「三连战除了经验还值多少金币」；
// 公式 150+lv×20 由 data.js RUSH_BASE_GOLD / RUSH_GOLD_PER_LV 推导（v19.62 数据化），
// 成就「百炼成钢」奖励标注同读此源（v19.62），调试炼通关奖只改 data.js 一处
export function rushReward(level) {
  const lv = Math.max(0, (level | 0) || 0);
  return RUSH_BASE_GOLD + lv * RUSH_GOLD_PER_LV;
}

// 图鉴「魔物强度」参考值（纯函数·随玩家等级）：与 battle.js 的 scaleEnemy / eliteEncounter 逐字同源，
// 与 monReward 报酬参考同口径——只取基准值（不含 village×0.9 / cave×1.2 地图倍率与困难模式 ×1.15/×1.12/×1.35），
// 供图鉴已讨伐行的「击败可得」参考该魔物在当前等级下的 HP/攻/防，一眼判断值不值得打/要不要防
export function codexStats(name, level) {
  const lv = Math.max(1, (level | 0) || 1);
  const base = MON_BASE.find((m) => m.name === name);
  if (base) return { hp: base.hp[0] + lv * base.hp[1], atk: base.atk[0] + lv * base.atk[1], def: base.def[0] + lv * base.def[1] };
  if (name === ELITE_GOLEM.name) return { hp: ELITE_GOLEM.hp[0] + lv * ELITE_GOLEM.hp[1], atk: ELITE_GOLEM.atk[0] + lv * ELITE_GOLEM.atk[1], def: ELITE_GOLEM.def[0] + lv * ELITE_GOLEM.def[1] };
  // 残焰魔像：固定兵力直读 data.js EMBER_GOLEM（与 monReward 同款补分支，单源、零结算，纯图鉴显示）
  if (name === EMBER_GOLEM.name) return { hp: EMBER_GOLEM.hp, atk: EMBER_GOLEM.atk, def: EMBER_GOLEM.def };
  const boss = BOSS_DEFS[canonicalName(name)];
  if (boss) return { hp: boss.hp, atk: boss.atk, def: boss.def };
  return null;
}

// 魔物「出没等级门槛」（单一数据源·纯函数）：普通魔物读 MON_BASE.minLv（仅 树精/石魔像 为 3，其余缺省 1），
// 精英石心魔像读 ELITE_GATE_LV（battle.randomEncounter 精英分支与图鉴「Lv.3起出没」标注同读此源）；
// Boss（幽冥魔王/洞窟领主/终焉之神）为剧情遭遇无等级门槛、返回 1。图鉴已讨伐行的出没标注与遇敌分布自此同一份数据
export function spawnLv(name) {
  const base = MON_BASE.find((m) => m.name === name);
  if (base && base.minLv) return base.minLv;
  if (name === '石心魔像') return ELITE_GATE_LV;
  return 1;
}

// 「强敌类敌手」判定（单一数据源·纯函数）：凡不可逃跑的 Boss 级敌人（主线魔王 /
// 洞窟领主 / 终焉之神 / 试炼连战）都带这四个旗标其一——此前 battle.doFlee 的逃跑拦截、
// startBattle 的重试快照、drawBattle 的名字配色与两处 isBossFlee 预判、drawMonster 的
// Boss 形象选择共 6 处各写一份相同的 `isBoss||isTrue||isCaveBoss||isRush`，想给某类
// 强敌加新旗标（如「可逃跑的机制怪」之外再加第五种强敌旗）要同步改六个地方；
// 收口为一个帮身后，强敌判定只有这里一份口径。空敌/null 返回 false（与旧 `enemy &&
// (...)` 短路一致），行为逐字不变。
export function isBossFoe(enemy) {
  return !!(enemy && (enemy.isBoss || enemy.isTrue || enemy.isCaveBoss || enemy.isRush));
}

export function canonicalName(name) {
  if (!name) return name;
  if (name === '幽冥魔王·真身' || name === '幽冥魔王 ·真身') return '幽冥魔王';
  if (name === '洞窟领主·真身' || name === '洞窟领主 ·真身') return '洞窟领主';
  if (name === '终焉之神·真身' || name === '终焉之神 ·真身' || name === '终焉之神·祸乱形态') return '终焉之神';
  return name;
}

export function applyStats(hero) {
  const base = baseStats(hero.level);
  hero.hpMax = base.hpMax;
  hero.mpMax = base.mpMax;
  hero.atkMax = base.atk + WEAPONS[hero.weapon].atk;
  hero.defMax = base.def + ARMORS[hero.armor].def;
  if (typeof hero.hp !== 'number' || hero.hp > hero.hpMax || hero.hp <= 0) hero.hp = hero.hpMax;
  if (typeof hero.mp !== 'number' || hero.mp > hero.mpMax) hero.mp = hero.mpMax;
}

export function unlockedAchievements(hero) {
  if (!hero) return [];
  const got = hero.ach || [];
  const newly = [];
  for (const ach of ACH_LIST) {
    if (got.includes(ach.id) || newly.includes(ach.id)) continue;
    if (ach.ok(hero)) newly.push(ach.id);
  }
  return newly;
}

// 战斗随机掉落（单一数据源）：随档位判定读 data.js DROP_*（装备 8% → 药水 12% → 蘑菇 12% → 灵药 6%，
// 合计 38%），battle.winBattle 结算调用，与帮助页「战斗掉落」标注同读此源——胜利后约 38% 触发：
// 8% 装备或+60金 · 12% 药水 · 12% 蘑菇/药水 · 6% 高级灵药，绝无第二套口径
export function rollDrop(hero, curMap) {
  const roll = Math.random();
  const edgePotion = DROP_EQUIP + DROP_POTION;             // 药水档上界（原 0.2）
  const edgeMushroom = edgePotion + DROP_MUSHROOM;         // 蘑菇档上界（原 0.32）
  const edgeElixir = edgeMushroom + DROP_ELIXIR;           // 灵药档上界（原 0.38）
  if (roll < DROP_EQUIP) {
    hero.drops = (hero.drops || 0) + 1;
    if (hero.weapon === '木剑' || hero.weapon === '铁剑') {
      // v21.1 掉落自动换装反馈追加面板攻击前后对比（信息透明·纯显示）：v20.5 已给商店购买换装
      // 带上「攻击 X→Y」，但战斗随机掉落的免费自动升级（木剑/铁剑→秘银剑）仍只报「已装备」——
      // 玩家在胜利结算拿到白嫖升级时，想确认面板涨了多少还要再按 I；与商店购买同款在改动
      // hero.weapon 前捕获 atkMax（旧档 typeof 兜底保持原文案），applyStats 后同源读数，零结算变化。
      const atkBefore = typeof hero.atkMax === 'number' ? hero.atkMax : null;
      hero.weapon = '秘银剑';
      applyStats(hero);
      return `⚔️ 掉落武器：秘银剑 已装备！${atkBefore !== null ? `（攻击 ${atkBefore}→${hero.atkMax}）` : ''}`;
    }
    if (hero.armor === '布衣' || hero.armor === '皮甲') {
      // v21.1 掉落自动换装反馈追加面板防御前后对比：同武器分支，与 v20.5 商店购买同款口径。
      const defBefore = typeof hero.defMax === 'number' ? hero.defMax : null;
      hero.armor = '锁子甲';
      applyStats(hero);
      return `🛡️ 掉落防具：锁子甲 已装备！${defBefore !== null ? `（防御 ${defBefore}→${hero.defMax}）` : ''}`;
    }
    hero.gold += DROP_GOLD;
    // v19.83 战斗随机掉落金币反馈追加持有总量（信息透明·纯显示）：v19.80 已给普通胜利/升级/试炼通关
    // 等大额金币来源带上余额，但战斗后约 38% 概率触发的额外掉落（含装备档已尽善时的 +60 金兜底）仍只报
    // 「金币 +N」；玩家拿到这笔意外之财后想确认「兜里现在一共多少」仍需再按 I 看状态页。直接读结算后的
    // hero.gold（本行已加 DROP_GOLD），与 v19.80 普通胜利余额提示同源，零数值变化。
    return `✨ 宝箱：金币 +${DROP_GOLD}（共 ${hero.gold} 金）`;
  }
  if (roll < edgePotion) {
    hero.item++;
    hero.drops = (hero.drops || 0) + 1;
    // v19.83 战斗随机掉落药水反馈追加剩余数量（信息透明·纯显示）：此前只报「生命药水 ×1」，
    // 玩家想确认药水库存是否充足仍需再按 I；直接读结算后的 hero.item，与 v19.74 用药剩余量同源，零数值变化。
    return `🍖 掉落：生命药水 ×1（剩余 ${hero.item} 瓶）`;
  }
  if (roll < edgeMushroom) {
    if (curMap === 'dungeon' || curMap === 'cave') {
      hero.mushrooms++;
      hero.drops = (hero.drops || 0) + 1;
      // v19.83 战斗随机掉落蘑菇反馈追加剩余数量（信息透明·纯显示）：与 v19.79 精英魔像蘑菇 /
      // v19.73 卖菇剩余量同源，零数值变化。
      return `🍄 掉落：魔法蘑菇 ×1（剩余 ${hero.mushrooms || 0} 株）`;
    }
    hero.item++;
    hero.drops = (hero.drops || 0) + 1;
    return `🍖 掉落：生命药水 ×1（剩余 ${hero.item} 瓶）`;
  }
  if (roll < edgeElixir) {
    hero.potion2 = (hero.potion2 || 0) + 1;
    hero.drops = (hero.drops || 0) + 1;
    // v19.83 战斗随机掉落高级灵药反馈追加剩余数量（信息透明·纯显示）：与 v19.74 用药剩余量同源，零数值变化。
    return `🧪 掉落：高级灵药 ×1（剩余 ${hero.potion2 || 0} 瓶）`;
  }
  return null;
}

// ============================================================
// 对话打字机节奏（单一数据源）：core.talkNext 补全判定与 view/menus.drawTalk
// 渲染同读这里——每字 TALK_CHAR_MS；标点（，。！？…—）停 4 拍，让台词有呼吸感
// ============================================================
export const TALK_CHAR_MS = 28;
const TALK_SLOW = new Set([...'，。！？…—']);
export function talkCharMs(ch) {
  return TALK_SLOW.has(ch) ? TALK_CHAR_MS * 4 : TALK_CHAR_MS;
}
// 本页打完所需总时长（ms）
export function pageTotalMs(page) {
  let t = 0;
  for (const line of page) for (const ch of line) t += talkCharMs(ch);
  return t;
}
// 给定经过 ms → 每行应显示的字数 + 是否整页打完
export function pageShownAt(page, elapsed) {
  let t = 0, done = true;
  const lines = page.map((line) => {
    let n = 0;
    for (const ch of line) {
      t += talkCharMs(ch);
      if (t <= elapsed) n++;
      else done = false;
    }
    return n;
  });
  return { lines, done };
}

// 对话行按可用像素宽自动折（纯显示辅助，measure 注入以便 Node 冒烟）：
// 返回 ≤ maxW 的片段数组；【…】金色强调块当整体不拆开（除非单块本身超宽才逐字兜底）。
// 绘图时只需按片段顺序落行，打字机预算（pageShownAt 的每行字数）沿片段顺序消耗即可。
export function wrapTalkLine(line, maxW, measure) {
  if (!line) return [];
  const segs = [];
  let cur = '';
  const pushCh = (ch) => {
    if (cur && measure(cur + ch) > maxW) { segs.push(cur); cur = ''; }
    cur += ch;
  };
  const parts = line.split(/(【[^】]*】)/);
  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith('【')) {
      // 金色块整体换行放置（保持金色不被打断层）
      if (cur && measure(cur + part) > maxW) { segs.push(cur); cur = ''; }
      if (measure(part) <= maxW) cur += part;
      else for (const ch of part) pushCh(ch);
      continue;
    }
    for (const ch of part) pushCh(ch);
  }
  if (cur) segs.push(cur);
  return segs;
}
