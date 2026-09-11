// v21.90 专项冒烟：启动脚本口径统一与默认仅本机绑定（体验打磨·口径一致，承 v21.29-32/v21.38-43
// 「同一功能所有入口口径一致」主线）：v2.0 起游戏更名「潮灯记」，但 start.sh/start.command 的注释
// 与启动回执仍写着「勇者传说」——玩家每次双击启动看到的名字与游戏内标题不符（旧名唯一残留入口）；
// 且两脚本的 python3 -m http.server 默认绑定 0.0.0.0（局域网可访问）。现：两脚本注释/回执统一为
// 「潮灯记」、显式 `--bind 127.0.0.1` 仅本机可访问（README 手动命令同口径），improve-plan.md 留档
// 标题同改。本冒烟守护：版本锚点、start.sh/start.command/improve-plan.md 源级落位（旧名零残留）、
// README/package.json 同步、姊妹件套 pin（v2189..v2176 八十六件套 / v2189..v2179 GAME_VERSION
// v21.90）随新现实更新。
import { GAME_VERSION } from '../js/data.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.90 启动脚本口径与本地绑定冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.89 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.89', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 90)), GAME_VERSION);

const fs = await import('node:fs');
const read = (p) => { try { return fs.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
const dataSrc = read('../js/data.js');
const shSrc = read('../start.sh');
const cmdSrc = read('../start.command');
const planSrc = read('../improve-plan.md');
const readme = read('../README.md');
const pkg = read('../package.json');
const changelog = read('../CHANGELOG.md');

ok('data.js 含 v21.90 版本注释', dataSrc.includes('v21.90 启动脚本口径统一与默认仅本机绑定'));
ok('data.js GAME_VERSION 字面量已更新为 v21.90', dataSrc.includes("const GAME_VERSION = 'v22.15';"));

// —— start.sh 源级落位 ——
ok('start.sh 注释统一为「潮灯记 · 一键启动」', shSrc.includes('潮灯记 · 一键启动'));
ok('start.sh 显式 --bind 127.0.0.1（默认仅本机可访问）', shSrc.includes('python3 -m http.server --bind 127.0.0.1'));
ok('start.sh 启动回执统一为「潮灯记 · 已启动」', shSrc.includes('潮灯记 · 已启动'));
ok('start.sh 旧名「勇者传说」零残留', !shSrc.includes('勇者传说'));

// —— start.command 源级落位 ——
ok('start.command 注释统一为「潮灯记 · 一键启动」', cmdSrc.includes('潮灯记 · 一键启动'));
ok('start.command 显式 --bind 127.0.0.1（默认仅本机可访问）', cmdSrc.includes('python3 -m http.server --bind 127.0.0.1'));
ok('start.command 启动回执统一为「潮灯记 · 已启动」', cmdSrc.includes('潮灯记 · 已启动'));
ok('start.command 旧名「勇者传说」零残留', !cmdSrc.includes('勇者传说'));

// —— improve-plan.md 留档标题 ——
ok('improve-plan.md 标题统一为「潮灯记 · 改进计划」', planSrc.includes('# 潮灯记 · 改进计划'));
ok('improve-plan.md 旧名「勇者传说」零残留', !planSrc.includes('勇者传说'));

// —— README / package.json 同步 ——
ok('README 手动命令含 --bind 127.0.0.1 8000（与一键脚本同口径）', readme.includes('python3 -m http.server --bind 127.0.0.1 8000'));
ok('README tests 树收录 smoke_v2190_launch', readme.includes('smoke_v2190_launch'));
ok('README 件套口径为一百一十一件套（一百一十件套清除）',
  readme.includes('冒烟一百一十一件套（一百一十件套清除）') && !readme.includes('冒烟八十五件套（八十四件套清除）'));
ok('README 含 v21.90 守护描述', readme.includes('v21.90 起含启动脚本口径守护'));
ok('package.json 已收录 smoke_v2190_launch（npm test 串跑第 86 份）',
  pkg.includes('smoke_v2190_launch.mjs') && /smoke_v2189_visitedlegacy\.mjs && node tests\/smoke_v2190_launch\.mjs/.test(pkg));
ok('CHANGELOG 含 v21.90 条目（启动脚本口径统一与默认仅本机绑定）',
  changelog.includes('## v21.90 '));

// —— 姊妹件套 pin 复查（v21.7 惯例：本版冒烟守护姊妹随新现实更新）——
const suite86 = ['smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs', 'smoke_v2187_endingrecap.mjs',
  'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs', 'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs',
  'smoke_v2182_winrecap.mjs', 'smoke_v2181_helpquickcast.mjs', 'smoke_v2180_grain.mjs',
  'smoke_v2179_titlerecap.mjs', 'smoke_v2178_codexseen.mjs', 'smoke_v2177_elites.mjs',
  'smoke_v2176_allchests.mjs'];
for (const nm of suite86) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 README 件套 pin 已随新现实更新为一百一十一件套（一百一十件套清除）`,
    src.includes('一百一十一件套（一百一十件套清除）'));
}
for (const nm of ['smoke_v2189_visitedlegacy.mjs', 'smoke_v2188_wander.mjs', 'smoke_v2187_endingrecap.mjs', 'smoke_v2186_brew.mjs', 'smoke_v2185_steleclear.mjs', 'smoke_v2184_lvl12.mjs', 'smoke_v2183_mpsip.mjs', 'smoke_v2182_winrecap.mjs', 'smoke_v2181_helpquickcast.mjs', 'smoke_v2179_titlerecap.mjs']) {
  const src = read(`../tests/${nm}`);
  ok(`${nm} 的 GAME_VERSION 字面量 pin 已随新现实更新为 v21.90`,
    src.includes("const GAME_VERSION = 'v22.15';"));
}

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
