// ============================================================
// main.js —— 入口：goto + 场景按键表
// ============================================================
import { S, curMap } from './state.js';
import { ac, startBgm, stopBgm, resumeBgm, SFX, loadSndPref, saveSndPref } from './audio.js';
import { KEY, TRAVEL_LIST, HELP_PAGES, DIFFS, STORY, HERO_NAMES, DEFAULT_NAME, SAVE_SLOTS, SHORT_MSG_MS, EVENT_MSG_MS, STRONG_MSG_MS, TUTOR_MSG_MS, MAPS } from './data.js';
import { playerAction, updateBattle } from './battle.js';
import { interact, move, loadMap, holdStep, setHeldDir, setRun } from './world.js';
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
      // v21.45 任务日志滚动（与图鉴/成就同款 ↑↓ 滚动；内容未超可视区时滚动为 0、按了也不越界——drawJournal 绘制期钳制）
      else onArrow(e,
        () => { S.journalScroll++; SFX.select(); },
        () => { S.journalScroll--; SFX.select(); }
      );
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
      // v21.43 对话翻页补 E 键别名（体验打磨·口径收尾，承 v21.29 大地图 E 交互别名 / v21.30 教程行 /
      // v21.32 面向提示同一「Enter/E 同效」主线）：v21.29-32 已把 README 快速上手表、H 页「对话 / 确认」行、
      // 教程提示、世界画面面向提示全部同步成「Enter / E」——但玩家按文档进入对话之后，对话进行中的
      // 每一页 talk.onKey 仍只认 Enter：按 E 想继续/翻页毫无反应（v21.16/v21.33「每个按键都该有反应」
      // 同族的「文档写的键按了没反应」）；现 E 与 Enter 完全同路径调用 talkNext——本页打字机未打完时
      // 补全本页、打完则翻页、末页则结束对话回 world，三种状态与 Enter 逐字同行为；isEsc 分支逐字未动，
      // KEY 无 'e' 映射（不与移动键冲突）、world 交互 E 分派零回归。纯入口、零结算、零数据变化。
      if (e.key === 'Enter' || e.key === 'e' || e.key === 'E') talkNext();
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
      } else if (e.key === 'l' || e.key === 'L') {
        // v21.33 标题页 L 读空槽静默反馈（体验打磨·反馈，承 v21.16 标题页 R 两按确认「标题页每个按键
        // 都该有反应」同族）：`(键===L) && load()` 在 load() 返回 false（该槽无存档/读取失败）时整个条件
        // 落空——标题页 1-3 选槽 / ←→ / Enter / L / R 七个输入里唯一「按下毫无反应」的静默键（选槽有
        // SFX.select、Enter 进创建页、R 有两按确认提示）；现补一句短提示（EVENT_MSG_MS 小事件档，与标题页
        // R 确认提示同族），load() 判定与读取路径逐字不动：有档仍走既有分支（v19.86 读档摘要原样），
        // 无档给出「按 Enter 开始新的冒险」的下一步引导——纯反馈零结算，行为只差这一句提示。
        SFX.cancel();
        boxMsg(`💤 槽 ${S.curSaveSlot} 还没有存档，按 Enter 开始新的冒险吧。`, EVENT_MSG_MS);
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
      // v21.42 创建页补 Esc 返回标题（体验打磨·反馈，承 v21.16/v21.33「每个按键都该有反应」与
      // 「Esc 语义全场景一致」主线）：screens 里 title 是根场景（无返回需求），create 是唯一
      // 没有任何 Esc 处理的场景——其余 shop/inn/brew/status/journal/codex/ach/help/travel/talk/
      // pause/world/battle 全部有 Esc 语义（返回/关闭）。标题页按 Enter 误入创建页后无退路：
      // 只能 Enter 出发开始新档，或进游戏后经 Esc 菜单「返回标题」绕一圈。现补
      // `isEsc(e) → goto('title')`（与 dead.onKey T 回标题同构；标题 BGM 自 title→create 起
      // 仍在播，goto('title') 即无缝返回，无需 startBgm 重启）。S.createName/S.createDiff 保留
      //（再进创建页仍是刚才的选择）。纯入口、零建档逻辑变化、零结算。
      if (isEsc(e)) { goto('title'); return; }
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
      // v21.74 开场叙事翻页补 E 键别名（体验打磨·口径收尾，承 v21.29 大地图 E 交互别名 /
      // v21.43 对话翻页 E 别名同一「Enter/E 同效」主线）：README 快速上手表与 H 页「对话 / 确认」行
      // 早已承诺「Enter / E」，对话进行中（talk）v21.43 也已同效——但开场叙事页（STORY 五页）同为
      // 「按确认键翻页」语境，story.onKey 此前仍只认 Enter：按 E 想翻页毫无反应（v21.16/v21.33/v21.43
      // 同族的「文档写的键按了没反应」）。现 E 与 Enter 完全同路径：翻页 / 末页 goto('world') /
      // 教程提示三状态零行为差；KEY 无 'e' 映射（不与移动键冲突）。纯入口、零结算、零数据变化。
      if (e.key !== 'Enter' && e.key !== 'e' && e.key !== 'E') return;
      SFX.select();
      if (S.storyPage < STORY.length) {
        S.storyPage++;
        S.storyLineAt = Date.now();
      } else {
        goto('world');
        renderHUD();
        if (!S.G.tutDone) {
          S.G.tutDone = true;
          // v21.30 教程提示口径收尾：E 与 Enter 同效（v21.29 交互别名）——README 快速上手表与
          // H 页「对话 / 确认」行 v21.29 已同步「Enter / E」，教程行是「三处只写 Enter」的最后一处漏网
          // （承 v21.14/v21.18「功能存在就必须能看到入口」主线）；TUTOR_MSG_MS 沿用不变。
          boxMsg('💡 教程：WASD移动/Shift奔跑 · Enter/E对话 · Esc菜单 · P存档 · F喝药 · I状态 · J任务 · B图鉴 · C成就 · T旅行 · H帮助 · M静音', TUTOR_MSG_MS);
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
      // v21.70 胜利画面 R 重开补两按确认（防误触·承 v21.16 标题页同族、v21.6 旅行「破坏性操作两段触发」
      // 家族）：win 场景是「灯芯回来了」结算屏——本局不自动存档（saveGame 仅 P/菜单手动触发），
      // 此前 R 单击即 resetRun 丢整个未存档的胜利战果（圣光之剑/等级/金币全在内存），与 v21.16 修掉的
      // 标题页同款「一键丢档」漏网（dead 场景 R 维持单击——战败语境下重开是显式三选一的常态出口，
      // 且 _bossRetry 快照已保底可 B 再战；胜利语境无此保底）。现复用 core.titleResetCheck 纯状态机 +
      // S.titleResetArm + data.js TITLE_RESET_CONFIRM_MS（三处单一数据源，与标题页逐字同构）：首次按 R
      // 仅武装+提示，窗口内再按 R 才执行；任一非 R 键（含 Enter 去尾声）立即解除武装，不会连发不会漏发。
      // Enter→ending 分支逐字未动，纯入口层改动、零结算零存档变化。
      if (e.key !== 'r' && e.key !== 'R') S.titleResetArm = 0;
      // v21.98 胜利画面补存档入口（体验打磨·存档闭环，承 v21.70/v21.16「win 场景出口口径」）：win 结算屏
      // 此前只有 Enter（尾声）/R（重开）两个出口——saveGame 仅 P/菜单手动触发，而 win.onKey 无 P 分支、
      // 暂停菜单在 win 场景不可达，击败幽冥魔王的战果（bossDefeated 徽记/圣光之剑/等级金币/成就收集进度）
      // 无法落盘：回标题后 L 读档只能读回战前旧档，main_cave/main_gallery/main_true（均 unlockOn
      // bossDefeated）与真结局（ENDING_TRUE）在自然流程上断链（尾声「井，还没有」明确承接后续）。现补
      // P → saveGame（与 world.onKey P 逐字同款唯一入口，回执走 S.saveMsg 既有摘要）；P 存档后回标题按
      // L 读档即可带着徽记继续星井矿脉/无字回廊/试炼之旅。Enter/R 分支与非 R 键解武装口径逐字未动，
      // 纯入口层改动、零结算零存档格式变化。
      if (e.key === 'p' || e.key === 'P') { saveGame(); return; }
      if (e.key === 'Enter') goto('ending');
      else if (e.key === 'r' || e.key === 'R') {
        // 两按确认：与标题页 R 分支逐字同构（提示文案同口径，承 v21.16）
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
  world: {
    onKey(e) {
      if (e.key === 'Enter') { interact(); return; }
      // v21.29 交互别名（体验打磨·可发现性）：E 与 Enter 同效（对话/商店/旅馆/酿造/祭坛/传送门），
      // 与 README 快速上手表、帮助页「对话 / 确认」行同口径；KEY 无 'e' 映射、不与移动键冲突。
      if (e.key === 'e' || e.key === 'E') { interact(); return; }
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
    // v21.44 按住 Shift 奔跑（体验打磨·操作手感）：Shift 键进/出各设一个 setRun 分支——与 M 静音 handler 同
    // 位置（screen 分派之前，全场景通用）；Shift 不落到任何 scene.onKey（KEY 无 Shift 映射、无场景消费），
    // 早退零行为影响；keyup 侧在 KEY 检查前先清 run（防止 Shift 与其他键组合被 KEY 分支误吞）；窗口失焦
    // （Alt-Tab 等）时 keyup 可能不派发，补 blur 兜底——与 heldDirs 的「松开方向键即移除」同一防粘滞口径。
    if (e.key === 'Shift') { setRun(true); return; }
    const screen = screens[S.scene];
    if (screen && screen.onKey) screen.onKey(e);
  });
  // 按住连走：松开方向键时从按住集合移除（world.holdStep 按节拍消费）；
  // v21.44 Shift 松开/窗口失焦时清奔跑态（keyup 先于 KEY 检查——Shift 是修饰键不属于 KEY 表）
  window.addEventListener('keyup', (e) => {
    if (e.key === 'Shift') { setRun(false); return; }
    if (KEY[e.key]) setHeldDir(KEY[e.key], false);
  });
  window.addEventListener('blur', () => setRun(false));
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
