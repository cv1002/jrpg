// ============================================================
// scene.js —— 场景切换收口
// ============================================================
import { S } from './state.js';
import { startBgm, stopBgm, resumeBgm } from './audio.js';

export function goto(name) {
  const prev = S.scene;
  S.scene = name;
  if (name !== 'battle') S.skillMenuOpen = false;
  if (name === 'world') {
    S.battleBusy = false;
    if (prev === 'battle' || prev === 'win' || prev === 'dead') resumeBgm();
  }
  if (name === 'win' || name === 'dead') stopBgm();
  if (name === 'story' && prev === 'create') startBgm('village');
}
