import { ref, watch } from 'vue'

const bookmarks = ref([])

// Загружаем из localStorage
const saved = localStorage.getItem('bookmarks')
if (saved) bookmarks.value = JSON.parse(saved)

watch(bookmarks, (val) => {
  localStorage.setItem('bookmarks', JSON.stringify(val))
}, { deep: true })

export function useBookmarks() {
  const toggle = (id) => {
    const idx = bookmarks.value.indexOf(id)
    if (idx > -1) {
      bookmarks.value.splice(idx, 1)
    } else {
      bookmarks.value.push(id)
    }
  }

  const isBookmarked = (id) => bookmarks.value.includes(id)

  return { bookmarks, toggle, isBookmarked }
}