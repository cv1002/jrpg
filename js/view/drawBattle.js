// ============================================================
// view/drawBattle.js —— 战斗画面
// ============================================================
import { S } from '../state.js';
import { SKILL_DATA, RUSH_BOSSES, CHARGE_MULT, ELEM_NAME } from '../data.js';
import { cmdDmg, atkEstimate, skillEstimate } from '../rules.js';
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
  const n = enemy.name;
  if (n === '终焉之神' || n === '终焉之神·祸乱形态' || n === '终焉之神·真身' || n === '终焉之神 ·真身') return 12;
  if (n === '幽冥魔王' || n === '幽冥魔王·真身' || n === '幽冥魔王 ·真身') return 8;
  if (n === '洞窟领主' || n === '洞窟领主·真身' || n === '洞窟领主 ·真身') return 7;
  if (enemy.isElite) return (S.G ? S.G.level : 1) + 1;
  return S.G ? S.G.level : 1;
}

function drawArena() {
  const map = S.curMap;
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
    if (skill.kind === 'heal') prev = ' +' + Math.round(hero.hpMax * skill.heal) + 'HP' + (skill.cleanse ? ' ·解毒' : '');
    else prev = ' ≈' + skillEstimate(hero, enemy, skill) + '伤';
    const hint = skill.hint ? (' · ' + skill.hint) : '';
    text(`[${i + 1}] ${s}${prev}${banned ? '  ⛔封印' : (ok ? '' : '  ⛔')}`, 170, 160 + i * 36, '14px', col);
    // MP 消耗标注（信息透明）：蓝=够用 红=不足 灰=被封印；右对齐独立列，不挤占技能名/伤害预览
    text(`MP ${skill.mp}`, 474, 160 + i * 36, 'bold 12px', banned ? '#7d93a3' : (hero.mp >= skill.mp ? '#62c6ff' : '#e14b3f'), 'right');
    text(hint, 188, 176 + i * 36, '11px', '#7d93a3');
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
  drawArena();
  const hero = S.G;
  const enemy = S.enemy;
  text(`⚔️ 回合 ${S.battleTurn || 1}`, 60, 26, 'bold 14px', '#ffd24a');
  if (enemy && enemy.isRush) {
    const st = Math.min(RUSH_BOSSES.length, Math.max(1, hero.rushStage || 1));
    text(`🧭 试炼三连战 第 ${st}/${RUSH_BOSSES.length} 关`, 60, 48, 'bold 13px', '#a8ff8a');
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
        const thr = Math.ceil(enemy.hpMax * (enemy.phase2.at || 0.5));
        text(`二段变身线 · HP<${thr}`, ex0 + 6, 76, 'bold 9px', '#ffd24a');
      }
    }
    text(`我方 攻${hero.atkMax} 防${hero.defMax}   ⚔  敌方 攻${enemy.atk} 防${enemy.def}`, ex0, 92, 'bold 13px', '#8fa8b8', 'center');
    const wk = enemy.weak ? (' · 弱点' + ELEM_NAME[enemy.weak]) : '';
    // 补齐确定性奖励（与 winBattle 同源，纯显示）：精英必掉蘑菇；终焉之神战胜另有 +300 金币
    const bonus = (enemy.isElite ? ' · 🍄 必掉蘑菇' : '') + (enemy.isTrue ? ' · 战胜另+300金' : '');
    text(`战利品预览：经验 +${enemy.xp} 金币 +${enemy.gold}${wk}${bonus}${enemy.isRush ? '（试炼通关另有奖励）' : ''}`, ex0, 112, 'bold 13px', '#a8ff8a', 'center');
    if ((enemy.shield || 0) > 0) text(`🪨 石甲×${enemy.shield}（受击-40%）`, 620, 112, 'bold 12px', '#c0b397', 'right');
    if ((enemy.burn || 0) > 0) {
      // 灼烧每回合扣血数值（信息透明·纯显示）：与 enemyAct 同源 max(2, round(hpMax×0.04))，一眼看清烧多少
      text(`🔥 灼烧 ${enemy.burn} · 每回合 -${Math.max(2, Math.round(enemy.hpMax * 0.04))}血`, 620, 128, 'bold 12px', '#ff8a2c', 'right');
    }
    // 敌方格斗状态角标（信息透明）：冰霜击冻结后与石甲/灼烧同列常驻，下回合敌方行动时自动解除
    if (enemy.skipNext) text('❄️ 冻结 · 下回合无法行动', 620, 144, 'bold 12px', '#8fd8ff', 'right');
    if (enemy.forbid && enemy.forbid.includes('heal')) text('⛔ 治愈封印', 620, 48, 'bold 12px', '#ff5b5b', 'right');
    // 敌方招数一览（信息透明·纯显示）：与 battle.enemyAct/pickAct 读取同一份 enemy.acts 数据源，
    // 提前列清「它可能怎么做」——重击/回血/石甲，含血量触发线、层数上限与变身后强化/封印；
    // 只读不改，不影响任何敌方行动判定；无 acts 的普通魔物（只会普攻）不显示，避免噪音。
    // 位置：右缘状态角标列纵向下延（y=162），不出血条下方精灵区，纯显示不改结算
    if (enemy.acts && enemy.acts.length) {
      const ACT_NAME = { attack: '普攻', heavy: '重击', heal: '回血', shield: '石甲' };
      const tags = enemy.acts.map((a) => {
        let s = ACT_NAME[a.type] || a.type;
        if (a.hpBelow != null) s += `·血<${Math.round((a.hpBelow || 0) * 100)}%时`;
        if (a.type === 'shield' && a.maxShield != null) s += `·至多${a.maxShield}层`;
        if (a.type === 'heal' && enemy.forbid && enemy.forbid.includes('heal')) s += '·⛔封印';
        if (a.w2 != null && enemy.phased) s += '·真身后强';
        return s;
      });
      text(`敌方招数：${tags.join(' / ')}`, 620, 162, 'bold 11px', '#8fa8b8', 'right');
    }
  }
  drawHero(96, 400, 'R', hero.hurt ? { hurt: 1 } : null, BATTLE_SCALE);
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
    text('防御中 · 减伤50% · 回2MP/回合 · 50%几率反击', 448, 352, 'bold 12px', '#5fc8ff');
  }
  if (hero.charge) text(`蓄力中 · 下击/技能×${CHARGE_MULT}`, 356, 322, 'bold 12px', '#ffd24a');
  if ((hero.poison || 0) > 0) {
    // 中毒每回合扣血数值（信息透明·纯显示）：与 applyPoisonTick 同源 max(2, round(hpMax×0.05))，看清该不该净化/速战
    const pulse = (Math.floor(Date.now() / 400) % 2 === 0);
    text(`☠️ 中毒 ${hero.poison} 回合 · 每回合 -${Math.max(2, Math.round(hero.hpMax * 0.05))}血`, 200, 370, 'bold 12px', pulse ? '#7fe08a' : '#c0ffce');
  }
  if (!S.battleBusy) {
    const pN = hero.item || 0;
    const p2 = hero.potion2 || 0;
    const atkPrev = enemy ? `≈${atkEstimate(hero, enemy)}伤` : '';
    const isBossFlee = !!(enemy && (enemy.isBoss || enemy.isTrue || enemy.isCaveBoss || enemy.isRush));
    const bar = `[1]攻击${atkPrev}  [2]技能  [3]药水🍖×${pN}${p2 ? ` 🧪×${p2}` : ''}  [4]逃跑${isBossFlee ? '' : '·成功率约60%'}  [5]防御  [6]蓄力`;
    text(bar, 60, 440, '13px', '#8fa8b8');
    if (isBossFlee) {
      const preW = CTX.measureText(`[1]攻击${atkPrev}  [2]技能  [3]药水🍖×${pN}${p2 ? ` 🧪×${p2}` : ''}  [4]逃跑`).width;
      text('⛔', 60 + preW + 5, 441, 'bold 12px', '#ff5b5b');
    }
    // 药水恢复量预览（信息透明）：数值与 hero.js takePotion 公式同源，纯显示不改结算
    if (pN > 0 || p2 > 0) {
      const weakP = `🍖+${Math.round(hero.hpMax * 0.5) + 8}HP`;
      const strongP = p2 > 0 ? `  🧪+${Math.round(hero.hpMax * 0.8) + 20}HP/+${Math.round(hero.mpMax * 0.4)}MP` : '';
      text(`[3]恢复：${weakP}${strongP}`, 60, 424, 'bold 12px', '#8ff0a0');
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
      // 受击公式 cmdDmg(atk, defMax, mult) 与结算同式同序、防御中再 ×0.5 取整；只列会出伤害的招，
      // 回血/石甲不算受击。致命判定取「最重一击」为上限（任一招可能致命即警示 ⚠️）。
      const ACT_NAME = { attack: '普攻', heavy: '重击' };
      const acts = (enemy.acts && enemy.acts.length) ? enemy.acts : [{ type: 'attack' }];
      const dmgActs = acts.filter((a) => a.type === 'attack' || a.type === 'heavy');
      const parts = dmgActs.length ? dmgActs : [{ type: 'attack' }];
      const rawHits = parts.map((a) => Math.max(1, cmdDmg(enemy.atk, hero.defMax, a.type === 'heavy' ? (enemy.phased ? 2.3 : 1.9) : 1)));
      const defHits = rawHits.map((d) => Math.max(1, Math.round(d * 0.5)));
      const shown = hero.defending ? defHits : rawHits;
      const seg = parts.map((a, i) => `${ACT_NAME[a.type] || a.type} -${shown[i]}血`);
      const worst = Math.max(...shown);
      const lethal = worst >= hero.hp;
      const entCol = lethal ? '#ff9d6b' : '#8fa8b8';
      const preTxt = hero.defending
        ? `格挡中 · ${seg.join(' · ')}`
        : `敌方攻击预判：${seg.join(' · ')}（防御后-${defHits.join('/')}血）`;
      text(`${preTxt}${lethal ? ' ⚠️致命' : ''}  我方HP ${hero.hp}/${hero.hpMax}`, 320, 395, 'bold 11px', entCol, 'center');
    } else if (enemy && !isBossFlee) {
      // 预判与 battle.enemyAct 结算逐字同源：受击 = max(1, cmdDmg(atk, defMax, 1))，防御中再 ×0.5 取整
      const heroDefDmg = Math.max(1, cmdDmg(enemy.atk, hero.defMax, 1));
      const heroGuardDmg = Math.max(1, Math.round(heroDefDmg * 0.5));
      const lethal = (hero.defending ? heroGuardDmg : heroDefDmg) >= hero.hp;
      const entCol = lethal ? '#ff9d6b' : '#8fa8b8';
      const preTxt = hero.defending
        ? `敌方攻击预判：格挡中 · 本回合只受 -${heroGuardDmg}血`
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
  if (S.skillMenuOpen) drawSkillMenu();
}

bind.drawBattle = drawBattle;
