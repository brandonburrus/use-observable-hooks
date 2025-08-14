# use-observable

## Installation

```
npm install use-observable-hooks
```

## Usage

### useObservable

useObservable takes an observable as an argument and returns a tuple of the current value and (possible) error

```typescript
import { useObservable } from 'use-observable-hooks';
import { interval } from 'rxjs';

function MyComponent() {
  const [counter, error] = useObservable(interval(1_000));

  return <div>Counter: {counter}</div>;
}
```

You can pass an optional second argument to specify an initial values:
```typescript
import { useObservable } from 'use-observable-hooks';
import { interval } from 'rxjs';

function MyComponent() {
  const [counter] = useObservable(interval(1_000), {
    initialValue: 0,
  });

  return <div>Counter: {counter}</div>;
}
```
NOTE: When using typescript, the types are written in a way that the state value to be potentially undefined,
unless an initial value is provided then the type will be the type of the initial value.

You can also pass callbacks to respond to observable events:
```typescript
import { useObservable } from 'use-observable-hooks';
import { interval, take } from 'rxjs';

function MyComponent() {
  const [counter, error] = useObservable(interval(1_000).pipe(take(3)), {
    initialValue: 0,
    onComplete: (value, err) => console.log('Observable completed'),
    onUnsubscribe: (value, err) => console.log('Unsubscribed'),
  });

  return <div>Counter: {counter}</div>;
}
```

Both `onComplete` and `onUnsubscribe` callbacks receive the latest value and error as parameters.


## Contributing

PRs welcome :)

