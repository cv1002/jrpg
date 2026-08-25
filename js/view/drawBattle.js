// ============================================================
// view/drawBattle.js —— 战斗画面
// ============================================================
import { S, curMap } from '../state.js';
import { SKILL_DATA, RUSH_BOSSES, CHARGE_MULT, ELEM_NAME, RUSH_RECOVER, SPECIES, FLEE_SUCCESS, BURN_PCT, POISON_PCT, DEFEND_MULT, DEFEND_MP, COUNTER_CHANCE, COUNTER_MULT, SHIELD_MULT, HIT_FB_MS, HEAVY_MULT, HEAVY_MULT_PHASED, HEAL_PCT, PHASE2_AT, PHASE2_HEAL_PCT, POTION_HP_PCT, POTION_HP_FLAT, ELIXIR_HP_PCT, ELIXIR_HP_FLAT, ELIXIR_MP_PCT, TRUE_BONUS_GOLD } from '../data.js';
import { cmdDmg, atkEstimate, skillEstimate, rushReward, canonicalName } from '../rules.js';
import { CV, CTX, rr, panel, text, hpbar } from './canvas.js';
import { drawHero, drawMonster, BATTLE_SCALE } from './sprites.js';
import { bind } from '../bind.js';

export function burst(x, y, colors, n = 18) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * 6.2832;
    const sp = 0.7 + Math.random() * 2.4;
    S.parr.push({
      x, y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - 1,
      life: 28 + Math.random() * 16,
      color: colors[i % colors.length],
      size: 2 + Math.random() * 3.5,
    });
  }
}
export function burstEnemy(colors, n) { burst(CV.width / 2, 188, colors, n || 18); }
export function burstPlayer(colors, n) { burst(96, 340, colors, n || 16); }
bind.burstEnemy = burstEnemy;
bind.burstPlayer = burstPlayer;

export function enemyLv(enemy) {
  // Boss 推荐等级单一数据源：data.js SPECIES[].lv（祭坛 ⚠Lv 标签同读）
  const sp = SPECIES[canonicalName(enemy.name)];
  if (sp && sp.lv) return sp.lv;
  if (enemy.isElite) return (S.G ? S.G.level : 1) + 1;
  return S.G ? S.G.level : 1;
}

function drawArena() {
  const map = curMap();
  if (map === 'village') {
    const g = CTX.createLinearGradient(0, 0, 0, CV.height);
    g.addColorStop(0, '#3a7d4a');
    g.addColorStop(1, '#1a3020');
    CTX.fillStyle = g;
    CTX.fillRect(0, 0, CV.width, CV.height);
  } else if (map === 'cave') {
    const g = CTX.createLinearGradient(0, 0, 0, CV.height);
    g.addColorStop(0, '#1a2230');
    g.addColorStop(1, '#0a0e16');
    CTX.fillStyle = g;
    CTX.fillRect(0, 0, CV.width, CV.height);
    CTX.fillStyle = 'rgba(95,216,255,.12)';
    for (let i = 0; i < 20; i++) CTX.fillRect((i * 47) % CV.width, (i * 31) % 200, 2, 2);
  } else {
    const g = CTX.createLinearGradient(0, 0, 0, CV.height);
    g.addColorStop(0, '#1a2030');
    g.addColorStop(1, '#0d1119');
    CTX.fillStyle = g;
    CTX.fillRect(0, 0, CV.width, CV.height);
    CTX.fillStyle = '#ffffff55';
    for (let i = 0; i < 50; i++) CTX.fillRect((i * 67) % CV.width, (i * 31) % 170 + 10, 2, 2);
  }
  if (S.enemy && (S.enemy.isBoss || S.enemy.isTrue || S.enemy.isCaveBoss)) {
    const ex0 = CV.width / 2;
    const ey0 = 248;
    const rg = CTX.createRadialGradient(ex0, ey0, 6, ex0, ey0, 160);
    rg.addColorStop(0, S.enemy.isTrue ? 'rgba(255,210,74,.22)' : 'rgba(192,111,239,.18)');
    rg.addColorStop(1, 'rgba(0,0,0,0)');
    CTX.fillStyle = rg;
    CTX.fillRect(ex0 - 160, ey0 - 160, 320, 320);
  }
}

export function drawSkillMenu() {
  const hero = S.G;
  const enemy = S.enemy;
  panel(150, 96, 340, 308, '— 技能 —');
  hero.skills.forEach((s, i) => {
    const skill = SKILL_DATA[s];
    const banned = !!(enemy && enemy.forbid && ((skill.kind === 'heal' && enemy.forbid.includes('heal')) || enemy.forbid.includes(s)));
    const ok = hero.mp >= skill.mp && !banned;
    const col = !ok ? '#7d93a3' : (skill.kind === 'heal' ? '#8ff0a0' : '#e8eef1');
    let prev = '';
    // v14.0 蓄力状态下治疗不消耗蓄力（纯显示注释，与 battle.doSkill 同源）：储备清晰的「蓄力保留」标注
    if (skill.kind === 'heal') prev = ' +' + Math.round(hero.hpMax * skill.heal) + 'HP' + (skill.cleanse ? ' ·解毒' : '') + (hero.charge ? ' ·蓄力保留' : '');
    else prev = ' ≈' + skillEstimate(hero, enemy, skill) + '伤';
    const hint = skill.hint ? (' · ' + skill.hint) : '';
    text(`[${i + 1}] ${s}${prev}${banned ? '  ⛔封印' : (ok ? '' : '  ⛔')}`, 170, 160 + i * 36, '14px', col);
    // MP 消耗标注（信息透明）：蓝=够用 红=不足 灰=被封印；右对齐独立列，不挤占技能名/伤害预览
    text(`MP ${skill.mp}`, 474, 160 + i * 36, 'bold 12px', banned ? '#7d93a3' : (hero.mp >= skill.mp ? '#62c6ff' : '#e14b3f'), 'right');
    text(hint, 188, 176 + i * 36, '11px', '#7d93a3');
    // v14.2 技能 MP 不足「还差 N」口径（信息透明·纯显示）：红色 MP 行下方再补短缺口数，
    // 一眼看清差几点 MP 才能放这招、不必心算——与 MP 行 / skill.mp 判定同源；封印与够用时均不显示，
    // 右对齐 474 与 hint 左起 188 各行最长 hint（≈165px→至353）无重叠，只展示不参与结算
    if (!banned && hero.mp < skill.mp) text(`⛔ 还差 ${skill.mp - hero.mp} MP`, 474, 176 + i * 36, 'bold 11px', '#e14b3f', 'right');
  });
  text(`当前 MP：${hero.mp}/${hero.mpMax}${hero.charge ? `  · 蓄力×${CHARGE_MULT}` : ''}`, 320, 368, '13px', '#7d93a3', 'center');
  text('[数字键] 选择   [Esc] 取消', 320, 394, '13px', '#7d93a3', 'center');
}

export function openSkillMenu() {
  S.skillMenuOpen = true;
  drawBattle();
}

export function drawBattle() {
  CTX.imageSmoothingEnabled = false;
  CTX.clearRect(0, 0, CV.width, CV.height);
  // 震屏（纯显示）：暴击/重击/大伤害由 battle.attackMove 与 enemyAI 设 S.shake，HIT_FB_MS ms 衰减（与闪红复位
  // 同源 data.js HIT_FB_MS，单一数据源）；技能菜单不随震
  let shx = 0, shy = 0;
  if (S.shake) {
    const t = (Date.now() - S.shake.t0) / HIT_FB_MS;
    if (t >= 1) S.shake = null;
    else {
      const k = (1 - t) * S.shake.pow;
      shx = Math.round(Math.sin(Date.now() / 18) * k);
      shy = Math.round(Math.cos(Date.now() / 23) * k * 0.7);
    }
  }
  CTX.save();
  CTX.translate(shx, shy);
  drawArena();
  const hero = S.G;
  const enemy = S.enemy;
  text(`⚔️ 回合 ${S.battleTurn || 1}`, 60, 26, 'bold 14px', '#ffd24a');
  if (enemy && enemy.isRush) {
    const st = Math.min(RUSH_BOSSES.length, Math.max(1, hero.rushStage || 1));
    // v12.9 试炼每关自动回血透明化（纯显示·与结算同源）：每胜一关悄然回血 35%HP/50%MP，此数值 v3.15 只标
    // 「第 N/3 关」、v11.0 只标通关金币，从未在界面告示——不会算「该不该省灵药」的玩家可能白白浪费两瓶药。
    // 数据源直接读 RUSH_RECOVER（与 battle.winBattle 连胜分支逐字同源），仅在前方还有关卡时显示，纯显示不改结算
    let rushNote = '';
    if (st < RUSH_BOSSES.length) rushNote = ` · 通关恢复${Math.round(RUSH_RECOVER.hp * 100)}%HP/${Math.round(RUSH_RECOVER.mp * 100)}%MP`;
    text(`🧭 试炼三连战 第 ${st}/${RUSH_BOSSES.length} 关${rushNote}`, 60, 48, 'bold 13px', '#a8ff8a');
  }
  const ex0 = CV.width / 2;
  const ey0 = 248;
  CTX.fillStyle = 'rgba(0,0,0,.22)';
  CTX.beginPath();
  CTX.ellipse(ex0, ey0 + 8, 128, 22, 0, 0, 7);
  CTX.fill();
  CTX.fillStyle = 'rgba(0,0,0,.18)';
  CTX.beginPath();
  CTX.ellipse(96, 408, 76, 15, 0, 0, 7);
  CTX.fill();
  if (enemy) {
    drawMonster(ex0, ey0, enemy);
    text(enemy.name + '  Lv.' + enemyLv(enemy), ex0, 58, 'bold 18px', (enemy.isBoss || enemy.isTrue || enemy.isCaveBoss || enemy.isRush) ? '#d88bff' : '#ffd24a', 'center');
    const er = enemy.hpMax > 0 ? enemy.hp / enemy.hpMax : 0;
    const ecol = er > 0.5 ? '#3fd06a' : (er > 0.2 ? '#e8c33a' : '#e14b3f');
    hpbar(ex0 - 110, 66, 220, enemy.hp, enemy.hpMax, ecol);
    // 敌方精确 HP 数值（信息透明）：紧贴血条右侧、随血量条同色同源，不受任何结算影响
    text(`${Math.max(0, Math.round(enemy.hp))}/${enemy.hpMax}`, ex0 + 118, 76, 'bold 12px', ecol);
    if (enemy.phase2) {
      CTX.fillStyle = enemy.phased ? 'rgba(255,210,74,.35)' : '#ffd24a';
      CTX.fillRect(ex0 - 1, 66, 2, 10);
      // 二段变身精确阈值（信息透明·纯显示）：与 battle.enemyAct 的 hp < hpMax×at 判定逐字同源，
      // 一眼看清还剩多少血会触发变身回血；变身（phased）后标签随之消失，不影响任何结算
      if (!enemy.phased) {
        const thr = Math.ceil(enemy.hpMax * (enemy.phase2.at || PHASE2_AT));
        text(`二段变身线 · HP<${thr}`, ex0 + 6, 76, 'bold 9px', '#ffd24a');
        // v12.7 变身「增益数值」透明化（纯显示·承接 v1.34 变身线）：血量阈值早已标注，但变身瞬间的
        // 攻/防 暴涨、回血比例与「封治愈」从 v1.x 起就只藏在 data.js 的 phase2 里——blog 只报回血数值，
        // 攻防加成无从知晓，玩家常在真身那一下被新数值打崩还不知原因。现直接读 enemy.phase2 同源数据
        // （与 battle.enemyAct 逐字同源：atk/def 加算、heal 按 maxHP 比例回血、forbid 封印），
        // 在右缘角标列常驻列出变身后果；phased 后随之消失，纯显示不改任何结算。
        const p2 = enemy.phase2;
        const boostBits = [];
        if (p2.atk) boostBits.push(`攻+${p2.atk}`);
        if (p2.def) boostBits.push(`防+${p2.def}`);
        // 变身回血比例（信息透明·纯显示·单一数据源）：与 enemyAct 变身回血结算同源读 phase.heal，
        // 默认 PHASE2_HEAL_PCT 同款兜底（漏写 heal 的模板结算回 15%、角标同样标注，显示对得上结算）
        if (p2.heal || PHASE2_HEAL_PCT) boostBits.push(`回${Math.round((p2.heal || PHASE2_HEAL_PCT) * 100)}%`);
        if (p2.forbid && p2.forbid.includes('heal')) boostBits.push('⛔封治愈');
        if (boostBits.length) text(`变身：${boostBits.join(' ')}`, 620, 76, 'bold 10px', '#ffd24a', 'right');
      }
    }
    text(`我方 攻${hero.atkMax} 防${hero.defMax}   ⚔  敌方 攻${enemy.atk} 防${enemy.def}`, ex0, 92, 'bold 13px', '#8fa8b8', 'center');
    const wk = enemy.weak ? (' · 弱点' + ELEM_NAME[enemy.weak]) : '';
    // 敌方抗性（信息透明·纯显示）：与 wk 对称——技能期望伤害已默默按 elemMult ×0.7 计入抗性，
    // 图鉴 codexTag 也已标注「抗性·X」，但战斗画面只标弱点不标抗性会让「同一招打它为什么低一截」成黑盒；
    // 这里直接读取 enemy.resist 同源数据补上（如 石魔像/骷髅兵/树精/魔王真身 的 抗火/抗冰），不影响任何结算
    const res = enemy.resist ? (' · 抗' + ELEM_NAME[enemy.resist]) : '';
    // 补齐确定性奖励（与 winBattle 同源，纯显示）：精英必掉蘑菇；终焉之神战胜另有 +TRUE_BONUS_GOLD 金币（data.js 单一数据源，与结算/横幅/图鉴标注同读）；
    // 幽冥魔王（isBoss）首次击败必掉圣光之剑（winBattle 的 isBoss 掉落分支 / 图鉴 codexTag「⚔️ 必掉圣光之剑」逐字同源）——
    // 这把攻+24 的传说剑是通关关键收益，预览行若不写，打赢之前它始终是黑盒；
    // 试炼战的通关奖励不再是黑盒——确切数额直接读 rushReward(S.G.level)（与 winBattle 结算逐字同源，随当前等级实时显示）
    const bonus = (enemy.isElite ? ' · 🍄 必掉蘑菇' : '') + (enemy.isTrue ? ' · 战胜另+' + TRUE_BONUS_GOLD + '金' : '') + (enemy.isBoss ? ' · ⚔️ 必掉圣光之剑' : '');
    const rushBonus = enemy.isRush ? `（试炼通关另奖 ${rushReward(S.G ? S.G.level : 1)} 金币，随等级提升）` : '';
    text(`战利品预览：经验 +${enemy.xp} 金币 +${enemy.gold}${wk}${res}${bonus}${rushBonus}`, ex0, 112, 'bold 13px', '#a8ff8a', 'center');
    // 石甲受击减伤标注（单一数据源）：与 enemyAI 凝甲提示 / 帮助页「石心魔像·石甲」同读 SHIELD_MULT——
    // 此前裸写「受击-40%」与结算脱钩（调石甲强度会只剩这处报旧值），现改由 SHIELD_MULT 推导（0.6→40% 逐字不变）
    if ((enemy.shield || 0) > 0) text(`🪨 石甲×${enemy.shield}（受击-${Math.round((1 - SHIELD_MULT) * 100)}%）`, 620, 112, 'bold 12px', '#c0b397', 'right');
    if ((enemy.burn || 0) > 0) {
      // 灼烧每回合扣血数值（信息透明·纯显示）：与 enemyAct 同源 max(2, round(hpMax×BURN_PCT))，一眼看清烧多少
      text(`🔥 灼烧 ${enemy.burn} · 每回合 -${Math.max(2, Math.round(enemy.hpMax * BURN_PCT))}血`, 620, 128, 'bold 12px', '#ff8a2c', 'right');
    }
    // 敌方格斗状态角标（信息透明）：冰霜击冻结后与石甲/灼烧同列常驻，下回合敌方行动时自动解除
    if (enemy.skipNext) text('❄️ 冻结 · 下回合无法行动', 620, 144, 'bold 12px', '#8fd8ff', 'right');
    if (enemy.forbid && enemy.forbid.includes('heal')) text('⛔ 治愈封印', 620, 48, 'bold 12px', '#ff5b5b', 'right');
    // 敌方招数一览（信息透明·纯显示）：与 battle.enemyAct/pickAct 读取同一份 enemy.acts 数据源，
    // 提前列清「它可能怎么做」——重击/回血/石甲，含血量触发线、回血数额(与结算同源 act.pct)、层数上限与变身后强化/封印；
    // v12.8：【回血数额透明化】此前只标「血<40%时」不标回多少——回血 = maxHP×act.pct（与 enemyAct
    // 回血分支 Math.round(enemy.hpMax * (act.pct || HEAL_PCT)) 逐字同源，默认 HEAL_PCT 同款兜底），
    // 三 Boss 一栏看清 10%/12% 的暗影回血量，与 v12.7 变身回血比例同一「信息透明」体系。
    // 只读不改，不影响任何敌方行动判定；无 acts 的普通魔物（只会普攻）不显示，避免噪音。
    // 位置：右缘状态角标列纵向下延（y=162），不出血条下方精灵区，纯显示不改结算
    if (enemy.acts && enemy.acts.length) {
      const ACT_NAME = { attack: '普攻', heavy: '重击', heal: '回血', shield: '石甲' };
      const tags = enemy.acts.map((a) => {
        let s = ACT_NAME[a.type] || a.type;
        if (a.hpBelow != null) s += `·血<${Math.round((a.hpBelow || 0) * 100)}%时`;
        if (a.type === 'shield' && a.maxShield != null) s += `·至多${a.maxShield}层`;
        // 回血数额（信息透明·纯显示）：与 battle.enemyAct 回血分支同源读 act.pct，默认 HEAL_PCT 兜底同款
        if (a.type === 'heal') s += `·恢复${Math.round((a.pct || HEAL_PCT) * 100)}%HP` + (enemy.forbid && enemy.forbid.includes('heal') ? '·⛔封印' : '');
        if (a.w2 != null && enemy.phased) s += '·真身后强';
        return s;
      });
      text(`敌方招数：${tags.join(' / ')}`, 620, 162, 'bold 11px', '#8fa8b8', 'right');
    }
  }
  drawHero(96, 400, 'R', hero.hurt ? { hurt: 1 } : null, BATTLE_SCALE);
  // v19.6 蓄力金色呼吸光环（纯显示·信息透明）：此前「蓄力中」只在右上角有一行文字，
  // 主角本体毫无可视信号——防御有盾牌角标、中毒有☠️角标、敌方灼烧/冻结/石甲各有角标，
  // 唯独蓄力这枚关系大招的 buff 缺角色身上的反馈（敌方回合持蓄时更是只有一个角落的静态字）；
  // 现给主角加一圈脉冲金色光环（径向渐变柔光 + 细环 + 顶部辉光点，周期 320ms 呼吸，
  // 与盾牌/中毒角标同一 Date.now() 呼吸体系），一眼看出「这刀还蓄着 ×1.5」。
  // 纯显示、零结算变化，复用 CTX / CHARGE_MULT（本文件已在 import 列表）零新增依赖。
  if (hero.charge) {
    const pulse = 0.5 + 0.5 * Math.sin((Date.now() / 320) * 6.2832);
    const glow = CTX.createRadialGradient(96, 388, 6, 96, 388, 56);
    glow.addColorStop(0, `rgba(255,210,74,${(0.10 + 0.18 * pulse).toFixed(3)})`);
    glow.addColorStop(0.85, `rgba(255,210,74,${(0.06 + 0.10 * pulse).toFixed(3)})`);
    glow.addColorStop(1, 'rgba(255,210,74,0)');
    CTX.fillStyle = glow;
    CTX.beginPath();
    CTX.arc(96, 388, 56, 0, 6.2832);
    CTX.fill();
    CTX.strokeStyle = `rgba(255,224,120,${(0.25 + 0.25 * pulse).toFixed(3)})`;
    CTX.lineWidth = 2;
    CTX.beginPath();
    CTX.arc(96, 388, 44, 0, 6.2832);
    CTX.stroke();
    CTX.fillStyle = `rgba(255,236,150,${(0.30 + 0.55 * pulse).toFixed(3)})`;
    CTX.beginPath();
    CTX.arc(96, 344, 2.6, 0, 6.2832);
    CTX.fill();
  }
  text(hero.name + '  Lv.' + hero.level, 200, 328, 'bold 14px');
  hpbar(200, 335, 150, hero.hp, hero.hpMax, '#e14b3f');
  hpbar(200, 350, 150, hero.mp, hero.mpMax, '#3f8fe1');
  // 我方精确 HP/MP 数值（信息透明·与 v5.4 敌方同款对称）：血条右侧常驻、随血条同色，
  // Boss/试炼战同样可一眼看清剩余血/蓝；防御盾标右移让位，纯显示不改任何结算
  text(`${Math.max(0, Math.round(hero.hp))}/${hero.hpMax}`, 356, 345, 'bold 12px', '#e14b3f');
  text(`${Math.max(0, Math.round(hero.mp))}/${hero.mpMax}`, 356, 360, 'bold 12px', '#3f8fe1');
  if (hero.defending && S.battleBusy) {
    const pulse = (Math.floor(Date.now() / 400) % 2 === 0);
    CTX.save();
    CTX.translate(428, 345);
    CTX.rotate(-0.18);
    CTX.fillStyle = pulse ? '#5fc8ff' : '#8fe4ff';
    CTX.beginPath();
    CTX.moveTo(0, -11);
    CTX.lineTo(10, -7);
    CTX.lineTo(10, 3);
    CTX.quadraticCurveTo(10, 9, 0, 12);
    CTX.quadraticCurveTo(-10, 9, -10, 3);
    CTX.lineTo(-10, -7);
    CTX.closePath();
    CTX.fill();
    CTX.fillStyle = '#0d1119';
    CTX.font = 'bold 9px sans-serif';
    CTX.textAlign = 'center';
    CTX.textBaseline = 'middle';
    CTX.fillText('盾', 0, 0);
    CTX.restore();
    text('防御中 · 减伤' + Math.round((1 - DEFEND_MULT) * 100) + '% · 回' + DEFEND_MP + 'MP/回合 · ' + Math.round(COUNTER_CHANCE * 100) + '%几率反击', 448, 352, 'bold 12px', '#5fc8ff');
  }
  if (hero.charge) text(`蓄力中 · 下击/技能×${CHARGE_MULT}`, 356, 322, 'bold 12px', '#ffd24a');
  if ((hero.poison || 0) > 0) {
    // 中毒每回合扣血数值（信息透明·纯显示）：与 applyPoisonTick 同源 max(2, round(hpMax×POISON_PCT))，看清该不该净化/速战
    const pulse = (Math.floor(Date.now() / 400) % 2 === 0);
    text(`☠️ 中毒 ${hero.poison} 回合 · 每回合 -${Math.max(2, Math.round(hero.hpMax * POISON_PCT))}血`, 200, 370, 'bold 12px', pulse ? '#7fe08a' : '#c0ffce');
  }
  if (!S.battleBusy) {
    const pN = hero.item || 0;
    const p2 = hero.potion2 || 0;
    const atkPrev = enemy ? `≈${atkEstimate(hero, enemy)}伤` : '';
    const isBossFlee = !!(enemy && (enemy.isBoss || enemy.isTrue || enemy.isCaveBoss || enemy.isRush));
    // 逃跑成功率标注（单一数据源·纯显示）：读 data.js FLEE_SUCCESS（与 battle.doFlee 的随机判定同源）——
    // 此前指令栏与 help 各写一处「约60%」字面量、判定又是 battle.js 里的裸 0.6，调平衡要改三个地方；
    // 数据化后调一处三处同步，显示文案与结算绝无第二套口径
    const bar = `[1]攻击${atkPrev}  [2]技能  [3]药水🍖×${pN}${p2 ? ` 🧪×${p2}` : ''}  [4]逃跑${isBossFlee ? '' : '·成功率约' + Math.round(FLEE_SUCCESS * 100) + '%'}  [5]防御  [6]蓄力`;
    text(bar, 60, 440, '13px', '#8fa8b8');
    if (isBossFlee) {
      const preW = CTX.measureText(`[1]攻击${atkPrev}  [2]技能  [3]药水🍖×${pN}${p2 ? ` 🧪×${p2}` : ''}  [4]逃跑`).width;
      text('⛔', 60 + preW + 5, 441, 'bold 12px', '#ff5b5b');
    }
    // 药水恢复量预览（信息透明）：数值与 hero.js takePotion 公式同源（同读 POTION_*/ELIXIR_* 单一真源），纯显示不改结算
    if (pN > 0 || p2 > 0) {
      const weakP = `🍖+${Math.round(hero.hpMax * POTION_HP_PCT) + POTION_HP_FLAT}HP`;
      const strongP = p2 > 0 ? `  🧪+${Math.round(hero.hpMax * ELIXIR_HP_PCT) + ELIXIR_HP_FLAT}HP/+${Math.round(hero.mpMax * ELIXIR_MP_PCT)}MP` : '';
      // v12.2 消耗顺序透明化：两种药水同时在手时 takePotion() 必先消耗高级灵药（与 hero.js/core.js 的判定同源）——
      // 此前 [3] 到底喝哪一瓶是黑盒，想省灵药留给 Boss 的玩家可能一次中盘小补就悄悄烧掉稀有灵药。
      // 纯显示注记，不改任何药水选择/消耗/恢复逻辑（只有两者皆有时出现，仅一方在手不加注）。
      const orderNote = pN > 0 && p2 > 0 ? '（自动先喝🧪）' : '';
      text(`[3]恢复：${weakP}${strongP}${orderNote}`, 60, 424, 'bold 12px', '#8ff0a0');
    }
  }
  const maxV = Math.max(0, S.blog.length - 3);
  if (S.blogView < 0) S.blogView = 0;
  else if (S.blogView > maxV) S.blogView = maxV;
  const lg = S.blog.slice(Math.max(0, S.blog.length - 3 - S.blogView), Math.max(0, S.blog.length - S.blogView));
  lg.forEach((l, i) => text(l, CV.width / 2, 470 + (i - (lg.length - 1)) * 18, '13px', '#e8eef1', 'center'));
  if (S.blog.length > 3) {
    text(S.blogView <= 0 ? '↑↓ 回看战斗记录' : (S.blogView >= maxV ? '↓ 回到最新' : '↑↓ 战斗记录'), 628, 448, 'bold 11px', '#7d93a3', 'right');
  }
  // 敌方下一击伤害预估（信息透明）：与结算 cmdDmg 同公式的无浮动估算；
  // 仅在拟行动回合常驻，Boss/试炼战按招数表逐招列出（y≈395 无其他元素，纯显示不改结算）
  if (!S.skillMenuOpen) {
    const isBossFlee = !!(enemy && (enemy.isBoss || enemy.isTrue || enemy.isCaveBoss || enemy.isRush));
    if (enemy && isBossFlee) {
      // Boss 战敌方攻击预判（信息透明·纯显示，承接 v6.3 敌招一览）：多招强敌逐一列出「普攻/重击」的期望伤害，
      // 数据源与 battle.pickAct/enemyAct 同一份 enemy.acts——重击倍率逐字同源（真身 2.3 / 平时 1.9）、
      // 受击公式 cmdDmg(atk, defMax, mult) 与结算同式同序、防御中再 ×DEFEND_MULT 取整；只列会出伤害的招，
      // 回血/石甲不算受击。致命判定取「最重一击」为上限（任一招可能致命即警示 ⚠️）。
      const ACT_NAME = { attack: '普攻', heavy: '重击' };
      const acts = (enemy.acts && enemy.acts.length) ? enemy.acts : [{ type: 'attack' }];
      const dmgActs = acts.filter((a) => a.type === 'attack' || a.type === 'heavy');
      const parts = dmgActs.length ? dmgActs : [{ type: 'attack' }];
      const rawHits = parts.map((a) => Math.max(1, cmdDmg(enemy.atk, hero.defMax, a.type === 'heavy' ? (enemy.phased ? HEAVY_MULT_PHASED : HEAVY_MULT) : 1)));
      const defHits = rawHits.map((d) => Math.max(1, Math.round(d * DEFEND_MULT)));
      const shown = hero.defending ? defHits : rawHits;
      const seg = parts.map((a, i) => `${ACT_NAME[a.type] || a.type} -${shown[i]}血`);
      const worst = Math.max(...shown);
      const lethal = worst >= hero.hp;
      const entCol = lethal ? '#ff9d6b' : '#8fa8b8';
      // 防御反击伤害预估（信息透明·纯显示）：与 battle.js enemyAct 反击分支逐字同源
      // cmdDmg(hero.atkMax, enemy.def, COUNTER_MULT) —— 反击倍率读 COUNTER_MULT、无浮动、值确定，可放心展示
      const counterDmg = Math.max(1, cmdDmg(hero.atkMax, enemy.def, COUNTER_MULT));
      const preTxt = hero.defending
        ? `格挡中 · ${seg.join(' · ')} · 反击≈${counterDmg}伤`
        : `敌方攻击预判：${seg.join(' · ')}（防御后-${defHits.join('/')}血）`;
      text(`${preTxt}${lethal ? ' ⚠️致命' : ''}  我方HP ${hero.hp}/${hero.hpMax}`, 320, 395, 'bold 11px', entCol, 'center');
    } else if (enemy && !isBossFlee) {
      // 预判与 battle.enemyAct 结算逐字同源：受击 = max(1, cmdDmg(atk, defMax, 1))，防御中再 ×DEFEND_MULT 取整
      const heroDefDmg = Math.max(1, cmdDmg(enemy.atk, hero.defMax, 1));
      const heroGuardDmg = Math.max(1, Math.round(heroDefDmg * DEFEND_MULT));
      // 防御反击伤害预估（信息透明·纯显示）：与 battle.js enemyAct 反击分支逐字同源
      // cmdDmg(hero.atkMax, enemy.def, COUNTER_MULT) —— 反击倍率读 COUNTER_MULT、无浮动、值确定
      const counterDmg = Math.max(1, cmdDmg(hero.atkMax, enemy.def, COUNTER_MULT));
      const lethal = (hero.defending ? heroGuardDmg : heroDefDmg) >= hero.hp;
      const entCol = lethal ? '#ff9d6b' : '#8fa8b8';
      const preTxt = hero.defending
        ? `敌方攻击预判：格挡中 · 本回合只受 -${heroGuardDmg}血 · 反击≈${counterDmg}伤`
        : `敌方攻击预判：-${heroDefDmg}血（防御后-${heroGuardDmg}血）`;
      text(`${preTxt}${lethal ? ' ⚠️致命' : ''}  我方HP ${hero.hp}/${hero.hpMax}`, 320, 395, 'bold 12px', entCol, 'center');
    }
  }
  for (let i = S.fx.length - 1; i >= 0; i--) {
    const p = S.fx[i];
    CTX.fillStyle = p.color;
    CTX.font = (p.bold ? 'bold 22px' : 'bold 14px') + ' sans-serif';
    CTX.textAlign = 'center';
    CTX.fillText(p.text, p.x, p.y);
    p.y -= p.vy;
    p.life--;
    if (p.life <= 0) S.fx.splice(i, 1);
  }
  for (let i = S.parr.length - 1; i >= 0; i--) {
    const p = S.parr[i];
    CTX.fillStyle = p.color;
    CTX.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.16;
    p.life--;
    if (p.life <= 0) S.parr.splice(i, 1);
  }
  CTX.restore();
  // 变身闪光（纯显示）：enemyAI 变身分支设 S.flash，400ms 白金衰减全屏覆盖
  if (S.flash) {
    const t = (Date.now() - S.flash.t0) / 400;
    if (t >= 1) S.flash = null;
    else {
      CTX.fillStyle = `rgba(255,246,220,${0.55 * (1 - t)})`;
      CTX.fillRect(0, 0, CV.width, CV.height);
    }
  }
  if (S.skillMenuOpen) drawSkillMenu();
}

bind.drawBattle = drawBattle;
