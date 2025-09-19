import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@convex': path.resolve(__dirname, '../backend/convex'),
    },
  },
  server: {
    host: '0.0.0.0', // Expose to network
    port: 5173
  }
})