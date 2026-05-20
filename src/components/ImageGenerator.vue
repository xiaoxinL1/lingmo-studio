<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  NForm, NFormItem, NInput, NSelect, NSlider, NSwitch, NPopover, NAlert, useMessage
} from 'naive-ui'
import { generateImage, AVAILABLE_MODELS, getRecommendedModel } from '@/api/imageApi'
import { useUsageStore } from '@/stores/usage'
import { v4 as uuidv4 } from '@/utils/uuid'
import { saveHistory } from '@/utils/db'
import type { ImageSize, QualityLevel } from '@/types'

const emit = defineEmits<{
  generated: [images: { url: string; base64: string }[]]
  generating: [value: boolean]
  'generating-progress': [current: number, total: number, model: string]
}>()

const message = useMessage()
const usage = useUsageStore()

const prompt = ref('')
const negativePrompt = ref('low quality, blurry, deformed')
const showNegative = ref(false)
const generating = ref(false)

const sizes: ImageSize[] = [
  { label: '1:1', width: 1024, height: 1024, value: '1024x1024' },
  { label: '1:1 HD', width: 2048, height: 2048, value: '2048x2048' },
  { label: '3:4', width: 768, height: 1024, value: '768x1024' },
  { label: '16:9', width: 1024, height: 576, value: '1024x576' },
  { label: '16:9 HD', width: 2048, height: 1152, value: '2048x1152' },
  { label: '9:16', width: 576, height: 1024, value: '576x1024' },
]
const selectedSize = ref('1024x1024')
const numImages = ref(1)
const enhanceEnabled = ref(false)
const selectedModel = ref('ByteDance-Seed/Seedream-4.0')
const selectedQuality = ref<QualityLevel>('medium')

const modelOpts = AVAILABLE_MODELS.map(m => ({ label: m.label, value: m.value }))
const qualityOpts = [
  { label: '快速', value: 'low' as QualityLevel },
  { label: '标准', value: 'medium' as QualityLevel },
  { label: '精细', value: 'high' as QualityLevel },
]

const isChinese = computed(() => /[\u4e00-\u9fa5]/.test(prompt.value))
const recommendedModel = computed(() => getRecommendedModel(prompt.value))
const showRec = computed(() => isChinese.value && selectedModel.value !== recommendedModel.value)

const canGenerate = computed(() => prompt.value.trim().length > 0 && !generating.value && usage.remaining > 0)

let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch(prompt, () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    if (isChinese.value && !selectedModel.value.includes('Seed') && !selectedModel.value.includes('Qwen')) {
      const info = AVAILABLE_MODELS.find(m => m.value === recommendedModel.value)
      if (info) message.info(`推荐 ${info.label} 以获得更好效果`, { duration: 2500 })
    }
  }, 500)
})

const samples = [
  '一只穿着宇航服的柴犬，在月球上奔跑，数字艺术',
  '山水水墨画风格，孤舟蓑笠翁，独钓寒江雪',
  '赛博朋克城市夜景，霓虹灯光，雨夜街道',
  '可爱猫咪在花丛中玩耍，宫崎骏风格，柔光',
]

function pick(p: string) { prompt.value = p }
function switchModel() { selectedModel.value = recommendedModel.value }

async function handleGenerate() {
  if (!canGenerate.value) return
  generating.value = true
  emit('generating', true)
  emit('generating-progress', 1, numImages.value, selectedModel.value)

  try {
    const finalPrompt = enhanceEnabled.value ? `${prompt.value}, 杰作, 最佳画质, 高细节` : prompt.value
    for (let i = 0; i < numImages.value; i++) {
      emit('generating-progress', i + 1, numImages.value, selectedModel.value)
      const urls = await generateImage({
        prompt: finalPrompt, negative_prompt: negativePrompt.value,
        size: selectedSize.value, num_images: 1, enhance: enhanceEnabled.value,
      }, { model: selectedModel.value, quality: selectedQuality.value })

      if (urls.length === 0) { message.error('生成失败，请重试'); return }
      emit('generated', urls.map(url => ({ url, base64: '' })))
      usage.increment(1)
    }
    message.success(`已生成 ${numImages.value} 张图像`)
    await saveHistory({
      id: uuidv4(), prompt: prompt.value, negative_prompt: negativePrompt.value,
      size: selectedSize.value, model: selectedModel.value, images: [],
      favorited: false, createdAt: Date.now(),
    })
  } catch (err: any) {
    message.error(err.message || '生成失败')
  } finally {
    generating.value = false
    emit('generating', false)
  }
}
</script>

<template>
  <section class="generator">
    <div class="section-head">
      <span class="head-accent" />
      <h2 class="section-title">文本生图</h2>
      <span class="head-sub">AI Image Creation</span>
    </div>

    <div class="generator-card">
      <NForm label-placement="top" size="large">
        <NFormItem class="prompt-item">
          <NInput
            v-model:value="prompt"
            type="textarea"
            placeholder="描述你想要的画面..."
            :maxlength="500"
            show-count
            :autosize="{ minRows: 3, maxRows: 5 }"
            class="prompt-input"
          />
        </NFormItem>

        <div class="chip-row">
          <button v-for="(s, i) in samples" :key="i" class="chip" @click="pick(s)">
            {{ s.slice(0, 14) }}...
          </button>
        </div>

        <button class="toggle-btn" @click="showNegative = !showNegative">
          <span class="toggle-mark">{{ showNegative ? '−' : '+' }}</span>
          {{ showNegative ? '收起排除词' : '排除元素' }}
        </button>

        <Transition name="slide">
          <NFormItem v-if="showNegative" label="排除元素" class="neg-item">
            <NInput v-model:value="negativePrompt" type="textarea" :autosize="{ minRows: 1, maxRows: 2 }" />
          </NFormItem>
        </Transition>

        <div class="control-grid">
          <NFormItem label="模型">
            <NSelect v-model:value="selectedModel" :options="modelOpts" />
          </NFormItem>
          <NFormItem label="画质">
            <NSelect v-model:value="selectedQuality" :options="qualityOpts" />
          </NFormItem>
          <NFormItem label="尺寸">
            <NSelect v-model:value="selectedSize" :options="sizes.map(s => ({ label: s.label, value: s.value }))" />
          </NFormItem>
          <NFormItem label="数量">
            <div class="slider-box">
              <NSlider v-model:value="numImages" :min="1" :max="4" :step="1"
                :marks="{ 1: '1', 2: '2', 3: '3', 4: '4' }" />
            </div>
          </NFormItem>
        </div>

        <NFormItem class="enhance-row">
          <div class="enhance-left">
            <span class="enhance-label">增强画质</span>
            <NSwitch v-model:value="enhanceEnabled" />
          </div>
          <NPopover trigger="hover">
            <template #trigger><span class="help-dot">?</span></template>
            自动添加画质增强词
          </NPopover>
        </NFormItem>

        <NFormItem>
          <button class="btn-generate"
            :class="{ ready: canGenerate, loading: generating }"
            :disabled="!canGenerate"
            @click="handleGenerate"
          >
            <span v-if="!generating" class="btn-label">
              生成图像
            </span>
            <span v-else class="btn-label">
              <span class="btn-ring" /> 创作中...
            </span>
          </button>
        </NFormItem>
      </NForm>

      <NAlert v-if="showRec" type="info" :bordered="false" class="rec-alert">
        <template #header>推荐中文模型</template>
        检测到中文提示词，建议切换以获得更好效果。
        <button class="rec-btn" @click="switchModel">切换</button>
      </NAlert>
    </div>
  </section>
</template>

<style scoped>
.generator {
  max-width: 680px;
  margin: 0 auto;
  width: 100%;
}

.section-head {
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin-bottom: 24px;
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
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.10em;
  color: var(--text-tertiary);
  text-transform: uppercase;
  margin-top: 2px;
}

.generator-card {
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-md);
  padding: 32px;
  position: relative;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.generator-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(193, 59, 51, 0.12) 0%,
    transparent 40%,
    transparent 60%,
    rgba(193, 59, 51, 0.06) 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.generator-card:focus-within {
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 1px rgba(193, 59, 51, 0.08);
}

.prompt-item :deep(.n-input__textarea-el) {
  font-family: var(--font-body);
  line-height: 1.8;
  letter-spacing: 0.015em;
  font-size: 15px;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
}

.chip {
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.02em;
  padding: 5px 14px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-sm);
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
}

.chip:hover {
  background: rgba(193, 59, 51, 0.06);
  border-color: rgba(193, 59, 51, 0.20);
  color: var(--accent);
}

.toggle-btn {
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--text-tertiary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 0;
  margin-bottom: 16px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s;
}

.toggle-mark {
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 500;
}

.toggle-btn:hover { color: var(--text-secondary); }

.neg-item { margin-top: 0; }

.control-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 24px;
  margin-bottom: 16px;
}

.control-grid :deep(.n-form-item-label) {
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--text-tertiary);
  text-transform: uppercase;
}

.slider-box { width: 100%; padding-top: 4px; }

.enhance-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.enhance-left { display: flex; align-items: center; gap: 12px; }

.enhance-label {
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.help-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.10);
  color: var(--text-tertiary);
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  cursor: help;
  transition: all 0.2s;
}

.help-dot:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: rgba(193, 59, 51, 0.06);
}

.btn-generate {
  width: 100%;
  padding: 15px;
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 0.10em;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.btn-generate:not(.ready) {
  background: var(--surface-alt);
  color: var(--text-tertiary);
  cursor: not-allowed;
}

.btn-generate.ready {
  background: var(--accent);
  color: #fff;
  box-shadow: 0 2px 16px rgba(193, 59, 51, 0.25);
}

.btn-generate.ready::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    transparent 0%,
    rgba(255, 255, 255, 0.08) 50%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity 0.3s;
}

.btn-generate.ready:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 24px rgba(193, 59, 51, 0.35);
}

.btn-generate.ready:hover::after {
  opacity: 1;
}

.btn-generate.ready:active {
  transform: translateY(0);
}

.btn-generate.loading {
  background: rgba(193, 59, 51, 0.70);
}

.btn-label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.btn-ring {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.rec-alert {
  margin-top: 20px;
  background: rgba(193, 59, 51, 0.06) !important;
  border: 1px solid rgba(193, 59, 51, 0.15) !important;
  border-radius: var(--radius-sm);
}

.rec-btn {
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--accent);
  background: rgba(193, 59, 51, 0.10);
  border: 1px solid rgba(193, 59, 51, 0.20);
  padding: 4px 14px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  margin-left: 10px;
  transition: all 0.2s;
}

.rec-btn:hover { background: rgba(193, 59, 51, 0.20); }

.slide-enter-active, .slide-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.slide-enter-from, .slide-leave-to {
  opacity: 0;
  max-height: 0;
  margin-bottom: 0;
}

.slide-enter-to, .slide-leave-from {
  opacity: 1;
  max-height: 100px;
  margin-bottom: 16px;
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .generator-card { padding: 24px 18px; }
  .control-grid { grid-template-columns: 1fr; gap: 0 16px; }
  .section-title { font-size: 22px; }
}
</style>
