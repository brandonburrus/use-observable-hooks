import { useObservable } from '../lib/use-observable';
import { renderHook, cleanup } from '@testing-library/react';
import { of, delay, EMPTY } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

describe('useObservable', () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    })
  });

  afterEach(cleanup);

  test('initializes with an initial value as the state', () => {
    const { result } = renderHook(() => useObservable(
      of(1).pipe(delay(1)),
      { initialValue: 0 }
    ));
    expect(result.current[0]).toBe(0);
  })

  test('value of observable is correctly returned as state', () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useObservable(
      of('test'),
      { initialValue: 'initial' }
    ));

    expect(result.current[0]).not.toBe('initial');
    expect(result.current[0]).toBe('test');
  })

  test('onComplete callback is called when observable completes', () => {
    const onComplete = jest.fn();
    const { result } = renderHook(() => useObservable(
      EMPTY,
      { initialValue: 'state', onComplete }
    ));

    expect(onComplete).toHaveBeenCalledWith('state', undefined);
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(result.current[0]).toBe('state');
  })

  test('onUnsubscribe callback is called when observable is unsubscribed', () => {
    const onUnsubscribe = jest.fn();
    const { result, unmount } = renderHook(() => useObservable(
      EMPTY,
      { initialValue: 'state', onUnsubscribe }
    ));

    unmount();
    expect(onUnsubscribe).toHaveBeenCalledWith('state', undefined);
    expect(onUnsubscribe).toHaveBeenCalledTimes(1);
    expect(result.current[0]).toBe('state');
  })
})
