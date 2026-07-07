<template>
  <div class="filters-bar">
    <!-- Поиск -->
    <SearchInput v-model="search" placeholder="Поиск по названию, описанию..." class="search-wrapper" />

    <!-- Раздел -->
    <FilterDropdown
      :options="sectionOptions"
      v-model="section"
      label="Раздел"
      title="Выберите раздел"
    />

    <!-- Уровень -->
    <FilterDropdown
      :options="levelOptions"
      v-model="levelFilter"
      label="Уровень"
      title="Выберите класс"
      show-clear
    />

    <!-- Тип -->
    <FilterDropdown
      :options="typeOptions"
      v-model="typeFilter"
      label="Тип"
      title="Выберите тип"
      show-clear
    />

    <!-- Сортировка -->
    <div class="sort-group">
      <FilterDropdown
        :options="sortOptions"
        v-model="sortKey"
        label="Сортировка"
        title="Сортировать по"
      />
      <button @click="toggleOrder" class="sort-order-btn">
        {{ sortOrder === 'asc' ? '↑' : '↓' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAppStore } from '@core/composables/useAppStore'
import { useMathStore } from '../store'
import SearchInput from '@shared/components/common/SearchInput.vue'
import FilterDropdown from '@shared/components/common/FilterDropdown.vue'

const props = defineProps({
  search: String,
  subject: String,
  section: String
})
const emit = defineEmits([
  'update:search',
  'update:subject',
  'update:section',
  'filter-change',
  'sort-change'
])

const appStore = useAppStore()
const mathStore = useMathStore()

// ---- локальные фильтры ----
const levelFilter = ref(null)
const typeFilter = ref(null)
const sortKey = ref('id')
const sortOrder = ref('asc')

// ---- опции ----
const sectionOptions = computed(() => appStore.sectionOptions)

const levelOptions = [
  { value: 7, label: '7 класс' },
  { value: 8, label: '8 класс' },
  { value: 9, label: '9 класс' },
  { value: 10, label: '10 класс' },
  { value: 11, label: '11 класс' }
]

const typeOptions = [
  { value: 'definition', label: 'Определение' },
  { value: 'theorem', label: 'Теорема' },
  { value: 'axiom', label: 'Аксиома' },
  { value: 'formula', label: 'Формула' },
  { value: 'property', label: 'Свойство' },
  { value: 'method', label: 'Метод' },
  { value: 'lemma', label: 'Лемма' }
]

const sortOptions = [
  { value: 'id', label: 'По ID' },
  { value: 'name', label: 'По названию' },
  { value: 'level', label: 'По уровню' },
  { value: 'type', label: 'По типу' }
]

// ---- реактивные привязки ----
const search = computed({
  get: () => props.search,
  set: (val) => emit('update:search', val)
})

const subject = computed({
  get: () => props.subject,
  set: (val) => emit('update:subject', val)
})

const section = computed({
  get: () => props.section,
  set: (val) => emit('update:section', val)
})

// ---- отправка фильтров ----
const emitFilters = () => {
  emit('filter-change', {
    level: levelFilter.value,
    type: typeFilter.value
    // теги убраны
  })
}

const emitSort = () => {
  emit('sort-change', {
    key: sortKey.value,
    order: sortOrder.value
  })
}

const toggleOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  emitSort()
}

// ---- следим за изменениями ----
watch([levelFilter, typeFilter], () => emitFilters())
watch([sortKey, sortOrder], () => emitSort())
</script>


<style scoped>
.filters-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  background: var(--bg-secondary);
  padding: 12px 16px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
}

.search-wrapper {
  flex: 1 1 200px;
  min-width: 160px;
}

.sort-group {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-left: auto;
}

.sort-order-btn {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 6px 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 18px;
  transition: 0.2s;
}

.sort-order-btn:hover {
  background: var(--bg-hover);
}

/* Адаптивность */
@media (max-width: 768px) {
  .filters-bar {
    flex-direction: column;
    align-items: stretch;
  }
  .sort-group {
    margin-left: 0;
  }
}
</style>