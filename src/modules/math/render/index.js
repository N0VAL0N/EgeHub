// ================================================================
//  ГЛАВНЫЙ ДИСПЕТЧЕР (ОБНОВЛЁННЫЙ)
//  Подключает только используемые модули:
//  line, cylinder, cone, sphere, dihedral, skew, coordinate, special
// ================================================================

import { drawLine } from './line.js';
import { drawCylinder } from './cylinder.js';
import { drawCone } from './cone.js';
import { drawSphere } from './sphere.js';
import { drawDihedral } from './dihedral.js';
import { drawSkew } from './skew.js';
import { drawSimilarity, drawGMT, drawPolygon } from './special.js';

export function drawFigure(ctx, type, params) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.save();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#000';
  ctx.fillStyle = 'transparent';
  ctx.font = '14px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  switch (type) {
    case 'line': drawLine(ctx, params); break;
    case 'cylinder': drawCylinder(ctx, params); break;
    case 'cone': drawCone(ctx, params); break;
    case 'sphere': drawSphere(ctx, params); break;
    case 'dihedral': drawDihedral(ctx, params); break;
    case 'skew': drawSkew(ctx, params); break;
    case 'coordinate': drawCoordinate(ctx, params); break;
    case 'similarity': drawSimilarity(ctx, params); break;
    case 'gmt': drawGMT(ctx, params); break;
    case 'polygon': drawPolygon(ctx, params); break;

    case 'image':
      if (params.image) {
        const img = new Image();
        img.src = params.image;
        img.onload = () => {
          // Если заданы canvasWidth/Height – используем их, иначе весь холст
          const w = params.canvasWidth || ctx.canvas.width;
          const h = params.canvasHeight || ctx.canvas.height;
          ctx.drawImage(img, 0, 0, w, h);
        };
        img.onerror = () => {
          ctx.fillStyle = '#ccc';
          ctx.font = '20px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('Ошибка загрузки изображения', ctx.canvas.width/2, ctx.canvas.height/2);
        };
      } else {
        drawPlaceholder(ctx);
      }
      break;

    default:
      console.warn('Неизвестный тип фигуры:', type);
      drawPlaceholder(ctx);
  }

  ctx.restore();
}

function drawPlaceholder(ctx) {
  ctx.fillStyle = '#ccc';
  ctx.font = '20px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Нет визуализации', ctx.canvas.width/2, ctx.canvas.height/2);
}