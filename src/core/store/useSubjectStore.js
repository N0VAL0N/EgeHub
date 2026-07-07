import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '@core/firebase'
import { doc, getDoc } from 'firebase/firestore'

const REPO_URL = 'https://raw.githubusercontent.com/N0VAL0N/EgeHub/main'

export const useSubjectStore = defineStore('subject', () => {
  const theories = ref({})
  const isLoading = ref(false)
  const error = ref(null)

  const loadTheory = async (subject, section) => {
    const key = `${subject}/${section}`
    isLoading.value = true
    error.value = null

    try {
      const docRef = doc(db, 'theories', key)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        theories.value[key] = docSnap.data().theorems || []
      } else {
        const res = await fetch(`${REPO_URL}/data/${subject}/${section}/theory.json`)
        if (!res.ok) throw new Error('Не удалось загрузить теорию')
        const data = await res.json()
        theories.value[key] = data.theorems || []
      }
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  const getTheorems = (subject, section) => {
    return theories.value[`${subject}/${section}`] || []
  }

  const getImageUrl = (subject, section, id) => {
    return `${REPO_URL}/data/${subject}/${section}/images/${id}.png`
  }

  return {
    theories,
    isLoading,
    error,
    loadTheory,
    getTheorems,
    getImageUrl
  }
})