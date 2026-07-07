import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMathStore = defineStore('math', () => {
  // ---- состояние ----
  const geometryTheorems = ref([])
  const geometryVisualizations = ref({})
  const isLoading = ref(false)
  const error = ref(null)

  // ---- список только нужных файлов визуализаций ----
  const VISUALIZATION_FILES = [
    'line.json',
    'cylinder.json',
    'cone.json',
    'sphere.json',
    'dihedral.json',
    'skew.json',
    'special.json'
  ]

  // ---- загрузка теории (один файл) ----
  const loadTheory = async () => {
    try {
      const res = await fetch('/data/math/geometry/theory.json')
      if (!res.ok) throw new Error('Ошибка загрузки теории')
      const data = await res.json()
      geometryTheorems.value = data.theorems || []
    } catch (e) {
      console.error('Ошибка загрузки теории:', e)
      error.value = e.message
    }
  }

  // ---- загрузка визуализаций из нужных файлов ----
  const loadVisualizations = async () => {
    isLoading.value = true
    error.value = null
    geometryVisualizations.value = {}

    try {
      const promises = VISUALIZATION_FILES.map(async (filename) => {
        const path = `/data/math/geometry/visualizations/${filename}`
        const res = await fetch(path)
        if (!res.ok) {
          console.warn(`Файл ${filename} не найден, пропускаем`)
          return null
        }
        return res.json()
      })

      const results = await Promise.all(promises)

      results.forEach((data) => {
        if (data && typeof data === 'object') {
          Object.assign(geometryVisualizations.value, data)
        }
      })

     
    } catch (e) {
      console.error('Ошибка загрузки визуализаций:', e)
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  // ---- загрузка всего (теория + визуализации) ----
  const loadAll = async () => {
    await Promise.all([
      loadTheory(),
      loadVisualizations()
    ])
  }

  // ---- получить визуализацию по ID ----
  const getVisualization = (id) => {
    return geometryVisualizations.value[id] || null
  }

  // ---- получить теоремы для текущего раздела ----
  const getCurrentTheorems = (section) => {
    if (section === 'geometry') {
      return geometryTheorems.value
    }
    return []
  }

  // ---- загрузка алгебры (опционально) ----
  const algebraTheorems = ref([])
  const loadAlgebra = async () => {
    try {
      const res = await fetch('/data/math/algebra/theory.json')
      if (!res.ok) throw new Error('Ошибка загрузки алгебры')
      const data = await res.json()
      algebraTheorems.value = data.theorems || []
    } catch (e) {
      console.error('Ошибка загрузки алгебры:', e)
    }
  }

  return {
    // состояние
    geometryTheorems,
    geometryVisualizations,
    algebraTheorems,
    isLoading,
    error,

    // методы
    loadTheory,
    loadVisualizations,
    loadAll,
    loadAlgebra,
    getVisualization,
    getCurrentTheorems
  }
})