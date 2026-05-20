import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUsageStore = defineStore('usage', () => {
  const todayDate = ref(getTodayStr())
  const requestCount = ref(loadTodayCount())

  function getTodayStr(): string {
    return new Date().toISOString().slice(0, 10)
  }

  function loadTodayCount(): number {
    const saved = localStorage.getItem('lingmo-usage-date')
    const count = localStorage.getItem('lingmo-usage-count')
    if (saved === getTodayStr() && count) {
      return parseInt(count, 10) || 0
    }
    return 0
  }

  function persistToday() {
    todayDate.value = getTodayStr()
    localStorage.setItem('lingmo-usage-date', todayDate.value)
    localStorage.setItem('lingmo-usage-count', String(requestCount.value))
  }

  function checkAndReset() {
    const current = getTodayStr()
    if (todayDate.value !== current) {
      todayDate.value = current
      requestCount.value = 0
      persistToday()
    }
  }

  const dailyLimit = computed(() => {
    const saved = localStorage.getItem('lingmo-daily-limit')
    return saved ? parseInt(saved, 10) : 2000
  })

  const remaining = computed(() => Math.max(0, dailyLimit.value - requestCount.value))

  const usagePercent = computed(() => {
    if (dailyLimit.value === 0) return 0
    return Math.round((requestCount.value / dailyLimit.value) * 100)
  })

  function increment(count: number = 1) {
    checkAndReset()
    requestCount.value += count
    persistToday()
  }

  function setDailyLimit(limit: number) {
    localStorage.setItem('lingmo-daily-limit', String(limit))
  }

  return {
    todayDate,
    requestCount,
    dailyLimit,
    remaining,
    usagePercent,
    increment,
    checkAndReset,
    setDailyLimit,
  }
})