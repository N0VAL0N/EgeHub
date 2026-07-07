// ================================================================
//  МОДУЛЬ: КОНУС
//  th_089 — определение
//  th_090 — площадь (S_бок, S_полн)
//  th_098 — объём
//  th_153 — усечённый конус
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

export function drawCone(ctx, params) {
  const {
    center,
    radius,
    height,
    highlight = [],
    show_axis = false,
    show_radius = false,
    show_height = false,
    show_vertex = false,
    show_generator = false,
    show_lateral_area = false,
    show_volume = false,
    frustum = false,
    radius2 = null,
    ...rest
  } = params;

  const [cx, cy] = center;
  const r = radius;
  const h = height;
  const topY = cy - h / 2 - 20;
  const bottomY = cy + h / 2;

  // ================================================================
  //  1. УСЕЧЁННЫЙ КОНУС (th_153)
  // ================================================================
    if (frustum) {
      const r2 = radius2 || r * 0.5;
      const topY2 = topY + 30;

      // основания
      ctx.beginPath();
      ctx.ellipse(cx, bottomY, r, 20, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(cx, topY2, r2, 15, 0, 0, Math.PI * 2);
      ctx.stroke();

      // образующие (только две линии)
      drawSegment(ctx, cx - r, bottomY, cx - r2, topY2);
      drawSegment(ctx, cx + r, bottomY, cx + r2, topY2);

      // ось (пунктир)
      drawDashed(ctx, cx, topY2, cx, bottomY, '#f00');

      // ---- центры оснований (исправлено: влево) ----
      drawPoint(ctx, cx, topY2, 'O₁', -20, 5);   // влево, чуть вниз
      drawPoint(ctx, cx, bottomY, 'O', -25, 10); // влево

      // ---- радиусы (справа) ----
      // нижний радиус: O -> A (вправо)
      drawPoint(ctx, cx + r, bottomY, 'A', 15, 10);
      drawSegment(ctx, cx, bottomY, cx + r, bottomY, '#0a0');
      drawLabel(ctx, cx + r / 2, bottomY + 18, 'r₂');

      // верхний радиус: O₁ -> B (вправо)
      drawPoint(ctx, cx + r2, topY2, 'B', 15, -10);
      drawSegment(ctx, cx, topY2, cx + r2, topY2, '#0a0');
      drawLabel(ctx, cx + r2 / 2, topY2 - 15, 'r₁');

      // ---- ФОРМУЛЫ ПОД КАРТИНКОЙ (с обозначениями с чертежа) ----
      ctx.save();
      ctx.fillStyle = '#000';
      ctx.font = '18px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      ctx.fillText('S_бок = π(O₁B + OA) · AB', cx, bottomY + 50);
      ctx.fillText('S_полн = π(O₁B + OA) · AB + π(O₁B² + OA²)', cx, bottomY + 75);
      ctx.fillText('V = (π · SO · (O₁B² + OA² + O₁B·OA)) / 3', cx, bottomY + 100);

      ctx.restore();
      return;
    }

  // ================================================================
  //  2. ОБЫЧНЫЙ КОНУС
  // ================================================================

  // основание
  ctx.beginPath();
  ctx.ellipse(cx, bottomY, r, 20, 0, 0, Math.PI * 2);
  ctx.stroke();

  const vertexX = cx;
  const vertexY = topY;

  // образующие (сплошные)
  drawSegment(ctx, cx - r, bottomY, vertexX, vertexY);
  drawSegment(ctx, cx + r, bottomY, vertexX, vertexY);

  // вершина S
  if (show_vertex || show_lateral_area || show_volume) {
    drawPoint(ctx, vertexX, vertexY, 'S', 10, -15);
  }

  // ось SO (пунктир)
  if (show_axis || show_lateral_area || show_volume) {
    drawDashed(ctx, vertexX, vertexY, cx, bottomY, '#f00');
  }

  // радиус OA
  if (show_radius || show_lateral_area || show_volume) {
    drawSegment(ctx, cx, bottomY, cx + r, bottomY, '#0a0');
    drawPoint(ctx, cx + r, bottomY, 'A', 15, 10);
    drawLabel(ctx, cx + r / 2, bottomY + 18, 'r');
  }

  // образующая SA (сплошная для площади/объёма, пунктир для определения)
  const isAreaOrVolume = show_lateral_area || show_volume;
  if (show_generator || isAreaOrVolume) {
    if (isAreaOrVolume) {
      drawSegment(ctx, vertexX, vertexY, cx + r, bottomY, '#f80');
    } else {
      drawDashed(ctx, vertexX, vertexY, cx + r, bottomY, '#f80');
    }
    // подпись 'l' НЕ СТАВИМ
  }

  // центр основания O (сдвинут влево)
  drawPoint(ctx, cx, bottomY, 'O', -20, 10);

  // ---- ПЛОЩАДЬ (th_090) ----
  if (show_lateral_area) {
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('S_бок = π · OA · SA', cx, bottomY + 50);
    ctx.fillText('S_полн = π · OA · (SA + OA)', cx, bottomY + 75);
    ctx.restore();
  }

  // ---- ОБЪЁМ (th_098) ----
  if (show_volume) {
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('V = (π · OA² · SO) / 3', cx, bottomY + 50);
    ctx.restore();
  }

  // ---- HIGHLIGHT (заглушки) ----
  if (highlight.includes('cone')) {}
  if (highlight.includes('lateral_area')) {}
  if (highlight.includes('volume')) {}
  if (highlight.includes('frustum_formulas')) {}
}