# <img src="./public/twemoji_ramen.png" width="30" height="30" align="center" /> Ramen Timer

> [!WARNING]
> このフロントエンドはまだ未完成です！実際に使用することはできません

JANコードからカップ麺の調理時間を検索できる謎ツール

## API
実験的なAPIも提供しています (データは毎時更新): `https://ramendb.amase.cc` (準備中)

## Data
データはGitHubの[ramen-db](https://github.com/AmaseCocoa/ramen-db)リポジトリに保管されます。

開発時は `raw.githack.com` の `main` を参照します。本番ビルドではGitHub Tags APIの先頭のタグを取得し、`rawcdn.githack.com` のタグ付きURLを埋め込みます。タグがない場合や取得に失敗した場合、ビルドは失敗します。

## Deploy

GitHub ActionsからWranglerでCloudflare Workers（静的アセット）へデプロイします。`main` へのpush、2時間ごと（UTCの偶数時17分）、Actionsの `Deploy to Cloudflare` → `Run workflow` で実行します。毎回タグを取得して再ビルドするので、ramen-dbの新しいタグも反映されます。定期実行はデフォルトブランチ上で動作し、GitHub側の状況によって遅延することがあります。

リポジトリのActions secretsに以下を設定してください。

- `CLOUDFLARE_API_TOKEN`: 対象アカウントのWorkers Scripts編集権限を持つAPIトークン
- `CLOUDFLARE_ACCOUNT_ID`: デプロイ先のCloudflareアカウントID

Worker名は `wrangler.jsonc` の `name`（初期値: `capdb`）で設定します。
初回デプロイ前にramen-db側でタグを作成してください。

参考: [githackの本番URL](https://raw.githack.com/)、[Wrangler GitHub Action](https://github.com/cloudflare/wrangler-action)。
