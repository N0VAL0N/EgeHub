import { defineStore } from 'pinia'
import { ref } from 'vue'

// Базовый URL для raw-ссылок на GitHub
const REPO_URL = 'https://raw.githubusercontent.com/N0VAL0N/EgeHub/main'

export const useSubjectStore = defineStore('subject', () => {
  const theories = ref({})
  const isLoading = ref(false)
  const error = ref(null)

  // --- Загрузка теории с GitHub ---
  const loadTheory = async (subject, section) => {
    const key = `${subject}/${section}`
    isLoading.value = true
    error.value = null

    try {
      const url = `${REPO_URL}/data/${subject}/${section}/theory.json`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      const data = await res.json()
      theories.value[key] = data.theorems || []
    } catch (e) {
      error.value = e.message
      console.error('Ошибка загрузки теории:', e)
    } finally {
      isLoading.value = false
    }
  }

  // --- Получить теоремы для предмета/раздела ---
  const getTheorems = (subject, section) => {
    return theories.value[`${subject}/${section}`] || []
  }

  // --- URL для изображения (PNG) ---
  const getImageUrl = (subject, section, id) => {
    return `${REPO_URL}/data/${subject}/${section}/images/${id}.png`
  }

  // --- URL для визуализации (JSON, локально в public) ---
  const getVisualizationUrl = (subject, section, type) => {
    return `/data/${subject}/${section}/visualizations/${type}.json`
  }

  return {
    theories,
    isLoading,
    error,
    loadTheory,
    getTheorems,
    getImageUrl,
    getVisualizationUrl
  }
})