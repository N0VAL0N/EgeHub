<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <button class="modal-close" @click="close">✕</button>
      <div class="modal-body">
        <!-- ЛЕВАЯ ЧАСТЬ -->
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

          <!-- теги убраны -->

          <button class="bookmark-btn" @click="toggleBookmark">
            {{ isBookmarked ? '🔖 В закладках' : '☆ Добавить в закладки' }}
          </button>
        </div>

        <!-- ПРАВАЯ ЧАСТЬ -->
        <div class="modal-right">
          <!-- Несколько изображений с индивидуальными размерами -->
          <div v-if="imageItems.length > 1" class="multi-canvas">
            <div v-for="(item, index) in imageItems" :key="index" class="canvas-wrapper">
              <canvas
                :ref="el => { canvasRefs[index] = el }"
                :width="item.width || canvasWidth"
                :height="item.height || canvasHeight"
              ></canvas>
              <p class="canvas-caption" v-if="item.caption">{{ item.caption }}</p>
            </div>
          </div>
          <!-- Одно изображение -->
          <div v-else class="canvas-wrapper">
            <canvas ref="canvasRef" :width="canvasWidth" :height="canvasHeight"></canvas>
          </div>
        </div>
      </div>

      <div v-if="visualizationItems.length" class="modal-footer-explanation">
        <div v-for="(item, index) in visualizationItems" :key="index" class="explanation-item">
          ★ {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import { useMathStore } from '../store'
import { useBookmarks } from '@core/composables/useBookmarks'
import { drawFigure } from '../render'

const props = defineProps({
  theorem: Object
})
const emit = defineEmits(['close', 'bookmark'])

const mathStore = useMathStore()
const { toggle, isBookmarked: checkBookmark } = useBookmarks()

const canvasRef = ref(null)
const canvasRefs = ref([])
const isBookmarked = ref(false)

// ---- список изображений с размерами ----
const imageItems = computed(() => {
  const vis = mathStore.getVisualization(props.theorem?.id)
  if (vis?.params?.images) {
    return vis.params.images.map((src, index) => ({
      src,
      caption: vis.params.captions?.[index] || '',
      width: vis.params.imageWidths?.[index] || 500,
      height: vis.params.imageHeights?.[index] || 400
    }))
  }
  if (vis?.params?.image) {
    return [{
      src: vis.params.image,
      caption: '',
      width: vis.params.canvasWidth || 500,
      height: vis.params.canvasHeight || 400
    }]
  }
  return []
})

const imageList = computed(() => imageItems.value.map(item => item.src))

// ---- дефолтные размеры ----
const canvasWidth = computed(() => {
  const vis = mathStore.getVisualization(props.theorem?.id)
  return vis?.params?.canvasWidth || 500
})
const canvasHeight = computed(() => {
  const vis = mathStore.getVisualization(props.theorem?.id)
  return vis?.params?.canvasHeight || 400
})

// ---- остальные computed ----
const formula = computed(() => {
  const desc = props.theorem?.description || ''
  const match = desc.match(/[A-Za-z]+\s*=\s*.+/)
  return match ? match[0] : null
})

const visualizationItems = computed(() => {
  const vis = props.theorem?.visualization || ''
  return vis.split(/[;,]\s*/).filter(item => item.trim().length > 0)
})

// ---- методы ----
const close = () => emit('close')

const toggleBookmark = () => {
  toggle(props.theorem.id)
  isBookmarked.value = checkBookmark(props.theorem.id)
  emit('bookmark', props.theorem.id)
}

const renderTheorem = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const vis = mathStore.getVisualization(props.theorem.id)
  if (vis) {
    drawFigure(ctx, vis.type, vis.params)
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'var(--text-muted)'
    ctx.font = '20px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('Нет визуализации', canvas.width / 2, canvas.height / 2)
  }
}

const renderMulti = () => {
  const items = imageItems.value
  if (!items.length) return

  items.forEach((item, index) => {
    const canvas = canvasRefs.value[index]
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.src = item.src
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }
    img.onerror = () => {
      ctx.fillStyle = '#ccc'
      ctx.font = '20px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('Ошибка загрузки', canvas.width / 2, canvas.height / 2)
    }
  })
}

onMounted(() => {
  isBookmarked.value = checkBookmark(props.theorem.id)
  if (imageItems.value.length > 1) {
    nextTick(() => renderMulti())
  } else {
    renderTheorem()
  }
})

watch(() => props.theorem, () => {
  isBookmarked.value = checkBookmark(props.theorem.id)
  if (imageItems.value.length > 1) {
    nextTick(() => renderMulti())
  } else {
    renderTheorem()
  }
})
</script>

<style scoped>
/* ---- overlay ---- */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

/* ---- контент ---- */
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
  scrollbar-width: none;
  -ms-overflow-style: none;
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

/* ---- тело ---- */
.modal-body {
  display: flex;
  gap: 28px;
  flex-wrap: wrap;
}

/* ---- левая часть ---- */
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
.modal-id {
  color: var(--color-primary);
  font-size: 14px;
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

/* ---- определение ---- */
.modal-definition {
  background: var(--bg-tertiary);
  padding: 12px 16px;
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-primary);
}
.modal-definition strong {
  display: block;
  font-size: 16px;
  color: var(--text-primary);
  margin-bottom: 4px;
}
.modal-definition .description-text {
  margin: 0;
}

/* ---- теорема ---- */
.modal-theorem {
  background: var(--bg-tertiary);
  padding: 12px 16px;
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-primary);
}
.modal-theorem strong {
  display: block;
  font-size: 16px;
  color: var(--text-primary);
  margin-bottom: 4px;
}
.modal-theorem .description-text {
  margin: 0;
}

/* ---- описание ---- */
.modal-description .description-text {
  margin: 0;
}

/* ---- общий текст ---- */
.description-text {
  white-space: pre-line;
  line-height: 1.8;
  color: var(--text-secondary);
}

/* ---- формула ---- */
.modal-formula {
  background: var(--bg-tertiary);
  padding: 12px 16px;
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-primary);
}
.modal-formula code {
  font-size: 16px;
  color: var(--color-primary);
}

/* ---- теги ---- */
.modal-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.tag {
  background: var(--bg-tertiary);
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  color: var(--text-muted);
}

/* ---- кнопка закладок ---- */
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

/* ---- правая часть ---- */
.modal-right {
  flex: 1 1 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 400px;
}
.modal-right canvas {
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  max-width: 100%;
  height: auto;
}

/* ---- несколько канвасов ---- */
.multi-canvas {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  align-items: center;
}
.canvas-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.canvas-caption {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 4px;
}

/* ---- пояснение под канвасом ---- */
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