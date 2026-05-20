<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { darkTheme, lightTheme, zhCN, dateZhCN, NConfigProvider, NMessageProvider, NGlobalStyle } from 'naive-ui'
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()

const appTheme = computed(() => settings.theme === 'light' ? lightTheme : darkTheme)

function applyHtmlTheme(mode: string) {
  document.documentElement.setAttribute('data-theme', mode)
}

watch(() => settings.theme, (val) => {
  applyHtmlTheme(val)
}, { immediate: true })

onMounted(() => {
  applyHtmlTheme(settings.theme)
})
</script>

<template>
  <NConfigProvider :theme="appTheme" :locale="zhCN" :date-locale="dateZhCN">
    <NMessageProvider>
      <NGlobalStyle />
      <router-view />
    </NMessageProvider>
  </NConfigProvider>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Noto+Serif+SC:wght@300;400;500;600;700;900&family=Noto+Sans+SC:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
  --bg: #08080a;
  --bg-rgb: 8, 8, 10;
  --surface: #111014;
  --surface-rgb: 17, 16, 20;
  --surface-alt: #18161c;
  --surface-alt-rgb: 24, 22, 28;

  --border: rgba(255, 255, 255, 0.05);
  --border-rgb: 255, 255, 255;
  --border-hover: rgba(255, 255, 255, 0.10);

  --text: #efe8dc;
  --text-rgb: 239, 232, 220;
  --text-secondary: rgba(239, 232, 220, 0.58);
  --text-tertiary: rgba(239, 232, 220, 0.30);

  --accent: #c13b33;
  --accent-rgb: 193, 59, 51;
  --accent-hover: #d4483f;
  --accent-hover-rgb: 212, 72, 63;
  --accent-soft: rgba(193, 59, 51, 0.10);
  --accent-soft-rgb: 193, 59, 51;

  --success: #5b8c5a;
  --success-rgb: 91, 140, 90;
  --danger: #b55a52;
  --danger-rgb: 181, 90, 82;

  --glow: rgba(193, 59, 51, 0.12);

  --font-display: 'Ma Shan Zheng', 'Noto Serif SC', serif;
  --font-body: 'Noto Serif SC', 'Source Han Serif SC', 'SimSun', serif;
  --font-sans: 'Noto Sans SC', 'Source Han Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;

  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.5);
  --shadow-md: 0 4px 24px rgba(0, 0, 0, 0.6);
  --shadow-glow: 0 0 0 1px rgba(193, 59, 51, 0.15), 0 4px 24px rgba(0, 0, 0, 0.5);

  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;
}

[data-theme="light"] {
  --bg: #f5f0e8;
  --bg-rgb: 245, 240, 232;
  --surface: #ede7dc;
  --surface-rgb: 237, 231, 220;
  --surface-alt: #e5ded2;
  --surface-alt-rgb: 229, 222, 210;

  --border: rgba(0, 0, 0, 0.06);
  --border-rgb: 0, 0, 0;
  --border-hover: rgba(0, 0, 0, 0.12);

  --text: #1a1612;
  --text-rgb: 26, 22, 18;
  --text-secondary: rgba(26, 22, 18, 0.60);
  --text-tertiary: rgba(26, 22, 18, 0.35);

  --accent: #b8332b;
  --accent-rgb: 184, 51, 43;
  --accent-hover: #c94239;
  --accent-hover-rgb: 201, 66, 57;
  --accent-soft: rgba(184, 51, 43, 0.08);
  --accent-soft-rgb: 184, 51, 43;

  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.10);
  --shadow-glow: 0 0 0 1px rgba(184, 51, 43, 0.12), 0 4px 16px rgba(0, 0, 0, 0.10);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--text);
  line-height: 1.75;
  letter-spacing: 0.015em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

[data-theme="dark"] body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.03;
  background-image:
    repeating-conic-gradient(#fff 0 0.0001%, transparent 0 0.0002%, transparent 0 0.0004%),
    repeating-conic-gradient(#fff 0 0.00005%, transparent 0 0.00012%);
  background-size: 200px 200px, 80px 80px;
  background-position: 0 0, 13px 17px;
}

::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 2px;
}

[data-theme="light"] ::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.10);
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.12);
}

[data-theme="light"] ::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.18);
}

::selection {
  background: rgba(193, 59, 51, 0.30);
  color: var(--text);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
