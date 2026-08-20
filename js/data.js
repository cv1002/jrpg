// ============================================================
// data.js —— 纯数据 / 纯函数（不读 S、不读 G）
// ============================================================

const T=32;

const MAPS={
  village:{
    name:'潮灯镇',
    rows:[
      "111111111111111111111111",
      "100000000000000000000001",
      "1C00000000000G0000000001",
      "1..00000000000GGD0000001",
      "1..0000G000000GG00000001",
      "1....0000000000000000001",
      "1.....00000...........C1",
      "1......000......00000001",
      "1S4444100000....00000001",
      "1S4444100000100000000001",
      "1SFFF410000010C000000001",
      "1S4444100000100000000001",
      "1S4444100000100000000001",
      "1S4444111111100000000001",
      "1IIIII......000000000001",
      "1IIIII......000000000001",
      "1IIIII....0000GG00000001",
      "111111111111111111111111",
    ],
    playerStart: { x: 8, y: 15 },
    extras: [
      { x: 16, y: 7, ty: 'NPC' },
      { x: 13, y: 7, ty: 'NPC' },
      { x: 10, y: 7, ty: 'NPC' },
      { x: 12, y: 6, ty: 'BREW' },
    ],
  },
  dungeon:{
    name:'雾语林',
    rows:[
      "111111111111111111111111",
      "1E00C0000000000000000001",
      "1.0000000000000000000001",
      "1.00000000000GGGGGG00001",
      "1.00000000000....GG00001",
      "1..0000000000......00001",
      "1...00000000CC......0001",
      "1....0000000........0001",
      "1.....000000........GG01",
      "1......00000000000..GG01",
      "1.......0000000000C..GG1",
      "1........0000000000..GG1",
      "1.........00000000H....1",
      "1..........0000000000001",
      "1...........000000000001",
      "100000000000000000000C01",
      "100000000000000000000001",
      "111111111111111111111111",
    ],
    playerStart: { x: 1, y: 1 },
    extras: [
      { x: 14, y: 8, ty: 'FOUNTAIN' },
      { x: 13, y: 8, ty: 'NPC' },
      { x: 20, y: 13, ty: 'BOSS' },
      { x: 20, y: 14, ty: 'BOSS' },
    ],
  },
  cave:{
    name:'星井矿脉',
    rows:[
      "111111111111111111111111",
      "1E0000000000000000000001",
      "100000000000000000C00001",
      "100000000000000000000001",
      "1000000GGGGGG00000000001",
      "1000000.......0000000001",
      "1000000.......0000000001",
      "1000000.......0000000001",
      "100000000000000000C00001",
      "100000000000000000000001",
      "100000000000000000000001",
      "100000000000000000000001",
      "1000000000000000000MMMM1",
      "1000000000000000000MMMM1",
      "1C000000000000C000000001",
      "111111111111111111111111",
    ],
    playerStart: { x: 1, y: 1 },
    extras: [
      { x: 12, y: 10, ty: 'SB' },
      { x: 16, y: 11, ty: 'TRIAL' },
      { x: 18, y: 11, ty: 'NPC' },
      { x: 4, y: 1, ty: 'NPC' },
    ],
    // 草地/树在洞窟里改成岩地/岩壁（ASCII 仍用 0 / 1 便于共用编辑）
    replaceTiles: { GRASS: 'CAVE', TREE: 'CAVEWALL', PATH: 'CAVE' },
    treasure: [[17, 12], [18, 12], [17, 13], [18, 13]],
  },
};

const CAVE_TREASURE = MAPS.cave.treasure;
const CAVE_HOLE = { x: 18, y: 12 };

const TY = {
  GRASS: 0, TREE: 1, ROCK: 2, WATER: 3, TOWN: 4, PATH: 5, CHEST: 6, BOSS: 7,
  FOUNTAIN: 8, SHOP: 9, INN: 10, GATE: 11, EXIT: 12, NPC: 13, BREW: 14,
  CAVE: 15, MB: 16, SB: 17, TRIAL: 18, CAVEWALL: 19,
};

const CH_TO_TY = {
  '1': TY.TREE, '0': TY.GRASS, '2': TY.ROCK, '3': TY.WATER,
  '4': TY.TOWN, '.': TY.PATH, 'C': TY.CHEST, 'F': TY.FOUNTAIN,
  'S': TY.SHOP, 'I': TY.INN, 'G': TY.GRASS, 'D': TY.GATE,
  'E': TY.EXIT, 'H': TY.GATE, 'M': TY.MB, 'T': TY.SB, 'N': TY.NPC,
};
function chToTy(c) { return CH_TO_TY[c] ?? TY.GRASS; }

const SOLID = new Set([TY.TREE, TY.ROCK, TY.WATER, TY.NPC, TY.BREW, TY.CAVEWALL]);
const INTERACT = new Set([TY.SHOP, TY.INN, TY.FOUNTAIN, TY.BOSS, TY.GATE, TY.EXIT]);

const NPC_SPOTS = {
  '16,7': 'chief',
  '13,7': 'villager',
  '10,7': 'adventurer',
  '4,1': 'sage',
  '13,8': 'hunter',
  '18,11': 'cartman',
};

const NPCS={
  chief:{name:'灯长', mark:'staff'},
  villager:{name:'镇民', mark:'basket', lines:[
    ['镇民：雾语林深处那口泉水，能把忘了的名字烫回来。','灯灭之后，大家连回家的路都要数着走。','[Enter] 继续'],
    ['镇民：魔物是从雾里长出来的——像被丢掉的记忆。','出门前去杂货铺补药水。别在雾里睡着。','[Enter] 结束'],
  ]},
  adventurer:{name:'巡灯人', mark:'sword', lines:[
    ['巡灯人：我见过祭坛上的影子。那不是深渊爬出来的。','它穿着旧灯卫的袍子，手里握着一截还在烧的灯芯。','[Enter] 继续'],
    ['巡灯人：传说打败它能夺回【圣光之剑】——','那不是神器，是被它装进剑里的黎明。','[Enter] 结束'],
  ]},
  sage:{name:'井巫', mark:'hood', lines:[
    ['井巫：孩子，雾里的魔王只是一把锁。','矿脉曾往镇上运星砂。洞窟领主守着最后一车，','水晶里睡着的，才是灯自己——终焉之神。','[Enter] 继续'],
    ['井巫：试炼碑要两枚徽记：幽冥魔王与洞窟领主。','它不是在考你的剑，是在问：还愿不愿意记得。','[Enter] 结束'],
  ], after:[
    ['井巫：水晶空了。星砂落回矿脉深处，像什么都没发生过。','可那粒亮着的芯子，是你从雾里一路带回来的。','[Enter] 继续'],
    ['井巫：你不知道自己守住了什么，这就对了。','记得的灯，从此由你掌着。 [Enter] 结束'],
  ]},
  hunter:{name:'雾径猎手', mark:'hat', lines:[
    ['雾径猎手：守这片林子大半辈子。泉水还在，','喝一口，忘了的力气会回来。歇够再往祭坛走。','[Enter] 继续'],
    ['雾径猎手：草丛毒蛇牙上带毒，被咬就一路失血。','腹地石心魔像会凝石甲——旧矿的守门人走丢了。','备好药水再走！ [Enter] 结束'],
  ]},
  cartman:{name:'星砂车夫', mark:'lamp', lines:[
    ['星砂车夫：这洞从前往镇上拉星砂，喂那些记忆之灯。','洞窟领主霸了矿脉后，没运走的一车星砂和金银，','被碎石埋在矿车边上。 [Enter] 继续'],
    ['星砂车夫：你若击败洞窟领主，碎石坍落，','那车货会在祭坛左边显形。打完别急着走，','记得回头把箱子开了。 [Enter] 结束'],
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

const LEARN_AT = { 3: '冰霜击', 4: '治愈术', 5: '雷鸣', 7: '陨石术' };
function learnsAt(lv) { return LEARN_AT[lv] || null; }

const SKILL_DATA={
  '火焰斩':{mp:4,mult:1.8,kind:'atk',sfx:'fire',txt:'🗡️',element:'fire',burn:2,hint:'灼烧2回合',colors:['#ff3b3b','#ff8a2c','#ffd24a']},
  '冰霜击':{mp:5,mult:2.2,kind:'atk',sfx:'ice',txt:'❄️',element:'ice',skip:0.30,hint:'30%冻结（跳过敌回合）',colors:['#5fd8ff','#9ff0ff','#3f8fe1']},
  '雷鸣':  {mp:8,mult:2.8,kind:'atk',sfx:'thunder',txt:'⚡',element:'thunder',pierce:0.5,hint:'穿透一半防御',colors:['#ffe94a','#ffffff','#ffb84a']},
  '陨石术':{mp:14,mult:4.2,kind:'atk',sfx:'thunder',txt:'☄️',element:'meteor',breakShield:1,trueBonus:1.25,hint:'击碎石甲 · 克真身',colors:['#b06ff0','#ff5b8a','#ffd24a']},
  '治愈术':{mp:5,heal:0.55,kind:'heal',sfx:'heal',txt:'💚',cleanse:true,hint:'恢复HP并解毒',colors:['#8ff0a0','#d8ffe0','#62ff8a']},
};

const ELEM_NAME={fire:'火',ice:'冰',thunder:'雷',meteor:'陨石'};
const CHARGE_MULT=1.5;

const SPECIES={
  '史莱姆':  {draw:'slime', weak:'fire'},
  '野狼':    {draw:'wolf', weak:'fire'},
  '骷髅兵':  {draw:'skel', weak:'fire', resist:'ice'},
  '哥布林':  {draw:'goblin', weak:'ice'},
  '毒蛇':    {draw:'snake', weak:'ice', poison:0.35, tag:'☠️ 会施毒 · 扣血3回合'},
  '树精':    {draw:'tree', weak:'fire', resist:'ice'},
  '石魔像':  {draw:'stone', weak:'thunder', resist:'fire'},
  '石心魔像':{draw:'golem', weak:'thunder', isElite:true, tag:'🍄 必掉魔法蘑菇',
    acts:[{type:'attack',w:55},{type:'shield',w:45,maxShield:3,hpBelow:0.5}]},
  '幽冥魔王':{draw:'boss', resist:'ice', tag:'⚔️ 必掉圣光之剑',
    acts:[{type:'attack',w:50},{type:'heavy',w:30,w2:45},{type:'heal',w:20,hpBelow:0.4,pct:0.12}],
    phase2:{at:0.5,name:'幽冥魔王·真身',color:'#6a2ad9',atk:7,def:3,heal:0.15}},
  '洞窟领主':{draw:'caveboss', weak:'thunder', tag:'💠 击败清除祭坛',
    acts:[{type:'attack',w:35},{type:'shield',w:30,maxShield:2},{type:'heavy',w:20},{type:'heal',w:15,hpBelow:0.4,pct:0.10}],
    phase2:{at:0.5,name:'洞窟领主·真身',color:'#5aa0d0',atk:5,def:2,heal:0.10}},
  '终焉之神':{draw:'true', resist:'fire', tag:'💰 击败+300金',
    acts:[{type:'attack',w:40},{type:'heavy',w:35,w2:50},{type:'heal',w:25,hpBelow:0.4,pct:0.12}],
    phase2:{at:0.5,name:'终焉之神·祸乱形态',color:'#ff5b8a',atk:7,def:3,heal:0.15,forbid:['heal']}},
};

const MON_BASE=[
  {name:'史莱姆',hp:[16,5],atk:[5,2],def:[2,1],xp:[8,3],gold:[8,2],color:'#7fd84f',weak:'fire',draw:'slime'},
  {name:'野狼',  hp:[22,5],atk:[7,2],def:[3,1],xp:[12,3],gold:[12,2],color:'#9aa3ad',weak:'fire',draw:'wolf'},
  {name:'骷髅兵',hp:[26,6],atk:[8,2],def:[5,1],xp:[16,4],gold:[15,3],color:'#d9d3c0',weak:'fire',resist:'ice',draw:'skel'},
  {name:'哥布林',hp:[20,5],atk:[6,2],def:[3,1],xp:[10,3],gold:[10,2],color:'#6fae4f',weak:'ice',draw:'goblin'},
  {name:'毒蛇',  hp:[20,5],atk:[8,2],def:[3,1],xp:[15,3],gold:[13,2],color:'#59c96b',poison:0.35,weak:'ice',draw:'snake'},
  {name:'树精',  hp:[30,6],atk:[7,2],def:[6,1],xp:[18,4],gold:[16,3],color:'#4c8f5a',weak:'fire',resist:'ice',draw:'tree'},
  {name:'石魔像',hp:[36,7],atk:[8,2],def:[10,1],xp:[22,4],gold:[20,3],color:'#8a8577',weak:'thunder',resist:'fire',draw:'stone'},
];

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

const BOSS=withSpecies({name:'幽冥魔王',hp:140,hpMax:140,atk:15,def:6,xp:150,gold:300,color:'#a03fd9',isBoss:true,bossHpMax:140});
const CAVE_BOSS=withSpecies({name:'洞窟领主',hp:110,hpMax:110,atk:16,def:10,xp:120,gold:200,color:'#3f6b9f',isElite:true,isCaveBoss:true});
const TRUE_BOSS=withSpecies({name:'终焉之神',hp:260,hpMax:260,atk:22,def:13,xp:400,gold:600,color:'#f0c040',isTrue:true,isElite:true});

const RUSH_BOSSES=[
  withSpecies({name:'幽冥魔王',hp:140,hpMax:140,atk:15,def:6,xp:60,gold:0,color:'#a03fd9',isRush:true}),
  withSpecies({name:'洞窟领主',hp:110,hpMax:110,atk:16,def:10,xp:60,gold:0,color:'#3f6b9f',isRush:true}),
  withSpecies({name:'终焉之神',hp:260,hpMax:260,atk:22,def:13,xp:90,gold:0,color:'#f0c040',isRush:true}),
];

const BESTIARY_TARGET=['史莱姆','野狼','骷髅兵','哥布林','毒蛇','树精','石魔像','石心魔像','幽冥魔王','洞窟领主','终焉之神'];

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
  main_true:{
    id:'main_true', kind:'main', flag:'trueBoss', unlockOn:['bossDefeated','caveBoss'],
    hiddenUntilUnlock:true,
    name:'初灯的审判', where:'星井矿脉·终焉水晶',
    obj:'✨ 隐藏目标：寻得星井矿脉中的终焉水晶，讨伐终焉之神！',
    done:'终焉之神已散。记忆回到镇上——你守住了记得的权利。',
  },
  side_mushroom:{
    id:'side_mushroom', kind:'side', store:true, n:3, item:'mushrooms', giver:'chief',
    name:'灯长的委托', where:'雾语林宝箱 → 回镇找灯长',
    obj:'找回魔法蘑菇',
    offer:'去潮灯镇找灯长，接下唤醒井泉的委托',
    turnin:'回镇找灯长领取奖励！',
    done:'井泉被荧光重新点亮。灯长的委托完成。',
    reward:{ gold:(lv)=>40+lv*10, item:2 },
    talk:{
      offer:[[
        '灯芯灭了，井口的泉水也跟着黯了。',
        '林子里的【魔法蘑菇】带着残灯的荧光。帮我找回 3 株，好吗？',
        '[Enter] 接下委托   [Esc] 离开',
      ]],
      active:(hero)=>[[
        '魔法蘑菇藏在雾语林的宝箱里。那是残灯掉落的核。',
        `（已找到 ${hero.mushrooms||0}/3 株）`,
        '[Enter] 继续',
      ]],
      turnin:[[
        '你回来了！这些荧光……井泉会重新认得路。',
        '[Enter] 领取奖励',
      ]],
      done:[[
        '谢谢你。泉水亮了一点。可广场那盏大灯，还在等灯芯。',
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
};

const ACH_LIST=[
  {id:'firstblood', name:'初露锋芒', d:'赢得第一场战斗', ok:g=>g.totalWins>=1, prog:g=>`${g.totalWins||0}/1`},
  {id:'hunt10',     name:'驱雾十战', d:'累计讨伐 10 只魔物', ok:g=>g.totalWins>=10, prog:g=>`${g.totalWins||0}/10`},
  {id:'lucky',      name:'幸运眷顾', d:'累计获得 5 次额外掉落', ok:g=>(g.drops||0)>=5, prog:g=>`${g.drops||0}/5`},
  {id:'lvl5',       name:'独当一面', d:'等级达到 5 级', ok:g=>g.level>=5, prog:g=>`${g.level||1}/5`},
  {id:'lvl10',      name:'守灯者',   d:'等级达到 10 级', ok:g=>g.level>=10, prog:g=>`${g.level||1}/10`},
  {id:'rich',       name:'小富翁',   d:'持有 500 金币', ok:g=>g.gold>=500, prog:g=>`${Math.floor(g.gold||0)}/500`},
  {id:'scholar',    name:'图鉴学家', d:'图鉴收录 5 种魔物', ok:g=>Object.keys(g.bestiary||{}).length>=5, prog:g=>`${Object.keys(g.bestiary||{}).length}/5`},
  {id:'quest',      name:'三株荧光', d:'完成灯长的支线任务', ok:g=>(g.quests&&g.quests.side_mushroom==='done')||g.quest>=3},
  {id:'boss',       name:'讨回灯芯', d:'击倒幽冥魔王', ok:g=>!!g.bossDefeated},
  {id:'cave',       name:'井之守望', d:'击败洞窟领主', ok:g=>!!g.caveBoss},
  {id:'trueboss',   name:'记得一切', d:'击败隐藏的终焉之神', ok:g=>!!g.trueBoss},
  {id:'rush',       name:'百炼成钢', d:'通过试炼场三连战', ok:g=>!!g.rushDone},
  {id:'perfection', name:'图鉴征服', d:'图鉴收录全部 11 种魔物', ok:g=>BESTIARY_TARGET.every(n=>(g.bestiary||{})[n]>=1), prog:g=>`${BESTIARY_TARGET.filter(n=>(g.bestiary||{})[n]>=1).length}/${BESTIARY_TARGET.length}`},
  {id:'legend',     name:'黎明归剑', d:'装备传说圣光之剑', ok:g=>g.weapon==='圣光之剑'},
  {id:'cartman',    name:'星砂之约', d:'把星砂消息告诉星砂车夫', ok:g=>g.quests&&g.quests.side_cart==='done'},
];

function codexTag(name) {
  const species = SPECIES[name];
  if (!species) return '';
  const bits = [];
  if (species.tag) bits.push(species.tag);
  if (species.weak) bits.push('弱点·' + ELEM_NAME[species.weak]);
  if (species.resist) bits.push('抗性·' + ELEM_NAME[species.resist]);
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
    ['敌人图鉴','B'],
    ['成就一览','C'],
    ['快速旅行','T'],
    ['操作说明','H'],
    ['静音','M'],
    ['战斗','1攻击 2技能 3药水 4逃跑(约60%) 5防御 6蓄力(下击/技能×1.5) · Boss无法逃跑'],
    ['存档槽','标题按 1/2/3 选择 · L 读档'],
  ],
  [
    ['潮灯镇','商店·旅馆·酿造锅·灯长(支线)·喷泉回血'],
    ['雾语林','强魔物·精英·魔王祭坛 · 右下裂洞进矿脉'],
    ['星井矿脉','更强魔物·迷宫 · 中央终焉水晶(隐藏真Boss)'],
    ['通关之路','讨回灯芯 → 击败洞窟领主 → 面对终焉之神'],
  ],
  [
    ['毒蛇中毒','毒蛇有 35% 概率使你中毒：每回合扣血（约5%最大HP）持续 3 回合'],
    ['中毒自救','治愈术可解毒；中毒不夺行动，也可速战或喝药'],
    ['技能克制','火灼烧 / 冰冻结 / 雷穿防 / 陨石碎甲；图鉴显示弱点'],
    ['石心魔像·石甲','血量过半后凝结石甲（至多 3 层）：每层使下一次攻击伤害 -40%'],
    ['高级灵药','酿造或掉落获得 🧪：可同时恢复 HP/MP，战斗 [3] 自动优先使用'],
    ['魔物强度','图鉴（B）可查看已遇魔物兵力与弱点，战前先看威胁预警'],
  ],
  [
    ['试炼碑位置','星井矿脉中央的蓝色石碑 —— 先凑齐两枚胜利徽记'],
    ['双徽记条件','击败 幽冥魔王 + 洞窟领主 后，试炼碑才会点亮 ⚔️'],
    ['试炼三连战','一次连战三名最强 Boss，全胜获「百炼成钢」成就与丰厚经验'],
    ['重整旗鼓','被强敌击败后按 B 原地再战；R 重开 · T 回标题'],
    ['快速旅行','已到访地图可在菜单 T 中瞬移，省去往返跑图'],
    ['蘑菇宝箱','灯长支线进行中，未开的宝箱会在小地图上金光脉动'],
  ],
];

const TRAVEL_LIST=[['village','潮灯镇','记忆之镇：商店·旅馆·灯长委托（补给与任务）','安全区 · Lv.1 即可'],['dungeon','雾语林','雾语林：魔物·宝箱·祭坛·矿脉入口','推荐 Lv.3 起 · 当心精英'],['cave','星井矿脉','星井矿脉：强敌·试炼碑·终焉水晶（高难区域）','推荐 Lv.6 起 · 高难']];

const HERO_NAMES=['余烬','灯见','潮'];
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

const KEY={ ArrowUp:'U',w:'U',W:'U',ArrowDown:'D',s:'D',S:'D',ArrowLeft:'L',a:'L',A:'L',ArrowRight:'R',d:'R',D:'R' };

export {
  T, TY, chToTy, SOLID, INTERACT, MAPS, CAVE_HOLE, CAVE_TREASURE,
  NPC_SPOTS, NPCS, WEAPONS, ARMORS, SKILL_DATA, CHARGE_MULT, ELEM_NAME,
  SPECIES, MON_BASE, BOSS, CAVE_BOSS, TRUE_BOSS, RUSH_BOSSES, BESTIARY_TARGET,
  QUESTS, ACH_LIST, STORY, ENDING, ENDING_TRUE, HELP_PAGES, TRAVEL_LIST, HERO_NAMES, DIFFS, KEY,
  baseStats, learnsAt, withSpecies, codexTag,
};
