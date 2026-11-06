<script setup lang="ts">
import { fetchJanCode } from '@/utils/client'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { computedAsync } from '@vueuse/core'
import TimerUI from '@/components/TimerUI.vue'

const route = useRoute()
const selectedSeconds = ref(180)
const inputMinutes = ref<number | string>(3)
const inputSeconds = ref<number | string>(0)
const loading = ref(false)
const lookupFailed = ref(false)
const jan = computed(() => (typeof route.query.jan === 'string' ? route.query.jan : ''))
const product = computedAsync(
  async () => {
    lookupFailed.value = false
    if (!jan.value) return null
    try {
      const result = await fetchJanCode(jan.value)
      if (result && result.wait_seconds > 0) return result
    } catch {
      /* 手動タイマーを利用できる状態に戻す */
    }
    lookupFailed.value = true
    return null
  },
  null,
  { evaluating: loading },
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
watch(product, (value) => {
  if (value) setDuration(value.wait_seconds)
})
</script>

<template>
  <header class="page-heading">
    <p class="eyebrow">おいしい時間を、きっちり。</p>
    <h1>タイマー</h1>
    <p>お湯を注いだら、スタート。</p>
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
      <h2>待ち時間</h2>
      <p>パッケージに書かれた時間を入力してね。</p>
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
      <p v-if="lookupFailed" role="status" class="feedback">
        商品が見つからないか、取得できませんでした。待ち時間を入力して使えます。
      </p>
      <div class="scan-note">
        <span class="note-icon mdi mdi-barcode-scan" aria-hidden="true"></span>
        <h2>バーコードから、かんたんに。</h2>
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
