import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// viteSingleFile regroupe tout (JS, CSS, polices) dans un seul index.html,
// pratique pour héberger le faire-part n'importe où.
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
})
