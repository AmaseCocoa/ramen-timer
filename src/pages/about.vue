<template>
  <header class="page-heading">
    <p class="eyebrow">カップ麺の、待ち時間に。</p>
    <h1>CapDBについて</h1>
    <p>JANコードから、カップ麺の調理時間を調べるツールです。</p>
  </header>
  <article class="about-content">
    <section>
      <h2>読み取って、時間をセット</h2>
      <p>
        商品のバーコードをカメラで読み込むと、登録された商品名・待ち時間・湯切りの有無を表示します。お湯を注いだらタイマーをスタート。商品が見つからなくても、分・秒を入力して使えます。
      </p>
      <RouterLink to="/read" class="text-link"
        >バーコードを読み込む <i class="mdi mdi-arrow-right" aria-hidden="true"></i
      ></RouterLink>
    </section>
    <section>
      <h2>商品のデータについて</h2>
      <p>
        商品情報は公開データリポジトリ capdb-data
        から取得します。未登録の商品や、パッケージの変更が反映されていない商品もあります。調理するときは、実際のパッケージに書かれた手順・時間を確認してください。
      </p>
      <a
        href="https://github.com/AmaseCocoa/capdb-data"
        class="text-link"
        target="_blank"
        rel="noopener noreferrer"
        >商品データを見る <i class="mdi mdi-open-in-new" aria-hidden="true"></i
        ><span class="sr-only">（新しいタブ）</span></a
      >
    </section>
    <section>
      <h2>履歴とカメラ</h2>
      <p>
        見つかった商品の履歴は、このブラウザのローカルストレージに最大100件保存します。別の端末とは同期されず、ブラウザのサイトデータを削除すると消えます。履歴画面から1件ずつ削除することもできます。
      </p>
      <p>
        カメラは読み込み画面で起動したときに使用します。読み取ったJANコードを使って商品データを取得します。商品情報の取得にはインターネット接続が必要です。
      </p>
    </section>
    <section>
      <h2>タイマーを使うとき</h2>
      <p>
        時間を設定し直すとタイマーはリセットされます。画面を閉じたり再読み込みしたりすると、計測は引き継がれません。端末のスリープやブラウザの動作によって表示の更新が遅れることがあります。
      </p>
      <RouterLink to="/timer" class="text-link"
        >タイマーを使う <i class="mdi mdi-arrow-right" aria-hidden="true"></i
      ></RouterLink>
    </section>
  </article>
</template>
