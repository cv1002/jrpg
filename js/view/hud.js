// ============================================================
// view/hud.js
// ============================================================
import { S, curMap } from '../state.js';
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
  // 区域标注（v7.8 信息透明 · v7.9 补全倍率）：直接读 MAPS.zone，与 randomEncounter 逐项应用同源——
  // 不只看「魔物×HP」，攻/防/经验/金币的每一项区域修正也一并列出（cave 五项 / village 两项），
  // 进图第一眼即知该区「危险在哪、收益在哪」，杜绝「同一个怪为何忽软忽硬/经验忽多忽少」的黑盒
  const zone = MAPS[curMap()] && MAPS[curMap()].zone;
  let zoneTag = '';
  if (zone) {
    const ZONE_BITS = [['hp', '魔物'], ['atk', '攻'], ['def', '防'], ['xp', '经验'], ['gold', '金币']];
    const bits = ZONE_BITS.filter(([k]) => zone[k] != null).map(([k, label]) => `${label}×${zone[k]}`);
    zoneTag = ' · ' + zone.label + '·' + bits.join('·');
  }
  // v14.8 无字回廊昼夜标签如实「恒暗」：无字回廊是「被忘掉的地方没有晨昏」——画面着色（drawTimeTint）
  // 对 gallery 特判跳过昼夜、恒按暗色渲染，但此前 HUD 的昼夜标签仍无条件读世界时钟的阶段
  // （如正午进回廊会同时显示「某阶段标签 + 全屏暗色」，同一处设计自相矛盾）。
  // 现与 drawTimeTint 同判 curMap()==='gallery'、同读 S.G.time：回廊改标 🌑 恒暗，其余四图照常
  // 显示 90 秒一档的昼夜标签。纯显示、零结算变化，不新增任何状态。
  const periodTag = curMap() === 'gallery' ? '🌑 恒暗' : (PERIOD[timeOfDay()] || '');
  set('s-map', (hero.name || '守灯人') + ' · ' + ((MAPS[curMap()] && MAPS[curMap()].name) || curMap()) + ' · ' + periodTag + (hero.diff ? ' ⚡' : '') + zoneTag);
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
  // 攻/防常驻读数（信息透明·纯显示）：状态页/战斗对比行的数值平时要开 I 或进战斗才看得到，
  // 大地图一眼不可见——而商店换装、选怪刷练、决定打不打祭坛全依赖这对数字；
  // 直接读 hero.atkMax/defMax（与 applyStats 结算、drawBattle「我方 攻X 防Y」逐字同源），不新增任何状态。
  set('s-atk', hero.atkMax || 0);
  set('s-def', hero.defMax || 0);
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
  // v15.4 任务栏常驻：不再只在 world/ending 显示——画布下方 DOM 不挡画面，
  // 仅在开局前的 title/create/story 隐藏，其余全部场景（含战斗/商店/菜单/对话/结算）常驻可见
  const qshow = S.scene !== 'title' && S.scene !== 'create' && S.scene !== 'story';
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
