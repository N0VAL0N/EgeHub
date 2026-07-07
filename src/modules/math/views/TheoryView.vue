<template>
  <div class="theory-view">
    <TheoryFilters
      v-model:search="searchQuery"
      v-model:section="currentSection"
      @filter-change="applyFilters"
      @sort-change="applySort"
    />

    <div v-if="store.isLoading" class="loading-state">
      <span>⏳ Загрузка...</span>
    </div>

    <div v-else-if="store.error" class="error-state">
      <span>❌ Ошибка: {{ store.error }}</span>
      <button @click="retryLoad">Повторить</button>
    </div>

    <template v-else>
      <div class="cards-grid" v-if="filteredTheorems.length">
        <TheoryCard
          v-for="th in paginatedTheorems"
          :key="th.id"
          :theorem="th"
          @click="openModal(th)"
        />
      </div>
      <div v-else class="empty-state">Ничего не найдено</div>

      <div class="pagination" v-if="totalPages > 1">
        <button @click="prevPage" :disabled="currentPage === 1">←</button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">→</button>
      </div>
    </template>

    <TheoryModal
      v-if="selectedTheorem"
      :theorem="selectedTheorem"
      subject="math"
      :section="currentSection"
      @close="closeModal"
      @bookmark="toggleBookmark"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSubjectStore } from '@core/store/useSubjectStore'
import { useBookmarks } from '@core/composables/useBookmarks'
import TheoryFilters from './TheoryFilters.vue'
import TheoryCard from './TheoryCard.vue'
import TheoryModal from './TheoryModal.vue'

const route = useRoute()
const store = useSubjectStore()
const { toggle: toggleBookmark } = useBookmarks()

const searchQuery = ref('')
const filters = ref({ level: null, type: null })
const sortKey = ref('id')
const sortOrder = ref('asc')
const currentPage = ref(1)
const pageSize = 20
const selectedTheorem = ref(null)

// Берём раздел из параметров роута, по умолчанию 'geometry'
const currentSection = computed(() => route.params.section || 'geometry')

// Загружаем данные для математики + текущего раздела
const loadData = async () => {
  await store.loadTheory('math', currentSection.value)
}

const currentTheorems = computed(() => {
  return store.getTheorems('math', currentSection.value)
})

// ---- фильтрация, сортировка, пагинация (без тегов) ----
const filteredTheorems = computed(() => {
  let list = [...currentTheorems.value]

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q)
    )
  }

  if (filters.value.level) {
    list = list.filter(t => t.level === filters.value.level)
  }

  if (filters.value.type) {
    list = list.filter(t => t.type === filters.value.type)
  }

  list.sort((a, b) => {
    let valA = a[sortKey.value]
    let valB = b[sortKey.value]
    if (typeof valA === 'string') valA = valA.toLowerCase()
    if (typeof valB === 'string') valB = valB.toLowerCase()
    if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1
    if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })

  return list
})

const totalPages = computed(() => Math.ceil(filteredTheorems.value.length / pageSize))
const paginatedTheorems = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredTheorems.value.slice(start, start + pageSize)
})

const applyFilters = (newFilters) => {
  filters.value = newFilters
  currentPage.value = 1
}
const applySort = ({ key, order }) => {
  sortKey.value = key
  sortOrder.value = order
  currentPage.value = 1
}
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const openModal = (th) => { selectedTheorem.value = th }
const closeModal = () => { selectedTheorem.value = null }
const retryLoad = () => { loadData() }

watch(() => route.params.section, () => {
  currentPage.value = 1
  loadData()
})

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.theory-view {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: var(--bg-primary);
}
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
  margin-top: 20px;
}
.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 60px 0;
  color: var(--text-muted);
  font-size: 18px;
}
.error-state button {
  margin-top: 12px;
  padding: 8px 20px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
}
.pagination button {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 6px 16px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: 0.2s;
}
.pagination button:hover:not(:disabled) {
  background: var(--bg-hover);
}
.pagination button:disabled {
  opacity: 0.4;
  cursor: default;
}
.pagination span {
  color: var(--text-secondary);
}
</style>