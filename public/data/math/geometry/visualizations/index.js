// public/data/math/geometry/visualizations/index.js
// Собирает все модули визуализаций в один объект

import line from './line.json' assert { type: 'json' };
import angle from './angle.json' assert { type: 'json' };
import triangle from './triangle.json' assert { type: 'json' };
import quadrilateral from './quadrilateral.json' assert { type: 'json' };
import circle from './circle.json' assert { type: 'json' };
import plane from './plane.json' assert { type: 'json' };
import skew from './skew.json' assert { type: 'json' };
import dihedral from './dihedral.json' assert { type: 'json' };
import solids from './solids.json' assert { type: 'json' };
import cylinder from './cylinder.json' assert { type: 'json' };
import cone from './cone.json' assert { type: 'json' };
import sphere from './sphere.json' assert { type: 'json' };
import vector from './vector.json' assert { type: 'json' };
import coordinate from './coordinate.json' assert { type: 'json' };
import movement from './movement.json' assert { type: 'json' };
import special from './special.json' assert { type: 'json' };

export const visualizations = {
  ...line,
  ...angle,
  ...triangle,
  ...quadrilateral,
  ...circle,
  ...plane,
  ...skew,
  ...dihedral,
  ...solids,
  ...cylinder,
  ...cone,
  ...sphere,
  ...vector,
  ...coordinate,
  ...movement,
  ...special
};

export default visualizations;