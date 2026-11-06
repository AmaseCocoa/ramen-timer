import { ref } from 'vue'
import type { CapDBData } from '@/utils/client'

export interface ProductHistoryEntry {
  jan: string
  name: string
  seconds: number
  hasDrain: boolean
  viewedAt: string
}

const storageKey = 'capdb:history:v1'
const entries = ref<ProductHistoryEntry[]>([])
const storageError = ref('')
let loaded = false

function isEntry(value: unknown): value is ProductHistoryEntry {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<ProductHistoryEntry>
  return (
    typeof item.jan === 'string' &&
    /^\d{13}$/.test(item.jan) &&
    typeof item.name === 'string' &&
    typeof item.seconds === 'number' &&
    Number.isSafeInteger(item.seconds) &&
    item.seconds > 0 &&
    typeof item.hasDrain === 'boolean' &&
    typeof item.viewedAt === 'string' &&
    Number.isFinite(Date.parse(item.viewedAt))
  )
}

export function useProductHistory() {
  if (!loaded) {
    loaded = true
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed: unknown = JSON.parse(saved)
        if (!Array.isArray(parsed) || !parsed.every(isEntry)) throw new Error('Invalid history')
        entries.value = parsed
      }
    } catch {
      storageError.value = '履歴を読み込めませんでした。保存済みのデータは上書きしません。'
    }
  }

  function save(next: ProductHistoryEntry[]) {
    if (storageError.value) return
    try {
      localStorage.setItem(storageKey, JSON.stringify(next))
      entries.value = next
    } catch {
      storageError.value =
        '履歴を保存できませんでした。ブラウザの保存設定や空き容量を確認してください。'
    }
  }

  function record(product: CapDBData, jan: string) {
    save(
      [
        {
          jan,
          name: product.name,
          seconds: product.wait_seconds,
          hasDrain: product.has_drain,
          viewedAt: new Date().toISOString(),
        },
        ...entries.value.filter((item) => item.jan !== jan),
      ].slice(0, 100),
    )
  }

  function remove(jan: string) {
    save(entries.value.filter((item) => item.jan !== jan))
  }

  return { entries, storageError, record, remove }
}
