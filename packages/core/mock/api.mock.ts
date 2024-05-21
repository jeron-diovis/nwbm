import { defineMock } from '~mock'

/**
 * @see https://github.com/pengzhanbo/vite-plugin-mock-dev-server#mock-configuration
 */
export default defineMock([
  {
    url: 'test',
    body: {
      demo: 'The mock api works!',
    },
  },
])
