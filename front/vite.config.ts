import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server:{
    allowedHosts: [
      'b3a1-77-125-56-69.ngrok-free.app'
    ]
  }
})


