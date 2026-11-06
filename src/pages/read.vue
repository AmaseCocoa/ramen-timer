<script setup lang="ts">
import { QrcodeStream, type DetectedBarcode } from 'vue-qrcode-reader'
import { useRouter } from 'vue-router';

const router = useRouter()

const onDetect = async (detectedCodes: DetectedBarcode[]) => {

  console.log("a")
  if (!detectedCodes || detectedCodes.length === 0 || !detectedCodes[0]) return

  const firstDetected = detectedCodes[0]
  const janCode = firstDetected.rawValue

  await router.push({ path: '/timer', query: { jan: janCode } })
}
</script>

<template>
  <QrcodeStream @detect="onDetect" :formats="['ean_13']"></QrcodeStream>
</template>
