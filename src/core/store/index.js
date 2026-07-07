import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // Тема
  const theme = ref('dark')
  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  // Выбранный предмет и раздел (для теории)
  const selectedSubject = ref('math')
  const selectedSection = ref('geometry')

  const subjectOptions = [
    { value: 'math', label: 'Математика' },
    { value: 'physics', label: 'Физика' },
    { value: 'chemistry', label: 'Химия' },
    { value: 'biology', label: 'Биология' },
    { value: 'informatics', label: 'Информатика' },
    { value: 'english', label: 'Английский' }
  ]

  const sectionOptions = computed(() => {
    if (selectedSubject.value === 'math') {
      return [
        { value: 'algebra', label: 'Алгебра' },
        { value: 'geometry', label: 'Геометрия' },
        { value: 'trigonometry', label: 'Тригонометрия' }
      ]
    }
    return []
  })

  return {
    theme,
    toggleTheme,
    selectedSubject,
    selectedSection,
    subjectOptions,
    sectionOptions
  }
})