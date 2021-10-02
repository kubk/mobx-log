import { ActionEvent, ComputedEvent, Logger, ObservableEvent } from './types';
import { LogWriter } from './log-writer';

const colors = {
  red: '#FF6157',
  blue: '#28B7F6',
  orange: '#FFBC2D',
  green: '#2BC941',
};

export class DefaultLogger implements Logger {
  constructor(private logWriter: LogWriter) {}

  logObservable(event: ObservableEvent) {
    const info = [
      '%c[O]',
      `color:${colors.orange}`,
      event.name,
      event.oldValue,
      '->',
      event.newValue,
    ];

    this.logWriter.write(...info);
  }

  logAction(event: ActionEvent) {
    const formattedArguments =
      event.arguments.length > 0
        ? '%o '.repeat(event.arguments.length).slice(0, -1)
        : '';

    const info: unknown[] = [
      `%c[A]%c ${event.name}(${formattedArguments})`,
      `color:${colors.red}`,
      'color:inherit',
      ...event.arguments,
    ];

    this.logWriter.write(...info);
  }

  logComputed(event: ComputedEvent) {
    const info = [
      '%c[C]',
      `color:${colors.blue}`,
      event.name,
      event.oldValue,
      '->',
      event.newValue,
    ];

    this.logWriter.write(...info);
  }
}
