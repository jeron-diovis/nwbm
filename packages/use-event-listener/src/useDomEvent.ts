import { useRef } from 'react'

import { IUseDomEvent, RefOrVal } from './useDomEvent.types'
import { useEvent } from './useEvent'

type Target = RefOrVal<HTMLElement> | 'window' | 'document'

export const useDomEvent: IUseDomEvent = (target: Target, ...args: any[]) => {
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
