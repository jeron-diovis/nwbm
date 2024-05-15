import { defineChunk } from 'vite-split-config'

/**
 * Remember that proxy settings have lower precedence than json-server plugin.
 * If something here doesn't work as you expect,
 * check out configurations in the `mock` folder – maybe there is an overlap.
 * Or remove the plugin if you don't need it.
 */
export const useProxy = defineChunk({
  server: {
    proxy: {
      /**
       * Replace this with your backend server
       */
      '^/api': {
        target: 'https://jsonplaceholder.typicode.com/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})
