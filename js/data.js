// ============================================================
// data.js —— 纯数据 / 纯函数（不读 S、不读 G）
// ============================================================

const T=32;

const MAPS={
  // 潮灯镇（v13.5 重排）：广场大灯地标居中，商店/旅馆/酿造环广场，井在广场北，东门出镇
  village:{
    name:'潮灯镇',
    // 区域修正：镇内及其周边魔物偏弱（battle.randomEncounter 与 HUD 同读此源）
    zone:{ label:'安宁之地', hp:0.9, atk:0.9 },
    // 传送门（单一数据源）：world.usePortal 与视图「踩上通行 → XX」提示同读此表
    // locked(g) 返回真则拒绝通行并显示 lockedMsg（击败魔王后村门只提示不传送）
    portals:{
      GATE:{ to:'dungeon', locked:(g)=>!!g.bossDefeated,
             lockedMsg:'雾退了。祭坛上的锁已经开了。可井还在响。' },
    },
    rows:[
      "111111111111111111111111",
      "1444441000000000000000C1",
      "144444100000000000000001",
      "14444410000000000G000001",
      "1000001000000000GGG00001",
      "10000010000000000G000001",
      "100000100000F00033300001",
      "1000001000..003330000001",
      "10000014440.000000000001",
      "10000014S4..........D001",
      "10000014440.000000000001",
      "1000000000.0000000000001",
      "1000001000.000000GGG0001",
      "1IIIII1000.00000GGGGG001",
      "1IIIII1.....00GGGGG00001",
      "1IIIII1000.0000GGG000001",
      "1000001000.00000000000C1",
      "111111111111111111111111",
    ],
    playerStart: { x: 10, y: 15 },
    extras: [
      { x: 13, y: 6, ty: 'NPC' },   // 灯长（井边）
      { x: 10, y: 13, ty: 'NPC' },  // 镇民（酿造旁）
      { x: 19, y: 8, ty: 'NPC' },   // 巡灯人（城门动线）
      { x: 2, y: 4, ty: 'NPC' },    // 井巫（民宅区南）
      { x: 10, y: 12, ty: 'BREW' }, // 酿造锅（广场南）
    ],
  },
  // 雾语林（v13.5 重排）：西入口 → 蛇形主路 → 中段营地（泉水+猎手）→ 北环路蘑菇宝箱 → 东祭坛，裂洞在祭坛南
  dungeon:{
    name:'雾语林',
    portals:{
      GATE:{ to:'cave' },
      EXIT:{ to:'village' },
    },
    // 全图草地均为危险格（world.dangerAt 同读；'G' 高草在全图通用危险）
    dangerTiles:[0],
    rows:[
      "111111111111111111111111",
      "1E0000111110000000000001",
      "1..0000111100000GGGGG001",
      "100.000111100000GGGGGG01",
      "1000.0011100000GGGGGGGC1",
      "10000.011000000GGGGGG001",
      "100000.00000000GGGGG0001",
      "1000000.0000000.GGG00001",
      "10000000.00000..00000001",
      "100000000.0000.000000001",
      "1100000000.00...00000001",
      "1110000000.0C.0000000001",
      "11110000000...0000000001",
      "111110000000.00000000001",
      "111111000000.00000000H01",
      "111111100000.00000000001",
      "1C0000000000.00000000001",
      "111111111111111111111111",
    ],
    playerStart: { x: 1, y: 2 },
    extras: [
      { x: 12, y: 9, ty: 'FOUNTAIN' }, // 营地泉水
      { x: 13, y: 9, ty: 'NPC' },      // 雾径猎手
      { x: 20, y: 13, ty: 'BOSS' },    // 幽冥魔王祭坛 2×1
      { x: 20, y: 14, ty: 'BOSS' },
    ],
  },
  // 星井矿脉（v13.5 重排）：轨道引导线贯穿——入口（井巫）→ 矿车区（车夫/试炼碑）→ 深处祭坛 → 中央水晶
  cave:{
    name:'星井矿脉',
    // 区域修正：高难区魔物更强，经验/金币同步上浮（battle.randomEncounter 与 HUD 同读此源）
    zone:{ label:'凶险之地', hp:1.2, atk:1.15, def:1.1, xp:1.15, gold:1.15 },
    portals:{
      EXIT:{ to:'dungeon' },
    },
    // 全图岩地均为危险格（world.dangerAt 同读；15 = TY.CAVE）
    dangerTiles:[15],
    rows:[
      "111111111111111111111111",
      "1E0000111100000000000001",
      "1....01111000000C0000001",
      "1.00.0111100000000000001",
      "1.000.111100000011111001",
      "1.0000.11100000011110001",
      "1.00000.1100000111100001",
      "1.000000.100001111000001",
      "1.0000000.0001111000M001",
      "1.00000000.001111000M001",
      "1.000000000..01100000001",
      "1............01100000001",
      "1C000000000.0110000T0001",
      "10000000000.000000000001",
      "111111111111111111111111",
    ],
    playerStart: { x: 1, y: 2 },
    extras: [
      { x: 3, y: 1, ty: 'NPC' },    // 井巫（入口点破）
      { x: 17, y: 11, ty: 'NPC' },  // 星砂车夫（矿车区）
      { x: 12, y: 11, ty: 'SB' },   // 终焉水晶（双徽记开门 → 无字回廊）
      { x: 18, y: 12, ty: 'TRIAL' },
    ],
    // 草地/树在洞窟里改成岩地/岩壁（ASCII 仍用 0 / 1 便于共用编辑）
    replaceTiles: { GRASS: 'CAVE', TREE: 'CAVEWALL', PATH: 'CAVE' },
    treasure: [[17, 8], [18, 8], [17, 9], [18, 9]],
  },
  // 无字回廊（v13.5 新图）：被忘掉的名字存放处——线性回廊 + 北壁 4 名字石碑 + 中段残焰魔像 + 东端终焉祭坛
  gallery:{
    name:'无字回廊',
    // 区域修正：终焉之地，魔物最凶（battle.randomEncounter 与 HUD 同读此源）
    zone:{ label:'忘却之地', hp:1.3, atk:1.2, def:1.15, xp:1.3, gold:1.3 },
    portals:{
      EXIT:{ to:'cave' },
    },
    // 全图暗岩地均为危险格；遇敌池限定（encounter.randomEncounter 同读）
    dangerTiles:[15],
    pool:['雾灵','石魔像','骷髅兵'],
    rows:[
      "111111111111111111111111",
      "100000000000000000000001",
      "101010101010101010101001",
      "100000000000000000000001",
      "1E.....................1",
      "100000000000000000000001",
      "101010101010101010101001",
      "100000000000000000000001",
      "111111111111111111111111",
    ],
    playerStart: { x: 2, y: 4 },
    extras: [
      { x: 5, y: 1, ty: 'STELE' },   // 名字石碑 ×4（北壁，内容与 FRAGMENTS 同源）
      { x: 10, y: 1, ty: 'STELE' },
      { x: 15, y: 1, ty: 'STELE' },
      { x: 20, y: 1, ty: 'STELE' },
      { x: 12, y: 4, ty: 'MB' },     // 残焰魔像（中段精英）
      { x: 21, y: 4, ty: 'SB' },     // 终焉之神祭坛（东端）
    ],
    replaceTiles: { GRASS: 'CAVE', TREE: 'CAVEWALL', PATH: 'CAVE' },
  },
};

// 遇敌槽增减与槽值（单一数据源）：world.tickEncounter 结算（累加/触发）与 view/drawWorld 小地图遇敌槽
// （clamp 与刻度分母、预警线、预警闪烁）同读此源——危险格 +10~18（dangerMin + [0,dangerVar) 随机）、喷泉 -25、其它可行走格 -6，
// 满 ENCOUNTER.full（=100）必遇敌。调「满槽 100 / 整体遇敌频率」只改这一处，绝无第二套口径；
// 预警线 ENCOUNTER.warn（=70）：小地图「⚠️ 危险逼近」高亮的读数临界值，同属于遇敌槽的口径——
// 此前与 full 一样游离在对象之外（v19.9 收口 full 时预留「另一语义」），现一并归入，调「何时亮危险预警」
// 也只改这一处。预警闪烁 ENCOUNTER.warnFlash（=330，单位 ms）：红色预警条的快闪开关周期
// Math.floor(Date.now()/warnFlash)%2，是遇敌槽读数可视反馈里最后一块裸奔数值（v19.9 收口 full、
// v19.12 收口 warn 后本家族最后一员——v19.12/v19.15 条目与 UI_PULSE_MS 注释都把它明确标为
// 「预警态闪烁 330ms」留白），现一并归入，调「⚠️ 危险逼近」快闪节奏也只改这一处。
// 数值逐字不变（满槽仍 100、预警线仍 70、预警闪烁仍 330），零遇敌/UI 回归。
const ENCOUNTER = { dangerMin: 10, dangerVar: 9, fountain: -25, calm: -6, full: 100, warn: 70, warnFlash: 330 };

const CAVE_TREASURE = MAPS.cave.treasure;
const INN_PRICE = 10;

// 酿造高级灵药配方（单一数据源）：core.brewNow 结算与 view/menus.drawBrew 配方文案/可酿判定/材料差额标注同读此源——
// 此前 2 株蘑菇 + 10 金硬编码在 brewNow（结算，< / -= 两判定两扣减）与 drawBrew（「配方：2 株蘑菇 + 10 金币」、
// 可酿判定 hero.mushrooms>=2&&hero.gold>=10、差额 max(0,2-…)/max(0,10-…)）两文件五处互不相关：想调配方（如改 3 株
// + 15 金）要改两个文件，还极易只改结算漏改文案，酿造成本变了界面却还标旧配方。
const BREW_MUSHROOMS = 2;   // 酿造一剂高级灵药所需魔法蘑菇株数
const BREW_GOLD = 10;       // 酿造一剂高级灵药所需金币

// 灯长蘑菇支线目标株数（单一数据源）：QUESTS.side_mushroom.n（任务条「X/3 株」经 quests.objectiveText 推导）、
// NPC 对话 offer/active 两处文案、world.js 开箱集齐转可交付判定（mushrooms >= 目标）、core.brewNow 与 shop.js 的
// 任务保护判定（mushrooms <= 目标，集齐前不可酿/不可卖）同读此源——此前这个 3 散落在 data/world/core/shop
// 四文件七处互不相关：想调支线目标（如放宽到 4 株）要改四处，还极易只改判定漏改文案，集齐 4 株界面却还标「/3 株」。
const MUSHROOM_GOAL = 3;    // 灯长支线需找回的魔法蘑菇株数（集齐后转可交付）

// 雾径猎手「雾里的新住客」支线目标只数（单一数据源）：QUESTS.side_mist 的讨伐条件（cond）、
// 实时进度（condProg「X/3 只」）、任务条目标文案（obj）、接取/交付对话（offer「帮我打 3 只回来」/
// turnin「3 只，干净利落」）同读此源——此前这个 3 硬编码在同一支线定义内五处互不相关：
// 想调支线目标（如改成 4 只）要改五个字符串，还极易只改判定漏改文案，集齐 4 只界面却还标「/3 只」
// （与 MUSHROOM_GOAL 同一「支线目标单一数据源」家族，雾灵/蘑菇两条收集型支线同口径）。
const MIST_GOAL = 3;        // 雾径猎手支线需讨伐的雾灵只数（bestiary 计数，集齐后转可交付）

// 蘑菇出售单价（单一数据源）：shop.sellMushroom 卖菇结账（扣株 + 得金）与提示文案、buildShopList 商店列表
// 卖出价签三处同读此源——此前这个 10 硬编码在 shop.js 三处互不相关（hero.gold += 10、'售出 1 株魔法蘑菇，
// 得 10 金'、'卖出魔法蘑菇 ×1 → 10金'）：想调卖菇价（如涨到 15）要改三处，还极易只改结账漏改价签/文案，
// 实际卖价改了列表价签却还标旧值；且同族的旅馆 INN_PRICE=10、酿造 BREW_GOLD=10、药水 POTION_PRICE=15 早已
// 收口，唯独卖菇价是经济循环里残存的裸奔数值。
const MUSHROOM_PRICE = 10;  // 卖出 1 株魔法蘑菇所得金币（出售方价格，任务保护期内不可卖）

const TY = {
  GRASS: 0, TREE: 1, ROCK: 2, WATER: 3, TOWN: 4, PATH: 5, CHEST: 6, BOSS: 7,
  FOUNTAIN: 8, SHOP: 9, INN: 10, GATE: 11, EXIT: 12, NPC: 13, BREW: 14,
  CAVE: 15, MB: 16, SB: 17, TRIAL: 18, CAVEWALL: 19, STELE: 20,
};

const CH_TO_TY = {
  '1': TY.TREE, '0': TY.GRASS, '2': TY.ROCK, '3': TY.WATER,
  '4': TY.TOWN, '.': TY.PATH, 'C': TY.CHEST, 'F': TY.FOUNTAIN,
  'S': TY.SHOP, 'I': TY.INN, 'G': TY.GRASS, 'D': TY.GATE,
  'E': TY.EXIT, 'H': TY.GATE, 'M': TY.MB, 'T': TY.SB, 'N': TY.NPC,
};
function chToTy(c) { return CH_TO_TY[c] ?? TY.GRASS; }

const SOLID = new Set([TY.TREE, TY.ROCK, TY.WATER, TY.NPC, TY.BREW, TY.CAVEWALL, TY.STELE]);

const NPC_SPOTS = {
  '13,6': 'chief',
  '10,13': 'villager',
  '19,8': 'adventurer',
  '2,4': 'sage',
  '13,9': 'hunter',
  '3,1': 'sage',
  '17,11': 'cartman',
  // 无字回廊名字石碑（STELE 瓦片，interact 读碑；内容与 FRAGMENTS 同源）
  '5,1': 'stele1',
  '10,1': 'stele2',
  '15,1': 'stele3',
  '20,1': 'stele4',
};

const NPCS={
  chief:{name:'灯长', mark:'staff'},
  villager:{name:'镇民', mark:'basket', lines:[
    ['镇民：雾语林深处那口泉水，能把忘了的名字烫回来。','灯灭之后，大家连回家的路都要数着走。','[Enter] 继续'],
    ['镇民：魔物是从雾里长出来的——像被丢掉的记忆。','出门前去杂货铺补药水。别在雾里睡着。','[Enter] 结束'],
  ], after:[
    ['镇民：雾散了。镇里的灯一盏盏亮回来，','连最旧的路灯都在认路。灯灭那阵子的事，','大家居然全都记得了。 [Enter] 继续'],
    ['镇民：魔物回雾里去了——像被丢掉的记忆','被人捡了回来。谢谢你，守灯人。','天还是半亮，可够把路看清了。 [Enter] 结束'],
  ]},
  adventurer:{name:'巡灯人', mark:'sword', linesByStage:[
    { gate:null, lines:[
      ['巡灯人：我见过祭坛上的影子。那不是深渊爬出来的。','它穿着旧灯卫的袍子，手里握着一截还在烧的灯芯。','[Enter] 继续'],
      ['巡灯人：传说打败它能夺回【圣光之剑】——','那不是神器，是被它装进剑里的黎明。','[Enter] 结束'],
    ]},
    { gate:'bossDefeated', lines:[
      ['巡灯人：剑里的黎明放出来了。可他连名字都没留下。','祭坛底下……井的方向，还有声音。','[Enter] 继续'],
      ['巡灯人：如果你捡到发着微光的碎片，别丢。','那是他被忘掉的部分。','[Enter] 结束'],
    ]},
    { gate:'galleryOpen', lines:[
      ['巡灯人：回廊开了？！镇上的老人说过——','名字被忘掉的人，都在那里躺着。','[Enter] 继续'],
      ['巡灯人：替我们跟他们问个好。','也替他自己。','[Enter] 结束'],
    ]},
  ], after:[
    ['巡灯人：剑还立在祭坛上，可里头的黎明放出来了。','他确是旧灯卫——把黎明封进剑里，','才保着这盏灯一路走到今天。 [Enter] 继续'],
    ['巡灯人：没人记得他的名字了。那名字，','如今归你替他记着。走夜路的时候，','灯提亮些。 [Enter] 结束'],
  ]},
  sage:{name:'井巫', mark:'hood', linesByStage:[
    // 揭示节奏（v13.x 剧情重构）：真相按主线进度分段，不再一次性剧透
    { gate:null, lines:[
      ['井巫：孩子，雾里那位不是从深渊爬出来的。','它是一把锁——锁着更深的东西。','[Enter] 继续'],
      ['井巫：等锁开了，再来找我。','到那时，井底的声音会比现在更近。','[Enter] 结束'],
    ]},
    { gate:'bossDefeated', lines:[
      ['井巫：锁开了。你听见了么——井底在响。','矿脉曾往镇上运星砂，喂那些记忆之灯。','[Enter] 继续'],
      ['井巫：洞窟领主霸着矿脉深处，','守着最后一车没运走的星砂。','去把它了结。 [Enter] 结束'],
    ]},
    { gate:'caveBoss', lines:[
      ['井巫：锁与守门的都断了，现在跟你说实话：','水晶里睡着的，才是灯自己——终焉之神。','[Enter] 继续'],
      ['井巫：祭坛后的水晶醒了。试炼碑要两枚徽记——','幽冥魔王与洞窟领主，你都有了。它不是考你的剑，','是在问：还愿不愿意记得。 [Enter] 结束'],
    ]},
  ], after:[
    ['井巫：水晶空了。星砂落回矿脉深处，像什么都没发生过。','可那粒亮着的芯子，是你从雾里一路带回来的。','[Enter] 继续'],
    ['井巫：你不知道自己守住了什么，这就对了。','记得的灯，从此由你掌着。 [Enter] 结束'],
  ]},
  hunter:{name:'雾径猎手', mark:'hat', linesByStage:[
    { gate:null, lines:[
      ['雾径猎手：守这片林子大半辈子。泉水还在，','喝一口，忘了的力气会回来。歇够再往祭坛走。','[Enter] 继续'],
      ['雾径猎手：草丛毒蛇牙上带毒，被咬就一路失血。','腹地石心魔像会凝石甲——旧矿的守门人走丢了。','备好药水再走！ [Enter] 结束'],
    ]},
    { gate:'galleryOpen', lines:[
      ['雾径猎手：林子里的雾灵忽然安静了，像被什么唤走了。','你把回廊的门打开了？','[Enter] 继续'],
      ['雾径猎手：去吧。守林人守林，守灯人——','守名字。','[Enter] 结束'],
    ]},
  ], after:[
    ['雾径猎手：雾退了，林子亮了，泉水还是那口泉水。','毒蛇回了草丛，石心魔像重新变回石头。','守了大半辈子，头回见它这么安静。 [Enter] 继续'],
    ['雾径猎手：魔物是雾里长出来的。雾一散，','它们便像被领回家的记忆，各归各位。','看灯的人多了你一个，守林人心里亮堂。 [Enter] 结束'],
  ]},
  cartman:{name:'星砂车夫', mark:'lamp', lines:[
    ['星砂车夫：这洞从前往镇上拉星砂，喂那些记忆之灯。','洞窟领主霸了矿脉后，没运走的一车星砂和金银，','被碎石埋在矿车边上。 [Enter] 继续'],
    ['星砂车夫：你若击败洞窟领主，碎石坍落，','那车货会在祭坛左边显形。打完别急着走，','记得回头把箱子开了。 [Enter] 结束'],
  ], after:[
    ['星砂车夫：矿脉安静了。星砂不再发亮——','不是灭了，是被记起来了。','[Enter] 结束'],
  ]},
};

const WEAPONS={
  '木剑':{atk:2,price:0},
  '铁剑':{atk:5,price:80},
  '秘银剑':{atk:9,price:220},
  '勇者之剑':{atk:15,price:600},
  '圣光之剑':{atk:24,price:0,legend:true},
};

const ARMORS={
  '布衣':{def:1,price:0},
  '皮甲':{def:4,price:60},
  '锁子甲':{def:8,price:180},
  '龙鳞甲':{def:13,price:480},
};

function baseStats(lv) {
  return { hpMax: 38 + lv * 7, mpMax: 12 + lv * 4, atk: 7 + lv * 2, def: 3 + lv * 2 };
}

// 每级基础成长（单一数据源）：由 baseStats 一阶差分得出（等级恒为 HP+7 / MP+4 / 攻+2 / 防+2）。
// 升级结算（hero.grantXp 的 dh/dm/da/dd）与创建页标注同源于 baseStats——改成长曲线只需改 baseStats 一处，
// 结算、胜利横幅、创建页绝无第二套口径。此前成长数值只在胜利横幅一闪而过，创建页看不到任何基础成长信息。
const LEVEL_GROWTH = {
  hp: baseStats(2).hpMax - baseStats(1).hpMax,
  mp: baseStats(2).mpMax - baseStats(1).mpMax,
  atk: baseStats(2).atk - baseStats(1).atk,
  def: baseStats(2).def - baseStats(1).def,
};

// 技能领悟表（单一数据源）：各等级领悟技能全表——含 1 级起始技能『火焰斩』。
// hero.checkSkills 的升级领悟与 core.newGame 建档起始技能（skills:[learnsAt(1)]）同读此源；
// 此前起始技能名只硬编码在 core.js newGame（skills:['火焰斩']），与其他四招的归属表分居两文件
// 互不相关：想换起始技能/重命名初招要改两处、还极易只改领悟表漏改建档，新档会带一个
// SKILL_DATA 里不存在的技能（技能菜单/状态页渲染空行）。收口后 起始技能与升级领悟 绝无第二套口径
// （与 DEFAULT_NAME / SKIP_CHANCE / PHASE2_AT 同一「单一数据源收口」体系）
const LEARN_AT = { 1: '火焰斩', 3: '冰霜击', 4: '治愈术', 5: '雷鸣', 7: '陨石术' };
function learnsAt(lv) { return LEARN_AT[lv] || null; }

// 技能领悟等级上界（单一数据源）：由 LEARN_AT 最大领悟等级推导——hero.skillXpHint 的
// 「距下一技能还差 N 经验」扫描上界同读此源——此前上界是 hero.js 里的裸 8（= 当时最末
// 领悟级 7 + 1）：想新增 9 级技能（或调整领悟表）时上界会悄然过期，新技能永远不被
// 「距下一技能」提示找到。收口后 扫描上界与领悟表绝无第二套口径（v17.7 LEARN_AT
// 单一数据源收口后，全库最后一段与技能领悟表相关的裸奔数值）
const MAX_LEARN_LV = Math.max(...Object.keys(LEARN_AT).map(Number));

// 经验曲线（单一数据源）：升级所需经验逐级 ×XP_GROW 取整——hero.grantXp 的升级结算
// 与 hero.skillXpHint 的「距下一技能还差 N 经验」预估同读此源；新档首级所需经验与预估兜底
// 同读 XP_INIT（core.newGame 建档 / skillXpHint 旧档缺字段兜底）。调经验曲线只改 data.js 一处，
// 结算与预估绝无第二套口径（与 CHARGE_MULT / DROP_* / POTION_* 同一体系）
const XP_GROW = 1.42;
const XP_INIT = 20;

// 新档开局经济/背包（单一数据源）：core.newGame 建档行同读此源——建档行三枚数值里
// XP_INIT（首级所需经验）早已数据化，唯独开局金币 30 / 生命药水 3 仍在 core.js 裸奔；
// 想调开局家底（如加码到 50 金、或轻装开局 1 瓶药水）只改 data.js 一处，建档与任何
// 展示口径绝无第二套数值（与 INN_PRICE / BREW_GOLD / POTION_PRICE 同一「经济数据化」体系）
const START_GOLD = 30;    // 新档开局金币
const START_POTIONS = 3;  // 新档开局生命药水

// 灼烧每回合扣血比例（单一数据源）：enemyAct 的灼烧结算 max(2, round(hpMax×此值)) 与
// 战斗画面角标「每回合 -N血」、火焰斩技能提示「约N%最大HP」同读此源——
// 此前 0.04 硬编码在 enemyAI.js / view/drawBattle.js 两处，data.js 提示再各写一句「约4%」，
// 想调灼烧强度要改三处且容易改漏改出对不上的文案；数据化后 结算、角标、提示 绝无第二套口径
// （与 CHARGE_MULT / DIFF_SCALE / FLEE_SUCCESS 同一体系）
const BURN_PCT = 0.04;

// 中毒每回合扣血比例 / 持续时间（单一数据源）：battle.applyPoisonTick 的毒素结算
// max(2, round(hpMax×此值)) 与 view/drawBattle.js 战斗角标「每回合 -N血」、
// enemyAI 施毒时的回合数、帮助页与图鉴「约N%最大HP…持续N回合」标注同读此源——
// 此前 0.05（扣血比例）硬编码在 battle.js / view/drawBattle.js 两处、3（持续回合）硬编码在
// enemyAI.js 一处，data.js 帮助页与毒蛇图鉴tag再各写一句字面量「约5%最大HP」「3回合」，
// 四处互不相关：想调中毒强度（如放宽到 6%）要改四个地方、还极易改漏让角标/帮助页对不上结算；
// 数据化后 结算、角标、施毒、标注 绝无第二套口径（与 BURN_PCT / CRIT_MULT / FLEE_SUCCESS 同一体系）
const POISON_PCT = 0.05;
const POISON_TURNS = 3;

// 灼烧/中毒每回合扣血下限（单一数据源）：enemyAI 灼烧结算、battle.applyPoisonTick 中毒结算、
// view/drawBattle 灼烧/中毒角标四处同读此源——此前 Math.max(2, round(hpMax×pct)) 的下限 2 硬编码在
// battle.js / enemyAI.js / drawBattle.js 三文件四处互不相关：想调 DoT 下限（如收紧到 1、放宽到 3）
// 要改四个地方，还极易只改结算漏改角标，实际扣血下限变了角标却还报 2（低 HP 怪结算已扣 3 角标仍标 2）；
// 数据化后 结算、角标 绝无第二套口径（与 BURN_PCT / POISON_PCT / POISON_TURNS 同一「持续伤害数据化」体系）。
const DOT_MIN = 2;   // 灼烧/中毒每回合扣血的下限值（hpMax 偏低时也至少扣这么多）
// 毒蛇施毒概率（单一数据源）：enemyAI 施毒判定 Math.random()<enemy.poison 与帮助页「毒蛇有 N% 概率」
// 标注同读此源——此前 0.35 硬编码在 data.js SPECIES['毒蛇'] 与 MON_BASE['毒蛇'] 两处，帮助页又经
// MON_BASE.find(...) 再绕一层取同一数值，三处互不相关：想调毒蛇施毒率（如降到 30%）要改两处定义、
// 帮助页还得记得同步，极易只改一处让实际概率与帮助页标注对不上；数据化后 施毒判定、两处定义、帮助页
// 标注 绝无第二套口径（与 POISON_PCT / POISON_TURNS / ELITE_CHANCE 同一「概率数据化」体系）。
// 注意：SPECIES / MON_BASE 顶层字面量 poison 会拼入此值，故必须定义在两表之前
const POISON_CHANCE = 0.35;

// 冰霜击冻结概率（单一数据源）：battle.playerAction 的冻结判定 Math.random()<skill.skip 与
// 技能提示 hint「N%冻结（跳过敌回合）」同读此源——此前 0.30 硬编码在 SKILL_DATA['冰霜击'] 的
// skip 字段与 hint 文案「30%冻结」两处各写一份（同对象内互不引用），想调冻结率（如降到 25%）
// 要改两个字段且极易改漏，实际触发率改了提示却还报旧值；数据化后 判定、提示 绝无第二套口径
// （与 BURN_PCT / POISON_CHANCE / ELITE_CHANCE 同一「概率数据化」体系）
const SKIP_CHANCE = 0.30;

const SKILL_DATA={
  '火焰斩':{mp:4,mult:1.8,kind:'atk',sfx:'fire',txt:'🗡️',element:'fire',burn:2,hint:'灼烧2回合·每回合约-' + Math.round(BURN_PCT * 100) + '%最大HP',colors:['#ff3b3b','#ff8a2c','#ffd24a']},
  '冰霜击':{mp:5,mult:2.2,kind:'atk',sfx:'ice',txt:'❄️',element:'ice',skip:SKIP_CHANCE,hint:Math.round(SKIP_CHANCE * 100) + '%冻结（跳过敌回合）',colors:['#5fd8ff','#9ff0ff','#3f8fe1']},
  '雷鸣':  {mp:8,mult:2.8,kind:'atk',sfx:'thunder',txt:'⚡',element:'thunder',pierce:0.5,hint:'穿透一半防御',colors:['#ffe94a','#ffffff','#ffb84a']},
  '陨石术':{mp:14,mult:4.2,kind:'atk',sfx:'thunder',txt:'☄️',element:'meteor',breakShield:1,trueBonus:1.25,hint:'击碎石甲 · 克真身',colors:['#b06ff0','#ff5b8a','#ffd24a']},
  '治愈术':{mp:5,heal:0.55,kind:'heal',sfx:'heal',txt:'💚',cleanse:true,hint:'恢复HP并解毒',colors:['#8ff0a0','#d8ffe0','#62ff8a']},
};

const ELEM_NAME={fire:'火',ice:'冰',thunder:'雷',meteor:'陨石'};
// 元素克制倍率（单一数据源）：rules.elemMult 的 弱点×1.35 / 抗性×0.7 与此同源——
// 此前倍率只写在 rules.elemMult 一处，图鉴/帮助页只标「弱点·X / 抗性·X」却不带确切数值，
// 「同一招打弱点击穿的到底多打多少」始终是黑盒；数据化后 结算、图鉴标注、帮助页 绝无第二套口径
const ELEM_MULT={ weak:1.35, resist:0.7 };
const CHARGE_MULT=1.5;
// 困难模式倍率（单一数据源）：battle.startBattle 的敌方缩放与状态页/创建页标注同读此源——
// 此前 1.35/1.15/1.12 硬编码在 battle.js，界面只显示「⚡/困难」标签而从不告示确切倍率；
// 与 MAPS.zone 区域倍率同一「信息透明」体系，数值、结算、标注三处绝无第二套口径
const DIFF_SCALE={ hp:1.35, atk:1.15, def:1.12 };
// 精英出没等级门槛（单一数据源）：石心魔像只在 Lv.3 起的雾语林随机出现——
// battle.randomEncounter 精英分支与图鉴「Lv.3起出没」标注同读此源，绝无第二套口径
const ELITE_GATE_LV = 3;
// 精英出没概率（单一数据源）：雾语林随机遇敌时约 7% 撞见「石心魔像」精英——
// battle/encounter.randomEncounter 的精英判定与图鉴「约N%」标注同读此源，绝无第二套口径
// （与 ELITE_GATE_LV / DROP_* / CHEST_MUSHROOM 同一「概率数据化」体系）
const ELITE_CHANCE = 0.07;
// 试炼三连战「每胜一关自动回血」比例（单一数据源）：battle.winBattle 的连战换关恢复与战斗横幅/帮助页标注同读此源——
// 此前 0.35/0.5 只硬编码在 battle.winBattle，连战中悄然回血玩家却从未被告知（v3.15 只标「第 N/3 关」、v11.0 只标通关金币）；
// 数据化后 结算、横幅、帮助页三处绝无第二套口径
const RUSH_RECOVER={ hp:0.35, mp:0.5 };
// 普通怪逃跑成功率（单一数据源）：battle.doFlee 的随机判定与指令栏「成功率约N%」、
// 帮助页「约N%」标注同读此源——此前 0.6 硬编码在 battle.js，指令栏与帮助页又各写一处
// 字面量「约60%」，三处互不相关：调逃跑平衡要改三个地方、还容易改漏改出对不上的文案；
// 数据化后 结算、指令栏、帮助页绝无第二套口径（与 CHARGE_MULT / DIFF_SCALE / RUSH_RECOVER 同体系）
const FLEE_SUCCESS = 0.6;
// 普攻暴击率/暴击倍率（单一数据源）：battle.doAttack 的暴击判定、attackMove 的 ×N 加成与
// 状态页「普攻N%暴击 ×N」标注同读此源——此前 0.12/1.8 硬编码在 battle.js 两处（判定、结算），
// menus.js 状态页又另写一句字面量「12%」「×1.8」，三处互不相关：调暴击平衡要改三个地方、
// 还容易只改判定漏改标注，结算暴击率变了界面却还标旧值；数据化后 判定、结算、标注 绝无第二套口径
// （与 CHARGE_MULT / DIFF_SCALE / FLEE_SUCCESS / BURN_PCT 同一体系）
const CRIT_RATE = 0.12;
const CRIT_MULT = 1.8;
// 大额伤害阈值（单一数据源）：battle.attackMove 的浮字加粗（≥N 或暴击）与震屏触发（暴击或 ≥N）同读此源——
// 此前 25 硬编码在 battle.js 两处（addFx 加粗、S.shake 震屏），两行同值互不引用：调「多大伤害算大额」
// （如震屏更频繁放宽到 20、或更克制收紧到 30）要改两个地方、还极易只改震屏漏改加粗——加粗阈值与震屏
// 阈值悄然脱钩，暴击外的中高伤要么只加粗不震、要么只震不加粗；数据化后 浮字加粗、震屏 绝无第二套口径
// （与 CRIT_RATE / CRIT_MULT / FLEE_SUCCESS 同一「战斗反馈数据化」体系）
const BIG_DMG = 25;
// 石甲减伤倍率（单一数据源）：battle.attackMove 命中石甲怪的最终伤害 ×N 取整（保底 1）、
// rules.withShield 的伤害预览还原、enemyAI 凝甲博客「所受伤害降低 N%」提示同读此源——
// 此前 0.6 硬编码在 battle.js（结算）与 rules.js（预览）两处，enemyAI 的「降低 40%」又自写一个
// 派生值，三处互不相关：调石甲强度（如放宽到 0.5）要改三个地方、还极易改漏让预览/提示对不上结算；
// 数据化后 结算、预览、提示 绝无第二套口径（与 CRIT_MULT / FLEE_SUCCESS / BURN_PCT 同一体系，即 v14.9 声明「保持原样」的最后一处裸奔数值）
const SHIELD_MULT = 0.6;
// 受击视觉反馈时长（单一数据源，单位 ms）：battle.attackMove 的敌方闪红复位、enemyAI.enemyAct 的
// 我方闪红复位、view/drawBattle 的震屏衰减同读此源——此前 220 裸写三处（battle.js / enemyAI.js
// 各一处 setTimeout 复位、drawBattle.js 震屏衰减一处 + 注释），三处互不相关：调受击反馈节奏
// （如放慢到 280、或收紧到 180）要改三个地方、还极易只改闪红漏改震屏——闪红已熄灭震屏却还在抖
// （或反之），画面反馈时长悄然脱钩；数据化后 闪红、震屏 绝无第二套口径
// （与 BIG_DMG 震屏触发同一「战斗反馈数据化」体系）
const HIT_FB_MS = 220;
// UI「状态/提示闪烁」脉冲周期（单一数据源，单位 ms）：view/drawBattle 的防御角标与中毒角标、view/drawWorld
// 的蘑菇宝箱金光脉动、view/menus 的对话翻页指示共四处方块波闪烁同读此源——此前 400 以完全相同的
// 表达式 Math.floor(Date.now()/400)%2===0 裸写三文件四处（方块波：每 400ms 切换一次亮度，亮 400ms
// 灭 400ms，与 Date.now()%400<400 同型），互不引用：想调整个「提示闪烁」节奏（如放慢到 500、加快到
// 300）要改四处、还极易只改角标漏改宝箱脉动，各处开关悄然脱钩；
// 数据化后 闪烁节奏 绝无第二套口径（与 HIT_FB_MS 震屏/闪红同一「UI 反馈时序数据化」体系——v19.8 收口
// 受击时长时把「盾牌/中毒角标与蓄力光环的呼吸周期」明确标为另一语义留白，本版收口其中的方块波族；
// 蓄力光环 320ms 正弦呼吸、任务问号 320ms、遇敌预警条 ENCOUNTER.warnFlash（=330，已收口进 ENCOUNTER
// 家族，见上）、变身闪光 t/400 衰减、水纹 sine 相位
// /400 是各自动画的独立参数，刻意不动）
const UI_PULSE_MS = 400;
// 待机呼吸 bob（单一数据源，单位：period=ms、phase=rad/px）：世界与战斗精灵「待机呼吸」的 ±1px 正弦
// 浮动——`Math.sin(Date.now()/period + (px+py)*phase)`（相位随坐标错开防全场同步）以完全相同的形态裸写
// 在 view/sprites.js 四处：drawSheetChar（32px 图集路径）、drawSheetCustom（定制帧位图集）、drawSheetStrip
// （条状图集）与 drawMonster 程序化回退路径（该处变量名 px/py 写作 x/y，同一语义）——四处互不引用：
// 想调待机呼吸节奏（如放慢到 600ms、或让相位随坐标错开得更密 0.2）要改四个地方、还极易只改图集路径
// 漏改程序化回退路径——同屏几种怪待机呼吸悄然脱钩；数据化后 呼吸周期/相位错开 绝无第二套口径
// （与 UI_PULSE_MS / ENCOUNTER.warnFlash 同一「动画时序数据化」体系——蓄力光环 320ms 正弦呼吸、
// 任务问号 320ms、变身闪光 t/400 衰减、水纹 sine 相位 /400 是各自仅一处的单点动画参数，无需收口，刻意不动）
const IDLE_BOB = { period: 500, phase: 0.13 };
// 世界昼夜「每档相位时长」（单一数据源，单位：秒）：view/drawWorld 的 timeOfDay() 昼夜判定
// `['day','dusk','night','dawn'][Math.floor(t/90)%4]` 此前以裸字面量 90 游离在 data.js 之外，view/hud
// 注释又自写一句「90 秒一档的昼夜标签」——判定与注释互不相关：想调昼夜节奏（如加快到 60 秒一档、
// 放慢到 120）要改判定 + 记得同步注释，还极易只改判定漏改注释，让「这个世界的昼夜跑多快」始终
// 没有名字。现由 S.G.time（main.js 游戏时钟按真实秒累进，纯世界时钟、零结算）消费，昼夜判定与
// 界面注释同读此源，绝无第二套口径（与 HIT_FB_MS / UI_PULSE_MS / IDLE_BOB / ENCOUNTER.warnFlash 同一
// 「动画时序数据化」体系——本家族此前收口的都是 ms 级 UI/反馈节奏，唯独「一轮昼夜 4×90=360 秒」
// 的世界时钟节奏仍是裸奔数值）。结构：4 相位（day/dusk/night/dawn）各 DAY_PHASE_S 秒轮转
const DAY_PHASE_S = 90;
// 战斗战报窗口「每屏行数」（单一数据源，纯显示）：view/drawBattle 战报区的可见行数阈值——
// 此前裸写 3 三处（回看偏移上限 `S.blog.length-3`、切片窗口 `S.blog.length-3-S.blogView`、
// 溢出指示 `S.blog.length>3`），互不引用：想调战报窗口高度（如放宽到 4 行让更多信息常驻）要改
// 三处、还极易只改窗口漏改溢出指示——窗口已显示 4 行「↑↓ 回看」却仍只在 >3 时才出现；数据化后
// 可见行数、回看偏移、溢出指示 绝无第二套口径（与 HIT_FB_MS / UI_PULSE_MS / IDLE_BOB / DAY_PHASE_S
// 同一「UI 显示参数数据化」体系——同行块里 `18` 是行距、blog 每行显字为独立排版参数，刻意不动）
const BLOG_WIN = 3;
// 受击反馈落点（单一数据源）：战斗「伤害浮字/爆裂粒子」落在屏幕哪里——battle.attackMove、battle 中毒
// 结算、enemyAI 敌方攻击/灼烧/反击、view/drawBattle burstEnemy/burstPlayer 共七处同读此源——
// 此前敌方落点「CV.width/2, 188」裸写四处、我方落点「96, 340」裸写三处（battle.js / enemyAI.js /
// drawBattle.js 各两行、互不引用）：调受击反馈位置（如把敌方浮字从 188 上移到 170 贴近怪物头部）
// 要改四个文件里的七行、还极易只改浮字漏改爆裂粒子——伤害数字已上浮爆裂却还炸在旧位置、两侧
// 受击反馈悄然分家；数据化后 浮字、爆裂粒子 绝无第二套口径（与 HIT_FB_MS 震屏/闪红同一「战斗反馈
// 数据化」体系——敌方横坐标恒为画布中心，各调用点同式 CV.width/2，非魔法值，刻意保留）
const FX_ENEMY = { y: 188 };   // 敌方受击反馈落点：横坐标 = 画布中心，纵坐标 188
const FX_HERO = { x: 96, y: 340 };  // 我方受击反馈落点：固定坐标 (96, 340)

// 战斗「实体落点」（单一数据源）：与 FX_ENEMY / FX_HERO 同一「战斗落点数据化」家族——v19.13 收口
// 受击反馈落点时明确留白的「实体位置」另一语义，本版兑现收口。此前敌方本体锚点「CV.width/2, 248」
// 在 drawBattle.js 的 drawArena 与 drawBattle 两处各声明一遍 `ex0/ey0`、我方立绘 (96,400) 连带脚下
// 阴影/蓄力光环/辉光点以裸 96 派生六处（96,408 / 96,400 / 96,388 / 96,344），互不引用：想调战斗
// 站位（如把怪物从 248 下沉贴近地面、或挪动我方立绘）要改八个地方、还极易只改立绘漏改阴影/光环；
// 数据化后 本体、阴影、光环、辉光点 绝无第二套口径——敌方横坐标恒为画布中心，各处同式 CV.width/2，
// 非魔法值，刻意保留（与 FX_ENEMY 同款自描述式）。技能面板 panel(150,96,340,308) 是「面板位置」
// 另一语义、仅 drawSkillMenu 一处调用，本版不并入。
const BATTLE_MON = { y: 248 };   // 敌方本体锚点：横坐标 = 画布中心，纵坐标 248
const BATTLE_HERO = { x: 96, y: 400 };  // 我方立绘锚点：固定坐标 (96, 400)（阴影 y+8 / 光环 y-12 / 辉光点 y-56 派生）
// 强敌祭坛「战前演出到切入战斗」的延时（单一数据源，单位 ms）：world.onBossAltar 的幽冥魔王（祭坛）、
// world.onCaveAltar 的残焰魔像（回廊祭坛）与洞窟领主（星井祭坛）三处「先弹出场提示框、再延时切入战斗」
// 同读此源——此前 600 以完全相同的 `setTimeout(..., 600)` 裸写 world.js 三处（三处互不引用）：想调强敌
// 战前演出节奏（如放慢到 800 让出场台词多停一拍、收紧到 400 更快入战）要改三个地方、还极易只改一个祭坛
// 漏改另外两处——三个强敌的战前停顿悄然脱钩；数据化后 三处祭坛切入延时 绝无第二套口径
// （与 HIT_FB_MS / UI_PULSE_MS 同一「时序数据化」体系——本版收口的是世界交互到战斗的切入节奏）。
// 注意：终焉之神战前 700（onTrueCrystal）、回廊传送 700（transition('gallery')）、试炼首战 700
// （battle.startRush）是「真结局/传送一类」另一语义的独立延时，值同为 7 开头却互不相干，刻意不并入
const ALTAR_LEAD_MS = 600;

// 强敌祭坛「出场提示框」文案停留时长（单一数据源，单位 ms）：与上面的 ALTAR_LEAD_MS 同对——world.onBossAltar
// 的幽冥魔王（祭坛）、world.onCaveAltar 的残焰魔像（回廊祭坛）与洞窟领主（星井祭坛）三处「先弹出场提示框、
// 再延时切入战斗」的提示框停留时长以完全相同的 `bind.boxMsg(..., 1600)` 裸写 world.js 三处（三处互不引用、
// 即 v19.23 刻意保留未并入的 1600）：想调强敌出场文案停多久（如放慢到 2000 让台词多读一秒、收紧到 1200
// 更快入战）要改三个地方、还极易只改一个祭坛漏改另外两处——三个强敌的出场提示框时长悄然脱钩；数据化后
// 三处祭坛出场提示 绝无第二套口径（与 ALTAR_LEAD_MS 同一「时序数据化」体系——本版收口的是切入延时
// 的伴生量「提示框停多久」）。
// 注意：喷泉「⛲ 喷泉清泉涌动，HP/MP 完全恢复！」的 1600（onFountainStep）是「小事件通知」另一语义的
// 独立停留时长，值同为 1600 却互不相干，刻意不并入（与 ALTAR_LEAD_MS 注释中「700 家族」同款保留）。
const ALTAR_TXT_MS = 1600;

// 宝箱掉落概率/金币公式（单一数据源）：world.onChestStep 的判定与帮助页「宝箱掉落」标注同读此源——
// 此前 0.6（雾语林先判蘑菇）/0.45（再判金币）/12、5（金币=12+级×5）只硬编码在 world.js 一处，
// data.js 帮助页又各写一句字面量「60%蘑菇·18%金币(12+级×5)·22%药水；45%金币·55%药水」，
// 两处互不相关：调开箱平衡（如放宽蘑菇到 70%）要改两个地方、还极易只改判定漏改标注，
// 实际掉率变了帮助页却还标旧值；数据化后 判定、帮助页标注 绝无第二套口径
// （与 CRIT_MULT / FLEE_SUCCESS / BURN_PCT 同一体系，即 v14.9 声明「另一处独立概率，本次不碰」的宝箱开箱裸奔数值）
// 掉率推导：雾语林先判 60% 蘑菇，剩下 40% 里再判 45% 金币 → 全局 18%、余下 55% → 全局 22% 药水；
// 城镇/矿脉跳过蘑菇，直接 45% 金币 / 55% 药水
const CHEST_MUSHROOM = 0.6;
const CHEST_GOLD = 0.45;
const CHEST_GOLD_BASE = 12;
const CHEST_GOLD_PER_LV = 5;

// 防御架势数值（单一数据源）：battle.doDefend 回蓝、enemyAI.enemyAct 减伤/反击判定/反击伤害、
// view/drawBattle 防御中横幅与受击/反击预判同读此源——此前 0.5/2/0.5/0.7 硬编码在 battle.js
// （回 2 MP）与 enemyAI.js（减伤/反击两处）三处、drawBattle.js 又各写自己的字面量
// （横幅「减伤50% · 回2MP/回合 · 50%几率反击」、受击预判再 ×0.5 取整、反击≈N 伤再 ×0.7），
// 五处互不相关：调防御强度（如减伤放宽到 0.45、回蓝加到 3、反击概率提到 60%）要改四个地方、
// 还极易改漏让横幅/预判对不上结算；数据化后 结算、横幅、预判 绝无第二套口径
// （与 SHIELD_MULT / CRIT_MULT / FLEE_SUCCESS / BURN_PCT 同一体系）
const DEFEND_MULT = 0.5;    // 防御中受到的最终伤害 ×N（保底 1）
const DEFEND_MP = 2;        // 防御回合恢复的 MP 点数
const COUNTER_CHANCE = 0.5; // 防御中被命中触发反击的概率
const COUNTER_MULT = 0.7;   // 反击伤害倍率（无浮动、值确定，预判可放心展示）

// 敌方重击倍率（单一数据源）：enemyAI.enemyAct 的重击结算与 view/drawBattle 的 Boss 逐招受击预判
// 同读此源——此前 `enemy.phased ? 2.3 : 1.9` 硬编码在两处（enemyAI.js 结算、drawBattle.js 预判），
// 两处互不相关：调重击强度（如真身放宽到 2.5、平时收到 1.7）要改两个地方、还极易只改结算漏改预判，
// 实际伤害变了预判却还报旧值；数据化后 结算、预判 绝无第二套口径
// （与 DEFEND_MULT / CRIT_MULT / SHIELD_MULT 同一体系）
const HEAVY_MULT = 1.9;        // 重击 对平时（未变身）形态的伤害倍率
const HEAVY_MULT_PHASED = 2.3; // 重击 对二段真身形态的伤害倍率（深渊之怒）

// 敌方回血默认比例（单一数据源）：enemyAI.enemyAct 的回血结算与 view/drawBattle 的敌方招数一览
// 标注同读此源——此前 `act.pct || 0.12` 的兜底字面量 0.12 硬编码在两处（enemyAI.js 结算、
// drawBattle.js 标注），两处互不相关：想调「未显式写 pct 的回血招默认恢复多少」要改两个地方、
// 还极易只改结算漏改标注，实际回血量变了招数一览却还报旧百分比；数据化后 结算、标注 绝无第二套
// 口径（与 HEAVY_MULT / SHIELD_MULT / CRIT_MULT 同一体系）。注：三 Boss 回血招均显式带 pct
// （幽冥魔王/终焉之神 0.12、洞窟领主 0.10），此兜底为其余招数表漏写 pct 时的安全默认
const HEAL_PCT = 0.12;

// 敌方二段变身触发阈值兜底（单一数据源）：enemyAI.enemyAct 的变身触发判定（hp < hpMax×at）与
// view/drawBattle 的「二段变身线」标注同读此源——此前 `phase.at || 0.5` 的兜底字面量 0.5 硬编码在两处
// （enemyAI.js 结算、drawBattle.js 标注），两处互不相关：调「未显式写 at 的变身默认血量线」要改两个地方、
// 还极易只改结算漏改标注，实际触发阈值变了变身线却还报旧值；数据化后 结算、标注 绝无第二套口径
// （与 HEAL_PCT / HEAVY_MULT / SHIELD_MULT 同一体系）。注：三 Boss 的 phase2 均显式带 at:0.5
// （幽冥魔王/洞窟领主/终焉之神），此兜底为其余变身模板漏写 at 时的安全默认
const PHASE2_AT = 0.5;

// 敌方二段变身回血比例兜底（单一数据源）：enemyAI.enemyAct 的变身回血结算 Math.round(hpMax×(heal||…))
// 与 view/drawBattle 变身「增益数值」角标（回N%）同读此源——此前兜底字面量 0.15 硬编码在 enemyAI.js 结算
// 一处（`phase.heal || 0.15`），drawBattle 角标却用 `if (p2.heal)` 直判：漏写 heal 的变身模板结算仍回 15%
// 角标却不显示回血比例，显示对不上结算；数据化后 结算、角标 绝无第二套口径（与 PHASE2_AT 同一「变身模板
// 兜底」体系）。注：三 Boss 的 phase2 均显式带 heal（幽冥魔王/终焉之神 0.15、洞窟领主 0.10），
// 此兜底为其余变身模板漏写 heal 时的安全默认
const PHASE2_HEAL_PCT = 0.15;

// 战斗随机掉落概率/金币数额（单一数据源）：rules.rollDrop 的档位判定与帮助页「战斗掉落」标注同读此源——
// 此前 0.08/0.2/0.32/0.38 边界与 +60 金硬编码在 rules.js 的 rollDrop，data.js 帮助页又自写一句字面量
// 「8% 装备或+60金 · 12% 药水 · 12% 蘑菇 · 6% 高级灵药」，两处互不相关：调出货率（如装备档放宽到 10%）
// 要改两个地方、还极易只改结算漏改标注，实际掉率变了帮助页却还标旧值；数据化后 结算、标注 绝无第二套
// 口径（与 CHEST_MUSHROOM / FLEE_SUCCESS / BURN_PCT 同一体系）。档位推导：装备档 8% → 药水档累进至
// 20% → 蘑菇档（限雾语林/矿脉，否则并入药水档）累进至 32% → 灵药档累进至 38%，合计约 38% 有掉落
const DROP_EQUIP = 0.08;     // 装备升级（已最好则 +DROP_GOLD 金）
const DROP_POTION = 0.12;    // 生命药水
const DROP_MUSHROOM = 0.12;  // 魔法蘑菇（仅雾语林/矿脉；其余地图并入药水档）
const DROP_ELIXIR = 0.06;    // 高级灵药
const DROP_GOLD = 60;        // 装备档已尽善时的金币兜底数额

// 终焉之神额外奖励（单一数据源）：battle.winBattle 战胜结算/横幅文案、图鉴「击败+300金」标注、
// 战斗预览「战胜另+300金」三处同读此源——调真结局额外赏金（如改成 500）只改 data.js 一处，
// 结算/横幅/标注/预览多端同步，绝无第二套口径（与 DROP_GOLD / RUSH_RECOVER 同一体系）
// 注意：SPECIES 顶层字面量 tag 会拼入此值，故必须定义在 SPECIES 之前
const TRUE_BONUS_GOLD = 300;

// 成就「小富翁」金币阈值（单一数据源）：ACH_LIST 该条的判定（ok: gold>=RICH_GOLD）、描述文案
// （d「持有 N 金币」）、进度条（prog「X/N」）三处同读此源——此前 500 硬编码在同一条目内三处
// 互不相关（ok 判定、d 描述、prog 分母）：想调门槛（如放宽到 800）要改三处，还极易只改判定
// 漏改文案，实际达标线变了界面却还标「/500」；且全库无任何现成源可借鉴（gold 相关常量仅
// DROP_GOLD=60 / TRUE_BONUS_GOLD=300，都不是成就门槛），故单设此常量（与 MUSHROOM_GOAL /
// MIST_GOAL / POTION_PRICE 同一「数值数据化」家族；同族 perfection 描述已改读 BESTIARY_TARGET.length）
const RICH_GOLD = 500;

// 成就「记忆收藏家」图鉴收录种数阈值（单一数据源）：ACH_LIST 该条的判定
// （ok: bestiary 收录种数 >= SCHOLAR_GOAL）、描述文案（d「收录 N 种魔物」）、进度条（prog「X/N」）
// 三处同读此源——此前 5 硬编码在同一条目内三处互不相关（ok 判定、d 描述、prog 分母）：想调门槛
// （如放宽到 6 种）要改三处，还极易只改判定漏改文案，实际达标线变了界面却还标「/5」；且全库无
// 任何现成源可借鉴（bestiary 仅有 BESTIARY_TARGET 全量 13 种表，并非「收录 5 种」的入门门槛），
// 故单设此常量（与 RICH_GOLD 同一「成就阈值数据化」家族——v18.2 收口「小富翁」后，
// 同类里残存的裸奔数值之一，本次收口「记忆收藏家」）
const SCHOLAR_GOAL = 5;    // 成就「记忆收藏家」需收录的魔物种数

// 成就「幸运眷顾」累计额外掉落次数阈值（单一数据源）：ACH_LIST 该条的判定
// （ok: drops >= LUCKY_GOAL）、描述文案（d「累计获得 N 次额外掉落」）、进度条（prog「X/N」）
// 三处同读此源——此前 5 硬编码在同一条目内三处互不相关（ok 判定、d 描述、prog 分母）：想调门槛
// （如改成 8 次）要改三处，还极易只改判定漏改文案，实际达标线变了界面却还标「/5」；且全库无任何
// 现成源可借鉴（drops 仅在 rules.js 掉落计数、CHANGELOG 提及，无成就门槛常量），故单设此常量
// （与 RICH_GOLD / SCHOLAR_GOAL 同一「成就阈值数据化」家族——v18.3 收口「记忆收藏家」时
// 注释已预告同族的 lucky 是下批对象，当时刻意保留其裸 5，本次收口「幸运眷顾」）
const LUCKY_GOAL = 5;    // 成就「幸运眷顾」需累计获得的额外掉落次数

// 成就「驱雾十战」累计讨伐只数阈值（单一数据源）：ACH_LIST 该条的判定
// （ok: totalWins >= HUNT_GOAL）、描述文案（d「累计讨伐 N 只魔物」）、进度条（prog「X/N」）
// 三处同读此源——此前 10 硬编码在同一条目内三处互不相关（ok 判定、d 描述、prog 分母）：想调门槛
// （如放宽到 15 只）要改三处，还极易只改判定漏改文案，实际达标线变了界面却还标「/10」；且全库无任何
// 现成源可借鉴（累计讨伐仅 totalWins 计数，无门槛常量），故单设此常量（与 RICH_GOLD / SCHOLAR_GOAL /
// LUCKY_GOAL 同一「成就阈值数据化」家族——v18.4 收口「幸运眷顾」时注释已预告 hunt10 属下批对象、
// 当时刻意保留其裸 10；同计数源 firstblood 的裸 1 属再下批对象刻意保留）
const HUNT_GOAL = 10;    // 成就「驱雾十战」需累计讨伐的魔物只数

// 成就「独当一面」/「守灯者」等级阈值（单一数据源）：ACH_LIST 这两条的判定
// （ok: level >= LVL5_GOAL / LVL10_GOAL）、描述文案（d「等级达到 N 级」）、进度条（prog「X/N」）
// 三处各同读其源——此前 5/10 硬编码在各自条目内三处互不相关（ok 判定、d 描述、prog 分母）：想调门槛
// （如守灯者放宽到 12 级）要改三处，还极易只改判定漏改文案，实际达标线变了界面却还标「/10」；且全库无任何
// 现成源可借鉴（等级上限仅由 baseStats/XP_GROW 曲线隐含，无成就门槛常量），故单设此两常量（与 RICH_GOLD /
// SCHOLAR_GOAL / LUCKY_GOAL / HUNT_GOAL 同一「成就阈值数据化」家族——v18.4 收口「幸运眷顾」时注释
// 已预告 lvl5 的裸 5 与 lvl10 的裸 10 属下批对象、当时刻意保留；同为等级口径的两条一并收口，行为逐字不变）
const LVL5_GOAL = 5;     // 成就「独当一面」需达到的等级
const LVL10_GOAL = 10;   // 成就「守灯者」需达到的等级

// 成就「初露锋芒」累计胜场阈值（单一数据源）：ACH_LIST 该条的判定（ok: totalWins >= FIRSTBLOOD_GOAL）、
// 进度条（prog「X/N」）两处同读此源（描述 d「赢得第一场战斗」无数字，无需读数）——此前 1 硬编码在
// 同一条目内两处互不相关（ok 判定、prog 分母）：想调门槛（如放宽到 3 场）要改两处，还极易只改判定
// 漏改进度，实际达标线变了界面却还标「/1」；且全库无任何现成源可借鉴（陪跑同计数源的 hunt10 已有
// HUNT_GOAL），故单设此常量（与 RICH_GOLD / SCHOLAR_GOAL / LUCKY_GOAL / HUNT_GOAL 同一
// 「成就阈值数据化」家族——v18.5 收口 hunt10 时注释已预告同计数源的 firstblood 属再下批对象、
// 当时刻意保留其裸 1，本次收口「初露锋芒」后全库 ACH_LIST 数值型门槛收口完毕）
const FIRSTBLOOD_GOAL = 1;   // 成就「初露锋芒」需累计赢得的战斗场数

// 成就「记忆守护者」图鉴全收集金币奖励（单一数据源）：hero.applyAchievements 的专享奖励
// 结算（gold += PERFECTION_GOLD）与解锁横幅文案（「额外奖励 N 金币」）两处同读此源——
// 此前 999 硬编码在 hero.js 同一分支内两处互不相关（发奖数额与横幅文案数额）：想调奖励
// （如改成 500 金）要改两处，还极易只改发奖漏改文案，实际到账与横幅报数悄然脱钩；
// 且全库无任何现成源可借鉴（写死的只此一处——TRUE_BONUS_GOLD=300 是终焉之神专属、
// RICH_GOLD=500 是「小富翁」持有门槛，均非全收集奖励），故单设此常量（与 RICH_GOLD /
// SCHOLAR_GOAL / LUCKY_GOAL / HUNT_GOAL / LVL5_GOAL / LVL10_GOAL / FIRSTBLOOD_GOAL
// 同一「成就阈值数据化」家族——v18.x 系列收口 ACH_LIST 门槛后，全库与成就相关的
// 数值中最后一段「同对象内互不引用」的裸奔数字，本次收口）
const PERFECTION_GOLD = 999;   // 成就「记忆守护者」图鉴全收集的专享金币奖励

// —— 药水恢复量（POTION_ 生命药水 / ELIXIR_ 高级灵药）—— 结算·战斗预览·商店文案三处唯一真源
// 药水背包上限（POTION_CAP = 99）：商店购买拦截判定（shop.js）、背包已满提示文案、商店列表「现有X/99」、
// 购买栏 置灰判定（view/menus.js）四处同读此源——调上限（如放宽到 120）只改 data.js 一处，四端同步，
// 绝无第二套口径（与 MUSHROOM_GOAL / INN_PRICE / BREW_MUSHROOMS 同一「数值数据化」体系）
const POTION_CAP = 99;
const POTION_PRICE = 15;   // 生命药水购买价（金币）：buyPotion 购买判定/扣款、商店列表价签三处同读此源
const POTION_HP_PCT = 0.5;   // 生命药水：恢复 最大HP ×N（向下取整）再 +FLAT
const POTION_HP_FLAT = 8;
const ELIXIR_HP_PCT = 0.8;   // 高级灵药：恢复 最大HP ×N 再 +FLAT，同时恢复 最大MP ×M
const ELIXIR_HP_FLAT = 20;
const ELIXIR_MP_PCT = 0.4;

// 存档槽数量（SAVE_SLOTS = 3）：标题选槽主键 1..N（main.js title 分派）、标题页选槽条/
// 快捷键一览（view/menus.js）、帮助页「存档槽」说明（本文件 HELP_PAGES）四处同读此源——
// 调档数（如加到 4）只改 data.js 一处，四端同步，绝无第二套口径（与 POTION_CAP /
// MUSHROOM_GOAL / INN_PRICE 同一「数值数据化」体系）
const SAVE_SLOTS = 3;

const SPECIES={
  '史莱姆':  {draw:'slime', weak:'fire'},
  '野狼':    {draw:'wolf', weak:'fire'},
  '骷髅兵':  {draw:'skel', weak:'fire', resist:'ice'},
  '哥布林':  {draw:'goblin', weak:'ice'},
  '毒蛇':    {draw:'snake', weak:'ice', poison:POISON_CHANCE, tag:'☠️ 会施毒 · 扣血' + POISON_TURNS + '回合'},
  '树精':    {draw:'tree', weak:'fire', resist:'ice'},
  '石魔像':  {draw:'stone', weak:'thunder', resist:'fire'},
  '雾灵':    {draw:'ghost', weak:'ice', resist:'fire', tag:'❄️ 雾凝成冰'},
  '残焰魔像':{draw:'fire', weak:'ice', resist:'fire', isElite:true, lv:11, tag:'🔥 回廊精英',
    acts:[{type:'attack',w:60},{type:'heavy',w:40,w2:50}]},
  '石心魔像':{draw:'golem', weak:'thunder', isElite:true, tag:'🍄 必掉魔法蘑菇',
    acts:[{type:'attack',w:55},{type:'shield',w:45,maxShield:3,hpBelow:0.5}]},
  '幽冥魔王':{draw:'boss', resist:'ice', lv:8, tag:'⚔️ 必掉圣光之剑',
    acts:[{type:'attack',w:50},{type:'heavy',w:30,w2:45},{type:'heal',w:20,hpBelow:0.4,pct:0.12}],
    phase2:{at:0.5,name:'幽冥魔王·真身',color:'#6a2ad9',atk:7,def:3,heal:0.15}},
  '洞窟领主':{draw:'caveboss', weak:'thunder', lv:7, tag:'💠 击败清除祭坛',
    acts:[{type:'attack',w:35},{type:'shield',w:30,maxShield:2},{type:'heavy',w:20},{type:'heal',w:15,hpBelow:0.4,pct:0.10}],
    phase2:{at:0.5,name:'洞窟领主·真身',color:'#5aa0d0',atk:5,def:2,heal:0.10}},
  '终焉之神':{draw:'true', resist:'fire', lv:12, tag:'💰 击败+' + TRUE_BONUS_GOLD + '金',
    acts:[{type:'attack',w:40},{type:'heavy',w:35,w2:50},{type:'heal',w:25,hpBelow:0.4,pct:0.12}],
    phase2:{at:0.5,name:'终焉之神·祸乱形态',color:'#ff5b8a',atk:7,def:3,heal:0.15,forbid:['heal']}},
};
// 石心魔像石甲招数（单一数据源）：帮助页「石心魔像·石甲」标注与战斗招数一览（view/drawBattle.js 行招表渲染）
// 同读 SPECIES['石心魔像'].acts 的 shield 招——此前帮助页把「血量过半后」「至多 3 层」写成裸字面量，
// drawBattle 却早已动态读 a.hpBelow / a.maxShield（渲染「·血<50%时」「·至多3层」），帮助页与行招表两处
// 互不相关：想调石甲强度（如层数上限提到 4、触发线改 0.4）要改两处、还极易改漏让帮助页对不上行招表；
// 数据化后 帮助页标注、招数一览 绝无第二套口径（与 SHIELD_MULT / HEAL_PCT / PHASE2_AT 同一
// 「行招表数据化」体系）
const GOLEM_SHIELD_ACT = (SPECIES['石心魔像'].acts || []).find(a => a.type === 'shield') || {};

const MON_BASE=[
  // w(lv) 遇敌权重（单一数据源）：encounter.encounterWeight 与历史公式逐字一致；
  // minLv 出没等级门槛：仅 树精/石魔像 为 3，其余缺省 1——battle.encounterWeight 与图鉴「Lv.3起出没」标注同读此源
  {name:'史莱姆',hp:[16,5],atk:[5,2],def:[2,1],xp:[8,3],gold:[8,2],color:'#7fd84f',weak:'fire',draw:'slime',w:(lv)=>Math.max(1,4-Math.floor(lv/2))},
  {name:'野狼',  hp:[22,5],atk:[7,2],def:[3,1],xp:[12,3],gold:[12,2],color:'#9aa3ad',weak:'fire',draw:'wolf',w:()=>3},
  {name:'骷髅兵',hp:[26,6],atk:[8,2],def:[5,1],xp:[16,4],gold:[15,3],color:'#d9d3c0',weak:'fire',resist:'ice',draw:'skel',w:(lv)=>lv>=2?2+Math.floor(lv/3):1},
  {name:'哥布林',hp:[20,5],atk:[6,2],def:[3,1],xp:[10,3],gold:[10,2],color:'#6fae4f',weak:'ice',draw:'goblin',w:(lv)=>Math.max(1,4-Math.floor(lv/2))},
  {name:'毒蛇',  hp:[20,5],atk:[8,2],def:[3,1],xp:[15,3],gold:[13,2],color:'#59c96b',poison:POISON_CHANCE,weak:'ice',draw:'snake',w:(lv)=>lv>=2?2+Math.floor(lv/3):1},
  {name:'雾灵',  hp:[24,5],atk:[9,2],def:[4,1],xp:[17,4],gold:[14,3],color:'#b48ae8',weak:'ice',resist:'fire',draw:'ghost',minLv:2,w:(lv)=>2+Math.floor(lv/3)},
  {name:'树精',  hp:[30,6],atk:[7,2],def:[6,1],xp:[18,4],gold:[16,3],color:'#4c8f5a',weak:'fire',resist:'ice',draw:'tree',minLv:3,w:(lv)=>2+Math.floor(lv/2)},
  {name:'石魔像',hp:[36,7],atk:[8,2],def:[10,1],xp:[22,4],gold:[20,3],color:'#8a8577',weak:'thunder',resist:'fire',draw:'stone',minLv:3,w:(lv)=>2+Math.floor(lv/2)},
];

// 精英「石心魔像」成长基准（单一数据源）：battle.eliteEncounter 生成、rules.codexStats/monReward 图鉴参考同读此表
const ELITE_GOLEM = {name:'石心魔像',hp:[58,10],atk:[12,3],def:[15,2],xp:[40,6],gold:[45,6],color:'#6b8cb0'};

function withSpecies(enemy) {
  const species = SPECIES[enemy.name] || {};
  return Object.assign({}, species, enemy, {
    weak: enemy.weak || species.weak,
    resist: enemy.resist || species.resist,
    draw: enemy.draw || species.draw,
    acts: enemy.acts || species.acts,
    phase2: enemy.phase2 || species.phase2,
    tag: enemy.tag || species.tag,
  });
}

// 三强敌基础数值（单一数据源）：主线 BOSS / CAVE_BOSS / TRUE_BOSS 与其试炼场复刻版（RUSH_BOSSES）
// 的 name/hp/hpMax/atk/def/color 六项同读此源——此前 hp:140·atk:15·def:6 这类数值在主线 Boss 定义与
// RUSH_BOSSES 各写一份互不相关：想调强敌兵力（如把幽冥魔王 atk 提到 17）要改两处，还极易只改主线漏改试炼，
// 两处强度悄然脱钩。试炼版仅覆盖 xp/gold/isRush（试炼不给金币、经验另计少给），兵力数值与主线逐字同源、永不漂移。
const BOSS_BASE={name:'幽冥魔王',hp:140,hpMax:140,atk:15,def:6,color:'#a03fd9'};
const CAVE_BOSS_BASE={name:'洞窟领主',hp:110,hpMax:110,atk:16,def:10,color:'#3f6b9f'};
const TRUE_BOSS_BASE={name:'终焉之神',hp:260,hpMax:260,atk:22,def:13,color:'#f0c040'};

const BOSS=withSpecies({...BOSS_BASE,xp:150,gold:300,isBoss:true,bossHpMax:BOSS_BASE.hpMax});
//          ↑ bossHpMax 由 BOSS_BASE.hpMax 推导（单一数据源）：v18.9 收口主线/试炼兵力时此值以裸 140 留存、
//          全库亦无任何读取方（仅 isBoss 驱动主线判定），是 BOSS_BASE 家族最后一处与真源脱钩的残留字面量——
//          调幽冥魔王最大 HP 只需改 BOSS_BASE.hpMax，bossHpMax 自动跟随；行为逐字不变（现两值同为 140）
const CAVE_BOSS=withSpecies({...CAVE_BOSS_BASE,xp:120,gold:200,isElite:true,isCaveBoss:true});
const TRUE_BOSS=withSpecies({...TRUE_BOSS_BASE,xp:400,gold:600,isTrue:true,isElite:true});
// 无字回廊中段精英（Fire Golem CC0 素材）：双徽记开门后的守门考验
const EMBER_GOLEM=withSpecies({name:'残焰魔像',hp:170,hpMax:170,atk:19,def:12,xp:130,gold:260,color:'#e07a3f',isElite:true});

const RUSH_BOSSES=[
  withSpecies({...BOSS_BASE,xp:60,gold:0,isRush:true}),
  withSpecies({...CAVE_BOSS_BASE,xp:60,gold:0,isRush:true}),
  withSpecies({...TRUE_BOSS_BASE,xp:90,gold:0,isRush:true}),
];

const BESTIARY_TARGET=['史莱姆','野狼','骷髅兵','哥布林','毒蛇','雾灵','树精','石魔像','石心魔像','幽冥魔王','洞窟领主','终焉之神','残焰魔像'];

// 记忆碎片（单一数据源）：强敌战败掉落（battle.winBattle 按 enemy 名归一查找），
// 任务日志「记忆碎片」节与真结局加页（ENDING_TRUE_FRAG）同读此表
const FRAGMENTS=[
  { id:'golem', name:'碎片·守门人的脚印', enemy:'石心魔像',
    text:'旧矿的守门人走丢那天，把最后一句「看好矿车」说给了石头听。' },
  { id:'demon', name:'碎片·灯卫的誓', enemy:'幽冥魔王',
    text:'他吞下灯芯那晚立下誓：镇子若忘了他，他就替镇子记着镇子。' },
  { id:'cave',  name:'碎片·最后一车星砂', enemy:'洞窟领主',
    text:'星砂没落灰。每一年都有人把它擦一遍——用的是自己的影子。' },
  { id:'true',  name:'碎片·初灯的名字', enemy:'终焉之神',
    text:'初灯记得所有人的名字，唯独没人记得它的。于是它把自己点着了。' },
];

// 名字石碑（无字回廊）：碑文与 FRAGMENTS 逐字同源，只读展示不涉任务/掉落
FRAGMENTS.forEach((f, i) => {
  NPCS['stele' + (i + 1)] = {
    name: '名字石碑', mark: 'staff',
    lines: [[f.text, '——碑上没有名字，摸上去是温的。 [Enter] 结束']],
  };
});

const QUESTS={
  main_demon:{
    id:'main_demon', kind:'main', flag:'bossDefeated',
    name:'讨回灯芯', where:'雾语林深处祭坛',
    obj:'前往雾语林深处的祭坛，讨伐幽冥魔王！',
    done:'已击败幽冥魔王。镇上的灯重新亮了——可井还在低鸣。',
  },
  main_cave:{
    id:'main_cave', kind:'main', flag:'caveBoss', unlockOn:'bossDefeated',
    name:'星井之守', where:'星井矿脉深处',
    unlockHint:'先击败幽冥魔王',
    obj:'深入星井矿脉，击败洞窟领主！',
    done:'已击败洞窟领主。最后一车星砂露了出来。',
  },
  main_gallery:{
    id:'main_gallery', kind:'main', flag:'galleryOpen', unlockOn:['bossDefeated','caveBoss'],
    hiddenUntilUnlock:true,
    name:'无字回廊', where:'星井矿脉·终焉水晶',
    obj:'✨ 隐藏目标：穿过终焉水晶开启的门，走进无字回廊！',
    done:'回廊的门已开。被忘掉的名字们，在碑上等你。',
  },
  main_true:{
    id:'main_true', kind:'main', flag:'trueBoss', unlockOn:['bossDefeated','caveBoss'],
    hiddenUntilUnlock:true,
    name:'初灯的审判', where:'无字回廊尽头',
    obj:'✨ 隐藏目标：到无字回廊尽头，讨伐终焉之神！',
    done:'终焉之神已散。记忆回到镇上——你守住了记得的权利。',
  },
  side_mushroom:{
    id:'side_mushroom', kind:'side', store:true, n:MUSHROOM_GOAL, item:'mushrooms', giver:'chief',
    name:'灯长的委托', where:'雾语林宝箱 → 回镇找灯长',
    obj:'找回魔法蘑菇',
    offer:'去潮灯镇找灯长，接下唤醒井泉的委托',
    turnin:'回镇找灯长领取奖励！',
    done:'井泉被荧光重新点亮。灯长的委托完成。',
    reward:{ gold:(lv)=>40+lv*10, item:2 },
    talk:{
      offer:[[
        '灯芯灭了，井口的泉水也跟着黯了，灯油眼看要见底。',
        '林子里的【魔法蘑菇】带着残灯的荧光——是灯油最后的原料。帮我找回 ' + MUSHROOM_GOAL + ' 株，好吗？',
        '[Enter] 接下委托   [Esc] 离开',
      ]],
      active:(hero)=>[[
        '魔法蘑菇藏在雾语林的宝箱里。那是残灯掉落的核。',
        `（已找到 ${hero.mushrooms||0}/${MUSHROOM_GOAL} 株）`,
        '[Enter] 继续',
      ]],
      turnin:[[
        '你回来了！这些荧光……井泉会重新认得路。',
        '[Enter] 领取奖励',
      ]],
      done:[[
        '谢谢你。井泉的灯油续上了，泉水亮了一点。可广场那盏大灯，还在等灯芯。',
        '（支线任务·已完成）',
        '[Enter] 继续',
      ]],
    },
  },
  side_cart:{
    id:'side_cart', kind:'side', store:true, npc:'cartman', unlockOn:'caveBoss',
    completeOnTalk:true,
    name:'星砂之约', where:'星井矿脉·星砂车夫',
    unlockHint:'击败洞窟领主后',
    obj:'把星砂矿车的消息告诉星砂车夫',
    done:'已把星砂的消息告诉星砂车夫。',
    reward:{ gold:80 },
    talk:{
      active:[[
        '星砂车夫：碎石真的坍了！祭坛左边那车星砂……',
        '灯会记得你。这点谢礼，拿去补行装吧。',
        '[Enter] 领取谢礼',
      ]],
      done:[[
        '星砂车夫：那车货是你打下来的。灯还在，路还在。',
        '[Enter] 结束',
      ]],
    },
  },
  // 巡灯人·旧灯卫的名字：集齐全部记忆碎片（目标枚数单一数据源 = FRAGMENTS.length；连同状态页「记忆 X/N」、
  // 真结局加页同读此源——此前这个 4 硬编码在 cond/condProg/obj/offer 四处互不相关：想增减记忆碎片
  // （FRAGMENTS 增删一段）判定会漏改或文案会漏改，集齐 N-1 枚界面却还标「/4 枚」；且旧注释自称
  // 「cond 单一数据源 FRAGMENTS.length」实为虚标——代码里全是裸 4。收口后 判定/进度/目标文案/接取对话
  // 与状态页真源 FRAGMENTS.length 同源，绝无第二套口径（与 MIST_GOAL / MUSHROOM_GOAL 同一「支线目标
  // 单一数据源」家族；turnin 的「四段都在这了」系逐字点名的枚举性旁白，非数值引用，保持文案原样）
  side_name:{
    id:'side_name', kind:'side', store:true, npc:'adventurer', giver:'adventurer',
    unlockOn:'bossDefeated',
    cond:(g)=>((g.fragments||[]).length >= FRAGMENTS.length),
    condProg:(g)=>`${(g.fragments||[]).length}/${FRAGMENTS.length} 枚`,
    name:'旧灯卫的名字', where:'收集记忆碎片 → 回镇找巡灯人',
    unlockHint:'击败幽冥魔王后',
    obj:`集齐 ${FRAGMENTS.length} 枚记忆碎片，替旧灯卫把名字找回来`,
    turnin:'碎片集齐了！回镇找巡灯人',
    done:'旧灯卫的名字重新被记起。巡灯人的灯，更亮了。',
    reward:{ gold:120, potion2:1 },
    talk:{
      offer:[[
        '巡灯人：他吞下灯芯，是为了替镇子记住镇子。',
        '可没人记得他了。把散落的记忆碎片找回来——',
        `凑齐 ${FRAGMENTS.length} 枚，我带你把他的名字念给灯听。`,
        '[Enter] 接下   [Esc] 离开',
      ]],
      active:[[
        '巡灯人：碎片在强敌身上——魔像、魔王、领主，',
        '还有回廊尽头的那位。每一枚都是他被忘掉的一部分。',
        '[Enter] 继续',
      ]],
      turnin:[[
        '巡灯人：四段都在这了。守门人、灯卫、星砂、初灯……',
        '听好了，灯。他叫——',
        '……名字回来了。这份谢礼你拿着。',
        '[Enter] 领取谢礼',
      ]],
      done:[[
        '巡灯人：走夜路的时候，灯提亮些。',
        '现在有人替他们记着了——是你。',
        '[Enter] 结束',
      ]],
    },
  },
  // 雾径猎手·雾里的新住客：讨伐 MIST_GOAL 只雾灵（bestiary 计数）
  side_mist:{
    id:'side_mist', kind:'side', store:true, npc:'hunter', giver:'hunter',
    cond:(g)=>(((g.bestiary||{})['雾灵'])||0) >= MIST_GOAL,
    condProg:(g)=>`${((g.bestiary||{})['雾灵'])||0}/${MIST_GOAL} 只`,
    name:'雾里的新住客', where:'雾语林',
    obj:`讨伐 ${MIST_GOAL} 只雾里新长出来的【雾灵】`,
    turnin:'雾灵查清了！回营地找雾径猎手',
    done:'雾灵的底细记进了图鉴。猎手的陷阱重新布好了。',
    reward:{ gold:60, item:1 },
    talk:{
      offer:[[
        '雾径猎手：最近雾里多了些飘着的影子，不怕火，',
        `倒怕冰。帮我打 ${MIST_GOAL} 只回来——记下它们的底细。`,
        '[Enter] 接下   [Esc] 离开',
      ]],
      active:[[
        '雾径猎手：雾灵嘛，草深的地方多。',
        '冰霜击打它们最管用。',
        '[Enter] 继续',
      ]],
      turnin:[[
        `雾径猎手：${MIST_GOAL} 只，干净利落。图鉴上那页我瞄了一眼——`,
        '写得清楚。这点东西拿去，路上用。',
        '[Enter] 领取谢礼',
      ]],
      done:[[
        '雾径猎手：雾里的东西，认得清就不怕。',
        '林子交给我，你往前去。',
        '[Enter] 结束',
      ]],
    },
  },
};

const ACH_LIST=[
  {id:'firstblood', name:'初露锋芒', d:'赢得第一场战斗', ok:g=>g.totalWins>=FIRSTBLOOD_GOAL, prog:g=>`${g.totalWins||0}/${FIRSTBLOOD_GOAL}`},
  {id:'hunt10',     name:'驱雾十战', d:`累计讨伐 ${HUNT_GOAL} 只魔物`, ok:g=>g.totalWins>=HUNT_GOAL, prog:g=>`${g.totalWins||0}/${HUNT_GOAL}`},
  {id:'lucky',      name:'幸运眷顾', d:`累计获得 ${LUCKY_GOAL} 次额外掉落`, ok:g=>(g.drops||0)>=LUCKY_GOAL, prog:g=>`${g.drops||0}/${LUCKY_GOAL}`},
  {id:'lvl5',       name:'独当一面', d:`等级达到 ${LVL5_GOAL} 级`, ok:g=>g.level>=LVL5_GOAL, prog:g=>`${g.level||1}/${LVL5_GOAL}`},
  {id:'lvl10',      name:'守灯者',   d:`等级达到 ${LVL10_GOAL} 级`, ok:g=>g.level>=LVL10_GOAL, prog:g=>`${g.level||1}/${LVL10_GOAL}`},
  {id:'rich',       name:'小富翁',   d:`持有 ${RICH_GOLD} 金币`, ok:g=>g.gold>=RICH_GOLD, prog:g=>`${Math.floor(g.gold||0)}/${RICH_GOLD}`},
  {id:'scholar',    name:'记忆收藏家', d:`记忆图鉴收录 ${SCHOLAR_GOAL} 种魔物`, ok:g=>Object.keys(g.bestiary||{}).length>=SCHOLAR_GOAL, prog:g=>`${Object.keys(g.bestiary||{}).length}/${SCHOLAR_GOAL}`},
  {id:'quest',      name:'三株荧光', d:'完成灯长的支线任务', ok:g=>(g.quests&&g.quests.side_mushroom==='done')||g.quest>=3},
  {id:'boss',       name:'讨回灯芯', d:'击倒幽冥魔王', ok:g=>!!g.bossDefeated},
  {id:'cave',       name:'井之守望', d:'击败洞窟领主', ok:g=>!!g.caveBoss},
  {id:'trueboss',   name:'记得一切', d:'击败隐藏的终焉之神', ok:g=>!!g.trueBoss},
  {id:'rush',       name:'百炼成钢', d:'通过试炼场三连战', ok:g=>!!g.rushDone},
  {id:'perfection', name:'记忆守护者', d:`记忆图鉴收录全部 ${BESTIARY_TARGET.length} 种魔物`, ok:g=>BESTIARY_TARGET.every(n=>(g.bestiary||{})[n]>=1), prog:g=>`${BESTIARY_TARGET.filter(n=>(g.bestiary||{})[n]>=1).length}/${BESTIARY_TARGET.length}`},
  {id:'legend',     name:'黎明归剑', d:'装备传说圣光之剑', ok:g=>g.weapon==='圣光之剑'},
  {id:'cartman',    name:'星砂之约', d:'把星砂消息告诉星砂车夫', ok:g=>g.quests&&g.quests.side_cart==='done'},
  {id:'names',      name:'名字归还', d:'替旧灯卫找回名字（巡灯人支线）', ok:g=>g.quests&&g.quests.side_name==='done'},
  {id:'mist',       name:'雾中辨形', d:'完成雾径猎手的雾灵委托', ok:g=>g.quests&&g.quests.side_mist==='done'},
];

function codexTag(name) {
  const species = SPECIES[name];
  if (!species) return '';
  const bits = [];
  if (species.tag) bits.push(species.tag);
  // 元素克制倍率（信息透明·与结算同源）：图鉴标注把确切倍率一并写出——此前只标「弱点·火/抗性·冰」
  // 不标数值，玩家看不出「这招打它到底多打/少打多少」；现直接读 ELEM_MULT（与 rules.elemMult 同一数据源），
  // 结算、图鉴、帮助页三处绝无第二套口径，纯显示不改任何伤害判定
  if (species.weak) bits.push('弱点·' + ELEM_NAME[species.weak] + '×' + ELEM_MULT.weak);
  if (species.resist) bits.push('抗性·' + ELEM_NAME[species.resist] + '×' + ELEM_MULT.resist);
  return bits.join(' · ');
}

const HELP_PAGES=[
  [
    ['移动 / 传送门','W A S D / 方向键 · 踩上传送门自动进入'],
    ['对话 / 确认','Enter（镇民需面对面）'],
    ['菜单 / 取消','Esc（大地图打开菜单，界面内返回）'],
    ['存档（槽位）','P 或菜单里「存档」'],
    ['喝药（普通/灵药）','F'],
    ['状态','I'],
    ['任务日志','J'],
    ['记忆图鉴','B'],
    ['成就一览','C'],
    ['快速旅行','T'],
    ['操作说明','H'],
    ['静音','M'],
    ['战斗','1攻击 2技能 3药水 4逃跑(约' + Math.round(FLEE_SUCCESS * 100) + '%) 5防御 6蓄力(下击/技能×' + CHARGE_MULT + ') · Boss无法逃跑'],
    ['存档槽','标题按 1/2/' + SAVE_SLOTS + ' 选择 · L 读档'],
  ],
  [
    ['潮灯镇','商店·旅馆·酿造锅·灯长(支线)·喷泉回血'],
    ['雾语林','强魔物·精英·魔王祭坛 · 右下裂洞进矿脉'],
    ['星井矿脉','更强魔物·迷宫 · 中央终焉水晶集齐双徽记后化为门'],
    ['无字回廊','名字石碑·残焰魔像·东端祭坛藏终焉之神（极高难）'],
    ['通关之路','讨回灯芯 → 击败洞窟领主 → 双徽记开门 → 回廊尽头面对终焉之神'],
  ],
  [
    ['毒蛇中毒','毒蛇有 ' + Math.round(POISON_CHANCE * 100) + '% 概率使你中毒：每回合扣血（约' + Math.round(POISON_PCT * 100) + '%最大HP）持续 ' + POISON_TURNS + ' 回合'],
    ['中毒自救','治愈术可解毒；中毒不夺行动，也可速战或喝药'],
    ['技能克制','火灼烧 / 冰冻结 / 雷穿防 / 陨石碎甲；弱点伤害×' + ELEM_MULT.weak + ' · 抗性伤害×' + ELEM_MULT.resist],
    ['石心魔像·石甲','血量低至 ' + Math.round((GOLEM_SHIELD_ACT.hpBelow || 0) * 100) + '% 后凝结石甲（至多 ' + GOLEM_SHIELD_ACT.maxShield + ' 层）：每层使下一次攻击伤害 -' + Math.round((1 - SHIELD_MULT) * 100) + '%'],
    ['高级灵药','酿造或掉落获得 🧪：可同时恢复 HP/MP，战斗 [3] 自动优先使用'],
    ['战斗掉落','胜利后约 ' + Math.round((DROP_EQUIP + DROP_POTION + DROP_MUSHROOM + DROP_ELIXIR) * 100) + '% 触发随机掉落：' + Math.round(DROP_EQUIP * 100) + '% 装备或+' + DROP_GOLD + '金 · ' + Math.round(DROP_POTION * 100) + '% 药水 · ' + Math.round(DROP_MUSHROOM * 100) + '% 蘑菇 · ' + Math.round(DROP_ELIXIR * 100) + '% 高级灵药'],
    ['宝箱掉落','开箱掉落：雾语林 ' + Math.round(CHEST_MUSHROOM * 100) + '%蘑菇·' + Math.round((1 - CHEST_MUSHROOM) * CHEST_GOLD * 100) + '%金币(' + CHEST_GOLD_BASE + '+级×' + CHEST_GOLD_PER_LV + ')·' + Math.round((1 - CHEST_MUSHROOM) * (1 - CHEST_GOLD) * 100) + '%药水；城镇/矿脉 ' + Math.round(CHEST_GOLD * 100) + '%金币·' + Math.round((1 - CHEST_GOLD) * 100) + '%药水'],
    ['魔物强度','记忆图鉴（B）可查看已遇魔物兵力与弱点，战前先看威胁预警'],
  ],
  [
    ['试炼碑位置','星井矿脉中央的蓝色石碑 —— 先凑齐两枚胜利徽记'],
    ['双徽记条件','击败 幽冥魔王 + 洞窟领主 后，试炼碑才会点亮 ⚔️'],
    ['试炼三连战','连战三名最强 Boss，全胜获「百炼成钢」；每胜一关回血' + Math.round(RUSH_RECOVER.hp * 100) + '%HP/' + Math.round(RUSH_RECOVER.mp * 100) + '%MP'],
    ['重整旗鼓','被强敌击败后按 B 原地再战；R 重开 · T 回标题'],
    ['快速旅行','已到访地图可在菜单 T 中瞬移，省去往返跑图'],
    ['蘑菇宝箱','灯长支线进行中，未开的宝箱会在小地图上金光脉动'],
  ],
];

const TRAVEL_LIST=[['village','潮灯镇','记忆之镇：商店·旅馆·灯长委托（补给与任务）','安全区 · Lv.1 即可'],['dungeon','雾语林','雾语林：魔物·宝箱·祭坛·矿脉入口','推荐 Lv.3 起 · 当心精英'],['cave','星井矿脉','星井矿脉：强敌·试炼碑·终焉水晶（高难区域）','推荐 Lv.6 起 · 高难'],['gallery','无字回廊','被遗忘者的回廊：名字石碑·残焰魔像·终焉之神','推荐 Lv.10 起 · 极高难']];

const HERO_NAMES=['余烬','灯见','潮'];
const DEFAULT_NAME = HERO_NAMES[0]; // 默认主角名（newGame 兜底/resetRun 兜底/启动建档同读此源，改名单只动 HERO_NAMES）
const DIFFS=['普通','困难'];

const STORY=[
  '序章 · 灯灭之夜',
  '潮灯镇靠记忆之灯活着：灯里燃着星砂，人们才记得归途。',
  '三夜前，广场的大灯熄了。雾从林子里漫进来，昨天开始消失。',
  '灯长说，雾语林祭坛上的【幽冥魔王】吞走了灯芯。',
  '[ Enter ] 去把灯芯讨回来',
];

const ENDING=[
  '尾声 · 半亮的黎明',
  '幽冥魔王散作一缕雾。圣光之剑里，封着他偷走的那一捧黎明。',
  '潮灯镇的灯重新亮了。人们欢呼——却仍记不起上一个冬天。',
  '井底还在低鸣。那不是魔王。那是灯自己。',
  '— 灯芯回来了。井，还没有 —',
];

const ENDING_TRUE=[
  '终章 · 记得的权利',
  '终焉之神原是初灯的意志：它想熄灭一切记忆，好让无人再失去。',
  '你没有打碎它，只是把偷来的黎明还给了所有人。',
  '潮灯镇想起了冬日、矿难、以及彼此的名字。',
  '— 灯还在。路还在。你也还在 —',
];

// 记忆碎片集齐后的真结局加页（menus.drawEnding 拼接，行数受面板行距限制，勿超 3 行）
const ENDING_TRUE_FRAG=[
  '你把四段记忆一一交还：守门人、灯卫、星砂、初灯。',
  '这一回，没有人会被忘掉——包括你自己。',
  '— 真 · 结局：全记忆 —',
];

const KEY={ ArrowUp:'U',w:'U',W:'U',ArrowDown:'D',s:'D',S:'D',ArrowLeft:'L',a:'L',A:'L',ArrowRight:'R',d:'R',D:'R' };

export {
  T, TY, chToTy, SOLID, MAPS, INN_PRICE, BREW_MUSHROOMS, BREW_GOLD, MUSHROOM_GOAL, MIST_GOAL, MUSHROOM_PRICE, RICH_GOLD, SCHOLAR_GOAL, LUCKY_GOAL, HUNT_GOAL, LVL5_GOAL, LVL10_GOAL, FIRSTBLOOD_GOAL, PERFECTION_GOLD, SAVE_SLOTS, ENCOUNTER, CAVE_TREASURE,
  NPC_SPOTS, NPCS, WEAPONS, ARMORS, SKILL_DATA, CHARGE_MULT, ELEM_NAME, ELEM_MULT, DIFF_SCALE, ELITE_GATE_LV, ELITE_CHANCE, RUSH_RECOVER, FLEE_SUCCESS, BURN_PCT, POISON_PCT, POISON_TURNS, POISON_CHANCE, SKIP_CHANCE, CRIT_RATE, CRIT_MULT, BIG_DMG, DOT_MIN, SHIELD_MULT, HIT_FB_MS, UI_PULSE_MS, IDLE_BOB, DAY_PHASE_S, BLOG_WIN, FX_ENEMY, FX_HERO, CHEST_MUSHROOM, CHEST_GOLD, CHEST_GOLD_BASE, CHEST_GOLD_PER_LV, DEFEND_MULT, DEFEND_MP, COUNTER_CHANCE, COUNTER_MULT, HEAVY_MULT, HEAVY_MULT_PHASED, HEAL_PCT, PHASE2_AT, PHASE2_HEAL_PCT, BATTLE_MON, BATTLE_HERO, ALTAR_LEAD_MS, ALTAR_TXT_MS, DROP_EQUIP, DROP_POTION, DROP_MUSHROOM, DROP_ELIXIR, DROP_GOLD, POTION_CAP, POTION_PRICE, POTION_HP_PCT, POTION_HP_FLAT, ELIXIR_HP_PCT, ELIXIR_HP_FLAT, ELIXIR_MP_PCT, XP_GROW, XP_INIT, START_GOLD, START_POTIONS,
  SPECIES, MON_BASE, ELITE_GOLEM, BOSS, CAVE_BOSS, TRUE_BOSS, TRUE_BONUS_GOLD, EMBER_GOLEM, RUSH_BOSSES, BESTIARY_TARGET,
  QUESTS, ACH_LIST, FRAGMENTS, STORY, ENDING, ENDING_TRUE, ENDING_TRUE_FRAG, HELP_PAGES, TRAVEL_LIST, HERO_NAMES, DEFAULT_NAME, DIFFS, KEY,
  baseStats, learnsAt, MAX_LEARN_LV, withSpecies, codexTag, LEVEL_GROWTH,
};
