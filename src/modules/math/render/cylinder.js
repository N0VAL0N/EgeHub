// ================================================================
//  МОДУЛЬ: ЦИЛИНДР
//  th_087 — определение, th_088 — площадь, th_095 — объём
// ================================================================

import { drawLabel, drawSegment, drawDashed } from './utils.js';

function drawPoint(ctx, x, y, label, offsetX = 15, offsetY = -10) {
  ctx.save();
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
  drawLabel(ctx, x + offsetX, y + offsetY, label);
}

export function drawCylinder(ctx, params) {
  const {
    center,
    radius,
    height,
    highlight = [],
    show_axis = false,
    show_radius = false,
    show_height = false,
    show_lateral_area = false,
    show_volume = false,
    show_centers = false,
    ...rest
  } = params;

  const [cx, cy] = center;
  const r = radius;
  const h = height;
  const topY = cy - h / 2;
  const bottomY = cy + h / 2;

  // ================================================================
  //  1. РИСУЕМ ЦИЛИНДР
  // ================================================================

  // ---- верхний эллипс ----
  ctx.beginPath();
  ctx.ellipse(cx, topY, r, 20, 0, 0, Math.PI * 2);
  ctx.stroke();

  // ---- нижний эллипс ----
  ctx.beginPath();
  ctx.ellipse(cx, bottomY, r, 20, 0, 0, Math.PI * 2);
  ctx.stroke();

  // ---- образующие ----
  drawSegment(ctx, cx - r, topY, cx - r, bottomY);
  drawSegment(ctx, cx + r, topY, cx + r, bottomY);

  // ================================================================
  //  2. ОСЬ (th_087)
  // ================================================================
  if (show_axis) {
    const o1x = cx;
    const o1y = topY;
    const ox = cx;
    const oy = bottomY;

    drawDashed(ctx, o1x, o1y, ox, oy, '#f00');

    if (show_centers) {
      drawPoint(ctx, o1x, o1y, 'O₁', 10, -5);
      drawPoint(ctx, ox, oy, 'O', 10, 10);
    }
  }

  // ================================================================
  //  3. РАДИУС (th_087)
  // ================================================================
  if (show_radius) {
    const startX = cx;
    const startY = topY;
    const endX = cx - r;
    const endY = topY;

    drawSegment(ctx, startX, startY, endX, endY, '#0a0');
    drawPoint(ctx, endX, endY, 'A', -15, -10);
    drawLabel(ctx, (startX + endX) / 2, startY + 15, 'r');
  }

  // ================================================================
  //  4. ВЫСОТА (th_087)
  // ================================================================
  if (show_height) {
    const xOff = cx - r - 15;
    drawLabel(ctx, xOff, topY - 10, 'A');
    drawLabel(ctx, xOff - 10, bottomY + 10, 'B');
    drawPoint(ctx, cx - r, bottomY, '', 0, 0);
  }

  // ================================================================
  //  5. ПЛОЩАДЬ (th_088) — развёртка + формулы
  // ================================================================
  if (show_lateral_area) {
    // ---- рисуем цилиндр (как в th_087) ----
    // верхний эллипс
    ctx.beginPath();
    ctx.ellipse(cx, topY, r, 20, 0, 0, Math.PI * 2);
    ctx.stroke();

    // нижний эллипс
    ctx.beginPath();
    ctx.ellipse(cx, bottomY, r, 20, 0, 0, Math.PI * 2);
    ctx.stroke();

    // образующие
    drawSegment(ctx, cx - r, topY, cx - r, bottomY);
    drawSegment(ctx, cx + r, topY, cx + r, bottomY);

    // ось OO₁
    drawDashed(ctx, cx, topY, cx, bottomY, '#f00');
    drawPoint(ctx, cx, topY, 'O₁', 10, -5);
    drawPoint(ctx, cx, bottomY, 'O', 10, 10);

    // радиус r (от O₁ влево)
    drawSegment(ctx, cx, topY, cx - r, topY, '#0a0');
    drawPoint(ctx, cx - r, topY, 'A', -15, -10);
    drawLabel(ctx, (cx + (cx - r)) / 2, topY + 15, 'r');

    // высота AB
    const xOff = cx - r - 15;
    drawLabel(ctx, xOff, topY - 10, 'A');
    drawLabel(ctx, xOff - 10, bottomY + 10, 'B');
    drawPoint(ctx, cx - r, bottomY, '', 0, 0);

    // ---- ФОРМУЛЫ ПОД ЦИЛИНДРОМ ----
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('S_бок = 2π · BO₁ · AB', cx, bottomY + 50);
    ctx.fillText('S_полн = 2π · BO₁ · (BO₁ + AB)', cx, bottomY + 75);
    ctx.restore();
  }

  // ================================================================
  //  6. ОБЪЁМ (th_095) — развёртка + формула
  // ================================================================
  // ---- ОБЪЁМ (th_095) ----
  if (show_volume) {
    // ---- рисуем цилиндр (как в th_087) ----
    // верхний эллипс
    ctx.beginPath();
    ctx.ellipse(cx, topY, r, 20, 0, 0, Math.PI * 2);
    ctx.stroke();

    // нижний эллипс
    ctx.beginPath();
    ctx.ellipse(cx, bottomY, r, 20, 0, 0, Math.PI * 2);
    ctx.stroke();

    // образующие
    drawSegment(ctx, cx - r, topY, cx - r, bottomY);
    drawSegment(ctx, cx + r, topY, cx + r, bottomY);

    // ось OO₁
    drawDashed(ctx, cx, topY, cx, bottomY, '#f00');
    drawPoint(ctx, cx, topY, 'O₁', 10, -5);
    drawPoint(ctx, cx, bottomY, 'O', 10, 10);

    // радиус r (от O₁ влево)
    drawSegment(ctx, cx, topY, cx - r, topY, '#0a0');
    drawPoint(ctx, cx - r, topY, 'A', -15, -10);
    drawLabel(ctx, (cx + (cx - r)) / 2, topY + 15, 'r');

    // высота AB
    const xOff = cx - r - 15;
    drawLabel(ctx, xOff, topY - 10, 'A');
    drawLabel(ctx, xOff - 10, bottomY + 10, 'B');
    drawPoint(ctx, cx - r, bottomY, '', 0, 0);

    // ---- ФОРМУЛА ПОД ЦИЛИНДРОМ ----
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('V = π · BO₁² · AB', cx, bottomY + 50);
    ctx.restore();
  }

  // ================================================================
  //  HIGHLIGHT (заглушки)
  // ================================================================
  if (highlight.includes('cylinder')) {
    // уже нарисовано
  }
  if (highlight.includes('lateral_area')) {
    // уже нарисовано
  }
  if (highlight.includes('volume')) {
    // уже нарисовано
  }
}