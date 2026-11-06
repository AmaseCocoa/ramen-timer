<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

const destinations = [
  { name: 'タイマー', path: '/timer', icon: 'mdi-timer-outline' },
  { name: '読み込み', path: '/read', icon: 'mdi-barcode-scan' },
  { name: '履歴', path: '/', icon: 'mdi-history' },
]
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <RouterLink to="/timer" class="brand" aria-label="CapDB タイマーへ">
        <img src="/twemoji_ramen.png" alt="" width="40" height="40" />
        <span>CapDB<small>カップ麺の、待ち時間に。</small></span>
      </RouterLink>
      <nav class="navigation" aria-label="メインナビゲーション">
        <RouterLink
          v-for="item in destinations"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          exact-active-class="selected"
        >
          <i :class="['mdi', item.icon]" aria-hidden="true"></i>
          <span>{{ item.name }}</span>
        </RouterLink>
      </nav>
      <p class="sidebar-note">お湯を注いで、ひと休み。</p>
    </aside>
    <main class="main-content"><RouterView /></main>
  </div>
</template>
