import { toJsWithComputeds } from './to-js-with-computeds';
import { makeAutoObservable } from 'mobx';
import { expect, test } from 'vitest';

class Store {
  count = 0;

  constructor() {
    makeAutoObservable(this);
  }

  increment() {
    this.count++;
  }

  get isEven() {
    return this.count % 2 === 0;
  }

  get isOdd() {
    return !this.isEven;
  }
}

test('toJsWithComputed and class', () => {
  const store = new Store();
  expect(toJsWithComputeds(store)).toStrictEqual({
    count: 0,
    isEven: true,
    isOdd: false,
  });
  store.increment();
  expect(toJsWithComputeds(store)).toStrictEqual({
    count: 1,
    isEven: false,
    isOdd: true,
  });
});

class StoreWithException {
  constructor() {
    makeAutoObservable(this);
  }

  get isEven() {
    throw new Error('I always throw');
  }
}

test('toJsWithComputed and an exception', () => {
  const store = new StoreWithException();
  expect(toJsWithComputeds(store)).toStrictEqual({ isEven: '*Exception*' });
});
