<script setup lang="ts">
import { fetchJanCode } from '@/utils/client'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { computedAsync } from '@vueuse/core'
import TimerUI from '@/components/TimerUI.vue'

interface SearchQueryParams {
  jan?: string
}

const route = useRoute()
const query = computed(() => route.query as SearchQueryParams)


const janResult = computedAsync(async () => {
  if (query.value.jan) {
    const result = await fetchJanCode(query.value.jan)
    if (result?.wait_seconds) {
      return {
        timerSeconds: result?.wait_seconds
      }
    }
  }
  return null
})
</script>

<template>
  <div v-if="query.jan && janResult">
    <TimerUI :seconds="janResult.timerSeconds" />
  </div>
  <div v-else>
    <TimerUI :seconds="180" />
  </div>
</template>
