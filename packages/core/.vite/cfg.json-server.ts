import sysPath from 'path'

import { loadEnv } from 'vite'
import mockDevServerPlugin, {
  MockOptions,
  createDefineMock,
} from 'vite-plugin-mock-dev-server'
import { defineChunk } from 'vite-split-config'

import chalk from 'chalk'
import { flow } from 'lodash-es'

// ---

/* At the time this config file is read, env files are not loaded.
 * So we can't use `process.env` directly. */
const env = loadEnv(
  'development' /* Assume json-server is only needed in dev mode anyway */,
  '',
  ''
)

const DEFAULT_API_PREFIX = '/api'

const ENV_KEY = 'USE_JSON_SERVER'
const ENV_VAL_USE_DEFAULT = 'true'

const ENV_VAL = env[ENV_KEY]
const isServerEnabled = ENV_VAL !== undefined

function resolveApiPrefix(): string[] {
  if (!isServerEnabled) {
    return []
  }
  const str = ENV_VAL === ENV_VAL_USE_DEFAULT ? DEFAULT_API_PREFIX : ENV_VAL
  return str.split('|')
}

// ---

export const useJsonServer = defineChunk(() => {
  const prefix = resolveApiPrefix()
  logServerState(isServerEnabled, prefix)
  if (isServerEnabled) {
    return {
      plugins: [
        /** @see https://github.com/pengzhanbo/vite-plugin-mock-dev-server#options */
        mockDevServerPlugin({
          prefix,
          log: 'info',
        }),
      ],
    }
  }
})

// ---

function logServerState(enabled: boolean, prefix: string[]) {
  const filepath = sysPath.relative(process.cwd(), __filename)
  const tag = chalk.blueBright(`[${filepath}]`)
  if (enabled) {
    console.log(
      `${tag} mock-server ${chalk.green('enabled')}. Mocking requests starting with: ${prefix.map(x => chalk.cyan(x)).join(' , ')}`
    )
  } else {
    console.log(
      `${tag} mock-server ${chalk.red('disabled')}.
To enable data mocking, you may add one of the following env variables:
* ${chalk.blue(`${ENV_KEY}=${ENV_VAL_USE_DEFAULT}`)} – to intercept requests to default ${chalk.cyan(DEFAULT_API_PREFIX)} path
* ${chalk.blue(`${ENV_KEY}=/prefix1|/prefix2|...`)} – to intercept requests to custom paths
`
    )
  }
}

// ---

type Mock = MockOptions[number]
type MockTransform = (mock: Mock) => Mock

const createMockTransform =
  (transform: (mock: Mock) => Mock | void): MockTransform =>
  mock =>
    transform(mock) ?? mock

/**
 * Prepend api paths prefix to created mocks
 */
export const createTransformPathPrefix = (prefix: string) =>
  createMockTransform(mock => {
    if (!mock.url.startsWith('/')) {
      mock.url = sysPath.join(prefix, mock.url)
    }
  })

export const transformPathPrefix = createTransformPathPrefix(DEFAULT_API_PREFIX)

/**
 * For non-WS mocks, default method is ['GET', 'POST']
 * Which may be very unexpected, when your 'default' GET mock intercepts an explicitly specified POST mock.
 * @see https://github.com/pengzhanbo/vite-plugin-mock-dev-server/blob/04d7c9bb13e8b2961271944c379aeb2f295a7a04/src/baseMiddleware.ts#L220
 */
export const transformGetOnly = createMockTransform(mock => {
  if (!('ws' in mock) && !('method' in mock)) {
    mock.method = 'GET'
  }
})

/**
 * Automatically `JSON.stringify` objects and arrays passed to `response.end()`
 */
export const transformStringifyResponse = createMockTransform(mock => {
  if ('response' in mock && mock.response !== undefined) {
    const maybeStringify = (arg: unknown) =>
      arg?.constructor === Object || arg?.constructor === Array
        ? JSON.stringify(arg)
        : arg

    const { response } = mock
    mock.response = function (req, res, next) {
      const { end } = res
      // @ts-expect-error Exact types are unnecessarily cumbersome here.
      res.end = function (arg, ...rest) {
        return end.apply(this, [maybeStringify(arg), ...rest] as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      }

      return response(req, res, next)
    }
  }
})

export const defineMock = createDefineMock(
  flow(transformPathPrefix, transformGetOnly, transformStringifyResponse)
)
