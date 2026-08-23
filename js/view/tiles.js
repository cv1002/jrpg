// ============================================================
// view/tiles.js —— 图块缓存
// ============================================================
import { T, TY } from '../data.js';
import { tileCanvas } from './canvas.js';
import { ready as atlasReady, sheets, blit16 } from './atlas.js';

const TILE = {};
const TILE_GRASS_VAR = [];
TILE[TY.GRASS]=tileCanvas(c=>{
  c.fillStyle='#367636'; c.fillRect(0,0,T,T);
  for(let i=0;i<30;i++){ c.fillStyle=i%2?'#428442':'#2f6b2f'; c.fillRect((i*37+3)%T,(i*23+5)%T,3,3); }
  c.fillStyle='#56a656'; c.fillRect(4,4,2,2); c.fillRect(26,22,2,2); c.fillRect(12,14,2,2);
  c.fillStyle='rgba(255,255,255,.10)'; c.fillRect(22,6,2,2);
  c.fillStyle='#e85f8a'; c.fillRect(24,4,2,2);              // 小花
  c.fillStyle='#f0e6c8'; c.fillRect(3,6,2,2);              // 卵石
  c.fillStyle='#d8e0f0'; c.fillRect(14,24,2,2);            // 露珠光点
});
TILE[TY.TREE]=tileCanvas(c=>{
  c.fillStyle='#2c5e2c'; c.fillRect(0,0,T,T);
  c.fillStyle='#255a25'; c.fillRect(0,18,32,14);
  c.fillStyle='rgba(0,0,0,.18)'; c.fillRect(8,24,16,6);    // 树影
  c.fillStyle='#5b3f22'; c.fillRect(14,18,5,10);           // 树干
  c.fillStyle='#704e2a'; c.fillRect(13,14,7,6);
  c.fillStyle='#1c6427'; c.beginPath(); c.arc(16,11,14,0,7); c.fill();
  c.fillStyle='#2f8f3f'; c.beginPath(); c.arc(15,8,11,0,7); c.fill();
  c.fillStyle='#3fae4f'; c.beginPath(); c.arc(13,6,7,0,7); c.fill();
  c.fillStyle='#63d177'; c.beginPath(); c.arc(20,4,4,0,7); c.fill();   // 受光面
  c.fillStyle='rgba(255,255,255,.12)'; c.fillRect(12,3,3,2);
});
TILE[TY.ROCK]=tileCanvas(c=>{
  c.fillStyle='#3a7d3a'; c.fillRect(0,0,T,T);
  c.fillStyle='rgba(0,0,0,.22)'; c.fillRect(4,24,24,6);    // 阴影
  c.fillStyle='#545c64'; c.fillRect(4,16,26,10);
  c.fillStyle='#646c74'; c.fillRect(6,9,22,9);
  c.fillStyle='#7a828a'; c.fillRect(9,3,16,8);
  c.fillStyle='#8f99a3'; c.fillRect(11,1,8,4);
  c.fillStyle='#a6b0ba'; c.fillRect(11,1,4,2);             // 高光
  c.strokeStyle='#414950'; c.lineWidth=1; c.beginPath(); c.moveTo(11,17); c.lineTo(16,13); c.lineTo(13,7); c.stroke();  // 裂缝
});
TILE[TY.WATER]=tileCanvas(c=>{
  c.fillStyle='#1f5a92'; c.fillRect(0,0,T,T);
  c.fillStyle='#2a6fb0'; c.fillRect(0,0,32,32);
  c.fillStyle='#3a84c4'; c.fillRect(3,6,12,3); c.fillRect(17,16,12,3); c.fillRect(6,24,10,3);
  c.fillStyle='#62c6ff'; c.fillRect(3,7,8,1); c.fillRect(17,17,8,1); c.fillRect(6,25,6,1);  // 波光
  c.fillStyle='#174a77'; c.fillRect(0,0,32,2); c.fillRect(0,30,32,2);
});
TILE[TY.TOWN]=tileCanvas(c=>{
  c.fillStyle='#8f8572'; c.fillRect(0,0,T,T);
  c.fillStyle='#9a8f77'; c.fillRect(0,0,32,32);
  for(let i=0;i<8;i++){ c.fillStyle=i%2?'#a89b80':'#847963'; c.fillRect((i*4)%T,(i*7)%T,4,4); }
  c.strokeStyle='rgba(60,50,36,.35)'; c.lineWidth=1; c.beginPath(); c.moveTo(0,8); c.lineTo(32,8); c.moveTo(0,24); c.lineTo(32,24); c.stroke();  // 地板缝
});
TILE[TY.PATH]=tileCanvas(c=>{
  c.fillStyle='#7d6a4a'; c.fillRect(0,0,T,T);
  c.fillStyle='#8a7755'; c.fillRect(2,2,28,28);
  c.fillStyle='#9a8a66'; c.fillRect(5,9,9,4); c.fillRect(19,19,9,4);
  c.fillStyle='#6a5940'; c.fillRect(0,0,32,2); c.fillRect(0,0,2,32); c.fillRect(30,0,2,32); c.fillRect(0,30,32,2);  // 边缘暗化
  c.fillStyle='rgba(255,255,255,.06)'; c.fillRect(2,2,28,1);
});
TILE[TY.CHEST]=tileCanvas(c=>{
  c.fillStyle='#8a6508'; c.fillRect(6,4,20,18);
  c.fillStyle='#b8860b'; c.fillRect(5,6,22,16);
  c.fillStyle='#d4a017'; c.fillRect(5,6,22,4);
  c.strokeStyle='#8a6508'; c.lineWidth=1; c.strokeRect(7,7,18,14);
  c.fillStyle='#e8c33a'; c.fillRect(16,6,4,16);
  c.fillStyle='#8a6508'; c.fillRect(10,14,12,2);
  c.fillStyle='#fff3c4'; c.fillRect(7,8,4,2);
  c.fillStyle='#ffe94a'; c.fillRect(30,2,2,2);
});
let TILE_CHEST_OPEN=tileCanvas(c=>{
  c.fillStyle='#8a6508'; c.fillRect(6,14,20,10);
  c.fillStyle='#b8860b'; c.fillRect(5,15,22,9);
  c.fillStyle='#3a2410'; c.fillRect(8,16,16,6);
  c.fillStyle='#d4a017'; c.fillRect(5,4,22,8);
  c.fillStyle='#8a6508'; c.fillRect(6,4,20,2);
  c.fillStyle='#e8c33a'; c.fillRect(15,14,2,8);
});
TILE[TY.FOUNTAIN]=tileCanvas(c=>{
  c.fillStyle='#7d6a4a'; c.fillRect(0,0,T,T);
  c.fillStyle='rgba(0,0,0,.25)'; c.fillRect(6,22,20,4);
  c.fillStyle='#8a8577'; c.fillRect(6,16,20,8);
  c.fillStyle='#9a9587'; c.fillRect(4,12,24,6);
  c.fillStyle='#6f6a5c'; c.fillRect(4,18,24,4);
  c.fillStyle='#3e86c8'; c.fillRect(10,8,12,8);            // 池水
  c.fillStyle='#62c6ff'; c.fillRect(11,9,7,2);
  c.fillStyle='#9fe8ff'; c.fillRect(8,10,2,2);             // 水花
  c.fillStyle='#dff6ff'; c.fillRect(15,4,2,3);             // 喷涌
});
TILE[TY.BOSS]=tileCanvas(c=>{
  c.fillStyle='#2c5e2c'; c.fillRect(0,0,T,T);
  c.fillStyle='rgba(0,0,0,.25)'; c.fillRect(2,22,28,5);
  c.strokeStyle='#c06fef'; c.lineWidth=2; c.beginPath(); c.arc(16,16,12,0,7); c.stroke();
  c.beginPath(); c.moveTo(16,2); c.lineTo(16,30); c.moveTo(2,16); c.lineTo(30,16); c.stroke();
  c.fillStyle='#c06fef'; c.beginPath(); c.arc(16,16,5,0,7); c.fill();
  c.fillStyle='#f0c8ff'; c.beginPath(); c.arc(16,16,2,0,7); c.fill();
  c.fillStyle='rgba(192,111,239,.18)'; c.beginPath(); c.arc(16,16,16,0,7); c.fill();  // 光晕
});
TILE[TY.SHOP]=tileCanvas(c=>{
  c.fillStyle='#56482e'; c.fillRect(0,0,T,T);
  c.fillStyle='#6b5b3e'; c.fillRect(1,1,30,30);
  c.fillStyle='#7d6b49'; c.beginPath(); c.moveTo(4,26); c.lineTo(4,10); c.lineTo(16,3); c.lineTo(28,10); c.lineTo(28,26); c.fill();
  c.fillStyle='#96834f'; c.fillRect(6,15,20,11);           // 门面
  c.strokeStyle='#4a3c22'; c.lineWidth=2; c.strokeRect(9,11,14,15);
  c.fillStyle='#543c1e'; c.fillRect(11,17,10,9);           // 门
  c.fillStyle='#e8c33a'; c.fillRect(15,21,2,3);            // 门环
  c.fillStyle='rgba(255,255,255,.10)'; c.fillRect(5,4,22,1);  // 檐线
});
TILE[TY.INN]=tileCanvas(c=>{
  c.fillStyle='#35404f'; c.fillRect(0,0,T,T);
  c.fillStyle='#4a5568'; c.fillRect(2,4,28,24);
  c.fillStyle='#5b6878'; c.fillRect(0,0,32,6);             // 屋顶檐
  c.fillStyle='#8a9ab0'; c.fillRect(0,0,6,6);              // 屋顶角
  c.fillStyle='#7a8aa0'; c.fillRect(5,12,22,8);
  c.fillStyle='#ffe9a8'; c.fillRect(9,13,14,6);            // 灯窗
  c.strokeStyle='#3a4350'; c.lineWidth=2; c.strokeRect(15,14,10,16);
  c.fillStyle='#3a4350'; c.fillRect(17,24,6,4);            // 门
  c.fillStyle='#ffd24a'; c.fillRect(9,18,2,2);             // 灯火
});
TILE[TY.GATE]=tileCanvas(c=>{
  c.fillStyle='#2f6b2f'; c.fillRect(0,0,T,T);
  c.fillStyle='#101c28'; c.fillRect(7,2,18,28);            // 门基座
  c.fillStyle='rgba(98,198,255,.25)'; c.fillRect(9,4,14,24); // 内晕
  c.fillStyle='#62c6ff'; c.beginPath(); c.arc(16,16,9,0,7); c.fill();  // 漩涡
  c.fillStyle='#7dd3ff'; c.beginPath(); c.arc(16,16,6,0,7); c.fill();
  c.fillStyle='#e8faff'; c.beginPath(); c.arc(16,16,3,0,7); c.fill();
  c.strokeStyle='#2488c8'; c.lineWidth=1; c.beginPath(); c.arc(16,16,11,0,7); c.stroke();
});
TILE[TY.EXIT]=tileCanvas(c=>{
  c.fillStyle='#2f6b2f'; c.fillRect(0,0,T,T);
  c.fillStyle='#14222e'; c.fillRect(6,4,16,24);            // 门框
  c.fillStyle='#2f8f3f'; c.fillRect(16,8,12,18);           // 拱侧植被
  c.fillStyle='#ffd24a'; c.beginPath(); c.moveTo(24,26); c.lineTo(20,10); c.lineTo(16,20); c.lineTo(12,10); c.lineTo(8,26); c.closePath(); c.fill();  // 出口标
  c.fillStyle='#5b8a5b'; c.fillRect(18,4,10,4);            // 顶部叶
});
TILE[TY.NPC]=tileCanvas(c=>{
  c.fillStyle='#3a7d3a'; c.fillRect(0,0,T,T);
  c.fillStyle='rgba(0,0,0,.20)'; c.fillRect(9,22,14,5);    // 脚下阴影
  c.fillStyle='#e0c9a0'; c.fillRect(11,7,10,10);           // 脸
  c.fillStyle='#c8b088'; c.fillRect(10,13,12,11);          // 袍
  c.fillStyle='#f4f4f2'; c.fillRect(12,4,8,4);             // 白发
  c.fillStyle='#f4f4f2'; c.fillRect(8,6,16,3);            // 胡须
  c.fillStyle='#222'; c.fillRect(13,9,2,2); c.fillRect(17,9,2,2);
  c.fillStyle='#8a5a2b'; c.fillRect(10,12,12,2);           // 腰带
  c.fillStyle='#6b4a1e'; c.fillRect(24,10,3,8);            // 手杖
  c.fillStyle='#ffd24a'; c.fillRect(25,8,2,2);             // 杖头宝珠
});
TILE[TY.BREW]=tileCanvas(c=>{
  c.fillStyle='#8a7755'; c.fillRect(0,0,T,T);
  c.fillStyle='rgba(0,0,0,.22)'; c.fillRect(8,20,16,5);
  c.fillStyle='#3a2f22'; c.beginPath(); c.ellipse(16,22,11,4,0,0,7); c.fill();
  c.fillStyle='#5a4a34'; c.fillRect(7,9,18,13); c.beginPath(); c.ellipse(16,9,9,4,0,0,7); c.fill();
  c.fillStyle='#8fd86f'; c.beginPath(); c.ellipse(16,9,6,3,0,0,7); c.fill();   // 药液
  c.fillStyle='#b8f09a'; c.beginPath(); c.ellipse(13,8,2,1.2,0,0,7); c.fill(); // 液面高光
  c.strokeStyle='#2a2016'; c.lineWidth=2; c.beginPath(); c.moveTo(7,9); c.lineTo(5,5); c.moveTo(25,9); c.lineTo(27,5); c.stroke();
  c.fillStyle='#8fd86f'; c.beginPath(); c.arc(14,4,2,0,7); c.fill();           // 冒泡
  c.fillStyle='#b8f09a'; c.beginPath(); c.arc(21,3,2,0,7); c.fill();
});
TILE[TY.MB]=tileCanvas(c=>{
  c.fillStyle='#202c38'; c.fillRect(0,0,T,T);
  c.fillStyle='rgba(95,216,255,.12)'; c.beginPath(); c.arc(16,16,15,0,7); c.fill();
  c.strokeStyle='#5fd8ff'; c.lineWidth=2; c.beginPath(); c.arc(16,16,12,0,7); c.stroke();
  c.beginPath(); c.moveTo(16,2); c.lineTo(16,30); c.moveTo(2,16); c.lineTo(30,16); c.stroke();
  c.fillStyle='#2f8fe1'; c.beginPath(); c.arc(16,16,5,0,7); c.fill();
  c.fillStyle='#9ff0ff'; c.beginPath(); c.arc(16,16,2,0,7); c.fill();
});
TILE[TY.SB]=tileCanvas(c=>{
  c.fillStyle='#1a2330'; c.fillRect(0,0,T,T);
  c.fillStyle='rgba(255,233,74,.12)'; c.beginPath(); c.arc(16,16,14,0,7); c.fill();
  c.fillStyle='rgba(255,220,140,.8)'; c.beginPath(); c.moveTo(16,3); c.lineTo(23,14); c.lineTo(16,27); c.lineTo(9,14); c.fill();
  c.fillStyle='#ffe94a'; c.beginPath(); c.moveTo(16,7); c.lineTo(20,14); c.lineTo(16,23); c.lineTo(12,14); c.fill();
  c.fillStyle='#ffd24a'; c.beginPath(); c.moveTo(16,10); c.lineTo(17.5,14); c.lineTo(16,19); c.lineTo(14.5,14); c.fill();
  c.fillStyle='#ffffcc'; c.beginPath(); c.arc(16,14,3,0,7); c.fill();
});
TILE[TY.TRIAL]=tileCanvas(c=>{
  c.fillStyle='#202c38'; c.fillRect(0,0,T,T);
  c.fillStyle='rgba(79,216,255,.10)'; c.beginPath(); c.arc(16,16,13,0,7); c.fill();
  c.fillStyle='#4a5a6d'; c.fillRect(8,6,16,4);             // 碑顶
  c.fillStyle='#5a6a7d'; c.fillRect(10,10,12,18);
  c.fillStyle='#8a9ab0'; c.fillRect(12,12,8,14);
  c.fillStyle='#ffd24a'; c.font='bold 9px sans-serif'; c.textAlign='center'; c.fillText('试',16,18);
  c.fillStyle='#c06fef'; c.font='bold 6px sans-serif'; c.fillText('B',16,28);
});
TILE[TY.STELE]=tileCanvas(c=>{
  c.fillStyle='#141a24'; c.fillRect(0,0,T,T);
  c.fillStyle='rgba(158,180,200,.10)'; c.beginPath(); c.arc(16,20,13,0,7); c.fill();
  c.fillStyle='#3f4a58'; c.fillRect(9,8,14,20);            // 碑身
  c.fillStyle='#525e6e'; c.fillRect(9,8,14,3);             // 碑沿
  c.fillStyle='#525e6e'; c.beginPath(); c.arc(16,9,7,Math.PI,0); c.fill(); // 圆顶
  c.fillStyle='rgba(158,180,200,.5)'; c.fillRect(12,14,8,1); c.fillRect(12,18,8,1); c.fillRect(12,22,6,1); // 无名刻痕
  c.fillStyle='#2a3440'; c.fillRect(7,26,18,3);            // 基座
  c.fillStyle='rgba(255,220,140,.35)'; c.fillRect(15,15,2,2); // 温的一点
});
TILE[TY.CAVE]=tileCanvas(c=>{
  c.fillStyle='#2a2f38'; c.fillRect(0,0,T,T);
  c.fillStyle='#333a45'; c.fillRect(3,3,6,4); c.fillRect(20,14,7,5); c.fillRect(9,24,8,5);   // 岩块肌理
  c.fillStyle='#3a4250'; c.fillRect(1,1,5,3);
  c.fillStyle='rgba(0,0,0,.25)'; c.fillRect(12,9,5,3);
  c.fillStyle='rgba(95,216,255,.22)'; c.fillRect(6,18,2,2); c.fillRect(26,6,2,2); c.fillRect(15,4,2,2);  // 荧光晶尘
});
TILE[TY.CAVEWALL]=tileCanvas(c=>{
  c.fillStyle='#14181f'; c.fillRect(0,0,T,T);
  c.fillStyle='#1c222c'; c.fillRect(0,0,32,32);
  c.fillStyle='#262d3a'; c.fillRect(1,8,9,7); c.fillRect(21,17,10,10); c.fillRect(24,2,6,6);   // 岩块
  c.fillStyle='#0e1218'; c.fillRect(0,28,32,4);
  c.strokeStyle='rgba(0,0,0,.4)'; c.lineWidth=1; c.beginPath(); c.moveTo(0,22); c.lineTo(9,18); c.lineTo(18,21); c.lineTo(32,15); c.stroke();  // 层理
  c.fillStyle='rgba(95,216,255,.15)'; c.fillRect(14,6,3,2); c.fillRect(28,24,2,2);            // 荧光矿物
});

function punyCanvas(paint) {
  return tileCanvas((c) => {
    c.imageSmoothingEnabled = false;
    paint(c);
  });
}

function applyPunyTiles() {
  const W = sheets.world;
  const D = sheets.dungeon;
  if (!W || !D) return;
  const w = (c, r) => (ctx) => blit16(ctx, W, c, r);
  const d = (c, r) => (ctx) => blit16(ctx, D, c, r);
  const bake = (paint) => punyCanvas(paint);

  TILE_GRASS_VAR.length = 0;
  for (const pos of [[1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2]]) {
    TILE_GRASS_VAR.push(bake(w(pos[0], pos[1])));
  }
  TILE[TY.GRASS] = TILE_GRASS_VAR[0] || bake(w(1, 0));
  TILE[TY.PATH] = bake(w(22, 27));
  TILE[TY.TOWN] = bake(w(16, 26));
  TILE[TY.WATER] = bake(w(22, 11));
  TILE[TY.TREE] = bake((ctx) => {
    blit16(ctx, W, 1, 0);
    const tree = sheets.tree;
    if (tree) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(tree, 0, 0, 16, 16, 0, 0, T, T);
    } else {
      blit16(ctx, W, 1, 8);
    }
  });
  TILE[TY.ROCK] = bake(d(19, 6));
  TILE[TY.NPC] = bake(w(1, 0));
  TILE[TY.CHEST] = bake(d(21, 18));
  TILE_CHEST_OPEN = bake(d(22, 18));
  TILE[TY.FOUNTAIN] = bake((ctx) => {
    blit16(ctx, W, 22, 27);
    blit16(ctx, W, 22, 11, 8, 8, 16, 16);
  });
  TILE[TY.SHOP] = bake(w(15, 34));
  TILE[TY.INN] = bake(w(12, 34));
  TILE[TY.BREW] = bake(d(23, 19));
  TILE[TY.GATE] = bake(d(16, 9));
  TILE[TY.EXIT] = bake(d(16, 9));
  TILE[TY.BOSS] = bake(d(16, 11));
  TILE[TY.MB] = bake(d(16, 11));
  TILE[TY.SB] = bake(d(16, 9));
  TILE[TY.TRIAL] = bake(d(19, 17));
  TILE[TY.CAVE] = bake(d(1, 1));
  TILE[TY.CAVEWALL] = bake(d(3, 11));
  // 名字石碑（MiniWorld Tombstones，CC0）：无字回廊 STELE 瓦片
  const TB = sheets.mwTomb;
  if (TB) TILE[TY.STELE] = bake((ctx) => blit16(ctx, TB, 0, 0));
}

atlasReady.then((ok) => { if (ok) applyPunyTiles(); });

const TILE_PROP = new Set([
  TY.CHEST, TY.EXIT, TY.GATE, TY.ROCK, TY.BOSS, TY.BREW,
  TY.FOUNTAIN, TY.SHOP, TY.INN, TY.MB, TY.SB, TY.TRIAL, TY.STELE,
]);

export { TILE, TILE_PROP, TILE_GRASS_VAR, TILE_CHEST_OPEN };
