import { LogWriter } from './types';

export class DefaultLogWriter implements LogWriter {
  write(...messages: unknown[]) {
    console.log(...messages);
  }
}
