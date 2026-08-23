// ============================================================
// view/index.js —— 绑定绘制实现 + 主渲染循环
// ============================================================
import { S } from '../state.js';
import { drawWorld } from './drawWorld.js';
import { drawBattle, openSkillMenu } from './drawBattle.js';
import {
  drawShop, drawInn, drawBrew, drawStatus, drawCodex, drawAch, drawJournal, drawHelp, drawTravel, drawPause, PAUSE_ITEMS,
  drawTalk, drawCreate, drawTitle, drawStory, drawDead, drawWin, drawEnding,
} from './menus.js';
import { renderHUD, boxMsg } from './hud.js';
import { fitCanvas } from './canvas.js';

const SCREENS = {
  title: drawTitle, create: drawCreate, world: drawWorld, ending: drawEnding,
  story: drawStory, battle: drawBattle, shop: drawShop, inn: drawInn, brew: drawBrew,
  status: drawStatus, journal: drawJournal, codex: drawCodex, ach: drawAch, help: drawHelp, travel: drawTravel,
  pause: drawPause, talk: drawTalk, dead: drawDead, win: drawWin,
};

export function render() {
  fitCanvas();
  const fn = SCREENS[S.scene];
  if (fn) fn();
}

export {
  drawWorld, drawBattle, drawShop, drawInn, drawBrew, drawStatus, drawCodex,
  drawAch, drawJournal, drawHelp, drawTravel, drawPause, PAUSE_ITEMS, drawTalk, drawCreate, drawTitle, drawStory, drawDead,
  drawWin, drawEnding, openSkillMenu, renderHUD, boxMsg, SCREENS,
};
