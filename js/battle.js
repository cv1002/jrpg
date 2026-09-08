// ============================================================
// battle.js —— 回合队列 / 玩家指令 / 战斗编排与结算（不 import world / view）
// 遇敌生成 → encounter.js；敌方行动 → enemyAI.js；Boss 重试 → core.js
// boxMsg / drawBattle / burst* ← bind.js；applyVictoryWorld ← hooks.js
// ============================================================
import { S, curMap } from './state.js';
import { RUSH_BOSSES, SKILL_DATA, WEAPONS, CHARGE_MULT, DIFF_SCALE, RUSH_RECOVER, FRAGMENTS, FLEE_SUCCESS, CRIT_RATE, CRIT_MULT, BIG_DMG, SHIELD_MULT, HIT_FB_MS, FX_ENEMY, FX_HERO, POISON_PCT, DOT_MIN, BURN_PCT, DEFEND_MP, TRUE_BONUS_GOLD, SYS_MSG_MS, MILESTONE_MS, NARR_MSG_MS, FINAL_LEAD_MS, STRONG_MSG_MS, WIN_MSG_MS, ACH_MSG_MS, BATTLE_GAP_MS, MEMORY_MSG_MS, WRAP_GAP_MS, HEAVY_MULT, ELEM_MULT } from './data.js';
import { deep, cmdDmg, elemMult, skillDefUsed, applyStats, canonicalName, isBossFoe, rushReward, rollDrop } from './rules.js';
import { SFX, startBgm, stopBgm, resumeBgm } from './audio.js';
import { bind } from './bind.js';
import { hooks } from './hooks.js';
import { goto } from './scene.js';
import { takePotion, potionAvailability, applyAchievements, grantXp } from './hero.js';
import { enemyAct } from './enemyAI.js';

function startRush() {
  S.G.rushStage = 1;
  bind.boxMsg('⚔️ 试炼开始——连战场上的三名强敌！', STRONG_MSG_MS);
  setTimeout(() => {
    if (S.scene === 'world') startBattle(deep(RUSH_BOSSES[0]));
  }, FINAL_LEAD_MS);
}

function addFx(x, y, text, color, bold) {
  S.fx.push({ x, y, text, color, bold, life: 44, vy: 1.5 });
}

function threatWarn() {
  const enemy = S.enemy;
  if (!enemy) return '';
  if (enemy.isTrue) return ' ⚠️⚠️ 极危：终焉之神是初灯的意志，先提升等级再战！';
  if (enemy.isBoss) return ' ⚠️ 强敌：旧灯卫的影子，注意补给与防御！';
  if (enemy.isRush) return '';
  const hero = S.G;
  // 双方基础伤害估算（单一数据源）：直读 rules.cmdDmg（raw = max(1, atk×2-def)，无浮动档即恒等于裸公式）——
  // 与 atkEstimate/skillEstimate 预览、enemyAI 敌方攻击同读同一份伤害公式；此前此处手写「atk×2-def」裸公式，
  // 想调伤害公式（如 atk×2 改 1.9）要改 rules.cmdDmg + 此处两处，威胁预警还会悄然与真实结算脱钩
  const playerHit = cmdDmg(hero.atkMax, enemy.def, 1, false);
  const enemyHit = cmdDmg(enemy.atk, hero.defMax, 1, false);
  let threat = enemy.isElite ? 1 : 0;
  if (enemy.hpMax > playerHit * 5) threat = Math.max(threat, 1);
  if (enemyHit * 2 >= hero.hpMax) threat = Math.max(threat, 2);
  // v21.47 威胁预警补「重击线」（信息透明·预警名副其实）：通用分支此前只按普攻估算 enemyHit——
  // 残焰魔像（acts 40% 重击）在 Lv10 推荐装备下一发重击 99 点（占满血 108 的 92%，v20.9 设计声明），
  // 普攻线 52×2=104 < 108 只报「有些棘手」；洞窟领主（acts 20% 重击）重击 48×2=96 ≥ Lv7 满血 87，
  // 普攻线同样失灵——「两击即死」的威胁只报「此敌有些棘手」，玩家按错误预期硬打被一发送走。
  // 现对持有 heavy 招的敌人按真实重击倍率（HEAVY_MULT，与 enemyAI 未变身重击结算同源）再判一次
  // 两击线：残焰魔像/洞窟领主 →「明显强于你」；无 heavy 招的普通怪/石心魔像（attack/shield）逐字不变，
  // 零结算零数值变化（threatWarn 纯显示，仅进战 blog 文案）。
  const hasHeavy = (enemy.acts || []).some((a) => a.type === 'heavy');
  if (hasHeavy) {
    const heavyHit = cmdDmg(enemy.atk, hero.defMax, HEAVY_MULT, false);
    if (heavyHit * 2 >= hero.hpMax) threat = Math.max(threat, 2);
  }
  if (threat >= 2) return ' ⚠️ 强敌：它明显强于你，小心应对！';
  if (threat === 1) return ' ⚠️ 此敌有些棘手，量力而行。';
  return '';
}

function cancelBattleQueue() {
  S.battleQ.length = 0;
  S.battleAdvancing = false;
  if (S.battleTimer) {
    clearTimeout(S.battleTimer);
    S.battleTimer = null;
  }
}

function enqueue(delay, fn) {
  S.battleQ.push({ delay: delay || 0, fn });
  advanceQueue();
}

function advanceQueue() {
  if (S.battleAdvancing) return;
  if (!S.battleQ.length) {
    S.battleBusy = false;
    bind.drawBattle();
    return;
  }
  S.battleAdvancing = true;
  S.battleBusy = true;
  const step = S.battleQ.shift();
  const finish = () => {
    S.battleAdvancing = false;
    if (S.scene !== 'battle') {
      cancelBattleQueue();
      S.battleBusy = false;
      return;
    }
    advanceQueue();
  };
  const run = () => {
    try { step.fn(); }
    catch (err) { console.error(err); cancelBattleQueue(); }
    finish();
  };
  if (step.delay) S.battleTimer = setTimeout(run, step.delay);
  else run();
}

function startBattle(enemyDef) {
  cancelBattleQueue();
  S.enemy = deep(enemyDef);
  // v19.41 图鉴「已遭遇」记录（信息透明·纯状态）：一进战即记入 hero.seen——
  // 此前只有「击败」才进图鉴（hero.bestiary），逃跑/战败的敌人在图鉴里仍是 ❓？？？，
  // 明明亲身撞见过却显示「从没遇到」；记下后图鉴对已遭遇未讨伐者揭示名字与出没地，
  // 兵力/弱点仍在讨伐后才显示（不剧透）。名字经 canonicalName 归一（真身→本体，与 bestiary 同口径），
  // 纯追加字段零结算变化（逃跑成功率/掉落/经验均不受影响）。
  // v21.37 已遭遇计数化（信息透明·纯状态）：v19.41 只记布尔「撞见过」→ 图鉴侧显示写死的「✕0」，
  // 玩家刷某怪多次（含逃跑/战败反复撞见）却永远看不到一个数字——现改为计数（每次进战 +1），
  // 与 bestiary 讨伐计数同族；旧档布尔 true 由图鉴侧 |0 归一为 1（至少撞见一次），零存档格式变化。
  {
    const _seenKey = canonicalName(S.enemy.name);
    if (S.G.seen) S.G.seen[_seenKey] = (S.G.seen[_seenKey] || 0) + 1;
    else S.G.seen = { [_seenKey]: 1 };
  }
  S.enemy.hpMax = enemyDef.hpMax || enemyDef.hp;
  S.G.defending = false;
  S.G.charge = false;
  S.G.poison = 0;
  S.enemy.burn = 0;
  S.enemy.skipNext = false;
  S.enemy.phased = false;
  S.enemy.forbid = null;
  if (S.G.diff) {
    // 困难倍率（data.js DIFF_SCALE 单一数据源）：与状态页/创建页标注同源，数值结算逐字不变
    S.enemy.hpMax = Math.round(S.enemy.hpMax * DIFF_SCALE.hp);
    S.enemy.atk = Math.round(S.enemy.atk * DIFF_SCALE.atk);
    S.enemy.def = Math.round(S.enemy.def * DIFF_SCALE.def);
  }
  S.enemy.hp = S.enemy.hpMax;
  goto('battle');
  S.battleBusy = true;
  S.blog = [`⚔️ 遭遇了 ${S.enemy.name}！${threatWarn()}`];
  S.blogView = 0;
  S.battleTurn = 1;
  // v21.3 战斗开场警报音（音效反馈）：进战瞬间的听觉钩子——Boss/试炼=低沉警报（SFX.boss），
  // 普通遭遇=两连下坠（SFX.alert）；与威胁预警文案/isBossFoe 同一强敌口径，静音时 tone 自然哑掉，零结算影响
  if (isBossFoe(S.enemy)) SFX.boss(); else SFX.alert();
  startBgm('battle');
  bind.renderHUD();
  bind.drawBattle();
  if (isBossFoe(S.enemy)) {
    const bossId = S.enemy.isTrue ? 'true' : S.enemy.isCaveBoss ? 'cave' : S.enemy.isBoss ? 'main' : 'rush';
    S.G._bossRetry = {
      hp: S.G.hp, mp: S.G.mp, item: S.G.item, potion2: S.G.potion2,
      gold: S.G.gold, level: S.G.level, xp: S.G.xp,
      weapon: S.G.weapon, armor: S.G.armor, name: S.enemy.name,
      x: S.G.x, y: S.G.y, curMap: curMap(),
      chests: Array.from(S.G.chests), bossId,
    };
  }
  enqueue(700, () => {});
}

function abortAction(message) {
  S.blog.push(message);
  S.battleBusy = false;
  bind.drawBattle();
  return true;
}

function applyPoisonTick(hero) {
  if ((hero.poison || 0) <= 0) return false;
  const damage = Math.max(DOT_MIN, Math.round(hero.hpMax * POISON_PCT));
  hero.hp -= damage;
  hero.poison--;
  SFX.hurt();
  bind.renderHUD();
  addFx(FX_HERO.x, FX_HERO.y, '-' + damage, '#7fe08a', true);
  // v21.8 中毒结算反馈追加我方剩余 HP（信息透明·纯显示）：v20.2 已给敌方攻击命中后追加我方剩余 HP，
  // 但持续伤害（中毒 tick）仍只报伤害值与剩余回合——玩家中毒后每回合掉血，想确认「再毒几轮会不会死」
  // 仍需瞄 HUD 血条；直接读结算后（hero.hp -= damage 之后）的 hero.hp / hero.hpMax，与 v20.2 的
  // 「我方 HP X/Y」同源同式；致死毒发（hero.hp <= 0）不追加，避免与后续败北提示重复（同 v20.0 击杀时
  // 不追加敌方剩余 HP 的口径）。零结算变化。
  S.blog.push(`☠️ 毒素发作，${hero.name} 受到 ${damage} 点伤害！${hero.poison > 0 ? `（剩余 ${hero.poison} 回合）` : ''}${hero.hp > 0 ? `（我方 HP ${hero.hp}/${hero.hpMax}）` : ''}`);
  if (hero.hp <= 0) {
    hero.hp = 0;
    bind.renderHUD();
    bind.boxMsg('💀', 0);
    loseBattle();
    return true;
  }
  return false;
}

function doAttack() {
  const hero = S.G;
  const enemy = S.enemy;
  const crit = Math.random() < CRIT_RATE;
  const charged = !!hero.charge;
  if (charged) hero.charge = false;
  bind.burstEnemy(['#fff', '#e8d8c0', '#ffd24a'], crit ? 22 : 10);
  // v21.57 暴击命中战报补确切倍率（信息透明·纯显示）：暴击链条的结算端（attackMove
  // `isCrit ? CRIT_MULT : 1` 读 CRIT_MULT 单一数据源）与状态页端（menus.js「普攻N%暴击 ×N」
  // 由 CRIT_RATE/CRIT_MULT 派生）两端早已量化，唯独命中战报这一端只报「（暴击！）」性质
  // 不报倍率——玩家普攻暴击时想确认「这一击到底吃到了多少加成」只能翻到状态页；现按
  // 状态页同口径补 ×N 倍率（CRIT_MULT 单一数据源同读，调暴击强度只改 data.js 一处、
  // 结算/状态页/战报三端自动跟随）。零结算零数值零存档变化（crit 判定与 attackMove
  // ×CRIT_MULT 结算逐字未动，只改 1 条 fmt 文案；暴击仅普攻可触发，技能 crit=false
  // 不受影响）。
  attackMove(
    (dmg) => finishPlayer(
      `${crit ? '💥' : '🗡️'} 你发动攻击，对 ${enemy.name} 造成 <dmg> 伤害${crit ? `（暴击×${CRIT_MULT}！）` : ''}${charged ? '（蓄力爆发！）' : ''}！`,
      dmg
    ),
    null,
    crit,
    charged ? CHARGE_MULT : 1
  );
}

function skillForbidden(skillName, skill, enemy) {
  if (!enemy.forbid) return false;
  // v21.48 汲回招并入 heal 封印口径：汲光击（drain）边打边回血，本质含治疗效果——
  // 终焉之神祸乱形态「封印治愈」若只封 kind==='heal'，汲光击会钻机制空子绕过招牌封印；
  // 此处 drain 招与治愈同封（技能菜单 ⛔封印 标注同源，drawBattle.js 同口径）。
  if ((skill.kind === 'heal' || skill.drain) && enemy.forbid.includes('heal')) return true;
  return !!(skillName && enemy.forbid.includes(skillName));
}

function doSkill(skillName) {
  const hero = S.G;
  const enemy = S.enemy;
  const skill = SKILL_DATA[skillName];
  if (!hero.skills.includes(skillName)) return abortAction('❌ 尚未领悟该技能');
  // v19.95 MP 不足反馈追加所需/当前 MP（信息透明·纯显示）：技能菜单已显示每招 MP 与缺口，
  // 但直接按数字键尝试施法时只报「MP 不足」——玩家想确认「这招到底要多少蓝、当前差几点」
  // 仍需瞄技能菜单或按 I 看状态页；直接读 skill.mp / hero.mp / hero.mpMax，零结算变化。
  if (hero.mp < skill.mp) return abortAction(`❌ MP 不足！【${skillName}】需要 ${skill.mp} MP（当前 ${hero.mp}/${hero.mpMax}）`);
  if (skillForbidden(skillName, skill, enemy)) {
    SFX.cancel();
    return abortAction(`⛔ 祸乱气场封印了【${skillName}】！`);
  }
  hero.mp -= skill.mp;
  bind.renderHUD();
  const charged = !!hero.charge;
  // v14.0 蓄力语义收敛：蓄力只加成「威力」（攻击/伤害技能 ×CHARGE_MULT），
  // 治疗不属于威力——此前治疗会把蓄力白白吃掉还谎称「蓄力加持」；现在治疗保留蓄力，
  // 治愈后下一次攻击/伤害技能仍按 ×CHARGE_MULT 结算（与 doCharge 文案「攻击或技能威力」一致）。
  if (charged && skill.kind !== 'heal') hero.charge = false;
  if (skill.kind === 'heal') {
    bind.burstPlayer(skill.colors, 16);
    const heal = Math.round(hero.hpMax * skill.heal);
    hero.hp = Math.min(hero.hpMax, hero.hp + heal);
    let extra = '';
    if (skill.cleanse && hero.poison > 0) {
      hero.poison = 0;
      extra = '，毒素被净化了';
    }
    SFX.heal();
    // v19.97 治疗技能反馈追加当前 HP（信息透明·纯显示）：v19.74 已给战斗用药反馈带上剩余数量，
    // 但治疗/净化类技能释放后只报恢复量——玩家刚用掉 MP 回血或解毒，想确认「当前 HP 是否安全、能否撑过下一轮」
    // 仍需瞄 HUD；直接读结算后的 hero.hp / hero.hpMax，与状态页 HP 显示同源，零结算变化。
    S.blog.push(`💚 ${hero.name} 使出【${skillName}】，恢复 ${heal} 点 HP${extra}${charged ? '（蓄力保留）' : ''}！（HP ${hero.hp}/${hero.hpMax}）`);
    bind.renderHUD();
    afterPlayer();
    return;
  }
  bind.burstEnemy(skill.colors, skillName === '陨石术' ? 36 : 20);
  let mult = skill.mult * elemMult(skill, enemy);
  if (enemy.phased && skill.trueBonus) mult *= skill.trueBonus;
  if (charged) mult *= CHARGE_MULT;
  const defSave = enemy.def;
  enemy.def = skillDefUsed(skill, enemy);
  attackMove((dmg) => {
    let note = '';
    if (skill.burn) {
      enemy.burn = (enemy.burn || 0) + skill.burn;
      // v21.50 灼烧命中瞬间战报量化（信息透明·纯显示）：灼烧链条的 tick 结算（enemyAI
      // 「灼烧令…受到 N 点伤害」）、HUD 角标（drawBattle「🔥 灼烧 N · 每回合 -N血」）、
      // 技能 hint（「灼烧2回合·每回合约-4%最大HP」）三端早已量化，唯独火焰斩命中上火的
      // 这一刻只报「（灼烧）」——玩家花 4MP 放火，想确认「这灼烧每回合到底烧多少、还要烧几回合」
      // 仍需等首次 tick 或瞄角标；现按 tick 同式 max(DOT_MIN, round(hpMax×BURN_PCT)) 补每回合
      // 烧血数（enemy.hpMax 战斗中不变，预估值与后续 tick 实扣逐值相等，非「约」），回合数读
      // 赋值后的 enemy.burn（灼烧可叠加——连放两发叠到 4 回合时如实报 4，与角标「灼烧 N」同一份源）。
      // BURN_PCT/DOT_MIN 单一数据源同读，调灼烧强度只改 data.js 一处、战报/角标/tick 三端自动跟随。
      // 零结算变化（enemy.burn 赋值与原行逐值同式）。
      note += `（灼烧 ${enemy.burn} 回合·每回合 -${Math.max(DOT_MIN, Math.round(enemy.hpMax * BURN_PCT))} HP）`;
    }
    if (skill.skip && Math.random() < skill.skip) { enemy.skipNext = true; note += '（冻结！）'; }
    if (skill.breakShield && (enemy.shield || 0) > 0) {
      enemy.shield = Math.max(0, enemy.shield - skill.breakShield);
      // v21.54 击碎瞬间战报量化剩余层数（信息透明·纯显示）：石甲链条的另外两端早已报层数——
      // 凝结端 enemyAI「（累计 N 层，所受伤害降低 X%）」、受击挡伤端 attackMove「（剩余 N 层）」，
      // 唯独技能击碎这一端只报「（石甲碎裂）」不说还剩几层——玩家放陨石术想确认「这怪石甲
      // 还剩几层、要不要再来一发」只能瞄右上角角标。现与 attackMove 挡伤端同口径：碎后仍有
      // 余层时报「（石甲碎裂，剩余 N 层）」，碎至 0 层时保持「（石甲碎裂）」逐字不变（与
      // attackMove 末层挡伤不标剩余同口径，敌甲角标随 shield=0 消失亦不再误导）。
      // enemy.shield 读赋值后单一数据源，零结算零数值零存档变化。
      note += `（石甲碎裂${enemy.shield > 0 ? `，剩余 ${enemy.shield} 层` : ''}）`;
    }
    // v21.48 汲回结算（汲光击 drain）：把本次伤害 ×drain 汲回为 HP，单次上限 drainCap×hpMax
    // （data.js DRAIN_PCT/DRAIN_HP_CAP 单一数据源），再钳制到实际可回量——满血时如实报
    // 「汲回 0 HP」（与 v19.97 治愈术报理论量+当前 HP 的口径同族，血量条/HUD 同源可见）。
    if (skill.drain) {
      const cap = Math.round(hero.hpMax * (skill.drainCap || 1));
      const dr = Math.min(hero.hpMax - hero.hp, Math.min(cap, Math.round(dmg * skill.drain)));
      hero.hp += dr;
      note += `（汲回 ${dr} HP）`;
    }
    // v21.55 克制命中战报补确切倍率（信息透明·纯显示）：元素克制链条的结算端（rules.elemMult
    // 读 ELEM_MULT 单一数据源）、帮助页「技能克制」行（「弱点伤害×1.35 · 抗性伤害×0.7」）、
    // 图鉴 codexTag（「弱点·火×1.35 / 抗性·冰×0.7」）三端早已带确切倍率，唯独命中战报这一端
    // 只报性质不报数值——玩家放技能命中时看到「（弱点）/（抗性）」，想确认「这一击到底吃到了
    // 多少加成/被削了多少」仍需翻图鉴或帮助页。现按图鉴同口径补 ×N 倍率（读 ELEM_MULT 单一
    // 数据源，调克制强度只改 data.js 一处、结算/帮助页/图鉴/战报四端自动跟随）。倍率值与
    // elemMult 判定逐值同源（>1 恒为 ELEM_MULT.weak、<1 恒为 ELEM_MULT.resist，无第三档），
    // 零结算零数值零存档变化（elemMult 两次调用逐字未动，只改 2 条 note 文案）。
    if (elemMult(skill, enemy) > 1) note += `（弱点×${ELEM_MULT.weak}）`;
    if (elemMult(skill, enemy) < 1) note += `（抗性×${ELEM_MULT.resist}）`;
    // v20.7 伤害技能施放反馈追加当前 MP（信息透明·纯显示）：v19.96 防御回蓝已报 MP、v19.97 治疗已报 HP、
    // v20.0 命中已报敌方剩余 HP，唯独「伤害技能扣蓝」后不报我方剩余 MP——玩家施法后想确认「还能不能再放一招」
    // 仍需瞄 HUD；直接读结算后的 hero.mp / hero.mpMax（line 202 已扣 skill.mp），与技能菜单/状态页 MP 显示
    // 同源，零结算变化（普攻不耗蓝，不在此列）。
    finishPlayer(`✨ ${hero.name} 使出【${skillName}】，造成 <dmg> 伤害${note}${charged ? '（蓄力）' : ''}！（MP ${hero.mp}/${hero.mpMax}）`, dmg);
  }, skill.sfx, false, mult);
  enemy.def = defSave;
  return true;
}

function doItem() {
  const hero = S.G;
  const { hpFull, mpFull, any } = potionAvailability(hero);
  if (!any) {
    return abortAction(hpFull && mpFull ? '✅ 你气满神足，无需用药！' : '❌ 没有可用的药水了！');
  }
  const result = takePotion();
  SFX.heal();
  bind.renderHUD();
  // v19.74 战斗用药反馈追加剩余数量（信息透明·纯显示）：与大地图 F 键喝药同源，
  // 直接读结算后的 hero.item / hero.potion2，让玩家连战中一眼知道灵药/药水库存。
  S.blog.push(
    result.strong
      ? `🧪 ${hero.name} 服下高级灵药，恢复 ${result.h} HP、${result.m} MP（高级灵药剩余 ${hero.potion2} 瓶）`
      : `🍖 ${hero.name} 服用药水，恢复 ${result.h} 点 HP（药水剩余 ${hero.item} 瓶）`
  );
  afterPlayer();
}

function doDefend() {
  const hero = S.G;
  hero.defending = true;
  SFX.block();
  const mp = Math.min(hero.mpMax, hero.mp + DEFEND_MP);
  const gained = mp - hero.mp;
  hero.mp = mp;
  bind.renderHUD();
  // v19.96 防御反馈追加当前 MP（信息透明·纯显示）：v19.95 已给 MP 不足拦截带上「当前/最大 MP」，
  // 但防御姿态恢复 MP 后只报恢复量——玩家刚靠防御回蓝，想确认「当前 MP 能否支撑下一轮技能」仍需瞄 HUD；
  // 直接读结算后的 hero.mp / hero.mpMax，与技能菜单/状态页 MP 显示同源，零结算变化。
  S.blog.push(`🛡️ ${hero.name} 摆出防御架势，本回合受到的伤害减半${gained > 0 ? `，并恢复 ${gained} 点 MP` : ''}！（MP ${hero.mp}/${hero.mpMax}）`);
  afterPlayer();
}

function doCharge() {
  const hero = S.G;
  const enemy = S.enemy;
  if (enemy.forbid && enemy.forbid.includes('charge')) {
    SFX.cancel();
    return abortAction('⛔ 气场压制，无法蓄力！');
  }
  hero.charge = true;
  SFX.block();
  S.blog.push(`⚡ ${hero.name} 凝神蓄力：下一次【攻击或技能】威力 ×${CHARGE_MULT}！`);
  afterPlayer();
}

function doFlee() {
  const hero = S.G;
  const enemy = S.enemy;
  if (isBossFoe(enemy)) {
    // 气场压制：本回合行动保留——不调度敌方行动、立即释放战斗回合（回归 v2.2/v1.37 既定设计「battleBusy 释放、不调度 enemyAct」；
    // 此前误调 afterPlayer() 会让「按 4 逃跑 = 白送回合挨 Boss 打」，与指令栏 ⛔「别按 4」的提示矛盾。普通怪逃跑行为完全不变）
    S.blog.push(`⚠️ ${enemy.name} 的气场压制着你，无法逃脱！（本回合行动保留）`);
    SFX.cancel();
    S.battleBusy = false;
    bind.drawBattle();
    return true;
  }
  if (Math.random() < FLEE_SUCCESS) {
    S.blog.push('🏃 成功逃脱了！');
    SFX.select();
    hero.charge = false;
    hero.poison = 0;
    cancelBattleQueue();
    goto('world');
    S.enemy = null;
    S.battleBusy = false;
    resumeBgm();
    return true;
  }
  // v21.53 逃脱失败战报追加后果提示（信息透明·纯显示）：此前只报「❌ 逃脱失败！」——玩家按 4 失败后
  // 往往没意识到这一回合已经让给敌方：Boss 气场分支早已明示「（本回合行动保留）」，普通失败分支恰恰是
  // 「行动被消耗」却无任何提示，两分支缺一端对照口径。现补「（X 即将行动）」，与 afterPlayer 实际
  // 推进 battleTurn 并编排 enemyAct 的结算一致；成功率口径仍由指令栏「约60%」承载（FLEE_SUCCESS
  // 单一数据源），战报不重复标注。零结算零数值零存档变化（afterPlayer 回合推进与 600ms 敌方行动编排逐字未动）。
  S.blog.push(`❌ 逃脱失败！（${enemy.name} 即将行动）`);
  SFX.cancel();
  afterPlayer();
}

const PLAYER_ACTIONS = {
  attack: doAttack,
  skill: doSkill,
  item: doItem,
  defend: doDefend,
  charge: doCharge,
  flee: doFlee,
};

function playerAction(type, arg) {
  if (S.scene !== 'battle' || S.battleBusy) return;
  // v21.5 战报回看跟随（体验打磨·纯显示）：回看旧战报（blogView>0）后发起行动 = 已读完历史、正在行动，
  // 把视图弹回最新——让本次行动产生的新战报（伤害/敌方 HP 剩余/敌方招数）直接落入 3 行视窗
  // （BLOG_WIN 单一数据源），不再出现「行动完看不到结果、以为没反应」；零结算，只复位显示偏移，
  // 回看能力本身（main.js ↑↓ 分派）逐字保留，被拒指令（MP 不足等）同样复位（其战报也值得立刻看到）
  if (S.blogView > 0) S.blogView = 0;
  S.battleBusy = true;
  S.G.defending = false;
  if (applyPoisonTick(S.G)) return;
  const fn = PLAYER_ACTIONS[type];
  const skipDraw = fn ? fn(arg) : false;
  if (!skipDraw) bind.drawBattle();
}

function attackMove(fin, sfx, crit, mult) {
  if (sfx) SFX[sfx]();
  else SFX.hit();
  const enemy = S.enemy;
  const hero = S.G;
  const isCrit = !!crit;
  let dmg = Math.round(cmdDmg(hero.atkMax, enemy.def, 1, true) * (isCrit ? CRIT_MULT : 1) * (mult || 1));
  if ((enemy.shield || 0) > 0) {
    enemy.shield--;
    dmg = Math.max(1, Math.round(dmg * SHIELD_MULT));
    S.blog.push(`🪨 ${enemy.name} 的石甲挡下了部分伤害！${enemy.shield > 0 ? `（剩余 ${enemy.shield} 层）` : ''}`);
  }
  addFx(bind.CV.width / 2, FX_ENEMY.y, '-' + dmg, enemy.isBoss ? '#ff7b7b' : '#ffd24a', dmg >= BIG_DMG || isCrit);
  // 震屏触发（纯显示）：暴击或大额伤害（≥BIG_DMG，与浮字加粗同源阈值）
  if (isCrit || dmg >= BIG_DMG) S.shake = { t0: Date.now(), pow: isCrit ? 4 : 3 };
  enemy.hp -= dmg;
  enemy.hurt = 1;
  S.anim = { hurt: 1, crit: isCrit };
  setTimeout(() => { enemy.hurt = 0; S.anim = null; }, HIT_FB_MS);
  fin(dmg);
}

function finishPlayer(fmt, dmg) {
  const enemy = S.enemy;
  const suffix = enemy.hp > 0 ? `（敌方 HP 剩余 ${enemy.hp}/${enemy.hpMax}）` : '';
  S.blog.push(fmt.replace('<dmg>', dmg) + suffix);
  if (S.enemy.hp <= 0) {
    S.enemy.hp = 0;
    S.blog.push(`💀 ${S.enemy.name} 被击败了！`);
    winBattle();
  } else {
    afterPlayer();
  }
  bind.drawBattle();
}

// 敌方行动的编排回调（enemyAI.js 不反向 import battle.js，经 deps 传入）
const BATTLE_DEPS = { addFx, winBattle, loseBattle };

function afterPlayer() {
  // v14.1 回合计数只在行动被「实际消耗」时推进：此前 battle.js 在 playerAction 起手无条件 battleTurn++，
  // 被拒绝的指令（MP 不足 / 无药 / 技能未学 / 气场封印）与 Boss 战逃跑（日志明说「本回合行动保留」）
  // 也都会白白虚涨「⚔️ 回合 N」——按几下废键计数就虚高一截，与「不耗回合」的文案自相矛盾。
  // 移到 afterPlayer 后，只有真正调度了敌方回合的指令才 +1：计数如实反映「实际走了几回合」。
  // 普通攻击/技能/药水/防御/蓄力/逃跑失败：照旧每行动一次 +1（进入敌方回合前）；逃跑成功与
  // Boss 逃（不调度敌方回合）以及各类被拒指令：不再虚涨。展示层 drawBattle 只读数，无第二口径。
  S.battleTurn++;
  enqueue(600, () => { if (S.scene === 'battle') enemyAct(BATTLE_DEPS); });
}

function winBattle() {
  cancelBattleQueue();
  SFX.victory();
  const hero = S.G;
  const enemy = S.enemy;
  hero.poison = 0;
  const bookName = canonicalName(enemy.name);
  hero.bestiary[bookName] = (hero.bestiary[bookName] || 0) + 1;
  hero.totalWins++;
  if (enemy.isElite) {
    hero.mushrooms++;
    // v19.79 精英怪掉落蘑菇反馈追加剩余库存（信息透明·纯显示）：此前击败石心魔像只报「捡到 1 株」，
    // 玩家想确认「包里现在有几株」还需再按 I 看状态页；现在直接读结算后的 hero.mushrooms，与 v19.73 卖菇剩余量、
    // v19.74 用药剩余量同源，零数值变化。
    bind.boxMsg(`💎 从魔像残骸中捡到 1 株魔法蘑菇！（剩余 ${hero.mushrooms || 0} 株）`, NARR_MSG_MS);
  }
  hero.gold += enemy.gold;
  const g = grantXp(hero, enemy.xp);
  if (g.leveled) {
    // v19.81 升级反馈追加剩余金币（信息透明·纯显示）：v19.80 已给普通胜利文案带上余额，但升级瞬间的
    // 里程碑横幅只报「金币加到 hero.gold 后」的等级属性变化——玩家刚因一场胜仗升级，往往正想确认「兜里
    // 还剩多少」去补给或换装；直接读结算后的 hero.gold（enemy.gold 已在 line399 加入），与 v19.80 普通胜利
    // 余额提示同源，零数值变化。
    bind.boxMsg(`🎉 等级提升到 Lv.${hero.level}！HP+${g.hp} MP+${g.mp} 攻+${g.atk} 防+${g.def}${enemy.isBoss ? '，你终于可以……' : ''}（剩余 ${hero.gold} 金）`, MILESTONE_MS);
  } else if (!enemy.isRush && hero.xpNext > hero.xp) {
    // v19.80 普通战斗胜利反馈追加剩余金币（信息透明·纯显示）：v19.75/19.76/19.77/19.78 已给商店/旅馆/
    // 任务奖励/药水购买成功文案带上余额，但战斗胜利（高频收入来源）仍只报「获得 N 金币」；玩家刚拿到一笔
    // 收入想确认「兜里还剩多少」仍需再按 I 看状态页。直接读结算后的 hero.gold（line 399 已加 enemy.gold），
    // 零数值变化，只追加显示。
    bind.boxMsg(`🏆 胜利！获得 ${enemy.gold} 金币、${enemy.xp} 经验 · 距 Lv.${hero.level + 1} 升级还需 ${hero.xpNext - hero.xp} 经验（剩余 ${hero.gold} 金）`, WIN_MSG_MS);
  }
  bind.renderHUD();
  applyAchievements();
  const drop = rollDrop(hero, curMap());
  if (drop) {
    bind.renderHUD();
    applyAchievements();
    bind.boxMsg('🎁 额外掉落：' + drop, WIN_MSG_MS);
  }

  const result = {
    type: enemy.isRush ? 'rush' : enemy.isBoss ? 'main-boss' : enemy.isCaveBoss ? 'cave-boss' : enemy.isTrue ? 'true-boss' : 'normal',
    gold: enemy.gold, xp: enemy.xp, name: bookName,
  };
  if (enemy.isCaveBoss) hero.caveBoss = true;
  if (enemy.isTrue) { hero.trueBoss = true; hero.gold += TRUE_BONUS_GOLD; }
  if (enemy.isBoss) hero.bossDefeated = true;
  // 记忆碎片（data.js FRAGMENTS 单一数据源）：强敌首胜掉落一段旧灯卫记忆，J 日志可回看
  const frag = FRAGMENTS.find((f) => f.enemy === bookName);
  if (frag && !(hero.fragments || []).includes(frag.id)) {
    hero.fragments.push(frag.id);
    // v19.90 记忆碎片拾取反馈追加收集进度（信息透明·纯显示）：此前只报「拾起一段记忆」与回看提示，
    // 玩家刚拿到强敌首胜掉落的一段记忆，想确认「离真结局·全记忆还差几段」仍需按 J 翻日志或按 I 看状态页；
    // 直接读结算后的 hero.fragments.length 与 FRAGMENTS.length（真结局判定/任务进度/名字石碑同读此源），
    // 零结算变化，只追加显示当前已集齐段数。
    const fragCount = (hero.fragments || []).length;
    bind.boxMsg(`🕯️ 拾起一段记忆：【${frag.name}】（按 J 日志回看 · ${fragCount}/${FRAGMENTS.length} 段记忆已集齐）`, MEMORY_MSG_MS);
  }
  hooks.applyVictoryWorld(result);

  if (enemy.isRush) {
    const stage = hero.rushStage;
    if (stage >= RUSH_BOSSES.length) {
      hero.rushStage = 0;
      hero.rushDone = true;
      const reward = rushReward(hero.level);
      hero.gold += reward;
      applyAchievements();
      SFX.victory();
      // v19.82 试炼通关反馈追加剩余金币（信息透明·纯显示）：v19.60 已给试炼碑加上「通关奖 N 金」预览，
      // 但三连战真正通关后的横幅只报奖励数额——玩家刚拿到一笔大额金币收入，想确认「兜里还剩多少」
      // 仍需再按 I 看状态页；直接读结算后的 hero.gold（line 444 已加 reward），与 v19.80 普通胜利/
      // v19.81 升级余额提示同源，零数值变化。
      bind.boxMsg(`🌈 试炼通关！奖励 ${reward} 金币！灯火记得你的名字！（剩余 ${hero.gold} 金）`, ACH_MSG_MS);
      setTimeout(() => { goto('world'); S.enemy = null; S.battleBusy = false; resumeBgm(); }, WRAP_GAP_MS);
    } else {
      // 连胜换关自动回血（data.js RUSH_RECOVER 单一数据源）：与战斗横幅/帮助页标注同读此源，数值结算逐字不变
      hero.hp = Math.min(hero.hpMax, hero.hp + Math.round(hero.hpMax * RUSH_RECOVER.hp));
      hero.mp = Math.min(hero.mpMax, hero.mp + Math.round(hero.mpMax * RUSH_RECOVER.mp));
      bind.renderHUD();
      hero.rushStage = stage + 1;
      bind.boxMsg(`🚩 试炼第 ${stage + 1} 关：${RUSH_BOSSES[stage].name} 现身！（已自动恢复${Math.round(RUSH_RECOVER.hp * 100)}%HP / ${Math.round(RUSH_RECOVER.mp * 100)}%MP）`, SYS_MSG_MS);
      setTimeout(() => { startBattle(deep(RUSH_BOSSES[stage])); }, BATTLE_GAP_MS);
    }
    return result;
  }
  if (enemy.isBoss) {
    // v19.92 幽冥魔王胜利反馈追加剩余金币（信息透明·纯显示）：v19.91 已给洞窟领主胜利横幅
    // 带上余额，但首个主线 Boss 幽冥魔王击败后只报「圣光之剑」——玩家刚拿到一笔金币/经验收入，
    // 想确认「兜里还剩多少」仍需再按 I 看状态页；直接读结算后的 hero.gold（line 399 已加 enemy.gold），
    // 同时补充本次获得的金币与经验，零数值变化。
    bind.boxMsg(`🏆 ${enemy.name}倒下！获得 ${enemy.gold} 金币、${enemy.xp} 经验 · 剩余 ${hero.gold} 金`, WIN_MSG_MS);
    if (hero.weapon !== '圣光之剑') {
      hero.weapon = '圣光之剑';
      applyStats(hero);
      bind.renderHUD();
      bind.boxMsg(`⚔️ 剑里封着被偷走的黎明——【圣光之剑】！攻+${WEAPONS['圣光之剑'].atk}`, WIN_MSG_MS);
    }
    applyAchievements();
    stopBgm();
    goto('win');
    bind.drawWin();
    return result;
  }
  if (enemy.isCaveBoss) {
    // v19.91 洞窟领主胜利反馈追加剩余金币（信息透明·纯显示）：v19.80 已给普通胜利/升级横幅
    // 带上余额，但洞窟领主作为首个主线 Boss 击败后只报「宝箱显形」——玩家刚拿到一笔金币/经验收入，
    // 想确认「兜里还剩多少」仍需再按 I 看状态页；直接读结算后的 hero.gold（line 399 已加 enemy.gold），
    // 同时补充本次获得的金币与经验，零数值变化。
    bind.boxMsg(`🏆 洞窟领主倒下！左边的星砂宝箱显形了，快去开启！获得 ${enemy.gold} 金币、${enemy.xp} 经验 · 剩余 ${hero.gold} 金`, WIN_MSG_MS);
    applyAchievements();
  }
  if (enemy.isTrue) {
    bind.boxMsg(`✨ 初灯的意志散了。记忆回到镇上。额外 ${TRUE_BONUS_GOLD} 金币！（剩余 ${hero.gold} 金）`, ACH_MSG_MS);
    applyAchievements();
    stopBgm();
    goto('ending');
    bind.drawEnding();
    return result;
  }
  setTimeout(() => { goto('world'); S.enemy = null; S.battleBusy = false; resumeBgm(); }, BATTLE_GAP_MS);
  return result;
}

function loseBattle() {
  cancelBattleQueue();
  S.G.rushStage = 0;
  S.G.poison = 0;
  stopBgm();
  goto('dead');
  SFX.death();
  bind.drawDead();
}

function updateBattle() {
  if (S.scene === 'battle') bind.drawBattle();
}

export {
  startBattle, startRush, playerAction, updateBattle, winBattle, loseBattle,
};
