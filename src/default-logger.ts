import {
  ActionEvent,
  ComputedEvent,
  Logger,
  LogWriter,
  Now,
  ObservableEvent,
} from './types';

export class DefaultLogger implements Logger {
  constructor(private logWriter: LogWriter, private now: Now) {}

  logObservable(event: ObservableEvent): void {
    this.logWriter.write(
      this.now(),
      'OBSERVABLE',
      event.name,
      event.oldValue,
      '->',
      event.newValue
    );
  }

  logAction(event: ActionEvent): void {
    this.logWriter.write(this.now(), 'ACTION', event.name, event.arguments);
  }

  logComputed(event: ComputedEvent): void {
    this.logWriter.write(
      this.now(),
      'COMPUTED',
      event.name,
      event.oldValue,
      '->',
      event.newValue
    );
  }
}
