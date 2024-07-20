import { defineChunk } from 'vite-split-config'

export const useCSS = defineChunk({
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'camelCase',
    },
  },
})
