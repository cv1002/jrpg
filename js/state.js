// ============================================================
// state.js —— 共享运行时状态（导出对象 S）
// ESM 不能跨模块给 let 重新赋值；各模块 import { S } 后改 S.scene / S.G。
// 禁止把可变游戏状态挂到 globalThis。
// ============================================================

export const S = {
  AC: null,
  SND: true,
  // v22.12 主音量（0~1，落盘为 '0'..'100' 百分比字符串）：与 SND 同族运行时偏好——[ ] 键调节、
  // 启动 loadVolPref 恢复（读不到一律默认 1=100%）；audio.js 主增益总线读此值。零音色零时序。
  VOL: 1,
  bgmTimer: null,
  bgmStep: 0,
  bgmTrack: null,
  maze: null,
  G: null,
  scene: 'title',
  storyPage: 0,
  storyLineAt: 0,
  dir: 'D',
  anim: null,
  saveMsg: '',
  curSaveSlot: 1,
  msgTO: null,
  blog: [],
  battleBusy: false,
  battleTurn: 0,
  blogView: 0,
  shopSel: 0,
  pauseSel: 0,
  shopList: [],
  helpPage: 0,
  codexScroll: 0,
  achScroll: 0,
  journalScroll: 0,   // v21.45 任务日志（J）滚动偏移：内容超可视区时 ↑↓ 可滚（drawJournal 绘制期钳制）
  travelSel: 0,
  curNpc: null,
  talkPages: [],
  talkPage: 0,
  talkLineAt: 0,
  talkStartAt: 0,
  createName: 0,
  createDiff: 0,
  skillMenuOpen: false,
  skillSel: 0,
  enemy: null,
  fx: [],
  parr: [],
  shake: null,
  flash: null,
  walk: null,
  encGauge: 0,
  battleQ: [],
  battleAdvancing: false,
  battleTimer: null,
  // v21.16 标题页 R 重开两按确认的武装时间戳（0=未武装；main.js title.onKey 读写，core.titleResetCheck 判定）
  titleResetArm: 0,
  // v22.7 标题页 X 删除存档槽两按确认的武装时间戳（0=未武装；main.js title.onKey 读写，core.slotDeleteCheck 判定，
  // 与 titleResetArm 同族——两处标题页破坏性操作防误触共享同一确认窗口 TITLE_RESET_CONFIRM_MS）
  slotDeleteArm: 0,
  // v22.10 关闭/刷新未存档提醒（防误丢档·承 R/X 两按确认同一家族）：unsaved=进行中冒险自上次成功存档/
  // 读档后有未落盘的改动（world.move/battle.playerAction/shop 五购买/core 六入口共 13 个动作入口置脏，
  // saveGame/load 成功清脏）；main.js beforeunload 时 S.G && S.unsaved 即弹浏览器原生「离开页面」确认，
  // 纯运行时标志、不落盘零迁移（页面加载即 false 复位）。
  unsaved: false,
};

// 当前地图唯一真相是 G.map（loadMap 负责同步）；curMap() 供全层读取——
// 标题期 G 为 null 时回退 'village'（与启动时 loadMap('village') 一致）
export function curMap() {
  return S.G ? S.G.map : 'village';
}
