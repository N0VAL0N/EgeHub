<template>
  <header class="header">
    <div class="header-left">
      <h2>{{ pageTitle }}</h2>
    </div>
    <div class="header-right">
      <ThemeToggle />
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ThemeToggle from '../common/ThemeToggle.vue'

const route = useRoute()
const pageTitle = computed(() => {
  const titles = {
    '/': 'Главная',
    '/theory': 'Теория',
    '/lessons': 'Уроки',
    '/practice': 'Практика',
    '/bookmarks': 'Закладки',
    '/stats': 'Статистика',
    '/settings': 'Настройки'
  }
  return titles[route.path] || 'Теория'
})
</script>

<style scoped>
.header {
  background: var(--bg-secondary);
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}
.header-left h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
}
.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
</style>