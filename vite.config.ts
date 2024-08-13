import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA(
        {
            registerType: 'autoUpdate',
            includeAssets: [
                './public/favicon.svg',
                './public/apple-touch-icon-180-180.png',
                './public/google-touch-icon-180-180.png'
            ],
            manifest: {
                name: 'AV Scribe',
                short_name: 'av-scribe',
                description: 'A web app for capturing aviation information over the radio',
                theme_color: '#ffffff',
                background_color: "#ffffff",
                display: "fullscreen",
                icons: [
                    {
                      src: "./public/favicon.svg",
                      type: "image/svg+xml",
                      purpose: "any"
                    },
                    {
                      src: "./public/google-touch-icon.png",
                      sizes: "512x512",
                      type: "image/png",
                      purpose: "any"
                  },
                  {
                      src: "./public/apple-touch-icon-180-180.png",
                      sizes: "180x180",
                      type: "image/png",
                      purpose: "maskable"
                  }
                ]
            }
        }
    )
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: './'
})
