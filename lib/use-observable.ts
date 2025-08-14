import { Observable, isObservable } from 'rxjs';
import { useEffect, useState } from 'react';


/**
 * 
 *
 */
export function useObservable<ObservableValue, ObservableError = unknown>(
  observable: Observable<ObservableValue>,
  opts: {
    initialValue: ObservableValue,
    onComplete?: (currentValue: ObservableValue, currentError?: ObservableError) => void,
    onUnsubscribe?: (currentValue: ObservableValue, currentError?: ObservableError) => void,
  }
): [ObservableValue, ObservableError | undefined] {
  const [value, setValue] = useState<ObservableValue>(opts.initialValue);
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
        opts.onComplete?.(value, error);
      }
    });
    return () => {
      subscription.unsubscribe();
      opts.onUnsubscribe?.(value, error);
    }
  }, [observable]);

  return [value, error]
}
