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

  logObservable(event: ObservableEvent): void {
    if (event.type === 'update') {
      const info: unknown[] = [
        '%c[O]',
        `color:${colors.orange}`,
        event.name,
        event.oldValue,
        '->',
        event.newValue,
      ];

      this.logWriter.write(...info);
    }

    if (event.type === 'array') {
      const info: unknown[] = [
        '%c[O]',
        `color:${colors.orange}`,
        event.name,
        'has changed.',
      ];

      if (event.removed?.length) {
        info.push('Removed: ', event.removed);
      }
      if (event.added?.length) {
        info.push('Added: ', event.added);
      }

      this.logWriter.write(...info);
    }

    if (event.type === 'map') {
      const info: unknown[] = ['%c[O]', `color:${colors.orange}`, event.name];

      if (event.mapType === 'add') {
        info.push('- added', event.key, ':', event.value);
      }
      if (event.mapType === 'delete') {
        info.push('- deleted', event.key);
      }
      if (event.mapType === 'update') {
        info.push(
          '- updated',
          event.key,
          'value',
          event.oldValue,
          '->',
          event.value
        );
      }

      this.logWriter.write(...info);
    }

    if (event.type === 'set') {
      const info: unknown[] = ['%c[O]', `color:${colors.orange}`, event.name];

      if (event.setType === 'add') {
        info.push('- added', event.value);
      }
      if (event.setType === 'delete') {
        info.push('- removed', event.value);
      }

      this.logWriter.write(...info);
    }
  }

  logAction(event: ActionEvent): void {
    const formattedArguments =
      event.arguments.length > 0
        ? '%o, '.repeat(event.arguments.length).slice(0, -2)
        : '';

    const info: unknown[] = [
      `%c[A]%c ${event.name}(${formattedArguments})`,
      `color:${colors.red}`,
      'color:inherit',
      ...event.arguments,
    ];

    this.logWriter.write(...info);
  }

  logComputed(event: ComputedEvent): void {
    const info: unknown[] = [
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
