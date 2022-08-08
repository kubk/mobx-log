import { makeAutoObservable } from 'mobx';
import { configureLogger, makeLoggable, DefaultLogger } from '../src';
import { CollectingLogWriter } from '../src/browser-logger/log-writer';

const collectingWriter = new CollectingLogWriter();

process.env.NODE_ENV = 'production';

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

describe('configureLogger', () => {
  it('does not log in production', () => {
    const storeOnlyObservables = new StoreOnlyObservables();
    storeOnlyObservables.init();

    expect(collectingWriter.history).toHaveLength(0);
  });
});
