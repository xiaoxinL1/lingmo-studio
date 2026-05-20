<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  visible: boolean
}>(), {
  visible: false,
})

const emit = defineEmits<{
  close: []
}>()

const step = ref(0)

const steps = [
  {
    title: '欢迎使用靈墨工坊',
    desc: '基于 Puter.js 的 AI 图像生成工具',
    detail: '所有模型调用通过 Puter 平台完成，无需自行配置 API Key',
  },
  {
    title: '免费使用说明',
    desc: '本应用对您完全免费',
    detail: '图像生成费用由 Puter 账户承担，新用户注册即获免费额度',
  },
  {
    title: '开始使用',
    desc: '输入提示词即可创作',
    detail: '首次生成时会提示登录 Puter 账户，登录后即可无限畅用',
  },
]

function next() {
  if (step.value < steps.length - 1) {
    step.value++
  } else {
    emit('close')
  }
}

function skip() {
  emit('close')
}
</script>

<template>
  <Transition name="guide">
    <div v-if="visible" class="guide-overlay">
      <div class="guide-backdrop" @click="skip" />

      <div class="guide-card">
        <div class="guide-seal">
          <span v-if="step === 0">墨</span>
          <span v-else-if="step === 1">禅</span>
          <span v-else>創</span>
        </div>

        <h2 class="guide-title">{{ steps[step].title }}</h2>
        <p class="guide-desc">{{ steps[step].desc }}</p>
        <p class="guide-detail">{{ steps[step].detail }}</p>

        <div class="guide-progress">
          <span
            v-for="(_, i) in steps"
            :key="i"
            class="progress-mark"
            :class="{ active: i <= step }"
          />
        </div>

        <div class="guide-actions">
          <button v-if="step < steps.length - 1" class="btn-skip" @click="skip">
            跳过引导
          </button>
          <button v-else class="btn-skip" @click="skip">
            稍后再看
          </button>
          <button class="btn-next" @click="next">
            {{ step === steps.length - 1 ? '开始使用' : '下一步' }}
          </button>
        </div>

        <p class="guide-footer">
          第 {{ step + 1 }} / {{ steps.length }} 步
        </p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.guide-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.guide-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(var(--bg-rgb), 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.guide-card {
  position: relative;
  width: 420px;
  max-width: calc(100vw - 40px);
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-md);
  padding: 40px 36px 32px;
  text-align: center;
  box-shadow: var(--shadow-md);
}

.guide-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(193, 59, 51, 0.12) 0%,
    transparent 50%,
    rgba(193, 59, 51, 0.06) 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.guide-seal {
  font-family: var(--font-display);
  font-size: 36px;
  color: var(--accent);
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  border: 1.5px solid rgba(193, 59, 51, 0.25);
  border-radius: var(--radius-sm);
  background: rgba(193, 59, 51, 0.04);
  animation: seal-float 3s ease-in-out infinite;
}

.guide-title {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 400;
  letter-spacing: 0.05em;
  color: var(--text);
  margin: 0 0 12px;
}

.guide-desc {
  font-family: var(--font-sans);
  font-size: 15px;
  font-weight: 500;
  line-height: 1.7;
  letter-spacing: 0.02em;
  color: var(--text-secondary);
  margin: 0 0 10px;
}

.guide-detail {
  font-family: var(--font-body);
  font-size: 13px;
  line-height: 1.7;
  letter-spacing: 0.02em;
  color: var(--text-tertiary);
  margin: 0 0 28px;
}

.guide-progress {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 24px;
}

.progress-mark {
  width: 24px;
  height: 2px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 1px;
  transition: all 0.4s ease;
}

.progress-mark.active {
  background: var(--accent);
  box-shadow: 0 0 8px rgba(193, 59, 51, 0.3);
}

.guide-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
}

.btn-skip {
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.03em;
  color: var(--text-tertiary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 10px;
  transition: color 0.2s;
}

.btn-skip:hover { color: var(--text-secondary); }

.btn-next {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0.06em;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  padding: 12px 30px;
  cursor: pointer;
  box-shadow: 0 2px 16px rgba(193, 59, 51, 0.20);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.btn-next::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity 0.3s;
}

.btn-next:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 24px rgba(193, 59, 51, 0.30);
}

.btn-next:hover::after { opacity: 1; }

.btn-next:active { transform: translateY(0); }

.guide-footer {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-tertiary);
  letter-spacing: 0.06em;
  margin: 18px 0 0;
}

.guide-enter-active { transition: opacity 0.4s ease; }
.guide-leave-active { transition: opacity 0.25s ease; }
.guide-enter-from,
.guide-leave-to { opacity: 0; }

@keyframes seal-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

@media (max-width: 480px) {
  .guide-card {
    padding: 32px 22px 26px;
    width: calc(100vw - 32px);
  }

  .guide-title { font-size: 20px; }
  .guide-desc { font-size: 14px; }
}
</style>
