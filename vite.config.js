import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/windtemp": {
        target: "https://aviationweather.gov/api/data/windtemp",
        changeOrigin: true,
        rewrite: () => "",
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@react-google-maps')) return 'google-maps';
        }
      }
    }
  }
})
