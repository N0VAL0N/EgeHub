/**
 * Глобальные константы
 */

export const SUBJECTS = [
  { value: 'math', label: 'Математика', icon: '📐' },
  { value: 'physics', label: 'Физика', icon: '⚛️' },
  { value: 'chemistry', label: 'Химия', icon: '🧪' },
  { value: 'biology', label: 'Биология', icon: '🧬' },
  { value: 'informatics', label: 'Информатика', icon: '💻' },
  { value: 'english', label: 'Английский', icon: '🇬🇧' }
]

export const THEORY_TYPES = [
  'definition',
  'theorem',
  'axiom',
  'formula',
  'property',
  'method',
  'lemma'
]

export const LEVELS = [7, 8, 9, 10, 11]

export const PAGE_SIZE = 20

export const THEMES = {
  dark: {
    background: '#0f172a',
    surface: '#1e293b',
    border: '#334155',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    primary: '#3b82f6'
  },
  light: {
    background: '#f1f5f9',
    surface: '#ffffff',
    border: '#e2e8f0',
    text: '#0f172a',
    textSecondary: '#64748b',
    primary: '#3b82f6'
  }
}

export const ROUTES = {
  HOME: '/',
  THEORY: '/theory',
  LESSONS: '/lessons',
  PRACTICE: '/practice',
  BOOKMARKS: '/bookmarks',
  STATS: '/stats',
  SETTINGS: '/settings'
}