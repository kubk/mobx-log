import { CollectingLogWriter } from './log-writer';
import { DefaultLogger } from './default-logger';
import { describe, expect, it } from 'vitest';

describe('DefaultLogger', () => {
  it('logs observable', () => {
    const logWriter = new CollectingLogWriter();
    const plainLogger = new DefaultLogger(logWriter);

    plainLogger.logObservable({
      type: 'update',
      name: 'age',
      oldValue: 23,
      newValue: 24,
    });

    expect(logWriter.history).toMatchSnapshot();
  });

  it('logs computed', () => {
    const logWriter = new CollectingLogWriter();
    const plainLogger = new DefaultLogger(logWriter);

    plainLogger.logComputed({
      name: 'isEven',
      oldValue: true,
      newValue: false,
    });

    expect(logWriter.history).toMatchSnapshot();
  });

  it('logs action', () => {
    const logWriter = new CollectingLogWriter();
    const plainLogger = new DefaultLogger(logWriter);

    plainLogger.logAction({
      name: 'add',
      arguments: [1],
    });

    expect(logWriter.history).toMatchSnapshot();
  });
});
