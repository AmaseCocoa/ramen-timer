<script setup lang="ts">
import { useTimeFormatter } from '@/composable/useTimeFormatter';
import { useCountdown } from '@vueuse/core';
import { ref, toRef } from 'vue';

const props = defineProps<{
  seconds: number
}>();

const secondsRef = toRef(props, 'seconds');
const { remaining, isActive, start, pause, resume, reset } = useCountdown(secondsRef);
const { formattedTime } = useTimeFormatter(remaining);

const isInitial = ref(true);

// const isPaused = computed(() => !isActive.value && !isInitial.value && remaining.value > 0);

const handleStart = () => {
  isInitial.value = false;
  start();
};

const handleToggle = () => {
  if (isActive.value) {
    pause();
  } else {
    resume();
  }
};

const handleReset = () => {
  isInitial.value = true;
  pause();
  reset();
};
</script>

<template>
  <p>残り {{ formattedTime }}</p>

  <button v-if="isInitial" @click="handleStart">スタート</button>

  <template v-else>
    <button @click="handleToggle">
      {{ isActive ? 'ストップ' : '再開' }}
    </button>

    <button @click="handleReset">リセット</button>
  </template>
</template>
