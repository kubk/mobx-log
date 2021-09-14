import { autorun, makeAutoObservable } from 'mobx';
import { DefaultLogger } from '../src/default-logger';
import { CollectingLogWriter } from '../src/collecting-log-writer';
import { configureMakeLoggable, makeLoggable } from '../src';

const collectingWriter = new CollectingLogWriter();

configureMakeLoggable({
  logger: new DefaultLogger(collectingWriter, () => '13:13:13'),
});

class StoreWithComputed {
  value = 0;

  constructor() {
    makeAutoObservable(this);
    makeLoggable(this);
  }

  increment() {
    this.value++;
  }

  get isDividedBy3() {
    return this.value % 3 === 0;
  }
}

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

class StoreWithoutLog {
  counter = 1;

  constructor() {
    makeAutoObservable(this);
  }

  increment() {
    this.counter++;
  }

  get isEven() {
    return this.counter % 2 === 0;
  }
}

describe('makeLoggable', () => {
  it('logs', async (done) => {
    const storeWithComputed = new StoreWithComputed();
    const storeOnlyObservables = new StoreOnlyObservables();
    const storeWithoutLog = new StoreWithoutLog();

    let isDividedBy3 = false;
    let isEven = false;
    autorun(() => {
      isDividedBy3 = storeWithComputed.isDividedBy3;
      isEven = storeWithoutLog.isEven;
    });

    storeWithoutLog.increment();
    storeWithComputed.increment();
    storeOnlyObservables.init();
    expect(isDividedBy3).toBeFalsy();
    expect(isEven).toBeTruthy();
    expect(storeWithComputed.value).toBe(1);
    expect(collectingWriter.history).toMatchSnapshot();

    storeWithComputed.increment();
    storeWithComputed.increment();

    expect(collectingWriter.history).toMatchSnapshot();

    done();
  });
});
