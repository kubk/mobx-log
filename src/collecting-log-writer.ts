import { LogWriter } from './types';

export class CollectingLogWriter implements LogWriter {
  history: string[] = [];

  write(...messages: unknown[]) {
    const strings = messages.map((message): string =>
      (message as any).toString()
    );
    this.history.push(strings.join(' '));
  }
}
