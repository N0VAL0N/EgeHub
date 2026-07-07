import MathView from '../views/TheoryView.vue'

export default [
  {
    path: '/theory',
    name: 'theory',
    component: MathView
  }
]

// Если хочешь сделать вложенные маршруты для алгебры/геометрии:
// export default [
//   {
//     path: '/theory',
//     component: MathView,
//     children: [
//       {
//         path: 'algebra',
//         component: () => import('../views/AlgebraView.vue')
//       },
//       {
//         path: 'geometry',
//         component: () => import('../views/GeometryView.vue')
//       }
//     ]
//   }
// ]