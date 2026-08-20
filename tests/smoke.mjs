// ESM 冒烟：架构 S 对象、任务迁移、技能分化、洞窟胜利流、绘制层
import { S } from '../js/state.js';
import { ACH_LIST, SKILL_DATA, CAVE_BOSS, TRUE_BOSS, TY, CHARGE_MULT, SPECIES, BOSS } from '../js/data.js';
import { cmdDmg, elemMult, skillEstimate, atkEstimate, applyStats, deep, unlockedAchievements, codexStats } from '../js/rules.js';
import { migrateQuests, mushroomQuestProtects, questLines, setSideQuest, questJournal, questStatus, applyQuestReward, npcQuestMark, resolveNpcTalk, questRewardPreview } from '../js/quests.js';
import { initGame, saveGame, load, newGame } from '../js/core.js';
import { loadMap, applyVictoryWorld, CAVE_TREASURE, at } from '../js/world.js';
import { startBattle, winBattle, playerAction } from '../js/battle.js';
import { canSellMushroom, sellMushroom, buildShopList } from '../js/shop.js';
import { drawWorld, drawBattle, drawStatus, drawJournal, render, renderHUD } from '../js/view/index.js';
import { goto } from '../js/scene.js';

const mem={};
globalThis.localStorage={
  getItem:k=>mem[k]??null,
  setItem:(k,v)=>{mem[k]=String(v);},
  removeItem:k=>{delete mem[k];},
};

let n=0, failed=0;
function ok(name, cond, extra){
  n++;
  if(cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra||''); }
}

console.log('— v4.1 冒烟 —');

ok('S 导出对象', typeof S==='object' && S.scene==='title');
ok('不再挂 globalThis.scene', globalThis.scene===undefined);
ok('ACH_LIST.ok(g) 显式传参', ACH_LIST[0].ok({totalWins:1})===true && ACH_LIST[0].ok({totalWins:0})===false);

const g=migrateQuests({quest:1,mushrooms:2,bossDefeated:false,chests:[]});
ok('旧档 G.quest=1 迁到 side_mushroom=active', g.quests.side_mushroom==='active');
const ql=questLines(g);
ok('横幅主线不被支线覆盖', ql.main.includes('幽冥魔王') && ql.sides[0].includes('蘑菇'));
ok('任务蘑菇保护出售', mushroomQuestProtects(g)===true);

const fresh={quests:{}, mushrooms:0, level:1, gold:0, item:0};
migrateQuests(fresh);
ok('未接委托为可接', questStatus(fresh,'side_mushroom')==='offer');
ok('矿车未解锁', questStatus(fresh,'side_cart')==='locked');
ok('终焉之神未双胜前不进日志', !questJournal(fresh).some(e=>e.id==='main_true'));
ok('开局日志含村长可接', questJournal(fresh).some(e=>e.id==='side_mushroom'&&e.status==='offer'));
const pay=applyQuestReward({level:1,gold:0,item:0},'side_mushroom');
ok('村长奖励公式 40+Lv×10', pay.gold===50 && pay.item===2);
ok('开局灯长头顶可接委托', npcQuestMark(fresh,'chief')==='❕ 可接委托');
ok('闲聊 NPC 无顶标', npcQuestMark(fresh,'villager')==null);
const acc=resolveNpcTalk({quests:{},gold:0,item:0,level:1},'chief');
ok('对话接委托写回 active', acc&&acc.kind==='accept'&&acc.name==='灯长的委托');
const prev=questRewardPreview({level:1},'side_mushroom');
ok('奖励预览不改金币', prev&&prev.gold===50 && prev.item===2);

initGame('冒烟');
ok('initGame 有 G', !!(S.G&&S.G.name==='冒烟'));
loadMap('village');
ok('村庄酿造锅在 extras 坐标', at(12,6)===TY.BREW);
loadMap('dungeon');
ok('森林喷泉/猎人在 extras 坐标', at(14,8)===TY.FOUNTAIN && at(13,8)===TY.NPC);
S.G.quests={side_mushroom:'active'}; S.G.mushrooms=3; S.G.quest=1;
ok('集齐前不可卖', canSellMushroom()===false);
S.G.mushrooms=4;
ok('多于 3 株可卖', canSellMushroom()===true);

ok('治愈术解毒', SKILL_DATA['治愈术'].cleanse===true);
ok('火焰带灼烧', SKILL_DATA['火焰斩'].burn===2);
ok('冰霜带冻结', SKILL_DATA['冰霜击'].skip>0);
ok('雷鸣穿防', SKILL_DATA['雷鸣'].pierce===0.5);
ok('陨石碎甲', SKILL_DATA['陨石术'].breakShield===1);
ok('蓄力倍率 1.5', CHARGE_MULT===1.5);
ok('毒蛇弱点冰', SPECIES['毒蛇'].weak==='ice');
ok('冰打毒蛇有加成', elemMult(SKILL_DATA['冰霜击'],{weak:'ice'})===1.35);

// v6.9 图鉴魔物强度参考：codexStats 与 battle.js 的 scaleEnemy / eliteEncounter 逐字同源（同 MON_BASE 线性公式）
{
  const l = Math.max(1, S.G.level || 1);
  const slime = codexStats('史莱姆', l);
  ok('史莱姆强度随等级 = '+l, slime.hp===16+l*5 && slime.atk===5+l*2 && slime.def===2+l*1);
  const golem = codexStats('石魔像', 5);
  ok('石魔像强度 Lv5 = 71/18/15', golem.hp===71 && golem.atk===18 && golem.def===15);
  const elite = codexStats('石心魔像', 4);
  ok('石心魔像强度 Lv4 = 98/24/23（精英公式）', elite.hp===98 && elite.atk===24 && elite.def===23);
  const boss = codexStats('幽冥魔王', 3);
  ok('幽冥魔王强度固定 140/15/6 且不随等级', boss.hp===BOSS.hp && boss.atk===BOSS.atk && boss.def===BOSS.def && codexStats('幽冥魔王',9).hp===BOSS.hp);
  ok('终焉之神真身名映射到基础强度', codexStats('终焉之神·祸乱形态',1).hp===TRUE_BOSS.hp);
  ok('未知名称返回 null', codexStats('不存在的怪',1)===null);
  ok('level 越界钳制到 ≥1', codexStats('野狼',0).hp===27 && codexStats('野狼',-3).hp===27);
}

loadMap('cave');
S.G.caveBoss=true;
applyVictoryWorld({type:'cave-boss'});
let chests=0, mb=0;
for(const [x,y] of CAVE_TREASURE) if(S.maze[y][x]===TY.CHEST) chests++;
for(let y=0;y<S.maze.length;y++)for(let x=0;x<S.maze[y].length;x++) if(S.maze[y][x]===TY.MB) mb++;
ok('洞窟领主胜利清祭坛（无 GRASS 残留）', mb===0);
ok('宝藏 4 格显形', chests===4);
ok('矿车支线激活', S.G.quests.side_cart==='active');

S.G.caveBoss=false; S.G.quests.side_cart=undefined;
loadMap('cave');
S.G.hp=S.G.hpMax; S.G.mp=S.G.mpMax;
let threw=false;
try{
  startBattle(deep(CAVE_BOSS));
  S.enemy.hp=0;
  const r=winBattle();
  ok('真实胜利流返回 cave-boss', r&&r.type==='cave-boss');
}catch(e){ threw=true; console.log(e); }
ok('击败洞窟领主不抛异常', !threw);
ok('G.caveBoss 置位', S.G.caveBoss===true);

goto('world');
S.G.poison=3; S.G.skills=['治愈术']; S.G.mp=S.G.mpMax=20;
startBattle(deep({name:'毒蛇',hp:80,hpMax:80,atk:5,def:2,xp:1,gold:1,color:'#59c96b',weak:'ice'}));
S.battleBusy=false;
playerAction('skill','治愈术');
ok('战斗中治疗解毒', S.G.poison===0);

S.G.charge=true;
ok('蓄力期望伤害 ×1.5', atkEstimate(S.G,{def:0})===Math.round(Math.max(1,S.G.atkMax*2)*1.5));

goto('world');
drawWorld(); drawStatus();
goto('journal');
drawJournal();
S.scene='battle';
drawBattle();
render();
ok('drawWorld/drawBattle/drawJournal/render 不抛错', true);

S.G.weapon='圣光之剑';
ok('圣剑成就可判定', unlockedAchievements(S.G).includes('legend') || (S.G.ach||[]).includes('legend'));

S.curSaveSlot=1;
S.G.quests={side_mushroom:'done'}; S.G.quest=3;
saveGame();
const raw=JSON.parse(localStorage.getItem('jrpg_save1'));
ok('存档含 quests', raw.G.quests.side_mushroom==='done');

loadMap('dungeon');
S.G.x=4; S.G.y=7;
S.curSaveSlot=2;
saveGame();
const forestSave=JSON.parse(localStorage.getItem('jrpg_save2'));
ok('存档写入当前地图', forestSave.G.map==='dungeon' && Array.isArray(forestSave.chests));
loadMap('village');
S.G.x=0; S.G.y=0;
ok('读档回到雾语林坐标', load() && S.curMap==='dungeon' && S.G.map==='dungeon' && S.G.x===4 && S.G.y===7);

// v6.4 静音指示：renderHUD 在 S.SND 开关下输出 🔊/🔇
const sndHook={ textContent:'', style:{}, classList:{toggle(){},add(){},remove(){}}, parentElement:{classList:{toggle(){}}} };
const prevDoc = globalThis.document;
globalThis.document = { getElementById:(id)=> (id==='s-snd' ? sndHook : null) };
S.SND = true; renderHUD(); const sndOn = String(sndHook.textContent);
S.SND = false; renderHUD(); const sndOff = String(sndHook.textContent);
if (prevDoc === undefined) delete globalThis.document; else globalThis.document = prevDoc;
ok('静音指示 开=🔊 关=🔇', sndOn.includes('🔊') && sndOff.includes('🔇') && sndOn!==sndOff);

console.log(`\n${n-failed}/${n} 通过`+(failed?`，失败 ${failed}`:''));
if(failed) process.exit(1);
