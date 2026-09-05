// v21.10 专项冒烟：boxMsg 消息队列——同帧/近帧多条消息不再互相覆盖，按序逐条显示（仓库常驻版）
import { S } from '../js/state.js';
import { GAME_VERSION } from '../js/data.js';
import { boxMsg } from '../js/view/hud.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

console.log('— v21.10 消息队列冒烟 —');

// 版本锚点（v21.7 去硬化惯例）：格式合法 + 已越过 v21.9，随版本递增免维护
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.9', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 9)));

// DOM 桩（elId 在无 document 时返回一次性空对象，无法断言排队时序——这里提供持久桩）
const cls = new Set();
const fakeMsg = {
  textContent: '',
  classList: {
    add: (c) => cls.add(c),
    remove: (c) => cls.delete(c),
    contains: (c) => cls.has(c),
  },
};
globalThis.document = { getElementById: (id) => (id === 'msg' ? fakeMsg : null) };

function shown() { return cls.has('show'); }

async function run() {
  // 用例 1：单条消息——立即显示，到点后隐藏（既有行为逐字保留）
  boxMsg('第一枪', 40);
  ok('单条消息立即显示', fakeMsg.textContent === '第一枪' && shown());
  await sleep(70);
  ok('单条消息到点隐藏', !shown());

  // 用例 2：三连发排队——A 先显示，到点接续 B、再 C，最后隐藏（一条不丢）
  boxMsg('A', 50); boxMsg('B', 50); boxMsg('C', 50);
  ok('连发时显示的是第一条 A', fakeMsg.textContent === 'A' && shown());
  await sleep(80);
  ok('第一条到点后接续 B', fakeMsg.textContent === 'B');
  await sleep(70);
  ok('第二条到点后接续 C', fakeMsg.textContent === 'C');
  await sleep(70);
  ok('全部放完后隐藏', !shown());

  // 用例 3：同文本连发只刷新时长、不重复排队（drawStory 每帧「按 Enter 继续」不刷屏）
  boxMsg('同文', 40); boxMsg('同文', 40);
  ok('同文本仍单条显示', fakeMsg.textContent === '同文' && shown());
  await sleep(95);
  ok('同文本不二次排队（约 80ms 后已隐藏）', !shown());

  // 用例 4：不同文本在显示中 → 排队；重复文本只刷新时长不重复入队（正片：胜利→掉落→记忆碎片）
  boxMsg('P', 40); boxMsg('Q', 40); boxMsg('P', 40);
  ok('队列中重复文本去重且保留顺序（P 显示中）', fakeMsg.textContent === 'P');
  await sleep(60);
  ok('接续 Q（同文本刷新不抢占队列）', fakeMsg.textContent === 'Q');
  await sleep(60);
  ok('队尾无重复 P（约 120ms 时已隐藏）', !shown());

  // 用例 4b：瞬时消息（ms<=0）显示期间，正片消息可立即抢占（talkNext 接委托反馈不被 2.5s 阻塞）
  boxMsg('按 Enter 继续', 0);
  boxMsg('接受了「灯长的委托」！', 40);
  ok('正片消息抢占瞬时提示', fakeMsg.textContent === '接受了「灯长的委托」！');
  await sleep(70);
  ok('抢占消息到点隐藏', !shown());

  // 用例 5：ms<=0 瞬时/清理消息维持原「立即替换」行为、不进队列（💀 击中闪字 / 清空 / 逐帧提示）
  boxMsg('急', 30); boxMsg('💀', 0);
  ok('ms=0 立即替换当前显示', fakeMsg.textContent === '💀');
  boxMsg('', 0);
  ok('空串清空消息（drawTalk 清理语义保留）', fakeMsg.textContent === '');

  // 用例 6：队列不跨场景残留——清空后新消息直接显示
  boxMsg('收尾', 40);
  ok('空闲时新消息立即显示', fakeMsg.textContent === '收尾' && shown());
  await sleep(70);
  ok('收尾消息到点隐藏', !shown());

  clearTimeout(S.msgTO);
  console.log(`${n - failed}/${n} 通过`);
  if (failed > 0) process.exit(1);
}

run();
