<template>
  <aside class="sidebar">
    <!-- Логотип -->
    <div class="logo">
      <span>📚</span> EgeHub
    </div>

    <!-- Выпадающее меню предметов -->
    <div class="dropdown-wrapper">
      <button class="subject-dropdown-trigger" @click="toggleDropdown">
        <span class="subject-icon">{{ currentSubject.icon || '📖' }}</span>
        <span class="subject-label">{{ currentSubject.label || 'Теория' }}</span>
        <span class="arrow" :class="{ open: isDropdownOpen }">▼</span>
      </button>

      <div v-if="isDropdownOpen" class="subject-dropdown-menu">
        <div
          v-for="subject in subjects"
          :key="subject.value"
          class="subject-dropdown-item"
          :class="{ active: selectedSubject === subject.value }"
          @click="selectSubject(subject)"
        >
          <span class="icon">{{ subject.icon }}</span>
          {{ subject.label }}
          <span v-if="!subject.ready" class="badge">🚧</span>
        </div>
      </div>
    </div>

    <!-- Линия-разделитель -->
    <div class="divider"></div>

    <!-- Навигация -->
    <nav>
      <router-link to="/" class="nav-item" exact-active-class="active">
        <span class="icon">🏠</span> Главная
      </router-link>

      <!-- Теория (все предметы) -->
      <router-link to="/theory" class="nav-item" active-class="active">
        <span class="icon">📖</span> Теория
      </router-link>

      <router-link to="/lessons" class="nav-item" active-class="active">
        <span class="icon">📝</span> Уроки
      </router-link>
      <router-link to="/practice" class="nav-item" active-class="active">
        <span class="icon">✏️</span> Практика
      </router-link>
      <router-link to="/bookmarks" class="nav-item" active-class="active">
        <span class="icon">🔖</span> Закладки
      </router-link>
      <router-link to="/stats" class="nav-item" active-class="active">
        <span class="icon">📊</span> Статистика
      </router-link>
      <router-link to="/settings" class="nav-item" active-class="active">
        <span class="icon">⚙️</span> Настройки
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@core/composables/useAppStore'

const router = useRouter()
const store = useAppStore()
const isDropdownOpen = ref(false)

const subjects = [
  { value: 'math', label: 'Математика', icon: '📐', route: '/theory/math', ready: true },
  { value: 'physics', label: 'Физика', icon: '⚛️', route: '/theory/physics', ready: false },
  { value: 'chemistry', label: 'Химия', icon: '🧪', route: '/theory/chemistry', ready: false },
  { value: 'biology', label: 'Биология', icon: '🧬', route: '/theory/biology', ready: false },
  { value: 'informatics', label: 'Информатика', icon: '💻', route: '/theory/informatics', ready: false },
  { value: 'english', label: 'Английский', icon: '🇬🇧', route: '/theory/english', ready: false }
]

const selectedSubject = computed(() => store.selectedSubject)

const currentSubject = computed(() => {
  const found = subjects.find(s => s.value === selectedSubject.value)
  return found || subjects[0]
})

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const selectSubject = (subject) => {
  store.selectedSubject = subject.value
  isDropdownOpen.value = false
  if (subject.ready) {
    router.push(subject.route)
  } else {
    router.push('/theory/' + subject.value)
  }
}
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  height: 100vh;
  flex-shrink: 0;
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
}

/* --- Логотип --- */
.logo {
  font-size: 24px;
  font-weight: bold;
  padding: 0 20px 16px;
  color: var(--text-primary);
}

/* --- Выпадающее меню предметов --- */
.dropdown-wrapper {
  padding: 0 16px 12px;
}

.subject-dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 15px;
  cursor: pointer;
  transition: 0.2s;
  font-family: inherit;
}

.subject-dropdown-trigger:hover {
  background: var(--bg-hover);
}

.subject-dropdown-trigger .arrow {
  margin-left: auto;
  font-size: 10px;
  transition: 0.2s;
}

.subject-dropdown-trigger .arrow.open {
  transform: rotate(180deg);
}

.subject-dropdown-menu {
  margin-top: 6px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.subject-dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  cursor: pointer;
  transition: 0.15s;
  font-size: 14px;
  color: var(--text-secondary);
}

.subject-dropdown-item:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.subject-dropdown-item.active {
  background: var(--bg-hover);
  color: var(--color-primary);
}

.subject-dropdown-item .icon {
  font-size: 18px;
}

.subject-dropdown-item .badge {
  margin-left: auto;
  font-size: 12px;
  color: var(--text-muted);
}

/* --- Разделитель --- */
.divider {
  height: 1px;
  background: var(--border-color);
  margin: 0 16px 12px;
}

/* --- Навигация --- */
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: 0.2s;
  border-left: 3px solid transparent;
  font-size: 15px;
}

.nav-item:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--bg-hover);
  border-left-color: var(--color-primary);
  color: var(--text-primary);
}

.nav-item .icon {
  font-size: 20px;
}
</style>