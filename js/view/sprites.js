// ============================================================
// view/sprites.js —— 主角 / 魔物 / NPC 特征
// ============================================================
import { S } from '../state.js';
import { SPECIES, T, IDLE_BOB } from '../data.js';
import { isBossFoe } from '../rules.js';
import { CTX, rr } from './canvas.js';
import { sheets, blitFrame, SHEET_CELL16 } from './atlas.js';

const DIR_ROW = { D: 0, R: 2, U: 4, L: 6 };
// NPC 造型（MiniWorld CC0 16×16 帧；贴图缺失时退回程序化 mark）
const NPC_SHEET = {
  chief: 'mwChief', villager: 'mwVillager', adventurer: 'mwAdventurer',
  sage: 'mwSage', hunter: 'mwHunter', cartman: 'mwCartman',
  guard: 'mwSage',
};
const MON_SHEET = {
  slime: 'slime', wolf: 'orc', goblin: 'peon', skel: 'skeleton',
  stone: 'orcSoldierCyan', golem: 'orcSoldierCyan',
  boss: 'orcSoldier', caveboss: 'knight', true: 'mageRed',
  ghost: 'trash', fire: 'fireGolem',
};
// 定制帧位（非标准布局图集）：trash=雾灵（紫幽灵），fireGolem=残焰魔像（2 帧横排）
const CUSTOM_FRAMES = {
  trash: { cell: 16, frames: [[13, 7], [14, 7]] },
  fireGolem: { cell: 32, frames: [[0, 0], [1, 0]] },
};

function frameCol(hurt, moving) {
  if (hurt) return 20;
  if (moving) return 1 + (Math.floor(Date.now() / 120) % 4);
  return 0;
}

// Puny 角色帧 32×32，实绘大约 14×15，世界 2× 才能站上 32px 格。
// 战斗场地空，放大后按脚底对齐；3× 在 480 高画布上不会顶满。
const WORLD_SCALE = 2;
export const BATTLE_SCALE = 3;
const TILE_GROUND = T / 2;
const CHAR_FOOT = 22 / 32;
const SLIME_FOOT = 19 / 32;

/** 与 drawSheetChar 世界绘制同源的目标矩形（脚底对齐 TILE_GROUND）。cx/cy 为格心。 */
export function charDestBox(cx, cy) {
  const dest = Math.round(32 * WORLD_SCALE);
  const { dx, dy } = plantDy(dest, CHAR_FOOT, TILE_GROUND);
  return { x: Math.round(cx) + dx, y: Math.round(cy) + dy, w: dest, h: dest };
}

function drawShadowAt(y, dest) {
  CTX.fillStyle = 'rgba(0,0,0,.45)';
  CTX.beginPath();
  CTX.ellipse(0, y, Math.max(7, dest * 0.16), Math.max(2, dest * 0.05), 0, 0, 7);
  CTX.fill();
}

function plantDy(dest, footFrac, ground) {
  const foot = Math.round(dest * footFrac);
  const g = ground != null ? Math.round(ground) : Math.round(dest / 2) - 2;
  return { dx: -Math.round(dest / 2), dy: g - foot, ground: g };
}

function drawSheetChar(img, px, py, dir, opts) {
  const dest = Math.round(32 * ((opts && opts.scale) || 1));
  const cell = (opts && opts.cell) || 32;
  let { dx, dy, ground } = plantDy(dest, (opts && opts.foot) || CHAR_FOOT, opts && opts.ground);
  // 待机呼吸（纯显示）：±1px 相位浮动，相位随坐标错开防全场同步
  if (opts && opts.idle) dy += Math.round(Math.sin(Date.now() / IDLE_BOB.period + (px + py) * IDLE_BOB.phase));
  // 32px 图集有专用 hurt 帧（col 20）；16px 图集帧少，受击走红闪罩（下方统一处理）
  const col = cell === 32 ? frameCol(opts && opts.hurt, opts && opts.moving)
    : Math.floor(Date.now() / 300) % 2;
  CTX.save();
  CTX.translate(Math.round(px), Math.round(py));
  CTX.imageSmoothingEnabled = false;
  drawShadowAt(ground, dest);
  blitFrame(CTX, img, col, DIR_ROW[dir] || 0, cell, dx, dy, dest, dest);
  if (opts && opts.hurt) {
    CTX.fillStyle = 'rgba(255,80,80,.35)';
    CTX.fillRect(dx, dy, dest, dest);
  }
  CTX.restore();
}

// 定制帧位图集（CUSTOM_FRAMES 表）：非标准布局的小图集按显式帧列表播放
function drawSheetCustom(img, px, py, opts) {
  const spec = CUSTOM_FRAMES[opts.key];
  const dest = Math.round(32 * ((opts && opts.scale) || 1));
  let { dx, dy, ground } = plantDy(dest, (opts && opts.foot) || 15 / 16, opts && opts.ground);
  if (opts && opts.idle) dy += Math.round(Math.sin(Date.now() / IDLE_BOB.period + (px + py) * IDLE_BOB.phase));
  const [fc, fr] = spec.frames[Math.floor(Date.now() / 300) % spec.frames.length];
  CTX.save();
  CTX.translate(Math.round(px), Math.round(py));
  CTX.imageSmoothingEnabled = false;
  drawShadowAt(ground, dest);
  blitFrame(CTX, img, fc, fr, spec.cell, dx, dy, dest, dest);
  if (opts && opts.hurt) {
    CTX.fillStyle = 'rgba(255,80,80,.35)';
    CTX.fillRect(dx, dy, dest, dest);
  }
  CTX.restore();
}

function drawSheetStrip(img, px, py, opts) {
  const dest = Math.round(32 * ((opts && opts.scale) || 1));
  const foot = (opts && opts.foot) || SLIME_FOOT;
  let { dx, dy, ground } = plantDy(dest, foot, opts && opts.ground);
  if (opts && opts.idle) dy += Math.round(Math.sin(Date.now() / IDLE_BOB.period + (px + py) * IDLE_BOB.phase));
  const n = Math.max(1, Math.floor(img.width / 32));
  const live = Math.min(8, n);
  const col = (opts && opts.hurt) ? Math.min(n - 1, 8) : (Math.floor(Date.now() / 140) % live);
  CTX.save();
  CTX.translate(Math.round(px), Math.round(py));
  CTX.imageSmoothingEnabled = false;
  drawShadowAt(ground, dest);
  blitFrame(CTX, img, col, 0, 32, dx, dy, dest, dest);
  if (opts && opts.hurt) {
    CTX.globalAlpha = 0.55;
    CTX.fillStyle = '#fff';
    CTX.fillRect(dx, dy, dest, dest);
    CTX.globalAlpha = 1;
  }
  CTX.restore();
}

function heroSheet() {
  const hero = S.G;
  if (hero && (hero.weapon === '圣光之剑' || hero.armor === '龙鳞甲')) {
    return sheets.heroRed || sheets.hero;
  }
  return sheets.hero;
}

const ARM_COL = { '布衣': '#3b6fe0', '皮甲': '#b0702f', '锁子甲': '#aab6c6', '龙鳞甲': '#36c97e' };
const WPN_COL = { '木剑': '#8a5a2b', '铁剑': '#9aa4ad', '秘银剑': '#cfe0ee', '勇者之剑': '#e8c33a', '圣光之剑': '#ffd24a' };

export function drawHero(px, py, dir, anim, scale) {
  const img = heroSheet();
  if (img) {
    const battle = scale != null;
    drawSheetChar(img, px, py, dir || 'D', {
      scale: battle ? scale : WORLD_SCALE,
      ground: battle ? 0 : TILE_GROUND,
      hurt: anim && anim.hurt,
      moving: !battle && !!(S.walk && Date.now() - S.walk.t0 < S.walk.dur),
    });
    return;
  }
  const c = CTX;
  c.save();
  c.translate(px, py);
  if (scale) c.scale(scale, scale);
  const hero = S.G;
  const bodyCol = ARM_COL[hero && hero.armor] || '#3b6fe0';
  const wpn = WPN_COL[hero && hero.weapon] || '#8a5a2b';
  const legend = (hero && hero.weapon === '圣光之剑');
  const bob=(Math.floor(Date.now()/380)%2)?0:1;
  c.translate(0,-bob);
  if(anim&&anim.hurt){ c.fillStyle='rgba(255,80,80,.5)'; c.fillRect(-10,-16,22,26); }
  c.fillStyle='rgba(0,0,0,.22)'; c.beginPath(); c.ellipse(0,11,8,2.6,0,0,7); c.fill();
  c.fillStyle='#14263d'; c.fillRect(-7,-3,14,12);
  c.fillStyle='#14263d'; c.fillRect(-5,-13,10,11);
  c.fillStyle=bodyCol; c.fillRect(-6,-2,12,10);
  c.fillStyle='rgba(255,255,255,.15)'; c.fillRect(-6,-2,12,2);
  c.fillStyle='#ffd9a8'; c.fillRect(-4,-12,8,9);
  c.fillStyle='#5b3a1e'; c.fillRect(-4,-12,8,4);
  c.fillStyle='#2f1c08'; c.fillRect(-4,-13,8,2);
  c.fillStyle='#7e5b2f'; c.fillRect(-4,-10,12,3);
  c.fillStyle='#222'; c.fillRect(-2,-8,2,2); c.fillRect(2,-8,2,2);
  c.fillStyle='#5b3a1e'; c.fillRect(5,12,4,2);
  c.fillStyle='rgba(0,0,0,.25)'; c.fillRect(5,2,3,4);
  c.fillStyle=wpn; c.fillRect(6,-2,2,12);
  if(legend){
    c.fillStyle='rgba(255,220,90,1)'; c.fillRect(5,-3,3,2);
    c.fillStyle='rgba(255,210,74,.9)'; c.fillRect(4,-2,6,12);
    c.fillStyle='#fff3c4'; c.fillRect(8,-2,1,12);
    c.fillStyle='rgba(255,233,74,.4)'; c.fillRect(3,0,9,8);
  }
  const step=(Math.floor(Date.now()/260)%2)?1:0;
  const lx=(dir==='L'?-1:1);
  c.fillStyle='rgba(0,0,0,.25)'; c.fillRect(-6,7,12,2);
  c.fillStyle='#1c3150'; c.fillRect(-6,8,12,4);
  c.fillStyle='#2b4a99'; c.fillRect(-5+(step?0:lx),8,5,5); c.fillRect(1+(step?lx:0),8,5,5);
  c.fillStyle='#1c2a3c'; c.fillRect(-5,13,5,2); c.fillRect(1,13,5,2);
  c.restore();
}

function baseBody(col){
  CTX.fillStyle='rgba(0,0,0,.28)'; CTX.beginPath(); CTX.ellipse(0,17,14,3.5,0,0,7); CTX.fill();
  CTX.fillStyle='rgba(0,0,0,.35)'; rr(-17,-17,34,34,9); CTX.fill();
  CTX.fillStyle=col; rr(-16,-16,32,32,8); CTX.fill();
  CTX.fillStyle='rgba(255,255,255,.12)'; rr(-16,-14,32,6,4); CTX.fill();
  CTX.fillStyle='#fff'; CTX.beginPath(); CTX.arc(-7,-6,5,0,7); CTX.arc(7,-6,5,0,7); CTX.fill();
  CTX.fillStyle='#20242a'; CTX.beginPath(); CTX.arc(-7,-3,2,0,7); CTX.arc(7,-3,2,0,7); CTX.fill();
}

const DRAWS={
  slime(col){
    CTX.fillStyle='rgba(255,255,255,.35)'; CTX.beginPath(); CTX.arc(-6,-9,3,0,7); CTX.fill();
    CTX.fillStyle=col; CTX.beginPath(); CTX.arc(-12,12,4,0,7); CTX.arc(0,14,4,0,7); CTX.arc(12,12,4,0,7); CTX.fill();
    CTX.fillStyle='#200'; CTX.fillRect(-1,10,2,2);
  },
  wolf(col){
    CTX.fillStyle=col; CTX.beginPath(); CTX.moveTo(-13,-8); CTX.lineTo(-10,-17); CTX.lineTo(-6,-9); CTX.fill();
    CTX.beginPath(); CTX.moveTo(6,-9); CTX.lineTo(10,-17); CTX.lineTo(13,-8); CTX.fill();
    CTX.fillStyle='#eee'; CTX.fillRect(-4,-1,8,4);
    CTX.fillStyle='#222'; CTX.fillRect(3,-5,2,2);
    CTX.fillStyle=col; CTX.beginPath(); CTX.moveTo(13,6); CTX.lineTo(20,10); CTX.lineTo(13,14); CTX.closePath(); CTX.fill();
    CTX.strokeStyle='#200'; CTX.lineWidth=1; CTX.beginPath(); CTX.moveTo(-4,10); CTX.lineTo(4,10); CTX.stroke();
  },
  skel(){
    CTX.fillStyle='#1a1a1a';
    CTX.beginPath(); CTX.arc(-6,-6,4.2,0,7); CTX.arc(6,-6,4.2,0,7); CTX.fill();
    CTX.beginPath(); CTX.moveTo(0,-2); CTX.lineTo(-2.5,2.5); CTX.lineTo(2.5,2.5); CTX.closePath(); CTX.fill();
    CTX.strokeStyle='#1a1a1a'; CTX.lineWidth=1.5;
    CTX.beginPath(); CTX.arc(0,5,7.5,0.2,Math.PI-0.2); CTX.stroke();
    CTX.fillStyle='#e8e8e0';
    for (let z = -6; z <= 4; z += 3) CTX.fillRect(z, 4, 2, 3);
    CTX.strokeStyle='#8a8490'; CTX.lineWidth=1.2;
    CTX.beginPath();
    CTX.moveTo(-8,11); CTX.lineTo(8,11);
    CTX.moveTo(-7,14); CTX.lineTo(7,14);
    CTX.stroke();
  },
  goblin(col){
    CTX.fillStyle=col; CTX.beginPath(); CTX.moveTo(-15,-8); CTX.lineTo(-20,-18); CTX.lineTo(-11,-12); CTX.closePath(); CTX.fill();
    CTX.beginPath(); CTX.moveTo(15,-8); CTX.lineTo(20,-18); CTX.lineTo(11,-12); CTX.closePath(); CTX.fill();
    CTX.fillStyle='#a9c8a0'; CTX.fillRect(-3,-2,6,4);
    CTX.fillStyle='#fff'; CTX.fillRect(-2,0,2,3); CTX.fillRect(1,0,2,3);
  },
  snake(){
    CTX.fillStyle='#ffe94a'; CTX.fillRect(-8,-8,2,4); CTX.fillRect(6,-8,2,4);
    CTX.fillStyle='#fff'; CTX.fillRect(-1,-10,2,2);
    CTX.fillStyle='#e14b3f'; CTX.beginPath(); CTX.moveTo(8,12); CTX.lineTo(13,13); CTX.lineTo(8,14); CTX.closePath(); CTX.fill();
    CTX.strokeStyle='rgba(255,255,255,.2)'; CTX.lineWidth=1; CTX.beginPath(); CTX.moveTo(-12,-12); CTX.lineTo(12,12); CTX.stroke();
  },
  tree(){
    CTX.fillStyle='#2f8f3f'; CTX.beginPath(); CTX.arc(-8,-16,6,0,7); CTX.arc(8,-16,6,0,7); CTX.arc(0,-18,7,0,7); CTX.fill();
    CTX.fillStyle='#3fae4f'; CTX.fillRect(-16,-8,4,10); CTX.fillRect(12,-8,4,10);
    CTX.fillStyle='#5b3f22'; CTX.fillRect(-1,-14,2,12);
  },
  stone(){
    CTX.strokeStyle='#3a4248'; CTX.lineWidth=2; CTX.beginPath(); CTX.moveTo(0,-6); CTX.lineTo(-5,7); CTX.moveTo(4,-9); CTX.lineTo(2,0); CTX.moveTo(2,0); CTX.lineTo(9,6); CTX.stroke();
    CTX.fillStyle='#a9b0a0'; CTX.fillRect(-4,4,3,3); CTX.fillRect(10,10,3,3);
  },
  golem(){
    DRAWS.stone();
    CTX.fillStyle='rgba(95,216,255,.5)'; CTX.fillRect(-14,-14,6,3);
  },
  boss(col,m){
    CTX.fillStyle='#ff5b5b'; CTX.beginPath(); CTX.arc(-7,-6,2.4,0,7); CTX.arc(7,-6,2.4,0,7); CTX.fill();
    CTX.fillStyle=col; CTX.beginPath(); CTX.moveTo(-9,-13); CTX.lineTo(-7,-22); CTX.lineTo(-3,-14); CTX.fill();
    CTX.beginPath(); CTX.moveTo(9,-13); CTX.lineTo(7,-22); CTX.lineTo(3,-14); CTX.fill();
    if(m&&(m.isTrue||m.draw==='true')){
      CTX.fillStyle='rgba(255,233,74,.22)'; CTX.beginPath(); CTX.arc(0,0,20,0,7); CTX.fill();
      CTX.strokeStyle='rgba(255,233,74,.55)'; CTX.lineWidth=1.5; CTX.beginPath(); CTX.arc(0,0,23,0,7); CTX.stroke();
      CTX.fillStyle='rgba(255,233,74,.6)';
      CTX.beginPath(); CTX.moveTo(-13,-2); CTX.lineTo(-26,-16); CTX.lineTo(-18,-19); CTX.lineTo(-10,-8); CTX.closePath(); CTX.fill();
      CTX.beginPath(); CTX.moveTo(13,-2); CTX.lineTo(26,-16); CTX.lineTo(18,-19); CTX.lineTo(10,-8); CTX.closePath(); CTX.fill();
    }
    if(m&&(m.isCaveBoss||m.draw==='caveboss')){ CTX.fillStyle='rgba(95,216,255,.8)'; CTX.fillRect(18,-4,5,2); CTX.fillRect(-23,-4,5,2); }
  },
};

DRAWS.caveboss=(col,m)=>DRAWS.boss(col,m);
DRAWS.true=(col,m)=>DRAWS.boss(col,m);

const NO_SHEET = new Set(['wolf', 'snake', 'tree']);

export function drawMonster(x,y,m){
  const key=m.draw||(SPECIES[m.name]&&SPECIES[m.name].draw)||(isBossFoe(m)?'boss':'slime');
  const s=BATTLE_SCALE*(m.isTrue?1.28:(m.isBoss||m.isCaveBoss?1.18:(m.isElite?1.08:1)));
  const sheetKey=NO_SHEET.has(key)?null:MON_SHEET[key];
  const img=sheetKey&&sheets[sheetKey];
  if(img){
    if(CUSTOM_FRAMES[sheetKey]){
      const cs = sheetKey==='fireGolem' ? s*0.62 : s*0.55;
      drawSheetCustom(img,x,y,{key:sheetKey,scale:cs,ground:0,hurt:m.hurt,idle:true});
      return;
    }
    if(sheetKey==='slime') drawSheetStrip(img,x,y,{scale:s,ground:0,hurt:m.hurt,idle:true});
    else if(sheetKey==='skeleton') drawSheetStrip(img,x,y,{scale:s,ground:0,hurt:m.hurt,foot:30/32,idle:true});
    else drawSheetChar(img,x,y,'D',{scale:s,ground:0,hurt:m.hurt,moving:true,idle:true});
    return;
  }
  CTX.save();
  CTX.translate(x, y + Math.round(Math.sin(Date.now() / IDLE_BOB.period + (x + y) * IDLE_BOB.phase)));
  CTX.scale(s, s);
  CTX.translate(0, -17);
  const col=m.color||'#8892a0';
  baseBody(col);
  const fn=DRAWS[key]||DRAWS.slime;
  fn(col,m);
  if(m.hurt){ CTX.fillStyle='#fff'; CTX.globalAlpha=0.75; rr(-16,-16,32,32,8); CTX.fill(); CTX.globalAlpha=1; }
  CTX.restore();
}

export function drawNpcSprite(cx, cy, nid, mark) {
  const key = NPC_SHEET[nid] || 'mwVillager';
  const img = sheets[key];
  if (img) {
    const c16 = SHEET_CELL16.has(key);
    // 16×16 全帧素材按 1×（32px 格）绘制，与 Puny 主角的视觉体量一致
    drawSheetChar(img, cx, cy, 'D', c16
      ? { scale: WORLD_SCALE / 2, ground: TILE_GROUND, idle: true, cell: 16, foot: 15 / 16 }
      : { scale: WORLD_SCALE, ground: TILE_GROUND, idle: true });
    return;
  }
  drawNpcMark(cx - 16, cy - 16, mark);
}

export function drawNpcMark(px,py,mark){
  const c=CTX; c.save(); c.translate(px,py);
  if(mark==='hat'){ c.fillStyle='#6b3a1e'; c.fillRect(8,6,16,5); c.fillRect(12,2,8,5); }
  else if(mark==='lamp'){ c.fillStyle='#ffd24a'; c.fillRect(24,4,4,8); c.fillStyle='#ffe9a8'; c.fillRect(25,5,2,3); }
  else if(mark==='sword'){ c.fillStyle='#cfe0ee'; c.fillRect(24,8,3,12); c.fillStyle='#8a5a2b'; c.fillRect(23,18,5,3); }
  else if(mark==='basket'){ c.fillStyle='#c08040'; c.fillRect(6,18,8,6); }
  else if(mark==='hood'){ c.fillStyle='#3a4a5c'; c.fillRect(10,2,12,8); }
  else if(mark==='staff'){ /* 默认图块已有杖 */ }
  c.restore();
}
