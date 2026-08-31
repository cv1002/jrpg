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
    // v19.67 商店反馈具体化（信息透明·纯显示）：购买成功/失败不再只报笼统「购买成功」「金币不足」，
    // 而是带出品名与价格，让玩家一眼确认这口消费花了多少、差多少——与商品列表/价格常量同源，零结算变化
    bind.boxMsg(`购买成功：生命药水 +1（-${POTION_PRICE} 金）`);
    bind.renderHUD();
  } else {
    bind.boxMsg(`金币不足：生命药水需 ${POTION_PRICE} 金`);
  }
}

export function sellMushroom() {
  const hero = S.G;
  if (!hero || (hero.mushrooms || 0) < 1) {
    bind.boxMsg('没有可出售的蘑菇');
    return;
  }
  if (mushroomQuestProtects(hero) && hero.mushrooms <= MUSHROOM_GOAL) {
    SFX.cancel();
    bind.boxMsg(`🍄 这是灯长委托的蘑菇，集齐 ${MUSHROOM_GOAL} 株前不能卖！`, SYS_MSG_MS);
    return;
  }
  hero.mushrooms--;
  hero.gold += MUSHROOM_PRICE;
  SFX.coin();
  bind.renderHUD();
  bind.boxMsg(`售出 1 株魔法蘑菇，得 ${MUSHROOM_PRICE} 金`);
}

export function buyWeapon(name) {
  const hero = S.G;
  const price = WEAPONS[name].price;
  if (hero.gold >= price) {
    hero.gold -= price;
    hero.weapon = name;
    SFX.shop();
    applyStats(hero);
    applyAchievements();
    bind.boxMsg(`装备了 ${name}（-${price} 金）`);
    bind.renderHUD();
  } else {
    bind.boxMsg(`金币不足：${name} 需 ${price} 金`);
  }
}

export function buyArmor(name) {
  const hero = S.G;
  const price = ARMORS[name].price;
  if (hero.gold >= price) {
    hero.gold -= price;
    hero.armor = name;
    SFX.shop();
    applyStats(hero);
    bind.boxMsg(`装备了 ${name}（-${price} 金）`);
    bind.renderHUD();
  } else {
    bind.boxMsg(`金币不足：${name} 需 ${price} 金`);
  }
}

export function stayInn() {
  const hero = S.G;
  if (hero.hp < hero.hpMax || hero.mp < hero.mpMax) {
    if (hero.gold >= INN_PRICE) {
      hero.gold -= INN_PRICE;
      hero.hp = hero.hpMax;
      hero.mp = hero.mpMax;
      SFX.heal();
      bind.boxMsg(`🌙 你美美地睡了一晚，HP/MP 恢复！（-${INN_PRICE} 金）`);
    } else {
      bind.boxMsg(`金币不足：住一晚需 ${INN_PRICE} 金`);
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
