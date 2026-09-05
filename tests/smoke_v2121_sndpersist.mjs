// v21.21 专项冒烟：音频开关（M 静音）偏好持久化——此前 S.SND 只活在内存（M 静音后刷新页面即回到
// 有声，HUD 有 🔊/🔇 常驻指示却留不住偏好）；本次由 data.js SND_KEY/sndPrefToState/sndPrefToString
// 单一数据源 + audio.js loadSndPref/saveSndPref（仅有的两个读写方）+ main.js 启动恢复/M 键落盘组成。
// 本冒烟：数据层编码纯函数全路径 + localStorage 桩下 load/save 真实读写 S.SND + main.js/hud.js/
// state.js 源码守护 + README 口径守护 + v2120 守护去硬化守护（承 v21.7 惯例：件数写死必然脱节）。
import { GAME_VERSION, SND_KEY, sndPrefToState, sndPrefToString } from '../js/data.js';
import { S } from '../js/state.js';
import { loadSndPref, saveSndPref } from '../js/audio.js';

// localStorage 桩（承 tests/smoke.mjs 先例：先行挂到 globalThis 再调函数，模块顶层无副作用）
const mem = {};
globalThis.localStorage = {
  getItem: (k) => (Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null),
  setItem: (k, v) => { mem[k] = String(v); },
  removeItem: (k) => { delete mem[k]; },
};

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.21 音频开关持久化冒烟 —');

// —— 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.20 ——
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.20', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 20)));

// —— 数据层：存储键 + 纯编码函数（单一数据源口径）——
ok('SND_KEY 已导出且为合法存储键（jrpg_ 命名族）', typeof SND_KEY === 'string' && /^jrpg_[a-z0-9_]+$/.test(SND_KEY), SND_KEY);
ok('sndPrefToState 导出为纯函数', typeof sndPrefToState === 'function');
ok('sndPrefToString 导出为纯函数', typeof sndPrefToString === 'function');
ok("sndPrefToState('0')===false（静音）", sndPrefToState('0') === false);
ok("sndPrefToState('1')===true（开声）", sndPrefToState('1') === true);
ok('读不到/未知值按默认开（null/undefined/空串/乱值）',
  sndPrefToState(null) === true && sndPrefToState(undefined) === true && sndPrefToState('') === true && sndPrefToState('x') === true);
ok('sndPrefToString(true)===\'1\' / (false)===\'0\'', sndPrefToString(true) === '1' && sndPrefToString(false) === '0');
ok('往返一致（编码⇄解码互逆）', sndPrefToState(sndPrefToString(true)) === true && sndPrefToState(sndPrefToString(false)) === false);

// —— 运行时（localStorage 桩）：loadSndPref/saveSndPref 真实读写 S.SND ——
ok('S.SND 初始默认开（state.js SND:true 口径）', S.SND === true);
loadSndPref();
ok('无存储值时 loadSndPref 保持默认开', S.SND === true);
mem[SND_KEY] = '0';
loadSndPref();
ok('存储 \'0\' 时 loadSndPref 恢复为静音', S.SND === false);
S.SND = true; saveSndPref();
ok('开声时 saveSndPref 落盘 \'1\'', mem[SND_KEY] === '1');
S.SND = false; saveSndPref();
ok('静音时 saveSndPref 落盘 \'0\'', mem[SND_KEY] === '0');
mem[SND_KEY] = '1'; loadSndPref();
ok('存储 \'1\' 时 loadSndPref 恢复为开声', S.SND === true);
mem[SND_KEY] = 'x'; loadSndPref();
ok('未知存储值 loadSndPref 按默认开（不崩不静音）', S.SND === true);
// 桩移除后读写必须静默降级（try/catch 包裹，绝不影响游戏运行）
globalThis.localStorage = undefined;
S.SND = true; loadSndPref();
ok('localStorage 不可用时 loadSndPref 静默降级（不抛错）', S.SND === true);
saveSndPref();
ok('localStorage 不可用时 saveSndPref 静默降级（不抛错）', true);
globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

// —— 源码守护：main.js 启动恢复与 M 键落盘接入 ——
const mainSrc = await (async () => {
  try { return (await import('node:fs')).readFileSync(new URL('../js/main.js', import.meta.url), 'utf8'); }
  catch { return ''; }
})();
ok('main.js 已从 audio.js 导入 loadSndPref/saveSndPref',
  mainSrc.includes('loadSndPref') && mainSrc.includes('saveSndPref') && mainSrc.includes("from './audio.js'"));
ok('main.js 启动先恢复偏好、再挂键盘监听（顺序正确）',
  mainSrc.indexOf('loadSndPref();') > 0 && mainSrc.indexOf('loadSndPref();') < mainSrc.indexOf("window.addEventListener"));
ok('M 键切换仍为 S.SND = !S.SND 且切换后即落盘',
  mainSrc.includes('S.SND = !S.SND') && mainSrc.indexOf('saveSndPref();') > mainSrc.indexOf('S.SND = !S.SND'));

// —— 源码守护：state.js 默认值 / hud.js 常驻指示未受影响 ——
const stateSrc = await (async () => {
  try { return (await import('node:fs')).readFileSync(new URL('../js/state.js', import.meta.url), 'utf8'); }
  catch { return ''; }
})();
ok('state.js SND 默认仍 true（新玩家默认有声）', stateSrc.includes('SND: true'));
const hudSrc = await (async () => {
  try { return (await import('node:fs')).readFileSync(new URL('../js/view/hud.js', import.meta.url), 'utf8'); }
  catch { return ''; }
})();
ok('hud.js 常驻 🔊/🔇 指示原样（s-snd 与 S.SND 派生未动）',
  hudSrc.includes("set('s-snd'") && hudSrc.includes("S.SND ? '🔊' : '🔇'"));

// —— README 同步守护（tests 树收录 smoke_v2121_sndpersist + 冒烟十七件套口径、十六件套清除）——
const readmeOk = await (async () => {
  try {
    const fs = await import('node:fs');
    const txt = fs.readFileSync(new URL('../README.md', import.meta.url), 'utf8');
    return txt.includes('smoke_v2121_sndpersist') && txt.includes('十七件套') && !txt.includes('十六件套')
      && txt.includes('静音偏好记忆');
  } catch { return false; }
})();
ok('README 已同步（tests 树收录 smoke_v2121_sndpersist + 冒烟十七件套口径、十六件套清除 + 静音偏好记录）', readmeOk);

// —— 上一版（v2120）README 守护已去硬化（承 v21.7 惯例：件数随版本递增，数字写死必然脱节）——
const v2120Ok = await (async () => {
  try {
    const fs = await import('node:fs');
    const txt = fs.readFileSync(new URL('./smoke_v2120_helprush.mjs', import.meta.url), 'utf8');
    return txt.includes("txt.includes('冒烟') && txt.includes('件套')")
      && !txt.includes("txt.includes('十六件套')") && !txt.includes('十六件套');
  } catch { return false; }
})();
ok('smoke_v2120 的 README 守护表达式已去硬化（不再以「十六件套」断言件数）', v2120Ok);

console.log(`\n${n - failed}/${n} 通过${failed ? '（失败 ' + failed + '）' : ''}`);
process.exit(failed ? 1 : 0);
