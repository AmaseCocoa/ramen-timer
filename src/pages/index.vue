<template>
  <header class="page-heading">
    <p class="eyebrow">これまでの一杯。</p>
    <h1>履歴</h1>
    <p>カップ麺の記録を、ここに。</p>
  </header>
  <section class="empty-state">
    <span class="empty-icon mdi mdi-history" aria-hidden="true"></span>
    <h2>まだ履歴はありません</h2>
    <p>履歴を記録する機能は準備中です。<br />待ち時間にはタイマーを使えます。</p>
    <RouterLink to="/timer" class="button primary"
      >タイマーを使う<i class="mdi mdi-arrow-right" aria-hidden="true"></i
    ></RouterLink>
  </section>
</template>
