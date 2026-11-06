import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'vue-router/vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import ViteFonts from 'unplugin-fonts/vite'

import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(async ({ command }) => {
  let dataTag = ''
  if (command === 'build') {
    const response = await fetch(
      'https://api.github.com/repos/AmaseCocoa/ramen-db/tags?per_page=1',
      {
        headers: {
          Accept: 'application/vnd.github+json',
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        signal: AbortSignal.timeout(15_000),
      },
    )
    if (!response.ok) throw new Error(`Failed to fetch ramen-db tags: ${response.status}`)

    const tags = (await response.json()) as { name: string }[]
    if (!tags[0]?.name) throw new Error('ramen-db has no tags')
    dataTag = tags[0].name
    console.info(`Using ramen-db tag: ${dataTag}`)
  }

  return {
    define: {
      __RAMEN_DB_TAG__: JSON.stringify(dataTag),
    },
    plugins: [
      VueRouter({}),
      vue(),
      vueDevTools(),
      ViteFonts({
        fontsource: {
          families: [
            {
              name: 'Roboto',
              weights: [100, 300, 400, 500, 700, 900],
              styles: ['normal', 'italic'],
            },
          ],
        },
      }),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
