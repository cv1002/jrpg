// ============================================================
// view/hud.js
// ============================================================
import { S, curMap } from '../state.js';
import { MAPS, ENCOUNTER, DAY_PHASE_S, STEP_GOAL, ACH_LIST, BESTIARY_TARGET, chestCount, chestTotal, FRAGMENTS } from '../data.js';
import { QUESTS } from '../data.js';
import { HUNT2_GOAL } from '../data.js';
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
  // v23.39 相位标签补「×倍率 · 剩Xs」（体验打磨·信息透明·纯显示——承 v23.31 昼夜接入遇敌机制
  // （夜间危险格步进 ×1.25/黎明 ×0.85，只调步进不调遇敌池）/ v23.35 小地图遇敌槽标签补倍率同一
  // 「昼夜信息看得见→读得懂」家族收口：顶部标签此前只报相位名，「这个相位遇敌是快是慢、还剩几秒
  // 换挡」查无一行（倍率只在小地图、节奏只能靠猜）；现与 world.tickEncounter/小地图同读 data.js
  // ENCOUNTER.phaseGauge + DAY_PHASE_S 一份单一数据源（乘数由 phaseGauge 派生零裸字面量；×1 的
  // 白天/黄昏与无字回廊恒暗（curMap()==='gallery'→1）零噪音不显示；剩余秒数 = DAY_PHASE_S −
  // floor(time)%DAY_PHASE_S，与 dayPhase 分档同式同源、t=整倍时即新一轮满 90s）。纯显示零结算零存档。
  const gtime = (S.G && S.G.time) || 0;
  const phaseK = curMap() === 'gallery' ? 1 : ((ENCOUNTER.phaseGauge || {})[timeOfDay()] || 1);
  const phaseLeft = DAY_PHASE_S - (Math.floor(gtime) % DAY_PHASE_S);
  const periodTag = curMap() === 'gallery' ? '🌑 恒暗'
    : (PERIOD[timeOfDay()] || '') + (phaseK !== 1 ? '×' + phaseK : '') + ' ·剩' + phaseLeft + 's';
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
  // v24.16 体验打磨·信息透明·计数现场：HUD 常驻「🚶 千里之行 N/1000」步数进度（承 v24.12 胜利画面
  // 「⚔️ 身经百战 N/100」/ v24.09 商店「🍄 蘑菇商路 N/30」/ v24.05 试炼碑「📜 千锤百炼 N/3」同一
  // 「计数现场报进度」主线 / v23.76 千里之行成就：计数 hero.steps 由 world.move 成功落地唯一产生点
  // 写入（本 HUD 每一帧/每步 renderHUD 刷新——步数这枚成就的计数现场正是大地图本身，行走全程
  // 此前查无一眼之数，进度只藏在 C 成就页一行 X/1000）；分子读 (hero.steps||0) 防御式旧档零迁移、
  // 分母读 data.js STEP_GOAL 单一数据源，与 C 页/ACH_LIST steps 的 ok/prog 同读一份源，调阈值只改
  // data.js 一处三端自动跟随；纯显示零结算零存档零数值变化（world.move 计数/存档结构逐字未动）。
  set('s-steps', (hero.steps || 0) + '/' + STEP_GOAL);
  // v24.115 体验打磨·信息透明·计数现场：HUD 常驻「🏆 成就 N/76」收集进度（承 v24.16 步数进度同一
  // 「计数现场报进度」主线/ v22.9 状态页资源行「🏆 成就 N/M」/ v24.76 解锁横幅「（成就 N/76）」/
  // drawDead 收集行同一收集口径）：成就总进度此前只藏在 C 页/标题槽预览/阵亡行，HUD 第二行一眼
  // 可见的计数（🍄/🚶/💾…）唯独缺「成就」这枚——冲记忆守护者（全部徽记）或数还差几枚齐活要开 C 页
  // 数 X/76；分子读 (hero.ach||[]) 防御式旧档零迁移、分母读 data.js ACH_LIST 单一数据源，与 C 页/
  // 解锁横幅/标题槽预览/drawDead 同读一份源，调成就集合只改 data.js 一处四端自动跟随；纯显示
  // 零结算零存档零数值变化（hero.ach 写入/解锁判定/奖励结算逐字未动）。
  set('s-ach', (hero.ach || []).length + '/' + ACH_LIST.length);
  // v24.117 体验打磨·信息透明·计数现场：HUD 常驻「📕 记忆图鉴 N/13」收集进度（承 v24.115 成就进度同一
  // 「计数现场报进度」主线/ v22.9 状态页资源行「📕:N/M」/ v22.76 图鉴页「记忆收录：N/13」/ 标题槽预览·
  // drawWin/drawEnding 收集行同一收集口径）：记忆图鉴（B 键）是「该去打哪只」的刷怪中枢与全游最大收藏面，
  // 总进度此前只藏在 I 状态页资源行/图鉴页汇总/标题槽预览，HUD 第二行一眼可见的计数（🍄/🚶/🏆…）唯独缺
  // 「图鉴」这枚——想冲记忆收藏家/见多识广这类讨伐系成就、或数全图鉴还差几种没打过，要开 B 页数 X/13；
  // 分子读 BESTIARY_TARGET.filter((n)=>((hero.bestiary||{})[n]|0)>=1).length 防御式旧档零迁移（布尔旧档
  // 经 |0 归一）、分母读 data.js BESTIARY_TARGET 单一数据源（与 I 页/标题槽预览/drawWin 收集行同式同源，
  // 调图鉴集合只改 data.js 一处全端自动跟随）；纯显示零结算零存档零数值变化（hero.bestiary 写入/讨伐收录
  // 判定/图鉴行绘制逐字未动）。
  set('s-codex', BESTIARY_TARGET.filter((n) => ((hero.bestiary || {})[n] | 0) >= 1).length + '/' + BESTIARY_TARGET.length);
  // v24.120 体验打磨·信息透明·计数现场：HUD 常驻「📦 宝箱 N/12」收集进度（承 v24.115 成就进度「🏆 成就
  // N/76」/ v24.117 图鉴进度「📕 记忆图鉴 N/13」同一「计数现场报进度」主线/ v19.72 状态页资源行「📦
  // 已开 X/全图 N」/ v22.26 开箱报文「已开 X/全图 N」同一收集口径）：全游 12 只宝箱（镇 2 + 林 3 + 矿 2 +
  // 星砂宝藏 4 + 廊 1）是探索深度指标与「开箱寻宝（6 只）/一箱不漏（12 只）」刷箱规划中枢，总进度此前只
  // 藏在 I 状态页资源行/标题槽预览/drawWin/drawDead 收集行，HUD 第二行一眼可见的计数（🍄/🚶/🏆/📕…）
  // 唯独缺「宝箱」这枚——想冲一箱不漏或数全图还剩几只没开，要开 I 页数「已开 X/全图 N」；分子读
  // chestCount(hero)（data.js 单一数据源，Set/数组/缺失三形态防御式旧档零迁移）、分母读 data.js
  // chestTotal()（由 MAPS/CAVE_TREASURE 逐图派生，与 I 页/标题预览/drawWin/drawDead/开箱报文同式同源，
  // 调地图只改 data.js 一处全端自动跟随）；纯显示零结算零存档零数值变化（hero.chests 写入/开箱判定/
  // 掉落/成就判定逐字未动）。
  set('s-chest', chestCount(hero) + '/' + chestTotal());
  // v24.123 HUD 常驻「🧩 记忆碎片 N/4」收集进度（承 v24.120「📦 宝箱 N/12」/ v24.117「📕 记忆图鉴 N/13」/
  // v24.115「🏆 成就 N/76」同一「计数现场报进度」主线，收集口径的 HUD 侧第四枚兑现）：记忆碎片
  // （FRAGMENTS 四枚强敌首胜掉落、集齐触发真结局「全记忆」加页）是真结局关键收集，此前只在 I 状态页
  // 资源行（v21.86「记忆碎片 N/4」）/J 日志碎片节/图鉴评论/胜利与阵亡收集行/标题槽预览可见，HUD 第二行
  // 独缺这枚；分子读 (hero.fragments||[]).length 防御式旧档零迁移、分母读 data.js FRAGMENTS 单一数据源
  // （与其余各端同式同源，调碎片集合只改 data.js 一处全端自动跟随）；纯显示零结算零存档零数值变化
  // （hero.fragments 写入/掉落判定/真结局触发逐字未动）。
  set('s-frag', (hero.fragments || []).length + '/' + FRAGMENTS.length);
  // v24.124 HUD 常驻「🏮 灯火同心 N/33」支线完成进度（承 v24.123「🧩 记忆碎片 N/4」/ v24.120「📦 宝箱 N/12」/
  // v24.117「📕 记忆图鉴 N/13」/ v24.115「🏆 成就 N/76」/ v24.16「🚶 步数」同一「计数现场报进度」主线，收集
  // 口径的 HUD 侧第五枚兑现）：灯火同心（QUESTS kind==='side' 全部支线完成，成就 allquests 判据）是通关后
  // 的终极完成度指标——交付横幅（v24.21「🏮 灯火同心 N/11」）/任务日志/Ⅰ 状态页只报「进行中」，想数还差
  // 几条支线清完、或临门一脚差哪条，只能开任务日志逐条核对；现 HUD 第二行 🧩 之右补常驻「🏮 N/33」——
  // 分子读 QUESTS kind==='side' 中 (hero.quests||{})[id]==='done' 的条数防御式旧档零迁移（缺 quests 字段
  // 计 0）、分母读 data.js QUESTS 单一数据源（与成就「灯火同心」/任务日志同读一份源，增删支线只改 data.js
  // 一处全端自动跟随）；纯显示零结算零存档零数值变化（hero.quests 写入/交付判定/成就判定逐字未动）。
  const sideQ = Object.values(QUESTS).filter((q) => q.kind === 'side');
  set('s-quests', sideQ.filter((q) => (hero.quests || {})[q.id] === 'done').length + '/' + sideQ.length);
  // v24.125 HUD 常驻「⚔️ 驱雾百战 N/100」讨伐进度（承 v24.124「🏮 灯火同心 N/33」/ v24.123「🧩 记忆碎片 N/4」/
  // v24.120「📦 宝箱 N/12」/ v24.117「📕 记忆图鉴 N/13」/ v24.115「🏆 成就 N/76」/ v24.16「🚶 步数」同一
  // 「计数现场报进度」主线，收集口径的 HUD 侧第六枚兑现）：讨伐（hero.totalWins，battle.winBattle 胜利结算
  // 唯一产生点）是伴随全场战斗的核心投入端口——胜利战报（v24.22「⚔️ 驱雾百战 N/100」）与胜利画面（v24.12
  // 「⚔️ 身经百战」·遭遇端口）都已报数，HUD 第二行却没有任何讨伐之数，想数还差几场凑满「驱雾百战」（讨伐线
  // 中档里程碑，HUNT2_GOAL(100) 只）只能开 C 成就页读 X/100；现 HUD 第二行 🏮 之右补常驻「⚔️ N/100」——
  // 分子读 (hero.totalWins||0) 防御式旧档零迁移、分母读 data.js HUNT2_GOAL 单一数据源（与 C 页/ACH_LIST
  // hunt100 的 ok/prog/胜利战报同读一份源，调阈值只改 data.js 一处全端自动跟随，打赢当场涨）；纯显示零结算
  // 零存档零数值变化（totalWins 写入/胜利结算/成就判定逐字未动）。
  set('s-hunt', (hero.totalWins || 0) + '/' + HUNT2_GOAL);
  // v22.12 HUD 静音指示同步主音量：音量 0%（gain 恒 0）与静音在听觉上等价，指示器如实显示 🔇——
  // 与 S.SND（M 独立开关）互不覆盖：SND 关 + 音量 100% 仍 🔇、SND 开 + 音量 0% 也 🔇。
  set('s-snd', (S.SND && (S.VOL || 1) > 0) ? '🔊' : '🔇');
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
// drawStory 逐帧「按 Enter / E 继续」）立即显示且带 CUR_TRANSIENT 标记——随后到达的正片消息（如
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
