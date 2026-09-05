// ============================================================
// state.js —— 共享运行时状态（导出对象 S）
// ESM 不能跨模块给 let 重新赋值；各模块 import { S } 后改 S.scene / S.G。
// 禁止把可变游戏状态挂到 globalThis。
// ============================================================

export const S = {
  AC: null,
  SND: true,
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
};

// 当前地图唯一真相是 G.map（loadMap 负责同步）；curMap() 供全层读取——
// 标题期 G 为 null 时回退 'village'（与启动时 loadMap('village') 一致）
export function curMap() {
  return S.G ? S.G.map : 'village';
}
