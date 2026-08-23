// ============================================================
// view/atlas.js —— Shade「Puny」CC0 图集加载（浏览器）；Node 冒烟无 Image 时跳过
// ============================================================
import { T } from '../data.js';

const SRC = {
  world: 'assets/puny/world.png',
  dungeon: 'assets/puny/dungeon.png',
  tree: 'assets/puny/tree.png',
  hero: 'assets/puny/hero.png',
  heroRed: 'assets/puny/hero-red.png',
  slime: 'assets/puny/slime.png',
  skeleton: 'assets/puny/skeleton.png',
  orc: 'assets/puny/orc.png',
  peon: 'assets/puny/peon.png',
  orcSoldier: 'assets/puny/orc-soldier.png',
  orcSoldierCyan: 'assets/puny/orc-soldier-cyan.png',
  worker: 'assets/puny/worker.png',
  workerCyan: 'assets/puny/worker-cyan.png',
  mage: 'assets/puny/mage.png',
  mageRed: 'assets/puny/mage-red.png',
  archer: 'assets/puny/archer.png',
  soldier: 'assets/puny/soldier.png',
  soldierYellow: 'assets/puny/soldier-yellow.png',
  knight: 'assets/puny/knight.png',
  // MiniWorld Sprites（Shade，CC0，16×16 帧）——NPC 差异化 + 石碑/路牌/界门装饰
  mwChief: 'assets/miniworld/Characters/Champions/Okomo.png',
  mwSage: 'assets/miniworld/Characters/Champions/Gangblanc.png',
  mwHunter: 'assets/miniworld/Characters/Workers/FarmerTemplate.png',
  mwAdventurer: 'assets/miniworld/Characters/Champions/Zhinja.png',
  mwVillager: 'assets/miniworld/Characters/Workers/PurpleWorker/FarmerPurple.png',
  mwCartman: 'assets/miniworld/Characters/Workers/CyanWorker/FarmerCyan.png',
  mwDemon: 'assets/miniworld/Characters/Monsters/Demons/RedDemon.png',
  mwTomb: 'assets/miniworld/Tombstones.png',
  mwPortal: 'assets/miniworld/Portal.png',
  mwSigns: 'assets/miniworld/Signs.png',
  mwRocks: 'assets/miniworld/Rocks.png',
  // Trash Mobs（Emcee Flesher，CC0 双授权，16×16 帧）——雾灵等杂兵
  trash: 'assets/trashmobs/trashmobz-alpha.png',
  // Fire Golem（teasloth，CC0，32×32 帧 2×2）——回廊精英「残焰魔像」
  fireGolem: 'assets/fire-golem/fire_golem.png',
};

// 16×16 帧图集（默认 32×32）：sprites.js 取帧时按此选 cell
export const SHEET_CELL16 = new Set([
  'mwChief', 'mwSage', 'mwHunter', 'mwAdventurer', 'mwVillager', 'mwCartman',
  'mwDemon', 'mwTomb', 'mwPortal', 'mwSigns', 'mwRocks', 'trash',
]);

export const sheets = {};
export let atlasReady = false;

function loadImage(src) {
  if (typeof Image === 'undefined') return Promise.resolve(null);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function loadAll() {
  if (typeof Image === 'undefined') return Promise.resolve(false);
  let promises = Object.entries(SRC)
    .map(async ([key, src]) => {
      const img = await loadImage(src);
      if (img) sheets[key] = img;
    });
  await Promise.all(promises);
  atlasReady = !!(sheets.world && sheets.dungeon);
  return atlasReady;
}

export const ready = loadAll();

/** 16×16 源格 → 画到 32×32 游戏格（关闭插值） */
export function blit16(ctx, img, col, row, dx = 0, dy = 0, dw = T, dh = T) {
  if (!img || !ctx) return;
  ctx.imageSmoothingEnabled = false;
  if ('mozImageSmoothingEnabled' in ctx) ctx.mozImageSmoothingEnabled = false;
  ctx.drawImage(img, col * 16, row * 16, 16, 16, dx, dy, dw, dh);
}

/** 角色/史莱姆帧（默认 32×32 源格） */
export function blitFrame(ctx, img, col, row, cell, dx, dy, dw, dh) {
  if (!img || !ctx) return;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, col * cell, row * cell, cell, cell, dx, dy, dw, dh);
}

export function hasSheet(key) {
  return !!sheets[key];
}
