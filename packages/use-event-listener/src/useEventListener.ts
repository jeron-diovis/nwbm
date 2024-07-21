import { useRef } from 'react'

import { useEvent } from './useEvent'
import { IUseEventListener, RefOrVal } from './useEventListener.types'

type Target = RefOrVal<HTMLElement> | 'window' | 'document'

export const useEventListener: IUseEventListener = (
  target: Target,
  ...args: any[]
) => {
  const refBrowserGlobal = useRef(resolveBrowserGlobal(target))
  const el =
    target === 'window' || target === 'document' ? refBrowserGlobal : target

  return useEvent(...([el, ...args] as Parameters<typeof useEvent>))
}

function resolveBrowserGlobal(target: Target) {
  /* eslint-disable no-nested-ternary */
  return target === 'window'
    ? typeof window === 'undefined'
      ? null
      : window
    : target === 'document'
      ? typeof document === 'undefined'
        ? null
        : document
      : null
  /* eslint-enable no-nested-ternary */
}
