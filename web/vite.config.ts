import { defineConfig } from 'vite'

export default defineConfig({
  base: '/PixelMatrix/',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        app: 'app.html',
      },
    },
  },
})
