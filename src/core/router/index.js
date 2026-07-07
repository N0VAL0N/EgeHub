import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '@shared/components/landing/LandingView.vue'

// Импортируем роутеры модулей
import mathRoutes from '@modules/math/router'
import physicsRoutes from '@modules/physics/router'
import biologyRoutes from '@modules/biology/router'
import chemistryRoutes from '@modules/chemistry/router'
import informaticsRoutes from '@modules/informatics/router'
import englishRoutes from '@modules/english/router'

// Заглушки для страниц
import PlaceholderView from '@shared/components/placeholder/PlaceholderView.vue'

const routes = [
  {
    path: '/',
    name: 'landing',
    component: LandingView
  },
  // Математика
  ...mathRoutes,
  // Физика
  ...physicsRoutes,
  // Биология
  ...biologyRoutes,
  // Химия
  ...chemistryRoutes,
  // Информатика
  ...informaticsRoutes,
  // Английский
  ...englishRoutes,
  // Остальные страницы
  {
    path: '/lessons',
    name: 'lessons',
    component: PlaceholderView,
    meta: { title: 'Уроки' }
  },
  {
    path: '/practice',
    name: 'practice',
    component: PlaceholderView,
    meta: { title: 'Практика' }
  },
  {
    path: '/bookmarks',
    name: 'bookmarks',
    component: PlaceholderView,
    meta: { title: 'Закладки' }
  },
  {
    path: '/stats',
    name: 'stats',
    component: PlaceholderView,
    meta: { title: 'Статистика' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: PlaceholderView,
    meta: { title: 'Настройки' }
  },
  // 404
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: PlaceholderView,
    meta: { title: 'Страница не найдена' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router