<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'
const settings = useSettingsStore()
</script>

<template>
  <button class="tt" :class="{ light: settings.theme === 'light' }"
    @click="settings.toggleTheme()"
    :title="settings.theme === 'dark' ? '亮色' : '暗色'">
    <span class="tt-thumb">
      <svg v-if="settings.theme === 'dark'" width="12" height="12" viewBox="0 0 16 16" fill="none">
        <path d="M8 1a7 7 0 1 0 7 7 5.5 5.5 0 0 1-7-7z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
      </svg>
      <svg v-else width="12" height="12" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.3"/>
        <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
      </svg>
    </span>
  </button>
</template>

<style scoped>
.tt {
  width: 44px;
  height: 22px;
  border-radius: 11px;
  background: var(--surface-alt);
  border: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
  padding: 2px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.tt:hover { border-color: rgba(255, 255, 255, 0.12); }

.tt-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--text-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bg);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.tt.light {
  background: rgba(193, 59, 51, 0.15);
  border-color: rgba(193, 59, 51, 0.25);
}

.tt.light .tt-thumb {
  left: calc(100% - 18px);
  background: var(--accent);
  color: #fff;
}
</style>
