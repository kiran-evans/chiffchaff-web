import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  envDir: './config',
  envPrefix: 'ENV',
  server: {
    corse: true,
    port: 5174
  }
})
