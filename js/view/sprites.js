// ============================================================
// view/sprites.js —— 主角 / 魔物 / NPC 特征
// ============================================================
import { S } from '../state.js';
import { SPECIES, T } from '../data.js';
import { CTX, rr } from './canvas.js';
import { sheets, blitFrame } from './atlas.js';

const DIR_ROW = { D: 0, R: 2, U: 4, L: 6 };
const NPC_SHEET = {
  chief: 'mage', villager: 'worker', adventurer: 'soldier',
  sage: 'mageRed', hunter: 'archer', cartman: 'workerCyan',
};
const MON_SHEET = {
  slime: 'slime', wolf: 'orc', skel: 'soldierYellow', goblin: 'peon',
  stone: 'orcSoldierCyan', golem: 'orcSoldierCyan',
  boss: 'orcSoldier', caveboss: 'knight', true: 'mageRed',
};

function frameCol(hurt, moving) {
  if (hurt) return 20;
  if (moving) return 1 + (Math.floor(Date.now() / 120) % 4);
  return 0;
}

// Puny 角色帧 32×32，实绘大约 14×15，世界 2× 才能站上 32px 格。
// 战斗场地空，若仍用 1.x 会缩成点，按脚底对齐放大。
const WORLD_SCALE = 2;
export const BATTLE_SCALE = 6;
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
  const { dx, dy, ground } = plantDy(dest, CHAR_FOOT, opts && opts.ground);
  CTX.save();
  CTX.translate(Math.round(px), Math.round(py));
  CTX.imageSmoothingEnabled = false;
  drawShadowAt(ground, dest);
  blitFrame(CTX, img, frameCol(opts && opts.hurt, opts && opts.moving), DIR_ROW[dir] || 0, 32, dx, dy, dest, dest);
  if (opts && opts.hurt) {
    CTX.fillStyle = 'rgba(255,80,80,.35)';
    CTX.fillRect(dx, dy, dest, dest);
  }
  CTX.restore();
}

function drawSheetStrip(img, px, py, opts) {
  const dest = Math.round(32 * ((opts && opts.scale) || 1));
  const { dx, dy, ground } = plantDy(dest, SLIME_FOOT, opts && opts.ground);
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
    CTX.fillStyle='#1a1a1a'; CTX.fillRect(-9,-9,7,7); CTX.fillRect(2,-9,7,7);
    CTX.beginPath(); CTX.moveTo(-1,2); CTX.lineTo(1,0); CTX.lineTo(3,2); CTX.closePath(); CTX.fill();
    CTX.strokeStyle='#222'; CTX.lineWidth=1; CTX.beginPath(); CTX.moveTo(-8,5); CTX.lineTo(8,5); CTX.stroke();
    for(let z=-6; z<=5; z+=4){ CTX.fillStyle='#e8e8e0'; CTX.fillRect(z,5,3,3); }
    CTX.strokeStyle='#aab2ba'; CTX.lineWidth=1; CTX.beginPath(); CTX.moveTo(-6,12); CTX.lineTo(-6,16); CTX.moveTo(0,11); CTX.lineTo(0,16); CTX.moveTo(6,12); CTX.lineTo(6,16); CTX.stroke();
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
  const key=m.draw||(SPECIES[m.name]&&SPECIES[m.name].draw)||(m.isBoss||m.isTrue||m.isCaveBoss||m.isRush?'boss':'slime');
  const s=BATTLE_SCALE*(m.isTrue?1.28:(m.isBoss||m.isCaveBoss?1.18:(m.isElite?1.08:1)));
  const sheetKey=NO_SHEET.has(key)?null:MON_SHEET[key];
  const img=sheetKey&&sheets[sheetKey];
  if(img){
    if(sheetKey==='slime') drawSheetStrip(img,x,y,{scale:s,ground:0,hurt:m.hurt});
    else drawSheetChar(img,x,y,'D',{scale:s,ground:0,hurt:m.hurt,moving:true});
    return;
  }
  CTX.save();
  CTX.translate(x, y);
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
  const img = sheets[NPC_SHEET[nid] || 'mage'];
  if (img) {
    drawSheetChar(img, cx, cy, 'D', { scale: WORLD_SCALE, ground: TILE_GROUND });
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
