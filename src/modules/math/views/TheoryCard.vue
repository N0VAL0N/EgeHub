<template>
  <div class="theory-card" @click="$emit('click')">
    <div class="card-header">
      <span class="card-type">{{ theorem.type }}</span>
    </div>
    <h3 class="card-title">{{ theorem.name }}</h3>
    <p class="card-desc">{{ truncate(theorem.description, 80) }}</p>
    <div class="card-footer">
      <span class="card-level">{{ theorem.level }} класс</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  theorem: Object
})
defineEmits(['click'])

const truncate = (text, max) => text.length > max ? text.slice(0, max) + '...' : text
</script>

<style scoped>
.theory-card {
  background: var(--bg-secondary);
  padding: 16px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: 0.3s;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 2px 4px var(--shadow-color);
}
.theory-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-primary);
  box-shadow: 0 8px 24px var(--shadow-color);
}
.card-header {
  display: flex;
  justify-content: flex-end;
  font-size: 13px;
  color: var(--text-muted);
}
.card-type {
  background: var(--bg-tertiary);
  padding: 2px 10px;
  border-radius: 12px;
  text-transform: capitalize;
}
.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 4px 0;
}
.card-desc {
  font-size: 14px;
  color: var(--text-secondary);
  flex: 1;
}
.card-footer {
  display: flex;
  justify-content: flex-end;
  font-size: 12px;
  color: var(--text-muted);
  border-top: 1px solid var(--border-color);
  padding-top: 8px;
  margin-top: 4px;
}
.card-level {
  background: var(--bg-tertiary);
  padding: 2px 10px;
  border-radius: 12px;
}
</style>