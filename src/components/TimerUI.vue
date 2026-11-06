<script setup lang="ts">
import { useTimerSound } from '@/composable/useTimerSound'
import { useTimeFormatter } from '@/composable/useTimeFormatter'
import { useCountdown } from '@vueuse/core'
import { computed, ref, toRef, watch } from 'vue'

const props = defineProps<{ seconds: number }>()
const { remaining, isActive, start, pause, resume, reset } = useCountdown(toRef(props, 'seconds'))
const { formattedTime } = useTimeFormatter(remaining)
const isInitial = ref(true)
const { soundError, isSounding, prepareSound, playSound, stopSound } = useTimerSound()
const finished = computed(() => !isInitial.value && remaining.value === 0)
const progress = computed(() =>
  props.seconds > 0 ? Math.max(0, Math.min(1, remaining.value / props.seconds)) : 0,
)
const status = computed(() =>
  finished.value
    ? 'できあがり'
    : isInitial.value
      ? '準備ができたら'
      : isActive.value
        ? 'できあがりまで'
        : '一時停止中',
)

function handleStart() {
  stopSound()
  void prepareSound()
  isInitial.value = false
  start()
}
function handleToggle() {
  if (isActive.value) pause()
  else {
    void prepareSound()
    resume()
  }
}
function handleReset() {
  stopSound()
  pause()
  reset()
  isInitial.value = true
}
watch(() => props.seconds, handleReset)
watch(finished, (value) => {
  if (value) playSound()
})
</script>

<template>
  <div class="timer-display">
    <div class="timer-circle">
      <svg viewBox="0 0 320 320" aria-hidden="true">
        <circle class="ring-track" cx="160" cy="160" r="146" />
        <circle
          class="ring-progress"
          cx="160"
          cy="160"
          r="146"
          pathLength="100"
          :stroke-dasharray="`${progress * 100} 100`"
        />
      </svg>
      <div class="timer-face">
        <span class="timer-status">{{ status }}</span>
        <span class="timer-digits" role="timer" :aria-label="`残り ${formattedTime}`">{{
          formattedTime
        }}</span>
        <span class="timer-caption">残り時間</span>
      </div>
    </div>
    <p class="sr-only" role="status">{{ status }}</p>
    <p v-if="soundError" class="feedback" role="status">{{ soundError }}</p>
    <div class="timer-actions">
      <button v-if="isSounding" class="button primary" @click="stopSound">
        <i class="mdi mdi-volume-off" aria-hidden="true"></i>音を止める
      </button>
      <button v-else-if="isInitial || finished" class="button primary" @click="handleStart">
        <i class="mdi mdi-play" aria-hidden="true"></i
        >{{ finished ? 'もう一度スタート' : 'スタート' }}
      </button>
      <button v-else class="button primary" @click="handleToggle">
        <i :class="['mdi', isActive ? 'mdi-pause' : 'mdi-play']" aria-hidden="true"></i
        >{{ isActive ? '一時停止' : '再開' }}
      </button>
      <button
        class="button secondary reset-button"
        aria-label="タイマーをリセット"
        :disabled="isInitial"
        @click="handleReset"
      >
        <i class="mdi mdi-restart" aria-hidden="true"></i>
      </button>
    </div>
  </div>
</template>
