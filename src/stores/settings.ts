import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { ThemeMode, QualityLevel } from '@/types'

export const useSettingsStore = defineStore('settings', () => {
  const theme = ref<ThemeMode>(
    (localStorage.getItem('lingmo-theme') as ThemeMode) || 'dark'
  )

  const defaultModel = ref(
    localStorage.getItem('lingmo-default-model') || 'ByteDance-Seed/Seedream-4.0'
  )

  const defaultQuality = ref<QualityLevel>(
    (localStorage.getItem('lingmo-default-quality') as QualityLevel) || 'medium'
  )

  watch(theme, (val) => {
    localStorage.setItem('lingmo-theme', val)
  })

  watch(defaultModel, (val) => {
    localStorage.setItem('lingmo-default-model', val)
  })

  watch(defaultQuality, (val) => {
    localStorage.setItem('lingmo-default-quality', val)
  })

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  function setTheme(mode: ThemeMode) {
    theme.value = mode
  }

  function setDefaultModel(model: string) {
    defaultModel.value = model
  }

  function setDefaultQuality(quality: QualityLevel) {
    defaultQuality.value = quality
  }

  return {
    theme,
    defaultModel,
    defaultQuality,
    toggleTheme,
    setTheme,
    setDefaultModel,
    setDefaultQuality,
  }
})
