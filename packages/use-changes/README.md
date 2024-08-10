# @nwbm/use-changes

Pack of hooks for convenient values comparison.

## Installation

```sh
npm install @nwbm/use-changes
```

## Available hooks

### [useOnChange](/packages/use-changes/docs/useOnChange.md)

Execute callback when the given value has changed, accordingly to given comparator logic.

### [useChanged](/packages/use-changes/docs/useChanged.md)

Returns new value of given one only if it has changed, accordingly to given comparator logic.

### [useChanges](/packages/use-changes/docs/useChanges.md)

Low-level hook, returning "meta" data about the comparison: current value, previous value, and whether the value has changed.
