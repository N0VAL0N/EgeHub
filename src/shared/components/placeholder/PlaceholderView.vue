<template>
  <div class="placeholder">
    <div class="placeholder-content">
      <div class="placeholder-icon">🚧</div>
      <h2>{{ title }}</h2>
      <p>Эта страница в разработке</p>
      <p class="placeholder-hint">Скоро здесь появится полезный контент</p>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const title = route.meta.title || 'Страница'
</script>

<style scoped>
.placeholder {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}
.placeholder-content {
  text-align: center;
}
.placeholder-icon {
  font-size: 64px;
  margin-bottom: 20px;
}
.placeholder h2 {
  font-size: 32px;
  color: var(--text-primary, #f8fafc);
  margin-bottom: 8px;
}
.placeholder p {
  font-size: 18px;
  color: var(--text-secondary, #94a3b8);
}
.placeholder-hint {
  font-size: 14px !important;
  color: var(--text-muted, #64748b) !important;
  margin-top: 8px;
}
</style>