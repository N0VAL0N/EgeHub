/**
 * Утилиты для работы с данными
 */

// Обрезка текста до нужной длины
export function truncate(text, maxLength = 80) {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

// Генерация уникального ID
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

// Задержка (для анимаций)
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Дебаунс (для поиска)
export function debounce(fn, delay = 300) {
  let timer = null
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// Форматирование даты
export function formatDate(date) {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Проверка на пустой объект
export function isEmpty(obj) {
  return obj && Object.keys(obj).length === 0
}

// Группировка массива по ключу
export function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const group = item[key]
    if (!acc[group]) acc[group] = []
    acc[group].push(item)
    return acc
  }, {})
}

// Сортировка массива по ключу
export function sortBy(arr, key, order = 'asc') {
  return [...arr].sort((a, b) => {
    let valA = a[key]
    let valB = b[key]
    if (typeof valA === 'string') valA = valA.toLowerCase()
    if (typeof valB === 'string') valB = valB.toLowerCase()
    if (valA < valB) return order === 'asc' ? -1 : 1
    if (valA > valB) return order === 'asc' ? 1 : -1
    return 0
  })
}