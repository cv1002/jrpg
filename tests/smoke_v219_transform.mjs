// v21.9 专项冒烟：变身（现出真身）回血战报追加「敌方 HP X/Y」——v20.1 回血反馈家族最后一只黑盒收口（仓库常驻版）
import { GAME_VERSION, PHASE2_AT, PHASE2_HEAL_PCT } from '../js/data.js';
import { S } from '../js/state.js';
import { enemyAct } from '../js/enemyAI.js';

let n = 0, failed = 0;
function ok(name, cond, extra) {
  n++;
  if (cond) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, extra || ''); }
}

console.log('— v21.9 变身回血反馈冒烟 —');

// v21.7 修复（版本锚点去硬化）：单调断言——格式合法 + 已越过 v21.8，随版本递增免维护
const _vm = (s) => { const m = /^v(\d+)\.(\d+)$/.exec(String(s || '')); return m ? [Number(m[1]), Number(m[2])] : null; };
const _gv = _vm(GAME_VERSION);
ok('GAME_VERSION 格式合法且已越过 v21.8', !!_gv && (_gv[0] > 21 || (_gv[0] === 21 && _gv[1] >= 8)));

// 复用 data.js 常量（单一数据源）：变身阈值/回血比例与 enemyAI 读同一份
ok('PHASE2_AT 仍为 0.5', PHASE2_AT === 0.5);
ok('PHASE2_HEAL_PCT 仍为 0.15', PHASE2_HEAL_PCT === 0.15);

const noFx = { addFx() {}, winBattle() {}, loseBattle() {} };

function setupEnemy(hp, hpMax, phase2) {
  return {
    name: '幽冥魔王', hpMax, hp,
    atk: 5, def: 2,
    phased: false, skipNext: false, forbid: null, burn: 0, shield: 0,
    phase2: phase2 === undefined ? { at: 0.5, name: '幽冥魔王·真身', color: '#6a2ad9', atk: 7, def: 3, heal: 0.15 } : phase2,
  };
}
function setupHero(extra) {
  return Object.assign({
    name: '余烬', hp: 100, hpMax: 100, mp: 20, mpMax: 20,
    atkMax: 10, defMax: 10, defending: false, charge: false, poison: 0, hurt: 0,
  }, extra || {});
}

// 场景 A：半血之下触发变身（hp=40 < 100×0.5），heal=round(100×0.15)=15 → 结算后 55
S.scene = 'battle';
S.G = setupHero();
S.blog = [];
S.enemy = setupEnemy(40, 100);
enemyAct(noFx);
const aBlog = S.blog.join('\n');
ok('变身触发：进入真身', S.enemy.phased === true && S.enemy.name === '幽冥魔王·真身');
ok('变身数值应用：攻+7 防+3', S.enemy.atk === 12 && S.enemy.def === 5);
ok('变身回血结算：hp=55', S.enemy.hp === 55);
ok('战报含恢复量 15', aBlog.includes('HP 恢复 15！'));
ok('战报追加敌方当前 HP（结算后 55/100）', aBlog.includes('（敌方 HP 55/100）'));
ok('战报格式与 v20.1 同源同式（恢复量后紧跟 HP 读数）', aBlog.includes('HP 恢复 15！（敌方 HP 55/100）'));

// 场景 B：回血后超上限被钳制（自定义 heal=60% → 40+60=100 恰好满；再用 90 血验证 min 路径无法触发的边界放下）
S.scene = 'battle';
S.G = setupHero();
S.blog = [];
S.enemy = setupEnemy(40, 100, { at: 0.5, name: '测试·真身', color: '#fff', atk: 0, def: 0, heal: 0.6 });
enemyAct(noFx);
const bBlog = S.blog.join('\n');
ok('超上限回血钳制到 hpMax（40+60→100）', S.enemy.hp === 100);
ok('钳制后战报读钳制值（100/100）', bBlog.includes('（敌方 HP 100/100）'));

// 场景 C：终焉之神式封印治愈（forbid:['heal']）——标注保留且仍在 HP 读数之后
S.scene = 'battle';
S.G = setupHero();
S.blog = [];
S.enemy = setupEnemy(40, 100, { at: 0.5, name: '祸乱·真身', color: '#fff', atk: 0, def: 0, heal: 0.15, forbid: ['heal'] });
enemyAct(noFx);
const cBlog = S.blog.join('\n');
ok('封印治愈战报保留标注', cBlog.includes('治愈被封印！'));
ok('HP 读数在标注之前（先报血后报封印）', cBlog.indexOf('（敌方 HP 55/100）') < cBlog.indexOf('治愈被封印！'));

// 场景 D：未到阈值不变身（hp=60 ≥ 50）——既有行为逐字保留，走普通攻击分支
S.scene = 'battle';
S.G = setupHero();
S.blog = [];
S.enemy = setupEnemy(60, 100);
enemyAct(noFx);
const dBlog = S.blog.join('\n');
ok('未到阈值不变身', S.enemy.phased === false);
ok('未到阈值战报无变身文案', !dBlog.includes('现出真身'));
ok('未到阈值走攻击分支', dBlog.includes('攻击你'));

// 场景 E：普通回血（暗影回血）战报不受影响（v20.1 逐字保留）
S.scene = 'battle';
S.G = setupHero();
S.blog = [];
S.enemy = setupEnemy(20, 100, null);
S.enemy.acts = [{ type: 'heal', w: 100, pct: 0.5 }];
enemyAct(noFx);
const eBlog = S.blog.join('\n');
ok('暗影回血战报保留 v20.1 格式', eBlog.includes('使出【暗影回血】，恢复 50 HP（敌方 HP 70/100）'));

console.log(`${n - failed}/${n} 通过`);
if (failed > 0) process.exit(1);
