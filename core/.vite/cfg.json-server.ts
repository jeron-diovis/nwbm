import * as sysPath from 'path'

import mockDevServerPlugin, {
  MockOptions,
  createDefineMock,
} from 'vite-plugin-mock-dev-server'
import { defineChunk } from 'vite-split-config'

// ---

const API_PREFIX = '/api'

// ---

export const defineMock = createDefineMock(mock => {
  if (!mock.url.startsWith('/')) {
    mock.url = sysPath.join(API_PREFIX, mock.url)
  }

  /* For non-WS mocks, default method is ['GET', 'POST']
   * Which may be very unexpected, when your 'default' GET mock intercepts an explicitly specified POST mock.
   * @see https://github.com/pengzhanbo/vite-plugin-mock-dev-server/blob/04d7c9bb13e8b2961271944c379aeb2f295a7a04/src/baseMiddleware.ts#L220
   */
  if (!('ws' in mock) && !('method' in mock)) {
    mock.method = 'GET'
  }

  enableAutoStringify(mock)
})

/**
 * Automatically `JSON.stringify` objects and arrays passed to `response.end()`
 */
function enableAutoStringify(mock: MockOptions[0]) {
  if ('response' in mock && mock.response !== undefined) {
    const { response } = mock
    mock.response = function (req, res, next) {
      const { end } = res
      res.end = function (this: typeof res, arg, ...rest) {
        const chunk =
          arg?.constructor === Object || arg?.constructor === Array
            ? JSON.stringify(arg)
            : arg
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return end.call(this, chunk, ...(rest as [any, any]))
      } as typeof end

      return response(req, res, next)
    }
  }
  return mock
}

// ---

const ENV_KEY = 'USE_JSON_SERVER'
const ENV_VAL = 'true'

/** @see https://github.com/pengzhanbo/vite-plugin-mock-dev-server#options */
const PLUGIN = mockDevServerPlugin({
  prefix: API_PREFIX,
  log: 'info',
})

export const useJsonServer = defineChunk((_, { env }) => {
  const enabled = env[ENV_KEY] === ENV_VAL
  logServerState(enabled)
  return enabled ? { plugins: [PLUGIN] } : undefined
})

// ---

function logServerState(enabled: boolean) {
  if (enabled) {
    console.log(`[json-server] Server enabled. Mocking requests: ${API_PREFIX}`)
  } else {
    console.log(
      `[json-server] Server disabled. To enable data mocking, add env variable '${ENV_KEY}=${ENV_VAL}'`
    )
  }
}
