// ================================================================
//  МОДУЛЬ: СПЕЦИАЛЬНЫЕ ТИПЫ
//  th_121 — таблица тригонометрических значений
//  th_162 — гомотетия (центральное подобие)
//  th_165 — выпуклый многоугольник (сумма углов)
//  th_187 — ГМТ (геометрическое место точек)
//  th_190 — отношение площадей подобных фигур
//  th_196 — правильные многоугольники (пример)
// ================================================================

import { drawLabel, drawSegment, drawDashed } from './utils.js';

// ================================================================
//  ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ ТОЧЕК
// ================================================================
function drawPoint(ctx, x, y, label, offsetX = 15, offsetY = -10) {
  ctx.save();
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
  
  ctx.save();
  ctx.fillStyle = '#000';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x + offsetX, y + offsetY);
  ctx.restore();
}

// ================================================================
//  th_121 — ТАБЛИЦА ТРИГОНОМЕТРИЧЕСКИХ ЗНАЧЕНИЙ
// ================================================================
export function drawTable(ctx, params) {
  const { rows = 6, cols = 5, angles = [], values = [] } = params;
  const cellWidth = 70;
  const cellHeight = 34;
  const startX = (ctx.canvas.width - (cols + 1) * cellWidth) / 2;
  const startY = 40;

  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const headers = ['α', 'sin', 'cos', 'tg', 'ctg'];
  for (let j = 0; j < headers.length; j++) {
    const x = startX + j * cellWidth;
    const y = startY;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x, y, cellWidth, cellHeight);
    ctx.strokeRect(x, y, cellWidth, cellHeight);
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(headers[j], x + cellWidth/2, y + cellHeight/2);
  }

  for (let i = 0; i < rows; i++) {
    const y = startY + (i + 1) * cellHeight;
    const x0 = startX;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x0, y, cellWidth, cellHeight);
    ctx.strokeRect(x0, y, cellWidth, cellHeight);
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(angles[i] || '', x0 + cellWidth/2, y + cellHeight/2);

    for (let j = 0; j < cols; j++) {
      const x = startX + (j + 1) * cellWidth;
      ctx.fillStyle = i % 2 === 0 ? '#0f172a' : '#1e293b';
      ctx.fillRect(x, y, cellWidth, cellHeight);
      ctx.strokeRect(x, y, cellWidth, cellHeight);
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(values[i]?.[j] || '', x + cellWidth/2, y + cellHeight/2);
    }
  }

  ctx.save();
  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const bottomY = startY + (rows + 1) * cellHeight;
  ctx.fillText('sin — противолежащий / гипотенуза', ctx.canvas.width/2, bottomY + 12);
  ctx.fillText('cos — прилежащий / гипотенуза', ctx.canvas.width/2, bottomY + 34);
  ctx.fillText('tg = sin/cos, ctg = cos/sin', ctx.canvas.width/2, bottomY + 56);
  ctx.fillText('Для тупых углов (90° < α < 180°): sin > 0, cos < 0, tg < 0', ctx.canvas.width/2, bottomY + 78);
  ctx.restore();
}

// ================================================================
//  th_162 — ГОМОТЕТИЯ (и th_190 — отношение площадей)
// ================================================================
export function drawSimilarity(ctx, params) {
  const { homothety = false, show_area_ratio = false, similar_scale = 0.6 } = params;

  const oX = 200;
  const oY = 170;

  const tri1 = [
    [oX - 130, oY + 80],
    [oX + 130, oY + 80],
    [oX, oY - 100]
  ];

  const tri2 = tri1.map(p => [
    oX + (p[0] - oX) * similar_scale,
    oY + (p[1] - oY) * similar_scale
  ]);

  ctx.beginPath();
  ctx.moveTo(tri1[0][0], tri1[0][1]);
  ctx.lineTo(tri1[1][0], tri1[1][1]);
  ctx.lineTo(tri1[2][0], tri1[2][1]);
  ctx.closePath();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.stroke();

  drawPoint(ctx, tri1[0][0], tri1[0][1], 'A', -20, 10);
  drawPoint(ctx, tri1[1][0], tri1[1][1], 'B', 20, 10);
  drawPoint(ctx, tri1[2][0], tri1[2][1], 'C', 0, -15);

  ctx.beginPath();
  ctx.moveTo(tri2[0][0], tri2[0][1]);
  ctx.lineTo(tri2[1][0], tri2[1][1]);
  ctx.lineTo(tri2[2][0], tri2[2][1]);
  ctx.closePath();
  ctx.strokeStyle = '#00f';
  ctx.lineWidth = 2;
  ctx.stroke();

  drawPoint(ctx, tri2[0][0], tri2[0][1], 'A₁', -15, 8);
  drawPoint(ctx, tri2[1][0], tri2[1][1], 'B₁', 15, 5);
  drawPoint(ctx, tri2[2][0], tri2[2][1], 'C₁', -10, -8);

  drawPoint(ctx, oX, oY, 'O', -15, 5);

  if (homothety) {
    tri1.forEach((p, i) => {
      drawDashed(ctx, oX, oY, p[0], p[1], 'rgba(255,0,0,0.3)');
      drawDashed(ctx, oX, oY, tri2[i][0], tri2[i][1], 'rgba(255,0,0,0.3)');
    });

    ctx.save();
    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('△ABC ∼ △A₁B₁C₁ при гомотетии с центром O и коэффициентом k', ctx.canvas.width/2, 380);
    ctx.restore();
  }

  if (show_area_ratio) {
    const ratio = similar_scale * similar_scale;
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('S△A₁B₁C₁ / S△ABC = k²', ctx.canvas.width/2, 380);
    ctx.fillText('S₂/S₁ = k² = ' + ratio.toFixed(2), ctx.canvas.width/2, 405);
    ctx.restore();
  }
}

// ================================================================
//  th_165 — ВЫПУКЛЫЙ МНОГОУГОЛЬНИК (сумма углов)
// ================================================================
export function drawPolygon(ctx, params) {
  const { points, labels = [], show_diagonals = false, diagonals_from = 0, show_regular_polygons = false } = params;

  // ---- th_196: правильный треугольник ----
  if (show_regular_polygons) {
    const cx = 200;
    const cy = 150;
    const r = 100;

    const angles = [
      -Math.PI / 2,
      -Math.PI / 2 + (2 * Math.PI) / 3,
      -Math.PI / 2 + (4 * Math.PI) / 3
    ];
    const pts = angles.map(a => [
      cx + r * Math.cos(a),
      cy + r * Math.sin(a)
    ]);

    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    ctx.lineTo(pts[1][0], pts[1][1]);
    ctx.lineTo(pts[2][0], pts[2][1]);
    ctx.closePath();
    ctx.stroke();

    const labels2 = ['A', 'B', 'C'];
    const offsets = [
      [-20, -10],
      [20, -10],
      [0, 20]
    ];
    pts.forEach((p, i) => {
      ctx.save();
      ctx.fillStyle = '#000';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labels2[i], p[0] + offsets[i][0], p[1] + offsets[i][1]);
      ctx.restore();
    });

    const edges = [
      [0, 1],
      [1, 2],
      [2, 0]
    ];
    edges.forEach(([i, j]) => {
      const p1 = pts[i];
      const p2 = pts[j];
      const mx = (p1[0] + p2[0]) / 2;
      const my = (p1[1] + p2[1]) / 2;
      const dx = p2[0] - p1[0];
      const dy = p2[1] - p1[1];
      const len = Math.hypot(dx, dy);
      const nx = -dy / len;
      const ny = dx / len;
      ctx.save();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(mx - 8 * nx, my - 8 * ny);
      ctx.lineTo(mx + 8 * nx, my + 8 * ny);
      ctx.stroke();
      ctx.restore();
    });

    const anglePairs = [
      [-Math.PI / 2, -Math.PI / 2 + (2 * Math.PI) / 3],
      [-Math.PI / 2 + (2 * Math.PI) / 3, -Math.PI / 2 + (4 * Math.PI) / 3],
      [-Math.PI / 2 + (4 * Math.PI) / 3, -Math.PI / 2 + (6 * Math.PI) / 3]
    ];
    anglePairs.forEach(([a1, a2]) => {
      ctx.save();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 20, a1, a2);
      ctx.stroke();
      ctx.restore();
    });

    ctx.save();
    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('Правильный треугольник (все стороны и углы равны)', ctx.canvas.width/2, 350);
    ctx.fillText('AB = BC = CA, ∠A = ∠B = ∠C = 60°', ctx.canvas.width/2, 375);
    ctx.restore();
    return;
  }

  // ---- th_165: выпуклый многоугольник ----
  if (!points || points.length < 3) return;

  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.closePath();
  ctx.stroke();

  if (labels.length === points.length) {
    const offsets = [
      [-20, -10],
      [20, -10],
      [20, 10],
      [0, 20],
      [-20, 10]
    ];
    labels.forEach((label, i) => {
      const [x, y] = points[i];
      const [ox, oy] = offsets[i] || [0, 0];
      ctx.save();
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
      ctx.save();
      ctx.fillStyle = '#000';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x + ox, y + oy);
      ctx.restore();
    });
  }

  if (points.length >= 3) {
    const v = points[0];
    const p1 = points[points.length - 1];
    const p2 = points[1];
    const a1 = Math.atan2(p1[1] - v[1], p1[0] - v[0]);
    const a2 = Math.atan2(p2[1] - v[1], p2[0] - v[0]);
    
    ctx.save();
    ctx.strokeStyle = '#f80';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(v[0], v[1], 30, a1, a2);
    ctx.stroke();
    ctx.restore();
    
    ctx.save();
    ctx.fillStyle = '#f80';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('α', v[0] + 40 * Math.cos((a1 + a2) / 2),
                    v[1] + 40 * Math.sin((a1 + a2) / 2));
    ctx.restore();
  }

  const n = points.length;
  ctx.save();
  ctx.fillStyle = '#000';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('Сумма углов выпуклого n-угольника = 180° · (n − 2)', ctx.canvas.width/2, 380);
  ctx.fillText('Для n = ' + n + ': 180° · (' + n + ' − 2) = ' + (180 * (n - 2)) + '°', ctx.canvas.width/2, 405);
  ctx.fillText('Каждый угол правильного n-угольника = 180° · (n − 2) / n', ctx.canvas.width/2, 430);
  ctx.restore();
}

// ================================================================
//  th_187 — ГМТ (ГЕОМЕТРИЧЕСКОЕ МЕСТО ТОЧЕК)
// ================================================================
export function drawGMT(ctx, params) {
  const cx = 200,
    cy = 140,
    r = 90;

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx.strokeStyle = '#f00';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.save();
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.fillStyle = '#000';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('O', cx - 15, cy + 5);
  ctx.restore();

  for (let i = 0; i < 8; i++) {
    const angle = i * Math.PI / 4;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);

    ctx.save();
    ctx.strokeStyle = 'rgba(0,0,255,0.3)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = '#00f';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }

  ctx.save();
  ctx.fillStyle = '#000';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('ГМТ — множество точек, обладающих некоторым свойством', ctx.canvas.width/2, 320);
  ctx.fillText('Окружность — ГМТ точек, равноудалённых от центра O', ctx.canvas.width/2, 345);
  ctx.restore();
}