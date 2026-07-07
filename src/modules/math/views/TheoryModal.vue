<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <button class="modal-close" @click="close">✕</button>

      <div class="modal-body">
        <!-- Левая часть: описание -->
        <div class="modal-left">
          <h2>{{ theorem.name }}</h2>
          <div class="modal-meta">
            <span class="meta-item">Уровень: {{ theorem.level }}</span>
            <span class="meta-item">Тип: {{ theorem.type }}</span>
          </div>

          <div v-if="theorem.type === 'definition'" class="modal-definition">
            <strong>Определение:</strong>
            <p class="description-text">{{ theorem.description }}</p>
          </div>
          <div v-else-if="theorem.type === 'theorem'" class="modal-theorem">
            <strong>Теорема:</strong>
            <p class="description-text">{{ theorem.description }}</p>
          </div>
          <div v-else class="modal-description">
            <p class="description-text">{{ theorem.description }}</p>
          </div>

          <div v-if="formula" class="modal-formula">
            <strong>Формула:</strong>
            <code>{{ formula }}</code>
          </div>

          <button class="bookmark-btn" @click="toggleBookmark">
            {{ isBookmarked ? '🔖 В закладках' : '☆ Добавить в закладки' }}
          </button>
        </div>

        <!-- Правая часть: визуализация -->
        <div class="modal-right">
          <!-- 1. Если есть визуализация (рендер на canvas) -->
          <canvas
            v-if="visData"
            ref="canvasRef"
            :width="canvasWidth"
            :height="canvasHeight"
          ></canvas>

          <!-- 2. Если нет визуализации, но есть PNG-картинка -->
          <img
            v-else-if="imageUrl && !imageError"
            :src="imageUrl"
            alt="Иллюстрация"
            @error="imageError = true"
            class="visualization-image"
          />

          <!-- 3. Если ничего нет -->
          <div v-else class="no-image">Нет визуализации</div>
        </div>
      </div>

      <!-- Пояснение под модалкой -->
      <div v-if="visualizationItems.length" class="modal-footer-explanation">
        <div v-for="(item, index) in visualizationItems" :key="index" class="explanation-item">
          ★ {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useSubjectStore } from '@core/store/useSubjectStore'
import { useBookmarks } from '@core/composables/useBookmarks'
import { drawFigure } from '@modules/math/render'

const props = defineProps({
  theorem: Object,
  subject: String,
  section: String
})

const emit = defineEmits(['close', 'bookmark'])

const store = useSubjectStore()
const { toggle, isBookmarked: checkBookmark } = useBookmarks()

// --- Состояние ---
const canvasRef = ref(null)
const visData = ref(null)
const imageError = ref(false)
const isBookmarked = ref(false)

// --- Определяем тип визуализации по ID ---
const getVisualizationType = (id) => {
  const map = {
    'th_001': 'line',
    'th_002': 'angle',
    'th_003': 'angle',
    'th_004': 'line',
    'th_005': 'triangle',
    'th_006': 'triangle',
    'th_007': 'triangle',
    'th_008': 'triangle',
    'th_009': 'triangle',
    'th_010': 'triangle',
    'th_011': 'triangle',
    'th_012': 'triangle',
    'th_014': 'triangle',
    'th_016': 'triangle',
    'th_017': 'triangle',
    'th_019': 'triangle',
    'th_020': 'triangle',
    'th_022': 'line',
    'th_023': 'angle',
    'th_024': 'line',
    'th_025': 'angle',
    'th_027': 'circle',
    'th_029': 'circle',
    'th_031': 'circle',
    'th_032': 'quadrilateral',
    'th_033': 'quadrilateral',
    'th_034': 'quadrilateral',
    'th_035': 'quadrilateral',
    'th_042': 'quadrilateral',
    'th_044': 'triangle',
    'th_045': 'quadrilateral',
    'th_047': 'circle',
    'th_048': 'triangle',
    'th_049': 'triangle',
    'th_050': 'triangle',
    'th_051': 'triangle',
    'th_052': 'triangle',
    'th_053': 'triangle',
    'th_058': 'triangle',
    'th_061': 'triangle',
    'th_062': 'triangle',
    'th_063': 'triangle',
    'th_064': 'triangle',
    'th_065': 'quadrilateral',
    'th_066': 'quadrilateral',
    'th_067': 'triangle',
    'th_068': 'quadrilateral',
    'th_069': 'plane',
    'th_070': 'plane',
    'th_071': 'plane',
    'th_072': 'plane',
    'th_073': 'skew',
    'th_074': 'plane',
    'th_075': 'plane',
    'th_076': 'dihedral',
    'th_077': 'plane',
    'th_078': 'solids',
    'th_080': 'solids',
    'th_082': 'solids',
    'th_083': 'solids',
    'th_084': 'solids',
    'th_086': 'solids',
    'th_087': 'cylinder',
    'th_088': 'cylinder',
    'th_089': 'cone',
    'th_090': 'cone',
    'th_091': 'sphere',
    'th_092': 'sphere',
    'th_094': 'solids',
    'th_095': 'cylinder',
    'th_096': 'solids',
    'th_098': 'cone',
    'th_100': 'sphere',
    'th_101': 'sphere',
    'th_102': 'vector',
    'th_103': 'vector',
    'th_104': 'vector',
    'th_105': 'vector',
    'th_106': 'coordinate',
    'th_107': 'coordinate',
    'th_108': 'vector',
    'th_109': 'plane',
    'th_110': 'plane',
    'th_111': 'movement',
    'th_112': 'movement',
    'th_115': 'movement',
    'th_116': 'coordinate',
    'th_117': 'triangle',
    'th_118': 'triangle',
    'th_119': 'triangle',
    'th_128': 'angle',
    'th_135': 'quadrilateral',
    'th_136': 'vector',
    'th_139': 'coordinate',
    'th_141': 'vector',
    'th_142': 'plane',
    'th_149': 'dihedral',
    'th_153': 'cone',
    'th_154': 'sphere',
    'th_155': 'sphere',
    'th_158': 'movement',
    'th_162': 'special',
    'th_164': 'triangle',
    'th_165': 'special',
    'th_170': 'triangle',
    'th_172': 'circle',
    'th_175': 'circle',
    'th_178': 'line',
    'th_179': 'line',
    'th_185': 'sphere',
    'th_187': 'special',
    'th_188': 'angle',
    'th_189': 'line',
    'th_190': 'special',
    'th_191': 'circle',
    'th_192': 'circle',
    'th_193': 'triangle',
    'th_196': 'special',
    'th_197': 'circle',
    'th_199': 'solids',
    'th_202': 'vector',
    'th_203': 'plane',
    'th_210': 'plane',
    'th_212': 'skew',
    'th_213': 'line',
    'th_219': 'triangle',
    'th_220': 'triangle',
    'th_221': 'triangle',
    'th_222': 'triangle',
    'th_223': 'triangle',
    'th_224': 'triangle',
    'th_225': 'vector',
    'th_226': 'vector',
    'th_227': 'vector',
    'th_229': 'vector',
    'th_230': 'vector',
    'th_231': 'vector',
    'th_232': 'vector',
    'th_233': 'vector',
    'th_235': 'coordinate',
    'th_236': 'coordinate',
    'th_237': 'coordinate',
    'th_239': 'circle'
  }
  return map[id] || null
}

// --- Загрузка визуализации ---
const loadVisualization = async () => {
  if (!props.theorem) return

  const type = getVisualizationType(props.theorem.id)
  if (!type) {
    visData.value = null
    return
  }

  try {
    const url = store.getVisualizationUrl(props.subject, props.section, type)
    const res = await fetch(url)
    if (!res.ok) throw new Error('Визуализация не найдена')

    const data = await res.json()
    const vis = data[props.theorem.id]

    if (vis) {
      visData.value = vis
      await nextTick()
      renderVisualization()
    } else {
      visData.value = null
    }
  } catch (e) {
    console.warn('Ошибка загрузки визуализации:', e)
    visData.value = null
  }
}

// --- Рендеринг на canvas ---
const renderVisualization = () => {
  const canvas = canvasRef.value
  if (!canvas || !visData.value) return

  const ctx = canvas.getContext('2d')
  const { type, params } = visData.value
  drawFigure(ctx, type, params)
}

// --- URL для PNG-картинки ---
const imageUrl = computed(() => {
  if (!props.theorem || !props.subject || !props.section) return null
  return store.getImageUrl(props.subject, props.section, props.theorem.id)
})

// --- Размеры canvas ---
const canvasWidth = computed(() => visData.value?.params?.canvasWidth || 500)
const canvasHeight = computed(() => visData.value?.params?.canvasHeight || 400)

// --- Формула из описания ---
const formula = computed(() => {
  const desc = props.theorem?.description || ''
  const match = desc.match(/[A-Za-z]+\s*=\s*.+/)
  return match ? match[0] : null
})

// --- Пункты визуализации из строки ---
const visualizationItems = computed(() => {
  const vis = props.theorem?.visualization || ''
  return vis.split(/[;,]\s*/).filter(item => item.trim().length > 0)
})

// --- Закладки ---
const toggleBookmark = () => {
  toggle(props.theorem.id)
  isBookmarked.value = checkBookmark(props.theorem.id)
  emit('bookmark', props.theorem.id)
}

const close = () => emit('close')

// --- Жизненный цикл ---
onMounted(() => {
  isBookmarked.value = checkBookmark(props.theorem.id)
  loadVisualization()
})

watch(() => props.theorem, () => {
  isBookmarked.value = checkBookmark(props.theorem.id)
  imageError.value = false
  loadVisualization()
})
</script>

<style scoped>
/* --- Оверлей --- */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* --- Контент --- */
.modal-content {
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  max-width: 1000px;
  width: 92%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 28px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
}
.modal-content::-webkit-scrollbar {
  display: none;
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 16px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 28px;
  cursor: pointer;
  transition: 0.2s;
}
.modal-close:hover {
  color: var(--text-primary);
}

/* --- Тело --- */
.modal-body {
  display: flex;
  gap: 28px;
  flex-wrap: wrap;
}

/* --- Левая часть --- */
.modal-left {
  flex: 1 1 300px;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.modal-left h2 {
  margin: 0;
  font-size: 24px;
}
.modal-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.meta-item {
  background: var(--bg-tertiary);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  color: var(--text-secondary);
}

.modal-definition,
.modal-theorem,
.modal-formula {
  background: var(--bg-tertiary);
  padding: 12px 16px;
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-primary);
}
.modal-definition strong,
.modal-theorem strong,
.modal-formula strong {
  display: block;
  font-size: 16px;
  color: var(--text-primary);
  margin-bottom: 4px;
}
.description-text {
  white-space: pre-line;
  line-height: 1.8;
  color: var(--text-secondary);
  margin: 0;
}
.modal-formula code {
  font-size: 16px;
  color: var(--color-primary);
}

.bookmark-btn {
  background: var(--color-primary);
  border: none;
  color: white;
  padding: 8px 18px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 14px;
  transition: 0.2s;
  align-self: flex-start;
}
.bookmark-btn:hover {
  background: var(--color-primary-hover);
}

/* --- Правая часть --- */
.modal-right {
  flex: 1 1 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 400px;
  justify-content: center;
}
.modal-right canvas {
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  max-width: 100%;
  height: auto;
}
.visualization-image {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}
.no-image {
  color: var(--text-muted);
  font-size: 18px;
  padding: 40px;
  text-align: center;
}

/* --- Пояснение --- */
.modal-footer-explanation {
  margin-top: 16px;
  padding: 12px 16px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-primary);
}
.explanation-item {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
}
</style>