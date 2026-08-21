import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // base: "/Inventory_Attestation/",
  plugins: [react()],

  server: {
    proxy: {
      "/Inventory_Attestation/api": {
        target: "http://localhost:80",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
