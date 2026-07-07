<template>
  <div id="app" :data-theme="theme">
    <AppSidebar />
    <div class="main-content">
      <AppHeader />
      <router-view />
      <AppFooter />
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@core/composables/useAppStore'
import AppSidebar from '@shared/components/layout/AppSidebar.vue'
import AppHeader from '@shared/components/layout/AppHeader.vue'
import AppFooter from '@shared/components/layout/AppFooter.vue'

const store = useAppStore()
const theme = store.theme
</script>

<style scoped>
#app {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--bg-primary);
  color: var(--text-primary);
}
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--bg-primary);
}
</style>