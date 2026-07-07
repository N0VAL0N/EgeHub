<template>
  <div class="landing">
    <h1>Выберите предмет</h1>
    <div class="subject-grid">
      <div
        class="subject-card"
        v-for="subj in subjects"
        :key="subj.name"
        @click="goToSubject(subj)"
      >
        <div class="subject-icon">{{ subj.icon }}</div>
        <div class="subject-name">{{ subj.name }}</div>
        <div class="subject-desc">{{ subj.desc }}</div>
        <div v-if="!subj.ready" class="subject-status">🚧 В разработке</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAppStore } from '@core/store'

const router = useRouter()
const store = useAppStore()

const subjects = [
  { name: 'Математика', icon: '📐', desc: 'Алгебра, геометрия, тригонометрия', route: '/theory', ready: true },
  { name: 'Физика', icon: '⚛️', desc: 'Механика, оптика, термодинамика', route: '/theory', ready: false },
  { name: 'Химия', icon: '🧪', desc: 'Органическая, неорганическая', route: '/theory', ready: false },
  { name: 'Биология', icon: '🧬', desc: 'Анатомия, ботаника, генетика', route: '/theory', ready: false },
  { name: 'Информатика', icon: '💻', desc: 'Программирование, алгоритмы', route: '/theory', ready: false },
  { name: 'Английский', icon: '🇬🇧', desc: 'Грамматика, лексика', route: '/theory', ready: false }
]

const goToSubject = (subj) => {
  if (subj.ready) {
    // Устанавливаем предмет в store
    store.selectedSubject = subj.name.toLowerCase()
    router.push('/theory')
  }
}
</script>

<style scoped>
.landing {
  padding: 40px;
  overflow-y: auto;
  flex: 1;
}
h1 {
  text-align: center;
  margin-bottom: 40px;
  color: #f8fafc;
}
.subject-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
  max-width: 1000px;
  margin: 0 auto;
}
.subject-card {
  background: #1e293b;
  padding: 24px 16px;
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  transition: 0.3s;
  border: 1px solid #334155;
}
.subject-card:hover {
  transform: translateY(-6px);
  border-color: #3b82f6;
  background: #2d3a52;
}
.subject-icon {
  font-size: 48px;
  margin-bottom: 12px;
}
.subject-name {
  font-size: 18px;
  font-weight: 600;
  color: #f8fafc;
}
.subject-desc {
  font-size: 13px;
  color: #94a3b8;
  margin-top: 4px;
}
.subject-status {
  font-size: 12px;
  color: #f59e0b;
  margin-top: 8px;
}
</style>