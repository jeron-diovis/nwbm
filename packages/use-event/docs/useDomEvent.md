# useDomEvent

Yet another implementation of React hook for listening to DOM events.

---
```sh
npm install -S @yai/use-event
```

```ts
import { useDomEvent } from '@yai/use-event'

// Basic usage
const Component = () => {
  const ref = useRef(null)
  useEvent(ref, 'click', e => console.log(e))
  return <div ref = {ref} />
}

// Listen to multiple events at once
useEvent(ref, ['click', 'keypress'], e => console.log(e))
// Or with differenr listener for each event
useEvent(ref, {
  'click': e => console.log(e),
  'keypress': e => console.log(e),
})

// Listen to document events.
// SSR-safe – no need for `if typeof document === 'undefined' ...`
useEvent('document', 'click', e => console.log(e))
// Same for window
useEvent('window', 'click', e => console.log(e))
```

## API

### `useDomEvent(target, type, listener, options?)`
### `useDomEvent(target, listeners, options?)`

| Argument        | Type                                                                                         | Required | Description                                                                                                                                                                                                                
|-----------------|----------------------------------------------------------------------------------------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| target          | <code>React.RefObject&lt;T&gt; &#124; T &#124; 'window' &#124; 'document' &#124; null</code> | Yes      | DOM element to attach the event listener to. Note the usage of string values for 'window' and 'document' instead of direct references – that allows for SSR-safe code, not causing reference errors when you prerender it. 
| type            | <code>string &#124; string[]</code>                                                           | Yes      | _(overload 1)_ The type of event to listen for. Allowed types are inferred from given `target`.                                                                                                                            |
| listener        | `(event: E) => any`                                                                          | Yes      | _(overload 1)_ The callback invoked when the event type fires. Its argument type is inferred accordingly to given `type`.                                                                                                  |
| listeners       | `Record<string, (event: E) => any>`                                                          | Yes      | _(overload 2)_ Replace `type` and `listener` with a set of listeners, allowing to assign multiple different handlers with one call.                                  |
| options         | `AddEventListenerOptions`                                                                    | No       | [Event listener options](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#optionshttps://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options)                       |
| options.enabled | `boolean`                                                                                    | No       | Allows to cancel event subscription without unmounting component. Useful for things like `onClickOutside`, when you only need to have listener attached when modal is open.                                                
| options.filter  | `(event: E) => boolean`                                                                      | No       | Return `false` to prevent callback execution. Allows for a cleaner functional-style approach to conditional logic, with callback and predicate separated. For example, handy for filtering `keypress` events.              

## [Why need yet another implementation?](https://xkcd.com/927/)

| Feature                                          | @yai/use-event                               | [@react-hook/event](https://github.com/jaredLunde/react-hook/blob/master/packages/event/README.md) | [@custom-react-hooks/use-event-listener](https://github.com/djkepa/custom-react-hooks/blob/main/packages/use-event-listener/README.md) | [react-use/useEvent](https://github.com/streamich/react-use/blob/master/docs/useEvent.md)
|--------------------------------------------------|----------------------------------------------| ----- | ----- | ----- |
| Infer precise event type from `target` parameter | ✅                                            | ✅ | ❌ | ❌ | 
| Subscribe to list of events                      | ✅                                            |❌ |✅ |❌ |
| Subscribe to map of events                       | ✅                                            |❌ |❌ |❌ |
| SSR-safe subscriptions to Window and Document    | ✅                                            |❌ |❌ |❌ |
| Support event listener options                   | ✅                                            | ❌|✅ |✅ | 
| `options.enabled`                                | ✅                                            |❌ |✅ |❌ |
| `options.filter`                                 | ✅                                            |❌ |❌ |❌ |
| Options don't need memoization*                  | ✅                                            |✅ | ❌| ❌|
| Callback doesn't need memoization*               | ✅                                            |✅ |✅ | ❌|
| `cleanup` callback                               | ❌ (honestly, just don't see usecases for it) |✅ |❌ |❌ |

> `*` Meaning, effect won't re-run on every render if you simply pass this value inline, without wrapping into `useMemo` / `useCallback`.
