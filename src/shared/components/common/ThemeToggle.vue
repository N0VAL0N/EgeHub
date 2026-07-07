<template>
  <button class="theme-toggle" @click="toggle">
    {{ isDark ? '🌙' : '☀️' }}
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@core/composables/useAppStore'

const store = useAppStore()
const isDark = computed(() => store.theme === 'dark')

const toggle = () => {
  store.toggleTheme()
}
</script>

<style scoped>
.theme-toggle {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 18px;
  cursor: pointer;
  transition: 0.2s;
  color: var(--text-primary);
}
.theme-toggle:hover {
  background: var(--bg-hover);
}
</style>