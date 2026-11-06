<script setup lang="ts">
import { fetchJanCode, type CapDBData } from '@/utils/client'
import { useProductHistory } from '@/composable/useProductHistory'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import TimerUI from '@/components/TimerUI.vue'

const route = useRoute()
const selectedSeconds = ref(180)
const inputMinutes = ref<number | string>(3)
const inputSeconds = ref<number | string>(0)
const loading = ref(false)
const lookupFailed = ref(false)
const jan = computed(() => (typeof route.query.jan === 'string' ? route.query.jan : ''))
const product = ref<CapDBData | null>(null)
const dataRequestUrl = computed(() => {
  const url = new URL('https://github.com/AmaseCocoa/ramen-db/issues/new')
  url.search = new URLSearchParams({
    template: 'data_request.yaml',
    title: '[データ追加・修正]: [ここに商品名]',
    'jan-code': jan.value,
  }).toString()
  return url.href
})
const { record, storageError } = useProductHistory()
const officialUrl = computed(() => {
  try {
    const url = new URL(product.value?.links?.official ?? '')
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null
  } catch {
    return null
  }
})
watch(
  jan,
  async (code, _, onCleanup) => {
    let stale = false
    onCleanup(() => {
      stale = true
    })
    product.value = null
    lookupFailed.value = false
    loading.value = !!code
    if (!code) return
    try {
      const result = await fetchJanCode(code)
      if (stale) return
      if (
        result &&
        Number.isSafeInteger(result.wait_seconds) &&
        result.wait_seconds > 0 &&
        typeof result.name === 'string' &&
        typeof result.has_drain === 'boolean'
      ) {
        product.value = result
        setDuration(result.wait_seconds)
        record(result, code)
      } else lookupFailed.value = true
    } catch {
      if (!stale) lookupFailed.value = true
    } finally {
      if (!stale) loading.value = false
    }
  },
  { immediate: true },
)
const seconds = computed(() => selectedSeconds.value)
const validDuration = computed(() => {
  const minutes = Number(inputMinutes.value)
  const seconds = Number(inputSeconds.value)
  return (
    inputMinutes.value !== '' &&
    inputSeconds.value !== '' &&
    Number.isSafeInteger(minutes) &&
    minutes >= 0 &&
    minutes <= 999 &&
    Number.isSafeInteger(seconds) &&
    seconds >= 0 &&
    seconds <= 59 &&
    minutes * 60 + seconds > 0
  )
})
const durationLabel = computed(() => {
  const minutes = Math.floor(seconds.value / 60)
  const remainder = seconds.value % 60
  return [minutes ? `${minutes} 分` : '', remainder ? `${remainder} 秒` : '']
    .filter(Boolean)
    .join(' ')
})
function setDuration(total: number) {
  selectedSeconds.value = total
  inputMinutes.value = Math.floor(total / 60)
  inputSeconds.value = total % 60
}
function applyDuration() {
  if (validDuration.value) setDuration(Number(inputMinutes.value) * 60 + Number(inputSeconds.value))
}
</script>

<template>
  <header class="page-heading">
    <h1>タイマー</h1>
  </header>
  <section class="timer-layout" aria-label="カップ麺タイマー">
    <div class="timer-panel">
      <div class="panel-top">
        <span
          ><i class="mdi mdi-timer-outline" aria-hidden="true"></i>
          {{ product ? product.name : 'カップ麺タイマー' }}</span
        ><span class="small-label">{{ durationLabel }}</span>
      </div>
      <TimerUI :key="`${jan}-${seconds}`" :seconds="seconds" />
    </div>
    <aside class="timer-settings">
      <section v-if="product" class="product-details" aria-labelledby="product-name">
        <p class="eyebrow">読み取った商品</p>
        <h2 id="product-name">{{ product.name }}</h2>
        <dl>
          <div>
            <dt>JANコード</dt>
            <dd>{{ jan }}</dd>
          </div>
          <div>
            <dt>商品の待ち時間</dt>
            <dd>
              {{ Math.floor(product.wait_seconds / 60) }} 分<span v-if="product.wait_seconds % 60">
                {{ product.wait_seconds % 60 }} 秒</span
              >
            </dd>
          </div>
          <div>
            <dt>湯切り</dt>
            <dd>{{ product.has_drain ? 'あり' : 'なし' }}</dd>
          </div>
        </dl>
        <a
          v-if="officialUrl"
          :href="officialUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="text-link"
          >公式の商品情報 <i class="mdi mdi-open-in-new" aria-hidden="true"></i
          ><span class="sr-only">（新しいタブ）</span></a
        >
      </section>
      <p v-if="storageError" role="status" class="feedback">{{ storageError }}</p>
      <h2>待ち時間</h2>
      <p>パッケージに書かれた時間を入力してください。</p>
      <form class="duration-form" @submit.prevent="applyDuration">
        <div class="duration-fields">
          <label for="duration-minutes"
            >分<input
              id="duration-minutes"
              v-model="inputMinutes"
              type="number"
              min="0"
              max="999"
              step="1"
              required
              inputmode="numeric"
              :disabled="loading"
              aria-describedby="duration-help"
          /></label>
          <label for="duration-seconds"
            >秒<input
              id="duration-seconds"
              v-model="inputSeconds"
              type="number"
              min="0"
              max="59"
              step="1"
              required
              inputmode="numeric"
              :disabled="loading"
              aria-describedby="duration-help"
          /></label>
        </div>
        <p id="duration-help">分は 0〜999、秒は 0〜59。合計1秒以上で設定できます。</p>
        <button class="button secondary" type="submit" :disabled="!validDuration || loading">
          時間を設定
        </button>
      </form>
      <div class="duration-options" aria-label="待ち時間">
        <button
          v-for="minutes in [3, 4, 5]"
          :key="minutes"
          class="duration-option"
          :class="{ chosen: seconds === minutes * 60 }"
          :aria-pressed="seconds === minutes * 60"
          :disabled="loading"
          @click="setDuration(minutes * 60)"
        >
          <i v-if="seconds === minutes * 60" class="mdi mdi-check" aria-hidden="true"></i
          >{{ minutes }} 分
        </button>
      </div>
      <p v-if="loading" role="status" class="feedback">商品を確認しています…</p>
      <div v-if="lookupFailed" class="feedback">
        <p role="status">
          商品が見つからないか、取得できませんでした。待ち時間を入力して使えます。
        </p>
        <p>
          未登録の商品は、GitHubからデータの追加を依頼できます。商品名を入力して送信してください。
        </p>
        <a :href="dataRequestUrl" class="text-link" target="_blank" rel="noopener noreferrer">
          商品データの追加を依頼する
          <i class="mdi mdi-open-in-new" aria-hidden="true"></i>
          <span class="sr-only">（新しいタブ）</span>
        </a>
      </div>
      <div class="scan-note">
        <span class="note-icon mdi mdi-barcode-scan" aria-hidden="true"></span>
        <h2>バーコードから設定する</h2>
        <p>対応商品のバーコードを読み込むと、待ち時間を自動で設定できます。</p>
        <RouterLink to="/read" class="text-link"
          >バーコードを読み込む <i class="mdi mdi-arrow-right" aria-hidden="true"></i
        ></RouterLink>
      </div>
      <p class="quiet-note">
        <i class="mdi mdi-information-outline" aria-hidden="true"></i>
        時間を変更するとタイマーはリセットされます。
      </p>
    </aside>
  </section>
</template>
