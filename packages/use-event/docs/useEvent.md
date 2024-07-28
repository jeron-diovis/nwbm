# useEvent

React hook for listening to events of any EventEmitter interface.

Supports targets providing any of following interfaces:

- `on` / `off`
- `addEventListener` / `removeEventListener`
- `addListener` / `removeListener`

 ---

```sh  
npm install -S @nwbm/use-event
```  

---

```ts
import { useEvent } from '@nwbm/use-event'

// With EventEmitter
const emitter = new EventEmitter()
...
useEvent(emitter, 'my-event', e => console.log(e))
...
emitter.emit('my-event')

// With DOM elements
const Component = () => {
  const ref = useRef(null)
  useEvent(ref, 'click', e => console.log(e), {capture: true})
  return <div ref = {ref} />
}

// Listen to multiple events at once  
useEvent(emitter, ['foo', 'bar'], e => console.log(e))

useEvent(emitter, {
  foo: e => console.log(e),
  bar: e => console.warn(e),
})
```

## Typescript

By default, hook will try to infer types of event names, event object , and event listener options from given emitter
interface – but it can't do much. For example, when using with `HTMLElement`, because how types for it are defined in TS
standard lib, allowed event names will be inferred as just `string`, and event type as the most generic `Event`. Not
quite useful.

So for better types support additional tools are provided:

### `useDomEvent`

For DOM elements specifically – use the [`useDomEvent`](/docs/useDomEvent.md) hook. It does all the same as `useEvent`,
but is strongly typed for usage with `HTMLElement` / `Document` / `Window` targets.

---

### `createUseEvent`

For usage with arbitrary emitter, you can define your own version of `useEvent` with explicit events map:

```ts
import { createUseEvent } from "@nwbm/use-event"

type MyEvent = { foo: boolean }
type MyEventsMap = {
  myEventName: [MyEvent]
  // ^ Values can also be defined as `(e: MyEvent) => void`, or as just `MyEvent`.
  // Approach to this varies from lib to lib, we're trying to support them all.
}

const useMyEvent = createUseEvent<MyEventsMap>()
const emitter = new EventEmitter<MyEventsMap>()
...
useMyEvent(emitter, 'myEventName', e => cb(e.foo))
// ^ now TS will know that event name is strictly `keyof MyEventsMap`,
// and will properly infer event type as `MyEvent`.
```

If your emitter supports some special listener options, they also can be defined:

```ts
const useMyEvent = createUseEvent<MyEventsMap, { myOption?: string }>()
...
useMyEvent(emitter, 'myEventName', cb, { myOption: 'some' })
// ^ will execute as `emitter.on('myEventName', cb, { myOption: 'some' })`
```

> _When defining custom options, keys `enabled` and `filter` are reserved. Those are hook own options and can't be
re-defined._
---

#### Partial application of `target` param

Sometimes you may have a shared emitter instance, living in React context or wherever else. It would be natural to
create a hook which accesses that emitter under the hood, so you don't have to write repetitive boilerplate. But also
you don't want to lose types inference for event names, types and options.

To achieve this, call `createUseEvent` with a callback that returns an emitter instance:

```ts
const useMyEmitterEvents = createUseEvent<MyEventsMap>(() => emitter)
...
useMyEmitterEvents('eventName', cb, options)
```

Callback is executed as a hook on its own, so you can do whatever you need there:

```ts
const useMyEmitter = () => React.useContext(MyContext).emitter
const useMyEmitterEvent = createUseEvent<MyEventsMap>(useMyEmitter)
...
useMyEmitterEvent('eventName', cb)
```

Real-life example:

```ts
const useWindowEvent = createUseEvent<
  WindowEventMap,
  AddEventListenerOptions
>(() => window)
...
useWindowEvent('keypress', cb, {
  capture: true,
  filter: e => e.key === 'Escape',
})
```

## API

### `useEvent(emitter, type, listener, options?)`
### `useEvent(emitter, listeners, options?)`

| Argument | Type                                                                                            | Required | Description                                                                                                                                               
| -------- |-------------------------------------------------------------------------------------------------| -------- |-----------------------------------------------------------------------------------------------------------------------------------------------------------|  
| target   | <code>React.RefObject&lt;T&gt; &#124; T &#124; null</code>                                      | Yes       | Target to attach the event listener to.                                                                                                                   
| type     | <code>string &#124; string[]</code>                                                             | Yes       | _(overload 1)_ The type of event to listen for.                                                                                                           |  
| listener | `(e: InferredEvent) => any`                                                                     | Yes       | _(overload 1)_ The callback invoked when the event type fires.                                                                                            
| listeners       | `Record<string, (event: E) => any>`                                                          | Yes      | _(overload 2)_ Replace `type` and `listener` with a set of listeners, allowing to assign multiple different handlers with one call.                       |      
| options  | `InferredEventOptions`                                                                          | No        | Whatever listener options the particular event emitter provides.                                                                                          |                                                                                                                                                   
| options.enabled | `boolean                                                                                      ` | No | Allows to cancel event subscription without unmounting component.                                                                                         
| options.filter | `(event: InferredEvent) => boolean`                                                             | No | Return `false` to prevent callback execution. Allows for a cleaner functional-style approach to conditional logic, with callback and predicate separated. 

### `createUseEvent<EventsMap, ListenerOptions?>(useTarget?)`

| Argument | Type                                                                                         | Required | Description                                                                                                                                                                                       
| -------- |----------------------------------------------------------------------------------------------| -------- | ------------- |  
| useTarget | <code>() => React.RefObject&lt;Emitter&gt; &#124; Emitter &#124; null</code> | no | Hook providing emitter intance to subscribe to. With this otion used, will create a version of `useEvent` with `target` parameter omitted. |
