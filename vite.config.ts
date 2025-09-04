import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Roue-resto/',   // le nom EXACT de ton repo entre les slashes
  plugins: [react()],
})

