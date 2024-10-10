import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: `apps/${process.env.TARGET_APP || 'example_app'}`,
  publicDir: './public',
  test: {
    environment: 'happy-dom',
  },
})
