import { autorun, makeAutoObservable } from 'mobx';
import { configureLogger, makeLoggable, DefaultLogger } from '../src';
import { CollectingLogWriter } from '../src/browser-logger/log-writer';

describe('config for production', () => {
  const previousEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production'

  const collectingWriter = new CollectingLogWriter();

  configureLogger({
    logger: new DefaultLogger(collectingWriter),
  });

  class StoreOnlyObservables {
    age?: number;
    name?: string;

    constructor() {
      makeAutoObservable(this);
      makeLoggable(this);
    }

    init() {
      this.age = 24;
      this.name = 'Test';
    }
  }

  it('does not log in production', () => {
    const storeOnlyObservables = new StoreOnlyObservables();
    storeOnlyObservables.init();

    expect(collectingWriter.history).toHaveLength(0);
    process.env.NODE_ENV = previousEnv;
  });
});

describe('config - filters', () => {
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

describe('config - console access', () => {
  configureLogger({
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
    expect(typeof window.store!['todo'] === 'object').toBeTruthy();
    expect(Object.keys(window.store!['todo'])).toHaveLength(1);
  });
})
