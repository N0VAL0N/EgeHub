<template>
  <div class="filter-dropdown" ref="dropdownRef">
    <button class="filter-trigger" @click="toggleOpen">
      <span>{{ label }}</span>
      <span class="arrow" :class="{ open: isOpen }">▼</span>
    </button>
    <div v-if="isOpen" class="dropdown-menu">
      <div class="dropdown-header" v-if="title">
        <span>{{ title }}</span>
      </div>
      <div class="dropdown-search" v-if="searchable">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Поиск..."
          @click.stop
        />
      </div>
      <div class="dropdown-options">
        <div
          v-for="option in filteredOptions"
          :key="option.value"
          class="dropdown-option"
          :class="{ active: isSelected(option.value) }"
          @click="selectOption(option.value)"
        >
          <span class="option-label">{{ option.label }}</span>
          <span v-if="isSelected(option.value)" class="check">✓</span>
        </div>
      </div>
      <div class="dropdown-footer" v-if="showClear">
        <button @click="clearSelection" class="clear-btn">Сбросить</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: 'Фильтр'
  },
  options: {
    type: Array,
    required: true
  },
  modelValue: {
    type: [String, Number, null],
    default: null
  },
  title: {
    type: String,
    default: ''
  },
  searchable: {
    type: Boolean,
    default: false
  },
  showClear: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const searchQuery = ref('')
const dropdownRef = ref(null)

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) return props.options
  const q = searchQuery.value.toLowerCase()
  return props.options.filter(opt =>
    opt.label.toLowerCase().includes(q)
  )
})

const isSelected = (value) => props.modelValue === value

const toggleOpen = () => {
  isOpen.value = !isOpen.value
  if (!isOpen.value) searchQuery.value = ''
}

const selectOption = (value) => {
  if (isSelected(value)) {
    emit('update:modelValue', null)
  } else {
    emit('update:modelValue', value)
  }
  isOpen.value = false
}

const clearSelection = () => {
  emit('update:modelValue', null)
  isOpen.value = false
}

// Закрытие по клику вне
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
    searchQuery.value = ''
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.filter-dropdown {
  position: relative;
  display: inline-block;
}

.filter-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: var(--radius-md, 8px);
  border: 1px solid var(--border-color, #334155);
  background: var(--bg-primary, #0f172a);
  color: var(--text-primary, #f8fafc);
  cursor: pointer;
  font-size: 14px;
  transition: 0.2s;
  white-space: nowrap;
}
.filter-trigger:hover {
  background: var(--bg-secondary, #1e293b);
}
.arrow {
  font-size: 10px;
  transition: 0.2s;
}
.arrow.open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 200px;
  background: var(--bg-secondary, #1e293b);
  border: 1px solid var(--border-color, #334155);
  border-radius: var(--radius-md, 8px);
  box-shadow: var(--shadow-lg, 0 8px 24px rgba(0,0,0,0.3));
  z-index: 100;
  overflow: hidden;
}

.dropdown-header {
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary, #94a3b8);
  border-bottom: 1px solid var(--border-color, #334155);
}

.dropdown-search {
  padding: 8px 12px;
  border-bottom: 1px solid var(--border-color, #334155);
}
.dropdown-search input {
  width: 100%;
  padding: 6px 10px;
  border-radius: var(--radius-sm, 6px);
  border: 1px solid var(--border-color, #334155);
  background: var(--bg-primary, #0f172a);
  color: var(--text-primary, #f8fafc);
  font-size: 13px;
  outline: none;
}
.dropdown-search input:focus {
  border-color: var(--color-primary, #3b82f6);
}

.dropdown-options {
  max-height: 200px;
  overflow-y: auto;
  padding: 4px 0;
}

.dropdown-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-primary, #f8fafc);
  transition: 0.15s;
}
.dropdown-option:hover {
  background: var(--bg-tertiary, #334155);
}
.dropdown-option.active {
  background: var(--bg-tertiary, #334155);
  color: var(--color-primary, #3b82f6);
}
.check {
  color: var(--color-primary, #3b82f6);
  font-weight: bold;
}

.dropdown-footer {
  padding: 8px 14px;
  border-top: 1px solid var(--border-color, #334155);
}
.dropdown-footer .clear-btn {
  width: 100%;
  padding: 6px;
  background: transparent;
  border: none;
  color: var(--text-muted, #94a3b8);
  cursor: pointer;
  font-size: 13px;
  border-radius: var(--radius-sm, 6px);
  transition: 0.2s;
}
.dropdown-footer .clear-btn:hover {
  background: var(--bg-tertiary, #334155);
  color: var(--text-primary, #f8fafc);
}
</style>