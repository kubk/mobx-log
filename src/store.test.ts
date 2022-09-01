import { configureLogger, makeLoggable } from '../src';
import { makeAutoObservable } from 'mobx';
import { getStoreName, isStore } from './store';

configureLogger();

export const createCounterStore = () => {
  return makeLoggable(
    makeAutoObservable({
      loggableName: 'counter',
      count: 0,
      increment() {
        this.count++;
      },
    })
  );
};

class CounterStore {
  count = 0;

  constructor() {
    makeAutoObservable(this);
  }

  increment() {
    this.count++;
  }
}

describe('Store', () => {
  it('getStoreType detects type', () => {
    expect(isStore(createCounterStore())).toBeTruthy();
    expect(getStoreName(createCounterStore())).toBe('counter');

    expect(isStore(new CounterStore())).toBeTruthy();
    expect(getStoreName(new CounterStore())).toBe('CounterStore');
  });
});
