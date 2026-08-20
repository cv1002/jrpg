// ============================================================
// view/canvas.js —— Canvas 句柄与基础绘制原语（Node 冒烟可 stub）
// ============================================================
import { T } from '../data.js';
import { bind } from '../bind.js';

function stubCtx() {
  const noop = () => {};
  const g = { addColorStop: noop };
  return {
    fillRect: noop, strokeRect: noop, clearRect: noop, fillText: noop,
    beginPath: noop, closePath: noop, moveTo: noop, lineTo: noop, rect: noop, clip: noop, arc: noop,
    arcTo: noop, ellipse: noop, quadraticCurveTo: noop, fill: noop, stroke: noop, save: noop, restore: noop,
    translate: noop, scale: noop, rotate: noop, drawImage: noop, setTransform: noop,
    measureText: (t) => ({ width: String(t || '').length * 8 }),
    createLinearGradient: () => g, createRadialGradient: () => g,
    fillStyle: '#000', strokeStyle: '#000', font: '14px sans-serif',
    textAlign: 'left', textBaseline: 'alphabetic', globalAlpha: 1,
    lineWidth: 1, shadowColor: '', shadowBlur: 0,
  };
}

export const VW = 640;
export const VH = 480;

function stubCanvas() {
  const ctx = stubCtx();
  return { width: VW, height: VH, getContext: () => ctx };
}

const el = (typeof document !== 'undefined' && document.getElementById) ? document.getElementById('game') : null;
const raw = el || stubCanvas();
export const CTX = raw.getContext('2d') || stubCtx();

function wrapLogical(canvas) {
  return new Proxy(canvas, {
    get(target, prop) {
      if (prop === 'width') return VW;
      if (prop === 'height') return VH;
      const v = target[prop];
      return typeof v === 'function' ? v.bind(target) : v;
    },
  });
}

export const CV = el ? wrapLogical(el) : raw;

function currentDpr() {
  if (typeof window === 'undefined' || !window.devicePixelRatio) return 1;
  return Math.max(1, Math.min(3, window.devicePixelRatio));
}

/** 按设备像素比拉高画布 backing store，逻辑坐标仍是 640×480，文字不再被 pixelated 拉伸。 */
export function fitCanvas() {
  if (!el) return;
  const dpr = currentDpr();
  const bw = Math.round(VW * dpr);
  const bh = Math.round(VH * dpr);
  if (el.width !== bw || el.height !== bh) {
    el.width = bw;
    el.height = bh;
    el.style.width = VW + 'px';
    el.style.height = VH + 'px';
  }
  CTX.setTransform(dpr, 0, 0, dpr, 0, 0);
  CTX.imageSmoothingEnabled = false;
  if ('mozImageSmoothingEnabled' in CTX) CTX.mozImageSmoothingEnabled = false;
}

CTX.imageSmoothingEnabled = false;
if ('mozImageSmoothingEnabled' in CTX) CTX.mozImageSmoothingEnabled = false;
fitCanvas();
bind.CV = CV;

export function tileCanvas(fn) {
  if (typeof document === 'undefined' || !document.createElement) {
    const t = stubCanvas();
    t.width = T;
    t.height = T;
    try { fn(t.getContext('2d')); } catch (e) {}
    return t;
  }
  const t = document.createElement('canvas');
  t.width = T;
  t.height = T;
  fn(t.getContext('2d'));
  return t;
}

export function rr(x, y, w, h, r) {
  const C = CTX;
  C.beginPath();
  C.moveTo(x + r, y);
  C.arcTo(x + w, y, x + w, y + h, r);
  C.arcTo(x + w, y + h, x, y + h, r);
  C.arcTo(x, y + h, x, y, r);
  C.arcTo(x, y, x + w, y, r);
  C.closePath();
}

export function panel(x, y, w, h, title) {
  CTX.fillStyle = 'rgba(10,16,24,.94)';
  rr(x, y, w, h, 10);
  CTX.fill();
  CTX.strokeStyle = '#3a5670';
  CTX.lineWidth = 2;
  rr(x, y, w, h, 10);
  CTX.stroke();
  if (title) {
    CTX.fillStyle = '#ffd24a';
    CTX.font = 'bold 16px sans-serif';
    CTX.textAlign = 'center';
    CTX.fillText(title, x + w / 2, y + 26);
  }
}

export function text(t, x, y, size = '14px', color = '#e8eef1', align = 'left') {
  CTX.fillStyle = color;
  CTX.font = size + ' sans-serif';
  CTX.textAlign = align;
  CTX.fillText(t, x, y);
}

export function hpbar(x, y, w, cur, max, color) {
  CTX.fillStyle = '#111820';
  rr(x, y, w, 10, 5);
  CTX.fill();
  CTX.fillStyle = color;
  rr(x, y, Math.max(0, w * (cur / Math.max(1, max))), 10, 5);
  CTX.fill();
  CTX.strokeStyle = '#000';
  CTX.lineWidth = 1;
  rr(x, y, w, 10, 5);
  CTX.stroke();
  text(`${Math.max(0, Math.round(cur))}/${max}`, x + w / 2, y + 8, 'bold 9px', '#fff', 'center');
}

export function elId(id) {
  if (typeof document !== 'undefined' && document.getElementById) {
    const n = document.getElementById(id);
    if (n) return n;
  }
  return { textContent: '', style: {}, classList: { toggle() {}, add() {}, remove() {} }, parentElement: { classList: { toggle() {} } } };
}

export function fmtTime(s) {
  s = Math.max(0, Math.floor(s || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor(s % 3600 / 60);
  const ss = s % 60;
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(ss).padStart(2, '0');
}
