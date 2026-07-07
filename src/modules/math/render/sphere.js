// ================================================================
//  МОДУЛЬ: СФЕРА
//  th_091 — определение
//  th_092 — площадь
//  th_100 — объём
//  th_101 — шаровой сегмент
//  th_154 — шаровой слой
//  th_155 — шаровой сектор
//  th_185 — касательная плоскость
// ================================================================

import { drawLabel, drawSegment, drawDashed } from './utils.js';

function drawPoint(ctx, x, y, label, offsetX = 15, offsetY = -10) {
  ctx.save();
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
  drawLabel(ctx, x + offsetX, y + offsetY, label);
}

export function drawSphere(ctx, params) {
  const {
    center,
    radius,
    highlight = [],
    show_center = false,
    show_radius = false,
    show_area = false,
    show_volume = false,
    show_segment = false,
    show_tangent_plane = false,
    show_layer = false,
    show_sector = false,
    show_height = false,
    ...rest
  } = params;

  const [cx, cy] = center;
  const r = radius;

  // ---- основная окружность ----
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx.stroke();

  // ---- эллипсы для объёма ----
  ctx.save();
  ctx.strokeStyle = '#888';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.ellipse(cx, cy, r, 20, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx, cy, 20, r, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // ---- центр ----
  if (show_center) {
    drawPoint(ctx, cx, cy, 'O', -5, -5);
  }

  // ---- радиус ----
  if (show_radius) {
    drawSegment(ctx, cx, cy, cx + r, cy, '#f00');
    drawLabel(ctx, cx + r/2, cy - 12, 'R');
  }

  // ================================================================
  //  th_092 — ПЛОЩАДЬ
  // ================================================================
  if (show_area) {
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('S = 4πR²', cx, cy + r + 30);
    ctx.restore();
  }

  // ================================================================
  //  th_100 — ОБЪЁМ
  // ================================================================
  if (show_volume) {
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('V = ⁴⁄₃ πR³', cx, cy + r + 30);
    ctx.restore();
  }

  // ================================================================
  //  th_101 — ШАРОВОЙ СЕГМЕНТ
  // ================================================================
  if (show_segment) {
    // заливка сегмента (верхняя часть)
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 0, 255, 0.15)';
    ctx.fill();
    ctx.strokeStyle = '#00f';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // высота сегмента — AB (от нижней точки до верхней точки сечения)
    const topY = cy - r;
    const bottomY = cy;
    drawSegment(ctx, cx, topY, cx, bottomY, '#0a0');
    drawPoint(ctx, cx, topY, 'A', 15, -10);
    drawPoint(ctx, cx, bottomY, 'B', 5, 20);
    drawLabel(ctx, cx + 0, (topY + bottomY) / 2, 'h');

    // радиус R уже нарисован

    // формула под картинкой
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('V = πh²(R − ⅓h)', cx, cy + r + 30);
    ctx.restore();
  }

  // ================================================================
//  th_154 — ШАРОВОЙ СЛОЙ
// ================================================================
if (show_layer) {
  // ---- координаты плоскостей ----
  const y1 = cy - r * 0.3; // верхняя плоскость
  const y2 = cy + r * 0.3; // нижняя плоскость

  // ---- радиусы оснований слоя ----
  const r1 = Math.sqrt(r * r - (y1 - cy) * (y1 - cy));
  const r2 = Math.sqrt(r * r - (y2 - cy) * (y2 - cy));

  // ---- заливка слоя ----
  ctx.save();
  ctx.fillStyle = 'rgba(0, 200, 0, 0.15)';
  ctx.beginPath();
  ctx.moveTo(cx - r1, y1);
  ctx.lineTo(cx + r1, y1);
  ctx.lineTo(cx + r2, y2);
  ctx.lineTo(cx - r2, y2);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#0a0';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // ---- подписи радиусов оснований ----
  drawSegment(ctx, cx, y1, cx + r1, y1, '#f80');
  drawLabel(ctx, cx + r1/2, y1 - 12, 'r₁');

  drawSegment(ctx, cx, y2, cx + r2, y2, '#f80');
  drawLabel(ctx, cx + r2/2, y2 + 15, 'r₂');

  // ---- высоты отсечённых сегментов (h₁ и h₂) ----
  const topY = cy - r;
  const bottomY = cy + r;

  // h₁ — от верхней точки сферы до верхней плоскости
  drawSegment(ctx, cx, topY, cx, y1, '#f00');
  drawLabel(ctx, cx - 15, (topY + y1) / 2, 'h₁');

  // h₂ — от нижней точки сферы до нижней плоскости
  drawSegment(ctx, cx, bottomY, cx, y2, '#f00');
  drawLabel(ctx, cx - 15, (bottomY + y2) / 2, 'h₂');

  // ---- высота слоя h (расстояние между плоскостями) ----
  drawSegment(ctx, cx + r1 + 20, y1, cx + r1 + 20, y2, '#00f');
  drawLabel(ctx, cx + r1 + 35, (y1 + y2) / 2, 'h');

  // ---- центр O и радиус R ----
  drawPoint(ctx, cx, cy, 'O', -5, -10);
  drawSegment(ctx, cx, cy, cx + r, cy, '#00f');
  drawLabel(ctx, cx + r/2, cy - 0, 'R');

  // ---- формула под картинкой ----
  ctx.save();
  ctx.fillStyle = '#000';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('V = (πh/6) · (3r₁² + 3r₂² + h²)', cx, cy + r + 30);
  ctx.restore();
}

  // ================================================================
  //  th_155 — ШАРОВОЙ СЕКТОР
  // ================================================================
  if (show_sector) {
    const angle = 0.6;
    const x1 = cx + r * Math.sin(angle);
    const y1 = cy - r * Math.cos(angle);
    const x2 = cx - r * Math.sin(angle);
    const y2 = cy - r * Math.cos(angle);

    // ---- заливка сектора ----
    ctx.save();
    ctx.fillStyle = 'rgba(255, 0, 0, 0.12)';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x1, y1);
    ctx.arc(cx, cy, r, -Math.PI/2 - angle, -Math.PI/2 + angle);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#f00';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // ---- высота h (от полюса A до основания B) ----
    const topY = cy - r;
    const baseY = cy - r * Math.cos(angle);

    drawSegment(ctx, cx, topY, cx, baseY, '#0a0');
    
    // ---- буквы (сдвинуты) ----
    drawPoint(ctx, cx, topY, 'A', -5, -5);   // A — выше (было 3, стало -5)
    drawPoint(ctx, cx, baseY, 'B', 3, 20);   // B — ниже (было 5, стало 10)
    drawPoint(ctx, x1, y1, 'C', 15, 10);
    drawPoint(ctx, x2, y2, 'D', -25, 10);    // D — левее (было -15, стало -25)

    // ---- центр O (спущен вниз) ----
    drawPoint(ctx, cx, cy, 'O', 5, 10);      // O — ниже (было -10, стало 5)

    // ---- диаметр (ось вращения) — только линия, без подписи ----
    const bottomY = cy + r;
    drawDashed(ctx, cx, topY - 10, cx, bottomY + 10, '#f80');

    // ---- радиус R (от O до C) ----
    drawSegment(ctx, cx, cy, x1, y1, '#00f');

    // ---- пунктирный треугольник OCD ----
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 0, 255, 0.3)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    // ---- подпись под картинкой ----
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('Круговой сектор OCD вращается вокруг диаметра', cx, cy + r + 30);
    ctx.restore();

    // ---- формула ----
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('V = ²⁄₃ πR²h', cx, cy + r + 55);
    ctx.fillText('OC — радиус шара, AB — высота сегмента', cx, cy + r + 80);
    ctx.restore();
  }

  // ================================================================
  //  th_185 — КАСАТЕЛЬНАЯ ПЛОСКОСТЬ
  // ================================================================
  if (show_tangent_plane) {
    // ---- точка касания (справа) ----
    const tx = cx + r;
    const ty = cy;

    // ---- касательная плоскость (вертикальная линия) ----
    ctx.save();
    ctx.strokeStyle = '#f80';
    ctx.lineWidth = 2;
    const len = 80;
    ctx.beginPath();
    ctx.moveTo(tx, ty - len);
    ctx.lineTo(tx, ty + len);
    ctx.stroke();
    ctx.restore();

    // ---- точка касания P (справа) ----
    drawPoint(ctx, tx, ty, 'P', 15, 10);

    // ---- прямой угол (квадратик) ----
    ctx.save();
    ctx.strokeStyle = '#f00';
    ctx.lineWidth = 1.5;
    const s = 12;
    ctx.beginPath();
    ctx.moveTo(tx - s, ty);
    ctx.lineTo(tx - s, ty + s);
    ctx.lineTo(tx, ty + s);
    ctx.stroke();
    ctx.restore();

    // ---- свойство под картинкой ----
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('Касательная плоскость ⊥ радиусу в точке касания', cx, cy + r + 30);
    ctx.restore();
  }
}