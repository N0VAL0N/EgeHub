// ================================================================
//  ВСПОМОГАТЕЛЬНЫЕ УТИЛИТЫ
// ================================================================

export function drawLabel(ctx, x, y, text, offsetX = 8, offsetY = -8) {
  ctx.fillStyle = '#000';
  ctx.fillText(text, x + offsetX, y + offsetY);
}

export function drawSegment(ctx, x1, y1, x2, y2, color = '#000', dash = []) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  if (dash.length) ctx.setLineDash(dash);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

export function drawDashed(ctx, x1, y1, x2, y2, color = '#888') {
  drawSegment(ctx, x1, y1, x2, y2, color, [4, 4]);
}

export function drawArrow(ctx, fromX, fromY, toX, toY, color = '#000') {
  const headLen = 10;
  const angle = Math.atan2(toY - fromY, toX - fromX);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - headLen * Math.cos(angle - 0.4), toY - headLen * Math.sin(angle - 0.4));
  ctx.lineTo(toX - headLen * Math.cos(angle + 0.4), toY - headLen * Math.sin(angle + 0.4));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawAngleArc(ctx, cx, cy, radius, startAngle, endAngle, color = '#000', label = '') {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, startAngle, endAngle);
  ctx.stroke();
  if (label) {
    const mid = (startAngle + endAngle) / 2;
    const lx = cx + (radius + 15) * Math.cos(mid);
    const ly = cy + (radius + 15) * Math.sin(mid);
    ctx.fillStyle = color;
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, lx, ly);
  }
  ctx.restore();
}