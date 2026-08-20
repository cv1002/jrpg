// ============================================================
// ui.js —— 视图层桶文件（兼容旧 import 路径）
// ============================================================
export { CV, CTX, tileCanvas, rr, panel, text, hpbar, fmtTime } from './view/canvas.js';
export { TILE } from './view/tiles.js';
export { drawHero, drawMonster } from './view/sprites.js';
export { renderHUD, boxMsg } from './view/hud.js';
export { drawWorld, cam, timeOfDay } from './view/drawWorld.js';
export { drawBattle, openSkillMenu, burst, burstEnemy, burstPlayer, enemyLv, drawSkillMenu } from './view/drawBattle.js';
export {
  drawShop, drawInn, drawBrew, drawStatus, drawCodex, drawHelp, drawTravel,
  drawTalk, drawCreate, drawTitle, drawStory, drawDead, drawWin, drawEnding, openShop, drawJournal,
} from './view/menus.js';
export { render } from './view/index.js';
