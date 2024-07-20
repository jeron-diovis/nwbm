import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { defineChunk } from 'vite-split-config'

export const useReact = defineChunk({
  plugins: [
    react(),
    svgr(), // import { ReactComponent } from '*.svg'
  ],
})
