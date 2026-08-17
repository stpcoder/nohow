import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/nohow/',
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => assetInfo.names[0]?.endsWith('.mp4')
          ? 'nohow-demo.mp4'
          : 'assets/[name]-[hash][extname]',
      },
    },
  },
})
