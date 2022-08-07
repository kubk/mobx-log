import { toJsWithComputeds } from './to-js-with-computeds';
import { makeAutoObservable } from 'mobx';

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

test('toJS with computed', () => {
  const store = new Store();

  expect(toJsWithComputeds(store)).toStrictEqual({ count: 0, isEven: true, isOdd: false, });
  store.increment();
  expect(toJsWithComputeds(store)).toStrictEqual({ count: 1, isEven: false, isOdd: true });
});
