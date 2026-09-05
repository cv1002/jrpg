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
  // 显示每档 90 秒的昼夜标签（时长读 data.js DAY_PHASE_S 单一数据源，与 drawWorld 昼夜判定同源，
  // 调昼夜节奏只改 data.js 一处）。纯显示、零结算变化，不新增任何状态。
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

// v21.10 消息队列（信息透明·纯显示）：同帧/近帧多次 boxMsg 此前互相覆盖、只有最后一条可见——
// winBattle 结算流程最多 5 连发（精英蘑菇→胜利→额外掉落→记忆碎片→Boss 奖励），终焉之神一战
// v19.80 起的 余额/经验/掉落/记忆进度 四条反馈全部静默消失（只剩「初灯的意志散了」）；现改为
// 「正片消息（ms>0）显示期间，不同文本的新消息按序排队，当前条到点后自动接续下一条」，每条都完整可见。
// 同文本连发只刷新时长（不排队、不刷屏）；瞬时/清理消息（ms<=0：💀 击中闪字、drawTalk 清空、
// drawStory 逐帧「按 Enter 继续」）立即显示且带 CUR_TRANSIENT 标记——随后到达的正片消息（如
// talkNext 的「接受了…」、教程提示）可立即抢占，不被 2500ms 默认时长阻塞；瞬时消息到点后接续
// 队列（如有）。纯显示零结算变化。
const MSG_QUEUE = [];
let msgOn = false;
let curTransient = false;

function showMsg(m, t, dur, transient) {
  curTransient = !!transient;
  m.textContent = t;
  if (m.classList && typeof m.classList.add === 'function') m.classList.add('show');
  msgOn = true;
  clearTimeout(S.msgTO);
  S.msgTO = setTimeout(() => {
    try {
      const next = MSG_QUEUE.shift();
      if (next) showMsg(m, next.t, next.dur, false);
      else {
        msgOn = false;
        curTransient = false;
        if (m.classList && typeof m.classList.remove === 'function') m.classList.remove('show');
      }
    } catch (e) {}
  }, dur);
}

export function boxMsg(t, ms = 1700) {
  try {
    const m = elId('msg');
    if (!m) return;
    const dur = ms || 2500;
    if (ms <= 0) { showMsg(m, t, dur, true); return; }
    if (msgOn && m.textContent !== t && !curTransient) {
      const last = MSG_QUEUE[MSG_QUEUE.length - 1];
      if (!last || last.t !== t) MSG_QUEUE.push({ t, dur });
      return;
    }
    showMsg(m, t, dur, false);
  } catch (e) {}
}

bind.renderHUD = renderHUD;
bind.boxMsg = boxMsg;
