<script setup lang="ts">
import { computed } from 'vue'

interface GeneratedImage {
  url: string
  base64: string
}

const props = defineProps<{
  images: GeneratedImage[]
}>()

const hasImages = computed(() => props.images.length > 0)
</script>

<template>
  <section v-if="hasImages" class="result">
    <div class="section-head">
      <span class="head-accent" />
      <h2 class="section-title">生成结果</h2>
      <span class="head-sub">{{ images.length }} 幅</span>
    </div>

    <div class="image-grid">
      <div
        v-for="(img, idx) in images"
        :key="idx"
        class="image-card"
      >
        <div class="card-inner">
          <img
            :src="img.url || img.base64"
            :alt="`第 ${idx + 1} 张生成图像`"
            class="card-img"
            loading="lazy"
          />
          <div class="card-seal">{{ idx + 1 }}</div>
          <a
            v-if="img.url"
            :href="img.url"
            download
            class="card-dl"
            title="下载原图"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v9M4 7l4 4 4-4M2 13h12" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.result {
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
}

.section-head {
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin-bottom: 28px;
}

.head-accent {
  width: 3px;
  height: 22px;
  background: var(--accent);
  border-radius: 1px;
  flex-shrink: 0;
  opacity: 0.8;
}

.section-title {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 400;
  letter-spacing: 0.06em;
  color: var(--text);
  margin: 0;
  line-height: 1;
}

.head-sub {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: var(--text-tertiary);
  margin-top: 2px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.image-card {
  aspect-ratio: 1 / 1;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.04);
  position: relative;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.image-card:hover {
  transform: translateY(-3px);
  border-color: rgba(193, 59, 51, 0.20);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(193, 59, 51, 0.08);
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.image-card:hover .card-img {
  transform: scale(1.04);
}

.card-seal {
  position: absolute;
  top: 12px;
  left: 12px;
  font-family: var(--font-display);
  font-size: 14px;
  color: var(--accent);
  background: rgba(var(--bg-rgb), 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(193, 59, 51, 0.25);
  border-radius: var(--radius-sm);
  opacity: 0;
  transform: translateY(-4px);
  transition: all 0.3s ease;
}

.image-card:hover .card-seal {
  opacity: 1;
  transform: translateY(0);
}

.card-dl {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(8, 8, 10, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-sm);
  color: var(--text-tertiary);
  text-decoration: none;
  cursor: pointer;
  opacity: 0;
  transform: translateY(-4px);
  transition: all 0.3s ease;
}

.image-card:hover .card-dl {
  opacity: 1;
  transform: translateY(0);
}

.card-dl:hover {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

@media (max-width: 768px) {
  .image-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .section-title { font-size: 22px; }
}
</style>
