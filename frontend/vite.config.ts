import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Bind to all available network interfaces
    port: 3000, // Default port, change if necessary
  },
  plugins: [react()],
})

