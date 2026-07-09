import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// `npm run dev` serves only the frontend. To exercise /api routes, either run
// `npx vercel dev`, or point the dev server at a deployment:
//   PB_API_PROXY=https://promptburger.app npm run dev
const apiProxyTarget = process.env.PB_API_PROXY

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: apiProxyTarget
    ? { proxy: { '/api': { target: apiProxyTarget, changeOrigin: true } } }
    : undefined,
})
