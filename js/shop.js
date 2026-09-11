// ============================================================
// shop.js —— 商店 / 旅馆购买（从绘制层迁出）
// boxMsg / renderHUD ← view/hud.js
// ============================================================
import { S } from './state.js';
import { WEAPONS, ARMORS, INN_PRICE, POTION_CAP, POTION_PRICE, POTION_HP_PCT, POTION_HP_FLAT, MUSHROOM_GOAL, MUSHROOM_PRICE, SYS_MSG_MS, NARR_MSG_MS } from './data.js';
import { applyStats } from './rules.js';
import { SFX } from './audio.js';
import { bind } from './bind.js';
import { mushroomQuestProtects } from './quests.js';
import { applyAchievements } from './hero.js';
import { goto } from './scene.js';

export function canSellMushroom() {
  const hero = S.G;
  if (!hero || (hero.mushrooms || 0) < 1) return false;
  if (mushroomQuestProtects(hero) && hero.mushrooms <= MUSHROOM_GOAL) return false;
  return true;
}

export function buyPotion() {
  // v22.10 未存档提醒置脏（防误丢档）：购买/出售/住店是商店侧唯一的冒险状态改动入口，置 S.unsaved=true；
  // saveGame/load 成功清脏，beforeunload 守卫读之。纯状态标志零结算。
  S.unsaved = true; // v22.10 未存档提醒置脏
  const hero = S.G;
  if (hero.item >= POTION_CAP) {
    SFX.cancel();
    bind.boxMsg(`🎒 背包已满（药水上限 ${POTION_CAP} 瓶），先去用掉一些吧！`, NARR_MSG_MS);
    return;
  }
  if (hero.gold >= POTION_PRICE) {
    hero.gold -= POTION_PRICE;
    hero.item++;
    SFX.shop();
    // v19.78 购买药水反馈追加剩余药水与金币（信息透明·纯显示）：v19.67 已带价格，但玩家消费后
    // 想确认「药水还剩几瓶 / 兜里还剩多少金币」仍需瞄 HUD 或按 I 看状态页；现在直接读结算后的
    // hero.item / hero.gold，与 v19.74 喝药剩余量、v19.75/19.76/19.77 消费余额同源。
    bind.boxMsg(`购买成功：生命药水 +1（-${POTION_PRICE} 金，剩余 ${hero.item}/${POTION_CAP} 瓶 / ${hero.gold} 金）`);
    bind.renderHUD();
    // v22.0 买药水当场判定成就（反馈不迟到，承 v21.73 buyArmor 先例）：applyAchievements 幂等（已解锁
    // 不重报、perfection 不重复加奖），买满第 POTIONS_GOAL 瓶（成就「有备无患」= 持有 20 瓶）的瞬间即
    // 解锁——此前要等下一场胜利/开箱等判定点才解锁，反馈迟到；零结算零数值变化，购买/扣款/加库存逐字未动。
    applyAchievements();
  } else {
    // v21.63 金币不足拦截报差额（信息透明·纯显示）：v19.67 已带品名/价格，但玩家被拒时想确认
    // 「兜里有多少、还差多少」仍需瞄 HUD 或按 I 看状态页——旅馆面板端 drawInn 红字
    // 「（还差 N 金）」（menus.js）与 v19.69 酿造材料不足「（当前 A/B）」早已量化，唯独按下
    // 确认这一刻的拦截弹条四处（药水/武器/防具/住店）都只报价格。现四处同式补
    // 「（当前 N 金，还差 M 金）」：差额 = 价格 − hero.gold，与上方判定 `hero.gold >= price`
    // 同读一份源（进入本分支差额恒正），调价只改 data.js 常量、面板/弹条两端自动跟随。
    // 零结算零数值变化（拦截语义逐字未动：不扣款、不进货、SFX/return 路径不变）。
    bind.boxMsg(`金币不足：生命药水需 ${POTION_PRICE} 金（当前 ${hero.gold} 金，还差 ${POTION_PRICE - hero.gold} 金）`);
  }
}

export function sellMushroom() {
  S.unsaved = true; // v22.10 未存档提醒置脏
  const hero = S.G;
  if (!hero || (hero.mushrooms || 0) < 1) {
    bind.boxMsg('没有可出售的蘑菇');
    return;
  }
  if (mushroomQuestProtects(hero) && hero.mushrooms <= MUSHROOM_GOAL) {
    SFX.cancel();
    bind.boxMsg(`🍄 这是灯长委托的蘑菇，当前 ${hero.mushrooms}/${MUSHROOM_GOAL} 株，集齐 ${MUSHROOM_GOAL} 株前不能卖！`, SYS_MSG_MS);
    return;
  }
  hero.mushrooms--;
  hero.gold += MUSHROOM_PRICE;
  SFX.coin();
  bind.renderHUD();
  bind.boxMsg(`售出 1 株魔法蘑菇，得 ${MUSHROOM_PRICE} 金（剩余 ${hero.mushrooms} 株 / 共 ${hero.gold} 金）`);
}

export function buyWeapon(name) {
  S.unsaved = true; // v22.10 未存档提醒置脏
  const hero = S.G;
  const price = WEAPONS[name].price;
  if (hero.gold >= price) {
    // v20.5 购买反馈追加面板攻击前后对比（信息透明·纯显示）：在改动装备前捕获旧总攻击，
    // 与状态页「基础+装备=总面板」同源（applyStats 后 hero.atkMax 即新值），旧档防御力兜底。
    const atkBefore = typeof hero.atkMax === 'number' ? hero.atkMax : null;
    hero.gold -= price;
    hero.weapon = name;
    SFX.shop();
    applyStats(hero);
    applyAchievements();
    // v19.75 武器购买反馈追加剩余金币（信息透明·纯显示）：v19.67 已带价格，但玩家大额消费后
    // 想确认「兜里还剩多少」仍需瞄 HUD；现在直接读结算后的 hero.gold，与 v19.70/73/74 同源。
    bind.boxMsg(`装备了 ${name}（-${price} 金，剩余 ${hero.gold} 金${atkBefore !== null ? ` · 攻击 ${atkBefore}→${hero.atkMax}` : ''}）`);
    bind.renderHUD();
  } else {
    // v21.63 金币不足拦截报差额：同 buyPotion（差额 = price − hero.gold，本分支恒正）。
    bind.boxMsg(`金币不足：${name} 需 ${price} 金（当前 ${hero.gold} 金，还差 ${price - hero.gold} 金）`);
  }
}

export function buyArmor(name) {
  S.unsaved = true; // v22.10 未存档提醒置脏
  const hero = S.G;
  const price = ARMORS[name].price;
  if (hero.gold >= price) {
    // v20.5 购买反馈追加面板防御前后对比（信息透明·纯显示）：同 buyWeapon，零结算变化。
    const defBefore = typeof hero.defMax === 'number' ? hero.defMax : null;
    hero.gold -= price;
    hero.armor = name;
    SFX.shop();
    applyStats(hero);
    // v21.73 防具购买当场判定成就（反馈不迟到）：buyWeapon 早已在结算后 applyAchievements
    // （legend「黎明归剑」当场解锁），buyArmor 此前漏接——v21.73 新成就「龙鳞加身」（装备最强
    // 铠甲 BEST_ARMOR）的唯一来源就是本函数（rollDrop 装备档只到锁子甲），不当场判定就要等
    // 下一场战斗胜利的 applyAchievements 才解锁；承 world.js 开箱当场判定同一惯例。
    // applyAchievements 幂等（已解锁不重报、perfection 不重复加奖），零结算零数值变化。
    applyAchievements();
    // v19.75 防具购买反馈追加剩余金币（信息透明·纯显示）：同武器购买，零结算变化。
    bind.boxMsg(`装备了 ${name}（-${price} 金，剩余 ${hero.gold} 金${defBefore !== null ? ` · 防御 ${defBefore}→${hero.defMax}` : ''}）`);
    bind.renderHUD();
  } else {
    // v21.63 金币不足拦截报差额：同 buyPotion（差额 = price − hero.gold，本分支恒正）。
    bind.boxMsg(`金币不足：${name} 需 ${price} 金（当前 ${hero.gold} 金，还差 ${price - hero.gold} 金）`);
  }
}

export function stayInn() {
  S.unsaved = true; // v22.10 未存档提醒置脏
  const hero = S.G;
  if (hero.hp < hero.hpMax || hero.mp < hero.mpMax) {
    if (hero.gold >= INN_PRICE) {
      hero.gold -= INN_PRICE;
      const hpBefore = hero.hp;
      const mpBefore = hero.mp;
      hero.hp = hero.hpMax;
      hero.mp = hero.mpMax;
      SFX.heal();
      // v19.76 旅馆住宿反馈追加剩余金币（信息透明·纯显示）：v19.67 已带价格，但大额恢复消费后
      // 玩家想确认「兜里还剩多少」仍需瞄 HUD；现在直接读结算后的 hero.gold，与 v19.75 装备购买同源。
      // v21.66 住店结算报文补恢复量与结算后状态（信息透明·口径一致·纯显示）：住店恢复链条的
      // 面板预览端（drawInn「今晚将恢复 HP +N MP +M」）与免费全恢复对照端（v19.94 清泉
      // 「HP +N（X/Y）· MP +M（A/B）完全恢复！」）早已量化，唯独按下确认这一刻的结算报文
      // 只报「HP/MP 恢复！」——玩家花 10 金睡一觉，想确认「到底回了多少、现在满没满」仍需瞄 HUD
      // 或按 I 看状态页；现按清泉同式补「HP +N（X/Y）· MP +M（A/B）完全恢复！」（恢复量 =
      // 结算前后差，与面板预览同读 hpMax-hp/mpMax-mp 一份源；进入本分支至少一项缺损，已满项
      // 如实报 +0，与清泉同口径），v19.76 金币后缀保留。恢复结算（hero.hp/mp = hpMax/mpMax
      // 满恢复）逐字未动，只在其前补两行取值——零结算零数值零存档变化。
      bind.boxMsg(`🌙 你美美地睡了一晚，HP +${hero.hp - hpBefore}（${hero.hp}/${hero.hpMax}）· MP +${hero.mp - mpBefore}（${hero.mp}/${hero.mpMax}）完全恢复！（-${INN_PRICE} 金，剩余 ${hero.gold} 金）`);
    } else {
      // v21.63 金币不足拦截报差额：同 buyPotion；与 drawInn 面板红字「（还差 N 金）」同口径。
      bind.boxMsg(`金币不足：住一晚需 ${INN_PRICE} 金（当前 ${hero.gold} 金，还差 ${INN_PRICE - hero.gold} 金）`);
    }
  } else {
    bind.boxMsg('你现在精神饱满。');
  }
  bind.renderHUD();
}

export function buildShopList() {
  const hero = S.G;
  const list = [];
  list.push({ t: `🍖 生命药水 ×1（恢复 ${Math.round(POTION_HP_PCT * 100)}%HP +${POTION_HP_FLAT}）[现有${hero.item}/${POTION_CAP}]`, price: POTION_PRICE, kind: 'potion', act: buyPotion });
  if (hero.mushrooms > 0) {
    const blocked = mushroomQuestProtects(hero) && hero.mushrooms <= MUSHROOM_GOAL;
    list.push({
      t: blocked
        ? `🍄 魔法蘑菇 ×1（任务物品，集齐前不可卖）[现${hero.mushrooms}]`
        : `🍄 卖出魔法蘑菇 ×1 → ${MUSHROOM_PRICE}金 [现${hero.mushrooms}]`,
      price: 0, kind: 'sell', blocked, act: sellMushroom,
    });
  }
  Object.keys(WEAPONS).forEach((name) => {
    if (name === hero.weapon || WEAPONS[name].legend) return;
    const delta = WEAPONS[name].atk - WEAPONS[hero.weapon].atk;
    const tag = delta ? (delta > 0 ? ' ▲攻+' + delta : ' ▼攻' + delta) : '';
    list.push({
      t: `⚔️ ${name} (攻+${WEAPONS[name].atk})${tag}`,
      price: WEAPONS[name].price,
      up: delta > 0,
      kind: 'weapon',
      act() { buyWeapon(name); },
    });
  });
  Object.keys(ARMORS).forEach((name) => {
    if (name === hero.armor) return;
    const delta = ARMORS[name].def - ARMORS[hero.armor].def;
    const tag = delta ? (delta > 0 ? ' ▲防+' + delta : ' ▼防' + delta) : '';
    list.push({
      t: `🛡️ ${name} (防+${ARMORS[name].def})${tag}`,
      price: ARMORS[name].price,
      up: delta > 0,
      kind: 'armor',
      act() { buyArmor(name); },
    });
  });
  list.push({ t: '✖ 离开商店', price: 0, kind: 'leave', act() { goto('world'); } });
  S.shopList = list;
  S.shopSel = 0;
  return list;
}
