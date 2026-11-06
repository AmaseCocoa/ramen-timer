<script setup lang="ts">
import { QrcodeStream, type DetectedBarcode } from 'vue-qrcode-reader'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const cameraEnabled = ref(false)
const error = ref('')
const ready = ref(false)
function onDetect(codes: DetectedBarcode[]) {
  if (codes[0]) void router.push({ path: '/timer', query: { jan: codes[0].rawValue } })
}
function openCamera() {
  error.value = ''
  ready.value = false
  cameraEnabled.value = true
}
function onError() {
  error.value = 'カメラを利用できませんでした。ブラウザのカメラ権限と接続を確認してください。'
  cameraEnabled.value = false
}
</script>

<template>
  <header class="page-heading">
    <p class="eyebrow">一杯を、見つける。</p>
    <h1>バーコード読み込み</h1>
    <p>カップ麺のバーコードから、待ち時間を設定します。</p>
  </header>
  <section class="scanner-panel">
    <template v-if="cameraEnabled"
      ><div class="camera-view">
        <QrcodeStream
          :formats="['ean_13']"
          @detect="onDetect"
          @error="onError"
          @camera-on="ready = true"
        />
      </div>
      <p role="status">
        {{ ready ? 'バーコードをカメラに向けてください' : 'カメラを起動しています…' }}
      </p>
      <button class="button secondary" @click="cameraEnabled = false">
        カメラを閉じる
      </button></template
    >
    <template v-else
      ><span class="empty-icon mdi mdi-barcode-scan" aria-hidden="true"></span>
      <h2>バーコードをかざしてください</h2>
      <p>
        カメラを使って、商品の JAN コードを読み取ります。<br />利用時にカメラへのアクセスを許可してください。
      </p>
      <p v-if="error" class="feedback" role="alert">{{ error }}</p>
      <button class="button primary" @click="openCamera">
        <i class="mdi mdi-camera-outline" aria-hidden="true"></i
        >{{ error ? 'もう一度試す' : 'カメラを起動' }}
      </button></template
    >
  </section>
</template>
