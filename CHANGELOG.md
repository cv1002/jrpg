# 潮灯记 · 变更日志

模块化 Canvas JRPG（v1.x 为单文件 `index.html`，v2.0 起拆分 `index.html` + `js/` ES Modules）。v4.0 执行 `improve-plan.md`。v5.0 换上全新剧情。

## v19.33 成就/终局类「成就档」停留时长单一数据源——三处捷报同读 ACH_MSG_MS（纯时序·单一口径，与 v19.32 WIN_MSG_MS / v19.31 STRONG_MSG_MS / v19.30 EVENT_MSG_MS / v19.29 FINAL_LEAD_MS / v19.28 NARR_MSG_MS / v19.27 SHORT_MSG_MS / v19.26 MILESTONE_MS / v19.25 SYS_MSG_MS / v19.24 ALTAR_TXT_MS / v19.23 ALTAR_LEAD_MS 同一「提示框停留时长」家族——本版收口的是历版注释从 v19.25 起反复标注「成就类 · 刻意保留」的 3200 档，也是该家族自 v19.23 起连续第十一块拼图）

- 【成就档「3200ms」以裸字面量写两个文件三处、三处互不相关】里程碑式成就/终局回馈以完全相同的 `boxMsg(..., 3200)` 裸写两个文件：`battle.js` 试炼通关（行 424）、真结局落幕（行 455）、`hero.js` 成就解锁（行 117）——三处同值互不引用：想调这类成就回馈读多久（如放慢到 3400 让通关/解锁更有仪式感、收紧到 3000 更利落）要改三个地方、还极易只改一处漏改另几处——试炼通关/真结局/成就解锁的停留时长悄然脱钩，而这个参数始终没有名字（v19.25 收口 SYS_MSG_MS、v19.26 收口 MILESTONE_MS、v19.27 收口 SHORT_MSG_MS、v19.28 收口 NARR_MSG_MS、v19.30 收口 EVENT_MSG_MS、v19.31 收口 STRONG_MSG_MS、v19.32 收口 WIN_MSG_MS 时都已在注释里把 3200 明确标注「成就类 · 刻意保留」，正是它们共同的下一块拼图）。
- 【修正：data.js 在 `WIN_MSG_MS` 之后新增 `ACH_MSG_MS = 3200`（成就/终局类「成就档」停留时长，单位 ms，纯时序）为唯一真源，注释说明三处派生形态与刻意保留的其余停留时级（图鉴 4200 同属「成就类」却是更长的独立档；更长档 2800 记忆碎片 / 教程 3600 各为独立语义；战间 1400 家族与两处 `setTimeout(..., 1800)`「延时/过渡」另一语义刻意不并入），随原 export 块导出，零新增依赖】`battle.js` 两处、`hero.js` 一处 `boxMsg(..., 3200)` 改读 `boxMsg(..., ACH_MSG_MS)`（两模块 import 列表同步加 ACH_MSG_MS；STRONG_MSG_MS / WIN_MSG_MS 注释里「成就类 3200 · 刻意保留」同步改写为指向新源）。收益：调成就捷报停留节奏只改 data.js 一处、两个模块三处同步，绝无第二套口径；行为逐字不变（`ACH_MSG_MS` 仍为 3200，三处停留时长与旧字面量逐值恒等），零战斗/成就/终局流程回归。
- 【零回归面】未动提示机制本身——boxMsg 内容、三处业务判定（winBattle 试炼通关分支、真结局落幕分支、applyAchievements 成就解锁）全部原样；其余 boxMsg 停留时级逐字未动：短档 1200（SHORT_MSG_MS）、中长档 1800（NARR_MSG_MS 八处）、常规档 2200（SYS_MSG_MS）、里程碑档 2400（MILESTONE_MS）、小事件档 1600（EVENT_MSG_MS 六处）、强敌文案 1600（ALTAR_TXT_MS）、更强档 2000（STRONG_MSG_MS 三处）、胜利档 2600（WIN_MSG_MS 五处）、更长档 2800（记忆碎片）、教程 3600、图鉴 4200（成就类更长的独立档，刻意不并入）与战间 1400 家族、两处 `setTimeout(..., 1800)` 延时（core 存档回写 / battle 通关回世界）全部刻意保留，并逐一由本版专项冒烟钉死。未动任何掉落/经验/金币曲线/难度/技能/支线/存档。只新增一个常量 + 改 3 处表达式 + 2 处 import + 1 处 export + 注释，零新增依赖。
- 验证：`node --check js/data.js js/battle.js js/hero.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.33 专项冒烟（/tmp/jrpg_smoke_v1933_achmsg.mjs）**32 项断言全过**——`ACH_MSG_MS=3200` 导出且定义/export 齐全、2 个模块（battle/hero）import 且调用点恰好 3 处（battle ×2 / hero ×1）均读该源、可执行裸「boxMsg(…, 3200)」清零（剩 0 处、data.js 仅注释里的文档化字面量）、行为逐值恒等（3200===ACH_MSG_MS）、时序家族既有成员（STRONG_MSG_MS 2000 / EVENT_MSG_MS 1600 / ALTAR_TXT_MS 1600 / ALTAR_LEAD_MS 600 / SYS_MSG_MS 2200 / MILESTONE_MS 2400 / SHORT_MSG_MS 1200 / NARR_MSG_MS 1800 / FINAL_LEAD_MS 700 / HIT_FB_MS 220 / UI_PULSE_MS 400 / DAY_PHASE_S 90 / BLOG_WIN 3 / WIN_MSG_MS 2600）以及更长档 2800、教程 3600、图鉴 4200、战间 1400×2、两处 setTimeout 1800 延时各自保留不受影响。

## v19.32 胜利类回馈「胜利档」停留时长单一数据源——五处捷报同读 WIN_MSG_MS（纯时序·单一口径，与 v19.31 STRONG_MSG_MS / v19.30 EVENT_MSG_MS / v19.29 FINAL_LEAD_MS / v19.28 NARR_MSG_MS / v19.27 SHORT_MSG_MS / v19.26 MILESTONE_MS / v19.25 SYS_MSG_MS / v19.24 ALTAR_TXT_MS / v19.23 ALTAR_LEAD_MS 同一「提示框停留时长」家族——本版收口的是历版注释从 v19.24 起反复标注「更强档之上更长 · 刻意保留」的 2600 档，也是该家族自 v19.23 起连续第十块拼图）

- 【胜利档「2600ms」以裸字面量写两个文件五处、五处互不相关】战斗大捷/任务落袋的捷报回馈以完全相同的 `boxMsg(..., 2600)` 裸写两个文件：`battle.js` 胜利结算（行 389）、额外掉落（行 397）、圣光之剑觉醒（行 442）、洞窟领主倒下（行 451）、`core.js` 任务完成（行 154）——五处同值互不引用：想调这类胜利回馈读多久（如放慢到 2800 让捷报多停一秒、收紧到 2400 更利落）要改五个地方、还极易只改一处漏改另几处——胜利/掉落/圣剑/首领扑街/任务落袋的停留时长悄然脱钩，而这个参数始终没有名字（v19.25 收口 SYS_MSG_MS、v19.27 收口 SHORT_MSG_MS、v19.28 收口 NARR_MSG_MS、v19.30 收口 EVENT_MSG_MS、v19.31 收口 STRONG_MSG_MS 时都已在注释里把 2600 明确标注「胜利类 · 刻意保留」，正是它们共同的下一块拼图）。
- 【修正：data.js 在 `STRONG_MSG_MS` 之后新增 `WIN_MSG_MS = 2600`（胜利类回馈「胜利档」停留时长，单位 ms，纯时序）为唯一真源，注释说明五处派生形态与刻意保留的其余停留时级（成就类 3200 三处 / 更长档 2800 记忆碎片 / 教程 3600 / 图鉴 4200 各为独立语义；战间 1400 家族与两处 `setTimeout(..., 1800)`「延时/过渡」另一语义刻意不并入），随原 export 块导出，零新增依赖】`battle.js` 四处、`core.js` 一处 `boxMsg(..., 2600)` 改读 `boxMsg(..., WIN_MSG_MS)`（两模块 import 列表同步加 WIN_MSG_MS）。收益：调胜利捷报停留节奏只改 data.js 一处、两个模块五处同步，绝无第二套口径；行为逐字不变（`WIN_MSG_MS` 仍为 2600，五处停留时长与旧字面量逐值恒等），零战斗/任务流程回归。
- 【零回归面】未动提示机制本身——boxMsg 内容、五处业务判定（winBattle 结算分支、rollDrop 额外掉落、圣光之剑觉醒、洞窟领主倒下、任务完成领奖）全部原样；其余 boxMsg 停留时级逐字未动：短档 1200（SHORT_MSG_MS）、中长档 1800（NARR_MSG_MS 八处）、常规档 2200（SYS_MSG_MS）、里程碑档 2400（MILESTONE_MS）、小事件档 1600（EVENT_MSG_MS 六处）、强敌文案 1600（ALTAR_TXT_MS）、更强档 2000（STRONG_MSG_MS 三处）、成就类 3200（试炼通关/真结局/成就解锁共三处）、更长档 2800（记忆碎片）、教程 3600、图鉴 4200 与战间 1400 家族、两处 `setTimeout(..., 1800)` 延时（core 存档回写 / battle 通关回世界）全部刻意保留，并逐一由本版专项冒烟钉死。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/存档。只新增一个常量 + 改 5 处表达式 + 2 处 import + 1 处 export + 注释，零新增依赖。
- 验证：`node --check js/data.js js/battle.js js/core.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响，且两套测试均 import core/battle/data 全链接、运行时模块图解析无碍）；新增 v19.32 专项冒烟（/tmp/jrpg_smoke_v1932_winmsg.mjs）**33 项断言全过**——`WIN_MSG_MS=2600` 导出且定义/export 齐全、2 个模块（battle/core）import 且调用点恰好 5 处（battle ×4 / core ×1）均读该源、可执行裸「boxMsg(…, 2600)」清零（剩 0 处、data.js 仅注释里的文档化字面量）、行为逐值恒等（2600===WIN_MSG_MS）、时序家族既有成员（STRONG_MSG_MS 2000 / EVENT_MSG_MS 1600 / ALTAR_TXT_MS 1600 / ALTAR_LEAD_MS 600 / SYS_MSG_MS 2200 / MILESTONE_MS 2400 / SHORT_MSG_MS 1200 / NARR_MSG_MS 1800 / FINAL_LEAD_MS 700 / HIT_FB_MS 220 / UI_PULSE_MS 400 / DAY_PHASE_S 90 / BLOG_WIN 3）以及成就类 3200×3、2800、3600、4200、战间 1400×2、两处 setTimeout 1800 延时各自保留不受影响。

## v19.31 更强档「拦路/推进公告」停留时长单一数据源——三处强提示同读 STRONG_MSG_MS（纯时序·单一口径，与 v19.30 EVENT_MSG_MS / v19.29 FINAL_LEAD_MS / v19.28 NARR_MSG_MS / v19.27 SHORT_MSG_MS / v19.26 MILESTONE_MS / v19.25 SYS_MSG_MS / v19.24 ALTAR_TXT_MS / v19.23 ALTAR_LEAD_MS 同一「提示框停留时长」家族——本版收口的是历版注释反复标注「更强档 · 刻意保留」的 2000 档，也是该家族自 v19.23 起连续第九块拼图）

- 【更强档「2000ms」以裸字面量写三个文件三处、三处互不相关】比常规档更有存在感的阶段推进提示以完全相同的 `boxMsg(..., 2000)` 裸写三个文件：`core.js` 任务蘑菇未上交拦路（行 89）、`battle.js` 试炼开始（行 18）、`main.js` 踏上旅途（行 193）——三处同值互不引用：想调这类提示读多久（如放慢到 2200 让试炼/启程更有仪式感、收紧到 1800 节奏更利落）要改三个地方、还极易只改一处漏改另两处——拦路/试炼/启程的停留时长悄然脱钩，而这个参数始终没有名字（v19.25 收口 SYS_MSG_MS、v19.27 收口 SHORT_MSG_MS、v19.28 收口 NARR_MSG_MS、v19.30 收口 EVENT_MSG_MS 时都已在注释里把 2000 明确标注「更强档 · 刻意保留」，正是它们共同的下一块拼图）。
- 【修正：data.js 在 `EVENT_MSG_MS` 之后新增 `STRONG_MSG_MS = 2000`（更强档「拦路/推进公告」停留时长，单位 ms，纯时序）为唯一真源，注释说明三处派生形态与刻意保留的其余停留时级（胜利类 2600 五处 / 成就类 3200 三处 / 更长档 2800 记忆碎片 / 教程 3600 / 图鉴 4200 各为独立语义；战间 1400 家族与两处 `setTimeout(..., 1800)`「延时/过渡」另一语义刻意不并入），随原 export 块导出，零新增依赖】`core.js` / `battle.js` / `main.js` 三处 `boxMsg(..., 2000)` 改读 `boxMsg(..., STRONG_MSG_MS)`（import 列表同步加 STRONG_MSG_MS）。收益：调更强提示停留节奏只改 data.js 一处、三个模块三处同步，绝无第二套口径；行为逐字不变（`STRONG_MSG_MS` 仍为 2000，三处停留时长与旧字面量逐值恒等），零战斗/世界/界面流程回归。
- 【零回归面】未动提示机制本身——boxMsg 内容、三处业务判定（酿造拦路判定、startRush 试炼时机、进入世界后的 tutDone 分支）全部原样；其余 boxMsg 停留时级逐字未动：短档 1200（SHORT_MSG_MS）、中长档 1800（NARR_MSG_MS 八处）、常规档 2200（SYS_MSG_MS）、里程碑档 2400（MILESTONE_MS）、小事件档 1600（EVENT_MSG_MS 六处）、强敌文案 1600（ALTAR_TXT_MS）、胜利类 2600（胜利/额外掉落/圣光之剑/洞窟领主倒下/任务完成共五处）、成就类 3200（试炼通关/真结局/成就解锁共三处）、更长档 2800（记忆碎片）、教程 3600、图鉴 4200 与战间 1400 家族、两处 `setTimeout(..., 1800)` 延时（core 存档回写 / battle 通关回世界）全部刻意保留，并逐一由本版专项冒烟钉死。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/存档。只新增一个常量 + 改 3 处表达式 + 3 处 import + 1 处 export + 注释，零新增依赖。
- 验证：`node --check js/data.js js/core.js js/main.js js/battle.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.31 专项冒烟（/tmp/jrpg_smoke_v1931_strongmsg.mjs）**33 项断言全过**——`STRONG_MSG_MS=2000` 导出且定义/export 齐全、3 个模块（core/battle/main）import 且调用点恰好 3 处（core ×1 / battle ×1 / main ×1）均读该源、可执行裸「boxMsg(…, 2000)」清零（剩 0 处、data.js 仅注释里的文档化字面量）、行为逐值恒等（2000===STRONG_MSG_MS）、时序家族既有成员（ALTAR_TXT_MS 1600 / ALTAR_LEAD_MS 600 / SYS_MSG_MS 2200 / MILESTONE_MS 2400 / SHORT_MSG_MS 1200 / NARR_MSG_MS 1800 / FINAL_LEAD_MS 700 / EVENT_MSG_MS 1600 / HIT_FB_MS 220 / UI_PULSE_MS 400 / DAY_PHASE_S 90 / BLOG_WIN 3）以及胜利类 2600×5、成就类 3200×3、2800、3600、4200、战间 1400×2、两处 setTimeout 1800 延时各自保留不受影响。

## v19.30 小事件通知「小事件档」停留时长单一数据源——六处小事件回馈同读 EVENT_MSG_MS（纯时序·单一口径，与 v19.29 FINAL_LEAD_MS / v19.28 NARR_MSG_MS / v19.27 SHORT_MSG_MS / v19.26 MILESTONE_MS / v19.25 SYS_MSG_MS / v19.24 ALTAR_TXT_MS / v19.23 ALTAR_LEAD_MS 同一「提示框停留时长」家族——本版收口的正是自 v19.24 起历版注释反复标注「喷泉 1600 是『小事件通知』另一语义、值同为 1600 却互不相干、刻意不并入」的那一批值，也是该家族自 v19.23 起连续第八块拼图，与 v19.29 收口「700 家族」同为历版注释留下的「最后一块拼图」式留白）

- 【小事件通知「1600ms」以裸字面量写三个文件六处、六处互不相关】短促的「小事件回馈」提示框停留时长以完全相同的 `bind.boxMsg(..., 1600)` 裸写三个文件六处：`core.js` 酿造失败（行 94）、旅行未开（行 109）、新的冒险开始（行 274）、重整旗鼓（行 302）、`world.js` 喷泉恢复（行 238）、`main.js` 读取存档（行 154）——六处同为「小事件通知」语义、同值互不引用：想调这类回馈读多久（如放慢到 1800 让回馈多停一拍、收紧到 1400 更利落）要改六个地方、还极易只改一处漏改另几处——酿造/旅行/重开/读档/喷泉的短促反馈悄然脱钩，而这个「小事件通知停多久」的时序参数本身始终没有名字（v19.24 收口 ALTAR_TXT_MS=1600 时已把喷泉处明确标注「小事件通知另一语义的独立停留时长」，v19.25–28 的 SYS/MILESTONE/SHORT/NARR 注释里又把「1600 小事件档（喷泉/酿造失败/旅行未开/新冒险/重整旗鼓/读档）」逐类点名为「另为独立语义 · 刻意保留」，正是它们共同的下一块拼图）。
- 【修正：data.js 在 `FINAL_LEAD_MS` 之后新增 `EVENT_MSG_MS = 1600`（小事件通知「小事件档」停留时长，单位 ms，纯时序）为唯一真源，注释说明六处派生形态与刻意保留的其余停留时级（ALTAR_TXT_MS 同为 1600 却是「强敌祭坛出场文案」另一语义、与 FINAL_LEAD_MS/ALTAR_LEAD_MS「同族不同值」同款另立常量不混同；短档 1200 / 中长档 1800 / 常规档 2200 / 里程碑档 2400 各为独立语义），随原 export 块导出，零新增依赖】`core.js` 四处 / `world.js` 一处 / `main.js` 一处 `boxMsg(..., 1600)` 改读 `boxMsg(..., EVENT_MSG_MS)`（import 列表同步加 EVENT_MSG_MS；ALTAR_TXT_MS 注释「喷泉 1600 ... 刻意不并入」与 SYS/MILESTONE/SHORT/NARR 注释里「1600 小事件档 · 另为独立语义」同步改写为指向新源）。收益：调小事件通知停留节奏只改 data.js 一处、三个模块六处同步，绝无第二套口径；行为逐字不变（`EVENT_MSG_MS` 仍为 1600，六处停留时长与旧字面量逐值恒等），零战斗/世界/界面流程回归。
- 【零回归面】未动提示机制本身——boxMsg 内容、六处业务判定（酿造扣料失败、旅行未开拦截、重开/重整旗鼓时机、喷泉回复判定、读档时机）全部原样；其余 boxMsg 停留时级逐字未动：短档 1200（SHORT_MSG_MS）、中长档 1800（NARR_MSG_MS 八处）、常规档 2200（SYS_MSG_MS 五处）、里程碑档 2400（MILESTONE_MS 三处）、更强档 2000（任务蘑菇未上交/试炼开始/踏上旅途三处，另一语义）、更长档 2800（记忆碎片）、成就 3200、胜利 2600、教程 3600、图鉴 4200 与 ALTAR_TXT_MS 强敌 1600 全部刻意保留；两处 `setTimeout(..., 1800)` 延时（core 存档回写 / battle 通关回世界）原样。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/存档。只新增一个常量 + 改 6 处表达式 + 3 处 import + 1 处 export + 注释微调，零新增依赖。
- 验证：`node --check js/data.js js/core.js js/world.js js/main.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.30 专项冒烟（/tmp/jrpg_smoke_v1930_eventmsg.mjs）**35 项断言全过**——`EVENT_MSG_MS=1600` 导出且定义/export 齐全、3 个模块（core/world/main）import 且调用点恰好 6 处（core ×4 / world ×1 / main ×1）均读该源、可执行裸「boxMsg(…, 1600)」清零（剩 0 处、data.js 仅注释里的文档化字面量）、行为逐值恒等（1600===EVENT_MSG_MS）、时序家族既有成员（ALTAR_TXT_MS 1600 / ALTAR_LEAD_MS 600 / SYS_MSG_MS 2200 / MILESTONE_MS 2400 / SHORT_MSG_MS 1200 / NARR_MSG_MS 1800 / FINAL_LEAD_MS 700 / HIT_FB_MS 220 / UI_PULSE_MS 400 / DAY_PHASE_S 90 / BLOG_WIN 3）以及 2000 档/1400/两处 setTimeout 1800 延时各自保留不受影响。

## v19.29 终局/传送类「切入下一阶段」延时单一数据源——三处门关切入同读 FINAL_LEAD_MS（纯时序·单一口径，与 v19.23 ALTAR_LEAD_MS 同为「切入延时」家族但语义不同——上一版收口的是「强敌祭坛」600 战前切入，本版收口的是其注释中反复标注「值同为 7 开头却互不相干，刻意不并入」的「真结局/传送一类」700——也是该「时序数据化」体系自 v19.8 起的又一块拼图，块块都有名字）

- 【门关切入延时「700ms」以裸字面量写两文件三处、三处互不相关】三处「关键门关切入前」的停顿以完全相同的 `setTimeout(..., 700)` 裸写两个文件：`world.js` 终焉之神战前（`onTrueCrystal` 行 268，`startBattle(deep(TRUE_BOSS))`）、`world.js` 回廊传送（`onTrueCrystal` 行 279，`transition('gallery')`）、`battle.js` 试炼首战（`startRush` 行 21，`startBattle(deep(RUSH_BOSSES[0]))`）——三处同值互不引用：想调这类门关切入节奏（如放慢到 900 让终局悬念多停一拍、收紧到 500 更快开门）要改三个地方、还极易只改一处漏改另外两处——终焉之战/回廊传送/试炼首战的切入停顿悄然脱钩，而这个「切入下一阶段停多久」的时序参数本身始终没有名字（v19.23 收口 ALTAR_LEAD_MS=600 时已在同一注释把该 700 明确标注「真结局/传送一类另一语义 · 刻意不并入」，正是它的下一块拼图）。
- 【修正：data.js 在 `NARR_MSG_MS` 之后新增 `FINAL_LEAD_MS = 700`（终局/传送类「切入下一阶段」的演出延时，单位 ms，纯时序）为唯一真源，注释说明三处派生形态与 ALTAR_LEAD_MS 600 的「同族不同值」关系（属性同属「切入延时」语义却不同：600 是强敌祭坛战前、700 是真结局/传送/试炼门关），随原 export 块导出，零新增依赖】`world.js` 两处与 `battle.js` 一处 `setTimeout(..., 700)` 改读 `setTimeout(..., FINAL_LEAD_MS)`（import 列表同步加 FINAL_LEAD_MS；`ALTAR_LEAD_MS` 注释里「700 家族刻意不并入」及 `SYS_MSG_MS` / `MILESTONE_MS` / `SHORT_MSG_MS` / `NARR_MSG_MS` 注释里「700 家族（真结局切入/回廊传送/试炼首战）逐类保留不动」同步改写为指向新源）。收益：调终局/传送门关切入节奏只改 data.js 一处、两个模块三处同步，绝无第二套口径；行为逐字不变（`FINAL_LEAD_MS` 仍为 700，三处延时与旧字面量逐值恒等），零战斗/世界/终局流程回归。
- 【零回归面】未动切入机制本身——三处判定（终焉水晶 gallery 分支 trueBoss 判定、双徽记开门判定、试炼碑 startRush 时机）与 `S.scene === 'world'` 防重叠守卫全部原样；ALTAR_LEAD_MS=600 三处强敌祭坛切入、ALTAR_TXT_MS=1600 强敌出场文案、喷泉 1600、战间 1400、两处 setTimeout 1800 延时（core 存档回写 / battle 通关回世界）与 boxMsg 各停留时级全部逐字未动。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/存档。只新增一个常量 + 改 3 处表达式 + 2 处 import + 1 处 export + 五处注释指向，零新增依赖。
- 验证：`node --check js/data.js js/world.js js/battle.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.29 专项冒烟（/tmp/jrpg_smoke_v1929_finallead.mjs）**27 项断言全过**——`FINAL_LEAD_MS=700` 导出且定义/export 齐全、2 个模块（world/battle）import 且调用点恰好 3 处（world ×2：TRUE_BOSS 战前 + gallery 传送 / battle ×1：RUSH_BOSSES[0] 试炼首战）均读该源、可执行裸「setTimeout(…, 700)」清零（二十个模块剩 0 处）、行为逐值恒等（700===FINAL_LEAD_MS）、ALTAR_LEAD_MS=600 三处祭坛调用点身体在线、时序家族既有成员（ALTAR_TXT_MS 1600 / SYS_MSG_MS 2200 / MILESTONE_MS 2400 / SHORT_MSG_MS 1200 / NARR_MSG_MS 1800 / HIT_FB_MS 220 / UI_PULSE_MS 400 / DAY_PHASE_S 90 / BLOG_WIN 3）以及战间 1400、×2 处 setTimeout 1800 延时各自保留不受影响。

## v19.28 叙事/任务反馈「中长档」停留时长单一数据源——八处中长提示同读 NARR_MSG_MS（纯时序·单一口径，与 v19.27 SHORT_MSG_MS / v19.26 MILESTONE_MS / v19.25 SYS_MSG_MS / v19.24 ALTAR_TXT_MS / v19.23 ALTAR_LEAD_MS 同一「提示框停留时长」家族——本版收口的是 boxMsg 提示框家族里分布第二广的 1800 中长档，也是该家族自 v19.23 起连续第七块拼图，与 v19.24–27 注释中反复标注「中长档 1800 家族 · 刻意保留」的正是同一批值）

- 【叙事/任务反馈「1800ms」以裸字面量写八处、八处互不相关】中长叙事/任务反馈提示框停留时长以完全相同的 `bind.boxMsg(..., 1800)` 裸写四个文件八处：`world.js` 终焉之神水晶文案家族五处（`onTrueCrystal` 行 267/273/277/281 + 试炼碑 `onTrialStele` 行 287）、`core.js` 接受任务（行 144）、`battle.js` 拾取魔法蘑菇（行 382）、`shop.js` 背包已满（行 25）——八处同值互不引用：想调这类中长提示读多久（如放慢到 2000 让剧情台词多停一秒、收紧到 1600 节奏更利落）要改八个地方、还极易只改一处漏改另一处——剧情/任务/拾取/背包的停留时长悄然脱钩，而这个「中长提示停多久」的时序参数本身始终没有名字（v19.25 收口 SYS_MSG_MS、v19.26 收口 MILESTONE_MS、v19.27 收口 SHORT_MSG_MS 时都已在注释里把 1800 明确标注「中长档 · 刻意保留未并入」，正是它们共同的下一块拼图）。
- 【修正：data.js 在 `SHORT_MSG_MS` 之后新增 `NARR_MSG_MS = 1800`（叙事/任务反馈「中长档」停留时长，单位 ms，纯时序）为唯一真源，注释说明八处派生形态与刻意保留的其余停留时级（更长档 2800 记忆碎片 / 战间 1400 / 700 家族 / 1600 小事件档与 ALTAR_TXT_MS 强敌档 / 成就 3200 / 胜利 2600 / 教程 3600 各为独立语义；尤其值同为 18 开头却互不相干的 core.js 存档回写 / battle.js 试炼通关回世界两处 `setTimeout(..., 1800)`「延时/过渡」另一语义刻意不并入），随原 export 块导出，零新增依赖】`core.js` / `world.js` 五处 / `battle.js` / `shop.js` 八处 `boxMsg(..., 1800)` 改读 `boxMsg(..., NARR_MSG_MS)`（import 列表同步加 NARR_MSG_MS；`SYS_MSG_MS` / `MILESTONE_MS` / `SHORT_MSG_MS` 注释里「中长档 1800 逐类保留不动」同步改写为指向新源）。收益：调中长提示停留节奏只改 data.js 一处、四个模块八处同步，绝无第二套口径；行为逐字不变（`NARR_MSG_MS` 仍为 1800，八处停留时长与旧字面量逐值恒等），零战斗/世界/界面流程回归。
- 【零回归面】未动提示机制本身——boxMsg 内容、八处业务判定（终焉水晶开/关/已通三态、试炼碑双徽记判定、接受任务时机、精英魔像蘑菇拾取、背包满拦截）全部原样；其余 boxMsg 停留时级逐字未动：短档 1200（SHORT_MSG_MS）、常规档 2200（SYS_MSG_MS）、里程碑档 2400（MILESTONE_MS）、更长档 2800（记忆碎片，仅一处）、战间 1400、700 家族、1600 小事件档（喷泉/酿造失败/旅行未开/新冒险/重整旗鼓/读档）与 ALTAR_TXT_MS 强敌 1600、成就 3200、胜利 2600、教程 3600 全部刻意保留；两处 `setTimeout(..., 1800)` 延时（core 存档回写 saveMsg 清除 / battle 试炼通关回世界过渡）原样。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/存档。只新增一个常量 + 改 8 处表达式 + 4 处 import + 1 处 export + 注释微调，零新增依赖。
- 验证：`node --check js/data.js js/core.js js/world.js js/battle.js js/shop.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.28 专项冒烟（/tmp/jrpg_smoke_v1928_narrmsg.mjs）**33 项断言全过**——`NARR_MSG_MS=1800` 导出且定义/export 齐全、4 个模块（core/world/battle/shop）import 且调用点恰好 8 处（core ×1 / world ×5 / battle ×1 / shop ×1）均读该源、可执行裸「boxMsg(…, 1800)」清零（剩 0 处、data.js 仅注释里的文档化字面量）、两处 setTimeout 1800 延时（core 存档回写 / battle 通关回世界）另一语义保留、行为逐值恒等（1800===NARR_MSG_MS）、时序家族既有成员（SHORT_MSG_MS 1200 / SYS_MSG_MS 2200 / MILESTONE_MS 2400 / ALTAR_TXT_MS 1600 / ALTAR_LEAD_MS 600 / HIT_FB_MS 220 / UI_PULSE_MS 400 / DAY_PHASE_S 90 / BLOG_WIN 3）以及停留时级 2000/2800/2600/3200/3600/700/1600 各自保留不受影响。

## v19.27 环境短提示「短档」停留时长单一数据源——三处短促回馈同读 SHORT_MSG_MS（纯时序·单一口径，与 v19.26 MILESTONE_MS / v19.25 SYS_MSG_MS / v19.24 ALTAR_TXT_MS / v19.23 ALTAR_LEAD_MS 同一「提示框停留时长」家族——本版收口的是 boxMsg 提示框家族里最「短」的 1200 短档，也是该家族自 v19.23 起连续第六块拼图）

- 【环境短提示「1200ms」以裸字面量写三处、三处互不相关】短促环境回馈提示框停留时长以完全相同的 `bind.boxMsg(..., 1200)` 裸写两个文件三处：`world.js` 进入地图（`transition`，行 350）、踏无发现（`interact` 兜底，行 337）、`main.js` 静音开关（M 键，行 280）——三处同值互不引用：想调这类瞬时提示读多久（如放慢到 1500 让回馈更舒适、收紧到 900 节奏更利落）要改三个地方、还极易只改一处漏改另一处——进入地图/踏无发现/静音反馈的停留时长悄然脱钩，而这个「短提示停多久」的时序参数本身始终没有名字（v19.25 收口 SYS_MSG_MS、v19.26 收口 MILESTONE_MS 时都已在注释里把该 1200 明确标注「短档 · 刻意保留未并入」，正是它们共同的下一块拼图）。
- 【修正：data.js 在 `MILESTONE_MS` 之后新增 `SHORT_MSG_MS = 1200`（环境短提示「短档」停留时长，单位 ms，纯时序）为唯一真源，注释说明三处派生形态与刻意保留的其余停留时级（中长档 1800 家族 / 更长档 2800 / 战间 1400 / 700 家族 / 喷泉 1600 / 成就 3200 / 胜利 2600 / 教程 3600 各为独立语义），随原 export 块导出，零新增依赖】`world.js` 两处与 `main.js` 一处 `boxMsg(..., 1200)` 改读 `boxMsg(..., SHORT_MSG_MS)`（import 列表同步加 SHORT_MSG_MS；`SYS_MSG_MS` / `MILESTONE_MS` 注释里「短档 1200 逐类保留不动」同步改写为指向新源）。收益：调短提示停留节奏只改 data.js 一处、两个模块三处同步，绝无第二套口径；行为逐字不变（`SHORT_MSG_MS` 仍为 1200，三处停留时长与旧字面量逐值恒等），零战斗/世界/界面流程回归。
- 【零回归面】未动提示机制本身——boxMsg 内容、三处业务判定（进入地图时机、interact 兜底路径、静音开关判定）全部原样；其余 boxMsg 停留时级逐字未动：中长档 1800（终焉之神水晶文案家族四处 + 拾取蘑菇/接受任务/存档回写/背包满等）、更长档 2800（记忆碎片，仅一处）、战间 1400（试炼切入/战斗结束回世界）、700 家族（终焉之神战前/回廊传送/试炼首战）、成就/试炼 3200、胜利 2600、教程 3600 与喷泉 1600 全部刻意保留。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/存档。只新增一个常量 + 改 3 处表达式 + 2 处 import + 1 处 export + 注释微调，零新增依赖。
- 验证：`node --check` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.27 专项冒烟（/tmp/jrpg_smoke_v1927_shortmsg.mjs）**25 项断言全过**——`SHORT_MSG_MS=1200` 导出且定义/export 齐全、2 个模块（world/main）import 且调用点恰好 3 处（world ×2 / main ×1）均读该源、可执行裸「boxMsg(…, 1200)」清零（剩 0 处、data.js 仅注释里的文档化字面量）、行为逐值恒等（1200===SHORT_MSG_MS）、时序家族既有成员（SYS_MSG_MS 2200 / MILESTONE_MS 2400 / ALTAR_TXT_MS 1600 / ALTAR_LEAD_MS 600 / HIT_FB_MS 220 / UI_PULSE_MS 400 / DAY_PHASE_S 90 / BLOG_WIN 3）以及停留时级 1800/2800/1400/700/2600/3200/3600 各自保留不受影响。

## v19.26 里程碑/阶段达成公告「停留时长」单一数据源——三处里程碑公告同读 MILESTONE_MS（纯时序·单一口径，与 v19.25 SYS_MSG_MS / v19.24 ALTAR_TXT_MS / v19.23 ALTAR_LEAD_MS 同一「提示框停留时长」家族——SYS_MSG_MS 收口了 2200 常规档，本版收口的是紧邻其后的 2400 长档「里程碑档」）

- 【阶段达成公告「2400ms」在三个文件以裸字面量写三处、三处互不相关】三处「阶段性里程碑达成」的祝贺式公告以完全相同的 `bind.boxMsg(..., 2400)` 裸写三个文件：`core.js` 困难模式开启（行 171）、`world.js` 蘑菇集齐（行 217）、`battle.js` 等级提升（行 387）——三处同为「里程碑/阶段达成」语义的庆祝提示、同值互不引用：想调这类公告读多久（如放慢到 2600 让升级更有仪式感、收紧到 2200 节奏更利落）要改三个地方、还极易只改升级漏改集齐——三类里程碑公告的停留时长悄然脱钩，而这个「里程碑公告停多久」的时序参数本身始终没有名字（v19.25 收口 SYS_MSG_MS 时已把该 2400 明确标注「长档 · 刻意保留未并入」，正是它的下一块拼图）。
- 【修正：data.js 在 `SYS_MSG_MS` 之后新增 `MILESTONE_MS = 2400`（里程碑/阶段达成公告停留时长，单位 ms，纯时序）为唯一真源，注释说明三处派生形态与刻意保留的其余停留时级（更长档 2800 记忆碎片 / 中长档 1800 家族 / 短档 1200 / 战间 1400 / 700 家族 / 喷泉 1600 各为独立语义），随原 export 块导出，零新增依赖】`core.js` / `world.js` / `battle.js` 三处 `bind.boxMsg(..., 2400)` 改读 `bind.boxMsg(..., MILESTONE_MS)`（import 列表同步加 MILESTONE_MS；`SYS_MSG_MS` 注释里「长档 2400 逐类保留不动」同步改写为指向新源）。收益：调里程碑公告停留节奏只改 data.js 一处、三个模块同步，绝无第二套口径；行为逐字不变（`MILESTONE_MS` 仍为 2400，三处停留时长与旧字面量逐值恒等），零战斗/世界/界面流程回归。
- 【零回归面】未动公告机制本身——boxMsg 内容、三处业务判定（困难模式开启时机、蘑菇集齐转 turnin、等级提升判定）全部原样；其余 boxMsg 停留时级逐字未动：更长档 2800（记忆碎片，仅一处）、中长档 1800（终焉之神水晶文案家族四处 + 拾取蘑菇/接受任务/存档回写/背包满/战斗结束回世界等）、短档 1200（进入地图/踏无发现/静音开关）、战间 1400（试炼切入/战斗结束回世界）、700 家族（终焉之神战前/回廊传送/试炼首战）与喷泉 1600 全部刻意保留。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/存档。只新增一个常量 + 改 3 处表达式 + 3 处 import + 1 处 export + 注释微调，零新增依赖。
- 验证：`node --check js/data.js js/core.js js/world.js js/battle.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.26 专项冒烟（/tmp/jrpg_smoke_v1926_milestone.mjs）**23 项断言全过**——`MILESTONE_MS=2400` 导出且定义/export 齐全、3 个模块（core/world/battle）import 且恰好各 1 处调用点均读该源、可执行裸「boxMsg(…, 2400)」清零（剩 0 处、data.js 仅注释里的文档化字面量）、行为逐值恒等（2400===MILESTONE_MS）、时序家族既有成员（SYS_MSG_MS 2200 / ALTAR_TXT_MS 1600 / ALTAR_LEAD_MS 600 / HIT_FB_MS 220 / UI_PULSE_MS 400 / DAY_PHASE_S 90 / BLOG_WIN 3）以及停留时级 2800/1800/1200/1400 各自保留不受影响。

## v19.25 系统提示框「常规」停留时长单一数据源——五处常规提示同读 SYS_MSG_MS（纯时序·单一口径，与 v19.24 ALTAR_TXT_MS / v19.23 ALTAR_LEAD_MS / v19.8 HIT_FB_MS / v19.15 UI_PULSE_MS / v19.21 DAY_PHASE_S 同一「时序数据化」体系——本版收口的是 boxMsg 提示框家族里分布最广的「常规档」，也是全库单值重复次数仅次于 1800 的第二大裸奔值）

- 【常规系统提示「2200ms」在四个文件以裸字面量写五处、五处互不相关】普通系统提示框停留时长以完全相同的 `bind.boxMsg(..., 2200)` 裸写四个文件：`battle.js` 试炼第 N 关登场（行 432）、`core.js` 酿造成功（行 102）、`hero.js` 领悟新技能（行 46）、`shop.js` 任务蘑菇保护·不可卖（行 47）、`world.js` 传送门锁定提示 `lockedMsg`（行 176）——五处同值互不引用：想调常规提示读多久（如放慢到 2500 让台词多停一秒、收紧到 2000 节奏更利落）要改五个地方、还极易只改一处漏改另外几处——里程碑/成功/锁定五类提示的停留时长悄然脱钩，而这个「常规提示框停多久」的时序参数本身始终没有名字。
- 【修正：data.js 在 `ALTAR_TXT_MS` 之后新增 `SYS_MSG_MS = 2200`（系统提示框「常规」停留时长，单位 ms，纯时序）为唯一真源，注释说明五处派生形态与刻意保留的其余停留时级（短档 1200 / 中长档 1800 / 长档 2400 / 更长档 2800 / 700 家族 / 喷泉 1600 各为独立语义），随原 export 块导出，零新增依赖】`battle.js` / `core.js` / `hero.js` / `shop.js` / `world.js` 五处 `bind.boxMsg(..., 2200)` 改读 `bind.boxMsg(..., SYS_MSG_MS)`（import 列表同步加 SYS_MSG_MS）。收益：调常规提示停留节奏只改 data.js 一处、五个模块同步，绝无第二套口径；行为逐字不变（`SYS_MSG_MS` 仍为 2200，五处停留时长与旧字面量逐值恒等），零战斗/世界/界面流程回归。
- 【零回归面】未动提示机制本身——boxMsg 内容、五处业务判定（试炼换关回血、酿造扣料、技能领悟时机、蘑菇保护判定、传送门锁判定）全部原样；其余 boxMsg 停留时级逐字未动：短档 1200（进入地图 / 踏无发现）、中长档 1800（终焉之神水晶文案家族四处 + 拾取蘑菇/接受任务/存档回写/背包满等）、长档 2400（等级提升）、更长档 2800（记忆碎片）、战间 1400（试炼切入/战斗结束回世界）、700 家族（终焉之神战前/回廊传送/试炼首战）与喷泉 1600 全部刻意保留。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/存档。只新增一个常量 + 改 5 处表达式 + 5 处 import + 1 处 export + 注释，零新增依赖。
- 验证：`node --check js/data.js js/battle.js js/core.js js/hero.js js/shop.js js/world.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.25 专项冒烟（/tmp/jrpg_smoke_v1925_sysmsg.mjs）**17 项断言全过**——`SYS_MSG_MS=2200` 导出且定义/export 齐全、5 个模块（battle/core/hero/shop/world）import 且恰好各 1 处调用点均读该源、可执行裸「boxMsg(…, 2200)」清零（剩 0 处、data.js 仅注释里的文档化字面量）、行为逐值恒等（2200===SYS_MSG_MS）、时序家族既有成员（ALTAR_TXT_MS 1600 / ALTAR_LEAD_MS 600 / HIT_FB_MS 220 / UI_PULSE_MS 400 / DAY_PHASE_S 90 / BLOG_WIN 3）以及停留时级 1200/1800/2400/2800/700 各自保留不受影响。

## v19.24 强敌祭坛「出场提示框停留时长」单一数据源——三个强敌的入场文案同读 ALTAR_TXT_MS（纯时序·单一口径，v19.23 ALTAR_LEAD_MS 的伴生量：上一版收口了「踩祭坛到切入战斗」的延时，本版收口的是紧贴其前的「出场提示框停多久」——与 v19.8 HIT_FB_MS / v19.15 UI_PULSE_MS / v19.18 IDLE_BOB / v19.21 DAY_PHASE_S 同一「时序数据化」体系，且正是 v19.23 中刻意标注「未动」的 1600）

- 【强敌出场文案「1600ms」在 world.js 以裸字面量写三处、三处互不相关】强敌祭坛三处「先弹出场提示框、再延时切入战斗」的提示框停留时长以完全相同的 `bind.boxMsg(..., 1600)` 裸写 world.js 三处：`onBossAltar` 的幽冥魔王（雾语林祭坛，行 245）、`onCaveAltar` 的残焰魔像（无字回廊祭坛，行 253）与洞窟领主（星井矿脉祭坛，行 258）——三处同值互不引用：想调强敌出场文案停多久（如放慢到 2000 让台词多读一秒、收紧到 1200 更快入战）要改三个地方、还极易只改一个祭坛漏改另外两处——三个强敌的出场提示框时长悄然脱钩，而这个「提示框停多久」的时序参数本身始终没有名字（v19.23 收口 ALTAR_LEAD_MS=600 时已把该 1600 明确标注「刻意保留未并入」，正是它的下一块拼图）。注：喷泉「⛲ HP/MP 完全恢复」的 1600（onFountainStep，行 238）是「小事件通知」另一语义的独立停留时长，值同为 1600 却互不相干，与 ALTAR_LEAD_MS 注释里「700 家族」同款刻意保留。
- 【修正：data.js 在 `ALTAR_LEAD_MS` 之后新增 `ALTAR_TXT_MS = 1600`（强敌祭坛出场提示框文案停留时长，单位 ms，纯时序）为唯一真源，注释说明三处派生形态与喷泉 1600 另一语义的保留，随原 export 块导出，零新增依赖】`world.js` 三处祭坛出场提示的 `bind.boxMsg(..., 1600)` 改读 `bind.boxMsg(..., ALTAR_TXT_MS)`（import 列表同步加 ALTAR_TXT_MS）。收益：调强敌出场文案停留节奏只改 data.js 一处、三个祭坛同步，绝无第二套口径；行为逐字不变（`ALTAR_TXT_MS` 仍为 1600，三处停留时长与旧字面量逐值恒等），零战斗/世界流程回归。
- 【零回归面】未动强敌触发机制本身——`onBossAltar`/`onCaveAltar` 的文案内容、入场判定、`ALTAR_LEAD_MS` 切入延时、Boss 登场前后 flag 判定（bossDefeated/caveBoss/gallery 分支）全部原样；喷泉回复的 1600、终焉之神系 1800 文案家族（onTrueCrystal 四处 + onTrialStele 一处，行 267-287）与 ALTAR_LEAD_MS 注释中「700 家族」全部逐字未动；`WALK_MS=180` 等世界节奏常量原样。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/存档。只新增一个常量 + 改 3 处表达式 + 1 处 import + 1 处 export + 注释，零新增依赖。
- 验证：`node --check js/data.js js/world.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.24 专项冒烟（/tmp/jrpg_smoke_v1924_altartxt.mjs）**18 项断言全过**——`ALTAR_TXT_MS=1600` 导出且定义/export 齐全、world.js import 与 3 处调用点（幽冥魔王/残焰魔像/洞窟领主）均读该源、裸「boxMsg(…, 1600)」清零（剩 1 处恰为喷泉另一语义）、喷泉 1600 文案逐字保留、行为逐值恒等（1600===ALTAR_TXT_MS）、时序家族既有成员（ALTAR_LEAD_MS 600 / HIT_FB_MS 220 / UI_PULSE_MS 400 / IDLE_BOB 500·0.13 / DAY_PHASE_S 90 / BLOG_WIN 3 / BATTLE_MON 248 / BATTLE_HERO 96·400）不受影响。

## v19.23 强敌祭坛「战前切入战斗延时」单一数据源——三个强敌的对峙停顿同读 ALTAR_LEAD_MS（纯时序·单一口径，与 v19.8 HIT_FB_MS / v19.15 UI_PULSE_MS / v19.18 IDLE_BOB / v19.21 DAY_PHASE_S 同一「时序数据化」体系——本版收口的是世界交互「踩祭坛到切入战斗」的演出节奏，与 v19.22 BLOG_WIN 同为「一处语义三处复制」的收口形态）

- 【强敌战前停顿「600ms」在 world.js 以裸字面量写三处、三处互不相关】强敌祭坛「先弹出场提示框、再延时切入战斗」的对峙停顿以完全相同的 `setTimeout(..., 600)` 裸写 world.js 三处：`onBossAltar` 的幽冥魔王（雾语林祭坛，行 246）、`onCaveAltar` 的残焰魔像（无字回廊祭坛，行 254）与洞窟领主（星井矿脉祭坛，行 259）——三处同值互不引用：想调强敌战前演出节奏（如放慢到 800 让出场台词多停一拍、收紧到 400 更快入战）要改三个地方、还极易只改一个祭坛漏改另外两处——三个强敌的对峙停顿悄然脱钩，而这个「战前停顿多久」的时序参数本身始终没有名字（同一文件里 BOSS 祭坛/回廊祭坛/矿脉祭坛三处恰好都凑巧写 600，无任何一处能说明这是设计值还是随手写的数）。
- 【修正：data.js 在 `BATTLE_HERO` 之后新增 `ALTAR_LEAD_MS = 600`（强敌祭坛战前演出到切入战斗的延时，单位 ms，纯时序）为唯一真源，注释说明三处派生形态与刻意保留的 700 家族（终焉之神战前 700 / 回廊传送 700 / 试炼首战 700 是「真结局/传送一类」另一语义、值同为 7 开头却互不相干），随原 export 块导出，零新增依赖】`world.js` 三处祭坛切入延时的 `setTimeout(..., 600)` 改读 `setTimeout(..., ALTAR_LEAD_MS)`（import 列表同步加 ALTAR_LEAD_MS）。收益：调强敌战前演出节奏只改 data.js 一处、三个祭坛同步，绝无第二套口径；行为逐字不变（`ALTAR_LEAD_MS` 仍为 600，三处延时与旧字面量逐值恒等），零战斗/世界流程回归。
- 【零回归面】未动强敌触发机制本身——`onBossAltar`/`onCaveAltar` 的出场提示框文案与 1600 时长、`S.scene === 'world'` 防重叠守卫、`deep(...)` 生成、Boss 登场前后 flag 判定（bossDefeated/caveBoss/gallery 分支）全部原样；终焉之神战前 700（`onTrueCrystal`）、回廊传送 700（`transition('gallery')`）、battle.startRush 试炼首战 700 等「另一语义」的延时逐字未动；`WALK_MS=180` 等世界节奏常量原样。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/存档。只新增一个常量 + 改 3 处表达式 + 1 处 import + 1 处 export + 注释，零新增依赖。
- 验证：`node --check js/data.js js/world.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.23 专项冒烟（/tmp/jrpg_smoke_v1923_altarlead.mjs）**17 项断言全过**——`ALTAR_LEAD_MS=600` 导出且与字面量一致、data.js 定义/export 齐全、world.js import 与 3 处调用点（BOSS/EMBER_GOLEM/CAVE_BOSS）均读该源、裸「startBattle(...}, 600)」清零（剩 0 处）、终焉之神 700 / 回廊传送 700 另一语义保留、三处延时与旧字面量逐值恒等、时序家族既有成员（HIT_FB_MS 220 / UI_PULSE_MS 400 / IDLE_BOB 500·0.13 / DAY_PHASE_S 90 / BLOG_WIN 3 / BATTLE_MON 248 / BATTLE_HERO 96·400）不受影响。

## v19.22 战斗战报窗口「每屏行数」单一数据源——可见行数、回看偏移、溢出指示同读 BLOG_WIN（纯显示·单一口径，与 v19.8 HIT_FB_MS / v19.15 UI_PULSE_MS / v19.18 IDLE_BOB / v19.21 DAY_PHASE_S 同一「UI 显示参数数据化」体系——战斗画面这块收口的不是 ms 节奏，而是战报区「一屏摆几行」的布局阈值）

- 【战报窗口「3 行」在 view/drawBattle 以裸字面量 `3` 写三处的 `3` 处互不相关】战斗战报区「每屏显示 3 行」以裸字面量 `3` 游离在 data.js 之外：`view/drawBattle.js` 战报区**回看偏移上限** `S.blog.length - 3`（行 311）、**切片窗口** `S.blog.length - 3 - S.blogView`（行 314）、**溢出指示** `S.blog.length > 3`（行 316）三处同值互不引用——想调战报窗口高度（如放宽到 4 行让更多信息常驻，或收紧让画面更空）要改三处、还极易只改窗口漏改溢出指示——窗口已显示 4 行「↑↓ 回看」却仍只在 >3 时才出现，溢出提示与窗口高度悄然脱钩；而窗口「摆几行」这一布局阈值本身始终没有名字，只能靠翻字面量识别「3 是设计值而非随手写的数」。
- 【修正：data.js 在 `DAY_PHASE_S` 之后新增 `BLOG_WIN = 3`（战报窗口每屏可见行数，纯显示）为唯一真源，注释说明三处派生形态与刻意保留的排版参数（行距 `18`、每行显字），随原 export 块导出，零新增依赖】`view/drawBattle.js` 战报区三处改读 `S.blog.length - BLOG_WIN` / `S.blog.length - BLOG_WIN - S.blogView` / `S.blog.length > BLOG_WIN`，import 列表同步加 BLOG_WIN。收益：调战报窗口高度只改 data.js 一处、回看偏移与溢出指示同步，绝无第二套口径；行为逐字不变（`BLOG_WIN` 仍为 3，三处表达式与旧字面量在战报长度/回看偏移全扫下逐值恒等），零战报/UI 回归。
- 【零回归面】未动战报机制本身——blogView 上下翻页（main.js 按键、state.js 初始 0）、blog 每行显字与行距 18、回看提示文案（「↑↓ 回看战斗记录」/「↓ 回到最新」）、提示字号颜色位置全部原样；`3` 只在这三处是「窗口可见行数」语义，其余（战报区坐标 470、行距 18）为独立排版参数刻意不动。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/存档。只新增一个常量 + 改 3 处表达式 + 1 处 import + 1 处 export + 注释微调，零新增依赖。
- 验证：`node --check js/data.js js/view/drawBattle.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.22 专项冒烟（/tmp/jrpg_smoke_v1922_blogwin.mjs）**18 项断言全过**——`BLOG_WIN=3` 导出且与历史字面量一致、data.js 定义/export 齐全、drawBattle import 与窗口逻辑 3 处读该源（共 5 处含 import/注释）、裸「blog.length - 3」与「blog.length > 3」已清零（剩 0 处）、窗口行为 L∈[0,12]×view∈[-3,12] 全扫逐值恒等（长战报 3 行+溢出指示 / 短战报 2 行无提示 / 回看尽头 maxV=5 核对）、时序家族既有成员（HIT_FB_MS 220 / UI_PULSE_MS 400 / IDLE_BOB 500·0.13 / DAY_PHASE_S 90）不受影响。

## v19.21 世界昼夜相位时长单一数据源——昼夜判定与界面注释同读 DAY_PHASE_S（纯显示·单一口径，与 v19.8 HIT_FB_MS / v19.15 UI_PULSE_MS / v19.18 IDLE_BOB / v19.17 warnFlash 同一「动画时序数据化」体系——本家族此前收口的都是 ms 级 UI/反馈节奏，唯独「一轮昼夜 4×90=360 秒」的世界时钟节奏仍是裸奔数值）

- 【世界时钟「每档跑多快」没有名字的 `2` 处互不相关】昼夜四相位（day/dusk/night/dawn）各 90 秒一轮 360 秒的相位时长以裸字面量 `90` 游离在 data.js 之外：`view/drawWorld.js` 的 `timeOfDay()` 判定 `['day','dusk','night','dawn'][Math.floor(t/90)%4]`（可执行代码 1 处）+ `view/hud.js` 注释自写一句「90 秒一档的昼夜标签」（文字第 2 处）——想调昼夜节奏（如加快到 60 秒一档、放慢到 120）要改判定 + 记得同步注释，还极易只改判定漏改注释，让「这个世界的昼夜跑多快」始终没有名字；而 `S.G.time`（main.js 游戏时钟按真实秒累进）是纯世界时钟、零结算影响，正是该家族里最后一枚裸奔读数。
- 【修正：data.js 在 `IDLE_BOB` 之后新增 `DAY_PHASE_S = 90`（每档相位时长，单位：秒）为唯一真源，注释说明与时序家族的关系与结构（4 相位各 90 秒轮转）、随原 export 块导出，零新增依赖】`view/drawWorld.js` 的 `timeOfDay()` 判定改 `Math.floor(t / DAY_PHASE_S) % 4` 并补注释；`view/hud.js` 注释旧「显示 90 秒一档的昼夜标签」改写为指向该源。收益：调昼夜节奏只改 data.js 一处，判定与界面注释绝无第二套口径；行为逐字不变（`DAY_PHASE_S` 仍为 90，`timeOfDay()` 与旧字面量在 t∈[0,9999] 全扫下逐值恒等），零渲染/世界时钟回归。
- 【零回归面】未动昼夜机制本身——四相位数组、`S.G.time` 累进（main.js）、回廊恒暗特判、村庄夜晚灯火、drawTimeTint 各相位着色、`fmtTime` 冒险时长全部原样；drawWorld 其余独立动画参数（雨 /40、洞窟萤火 /80、回廊漂浮 /120、水面 /400）与 minimap 高度 `Math.min(90,…)` 另一语义刻意保留。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/存档。只新增一个常量 + 改 1 处判定 + 2 处注释 + 1 处 import + 1 处 export，零新增依赖。
- 验证：`node --check js/data.js js/view/drawWorld.js js/view/hud.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.21 专项冒烟（/tmp/jrpg_smoke_v1921_dayphase.mjs）**14 项断言全过**——`DAY_PHASE_S=90` 导出且定义/export 齐全、时序家族既有成员（HIT_FB_MS 220 / UI_PULSE_MS 400 / IDLE_BOB 500·0.13）不受影响、drawWorld 读取该源恰好 1 处、裸「Math.floor(t / 90)」清零（剩 0 处）、timeOfDay 与旧公式 t∈[0,9999] 全扫逐值恒等、相位边界 4×90=360 一轮（0 白天→90 黄昏→180 夜晚→270 黎明→360 白天）核对通过、独立动画参数与 minimap 90 另一语义保留、hud 注释已改写且 PERIOD 四标签未动。

## v19.20 药水/灵药恢复量公式单一数据源——结算与战斗预览共读 rules.potionRestore/elixirRestore（机制·单一口径，与 v19.5 threatWarn 同一「预览-结算同公式」家族——v19.5 收口了「我方攻击预览」后，「[3]药水/🧪灵药恢复多少」是战斗提示里最后一组结算量由视图层自算的裸公式）

- 【`2` 处同公式互不相关】药水/灵药「恢复量」的计算公式裸写两处：`hero.js takePotion`（**结算**——core.js usePotion 与 battle.doItem 两条消费路径都经它出账）里 `Math.round(hpMax×POTION_HP_PCT)+POTION_HP_FLAT`（普通药水）、`Math.round(hpMax×ELIXIR_HP_PCT)+ELIXIR_HP_FLAT` 与 `Math.round(mpMax×ELIXIR_MP_PCT)`（高级灵药）；`view/drawBattle.js` 战斗指令栏「[3]恢复：🍖+…HP 🧪+…HP/+…MP」**预览**把同一公式再写一遍——两处同值互不引用，想改恢复模型（如改成比例+等级加成、或把舍入从 round 改 floor）要改两个文件四行，还极易只改结算漏改预览，界面标「+N HP」实际只回 M HP 悄然对不上（与 v19.5 threatWarn 收口前同款黑盒，这次轮到恢复量）。
- 【修正：rules.js 新增 `potionRestore(hero)`（返回 `{h}`）与 `elixirRestore(hero)`（返回 `{h,m}`）两个纯函数为唯一公式源（与 cmdDmg/atkEstimate/skillEstimate 同一「无副作用计算」家族，data.js POTION_*/ELIXIR_* 常量只在 rules.js 一处被消费）】`hero.js takePotion` 与 `view/drawBattle.js` 预览同时改调这两函数（drawBattle 的 rules import 原先只含 cmdDmg/atkEstimate/skillEstimate/rushReward/canonicalName/isBossFoe，追加两函数）。收益：改恢复公式只改 rules.js 一处，结算与预览永远同一份公式、绝无第二套口径——与 v19.5「预览与结算同公式」完全同一思路，只是这次收的是恢复量而不是伤害量。数值逐字不变（旧公式全等移入 home 函数），零恢复量回归。
- 【零回归面】未动药水机制本身——`takePotion` 的消耗顺序（灵药优先/普通药水只在掉血时用）、`Math.min(hpMax, …)` 夹取、`potionAvailability` 满状态判定、core.usePotion 的提示文案、battle.doItem 调用顺序全部原样；data.js `POTION_HP_PCT=0.5`/`POTION_HP_FLAT=8`/`ELIXIR_HP_PCT=0.8`/`ELIXIR_HP_FLAT=20`/`ELIXIR_MP_PCT=0.4` 五个常量逐字未动；menus.js 酿造页与 shop.js 商店价签显示的仍是配方百分比/固定加成（`Math.round(POTION_HP_PCT*100)%HP +FLAT` 之类），它们是常量文案而非按当前等级算的恢复量，保持原样。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/存档。只新增两个纯函数 + 改 6 行调用 + 3 处 import 整理 + 注释微调，零新增依赖。
- 验证：`node --check js/rules.js js/hero.js js/view/drawBattle.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.20 专项冒烟（/tmp/jrpg_smoke_v1920_potion.mjs）**24 项断言全过**——`potionRestore/elixirRestore` 导出、data.js 五常量逐值未动、全扫 hpMax∈[1,9999]×mpMax∈[1,333] 与旧公式逐值恒等（含 round 半入 53.5→54 / 85.6→86 精确值）、takePotion 灵药优先/恢复量逐值一致/HP 夹取到上限/普通药水只回 HP 且 MP 原样/药水不足返回 null、hero.js 与 drawBattle.js 裸公式清零且改读两函数、两模块 data.js import 不再含 POTION_/ELIXIR_ 常量、rules.js import 含之。

## v19.19 传送门「面向提示」锁定判定单一数据源——锁定的村门从「毫无反馈的死区」变成「⛔ 门锁着」（体验·单一口径，与 v19.17 ENCOUNTER.warnFlash 同源不同家族——本版收口的是地图传送门锁定判定在视图层的裸写副本，同时补上一个真实 UX 死区）

- 【视图层裸写锁定判定 + 锁定时零反馈的 `2` 个问题】村庄东门（GATE）锁定条件「bossDefeated 后门常闭、只提示不传送」这一定义只在 `data.js MAPS.village.portals.GATE.locked(g)` 一处为真源，`world.usePortal` 锁定时弹 lockedMsg 拒绝通行；但视图层 `view/drawWorld.js` 的 `faceHint`（面向提示）把同一语义裸写成 `!(curMap()==='village' && S.G.bossDefeated)`——（a）与读表的 usePortal 互不引用，想给别的门加锁/换锁条件（如给 dungeon 的 GATE 按进度上锁）要改两个地方、还极易只改结算漏改提示，锁定判定悄然出现两套口径；（b）更糟的是锁定时条件为假、不进入该分支也不给任何提示——面向锁着的村门画面上什么都没有，玩家只能靠「踩上去才弹 lockedMsg」碰运气，无法从任何静态信号判断「这门通不通」。
- 【修正：视图层 GATE 分支改读 `MAPS[curMap()].portals.GATE.locked(S.G)`（与 world.usePortal 同一真源，零新增依赖——`MAPS`/`curMap`/`portalDest` 均已在本文件 import 列表），锁定时显示「⛔ 门锁着」、未锁照旧显示「踩上通行 → 目的地」】`view/drawWorld.js` `faceHint` 的 GATE 分支：先取 `(MAPS[curMap()].portals||{}).GATE`，`gate.locked && gate.locked(S.G)` 为真则 `lab='⛔ 门锁着'`，否则回落到原 `portalDest` 目的地提示。收益：锁定判定只有 data.js 一处口径、界面提示与真实传送行为绝无第二套；锁定的门第一次有了静态可交互信号（面向即见 ⛔），不用踩上去才知道锁着；dungeon/cave/gallery 的无锁 GATE/EXIT 行为逐字不变（仍走原目的地提示分支）。纯显示、零结算变化。
- 【零回归面】未动传送机制本身——`world.usePortal` 的 `p.locked(S.G)` 判定、`lockedMsg` 弹窗、`portalDest` 目的地、GATE/EXIT 踩踏与 Enter 打开全部原样；`MAPS.village.portals` 数据逐字不变；其余瓦片（NPC/SHOP/INN/BREW/STELE/FOUNTAIN/CHEST/BOSS/MB/SB/TRIAL）的 faceHint 分支原样。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/存档。只改 faceHint 一处 GATE 分支 + 注释，零新增依赖、零新增 export、零新增 import。
- 验证：`node --check js/view/drawWorld.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.19 专项冒烟（/tmp/jrpg_smoke_v1919_gatelock.mjs）**8 项断言全过**——未锁村门仍显示「踩上通行 → 雾语林」、未锁不显示「门锁着」、锁定（bossDefeated）现显示「⛔ 门锁着」、锁定不再显示「踩上通行」、MAPS 表 `locked()` 在锁定/解锁两态判定正确（与 usePortal 同源验证）、dungeon 面向 EXIT 不抛错且仍显示「踩上通行 → 潮灯镇」。

## v19.18 待机呼吸 bob 周期/相位展开单一数据源——世界与战斗精灵四处同读 IDLE_BOB（纯显示·单一口径，与 v19.15 UI_PULSE_MS / v19.17 ENCOUNTER.warnFlash 同一「动画时序数据化」体系——世界/战斗精灵「待机呼吸」的 ±1px 正弦浮动周期 500ms 与「相位随坐标错开」的展开系数 0.13 是精灵动画系列里最后一组四处复制的裸数值）

- 【`4` 处同语义互不相关】「待机呼吸」的 `Math.sin(Date.now()/500 + (px+py)*0.13)`（±1px 正弦浮动，相位随坐标错开防全场同步）以完全相同的形态裸写四处：`view/sprites.js` 的 `drawSheetChar`（32px 图集路径）、`drawSheetCustom`（定制帧位图集）、`drawSheetStrip`（条状图集）三处 + `drawMonster` 程序化回退路径一处（该处变量名 px/py 写作 x/y，同一语义）——四处同值互不引用，想调待机呼吸节奏（如放慢到 600ms、或让相位随坐标错开得更密 0.2）要改四个地方、还极易只改图集路径漏改回退路径——同屏几种怪待机呼吸悄然脱钩（v13.3 引入待机呼吸时把周期/相位参数写在各绘制路径体内，图集路径改了回退路径还按旧节奏浮）。注意：蓄力光环 320ms 正弦呼吸、任务问号 320ms、变身闪光 `t/400` 衰减、水纹相位 `/400` 是各自仅一处的单点动画参数（非四处同语义复制），数据注释沿用「刻意不并入、无需收口」的处理，本版不碰。
- 【修正：data.js 在 `UI_PULSE_MS` 之后新增 `IDLE_BOB = { period: 500, phase: 0.13 }`（period=待机呼吸正弦周期 ms、phase=相位随坐标错开的展开系数 rad/px）为唯一真源，注释说明派生形态与刻意保留的单点动画参数，随原 export 块导出，零新增依赖】`view/sprites.js` 四处改读 `Date.now()/IDLE_BOB.period + (px+py)*IDLE_BOB.phase`（回退路径同式 `(x+y)*IDLE_BOB.phase`），import 列表同步加 IDLE_BOB。收益：调待机呼吸节奏/相位错开密度只改 data.js 一处、图集与回退路径同步，绝无第二套口径；行为逐字不变（`IDLE_BOB.period` 仍为 500、`IDLE_BOB.phase` 仍为 0.13，四处表达式与旧字面量逐值恒等），零渲染/动画回归。
- 【零回归面】未动待机呼吸机制本身——±1px 浮动幅度 `Math.round(Math.sin(…))`、`opts.idle` 开关、相位随坐标错开的设计、各绘制路径的调用全部分布原样；`drawSheetChar` 的 `Math.floor(Date.now()/300)%2`（16px hurt 交替帧）、`drawSheetCustom` 的帧播放 300ms、`drawSheetStrip` 的 140ms 换帧、行走走帧 120ms、`drawHero` 程序化回退的 380ms bob / 260ms 走步均为各动画独立参数，原样不动。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/存档。只新增一个对象常量 + 改 4 处表达式 + 1 处 import + 1 处 export + 注释微调，零新增依赖。
- 验证：`node --check js/data.js js/view/sprites.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.18 专项冒烟（/tmp/jrpg_smoke_v1918_idlebob.mjs）**13 项断言全过**——`IDLE_BOB` 导出且 period=500/phase=0.13、data.js export 与 sprites.js import 均含该源、sprites.js 读 `IDLE_BOB.period`/`IDLE_BOB.phase` 各恰 4 处、裸「Date.now()/500 + (px+py)*0.13」与「(x+y)*0.13」已清零（剩 0 处）、新旧表达式 t∈[0,2000]×c∈[-64,64] 全扫逐值恒等、UI_PULSE_MS/HIT_FB_MS/warnFlash 既有动画时序常量原样。

## v19.17 遇敌预警条快闪周期单一数据源——小地图「⚠️ 危险逼近」红色预警条的 330ms 快闪开关同读 ENCOUNTER.warnFlash（纯显示·单一口径，与 v19.9 ENCOUNTER.full / v19.12 ENCOUNTER.warn 同一「遇敌槽数据化」家族——v19.12 收口 70 预警线时把「预警态闪烁 330ms 呼吸」明确标为家族留白，是 ENCOUNTER 对象之外最后一枚游离的遇敌槽读数可视反馈数值）

- 【`1` 处可执行调用点 + 注释双重留白的收口】遇敌槽「⚠️ 危险逼近」红色预警条的快闪开关周期「330」此前以裸字面量游离在遇敌槽口径之外：`view/drawWorld.js` 小地图的 `Math.floor(Date.now()/330)%2===0` 判定（可执行代码 1 处）+ data.js UI_PULSE_MS 注释对它「遇敌预警条 330ms…刻意不动」的留白标注（文字第 2 处）。遇敌槽其余一切读数口径（dangerMin/dangerVar/fountain/calm/full/warn）都已集中在 `ENCOUNTER` 对象，唯独这枚「预警条以多快的节奏快闪」是家族里最后一处游离值：想调预警闪烁节奏（如放慢到 450、或换成 250 更快闪）要改判定字面量 + 记得同步数据层注释，还极易只改界面漏改注释、让「预警闪烁」这个概念仍然没有名字。
- 【修正：data.js 的 `ENCOUNTER` 对象在 `warn` 之后新增 `warnFlash: 330`（红色预警条快闪开关周期，单位 ms）为唯一真源（随原对象一同 export，零新增导出项；对象注释补写 warnFlash 语义与家族收编说明，UI_PULSE_MS 注释里旧「遇敌预警条 330ms…刻意不动」的留白文字改写为已收口说明）】`view/drawWorld.js` 预警快闪判定改 `Math.floor(Date.now() / ENCOUNTER.warnFlash) % 2 === 0` 并补注释；`ENCOUNTER` 已在 drawWorld import 列表（v19.9/v19.12 已导入），零新增依赖。收益：调预警闪烁节奏只改 data.js 一处，界面判定与数据层注释同步，绝无第二套口径；行为逐字不变（`ENCOUNTER.warnFlash` 仍为 330，快闪开关与旧字面量在 t∈[0,2000] 全扫下逐值恒等），零遇敌/UI 回归。
- 【零回归面】未动遇敌槽机制本身——四个增减量、满槽 `full: 100`、预警线 `warn: 70` 逐字不变，`tickEncounter` 累加/触发、小地图色带与「遇敌 N%」读数、预警态配色（`#ff8a5b`/`#e14b3f`）与「⚠️ 危险逼近」文案全部原样；蓄力光环 320ms 正弦呼吸、任务问号 320ms 方块波、变身闪光 `t/400` 衰减、水纹 sine 相位 `/400` 各自动画独立参数一概不动。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/存档。只加一个对象成员 + 改 1 处判定 + 注释微调，零新增依赖、零新增 export、零新增 import。
- 验证：`node --check js/data.js js/view/drawWorld.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.17 专项冒烟（/tmp/jrpg_smoke_v1917_encflash.mjs）**14 项断言全过**——`ENCOUNTER.warnFlash=330` 导出且与历史字面量一致、对象定义与逐成员核对（dangerMin 10/dangerVar 9/fountain -25/calm -6/full 100/warn 70 不受影响）、drawWorld 可执行快闪调用点 1 处读该源、裸「Date.now()/330」已清零（剩 0 处）、快闪表达式与旧字面量 t∈[0,2000] 全扫逐值恒等、UI_PULSE_MS 注释留白说明已随收口改写、蓄力光环 320 正弦/任务问号 320/变身闪光 t/400 另一语义仍在。

## v19.16 开局经济/背包单一数据源——新档建档同读 START_GOLD/START_POTIONS（机制·单一口径，与 XP_INIT 同一「开局建档数值数据化」逻辑——建档行三枚数值里 XP_INIT（首级所需经验）早已数据化、唯独开局金币 30 / 生命药水 3 仍在 core.js 裸奔，本版补齐收口，与 INN_PRICE / BREW_GOLD / POTION_PRICE 同一「经济数据化」体系）

- 【建档行「经验已数据化、家底仍裸奔」的 2 枚遗留数值】`core.newGame` 的开局建档行 `level:1, xp:0, xpNext: XP_INIT, gold:30, item:3, potion2:0` 里，`XP_INIT` 早已由 data.js 常量供给，惟独开局金币 `30` 与开局生命药水 `3` 仍是裸字面量（`potion2:0` 为恒零的占位字段、`level/xp` 为结构性初始值，不属经济旋钮）——全库唯一定义开局家底的这一行没有自己的名字，想调开局难度（如困难档加码 50 金、或试点「轻装开局」1 瓶药水）得在 core.js 里翻字面量，且没有任何一处能看出「开局 30 金 / 3 瓶药水」是数值设计而非随手写的数；同栖一行的 `XP_INIT` 自 v14.x 起就由 data.js 供给，唯独这两位邻居漏了数据化。
- 【修正：data.js 在 `XP_INIT` 之后新增 `START_GOLD = 30`（新档开局金币）与 `START_POTIONS = 3`（新档开局生命药水）为唯一真源，注释说明这是建档行里 XP_INIT 的两位裸奔邻居，随原 export 块导出，零新增依赖】`core.js` 建档行改 `gold: START_GOLD, item: START_POTIONS`（import 列表同步加两常量）。收益：调开局家底只改 data.js 一处，建档与任何展示口径绝无第二套数值；行为逐字不变（`START_GOLD` 仍为 30、`START_POTIONS` 仍为 3，newGame 产出的开局状态与旧字面量逐值恒等），零开局/经济回归。
- 【零回归面】未动建档机制本身——`level:1`、`xp:0`、`potion2:0`（灵药恒零占位）、`xpNext: XP_INIT`、木剑/布衣、出生点、起始技能 `learnsAt(1)` 全部原样；存档槽预览/`slotPreview` 只读 `hero.gold` 运行时值、不受影响。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/后续存档解析。只新增两个常量 + 改 1 处建档行 + 2 处 import + 1 处 export + 注释微调，零新增依赖。
- 验证：`node --check js/data.js js/core.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.16 专项冒烟（/tmp/jrpg_smoke_v1916_start.mjs）**15 项断言全过**——`START_GOLD=30`/`START_POTIONS=3` 导出且与历史字面量逐值一致、`XP_INIT` 不受影响、`newGame()` 开局 gold=30/item=3/potion2=0/xpNext=20 与旧建档逐值恒等、core.js 建档行裸「gold: 30」/「item: 3」已清零（剩 0 处）且改读两常量、core.js import 与 data.js export 均含两常量。

## v19.15 UI「提示闪烁」脉冲周期单一数据源——防御/中毒角标、宝箱脉动、对话翻页指示四处同读 UI_PULSE_MS（纯显示·单一口径，与 v19.8 HIT_FB_MS 同一「UI 反馈时序数据化」家族——v19.8 收口受击反馈时长时把「盾牌/中毒角标与蓄力光环的呼吸周期」明确标为另一语义留白，本版兑现收口其中完全同型的方块波族）

- 【`4` 处同语义互不相关】UI「状态/提示闪烁」的 400ms 方块波开关表达式完全相同的 `Math.floor(Date.now()/400)%2===0` 裸写三文件四处：`view/drawBattle.js` 防御（盾牌）角标闪烁、`view/drawBattle.js` 中毒角标闪烁、`view/drawWorld.js` 蘑菇宝箱金光脉动、`view/menus.js` 对话翻页 ▼ 指示闪烁——四处同值互不引用（方块波：每 400ms 切换一次亮度，亮 400ms 灭 400ms），想调整个「提示闪烁」节奏（如放慢到 500、或加快到 300）要改三个文件里的四个地方、还极易只改角标漏改宝箱脉动——U 盾角标节奏变了蘑菇宝箱还按旧速度脉，各处提示开关悄然脱钩（自家 v19.8 收口受击时长时把「盾牌/中毒角标与蓄力光环的呼吸周期」标为另一语义留白，现兑现收口其中与旧字面量逐字同型的方块波族）。注意：蓄力光环 320ms 正弦呼吸、任务问号 320ms、遇敌预警条 330ms 快闪、变身全屏闪光 `t/400` 衰减、水纹/喷泉 sine 相位 `/400` 是各自动画的独立参数，本版刻意不碰。
- 【修正：data.js 在 `HIT_FB_MS` 之后新增 `UI_PULSE_MS = 400`（方块波闪烁的切换间隔，唯一真源，注释说明派生形态与刻意保留的独立动画参数，随原 export 块导出，零新增依赖）】`view/drawBattle.js` 盾牌/中毒两处角标、`view/drawWorld.js` 蘑菇宝箱脉动、`view/menus.js` 对话翻页指示共四处改读 `Math.floor(Date.now()/UI_PULSE_MS)%2===0`，三模块 import 列表同步加 UI_PULSE_MS。收益：调整个提示闪烁节奏只改 data.js 一处、角标/宝箱/翻页指示同步，绝无第二套口径；行为逐字不变（`UI_PULSE_MS` 仍为 400，四处开关与旧字面量在 t∈[0,4000] 全扫下逐值恒等、亮/灭切换点 0→400→800 逐值一致），零战斗/UI 回归。
- 【零回归面】未动任何闪烁渲染本身——每处闪烁的配色、出现条件（防御态、中毒回合数、支线/击破 Boss 后未开的宝箱、翻页未完）、字号/位置全部原样；`drawTileFx` 水纹 sine 相位 `Date.now()/400`、变身闪光 `(Date.now()-S.flash.t0)/400`、蓄力光环 `Date.now()/320` 正弦呼吸、任务问号 320ms、预警条 330ms 各动画面独立参数一概不动。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/存档。只新增一个常量 + 改 4 处表达式 + 3 处 import + 1 处 export + 注释微调，零新增依赖。
- 验证：`node --check js/data.js js/view/drawBattle.js js/view/drawWorld.js js/view/menus.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.15 专项冒烟（/tmp/jrpg_smoke_v1915_pulsems.mjs）**21 项断言全过**——`UI_PULSE_MS=400` 导出且与历史字面量一致、三模块 import 与四处调用点均读该源、三文件方块波裸「Math.floor(Date.now()/400)%2」已清零（剩 0 处）、水纹 sine `/400` / 变身闪光 `t/400` / 蓄力光环 320 / 问号 320 / 预警条 330 另一语义仍在、pulseNew 与旧字面量 t∈[0,4000] 全扫逐值恒等且亮/灭切换点（0/399 亮·400/799 灭·800/1600 回亮）校验。

## v19.14 战斗「实体落点」单一数据源——敌方本体/我方立绘锚点同读 BATTLE_MON/BATTLE_HERO（纯显示·单一口径，与 v19.13 FX_ENEMY/FX_HERO 同一「战斗落点数据化」家族——v19.13 收口「受击反馈落点」时把「实体/面板位置」明确标为另一语义留白，本版兑现收口：怪物本体「CV.width/2, 248」、我方立绘 (96,400) 是战斗画面里最后一片裸奔坐标）

- 【`8` 处同语义互不相关】战斗「实体落点」裸写八处：敌方本体锚点「CV.width/2, 248」两遍（`drawBattle.js` `drawArena` 竞技场辉光与 `drawBattle` 本体的 `const ey0 = 248` 各声明一遍，横坐标 ex0 同为画布居中 CV.width/2）、我方立绘 (96,400) 连带派生六处（本体 `drawHero(96,400)`、脚下阴影 `ellipse(96,408)`、蓄力光环渐变两参数组与双环 `(96,388)`、顶部辉光点 `arc(96,344)`）——八处同值互不引用，想调战斗站位（如把怪物从 248 下沉贴近地面、或把立绘挪开避开浮字）要改九个地方、还极易只改本体漏改阴影/光环——立绘挪了脚下阴影与蓄力光环还踩在旧坐标，左右悄然脱钩（自家 v19.13 收口受击浮字时把这批坐标标为「实体位置另一语义」留白，现仍裸奔在战斗画面正中央）。注意：技能面板 `panel(150,96,340,308)`、状态页缩略图 `drawMonster(CV.width/2, 210, BOSS)` 是「面板/缩略图位置」另一语义，且仅各自一处调用，本版刻意不并入。
- 【修正：data.js 在 `FX_HERO` 之后新增 `BATTLE_MON = { y: 248 }`（敌方本体锚点：横坐标恒为画布中心，与 FX_ENEMY 同式 `CV.width/2`，非魔法值）与 `BATTLE_HERO = { x: 96, y: 400 }`（我方立绘锚点）为唯一真源，注释说明派生关系，随原 export 块导出，零新增依赖】`view/drawBattle.js` 的 `ey0` 两处改读 `BATTLE_MON.y`，我方立绘本体 `drawHero(BATTLE_HERO.x, BATTLE_HERO.y)`、阴影 `BATTLE_HERO.y + 8`、蓄力光环 `BATTLE_HERO.y - 12`、辉光点 `BATTLE_HERO.y - 56` 共六处改读 BATTLE_HERO 派生，import 列表同步加 BATTLE_MON/BATTLE_HERO。收益：调战斗站位只改 data.js 两处锚点、本体/阴影/光环/辉光点同步，绝无第二套口径；行为逐字不变（`BATTLE_MON.y` 仍为 248、`BATTLE_HERO` 仍为 (96,400)，八处坐标与旧字面量逐值恒等：y+8=408 / y-12=388 / y-56=344；敌方横坐标 `CV.width/2` 是画布居中自描述式，各调用点同式保留），零战斗/UI 回归。
- 【零回归面】未动战斗画面布局本身——怪物本体与阴影椭圆（ex0, ey0+8）、敌方名字/血条/二段变身线、我方立绘比例 `BATTLE_SCALE`、蓄力光环的半径/呼吸周期/颜色、`drawHero`/`drawMonster` 仍以参数接收锚点（sprites.js 内部零硬编码）；`view/drawBattle.js` 第 77 行技能面板 `panel(150,96,340,308)`、`view/menus.js` 状态页缩略图 `drawMonster(..., 210, ...)` 另一语义不动；行 257/282/383 的 `400` 是呼吸/变身闪光时长（另一语义）不动。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/存档。只新增两个对象常量 + 改 8 处坐标 + 1 处 import + 1 处 export + 注释微调，零新增依赖。
- 验证：`node --check js/data.js js/view/drawBattle.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.14 专项冒烟（/tmp/jrpg_smoke_v1914_battleanchors.mjs）**20 项断言全过**——`BATTLE_MON.y=248`/`BATTLE_HERO=(96,400)` 导出且与历史字面量逐值一致、drawBattle 两处 `BATTLE_MON.y` 读取点、八处裸坐标已清零（剩 0 处）、派生位移 y+8/y-12/y-56 逐值恒等（408/388/344）、敌方横坐标 `CV.width/2` 与技能面板 `panel(150,96,...)`、状态页缩略图 `(...,210,...)` 另一语义仍在、drawHero/drawMonster 仍参数化接收锚点。

## v19.13 受击反馈落点单一数据源——伤害浮字/爆裂粒子七处同读 FX_ENEMY/FX_HERO（纯显示·单一口径，与 v19.7 BIG_DMG / v19.8 HIT_FB_MS 同一「战斗反馈数据化」家族——v19.7 收口「多大伤害算大额」、v19.8 收口「受击反馈持续多久」后，「受击伤害数字/爆裂粒子落在屏幕哪里」是战斗视觉反馈里最后一处同值多行互不引用的裸奔坐标）

- 【`7` 处同语义互不相关】「受击伤害浮字/爆裂粒子落点」的屏幕坐标裸写七处：敌方落点「横坐标画布中心 + 纵坐标 188」四处（`battle.js` `attackMove` 攻击浮字、`enemyAI.js` 灼烧结算浮字、`enemyAI.js` 反击浮字、`view/drawBattle.js` `burstEnemy` 爆裂粒子）、我方落点「96, 340」三处（`battle.js` `applyPoisonTick` 中毒浮字、`enemyAI.js` 敌方攻击浮字、`view/drawBattle.js` `burstPlayer` 爆裂粒子）——七处同值互不引用，想调受击反馈位置（如把敌方浮字从 188 上移到 170 贴近怪物头部、或把毒字从我方头部挪开）要改三个文件里的七行，还极易只改浮字漏改爆裂粒子——伤害数字已上浮爆裂却还炸在旧位置，两侧受击反馈悄然分家（自家 v19.7/v19.8 把「阈值/时长」都收口了，唯独「位置」仍是家族里最后一处裸奔数值）。注意：怪物本体 `(ex0=CV.width/2, 248)`、我方立绘 `(96,400)`、技能面板 `panel(150,96,340,308)` 等是「实体/面板位置」另一语义，本版刻意不碰。
- 【修正：data.js 受击反馈数据化注释块在 `HIT_FB_MS` 之后新增 `FX_ENEMY = { y: 188 }`（敌方受击反馈落点：横坐标恒为画布中心，各处同式 `CV.width/2`，非魔法值）与 `FX_HERO = { x: 96, y: 340 }`（我方受击反馈落点）为唯一真源，随原 export 块导出，零新增依赖】`battle.js` 两处、`enemyAI.js` 三处、`view/drawBattle.js` 两处（`burstEnemy`/`burstPlayer`）共七处改读 `FX_ENEMY.y` / `FX_HERO.x` / `FX_HERO.y`，三模块 import 列表同步加 FX_ENEMY/FX_HERO。收益：调受击反馈落点只改 data.js 一处、浮字与爆裂粒子同步，绝无第二套口径；行为逐字不变（`FX_ENEMY.y` 仍为 188、`FX_HERO` 仍为 (96,340)，七处坐标与旧字面量逐值恒等；敌方横坐标 `CV.width/2` 是画布居中自描述式，各调用点同式保留），零战斗/UI 回归。
- 【零回归面】未动战斗画面布局本身——怪物本体与阴影椭圆（ex0, ey0=248/ey0+8）、敌方名字/血条/二段变身线、我方立绘与脚下阴影（96,400/96,408）、技能面板 `panel(150,96,340,308)`、`addFx` 的 `life:44/vy:1.5` 粒子属性、`burst` 的 n/尺寸/速度分布全部原样；`view/drawBattle.js` 第 91 行技能提示 `text(hint, 188, ...)` 的 188 是提示行横坐标（另一语义）亦不动。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/存档。只新增两个对象常量 + 改 7 处坐标 + 3 处 import + 1 处 export + 注释微调，零新增依赖。
- 验证：`node --check js/data.js js/battle.js js/enemyAI.js js/view/drawBattle.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.13 专项冒烟（/tmp/jrpg_smoke_v1913_fxpos.mjs）**19 项断言全过**——`FX_ENEMY.y=188`/`FX_HERO=(96,340)` 导出且与历史字面量逐值一致、battle/enemyAI/drawBattle 三模块 import 与七处调用点均读该源、三模块受击反馈裸坐标已清零（剩 0 处）、敌方横坐标 `CV.width/2` 画布居中同式保留（非魔法值）、技能面板 `panel(150,96,...)` 另一语义仍在、坐标值与旧字面量在 CV.width∈[400,800] 全扫下逐值一致。

## v19.12 遇敌槽「危险逼近」预警线单一数据源——小地图高亮临界同读 ENCOUNTER.warn（机制·单一口径，与 v19.9 ENCOUNTER.full 同一「遇敌槽数据化」家族——v19.9 收口满槽 100 时在 data.js 注释里把 70 预警线明确预留为「另一语义（预警高亮），不并入本常量」，本版兑现收口）

- 【`2` 处的收口】遇敌槽「⚠️ 危险逼近」预警临界值「70」此前以两种形态游离在遇敌槽口径之外：`view/drawWorld.js` 小地图的判定字面量 `encPct >= 70` + `data.js` 注释里对它的描述「70 线…不并入本常量」（注释本身即第二处提到此值的文字）。遇敌槽其余一切口径（dangerMin/dangerVar/fountain/calm/full）都已集中在 `ENCOUNTER` 对象，唯独这枚「何时向玩家亮危险预警」的读数临界是家族里最后一处游离值：想调预警灵敏度（如提前到 60%、或推迟到 85%）要改判定字面量 + 记得同步数据层注释，还极易只改界面漏改注释、让「预警线」这个概念仍然没有名字。
- 【修正：data.js 的 `ENCOUNTER` 对象在 `full` 之后新增 `warn: 70` 为唯一真源（随原对象一同 export，零新增导出项；注释同步改写，原「不并入本常量」预留说明随收口收编）】`view/drawWorld.js` 预警判定改 `encPct >= ENCOUNTER.warn` 并补注释。收益：调预警灵敏度/整体遇敌槽读数口径只改 data.js 一处，界面判定与数据层注释同步，绝无第二套口径；行为逐字不变（`ENCOUNTER.warn` 仍为 70，预警判定与旧字面量在 encPct∈[0,100] 全扫下逐值恒等），零遇敌/UI 回归。
- 【零回归面】未动遇敌槽机制本身——四个增减量与满槽 `full: 100` 逐字不变，`tickEncounter` 累加/触发、小地图色带与「遇敌 N%」读数、预警态闪烁 330ms 呼吸与「⚠️ 危险逼近」文案、`drawWorld` 其它 70 语义（minimap 高度等图形值）全部原样。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/存档。只加一个对象属性 + 改 1 处判定 + 注释微调，零新增依赖、零新增 export。
- 验证：`node --check js/data.js js/view/drawWorld.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.12 专项冒烟（/tmp/jrpg_smoke_v1912_encwarn.mjs）**11 项断言全过**——`ENCOUNTER.warn` 导出且 = 70（与历史字面量一致）、`full` 仍 = 100、drawWorld 预警判定/注释均读 ENCOUNTER.warn、drawWorld 可执行代码裸「>= 70」已清零（剩 0 处）、data.js「不并入本常量」预留说明已随收口改写、预警判定与旧字面量 encPct∈[0,100] 全扫逐值恒等。

## v19.11 强敌类敌手判定单一数据源——逃跑拦截/重试快照/名字配色/Boss 预判/Boss 形象六处同读 isBossFoe（机制·单一口径，与 v19.10 DOT_MIN 同一「战斗反馈数据化」家族——战斗/UI 里判断「是不是不可逃跑的 Boss 级敌人」这个谓词一直以同一段四旗标表达式裸写六处，是本家族里最后一处「同语义复制粘贴」的判定逻辑）

- 【`6` 同语义六处互不相关】「Boss 级强敌」判定 `enemy.isBoss || enemy.isTrue || enemy.isCaveBoss || enemy.isRush`（视模块写作 `S.enemy.…` 或 `m.…`）裸写六处：`battle.js` `startBattle` 的开战重试快照写入条件、`doFlee` 的「无法逃脱（本回合行动保留）」拦截；`view/drawBattle.js` 敌方名字紫色配色（`#d88bff`）、指令栏 `[4]逃跑⛔` 置灰（isBossFlee）、Boss 战敌方攻击预判分支（isBossFlee）；`view/sprites.js` `drawMonster` 的 Boss 形象选择（`boss` vs `slime`）——六处同值互不引用，想给某类强敌增删旗标（如新增第五种「不可逃跑」的强敌旗、或给某 Boss 开放逃跑）要同步改六个地方，还极易只改拦截漏改配色——「按 4 被气场压制」但指令栏还显示「成功率约60%」、攻击预判走普通怪分支、形象缩成史莱姆，四处悄然脱钩。
- 【修正：rules.js 新增 `isBossFoe(enemy)` 纯函数为唯一真源（置于 `canonicalName` 之前，注释同步说明，随既有逐一 export 方式导出）】`battle.js` 两处、`view/drawBattle.js` 三处、`view/sprites.js` 一处改读 `isBossFoe(…)`，三模块 import 列表同步加 isBossFoe。帮身 `!!(enemy && (isBoss||isTrue||isCaveBoss||isRush))` 自带 null/undefined 短路（与旧 `enemy && (…)` 恒等），调强敌判定只改 rules.js 一处、四处界面同步，绝无第二套口径；行为逐字不变（16 旗标组合全扫与旧谓词逐值恒等），零战斗/UI 回归。
- 【零回归面】未动强敌判定本身——四旗标的含义/取值、Boss 重试快照记录范围、逃跑拦截文案、紫色名字、`[4]逃跑⛔`、Boss 攻击预判、Boss 形象全部原样。以下刻意不动：`drawBattle` 竞技场辉光的 3 旗标写（`isBoss||isTrue||isCaveBoss`，不包 isRush——试炼战无竞技场辉光是另一语义）、`drawMonster` 里 `m.isTrue?1.28:(m.isBoss||m.isCaveBoss?1.18:…)` 的分档缩放（不同旗标不同系数，不是布尔判定）。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/存档。只新增一个纯函数 + 改 6 处判定 + 3 处 import，零新增依赖、零新增数据常量。
- 验证：`node --check js/rules.js js/battle.js js/view/drawBattle.js js/view/sprites.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.11 专项冒烟（/tmp/jrpg_smoke_v1911_bossfoe.mjs）**17 项断言全过**——`isBossFoe` 导出且为函数、16 旗标组合/null/undefined/空对象与旧谓词逐值恒等、六个调用点均改读 isBossFoe、battle/drawBattle/sprites 三文件强敌判定「四连裸谓词」已清零（rules.js 内仅帮身本体 1 处保留）、竞技场辉光 3 旗标与分档缩放两处另一语义仍独立。

## v19.10 灼烧/中毒每回合扣血下限单一数据源——结算与角标四处同读 DOT_MIN（机制·单一口径，与 v19.7 BIG_DMG / v19.8 HIT_FB_MS 同一「战斗反馈数据化」家族——持续伤害的比例（BURN_PCT 4% / POISON_PCT 5%）与回合数（POISON_TURNS）早已集中在 data.js，唯独「每回合至少扣 2 血」这个低血线钳制值是家族里最后一处裸奔数值）

- 【`4` 同语义四处互不相关】持续伤害（DoT）「每回合至少扣 2 血」的钳制下限 `Math.max(2, round(hpMax×pct))` 裸写四处：`enemyAI.js` 灼烧结算、`battle.js` `applyPoisonTick` 中毒结算、`view/drawBattle.js` 灼烧角标与中毒角标——四处同值互不引用，且 DoT 的比例/回合数明明早就集中在 `BURN_PCT`/`POISON_PCT`/`POISON_TURNS`，唯独下限值游离在对象系列之外：想调 DoT 下限（如把保底 2 收紧到 1、或放宽到 3）要改四个地方，还极易只改结算漏改角标——低 HP 怪结算已扣 3、战斗角标却还标 2，界面读数与实际扣血悄然脱钩。
- 【修正：data.js 在 `POISON_TURNS` 之后新增 `DOT_MIN = 2` 为唯一真源（注释同步说明，随原 export 块导出，零新增导出项）】`enemyAI.js` 灼烧结算、`battle.js` 中毒结算、`view/drawBattle.js` 灼烧/中毒角标四处改读 `Math.max(DOT_MIN, …)`，三模块 import 列表同步加 DOT_MIN。收益：调 DoT 下限只改 data.js 一处、结算与角标同步，绝无第二套口径；行为逐字不变（`DOT_MIN` 仍为 2，四处下限与旧字面量逐值恒等），零战斗/UI 回归。
- 【零回归面】未动持续伤害机制本身——`BURN_PCT`/`POISON_PCT` 比例、`POISON_TURNS` 回合数、毒蛇施毒概率 `POISON_CHANCE`、灼烧/中毒角标的 400ms 呼吸与配色全部原样；`sprites.js` 椭圆半径 `Math.max(2, …)` 与 `drawWorld.js` 小地图格子钳制 `Math.max(2, …)` 是另一语义（图形尺寸），刻意不动。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/存档。只新增一个常量 + 改 4 处下限 + 3 处 import + 1 处 export + 注释微调，零新增依赖。
- 验证：`node --check js/data.js js/battle.js js/enemyAI.js js/view/drawBattle.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.10 专项冒烟（/tmp/jrpg_smoke_v1910_dotmin.mjs）**13 项断言全过**——`DOT_MIN` 导出且 = 2（与历史字面量逐值一致）、四处 DoT 结算/角标均读 DOT_MIN、battle/enemyAI/drawBattle 三文件 DoT 语义裸「Math.max(2, Math.round(」已清零（仅注释保留说明）、`max(DOT_MIN, round(hpMax×pct))` 与旧字面量在 600 组全扫下逐值恒等、低 hpMax 钳制与高 hpMax 按比例语义验证。

## v19.9 遇敌槽满值单一数据源——world 累加/触发与 drawWorld 小地图同读 ENCOUNTER.full（机制·单一口径，与 v19.7 BIG_DMG / v19.8 HIT_FB_MS 同一「战斗反馈数据化」家族——遇敌槽的增减量（dangerMin/dangerVar/fountain/calm）早已集中在 data.js 的 ENCOUNTER 对象，唯独「满槽 100」这个决定遇敌触发频率的临界值是家族里最后一处裸奔数值）

- 【`4` 同语义四处互不相关】遇敌槽「满槽 100」裸写四处：`world.js` `tickEncounter` 累加上限 `Math.min(100, ...)`、触发判定 `S.encGauge >= 100`、`view/drawWorld.js` 小地图遇敌槽的 clamp `Math.min(100, S.encGauge || 0)` 与刻度分母 `encPct / 100`——四处同值互不引用，且遇敌槽的增减量明明早就集中在 `ENCOUNTER` 对象（`dangerMin`/`dangerVar`/`fountain`/`calm`），唯独满槽值游离在对象之外：想调遇敌频率（如把满槽从 100 收紧到 80 让战斗更密集）要改四个地方，还极易只改累计触发（world.js）漏改小地图（drawWorld.js）——实际遇敌频率变了小地图却还按旧刻度显示，满 80% 就触发战斗但读数只走到 80% 永远到不了 100%。
- 【修正：data.js 的 `ENCOUNTER` 对象新增 `full: 100` 为唯一真源（置于 calm 之后，注释同步说明，随原对象一同 export，零新增导出项）】`world.js` 累加上限改 `Math.min(ENCOUNTER.full, ...)`、触发判定改 `S.encGauge >= ENCOUNTER.full`；`view/drawWorld.js` import 列表加 ENCOUNTER，clamp 与刻度分母改读 `ENCOUNTER.full`。收益：调遇敌满槽/整体遇敌频率只改 data.js 一处、累计触发与小地图显示同步，绝无第二套口径；行为逐字不变（`ENCOUNTER.full` 仍为 100，累加 clamp、触发边界、小地图百分比读数与旧字面量逐值恒等），零遇敌/UI 回归。
- 【零回归面】未动遇敌槽机制本身——四个增减量（危险格 +10~18、喷泉 -25、其它可行走格 -6）逐字不变，`tickEncounter` 触发后 `S.encGauge = 0` 复位、Boss 区域强制遇敌、`drawWorld` 小地图色带配色/「⚠️ 危险逼近」70 线（预警高亮，独立语义，注释已注明不并入本常量）/「遇敌 N%」读数全部原样。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/存档。只加一个对象属性 + 改 4 处引用 + 1 处 import + 注释微调，零新增依赖、零新增 export。
- 验证：`node --check js/data.js js/world.js js/view/drawWorld.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.9 专项冒烟（/tmp/jrpg_smoke_v199_encfull.mjs）**9 项断言全过**——`ENCOUNTER.full` 导出且 = 100（与历史字面量逐值一致）、world 累加上限/触发判定与 drawWorld clamp/刻度分母四处均读 ENCOUNTER.full、world/drawWorld 遇敌槽语义裸「100」已清零（仅注释保留旧值说明）、累加 clamp 与触发边界 0..150×0..30 全扫与旧字面量逐值恒等。

## v19.8 受击视觉反馈时长单一数据源——三处裸 220 同读 HIT_FB_MS（纯显示·单一口径，与 v19.7 BIG_DMG 同一「战斗反馈数据化」家族——v19.7 收口「多大伤害算大额」后，「受击反馈持续多久」是战斗视觉反馈里最后一处同值三行互不引用的裸奔数值）

- 【`3` 同语义三处互不相关】受击视觉反馈时长「220ms」裸写三处：`battle.js` `attackMove` 的敌方闪红复位 `setTimeout(..., 220)`、`enemyAI.js` `enemyAct` 的我方闪红复位 `setTimeout(..., 220)`、`view/drawBattle.js` 的震屏衰减 `/ 220`（另有注释「220ms 衰减」）——三处同值互不引用，注释都把它当「受击反馈节奏」：想调反馈时长（如放慢到 280、或收紧到 180）要改三个地方，还极易只改闪红漏改震屏——闪红已熄灭震屏却还在抖（或反之），暴击/重击的受击反馈悄然分成两套节奏。
- 【修正：data.js 新增 `HIT_FB_MS = 220` 为唯一真源（置于 SHIELD_MULT 之后、宝箱块之前，紧邻「战斗反馈数据化」注释块，并加入 export）】`battle.js` / `enemyAI.js` 两处 `setTimeout` 改传 `HIT_FB_MS`，`drawBattle.js` 震屏衰减改 `(Date.now() - S.shake.t0) / HIT_FB_MS` 并更新注释，三模块 import 列表同步加 HIT_FB_MS。收益：调受击反馈节奏只改 data.js 一处、闪红与震屏同步，绝无第二套口径；行为逐字不变（`HIT_FB_MS` 仍为 220，三处时长与旧字面量逐值恒等），零战斗/UI 回归。
- 【零回归面】未动受击反馈机制本身——`enemy.hurt`/`hero.hurt` 闪红帧（sprites.js 的 hurt 红色罩）、`S.anim` 受击动画、`S.shake` 的 `pow: 4/3` 震屏强度分级与衰减曲线（`t/220` 同形）、变身全屏闪光 `S.flash` 的 400ms（v16.x 变身反馈，独立语义不动）、盾牌/中毒角标与蓄力光环的 `Date.now()%400`/`/320` 呼吸周期（独立动画体系不动）全部原样。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/存档。只新增一个常量 + 改 3 行时长 + 3 处 import + 1 处 export + 注释微调，零新增依赖。
- 验证：`node --check js/data.js js/battle.js js/enemyAI.js js/view/drawBattle.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.8 专项冒烟（/tmp/jrpg_smoke_v198_hitfb.mjs）**9 项断言全过**——`HIT_FB_MS` 导出且 = 220（与历史字面量逐值一致）、三模块均 import 引用、敌方/我方闪红复位与震屏衰减三行均读 HIT_FB_MS、三处可执行代码裸「220」已清零（仅注释保留旧值说明）、行为等价校验。

## v19.7 大额伤害阈值单一数据源——attackMove 浮字加粗与震屏同读 BIG_DMG（纯显示·单一口径，与 CRIT_RATE / CRIT_MULT / FLEE_SUCCESS 同一「战斗反馈数据化」家族——v19.6 收口蓄力光环后，「多大伤害算大额」是战斗视觉反馈里最后一处同值两行互不引用的裸奔数值）

- 【`1` 同函数内两行互不相关】`battle.js` `attackMove` 的「大额伤害」判定在相邻两行各写一个 `dmg >= 25`：浮字加粗（`addFx(..., dmg >= 25 || isCrit)` 传入 bold 参数）与震屏触发（`if (isCrit || dmg >= 25) S.shake = {...}`）——两行同值互不引用，注释自己都写着「≥25，与浮字加粗同阈值」：想调「多大伤害算大额」（如震屏更频繁放宽到 20、或更克制收紧到 30）要改两个地方，还极易只改震屏漏改加粗——加粗阈值与震屏阈值悄然脱钩，暴击外的中高伤要么只加粗不震、要么只震不加粗；且全库 grep 确认该「大额伤害」语义的裸 25 仅此两行。
- 【修正：data.js 新增 `BIG_DMG = 25` 为唯一真源（置于 CRIT_MULT 之后、石甲减伤块之前，紧邻「暴击」注释块，并加入 export）】`battle.js` 两行判定改读 `dmg >= BIG_DMG`，import 列表同步加 BIG_DMG。收益：调大额伤害阈值只改 data.js 一处、浮字加粗与震屏同步，绝无第二套口径；行为逐字不变（`BIG_DMG` 仍为 25，边界 24/25 两档加粗/震屏切换点与旧字面量逐值恒等），零战斗/UI 回归。
- 【零回归面】未动大额伤害机制本身——`addFx` 的 bold 参数、`S.shake` 的 `pow: isCrit ? 4 : 3` 震屏强度分级、220ms 衰减、浮字生命期 44 全部原样；普通战/技能/Boss 战的加粗与震屏触发条件逐字不变。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/存档。只新增一个常量 + 改 2 行判定 + export 1 处 + import 1 处，零新增依赖。
- 验证：`node --check js/data.js js/battle.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.7 专项冒烟（/tmp/jrpg_smoke_v197_bigdmg.mjs）**6 项断言全过**——`BIG_DMG` 导出且 = 25（与历史字面量逐值一致）、浮字加粗行与震屏行均引用 BIG_DMG、可执行代码裸「>= 25」已清零（仅注释保留旧值说明）、边界值全扫 10 组（dmg 1/24/25/26/60 × crit 两态）BIG_DMG 版与旧字面量逐值恒等、顺序（加粗在前/震屏在后）保持。

## v19.6 蓄力金色呼吸光环——主角本体 buff 可视反馈（体验·纯显示，蓄力状态从「右上角一行静态字」升级为角色身上的脉冲光环；与盾牌/中毒/灼烧/冻结/石甲角标同一「buff 可视化」体系——防御有盾牌角标、我方中毒有 ☠️ 角标、敌方灼烧/冻结/石甲各有角标，唯独蓄力这枚关系大招的 buff 缺角色身上的反馈）

- 【`1` buff 可视化不对称】战斗画面里「蓄力中」只有 drawBattle 右上角一行静态文字 `蓄力中 · 下击/技能×1.5`（且在敌方回合持蓄时该行仍在转角处、玩家视线在主角色身上）：防御有常驻盾牌角标、我方中毒有 ☠️ 角标（都带 400ms 呼吸脉冲）、敌方灼烧/冻结/石甲各有角标——唯独蓄力这一影响下一击 ×1.5 的关键 buff 没有任何角色本体信号，蓄着力进敌方回合后画面几乎看不出手里还捏着大招。
- 【修正：`view/drawBattle.js` 在 `drawHero(96,400,…)` 之后、名字/血条之前插入 v19.6 光环块】`hero.charge` 为真时给主角叠加一圈金色呼吸光环：径向渐变柔光（圆心 96,388、半径 56、随脉冲 0.10~0.28 透明度）+ 金色细环（半径 44、描边 2px、alpha 0.25~0.50）+ 顶部辉光点（在角色头顶 344 处、alpha 0.30~0.85）——三者同用 320ms 正弦周期 `0.5+0.5*sin` 呼吸（与盾牌/中毒角标的 `Math.floor(Date.now()/400)%2` 同一 `Date.now()` 动画体系）。收益：蓄力状态一眼可感、技能菜单/敌方回合/防御中持蓄都持续可见，与右上角文字标注双保险；纯显示、零结算变化。
- 【零回归面】未动蓄力机制本身——`battle.doCharge`（置 charge=true）、`rules.atkEstimate/skillEstimate`（×CHARGE_MULT 预览）、`battle.doAttack/doSkill`（爆发消耗）、技能菜单「·蓄力保留」/MP 行「蓄力×1.5」标注全部原样（本就同源）；`hero.charge=false` 时光环块整段跳过（守卫跳开、零绘制调用），普通战斗/未蓄力画面逐像素不变。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/存档。只改 view/drawBattle.js 一个文件、纯新增一段条件绘制，零新增依赖、零新增 export（复用已在 import 列表的 CTX / CHARGE_MULT）。
- 验证：`node --check js/view/drawBattle.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.6 专项冒烟（/tmp/jrpg_smoke_v196_chargeglow.mjs）**4 项断言全过**——CTX 桩执行光环块 `charge=true` 产生 2 次填充（柔光+辉光点）+1 次描边（细环）+3 次 arc 且全部 rgba alpha 合式（0..1）、`charge=false` 守卫跳开零绘制（原行为不变）、引用检查仅用 CTX/Date.now 零新增依赖、位置检查光环块在 drawHero 之后绘制（角色之上）。



- 【`1` 同公式两处互不相关】`battle.js` `threatWarn`（开战威胁预警）手写裸公式估双方基础伤害：`playerHit = Math.max(1, hero.atkMax * 2 - enemy.def)`、`enemyHit = Math.max(1, enemy.atk * 2 - hero.defMax)`——而全库唯一伤害公式真源是 `rules.cmdDmg`（`raw = max(1, atk×2-def)`，无浮动档时恒等于裸公式）：伤害预览（`atkEstimate`/`skillEstimate`）与敌方攻击（`enemyAI.enemyAct` 的 `cmdDmg(enemy.atk, hero.defMax, mult)`）早已同读此源，唯独威胁预警是最后一份把 `atk×2-def` 抄成裸字面量的代码——想调伤害公式（如 atk×2 改 1.9）要改 rules.js + battle.js 两处，还极易只改结算漏改预警，实际伤害公式变了威胁预警却还按旧公式估、亮起的「⚠️ 强敌」悄然失真。
- 【修正：`battle.js` `threatWarn` 两行改调 `cmdDmg(hero.atkMax, enemy.def, 1, false)` / `cmdDmg(enemy.atk, hero.defMax, 1, false)`（cmdDmg 本就在 import 列表，零新增依赖）】收益：调伤害公式只改 rules.cmdDmg 一处，预览/敌方攻击/威胁预警三端同源，绝无第二套口径；行为逐字不变——双方攻防恒为整数（baseStats 线性式、装备 atk/def 整数、MON_BASE 整数缩放、地图/困难倍率均 Math.round），`Math.round(整数)=整数`，`cmdDmg(...,1,false)` 与裸公式对任意整数输入逐值恒等。
- 【零回归面】未动威胁等级判定本身——`threat` 的累进规则（isElite +1 / 5 刀内可击杀 +1 / 敌方两刀致死 +2）与三档文案（「明显强于你」「有些棘手」「无」）以及 Boss/终焉/试炼的固定预警分支全部原样；`cmdDmg` 随机浮动档（rollVariance）未引入（传 false，估算仍为确定值）。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/存档。只改 2 行调用 + 扩注释，零新增 export。
- 验证：`node --check js/battle.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.5 专项冒烟（/tmp/jrpg_smoke_v195_threat.mjs）**7 项断言全过**——200×140 整数域全扫 `cmdDmg(atk,def,1,false) ≡ max(1,atk×2-def)`、弱敌开战无「⚠️」、强敌开战出「⚠️ 强敌」、Boss 开战固定「旧灯卫的影子」预警、battle.js 可执行代码裸 `* 2 - enemy.def / * 2 - hero.defMax` 已清零（仅注释保留旧式说明）、cmdDmg 引用在位。

## v19.4 战斗石甲受击减伤标注单一数据源——drawBattle 石甲角标「受击-40%」改由 SHIELD_MULT 推导（纯显示·单一口径，与 SHIELD_MULT / 帮助页「石心魔像·石甲」/ enemyAI 凝甲提示同一「石甲数据化」家族——v15.2 收口结算/预览/凝甲提示、v16.7 收口帮助页石甲行、v19.0 收口石甲帮助页触发线/层数后，战斗画面石甲角标是 SHIELD_MULT 家族最后幸存的裸奔数值）

- 【`1` 结算派生值互不相关】战斗画面敌方石甲角标 `🪨 石甲×N（受击-40%）` 的减伤百分比裸写「-40%」，而它的唯一真源实为 `SHIELD_MULT = 0.6`（石甲命中把最终伤害再 ×0.6 取整、保底 1）：同一减伤率在 `enemyAI.js` 凝甲提示（`Math.round((1 - SHIELD_MULT) * 100)%`）与 data.js 帮助页「石心魔像·石甲」（`-Math.round((1 - SHIELD_MULT) * 100)%`）早已同读此源，唯独战斗画面角标是 v15.2 收口时漏网的裸字面量——想调石甲强度（如放宽到 0.5 → 减伤 50%）要改结算/提示还极易只改结算漏改角标，实际减伤变了战斗画面却还报旧值「-40%」。
- 【修正：`view/drawBattle.js` 石甲角标改拼 `` 🪨 石甲×${enemy.shield}（受击-${Math.round((1 - SHIELD_MULT) * 100)}%） ``（import 列表同步加 SHIELD_MULT）】收益：调石甲强度只改 data.js 的 SHIELD_MULT 一处、角标/凝甲提示/帮助页/结算四端同步，绝无第二套口径；行为逐字不变（`1 - 0.6`×100 = 40，文案 `（受击-40%）` 原样），零战斗/UI 回归。
- 【零回归面】未动石甲机制本身——`battle.attackMove` 减伤（×SHIELD_MULT 取整保底 1）、`rules.withShield` 预览还原、`enemyAI` 凝甲结算与提示、帮助页标注全部原样（本就同源）；石甲角标的存在条件（`enemy.shield > 0` 才绘制）与居右位置（x=620）逐字不变。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/存档。只改 1 行角标文案 + import 1 处，零新增依赖、零新增 export。
- 验证：`node --check js/view/drawBattle.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.4 专项冒烟（/tmp/jrpg_smoke_v194_shieldbadge.mjs）**13 项断言全过**——`SHIELD_MULT` 推导 100×(1-0.6)=40、石心魔像 shield>0 时角标绘制且「受击-40%」由常量推导逐字一致（石甲×3 / 石甲×4 两档均验）、文案与历史字面量逐字相同、shield=0 不绘制（原行为）、洞窟领主石甲×2 角标联动、多类型敌人绘制无异常、源码 grep 确认 drawBattle 导入含 SHIELD_MULT 且可执行代码裸「受击-40%」已清零（仅注释保留旧值说明）。

## v19.3 幽冥魔王最大 HP 单一数据源——BOSS.bossHpMax 改读 BOSS_BASE.hpMax（机制·单一口径，与 v18.9 BOSS_BASE 同一「三强敌基础数值数据化」家族——v18.9 收口主线/试炼兵力时此值以裸 140 留存，本次收官）

- 【`1` 同对象内两处互不相关】`data.js` 的 `BOSS` 常量（幽冥魔王主线版）里 `bossHpMax:140` 是硬编码字面量，而它的真源 `BOSS_BASE.hpMax` 同为 140（BOSS_BASE 就是 v18.9 单设的幽冥魔王兵力基准表）——同一数值两处互不引用：想调幽冥魔王最大 HP（如提到 160）要改两处，还极易只改 BOSS_BASE 漏改 bossHpMax（或反之），两处悄然脱钩；且该字段全库无任何读取方（主线判定/必掉圣光之剑/暴毙等全部由 `isBoss` 驱动，`bossHpMax` 仅是 BOSS 对象上的既有元数据——v18.9 专项冒烟断言「试炼版不带 bossHpMax」把它当作主线专属旗标保留校验），是 BOSS_BASE 家族里最后一处与真源脱钩的残留字面量。
- 【修正：`BOSS` 构造行改为 `bossHpMax: BOSS_BASE.hpMax`（同文件同作用域，直接可取）】收益：调幽冥魔王最大 HP 只改 data.js 的 BOSS_BASE.hpMax 一处，bossHpMax 自动跟随，绝无第二套口径；行为逐字不变（现两值同为 140，合并后对象逐键逐值不变——专项冒烟 17 键逐键比对通过），零 UI/战斗回归。
- 【零回归面】未动战斗机制本身——`isBoss` 驱动的全部主线判定（战前威胁/徽记/必掉圣光之剑/bossDefeated/banner）、`rules.js` `BOSS_DEFS` 直读 BOSS、`world.js` 祭坛 `deep(BOSS)` 遇敌、`SPECIES['幽冥魔王']` 经 withSpecies 并入的 phase2/acts/resist/tag/lv 全部原样。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/存档。只改 1 行构造表达式（+3 行注释说明），零新增依赖、零新增 export（BOSS_BASE 仍不对外导出）。
- 验证：`node --check js/data.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.3 专项冒烟（/tmp/jrpg_smoke_v193_bosshpmax.mjs）**13 项断言全过**——`BOSS.bossHpMax`=140 且与 `BOSS.hpMax` 恒等（同源推导、永不漂移）、合并后 17 键逐键与旧字面量一致（含 SPECIES 并入的 lv/acts/phase2）、试炼复刻 RUSH_BOSSES[0] 与 CAVE_BOSS/TRUE_BOSS 均不带 bossHpMax（v18.9 契约不变）、`isBoss` 专属旗标保留、phase2 原样并入、构造行可执行代码引 `BOSS_BASE.hpMax` 且裸 `bossHpMax:140` 已清零（仅注释保留旧值说明）。

## v19.2 图鉴全收集金币奖励单一数据源——applyAchievements 的「记忆守护者」999 金 发奖/横幅文案两处同读 PERFECTION_GOLD（机制·单一口径，与 RICH_GOLD / SCHOLAR_GOAL / LUCKY_GOAL / HUNT_GOAL / LVL5_GOAL / LVL10_GOAL / FIRSTBLOOD_GOAL 同一「成就阈值数据化」家族——v18.7 收口 FIRSTBLOOD_GOAL 后 ACH_LIST 门槛已全部单源，本次收口的是成就触发后的专享奖励里残存的裸奔数字）

- 【`2` 同分支内两处互不相关】成就「记忆守护者」图鉴全收集的专享奖励：`hero.js` `applyAchievements` 的 perfection 分支里，发奖数额（`hero.gold += 999`）与解锁横幅文案（「🏆 图鉴收集完成！额外奖励 999 金币！」）各写一份 999——同分支内互不引用：想调奖励（如改成 500 金）要改两处，还极易只改发奖漏改文案，实际到账与横幅报数悄然脱钩；且全库无任何现成源可借鉴（TRUE_BONUS_GOLD=300 是终焉之神专属、RICH_GOLD=500 是「小富翁」持有门槛，均非图鉴全收集奖励），故必须单设常量——v18.x 系列收口 ACH_LIST 判定/描述/进度的门槛后，全库与成就相关的数值中最后一段「同对象内互不引用」的裸奔数字。
- 【修正：data.js 新增 `PERFECTION_GOLD = 999` 为唯一真源（置于 FIRSTBLOOD_GOAL 之后、药水恢复量块之前，紧邻「成就阈值」注释块）】`hero.js` `applyAchievements` 的发奖（`gold += PERFECTION_GOLD`）与横幅文案（模板串「额外奖励 ${PERFECTION_GOLD} 金币！」）两处同读此源，import 列表同步加 PERFECTION_GOLD，并加入 export。收益：调全收集奖励只改 data.js 一处、到账与横幅同步，绝无第二套口径；行为逐字不变（`PERFECTION_GOLD` 仍为 999，到账 999 金、横幅文案原样），零 UI/战斗回归。
- 【零回归面】未动成就机制本身——`ACH_LIST` 17 条逐字不变（perfection 条判定/描述/进度本就读 BESTIARY_TARGET.length）、`unlockedAchievements` 判定流程、`hero.gold` 记账原样。未动任何掉落/经验/金币曲线/难度/技能/支线/存档。只新增一个常量 + 改 2 行（发奖/文案）+ import/export 各 1 处，零新增依赖。
- 验证：`node --check js/data.js js/hero.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.2 专项冒烟（/tmp/jrpg_smoke_v192_perfectgold.mjs）**12 项断言全过**——`PERFECTION_GOLD` 导出且为 999、全收集时发奖到账 100+999、横幅文案与常量模板串逐字一致、文案把常量替换后无残留裸 999、未全收集不发奖且无专享横幅、hero.js 可执行代码裸 `999` 已清零（仅注释保留旧值说明）、发奖行与文案行均含常量标识符、同族成就阈值常量（RICH_GOLD/SCHOLAR_GOAL/LUCKY_GOAL/HUNT_GOAL/LVL5_GOAL/LVL10_GOAL/FIRSTBLOOD_GOAL）未动、ACH_LIST 17 条结构/描述不变、perfection 判定（全收集 true / 空图鉴 false）不受影响。

## v19.1 技能领悟等级上界单一数据源——skillXpHint「距下一技能」扫描上界改读 MAX_LEARN_LV（= LEARN_AT 最大领悟级，机制·单一口径，与 v17.7 LEARN_AT 单一数据源同一「技能表数据化」家族——v17.7 收口起始技能/升级领悟后，全库与技能领悟表相关的最后一处裸奔数值）

- 【`1` 隐蔽的脱钩上界】`hero.skillXpHint` 的「距下一技能还差 N 经验」提示（状态页/技能菜单展示）用裸 `8` 作扫描上界（`for (let lv = (hero.level||1)+1; lv <= 8; lv++)`）——这个 8 是当年「最末领悟级 7 + 1」的随手值，与技能领悟表 `LEARN_AT`（`{1:火焰斩,3:冰霜击,4:治愈术,5:雷鸣,7:陨石术}`，最大领悟级 7）互不相关：想新增 9 级以上的技能（或往领悟表增删更高的领悟级）时，上界会悄然过期——新技能永远进不了「距下一技能」提示，玩家升到 9 级前毫无预告；且全库 grep 确认裸 `8` 仅此一处（其余 8 均与等级无关），但它是「写死值取代真源」的典型，收敛到领悟表推导是唯一正确归宿（v17.7 只收口了「起始技能/升级领悟」两处，此上界当时未纳入、裸 8 留存至今）。
- 【修正：data.js 新增 `MAX_LEARN_LV = Math.max(...Object.keys(LEARN_AT).map(Number))` 为唯一真源（置于 learnsAt 之后、经验曲线块之前，独立注释块，并加入 export）】`hero.skillXpHint` 的扫描上界改读 `lv <= MAX_LEARN_LV`，import 列表同步加 `MAX_LEARN_LV`。收益：技能领悟表增删任意等级（含 9 级以上），「距下一技能」提示自动跟界，绝无第二套口径；行为逐字不变（`MAX_LEARN_LV` 现为 7，扫描 1..7 与旧 1..8 完全等价——`learnsAt(8)` 本就为 null、多扫的一级从不出结果）。
- 【零回归面】未动技能本身——`LEARN_AT` / `learnsAt` / `hero.checkSkills` 升级领悟 / `core.newGame` 建档起始技能逐字原样（本就同源）、`skillXpHint` 的经验预估公式（XP_GROW/XP_INIT）与返回值结构原样、状态页/技能菜单渲染只消费返回对象。未动任何掉落/经验/金币曲线/难度/技能效果/支线/成就/存档。只新增一个派生常量 + 改 1 个循环上界 + export 1 处 + import 1 处，零新增依赖、零 UI/战斗回归。
- 验证：`node --check js/data.js js/hero.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；专项冒烟（node ESM 直连）**4 项场景断言全过**——`MAX_LEARN_LV` 导出且 = LEARN_AT 最大领悟级 7（与 learnsAt 采样推导一致）、Lv1/Lv3/Lv5/Lv12 四种状态下「距下一技能」结果与旧上界 8 完全逐字相同（含 remain 经验）、全学会场景均返回 null、Lv12 超越旧上界仍正确返回 null。

## v19.0 帮助页「石心魔像·石甲」标注单一数据源——「至多 3 层」「血量过半后」改读 SPECIES 石心魔像 shield 招（机制·单一口径，与 SHIELD_MULT / HEAL_PCT / PHASE2_AT 同一「行招表数据化」家族——v14.9 收口 SHIELD_MULT 时声明保持原样的裸奔文案，本次收口收尾）

- 【`2` 帮助页一行内两处互不相关】帮助页「石心魔像·石甲」条：`血量过半后凝结石甲（至多 3 层）：每层使下一次攻击伤害 -40%`——其中「血量过半后」（= hpBelow 0.5）与「至多 3 层」（= maxShield 3）是裸字面量，而这两个数值的真正唯一真源是 `SPECIES['石心魔像'].acts` 的 shield 招（`maxShield:3,hpBelow:0.5`），且 `view/drawBattle.js` 的「敌方招数一览」早已动态读 `a.hpBelow`/`a.maxShield` 渲染「·血<50%时」「·至多3层」——帮助页与行招表两处互不相关：想调石甲强度（如层数上限提到 4、触发线改 0.4）要改两处、还极易只改行招表漏改帮助页，行招表改了帮助页却还报旧值；且该条内的 -40% 部分早已读 SHIELD_MULT，唯独触发线与层数是残存裸奔数值（v14.9 收口 SHIELD_MULT 时声明「此处保持原样」、v18.9 之后行招表数据化家族的最后一块短板）。
- 【修正：data.js 新增 `GOLEM_SHIELD_ACT = (SPECIES['石心魔像'].acts || []).find(a => a.type === 'shield') || {}` 为唯一真源（置于 SPECIES 之后、MON_BASE 之前，独立注释块）；帮助页「石心魔像·石甲」句改读模板串 `血量低至 ${hpBelow×100}% 后凝结石甲（至多 ${maxShield} 层）：每层使下一次攻击伤害 -40%`】收益：调石甲触发线/层数只改 SPECIES 石心魔像 shield 招一处，帮助页与战斗招数一览同步，绝无第二套口径；行为逐字不变（hpBelow=0.5 → 「血量低至 50% 后」、maxShield=3 → 「至多 3 层」，与旧文案「血量过半后…（至多 3 层）」语义逐字一致、数值逐字相同），零 UI/战斗回归。drawBattle 招数一览本就动态读行招表、无需改动。
- 【零回归面】未动石甲机制本身——`validator.enemyAct` 凝甲（`maxShield` 封顶、`hpBelow` 触发线）、`battle.attackMove` 石甲减伤（SHIELD_MULT）、`rules.withShield` 预览、`drawBattle` 石甲角标/招数一览全部原样（本就与行招表同源）。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/存档。只新增一个派生常量 + 改 1 行帮助页文案，零新增依赖、零新增 export（GOLEM_SHIELD_ACT 仅为装载期渲染帮助页所用，无需对外导出）。
- 验证：`node --check js/data.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v19.0 专项冒烟（/tmp/jrpg_smoke_v19_shieldact.mjs）**6 项断言全过**——帮助页存在「石心魔像·石甲」条目、SPECIES 石心魔像 shield 招 maxShield=3 / hpBelow=0.5、渲染文本与历史文案「血量低至 50% 后凝结石甲（至多 3 层）：每层使下一次攻击伤害 -40%」逐字一致、改表（maxShield=4/hpBelow=0.4）后重装载帮助页文案联动为「40%/4 层」（证明真源联动）、源码可执行代码无裸「至多 3 层」/「血量过半后」（仅注释保留旧值说明）。

## v18.9 三强敌基础数值单一数据源——主线 BOSS/CAVE_BOSS/TRUE_BOSS 与试炼场 RUSH_BOSSES 的兵力六项同读 BOSS_BASE / CAVE_BOSS_BASE / TRUE_BOSS_BASE（机制·单一口径，与 RICH_GOLD / SAVE_SLOTS / POTION_CAP 同一「数值数据化」家族——v18.8 存档槽收口后，三强敌「主线一份 + 试炼一份」的两处兵力是当前最显眼的同值重复）

- 【`3` × 两处互不相关】三强敌（幽冥魔王 hp:140·atk:15·def:6、洞窟领主 hp:110·atk:16·def:10、终焉之神 hp:260·atk:22·def:13）的兵力数值各硬编码在两处：主线常量 `BOSS` / `CAVE_BOSS` / `TRUE_BOSS` 与试炼场复刻 `RUSH_BOSSES` 数组（试炼三连战的第 1/2/3 关就是这三强敌的原样兵力，仅 xp/gold 另计、加 isRush）——同一数值两处互不引用：想调强敌兵力（如把幽冥魔王 atk 提到 17）要改两处，还极易只改主线漏改试炼，两处强度悄然脱钩；且全库无任何现成源可借鉴（`SPECIES` 只存形态/弱点/动作等形态数据、`ELITE_GOLEM` 是独立的精英基准，均不含三强敌兵力），故必须单设基准表。
- 【修正：data.js 新增 `BOSS_BASE` / `CAVE_BOSS_BASE` / `TRUE_BOSS_BASE` 为唯一真源（置于 withSpecies 之后、`BOSS` 之前，独立注释块），各含 name/hp/hpMax/atk/def/color 六项】主线三常量改为 `withSpecies({...BASE, xp/gold/专属旗标})` 同源构建（`BOSS` 补 xp:150·gold:300·isBoss·bossHpMax、`CAVE_BOSS` 补 xp:120·gold:200·isElite·isCaveBoss、`TRUE_BOSS` 补 xp:400·gold:600·isTrue·isElite）；`RUSH_BOSSES` 三条改为 `withSpecies({...同源BASE, xp:60/60/90·gold:0·isRush})`。收益：调三强敌兵力只改 data.js 对应 BASE 一处、主线与试炼同步，绝无第二套口径；行为逐字不变（合并后对象与旧字面量逐键逐值一致——专项冒烟 17 项断言逐键比对通过，`isBoss`/`bossHpMax`/`isCaveBoss`/`isTrue` 等专属旗标仅存在于主线版、试炼版不带，不触发 bossDefeated/红字伤害/必掉剑 等主线专属判定），零 UI/战斗回归。
- 【零回归面】未动战斗机制本身——`SPECIES` 三强敌的形态/弱点/抗性/动作/相位二仍经 withSpecies 原样并入（`phase2`/`resist`/`acts`/`tag` 均不变）、`rules.js` `BOSS_DEFS` 直读 BOSS/CAVE_BOSS/TRUE_BOSS 照旧、`battle.js` 试炼流程（isRush 判定/RUSH_RECOVER 恢复/经验另计）、`drawBattle.js` 试炼进度与 Boss 栏、`sprites.js` 体型缩放全部原样。未动任何掉落/经验/金币曲线/难度/技能/支线/成就/存档。只新增三个基准常量 + 改 6 行构建表达式 + 删 3 行冗余字面量，零新增依赖。
- 验证：`node --check js/data.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v18.9 专项冒烟（/tmp/jrpg_smoke_v189_bossbase.mjs）**17 项断言全过**——三个主线 Boss 与三条试炼复刻合并后对象逐键逐值等于旧字面量（含 SPECIES 并入的 phase2/resist/acts/tag）、主线与试炼 hp/atk/def 同源、试炼版不带 isBoss/bossHpMax/isCaveBoss/isTrue（不触发暴毙/必掉剑等主线专属判定）、试炼 xp/gold 减值逐字、主线 xp/gold 原值、`BOSS` 总键数与旧字面量一致（无多无少）。

## v18.8 存档槽数量 3 单一数据源——SAVE_SLOTS 收口「标题选槽主键 / 选槽条 / 快捷键一览 / 帮助文案」四处（机制·单一口径，与 SAVE_SLOTS 同名的隔壁常量无关，属 POTION_CAP / MUSHROOM_GOAL / INN_PRICE 同一「数值数据化」家族）

- 【`4` 四处互不相关】存档槽数量 3 硬编码在：`main.js` 标题页选槽主键（`e.key==='1'/'2'/'3'` 三条分支各设 `S.curSaveSlot`，想加档要加分支 + 还极易只加一处漏另几处）；`view/menus.js` 标题页选槽条（`[1,2,3].map(...)` 循环索引）；`view/menus.js` 标题页快捷键一览（字符串字面量「按 1 / 2 / 3 选择存档槽」）；`data.js` `HELP_PAGES`（「标题按 1/2/3 选择 · L 读档」）。四处互不引用：把档数加到 4 要改四处，且文案极易只改一半（界面选槽条多了 4 号槽、帮助/快捷键却还写 1/2/3）；且全库无任何现成源可借鉴（`core.js` 的 `saveKey/hasSlot/slotPreview/saveGame/load` 全部按「传入槽号」（`SAVE_SLOTS` 前的裸槽号参数）记账，从不迭代 1..3——纯 UI/分派层的重复），故必须单设常量。
- 【修正：data.js 新增 `SAVE_SLOTS = 3` 为唯一真源（置于药水恢复量块之后、`SPECIES` 之前，独立注释块）】四处同读：`main.js` 标题选槽键改为 `/^[1-9]$/` + `Number(e.key) <= SAVE_SLOTS` 数据驱动分派；`view/menus.js` 选槽条改为 `Array.from({length:SAVE_SLOTS},(_,i)=>i+1)` 生成、快捷键一览改为模板串 `按 ${slotNums.join(' / ')}`；`data.js` `HELP_PAGES` 存档槽条改为 `'标题按 1/2/' + SAVE_SLOTS + ' 选择 · L 读档'`，并加入 export。收益：调档数只改 data.js 一处、四处同步，绝无第二套口径；行为逐字不变（`SAVE_SLOTS` 仍为 3，选槽条「槽1 ▶槽2◀ 槽3」、快捷键「按 1 / 2 / 3 选择存档槽」、帮助「标题按 1/2/3 选择」三处文案原样），零 UI 回归。
- 【零回归面】未动存档机制本身——`core.js` 的 `saveKey/hasSlot/slotPreview/saveGame/load/resetRun` 逐字不变（本就按槽号参数化、无 1..3 迭代）、`view/hud.js` 「槽N」展示原样、`view/menus.js` 读档/续档流程（`hasSave/slotPreview/curSaveSlot`）原样、`state.js` `curSaveSlot` 字段原样。未动任何掉落/经验/金币曲线/难度/技能/支线/成就。只新增一个常量 + 改两处 UI 生成逻辑 + 改一处键分派 + 改一处帮助文案 + export 1 处，零新增依赖。
- 验证：`node --check js/data.js js/view/menus.js js/main.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v18.8 专项冒烟（/tmp/jrpg_smoke_v188_saveslots.mjs）**29 项断言全过**——`SAVE_SLOTS` 导出且为 3、帮助文案逐字、选槽键谓词 1/2/3 命中而 4/5/9/0/字母/Enter 不命中（原有行为不变）、`slotNums` 生成 [1,2,3] 且 join 「1 / 2 / 3」、选槽条格式逐字、源码 grep 确认可执行代码裸 `curSaveSlot = 1/2/3` 三分支 / `[1,2,3]` / 「按 1 / 2 / 3 选择存档槽」/「标题按 1/2/3 选择」已清零（仅注释保留旧值说明）、export 含常量、同族常量（POTION_CAP/MUSHROOM_GOAL）未动。

## v18.7 成就阈值单一数据源——「初露锋芒」1 判定/进度两处同读 FIRSTBLOOD_GOAL（机制·单一口径，与 RICH_GOLD / SCHOLAR_GOAL / LUCKY_GOAL / HUNT_GOAL / LVL5_GOAL / LVL10_GOAL 同一「成就阈值数据化」家族——v18.5 收口 hunt10 时注释已预告同计数源的 firstblood 属再下批对象、当时刻意保留其裸 1，本次收口后 ACH_LIST 全部数值型门槛一律单源化）

- 【`2` 同一条目内两处互不相关】「初露锋芒」成就：累计赢得 1 场战斗。这个 1 硬编码在 `data.js` `ACH_LIST` 该条的判定（`ok` 的 `>= 1`）、进度（`prog` 的 `X/1`）两处——同对象内互不引用：想调门槛（如放宽到 3 场）要改两处，还极易只改判定漏改进度，实际达标线变了界面却还标「/1」；且全库无任何现成源可借鉴（陪跑同计数源的 hunt10 已有 `HUNT_GOAL`，但那是 10 场的独立门槛，无 1 场常量），故必须单设常量——正是 v18.5 注释里预告的下一个收口对象（「同计数源 firstblood 的裸 1 属再下批对象刻意保留」）。注：该条描述 d「赢得第一场战斗」无数字、无需读数，故只收口判定/进度两处，与其余各条「三处同读」的结构略有不同（事件型 9 条则本无 prog）。
- 【修正：data.js 新增 `FIRSTBLOOD_GOAL = 1` 为唯一真源（置于 LVL10_GOAL 之后、药水恢复量块之前，紧邻「成就阈值」注释块）】`ACH_LIST` 的 firstblood 条 `ok`（`>= FIRSTBLOOD_GOAL`）、`prog`（`/${FIRSTBLOOD_GOAL}`）两处同读此源，并加入 export。收益：调「初露锋芒」门槛只改 data.js 一处、判定/进度同步，绝无第二套口径；行为逐字不变（`FIRSTBLOOD_GOAL` 仍为 1，文案原样），零 UI 回归。
- 【零回归面】未动成就机制本身——`ACH_LIST` 其余 16 条逐字不变（事件型 9 条本无 prog、数值型余 7 条各自取已有常量）、`view/menus.js` 成就页只读 `ok/name/d/prog`（`解锁 X/${ACH_LIST.length}` 照旧）、`rules.unlockedAchievements` 判定流程、胜负计数 `totalWins` 原样。未动任何掉落/经验/金币曲线/难度/技能/支线/存档。只新增一个常量 + 改一个条目（1 行）+ export 1 处，零新增依赖。
- 验证：`node --check js/data.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v18.7 专项冒烟（/tmp/jrpg_smoke_v187_firstblood.mjs）**36 项断言全过**——`FIRSTBLOOD_GOAL` 导出且为 1、firstblood 判定逐字（0 胜未达标 / 1·2 胜达标 / 无 totalWins 兜底 false / null 明确未达标）、`prog` 0/1·1/1·5/1·12/1 逐字、`d` 与旧字面量「赢得第一场战斗」逐字一致、`ok/prog.toString()` 各含且各恰 1 处 `FIRSTBLOOD_GOAL` 标识符、源码 firstblood 行恰含 2 处常量且可执行代码裸 `>=1` / `/1` 已清零（仅注释保留旧值说明）、export 含常量、同族常量（RICH_GOLD/SCHOLAR_GOAL/LUCKY_GOAL/HUNT_GOAL/LVL5_GOAL/LVL10_GOAL）未动、抽验 `hunt10/lucky/lvl5/lvl10/rich/scholar` 判定不受影响、`ACH_LIST` 17 条结构不变（数值型 8 条含 prog、事件型 9 条无 prog）。

## v18.6 成就阈值单一数据源——「独当一面」5 与「守灯者」10 的双等级阈值同族收口（机制·单一口径，与 RICH_GOLD / SCHOLAR_GOAL / LUCKY_GOAL / HUNT_GOAL 同一「成就阈值数据化」家族——v18.4 注释已预告 lvl5/lvl10 的裸 5/10 属下批对象、当时刻意保留，本次一并收口同属等级口径的两条）

- 【`6` 两条目各自内部三处互不相关】「独当一面」成就：等级达到 5 级；「守灯者」成就：等级达到 10 级。这两个门槛分别硬编码在 `data.js` `ACH_LIST` 各自条目的判定（`ok` 的 `level>=5` / `level>=10`）、描述（`d` 的「等级达到 5 级」/「等级达到 10 级」）、进度（`prog` 的 `X/5` / `X/10`）三处——同对象内互不引用：想调门槛（如守灯者放宽到 12 级）要改三处，还极易只改判定漏改文案，实际达标线变了界面却还标「/10」；且全库无任何现成源可借鉴（等级上限仅由 `baseStats` / `XP_GROW` 曲线隐含，无成就门槛常量），故必须单设常量。两条同为等级口径、结构逐字同形，故一并收口为同一批次。
- 【修正：data.js 新增 `LVL5_GOAL = 5` 与 `LVL10_GOAL = 10` 为唯一真源（置于 HUNT_GOAL 之后、药水恢复量块之前，紧邻「成就阈值」注释块）】`ACH_LIST` 的 lvl5 条 `ok`（`level>=LVL5_GOAL`）、`d`（模板串「等级达到 ${LVL5_GOAL} 级」）、`prog`（`/${LVL5_GOAL}`），lvl10 条同型三处，并加入 export。收益：调等级门槛只改 data.js 一处、判定/描述/进度同步，绝无第二套口径；行为逐字不变（`LVL5_GOAL` 仍为 5、`LVL10_GOAL` 仍为 10，两条文案原样），零 UI 回归。
- 【零回归面】未动成就机制本身——`ACH_LIST` 其余 15 条逐字不变（`firstblood` 的裸 1 与 v18.5 同一延续策略、本次刻意保留为再下批对象）、`view/menus.js` 成就页只读 `ok/name/d/prog`（`解锁 X/${ACH_LIST.length}` 照旧）、`unlockedAchievements` 判定流程、存档等级字段原样。未动任何掉落/经验/金币曲线/难度/技能/支线/存档。只新增两个常量 + 改两个条目（各 1 行）+ export 1 处，零新增依赖。
- 验证：`node --check js/data.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v18.6 专项冒烟（/tmp/jrpg_smoke_v186_lvlgoal.mjs）**32 项断言全过**——`LVL5_GOAL`/`LVL10_GOAL` 导出且为 5/10、lvl5 判定逐字（4 级未达标 / 5·6 级达标 / 无 level 兜底 false）、`prog` 1/5·3/5·5/5·8/5 与 1/10·7/10·10/10·15/10 逐字、`d` 与旧字面量「等级达到 5 级」/「等级达到 10 级」逐字一致、`ok/prog.toString()` 各含各自常量标识符、源码两条目行为均为模板串（`${LVL5_GOAL}`/`${LVL10_GOAL}` 各恰 2 处 : d/prog，ok 为裸标识符判定）、源码 grep 确认可执行代码裸 `>=5` / `/5` / `等级达到 5 级`、`>=10` / `/10` / `等级达到 10 级` 已清零（仅注释保留旧值说明）、export 含两常量、抽验 `rich/scholar/lucky/hunt10/firstblood` 判定不受影响、`ACH_LIST` 17 条结构不变。firstblood 的裸 1 属再下批对象刻意保留。


## v18.5 成就阈值单一数据源——「驱雾十战」10 判定/描述/进度三处同读 HUNT_GOAL（机制·单一口径，与 RICH_GOLD / SCHOLAR_GOAL / LUCKY_GOAL 同一「成就阈值数据化」家族——v18.4 注释已预告的 hunt10 属下批对象，当时刻意保留其裸 10）

- 【`3` 同一条目内三处互不相关】「驱雾十战」成就：累计讨伐 10 只魔物。这个 10 硬编码在 `data.js` `ACH_LIST` 该条的判定（`ok` 的 `>= 10`）、描述（`d` 的「累计讨伐 10 只魔物」）、进度（`prog` 的 `X/10`）三处——同对象内互不引用：想调门槛（如放宽到 15 只）要改三处，还极易只改判定漏改文案，实际达标线变了界面却还标「/10」；且全库无任何现成源可借鉴（累计讨伐仅 `totalWins` 计数、`view/menus.js` 只展示当前值，无成就门槛常量），故必须单设常量——正是 v18.4 注释里预告的下一个收口对象（「lvl5/lvl10/hunt10/firstblood 的裸 5/10/1 属分批收口的下批对象刻意保留」）。
- 【修正：data.js 新增 `HUNT_GOAL = 10` 为唯一真源（置于 LUCKY_GOAL 之后、药水恢复量块之前，紧邻「成就阈值」注释块）】`ACH_LIST` 的 hunt10 条 `ok`（`>= HUNT_GOAL`）、`d`（模板串「累计讨伐 ${HUNT_GOAL} 只魔物」）、`prog`（`/${HUNT_GOAL}`）三处同读此源，并加入 export。收益：调「驱雾十战」门槛只改 data.js 一处、判定/描述/进度同步，绝无第二套口径；行为逐字不变（`HUNT_GOAL` 仍为 10，文案原样），零 UI 回归。
- 【零回归面】未动成就机制本身——`ACH_LIST` 其余 16 条逐字不变（`firstblood` 的裸 1 与 `lvl5`/`lvl10` 的裸 5/10 同属下批对象、刻意保留未纳入本次以控制改动面，`lucky`/`rich`/`scholar`/`perfection` 已是模板串继续原样）、`view/menus.js` 成就页只读 `ok/name/d/prog`（`解锁 X/${ACH_LIST.length}` 照旧）、`rules.unlockedAchievements` 判定流程、胜负计数 `totalWins` 原样。未动任何掉落/经验/金币曲线/难度/支线/存档。只新增一个常量 + 改一个条目（1 行）+ export 1 处，零新增依赖。
- 验证：`node --check js/data.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v18.5 专项冒烟（/tmp/jrpg_smoke_v185_huntgoal.mjs）**28 项断言全过**——`HUNT_GOAL` 导出且为 10、hunt10 判定逐字（9 只未达标 / 10·11 只达标 / 无 totalWins 兜底 false / totalWins=0 明确未达标）、`prog` 0/10·3/10·10/10·15/10 逐字、`d` 与旧字面量「累计讨伐 10 只魔物」逐字一致、`ok/prog.toString()` 各含且各恰 1 处 `HUNT_GOAL` 标识符、源码 hunt10 行为 `${HUNT_GOAL}` 模板串且无裸「累计讨伐 10 只魔物」、抽验 `firstblood/lucky/lvl5/lvl10/rich/scholar/perfection` 判定不受影响、`ACH_LIST` 17 条结构不变、同族常量（RICH_GOLD/SCHOLAR_GOAL/LUCKY_GOAL）未动。


## v18.4 成就阈值单一数据源——「幸运眷顾」5 判定/描述/进度三处同读 LUCKY_GOAL（机制·单一口径，与 RICH_GOLD / SCHOLAR_GOAL 同一「成就阈值数据化」家族——v18.3 注释已预告同族的 lucky 是下批对象，当时刻意保留其裸 5）

- 【`3` 同一条目内三处互不相关】「幸运眷顾」成就：累计获得 5 次额外掉落。这个 5 硬编码在 `data.js` `ACH_LIST` 该条的判定（`ok` 的 `>= 5`）、描述（`d` 的「累计获得 5 次额外掉落」）、进度（`prog` 的 `X/5`）三处——同对象内互不引用：想调门槛（如放宽到 8 次）要改三处，还极易只改判定漏改文案，实际达标线变了界面却还标「/5」；且全库无任何现成源可借鉴（`drops` 仅 `rules.js` 掉落时 `+1` 计数、`view/menus.js` 状态页展示，无成就门槛常量），故必须单设常量——正是 v18.3 注释里预告的下一个收口对象（「lucky 的裸 5 属分批收口的下批对象刻意保留」）。
- 【修正：data.js 新增 `LUCKY_GOAL = 5` 为唯一真源（置于 SCHOLAR_GOAL 之后、药水恢复量块之前，紧邻「成就阈值」注释块）】`ACH_LIST` 的 lucky 条 `ok`（`>= LUCKY_GOAL`）、`d`（模板串「累计获得 ${LUCKY_GOAL} 次额外掉落」）、`prog`（`/${LUCKY_GOAL}`）三处同读此源，并加入 export。收益：调「幸运眷顾」门槛只改 data.js 一处、判定/描述/进度同步，绝无第二套口径；行为逐字不变（`LUCKY_GOAL` 仍为 5，文案原样），零 UI 回归。
- 【零回归面】未动成就机制本身——`ACH_LIST` 其余 16 条逐字不变（`firstblood`/`hunt10`/`lvl5`/`lvl10` 等数值型条目各取其旧字面量不动，与 v18.2/v18.3 同一「分批收口」策略、未纳入本次以控制改动面）、`view/menus.js` 成就页只读 `ok/name/d`（`解锁 X/${ACH_LIST.length}` 照旧）、`rules.unlockedAchievements` 判定流程、掉落计数（`hero.drops` 五处 +1）、状态页「额外掉落」展示逐字不变。未动任何掉落/经验/金币曲线/难度/支线/存档。只新增一个常量 + 改一个条目（1 行）+ export 1 处，零新增依赖。
- 验证：`node --check js/data.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v18.4 专项冒烟（/tmp/jrpg_smoke_v184_luckygoal.mjs）**31 项断言全过**——`LUCKY_GOAL` 导出且为 5、lucky 判定逐字（4 次未达标 / 5·6 次达标 / 无 drops 字段兜底 false / drops=0 明确未达标）、`prog` 0/5·2/5·5/5·6/5 逐字、`d` 与旧字面量「累计获得 5 次额外掉落」逐字一致、源码 lucky 行 `${LUCKY_GOAL}` 恰 2 处且 LUCKY_GOAL 恰 3 处、`ok/prog.toString()` 各含且各恰 1 处 `LUCKY_GOAL` 标识符、抽验 `firstblood/hunt10/lvl5/lvl10/rich/scholar/perfection` 判定不受影响、`ACH_LIST` 17 条结构不变；源码 grep 确认 lucky 条目可执行代码裸 `>=5` / `/5` / `累计获得 5 次` 已清零（仅注释保留旧值说明），lvl5/lvl10/hunt10/firstblood 的裸 5/10/1 属分批收口的下批对象刻意保留。

## v18.3 成就阈值单一数据源——「记忆收藏家」5 种判定/描述/进度三处同读 SCHOLAR_GOAL（机制·单一口径，与 RICH_GOLD 同一「成就阈值数据化」家族——v18.2 收口「小富翁」后同类里残存的裸奔数值之一）

- 【`1` 同一条目内三处互不相关】「记忆收藏家」成就：记忆图鉴收录 5 种魔物。这个 5 硬编码在 `data.js` `ACH_LIST` 该条的判定（`ok` 的 `>= 5`）、描述（`d` 的「收录 5 种魔物」）、进度（`prog` 的 `X/5`）三处——同对象内互不引用：想调门槛（如放宽到 6 种）要改三处，还极易只改判定漏改文案，实际达标线变了界面却还标「/5」；且全库无任何现成源可借鉴（`bestiary` 仅有 `BESTIARY_TARGET` 全量 13 种表，是「全收集」口径而非「收录 5 种」的入门门槛，`perfection` 早已读前者、与 scholar 不是一回事），故必须单设常量——正是 v18.2 注释里预留的下一个收口对象（当时「各取其旧字面量不动，未纳入本次收口以控制改动面」）。
- 【修正：data.js 新增 `SCHOLAR_GOAL = 5` 为唯一真源（置于 RICH_GOLD 之后、药水恢复量块之前，紧邻「成就阈值」注释块）】`ACH_LIST` 的 scholar 条 `ok`（`>= SCHOLAR_GOAL`）、`d`（模板串「收录 ${SCHOLAR_GOAL} 种魔物」）、`prog`（`/${SCHOLAR_GOAL}`）三处同读此源，并加入 export。收益：调「记忆收藏家」门槛只改 data.js 一处、判定/描述/进度同步，绝无第二套口径；行为逐字不变（`SCHOLAR_GOAL` 仍为 5，文案原样），零 UI 回归。
- 【零回归面】未动成就机制本身——`ACH_LIST` 其余 16 条逐字不变（`firstblood`/`hunt10`/`lucky`/`lvl5`/`lvl10`/`rich` 等数值型条目各取其旧字面量不动，与 v18.2 同一「分批收口」策略、未纳入本次以控制改动面）、`view/menus.js` 成就页只读 `ok/name/d`（`解锁 X/${ACH_LIST.length}` 照旧）、`rules.unlockedAchievements` 判定流程、存档/进度字段原样。未动任何掉落/经验/金币曲线/难度/支线/存档。只新增一个常量 + 改一个条目（1 行）+ export 1 处，零新增依赖。
- 验证：`node --check js/data.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v18.3 专项冒烟（/tmp/jrpg_smoke_v183_scholar.mjs）**24 项断言全过**——`SCHOLAR_GOAL` 导出且为 5、scholar 判定逐字（收录 4 种未达标 / 5·6 种达标 / 无 bestiary 兜底 false）、`prog` 0/5·2/5·5/5·6/5 逐字、`d` 与旧字面量「记忆图鉴收录 5 种魔物」逐字一致、`ok/prog.toString()` 均含且各恰 1 处 `SCHOLAR_GOAL` 标识符、抽验 `firstblood/hunt10/lucky/lvl5/lvl10/rich/perfection` 判定不受影响；源码 grep 确认 scholar 条目可执行代码裸 `>=5` / `/5` / `收录 5 种` 已清零（仅注释保留旧值说明），lucky/lvl5 的裸 5 属分批收口的下批对象刻意保留。

## v18.2 成就阈值单一数据源——「小富翁」500 判定/描述/进度三处同读 RICH_GOLD、「记忆守护者」描述改读 BESTIARY_TARGET.length（机制·单一口径，与 MIST_GOAL / MUSHROOM_GOAL / POTION_PRICE 同一「数值数据化」家族）

- 【`2` 两条成就各自内部多处互不相关】①「小富翁」持有 500 金币：500 硬编码在 `data.js` `ACH_LIST` 该条的判定（`ok` 的 `>= 500`）、描述（`d` 的「持有 500 金币」）、进度（`prog` 的 `X/500`）三处——同对象内互不引用：想调门槛（如放宽到 800）要改三处，还极易只改判定漏改文案，实际达标线变了界面却还标「/500」；且全库无任何现成源（gold 相关常量仅 `DROP_GOLD=60` / `TRUE_BONUS_GOLD=300`，都不是成就门槛）。②「记忆守护者」收录全部魔物：`prog` 分母早已读 `BESTIARY_TARGET.length`、状态/图鉴页也读同源，唯独 `d` 描述「全部 13 种魔物」是裸 13——想给 `BESTIARY_TARGET` 增删一种（如新增精英残焰魔像已 13 种），判定与进度自动跟随，描述却还标旧数，正是 v18.1 同款「判定收口、文案裸奔」的漂移隐患。
- 【修正：data.js 新增 `RICH_GOLD = 500` 为唯一真源（置于 TRUE_BONUS_GOLD 之后、药水恢复量块之前）】`ACH_LIST` 的 rich 条 `ok`（`gold>=RICH_GOLD`）、`d`（模板串「持有 ${RICH_GOLD} 金币」）、`prog`（`/${RICH_GOLD}`）三处同读此源，并加入 export；`perfection` 条 `d` 改读 `BESTIARY_TARGET.length`（与同条 `ok`/`prog`、`view/menus.js` 图鉴页「记忆收录 X/N」同一真源，无需另设常量）。收益：调成就门槛只改 data.js 一处、判定/描述/进度同步，给图鉴增删魔物描述自动跟随，绝无第二套口径；行为逐字不变（`RICH_GOLD` 仍为 500、`BESTIARY_TARGET.length` 现为 13，两处文案原样），零 UI 回归。
- 【零回归面】未动成就机制本身——`ACH_LIST` 结构与其余 15 条逐字不变（`firstblood`/`hunt10`/`lvl5`/`lvl10`/`lucky`/`scholar` 等门槛不同值、各取其旧字面量不动，未纳入本次收口以控制改动面）、`view/menus.js` 成就页只读 `ok/name/d`（`解锁 X/${ACH_LIST.length}` 照旧）、`rules.unlockedAchievements` 判定流程、存档/进度字段原样。未动任何掉落/经验/金币曲线/难度/支线/存档。只新增一个常量 + 改两个条目（各 1 行）+ export 1 处，零新增依赖。
- 验证：`node --check js/data.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v18.2 专项冒烟（/tmp/jrpg_smoke_v182_richgold.mjs）**21 项断言全过**——`RICH_GOLD` 导出且为 500、rich 判定逐字（499 未达标 / 500·501 达标 / 无 gold 字段兜底 false）、`prog` 0/500·123/500·500/500·800/500 逐字、`d` 与旧字面量「持有 500 金币」逐字一致、`perfection.d` 与「全部 13 种魔物」逐字一致且分母同源 13、`rich.ok/prog.toString()` 均含 `RICH_GOLD` 标识符、抽验 `firstblood/hunt10/legend` 判定不受影响；源码 grep 确认两条目均已是模板串（`${RICH_GOLD}` / `${BESTIARY_TARGET.length}`）且可执行代码裸 `>=500` / `/500` / `持有 500 金币` / `全部 13 种` 已清零（仅注释保留旧值说明）。

## v18.1 旧灯卫名字支线目标枚数单一数据源——「旧灯卫的名字」收集条件/实时进度/目标文案/接取对话同读 FRAGMENTS.length（机制·单一口径，与 MIST_GOAL / MUSHROOM_GOAL 同一「支线目标单一数据源」家族，并修正一处虚标注释）

- 【`4` 同一支线定义内四处互不相关，且注释虚标单一数据源】巡灯人支线「旧灯卫的名字」目标 = 集齐 4 枚记忆碎片：这个 4 硬编码在 `data.js` `QUESTS.side_name` 的收集条件（`cond` 的 `>= 4`）、实时进度（`condProg` 的 `X/4 枚`）、任务条目标文案（`obj` 的「集齐 4 枚…」）、接取对话（`offer` 的「凑齐 4 枚…」）四处——四处互不引用：想增减记忆碎片（`FRAGMENTS` 增删一段，如加一枚龙王碎片改成 5 枚）要改四个字符串，还极易只改判定漏改文案，集齐 5 枚界面却还标「/4 枚」；且该定义上方注释自称「cond 单一数据源 FRAGMENTS.length」实为**虚标**——代码里其实全是裸 4，从未真正读 `FRAGMENTS.length`；而状态页「记忆 X/4」（`view/menus.js`）却早已是 `FRAGMENTS.length` 真源，一处已收口、一处裸奔，两套口径并存。
- 【修正：`QUESTS.side_name` 四处全部改读 `FRAGMENTS.length`（唯一真源 = 记忆碎片数据表本身，无需另设常量）】`cond`（`>= FRAGMENTS.length`）、`condProg`（`/${FRAGMENTS.length} 枚`）、`obj`（模板串「集齐 ${FRAGMENTS.length} 枚…」）、`offer`（模板串「凑齐 ${FRAGMENTS.length} 枚…」）四处同源；并把虚标注释改写成如实描述（目标枚数 = 数据表长度、与状态页/真结局加页同一真源）。收益：增删 `FRAGMENTS` 一段（改掉落表即改支线目标），下次装载后 条件/进度/文案/状态页 自动同步，绝无第二套口径；行为逐字不变（`FRAGMENTS.length` 现为 4，全部文案原样），零 UI 回归。`turnin` 的「四段都在这了。守门人、灯卫、星砂、初灯……」系逐字点名四段碎片的枚举性旁白（并非「N 枚」式数值引用，且已手动列全四个名字），保持文案原样不纳入收口。
- 【零回归面】未动支线机制本身——任务状态机（`bossDefeated` 解锁自动 active → 集齐转 turnin → 对话交付 done）、`quests.js` 的 `questStatus/questJournal/resolveNpcTalk/applyQuestReward` 只读 `QUESTS` 字段、碎片掉落（`battle.winBattle` 按 enemy 从 `FRAGMENTS` 查找）、真结局加页、名字石碑（`FRAGMENTS.forEach` 生成 `NPCS.steleN`）逐字不变；奖励（120 金 + 1 灵药）原样。未动任何掉落/经验/金币曲线/难度/成就/存档。只改 data.js 同一支线定义内 4 个引用点 + 1 处注释，零新增依赖、零新增常量。
- 验证：`node --check js/data.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v18.1 专项冒烟（/tmp/jrpg_smoke_v181_namefrag.mjs）**27 项断言全过**——`FRAGMENTS` 导出且现长 4、`cond` 恰好 FRAGMENTS.length 枚达成（3 枚 false / 4 枚 true / 无碎片兜底 false）、`condProg` 0/4·2/4·4/4 枚逐字、`obj/offer` 数据层与旧字面量逐字一致（offer 为防御性保留文案，直接校验数据源）、`turnin` 枚举旁白逐字、真实任务流端到端（auto active → 3 枚仍 active 且日志「3/4 枚」→ 4 枚转 turnin → 对话交付发 120 金+1 灵药 → done）、运行期 `FRAGMENTS.push` 增段后 cond/condProg 即刻跟随（5 枚门槛）再 pop 复原、grep 确认 data.js 可执行代码裸 `>= 4` / `/4 枚` / `集齐 4 枚` / `凑齐 4 枚` 已清零、`obj/offer` 为 `${FRAGMENTS.length}` 模板串（装载期同源）、`FRAGMENTS` 仍在 export（状态页同源）。

## v18.0 雾灵委托目标只数单一数据源——「雾里的新住客」讨伐条件/实时进度/目标文案/接取与交付对话同读 MIST_GOAL（机制·单一口径，与 MUSHROOM_GOAL 同一「支线目标单一数据源」家族）

- 【`3` 同一支线定义内五处互不相关】雾径猎手支线「雾里的新住客」目标 = 讨伐 3 只雾灵：这个 3 硬编码在 `data.js` `QUESTS.side_mist` 的讨伐条件（`cond` 的 `>= 3`）、实时进度（`condProg` 的 `X/3 只`）、任务条目标文案（`obj` 的「讨伐 3 只…」）、接取对话（`offer` 的「帮我打 3 只回来」）、交付对话（`turnin` 的「3 只，干净利落」）五处——同对象内互不引用：想调支线目标（如改成 4 只）要改五个字符串，还极易只改判定漏改文案，集齐 4 只界面却还标「/3 只」；且写着「3」，也无从考证这数从哪来——同族的灯长蘑菇支线目标早已收口（`MUSHROOM_GOAL=3`），唯独自家支线目标是支线数据里残存的裸奔数值。
- 【修正：data.js 新增 `MIST_GOAL = 3` 为唯一真源（紧邻 MUSHROOM_GOAL，同属「支线目标」常量块）】`QUESTS.side_mist` 的 `cond`（`>= MIST_GOAL`）、`condProg`（`${MIST_GOAL} 只`）、`obj`（模板串「讨伐 ${MIST_GOAL} 只…」）、`offer`（模板串「帮我打 ${MIST_GOAL} 只回来」）、`turnin`（模板串「${MIST_GOAL} 只，干净利落」）五处同读此源，并加入 export。收益：调雾灵支线目标只改 data.js 一处、判定/进度/文案五处同步，绝无第二套口径；行为逐字不变（`MIST_GOAL` 仍为 3，全部文案原样），零 UI 回归。
- 【零回归面】未动支线机制本身——任务状态机（`offer→active→turnin→done`）、`quests.js` 的 `questStatus/questJournal/resolveNpcTalk/applyQuestReward` 只读 `QUESTS` 字段、bestiary 雾灵计数（`scaleEnemy`/`winBattle` 收录）、奖励（60 金 + 1 药水）、接取/交付流程（`npcQuestPages` 选页）逐字不变；`MUSHROOM_GOAL` 及蘑菇支线、其余三条支线、掉落/经验/金币曲线/难度/成就/存档原样。只新增一个常量 + 改同文件 5 个引用点 + export 1 处，零新增依赖。
- 验证：`node --check js/data.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v18.0 专项冒烟（/tmp/jrpg_smoke_v180_mistgoal.mjs）**23 项断言全过**——常量导出 3、`cond` 恰好 MIST_GOAL 只达成（2 只 false / 3 只 true / 无 bestiary 兜底 false）、`condProg` 2/3·3/3·0/3 只逐字、`obj/offer/turnin` 三处文案与旧字面量逐字一致、真实任务流端到端（接取写 active → 2 只仍 active 且日志「2/3 只」→ 3 只转 turnin → 对话交付发 60 金+1 药水 → done）、grep 确认 data.js 可执行代码裸 `>= 3` / `/3 只` / `讨伐 3 只` / `帮我打 3 只` / `雾径猎手：3 只` 已清零且五处同读 MIST_GOAL、全文件 8 处引用（1 定义 + 1 export + 5 支线 + 1 注释）。

## v17.9 蘑菇出售单价单一数据源——shop.sellMushroom 卖菇结账/得金提示、列表卖出价签三处同读 MUSHROOM_PRICE（机制·单一口径，与 INN_PRICE / BREW_GOLD / POTION_PRICE 同一「价格数据化」体系）

- 【`10` 同一文件三处互不相关】卖 1 株魔法蘑菇得 10 金：这个 10 硬编码在 `shop.js` `sellMushroom` 卖菇结账（`hero.gold += 10`）与成功提示（`'售出 1 株魔法蘑菇，得 10 金'`）、`buildShopList` 商店列表卖菇行价签（`'卖出魔法蘑菇 ×1 → 10金'`）三处——三处互不引用：想调卖菇价（如涨到 15）要改三行，还极易只改结账漏改价签/提示，实际卖价改了列表价签却还标旧值、扣钱账目也对不上光标；且写着「10」，也无从考证这数从哪来——同族的价格早已收口（旅馆 `INN_PRICE=10`、酿造 `BREW_GOLD=10`、药水 `POTION_PRICE=15`），唯独卖菇价是经济循环里残存的裸奔数值。
- 【修正：data.js 新增 `MUSHROOM_PRICE = 10` 为唯一真源（置于 MUSHROOM_GOAL 之后，同属「灯长蘑菇支线」常量块）】`shop.js` `sellMushroom` 结账改读 `hero.gold += MUSHROOM_PRICE`、成功提示改读模板串 `售出 1 株魔法蘑菇，得 ${MUSHROOM_PRICE} 金`；`buildShopList` 卖出价签改读 `卖出魔法蘑菇 ×1 → ${MUSHROOM_PRICE}金`。收益：调卖菇价只改 data.js 一处、结账/提示/价签三处同步，绝无第二套口径；行为逐字不变（`MUSHROOM_PRICE` 仍为 10，提示/价签文案原样），零 UI 回归。
- 【零回归面】未动卖菇机制本身——任务保护拦截（`canSellMushroom` + `mushroomQuestProtects` 判定 `side_mushroom` 为 active/turnin 且 `mushrooms <= MUSHROOM_GOAL`、拦截提示「灯长委托的蘑菇」）优先、卖菇成功流程（扣 1 株、+10 金、`售出` 提示、`renderHUD`）逐字不变；`MUSHROOM_GOAL `支线目标、酿造配方（`BREW_MUSHROOMS/BREW_GOLD`）、药水价格（`POTION_PRICE`）与商店其余行（药水/武器/防具/离开）原样。未动任何掉落/经验/金币曲线/难度/成就/存档。只新增一个常量 + 改三个引用点（shop 一处 import + 三行引用），零新增依赖。
- 验证：`node --check js/data.js js/shop.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v17.9 专项冒烟（/tmp/jrpg_smoke_v179_mushroomprice.mjs）**15 项断言全过**——常量导出 10、可卖/保护期列表行（blocked 与文案）逐字正确、真实 `sellMushroom` 端到端（mushrooms 4→3、gold 0→10、提示「得 10 金」）、保护期拦截（active 态 mushrooms/gold 不动、提示引用 MUSHROOM_GOAL）、grep 确认 shop.js 可执行代码裸 `+= 10` / `得 10 金` / `→ 10金` 已清零且三处同读 MUSHROOM_PRICE。

## v17.8 生命药水购买价单一数据源——buyPotion 购买判定/扣款、商店列表价签三处同读 POTION_PRICE（机制·单一口径，与 INN_PRICE / BREW_GOLD / POTION_CAP 同一「价格数据化」体系）

- 【`15` 同一文件三处互不相关】生命药水购买价 = 15 金币：这个 15 硬编码在 `shop.js` `buyPotion` 购买判定（`hero.gold >= 15`）与扣款（`hero.gold -= 15`）两行、`buildShopList` 商店列表药水行价签（`price: 15`）一处——三处互不引用：想调药水价（如涨到 20）要改三行，还极易只改判定漏改扣款/价签，实际价改了列表价签却还标旧值，或扣错钱；且写着「15」，也无从考证这数从哪来——同族的价格早已收口（旅馆 `INN_PRICE=10`、酿造 `BREW_GOLD=10`、支线奖励 `+40+级×10 金`），唯独生命药水售价是经济循环里残存的裸奔数值。
- 【修正：data.js 新增 `POTION_PRICE = 15` 为唯一真源（置于 POTION_CAP 之后、POTION_HP_PCT 之前，同属药水常量块）】`shop.js` `buyPotion` 判定改读 `hero.gold >= POTION_PRICE`、扣款改读 `hero.gold -= POTION_PRICE`；`buildShopList` 价签改读 `price: POTION_PRICE`。收益：调药水售价只改 data.js 一处、判定/扣款/价签三处同步，绝无第二套口径；行为逐字不变（15 原样），零 UI 回归。
- 【零回归面】未动购买机制本身——背包满拦截（`item >= POTION_CAP` 优先、不扣钱、提示）、购买成功（扣 15 金、item++、`购买成功` 提示）、金币不足（`金币不足` 提示不进货不扣钱）流程逐字不变；`POTION_CAP/POTION_HP_PCT/POTION_HP_FLAT` 药水其余常量、商店其余行（蘑菇/武器/防具/离开）与 `WEAPONS/ARMORS` 价格原样。未动任何掉落/经验/金币曲线/难度/成就/存档。只新增一个常量 + 改三个引用点（shop 一处 import + 三行引用），零新增依赖。
- 验证：`node --check js/data.js js/shop.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v17.8 专项冒烟（/tmp/jrpg_smoke_v178_potionprice.mjs）**11 项断言全过**——常量导出 15、商店列表药水行 `price` ===POTION_PRICE 且文案仍拼恢复量/POTION_CAP、真实 `buyPotion` 端到端（gold=15 恰好可购扣 15→0 且 item 5→6、gold=14 不足不扣不进货报「金币不足」、满员拦截优先不扣钱报「药水上限 99 瓶」）；grep 确认 shop.js 可执行代码裸 `gold >= 15` / `gold -= 15` / `price: 15` 已清零且三处同读 POTION_PRICE。

## v17.7 起始技能单一数据源——newGame 建档起始技能与升级领悟表同读 LEARN_AT 1 级条目（机制·单一口径，与 DEFAULT_NAME / SKIP_CHANCE / PHASE2_AT 同一「单一数据源收口」体系）

- 【`'火焰斩'` 游离在领悟表之外，与其余四招的等级归属分居两文件】新档起始技能 = 『火焰斩』：这个名字只硬编码在 `core.js` `newGame` 建档一处（`skills: ['火焰斩']`），而其余四招（冰霜击 Lv.3 / 治愈术 Lv.4 / 雷鸣 Lv.5 / 陨石术 Lv.7）的等级归属全在 `data.js` `LEARN_AT` 学习表——起始技能名与技能领悟表互不引用：想换起始技能（如让新档开局就会冰霜击）或重命名初招，只改学习表会漏掉建档、只改建档又让领悟表对不上，新档极易带一个 `SKILL_DATA` 里查无此招的技能（技能菜单/状态页渲染空行、战斗点选报「尚未领悟该技能」）；且写着「火焰斩」，也无从考证它与技能表的关系——它本质上就是「Lv.1 领悟的技能」，却没进 `LEARN_AT`。
- 【修正：data.js `LEARN_AT` 补入 1 级条目 `1: '火焰斩'` 为唯一真源（1..7 级连成一张「各等级领悟技能全表」）】`core.js` `newGame` 建档起始技能改读 `skills: [learnsAt(1)]`。收益：起始技能只是「学习表 1 级条目」，换起始技能 / 重命名初招只改 data.js `LEARN_AT` 一处、建档 / 升级领悟 / 技能全表同步，绝无第二套口径；行为逐字不变（`LEARN_AT[1]` 仍为『火焰斩』，新档起始技能原样 `['火焰斩']`），零 UI 回归。
- 【零回归面】未动升级领悟机制——`hero.checkSkills` 仅在升级（`grantXp` 升级后）调用且按**新等级**查询，运行期永远查 `learnsAt(lv∈[2..8])`，1 级条目运行期不可达（新档自带起始技能，checkSkills 的 `!includes` 防重分支本就兜底），绝无「Lv.1 又弹一次领悟」；`skillXpHint` 下一技能预估从 `level+1` 起循环同样不触及 1 级。未动 `SKILL_DATA` 五招定义、技能菜单/状态页/战斗渲染、经验/等级/掉落/金币/难度/成就/存档。只改表 1 行 + core 建档 1 行 + 1 处 import，零新增依赖。README「等级解锁技能（火焰斩灼烧→…）」描述不变仍准确。
- 验证：`node --check js/data.js js/core.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v17.7 专项冒烟（/tmp/jrpg_smoke_v177_startskill.mjs）**20 项断言全过**——`learnsAt(1)`='火焰斩'、全表 1/3/4/5/7 回归与 2/6/8 null 不变、领悟表技能名全部在 SKILL_DATA 无重复、真实 `newGame()` / `newGame('潮')` / `initGame` 起始技能均 ===[learnsAt(1)]（行为逐字 `['火焰斩']`）、Lv.1 `checkSkills` 不重复领悟、Lv.3 升级仍由同表领悟冰霜击、`applyStats` 兼容、grep 确认 core.js 可执行代码裸 `skills: ['火焰斩']` 已清零且建档改读 `learnsAt(1)`、data.js LEARN_AT 1 级条目唯一真源在位。

## v17.6 默认主角名单一数据源——newGame 兜底 / resetRun 兜底 / 启动建档同读 DEFAULT_NAME（机制·单一口径，与 POTION_CAP / SKIP_CHANCE / PHASE2_HEAL_PCT 同一「单一数据源收口」体系）

- 【`'余烬'` 散落三文件四处互不相关】默认主角名 = HERO_NAMES 首位『余烬』：这个字面量硬编码在 `core.js` `newGame` 建档兜底（`name: name || '余烬'`）、`core.js` `resetRun` 无档兜底（`S.G ? S.G.name : '余烬'`）与 `main.js` 启动建档（`initGame('余烬')`）**四处**（含 data.js `HERO_NAMES=['余烬','灯见','潮']` 真源）——三文件互不引用：想改默认名（如把首位换成『灯见』）要改三个文件，还极易只改建档漏改兜底，新档默认名与无档重置名漂移；且写着「余烬」，也无从考证这数从哪来、是否就是名单首位。
- 【修正：data.js 新增 `DEFAULT_NAME = HERO_NAMES[0]` 为唯一真源（紧随 HERO_NAMES 之后，2026-08 末档收口系列第 6 弹）】`core.js` `newGame` 兜底改读 `name || DEFAULT_NAME`、`resetRun` 兜底改读 `S.G ? S.G.name : DEFAULT_NAME`；`main.js` 启动建档改读 `initGame(DEFAULT_NAME)`。收益：改默认主角名只动 data.js `HERO_NAMES` 一处、建档/两兜底/启动四处同步，绝无第二套口径；行为逐字不变（`HERO_NAMES[0]` 仍为『余烬』，默认名原样），零 UI 回归。
- 【零回归面】未动建档其余字段（Lv.1 / 30 金 / 3 药水 / 木剑布衣 / 火焰斩 / village 出生）与角色创建流程（`beginAdventure` 单选名单 `HERO_NAMES[S.createName]` 原样）；显式传名（`newGame('潮')`、主角创建选『灯见』/『潮』）仍优先。未动任何掉落/经验/金币/难度/成就/存档。只新增一个常量 + 改三个引用点（core 两处 + main 一处）+ 两处 import，零新增依赖。
- 验证：`node --check js/data.js js/core.js js/main.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v17.6 专项冒烟（/tmp/jrpg_smoke_v176_defaultname.mjs）**16 项断言全过**——常量导出且 =HERO_NAMES[0]、data/core/main 定义·导入·导出在位、grep 确认可执行代码裸 `'余烬'` 已清零（仅 data.js HERO_NAMES 真源一行）、真实 `newGame()` 默认名 '余烬'/`newGame('潮')` 显式优先、`DEFAULT_NAME` 可用于 resetRun 无档兜底路径。

## v17.5 二段变身回血比例兜底单一数据源——enemyAI 变身回血结算与 drawBattle 变身角标同读 PHASE2_HEAL_PCT（机制·单一口径，与 PHASE2_AT 同一「变身模板兜底」体系）

- 【`0.15` 兜底散落两处且显示对不上结算】Boss 二段变身的回血量 = `maxHP × phase.heal`（数据表显式写 heal），但变身模板**漏写 heal 时**的安全默认「恢复 15%」= `phase.heal || 0.15`：这个兜底字面量只硬编码在 `enemyAI.js enemyAct` 结算一处（`Math.round(enemy.hpMax * (phase.heal || 0.15))`），而 `view/drawBattle.js` 变身「增益数值」角标用的是 `if (p2.heal)` 直判——恰好漏写 heal 的模板（目前不存在，纯防未来）结算仍回 15%、角标却不显示「回15%」，显示对不上结算；且「2×2」两处互不引用，想调默认回血比例（如改 12%）要改结算、角标还得记得同步，极易改漏。v17.2 收口变身触发阈值（PHASE2_AT）时留下了这个同族的姊妹兜底——血量线已收口、回血比例还裸奔在结算/角标两处。
- 【修正：data.js 新增 `PHASE2_HEAL_PCT = 0.15` 为唯一真源（置于 PHASE2_AT 之后，同属「变身模板兜底」块）】`enemyAI.js` 变身回血结算改读 `phase.heal || PHASE2_HEAL_PCT`；`view/drawBattle.js` 变身角标改读 `p2.heal || PHASE2_HEAL_PCT`（判定与显示同源，漏写 heal 的模板角标同样标注「回15%」，显示与结算逐字对上）。收益：调默认变身回血比例只改 data.js 一处、结算/角标两处同步，绝无第二套口径；行为逐字不变（三 Boss 变身模板均显式带 heal——幽冥魔王/终焉之神 0.15、洞窟领主 0.10，此兜底仅守护变身模板漏写 heal 时的安全默认，当前游戏内敌人无一触发），零 UI 回归。
- 【零回归面】未动变身机制本身——显式 `heal`（幽冥魔王/终焉之神 0.15、洞窟领主 0.10）优先、变身流程（phased 标记/改名/攻防加算/回血/封印/闪光/blog）、变身触发阈值（PHASE2_AT 0.5）均逐字不变；drawBattle 角标对三 Boss 的显示文本原样（均显式 heal，`p2.heal || PHASE2_HEAL_PCT` 取值不变）；未动任何掉落/经验/金币/难度/成就/存档。只新增一个常量 + 改两个引用点（enemyAI 结算、drawBattle 角标判定/显示），零新增依赖。
- 验证：`node --check js/data.js js/enemyAI.js js/view/drawBattle.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v17.5 专项冒烟（/tmp/jrpg_smoke_v175_phase2heal.mjs）**24 项断言全过**——常量导出 0.15、data/enemyAI/drawBattle 定义·导入·导出在位、源码裸字面量（`phase.heal || 0.15)` / `if (p2.heal)`）已从可执行代码清除且两处同读 PHASE2_HEAL_PCT、真实 `enemyAct` 端到端（no-heal 模板兜底 0.15 → 100×0.15=15 回至 64 且博客报「HP 恢复 15」、显式 heal:0.10 仍优先回 10、幽冥魔王实盘 140×0.15=21 → 90 回归不变）、角标显示公式与结算公式逐字同源（漏写 15% / 显式 10%）、相邻机制 PHASE2_AT/HEAL_PCT 回归不变。

## v17.4 药水背包上限单一数据源——商店拦截判定/提示文案/列表「现有X/99」/购买置灰同读 POTION_CAP（机制·单一口径，与 MUSHROOM_GOAL / INN_PRICE / BREW_MUSHROOMS 同一「数值数据化」体系）

- 【`99` 散落两文件四处互不相关】药水背包上限 = 99 瓶：这个 99 硬编码在 `shop.js` `buyPotion` 购买拦截判定（`hero.item >= 99`）、背包已满提示文案（`药水上限 99 瓶`）、`buildShopList` 商店列表药水行（`[现有X/99]`）与 `view/menus.js` 购买栏 置灰判定（`hero.item<99`）四处——两文件互不引用：想调上限（如放宽到 120）要改四个地方，还极易只改判定漏改文案，实际拦截线变了列表/置灰/提示却还报旧值；且写着「99」，也无从考证这数从哪来（掉落/宝箱/任务奖励增量处不设上限，上限只在商店侧强制——四处 99 全是同一「商店侧上限」口径）。v17.0 收口支线目标株数时把「任务/保护/文案」接上同一常数，药水上限是经济循环里残存的裸奔数值。
- 【修正：data.js 新增 `POTION_CAP = 99` 为唯一真源（置于药水恢复量常量块首行，紧邻 POTION_HP_PCT）】`shop.js` 购买拦截改读 `hero.item >= POTION_CAP`、提示文案改拼 `` `药水上限 ${POTION_CAP} 瓶` ``、商店列表改拼 `[现有X/${POTION_CAP}]`；`view/menus.js` 购买置灰改读 `hero.item<POTION_CAP`（注释同步）。收益：调上限只改 data.js 一处、判定/提示/列表/置灰四端同步，绝无第二套口径；行为逐字不变（99 原样拼入），零 UI 回归。
- 【零回归面】未动购买机制本身——满员拦截（不扣金币、提示后 return）、购买成功（扣 15 金、item++、`现有X/99` 显示）、掉落/宝箱/任务奖励增量仍不设上限（既有设计，本次不碰）均逐字不变；`price:15`、`POTION_HP_PCT/POTION_HP_FLAT` 恢复量、商店其他行与置灰逻辑原样。未动任何掉落/经验/金币/难度/成就/存档。只新增一个常量 + 改四个引用点（shop 三处 + menus 一处），零新增依赖。
- 验证：`node --check js/data.js js/shop.js js/view/menus.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v17.4 专项冒烟（/tmp/jrpg_smoke_v174_potioncap.mjs）**6 项断言全过**——常量导出 99、商店列表药水行 `[现有3/99]`/`[现有98/99]` 由 POTION_CAP 推导、满员购买拦截（金币不变、提示含「药水上限 99 瓶」）、上限前最后一次购买（98→99、扣 15 金）；grep 确认可执行代码裸 `99` 已清零（仅注释提及）。

## v17.3 冰霜击冻结概率单一数据源——SKILL_DATA.skip 判定与技能提示文案同读 SKIP_CHANCE（机制·单一口径，与 BURN_PCT / POISON_CHANCE / ELITE_CHANCE 同一「概率数据化」体系）

- 【0.30 同一对象内两处各写一份互不相关】冰霜击冻结敌回合概率 = 30%：这个 0.30 硬编码在 `data.js` `SKILL_DATA['冰霜击']` 的 `skip:0.30`（判定字段）与 `hint:'30%冻结（跳过敌回合）'`（提示文案）两处——同对象内、互不引用：想调冻结率（如放宽到 40%）要改两个字段，还极易只改判定漏改提示，实际冻结率变了技能提示却还报旧值；而写着「0.30」「30%」，也无从考证这数从哪来、两处是否早已漂移（实测同值，纯结构隐患）。同族的火焰斩灼烧比例早已由 `BURN_PCT` 单一数据源化（hint 拼 `Math.round(BURN_PCT*100)`），毒蛇施毒率也已由 `POISON_CHANCE` 收口——唯独冰霜击冻结率是 SKILL_DATA 内最后一处裸奔数值。
- 【修正：data.js 新增 `SKIP_CHANCE = 0.30` 为唯一真源（置于 POISON_CHANCE 之后、SKILL_DATA 之前）】`SKILL_DATA['冰霜击'].skip` 改读 `skip:SKIP_CHANCE`；其 hint 改拼 `Math.round(SKIP_CHANCE * 100) + '%冻结（跳过敌回合）'`（与毒蛇帮助页同一推导式）。收益：调冻结率只改 data.js 一处、判定/提示两处同步，绝无第二套口径；显示文案 `30%冻结（跳过敌回合）` 逐字不变（0.30×100=30 原样推导），零 UI 回归。
- 【零回归面】未动冻结机制本身——`battle.playerAction` 判定 `Math.random() < skill.skip` 逐字不变（读的是 SKILL_DATA 里由常量拼入的 skip，值 0.30 原样）、`enemy.skipNext` 置位与 enemyAI 冻结消耗流程、`drawBattle` 冻结角标/技能预览读 SKILL_DATA.hint 显示均不变；其余四技能（火焰斩/雷鸣/陨石术/治愈术）hint 与字段逐字不变（冒烟逐条断言）。未动任何掉落/经验/金币/难度/成就/存档。只新增一个常量 + 改两个引用点（data.js 定义/导出、SKILL_DATA 一行两字段），零新增依赖。
- 验证：`node --check js/data.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v17.3 专项冒烟（/tmp/jrpg_smoke_v173_skipchance.mjs）**15 项断言全过**——常量导出 0.30、`SKILL_DATA['冰霜击'].skip` 同读常量、hint 由常量推导且与旧字面量逐字一致（`30%冻结（跳过敌回合）`）、data.js 源码裸字面量（`skip:0.30` / `'30%冻结`）已从 SKILL_DATA 清除且定义/导出/两引用在位、真实 `playerAction` 端到端（Math.random 固定 0.2 → skipNext=true 且博客记「冻结」；固定 0.5 → skipNext=false，与 0.30 阈值逐字耦合）、其余四技能 hint 与字段零回归。

## v17.2 二段变身触发阈值兜底单一数据源——enemyAI 变身触发与战斗「二段变身线」标注同读 PHASE2_AT（机制·单一口径，与 HEAL_PCT / HEAVY_MULT / SHIELD_MULT 同一体系）

- 【0.5 散落两文件互不相关】Boss 二段变身触发血量线 = `hp < hpMax × at`（数据表显式写 at），但变身模板**漏写 at 时**的安全默认「血量过半才变身」= `phase.at || 0.5`：这个兜底字面量硬编码在 `enemyAI.js enemyAct`（变身触发判定 `enemy.hp < enemy.hpMax * (phase.at || 0.5)`）与 `view/drawBattle.js` 二段变身线标注（`Math.ceil(enemy.hpMax * (phase2.at || 0.5))`）**两处**互不相关——想调「未显式写 at 的变身默认血量线」要改两个文件，还极易只改结算漏改标注，实际触发阈值变了变身线却还报旧值；且写着「0.5」，也无从考证这数从哪来、两处是否早已漂移。v17.1 收口回血招默认比例时已把「结算/标注两处各自硬编码兜底」定为同款病根，二段变身触发阈值是本体系残留在变身流程上的兜底数值。
- 【修正：data.js 新增 `PHASE2_AT = 0.5` 为唯一真源（置于 HEAL_PCT 之后）】`enemyAI.js` 变身触发判定改读 `phase.at || PHASE2_AT`；`view/drawBattle.js` 变身线标注改读 `phase2.at || PHASE2_AT`。收益：调默认变身血量线只改 data.js 一处、触发/标注两处同步，绝无第二套口径；行为逐字不变（三 Boss 变身模板均显式带 at:0.5——幽冥魔王/洞窟领主/终焉之神，此兜底仅守护变身模板漏写 at 时的安全默认，当前游戏内敌人无一触发），零 UI 回归。
- 【零回归面】未动变身机制本身——显式 `at:0.5` 优先（三 Boss 数据表原样）、触发判定 `hp < hpMax×at`、变身流程（phased 标记/改名/攻防加算/回血/封印/闪光/blog）、变身线精确阈值 `Math.ceil(hpMax×at)`（幽冥魔王 70 / 洞窟领主 55 / 终焉之神 130）均逐字不变；未动任何掉落/经验/金币/难度/成就/存档。只新增一个常量 + 改两个引用点（enemyAI 触发判定、drawBattle 变身线标注），零新增依赖。
- 验证：`node --check js/data.js js/enemyAI.js js/view/drawBattle.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v17.2 专项冒烟（/tmp/jrpg_smoke_v172_phase2at.mjs）**20 项断言全过**——常量导出 0.5、enemyAI/drawBattle 定义·导入·导出在位、源码裸字面量（`phase.at || 0.5)` / `phase2.at || 0.5`）已从可执行代码清除且两处同读 PHASE2_AT、真实 `enemyAct` 端到端（无 at 变身模板 hp51 未过 0.5 线不触发 → hp49 过线触发真身并回血 15 → 64、幽冥魔王 hp70 恰在显式 0.5 线不触发 → hp69 触发且真身回血 15% 回归不变）、变身线阈值推导（140×PHASE2_AT=70 / 260×PHASE2_AT=130）与触发判定同源。

## v17.1 敌方回血默认比例单一数据源——enemyAI 结算与战斗招数一览标注同读 HEAL_PCT（机制·单一口径，与 HEAVY_MULT / SHIELD_MULT / CRIT_MULT 同一体系）

- 【`0.12` 兜底散落两文件互不相关】敌方「回血」招的恢复量 = `maxHP × act.pct`（数据表显式写 pct），但招数表**漏写 pct 时**的安全默认「恢复 12%」= `act.pct || 0.12`：这个兜底字面量硬编码在 `enemyAI.js enemyAct`（结算 `Math.round(enemy.hpMax * (act.pct || 0.12))`）与 `view/drawBattle.js` 敌方招数一览（标注 `(a.pct || 0.12) * 100`）**两处**，两处注释还都各写一句「0.12 同款兜底」互为镜像却各写各的——想调「未显式写 pct 的回血招默认恢复多少」要改两个文件，还极易只改结算漏改标注，实际回血量变了招数一览却还报旧百分比；而写着「0.12」，也无从考证这数从哪来、两处是否早已漂移。
- 【修正：data.js 新增 `HEAL_PCT = 0.12` 为唯一真源（置于 HEAVY_MULT_PHASED 之后、DROP_* 之前）】`enemyAI.js` 结算改读 `act.pct || HEAL_PCT`；`view/drawBattle.js` 招数一览改读 `(a.pct || HEAL_PCT) * 100`（两处遗留注释同步改为 HEAL_PCT）。收益：调默认回血比例只改 data.js 一处、结算/标注两处同步，绝无第二套口径；行为逐字不变（三 Boss 回血招均显式带 pct——幽冥魔王/终焉之神 0.12、洞窟领主 0.10，此兜底仅守护招数表漏写 pct 的安全默认，当前游戏内敌人无一触发，纯收口数据源），零 UI 回归。
- 【零回归面】未动敌方回血机制本身——显式 `pct`（幽冥魔王/终焉之神 0.12、洞窟领主 0.10）优先生效、`pickAct` 按 hpBelow 触发线选招、回血结算公式 `Math.round(hpMax × pct)`、招数一览「血<40%时·恢复N%HP」文案、终焉之神 `⛔封印` 标注均逐字不变；三 Boss 行为表与 `BOSS/CAVE_BOSS/TRUE_BOSS` 模板数据原样。未动任何掉落/经验/金币/难度/成就/存档。只新增一个常量 + 改两个引用点（enemyAI 结算、drawBattle 标注）+ 两处注释同步，零新增依赖。
- 验证：`node --check js/data.js js/enemyAI.js js/view/drawBattle.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v17.1 专项冒烟（/tmp/jrpg_smoke_v171_healpct.mjs）**25 项断言全过**——常量导出 0.12、data/enemyAI/drawBattle 定义·导入·导出在位、源码裸字面量（`act.pct || 0.12)` / `(a.pct || 0.12)`）已从可执行代码清除且两处同读 HEAL_PCT、真实 `enemyAct` 端到端（no-pct 回血招 100/10 → 恢复 12 → hp22 且博客「恢复 12 HP」、显式 pct:0.10 仍优先生效 10→20、均不误触发胜负分支）、真实 `drawBattle` 敌方招数一览（幽冥魔王 ·恢复12%HP、no-pct 兜底 ·恢复12%HP、洞窟领主 ·恢复10%HP、终焉之神 ·恢复12%HP·⛔封印）、三 Boss 行为表显式 pct 全回归不变。

## v17.0 灯长蘑菇支线目标株数单一数据源——QUESTS/对话文案、开箱集齐判定、酿造与出售保护同读 MUSHROOM_GOAL（机制·单一口径，与 BREW_MUSHROOMS / ELITE_GATE_LV / POISON_CHANCE 同一「数据化」体系）

- 【支线目标「3 株」散落四文件七处互不相关】灯长支线「帮我找回 3 株魔法蘑菇」：这个 3 硬编码在 `data.js` `QUESTS.side_mushroom.n`（任务框架目标株数，日志 `找回魔法蘑菇 X/3 株` 经 quests.objectiveText 推导）与 NPC 对话 offer/active 两处文案（`帮我找回 3 株，好吗？` / `（已找到 X/3 株）`）、`world.js` 开箱集齐转可交付判定（`mushrooms >= 3`）、`core.js` 酿造任务保护（`mushrooms <= 3`）、`shop.js` 出售任务保护与文案（`canSellMushroom`、`sellMushroom`、出售列表 blocked 判定共三处 + `集齐 3 株前不能卖！`）——四文件七处互不相关：想调支线目标（如放宽到 4 株）要改三四个文件，还极易只改判定漏改文案，集齐 4 株对话却还标「/3 株」、出售列表还说集齐 3 株前不能卖。v16.2 收口酿造配方时只动了「2 株蘑菇」的酿造侧，支线目标这同一个「3」却始终裸奔在任务/保护/文案三端。
- 【修正：data.js 新增 `MUSHROOM_GOAL = 3` 为唯一真源，定义置于 QUESTS 之前（紧邻 BREW_MUSHROOMS，同属蘑菇主题）】`QUESTS.side_mushroom.n` 改读 `n:MUSHROOM_GOAL`（日志/任务条 `X/3 株` 经 def.n 同源推导）、对话 offer 文案改拼 `帮我找回 ' + MUSHROOM_GOAL + ' 株`、active 文案改拼 `${hero.mushrooms||0}/${MUSHROOM_GOAL} 株`；`world.onChestStep` 集齐判定改读 `hero.mushrooms >= MUSHROOM_GOAL`；`core.brewNow` 与 `shop.js`（canSellMushroom / sellMushroom / buildShopList 三处）保护判定改读 `hero.mushrooms <= MUSHROOM_GOAL`、禁售文案改拼 `集齐 ${MUSHROOM_GOAL} 株前不能卖！`。收益：调支线目标只改 data.js 一处、任务/对话/开箱/酿造/出售五端同步，绝无第二套口径；显示文案 `0/3 株`、`帮我找回 3 株，好吗？`、`集齐 3 株前不能卖！` 逐字不变（3 原样拼入），零 UI 回归。
- 【零回归面】未动支线机制本身——开箱得蘑菇（雾语林 60% 档）、集齐后 `setSideQuest('turnin')` 转可交付、交付奖励（40+级×10 金 + 2 药水）、任务保护语义（active/turnin 且株数 ≤ 目标时禁酿禁卖）均逐字不变；顺带确认 `quests.objectiveText` 本就读 `def.n`（`X/{def.n} 株`）——日志侧本与任务框架同源，本次只把散落的另外六处一并接到同一常数上。未动任何掉落/经验/金币/难度/成就/存档。只新增一个常量 + 改十个引用点（data 定义/导出与 n/对话两处、world 一处、core 一处、shop 四处判定+一处文案），零新增依赖。
- 验证：`node --check js/data.js js/world.js js/core.js js/shop.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v17.0 专项冒烟（/tmp/jrpg_smoke_v170_mushroom.mjs）**27 项断言全过**——常量导出 3、`QUESTS.side_mushroom.n` 同读常量、真实 `npcQuestPages` offer/active 文案由常量推导且与旧字面量逐字一致（`帮我找回 3 株，好吗？` / `（已找到 2/3 株、0/3 株）`）、真实 `questJournal` 目标 `找回魔法蘑菇 2/3 株 / 3/3 株`、`canSellMushroom`/`buildShopList`/`sellMushroom` 齐全的集齐前后双态（3 株禁售不扣、5 株售出 5→4 +10 金、售出后仍可卖）、真实 `world.onStep` 开箱集齐转可交付端到端（Math.random 固定 0.5 走蘑菇档：1→2 株仍进行中、2→3 株自动转 turnin）、且 data/world/core/shop 源码旧裸字面量（`n:3` / `帮我找回 3 株` / `/3 株` / `mushrooms >= 3` / `mushrooms <= 3` / `集齐 3 株前`）已从可执行代码清除且四处引用 MUSHROOM_GOAL 在位。

## v16.9 毒蛇施毒概率单一数据源——SPECIES/MON_BASE 两处定义与帮助页标注同读 POISON_CHANCE（机制·单一口径，与 POISON_PCT / POISON_TURNS / ELITE_CHANCE 同一「概率数据化」体系）

- 【0.35 散落三处互不相关】毒蛇施毒成功率 = 每次毒蛇普攻 35% 概率使玩家中毒：这个 0.35 硬编码在 `data.js` `SPECIES['毒蛇'].poison`（图鉴「☠️ 会施毒」所属物种表）与 `MON_BASE['毒蛇'].poison`（遇敌生成/敌人模板）**两处定义**，帮助页「毒蛇中毒」行又绕一层 `MON_BASE.find(m=>m.name==='毒蛇').poison` 才取到同一数值——三处互不相关：想调毒蛇施毒率（如放宽到 40%）要改两处定义、帮助页还得记得同步，极易只改一处让实际概率与帮助页标注对不上，实际 40% 帮助页却还标「35%」；而它的病根同族兄弟 `POISON_PCT`（扣血比例）/ `POISON_TURNS`（持续回合）早已单一数据源化，唯独这「施毒率 0.35」还散落两处定义 + 一处 `.find` 绕层，是本体系残留在毒蛇上的最后一处裸奔数值。
- 【修正：data.js 新增 `POISON_CHANCE = 0.35` 为唯一真源】`SPECIES['毒蛇'].poison` 与 `MON_BASE['毒蛇'].poison` 两处定义改读 `POISON_CHANCE`；帮助页「毒蛇中毒」行改拼 `毒蛇有 ' + Math.round(POISON_CHANCE * 100) + '% 概率`，不再经 `MON_BASE.find(...)`. 收益：调毒蛇施毒率只改 data.js 一处、两处定义 + 帮助页标注三端同步，绝无第二套口径；显示文案 `毒蛇有 35% 概率…` 逐字不变（0.35×100=35 原样推导），零 UI 回归。常量定义置于 SPECIES / MON_BASE 之前（两表顶层字面量 poison 会拼入此值，前向引用会触发 TDZ）。
- 【零回归面】未动毒蛇机制本身——`enemyAI.enemyAct` 施毒判定 `Math.random() < enemy.poison` 逐字不变（monster.poison 由 `scaleEnemy` 从 MON_BASE 透传，值 0.35 原样）、`POISON_PCT` 扣血结算与 `POISON_TURNS` 回合数、毒蛇图鉴 tag（`☠️ 会施毒 · 扣血3回合`）、其余魔物两表与帮助页各行均逐字不变；未动任何掉落/经验/金币/难度/成就/存档。只新增一个常量 + 改两个引用点（SPECIES 定义、MON_BASE 定义）+ 帮助页一处（顺带去掉了 `.find` 绕层），零新增依赖。
- 验证：`node --check js/data.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v16.9 专项冒烟（/tmp/jrpg_smoke_v169_poison.mjs）**20 项断言全过**——常量导出 0.35、SPECIES/MON_BASE 两处定义同读常量、帮助页「毒蛇有 35% 概率」由常量推导且与旧字面量逐字一致、data.js 源码裸 `poison:0.35` 已清除（定义处除外）且 `MON_BASE.find` 绕层已移除、scaleEnemy 毒蛇 poison 透传 = 0.35、毒蛇/野狼/史莱姆/雾灵图鉴 tag 与相邻帮助页行（中毒自救/技能克制/石甲/战斗掉落）原文逐字不变。

## v16.8 终焉之神额外奖励单一数据源——战胜结算/横幅、图鉴标注、战斗预览同读 TRUE_BONUS_GOLD（机制·单一口径，与 DROP_GOLD / RUSH_RECOVER / CHARGE_MULT 同体系）

- 【额外 300 金币散落四处互不相关】终焉之神的额外赏金 = 战胜后 `hero.gold += 300`（基础报酬 600 金之外的追加奖励）：这个 300 硬编码在 `battle.js winBattle` 两处（第 402 行结算 `hero.gold += 300` 与第 452 行横幅文案 `额外 300 金币！`）、`data.js` 图鉴 `SPECIES['终焉之神'].tag`（`💰 击败+300金`）、`view/drawBattle.js` 战斗预览（`· 战胜另+300金`）——跨三个文件四处互不相关：想调真结局额外赏金（如放宽到 500）要改两个文件三四处，还极易只改结算漏改标注/预览，实际打赢多了 500 金图鉴却还标「+300金」、战前预览还报「另+300金」；v16.5 收口精英出没时已把「判定旁剩下裸数值」定为同款病根，终焉之神的「+300」是 Boss 奖励体系中最后一处结算/标注/预览裸奔数值——`TRUE_BOSS.gold = 600`（基础报酬）早已单一数据源化，唯独这「额外 300」还散落四处。
- 【修正：data.js 新增 `TRUE_BONUS_GOLD = 300` 为唯一真源】`SPECIES['终焉之神'].tag` 改拼 `'💰 击败+' + TRUE_BONUS_GOLD + '金'`；`battle.winBattle` 结算改读 `hero.gold += TRUE_BONUS_GOLD`、横幅改读模板插值 `额外 ${TRUE_BONUS_GOLD} 金币！`；`drawBattle` 预览改拼 `'· 战胜另+' + TRUE_BONUS_GOLD + '金'`。收益：调真结局额外赏金只改 data.js 一处、结算/横幅/标注/预览四处同步，绝无第二套口径；显示文案 `额外 300 金币！`、`💰 击败+300金`、`· 战胜另+300金` 逐字不变（300 原样拼入），零 UI 回归。常量定义置于 SPECIES 之前（SPECIES 顶层字面量 tag 会拼入此值，前向引用会触发 TDZ）。
- 【零回归面】未动终焉之神机制本身——`TRUE_BOSS` 基础报酬（xp400 / gold600）、`isTrue` 判定、真结局流程（stopBgm/goto ending/drawEnding）、记忆碎片、成就、其余 Boss（幽冥魔王/洞窟领主/残焰魔像）tag 逐字不变；未动任何掉落/经验/难度/存档。只新增一个常量 + 改四个引用点（data 定义/导出与 tag 一处、battle 结算/横幅两处、drawBattle 预览一处），零新增依赖。
- 验证：`node --check js/data.js js/battle.js js/view/drawBattle.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v16.8 专项冒烟（/tmp/jrpg_smoke_v168_truegold.mjs）**16 项断言全过**——常量导出 300、图鉴 tag 由常量拼出且与旧字面量逐字一致（`💰 击败+300金`）、TRUE_BOSS 基础报酬 gold=600 不受影响（额外奖与基础奖独立两档）、battle.js 裸结算 `hero.gold += 300` 与裸横幅 `额外 300 金币`、drawBattle.js 裸预览 `另+300金`、data.js 可执行字符串字面量 `💰 击败+300金` 均已清除且四处同读 TRUE_BONUS_GOLD、相邻 Boss tag（幽冥魔王/石心魔像/洞窟领主）与拼接产物文案逐字不变。

## v16.7 帮助页元素克制/石甲减伤标注单一数据源——HELP_PAGES 第 3 页最后两处裸字面量同读 ELEM_MULT / SHIELD_MULT（机制·单一口径，与 CHARGE_MULT / RUSH_RECOVER / DROP_* 同体系）

- 【1.35/0.7 与 -40% 只剩帮助页两行裸奔，结算/日志/图鉴早已同源】元素克制倍率 `弱点×1.35 / 抗性×0.7` 自 v12.x 起就是 `ELEM_MULT={weak:1.35, resist:0.7}`（data.js），`rules.elemMult`（结算）与图鉴 `codexTag` 弱点/抗性标注早已同读此源；石甲减伤 `×0.6 / 每层降 40%` 自 v12.4 起就是 `SHIELD_MULT=0.6`，`battle.attackMove`（结算）、`rules.shieldScale`（预览）、`enemyAI` 凝甲日志（`敌所受伤害降低 ${Math.round((1-SHIELD_MULT)*100)}%`）三处同读此源——唯独帮助页第 3 页还硬编码着两句字面量：操作说明「技能克制」行的 `弱点伤害×1.35 · 抗性伤害×0.7` 与「石心魔像·石甲」行的 `每层使下一次攻击伤害 -40%`。想调克制/石甲强度（如弱点放宽到 1.4、石甲减到 -50%）要改结算/显示之外**还要记得改帮助页**，极易只改结算漏改标注；v16.6 收口试炼恢复时把帮助页「最后一处裸奔」定为同款病根，元素克制与石甲减伤是本体系残留在帮助页的最后两处字面量。
- 【修正：帮助页两行改由 ELEM_MULT / SHIELD_MULT 拼入】`弱点伤害×' + ELEM_MULT.weak + ' · 抗性伤害×' + ELEM_MULT.resist` 与 `每层使下一次攻击伤害 -' + Math.round((1 - SHIELD_MULT) * 100) + '%'`（后者与 enemyAI 凝甲日志同一推导式）。收益：调克制/石甲平衡只改 data.js 一处、结算/显示/标注多端同步；显示文案逐字不变（`1.35/0.7/40%` 全由常量推导），零 UI 回归。
- 【零回归面】未动机制本身——`elemMult` 判定（先弱后抗、非克制即 1）、`attackMove`/预览/日志的石甲语义、`maxShield`（石心魔像 3 层/洞窟领主 2 层）与凝甲触发线均逐字不变；未动 `ELEM_NAME`、图鉴标注、其余帮助页各行、掉落/经验/金币/难度/成就/存档。只改 data.js 帮助页两行、零新增依赖。
- 验证：`node --check js/data.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v16.7 专项冒烟（/tmp/jrpg_smoke_v167_help.mjs）**13 项断言全过**——常量导出 1.35/0.7/0.6、真实 HELP_PAGES 两行文案与旧字面量逐字一致（`弱点伤害×1.35 · 抗性伤害×0.7` / `-40%` 全由常量推导）、data.js 源码裸字面量 `弱点伤害×1.35`/`抗性伤害×0.7`/`攻击伤害 -40%` 已清除且两行读常量、相邻行（毒蛇中毒/战斗掉落/宝箱掉落）原文逐字不变。

## v16.6 试炼三连战恢复比例单一数据源收口——帮助页「试炼三连战」行同读 RUSH_RECOVER（机制·单一口径，与 CHARGE_MULT / ELEM_MULT / FLEE_SUCCESS 同体系）

- 【battle.winBattle 注释宣称「帮助页标注同读此源」，帮助页却仍裸写 35%/50%】试炼三连战每胜一关自动回血 `35%HP / 50%MP`：这两个比例自 v13.x 起就是 `RUSH_RECOVER = { hp:0.35, mp:0.5 }`（data.js）——`battle.winBattle` 连战换关恢复结算与战斗横幅（`已自动恢复35%HP / 50%MP`）早已同读此源，v12.9 后 `drawBattle` 通关备注 `通关恢复35%HP/50%MP` 也接入了常量——唯独帮助页第 4 页「试炼三连战」行还写着硬编码字面量 `每胜一关回血35%HP/50%MP`，且 `battle.js winBattle` 的注释（第 424 行）明确写着「与战斗横幅/帮助页标注同读此源」：**注释声称帮助页已同源，实际帮助页是该体系最后一处裸奔**。想调试炼恢复强度（如改成 30%/45%）要改结算之外还要记得改帮助页，极易只改结算漏改标注，实际打赢回血变了帮助页却还标旧比例；而写着「35%/50%」，玩家也无从考证这数从哪来。v16.3 收口蓄力倍率时已把帮助页漏网同类病根定为「结算/显示/标注三处同步」，试炼恢复是本体系漏在帮助页的最后一处。
- 【修正：帮助页「试炼三连战」行改由 RUSH_RECOVER 拼入】`每胜一关回血' + Math.round(RUSH_RECOVER.hp × 100) + '%HP/' + Math.round(RUSH_RECOVER.mp × 100) + '%MP'` —— 与结算/横幅/备注同一单一数据源。收益：调试炼恢复平衡只改 data.js 一处、结算/横幅/备注/帮助页四处同步，`battle.winBattle` 注释「帮助页标注同读此源」所言成真；显示文案 `每胜一关回血35%HP/50%MP` 逐字不变（0.35×100=35 / 0.5×100=50 原样推导），零 UI 回归。
- 【零回归面】未动试炼机制本身——连战换关 `hero.rushStage` 递增、判定 `stage >= RUSH_BOSSES.length`、恢复结算 `Math.min` 封顶、换关延迟 1400ms、Boss 序列 `RUSH_BOSSES` 均逐字不变；未动帮助页其余各页各行为逐字不变、未动任何掉落/经验/金币/难度/成就/存档。只改 data.js 帮助页一行、零新增依赖。
- 验证：`node --check js/data.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v16.6 专项冒烟（/tmp/jrpg_smoke_v166_rushhelp.mjs）**12 项断言全过**——常量导出 {hp:0.35, mp:0.5}、`Math.round(RUSH_RECOVER.hp×100)`=35/50、真实 HELP_PAGES「试炼三连战」行文案与旧字面量逐字一致（35/50 由常量推导）、data.js 源码裸 `回血35%HP/50%MP` 已清除且该行读 RUSH_RECOVER、battle.winBattle 结算/横幅与 drawBattle 备注同读 RUSH_RECOVER、相邻帮助行（双徽记条件/重整旗鼓/蘑菇宝箱）原文逐字不变。

## v16.5 精英出没概率单一数据源——雾语林随机遇敌判定与图鉴「稀有精英」标注同读 ELITE_CHANCE（机制·单一口径，与 ELITE_GATE_LV / DROP_* / CHEST_MUSHROOM 同体系）

- 【0.07 只剩一处裸奔，且「稀有精英」只有定性无定量】雾语林随机遇敌有约 7% 概率撞见「石心魔像」精英：这个 0.07 硬编码在 `encounter.js randomEncounter`（判定），而图鉴已讨伐行的出没标注「雾语林·稀有精英」只有定性「稀有」、没有定量——v12.3 收口精英等级门槛 `ELITE_GATE_LV` 时，出没概率仍以裸 0.07 与「稀有」字样并存，是本作机制数值中最后一处未数据化的出没概率：想调精英出现率（如放宽到 10%）要改判定一处，图鉴却永远只能说「稀有」，刷图鉴/刷蘑菇的玩家完全无法预估「撞不撞得到它」。
- 【修正：data.js 新增 `ELITE_CHANCE = 0.07` 为唯一真源】`randomEncounter` 精英判定改读 `Math.random() < ELITE_CHANCE`；图鉴 `whereFind` 对石心魔像（经 `ELITE_GOLEM.name` 判精英，与 monReward/codexStats 同一识别惯例）追加 `· 约N%`（N = `Math.round(ELITE_CHANCE × 100)`）。收益：调精英出现率只改 data.js 一处、判定/标注两处同步；显示文案 `雾语林·稀有精英 · Lv.3起出没 · 约7%`（7% 由常量推导），遇敌行为逐字不变（判定时机 dungeon && level≥ELITE_GATE_LV 原样、0.07 原样）。
- 【零回归面】未动精英判定时机、精英属性（ELITE_GOLEM）、等级门槛（ELITE_GATE_LV）、图鉴其余条目、掉落/经验/金币/难度/成就/存档。只新增一个常量 + 改两个引用点。
- 验证：`node --check js/data.js js/encounter.js js/view/menus.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v16.5 专项冒烟（/tmp/jrpg_smoke_v165_elite.mjs）**24 项断言全过**——常量导出 0.07/3、encounter.js 裸 `Math.random() < 0.07` 已清除且读 ELITE_CHANCE 两处、真实 `randomEncounter` 蒙特卡洛（Lv.3/Lv.6 dungeon 精英率 ≈7% 与 v12.3 基线同界、Lv.1/Lv.2 dungeon 无精英、village/cave 无精英）、eliteEncounter 直达契约（名/isElite/hpMax）、drawCodex 端到端逐字 `（雾语林·稀有精英 · Lv.3起出没 · 约7%）` 且史莱姆/幽冥魔王行原文逐字不变、monReward(石心魔像,5)=xp70/金75（ELITE_GOLEM 式回归）、连续绘制零状态改动（纯显示收敛）。

## v16.4 经验曲线单一数据源——升级结算 / 技能经验预估 / 新档建档同读 XP_GROW / XP_INIT（机制·单一口径，与 CHARGE_MULT / DROP_* / POTION_* 同体系）

- 【1.42 散落 hero.js 三处、初始 20 再两处】升级所需经验逐级 ×1.42 取整（20→28→40→57…）：这个 1.42 硬编码在 `hero.js grantXp`（结算，升级循环 `xpNext = round(xpNext×1.42)`）与 `hero.js skillXpHint`（预估，起档与逐级累加两处 `round(…×1.42)`）——v3.21 起预估就复刻结算的升级链，同一个 1.42 同一文件内互为镜像、却各写各的；而新档首级所需经验 20 又另写在 `core.js newGame`（`xpNext: 20`），`skillXpHint` 旧档兜底再写一句 `|| 20`——同一个 1.42 与 20 五处互不相关：想调经验曲线（如放缓到 1.35、或把首档压缩到 15 经验）要改两个文件三四处，还极易只改结算漏改预估/建档，实际升到某级所需经验变了，「距下一技能还差 N 经验」却还按旧曲线报数对不上；而写着「1.42」「20」，也无从考证这数哪儿来、两处是否早已漂移。
- 【修正：data.js 新增 `XP_GROW = 1.42` 与 `XP_INIT = 20` 为唯一真源】`grantXp` 升级结算改读 `Math.round(hero.xpNext * XP_GROW)`；`skillXpHint` 起档/逐级两处改读同一表达式、旧档兜底改读 `XP_INIT`；`core.newGame` 建档 `xpNext: XP_INIT`。收益：调经验曲线只改 data.js 一处、结算/预估/建档三处同步，绝无第二套口径；行为逐字不变（升级链 20→28→40→57→81→115→163→231→328 与历史公式完全一致，`L1xp5 冰霜击还差 43` 等既有预估数值逐字不变），零 UI 回归。
- 【零回归面】未动升级机制本身——判定 `xp >= xpNext`、xp 结转下一档、`level++`、属性成长（baseStats/WEAPONS/ARMORS）、胜利横幅经验显示、技能领悟时机等 v1.x 起语义逐字不变；未动任何战斗/掉落/金币/难度/成就/存档。只新增两个常量 + 改五个引用点（data 定义/导出、hero 结算与预估三处、core 建档一处）。
- 验证：`node --check js/data.js js/hero.js js/core.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v16.4 专项冒烟（/tmp/jrpg_smoke_v164_xpgrow.mjs）**15 项断言全过**——常量导出 1.42/20、真实 `grantXp` 驱动跨档升级 xpNext 与 `round(20×XP_GROW)=28` 逐字耦合、升级链基准 L1→L8（20/28/40/57/81/115/163/231/328）与历史公式全一致、真实 `skillXpHint` 预估（L1xp5 还差 43 / L2xp10 还差 18 / 旧档缺 xpNext 兜底 XP_INIT 还差 48 / 已学满 null）与既有数值逐字一致、`newGame` 建档 `xpNext = XP_INIT = 20`、hero/core 旧裸字面量（`×1.42` / `xpNext: 20` / `|| 20`）已从源码清除且 import/定义/导出皆在位。

## v16.3 蓄力倍率单一数据源——帮助页「战斗」行标注同读 CHARGE_MULT（机制·单一口径，与 FLEE_SUCCESS / CRIT_MULT / DROP_* 同体系）

- 【`×1.5` 只在帮助页「战斗」行一处裸奔】蓄力倍率 = 下击/技能威力 ×1.5：`CHARGE_MULT = 1.5`（data.js）自 v14.0 蓄力语义收敛起就是结算（battle.js `attackMove` 的 `×CHARGE_MULT`、`doCharge` 日志 `威力 ×${CHARGE_MULT}`）与战斗显示（drawBattle.js 状态栏/横幅 `×${CHARGE_MULT}`）两面的唯一真源——唯独帮助页操作说明「战斗」行还写着硬编码字面量 `6蓄力(下击/技能×1.5)`：同一行「逃跑约60%」早已由 FLEE_SUCCESS 推导，蓄力倍率却是本行漏网的最后一处裸数值。想调蓄力强度（如放宽到 1.6）要改结算/显示之外**还要记得改帮助页**，极易只改结算漏改标注，实际威力变了帮助页却还标旧倍率；而写着「×1.5」，玩家也不知这数从哪来、靠不靠谱。v15.8 收口防御时已把帮助页漏网定为同类病根，蓄力是机制数值数据化后残留在帮助页操作行的最后一处字面量。
- 【修正：帮助页「战斗」行改由 CHARGE_MULT 拼入】`6蓄力(下击/技能×' + CHARGE_MULT + ')` —— 与结算/显示同一单一数据源。收益：调蓄力平衡只改 data.js 一处、结算/显示/帮助页三处同步；显示文案 `6蓄力(下击/技能×1.5)` 逐字不变（CHARGE_MULT=1.5 原样拼入），零 UI 回归。
- 【零回归面】未动蓄力机制本身——蓄力语义（只加成攻击/伤害技能威力、治愈不消耗蓄力）、`attackMove` 结算 `charged ? CHARGE_MULT : 1`、日志文案 `威力 ×1.5 ！`、drawBattle 两处显示均逐字不变。只改 data.js 帮助页一行、零新增依赖。
- 验证：`node --check js/data.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v16.3 专项冒烟（/tmp/jrpg_smoke_v163_charge.mjs）**11 项断言全过**——CHARGE_MULT 导出 1.5、帮助页「战斗」行由常量推导且与旧字面量逐字一致（含同行 FLEE_SUCCESS 推导）、battle 结算/日志与 drawBattle 两处显示同读 CHARGE_MULT、帮助页源码裸字面量 `×1.5` 已清除、import/定义/导出在位、整行文案渲染无异常。

## v16.2 酿造配方/灵药描述单一数据源——brewNow 结算与酿造台配方/可酿判定/差额标注同读 BREW_* 与 ELIXIR_*（机制·单一口径，与 POTION_*/DROP_* 同体系，即 v16.1 收口药水时声明未动的「酿造差额」）

- 【2 株蘑菇 + 10 金散落两处、灵药描述再写一句字面量】酿造高级灵药 = 消耗 `2` 株魔法蘑菇 + `10` 金币产出 1 瓶：这两个数硬编码在 `core.js brewNow`（结算，`mushrooms < 2 || gold < 10` 两判定 + `-= 2 / -= 10` 两扣减）与 `view/menus.js drawBrew`（配方文案「配方：2 株魔法蘑菇 + 10 金币 → 高级灵药 ×1」、可酿判定 `mushrooms>=2&&gold>=10`、差额标注 `max(0,2-…) / max(0,10-…)`）两文件五处互不相关；而酿造台的灵药描述「高级灵药：恢复 80% HP + 40% MP」更是 **v16.1 收口 POTION_*/ELIXIR_* 时唯一漏网的旧字面量**（0.8/0.4 至今未接常量）——同一个 2/10 与 80%/40% 五处互不相关：想调配方（如改 3 株 + 15 金）或调灵药强度要改两三个地方，还极易只改结算漏改文案，酿造成本变了界面却还标旧配方。
- 【修正：data.js 新增 `BREW_MUSHROOMS = 2` 与 `BREW_GOLD = 10` 为唯一真源】`brewNow` 结算改读 `hero.mushrooms < BREW_MUSHROOMS || hero.gold < BREW_GOLD` 与 `-= BREW_MUSHROOMS / -= BREW_GOLD`；`drawBrew` 配方文案、可酿判定、差额标注全改由两常量推导；灵药描述改由 `Math.round(ELIXIR_HP_PCT * 100)` + `Math.round(ELIXIR_MP_PCT * 100)` 推导（补上 v16.1 漏网）。收益：调酿造/灵药平衡只改 data.js 一处、两处同步；显示文案 `配方：2 株魔法蘑菇 + 10 金币 → 高级灵药 ×1`、`高级灵药：恢复 80% HP + 40% MP`、`材料不足（还差 N 株蘑菇、M 金币）` 逐字不变（2/10/80/40 全由常量推导），零 UI 回归。
- 【零回归面】未动酿造机制本身——判定顺序（先任务保护 `mushroomQuestProtects && mushrooms<=3` 拦截、再材料不足早退）、酿造消耗（2 蘑菇 + 10 金 → 灵药 +1）、SFX/renderHUD、任务蘑菇保护仅 ≤3 株时拦截等语义逐字不变。只新增两个常量 + 改两个引用点（core 结算 4 处、menus 展示 5 处 + 1 行注释）。
- 验证：`node --check js/data.js js/core.js js/view/menus.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v16.2 专项冒烟（/tmp/jrpg_smoke_v162_brew.mjs）**25 项断言全过**——常量导出 2/10、真实 `brewNow` 驱动足料酿造（2 蘑菇 + 10 金 → 灵药 0→1，用量与常量逐字耦合）/ 缺蘑菇差 1 不扣 / 缺金币差 1 不扣 / 任务保护（active 且蘑菇≤3）拦截、酿造台三行文案由常量推导且与旧字面量逐字一致、core/menus 的旧裸字面量已从源码清除、import/定义/导出皆在位。

## v16.1 药水恢复量单一数据源——结算、战斗预览、商店文案同读 POTION_*/ELIXIR_*（机制·单一口径，与 DROP_* / POISON_PCT / DEFEND_MULT 同体系）

- 【0.5/+8 与 0.8/+20 散落三处，预览与商店再各写自己的字面量】药水恢复量 = 普通药水 `round(hpMax×0.5)+8`、高级灵药 `round(hpMax×0.8)+20` HP 与 `round(mpMax×0.4)` MP：这三个比例与两个加值硬编码在 `hero.js takePotion`（结算）、`view/drawBattle.js` 战斗指令栏恢复量预览（纯显示）、`shop.js` 药水条目文案 `恢复 50%HP +8`（纯显示）三处互不相关——想调药水强度（如灵药回血放宽到 85%）要改两个文件三处，还极易只改结算漏改预览/商店，结算回 X 血界面却还标旧值；而写着「50%HP +8」，玩家也看不出这数到底从哪来、靠不靠谱。v4.1/v12.2 起药水数值散落至今，是本作机制数值中继 v16.0 战斗掉落后的最后一处结算/展示裸奔。帮助页「高级灵药」行只写「可同时恢复 HP/MP」无数字，不涉字面量。
- 【修正：data.js 新增 `POTION_HP_PCT = 0.5 / POTION_HP_FLAT = 8 / ELIXIR_HP_PCT = 0.8 / ELIXIR_HP_FLAT = 20 / ELIXIR_MP_PCT = 0.4` 为唯一真源】三处同读一份数据：`takePotion` 结算改读 `Math.round(hero.hpMax * ELIXIR_HP_PCT) + ELIXIR_HP_FLAT` / `Math.round(hero.mpMax * ELIXIR_MP_PCT)` / `Math.round(hero.hpMax * POTION_HP_PCT) + POTION_HP_FLAT`；战斗预览改由同一表达式推导（与结算逐字同源）；商店文案改由 `Math.round(POTION_HP_PCT * 100)` + `POTION_HP_FLAT` 推导。收益：调药水平衡只改 data.js 一处、三处同步；显示文案 `🍖+48HP`、`🧪+84HP/+20MP`、商店 `恢复 50%HP +8` 逐字不变（0.5×100=50、8 原样），零 UI 回归。
- 【零回归面】未动药水机制本身——判定顺序（`takePotion` 先耗高级灵药、普通药只在掉血时用）、满状态不浪费、消耗计数、`hp/mp` 封顶 `Math.min`、战斗 `doItem` 与大地图 `usePotion` 均只消费 `result.h/result.m`（不重算数值，改动不扩散）等 v4.1 起语义逐字不变。只新增五个常量 + 改四个引用点（data 定义/导出、hero 结算、drawBattle 预览、shop 文案）。
- 验证：`node --check js/data.js js/hero.js js/view/drawBattle.js js/shop.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v16.1 专项冒烟（/tmp/jrpg_smoke_v161_potion.mjs）**31 项断言全过**——常量导出 0.5/8/0.8/20/0.4、真实 `takePotion` 驱动高级灵药优先（回血/回蓝与常量逐字耦合、封顶正确）与普通药分支（+48、不回蓝）、真实 `buildShopList` 药水文案与旧字面量逐字一致、hero/drawBattle/shop 三处源码旧裸数字 0.5/8/0.8/20/0.4 已清除且 import/定义/导出皆在位。

## v16.0 战斗随机掉落概率/金币数额单一数据源——档位判定与帮助页「战斗掉落」标注同读 DROP_*（机制·单一口径，与 CHEST_* / FLEE_SUCCESS / BURN_PCT 同体系）

- 【0.08/0.2/0.32/0.38 与 +60 散落两处，帮助页再各写自己的字面量】战斗随机掉落 = 胜利后约 38% 触发：`roll < 0.08` 装备升级（木剑/铁剑→秘银剑、布衣/皮甲→锁子甲，已最好则 +60 金）、`< 0.2` 药水、`< 0.32` 魔法蘑菇（仅雾语林/矿脉，否则并入药水档）、`< 0.38` 高级灵药：这四个边界与金币数额 60 硬编码在 `rules.js rollDrop`，`data.js` 帮助页「战斗掉落」行又自写一句字面量「胜利后约 38% 触发随机掉落：8% 装备或+60金 · 12% 药水 · 12% 蘑菇 · 6% 高级灵药」——v12.4 只把概率**讲明**、刻意未动这些数字，两处自此互不相关：想调出货率（如装备档放宽到 10%）要改两个地方，还极易只改结算漏改标注，实际掉率变了帮助页却还标旧值；而写着「8%」「38%」，玩家也看不出这数到底从哪来、靠不靠谱。v15.3 收口宝箱开箱时已把「帮助页又各写一句字面量」定为同款病根，战斗掉落是判定旁剩下的最后一处结算/标注裸奔数值。
- 【修正：data.js 新增 `DROP_EQUIP = 0.08 / DROP_POTION = 0.12 / DROP_MUSHROOM = 0.12 / DROP_ELIXIR = 0.06 / DROP_GOLD = 60` 为唯一真源】两处同读一份数据：`rollDrop` 档位判定改由常量**累进推导**（`edgePotion = DROP_EQUIP + DROP_POTION` → 原 0.2、`edgeMushroom = edgePotion + DROP_MUSHROOM` → 原 0.32、`edgeElixir = edgeMushroom + DROP_ELIXIR` → 原 0.38），金币兜底改读 `hero.gold += DROP_GOLD`、文案改拼 `'✨ 宝箱：金币 +' + DROP_GOLD`；帮助页「战斗掉落」行改由常量推导（合计 `round((DROP_EQUIP+DROP_POTION+DROP_MUSHROOM+DROP_ELIXIR)×100)`、各档 `round(N×100)`、`DROP_GOLD` 原样拼入）。收益：调出货率只改 data.js 一处、两处同步；显示文案 `胜利后约 38% 触发随机掉落：8% 装备或+60金 · 12% 药水 · 12% 蘑菇 · 6% 高级灵药` 逐字不变（0.38/0.08/0.12/0.12/0.06/60 全由常量推导），零 UI 回归。
- 【零回归面】未动掉落机制本身——判定顺序（先装备、再药水、再蘑菇、再灵药）、装备档升级对象与「已最好则 +60 金」分支、蘑菇档仅 dungeon/cave 生效否则并入药水、`hero.drops` 计数、成就「幸运眷顾」等 v5.2/v12.4 语义逐字不变。只新增五个常量 + 改两个引用点（rollDrop 判定/文案、帮助页 1 行）。
- 验证：`node --check js/data.js js/rules.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v16.0 专项冒烟（/tmp/jrpg_smoke_v160_drop.mjs）**22 项断言全过**——常量导出 0.08/0.12/0.12/0.06/60、帮助页文案由常量推导且与旧字面量逐字一致、真实 `rollDrop` 蒙特卡洛 20 万次分布逐字不变（雾语林≈8/12/12/6、合计≈38%、城镇蘑菇并入药水 24% 且绝不落蘑菇、装备档兜底 +60 金文案 `金币 +60` 原样）、rollDrop 存活代码与帮助页行源码中旧裸字面量 0.08/0.2/0.38/60/38% 已清除。

## v15.9 Boss 重击倍率单一数据源——真身/平时两档结算与逐招受击预判同读 HEAVY_MULT / HEAVY_MULT_PHASED（机制·单一口径，与 DEFEND_MULT / CRIT_MULT / SHIELD_MULT 同体系）

- 【`enemy.phased ? 2.3 : 1.9` 硬编码两处，预判与结算互不相关】敌方重击伤害 = `cmdDmg(敌攻, 我防, ×2.3 真身 / ×1.9 平时)`：这两个倍率以三元表达式裸写在 `enemyAI.js enemyAct`（结算，深渊之怒实伤）与 `view/drawBattle.js` Boss 逐招受击预判（`重击 -N血`，防御后预测）两处——同一个 2.3/1.9 两处互不相关：想调重击强度（如真身放宽到 2.5、平时收到 1.7）要改两个文件，还极易只改结算漏改预判，实际掉血变了预判却还报旧值对不上。v15.2 收口石甲时已点名防御「另一机制保持原样」，随后 v15.7/v15.8 连收中毒与防御，本作机制数值至此只剩重击倍率一处仍在结算/预判间裸奔。
- 【修正：data.js 新增 `HEAVY_MULT = 1.9` 与 `HEAVY_MULT_PHASED = 2.3` 为唯一真源】两处同读一份数据：`enemyAct` 重击结算改读 `enemy.phased ? HEAVY_MULT_PHASED : HEAVY_MULT`；`drawBattle` Boss 非真身/真身两分支受击预判改读同一表达式（与结算同式同序）。收益：调重击平衡只改 data.js 一处、两处同步；预判数值逐字不变（真身 2.3 / 平时 1.9 原样），零 UI 回归。
- 【零回归面】未动重击机制本身——判定时机（`pickAct` 按 `type:'heavy'` 权重选招）、`cmdDmg(atk, defMax, mult)` 公式（`mult=1` 时即普攻）、防御中再 ×DEFEND_MULT 取整、`phased` 由变身分支 `enemy.phased = true` 置位、重击震屏 `S.shake`（纯显示）等语义逐字不变。只新增两个常量 + 改两个引用点。
- 验证：`node --check js/data.js js/enemyAI.js js/view/drawBattle.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v15.9 专项冒烟（/tmp/jrpg_smoke_v159_heavy.mjs）**5 项断言全过**——常量导出 1.9/2.3、真实 `enemyAct` 驱动非真身重击伤害与 `cmdDmg(…, HEAVY_MULT)` 逐字耦合（且与真身档可区分）、真身重击伤害与 `cmdDmg(…, HEAVY_MULT_PHASED)` 逐字耦合；grep 确认两处可执行代码的裸 `? 2.3 : 1.9` 已清除。

## v15.8 防御架势数值单一数据源——结算、防御中横幅、受击/反击预判同读 DEFEND_MULT / DEFEND_MP / COUNTER_CHANCE / COUNTER_MULT（机制·单一口径，与 SHIELD_MULT / CRIT_MULT / POISON_PCT / FLEE_SUCCESS 同体系）

- 【0.5 / 2 / 0.5 / 0.7 散落三处，横幅与预判再各写自己的字面量】防御架势 = 防御中受到的最终伤害再 ×0.5 取整（保底 1）、防御回合回 2 MP、被命中 50% 几率趁隙反击（反击伤害 = `cmdDmg(英雄攻, 敌防, ×0.7)`，未传浮动参、值精确确定）：这四个数硬编码在 `battle.js doDefend`（回 2 MP）与 `enemyAI.js enemyAct`（减伤、反击判定、反击伤害三处），`view/drawBattle.js` 又各写自己的字面量（横幅「防御中 · 减伤50% · 回2MP/回合 · 50%几率反击」、受击预判再 ×0.5 取整、反击预判 ≈N伤 再 ×0.7）——同一个 0.5/2/0.5/0.7 五处互不相关：想调防御强度（如减伤放宽到 0.45、回蓝加到 3、反击概率提到 60%）要改三个文件四处，还极易只改结算漏改横幅/预判，结算已减 50% 界面却还标旧值，对不上；而写着「减伤50%」，玩家也看不出这数到底从哪来、靠不靠谱。v15.2 收口石甲时已点名此处防御「另一机制保持原样」，本作机制数值至此全部数据化收口。
- 【修正：data.js 新增 `DEFEND_MULT = 0.5 / DEFEND_MP = 2 / COUNTER_CHANCE = 0.5 / COUNTER_MULT = 0.7` 为唯一真源】四处同读一份数据：`doDefend` 回蓝改读 `Math.min(hero.mpMax, hero.mp + DEFEND_MP)`（满蓝不浪费、`gained` 驱动日志文案）；`enemyAct` 减伤改读 `Math.max(1, Math.round(dmg * DEFEND_MULT))`、反击判定改读 `Math.random() < COUNTER_CHANCE`、反击伤害改读 `cmdDmg(hero.atkMax, enemy.def, COUNTER_MULT)`（与预判同式同参、值确定）；横幅改由 `Math.round((1 - DEFEND_MULT) * 100)` + `DEFEND_MP` + `Math.round(COUNTER_CHANCE * 100)` 推导，受击/反击预判（Boss 与非 Boss 两分支）同读 DEFEND_MULT / COUNTER_MULT。收益：调防御平衡只改 data.js 一处、五处同步；显示文案 `防御中 · 减伤50% · 回2MP/回合 · 50%几率反击` 逐字不变（(1−0.5)×100=50、2、0.5×100=50 原样），零 UI 回归。
- 【零回归面】未动防御机制本身——判定时机（玩家行动回合起手 `hero.defending = true`、`playerAction` 经指令表 `defend: doDefend` 分发、战斗结算/下回合起手 `defending = false` 复位）、减伤后保底 1、反击在被命中判定内联（一回合至多一次）、反击值确定不掺随机（预判可放心展示）、设置类行动（药水/蓄力等）照旧耗回合等 v5.3/v6.7 起语义逐字不变。只新增四个常量 + 改四个引用点。
- 验证：`node --check js/data.js js/battle.js js/enemyAI.js js/view/drawBattle.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；v15.8 专项冒烟（/tmp/jrpg_smoke_v1580_defend.mjs）**39 项断言全过**——常量导出 0.5/2/0.5/0.7、横幅由常量推导且与旧字面量逐字一致、真实 `playerAction('defend')` 驱动回蓝（48→50 且满蓝不浪费）、真实 `enemyAct` 减伤与 `max(1, round(cmdDmg×DEFEND_MULT))` 逐字耦合、反击 0.4 触发 / 0.99 不触发且伤害与 `cmdDmg(hero.atkMax, enemy.def, COUNTER_MULT)` 逐字耦合、drawBattle Boss/非 Boss 两分支受击/反击预判同读常量、五处旧裸字面量已从源码清除、battle/enemyAI/drawBattle/data 的 import/定义/导出皆在位、防御中绘制不抛异常。

## v15.7 中毒每回合扣血比例/持续时间单一数据源——结算、战斗角标、施毒、帮助页/图鉴标注同读 POISON_PCT / POISON_TURNS（机制·单一口径，与 BURN_PCT / CRIT_MULT / SHIELD_MULT 同体系）

- 【0.05 散落两处、3 硬编码一处、帮助页/图鉴再各写一句字面量】中毒每回合扣血 = `max(2, round(hpMax×0.05))`：这个 0.05 硬编码在 `battle.js applyPoisonTick`（结算）与 `view/drawBattle.js` 战斗角标「每回合 -N血」两处；中毒持续回合 = 3 硬编码在 `enemyAI.js` 施毒分支（`hero.poison = 3`）；`data.js` 帮助页「毒蛇有 35% 概率使你中毒：每回合扣血（约5%最大HP）持续 3 回合」与毒蛇图鉴 `tag:'☠️ 会施毒 · 扣血3回合'` 又各写自己的字面量——同一个 5% 与 3 回合四处互不相关：想调中毒强度（如放宽到 6%）要改四个地方，还极易只改结算漏改角标/帮助页，结算扣 6% 界面却还标「约5%」对不上；而写着「约 5%」，玩家也看不出这数到底从哪来、靠不靠谱。本作其余机制（灼烧/暴击/石甲/蓄力/逃跑/困难倍率/试炼回血/元素克制/宝箱掉落）早已数据化，中毒是 v15.2 收口石甲后剩下的最后一处裸奔数值。
- 【修正：data.js 新增 `POISON_PCT = 0.05` 与 `POISON_TURNS = 3` 为唯一真源】四处同读一份数据：`applyPoisonTick` 结算改读 `Math.max(2, Math.round(hero.hpMax * POISON_PCT))`；战斗角标改由同一表达式推导（与结算逐字同源）；`enemyAct` 施毒改读 `hero.poison = POISON_TURNS`；帮助页改由 `Math.round(MON_BASE.find(m=>m.name==='毒蛇').poison * 100)`（施毒概率读 MON_BASE 真源）+ `Math.round(POISON_PCT * 100)` + `POISON_TURNS` 推导，图鉴毒蛇 tag 改由 `POISON_TURNS` 推导。收益：调中毒平衡只改 data.js 一处、四处同步；显示文案 `毒蛇有 35% 概率使你中毒：每回合扣血（约5%最大HP）持续 3 回合` 与 `☠️ 会施毒 · 扣血3回合` 逐字不变（0.05×100=5、3 原样），零 UI 回归。
- 【零回归面】未动中毒机制本身——结算时机（玩家行动回合起手，毒发先于行动）、伤害下限 `max(2,…)`、层数递减 `poison--`、施毒判定 `Math.random() < enemy.poison`（概率仍读 MON_BASE 毒蛇 `poison:0.35`）、治愈术 `cleanse` 解毒等 v12.x 语义逐字不变；`治愈术`/`启示` 等既有恢复/净化路径未动。只新增两个常量 + 改四个引用点。
- 验证：`node --check js/data.js js/battle.js js/view/drawBattle.js js/enemyAI.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v15.7 专项冒烟（/tmp/jrpg_smoke_v1570_poison.mjs）**30 项断言全过**——常量导出 0.05/3、帮助页与图鉴 tag 由常量推导且与旧字面量逐字一致、真实 `playerAction` 驱动中毒结算（200→-10 与 `max(2, round(hpMax×POISON_PCT))` 逐字耦合、层数 3→2、毒发先于攻击、floor=2 兜底、无中毒不触发）、真实 `enemyAct` 施毒（0.2<0.35 中 3 回合 / 0.9≥0.35 不中）、三处旧裸字面量已从源码清除、battle/drawBattle/enemyAI/data 的 import/定义/导出皆在位。

## v15.6 对话框文字自动换行——超宽长行不再右缘截断（体验·信息透明：对话逐字可读）

- 【对话框不换行，超宽行直接撞右缘被截】`view/menus.js drawTalk` 把每页对话按「数据里写死的一行 = 画面一行」（`drawRichLine` 只做【】金色强调与打字机截字，从不折行）直绘在 `x=136` 起点、无右缘约束——灯长任务 offer 那句「林子里的【魔法蘑菇】带着残灯的荧光——是灯油最后的原料。帮我找回 3 株，好吗？」实测 ~578px，超出可用宽 440px 十几个字，末尾「好吗？」被面板右框切掉一半；对全量对话页扫描（QUESTS.talk 各状态 + STORY + NPC 通用对话共 14 页 44 行）确认还有 `side_mushroom[done]`「谢谢你。井泉的灯油续上了…」~510px 同样超宽。这类问题以后新增长文案还会再犯——修数据只治这两句，不治根。
- 【修正：绘图层像素感知自动换行】`rules.js` 新增纯函数 `wrapTalkLine(line, maxW, measure)`：按 `measure`（注入 CTX.measureText，Node 冒烟可用假量宽）把逻辑行折成 ≤ 可用宽 440px 的视觉片段；【…】金色强调块在折行时整体换行不拆层（除非单块本身超宽才逐字兜底）。`drawTalk` 改用折行片段逐段绘制：打字机预算（`pageShownAt` 的每行字数）沿片段顺序消耗，视觉行数驱动面板高度向下扩（`bh = min(170, 140 + (行数-4)×27)`，`by+bh` 封顶 470 不越画布），单行物理超宽再也不截断。纯显示、零结算变化、不新增任何状态。
- 【验证】`node --check` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v15.6 专项冒烟（/tmp/jrpg_smoke_talk_wrap.mjs）**13 项断言全过**——灯长长行折 2 段全 ≤440px 且拼接还原原文、【魔法蘑菇】块不拆、窄宽兜底、空/null/短行安全、全量 14 页折行后无任何超宽或底部越界、drawTalk 渲染超宽页与打字机中途片段化渲染均不抛错；任务栏常驻冒烟（27 项）复跑仍全绿。

## v15.4 任务栏常驻显示——画布下方 DOM 不再随场景闪隐（体验·信息透明：目标时刻可见）

- 【任务栏只在 world/ending 两个场景出现，进战斗/商店/菜单/对话就消失】`view/hud.js renderHUD` 用 `qshow = S.scene === 'world' || S.scene === 'ending'` 控制 `#quest` 的 `show` class——平时在地图上有任务栏，一开战斗、一进商店/旅店/状态/图鉴/对话等 17 个场景就被 `display:none` 藏掉，「这一栏时显时不显」：玩家想随时扫一眼当前主线/支线目标（右下角信息透明主题的核心诉求）却要在世界图上才能看到，翻菜单时完全断供。
- 【修正：非开局前场景一律常驻】`qshow` 反转为 `S.scene !== 'title' && S.scene !== 'create' && S.scene !== 'story'`——`#quest` 是画布**下方**的 DOM 块（`index.html` 里位于 canvas 与 hud 之间），不遮挡任何画面，常驻零风险；仅在开局前的标题/建角/开场白三屏隐藏（彼时无进行中任务，显示空栏不和谐），其余 19 个场景（world/battle/shop/inn/brew/status/journal/codex/ach/help/travel/pause/talk/dead/win/ending 等）全部常驻显示。纯显示、零结算变化，不新增任何状态。
- 【验证】`node --check` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v15.4 专项冒烟（/tmp/jrpg_smoke_hud_questbar.mjs）**27 项断言全过**——title/create/story 隐藏、16 个进行中场景常驻、world→battle→world 切换不抖动、回 title 无残留、主线文案 🎯 前缀写入、questBannerLines 全新档案不抛错。

## v15.3 宝箱掉落概率/金币公式单一数据源——开箱判定与帮助页「宝箱掉落」标注同读 CHEST_*（机制·单一口径，与 CRIT_MULT/FLEE_SUCCESS/BURN_PCT 同体系，即 v14.9 声明「另一处独立概率，本次不碰」的宝箱开箱裸奔数值）

- 【0.6 / 0.45 / 12、5 散落两处，帮助页再写自己的字面量】开箱掉落 = 雾语林先判 `Math.random()<0.6` 得蘑菇、余下再判 `Math.random()<0.45` 得金币（数额 `12+级×5`）、否则药水；城镇/矿脉跳过蘑菇直接 45% 金币 / 55% 药水——这四个数硬编码在 `world.js onChestStep`，`data.js` 帮助页「宝箱掉落」行又各写一句字面量「60%蘑菇·18%金币(12+级×5)·22%药水；45%金币·55%药水」：想让蘑菇掉率放宽到 70% 要改两个地方，还极易只改判定漏改标注，实际掉率变了帮助页却还标旧值；而写着「60%」「18%」，玩家也看不出这数到底从哪来、靠不靠谱。v14.9 引入 FLEE_SUCCESS 时已点名此处「另一处独立概率，本次不碰」，本作机制数值至此全部数据化收口。
- 【修正：data.js 新增 `CHEST_MUSHROOM = 0.6 / CHEST_GOLD = 0.45 / CHEST_GOLD_BASE = 12 / CHEST_GOLD_PER_LV = 5` 为唯一真源】两处同读一份数据：`onChestStep` 判定改读 `Math.random() < CHEST_MUSHROOM` / `Math.random() < CHEST_GOLD`、金币改读 `CHEST_GOLD_BASE + hero.level * CHEST_GOLD_PER_LV`；帮助页「宝箱掉落」标注改由常量推导（蘑菇 `round(60×100)%`、雾语林金币 `round((1−0.6)×0.45×100)%`、药水补齐、城镇 45/55 同源）。收益：调开箱平衡只改 data.js 一处、两处同步；显示文案 `60%蘑菇·18%金币(12+级×5)·22%药水；45%金币·55%药水` 逐字不变（60/18/22/45/55 全由常量推导），零 UI 回归。
- 【零回归面】未动开箱机制本身——判定顺序（dungeon 先判蘑菇）、金币公式（12+级×5）、任务蘑菇保护/集齐提示（`setSideQuest`）、已开宝箱格等同地面等 v12.10 语义逐字不变。只新增四个常量 + 改两个引用点。
- 验证：`node --check js/data.js js/world.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v15.3 专项冒烟（/tmp/jrpg_smoke_v1530_chest.mjs）**22 项断言全过**——常量导出 0.6/0.45/12/5、帮助页标注由常量拼接推导且与旧字面量逐字一致、两处旧裸字面量已从源码清除、world.js 改读 CHEST_*、`onStep` 真实开箱蒙特卡洛 3 万次分布逐字不变（雾语林≈60/18/22、城镇≈45/55、绝不落蘑菇、金币 Lv.5→37）、drawHelp 第 3 页渲染不抛异常且纯显示收敛。

## v15.2 石甲减伤倍率单一数据源——结算、预览、凝甲提示同读 SHIELD_MULT（机制·单一口径，与 CRIT_MULT/FLEE_SUCCESS/BURN_PCT 同体系，即 v14.9 声明「保持原样」的最后一处裸奔数值）

- 【0.6/40% 散落三处且互不相关】石甲减伤 = 命中最终伤害再 ×0.6 取整（保底 1）并消耗 1 层：这个 0.6 硬编码在 `battle.js attackMove`（结算）与 `rules.js withShield`（伤害预览）两处，`enemyAI.js` 凝甲博客又自己写一个派生值「所受伤害降低 40%」——同一个 0.6 三处互不相关：想调石甲强度（如放宽到 0.5，减伤 50%）要改三个地方，还极易只改结算漏改预览/提示，结算减 40% 界面却还标「×0.6」/「降低 40%」对不上；而写着「40%」，玩家也看不出这数到底从哪来、靠不靠谱。v14.9 引入 FLEE_SUCCESS 时已点名此处「保持原样」，本作机制数值至此全部数据化收口。
- 【修正：data.js 新增 `SHIELD_MULT = 0.6` 为唯一真源】三处同读一份数据：`attackMove` 结算改读 `Math.max(1, Math.round(dmg * SHIELD_MULT))`；`withShield` 预览改读同一表达式；`enemyAI` 凝甲提示改由 `Math.round((1 - SHIELD_MULT) * 100)` 推导。收益：调石甲平衡只改 data.js 一处、三处同步；显示文案 `·所受伤害降低 40%` 逐字不变（(1−0.6)×100=40），零 UI 回归。
- 【零回归面】未动石甲机制本身——命中时判定时机（attackMove 起手）、减伤后消耗 1 层、保底 1、伤害预览 `atkEstimate/skillEstimate` 经 withShield 与结算逐字同源（不虚报 ≈N伤）、技能 `陨石术 breakShield` 碎甲走后门、失败收益等 v12.x 语义逐字不变。只新增一个常量 + 改三个引用点。README 既有「与命中结算的 `×0.6` 逐字同源」一句语义不变。
- 验证：`node --check js/data.js js/rules.js js/battle.js js/enemyAI.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v15.2 专项冒烟（/tmp/jrpg_smoke_v1520_shield.mjs）**24 项断言全过**——常量导出 0.6、提示由常量推导=40、预览有甲=无甲×SHIELD_MULT 取整（含保底 1 与无甲原样）、技能预览同源、真实攻击命中石甲（Math.random 固定 0.99 钉死判定）消耗 1 层且伤害与 `cmdDmg×SHIELD_MULT` 逐字耦合、无甲对照组不受减伤、三处旧裸字面量/自写 40% 已从源码清除、battle/rules/enemyAI 的 import 与同式皆在位、战斗画面/状态页绘制不抛异常。

## v15.1 普攻暴击率/暴击倍率单一数据源——判定、结算、状态页标注同读 CRIT_RATE / CRIT_MULT（机制·单一口径，与 FLEE_SUCCESS/BURN_PCT/CHARGE_MULT 同体系）

- 【暴击 0.12 与 ×1.8 散落三处，且状态页再写自己的字面量】普攻暴击判定 `Math.random() < 0.12` 硬编码在 `battle.js doAttack`，暴击倍率 `? 1.8 : 1` 硬编码在 `battle.js attackMove`（结算），状态页（`menus.js drawStatus`）又另写一句 `· 普攻12%暴击 ×1.8`——同一个 12% 与 ×1.8 三处互不相关：想调暴击平衡（如放宽到 15%、加到 ×2.0）要改三个地方，还极易只改判定漏改标注，结算暴击率变了界面却还标旧值；而写着「12%」「×1.8」，玩家也看不出这数到底从哪来、靠不靠谱。本作其余机制（蓄力 ×1.5 / 逃跑 60% / 灼烧 4% / 困难倍率 / 试炼回血 / 元素克制）早已数据化，暴击是又一处还在裸奔的数值。
- 【修正：data.js 新增 `CRIT_RATE = 0.12` 与 `CRIT_MULT = 1.8` 为唯一真源】三处同读一份数据：`doAttack` 判定改读 `Math.random() < CRIT_RATE`；`attackMove` 结算改读 `(isCrit ? CRIT_MULT : 1)`；状态页标注改由 `'· 普攻' + Math.round(CRIT_RATE * 100) + '%暴击 ×' + CRIT_MULT` 推导。收益：调暴击平衡只改 data.js 一处、三处同步；显示文案 `· 普攻12%暴击 ×1.8` 逐字不变（0.12×100=12、1.8 原样），零 UI 回归。
- 【零回归面】未动暴击机制本身——判定时机（doAttack 起手）、浮动伤害区间 `cmdDmg` 的 0.9~1.1 方差、震屏（暴击 pow=4）、日志 💥/（暴击！）、脆皮怪一击致胜走 `finishPlayer→winBattle` 等语义逐字不变；`攻击Move` 同时服务技能（crit 恒为 false），判暴击只影响普攻，未动技能路径。只新增两个常量 + 改三个引用点。
- 验证：`node --check js/data.js js/battle.js js/view/menus.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v15.1 专项冒烟（/tmp/jrpg_smoke_v1510_crit.mjs）**23 项断言全过**——常量导出 0.12/1.8、标注由常量推导且与旧字面量逐字一致、0.05<0.12 暴击（伤害与 `cmdDmg×CRIT_MULT` 逐字耦合、日志/震屏 pow=4/回合+1）、0.99≥0.12 普通（伤害与 `cmdDmg×1` 一致、无暴击文案）、三处旧字面量已从源码清除、data 常量/导出与 battle/menus 的 import 皆在位。

## v15.0 灼烧每回合扣血比例单一数据源——结算、角标、技能提示同读 BURN_PCT（机制·单一口径，与 FLEE_SUCCESS/CHARGE_MULT/DIFF_SCALE 同体系）

- 【0.04 散落三处，且提示再写一句字面量「约4%」】火焰斩的灼烧每回合扣血 = `max(2, round(hpMax×0.04))`：这个 0.04 硬编码在 `enemyAI.js enemyAct`（结算）与 `view/drawBattle.js`（战斗角标「每回合 -N血」）两处，data.js 火焰斩提示又各自写死「约4%最大HP」——同一个 4% 三处互不相关：想调灼烧强度（如放宽到 5%）要改三个地方，还极易只改结算漏改角标/提示，结算烧 5% 界面却还标「约4%」，对不上；而写着「约 4%」，玩家也看不出这数到底从哪来、靠不靠谱。本作其余机制（蓄力 ×1.5 / 逃跑 60% / 困难倍率 / 试炼回血 / 元素克制）早已数据化，灼烧是又一处还在裸奔的数值。
- 【修正：data.js 新增 `BURN_PCT = 0.04` 为唯一真源】三处同读一份数据：`enemyAct` 灼烧结算改读 `Math.max(2, Math.round(enemy.hpMax * BURN_PCT))`；战斗角标 `每回合 -N血` 改由同一表达式推导（与结算逐字同源，一眼看清烧多少）；火焰斩提示改由 `Math.round(BURN_PCT * 100)` 推导。收益：调灼烧平衡只改 data.js 一处、三处同步；显示文案 `·每回合 -8血` / 提示 `·灼烧2回合·每回合约-4%最大HP` 逐字不变（0.04×100=4），零 UI 回归。
- 【零回归面】未动灼烧机制本身——伤害下限 `max(2,…)`、层数递减 `burn--`、每回合结算时机（enemyAct 开头）、灼烧致死走 `winBattle` 早退等 v12.x 语义逐字不变；火焰斩 `burn:2`（层数）原就在 data.js，保持不动。只新增一个常量 + 改三个引用点。
- 验证：`node --check js/data.js js/enemyAI.js js/view/drawBattle.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v15.0 专项冒烟（/tmp/jrpg_smoke_v1500_burnpct.mjs）**19 项断言全过**——常量导出为 0.04、提示由常量推导且与旧字面量逐字一致、结算伤害与 `max(2, round(hpMax×BURN_PCT))` 逐字耦合（200→8 / 20→2 兜底）、灼烧致死走 winBattle 早退不触发攻击分支、角标与结算同常量、两处旧裸 `hpMax * 0.04` 已从源码清除、data 常量/导出/import 皆在位。

## v14.9 逃跑成功率单一数据源——判定与指令栏/帮助页文案同读 FLEE_SUCCESS（机制·单一口径，与 CHARGE_MULT/DIFF_SCALE/RUSH_RECOVER 同体系）

- 【逃跑成功率 0.6 散落三处，且指令栏/帮助页各写自己的字面量】普通怪逃跑判定 `Math.random() < 0.6` 硬编码在 `js/battle.js doFlee`，战斗指令栏（`view/drawBattle.js`）却另写一句「成功率约60%」，帮助页（`data.js HELP_PAGES[0]`）再写一处「约60%」——同一个 60% 三处互不相关：想调逃跑平衡（如放宽到 65%）要改三个地方，还极易只改判定漏改文案，结算是 65% 界面却还标「约60%」，对不上；而写着「约 60%」，玩家也看不出这数到底从哪来、靠不靠谱。本作其余机制（蓄力 ×1.5 / 元素克制 / 困难倍率 / 试炼回血）早已数据化，逃跑率是最后几个还在裸奔的数值之一。
- 【修正：data.js 新增 `FLEE_SUCCESS = 0.6` 为唯一真源】三处同读一份数据：`battle.doFlee` 判定改读 `Math.random() < FLEE_SUCCESS`；指令栏标注改由 `Math.round(FLEE_SUCCESS * 100) + '%'` 推导；帮助页战斗行改由同一常量推导。收益：调平衡只改 data.js 一处、三处同步；显示文案 `·成功率约60%` / `4逃跑(约60%)` 逐字不变（0.6×100=60），零 UI 回归。
- 【零回归面】未动逃跑逻辑本身——Boss 气场压制不可逃、「逃败真实耗回合」等 v14.1 语义逐字不变；石甲的 `×0.6` 减伤是另一机制（rules.attackMove），保持原样；`world.js` 宝箱开出蘑菇的 0.6 是另一处独立概率，本次不碰。只新增一个常量 + 改三个引用点。
- 验证：`node --check js/data.js js/battle.js js/view/drawBattle.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v14.9 专项冒烟（/tmp/jrpg_smoke_v1490_flee.mjs）**16 项断言全过**——常量导出为 0.6、帮助页/指令栏文案由常量推导且与旧字面量逐字一致、三种逃跑行为正确（0.5 成功逃脱回 world、0.99 失败留在战场且 battleTurn+1、Boss 气场压制不耗回合）、三处旧字面量与裸 `0.6` 已从源码清除、石甲 ×0.6 保持不动。

## v14.8 无字回廊昼夜标签如实「恒暗」——「被忘掉的地方没有晨昏」（体验打磨·纯显示，承接 v14.6 昼夜标签 / 地图指南同步）

- 【回廊画面恒暗但 HUD 仍报世界时钟阶段】无字回廊是「被忘掉的地方没有晨昏」——画面着色 `drawTimeTint` 对 `gallery` 特判跳过昼夜、恒按 `rgba(10,8,28,.42)` 暗色渲染，但此前 HUD 的昼夜标签（`☀️ 白天 / 🌆 黄昏 / 🌙 夜晚 / 🌅 黎明`）仍无条件读世界时钟 `S.G.time` 的阶段：正午走进回廊，全屏一片昏暗的同时 HUD 却标着「☀️ 白天」，同一处设计在两处互相对着说——新玩家看到「名字 · 无字回廊 · ☀️白天」会以为回廊也分昼夜，与「恒暗无晨昏」的剧情口吻（README「恒暗无晨昏」/ 地图指南）自相矛盾。
- 【修正：回廊改标 🌑 恒暗】`view/hud.js renderHUD` 昼夜标签改为与 `drawTimeTint` **同判 `curMap()==='gallery'`、同读 `S.G.time`**：无字回廊内显示 `🌑 恒暗`（与画面着色、剧情文案三处同口径），其余四图照常显示 90 秒一档的昼夜标签，非回廊零差异。
- 【零回归面】只改 `js/view/hud.js` 一处（`renderHUD` 的 `s-map` 拼装，+1 行变量 + 注释）；未动 `drawTimeTint`（着色判定维持不动）、`data.js`、任何地图/遇敌/战斗/存档逻辑；`periodTag` 仅影响 `s-map` 文本，HUD 其余元素逐字不变。README「昼夜标签」一句同步补注（回廊恒暗）。
- 验证：`node --check js/view/hud.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v14.8 专项冒烟（/tmp/jrpg_smoke_v1480_gallerydark.mjs）**15 项断言全过**——回廊内 `s-map` 含 `🌑 恒暗`、不再含任何昼夜标签，回廊外四图 `S.G.time` 四个阶段（0/95/185/275）标签逐字正确（白天/黄昏/夜晚/黎明）、村镇切回廊再切回标签随地图切换即时联动、非回廊零差异、完整 `renderHUD` 连续 20 次不抛异常、无 document 兜底不抛。

## v14.7 帮助「地图指南」页终焉之神定位同步——第四张地图补入指南（体验打磨·纯数据，承接 v14.5 图鉴 LOC 修正）

- 【地图指南页漏网：终焉之神仍指向旧址】v13.7 剧情重构时终焉之神已随主线从「星井矿脉·终焉水晶」迁至**无字回廊东端祭坛**（矿脉的终焉水晶变为双徽记开门机关），v14.5 已修正记忆图鉴 `whereFind` 的 LOC 表——但 **H 帮助的「地图指南」页（HELP_PAGES[1]）仍在星井矿脉行写着 `中央终焉水晶(隐藏真Boss)`**，同一处过时信息的最后一处漏网：新玩家按 H 翻到地图指南，会被明确告知「去矿脉中央水晶找隐藏真Boss」，实际那里只能开一扇门，终焉之神在回廊尽头——与图鉴/README/实际地图（data.js `MAPS.gallery` 东端祭坛）三方说法都不一致。
- 【无字回廊未入地图指南】第四张地图「无字回廊」（名字石碑·残焰魔像·终焉之神）已存在多时，但地图指南页只列了三张地图 + 通关之路——回廊这张高难终局图在帮助里完全缺席，玩家打到双徽记开门后全靠摸黑。
- 【修正】`js/data.js` `HELP_PAGES[1]` 三行：星井矿脉行由 `中央终焉水晶(隐藏真Boss)` 改为 `中央终焉水晶集齐双徽记后化为门`（与 README「水晶化为门 → 无字回廊」逐字同口径）；新增 `无字回廊` 行 `名字石碑·残焰魔像·东端祭坛藏终焉之神（极高难）`（地图名/内容与 `MAPS.gallery`、`TRAVEL_LIST` 推荐 Lv.10 风格同源）；通关之路行改为四幕链 `讨回灯芯 → 击败洞窟领主 → 双徽记开门 → 回廊尽头面对终焉之神`（呼应 v13.7 四幕结构）。
- 【零回归面】只改 `js/data.js` `HELP_PAGES[1]` 三行（纯显示数据）；未动任何地图/遇敌/Boss/结算/存档逻辑，`drawHelp` 逐字不变（5 行内容 y=80~216 仍在面板 452 界内）；其余三页帮助条目逐字未动。
- 验证：`node --check js/data.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v14.7 专项冒烟（/tmp/jrpg_smoke_v1470_helploc.mjs）**19 项断言全过**——旧文案「隐藏真Boss」与「终焉之神在矿脉」双重清除、星井矿脉行化为门文案、无字回廊行四要素（碑/精英/东端/终焉之神）与 `MAPS.gallery.name` 逐字同源、通关之路四幕链、其余三页帮助逐字在位、drawHelp 第 2 页 5 行绘制不抛异常且全部落在面板内、绘制不改 scene/helpPage（纯显示收敛）。

## v14.6 HUD 常驻攻防读数——大地图一眼可见当前战力（体验打磨·信息透明·纯显示）

- 【攻防是全局最被依赖的一对数字，却只有开 `I` 状态页或进战斗才看得到】本作所有决策都围着这对数转：商店换装比差值、选怪刷练估能不能打、祭坛/试炼碑前犹豫敢不敢开战、战斗里的「我方 攻X 防Y ⚔ 敌方」对比行与防御减伤、敌方攻击预判全读 `atkMax/defMax`——可大地图 HUD 只显示 ⚔️武器名/🛡️防具名，数值本身要按 `I` 或进一仗才能看见。买了把剑到底攻涨到几？面对 ⚠Lv.8 祭坛的召唤能不能接？都要额外开界面去查。
- 【修正：HUD 常驻 `⚔️攻 N · 🛡️防 N` 读数】HUD 第一行统计区（Lv/HP/MP/EXP 之后）新增两个元素：`⚔️攻<b id="s-atk">` 与 `🛡️防<b id="s-def">`，每次 `renderHUD` 从 `hero.atkMax/defMax` 即时写入——与状态页/战斗对比行/商店差价**逐字同源**（都用 `applyStats` 算出并落地的同一对字段），换装、升级、吃药、难度建档后即时刷新，不进战斗也一眼看清当前战力。
- 【零回归面】纯显示层：只改 `js/view/hud.js`（`renderHUD` 加 2 行赋值）与 `index.html`（HUD 加 2 个 span）；未动任何战斗/掉落/结算/存档/平衡数值，`atkMax/defMax` 的生成与消费方（`rules.applyStats`、`drawBattle`、`drawStatus`、`drawShop` 差价）逐字不变。顺带修正壳页帮助条一处过时文案：战斗指令已增到 6 键（攻击/技能/药水/逃跑/防御/蓄力），`战斗中 1-4 指令` → `1-6 指令`（纯文案，与 HELP_PAGES 的 6 键表对齐）。
- 验证：`node --check js/view/hud.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）；新增 v14.6 专项冒烟（/tmp/jrpg_smoke_v1460_hudstats.mjs）**12 项断言全过**——`renderHUD` 对 DOM 桩写入 `s-atk/s-def` 且与 `hero.atkMax/defMax` 逐字一致、换装（木剑→铁剑/布衣→皮甲）后读数即时刷新、`atkMax` 缺省时兜底 0 不写 NaN、既有元素（s-weapon/s-armor/s-snd/s-map）回归在位、完整 `renderHUD` 不抛异常。

## v14.5 图鉴位置标注修正——终焉之神随剧情迁址、残焰魔像补齐定位（体验打磨·纯显示）

- 【终焉之神位置已过时】v13.7 剧情重构时终焉之神已随主线从「星井矿脉·终焉水晶」迁至**无字回廊东端祭坛**（矿脉的终焉水晶变为开门机关），但记忆图鉴 `whereFind` 的 LOC 表仍写旧址「星井矿脉·终焉水晶」——图鉴已讨伐行显示的位置与实际地图（data.js `MAPS.gallery` 东端 `SB` 祭坛）不符。
- 【残焰魔像缺失定位】无字回廊中段精英「残焰魔像」（图鉴第 13 种）此前不在 LOC 表里，图鉴已讨伐行会笼统误显示「草丛随机遇敌」，而它实际是**固定坐标的 Boss 位精英**（MAPS.gallery 中段 `MB`），跟草丛随机遇敌不是一回事。
- 【修正】`js/view/menus.js` 的 `whereFind` LOC 表两处：终焉之神 → 「无字回廊东端」（与主线 `main_true` 地点同源：回廊尽头）、残焰魔像 → 「无字回廊中段」（与地图 `MB` 坐标同源）；其余条目逐字不变（石心魔像·稀有精英 / 幽冥魔王·雾语林祭坛 / 洞窟领主·星井矿脉深处）。Lv.3 出没门槛标注逻辑（`spawnLv`）不受影响。
- 【零回归面】只改 `js/view/menus.js` `whereFind` 一行 LOC 表（含注释），未动 `data.js`（地图/遇敌/图鉴标签）、`rules.js`、任何结算/存档/遇敌逻辑；图鉴绘制（drawCodex）仅读取展示，不涉判定。
- 验证：`node --check js/view/menus.js` 与 `npm run check`（25 模块）全部通过；`npm test` **89/89 + 8/8** 全绿（回归不受影响）。

## v14.4 对话框再进化——标点停顿/逐字音效/【】金色强调/说话人肖像框/面板弹出（纯显示·节奏单一数据源）

- 【标点会「呼吸」】打字机节奏数据化为 `rules.js` 的 `talkCharMs/pageTotalMs/pageShownAt`：每字 28ms，标点（，。！？…—）停 4 拍——`core.talkNext` 的补全判定与 `drawTalk` 的渲染**同读一份节奏表**（替代原先两处各自硬编码 28ms 的隐式双轨），长台词从此有抑扬。
- 【逐字音效】打字过程中每 3 字一声轻响（`SFX.tick`，1150~1300Hz 随机微飘，模块游标随页/锚重置，翻页不炸音）——JRPG 对话的「声音指纹」。
- 【【】金色强调】正文里的【魔法蘑菇】【圣光之剑】等强调词渲染为金色（`drawRichLine` 按 `【…】` 分段、随打字机已显字数截断，分段绘制不断字）。
- 【说话人肖像框】面板左侧 64×64 肖像位：普通 NPC 画 MiniWorld 造型（与大地图同源），名字石碑画碑体——谁在说话/在读什么一眼可辨。
- 【面板弹出】对话开启时 140ms 淡入上浮（`S.talkStartAt` 只在 openTalk 设置，翻页不重放）；打字机正文改由肖像右侧排版。
- 验证：`npm run check` + `npm test` **89/89 + 8/8** 全绿（新增 4 项断言：标点 4 拍节奏、渐进显字、超时全显、石碑/NPC 肖像渲染不抛错）。未动对话内容、任务接交与场景切换。

## v14.3 商店买不起报「精确差价」——从笼统「（不足）」到一眼看差多少金（体验打磨·信息透明，承接 v3.13 旅馆差额 / v3.14 酿造差额 / v14.2 技能「还差 N MP」）

- 【商店是全游戏唯一「买不起不给差额」的界面】杂货商店买不起的装备/药水价格行此前只笼统标 `（不足）`——差 5 金还是差 500 金要自己拿顶部「💰 金币」那行心算；而旅馆（`还差 N 金，无法入住`）、酿造锅（`还差 X 株蘑菇、Y 金币`）、战斗技能菜单（`⛔ 还差 N MP`）全都已按短缺口径直接报出差额——同一套「还差 N」信息透明体系，唯独商店没跟上：新手盯着 `600💰（不足）` 想买勇者之剑，完全不知道还差多少钱、要不要先去刷两趟雾语林。
- 【修正：价格行直接报出确切差价】装备/药水买不起时，价格列由 `600💰（不足）` 改为 `600💰（还差 500 金）`——`N = it.price − hero.gold`，与顶部金币读数同源、零心算；药水因**背包满 99**（而非缺钱）买不起时如实标 `（背包满）`，绝不误报成「还差钱」（买不起的两个原因一眼区分）；买得起时不标任何后缀（`15💰` 保持原样）。纯显示、零结算变化——不碰 `buyPotion/buyWeapon/buyArmor` 的购买判定，只改价格列文案。
- 【零回归面】只改 `js/view/menus.js` 的 `drawShop` 一处（价格列分支，`+7 行`含注释）；未动 `shop.js`（购买/背包上限/蘑菇保护判定）、`data.js`（价格/属性）、任何金币结算或商店键位；价格列右对齐 x=560 反延的差价文本实测最宽约 100px（自 460 起）不与左起 x=86 的商品名行重叠。
- 验证：`node --check js/view/menus.js` 与 `npm run check`（24 模块）全部通过；`npm test` **85/85 + 8/8** 全绿（回归不受影响）；新增 v14.3 专项冒烟（/tmp/jrpg_smoke_v1430_shopgap.mjs）**16 项断言全过**——金币 30 时铁剑/皮甲/秘银剑/龙鳞甲逐项报出精确差额（80/60/220/480−30）、不再出现笼统「（不足）」、买得起的药水无后缀、恰好 80 金买铁剑无差价而更贵的秘银剑（220−80=140）仍报、药水满 99 标「背包满」且不误报差价、0 金币全行报差额且无负数、`drawShop` 重复绘制金币/药水背包零改动（纯显示收敛）。

## v14.2 技能菜单「MP 不足还差 N」口径——红色 MP 成本行下方直读短缺口数（体验打磨·信息透明，承接 v12.5 技能伤害提示 / v14.0 蓄力预览）

- 【只见红字不知道差几点】战斗技能菜单（`2`）右侧的成本列早已会红字标注 `MP N`（红=不足·蓝=够用·灰=封印），但 MP 不足时**只告诉玩家「放不起」，不告诉差多少**——差 1 点还是差 11 点，要自己拿 `当前 MP：x/y` 那一行心算。低级时 MP 紧张、连放两招就空蓝的场景，玩家经常盯着 `MP 8` 的红色干瞪眼：到底还差几点？值不值得先防御回 2 MP / 喝一口药再放？
- 【修正：hint 行右侧常驻短缺口数】MP 不足的技能，在其灰色 hint 行（技能名下方一行）的**右侧**补一条右对齐的红色 `⛔ 还差 N MP`——`N = skill.mp − 当前MP`，一眼看清差几点、回几 MP 够不够放。与 MP 成本行、`doSkill` 的 `mp` 判定同源，纯显示、零结算变化：蓝（够用）与 ⛔封印（灰置）的技能不显示；恰好够用（`mp === skill.mp`）不显示；hint 文本不丢失（短缺口径独占 hint 行右侧空档：hint 左起 x=188 最长约 165px 至 353，短缺口径右对齐 x=474 反延约 70px、自 404 起，逐字无重叠）。
- 【零回归面】只改 `js/view/drawBattle.js` 的 `drawSkillMenu` 一处（`+4` 行含注释）；未动 `data.js`/`rules.js`/任何伤害/MP/技能/封印判定、存档、遇敌或难度曲线。
- 验证：`node --check js/view/drawBattle.js` 与 `npm run check`（24 模块）全部通过；`npm test` **85/85 + 8/8** 全绿（回归不受影响）；新增 v14.2 专项冒烟（/tmp/jrpg_smoke_v1420_skillmp.mjs）**16 项断言全过**——MP=6 时恰 2 条短缺口径（雷鸣差2 + 陨石术差8）、火焰斩/治愈术够用不标、短缺口径右对齐 x=474 且红色 #e14b3f 且落在该技能 hint 行 y=212（不挤技能名行）、与 hint 无重叠、成本行颜色蓝/红回归、恰好够用（MP=14=陨石术）不显示且全蓝、封印治愈术 MP 不足不发短缺口径（仅 3 条且无 ⛔还差2）且成本行灰置、满 MP 短缺口径清零、`当前 MP` 行照常、完整 `drawBattle` 不抛异常。

## v14.1 回合计数如实行——「⚔️ 回合 N」只在行动被实际消耗时推进（机制修正·纯计数）

- 【此前被拒指令 / Boss 逃跑也会虚涨回合】战斗左上角的 `⚔️ 回合 N` 计数在 `playerAction` 起手处**无条件 +1**：MP 不足、无药可喝、技能未学、被气场封印这些「什么都不消耗」的被拒指令，以及 Boss 战按 `4` 逃跑（日志明说「本回合行动保留、不耗回合、不调度敌方行动」），都会白白把计数推高一格——按几下废键，回合数就虚高几回合，与「不耗回合」的文案自相矛盾（长盘 Boss 战按几次 4 试逃跑，计数悄无声息地漂移）。
- 【修正：计数移到 afterPlayer】`playerAction` 起手不再 +1，改在 `afterPlayer`（真正调度敌方回合之前）推进——只有确实消耗了本回合的行动才 +1：攻击/技能/药水/防御/蓄力/逃跑失败照旧「每行动一次进一回合」；Boss 战逃跑、逃跑成功、各类被拒指令不进回合。展示层 `drawBattle` 只读数，行为与既有「结算/标注同源」体系一致。
- 【零回归面】只改 `js/battle.js` 两处（`playerAction` 删一行 +1、`afterPlayer` 加一行 +1 并附注释）；未动任何伤害/掉落/经验/金币/难度/升级曲线、敌方行动、存档结构。`S.battleTurn` 的「开战重置 1 / 左上角绘制」语义逐字不变。
- 验证：`node --check js/battle.js` 与 `npm run check`（24 模块）全部通过；`npm test` **85/85 + 8/8** 全绿（回归不受影响）；新增 v14.1 专项冒烟（/tmp/jrpg_smoke_v1410_turncount.mjs）**17 项断言全过**——startBattle 残留 99→1、普攻消耗行动 +1→2 且调度敌方回合、Boss 战按 4 日志含「行动保留」且 battleBusy 释放且回合不虚涨、MP不足/无药满状态/技能未学三种被拒均不 +1 且 battleBusy 释放可再操作、治愈术/防御/蓄力照常 +1→2、击杀收尾不推进（胜利结算不入敌方回合）、battleTurn=7 时 drawBattle 绘制无异常。

## v14.0 蓄力语义收敛——治疗不再吞蓄力，不再谎称「蓄力加持」（机制修正·小数值不变）

- 【此前治疗会白吃蓄力还谎称加成】蓄力（`6`）的官方口径是「下一次攻击或技能**威力** ×1.5」（`doCharge` 日志与帮助页同文），只加成威力不涉治疗。但 `doSkill` 里**所有**技能都在开头统一 `hero.charge = false`——治疗也不例外：蓄力中按「治愈术」会**消耗掉蓄力**，且战斗日志还标 `（蓄力加持）`，可治疗量却与未蓄力时**逐字相同**（`Math.round(hpMax×0.55)`，预览 `skillEstimate` 同样不加成）——既骗了一次关键的奶量，又把攒好的蓄力白白烧掉，玩家在残血时「蓄力→自愈→下回合爆发」的连招根本不存在。
- 【修正：治疗保留蓄力 + 日志如实】`doSkill` 改为 `if (charged && skill.kind !== 'heal') hero.charge = false`——只有攻击/伤害技能才消费蓄力，**治疗（治愈术）完整保留蓄力**，下一次攻击/伤害技能仍按 ×1.5 结算（与 `doCharge` 文案「攻击或技能威力」一致）；日志尾缀由谎称的 `（蓄力加持）` 改为如实的 `（蓄力保留）`。残血时可以先奶一口维持战线，蓄力留到下一次爆发——连招成立，零数值改动（治疗量公式、伤害公式、蓄力倍率、预览口径全部逐字不变）。
- 【技能菜单同步标注（信息透明·纯显示）】`view/drawBattle.js drawSkillMenu` 治疗行在蓄力中追加 `·蓄力保留`（` +55HP ·解毒 ·蓄力保留`），未蓄力不标——开菜单一眼看清这口奶会不会吃掉蓄力，与结算同源、零第二口径；文本估算宽度约 245px 自 x=170 起不触右缘 MP 列（474 右对齐）。
- 【零回归面】只改 `js/battle.js`（doSkill 一处判定 + 一行日志文案）与 `js/view/drawBattle.js`（治疗预览拼接一行）；未动 `rules.js`（预览仍与结算同源、蓄力只进伤害路径）、`data.js`、遇敌/掉落/经验曲线、Boss 战与存档结构。
- 验证：`node --check js/battle.js js/view/drawBattle.js` 与 `npm run check`（24 模块）全部通过；`npm test` **85/85 + 8/8** 全绿（回归不受影响）；新增 v14.0 专项冒烟（/tmp/jrpg_smoke_v1400_chargeheal.mjs）**15 项断言全过**——治疗生效且回复量 = round(hpMax×0.55) 封顶、蓄力中治疗 `charge` 保留为 true、MP 照扣 5、日志含「蓄力保留」且不含「蓄力加持」、治疗不伤敌、技能菜单蓄力中治疗行带「·蓄力保留」而蓄力外不带、伤害技能照常消费蓄力且命中（×1.5 路径不坏）并标「（蓄力）」、「当前MP」行蓄力标注随状态显隐、`skillEstimate` 治疗预览蓄力前后逐字相同（结算/预览同源）。README 蓄力一行措辞微调同步。

## v13.9 每级成长透明化——创建页常驻「升级成长」标注（体验打磨·信息透明，承接 v6.6 经验读数 / v8.0 困难倍率标注 / v7.2 升级结算）

- 【创建页从不告诉你「练一级得到什么」】角色创建页自 v1.x 起只有 姓名/难度 两项选择：难度一行已常驻困难倍率标注（v8.0，`DIFF_SCALE`），**唯独角色的成长曲线一个数字都不给**——每升一级 HP/MP/攻/防各加多少，从 v1.x 起就藏在 `data.js baseStats`（`38+lv×7 / 12+lv×4 / 7+lv×2 / 3+lv×2`）里，只在胜利后那条一闪而过的升级横幅（`🎉 等级提升到 Lv.N！HP+7 MP+4…`）里才看得到；还没进游戏的新玩家对自己的英雄「会怎么成长」毫无概念，规划吃 Boss 前「再练两级能不能扛住」也没法在选角时评估。现在创建页在困难倍率行正下方**常驻一行**：`每级成长：HP+7 · MP+4 · 攻+2 · 防+2`——选角、换档、重开必经此页，一眼看清这套成长曲线，与「强度/倍率/奖励全透明」同一体系。
- 【与结算逐字同源（单一数据源）】成长数据化为 `data.js` 的 `LEVEL_GROWTH` 常量——由 `baseStats(2) − baseStats(1)` **一阶差分推导**（等级恒为 HP+7 / MP+4 / 攻+2 / 防+2）：升级结算（`hero.grantXp` 的 dh/dm/da/dd）与创建页标注同源于同一个 `baseStats`，改成长曲线只需改 `baseStats` 一处，结算、胜利横幅、创建页绝无第二套口径。只读展示，不参与任何判定。
- 【零行为风险】只改 `js/data.js`（+1 纯常量 `LEVEL_GROWTH`、+1 export）与 `js/view/menus.js`（+import、`drawCreate()` 加 1 行 `fillText`，坐标 (320,408) 为既有空档——上距困难倍率行 26px、下距按键提示行 24px，实测文本估算宽度 224px 不越界、不与任何既有元素重叠）；**未动** `baseStats`、`grantXp`、升级判定/经验曲线、任何战斗/掉落/等级/存档逻辑。`drawCreate` 既有各行（困难倍率 / 姓名 / 难度 / 按键提示）逐字不变。
- 验证：`node --check js/data.js js/view/menus.js` 与 `npm run check`（24 模块）全部通过；`npm test` **85/85 + 8/8** 全绿（回归不受影响）；新增 v13.9 专项冒烟（/tmp/jrpg_smoke_v1313_growth.mjs）**19 项断言全过**——`LEVEL_GROWTH` 数据契约（{7,4,2,2}）、与 `baseStats` 一阶差分逐字同源、真实 `grantXp` 单次升级增长 g{7,4,2,2} 与常量一致（升级后属性实际增量同步核对）、Lv.10 基础属性回归、`drawCreate` 端到端逐字渲染 `每级成长：HP+7 · MP+4 · 攻+2 · 防+2` 且位置 (320,408) 居中不重叠、困难倍率行/按键提示行/姓名行回归在位、成长行估算宽度 ≤560 不越界、连续 2 次绘制文本逐字一致 + level/gold/xp/hp/mp/hpMax 零改动（纯显示收敛）。README 系统清单「职业成长」一处同步。

## v13.8 文档同步——README「快速上手」按键表补齐遗漏快捷键（纯文档·零行为变化）

- 【补齐按键表】`main.js` 里早已绑定的三个快捷键一直没进 README 按键表：世界画面 `T` 快速旅行（Esc 菜单里也有，但直连键无人写）、标题页 `R` 重开新档、阵亡页 `B` 重整旗鼓 / `R` 重开 / `T` 回标题——README 表格补齐 `T` 行、`标题 1/2/3` 行追加 `R`、新增「阵亡 B/R/T」行。逐键与 `main.js` `screens.title / screens.dead / screens.world` 的实际绑定核对（世界 `t/T`→`goto('travel')`；标题 `r/R`→`resetRun()`；阵亡 `b/B`→`retryBoss()`、`r/R`→`resetRun()`、`t/T`→回标题），与游戏内 `HELP_PAGES` 操作页（`快速旅行 T`）与试炼进阶页（`重整旗鼓 B · R 重开 · T 回标题`）保持一致——README 不再是第二套口径。
- 【零行为风险】只改 `README.md` 一行表格（新增 2 行 + 改写 1 行），**未动任何 `js/` 代码**、数值、存档与结构；游戏内帮助页本来就已写全这些键。
- 验证：`npm run check`（24 模块）与 `npm test`（85/85 + 8/8）复跑全绿。

## v13.7 剧情大型重构——四幕链 + 名字石碑 + 两条主题支线（《潮灯记》四幕版）

- 【四幕结构落地】主线任务链加第四幕 `main_gallery`（旗标 `galleryOpen`，双徽记开门时置位）：一幕讨回灯芯 → 二幕星井之守 → 三幕无字回廊 → 四幕初灯的审判；`main_true` 的指向从「矿脉水晶」改为「回廊尽头」，终焉之神战随之迁入回廊东端祭坛（矿脉的终焉水晶变为开门机关）。状态页冒险进度徽记增至五格（灯芯/星井/回廊/初灯/试炼场）。
- 【名字石碑：记忆从掉落物变成世界】回廊北壁 4 块石碑（新瓦片 TY.STELE，MiniWorld Tombstones CC0 贴图 + 程序化回退 + 小地图灰点 + `⏎ 读碑` 面向提示），碑文与 `FRAGMENTS` 逐字同源（同一 data.js 表生成 NPC 台词页，零第二数据源）。
- 【条件式支线机制】`questStatus` 新增 `cond(hero)` 自动转可交付 + `condProg` 实时进度文案（日志/横幅同显），`applyQuestReward` 支持 `potion2` 灵药奖励（领取提示与日志奖励预览同步标注）。
- 【两条主题支线】巡灯人「旧灯卫的名字」（魔王后解锁，集齐 4 枚记忆碎片交付，奖 120 金+灵药，与记忆图鉴/碎片系统咬合）；雾径猎手「雾里的新住客」（讨伐 3 只雾灵交付，奖 60 金+药水，引导记忆图鉴与弱点机制）。
- 【NPC 台词分段推广】巡灯人/雾径猎手改 `linesByStage`（默认 → 魔王后 → 回廊开后）；星砂车夫补真结局彩蛋台词（全镇彩蛋补齐到 6 人）；成就 +2（名字归还/雾中辨形，共 17 项）。
- 验证：`npm run check` + `npm test` **85/85 + 8/8** 全绿（新增 10 项断言：四幕链解锁/转向、碎片条件交付两态、雾灵计数交付、灵药奖励、回廊阶段台词、石碑碑文同源）。旧档兼容：`galleryOpen` 缺省即 falsy，无需迁移。

## v13.6 对话框显示效果——打字机/名牌 chip/翻页指示/聚焦压暗（体验打磨·纯显示）

- 【对话从「整页糊脸」到「逐字道来」】此前 `drawTalk` 一块静态面板 + 全页文字瞬间直出，没有节奏也没有反馈。现在：正文**打字机逐字**（28ms/字，`core.talkNext` 与绘制同节奏——打字中按 Enter 先补全本页、再按才翻页）；说话人**名牌 chip** 压在面板框线上（金字描边）；本页打完且还有后续页时右下角**闪烁 ▼** 翻页指示；对话期间世界**压暗 35%** 聚焦视线；正文加 1px 投影提升可读性。
- 验证：`npm run check` + `npm test` **76/76 + 8/8** 全绿（新增 3 项断言：对话打开在第 0 页、打字中 Enter 只补全不翻页、补全后翻页）。未动对话内容、任务接交逻辑与场景切换。

## v13.5 素材扩充 + 四图重设计——CC0 素材包接入、无字回廊新图（内容扩展·含读档兼容）

- 【素材扩充（全部 CC0，逐包核验）】新增三个素材包（assets/CREDITS.md 汇总来源与许可证）：**MiniWorld Sprites**（Shade，与 Puny 同作者）——6 名 NPC 全部换成差异化造型（灯长/井巫/猎手/巡灯人/镇民/车夫各有其图）+ 石碑/界门/路牌/岩石装饰件；**Trash Mobs**（Emcee Flesher，CC0 双授权）——紫幽灵帧接入新魔物「雾灵」（雾语林 Lv.2 起出没，图鉴第 12 种）；**Fire Golem**（teasloth）——回廊精英「残焰魔像」（图鉴第 13 种）。`atlas.js` 新增 16×16 帧图集支持（SHEET_CELL16），`sprites.js` 新增定制帧位路径（CUSTOM_FRAMES）。Kenney Tiny Dungeon 目检后放弃（散件+色板不搭），0x72 无直链未下——均记录在 CREDITS。
- 【四图重设计】按 RPG Maker 式原则重排：**潮灯镇**广场大灯地标居中、商店/旅馆/酿造环广场、民宅西北、城门东；**雾语林**蛇形主路 + 北环路蘑菇宝箱 + 中段营地安全岛，裂洞移到祭坛南（先魔王后矿脉）；**星井矿脉**轨道引导线贯穿、四区递进；新图**无字回廊**——恒暗线性回廊、北壁 4 块名字石碑（碑文与 FRAGMENTS 逐字同源）、中段残焰魔像（可重复挑战精英）、东端终焉祭坛。所有布局经 BFS 连通性校验（/tmp/mapcheck.mjs）。
- 【机制配套】终焉水晶从「直接开战」改为**双徽记开门 → 无字回廊**（终焉之战挪到回廊尽头祭坛）；新瓦片 TY.STELE（SOLID、MiniWorld 石碑贴图 + 程序化回退、小地图配色、面向提示「⏎ 读碑」）；回廊专属 BGM 轨（更慢更稀的正弦长音）+ 漂浮字符粒子 + 恒暗着色；分图遇敌池（`MAPS[].pool`，回廊只出雾灵/石魔像/骷髅兵）；快速旅行加回廊条目；**读档兜底**——旧档坐标落在重排后的墙里时退回出生点。
- 验证：`npm run check` + `npm test` **73/73 + 8/8** 全绿（坐标类断言已随新图更新）。Boss 数值/遇敌公式/存档结构不变；旧档可读。

## v13.4 剧情重构 B 档——揭示节奏三段化 + 记忆碎片机制化（主题咬合·含旧档迁移）

- 【井巫不再开局剧透】此前井巫第一句台词就把终极反转全部说穿（「魔王只是锁，水晶里才是灯自己——终焉之神」），最终 Boss 揭晓毫无冲击。现在 `NPCS.sage.lines` 拆为 `linesByStage` 三段：默认只点「魔王是一把锁，锁着更深的东西」→ 击败魔王后讲星砂矿史与洞窟领主 → 击败领主后才揭「水晶里睡着的是灯自己」；选段逻辑在 `quests.js npcQuestPages` 回退分支（数据仍纯）。HELP/TRAVEL 攻略页保留不动（玩家主动查阅，不算剧透面）。
- 【记忆碎片：主题机制化】「记忆」从 NPC 嘴里的词变成可收集的机制：石心魔像/幽冥魔王/洞窟领主/终焉之神首胜各掉一枚记忆碎片（`data.js FRAGMENTS` 单一数据源：守门人的脚印/灯卫的誓/最后一车星砂/初灯的名字），`winBattle` 按 `canonicalName` 归一查找、未收集才掉落（精英蘑菇同款先例）；`J` 任务日志新增「记忆碎片」节，已收集显示全文、未收集灰 `？？？` 占位；集齐 4 枚后真结局追加「全记忆」三行页（`ENDING_TRUE_FRAG`，行距收窄不溢面板）；尾声战绩行补 `记忆 N/4`。
- 【图鉴更名「记忆图鉴」+ 支线接主题】已讨伐 = 被记起：面板标题/暂停菜单/标题快捷键/战败提示/帮助页/成就名（图鉴学家→记忆收藏家、图鉴征服→记忆守护者）约 9 处文案同步；蘑菇支线 offer/done 文案接入灯油口径（荧光蘑菇是灯油原料），奖励公式不动。
- 【存档兼容】`newGame` 新增 `fragments: []`；`migrateQuests` 幂等补默认（`if (!hero.fragments) hero.fragments = []`），旧三槽存档直接可读；快照展开式存档使新字段自动入库，无需动 saveGame/slotPreview。
- 验证：`npm run check` + `npm test` **73/73 + 8/8** 全绿（新增 8 项断言：旧档迁移补 fragments、井巫三段按旗标选段、首胜掉碎片、重复击败不重复收集、真结局含碎片加页绘制、日志碎片节绘制）。未动任何数值、任务奖励公式与结局触发条件。

## v13.3 美术优化——装饰层/待机呼吸/震屏/变身闪光/村庄夜灯（纯显示·零结算变化）

- 【怪物贴图补位评估】`NO_SHEET` 里 wolf→orc.png 的既有映射经 ReadMediaFile 肉眼核对为人形兽人，与「野狼」违和，**维持程序化剪影**（snake/tree 同样无合适素材，不硬凑）；程序化 DRAWS 保留作贴图缺失回退。
- 【地图确定性装饰层】`drawTileFx` 补传格坐标，按既有 `(x*19+y*37)` 坐标哈希稀疏点缀：草地小花（白瓣黄心）/草痕、路面石子——零状态、确定性、不进存档，洞窟 GRASS 已被 replaceTiles 换成 CAVE 故天然不触发。
- 【待机呼吸】`drawSheetChar`/`drawSheetStrip` 统一注入 ±1px 相位浮动（`opts.idle` 开关，相位随坐标错开防全场同步），覆盖世界 NPC 与战斗怪物（含程序化回退路径）；主角不动（已有走帧 bob）。
- 【战斗演出】暴击/大额伤害（≥25，与浮字加粗同阈值）与敌方重击触发**震屏**（`S.shake` 220ms 衰减，drawBattle 包 save/translate，技能菜单不随震）；Boss 二段变身触发**全屏白金闪光**（`S.flash` 400ms 衰减）。
- 【村庄夜晚灯火】夜晚时段 TOWN 格叠加暖色窗光相位闪烁，呼应「灯」主题。
- 验证：`npm run check` + `npm test` 65/65 + 8/8 全绿；改动全部位于 view/ 与 `S.shake/S.flash` 两个纯显示字段（battle.js/enemyAI.js 各只加触发行），未碰任何结算公式。README 视觉行同步。

## v13.2 地图系统机制优化——按住连走、传送/遇敌数据化、onStep 查表（机制重构·数值逐字不变）

- 【按住连走 + 预输入】此前移动完全依赖 OS 键重复，且行走动画（180ms）期间的按键直接丢弃——连走卡顿、换向迟钝。现在 main.js 新增 `keyup` 监听维护按住方向集合，`world.holdStep()` 以 40ms 节拍驱动连走（最后按下的方向优先）；行走中的按键记入预输入缓冲，走完立即补走一格；切图/切场景自动清空，杜绝幽灵移动。手感变化仅限「更顺」，步进节奏与逐格逻辑逐字不变。
- 【传送数据化】村庄→森林→矿脉链从 useGate/useExit/portalDest 三处硬编码迁入 `data.js MAPS[].portals`（含村庄 GATE 的 locked/lockedMsg——击败魔王后村门只提示不传送）。world.js 合并为单个 `usePortal(tile)`，对外 useGate/useExit/portalDest 签名不变，视图「踩上通行 → XX」提示与真实传送同读一表。加新地图只需在数据表加一行。
- 【onStep 查表化】宝箱/喷泉/幽冥魔王/洞窟领主/终焉水晶/试炼碑六个踩格分支从 if-else 链迁入 `STEP_HANDLERS` 表（已开宝箱格仍走遇敌槽的既有行为保留并注明）；顺带修掉面对商店格按 Enter 发**空字符串** boxMsg 的异味。
- 【遇敌机制单轨化】`dangerAt` 不再混用 charAt（原始 ASCII）与 at（叠加后瓦片）双轨：'G' 高草坐标在 loadMap 建图时入集，全图危险地形读 `MAPS[].dangerTiles`；增减数值数据化为 `ENCOUNTER = { dangerMin:10, dangerVar:9, fountain:-25, calm:-6 }`，小地图机制标注由静态文案改为模板拼接，显示与结算真正同源。`charAt` 随双轨消除一并删除（无消费方）。
- 【小地图单次遍历】drawMinimap 的双重 24×18 全图循环合并为一趟（颜色填充 + 危险/可走统计 + 危险格收集一次完成），危险标注改为遍历收集结果；每帧省去一轮全图 dangerAt 调用。
- 验证：`npm run check`（24 模块）通过；`npm test` **65/65 + 8/8** 全绿（新增 11 项断言：传送链/村庄 GATE 锁读表、ENCOUNTER 数据契约、三图危险格判定、踩格表覆盖、连走首步即时/预输入缓冲/补走/按住连走）。未动任何地图布局（rows 一字未改）、遇敌数值、WALK_MS、Boss 触发条件与存档结构。README 按键表一处同步。

## v13.1 宝箱开箱内容概率透明化——帮助页补「宝箱掉落」行（体验打磨·信息透明，承接 v12.4 战斗随机掉落）

- 【战斗随机掉落实测概率全透明了，**开箱出货构成仍是黑盒**】v12.4 已把战后随机掉落的四档概率逐字亮出，但同样频繁发生的**踩宝箱**从 v1.x 起就只在小地图上提示「蘑菇宝箱金光脉动」（v3.x 帮助页仅讲找法），**打开后到底出什么、各有几成、金币随等级长多少**从未示人——整天刷雾语林宝箱凑蘑菇的玩家，永远不知道 60% 的蘑菇率是「大概率出」还是「靠脸」；而尘土里开出「🎒 药水/金币」时，也看不出自己撞上的是 18% 还是 22% 的档。现在 H 帮助「魔物状态」页在「战斗掉落」行正下方新增一行**宝箱掉落**说明：`开箱掉落：雾语林 60%蘑菇·18%金币(12+级×5)·22%药水；城镇/矿脉 45%金币·55%药水`——开箱前一眼看清三地出货构成，与 v12.4「随机性全透明」同一体系。
- 【与结算逐字同源（单一数据源·只读展示）】三档比例逐字对应 `world.js onStep` 宝箱分支的唯一裁决链：雾语林（dungeon）`curMap()==='dungeon' && Math.random()<0.6` → 蘑菇 60%；否则 `Math.random()<0.45` → 金币（数额 `12+hero.level*5`，即 12+级×5）；再否则 → 药水 1 瓶——雾语林整体 60/18/22、城镇与矿脉（非 dungeon）45/55，与真实开箱结算绝无第二套口径；金币公式 `12+级×5` 亦逐字同源。纯文字展示，不参与任何判定。
- 【零行为风险】只改 `js/data.js` 的 `HELP_PAGES`（魔物状态页 +1 行）；**未动** `world.onStep` 宝箱分支任何概率/数额/物品、蘑菇支线、宝箱坐标、掉落、经验/金币、难度、成就、存档或地图逻辑；帮助页其它 7 行文案、样式、位置逐字不变；新行估算渲染宽度（560px）≤ 既有最长行「战斗掉落」（570px，v12.4 先例），不新增越界。
- 验证：`node --check js/data.js` 与 `npm run check`（24 模块）全部通过；`npm test` **54/54 + 8/8**；本版本在 v13.0 架构（encounter/enemyAI 拆分、curMap() 访问器、「S.curMap 删除」）落地后复验仍全绿；v13.0 架构、v12.9 计分回归（专项冒烟修 `deep` 改读 rules 后）**26/26**；新增 v13.1 专项冒烟（/tmp/jrpg_smoke_v1210_chestodds.mjs，文件名沿用旧编号）**17 项断言全过**——HELP_PAGES[2] 含「宝箱掉落」行且位于「战斗掉落」之后、文案含完整三档（60/18/22 · 45/55 · 12+级×5）、**走真实 `world.onStep` 宝箱分支蒙特卡洛 3 万次**：雾语林实测 ≈60%/18%/22%（金币数额 Lv.5 恒为 37=12+5×5）、城镇实测 ≈45%/55% 且绝不出蘑菇（与 `curMap()` 前提一致）、drawHelp 第 3 页渲染不抛错、新行估算宽度 ≤「战斗掉落」行（不新增越界）、连续 3 次 drawHelp 零状态改动（纯显示收敛）。README 系统说明一处同步。

## v13.0 架构结构性整改——bind 瘦身、view 只读化、battle 拆分、单一数据源收口（纯重构·零行为变化）

- 【bind.js 腐化修复】v4.0 的晚绑定层已从「view 注册点」腐化成双向总线：world/core 也在注册（applyVictoryWorld/loadMap/openTalk），且 renderHUD/boxMsg/drawBattle/drawDead 等键在 hud/drawBattle/menus 与 view/index 里**重复注册**（删一处不报错）。现在拆成两层：`bind.js` 只留 系统→绘制 钩子（仅 view/ 注册、每键单点，头注如实）；新增 `hooks.js` 承接 system 间晚绑定（applyVictoryWorld/loadMap ← world.js，openTalk ← core.js），world↔battle、world↔core 的逻辑环全部摆到明面。
- 【view 层不再改游戏状态】游戏时钟（冒险时长/昼夜）从 `view/index.js render()` 移到 `main.js` 的 `setInterval(tick, 250)`——渲染停则时间停的隐患消除；`drawWorld.heroDrawPos()` 不再清除 `S.walk`，行走结束判定收口到 `world.walking()`（惰性清除）。grep 验证 view/ 下无任何 `S.G`/`S.walk` 写操作。
- 【battle.js 上帝文件拆分】743 → 462 行：遇敌生成（scaleEnemy/eliteEncounter/randomEncounter/权重）拆出 `encounter.js`；敌方行为表挑选与回合执行（pickAct/enemyAct，灼烧/冻结/变身/石甲/回血/反击/施毒）拆出 `enemyAI.js`（不反向 import battle，编排回调经 deps 传入）；升级循环迁入 `hero.grantXp`；掉落公式迁入 `rules.rollDrop(hero, curMap)`；Boss 重试 retryBoss 迁入 `core.js`（存档/开局语义）；尾部门面再导出删除，world 直读 rules/hero。
- 【单一数据源收口】Boss 报酬/强度不再抄第二份表——`rules` 的 BOSS_REWARD/BOSS_STAT 合并为 BOSS_DEFS，直读 data.js 的 BOSS/CAVE_BOSS/TRUE_BOSS（经 canonicalName 归真身名）；Boss 推荐等级（8/7/12）进 `SPECIES[].lv`，战斗界 enemyLv 与祭坛 ⚠Lv 标签同读；精英石心魔像成长表数据化为 `ELITE_GOLEM`（encounter 与图鉴 codexStats/monReward 同读）；遇敌逐怪权重数据化为 `MON_BASE[].w(lv)`；药水可用性判定抽为 `hero.potionAvailability`（core.usePotion 与 battle.doItem 同源）；core 开局三段重复（initGame/beginAdventure/resetRun）收口为 `startRun`。
- 【双源真相消除】`S.curMap` 删除，当前地图唯一真相为 `G.map`（loadMap 负责同步），全层读取走 `state.js` 的 `curMap()` 访问器（放 state 而非 world，避免 audio→world 成环）；存档/读档的反复调和代码删除，旧档兼容保留（含 legacy `data.curMap` 字段）。
- 【死代码清除】删除 ui.js 桶文件（无人 import）、S.titleFlash、S.innPrice（改 data.js INN_PRICE 常量）、restoreChestGrid 空函数、menus.openShop 空壳、hero.nextSkillHint、rules.skillHintLine/speciesOf、data.CAVE_HOLE/INTERACT。
- 【测试收口】`tests/smoke_v510_freeze.mjs` 接入 `npm test`（不再是孤儿脚本）；smoke 新增 5 项架构断言（goto 清 battleBusy/技能菜单、curMap() 与 G.map 同源、screens 表每项有 onKey、关键场景覆盖、各场景未映射键分发不抛错）。
- 验证：`npm run check`（24 模块）通过；`npm test` **54/54 + 8/8** 全绿。未动任何游戏数值、手感、文案与存档结构（旧三槽存档可读）。README 项目结构一节同步。

## v12.9 试炼三连战「每胜一关自动回血」透明化——横幅/帮助页标注 35%HP/50%MP（体验打磨·信息透明，承接 v3.15 连战横幅 / v11.0 通关金币）

- 【三连战会「补血」却从不告示，玩家可能凭白省药】试炼三连战（试炼碑 ⚔️ 进驻后连战 幽冥魔王→洞窟领主→终焉之神）自 v1.x 起就有一个**从不告示的机制**：每胜一关换关时，自动恢复 `35% 最大 HP / 50% 最大 MP`（`battle.winBattle` 连战胜分支硬编码 `0.35/0.5`）——v3.15 只标「第 N/3 关」进度、v11.0 只标通关金币，**唯独换关回血从未出现在任何界面**：以为「药得留给下一场」的玩家可能在每关收尾前硬灌高级灵药，白白烧掉稀有资源。现在三处同步点破：战斗横幅（左上角 `🧭 试炼三连战 第 N/3 关`）在**前方还有后续关卡时**常驻尾缀 `· 通关恢复35%HP/50%MP`（临场一眼看清该不该省药；第 3 关无后续则不显示，免噪音）；换关瞬间的提示横幅补注 `（已自动恢复35%HP / 50%MP）`（确认这口补给真实到账）；帮助页「试炼进阶」页的试炼三连战行追加 `每胜一关回血35%HP/50%MP`。
- 【与结算逐字同源（单一数据源）】回血比例数据化为 `data.js` 新增 `RUSH_RECOVER={ hp:0.35, mp:0.5 }`：`battle.winBattle` 连战胜分支由硬编码改为读它（`Math.round(hpMax×RUSH_RECOVER.hp)` / `Math.round(mpMax×RUSH_RECOVER.mp)`，**数值结算逐字不变**），战斗横幅注记、换关 boxMsg 注记与帮助页文案同读此源，绝无第二套口径——只读展示，不参与任何判定。
- 【零行为风险】只改 `js/data.js`（+1 常量 RUSH_RECOVER、+1 export、帮助页试炼行一行文案）、`js/battle.js`（import 补 RUSH_RECOVER、连胜分支两行读常量 + 换关横幅补注一行）、`js/view/drawBattle.js`（import 补 RUSH_RECOVER、横幅尾缀注记 4 行）；**未动**任何回血数值（0.35/0.5 本体）、rushStage 推进、连战敌方属性、通关奖励（rushReward）、掉落、经验、难度、成就、存档或任何战斗判定。主线 Boss/普通怪/精英战斗横幅、帮助页其余各行逐字不变。README 系统说明「试炼进阶」页描述一处同步。
- 验证：`node --check js/data.js js/battle.js js/view/drawBattle.js` 与 `npm run check`（23 模块）全部通过；`npm test` **49/49**、`/tmp/jrpg_smoke_esm.mjs` 全量 ESM 冒烟（ALL ESM SMOKE CHECKS PASSED）回归全过；新增 v12.9 专项冒烟（/tmp/jrpg_smoke_v1290_rushrecover.mjs）**26 项断言全过**——`RUSH_RECOVER` 数据契约（hp 0.35 / mp 0.5 且已 export）、帮助页试炼行含 `每胜一关回血35%HP/50%MP` 且数值与常量同源、帮助页试炼行渲染后宽度不超过既有最长行（「技能克制」行 v12.6 先例，右缘不新增越界）、战斗横幅第 1/2 关逐字 `第 1/3 关 · 通关恢复35%HP/50%MP`（注记与 RUSH_RECOVER 同源）而第 3 关不显示、主线 Boss 战不显示试炼横幅、连胜换关结算（第 1/2 关胜利）精确恢复 `round(hpMax×0.35)` / `round(mpMax×0.5)` 且 rushStage 推进到 2/3、下一关换关 boxMsg 含 `已自动恢复35%HP / 50%MP` 与新敌名、恢复后不超 hpMax、第 3 关通关分支回归（rushDone 置位 / rushStage 复位 0 不抛异常）、连续 5 次横幅绘制 hp/mp/gold/xp/level/scene/rushStage/敌方hp/name/blog 长度零改动（纯显示收敛）。

## v12.8 敌方「暗影回血」数额透明化——招数一览补确切回血%（体验打磨·信息透明，承接 v12.7 变身回血比例）

- 【招数一览标「血<40%时」却不标回多少】Boss/精英战右上角的敌方招数一览早已把每招列全：普攻 / 重击（真身后强）/ 石甲（至多N层），唯独「回血」这行只挂触发线——`回血·血<40%时`，**这一口能回满它多少血**从 v1.x 起就藏在 `data.js SPECIES.acts` 的 `pct` 里（幽冥魔王 0.12 / 洞窟领主 0.10 / 终焉之神 0.12，即自己最大 HP 的 12%/10%/12%）：打 Boss 时敌人每次回血，log 只报「恢复 N HP」（随当前 maxHP 浮动），玩家想估算「再压多少输出它才顶不住」「刚才那一下是不是白打了」只能靠体感或翻源码——偏偏「暗影回血」正是三 Boss（含试炼三连战同款）共有的回复手段，几乎每场强战都会触发。现在招数一览的「回血」档同步补上确切回血比例：`回血·血<40%时·恢复12%HP`（洞窟领主 `恢复10%HP`）——开战前一眼看清「它低血时会回满自己一截血、得预留输出」，与 v12.7 变身回血比例（`回15%`）同一「信息透明」体系。
- 【与结算逐字同源（单一数据源）】回血比例直接读招数表 `act.pct`——与 `battle.enemyAct` 回血分支 `Math.round(enemy.hpMax * (act.pct || 0.12))` **同一对象、同一字段、同一 `0.12` 兜底**，绝无第二套口径；百分比 = `Math.round(pct×100)%` 由数据本体换算，绝无第二套口径能改它。仅当敌方确实存在 `forbid:['heal']` 时（终焉之神祸乱形态，`enemy.forbid` 由 `enemyAct` 变身分支 line 483 动态赋值）才尾缀 `·⛔封印`，与既有「⛔ 治愈封印」角标同一判定。
- 【零行为风险】只改 `js/view/drawBattle.js` 的 `drawBattle()` 招数一览「回血」分支一处（+1 行渲染 + 注释）；**未动**任何回血结算（`enemyAct` heal 分支 `pct` 本体）、变身、伤害/掉落/经验、难度、成就、存档或任何判定。普通怪（无 acts）依旧不显示招数一览、绝不剧透；洞窟领主/幽冥魔王/终焉之神其余招数串逐字不变。
- 验证：`node --check js/view/drawBattle.js` 与 `npm run check`（23 模块）全部通过；`npm test` **49/49**；`/tmp/jrpg_smoke_esm.mjs` 全量 ESM 冒烟（ALL ESM SMOKE CHECKS PASSED）、v12.0~v12.7 全部专项冒烟（10/10 · 18/18 · 9/9 · 28/28 · 12/12 · 17/17 · 24/24 · 19/19）回归全过；新增 v12.8 专项冒烟（/tmp/jrpg_smoke_v1280_healpct.mjs）**18 项断言全过**——三 Boss heal 招数据契约（0.12/0.10/0.12 · hpBelow 0.4）、战斗敌人体 withSpecies 携带同一 acts（与 enemyAct 同源）、幽冥魔王招数一览逐字 `回血·血<40%时·恢复12%HP`、洞窟领主 `恢复10%HP`、终焉之神变身前无封印/变身后（镜像 enemyAct 动态赋 forbid）尾缀 `·⛔封印`、普攻/重击回归在位、招数一览右对齐贴 620 左缘不越界、史莱姆无招数一览不剧透、连续 5 次绘制 hp/mp/gold/xp/level/scene/敌方hp/name/phased 零改动（纯显示收敛）、战利品预览与攻防比较行回归在位。README 战斗说明一处同步。

## v12.7 Boss 二段变身「增益数值」透明化——变身线旁列出 攻/防/回血/封印（体验打磨·信息透明，承接 v1.34 变身线）

- 【变身线早已标「何时变身」，却从不标「变身后果」】v1.34 起战斗画面在敌方血条上画出一道金色「二段变身线」，v12.x 又补上精确阈值 `二段变身线 · HP<70`——变身时机明明白白，但**变身瞬间的 攻/防 暴涨、回血比例与「封治愈」从 v1.x 起就只藏在 `data.js SPECIES.phase2` 里**：触发时 blog 只报「力量暴涨，HP 恢复 N」（只给回血数值），攻防加成无从知晓，玩家常在真身那一下被 +7 攻的新数值打崩还不知原因；终焉之神「祸乱形态」会封印治愈，变身前也毫无预告，辛苦攒的 MP 一按治愈术就被 ⛔封印白费。现在变身阈值行的右缘同步常驻列出**变身后果**：幽冥魔王 `变身：攻+7 防+3 回15%`、洞窟领主 `攻+5 防+2 回10%`、终焉之神 `攻+7 防+3 回15% ⛔封治愈`——一眼看清该不该抢在变身线前把输出灌完、或先补状态再硬接真身。
- 【与变身结算逐字同源（单一数据源）】标注逐项直接读 `enemy.phase2`（atk/def 加算、heal 按 maxHP 比例、forbid 封印）——与 `battle.enemyAct` 变身分支**同一份对象、同一套字段**，绝无第二套口径；数值本体 7/3/0.15、5/2/0.10 逐字不变，任何变身判定、回血、攻防结算零变化。
- 【零行为风险】只改 `js/view/drawBattle.js` 的 `drawBattle()` 变身线一处渲染分支（+12 行纯显示）；**未动** data.js phase2、enemyAct 变身逻辑、伤害/掉落/经验、难度、成就、存档或任何结算。变身（phased）后与阈值标签一起消失，行为与 v1.34 完全一致。
- 验证：`npm run check`（23 模块）与 `npm test` **49/49** 全部通过；`/tmp/jrpg_smoke_esm.mjs` 全量 ESM 冒烟（ALL ESM SMOKE CHECKS PASSED）保持通过；新增 v12.7 专项冒烟（/tmp/jrpg_smoke_v1270_phaseboost.mjs）**19 项断言全过**——三大 Boss phase2 数据契约（7/3/0.15 · 5/2/0.10 · 7/3/0.15+封治愈）、战斗敌人体 withSpecies 携带同一 phase2 对象（与 enemyAct 同源）、幽冥魔王绘制出 `二段变身线 · HP<` 与 `变身：攻+7 防+3 回15%`（右对齐·右缘贴 620·估宽起点 >440 不遮阈值/HP 数值）、洞窟领主 `攻+5 防+2 回10%`、终焉之神含 `⛔封治愈` 置前警告、phased 后两行标签同消、史莱姆等无 phase2 怪不出现、连续 5 次绘制 hp/mp/gold/xp/level/scene/敌方hp/name/phased 零改动（纯显示收敛）、战利品预览行与我方攻防比较行回归在位。README 战斗说明一处同步。

## v12.6 元素克制倍率透明化——图鉴/帮助页标注确切数值（体验打磨·信息透明，承接 v7.6 抗性标注 / v6.9 图鉴强度）

- 【图鉴标「弱点·火」却不标数值，「同一招打它到底多打多少」始终是黑盒】v7.6 起战斗预览行已对称标出 `· 弱点火 / · 抗冰`，图鉴已讨伐行也带 `弱点·X / 抗性·X`，但**确切的伤害倍率从 v1.x 起就只藏在 `rules.js elemMult` 的一行硬编码里**（`weak→1.35 / resist→0.7`）：玩家知道「火招打它更痛」「冰招打它更低」，却看不出痛多少、低多少——而 `≈N伤` 预览其实早已默默按该倍率折算，想反推「这招为什么比打普通怪高/低 35%/30%」只能靠体感或翻源码。现在**图鉴已讨伐行**的弱点/抗性标注补上确切倍率：`弱点·火×1.35` / `抗性·冰×0.7`（骷髅兵/树精/石魔像等双标注怪一眼看懂两档），帮助页「魔物状态」页「技能克制」行同步写明 `弱点伤害×1.35 · 抗性伤害×0.7`——「该不该用被克的招 / 能不能靠克制补平」战前一目了然，与既有「强度/倍率/奖励全透明」同一体系。
- 【与结算逐字同源（数据化单一数据源）】倍率数据化为 `data.js` 的 `ELEM_MULT={ weak:1.35, resist:0.7 }` —— `rules.elemMult` 两档返回值改为读取它，图鉴 `codexTag` 标注与帮助页文案同读此源，**结算、预览、图鉴、帮助页四处绝无第二套口径**；数值本体 1.35/0.7 逐字不变，任何伤害/掉落/经验判定零变化。
- 【零行为风险】只改 `js/data.js`（+1 常量 ELEM_MULT、+1 export、codexTag 两行拼接追加倍率、帮助页「技能克制」一行文案）与 `js/rules.js`（elemMult 两行改读常量）；**未动** battle 预览行（v7.6 断言 `弱点火 / 抗冰` 逐字）、SKILL_DATA 提示、遇敌、掉落、伤害公式、难度、成就、存档、地图逻辑。帮助页「魔物状态」页其余 6 行文案逐字不变；未讨伐灰行依旧不剧透（不显示倍率/强度）。
- 验证：`node --check js/data.js js/rules.js` 与 `npm run check`（23 模块）全部通过；`npm test` **49/49**；`/tmp/jrpg_smoke_esm.mjs` 全量 ESM 冒烟（ALL ESM SMOKE CHECKS PASSED）保持通过；v6.9 图鉴（14/14）、v7.6 抗性（ALL）、v12.0（ALL）、v12.2（9/9）、v12.3（28/28）、v12.4（12/12）、v12.5（17/17）回归全过；新增 v12.6 专项冒烟（/tmp/jrpg_smoke_v1260_elemmult.mjs）**24 项断言全过**——`ELEM_MULT` 数据契约（weak 1.35 / resist 0.7）、`elemMult` 返回值与 ELEM_MULT 逐字同源且行为不变（弱火=1.35 / 抗冰=0.7 / 无克制=1）、帮助页「技能克制」行含 `弱点伤害×1.35` 与 `抗性伤害×0.7` 且数值与常量一致、`codexTag` 标注逐字（骷髅兵 `弱点·火×1.35 · 抗性·冰×0.7` / 石魔像 `弱点·雷×1.35 · 抗性·火×0.7` / 史莱姆仅弱火无抗不泄漏 / 幽冥魔王保留 `⚔️ 必掉圣光之剑` 且追加 `抗性·冰×0.7`）、drawHelp 与 drawCodex 端到端渲染含新倍率标注且右缘 < 560 不越画布、连续绘制零状态改动（纯显示收敛）、战斗预览行 `弱点火 · 抗冰` 回归逐字（v7.6 口径不变）。README 图鉴与战斗说明两处同步。

## v12.5 技能提示「火焰斩·灼烧每回合伤害量」明确化——技能 hint 表最后一处黑盒（体验打磨·信息透明，承接 v6.5 灼烧角标）

- 【敌人挂上灼烧后角标有数值，**施放前/状态页却看不到灼烧伤害规则**】v6.5 起战斗画面在敌方**已处于灼烧**时常驻角标 `🔥 灼烧 N · 每回合 -X血`（精确到当前敌人），但技能菜单与状态页的技能提示（`SKILL_DATA.hint`）里，唯独火焰斩这行仍只有 `灼烧2回合`——冰霜击写了 `30%冻结（跳过敌回合）`、雷鸣写了 `穿透一半防御`、陨石术写了 `击碎石甲 · 克真身`，全表五个技能只有火焰斩缺「每回合掉多少」：玩家想算「这两回合烧掉它多少血、值不值得先手挂灼烧」只能靠体感或等挂上再看角标。现在技能提示补齐为 `灼烧2回合·每回合约-4%最大HP`——战斗 `2` 技能菜单与 `I` 状态页「已学技能」行两处同时生效，施放前一眼看清规则。此为技能 hint 表的最后一处黑盒，全表自此逐项带数值。
- 【与结算逐字同源】「约-4%最大HP」直接对应 `battle.enemyAct` 灼烧分支的**唯一裁决式** `max(2, round(hpMax×0.04))`（保底 2）——与 v6.5 角标同一数据源、绝无第二套口径；只说「约」而不断言精确值，恰与 HELP_PAGES「毒蛇中毒（约5%最大HP）」的既有措辞同一约定（保底 2 与 4% 在小血敌人上会取高者，故不写死精确百分比）。只读展示，不参与任何判定。
- 【零行为风险】仅改 `js/data.js` 的 `SKILL_DATA['火焰斩'].hint` 一个字符串（+ 注释）；**未动任何灼烧判定、伤害公式（0.04 本体）、回合递减、掉落、经验/金币、难度、成就或存档逻辑**；`burn:2`、`element:'fire'`、技能伤害多段 `1.8` 逐字不变；v6.5 角标、v12.4 掉落档位、帮助页、图鉴全数不受影响。
- 验证：`node --check js/data.js` 与 `npm run check`（23 模块）全部通过；`npm test` **49/49**；`/tmp/jrpg_smoke_esm.mjs` 全量 ESM 冒烟（ALL ESM SMOKE CHECKS PASSED）保持通过；新增 v12.5 专项冒烟（/tmp/jrpg_smoke_v1250_burnhint.mjs）**10 项断言全过**——`SKILL_DATA['火焰斩'].hint` 含 `灼烧2回合` 与 `约-4%最大HP` 且文本与 `enemyAct` 的 `max(2, round(hpMax×0.04))` 语义同源、战斗技能菜单（drawSkillMenu 覆盖层）火焰斩 hint 行逐字渲染且右缘 < 面板右界 490、状态页（drawStatus）「已学技能」火焰斩行含新 hint 且右缘 < 面板右界 570、冰霜击/雷鸣/陨石/治愈四招 hint 逐字在位（回归）、`skillHintLine('火焰斩')` 返回新文本、连续 3 次重绘 hp/mp/gold/xp/level/enemyHp/burn 零改动（纯显示收敛）。README 战斗说明一处同步。

## v12.4 战斗「随机掉落」概率透明化——帮助页补全掉落档位（体验打磨·信息透明，承接 v5.2/v12.0 奖励透明化）

- 【确定性奖励全透明了，随机掉落的概率却仍是黑盒】v5.2 起已把「精英必掉蘑菇 / 终焉之神+300金」这类**确定性**战利品逐项亮出，v12.0 又补齐了 Boss 必掉圣光之剑，但**战后每场都发生的随机掉落**（`battle.js rollDrop`）从 v1.x 起就是一行硬编码：约 8% 掉装备（木剑/铁剑→秘银剑、布衣/皮甲→锁子甲，已最好则 +60金）、12% 掉药水、12% 掉魔法蘑菇（限雾语林/星井矿脉）、6% 掉高级灵药、其余 62% 不掉落——合计约 38% 有掉落。图鉴底部明明常驻「累计讨伐 · 额外掉落 N」计数、成就栏还有「幸运眷顾（累计 5 次额外掉落）」，玩家却**完全不知道这 N 是哪来的、一场打完到底多大概率出货**。现在 H 帮助「魔物状态」页补上一行常驻说明：`战斗掉落——胜利后约 38% 触发随机掉落：8% 装备或+60金 · 12% 药水 · 12% 蘑菇 · 6% 高级灵药`——一眼看清「刷装备/蘑菇该去雾语林深林」与「概率不算低、别小看额外掉落」。
- 【与结算逐字同源】文案四个档位逐字对应 `battle.js rollDrop` 的各 `roll < 0.08 / 0.2 / 0.32 / 0.38` 边界（8% / 12% / 12% / 6%，合计 38%）；装备档升级对象、蘑菇的地图限制均按真实逻辑表述，绝无第二套口径；与既有「强度/倍率/奖励全透明」同一体系。
- 【零行为风险】仅改 `js/data.js` 的 `HELP_PAGES`（+1 行帮助文案）；**未动 rollDrop 任何概率/结算、掉落物品、成就、计数、地图逻辑**——掉落行为逐字不变，只是把概率讲明；帮助页其它 6 行文案、位置、样式逐字不变。
- 验证：`node --check js/data.js` 与 `npm run check`（23 模块）全部通过；`npm test` **49/49**；`/tmp/jrpg_smoke_esm.mjs` 全量 ESM 冒烟（ALL ESM SMOKE CHECKS PASSED）保持通过；v12.3（28/28）、v12.2（9/9）、v12.1（18/18）回归全过；新增 v12.4 专项冒烟（/tmp/jrpg_smoke_v1240_dropodds.mjs）**12 项断言全过**——HELP_PAGES[2] 含「战斗掉落」行且文案含完整四档（38%/8%/12%/12%/6%）、rollDrop 实测 2 万次分布与标注一致（装备 7.6%≈8% / 药水 12% / 蘑菇 11.8%≈12% / 灵药 6.2%≈6%、合计 37.5%≈38%）、drawHelp 魔物状态页含新行渲染无异常。README 系统清单帮助一行同步。

## v12.3 图鉴「出没等级门槛」透明化——树精/石魔像/石心魔像「Lv.3起出没」标注（体验打磨·信息透明，承接 v6.9 图鉴强度）

- 【收集图鉴的最后一个黑盒：这怪到底几级才出现】图鉴（`B`）已透明了报酬、强度、特性、出没地点，但**「这怪练到几级开始在野外出现」**从 v1.x 起就藏在 `battle.js encounterWeight` 的一行硬编码里：`树精/石魔像` 返回 `level >= 3 ? 2 + floor(level/2) : 0`（Lv.3 才进遇敌池），`石心魔像`（精英）在 `randomEncounter` 里也是 `S.G.level >= 3 && 7%` ——作为「图鉴征服（11 种全收）」的必经怪，玩家在 Lv.1~2 怎么刷都遇不见它们，只会以为脸黑，图鉴里也从不说明。现在已讨伐行的「出没」括号补上**等级门槛**：`树精/石魔像 →（草丛随机遇敌 · Lv.3起出没）`、`石心魔像 →（雾语林·稀有精英 · Lv.3起出没）`——一眼看清「练到 3 级再来刷」，与既有「强度/倍率/奖励全透明」同一体系。
- 【与遇敌分布逐字同源（数据化单一数据源）】门槛数据化为 `data.js` 的 `MON_BASE.minLv`（树精/石魔像 `minLv:3`，其余缺省 1）与 `ELITE_GATE_LV = 3`（精英门槛）——`battle.encounterWeight` 与 `randomEncounter` 精英分支改为逐项读取、`rules.js` 新增纯函数 `spawnLv(name)`、图鉴标注调 `spawnLv`，**数值、遇敌分布、标注三处绝无第二套口径**；未讨伐灰色占位仍不剧透（不出没等级、不出数值）；Boss 为剧情遭遇无门槛、不带标注。
- 【零行为风险】`encounterWeight` 逐档权重与历史公式逐字一致（仅把 `level < minLv` 前置、把 `level>=3?…:0` 改写为缺省档），Lv.1/2 抽不到树精石魔像、Lv.3 起权重 3 逐字不变；精英 7% 门槛 `>=3` 不变；只改 `js/data.js`（+2 个 minLv、+1 常量、+1 export）、`js/battle.js`（encounterWeight 前置门槛 + 精英分支读常量）、`js/rules.js`（+1 纯函数 spawnLv）、`js/view/menus.js`（whereFind 追加等级串）；未动任何掉落、经验/金币、伤害、难度、成就、存档、任务、地图逻辑。
- 验证：`node --check js/data.js js/battle.js js/rules.js js/view/menus.js` 与 `npm run check`（23 模块）全部通过；`npm test` **49/49**；`/tmp/jrpg_smoke_esm.mjs` 全量 ESM 冒烟（ALL ESM SMOKE CHECKS PASSED，含 Lv.1 新手保护、Lv.6+ 后期梯度断言）保持通过；v8.0（21/21）、v7.9（24/24）、v7.8（ALL PASSED）、v7.7（17/17）、v7.6、v7.1（18/18）、v7.0（18/18）、v6.9（14/14）、v12.2（9/9）、v12.1（18/18）回归全过；新增 v12.3 专项冒烟（/tmp/jrpg_smoke_v1230_spawnlv.mjs）**28 项断言全过**——spawnLv 数据契约（5 种 Lv.1 / 树精石魔像=3 / 石心魔像=ELITE_GATE_LV=3 / 三 Boss=1 / 未知与 null 钳制 1）、MON_BASE.minLv 与 ELITE_GATE_LV 单一数据源、遇敌分布行为等价（Lv.1/2 village 2 万次无树精石魔像 → Lv.3 起出现、Lv.9 后期梯度保持、dungeon Lv.2 无精英 / Lv.3 约 7%）、drawCodex 端到端逐字（史莱姆无门槛原文 / 树精与石心魔像 `Lv.3起出没` / 幽冥魔王祭坛原文 / 未讨伐灰行不剧透 / 报酬与强度行保留）、连续绘制零状态改动（纯显示收敛）。README 图鉴一行同步。（注：历史 /tmp/jrpg_smoke_v330_codex.mjs 为 v3.3 时代旧测试，未初始化 v4.0+ 的 `S.G` 直接调 drawCodex 报错，在本次改动前的 git HEAD 上同样失败，属旧测试与现行状态注册表不兼容，与本次改动无关；现行权威图鉴冒烟为 v6.9 14/14。）

## v12.2 战斗指令栏「药水消耗顺序」注明（体验打磨·信息透明，承接 v4.4 药水恢复量预览）

- 【恢复量都标了，喝哪一瓶却是黑盒】v4.4 起战斗画面 `[3]药水` 的恢复量预览行把 🍖/🧪 两种药水能回多少都标出来了，但**按 3 到底先消耗哪一瓶**从 v1.x 起就藏在 `hero.js takePotion` 里：两瓶都在手时 `if (hero.potion2 > 0)` 让**高级灵药必然优先被喝掉**——想把手头稀有灵药省给 Boss 的玩家，可能一次中盘小补（只是差几十 HP、MP 还是满的）就悄悄烧掉一瓶辛苦酿的灵药，等真正需要时已经没了。现在两种药水都在手时，恢复量预览行尾追加常驻注明 `（自动先喝🧪）`——按 [3] 前一眼看清「这一口喝的是舍不得的那瓶」，决定是省着用/改用别的指令，还是就这么喝。
- 【与结算逐字同源】注记判定直接复用 `hero.js/core.js` 的同一条件：`potion2 > 0 && item > 0`（两瓶都在手），文案语义即 `takePotion` 的「高级灵药优先」分支（`potion2--` 先行），绝无第二套说法；药水消耗、恢复量、选择逻辑一行未动。
- 【零行为风险】仅改 `js/view/drawBattle.js` 的 `drawBattle()` 恢复量预览行一处（`+1 行 orderNote 条件串 + 注释`）；**未动任何药水选择/消耗/恢复公式/上限/结算逻辑**——🍖/🧪 谁先谁后的真实行为逐字不变，只有显示层把行为讲明。三种持有态分别验证：仅 🍖、仅 🧪（消耗对象唯一、无歧义）一律不带注记；两者皆有时才出现；`battleBusy`（敌方行动回合）整行不显示，注记随之隐藏。
- 验证：`node --check js/view/drawBattle.js` 与 `npm run check`（23 模块）全部通过；`npm test` **49/49**；`/tmp/jrpg_smoke_esm.mjs` 全量 ESM 冒烟（ALL ESM SMOKE CHECKS PASSED）、v12.1 遇敌机制冒烟（18/18）、v12.0 Boss 掉落冒烟全部保持通过；新增 v12.2 专项冒烟（/tmp/jrpg_smoke_v1220_ordernote.mjs）**9 项断言全过**——源码契约（takePotion 先判 potion2、注记语义一致）、两种在手 `[3]恢复` 行含 `（自动先喝🧪）` 且 🍖/🧪 恢复量逐字在位、仅🍖/仅🧪 不带注记、battleBusy 整行隐藏、连绘 8 次 hp/mp/item/potion2/gold/xp/level/scene/battleTurn/敌方HP 零改动（纯显示收敛）、注记行右缘 < 640 画布宽。README 战斗说明一处同步。

## v12.1 遇敌槽机制标注「每步增减」小字（体验打磨·信息透明，承接 v4.2 遇敌槽读数）

- 【百分比之外，「还差几步遇敌」仍是黑盒】v4.2 起小地图遇敌槽常驻百分比读数与 ≥70% 鸣警，但**槽是怎么涨的、怎么降的**没有任何提示——危险格每步 +10~18、喷泉 -25、其它可行走格 -6 这三条增减规则自 v1.x 起就藏在 `world.js tickEncounter` 里：想算「刷完这趟还要几步才遇敌」「该不该绕去喷泉压槽」，只能靠体感或翻 README。现在遇敌槽 pill **正下方**常驻一行机制小字标注 `危险格+10~18 · 喷泉-25 · 道路-6`（10px 琥珀小字、右对齐小地图右缘、随 pill 一起浮在小地图下方）——与读数同屏，一眼算出「满 100 还差几步」「站喷泉要几回合才能压下去」，与既有「战利品/区域倍率/困难倍率全透明」同一体系。
- 【与结算逐字同源】数值直接对应 `world.js tickEncounter` 唯一裁决处：危险格 `+ 10 + Math.floor(Math.random()*9)`（区间 10~18）、`TY.FOUNTAIN → -25`、其余 `-6`——标注与真实增减逻辑绝无第二套口径；`onStep` 喷泉回血处的同式 `-25` 也一致。只读展示，不参与任何判定。
- 【零行为风险】仅改 `js/view/drawWorld.js` 的 `drawMinimap()` 一处（在原 pill 绘制与 `textAlign` 复位之间 +1 行小字 + 注释）；**未动任何遇敌判定、遭遇槽增减公式（+10~18/-25/-6 本体）、回血、地图、碰撞、掉落或战斗逻辑**；原 pill 文案/颜色/位置逐字不变（v4.2 读数、鸣警、色带回归保持）。
- 验证：`node --check js/view/drawWorld.js` 与 `npm run check`（23 模块）全部通过；`npm test` **49/49**；`/tmp/jrpg_smoke_esm.mjs` 全量 ESM 冒烟（ALL ESM SMOKE CHECKS PASSED）保持通过；新增 v12.1 专项冒烟（/tmp/jrpg_smoke_v1210_encmech.mjs）**18 项断言全过**——tickEncounter 三条增减源码在位、`10+⌊rand×9⌋→10~18` 区间推导、三张地图（village/dungeon/cave）机制标注行逐字绘制且右对齐、0/42/100% 各档标注行恒在、原 pill 读数（`遇敌 0%`/`遇敌 42%`/`遇敌 100% ⚠️ 危险逼近`）逐字回归、连绘 12 次 encGauge/scene/hp/mp/gold/xp/level/curMap/坐标 零改动（纯显示收敛）。README 战斗说明一处同步。（注：历史 /tmp/jrpg_smoke_v420_encgauge.mjs 的 1 项「底色轨道 .8 vs .9」断言为初始提交即存在的旧基线漂移，与本次改动无关，已在 git HEAD 复现核验。）

## v12.0 Boss 战「战利品预览」补必掉圣光之剑标注（体验打磨·信息透明，承接 v5.2/v11.0 确定性奖励透明化）
- 【打赢幽冥魔王必得圣光之剑，预览行却从不写】战斗画面「战利品预览」行自 v5.2 起已列明精英必掉蘑菇（🍄）、终焉之神另 +300 金（💰）、试炼通关奖励（v11.0），唯独 **Boss 幽冥魔王首败必掉的传说剑「圣光之剑」从不示人**——预览行只挂 `经验 +150 金币 +300 · 抗冰`，而 `winBattle` 里 `isBoss` 分支从 v1.x 起就保证首次击败必装备攻+24 的圣光之剑；玩家只有打赢那一刻的 `⚔️ 剑里封着被偷走的黎明——【圣光之剑】！` 才知道，打完才知道「这趟值得打」。现在预览行与图鉴 `codexTag`（`⚔️ 必掉圣光之剑`）逐字对齐补上：`战利品预览：经验 +150 金币 +300 · 抗冰 · ⚔️ 必掉圣光之剑`——进祭坛前一眼看清这把通关关键武器是必得收益。
- 【与结算逐字同源】标注直接判 `enemy.isBoss`（与 `winBattle` 掉落分支读同一旗标），文案与 `data.js` 图鉴 `codexTag('幽冥魔王')` 的 `⚔️ 必掉圣光之剑` 逐字一致，绝无第二套口径；终焉之神（isTrue）与石心魔像（isElite）旗标互斥、绝不误标；试炼 RUSH 首关（isRush 非 isBoss）按设计不掉落、同样不显示。
- 【零行为风险】仅改 `js/view/drawBattle.js` 预览行 `bonus` 拼接一处（`+1 个 isBoss 分支`）；**未动任何掉落/经验/金币/装备/难度/成就/存档/战斗结算逻辑**；`winBattle` 的圣光之剑授予行为逐字不变；普通怪/精英/试炼预览行文本与既有逐字一致（各自旗标为假，零回归）。
- 验证：`node --check js/view/drawBattle.js` 与 `npm run check`（23 模块）全部通过；`npm test` **49/49**；`/tmp/jrpg_smoke_esm.mjs` 全量 ESM 冒烟（ALL ESM SMOKE CHECKS PASSED）保持通过；新增 v12.0 专项冒烟（/tmp/jrpg_smoke_v1200_bossdrop.mjs）**10 项断言全过**——源码 `isBoss` 分支与 `winBattle` 圣光之剑授予同源、图鉴 codexTag 逐字一致、Boss 战 enemy.isBoss 在位、幽冥魔王 xp150/gold300 契约、普通怪/终焉之神/精英/试炼RUSH 四类旗标互斥不误标、连续 3 次重绘 hp/mp/gold/xp/level/scene/enemyHp/turn 零改动（纯显示收敛）；v11.0 试炼奖励冒烟（21/21）与 v10.0 标题快捷键冒烟（10/10）回归全过。README 战斗说明一处同步。

## v11.0 试炼三连战「通关奖励」透明化（体验打磨·信息透明）
- 【试炼值不值得打，奖励是多少从来不说】试炼碑三连战是通关后唯一的高难内容，战利品预览行却只挂一句含糊的 `（试炼通关另有奖励）`——打完三关到底多给多少钱、值不值得为它备药练级，全靠通了才知道；而实际奖励 `150 + 等级×20` 从 v1.x 起就藏在 `battle.js winBattle` 一行硬编码里。现在预览行把**确切数额**写出来：`战利品预览：经验 +90 金币 +0 · 抗火（试炼通关另奖 350 金币，随等级提升）`——进试炼前一眼看清「这趟值多少钱」，与既往「战利品/强度/倍率全透明」体系一致。
- 【与结算逐字同源】奖励公式数据化为 `rules.js` 的纯函数 `rushReward(level)`（`150 + level×20`，等级≤0 钳制为 0），`battle.winBattle` 的结算直接调用它——结算与预览**同一份数据源**，绝无第二套口径；预览数额按当前等级实时显示，注明「随等级提升」，与结算「按最后一关击杀时等级计」语义一致（若试炼途中升级，结算金额随升级同步变大，预览也如实跟随）。非试炼战（普通怪/Boss/精英）完全不显示该串，无泄漏。
- 【零行为风险】仅 `rules.js` +1 个纯函数、`battle.js` 结算一行改为调用它（数值逐字不变 `150 + level*20`）、`view/drawBattle.js` 预览行一处文案由占位改确切数额；未动任何遇敌、掉落、经验/金币、难度、成就、存档、任务、地图逻辑；试炼奖励数值与原公式完全一致，仅显示层变化。
- 验证：`node --check js/rules.js js/battle.js js/view/drawBattle.js` 与 `npm run check`（23 模块）全部通过；`npm test` **49/49**、`/tmp/jrpg_smoke_esm.mjs` 全量 ESM 冒烟（ALL ESM SMOKE CHECKS PASSED）保持通过；v10.0/v9.0/v8.0/v7.9/v7.7/v7.6/v7.5/v7.1/v7.0 专项冒烟全过；新增 v11.0 专项冒烟（/tmp/jrpg_smoke_v1100_rushreward.mjs）**21 项断言全过**——`rushReward` 数据契约（1→170 / 10→350 / 20→550 / 0→150 / 负数与 null/undefined → 150 不 NaN / 随等级递增）、结算同源（level 10 通关最终关 gold 增量恰为 350、rushDone 置位、rushStage 复位、整数无浮点残渣）、试炼战预览行端到端逐字 `试炼通关另奖 350 金币`（level 10）与 `随等级提升`、level 20 联动显示 550、旧占位文案已移除、非试炼战不泄漏、连绘 3 次零状态改动（纯显示收敛）。README 战斗说明一处同步。

## v10.0 标题页快捷键提示补全两行（体验打磨·可发现性，承接 v9.0 暂停菜单）
- 【标题页只提示 6 个键，常驻面板全隐身】标题画面底部唯一一行提示是 `按 1/2/3 选槽 · WASD移动 · Esc菜单 · P存档 · M静音 · H操作说明`——`I 状态 / J 日志 / B 图鉴 / C 成就 / T 旅行 / F 喝药` 这些常驻面板与操作明明都存在（v9.0 起 Esc 菜单也把它们一一列全），却从不在这唯一的新手会盯着的画面出现；不开 H 帮助的新玩家根本不知道还有状态页、任务日志、图鉴、成就、快速旅行、战斗中按 F 喝药这些功能。标题页作为「重置/换档/新开档」的必经界面，理应把全部常驻操作一眼列全。现在标题提示补全为两行：第一行 `按 1 / 2 / 3 选择存档槽 · L 读档 · WASD 移动 · Esc 菜单 · P 存档 · M 静音`，第二行 `I 状态 · J 日志 · B 图鉴 · C 成就 · T 旅行 · F 喝药 · H 帮助`（第二行降暗 11px，主次分明）。
- 【与按键分派逐字同源】两行提示每个快捷键都直接对应 `main.js` 世界画面/标题画面的分派路径（`i→goto('status')`、`j→journal`、`b→codex`、`c→ach`、`t→travel`（含进门前当前地图定位，同 v9.0）、`f→usePotion`、`h→help`、`l→load`、`p→saveGame`、`m→静音`）——先核对该表再落文案，绝不写提示里不存在的快捷键。
- 【零行为风险】仅改 `js/view/menus.js` 的 `drawTitle()` 两行 `fillText` 文案（+ 一条注释）；未动任何按键分派/场景/面板/存档/战斗/数值逻辑；`node --check` 与 `npm run check`（23 模块）全部通过；`npm test` **49/49**；新增 v10.0 专项冒烟（/tmp/jrpg_smoke_v1000_titlekeys.mjs）**10 项断言全过**——两行提示源码逐字在位、drawTitle 渲染不抛错、运行期两行逐字绘制、I/J/B/C/H 逐个按下进入正确界面、T 进入 travel 且定位当前地图、F 喝药不换场景、连续 3 次 drawTitle 不改场景/hp/金币/经验/等级（纯显示收敛）；v9.0/v8.0/v7.9 专项冒烟回归全过。README 快捷键表本就完整、无需改动。

## v9.0 暂停菜单补全「成就 / 快速旅行」入口（体验打磨·可发现性）
- 【两个面板只有快捷键、菜单里找不到】Esc 暂停菜单此前只有 状态/日志/图鉴/存档/帮助 五项面板 + 继续/返回标题——「成就一览（C）」和「快速旅行（T）」明明都是常驻面板，却只能靠 README 里的快捷键找到；新玩家按 Esc 翻菜单根本不知道还有这两个界面可看（成就更是完全隐身）。现在菜单补全为 9 项：`继续冒险 / 状态(I) / 任务日志(J) / 敌人图鉴(B) / 成就(C) / 快速旅行(T) / 存档(P) / 操作说明(H) / 返回标题`——每个可进面板与快捷键一一对齐，可发现性补齐。
- 【接入复用既有逻辑】`PAUSE_ITEMS` 新增 `ach` / `travel` 两项，`main.js` 的 pause 分派直接复用世界画面同样的 goto 路径（`travel` 进入前用与 `T` 键逐字相同的当前地图定位逻辑）；行距 36→32（高亮条 32→28）在 392px 面板内放下 9 行，末行文本 y=380 仍远高于底部提示行 y=412。
- 【零行为风险】未动任何战斗/任务/成就/存档/地图/数值/快捷键本身；`C` / `T` 直开路径逐字不变；Esc 返回、↑↓ 环绕（仍按 `PAUSE_ITEMS.length` 取模）、存档槽提示全部不变；未知 id 依旧静默返回。
- 验证：`node --check js/main.js js/view/menus.js` 与 `npm run check`（23 模块）全部通过；`npm test` **49/49**；新增 v9.0 专项冒烟（/tmp/jrpg_smoke_v900_pausemenu.mjs）**10 项断言全过**——9 项结构与顺序、成就/快速旅行 hint、九选位 drawPause 渲染不抛错、8 个导航项 Enter 接线逐项进入正确场景（含 travel 定位当前地图）、Esc 返回、↑↓ 双向环绕；`/tmp/jrpg_smoke_esm.mjs` 全量 ESM 冒烟（ALL ESM SMOKE CHECKS PASSED）保持通过。README 快捷操作一行同步。

## v8.0 困难模式倍率数据化 + 创建/状态页常驻标注（体验打磨·信息透明，承接 v7.8/v7.9 区域倍率）
- 【困难档的「黑盒」终于拆开】区域倍率（v7.8/v7.9）透明化之后，全游戏只剩一处数字从不示人：**困难档的具体代价**。选档时只有一句「魔物更强、血更高」，进游戏后困难档玩家浑身上下只挂一个 `⚡` 徽标——「这档到底难在哪」从来没被写成明文，README 写着 `敌×1.35血/×1.15攻/×1.12防`，游戏内却从 v1.x 起就藏在 `battle.js startBattle` 的 `if (S.G.diff)` 三行硬编码里。现在困难档的确切倍率**常驻两处**：创建角色页（选档瞬间告知代价）与状态界面（`I` 姓名行）：`[困难 · 魔物HP×1.35 攻×1.15 防×1.12]`——进游戏后随时可核对「我面对的是 35% 血 / 15% 攻 / 12% 防 的魔物」，与 v7.8 区域倍率、v7.7 暴击标注同一「信息透明」体系。
- 【与结算逐字同源】倍率数据化为 `data.js` 的 `DIFF_SCALE`（`{hp:1.35, atk:1.15, def:1.12}`），`battle.startBattle` 的敌方缩放改为逐项读 `DIFF_SCALE`，两处标注**直接取同一份数据**——数值、结算、标注三处绝无第二套口径（`Math.round` 取整次序逐字不变）。
- 【零行为风险】`DIFF_SCALE` 的数值与旧硬编码完全一致、缩放只在 `startBattle` 对 `S.enemy` 生效（boss/精英/普通怪/试炼/RUSH 皆同），困难档战斗数值逐项与改动前完全相同；未动任何遇敌/掉落/经验金币/成就/存档/任务/地图逻辑；普通档（无 `diff`）完全不走该分支、行为零变化。
- 验证：`node --check js/data.js js/battle.js js/view/menus.js` 与 `npm run check`（23 模块）全部通过；`npm test` **49/49**；新增 v8.0 专项冒烟（/tmp/jrpg_smoke_v800_diffscale.mjs）**21 项断言全过**——DIFF_SCALE 数据契约、困难档 `startBattle` 逐项缩放（hp×1.35 / atk×1.15 / def×1.12）且与常量逐字同源、普通档不缩放回归、drawStatus 困难行逐字含完整三倍率（普通档不带）、drawCreate 困难说明含确切倍率、连续 3 次重绘 hp/mp/gold/xp/level/map/scene 零改动（纯显示收敛）。README 角色创建一行同步。

## v7.9 HUD 区域标注「补全全部倍率」攻/防/经验/金币（体验打磨·信息透明，承接 v7.8 区域标注）
- 【只标「魔物×」不看攻防与收益，仍是半个黑盒】v7.8 把区域修正数据化并常驻 HUD，但地图行只写了 `凶险之地·魔物×1.2`——星井矿脉明明还悄悄提升了怪的攻击（×1.15）、防御（×1.1）、经验/金币（各×1.15），玩家却只看见血量倍率；雾语林两处入口同一只史莱姆的难易、矿脉里打怪经验为何偏高，都无从核对。现在地图行**逐项列出全部区域倍率**：`凶险之地·魔物×1.2·攻×1.15·防×1.1·经验×1.15·金币×1.15`、`安宁之地·魔物×0.9·攻×0.9`——「这区危险在哪、收益在哪」一眼看全，与 v7.8 同属「信息透明」体系。
- 【与结算逐项逐字同源】标注的每项倍率直接遍历 `data.js MAPS.zone`（hp→魔物 / atk→攻 / def→防 / xp→经验 / gold→金币），`randomEncounter` 逐项应用同一份数据——village 两项、cave 五项、无 zone 的雾语林（dungeon）完全不显示；只列存在项，绝不虚报不存在的字段。
- 【零行为风险】仅改 `js/view/hud.js` 的 `renderHUD()` 一处字符串构建（`zoneTag`）；**未动任何遇敌/战斗/掉落/经验/金币/难度/成就/存档/地图逻辑**；困难档 `⚡` 徽标与昼夜标签、地图名、角色名拼接顺序逐字不变。
- 验证：`node --check js/view/hud.js` 与 `npm run check`（23 模块）全部通过；`npm test` **49/49**；`/tmp/jrpg_smoke_esm.mjs` 全量 ESM 冒烟（ALL ESM SMOKE CHECKS PASSED，含 `cave 难度倍率生效 ×1.2` / `village 减益倍率生效 ×0.9` 既有断言保持通过）；新增 v7.9 专项冒烟（/tmp/jrpg_smoke_v790_zonetag.mjs）**24 项断言全过**——zone 数据契约（cave 五项 / village 两项 / dungeon 零）、cave 与 village 逐字完整含每项倍率、dungeon 不标注、连续 5 次重绘 hp/mp/gold/xp/level/map/scene 零改动（纯显示收敛）、`randomEncounter` 区域修正（hp×1.2 / atk×1.15 / xp×1.15 / gold×1.15）回归不受影响、标注与 zone 数据逐字同源、困难档 ⚡ 徽标在位。README 视觉一处同步。

## v7.8 HUD 地图行常驻「区域强度」标注 + 区域修正数据化（体验打磨·信息透明，承接 v7.7 暴击标注）
- 【为什么同一个怪，矿脉里比镇里硬一截？】从 v1.x 起,地图倍率就一直硬编码在 `battle.js randomEncounter` 的 `if/else` 里（`cave` 魔物 hp×1.2 / atk×1.15 / def×1.1、经验金币×1.15；`village` hp×0.9 / atk×0.9）——遇敌时怪物属性**默默**被放大/缩小，战斗预览里的血槽也照算，玩家却从不知道「这是地区特性、不是脸黑」；战利品预览、图鉴强度全部透明化的今天，**「为什么这个区更危险/更安逸」仍是黑盒**。现在 HUD 地图行常驻**区域强度标注**：`守灯人 · 星井矿脉 · 白天 · 凶险之地·魔物×1.2`、`潮灯镇 · 安宁之地·魔物×0.9`——进图第一眼就知道该按什么预期练级/补给，与 v7.6 抗性标注、v7.7 暴击标注同一「信息透明」体系。
- 【与结算逐字同源】区域修正**数据化**为 `data.js` 的 `MAPS.zone`（village：`{label:'安宁之地', hp:0.9, atk:0.9}`；cave：`{label:'凶险之地', hp:1.2, atk:1.15, def:1.1, xp:1.15, gold:1.15}`），`randomEncounter` 改为逐项读 `zone`；HUD 标注文本 `zone.label·魔物×zone.hp` **直接取自同一份数据**——数值、标注、结算三处绝无第二套口径。无 `zone` 的地图（雾语林）完全不修正、不显示标注。
- 【零行为风险】**数值逐项与旧公式完全一致**（cave 五项 / village 两项倍率、四舍五入、hpMax 同步）——只是硬编码换成了数据驱动；未动精英公式、掉落、monReward 基准、困难模式（×1.35/×1.15/×1.12）、成就、存档、任务、地图本体；Boss/试炼/RUSH 不走 `randomEncounter`、完全不受影响。
- 验证：`node --check js/data.js js/battle.js js/view/hud.js` 全部通过；`npm run check`（23 模块）全部通过；`npm test` **49/49**；`/tmp/jrpg_smoke_esm.mjs` 全量 ESM 冒烟（ALL ESM SMOKE CHECKS PASSED，含 `cave 难度倍率生效 ×1.2` / `village 减益倍率生效 ×0.9` 两只既有断言保持通过）；新增 v7.8 专项冒烟（/tmp/jrpg_smoke_v780_zone.mjs）**15 项断言全过**——zone 数据契约、`randomEncounter` 确定性逐项应用（cave 五项 / village 两项 / dungeon 零修正）、hpMax 同步、renderHUD 地图行逐字标注（`凶险之地·魔物×1.2` / `安宁之地·魔物×0.9`）、无 zone 地图不显示、标注与 zone 数据逐字同源、连续重绘不破坏地图行结构。README 视觉/区域标注一处同步。

## v7.7 状态界面攻击行常驻「暴击率×倍率」标注（体验打磨·信息透明，承接 v4.6 精确伤害体系）
- 【每个战斗数值都被透明化的今天，暴击仍是最后一个黑盒】v4.6 起敌方「下一击伤害」、v5.4/v6.0 双方精确 HP、v7.1 逐招预判、v7.5 反击伤害——攻击/防御/技能/抗性/石甲/中毒/灼烧全部「看得出数字」，唯独**普攻本身的暴击**（概率 12%、倍率 ×1.8）从 v1.x 起就藏在 `battle.js` 的 `doAttack`：`Math.random() < 0.12` 判定、`attackMove` 里 `×1.8` 结算——玩家只看得到「💥（暴击！）」飘字，永远不知道这一下是几率的哪一面、面板该不该拿暴击概率算期望；README 也只在蓄力一栏顺带提了句「与暴击可叠加」，游戏内零提示。现在状态页（`I`）攻击行右侧常驻**精确标注**：`· 普攻12%暴击 ×1.8`——与结算逐字同源，一眼看清「面板外还有 12% 的无本加成」，练级换装时把暴击期望也一并算进账。
- 【与结算逐字同源】数值直接源于 `battle.js` 唯一裁决处：`doAttack` 的 `const crit = Math.random() < 0.12` 与 `attackMove` 的 `dmg * (isCrit ? 1.8 : 1)`——绝无第二套口径；且只影响**普攻**（技能不触发），标注完整注明「普攻」。辅以位置核对：攻击数值行（x=150 起点、Lv.6 圣剑 `27 +24 = 51` 右缘 ≈198）与暴击标注（x=288 起点、琥珀小字，右缘 ≈360 < 570 面板右界）零重叠，不遮挡任何既有字段。
- 【零行为风险】仅改 `js/view/menus.js` 的 `drawStatus()` 攻击行一处（`+1 行 11px 小字标注 + 注释`）；**未动任何暴击判定、伤害公式（12%/×1.8 本体）、掉落、经验/金币、难度、成就或存档逻辑**；战斗画面指令栏/技能菜单/攻击预览（`≈N伤` 仍为无浮动期望值、不含暴击，口径不变）与其余状态行逐字不动。
- 验证：`node --check js/view/menus.js` 与 `npm run check`（23 模块）全部通过；`npm test` **49/49**；`/tmp/jrpg_smoke_esm.mjs` 全量 ESM 冒烟（ALL ESM SMOKE CHECKS PASSED）、v7.0（18/18）、v7.1（18/18）、v7.3（40/40）、v5.9（21/21）保持通过；新增 v7.7 专项冒烟（/tmp/jrpg_smoke_v770_crit.mjs）**17 项断言全过**——drawStatus 攻击行逐字含「普攻12%暴击 ×1.8」、数值与 battle.js 源码 doAttack(0.12)/attackMove(×1.8) 逐字同源、攻击值右缘 < 288 与标注零重叠、标注右缘 < 570 面板右界、防御/金币/技能/冒险进度各既有行在位（回归）、连续 5 次重绘 hp/mp/gold/xp/level 零改动（纯显示收敛）、drawBattle 渲染与指令栏回归（未被暴击标注污染）。README 战斗说明一处同步。

## v7.6 战斗「战利品预览」行补齐敌方【抗性】标注（体验打磨·信息透明，承接 v6.3/v7.0 伤害预览透明化）
- 【技能伤害明明低一截，却不说为什么】战斗画面「战利品预览」行多年来只标敌方**弱点**（`· 弱点火`），但从 v4.x 起技能期望伤害就已**默默**按 `elemMult` 把抗性 ×0.7 算进去了——打骷髅兵/树精/石魔像/魔王真身时，同一招 `≈N伤` 比打无抗怪物低 30%，玩家只能靠图鉴（`B`）翻数据才能对得上，战斗内「打它为什么这么低」始终是黑盒。现在预览行与弱点对称补上**抗性**：`战利品预览：经验 +50 金币 +39 · 弱点火 · 抗冰`——一眼看清「这怪天生扛冰刀 30%，陨石/火招更划算」。图鉴 `codexTag` 与战斗画面从此同一套口径，绝无第二套。
- 【与结算逐字同源】数值直接读取 `enemy.resist`（与 `elemMult` 抗性 ×0.7、`rules.js` 的 `codexStats`/图鉴 `抗性·X` 同一份 `SPECIES`/`MON_BASE` 数据源）；无抗性敌人（史莱姆/野狼/哥布林/毒蛇/石心魔像）不显示，行文本与 v7.5 逐字一致、零回归；弱+抗并存（骷髅兵/树精/石魔像）与仅抗无弱（幽冥魔王·真身、终焉之神）都正确落位；最宽行（终焉之神：抗火+🍄必掉蘑菇+战胜另+300金）居中右缘 ≈569 < 640 画布宽，不越界。
- 【零行为风险】仅改 `js/view/drawBattle.js` 预览行一处（`+1 个 res 拼接串`，坐标 y=112 居中行不变）；**未动任何伤害公式、`elemMult`、技能期望、掉落、经验/金币、难度、成就或存档逻辑**；Boss 受击预判行（v7.1/v7.5）与其余既有文案逐字不变。
- 验证：`node --check js/view/drawBattle.js` 与 `npm run check`（23 模块）全部通过；`npm test` **49/49**；`/tmp/jrpg_smoke_esm.mjs` 全量 ESM 冒烟（ALL ESM SMOKE CHECKS PASSED）保持通过；新增 v7.6 专项冒烟（/tmp/jrpg_smoke_v760_resist.mjs）**16 项断言全过**——双标注敌人/仅抗敌人/无抗敌人逐字正确、与 v7.5 前无抗行文本完全一致、真实最宽行估算右缘 569<640、连续 3 次重绘 hp/mp/gold/xp/敌方HP/回合/日志 零改动（纯显示收敛）、含抗性怪渲染不抛错；v7.5 反击冒烟（14/14）与 v7.1 Boss 预判冒烟（18/18）保持通过。README 战斗说明一处同步。

## v7.5 防御反击伤害预估「反击≈N伤」补入预判行（体验打磨·信息透明，承接 v6.7 防御态完整效果）
- 【知道会被减半、能回蓝、能反击——却不知道这一刀反击打多少】v6.7 起防御态角标已如实标注「50%几率反击」，但「反击能打掉敌方多少血」仍是黑盒：同样的 `[5]防御`，对石头壳的史莱姆和对软壳的精英效果天差地别，玩家要么按住防御碰运气、要么干脆没把反击算进「该不该防」的账里。现在普通战/Boss 战的**防御中（格挡中）敌袭预判行补上精确反击伤害**：普通怪 `敌方攻击预判：格挡中 · 本回合只受 -10血 · 反击≈18伤`，Boss 战 `格挡中 · 普攻 -12血 · 重击 -23血 · 反击≈18伤`——一眼看清「扛这一刀的同时，白赚敌方多少血」，防御从「挨打少一半」升级成「攻防一体的可计算决策」。
- 【与结算逐字同源】数值直接套 `battle.js` `enemyAct` 防御反击分支的同一式：`max(1, cmdDmg(hero.atkMax, enemy.def, 0.7))` —— 反击倍率 0.7、`cmdDmg` 无浮动（确定性取值），与真实反击结算绝无第二套口诀；普通战与 Boss 战共用同一 `counterDmg` 计算，只有展示位置不同。只在**格挡中（防御态）**显示，未防御时不预览反击值（不提前剧透）。
- 【零行为风险】仅改 `js/view/drawBattle.js` 的 `drawBattle()` 预判分支两处字符串（Boss 分支与普通怪分支各追加 ` · 反击≈N伤`，都在既有预判行内、坐标 y=395 居中行不变，实测文本右缘仍远小于 640 画布宽）；**未动任何防御减伤 / MP 回复 / 反击判定与伤害结算 / 敌方行动 / 掉落 / 难度 / 成就 / 存档逻辑**；非防御态预判行（v5.3）与 Boss 逐招预判行（v7.1）逐字不变。
- 验证：`node --check js/view/drawBattle.js` 与 `npm run check`（23 模块）全部通过；`npm test` **49/49**；新增 v7.5 专项冒烟（/tmp/jrpg_smoke_v750_counter.mjs）**14 项断言全过**——普通怪/Boss 格挡中行逐字完整（受击 + `反击≈N伤`）、反击值与 `max(1, round(max(1, atkMax×2−def)×0.7))` 逐字同源、非防御态原预判行回归且不泄露反击、Boss 逐招 v7.1 回归、致命判定不因反击值变化、连续 2 次重绘 hp/mp/gold/xp/level/enemyHP/defending/turn 零改动（纯显示收敛）；v7.1（18/18）、v7.3（40/40）、v7.4（21/21）专项冒烟保持通过。README 战斗说明一处同步。

## v7.4 状态界面技能区「MP 消耗」显示（体验打磨·信息透明，承接 v4.3 战斗技能菜单）
- 【战斗菜单标了 MP、状态页却一片空白】战斗里按 `2` 的技能菜单每条都实时标注 MP 消耗（v4.3），但常驻的状态界面（`I` 键）「已学技能」列表只写效果说明、不写消耗——出战斗该练哪招、蓝量撑不撑得起连发，只能靠记忆或进战斗才知道。现在状态页技能行补齐 MP：`· 火焰斩（灼烧2回合） · 4 MP`；「下一技能」预估行也同步补上该招消耗：`📖 下一技能：冰霜击（Lv.3 · 还差 48 经验 · 5 MP）`——状态页一眼看清「这一招花多少蓝、下一招要攒多久」。
- 【与战斗技能菜单逐字同源】MP 值直接读取与技能菜单同一份 `SKILL_DATA.mp`，绝无第二套口径；`sd.mp` 缺省（未知技能名）自动不拼接，不显示 NaN、不抛错。
- 【零行为风险】仅改 `js/view/menus.js` 的 `drawStatus()` 两处字符串（已学技能行 + 下一技能行，坐标/字号/行距均不变，文本宽度仍远小于 500px 面板）；**未动任何 MP 结算、技能伤害、领悟曲线、升级判定、战斗或数值**；v6.6 经验行「距升级还差 N 经验」等既有文字逐字不变。
- 验证：`node --check js/view/menus.js` 与 `npm run check`（23 模块）全部通过；`npm test` **49/49**；新增 v7.4 专项冒烟（/tmp/jrpg_smoke_v740_mpstatus.mjs）**21 项断言全过**——火焰斩行 `· 4 MP` 逐字在位且与 `SKILL_DATA.mp` 同源、5 招全学满逐招 MP 正确、全技能后「已习得全部技能」路径、未知技能名不挂 NaN、下一技能行含 v6.6 剩余经验 + MP、连续绘制不改任何游戏状态（纯显示收敛）、v6.6 经验行回归；v6.6 专项冒烟 **10/10** 与 `/tmp/jrpg_smoke_esm.mjs` 全量 ESM 冒烟（ALL ESM SMOKE CHECKS PASSED）保持通过。README 系统清单一处同步。

## v7.3 通关后全镇 NPC 彩蛋对话（新内容·世界完整回应终局，承接 v7.2 井巫彩蛋）
- 【彩蛋只此一家、其余 NPC 依旧旧叙事】v7.2 为井巫补齐了通关彩蛋，但攻下终焉之神、看过真结局之后再回村，镇民还念叨「灯灭之后数着路回家」、巡灯人还在讲「被它装进剑里的黎明」、雾径猎手还在劝「备好药水再走」——**世界只响了一次回声**。现在三位非任务 NPC 也各配通关彩蛋：镇民（「雾散了，镇里的灯一盏盏亮回来…天还是半亮，可够把路看清了」）、巡灯人（「他确是旧灯卫——把黎明封进剑里…那名字，如今归你替他记着」）、雾径猎手（「魔物是雾里长出来的。雾一散，它们便像被领回家的记忆，各归各位」）——同一主题「记得/记忆/灯」的三种和声，兑现 v5.0「灯灭→夺芯→半亮黎明」的结局。
- 【纯数据 + 既有回退分支】仅 `js/data.js` 的 `NPCS`（villager/adventurer/hunter 三条）追加 `after` 台词数组；机制零新增——`js/quests.js` 的 `npcQuestPages` 无待办任务回退时 `hero.trueBoss && NPCS[id].after` 优先返回，v7.2 已搭好，本次只是把既有数据驱动机制填满。
- 【零行为风险】未动任何战斗/任务/成就/存档/地图/数值；任务待办依旧优先于彩蛋（chief/cartman 两条支线不受影响）；未通关玩家台词逐字不变；无 `after` 的 NPC（chief/cartman）即使通关仍走原台词；未知 NPC 仍回退 `[……]` 占位；`npcQuestMark` 顶标判定不受影响（纯闲聊 NPC 依旧无顶标）。
- 验证：`node --check js/data.js` 与 `npm run check`（23 模块）全部通过；`npm test` **49/49**；新增 v7.3 定向冒烟（/tmp/jrpg_smoke_v730_after.mjs）**40 项断言全过**——三个 NPC 数据契约（after 2 页/继续·结束标记/原台词保留）、通关后逐字返回彩蛋、未通关（trueBoss 缺省/false/null）台词逐字不变、cartman/chief 无 after 通关后仍原台词、未知 NPC 占位不变、顶标仍为 null、彩蛋关键句与 v5.0 世界观一致；`node -e import('./js/main.js')` 启动引导零报错。README 系统清单一处同步。

## v7.2 通关后「井巫」彩蛋对话（新内容·世界回应终局，承接 v5.0 记忆主题）
- 【通关后世界毫无反应】击败终焉之神、看完结局后，再回星井矿脉与任何 NPC 对话，台词都还停留在「水晶里睡着终焉之神」的旧叙事里——世界不记得你已经赢了。现在井巫（星井矿脉入口，4,1）在 `trueBoss` 达成后改说**通关彩蛋**：`水晶空了。星砂落回矿脉深处……记得的灯，从此由你掌着。`——两页收尾，兑现全游戏「记得/记忆/灯」的母题。
- 【纯数据 + 一处回退分支】`js/data.js` 的 `NPCS.sage` 新增 `after` 台词数组（仅数据）；`js/quests.js` 的 `npcQuestPages(hero, npcId)` 无待办任务回退时，若 `hero.trueBoss && NPCS[npcId].after` 则优先返回彩蛋。机制天然数据驱动：今后任何 NPC 定义 `after` 即可在通关后换台词，不动其他逻辑。
- 【零行为风险】未动任何战斗/任务/成就/存档/地图/数值；任务待办（接/交任务）依旧优先于彩蛋（chief 支线不受影响）；未通关玩家台词逐字不变；无 `after` 的 NPC（猎人/车夫等）即使通关也仍走原台词；未知 NPC 仍回退 `[……]` 占位。
- 验证：`node --check js/data.js js/quests.js` 与 `npm run check`（23 模块）全部通过；`npm test` **49/49**；`/tmp/jrpg_smoke_esm.mjs` 全量 ESM 冒烟（ALL ESM SMOKE CHECKS PASSED）保持通过；新增 v7.2 定向断言（quests.js 纯函数直测，无 DOM 桩）**8/8 全过**——通关后井巫返回 2 页彩蛋、未通关台词逐字不变、无 after 的 NPC 不受影响、未知 NPC 占位不变、chief 任务待办仍优先。
- 附带：修复技能脚本 `balance_sim.mjs` 适配 v4.0+ `state.js` 导出对象 `S`（原 globalThis 写法已失效），并用其对当前版本复跑蒙特卡洛——普通档生还率 99.97–100%、困难智能喝药 94.72%、凶手均匀分布、新手保护完好，**开局数值无需调整**。

## v7.1 Boss/试炼战「敌方攻击预判」逐招列出（体验打磨·信息透明，承接 v6.3 敌招一览）
- 【最强力的战斗反而没有受击预判】普通怪/精英战在指令栏底部常驻 `敌方攻击预判：-N血（防御后-N血）`，但 Boss 战（幽冥魔王/洞窟领主/终焉之神/试炼三连战）因「多招数、伤害不确定」被整体跳过——y≈395 处一片空白，打 Boss 只能凭体感猜「这刀要不要防」。现在 Boss 战按敌方招数表**逐招列出期望伤害**：`敌方攻击预判：普攻 -24血 · 重击 -46血（防御后-12/23血）`，防御中显示 `格挡中 · 普攻 -12血 · 重击 -23血`；任一招可能致命则橙色 `⚠️致命`（取最重一击为上限）。
- 【与结算逐字同源】直接读取 `battle.pickAct/enemyAct` 同一份 `enemy.acts`：重击倍率同 `enemyAct`（真身 2.3 / 平时 1.9）、受击公式 `cmdDmg(atk, defMax, mult)` 同式同序、防御中 ×0.5 取整同结算；只列会出伤害的招（回血/石甲不算受击，不虚报）；无攻击招的 Boss 自动回退为普攻单招；与 v6.3 敌招一览共用招数数据源，绝无第二套口径。
- 【零行为风险】仅改 `js/view/drawBattle.js` 一处（在既有 `!S.skillMenuOpen` 分支内、`isBossFlee` 时新增绘制，y≈395 为 Boss 战空位，不与血条/角标/命令栏/日志重叠）；**未动任何 Boss 出招判定、变身、伤害公式、掉落、难度、成就、存档逻辑**；精英（石心魔像）与普通怪仍走原单招预判、行为完全不变。
- 验证：`node --check js/view/drawBattle.js` 与 `npm run check`（23 模块）全部通过；`npm test` **43/43**；新增 v7.1 专项冒烟（/tmp/jrpg_smoke_v710_bossprev.mjs）**18 项断言全过**——幽冥魔王/终焉之神/试炼 rush 三线预判逐字同源、非防御态含防御后列、防御态格挡中不叠加括号、真身重击 ×2.3 联动、致命警示（最重一击≥HP）、满血不误报、回血/石甲不计入、精英/普通怪单招预判回归、无 acts 回退不抛错、技能菜单打开不绘制、连续 3 次重绘零状态改动（纯显示收敛）；`/tmp/jrpg_smoke_esm.mjs` 全量 ESM 冒烟（ALL ESM SMOKE CHECKS PASSED）保持通过。README 战斗说明已同步。

## v7.0 石甲减伤计入攻击/技能伤害预览（体验打磨·信息透明，承接 v6.9）
- 【伤害预览在石甲面前虚报约 67%】石心魔像/洞窟领主凝「石甲」后，真实命中会被扣减 40%（`attackMove` 的 `×0.6`，并消耗 1 层），但战斗指令栏 `[1]攻击 ≈N伤` 与技能菜单 `≈N伤` 的**伤害预览完全没算这一层**——盾挂着时玩家看到的期望比实际高出约 67%，常误判「再一刀就能破盾收掉」，实际却差出半刀，还会误选胜率更低的技能。现在预览与结算逐字同源：敌方石甲 >0 时，`[1]攻击` 与技能期望一律按 `Math.max(1, round(N×0.6))` 还原（同 `attackMove`：先按完整期望取整、再扣盾、保底 1），盾一消预览立刻弹回原值。
- 【与结算逐字同源】`rules.js` 新增纯函数 `withShield(dmg, enemy)`，`atkEstimate`/`skillEstimate` 末尾套用——与 `battle.attackMove` 的 `Math.max(1, Math.round(dmg * 0.6))` 同式同序；治疗技能不走 `attackMove`、不受影响（治愈预览仍只算 HP 上限比例）；陨石术「碎甲」同样先扣盾再碎（与真实结算同构：伤害先 ×0.6、层数随后清零）。绝无第二套口径。
- 【零行为风险】仅改 `js/rules.js`（+1 个纯函数、两个返回值套用）；**未动任何真实伤害/命中/石甲层数与结算、掉落、难度、成就、存档逻辑**；`atkEstimate`/`skillEstimate` 只被战斗画面预览（`js/view/drawBattle.js` 指令栏与技能菜单）与测试引用，无盾敌人（普通怪）期望值与既有公式（v4.3/v2.17）完全一致、零回归。
- 验证：`node --check js/rules.js` 与 `npm run check` 全部通过；`npm test` **43/43**；新增 v7.0 专项冒烟（/tmp/jrpg_smoke_v700_shieldprev.mjs）**18 项断言全过**——无盾回归原公式、盾>0 精确 ×0.6 取整保底、shield=0/undefined 不减伤、低伤害保底 1、蓄力×1.5 先乘后扣盾、技能弱电/陨石碎甲同构、治愈不受盾影响、drawBattle 指令栏端到端逐字 `≈7伤`（带盾）、连续重绘 hp/mp/石甲/scene/回合零改动（纯显示收敛）、普通怪预览不回归；`/tmp/jrpg_smoke_esm.mjs` 全量 ESM 冒烟（ALL ESM SMOKE CHECKS PASSED）保持通过。README 战斗说明已同步。

## v6.9 敌人图鉴「魔物强度」数值（体验打磨·信息透明）
- 【战败提示叫人看图鉴强度，图鉴却没有强度数值】阵亡画面一直写着「用图鉴(B)查看魔物强度后再战」，但图鉴「击败可得」行只有经验/金币——这怪有多少血、攻防多高，只能挨打试错才知道。现在**已讨伐行的报酬参考行尾部补齐该魔物在当前玩家等级下的强度参考**：`→ 击败可得：经验 41 · 金币 31 · HP41 攻15 防7`——一眼判断「以我现在的等级，打下它要挨几下、值不值得绕路去刷」，与 v6.3 敌方招数一览、v5.2 战利品预览同一套「信息透明」体系。
- 【与遇敌属性逐字同源】新增纯函数 `codexStats(name, level)`（`js/rules.js`，与 `monReward` 同文件同构）：普通魔物＝`MON_BASE` 线性成长式（`hp[0]+lv×hp[1]` 等，与 `battle.js` 的 `scaleEnemy` 逐字同源）；石心魔像＝精英公式 `58+lv×10 / 12+lv×3 / 15+lv×2`（与 `eliteEncounter` 逐字同式）；三 Boss＝直接读取 `BOSS/CAVE_BOSS/TRUE_BOSS` 对象本身（幽冥魔王 140/15/6、洞窟领主 110/16/10、终焉之神 260/22/13，真身名如「终焉之神·祸乱形态」同样正确映射）。**绝无第二套口径**；与报酬参考同口径取基准值（不含 village×0.9 / cave×1.2 地图倍率与困难模式 ×1.35/×1.15/×1.12 缩放）。
- 【不剧透】只有**已讨伐行**显示强度；未讨伐的灰色 `❓ ？？？ · 未讨伐` 占位依旧不显示任何数值——延续图鉴灰色占位、旅行「未探索」同一原则；未知名称/越界等级（`level=0`、负数）一律钳制安全（等级下限 Lv.1），不闪 NaN。
- 【零行为风险】仅改 `js/rules.js`（+1 个纯函数）与 `js/view/menus.js` 的 `drawCodex()` 报酬行一处（追加显示串，未动行距/坐标/任何奖励与判定）；**未动任何遇敌、伤害公式、掉落、经验/金币、难度缩放、成就或存档逻辑**。
- 验证：`node --check` 与 `npm run check`（23 模块）全部通过；`npm test` **43/43**（新增 8 项 codexStats 数据契约断言）；新增 v6.9 专项冒烟（/tmp/jrpg_smoke_v690_codex.mjs）**14 项断言全过**——drawCodex 端到端（史莱姆/石心魔像/幽冥魔王行强度串逐字在位、未讨伐野狼行不剧透、报酬行保留、强度串行数与讨伐行数一致、文本宽度不越 124~560 画布区）、纯显示收敛（连续 3 次绘制 hp/gold/xp/level/scene 零改动）、边界契约（level=0/负数钳制、未知返 null、三 Boss 固定值）；`/tmp/jrpg_smoke_esm.mjs` 全量 ESM 冒烟（ALL ESM SMOKE CHECKS PASSED）保持通过。README 图鉴行已同步。

## v6.8 世界画面喷泉回血提示「精确恢复量」（体验打磨·信息透明）
- 【知道能回血，却不知道回多少】面向村口喷泉只显示笼统的「踩上回血」——潮灯镇广场喷泉与雾语林泉水都是 **HP/MP 完全恢复**（`world.js` `onStep` 的 FOUNTAIN 分支 `hero.hp=hero.hpMax; hero.mp=hero.mpMax`），但提示一字不提恢复多少，满状态时踩上去更是白白浪费移动。现在提示补齐**精确缺口**：`踩上回血 · HP+15 MP+30`（残血多少一眼看清，决定绕路回村还是继续赶路）；满状态如实提示 `踩上回血 · 状态已满`，不再无谓踩过去。
- 【与恢复逻辑逐字同源】数值即 `hpMax-hp` / `mpMax-mp` 的 `Math.max(0,…)` 钳制，与 `world.js` 喷泉「完全恢复」逐字同源，绝无第二套口径；`S.G` 缺失等边界安全降级为 `0`，不抛错、不显负数。
- 【纯显示零风险】仅改 `js/view/drawWorld.js` 的 `faceHint()` 一处（FOUNTAIN 分支文案，标签宽度按 `measureText` 自动伸缩、位置不变）；**未动任何回血判定 / 交互逻辑 / 地图 / 遇敌 / 数值**；村庄 → 雾语林两处喷泉共用同一来源，行为一致。
- 验证：`node --check js/view/drawWorld.js` 与 `npm run check`（23 模块）全部通过；`npm test` **36/36**；新增 v6.8 专项冒烟（/tmp/jrpg_smoke_v680_fountain.mjs）**12 项断言全过**——满状态提示「状态已满」、缺口 `HP+15 MP+30` 逐字正确（与全恢复口径一致）、HP 满/MP 空显示 `HP+0 MP+满值` 且无负数、背对/普通格无回血提示、连续 3 次绘制 hp/mp/gold/xp/level/scene/curMap 零改动（纯显示收敛）、面向喷泉/普通地面两次渲染不抛错。README 世界交互一节已同步。

## v6.7 防御态指示补全「回MP / 反击」完整效果（体验打磨·信息透明）
- 【只有一半效果看得见，另一半要靠试错猜】`5` 防御的完整设计是「本回合减伤一半 + 回 2 MP + 被命中 50% 几率趁隙反击」，但战斗画面上防御态角标只写 `防御中 · 减伤50%`——回蓝与反击这两条每次防御都在生效、却完全不透明：空蓝防御想靠它回蓝的玩家不知道自己每回合回 2 MP，也不知道被打时有一半机会白赚一下反击。现在角标补全成 `防御中 · 减伤50% · 回2MP/回合 · 50%几率反击`——一眼看清防御「不只是挨打」。
- 【与结算逐字同源】数值直接套用 `battle.js` 自身结算：回蓝 `doDefend` 的 `mp+2`（钳制 MP 上限）、反击 `enemyAct` 攻击分支 `hero.defending && Math.random() < 0.5` 的 50% 判定——绝无第二套说法；纯显示、只读不改任何防御/反击/回蓝判定、伤害公式或难度数值。
- 【零行为风险】仅改 `js/view/drawBattle.js` 一处字符串（坐标 `(308,359)` 不变、不新增行、`bold 12px` 实测宽度约 250px、右缘 308+250<640 不触碰右侧状态角标列 y≥112 与底部战斗记录 y≥448）；**未动任何防御结算 / 反击实现 / MP 回复 / BOSS 或普通怪任何分支**；README 既有「5 防御（…回 2 MP，被命中 50% 几率趁隙反击）」描述即真实行为，无需改动。
- 验证：`node --check js/view/drawBattle.js` 与 `npm run check`（23 模块）全部通过；`npm test` **36/36**；新增 v6.7 专项冒烟（/tmp/jrpg_smoke_v670_defend.mjs）**8 项断言全过**——防御态角标逐字包含 `回2MP/回合` 与 `50%几率反击`、非防御态不绘制该行、回 MP 数值与 `doDefend` 逐字同源（钳制上限）、连续 3 次重绘 hp/mp/gold/xp/level/敌方HP/defending 零改动（纯显示收敛）、普通战与 Boss 战渲染无异常。

## v6.6 状态界面经验行「距升级还差 N 经验」精确读数（体验打磨·信息透明）
- 【知道差得近，却不知道差多少】胜利横幅每次打完都会提示「距 Lv.X 升级还需 N 经验」，但常驻的状态界面（`I` 键）经验行只有 `经验 12/20` 加一根进度条——练级途中反复开状态页时，永远只能靠目测进度条猜还差多少。现在经验行补上**精确剩余读数**：`经验 12 / 20 · 距升级还差 8 经验`——一眼算出再打几只怪能升级，数值与胜利横幅同款口径、绝无第二套说法。
- 【纯显示零风险】仅改 `js/view/menus.js` 的 `drawStatus()` 一处（经验行字符串，坐标 y=98 不变、不新增行）；**未动任何升级判定 / xpNext 曲线 / 经验结算 / 进度条宽度 / 其他任何状态行**；剩余值 `Math.max(0, xpNext-xp)` 钳制，旧档 `xpNext` 缺失等边界只显示 `0`、不抛错、不显负数。
- 验证：`node --check` 与 `npm run check`（23 模块）全部通过；`npm test` **36/36**；新增 v6.6 专项冒烟（/tmp/jrpg_smoke_v660.mjs）**10 项断言全过**——`经验 7/20 → 还差 13` 逐字正确、`xp=0 → 还差 20`、`xpNext=0` 边界不抛错且钳制 `0`、攻击/防御/技能等既有行全部在位（回归）、连续 3 次重绘 xp/xpNext/level/hp/mp/gold 零改动（纯显示收敛）。

## v6.5 中毒/灼烧「每回合扣血数值」角标（体验打磨·信息透明，承接 v5.1/v6.3 状态角标列）
- 【知道会掉血，却不知道掉多少】Battle 里中毒角标只写「☠️ 中毒 3 回合 · 每回合扣血」——毒蛇 35% 施毒 / 火焰斩灼烧 2 回合经常挂身，但每次到底扣多少血全靠体感（低血量还以为能扛，算不明白该不该净化/速战）。灼烧角标更只有「🔥 灼烧 2」连「扣血」字样都没有。现在两处角标补上**精确回合扣血数值**：`☠️ 中毒 3 回合 · 每回合 -6血`、`🔥 灼烧 2 · 每回合 -10血`——一眼算清持续时间内的总失血，决定先净化/防御还是抢输出。
- 【与结算逐字同源】数值直接套用各自结算公式，绝无第二套说法：中毒 = `max(2, round(hpMax×0.05))`（与 `battle.applyPoisonTick` 逐字同式），灼烧 = `max(2, round(hpMax×0.04))`（与 `battle.enemyAct` 灼烧分支逐字同式）；回合计数随 `hero.poison`/`enemy.burn` 实时递减，层数/剩余回合照旧同步。
- 【零行为风险】仅改 `js/view/drawBattle.js` 一处两个字符串（+3 行注释与数值拼接，坐标 `(60,376)` 我方中毒行 / `(620,128)` 敌方灼烧行均不变）；**未动中毒/灼烧判定、伤害公式、回合递减、任何结算逻辑**；数值区右对齐右缘、不与 v5.4 敌方精确 HP / v6.3 敌方招数一览（y162）/ 石甲行（y112）/ 冻结行（y144）重叠；技能菜单覆盖、Boss/试炼各分支不叠加。
- 验证：`node --check js/view/drawBattle.js` 与 `npm run check`（23 模块）全部通过；`npm test` **36/36**；新增 v6.5 专项冒烟（/tmp/jrpg_smoke_v650_dot.mjs）**13 项断言全过**——无中毒/无灼烧不绘制、`hpMax=120→-6血`、`hpMax=260→-10血`（与公式逐字一致）、`hpMax=20/30` 保底钳制 `-2血`、回合与层数显示、四类强敌 中毒+灼烧共存绘制不抛错、连续 2 次重绘 hp/mp/gold/xp/level/敌方HP/burn/poison 零改动（纯显示收敛）；回归 v5.1 冻结角标 **8/8**（含灼烧同列断言）与 v6.3 敌招 **16/16**。README 战斗说明已同步。

## v6.4 HUD 常驻静音状态指示（体验打磨·信息透明）
- 【按了 M 却不知道静没静成】按 `M` 静音/开声只弹一条短暂的 boxMsg 提示（1.2s 后消失），之后画面上没有任何常驻标识能看出当前到底静没静音——常玩的玩家往往要「听一下有没有声」才能确认。现在 HUD 底部状态行新增**常驻静音指示**：开声 `🔊`、静音 `🔇`，与 💰/🍖/🍄/💾 同一行、带 `按 M 静音/开声` 悬浮提示，读档/切换场景后依旧如实反映当前状态。
- 【与真实状态同源】指示直接读取 `S.SND`（音频模块唯一开关，`resumeBgm/stopBgm` 同源），绝对没有第二套说法；按 `M` 切换时立即 `renderHUD()` 刷新——不依赖任何场景切换或下一次 HUD 重绘时机。
- 【零行为风险】仅改 `js/view/hud.js` 的 `renderHUD()`（+1 行）与 `js/main.js` 的 `M` 分支（+1 行 renderHUD 调用）+ `index.html` 壳里加一个 `<b id="s-snd">` 静态节点（纯 DOM）；**未动任何音频逻辑 / 音效 / BGM / 存档 / 场景 / 战斗 / 数值**；`boxMsg` 反馈与现有行为完全不变。`elId` 已在 Node 冒烟中安全降级，纯显示收敛。
- 验证：`node --check js/main.js js/view/hud.js` 与 `npm run check`（23 模块）全部通过；`npm test` **36/36**（新增「静音指示 开=🔊 关=🔇」断言，DOM 桩下 `renderHUD` 随 `S.SND` 切换输出对联）；`node -e import('./js/main.js')` 启动引导零报错。README 控制键表 M 行已同步。

## v6.3 敌方招数一览（体验打磨·信息透明，承接 v5.4/v5.6/v5.7）
- 【知道它会掉多少血、会变身，却不知道它「会怎么打」】战斗画面此前只透明了数值（伤害预判、精确血条、变身线），但 Boss/精英的招数全是黑的：幽冥魔王会回血、石心魔像会凝石甲、变身后重击大幅强化——全靠吃了亏才记住。现在**会使用多招的强敌**（Boss/精英）在战斗画面右上角常驻**敌方招数一览**：`敌方招数：普攻 / 重击 / 回血·血<40%时`；石甲带触发线 `石甲·血<50%时` 与层数上限 `·至多3层`；变身后追加 `·真身后强`；治愈被祸乱气场封印时标注 `·⛔封印`。一眼看出该压血还是防重击。
- 【与敌方行动表逐字同源】直接读取 `battle.pickAct/enemyAct` 用的同一份 `enemy.acts` 数据，`hpBelow`/`maxShield`/`w2`/`forbid` 全部来自行动定义本身，绝无第二套说法；只列招数与触发线，**不剧透出招权重**（守住策略深度）。只会普攻的普通魔物无 `acts`，不显示，避免噪音。
- 【零行为风险】仅改 `js/view/drawBattle.js` 一处（+15 行，在敌方格斗状态角标列下延 y=162 追加，右缘右对齐、不与血条/精灵/预判行/日志重叠）；**未动任何敌方行动判定 / 伤害公式 / 变身 / 掉落 / 数值**；该行只读不改任何游戏状态。
- 验证：`node --check js/view/drawBattle.js` 与 `npm run check`（23 模块）全部通过；`npm test` **35/35**；新增 v6.3 专项冒烟（/tmp/jrpg_smoke_v630.mjs）**16 项断言全过**——普通史莱姆不显示敌招行、幽冥魔王显示 `普攻/重击/回血·血<40%时` 且未变身不加 `真身后强`、石心魔像 `石甲·血<50%时·至多3层`、终焉之神真身 `重击·真身后强` 与封印态 `回血·血<40%时·⛔封印`、未变身/未封印不加标注、洞窟领主石甲同列共存、同一敌人连续 10 次重绘战斗状态零改动（纯显示收敛）。README 战斗说明已同步。

## v6.2 NPC 可交互顶标（体验打磨·信息透明）
- 【知道下一步该做什么，却常忘了该找谁】灯长/星砂车夫是唯二有「动态对话」的角色——可接委托、可交任务都藏在对话里，不搭话永远不知道。现在这两名 NPC 在世界画面上**头顶常驻脉冲标**：灯长「❕ 可接委托」（支线三株荧光可接时）/「❕ 可交任务」（集齐 3 株魔法蘑菇后可交付）；星砂车夫「❕ 可交任务」（击败洞窟领主、矿车支线激活后）。纯闲聊的镇民/巡灯人/井巫/雾径猎手不显示顶标，不喧宾夺主。
- 【与任务日志逐字同源】判定直接复用 `questStatus()`——与 `J` 任务日志 / 世界横幅 / 对话页共用同一状态机。新增纯函数 `npcQuestMark(hero, npcId)`（放 `js/quests.js` 任务模块），顶标出现/消失与日志「可接/可交付」永远同步，绝无第二套说法；顶标自身只与任务状态相关，读档/交任务后即时刷新。
- 【零行为风险】仅改 `js/quests.js`（+1 个纯函数 + 常规 export）与 `js/view/drawWorld.js` 的 NPC 绘制闭包（在 `drawNpcSprite` 后追加两帧脉冲顶标：橙色圆角标 + 白字，脉冲由 `Date.now()/320` 驱动、纯显示）；**未动任何任务状态机 / 对话流程 / 存档 / 数值 / 移动遇敌 / NPC 坐标**；顶标随 NPC 精灵参与纵向遮挡排序，位置在头顶 `y*T-20` 起、不与 `⏎ 对话` 上下文提示冲突。
- 验证：`node --check js/quests.js js/view/drawWorld.js` 与 `npm run check`（23 模块）全部通过；`npm test` **35/35**；新增 v6.2 专项冒烟（/tmp/jrpg_smoke_v620.mjs）**18 项断言全过**——`npcQuestMark` 纯函数 11 项（开局可接 / 进行中无标 / 可交付 / 已完成无标 / 矿车激活可交 / 未解锁无标 / 完成后无标 / null hero 边界逐字断言），`drawWorld` 端到端 7 项（开局村庄灯长「可接委托」上屏、进行中顶标消失、可交付恢复「可交任务」、洞窟车夫顶标上屏、灯长不在本图不显示、连续 3 次绘制 scene/hp/mp/gold/xp/level/encGauge 零改动——纯显示收敛）。README 系统清单已同步。

## v6.1 世界横幅任务「目的地地点提示」（体验打磨·信息透明，承接 v5.5 📍 / v5.9 传送门去向）
- 【知道要做什么，却常忘了在哪做】左上角任务横幅常驻主线 `🎯 讨伐幽冥魔王` / 支线 `📜 找回魔法蘑菇`，但**去哪**只能开 `J` 任务日志看「地点」行（或靠记忆）。现在横幅每一行对**尚未注明地点的目标**直接补齐 `（地点）`：支线进行中 `找回魔法蘑菇 0/3 株（雾语林宝箱 → 回镇找灯长）`、矿车支线 `把星砂矿车的消息告诉星砂车夫（星井矿脉·星砂车夫）`、星井主线 `深入星井矿脉，击败洞窟领主！（星井矿脉深处）`、终焉水晶主线同理——不离开世界画面一眼看到下一步该去哪。
- 【与任务日志逐字同源】地点字符串直接复用 `questLines().journal` 里 `QUESTS.where` 字段（任务日志 J 的同一条数据），绝无第二套说法；横幅宽度按实际最大行重新测算（含地点后自动加宽，仍封顶 500px）。
- 【智能去重】做包含判断前先归一化（剔除「的」与标点）：目标文案**已含**地点名时不再叠加——如主线开头 `前往雾语林深处的祭坛…` 已含「雾语林深处祭坛」就不重复标 `（雾语林深处祭坛）`；全部主线完成后无 active 主线时也不硬凑地点。
- 【零行为风险】仅改 `js/view/drawWorld.js` 的 `drawWorldBanner()` 一处（纯显示，未动任何任务状态机 / 日志 / 存档 / 数值 / 移动遇敌）；`questLines` 内部逻辑与返回结构完全不变。
- 验证：`node --check js/view/drawWorld.js` 与 `npm run check`（23 模块）全部通过；`npm test` **35/35**；新增 v6.1 专项冒烟（/tmp/jrpg_smoke_v610.mjs）**13 项断言全过**——全新开局主线不重复叠加地点、支线 offer/active 行均带地点、星井主线补「深处」、终焉水晶主线带 `（星井矿脉·终焉水晶）`、矿车支线带 `（星井矿脉·星砂车夫）`、双支线同时可见、全部主线完成后不追加、连续 3 次渲染状态零改动（纯显示收敛）、ending 场景渲染无异常。README 任务日志一行已同步。

## v6.0 战斗画面我方精确 HP/MP 数值（体验打磨·信息透明，承接 v5.4）
- 【敌方有了，我方却没有】v5.4 起敌方血条右侧常驻精确数值（`130/260`），但玩家自己的 HP/MP 只有血条内 9px 小字，敌我信息密度不对等；且 Boss/试炼战里「敌方攻击预判」行的 `我方HP x/y` 不显示，Boss 战打到残血时反而最需要一眼看清新血量——现在血条内小字**之外**，玩家侧血条右侧常驻**同款加粗精确数值**：`123/180`（HP 红）与 `45/90`（MP 蓝），与血条同色、`Math.max(0,…)` 钳制（掉血瞬间不显示负数），Boss / 试炼 / 普通怪战一律可见。
- 【纯显示零风险】仅改 `js/view/drawBattle.js` 的 `drawBattle()` 一处（+2 行数值 + 把防御盾标整体右移 50px 让位：盾图标 `translate(238→288,352)`、`防御中 · 减伤50%` 文案 `258→308,359`）；**未动任何伤害/血条/结算逻辑**，与 v5.4 敌方实现逐字同构（同为 `血条同色 + Math.max 钳制 + 右侧常驻`）。坐标核对：数值区 x216~265 与右移后的盾标 x281+ 无重叠、与 `蓄力中`(y336)/`中毒`(y376)/技能菜单覆盖层互不干扰。另给 `js/view/canvas.js` 的 Node 冒烟 stub 补一个 `quadraticCurveTo` noop（防御盾绘制路径用到，纯测试基建，浏览器行为零变化）。
- 验证：`node --check js/view/drawBattle.js js/view/canvas.js` 与 `npm run check`（23 模块）全部通过；`npm test` **35/35**；新增 v6.0 专项冒烟（/tmp/jrpg_smoke_v600.mjs）**10 项断言全过**——普通战/Boss 战我方 HP、MP 数值逐字正确（`123/180`、`45/90`，同款加粗 12px）、半血实时刷新、HP=0 钳制不现负数、防御态盾标右移至 x=308 且数值不被遮挡、数值区与盾标区无重叠（216<288）、15 次重绘 hp/mp/gold/xp/level/敌方HP/日志/phased 零改动（纯显示收敛）。README 战斗说明已同步。

## v5.9 传送门/出口「目的地提示」（体验打磨·信息透明）
- 【提示了却没说去哪】世界地图上被面向可交互对象上下文提示覆盖到的传送门/出口，只显示笼统的「踩上通行」——站在门前根本不知道这扇门通往哪张图，只能踩上去看效果。现在提示升级为**带目的地地图名**：`踩上通行 → 雾语林`（潮灯镇正门）、`踩上通行 → 星井矿脉`（雾语林右下裂洞）、`踩上通行 → 潮灯镇`（雾语林出口）、`踩上通行 → 雾语林`（星井矿脉出口），能踩上去前先看清去向。
- 【与真实传送逐字同源】新增纯函数 `portalDest(curMap, tile)` 放到 `js/world.js`（传送逻辑所在模块），返回值与 `useGate`/`useExit` 的 `transition()` 目标完全一致（村镇门→dungeon、裂洞→cave、EXIT dungeon→village / 其余→dungeon），视图层只认这一个来源，提示与真实行为永不分叉；不存在的传送/非门图块返回 `null` 自动回退为通用「踩上通行」。
- 【零行为风险】仅改 `js/world.js`（+1 个纯函数 + export）与 `js/view/drawWorld.js` 的 `faceHint()` 两处分支（GATE/EXIT 的提示文案）；**未动 `useGate`/`useExit`/`transition`/任何传送判定或数值**。击败魔王后村镇门「雾退了…」的既有锁定行为不变（该场景提示整体隐藏，回归有断言）。
- 验证：`node --check js/world.js js/view/drawWorld.js` 与 `npm run check`（23 模块）全部通过；`npm test` **35/35**；新增 v5.9 专项冒烟（/tmp/jrpg_smoke_v590_portal.mjs）**21 项断言全过**——`portalDest` 四种真实路径 + 边界 null 共 7 项、目的地中文名 3 项、三张地图真实传送点名 4 项、端到端面向门/出口截获绘制文案 4 项（含面向格确为门）、面向普通地形不画「踩上通行」回归、击败魔王后村镇门提示消失且渲染无异常。README 已同步。

## v5.8 Boss 战逃跑「行动保留」行为修复（战斗回归 v2.2/v1.37 既定设计）
- 【回归修复】README 战斗说明与操作说明明确写着 Boss 战「被气场压制，指令置灰 ⛔ 且不耗回合」，v2.2/v1.37 早已文档化「本回合行动保留、battleBusy 立即释放、不调度 enemyAct」——但近期重构后的 `doFlee()` Boss 分支误调 `afterPlayer()`，把「按 4」变成了「白送一回合给 Boss 白打」：被拒后 600ms 敌方仍会抢先手反击扣血，纯陷阱反馈，与指令栏 ⛔「别按 4」的提示自相矛盾（实测：按 4 后 battleTurn+1、battleBusy 锁定、敌方行动被调度）。
- 【行为恢复】现在四类 Boss（幽冥魔王/洞窟领主/终焉之神/试炼连战）按 4：日志「⚠️ XX 的气场压制着你，无法逃脱！（本回合行动保留）」→ `battleBusy` **立即释放**、**不调度敌方行动**、等待后玩家 HP **零变化**，可马上改出 攻击/技能/防御/蓄力 等指令；指令栏 `[4]逃跑⛔` 叠标与「Boss无法逃跑」提示完全不变。
- 【零波及】仅改 `js/battle.js` 的 `doFlee()` Boss 分支一处（删 `afterPlayer()`，改同步释放回合 + 返回 true 跳过重复绘制）；**普通怪/精英「石心魔像」60% 逃跑成功率与失败扣回合逻辑完全不变**，未动任何怪物属性 / 掉落 / 经验金币 / 难度缩放 / 升级曲线。
- 验证：`node --check js/battle.js` 与 `npm run check`（23 模块）全部通过；`npm test` **35/35**；新增 v5.8 专项冒烟（/tmp/jrpg_smoke_v580_fleerelease.mjs）**33 项断言全过**——四类 Boss 各 7 项（开场可行动 / 仍处战斗 / 日志文案 / battleBusy 释放 / battleQ 无调度 / 等待 800ms HP 零变化 / 被压制后立即再行动）、普通怪逃跑 30 次采样 17 次成功（≈60% 判定回归）、逃跑失败仍扣回合、精英不入压制分支、Boss/普通怪两档战斗渲染无异常。README 第 35 行与帮助页「Boss无法逃跑」描述即恢复后的行为，无需改动。

## v5.7 二段变身线精确血量阈值（体验打磨·信息透明）
- 【知道会「变身回血」，却不知道还剩多少血触发 → 一眼看清斩杀/压血时机】三个 Boss（幽冥魔王/洞窟领主/终焉之神·祸乱形态）血量过半会现出真身并回血 10~15%、攻防暴涨——但变身线上只有一句「二段变身线」，玩家只能靠体感「血条过一半」去赌触发点。现在变身线标签补上**精确阈值**：`二段变身线 · HP<70`——一眼知道要压到剩 70 血前抢输出、还是留大招等变身。
- 【与结算逐字同源】数值即 `battle.enemyAct` 的变身判定 `hp < hpMax×(phase.at||0.5)` 取 `Math.ceil`，与困难模式 ×1.35 后的 hpMax 实时联动（困难幽冥魔王显示 `HP<95`）；变身（`phased`）后标签自动消失、只剩暗色细线，与既有行为一致。
- 【纯显示零风险】仅改 `js/view/drawBattle.js` 的 `drawBattle()` 一处（+7 行，替换原「二段变身线」字符串）；**未动变身判定/回血/重命名/攻防加成/任何结算逻辑**，位置仍紧贴血条中线（x≈326~390），不与 v5.4 精确 HP 读数（x≥438）重叠；普通怪/试炼 Boss/技能菜单开合各分支不叠加、不抛错。
- 验证：`node --check` 与 `npm run check`（23 模块）全部通过；`npm test` **35/35**；新增 v5.7 专项冒烟（/tmp/jrpg_smoke_v570_phasehp.mjs）**14 项断言全过**——幽冥魔王 HP<70 / 洞窟领主 HP<55 / 终焉之神 HP<130 逐字正确、困难模式联动 HP<95、变身(phased)后标签消失、普通怪无标签、15 次重绘 hp/hpMax/phased/name/blog 零改动（纯显示收敛）、v5.4 精确 HP 读数共存、HP=129 触发变身判定而 HP=130 不触发（阈界核对）。README 战斗说明已同步。

## v5.6 商店药水持有量标注与购买上限提示（体验打磨·信息透明）
- 【买药总怕重蹈覆辙】商店药水项此前只写价格与恢复量，自己背包里还有几瓶全靠记性；买满 99 上限时被拒也只得到笼统的「金币不足或已满」，分不清是没钱还是没地方装。现在药水行末尾常驻**持有量标注**：`🍖 生命药水 ×1（恢复 50%HP +8）[现有N/99]`——与蘑菇行 `[现N]` 同一套「信息透明」模式，一眼知道还差几瓶到上限、值不值得再囤。
- 【上限反馈分叉】购买被拒时文案拆成两种：背包满 → `🎒 背包已满（药水上限 99 瓶），先去用掉一些吧！`；金币不足 → `金币不足`——不再混为一谈。
- 【零行为风险】仅改 `js/shop.js` 一处（`buildShopList` 药水行字符串 + `buyPotion` 判定拆分），未动药水价格/恢复量/上限数值、未动商店布局与键位；`drawShop` 直接渲染 `it.t`，标注即自动上屏。
- 验证：`node --check js/shop.js` 与 `npm run check`（23 模块）全部通过；`npm test` **35/35**；新增 v5.6 专项冒烟 10 项断言全过（3 瓶/[现有3/99] 标注、恢复量文保留、价格不变、满 99 拒购且不扣金币、背包上限文案、金币不足不消费、正常购买扣 15 金 +1 瓶、0 持有量标注回归）。

## v5.5 快速旅行「当前所在地」标注（体验打磨·信息透明）
- 【一开面板就知道自己站在哪】快速旅行（`T`）此前只显示三个目的地与推荐等级，当前所在地没有任何指示——传送到星井矿脉后想回镇补给，得靠「选中行 ▶ 默认停在当前地图」这一隐性规则猜自己在哪。现在**当前所在地行的地图名右侧常驻绿色 `📍`**（如 `星井矿脉 📍`），一眼确认「我在这、别传错」，传送前不再需要横向对照地图名。
- 【与真实位置全同源】标记读取 `S.curMap` 与 `TRAVEL_LIST` 的 key 逐字比对，随传送/读档/开面板实时刷新，绝无第二套说法；未探索行仍保持「？？？ · 未探索」灰色占位且**不带 📍**（神秘感与「信息透明」并存：只标当前，不剧透未探索地）。
- 【纯显示零风险】仅改 `js/view/menus.js` 的 `drawTravel()` 一处（+2 行，名字串追加 `📍`）；**未动任何传送判定、`visited`/解锁逻辑、`doTravel`、推荐等级提示行、描述行、↑↓/Enter/Esc 键位或数值**；选中 ▶ 高亮、推荐等级（右缘琥珀小字）、描述行全部保持原样。
- 验证：`node --check js/view/menus.js` 与 `npm run check`（23 模块）全部通过；`npm test` **35/35**；新增 v5.5 专项冒烟（/tmp/jrpg_smoke_v550_travelmark.mjs）**19 项断言全过**——潮灯镇/雾语林/星井矿脉三种「当前地」逐一验证仅当前行带 📍、非当前行不带、推荐等级 hint 与描述行在位、仅解锁村庄时未探索行不带 📍、连续 5 次绘制 scene/level/gold/hp/xp/curMap/travelSel 零改动（纯显示收敛）、drawTravel 不改 G 引用；v5.4/v5.1 邻近专项冒烟保持通过（注：/tmp/jrpg_smoke_esm.mjs 为 v2.0 时代基线，断言 `S=globalThis`，与 v4.0 起「导出 S 对象」架构不兼容，属改动前即存在的历史遗留，与本次改动无关；维护中的全量冒烟为 `npm test`）。

## v5.4 战斗画面敌方精确 HP 数值（体验打磨·信息透明）
- 【血条在手心里，数值却在心里】战斗画面上方此前只有一段敌方血条——没人告诉玩家这怪到底还剩多少 HP，Boss 的 260 血与厚血精英全靠体感。现在**血条右侧常驻精确数值** `hp/hpMax`（如 `130/260`），与血条同色同步变化（>50% 绿 / >20% 黄 / 残血红），一眼看清斩杀线。
- 【纯显示零风险】仅改 `js/view/drawBattle.js` 的 `drawBattle()` 一处（+2 行）；**未动任何伤害/血条/结算逻辑**。数值直接取 `enemy.hp/enemy.hpMax`（`Math.max(0,…)` 钳制，击败瞬间不显示负数）；坐标 `ex0+118` 位于血条右侧空隙，不与敌方名/二段变身线/预判行/状态角标列重叠。
- 验证：`node --check` 与 `npm run check`（22 模块）全部通过；`npm test` **35/35**；新增 v5.4 专项冒烟（/tmp/jrpg_smoke_v540_enemyhp.mjs）**7 项断言全过**——普通怪半血/真 Boss 半血/满血/HP=0 钳制/试炼 Boss 各档数值与 `hp/hpMax` 逐字一致、15 次重绘零漂移（纯显示收敛）、真 Boss 绘制不抛错。

## v5.3 防御后伤害预判数值化（体验打磨·信息透明）
- 【「按防能挡多少」终于可以看一眼】战斗画面底部的敌方攻击预判行此前只写`·防御可减半`——知道现在会掉多少血，却不知道按了 `[5]防御` 之后到底受多少。现在预判行补上**防御后的精确伤害**：`敌方攻击预判：-20血（防御后-10血）  我方HP x/y`；已在防御中（敌方行动待发）则直接显示 `格挡中 · 本回合只受 -10血`。
- 【与结算逐字同源】数值与 `battle.js` 的 `enemyAct` 完全同源：受击 = `max(1, cmdDmg(atk, defMax, 1))`，防御中 = 再 `×0.5` 取整（同一公式、同一取整）；⚠️ 致命判断也随防御态切换——非防御看原伤害、防御中看格挡后伤害，不再误报致命。
- 【纯显示零风险】仅改 `js/view/drawBattle.js` 的 `drawBattle()` 一处（+5 行）；**未动 `cmdDmg`/防御减伤/敌方行动/任何结算逻辑**；Boss/试炼战仍不显示该行、技能菜单打开时不叠加、无敌人不绘制。
- 验证：`node --check` 与 `npm run check` 全部通过；`npm test` **35/35**；新增 v5.3 专项冒烟（/tmp/jrpg_smoke_v530_guard.mjs）**12 项断言全过**——非防御/防御中双态文案、数值与公式精确一致、致命随防御态切换、Boss 战不绘制、12 次绘制 hp/mp/gold/xp/等级/敌方HP 零改动（纯显示收敛）。README 战斗说明已同步。

## v5.2 战利品预览补齐确定性奖励（体验打磨·信息透明）
- 【标注的奖励和实际到手对不上】战斗画面「战利品预览：经验 +X 金币 +Y」此前只显示基础经验/金币，但胜利结算里**必然**追加的奖励没有体现：精英（石心魔像 / 洞窟领主 / 终焉之神，`winBattle` 中 `isElite` 分支）胜利后必捡 1 株魔法蘑菇；终焉之神（`isTrue`）在基础金币之外还另有 +300 金币。玩家只能凭图鉴备注或吃一堑长一智，预览行在前误导。
- 【与结算同源补全】预览行现在按敌人旗标追加：精英 → `· 🍄 必掉蘑菇`；终焉之神 → `· 战胜另+300金`。数值不硬编码，全部沿用敌人对象既有字段（isElite / isTrue），与 `winBattle` 判定逐字同源。
- 【纯显示零风险】仅改 `js/view/drawBattle.js` 的 `drawBattle()` 战利品预览一行（+2 行逻辑）；**未动掉落/经验/金币/胜利结算任何逻辑**，普通怪不带注记、试炼战（isRush 无 isElite）不受影响、技能菜单覆盖层不叠加。
- 验证：`node --check` 通过；`npm test` **35/35**；v5.1 冻结专项 **8/8**；v4.4/v4.6 战斗绘制专项 **15/15、13/13**；新增 v5.2 专项冒烟（/tmp/jrpg_smoke_v520_rewards.mjs）**15 项断言全过**——普通怪无注记 / 精英必掉蘑菇 / 洞窟领主必掉蘑菇 / 终焉之神蘑菇+另300金 / 12 次重绘 hp·mp·gold·xp·level·蘑菇·敌方HP·日志零改动（纯显示收敛）/ `startBattle→drawBattle` 真实路径回归。

## v5.1 敌方冻结状态角标（体验打磨·信息透明）
- 【冻没冻住只能等敌方行动看记录 → 一眼即知】冰霜击触发冻结后 `enemy.skipNext=true`，但战斗画面此前没有任何常驻指示，玩家只能等敌方行动时从战斗记录里确认。现在敌方状态角标列（右上方石甲/灼烧同列）新增 `❄️ 冻结 · 下回合无法行动`，紧接灼烧下行（y=144），下回合敌方行动被跳过时自动消失（`skipNext` 复位）。
- 【纯显示零风险】仅改 `js/view/drawBattle.js` 的 `drawBattle()` 一处（新增 2 行）；**未动冻结判定/伤害/敌方行动/任何结算逻辑**（skipNext 仍由敌方行动回合消耗）。无冻结时不绘制、技能菜单覆盖层不叠加、HP/MP/经验/金币/回合各读值不动。
- 验证：`npm run check` 全部通过；`npm test` **35/35**；v5.1 专项冒烟 8 项断言全过（未冻结不绘制 / skipNext 置位后绘制 / 右对齐同列 x=620 / 居于灼烧下行不重叠 / skipNext 复位后消失 / Boss·洞窟领主·终焉之神·精英冻结绘制无异常 / 技能菜单打开叠加无异常 / 冰霜击冻结数据回归）。

## v5.0 潮灯记（剧情重写）
- 【全新世界观】不再是「被选中的勇者去讨伐魔王」。潮灯镇靠记忆之灯活着；灯灭、雾起、昨天开始消失。你是守灯人，要去雾语林讨回被【幽冥魔王】吞走的灯芯——而他其实是把黎明封进圣光之剑的旧灯卫。星井矿脉的洞窟领主守着最后一车星砂；终焉之神是初灯的意志，想熄灭一切记忆以免再失去。击败魔王后是半亮的黎明；击败终焉之神后进入真结局。
- 【文案覆盖】地图更名为潮灯镇 / 雾语林 / 星井矿脉；NPC 为灯长 / 镇民 / 巡灯人 / 井巫 / 雾径猎手 / 星砂车夫；姓名 余烬 / 灯见 / 潮。Boss 内部名、掉落、旗标、存档 schema、地图 ASCII **未改**（幽冥魔王 / 洞窟领主 / 终焉之神 / 圣光之剑）。
- 范围：`data.js` 剧情与任务对白、`world.js`/`battle.js`/`core.js`/`shop.js` 提示、`view/menus.js` 标题与双结局、`index.html`。顺手让尾声画面在渲染循环里常驻（`SCREENS.ending = drawEnding`），真 Boss 胜利直接进入真结局。
- 验证：`npm run check`；`npm test`。

## v4.8 任务日志（系统·信息透明）
- 【定义与显示脱节】`data.js` 里已有 `QUESTS`，但横幅/村长对话/奖励仍各写一套文案。现在日志、左上角横幅、村长/矿车夫对白与发奖**全部从 `QUESTS` 推导**：阶段 `offer/active/turnin/done/locked`，采集进度 `n/3` 与奖励公式同源。
- 【`J` 任务日志】世界地图按 **J** 打开一览：主线（魔王→洞窟领主；双胜后显形终焉之神）与支线（村长委托、矿车之约）分列，标注可接/进行中/可交付/已完成/未解锁，进行中附地点。未接村长委托开局即显示「可接」，不用猜该找谁。横幅可同时列出多条支线（不再只显示第一条）。发奖数值未改（村长 40+Lv×10 金 +2 药水，矿车夫 +80 金）。
- 范围：`quests.js`（journal / `npcQuestPages` / `applyQuestReward`）、`data.js`（QUESTS 补 name/where/talk/reward）、`core.js` 对话走表、`view/menus.js` 的 `drawJournal`、`main.js` 按键、横幅；**未动地图/战斗/掉落/存档 schema**（仍兼容 `G.quest` 迁移）。
- 验证：`npm run check`；`npm test`。

## v4.9 世界 HUD 昼夜时段标签（体验打磨·信息透明）
- 【时间在走却无处可看】游戏内置实时昼夜系统（`render()` 每帧累加 `S.G.time`，`drawWorld` 随昼/昏/夜/黎明四档换色）——但探索时只能靠画面明暗「体感」，没有任何文字读数。现在 HUD 左上角地图名旁常驻**昼夜标签**：`勇者 · 和平村 · ☀️ 白天 / 🌆 黄昏 / 🌙 夜晚 / 🌅 黎明`，每 90 秒一档、实时刷新，与画面着色**同源同判**（直接复用 `drawWorld.js` 导出的 `timeOfDay()`），状态画面里已有的 ⏱️ 时钟可在同一时刻对照验证。
- 【纯显示零风险】仅改 `js/view/hud.js` 的 `renderHUD()` 一处（新增 4 行 + 一个 import；`hud→drawWorld` 为向下单向依赖，不构成环）；**未动时间推进、着色 tint、移动/遇敌/战斗/存档任何逻辑**；困难模式 `⚡` 标记与「角色名 · 地图名」既有格式原样保留，时段段仅追加其后。
- 验证：`npm run check`（22 模块 `node --check`）全部通过；`npm test` **30/30**；新增 v4.9 专项冒烟（/tmp/jrpg_smoke_v490_daytag.mjs）**20 项断言全过**——`timeOfDay` 八组边界精确（0/89/90/150/180/230/358/360）、四时段标签全部写入 `s-map`、名字·地图·时段完整格式与困难 ⚡ 保留、`G=null` 雾化不抛错、`startBattle→renderHUD` 战斗路径回归、drawBattle 绘制无异常。

## v4.7 Puny 像素贴图（美术换装·玩法不动）
- 【程序化色块 → Shade「Puny」CC0 像素图】大地图 16×16 图块 2× 到游戏 32px 格：草地/泥土路/石板/水面/树木来自 Puny World，洞窟岩地/岩壁/宝箱/传送门/祭坛宝石来自 Puny Dungeon。主角用蓝衣战士（龙鳞甲或圣光之剑换红衣），六名 NPC 分用法师/工人/士兵/弓手，战斗史莱姆/兽人/哥布林/骷髅等走角色图集 8 向帧；毒蛇/树精仍走原程序化剪影以免撞脸。贴图加载失败（含 Node 冒烟无 `Image`）自动留在原 Canvas 绘制，**地图 ASCII、碰撞、战斗、存档零改动**。
- 【像素对齐】主画布关闭插值；镜头坐标取整，避免平滑跟随时把 16px 格子拉糊。
- 范围：`assets/puny/`（CC0，见 `ATTRIBUTION.txt`）、新增 `js/view/atlas.js`；`tiles.js` 在图集就绪后替换 `TILE` 缓存；`sprites.js` / `drawWorld.js` 角色与 NPC；`canvas.js` 关平滑。
- 验证：`npm run check`（含 atlas.js）；`npm test` **30/30**（Node 无图走退路，绘制不抛错）。

## v4.6 敌方下一击伤害预判（体验打磨·信息透明）
- 【挨一下疼不疼只能猜 → 一眼预判】战斗画面（玩家拟行动回合）底部常驻一行**敌方攻击预判**：`敌方攻击预判：-N血 · 防御可减半   我方HP x/y`——数值与结算公式（`cmdDmg`）**无浮动同源**，当前防御中则标注「防御减半生效中」；若这口气挨下来会倒地，整行变橙并追加 `⚠️致命`。和 `[1]攻击≈N伤` 互为镜像：看得到自己的输出，也看得到对方的下马威，判断该挥剑、防御还是嗑药不再靠猜。
- 【纯显示零风险】仅改 `js/view/drawBattle.js` 的 `drawBattle()` 一处（新增 9 行，坐标 y≈395 无任何既有元素）；**未动 `cmdDmg`/敌方行动/防御减伤/任何伤害结算逻辑**，普通怪/Boss/试炼逐分支验证；Boss 与试炼战该行不显示（仍走「无法逃脱」警示）、技能菜单打开时不叠加、无敌人防御性跳过。
- 验证：`npm run check`（22 模块 `node --check`）全部通过；`npm test` **30/30**；新增 v4.6 专项冒烟（/tmp/jrpg_smoke_v460_entdmg.mjs）**13 项断言全过**——预判数值与 `cmdDmg` 公式精确一致、致命/防御/Boss/技能菜单各分支绘制不抛错、15 次绘制 hp/mp/gold/xp/level/enemyHp 零改动（纯显示收敛）、攻击行动与敌方行动回合推进正常。README 战斗说明已同步。

## v4.5 成就一览界面（新界面·信息透明）
- 【15 项成果却无一面墙】游戏累计有 15 项成就（初露锋芒→矿车之约），但此前只能靠解锁弹窗被动得知——没解锁的成就长什么样、差多少进度，玩家完全看不到，收藏向玩家无从下手。现在世界地图按 **`C`** 打开「— 成就 —」一览面板：**全部 15 项**常驻列出，✔ 已解锁（绿）/ ✘ 未解锁（灰），每项附描述；**8 项计数成就实时显示进度**（累计讨伐 7/10、额外掉落 3/5、等级 4/5、金币 123/500、图鉴收录 2/5 与 3/11 种），一眼看清距解锁还差多少；每页 10 项，↑↓ 滚动浏览，超出页首/页尾自动钳制。
- 【进度与判定同源】`ACH_LIST` 新增可选 `prog(hero)` 函数返回 `cur/max` 字符串，与既有 `ok(hero)` 判定**逐字同源**（同一批 `hero` 字段——totalWins/drops/level/gold/bestiary），解锁判定 `ok` **完全不动**，成就弹窗/奖励/尾声战绩计数（`ACH_LIST.length`）自动随之显示 15。狂热刷级无副作用：数值只读，纯显示收敛。
- 范围：`data.js`（ACH_LIST 加 `prog` + 帮助页加 `C` 行）、`state.js`（`achScroll`）、`view/menus.js`（新增 `drawAch()`）、`view/index.js`（注册 `ach` 场景）、`main.js`（`ach` 场景按键表 + world 按 `C` 进入 + 教程提示）；**未动任何战斗/掉落/经验/金币/存档/任务逻辑**，图鉴 `B`、状态 `I`、操作说明等邻近界面完整不动（回归验证）。
- 验证：`npm run check`（22 模块 `node --check`）全部通过；`npm test` **30/30**；新增 v4.5 专项冒烟（/tmp/jrpg_smoke_v450_ach.mjs）**21 项断言全过**——15 项成就字段齐全、8 项 prog 数值与 hero 精确一致（3/10、123/500、2/5、全收集 11/11）、`ok` 判定回归、新档/半解锁/超界滚动各档绘制不抛错且 scroll 钳制、20 次绘制 hp/gold/xp/level/ach 零改动（纯显示收敛）、goto('ach') 与 C/Esc/↑↓ 键接线、drawCodex/drawStatus 回归。README 按键表与成就说明同步（成就数 14→15 订正）。

## v4.4 战斗指令栏药水恢复量预览（体验打磨·信息透明）
- 【按 `[3]` 前不知恢复多少】药水是战斗中最常救急的手段，但指令栏只显示数量（`🍖×N 🧪×M`），一次恢复多少只能凭记忆或试按。现在战斗画面指令栏（y=424，指令行上方）在有药水时新增一行**恢复量预览**：`[3]恢复：🍖+68HP  🧪+116HP/+24MP`——数值与 `hero.js` 的 `takePotion` 公式**逐字同源**（🍖=50%HP+8，🧪=80%HP+20 与 40%MP），开战前扫一眼就知道这一口能不能续命、该不该换防御/蓄力。
- 【纯显示零风险】仅改 `js/view/drawBattle.js` 的 `drawBattle()` 命令区一处：`battleBusy`（敌人行动回合）不显示、无药水不显示、只有 🍖 时不带 🧪 段；**未动 `takePotion`/战利品/HP/MP/伤害任何结算逻辑**；Boss 战 `[4]逃跑⛔` 标记与指令栏、普通怪「成功率约60%」标注完全不动（回归验证）。
- 验证：`npm run check`（22 模块 `node --check`）全部通过；`npm test` **30/30**；新增 v4.4 专项冒烟（/tmp/jrpg_smoke_v440_potion.mjs）**15 项断言全过**——双药水/仅 🍖/无药水/battleBusy/普通+Boss 战各场景下预览数值与公式精确一致（68、116+24）、Boss ⛔ 与指令栏回归、多次绘制后 hp/mp/gold/xp/等级/敌方HP 零改动（纯显示收敛）。README 战斗说明同步。

## v4.3 技能菜单标注 MP 消耗（体验打磨·信息透明）
- 【MP 是硬约束，成本却只能靠记】技能菜单（战斗 `[2]`）每行已显示伤害期望与效果，但**唯独不显示各技能的 MP 消耗**——玩家的 MP 上限只有 `12+Lv×4`，火焰斩 4 / 冰霜击 5 / 治愈术 5 / 雷鸣 8 / 陨石术 14，开菜单前能不能放得出想放的技能全凭记忆或试按。现在每行技能右侧**常驻一枚独立 MP 标注**（右对齐、独立列，不挤占技能名/伤害预览/效果提示），与 `SKILL_DATA.mp` 完全同源，正好接在「当前 MP：x/y」下方一目了然。
- 【三色可读】颜色即状态：`MP n` **蓝色=当前 MP 够用**、**红色=不够（该行同时置灰 ⛔）**、**灰色=被终焉之神祸乱形态封印**——开菜单瞬间就知道哪些技能放得出、哪个是差 2 点 MP 临门一脚，不必逐行看清 ⛔ 符号。
- 范围：仅 `js/view/drawBattle.js` 的 `drawSkillMenu()` 一处（加一行 `text()` + 注释）；**未动任何 MP/结算/技能/封印/界面布局逻辑**，`[1]攻击` 预览、`当前 MP` 行、技能行坐标（x=170）与行距（36px）保持原样，MP 列锚定 x=474 右对齐，CJK 撑满也不会与左侧文本重叠（面板右界 490）。
- 验证：`npm run check`（22 模块 `node --check`）全部通过；`npm test` **30/30**；新增 v4.3 专项冒烟（/tmp/jrpg_smoke_v430_mpcost.mjs）**11 项断言全过**——MP 充足时 5 行标注全蓝、数值 4/5/5/8/14 与 `SKILL_DATA` 逐一对上、MP=3 时全红、治愈被封印时该行灰其余蓝、`openSkillMenu` 不抛错、绘制前后 hp/mp/gold/xp 零改动（纯显示收敛）、MP 列右对齐锚定且技能行文本不与 MP 列重叠。

## v4.2 遇敌槽可视化读数（体验打磨·信息透明）
- 【一条细到看不见的红条 → 精确遇敌读数】遭遇槽此前只在右上小地图下方一条 6 像素细红条——什么时候会踩出下一场战斗全凭感觉，刷怪/赶路都缺直观参照。现在小地图遇敌槽**常驻百分比读数**（`遇敌 42%`），数值与 `world.js` 的 `S.encGauge` 完全同源（每踩危险格 +10~18，喷泉/道路 -25/-6，满 100 触发遇敌），一眼知道还差几步遇敌。
- 【≥70% 危险鸣警】遭遇槽达到 **70%** 时读数变橙并追加 `⚠️ 危险逼近`，色带橙/红交替闪烁——延续 威胁预警 / 图鉴标注 / 升级提示 同一套「信息透明」体系，赶路去祭坛前能提前判断该不该补药。
- 范围：仅 `js/view/drawWorld.js` 的 `drawMinimap()` 一处（11 行，纯显示）；**未动任何遇敌判定、遭遇槽增长/衰减公式、地图、碰撞、掉落或战斗逻辑**；`encGauge` 为 0 / undefined / 越界（负数、超 100）均钳制安全渲染。
- 验证：`npm run check`（22 模块 `node --check`）全部通过；`npm test` **30/30**；新增 v4.2 专项冒烟（/tmp/jrpg_smoke_v420_encgauge.mjs）**17 项断言全过**——0/42/69/70/100 各档读数与鸣警阈值精确（69% 不鸣警、70% 鸣警）、色带颜色切换、超界钳制到 100%、`-5/260/undefined` 渲染不抛错、dungeon/cave 渲染无异常、40 次绘制零状态改动（纯显示收敛）。README 遇敌槽一句同步。

## v4.1 可读性（格式、命名、数据坐标、绘制去撞名）
- 【格式】系统层与绘制层补上空格/换行，展开拥挤的 `if`；局部 `G`/`e` 改为 `hero`/`enemy`。
- 【战斗】`playerAction` 拆成动作表（`doAttack` / `doSkill` / `doItem` / `doDefend` / `doCharge` / `doFlee`）；回合队列 `kick`/`clearQ` 改为 `advanceQueue`/`cancelBattleQueue`。
- 【数据】NPC/喷泉/祭坛/酿造坐标与洞窟岩地替换从 `loadMap` 硬编码迁入 `MAPS.*.extras` / `replaceTiles` / `treasure`。
- 【绘制】`view/world.js`、`view/battle.js` 改名为 `drawWorld.js`、`drawBattle.js`，避免与逻辑层同名。
- 【注释】`bind.js` 标明各钩子由谁填充；删掉图块里过时的版本史注释。玩法数值未改。
- 验证：`npm run check`；`npm test` **30/30**。

## v4.0 架构与系统升级（improve-plan 落地）
- 【架构】`globalThis` 注册表改为导出对象 `S`；成就 `ok(g)` 显式传参。系统层通过 `bind.js` 晚绑定绘制，`winBattle` 返回结果并由 `world.applyVictoryWorld` 清祭坛/显形宝藏，拆掉 `battle↔world` 环。
- 【架构】商店/旅馆购买迁出绘制层（`shop.js`）；`goto(scene)` + `main.js` 场景按键表。纯计算进 `rules.js`；绘制拆到 `js/view/`（canvas/tiles/sprites/hud/world/battle/menus）。冒烟收回 `tests/smoke.mjs`。删除单文件备份。
- 【任务】`G.quests` 取代单整数（兼容旧 `G.quest`）。横幅主线/支线分行；任务蘑菇集齐前不可卖/酿。击败洞窟领主后可向矿车夫交任务（+80 金）。
- 【技能】火灼烧 / 冰冻结 / 雷穿防 / 陨石碎甲与克真身 / 治愈解毒。敌人 `weak`/`resist` 进图鉴。蓄力对下一次攻击或技能 ×1.5。
- 【战斗】回合队列；敌人行为表（洞窟领主有二阶段石甲；终焉之神祸乱形态封印治愈）。遭遇槽 0–100 替代危险格 16% 随机。
- 【美术】战斗复用换装 `drawHero`；格子移动 180ms 插值；战斗背景随地图；NPC 外形特征；水/喷泉/洞窟晶尘动画；昼夜绑 `G.time`。
- 验证：`node --check` 全部模块通过；`node tests/smoke.mjs` **28/28 通过**（S 对象、任务迁移、技能字段、洞窟真实胜利流、治疗解毒、绘制不抛错、存档 quests）。

## v3.40 技能伤害预览不再跳变（体验修复·信息透明）
- 【修复】战斗中按 `[2]技能` 打开技能菜单后，攻击技的伤害预览数字**每帧乱跳**（如火焰斩一会 72 一会 65 一会 79）。原因：`drawSkillMenu()` 的预览用 `cmdDmg(G.atkMax, enemy.def, 1, true)` 计算——`alt=true` 分支会掷一次 `Math.random()` 施加 ±10% 浮动，而技能菜单由 30fps 渲染循环逐帧重绘，等于**每帧掷一次骰子画一次数字**。
- 【修复】技能预览改用**期望值口径**（`alt=false`，无随机浮动，与 `[1]攻击` 指令栏的 `atkEstimate` 同一“只显示期望不吃随机”的哲学），逐帧恒定；真实战斗结算路径（`attackMove` 的 `alt=true`）完全不动，出手伤害依旧保留 ±10% 浮动与暴击——预览稳定、打出去照旧带随机，两者互不干扰。
- 【回归保护】治疗技预览（`+N HP`）与 `[1]攻击` 预览本就恒定，未受影响；纯显示改动不碰 MP/HP/伤害结算/蓄力/暴击。
- 改动范围：仅 `ui.js` 的 `drawSkillMenu()` 一处（`alt:true → false` + 注释更新）；未动 `cmdDmg` 函数本体（战斗结算随机路径保留）、`atkEstimate`、任何数值/敌人/技能/结算逻辑。
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）**全部通过**；新增 v3.40 专项冒烟（/tmp/jrpg_smoke_v340_skillprev.mjs）**14 项断言全过**——逐帧抓取 `fillText` 跑 300 帧，火焰斩/冰霜击/雷鸣/陨石术四个攻击技预览**各恒定唯一值**（72/94/115/151 伤，攻23×2-防10×各自倍率，与无浮动期望公式逐一对上）、治愈术预览恒定 48HP、`[1]攻击` 预览恒定 36、300 帧重绘后 hp/mp/gold/敌人 hp 全部不变（纯显示）；v3.1 攻击预览 / v3.39 转向 / v3.29 面前提示 三个邻近专项冒烟全部保持通过。

## v3.39 被挡也能转身（体验修复·交互卡死）
- 【修复】主角朝一个方向按方向键，若目标格是不可走入的 SOLID（NPC、酿造锅、岩石、树、洞窟岩壁…），原 `move()` 会**在更新 `dir` 之前就 `return`**——而 `interact()`（交互）与 `faceHint()`（面前提示）全都按 `dir` 取「面前格」。于是只要迎面被挡住（NPC 本体就是 SOLID 图块），玩家就永远转不过身、无法面向它，**对话/酿造/商店等一切“面对面”交互全部卡死**（典型场景：从侧面走近 NPC 后方向键对着 NPC 按，被挡 → 不转身 → 永远对不上话）。
- 【修复】`move()` 改为**先按按键方向更新 `dir`，再判越界/阻挡**：被挡/贴墙/贴地图边缘时只转身、不位移、不发声、不触发 `onStep`（不会误踩传送门/宝箱/遇敌），转身效果由既有主循环（30fps `render`→`drawWorld`→`drawHero`/`faceHint`）自然呈现。经典 JRPG「贴墙转身」手感 + 信息透明（转身即出「⏎ 对话」提示）。
- 【回归保护】正常行走不受影响；原地转身不改变 `G.x/G.y`、不改任何数值、不进任何场景。
- 改动范围：仅 `world.js` 的 `move()` 一处（4 行语义调整：`dir` 赋值上移，去掉成功后重复赋值）；未动 `SOLID`/`interact`/`faceHint`/`onStep`/任何地图/遇敌/战斗/存档逻辑。
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）**全部通过**；新增 v3.39 专项冒烟（/tmp/jrpg_smoke_v339_turn.mjs）**16 项断言全过**——被村长挡住转身+不位移+纯转身无副作用+转身后 interact 进对话（修复前卡死）、被酿造锅挡住转身+interact 进酿造、贴墙转身、地图边界越界仍转身、正常行走不受影响、面向 NPC 状态 drawWorld 渲染无异常、dir 恒为合法枚举；v3.29 面前提示 / v3.37 矿车夫 / v3.24 隐者 / v3.33 老猎人 四个邻近专项冒烟全部保持通过。

## v3.38 面向 NPC 提示牌并入名字（体验打磨·信息透明）
- 【认出与谁对话】村庄三名 NPC（村长/村民/冒险者）与洞窟/森林的 隐者/老猎人/矿车夫 图块造型完全相同——地图上只有一模一样的脸，谁是村长、谁发支线，新玩家只能挨个凑上去对话才认得出。现在面向任一 NPC 时，v3.29 的上下文提示牌直接标出名字：`⏎ 对话 · 村长 / 村民 / 冒险者 / 隐者 / 老猎人 / 矿车夫`，一眼认出「该找谁领支线、该跟谁打听情报」。
- 【与数据同源·零新机制】名字来自既有 `NPC_SPOTS[坐标]→id` 再查 `NPCS[id].name`（与 `interact()` 打开对话的解析完全同一来源），`NPC_SPOTS` 查不到 id 的孤立 NPC 图块自动回退为原「⏎ 对话」，绝不抛错。复用 v3.29 既有提示牌绘制管线（pill 宽度随文本自适应居中，不遮主角/不遮对象），未新增任何界面/按键/状态。
- 改动范围：仅 `ui.js` 两处——import 增补 `NPC_SPOTS`（data.js 早已导出）+ `faceHint()` NPC 分支一行；未动任何对话内容、NPC 位置、碰撞、交互判定、掉落、经验/金币、数值曲线或剧情。README「面向可交互对象上下文提示」一行同步。
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）**全部通过**；v3.29 提示专项冒烟同步扩展为六名 NPC 名字断言（村长/村民/冒险者/老猎人/隐者/矿车夫）**全部通过**；邻近 NPC 相关专项冒烟 v3.33 老猎人 / v3.37 矿车夫 / v3.36 宝藏矿车 / v3.35 槽位 / v3.24 隐者 / v3.34 洞窟胜利 / v3.31 小地图 **全部保持通过**。

## v3.37 宝藏洞窟「矿车夫」NPC（新 NPC·兑现矿车传说的最后一环）
- 【矿车有主了】v3.36 兑现了击败洞窟领主后矿车宝藏当场显形，但**整座洞窟没有任何人提过这车宝藏**——它是怎么来的、该去哪开，全靠玩家翻胜利台词。现在矿车区正上方（18,11）常驻一位 **矿车夫**：第一页交代设定——「这洞从前是座大铁矿，一车车矿石往洞外拉；后来洞窟领主霸占了矿脉，那年没运走的一车金银财宝，也被碎石埋在了矿车边上」，第二页直接点破玩法——「你若能击败那位洞窟领主，碎石坍落，那车宝藏便会在祭坛左边显形——铁打的买卖。打完别急着走，记得回头把那几箱开了」，与 v3.36 真实机制（MB 祭坛 x20-23 左侧 x18-19 宝藏格）逐字同源——玩家在打洞窟领主之前就知道该去哪收货，矿车传说自此闭环。
- 【角色即图块·零新机制】与 隐者/老猎人 完全同模式：复用既有 NPC 精灵与 SOLID 碰撞（不可走入），复用 `NPC_SPOTS`/`openTalk`/`talkNext` 既有对话管线（2 页，翻完自动回 world），面向时自动获得 v3.29「⏎ 对话」上下文提示——零新增界面/按键/状态。
- 改动范围：`data.js`（`NPCS.cartman` 两页对白 + `NPC_SPOTS['18,11']:'cartman'` 一行）、`world.js`（`loadMap('cave')` 布署矿车夫图块一行）；均在图块布置层，**未动任何地形布局、MB 祭坛、试炼碑、终焉水晶、传送门、宝箱、遇敌判定、掉落、经验/金币、难度缩放或战斗逻辑**——村庄三名 NPC、隐者、老猎人完全不受影响。
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）**全部通过**；新增 v3.37 专项冒烟（/tmp/jrpg_smoke_v337_cartman.mjs）**29 项断言全过**（见该文件头部说明）；邻近 v3.33 老猎人 / v3.24 隐者 / v3.36 宝藏矿车 / v3.31 小地图专项冒烟全部保持通过（注：v3.21 drawStatus 4 例与两个 v1.x 遗留损坏冒烟为改动前即存在的历史遗留，与本次改动无关）。README「三张地图·宝藏洞窟」一行同步。

## v3.36 宝藏矿车兑现（新内容·兑现 v1.x 胜利台词）
- 【兑现自 v1.x 的空头支票】击败洞窟领主时的台词「深处的宝藏矿车向你敞开！」说了很久，但矿车区（洞窟 MB 祭坛 x20-23×y12-13，8 格）被清空成岩地后**什么都没有**——玩家打完迷你 Boss 只得到一句空话。现在矿车区正左方紧邻的 2×2 矿脉格（x18-19×y12-13）在击败洞窟领主的**一瞬间当场显形为可踩踏开启的宝藏宝箱**（普通宝箱奖励：约45%金币 12+Lv×5 / 其余生命药水），胜利台词变为「🏆 洞窟领主被击败！左边的宝藏宝箱缓缓显形了，快去开启！」——名副其实的「宝藏矿车」。
- 【旗标驱动·纯增量】显形完全由 `G.caveBoss` 旗标门控：击败前这 4 格就是普通岩地（踩踏不触发宝箱、正常遇敌判定不受影响）；击败后 `winBattle` 当场调用 `revealCaveTreasure()` 落进 `maze`，此后重进洞窟由 `loadMap` 按旗标再次显形，已开启的照常归入 `G.chests`（绘制回退岩地），不会重复给奖、不会随读档/切图丢失。**未动任何 MB/首领/掉落/经验金币/遇敌/难度/存档逻辑**——洞窟领主打倒后祭坛回退洞窟岩地 TY.CAVE（v3.34 契约）完全不变。
- 【小地图金光扩展】既有「支线蘑菇宝箱未开启金光脉动」的机制从 `G.quest===1` 扩展为 `(G.quest===1||G.caveBoss)`：击败洞窟领主后洞窟里未开启的宝箱（含新显形的 2×2 宝藏）在小地图上金光脉动、一眼找到刚现形的宝藏，开完即熄——同一套信息透明体系。
- 改动范围：`world.js`（新增 `CAVE_TREASURE` 常量 + `revealCaveTreasure()` 并导出、`loadMap` 末尾按旗标调用一行）、`battle.js`（`winBattle` 的 isCaveBoss 分支加一行 `revealCaveTreasure()` + 台词微调）、`ui.js`（`drawMinimap` 金光条件一行）；README「三张地图·宝藏洞窟」一行同步。不新增/改名文件、不改启动方式。
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）**全部通过**；新增 v3.36 专项冒烟（/tmp/jrpg_smoke_v336_treasure.mjs）**28 项断言全过**——击败前 4 格为 CAVE 不显形/踩踏不入 chests/不触发意外战斗、真实胜利流不抛异常且 caveBoss 置位/金币结算照常、击败瞬间 4 格显形为 CHEST、MB 8 格全清除并回退 CAVE（v3.34 契约保持）、踩踏开启入 G.chests 且奖励入账（药水/金币两分支均验）、重复踩踏不重复给奖、重进洞窟再显形且已开保持、caveBoss=0/1 两态 drawWorld 渲染无异常、小地图金光随未开宝箱精确增减（开满 4 箱金光恰减 4 格）、revealCaveTreasure 无旗标时 no-op；v3.34 洞窟胜利 / v3.33 老猎人 / v3.31 小地图 / v3.24 隐者 / v3.20 进度 / v3.35 槽位 全部邻近专项冒烟保持通过，全量 37 份套件中仅 v3.21 的 4 例 drawStatus 与两个 v1.x 遗留损坏冒烟失败（均为改动前即存在的历史遗留，已在原始代码上复现核验，与本次改动无关）。

## v3.35 HUD 常驻存档槽指示（体验打磨·信息透明）
- 【未存先见】Esc 存档前看不到当前槽位——标题页按 1/2/3 选完槽后，游戏中 Esc 会直接覆盖**当前槽**，但界面上没有任何常驻指示，只能靠存档瞬间那条 1.8 秒的「已存档到槽 N」提示确认，误按 Esc 可能把别的档盖掉。现在 HUD 右侧常驻一枚 **💾槽N** 指示（与 `curSaveSlot` 完全同源：标题选槽 2 进游戏即显示槽 2，存完不消失），存档前一眼看清会写进哪个槽；元素带悬停说明「按 Esc 保存到的槽位」。
- 【纯 HUD 显示层】`index.html` 页面壳新增一个 `<b id="s-slot">` 元素 + `js/ui.js` 的 `renderHUD` 写入一行；**未动任何存档/槽位/读档/标题逻辑**，`saveGame`/`load`/标题 1·2·3 行为零变化。
- 改动范围：仅 `index.html`（HUD 第二行一处）+ `js/ui.js`（`renderHUD` 一行）；README「系统」一行同步。
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）**全部通过**；新增 v3.35 专项冒烟（/tmp/jrpg_smoke_v335_slot.mjs）**20 项断言全过**——index.html/ui.js 静态契约在位、默认槽 1 / 切槽 2·3 / 可逆切换均正确写入 s-slot、saveGame 落槽与 HUD 指示同源一致、连续 renderHUD 不改 hp/gold/xp/scene（纯显示收敛）、drawWorld/drawBattle/drawTitle/drawStatus 渲染无异常、其余 HUD 字段（地图/金币/武器/蘑菇）写入无回归；邻近 v3.34 洞窟胜利 / v3.33 老猎人 / v3.32 战败 / v3.31 小地图 四份专项冒烟全部保持通过。

## v3.34 修复：洞窟领主/终焉之神胜利流 ReferenceError（关键 BUG 修复）
- 【Bug】`winBattle` 击败**洞窟领主**/**终焉之神**时引用了 `TY.MB`/`TY.SB`/`TY.GRASS`，但 `battle.js` 的 import 列表在 **v3.0 ESM 拆分时漏掉了 `TY`**（单文件版里 `TY` 在同一作用域没问题），而 `state.js` 全局注册表也只托管可变单例、不注册 `TY` —— 真实游戏流中**击败洞窟领主的一瞬间直接抛 `ReferenceError: TY is not defined`**，`winBattle` 中断、`scene` 卡在 battle、`battleBusy` 永远为 true，玩家只能刷新重来。此前所有冒烟测试（含 v3.11 祭坛清理专项）都是手动置 `G.caveBoss/trueBoss` 旗标后检查绘制，从未走过真实胜利流，所以这个会让两大主线 Boss 战无法通关的崩溃一直潜伏。
- 【修复】`battle.js` 的 `winBattle` 两处：① import 显式补入 `TY`（`from "./data.js"`）；② 祭坛/水晶回退图块由 `TY.GRASS` 改为 **`TY.CAVE`**——洞窟主题化（GRASS→CAVE）只在 `loadMap` 时发生，击败后直接写 GRASS 会在岩地洞窟里留下一片草绿（与 v3.11「回退为洞窟岩地」的记录、`drawWorld`/`drawMinimap` 的旗标覆盖绘制 `TILE[TY.CAVE]` 口径不一致）；改为 CAVE 后真实胜利流与显示层完全对齐。
- 行为收敛验证：击败洞窟领主后 8 格 MB 全部清除、回退为 CAVE；击败终焉之神后 SB 清除回退 CAVE；`caveBoss/trueBoss`/讨伐数/金币/额外+300 等结算全部照常；`winBattle` 战后 1.4s 正常返回 world。**未动任何遇敌、掉落、经验、难度、存档、地图布局或其它战斗逻辑**——纯修复，普通怪/主线魔王胜利流不受影响。
- 改动范围：仅 `js/battle.js` 两处（import 一行 + `winBattle` 两分支的图块常量）；README 已按 v3.11「回退为洞窟岩地」描述，无需改动。
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）**全部通过**；新增 v3.34 专项冒烟（/tmp/jrpg_smoke_v334_cavewin.mjs）**20 项断言全过**——data.TY 导出在位、battle.js import 源码在位、真实击败洞窟领主不抛异常且 caveBoss 置位/讨伐数+1/金币+200、8 格 MB 全清除并回退 CAVE（无 GRASS 残留）、战后洞窟 drawWorld 渲染无异常、真实击败终焉之神不抛异常且 trueBoss 置位/金币含额外+300、SB 清除回退 CAVE、普通怪与主线魔王胜利流不受影响；v3.11 祭坛清理 / v3.10 升级 / v3.18 祭坛标签 / v3.24 隐者 / v3.33 老猎人 / v3.25 精英门槛 / v3.26 开局平衡 / v3.15 试炼进度 八份邻近专项冒烟全部保持通过。

## v3.33 幽暗森林「老猎人」NPC（新 NPC·引导信息透明）
- 【兑现 README 地图指南】幽暗森林此前是**唯一没有 NPC 的地图**——玩家在此遭遇最密集的遇敌（毒蛇施毒 + Lv3 起精英石心魔像），却只能靠试错（帮助第 1 页、图鉴）才摸清。现营地泉水旁常驻一位**老猎人**：第一页指点泉水（「喝一口便精神焕发」）并劝「歇够脚再往深处走，别硬撑着闯」，第二页直接点破森林两大威胁——「草丛里的毒蛇牙上带毒，被咬伤就要一路失血」「森林腹地还有尊石心魔像，皮糙肉厚、还会凝石甲护体。备好药水！」，与 `battle.js` 真实机制（毒蛇 poison 0.35 / 3 回合、精英石心魔像 35% 凝石甲至多 3 层 -40%）完全同源；位置选在营地泉水（14,8）正左一格 (13,8) 的安全空地（非遇敌地块，dangerAt=false），玩家循主线必经之路上顺路可见。
- 【角色即图块】与隐者同模式：复用既有 NPC 精灵与 SOLID 碰撞（不可走入、面对面 Enter 对话），复用 `NPC_SPOTS`/`openTalk`/`talkNext` 既有对话管线，面向时自动获得 v3.29「⏎ 对话」上下文提示——零新增界面/按键/状态。
- 改动范围：`data.js`（`NPCS.hunter` 两页对白 + `NPC_SPOTS['13,8']:'hunter'` 一行）、`world.js`（`loadMap('dungeon')` 布署老猎人图块一行）；均在图块布置层，**未动任何地形布局、传送门、营地泉水、宝箱、祭坛、遇敌判定、掉落、经验/金币、难度缩放或战斗逻辑**——纯增量内容，村庄三名 NPC 与洞窟隐者完全不受影响。
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）**全部通过**；新增 v3.33 专项冒烟（/tmp/jrpg_smoke_v333_hunter.mjs）**23 项断言全过**——数据层 hunter 与两页对白在位（第二页点名毒蛇+石心魔像）、NPC_SPOTS 预设 `13,8→hunter`、村庄/洞窟原预设不受影响、森林 (13,8) 已布置 NPC 图块且泉水(14,8)/出口(1,1)/魔王祭坛(20,13)(20,14)/洞窟入口(18,12) 全部保持、dangerAt(13,8)===false（NPC 不在遇敌地块）、openTalk 进入 talk 与 2 页翻页、翻至末页自动返回 world、猎人图块双向阻挡走位、营地泉水 onStep 照常回满、含猎人帧 drawWorld/drawMinimap 渲染无异常、渲染不改 hp/gold/mp/scene（纯显示收敛）、村庄帧无异常；v3.24 隐者 / v3.29 提示 / v3.31 小地图 / v3.30 图鉴 / v3.32 战败 五份邻近专项冒烟全部保持通过（注：v3.21 drawStatus 4 例与 jrpg_smoke_run 的损坏崩溃均为改动前即存在的历史遗留，已在原始代码上复现核验，与本次改动无关）。README「三张地图」幽暗森林一行同步。

## v3.32 战败复盘（体验打磨·信息透明）
- 【战败不等于白屏】阵亡画面此前只有「R 重开 / T 回标题 / B 重整旗鼓」三个选项——死了一次往往一头雾水：是被谁带走的？当时练到多少级、攒了多少金币？现在**倒地瞬间先复盘**：`败于 {敌人名}`（Boss 二段变身显示当前形态名，如「幽冥魔王·真身」）、`当前 Lv.X · 金币 Y · 累计讨伐 Z 只 · ⏱️游玩时长`，一眼看清这趟冒险的积累与死因。
- 【情境化下一步建议】按死亡性质给出一条针对性提示：**Boss 阵亡**提示「先回旅馆补给并练级，再按 B 重整旗鼓挑战 {Boss 名}」（与 B 重试按钮的 `_bossRetry.bossId!=='rush'` 判定完全同源，试炼连战阵亡不误导）；**普通怪阵亡**提示「回村 旅馆/喷泉 补给，用图鉴(B)查看魔物强度后再战」——把「接下来该干嘛」直接写在死因下面，延续 威胁预警/逃跑成功率/图鉴标注 同一套信息透明体系。
- 【纯显示层】只读 `enemy` 与 `G` 字段（等级/金币/bestiary/time），`enemy` 为空时自动跳过败者行、选项照常显示（容错不闪错）；**未动任何死亡/存档/掉落/结算/判定逻辑**，R/T/B 按键行为零变化。
- 改动范围：仅 `ui.js` 的 `drawDead()` 一处（阵亡画面整体下移 42 像素让出复盘区，全部文本仍在 640×480 画布内）。README「系统清单」一行同步。
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）**全部通过**；新增 v3.32 专项冒烟（/tmp/jrpg_smoke_v332_dead.mjs）**17 项断言全过**——普通怪阵亡（败者行/进度行 Lv5 金币88 讨伐6/时长 01:02:05/回村建议/无 B 按钮）、Boss 阵亡（真身名/带名建议/有 B 按钮）、rush 阵亡（无 B 按钮、普通建议）、连续渲染零状态改动、enemy 为空时容错绘制；邻近 v3.31 小地图 / v3.29 提示牌 / v3.30 图鉴标注 / v3.24 隐者 专项冒烟全部保持通过。

## v3.31 小地图「危险区」红色标注（体验打磨·信息透明）
- 【兑现 README】README「视觉」写有「小地图」，但和平村的**高草丛才是唯一会踩出魔物**的散布式遇敌点（`dangerAt` 仅对 'G' 图块返回 true），小地图却把全村草地图成同一草绿——低血量新手无从分辨哪里安全、哪里会遇敌（遇敌率 16%，残血进草丛就可能白给）。现在小地图上对危险区叠印**红色小点**：和平村的草丛在 minimap 上成片标红、一眼避开；而森林/洞窟几乎全域皆为遇敌区（占比 67%/89%），若同样叠色会淹没整张图、失去信息量，故**危险区占可行走面的少数时才标注**（dn≤walk×50% 才叠涂）。
- 【与真实判定同源】标注读 `dangerAt()`（与 `onStep` 遇敌判定完全同一函数）与 `SOLID`（可行走面统计），村庄 8 格草丛在运行时逐一命中、与地图数据统计一致；红色仅叠加在原有底色之上，不改变任何图块颜色/坐标/比例。**纯显示层**——未动任何遇敌概率、移动、碰撞、掉落、经验/金币、存档或图块逻辑；森林/洞窟小地图渲染照旧（连指针、支线宝箱金光脉动等既有元素完全不受影响）。
- 改动范围：仅 `ui.js` 的 `drawMinimap()` 一处（import 增补 `SOLID` 与 `dangerAt` 两个只读引用，均已在 data.js/world.js 导出）；README「视觉」小地图一行同步。
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）**全部通过**；新增 v3.31 专项冒烟（/tmp/jrpg_smoke_v331_minimap.mjs）**11 项断言全过**——村庄危险区 dn=8/walk=336（2.4%≤50% 应标注）、森林 66.8% / 洞窟 89.2%（>50% 不叠涂）、三张地图 drawMinimap×3 渲染不抛错且 scene/hp/gold/mp/curMap 零变化（纯显示收敛）、drawWorld 含小地图渲染稳定、dangerAt 运行时与地图统计一致、标注分支可正常产生绘图调用；v3.29 上下文提示 / v3.30 图鉴标注 / v3.16 旅行 / v3.13 旅馆 邻近专项冒烟全部保持通过。

## v3.30 敌人图鉴「掉落/特性」标注（体验打磨·信息透明）
- 【兑现 README】README「图鉴 & 成就」早写明「报酬参考（击败可得）」与精英/圣剑掉落，但图鉴行只显示经验/金币——哪些怪有特殊掉落、毒蛇会施毒，全得靠试错。现在**已讨伐行的「击败可得」行尾追加对应标注**：毒蛇 `☠️ 会施毒 · 扣血3回合`、石心魔像 `🍄 必掉魔法蘑菇`、幽冥魔王 `⚔️ 必掉圣光之剑`、洞窟领主 `💠 击败清除祭坛`、终焉之神 `💰 击败+300金`——一眼看清「打它值得/要防什么」。
- 【与真实结算同源】标注来自新增静态表 `CODEX_TAG`（`ui.js`），且逐条与真实逻辑核对：毒蛇 = `MON_BASE` 的 `poison:0.35` 标记（battle.js 命中 35% 中毒 3 回合）；石心魔像 = `winBattle` 的 `isElite` 分支必掉 1 株蘑菇；幽冥魔王 = `isBoss` 分支必掉圣光之剑；洞窟领主 = `isCaveBoss` 分支清除祭坛图块；终焉之神 = `isTrue` 分支额外 +300 金。只读、不参与任何判定，与 `whereFind`/祭坛标签同一套「静态提示」惯例。
- 【不剧透】未讨伐的灰色占位行照旧只显示 `❓ ？？？ · 未讨伐`，五种标注一律不提前显示——延续 图鉴灰色占位 / 旅行「未探索」/ 掉落提示 同一套信息透明原则；普通怪（史莱姆/野狼/树精/石魔像等）无特殊条目，行尾保持原样。
- 改动范围：仅 `ui.js` 的 `drawCodex()` 一处（新增 `CODEX_TAG` 静态表 + 击败可得行追加串）；**未动任何掉落/战斗/结算/经验/金币/存档/遇敌逻辑**——纯显示层增量；README「系统清单」图鉴一行同步。
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）**全部通过**；v3.17 图鉴邻近专项冒烟 **29/29 保持通过**；新增 v3.30 专项冒烟（/tmp/jrpg_smoke_v330_codex.mjs）**12 项断言全过**——毒蛇/石心魔像/幽冥魔王/洞窟领主/第 2 页终焉之神 五种标注逐字在位、普通怪行尾无标注（与原点字符串全等）、未讨伐 9 格灰色占位且不剧透 圣光之剑/+300金/施毒、连续渲染不改 scene/gold/xp/bestiary（纯显示收敛）；v3.29 提示 / v3.16 旅行 / v3.24 隐者 邻近专项冒烟全部保持通过。（注：v3.21 drawStatus 已学满/旧存档两例与本 v3.17 同为历史遗留、与本次改动无关——在原版 ui.js 上同样复现，本次未触碰 drawStatus。）

## v3.29 面向可交互对象·上下文提示（体验打磨·引导信息透明）
- 【引导新手】地图上看到图块却不知道它怎么用，是新手期最大的卡点：商店/旅馆/酿造锅要「面向 + Enter」，宝箱/喷泉/传送门/出口/强敌祭坛/试炼碑则是「踩上去触发」，全靠试错才懂。现在**面向任意可交互对象时，目标图块上方常驻一枚小提示牌**：按 Enter 类显示 `⏎ 对话 / ⏎ 商店 / ⏎ 旅馆 / ⏎ 酿造`，踩踏类显示 `踩上回血 / 踩上开启 / 踩上开战 / 踩上触发 / 踩上挑战 / 踩上通行`——一眼明白该按哪个键、还是直接走上去。
- 【与真实判定同源】提示与 `interact()`/`onStep()` 的真实交互路径一一对应，且按推进旗标自动熄灭：宝箱已开不再提示、魔王已被讨伐时祭坛与村庄传送门都不再显示「踩上开战/踩上通行」（避免误导）、终焉水晶已破不提示、试炼碑仅当双徽记集齐才显示「踩上挑战」——不会出现「提示能触发但实际不能」的说法不一致。
- 【纯显示层】新增 `faceHint()`（`ui.js`）：依 `dir` 取面向格，仅读图块类型与 `G.chests/bossDefeated/caveBoss/trueBoss` 旗标，在 `drawWorld()` 中绘制提示牌；`scene!=='world'` 时（商店/状态等面板把 `drawWorld` 当背景）自动不显示。**未动任何交互、进入判定、开战、宝箱、掉落或数值逻辑**——不含新图块、不占新键位、零外部依赖。
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）**全部通过**；新增 v3.29 专项冒烟（/tmp/jrpg_smoke_v329_hint.mjs）**19 项断言全过**——面向 商店/旅馆/酿造/NPC/宝箱/村庄传送门/喷泉/魔王祭坛/出口/终焉水晶 十类对象分别捕获到对应提示文案（记录型 Canvas 逐字断言）、试炼碑资格前后（无资格不提示 / 有资格提示「踩上挑战」）、魔王讨伐后祭坛与村庄传送门提示熄灭、面向空地与商店背景（非 world）不提示、三张地图带提示渲染无异常、提示绘制不改 hp/gold/mp/scene/curMap/位置（纯显示收敛）；v3.28 逃跑标注 / v3.27 旅行 / v3.24 隐者 / v3.23 日志回看 / v3.22 石甲 / v3.25 精英门槛 六份邻近专项冒烟全部保持通过。

## v3.28 战斗指令栏「逃跑成功率」标注（体验打磨·信息透明）
- 【兑现 README】README「战斗」一栏与帮助页早写明普通怪「约 60% 成功」，但战斗指令栏里只有 Boss 战叠绘红色 ⛔，普通怪/精英的 `[4]逃跑` 右侧从不标注成功率——要不要赌一把逃跑只能靠感觉。现在普通怪/精英的指令栏在 `[4]逃跑` 右侧常驻 `·成功率约60%`（与 `playerAction` 的 flee 分支 `Math.random()<0.6` 完全同源，纯静态展示、不参与判定），与 Boss 战 ⛔ 互补：Boss 看 ⛔、普通怪看成功率，同一套「信息透明」体系一眼分明。
- 【帮助页同步】操作说明第 1 页「战斗」行同步标注 `4逃跑(普通怪·成功率约60%)`（原为省略的成功率），README 战斗一段增补「指令栏实时标注成功率」一句。
- 改动范围：`ui.js` 的 `drawBattle()` 指令栏一行（普通怪分支追加展示串，Boss 分支不加、⛔ 叠绘逻辑不变）、`data.js` 的 `HELP_PAGES` 第 1 页战斗行一处；**未动任何逃跑判定、回合消耗、敌人属性、掉落、经验/金币或难度数值**——逃跑行为与成功率本身零变化，纯显示层。
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）**全部通过**；新增 v3.28 专项冒烟（/tmp/jrpg_smoke_v328_fleerate.mjs）**12 项断言全过**——帮助页战斗行含「成功率约60%」、普通怪（毒蛇/精英石心魔像/史莱姆）战斗指令栏捕获到 `[4]逃跑·成功率约60%` 且无 ⛔、Boss（幽冥魔王/洞窟领主/终焉之神/试炼连战石心魔像）指令栏无成功率标注但叠绘 ⛔、绘制不改 battleTurn/blog/hp/mp/gold（纯显示收敛）、连续渲染 3 次稳定、普通怪栏渲染不抛错；v3.19 逃跑禁标邻近专项冒烟保持通过。

## v3.27 快速旅行目的地推荐等级标注（体验打磨·信息透明）
- 【兑现 README】README「系统清单」早已写明快速旅行「含各目的地推荐等级/特色提示」，但 `TRAVEL_LIST` 一直是 3 元组（key/名称/说明），推荐等级从未真正落地——现在补上：**幽暗森林 `推荐 Lv.3 起 · 当心精英`、宝藏洞窟 `推荐 Lv.6 起 · 高难`、和平村 `安全区 · Lv.1 即可`**，与强敌祭坛等级标签（魔王 Lv.8 / 洞窟领主 Lv.7 / 终焉之神 Lv.12）、敌方等级标定同一套「信息透明」体系（数值均为静态展示建议，不参与任何判定）。
- 【展示层】`TRAVEL_LIST` 每个目的地追加第 4 项推荐等级串（`data.js`）；`drawTravel()` 在**已解锁**目的地的名称行右缘以琥珀色小字常驻显示（`478, …` 右对齐，400 宽面板内不超出、不与说明行重叠），**未解锁**目的地保持「？？？ · 未探索」的神秘感不提前剧透——延续 图鉴灰色占位 / 旅行「未探索」同一原则；选中 ▶ 与说明行照旧。
- 改动范围：`data.js` 的 `TRAVEL_LIST` 一处（3 元组 → 4 元组，纯增量字段）、`ui.js` 的 `drawTravel()` 一行；**未动任何传送判定、visited 解锁逻辑、地图/数值/战斗/掉落/存档**，键位与 `findIndex` 遍历（`x[0]===curMap`）完全不受影响——`main.js`/`core.js` 对 TRAVEL_LIST 的既有用法只取 `[0]` 与 `.length`。
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）**全部通过**；新增 v3.27 专项冒烟（/tmp/jrpg_smoke_v327_travel.mjs）**18 项断言全过**——数据契约（3 目的地/第 4 项非空/Lv.3·Lv.6 落位/键序不变）、doTravel 未探索拦截不改金币不改图、仅村庄解锁时村庄显示推荐等级而两地不提前显示、未探索「？？？」占位与底部提示在位、连续渲染 3 次不改 scene/travelSel/level/gold/hp/mp（纯显示收敛）、全解锁三枚推荐等级齐全、状态/图鉴/帮助/标题邻近界面渲染无异常；邻近 v3.16 旅行冒烟（契约断言 3→≥3 同步更新）与 v3.13 旅馆冒烟（陈旧 HP 常量 41→45、23→27 同步到 v3.26 曲线，历史遗留缺失一并补齐）**全部通过**，23 个冒烟套件全绿。
- 【修复】开局（Lv1-2 进幽暗森林）被随机怪一套连招送命的体验问题。定位到两个元凶：
  - **毒蛇角色倒挂**：它是 7 种普通魔物里攻击基础值最高的（攻 10，比骷髅兵 8 / 石魔像 8 还高），却又是唯一带 35% 施毒的状态怪——Lv1 时一击期望伤害 18（占玩家 41 血 44%）、困难模式 22（两击满血必死），且 v1.21 的 Lv1 新手保护（树精/石魔像 Lv3 门槛）唯独漏了它，是普通/困难两档下开局随机遇怪的首要死因。现基础攻 **10 → 8**（与骷髅兵/石魔像同档），Lv1 期望伤害 18 → 14，困难 22 → 18，施毒特色（0.35 / 3 回合）完整保留——角色回归「低攻高难道」的状态怪定位。
  - **HP 曲线整体偏低**：`baseStats` 血量 **34+lv·7 → 38+lv·7**（Lv1 41→45，全程 +4 平滑），给「连续两场怪 + 毒毒发」的组合拳留出缓冲，后期 Boss 战几乎不受影响（Lv10 仅 104→108）。
- 【模拟验证前置】用真实 `randomEncounter`（真实权重/倍率/精英判定）+ 同源伤害公式跑了 5 组 × 30000 次蒙特卡洛「Lv1 进森林连刷至 Lv5/10 场」对比：普通·保守喝药死亡 0.93%→**0.02%**；普通·无药裸刷 9.2%→**2.0%**；困难·带药 21.9%→**5.3%**；困难·无药 95.2%→91.1%（空血硬刷困难，玩家选择）；凶手分布从「毒蛇一家独大」恢复为各怪均匀。
- 改动范围：仅 `data.js` 两处——`MON_BASE` 毒蛇 `atk:[10,2]→[8,2]`、`baseStats` 血量 `34+lv·7→38+lv·7`；未动任何遇敌权重曲线、地图难度倍率（village×0.9 / cave×1.2）、精英 Lv3 门槛、掉落、经验/金币、技能、Boss 数据或战斗逻辑。
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）**全部通过**；新增 v3.26 专项冒烟（/tmp/jrpg_smoke_v326_opening.mjs）**20 项断言全过**——数据层毒蛇攻 8/施毒 0.35/其余怪未被误改、HP 曲线 45/73/108 落位、applyStats 新档面板 45/11/6/16、Lv1 遇敌实例毒蛇攻 10/血 25/hpMax===hp、对毒蛇期望伤害 14（原 18）、困难缩放 12→18（原 22）不再一击致命、Lv1 无 树精/石魔像/精英（新手保护未破）、Lv3 精英约 7% 与毒蛇照常、Lv6/Lv10 毒蛇威胁占比 ≤25%（后期平滑）、MON_BASE 攻击基础列整体落位；v3.2 中毒 / v3.25 精英门槛 / v2.10 升级 / v3.21 经验预估 邻近专项冒烟全部保持通过。

## v3.25 幽暗森林精英「石心魔像」Lv3 门槛（数值平衡·新手保护）
- 【修复】幽暗森林 7% 稀有精英「石心魔像」原本对玩家等级**无任何门槛**：而 v1.21 的遇敌渐进曲线明确给 树精/石魔像 设了 `Lv3 起才登场` 的新手保护（并写明「Lv1 不会撞上对初始属性极不友好的强敌」），唯独这只看门精英漏了门槛——主线任务从开局就把玩家引向幽暗森林深处，Lv1-2 新手若遇到精英（攻 15+3lv、防 15+2lv，Lv1 时普攻只能打 1 点）会陷入「打不动、逃跑失败就可能送命」的绝境
- 【修复】现在精英与 树精/石魔像 **同一道 Lv3 门槛**：`G.level<3` 时该 7% 分支直接回落到普通权重池（仍按 v1.21 曲线抽取当时合法魔物），Lv3 起精英恢复正常、出现率保持 7% 不变——幽暗森林的最高难度尖峰延后到与其它强敌曲线对齐，新手期进入森林只会遇到可挑战的普通魔物
- 改动范围：仅 `battle.js` 的 `randomEncounter()` 一处（精英判定加 `G.level>=3`）；未动任何精英属性公式、7% 出现率、地图难度倍率、掉落、经验/金币或其它遇敌权重；village/cave 本就不出精英，不受影响
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）**全部通过**（含 Lv6 精英率约 7% 既有断言）；新增 v3.25 专项冒烟（/tmp/jrpg_smoke_v325_elitegate.mjs）**15 项断言全过**——Lv1/Lv2 强制命中 7% 区间也不出精英且回落敌人合法（正属性/hpMax===hp/非精英/属 MON_BASE）、Lv3 精英恢复可用且属性公式正确（hp88/atk21/def21）、Lv3 随机数≥0.07 时仍不出精英（7% 判定未破坏）、village/cave 均不出精英、Lv1/Lv2 各 20000 次抽样精英计数为 0、Lv6 20000 次抽样率约 7%（1377/20000）与基线同界、eliteEncounter 独立调用行为不变；v3.2 中毒 / v3.22 石甲 / v3.23 日志回看 邻近专项冒烟全部保持通过

## v3.24 宝藏洞窟「隐者」NPC（新 NPC·引导信息透明）
- 【新 NPC】宝藏洞窟（第三张地图）此前是唯一一个**没有任何 NPC** 的地图——洞窟领主祭坛、终焉水晶、试炼碑全得靠玩家自己踩上去才知道条件。现洞窟入口处（进门即见）常驻一位白发**隐者**：第一页指点洞窟强敌分布（「洞窟领主镇守着宝藏，中央的终焉水晶里封着终焉之神」），第二页直接点破试炼碑资格（「集齐两枚胜利徽记——击败 幽冥魔王 与 洞窟领主 方能开启最强试炼」），与 `onStep` 的真实资格判定（`bossDefeated && caveBoss`）完全一致，延续 试炼碑状态标签 / 强敌祭坛 Lv 标签 / 帮助第 4 页 同一套「信息透明」体系；也让进门就见矿坑的第三张地图不再冷清
- 【角色即图块】隐者复用既有 NPC 精灵（本就是白发+胡须的老年人造型）与 SOLID 碰撞（不可走入、面对面 Enter 对话），复用 `NPC_SPOTS`/`openTalk`/`talkNext` 既有对话管线，零新增界面/按键/状态
- 改动范围：`data.js`（新增 `NPCS.sage` 两页对白 + `NPC_SPOTS['4,1']:'sage'` 一行）、`world.js`（`loadMap('cave')` 布置隐者图块一行）；均在图块布置层，**未动任何地形布局、传送门、宝箱、祭坛、遇敌判定、掉落、经验/金币、难度缩放或战斗逻辑**——纯增量内容，村庄三名 NPC 完全不受影响
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）**全部通过**；新增 v3.24 专项冒烟（/tmp/jrpg_smoke_v324_sage.mjs）**19 项断言全过**——数据层 sage 与两页对白在位、NPC_SPOTS 预设 `4,1→sage`、村庄三名 NPC 原预设不受影响、洞窟 `(4,1)` 已布置 NPC 图块且入口 E/终焉水晶 SB/试炼碑 TRIAL 保持、岩地主题化仍生效、openTalk 进入 talk 场景与 2 页翻页、翻至末页自动返回 world、隐者图块双向阻挡走位、含隐者帧 drawWorld/drawMinimap 渲染无异常、渲染不改 hp/gold/scene、村庄帧无异常；v3.18 祭坛标签 / v3.11 场地清理 / v3.16 旅行 / v3.5 试炼碑 / v3.15 试炼 / v3.23 日志 全部邻近专项冒烟保持通过

## v3.23 战斗日志回看（体验打磨·信息透明）
- 【回看战斗日志】战斗画面下方的日志区原本永远只显示最后 3 行——长盘 Boss 战（魔王几十回合、试炼三连战近百回合）打到后面，前面的中毒回合数、二阶段变身时机、石甲层数、暴击/反击等历史全部被挤出屏幕，想看前面的回合毫无办法。现在**整场战斗的完整日志可随时回看**：日志超过一屏后，按 `↑/↓`（或 `w/s`，与图鉴滚动的按键习惯一致）在历史里翻动，想看哪一段都行
- 【与图鉴滚动同源】沿用图鉴 `codexScroll` 的滑动偏移模式，新增 `blogView`（0=停在最新、越大越往历史深处）：每次绘制都在 `maxV = 日志行数-3` 处双向钳制（负值/99 一律回合法区间，绝不越界/空屏）；`startBattle` 每场新战斗把偏移归零（Boss 重试、试炼连战、读档后再战都不会带上一场的翻阅位置）；日志 ≤3 行时不出现滚动控件，行为与旧版完全一致
- 【信息透明】右缘常驻一枚小字状态提示：停在最新显示 `↑↓ 回看战斗记录`、翻到最旧显示 `↓ 回到最新`、中段显示 `↑↓ 战斗记录`——与图鉴滚动提示同一体系，一眼明白能翻、翻到哪；纯显示层，未改任何战斗逻辑/数值/日志内容
- 改动范围：`state.js`（注册 `blogView` 一行）、`battle.js` 的 `startBattle`（归零一行）、`ui.js` 的 `drawBattle()` 日志段（窗口切片 + 钳制 + 提示）、`main.js` 战斗键位（↑/↓/w/s 两行）；README「战斗」一行同步。未动任何遇敌/伤害/掉落/经验/金币/难度/存档逻辑——**纯显示增量，零判定风险**
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）**33 项断言全部通过**；新增 v3.23 专项冒烟（/tmp/jrpg_smoke_v323_logscroll.mjs）**25 项断言全过**——blogView 注册初值、0/中段/maxV 三档窗口「画的正是期望 3 行」逐字符断言、负值与 99 越界钳制、日志 2 行不滚动不提示、多次绘制不改写 blog、startBattle 残留偏移(7)归零、新战斗日志重新起算、连续渲染不改 hp/mp/gold/xp/level/battleTurn 纯净性、技能菜单覆盖层共存无异常、单行日志路径正常；v3.22 石甲 / v3.19 逃跑禁标 / v3.15 试炼进度 / v3.21 经验预估 / v3.17 图鉴 五份邻近专项冒烟全部保持通过

## v3.22 精英「石心魔像」专属机制·石甲（新战斗机制·小而自包含）
- 【新机制】幽暗森林的稀有精英「石心魔像」不再只是「血厚防高的杂兵」——它是一尊石心卫士：**血量降至一半以下后，每回合有 35% 概率凝结【石甲】**（至多 3 层），每一层石甲会挡下主角接下来的**一次攻击（普攻/技能）并令伤害降低 40%**。玩家策略随之丰富：石甲层数高时先【6 蓄力】攒一记重击，或【5 防御】稳住回合，一层一层敲开龟壳
- 【信息透明】敌人血条右上角常驻 `🪨 石甲×N（受击-40%）` 层数指示（与玩家「盾/蓄力/中毒」buff 提示同一风格，右对齐不遮挡战斗主体）；战斗日志实时记录「凝结石甲 / 石甲挡下部分伤害（剩余 N 层）」，一眼看清还有几层要拆
- 【与战斗结算同源】石甲只在本场战斗生效，绝不跨场残留（开场 `startBattle` 从数据层深拷贝重构敌人、`eliteEncounter` 不带 shield 字段，重开/Boss 重试/试炼连战等一律干净复刻）；`attackMove` 中先扣层再按 ×0.6 取整（保底 1）结算，飘字/实际扣血/胜利判定全部自动使用减伤后数值；其余敌人（毒蛇/野狼/普通 Boss 二段变身等）完全不受新分支影响
- 改动范围：`battle.js`（`enemyAct` 新增凝甲分支 + `attackMove` 新增石甲减伤两处）、`ui.js` 的 `drawBattle()` 一处（右上角层数指示）、`data.js` 的 `HELP_PAGES` 第 3 页新增「石心魔像·石甲」说明条目；未动任何掉落/经验/金币/升级/存档/地图/难度数值——**纯增量机制，零外部依赖**
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）**全部通过**；新增 v3.22 专项冒烟（/tmp/jrpg_smoke_v322_shield.mjs）**19 项断言全过**——HELP 条目在位、出场精英无 shield、满血不凝甲、半血下 low-rand 必凝 1 层、石甲封顶 3 层、2 层可再凝至 3、攻击消耗一层且伤害 -40%（原 5 → 3）与扣血一致、无石甲伤害保持旧公式不回退、无石甲不产生日志、野狼/Boss 不受分支影响、新开战斗不跨场残留、drawBattle 含/不含石甲渲染均无异常；v3.19/v3.3/v3.2/v3.17/v3.15/v3.12/v3.20/v3.21 邻近专项冒烟全部保持通过


## v3.21 下一技能所需经验预估（体验打磨·信息透明）
- 【信息透明】状态界面（`I`）「下一技能」行升级：原来只显示 `📖 下一技能：陨石术（Lv.7 解锁）`，现在追加**还差多少经验**（`…（Lv.7 解锁 · 还差 156 经验）`），按真实升级曲线逐级预估，一眼看清「还要刷几场、刷什么」才能学到下一个技能；已学满仍显示「已习得全部技能」——延续 威胁预警/战利品预览/图鉴报酬参考/祭坛等级标签 同一套「信息透明」体系
- 【与真实曲线同源】预估来自新增纯函数 `skillXpHint(g)`（`core.js`）：下一个未学技能与 `learnsAt` 同源（已学技能跳过），剩余经验从当前 `g.xpNext` 起按 `winBattle` 的升级链（逐级 ×1.42 取整）逐级累加至解锁等级——与实际升级所需完全一致，不是拍脑袋的粗略值；旧存档缺 `xpNext/xp` 一律兜底（默认 20 / 0），缺字段不闪 0/NaN
- 改动范围：`core.js`（新增并导出一个纯函数）、`ui.js` 的 `drawStatus()` 一处（`nextSkillHint` 调用换成 `skillXpHint`，原 `nextSkillHint` 仍保留导出）；未动任何经验/等级/技能/升级/存档/战斗/掉落逻辑——**纯显示层，零判定风险**；README「职业成长」一行同步
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）**全部通过**；新增 v3.21 专项冒烟（/tmp/jrpg_smoke_v321.mjs）**14 项断言全过**——升级链基准（L1:20→L2:28→L3:40→L4:57→L5:81→L6:115→L7:163→L8:231）与逐级 ×1.42 取整全一致、Lv1xp5 冰霜击还差 43、Lv4 雷鸣还差 57、已学雷鸣后陨石术还差 253、Lv5 已过解锁级跳至陨石术还差 156、Lv2 冰霜击还差 18、已学满返回 null、旧存档缺 xpNext/xp 仍有限数值、null/空参返回 null、drawStatus 渲染无异常且不改 level/xp/hp/gold/ach（纯显示收敛）、连续渲染 3 次稳定、已学满渲染正常、旧存档缺 xpNext 渲染容错

## v3.20 状态界面冒险进度一览（体验打磨·事故功能回归 v2.8）
- 【回归 v2.8】状态界面（`I`）在「下一技能」与「任务目标」之间常驻一行**冒险进度四徽记**：`魔王 / 洞窟领主 / 终焉之神 / 试炼场` 四格进度一次看清——已达成**亮绿 ✓**、未达成**灰色 ✗**（如「✓ 魔王　✓ 洞窟领主　✗ 终焉之神　✗ 试炼场」）。此前状态界面只能看到当前任务目标，隐藏内容（洞窟领主打没打、终焉之神有没有资格、试炼场通没通）毫无线索，只有去踩对应地点/打赢才知道；现在打开角色面板即可一眼判断「还差什么、值不值得去刷」（v3.0 事故回退中连同 v2.8 一起丢失，本次按 v2.8 既定设计回归，补齐 v2.x 事故功能的最后一块）
- 【与推进判定完全同源】徽记数据来自新增纯函数 `adventureProgress(g)`（`core.js`）：只读 `G` 上的四个推进旗标 `bossDefeated / caveBoss / trueBoss / rushDone`，与「百炼成钢」成就、标题存档摘要、试炼碑资格门控共用同一批旗标，永远和真实剧情进度一致，不会出现两套说法；旧存档缺旗标一律 `!!` 容错为未达成
- 【面板净高度不变】原「任务目标」两行（标题+内容）压缩为单行（`任务目标：xxx`），让位给新增的冒险进度行——面板 500×400 尺寸、成就行、关闭提示位置全部保持不变，不超界
- 改动范围：`core.js`（新增并导出一个纯函数）、`ui.js` 的 `drawStatus()` 一处（新增徽记绘制 + 任务目标压单行）；未动任何推进/成就/存档/数值/战斗/掉落逻辑——**纯显示层，零判定风险**
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）**全部通过**；新增 v3.20 专项冒烟（/tmp/jrpg_smoke_v320_progress.mjs）**33 项断言全过**——adventureProgress 四徽记顺序/名称/缺旗标容错契约、四旗标同源（仅魔王/魔王+洞窟领主/含终焉三档分支）、开局全灰 ✗、真通关全绿 ✓、双徽记部分达成、任务目标单行+成就行+关闭提示在位、金币/药水/灵药/冒险时长行原文保持、连续渲染三次不改旗标/hp/金币/成就（纯显示收敛）、旧存档缺 potion2/ach/quest/time/bestiary 字段渲染无 NaN 不抛错；v3.7 状态界面/时长 与 v3.12 标题预览 邻近专项冒烟保持通过

## v3.19 Boss 战逃跑禁标回归（体验打磨·事故功能回归 v2.1）
- 【回归 v2.1】战斗指令栏的 `[4]逃跑` 在四类 Boss 战（主线幽冥魔王 / 洞窟领主 / 终焉之神 / 试炼三连战）中**重新叠绘红色 ⛔**——这些战斗按 4 会被气场压制、不耗回合（`playerAction` 的 flee 分支判定），此前指令栏却只显示普通「[4]逃跑」，与「Boss 战无法逃跑」的实况不一致，README 早已写明「指令置灰 ⛔」但画面一直没画（v3.0 事故回退中连同 v2.1 一起丢失，本次按 v2.1 既定设计回归，让代码兑现文档描述）
- 与技能菜单「MP 不足 ⛔」同风格：普通怪 / 精英「石心魔像」仍可逃跑（约 60% 成功率），指令栏保持原样不叠标；Boss 二段「真身」改名后旗标不变仍叠标
- 改动范围：仅 `js/ui.js` 的 `drawBattle()` 指令栏一处（新增纯显示判定 `isBossFlee` 与一行红色 ⛔ 叠绘，判定与 `playerAction` 的 flee 分支**完全同源** 的 4 个旗标）；**未动任何逃跑判定、回合消耗、敌人属性、掉落、经验/金币或难度数值**，逃跑被压制的既有行为本就在 v2.2 修复中工作正常
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）**全部通过**；新增 v3.19 专项冒烟（/tmp/jrpg_smoke_v319_flee.mjs）**18 项断言全过**——四类 Boss 均叠绘 ⛔ 且保留 `[4]逃跑` 文案、普通怪与精英不叠标、Boss 真身改名后仍叠标、Boss 按 4 逃跑被压制/日志「无法逃脱」/之后仍可行动（无残留锁）、battleBusy 期间不渲染指令栏（无 ⛔）、连续渲染不改动 hp/mp/scene/blog/金币/rushStage（纯显示收敛）、五类 Boss 敌人渲染路径无异常；v3.1/v3.3/v3.15/v3.2 邻近冒烟全部保持通过

## v3.18 强敌祭坛等级标注回归（体验打磨·事故功能回归 v2.9）
- 【回归 v2.9】漫游世界时，**未讨伐**的强敌祭坛上方现在常驻一枚**深红底色金字 `⚠ Lv.X`** 标签：幽暗森林魔王祭坛 `Lv.8`、宝藏洞窟洞窟领主祭坛 `Lv.7`、终焉水晶 `Lv.12`——不必走近踩上、也不用开图鉴/帮助，远远一眼看清强敌所在与建议等级，判断「现在实力够不够、值不值得深入」，与战斗威胁预警、敌方等级标定（v2.3）、试炼碑状态标签的「信息透明」体系同风格（v3.0 事故回退中连同 v2.9 一起丢失，本次按 v2.9 既定设计回归）
- 【同步熄灭】已讨伐的祭坛标签自动熄灭：魔王已倒、洞窟领主已败、终焉之神已破后各自熄灭，与 v3.11 场地清理（祭坛回退岩地）严格同步，不会出现「已打完还挂警告」
- 改动范围：仅 `js/ui.js` 两处——新增模块级纯数据 `ALTAR_TAG`（图块类型 → 已讨伐判定 + 建议等级）＋ `drawWorld()` 一节标签绘制（循环限定当前可见区块，洞窟外/画面外零开销）。**只画每处祭坛的「最顶最左」图块**（`at(x,y-1)/at(x-1,y)` 同为该祭坛类型则跳过）：魔王祭坛竖排 2 格、洞窟领主祭坛 2×2 均只出一枚标签，绝不重复叠标。未动任何敌人属性、触发判定（`onStep` 旗标门控不变）、经验/金币、掉落或难度数值——纯显示层，等级与 `enemyLv()` 标定同源
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）**全部通过**；新增 v3.18 专项冒烟（/tmp/jrpg_smoke_v318_altarlv.mjs）**17 项断言全过**——竖排魔王祭坛只画 1 枚（不叠标）、洞窟 MB(2×2)+SB 各 1 枚共 2 枚、文案含 Lv.8/Lv.7/Lv.12、逐枚击败后各自熄灭直至全灭、村庄无标签、连续渲染不改 bossDefeated/caveBoss/trueBoss/scene（纯显示收敛）；v3.11 祭坛清理 / v3.17 图鉴 / v3.15 试炼 / v3.16 旅行 / v3.5 试炼碑 五份邻近专项冒烟全部保持通过


## v3.17 敌人图鉴「未收集灰色占位」（体验打磨·信息透明）
- 【新显示】敌人图鉴（B 键）不再只列出已讨伐的魔物：固定按 `BESTIARY_TARGET` 全 11 种排列，**未讨伐的格子显示灰色 `❓ ？？？ · 未讨伐` 占位**，已讨伐的照旧显示实况（名称/出没地点/讨伐数/击败可得）——一眼看清图鉴还有几格待点亮、还差哪几种；占位不剧透名称/地点/报酬，保留探索悬念（与快速旅行「？？？ · 未探索」同风格）。此前杀掉 N 只史莱姆后图鉴只有 1 行，玩家完全看不出还有多少物种待发现
- 兑现 README「未收集灰色占位（一眼看清还差哪几种）」的既有描述（v1.x 单文件与 v3.0 重建基线均未真正实现，本次落地）
- 改动范围：仅 `js/ui.js` 的 `drawCodex()` 一处——列表源从「已收集 names」改为「`BESTIARY_TARGET` 全 11 种的 rows（含 got 标记）」，未讨伐分支画灰占位；`codexScroll` 越界钳制同步改为按 11 格计算（上下滚动仍有意义：第 11 格需翻页）；空图鉴仍保持原有「尚未击败任何敌人」引导界面不变。未动任何图鉴数据、`monReward`/`whereFind`、成就判定、掉落或存档结构——纯显示层，零判定风险
- 验证：`node --check js/*.js` 全部 8 个模块通过；新增 v3.17 专项 ESM 冒烟（/tmp/jrpg_smoke_v317.mjs）**29 项断言全过**——空图鉴引导与 0/11、部分收集（实况行 + 9 格占位 + 滚动提示 + 第 11 格翻页补齐 10 处）、越界钳制（999→1 / -7→0）、全收集（无占位、11/11、魔王👿/精英•/石魔像与石心魔像不混淆、末页无滚动提示）、渲染纯净（连续渲染不改 gold/xp/bestiary/scene/curMap）


## v3.16 快速旅行目的地说明（体验打磨·信息透明）
- 【信息透明】快速旅行界面（T 键）每个目的地名称下方新增一行灰色小字，说明到了哪里、那里有什么：和平村「商店·旅馆·村长委托（补给与任务）」、幽暗森林「魔物·宝箱·祭坛·洞窟入口」、宝藏洞窟「强敌·试炼碑·终焉水晶（高难区域）」——此前快速旅行只有三个地名（未探索还只显示「？？？」），想补给/练级/打 Boss 全靠自己记位置；现在一眼看清每个地方的主打内容，与商店药水恢复量、试炼碑状态标签、冒险时长同一套「信息透明」体系；**未探索目的地仍保持「？？？ · 未探索」且不显示说明**（保留探索神秘感，不剧透）
- 改动范围：`js/data.js` 的 `TRAVEL_LIST` 每项追加第三个元素 desc（纯数据）；`js/ui.js` 的 `drawTravel()` 解构改 `[k,nm,desc]` 并新增一行 `if(unlocked&&desc)` 说明绘制——纯显示层，未动任何传送判定、`visited` 逻辑、数值、难度或存档；`doTravel()` 的 `const [k]=TRAVEL_LIST[travelSel]` 与 main.js 的 tab 循环 / `findIndex(x=>x[0]===curMap)` 均只取 key，完全不受 desc 影响
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）**33 项断言全部通过**；新增 v3.16 专项冒烟（/tmp/jrpg_smoke_v316_travel.mjs）**24 项断言全过**——数据结构（条目长 3、desc 非空、key 顺序与名称不变）、导航兼容（tab 循环三圈回 0、findIndex 命中 dungeon）、三态渲染（仅村庄解锁/全部解锁/部分解锁时说明行与「？？？」正确显隐）、渲染纯净性（连续渲染不改 scene/G）、doTravel 契约（未解锁拦截不传送、已解锁正常进 world、三种目的地均可选）

## v3.15 试炼连战关卡进度上线（体验打磨·信息透明）
- 【新显示】试炼三连战（宝藏洞窟试炼碑）**开战期间左上角常驻 `🧭 试炼三连战 第 N/3 关`**：与 `G.rushStage` 完全同源（第 1 关幽冥魔王 / 第 2 关洞窟领主 / 第 3 关终焉之神，全胜即「百炼成钢」），一眼看清三场强敌连战打到了第几场、还剩几场——此前除 Boss 名外毫无进度感，第一关打到胶着时会误以为「就这一场」而放松药水/技能管理；与战斗回合计数、变身线、威胁预警、战利品预览同一套「信息透明」体系
- 纯显示层改动：只改 `js/ui.js` 一处（`drawBattle()` 回合计数下方加 4 行 + import 列表补 `RUSH_BOSSES`）；`Math.min(RUSH_BOSSES.length, Math.max(1, G.rushStage||1))` 钳制，缺字段（旧代码直接进 battle 时 rushStage 为 undefined）/0/越界值一律回退或封顶到合法关卡，绝不出「第 0 关」或 NaN；未动任何敌人属性、连战奖励、掉落、难度缩放、升级曲线或战斗判定
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）**33 项断言全部通过**；新增 v3.15 专项冒烟（/tmp/jrpg_smoke_v315_rushstage.mjs）**26 项断言全过**——三关标签逐关正确且敌名一致、回合计数不干扰、rushStage 缺失/0/99/5 钳制无 NaN、主线魔王/洞窟领主/终焉之神/精英/普通怪五种非 rush 战斗均不显示、渲染不改动 rushStage/battleTurn/敌我血量、startRush 同步置位第 1 关

## v3.14 酿造界面信息透明回归（体验打磨·事故功能回归 v2.16）
- 【回归 v2.16】酿造锅界面（和平村酿造锅按 Enter）补齐两处信息：① 首行常驻 **已酿灵药 N 瓶**（与 HUD/战斗的 🧪 计数同源，一眼看清背包里已存几瓶、还差几瓶才够用，不用再自己记）；② 材料不足时红色提示不再笼统说「材料不足（需 2 株蘑菇 + 10 金币）」，直接报出**具体差额** `还差 X 株蘑菇、Y 金币`（`Math.max(0,…)` 钳制，零材料也不出负数/NaN）——此前想酿灵药必须自己心算配方差多少，与商店「不足」置灰、旅馆差额预警、技能菜单 ⛔ 同一套「信息透明」体系（v3.0 事故回退中连同 v2.16 一起丢失，本次按 v2.16 既定设计回归；v3.13 旅馆记录曾以「酿造差额提示」为参照，本次让该描述真正兑现）
- 改动范围：仅 `js/ui.js` 的 `drawBrew()` 一处（首行加一段 + 不足分支换差额文案）；未动任何酿造配方/价格/判定/数值逻辑，`brewNow()` 的「需 2 株蘑菇 + 10 金币」完全不变；旧存档缺 `potion2` 字段以 `||0` 容错显示 0，不会闪 NaN
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）**33 项断言全部通过**；新增 v3.14 专项冒烟（/tmp/jrpg_smoke_v314_brew.mjs）**21 项断言全过**——材料充足显「已酿灵药 1 瓶」且无「材料不足」、材料不足精确差额（2-1/10-4）、零材料钳制为 2 株蘑菇/10 金币无负数、旧存档缺 potion2 显 0 瓶无 NaN、多次渲染不改动画面上的蘑菇/金币/灵药/药水与 scene、三条渲染路径无异常、drawBrew 不改变 scene、brewNow 酿造契约（足料 / 缺料零消耗）不受影响

## v3.13 旅馆住宿信息透明化（体验打磨·信息透明）
- 【信息透明】旅店住宿界面补齐三行关键信息：① 常驻**当前 HP/MP**（`当前 HP x/max · MP y/max`）；② 受伤时显示本次住宿将确切恢复多少（`今晚将恢复 HP +N MP +M`，与 `hpMax-hp` 同源精确到点数）；③ **金币不足**直接红字预警并报出差额（`金币不足（还差 N 金），无法入住！`）——此前住店只有「价格」一行，钱够不够、一晚能回多少血全靠猜或按了 Enter 才知道（Enter 才弹「金币不足！/精神饱满」）；现在进店一眼看清，与商店「不足」置灰、技能菜单 ⛔、酿造差额提示同一套「信息透明」体系；满状态时仍温和提示「你现在精神饱满，不需要休息。」
- 纯显示层改动：只改 `js/ui.js` 的 `drawInn()` 一处（面板内重排 5 行文案）；未动任何价格、住宿结算、金币判定、数值或逻辑（main.js 的 Enter 住宿判定完全不变），`Math.max(0,…)` 钳制恢复量防止异常状态闪负数
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）**33 项断言全部通过**；新增 v3.13 专项冒烟（/tmp/jrpg_smoke_v313_inn.mjs）**16 项断言全过**——满状态显「精神饱满」且不显恢复行/金币不足、受伤+钱够恢复量精确（41-18=23/16-11=5）、受伤+钱不够差额警告（10-5=5）且恢复行仍在、纯显示不改 hp/mp/gold、仅缺 MP 时 HP +0 MP +6、异常 hp>上限钳制 0 不出负数、三条渲染路径无异常、drawInn 不改变 scene

## v3.12 标题界面存档进度预览（体验打磨·信息透明）
- 【信息透明】标题画面选好存档槽后，槽位行下方常驻一行**当前槽位存档摘要**：`姓名 Lv.X 金币N 所在地图·主线进度`（如「诺亚 Lv.5 金币200 和平村·讨伐魔王中」），按 1/2/3 切换槽位时实时刷新——读档前一眼看清这个槽打到哪里了，不用先进游戏再退出；进度措辞与主线关卡门控完全同源：未击败 → 讨伐魔王中 / 仅洞窟领主 → 已击败洞窟领主 / 仅魔王 → 魔王已讨伐·探索隐藏 / 双徽记 → 讨伐终焉之神中 / 终焉已破 → 已征服终焉
- 改动范围：`js/core.js` 新增纯函数 `slotPreview(s)` 并导出（基于既有 `saveKey`/localStorage，读取解析后只做字符串拼接，**绝不读写或改动存档本身**，无/损坏/缺字段一律容错返回 null 或补 0）；`js/ui.js` 的 `drawTitle()` 加三行展示（有摘要才绘制，无存档整行留空，不挤占「按 L」提示）；未动任何存档结构、数值、战斗、难度或其它界面
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）**全部通过**；新增 v3.12 专项冒烟（/tmp/jrpg_smoke_v312_titlepreview.mjs）**15 项断言全过**——空槽/损坏 JSON/缺 G 字段返回 null、五种主线进度措辞逐一对上、地图名映射（和平村/幽暗森林/宝藏洞窟）、旧存档缺 gold/map 字段容错（金币0 且无 NaN）、saveGame→slotPreview 回路读到最新等级金币、切换槽位实时命中、有无存档两种情况下 drawTitle 渲染均无异常


## v3.11 击败后场地清理回归（体验打磨·信息真实）
- 【打磨】洞窟领主祭坛（`TY.MB`）与终焉水晶（`TY.SB`）被击败后，不再在地图上持续发光：与主线魔王祭坛「被击败后回退为普通地面」的既有模式对齐，两者分别回退为**洞窟岩地**（`TY.CAVE`）；小地图同步转回岩地色。此前只有主线 BOSS 祭坛有这项视觉清理，MB/SB 击败后仍常亮，容易误导玩家「还能再打 / 还有未开要素」——实际 `onStep` 本就按 `caveBoss/trueBoss` 旗标门控、不会重复开战，本次只是让**画面与真实进度一致**
- 改动范围：仅 `js/ui.js` 两处——`drawWorld()` 新增两行覆盖绘制（与既存 `TY.BOSS` 回退相邻）＋ `drawMinimap()` 小地图配色三目运算；未动任何 `onStep`/`winBattle` 判定、数值、掉落、难度或存档结构；击败后进洞重新读图也能正确回退（覆盖绘制按旗标实时判定，不依赖 `winBattle` 临时改迷宫）
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）**33 项断言全部通过**；新增 v3.11 专项冒烟（/tmp/jrpg_smoke_v311_altar.mjs）**15 项断言全过**——未击败时 MB/SB 各自专属发光图块（≠岩地）、caveBoss 置位后祭坛回退岩地而水晶保持发光、trueBoss 置位后水晶也回退、小地图色块同步（紫 #b06ff0 / 金 #ffe94a → 岩地 #39414f）、普通岩地参照全程不变、三帧渲染无异常（坐标从迷宫运行时推导，不硬编码）

## v3.10 商店药水恢复量透明化（体验打磨·信息透明）
- 【信息透明】杂货商店的 **🍖 生命药水** 条目补齐实际恢复量：文案从「生命药水 ×1」升级为「生命药水 ×1（恢复 50%HP +8）」，与 `takePotion()` 的实际结算公式**完全同源**（50% 最大 HP + 固定 8 点），买前一眼看清一瓶能回多少血；与酿造界面已有的「高级灵药：恢复 80% HP + 40% MP」互相印证，普通药水/高级灵药两大补给品的疗效从此全部公开可见，延续攻击预览、战利品预览、敌方等级标定等「信息透明」体系
- 改动范围：仅 `js/ui.js` 的 `openShop()` 一处商品文案；未动任何价格、恢复数值、战斗结算、掉落或酿造逻辑——纯显示层，零判定风险
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟 **33 项断言全部通过**；v3.9 蘑菇 HUD 专项冒烟 **7 项断言全过**

## v3.9 背包蘑菇计数回归 HUD（体验打磨·事故功能回归 v2.15）
- 【回归 v2.15】顶部 HUD 的背包栏重新上线常驻 **🍄 魔法蘑菇** 计数，与 🍖 生命药水、🧪 高级灵药 并列。蘑菇既是村长支线任务物品、又可在杂货铺出售换金、还是酿造高级灵药的核心材料——此前只能靠拾取弹窗/酿造界面/村长对话才知道手里有几株；现在背包里有多少一目了然（v3.0 事故回退中连同 v2.15 一起丢失，本次按 v2.15 既定设计回归）
- 零成本回归：`index.html` 页面壳里的 `<span id="s-mushroom">` 元素在 v3.0 重建时一直保留着（页面壳非事故波及范围），只是 `renderHUD()` 缺了这一行写入——补上后蘑菇计数立即常驻显示，含 `G.mushrooms||0` 容错（旧存档缺该字段时显示 0，不闪 NaN）
- 改动范围：仅 `js/ui.js` 的 `renderHUD()` 一处（新增一行写入）；未动任何任务/掉落/商店/酿造判定、数值与逻辑零改动，页面壳零改动
- 验证：`node --check js/ui.js` 通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）**33 项断言全部通过**；新增 v3.9 专项冒烟（/tmp/jrpg_smoke_v39_mushroom.mjs）**7 项断言全过**——开局 0、拾取 3、酿造后剩 1、旧存档缺字段容错 0、既有金币/药水/灵药字段不受影响、渲染调用无异常、页面壳元素契约在位

## v3.8 宝藏洞窟专属 BGM（体验打磨·事故功能回归 v2.11）
- 【回归 v2.11】进入「宝藏洞窟」后背景音乐不再套用幽暗森林曲目，改为**专属洞窟曲目**：更慢（step 0.32，森林曲为 0.24）、更低沉神秘——A 小调低音律动（A₂=110Hz / G₂=98Hz 副低音衬托）+ 缓速 sine 主旋律（A₃/G₃ 漂浮），贴合「地底深处 + 终焉水晶」的氛围；和平村、幽暗森林、战斗曲目保持原样（v3.0 事故回退中连同 v2.11 一起丢失，本次按 v2.11 既定设计回归）
- 接入点零成本：BGM 分派本就由 `bgmFromScene()` 依据 `curMap` 决定，而进洞/出洞/战后返回/读档/取消静音都走 `resumeBgm()`——新增 `MUSIC.cave` 曲目后只需在 `bgmFromScene()` 加一个 `cave` 分支，全部路径自动切换，无需改任何转场/战斗逻辑
- 改动范围：仅 `audio.js` 一处（新增曲目数据 + `bgmFromScene` 一个分支）；未动任何数值、掉落、难度、剧情、界面或其它曲目
- 验证：`node --check js/*.js` 全部 8 个模块通过；ESM 全量冒烟 **33 项断言全部通过**；新增 v2.11 专项冒烟（/tmp/jrpg_smoke_v211_bgm.mjs）**18 项断言全过**——MUSIC.cave 曲目结构（step 0.32 / sine / seq+bass 合法 / 低音区）、bgmFromScene 四场景分派（battle/village/dungeon/cave + 未知地图回退）、startBgm('cave')+bgmTick 运行、stopBgm 清理定时器、洞窟内 resumeBgm 切到 cave、离开后回 dungeon、静音态安全

## v3.7 冒险时长上线（体验打磨）
- 【新特性】兑现 `newGame()` 里预留但从未使用的 `G.time` 字段——主渲染循环 `render()`（ui.js）按真实流逝时间累加冒险时长，单帧增量封顶 60 秒（切后台/卡顿后恢复不会时间跳变）。**状态界面（I）** 的金币行尾部新增 `⏱️ HH:MM:SS` 实时显示，**尾声战绩页**也追加显示；时长随存档持久化（saveGame 本就整存 G），旧存档缺 `time` 字段也会在首次渲染时自动补 0，读档/重开流程不受影响
- 纯体验打磨：只改 `js/ui.js` 一处（新增模块级 `_timePrev` + 纯函数 `fmtTime` 并导出 + `render()` 走时 + `drawStatus`/`drawEnding` 两行展示）；未动任何数值、掉落、难度、战斗判定、升级曲线或存档结构
- 验证：`node --check js/ui.js` 通过；ESM 全量冒烟 **33 项断言全部通过**；新增 v3.7 专项冒烟（/tmp/jrpg_smoke_v37_time.mjs）**18 项断言全过**——fmtTime 全分支（0/59/60/3661/7325/86399 及负值与 undefined/null 容错）、render() 走时（首帧合法、多帧单调不减、模拟 10 分钟间隔增量被封顶 60s、旧存档缺 time 自动初始化）、drawStatus/drawEnding 渲染无异常、newGame time===0 契约不变

## v3.6 升级攻防同步修复 + 成长明细回归（数值修复·事故功能回归 v2.10）
- 【关键修复·回归 v2.10】**攻防不同步 Bug 根治**：`winBattle()` 的升级循环此前只刷新 HP/MP 上限、从不刷新攻击/防御——`da/dd`（攻防成长量）算了却没生效，`G.atkMax/G.defMax` 永远停留在 Lv.1 的旧值，怪物却随等级渐强（`MON_BASE` 线性成长），导致「妖怪变强、主角原地踏步」，中后期战斗被严重拖难。现每次升级都按 `baseStats(新等级) + 装备` **重算四项上限**（攻击防御一并刷新），`baseStats` 的 攻+2/级、防+2/级 曲线真正生效，成长曲线与怪物难度曲线恢复同步（v3.0 事故回退中连同 v2.1–v2.17 一起丢失，本次按 v2.10 既定设计回归）
- 【打磨】升级提示不再只说「属性上升」——直接列出本次实际获得的成长明细：`🎉 等级提升到 Lv.N！HP+x MP+x 攻+x 防+x`（一次升多级自动汇总，与 `baseStats` 相邻等级差额完全一致；Boss 战保留「你终于可以……」后缀）。顺带清理循环内一行重复的 `hpMax/mpMax` 冗余赋值
- 改动范围：仅 `battle.js` 的 `winBattle()` 升级循环一处；未动任何 `baseStats` 成长公式、怪物属性、经验/金币曲线、掉落、成就判定或难度倍率；Lv.1 开局与读档流程（本就走 `applyStats`）不受影响
- 验证：`node --check` 全部 8 个模块通过；新增 v2.10 专项冒烟（/tmp/jrpg_smoke_v210_upgrade.mjs）**15 项断言全过**——Lv.1 基线攻防正确、多段升级（xp400 → Lv.7）攻 11→23 / 防 6→18 随 `baseStats+装备` 精确重算、升级提示含 HP+/MP+/攻+/防+ 明细且多级汇总一致、边界升级 Lv.1→2 明细精确为 攻+2 防+2、经验不足不升级攻防不变；ESM 全量冒烟 **33 项** + v3.5/v3.3/v3.2/v3.1 专项冒烟（16+25+22+12 项）全部保持通过

## v3.5 试炼碑引导回归（体验打磨·事故功能回归 v2.14）
- 【回归 v2.14】宝藏洞窟中央的**试炼碑**不再靠「踩上去才知道」：试炼碑上方常驻一枚状态标签——未具备资格时显灰黄「试炼·未解锁」，魔王+洞窟领主双倒后转绿色「⚔️ 试炼·可挑战」，与 `onStep` 的真实资格判定（`bossDefeated && caveBoss`）**完全同源**，一眼看清试炼场还差哪枚徽记、现在能不能打，延续 v2.9 强敌祭坛 Lv 标签的「信息透明」体系，同时兑现 README「强敌祭坛与试炼碑状态标签」的既有描述（v3.0 事故回退中一并丢失，本次按 v2.14 既定设计回归）
- 【回归 v2.14】帮助系统 H 新增第 4 页「试炼与进阶」：试炼碑位置/双徽记条件、试炼三连战奖励、被强敌击败按 B 重整旗鼓、快速旅行 T、支线蘑菇宝箱小地图金光提示，全部新特性落进文档；翻页 UI 复用既有 `helpPage` 分页，`HELP_PAGES.length` 自动适配，零新增界面代码
- 标签只在试炼碑进入视野时才绘制（绘制循环限定在当前可见区块内），宝藏洞窟外/画面外零开销；站在碑上时标签位于角色头顶之上不遮挡操作
- 改动范围：`data.js`（HELP_PAGES 新增第 4 页）、`ui.js`（`drawWorld` 内一处标签绘制）；未动任何敌人属性、掉落、经验/金币、难度缩放、Boss/试炼判定或升级曲线
- 验证：`node --check` 两个改动模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）既有 **33 项断言全部通过**；v3.5 专项冒烟（/tmp/jrpg_smoke_v35_trial.mjs）**12 项断言全过**——两档状态标签（未解锁/可挑战）绘制路径无异常、非洞窟地图与画面外不绘制、HELP 第 4 页存在且内容齐、helpPage 越界取模安全、标签文字不抛错等

## v3.4 战斗回合计数回归（体验打磨·事故功能回归 v2.13）
- 【回归 v2.13】战斗界面**左上角常驻 `⚔️ 回合 N` 计数**重新上线：每场战斗从第 1 回合起算、玩家每行动一次 +1——长盘 Boss 战 / 试炼三连战一眼看出胶着程度（已经打到第几回合、还能撑多久），与威胁预警、中毒回合数、二段变身线的「信息透明」体系同风格（v3.0 事故记录中点名回退的功能，本次按 v2.13 既定设计回归；ESM 冒烟基线文件里「battleTurn 断言待回归」的注释随之兑现）
- 生命周期严格限定在单场战斗内：`startBattle` 每场重置为第 1 回合（含 Boss 重试、试炼连战每一关、读档后新开的战斗），玩家任意指令（攻击/技能/药水/防御/蓄力/逃跑）在 `playerAction` 起手处 +1；战斗结束（胜利/死亡/逃跑）后随战斗界面一起消失，不会跨战斗残留；Boss 战气场压制按 4 不耗回合的既有逻辑完全不受影响
- 改动范围：`state.js`（注册全局 `battleTurn`，仅一行声明）、`battle.js`（`startBattle` 置 1 / `playerAction` 起手 +1）、`ui.js`（`drawBattle` 左上角一处绘制）；未动任何怪物属性、掉落、经验/金币、难度缩放、升级曲线或战斗判定
- 验证：`node --check` 全部 3 个改动模块通过；ESM 全量冒烟 **33 项断言全部通过**（新增 战斗回合计数 5 项：残留值 99 开战重置为第 1 回合、drawBattle 含计数绘制无异常、行动后 +1 进第 2 回合、计数不影响普攻伤害结算、再次开战重新起算），连同遇敌分布、难度倍率、Boss 战、图鉴报酬、传送碰撞、技能菜单、v3.0 美术渲染等既有回归全部保持通过；v3.1/v3.2/v3.3 专项冒烟（攻击预览/毒蛇/敌方等级标定）也全部通过

## v3.3 敌方等级标定修复（显示修复·回归 v2.3）
- 【修复】战斗画面的敌方等级长期显示不一致：只有主线幽冥魔王写死 `Lv.8`，而洞窟领主、隐藏真Boss「终焉之神」、试炼连战三名 Boss、「石心魔像」精英，以及 Boss 二段「真身」形态，全部误显示**玩家当前等级**——Lv.1 就撞见终焉之神时它会显示 `Lv.1`，与威胁预警、战力对比、战利品预览的「信息透明」体系冲突，严重误导威胁判断（v3.0 事故回退中一并丢失，本次按 v2.3 既定设计回归）
- 新增纯展示函数 `enemyLv()`（`ui.js`）统一标定：终焉之神 `Lv.12` / 幽冥魔王 `Lv.8` / 洞窟领主 `Lv.7`（试炼连战按对应 Boss 同值），**真身改名后仍正确**（`幽冥魔王·真身`↔8、`洞窟领主 ·真身`↔7、`终焉之神·祸乱形态`↔12）；精英「石心魔像」= 玩家等级 +1；普通随机怪仍随玩家等级渐进，曲线不变
- 顺带 Boss 名**紫色高亮扩展到四类 Boss**（`isBoss`/`isTrue`/`isCaveBoss`/`isRush`），此前只有主线魔王是紫色
- 纯显示层改动：只改 `ui.js`（新增并导出一个纯函数 + `drawBattle()` 敌名一行），未动任何敌人属性、变身机制、经验/金币、掉落或难度缩放数值
- 验证：`node --check js/ui.js` 通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）既有回归**全部通过**；新增 v3.3 专项冒烟（/tmp/jrpg_smoke_v33_enemylv.mjs）**25 项断言全过**——enemyLv 全部分支（三强敌/六种真身改名写法/精英/普通怪/等级不随玩家漂移）、四类 Boss + 精英 + 普通怪 + 两种真身形态共 9 条 drawBattle 渲染路径无异常

## v3.2 毒蛇剧毒机制（新战斗机制·v3.0 事故功能回归）
- 【新机制回归·v2.12】毒蛇终于名副其实：被咬中有 **35% 概率中毒 3 回合**（概率来自 `MON_BASE` 数据条目 `poison:0.35`）。中毒后**每回合起手先毒发扣 5% 最大 HP**（保底 2 点），毒发不夺走本回合行动——中了毒照样能攻击/喝药/防御/蓄力自救，但会持续失血，逼着你在「速战速决」与「喝药续命」间抉择；毒发致死正常进入死亡结算。毒蛇本就是高攻怪，这一刀让「行走幽暗森林/宝藏洞窟时备好药水」的紧张感落到实处（v3.0 事故中被回滚，本次按 v2.12 既定设计回归）
- 状态透明：战斗界面新增**绿色脉动**的 `☠️ 中毒 N 回合 · 每回合扣血` 常驻提示（与蓝色盾、金色蓄力区分；回合计时随毒发实时递减），战斗日志同步记录「☠️ 毒素发作」与「中了【毒】」；帮助系统 H 新增第 3 页「魔物与状态」（毒蛇中毒、中毒自救、高级灵药、魔物强度），翻页 UI 复用既有 `helpPage` 分页
- 生命周期严格限定在单场战斗内：开战/胜利/死亡/成功逃跑均清零，不会跨战斗残留；毒发结算只在 `playerAction()` 回合起手处执行、施毒只在 `enemyAct()` 攻击命中分支触发（仅携带 `poison` 标记的毒蛇），与既有的防御/蓄力/反击/二阶段结构完全兼容
- 改动范围：`data.js`（毒蛇 `poison:0.35` + HELP 第 3 页）、`core.js`（newGame 初始 `poison:0`）、`battle.js`（遇敌深拷贝携带标记 / startBattle 清零 / 回合起手毒发 / 毒蛇攻击施毒 / 胜利·逃跑·死亡清毒）、`ui.js`（战斗界面中毒提示）、`README.md`（战斗说明 + 帮助页数如实同步）；未动任何数值曲线、掉落、经验/金币、难度缩放，非毒蛇魔物属性与行为完全不变
- 验证：`node --check` 全部 4 个改动模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）既有回归**全部通过**；新增 v3.2 专项冒烟（/tmp/jrpg_smoke_v32_poison.mjs）**22 项断言全过**——数据层仅毒蛇带 poison 0.35、HELP 第 3 页、newGame 初始 0、遇敌深拷贝仅毒蛇保留标记（含精英不带）、开战清零、毒发扣 5% 保底 2 + 回合递减 + 不夺行动、毒发日志、毒发致死进死亡结算并清毒、enemyAct 100% 与 0% 双路径施毒、胜利清毒、逃跑清毒、中毒/无中毒两档 drawBattle 渲染无异常

## v3.1 攻击指令伤害预览回归（体验打磨·事故功能补回）
- 【信息透明·回归 v2.17】战斗指令栏的 `[1]攻击` 重新带期望伤害预览 `[1]攻击≈N伤`——v3.0 事故记录中点名回退、待自动完善任务逐步补齐的功能，本次按 v2.17 既定设计重构回归。普攻与技能菜单（`≈N伤`）信息完全对齐，最常用的基础攻击从此也能一眼算出对当前敌人打多少血
- 数值与实战同源：新增纯函数 `atkEstimate(g,e)`（`battle.js`，与 `cmdDmg` 同一公式 `攻×2-防`、保底 1，不含 ±10% 浮动即其均值）；**蓄力中自动 ×2**（与 `attackMove` 的 charged 倍率同源），蓄力态下指令栏数字实时翻倍，配合既有「蓄力中 · 下击×2」提示一目了然；高防/缺字段一律容错保底 1，不闪 0/NaN，`G` 为 null 时返回 1
- 纯显示层：只改 `battle.js`（新增并导出一个纯函数）+ `ui.js` 的 `drawBattle()` 指令栏一处（`enemy` 存在才显示预览，Boss 战/无敌人时退化为原「攻击」字样）；未动任何伤害公式、怪物属性、掉落、经验/金币、难度缩放或战斗判定
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟（/tmp/jrpg_smoke_esm.mjs）既有回归全过；新增 v3.1 专项冒烟（/tmp/jrpg_smoke_v31_atk.mjs）12 项断言全过——atkEstimate 与 cmdDmg 期望一致（30攻/10防→50）、高防保底 1、无防按攻×2、蓄力 ×2（50→100）、G 缺失/缺 atkMax/enemy 缺失三类容错、drawBattle 含 enemy·蓄力·无 enemy 三条渲染路径均无异常

## v3.0 美术资源全面升级（美术）
- **全部 17 种图块重绘**（`ui.js` TILE）：草地加层次/小花/卵石/露珠光点，树木加树影/多层树冠/受光面，岩石加裂缝高光与投影，水波加波光，路径加边缘暗化，宝箱加金属镶边与宝光，喷泉加石槽/水花/喷涌，传送门改漩涡光晕，建筑加门窗/檐线/灯火，终焉水晶与祭坛加光晕
- **宝藏洞窟地下主题化**：新增 `CAVE`（岩地+荧光晶尘）与 `CAVEWALL`（洞窟岩壁）两种图块，`loadMap('cave')` 将草地→岩地、边界树→岩壁，小地图配色与已开宝箱显示同步适配；`dangerAt` 遇敌判定跟随新图块（玩法/掉落/遇敌概率不变）
- **主角精灵重绘**（`drawHero`）：脚下阴影 + 轮廓描边 + 肩部受光 + 腰带/深色裤分层；**随装备换装**——衣甲配色（布衣蓝/皮甲棕/锁子甲钢色/龙鳞甲绿）与剑刃外观（木剑→铁剑→秘银→勇者之剑→**圣剑金色辉光**）随 `G.weapon/G.armor` 实时变化；待机呼吸 + 行走腿部交替小动画
- **怪物按物种差异化造型**（`drawMonster`）：史莱姆黏液高光与底部鼓包、野狼耳鼻尾、骷髅兵深眼眶/牙齿/肋骨、哥布林大耳獠牙、毒蛇竖瞳分叉舌、树精树冠枝干、石魔像裂纹苔点；魔王级红眼+角，终焉之神升级为**金色神环 + 大展双翼**，洞窟领主加肩刺；全部怪物补瞳孔与脚下阴影，受击白闪移至最上层覆盖全细节
- **战斗场地氛围**：敌我身后径向柔光 + 地面光圈，增强空间纵深
- **标题页远景**：双层远山剪影 + 雪顶微光 + 地平线微光地面
- 纯美术改动：只动 `js/ui.js` / `js/data.js`（新增 CAVE/CAVEWALL 图块类型）/ `js/world.js`（洞窟映射与遇敌判定适配），未改任何数值/掉落/难度/剧情；`node --check` 全过 + ESM 全量冒烟全部通过，并新增 @napi-rs/canvas 真实渲染脚本（/tmp/jrpg_viz）逐场景出图人工审查
- 【事故记录】开发过程中一次误将 `js/` 目录删除。已用「构建脚本从 v1.23 快照重建基线 → 逐条重放 import/美术补丁」的方式完整恢复本项目全部内容（v2.0 模块结构 + v3.0 美术），并补修一个此前潜伏的导入缺口（world.js 未导入 BOSS/CAVE_BOSS/TRUE_BOSS，踩魔王祭坛会抛 ReferenceError）。代价：删除时点在档的 cron 增量功能（约 v2.1–v2.17：毒蛇中毒/战斗回合计数/试炼引导/攻击伤害预览等）被回退，将由每小时自动完善任务在后续运行中逐步重新补齐（README/备份文件不受影响）。教训：后续任何涉及本项目的操作先 `git init` 或整目录副本兜底


## v2.17 攻击指令伤害预览（体验打磨）
- 【信息透明补全】战斗指令栏的 `[1]攻击` 现在带期望伤害预览：`[1]攻击≈N伤`——普攻从此不再是全游戏唯一「没有伤害预览」的动作。技能菜单（v1.29）里每个技能都标 `≈N伤`，能一眼算出性价比；唯独最常用的基础攻击要自己心算「攻×2-防」，与技能预览信息不对称。如今二者对齐：普攻同技能一样直接显示对当前敌人的平均伤害
- 数值与实战同源：预览来自新增纯函数 `atkEstimate(g,e)`（`battle.js`，与 `cmdDmg` 同一公式 `攻×2-防`、保底 1，不含 ±10% 浮动与暴击即其均值）；**蓄力中自动 ×2**（与实战 `attackMove` 的 charged 倍率同源），蓄力状态下指令栏数字实时翻倍，配合既有「蓄力中 · 下击×2」提示一目了然；高防/缺字段一律容错保底 1，不闪 0/NaN
- 纯显示层：只改 `battle.js`（新增一个纯函数并导出）+ `ui.js` 的 `drawBattle()` 指令栏一处（`enemy` 存在才显示预览）；未动任何伤害公式、怪物属性、掉落、经验/金币、难度缩放或战斗判定，Boss 战 ⛔ 逃跑压制标记仍按真实 `bar` 宽度定位不受影响
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟 **91 项断言全部通过**——新增 攻击预览 8 项（atkEstimate 与 cmdDmg 均值一致、蓄力 ×2、高防保底 1、无防御按攻×2、G 缺失/缺 atkMax 容错、drawBattle 含预览+Boss+蓄力渲染无异常），连同遇敌分布、难度倍率、Boss 战、中毒、回合计数、试炼碑引导、酿造界面、蘑菇 HUD、图鉴、四场景 BGM、状态界面等既有回归全部保持通过

## v2.16 酿造界面信息补全（体验打磨）
- 【信息透明补全】酿造锅界面（和平村酿造锅按 Enter）此前是全游戏唯一「信息不透明」的补给界面：不显示背包已酿好的高级灵药存量、材料不足时也只笼统说「材料不足」——想酿灵药必须自己记背包里有几瓶、还得心算「2 株蘑菇 + 10 金币」差多少。如今补齐两处：① 配方说明行直接显示 `已酿灵药 N 瓶`（与战斗/HUD 的 🧪 计数同源，一眼看清已存几瓶、还差多少）；② 材料不足时红色提示直接报出具体差额 `还差 X 株蘑菇、Y 金币`（`Math.max(0,…)` 钳制，零材料时也不会出现负数/NaN），不用再心算配方
- 纯显示层改动：只改 `ui.js` 的 `drawBrew()` 一处、未动任何酿造判定/数值/掉落/任务逻辑，`brewNow()` 的「需 2 株蘑菇 + 10 金币」配方完全不变；旧存档缺 `potion2` 字段时以 `||0` 容错显示 0，不会闪 NaN
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟 **83 项断言全部通过**——新增 酿造界面 8 项（材料充足/不足/零材料三档渲染路径、差额正值计算、Math.max 边界钳制、旧存档缺 potion2 容错、纯显示不改数值），连同遇敌分布、难度倍率、Boss 战、中毒、回合计数、试炼碑引导、蘑菇 HUD、图鉴、四场景 BGM、状态界面等既有回归全部保持通过

## v2.15 背包蘑菇计数入驻 HUD（体验打磨）
- 状态栏新增常驻 **🍄 魔法蘑菇** 计数：与 🍖 生命药水、🧪 高级灵药 并列显示。蘑菇既是村长支线任务物品、又可在杂货铺出售换金、还是酿造高级灵药的核心材料——此前只能靠拾取弹窗/酿造界面/村长对话才知道手里有几株，现在背包里有多少一目了然
- 纯显示层：`index.html` 新加一个 `<span>`（只在页面壳里声明元素，未写任何逻辑）、`ui.js` 的 `renderHUD` 补一行写入（含 `G.mushrooms||0` 容错，旧存档缺该字段时显示 0）；未动任何任务/掉落/商店/酿造判定，数值与逻辑零改动
- 验证: `node --check` 全部 8 个模块通过；ESM 全量冒烟 **75 项断言全部通过**——新增 蘑菇计数 5 项（0 株显示 0 不抛错、拾取 3 株正常显示、不影响既有金钱/灵药显示、旧存档缺字段容错显示 0），连同遇敌分布、难度倍率、Boss 战、毒蛇中毒、回合计数、试炼碑引导等既有回归全部保持通过

## v2.14 试炼碑引导（体验打磨）
- 宝藏洞窟中央的**试炼碑**终于不再靠「踩上去才知道」：试炼碑上方常驻一枚状态标签——未具备资格时显灰黄「试炼·未解锁」，魔王+洞窟领主双倒后转绿色「⚔️ 试炼·可挑战」，与 `onStep` 的真实判定（`bossDefeated && caveBoss`）完全同源，一眼看清试炼场到底还差哪枚徽记、现在能不能打，延续 v2.9 强敌祭坛 Lv 标签的「信息透明」体系
- 帮助系统 H 新增第 4 页「试炼与进阶」：试炼碑位置/双徽记条件、试炼三连战奖励、被强敌击败按 B 重整旗鼓、快速旅行 T、支线蘑菇宝箱小地图提示，新特性全部落进文档；翻页 UI 复用既有 `helpPage` 分页，零新增界面代码
- 纯 `ui.js` 一处绘制 + `data.js` 一页文案：未动任何触发判定、敌人属性、掉落、经验/金币、难度缩放或战斗逻辑；单格试炼碑不重复叠标
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟 **71 项断言全部通过**——新增 试炼碑引导 6 项（HELP 第 4 页存在/含重整旗鼓条目、drawWorld 未解锁与可挑战两条渲染路径、资格判定与 onStep 同源），连同遇敌分布、难度倍率、Boss 战、中毒、回合计数、升级结算、传送碰撞、图鉴、四场景 BGM、状态界面等既有回归全部保持通过

## v2.13 战斗回合计数（体验打磨）
- 战斗界面**左上角常驻 `⚔️ 回合 N` 计数**：每场战斗从第 1 回合起算、玩家每行动一次 +1——长盘 Boss 战 / 试炼三连战一眼看出胶着程度（已经打到第几回合、还能撑多久），与威胁预警、中毒回合数、二段变身线等「信息透明」体系同风格
- 生命周期严格限定在单场战斗内：`startBattle` 每场重置为第 1 回合（含 Boss 重试、试炼连战每一关、读档后新开的战斗）；逃跑成功/胜利/死亡后随战斗结束自然不再显示，不会跨战斗残留；Boss 战气场压制按 4 逃跑不耗回合的既有逻辑完全不变
- 纯计数+显示层改动：`state.js` 注册全局 `battleTurn`（仅一行声明，不加任何游戏逻辑）、`battle.js` 的 `startBattle` 置 1 / `playerAction` 起手 +1、`ui.js` 的 `drawBattle` 左上角一处绘制；未动任何怪物属性、掉落、经验/金币、难度缩放、升级曲线或战斗判定
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟 **65 项断言全部通过**——新增 战斗回合计数 5 项（残留值重置为第 1 回合、drawBattle 含计数绘制无异常、行动后 +1 进第 2 回合、再次开战重新起算、击杀结算不受影响），连同遇敌分布、难度倍率、Boss 战、毒蛇中毒、升级结算、传送碰撞、图鉴、四场景 BGM、状态界面等既有回归全部保持通过

## v2.12 毒蛇剧毒机制（新战斗机制）
- 【新机制】毒蛇终于名副其实：被咬中有 **35% 概率中毒 3 回合**（概率随 `MON_BASE` 数据条目配置，`poison:0.35`）。中毒后**每回合开始先毒发扣 5% 最大 HP**（保底 2 点，至多约 15% 血的持续压力），毒发不夺走本回合行动——中了毒照样能攻击/喝药/防御/蓄力自救，但会持续失血，逼着你在「速战速决」与「喝药续命」之间做抉择；毒发致死会正常进入死亡结算。毒蛇本就是高攻怪，这一刀让「行走幽暗森林/宝藏洞窟时备好药水」的紧张感落到了实处
- 状态透明：战斗界面新增绿色脉动的 `☠️ 中毒 N 回合 · 每回合扣血` 常驻提示（区别于蓝色盾、金色蓄力），回合数随每次毒发实时递减；战斗日志同步记录「毒素发作」与「中了【毒】」
- 生命周期严格限定在单场战斗内：新开战斗/胜利/死亡/成功逃跑都会清零，不会跨战斗残留；毒发结算只在 `playerAction()` 回合起手处执行、施毒只在 `enemyAct()` 毒蛇攻击分支触发，两条路径互不干扰，与既有的防御/蓄力/反击回合结构完全兼容
- 信息补全：帮助说明 H 新增第 3 页「魔物与状态」（毒蛇中毒、灵药用法、魔物强度查询），翻页 UI 复用既有 `helpPage` 分页，零新增界面代码
- 改动范围：`data.js`（毒蛇 `poison` 字段 + HELP 新页）、`battle.js`（遇敌携带标记 / startBattle 清零 / 毒发结算 / 施毒分支 / 胜利·逃跑·死亡清毒）、`ui.js`（战斗界面中毒提示）、`core.js`（newGame 初始 `poison:0`）；未动任何数值/掉落/经验/金币/难度曲线，普通魔物（非毒蛇）属性与行为完全不变
- 验证：`node --check` 全部 8 个模块通过；ESM 全量冒烟 **60 项断言全部通过**——新增 毒蛇中毒 11 项（数据层仅毒蛇带 poison、HELP 第 3 页、遇敌深拷贝仅毒蛇保留标记、开战清零、毒发扣血+回合递减、毒发不夺行动、日志记录、enemyAct 100% 施毒路径、非毒蛇不施毒、毒发致死进死亡结算并清毒），连同遇敌分布、难度倍率、Boss 战、升级结算、传送碰撞、图鉴、四场景 BGM、状态界面等既有回归全部保持通过

## v2.11 宝藏洞窟专属 BGM（体验打磨）
- 进入「宝藏洞窟」后，背景音乐从幽暗森林曲目换为**专属洞窟曲目**：更慢（step 0.32）、更低沉神秘（A 小调低音律动 + 缓速 sine 主旋律，A₁/G₁ 副低音衬托），与「地底深处 + 最终水晶」的氛围匹配；幽暗森林（step 0.24 三角波）与和平村原曲保持不变
- 接入点零成本：BGM 分派本就由 `bgmFromScene()` 依据 `curMap` 决定，且所有转场/战后返回/读档/取消静音都走 `resumeBgm()`——新增 `MUSIC.cave` 曲目后在 `bgmFromScene()` 加一个 `cave` 分支即可，进洞、出洞、战后、读档、M 键恢复静音全部自动切换，无需改任何转场/战斗逻辑
- 纯 `audio.js` 一处改动（新增曲目数据 + 一个分支），未动任何数值、掉落、难度、剧情或界面；`startBgm/stopBgm/bgmTick` 定时器行为不变
- 验证：`node --check js/audio.js` 通过；ESM 全量冒烟 **49 项断言全部通过**——新增 8 项（bgmFromScene 四场景分派 battle/village/dungeon/cave、MUSIC.cave 曲目结构、resumeBgm 洞窟内切到 cave 曲目、stopBgm 清理定时器、音频模块加载），连同遇敌分布、难度倍率、Boss 战、升级结算、传送碰撞、图鉴、状态界面、祭坛标签等既有回归全部保持通过

## v2.10 等级提升成长明细 + 攻防不同步修复（数值修复 + 体验打磨）
- 【修复】战斗胜利的升级结算此前**只刷新 HP/MP 上限、从不刷新攻击/防御**：`winBattle()` 的升级循环里 `da/dd` 算了却没生效，`G.atkMax/G.defMax` 一直停留在上一次 `applyStats()` 的旧值（通常就是开局 Lv.1）——怪物随等级变强，主角战力却原地踏步；状态面板还会出现「基础攻+武器 ≠ 总攻」的错位（显示值按新等级算、实际战斗用的是旧值）。现在升级后统一 `applyStats(G)` 重算四项上限，`baseStats` 的攻+2/级、防+2/级曲线真正生效，成长曲线与怪物难度曲线恢复同步
- 【打磨】升级提示不再只说「属性上升」——直接列出本次实际获得的成长明细：`🎉 等级提升到 Lv.N！HP+x MP+x 攻+x 防+x`（一次升多级自动汇总；Boss 战保留「你终于可以……」后缀）。新增纯函数 `levelGainFor(fromLv,toLv)`（`battle.js`）：按 `baseStats` 相邻等级差额汇总成长量，与结算循环真实变化完全一致，零外部依赖，供胜利结算展示
- 纯结算层改动（只改 `battle.js` 的 `winBattle()`/新增一个纯函数）：未动任何 `baseStats` 成长公式、怪物属性、经验/金币、掉落、成就判定或难度倍率；顺带清理了循环里一行重复的 `hpMax/mpMax` 冗余赋值
- 验证：`node --check js/*.js` 全部通过；ESM 全量冒烟 **41 项断言全部通过**——新增 等级提升成长明细 7 项（levelGainFor 同级为 0 / 1→3 与 baseStats 差额一致含攻防 / 下限钳制 Lv.1 / 真实升级结算触发 Lv.1→2 / 升级后 atkMax·defMax·hpMax·mpMax 全部刷新 / 升级提示列出 HP+·攻+·防+ 实际数值），连同遇敌分布、难度倍率、Boss 战、传送碰撞、图鉴、状态界面、祭坛标签等既有回归全部保持通过

## v2.9 强敌祭坛等级标注（体验打磨）
- 漫游世界时，**未讨伐**的强敌祭坛上方现在常驻一枚深红底金字标签 `⚠ Lv.X`：幽暗森林魔王祭坛 `Lv.8`、宝藏洞窟洞窟领主祭坛 `Lv.7`、终焉水晶 `Lv.12`——不必走近踩上、也不用打开图鉴/帮助，远远一眼就能看见强敌所在与建议等级，判断「现在实力够不够、值不值得深入」，与 v1.19 战斗威胁预警 / v1.8 小地图颜色 / v2.3 敌方等级标定的「信息透明」风格同体系
- 已讨伐的祭坛标签自动熄灭（魔王已倒祭坛灰烬、洞窟领主/终焉之神击败后祭坛清除），与真实剧情进度严格同步，不会出现「已打完还挂个警告」
- 推荐等级与 v2.3 `enemyLv` 标定同源（幽冥魔王 Lv.8 / 洞窟领主 Lv.7 / 终焉之神 Lv.12）；标签只画每块祭坛的**左上角**（竖排 2 格 / 2×2 祭坛不重复叠标），随摄像机可视范围绘制，纯显示层改动，只改 `ui.js` 的 `drawWorld()` 一处，未动任何敌人属性、触发判定、经验/金币、掉落或难度数值
- 验证：`node --check js/*.js` 全部通过；ESM 全量冒烟 **34 项断言全部通过**——新增 魔王祭坛未讨伐/已讨伐、洞窟领主+终焉水晶双标签/全熄灭 四条 `drawWorld` 渲染路径，连同遇敌分布、难度倍率、传送碰撞、战斗胜利、状态界面等既有回归

## v2.8 状态界面冒险进度一览（体验打磨）
- 状态界面（`I`）在「下一技能」与「任务目标」之间新增一行「冒险进度」：**魔王 / 洞窟领主 / 终焉之神 / 试炼场** 四枚徽记一次看清——已达成亮绿 `✓`，未达成灰色 `✗`。此前状态界面只能看到当前任务目标，隐藏内容（洞窟领主打没打、终焉之神有没有资格、试炼场通没通）毫无线索，只有去踩对应地点才知道。现在打开角色面板即可判断「还差什么、值得去刷什么」，与「信息透明」风格同体系
- 新增纯函数 `adventureProgress(g)`（`core.js`）：不读任何界面状态、只读 `G` 上的推进标志（`bossDefeated/caveBoss/trueBoss/rushDone`），返回 4 组 `[名称, 是否达成]`；未达成置灰交给 `drawStatus()` 绘制。纯显示层，未动任何推进/判定/成就/数值逻辑；顺手把原本两行的「任务目标」压缩为单行、成就行下移 6px 避让，面板垂直空间不超界
- 数据源与成就/标题摘要完全同源，徽记状态永远和真实剧情进度一致，不会出现两套说法
- 验证：`node --check js/*.js` 全部通过；ESM 全量冒烟 **30 项断言全部通过**——新增 adventureProgress 四项分支（四徽记长度/开局全灰/全达成全绿/仅魔王亮一枚）与状态界面 开局·半程·全达成 三档渲染回归

## v2.7 图鉴未讨伐项报酬参考（体验打磨）
- 【补全】图鉴报酬参考此前只挂在**已讨伐**项下（v1.15），v2.4 加灰色「未讨伐」占位时也一并去掉了参考行——于是「图鉴征服」最需要的恰恰拿不到：未收集的魔物完全查不到「击败它能得多少经验/金币」，值不值得专程去刷只能瞎猜。现在**未讨伐项同样显示参考行**：`→ 击败可得：经验 N · 金币 N（参考）`（灰字跟随占位行走），已讨伐与未讨伐两套信息终于补全
- 复用既有 `monReward()`（本就覆盖全部 11 种：7 基础怪 / 石心魔像 / 三大 Boss），参考值随玩家当前等级实时计算，与真实结算同源——纯显示层改动，只改 `drawCodex()` 一处分支（`rw` 改为无条件计算 + 未讨伐分支补一行绘制），未动任何怪物属性、掉落、经验/金币、成就判定或滚动逻辑
- 验证：`node --check js/*.js` 全部通过；ESM 全量冒烟 **18 项断言全部通过**——新增 未讨伐 7 种/精英/三Boss 报酬参考行绘制、已讨伐参考行回归、空图鉴与全收集绘制、滚动越界钳制、16 场景渲染、遇敌/胜利/存档读档回归

## v2.6 标题画面存档进度摘要（体验打磨）
- 标题画面选中已存档的槽位时，槽位行下方新增一行灰蓝小字进度摘要：`角色名 Lv.N · 💰金币 · 所在地图 · 主线进度 · 成就数`（如 `勇者 Lv.6 ⚡ · 💰500 · 和平村 · ⚔️ 魔王已讨伐 · 成就2/14`）——多存档槽再也不用靠猜「槽2 存的是哪个档」，读档前一目了然；困难模式附 ⚡ 标记
- 进度自动归类：冒险中 / ✅ 支线完成 / ⚔️ 魔王已讨伐 / 🎯 讨伐终焉之神 / ⭐ 真·通关；「按 L 读取当前槽存档」提示相应下移 14px 避让
- 新增纯函数 `slotMeta(s)`（`core.js`）：只读 localStorage + JSON 解析，解析失败/无存档返回 null，不改任何存档/读档逻辑；`ui.js` 的 `drawTitle()` 一处绘制，纯显示层，未动任何数值/玩法
- 验证：`node --check js/*.js` 全部通过；ESM 全量冒烟 **51 项断言全部通过**——新增 slotMeta 九项分支（名称/Lv/金币/地图/进度/成就/难度/空槽/进阶进度腾挪）、标题带/不带存档两种绘制、存档读档往返、全部 14 个场景渲染、遇敌/战斗/技能菜单/逃跑回归

## v2.5 快速旅行目的地提示（体验打磨）
- 快速旅行（`T`）界面上，每张**已解锁**地图下方新增一行灰蓝小字提示：定位 / 推荐等级 / 特色（和平村「新手区·魔物较弱，适合补给与完成支线」、幽暗森林「推荐 Lv.3+ · 强魔物与稀有精英，深处祭坛有魔王」、宝藏洞窟「推荐 Lv.5+ · 魔物更强，中央有终焉水晶」），选目的地时一眼判断当前实力是否合适，避免新开档贸然传进高难地图被秒杀——与既有「信息透明」风格（战斗威胁预警 / 装备对比 / 地图难度曲线）同体系
- 新增纯数据 `MAP_HINT`（`data.js`，文案与 README / H 地图指南一致）；只改 `drawTravel()` 一处绘制，并顺手把面板纵向加大以容纳提示行（400×320 → 400×340，行距 52 → 58）
- 纯显示层改动：未动任何传送判定、解锁条件、怪物属性、掉落、经验/金币或难度缩放；未解锁目的地仍显示「？？？ · 未探索」
- 验证：`node --check js/*.js` 全部通过；ESM 全量冒烟 **14 项断言全部通过**——加载期初始化（G Lv.1 / scene=title）、beginAdventure 开局（金币30/火焰斩/village）、drawWorld / drawTravel（含 MAP_HINT 提示行，半解锁与全解锁两种路径）/ drawStatus / drawCodex / drawHelp / drawBattle 渲染、randomEncounter 生成合法敌人、startBattle 进入战斗、cmdDmg ≥1

## v2.4 图鉴未收集占位（体验打磨）
- 敌人图鉴（`B`）此前只列出**已击败**的魔物——「图鉴征服（收录全部 11 种）」成就缺哪几种完全无迹可寻，只能靠猜。现在固定按 `BESTIARY_TARGET` 全部 **11 种**排列：已讨伐的保持原样（亮色/👿 Boss 紫 + 讨伐数 + 经验金币参考行），未讨伐的以灰色「？名字 + 未讨伐」占位并同样附出没地点指引——一眼看清还差哪几种、该去哪刷
- 顺带修正两处一致性：① 三大 Boss（幽冥魔王/洞窟领主/终焉之神）统一以 👿 前缀 + 紫色高亮（此前洞窟领主/终焉之神因 `isBoss=/魔王/` 判断漏标）；② 累计讨伐统计与滚动提示均改为按全部 11 种计算（防未讨伐项产生 NaN/提示错位）
- 纯显示层改动：只改 `ui.js` 的 `drawCodex()` 一处，未动任何怪物属性、掉落、经验/金币、成就判定或滚动交互；空图鉴（从未击败）仍显示原友好引导页
- 验证：`node --check js/*.js` 全部通过；ESM 全量冒烟 **22 项断言全部通过**——启动初始化、图鉴四态（空/少量/滚动/全收集）、16 场景渲染、遇敌/奖励/真身名归一、存档读档往返

## v2.0 模块化重构（架构）
- **单文件 → ES Modules**：游戏代码从单个 `index.html` 的 `<script>` 拆分为按职责划分的 8 个模块（`js/data|audio|core|world|battle|ui|state|main.js`），数据与逻辑彻底分层，仍零依赖、零构建、离线可玩
- `data.js` 纯数据层（地图/NPC/装备/技能/敌人/剧情/成就/帮助 + `baseStats`/`learnsAt` 等纯函数）；逻辑模块按 成长(`core`)/世界(`world`)/战斗(`battle`)/界面(`ui`) 划分；`main.js` 负责按键分派与启动引导；`audio.js` 封装全部音效/BGM
- **共享状态**：ESM 的 import 绑定只读，无法跨模块给 `let` 重新赋值，故可变单例（`scene`/`G`/`enemy`/`curMap`/`blog`…）统一托管到 `state.js` 的 globalThis 注册表，各模块仍以原始标识符读写，**行为与重构前完全一致**；模块间少量循环依赖均为调用期引用（环安全）
- **启动方式变更**：ESM 在 `file://` 下会被浏览器拦截，新增 `start.command`（macOS 双击）与 `start.sh` 一键启动本地服务器；新增 `package.json`（`type:module`，供命令行工具识别）与 `BACKUP_singlefile_v1.23.html`（重构前单文件回滚保险）
- **验证**：全部 8 个模块通过 `node --check`；新增 ESM 全量冒烟测试（25 项断言：初始化/遇敌分布/地图难度倍率/战斗伤害/击杀结算/传送碰撞/技能菜单绘制）全部通过；服务器 MIME 校验 `.js → text/javascript` 正常
- 纯结构重构：**未改动任何游戏数值、掉落、难度曲线、剧情、成就或交互逻辑**

## v2.1 Boss 战逃跑禁标恢复（显示修复）
- 【修复】v2.0 模块化重构中丢失了 v1.37 的指令栏反馈：Boss 战（主线幽冥魔王 / 洞窟领主 / 终焉之神 / 试炼连战）按 `4` 逃跑会被气场压制、不耗回合，但战斗指令栏仍无条件显示 `[4]逃跑`，与「Boss战无法逃跑」的判定不一致。现在指令栏对 Boss 战在 `[4]逃跑` 右侧叠绘一个**红色 ⛔**（单独红字，与技能菜单「MP 不足 ⛔」反馈风格一致），一眼看清别按 4
- 与 `playerAction()` 的 `flee` 分支判定同源（`isBoss/isTrue/isCaveBoss/isRush` 四类均不可逃），纯显示层，只改 `drawBattle()` 指令栏一处，未动任何怪物属性 / 掉落 / 经验金币 / 难度缩放数值；普通怪与精英「石心魔像」（仍可逃跑）指令栏保持原样
- 验证：`node --check js/*.js` 全部通过 + ESM 全量冒烟 19 项断言（魔王/洞窟领主/终焉之神/试炼连战 指令栏均显 ⛔，普通怪/精英不显；Boss 战按 4 逃跑仍在战斗、日志含「无法逃脱」、回合保留不扣血；存档读档回归）全部通过

## v2.3 敌方等级标定修复（显示修复）
- 【修复】战斗画面敌方名字旁的等级显示不一致：只有主线幽冥魔王写死 `Lv.8`，而洞窟领主（`isCaveBoss`）、隐藏真Boss「终焉之神」（`isTrue`）、试炼连战三名 Boss、「石心魔像」精英，以及 Boss 二段「真身」形态，全部误显示**玩家当前等级**（例如 Lv.1 就撞见终焉之神时它会显示 `Lv.1`，严重误导威胁判断，与 v1.19 威胁预警、v1.29 战力对比的「信息透明」风格相冲突）
- 新增 `enemyLv()` 纯展示函数统一标定：终焉之神 Lv.12 / 幽冥魔王 Lv.8 / 洞窟领主 Lv.7（试炼连战按对应 Boss 同值，真身改名后仍正确）/ 精英石心魔像 Lv=玩家+1 / 普通随机怪随玩家等级渐进；Boss 名颜色判定同步扩展到四类 Boss（紫色），此前只有主线魔王是紫色
- 纯显示层改动：只改 `ui.js` 的 `drawBattle()` 一行 + 新增一个纯函数，未动任何敌人属性、变身机制、经验/金币、掉落或难度缩放数值；随机怪等级仍与玩家等级绑定，曲线不变
- 验证：`node --check js/*.js` 全部通过；ESM 全量冒烟 **27 项断言全部通过**——启动初始化、enemyLv 十项分支（含试炼真身改名后映射）、三地图遇敌生成、Boss/精英/真身/普通四种敌人 `drawBattle()` 渲染、全部 16 场景 `render()` 回归、攻击/技能/防御/蓄力战斗路径、图鉴/成就/存档回归


## v2.2 界面/商店/战斗 三处重构回归修复（修复）
v2.0 模块化重构在“行为与重构前一致”的目标下仍漏了三处，导致多个界面直接崩溃或战斗手感与 v1.37 文档不符，本次一并修复：
- 【修复①】`ui.js` 缺失导入 `ACH_LIST` / `NPCS` / `SFX`：状态界面（`I`）、NPC 对话、通关战绩统计（`drawEnding`）运行时会 `ReferenceError` 崩溃（页面假设能打开，但一按 I / 一对话就白屏）。补上 data.js / audio.js 的导入后三处恢复正常
- 【修复②】商店接线丢失：`openShop()` 只在 `ui.js` 里定义了，入口从未调用——走进杂货铺 `shopList` 一直是空数组，啥都买不了，按 Enter 还会因 `shopList[NaN].act` 崩溃。已在 `world.interact()` 的 SHOP 分支调用 `openShop()`，进店自动填充 8 项商品（实测：玩家面对商店按 Enter → 立即出现 药水/卖蘑菇/4 武器/4 防具/离开）
- 【修复③】Boss 战逃跑误扣回合：v1.37 明确文档化为「按 4 逃跑不扣回合、不掉血、`battleBusy` 直接释放」（其冒烟断言为“不调度 `enemyAct`”），但重构后的 `flee` 分支调用了 `finishEnemy()`（会调度敌方攻击）——按 4 等于站着挨 Boss 白打一回合，可导致直接送死。已恢复：气场压制提示（「本回合行动保留」）后立即释放回合，玩家可马上改出 攻击/技能/防御/蓄力
- 未改动任何怪物属性 / 掉落 / 经验金币 / 难度缩放 / 升级曲线；普通怪逃跑 60% 成功率与失败扣回合逻辑完全保持
- 验证：`node --check js/*.js` 全部通过；ESM 全量冒烟 **36 项断言全部通过**——新增 状态界面(I)/NPC对话/通关战绩渲染、openShop 商品填充与购买路径、进店接线（interact→shop 自动填充 8 项）、Boss 逃跑 battleBusy 立即释放 + 900ms 内不掉血不调度 enemyAct、普通怪逃跑失败仍扣回合被反击（行为保持）、全 16 个场景渲染 + 存档 + main.js 启动引导

## v1.0 基础框架
- 瓦片地图 + 角色移动（WASD/方向键）
- 回合制战斗：攻击/技能/用药/逃跑
- 随机遇敌（史莱姆、野狼、骷髅、哥布林）
- 经验升级、商店/旅馆/喷泉、宝箱
- 通关目标：幽冥魔王

## v1.1 完整化
- 标题画面 + 开场剧情 + 通关/倒下画面 + 尾声
- 双地图（和平村 / 幽暗森林）+ Boss 二阶段「真身」
- 装备系统（4 档武器/防具 + 传说圣光之剑掉落）
- 等级解锁技能（火焰斩→冰霜击→治愈术→雷鸣→陨石术）
- Web Audio 音效（13+ 种）
- 存档/读档（localStorage）

## v1.2 沉浸与收集
- 状态界面（`I`）、敌人图鉴（`B`）、右上角小地图
- NPC + 支线任务（魔法蘑菇）、酿造锅（蘑菇→高级灵药）
- 昼夜循环 + 洞窟雨幕 + 标题星光粒子 + 战斗飘字/技能特效
- 背景音乐（主题乐 / 村庄 / 森林 / 战斗分场景）

## v1.3 深内容
- 第三张地图「宝藏洞窟」+ 洞窟领主打Boss + 隐藏真Boss「终焉之神」
- 精英怪「石心魔像」、成就系统（12+ 项）
- 角色创建（姓名/难度）、困难模式（敌×1.35血等）
- 多存档槽（1/2/3）、H 双页帮助（操作 + 地图指南）

## v1.4 终局与打磨
- 战利品掉落系统（药水/蘑菇/高级灵药/稀有装备）+「幸运眷顾」成就
- 试炼场（Boss Rush）：主线魔王 → 洞窟领主 → 终焉之神 三连战
- 快速旅行（`T`）、商店可售卖蘑菇
- 首次进入世界的新手教程提示
- 大量回归测试 + 语法/运行时校验

## v1.5 战斗手感
- 新增普通攻击「暴击」机制：12% 概率造成 1.8 倍伤害（仅普攻，不动敌人属性/技能平衡）
- 暴击时额外粒子爆发 + 战斗日志标注「（暴击！）」

## v1.6 战斗反馈
- 敌人血条随剩余血量变色（>50% 绿 / 20–50% 黄 / <20% 红），直观感知敌人虚弱程度

## v1.7 状态界面增强
- 状态界面（`I`）预告下一技能的解锁等级（如「📖 下一技能：冰霜击（Lv.3 解锁）」）；全部技能习得后显示「✨ 已习得全部技能」

## v1.8 小地图导航
- 右上角小地图为关键地点补上专属颜色：酿造锅（绿）、NPC（米白）、洞窟领主祭坛（紫）、终焉水晶（金）、试炼碑（青）、村庄入口/洞窟裂缝等传送门（蓝），一眼定位目标

## v1.9 防御指令
- 新增战斗指令 **防御 `[5]`**：本回合受到的伤害减半（并恢复 2 点 MP），战斗日志标注「（被防御格挡！）」；姿态仅在当前回合生效，Boss 重击亦可格挡
- 战斗指令栏 / 帮助页 / README 同步更新按键说明

## v1.10 防御 buff 显示
- 战斗中按下「防御」后，己方 HP/MP 条右侧亮起脉动盾牌图标 + 「防御中 · 减伤50%」文字提示，实时直观反馈本回合的减伤/回 MP 姿态（随动画刷新增强存在感，行动回合自动消失）

## v1.11 技能菜单 MP 提示
- 战斗技能菜单中，MP 不足以施放的技能项直接置灰并标注「⛔」（可用技能保持亮色，治愈术为专属绿色），底部 MP 行追加「灰色 ⛔ = MP 不足」说明，一眼判断当前能放哪个技能，避免猜测施放失败

## v1.12 升级进度可见
- 战斗胜利、未触发升级时，结算提示直接追加「距 Lv.X 升级还需 N 经验」，玩家一眼便能判断还需几场战斗才能升级/解锁技能；升级时仍显示原有等级提升提示（行为不变）

## v1.13 地图难度曲线（数值平衡）
- 随机遇敌的怪物属性不再三张地图一律相同，改为按地图微调：和平村遇敌 HP/攻击降低（约 ×0.9，新手区更友好）、幽暗森林维持标准、宝藏洞窟 HP/攻/防提升（约 ×1.2/×1.15/×1.1）并同步增加经验/金币（×1.15），与 README/地图指南「宝藏洞窟更强魔物」的描述一致
- 只调整 `randomEncounter()` 一处，地图/精英/Boss/掉落概率等行为均不变，符合渐进式难度曲线

## v1.14 世界目标横幅（体验打磨）
- 漫游世界时，画面左上角新增半透明「🎯 任务目标」横幅，实时显示当前主线/支线下一步（找回魔法蘑菇 → 回村领奖 → 讨伐魔王 → 讨伐终焉之神 → 完成），不用打开状态界面也能随时确认该去哪、该做什么
- 将目标文本逻辑抽成 `questObjective()` 函数，状态界面（I）复用同一份逻辑，避免两处文案漂移；横幅仅在 `scene==='world'` 绘制，商店/旅馆/对话框等覆盖界面不受干扰

## v1.15 图鉴报酬可见（体验打磨）
- 敌人图鉴（`B`）中，每个已讨伐魔物下方追加「→ 击败可得：经验 N · 金币 N」参考行，按当前等级实时计算（普通怪/石心魔像/三大 Boss 均覆盖），一眼判断该刷哪只怪更划算
- 将随机遇敌怪物基础模板抽为模块级唯一出处 `MON_BASE`（随机遇敌与图鉴显示共用同一套数值，避免公式漂移）；仅抽模板、不改任何战斗/掉落/平衡数值

## v1.16 防御反击（战斗机制）
- 「防御」指令不再只是一味挨打：防御姿态下若被敌人命中，有一半几率趁隙反击（约 0.7 倍普攻伤害，含飘字与日志「⚔️ 趁隙反击」提示），甚至可能直接把敌人反杀；减伤 50% + 回 2 MP 的原有效果保持不变
- 只改 `enemyAct()` 一处的敌方攻击分支，未动任何怪物属性/掉落/平衡数值；README 防御按键说明同步更新

## v1.17 蓄力指令 + 技能伤害修复（战斗机制 / 平衡修复）
- 新增战斗指令 **蓄力 `[6]`**：消耗一回合凝神蓄力，下一次【攻击】威力 ×2（与暴击 1.8 倍可叠加至 ×3.6），战斗中实时显示「⚡ 蓄力中 · 下击×2」脉动标签（随动画刷新）；蓄力不会因使用技能/药水/防御而被打断，仅在被下一次普攻消耗、成功逃跑或开启新战斗时清除
- 【修复】技能实际伤害未能生效的 bug：`attackMove()` 内部计算伤害时漏乘了技能倍率（原代码只把 `×2.0~×4.2` 写在日志里，实际扣血一直是普攻倍率）。现在把最终伤害值直接传给结算回调，消息与实际扣血一致——火焰斩/冰霜击/雷鸣/陨石术的倍率真正生效
- 只改 `attackMove()` 及其两个调用点（攻击/技能），未动任何敌人属性、掉落或难度缩放；指令栏 / 帮助页 / README 同步更新按键说明

## v1.18 药水反馈打磨（体验打磨）
- 战斗中指令栏实时显示药水余量（`[3]药水🍖×N 🧪×M`），一眼看清还剩几瓶普通药水/高级灵药，不再需要切界面猜
- 满状态（HP/MP 均已满）按药水指令时不再误喝浪费：战斗中提示「✅ 你气满神足，无需用药！」、世界按 F 提示「✅ 状态满满，无需喝药！」，药水/灵药原样保留；残血用药行为不变（仍优先消耗高级灵药）
- 只改 `playerAction()` 用药分支、`usePotion()` 与战斗指令栏绘制三处，未动任何数值/掉落/难度

## v1.19 战斗强度预警（体验打磨）
- 每场战斗开场时评估敌我差距并以战斗日志提示危险程度：遭遇终焉之神等远超实力的敌人提示「⚠️⚠️ 极危」、魔王级提示「⚠️ 强敌」；普通怪按「每击能否打掉过半血 / 是否血厚得打很多回合」实时判定「⚠️ 强敌 / ⚠️ 此敌有些棘手」；新手区史莱姆等练手怪与试炼连战保持不打扰
- 新增 `threatWarn()` 纯展示函数，仅在 `startBattle()` 的战斗开场日志追加提示文本，未动任何怪物属性/掉落/难度数值；低等级乱闯高难区域时一目了然该打还是该跑

## v1.20 技能菜单显示修复（显示修复）
- 【修复】战斗中按 `2` 打开的技能菜单原来只绘制一帧：主循环 `render()` 每帧重绘 `drawBattle()`，下一帧就把菜单面板整块覆盖擦掉，玩家按 `2` 实际上什么面板都看不到（数字键选技能仍暗中生效）。根因：`drawBattle()`/`render()` 都不检查 `skillMenuOpen`。现在在 `drawBattle()` 末尾加 `if(skillMenuOpen) drawSkillMenu()` 覆盖层钩子，菜单随主循环每帧绘制、持续可见
- 顺手修复排版：技能面板加大，使「当前 MP / 灰色 ⛔ = MP 不足 / [数字键]选择 [Esc]取消」说明行收进面板内部（原来画在面板外的半空处漂浮）；`openSkillMenu()` 改为先绘战斗底图
- 只改绘制层三处（`drawBattle()` / `drawSkillMenu()` / `openSkillMenu()`），未动任何技能数值、MP 消耗、解锁等级；低 MP 置灰 ⛔ 提示经浏览器实测正常

## v1.21 遇敌渐进曲线（数值平衡）
- 随机遇敌的怪物不再三张地图一律均等抽取：改为**随等级平滑渐进的权重曲线**——
  - 新手期（Lv1）在和平村只会遇到 史莱姆/哥布林/野狼/骷髅兵/毒蛇，**不会**撞上石魔像/树精这类对初始属性极不友好的强敌（旧版 Lv1 就可能被石魔像两下秒杀）；
  - Lv2 起骷髅兵/毒蛇逐步常见，Lv3 起树精/石魔像登场，Lv6+ 后强敌占比反超弱怪并随等级继续走高（取代旧版「Lv6 后从 0 直接跳到 35% 抽强敌」的生硬跳变，曲线更顺滑）；
  - 洞窟 7% 稀有精英「石心魔像」、村庄 ×0.9 / 洞窟 ×1.2 等地图难度倍率、经验/金币、Boss/掉落全部保持不变。
- 只改 `randomEncounter()` 一处的怪物抽取逻辑，未动任何怪物属性数值、掉落概率、成就或地图倍率

## v1.22 传送门/村民碰撞修复（修复）
- 【修复】传送门（GATE）、出口（EXIT）、村民（NPC）、酿造锅（BREW）原本没有任何碰撞体积：主角可以直接「踩进村民身体里」、直接穿过传送门——找不到幽暗森林入口的困惑，很可能正是因为这个（走了上去而不是面对面按 Enter）。根因：`SOLID` 集合只含 树/岩石/水，与注释「GATE/EXIT 不可穿过」矛盾
- 把 `TY.GATE / TY.EXIT / TY.NPC / TY.BREW` 加入 `SOLID`，传送门与村民现在会挡住去路，走到面前面向它按 Enter 即可交互；商店/旅馆/喷泉/宝箱/Boss祭坛仍保持踩上去触发与原有交互方式不变
- 帮助页操作说明补充「对话/确认（传送门/村民需面对面）」提示；只改 `SOLID` 集合一行 + 帮助一行，未动任何数值/地图/脚本；碰撞回归已加入冒烟测试（GATE/NPC/BREW/EXIT 阻挡 + 草地不误伤）全过

## v1.23 传送门踩踏触发（交互手感优化）
- 传送门（GATE）与出口（EXIT）由「面对面按 Enter」改为**踩上去自动进入**下一张地图：和平村 → 幽暗森林 → 宝藏洞窟的往返全部踩踩即走，不再需要精确站定面向按 Enter
- 具体：`SOLID` 中去掉 GATE/EXIT（保留 村民/酿造锅 碰撞）；`onStep()` 顶部新增 GATE/EXIT 分支（优先于遇敌判定，进门不误触战斗）；抽出 `useGate()`/`useExit()` 供踩踏与按 Enter 两条路径复用，逻辑不漂移
- 村庄入口门的「魔王未讨伐」封印限制保留（击败魔王后踩上门只提示不折返）；冒烟测试改为验证 踩传送门进幽暗森林 / 踩出口回村 / 魔王已倒门失效 / 村民与酿造锅仍阻挡 / 草地可通行，全部通过

## v1.24 低血量危险警示（体验打磨）
- 新增低血量警告：HP 降至 30% 及以下时，顶部 HUD 的 HP 数字与血条**变红并脉冲闪烁**，一眼可辨血量告急，及时喝药/防御/逃跑
- 纯视觉层改动：仅在 `renderHUD()` 内根据 `hp/hpMax≤0.30` 切换 `danger`/`low` 两个 CSS class，配 `dangerPulse` 关键帧动画，不影响任何数值、遇敌、掉落或战斗判定
- 仅改 CSS 三行 + `renderHUD()` 三行，未动战斗/地图/数值；冒烟测试新增低血量开关验证（25/100 → 开，80/100 → 关）通过

## v1.25 终章战绩回顾（体验打磨）
- 通关尾声画面（打倒魔王 → Enter 观看尾声）在剧情诗行下方追加一行「战绩 · 累计讨伐 N 只 · 成就 M/N · 金币 N」总览，通关那一瞬回顾整段冒险的讨伐与收集成果
- 纯显示层改动：仅改 `drawEnding()` 一处（面板略加高、诗句行距微调、新增战绩行），未动任何剧情文本、存档、数值或判定；G 字段均已在游戏中长期存在（bestiary/ach/gold），无新增状态

## v1.26 图鉴真身名规范化（成就/图鉴修复）
- 【修复】Boss 二阶段「现出真身」与试炼连战的改名机制会把真身名（如 `终焉之神·祸乱形态`、`幽冥魔王·真身`）直接写入击败记录：终焉之神通常被杀时已变名，图鉴永远收录不到基础名「终焉之神」，导致「图鉴征服（收录全部 11 种魔物）」成就往往无法达成（只有一回合秒杀 Boss、躲过变身才能解锁）；且图鉴里出现难看的真身名，报酬参考行也不显示（`monReward` 不认识 `终焉之神·祸乱形态`）
- 新增 `canonicalName()` 辅助函数，把二阶段/连战的真身名映射回基础名（覆盖 `·真身` 两种写法与 `·祸乱形态`）；`winBattle()` 计录图鉴改为使用规范化名——图鉴始终收录「幽冥魔王 / 洞窟领主 / 终焉之神」，成就判定随之诚实可达成，报酬行也正常显示
- 只改「新增一个映射函数 + `winBattle()` 一行计录」，未动任何敌人属性、变身机制、掉落、经验/金币数值或成就条件；冒烟测试新增验证（名称映射 5 项 + 真Boss 胜利计录基础名 + 「图鉴征服」成就可解锁 + 渲染路径回归）全过

## v1.27 HUD 经验进度条（体验打磨）
- 顶部 HUD 新增 **EXP 经验进度条**：第 1 行加入 `EXP 当前值/所需值` 文本 + 绿色进度条，随时一眼看到距下次升级还差多少经验（此前经验只在按 `I` 打开的状态界面里才有）
- 纯显示层改动：CSS 加 `.bar.xp` 一条渐变样式 + HTML 加 `s-xp`/`s-xpbar` 两个元素 + `renderHUD()` 加两行（数值与状态界面共用 `G.xp`/`G.xpNext` 同一数据源，`Math.max(1,xpNext)` 防除零），未动任何升级曲线、经验数值、战斗或存档逻辑
- 冒烟测试新增 EXP 栏断言（35/40→`87.5%`、0→`0%`、满→`100%`）与三张地图全路径渲染回归，全部通过

## v1.28 商店可负担性显示（体验打磨）
- 杂货商店中买不起的商品现在直接**置灰并标注「不足」**：金币不够买（武器/防具/药水）或药水已满（99）时，商品名变灰、价格变红并附「（不足）」，底部加一行图例「灰色 = 金币不足/药水已满」；买得起与「离开商店」等项保持原样
- 与技能菜单「灰色 ⛔ = MP 不足」（v1.11）同款模式的即刻反馈：不按下去买错（原回显「金币不足」），看列表一眼就知道哪些买得起
- 纯显示层改动：只改 `drawShop()` 一处的绘制分支，未动任何商品价格、买卖逻辑、库存或数值；冒烟测试覆盖 低金币 / 高金币 / 药水已满 三条绘制路径

---

## v1.29 战斗战力对比（体验打磨）
- 战斗中敌方 HP 条正下方新增**敌我双方 攻/防 一览**（`我方 攻X 防Y　⚔　敌方 攻X 防Y`，居中浅色一行）：以前敌方数值完全不可见只能靠猜，现在一眼判断该强攻、防御减伤还是逃跑走人；困难模式敌方数值已含 ×1.15/×1.12 缩放，与真实结算一致
- 纯显示层改动：只改 `drawBattle()` 内一行绘制，未动任何怪物属性/难度缩放/掉落/平衡数值；冒烟测试新增战力行断言（普通怪显示 + 困难模式缩放值一致）全过

## v1.30 战利品预览（体验打磨）
- 战斗画面新增**战利品预览行**（`战利品预览：经验 +N 金币 +N`，居中亮绿一行，位于战力对比行下方）：开战即见本场击败可得的经验/金币，与 v1.19 威胁预警互补——既要看清危不危险，也要知道值不值得打；试炼连战追加「（试炼通关另有奖励）」说明
- 数值与实际结算同源 `enemy.xp`/`enemy.gold`（含地图难度倍率 ×1.15、困难模式不变），不新增任何状态、不碰任何掉落/平衡逻辑
- 纯显示层改动：只改 `drawBattle()` 内一行绘制；冒烟测试新增战利品预览断言（经验/金币字段有效 + 战斗全流程回归 18 项）全过

## v1.31 商店装备对比（体验打磨）
- 杂货店的武器/防具不再只是「攻+5 / 防+4」的绝对值，而是直接标注与**当前装备**的差值：升级项（如「⚔️ 铁剑 (攻+5) ▲攻+3」）绿色高亮、降级项（如「▼攻-3」）按普通配色显示，一眼判断值不值得买，避免误购降级装备
- 底部图例同步更新为「绿色▲=更强升级 灰色=买不起 · ↑↓选择 Enter购买 Esc离开」
- 纯显示层改动：只改 `openShop()`（商品标签加对比）与 `drawShop()`（颜色分支 + 图例）两处，未动任何商品价格、买卖逻辑、库存或数值；冒烟测试新增装备对比断言（木剑→铁剑 ▲攻+3 / 购剑后反向 ▼ 降级 + 三条绘制路径回归 + 战斗全流程）全部通过

## v1.32 图鉴滚动浏览（修复 + 体验打磨）
- 【修复】敌人图鉴最多只显示前 10 种魔物，而全收集目标有 **11 种**——第 11 种永远藏在「还有 N 种魔物」里看不到，往往正是达成「图鉴征服」成就所缺的最后一种。现在图鉴支持 **↑↓ / W S 滚动浏览**：超过一页时底部实时提示「↑↓ 滚动浏览（还有 N 种）」，11 种全收集也能逐一看完
- 新增图鉴滚动偏移 `codexScroll` 状态 + `drawCodex()` 分页与双向越界钳制（不断按住上滚/列表变短都不会越界显示空白）+ 图鉴按键分支追加 ↑↓ 滚动；未动任何魔物属性、掉落、成就数值
- 冒烟测试新增：全收集 11 种渲染、上滚越界钳制、下滚至末页、列表变短钳制、空图鉴渲染，连同战斗全流程等共 26 项全部通过

## v1.33 技能伤害/恢复预览（体验打磨）
- 战斗技能菜单每条技能后新增**期望效果预览**：攻击技显示 `≈N伤`（对当前敌人按真实结算公式 `cmdDmg` 预估，含 ±10% 浮动）、治疗技显示 `+NHP`（按当前 HP 上限的 0.55 计算）——此前只标「攻x2.0」只能靠心算估伤，现在看一眼就知道值不值得花这 MP；MP 不足仍照常置灰 ⛔
- 与战力对比 / 战利品预览 / 装备对比同款思路：选技能前信息透明，纯显示层改动，只改 `drawSkillMenu()` 一处渲染分支，未动任何技能伤害公式、MP 消耗、技能解锁或平衡数值
- 冒烟测试新增：攻击技 ≈ 伤预览、治疗技 +HP 预览、MP 不足置灰分支，连同战斗全流程等共验证 15 项全部通过

## v1.34 Boss 变身线标记（体验打磨）
- 会二段变身的强敌（主线幽冥魔王 / 隐藏终焉之神 / 试炼连战三Boss）在血量**过半时会现出真身**并回血强攻，此前毫无预告。现在战斗血条 50% 处画一道**金色「二段变身线」记号**（含文字标注），一眼预知变身时机，提前决定补给、防御或爆发输出；Boss 变身（phase2）后记号变淡表示「已过」
- 纯显示层改动：只改 `drawBattle()` 一处绘制分支（新增 5 行），未动任何 Boss 属性、变身机制、经验/金币、掉落或难度数值；普通怪 / 精英怪不会触发该标记
- 冒烟测试新增：Boss 变身线绘制（phase2 前后两路径）+ 普通怪不绘制断言，连同三地图渲染 / 全部覆盖界面 / 战斗胜利全流程 / 存档读档共 9 项全部通过

## v1.35 图鉴出没地点指引（体验打磨）
- 敌人图鉴（`B`）中每个魔物名字后新增**出没地点指引**（灰蓝小字）：7 种基础魔物标注「草丛随机遇敌」，精英「石心魔像」标注「幽暗森林·稀有精英」，三大 Boss 分别标注「幽暗森林祭坛 / 宝藏洞窟深处 / 宝藏洞窟·终焉水晶」——配合 v1.15 奖励参考行，收集 11 种魔物不再靠猜该去哪刷
- 新增 `whereFind()` 纯展示函数（列个官方位置映射表），只改 `drawCodex()` 一处绘制，未动任何魔物属性、掉落、成就或数值

## v1.36 Boss 战不可逃跑（战斗机制 / 平衡）
- 「逃跑」不再对 BOSS 级敌人生效：主线幽冥魔王 / 洞窟领主 / 隐藏终焉之神 / 试炼场三连战的战斗中按 `4` 逃跑，会直接被气场压制（日志提示「⚠️ XX 的气场压制着你，无法逃脱！」），必须战斗到底——消除「打不过就溜回旅馆回满血再来」的无限拉扯；阵亡仍有 R 重开 / 对 Boss 按 B 重整旗鼓兜底
- 普通怪遭遇战逃跑行为完全不变（仍约 60% 概率成功），精英「石心魔像」仍可正常逃跑
- 只改 `playerAction()` 的 `flee` 分支一处条件，未动任何怪物属性 / 掉落 / 经验金币 / 难度缩放数值；战斗说明行与 README 同步标注「Boss战无法逃跑」
- 冒烟测试新增：四类 Boss 战逃跑均被阻止（场景仍为 battle、日志含「无法逃脱」）+ 普通怪逃跑成功率/失败率回归（40 次抽样 25 成功 15 失败）+ 渲染/结算全路径回归共 25 项全部通过

## v1.37 Boss 战逃跑「陷阱反馈」打磨（体验打磨）
- 上版 v1.36 让 Boss 战无法逃跑，但按 `4` 被拒后仍会**白白消耗本回合并挨打**——纯陷阱反馈。现在 Boss（主线魔王/洞窟领主/终焉之神/试炼连战）战按 `4` 逃跑：直接提示「⚠️ XX 的气场压制着你，无法逃脱！（本回合行动保留）」，**不扣回合、不掉血**，玩家可立即换用攻击/技能/防御/蓄力等指令继续战斗
- 同时战斗指令栏对 Boss 战把 `[4]逃跑` 置灰并标 **`[4]逃跑⛔`**（与技能 MP 不足的 ⛔ 风格一致），一眼看出别按 4；普通怪遭遇战仍显示 `[4]逃跑`、保持原 60% 成功率与失败扣回合逻辑完全不变
- 纯反馈层改动：只改 `playerAction()` 的 `flee` 分支 + `drawBattle()` 指令栏一处渲染，未动任何 Boss 属性、变身、经验/金币、掉落或难度数值；README 战斗说明同步更新
- 冒烟测试新增：Boss 战逃跑后 回合保留（不调度 enemyAct、不掉血、battleBusy 释放、仍在战斗场景）+ 日志文案断言 + 命令栏 Boss 显示 ⛔ / 普通怪不显示 ⛔，连同 普通怪逃跑失败仍扣回合、战斗胜利全流程、三地图与全部覆盖界面渲染 共 13 项全部通过

## 技术要点
- 单文件、零依赖、离线可玩；Canvas 程序化绘制全部图块/角色/敌人
- 音乐/音效用 Web Audio 实时合成（步进音序器）
- 存档存于 `localStorage`（`jrpg_save1/2/3`）
- 每次改动均做全路径功能回归 + `new Function` 语法校验
