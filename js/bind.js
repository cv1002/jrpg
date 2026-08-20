// ============================================================
// bind.js —— 系统层 ↔ 绘制层 的晚绑定钩子（打破环依赖）
// systems（world / battle / core）只 import bind，不 import view。
// view 启动时把真实实现填进来。
//   boxMsg / renderHUD  ← view/hud.js
//   drawWorld           ← view/drawWorld.js
//   drawBattle / burst* ← view/drawBattle.js
//   drawDead / drawWin / drawStory ← view/menus.js
//   applyVictoryWorld / loadMap ← world.js
//   openTalk            ← core.js
// ============================================================

export const bind = {
  boxMsg() {},
  renderHUD() {},
  drawWorld() {},
  drawBattle() {},
  drawDead() {},
  drawWin() {},
  drawEnding() {},
  drawStory() {},
  burstEnemy() {},
  burstPlayer() {},
  applyVictoryWorld() {},
  loadMap() {},
  openTalk() {},
  CV: { width: 640, height: 480 },
};
