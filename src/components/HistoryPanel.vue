<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NDrawer, NDrawerContent, NSpin } from 'naive-ui'
import type { HistoryRecord } from '@/types'
import { getHistoryList, deleteHistory, toggleFavorite } from '@/utils/db'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{
  'update:visible': [value: boolean]
  reuse: [prompt: string]
}>()

const records = ref<HistoryRecord[]>([])
const loading = ref(true)

onMounted(async () => {
  try { records.value = await getHistoryList() } catch (err) { console.error(err) }
  finally { loading.value = false }
})

async function refresh() { try { records.value = await getHistoryList() } catch {} }

async function handleDelete(id: string) {
  await deleteHistory(id)
  records.value = records.value.filter(r => r.id !== id)
}

async function handleFavorite(r: HistoryRecord) {
  await toggleFavorite(r.id)
  r.favorited = !r.favorited
}

function handleReuse(p: string) {
  emit('reuse', p)
  emit('update:visible', false)
}
</script>

<template>
  <NDrawer :show="visible" :width="340" @update:show="emit('update:visible', $event)" placement="right">
    <NDrawerContent title="" closable :native-scrollbar="false">
      <div class="drawer-header">
        <span class="header-seal">歴</span>
        <h3 class="header-title">历史记录</h3>
      </div>

      <div v-if="loading" class="empty-state">
        <NSpin size="small" />
      </div>

      <div v-else-if="records.length === 0" class="empty-state">
        <div class="empty-mark">空</div>
        <p class="empty-text">暂无生成记录</p>
        <p class="empty-hint">首次生成后记录将显示在此</p>
      </div>

      <ul v-else class="history-list">
        <li v-for="r in records" :key="r.id" class="history-item">
          <div class="item-thumb">
            <img v-if="r.images?.length" :src="r.images[0]" alt="" class="thumb-img" />
            <span v-else class="thumb-ph">墨</span>
          </div>
          <div class="item-body">
            <p class="item-prompt">{{ r.prompt.slice(0, 28) }}<span v-if="r.prompt.length > 28">...</span></p>
            <span class="item-meta">{{ r.size }} · {{ new Date(r.createdAt).toLocaleDateString() }}</span>
          </div>
          <div class="item-actions">
            <button class="act-btn reuse" @click="handleReuse(r.prompt)" title="复用">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 8a6 6 0 0 1 10.47-4M14 8a6 6 0 0 1-10.47 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.5 2L14 5.5 10.5 9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <button class="act-btn" :class="{ on: r.favorited }" @click="handleFavorite(r)" title="收藏">
              <svg width="13" height="13" viewBox="0 0 16 16" :fill="r.favorited ? 'currentColor' : 'none'">
                <path d="M8 1.5l1.8 5.5h5.7l-4.6 3.4 1.8 5.6L8 12.5l-4.7 3.5 1.8-5.6L.5 7h5.7L8 1.5z" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"/>
              </svg>
            </button>
            <button class="act-btn del" @click="handleDelete(r.id)" title="删除">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 5h10M6 5V3.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V5M12.5 5v7.5a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1V5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
        </li>
      </ul>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped>
.drawer-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 22px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.header-seal {
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

.header-title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 400;
  letter-spacing: 0.04em;
  color: var(--text);
  margin: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 64px 20px;
}

.empty-mark {
  font-family: var(--font-display);
  font-size: 32px;
  color: var(--text-tertiary);
  opacity: 0.3;
}

.empty-text {
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--text-tertiary);
  letter-spacing: 0.04em;
  margin: 0;
}

.empty-hint {
  font-size: 11px;
  color: var(--text-tertiary);
  opacity: 0.5;
  margin: 0;
}

.history-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--surface-alt);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-sm);
  transition: all 0.25s ease;
}

.history-item:hover {
  border-color: rgba(255, 255, 255, 0.08);
  background: rgba(193, 59, 51, 0.03);
}

.item-thumb {
  width: 48px;
  height: 48px;
  border-radius: 2px;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.thumb-img { width: 100%; height: 100%; object-fit: cover; }

.thumb-ph {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-family: var(--font-display);
  font-size: 18px;
  color: var(--text-tertiary);
}

.item-body {
  flex: 1;
  min-width: 0;
}

.item-prompt {
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.01em;
  color: var(--text-secondary);
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-meta {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-tertiary);
  letter-spacing: 0.04em;
}

.item-actions {
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.2s;
}

.history-item:hover .item-actions { opacity: 1; }

.act-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 2px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-tertiary);
}

.act-btn:hover { background: var(--surface); color: var(--text-secondary); }
.act-btn.on { color: var(--accent); }
.act-btn.reuse:hover { color: var(--success); background: rgba(91, 140, 90, 0.08); }
.act-btn.del:hover { color: var(--danger); background: rgba(181, 90, 82, 0.08); }
</style>
