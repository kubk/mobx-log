export type LogWriter = {
  write: (...messages: unknown[]) => void;
};

export class DefaultLogWriter implements LogWriter {
  write(...messages: unknown[]) {
    console.log(...messages);
  }
}

export class CollectingLogWriter implements LogWriter {
  history: string[] = [];

  write(...messages: unknown[]) {
    const strings = messages.map((message): string =>
      (message as any).toString()
    );
    this.history.push(strings.join(' '));
  }

  clear() {
    this.history = [];
  }
}
