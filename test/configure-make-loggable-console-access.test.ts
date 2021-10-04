import { makeAutoObservable } from 'mobx';
import { DefaultLogger } from '../src';
import { configureMakeLoggable, makeLoggable } from '../src';
import { CollectingLogWriter } from '../src/log-writer';

configureMakeLoggable({
  logger: new DefaultLogger(new CollectingLogWriter()),
  storeConsoleAccess: true,
});

class Counter {
  value = 0;

  constructor() {
    makeAutoObservable(this);
    makeLoggable(this);
  }

  increment() {
    this.value++;
  }
}

class Todo {
  isDone = false;

  constructor() {
    makeAutoObservable(this);
    makeLoggable(this);
  }

  complete() {
    this.isDone = true;
  }
}

describe('configureMakeLoggable', () => {
  it('storeConsoleAccess', () => {
    new Counter();
    new Todo();

    expect(window.store).toBeTruthy();
    expect(window.store).toHaveProperty('counter');
    expect(window.store).toHaveProperty('todo');
    expect(typeof window.store!['todo'] === 'object').toBeTruthy();
    expect(Object.keys(window.store!)).toHaveLength(2);

    new Todo();

    expect(Object.keys(window.store!)).toHaveLength(2);
    expect(Array.isArray(window.store!['todo'])).toBeTruthy();
    expect(window.store!['todo']).toHaveLength(2);
  });
});
