import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '@shared/components/landing/LandingView.vue'

// Импортируем роутеры модулей
import mathRoutes from '@modules/math/router'

const routes = [
  {
    path: '/',
    name: 'landing',
    component: LandingView
  },
  // Математика (теория)
  ...mathRoutes,
  // Заглушки для остальных страниц
  {
    path: '/lessons',
    name: 'lessons',
    component: () => import('@shared/components/placeholder/PlaceholderView.vue'),
    meta: { title: 'Уроки' }
  },
  {
    path: '/practice',
    name: 'practice',
    component: () => import('@shared/components/placeholder/PlaceholderView.vue'),
    meta: { title: 'Практика' }
  },
  {
    path: '/bookmarks',
    name: 'bookmarks',
    component: () => import('@shared/components/placeholder/PlaceholderView.vue'),
    meta: { title: 'Закладки' }
  },
  {
    path: '/stats',
    name: 'stats',
    component: () => import('@shared/components/placeholder/PlaceholderView.vue'),
    meta: { title: 'Статистика' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@shared/components/placeholder/PlaceholderView.vue'),
    meta: { title: 'Настройки' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router