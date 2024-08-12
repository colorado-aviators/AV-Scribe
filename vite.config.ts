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
                'favicon.svg',
                'apple-touch-icon-180-180.png',
                'google-touch-icon-180-180.png'
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
                      src: "google-touch-icon.png",
                      sizes: "512x512",
                      type: "image/png",
                      purpose: "any"
                  },
                  {
                      src: "favicon.svg",
                      sizes: "512x512",
                      type: "image/svg",
                      purpose: "any"
                  },
                  {
                      src: "apple-touch-icon-180-180.png",
                      sizes: "512x512",
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
