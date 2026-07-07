<template>
  <div class="search-input-wrapper">
    <input
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      class="search-input"
    />
    <span class="search-icon">🔍</span>
    <button
      v-if="modelValue && showClear"
      @click="$emit('update:modelValue', '')"
      class="clear-btn"
    >
      ✕
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  placeholder: {
    type: String,
    default: 'Поиск...'
  },
  showClear: {
    type: Boolean,
    default: true
  }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.search-input-wrapper {
  position: relative;
  flex: 1 1 200px;
}
.search-input {
  width: 100%;
  padding: 8px 32px 8px 36px;
  border-radius: var(--radius-md, 8px);
  border: 1px solid var(--border-color, #334155);
  background: var(--bg-primary, #0f172a);
  color: var(--text-primary, #f8fafc);
  font-size: 14px;
  outline: none;
  transition: 0.2s;
}
.search-input:focus {
  border-color: var(--color-primary, #3b82f6);
}
.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted, #94a3b8);
}
.clear-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--text-muted, #94a3b8);
  cursor: pointer;
  font-size: 14px;
  padding: 2px 6px;
}
.clear-btn:hover {
  color: var(--text-primary, #f8fafc);
}
</style>