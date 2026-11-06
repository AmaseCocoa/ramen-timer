<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

const tabs = [
  { id: 'history', name: '履歴', path: '/' },
  { id: 'timer', name: 'タイマー', path: '/timer' },
  { id: 'read', name: '読み込み', path: '/read' },
]
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
    <header class="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-20">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
          T
        </div>
        <span class="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          CapDB
        </span>
      </div>
    </header>

    <main class="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
      <nav class="flex border-b border-slate-800 mb-8 gap-2">
        <RouterLink
          v-for="tab in tabs"
          :key="tab.id"
          :to="tab.path"
          class="px-5 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
          active-class="!border-indigo-500 !text-white bg-indigo-500/10 rounded-t-lg"
        >
          {{ tab.name }}
        </RouterLink>
      </nav>

      <div class="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8">
        <RouterView />
      </div>
    </main>
  </div>
</template>
