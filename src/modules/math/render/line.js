// ================================================================
//  МОДУЛЬ: ПРЯМАЯ / ОТРЕЗОК / ПАРАЛЛЕЛЬНЫЕ / ПЕРПЕНДИКУЛЯРЫ
// ================================================================

import { drawLabel, drawSegment, drawDashed, drawArrow } from './utils.js';

function drawPoint(ctx, x, y, label, offsetX = 15, offsetY = -10) {
  ctx.save();
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
  drawLabel(ctx, x + offsetX, y + offsetY, label);
}

export function drawLine(ctx, params) {
  const {
    points,
    labels = [],
    highlight = [],
    parallel = false,
    parallel_lines = false,
    point = null,
    show_perpendicular = false,
    show_perpendicular_bisector = false,
    show_perpendicular_from_point = false,
    show_locus_points = false,
    parallel_lines_count = 3,
    ...rest
  } = params;

  const [p1, p2] = points;

  // ================================================================
  //  th_179 — ТРАНЗИТИВНОСТЬ ПАРАЛЛЕЛЬНОСТИ
  // ================================================================
  if (parallel_lines && typeof parallel_lines === 'number') {
    const count = parallel_lines_count || 3;
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    const len = Math.hypot(dx, dy);
    if (len > 0) {
      const nx = -dy / len;
      const ny = dx / len;
      const step = 35;
      const angleOffset = 0.3;
      for (let i = 0; i < count; i++) {
        const offset = (i - (count - 1) / 2) * step;
        const x1 = p1[0] + offset * nx + 20 * i * Math.cos(angleOffset);
        const y1 = p1[1] + offset * ny + 20 * i * Math.sin(angleOffset);
        const x2 = p2[0] + offset * nx + 20 * i * Math.cos(angleOffset);
        const y2 = p2[1] + offset * ny + 20 * i * Math.sin(angleOffset);
        const color = i === 0 ? '#000' : i === 1 ? '#00f' : '#f00';
        drawSegment(ctx, x1, y1, x2, y2, color);
        const label = i === 0 ? 'a' : i === 1 ? 'b' : 'c';
        drawLabel(ctx, x2 + 20, y2 - 10, label);
      }
      ctx.save();
      ctx.fillStyle = '#000';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('a ∥ b, b ∥ c ⇒ a ∥ c', ctx.canvas.width / 2, 380);
      ctx.restore();
    }
    return;
  }

  // ================================================================
  //  th_022 — ПАРАЛЛЕЛЬНЫЕ ПРЯМЫЕ (a и b)
  // ================================================================
  if (parallel && !parallel_lines && !show_perpendicular) {
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    const len = Math.hypot(dx, dy);
    if (len > 0) {
      const nx = -dy / len;
      const ny = dx / len;
      const offset = 40;
      drawSegment(ctx, p1[0], p1[1], p2[0], p2[1], '#000');
      drawLabel(ctx, p2[0] + 20, p2[1] - 10, 'a');
      const x1 = p1[0] + offset * nx;
      const y1 = p1[1] + offset * ny;
      const x2 = p2[0] + offset * nx;
      const y2 = p2[1] + offset * ny;
      drawSegment(ctx, x1, y1, x2, y2, '#00f');
      drawLabel(ctx, x2 + 20, y2 - 10, 'b');
      ctx.save();
      ctx.fillStyle = '#000';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('a ∥ b', ctx.canvas.width / 2, 380);
      ctx.restore();
    }
    return;
  }

  // ================================================================
  //  th_024 — АКСИОМА ПАРАЛЛЕЛЬНЫХ
  // ================================================================
  if (point && !show_perpendicular && !show_perpendicular_from_point && !parallel) {
    const a1 = [100, 200];
    const a2 = [400, 200];
    drawSegment(ctx, a1[0], a1[1], a2[0], a2[1], '#000');
    drawLabel(ctx, a2[0] + 20, a2[1] - 10, 'a');
    const mX = 250;
    const mY = 80;
    drawPoint(ctx, mX, mY, 'M');
    const b1 = [mX - 150, mY];
    const b2 = [mX + 150, mY];
    drawSegment(ctx, b1[0], b1[1], b2[0], b2[1], '#00f');
    drawLabel(ctx, b2[0] + 20, b2[1] - 10, 'b');
    // только одна подпись внизу
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('b ∥ a', ctx.canvas.width / 2, 380);
    ctx.restore();
    return;
  }

  // ================================================================
  //  th_178 — ПЕРПЕНДИКУЛЯРНОСТЬ ДВУХ ПАРАЛЛЕЛЬНЫХ К ПЛОСКОСТИ
  // ================================================================
  if (show_perpendicular && parallel) {
    const alpha = [
      [100, 220],
      [400, 220],
      [360, 140],
      [60, 140]
    ];
    ctx.save();
    ctx.fillStyle = 'rgba(200, 200, 255, 0.12)';
    ctx.strokeStyle = 'rgba(100, 100, 200, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(alpha[0][0], alpha[0][1]);
    ctx.lineTo(alpha[1][0], alpha[1][1]);
    ctx.lineTo(alpha[2][0], alpha[2][1]);
    ctx.lineTo(alpha[3][0], alpha[3][1]);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    drawLabel(ctx, (alpha[0][0] + alpha[1][0] + alpha[2][0] + alpha[3][0]) / 4,
                  (alpha[0][1] + alpha[1][1] + alpha[2][1] + alpha[3][1]) / 4, 'α');

    // ---- прямая a (сверху вниз, с штриховкой под плоскостью) ----
    const aTop = [180, 60];
    const aMid = [180, 180]; // точка пересечения с плоскостью
    const aBottom = [180, 260];
    // часть над плоскостью (сплошная)
    drawSegment(ctx, aTop[0], aTop[1], aMid[0], aMid[1], '#000');
    // часть под плоскостью (пунктир)
    drawDashed(ctx, aMid[0], aMid[1], aBottom[0], aBottom[1], '#000');
    drawLabel(ctx, aTop[0] + 15, aTop[1] - 10, 'a');

    // ---- прямая b (параллельна a, с штриховкой под плоскостью) ----
    const bTop = [300, 80];
    const bMid = [300, 185];
    const bBottom = [300, 260];
    drawSegment(ctx, bTop[0], bTop[1], bMid[0], bMid[1], '#00f');
    drawDashed(ctx, bMid[0], bMid[1], bBottom[0], bBottom[1], '#00f');
    drawLabel(ctx, bTop[0] + 15, bTop[1] - 10, 'b');

    // ---- пояснение под картинкой ----
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('a ∥ b, a ⊥ α ⇒ b ⊥ α', ctx.canvas.width / 2, 380);
    ctx.restore();
    return;
  }

  // ================================================================
  //  th_189 — СЕРЕДИННЫЙ ПЕРПЕНДИКУЛЯР КАК ГМТ
  // ================================================================
  if (show_perpendicular_bisector) {
    const midX = (p1[0] + p2[0]) / 2;
    const midY = (p1[1] + p2[1]) / 2;
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    const len = Math.hypot(dx, dy);
    if (len > 0) {
      const nx = -dy / len;
      const ny = dx / len;
      const ext = 120;
      drawSegment(ctx, p1[0], p1[1], p2[0], p2[1], '#000');
      drawPoint(ctx, p1[0], p1[1], 'A');
      drawPoint(ctx, p2[0], p2[1], 'B');
      drawDashed(ctx, midX - ext * nx, midY - ext * ny, midX + ext * nx, midY + ext * ny, '#0a0');
      if (show_locus_points) {
        for (let i = -3; i <= 3; i++) {
          if (i === 0) continue;
          const dist = i * 20;
          const x = midX + dist * nx;
          const y = midY + dist * ny;
          drawPoint(ctx, x, y, '');
          drawDashed(ctx, x, y, p1[0], p1[1], 'rgba(0,0,255,0.2)');
          drawDashed(ctx, x, y, p2[0], p2[1], 'rgba(0,0,255,0.2)');
        }
      }
      ctx.save();
      ctx.fillStyle = '#000';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('ГМТ: точки, равноудалённые от A и B', ctx.canvas.width / 2, 380);
      ctx.restore();
    }
    return;
  }

  // ================================================================
  //  th_213 — ПЕРПЕНДИКУЛЯР ИЗ ТОЧКИ (с русской Н)
  // ================================================================
  if (show_perpendicular_from_point && point) {
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    const t = ((point[0] - p1[0]) * dx + (point[1] - p1[1]) * dy) / (dx * dx + dy * dy);
    const projX = p1[0] + t * dx;
    const projY = p1[1] + t * dy;
    drawSegment(ctx, p1[0], p1[1], p2[0], p2[1], '#000');
    drawLabel(ctx, p2[0] + 20, p2[1] - 10, 'a');
    drawPoint(ctx, point[0], point[1], 'M');
    drawDashed(ctx, point[0], point[1], projX, projY, '#f80');
    drawPoint(ctx, projX, projY, 'Н'); // русская Н
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText('MН ⟂ a', projX + 15, projY - 10);
    ctx.restore();
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('Из точки M — единственный перпендикуляр к прямой a', ctx.canvas.width / 2, 360);
    ctx.restore();
    return;
  }

  // ================================================================
  //  th_001 / th_004 — ОТРЕЗОК / ПРЯМАЯ (дефолт)
  // ================================================================
  drawSegment(ctx, p1[0], p1[1], p2[0], p2[1], '#000');
  if (labels.length) {
    labels.forEach((label, i) => {
      const [x, y] = points[i];
      drawLabel(ctx, x, y, label);
    });
  }
}