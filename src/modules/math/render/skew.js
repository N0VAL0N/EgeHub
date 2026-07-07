// ================================================================
//  МОДУЛЬ: СКРЕЩИВАЮЩИЕСЯ ПРЯМЫЕ (2D)
//  Плоскость — большой параллелограмм
//  Прямая a — горизонтальная диагональ внутри плоскости
//  Прямая b — пересекает плоскость справа, не пересекает a
// ================================================================

import { drawSegment, drawDashed } from './utils.js';

export function drawSkew(ctx, params) {   // <-- ДОБАВИЛ export
  const {
    points,
    labels = [],
    show_common_perpendicular = false,
    show_plane = false,
    ...rest
  } = params;

  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;

  // ---- центр канваса ----
  const cx = canvasWidth / 2;
  const cy = canvasHeight / 2;

  // ---- плоскость (большой параллелограмм) ----
  if (show_plane) {
    const w = 200;
    const h = 130;
    const skew = 50;

    // Четыре вершины параллелограмма
    const pA = [cx - w/2 + skew, cy - h/2];
    const pB = [cx + w/2 + skew, cy - h/2];
    const pC = [cx + w/2 - skew, cy + h/2];
    const pD = [cx - w/2 - skew, cy + h/2];

    // Заливка плоскости
    ctx.save();
    ctx.fillStyle = 'rgba(200, 200, 255, 0.12)';
    ctx.strokeStyle = 'rgba(100, 100, 200, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(pA[0], pA[1]);
    ctx.lineTo(pB[0], pB[1]);
    ctx.lineTo(pC[0], pC[1]);
    ctx.lineTo(pD[0], pD[1]);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Подпись плоскости
    ctx.save();
    ctx.fillStyle = '#666';
    ctx.font = '18px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('α', pA[0] + 15, pA[1] - 25);
    ctx.restore();

    // ---- прямая a (горизонтальная, внутри плоскости) ----
    const aY = cy + 10;
    const aStart = [cx - 140, aY];
    const aEnd = [cx + 140, aY];
    drawSegment(ctx, aStart[0], aStart[1], aEnd[0], aEnd[1], '#000', []);

    // Подпись прямой a
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('a', aEnd[0] + 30, aEnd[1] - 5);
    ctx.restore();

    // ---- прямая b (пересекает плоскость справа) ----
    // Точка пересечения с плоскостью
    const crossX = cx + 60;
    const crossY = cy - 20;

    // Верхняя часть (над плоскостью) — сплошная
    const upX = crossX - 100;
    const upY = crossY - 110;
    drawSegment(ctx, crossX, crossY, upX, upY, '#00f', []);

    // Нижняя часть (под плоскостью) — пунктирная
    const downX = crossX + 90;
    const downY = crossY + 100;
    drawDashed(ctx, crossX, crossY, downX, downY, '#00f');

    // Подпись прямой b
    ctx.save();
    ctx.fillStyle = '#00f';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('b', upX - 30, upY - 5);
    ctx.restore();

    // ---- точка пересечения b с плоскостью (M) ----
    ctx.save();
    ctx.fillStyle = '#f00';
    ctx.beginPath();
    ctx.arc(crossX, crossY, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = '#f00';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText('M', crossX + 10, crossY - 5);
    ctx.restore();

    // ---- общий перпендикуляр (только для th_212) ----
    if (show_common_perpendicular) {
      // Точка на прямой a (проекция M на a — вертикально вниз)
      const perpStart = [crossX, aY];
      // Точка на прямой b — это M
      const perpEnd = [crossX, crossY];

      // Рисуем перпендикуляр (красный, сплошной)
      drawSegment(ctx, perpStart[0], perpStart[1], perpEnd[0], perpEnd[1], '#f00', []);

      // Отмечаем основания перпендикуляра
      ctx.save();
      ctx.fillStyle = '#f00';
      ctx.beginPath();
      ctx.arc(perpStart[0], perpStart[1], 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(perpEnd[0], perpEnd[1], 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();

      // Подпись перпендикуляра (d)
      ctx.save();
      ctx.fillStyle = '#f00';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText('d', perpStart[0] - 12, (perpStart[1] + perpEnd[1]) / 2);
      ctx.restore();
    }
  }
}