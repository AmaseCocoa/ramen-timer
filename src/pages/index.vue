<script setup lang="ts">
import { useProductHistory } from '@/composable/useProductHistory'

const { entries, storageError, remove } = useProductHistory()
const dateFormat = new Intl.DateTimeFormat('ja-JP', { dateStyle: 'medium', timeStyle: 'short' })
</script>

<template>
  <header class="page-heading">
    <p class="eyebrow">これまでの一杯。</p>
    <h1>履歴</h1>
    <p>読み取った商品を、新しい順に。商品を選ぶとタイマーを開けます。</p>
  </header>
  <p v-if="storageError" class="feedback" role="status">{{ storageError }}</p>
  <template v-if="entries.length">
    <ul class="history-list">
      <li v-for="item in entries" :key="item.jan" class="history-item">
        <RouterLink :to="{ path: '/timer', query: { jan: item.jan } }" class="history-link">
          <span class="history-icon mdi mdi-noodles" aria-hidden="true"></span>
          <span class="history-copy"
            ><strong>{{ item.name }}</strong
            ><span
              >{{ Math.floor(item.seconds / 60) }} 分<span v-if="item.seconds % 60">
                {{ item.seconds % 60 }} 秒</span
              >
              · 湯切り{{ item.hasDrain ? 'あり' : 'なし' }}</span
            ><time :datetime="item.viewedAt">{{
              dateFormat.format(new Date(item.viewedAt))
            }}</time></span
          >
          <i class="mdi mdi-chevron-right" aria-hidden="true"></i>
        </RouterLink>
        <button
          class="button secondary history-remove"
          :aria-label="`${item.name}を履歴から削除`"
          :disabled="!!storageError"
          @click="remove(item.jan)"
        >
          <i class="mdi mdi-close" aria-hidden="true"></i>
        </button>
      </li>
    </ul>
    <p class="history-note">
      履歴はこのブラウザに最大100件保存します。同じ商品は最新の1件にまとめます。
    </p>
  </template>
  <section v-else class="empty-state">
    <span class="empty-icon mdi mdi-history" aria-hidden="true"></span>
    <h2>まだ履歴はありません</h2>
    <p>バーコードから見つかった商品がここに並びます。</p>
    <RouterLink to="/read" class="button primary"
      >商品を読み込む<i class="mdi mdi-arrow-right" aria-hidden="true"></i
    ></RouterLink>
  </section>
</template>
