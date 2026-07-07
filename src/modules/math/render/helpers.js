// ================================================================
//  Утилиты для рендерера
// ================================================================

/**
 * Вычисляет bounding box для массива точек
 */
export function getBounds(points) {
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;
  
  points.forEach(([x, y]) => {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  });
  
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

/**
 * Центрирует фигуру внутри канваса с отступами
 * Возвращает смещение (offsetX, offsetY)
 */
export function centerFigure(points, canvasWidth, canvasHeight, padding = 40) {
  const bounds = getBounds(points);
  const figureWidth = bounds.width || 1;
  const figureHeight = bounds.height || 1;
  
  const scaleX = (canvasWidth - padding * 2) / figureWidth;
  const scaleY = (canvasHeight - padding * 2) / figureHeight;
  const scale = Math.min(scaleX, scaleY, 1.2); // не увеличиваем больше чем на 20%
  
  const centerX = (bounds.minX + bounds.maxX) / 2;
  const centerY = (bounds.minY + bounds.maxY) / 2;
  
  const targetX = canvasWidth / 2;
  const targetY = canvasHeight / 2;
  
  return {
    offsetX: targetX - centerX * scale,
    offsetY: targetY - centerY * scale,
    scale: scale
  };
}

/**
 * Применяет трансформацию к точке
 */
export function transformPoint(point, offsetX, offsetY, scale = 1) {
  return [point[0] * scale + offsetX, point[1] * scale + offsetY];
}

/**
 * Применяет трансформацию к массиву точек
 */
export function transformPoints(points, offsetX, offsetY, scale = 1) {
  return points.map(p => transformPoint(p, offsetX, offsetY, scale));
}