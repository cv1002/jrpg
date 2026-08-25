// ============================================================
// view/drawWorld.js —— 大地图绘制
// ============================================================
import { S, curMap } from '../state.js';
import { T, TY, NPC_SPOTS, NPCS, SOLID, MAPS, SPECIES, ENCOUNTER, UI_PULSE_MS } from '../data.js';
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
  // 无字回廊：恒暗（不分昼夜），「被忘掉的地方没有晨昏」
  if (curMap() === 'gallery') {
    CTX.fillStyle = 'rgba(10,8,28,.42)';
    CTX.fillRect(0, 0, CV.width, CV.height);
    return;
  }
  const t = timeOfDay();
  if (t === 'dusk') CTX.fillStyle = 'rgba(255,140,60,.18)';
  else if (t === 'night') CTX.fillStyle = 'rgba(20,22,90,.35)';
  else if (t === 'dawn') CTX.fillStyle = 'rgba(255,215,160,.15)';
  else CTX.fillStyle = 'rgba(255,255,255,0)';
  CTX.fillRect(0, 0, CV.width, CV.height);
}

function drawWeather() {
  if (curMap() === 'dungeon') {
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
  if (curMap() === 'cave') {
    const seed = Math.floor(Date.now() / 80);
    for (let i = 0; i < 28; i++) {
      const x = (i * 73 + seed * 3) % CV.width;
      const y = (i * 41 + seed * 7) % CV.height;
      CTX.fillStyle = `rgba(95,216,255,${0.15 + 0.25 * (i % 3) / 3})`;
      CTX.fillRect(x, y, 2, 2);
    }
  }
  if (curMap() === 'gallery') {
    // 漂浮字符（纯显示）：被忘掉的名字的残屑，缓缓上浮
    const glyphs = '名灯雾井梦忆';
    const seed = Math.floor(Date.now() / 120);
    CTX.font = '10px sans-serif';
    for (let i = 0; i < 14; i++) {
      const x = (i * 89 + seed * 2) % CV.width;
      const y = (i * 61 + seed * 5) % CV.height;
      CTX.fillStyle = `rgba(158,180,220,${0.10 + 0.12 * (i % 3) / 3})`;
      CTX.fillText(glyphs[i % glyphs.length], x, y);
    }
    CTX.textAlign = 'left';
  }
}

function drawTileFx(ty, px, py, x, y) {
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
  // 确定性装饰（纯显示·零状态）：坐标哈希稀疏点缀——草地小花/草痕、路面石子；
  // 不进存档、不参与结算，洞窟 GRASS 已被 replaceTiles 换成 CAVE 故天然不触发
  const dh = (x * 19 + y * 37);
  if (ty === TY.GRASS) {
    if (dh % 29 === 0) { // 小花：白瓣黄心
      CTX.fillStyle = 'rgba(232,238,241,.85)';
      CTX.fillRect(px + 12, py + 9, 2, 2); CTX.fillRect(px + 16, py + 9, 2, 2);
      CTX.fillRect(px + 14, py + 7, 2, 2); CTX.fillRect(px + 14, py + 11, 2, 2);
      CTX.fillStyle = '#ffd24a';
      CTX.fillRect(px + 14, py + 9, 2, 2);
    } else if (dh % 29 === 11) { // 草痕
      CTX.fillStyle = 'rgba(20,60,20,.35)';
      CTX.fillRect(px + 8, py + 20, 2, 4); CTX.fillRect(px + 18, py + 14, 2, 4);
    }
  }
  if (ty === TY.PATH && dh % 17 === 0) { // 路面石子
    CTX.fillStyle = 'rgba(60,50,35,.4)';
    CTX.fillRect(px + 10, py + 12, 3, 2); CTX.fillRect(px + 20, py + 20, 2, 2);
  }
  // 村庄夜晚灯火（纯显示）：TOWN 格暖色窗光相位闪烁，呼应「灯」主题
  if (ty === TY.TOWN && curMap() === 'village' && timeOfDay() === 'night') {
    const w = dh % 5;
    if (w < 2) {
      const a = 0.35 + 0.3 * Math.sin(Date.now() / 300 + x * 1.7 + y * 2.3);
      CTX.fillStyle = `rgba(255,200,90,${a})`;
      CTX.fillRect(px + 9 + w * 8, py + 12, 3, 4);
    }
  }
}

// 祭坛 ⚠Lv 标签：推荐等级与战斗界 enemyLv 同读 data.js SPECIES[].lv
const ALTAR_TAG = [
  { t: TY.BOSS, done: (g) => g && g.bossDefeated, lv: SPECIES['幽冥魔王'].lv },
  { t: TY.MB, done: (g) => g && g.caveBoss, lv: SPECIES['洞窟领主'].lv },
  { t: TY.SB, done: (g) => g && g.trueBoss, lv: SPECIES['终焉之神'].lv },
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
  else if (tile === TY.STELE) lab = '⏎ 读碑 · 名字石碑';
  else if (tile === TY.FOUNTAIN) {
    const fh = S.G;
    const needHp = Math.max(0, (fh ? fh.hpMax : 0) - (fh ? fh.hp : 0));
    const needMp = Math.max(0, (fh ? fh.mpMax : 0) - (fh ? fh.mp : 0));
    lab = (needHp === 0 && needMp === 0) ? '踩上回血 · 状态已满' : `踩上回血 · HP+${needHp} MP+${needMp}`;
  }
  else if (tile === TY.CHEST && !S.G.chests.has(x + ',' + y)) lab = '踩上开启';
  else if (tile === TY.BOSS && !S.G.bossDefeated) lab = '踩上开战';
  else if (tile === TY.MB && (curMap() === 'gallery' || !S.G.caveBoss)) lab = '踩上开战';
  else if (tile === TY.SB && !S.G.trueBoss) lab = curMap() === 'gallery' ? '踩上开战' : '踩上开门';
  else if (tile === TY.TRIAL && S.G.bossDefeated && S.G.caveBoss) lab = '踩上挑战';
  else if (tile === TY.GATE && !(curMap() === 'village' && S.G.bossDefeated)) {
    const dest = portalDest(curMap(), TY.GATE);
    lab = (dest && MAPS[dest]) ? `踩上通行 → ${MAPS[dest].name}` : '踩上通行';
  }
  else if (tile === TY.EXIT) {
    const dest = portalDest(curMap(), TY.EXIT);
    lab = (dest && MAPS[dest]) ? `踩上通行 → ${MAPS[dest].name}` : '踩上通行';
  }
  if (!lab) return;
  const c = cam();
  const px = x * T - c.x + T / 2;
  const py = y * T - c.y + T / 2;
  const hp = heroDrawPos();
  const heroBox = charBodyBox(hp.x - c.x + T / 2, hp.y - c.y + T / 2);
  const anchor = tile === TY.NPC
    ? charBodyBox(px, py)
    : { x: x * T - c.x, y: y * T - c.y, w: T, h: T };
  let stacked = null;
  if (tile === TY.NPC) {
    const qm = npcQuestMark(S.G, NPC_SPOTS[x + ',' + y]);
    if (qm) {
      CTX.font = 'bold 11px sans-serif';
      const qmw = CTX.measureText(qm).width + 14;
      const qmh = 16;
      const qp = placeNear(anchor, qmw, qmh, [heroBox]);
      stacked = { x: qp.lx, y: qp.ly, w: qmw, h: qmh };
    }
  }
  CTX.font = 'bold 12px sans-serif';
  const w = CTX.measureText(lab).width + 14;
  const h = 18;
  const { lx, ly } = placeNear(anchor, w, h, [heroBox, stacked]);
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
  const bh = 30;
  return {
    x: d.x + Math.round((d.w - bw) / 2),
    y: d.y + 14,
    w: bw,
    h: bh,
  };
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

const LABEL_GAP = 2;

function placeNear(anchor, w, h, avoids) {
  const lx = Math.round(anchor.x + anchor.w / 2 - w / 2);
  const hits = (y) => {
    if (y + h < 2 || y > CV.height - 2) return true;
    const r = { x: lx, y, w, h };
    return (avoids || []).some((a) => a && rectsOverlap(r, a));
  };
  const ys = [anchor.y - h - LABEL_GAP];
  for (const a of avoids || []) {
    if (!a) continue;
    ys.push(a.y - h - LABEL_GAP);
    ys.push(a.y + a.h + LABEL_GAP);
  }
  ys.push(anchor.y + anchor.h + LABEL_GAP);
  for (const y of ys) {
    if (!hits(y)) return { lx, ly: y };
  }
  return { lx, ly: ys[0] };
}

function drawQuestMark(qm, tx, ty) {
  const c = cam();
  const pulse = Math.floor(Date.now() / 320) % 2 === 0;
  CTX.font = 'bold 11px sans-serif';
  const bw = CTX.measureText(qm).width + 14;
  const bh = 16;
  const px = tx * T - c.x + T / 2;
  const npc = charBodyBox(px, ty * T - c.y + T / 2);
  const hp = heroDrawPos();
  const heroBox = charBodyBox(hp.x - c.x + T / 2, hp.y - c.y + T / 2);
  const { lx: bx, ly: by } = placeNear(npc, bw, bh, [heroBox]);
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
  if (tile === TY.STELE) return '#9aa4ad';
  if (tile === TY.GATE || tile === TY.EXIT) return '#4a90d9';
  const pulseChest = tile === TY.CHEST && hero
    && ((hero.quests && hero.quests.side_mushroom === 'active') || hero.caveBoss)
    && !hero.chests.has(x + ',' + y);
  if (pulseChest) return (Math.floor(Date.now() / UI_PULSE_MS) % 2 === 0) ? '#ffd24a' : '#8a5a00';
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
    const dangerCells = [];
    // 单次全图遍历：颜色填充 + 危险/可走统计 + 危险格收集一次完成
    for (let y = 0; y < bounds.h; y++) {
      for (let x = 0; x < bounds.w; x++) {
        const tile = at(x, y);
        CTX.fillStyle = minimapColor(tile, hero, x, y);
        CTX.fillRect(mx + x * sx, my + y * sy, Math.max(2, sx), Math.max(2, sy));
        if (dangerAt(x, y)) { danger++; dangerCells.push([x, y]); }
        if (!SOLID.has(tile)) walkable++;
      }
    }
    if (danger > 0 && danger <= walkable * 0.5) {
      CTX.fillStyle = 'rgba(255,92,92,.85)';
      for (const [x, y] of dangerCells) {
        CTX.fillRect(mx + x * sx + Math.max(1, sx * 0.3), my + y * sy, Math.max(1, sx * 0.4), Math.max(1, sy * 0.5));
      }
    }
    CTX.fillStyle = '#ffd24a';
    CTX.beginPath();
    CTX.arc(mx + hero.x * sx, my + hero.y * sy, 3, 0, 7);
    CTX.fill();
    // 遇敌槽：色带 + 百分比读数（深底高对比，避免叠在地砖上发灰）
    // 满槽值读 data.js ENCOUNTER.full（单一数据源）：与 world.tickEncounter 累加上限/触发判定同源，调满槽只改 data.js 一处
    const encPct = Math.max(0, Math.min(ENCOUNTER.full, S.encGauge || 0));
    // 预警线读 data.js ENCOUNTER.warn（单一数据源）：与满槽 full 同属遇敌槽口径，调「⚠️ 危险逼近」触发临界只改 data.js 一处
    const encDanger = encPct >= ENCOUNTER.warn;
    CTX.fillStyle = 'rgba(10,16,24,.9)';
    CTX.fillRect(mx, my + mh + 3, mw, 6);
    // 预警闪烁节奏读 data.js ENCOUNTER.warnFlash（单一数据源）：与满槽 full / 预警线 warn 同属遇敌槽口径，调「⚠️ 危险逼近」快闪节奏只改 data.js 一处
    CTX.fillStyle = encDanger && (Math.floor(Date.now() / ENCOUNTER.warnFlash) % 2 === 0) ? '#ff8a5b' : '#e14b3f';
    CTX.fillRect(mx, my + mh + 3, mw * (encPct / ENCOUNTER.full), 6);
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
  if (curMap() === 'cave' || curMap() === 'gallery') {
    if (ty === TY.STELE) return TILE[TY.CAVE];
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
      drawTileFx(ty, px, py, x, y);
    }
  }
  if (S.G && curMap() !== 'village') {
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
  if (S.G && curMap() === 'cave') {
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
