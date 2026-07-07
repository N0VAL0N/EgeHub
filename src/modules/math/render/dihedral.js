// ================================================================
//  МОДУЛЬ: ДВУГРАННЫЙ УГОЛ (th_076 — книга)
//  Две полуплоскости (книга, раскрытая на ~90°)
//  ∠AOB = φ — линейный угол двугранного угла
//  AO ⟂ CD, BO ⟂ CD
// ================================================================

import { drawSegment, drawDashed, drawAngleArc, drawLabel } from './utils.js';

function drawPoint(ctx, x, y, label, offsetX = 15, offsetY = -10) {
  ctx.save();
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
  drawLabel(ctx, x + offsetX, y + offsetY, label);
}

export function drawDihedral(ctx, params) {
  const {
    points,
    highlight = [],
    show_linear_angles = false,
    ...rest
  } = params;

  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;

  const cx = canvasWidth / 2;
  const cy = canvasHeight / 2;

  const w = 150;
  const h = 100;

  // ---- РЕБРО (CD) ----
  const C = [cx, cy - h - 30];
  const D = [cx, cy + h + 30];

  ctx.save();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(C[0], C[1]);
  ctx.lineTo(D[0], D[1]);
  ctx.stroke();
  ctx.restore();

  drawPoint(ctx, C[0], C[1], 'C', -20, -8);
  drawPoint(ctx, D[0], D[1], 'D', -20, 8);

  // ---- ПЕРВАЯ ПОЛУПЛОСКОСТЬ (левая, α) ----
  const leftPoints = [
    [C[0], C[1]],
    [D[0], D[1]],
    [D[0] - w, D[1] + h * 0.1],
    [C[0] - w, C[1] + h * 0.1]
  ];

  ctx.save();
  ctx.fillStyle = 'rgba(200, 200, 255, 0.12)';
  ctx.strokeStyle = 'rgba(100, 100, 200, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(leftPoints[0][0], leftPoints[0][1]);
  ctx.lineTo(leftPoints[1][0], leftPoints[1][1]);
  ctx.lineTo(leftPoints[2][0], leftPoints[2][1]);
  ctx.lineTo(leftPoints[3][0], leftPoints[3][1]);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  drawLabel(ctx, leftPoints[3][0] + 25, leftPoints[3][1] + 20, 'α');

  // ---- ВТОРАЯ ПОЛУПЛОСКОСТЬ (правая, β) ----
  const rightPoints = [
    [C[0], C[1]],
    [D[0], D[1]],
    [D[0] + w * 0.7, D[1] - h * 0.3],
    [C[0] + w * 0.7, C[1] - h * 0.3]
  ];

  ctx.save();
  ctx.fillStyle = 'rgba(255, 200, 200, 0.12)';
  ctx.strokeStyle = 'rgba(200, 100, 100, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(rightPoints[0][0], rightPoints[0][1]);
  ctx.lineTo(rightPoints[1][0], rightPoints[1][1]);
  ctx.lineTo(rightPoints[2][0], rightPoints[2][1]);
  ctx.lineTo(rightPoints[3][0], rightPoints[3][1]);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  drawLabel(ctx, rightPoints[3][0] - 30, rightPoints[3][1] + 20, 'β');

  // ---- ЛИНЕЙНЫЙ УГОЛ ----
  const O = [(C[0] + D[0]) / 2, (C[1] + D[1]) / 2];
  drawPoint(ctx, O[0], O[1], 'O', -20, 5);

  const aEnd = [O[0] - 80, O[1] + 20];
  drawSegment(ctx, O[0], O[1], aEnd[0], aEnd[1], '#00f', []);
  drawPoint(ctx, aEnd[0], aEnd[1], 'A', -25, -10);

  const bEnd = [O[0] + 75, O[1] - 20];
  drawSegment(ctx, O[0], O[1], bEnd[0], bEnd[1], '#00f', []);
  drawPoint(ctx, bEnd[0], bEnd[1], 'B', 15, -10);

  // ---- ДУГА УГЛА φ (теперь сверху) ----
  const arcRadius = 45;
  const angleA = Math.atan2(aEnd[1] - O[1], aEnd[0] - O[0]);
  const angleB = Math.atan2(bEnd[1] - O[1], bEnd[0] - O[0]);

  // Определяем, какая дуга короче (через верх)
  let startAngle = angleA;
  let endAngle = angleB;
  let midAngle = 0;

  // Нормализуем углы, чтобы дуга шла через верх
  if (startAngle > endAngle) {
    // Дуга через верх: от startAngle до endAngle + 2π
    midAngle = (startAngle + endAngle + 2 * Math.PI) / 2;
    ctx.save();
    ctx.strokeStyle = '#f80';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(O[0], O[1], arcRadius, startAngle, endAngle + 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
  } else {
    // Проверяем, не слишком ли маленькая дуга
    if (endAngle - startAngle < Math.PI) {
      // Маленькая дуга — рисуем её
      midAngle = (startAngle + endAngle) / 2;
      ctx.save();
      ctx.strokeStyle = '#f80';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(O[0], O[1], arcRadius, startAngle, endAngle);
      ctx.stroke();
      ctx.restore();
    } else {
      // Большая дуга — рисуем через верх
      midAngle = (startAngle + endAngle) / 2;
      ctx.save();
      ctx.strokeStyle = '#f80';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(O[0], O[1], arcRadius, startAngle, endAngle);
      ctx.stroke();
      ctx.restore();
    }
  }

  // φ — прямо на дуге (сверху)
  drawLabel(ctx, O[0] + (arcRadius + 5) * Math.cos(midAngle) - 10,
                 O[1] + (arcRadius + 5) * Math.sin(midAngle), 'φ');

  // ---- ПОДПИСЬ: 0° < φ < 180° ----
  ctx.save();
  ctx.fillStyle = '#666';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('0° < φ < 180°', cx, cy + h + 40);
  ctx.restore();

// ---- ДЛЯ th_149: угол между плоскостями ----
if (show_linear_angles) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const w = 170;
  const h = 110;
  const skew = 70;

  // ---- ПЛОСКОСТЬ α (параллелограмм, наклон вправо) ----
  const alphaPoints = [
    [cx - w, cy + h * 0.5],
    [cx + w - skew, cy + h * 0.5],
    [cx + w - skew, cy - h * 0.5],
    [cx - w, cy - h * 0.5]
  ];

  ctx.save();
  ctx.fillStyle = 'rgba(200, 200, 255, 0.12)';
  ctx.strokeStyle = 'rgba(100, 100, 200, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(alphaPoints[0][0], alphaPoints[0][1]);
  ctx.lineTo(alphaPoints[1][0], alphaPoints[1][1]);
  ctx.lineTo(alphaPoints[2][0], alphaPoints[2][1]);
  ctx.lineTo(alphaPoints[3][0], alphaPoints[3][1]);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  drawLabel(ctx, alphaPoints[3][0] + 20, alphaPoints[3][1] + 25, 'α');

  // ---- ТОЧКИ D и C (на верхней и нижней сторонах α) ----
  const D = [
    (alphaPoints[0][0] + alphaPoints[1][0]) / 2,
    (alphaPoints[0][1] + alphaPoints[1][1]) / 2
  ];
  const C = [
    (alphaPoints[3][0] + alphaPoints[2][0]) / 2,
    (alphaPoints[3][1] + alphaPoints[2][1]) / 2
  ];

  drawPoint(ctx, D[0], D[1], 'D', 10, 15);
  drawPoint(ctx, C[0], C[1], 'C', -15, -15);

  // ---- ПРЯМАЯ DC (линия пересечения) ----
  drawSegment(ctx, D[0], D[1], C[0], C[1], '#000', []);
  drawLabel(ctx, (D[0] + C[0]) / 2 + 30, (D[1] + C[1]) / 2, 'l');

  // ---- ПЛОСКОСТЬ β (как было) ----
  const betaPoints = [
    [D[0] - 50, D[1] - 60],
    [C[0] - 50, C[1] - 60],
    [C[0] + 50, C[1] + 60],
    [D[0] + 50, D[1] + 60]
  ];

  ctx.save();
  ctx.fillStyle = 'rgba(255, 200, 200, 0.12)';
  ctx.strokeStyle = 'rgba(200, 100, 100, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(betaPoints[0][0], betaPoints[0][1]);
  ctx.lineTo(betaPoints[1][0], betaPoints[1][1]);
  ctx.lineTo(betaPoints[2][0], betaPoints[2][1]);
  ctx.lineTo(betaPoints[3][0], betaPoints[3][1]);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  drawLabel(ctx, betaPoints[3][0] + 30, betaPoints[3][1] + 25, 'β');

  // ---- ТОЧКА O (на DC) ----
  const O2 = [(D[0] + C[0]) / 2, (D[1] + C[1]) / 2];
  drawPoint(ctx, O2[0], O2[1], 'O', -25, -10);

  // ---- ТОЧКА A (на правой стороне α) ----
  const A = [
    (alphaPoints[1][0] + alphaPoints[2][0]) / 2,
    (alphaPoints[1][1] + alphaPoints[2][1]) / 2
  ];
  drawPoint(ctx, A[0], A[1], 'A', 15, 10);

  // ---- OA в плоскости α ----
  drawSegment(ctx, O2[0], O2[1], A[0], A[1], '#00f', []);

  // ---- ТОЧКА B (сверху слева) ----
  const B = [
    (betaPoints[0][0] + betaPoints[1][0]) / 2 - 10,
    (betaPoints[0][1] + betaPoints[1][1]) / 2 - 10
  ];
  drawPoint(ctx, B[0], B[1], 'B', -20, -10);

  // ---- OB в плоскости β ----
  drawSegment(ctx, O2[0], O2[1], B[0], B[1], '#00f', []);

  // ---- ТОЧКА B₁ (продолжение OB за O) ----
  const B1 = [
    O2[0] + (O2[0] - B[0]),
    O2[1] + (O2[1] - B[1])
  ];
  drawDashed(ctx, O2[0], O2[1], B1[0], B1[1], '#00f');
  drawPoint(ctx, B1[0], B1[1], 'B₁', 15, 10);

  // ---- ДУГА ОСТРОГО УГЛА φ (B₁OA) — оранжевая ----
  const arcRadius2 = 45;
  const angleA = Math.atan2(A[1] - O2[1], A[0] - O2[0]);
  const angleB1 = Math.atan2(B1[1] - O2[1], B1[0] - O2[0]);

  ctx.save();
  ctx.strokeStyle = '#f80';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(O2[0], O2[1], arcRadius2, angleA, angleB1);
  ctx.stroke();
  ctx.restore();

  const midAngle3 = (angleA + angleB1) / 2;
  drawLabel(ctx, O2[0] + (arcRadius2 + 15) * Math.cos(midAngle3),
                   O2[1] + (arcRadius2 + 15) * Math.sin(midAngle3), 'φ');

  // ---- ДУГА ТУПОГО УГЛА φ₁ (BOA) — красная (меньше 180°) ----
  const angleB = Math.atan2(B[1] - O2[1], B[0] - O2[0]);

  ctx.save();
  ctx.strokeStyle = '#f00';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(O2[0], O2[1], arcRadius2 - 5, angleB, angleA);
  ctx.stroke();
  ctx.restore();

  const midAngle2 = (angleB + angleA) / 2;
  drawLabel(ctx, O2[0] + (arcRadius2 + 15) * Math.cos(midAngle2),
                   O2[1] + (arcRadius2 + 15) * Math.sin(midAngle2), 'φ₁');

  // ---- ПОДПИСЬ ----
  ctx.save();
  ctx.fillStyle = '#666';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('∠BOA = φ₁ — тупой двугранный угол', cx, cy + h + 50);
  ctx.fillText('∠B₁OA = φ — наименьший двугранный угол (угол между плоскостями)', cx, cy + h + 70);
  ctx.restore();
}
}