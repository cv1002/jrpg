// ============================================================
// audio.js —— Web Audio 音效 / BGM
// ============================================================
import { S, curMap } from './state.js';

function ac() {
  if (!S.AC) {
    try {
      const W = typeof window !== 'undefined' ? window : globalThis;
      S.AC = new (W.AudioContext || W.webkitAudioContext)();
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
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + when);
  osc.stop(ctx.currentTime + when + dur + 0.02);
}

const SFX = {
  step() { tone(180, 0.04, 'square', 0.03); },
  hit() { tone(140, 0.12, 'sawtooth', 0.12, 0, -80); },
  hurt() { tone(110, 0.15, 'sawtooth', 0.14, 0, -70); },
  heal() { tone(520, 0.1, 'sine', 0.1); },
  item() { tone(700, 0.08, 'sine', 0.1); tone(900, 0.08, 'sine', 0.1, 0.08); },
  coin() { tone(880, 0.07, 'square', 0.1); tone(1320, 0.12, 'square', 0.1, 0.07); },
  levelup() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.16, 'triangle', 0.13, i * 0.11)); },
  victory() { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.18, 'square', 0.13, i * 0.13)); },
  death() { [400, 300, 200, 120].forEach((f, i) => tone(f, 0.3, 'sawtooth', 0.12, i * 0.18, -60)); },
  fire() { tone(300, 0.3, 'sawtooth', 0.11, 0, -120); },
  ice() { tone(1200, 0.25, 'sine', 0.1, 0, -600); },
  thunder() { tone(90, 0.3, 'sawtooth', 0.16, 0); tone(800, 0.1, 'square', 0.08, 0, 300); },
  select() { tone(660, 0.05, 'square', 0.08); },
  tick() { tone(1150 + Math.random() * 150, 0.015, 'square', 0.018); },
  cancel() { tone(330, 0.07, 'square', 0.08); },
  block() { tone(320, 0.06, 'triangle', 0.1); tone(480, 0.08, 'triangle', 0.08, 0.05); },
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
