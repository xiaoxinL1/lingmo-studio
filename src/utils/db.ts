import { get, set, del, keys } from 'idb-keyval'
import type { HistoryRecord } from '@/types'

const HISTORY_PREFIX = 'lingmo-history-'
const MAX_HISTORY = 20

export async function getHistoryList(): Promise<HistoryRecord[]> {
  const allKeys = await keys()
  const historyKeys = allKeys.filter((k) =>
    String(k).startsWith(HISTORY_PREFIX)
  )
  const records: HistoryRecord[] = []
  for (const key of historyKeys) {
    const record = await get<HistoryRecord>(key)
    if (record) records.push(record)
  }
  records.sort((a, b) => b.createdAt - a.createdAt)
  return records
}

export async function saveHistory(record: HistoryRecord): Promise<void> {
  const key = HISTORY_PREFIX + record.id
  await set(key, record)
  const allKeys = await keys()
  const historyKeys = allKeys
    .filter((k) => String(k).startsWith(HISTORY_PREFIX))
    .map(String)
    .sort()
  if (historyKeys.length > MAX_HISTORY) {
    const removeCount = historyKeys.length - MAX_HISTORY
    for (let i = 0; i < removeCount; i++) {
      await del(historyKeys[i])
    }
  }
}

export async function deleteHistory(id: string): Promise<void> {
  await del(HISTORY_PREFIX + id)
}

export async function toggleFavorite(id: string): Promise<void> {
  const key = HISTORY_PREFIX + id
  const record = await get<HistoryRecord>(key)
  if (record) {
    record.favorited = !record.favorited
    await set(key, record)
  }
}

export async function clearHistory(): Promise<void> {
  const allKeys = await keys()
  for (const key of allKeys) {
    if (String(key).startsWith(HISTORY_PREFIX)) {
      await del(key)
    }
  }
}