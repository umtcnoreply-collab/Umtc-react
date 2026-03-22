import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/career/registration/', // Serves at umtcapply.com/career/registration
  plugins: [
    react(),
    tailwindcss(),
  ],
})