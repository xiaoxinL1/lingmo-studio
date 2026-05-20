<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  visible: boolean
  model?: string
  currentImage?: number
  totalImages?: number
}>(), {
  model: '',
  currentImage: 1,
  totalImages: 1,
})

const modelName = computed(() => {
  const map: Record<string, string> = {
    'ByteDance-Seed/Seedream-4.0': 'Seedream 4.0',
    'Qwen/Qwen-Image': 'Qwen Image',
    'gpt-image-2': 'GPT Image 2',
    'dall-e-3': 'DALL-E 3',
    'black-forest-labs/flux-1.1-pro': 'Flux 1.1 Pro',
    'black-forest-labs/flux-schnell': 'Flux Schnell',
    'gemini-3.1-flash-image-preview': 'Gemini 3.1 Flash',
  }
  return map[props.model] || props.model.split('/').pop() || props.model
})
</script>

<template>
  <Transition name="overlay">
    <div v-if="visible" class="overlay">
      <div class="overlay-bg" />
      <div class="overlay-card">
        <div class="ink-loader">
          <svg class="ink-circle" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" stroke-width="2"
              stroke-dasharray="276.46" stroke-dashoffset="0" stroke-linecap="round"
              class="ink-track" />
          </svg>
          <span class="ink-core">墨</span>
        </div>

        <h3 class="title">正在创作中</h3>
        <p class="model">{{ modelName }}</p>
        <p v-if="totalImages > 1" class="progress">第 {{ currentImage }} / {{ totalImages }} 张</p>

        <div class="ink-dots">
          <span class="dot d1" />
          <span class="dot d2" />
          <span class="dot d3" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay-bg {
  position: absolute;
  inset: 0;
  background: rgba(var(--bg-rgb), 0.82);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.overlay-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  padding: 44px 52px;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  text-align: center;
}

.overlay-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(193, 59, 51, 0.15) 0%,
    transparent 50%,
    rgba(193, 59, 51, 0.08) 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.ink-loader {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
}

.ink-circle {
  position: absolute;
  inset: 0;
}

.ink-track {
  animation: ink-draw 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  transform-origin: center;
  opacity: 0.6;
}

.ink-core {
  font-family: var(--font-display);
  font-size: 30px;
  color: var(--accent);
  line-height: 1;
  animation: ink-pulse 2s ease-in-out infinite;
}

.title {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 400;
  letter-spacing: 0.08em;
  color: var(--text);
  margin: 0;
}

.model {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: var(--text-tertiary);
  margin: 0;
  text-transform: uppercase;
}

.progress {
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--text-tertiary);
  margin: 0;
}

.ink-dots { display: flex; gap: 8px; }

.dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
  animation: dot-breathe 1.4s ease-in-out infinite;
}

.d2 { animation-delay: 0.2s; }
.d3 { animation-delay: 0.4s; }

.overlay-enter-active { transition: opacity 0.35s ease; }
.overlay-leave-active { transition: opacity 0.2s ease; }
.overlay-enter-from,
.overlay-leave-to { opacity: 0; }

@keyframes ink-draw {
  0% { stroke-dashoffset: 276.46; }
  50% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -276.46; }
}

@keyframes ink-pulse {
  0%, 100% { opacity: 0.65; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.08); }
}

@keyframes dot-breathe {
  0%, 80%, 100% { transform: scale(0.5); opacity: 0.25; }
  40% { transform: scale(1); opacity: 1; }
}
</style>
