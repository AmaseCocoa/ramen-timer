import './main.css'
import 'unfonts.css'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'


const router = createRouter({
  history: createWebHistory(),
  routes,
})

const vuetify = createVuetify({
  blueprint: md3,
  components,
  directives,
  icons: {
    defaultSet: 'mdi'
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1565C0',     // メインカラー（濃い青）
          secondary: '#42A5F5',   // サブカラー（明るい青）
          accent: '#80D8FF',      // アクセントカラー
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        },
      },
      dark: {
        colors: {
          primary: '#90CAF9',     // ダークテーマ用の青
          secondary: '#1E88E5',
        },
      },
    },
  },
})

createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app')
