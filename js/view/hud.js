// ============================================================
// view/hud.js
// ============================================================
import { S } from '../state.js';
import { MAPS } from '../data.js';
import { questBannerLines } from '../quests.js';
import { bind } from '../bind.js';
import { elId } from './canvas.js';
import { timeOfDay } from './drawWorld.js'; // 复用昼夜判定（与画面着色同源）

const PERIOD = { day: '☀️ 白天', dusk: '🌆 黄昏', night: '🌙 夜晚', dawn: '🌅 黎明' };

export function renderHUD() {
  const hero = S.G;
  if (!hero) return;
  const set = (id, v) => { const n = elId(id); if (n) n.textContent = v; };
  set('s-map', (hero.name || '守灯人') + ' · ' + ((MAPS[S.curMap] && MAPS[S.curMap].name) || S.curMap) + ' · ' + (PERIOD[timeOfDay()] || '') + (hero.diff ? ' ⚡' : ''));
  set('s-lv', hero.level);
  set('s-xp', `${Math.max(0, hero.xp)}/${hero.xpNext}`);
  const xpbar = elId('s-xpbar');
  if (xpbar && xpbar.style) xpbar.style.width = (100 * Math.max(0, hero.xp) / Math.max(1, hero.xpNext)) + '%';
  set('s-hp', `${Math.max(0, Math.round(hero.hp))}/${hero.hpMax}`);
  set('s-mp', `${Math.max(0, Math.round(hero.mp))}/${hero.mpMax}`);
  set('s-gold', hero.gold);
  set('s-potion', hero.item);
  set('s-potion2', hero.potion2 || 0);
  set('s-mushroom', hero.mushrooms || 0);
  set('s-snd', S.SND ? '🔊' : '🔇');
  set('s-weapon', hero.weapon);
  set('s-armor', hero.armor);
  const hpbarEl = elId('s-hpbar');
  if (hpbarEl && hpbarEl.style) hpbarEl.style.width = (100 * Math.max(0, hero.hp) / hero.hpMax) + '%';
  const mpbar = elId('s-mpbar');
  if (mpbar && mpbar.style) mpbar.style.width = (100 * Math.max(0, hero.mp) / hero.mpMax) + '%';
  const lowHp = (hero.hpMax > 0 && hero.hp / hero.hpMax <= 0.30);
  const hpEl = elId('s-hp');
  if (hpEl.classList) hpEl.classList.toggle('danger', lowHp);
  if (hpbarEl && hpbarEl.parentElement && hpbarEl.parentElement.classList) hpbarEl.parentElement.classList.toggle('low', lowHp);
  set('s-save', S.saveMsg);
  set('s-slot', '槽' + S.curSaveSlot);
  const qbar = elId('quest');
  const qshow = S.scene === 'world' || S.scene === 'ending';
  if (qbar && qbar.classList) {
    if (qshow) qbar.classList.add('show');
    else qbar.classList.remove('show');
  }
  if (qshow) {
    const lines = questBannerLines(hero);
    set('s-quest-main', '🎯 ' + (lines.main || ''));
    set('s-quest-side', lines.sides && lines.sides.length ? lines.sides.map((s) => '📜 ' + s).join('\n') : '');
  }
}

export function boxMsg(t, ms = 1700) {
  try {
    const m = elId('msg');
    if (!m) return;
    m.textContent = t;
    if (m.classList && typeof m.classList.add === 'function') m.classList.add('show');
    clearTimeout(S.msgTO);
    S.msgTO = setTimeout(() => {
      try {
        if (m.classList && typeof m.classList.remove === 'function') m.classList.remove('show');
      } catch (e) {}
    }, ms || 2500);
  } catch (e) {}
}

bind.renderHUD = renderHUD;
bind.boxMsg = boxMsg;
