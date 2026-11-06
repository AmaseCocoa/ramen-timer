import { computed, isRef, type Ref } from 'vue'

export function useTimeFormatter(secondsRef: Ref<number, number>) {
  const formattedTime = computed(() => {
    const totalSeconds = isRef(secondsRef) ? secondsRef.value : secondsRef

    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  })

  return {
    formattedTime
  }
}
