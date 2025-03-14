import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    allowedHosts: [
      'e8f2-2a02-6680-210b-5f5c-704c-437b-9b15-c30d.ngrok-free.app'
    ]
  }
})


