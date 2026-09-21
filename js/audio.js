// ============================================================
// audio.js —— Web Audio 音效 / BGM
// ============================================================
import { S, curMap } from './state.js';
import { SND_KEY, sndPrefToState, sndPrefToString, VOL_KEY, VOL_STEP, volPrefToState, volPrefToString } from './data.js';

// v21.21 音频开关持久化（体验打磨·承「信息透明」主线里的偏好记忆缺口）：S.SND 此前只活在内存——
// M 静音后刷新页面即回到有声（HUD 有 🔊/🔇 常驻指示却留不住偏好）。启动恢复与切换落盘只经这两函数，
// 存储键/编码由 data.js SND_KEY/sndPrefToState/sndPrefToString 单一数据源提供；localStorage 读写
// 失败（隐私模式/禁用）时静默降级为内存态，绝不影响游戏运行，也不在模块顶层执行任何副作用。
export function loadSndPref() {
  try { S.SND = sndPrefToState(localStorage.getItem(SND_KEY)); } catch (e) {}
}
export function saveSndPref() {
  try { localStorage.setItem(SND_KEY, sndPrefToString(S.SND)); } catch (e) {}
}
// v22.12 主音量偏好持久化（承 loadSndPref/saveSndPref 同款：存储键/编码由 data.js 单一数据源供给，
// localStorage 读写失败静默降级为内存态；loadVolPref 只在 main.js 启动恢复调用一次（与 loadSndPref 同
// 位），setVolume 是 [ ] 键调节的唯一入口——音量节点刷新/读档等场景无需重设，主增益总线常驻指向 S.VOL）。
export function loadVolPref() {
  try { S.VOL = volPrefToState(localStorage.getItem(VOL_KEY)); } catch (e) {}
}
export function saveVolPref() {
  try { localStorage.setItem(VOL_KEY, volPrefToString(S.VOL)); } catch (e) {}
}
// [ ] 键主音量调节（唯一入口）：按 VOL_STEP 步进并钳制到 [0,1]，实时写入主增益总线（ac() 未初始化时
// 仅落 S.VOL——此后首个音效/BGM 自动按新音量发声），落盘持久化。浮点步进经 ×10 取整消除 0.1 累加误差。
export function setVolume(delta) {
  S.VOL = Math.max(0, Math.min(1, Math.round((S.VOL + delta) * 10) / 10));
  if (S.masterGain) S.masterGain.gain.value = S.VOL;
  saveVolPref();
  return S.VOL;
}

function ac() {
  if (!S.AC) {
    try {
      const W = typeof window !== 'undefined' ? window : globalThis;
      S.AC = new (W.AudioContext || W.webkitAudioContext)();
      // v22.12 主音量总线：所有音效/BGM 经同一 gain 节点输出（tone 直连 S.masterGain），[ ] 调音量
      // 只改这一个节点/一个 S.VOL 值——零音色零时序变化（各音效的相对音量配比保持原样，只缩放整体）。
      if (S.AC && S.AC.createGain) {
        S.masterGain = S.AC.createGain();
        S.masterGain.gain.value = Math.max(0, Math.min(1, S.VOL));
        S.masterGain.connect(S.AC.destination);
      }
    } catch (e) {}
  }
  return S.AC;
}

function tone(freq, dur, type = 'square', vol = 0.12, when = 0, slide = 0) {
  const ctx = ac();
  if (!ctx || !S.SND) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + when);
  if (slide) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), ctx.currentTime + when + dur);
  }
  gain.gain.setValueAtTime(vol, ctx.currentTime + when);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + when + dur);
  osc.connect(gain);
  // v22.12 主音量总线（音效/BGM 统一出口）：ac() 初始化成功即常驻 S.masterGain，连接失败/未初始化
  // 时防御式回落直连 destination（旧行为）——音量总线只在音频后端可用时生效，绝不因偏好设置崩溃。
  gain.connect(S.masterGain || ctx.destination);
  osc.start(ctx.currentTime + when);
  osc.stop(ctx.currentTime + when + dur + 0.02);
}

const SFX = {
  step() { tone(180, 0.04, 'square', 0.03); },
  hit() { tone(140, 0.12, 'sawtooth', 0.12, 0, -80); },
  // v23.43 暴击专属上扬音（音效反馈·听觉信息透明——承 v21.3 alert/boss「先闻其声」/ v23.22 SFX.ach /
  // v23.33 SFX.craft / v23.40 SFX.flee 同一「事件音效各归其位」主线收口）：普攻暴击（CRIT_RATE 12%
  // ×1.8）此前与普攻同播 SFX.hit()（sawtooth 140 下坠）——12% 暴击在状态页有「普攻12%暴击 ×1.8」、
  // 命中会震屏、战报有「（暴击×1.8！）」，唯独听觉无区分：白赚 1.8 倍的一刀听感与普攻无异，玩家要
  // 靠浮字细看才知道暴了；现补 sawtooth 320→700 上挑滑音（与 hit 低坠同族反向，一听即分；暴击仅
  // 普攻可触发，技能走各自 sfx 不受影响）。零结算零数值零存档，家族其余逐字未动。
  crit() { tone(320, 0.11, 'sawtooth', 0.13, 0, 380); },
  hurt() { tone(110, 0.15, 'sawtooth', 0.14, 0, -70); },
  heal() { tone(520, 0.1, 'sine', 0.1); },
  item() { tone(700, 0.08, 'sine', 0.1); tone(900, 0.08, 'sine', 0.1, 0.08); },
  coin() { tone(880, 0.07, 'square', 0.1); tone(1320, 0.12, 'square', 0.1, 0.07); },
  levelup() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.16, 'triangle', 0.13, i * 0.11)); },
  // v23.22 成就解锁专属铃声（音效反馈·语义修正）：applyAchievements 此前对每个新成就播放 SFX.levelup()
  // （升级琶音）——成就与升级两种事件听感同音，且升级+成就同时达成（战斗胜利常见）时升级琶音连响两次；
  // 现补上行铃声（sine 三连 659→880→1319，与 levelup 琶音/victory 号角一听即分），解锁瞬间听声即知
  // 是成就非升级——承 v21.3 alert/boss「强敌前奏」同一听觉信息透明主线；零结算零数值零存档，家族其余逐字未动。
  ach() { tone(659, 0.09, 'sine', 0.1); tone(880, 0.09, 'sine', 0.1, 0.08); tone(1319, 0.2, 'sine', 0.1, 0.16); },
  // v23.33 酿造成功专属音效（音效反馈·语义修正——承 v23.22 SFX.ach 同一「事件音效各归其位」主线的收口）：
  // core.brewNow 酿造成功此前播放 SFX.levelup()（升级琶音）——酿造是制作行为不是升级：听感与升级同音，
  // 且首次酿造（「灵药初成」成就当场触发）时升级琶音与 v23.22 成就铃声连响两次（两种事件共用同一庆祝音）；
  // 现补气泡上行三连（sine 440→554→698，末音略长如波纹收尾），与 heal 单音/item 双音/coin 双音/
  // levelup 琶音/ach 铃声/victory 号角一听即分，酿成瞬间「听声即知是出锅非升级」；零结算零数值零存档
  // 零布局，家族其余逐字未动。
  craft() { tone(440, 0.06, 'sine', 0.09); tone(554, 0.06, 'sine', 0.09, 0.07); tone(698, 0.18, 'sine', 0.09, 0.14); },
  // v23.40 逃跑成功专属音效（音效反馈·语义修正——承 v23.22 SFX.ach / v23.33 SFX.craft 同一
  // 「事件音效各归其位」主线收口）：battle.doFlee 逃脱成功分支此前播放 SFX.select()（菜单移动轻点）——
  // 逃跑是「离场脱战」不是「选择/翻行」，脱战瞬间听感与菜单操作无可分辨；现补下行快三步
  // （square 523→392→294，末音略长如脚步远去收尾），与 select 单音/cancel 单音下降/alert 两连下坠/
  // victory 号角一听即分——逃脱成功「听声即知已脱战」；零结算零数值零存档，家族其余逐字未动
  // （气场压制/逃脱失败仍 SFX.cancel）。
  flee() { tone(523, 0.07, 'square', 0.09); tone(392, 0.07, 'square', 0.09, 0.07); tone(294, 0.12, 'square', 0.09, 0.14); },
  // v23.46 真身变身专属音效（音效反馈·语义修正——承 v23.22 SFX.ach / v23.33 SFX.craft / v23.40 SFX.flee /
  // v23.43 SFX.crit 同一「事件音效各归其位」主线的收口）：Boss 血量过半现出真身（enemyAI.js enemyAct
  // phase2 分支，幽冥魔王/洞窟领主/终焉之神通用）此前播放 SFX.thunder()（玩家技能雷鸣的落雷音）——
  // 变身是 Boss 的仪式事件（全屏白金闪光/回血/攻防暴涨/封印治愈），听感却与玩家自己的雷鸣无从分辨：
  // 终焉之神现出祸乱形态的瞬间玩家若正握着雷鸣，两声同响分不清哪声是自己的招；现补「力量暴涨」上涌
  // 三连（低音 saw 60→210 长涌 + 中音 triangle 300→520 + 高音 sine 1180→760 尾音渐弱，与 thunder 的
  // 瞬发落雷/boss 警报的低沉警告一听即分——先闻其声即知是它现出真身而非落雷）；零结算零数值零存档，
  // 家族其余逐字未动（普通回血 SFX.heal / 石甲 SFX.block / 雷鸣技能施放 SFX[sfx] 逐字未动）。
  transform() { tone(60, 0.5, 'sawtooth', 0.13, 0, 150); tone(300, 0.34, 'triangle', 0.1, 0.08, 220); tone(1180, 0.5, 'sine', 0.06, 0.2, -420); },
  victory() { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.18, 'square', 0.13, i * 0.13)); },
  death() { [400, 300, 200, 120].forEach((f, i) => tone(f, 0.3, 'sawtooth', 0.12, i * 0.18, -60)); },
  fire() { tone(300, 0.3, 'sawtooth', 0.11, 0, -120); },
  ice() { tone(1200, 0.25, 'sine', 0.1, 0, -600); },
  thunder() { tone(90, 0.3, 'sawtooth', 0.16, 0); tone(800, 0.1, 'square', 0.08, 0, 300); },
  select() { tone(660, 0.05, 'square', 0.08); },
  tick() { tone(1150 + Math.random() * 150, 0.015, 'square', 0.018); },
  cancel() { tone(330, 0.07, 'square', 0.08); },
  block() { tone(320, 0.06, 'triangle', 0.1); tone(480, 0.08, 'triangle', 0.08, 0.05); },
  // v23.47 蓄力专属音效（音效反馈·语义修正——承 v23.22 SFX.ach / v23.33 SFX.craft / v23.40 SFX.flee /
  // v23.43 SFX.crit / v23.46 SFX.transform 同一「事件音效各归其位」主线收口）：battle.doCharge（[6]蓄力）
  // 此前与 doDefend（[5]防御摆架势）/enemyAI 石甲格挡同播 SFX.block()（triangle 320→480 双音块响）——
  // 蓄力是进攻准备（「⚡ 凝神蓄力：下一次攻击或技能×N」），不是守势或格挡：按完 [5] 再按 [6] 两声
  // 同响，分不清自己摆的是守势还是攻势；现补上挑三连（square 392→523→659，末音略长如蓄势收尾），
  // 与 block 低音块响/select 单音/crit saw 上挑/levelup 琶音一听即分——按 [6] 听声即知在蓄力；
  // 零结算零数值零存档，家族其余逐字未动（doDefend 与石甲格挡仍 SFX.block 逐字未动）。
  charge() { tone(392, 0.06, 'square', 0.09); tone(523, 0.06, 'square', 0.1, 0.06); tone(659, 0.13, 'square', 0.1, 0.12); },
  door() { tone(440, 0.1, 'triangle', 0.1, 0, 200); },
  shop() { tone(880, 0.08, 'sine', 0.1); tone(1100, 0.1, 'sine', 0.1, 0.07); },
  // v21.3 战斗开场警报音（音效反馈）：此前进战斗只有 BGM 换轨、无瞬间听觉钩子，「⚔️ 遭遇了 X」弹出时全静默，
  // 且 Boss/试炼战与普通遭遇没有任何听觉区分。alert=普通遭遇两连下坠（高→低 square）；boss=低沉双滑落警报
  // + 高频渐弱尾音——boss 警报与普通遭遇一听即分，配合既有威胁预警文案构成「先闻其声」的强敌前奏
  alert() { tone(494, 0.08, 'square', 0.09); tone(392, 0.16, 'square', 0.1, 0.09); },
  boss() {
    tone(110, 0.42, 'sawtooth', 0.13, 0, -30);
    tone(165, 0.34, 'sawtooth', 0.1, 0.16, -22);
    tone(330, 0.22, 'triangle', 0.07, 0.34, -130);
  },
};

const MUSIC = {
  title: {
    step: 0.3, wave: 'sine',
    seq: [262, 330, 392, 330, 294, 349, 392, 349, 330, 392, 523, 392, 0, 0, 0, 0],
    bass: [131, 0, 0, 0, 110, 0, 0, 0],
  },
  village: {
    step: 0.28, wave: 'triangle',
    seq: [261, 0, 329, 0, 392, 329, 0, 294, 0, 349, 0, 392, 0, 523, 0, 392],
    bass: [131, 0, 0, 0, 110, 0, 0, 0],
  },
  dungeon: {
    step: 0.24, wave: 'triangle',
    seq: [220, 0, 220, 233, 0, 262, 0, 233, 0, 220, 0, 196, 0, 208, 0],
    bass: [110, 0, 0, 0, 98, 0, 0, 0],
  },
  cave: {
    step: 0.32, wave: 'sine',
    seq: [220, 0, 0, 0, 196, 0, 208, 0, 220, 0, 0, 0, 233, 0, 196, 0],
    bass: [110, 0, 110, 0, 98, 0, 110, 0],
  },
  // 无字回廊：更慢更稀的正弦长音，近乎耳语
  gallery: {
    step: 0.45, wave: 'sine',
    seq: [196, 0, 0, 0, 0, 0, 175, 0, 0, 0, 208, 0, 0, 0, 0, 0],
    bass: [98, 0, 0, 0, 87, 0, 0, 0],
  },
  battle: {
    step: 0.13, wave: 'square',
    seq: [330, 330, 0, 330, 0, 392, 330, 0, 294, 0, 330, 0, 262, 262, 0, 0],
    bass: [165, 0, 165, 0, 131, 0, 165, 0],
  },
  // v23.45 Boss/试炼战专属战斗 BGM（音效反馈·听觉信息透明，承 v21.3 alert/boss「先闻其声」主线收口）：
  // 与 battle 快节奏 square 330 同族反向——慢速三角波半音阶下行 A3(220)→G#3(208)→G3(196)→F#3(185)
  // + 低音持续长音（A2 110/G2 98），battle.js startBattle 按 isBossFoe 分轨调用；一听即知是强敌战，
  // 零结算零数值零存档（音乐数据纯声明，scheduleStep/gain 与既有轨共用同一渲染管线）。
  battleBoss: {
    step: 0.22, wave: 'triangle',
    seq: [220, 0, 0, 0, 208, 0, 0, 0, 196, 0, 0, 0, 185, 0, 0, 0],
    bass: [110, 0, 0, 0, 98, 0, 0, 0],
  },
};

function startBgm(track) {
  if (!S.SND || !S.AC) return;
  stopBgm();
  S.bgmTrack = track;
  S.bgmStep = 0;
  S.bgmTimer = setInterval(bgmTick, MUSIC[track].step * 1000);
}

function stopBgm() {
  if (S.bgmTimer) {
    clearInterval(S.bgmTimer);
    S.bgmTimer = null;
  }
}

function bgmTick() {
  if (!S.SND || !S.AC) return;
  const track = MUSIC[S.bgmTrack];
  if (!track) return;
  const i = S.bgmStep % track.seq.length;
  const step = track.step;
  if (track.seq[i]) tone(track.seq[i], step * 0.9, track.wave, 0.05, 0, 0);
  if (i % 2 === 0 && track.bass) tone(track.bass[i % track.bass.length], step * 1.8, 'sawtooth', 0.028, 0, 0);
  S.bgmStep++;
}

function bgmFromScene() {
  if (S.scene === 'battle') return 'battle';
  if (S.scene === 'title' || S.scene === 'create') return 'title';
  if (curMap() === 'village') return 'village';
  if (curMap() === 'cave') return 'cave';
  if (curMap() === 'gallery') return 'gallery';
  return 'dungeon';
}

function resumeBgm() { startBgm(bgmFromScene()); }

export { ac, tone, SFX, MUSIC, startBgm, stopBgm, bgmTick, bgmFromScene, resumeBgm };
