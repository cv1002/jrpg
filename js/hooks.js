// ============================================================
// hooks.js —— system 间的晚绑定钩子（打破 world↔battle、world↔core 环）
// 注册方：applyVictoryWorld / loadMap ← world.js
//         openTalk                    ← core.js
// 调用方：battle.js（胜利结算/重试换图）、world.js（踩到 NPC 开对话）
// ============================================================

export const hooks = {
  applyVictoryWorld() {},
  loadMap() {},
  openTalk() {},
};
