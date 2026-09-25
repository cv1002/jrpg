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
  // v24.01 胜利/阵亡/尾声三屏专属 BGM（音效反馈·听觉信息透明，承 v23.45 battleBoss 分轨同族收口）：
  // 此前 win/dead 进入即 stopBgm 静音（战斗轨在结果瞬间被掐掉、只剩 SFX 一响），ending 由 battle.js
  // isTrue 分支 stopBgm 后进入同样静音——「灯芯回来了」（Boss 胜利决策现场）/战败复盘（B/R/T/P 决策
  // 现场）/真结局总结屏是 run 最重要的三屏却查无乐音；现按分轨 startBgm（与 battleBoss 同法，零结算
  // 零数值零存档；win.onKey Enter/E→goto('ending') 时 startBgm 自带 stopBgm 无缝换轨；走出回 world 的
  // resumeBgm（上方 prev win/dead 分支）照旧回地图轨逐字未动，R/B/T/P 各出口 goto title/battle 亦各自
  // 分轨——title 由 main.js startBgm('title')、battle 由 startBattle startBgm 接管）。
  if (name === 'win') startBgm('win');
  else if (name === 'dead') startBgm('dead');
  else if (name === 'ending') startBgm('ending');
  if (name === 'story' && prev === 'create') startBgm('village');
}
