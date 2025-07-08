import { defineChunk } from 'vite-split-config'
import { configDefaults } from 'vitest/config'

/**
 * @see https://github.com/vitest-dev/vitest/discussions/1106#discussioncomment-2531279
 * 04.09.23: MUST use function form. Probably return type widening helps.
 */
export const useTests = defineChunk(() => ({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['test/setupTests'],

    forceRerunTriggers: [...configDefaults.forceRerunTriggers, '**/.vite/**'],
    /**
     * Uncomment to enable in-source testing.
     * @see https://vitest.dev/guide/in-source.html
     */
    // includeSource: ['src/!**/!*.{js,ts}{,x}'],
  },
  define: {
    /**
     * @see https://vitest.dev/guide/in-source.html#production-build
     */
    'import.meta.vitest': 'undefined',

    /** Whatever the hell punycode is, it spams it's deprecation warnings no matter what you do */
    'process.env.NODE_OPTIONS': '"--no-deprecation"',
  },
}))
