import { makeAutoObservable } from 'mobx';
import { DefaultLogger } from '../src';
import { configureMakeLoggable, makeLoggable } from '../src';
import { CollectingLogWriter } from '../src/log-writer';

const collectingWriter = new CollectingLogWriter();

configureMakeLoggable({
  logger: new DefaultLogger(collectingWriter, () => '13:13:13'),
  condition: false,
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

describe('makeLoggable - condition false', () => {
  it('logs', async done => {
    const storeOnlyObservables = new StoreOnlyObservables();
    storeOnlyObservables.init();

    expect(collectingWriter.history).toHaveLength(0);

    done();
  });
});
