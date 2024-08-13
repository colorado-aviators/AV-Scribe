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
                icons: [
                  {
                      src: "google-touch-icon.png",
                      sizes: "512x512",
                      type: "image/png",
                      purpose: "any maskable"
                  },
                  {
                      src: "favicon.svg",
                      sizes: "any",
                      type: "image/svg+xml",
                      purpose: "any maskable"
                  },
                  {
                      src: "apple-touch-icon-180-180.png",
                      sizes: "180x180",
                      type: "image/png",
                      purpose: "any maskable"
                  },
                  {
                      src: "/apple-touch-icon-180-180.png",
                      sizes: "180x180",
                      type: "image/png",
                      purpose: "any maskable"
                  }
                ]
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
  base: "./"
})
