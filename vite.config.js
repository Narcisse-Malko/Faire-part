import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Le code, les styles et les polices sont regroupés dans index.html.
// Les fichiers audio restent à part pour que la page s'affiche vite :
// la musique ne se télécharge qu'à l'ouverture de l'enveloppe.
const isAudio = (file) => /\.(mp3|mpeg|m4a|aac|ogg|oga|wav|flac)(\?.*)?$/i.test(file)

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), viteSingleFile({ useRecommendedBuildConfig: false })],
  build: {
    assetsInlineLimit: (file) => !isAudio(file),
    assetsDir: '',
    cssCodeSplit: false,
    chunkSizeWarningLimit: 100000000,
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
})
