<script setup lang="ts">
import { QrcodeStream, type DetectedBarcode } from 'vue-qrcode-reader'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const cameraEnabled = ref(false)
const error = ref('')
const ready = ref(false)
const cameras = ref<MediaDeviceInfo[]>([])
const selectedCamera = ref('')
// Prefer enough detail for JAN bars without rejecting lower-resolution cameras.
const cameraConstraints = computed<MediaTrackConstraints>(() => ({
  ...(selectedCamera.value
    ? { deviceId: { exact: selectedCamera.value } }
    : { facingMode: { ideal: 'environment' } }),
  width: { ideal: 1920 },
  height: { ideal: 1080 },
}))

async function onCameraReady() {
  ready.value = true
  // Camera permission must be granted before enumerating devices on iOS.
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    cameras.value = devices.filter((device) => device.kind === 'videoinput' && device.deviceId)
  } catch {
    // Scanning still works when the browser cannot list cameras.
    cameras.value = []
  }
}

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
  selectedCamera.value = ''
}
</script>

<template>
  <header class="page-heading">
    <h1>バーコード読み込み</h1>
    <p>カップ麺のバーコードから、待ち時間を設定します。</p>
  </header>
  <section class="scanner-panel">
    <template v-if="cameraEnabled"
      ><div class="camera-view">
        <QrcodeStream
          :constraints="cameraConstraints"
          :formats="['ean_13']"
          @detect="onDetect"
          @error="onError"
          @camera-on="onCameraReady"
        />
      </div>
      <p role="status">
        {{ ready ? 'バーコードをカメラに向けてください' : 'カメラを起動しています…' }}
      </p>
      <div v-if="cameras.length > 1" class="camera-selector">
        <label for="scanner-camera">使用するカメラ</label>
        <select id="scanner-camera" v-model="selectedCamera" @change="ready = false">
          <option value="">背面カメラ（自動）</option>
          <option
            v-for="(camera, index) in cameras"
            :key="camera.deviceId"
            :value="camera.deviceId"
          >
            {{ camera.label || `カメラ ${index + 1}` }}
          </option>
        </select>
        <p>ぼやける場合は、別のカメラに切り替えてください。</p>
      </div>
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
