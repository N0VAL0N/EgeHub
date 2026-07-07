<template>
  <aside class="sidebar">
    <div class="logo">
      <span>📚</span> Теория
    </div>
    <nav>
      <router-link to="/" class="nav-item" exact-active-class="active">
        <span class="icon">🏠</span> Главная
      </router-link>
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
}
.logo {
  font-size: 24px;
  font-weight: bold;
  padding: 0 20px 30px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: 0.2s;
  border-left: 3px solid transparent;
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
.icon {
  font-size: 20px;
}
</style>