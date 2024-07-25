import { useRef } from 'react'

import { IUseDomEvent, RefOrVal } from './useDomEvent.types'
import { useEvent } from './useEvent'

type Target = RefOrVal<HTMLElement> | 'window' | 'document'

export const useDomEvent: IUseDomEvent = (target: Target, ...args: any[]) => {
  const refGlobalTarget = useRef<GlobalTarget>()
  refGlobalTarget.current = resolveGlobalTarget(target)

  const el =
    target === 'window' || target === 'document' ? refGlobalTarget : target

  return useEvent(...([el, ...args] as Parameters<typeof useEvent>))
}

type GlobalTarget = Window | Document | null

function resolveGlobalTarget(target: Target): GlobalTarget {
  return target === 'window'
    ? typeof window === 'undefined'
      ? null
      : window
    : target === 'document'
      ? typeof document === 'undefined'
        ? null
        : document
      : null
}
