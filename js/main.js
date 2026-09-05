// ============================================================
// main.js —— 入口：goto + 场景按键表
// ============================================================
import { S, curMap } from './state.js';
import { ac, startBgm, stopBgm, resumeBgm, SFX, loadSndPref, saveSndPref } from './audio.js';
import { KEY, TRAVEL_LIST, HELP_PAGES, DIFFS, STORY, HERO_NAMES, DEFAULT_NAME, SAVE_SLOTS, SHORT_MSG_MS, EVENT_MSG_MS, STRONG_MSG_MS, TUTOR_MSG_MS, MAPS } from './data.js';
import { playerAction, updateBattle } from './battle.js';
import { interact, move, loadMap, holdStep, setHeldDir } from './world.js';
import { beginAdventure, saveGame, usePotion, resetRun, retryBoss, load, doTravel, brewNow, talkNext, initGame, titleResetCheck } from './core.js';
import { stayInn } from './shop.js';
import { goto } from './scene.js';
import { render, openSkillMenu, drawTitle, drawCreate, drawWorld, PAUSE_ITEMS } from './view/index.js';
import { renderHUD, boxMsg } from './view/hud.js';

function dirVector(dir) {
  if (dir === 'U') return [0, -1];
  if (dir === 'D') return [0, 1];
  if (dir === 'L') return [-1, 0];
  return [1, 0];
}
function isEsc(e) { return e.key === 'Escape' || e.key === 'Esc'; }
function backWorld() { goto('world'); }

function onArrow(e, onDown, onUp) {
  if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') onDown();
  else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') onUp();
}

const screens = {
  shop: {
    onKey(e) {
      onArrow(e,
        () => { S.shopSel = (S.shopSel + 1) % S.shopList.length; SFX.select(); },
        () => { S.shopSel = (S.shopSel - 1 + S.shopList.length) % S.shopList.length; SFX.select(); }
      );
      if (e.key === 'Enter') {
        const item = S.shopList[S.shopSel];
        if (item && item.act) item.act();
      } else if (isEsc(e)) {
        backWorld();
      }
    },
  },
  inn: {
    onKey(e) {
      if (e.key === 'Enter') stayInn();
      else if (isEsc(e)) backWorld();
    },
  },
  brew: {
    onKey(e) {
      if (e.key === 'Enter') brewNow();
      else if (isEsc(e)) backWorld();
    },
  },
  status: {
    onKey(e) {
      if (e.key === 'i' || e.key === 'I' || isEsc(e)) backWorld();
      else if (e.key === 'j' || e.key === 'J') goto('journal');
    },
  },
  journal: {
    onKey(e) {
      if (e.key === 'j' || e.key === 'J' || isEsc(e)) backWorld();
      else if (e.key === 'i' || e.key === 'I') goto('status');
    },
  },
  codex: {
    onKey(e) {
      if (e.key === 'b' || e.key === 'B' || isEsc(e)) backWorld();
      else onArrow(e,
        () => { S.codexScroll++; SFX.select(); },
        () => { S.codexScroll--; SFX.select(); }
      );
    },
  },
  ach: {
    onKey(e) {
      if (e.key === 'c' || e.key === 'C' || isEsc(e)) backWorld();
      else onArrow(e,
        () => { S.achScroll++; SFX.select(); },
        () => { S.achScroll--; SFX.select(); }
      );
    },
  },
  help: {
    onKey(e) {
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        S.helpPage = (S.helpPage + 1) % HELP_PAGES.length;
        SFX.select();
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        S.helpPage = (S.helpPage - 1 + HELP_PAGES.length) % HELP_PAGES.length;
        SFX.select();
      } else if (e.key === 'h' || e.key === 'H' || isEsc(e)) {
        backWorld();
      }
    },
  },
  travel: {
    onKey(e) {
      onArrow(e,
        () => { S.travelSel = (S.travelSel + 1) % TRAVEL_LIST.length; SFX.select(); },
        () => { S.travelSel = (S.travelSel - 1 + TRAVEL_LIST.length) % TRAVEL_LIST.length; SFX.select(); }
      );
      if (e.key === 'Enter') doTravel();
      else if (isEsc(e)) backWorld();
    },
  },
  talk: {
    onKey(e) {
      if (e.key === 'Enter') talkNext();
      else if (isEsc(e)) backWorld();
    },
  },
  battle: {
    onKey(e) {
      if (S.skillMenuOpen) {
        if (!S.battleBusy) {
          const list = S.G.skills;
          const idx = ['1', '2', '3', '4', '5', '6', '7'].indexOf(e.key);
          if (idx >= 0 && idx < list.length) {
            S.skillSel = idx;   // v19.48：数字快捷施放的同时记下光标，下次打开高亮同一招
            S.skillMenuOpen = false;
            playerAction('skill', list[idx]);
          } else if (isEsc(e)) {
            S.skillMenuOpen = false;
          } else if (e.key === 'Enter' && list.length) {
            // v19.48：Enter 施放光标所在技能（与商店/快速旅行 Enter 确认同一惯例）
            const i = Math.max(0, Math.min(list.length - 1, S.skillSel || 0));
            S.skillSel = i;
            S.skillMenuOpen = false;
            playerAction('skill', list[i]);
          } else {
            // v19.48：↑↓ 移动技能光标（与 shopSel/travelSel/pauseSel 同款 onArrow 循环）
            onArrow(e,
              () => { S.skillSel = (S.skillSel + 1) % list.length; SFX.select(); },
              () => { S.skillSel = (S.skillSel - 1 + list.length) % list.length; SFX.select(); }
            );
          }
        }
        return;
      }
      if (S.battleBusy) return;
      if (e.key === '1') playerAction('attack');
      else if (e.key === '2') openSkillMenu();
      else if (e.key === '3') playerAction('item');
      else if (e.key === '4') playerAction('flee');
      else if (e.key === '5') playerAction('defend');
      else if (e.key === '6') playerAction('charge');
      else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') S.blogView++;
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') S.blogView--;
      updateBattle();
    },
  },
  title: {
    onKey(e) {
      ac();
      if (!S.bgmTimer && S.SND) startBgm('title');
      // v21.16 标题页 R 重开防误触（承 v21.6 快速旅行防误触主线）：resetRun 是破坏性重置——Esc→返回标题
      // 后 S.G 仍是进行中的冒险，误按一次 R 会零确认丢档；现改「两按确认」（core.titleResetCheck 纯判定，
      // TITLE_RESET_CONFIRM_MS 同源于 data.js）——非 R 键立即解除武装，提示停留时长与确认窗口同长。
      if (e.key !== 'r' && e.key !== 'R') S.titleResetArm = 0;
      // 标题按 1..SAVE_SLOTS 或 ←/→（亦可 A/D）选择存档槽（读 data.js SAVE_SLOTS，加档位只改常量一处）
      if (/^[1-9]$/.test(e.key) && Number(e.key) <= SAVE_SLOTS) { S.curSaveSlot = Number(e.key); SFX.select(); }
      else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { S.curSaveSlot = (S.curSaveSlot % SAVE_SLOTS) + 1; SFX.select(); }
      else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { S.curSaveSlot = ((S.curSaveSlot - 2 + SAVE_SLOTS) % SAVE_SLOTS) + 1; SFX.select(); }
      else if (e.key === 'Enter') { ac(); SFX.select(); goto('create'); }
      else if ((e.key === 'l' || e.key === 'L') && load()) {
        SFX.select();
        resumeBgm();
        goto('world');
        renderHUD();
        // v19.86 读档反馈追加角色摘要（信息透明·纯显示）：此前读取成功后只报「读取了槽 N 的存档」，
        // 玩家想确认读到了哪个角色/进度/身上多少金币仍需再按 I 看状态页。现在直接读 S.G 的 name/level/map/gold，
        // 与 v19.65 存档预览摘要、状态页信息同源，零数值变化。
        boxMsg(`💾 读取槽 ${S.curSaveSlot}：${S.G.name} Lv.${S.G.level} · ${MAPS[S.G.map].name} · ${S.G.gold} 金`, EVENT_MSG_MS);
      } else if (e.key === 'r' || e.key === 'R') {
        // v21.16 两按确认：首次仅武装+提示，窗口内再按 R 才执行 resetRun（提示与窗口同长，玩家看到提示
        // 即窗口有效）；执行后武装清零，需重新两按（不连发）；非 R 键已在上方解除武装。
        const st = titleResetCheck(S.titleResetArm || 0, Date.now(), true);
        S.titleResetArm = st.arm;
        if (st.fire) {
          resetRun();
        } else {
          SFX.cancel();
          boxMsg('🔁 再按一次 R 确认重开新档（当前冒险进度将丢弃）', EVENT_MSG_MS);
        }
      }
    },
  },
  create: {
    onKey(e) {
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        S.createName = (S.createName + 1) % HERO_NAMES.length;
        SFX.select();
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        S.createName = (S.createName - 1 + HERO_NAMES.length) % HERO_NAMES.length;
        SFX.select();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        S.createDiff = (S.createDiff + 1) % DIFFS.length;
        SFX.select();
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        S.createDiff = (S.createDiff - 1 + DIFFS.length) % DIFFS.length;
        SFX.select();
      } else if (e.key === 'Enter') {
        beginAdventure();
      }
    },
  },
  story: {
    onKey(e) {
      if (e.key !== 'Enter') return;
      SFX.select();
      if (S.storyPage < STORY.length) {
        S.storyPage++;
        S.storyLineAt = Date.now();
      } else {
        goto('world');
        renderHUD();
        if (!S.G.tutDone) {
          S.G.tutDone = true;
          boxMsg('💡 教程：WASD移动 · Enter对话 · Esc菜单 · P存档 · F喝药 · I状态 · J任务 · B图鉴 · C成就 · T旅行 · H帮助 · M静音', TUTOR_MSG_MS);
        } else {
          boxMsg('踏上旅途！去把灯芯讨回来！', STRONG_MSG_MS);
        }
      }
    },
  },
  ending: {
    onKey(e) {
      if (e.key === 'Enter') { goto('title'); startBgm('title'); }
    },
  },
  dead: {
    onKey(e) {
      if (e.key === 'r' || e.key === 'R') resetRun();
      else if (e.key === 't' || e.key === 'T') { goto('title'); startBgm('title'); }
      else if (e.key === 'b' || e.key === 'B') retryBoss();
    },
  },
  win: {
    onKey(e) {
      if (e.key === 'Enter') goto('ending');
      else if (e.key === 'r' || e.key === 'R') resetRun();
    },
  },
  world: {
    onKey(e) {
      if (e.key === 'Enter') { interact(); return; }
      if (e.key === 'p' || e.key === 'P') { saveGame(); return; }
      if (isEsc(e)) {
        S.pauseSel = 0;
        goto('pause');
        SFX.select();
        return;
      }
      if (e.key === 'f' || e.key === 'F') { usePotion(); return; }
      if (e.key === 'i' || e.key === 'I') { goto('status'); return; }
      if (e.key === 'j' || e.key === 'J') { goto('journal'); return; }
      if (e.key === 'b' || e.key === 'B') { goto('codex'); return; }
      if (e.key === 'c' || e.key === 'C') { goto('ach'); return; }
      if (e.key === 'h' || e.key === 'H') { goto('help'); return; }
      if (e.key === 't' || e.key === 'T') {
        S.travelSel = TRAVEL_LIST.findIndex((x) => x[0] === curMap());
        if (S.travelSel < 0) S.travelSel = 0;
        goto('travel');
        return;
      }
      if (KEY[e.key]) {
        e.preventDefault();
        setHeldDir(KEY[e.key], true);
        move(...dirVector(KEY[e.key]));
      }
    },
  },
  pause: {
    onKey(e) {
      onArrow(e,
        () => { S.pauseSel = (S.pauseSel + 1) % PAUSE_ITEMS.length; SFX.select(); },
        () => { S.pauseSel = (S.pauseSel - 1 + PAUSE_ITEMS.length) % PAUSE_ITEMS.length; SFX.select(); }
      );
      if (isEsc(e)) { goto('world'); return; }
      if (e.key !== 'Enter') return;
      const act = PAUSE_ITEMS[S.pauseSel];
      if (!act) return;
      SFX.select();
      if (act.id === 'resume') goto('world');
      else if (act.id === 'status') goto('status');
      else if (act.id === 'journal') goto('journal');
      else if (act.id === 'codex') goto('codex');
      else if (act.id === 'ach') goto('ach');
      else if (act.id === 'travel') {
        S.travelSel = TRAVEL_LIST.findIndex((x) => x[0] === curMap());
        if (S.travelSel < 0) S.travelSel = 0;
        goto('travel');
      }
      else if (act.id === 'save') saveGame();
      else if (act.id === 'help') goto('help');
      else if (act.id === 'title') { goto('title'); startBgm('title'); }
    },
  },
};

if (typeof window !== 'undefined') {
  // v21.21 启动恢复音频偏好（体验打磨）：M 静音状态此前刷新即失忆、回到有声，现从 localStorage
  // 恢复（读 data.js SND_KEY 单一数据源，'0'=静音其余=开；读取失败静默按默认开，不阻塞启动）。
  loadSndPref();
  window.addEventListener('keydown', (e) => {
    if (e.key === 'm' || e.key === 'M') {
      S.SND = !S.SND;
      saveSndPref();
      if (S.SND) resumeBgm();
      else stopBgm();
      renderHUD();
      boxMsg(S.SND ? '🔊 音效与音乐开启' : '🔇 静音', SHORT_MSG_MS);
      return;
    }
    const screen = screens[S.scene];
    if (screen && screen.onKey) screen.onKey(e);
  });
  // 按住连走：松开方向键时从按住集合移除（world.holdStep 按节拍消费）
  window.addEventListener('keyup', (e) => {
    if (KEY[e.key]) setHeldDir(KEY[e.key], false);
  });
}

loadMap('village');
initGame(DEFAULT_NAME);
goto('title');
drawTitle();
// 游戏时钟（冒险时长/昼夜）由固定节拍推进，与渲染解耦
let _tickPrev = 0;
function tick() {
  if (!S.G) return;
  const now = Date.now();
  if (_tickPrev) S.G.time = (S.G.time || 0) + Math.min(60, (now - _tickPrev) / 1000);
  _tickPrev = now;
}
if (typeof document !== 'undefined' && document.getElementById && document.getElementById('game')) {
  setInterval(render, 1000 / 30);
  setInterval(tick, 250);
  // 按住连走节拍（world.holdStep 内部判断场景，非 world 自动清空按住状态）
  setInterval(holdStep, 40);
}

// 供 tests/ 冒烟验证按键表结构（浏览器内无消费方）
export { screens };
