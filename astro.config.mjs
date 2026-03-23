import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, envField } from 'astro/config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  output: 'server',
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    plugins: [tailwindcss()],
  },
  integrations: [react()],
  adapter: vercel(),
  env: {
    schema: {
      API_URL: envField.string({
        context: 'server',
        access: 'secret',
      }),
      API_KEY: envField.string({
        context: 'server',
        access: 'secret',
      }),
      GROQ_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
      }),
      MCP_URL: envField.string({
        context: 'server',
        access: 'secret',
      }),
      VERCEL_AUTOMATION_BYPASS_SECRET: envField.string({
        context: 'server',
        access: 'secret',
      }),
    },
  },
})
