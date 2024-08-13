import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  define: {
    __DATE__: `'${new Date().toISOString()}'`,
  },
  plugins: [
    vue(),
    VitePWA(
        {
            injectRegister: 'auto',
            registerType: 'autoUpdate',
            base: '/',
            manifest: {
                name: 'AV Scribe',
                short_name: 'av-scribe',
                description: 'A web app for capturing aviation information over the radio',
                theme_color: '#ffffff',
                background_color: "#ffffff",
                display: "fullscreen",
            },
        }
    )
  ],
  build: {
    assetsInlineLimit: 0,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: ""
})
