import { onScopeDispose, ref } from 'vue'

export function useTimerSound() {
  const soundError = ref('')
  const isSounding = ref(false)
  let context: AudioContext | null = null
  const tones = new Set<OscillatorNode>()

  function stopSound() {
    isSounding.value = false
    for (const tone of tones) {
      tone.stop()
      tone.disconnect()
    }
    tones.clear()
  }

  async function prepareSound() {
    soundError.value = ''
    try {
      context ??= new AudioContext()
      await context.resume()
    } catch {
      soundError.value =
        '通知音を有効にできませんでした。端末やブラウザの音声設定を確認してください。'
    }
  }

  function playSound() {
    stopSound()
    if (!context || context.state !== 'running') {
      soundError.value = '通知音を再生できませんでした。タイマーは終了しています。'
      return
    }
    isSounding.value = true
    const now = context.currentTime
    // 3音を1セットとして、3秒おきに最大5セット鳴らす。
    for (let index = 0; index < 15; index++) {
      const tone = context.createOscillator()
      const volume = context.createGain()
      const time = now + Math.floor(index / 3) * 3 + (index % 3) * 0.4
      tone.type = 'sine'
      tone.frequency.value = 880
      volume.gain.setValueAtTime(0, time)
      volume.gain.linearRampToValueAtTime(0.2, time + 0.02)
      volume.gain.linearRampToValueAtTime(0, time + 0.25)
      tone.connect(volume)
      volume.connect(context.destination)
      tones.add(tone)
      tone.onended = () => {
        tones.delete(tone)
        if (tones.size === 0) isSounding.value = false
        tone.disconnect()
        volume.disconnect()
      }
      tone.start(time)
      tone.stop(time + 0.3)
    }
  }

  onScopeDispose(() => {
    stopSound()
    void context?.close().catch(() => {})
  })

  return { soundError, isSounding, prepareSound, playSound, stopSound }
}
