import MathView from '../views/TheoryView.vue'
import PlaceholderView from '@shared/components/placeholder/PlaceholderView.vue'

export default [
  {
    path: '/theory/math',
    name: 'math-theory',
    component: MathView,
    meta: {
      title: 'Математика — Теория',
      subject: 'math',
      section: 'geometry' // дефолтный раздел
    }
  },
  {
    path: '/theory/math/:section',
    name: 'math-theory-section',
    component: MathView,
    props: true,
    meta: {
      title: 'Математика — Теория',
      subject: 'math'
    }
  },
  // Если понадобится страница с задачами/практикой по математике
  {
    path: '/practice/math',
    name: 'math-practice',
    component: PlaceholderView,
    meta: {
      title: 'Математика — Практика'
    }
  },
  {
    path: '/lessons/math',
    name: 'math-lessons',
    component: PlaceholderView,
    meta: {
      title: 'Математика — Уроки'
    }
  }
]