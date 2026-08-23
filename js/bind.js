// ============================================================
// bind.js —— 系统层 → 绘制层 的晚绑定钩子（systems 不 import view）
// view 启动时把真实实现填进来，每个键仅一处注册：
//   boxMsg / renderHUD        ← view/hud.js
//   drawBattle / burstEnemy / burstPlayer ← view/drawBattle.js
//   drawStory / drawDead / drawWin / drawEnding ← view/menus.js
//   CV                        ← view/canvas.js
// system 间的晚绑定（applyVictoryWorld / loadMap / openTalk）在 hooks.js。
// ============================================================

export const bind = {
  boxMsg() {},
  renderHUD() {},
  drawBattle() {},
  drawDead() {},
  drawWin() {},
  drawEnding() {},
  drawStory() {},
  burstEnemy() {},
  burstPlayer() {},
  CV: { width: 640, height: 480 },
};
