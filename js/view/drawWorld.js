// ============================================================
// view/drawWorld.js —— 大地图绘制
// ============================================================
import { S } from '../state.js';
import { T, TY, NPC_SPOTS, NPCS, SOLID, MAPS } from '../data.js';
import { at, MBounds, dangerAt, facingCell, portalDest } from '../world.js';
import { npcQuestMark } from '../quests.js';
import { CV, CTX, rr, text } from './canvas.js';
import { TILE, TILE_PROP, TILE_GRASS_VAR, TILE_CHEST_OPEN } from './tiles.js';
import { drawHero, drawNpcSprite, charDestBox } from './sprites.js';

export function heroDrawPos() {
  const hero = S.G;
  const walk = S.walk;
  if (walk) {
    const t = Math.min(1, (Date.now() - walk.t0) / walk.dur);
    const ease = t * t * (3 - 2 * t);
    if (t >= 1) S.walk = null;
    return {
      x: (walk.ox + (walk.nx - walk.ox) * ease) * T,
      y: (walk.oy + (walk.ny - walk.oy) * ease) * T,
    };
  }
  return { x: hero.x * T, y: hero.y * T };
}

export function cam() {
  const bounds = MBounds();
  const pos = heroDrawPos();
  return {
    x: Math.round(Math.max(0, Math.min(bounds.w * T - CV.width, pos.x - CV.width / 2 + T / 2))),
    y: Math.round(Math.max(0, Math.min(bounds.h * T - CV.height, pos.y - CV.height / 2 + T / 2))),
  };
}

function timeOfDay() {
  const t = (S.G && S.G.time) || 0;
  return ['day', 'dusk', 'night', 'dawn'][Math.floor(t / 90) % 4];
}

function drawTimeTint() {
  const t = timeOfDay();
  if (t === 'dusk') CTX.fillStyle = 'rgba(255,140,60,.18)';
  else if (t === 'night') CTX.fillStyle = 'rgba(20,22,90,.35)';
  else if (t === 'dawn') CTX.fillStyle = 'rgba(255,215,160,.15)';
  else CTX.fillStyle = 'rgba(255,255,255,0)';
  CTX.fillRect(0, 0, CV.width, CV.height);
}

function drawWeather() {
  if (S.curMap === 'dungeon') {
    const seed = Math.floor(Date.now() / 40);
    CTX.strokeStyle = 'rgba(170,200,255,.35)';
    CTX.lineWidth = 1;
    for (let i = 0; i < 46; i++) {
      const x = (i * 97 + seed * 5) % CV.width;
      const y = (i * 53 + seed * 13) % CV.height;
      CTX.beginPath();
      CTX.moveTo(x, y);
      CTX.lineTo(x - 4, y + 9);
      CTX.stroke();
    }
  }
  if (S.curMap === 'cave') {
    const seed = Math.floor(Date.now() / 80);
    for (let i = 0; i < 28; i++) {
      const x = (i * 73 + seed * 3) % CV.width;
      const y = (i * 41 + seed * 7) % CV.height;
      CTX.fillStyle = `rgba(95,216,255,${0.15 + 0.25 * (i % 3) / 3})`;
      CTX.fillRect(x, y, 2, 2);
    }
  }
}

function drawTileFx(ty, px, py) {
  const ph = Date.now() / 400;
  if (ty === TY.WATER) {
    CTX.fillStyle = 'rgba(158,232,255,' + (0.18 + 0.12 * Math.sin(ph + px * 0.01)) + ')';
    CTX.fillRect(px + 4, py + 6 + (Math.sin(ph) * 2 | 0), 10, 2);
    CTX.fillRect(px + 16, py + 18, 10, 2);
  }
  if (ty === TY.FOUNTAIN) {
    CTX.fillStyle = 'rgba(223,246,255,' + (0.4 + 0.4 * Math.sin(ph * 2)) + ')';
    CTX.fillRect(px + 15, py + 2, 2, 4);
  }
  if (ty === TY.CAVE || ty === TY.SB) {
    CTX.fillStyle = `rgba(95,216,255,${0.2 + 0.2 * Math.sin(ph + px)})`;
    CTX.fillRect(px + 6, py + 8, 2, 2);
  }
}

const ALTAR_TAG = [
  { t: TY.BOSS, done: (g) => g && g.bossDefeated, lv: 8 },
  { t: TY.MB, done: (g) => g && g.caveBoss, lv: 7 },
  { t: TY.SB, done: (g) => g && g.trueBoss, lv: 12 },
];

function faceHint() {
  if (!S.G || S.scene !== 'world') return;
  const { x, y, tile } = facingCell();
  let lab = null;
  if (tile === TY.NPC) {
    const nid = NPC_SPOTS[x + ',' + y];
    const nm = (nid && NPCS[nid]) ? NPCS[nid].name : '';
    lab = nm ? ('⏎ 对话 · ' + nm) : '⏎ 对话';
  } else if (tile === TY.SHOP) lab = '⏎ 商店';
  else if (tile === TY.INN) lab = '⏎ 旅馆';
  else if (tile === TY.BREW) lab = '⏎ 酿造';
  else if (tile === TY.FOUNTAIN) {
    const fh = S.G;
    const needHp = Math.max(0, (fh ? fh.hpMax : 0) - (fh ? fh.hp : 0));
    const needMp = Math.max(0, (fh ? fh.mpMax : 0) - (fh ? fh.mp : 0));
    lab = (needHp === 0 && needMp === 0) ? '踩上回血 · 状态已满' : `踩上回血 · HP+${needHp} MP+${needMp}`;
  }
  else if (tile === TY.CHEST && !S.G.chests.has(x + ',' + y)) lab = '踩上开启';
  else if (tile === TY.BOSS && !S.G.bossDefeated) lab = '踩上开战';
  else if (tile === TY.MB && !S.G.caveBoss) lab = '踩上开战';
  else if (tile === TY.SB && !S.G.trueBoss) lab = '踩上触发';
  else if (tile === TY.TRIAL && S.G.bossDefeated && S.G.caveBoss) lab = '踩上挑战';
  else if (tile === TY.GATE && !(S.curMap === 'village' && S.G.bossDefeated)) {
    const dest = portalDest(S.curMap, TY.GATE);
    lab = (dest && MAPS[dest]) ? `踩上通行 → ${MAPS[dest].name}` : '踩上通行';
  }
  else if (tile === TY.EXIT) {
    const dest = portalDest(S.curMap, TY.EXIT);
    lab = (dest && MAPS[dest]) ? `踩上通行 → ${MAPS[dest].name}` : '踩上通行';
  }
  if (!lab) return;
  const c = cam();
  const px = x * T - c.x + T / 2;
  const tileTop = y * T - c.y;
  CTX.font = 'bold 12px sans-serif';
  const w = CTX.measureText(lab).width + 14;
  const h = 18;
  let lx = px - w / 2;
  let ly = tileTop - 26;
  const hp = heroDrawPos();
  const heroBox = charBodyBox(hp.x - c.x + T / 2, hp.y - c.y + T / 2);
  if (rectsOverlap({ x: lx, y: ly, w, h }, heroBox)) {
    if (tile === TY.NPC) {
      const npc = charDestBox(px, y * T - c.y + T / 2);
      const extra = npcQuestMark(S.G, NPC_SPOTS[x + ',' + y]) ? 20 : 0;
      lx = npc.x + npc.w / 2 - w / 2;
      ly = npc.y + npc.h + 4 + extra;
    } else {
      ly = tileTop + T + 4;
    }
  }
  CTX.fillStyle = 'rgba(10,16,24,.82)';
  rr(lx, ly, w, h, 4);
  CTX.fill();
  CTX.strokeStyle = 'rgba(255,210,74,.55)';
  CTX.lineWidth = 1;
  rr(lx, ly, w, h, 4);
  CTX.stroke();
  CTX.fillStyle = '#ffe9a8';
  CTX.textAlign = 'center';
  CTX.fillText(lab, lx + w / 2, ly + 13);
  CTX.textAlign = 'left';
}

function charBodyBox(cx, cy) {
  const d = charDestBox(cx, cy);
  const bw = 28;
  const bh = 34;
  return {
    x: d.x + Math.round((d.w - bw) / 2),
    y: d.y + 10,
    w: bw,
    h: bh,
  };
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function drawQuestMark(qm, tx, ty) {
  const c = cam();
  const pulse = Math.floor(Date.now() / 320) % 2 === 0;
  CTX.font = 'bold 11px sans-serif';
  const bw = CTX.measureText(qm).width + 14;
  const bh = 16;
  const px = tx * T - c.x + T / 2;
  const tileTop = ty * T - c.y;
  let bx = px - bw / 2;
  let by = tileTop - 20;
  const hp = heroDrawPos();
  const heroBox = charBodyBox(hp.x - c.x + T / 2, hp.y - c.y + T / 2);
  if (rectsOverlap({ x: bx, y: by, w: bw, h: bh }, heroBox)) {
    const npc = charDestBox(px, ty * T - c.y + T / 2);
    bx = npc.x + npc.w / 2 - bw / 2;
    by = npc.y + npc.h + 4;
  }
  CTX.fillStyle = pulse ? 'rgba(226,115,48,.95)' : 'rgba(150,72,20,.95)';
  rr(bx, by, bw, bh, 8);
  CTX.fill();
  CTX.strokeStyle = 'rgba(255,210,74,.7)';
  CTX.lineWidth = 1;
  rr(bx, by, bw, bh, 8);
  CTX.stroke();
  CTX.fillStyle = '#fff';
  CTX.textAlign = 'center';
  CTX.fillText(qm, bx + bw / 2, by + 12);
  CTX.textAlign = 'left';
}

function minimapColor(tile, hero, x, y) {
  if (tile === TY.TREE || tile === TY.ROCK) return '#1f4d1f';
  if (tile === TY.WATER) return '#22568a';
  if (tile === TY.TOWN || tile === TY.PATH) return '#7d6b49';
  if (tile === TY.BOSS) return '#a03fd9';
  if (tile === TY.SHOP) return '#ffd24a';
  if (tile === TY.INN) return '#7a8aa0';
  if (tile === TY.FOUNTAIN) return '#62c6ff';
  if (tile === TY.BREW) return '#8fd86f';
  if (tile === TY.NPC) return '#e8c9a0';
  if (tile === TY.MB) return (hero && hero.caveBoss) ? '#39414f' : '#b06ff0';
  if (tile === TY.SB) return (hero && hero.trueBoss) ? '#39414f' : '#ffe94a';
  if (tile === TY.TRIAL) return '#4fd8ff';
  if (tile === TY.CAVE) return '#39414f';
  if (tile === TY.CAVEWALL) return '#151a22';
  if (tile === TY.GATE || tile === TY.EXIT) return '#4a90d9';
  const pulseChest = tile === TY.CHEST && hero
    && ((hero.quests && hero.quests.side_mushroom === 'active') || hero.caveBoss)
    && !hero.chests.has(x + ',' + y);
  if (pulseChest) return (Math.floor(Date.now() / 400) % 2 === 0) ? '#ffd24a' : '#8a5a00';
  return '#2f6b2f';
}

function drawMinimap() {
  try {
    const hero = S.G;
    const bounds = MBounds();
    const mw = Math.min(120, bounds.w * 3);
    const mh = Math.min(90, bounds.h * 3);
    const mx = CV.width - mw - 8;
    const my = 8;
    const sx = mw / bounds.w;
    const sy = mh / bounds.h;
    CTX.fillStyle = 'rgba(10,16,24,.72)';
    CTX.fillRect(mx, my, mw, mh);
    let danger = 0;
    let walkable = 0;
    for (let y = 0; y < bounds.h; y++) {
      for (let x = 0; x < bounds.w; x++) {
        const tile = at(x, y);
        CTX.fillStyle = minimapColor(tile, hero, x, y);
        CTX.fillRect(mx + x * sx, my + y * sy, Math.max(2, sx), Math.max(2, sy));
        if (dangerAt(x, y)) danger++;
        if (!SOLID.has(tile)) walkable++;
      }
    }
    if (danger > 0 && danger <= walkable * 0.5) {
      CTX.fillStyle = 'rgba(255,92,92,.85)';
      for (let y = 0; y < bounds.h; y++) {
        for (let x = 0; x < bounds.w; x++) {
          if (!dangerAt(x, y)) continue;
          CTX.fillRect(mx + x * sx + Math.max(1, sx * 0.3), my + y * sy, Math.max(1, sx * 0.4), Math.max(1, sy * 0.5));
        }
      }
    }
    CTX.fillStyle = '#ffd24a';
    CTX.beginPath();
    CTX.arc(mx + hero.x * sx, my + hero.y * sy, 3, 0, 7);
    CTX.fill();
    // 遇敌槽：色带 + 百分比读数（深底高对比，避免叠在地砖上发灰）
    const encPct = Math.max(0, Math.min(100, S.encGauge || 0));
    const encDanger = encPct >= 70;
    CTX.fillStyle = 'rgba(10,16,24,.9)';
    CTX.fillRect(mx, my + mh + 3, mw, 6);
    CTX.fillStyle = encDanger && (Math.floor(Date.now() / 330) % 2 === 0) ? '#ff8a5b' : '#e14b3f';
    CTX.fillRect(mx, my + mh + 3, mw * (encPct / 100), 6);
    const encLab = `遇敌 ${Math.round(encPct)}%${encDanger ? ' ⚠️ 危险逼近' : ''}`;
    CTX.font = 'bold 12px sans-serif';
    const encW = Math.max(mw, Math.ceil(CTX.measureText(encLab).width) + 16);
    const encX = mx + mw - encW;
    CTX.fillStyle = 'rgba(10,16,24,.9)';
    rr(encX, my + mh + 11, encW, 18, 4);
    CTX.fill();
    CTX.strokeStyle = encDanger ? 'rgba(255,138,91,.7)' : 'rgba(255,210,74,.45)';
    CTX.lineWidth = 1;
    rr(encX, my + mh + 11, encW, 18, 4);
    CTX.stroke();
    text(encLab, encX + encW / 2, my + mh + 24, 'bold 12px', encDanger ? '#ff9d6b' : '#ffe9a8', 'center');
    CTX.textAlign = 'left';
  } catch (e) {}
}

function cellBase(ty, x, y) {
  if (S.curMap === 'cave') {
    return ty === TY.CAVEWALL ? TILE[TY.CAVEWALL] : TILE[TY.CAVE];
  }
  if (ty === TY.TREE || ty === TY.WATER) return TILE[ty];
  if (ty === TY.TOWN || ty === TY.SHOP || ty === TY.INN) return TILE[TY.TOWN];
  if (ty === TY.PATH || ty === TY.BREW || ty === TY.FOUNTAIN) return TILE[TY.PATH];
  if (ty === TY.CAVE) return TILE[TY.CAVE];
  if (ty === TY.CAVEWALL) return TILE[TY.CAVEWALL];
  const n = TILE_GRASS_VAR.length;
  if (n) return TILE_GRASS_VAR[(x * 19 + y * 37) % n];
  return TILE[TY.GRASS];
}

export function drawWorld() {
  if (!S.maze || !S.G) return;
  CTX.imageSmoothingEnabled = false;
  CTX.clearRect(0, 0, CV.width, CV.height);
  const c = cam();
  const x0 = Math.floor(c.x / T);
  const y0 = Math.floor(c.y / T);
  const x1 = Math.min(S.maze[0].length - 1, x0 + Math.ceil(CV.width / T) + 1);
  const y1 = Math.min(S.maze.length - 1, y0 + Math.ceil(CV.height / T) + 1);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const ty = at(x, y);
      const px = x * T - c.x;
      const py = y * T - c.y;
      const base = cellBase(ty, x, y);
      if (base) CTX.drawImage(base, px, py);
      const openedChest = ty === TY.CHEST && S.G.chests.has(x + ',' + y);
      const hideProp = (ty === TY.BOSS && S.G.bossDefeated)
        || (ty === TY.MB && S.G.caveBoss)
        || (ty === TY.SB && S.G.trueBoss);
      if (openedChest && TILE_CHEST_OPEN) CTX.drawImage(TILE_CHEST_OPEN, px, py);
      else if (TILE_PROP.has(ty) && TILE[ty] && !hideProp) CTX.drawImage(TILE[ty], px, py);
      drawTileFx(ty, px, py);
    }
  }
  if (S.G && S.curMap !== 'village') {
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const t = at(x, y);
        for (const altar of ALTAR_TAG) {
          if (t !== altar.t || altar.done(S.G)) continue;
          if (at(x, y - 1) === altar.t || at(x - 1, y) === altar.t) continue;
          const s = '⚠ Lv.' + altar.lv;
          CTX.font = 'bold 12px sans-serif';
          const w = CTX.measureText(s).width + 14;
          const lx = x * T - c.x + T / 2 - w / 2;
          const ly = y * T - c.y - 21;
          CTX.fillStyle = 'rgba(122,22,38,.92)';
          rr(lx, ly, w, 18, 4);
          CTX.fill();
          CTX.strokeStyle = 'rgba(0,0,0,.5)';
          CTX.lineWidth = 1;
          rr(lx, ly, w, 18, 4);
          CTX.stroke();
          CTX.fillStyle = '#ffd24a';
          CTX.textAlign = 'center';
          CTX.fillText(s, lx + w / 2, ly + 13);
        }
      }
    }
    CTX.textAlign = 'left';
  }
  if (S.G && S.curMap === 'cave') {
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        if (at(x, y) !== TY.TRIAL) continue;
        const ready = !!(S.G.bossDefeated && S.G.caveBoss);
        const lab = ready ? '⚔️ 试炼·可挑战' : '试炼·未解锁';
        const lx = x * T - c.x + T / 2;
        const ly = y * T - c.y;
        CTX.font = 'bold 12px sans-serif';
        const w = CTX.measureText(lab).width + 12;
        CTX.fillStyle = ready ? 'rgba(45,150,82,.92)' : 'rgba(145,120,65,.92)';
        rr(lx - w / 2, ly - 22, w, 17, 4);
        CTX.fill();
        CTX.fillStyle = '#fff';
        CTX.textAlign = 'center';
        CTX.fillText(lab, lx, ly - 9);
      }
    }
    CTX.textAlign = 'left';
  }
  const actors = [];
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (at(x, y) !== TY.NPC) continue;
      const nid = NPC_SPOTS[x + ',' + y];
      const mark = nid && NPCS[nid] && NPCS[nid].mark;
      const qm = npcQuestMark(S.G, nid);
      actors.push({
        y,
        draw: () => {
          drawNpcSprite(x * T - c.x + T / 2, y * T - c.y + T / 2, nid, mark);
          // NPC 可交互顶标（信息透明·纯显示）：有可接委托/可交任务时，
          // 头顶跳出脉冲「❕」，一眼知道该找谁说话，无需逐个试按 ⏎
          if (qm) {
            drawQuestMark(qm, x, y);
          }
        },
      });
    }
  }
  const hp = heroDrawPos();
  actors.push({
    y: hp.y / T,
    draw: () => drawHero(hp.x - c.x + T / 2, hp.y - c.y + T / 2, S.dir, S.anim),
  });
  actors.sort((a, b) => a.y - b.y);
  for (const a of actors) a.draw();
  faceHint();
  drawMinimap();
  drawWeather();
  drawTimeTint();
}

export { timeOfDay };
