import { Observable, isObservable } from 'rxjs';
import { useEffect, useState } from 'react';

/**
 * useObservable hook for translating the output of an RxJS Observable into React state.
 * @param observable - The RxJS Observable to subscribe to.
 * @param opts - Optional configuration object with the following properties:
 *   - initialValue: The initial state value to use before the observable emits its first value.
 *   - onComplete: A callback function that is called when the observable completes, receiving the current value and error.
 *   - onUnsubscribe: A callback function that is called when the observable is unsubscribed, receiving the current value and error.
 *
 * @returns A tuple of `[value, err]` containing the current value of the observable and 
 * any error that may have occurred.
 *
 * @example
 * import { useObservable } from 'use-observable-hooks';
 *
 * const [value, error] = useObservable(
 *   interval(1_000).pipe(map(i => i * 2), take(5)),
 *   {
 *     initialValue: 0,
 *     onComplete: (currentValue, currentError) => { console.log('completed'); },
 *     onUnsubscribe: (currentValue, currentError) => { console.log('unsubscribed'); },
 *   }
 * );
 */
export function useObservable<ObservableValue, ObservableError = unknown>(
  observable: Observable<ObservableValue>,
  opts?: {
    initialValue?: ObservableValue,
    onComplete?: (currentValue: ObservableValue, currentError?: ObservableError) => void,
    onUnsubscribe?: (currentValue: ObservableValue, currentError?: ObservableError) => void,
  }
): [ObservableValue | undefined, ObservableError | undefined]
export function useObservable<ObservableValue, ObservableError = unknown>(
  observable: Observable<ObservableValue>,
  opts: {
    initialValue: ObservableValue,
    onComplete?: (currentValue: ObservableValue, currentError?: ObservableError) => void,
    onUnsubscribe?: (currentValue: ObservableValue, currentError?: ObservableError) => void,
  }
): [ObservableValue, ObservableError | undefined]
export function useObservable<ObservableValue, ObservableError = unknown>(
  observable: Observable<ObservableValue>,
  opts?: {
    initialValue?: ObservableValue,
    onComplete?: (currentValue: ObservableValue, currentError?: ObservableError) => void,
    onUnsubscribe?: (currentValue: ObservableValue, currentError?: ObservableError) => void,
  }
): [ObservableValue | undefined, ObservableError | undefined] {
  const [value, setValue] = useState<ObservableValue>(opts?.initialValue as ObservableValue);
  const [error, setError] = useState<ObservableError | undefined>();

  useEffect(() => {
    if (!isObservable(observable)) {
      throw new Error(`Expected observable, received unexpected ${observable} instead`);
    }
    const subscription = observable.subscribe({
      next: (nextValue: ObservableValue) => {
        setValue(nextValue);
        setError(undefined);
      },
      error: (err: ObservableError) => {
        setError(err);
      },
      complete: () => {
        opts?.onComplete?.(value, error);
      }
    });
    return () => {
      subscription.unsubscribe();
      opts?.onUnsubscribe?.(value, error);
    }
  }, [observable]);

  return [value, error]
}
