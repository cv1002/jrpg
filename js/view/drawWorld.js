// ============================================================
// view/drawWorld.js —— 大地图绘制
// ============================================================
import { S, curMap } from '../state.js';
import { T, TY, NPC_SPOTS, NPCS, SOLID, MAPS, SPECIES, RUSH_BOSSES, RUSH_REC_LV, ENCOUNTER, UI_PULSE_MS, dayPhase, VILLAGE_LAMP, VILLAGE_WELL, CAVE_WELL, CAVE_CART, CAVE_SAND, CAVE_CRYSTAL, TRUE_ALTAR, CAVE_RAIL, GALLERY_ARCH, CAMP_FIRE, BOSS_ALTAR, MB_ALTAR } from '../data.js';
import { at, MBounds, dangerAt, facingCell, portalDest, isTallGrass } from '../world.js';
import { rushReward } from '../rules.js';
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
  // v23.31 相位判定收口（单一数据源·机制与显示同读）：相位计算已收口进 data.js dayPhase() 纯函数
  // （HUD 标签/画面着色与 world 遇敌槽修正同读一份源）——此处仅转发，与旧实现在 t∈[0,9999] 逐值恒等
  return dayPhase((S.G && S.G.time) || 0);
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
    // v22.57 潮灯镇「水塘灯影」（新内容·世界景观·纯显示，承 v22.36 广场大灯三档同一「灯影状态随
    // 主线」主线的水塘侧兑现）：掌灯阿婆（14,8 水塘南岸）「灯灭那晚，塘里的月亮也熄了」/after「你
    // 看这塘水，倒映着整座镇子的灯——名字找回来了，灯也亮了」——镇子的灯（v22.36 大灯三档/v22.47
    // 村井两档）都已上画面，唯独水塘这面「镜子」仍是死水一片：灯有脸，影没有。现仅潮灯镇
    // （curMap()==='village'）的 WATER 格（6 格：北岸 (16..18,6) + 南岸 (14..16,7)）按状态叠加灯影
    // （与广场大灯同读 villageLampState 一份源三档——熄灯 dead/归来 rekindled/全亮 full）：微光罩
    // 20×18 + 灯柱 5×12 + 波光 22×2 +（全亮）第二波光 12×1·焰心 2×2 /（熄灯）余烬 2×2——全部既有
    // 色族零新增颜色（灯油金 rgba(255,210,74,*) 同族/金白 rgba(255,233,168,*) 同族/熄灯灰
    // rgba(90,85,96,*) 同 #5a5560 族/余烬暗铜 rgba(138,90,0,*) 同 #8a5a00 族），坐标哈希确定性零
    // 时间依赖（局部 dhw = x*31+y*17——water 分支先于函数级 const dh，不可引用）；纯显示零结算零
    // 存档零数值变化（WATER 仍 SOLID、遇敌/踩踏/传送判定逐字未动，dungeon/cave/gallery 零触发）。
    if (curMap() === 'village' && S.G) {
      const lp = villageLampState(S.G);
      const dhw = x * 31 + y * 17;
      const lx = 10 + (dhw % 5);
      if (lp === 'full') {
        CTX.fillStyle = 'rgba(255,233,168,.18)';
        CTX.fillRect(px + 6, py + 5, 20, 18);
        CTX.fillStyle = 'rgba(255,233,168,.55)';
        CTX.fillRect(px + lx, py + 9, 5, 12);
        CTX.fillStyle = 'rgba(255,233,168,.32)';
        CTX.fillRect(px + 5, py + 23, 22, 2);
        CTX.fillStyle = 'rgba(255,210,74,.2)';
        CTX.fillRect(px + 8 + (dhw % 6), py + 19, 12, 1);
        CTX.fillStyle = 'rgba(255,233,168,.8)';
        CTX.fillRect(px + lx + 1, py + 7, 2, 2);
      } else if (lp === 'rekindled') {
        CTX.fillStyle = 'rgba(255,210,74,.12)';
        CTX.fillRect(px + 6, py + 5, 20, 18);
        CTX.fillStyle = 'rgba(255,210,74,.45)';
        CTX.fillRect(px + lx, py + 9, 5, 12);
        CTX.fillStyle = 'rgba(255,210,74,.28)';
        CTX.fillRect(px + 5, py + 23, 22, 2);
      } else {
        CTX.fillStyle = 'rgba(90,85,96,.12)';
        CTX.fillRect(px + 6, py + 5, 20, 18);
        CTX.fillStyle = 'rgba(90,85,96,.3)';
        CTX.fillRect(px + lx, py + 9, 5, 12);
        CTX.fillStyle = 'rgba(138,90,0,.18)';
        CTX.fillRect(px + lx + 8, py + 19, 2, 2);
      }
    }
  }
  if (ty === TY.FOUNTAIN) {
    CTX.fillStyle = 'rgba(223,246,255,' + (0.4 + 0.4 * Math.sin(ph * 2)) + ')';
    CTX.fillRect(px + 15, py + 2, 2, 4);
    // v22.60 潮灯镇/雾语林「喷泉泉涌涟漪」（新内容·世界景观·纯显示，承 v22.57 水塘灯影同一 water
    // 色族）：潮灯镇广场喷泉 (12,6)（v19.94「⛲ 喷泉清泉涌动，HP/MP 完全恢复！」/v22.46 遇敌槽安全阀
    // ENCOUNTER.fountain）与雾语林中段营地泉水 (12,9)（货郎「中段营地的泉水，可以白喝」/老矿工「这
    // 附近最后一处免费的水」）此前只有一道 2×4 细水柱——「清泉涌动」四个字配画面仍显单薄（泉是四图
    // 唯二的免费恢复点，玩家踩泉瞬间理应「看得见」泉在涌）；现于水柱两侧叠加泉涌涟漪：内圈水光带
    // rgba(158,232,255,*) 6×2（WATER 波光同族）· 外圈涟漪 rgba(223,246,255,*) 8×2（水柱同族）· 溅起
    // 水珠 rgba(223,246,255,.6) 1×1×2——全部既有色族零新增颜色；相位由既有 ph 与坐标哈希
    // dhf = x*11+y*5 错开（water 分支先于函数级 const dh，不可引用——v22.57 同款局部哈希、零时间
    // 依赖布尔）；纯显示零结算零存档零数值变化（FOUNTAIN 不在 SOLID、遇敌/踩踏/传送判定逐字未动，
    // village/dungeon 两图同款零分支差异——TILE 分支天然覆盖，cave/gallery 无 FOUNTAIN 天然不触发）。
    const dhf = x * 11 + y * 5;
    CTX.fillStyle = 'rgba(158,232,255,' + (0.3 + 0.15 * Math.sin(ph * 2 + dhf)) + ')';
    CTX.fillRect(px + 10 + (dhf % 3), py + 9, 6, 2);
    CTX.fillStyle = 'rgba(223,246,255,' + (0.5 + 0.2 * Math.sin(ph * 2 + dhf + 1.5)) + ')';
    CTX.fillRect(px + 12 + (dhf % 2), py + 13, 8, 2);
    CTX.fillStyle = 'rgba(223,246,255,.6)';
    CTX.fillRect(px + 17, py + 7, 1, 1);
    CTX.fillRect(px + 13, py + 5, 1, 1);
  }
  if (ty === TY.CAVE) {
    CTX.fillStyle = `rgba(95,216,255,${0.2 + 0.2 * Math.sin(ph + px)})`;
    CTX.fillRect(px + 6, py + 8, 2, 2);
  }
  // v22.62 星井矿脉「终焉水晶」/无字回廊「终焉之神祭坛」补脸（新内容·世界景观·纯显示，承 v22.38 星井 /
  // v22.39 星砂车 / v22.59 星砂堆「名字物补脸」先例的收口）：SB 瓦片此前只有通用门贴图 + 2×2 微光——门是
  // 给名字之门（v22.41）的，全游最重要的两块 SB（矿脉中央水晶 (12,11) / 回廊东端终焉祭坛 (21,4)）却共用
  // 同一张贴图；现按 data.js CAVE_CRYSTAL / TRUE_ALTAR 单一数据源分档补脸（状态与 world.onTrueCrystal
  // 三档报文 / ALTAR_TAG 同读 S.G 一份源——纯显示零结算零存档零数值变化，SB 不在 SOLID、遇敌/踩踏/传送/
  // 开门判定逐字未动，不设小地图标记（无决策信息，与星砂车/名字之门同口径））：
  //   终焉水晶三档——沉睡「水晶沉睡着。它在等两份记得的资格。」（暗星蓝 rgba(95,216,255,.45) 晶簇）/
  //   睁眼「水晶睁开了眼。门开了——通向存放名字的回廊。」（亮星蓝 #9adcff 晶簇 + #cfeaff 高光 +
  //   rgba(95,216,255,.3) 光晕——星井/星砂车亮档同族）/ 空「水晶空了。回廊的门安静地敞着。」
  //   （#5a6472 灰晶 + #39414f 暗部，零蓝零晕——星砂堆不亮档同族）；
  //   终焉之神祭坛两档——未战「初灯的意志」金核（rgba(240,192,64,*)——TRUE_BOSS #f0c040 同族 + 金晕）/
  //   战后灰核零光零晕。先铺 32×32 岩地盘面（与周格 CAVE 地面同色 #2a2f38 + 同纹 #333a45 岩块——盖住
  //   通用门贴图），几何确定性零时间依赖（不含 ph）。
  if (ty === TY.SB && S.G) {
    if (curMap() === 'cave' && x === CAVE_CRYSTAL.x && y === CAVE_CRYSTAL.y) {
      CTX.fillStyle = '#2a2f38';
      CTX.fillRect(px, py, 32, 32);
      CTX.fillStyle = '#333a45';
      CTX.fillRect(px + 3, py + 3, 6, 4); CTX.fillRect(px + 20, py + 14, 7, 5); CTX.fillRect(px + 9, py + 24, 8, 5);
      CTX.fillStyle = '#14181f';
      CTX.fillRect(px + 7, py + 24, 18, 4);
      if (trueCrystalState(S.G) === 'awake') {
        CTX.fillStyle = 'rgba(95,216,255,.3)';
        CTX.fillRect(px + 5, py + 5, 22, 22);
        CTX.fillStyle = '#9adcff';
        CTX.fillRect(px + 14, py + 4, 4, 20); CTX.fillRect(px + 9, py + 10, 3, 14); CTX.fillRect(px + 20, py + 10, 3, 14);
        CTX.fillStyle = '#cfeaff';
        CTX.fillRect(px + 15, py + 6, 2, 3); CTX.fillRect(px + 10, py + 12, 1, 2); CTX.fillRect(px + 21, py + 12, 1, 2);
      } else if (trueCrystalState(S.G) === 'empty') {
        CTX.fillStyle = '#5a6472';
        CTX.fillRect(px + 14, py + 6, 4, 18); CTX.fillRect(px + 9, py + 12, 3, 12); CTX.fillRect(px + 20, py + 12, 3, 12);
        CTX.fillStyle = '#39414f';
        CTX.fillRect(px + 14, py + 18, 4, 6);
      } else {
        CTX.fillStyle = 'rgba(95,216,255,.45)';
        CTX.fillRect(px + 14, py + 6, 4, 18); CTX.fillRect(px + 9, py + 12, 3, 12); CTX.fillRect(px + 20, py + 12, 3, 12);
      }
    }
    if (curMap() === 'gallery' && x === TRUE_ALTAR.x && y === TRUE_ALTAR.y) {
      CTX.fillStyle = '#2a2f38';
      CTX.fillRect(px, py, 32, 32);
      CTX.fillStyle = '#333a45';
      CTX.fillRect(px + 3, py + 3, 6, 4); CTX.fillRect(px + 20, py + 14, 7, 5); CTX.fillRect(px + 9, py + 24, 8, 5);
      CTX.fillStyle = '#1c222c';
      CTX.fillRect(px + 5, py + 20, 22, 8);
      CTX.fillStyle = '#262d3a';
      CTX.fillRect(px + 5, py + 20, 22, 2);
      if (trueAltarState(S.G) === 'lit') {
        CTX.fillStyle = 'rgba(240,192,64,.18)';
        CTX.fillRect(px + 8, py + 8, 16, 16);
        CTX.fillStyle = 'rgba(240,192,64,.9)';
        CTX.fillRect(px + 14, py + 10, 4, 8);
        CTX.fillStyle = '#f0c040';
        CTX.fillRect(px + 15, py + 12, 2, 4);
      } else {
        CTX.fillStyle = '#5a6472';
        CTX.fillRect(px + 14, py + 10, 4, 8);
        CTX.fillStyle = '#39414f';
        CTX.fillRect(px + 14, py + 14, 4, 4);
      }
    }
  }
  // 确定性装饰（纯显示·零状态）：坐标哈希稀疏点缀——草地小花/草痕、路面石子；
  // 不进存档、不参与结算，洞窟 GRASS 已被 replaceTiles 换成 CAVE 故天然不触发
  const dh = (x * 19 + y * 37);
  // v22.55 名字石碑「回灯温光」（新内容·世界景观·纯显示，承 v22.36 广场大灯三档 / v22.41 名字之门
  // 两档同一「名字物状态随主线」主线的回廊收口）：trueBoss 后四块名字石碑（STELE 瓦片，碑文与
  // FRAGMENTS 同源；拾灯人/掌灯童/刻碑人/记誓人守碑）此前与开局一模一样——守名者 done「名字都回
  // 灯下了」/说书人 after「名字都回了灯下，第二块碑还是温的——这回，是镇子在焐它」/记誓人 after
  // 「名字都回了灯下，第二块碑还是温的」都在说真结局后碑有光有温，世界画面里石碑却仍是冷灰石；现仅
  // 无字回廊（curMap()==='gallery'）的 STELE 格（steleLitState 与守名者/名字之门同读 S.G.trueBoss
  // 一份源）叠加温光：暖金微光罩 rgba(255,233,168,.16)（金白同族）· 碑缘暖光 rgba(255,210,74,.45)
  // （灯油金同族）· 浮光金点 #ffe9a8（坐标哈希确定性，与小花草痕同法）· 顶上名字微光 #ffd24a——全部
  // 既有色族零新增颜色；纯显示零结算零存档零数值变化（at/SOLID/NPC 判定逐字未动，trueBoss 前零回归）。
  if (ty === TY.STELE && curMap() === 'gallery' && steleLitState(S.G)) {
    CTX.fillStyle = 'rgba(255,233,168,.16)';
    CTX.fillRect(px + 2, py + 2, 28, 28);
    CTX.fillStyle = 'rgba(255,210,74,.45)';
    CTX.fillRect(px + 2, py + 2, 28, 1);
    CTX.fillRect(px + 2, py + 29, 28, 1);
    CTX.fillRect(px + 2, py + 2, 1, 28);
    CTX.fillRect(px + 29, py + 2, 1, 28);
    CTX.fillStyle = '#ffd24a';
    CTX.fillRect(px + 12 + (dh % 6), py + 6, 3, 2);
    CTX.fillStyle = '#ffe9a8';
    CTX.fillRect(px + 8 + (dh % 12), py + 20, 2, 2);
    CTX.fillRect(px + 20 + (dh % 7), py + 24, 2, 2);
  }
  if (ty === TY.GRASS) {
    // v22.40 高草显形（体验打磨·信息透明·纯显示）：'G' 高草自 v3.x 起就是全图通用危险格
    // （world.dangerAt 第一道判定即读 loadMap 建立的 gCells），世界画面却与普通草一像素之差都没有——
    // 雾语林蘑菇田（v22.16 拾菇人/蘑菇宝箱所在）/潮灯镇粮田（v21.80 粮铺掌柜「护粮的委托」）都在高草上，
    // 玩家边走边纳闷「哪片草算高草」；现经 world.isTallGrass（gCells 只读访问器，与 dangerAt 同一份源）
    // 区分绘制：高草格画深绿剑形草簇（#245a24 叶身 + #56a656 草尖，与草皮 #367636/#2f6b2f/#56a656
    // 同色族、零新增颜色族，草簇高随坐标哈希抖动确定性与小花/草痕同法）；普通草小花/草痕逐字零回归。
    // 纯显示零结算零存档零数值变化（dangerAt/遇敌/踩踏/传送判定逐字未动）。
    if (isTallGrass(x, y)) {
      const ht = 10 + (dh % 6);
      CTX.fillStyle = '#245a24';
      CTX.fillRect(px + 5, py + 20 - ht, 2, ht);
      CTX.fillRect(px + 15, py + 22 - ht - (dh % 3), 2, ht + (dh % 3));
      CTX.fillRect(px + 24, py + 20 - ht, 2, ht);
      CTX.fillStyle = '#56a656';
      CTX.fillRect(px + 5, py + 19 - ht, 2, 2);
      CTX.fillRect(px + 15, py + 21 - ht - (dh % 3), 2, 2);
      CTX.fillRect(px + 24, py + 19 - ht, 2, 2);
      // v22.42 雾语林蘑菇田「菌盖灯油」景观（新内容·世界景观·纯显示，承 v22.40 高草显形同一
      // 「世界画面补脸」主线）：拾菇人「蘑菇是灯油：菌盖夜里发光、两株能熬一瓶高级灵药」/失名的
      // 旅人/货郎的灯油营生全在说这片田，画面里却只有一色深绿高草——「菌盖」二字一像素都没有；
      // 现仅雾语林（curMap()==='dungeon'）的高草格（isTallGrass 单一数据源，与 dangerAt 同读
      // gCells 一份源，危险/遇敌/踩踏判定逐字未动）按坐标哈希 (x*7+y*13)%4===0 稀疏点缀 1 组
      // 菌盖灯油：伞柄米色 #e8c9a0（NPC 米色同族）· 伞盖灯油金 #ffd24a · 盖缘深金 #8a5a00 ·
      // 高光金白 #ffe9a8——全部既有色族零新增颜色族，与草簇/小花同一哈希确定性手法；
      // 纯显示零结算零存档零数值变化；village 粮田/洞窟岩地（GRASS 已被 replaceTiles 换走）不触发。
      if (curMap() === 'dungeon' && (x * 7 + y * 13) % 4 === 0) {
        CTX.fillStyle = '#e8c9a0';           // 伞柄
        CTX.fillRect(px + 15, py + 16, 3, 6);
        CTX.fillStyle = '#ffd24a';           // 伞盖（灯油金）
        CTX.fillRect(px + 8, py + 9, 17, 8);
        CTX.fillStyle = '#8a5a00';           // 盖缘
        CTX.fillRect(px + 8, py + 15, 17, 2);
        CTX.fillStyle = '#ffe9a8';           // 高光
        CTX.fillRect(px + 11, py + 11, 4, 2);
      }
      // v22.54 潮灯镇粮田「谷穗」景观（新内容·世界景观·纯显示，承 v22.42 蘑菇田菌盖同一「世界画面
      // 补脸」主线的潮灯镇侧收口）：v22.40 高草显形后雾语林蘑菇田有菌盖、潮灯镇粮田（v21.80 粮铺
      // 掌柜「镇南那片庄稼，是全年的口粮」/支线「护粮的委托」——哥布林偷粮）却只有深绿高草——「全年
      // 的口粮」配画面看不出口粮二字；现仅潮灯镇（curMap()==='village'）的高草格（isTallGrass 单一
      // 数据源，与 dangerAt 同读 gCells 一份源，危险/遇敌/踩踏判定逐字未动）按坐标哈希
      // (x*5+y*7)%4===0 稀疏点缀 1 束谷穗：穗杆米色 #e8c9a0（NPC 米色同族）· 穗粒暖金 #ffd24a（灯油金
      // 同族）· 芒须深金 #8a5a00（盖缘深金同族）· 高光金白 #ffe9a8——全部既有色族零新增颜色族，与
      // 草簇/小花/菌盖同一哈希确定性手法；纯显示零结算零存档零数值变化；雾语林菌盖/洞窟岩地（GRASS
      // 已被 replaceTiles 换走）不触发。
      if (curMap() === 'village' && (x * 5 + y * 7) % 4 === 0) {
        CTX.fillStyle = '#e8c9a0';           // 穗杆
        CTX.fillRect(px + 14, py + 8, 2, 14);
        CTX.fillStyle = '#ffd24a';           // 穗粒（暖金）
        CTX.fillRect(px + 11, py + 10, 2, 2);
        CTX.fillRect(px + 17, py + 10, 2, 2);
        CTX.fillRect(px + 12, py + 14, 2, 2);
        CTX.fillRect(px + 16, py + 14, 2, 2);
        CTX.fillStyle = '#8a5a00';           // 芒须（深金）
        CTX.fillRect(px + 11, py + 17, 2, 1);
        CTX.fillRect(px + 17, py + 17, 2, 1);
        CTX.fillStyle = '#ffe9a8';           // 高光
        CTX.fillRect(px + 15, py + 9, 1, 1);
        CTX.fillRect(px + 13, py + 12, 1, 1);
      }
    } else if (dh % 29 === 0) { // 小花：白瓣黄心
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

// v22.36 潮灯镇广场大灯（新内容·世界景观·纯显示，承 v21.36 掌灯阿婆 / v22.13 说书人「NPC 就是数据」
// 先例的全游标题物补脸）：「广场大灯（记忆之灯）」是镇子的名字物——v13.5 地图重排注释「广场大灯地标
// 居中」/说书人（16,9）「广场大灯南侧」/灯长「广场那盏大灯，还在等灯芯」/开场叙事「广场的大灯熄了」
// 都在说它，世界画面却一像素都没有（商店/旅馆/酿造/水塘/民宅都有脸，唯独镇子的名字物没有脸）；
// 现按 v13.5「居中」口径在广场大道正中立起大灯，状态与灯长台词/胜利画面「灯芯回来了」同读
// S.G.bossDefeated / S.G.trueBoss 一份源、三档（纯显示零结算零存档零数值变化，只读旗标）：
//   熄灯（!bossDefeated）——「灯芯熄了，灰里还留着一粒火种」（创建页余烬寓意同源）：灰窗 + 一粒余烬 + 暗铜光晕；
//   归来（bossDefeated）——「灯芯回来了，广场的大灯亮起来了」（灯长 done 档同口径）：暖金窗 + 金晕；
//   全亮（trueBoss）——「灯全亮了，名字都回碑上了」（说书人 after 同口径）：金白窗 + 更亮双金晕 + 浮光点。
// 位置读 data.js VILLAGE_LAMP 单一数据源（(14,9) 可行走 PATH 格，零碰撞变化，与小地图标记同一份源）。
// 画布大灯先于角色绘制（角色/ NPC 走 actors 深度排序在此之后，人站在灯前不被灯柱遮挡）。
export function villageLampState(hero) {
  if (hero && hero.trueBoss) return 'full';
  if (hero && hero.bossDefeated) return 'rekindled';
  return 'dead';
}

function drawVillageLamp(camX, camY) {
  const st = villageLampState(S.G);
  const px = VILLAGE_LAMP.x * T - camX;
  const py = VILLAGE_LAMP.y * T - camY;
  const cx = px + T / 2;
  // 光晕（纯显示·状态档位色：余烬暗铜 / 灯芯暖金 / 全亮金白——与 v22.35 小地图 NPC 任务标、
  // v3.x 宝箱引导金族同族色系，零新增颜色族）
  if (st === 'dead') {
    CTX.fillStyle = 'rgba(138,90,0,.25)';
    CTX.beginPath(); CTX.arc(cx, py + 8, 16, 0, 7); CTX.fill();
  } else if (st === 'rekindled') {
    CTX.fillStyle = 'rgba(255,210,74,.25)';
    CTX.beginPath(); CTX.arc(cx, py + 6, 18, 0, 7); CTX.fill();
  } else {
    CTX.fillStyle = 'rgba(255,233,168,.35)';
    CTX.beginPath(); CTX.arc(cx, py + 6, 20, 0, 7); CTX.fill();
    CTX.fillStyle = 'rgba(255,210,74,.2)';
    CTX.beginPath(); CTX.arc(cx, py + 2, 28, 0, 7); CTX.fill();
  }
  // 灯柱 / 底座 / 顶盖（三档共体、零状态分支）
  CTX.fillStyle = '#4a4238';
  CTX.fillRect(px + 15, py - 26, 3, 26);
  CTX.fillRect(px + 11, py - 2, 12, 4);
  CTX.fillRect(px + 9, py - 33, 14, 3);
  CTX.fillRect(px + 15, py - 37, 3, 4);
  // 灯罩（金属壳）
  CTX.fillStyle = '#2e333c';
  CTX.fillRect(px + 8, py - 30, 16, 15);
  // 灯窗（状态色：熄灯灰 + 一粒余烬 / 归来暖金 / 全亮金白）
  if (st === 'dead') {
    CTX.fillStyle = '#5a5560';
    CTX.fillRect(px + 11, py - 27, 10, 10);
    CTX.fillStyle = '#8a5a00';
    CTX.fillRect(px + 15, py - 23, 2, 2);
  } else if (st === 'rekindled') {
    CTX.fillStyle = '#ffd24a';
    CTX.fillRect(px + 11, py - 27, 10, 10);
  } else {
    CTX.fillStyle = '#ffe9a8';
    CTX.fillRect(px + 11, py - 27, 10, 10);
  }
  // 全亮档浮光点（名字回灯：灯周光屑，纯显示）
  if (st === 'full') {
    CTX.fillStyle = '#ffe9a8';
    CTX.fillRect(px + 3, py - 35, 2, 2);
    CTX.fillRect(px + 27, py - 31, 2, 2);
    CTX.fillRect(px + 24, py - 40, 2, 2);
  }
}

// v22.47 潮灯镇「村井」状态纯函数：与星井/星砂车/广场大灯同族只读旗标——灯长「可你听——井还在低鸣。」
// /「井也不鸣了。」/井巫「井底在响」/说书人「井底那口钟还在替大家记着」同读 S.G.trueBoss 一份源两档
// （村井与矿脉星井是同一口水脉的两端，听矿人「像井底那口钟的余音」同口径）。只读不改，零结算零存档。
export function villageWellState(hero) {
  if (hero && hero.trueBoss) return 'silent';
  return 'hum';
}

function drawVillageWell(camX, camY) {
  const st = villageWellState(S.G);
  const px = VILLAGE_WELL.x * T - camX;
  const py = VILLAGE_WELL.y * T - camY;
  const cx = px + T / 2;
  // 光晕（状态档位色：低鸣星蓝青光 / 静默零光晕——与星井/大灯光晕同档位结构）
  if (st === 'hum') {
    CTX.fillStyle = 'rgba(95,216,255,.20)';
    CTX.beginPath(); CTX.arc(cx, py + 6, 15, 0, 7); CTX.fill();
  }
  // 石砌井圈（共体零状态分支：浅石 #6a6f78 / 井沿高光 #8a9098，与镇路/民宅石色同族）
  CTX.fillStyle = '#6a6f78';
  CTX.fillRect(px + 5, py - 1, 22, 4);
  CTX.fillRect(px + 6, py - 13, 4, 12);
  CTX.fillRect(px + 22, py - 13, 4, 12);
  CTX.fillRect(px + 3, py - 16, 26, 5);
  CTX.fillStyle = '#8a9098';
  CTX.fillRect(px + 7, py - 16, 2, 3);
  CTX.fillRect(px + 23, py - 16, 2, 3);
  // 辘轳木架（共体：木柱 #6b5138 / 横梁 #8a5a2b，与 NPC 木制标记/星砂车木料同色族）
  CTX.fillStyle = '#6b5138';
  CTX.fillRect(px + 1, py - 32, 3, 20);
  CTX.fillRect(px + 28, py - 32, 3, 20);
  CTX.fillStyle = '#8a5a2b';
  CTX.fillRect(px - 1, py - 34, 34, 3);
  // 吊绳 + 水桶（共体：绳 #b8a78e / 桶木 #8a5a2b）
  CTX.fillStyle = '#b8a78e';
  CTX.fillRect(px + 15, py - 31, 1, 11);
  CTX.fillStyle = '#8a5a2b';
  CTX.fillRect(px + 12, py - 20, 8, 6);
  // 井水（状态色：低鸣星蓝 #9adcff + 星砂浮光 #cfeaff / 静默暗灰 #5a6472——与星井/星砂车同色族同档位）
  if (st === 'hum') {
    CTX.fillStyle = '#9adcff';
    CTX.fillRect(px + 11, py - 11, 10, 9);
    CTX.fillStyle = '#cfeaff';
    CTX.fillRect(px + 13, py - 14, 2, 2);
    CTX.fillRect(px + 18, py - 13, 2, 2);
  } else {
    CTX.fillStyle = '#5a6472';
    CTX.fillRect(px + 11, py - 11, 10, 9);
  }
}

// v22.38 星井矿脉「星井」（新内容·世界景观·纯显示，承 v22.36 广场大灯「名字物补脸」先例）：矿脉的
// 名字物——星砂从井底涌上、被矿车拉去喂记忆之灯（井巫「矿脉曾往镇上运星砂，喂那些记忆之灯」/
// 星砂车夫「这洞从前往镇上拉星砂」/听矿人「矿脉嗡嗡响」都在说它），世界画面却一像素都没有；
// 现于矿车区西缘 (16,11)（星砂车夫旁、最后一车没运走的星砂卸货处）立起星井，状态与灯长台词
// 「可你听——井还在低鸣。」（bossDefeated done 档）/「井也不鸣了。」（trueBoss 档）同读
// S.G.trueBoss 一份源两档（纯显示零结算零存档零数值变化，只读旗标）：
//   低鸣（!trueBoss）——井底还在响：星蓝水面 #9adcff（星砂蓝光族）+ 星砂浮光点 #cfeaff + 蓝青光晕；
//   静默（trueBoss）——「井也不鸣了」：暗水 #5a6472 + 零浮光零光晕（灰族，与大灯熄冷灰同口径）。
// 位置读 data.js CAVE_WELL 单一数据源（(16,11) 可行走 CAVE 格零碰撞，与小地图标记同一份源）。
// 画布星井先于角色绘制（与 v22.36 大灯同层，人站井前不被遮挡）。
export function caveWellState(hero) {
  if (hero && hero.trueBoss) return 'silent';
  return 'hum';
}

function drawCaveWell(camX, camY) {
  const st = caveWellState(S.G);
  const px = CAVE_WELL.x * T - camX;
  const py = CAVE_WELL.y * T - camY;
  const cx = px + T / 2;
  // 光晕（纯显示·状态档位色：低鸣星蓝青光 / 静默零光晕——与 v22.36 大灯光晕同档位结构）
  if (st === 'hum') {
    CTX.fillStyle = 'rgba(95,216,255,.22)';
    CTX.beginPath(); CTX.arc(cx, py + 8, 15, 0, 7); CTX.fill();
  }
  // 石砌井体（三档共体、零状态分支；井沿深灰与洞窟岩壁/金属灯罩同色族）
  CTX.fillStyle = '#2e333c';
  CTX.fillRect(px + 6, py - 2, 20, 5);        // 井座
  CTX.fillRect(px + 6, py - 13, 4, 13);       // 左井壁
  CTX.fillRect(px + 22, py - 13, 4, 13);      // 右井壁
  CTX.fillRect(px + 4, py - 16, 24, 5);       // 井沿
  CTX.fillStyle = '#3a4148';
  CTX.fillRect(px + 8, py - 16, 2, 3);        // 井沿高光（左）
  CTX.fillRect(px + 22, py - 16, 2, 3);       // 井沿高光（右）
  // 井水（状态色：低鸣星蓝 / 静默暗灰）
  if (st === 'hum') {
    CTX.fillStyle = '#9adcff';
    CTX.fillRect(px + 11, py - 12, 10, 10);
    // 星砂浮光点（低鸣档：井口星屑 4 枚——井底还在响，星砂还亮着）
    CTX.fillStyle = '#cfeaff';
    CTX.fillRect(px + 13, py - 15, 2, 2);
    CTX.fillRect(px + 18, py - 15, 2, 2);
    CTX.fillRect(px + 15, py - 19, 2, 2);
    CTX.fillRect(px + 20, py - 18, 2, 2);
  } else {
    CTX.fillStyle = '#5a6472';
    CTX.fillRect(px + 11, py - 12, 10, 10);
  }
}

// v22.39 星井矿脉「星砂车」（新内容·世界景观·纯显示，承 v22.38 星井「名字物补脸」先例的补景收口）：
// 星砂车夫守着的那辆运砂车——井巫「被矿车拉去喂记忆之灯」/车夫「这洞从前往镇上拉星砂」的台词全在
// 说它，矿车区却一像素的车都没有；现于 data.js CAVE_CART=(19,10)（星砂车夫东北两格、祭坛南侧的开阔
// 矿场）立起木轮星砂车：两档状态与星井同读 S.G.trueBoss 一份源（井巫 after「星砂落回矿脉深处」
// 同口径，纯显示零结算零存档零数值变化，只读旗标）：
//   满载（!trueBoss）——车斗里还亮着一层星砂：星砂蓝 #9adcff（星砂蓝光族）+ 浮光点 #cfeaff + 蓝青光晕；
//   卸空（trueBoss）——「像什么都没发生过」：暗斗 #3a4148（洞窟岩壁同色族）+ 零浮光零光晕。
// 位置读 data.js CAVE_CART 单一数据源（(19,10) 可行走 CAVE 格零碰撞）。画布星砂车先于角色绘制
// （与 v22.36 大灯 / v22.38 星井同层，人站车前不被遮挡）。
export function caveCartState(hero) {
  if (hero && hero.trueBoss) return 'empty';
  return 'loaded';
}

function drawCaveCart(camX, camY) {
  const st = caveCartState(S.G);
  const px = CAVE_CART.x * T - camX;
  const py = CAVE_CART.y * T - camY;
  const cx = px + T / 2;
  // 光晕（状态档位色：满载星砂蓝青光 / 卸空零光晕——与星井同档位结构）
  if (st === 'loaded') {
    CTX.fillStyle = 'rgba(95,216,255,.18)';
    CTX.beginPath(); CTX.arc(cx, py + 10, 14, 0, 7); CTX.fill();
  }
  // 车轮（两轮共体、零状态分支；暗铁与灯罩/井壁同色族）
  CTX.fillStyle = '#2e333c';
  CTX.beginPath(); CTX.arc(px + 9, py + 25, 5, 0, 7); CTX.fill();
  CTX.beginPath(); CTX.arc(px + 23, py + 25, 5, 0, 7); CTX.fill();
  CTX.fillStyle = '#3a4148';
  CTX.fillRect(px + 8, py + 24, 3, 2);
  CTX.fillRect(px + 22, py + 24, 3, 2);
  // 车斗（木体共体：木料 #8a5a2b / 顶缘 #6a4a2f，与 NPC 木制标记同色族）
  CTX.fillStyle = '#8a5a2b';
  CTX.fillRect(px + 4, py + 8, 24, 13);
  CTX.fillStyle = '#6a4a2f';
  CTX.fillRect(px + 4, py + 8, 24, 3);
  // 车斗内星砂（状态色：满载星砂蓝 + 浮光 / 卸空暗斗）
  if (st === 'loaded') {
    CTX.fillStyle = '#9adcff';
    CTX.fillRect(px + 7, py + 3, 18, 7);
    CTX.fillStyle = '#cfeaff';
    CTX.fillRect(px + 10, py + 1, 2, 2);
    CTX.fillRect(px + 16, py + 1, 2, 2);
    CTX.fillRect(px + 20, py + 3, 2, 2);
  } else {
    CTX.fillStyle = '#3a4148';
    CTX.fillRect(px + 7, py + 3, 18, 7);
  }
}

// v22.59 星井矿脉「星砂堆」（新内容·世界景观·纯显示，承 v22.38 星井 / v22.39 星砂车「名字物补脸」先例
// 的收口）：筛砂人（5,5）「把星砂一筛一筛拣回砂堆旁」——矿脉从前往镇上运星砂喂记忆之灯，井与车都有
// 脸了，唯独这堆「喂灯的砂」本体一像素都没有（v22.39 后车是空的、井是空的，砂堆是唯一还该亮着的）；
// 现于 data.js CAVE_SAND=(5,6)（筛砂人南邻、轨道引导线西侧的开阔矿场）立起星砂堆：两档状态与星井/
// 星砂车同读 S.G.trueBoss 一份源（筛砂人 after「砂堆不亮了。我筛了一辈子，头一回筛出这么多空的」/
// 「——不是空了，是被记起来了」同口径，纯显示零结算零存档零数值变化，只读旗标）：
//   亮砂（!trueBoss）——砂面星砂蓝 #9adcff（星砂蓝光族）+ 浮光点 #cfeaff + 星砂浮光 #cfeaff 光点 + 蓝青光晕；
//   不亮（trueBoss）——「砂堆不亮了」：#5a6472 暗灰（星井静默水同色族）+ 零浮光零光晕。
// 位置读 data.js CAVE_SAND 单一数据源（(5,6) 可行走 CAVE 格零碰撞、不在 CAVE_RAIL 轨道上）。画布星砂堆
// 先于角色绘制（与 v22.36 大灯 / v22.38 星井同层，人站砂堆前不被遮挡）；刻意不设小地图标记（无决策信息，
// 与星砂车/名字之门/村井同口径）。
export function caveSandState(hero) {
  if (hero && hero.trueBoss) return 'dim';
  return 'lit';
}

function drawCaveSand(camX, camY) {
  const st = caveSandState(S.G);
  const px = CAVE_SAND.x * T - camX;
  const py = CAVE_SAND.y * T - camY;
  const cx = px + T / 2;
  // 光晕（状态档位色：亮砂星砂蓝青光 / 不亮零光晕——与星井/星砂车同档位结构）
  if (st === 'lit') {
    CTX.fillStyle = 'rgba(95,216,255,.18)';
    CTX.beginPath(); CTX.arc(cx, py + 16, 13, 0, 7); CTX.fill();
  }
  // 砂丘本体（三阶台阶两档共体·零状态分支；底缘暗灰与岩壁/星井静默水同色族）
  CTX.fillStyle = '#3a4148';
  CTX.fillRect(px + 4, py + 26, 24, 3);
  CTX.fillStyle = st === 'lit' ? '#9adcff' : '#5a6472';
  CTX.fillRect(px + 5, py + 20, 22, 7);
  CTX.fillRect(px + 9, py + 14, 14, 6);
  CTX.fillRect(px + 13, py + 10, 6, 4);
  // 浮光点（亮砂档：砂面星屑 4 枚——与星井井口星屑同款；不亮档零浮光）
  if (st === 'lit') {
    CTX.fillStyle = '#cfeaff';
    CTX.fillRect(px + 8, py + 17, 2, 2);
    CTX.fillRect(px + 20, py + 15, 2, 2);
    CTX.fillRect(px + 15, py + 7, 2, 2);
    CTX.fillRect(px + 11, py + 21, 2, 2);
  }
  // 筛箩（筛砂人的家伙·木色族与星砂车木料同族）：斜靠砂丘东缘
  CTX.fillStyle = '#8a5a2b';
  CTX.fillRect(px + 24, py + 11, 3, 12);
  CTX.fillStyle = '#6a4a2f';
  CTX.fillRect(px + 22, py + 22, 7, 2);
}

// v22.52 星井矿脉「矿车轨道」（新内容·世界景观·纯显示，承 v22.39 星砂车「名字物补脸」先例的收口）：
// 矿脉地图 v13.5 注释「轨道引导线贯穿——入口（井巫）→ 矿车区（车夫/试炼碑）→ 深处祭坛 → 中央水晶」，
// ASCII PATH '.' 格就是这条引导线——replaceTiles（PATH→CAVE）后轨道与世界画面岩地同色，v22.39 立起的
// 星砂车（19,10）停在矿场、车夫守护的却是一像素都看不见的轨道；现沿 data.js CAVE_RAIL 单一数据源
// （= MAPS.cave.rows '.' 逐行扫描，35 格，改图自动跟随零漂移）逐格绘制木枕 + 双轨：方向感知——
// 有左右轨道邻接画横轨、有上下邻接画竖轨（拐角/三通各画各的、交界格重叠自然衔接），纯斜向阶梯格
// 回落横轨（阶梯式轨道路径，与像素矿洞同风格）；枕木木色 #8a5a2b/#6a4a2f（星砂车木料/车斗顶缘同色族）、
// 双轨铁灰 #5a6472 + 受光高光 #7a828a（星井石砌/岩块高光同色族）——全部既有色族零新增颜色；
// 先于星井/星砂车绘制（轨道铺在岩地上、井与车立在轨道旁，不遮挡彼此——CAVE_RAIL 与 CAVE_WELL (16,11)/
// CAVE_CART (19,10) 无同格）；纯显示零结算零存档零数值变化（'.' 仍是 PATH→CAVE 可行走格，at()/SOLID/
// 遇敌/开箱判定逐字未动），刻意不设小地图标记（轨道是矿脉地貌不是决策信息，与星砂车/名字之门同口径）。
function drawCaveRail(camX, camY) {
  const railSet = new Set(CAVE_RAIL.map((p) => p[0] + ',' + p[1]));
  for (const [rx, ry] of CAVE_RAIL) {
    // 只画纯岩地格：终焉水晶 (12,11) 恰在轨道引导线终点上（SB 瓦片），轨道不压任何设施/道具/角色——
    // at() 与 dangerAt/碰撞同读世界网格，未来若在轨道格上放新设施自动免责（该格零轨道像素）。
    if (at(rx, ry) !== TY.CAVE) continue;
    const px = rx * T - camX;
    const py = ry * T - camY;
    if (px < -T || py < -T || px > CV.width || py > CV.height) continue;
    const h = railSet.has((rx + 1) + ',' + ry) || railSet.has((rx - 1) + ',' + ry)
      || (!railSet.has(rx + ',' + (ry + 1)) && !railSet.has(rx + ',' + (ry - 1)));
    const v = railSet.has(rx + ',' + (ry + 1)) || railSet.has(rx + ',' + (ry - 1));
    if (h) {
      // 枕木（木色族，先于双轨——轨压枕上）
      CTX.fillStyle = '#6a4a2f';
      for (let i = 0; i < 6; i++) CTX.fillRect(px + 2 + i * 5, py + 11, 2, 10);
      // 双轨 + 受光高光（铁灰/高光色族）
      CTX.fillStyle = '#5a6472';
      CTX.fillRect(px, py + 13, T, 2);
      CTX.fillRect(px, py + 21, T, 2);
      CTX.fillStyle = '#7a828a';
      CTX.fillRect(px, py + 13, T, 1);
      CTX.fillRect(px, py + 21, T, 1);
    }
    if (v) {
      CTX.fillStyle = '#6a4a2f';
      for (let i = 0; i < 6; i++) CTX.fillRect(px + 11, py + 2 + i * 5, 10, 2);
      CTX.fillStyle = '#5a6472';
      CTX.fillRect(px + 13, py, 2, T);
      CTX.fillRect(px + 21, py, 2, T);
      CTX.fillStyle = '#7a828a';
      CTX.fillRect(px + 13, py, 1, T);
      CTX.fillRect(px + 21, py, 1, T);
    }
  }
}

// v22.41 无字回廊「名字之门」状态纯函数：与星井/星砂车/广场大灯同族只读旗标——守名者 done「名字
// 回灯下」/真结局「记忆回到镇上」同读 S.G.trueBoss 一份源两档。只读不改，零结算零存档。
export function galleryArchState(hero) {
  if (hero && hero.trueBoss) return 'lit';
  return 'dark';
}

// v22.55 无字回廊名字石碑「回灯温光」状态纯函数：与守名者 done「名字都回灯下了」/名字之门
// galleryArchState 同读 S.G.trueBoss 一份源——trueBoss 后四块名字石碑（STELE 瓦片）温光点亮
// （「名字都回了灯下，第二块碑还是温的——这回，是镇子在焐它」）。只读不改，零结算零存档。
export function steleLitState(hero) {
  return !!(hero && hero.trueBoss);
}

// v22.62 星井矿脉「终焉水晶」状态纯函数（新内容·世界景观·纯显示）：与 world.js onTrueCrystal 三档报文
// （「水晶沉睡着。它在等两份记得的资格。」/「水晶睁开了眼。门开了——通向存放名字的回廊。」/「水晶空了。
// 回廊的门安静地敞着。」）同读 S.G 一份源三档。只读不改，零结算零存档零数值变化。
export function trueCrystalState(hero) {
  if (hero && hero.trueBoss) return 'empty';
  if (hero && hero.bossDefeated && hero.caveBoss) return 'awake';
  return 'sleep';
}

// v22.62 无字回廊「终焉之神祭坛」状态纯函数（新内容·世界景观·纯显示）：与 onTrueCrystal 的 gallery
// 分支（「回廊尽头，所有的名字一齐看向你。终焉之神醒了。」）/祭坛 ⚠Lv 标签（ALTAR_TAG done 判定）同读
// S.G.trueBoss 一份源两档。只读不改，零结算零存档零数值变化。
export function trueAltarState(hero) {
  if (hero && hero.trueBoss) return 'dead';
  return 'lit';
}

// v23.28 幽冥魔王祭坛状态纯函数（新内容·世界景观·纯显示）：与 ALTAR_TAG done 判定（g.bossDefeated）/
// 胜利画面「灯芯回来了」同读 S.G 一份源两档（未战「一截还没灭的灯芯」/ 战后灰芯零光）。只读不改，
// 零结算零存档零数值变化。
export function bossAltarState(hero) {
  if (hero && hero.bossDefeated) return 'dead';
  return 'lit';
}

// v23.28 洞窟领主祭坛状态纯函数（新内容·世界景观·纯显示）：与 ALTAR_TAG done 判定（g.caveBoss）/
// 星砂车夫 done「矿脉安静了」同读 S.G 一份源两档（未战星砂微光 / 战后零蓝零晕）。只读不改，
// 零结算零存档零数值变化。
export function mbAltarState(hero) {
  if (hero && hero.caveBoss) return 'dead';
  return 'lit';
}

function drawGalleryArch(camX, camY) {
  const st = galleryArchState(S.G);
  const px = GALLERY_ARCH.x * T - camX;
  const py = GALLERY_ARCH.y * T - camY;
  const cx = px + T / 2;
  // 门内光（状态档位色：名字亮回金白微光 + 金晕 / 无字零光——与星井蓝光晕同档位结构）
  if (st === 'lit') {
    CTX.fillStyle = 'rgba(255,210,74,.15)';
    CTX.beginPath(); CTX.arc(cx, py + 17, 12, 0, 7); CTX.fill();
    CTX.fillStyle = '#ffe9a8';
    CTX.fillRect(px + 11, py + 12, 10, 10);
    CTX.fillStyle = '#ffd24a';
    CTX.fillRect(px + 11, py + 10, 2, 2);
    CTX.fillRect(px + 19, py + 13, 2, 2);
    CTX.fillRect(px + 14, py + 18, 2, 2);
  } else {
    CTX.fillStyle = '#2e333c';
    CTX.fillRect(px + 9, py + 12, 14, 16);
  }
  // 石门（共体零状态分支：门柱 #3a4148 / 门楣 #5a6472，与洞窟岩壁/NPC 石制标记同色族）
  CTX.fillStyle = '#3a4148';
  CTX.fillRect(px + 2, py + 6, 6, 22);
  CTX.fillRect(px + 24, py + 6, 6, 22);
  CTX.fillStyle = '#5a6472';
  CTX.fillRect(px, py + 4, 32, 6);
  CTX.fillStyle = '#3a4148';
  CTX.fillRect(px, py + 4, 32, 2);
}

// v22.56 雾语林「营地篝火」（新内容·世界景观·纯显示，承 v22.36 广场大灯 / v22.47 村井「地标设施补脸」
// 先例）：中段营地（泉水 (12,9) + 雾径猎手 (13,9)，货郎「中段营地的泉水，可以白喝」/老矿工「雾语林
// 营地那口泉是这附近最后一处免费的水」/README「中段营地（泉水安全岛）」）此前只有泉水与猎手、一像素
// 的「火」都没有——营地没有篝火，就只是水边一块空地；现于泉水西侧 (11,9) 立起营火（位置读 data.js
// CAMP_FIRE 单一数据源）：暖橙光晕 rgba(255,200,90,.25)（村居窗光同族）· 石圈 #6a6f78/#8a9098（村井
// 石色同族）· 交叉柴堆 #6b5138/#8a5a2b（村井辘轳/星砂车木料同族）· 火焰灯油金 #ffd24a + 金白焰心
// #ffe9a8 + 深金余烬 #8a5a00（菌盖灯油/大灯光效同族——镇子的灯烧的是灯油，林间营火也是同一盏油的
// 火；v22.42 菌盖夜里发光的设定同源）· 火星金白 #ffe9a8（坐标哈希确定性，与小花草痕同法）——全部既有
// 色族零新增颜色；纯显示零结算零存档零数值变化（at/SOLID/遇敌/踩踏判定逐字未动），village/cave/
// gallery 零触发，刻意不设小地图标记（无决策信息，与星砂车/名字之门/村井同口径，图例零变化）。
function drawCampFire(camX, camY) {
  const px = CAMP_FIRE.x * T - camX;
  const py = CAMP_FIRE.y * T - camY;
  const dh = CAMP_FIRE.x * 19 + CAMP_FIRE.y * 37;
  // 暖橙光晕（村居窗光同族：rgba(255,200,90,α)）
  CTX.fillStyle = 'rgba(255,200,90,.25)';
  CTX.fillRect(px + 5, py + 3, 22, 22);
  // 石圈（村井石色同族）
  CTX.fillStyle = '#6a6f78';
  CTX.fillRect(px + 3, py + 23, 4, 4);
  CTX.fillRect(px + 25, py + 23, 4, 4);
  CTX.fillStyle = '#8a9098';
  CTX.fillRect(px + 5, py + 27, 5, 2);
  CTX.fillRect(px + 22, py + 27, 5, 2);
  // 交叉柴堆（辘轳/星砂车木料同族）
  CTX.fillStyle = '#6b5138';
  CTX.fillRect(px + 8, py + 21, 16, 3);
  CTX.fillRect(px + 15, py + 18, 3, 6);
  CTX.fillStyle = '#8a5a2b';
  CTX.fillRect(px + 13, py + 19, 7, 2);
  // 火焰（灯油金 + 金白焰心——镇子的灯烧灯油，林间营火同一盏油）
  CTX.fillStyle = '#ffd24a';
  CTX.fillRect(px + 11, py + 8, 10, 13);
  CTX.fillRect(px + 14, py + 5, 4, 4);
  CTX.fillStyle = '#ffe9a8';
  CTX.fillRect(px + 13, py + 12, 6, 8);
  CTX.fillRect(px + 15, py + 9, 2, 4);
  // 余烬（深金）
  CTX.fillStyle = '#8a5a00';
  CTX.fillRect(px + 12, py + 21, 2, 2);
  CTX.fillRect(px + 18, py + 20, 2, 2);
  // 火星（金白·坐标哈希确定性）
  CTX.fillStyle = '#ffe9a8';
  CTX.fillRect(px + 8 + (dh % 3), py + 6, 1, 1);
  CTX.fillRect(px + 20 + (dh % 2), py + 3, 1, 1);
}

// v23.28 幽冥魔王祭坛（新内容·世界景观·纯显示，承 v22.62 终焉之神祭坛补脸先例的收口）：雾语林 BOSS
// 瓦片 (20,13)-(20,14) 2×1 纵排的祭坛此前与 v22.62 修复前的水晶/祭坛一样共用通用门贴图——v22.62 只给
// 两块 SB（终焉水晶/终焉之神祭坛）补了脸，全游第一块强敌地标（守夜人「影子爬上祭坛时袍子还是旧灯卫的
// 袍子」/巡灯人「我见过祭坛上的影子」/掌灯阿婆「旧灯卫变的」）却仍是「门」；现按 data.js BOSS_ALTAR
// 单一数据源分档补脸（状态与 ALTAR_TAG done 判定/胜利画面「灯芯回来了」同读 S.G 一份源两档）：32×64
// 纵排石砌祭坛（台面 #5a6472/台身 #3a4148/台基 #2e333c，名字之门/石碑灰石同族——整幅盖住通用门贴图）
// 上立旧灯卫的铜灯（铜 #8a5a2b/暗铜 #6b5138，村井辘轳/星砂车木料同族）：未战「一截还没灭的灯芯」——
// 灯油金 #ffd24a 芯火 + 金白 #ffe9a8 焰心 + rgba(255,210,74,.2) 金晕（营火/大灯/菌盖同族）+
// 火星金白（坐标哈希确定性）；bossDefeated 后灰芯 #5a6472·#39414f 零光零晕（「灯芯回来了」同口径）。
// 几何确定性零时间依赖（不含 ph）；纯显示零结算零存档零数值变化（BOSS 不在 SOLID、踩踏开战/遇敌/传送
// 判定逐字未动，不设小地图标记——无决策信息，与水晶/祭坛/星砂车同口径）。
function drawBossAltar(camX, camY) {
  const px = BOSS_ALTAR.x * T - camX;
  const py = BOSS_ALTAR.y * T - camY;
  const cx = px + 16;
  const dh = BOSS_ALTAR.x * 19 + BOSS_ALTAR.y * 37;
  // 石台整幅（盖住通用门贴图）：台身/台面/台基
  CTX.fillStyle = '#3a4148';
  CTX.fillRect(px, py, 32, 64);
  CTX.fillStyle = '#5a6472';
  CTX.fillRect(px, py + 6, 32, 4);
  CTX.fillStyle = '#5a6472';
  CTX.fillRect(px + 3, py + 6, 26, 1);
  CTX.fillStyle = '#2e333c';
  CTX.fillRect(px, py + 58, 32, 6);
  // 旧灯卫的铜灯（灯油家族木料同族）：灯盏/灯柱/底座
  CTX.fillStyle = '#6b5138';
  CTX.fillRect(cx - 6, py + 8, 12, 4);
  CTX.fillStyle = '#8a5a2b';
  CTX.fillRect(cx - 6, py + 8, 12, 1);
  CTX.fillStyle = '#8a5a2b';
  CTX.fillRect(cx - 2, py + 12, 4, 34);
  CTX.fillStyle = '#6b5138';
  CTX.fillRect(cx - 4, py + 46, 8, 4);
  if (bossAltarState(S.G) === 'lit') {
    // 未战：芯火未灭（灯油金 + 金白焰心 + 金晕——营火/大灯/菌盖同族，「手里握着一截还在烧的灯芯」）
    CTX.fillStyle = 'rgba(255,210,74,.2)';
    CTX.fillRect(px + 4, py + 2, 24, 12);
    CTX.fillStyle = '#ffd24a';
    CTX.fillRect(cx - 2, py + 2, 4, 6);
    CTX.fillStyle = '#ffe9a8';
    CTX.fillRect(cx - 1, py + 3, 2, 4);
    CTX.fillStyle = '#ffe9a8';
    CTX.fillRect(px + 6 + (dh % 3), py + 4, 1, 1);
  } else {
    // 战后：灯芯熄了（灰芯零光零晕——「灯芯回来了」）
    CTX.fillStyle = '#5a6472';
    CTX.fillRect(cx - 2, py + 2, 4, 6);
    CTX.fillStyle = '#39414f';
    CTX.fillRect(cx - 2, py + 6, 4, 2);
  }
}

// v23.28 洞窟领主祭坛（新内容·世界景观·纯显示，承 v22.62 终焉之神祭坛同款先例的收口）：星井矿脉 MB
// 瓦片 (20,8)-(20,9) 2×1 纵排的祭坛此前同样只有通用门贴图——「迷你Boss」洞窟领主（星砂车夫「它霸着
// 矿脉，也霸着那车没运走的星砂——镇上的灯就缺这一车」/守洞人预习台词「雷鸣劈它，比别的招都疼」）
// 没有一张自己的脸；现按 data.js MB_ALTAR 单一数据源分档补脸（状态与 ALTAR_TAG done 判定同读
// S.G 一份源两档）：32×64 纵排岩地盘面（#2a2f38 + #333a45 岩块，与周格 CAVE 地面同色同纹——盖住
// 通用门贴图）+ 中央石台（#1c222c/#262d3a，终焉之神祭坛同族）上立断裂矿镐（柄 #6b5138/镐头残段
// #8a5a2b，木料同族）+ 碎石（#5a6472/#3a4148）：未战星砂微光 rgba(95,216,255,.18) 光晕 + #cfeaff
// 浮光（星井/星砂车亮档同族）/caveBoss 后零蓝零晕（星砂车卸空/星砂堆不亮同族）。纯显示零结算零存档
// 零数值变化（MB 不在 SOLID、踩踏/遇敌/传送判定逐字未动，不设小地图标记）。
function drawMbAltar(camX, camY) {
  const px = MB_ALTAR.x * T - camX;
  const py = MB_ALTAR.y * T - camY;
  const cx = px + 16;
  // 岩地盘面整幅（与周格 CAVE 同色同纹——盖住通用门贴图）
  CTX.fillStyle = '#2a2f38';
  CTX.fillRect(px, py, 32, 64);
  CTX.fillStyle = '#333a45';
  CTX.fillRect(px + 3, py + 3, 6, 4);
  CTX.fillRect(px + 20, py + 14, 7, 5);
  CTX.fillRect(px + 9, py + 46, 8, 5);
  // 中央石台（终焉之神祭坛同族）
  CTX.fillStyle = '#1c222c';
  CTX.fillRect(px + 5, py + 20, 22, 28);
  CTX.fillStyle = '#262d3a';
  CTX.fillRect(px + 5, py + 20, 22, 2);
  // 断裂矿镐（木料同族）：镐头残段/断口/半截柄
  CTX.fillStyle = '#8a5a2b';
  CTX.fillRect(cx - 8, py + 10, 9, 4);
  CTX.fillStyle = '#5a6472';
  CTX.fillRect(cx + 1, py + 10, 3, 3);
  CTX.fillStyle = '#6b5138';
  CTX.fillRect(cx - 1, py + 13, 3, 15);
  // 碎石（灰石族）
  CTX.fillStyle = '#5a6472';
  CTX.fillRect(cx - 9, py + 32, 3, 3);
  CTX.fillStyle = '#3a4148';
  CTX.fillRect(cx + 7, py + 38, 2, 2);
  if (mbAltarState(S.G) === 'lit') {
    // 未战：星砂微光（星井/星砂车亮档同族）
    CTX.fillStyle = 'rgba(95,216,255,.18)';
    CTX.fillRect(px + 6, py + 6, 20, 10);
    CTX.fillStyle = '#cfeaff';
    CTX.fillRect(px + 8, py + 14, 1, 1);
    CTX.fillRect(px + 22, py + 8, 1, 1);
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
  // v21.32 面向提示 E 键口径收尾（体验打磨·可发现性，承 v21.29 大地图 E 交互别名 / v21.30 教程行同口径）：
  // v21.29 起 Enter 与 E 同效调用 interact（NPC/商店/旅馆/酿造/读碑/祭坛/传送门），README 快速上手表、
  // H 页「对话 / 确认」行、新手教程三处都已同步为 Enter/E——唯独本提示（世界画面玩家正盯着的那一行）仍只
  // 画「⏎」：玩家按提示按 ⏎ 之外、按文档用 E 时，面前提示与真实输入对不上号；现把交互类提示统一改为
  // 「⏎/E」（符号口径与「Enter / E」逐字同源，踩踏类提示——喷泉/宝箱/祭坛/试炼碑/传送门——仍是踩上触发、
  // 不改）。纯显示零结算：不影响 interact/onStep/任何判定与数值。
  let lab = null;
  if (tile === TY.NPC) {
    const nid = NPC_SPOTS[x + ',' + y];
    const nm = (nid && NPCS[nid]) ? NPCS[nid].name : '';
    lab = nm ? ('⏎/E 对话 · ' + nm) : '⏎/E 对话';
  } else if (tile === TY.SHOP) lab = '⏎/E 商店';
  else if (tile === TY.INN) lab = '⏎/E 旅馆';
  else if (tile === TY.BREW) lab = '⏎/E 酿造';
  else if (tile === TY.STELE) lab = '⏎/E 读碑 · 名字石碑';
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
  // v21.85 试炼碑面向提示随 rushDone 分档（体验打磨·信息透明·状态如实）：碑上标签分档后，脚下方框
  // 提示仍恒「踩上挑战」——已通关玩家面向碑看到「挑战」，踩上去却只是再打一遍（且仍发奖），
  // 与「✅ 已通关（可再战）」标签口径不一致；现按同一份 S.G.rushDone 分档「踩上挑战 / 踩上再战」，
  // 零结算零数值零存档变化（踏碑判定 onStep→onTrialStele 逐字未动）。
  else if (tile === TY.TRIAL && S.G.bossDefeated && S.G.caveBoss) lab = S.G.rushDone ? '踩上再战' : '踩上挑战';
  else if (tile === TY.GATE) {
    // 传送门锁定判定（单一数据源）：与 world.usePortal 同读 MAPS[].portals.GATE.locked(g)——
    // 此前这里裸写「curMap()==='village' && S.G.bossDefeated」硬编码在视图层、与 usePortal 读表的
    // 判定互不引用（想给别的门加锁/换锁条件要改两处，还极易只改结算漏改提示）；
    // 且锁定时完全不显示任何面向提示——面向锁着的村门没有任何交互反馈（踩上去才弹 lockedMsg），
    // 无法从「门是亮的还是暗的」判断它通不通。现直读表：锁定时给「⛔ 门锁着」提示，未锁照旧。
    const gate = (MAPS[curMap()].portals || {}).GATE;
    if (gate && gate.locked && gate.locked(S.G)) {
      lab = '⛔ 门锁着';
    } else {
      const dest = portalDest(curMap(), TY.GATE);
      lab = (dest && MAPS[dest]) ? `踩上通行 → ${MAPS[dest].name}` : '踩上通行';
    }
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
  // v22.36 小地图大灯标记（与画布大灯同档位、同读 VILLAGE_LAMP 单一数据源）：灯在（bossDefeated）→
  // 暖金 #ffd24a（与 NPC 任务标/宝箱引导同族色），灯熄 → 冷灰 #7b7a84（「灯熄了」在小地图也一眼可见）；
  // 只读 hero.bossDefeated 旗标，纯显示零结算零存档。
  if (curMap() === 'village' && tile === TY.PATH && x === VILLAGE_LAMP.x && y === VILLAGE_LAMP.y) {
    return (hero && hero.bossDefeated) ? '#ffd24a' : '#7b7a84';
  }
  if (tile === TY.TOWN || tile === TY.PATH) return '#7d6b49';
  if (tile === TY.BOSS) return '#a03fd9';
  if (tile === TY.SHOP) return '#ffd24a';
  if (tile === TY.INN) return '#7a8aa0';
  if (tile === TY.FOUNTAIN) return '#62c6ff';
  if (tile === TY.BREW) return '#8fd86f';
  if (tile === TY.NPC) {
    // v22.35 小地图 NPC 任务标（体验打磨·信息透明·纯显示）：世界画面有 ❕ 顶标
    // （drawQuestMark，npcQuestMark 单一数据源）指示「该找谁接/交任务」，小地图上所有 NPC
    // 却一律米色 #e8c9a0——扫小地图规划动线时看不出哪个人有委托待办；现与画布那侧同读
    // npcQuestMark(hero, NPC_SPOTS[x+','+y])（quests.js 的 npcQuestMark 与 data.js 的
    // NPC_SPOTS 本文件均已 import，零新增依赖），有可接/可交任务的 NPC 在小地图上金光脉动
    //（与未开宝箱引导态同款 UI_PULSE_MS 呼吸、同族色 #ffd24a/#8a5a00，但仅 NPC 格触发），
    // 纯显示零结算零存档零数值变化。
    const qid = NPC_SPOTS[x + ',' + y];
    if (qid && npcQuestMark(hero, qid)) {
      return (Math.floor(Date.now() / UI_PULSE_MS) % 2 === 0) ? '#ffd24a' : '#8a5a00';
    }
    return '#e8c9a0';
  }
  if (tile === TY.MB) return (hero && hero.caveBoss) ? '#39414f' : '#b06ff0';
  if (tile === TY.SB) return (hero && hero.trueBoss) ? '#39414f' : '#ffe94a';
  if (tile === TY.TRIAL) return '#4fd8ff';
  // v22.38 小地图星井标记（与画布星井同档位、同读 CAVE_WELL 单一数据源）：低鸣（trueBoss 前）→
  // 星蓝 #9adcff（井底还在响，星砂蓝光族，与泉水蓝/试炼青同蓝青族），静默（trueBoss 后）→
  // 深灰 #5a6472（「井也不鸣了」，与大灯熄冷灰同灰族）；只读 hero.trueBoss 旗标，纯显示零结算零存档。
  if (curMap() === 'cave' && tile === TY.CAVE && x === CAVE_WELL.x && y === CAVE_WELL.y) {
    return (hero && hero.trueBoss) ? '#5a6472' : '#9adcff';
  }
  if (tile === TY.CAVE) return '#39414f';
  if (tile === TY.CAVEWALL) return '#151a22';
  if (tile === TY.STELE) return '#9aa4ad';
  if (tile === TY.GATE || tile === TY.EXIT) return '#4a90d9';
  // 未开启宝箱常驻暖金色（信息透明·纯显示）：世界画面始终画着宝箱精灵（TILE_PROP），
  // 小地图此前却与草地同色（#2f6b2f 一色到底）——未开启的宝箱除非处于蘑菇支线/洞窟宝藏的
  // 「金光脉动」引导态，否则在小地图上完全隐形，玩家扫小地图看不出「哪还有宝可开」；
  // 现区分三态：未开启且处引导态→维持既有金光脉动（v3.x 蘑菇支线 + v3.36 洞窟宝藏同判）、
  // 未开启的常态→常驻暖金 #c9a86a、开启过（hero.chests 已有该坐标）→回草地色。三态都只读
  // hero.chests / 任务态，与画布那侧 TILE_CHEST_OPEN 同源，纯显示零结算变化。
  if (tile === TY.CHEST && hero && !hero.chests.has(x + ',' + y)) {
    const guided = (hero.quests && hero.quests.side_mushroom === 'active') || hero.caveBoss;
    if (guided) return (Math.floor(Date.now() / UI_PULSE_MS) % 2 === 0) ? '#ffd24a' : '#8a5a00';
    return '#c9a86a';
  }
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
    // v22.44 小地图「全域危险」标注（体验打磨·信息透明·纯显示，承 v22.37 图例/v22.40 高草显形/
    // v22.43 机制行同一「危险格看得见→读得懂」主线的视觉收口）：危险红点只叠涂在「危险格占可走格
    // ≤50%」的混合地形（v19.x 阈值）——雾语林/星井矿脉/无字回廊全图皆危险（dangerAt 实扫占比
    // 89%/96.5%/96.8%）恰恰越过阈值不叠红点，玩家只见遇敌槽涨、却看不出「这整张图都是危险格」；
    // 现用同一趟 dangerAt 遍历的同一组计数（与红点判定互补：danger > walkable*0.5 即红点被抑制的
    // 全域危险档）在遇敌槽标签补「· 全域危险」（与 v22.43 帮助页「雾语林/矿脉/回廊全图皆危险格」
    // 同口径），纯显示零结算零存档零数值变化（dangerAt/遇敌/踩踏/传送判定逐字未动，红点阈值
    // `danger <= walkable * 0.5` 逐字未动，两档互补覆盖 danger>0 的全部情形）。
    const fullDanger = walkable > 0 && danger > walkable * 0.5;
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
    // v23.35 体验打磨·信息透明·纯显示：遇敌槽标签补「当前昼夜相位倍率」（承 v23.31 昼夜接入机制 /
    // v22.44 全域危险标注同一「遇敌槽看得见→读得懂」主线收口）——v23.31 起夜晚危险格步进 ×1.25、
    // 黎明 ×0.85，H 页机制行/README 数值速查早有口径，唯独小地图遇敌槽（玩家盯着它涨的现场）不标
    // 当前倍率：夜晚涨得比白天快 25%、黎明慢 15%，玩家只看到 % 涨速变了却不知道此刻 ×N；现与
    // world.tickEncounter 同读 ENCOUNTER.phaseGauge + dayPhase() 一份单一数据源（乘数由 phaseGauge
    // 派生零裸字面量；🌙夜/🌅黎 为视图层短标签，与 hud.js PERIOD 同款显示映射风格——显示映射非数据），
    // 乘数=1 的白天/黄昏与无字回廊恒暗例外（curMap()==='gallery'→1，与 tickEncounter 同判）零噪音
    // 不显示；纯显示零结算零存档零数值变化（遇敌槽累加/触发/喷泉/安全格逐字未动）。
    const phaseK = curMap() === 'gallery' ? 1 : ((ENCOUNTER.phaseGauge || {})[dayPhase((S.G && S.G.time) || 0)] || 1);
    const phaseTag = phaseK !== 1 ? ` · ${({ night: '🌙夜', dawn: '🌅黎' })[dayPhase((S.G && S.G.time) || 0)] || ''}×${phaseK}` : '';
    const encLab = `遇敌 ${Math.round(encPct)}%${phaseTag}${encDanger ? ' ⚠️ 危险逼近' : ''}${fullDanger ? ' · 全域危险' : ''}`;
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
  // v22.36 广场大灯（纯显示·先于角色层）：三档状态光效见 drawVillageLamp 注释；位置读
  // data.js VILLAGE_LAMP 单一数据源。只读旗标，零结算零存档（与祭坛熄灭/灯长台词/胜利画面同源口径）。
  // v22.47 村井（纯显示·同层先于角色）：两档状态光效见 drawVillageWell 注释；位置读 data.js
  // VILLAGE_WELL 单一数据源。只读旗标，零结算零存档（与星井同读 S.G.trueBoss 一份源两档）。
  if (S.G && curMap() === 'village') drawVillageLamp(c.x, c.y);
  if (S.G && curMap() === 'village') drawVillageWell(c.x, c.y);
  // v22.52 矿车轨道（纯显示·先于星井/星砂车层）：轨道铺在岩地上（轨下无井无车——CAVE_RAIL 与
  // CAVE_WELL/CAVE_CART 无同格），先画轨道再画井/车，车驶过的路线一眼可见。位置读 data.js
  // CAVE_RAIL 单一数据源（= MAPS.cave.rows '.' 扫描），零结算零存档（见 drawCaveRail 注释）。
  if (S.G && curMap() === 'cave') drawCaveRail(c.x, c.y);
  // v22.38 星井（纯显示·先于角色层）：两档状态光效见 drawCaveWell 注释；位置读 data.js CAVE_WELL
  // 单一数据源。只读旗标，零结算零存档（与灯长台词「井还在低鸣/井也不鸣了」同源口径）。
  if (S.G && curMap() === 'cave') drawCaveWell(c.x, c.y);
  // v22.39 星砂车（纯显示·先于角色层）：两档状态光效见 drawCaveCart 注释；位置读 data.js CAVE_CART
  // 单一数据源。只读旗标，零结算零存档（与星井同读 S.G.trueBoss 一份源两档）。
  if (S.G && curMap() === 'cave') drawCaveCart(c.x, c.y);
  // v22.59 星砂堆（纯显示·先于角色层，承 v22.38 星井/v22.39 星砂车同一「名字物补脸」主线的收口）：
  // 两档状态光效见 drawCaveSand 注释；位置读 data.js CAVE_SAND 单一数据源。只读旗标，零结算零存档
  // （与星井/星砂车同读 S.G.trueBoss 一份源两档——筛砂人 after「砂堆不亮了」同口径）。
  if (S.G && curMap() === 'cave') drawCaveSand(c.x, c.y);
  // v23.28 洞窟领主祭坛（纯显示·先于角色层）：位置读 data.js MB_ALTAR 单一数据源（状态与 ALTAR_TAG
  // done 判定同读 S.G 一份源两档——纯显示，先于星砂宝箱层）。
  if (S.G && curMap() === 'cave') drawMbAltar(c.x, c.y);
  // v22.41 名字之门（纯显示·先于角色层）：两档状态光效见 drawGalleryArch 注释；位置读 data.js
  // GALLERY_ARCH 单一数据源。只读旗标，零结算零存档（与守名者 done「名字回灯下」同读 S.G.trueBoss
  // 一份源两档）。
  if (S.G && curMap() === 'gallery') drawGalleryArch(c.x, c.y);
  // v22.56 雾语林营地篝火（纯显示·先于角色层）：位置读 data.js CAMP_FIRE 单一数据源。零结算零存档
  // （与泉水/菌盖/高草同层的地貌——林间雨幕之下营火仍燃，镇子灯油之火的设定同源）。
  if (S.G && curMap() === 'dungeon') drawCampFire(c.x, c.y);
  // v23.28 幽冥魔王祭坛（纯显示·先于角色层，承 v22.62 补脸先例的收口）：位置读 data.js BOSS_ALTAR
  // 单一数据源（状态与 ALTAR_TAG done/「灯芯回来了」同读 S.G 一份源两档——纯显示）。
  if (S.G && curMap() === 'dungeon') drawBossAltar(c.x, c.y);
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
        // v19.52 试炼阵容预览（信息透明·纯显示）：试炼碑此前只标「⚔️ 试炼·可挑战 / 试炼·未解锁」，
        // 完全看不出碑里埋着哪三名强敌——凑齐双徽记的玩家踩碑前既不知道「要连续打三场」的三位是谁、
        // 也不知道各自什么等级（帮助页只笼统写「连战三名最强 Boss」），是「信息透明」主题里仅存的黑盒之一。
        // 现直接列阵容：顺序与 battle.startRush 同读 RUSH_BOSSES 单一数据源，推荐等级与战斗 enemyLv / 祭坛
        // ⚠Lv 标签同读 SPECIES[].lv（真身/普通同名归一），阵容/等级永不漂移。只读不改，零结算变化。
        const roster = RUSH_BOSSES.map((b) => `${b.name}Lv${(SPECIES[b.name] && SPECIES[b.name].lv) || 1}`).join('→');
        // v19.60 试炼奖励预告（信息透明·纯显示）：v19.52 列阵容时漏掉的另一半——「三连战通关奖多少钱」
        // 只在进入试炼战后的战斗预览里才显示（drawBattle 读同源 rushReward），玩家在碑前做「值不值得开打」
        // 决策时它仍是黑盒；现与阵容同挂在碑上、同读 rules.rushReward(玩家当前等级) 单一数据源（与
        // battle.winBattle 结算 / drawBattle 战斗预览逐字同源，随等级实时显示）。只读不改、零结算变化。
        // v21.46 碑上标签补「建议Lv.N」（信息透明收口·承 v19.52/v19.60）：此前阵容（各关 Lv）与赏金都上了碑，
        // 唯独「该练到多少级再来」仍是黑盒——末位「终焉之神Lv12」的推断留给玩家；现追加由 RUSH_REC_LV 派生的
        // 显式推荐等级（与守碑人台词/H 页同读同一常量，调任一 Boss 的 lv 只改 data.js 一处、三端同步）。
        // v21.85 试炼碑通关后状态如实分档（体验打磨·信息透明·状态如实，承 v19.52 阵容预览 /
        // v19.60 奖励预告 / v21.46 推荐等级 / 强敌祭坛「击败自动熄灭」同主线）：碑上标签此前只有
        // 未解锁/可挑战默认档——玩家已通关试炼（hero.rushDone，「百炼成钢」落袋）后碑上仍挂
        // 「⚔️ 试炼三连战 + 通关奖」的新挑战档，与祭坛击败熄灯、已开宝箱等同图状态展示口径不一致，
        // 「还能不能再打/还能不能再拿奖」无从判断（battle.winBattle 试炼分支无 rushDone 守卫——
        // 再战确实仍发全额通关奖，属既有设计行为，本版不改结算）；现按 rushDone 分档：已通关标
        // 「✅ …已通关（可再战）」、奖励行标「💰 再战通关奖 …（随等级）」（如实注明重复性），
        // 未通关档逐字零回归。纯显示零结算零数值零存档变化（只读 S.G.rushDone，与成就/徽记/守碑人
        // 同读一份源）。
        const lab = !ready ? '试炼·未解锁'
          : (S.G.rushDone ? `✅ 试炼三连战 · 已通关（可再战）` : `⚔️ 试炼三连战 ${roster} · 建议Lv.${RUSH_REC_LV}`);
        const lx = x * T - c.x + T / 2;
        const ly = y * T - c.y;
        // v24.00 试炼碑等级达标预警（体验打磨·信息透明·决策现场，承 v21.92 快速旅行目的地等级预警同一
        // 「决策现场一眼看清够不够格」主线）：碑上标签 v21.46 起只报「建议Lv.N」（与守碑人台词/H 页同读
        // RUSH_REC_LV 一份源），唯独不报「你当前几级」——Lv.6 玩家站在碑前只知道该 12 级、不知道差 6 级，
        // 与 v21.92 红色预警行同款缺口形态（踩上即开战、无可反悔，级别差却查无一眼之数）；现 ready 态且
        // S.G.level < RUSH_REC_LV 时于主标签上方追加红色预警行「⚠️ 建议 Lv.N · 你当前 Lv.M · 差 K 级」
        // （N/M/K 全由 RUSH_REC_LV 与 S.G.level 单一数据源派生，与 v21.92 红字同色 #ff5b5b，达标/已通关
        // 超额零噪音——与快速旅行预警同「未达标才报」口径；主标签/通关奖行/未解锁档逐字未动），
        // 纯显示零结算零存档零数值变化（只读 S.G.level，与成就/守碑人/试炼结算零接触）。
        if (ready && S.G.level < RUSH_REC_LV) {
          const warn = '⚠️ 建议 Lv.' + RUSH_REC_LV + ' · 你当前 Lv.' + S.G.level + ' · 差 ' + (RUSH_REC_LV - S.G.level) + ' 级';
          CTX.font = '12px sans-serif';
          const ww = CTX.measureText(warn).width + 12;
          CTX.fillStyle = 'rgba(10,16,24,.88)';
          rr(lx - ww / 2, ly - 44, ww, 17, 4);
          CTX.fill();
          CTX.fillStyle = '#ff5b5b';
          CTX.textAlign = 'center';
          CTX.fillText(warn, lx, ly - 31);
        }
        CTX.font = 'bold 12px sans-serif';
        const w = CTX.measureText(lab).width + 12;
        CTX.fillStyle = ready ? 'rgba(45,150,82,.92)' : 'rgba(145,120,65,.92)';
        rr(lx - w / 2, ly - 22, w, 17, 4);
        CTX.fill();
        CTX.fillStyle = '#fff';
        CTX.textAlign = 'center';
        CTX.fillText(lab, lx, ly - 9);
        if (ready) {
          // v21.85 奖励行随 rushDone 分档：已通关档如实标注「再战」（winBattle 无 rushDone 守卫，
          // 再战仍发全额通关奖——与状态标签同口径如实展示，不藏不误导）；未通关档逐字零回归。
          const rewLab = (S.G.rushDone
            ? `💰 再战通关奖 ${rushReward(S.G.level)} 金（随等级）`
            : `💰 通关奖 ${rushReward(S.G.level)} 金（随等级）`);
          const rw = CTX.measureText(rewLab).width + 12;
          CTX.fillStyle = 'rgba(10,16,24,.88)';
          rr(lx - rw / 2, ly + 2, rw, 17, 4);
          CTX.fill();
          CTX.strokeStyle = 'rgba(255,210,74,.55)';
          CTX.lineWidth = 1;
          rr(lx - rw / 2, ly + 2, rw, 17, 4);
          CTX.stroke();
          CTX.fillStyle = '#ffd24a';
          CTX.fillText(rewLab, lx, ly + 14);
        }
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
