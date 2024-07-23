# @yai/use-event

React hooks for subscribing to event emitters.

---

## [useDomEvent](/docs/use-dom-event.md)

Subscribe to events on DOM elements.

```ts
import { useDomEvent } from '@yai/use-event'

const Component = () => {
  const ref = useRef(null)
  useEvent(ref, 'click', e => console.log(e))
  return <div ref = {ref} />
}

// Listener options 
useEvent(ref, 'scroll', e => console.log(e), { passive: true })

// Listen to multiple events at once
useEvent(ref, ['click', 'keypress'], e => console.log(e))
```

More details in [dedicated page](/docs/use-dom-event.md).

---
## [useEvent](/docs/use-event.md)

Low-level hook for subscribing to arbitrary event emitters.

Supports targets providing any of following interfaces:
- `on` / `off`
- `addEventListener` / `removeEventListener`
- `addListener` / `removeListener`

```ts  
import { useEvent } from '@yai/use-event'

// With EventEmitter
const emitter = new EventEmitter()
...
useEvent(emitter, 'my-event', e => console.log(e))
...
emitter.emit('my-event')
```

See detailed usage examples in [dedicated page](/docs/use-event.md).
