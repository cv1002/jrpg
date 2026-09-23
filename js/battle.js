// ============================================================
// battle.js —— 回合队列 / 玩家指令 / 战斗编排与结算（不 import world / view）
// 遇敌生成 → encounter.js；敌方行动 → enemyAI.js；Boss 重试 → core.js
// boxMsg / drawBattle / burst* ← bind.js；applyVictoryWorld ← hooks.js
// ============================================================
import { S, curMap } from './state.js';
import { RUSH_BOSSES, SKILL_DATA, WEAPONS, CHARGE_MULT, CHARGE_GOAL, CRIT_GOAL, CAST_GOAL, FLEE_GOAL, POTION_USE_GOAL, RUSH_CLEAR_GOAL, DIFF_SCALE, RUSH_RECOVER, FRAGMENTS, BESTIARY_TARGET, FLEE_SUCCESS, CRIT_RATE, CRIT_MULT, BIG_DMG, SHIELD_MULT, HIT_FB_MS, FX_ENEMY, FX_HERO, POISON_PCT, DOT_MIN, BURN_PCT, DEFEND_MP, TRUE_BONUS_GOLD, SYS_MSG_MS, MILESTONE_MS, NARR_MSG_MS, FINAL_LEAD_MS, STRONG_MSG_MS, WIN_MSG_MS, ACH_MSG_MS, BATTLE_GAP_MS, MEMORY_MSG_MS, WRAP_GAP_MS, HEAVY_MULT, ELEM_MULT, dayPhase, QUESTS } from './data.js';
import { deep, cmdDmg, elemMult, skillDefUsed, applyStats, canonicalName, isBossFoe, rushReward, rollDrop } from './rules.js';
import { SFX, startBgm, stopBgm, resumeBgm } from './audio.js';
import { bind } from './bind.js';
import { hooks } from './hooks.js';
import { goto } from './scene.js';
import { takePotion, potionAvailability, applyAchievements, grantXp } from './hero.js';
import { enemyAct } from './enemyAI.js';
import { questStatus } from './quests.js';

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
  // v23.24 初见记忆图鉴遭遇反馈（体验打磨·信息透明·纯显示——承 v19.41 已遭遇揭示 / v21.37 已遭遇
  // 计数 / v23.23 首杀收录反馈同一「遇见 = 被记下」主线）：一进战即记入 hero.seen（下方），但进战
  // 报文「⚔️ 遭遇了 X！」只报遭遇不报图鉴——玩家首次撞见一只新怪的瞬间没有任何提示告诉「它被记下了」，
  // 图鉴「已遭遇」条目要事后按 B 才发现；「见过 vs 打过」正是图鉴页脚双口径（已遭遇 N/13），
  // 达成当下却零回声。现与图鉴页脚同读 data.js BESTIARY_TARGET · hero.seen 一份单一数据源，仅初见
  // （seen[key] 0→1）补一条「📖 记忆图鉴新遭遇」战报（带 N/13 已遭遇进度）；再遇同怪零噪音零变化，
  // 旧档布尔 seen（true+1=2≠1；|0 归一同图鉴侧）不误报，纯显示零结算零存档零数值变化。
  let _firstSeen = false;
  {
    const _seenKey = canonicalName(S.enemy.name);
    _firstSeen = !((S.G.seen || {})[_seenKey] | 0);
    if (S.G.seen) S.G.seen[_seenKey] = (S.G.seen[_seenKey] || 0) + 1;
    else S.G.seen = { [_seenKey]: 1 };
  }
  // v23.80 成就「身经百战」计数（新内容·战斗遭遇维度单档里程碑，承 v23.76 steps 同款「唯一产生点 +
  // 落账当场判定」惯例）：本函数是全游唯一战斗入口（普通遇敌 randomEncounter/精英/三祭坛/
  // 试炼三连战含第二三关/重整旗鼓 retryBoss 全走此处，前缀判定零重复），「踏入战场」即遭遇——
  // 胜/败/逃都算（totalWins 只记赢下来的，与 battles 成对端口：战败重开/逃跑失败/死磕精英的
  // 玩家进度不致零回声）；写入 hero.battles（snapshotHero 全量快照自动持久化、(g.battles||0)
  // 防御式旧档零迁移——承 v23.75 travels / v23.76 steps 同款），落账当场 applyAchievements
  // （本模块既有 import 零新增依赖；幂等高频调用零噪音）；零战报后缀（承 v23.72-76 口径——
  // 进战本就零计数报文，C 页进度 X/BATTLE_GOAL 承载）；零结算零数值零存档结构变化
  // （seen 计数/困难倍率/遭遇报文/首见战报逐字未动）。
  S.G.battles = (S.G.battles || 0) + 1;
  applyAchievements();
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
  // v23.24（续）初见图鉴战报：仅 _firstSeen（seen[key] 0→1 的当场回声）追加一条——与图鉴页脚 met
  // 同式派生（BESTIARY_TARGET · hero.seen 单一数据源、|0 归一防御式），名字经 canonicalName 归一
  // 与图鉴「已遭遇」行同口径（真身→本体）；BLOG_WIN=3 两行同窗零溢出，再遇同怪零追加零噪音。
  if (_firstSeen) {
    const _seenN = BESTIARY_TARGET.filter((n) => ((S.G.seen || {})[n] | 0) > 0).length;
    S.blog.push(`📖 记忆图鉴新遭遇：【${canonicalName(S.enemy.name)}】（已遭遇 ${_seenN}/${BESTIARY_TARGET.length} 种 · 世界画面按 B 查看）`);
  }
  S.blogView = 0;
  S.battleTurn = 1;
  // v21.3 战斗开场警报音（音效反馈）：进战瞬间的听觉钩子——Boss/试炼=低沉警报（SFX.boss），
  // 普通遭遇=两连下坠（SFX.alert）；与威胁预警文案/isBossFoe 同一强敌口径，静音时 tone 自然哑掉，零结算影响
  if (isBossFoe(S.enemy)) SFX.boss(); else SFX.alert();
  // v23.45 Boss/试炼战专属战斗 BGM（音效反馈·听觉信息透明，承 v21.3 alert/boss「先闻其声」同线收口）：
  // v21.3 的警报音只区分了进战瞬间——Boss/试炼战整场循环的 BGM 仍与杂兵战同轨（audio.js MUSIC.battle），
  // 一场强敌战闻声与史莱姆战无异；现按 isBossFoe 分轨 startBgm('battleBoss')（慢速三角波半音阶下行 +
  // 低音持续长音，与 battle 快节奏方形波一听即分——「先闻其声」的持续侧）；零结算零数值零存档
  // （isBossFoe 判定/SFX.alert/SFX.boss 分支/战斗数值逐字未动；胜利/战败/逃离走出战斗后 resumeBgm
  // 照旧回地图轨，试炼连胜关间保持 battleBoss 不打断）。
  startBgm(isBossFoe(S.enemy) ? 'battleBoss' : 'battle');
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
  // v23.63 成就「暴击如雨」计数（战斗维度第三枚里程碑·承 v23.36 以守为攻 / v23.54 蓄势待发先例）：
  // [1]普攻是玩家最常用的指令，12% 概率（CRIT_RATE）暴击、×CRIT_MULT 1.8 结算、v23.43 起有专属
  // 上扬音、v21.57 起战报如实报「（暴击×1.8！）」——与它并列的 [5]防御（以守为攻）/[6]蓄力
  // （蓄势待发）都有纪念，唯独普攻暴击无；计数写在暴击唯一产生点（本函数，与 crit 判定同处一处
  // 防漏记，技能 crit 恒 false 不计数），读 hero.crits（doAttack 局部 const hero = S.G、随
  // snapshotHero 全量快照自动持久化），防御式 (hero.crits||0) 旧档零迁移；阈值 CRIT_GOAL 单一
  // 数据源见 data.js；落账当场 applyAchievements（承 v23.36 反击落账当场判定「反馈不迟到」惯例；
  // applyAchievements 为本模块既有 import，零新增依赖）。零结算零数值变化（crit 判定/×CRIT_MULT
  // 结算/「（暴击×N！）」战报主体/震屏/音效逐字未动，仅战报进度后缀追加）。
  const cc = crit ? (hero.crits || 0) + 1 : (hero.crits || 0);
  if (crit) {
    hero.crits = cc;
    applyAchievements();
  }
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
      `${crit ? '💥' : '🗡️'} 你发动攻击，对 ${enemy.name} 造成 <dmg> 伤害${crit ? `（暴击×${CRIT_MULT}！ · 暴击如雨 ${cc}/${CRIT_GOAL}）` : ''}${charged ? '（蓄力爆发！）' : ''}！`,
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
  // v23.64 成就「熟能生巧」计数（战斗维度第四枚里程碑·承 v23.36 以守为攻 / v23.54 蓄势待发 /
  // v23.63 暴击如雨先例）：[2]技能是玩家最主动的战术指令（SKILL_DATA 八招全表）——防御的反击、
  // 蓄力、普攻暴击都有纪念，唯独技能无；计数写在施法成功唯一产生点（本函数，未领悟/MP 不足/
  // 祸乱封印拦截均早退不计数——「释放」即成功出手，治愈与伤害两分支都计入），读 hero.casts
  // （doSkill 局部 const hero = S.G、随 snapshotHero 全量快照自动持久化），防御式 (hero.casts||0)
  // 旧档零迁移；阈值 CAST_GOAL 单一数据源见 data.js；落账当场 applyAchievements（承 v23.36
  // 反击落账当场判定「反馈不迟到」惯例；applyAchievements 为本模块既有 import，零新增依赖）。
  // 零结算零数值变化（MP 扣除/倍率/治疗/汲回/战报主体逐字未动，仅计数与当场判定追加；技能
  // crit 恒 false 与暴击计数零干扰——暴击计数源 doAttack 逐字未动）。
  const castN = (hero.casts || 0) + 1;
  hero.casts = castN;
  applyAchievements();
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
    // v21.83 汲蓝结算（星砂回响 drainMp）：把本次伤害 ×drainMp 汲回为 MP，单次上限
    // drainMpCap×mpMax（data.js DRAIN_MP_PCT/DRAIN_MP_CAP 单一数据源），再钳制到实际可回量——
    // 满蓝时如实报「汲蓝 0 MP」（与汲光击「汲回 0 HP」同口径）。与 drain 招不同：不含治疗，
    // 祸乱形态「封印治愈」刻意不封（skillForbidden 未并入，见 data.js GAME_VERSION 注释）。
    if (skill.drainMp) {
      const mcap = Math.round(hero.mpMax * (skill.drainMpCap || 1));
      const dm = Math.min(hero.mpMax - hero.mp, Math.min(mcap, Math.round(dmg * skill.drainMp)));
      hero.mp += dm;
      note += `（汲蓝 ${dm} MP）`;
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
  // v23.66 成就「药到病除」计数（战斗维度第六枚里程碑·承 v23.36 以守为攻 / v23.54 蓄势待发 /
  // v23.63 暴击如雨 / v23.64 熟能生巧 / v23.65 走为上计先例）：v23.65 收口「战斗操作」维度时补
  // 的是 [4]逃跑，与它并列成对的最后一枚是 [3]药水——战斗六指令此刻全部齐备：防御的反击、蓄力、
  // 普攻暴击、技能与逃跑都有纪念，唯独最「续命」的一键（战斗内唯一回血续命指令，takePotion 优先
  // 耗高级灵药、普通药水只补 HP、满状态不浪费）查无回响；此处是 [3]战斗用药唯一产生点（大地图
  // F 键 core.usePotion 走 core.js 另一端 takePotion，不在此列零计数），成功吃药才计数（气满神足/
  // 无药早退零计数）——读 hero.potionUses（doItem 局部 const hero = S.G、随 snapshotHero 全量快照
  // 自动持久化），防御式 (hero.potionUses||0) 旧档零迁移（承 v19.41 seen / v23.36 deflects /
  // v23.54 charges / v23.63 crits / v23.64 casts / v23.65 flees 同款）；无 r 字段纯里程碑（与
  // deflect/charge/crit/cast/flee/memoir/skills 同款——药到病除本身就是奖励）；落账当场
  // applyAchievements（承 v23.36 反击落账当场判定「反馈不迟到」惯例，计数源与判定点同处一行
  // 防漏记）；零战报后缀（承 v23.64 熟能生巧零战报后缀口径——用药战报已带恢复量/剩余库存/
  // HPMP 状态，再叠进度后缀信息过载，C 页进度 X/15 承载）。takePotion 判定/恢复结算/药水·灵药
  // 两档战报/afterPlayer 逐字未动。
  const useN = (hero.potionUses || 0) + 1;
  hero.potionUses = useN;
  applyAchievements();
  SFX.heal();
  bind.renderHUD();
  // v19.74 战斗用药反馈追加剩余数量（信息透明·纯显示）：与大地图 F 键喝药同源，
  // 直接读结算后的 hero.item / hero.potion2，让玩家连战中一眼知道灵药/药水库存。
  // v21.65 喝药战报补恢复后 HP/MP 状态（信息透明·口径一致·纯显示）：恢复链条的
  // 治愈术端（v19.97「（HP X/Y）」）、防御回蓝端（v19.96「（MP X/Y）」）、中毒/受击端
  // （v21.8/v20.2「（我方 HP X/Y）」）早已报结算后状态，唯独喝药这一端只报恢复量与库存——
  // 恢复量是上限钳制前的公式量（HP 95/100 喝药报「恢复 35」实际只回 5），玩家想确认
  // 「回完现在多少血」仍需瞄 HUD；现按治愈术同式把结算后 HP（灵药含 MP）并入同一括号
  // 句首，库存量保留——与大地图 usePotion 两端同式（承 v19.74 同源同改），读结算后的
  // hero.hp/hpMax/mp/mpMax，零结算零数值零存档变化。
  S.blog.push(
    result.strong
      ? `🧪 ${hero.name} 服下高级灵药，恢复 ${result.h} HP、${result.m} MP（HP ${hero.hp}/${hero.hpMax} · MP ${hero.mp}/${hero.mpMax} · 高级灵药剩余 ${hero.potion2} 瓶）`
      : `🍖 ${hero.name} 服用药水，恢复 ${result.h} 点 HP（HP ${hero.hp}/${hero.hpMax} · 药水剩余 ${hero.item} 瓶）`
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
  // v23.47 蓄力专属音效（音效反馈·语义修正——承 v23.22 SFX.ach / v23.33 SFX.craft / v23.40 SFX.flee /
  // v23.43 SFX.crit / v23.46 SFX.transform 同一「事件音效各归其位」主线收口，与 audio.js SFX.charge 同源）：
  // 蓄力此前与 doDefend（[5]防御）/enemyAI 石甲格挡同播 SFX.block()（triangle 低音块响）——蓄力是进攻
  // 准备不是守势或格挡，按完 [5] 再按 [6] 两声同响无可分辨；现改播 SFX.charge()（square 上挑三连，
  // 与 block 一听即分）；零结算零数值零存档（蓄力判定/×CHARGE_MULT 结算/「凝神蓄力」战报逐字未动，
  // doDefend 与 enemyAI 石甲分支仍 SFX.block 逐字未动）。
  SFX.charge();
  // v23.54 成就「蓄势待发」计数（战斗维度第二枚里程碑·承 v23.36 以守为攻先例）：[6]蓄力是玩家主动
  // 花一回合的战术选择（下一次攻击/技能 ×CHARGE_MULT、可叠暴击），与 [5]防御（以守为攻）并列成对——
  // 防御的反击已有纪念，蓄力却无；计数写在蓄力唯一产生点（本函数，与置位/战报同处一处防漏记），
  // 读 hero.charges（doCharge 局部 const hero = S.G、随 snapshotHero 全量快照自动持久化），防御式
  // (hero.charges||0) 旧档零迁移；阈值 CHARGE_GOAL 单一数据源见 data.js；落账当场 applyAchievements
  // （承 v23.36 反击落账当场判定「反馈不迟到」惯例；applyAchievements 为本模块既有 import，零新增依赖）。
  // 零结算零数值变化（蓄力判定/×CHARGE_MULT 结算/「凝神蓄力」战报主体逐字未动）。
  const chg = (hero.charges || 0) + 1;
  hero.charges = chg;
  applyAchievements();
  S.blog.push(`⚡ ${hero.name} 凝神蓄力：下一次【攻击或技能】威力 ×${CHARGE_MULT}！ · 蓄势待发 ${chg}/${CHARGE_GOAL}`);
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
    // v23.65 成就「走为上计」计数（战斗维度第五枚里程碑·承 v23.36 以守为攻 / v23.54 蓄势待发 /
    // v23.63 暴击如雨 / v23.64 熟能生巧先例）：v23.64 收口「战斗操作」维度时补的是 [2]技能，与它
    // 并列成对的是 [4]逃跑——玩家打不过就走的务实选择（普通怪 FLEE_SUCCESS=60% 概率成功、Boss
    // 气场压制不可逃、指令栏 ⛔「别按 4」），此后仍无任何纪念：防御的反击、蓄力、普攻暴击、技能
    // 都有纪念，唯独最「保命」的一键无；判定/进度/描述同读 FLEE_GOAL 单一数据源（与 DEFLECT_GOAL/
    // CHARGE_GOAL/CRIT_GOAL/CAST_GOAL 同一「阈值数据化」家族——调门槛只改 data.js 一处自动跟随，
    // 绝无第二套口径）；计数写在本函数逃跑成功唯一产生点（Boss 气场压制与逃脱失败都早退不计数
    // ——「成功逃脱」即唯一事件；承 v23.63 crit「暴击唯一产生点」同款），读 hero.flees（doFlee
    // 局部 const hero = S.G、随 snapshotHero 全量快照自动持久化），防御式 (hero.flees||0)
    // 旧档零迁移（承 v19.41 seen / v23.36 deflects / v23.54 charges / v23.63 crits /
    // v23.64 casts 同款）；无 r 字段纯里程碑（与 deflect/charge/crit/cast/memoir/skills 同款——
    // 走为上计本身就是奖励）；解锁时机：逃脱落账当场 applyAchievements（承 v23.36 反击落账当场
    // 判定「反馈不迟到」惯例；applyAchievements 为本模块既有 import，零新增依赖）。战报就地报
    // 「 · 走为上计 N/10」（承 v23.54 蓄力战报报进度 / v23.63 暴击战报报进度同一「计数现场报进度」
    // 惯例——逃跑是低频事件，不像技能每发都报会刷屏，与 v23.64 熟能生巧零战报后缀的取舍口径互补）。
    // 零结算零数值变化（FLEE_SUCCESS 判定/离场/BGM 恢复/「成功逃脱了！」主体逐字未动，仅计数、
    // 战报进度后缀与当场判定追加；逃脱失败/Boss 气场分支逐字未动）。
    const fleeN = (hero.flees || 0) + 1;
    hero.flees = fleeN;
    applyAchievements();
    S.blog.push(`🏃 成功逃脱了！ · 走为上计 ${fleeN}/${FLEE_GOAL}`);
    // v23.40 逃跑成功专属音效（音效反馈·语义修正——承 v23.22 SFX.ach / v23.33 SFX.craft 同一
    // 「事件音效各归其位」主线收口）：逃脱成功此前播 SFX.select()（菜单移动轻点）——逃跑是
    // 「离场脱战」不是「选择/翻行」，脱战瞬间与菜单操作同音无可分辨；现改播 audio.js SFX.flee()
    // （square 下行快三步，与 select/cancel/alert/victory 一听即分），脱离战斗瞬间听声即知；
    // 零结算零数值零存档（回合推进/Boss 气场压制/逃脱失败分支逐字未动）。
    SFX.flee();
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
  // v22.10 未存档提醒置脏（防误丢档）：战斗指令是战斗内唯一的冒险状态改动入口（胜负/掉落/经验全靠
  // 指令推进），置 S.unsaved=true；saveGame/load 成功清脏，beforeunload 守卫读之。纯状态标志零结算。
  S.unsaved = true; // v22.10 未存档提醒置脏
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
  // v23.43 暴击专属上扬音（音效反馈·听觉信息透明——承 v21.3 alert/boss「先闻其声」/ v23.22 SFX.ach /
  // v23.33 SFX.craft / v23.40 SFX.flee 同一「事件音效各归其位」主线，与 audio.js SFX.crit 同源）：
  // 普攻暴击此前与普攻同播 SFX.hit（sawtooth 下坠）——暴击仅普攻可触发（技能 crit=false 走各自 sfx），
  // 现 crit 真时改播 SFX.crit（sawtooth 上挑，与 hit 下坠一听即分，与状态页「普攻12%暴击×1.8」/
  // 震屏浮字同维度）；crit 判定/×CRIT_MULT 结算/战报文案/震屏触发逐字未动，零结算零数值零存档。
  if (crit) SFX.crit();
  else if (sfx) SFX[sfx]();
  else SFX.hit();
  const enemy = S.enemy;
  const hero = S.G;
  const isCrit = !!crit;
  let dmg = Math.round(cmdDmg(hero.atkMax, enemy.def, 1, true) * (isCrit ? CRIT_MULT : 1) * (mult || 1));
  if ((enemy.shield || 0) > 0) {
    // v21.58 石甲挡伤命中战报补「挡下 N 点」（信息透明·纯显示）：石甲链条的凝结端
    // （enemyAI「累计 N 层，所受伤害降低 X%」）、击碎端（v21.54「石甲碎裂，剩余 N 层」）、
    // HUD 角标端（🪨 石甲×N）三端早已量化，唯独任意攻击打在石甲上的命中这一端只报
    // 「挡下了部分伤害」不报数值——玩家砍在有甲的怪上，想确认「这层甲到底挡了多少」
    // 只能心算；现按 v21.56 防御格挡同式补「挡下 N 点」（N = 减伤前 rawDmg − 减伤后
    // dmg，SHIELD_MULT 单一数据源同读），保底 1 钳到时 N=0 不标数值，保持原句逐字不变
    // （承 v21.54 碎至 0 层不标剩余同口径）。零结算变化（shield-- 赋值与
    // max(1, round(×SHIELD_MULT)) 减伤式逐字未动，只在其前/后各加一行取值与求差）。
    const rawDmg = dmg;
    enemy.shield--;
    dmg = Math.max(1, Math.round(dmg * SHIELD_MULT));
    const blocked = rawDmg - dmg;
    S.blog.push(`🪨 ${enemy.name} 的石甲挡下了部分伤害${blocked > 0 ? `，挡下 ${blocked} 点` : ''}！${enemy.shield > 0 ? `（剩余 ${enemy.shield} 层）` : ''}`);
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
// v23.36 deps 追加 applyAchievements（战斗维度新成就「以守为攻」在反击落账当场判定——
// 承 v23.13 openTalk 当场判定「反馈不迟到」惯例；enemyAI 侧零新增 import）。
const BATTLE_DEPS = { addFx, winBattle, loseBattle, applyAchievements };

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
  // v21.60 讨伐支线击杀进度战报（信息透明·纯显示）：四条讨伐采集型支线（side_mist/side_stone/
  // side_ember/side_bone）的进度都读 bestiary 计数（condProg 单一数据源），但击杀目标怪后的胜利
  // 战报只报金币/经验——玩家想确认「离交付还差几只」只能按 J 翻日志或跑回 NPC 对话；与 v19.93
  // 「宝箱蘑菇带任务进度」同一「任务进度即时透明」主线。此处（bestiary 计数结算前）快照所有
  // 「进行中」condProg 支线的进度串，待胜利结算后逐一对比补报（见下方碎片块后）。
  // side_name（记忆碎片）排除：其进度只在下方碎片块推进，而 v19.90 🕯️ 拾取报文已带 N/N 进度，
  // 快照时按 id 排除避免双报。零结算零数值零存档变化，只追加显示。
  const questProgBefore = {};
  for (const q of Object.values(QUESTS)) {
    if (q.condProg && q.id !== 'side_name' && questStatus(hero, q.id) === 'active') {
      questProgBefore[q.id] = q.condProg(hero);
    }
  }
  hero.bestiary[bookName] = (hero.bestiary[bookName] || 0) + 1;
  hero.totalWins++;
  // v23.91 成就「提灯夜行」计数（昼夜相位维度单档·承 v23.87 lives/deaths「落账当场判定」惯例）：
  // ——winBattle 是全游唯一胜利结算点（普通/精英/强敌/试炼三连战全走此处、finishPlayer 唯一
  // 路径零重复）；夜晚判定读 data.js dayPhase(hero.time) 单一数据源（与 world.tickEncounter
  // 夜间步进 ×1.25 / HUD 🌙 标签 / 小地图相位倍率标同读 S.G.time），无字回廊「被忘掉的地方
  // 没有晨昏」不计数（curMap()!=='gallery'，与 HUD 🌑 恒暗同口径）；防御式 (hero.nightWins||0)
  // 旧档零迁移；随 snapshotHero 全量快照自动持久化；落账当场 applyAchievements（下方既有调用，
  // 反馈不迟到）；零战报后缀（C 页进度 X/10 承载）。
  if (curMap() !== 'gallery' && dayPhase(hero.time) === 'night') {
    hero.nightWins = (hero.nightWins || 0) + 1;
  }
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
  // v23.23 首杀记忆图鉴收录反馈（体验打磨·信息透明·纯显示——承 v19.41 已遭遇揭示 / v21.37 已遭遇
  // 计数同一「击败 = 被记起」主线）：击败即写入记忆图鉴（上方 hero.bestiary 累计），但胜利报文（升级/
  // 胜利/额外掉落/碎片/支线进度）只报金币经验——玩家首杀一只新怪的瞬间没有任何提示告诉「它被记下了」，
  // 图鉴新条目要事后按 B 才发现（「讨伐 = 被记起」是潮灯记·记忆图鉴的主题，达成当下却零回声）；现与
  // 图鉴页/收集四件套同读 data.js BESTIARY_TARGET · hero.bestiary 一份单一数据源，仅首杀
  // （bestiary[bookName] 0→1）补一条「📕 记忆图鉴新收录」报文（带 N/M 已记起进度）；再杀同怪零噪音
  // 零变化，旧档布尔 bestiary（true+1=2≠1）不误报，纯显示零结算零存档零数值变化。
  const codexGotN = BESTIARY_TARGET.filter((n) => ((hero.bestiary || {})[n] | 0) >= 1).length;
  if (hero.bestiary[bookName] === 1) {
    bind.boxMsg(`📕 记忆图鉴新收录：【${bookName}】（已记起 ${codexGotN}/${BESTIARY_TARGET.length} 种 · 世界画面按 B 查看）`, WIN_MSG_MS);
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
    // v23.59 记忆碎片拾取音效归位（音效反馈·听觉信息透明——承 v21.3 alert/boss「先闻其声」/
    // v23.22 SFX.ach / v23.43 SFX.crit / v23.49 SFX.chest 同一「事件音效各归其位」主线收口后的
    // 复查补全）：「🕯️ 拾起一段记忆」是真结局关键收集（强敌首胜掉落、N/4 进度）的拾取现场，
    // 但 v23.49 把宝箱从 SFX.item()（700→900 双音）移出后，SFX.item 成为全库无调用点的孤儿音效，
    // 而全游戏唯一仍是「拾取」语义的事件（碎片拾取）反而全程静默——首胜强敌只听见胜利号角，
    // 真结局关键收集落袋的瞬间与普通胜利听感无异；现把 SFX.item 归位到碎片拾取（音效定义逐字未动），
    // 胜利号角→拾取双音一听即分；零结算零数值零存档，碎片块其余逐字未动。
    SFX.item();
    // v19.90 记忆碎片拾取反馈追加收集进度（信息透明·纯显示）：此前只报「拾起一段记忆」与回看提示，
    // 玩家刚拿到强敌首胜掉落的一段记忆，想确认「离真结局·全记忆还差几段」仍需按 J 翻日志或按 I 看状态页；
    // 直接读结算后的 hero.fragments.length 与 FRAGMENTS.length（真结局判定/任务进度/名字石碑同读此源），
    // 零结算变化，只追加显示当前已集齐段数。
    const fragCount = (hero.fragments || []).length;
    bind.boxMsg(`🕯️ 拾起一段记忆：【${frag.name}】（按 J 日志回看 · ${fragCount}/${FRAGMENTS.length} 段记忆已集齐）`, MEMORY_MSG_MS);
  }

  // v21.60 讨伐支线击杀进度战报（信息透明·纯显示，接上方结算前快照）：胜利/掉落/碎片结算
  // 全部落账后，快照中进度串有变化的支线（= 本场击杀推进了它的 condProg 计数）补一条战报——
  // 未集齐报「讨伐进度 N/M」（与日志 J、NPC active 页同读 condProg 一份源）；条件达成转可交付
  // 的按 def.turnin 提示去向（与日志 turnin 条目同一份源）。已可交付（turnin）/未接取（offer）/
  // 已完成（done）的支线不在快照内，不多报不刷屏。零结算零数值零存档变化。
  for (const q of Object.values(QUESTS)) {
    const before = questProgBefore[q.id];
    if (before == null) continue;
    const afterProg = q.condProg(hero);
    if (afterProg === before) continue;
    if (questStatus(hero, q.id) === 'turnin') {
      bind.boxMsg(`📜 支线【${q.name}】目标达成（${afterProg}）· ${q.turnin}`, WIN_MSG_MS);
    } else {
      bind.boxMsg(`📜 支线【${q.name}】讨伐进度 ${afterProg}`, WIN_MSG_MS);
    }
  }
  hooks.applyVictoryWorld(result);

  if (enemy.isRush) {
    // v23.56 试炼战报补「获得 N 经验」（体验打磨·信息透明·反馈不迟到——承 v19.80 普通胜利「距升级还
    // 需 N 经验」/ v19.82 试炼通关余额 同一「收入现场报收入」主线）：grantXp 对试炼各关照常结算
    // （RUSH_BOSSES[].xp 60/60/90，与普通怪同一调用），但 isRush 分支此前只报下一关现身（682 行）与
    // 通关赏金（674 行）——每关赢得多少经验查无一行（升级瞬间才有 🎉 横幅、未升级则全程静默），恰是
    // 「经验另计少给」奖励盘面的盲区；现与结算同读 enemy.xp（本关刚击败之敌），674/682 两报文末括号
    // 追加「获得 N 经验」，零结算零数值零存档。
    const stage = hero.rushStage;
    if (stage >= RUSH_BOSSES.length) {
      hero.rushStage = 0;
      hero.rushDone = true;
      // v23.67 成就「千锤百炼」计数（试炼场维度首枚里程碑·承 v23.63-66 战斗指令六枚同款）：v23.66
      // 收口「战斗操作」维度后，成就版图逐线核对只剩试炼场这条只有单档（rush 百炼成钢=首通）的维度
      // ——试炼三连战可无限再战（v21.85 碑上「已通关（可再战）」口径），玩家通关一次后反复刷级刷金，
      // 成就一览却无累计回响；此处（hero.rushDone = true 同处）是试炼通关唯一产生点，成功通关才计数
      // ——读 hero.rushClears（随 snapshotHero 全量快照自动持久化），防御式 (hero.rushClears||0)
      // 旧档零迁移（承 v23.36 deflects / v23.63 crits / v23.66 potionUses 同款）；无 r 字段纯里程碑
      // （与 deflect/charge/crit/cast/flee/potionuses 同款）；落账当场 applyAchievements（下方既有
      // 调用，计数源与判定点同处一行防漏记）；战报就地报「 · 千锤百炼 N/M」（承 v23.65 走为上计
      // 低频报进度口径——试炼通关本属低频事件不刷屏）。rushStage 归零/rushDone 置位/通关奖/35%HP
      // 50%MP 恢复/既有战报主体逐字未动。
      const rc = (hero.rushClears || 0) + 1;
      hero.rushClears = rc;
      const reward = rushReward(hero.level);
      hero.gold += reward;
      applyAchievements();
      SFX.victory();
      // v19.82 试炼通关反馈追加剩余金币（信息透明·纯显示）：v19.60 已给试炼碑加上「通关奖 N 金」预览，
      // 但三连战真正通关后的横幅只报奖励数额——玩家刚拿到一笔大额金币收入，想确认「兜里还剩多少」
      // 仍需再按 I 看状态页；直接读结算后的 hero.gold（line 444 已加 reward），与 v19.80 普通胜利/
      // v19.81 升级余额提示同源，零数值变化。
      bind.boxMsg(`🌈 试炼通关！奖励 ${reward} 金币！灯火记得你的名字！（获得 ${enemy.xp} 经验 · 剩余 ${hero.gold} 金 · 千锤百炼 ${rc}/${RUSH_CLEAR_GOAL}）`, ACH_MSG_MS);
      setTimeout(() => { goto('world'); S.enemy = null; S.battleBusy = false; resumeBgm(); }, WRAP_GAP_MS);
    } else {
      // 连胜换关自动回血（data.js RUSH_RECOVER 单一数据源）：与战斗横幅/帮助页标注同读此源，数值结算逐字不变
      hero.hp = Math.min(hero.hpMax, hero.hp + Math.round(hero.hpMax * RUSH_RECOVER.hp));
      hero.mp = Math.min(hero.mpMax, hero.mp + Math.round(hero.mpMax * RUSH_RECOVER.mp));
      bind.renderHUD();
      hero.rushStage = stage + 1;
      bind.boxMsg(`🚩 试炼第 ${stage + 1} 关：${RUSH_BOSSES[stage].name} 现身！（获得 ${enemy.xp} 经验 · 已自动恢复${Math.round(RUSH_RECOVER.hp * 100)}%HP / ${Math.round(RUSH_RECOVER.mp * 100)}%MP）`, SYS_MSG_MS);
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
  // v23.87 成就「败而不馁」计数（战斗败北端口·与 v23.80 身经百战遭遇端口成对）：loseBattle 是
  // 全游戏唯一战败结算点（普通遇敌败北/强敌战败/试炼败北全走此处，retryBoss 只恢复战斗子集字段
  // 不清零——强敌反复 B 再战也如实累计），落账 hero.deaths——随 snapshotHero 全量快照自动持久化、
  // 防御式 (S.G.deaths||0) 旧档零迁移（承 v23.80 hero.battles 同款）；落账当场 applyAchievements
  // （反馈不迟到——本模块既有 import 零新增依赖）。
  S.G.deaths = (S.G.deaths || 0) + 1;
  applyAchievements();
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
