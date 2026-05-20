<script setup lang="ts">
import { ref, watch } from 'vue'
import { NDrawer, NDrawerContent, NForm, NFormItem, NInputNumber, NSelect, NDivider, useMessage } from 'naive-ui'
import { useSettingsStore } from '@/stores/settings'
import { useUsageStore } from '@/stores/usage'
import { AVAILABLE_MODELS } from '@/api/imageApi'
import type { QualityLevel } from '@/types'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ 'update:visible': [value: boolean] }>()

const message = useMessage()
const settings = useSettingsStore()
const usage = useUsageStore()

const localLimit = ref(usage.dailyLimit)
const localModel = ref(settings.defaultModel)
const localQuality = ref<QualityLevel>(settings.defaultQuality)

const modelOpts = AVAILABLE_MODELS.map(m => ({ label: m.label, value: m.value }))
const qualityOpts = [
  { label: '快速', value: 'low' as QualityLevel },
  { label: '标准', value: 'medium' as QualityLevel },
  { label: '精细', value: 'high' as QualityLevel },
]

watch(() => props.visible, (v) => {
  if (v) {
    localLimit.value = usage.dailyLimit
    localModel.value = settings.defaultModel
    localQuality.value = settings.defaultQuality
  }
})

function save() {
  settings.setDefaultModel(localModel.value)
  settings.setDefaultQuality(localQuality.value)
  usage.setDailyLimit(localLimit.value)
  message.success('设置已保存')
  emit('update:visible', false)
}
</script>

<template>
  <NDrawer :show="visible" :width="340" @update:show="emit('update:visible', $event)" placement="right">
    <NDrawerContent title="" closable :native-scrollbar="false">
      <div class="dr-hdr">
        <span class="dr-seal">設</span>
        <h3 class="dr-title">设置</h3>
      </div>

      <NForm label-placement="top" size="large">
        <NFormItem label="默认模型" class="si">
          <NSelect v-model:value="localModel" :options="modelOpts" />
        </NFormItem>
        <NFormItem label="默认画质" class="si">
          <NSelect v-model:value="localQuality" :options="qualityOpts" />
        </NFormItem>
        <NFormItem label="每日额度" class="si">
          <NInputNumber v-model:value="localLimit" :min="100" :max="5000" :step="100" style="width:100%" />
        </NFormItem>

        <NDivider style="border-color: rgba(255,255,255,0.04); margin: 24px 0;" />

        <NFormItem>
          <button class="btn-save" @click="save">
            保存设置
          </button>
        </NFormItem>

        <NDivider style="border-color: rgba(255,255,255,0.04); margin: 24px 0;" />

        <div class="about">
          <p class="about-name">靈墨工坊</p>
          <p class="about-ver">v2.2 · Midnight Atelier</p>
        </div>
      </NForm>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped>
.dr-hdr {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 22px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.dr-seal {
  font-family: var(--font-display);
  font-size: 22px;
  color: var(--accent);
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(193, 59, 51, 0.20);
  border-radius: var(--radius-sm);
  background: rgba(193, 59, 51, 0.04);
}

.dr-title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 400;
  letter-spacing: 0.04em;
  color: var(--text);
  margin: 0;
}

.si :deep(.n-form-item-label) {
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--text-tertiary);
}

.btn-save {
  width: 100%;
  padding: 14px;
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 400;
  letter-spacing: 0.08em;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  box-shadow: 0 2px 16px rgba(193, 59, 51, 0.20);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.btn-save::after {
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

.btn-save:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 24px rgba(193, 59, 51, 0.30);
}

.btn-save:hover::after { opacity: 1; }

.btn-save:active { transform: translateY(0); }

.about { text-align: center; padding: 4px 0; }

.about-name {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 400;
  letter-spacing: 0.06em;
  color: var(--text);
  margin: 0 0 4px;
}

.about-ver {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-tertiary);
  letter-spacing: 0.06em;
  margin: 0;
}
</style>
