<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useUsageStore } from '@/stores/usage'
import ImageGenerator from '@/components/ImageGenerator.vue'
import ImageResult from '@/components/ImageResult.vue'
import HistoryPanel from '@/components/HistoryPanel.vue'
import SettingsDrawer from '@/components/SettingsDrawer.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import GeneratingOverlay from '@/components/GeneratingOverlay.vue'
import WelcomeGuide from '@/components/WelcomeGuide.vue'

const GUIDE_SEEN_KEY = 'lingmo-guide-seen'

const settings = useSettingsStore()
const usage = useUsageStore()
usage.checkAndReset()

const settingsVisible = ref(false)
const historyVisible = ref(false)
const showGuide = ref(false)
const isGenerating = ref(false)
const generatingModel = ref('')
const currentImageIndex = ref(1)
const totalImages = ref(1)

onMounted(() => {
  const seen = localStorage.getItem(GUIDE_SEEN_KEY)
  if (!seen) {
    showGuide.value = true
  }
})

function closeGuide() {
  showGuide.value = false
  localStorage.setItem(GUIDE_SEEN_KEY, '1')
}

interface GeneratedImage {
  url: string
  base64: string
}

const generatedImages = ref<GeneratedImage[]>([])

function onImagesGenerated(images: GeneratedImage[]) {
  if (currentImageIndex.value === 1) {
    generatedImages.value = images
  } else {
    generatedImages.value = [...generatedImages.value, ...images]
  }
}

function onGenerating(value: boolean) {
  isGenerating.value = value
}

function onGeneratingProgress(current: number, total: number, model: string) {
  currentImageIndex.value = current
  totalImages.value = total
  generatingModel.value = model
}

function onHistoryReuse(_prompt: string) {
}
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="header-inner">
        <div class="brand-group">
          <span class="seal-mark">印</span>
          <div class="brand-text">
            <h1 class="brand">靈墨工坊</h1>
            <span class="brand-sub">Midnight Atelier</span>
          </div>
        </div>

        <div class="header-controls">
          <div class="usage-seal">
            <span class="seal-num">{{ usage.remaining }}</span>
            <span class="seal-label">今日</span>
          </div>
          <ThemeToggle />
          <button class="icon-btn" @click="historyVisible = true" title="历史记录">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="9" y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="1.5" y="9" width="5.5" height="5.5" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="9" y="9" width="5.5" height="5.5" rx="1" stroke="currentColor" stroke-width="1.2"/></svg>
          </button>
          <button class="icon-btn" @click="settingsVisible = true" title="设置">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" stroke-width="1.2"/><path d="M8 1v2.5M8 12.5V15M1 8h2.5M12.5 8H15M3.05 3.05l1.77 1.77M11.18 11.18l1.77 1.77M3.05 12.95l1.77-1.77M11.18 4.82l1.77-1.77" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
          </button>
          <button class="icon-btn guide-btn" @click="showGuide = true" title="使用指南">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.2"/><path d="M8 12V7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><circle cx="8" cy="4.5" r="0.8" fill="currentColor"/></svg>
          </button>
        </div>
      </div>
      <div class="header-line" />
    </header>

    <main class="app-main">
      <div class="main-column">
        <ImageGenerator
          @generated="onImagesGenerated"
          @generating="onGenerating"
          @generating-progress="onGeneratingProgress"
        />

        <ImageResult :images="generatedImages" />
      </div>
    </main>

    <SettingsDrawer
      v-model:visible="settingsVisible"
    />

    <HistoryPanel
      v-model:visible="historyVisible"
      @reuse="onHistoryReuse"
    />

    <GeneratingOverlay
      :visible="isGenerating"
      :model="generatingModel"
      :current-image="currentImageIndex"
      :total-images="totalImages"
    />

    <WelcomeGuide
      :visible="showGuide"
      @close="closeGuide"
    />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  position: relative;
  z-index: 1;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(var(--bg-rgb), 0.88);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.header-line {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(193, 59, 51, 0.15) 20%,
    rgba(193, 59, 51, 0.06) 50%,
    transparent 100%
  );
}

.header-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 32px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-group {
  display: flex;
  align-items: center;
  gap: 14px;
}

.seal-mark {
  font-family: var(--font-display);
  font-size: 26px;
  color: var(--accent);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid rgba(193, 59, 51, 0.35);
  border-radius: var(--radius-sm);
  background: rgba(193, 59, 51, 0.04);
  line-height: 1;
  user-select: none;
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.brand {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 400;
  letter-spacing: 0.06em;
  color: var(--text);
  margin: 0;
  line-height: 1.2;
}

.brand-sub {
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: var(--text-tertiary);
  text-transform: uppercase;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.usage-seal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  padding: 4px 10px;
  background: rgba(193, 59, 51, 0.06);
  border: 1px solid rgba(193, 59, 51, 0.15);
  border-radius: var(--radius-sm);
  min-width: 44px;
}

.seal-num {
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 600;
  color: var(--accent);
  line-height: 1.2;
}

.seal-label {
  font-family: var(--font-display);
  font-size: 10px;
  color: var(--text-tertiary);
  line-height: 1.3;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
}

.icon-btn:hover {
  background: var(--surface);
  border-color: rgba(255, 255, 255, 0.12);
  color: var(--text);
}

.guide-btn:hover {
  border-color: rgba(193, 59, 51, 0.25);
  color: var(--accent);
}

.app-main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 32px 100px;
}

.main-column {
  display: flex;
  flex-direction: column;
  gap: 56px;
}

@media (max-width: 768px) {
  .header-inner {
    padding: 0 16px;
    height: 54px;
  }

  .brand {
    font-size: 20px;
  }

  .seal-mark {
    width: 34px;
    height: 34px;
    font-size: 22px;
  }

  .app-main {
    padding: 32px 16px 80px;
  }

  .main-column {
    gap: 40px;
  }
}
</style>
