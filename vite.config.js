import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/finc/',
  plugins: [vue()],
  build: { outDir: 'dist' }
})
