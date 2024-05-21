import rollupNodePolyFill from 'rollup-plugin-node-polyfills'
import { Plugin } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { defineChunk } from 'vite-split-config'

/**
 * @see https://stackoverflow.com/a/70666018/3437433
 */
export const useNodeCompat = defineChunk({
  plugins: [
    nodePolyfills({
      include: ['events'],
      globals: {
        Buffer: true, // can also be 'build', 'dev', or false
        process: true,
      },
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis', // Node.js global to browser globalThis
      },
    },
  },

  build: {
    rollupOptions: {
      plugins: [
        // Enable rollup polyfills plugin used during production bundling
        rollupNodePolyFill() as Plugin,
      ],
    },
  },
})
