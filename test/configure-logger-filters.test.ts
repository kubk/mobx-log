import { autorun, makeAutoObservable } from 'mobx';
import { configureLogger, DefaultLogger, makeLoggable } from '../src';
import { CollectingLogWriter } from '../src/browser-logger/log-writer';

const logWriter = new CollectingLogWriter();

configureLogger({
  logger: new DefaultLogger(logWriter),
  storeConsoleAccess: true,
  filters: {
    observables: false,
    actions: false,
    computeds: true,
  },
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

  get isEven() {
    return this.value % 2 === 0;
  }
}

describe('configureLogger - filters', () => {
  it('respects filters', () => {
    const c = new Counter();

    let isEven;
    autorun(() => {
      isEven = c.isEven;
    });

    c.increment();
    c.increment();

    expect(logWriter.history).toMatchSnapshot();
  });
});
