// ============================================================
// shop.js —— 商店 / 旅馆购买（从绘制层迁出）
// boxMsg / renderHUD ← view/hud.js
// ============================================================
import { S } from './state.js';
import { WEAPONS, ARMORS } from './data.js';
import { applyStats } from './rules.js';
import { SFX } from './audio.js';
import { bind } from './bind.js';
import { mushroomQuestProtects } from './quests.js';
import { applyAchievements } from './hero.js';
import { goto } from './scene.js';

export function canSellMushroom() {
  const hero = S.G;
  if (!hero || (hero.mushrooms || 0) < 1) return false;
  if (mushroomQuestProtects(hero) && hero.mushrooms <= 3) return false;
  return true;
}

export function buyPotion() {
  const hero = S.G;
  if (hero.item >= 99) {
    SFX.cancel();
    bind.boxMsg('🎒 背包已满（药水上限 99 瓶），先去用掉一些吧！', 1800);
    return;
  }
  if (hero.gold >= 15) {
    hero.gold -= 15;
    hero.item++;
    SFX.shop();
    bind.boxMsg('购买成功');
    bind.renderHUD();
  } else {
    bind.boxMsg('金币不足');
  }
}

export function sellMushroom() {
  const hero = S.G;
  if (!hero || (hero.mushrooms || 0) < 1) {
    bind.boxMsg('没有可出售的蘑菇');
    return;
  }
  if (mushroomQuestProtects(hero) && hero.mushrooms <= 3) {
    SFX.cancel();
    bind.boxMsg('🍄 这是灯长委托的蘑菇，集齐 3 株前不能卖！', 2200);
    return;
  }
  hero.mushrooms--;
  hero.gold += 10;
  SFX.coin();
  bind.renderHUD();
  bind.boxMsg('售出 1 株魔法蘑菇，得 10 金');
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
    bind.boxMsg(`装备了 ${name}`);
    bind.renderHUD();
  } else {
    bind.boxMsg('金币不足');
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
    bind.boxMsg(`装备了 ${name}`);
    bind.renderHUD();
  } else {
    bind.boxMsg('金币不足');
  }
}

export function stayInn() {
  const hero = S.G;
  if (hero.hp < hero.hpMax || hero.mp < hero.mpMax) {
    if (hero.gold >= S.innPrice) {
      hero.gold -= S.innPrice;
      hero.hp = hero.hpMax;
      hero.mp = hero.mpMax;
      SFX.heal();
      bind.boxMsg('🌙 你美美地睡了一晚，HP/MP 恢复！');
    } else {
      bind.boxMsg('金币不足！');
    }
  } else {
    bind.boxMsg('你现在精神饱满。');
  }
  bind.renderHUD();
}

export function buildShopList() {
  const hero = S.G;
  const list = [];
  list.push({ t: `🍖 生命药水 ×1（恢复 50%HP +8）[现有${hero.item}/99]`, price: 15, kind: 'potion', act: buyPotion });
  if (hero.mushrooms > 0) {
    const blocked = mushroomQuestProtects(hero) && hero.mushrooms <= 3;
    list.push({
      t: blocked
        ? `🍄 魔法蘑菇 ×1（任务物品，集齐前不可卖）[现${hero.mushrooms}]`
        : `🍄 卖出魔法蘑菇 ×1 → 10金 [现${hero.mushrooms}]`,
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
