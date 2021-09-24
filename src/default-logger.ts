import { ActionEvent, ComputedEvent, Logger, ObservableEvent } from './types';
import { LogWriter } from './log-writer';

const colors = {
  red: '#FF6157',
  blue: '#28B7F6',
  orange: '#FFBC2D',
  green: '#2BC941',
};

const buildStyles = (color: string) => `color:${color}`;

export class DefaultLogger implements Logger {
  constructor(private logWriter: LogWriter) {}

  logObservable(event: ObservableEvent) {
    const info = [
      '%c[O]',
      buildStyles(colors.orange),
      event.name,
      event.oldValue,
      '->',
      event.newValue,
    ];

    this.logWriter.write(...info);
  }

  logAction(event: ActionEvent) {
    const info = [
      '%c[A]',
      buildStyles(colors.red),
      event.name,
      event.arguments,
    ];

    this.logWriter.write(...info);
  }

  logComputed(event: ComputedEvent) {
    const info = [
      '%c[C]',
      buildStyles(colors.blue),
      event.name,
      event.oldValue,
      '->',
      event.newValue,
    ];

    this.logWriter.write(...info);
  }
}
