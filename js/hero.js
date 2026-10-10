// ============================================================
// hero.js —— 药水 / 技能领悟 / 成就应用（无 world/battle/shop 依赖）
// boxMsg ← view/hud.js
// ============================================================
import { S } from './state.js';
import { learnsAt, ACH_LIST, LEARN_AT, WEAPONS, ARMORS, SKILL_DATA, baseStats, MAX_LEARN_LV, XP_GROW, XP_INIT, PERFECTION_GOLD, SYS_MSG_MS, ACH_MSG_MS, CODEX_MSG_MS } from './data.js';
import { unlockedAchievements, potionRestore, elixirRestore } from './rules.js';
import { SFX } from './audio.js';
import { bind } from './bind.js';

// 药水可用性判定（单一数据源）：core.usePotion 与 battle.doItem 同源——
// 高级灵药优先（可同时补 MP）、普通药水只在掉血时用；满状态不浪费
export function potionAvailability(hero) {
  const hpFull = hero.hp >= hero.hpMax;
  const mpFull = hero.mp >= hero.mpMax;
  const strongOk = hero.potion2 > 0 && (!hpFull || !mpFull);
  const weakOk = hero.item > 0 && !hpFull;
  return { hpFull, mpFull, any: strongOk || weakOk };
}

export function takePotion() {
  const hero = S.G;
  // 恢复量公式（单一数据源）：与 view/drawBattle「[3]恢复」预览同读 rules.potionRestore/elixirRestore，
  // 结算与预览永远同一份公式——总量来自 hero.hpMax/mpMax × data.js POTION_*/ELIXIR_* 常量
  if (hero.potion2 > 0) {
    hero.potion2--;
    const { h, m } = elixirRestore(hero);
    hero.hp = Math.min(hero.hpMax, hero.hp + h);
    hero.mp = Math.min(hero.mpMax, hero.mp + m);
    return { h, m, strong: true };
  }
  if (hero.item > 0) {
    hero.item--;
    const { h } = potionRestore(hero);
    hero.hp = Math.min(hero.hpMax, hero.hp + h);
    return { h, strong: false };
  }
  return null;
}

export function checkSkills() {
  const hero = S.G;
  const skill = learnsAt(hero.level);
  if (skill && !hero.skills.includes(skill)) {
    hero.skills.push(skill);
    // v21.61 领悟新技能战报补效果摘要（信息透明·纯显示）：技能效果链条的菜单端（drawBattle
    // 技能列表每招带 hint 次行）与状态页端（menus「· 技能名（hint） · N MP」）两端早已量化，
    // 唯独领悟这一刻只报名字——玩家升级瞬间最想确认「这招干什么、耗多少蓝」，只能事后按 2/I
    // 翻菜单。现按状态页同式补「（N MP · hint · 战斗中按 2 选用）」，mp/hint 同读 SKILL_DATA
    // 单一数据源（调技能只改 data.js 一处、菜单/状态页/领悟战报三端自动跟随，绝无第二套口径）。
    // 防御式读取：SKILL_DATA 漏配时保持原句逐字不变不抛错（LEARN_AT 现 6 招均有配，由冒烟契约守护）。
    // 零结算零数值零存档变化（push 与 includes 拦截逐字未动，只改 1 条文案 + import 接入）。
    const sd = SKILL_DATA[skill];
    // v24.20 体验打磨·信息透明·计数现场：领悟战报补「📖 诸技通明 N/8」进度后缀（承 v24.19 掉落战报
    // 「🍀 鸿运当头 N/30」/ v24.17 喝药「💧 渴饮甘露 N/10」/ v24.16 HUD「🚶 千里之行 N/1000」/
    // v24.12 胜利「⚔️ 身经百战 N/100」同一「计数现场报进度」主线，详见 data.js GAME_VERSION 上方
    // v24.20 注释）：成就「诸技通明」（v21.59 技能全领悟里程碑，判定/进度/描述同读 data.js LEARN_AT
    // 单一数据源——现共 8 招 Lv1/3/4/5/7/9/11/12，计数 hero.skills 由本函数升级领悟唯一写入点
    // push、snapshotHero 全量快照自动持久化、防御式 (hero.skills||[]) 旧档零迁移）此前进度只藏在
    // C 成就页一行 X/8，而它的计数现场正是每次「🌟 领悟了新技能」战报本身——升级领悟当场查无
    // 一眼之数（领悟是低频事件（整局至多 8 次），不像 v23.64 熟能生巧每发一报需零战报后缀的取舍，
    // 与 v24.19 掉落战报同族）；现报文末尾补「（📖 诸技通明 N/8）」（分子读 (hero.skills||[]).length
    // 防御式旧档零迁移、分母读 Object.keys(LEARN_AT).length 单一数据源，与 I 状态页「已学技能 N/8」/
    // 战斗技能菜单「已学 N/7」/ACH_LIST skills 的 ok/prog 同读一份源，调技能表只改 data.js 一处全端
    // 自动跟随），纯显示零结算零存档零数值变化（LEARN_AT 表/领悟拦截/push/经验结算/成就判定逐字未动）。
    bind.boxMsg(`🌟 领悟了新技能【${skill}】！${sd ? `（${sd.mp} MP · ${sd.hint} · 战斗中按 2 选用）` : ''}（📖 诸技通明 ${(hero.skills || []).length}/${Object.keys(LEARN_AT).length}）`, SYS_MSG_MS);
    SFX.levelup();
  }
}

// 经验结算与升级循环（从 battle.winBattle 拆出，单一数据源）：
// 返回本段经验带来的累计成长，供胜利横幅展示
export function grantXp(hero, xp) {
  hero.xp += xp;
  const g = { leveled: false, hp: 0, mp: 0, atk: 0, def: 0 };
  while (hero.xp >= hero.xpNext) {
    hero.xp -= hero.xpNext;
    hero.xpNext = Math.round(hero.xpNext * XP_GROW);
    hero.level++;
    const base = baseStats(hero.level);
    const dh = base.hpMax - hero.hpMax;
    const dm = base.mpMax - hero.mpMax;
    const da = base.atk + WEAPONS[hero.weapon].atk - hero.atkMax;
    const dd = base.def + ARMORS[hero.armor].def - hero.defMax;
    hero.atkMax = base.atk + WEAPONS[hero.weapon].atk;
    hero.defMax = base.def + ARMORS[hero.armor].def;
    hero.hpMax = base.hpMax;
    hero.mpMax = base.mpMax;
    hero.hp = Math.min(hero.hpMax, hero.hp + dh);
    hero.mp = Math.min(hero.mpMax, hero.mp + dm);
    g.hp += dh; g.mp += dm; g.atk += da; g.def += dd;
    g.leveled = true;
    SFX.levelup();
    checkSkills();
  }
  return g;
}

export function skillXpHint(hero) {
  if (!hero) return null;
  let next = null;
  // 扫描上界读 data.js MAX_LEARN_LV（= LEARN_AT 最大领悟级，单一数据源）：
  // 此前裸 8 与领悟表脱钩——新增更高等级技能时提示会永远扫不到
  for (let lv = (hero.level || 1) + 1; lv <= MAX_LEARN_LV; lv++) {
    const skill = learnsAt(lv);
    if (skill && !(hero.skills || []).includes(skill)) {
      next = { name: skill, lv };
      break;
    }
  }
  if (!next) return null;
  const base = Math.max(1, hero.xpNext || XP_INIT);
  const xp = Math.max(0, hero.xp || 0);
  let need = base - xp;
  let nxt = Math.round(base * XP_GROW);
  for (let lv = (hero.level || 1) + 2; lv <= next.lv; lv++) {
    need += nxt;
    nxt = Math.round(nxt * XP_GROW);
  }
  return { name: next.name, lv: next.lv, remain: Math.max(0, need) };
}

export function applyAchievements() {
  const hero = S.G;
  if (!hero) return;
  hero.ach = hero.ach || [];
  const newly = unlockedAchievements(hero);
  for (const id of newly) {
    if (hero.ach.includes(id)) continue;
    hero.ach.push(id);
    // v23.22 成就解锁专属铃声（音效反馈·语义修正）：此前对每个新成就播放 SFX.levelup()（升级琶音）——
    // 成就与升级同音，且升级+成就同时达成时琶音连响两次（听感噪音）；现改播音频专属 SFX.ach()
    // （audio.js 上行铃声），解锁瞬间听声即知是成就非升级（与升级的 SFX.levelup 各归其位）；
    // 零结算零数值零存档零布局，解锁判定/横幅/奖励逐字未动。
    SFX.ach();
    const def = ACH_LIST.find((x) => x.id === id);
    if (id === 'perfection') {
      hero.gold += PERFECTION_GOLD;
      // v21.64 图鉴全收集横幅补成就名【记忆守护者】（信息透明·口径一致·纯显示）：成就解锁链条的
      // 横幅端 24 项里 23 项都报「🔓 成就解锁：【名】」（下方通用分支），唯独 perfection 的特别
      // 庆贺横幅只报「图鉴收集完成！额外奖励…」——玩家集齐图鉴这一刻看不到自己解锁的成就叫什么，
      // 事后翻成就页（C）才对得上「记忆守护者」是这一刻解锁的。现按通用分支同款口径在句首补
      // 「成就解锁：【名】」，名读 ACH_LIST 单一数据源（def 上方已查，改名自动跟随，绝无第二套
      // 口径），防御式回落 `def ? def.name : id` 与通用分支逐字同式；🏆 里程碑视觉与 CODEX_MSG_MS
      // 更长档保留，加奖结算（hero.gold += PERFECTION_GOLD）逐字未动，零结算零数值零存档变化。
      bind.boxMsg(`🏆 成就解锁：【${def ? def.name : id}】图鉴收集完成！额外奖励 ${PERFECTION_GOLD} 金币！（剩余 ${hero.gold} 金）`, CODEX_MSG_MS);
    } else {
      // v24.76 体验打磨·信息透明·计数现场：🔓 成就解锁横幅补「（成就 N/76）」进度后缀（承 v24.55 住店
      // 战报/v24.57 夜间胜利战报同一「计数现场报进度」主线——解锁瞬间正是成就收集线的计数现场：此前
      // 通用分支只报「【名】+ 描述」，整条收集线进度只藏在 C 成就页「已解锁 N/M」与 I 状态页
      // 「🏆:N/M」两处静态页（v22.9/v21.96-v22.3 五端同源），玩家在解锁瞬间看不到自己离全收集还差
      // 几枚；现按 v24.26 升级横幅「（🌙 守灯者 N/10）」同款在句末补「（成就 N/M）」，分子读本函数
      // 唯一产生点上方已 push 的 hero.ach（解锁即含本次）、分母读 data.js ACH_LIST 单一数据源（与
      // C 页/胜利/阵亡/尾声/状态页同读一份源，增删成就只改 data.js 一处自动跟随），防御式
      // (hero.ach||[]).length 旧档零迁移；perfection 特别庆贺分支（🏆 图鉴收集完成 + 999 金 + 剩余金币）
      // 信息已过载保持逐字零回归；纯显示零结算零存档零数值变化（解锁判定/hero.ach 写入/铃声/奖励
      // 结算逐字未动）。
      bind.boxMsg(`🔓 成就解锁：【${def ? def.name : id}】 ${def ? def.d : ''}（成就 ${(hero.ach || []).length}/${ACH_LIST.length}）`, ACH_MSG_MS);
    }
  }
}
