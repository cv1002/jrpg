// ============================================================
// view/index.js —— 绑定绘制实现 + 主渲染循环
// ============================================================
import { S } from '../state.js';
import { bind } from '../bind.js';
import { drawWorld } from './drawWorld.js';
import { drawBattle, openSkillMenu } from './drawBattle.js';
import {
  drawShop, drawInn, drawBrew, drawStatus, drawCodex, drawAch, drawJournal, drawHelp, drawTravel, drawPause, PAUSE_ITEMS,
  drawTalk, drawCreate, drawTitle, drawStory, drawDead, drawWin, drawEnding,
} from './menus.js';
import { renderHUD, boxMsg } from './hud.js';
import { fitCanvas } from './canvas.js';

bind.drawWorld = drawWorld;
bind.drawBattle = drawBattle;
bind.drawDead = drawDead;
bind.drawWin = drawWin;
bind.drawEnding = drawEnding;
bind.drawStory = drawStory;
bind.renderHUD = renderHUD;
bind.boxMsg = boxMsg;

const SCREENS = {
  title: drawTitle, create: drawCreate, world: drawWorld, ending: drawEnding,
  story: drawStory, battle: drawBattle, shop: drawShop, inn: drawInn, brew: drawBrew,
  status: drawStatus, journal: drawJournal, codex: drawCodex, ach: drawAch, help: drawHelp, travel: drawTravel,
  pause: drawPause, talk: drawTalk, dead: drawDead, win: drawWin,
};

let _timePrev = 0;
export function render() {
  fitCanvas();
  if (S.G) {
    const now = Date.now();
    if (_timePrev) S.G.time = (S.G.time || 0) + Math.min(60, (now - _timePrev) / 1000);
    _timePrev = now;
  }
  const fn = SCREENS[S.scene];
  if (fn) fn();
}

export {
  drawWorld, drawBattle, drawShop, drawInn, drawBrew, drawStatus, drawCodex,
  drawAch, drawJournal, drawHelp, drawTravel, drawPause, PAUSE_ITEMS, drawTalk, drawCreate, drawTitle, drawStory, drawDead,
  drawWin, drawEnding, openSkillMenu, renderHUD, boxMsg, SCREENS,
};
