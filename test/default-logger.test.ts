import { DefaultLogger } from '../src/default-logger';
import { CollectingLogWriter } from '../src/collecting-log-writer';

describe('DefaultLogger', () => {
  it('logs observable', () => {
    const logWriter = new CollectingLogWriter();
    const plainLogger = new DefaultLogger(logWriter, () => '14:34:57');

    plainLogger.logObservable({
      name: 'age',
      oldValue: 23,
      newValue: 24,
    });

    expect(logWriter.history).toMatchSnapshot();

    plainLogger.debug = true;

    plainLogger.logObservable({
      name: 'age',
      oldValue: 24,
      newValue: 25,
    });

    expect(logWriter.history).toMatchSnapshot();
  });

  it('logs computed', () => {
    const logWriter = new CollectingLogWriter();
    const plainLogger = new DefaultLogger(logWriter, () => '14:34:57');

    plainLogger.logComputed({
      name: 'isEven',
      oldValue: true,
      newValue: false,
    });

    expect(logWriter.history).toMatchSnapshot();
  });

  it('logs action', () => {
    const logWriter = new CollectingLogWriter();
    const plainLogger = new DefaultLogger(logWriter, () => '14:34:57');

    plainLogger.logAction({
      name: 'add',
      arguments: [1],
    });

    expect(logWriter.history).toMatchSnapshot();
  });
});
